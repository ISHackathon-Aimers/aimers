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
function validateEntry(data) {
 const title=clean(data.title,120), category=clean(data.category,40), original=clean(data.original,20000), date=clean(data.date,10);
 if(!title||!category||!original) fail('제목, 카테고리와 활동 내용을 입력해 주세요.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date>dateKey())fail('활동 날짜를 확인해 주세요. 미래 날짜는 기록할 수 없어요.');
 const tags=(Array.isArray(data.tags)?data.tags:[]).map(t=>clean(t,20)).filter(Boolean).slice(0,6);
 return {title,category,original,date,tags};
}
function entryView(e){return {...e,summary:JSON.parse(e.summary),tags:JSON.parse(e.tags)}}
const defaults=[['대외활동','blue'],['프로젝트','purple'],['동아리','mint'],['인턴십','orange'],['학업','pink']];
async function ensureUser(db,id,demo) {
 if(await db.get('SELECT id FROM users WHERE id=?',[id]))return;
 const now=new Date().toISOString();
 await db.run('INSERT OR IGNORE INTO users(id,name,created_at) VALUES(?,?,?)',[id,demo?'지민':'에이머',now]);
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
 await db.run('INSERT INTO entries VALUES(?,?,?,?,?,?,?,?,?,?)',['sample-'+uid(),id,title,category,dateKey(created),original,JSON.stringify(summarize(original)),JSON.stringify(tags),created,created]);
 }
}
export async function handleApi(request,db,identity,{demo=false}={}) {
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
    for(const m of g.members){const recent=await db.all('SELECT created_at,date FROM entries WHERE user_id=? ORDER BY created_at DESC',[m.id]);m.done=recent.some(e=>dateKey(e.created_at)>=g.start);m.streak=streak(recent);}
   }
   const notifications=await db.all('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50',[identity]);
   return json({me,entries,categories,groups,notifications,mode:demo?'local':'hosted',today:dateKey(),streak:streak(entries)});
  }
  if(p==='/api/profile'&&method==='PATCH'){
   const name=clean(body.name,30);if(!name)fail('이름을 입력해 주세요.');
   const cadence=Number(body.cadence);if(![1,7,30].includes(cadence))fail('기록 주기를 확인해 주세요.');
   await db.run('UPDATE users SET name=?,cadence=? WHERE id=?',[name,cadence,identity]);return json({ok:true});
  }
  if(p==='/api/entries'&&method==='POST'){
   const e=validateEntry(body);
   if(!await db.get('SELECT id FROM categories WHERE user_id=? AND name=?',[identity,e.category]))fail('카테고리를 먼저 추가해 주세요.');
   const id=uid();await db.run('INSERT INTO entries VALUES(?,?,?,?,?,?,?,?,?,?)',[id,identity,e.title,e.category,e.date,e.original,JSON.stringify(summarize(e.original)),JSON.stringify(e.tags),now,now]);return json({id},201);
  }
  if(p==='/api/import'&&method==='POST'){
   if(!Array.isArray(body.entries)||body.entries.length===0||body.entries.length>50)fail('한 번에 1개부터 50개까지 등록할 수 있어요.');
   const entries=body.entries.map(validateEntry);const statements=[];
   for(const e of entries){
    statements.push(['INSERT OR IGNORE INTO categories(id,user_id,name,color) VALUES(?,?,?,?)',[uid(),identity,e.category,'blue']]);
    statements.push(['INSERT INTO entries VALUES(?,?,?,?,?,?,?,?,?,?)',[uid(),identity,e.title,e.category,e.date,e.original,JSON.stringify(summarize(e.original)),JSON.stringify(e.tags),now,now]]);
   }
   await db.batch(statements);return json({count:entries.length},201);
  }
  if(p.startsWith('/api/entries/')&&['DELETE','PATCH'].includes(method)){
   const id=p.split('/').pop();if(!await db.get('SELECT id FROM entries WHERE id=? AND user_id=?',[id,identity]))fail('기록을 찾을 수 없어요.',404);
   if(method==='DELETE'){await db.run('DELETE FROM entries WHERE id=? AND user_id=?',[id,identity]);return json({ok:true});}
   const e=validateEntry(body);
   if(!await db.get('SELECT id FROM categories WHERE user_id=? AND name=?',[identity,e.category]))fail('카테고리를 먼저 추가해 주세요.');
   await db.run('UPDATE entries SET title=?,category=?,date=?,original=?,summary=?,tags=?,updated_at=? WHERE id=? AND user_id=?',[e.title,e.category,e.date,e.original,JSON.stringify(summarize(e.original)),JSON.stringify(e.tags),now,id,identity]);return json({ok:true});
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
