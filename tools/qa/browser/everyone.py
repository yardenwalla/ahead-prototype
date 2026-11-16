"""Every-parent simulation. Builds a covering set of families, so every pair of factors appears together at least once:
15 ages, 9 milk set-ups, 3 pronouns, named or not, born 0/4/8/14 weeks early, and no/typical/behind answers.
Each family is crawled through every reachable page, including Home and Home's month previews, and every page is flagged for:
  wrong pronouns or they-grammar, another baby's name ("Maya"), unexplained acronyms, hedging labels ("Likely…"),
  placeholders, near-empty pages, mostly-a-button pages, text-heavy blocks, repeated icons, unlabeled buttons,
  sideways overflow, a link opening a different page, JS errors, and milk words that don't fit the family's milk.
    python3 tools/qa/browser/everyone.py OUTDIR [N]      (N = only the first N families, for a quick try)
Then:  python3 tools/qa/browser/everyone_report.py OUTDIR
OUTDIR/texts.json holds every page's words, for the editorial read."""
import asyncio, json, os, re, datetime, itertools, random, sys
from playwright.async_api import async_playwright

TODAY = datetime.date.today()
OUTD = sys.argv[1] if len(sys.argv) > 1 else "everyone-out"
os.makedirs(OUTD, exist_ok=True)
# Milk words that should never show for a family, unless an allowed phrase explains them
WRONG_MILK = {("Breast milk","Nursing"):r"formula|pump|\bbottle", ("Breast milk","Pumping"):r"formula|latch|both sides|other side", ("Breast milk","Both"):r"formula", ("Breast milk","Stored"):r"formula",
  ("Formula",""):r"breast milk|breastfed|nursing|latch|pump|colostrum|both sides|other side", ("Both","Nursing"):r"\bpump", ("Both","Pumping"):r"latch|both sides|other side"}
MILK_OK = re.compile(r"If you ever add formula|any standard, iron-fortified one works|Formula has the iron|Bottles phase out|bottle in the crib|Nursing can keep going|nipple|Feeding challenges|Pick what|lactation consultant", re.I)
AGES = [0.1, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
FEEDS = [('Breast milk', 'Nursing'), ('Breast milk', 'Pumping'), ('Breast milk', 'Both'), ('Breast milk', 'Stored'), ('Formula', ''),
         ('Both', 'Nursing'), ('Both', 'Pumping'), ('Both', 'Both'), ('Both', 'Stored')]
PRON = ['he', 'she', 'they']
NAMES = ['Noor', '']
EARLY = [0, 4, 8, 14]  # weeks early
ANS = ['none', 'typical', 'behind']

def pairwise():
    factors = [AGES, FEEDS, PRON, NAMES, EARLY, ANS]
    need = set()
    for (i, a), (j, b) in itertools.combinations(list(enumerate(factors)), 2):
        for x in range(len(a)):
            for y in range(len(b)):
                need.add((i, x, j, y))
    rnd = random.Random(7); rows = []
    while need:
        best, bc = None, -1
        for _ in range(60):
            cand = [rnd.randrange(len(f)) for f in factors]
            # seed with an uncovered pair
            i, x, j, y = next(iter(need)) if _ == 0 else rnd.choice(list(need))
            cand[i], cand[j] = x, y
            c = sum(1 for (i2, x2, j2, y2) in need if cand[i2] == x2 and cand[j2] == y2)
            if c > bc: best, bc = cand, c
        rows.append(best)
        need = {(i, x, j, y) for (i, x, j, y) in need if not (best[i] == x and best[j] == y)}
    return [[f[k] for f, k in zip(factors, r)] for r in rows]

def label_key(p): return str(p)

def dob(m): return (TODAY - datetime.timedelta(days=int(max(m, 0.1) * 30.44))).isoformat()

def answers(age_adj, kind):
    if kind == 'none': return {}
    a = {}
    if kind == 'typical':
        if age_adj >= 6: a['solids'] = 'Yes'
        if age_adj >= 4: a['roll'] = 'Yes'
        if age_adj >= 8: a['crawl'] = 'Yes'
        if age_adj >= 9: a['twoNaps'] = 'Yes'
        if age_adj >= 10: a['pullUp'] = 'Yes'
    else:
        if age_adj >= 6: a['solids'] = 'Not yet'
        if age_adj >= 5: a['roll'] = 'Not yet'
        if age_adj >= 9: a['crawl'] = 'Not yet'
    return a

ACR = r'\b(AAP|CDC|RSV|SIDS|DTaP|PCV|MMR|IPV|Hib|NIAID|TSA|ER|CPR|BLW|OTC|SPF|HR|FSA|DCFSA|ICU|NICU|WHO|FDA|CPSC|MD|RN|IBCLC|ASL|PPD|UTI)\b'
CHECK = r"""(ctx) => {
  const m = document.querySelector('#main'); if (!m) return {bad: ['no main']};
  const out = [], T = (m.innerText || '');
  const vw = document.documentElement.clientWidth; let wide = '';
  m.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.right > vw + 2 && !e.closest('[class*="strip"],[class*="carousel"],[class*="scroll"],.monthstrip,table,figure,.hub-where-chips,.care-carousel,.hub-pills,.st-nav,.stage-nav')) { let p = e.parentElement, sc = false; while (p && p !== m) { const ox = getComputedStyle(p).overflowX; if (ox !== 'visible') { sc = true; break } p = p.parentElement } if (!sc) wide = e.tagName + '.' + String(e.className).slice(0, 30) } });
  if (wide) out.push('overflow: ' + wide);
  if (T.trim().length < 60) out.push('nearly empty page');
  const bad = T.match(/undefined|NaN|\[object|\bnull\b|TODO|lorem|\$\{|\{\{|\{[a-zA-Z’'|]{1,12}\}/g); if (bad) out.push('placeholder: ' + [...new Set(bad)].join(' '));
  // Text-heavy pieces and button-only pages
  let heavy = [];
  m.querySelectorAll('p, li, small, .hub-card-text').forEach(e => { const t = (e.innerText || '').trim(); if (t.length > 280 && !e.querySelector('p,li')) heavy.push(t.slice(0, 60)) });
  heavy.forEach(h => out.push('text-heavy: ' + h));
  const btnText = [...m.querySelectorAll('button, a')].map(b => b.innerText || '').join(' ').length;
  if (T.length - btnText < 90 && m.querySelectorAll('button').length) out.push('mostly buttons');
  // Labels that hedge
  m.querySelectorAll('h1, h2, h3, b, .hub-context, .hub-chip').forEach(e => { const t = (e.innerText || '').trim(); if (/^(Likely|Maybe|Might|Possibly|Probably|Perhaps)\b/.test(t)) out.push('hedging label: ' + t.slice(0, 50)) });
  // Repeated item icons
  const seen = {}; m.querySelectorAll('.hub-dot svg[data-art], .hub-tick-art svg[data-art], .hub-iconsteps svg[data-art], .oa-extra-art svg[data-art], .care-ico svg[data-art]').forEach(s => { const n = s.getAttribute('data-art'); seen[n] = (seen[n] || 0) + 1 });
  Object.entries(seen).forEach(([n, c]) => { if (c > 1) out.push('repeated icon: ' + n) });
  // Fallback icon
  const links = new Set(); m.querySelectorAll('[onclick]').forEach(e => (e.getAttribute('onclick').match(/(openPage|navigate)\('[^']+'\)/g) || []).forEach(x => links.add(x)));
  const ext = [...m.querySelectorAll('a[href^="http"]')].map(a => a.getAttribute('href'));
  const unlabeled = [...m.querySelectorAll('button')].filter(b => b.offsetParent && !(b.innerText || '').trim() && !b.getAttribute('aria-label') && !b.getAttribute('title')).length;
  if (unlabeled) out.push('unlabeled button x' + unlabeled);
  const h1 = (m.querySelector('h1') || {}).innerText || '';
  return {bad: out, text: T, links: [...links], ext, h1, page};
}"""

async def run_profile(pg, prof, results, errs):
    age, (feed, how), pr, nm, early, ans = prof
    born = dob(age)
    p = {'name': nm, 'dob': born, 'pronouns': pr, 'id': 'perm', 'example': False, 'joined': born, 'feed': feed, 'feedHow': how}
    if early:
        p['early'] = True; p['due'] = (datetime.date.fromisoformat(born) + datetime.timedelta(weeks=early)).isoformat()
    adj = age - early / 4.345
    a = answers(adj, ans)
    label = f"{age}m early{early}w {pr} name={'Y' if nm else 'N'} {feed}/{how or '-'} ans={ans}"
    await pg.goto('http://localhost:8765/index.html')
    await pg.evaluate("([p,a])=>{localStorage.clear();localStorage.setItem('ahead-v2-profile',JSON.stringify(p));localStorage.setItem('ahead-v2-answers',JSON.stringify(a))}", [p, a])
    await pg.reload(); await pg.wait_for_timeout(350)
    topics = await pg.evaluate("TOPICS.map(t=>t[0])")
    q = ["navigate('home')", "navigate('categories')", "navigate('timeline')", "navigate('profile')", "navigate('year')"]
    q += [f"openPage('topic:{t}')" for t in topics] + [f"openPage('stages:{t}')" for t in ['Feeding', 'Sleep', 'Safety', 'Development', 'Daily rhythm', 'Health']]
    if hash(label_key(prof)) % 4 == 0: q += [f"navigate('home');setMonth({mm})" for mm in range(0, 13)]
    seen = set(); n = 0
    other = ['Maya', 'Ari', 'Leo', 'Ava', 'Ezra', 'Mia', 'Lily', 'Sam']
    PR = {'he': r'\b(she|her|hers|herself)\b', 'she': r'\b(he|him|his|himself)\b', 'they': r'\b(he|him|his|himself|she|her|hers|herself)\b'}[pr]
    while q and n < 420:
        r = q.pop(0)
        if r in seen: continue
        seen.add(r); n += 1; errs.clear()
        want = (re.match(r"openPage\('([^']+)'\)", r) or [None, None])[1]
        try:
            await pg.evaluate(r); await pg.wait_for_timeout(30)
        except Exception as e:
            errs.append('nav throws: ' + str(e)[:100])
        try:
            res = await pg.evaluate(CHECK, None)
        except Exception as e:
            res = {'bad': ['check failed ' + str(e)[:60]], 'text': '', 'links': [], 'ext': [], 'h1': '', 'page': '?'}
        pid = res.get('page', '?')
        if r.startswith('navigate(\'home\');setMonth'): pid = 'home@' + r.split('(')[-1].rstrip(')')
        bad = list(res['bad']) + list(errs)
        t = res['text']
        if want and pid != want and not pid.startswith(want.split(':')[0]): bad.append(f'opened {pid} instead of {want}')
        m = re.search(r'.{0,40}' + PR + r'.{0,30}', t, re.I)
        if m: bad.append('pronoun: …' + m.group(0).replace('\n', ' ') + '…')
        for o in other:
            if re.search(r'\b' + o + r'\b', t): bad.append('sample name: ' + o)
        if not nm and re.search(r'(^|[.!?]\s+|\n)your baby\b', t): bad.append('lowercase "your baby" at sentence start')
        if pr == 'they':
            g = re.findall(r'\b[Tt]hey (?:has|is|was|does|goes|[a-z]+s)\b', t)
            g = [x for x in g if not re.search(r'they (always|sometimes|perhaps|as|us|yes|this|plus|less|unless|across|nearly|mostly)$', x)]
            if g: bad.append('they-grammar: ' + g[0])
        wm = WRONG_MILK.get((feed, how))
        if wm:
            for line in t.split('\n'):
                if re.search(wm, line, re.I) and not MILK_OK.search(line): bad.append('milk word for another set-up: ' + line.strip()[:90]); break
        for ac in set(re.findall(ACR, t)):
            bad.append('acronym: ' + ac)
        key = pid
        d = results.setdefault(key, {'bad': {}, 'h1': set(), 'profiles': 0, 'text': None, 'ext': set()})
        d['profiles'] += 1; d['h1'].add(res.get('h1', '')[:80])
        if d['text'] is None: d['text'] = t[:6000]
        for e in res.get('ext', []): d['ext'].add(e)
        for b in bad: d['bad'].setdefault(b, label)
        for l in res['links']:
            if l not in seen and not re.search(r"openPage\('(trust|resource:|welcome|setup)", l): q.append(l)
    return n

def dump(r, name):
    out = {k: {'bad': v['bad'], 'h1': sorted(v['h1']), 'profiles': v['profiles'], 'ext': sorted(v['ext']), 'text': v['text']} for k, v in r.items()}
    json.dump(out, open(name + '.json', 'w'))

async def worker(profiles, idx, results):
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); pg = await b.new_page(viewport={'width': 390, 'height': 844})
        errs = []
        pg.on('pageerror', lambda e: errs.append('JS error: ' + str(e)[:140]))
        pg.on('console', lambda m: m.type == 'error' and 'favicon' not in m.text and 'Failed to load resource' not in m.text and errs.append('console: ' + m.text[:140]))
        tot = 0
        for k, prof in enumerate(profiles):
            tot += await run_profile(pg, prof, results, errs)
            if k % 5 == 4: print(f'w{idx} {k+1}/{len(profiles)} visits {tot}', flush=True); dump(results, os.path.join(OUTD, f'partial-{idx}'))
        await b.close()
        return tot

async def main():
    profs = pairwise()
    if len(sys.argv) > 2: profs = profs[:int(sys.argv[2])]
    print('profiles', len(profs), flush=True)
    json.dump([[str(x) for x in p] for p in profs], open(os.path.join(OUTD, 'families.json'), 'w'))
    W = 4; results = [{} for _ in range(W)]
    tots = await asyncio.gather(*[worker(profs[i::W], i, results[i]) for i in range(W)])
    merged = {}
    for r in results:
        for k, v in r.items():
            d = merged.setdefault(k, {'bad': {}, 'h1': set(), 'profiles': 0, 'text': v['text'], 'ext': set()})
            d['profiles'] += v['profiles']; d['h1'] |= v['h1']; d['ext'] |= v['ext']
            for b, l in v['bad'].items(): d['bad'].setdefault(b, l)
    out = {k: {'bad': v['bad'], 'h1': sorted(v['h1']), 'profiles': v['profiles'], 'ext': sorted(v['ext'])} for k, v in merged.items()}
    json.dump(out, open(os.path.join(OUTD, 'flags.json'), 'w'), indent=0)
    json.dump({k: v['text'] for k, v in merged.items()}, open(os.path.join(OUTD, 'texts.json'), 'w'))
    print('visits', sum(tots), 'pages', len(out))

asyncio.run(main())
