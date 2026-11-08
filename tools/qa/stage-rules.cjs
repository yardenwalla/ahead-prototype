// Stage system checks: the rules in the project doc "ahead-stage-system.md".
// One stage list per guide, "Now" on the baby's stage, "Make this [name]'s stage" only where the stage table allows it,
// changes that stick (and show the same everywhere), Undo, and the age/answer rules.
const assert = require('node:assert/strict');
const boot = require('./content-runtime.cjs');
let checks = 0;
const check = (v, m) => { checks++; assert.ok(v, m); };
const dob = '2025-10-21';
const at = age => new Date(Date.UTC(2025, 9 + age, 21, 12)).toISOString();
const family = (age, answers = {}, storage = {}) => boot({ name: 'Ari', dob, feed: 'Both', pronouns: 'he' }, answers, storage, at(age));
// The stages behind the page last shown (the "All stages" page and the Preview card use the same list).
const stages = a => JSON.parse(a.run(`JSON.stringify(((stageItemsLast()||{}).items||[]).map(x => ({ cls: (x.on ? 'is-on ' : '') + (x.now ? 'is-now' : ''), change: !!(x.on && x.change), name: x.label })))`));
const nowName = a => (stages(a).find(s => /is-now/.test(s.cls)) || {}).name;
const ROUTES = { Sleep: i => `chg:Sleep:s:${i}`, Feeding: i => `chg:Feeding:mock:dirD:${i}`,
  Development: i => `development-stage:${[2, 4, 6, 9, 12][i]}`, Safety: i => `safety-stage:${['setup', 'reaching', 'rolling', 'pulling'][i]}`,
  Health: i => `health-visit:${[0, 1, 2, 4, 6, 9, 12][i]}` };

// Every guide, every month: one timeline, one "Now", one stage being read, Change only on the stage being read.
for (let age = 0; age <= 12; age++) for (const cat of Object.keys(ROUTES)) {
  const a = family(age); a.run(`openPage('topic:${cat}')`);
  const s = stages(a);
  check(s.length >= (cat === 'Safety' ? 3 : 4), `${cat} at ${age} months has its stages`);
  check(s.filter(x => /is-now/.test(x.cls)).length === 1, `${cat} at ${age} months marks exactly one stage Now`);
  check(s.filter(x => /is-on/.test(x.cls)).length === 1, `${cat} at ${age} months has one stage being read`);
  check(!s.some(x => x.change), `${cat} at ${age} months: no Change on the baby's own stage`);
  check(!/monthly-save" onclick|Save this guide|This is where/.test(a.html()), `${cat}: no bookmark and no old stage links`);
  const nowI = s.findIndex(x => /is-now/.test(x.cls));
  s.forEach((x, i) => {
    if (i === nowI) return;
    a.run(`openPage('${ROUTES[cat](i)}')`);
    const v = stages(a), mine = v[i];
    check(mine && /is-on/.test(mine.cls), `${cat}: tapping ${x.name} opens it`);
    check(v.filter(y => y.change).length <= 1, `${cat}: at most one Change`);
    const allowed = a.run(`stageCanChange(${JSON.stringify(cat)}, ${i}, ${nowI})`);
    check(mine.change === allowed, `${cat} at ${age} months: Change on ${x.name} matches the stage table`);
    if (cat === 'Health' || cat === 'Development') check(!mine.change, `${cat} never offers Change`);
    if (cat === 'Safety' && i < nowI) check(mine.change, 'Safety can go back a stage');
    if (cat === 'Sleep' && i === 0 && age > 3) check(!mine.change, 'Round-the-clock sleep (swaddling) cannot be picked after 3 months');
    if (cat === 'Feeding' && i >= 2 && age < 4) check(!mine.change, 'Solids stages cannot be picked before 4 months');
    if (cat === 'Feeding' && i === 4 && age < 8) check(!mine.change, 'Meals cannot be picked before 8 months');
    if (!['Health', 'Development', 'Feeding'].includes(cat) && !(cat === 'Sleep' && i === 0 && age > 3)) check(mine.change, `${cat} at ${age} months: ${x.name} can be picked`);
  });
}

// Change sticks, shows the same in Baby's details, and Undo puts it back.
for (const [cat, age, i, label] of [['Sleep', 7, 3, 'Two naps'], ['Sleep', 10, 2, 'Three naps'], ['Sleep', 5, 1, 'Longer nights'], ['Feeding', 7, 3, 'First foods'], ['Feeding', 9, 2, 'Ready for solids'],
  ['Feeding', 7, 1, 'Milk feeds'], ['Safety', 2, 2, 'Crawling'], ['Safety', 10, 1, 'Rolling']]) {
  const a = family(age); a.run(`openPage('topic:${cat}')`);
  const before = nowName(a);
  a.run(`openPage('${ROUTES[cat](i)}');hubChangeStage(${JSON.stringify(cat)}, ${i})`);
  check(nowName(a) === label, `${cat} at ${age} months: Change makes ${label} the baby's stage`);
  a.run("navigate('profile')");
  check(a.html().includes(label), `${cat}: Baby's details shows ${label}`);
  a.run(`navigate('categories');openPage('topic:${cat}')`);
  check(nowName(a) === label, `${cat}: the change sticks`);
  const u = family(age);
  u.run(`openPage('${ROUTES[cat](i)}');hubChangeStage(${JSON.stringify(cat)}, ${i});stageUndo();navigate('categories');openPage('topic:${cat}')`);
  check(nowName(u) === before, `${cat}: Undo goes back to ${before}`);
}

// Rule 1 and Rule 2: age guesses; the parent's answer wins and holds.
{
  let a = family(8); a.run("openPage('topic:Sleep')"); check(nowName(a) === 'Three naps', 'Sleep at 8 months guesses Three naps');
  a = family(9); a.run("openPage('topic:Sleep')"); check(nowName(a) === 'Two naps', 'Sleep at 9 months guesses Two naps');
  a = family(11, { twoNaps: 'Not yet' }); a.run("openPage('topic:Sleep')"); check(nowName(a) === 'Three naps', 'A parent’s “not yet” holds past 9 months');
  a = family(6, { twoNaps: 'Yes' }); a.run("openPage('topic:Sleep')"); check(nowName(a) === 'Two naps', 'A parent’s “two naps” wins before 9 months');
  a = family(8); a.run("openPage('topic:Feeding')"); check(nowName(a) === 'Ready for solids', 'Feeding with no solids answer waits on Ready for solids');
  a = family(10); a.run("openPage('topic:Feeding')"); check(['First foods', 'Meals'].includes(nowName(a)) && /We’re showing solids for Ari’s age/.test(a.html()), 'From 9 months with no answer, Feeding shows solids for the age and says so');
  a = family(10, { solids: 'Not yet' }); a.run("openPage('topic:Feeding')"); check(nowName(a) === 'Ready for solids', 'A parent’s “not yet” holds at 10 months');
  a = family(10, { solids: 'Yes', foodExperience: 'new' }); a.run("openPage('topic:Feeding')"); check(nowName(a) === 'First foods', 'A parent’s “we’ve started” holds');
  a = family(5); a.run("openPage('topic:Feeding')"); check(nowName(a) === 'Ready for solids', 'Ready for solids shows from 4 months');
  a = family(3); a.run("openPage('topic:Feeding')"); check(nowName(a) === 'Milk feeds', 'Milk feeds before 4 months');
  a = family(4, { solids: 'Yes', solidsStart: '2026-02-21' }); a.run("openPage('topic:Feeding')"); check(nowName(a) === 'First foods' && a.html().includes('Tastes, textures'), 'Starting at 4 months opens First foods');
  for (const age of [0, 3, 7, 11]) { const c = family(age); c.run("openPage('topic:Daily rhythm')"); const st = stages(c); check(st.length === 4 && st.filter(x => /is-now/.test(x.cls)).length === 1 && !st.some(x => x.change), `Everyday care at ${age} months has a read-only timeline`); for (let i = 0; i < 4; i++) { c.run(`openPage('chg:Daily rhythm:s:${i}')`); const v = stages(c); check(v[i] && /is-on/.test(v[i].cls) && !v.some(x => x.change), `Everyday care: stage ${i} can be read, never changed`); } }
}
// Rule 3: an old "not yet" brings the naps question back to Home a month later.
{
  const storage = {};
  let a = family(6, {}, storage); a.run("navigate('home');answerHomeQuestion('food','new');navigate('home')");
  check(a.run('homeQuestionQueue()').includes('naps'), 'From 6 months on Three naps, the catnap question is queued');
  check(a.run('homeQuestion()') === null, 'One question per visit: nothing else asked right after an answer');
  a.run("recordCheckin('naps','No');setAnswer('twoNaps','Not yet')");
  check(!a.run('homeQuestionQueue()').includes('naps'), 'Answered: not asked again straight away');
  a = boot({ name: 'Ari', dob, feed: 'Both', pronouns: 'he' }, JSON.parse(storage['ahead-v2-answers']), storage, at(7));
  a.run("navigate('home')");
  check(a.run('homeQuestionQueue()').includes('naps'), 'A month later, the naps question is due again');
}
// One rule everywhere: a pick holds until the parent changes it. When the baby outgrows it, Home asks once.
for (const [cat, pickRoute, i, pickAge, laterAge, picked, next] of [
  ['Safety', 'safety-stage:setup', 0, 4, 7, 'First setup', 'Crawling'],
  ['Sleep', 'chg:Sleep:s:1', 1, 4, 9, 'Longer nights', 'Two naps']]) {
  const storage = {};
  let a = family(pickAge, {}, storage); a.run(`openPage('${pickRoute}');hubChangeStage(${JSON.stringify(cat)}, ${i});openPage('topic:${cat}')`);
  check(nowName(a) === picked, `${cat}: pick holds`);
  const saved = () => JSON.parse(storage['ahead-v2-answers']);
  a = boot({ name: 'Ari', dob, feed: 'Both', pronouns: 'he' }, saved(), storage, at(laterAge)); a.run(`openPage('topic:${cat}')`);
  check(nowName(a) === picked, `${cat}: still ${picked} after age moves on — the app doesn't move it`);
  check(a.run('homeQuestionQueue()').includes('outgrown:' + cat), `${cat}: Home asks whether to move on`);
  a.run(`stageFollowAge(${JSON.stringify(cat)});openPage('topic:${cat}')`);
  check(nowName(a) === next, `${cat}: “Yes, move on” follows age again (${next})`);
}
for (const [cat, route, i] of [['Safety', 'safety-stage:reaching', 1], ['Sleep', 'chg:Sleep:s:1', 1], ['Feeding', 'chg:Feeding:s:1', 1]]) {
  const a = family(9); a.run(`openPage('${route}');hubChangeStage(${JSON.stringify(cat)}, ${i})`);
  check(!a.run('homeQuestionQueue()').includes('outgrown:' + cat), `${cat}: picking an earlier stage doesn't trigger the outgrown question straight away`);
}
{
  const a = family(7); a.run("openPage('safety-stage:reaching');hubChangeStage('Safety',1);setAnswer('crawl','Yes');openPage('topic:Safety')");
  check(nowName(a) === 'Crawling', 'Telling us about a new movement replaces an older Safety pick');
  const b = family(8, { pullUp: 'Yes', movementSetByParent: true }); b.run("openPage('topic:Safety')");
  check(nowName(b) === 'Pulling up' && /Standing brings everything higher into reach/.test(b.html()), 'Pulling up is its own stage and leads with what changes when standing');
}
// Review fixes: search finds common worries; a future month on Home reads as a preview; setup never shows a sample name.
{
  const a = family(5); a.run("navigate('categories');openPage('explore')");
  const find = q => { a.run(`searchGuides(${JSON.stringify(q)})`); return a.run("document.querySelector('.hub-results').innerHTML").replace(/<[^>]+>/g, ' '); };
  for (const [q, expect] of [['fever', 'Fever and sick days'], ['how much formula', 'How much milk or formula'], ['spit up', 'Spit-up'], ['diaper rash', 'Diaper rash'],
    ['constipation', 'When to call your pediatrician'], ['swaddle', 'Swaddling'], ['teething', 'Teething'], ['vaccines', 'Checkups and vaccines'], ['sleep regression', '4-month sleep change']])
    check(find(q).includes(expect), `Search “${q}” finds ${expect}`);
  check(/Nothing on/.test(find('zebra')), 'Search with no match says so and suggests words');
  a.run("navigate('home');setMonth(8)");
  check(/Coming up · 8 months/.test(a.html()) && !/Likely around now/.test(a.html()), 'A future month on Home reads as a preview');
}
// Resources: search lives on Categories and only opens Ahead's own guides.
{
  const a = family(9); a.run("navigate('categories')");
  check(a.html().includes('hub-cat-search') && !/Resources and search|Taking Cara/.test(a.html()), 'Categories has search and no Resources section');
  for (const q of ['teeth', 'fever', 'sleep', 'formula', 'rash', 'crawling']) { a.run(`searchGuides(${JSON.stringify(q)})`); check(!/resource:/.test(a.run("document.querySelector('.hub-results').innerHTML")), `Search “${q}” never opens a resource page`); }
}
// Born early: the adjusted age sits next to the age on Home and opens About age.
{
  const a = boot({ name: 'Ari', dob, feed: 'Both', pronouns: 'he', early: true, due: '2025-12-02' }, {}, {}, at(9));
  a.run("navigate('home')");
  check(/hub-agechip/.test(a.html()) && !/connected-age-note/.test(a.html()), 'Home shows the adjusted age next to the age, once');
  a.run("openPage('age-context')");
  check(/Two ages, one Ari/.test(a.html()) && /Development and play/.test(a.html()) && /hubSetAgeMode\('safety'/.test(a.html()), 'About age explains both ages and lets you switch which one each area follows');
}
console.log(JSON.stringify({ suite: 'stage-rules', checks, status: 'passed' }, null, 2));
