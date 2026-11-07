import test from 'node:test';
import assert from 'node:assert/strict';
import {recordingProgress,validDate} from '../src/periods.mjs';
const rows=(...dates)=>dates.map(date=>({created_at:date+'T12:00:00+09:00',date:'2020-01-01'}));
test('weekly streak follows chosen anchor and grants the current unfinished period',()=>{
 const p={cadence:7,start_date:'2026-10-19'};
 let r=recordingProgress(rows('2026-10-19','2026-10-26','2026-11-02'),p,new Date('2026-11-07T12:00:00+09:00'));
 assert.equal(r.count,3);assert.equal(r.start,'2026-11-02');assert.equal(r.end,'2026-11-08');assert.equal(r.done,true);
 r=recordingProgress(rows('2026-10-19','2026-10-26'),p,new Date('2026-11-07T12:00:00+09:00'));assert.equal(r.count,2);assert.equal(r.done,false);
 r=recordingProgress(rows('2026-10-19','2026-10-26'),p,new Date('2026-11-09T00:00:00+09:00'));assert.equal(r.count,0);assert.equal(r.previousMissed,true);
});
test('monthly periods clamp month ends without drifting the anchor',()=>{
 const p={cadence:30,start_date:'2026-01-31'};
 let r=recordingProgress(rows('2026-01-31','2026-02-28'),p,new Date('2026-03-30T12:00:00+09:00'));
 assert.equal(r.start,'2026-02-28');assert.equal(r.end,'2026-03-30');assert.equal(r.count,2);
 r=recordingProgress([],p,new Date('2026-03-31T00:00:00+09:00'));assert.equal(r.start,'2026-03-31');assert.equal(r.end,'2026-04-29');
 r=recordingProgress([],{cadence:30,start_date:'2024-01-31'},new Date('2024-02-29T00:00:00+09:00'));assert.equal(r.start,'2024-02-29');
});
test('future starts, custom periods and Korea midnight use creation dates',()=>{
 assert.equal(recordingProgress([],{cadence:14,start_date:'2026-12-01'},new Date('2026-11-07T00:00:00Z')).scheduled,true);
 const r=recordingProgress([{created_at:'2026-11-07T15:00:00Z',date:'2020-01-01'}],{cadence:14,start_date:'2026-10-25'},new Date('2026-11-07T15:00:00Z'));
 assert.equal(r.start,'2026-11-08');assert.equal(r.count,1);assert.equal(r.totalCompleted,1);
 assert.equal(validDate('2026-02-30'),false);assert.equal(validDate('2024-02-29'),true);
});
