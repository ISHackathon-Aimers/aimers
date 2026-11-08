import test from 'node:test';
import assert from 'node:assert/strict';
import {questionPlan,questionAngles,interviewSources} from '../src/question-guides.mjs';
test('question plans rotate recent angles while retaining an explicit practice focus and a hypothetical angle',()=>{
 const data={original:'팀원과 인터뷰를 담당하고 결정 기준과 결과를 검증했다. 피드백을 반영했다.'};
 const first=questionPlan(data),next=questionPlan({...data,previousQuestions:first.map(q=>({question:'질문 '+q.id,focus:q.id}))});
 assert.equal(first.length,5);assert.equal(new Set(first.map(q=>q.id)).size,5);assert(next.some(q=>!first.some(p=>p.id===q.id)));
 assert(questionPlan({...data,focus:'decision'}).some(q=>q.id==='decision'));assert(first.some(q=>q.id==='transfer'));
 assert.equal(questionAngles.length,10);assert(interviewSources.some(s=>s.id==='naver'));assert(interviewSources.some(s=>s.id==='toss'));
});
