import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:net';
import {once} from 'node:events';
test('existing SQLite profiles and cookies migrate once without revealing session bearer IDs',async()=>{
 const root=fileURLToPath(new URL('..',import.meta.url)),tempRoot=path.resolve(tmpdir()),dir=await mkdtemp(path.join(tempRoot,'aimers-test-'));
 const cookie='12345678-1234-4321-1234-123456789abc',legacy='local-'+cookie;
 const sql=new DatabaseSync(path.join(dir,'aimers.sqlite'));sql.exec(await readFile(path.join(root,'drizzle/0000_aimers.sql'),'utf8'));
 sql.prepare('INSERT INTO users(id,name,created_at) VALUES(?,?,?)').run(legacy,'Existing user','2026-01-01T00:00:00Z');sql.close();
 let firstId;
 try{for(let attempt=0;attempt<2;attempt++){
  const probe=createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
  const child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:String(port),AIMERS_DATA_DIR:dir,AIMERS_DEMO:'1'},stdio:['ignore','pipe','pipe'],windowsHide:true});
  try{
   await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Startup timeout')),10000);child.stdout.on('data',chunk=>{if(String(chunk).includes('Aimers is running')){clearTimeout(timer);resolve();}});child.once('exit',code=>{clearTimeout(timer);reject(Error('Server exited '+code));});});
   const response=await fetch('http://127.0.0.1:'+port+'/api/state',{headers:{cookie:'aimers_session='+cookie}});assert.equal(response.status,200);
   const state=await response.json();assert.equal(state.me.name,'Existing user');assert.equal(state.me.start_date,'2026-01-01');assert.equal(state.me.id.includes(cookie),false);
   if(firstId)assert.equal(state.me.id,firstId);firstId=state.me.id;
   assert.equal((await fetch('http://127.0.0.1:'+port+'/.env')).status,404);
  }finally{if(child.exitCode===null){const exited=once(child,'exit');child.kill();await exited;}}
 }}finally{
  if(path.dirname(path.resolve(dir))!==tempRoot||!path.basename(dir).startsWith('aimers-test-'))throw Error('Unexpected cleanup path');
  await rm(dir,{recursive:true,force:true});
 }
});
