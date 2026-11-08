export const interviewSources=[
 {id:'google',title:'Google re:Work - Structured interviewing',url:'https://rework.withgoogle.com/intl/en/guides/a-guide-to-structured-interviewing-for-better-hiring-practices',basis:'행동 질문과 가상 상황을 구분하고 판단 과정을 꼬리질문으로 확인하는 공식 가이드'},
 {id:'microsoft',title:'Microsoft Careers - Interview tips',url:'https://careers.microsoft.com/v2/global/en/hiring-tips/interview-tips',basis:'구체적 행동과 결과, 피드백 반영 및 회고를 확인하는 공식 가이드'},
 {id:'amazon',title:'Amazon Jobs - FEE Interview Prep',url:'https://amazon.jobs/content/en/how-we-hire/fee-interview-prep',basis:'결정 이유, 성공과 어려움, 근거와 수치를 확인하는 공식 직무별 가이드'}
];
export const questionAngles=[
 {id:'ownership',label:'개인 기여',guide:'팀 전체가 한 일과 본인이 직접 한 행동을 구분하고 책임 범위를 확인한다.',signals:/팀|담당|맡|진행/,source:'amazon'},
 {id:'decision',label:'판단과 대안',guide:'기록 속 선택을 특정하고 검토한 대안과 비교 기준, 감수한 손해를 묻는다.',signals:/선택|결정|우선|기준|제안|집중/,source:'amazon'},
 {id:'problem',label:'문제 정의',guide:'처음 문제라고 판단한 근거와 가정이 바뀐 계기를 묻는다.',signals:/문제|불편|가설|발견|분석/,source:'google'},
 {id:'collaboration',label:'협업과 설득',guide:'기록에 나온 동료와의 상호작용을 묻는다. 갈등은 존재 여부를 먼저 확인한다.',signals:/팀원|회의|의견|협의|동료|협업/,source:'microsoft'},
 {id:'evidence',label:'결과 검증',guide:'실제로 확인한 변화와 관찰 근거를 묻고 수치가 없으면 관찰이나 피드백으로 답하도록 한다.',signals:/결과|완성|개선|응답|성과|피드백/,source:'amazon'},
 {id:'learning',label:'피드백과 학습',guide:'무엇을 배웠다는 추상적 결론 대신 피드백 후 달라진 행동을 확인한다.',signals:/배웠|배운|학습|피드백|공부|느꼈/,source:'microsoft'},
 {id:'uncertainty',label:'불확실성과 제약',guide:'기록에 나온 시간 또는 정보 제약을 다룬 방법을 확인한다. 없던 제약은 전제하지 않는다.',signals:/시간|제한|어려|낯선|처음|부족/,source:'google'},
 {id:'customer',label:'사용자 관점',guide:'실제 사용자나 이해관계자 관찰이 의사결정에 영향을 준 과정을 묻는다.',signals:/사용자|인터뷰|고객|방문|점주|대상|설문/,source:'amazon'},
 {id:'transfer',label:'가상 상황과 전이',guide:'기록 속 조건 하나가 달라지는 가상 상황임을 명시하고 판단과 대응을 묻는다.',signals:/./,source:'google'},
 {id:'next-step',label:'다음 행동',guide:'같은 일을 다시 한다면 바꿀 행동 하나와 확인 방법을 묻는다.',signals:/./,source:'microsoft'}
];
export function questionPlan(data,count=5){
 const text=[data.original||'',...(data.records||[]).map(e=>e.original)].join(' ');
 const previous=data.previousQuestions||[];
 const used=new Set(previous.map(q=>typeof q==='string'?'':q.focus));
 const offset=previous.length%questionAngles.length;
 return questionAngles.map((a,i)=>({...a,score:(a.signals.test(text)?4:0)+(a.id===data.focus?8:0)-(used.has(a.id)?5:0),order:(i-offset+questionAngles.length)%questionAngles.length})).sort((a,b)=>b.score-a.score||a.order-b.order).slice(0,count).map(({signals,score,order,...a})=>a);
}
