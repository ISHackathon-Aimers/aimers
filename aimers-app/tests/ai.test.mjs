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
