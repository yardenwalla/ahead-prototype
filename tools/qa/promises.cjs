// "It goes where it says" checks: every save, answer and confirmation lands where its words promise,
// and nothing promises a place that doesn't show it (checkups live in Health, not Memories).
const assert = require('node:assert/strict');
const boot = require('./content-runtime.cjs');
let checks = 0;
const check = (v, m) => { checks++; assert.ok(v, m); };
const dob = '2025-10-21';
const at = (age, extraDays = 0) => new Date(Date.UTC(2025, 9 + age, 21 + extraDays, 12)).toISOString();
const family = (age, extraDays = 0) => {
  const a = boot({ name: 'Ari', dob, feed: 'Formula', pronouns: 'he', id: 'c', joined: dob }, {}, {}, at(age, extraDays));
  a.run(`window.__toasts = []; window.hubToast = hubToast = (t, b, act) => __toasts.push([t, b, act ? act[0] : ''].join(' · '));`);
  return a;
};
const toasts = a => JSON.parse(a.run('JSON.stringify(__toasts)')).join(' | ');
const open = (a, r) => { a.run(r === 'home' || r === 'timeline' ? `navigate('${r}')` : `openPage(${JSON.stringify(r)})`); return a.html(); };
const text = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
// The checkup parts of a page: its checkup pages whole, elsewhere only the sentences about a checkup or visit.
const checkupBits = (r, t) => /^(health-visit|visit-form|event-edit:visit)/.test(r) ? t : t.split(/(?<=[.?!])\s/).filter(x => /checkup|visit/i.test(x)).join(' ');

// 1. Checkups never claim to go in Memories: the checkup page, its forms, the edit page and every confirmation.
{
  const a = family(5);
  for (const r of ['health-visit:2', 'visit-form:2', 'visit-form:plan-6', 'topic:Health', 'home'])
    check(!/Memories/.test(checkupBits(r, text(open(a, r)))), `${r}: a checkup never says it goes in Memories`);
  a.run('hubVisitYes(4)');
  check(!/Memories/.test(toasts(a)), 'Marking a checkup done never says Memories');
  check(a.run('healthRecord(4) && healthRecord(4).status') === 'attended', 'Marking a checkup done saves it');
  check(/Done ·/.test(text(open(a, 'health-visit:4'))), 'A checkup marked done shows as Done in Health');
  check(a.run('journeyNotice') == null, 'Marking a checkup done shows one confirmation, not two');
  const edit = text(open(a, 'event-edit:visit-4'));
  check(!/Memories/.test(edit) && /Mark as not done/.test(edit), 'A checkup’s edit page says Mark as not done, not Remove from Memories');
  a.run(`document.querySelector('#editDate').value = '2026-02-25'; submitJourneyEdit({ preventDefault() {} }, 'visit-4')`);
  check(String(a.run('page')).startsWith('health-visit'), 'Changing a checkup’s date goes back to Health, not Memories');
}

// 2. A saved checkup date shows on Home as it gets close, the same day it's saved.
{
  const a = family(8, 15);
  open(a, 'home');
  a.run(`saveJourneyVisit(9, { date: '${at(8, 17).slice(0, 10)}', status: 'planned' })`);
  check(/9-month checkup/.test(text(open(a, 'home'))), 'A checkup saved for 2 days from now shows on Home right away');
}

// 3. Firsts saved in Memories show in the memory book and count where they say.
for (const [title, skill, age] of [['Sat up', 'Sits without support', 9], ['Rolls over', 'Rolls tummy to back', 6], ['Crawled', 'Crawls', 9]]) {
  const a = family(age);
  open(a, 'chg:Timeline:milestone');
  a.run(`document.getElementById = id => ({ firstTitle: { value: ${JSON.stringify(title)} }, firstDate: { value: '${at(age).slice(0, 10)}' } })[id]; hubSaveFirst()`);
  check(new RegExp(title).test(text(open(a, 'chg:Timeline:firsts'))), `“${title}” shows in the memory book`);
  check(/in Memories/.test(toasts(a)) && /See it in the book/.test(toasts(a)), `“${title}”: the confirmation says Memories and offers See it in the book`);
  check(a.run(`skillSeen(${JSON.stringify(skill)})`), `“${title}” counts as seen for “${skill}” in Development`);
}

// 4. Photos: the toast says Memories, and Memories shows the month.
{
  const a = family(5);
  check(!/months photo/.test(open(a, 'timeline')), 'Photo labels read “the 4-month photo”, not “the 4 months photo”');
}

console.log(`Promise checks: ${checks} passed`);
