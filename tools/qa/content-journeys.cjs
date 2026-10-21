// Run: node tools/qa/content-journeys.cjs
// 100 deterministic families, newborn through 12 months, all six categories.
// Template/handler checks only: no browser layout or clinical validation claim.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const boot = require('./content-runtime.cjs');
let checks = 0, renders = 0, routes = 0;
const expect = (value, why) => { checks++; assert.ok(value, why); };
const text = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const topics = ['Development', 'Daily rhythm', 'Sleep', 'Feeding', 'Safety', 'Health'];
const birth = '2025-10-21';
function render(app, route) {
  app.run(`openPage(${JSON.stringify(route)})`);
  const h = app.html(); renders++;
  expect(h.length > 300, `${route}: populated`);
  expect(!/\bundefined\b|\bNaN\b|\[object Object\]/.test(text(h)), `${route}: no broken copy`);
  return h;
}
for (let family = 0; family < 100; family++) {
  const early = family % 5 === 0, feed = ['Breast milk', 'Formula', 'Both', 'Prefer not to say'][family % 4];
  const profile = { name: family === 99 ? 'Ari & Jo' : 'Baby ' + family, dob: birth, early, due: early ? '2025-12-02' : '', feed, example: false };
  const storage = {};
  for (let age = 0; age <= 12; age++) {
    const date = new Date(Date.UTC(2025, 9 + age, 21, 12)).toISOString();
    const answers = {};
    if (family % 5 !== 1 && age >= 4 + family % 3) answers.rollDirection = family % 4 === 0 ? 'Not yet' : family % 4 === 1 ? 'Trying to roll' : 'Tummy to back';
    if (family % 5 !== 1 && age >= 7 + family % 3) answers.crawl = 'Yes';
    if (family % 5 !== 1 && age >= 9 + family % 3) answers.pullUp = 'Yes';
    if (family % 6 !== 0 && age >= 6) {
      answers.solids = age < 6 + family % 3 ? 'Not yet' : 'Yes';
      if (answers.solids === 'Yes') answers.foodExperience = age < 9 + family % 3 ? 'new' : 'established';
    }
    if (family % 4 === 0) answers.swaddleStopped = 'Yes';
    if (age >= 8 && family % 3 === 0) answers.twoNaps = 'Stay';
    if (age >= 8 && family % 3 === 1) answers.twoNaps = 'Yes';
    const app = boot(profile, answers, storage, date);
    const before = app.run('JSON.stringify(answers)');
    app.run("navigate('home')");
    const home = app.html(), debug = app.run('homeRulesDebug()'); renders++;
    expect(debug.main.length <= 3 && debug.next.length <= 2, 'Home stays digestible');
    expect(new Set(debug.main.map(x => x.split(':')[0])).size === debug.main.length, 'One Home row per category');
    expect(!/Health explains|Play shows how|connects Development|undefined/.test(text(home)), 'Home describes baby, not app navigation');
    if (answers.foodExperience === 'new') expect(!text(home).includes('is eating meals'), 'Age must not become a reported meal history');
    if (!answers.crawl && !answers.pullUp && !['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection)) expect(!/You’ve noticed rolling|You said .*is rolling/.test(text(home)), 'No unreported rolling claim');
    const summary = app.run('monthlyFocus().body');
    expect(!/Health explains|Play shows how|connects Development|Health prepares|Feeding helps you/.test(summary), 'All personalized summaries stay parent-facing');
    for (const topic of topics) {
      const h = render(app, 'topic:' + topic);
      const links = [...h.matchAll(/onclick="openPage\('([^']+)'\)"/g)].map(m => m[1]);
      for (const route of new Set(links.filter(x => /^(health-detail|skill-guide|play-activity|chg:)/.test(x)))) { render(app, route); routes++; }
    }
    for (const cat of ['Sleep', 'Feeding']) {
      for (const screen of cat === 'Sleep' ? ['safe', 'settle', 'help'] : ['safe', 'milk', 'allergy', 'help']) render(app, `chg:${cat}:${screen}`);
      const n = app.run(`AHEAD_CHANGES.${cat}.CH.length`);
      for (let i = 0; i < n; i++) render(app, `chg:${cat}:s:${i}`);
    }
    expect(app.run('JSON.stringify(answers)') === before, 'Reading guides never records skills or completion');
    app.run("navigate('home')");
    expect(app.run('month') === age, 'Browsing returns to current birthday age');
  }
}
// Specific regressions: precision of date ranking, explicit actions, fresh checklists.
{
  const a = boot({ name: 'Sam', dob: '2026-05-21', early: false, due: '', feed: 'Formula', example: false });
  expect(a.run('homeRulesDebug().next.some(x=>x.startsWith("Health:"))'), 'A checkup in the coming month earns a preparation slot');
  const safe = render(a, 'chg:Sleep:safe');
  expect(!safe.includes('aria-checked="true"'), 'Fresh checklists do not assume actions done');
  a.run("chgToggleSafe('Sleep',0)");
  expect(a.html().includes('aria-checked="true"'), 'Explicit checklist completion is reflected');
  a.run("setAnswer('swaddleStopped','Yes');setAnswer('rollDirection','Not yet');navigate('home')");
  expect(!text(a.html()).includes('You’ve noticed rolling'), 'Not yet is not rolling');
  a.run("saveJourneyVisit(4,{date:'2026-10-20',status:'planned'});navigate('home')");
  expect(a.run('homeRulesDebug().main.some(x=>x.startsWith("Health: 4-month"))'), 'A saved appointment does not vanish when baby ages past its visit label');
  expect(text(a.html()).includes('New movement, feeding and sleep questions'), 'Saved dates retain the visit purpose');
  a.run("saveJourneyVisit(4,{date:'2026-10-20',status:'attended'});navigate('home')");
  expect(!a.run('homeRulesDebug().main.some(x=>x.startsWith("Health: 4-month"))'), 'Attended checkups leave the pending recommendations');
  a.run("answers={};persist();chgSetSafety('pulling')");
  expect(a.run("answers.pullUp==='Yes'&&!answers.crawl&&!answers.roll"), 'Reporting pulling up does not report crawling or rolling');
  a.run("resetBabyChanges();openPage('chg:Sleep:safe')");
  expect(!a.html().includes('aria-checked="true"'), 'A new setup resets example checklist progress');
  const newborn = boot({name:'Lee',dob:'2026-09-21',early:false,due:'',feed:'Both',example:false});
  const earlyHelp=render(newborn,'chg:Sleep:settle');
  expect(!/Ferber|graduated extinction|Most families who try sleep training/.test(text(earlyHelp)), 'Early settling support does not introduce training methods');
}
// Open every answer branch, including content hidden until a question is answered.
{
  const a=boot({name:'Kai',dob:'2026-01-21',early:false,due:'',feed:'Both',example:false},{solids:'Yes',foodExperience:'new'});
  for(const cat of ['Sleep','Feeding']) {
    const data=JSON.parse(a.run(`JSON.stringify(AHEAD_CHANGES.${cat})`));
    for(let stage=0;stage<data.CH.length;stage++) {
      const key=data.CH[stage].key, questions=data.DEC[key]||[];
      for(let q=0;q<questions.length;q++)for(let choice=0;choice<questions[q][2].length;choice++) {
        render(a,`chg:${cat}:s:${stage}`);
        a.run(`chgAnswer(${JSON.stringify(cat+':'+key+':'+q)},${choice})`);
        expect(!/undefined|NaN/.test(text(a.html())), 'All FAQ answer branches render');
      }
    }
    for(let event=0;event<data.EV.length;event++)render(a,`chg:${cat}:e:${event}`);
  }
  a.run("openPage('chg:Feeding:s:4')");
  expect(!a.html().includes('You said Kai eats finger foods'),'Age-based texture guidance is not a claimed parent report');
}
console.log(JSON.stringify({ families: 100, chronologicalMonths: 1300, renders, linkedRoutes: routes, checks, status: 'passed', limits: 'Template and handler QA; no browser visual or clinical review' }, null, 2));
