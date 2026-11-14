// Editorial regression checks: wording changes must preserve the difference
// between reading guidance, preparing a space and reporting baby's experience.
const assert = require('node:assert/strict');
const boot = require('./content-runtime.cjs');
let checks = 0;
const check = (ok, message) => { checks++; assert.ok(ok, message); };
const clean = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const family = (age, answers = {}) => boot({name:'Ari',dob:'2025-10-21',feed:'Both',pronouns:'he'},answers,{},new Date(Date.UTC(2025,9+age,21,12)).toISOString());

for (let age=0; age<=12; age++) {
  const a = family(age);
  const before = a.run('JSON.stringify(answers)');
  for (const key of ['setup','reaching','rolling','moving','pulling']) {
    a.run(`openPage('safety-stage:${key}:preview')`);
    check(!clean(a.html()).includes('This is where'), 'Preparation previews must not offer to record a movement');
  }
  check(a.run('JSON.stringify(answers)') === before, 'Browsing every safety stage records no ability');
  a.run("openPage('topic:Sleep')");
  check(a.run("((stageItemsLast()||{}).items||[]).some(x => x.on)") && !clean(a.html()).includes('Based on your nap pattern'), 'Unknown nap pattern is presented as guidance selected by age');
  a.run("openPage('chg:Sleep:s:2');chgAnswer('Sleep:rhythm:2',1)");
  check(!clean(a.html()).includes('This is likely the 4-month'), 'Unexplained waking is not diagnosed from one answer');
  check(!clean(a.html()).includes('At 5 months, most babies'), 'Multi-age guidance does not leak a fixed five-month instruction');
}

const a = family(8,{twoNaps:'Stay',swaddleStopped:'Yes'});
a.run("openPage('chg:Sleep:e:1')");
check(!clean(a.html()).includes('Keep the two-nap pattern'), 'Separation-anxiety help does not invent a two-nap routine');
a.run("openPage('chg:Sleep:d:faq:rhythm');chgAnswer('Sleep:rhythm:1',1)");
check(!clean(a.html()).includes('Try a stroller ride, car ride'), 'Catnap troubleshooting agrees with safe-sleep guidance');
a.run("chgAnswer('Sleep:rhythm:2',0)");
check(clean(a.html()).includes('rolls both ways'), 'Rolling FAQ retains the both-directions condition');
a.run("openPage('chg:Feeding:s:3')");
check(clean(a.html()).includes('Learn infant choking first aid') || clean(a.html()).includes('Choking first aid'), 'Possible choking is an action, not a casual experiment');

const ids = new Set();
for (let age=0; age<=12; age++) {
  const b = family(age);
  const ideas = JSON.parse(b.run(`JSON.stringify(monthlyPlayActivities(${age},null))`));
  check(ideas.length >= 6, 'Each monthly set offers variety');
  for (const idea of ideas) {
    check(!ids.has(idea.id), 'Default monthly sets do not reintroduce the same activity as new');
    ids.add(idea.id);
    b.run(`openPage('play-activity:${age}:${idea.id}')`);
    // Activity guides were retired: an old link lands on the ideas list, where each idea reads in full.
    check(b.html().includes('Ideas to try together'), 'An old activity link opens the ideas list for its stage');
  }
}
for (const [age,oldID,newID] of [[1,'slow-song','face-follow'],[3,'sound-answer','sock-puppet'],[3,'coo-copy','sock-puppet'],[12,'toy-homes','water-pour']]) {
  a.run(`openPage('play-activity:${age}:${oldID}')`);
  check(a.html().includes('Ideas to try together'), 'Old monthly links open the ideas list');
}
for (const value of ['new','textures','established']) {
  const b=family(11);
  b.run(`setFeedingStage('${value}');openPage('topic:Feeding')`);
  const nowStage = b.run("(((stageItemsLast()||{}).items||[]).find(x => x.now && x.on) || {}).label");
  check(['First foods','Meals'].includes(nowStage), 'Started solids show a solids stage as the current stage on the timeline');
  check(/step by step/.test(b.html()), 'The solids stage page opens with its steps');
  for (const i of [3,4,5]) { b.run(`openPage('chg:Feeding:s:${i}')`); check(/hub-eyebrow[^>]*>(First foods|Meals)/.test(b.html()) && /class="monthly-back"/.test(b.html()), 'Each old solids guide link opens its stage with a way back'); }
}
// Foundational guidance is discoverable initially, then retires after setup.
{
  const b=family(0);
  b.run("navigate('home')");
  check(b.run('homeRecommendationAudit().current.some(r=>r.action===\"openPage(\'chg:Sleep:safe\')\")'),'Newborn Home exposes the safe-sleep checklist');
  check(b.run('homeRecommendationAudit().current.some(r=>r.topic===\"Feeding\")'),'Newborn feeding is not displaced by an activity');
  b.run("openPage('chg:Sleep:safe')");
  for(let i=0;i<6;i++)b.run(`chgToggleSafe('Sleep',${i})`);
  b.run("navigate('home')");
  check(!b.run('homeRecommendationAudit().current.some(r=>r.action===\"openPage(\'chg:Sleep:safe\')\")'),'Completed setup is not promoted again');
  const c=family(2);c.run("navigate('home')");
  check(!c.run('homeRecommendationAudit().current.some(r=>r.action===\"openPage(\'chg:Sleep:safe\')\")'),'The first-weeks setup does not become a permanent warning');
}
// Parents receive education before a decision, without overriding a choice.
for(const age of [3,4,7,8]) {
  const b=family(age,{swaddleStopped:'Yes',mattressLowest:'Yes'});
  b.run("navigate('home')");
  check(b.run('homeRecommendationAudit().preparation.some(r=>r.topic===\"Sleep\")'),'Home offers timely sleep preparation when Sleep is not already shown');
  if(age===4) {
    b.run("chgChooseSettling('help');navigate('home')");
    check(!b.run('homeRecommendationAudit().preparation.some(r=>r.action===\"openPage(\'chg:Sleep:settle\')\")'),'Choosing help removes the sleep-training education prompt');
  }
}
// Stage system safety exceptions: swaddling-era sleep can't be picked after 3 months; solids can't be picked before 4.
for(const age of [4,6,9]) {
  const b=family(age),stage=b.run("chgStageIndex('Sleep')");
  b.run("chgSetStage('Sleep',0)");
  check(b.run("chgStageIndex('Sleep')")===stage,'Round-the-clock sleep (swaddling) cannot be picked after 3 months');
}
for(const age of [0,1,2,3]) {
  const b=family(age),stage=b.run("chgStageIndex('Feeding')");
  b.run("chgSetStage('Feeding',3)");
  check(b.run("chgStageIndex('Feeding')")===stage,'Solids stages cannot be picked before 4 months');
  b.run("openPage('chg:Feeding:s:3')");
  check(!b.html().includes('onclick="chgSetStage(\'Feeding\',3)"'),'First-food reference under four months has no update action');
}
// The sample must contain the nap count displayed above it, with ordered times.
for(let age=5;age<=12;age++)for(const answer of ['Stay','Yes']) {   // Nov 12: Longer nights runs to 5 months, so the nap example day starts at 5
  const b=family(age,{twoNaps:answer,swaddleStopped:'Yes',mattressLowest:'Yes'});
  b.run("openPage('chg:Sleep:d:day')");const html=b.html();
  const count=Number(html.match(/Example day · (\d+) naps/)[1]);
  check((html.match(/data-sample-nap=/g)||[]).length===count,'Sample day matches the displayed nap count');
  const times=[...html.matchAll(/<time datetime="(\d\d):(\d\d)"/g)].map(m=>Number(m[1])*60+Number(m[2]));
  check(times.length>=6 && times.every((v,i)=>i===0||v>times[i-1]),'Example day has actual, increasing clock times');
  check(times.at(-1)>=19*60 && times.at(-1)<=20*60,'Example bedtime fits the displayed bedtime range');
}
for(const age of [0,1,2,3]) {
  const b=family(age);b.run("openPage('chg:Sleep:d:day')");
  check(!/data-sample-nap=/.test(b.html()),'Early flexible sleep does not imply fixed nap appointments');
}
for(const choice of ['trying','routine','help']) {
  const b=family(5,{swaddleStopped:'Yes'});
  b.run(`chgChooseSettling('${choice}');openPage('topic:Sleep')`);
  check(!clean(b.html()).includes('From around 4–6 months, learn about optional methods'),'The Sleep entry reflects the selected support, not another introduction');
}
// Nov 7: Feeding follows the milk set in Baby's details. Old milk links open the matching new page.
{
  const b=family(11,{solids:'Yes',foodExperience:'established'});
  b.run("openPage('chg:Feeding:d:milk12')");
  check(/whole milk/i.test(clean(b.html())),'The first-birthday milk page names the milk it describes');
  const c=family(2);
  c.run("openPage('chg:Feeding:help')");
  check(/spit/i.test(clean(c.html())),'The spit-up help is reachable beyond the newborn guide');
}
for(const age of [1,2,3,4,5,6,7,8,9,10,11,12]) {
  const b=boot({name:'Ari',dob:'2025-10-21',feed:'Breast milk',feedHow:'Pumping',pronouns:'he'},{},{},new Date(Date.UTC(2025,9+age,21,12)).toISOString());
  b.run("openPage('chg:Feeding:d:milk')");
  const h=clean(b.html());
  check(!/formula/i.test(h),'Breast-milk bottle amounts do not inherit formula amounts');
}
{
  const b=family(9,{solids:'Yes',foodExperience:'new'});
  b.run("openPage('chg:Feeding:s:1')");
  check(!b.html().includes('onclick="chgSetStage(\'Feeding\',1)"'),'A milk reference cannot be mistaken for a report that solids stopped');
}
console.log(JSON.stringify({checks,uniqueMonthlyActivities:ids.size,status:'passed',limits:'Editorial contracts protect selected decisions; they do not measure usefulness or clinical accuracy.'},null,2));
