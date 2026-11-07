
import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { handleApi,dateKey,streak,periodStart } from '../src/api.mjs';
function fixture(){
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('../drizzle/0000_aimers.sql',import.meta.url),'utf8'));
 const db={get:async(q,a=[])=>sql.prepare(q).get(...a),all:async(q,a=[])=>sql.prepare(q).all(...a),run:async(q,a=[])=>sql.prepare(q).run(...a),batch:async(items)=>{sql.exec('BEGIN');try{for(const[q,a]of items)sql.prepare(q).run(...a);sql.exec('COMMIT')}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const call=async(id,path,method='GET',body,extra={})=>{const request=new Request('https://aimers.test/api/'+path,{method,headers:{'content-type':'application/json',origin:'https://aimers.test',...extra},body:body===undefined?undefined:JSON.stringify(body)});const r=await handleApi(request,db,id);return{status:r.status,data:await r.json()};};
 return {db,call,close:()=>sql.close()};
}
const entry=(overrides={})=>({title:'나만의 프로젝트',category:'프로젝트',date:dateKey(),original:'나는 인터뷰 진행을 맡았다.\n팀원과 문제를 해결했다.\n협업의 중요성을 배웠다.',tags:['협업'],...overrides});
test('original survives summary extraction and a second user cannot read, edit or delete it',async()=>{
 const f=fixture();try{
 const a=await f.call('a','entries','POST',entry());assert.equal(a.status,201);
 const sa=await f.call('a','state');assert.equal(sa.data.entries[0].original,entry().original);assert.equal(sa.data.entries[0].summary.source,'extractive');
 assert.match(sa.data.entries[0].summary.action,/인터뷰/);
 const sb=await f.call('b','state');assert.equal(sb.data.entries.length,0);
 assert.equal((await f.call('b','entries/'+a.data.id,'PATCH',entry({title:'tampered'}))).status,404);
 assert.equal((await f.call('b','entries/'+a.data.id,'DELETE',{})).status,404);
 assert.equal((await f.call('a','state')).data.entries[0].title,'나만의 프로젝트');
 }finally{f.close()}
});
test('invalid batch does not partially import and a valid batch creates its category',async()=>{
 const f=fixture();try{
 let r=await f.call('a','import','POST',{entries:[entry({category:'봉사'}),entry({date:'2026-02-30'})]});assert.equal(r.status,400);assert.equal((await f.call('a','state')).data.entries.length,0);
 r=await f.call('a','import','POST',{entries:[entry({category:'봉사'}),entry({title:'두 번째 경험'})]});assert.equal(r.status,201);
 const state=(await f.call('a','state')).data;assert.equal(state.entries.length,2);assert.ok(state.categories.some(c=>c.name==='봉사'));
 }finally{f.close()}
});
test('invite joins users, keeps records private, and poke delivers an inbox notification with cooldown',async()=>{
 const f=fixture();try{
 const g=await f.call('a','groups','POST',{name:'테스트 그룹',description:'함께 기록',period:7});assert.equal(g.status,201);
 assert.equal((await f.call('b','state')).data.groups.length,0);
 const info=await f.call('b','invite?token='+g.data.token);assert.equal(info.data.name,'테스트 그룹');assert.equal(info.data.members,undefined);
 assert.equal((await f.call('b','join','POST',{token:'invalid'})).status,404);
 await f.call('b','join','POST',{token:g.data.token});await f.call('b','join','POST',{token:g.data.token});
 assert.equal((await f.call('a','state')).data.groups[0].members.length,2);
 const spoof=await f.call('outsider','poke','POST',{groupId:g.data.id,userId:'b'});assert.equal(spoof.status,403);
 assert.equal((await f.call('a','poke','POST',{groupId:g.data.id,userId:'b'})).status,200);
 const inbox=(await f.call('b','state')).data.notifications;assert.equal(inbox.length,1);assert.equal(inbox[0].is_read,0);
 assert.equal((await f.call('a','poke','POST',{groupId:g.data.id,userId:'b'})).status,429);
 await f.call('b','notifications/read','POST',{});assert.equal((await f.call('b','state')).data.notifications[0].is_read,1);
 await f.call('b','entries','POST',entry());
 const astate=(await f.call('a','state')).data;const member=astate.groups[0].members.find(m=>m.id==='b');assert.equal(member.done,true);assert.equal(member.original,undefined);assert.equal(astate.entries.length,0);
 }finally{f.close()}
});
test('authentication, request origin, content type and future dates are validated',async()=>{
 const f=fixture();try{
 assert.equal((await f.call(null,'state')).status,401);
 assert.equal((await f.call('a','entries','POST',entry(),{origin:'https://evil.test'})).status,403);
 assert.equal((await f.call('a','entries','POST',entry(),{'content-type':'text/plain'})).status,415);
 assert.equal((await f.call('a','entries','POST',entry({date:'2099-01-01'}))).status,400);
 assert.equal((await f.call('a','entries','POST',entry({original:'  '}))).status,400);
 }finally{f.close()}
});
test('streak counts distinct creation days in Korea and does not reward backdated activity dates',()=>{
 const now=new Date('2026-11-07T01:00:00Z');
 const records=[{created_at:'2026-11-06T16:00:00Z',date:'2021-01-01'},{created_at:'2026-11-06T15:20:00Z',date:'2022-01-01'},{created_at:'2026-11-05T16:00:00Z',date:'2023-01-01'}];
 assert.equal(streak(records,now),2);
 assert.equal(streak([{created_at:'2026-11-05T20:00:00Z'}],now),1);
 assert.equal(streak([{created_at:'2026-11-04T20:00:00Z'}],now),0);
 assert.equal(periodStart(7,now),'2026-11-02');assert.equal(periodStart(30,now),'2026-11-01');assert.equal(periodStart(1,now),'2026-11-07');
});
test('category and profile updates persist and reject duplicates or unsupported cadence',async()=>{
 const f=fixture();try{
 assert.equal((await f.call('a','categories','POST',{name:'공모전',color:'purple'})).status,201);
 assert.equal((await f.call('a','categories','POST',{name:'공모전'})).status,400);
 assert.equal((await f.call('a','profile','PATCH',{name:'테스터',cadence:7})).status,200);
 assert.equal((await f.call('a','profile','PATCH',{name:'테스터',cadence:99})).status,400);
 const state=(await f.call('a','state')).data;assert.equal(state.me.name,'테스터');assert.ok(state.categories.some(c=>c.name==='공모전'&&c.color==='purple'));
 }finally{f.close()}
});
test('deleting example records never removes the users own records',async()=>{
 const f=fixture();try{
 await f.call('a','samples','POST',{});await f.call('a','entries','POST',entry());
 assert.equal((await f.call('a','state')).data.entries.length,9);
 await f.call('a','samples','DELETE',{});
 const state=(await f.call('a','state')).data;assert.equal(state.entries.length,1);assert.equal(state.entries[0].title,'나만의 프로젝트');
 }finally{f.close()}
});
