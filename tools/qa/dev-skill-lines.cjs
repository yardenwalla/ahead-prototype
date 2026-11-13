// Development skill lines (the grey line under each milestone on an area page) are one short sentence:
// 80 characters or fewer, so they fit in about two lines beside the Seen it button (Nov 13, Yarden).
const fs = require('node:fs'), path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '../../js/app.js'), 'utf8');
const start = src.indexOf('const DEV_EXAMPLES={'), end = src.indexOf('\n};', start);
const body = src.slice(start, end + 1), fails = [];
let n = 0;
for (const m of body.matchAll(/\n'(.+?)':'(.+?)',?(?=\n)/g)) {
  n++; const line = m[2];
  if (line.length > 80) fails.push(`${m[1]}: ${line.length} characters (max 80)`);
  if ((line.match(/[.!?](\s|$)/g) || []).length > 1) fails.push(`${m[1]}: more than one sentence`);
}
if (!n) fails.push('No skill lines found');
console.log(JSON.stringify({ suite: 'dev-skill-lines', checks: n, status: fails.length ? 'failed' : 'passed' }, null, 2));
if (fails.length) { console.error(fails.join('\n')); process.exit(1); }
