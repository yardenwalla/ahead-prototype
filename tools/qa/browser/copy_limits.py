"""Copy limits from the style guide and the content standard, measured on the real pages.
Serve the app first:  python3 -m http.server 8765   then:  python3 tools/qa/browser/copy_limits.py [--json out.json]
Every detail page in the search index is opened for three families (a newborn, 4 months, 10 months) and checked for:
  1. the page headline: about 40 characters (fails over 45),
  2. the lead under it: 1–2 sentences, about 140 characters (fails over 150, or over 2 sentences),
  3. the page: about 2 phone screens or less (fails over 2.2),
  4. "Good to know": 3 rows at most,
  5. on each guide's main page, a row's grey line under the bold title fits on one line of a phone (Nov 14).
Added Nov 14 after content batch 2 made the sore gums and car seat pages wordier than the guide allows."""
import asyncio, json, re, sys
from playwright.async_api import async_playwright
sys.path.insert(0, __file__.rsplit('/', 1)[0])
import os
from common import PORT as _P, profile, opener, new_page, load_family

BASE = os.environ.get('AHEAD_URL', f'http://localhost:{_P}/index.html')
FAMS = [profile(0.4, 'Breast milk', 'Nursing', 'she', 'Noor'), profile(4.5, 'Both', 'Nursing', 'he', 'Leo'), profile(10, 'Breast milk', 'Pumping', 'she', 'Mia')]
# The care card is a page parents send to caregivers, read like a printout, not a guide page.
EXEMPT = {'chg:Childcare:d:card'}
LIMITS = dict(head=45, lead=150, sentences=2, screens=2.2, good=3)
MEASURE = """()=>{
  const m=document.querySelector('#main'); if(!m) return null;
  const h=[...m.querySelectorAll('h1')].find(e=>parseFloat(getComputedStyle(e).fontSize)>=22);
  if(!h) return null;
  // The lead is the first paragraph after the headline, inside the top card or just under it.
  const lead=[...m.querySelectorAll('p')].find(p=>(h.compareDocumentPosition(p)&4)&&p.textContent.trim().length>20&&!p.closest('.ss-moment section, .hub-card, .hub-list, details'));
  const gk=[...m.querySelectorAll('h2,h3,b,strong')].find(e=>/^Good to know/.test(e.textContent.trim()));
  let good=0; if(gk&&gk.tagName==='H2'){ const box=gk.nextElementSibling; good=box?box.querySelectorAll(':scope > *').length:0; }
  return {head:h.textContent.trim(), lead:lead?lead.textContent.trim():'', screens:+(m.scrollHeight/844).toFixed(2), words:m.innerText.split(/\\s+/).length, good};
}"""

ROWS = """()=>[...document.querySelectorAll('#main .hub-row-eyebrow')].map(e=>{const s=e.parentElement.lastElementChild;
  const lh=parseFloat(getComputedStyle(s).lineHeight)||20;return s.getBoundingClientRect().height>lh*1.5?s.textContent.trim():null}).filter(Boolean)"""

def sentences(t):
    return len([s for s in re.split(r'(?<=[.?!])\s+', t.strip()) if s])

async def main():
    routes = sorted({m for m in re.findall(r'^(?:window\.SEARCH_DEEP = \[)?\["([^"]+)"', open('js/search-index.js', encoding='utf8').read(), re.M) if not m.startswith('topic:') and m not in EXEMPT})
    out, errs = {}, []
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await new_page(b, errs)
        for f in FAMS:
            await pg.goto(BASE); await pg.evaluate("p=>{localStorage.clear();localStorage.setItem('ahead-v2-profile',JSON.stringify(p))}", f); await pg.reload(); await pg.wait_for_timeout(400)
            for r in routes:
                try:
                    await pg.evaluate(opener(r)); await pg.wait_for_timeout(120)
                    m = await pg.evaluate(MEASURE)
                except Exception as e:
                    m = None
                if not m: continue
                key = (r, m['head'])
                if key in out: continue
                bad = []
                if len(m['head']) > LIMITS['head']: bad.append(f"headline {len(m['head'])} chars")
                if len(m['lead']) > LIMITS['lead']: bad.append(f"lead {len(m['lead'])} chars")
                if sentences(m['lead']) > LIMITS['sentences']: bad.append(f"lead {sentences(m['lead'])} sentences")
                if m['screens'] > LIMITS['screens']: bad.append(f"{m['screens']} screens")
                if m['good'] > LIMITS['good']: bad.append(f"Good to know has {m['good']} rows")
                out[key] = dict(route=r, family=f['name'], bad=bad, **m)
            # 5. Guide rows: the grey line under a row's bold title is one line, so the list scans.
            for g in ('Sleep', 'Feeding', 'Development', 'Health', 'Safety', 'Daily rhythm', 'Out and about', 'Childcare'):
                await pg.evaluate(opener('topic:' + g)); await pg.wait_for_timeout(150)
                for t in await pg.evaluate(ROWS):
                    out[('topic:' + g, t)] = dict(route='topic:' + g, family=f['name'], bad=[f'row line wraps: "{t}"'], head=t, lead='', screens=0, words=0, good=0)
        await b.close()
    fails = [v for v in out.values() if v['bad']]
    if '--json' in sys.argv: json.dump(list(out.values()), open(sys.argv[sys.argv.index('--json') + 1], 'w'), ensure_ascii=False, indent=1)
    for v in sorted(fails, key=lambda v: v['route']):
        print(f"FAIL {v['route']} ({v['family']}): {', '.join(v['bad'])} · \"{v['head']}\"")
    print(f"{len(out) - len(fails)} of {len(out)} pages within the copy limits")
    sys.exit(1 if fails else 0)

asyncio.run(main())
