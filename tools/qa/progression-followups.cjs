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
  let answers={swaddleStopped:'Yes',mattressLowest:'Yes'},last;
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
      check(a.run("chgStageIndex('Feeding')===3"),'Elapsed time never invents texture or meal experience');
      if(age>start && dm>=6) {
        followups++;
        check(a.run("homeQuestion()==='food-progress'"),'A parent who stops answering sees a clear follow-up');
        check(clean(a.html()).includes('What is Maya managing now?'),'Home exposes the progression question');
        a.run("openPage('topic:Feeding')");
        check(clean(a.html()).includes('What is Maya managing now?'),'The current Feeding guide exposes the same progression question');
        check(clean(a.html()).includes('More textures and finger foods')&&clean(a.html()).includes('Regular meals'),'Progression has clear visible choices');
      } else check(a.run("feedingCheckinModel()===null"),'No immediate repeat after first foods is reported');
    }
    answers=JSON.parse(storage['ahead-v2-answers']);last=a;
  }
  // The previously stuck family can advance from the prominent question, without finding Already there.
  last.run("navigate('home');answerHomeQuestion('food-progress','textures')");
  check(last.run("chgStageIndex('Feeding')===4 && foodStage()==='textures'"),'Texture answer changes the guide at 12 months');
  check(last.run('feedingCheckinModel()===null'),'A progress answer removes the repeated question');
  const saved=JSON.parse(storage['ahead-v2-answers']);
  for(const days of [1,27,28]) {
    const clock=new Date(Date.UTC(2026,9,21+days,12)).toISOString();
    const a=boot(profile,saved,storage,clock);
    check(a.run("feedingCheckinModel()?.key==='food-progress'")===(days===28),'Follow-ups wait 28 days after an answer, including reload');
    check(a.run("chgStageIndex('Feeding')===4"),'Texture support remains selected until further experience is reported');
    if(days===28) {
      a.run("navigate('home');answerHomeQuestion('food-progress','established')");
      check(a.run("chgStageIndex('Feeding')===5"),'Regular meals answer advances to Family meals');
      check(a.run('feedingCheckinModel()===null'),'Established meals do not trigger another solids-start question');
    }
  }
}
{
  const profile={name:'Ari',dob:'2026-01-21',feed:'Both',early:false},storage={};
  const a=boot(profile,{solids:'Yes',foodExperience:'new'},storage);
  check(a.run("feedingCheckinModel()?.key==='food-progress'"),'Legacy first-food answers without a date can progress');
  a.run("skipFeedingCheckin('food-progress');openPage('topic:Feeding')");
  check(!clean(a.html()).includes('What is Ari managing now?'),'Skip works on the category as well as Home');
  const answers=JSON.parse(storage['ahead-v2-answers']);
  const b=boot(profile,answers,storage,'2026-11-18T12:00:00Z');
  check(b.run("feedingCheckinModel()?.key==='food-progress'"),'Skipped progression can return after 28 days');
  b.run("chgAnswerCheckin('food-progress','textures');openPage('topic:Feeding')");
  check(b.run("chgStageIndex('Feeding')===4"),'Category follow-up advances Feeding too');
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
