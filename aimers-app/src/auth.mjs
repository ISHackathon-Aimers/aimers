const encoder=new TextEncoder();
const encode=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decode=value=>Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const random=()=>encode(crypto.getRandomValues(new Uint8Array(32)));
export const tokenHash=async value=>encode(await crypto.subtle.digest('SHA-256',encoder.encode(value)));
const cookies=request=>Object.fromEntries((request.headers.get('cookie')||'').split(';').map(s=>s.trim().split(/=(.*)/s).slice(0,2)).filter(([k,v])=>k&&v));
const authJson=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const authFailure=(message,status=400)=>Object.assign(new Error(message),{status});
let googleKeys={expires:0,keys:[]};

export async function verifyGoogleToken(token,{clientId,nonce,fetchImpl=fetch,now=Date.now()}={}){
 try{
  if(typeof token!=='string'||token.length>15000)throw Error();
  const parts=token.split('.');if(parts.length!==3)throw Error();
  const header=JSON.parse(new TextDecoder().decode(decode(parts[0]))),claims=JSON.parse(new TextDecoder().decode(decode(parts[1])));
  if(header.alg!=='RS256'||typeof header.kid!=='string')throw Error();
  let keys=googleKeys.keys;
  if(googleKeys.expires<now||!keys.some(k=>k.kid===header.kid)){
   const response=await fetchImpl('https://www.googleapis.com/oauth2/v3/certs',{signal:AbortSignal.timeout(10000)});
   if(!response.ok)throw Error();keys=(await response.json()).keys;
   if(!Array.isArray(keys))throw Error();googleKeys={keys,expires:now+300000};
  }
  const jwk=keys.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)throw Error();
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),encoder.encode(parts[0]+'.'+parts[1])))throw Error();
  if(!['https://accounts.google.com','accounts.google.com'].includes(claims.iss)||claims.aud!==clientId||(claims.azp&&claims.azp!==clientId))throw Error();
  if(!Number.isFinite(claims.exp)||claims.exp*1000<=now||!Number.isFinite(claims.iat)||claims.iat*1000>now+60000||claims.nonce!==nonce)throw Error();
  if(typeof claims.sub!=='string'||!claims.sub||claims.sub.length>255||claims.email_verified!==true||typeof claims.email!=='string'||claims.email.length>320)throw Error();
  return {subject:claims.sub,email:claims.email,name:typeof claims.name==='string'?claims.name.slice(0,30):'에이머'};
 }catch{throw authFailure('Google 로그인 정보를 확인하지 못했어요. 다시 로그인해 주세요.',401);}
}

export function createAuth({db,clientId='',clientSecret='',origin,demo=false,fetchImpl=fetch,now=()=>Date.now()}={}){
 const appOrigin=new URL(origin).origin,secure=appOrigin.startsWith('https:'),googleEnabled=!!(clientId&&clientSecret);
 const cookie=(name,value,age)=>name+'='+value+'; Path=/; HttpOnly; SameSite=Lax; Max-Age='+age+(secure?'; Secure':'');
 const redirect=(location,headers={})=>new Response(null,{status:302,headers:{location,'cache-control':'no-store',...headers}});
 async function resolve(request){
  const jar=cookies(request),token=jar.aimers_auth;
  if(token&&/^[A-Za-z0-9_-]{43}$/.test(token)){
   const session=await db.get('SELECT s.user_id,s.expires_at,a.email FROM auth_sessions s JOIN auth_accounts a ON a.user_id=s.user_id WHERE s.token_hash=? AND s.expires_at>?',[await tokenHash(token),now()]);
   if(session)return {identity:session.user_id,account:{provider:'google',email:session.email,expiresAt:session.expires_at},demo:false};
  }
  if(demo){
   const sid=/^[a-f0-9-]{36}$/.test(jar.aimers_session||'')?jar.aimers_session:crypto.randomUUID();
   const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(sid))),b=>b.toString(16).padStart(2,'0')).join('');
   return {identity:'local-'+digest,account:{provider:'demo',email:''},demo:true,cookie:cookie('aimers_session',sid,31536000)};
  }
  return {identity:null,account:null,demo:false};
 }
 function checkWrite(request){
  if(request.headers.get('origin')!==appOrigin||!request.headers.get('content-type')?.startsWith('application/json'))throw authFailure('요청 출처와 형식을 확인해 주세요.',403);
 }
 async function handle(request){
  const url=new URL(request.url),p=url.pathname;
  if(!p.startsWith('/api/auth/'))return null;
  try{
   if(p==='/api/auth/session'&&request.method==='GET'){
    const session=await resolve(request),response=authJson({signedIn:!!session.identity,account:session.account,googleEnabled,demoEnabled:demo});
    if(session.cookie)response.headers.append('set-cookie',session.cookie);return response;
   }
   if(p==='/api/auth/google'&&request.method==='GET'){
    if(!googleEnabled)return redirect('/?authError=unavailable');
    const state=random(),nonce=random(),verifier=random(),returnTo=url.searchParams.get('returnTo')||'/';
    await db.run('DELETE FROM oauth_states WHERE expires_at<?',[now()]);
    await db.run('INSERT INTO oauth_states VALUES(?,?,?,?,?)',[await tokenHash(state),nonce,verifier,returnTo.startsWith('/')&&!returnTo.startsWith('//')&&!returnTo.includes('\\')?returnTo.slice(0,500):'/',now()+600000]);
    const login=new URL('https://accounts.google.com/o/oauth2/v2/auth');
    login.search=new URLSearchParams({client_id:clientId,redirect_uri:appOrigin+'/api/auth/google/callback',response_type:'code',scope:'openid email profile',state,nonce,code_challenge:await tokenHash(verifier),code_challenge_method:'S256',prompt:'select_account'}).toString();
    return redirect(login.href,{'set-cookie':cookie('aimers_oauth',state,600)});
   }
   if(p==='/api/auth/google/callback'&&request.method==='GET'){
    const state=url.searchParams.get('state'),jar=cookies(request);
    if(!googleEnabled||!state||state!==jar.aimers_oauth)throw authFailure('로그인 요청이 만료됐어요. 다시 시작해 주세요.');
    const key=await tokenHash(state),flow=await db.get('SELECT * FROM oauth_states WHERE state_hash=? AND expires_at>?',[key,now()]);
    if(!flow)throw authFailure('로그인 요청이 만료됐어요. 다시 시작해 주세요.');
    // Consume before exchanging the code, including denial and replay attempts.
    const consumed=await db.run('DELETE FROM oauth_states WHERE state_hash=?',[key]);
    if(consumed.changes===0||consumed.meta?.changes===0)throw authFailure('이미 처리한 로그인 요청이에요.');
    if(url.searchParams.has('error'))return redirect('/?authError=cancelled',{'set-cookie':cookie('aimers_oauth','',0)});
    const code=url.searchParams.get('code');if(!code||code.length>4096)throw authFailure('로그인 코드를 확인하지 못했어요.');
    const response=await fetchImpl('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code,client_id:clientId,client_secret:clientSecret,redirect_uri:appOrigin+'/api/auth/google/callback',grant_type:'authorization_code',code_verifier:flow.verifier}),signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw authFailure('Google 로그인을 완료하지 못했어요. 다시 시도해 주세요.');
    const claims=await verifyGoogleToken((await response.json()).id_token,{clientId,nonce:flow.nonce,fetchImpl,now:now()});
    let account=await db.get('SELECT user_id FROM auth_accounts WHERE provider=? AND subject=?',['google',claims.subject]);
    if(!account){
     const id=crypto.randomUUID(),created=new Date(now()).toISOString(),start=new Date(now()).toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'});
     const actions=[['INSERT INTO users(id,name,created_at,start_date) VALUES(?,?,?,?)',[id,claims.name,created,start]],['INSERT INTO auth_accounts VALUES(?,?,?,?,?)',['google',claims.subject,id,claims.email,now()]]];
     for(const [name,color]of [['대외활동','blue'],['프로젝트','purple'],['동아리','mint'],['인턴십','orange'],['학업','pink']])actions.push(['INSERT INTO categories VALUES(?,?,?,?)',[crypto.randomUUID(),id,name,color]]);
     await db.batch(actions);account={user_id:id};
    }else await db.run('UPDATE auth_accounts SET email=? WHERE provider=? AND subject=?',[claims.email,'google',claims.subject]);
    const token=random();await db.run('DELETE FROM auth_sessions WHERE expires_at<?',[now()]);
    await db.run('INSERT INTO auth_sessions VALUES(?,?,?,?)',[await tokenHash(token),account.user_id,now()+30*86400000,now()]);
    const result=redirect(flow.return_to);result.headers.append('set-cookie',cookie('aimers_auth',token,30*86400));result.headers.append('set-cookie',cookie('aimers_oauth','',0));return result;
   }
   if(p==='/api/auth/logout'&&request.method==='POST'){
    checkWrite(request);const token=cookies(request).aimers_auth;if(token)await db.run('DELETE FROM auth_sessions WHERE token_hash=?',[await tokenHash(token)]);
    const response=authJson({ok:true});response.headers.append('set-cookie',cookie('aimers_auth','',0));response.headers.append('set-cookie',cookie('aimers_session','',0));return response;
   }
   if(p==='/api/auth/sessions'&&request.method==='DELETE'){
    checkWrite(request);const session=await resolve(request);if(!session.identity)throw authFailure('로그인이 필요해요.',401);
    await db.run('DELETE FROM auth_sessions WHERE user_id=?',[session.identity]);const response=authJson({ok:true});response.headers.set('set-cookie',cookie('aimers_auth','',0));return response;
   }
   if(p==='/api/auth/account'&&request.method==='DELETE'){
    checkWrite(request);const session=await resolve(request);if(!session.identity||session.demo)throw authFailure('Google 계정으로 로그인해 주세요.',401);
    const body=await request.json();if(body.confirm!=='DELETE')throw authFailure('계정 삭제 확인이 필요해요.');
    const id=session.identity;
    await db.batch([
     ['DELETE FROM notifications WHERE user_id=? OR actor_id=? OR group_id IN (SELECT id FROM groups WHERE owner_id=?)',[id,id,id]],
     ['DELETE FROM members WHERE user_id=? OR group_id IN (SELECT id FROM groups WHERE owner_id=?)',[id,id]],
     ['DELETE FROM groups WHERE owner_id=?',[id]],['DELETE FROM interview_practice WHERE user_id=?',[id]],['DELETE FROM entries WHERE user_id=?',[id]],['DELETE FROM categories WHERE user_id=?',[id]],
     ['DELETE FROM ai_requests WHERE user_id=?',[id]],['DELETE FROM auth_sessions WHERE user_id=?',[id]],['DELETE FROM auth_accounts WHERE user_id=?',[id]],['DELETE FROM users WHERE id=?',[id]]
    ]);
    const response=authJson({ok:true});response.headers.set('set-cookie',cookie('aimers_auth','',0));return response;
   }
   return authJson({error:'지원하지 않는 인증 요청이에요.'},405);
  }catch(error){
   if(p==='/api/auth/google/callback')return redirect('/?authError=failed',{'set-cookie':cookie('aimers_oauth','',0)});
   return authJson({error:error.status?error.message:'로그인 처리 중 오류가 발생했어요.'},error.status||503);
  }
 }
 async function allowAI(identity){
  await db.run('DELETE FROM ai_requests WHERE requested_at<?',[now()-3600000]);
  const result=await db.run('INSERT INTO ai_requests(user_id,requested_at) SELECT ?,? WHERE (SELECT COUNT(*) FROM ai_requests WHERE user_id=? AND requested_at>?)<30',[identity,now(),identity,now()-3600000]);
  return (result.changes??result.meta?.changes??0)>0;
 }
 return {resolve,handle,allowAI};
}
