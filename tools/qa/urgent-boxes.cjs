// The emergency box, the same everywhere (design guide: "Emergency box"). Opens urgent pages at several ages and checks
// that every urgent box uses one of the three labels, and that no "call 911" hides inside a "Call your pediatrician" column.
const assert = require('node:assert/strict');
const boot = require('./content-runtime.cjs');
let checks = 0;
const check = (v, m) => { checks++; assert.ok(v, m); };
const at = age => new Date(Date.UTC(2025, 9 + age, 21, 12)).toISOString();
const plain = s => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const ROUTES = ['chg:Sleep:d:rough', 'chg:Daily rhythm:d:t:sun:2', 'chg:Daily rhythm:d:t:sun:3', 'chg:Daily rhythm:d:rash:peeling', 'chg:Daily rhythm:d:rash:heat',
  'chg:Daily rhythm:d:look:0:poop', 'chg:Daily rhythm:d:look:1:poop', 'chg:Daily rhythm:d:look:0:skin', 'chg:Daily rhythm:d:p:tub', 'chg:Daily rhythm:d:t:diapers:2', 'health-visit:0'];
const LABELS = ['Call 911 right away', 'Call your pediatrician right away', 'Safety first'];
for (const age of [0, 2, 5, 9]) for (const r of ROUTES) {
  const a = boot({ name: 'Ari', dob: '2025-10-21', feed: 'Both', pronouns: 'she' }, {}, {}, at(age));
  a.run(`openPage(${JSON.stringify(r)})`);
  const html = a.html();
  for (const m of html.matchAll(/<section class="hub-card hub-callout is-urgent"><b>([\s\S]*?)<\/b>/g)) check(LABELS.includes(plain(m[1])), `${r} at ${age} months: urgent box label "${plain(m[1])}"`);
  check(!/Get help right away/.test(html), `${r} at ${age} months: no "Get help right away" label`);
  for (const m of html.matchAll(/<div class="hub-vs">([\s\S]*?)<\/div><\/section>/g)) check(!/call 911/i.test(m[1]), `${r} at ${age} months: 911 sits in its own box, not inside "Normal, or time to call?"`);
}
console.log(`Urgent boxes: ${checks} checks passed`);
