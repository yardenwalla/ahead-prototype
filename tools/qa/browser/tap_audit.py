"""Tap every button and link on every page, for every test family, and record what each tap does.
    python3 tools/qa/browser/tap_audit.py [OUTDIR] [FamilyName]
Writes OUTDIR/<family>.json (default tools/qa/out/taps). Then run tap_report.py."""
import asyncio, json, os, re, sys
from playwright.async_api import async_playwright
from common import *
OUTD = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', 'taps')
ONLY = sys.argv[2] if len(sys.argv) > 2 else None
SEL = "#main button, #main [onclick], #main a[href], #main summary, #main [role=button], #main input[type=checkbox], #main input[type=radio], #main label"
LABEL = "e=>(e.innerText||e.getAttribute('aria-label')||e.value||'').replace(/\\s+/g,' ').trim().slice(0,90)"
TAPS = f"""()=>{{const L={LABEL};const out=[];const seen=new Set();[...document.querySelectorAll('{SEL}')].forEach((e,i)=>{{
 if(seen.has(e))return;seen.add(e);if(!e.offsetParent&&e.tagName!=='SUMMARY')return;if(e.disabled)return;
 if(e.tagName==='LABEL'&&!e.querySelector('input'))return;const c=e.closest('button,[onclick]');if(c&&c!==e)return;
 out.push({{i,tag:e.tagName,label:L(e),oc:(e.getAttribute('onclick')||e.getAttribute('href')||'').slice(0,160)}})}});return out}}"""
TAP = f"""([i,label,oc])=>{{const L={LABEL};const els=[...document.querySelectorAll('{SEL}')];let e=els[i];
 if(!e||L(e)!==label)e=els.find(x=>L(x)===label)||(oc&&els.find(x=>(x.getAttribute('onclick')||x.getAttribute('href')||'').slice(0,160)===oc));if(!e)return 'missing';
 if(e.tagName==='A'&&/^https?:/.test(e.getAttribute('href')||''))return 'external';e.click();return 'ok'}}"""
STATE = """()=>{const m=document.querySelector('#main');const h=m.querySelector('h1');return {page:String(page),h1:h?h.innerText.trim():'',
 text:m.innerText.slice(0,600),html:m.innerHTML,ls:JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])))}}"""
SKIP = re.compile(r"openPage\('(trust|welcome|setup)|resetApp|clearAll|startOver")

async def run(pw, fam):
    age, feed, how, pr, nm, early = fam
    b = await pw.chromium.launch(); errs = []
    pg = await new_page(b, errs); await load_family(pg, profile(age, feed, how, pr, nm, early))
    base = await pg.evaluate(STORAGE)
    q = list(TABS[:4]) + [f'topic:{t}' for t in await pg.evaluate("TOPICS.map(t=>t[0])")]
    seen, rec, pages = set(), [], {}
    async def restore(r):
        # Always arrive from Home, so labels like "Back to …" are the same each time the page opens
        await pg.evaluate(RESTORE, base); await pg.evaluate("navigate('home')"); await pg.evaluate(RESTORE, base)
        await pg.evaluate(opener(r)); await pg.wait_for_timeout(70)
    while q and len(seen) < 700:
        r = q.pop(0)
        if r in seen: continue
        seen.add(r)
        try:
            errs.clear(); await restore(r); s = await pg.evaluate(STATE)
            pages[r] = {'h1': s['h1'], 'text': s['text'][:300], 'err': list(errs)}
            taps = await pg.evaluate(TAPS)
        except Exception as e:
            pages[r] = {'fail': str(e)[:200]}; continue
        for t in taps:
            if SKIP.search(t['oc']): continue
            try:
                await restore(r); errs.clear(); s0 = await pg.evaluate(STATE)
                ok = await pg.evaluate(TAP, [t['i'], t['label'], t['oc']])
                if ok != 'ok': rec.append({'from': r, **t, 'kind': ok}); continue
                await pg.wait_for_timeout(160); s1 = await pg.evaluate(STATE)
                kind = 'nav' if s1['page'] != s0['page'] else 'state' if s1['ls'] != s0['ls'] else 'ui' if s1['html'] != s0['html'] else 'none'
                o = {'from': r, **t, 'kind': kind, 'to': s1['page'], 'h1': s1['h1'], 'text': s1['text'][:400],
                     'toast': await pg.evaluate(TOASTS), 'err': list(errs)}
                if kind == 'state':
                    a, z = json.loads(s0['ls']), json.loads(s1['ls'])
                    o['changed'] = {k: (z.get(k) or '')[:300] for k in set(a) | set(z) if a.get(k) != z.get(k)}
                rec.append(o)
                if kind == 'nav' and s1['page'] not in seen and not SKIP.search(f"openPage('{s1['page']}"): q.append(s1['page'])
            except Exception as e:
                rec.append({'from': r, **t, 'kind': 'exc', 'err': [str(e)[:200]]})
    os.makedirs(OUTD, exist_ok=True)
    json.dump({'family': nm, 'pages': pages, 'taps': rec}, open(os.path.join(OUTD, nm + '.json'), 'w'))
    await b.close(); print(nm, 'pages', len(seen), 'taps', len(rec), flush=True)

async def main():
    async with async_playwright() as pw:
        await asyncio.gather(*[run(pw, f) for f in FAMILIES if not ONLY or f[4] == ONLY])
asyncio.run(main())
