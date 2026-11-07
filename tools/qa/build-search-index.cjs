/* Builds js/search-index.js: every section heading, row and step title in the app, with the ages it shows at,
   so search can find things that live inside a page ("Constipation", "Sick days", "Eating out").
   Run with the app served locally:  python3 -m http.server 8765  then  node tools/qa/build-search-index.cjs
   Re-run whenever page content changes. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.AHEAD_URL || 'http://localhost:8765/index.html';
const TODAY = new Date('2026-11-07T12:00:00');
const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const dob = m => new Date(TODAY - Math.round(Math.max(m, 0.3) * 30.44) * 864e5).toISOString().slice(0, 10);
// Two families per age, so lines that only show for one way of feeding are found too.
const FAMILIES = [{ feed: 'Both', feedHow: 'Pumping' }, { feed: 'Breast milk', feedHow: 'Nursing' }, { feed: 'Formula', feedHow: '' }];
const ALLOWED = /^(chg:|topic:|stages:|safety-stage:|safety-checklist)/;

const EXTRACT = () => {
  const main = document.querySelector('#main');
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const title = clean((main.querySelector('h1') || {}).innerText);
  const out = [];
  const seen = new Set();
  const add = (label, sub, to) => { label = clean(label); if (!label || label.length > 90 || seen.has(label)) return; seen.add(label); out.push([label, clean(sub).slice(0, 140), to || '']); };
  main.querySelectorAll('h2, h3, summary').forEach(h => add(h.innerText, ''));
  main.querySelectorAll('button, li, .hub-row, .hub-flow-item, .oa-place, .hub-versus > *').forEach(r => {
    if (r.closest('.hub-search, nav, .stage-nav, .st-nav')) return;
    const b = r.querySelector('b'); if (!b) return;
    const sm = r.querySelector('small, p');
    // A row that opens its own page points search straight at that page.
    const on = (r.getAttribute('onclick') || '').match(/^openPage\('([^']+)'\)$/);
    add(b.innerText, sm ? sm.innerText : '', on ? on[1] : '');
  });
  const links = new Set();
  main.querySelectorAll('[onclick]').forEach(e => (e.getAttribute('onclick').match(/openPage\('[^']+'\)/g) || []).forEach(x => links.add(x)));
  return { page, title, out, links: [...links] };
};

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const index = new Map(); // route|label -> { route, cat, title, label, sub, mask }
  const titles = new Map();
  for (const m of MONTHS) for (const fam of FAMILIES) {
    const profile = { name: 'Maya', dob: dob(m), pronouns: 'he', id: 'search', example: false, joined: dob(m), ...fam };
    const answers = m >= 6 ? { solids: 'Yes' } : {};
    await pg.goto(BASE);
    await pg.evaluate(([p, a]) => { localStorage.clear(); localStorage.setItem('ahead-v2-profile', JSON.stringify(p)); localStorage.setItem('ahead-v2-answers', JSON.stringify(a)); }, [profile, answers]);
    await pg.reload(); await pg.waitForTimeout(300);
    const topics = await pg.evaluate('TOPICS.map(t => t[0])');
    const queue = [...topics.map(t => `openPage('topic:${t}')`), ...['Feeding', 'Sleep', 'Safety'].map(t => `openPage('stages:${t}')`)];
    const seen = new Set();
    let n = 0;
    while (queue.length && n < 320) {
      const go = queue.shift();
      if (seen.has(go)) continue;
      seen.add(go); n++;
      try { await pg.evaluate(go); await pg.waitForTimeout(25); } catch (e) { continue; }
      const r = await pg.evaluate(EXTRACT);
      r.links.forEach(l => { const k = l.slice(10, -2); if (ALLOWED.test(k) && !seen.has(l)) queue.push(l); });
      if (!ALLOWED.test(r.page) || /:preview$/.test(r.page)) continue;
      const cat = r.page.startsWith('safety') ? 'Safety' : (r.page.match(/^(?:chg|topic|stages):([^:]+)/) || [])[1] || '';
      if (!cat) continue;
      if (r.title) titles.set(r.page, r.title);
      for (const [label, sub, to] of r.out) {
        const direct = to && ALLOWED.test(to) && !/:preview$/.test(to) ? to : '';
        const key = (direct || r.page) + '|' + label;
        const e = index.get(key) || { route: direct || r.page, direct: !!direct, cat, label, sub, mask: 0 };
        e.mask |= 1 << m; index.set(key, e);
      }
    }
    process.stdout.write(`month ${m} ${fam.feed}: ${n} pages\n`);
  }
  await browser.close();

  // Headings that repeat across many pages ("Good to know") say nothing about where to go, so they're left out.
  const count = new Map();
  for (const e of index.values()) count.set(e.label, (count.get(e.label) || 0) + 1);
  // The same row often shows on several pages of one category (a stage page and its detail page). Keep one:
  // the page it's shown on at the most ages, then a detail page over a summary page, then the shortest route.
  const bits = x => { let n = 0; while (x) { n += x & 1; x >>= 1; } return n; };
  const best = new Map();
  for (const e of index.values()) {
    const k = e.cat + '|' + e.label, cur = best.get(k);
    const rank = x => [x.direct ? 1 : 0, bits(x.mask), /^(topic|stages):/.test(x.route) ? 0 : 1, -x.route.length];
    const better = !cur || (() => { const a = rank(e), b = rank(cur); for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i]; return false; })();
    if (better) best.set(k, e);
  }
  index.clear(); for (const e of best.values()) index.set(e.route + '|' + e.label, e);
  const generic = /^(good to know|when things don.t go to plan|pack for this|coming up|what other parents ask|sources|back|more|next|done|start here|call 911|call 911 if|call right away if|call your pediatrician)$/i;
  // Write the family's own name and pronouns back as placeholders, so results read right for every baby.
  const tok = s => s.replace(/\bHimself\b/g, '{r}').replace(/\bhimself\b/g, '{r}').replace(/\bHe\b/g, '{S}').replace(/\bhe\b/g, '{s}').replace(/\bhim\b/g, '{o}').replace(/\bHis\b/g, '{P}').replace(/\bhis\b/g, '{p}');
  const rows = [...index.values()]
    .filter(e => count.get(e.label) <= 10 && e.label.length <= 70 && !generic.test(e.label) && !/^\d/.test(e.label))
    .map(e => [e.route, e.direct ? '' : tok(titles.get(e.route) || ''), tok(e.label), tok(e.sub), e.mask, e.direct ? 1 : 0]);
  const file = '/* Generated by tools/qa/build-search-index.cjs. Do not edit by hand: re-run the script.\n'
    + '   Each row: [page, page title, section or row title, its one-line description, ages it shows at (bit n = month n), 1 if the row opens that page itself]. */\n'
    + 'window.SEARCH_DEEP = ' + JSON.stringify(rows).replace(/\],\[/g, '],\n[') + ';\n';
  fs.writeFileSync(path.join(__dirname, '../../js/search-index.js'), file);
  console.log('rows', rows.length, 'bytes', file.length);
})();
