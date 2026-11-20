"""Feeding top-card check (Nov 20, Development's design). Serve the app on :8765 first.
For every Feeding stage at 360, 390 and 430px wide, it checks that:
  - the photo has Development's shape (16:10) and Development's width
  - the headline and lead never end on a single word
  - nothing runs past the card's edge
and saves a screenshot of each card to OUT (default /tmp/feeding_hero)."""
import asyncio, sys, os
from playwright.async_api import async_playwright
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/feeding_hero'
os.makedirs(OUT, exist_ok=True)
C = [(0.3, 'Breast milk', 0, 'newborn'), (1.5, 'Formula', 0, 'milk'), (3.5, 'Formula', 0, 'distracted'), (5, 'Formula', 0, 'ready'),
     (6.5, 'Formula', 1, 'first'), (8, 'Formula', 1, 'textures'), (10, 'Formula', 1, 'meals')]
SETUP = """(a)=>{const [m,f,sol,t]=a;const d=new Date(NOW);d.setDate(d.getDate()-Math.round(m*30.44));profile={...demo,dob:iso(d),example:false,feed:f,feedHow:'Bottle'};answers={};if(sol)answers.solids='Yes';persist();month=actualMonth();historyStack=['categories'];openPage('topic:'+t);scrollTo(0,0)}"""
MEASURE = """(sel)=>{const ph=document.querySelector(sel);if(!ph)return null;const b=ph.getBoundingClientRect();
  const lastLine=e=>{const r=document.createRange();r.selectNodeContents(e);const rs=[...r.getClientRects()];if(rs.length<2)return 99;const last=rs[rs.length-1];
    const words=e.textContent.trim().split(/\\s+/);let w=0;const t=document.createRange();const tn=[...e.childNodes].filter(n=>n.nodeType===3).pop();if(!tn)return 99;
    const txt=tn.textContent;const i=txt.trimEnd().lastIndexOf(' ');if(i<0)return 99;t.setStart(tn,i+1);t.setEnd(tn,txt.trimEnd().length);const lr=t.getClientRects()[0];
    return lr&&Math.abs(lr.left-rs.find(x=>Math.abs(x.top-lr.top)<4)?.left)<2?1:2};
  const card=ph.closest('header,section');const cb=card.getBoundingClientRect();
  const over=[...card.querySelectorAll('*')].some(e=>e.getBoundingClientRect().right>cb.right+1);
  return {w:b.width,h:b.height,h1:lastLine(card.querySelector('h1')),lead:lastLine(card.querySelector('.hub-lead,.dev-hero-lead')),over}}"""
async def main():
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        for W in [360, 390, 430]:
            pg = await b.new_page(viewport={'width': W, 'height': 844}, device_scale_factor=2)
            await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
            await pg.evaluate(SETUP, [4, 'Formula', 0, 'Development']); await pg.wait_for_timeout(500)
            dev = await pg.evaluate(MEASURE, '#main .dvx-photo')
            for m, f, sol, key in C:
                await pg.evaluate(SETUP, [m, f, sol, 'Feeding']); await pg.wait_for_timeout(450)
                r = await pg.evaluate(MEASURE, '#main .fd-life-photo')
                if not r: print(W, key, 'NO PHOTO CARD'); bad += 1; continue
                flags = [x for x, bad_ in [('PHOTO SHAPE', abs(r['w'] / r['h'] - 1.6) > 0.03), ('NOT DEVELOPMENT WIDTH', abs(r['w'] - dev['w']) > 2),
                                           ('ONE WORD LEFT IN HEADLINE', r['h1'] == 1), ('ONE WORD LEFT IN LEAD', r['lead'] == 1), ('SPILLS PAST CARD', r['over'])] if bad_]
                bad += bool(flags)
                print(W, key, f"photo {r['w']:.0f}x{r['h']:.0f} (Development {dev['w']:.0f})", ' '.join(flags) or 'ok')
                await (await pg.query_selector('#main .fd-life')).screenshot(path=f'{OUT}/{W}_{key}.png')
            await pg.close()
        await b.close()
    print('FAILED' if bad else 'All Feeding top cards pass.'); sys.exit(1 if bad else 0)
asyncio.run(main())
