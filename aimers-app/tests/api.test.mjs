
import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { handleApi,dateKey,streak,periodStart } from '../src/api.mjs';
function fixture(options={}){
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('../drizzle/0000_aimers.sql',import.meta.url),'utf8'));
 sql.exec(readFileSync(new URL('../drizzle/0001_profiles.sql',import.meta.url),'utf8'));
 sql.exec(readFileSync(new URL('../drizzle/0002_record_workflows.sql',import.meta.url),'utf8'));
 const db={get:async(q,a=[])=>sql.prepare(q).get(...a),all:async(q,a=[])=>sql.prepare(q).all(...a),run:async(q,a=[])=>sql.prepare(q).run(...a),batch:async(items)=>{sql.exec('BEGIN');try{for(const[q,a]of items)sql.prepare(q).run(...a);sql.exec('COMMIT')}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const call=async(id,path,method='GET',body,extra={})=>{const request=new Request('https://aimers.test/api/'+path,{method,headers:{'content-type':'application/json',origin:'https://aimers.test',...extra},body:body===undefined?undefined:JSON.stringify(body)});const r=await handleApi(request,db,id,options);return{status:r.status,data:await r.json()};};
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
 assert.equal((await f.call('a','profile','PATCH',{name:'테스터',cadence:366})).status,400);
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

test('AI analyzes only owned records and preserves raw input when saving',async()=>{
 const calls=[];const f=fixture({ai:async(task,data)=>{calls.push({task,data});return task==='summary'?{context:'AI 정리',action:'',result:'',source:'deepseek'}:{questions:[{question:'본인 역할은?',intent:'역할 확인'}]};}});
 try{
  const original='  인터뷰를 담당했다.\n\n';
  const saved=await f.call('a','entries','POST',entry({original,useAI:true}));assert.equal(saved.status,201);
  const own=(await f.call('a','state')).data.entries[0];assert.equal(own.original,original);assert.equal(own.summary.source,'deepseek');
  assert.equal((await f.call('b','ai/interview','POST',{entryId:saved.data.id})).status,404);assert.equal(calls.length,1);
  assert.equal((await f.call('a','ai/interview','POST',{entryId:saved.data.id})).status,200);assert.equal(calls[1].data.original,original);
  assert.equal((await f.call('a','ai/reflect','POST',{original:'x'.repeat(20001)})).status,400);
 }finally{f.close();}
});
test('AI failure never overwrites a record and raw save stays available',async()=>{
 const f=fixture({ai:async()=>{throw Object.assign(new Error('AI unavailable'),{status:502});}});
 try{
  const created=await f.call('a','entries','POST',entry());
  assert.equal((await f.call('a','entries/'+created.data.id,'PATCH',entry({original:'changed',useAI:true}))).status,502);
  assert.equal((await f.call('a','state')).data.entries[0].original,entry().original);
  assert.equal((await f.call('a','entries','POST',entry({useAI:true}))).status,502);
  assert.equal((await f.call('a','state')).data.entries.length,1);
 }finally{f.close();}
});
test('AI recommendations and semester reports never include another users records',async()=>{
 const calls=[];const f=fixture({ai:async(task,data)=>{calls.push({task,data});return {};}});
 try{
  await f.call('a','entries','POST',entry({date:'2026-04-01'}));await f.call('b','entries','POST',entry({original:'OTHER USER SECRET'}));
  assert.equal((await f.call('a','ai/recommend','POST',{question:'협업 경험'})).status,200);
  assert.equal((await f.call('a','ai/report','POST',{semester:'2026-1'})).status,200);
  assert.equal(calls[0].data.records.length,1);assert.equal(calls[1].data.current.length,1);assert.equal(calls[1].data.previous.length,0);
  assert.equal(JSON.stringify(calls).includes('OTHER USER SECRET'),false);
 }finally{f.close();}
});

test('public, shared-group and private records enforce server-side visibility',async()=>{
 const f=fixture();try{
  const publicEntry=await f.call('a','entries','POST',entry({title:'PUBLIC',visibility:'public'}));
  await f.call('a','entries','POST',entry({title:'GROUP',visibility:'group'}));
  await f.call('a','entries','POST',entry({title:'PRIVATE',visibility:'private'}));
  await f.call('a','entries','POST',entry({title:'INHERITED'}));
  const group=await f.call('a','groups','POST',{name:'그룹',period:7});await f.call('b','join','POST',{token:group.data.token});
  assert.deepEqual((await f.call('c','users/a')).data.entries.map(e=>e.title),['PUBLIC']);
  assert.deepEqual(new Set((await f.call('b','users/a')).data.entries.map(e=>e.title)),new Set(['PUBLIC','GROUP']));
  assert.equal((await f.call('a','users/a')).data.entries.length,4);
  assert.equal((await f.call('c','public')).data.entries.length,1);
  await f.call('a','profile','PATCH',{name:'공개 사용자',cadence:14,start_date:'2026-01-01',visibility:'public'});
  assert.equal((await f.call('c','users/a')).data.entries.length,2);
  await f.call('a','entries/'+publicEntry.data.id,'PATCH',entry({title:'NOW PRIVATE',visibility:'private'}));
  assert.equal((await f.call('c','public')).data.entries.some(e=>e.id===publicEntry.data.id),false);
  assert.equal((await f.call('b','entries/'+publicEntry.data.id,'DELETE',{})).status,404);
  assert.equal((await f.call('b','ai/interview','POST',{entryId:publicEntry.data.id})).status,503);
  await f.db.run('DELETE FROM members WHERE group_id=? AND user_id=?',[group.data.id,'b']);
  assert.equal((await f.call('b','users/a')).data.entries.some(e=>e.title==='GROUP'),false);
 }finally{f.close();}
});
test('profile settings validate photo types, cadence and dates; completed members cannot be poked',async()=>{
 const f=fixture();try{
  for(const changes of [{avatar:'https://tracking.test/a'},{avatar:'data:image/svg+xml;base64,AAAA'},{start_date:'2026-02-30'},{cadence:0},{font_size:99},{visibility:'everyone'}]){
   assert.equal((await f.call('a','profile','PATCH',{name:'A',cadence:7,...changes})).status,400);
  }
  const g=await f.call('a','groups','POST',{name:'G',period:7});await f.call('b','join','POST',{token:g.data.token});await f.call('b','entries','POST',entry());
  assert.equal((await f.call('a','poke','POST',{groupId:g.data.id,userId:'b'})).status,400);
 }finally{f.close();}
});

test('quick memos persist without a title or AI and reflection answers never replace their source',async()=>{
 const f=fixture();try{
  const memo=await f.call('a','entries','POST',{kind:'memo',original:'시연에서 검색 버튼을 못 찾는 사용자를 관찰했다.'});assert.equal(memo.status,201);
  let records=(await f.call('a','state')).data.entries;assert.equal(records[0].kind,'memo');assert.match(records[0].title,/시연/);assert.equal(records[0].summary.source,'extractive');
  const original=records[0].original;
  const saved=await f.call('a','entries','POST',entry({kind:'reflection',periodStart:dateKey(),periodEnd:dateKey(),sourceIds:[memo.data.id],conversation:[{question:'검색 버튼 위치를 어떻게 바꾸려고 하나요?',answer:'관찰한 동선을 기준으로 배치를 바꿔 테스트한다.',focus:'next-step',evidenceIds:[memo.data.id]}]}));assert.equal(saved.status,201);
  records=(await f.call('a','state')).data.entries;const review=records.find(e=>e.kind==='reflection');assert.deepEqual(review.sourceIds,[memo.data.id]);assert.equal(review.conversation[0].answer,'관찰한 동선을 기준으로 배치를 바꿔 테스트한다.');assert.equal(records.find(e=>e.id===memo.data.id).original,original);
  assert.equal((await f.call('a','entries/'+review.id,'PATCH',{original:'새롭게 돌아본 내용'})).status,200);assert.equal((await f.call('a','state')).data.entries.find(e=>e.id===review.id).kind,'reflection');
  assert.equal((await f.call('a','entries','POST',{kind:'memo',original:'x'.repeat(2001)})).status,400);
 }finally{f.close();}
});
test('review AI receives only selected owned period notes and conversation, rejecting foreign or out-of-period notes',async()=>{
 const calls=[],f=fixture({ai:async(task,data)=>{calls.push({task,data});return {questions:[],summary:{}};}});try{
  const own=await f.call('a','entries','POST',{kind:'memo',original:'사용자 3명의 검색 과정을 관찰했다.'});
  const foreign=await f.call('b','entries','POST',{kind:'memo',original:'OTHER USER PRIVATE NOTE'});
  const stale=await f.call('a','entries','POST',entry({date:'2020-01-01'}));
  const request={sourceIds:[own.data.id],periodStart:dateKey(),periodEnd:dateKey(),original:'',conversation:[{question:'관찰 방법은?',answer:'화면 녹화로 확인했다.',evidenceIds:[own.data.id]}],previousQuestions:[{question:'관찰 방법은?',focus:'evidence'}]};
  assert.equal((await f.call('a','ai/review','POST',request)).status,200);assert.equal(calls[0].task,'review');assert.equal(calls[0].data.records.length,1);assert.equal(calls[0].data.original,'');assert.match(calls[0].data.conversation[0].answer,/녹화/);
  assert.equal((await f.call('a','ai/review','POST',{...request,sourceIds:[foreign.data.id]})).status,404);
  assert.equal((await f.call('a','ai/review','POST',{...request,sourceIds:[stale.data.id]})).status,400);
  assert.equal((await f.call('a','ai/review','POST',{...request,sourceIds:[]})).status,400);
  assert.equal((await f.call('a','ai/review','POST',{...request,periodStart:'2026-02-30'})).status,400);
  assert.equal((await f.call('a','entries','POST',entry({kind:'reflection',periodStart:dateKey(),periodEnd:dateKey(),sourceIds:[foreign.data.id]}))).status,404);
  assert(!JSON.stringify(calls).includes('OTHER USER PRIVATE NOTE'));
 }finally{f.close();}
});
test('reflection imports remap source note ids without copying or exposing another users private records',async()=>{
 const f=fixture();try{
  const memo=await f.call('a','entries','POST',{kind:'memo',original:'발표 리허설에서 질문 2개에 답하지 못했다.'});
  await f.call('a','entries','POST',entry({kind:'reflection',periodStart:dateKey(),periodEnd:dateKey(),sourceIds:[memo.data.id],conversation:[{question:'준비 방식은?',answer:'예상 질문을 묶어 연습했다.',evidenceIds:[memo.data.id]}]}));
  const exported=(await f.call('a','state')).data.entries;
  assert.equal((await f.call('b','import','POST',{entries:exported})).status,201);
  const restored=(await f.call('b','state')).data.entries,restoredMemo=restored.find(e=>e.kind==='memo'),review=restored.find(e=>e.kind==='reflection');assert.notEqual(restoredMemo.id,memo.data.id);assert.deepEqual(review.sourceIds,[restoredMemo.id]);assert.deepEqual(review.conversation[0].evidenceIds,[restoredMemo.id]);
  assert.equal((await f.call('c','import','POST',{entries:[exported.find(e=>e.kind==='reflection')]})).status,404);assert.equal((await f.call('c','state')).data.entries.length,0);
 }finally{f.close();}
});
test('interview requests carry role, focus and previous questions while disallowing other users records',async()=>{
 const calls=[],f=fixture({ai:async(task,data)=>{calls.push(data);return {questions:[]};}});try{
  const saved=await f.call('a','entries','POST',entry());
  const request={entryId:saved.data.id,targetRole:'서비스 기획',focus:'decision',previousQuestions:[{question:'이전 질문',focus:'ownership'}]};
  assert.equal((await f.call('a','ai/interview','POST',request)).status,200);assert.equal(calls[0].targetRole,'서비스 기획');assert.equal(calls[0].focus,'decision');assert.equal(calls[0].previousQuestions[0].question,'이전 질문');
  assert.equal((await f.call('b','ai/interview','POST',request)).status,404);
  const state=(await f.call('a','state')).data;assert.equal(state.interviewReferences.length,3);assert.equal(state.questionFocuses.length,10);
 }finally{f.close();}
});
