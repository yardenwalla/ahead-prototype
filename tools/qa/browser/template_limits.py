"""Template blocks over their limit (more than 2 notes in a card, more than 3 rows in Good to know).
Nov 17: the templates used to cut extra items off silently, so a fact could vanish. Now everything shows,
the block is marked data-over-limit, and this check lists them so the content can be tightened by hand.
Serve the app first, then:  python3 tools/qa/browser/template_limits.py"""
import asyncio, re, sys, os
from playwright.async_api import async_playwright
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from common import PORT as _P, profile, opener, new_page
BASE = os.environ.get('AHEAD_URL', f'http://localhost:{_P}/index.html')
FAMS = [profile(0.4, 'Breast milk', 'Nursing', 'she', 'Noor'), profile(4.5, 'Both', 'Nursing', 'he', 'Leo'), profile(10, 'Breast milk', 'Pumping', 'she', 'Mia'), profile(3, 'Formula', '', 'he', 'Theo')]
async def main():
    routes = sorted({m for m in re.findall(r'^(?:window\.SEARCH_DEEP = \[)?\["([^"]+)"', open('js/search-index.js', encoding='utf8').read(), re.M) if not m.startswith('topic:')})
    seen, errs = {}, []
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await new_page(b, errs)
        for f in FAMS:
            await pg.goto(BASE); await pg.evaluate("p=>{localStorage.clear();localStorage.setItem('ahead-v2-profile',JSON.stringify(p))}", f); await pg.reload(); await pg.wait_for_timeout(400)
            for r in routes:
                try:
                    await pg.evaluate(opener(r)); await pg.wait_for_timeout(80)
                    for kind, n in await pg.evaluate("()=>[...document.querySelectorAll('#main [data-over-limit]')].map(e=>[e.dataset.overLimit,e.children.length])"):
                        seen.setdefault((r, kind), (f['name'], n))
                except Exception: pass
    for (r, kind), (fam, n) in sorted(seen.items()): print(f'  {r} ({fam}): {n} {kind}')
    print(f'{len(seen)} blocks over their limit'); sys.exit(1 if seen else 0)
asyncio.run(main())
