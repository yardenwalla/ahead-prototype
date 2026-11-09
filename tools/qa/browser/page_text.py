"""Read every reachable page for five families and save its words and layout outline.
Run on the old version and the new one, then compare with layout_guard.py to see exactly which pages changed.
    python3 tools/qa/browser/page_text.py before.json   (old version served)
    python3 tools/qa/browser/page_text.py after.json    (new version served)"""
import asyncio, json, re, sys
from playwright.async_api import async_playwright
from common import *
OUT = sys.argv[1]
OUTLINE = """()=>{const m=document.querySelector('#main');const sk=[];m.querySelectorAll('*').forEach(e=>{if(e.closest('svg')&&e.tagName!=='svg')return;
 sk.push(e.tagName.toLowerCase()+'.'+[...e.classList].sort().join('.'))});return {t:m.innerText,sk:sk.join(' ')}}"""
LINKS = "()=>{const s=new Set();document.querySelectorAll('#main [onclick]').forEach(e=>(e.getAttribute('onclick').match(/(openPage|navigate)\\('[^']+'\\)/g)||[]).forEach(x=>s.add(x)));return [...s]}"
async def run(pw, fam, out):
    age, feed, how, pr, nm, early = fam
    b = await pw.chromium.launch(); errs = []
    pg = await new_page(b, errs); await load_family(pg, profile(age, feed, how, pr, nm, early))
    base = await pg.evaluate(STORAGE)
    topics = await pg.evaluate("TOPICS.map(t=>t[0])")
    q = [opener(t) for t in TABS] + [f"openPage('topic:{t}')" for t in topics] + [f"openPage('stages:{t}')" for t in ['Feeding', 'Sleep', 'Safety', 'Development', 'Daily rhythm', 'Health']]
    seen, texts = set(), {}
    while q and len(seen) < 420:
        r = q.pop(0)
        if r in seen: continue
        seen.add(r)
        try:
            await pg.evaluate(RESTORE, base); await pg.evaluate(r); await pg.wait_for_timeout(90)
            texts[r] = await pg.evaluate(OUTLINE)
            q += [l for l in await pg.evaluate(LINKS) if l not in seen and not re.search(r"openPage\('(trust|resource:|welcome|setup)", l)]
        except Exception: pass
    out[nm] = texts; await b.close(); print(nm, len(texts), flush=True)
async def main():
    out = {}
    async with async_playwright() as pw:
        await asyncio.gather(*[run(pw, f, out) for f in FAMILIES[:5]])
    json.dump(out, open(OUT, 'w'))
asyncio.run(main())
