
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
const titles={dashboard:'대시보드',library:'내 기록',groups:'내 그룹',insights:'부가 서비스',settings:'프로필 및 설정'};
let selectedGroup=null,aiController=null,profileAvatar=null,sharedEntry=null,reportAnalysis=null;
const scopeLabel={private:'비공개',group:'그룹 공개',public:'전체 공개',inherit:'프로필 설정 따르기'};
const reflectionLabel=p=>p===1?'일간 회고':p===7?'주간 회고':p===30?'월간 회고':p+'일 회고';
const avatar=(person,progress)=>'<span class="avatar '+(progress?.streakDays>=140?'flame-strong':progress?.streakDays>=70?'flame-warm':'')+'">'+(person.avatar?'<img src="'+esc(person.avatar)+'" alt="">':initials(person.name))+(progress?.streakDays>=70?'<span class="avatar-fire" title="'+(progress.streakDays>=140?'20':'10')+'주 이상 연속 기록">'+icon('fire')+'</span>':'')+'</span>';
const storageGet=key=>{try{return JSON.parse(sessionStorage.getItem(key)||'null')}catch{return null}};
const storageSet=(key,value)=>{try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}};
const catIcon=name=>({'프로젝트':'layers','대외활동':'briefcase','동아리':'users','인턴십':'briefcase','학업':'book'}[name]||'folder');
const catColor=name=>state.categories.find(c=>c.name===name)?.color||'blue';
const tags=()=>[...new Set(state.entries.flatMap(e=>e.tags))];
const dateText=d=>new Date(d+'T00:00:00').toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\.$/,'');
const timeText=d=>new Date(d).toLocaleString('ko-KR',{month:'long',day:'numeric',hour:'numeric',minute:'2-digit'});
const dayKey=d=>new Date(d).toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'});
const initials=name=>esc((name||'나').slice(0,1));
const sampleCount=()=>state.entries.filter(e=>e.id.startsWith('sample-')).length;
const periodLabel=p=>p===1?'매일':p===7?'매주':p===30?'매월':p+'일마다';
const btn=(label,action,cls='primary',ic='',extra='')=>'<button type="button" class="btn '+cls+'" data-action="'+action+'" '+extra+'>'+(ic?icon(ic):'')+label+'</button>';
async function api(path,method='GET',data,signal){
 const res=await fetch('/api/'+path,{method,signal,headers:method==='GET'?{}:{'content-type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});
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
 document.documentElement.style.fontSize=state.me.font_size+'px';
 document.body.dataset.font=state.me.font;
 const unread=state.notifications.filter(n=>!n.is_read).length,nav=[['dashboard','home'],['library','folder'],['groups','users'],['insights','spark']];
 $('#app').innerHTML='<aside class="sidebar"><a class="brand" href="#dashboard" aria-label="에이머스 홈"><span class="brand-mark">a</span>에이머스</a><nav class="nav" aria-label="주 메뉴">'+nav.map(([v,i])=>'<button data-action="nav" data-view="'+v+'" class="'+(view===v?'active':'')+'" '+(view===v?'aria-current="page"':'')+'>'+icon(i)+'<span>'+titles[v]+'</span></button>').join('')+'</nav><div class="sidebar-bottom"><p class="sidebar-note">오늘의 기억을<br>내일의 가능성으로.</p><button class="profile" data-action="nav" data-view="settings">'+avatar(state.me,state.progress)+'<span><strong>'+esc(state.me.name)+'</strong><small>프로필 및 설정</small></span>'+icon('settings')+'</button></div></aside><div class="shell"><header class="topbar"><span class="breadcrumb">'+titles[view]+'</span><a class="brand mobile-brand" href="#dashboard"><span class="brand-mark">a</span>에이머스</a><div class="top-actions"><span class="top-date">'+dateText(state.today)+'</span><button class="icon-button" data-action="notifications" aria-label="알림 '+unread+'개">'+icon('bell')+(unread?'<span class="notification-dot"></span>':'')+'</button><button class="profile-trigger" data-action="nav" data-view="settings" aria-label="프로필 및 설정">'+avatar(state.me,state.progress)+'</button></div></header><main class="main">'+({dashboard,library,groups,insights,settings}[view])()+'</main></div>';
}
function heading(title,sub,action=''){return '<div class="page-heading"><div><h1>'+title+'</h1>'+(sub?'<p>'+sub+'</p>':'')+'</div>'+action+'</div>';}
function empty(title,sub,label,action){return '<div class="empty-state">'+icon('folder')+'<h3>'+title+'</h3><p>'+sub+'</p>'+(label?btn(label,action,'primary','plus'):'')+'</div>';}
function entryCard(e){const own=e.user_id===state.me.id;return '<button class="entry-card" data-action="'+(own?'detail':'shared-entry')+'" data-id="'+esc(e.id)+'" data-user="'+esc(e.user_id)+'"><div class="entry-top"><span class="tag tone-'+catColor(e.category)+'">'+esc(e.category)+'</span><span class="entry-date">'+dateText(e.date)+'</span></div><h3>'+esc(e.title)+'</h3><p>'+esc(e.summary.context||e.original)+'</p><div class="tags">'+e.tags.map(t=>'<span class="tag">#'+esc(t)+'</span>').join('')+'</div><div class="entry-footer"><span>'+(own?scopeLabel[e.visibility==='inherit'?state.me.visibility:e.visibility]:esc(e.author_name||'공개 기록'))+'</span><span>기록 보기'+icon('right')+'</span></div></button>';}
function dashboard(){
 const p=state.progress,days=new Set(state.entries.map(e=>dayKey(e.created_at))).size;
 const status=p.scheduled?'시작 예정':p.done?'이번 기간 기록 완료':'이번 기간 기록을 기다려요';
 return heading(esc(state.me.name)+'님의 대시보드','작은 경험도 잊히기 전에 남겨보세요.',btn('기록 추가','write','primary','plus'))+
 '<section class="reflection-panel"><div><h2>'+reflectionLabel(state.me.cadence)+'</h2><p class="period-range">'+dateText(p.start)+' — '+dateText(p.end)+'</p><p>'+ (p.scheduled?'설정한 시작일부터 기록 주기를 계산해요.':p.done?'남긴 경험을 돌아보고, 배운 점을 한 줄 더해보세요.':'이번 기간에 무엇을 했나요? AI와 이야기하며 기억을 정리해보세요.')+'</p><div class="reflection-actions">'+btn('회고 작성','review','primary','edit',p.scheduled?'disabled':'')+'<span class="status '+(p.done?'complete':'')+'">'+icon(p.done?'check':'clock')+status+'</span></div>'+(p.previousMissed?'<p class="period-warning">지난 기간에는 기록이 없었어요. 이번 기간부터 다시 이어갈 수 있어요.</p>':'')+'</div><div class="streak-summary">'+icon('fire')+'<strong>'+p.count+'<small>회 연속</small></strong><span>'+periodLabel(state.me.cadence)+' 기록 약속</span><p>'+(p.count?dateText(p.streakStart)+'부터 '+p.streakDays+'일 동안 이어왔어요.':'한 기간에 한 번, 나만의 속도로 시작해요.')+'</p></div></section>'+
 '<dl class="metrics"><div><dt>전체 기록</dt><dd>'+state.entries.length+'<small>개</small></dd></div><div><dt>기록한 날</dt><dd>'+days+'<small>일</small></dd></div><div><dt>완료한 기간</dt><dd>'+p.totalCompleted+'<small>회</small></dd></div></dl>'+
 '<div class="content-grid"><section><div class="section-heading"><h2>최근 내 기록</h2>'+btn('전체 보기','nav','ghost','','data-view="library"')+'</div>'+(state.entries.length?'<div class="cards-grid">'+state.entries.slice(0,4).map(entryCard).join('')+'</div>':empty('첫 경험을 남겨보세요','한 문장으로 시작해도 괜찮아요. AI가 다음 질문을 도와드려요.','기록 추가','write'))+'</section><aside class="side-stack"><section class="panel"><div class="section-heading"><h2>내 그룹</h2>'+btn('모두 보기','nav','ghost','','data-view="groups"')+'</div>'+(state.groups.length?state.groups.slice(0,3).map(g=>'<button class="list-link" data-action="open-group" data-id="'+g.id+'"><span><strong>'+esc(g.name)+'</strong><small>'+g.members.filter(m=>m.done).length+' / '+g.members.length+'명 기록 완료</small></span>'+icon('right')+'</button>').join(''):'<p class="note">친구와 함께 기록하는 습관을 만들어보세요.</p>'+btn('그룹 만들기','create-group','secondary','plus'))+'</section><section class="panel"><h2>기록을 다음 단계로</h2><p class="note">쌓아둔 경험을 면접과 자소서에 연결해보세요.</p>'+[['questions','면접 예상 질문'],['recommend','자소서 경험 검색'],['report','성장 인사이트']].map(([a,l])=>'<button class="list-link" data-action="'+a+'"><span>'+l+'</span>'+icon('right')+'</button>').join('')+'</section></aside></div>';
}
function library(){
 let entries=state.entries.filter(e=>(filter==='전체'||e.category===filter)&&(!query||(e.title+' '+e.original+' '+e.tags.join(' ')).toLowerCase().includes(query.toLowerCase())));
 if(sort==='oldest')entries=[...entries].reverse();if(sort==='category')entries=[...entries].sort((a,b)=>a.category.localeCompare(b.category,'ko')||b.date.localeCompare(a.date));
 return heading('내 기록','기억을 모으고, 나만의 경험으로 정리하세요.',btn('기록 추가','write','primary','plus'))+
 '<div class="toolbar"><div class="searchbox">'+icon('search')+'<input id="search" aria-label="경험 검색" placeholder="제목, 내용, 역량으로 검색" value="'+esc(query)+'"></div><select id="sort" class="select-compact" aria-label="경험 정렬">'+[['newest','최신 활동순'],['oldest','오래된 활동순'],['category','카테고리순']].map(([v,l])=>'<option value="'+v+'" '+(sort===v?'selected':'')+'>'+l+'</option>').join('')+'</select>'+btn('지난 경험 등록','import','white','upload')+'</div><div class="filter-row">'+['전체',...state.categories.map(c=>c.name)].map(c=>'<button class="filter '+(filter===c?'active':'')+'" data-action="filter" data-category="'+esc(c)+'">'+esc(c)+'<span>'+(c==='전체'?state.entries.length:state.entries.filter(e=>e.category===c).length)+'</span></button>').join('')+btn('카테고리 추가','category','ghost','plus')+'</div><p class="results-count">총 '+entries.length+'개의 기록</p>'+(entries.length?'<div class="library-grid">'+entries.map(entryCard).join('')+'</div>':empty('조건에 맞는 기록이 없어요',query?'검색어나 카테고리를 바꿔보세요.':'첫 경험을 기록해 보세요.',query?'':'기록 추가','write'));
}
function groups(){
 const selected=state.groups.find(g=>g.id===selectedGroup);
 return heading('내 그룹','서로의 속도를 존중하며, 함께 기록해요.',btn('그룹 만들기','create-group','primary','plus'))+
 '<div class="section-heading">'+(selected?btn('그룹 목록','group-list','ghost','folder'):'<p class="note">참여 중인 그룹 '+state.groups.length+'개</p>')+btn('전체 공개 기록 둘러보기','public-records','white','search')+'</div>'+
 (selected?groupCard(selected):state.groups.length?'<div class="group-list">'+state.groups.map(g=>'<button class="group-list-item" data-action="open-group" data-id="'+g.id+'"><span class="stat-icon tone-blue">'+icon('users')+'</span><span><strong>'+esc(g.name)+'</strong><small>'+esc(g.description||'함께 기록하는 우리')+'</small><small>'+g.members.length+'명 · '+g.members.filter(m=>m.done).length+'명 기록 완료</small></span>'+icon('right')+'</button>').join('')+'</div>':empty('첫 기록 메이트를 만나보세요','그룹을 만들고 초대 링크를 나눠보세요.','그룹 만들기','create-group'));
}
function groupCard(g){
 return '<section class="panel group-card"><div class="group-title"><div><h2>'+esc(g.name)+'</h2><p>'+esc(g.description)+'</p></div>'+btn('초대 링크','invite','white','link','data-id="'+g.id+'"')+'</div><p class="note">각 멤버가 설정한 주기와 시작일을 기준으로 작성 여부를 확인해요.</p>'+g.members.map(m=>'<div class="member-row"><button class="member-profile" data-action="member-profile" data-user="'+esc(m.id)+'">'+avatar(m,m.progress)+'<span><strong>'+esc(m.name)+(m.id===state.me.id?' (나)':'')+'</strong><small>'+periodLabel(m.cadence)+' · '+m.streak+'회 연속</small><small>'+dateText(m.progress.start)+' — '+dateText(m.progress.end)+'</small></span></button><div class="member-status"><span class="status '+(m.done?'complete':m.progress.scheduled?'':'waiting')+'">'+icon(m.done?'check':'clock')+(m.done?'작성 완료':m.progress.scheduled?'시작 예정':'미작성')+'</span>'+(!m.done&&!m.progress.scheduled&&m.id!==state.me.id?btn('콕 찌르기','poke','secondary small','hand','data-group="'+g.id+'" data-user="'+esc(m.id)+'"'):'')+'</div></div>').join('')+'<p class="note group-note">프로필을 누르면 열람 가능한 기록을 볼 수 있어요. 비공개 기록은 본인만 볼 수 있어요.</p></section>';
}
function insights(){
 return heading('부가 서비스','내 경험을 면접, 자소서, 다음 학기의 계획으로 연결하세요.')+
 '<p class="service-note">'+icon('spark')+(state.aiEnabled?'DeepSeek AI가 기록에 근거해 도와드려요. 생성된 내용은 원문과 함께 확인하세요.':'AI 연결이 설정되지 않았어요. 기록과 기본 학기 통계는 사용할 수 있어요.')+'</p><div class="service-list">'+[
 ['mic','면접 예상 질문','경험과 역할에 맞는 질문을 만들고, 나만의 답변을 연습하세요.','questions','질문 만들기'],
 ['search','자소서 문항 관련 경험 검색','문항을 입력하면 관련 경험과 추천 이유를 함께 찾아드려요.','recommend','경험 찾기'],
 ['chart','성장 인사이트','이번 학기와 이전 학기를 비교하고 다음 기록의 방향을 잡아보세요.','report','학기 돌아보기']
 ].map(([ic,title,description,action,label])=>'<section class="service-row"><span class="stat-icon tone-blue">'+icon(ic)+'</span><div><h2>'+title+'</h2><p>'+description+'</p></div>'+btn(label,action,'white','arrow')+'</section>').join('')+'</div>';
}
function settings(){
 const p=state.progress;profileAvatar=state.me.avatar;
 return heading('프로필 및 설정','기록의 속도와 공개 범위를 직접 정하세요.')+
 '<div class="settings-grid"><form id="profile-form" class="panel"><h2>내 프로필</h2><div class="profile-photo"><span id="avatar-preview">'+avatar(state.me,p)+'</span><div><label class="btn white" for="avatar-file">사진 선택</label><input type="file" id="avatar-file" accept="image/png,image/jpeg,image/webp" class="visually-hidden">'+btn('사진 제거','clear-avatar','ghost')+'<p class="field-help">JPG·PNG·WebP, 최대 5MB</p></div></div><div class="field"><label for="profile-name">이름</label><input id="profile-name" name="name" maxlength="30" required value="'+esc(state.me.name)+'"></div><div class="field"><label for="profile-visibility">기록 기본 공개 범위</label><select id="profile-visibility" name="visibility">'+['private','group','public'].map(v=>'<option value="'+v+'" '+(state.me.visibility===v?'selected':'')+'>'+scopeLabel[v]+'</option>').join('')+'</select><p class="field-help">전체 공개는 서비스의 모든 사용자, 그룹 공개는 나와 같은 그룹의 멤버가 열람해요. 원문도 함께 공개돼요.</p><p class="field-help">이 설정을 따르는 기존 기록 '+state.entries.filter(e=>e.visibility==='inherit').length+'개에도 적용돼요. 기록별로 다른 범위를 선택할 수 있어요.</p></div><hr><h2>기록 주기</h2><div class="form-row"><div class="field"><label for="cadence">주기</label><select id="cadence" name="cadence">'+[[1,'매일'],[7,'매주'],[30,'매월'],['custom','직접 설정']].map(([v,l])=>'<option value="'+v+'" '+(v===state.me.cadence||(v==='custom'&&![1,7,30].includes(state.me.cadence))?'selected':'')+'>'+l+'</option>').join('')+'</select></div><div class="field"><label for="start-date">시작 날짜</label><input id="start-date" name="start_date" type="date" min="1900-01-01" max="2100-12-31" required value="'+state.me.start_date+'"></div></div><div class="field" id="custom-cadence-field" '+([1,7,30].includes(state.me.cadence)?'hidden':'')+'><label for="custom-cadence">며칠마다 기록할까요?</label><input id="custom-cadence" type="number" min="1" max="365" value="'+state.me.cadence+'"><p class="field-help">30을 선택하면 달력 기준 매월로 계산해요.</p></div><p class="field-help">주기나 시작일을 바꾸면 기존 기록으로 연속 횟수를 다시 계산해요. 매월은 시작일의 날짜를 기준으로 하며, 해당 날짜가 없으면 월말을 사용해요.</p><hr><h2>화면 설정</h2><div class="form-row"><div class="field"><label for="profile-font">글꼴</label><select id="profile-font" name="font">'+[['sans','고딕'],['serif','명조'],['system','시스템 기본']].map(([v,l])=>'<option value="'+v+'" '+(v===state.me.font?'selected':'')+'>'+l+'</option>').join('')+'</select></div><div class="field"><label for="profile-size">글씨 크기</label><select id="profile-size" name="font_size">'+[[14,'작게'],[16,'기본'],[18,'크게'],[20,'아주 크게']].map(([v,l])=>'<option value="'+v+'" '+(v===state.me.font_size?'selected':'')+'>'+l+'</option>').join('')+'</select></div></div><button class="btn primary" type="submit">설정 저장</button></form><aside class="side-stack"><section class="panel"><h2>나의 꾸준함</h2><p class="profile-streak">'+icon('fire')+'<strong>'+p.count+'회 연속</strong></p><p>'+p.streakDays+'일 동안 기록 약속을 이어왔어요.</p><p class="note">연속 기간이 10주, 20주에 도달하면 프로필의 불꽃이 더 선명해져요.</p></section><section class="panel"><h2>데이터 관리</h2>'+btn('전체 기록 내보내기','export','white full','download')+btn('지난 경험 등록','import','ghost full','upload')+'<hr><p class="note">'+(sampleCount()?'예시 기록 '+sampleCount()+'개가 포함돼 있어요.':'예시 기록으로 기능을 둘러볼 수 있어요.')+'</p>'+btn(sampleCount()?'예시 기록 지우기':'예시 기록 추가',sampleCount()?'clear-samples':'add-samples','ghost full')+'</section><section class="panel"><h2>알림 안내</h2><p class="note">이번 기간의 미작성 여부와 그룹의 콕 찌르기를 앱 알림함에서 확인하세요. 앱을 닫은 동안의 푸시·이메일 발송은 아직 지원하지 않아요.</p></section></aside></div>';
}
function openDialog(title,sub,body,footer='',wide=false){
 if(aiController){aiController.abort();aiController=null;}
 if(!$('.dialog'))dialogFocus=document.activeElement;
 $('#overlay').innerHTML='<div class="dialog-backdrop"><section class="dialog '+(wide?'wide':'')+'" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><header class="dialog-header"><div><h2 id="dialog-title">'+title+'</h2>'+(sub?'<p>'+sub+'</p>':'')+'</div><button class="icon-button" data-action="close" aria-label="닫기">'+icon('close')+'</button></header><div class="dialog-body">'+body+'</div>'+(footer?'<footer class="dialog-footer">'+footer+'</footer>':'')+'</section></div>';
 document.body.style.overflow='hidden';$('#app').inert=true;
 requestAnimationFrame(()=>($('.dialog [autofocus]')||$('.dialog input')||$('.dialog button'))?.focus());
}
function closeDialog(){
 if(aiController){aiController.abort();aiController=null;}$('#app').inert=false;
 if(speech){speech.stop();speech=null;}
 $('#overlay').innerHTML='';document.body.style.overflow='';
 if(dialogFocus?.isConnected)dialogFocus.focus();
}
function localSummary(original){
 const sentences=original.split(/\n+|(?<=[.!?。])\s+/u).map(s=>s.trim()).filter(Boolean),pick=re=>sentences.filter(s=>re.test(s)).join(' ').slice(0,650);
 return {context:sentences.slice(0,2).join(' ').slice(0,650),action:pick(/담당|맡|진행|기획|분석|제안|개발|설계|인터뷰|만들|조사|해결|작성/),result:pick(/결과|배웠|배운|느꼈|성과|달성|향상|개선|증가|감소|수상|완료|성장|중요|깨달/)};
}
function summaryHtml(s){return [['context','어떤 경험이었나요','활동의 배경이나 상황을 적어보세요.'],['action','나는 무엇을 했나요','내가 맡은 역할과 직접 한 행동을 적어보세요.'],['result','무엇을 얻었나요','결과나 배운 점을 구체적으로 남겨보세요.']].map(([key,title,hint])=>'<div class="summary-section"><h4>'+title+'</h4><p class="'+(s[key]?'':'missing')+'">'+esc(s[key]||hint)+'</p></div>').join('');}
function writeEntry(id,review=false){
 const e=state.entries.find(x=>x.id===id),draftKey='aimers-draft-'+(id||(review?'review':'new')),draft=storageGet(draftKey);
 const d=draft||e||{title:review?reflectionLabel(state.me.cadence)+' · '+state.progress.start:'',category:state.categories[0]?.name||'대외활동',date:state.today,original:'',tags:[],visibility:'inherit'};
 openDialog(e?'기록 수정':review?reflectionLabel(state.me.cadence):'경험 기록하기','한 문장으로 시작해도 괜찮아요. AI가 다음 질문을 도와드려요.',
 (review?'<p class="form-note">돌아볼 기간: '+dateText(state.progress.start)+' — '+dateText(state.progress.end)+'<br>기억에 남는 일, 내가 한 행동, 다음에 바꾸고 싶은 점을 남겨보세요.</p>':'')+
 '<form id="entry-form" data-id="'+esc(e?.id||'')+'" data-draft="'+draftKey+'"><div class="field"><label for="entry-title">제목</label><input id="entry-title" name="title" maxlength="120" required placeholder="어떤 경험을 했나요?" value="'+esc(d.title)+'"></div><div class="form-row"><div class="field"><label for="entry-category">카테고리</label><select id="entry-category" name="category">'+state.categories.map(c=>'<option '+(c.name===d.category?'selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div><div class="field"><label for="entry-date">활동 날짜</label><input id="entry-date" type="date" name="date" required max="'+state.today+'" value="'+esc(d.date)+'"></div></div><div class="editor-grid"><div><div class="voice-row"><label for="entry-original">나의 경험 원문</label><button class="voice-button" type="button" data-action="voice">'+icon('mic')+'말로 기록</button></div><textarea id="entry-original" name="original" maxlength="20000" required rows="9" autofocus placeholder="예: 팀 프로젝트를 경험했어요. 발표를 맡았는데 준비 과정이 쉽지 않았어요.">'+esc(d.original)+'</textarea><p class="field-help">원문과 추가 답변은 그대로 보관돼요. 작성 중인 내용은 이 탭에 임시 저장돼요.</p>'+btn('AI와 경험 구체화','ai-reflect','secondary','spark',state.aiEnabled?'':'disabled')+'<div id="ai-followup" aria-live="polite"></div></div><aside class="summary-preview"><h3>정리 미리보기</h3><p id="summary-caption" class="field-help">현재 원문에서 관련 문장을 추출한 기본 정리예요.</p><div id="live-summary">'+summaryHtml(localSummary(d.original))+'</div></aside></div><p id="ai-status" class="ai-status" role="status"></p><div class="field"><label for="entry-tags">역량 태그</label><input name="tags" id="entry-tags" placeholder="협업, 문제해결" maxlength="150" value="'+esc(d.tags.join(', '))+'"><span class="field-help">쉼표로 구분해 최대 6개</span></div><div class="field"><label for="entry-visibility">이 기록의 공개 범위</label><select id="entry-visibility" name="visibility">'+['inherit','private','group','public'].map(v=>'<option value="'+v+'" '+((d.visibility||'inherit')===v?'selected':'')+'>'+scopeLabel[v]+(v==='inherit'?' ('+scopeLabel[state.me.visibility]+')':'')+'</option>').join('')+'</select><p class="field-help">공개하면 정리본과 원문을 함께 볼 수 있어요.</p></div></form>',
 btn('취소','close','ghost')+'<button class="btn white" type="submit" form="entry-form" value="raw">원문 저장</button><button class="btn primary" type="submit" form="entry-form" value="ai" '+(state.aiEnabled?'':'disabled')+'>'+icon('spark')+'AI 정리 후 저장</button>',true);
 if(d.followup)$('#ai-followup').innerHTML=followupHtml(d.followup.question,d.followup.answer);
}
function detail(id,tab='summary'){
 const e=state.entries.find(x=>x.id===id)||(sharedEntry?.id===id?sharedEntry:null);if(!e)return;
 const own=e.user_id===state.me.id;
 openDialog(esc(e.title),'', '<div class="detail-meta"><span class="tag">'+esc(e.category)+'</span><span>'+dateText(e.date)+'</span>'+e.tags.map(t=>'<span class="tag">#'+esc(t)+'</span>').join('')+'</div><div class="tabs"><button class="tab '+(tab==='summary'?'active':'')+'" data-action="detail-tab" data-id="'+esc(id)+'" data-tab="summary">정리본</button><button class="tab '+(tab==='original'?'active':'')+'" data-action="detail-tab" data-id="'+esc(id)+'" data-tab="original">원본 보기</button></div>'+(tab==='original'?'<div class="original-text">'+esc(e.original)+'</div>':'<p class="form-note">'+(e.summary.source==='deepseek'?'AI가 원문에 근거해 정리했어요. 원본과 함께 확인해 주세요.':'원문의 관련 문장을 추출한 기본 정리예요.')+'</p>'+summaryHtml(e.summary)),(own?btn('삭제','delete-entry','danger small','trash','data-id="'+esc(id)+'"')+btn('수정하기','edit-entry','white small','edit','data-id="'+esc(id)+'"'):'')+btn('닫기','close','primary small'),true);
}
async function aiTask(button,path,data,success){
 if(aiController||busy)return;
 const controller=new AbortController();aiController=controller;
 const dialog=$('.dialog'),controls=$$('input,textarea,select,button',dialog).filter(e=>e.dataset.action!=='close'),disabled=controls.map(e=>e.disabled),label=button.innerHTML;
 controls.forEach(e=>e.disabled=true);dialog.setAttribute('aria-busy','true');button.textContent='AI가 생각하고 있어요…';
 $('.form-error',dialog)?.remove();const status=$('#ai-status');if(status)status.textContent='기록을 읽고 있어요. 잠시만 기다려 주세요.';
 try{const result=await api(path,'POST',data,controller.signal);if(aiController===controller&&dialog.isConnected){success(result);if(status?.isConnected)status.textContent='완료했어요. 원문과 함께 확인해 주세요.';}}
 catch(error){if(!controller.signal.aborted&&dialog.isConnected){errorInDialog(error.message);if(status)status.textContent='입력은 그대로 남아 있어요. 다시 시도할 수 있어요.';}}
 finally{if(aiController===controller){aiController=null;controls.forEach((e,i)=>{if(e.isConnected)e.disabled=disabled[i];});if(button.isConnected)button.innerHTML=label;dialog.removeAttribute('aria-busy');}}
}
function followupHtml(question,answer=''){
 return '<section class="followup"><h3>조금 더 들려주세요</h3><p id="followup-question">'+esc(question)+'</p><label class="visually-hidden" for="followup-answer">추가 답변</label><textarea id="followup-answer" rows="3" maxlength="5000" placeholder="기억나는 만큼 답해주세요.">'+esc(answer)+'</textarea>'+btn('답변 반영하고 다음 질문','ai-answer','secondary','')+'<p class="field-help">답변하기 어려우면 지금 내용으로 저장해도 좋아요.</p></section>';
}
function appendFollowup(){
 const answer=$('#followup-answer')?.value.trim();if(!answer)return;
 const original=$('#entry-original'),text=original.value+'\n\n질문: '+$('#followup-question').textContent+'\n답변: '+answer;
 if(text.length>20000)throw Error('원문과 답변은 합쳐서 20,000자까지 저장할 수 있어요.');
 original.value=text;$('#ai-followup').innerHTML='';original.dispatchEvent(new Event('input',{bubbles:true}));
}
async function reflect(button){
 appendFollowup();
 const form=$('#entry-form'),data=Object.fromEntries(new FormData(form));if(!data.original.trim()){errorInDialog('먼저 경험을 한 문장 이상 적어주세요.');return;}
 if(speech){speech.stop();speech=null;}
 await aiTask(button,'ai/reflect',data,result=>{
  $('#live-summary').innerHTML=summaryHtml(result.summary);$('#summary-caption').textContent='AI가 지금까지의 원문을 바탕으로 정리했어요.';
  $('#ai-followup').innerHTML=result.question?followupHtml(result.question):'<p class="inline-success">경험의 핵심이 잘 드러나요. 내용을 확인하고 저장해 주세요.</p>';
  const draft=storageGet(form.dataset.draft)||{...data,tags:data.tags.split(',').map(t=>t.trim()).filter(Boolean)};draft.followup=result.question?{question:result.question,answer:''}:null;storageSet(form.dataset.draft,draft);
 });
}
async function showProfile(id){
 const data=await api('users/'+encodeURIComponent(id));
 openDialog(esc(data.profile.name)+'님의 기록','공개 범위에 따라 열람 가능한 기록만 표시돼요.', '<div class="profile-summary">'+avatar(data.profile,data.progress)+'<p>'+(data.progress?data.progress.count+'회 연속 기록 · ':'')+data.entries.length+'개의 열람 가능한 기록</p></div>'+(data.entries.length?'<div class="cards-grid">'+data.entries.map(e=>entryCard({...e,author_name:data.profile.name})).join('')+'</div>':'<p class="empty-state">현재 열람 가능한 기록이 없어요.</p>'),btn('닫기','close','primary'),true);
}
async function publicRecords(offset=0){
 const result=await api('public?offset='+offset);
 const content=(result.entries.length?'<div class="cards-grid">'+result.entries.map(entryCard).join('')+'</div>':'<p class="empty-state">아직 전체 공개 기록이 없어요.</p>')+'<div class="pagination">'+(offset?btn('이전','public-page','white','','data-offset="'+Math.max(0,offset-30)+'"'):'')+(result.hasMore?btn('다음','public-page','white','','data-offset="'+(offset+30)+'"'):'')+'</div>';
 openDialog('전체 공개 기록','다른 사용자의 경험에서 새로운 관점을 만나보세요.',content,btn('닫기','close','primary'),true);
}
function categoryDialog(){openDialog('나만의 카테고리','경험을 나에게 맞는 방식으로 분류해 보세요.','<form id="category-form"><div class="field"><label for="category-name">카테고리 이름</label><input class="input" name="name" id="category-name" placeholder="예: 봉사활동, 공모전" maxlength="40" required autofocus></div><div class="field"><label for="category-color">카테고리 색상</label><select id="category-color" name="color">'+[['blue','파랑'],['purple','보라'],['mint','민트'],['orange','주황'],['pink','분홍'],['gray','회색']].map(([v,n])=>'<option value="'+v+'">'+n+'</option>').join('')+'</select></div></form>',btn('취소','close','ghost')+'<button class="btn primary" type="submit" form="category-form">카테고리 추가</button>');}
function createGroup(){openDialog('함께 기록할 그룹 만들기','각자의 주기로 기록하고 서로 응원해요.','<form id="group-form"><input type="hidden" name="period" value="7"><div class="field"><label for="group-name">그룹 이름</label><input id="group-name" name="name" required maxlength="60" placeholder="예: 일요일의 기록 메이트" autofocus></div><div class="field"><label for="group-desc">소개</label><input id="group-desc" name="description" maxlength="200" placeholder="서로의 작은 성장을 응원하는 우리"></div><p class="form-note">그룹 멤버는 이름, 기록 주기와 작성 여부를 볼 수 있어요. 기록 내용은 각 기록의 공개 범위를 따라요.</p></form>',btn('취소','close','ghost')+'<button class="btn primary" type="submit" form="group-form">그룹 만들기</button>');}
function inviteDialog(id){const g=state.groups.find(g=>g.id===id),link=location.origin+'/?invite='+encodeURIComponent(g.token);openDialog('기록 메이트를 초대해요',esc(g.name),'<p class="note" style="margin-bottom:18px">아래 링크를 복사해서 함께 기록하고 싶은 친구에게 보내세요.</p><div class="link-box">'+esc(link)+'</div><div class="form-note" style="margin-top:18px">'+(state.mode==='local'?'현재 PC의 로컬 체험 링크예요. 같은 PC의 다른 브라우저에서 참여 흐름을 확인할 수 있어요. 외부 친구 초대에는 배포가 필요해요.':'초대받은 사람은 이 사이트에 접근 가능한 계정으로 로그인해야 해요. 현재 사이트 접근 권한과 그룹 참여는 별개예요.')+'</div>',btn('닫기','close','ghost')+btn('초대 링크 복사','copy-invite','primary','link','data-id="'+id+'"'));}
function notifications(){
 const p=state.progress,reminder=p.scheduled?dateText(p.start)+'부터 기록을 시작해요.':p.done?'이번 기간의 기록을 남겼어요. 다음에도 이어가 보세요.':dateText(p.end)+'까지 이번 기간의 기록을 남겨주세요.';
 openDialog('알림','나의 기록 약속과 친구들의 응원','<div class="notification-item unread">'+icon(p.done?'check':'clock')+' '+reminder+(p.previousMissed?'<p>지난 기간은 미작성으로 마감됐어요. 이번 기간부터 다시 시작할 수 있어요.</p>':'')+'</div>'+state.notifications.map(n=>'<div class="notification-item '+(!n.is_read?'unread':'')+'">'+esc(n.body)+'<small>'+timeText(n.created_at)+'</small></div>').join(''),btn('모두 읽음','read-notifications','secondary')+btn('닫기','close','primary'));
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
 return parsed.map(e=>({title:e.title,category:e.category,date:e.date,original:e.original,tags:Array.isArray(e.tags)?e.tags:[],visibility:e.visibility||'inherit'}));
}
function download(name,data,type='application/json'){const url=URL.createObjectURL(new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function questions(){
 if(!state.entries.length){toast('먼저 경험을 기록해 주세요.');return;}
 openDialog('면접 예상 질문','경험별 질문을 만들고 나만의 답변을 준비하세요.','<div class="form-row"><div class="field"><label for="question-category">카테고리</label><select id="question-category"><option value="">전체</option>'+state.categories.map(c=>'<option>'+esc(c.name)+'</option>').join('')+'</select></div><div class="field"><label for="question-entry">연습할 경험</label><select id="question-entry">'+state.entries.map(e=>'<option value="'+e.id+'">'+esc(e.title)+'</option>').join('')+'</select></div></div>'+btn('AI 질문 만들기','ai-interview','primary','spark',state.aiEnabled?'':'disabled')+'<p id="ai-status" class="ai-status" role="status"></p><div id="question-list"></div>',btn('닫기','close','white'),true);renderQuestions(state.entries[0].id);
}
function renderQuestions(id){
 const e=state.entries.find(e=>e.id===id),cached=storageGet('aimers-interview-'+id);
 $('#question-list').innerHTML=cached&&e&&cached.updatedAt===e.updated_at?'<p class="field-help">연습 답변은 이 브라우저 탭에 임시 저장돼요.</p>'+cached.questions.map((q,i)=>'<section class="question-card"><h3>'+esc(q.question)+'</h3><p>'+esc(q.intent)+'</p><label for="answer-'+i+'">나의 답변</label><textarea id="answer-'+i+'" class="answer-input" data-entry="'+id+'" data-index="'+i+'" rows="3" placeholder="나의 역할과 구체적인 장면을 떠올려보세요.">'+esc(cached.answers?.[i]||'')+'</textarea></section>').join(''):'<p class="form-note">경험을 선택하고 질문을 만들어보세요. AI가 기록에 있는 역할과 상황을 읽고 질문해요.</p>';
}
let reportRows=[];
function semesterKey(date){const year=Number(date.slice(0,4)),month=Number(date.slice(5,7));return (month<3?year-1:year)+'-'+(month>=3&&month<=8?'1':'2');}
function report(){
 const semesters=[...new Set([semesterKey(state.today),...state.entries.map(e=>semesterKey(e.date))])].sort().reverse();
 openDialog('성장 인사이트','기록의 변화를 살피고 다음 학기의 방향을 찾아보세요.','<div class="field"><label for="report-semester">돌아볼 학기</label><select id="report-semester">'+semesters.map(s=>'<option value="'+s+'">'+s.split('-')[0]+'년 '+s.split('-')[1]+'학기</option>').join('')+'</select></div><div id="report-content"></div>',btn('보고서 내려받기','download-report','primary','download'),true);renderReport(semesters[0]);
}
function renderReport(semester){
 reportAnalysis=null;reportRows=state.entries.filter(e=>semesterKey(e.date)===semester);
 const year=Number(semester.slice(0,4)),prev=semester.endsWith('1')?(year-1)+'-2':year+'-1',previous=state.entries.filter(e=>semesterKey(e.date)===prev);
 const ts=[...new Set(reportRows.flatMap(e=>e.tags))],previousTags=new Set(previous.flatMap(e=>e.tags)),added=ts.filter(t=>!previousTags.has(t));
 $('#report-content').innerHTML='<div class="report-stat"><div><strong>'+reportRows.length+'</strong><span>이번 학기 기록</span></div><div><strong>'+previous.length+'</strong><span>이전 학기 기록</span></div><div><strong>'+added.length+'</strong><span>새로 기록한 역량</span></div></div><p class="note">'+(previous.length?'이전 학기 대비 기록 '+(reportRows.length-previous.length>=0?'+':'')+(reportRows.length-previous.length)+'개. 기록량의 차이가 능력의 차이를 뜻하지는 않아요.':'이전 학기 기록이 없어 변화 비교는 제한적이에요.')+'</p><div class="badge-row">'+added.map(t=>'<span class="tag tone-blue">'+esc(t)+'</span>').join('')+'</div>'+btn('AI로 학기 비교','ai-report','secondary','spark',state.aiEnabled&&reportRows.length?'':'disabled')+'<p id="ai-status" class="ai-status" role="status"></p><div id="report-analysis"></div><hr><h3>이번 학기의 기록</h3>'+reportRows.map(e=>'<button class="list-link" data-action="detail" data-id="'+e.id+'"><span><strong>'+esc(e.title)+'</strong><small>'+dateText(e.date)+' · '+esc(e.category)+'</small></span>'+icon('right')+'</button>').join('')+(!reportRows.length?'<p class="empty-state">선택한 학기에 기록이 없어요.</p>':'');
}
function recommend(){openDialog('자소서 문항 관련 경험 검색','문항에 맞는 경험과 추천 이유를 찾아드려요.','<form id="recommend-form"><div class="field"><label for="essay-question">자소서 문항</label><textarea id="essay-question" name="question" required maxlength="3000" rows="4" placeholder="팀원과 협업해 문제를 해결했던 경험을 작성해 주세요."></textarea></div><div class="field"><label for="recommend-category">살펴볼 카테고리</label><select id="recommend-category" name="category"><option value="">전체</option>'+state.categories.map(c=>'<option>'+esc(c.name)+'</option>').join('')+'</select></div><button class="btn primary" type="submit" '+(state.aiEnabled?'':'disabled')+'>'+icon('search')+'AI로 경험 찾기</button></form><p class="field-help">선택한 범위의 최근 60개 기록에서 찾아요.</p><p id="ai-status" class="ai-status" role="status"></p><div id="recommend-results"></div>',btn('닫기','close','ghost'),true);}
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
 else if(a==='review')writeEntry(undefined,true);
 else if(a==='open-group'){selectedGroup=el.dataset.id;navigate('groups');}
 else if(a==='group-list'){selectedGroup=null;render();}
 else if(a==='member-profile'){el.disabled=true;try{await showProfile(el.dataset.user);}finally{el.disabled=false;}}
 else if(a==='public-records'||a==='public-page'){el.disabled=true;try{await publicRecords(Number(el.dataset.offset||0));}finally{el.disabled=false;}}
 else if(a==='shared-entry'){const data=await api('users/'+encodeURIComponent(el.dataset.user));sharedEntry=data.entries.find(e=>e.id===el.dataset.id);if(!sharedEntry)throw Error('공개 범위가 변경되어 기록을 열람할 수 없어요.');detail(sharedEntry.id);}
 else if(a==='clear-avatar'){profileAvatar='';$('#avatar-preview').innerHTML=avatar({name:state.me.name});}
 else if(a==='ai-reflect')await reflect(el);
 else if(a==='ai-answer'){
  if(!$('#followup-answer').value.trim()){errorInDialog('추가 답변을 적어주세요.');return;}
  await reflect($('[data-action="ai-reflect"]'));
 }
 else if(a==='ai-interview'){
  const id=$('#question-entry').value;if(!id){errorInDialog('선택한 카테고리에 경험이 없어요.');return;}
  await aiTask(el,'ai/interview',{entryId:id},result=>{const e=state.entries.find(e=>e.id===id);storageSet('aimers-interview-'+id,{...result,answers:[],updatedAt:e.updated_at});renderQuestions(id);});
 }
 else if(a==='ai-report'){
  await aiTask(el,'ai/report',{semester:$('#report-semester').value},result=>{
   reportAnalysis=result;
   $('#report-analysis').innerHTML='<section class="analysis-result"><h3>AI가 살펴본 변화</h3><p>'+esc(result.overview)+'</p>'+result.changes.map(c=>'<div class="analysis-observation"><p>'+esc(c.observation)+'</p><div class="tags">'+c.evidenceIds.map(id=>{const e=state.entries.find(e=>e.id===id);return e?btn(esc(e.title),'detail','ghost small','','data-id="'+id+'"'):'';}).join('')+'</div></div>').join('')+'<h3>다음 기록을 위한 제안</h3><ul>'+result.nextSteps.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul><p class="field-help">분석 범위: 이번 학기 '+result.considered.current+'/'+result.total.current+'개, 이전 학기 '+result.considered.previous+'/'+result.total.previous+'개. 학기별 최근 30개 기록을 사용해요.</p></section>';
  });
 }
 else if(a==='close'){if(busy){toast('저장을 마칠 때까지 잠시 기다려 주세요.');return;}closeDialog();}
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
 else if(a==='download-report'){const text='에이머스 성장 보고서\n'+$('#report-semester').value.replace('-','년 ')+'학기\n\n'+(reportAnalysis?reportAnalysis.overview+'\n\n'+reportAnalysis.changes.map(c=>c.observation).join('\n')+'\n\n':'')+reportRows.map(e=>e.date+' / '+e.category+'\n'+e.title+'\n'+(e.summary.result||e.summary.context)+'\n역량: '+e.tags.join(', ')).join('\n\n');download('aimers-growth-report.txt',text,'text/plain;charset=utf-8');}
 else if(a==='join'){el.disabled=true;await api('join','POST',{token:el.dataset.token});closeDialog();history.replaceState(null,'',location.pathname+'#groups');view='groups';await refresh();toast('그룹에 참여했어요. 함께 기록해 봐요.');}
 else if(a==='retry'){await start();}
 }catch(e){if($('.dialog'))errorInDialog(e.message);else toast(e.message);el.disabled=false;}
});
document.addEventListener('submit',async event=>{
 const form=event.target;event.preventDefault();if(busy||aiController)return;
 if(form.id==='recommend-form'){
  const data=Object.fromEntries(new FormData(form));
  await aiTask(form.querySelector('[type="submit"]'),'ai/recommend',data,result=>{
   $('#recommend-results').innerHTML='<p class="note">'+result.total+'개 중 최근 '+result.considered+'개 기록을 살펴봤어요.</p>'+(result.recommendations.length?result.recommendations.map(r=>{const e=state.entries.find(e=>e.id===r.id);return '<section class="question-card"><h3>'+esc(e.title)+'</h3><p>'+esc(r.reason)+'</p><p><strong>작성할 때 강조할 점</strong><br>'+esc(r.angle)+'</p>'+btn('원문 확인','detail','white small','','data-id="'+e.id+'"')+'</section>';}).join(''):'<p class="form-note">적합한 기록을 찾지 못했어요. 카테고리를 넓히거나 다른 문항을 입력해 보세요.</p>');
  });return;
 }
 if(form.id==='entry-form'){try{appendFollowup();}catch(e){errorInDialog(e.message);return;}}
 busy=true;const inputs=$$('input,textarea,select',form),inputDisabled=inputs.map(e=>e.disabled);const submit=event.submitter;const submitLabel=submit?.innerHTML;const buttons=$$('button[type="submit"]');const previousDisabled=buttons.map(b=>b.disabled);buttons.forEach(b=>b.disabled=true);if(submit)submit.textContent=submit.value==='ai'?'AI가 정리하고 저장 중…':'저장 중…';
 try{
 const data=Object.fromEntries(new FormData(form));inputs.forEach(e=>e.disabled=true);
 if(form.id==='entry-form'){data.useAI=submit?.value==='ai';data.tags=data.tags.split(',').map(s=>s.trim()).filter(Boolean);await api(form.dataset.id?'entries/'+form.dataset.id:'entries',form.dataset.id?'PATCH':'POST',data);try{sessionStorage.removeItem(form.dataset.draft)}catch{}closeDialog();await refresh();toast('오늘의 경험이 차곡차곡 쌓였어요.');}
 else if(form.id==='category-form'){await api('categories','POST',data);closeDialog();await refresh();toast('새 카테고리를 만들었어요.');}
 else if(form.id==='group-form'){const g=await api('groups','POST',data);closeDialog();await refresh();navigate('groups');inviteDialog(g.id);toast('함께 기록할 그룹을 만들었어요.');}
 else if(form.id==='profile-form'){if(data.cadence==='custom')data.cadence=Number($('#custom-cadence').value);data.avatar=profileAvatar;await api('profile','PATCH',data);await refresh();toast('설정을 저장했어요.');}
 }catch(e){if($('.dialog'))errorInDialog(e.message);else toast(e.message);}finally{busy=false;inputs.forEach((e,i)=>{if(e.isConnected)e.disabled=inputDisabled[i];});buttons.forEach((b,i)=>{if(b.isConnected)b.disabled=previousDisabled[i];});if(submit?.isConnected)submit.innerHTML=submitLabel;}
});
document.addEventListener('input',event=>{
 if(event.target.id==='search'){query=event.target.value;const pos=event.target.selectionStart;render();$('#search').focus();$('#search').setSelectionRange(pos,pos);}
 if(event.target.closest('#entry-form')){
  const form=$('#entry-form');if(event.target.id==='entry-original'){$('#live-summary').innerHTML=summaryHtml(localSummary(event.target.value));$('#summary-caption').textContent='원문이 바뀌었어요. AI와 다시 구체화하거나 저장할 때 정리할 수 있어요.';}
  const data=Object.fromEntries(new FormData(form));data.tags=data.tags.split(',').map(s=>s.trim()).filter(Boolean);if($('#followup-question'))data.followup={question:$('#followup-question').textContent,answer:$('#followup-answer').value};storageSet(form.dataset.draft,data);
 }
 if(event.target.classList.contains('answer-input')){const key='aimers-interview-'+event.target.dataset.entry,data=storageGet(key);if(data){data.answers[Number(event.target.dataset.index)]=event.target.value;storageSet(key,data);}}
 if(event.target.id==='import-text'){$('[data-action="save-import"]').disabled=true;$('#import-preview').innerHTML='';}
});
document.addEventListener('change',async event=>{
 try{
 if(event.target.id==='cadence')$('#custom-cadence-field').hidden=event.target.value!=='custom';
 if(event.target.id==='question-category'){
  const entries=state.entries.filter(e=>!event.target.value||e.category===event.target.value);
  $('#question-entry').innerHTML=entries.map(e=>'<option value="'+e.id+'">'+esc(e.title)+'</option>').join('');renderQuestions(entries[0]?.id);
 }
 if(event.target.id==='avatar-file'){
  const file=event.target.files[0];if(!file)return;if(file.size>5000000||!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('5MB 이하의 JPG·PNG·WebP 사진을 선택해 주세요.');
  const bitmap=await createImageBitmap(file),canvas=document.createElement('canvas');canvas.width=160;canvas.height=160;
  const ctx=canvas.getContext('2d'),side=Math.min(bitmap.width,bitmap.height);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,160,160);ctx.drawImage(bitmap,(bitmap.width-side)/2,(bitmap.height-side)/2,side,side,0,0,160,160);bitmap.close();
  profileAvatar=canvas.toDataURL('image/jpeg',0.85);if($('#avatar-preview'))$('#avatar-preview').innerHTML=avatar({name:state.me.name,avatar:profileAvatar});
 }
 if(event.target.id==='sort'){sort=event.target.value;render();}
 if(event.target.id==='question-entry')renderQuestions(event.target.value);
 if(event.target.id==='report-semester')renderReport(event.target.value);
 if(event.target.id==='import-file'){const f=event.target.files[0];if(!f)return;if(f.size>250000){errorInDialog('250KB 이하의 파일을 선택해 주세요.');return;}$('#import-text').value=await f.text();$('[data-action="save-import"]').disabled=true;$('#import-preview').innerHTML='';}
 }catch(e){if($('.dialog'))errorInDialog(e.message);else toast(e.message);}
});
document.addEventListener('keydown',event=>{
 if(!$('.dialog'))return;
 if(event.key==='Escape'){event.preventDefault();if(!busy)closeDialog();}
 if(event.key==='Tab'){const items=$$('.dialog button:not([disabled]),.dialog input:not([disabled]):not([type=hidden]),.dialog textarea:not([disabled]),.dialog select:not([disabled]),.dialog a[href]');if(!items.length)return;const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
});
async function start(){
 try{
 await refresh();
 const invite=new URLSearchParams(location.search).get('invite');
 if(invite){try{const g=await api('invite?token='+encodeURIComponent(invite));openDialog('함께 기록하자는 초대가 왔어요',esc(g.name),'<p class="note">'+esc(g.description||'서로의 꾸준함을 응원하는 기록 그룹이에요.')+'</p><div class="form-note" style="margin-top:18px">각자의 주기로 함께 기록해요. 참여하면 멤버에게 이름·작성 여부와 그룹 공개 기록이 보여요.</div>',btn('나중에','close','ghost')+btn('그룹 참여하기','join','primary','users','data-token="'+esc(invite)+'"'));}catch(e){toast(e.message);}}
 }catch(e){$('#app').innerHTML='<main class="error-screen"><h1>잠시 연결이 끊겼어요.</h1><p>'+esc(e.message)+'</p>'+btn('다시 연결하기','retry','primary')+'</main>';}
}
setInterval(async()=>{if(document.visibilityState!=='visible'||!state||$('.dialog')||busy||view==='settings')return;try{const next=await api('state');const changed=JSON.stringify(next.notifications)!==JSON.stringify(state.notifications)||JSON.stringify(next.groups)!==JSON.stringify(state.groups)||next.today!==state.today;state=next;if(changed)render();}catch{}},30000);
start();
