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
  check(clean(a.html()).includes('Recommended for this age'), 'Unknown nap pattern is presented as guidance selected by age');
  a.run("openPage('chg:Sleep:s:2');chgAnswer('Sleep:rhythm:2',1)");
  check(!clean(a.html()).includes('This is likely the 4-month'), 'Unexplained waking is not diagnosed from one answer');
  check(!clean(a.html()).includes('At 5 months, most babies'), 'Multi-age guidance does not leak a fixed five-month instruction');
}

const a = family(8,{twoNaps:'Stay',swaddleStopped:'Yes'});
a.run("openPage('chg:Sleep:e:1')");
check(!clean(a.html()).includes('Keep the two-nap pattern'), 'Separation-anxiety help does not invent a two-nap routine');
a.run("openPage('chg:Sleep:s:2');chgAnswer('Sleep:rhythm:1',1)");
check(!clean(a.html()).includes('Try a stroller ride, car ride'), 'Catnap troubleshooting agrees with safe-sleep guidance');
a.run("chgAnswer('Sleep:rhythm:2',0)");
check(clean(a.html()).includes('rolls both ways'), 'Rolling FAQ retains the both-directions condition');
a.run("openPage('chg:Feeding:s:3');chgAnswer('Feeding:first:0',1)");
check(clean(a.html()).includes('Act now:'), 'Possible choking is an action, not a casual experiment');

const ids = new Set();
for (let age=0; age<=12; age++) {
  const b = family(age);
  const ideas = JSON.parse(b.run(`JSON.stringify(monthlyPlayActivities(${age},null))`));
  check(ideas.length >= 6, 'Each monthly set offers variety');
  for (const idea of ideas) {
    check(!ids.has(idea.id), 'Default monthly sets do not reintroduce the same activity as new');
    ids.add(idea.id);
    b.run(`openPage('play-activity:${age}:${idea.id}')`);
    check(b.html().includes('data-play-activity="'+idea.id+'"'), 'Every curated activity opens its own guide');
  }
}
for (const [age,oldID,newID] of [[1,'slow-song','face-follow'],[3,'sound-answer','sock-puppet'],[3,'coo-copy','sock-puppet'],[12,'toy-homes','water-pour']]) {
  a.run(`openPage('play-activity:${age}:${oldID}')`);
  check(a.html().includes('data-play-activity="'+newID+'"'), 'Old monthly links open the replacement activity');
}
for (const [value,title] of [['new','Starting solids'],['textures','Textures and finger foods'],['established','Family meals']]) {
  const b=family(11);
  b.run(`setFeedingStage('${value}');openPage('topic:Feeding')`);
  check(clean(b.html()).includes('Based on what you shared'), 'Reported eating experience explains feeding selection');
  check(b.html().includes('<h2>'+title+'</h2>'), 'Reported experience selects the matching guide');
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
// A guide marked with a future age is readable, not assignable to a newborn.
for(const age of [0,1,2,3]) {
  const b=family(age),stage=b.run("chgStageIndex('Sleep')");
  b.run("openPage('chg:Sleep:s:2')");
  check(!b.html().includes('onclick="chgSetStage(\'Sleep\',2)"'),'Future sleep reference has no update action');
  b.run("chgSetStage('Sleep',2)");
  check(b.run("chgStageIndex('Sleep')")===stage,'Legacy future-guide actions cannot select older sleep patterns');
  b.run("openPage('chg:Feeding:s:3')");
  check(!b.html().includes('onclick="chgSetStage(\'Feeding\',3)"'),'First-food reference under four months has no update action');
}
// The sample must contain the nap count displayed above it, with ordered times.
for(let age=4;age<=12;age++)for(const answer of ['Stay','Yes']) {
  const b=family(age,{twoNaps:answer,swaddleStopped:'Yes',mattressLowest:'Yes'});
  b.run("openPage('topic:Sleep')");const html=b.html();
  const count=Number(html.match(/<span>Naps<\/span><strong>(\d+)/)[1]);
  check((html.match(/data-sample-nap=/g)||[]).length===count,'Sample day matches the displayed nap count');
  const times=[...html.matchAll(/<time datetime="(\d\d):(\d\d)"/g)].map(m=>Number(m[1])*60+Number(m[2]));
  check(times.length>=6 && times.every((v,i)=>i===0||v>times[i-1]),'Example day has actual, increasing clock times');
  check(times.at(-1)>=19*60 && times.at(-1)<=20*60,'Example bedtime fits the displayed bedtime range');
}
for(const age of [0,1,2,3]) {
  const b=family(age);b.run("openPage('topic:Sleep')");
  check(!/data-sample-nap=/.test(b.html()),'Early flexible sleep does not imply fixed nap appointments');
}
for(const choice of ['trying','routine','help']) {
  const b=family(5,{swaddleStopped:'Yes'});
  b.run(`chgChooseSettling('${choice}');openPage('topic:Sleep')`);
  check(!clean(b.html()).includes('From around 4–6 months, learn about optional methods'),'The Sleep entry reflects the selected support, not another introduction');
}
{
  const b=family(11,{solids:'Yes',foodExperience:'established'});
  b.run("openPage('topic:Feeding');chgChooseMethod('bottle')");
  check(!clean(b.html()).includes('Cow’s milk, if used'),'Before twelve months the milk row does not suggest cow’s milk');
  const c=family(12,{solids:'Yes',foodExperience:'established'});
  c.run("openPage('topic:Feeding');chgChooseMethod('bottle')");
  check(clean(c.html()).includes('Cow’s milk, if used'),'After the birthday the changed milk reference names the milk it describes');
  c.run("openPage('chg:Feeding:milk');chgAnswer('Feeding:learn:2',0)");
  check(c.html().includes('chg-answer'),'The spit-up reference is reachable beyond the newborn guide');
}
for(const age of [1,2,3,4,5,6,7,8,9,10,11,12]) {
  const b=family(age);
  b.run("openPage('topic:Feeding');chgChooseMethod('expressed')");
  const h=clean(b.html());
  check(b.html().includes('value="expressed" selected'),'Expressed milk has its own retained reference selection');
  check(!h.includes('Per formula bottle') && !h.includes('up to 32 oz'),'Breast-milk bottle reference does not inherit formula amounts');
  check(h.includes('25 oz')===(age<=6),'The expressed-milk average is limited to the age range its source covers');
}
{
  const b=family(9,{solids:'Yes',foodExperience:'new'});
  b.run("openPage('chg:Feeding:s:1')");
  check(!b.html().includes('onclick="chgSetStage(\'Feeding\',1)"'),'A milk reference cannot be mistaken for a report that solids stopped');
}
console.log(JSON.stringify({checks,uniqueMonthlyActivities:ids.size,status:'passed',limits:'Editorial contracts protect selected decisions; they do not measure usefulness or clinical accuracy.'},null,2));
