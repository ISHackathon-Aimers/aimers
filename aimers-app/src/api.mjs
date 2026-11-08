import {interviewSources,questionAngles} from './question-guides.mjs';
import {recordingProgress,validDate} from './periods.mjs';
export const DAY = 86400000;
export function dateKey(value = new Date()) { return new Date(value).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' }); }
export function periodStart(period, now = new Date()) {
  const key = dateKey(now);
  const d = new Date(key + 'T00:00:00+09:00');
  if (period === 1) return key;
  if (period === 7) { const day = new Date(key+'T00:00:00Z').getUTCDay(); d.setTime(d.getTime() - ((day+6)%7)*DAY); }
  if (period === 30) return key.slice(0,7)+'-01';
  return dateKey(d);
}
export function streak(entries, now = new Date()) {
  const dates = new Set(entries.map(e=>e.created_at ? dateKey(e.created_at) : e.date));
  let d=new Date(dateKey(now)+'T12:00:00+09:00'), count=0;
  if (!dates.has(dateKey(d))) d=new Date(d.getTime()-DAY);
  while(dates.has(dateKey(d))){count++;d=new Date(d.getTime()-DAY);}
  return count;
}
const colors=['blue','purple','mint','orange','pink','gray'];
const uid=()=>crypto.randomUUID();
const clean=(v,max=500)=>typeof v==='string'?v.trim().slice(0,max):'';
function fail(message,status=400){throw Object.assign(new Error(message),{status});}
export function summarize(original) {
  const sentences=original.split(/\n+|(?<=[.!?。])\s+/u).map(s=>s.trim()).filter(Boolean);
  const pick=(regex)=>sentences.filter(s=>regex.test(s)).join(' ').slice(0,650);
  return {context:sentences.slice(0,2).join(' ').slice(0,650),action:pick(/담당|맡|진행|기획|분석|제안|개발|설계|인터뷰|만들|조사|해결|작성/),result:pick(/결과|배웠|배운|느꼈|성과|달성|향상|개선|증가|감소|수상|완료|성장|중요|깨달/),source:'extractive'};
}
function validateConversation(value=[]){
 if(!Array.isArray(value)||value.length>24)fail('회고 대화는 최대 24개까지 저장할 수 있어요.');
 return value.map(turn=>{if(!turn||typeof turn.question!=='string'||typeof turn.answer!=='string'||turn.question.length>1000||turn.answer.length>5000)fail('질문과 답변 형식을 확인해 주세요.');return {question:turn.question,answer:turn.answer,focus:clean(turn.focus,40),evidenceIds:validateSourceIds(turn.evidenceIds||[])};});
}
function validateSourceIds(value=[]){if(!Array.isArray(value)||value.length>20||value.some(id=>typeof id!=='string'||!id||id.length>100))fail('회고에 연결할 기록은 최대 20개까지 선택할 수 있어요.');return [...new Set(value)];}
function reviewPeriod(data){const start=data.periodStart,end=data.periodEnd;if(!validDate(start)||!validDate(end)||start>end||(Date.parse(end)-Date.parse(start))/DAY>365)fail('회고 기간을 확인해 주세요.');return {periodStart:start,periodEnd:end};}
function validateEntry(data){
 const kind=data.kind||'experience';if(!['experience','memo','reflection'].includes(kind))fail('기록 유형을 확인해 주세요.');
 const original=typeof data.original==='string'?data.original:'';
 const title=clean(data.title,120)||(kind==='memo'?original.trim().split('\n')[0].slice(0,60):kind==='reflection'?'회고 '+clean(data.periodStart,10):'');
 const category=clean(data.category,40)||(kind==='memo'?'대외활동':''),date=clean(data.date,10)||(kind==='memo'?dateKey():'');
 if(!title||!category||!original.trim())fail('제목, 카테고리와 활동 내용을 입력해 주세요.');
 if(original.length>(kind==='memo'?2000:20000))fail(kind==='memo'?'빠른 메모는 2,000자까지 저장할 수 있어요.':'활동 내용은 20,000자까지 저장할 수 있어요.');
 if(!validDate(date)||date>dateKey())fail('활동 날짜를 확인해 주세요. 미래 날짜는 기록할 수 없어요.');
 const tags=(Array.isArray(data.tags)?data.tags:[]).map(t=>clean(t,20)).filter(Boolean).slice(0,6);
 const visibility=data.visibility??'inherit';if(!['inherit','private','group','public'].includes(visibility))fail('공개 범위를 확인해 주세요.');
 const workflow={sourceIds:validateSourceIds(data.sourceIds||[]),conversation:validateConversation(data.conversation||[])};
 if(kind==='reflection')Object.assign(workflow,reviewPeriod(data));
 else if(workflow.sourceIds.length)fail('메모 연결은 회고에서 사용할 수 있어요.');
 return {title,category,original,date,tags,visibility,kind,workflow};
}
async function reviewRecords(db,identity,sourceIds,period){
 const records=[];for(const id of sourceIds){const e=await db.get('SELECT * FROM entries WHERE id=? AND user_id=?',[id,identity]);if(!e)fail('본인의 기록만 회고에 연결할 수 있어요.',404);if(e.kind==='reflection'||e.date<period.periodStart||e.date>period.periodEnd)fail('회고 기간 안의 메모와 경험만 선택해 주세요.');records.push({id:e.id,title:e.title,date:e.date,category:e.category,original:e.original.slice(0,2000)});}return records;
}
function entryView(e){const {workflow,...record}=e;return {...record,kind:e.kind||'experience',sourceIds:[],conversation:[],...JSON.parse(workflow||'{}'),summary:JSON.parse(e.summary),tags:JSON.parse(e.tags)}}
const defaults=[['대외활동','blue'],['프로젝트','purple'],['동아리','mint'],['인턴십','orange'],['학업','pink']];
async function ensureUser(db,id,demo) {
 if(await db.get('SELECT id FROM users WHERE id=?',[id]))return;
 const now=new Date().toISOString();
 await db.run('INSERT OR IGNORE INTO users(id,name,created_at,start_date) VALUES(?,?,?,?)',[id,demo?'지민':'에이머',now,dateKey()]);
 for(const [name,color] of defaults)await db.run('INSERT OR IGNORE INTO categories(id,user_id,name,color) VALUES(?,?,?,?)',[uid(),id,name,color]);
 if(demo)await seed(db,id);
}
async function seed(db,id){
 const samples=[
 ['사용자의 목소리에서 찾은 서비스의 방향','프로젝트',1,'교내 서비스 기획 프로젝트에서 대학생 12명을 인터뷰했다. 나는 질문지 설계와 인터뷰 진행을 담당했다. 처음에는 새로운 기능을 원하는 줄 알았지만, 실제로는 기존 정보를 찾기 어렵다는 불편이 더 컸다. 인터뷰를 바탕으로 정보 구조를 개선하고 팀원들과 프로토타입을 만들었다. 문제를 먼저 정의하는 과정이 중요하다는 것을 배웠다.',['문제해결','사용자 리서치']],
 ['우리 팀의 생각을 하나로 모았던 순간','대외활동',2,'대학생 마케팅 서포터즈에서 캠퍼스 캠페인을 기획했다. 팀원들의 의견이 갈려 의사결정이 늦어졌다. 나는 각 아이디어를 목표 고객과 실행 가능성 기준으로 정리해 비교하는 회의를 제안했다. 모두가 동의할 수 있는 기준을 만들어 최종 기획안을 완성했다. 협업에서는 의견을 주장하기 전에 기준을 함께 세우는 것이 중요하다는 것을 배웠다.',['협업','커뮤니케이션']],
 ['처음으로 이끌어 본 디자인 스터디','동아리',3,'디자인 동아리에서 신입 부원 8명과 첫 스터디를 진행했다. 나는 학습 자료와 실습 과제를 준비하고 발표 진행을 맡았다. 개념 설명만으로는 이해가 어렵다는 피드백을 받아 실제 앱 화면을 분석하는 활동을 추가했다. 모든 부원이 실습 결과물을 완성했다. 상대의 눈높이에 맞춰 설명하는 방법을 배웠다.',['리더십','기획력']],
 ['데이터로 설득하는 기획안 만들기','학업',8,'경영통계 수업에서 소비자 설문 데이터를 분석했다. 150개 응답을 정제하고 구매 결정 요인을 비교하는 역할을 맡았다. 직관으로 예상했던 가격보다 편의성이 더 큰 영향을 보였다. 분석 결과를 그래프로 정리해 발표했다. 가설을 데이터로 확인하는 습관을 배웠다.',['데이터 분석','문제해결']],
 ['작은 개선이 만든 더 나은 행사','대외활동',15,'교내 진로 박람회 운영에 참여했다. 방문자가 안내 부스를 찾기 어려워하는 상황을 발견했다. 나는 동선 안내판 위치 변경과 모바일 안내 페이지 제작을 제안했다. 운영팀과 협의해 다음 날 안내를 개선했다. 작은 관찰이 서비스 개선의 출발점이라는 것을 배웠다.',['실행력','기획력']],
 ['첫 해커톤에서 배운 빠른 실행','프로젝트',23,'교내 해커톤에서 3명의 팀원과 학식 추천 웹 서비스를 만들었다. 나는 화면 설계와 발표를 담당했다. 제한된 시간에 기능을 모두 구현하기 어려워 핵심 기능 2개에 집중했다. 시연 가능한 결과물을 완성했다. 목표에 맞춰 우선순위를 정하는 방법을 배웠다.',['문제해결','협업']],
 ['낯선 분야를 함께 공부하는 방법','동아리',31,'개발 동아리에서 비전공자 대상 기초 스터디에 참여했다. 나는 매주 배운 개념을 정리하고 질문 목록을 작성했다. 어려운 개념은 직접 간단한 예제를 만들어 팀원들과 공유했다. 함께 질문하며 학습할 때 이해가 깊어진다는 것을 느꼈다.',['학습력','커뮤니케이션']],
 ['브랜드의 이야기를 콘텐츠로','대외활동',44,'지역 소상공인 홍보 프로젝트에서 SNS 콘텐츠를 기획했다. 나는 점주 인터뷰와 카드뉴스 초안 작성을 담당했다. 제품 소개보다 가게가 시작된 이야기에 집중해 콘텐츠를 제작했다. 점주의 피드백을 반영해 최종 콘텐츠 4편을 완성했다. 대상의 이야기를 듣는 과정이 중요하다는 것을 배웠다.',['콘텐츠 기획','공감']]
 ];
 for(const [title,category,ago,original,tags] of samples){
 const created=new Date(Date.now()-ago*DAY).toISOString();
 await db.run('INSERT INTO entries(id,user_id,title,category,date,original,summary,tags,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)',['sample-'+uid(),id,title,category,dateKey(created),original,JSON.stringify(summarize(original)),JSON.stringify(tags),created,created]);
 }
}
export async function handleApi(request,db,identity,{demo=false,ai=null}={}) {
 try{
  if(!identity)fail('로그인이 필요해요.',401);
  const url=new URL(request.url),p=url.pathname,method=request.method;
  if(!['GET','HEAD'].includes(method)){
   if(request.headers.get('origin')&&request.headers.get('origin')!==url.origin)fail('허용되지 않은 요청이에요.',403);
   if(!request.headers.get('content-type')?.includes('application/json'))fail('JSON 형식이 필요해요.',415);
  }
  let body={};if(!['GET','HEAD'].includes(method)){const raw=await request.text();if(raw.length>250000)fail('한 번에 올릴 수 있는 크기를 초과했어요.',413);try{body=JSON.parse(raw)}catch{fail('입력 형식을 확인해 주세요.');}}
  await ensureUser(db,identity,demo);
  const me=await db.get('SELECT * FROM users WHERE id=?',[identity]);
  const now=new Date().toISOString();
  if(p==='/api/state'&&method==='GET'){
   const entries=(await db.all('SELECT * FROM entries WHERE user_id=? ORDER BY date DESC,created_at DESC',[identity])).map(entryView);
   const categories=await db.all('SELECT * FROM categories WHERE user_id=? ORDER BY rowid',[identity]);
   const groups=await db.all('SELECT g.* FROM groups g JOIN members m ON m.group_id=g.id WHERE m.user_id=? ORDER BY g.created_at DESC',[identity]);
   for(const g of groups){
    g.start=periodStart(g.period);g.members=await db.all('SELECT u.id,u.name,m.joined_at FROM members m JOIN users u ON u.id=m.user_id WHERE m.group_id=? ORDER BY m.joined_at',[g.id]);
    for(const m of g.members){const profile=await db.get('SELECT * FROM users WHERE id=?',[m.id]);const recent=await db.all('SELECT created_at,date FROM entries WHERE user_id=? ORDER BY created_at DESC',[m.id]);m.progress=recordingProgress(recent,profile);m.done=m.progress.done;m.streak=m.progress.count;m.avatar=profile.avatar;m.cadence=profile.cadence;}
   }
   const notifications=await db.all('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50',[identity]);
    return json({me:{...me,start_date:me.start_date||dateKey(me.created_at)},entries,categories,groups,notifications,mode:demo?'local':'hosted',today:dateKey(),streak:streak(entries),progress:recordingProgress(entries,me),aiEnabled:!!ai,interviewReferences:interviewSources,questionFocuses:questionAngles.map(({id,label})=>({id,label}))});
  }
   if(p==='/api/public'&&method==='GET'){
    const offset=Number(url.searchParams.get('offset')||0);if(!Number.isInteger(offset)||offset<0)fail('페이지를 확인해 주세요.');
    const rows=await db.all("SELECT e.*,u.name AS author_name,u.avatar AS author_avatar FROM entries e JOIN users u ON u.id=e.user_id WHERE (CASE WHEN e.visibility='inherit' THEN u.visibility ELSE e.visibility END)='public' ORDER BY e.created_at DESC,e.id LIMIT 31 OFFSET ?",[offset]);
    return json({entries:rows.slice(0,30).map(entryView),hasMore:rows.length>30});
   }
   if(p.startsWith('/api/users/')&&method==='GET'){
    const id=p.slice('/api/users/'.length),profile=await db.get('SELECT * FROM users WHERE id=?',[id]);if(!profile)fail('프로필을 찾을 수 없어요.',404);
    const shared=await db.get('SELECT a.group_id FROM members a JOIN members b ON a.group_id=b.group_id WHERE a.user_id=? AND b.user_id=? LIMIT 1',[identity,id]);
    const all=await db.all('SELECT * FROM entries WHERE user_id=? ORDER BY date DESC,created_at DESC',[id]);
    const visible=all.filter(e=>{const scope=e.visibility==='inherit'?profile.visibility:e.visibility;return id===identity||scope==='public'||(scope==='group'&&!!shared);});
    if(id!==identity&&!shared&&!visible.length)fail('열람할 수 있는 공개 기록이 없어요.',404);
    const progress=id===identity||shared?recordingProgress(all,profile):null;
    return json({profile:{id,name:profile.name,avatar:profile.avatar},progress,entries:visible.map(entryView),isOwner:id===identity,sharedGroup:!!shared});
   }
   if(p.startsWith('/api/ai/')&&method==='POST'){
    if(!ai)fail('AI 연결이 설정되지 않았어요. 원문 기록은 계속 사용할 수 있어요.',503);
    const task=p.slice('/api/ai/'.length);
    if(task==='review'){
     const progress=recordingProgress([],me),period=reviewPeriod({periodStart:body.periodStart||progress.start,periodEnd:body.periodEnd||progress.end});
     const records=await reviewRecords(db,identity,validateSourceIds(body.sourceIds||[]),period),original=typeof body.original==='string'?body.original:'';
     if(original.length>20000||(!original.trim()&&!records.length))fail('이번 기간의 메모를 선택하거나 회고를 한 문장 이상 적어주세요.');
     const conversation=validateConversation(body.conversation||[]),previousQuestions=validateConversation((body.previousQuestions||[]).map(q=>({...q,answer:q.answer||''})));
     return json(await ai('review',{...period,records,original,conversation,previousQuestions,focus:clean(body.focus,40)}));
    }
    if(task==='reflect'){

     if(typeof body.original!=='string'||!body.original.trim()||body.original.length>20000)fail('경험을 1~20,000자로 입력해 주세요.');
     return json(await ai('reflect',{original:body.original,title:clean(body.title,120),category:clean(body.category,40)}));
    }
    if(task==='interview'){
     const e=await db.get('SELECT * FROM entries WHERE id=? AND user_id=?',[clean(body.entryId,100),identity]);
     if(!e)fail('기록을 찾을 수 없어요.',404);
     const previousQuestions=validateConversation((body.previousQuestions||[]).map(q=>typeof q==='string'?{question:q,answer:''}:{...q,answer:q.answer||''}));
     return json(await ai('interview',{title:e.title,category:e.category,original:e.original,targetRole:clean(body.targetRole,100),focus:clean(body.focus,40),previousQuestions}));
    }
    if(!['recommend','report'].includes(task))fail('요청한 AI 기능을 찾을 수 없어요.',404);
    const all=(await db.all('SELECT * FROM entries WHERE user_id=? ORDER BY date DESC,created_at DESC',[identity])).map(entryView);
    const compact=e=>({id:e.id,title:e.title,category:e.category,date:e.date,original:e.original.slice(0,1500),summary:e.summary,tags:e.tags});
    if(task==='recommend'){
     const question=clean(body.question,3000);if(!question)fail('자소서 문항을 입력해 주세요.');
     const candidates=all.filter(e=>!body.category||e.category===body.category),records=candidates.slice(0,60).map(compact);
     if(!records.length)fail('먼저 경험을 기록해 주세요.');
     return json({...await ai(task,{question,records}),considered:records.length,total:candidates.length});
    }
    const semester=clean(body.semester,6);if(!/^\d{4}-[12]$/.test(semester))fail('학기를 확인해 주세요.');
    const year=Number(semester.slice(0,4)),half=semester.slice(-1),previousSemester=half==='1'?(year-1)+'-2':year+'-1';
    const semesterOf=d=>{const y=Number(d.slice(0,4)),m=Number(d.slice(5,7));return (m<3?y-1:y)+'-'+(m>=3&&m<=8?'1':'2');};
    const current=all.filter(e=>semesterOf(e.date)===semester),previous=all.filter(e=>semesterOf(e.date)===previousSemester);
    if(!current.length)fail('선택한 학기의 기록이 없어요.');
    return json({...await ai(task,{semester,previousSemester,current:current.slice(0,30).map(compact),previous:previous.slice(0,30).map(compact)}),considered:{current:Math.min(30,current.length),previous:Math.min(30,previous.length)},total:{current:current.length,previous:previous.length}});
   }
  if(p==='/api/profile'&&method==='PATCH'){
   const name=clean(body.name,30);if(!name)fail('이름을 입력해 주세요.');
    const cadence=Number(body.cadence);if(!Number.isInteger(cadence)||cadence<1||cadence>365)fail('기록 주기는 1~365일로 설정해 주세요.');
    const start=body.start_date??me.start_date??dateKey(me.created_at),visibility=body.visibility??me.visibility,font=body.font??me.font,fontSize=Number(body.font_size??me.font_size),avatar=body.avatar??me.avatar;
    if(!validDate(start))fail('시작 날짜를 확인해 주세요.');
    if(!['private','group','public'].includes(visibility))fail('공개 범위를 확인해 주세요.');
    if(!['sans','serif','system'].includes(font)||![14,16,18,20].includes(fontSize))fail('글꼴 설정을 확인해 주세요.');
    if(typeof avatar!=='string'||avatar.length>120000||(avatar&&!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(avatar)))fail('프로필 사진을 다시 선택해 주세요.');
    await db.run('UPDATE users SET name=?,cadence=?,start_date=?,visibility=?,avatar=?,font=?,font_size=? WHERE id=?',[name,cadence,start,visibility,avatar,font,fontSize,identity]);return json({ok:true});
  }
  if(p==='/api/entries'&&method==='POST'){
   const e=validateEntry(body);
   if(e.kind==='reflection')await reviewRecords(db,identity,e.workflow.sourceIds,e.workflow);
   if(!await db.get('SELECT id FROM categories WHERE user_id=? AND name=?',[identity,e.category]))fail('카테고리를 먼저 추가해 주세요.');
    if(body.useAI&&!ai)fail('AI 연결이 설정되지 않았어요. 원문만 저장할 수 있어요.',503);
    const summary=body.useAI?await ai('summary',e):summarize(e.original);
    const id=uid();await db.run('INSERT INTO entries(id,user_id,title,category,date,original,summary,tags,created_at,updated_at,visibility,kind,workflow) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',[id,identity,e.title,e.category,e.date,e.original,JSON.stringify(summary),JSON.stringify(e.tags),now,now,e.visibility,e.kind,JSON.stringify(e.workflow)]);return json({id},201);
  }
  if(p==='/api/import'&&method==='POST'){
   if(!Array.isArray(body.entries)||body.entries.length===0||body.entries.length>50)fail('한 번에 1개부터 50개까지 등록할 수 있어요.');
   const entries=body.entries.map(validateEntry),statements=[],ids=entries.map(()=>uid()),mapping=new Map();
   body.entries.forEach((data,i)=>{if(data.id){if(typeof data.id!=='string'||data.id.length>100||mapping.has(data.id))fail('가져올 기록 id가 올바르지 않거나 중복됐어요.');mapping.set(data.id,ids[i]);}});
   for(const [i,e] of entries.entries()){
    if(e.kind==='reflection'){
     for(const sourceId of e.workflow.sourceIds){const mapped=mapping.get(sourceId);if(mapped){const source=entries[ids.indexOf(mapped)];if(source.kind==='reflection'||source.date<e.workflow.periodStart||source.date>e.workflow.periodEnd)fail('회고 기간 안의 메모와 경험만 선택해 주세요.');}else await reviewRecords(db,identity,[sourceId],e.workflow);}
     e.workflow.sourceIds=e.workflow.sourceIds.map(id=>mapping.get(id)||id);
     e.workflow.conversation=e.workflow.conversation.map(turn=>({...turn,evidenceIds:turn.evidenceIds.map(id=>mapping.get(id)||id)}));
    }
    statements.push(['INSERT OR IGNORE INTO categories(id,user_id,name,color) VALUES(?,?,?,?)',[uid(),identity,e.category,'blue']]);
    statements.push(['INSERT INTO entries(id,user_id,title,category,date,original,summary,tags,created_at,updated_at,visibility,kind,workflow) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',[ids[i],identity,e.title,e.category,e.date,e.original,JSON.stringify(summarize(e.original)),JSON.stringify(e.tags),now,now,e.visibility,e.kind,JSON.stringify(e.workflow)]]);
   }
   await db.batch(statements);return json({count:entries.length},201);
  }
  if(p.startsWith('/api/entries/')&&['DELETE','PATCH'].includes(method)){
   const id=p.split('/').pop(),existing=await db.get('SELECT * FROM entries WHERE id=? AND user_id=?',[id,identity]);if(!existing)fail('기록을 찾을 수 없어요.',404);
   if(method==='DELETE'){await db.run('DELETE FROM entries WHERE id=? AND user_id=?',[id,identity]);return json({ok:true});}
   const e=validateEntry({...entryView(existing),...body});
   if(!await db.get('SELECT id FROM categories WHERE user_id=? AND name=?',[identity,e.category]))fail('카테고리를 먼저 추가해 주세요.');
    if(body.useAI&&!ai)fail('AI 연결이 설정되지 않았어요. 원문만 저장할 수 있어요.',503);
    const summary=body.useAI?await ai('summary',e):summarize(e.original);
    await db.run('UPDATE entries SET title=?,category=?,date=?,original=?,summary=?,tags=?,updated_at=?,visibility=?,kind=?,workflow=? WHERE id=? AND user_id=?',[e.title,e.category,e.date,e.original,JSON.stringify(summary),JSON.stringify(e.tags),now,e.visibility,e.kind,JSON.stringify(e.workflow),id,identity]);return json({ok:true});
  }
  if(p==='/api/categories'&&method==='POST'){
   const name=clean(body.name,40);if(!name)fail('카테고리 이름을 입력해 주세요.');
   if(await db.get('SELECT id FROM categories WHERE user_id=? AND name=?',[identity,name]))fail('이미 있는 카테고리예요.');
   await db.run('INSERT INTO categories VALUES(?,?,?,?)',[uid(),identity,name,colors.includes(body.color)?body.color:'blue']);return json({ok:true},201);
  }
  if(p==='/api/groups'&&method==='POST'){
   const name=clean(body.name,60),description=clean(body.description,200),period=Number(body.period);
   if(!name||![1,7,30].includes(period))fail('그룹 이름과 기록 주기를 확인해 주세요.');
   const id=uid(),token=uid()+uid();await db.batch([['INSERT INTO groups VALUES(?,?,?,?,?,?,?)',[id,identity,name,description,period,token,now]],['INSERT INTO members VALUES(?,?,?)',[id,identity,now]]]);return json({id,token},201);
  }
  if(p==='/api/invite'&&method==='GET'){
   const g=await db.get('SELECT id,name,description,period FROM groups WHERE token=?',[url.searchParams.get('token')]);if(!g)fail('유효하지 않은 초대 링크예요.',404);return json(g);
  }
  if(p==='/api/join'&&method==='POST'){
   const g=await db.get('SELECT * FROM groups WHERE token=?',[clean(body.token,100)]);if(!g)fail('유효하지 않은 초대 링크예요.',404);
   await db.run('INSERT OR IGNORE INTO members VALUES(?,?,?)',[g.id,identity,now]);return json({id:g.id});
  }
  if(p==='/api/poke'&&method==='POST'){
   const g=await db.get('SELECT g.* FROM groups g JOIN members m ON g.id=m.group_id WHERE g.id=? AND m.user_id=?',[body.groupId,identity]);if(!g)fail('참여한 그룹에서만 콕 찌를 수 있어요.',403);
   if(body.userId===identity||!await db.get('SELECT user_id FROM members WHERE group_id=? AND user_id=?',[g.id,body.userId]))fail('그룹 멤버를 확인해 주세요.');
    const target=await db.get('SELECT * FROM users WHERE id=?',[body.userId]),recent=await db.all('SELECT created_at FROM entries WHERE user_id=?',[body.userId]),progress=recordingProgress(recent,target);
    if(progress.done||progress.scheduled)fail('현재 기록을 기다리는 멤버에게만 콕 찌를 수 있어요.');
   const cutoff=new Date(Date.now()-DAY).toISOString();
   if(await db.get('SELECT id FROM notifications WHERE user_id=? AND actor_id=? AND group_id=? AND created_at>?',[body.userId,identity,g.id,cutoff]))fail('이 멤버에게는 하루에 한 번 콕 찌를 수 있어요.',429);
   await db.run('INSERT INTO notifications VALUES(?,?,?,?,?,?,?)',[uid(),body.userId,identity,g.id,me.name+'님이 '+g.name+'에서 기록을 기다리고 있어요.',0,now]);return json({ok:true});
  }
  if(p==='/api/notifications/read'&&method==='POST'){await db.run('UPDATE notifications SET is_read=1 WHERE user_id=?',[identity]);return json({ok:true});}
  if(p==='/api/samples'&&method==='DELETE'){await db.run("DELETE FROM entries WHERE user_id=? AND id LIKE 'sample-%'",[identity]);return json({ok:true});}
  if(p==='/api/samples'&&method==='POST'){
   if(await db.get("SELECT id FROM entries WHERE user_id=? AND id LIKE 'sample-%'",[identity]))fail('예시 기록이 이미 있어요.');
   await seed(db,identity);return json({ok:true});
  }
  fail('요청한 기능을 찾을 수 없어요.',404);
 }catch(error){return json({error:error.status?error.message:'저장 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.'},error.status||500)}
}
export function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});}
