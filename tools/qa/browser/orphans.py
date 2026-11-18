"""One-word last lines ("orphans") on every guide page, at phone width.
Yarden, Nov 17: no one-word lines. The app sets text-wrap: pretty so the browser avoids them; this check finds any that slip through.
Serve the app first, then:  python3 tools/qa/browser/orphans.py [--list]"""
import asyncio, re, sys, os
from playwright.async_api import async_playwright
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from common import PORT as _P, profile, opener, new_page

BASE = os.environ.get('AHEAD_URL', f'http://localhost:{_P}/index.html')
ONLY = [a for a in sys.argv[1:] if not a.startswith('--')]
FAMS = [profile(0.4, 'Breast milk', 'Nursing', 'she', 'Noor'), profile(4.5, 'Both', 'Nursing', 'he', 'Leo'), profile(10, 'Breast milk', 'Pumping', 'she', 'Mia')]
FIND = """()=>{
  const m=document.querySelector('#main'); if(!m) return [];
  const isInline=e=>getComputedStyle(e).display==='inline';
  const out=[];
  for(const el of m.querySelectorAll('*')){
    if(isInline(el)||el.closest('svg,[hidden],.hub-nav')) continue;
    if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) continue;
    if(!el.getClientRects().length) continue;
    const words=[]; const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    let n; while((n=w.nextNode())){ let p=n.parentElement, own=true; while(p&&p!==el){ if(!isInline(p)){own=false;break} p=p.parentElement }
      if(!own) continue; const re=/\\S+/g; let x; while((x=re.exec(n.textContent))){ const r=document.createRange(); r.setStart(n,x.index); r.setEnd(n,x.index+x[0].length); const rs=r.getClientRects(), b=rs[rs.length-1]; if(b) words.push([Math.round(b.top), x[0]]) } }
    if(words.length<3) continue;
    const tops=[...new Set(words.map(x=>x[0]))].sort((a,b)=>a-b);
    // a word's top can shift a pixel or two inside a line: merge tops within 4px
    const lines=[]; for(const t of tops){ if(lines.length&&t-lines[lines.length-1]<=4) continue; lines.push(t) }
    if(lines.length<2) continue;
    const last=lines[lines.length-1], lastWords=words.filter(x=>x[0]>=last-4&&x[0]<=last+4);
    if(lastWords.length===1) out.push(el.textContent.trim().replace(/\\s+/g,' ').slice(0,90)+'  →  “'+lastWords[0][1]+'”');
  }
  return out;
}"""

async def main():
    routes = sorted({m for m in re.findall(r'^(?:window\.SEARCH_DEEP = \[)?\["([^"]+)"', open('js/search-index.js', encoding='utf8').read(), re.M) if not m.startswith('topic:') and (not ONLY or any(m.startswith(o) for o in ONLY))})
    # Checkup pages aren't in the search index (Nov 18: they hid 50+ one-word lines), so add them by hand.
    extra = [f'health-detail:{a}:{p}' for a in (0, 1, 2, 4, 6, 9, 12) for p in ('expect', 'vaccines', 'questions')] + ['topic:Health']
    routes = sorted(set(routes) | {r for r in extra if not ONLY or any(r.startswith(o) for o in ONLY)})
    seen, errs = {}, []
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await new_page(b, errs)
        for f in FAMS:
            await pg.goto(BASE); await pg.evaluate("p=>{localStorage.clear();localStorage.setItem('ahead-v2-profile',JSON.stringify(p))}", f); await pg.reload(); await pg.wait_for_timeout(400)
            for r in routes:
                try:
                    await pg.evaluate(opener(r)); await pg.wait_for_timeout(100)
                    for t in await pg.evaluate(FIND): seen.setdefault(t, r)
                except Exception: pass
    print(f'{len(seen)} one-word last lines')
    if '--list' in sys.argv:
        for t, r in sorted(seen.items(), key=lambda x: x[1]): print(f'  {r}: {t}')
    sys.exit(1 if seen else 0)
asyncio.run(main())
