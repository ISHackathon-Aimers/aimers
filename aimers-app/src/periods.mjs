const MS_DAY=86400000;
const dayNumber=key=>Date.parse(key+'T00:00:00Z')/MS_DAY;
const keyOf=value=>new Date(value).toLocaleDateString('en-CA',{timeZone:'Asia/Seoul'});
export function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value&&value>='1900-01-01'&&value<='2100-12-31';}
export function recordingProgress(entries,profile,now=new Date()){
 const today=keyOf(now),anchor=profile.start_date||keyOf(profile.created_at),cadence=Number(profile.cadence);
 const boundary=index=>{
  if(cadence!==30)return new Date((dayNumber(anchor)+index*cadence)*MS_DAY).toISOString().slice(0,10);
  const [y,m,d]=anchor.split('-').map(Number),month=new Date(Date.UTC(y,m-1+index,1));
  month.setUTCDate(Math.min(d,new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth()+1,0)).getUTCDate()));
  return month.toISOString().slice(0,10);
 };
 const indexOf=key=>{
  if(cadence!==30)return Math.floor((dayNumber(key)-dayNumber(anchor))/cadence);
  let index=(Number(key.slice(0,4))-Number(anchor.slice(0,4)))*12+Number(key.slice(5,7))-Number(anchor.slice(5,7));
  if(key<boundary(index))index--;return index;
 };
 const scheduled=today<anchor,index=scheduled?0:indexOf(today),completed=new Set();
 for(const e of entries){const key=keyOf(e.created_at);if(key>=anchor&&key<=today)completed.add(indexOf(key));}
 const done=!scheduled&&completed.has(index),last=done?index:index-1;
 let count=0;while(completed.has(last-count))count++;
 const end=new Date((dayNumber(boundary(index+1))-1)*MS_DAY).toISOString().slice(0,10);
 const streakStart=count?boundary(last-count+1):null;
 const streakEnd=count?[today,new Date((dayNumber(boundary(last+1))-1)*MS_DAY).toISOString().slice(0,10)].sort()[0]:null;
 return {start:boundary(index),end,done,scheduled,count,streakStart,streakEnd,streakDays:count?dayNumber(streakEnd)-dayNumber(streakStart)+1:0,totalCompleted:completed.size,previousMissed:!scheduled&&index>0&&!completed.has(index-1)};
}
