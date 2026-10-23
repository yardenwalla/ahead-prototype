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
for (const [age,oldID,newID] of [[1,'slow-song','face-follow'],[3,'sound-answer','coo-copy']]) {
  a.run(`openPage('play-activity:${age}:${oldID}')`);
  check(a.html().includes('data-play-activity="'+newID+'"'), 'Old monthly links open the replacement activity');
}
for (const [value,title] of [['new','Starting solids'],['textures','Textures and finger foods'],['established','Family meals']]) {
  const b=family(11);
  b.run(`setFeedingStage('${value}');openPage('topic:Feeding')`);
  check(clean(b.html()).includes('Based on what you shared'), 'Reported eating experience explains feeding selection');
  check(b.html().includes('<h2>'+title+'</h2>'), 'Reported experience selects the matching guide');
}
console.log(JSON.stringify({checks,uniqueMonthlyActivities:ids.size,status:'passed',limits:'Editorial contracts protect selected decisions; they do not measure usefulness or clinical accuracy.'},null,2));
