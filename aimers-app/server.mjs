import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdirSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {handleApi} from './src/api.mjs';
import {createAI} from './src/ai.mjs';
import {loadEnvFile} from 'node:process';
const root=path.dirname(fileURLToPath(import.meta.url));
if(existsSync(path.join(root,'.env')))loadEnvFile(path.join(root,'.env'));
const ai=createAI({apiKey:process.env.DEEPSEEK_API_KEY,model:process.env.DEEPSEEK_MODEL||'deepseek-flash'});
const dir=process.env.AIMERS_DATA_DIR||path.join(root,'.data');mkdirSync(dir,{recursive:true});
const sqlite=new DatabaseSync(path.join(dir,'aimers.sqlite'));sqlite.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
sqlite.exec(readFileSync(path.join(root,'drizzle/0000_aimers.sql'),'utf8'));
if(!sqlite.prepare('PRAGMA table_info(users)').all().some(c=>c.name==='start_date')){
 sqlite.exec('BEGIN');try{sqlite.exec(readFileSync(path.join(root,'drizzle/0001_profiles.sql'),'utf8'));sqlite.exec('COMMIT');}catch(e){sqlite.exec('ROLLBACK');throw e;}
}
const localIdentity=sid=>'local-'+createHash('sha256').update(sid).digest('hex');
// Keep existing browser cookies working without exposing their bearer value as a public user ID.
for(const user of sqlite.prepare("SELECT id FROM users WHERE id LIKE 'local-%'").all()){
 if(!/^local-[a-f0-9-]{36}$/.test(user.id))continue;
 const id=localIdentity(user.id.slice(6));sqlite.exec('BEGIN');
 try{for(const [table,column]of [['users','id'],['entries','user_id'],['categories','user_id'],['groups','owner_id'],['members','user_id'],['notifications','user_id'],['notifications','actor_id']])sqlite.prepare('UPDATE '+table+' SET '+column+'=? WHERE '+column+'=?').run(id,user.id);sqlite.exec('COMMIT');}catch(e){sqlite.exec('ROLLBACK');throw e;}
}
export const db={
 get:async(sql,args=[])=>sqlite.prepare(sql).get(...args),
 all:async(sql,args=[])=>sqlite.prepare(sql).all(...args),
 run:async(sql,args=[])=>sqlite.prepare(sql).run(...args),
 batch:async(items)=>{sqlite.exec('BEGIN');try{for(const [sql,args]of items)sqlite.prepare(sql).run(...args);sqlite.exec('COMMIT');}catch(e){sqlite.exec('ROLLBACK');throw e;}}
};
const port=Number(process.env.PORT||4173);
const allowedHosts=new Set(['127.0.0.1:'+port,'localhost:'+port]);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{
 try{
 if(!allowedHosts.has(req.headers.host)){res.writeHead(403);res.end('Local preview only');return;}
 const url=new URL(req.url,'http://'+req.headers.host);
 if(url.pathname.startsWith('/api/')){
  let sid=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('aimers_session='))?.slice(15);
  // A random, persistent browser session is local preview identity, not production authentication.
  if(!sid||!/^[a-f0-9-]{36}$/.test(sid)){sid=randomUUID();res.setHeader('set-cookie','aimers_session='+sid+'; HttpOnly; SameSite=Strict; Path=/; Max-Age=31536000');}
  let bytes=0,chunks=[];
  for await(const chunk of req){bytes+=chunk.length;if(bytes>300000){res.writeHead(413);res.end('Request too large');return;}chunks.push(chunk);}
  const headers=new Headers();for(const [k,v]of Object.entries(req.headers))if(typeof v==='string'&&!k.startsWith('oai-authenticated-user-'))headers.set(k,v);
  const request=new Request(url,{method:req.method,headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)});
  const response=await handleApi(request,db,localIdentity(sid),{demo:true,ai});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
 }
 const name=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\//,'');
 const file=path.resolve(root,'public',name);
 if(!file.startsWith(path.join(root,'public')+path.sep)||!existsSync(file)){res.writeHead(404);res.end('Not found');return;}
 res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-cache','x-content-type-options':'nosniff'});
 res.end(readFileSync(file));
 }catch{res.writeHead(500);res.end('Server error');}
});
server.listen(port,'127.0.0.1',()=>console.log('Aimers is running at http://127.0.0.1:'+port));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{sqlite.close();process.exit(0);}));
