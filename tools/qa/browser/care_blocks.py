"""Everyday care pages use one design per block (Nov 15 pilot): at most one "When to call" card, and only on pages about a
worry (Is this normal?, rashes, the first-week diapers); no stray tips, small print or call boxes; one "Good to know" list
with 3 rows at most; no call line over 130 characters.
Serve the app first: python3 -m http.server 8765. Added Nov 14 after two or three call boxes of different shapes were found on one page."""
import asyncio, sys, re, json
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from common import profile
from playwright.async_api import async_playwright
ROUTES=['chg:Daily rhythm:d:'+x for x in ['cord','p:sponge','p:tub','p:teething','p:brush','p:feet','after1']+[f'{k}:{v}' for v in range(4) for k in ['h:diapers','h:skin','h:gums','t:nails','t:clothes','t:sun','t:diapers','t:skin','t:bath','how','look']]+[f'look:{v}:{k}' for v in range(4) for k in ['poop','rash','rashmore','cord','eyes','yellow']]+['rash:'+r for r in ['acne','cradle','peeling','diaper','yeast','eczema','heat','newborn','strawberry','drool']]]
routes=ROUTES
FAMS=[profile(0.3,'Breast milk','Nursing','she','Noor'),profile(2,'Formula','Bottle','they','Ari'),profile(5,'Both','Nursing','he','Leo'),profile(9,'Breast milk','Nursing','she','Mia')]
async def main():
  async with async_playwright() as pw:
    b=await pw.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page()
    seen={}; global fails, checked
    for f in FAMS:
      await pg.goto(__import__('os').environ.get('AHEAD_URL','http://localhost:8765/index.html')); await pg.evaluate("p=>{localStorage.clear();localStorage.setItem('ahead-v2-profile',JSON.stringify(p))}",f); await pg.reload(); await pg.wait_for_timeout(400)
      for r in routes:
        await pg.evaluate("r=>{historyStack=[];page=r;render()}",r); await pg.wait_for_timeout(40)
        d=await pg.evaluate("""()=>{const m=document.querySelector('#main');const cards=m.querySelectorAll('.care-calls').length;
          const stray=[...m.querySelectorAll('.hub-tip,p.ss-small,.hub-callout,p.care-p:not(.is-fold),.care-urgent,.hub-versus')].filter(e=>!e.closest('details')).map(e=>e.innerText.replace(/\\s+/g,' ').slice(0,90)).filter(t=>!/^Every bath/.test(t));
          const gtk=[...m.querySelectorAll('h2')].filter(h=>/^Good to know/.test(h.innerText.trim()));
          const gtkRows=gtk.length?gtk[0].nextElementSibling.querySelectorAll('.hub-row').length:0;
          const rows=[...m.querySelectorAll('.care-calls p')].map(e=>e.innerText);
          return {cards,stray,rows,gtk:gtk.length,gtkRows,tpl:(m.querySelector('.care-tpl')||{className:''}).className,secs:m.querySelectorAll('.care-tpl > h2').length}}""")
        key=(r,json.dumps(d['rows']))
        if key in seen: continue
        seen[key]=1
        bad=[]
        if d['cards']>1: bad.append(f"{d['cards']} call cards")
        if d['stray']: bad.append(f"stray block: {d['stray'][0]}")
        if d['gtk']>1 or d['gtkRows']>3: bad.append(f"Good to know: {d['gtk']} lists, {d['gtkRows']} rows")
        # Template pages: a change explainer ends with When to check, Is this normal? with When to call; How-to has none.
        worry=any(x in r for x in (':look:',':rash:',':t:skin:')) or r.endswith('t:diapers:0') or 'is-expect' in d['tpl'] or 'is-check' in d['tpl']
        if 'is-howto' in d['tpl'] and d['cards']: bad.append('call card on a How-to page')
        # A template page with a single section looks empty next to the others: every page has at least two.
        if d['tpl'] and d['secs'] < 2: bad.append(f"only {d['secs']} section")
        if d['cards'] and not worry: bad.append('call card on a page that is not about a worry')
        bad+=[f"long row ({len(x)}): {x[:60]}…" for x in d['rows'] if len(x)>130]
        if bad: fails.append((r,f['name'],bad))
        checked+=1
    await b.close()
fails=[]; checked=0
asyncio.run(main())
for r,n,bad in fails: print('FAIL',r,f'[{n}]','; '.join(bad))
print(f"{checked} Everyday care page versions checked, {len(fails)} with block problems")
sys.exit(1 if fails else 0)
