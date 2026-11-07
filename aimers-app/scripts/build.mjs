import {readFile,mkdir,writeFile} from 'node:fs/promises';
const api=(await readFile('src/periods.mjs','utf8'))+'\n'+(await readFile('src/ai.mjs','utf8'))+'\n'+(await readFile('src/api.mjs','utf8')).replace("import {recordingProgress,validDate} from './periods.mjs';",'');
const assets={};for(const [name,type]of [['index.html','text/html'],['style.css','text/css'],['app.js','text/javascript'],['favicon.svg','image/svg+xml']])assets[name]={body:await readFile('public/'+name,'utf8'),type};
assets['fonts/PretendardVariable.woff2']={body:(await readFile('public/fonts/PretendardVariable.woff2')).toString('base64'),type:'font/woff2',binary:true};
assets['fonts/OFL.txt']={body:await readFile('public/fonts/OFL.txt','utf8'),type:'text/plain'};
const worker=api+'\nconst assets='+JSON.stringify(assets)+';\n'+`
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/')){
 const identity=request.headers.get('oai-authenticated-user-id');
 if(!env.DB)return json({error:'데이터베이스 연결이 필요해요.'},503);
 const db={get:(s,a=[])=>env.DB.prepare(s).bind(...a).first(),all:async(s,a=[])=>{const r=await env.DB.prepare(s).bind(...a).all();return r.results;},run:(s,a=[])=>env.DB.prepare(s).bind(...a).run(),batch:items=>env.DB.batch(items.map(([s,a])=>env.DB.prepare(s).bind(...a)))};
 return handleApi(request,db,identity,{ai:createAI({apiKey:env.DEEPSEEK_API_KEY,model:env.DEEPSEEK_MODEL||'deepseek-flash'})});
 }
 const file=assets[url.pathname==='/'?'index.html':url.pathname.slice(1)];
 return file?new Response(file.binary?Uint8Array.from(atob(file.body),c=>c.charCodeAt(0)):file.body,{headers:{'content-type':file.type+(file.binary?'':'; charset=utf-8'),'x-content-type-options':'nosniff'}}):new Response('Not found',{status:404});
}};
`;
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/index.js',worker);await writeFile('dist/.openai/hosting.json',await readFile('.openai/hosting.json'));
console.log('Built self-contained Worker with '+Object.keys(assets).length+' assets.');
