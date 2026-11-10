// Home only shows proactive, valuable things. Warnings, emergencies and "when to call" live in the categories and
// search, never on Home's "This month" cards. Fails if a card mentions one.
const fs = require('node:fs'), path = require('node:path');
const src = fs.readFileSync(path.resolve(__dirname, '../../js/home-glance.js'), 'utf8');
const block = (src.match(/const CARDS = \[([\s\S]*?)\n  \];/) || [])[1];
if (!block) { console.error('home-value: could not find the Home cards'); process.exit(1); }
const BANNED = /\b(ER|911|emergenc\w*|poison\w*|chok\w*|batter(y|ies)|fever\w*|°F|call (your|the|now)|SIDS|suffocat\w*|burn\w*|drown\w*|danger\w*|warning)\b/i;
const rows = block.split('\n').filter(l => l.trim().startsWith('['));
const bad = rows.filter(l => { const t = l.match(/'(?:[^'\\]|\\.)*'/g) || []; return BANNED.test(t.slice(2, 4).join(' ')) || BANNED.test(t[4] || '') || BANNED.test(t[5] || ''); });
if (bad.length) { console.error('home-value: warnings on Home:\n' + bad.join('\n')); process.exit(1); }
console.log(JSON.stringify({ suite: 'home-value', cards: rows.length, status: 'passed' }));
// Every month's Home copy keeps the same shape: short titles, one-to-two-sentence explanations, nothing repeated.
const m = src.match(/const MONTHS = (\{[\s\S]*?\n  \});/);
if (m) {
  const MONTHS = new Function('return ' + m[1])(), words = t => t.trim().split(/\s+/).length, bad2 = [], seen = new Map();
  for (const [k, M] of Object.entries(MONTHS)) {
    if (words(M.eyes[0]) > 7) bad2.push(`${k}: eyes headline too long`);
    if (words(M.eyes[1]) < 12 || words(M.eyes[1]) > 19) bad2.push(`${k}: eyes line is ${words(M.eyes[1])} words`);
    for (const [t, why, variant] of M.notice.flatMap(r => r[5] ? [r, [...r[5], 'formula']] : [r])) {
      if (words(t) > 7) bad2.push(`${k}: title too long: ${t}`);
      // Two lines at most on a phone (Nov 10: lighter copy): 72 characters, and still a real sentence.
      if (why.length > 72 || words(why) < 6) bad2.push(`${k}: "${t}" explanation is ${why.length} characters, ${words(why)} words`);
      if (BANNED.test(t + ' ' + why)) bad2.push(`${k}: warning on Home: ${t}`);
      const key = t.toLowerCase(); if (seen.has(key) && variant !== 'formula') bad2.push(`${k}: "${t}" repeats month ${seen.get(key)}`); seen.set(key, k);
    }
  }
  if (bad2.length) { console.error('home-value: month copy:\n' + bad2.join('\n')); process.exit(1); }
  console.log(JSON.stringify({ suite: 'home-value', months: Object.keys(MONTHS).length, status: 'passed' }));
}
