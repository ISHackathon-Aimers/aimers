import test from 'node:test';
import assert from 'node:assert/strict';
import {createAI} from '../src/ai.mjs';
const reply=value=>new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:JSON.stringify(value)}}]}));
test('DeepSeek request uses server credentials, JSON mode and validated output',async()=>{
 const ai=createAI({apiKey:'test-secret',fetchImpl:async(url,options)=>{
  assert.equal(url,'https://api.deepseek.com/chat/completions');assert.equal(options.headers.authorization,'Bearer test-secret');
  const body=JSON.parse(options.body);assert.equal(body.response_format.type,'json_object');assert.equal(body.thinking.type,'disabled');
  assert.ok(body.messages[0].content.includes('지어내거나'));return reply({question:'어떤 역할을 맡았나요?',summary:{context:'팀 프로젝트',action:'',result:''}});
 }});
 const result=await ai('reflect',{original:'팀 프로젝트를 경험함'});assert.equal(result.summary.source,'deepseek');assert.match(result.question,/역할/);
 assert.equal(createAI(),null);
});
test('invalid JSON, truncated completions and invented evidence are rejected',async()=>{
 const responses=[new Response(JSON.stringify({choices:[{finish_reason:'length',message:{content:'{}'}}]})),new Response(JSON.stringify({choices:[{finish_reason:'stop',message:{content:'   '}}]})),reply({recommendations:[{id:'another-user',reason:'이유',angle:'내용'}]})];
 for(const response of responses){const ai=createAI({apiKey:'secret',fetchImpl:async()=>response});await assert.rejects(()=>ai('recommend',{records:[{id:'mine'}]}),e=>e.status===502);}
});
test('provider failures and timeouts return recoverable errors without secrets',async()=>{
 for(const status of [401,402,429,500]){
  const ai=createAI({apiKey:'private-key',fetchImpl:async()=>new Response('private-key',{status})});
  await assert.rejects(()=>ai('summary',{}),e=>!e.message.includes('private-key')&&e.status===(status===429?429:502));
 }
 const ai=createAI({apiKey:'private-key',fetchImpl:async()=>{throw Error('private-key');}});
 await assert.rejects(()=>ai('summary',{}),e=>e.status===504&&!e.message.includes('private-key'));
});

test('interview generation uses five different grounded angles, followups and verified reference metadata',async()=>{
 let sent;const original='사용자 12명을 인터뷰했다. 선택 기준을 정하고 검색 동선을 바꿨다. 팀원과 프로토타입을 완성했다.';
 const ai=createAI({apiKey:'test-key',fetchImpl:async(url,options)=>{
  const payload=JSON.parse(options.body);sent=JSON.parse(payload.messages[1].content);assert.equal(sent.questionPlan.length,5);assert.equal(new Set(sent.questionPlan.map(q=>q.id)).size,5);assert(sent.questionPlan.some(q=>q.id==='transfer'));assert.equal(sent.targetRole,'서비스 기획');assert(sent.previousQuestions.length);
  return reply({questions:sent.questionPlan.map((plan,i)=>({question:'사용자 12명을 인터뷰했다는 장면에서 '+plan.label+' 관점의 구체적인 판단 '+i+'을 설명해 주세요.',focus:plan.id,anchor:'사용자 12명을 인터뷰했다',intent:plan.guide,followups:['본인이 직접 확인한 근거는 무엇인가요?','다른 방법과 비교하면 무엇이 달라지나요?'],answerGuide:['직접 한 행동','선택의 근거','확인한 결과']}))});
 }});
 const result=await ai('interview',{original,targetRole:'서비스 기획',previousQuestions:[{question:'기존 질문',focus:'ownership'}]});assert.equal(result.questions.length,5);assert.equal(result.questions[0].followups.length,2);assert(result.referenceNotice.includes('기출'));assert(result.sources.every(s=>s.url.startsWith('https://')));
});
test('review questions ground different angles in different source notes and preserve answer history',async()=>{
 const records=[{id:'note-a',original:'검색 버튼의 위치를 바꿨다.'},{id:'note-b',original:'시연에서 질문 2개에 답하지 못했다.'}];
 const ai=createAI({apiKey:'test-key',fetchImpl:async(url,options)=>{
  const data=JSON.parse(JSON.parse(options.body).messages[1].content);assert.equal(data.conversation[0].answer,'동선 녹화를 확인했다.');
  return reply({questions:data.questionPlan.map((plan,i)=>{const record=records[i%2];return {question:record.original+'라는 메모에서 '+plan.label+'에 관해 더 구체적으로 '+i+'번째 근거를 설명해주세요.',focus:plan.id,anchor:record.original,evidenceIds:[record.id],intent:plan.guide};}),summary:{context:'검색 화면 개선과 시연',action:'',result:''}});
 }});
 const result=await ai('review',{records,original:'',conversation:[{question:'확인 방법은?',answer:'동선 녹화를 확인했다.'}]});assert.equal(result.questions.length,3);assert.equal(new Set(result.questions.flatMap(q=>q.evidenceIds)).size,2);
});
test('ungrounded, duplicate-focus and previously asked interview output is retried once then rejected',async()=>{
 for(const invalid of ['anchor','focus','repeat']){
  let calls=0;const original='검색 버튼의 위치를 바꿨다.';
  const ai=createAI({apiKey:'test-key',fetchImpl:async(url,options)=>{
   calls++;const data=JSON.parse(JSON.parse(options.body).messages[1].content);
   return reply({questions:data.questionPlan.map((plan,i)=>({question:invalid==='repeat'?'검색 버튼의 위치를 바꿨다. 이전 질문':original+'에 대한 관점 '+i+'은 무엇인가요?',focus:invalid==='focus'?data.questionPlan[0].id:plan.id,anchor:invalid==='anchor'?'꾸며낸 매출 증가':original,intent:'판단 확인',followups:['근거는?','다음 행동은?'],answerGuide:['상황','행동','결과']}))});
  }});
  await assert.rejects(()=>ai('interview',{original,previousQuestions:[{question:'검색 버튼의 위치를 바꿨다. 이전 질문'}]}),e=>e.status===502);assert.equal(calls,2);
 }
});
test('review output cannot cite foreign notes or ignore available note diversity',async()=>{
 for(const useForeign of [true,false]){
  const records=[{id:'mine-a',original:'검색 버튼 위치 개선'},{id:'mine-b',original:'시연 준비를 다시 점검'}];
  const ai=createAI({apiKey:'test-key',fetchImpl:async(url,options)=>{const data=JSON.parse(JSON.parse(options.body).messages[1].content);return reply({questions:data.questionPlan.map((plan,i)=>({question:'검색 버튼 위치 개선에서 '+plan.label+'의 근거 '+i+'는 무엇인가요?',focus:plan.id,anchor:'검색 버튼 위치 개선',intent:'근거 확인',evidenceIds:[useForeign?'foreign':'mine-a']})),summary:{context:'',action:'',result:''}});}});
  await assert.rejects(()=>ai('review',{records,original:''}),e=>e.status===502);
 }
});
