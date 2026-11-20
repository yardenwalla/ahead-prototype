"""Feeding top-card check (Nov 20). Serve the app on :8765 first.
For every milk/solids stage at 360, 390 and 430px wide, it measures:
  - the gap between the words and the baby (fails under 16px)
  - space above the baby's head (fails under 10px)
  - whether the photo is cropped top or bottom
  - whether the words touch the top of the card
and saves a screenshot of each card to OUT (default /tmp/feeding_hero)."""
import asyncio, sys, os
import numpy as np
from PIL import Image, ImageFilter
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/feeding_hero'
os.makedirs(OUT, exist_ok=True)
C = [(0.3, 'Breast milk', 0, 'newborn'), (1.5, 'Formula', 0, 'milk'), (3.5, 'Formula', 0, 'distracted'), (5, 'Formula', 0, 'ready'), (6.5, 'Formula', 1, 'first'), (10, 'Formula', 1, 'meals')]
def subject(key):
    a = np.asarray(Image.open(f'{ROOT}/assets/feeding/fn-{key}.jpg').convert('RGB')).astype(int); h, w, _ = a.shape
    bg = np.median(a[:, :int(w * .2)].reshape(-1, 3), axis=0)
    d = np.abs(a - bg).sum(axis=2) > (90 if key == 'newborn' else 45)
    d = np.asarray(Image.fromarray((d * 255).astype('uint8')).filter(ImageFilter.MedianFilter(9))) > 0
    cols = np.where(d[:int(h * .85)].sum(axis=0) > h * 0.03)[0]; rows = np.where(d[:, int(w * .45):].sum(axis=1) > w * 0.02)[0]
    return cols.min() / w, rows.min() / h
async def main():
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        for W in [360, 390, 430]:
            pg = await b.new_page(viewport={'width': W, 'height': 844}, device_scale_factor=2)
            await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
            for m, f, sol, key in C:
                await pg.evaluate(f"""()=>{{const d=new Date(NOW);d.setDate(d.getDate()-Math.round({m}*30.44));profile={{...demo,dob:iso(d),example:false,feed:'{f}',feedHow:'Bottle'}};answers={{}};{"answers.solids='Yes';" if sol else ""}persist();month=actualMonth();historyStack=['categories'];openPage('topic:Feeding');scrollTo(0,0)}}""")
                await pg.wait_for_timeout(500)
                r = await pg.evaluate("""()=>{const t=document.querySelector('#main .fd-split-top');const im=t.querySelector('img');const c=t.querySelector('.fd-split-copy');const tb=t.getBoundingClientRect();const cb=c.getBoundingClientRect();
                  const right=Math.max(...[...c.querySelectorAll('h1,.hub-lead,.hub-eyebrow')].map(e=>{const g=document.createRange();g.selectNodeContents(e);return g.getBoundingClientRect().right}));
                  return {W:tb.width,H:tb.height,iw:im.naturalWidth,ih:im.naturalHeight,textRight:right-tb.left,copyTop:cb.top-tb.top}}""")
                sl, st = subject(key)
                s = max(r['W'] / r['iw'], r['H'] / r['ih']); dw, dh = r['iw'] * s, r['ih'] * s; ox, oy = r['W'] - dw, (r['H'] - dh) / 2
                gap, head = ox + sl * dw - r['textRight'], oy + st * dh
                flags = [x for x, bad_ in [('TEXT TOO CLOSE', gap < 16), ('HEAD AT EDGE', head < 10), ('CROPPED', abs(oy) > 2), ('TEXT AT EDGE', r['copyTop'] < 14)] if bad_]
                bad += bool(flags)
                print(W, key, 'gap', round(gap), 'head', round(head), ' '.join(flags) or 'ok')
                await (await pg.query_selector('#main .fd-split')).screenshot(path=f'{OUT}/{W}_{key}.png')
            await pg.close()
        await b.close()
    print('FAILED' if bad else 'All Feeding top cards pass.'); sys.exit(1 if bad else 0)
asyncio.run(main())
