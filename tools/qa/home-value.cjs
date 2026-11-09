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
