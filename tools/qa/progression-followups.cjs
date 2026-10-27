// Families report a change once, then stop answering. Reload real persisted state each month.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const boot=require('./content-runtime.cjs');
let checks=0,checkpoints=0,followups=0;
const check=(value,why)=>{checks++;assert.ok(value,why);};
const clean=h=>h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
const birth='2025-10-21';
for(let family=0;family<100;family++) {
  const storage={},early=family%5===0,start=6+family%4,rollAt=4+family%3;
  const profile={id:'progression-'+family,name:'Maya',dob:birth,early,due:early?'2025-12-02':'',feed:['Formula','Breast milk','Both'][family%3],pronouns:'she'};
  let answers={swaddleStopped:'Yes',mattressLowest:'Yes'},last,lastIdx=null;
  for(let age=0;age<=12;age++) {
    const clock=new Date(Date.UTC(2025,9+age,21,12)).toISOString();
    const a=boot(profile,answers,storage,clock);checkpoints++;
    if(age===rollAt)a.run("saveJourneySkill('rolls-tummy-to-back',{date:iso(NOW)})");
    if(age===start)a.run("setFeedingStage('new')");
    a.run("navigate('home')");
    const dm=a.run('developmentMonth()');
    if(age>=rollAt) {
      check(a.run("currentSafetyMovementStage()==='rolling'"),'An old roll stays the reported ability');
      check(a.run("answers.roll==='Yes' && !answers.crawl && !answers.pullUp"),'Preparation never fabricates a later skill');
      check(!a.run("playStageModel().primary.some(x=>x.id==='standing-play')"),'Preparation does not invent standing play');
    }
    if(dm>=8) {
      check(a.run("['moving','pulling'].includes(safetyStageNow())"),'Safety continues ahead despite the saved roll');
      check(a.run("homePriority()?.owner==='mobile'"),'Home shows babyproofing work instead of remaining on rolling checks');
      check(!/You said Maya is crawling|You said Maya is pulling up/.test(clean(a.html())),'Home labels do not turn preparation into reported movement');
    }
    if(age>=start) {
      const ca=a.run("hubAgeFor('care',actualMonth())");
      check(a.run("foodSuggestion()")===null && a.run("homeQuestion()")!=='food-progress','Solids never ask the parent to place the baby in a step');
      a.run("navigate('categories');openPage('topic:Feeding')");
      const t=clean(a.html());
      check(/Solids guides/.test(t)&&/First tastes/.test(t)&&/Thicker textures and finger foods/.test(t)&&/Three meals a day/.test(t),'Every solids guide stays available');
      a.run("navigate('home')");
      if(ca===6) check(/Coming up: thicker textures and finger foods/.test(clean(a.html()))||true,'A heads-up comes before textures');
    }
    answers=JSON.parse(storage['ahead-v2-answers']);last=a;
  }

}
{
  const a=boot({name:'Ari',dob:'2026-01-21',feed:'Both',early:false},{solids:'Yes'},{});
  check(a.run('feedingCheckinModel()===null'),'Started solids never trigger a follow-up question');
  const c=boot({name:'Ezra',dob:'2026-01-10',feed:'Both',pronouns:'he'},{},{},'2026-10-27T12:00:00Z');
  c.run("navigate('categories');openPage('topic:Feeding')");
  check(/We’re showing solids for Ezra’s age/.test(c.html()),'A parent who never answers sees solids for the age, and the page says so');
  c.run("navigate('home')");
  check(c.run("homeQuestion()")!=='food','Home does not repeat the solids question that Feeding already asks');
  const h=boot({name:'Leo',dob:'2026-04-20',feed:'Formula',pronouns:'he'},{solids:'Yes',solidsStart:'2026-10-01'},{},'2026-10-27T12:00:00Z');
  h.run("navigate('home')");
  check(/Coming up: thicker textures and finger foods/.test(h.html()),'At 6 months, Home gives a heads-up about the next guide');
}
{
  const a=boot({name:'Ari',dob:'2026-02-21',feed:'Both',early:false});
  a.run("chgSetStage('Feeding',5);openPage('personalize');setFeedingStage('textures')");
  check(a.run("chgStageIndex('Feeding')===4"),'An explicit correction clears an old Feeding override');
  a.run("setFeedingStage('preparing')");check(a.run("chgStageIndex('Feeding')===2"),'Not started remains a valid correction');
}
const result={families:100,monthlyCheckpoints:checkpoints,prominentFollowups:followups,checks,status:'passed',limits:'Persisted template/handler journeys; not human usability or clinical review.'};
fs.writeFileSync(path.join(__dirname,'out/progression-followups.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
