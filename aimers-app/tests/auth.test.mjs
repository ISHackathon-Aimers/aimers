import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createAuth,verifyGoogleToken,tokenHash} from '../src/auth.mjs';
const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const jwk={...await crypto.subtle.exportKey('jwk',pair.publicKey),kid:'test-google-key',alg:'RS256',use:'sig'};
const clock=Date.now(),encode=value=>Buffer.from(typeof value==='string'?value:JSON.stringify(value)).toString('base64url');
async function token(overrides={}){
 const content=encode({alg:'RS256',kid:jwk.kid})+'.'+encode({iss:'https://accounts.google.com',aud:'client-id',sub:'google-user-a',email:'person@example.test',email_verified:true,name:'테스트',nonce:'nonce',iat:Math.floor(clock/1000),exp:Math.floor(clock/1000)+3600,...overrides});
 return content+'.'+Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,Buffer.from(content))).toString('base64url');
}
function fixture({demo=false,configured=true}={}){
 const sql=new DatabaseSync(':memory:');for(const migration of ['0000_aimers','0001_profiles','0002_record_workflows','0003_auth'])sql.exec(readFileSync(new URL('../drizzle/'+migration+'.sql',import.meta.url),'utf8'));
 const db={get:async(s,a=[])=>sql.prepare(s).get(...a),all:async(s,a=[])=>sql.prepare(s).all(...a),run:async(s,a=[])=>sql.prepare(s).run(...a),batch:async actions=>{sql.exec('BEGIN');try{for(const[s,a]of actions)sql.prepare(s).run(...a);sql.exec('COMMIT');}catch(e){sql.exec('ROLLBACK');throw e;}}};
 let flow,exchange=0;
 const auth=createAuth({db,clientId:configured?'client-id':'',clientSecret:configured?'private-client-secret':'',origin:'https://aimers.test',demo,now:()=>clock,fetchImpl:async(url,options)=>{
  if(url.endsWith('/certs'))return Response.json({keys:[jwk]});
  assert.equal(url,'https://oauth2.googleapis.com/token');exchange++;
  assert.equal(options.body.get('code_verifier'),flow.verifier);
  assert.equal(options.body.get('client_secret'),'private-client-secret');
  return Response.json({id_token:await token({nonce:flow.nonce})});
 }});
 const request=(path,method='GET',cookie='',body)=>new Request('https://aimers.test'+path,{method,headers:{origin:'https://aimers.test','content-type':'application/json',cookie},body:body===undefined?undefined:JSON.stringify(body)});
 async function login(){
  const start=await auth.handle(request('/api/auth/google?returnTo=%2F%23library')),url=new URL(start.headers.get('location'));
  assert.equal(url.origin,'https://accounts.google.com');assert.equal(url.searchParams.get('code_challenge_method'),'S256');
  const state=url.searchParams.get('state');flow=await db.get('SELECT * FROM oauth_states WHERE state_hash=?',[await tokenHash(state)]);
  const callback='/api/auth/google/callback?state='+state+'&code=valid-code',response=await auth.handle(request(callback,'GET','aimers_oauth='+state));
  assert.equal(response.status,302);assert.equal(response.headers.get('location'),'/#library');
  const sessionCookie=response.headers.getSetCookie().find(c=>c.startsWith('aimers_auth=')).split(';')[0];
  return {sessionCookie,state,callback,response};
 }
 return {auth,db,sql,request,login,get exchange(){return exchange;},close:()=>sql.close()};
}
test('Google signature, issuer, audience, expiry, verified email and nonce are validated',async()=>{
 const options={clientId:'client-id',nonce:'nonce',now:clock,fetchImpl:async()=>Response.json({keys:[jwk]})};
 assert.equal((await verifyGoogleToken(await token(),options)).email,'person@example.test');
 for(const overrides of [{iss:'https://attacker.test'},{aud:'other-client'},{nonce:'bad'},{exp:1},{email_verified:false},{iat:Math.floor(clock/1000)+600}]){const signed=await token(overrides);await assert.rejects(()=>verifyGoogleToken(signed,options));}
 // Avoid accepting a signed token after changing its payload without its signature.
 const valid=await token(),parts=valid.split('.');parts[1]=encode({sub:'attacker'});await assert.rejects(()=>verifyGoogleToken(parts.join('.'),options));
});
test('Google code flow stores hashed sessions, prevents state replay and revokes logout',async()=>{
 const f=fixture();try{
  const before=await f.auth.handle(f.request('/api/auth/session'));assert.equal((await before.json()).signedIn,false);
  const login=await f.login();assert.equal(f.exchange,1);
  assert(login.response.headers.getSetCookie().some(c=>c.includes('HttpOnly')&&c.includes('Secure')));
  const resolved=await f.auth.resolve(f.request('/api/state','GET',login.sessionCookie));assert.equal(resolved.account.provider,'google');
  assert.notEqual((await f.db.get('SELECT token_hash FROM auth_sessions')).token_hash,login.sessionCookie.split('=')[1]);
  assert.equal((await f.db.all('SELECT * FROM categories')).length,5);
  const replay=await f.auth.handle(f.request(login.callback,'GET','aimers_oauth='+login.state));assert(replay.headers.get('location').includes('authError'));assert.equal(f.exchange,1);
  const forged=await f.auth.handle(f.request('/api/auth/logout','POST',login.sessionCookie,{}));assert.equal(forged.status,200);
  assert.equal((await f.auth.resolve(f.request('/api/state','GET',login.sessionCookie))).identity,null);
 }finally{f.close();}
});
test('CSRF attempts, mismatched state and external return paths cannot authorize a session',async()=>{
 const f=fixture();try{
  const csrf=await f.auth.handle(new Request('https://aimers.test/api/auth/logout',{method:'POST',headers:{origin:'https://attacker.test','content-type':'application/json'},body:'{}'}));assert.equal(csrf.status,403);
  const callback=await f.auth.handle(f.request('/api/auth/google/callback?state=forged&code=x','GET','aimers_oauth=other'));assert(callback.headers.get('location').includes('authError'));assert.equal(f.exchange,0);
  const start=await f.auth.handle(f.request('/api/auth/google?returnTo=https://attacker.test'));const state=new URL(start.headers.get('location')).searchParams.get('state');assert.equal((await f.db.get('SELECT return_to FROM oauth_states WHERE state_hash=?',[await tokenHash(state)])).return_to,'/');
 }finally{f.close();}
});
test('returning Google users keep identity and deleting an account removes only its data',async()=>{
 const f=fixture();try{
  const first=await f.login(),a=await f.auth.resolve(f.request('/api/state','GET',first.sessionCookie));
  const second=await f.login(),b=await f.auth.resolve(f.request('/api/state','GET',second.sessionCookie));assert.equal(a.identity,b.identity);
  await f.db.run('INSERT INTO users(id,name,created_at) VALUES(?,?,?)',['other','Other',new Date(clock).toISOString()]);
  const response=await f.auth.handle(f.request('/api/auth/account','DELETE',second.sessionCookie,{confirm:'DELETE'}));assert.equal(response.status,200);
  assert.equal(await f.db.get('SELECT id FROM users WHERE id=?',[a.identity]),undefined);assert(await f.db.get('SELECT id FROM users WHERE id=?',['other']));
  assert.equal((await f.db.all('SELECT * FROM auth_sessions')).length,0);assert.equal((await f.db.all('SELECT * FROM categories')).length,0);
 }finally{f.close();}
});
test('demo identity is explicit, separate from Google identity and production defaults deny anonymous access',async()=>{
 const prod=fixture({configured:false}),demo=fixture({configured:false,demo:true});try{
  assert.equal((await prod.auth.resolve(prod.request('/api/state'))).identity,null);
  const response=await demo.auth.handle(demo.request('/api/auth/session'));assert.equal((await response.json()).account.provider,'demo');
  const cookie=response.headers.getSetCookie()[0].split(';')[0],first=await demo.auth.resolve(demo.request('/api/state','GET',cookie)),second=await demo.auth.resolve(demo.request('/api/state','GET',cookie));assert.equal(first.identity,second.identity);assert(first.identity.startsWith('local-'));
 }finally{prod.close();demo.close();}
});
test('expired sessions are rejected, all-device logout revokes every session and AI limits are per account',async()=>{
 const f=fixture();try{
  const first=await f.login(),second=await f.login();assert.equal((await f.db.all('SELECT * FROM auth_sessions')).length,2);
  const resolved=await f.auth.resolve(f.request('/api/state','GET',first.sessionCookie));
  for(let i=0;i<30;i++)assert.equal(await f.auth.allowAI(resolved.identity),true);
  assert.equal(await f.auth.allowAI(resolved.identity),false);assert.equal(await f.auth.allowAI('another-account'),true);
  const response=await f.auth.handle(f.request('/api/auth/sessions','DELETE',second.sessionCookie,{}));assert.equal(response.status,200);
  assert.equal((await f.auth.resolve(f.request('/api/state','GET',first.sessionCookie))).identity,null);
  const next=await f.login();await f.db.run('UPDATE auth_sessions SET expires_at=?',[clock-1]);
  assert.equal((await f.auth.resolve(f.request('/api/state','GET',next.sessionCookie))).identity,null);
 }finally{f.close();}
});
