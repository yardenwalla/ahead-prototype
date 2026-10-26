// Reason/action/timing contracts plus observable effects of reported information.
// Editorial usefulness is reviewed separately in docs/recommendation-quality-2026-10-22.md.
const assert = require('node:assert/strict');
const boot = require('./content-runtime.cjs');
let checks = 0, states = 0, destinations = 0;
const check = (value, message) => { checks++; assert.ok(value, message); };
const clean = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const birth = '2025-10-21';
function family(age, answers = {}, feed = 'Both', early = false) {
  return boot({name:'Ari',dob:birth,feed,pronouns:'he',early,due:early?'2025-12-02':''},answers,{},new Date(Date.UTC(2025,9+age,21,12)).toISOString());
}
for (let age=0; age<=12; age++) for (const early of [false,true])
for (const feed of ['Breast milk','Formula','Both']) for (const experience of ['unknown','preparing','new','established']) {
  const answers = experience==='unknown'?{}:{solids:experience==='preparing'?'Not yet':'Yes',foodExperience:experience};
  const a=family(age,answers,feed,early);states++;
  const before=a.run('JSON.stringify(answers)');
  a.run("navigate('home')");
  const rows=JSON.parse(a.run('JSON.stringify(homeRecommendationAudit())'));
  check(rows.current.length<=3 && rows.preparation.length<=2,'Digestible Home caps');
  check(new Set([...rows.current,...rows.preparation].map(r=>r.topic)).size===rows.current.length+rows.preparation.length,'No duplicate category recommendations');
  for(const row of [...rows.current,...rows.preparation]) {
    check(typeof row.reason==='string' && row.reason.length>8,'Every recommendation has an explicit reason');
    check(row.kind || row.title && row.body && row.action,'Each row has useful copy and a destination, or a specific completion action');
    if(rows.preparation.includes(row) && row.dated)check(row.days<=35,'No distant checkup homework');
    if(row.action) {
      a.run(row.action);destinations++;
      check(/<h[12]\b/.test(a.html()) && !/\bundefined\b|\bNaN\b/.test(clean(a.html())),'Recommendation leads to populated guidance');
    }
  }
  for(const topic of ['Development','Daily rhythm','Sleep','Feeding','Safety','Health']) {
    a.run(`month=actualMonth();openPage('topic:${topic}')`);
    check(a.html().includes('<h2') || a.html().includes('<h1'),'Each category provides an orientation');
  }
  const ideas=JSON.parse(a.run('JSON.stringify(playStageModel().primary)'));
  check(ideas.length>=6,'Every month has enough play variety');
  for(const idea of ideas)check(idea.how && idea.why && idea.adapt,'Every play recommendation connects an action, a purpose and an adaptation');
  check(a.run('JSON.stringify(answers)')===before,'Browsing does not claim progress');
}
// Answers must change the guidance, not just a stored field.
{
  const a=family(2,{},'Prefer not to say');
  a.run("openPage('topic:Feeding');chgChooseMethod('nurse');navigate('home');answerHomeQuestion('milk','Formula')");
  check(clean(a.html()).includes('’s age')&&clean(a.html()).includes('Formula at'),'Milk answer changes visible Home guidance');
  a.run("openPage('chg:Feeding:d:milk')");
  check(a.html().includes('value="bottle" selected'),'Milk answer replaces stale reference');
  a.run("openPage('chg:Feeding:milk')");
  check(!/Pumping|thawed breast milk/.test(clean(a.html())),'Formula answer filters milk detail');
}
for(const experience of ['preparing','new','established']) {
  const a=family(9);a.run(`navigate('home');answerHomeQuestion('food','${experience}');openPage('topic:Feeding')`);
  check(a.run("chgStageIndex('Feeding')")==={preparing:2,new:3,established:5}[experience],'Solids answer changes stage');
  check(clean(a.html()).includes('Bring your feeding questions to the checkup')===(experience!=='established'),'Later starters get a concrete checkup connection without assuming delay for everyone');
}
{
  const a=family(9);
  a.run("chgSetSafety('pulling');openPage('personalize');setSafetyMovement('reaching')");
  check(a.run("currentSafetyMovementStage()==='reaching' && safetyStageNow()==='pulling'"),'Movement correction updates the fact without cancelling preparation');
  a.run("setSafetyMovement('moving');openPage('topic:Safety')");
  check(a.run("currentSafetyMovementStage()==='moving' && safetyStageNow()==='pulling'"),'Crawling is recorded while higher-reach preparation remains available');
}
{
  const a=family(4,{swaddleStopped:'Yes'});
  a.run("saveJourneySkill('sits-without-support',{date:iso(NOW)});navigate('home')");
  check(clean(a.html()).includes('Now that Ari sits, lower the crib mattress'),'Saved sitting changes Home');
  a.run("openPage('topic:Sleep')");
  check(clean(a.html()).includes('Now that Ari sits'),'Saved sitting changes Sleep');
  a.run("setAnswer('mattressLowered','Yes')");
  check(!clean(a.html()).includes('Sitting means the crib mattress goes down'),'Completed mattress work stops being an action');
  a.run("saveJourneySkill('pulls-up-to-stand',{date:iso(NOW)});openPage('topic:Safety')");
  check(a.run("safetyStageNow()==='pulling'"),'Saved pulling-up changes Safety');
  check(a.run("monthlyPlayActivities(developmentMonth(),currentSafetyMovementStage()).some(x=>x.id==='standing-play')"),'Saved pulling-up changes the play selection');
  a.run("openPage('topic:Sleep')");check(clean(a.html()).includes('Set the crib mattress to its lowest'),'Saved pulling-up changes Sleep');
}
{
  const a=family(9,{swaddleStopped:'Yes',mattressLowest:'Yes',crawl:'Yes'});
  a.run("navigate('home')");check(clean(a.html()).includes('If you have stairs'),'Home preserves task applicability');
  a.run("completeHomeCheck('gates','na')");check(!a.html().includes('data-home-check="gates"'),'Does not apply removes that task from Home');
  a.run("openPage('topic:Safety')");check(a.run("safetyCheckStatus('gates')==='na'"),'Home completion is shared with Safety');
  a.run("const d=journeyData();d.checks.safetyHome={...d.checks.safetyHome,...Object.fromEntries(safetyOwnedGuides().mobile.ids.map(id=>[id,'done']))};saveJourneyData(d);navigate('home')");
  check(!a.run("[...homeRecommendationAudit().current,...homeRecommendationAudit().preparation].some(r=>r.topic==='Safety')"),'A finished checklist is not promoted as new work');
}
{
  const a=family(5);a.run("openPage('topic:Development')");
  check(!clean(a.html()).includes('Coming up · By 9 months'),'No far-ahead Development homework');
  check(a.html().includes("development-stage:9"),'Future skills remain available on the rail');
  a.run("completeHealthVisit(6,iso(NOW))");check(a.run('healthJourneyFocus()')===9,'Attended visit advances Health');
  a.run("navigate('home')");check(!a.run("homeRecommendationAudit().preparation.some(r=>r.topic==='Health')"),'Next distant visit stays in Health instead of immediate preparation');
}
{
  const a=family(7);
  a.run("saveJourneyVisit(9,{date:iso(new Date(NOW.getTime()+35*864e5)),status:'planned'});navigate('home')");
  check(a.run("homeRecommendationAudit().preparation.some(r=>r.topic==='Health')"),'A saved checkup within 35 days earns preparation space');
  a.run("saveJourneyVisit(9,{date:iso(new Date(NOW.getTime()+36*864e5)),status:'planned'});navigate('home')");
  check(!a.run("homeRecommendationAudit().preparation.some(r=>r.topic==='Health')"),'A saved checkup beyond the preparation window stays in Health');
}
{
  const a=family(0);a.run("openPage('topic:Sleep');for(let i=0;i<AHEAD_CHANGES.Sleep.SAFE.length;i++)chgToggleSafe('Sleep',i);openPage('topic:Sleep')");
  check(!clean(a.html()).includes('6 of 6 checked'),'Completed newborn setup stops being promoted');
  check(clean(a.html()).includes('Safe sleep setup'),'Safe sleep reference remains accessible');
  a.run("setAnswer('rollDirection','Trying to roll')");check(clean(a.html()).includes('Stop swaddling now'),'Reported rolling attempts override the generic newborn setup');
}
{
  const a=family(12,{twoNaps:'Yes',swaddleStopped:'Yes',mattressLowest:'Yes'});
  a.run("openPage('topic:Sleep')");check(!clean(a.html()).includes('Wait for a week of skipped catnaps'),'Established two-nap guide moves past transition tips');
  a.run("setAnswer('twoNaps','Yes')");check(!clean(a.html()).includes('Wait for a week of skipped catnaps'),'Reporting the current nap count is not proof of a new transition');
  for(const choice of ['trying','routine','help','learn']) {
    a.run(`openPage('chg:Sleep:settle');chgChooseSettling('${choice}')`);
    check(a.html().includes(`data-settling-guide="${choice}"`),'Settling selection changes displayed support');
  }
}
const result={states,destinations,checks,status:'passed',limits:'Editorial review is documented separately; these checks verify observable recommendation contracts.'};
require('node:fs').writeFileSync(require('node:path').join(__dirname,'out/recommendation-quality.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
