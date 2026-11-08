export const interviewSources=[
 {id:'naver',title:'NAVER Careers FAQ',url:'https://recruit.navercorp.com/bbs/faq.do?lang=en',basis:'직무 전문성과 협업 방식, 조직 문화에 대한 대화를 구분하는 채용 안내'},
 {id:'toss',title:'토스커뮤니티 합류 여정',url:'https://i18n.toss.im/career/joining-guide',basis:'직무 경험의 구체적인 영향과 학습, 스스로 해결하거나 개선한 과정을 확인하는 안내'},
 {id:'google',title:'Google re:Work - Structured interviewing',url:'https://rework.withgoogle.com/intl/en/guides/a-guide-to-structured-interviewing-for-better-hiring-practices',basis:'행동 질문과 가상 상황을 구분하고 판단 과정을 꼬리질문으로 확인하는 공식 가이드'},
 {id:'microsoft',title:'Microsoft Careers - Interview tips',url:'https://careers.microsoft.com/v2/global/en/hiring-tips/interview-tips',basis:'구체적 행동과 결과, 피드백 반영 및 회고를 확인하는 공식 가이드'},
 {id:'amazon',title:'Amazon Jobs - FEE Interview Prep',url:'https://amazon.jobs/content/en/how-we-hire/fee-interview-prep',basis:'결정 이유, 성공과 어려움, 근거와 수치를 확인하는 공식 직무별 가이드'}
];
// Authored examples demonstrate reasoning and grounding, rather than copied interview questions.
export const questionExamples=[
 {input:{original:'학과 행사에서 접수 안내를 맡았다. 대기 줄이 길어져 안내판 위치를 옮겼다.'},output:{question:'안내판 위치를 옮겼다고 했는데, 다른 위치보다 그곳이 낫다고 판단한 관찰은 무엇이었나요?',focus:'decision',anchor:'안내판 위치를 옮겼다',intent:'실제 관찰과 선택 기준을 구분해 확인한다.',followups:['본인이 직접 본 불편은 무엇이었나요?','위치를 바꾼 뒤 어떤 변화가 있었나요?'],answerGuide:['관찰한 장면','선택한 이유','실제 확인한 변화']}},
 {input:{original:'팀의 자료를 표로 묶어 회의에 공유했다. 첫 발표에서 근거가 부족하다는 피드백을 받았다.'},output:{question:'근거가 부족하다는 피드백을 받은 뒤, 팀의 자료를 다시 검토한다면 어떤 근거부터 보완하겠나요?',focus:'learning',anchor:'근거가 부족하다는 피드백',intent:'이미 바꾼 행동과 앞으로 바꿀 행동을 구분한다.',followups:['보완할 수 있는 자료는 어디에 있나요?','보완이 효과적이었는지 무엇으로 확인하겠나요?'],answerGuide:['받은 피드백','추가 확인할 자료','다음 검증 방법']}}
];
export const questionAngles=[
 {id:'ownership',label:'개인 기여',guide:'팀 전체가 한 일과 본인이 직접 한 행동을 구분하고 책임 범위를 확인한다.',signals:/팀|담당|맡|진행/,source:'naver'},
 {id:'decision',label:'판단과 대안',guide:'기록 속 선택을 특정하고 검토한 대안과 비교 기준, 감수한 손해를 묻는다.',signals:/선택|결정|우선|기준|제안|집중/,source:'toss'},
 {id:'problem',label:'문제 정의',guide:'처음 문제라고 판단한 근거와 가정이 바뀐 계기를 묻는다.',signals:/문제|불편|가설|발견|분석/,source:'toss'},
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
 const recent=new Set(previous.slice(-5).map(q=>typeof q==='string'?'':q.focus));
 const frequency=id=>previous.filter(q=>q.focus===id).length;
 const offset=previous.length%questionAngles.length;
 const chosen=questionAngles.map((a,i)=>({...a,score:(a.signals.test(text)?4:0)+(a.id===data.focus?20:0)-(recent.has(a.id)?8:0)-frequency(a.id)*2,order:(i-offset+questionAngles.length)%questionAngles.length})).sort((a,b)=>b.score-a.score||a.order-b.order).slice(0,count).map(({signals,score,order,...a})=>a);
 if(count===5&&!chosen.some(q=>q.id==='transfer')){const {signals,...transfer}=questionAngles.find(q=>q.id==='transfer');chosen[chosen.length-1]=transfer;}
 return chosen;
}
