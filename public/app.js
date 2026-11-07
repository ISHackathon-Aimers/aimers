
const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>[...root.querySelectorAll(q)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={
home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
folder:'<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
chart:'<path d="M3 3v18h18M7 14l4-4 4 3 6-8"/><path d="M17 5h4v4"/>',
settings:'<path d="m9 3-.5 3-2 1.2-2.8-.9L2 10l2.3 2-0.1 2.4L2 16l2 3.5 3-1 2 1 .5 3h4l.5-3 2-1 3 1 2-3.5-2.2-1.6-.1-2.4 2.3-2-1.7-3.7-2.8.9-2-1.2L14 3z" transform="translate(1 -1) scale(.92)"/><circle cx="12" cy="12" r="3"/>',
bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
plus:'<path d="M12 5v14M5 12h14"/>',right:'<path d="m9 5 7 7-7 7"/>',
arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',chevron:'<path d="m6 9 6 6 6-6"/>',
check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18m-12 4h1m3 0h1m3 0h1"/>',
file:'<path d="M14 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9zM14 2v7h7M7 13h10M7 17h6"/>',
spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4m-2-2h4"/>',
fire:'<path d="M12 2c2 5-1 5-1 9 2 0 4-2 5-4 4 4 6 8 3 12-4 5-12 4-14-1-2-5 1-9 4-11-1 4 1 5 2 4 0-3 2-5 1-9z"/>',
briefcase:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V3h8v4M3 12c5 4 13 4 18 0M10 14h4"/>',
book:'<path d="M12 5c-4-3-7-3-10-2v17c4-1 7-1 10 2 3-3 6-3 10-2V3c-3-1-6-1-10 2zM12 5v17"/>',
layers:'<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
upload:'<path d="M12 16V3m-5 5 5-5 5 5M3 15v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5"/>',
download:'<path d="M12 3v13m-5-5 5 5 5-5M3 15v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5"/>',
mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
edit:'<path d="m16 3 5 5M3 21l5-1L21 7a3.5 3.5 0 0 0-5-5L3 15z"/>',
trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
link:'<path d="m10 13 4-4m-7 7-2 2a4 4 0 0 0 6 6l4-4a4 4 0 0 0 0-6M14 11l2-2a4 4 0 0 0-6-6L6 7a4 4 0 0 0 0 6" transform="translate(2 -1)"/>',
lock:'<rect x="4" y="10" width="16" height="12" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 15v3"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
hand:'<path d="M9 13V5a2 2 0 0 1 4 0v7-3a2 2 0 0 1 4 0v3a2 2 0 0 1 4 0v4c0 4-3 6-7 6-3 0-5-1-7-4l-4-5a2 2 0 0 1 3-2l3 3"/>',
light:'<path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',
trophy:'<path d="M7 3h10v7a5 5 0 0 1-10 0zM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 15v6M8 21h8"/>'
};
const icon=(name,cls='')=>'<svg class="icon '+cls+'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(icons[name]||icons.file)+'</svg>';
let state,view=location.hash.slice(1)||'dashboard',filter='전체',query='',sort='newest',dialogFocus,toastTimer,speech,importRows=[],busy=false;
const titles={dashboard:'내 대시보드',library:'경험 보관함',groups:'함께 기록',insights:'성장 인사이트',settings:'설정'};
const catIcon=name=>({'프로젝트':'layers','대외활동':'briefcase','동아리':'users','인턴십':'briefcase','학업':'book'}[name]||'folder');
const catColor=name=>state.categories.find(c=>c.name===name)?.color||'blue';
const tags=()=>[...new Set(state.entries.flatMap(e=>e.tags))];
const dateText=d=>new Date(d+'T00:00:00').toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\.$/,'');
const timeText=d=>new Date(d).toLocaleString('ko-KR',{month:'long',day:'numeric',hour:'numeric',minute:'2-digit'});
const dayKey=d=>new Date(d).toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'});
const initials=name=>esc((name||'나').slice(0,1));
const sampleCount=()=>state.entries.filter(e=>e.id.startsWith('sample-')).length;
const periodLabel=p=>p===1?'매일':p===30?'매월':'매주';
const btn=(label,action,cls='primary',ic='',extra='')=>'<button class="btn '+cls+'" data-action="'+action+'" '+extra+'>'+(ic?icon(ic):'')+label+'</button>';
async function api(path,method='GET',data){
 const res=await fetch('/api/'+path,{method,headers:method==='GET'?{}:{'content-type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});
 let result;try{result=await res.json()}catch{throw Error('서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.')}
 if(!res.ok)throw Error(result.error||'요청을 처리하지 못했어요.');return result;
}
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3400);}
function errorInDialog(message){let e=$('.form-error');if(!e){e=document.createElement('div');e.className='form-error';e.setAttribute('role','alert');$('.dialog-body')?.prepend(e);}if(e)e.textContent=message;else toast(message);}
async function refresh(){state=await api('state');render();}
function navigate(next){if(!titles[next])next='dashboard';view=next;location.hash=next;render();window.scrollTo({top:0,behavior:'smooth'});}
window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);if(titles[next]&&view!==next){view=next;render();}});
function render(){
 if(!titles[view])view='dashboard';
 const unread=state.notifications.filter(n=>!n.is_read).length;
 const nav=[['dashboard','home','내 대시보드'],['library','folder','경험 보관함'],['groups','users','함께 기록'],['insights','chart','성장 인사이트']];
 $('#app').innerHTML='<aside class="sidebar"><a class="brand" href="#dashboard" aria-label="에이머스 홈"><span class="brand-mark">a</span>에이머스</a><div class="workspace-label">MY WORKSPACE</div><nav class="nav" aria-label="주 메뉴">'+nav.map(([v,i,t])=>'<button data-action="nav" data-view="'+v+'" class="'+(view===v?'active':'')+'" '+(view===v?'aria-current="page"':'')+'>'+icon(i)+'<span>'+t+'</span>'+(v==='insights'?'<span class="small-pill">PRO</span>':'')+'</button>').join('')+'<div class="nav-separator"></div><button data-action="nav" data-view="settings" class="settings-nav '+(view==='settings'?'active':'')+'">'+icon('settings')+'<span>설정</span></button></nav><div class="sidebar-bottom"><div class="upgrade-card"><span class="premium-tag">AIMERS PREMIUM</span><p>쌓아온 경험을<br>더 큰 가능성으로 바꿔보세요.</p><button data-action="premium">프리미엄 알아보기'+icon('arrow')+'</button></div><button class="profile" data-action="nav" data-view="settings"><span class="avatar">'+initials(state.me.name)+'</span><span><strong>'+esc(state.me.name)+'</strong><small>무료 플랜</small></span>'+icon('settings')+'</button></div></aside><div class="shell"><header class="topbar"><div class="breadcrumb">'+icon('home')+icon('right')+'<span>'+titles[view]+'</span></div><a class="brand mobile-brand" href="#dashboard"><span class="brand-mark">a</span>에이머스</a><div class="top-actions"><span class="top-date">'+new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'long'})+'</span>'+(state.mode==='local'?'<span class="mode-tag">로컬 체험</span>':'')+'<button class="icon-button" data-action="notifications" aria-label="알림 '+unread+'개">'+icon('bell')+(unread?'<span class="notification-dot"></span>':'')+'</button><button class="avatar" data-action="nav" data-view="settings" aria-label="내 설정">'+initials(state.me.name)+'</button></div></header><main class="main">'+({dashboard:dashboard,library:library,groups:groups,insights:insights,settings:settings}[view])()+'</main></div>';
}
function heading(title,sub,action='',eyebrow=''){return '<div class="page-heading"><div>'+(eyebrow?'<div class="eyebrow">'+eyebrow+'</div>':'')+'<h1>'+title+'</h1>'+(sub?'<p>'+sub+'</p>':'')+'</div>'+action+'</div>';}
function notebook(){return '<div class="hero-art" aria-hidden="true"><div class="art-shadow"></div><div class="notebook"><div class="book-label">'+icon('check')+'</div><div class="line"></div><div class="line"></div><div class="line short"></div></div><div class="pencil"></div>'+icon('spark','art-star')+'<div class="art-dot"></div><div class="art-badge">'+icon('check')+'</div></div>';}
function weekStrip(){
 const today=new Date(state.today+'T12:00:00+09:00'),weekday=(today.getDay()+6)%7;
 const dates=new Set(state.entries.map(e=>dayKey(e.created_at)));
 return '<div class="week-strip">'+['월','화','수','목','금','토','일'].map((n,i)=>{const d=new Date(today.getTime()+(i-weekday)*86400000),key=dayKey(d),done=dates.has(key);return '<div class="day '+(done?'done ':'')+(key===state.today?'today':'')+'"><span>'+n+'</span><span class="day-dot" title="'+key+(done?' 작성 완료':'')+'">'+(done?icon('check'):'')+'</span></div>';}).join('')+'</div>';
}
function entryCard(e){return '<button class="entry-card" data-action="detail" data-id="'+esc(e.id)+'"><div class="entry-top"><span class="entry-icon tone-'+catColor(e.category)+'">'+icon(catIcon(e.category))+'</span><span class="entry-category">'+esc(e.category)+'</span>'+(e.id.startsWith('sample-')?'<span class="sample">예시</span>':'')+'</div><h3>'+esc(e.title)+'</h3><p>'+esc(e.summary.context||e.original)+'</p><div class="tags">'+e.tags.map(t=>'<span class="tag">#'+esc(t)+'</span>').join('')+'</div><div class="entry-footer"><span>'+icon('calendar')+dateText(e.date)+'</span><span>기록 보기'+icon('right')+'</span></div></button>';}
function dashboard(){
 const days=new Set(state.entries.map(e=>dayKey(e.created_at))).size;
 const firstGroup=state.groups[0];
 return heading(esc(state.me.name)+'님, 오늘도 한 걸음 더.','잊히기 아까운 경험, 차곡차곡 모아볼까요?',btn('경험 기록하기','write','primary','plus'),'나의 가능성이 자라는 곳')+
 '<div class="hero-row"><section class="hero"><div class="hero-copy"><div class="hero-kicker">나를 위한 가장 작은 습관</div><h2>오늘의 경험이<br>내일의 나를 만드니까.</h2><p>대단한 성과가 아니어도 좋아요. 오늘부터 기록해요.</p>'+btn('오늘의 경험 남기기','write','primary','edit')+'</div>'+notebook()+'</section><section class="panel streak-panel"><div class="panel-kicker">'+icon('fire')+'나의 기록 스트릭</div><div class="streak-head"><div class="streak-number">'+state.streak+'<small>일 연속</small></div><div class="fire-orb">'+icon('fire')+'</div></div><p class="muted">'+(state.streak?'좋은 흐름이에요. 오늘도 이어가 볼까요?':'오늘 첫 번째 기록을 시작해 보세요.')+'</p>'+weekStrip()+'</section></div>'+
 '<div class="stats-row">'+[['file','blue','쌓아온 경험',state.entries.length,'개','나만의 이야기'],['calendar','purple','기록한 날',days,'일','꾸준함의 힘'],['spark','mint','발견한 역량',tags().length,'개','기록에 담긴 태그']].map(([i,c,l,n,u,h])=>'<div class="stat"><span class="stat-icon tone-'+c+'">'+icon(i)+'</span><div><label>'+l+'</label><strong>'+n+'<small>'+u+'</small></strong></div><span class="stat-note">'+h+'</span></div>').join('')+'</div>'+
 '<div class="content-grid"><section><div class="section-heading"><h2>최근 나의 경험 <span>'+state.entries.length+'</span></h2><button class="text-button" data-action="nav" data-view="library">전체 보기'+icon('right')+'</button></div>'+(state.entries.length?'<div class="cards-grid">'+state.entries.slice(0,4).map(entryCard).join('')+'</div>':empty('아직 기록한 경험이 없어요','첫 경험을 남기면 나만의 이야기가 쌓이기 시작해요.','경험 기록하기','write'))+'</section><aside class="side-stack"><section><div class="section-heading"><h2>함께 기록하는 우리</h2>'+icon('users')+'</div>'+(firstGroup?miniGroup(firstGroup):'<div class="panel group-empty"><div class="avatar-stack" aria-hidden="true"><span class="avatar">'+icon('user')+'</span><span class="avatar">'+icon('user')+'</span><span class="avatar">'+icon('user')+'</span></div><h3>함께하면 꾸준해져요</h3><p>서로의 작은 성장을 응원하는<br>나만의 기록 메이트를 만나보세요.</p>'+btn('첫 그룹 만들기','create-group','secondary full','plus')+'</div>')+'</section><section class="panel tip-card"><h3>'+icon('light')+'오늘의 기록 팁</h3><p>무엇을 했는지보다 어떻게 했는지를<br>적어보세요. 그 안에 나의 강점이 있어요.</p></section></aside></div><div class="page-foot">'+(sampleCount()?'예시 기록 '+sampleCount()+'개가 포함되어 있어요. 설정에서 지우고 나만의 기록을 시작할 수 있어요.':'작은 기록이 모여, 나만의 가능성이 됩니다.')+'</div>';
}
function miniGroup(g){const done=g.members.filter(m=>m.done).length;return '<div class="panel"><div class="group-title"><span class="stat-icon tone-blue">'+icon('users')+'</span><div><h2 style="font-size:14px">'+esc(g.name)+'</h2><p>'+periodLabel(g.period)+' 한 번, 함께 기록해요</p></div></div><div class="progress-top"><span>이번 기간 작성 현황</span><strong>'+done+' / '+g.members.length+'</strong></div><div class="progress-track"><div class="progress-fill" style="width:'+done/g.members.length*100+'%"></div></div><div class="divider"></div>'+btn('우리 그룹 보기','nav','secondary full','','data-view="groups"')+'</div>';}
function empty(title,sub,label,action){return '<div class="empty-state">'+icon('folder')+'<h3>'+title+'</h3><p>'+sub+'</p>'+(label?btn(label,action,'primary','plus'):'')+'</div>';}
function library(){
 let entries=state.entries.filter(e=>(filter==='전체'||e.category===filter)&&(!query||(e.title+' '+e.original+' '+e.tags.join(' ')).toLowerCase().includes(query.toLowerCase())));
 if(sort==='oldest')entries=[...entries].reverse();
 return heading('경험 보관함','작은 경험도, 나만의 이야기가 되는 곳.',btn('경험 기록하기','write','primary','plus'))+
 '<div class="toolbar"><div class="searchbox">'+icon('search')+'<input id="search" aria-label="경험 검색" placeholder="제목, 내용, 역량으로 검색해 보세요" value="'+esc(query)+'"></div><div style="display:flex;gap:9px"><select id="sort" class="input select-compact" aria-label="경험 정렬"><option value="newest" '+(sort==='newest'?'selected':'')+'>최신 활동순</option><option value="oldest" '+(sort==='oldest'?'selected':'')+'>오래된 활동순</option></select>'+btn('지난 경험 등록','import','white','upload')+'</div></div><div class="filter-row">'+['전체',...state.categories.map(c=>c.name)].map(c=>'<button class="filter '+(filter===c?'active':'')+'" data-action="filter" data-category="'+esc(c)+'">'+esc(c)+'<span>'+(c==='전체'?state.entries.length:state.entries.filter(e=>e.category===c).length)+'</span></button>').join('')+'<button class="filter" data-action="category">'+icon('plus')+'카테고리</button></div><div class="section-heading"><span class="note">총 '+entries.length+'개의 경험'+(query?' 검색 결과':'')+'</span></div>'+(entries.length?'<div class="library-grid">'+entries.map(entryCard).join('')+'</div>':empty('아직 이곳에 담긴 경험이 없어요',query?'다른 검색어나 카테고리로 찾아보세요.':'첫 번째 경험을 기록해 보세요.',query?'':'경험 기록하기','write'));
}
function groups(){
 return heading('함께 기록','서로의 꾸준함을 응원하며, 한 걸음씩 함께.',btn('새 그룹 만들기','create-group','primary','plus'))+
 '<div class="group-layout"><section>'+(state.groups.length?state.groups.map(groupCard).join(''):empty('나의 첫 기록 메이트를 만나보세요','그룹을 만들고 초대 링크를 나누세요.<br>친구와 함께 기록하는 습관을 만들 수 있어요.','그룹 만들기','create-group'))+'</section><aside><div class="panel"><span class="stat-icon tone-blue">'+icon('users')+'</span><h3 style="font-size:16px;margin:20px 0 13px">같이 쓰는 기록의 힘</h3><p class="note">1. 우리에게 맞는 기록 주기를 정해요.<br><br>2. 초대 링크로 친구들을 초대해요.<br><br>3. 작성 현황을 보고 서로 응원해요.</p><div class="divider"></div><p class="note">'+icon('lock')+' 개인 기록의 내용은 공유되지 않아요. 그룹에는 작성 여부와 스트릭만 보여요.</p></div><div class="panel tip-card" style="margin-top:18px"><h3>'+icon('hand')+'부담 없이, 가볍게 콕</h3><p>아직 기록하지 못한 친구에게 응원을 보내요. 알림은 친구의 앱 알림함에 도착해요.</p></div></aside></div>';
}
function groupCard(g){
 const done=g.members.filter(m=>m.done).length;
 return '<div class="panel group-card"><div class="group-title"><span class="stat-icon tone-blue">'+icon('users')+'</span><div><h2>'+esc(g.name)+'</h2><p>'+esc(g.description||'함께 쌓아가는 우리의 성장 기록')+'</p></div>'+btn('초대하기','invite','white small','link','data-id="'+g.id+'"')+'</div><div class="group-progress"><div class="progress-top"><span>'+periodLabel(g.period)+' 기록 / '+dateText(g.start)+'부터</span><strong>'+done+'명 작성 완료 / '+g.members.length+'명</strong></div><div class="progress-track"><div class="progress-fill" style="width:'+done/g.members.length*100+'%"></div></div></div>'+g.members.map(m=>'<div class="member-row"><span class="avatar">'+initials(m.name)+'</span><div class="member-info"><strong>'+esc(m.name)+(m.id===state.me.id?' (나)':'')+'</strong><small>'+m.streak+'일 연속 기록</small></div><span class="status '+(m.done?'complete':'')+'">'+icon(m.done?'check':'clock')+(m.done?'작성 완료':'기록 기다리는 중')+'</span>'+(!m.done&&m.id!==state.me.id?btn('콕 찌르기','poke','secondary small','hand','data-group="'+g.id+'" data-user="'+m.id+'"'):'')+'</div>').join('')+'</div>';
}
function insights(){
 const features=[['mic','blue','면접 질문 연습','기록한 경험을 돌아보며, 나만의 답변을 미리 준비해요.','questions'],['chart','purple','학기별 성장 보고서','한 학기 동안 쌓인 경험과 역량을 한눈에 돌아봐요.','report'],['spark','mint','자소서 경험 찾기','자소서 문항과 연결할 수 있는 경험을 찾아보세요.','recommend']];
 return heading('성장 인사이트','쌓아온 경험에서, 다음 가능성을 발견해요.')+'<div class="insight-banner"><div><span class="pill">PREMIUM PREVIEW</span><h2>기록에서 끝나지 않는 성장.</h2><p>내 경험을 면접과 자소서로 연결하는 도구를 미리 살펴보세요.<br>현재는 기록 기반 기능 미리보기이며, AI 생성과 결제는 연결되지 않았어요.</p></div>'+icon('spark')+'</div><div class="insight-grid">'+features.map(([i,c,t,p,a])=>'<section class="panel feature-card"><span class="stat-icon tone-'+c+'">'+icon(i)+'</span><h3>'+t+'</h3><p>'+p+'</p>'+btn('미리보기',a,'white small','arrow')+'</section>').join('')+'</div><div class="panel" style="margin-top:26px"><div class="section-heading"><h2>나의 경험 지도</h2><span class="note">카테고리별 기록 수</span></div><div class="bar-chart">'+state.categories.map(c=>{const n=state.entries.filter(e=>e.category===c.name).length,max=Math.max(1,...state.categories.map(x=>state.entries.filter(e=>e.category===x.name).length));return '<div class="bar-col"><span class="bar-count">'+n+'</span><div class="bar" style="height:'+Math.max(3,n/max*105)+'px"></div><span>'+esc(c.name)+'</span></div>';}).join('')+'</div></div>';
}
function settings(){
 return heading('나에게 맞는 기록 습관','꾸준히 기록할 수 있도록, 나만의 방식을 정해요.')+'<div class="settings-grid"><div><form id="profile-form" class="panel"><div class="section-heading"><h2>프로필과 기록 주기</h2></div><div class="field"><label for="profile-name">이름</label><input class="input" id="profile-name" name="name" maxlength="30" required value="'+esc(state.me.name)+'"></div><div class="field"><label for="cadence">기록 주기</label><select id="cadence" name="cadence">'+[[1,'매일'],[7,'매주'],[30,'매월']].map(([v,l])=>'<option value="'+v+'" '+(state.me.cadence===v?'selected':'')+'>'+l+' 한 번 기록하기</option>').join('')+'</select><span class="field-help">기록 주기에 따라 앱 알림함에서 작성 여부를 알려드려요. 외부 푸시 알림은 아직 지원하지 않아요.</span></div><button class="btn primary" type="submit">변경 사항 저장</button></form><section class="panel" style="margin-top:22px"><div class="section-heading"><h2>나의 카테고리</h2>'+btn('추가','category','secondary small','plus')+'</div><div class="category-manage">'+state.categories.map(c=>'<span class="tag tone-'+c.color+'">'+esc(c.name)+'</span>').join('')+'</div><p class="note">나에게 맞는 카테고리를 만들어 경험을 정리해 보세요.</p></section></div><aside><section class="panel"><div class="section-heading"><h2>기록 데이터 관리</h2></div><p class="note">내 기록을 JSON 파일로 보관할 수 있어요. 원문과 정리본을 모두 포함해요.</p>'+btn('전체 기록 내보내기','export','white full','download','style="margin-top:17px"')+btn('지난 경험 일괄 등록','import','ghost full','upload','style="margin-top:9px"')+'<div class="divider"></div><p class="note">'+(sampleCount()?'현재 예시 기록 '+sampleCount()+'개가 있어요. 직접 작성한 기록은 유지돼요.':'기능을 둘러보고 싶다면 예시 기록을 추가할 수 있어요.')+'</p>'+btn(sampleCount()?'예시 기록 지우기':'예시 기록 둘러보기',sampleCount()?'clear-samples':'add-samples','ghost full','','style="margin-top:13px"')+'</section><section class="panel tip-card" style="margin-top:20px"><h3>'+icon('lock')+'나의 기록은 나의 것</h3><p>'+(state.mode==='local'?'현재 로컬 체험 모드예요. 이 브라우저의 식별 정보와 PC의 데이터베이스에 기록이 저장돼요. 다른 브라우저에서는 별도 사용자로 시작해요.':'로그인한 계정에 기록이 저장돼요. 그룹 멤버에게 원문은 공개되지 않아요.')+'</p></section></aside></div>';
}
function openDialog(title,sub,body,footer='',wide=false){
 if(!$('.dialog'))dialogFocus=document.activeElement;
 $('#overlay').innerHTML='<div class="dialog-backdrop"><section class="dialog '+(wide?'wide':'')+'" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><header class="dialog-header"><div><h2 id="dialog-title">'+title+'</h2>'+(sub?'<p>'+sub+'</p>':'')+'</div><button class="icon-button" data-action="close" aria-label="닫기">'+icon('close')+'</button></header><div class="dialog-body">'+body+'</div>'+(footer?'<footer class="dialog-footer">'+footer+'</footer>':'')+'</section></div>';
 document.body.style.overflow='hidden';
 requestAnimationFrame(()=>($('.dialog [autofocus]')||$('.dialog input')||$('.dialog button'))?.focus());
}
function closeDialog(){
 if(speech){speech.stop();speech=null;}
 $('#overlay').innerHTML='';document.body.style.overflow='';
 if(dialogFocus?.isConnected)dialogFocus.focus();
}
function localSummary(original){
 const sentences=original.split(/\n+|(?<=[.!?。])\s+/u).map(s=>s.trim()).filter(Boolean),pick=re=>sentences.filter(s=>re.test(s)).join(' ').slice(0,650);
 return {context:sentences.slice(0,2).join(' ').slice(0,650),action:pick(/담당|맡|진행|기획|분석|제안|개발|설계|인터뷰|만들|조사|해결|작성/),result:pick(/결과|배웠|배운|느꼈|성과|달성|향상|개선|증가|감소|수상|완료|성장|중요|깨달/)};
}
function summaryHtml(s){return [['context','어떤 경험이었나요','활동의 배경이나 상황을 적어보세요.'],['action','나는 무엇을 했나요','내가 맡은 역할과 직접 한 행동을 적어보세요.'],['result','무엇을 얻었나요','결과나 배운 점을 구체적으로 남겨보세요.']].map(([key,title,hint])=>'<div class="summary-section"><h4>'+title+'</h4><p class="'+(s[key]?'':'missing')+'">'+esc(s[key]||hint)+'</p></div>').join('');}
function writeEntry(id){
 const e=state.entries.find(x=>x.id===id);
 let draft=null;if(!e){try{draft=JSON.parse(sessionStorage.getItem('aimers-draft')||'null')}catch{}}
 const d=e||draft||{title:'',category:state.categories[0]?.name||'대외활동',date:state.today,original:'',tags:[]};
 openDialog(e?'경험 수정하기':'오늘의 경험 남기기','작은 순간도 좋아요. 나의 언어로 편하게 적어보세요.',
 '<form id="entry-form" data-id="'+esc(e?.id||'')+'"><div class="field"><label for="entry-title">경험 제목</label><input class="input" id="entry-title" name="title" maxlength="120" placeholder="어떤 경험을 했나요?" required autofocus value="'+esc(d.title)+'"></div><div class="form-row"><div class="field"><label for="entry-category">카테고리</label><select id="entry-category" name="category">'+state.categories.map(c=>'<option '+(c.name===d.category?'selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div><div class="field"><label for="entry-date">활동 날짜</label><input class="input" id="entry-date" type="date" name="date" required max="'+state.today+'" value="'+esc(d.date)+'"></div></div><div class="editor-grid"><div><div class="voice-row"><label for="entry-original">나의 경험 원문</label><button class="voice-button" type="button" data-action="voice">'+icon('mic')+'말로 기록하기</button></div><textarea id="entry-original" name="original" maxlength="20000" required rows="12" placeholder="어떤 활동을 했나요?&#10;내가 맡은 역할은 무엇이었나요?&#10;어려웠던 점과 해결한 방법은 무엇인가요?&#10;결과와 배운 점을 남겨보세요.">'+esc(d.original)+'</textarea><p class="field-help" style="margin-top:8px">편하게 쓴 원문은 정리본과 별도로 보관돼요.</p></div><aside class="summary-preview"><h3>'+icon('spark')+'원문 기반 정리</h3><p class="field-help">AI 연결 전 기본 정리 모드예요.<br>작성한 문장을 그대로 뽑아 정리해요.</p><div id="live-summary">'+summaryHtml(localSummary(d.original))+'</div></aside></div><div class="field" style="margin-top:23px;margin-bottom:0"><label for="entry-tags">발견한 역량</label><input class="input" name="tags" id="entry-tags" placeholder="협업, 문제해결, 리더십" maxlength="150" value="'+esc(d.tags.join(', '))+'"><span class="field-help">쉼표로 구분해 최대 6개까지 적어주세요.</span></div></form>',
 '<span class="note">'+icon('lock')+' 나에게만 보이는 기록이에요.</span>'+btn('취소','close','ghost')+'<button class="btn primary" type="submit" form="entry-form">'+icon('check')+'기록 저장하기</button>',true);
}
function detail(id,tab='summary'){
 const e=state.entries.find(x=>x.id===id);if(!e)return;
 openDialog(esc(e.title),'', '<div class="detail-meta"><span class="tag tone-'+catColor(e.category)+'">'+esc(e.category)+'</span><span>'+dateText(e.date)+'</span>'+(e.id.startsWith('sample-')?'<span>예시 기록</span>':'')+e.tags.map(t=>'<span class="tag">#'+esc(t)+'</span>').join('')+'</div><div class="tabs"><button class="tab '+(tab==='summary'?'active':'')+'" data-action="detail-tab" data-id="'+id+'" data-tab="summary">정리본</button><button class="tab '+(tab==='original'?'active':'')+'" data-action="detail-tab" data-id="'+id+'" data-tab="original">원문 보기</button></div>'+(tab==='original'?'<div class="original-text">'+esc(e.original)+'</div>':'<div class="form-note">원문에서 관련 문장을 추출한 정리본이에요. 원문은 그대로 보관되어 있어요.</div>'+summaryHtml(e.summary)),btn('삭제','delete-entry','danger small','trash','data-id="'+id+'"')+btn('수정하기','edit-entry','white small','edit','data-id="'+id+'"')+btn('확인','close','primary small'),true);
}
function categoryDialog(){openDialog('나만의 카테고리','경험을 나에게 맞는 방식으로 분류해 보세요.','<form id="category-form"><div class="field"><label for="category-name">카테고리 이름</label><input class="input" name="name" id="category-name" placeholder="예: 봉사활동, 공모전" maxlength="40" required autofocus></div><div class="field"><label for="category-color">카테고리 색상</label><select id="category-color" name="color">'+[['blue','파랑'],['purple','보라'],['mint','민트'],['orange','주황'],['pink','분홍'],['gray','회색']].map(([v,n])=>'<option value="'+v+'">'+n+'</option>').join('')+'</select></div></form>',btn('취소','close','ghost')+'<button class="btn primary" type="submit" form="category-form">카테고리 추가</button>');}
function createGroup(){openDialog('함께 기록할 그룹 만들기','우리에게 맞는 주기로 꾸준함을 쌓아보세요.','<form id="group-form"><div class="field"><label for="group-name">그룹 이름</label><input class="input" id="group-name" name="name" required maxlength="60" placeholder="예: 일요일의 기록 메이트" autofocus></div><div class="field"><label for="group-desc">어떤 그룹인가요?</label><input class="input" id="group-desc" name="description" maxlength="200" placeholder="서로의 작은 성장을 응원하는 우리"></div><div class="field"><label for="group-period">함께 기록하는 주기</label><select id="group-period" name="period"><option value="7">매주 한 번 / 월요일부터 일요일까지</option><option value="1">매일 한 번 / 자정 기준</option><option value="30">매월 한 번 / 매월 1일부터 말일까지</option></select></div><div class="form-note">'+icon('lock')+' 멤버에게는 작성 여부만 보여요. 개인 기록 내용은 공개되지 않아요.</div></form>',btn('취소','close','ghost')+'<button class="btn primary" type="submit" form="group-form">그룹 만들기</button>');}
function inviteDialog(id){const g=state.groups.find(g=>g.id===id),link=location.origin+'/?invite='+encodeURIComponent(g.token);openDialog('기록 메이트를 초대해요',esc(g.name),'<p class="note" style="margin-bottom:18px">아래 링크를 복사해서 함께 기록하고 싶은 친구에게 보내세요.</p><div class="link-box">'+esc(link)+'</div><div class="form-note" style="margin-top:18px">'+(state.mode==='local'?'현재 PC의 로컬 체험 링크예요. 같은 PC의 다른 브라우저에서 참여 흐름을 확인할 수 있어요. 외부 친구 초대에는 배포가 필요해요.':'초대받은 사람은 이 사이트에 접근 가능한 계정으로 로그인해야 해요. 현재 사이트 접근 권한과 그룹 참여는 별개예요.')+'</div>',btn('닫기','close','ghost')+btn('초대 링크 복사','copy-invite','primary','link','data-id="'+id+'"'));}
function premium(){openDialog('경험이 더 넓은 가능성으로','AIMERS PREMIUM','<div class="form-note">프리미엄은 현재 기능 미리보기 단계예요. 결제되거나 구독이 시작되지 않아요.</div><div class="summary-section"><h4>무료로 시작하는 기록 습관</h4><p>경험 기록, 원문 보관, 카테고리 관리, 음성 입력, 지난 경험 등록, 그룹과 스트릭을 사용할 수 있어요.</p></div><div class="summary-section"><h4>프리미엄으로 준비하는 다음 단계</h4><p>면접 질문 연습, 학기별 성장 보고서, 자소서 경험 추천을 미리 살펴볼 수 있어요. AI 생성과 공개 공유 및 댓글은 아직 제공되지 않아요.</p></div>',btn('기능 미리보기','go-insights','primary','arrow'));}
function notifications(){
 const start=state.me.cadence===1?state.today:state.me.cadence===30?state.today.slice(0,7)+'-01':(()=>{const d=new Date(state.today+'T12:00:00+09:00');return dayKey(new Date(d.getTime()-((d.getDay()+6)%7)*86400000))})();
 const done=state.entries.some(e=>dayKey(e.created_at)>=start);
 const reminder='<div class="notification-item '+(!done?'unread':'')+'">'+icon(done?'check':'edit')+' '+(done?'이번 기록 주기의 경험을 남겼어요. 잘 이어가고 있어요.':'이번 기록 주기의 경험이 아직 없어요. 오늘의 순간을 남겨보세요.')+'<small>나의 '+periodLabel(state.me.cadence)+' 기록 알림</small></div>';
 openDialog('나의 알림','작은 응원이 꾸준함으로 이어져요.',reminder+state.notifications.map(n=>'<div class="notification-item '+(!n.is_read?'unread':'')+'">'+esc(n.body)+'<small>'+timeText(n.created_at)+'</small></div>').join('')+(state.notifications.length?'':'<p class="note" style="text-align:center;padding:17px">아직 도착한 그룹 알림이 없어요.</p>'),btn('모두 읽음으로 표시','read-notifications','secondary')+btn('확인','close','primary'));
}
function importDialog(){
 importRows=[];
 openDialog('지난 경험 한 번에 담기','흩어져 있던 경험을 나의 보관함에 모아보세요.','<div class="import-zone">'+icon('upload')+'<p style="margin-top:10px">JSON 파일을 선택하거나 아래 형식으로 입력해 주세요.</p><input type="file" id="import-file" accept=".json,application/json" aria-label="경험 JSON 파일 선택"></div><div class="field"><label for="import-text">한 줄에 하나의 경험</label><textarea id="import-text" rows="5" placeholder="2026-10-01 | 대외활동 | 마케팅 서포터즈 | 캠페인을 기획하고 콘텐츠 제작을 담당했다.&#10;2026-10-15 | 프로젝트 | 첫 해커톤 | 팀에서 화면 설계를 맡고 시연을 완료했다."></textarea><span class="field-help">날짜 | 카테고리 | 제목 | 활동 내용<br>최대 50개까지 등록할 수 있어요. 새로운 카테고리는 자동으로 만들어져요.</span></div><div id="import-preview"></div>',btn('형식 예시 받기','import-template','ghost','download')+btn('미리 확인하기','preview-import','secondary')+'<button class="btn primary" data-action="save-import" disabled>등록하기</button>',true);
}
function parseImport(){
 const text=$('#import-text').value.trim();if(!text)throw Error('등록할 경험을 입력해 주세요.');
 let parsed;if(text.startsWith('[')||text.startsWith('{')){try{const data=JSON.parse(text);parsed=Array.isArray(data)?data:data.entries}catch{throw Error('JSON 형식을 확인해 주세요.')}}else parsed=text.split('\n').filter(s=>s.trim()).map((line,i)=>{const parts=line.split('|').map(s=>s.trim());if(parts.length<4)throw Error((i+1)+'번째 줄의 형식을 확인해 주세요.');return{date:parts[0],category:parts[1],title:parts[2],original:parts.slice(3).join(' | '),tags:[]};});
 if(!Array.isArray(parsed)||!parsed.length||parsed.length>50)throw Error('1개부터 50개까지 등록해 주세요.');
 parsed.forEach((e,i)=>{if(!e.title||!e.category||!e.original||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||!Number.isFinite(Date.parse(e.date))||new Date(e.date).toISOString().slice(0,10)!==e.date||e.date>state.today)throw Error((i+1)+'번째 경험의 제목, 내용과 날짜를 확인해 주세요.');});
 return parsed.map(e=>({title:e.title,category:e.category,date:e.date,original:e.original,tags:Array.isArray(e.tags)?e.tags:[]}));
}
function download(name,data,type='application/json'){const url=URL.createObjectURL(new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function questions(){
 if(!state.entries.length){toast('먼저 경험을 기록해 주세요.');return;}
 openDialog('내 경험으로 면접 준비하기','기록을 넣어 만든 기본 질문 템플릿이에요. AI 생성은 연결 전이에요.','<div class="field"><label for="question-entry">연습할 경험</label><select id="question-entry">'+state.entries.map(e=>'<option value="'+e.id+'">'+esc(e.title)+'</option>').join('')+'</select></div><div id="question-list"></div>',btn('닫기','close','primary'),true);renderQuestions(state.entries[0].id);
}
function renderQuestions(id){
 const e=state.entries.find(e=>e.id===id);
 $('#question-list').innerHTML=['이 경험에서 본인이 직접 맡은 역할은 무엇인가요?','진행 과정에서 가장 어려웠던 점과 해결 방법을 구체적으로 설명해 주세요.','결과를 어떻게 확인했으며, 이 경험에서 배운 점을 다음 활동에 어떻게 활용할 수 있나요?'].map((q,i)=>'<div class="question-card"><div class="number">QUESTION 0'+(i+1)+'</div><h4>'+q+'</h4><p>연습 경험: '+esc(e.title)+'</p><textarea class="answer-input" aria-label="'+(i+1)+'번 답변 연습" style="min-height:80px;margin-top:12px;font-size:12px" placeholder="핵심부터 말하고, 구체적인 사례를 덧붙여 보세요."></textarea></div>').join('');
}
let reportRows=[];
function semesterKey(date){const year=Number(date.slice(0,4)),month=Number(date.slice(5,7));return (month<3?year-1:year)+'-'+(month>=3&&month<=8?'1':'2');}
function report(){
 const semesters=[...new Set([semesterKey(state.today),...state.entries.map(e=>semesterKey(e.date))])].sort().reverse();
 openDialog('나의 학기별 성장 보고서','기록 수와 직접 붙인 역량 태그를 정리한 보고서예요.','<div class="field"><label for="report-semester">돌아볼 학기</label><select id="report-semester">'+semesters.map(s=>'<option value="'+s+'">'+s.split('-')[0]+'년 '+s.split('-')[1]+'학기</option>').join('')+'</select></div><div id="report-content"></div>',btn('보고서 내려받기','download-report','primary','download'),true);renderReport(semesters[0]);
}
function renderReport(semester){
 reportRows=state.entries.filter(e=>semesterKey(e.date)===semester);
 const ts=[...new Set(reportRows.flatMap(e=>e.tags))],cs=new Set(reportRows.map(e=>e.category));
 $('#report-content').innerHTML='<div class="report-stat"><div><strong>'+reportRows.length+'</strong><span>쌓아온 경험</span></div><div><strong>'+cs.size+'</strong><span>경험 카테고리</span></div><div><strong>'+ts.length+'</strong><span>기록한 역량</span></div></div><h3 style="font-size:14px">기록에서 발견한 역량</h3><div class="badge-row">'+(ts.length?ts.map(t=>'<span class="tag tone-blue">'+esc(t)+'</span>').join(''):'<span class="note">아직 남긴 역량 태그가 없어요.</span>')+'</div><div class="divider"></div><h3 style="font-size:14px;margin-bottom:16px">이번 학기의 순간들</h3>'+reportRows.map(e=>'<div class="question-card"><div class="number">'+dateText(e.date)+' / '+esc(e.category)+'</div><h4>'+esc(e.title)+'</h4><p>'+esc(e.summary.result||e.summary.context)+'</p></div>').join('')+(!reportRows.length?'<p class="note">이 학기에 기록한 경험이 없어요.</p>':'');
}
function recommend(){openDialog('자소서에 담을 경험 찾기','문항과 기록의 키워드를 비교해 경험을 찾아드려요. AI 추천은 연결 전이에요.','<form id="recommend-form"><div class="field"><label for="essay-question">자소서 문항</label><textarea id="essay-question" name="question" required rows="3" style="min-height:100px" placeholder="팀원과 협업해 문제를 해결했던 경험을 작성해 주세요."></textarea></div><button class="btn primary" type="submit">'+icon('search')+'경험 찾아보기</button></form><div id="recommend-results" style="margin-top:23px"></div>',btn('닫기','close','ghost'),true);}
function voice(){
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Speech){toast('이 브라우저는 음성 입력을 지원하지 않아요. Chrome 또는 Edge에서 사용해 주세요.');return;}
 if(speech){speech.stop();speech=null;return;}
 speech=new Speech();speech.lang='ko-KR';speech.continuous=true;speech.interimResults=false;
 const button=$('[data-action="voice"]'),textarea=$('#entry-original');
 speech.onstart=()=>{button.classList.add('recording');button.innerHTML=icon('mic')+'녹음 중지';};
 speech.onresult=e=>{let text='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)text+=e.results[i][0].transcript+' ';textarea.value=(textarea.value+(textarea.value?'\n':'')+text.trim()).slice(0,20000);textarea.dispatchEvent(new Event('input',{bubbles:true}));};
 speech.onerror=e=>toast(e.error==='not-allowed'?'마이크 사용 권한을 허용해 주세요.':'음성 인식을 완료하지 못했어요. 연결 상태를 확인해 주세요.');
 speech.onend=()=>{button.classList.remove('recording');button.innerHTML=icon('mic')+'말로 기록하기';speech=null;};
 try{speech.start();}catch{toast('음성 입력을 시작하지 못했어요.');speech=null;}
}
document.addEventListener('click',async event=>{
 const el=event.target.closest('[data-action]');if(!el||el.disabled)return;
 const a=el.dataset.action;try{
 if(a==='nav')navigate(el.dataset.view);
 else if(a==='write')writeEntry();
 else if(a==='close')closeDialog();
 else if(a==='detail')detail(el.dataset.id);
 else if(a==='detail-tab')detail(el.dataset.id,el.dataset.tab);
 else if(a==='edit-entry')writeEntry(el.dataset.id);
 else if(a==='delete-entry'){const id=el.dataset.id;openDialog('이 경험을 삭제할까요?','삭제하면 원문과 정리본을 복구할 수 없어요.','<p class="note">삭제할 경험: '+esc(state.entries.find(e=>e.id===id).title)+'</p>',btn('취소','close','ghost')+btn('삭제하기','confirm-delete','danger','trash','data-id="'+id+'"'));}
 else if(a==='confirm-delete'){el.disabled=true;await api('entries/'+el.dataset.id,'DELETE',{});closeDialog();await refresh();toast('경험을 삭제했어요.');}
 else if(a==='filter'){filter=el.dataset.category;render();}
 else if(a==='category')categoryDialog();
 else if(a==='create-group')createGroup();
 else if(a==='invite')inviteDialog(el.dataset.id);
 else if(a==='copy-invite'){const g=state.groups.find(g=>g.id===el.dataset.id);await navigator.clipboard.writeText(location.origin+'/?invite='+encodeURIComponent(g.token));toast('초대 링크를 복사했어요.');}
 else if(a==='poke'){el.disabled=true;await api('poke','POST',{groupId:el.dataset.group,userId:el.dataset.user});toast('멤버의 알림함에 응원을 보냈어요.');await refresh();}
 else if(a==='premium')premium();
 else if(a==='go-insights'){closeDialog();navigate('insights');}
 else if(a==='notifications')notifications();
 else if(a==='read-notifications'){await api('notifications/read','POST',{});await refresh();notifications();toast('모든 알림을 읽음으로 표시했어요.');}
 else if(a==='import')importDialog();
 else if(a==='import-template')download('aimers-import-example.json',[{date:state.today,category:'프로젝트',title:'프로젝트에서 배운 협업',original:'팀 프로젝트에서 일정 관리를 담당했다. 매주 회의를 진행하고 목표에 맞춰 역할을 조정했다. 일정을 지키며 결과물을 완성했다.',tags:['협업','기획력']}]);
 else if(a==='preview-import'){importRows=parseImport();$('#import-preview').innerHTML='<div class="inline-success">'+importRows.length+'개의 경험을 등록할 준비가 되었어요.</div><div class="import-preview">'+importRows.map(e=>'<div>'+esc(e.title)+'<small>'+esc(e.date)+' / '+esc(e.category)+'</small></div>').join('')+'</div>';$('[data-action="save-import"]').disabled=false;}
 else if(a==='save-import'){el.disabled=true;const rows=parseImport();await api('import','POST',{entries:rows});closeDialog();await refresh();navigate('library');toast(rows.length+'개의 지난 경험을 등록했어요.');}
 else if(a==='export'){download('aimers-records-'+state.today+'.json',{exportedAt:new Date().toISOString(),entries:state.entries});toast('원문과 정리본을 파일로 내보냈어요.');}
 else if(a==='clear-samples')openDialog('예시 기록을 지울까요?','직접 작성한 기록은 그대로 유지돼요.','<p class="note">예시 기록 '+sampleCount()+'개를 삭제하고 나만의 기록으로 채워보세요.</p>',btn('취소','close','ghost')+btn('예시 기록 지우기','confirm-clear-samples','danger'));
 else if(a==='confirm-clear-samples'){el.disabled=true;await api('samples','DELETE',{});closeDialog();await refresh();toast('예시 기록을 지웠어요.');}
 else if(a==='add-samples'){el.disabled=true;await api('samples','POST',{});await refresh();toast('예시 기록 8개를 추가했어요.');}
 else if(a==='voice')voice();
 else if(a==='questions')questions();
 else if(a==='report')report();
 else if(a==='recommend')recommend();
 else if(a==='download-report'){const text='에이머스 성장 보고서\n'+$('#report-semester').value.replace('-','년 ')+'학기\n\n'+reportRows.map(e=>e.date+' / '+e.category+'\n'+e.title+'\n'+(e.summary.result||e.summary.context)+'\n역량: '+e.tags.join(', ')).join('\n\n');download('aimers-growth-report.txt',text,'text/plain;charset=utf-8');}
 else if(a==='join'){el.disabled=true;await api('join','POST',{token:el.dataset.token});closeDialog();history.replaceState(null,'',location.pathname+'#groups');view='groups';await refresh();toast('그룹에 참여했어요. 함께 기록해 봐요.');}
 else if(a==='retry'){await start();}
 }catch(e){if($('.dialog'))errorInDialog(e.message);else toast(e.message);el.disabled=false;}
});
document.addEventListener('submit',async event=>{
 const form=event.target;event.preventDefault();if(busy)return;
 if(form.id==='recommend-form'){
 const question=new FormData(form).get('question').trim(),terms=question.split(/[\s,.!?]+/).filter(w=>w.length>1).map(w=>w.replace(/(했던|하며|하고|하는|에서|으로|을|를|이|가|은|는)$/g,''));
 const groups=[['협업','팀','소통','갈등','커뮤니케이션'],['문제','해결','개선','어려움','극복'],['리더','주도','책임','이끌'],['도전','새로운','학습','성장']];
 groups.forEach(g=>{if(g.some(t=>question.includes(t)))terms.push(...g);});
 const ranked=state.entries.map(e=>({e,score:[...new Set(terms)].filter(t=>(e.title+' '+e.original+' '+e.tags.join(' ')).includes(t)).length})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3);
 $('#recommend-results').innerHTML=ranked.length?'<h3 style="font-size:14px;margin-bottom:15px">이 경험들을 살펴보세요</h3>'+ranked.map(({e,score})=>'<div class="question-card"><div class="number">관련 키워드 '+score+'개</div><h4>'+esc(e.title)+'</h4><p>'+esc(e.summary.action||e.summary.context)+'</p><button class="text-button" data-action="detail" data-id="'+e.id+'">경험 자세히 보기'+icon('right')+'</button></div>').join(''):'<p class="form-note">일치하는 키워드가 없어요. 협업, 문제해결, 리더십처럼 경험에 담긴 단어를 넣어보세요.</p>';return;
 }
 busy=true;const submit=document.querySelector('[type="submit"][form="'+form.id+'"]')||form.querySelector('[type="submit"]');if(submit)submit.disabled=true;
 try{
 const data=Object.fromEntries(new FormData(form));
 if(form.id==='entry-form'){data.tags=data.tags.split(',').map(s=>s.trim()).filter(Boolean);await api(form.dataset.id?'entries/'+form.dataset.id:'entries',form.dataset.id?'PATCH':'POST',data);if(!form.dataset.id)sessionStorage.removeItem('aimers-draft');closeDialog();await refresh();toast('오늘의 경험이 차곡차곡 쌓였어요.');}
 else if(form.id==='category-form'){await api('categories','POST',data);closeDialog();await refresh();toast('새 카테고리를 만들었어요.');}
 else if(form.id==='group-form'){const g=await api('groups','POST',data);closeDialog();await refresh();navigate('groups');inviteDialog(g.id);toast('함께 기록할 그룹을 만들었어요.');}
 else if(form.id==='profile-form'){await api('profile','PATCH',data);await refresh();toast('설정을 저장했어요.');}
 }catch(e){if($('.dialog'))errorInDialog(e.message);else toast(e.message);}finally{busy=false;if(submit)submit.disabled=false;}
});
document.addEventListener('input',event=>{
 if(event.target.id==='search'){query=event.target.value;const pos=event.target.selectionStart;render();$('#search').focus();$('#search').setSelectionRange(pos,pos);}
 if(event.target.closest('#entry-form')){const form=$('#entry-form');if(event.target.id==='entry-original')$('#live-summary').innerHTML=summaryHtml(localSummary(event.target.value));if(!form.dataset.id){const data=Object.fromEntries(new FormData(form));data.tags=data.tags.split(',').map(s=>s.trim()).filter(Boolean);try{sessionStorage.setItem('aimers-draft',JSON.stringify(data))}catch{}}}
 if(event.target.id==='import-text'){$('[data-action="save-import"]').disabled=true;$('#import-preview').innerHTML='';}
});
document.addEventListener('change',async event=>{
 if(event.target.id==='sort'){sort=event.target.value;render();}
 if(event.target.id==='question-entry')renderQuestions(event.target.value);
 if(event.target.id==='report-semester')renderReport(event.target.value);
 if(event.target.id==='import-file'){const f=event.target.files[0];if(!f)return;if(f.size>250000){errorInDialog('250KB 이하의 파일을 선택해 주세요.');return;}$('#import-text').value=await f.text();$('[data-action="save-import"]').disabled=true;$('#import-preview').innerHTML='';}
});
document.addEventListener('keydown',event=>{
 if(!$('.dialog'))return;
 if(event.key==='Escape'){event.preventDefault();if(!busy)closeDialog();}
 if(event.key==='Tab'){const items=$$('.dialog button:not([disabled]),.dialog input,.dialog textarea,.dialog select,.dialog a[href]');if(!items.length)return;const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
});
async function start(){
 try{
 await refresh();
 const invite=new URLSearchParams(location.search).get('invite');
 if(invite){try{const g=await api('invite?token='+encodeURIComponent(invite));openDialog('함께 기록하자는 초대가 왔어요',esc(g.name),'<p class="note">'+esc(g.description||'서로의 꾸준함을 응원하는 기록 그룹이에요.')+'</p><div class="form-note" style="margin-top:18px">'+periodLabel(g.period)+' 기록하는 그룹이에요. 참여하면 멤버에게 내 이름과 작성 여부가 보여요.</div>',btn('나중에','close','ghost')+btn('그룹 참여하기','join','primary','users','data-token="'+esc(invite)+'"'));}catch(e){toast(e.message);}}
 }catch(e){$('#app').innerHTML='<main class="error-screen"><h1>잠시 연결이 끊겼어요.</h1><p>'+esc(e.message)+'</p>'+btn('다시 연결하기','retry','primary')+'</main>';}
}
setInterval(async()=>{if(document.visibilityState!=='visible'||!state||$('.dialog')||busy)return;try{const next=await api('state');const changed=JSON.stringify(next.notifications)!==JSON.stringify(state.notifications)||JSON.stringify(next.groups)!==JSON.stringify(state.groups)||next.today!==state.today;state=next;if(changed)render();}catch{}},30000);
start();
