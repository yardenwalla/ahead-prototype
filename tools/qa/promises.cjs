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

// 5. Nov 8 feedback: every "Seen it" counts in Memories, and the memory book sits above the months.
{
  const a = family(7);
  a.run(`hubSeen(journeySkillKey('Laughs')); hubSeen(journeySkillKey('Blows raspberries')); hubSeen(journeySkillKey('Squeals'))`);
  const t = text(open(a, 'timeline'));
  check(/3 moments so far/.test(t), 'Memories counts every saved moment, not just the big firsts');
  check(t.indexOf('memory book') < t.indexOf('Month by month'), 'The memory book card sits above Month by month');
  check(/See it in the book/.test(toasts(a)) && !/Change date/.test(toasts(a)), 'Seen it offers See it in the book, not Change date');
}

// 6. Everyday care: no shopping list, and the sun page is about sun, not water.
{
  const a = family(7);
  check(!/What you’ll need/.test(open(a, 'topic:Daily rhythm')), 'Everyday care has no What you’ll need link');
  const sun = text(open(a, 'chg:Daily rhythm:d:sun'));
  check(!/Sunscreen and water|4–8 ounces/.test(sun), 'The sun page doesn’t teach water; Feeding does');
}

// 7. Nov 8: Seen it has no dates, and a moment can move to another month of the book.
{
  const a = family(7);
  a.run(`hubSeen(journeySkillKey('Laughs'))`);
  check(!/· (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(toasts(a)), 'Seen it confirms without a date');
  const id = a.run(`journeyData().records.find(r => r.type === 'milestone').id`);
  a.run(`memMoveTo(3, '${id}')`);
  check(a.run(`memMonthOf(journeyData().records.find(r => r.id === '${id}').date)`) === 3, 'Moving a moment puts it in that month of the book');
}

// 8. Home's "You might notice" rows: each tap opens its own page, written for that month, and says what Home says.
//    (Nov 9 QA: rows opened the newborn stomach-size page for a 6-month-old's first bites, the "getting enough"
//    page for spit-up, and quoted "8–10 tries" where Feeding says 10–15.)
{
  const src = require('node:fs').readFileSync(require('node:path').join(__dirname, '../../js/home-glance.js'), 'utf8');
  const MONTHS = new Function('return ' + src.match(/const MONTHS = (\{[\s\S]*?\n  \});/)[1])();
  const ranges = t => (t.match(/\d+[–-]\d+/g) || []).map(n => n.replace('-', '–'));
  for (const [m, M] of Object.entries(MONTHS)) {
    const a = family(+m, 10);
    for (const [title, why, , , go] of M.notice) {
      if (!go) continue;
      const cat = go.startsWith('chg:') ? go.split(':')[1] : null;
      const t = text(open(a, go));
      if (cat) check(t !== text(open(a, 'topic:' + cat)), `Month ${m} “${title}” opens its own page, not the ${cat} summary`);
      check(!(+m >= 2 && /Newborns can only|Day 1 1–2 tsp/.test(t)), `Month ${m} “${title}” doesn’t open a page written for newborns`);
      const there = cat ? t + text(open(a, 'topic:' + cat)) : t;
      for (const n of ranges(why)) check(there.includes(n), `Month ${m} “${title}” says ${n}, and so does ${cat || 'the page it opens'}`);
    }
  }
}

// 9. Home's rows follow the family's milk: a formula baby gets Feeding's bottle count, and no breastfed-only lines.
{
  const src = require('node:fs').readFileSync(require('node:path').join(__dirname, '../../js/home-glance.js'), 'utf8');
  const MONTHS = new Function('return ' + src.match(/const MONTHS = (\{[\s\S]*?\n  \});/)[1])();
  const W = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
  const digits = t => t.replace(/\b(Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve) to (two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/gi, (_, x, y) => `${W[x.toLowerCase()]}–${W[y.toLowerCase()]}`);
  for (const feed of ['Breast milk', 'Formula', 'Both']) {
    const a = boot({ name: 'Ari', dob, feed, pronouns: 'he', id: 'c', joined: dob }, {}, {}, at(0, 10));
    const shown = m => MONTHS[m].notice.map(r => (r[5] && feed === 'Formula' ? r[5] : r).join(' ')).join(' ');
    const perDay = (text(open(a, 'topic:Feeding')).match(/Feeds a day (\d+–\d+)/) || [])[1];
    check(perDay && digits(shown(0)).includes(perDay), `${feed}: Home’s newborn feed count is Feeding’s ${perDay} a day`);
    check(text(open(a, 'home')).includes(perDay), `${feed}: the newborn month card says ${perDay} a day too`);
    if (feed === 'Formula') check(!/low milk|days between poops|breastfed/i.test(shown(0) + shown(1)), 'Formula: Home has no breastfed-only lines');
  }
}

// 10. Nov 13: Memories is a baby book. Checkups never show there, and a month with lots noticed stays short.
{
  const a = family(9);
  a.run(`(() => { const d = journeyData(); d.records.push({ id: 'v4', type: 'visit', status: 'attended', date: '2026-02-23', title: '4-month checkup' }); saveJourneyData(d); })()`);
  a.run(`(() => { const d = journeyData(); ['Copies sounds', 'Reaches for a toy', 'Brings things to mouth', 'Pushes up on arms', 'Looks at self in a mirror', 'Knows familiar people', 'Passes a toy hand to hand', 'Babbles'].forEach((t, i) => d.records.push({ id: 'n' + i, type: 'milestone', status: 'attended', date: '2026-04-25', title: t, skillKey: 'k' + i })); saveJourneyData(d); })()`);
  check(!/checkup/i.test(text(open(a, 'timeline'))), 'Memories never lists checkups');
  const book = open(a, 'chg:Timeline:firsts');
  check(!/class="bk-tag/.test(book), 'The memory book writes the smaller things as one line, not a chip each');
  check(/and \d+ more/.test(text(book)) && (book.match(/bk-noted-it is-extra/g) || []).length >= 1, 'A busy month shows five, then “and N more”');
  check((book.match(/openPage\('event-edit:/g) || []).length >= 8, 'Every moment in the book can still be opened to move or remove it');
}

console.log(`Promise checks: ${checks} passed`);
