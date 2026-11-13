// The Next card, the same in every guide (design guide: "Next"). Each guide's Next starts "Next ·",
// names the next stage, and has at most one line under it, 60 characters or fewer, that says what to
// watch for or get ready for. Seasonal cards ("This season") share the look but aren't a Next.
const assert = require('node:assert/strict');
const boot = require('./content-runtime.cjs');
let checks = 0;
const check = (v, m) => { checks++; assert.ok(v, m); };
const dob = '2025-10-21';
const at = age => new Date(Date.UTC(2025, 9 + age, 21, 12)).toISOString();
const plain = s => s.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, ' ').trim();
const GUIDES = ['Feeding', 'Sleep', 'Health', 'Daily rhythm', 'Childcare', 'Safety', 'Out and about'];
for (let age = 0; age <= 12; age++) for (const cat of GUIDES) {
  const a = boot({ name: 'Ari', dob, feed: 'Both', pronouns: 'he' }, {}, {}, at(age));
  a.run(`openPage('topic:${cat}')`);
  const cards = [...a.html().matchAll(/<button class="hub-next"[\s\S]*?<\/button>/g)].map(m => m[0])
    .filter(c => !/This season/.test(c));
  for (const c of cards) {
    const top = plain((/<small>([\s\S]*?)<\/small>/.exec(c) || [])[1] || '');
    const sub = plain((/<em class="hub-next-sub">([\s\S]*?)<\/em>/.exec(c) || [])[1] || '');
    check(/^Next · /.test(top), `${cat} at ${age} months: Next starts "Next ·" (got "${top}")`);
    check(!/\b(weeks|months) (weeks|months)\b/.test(top), `${cat} at ${age} months: the when reads right (got "${top}")`);
    check(sub.length <= 60, `${cat} at ${age} months: the line under Next is 60 characters or fewer (${sub.length}: "${sub}")`);
  }
}
console.log(`Next cards: ${checks} checks passed`);
