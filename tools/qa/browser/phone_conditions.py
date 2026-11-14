"""Real phone conditions: run the key tasks (setup, every category, change a stage, search, the photo picker,
reload) at 320/360/390/430px, both normally and inside qa-frame.html, a locked-down frame like the Claude app's
file viewer (storage blocked, file pickers restricted). Saves a screenshot per run in OUTDIR.
    python3 tools/qa/browser/phone_conditions.py OUTDIR
Every task should say ok in both modes. In the locked frame, answers must still work for the visit even with storage blocked."""
import asyncio, json, os, sys
OUTD = sys.argv[1] if len(sys.argv) > 1 else 'phone-out'; os.makedirs(OUTD, exist_ok=True)
from playwright.async_api import async_playwright
WIDTHS=[320,360,390,430]
TASKS=r"""async () => {
  const log = [], wait = ms => new Promise(r => setTimeout(r, ms)), $ = s => document.querySelector(s), main = () => document.querySelector('#main');
  const step = async (name, fn) => { try { await fn(); await wait(120); const t = (main().innerText||'').trim(); log.push([name, t.length > 40 ? 'ok' : 'EMPTY', t.slice(0, 70).replace(/\s+/g,' ')]); } catch (e) { log.push([name, 'ERROR', String(e).slice(0,120)]); } };
  let storageOk = true; try { localStorage.setItem('x','1') } catch (e) { storageOk = false }
  log.push(['storage', storageOk ? 'available' : 'blocked', '']);
  await step('welcome shows', async () => {});
  await step('start setup', async () => { [...document.querySelectorAll('button')].find(b => /Set up/.test(b.innerText)).click() });
  await step('step 1 filled', async () => { $('#babyName').value = 'Noor'; $('#dob').value = new Date(Date.now()-150*864e5).toISOString().slice(0,10); $('#setupForm').requestSubmit() });
  await step('step 2 filled', async () => { $('#feed').value = 'Both'; $('#feed').dispatchEvent(new Event('change')); $('#setupForm').requestSubmit() });
  await step('home', async () => { navigate('home') });
  for (const t of TOPICS.map(t => t[0])) await step('category ' + t, async () => { openPage('topic:' + t) });
  await step('change Sleep stage', async () => { openPage('stages:Sleep'); const b = [...main().querySelectorAll('[onclick]')].find(e => /stages|chg:Sleep|Stage/.test(e.getAttribute('onclick'))); if (b) b.click(); const mk = [...main().querySelectorAll('button')].find(b => /Make this/.test(b.innerText)); if (mk) mk.click(); });
  await step('search fever', async () => { navigate('categories'); searchGuides('fever'); if (!main().querySelector('.hub-results .hub-row')) throw 'no results' });
  await step('memories', async () => { navigate('timeline') });
  await step('photo picker', async () => { const f = main().querySelector('input[type=file]'); if (!f) throw 'no picker'; f.click(); });
  await step('profile', async () => { navigate('profile') });
  await step('timeline', async () => { navigate('next') });
  await step('after reload, still set up?', async () => {});
  const wide = [...document.querySelectorAll('#main *')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 2 && !e.closest('[class*=strip],[class*=carousel],.monthstrip,figure,.hub-pills')).length;
  log.push(['too-wide elements on last page', String(wide), '']);
  return log;
}"""
async def main():
  out={}
  async with async_playwright() as pw:
    b=await pw.chromium.launch()
    for w in WIDTHS:
      for mode in ['locked-frame','normal']:
        ctx=await b.new_context(viewport={'width':w,'height':780})
        pg=await ctx.new_page(); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)[:150]))
        if mode=='locked-frame':
          await pg.goto('http://localhost:8765/qa-frame.html'); await pg.wait_for_timeout(900)
          fr=pg.frames[1]
        else:
          await pg.goto('http://localhost:8765/index.html'); await pg.evaluate('localStorage.clear()'); await pg.reload(); await pg.wait_for_timeout(500); fr=pg.main_frame
        try: log=await fr.evaluate(TASKS)
        except Exception as e: log=[['run','ERROR',str(e)[:200]]]
        # does setup survive a reload?
        if mode=='locked-frame':
          await pg.reload(); await pg.wait_for_timeout(900); fr=pg.frames[1]
        else:
          await pg.reload(); await pg.wait_for_timeout(500); fr=pg.main_frame
        after=await fr.evaluate("() => typeof page !== 'undefined' ? page : '?'")
        log.append(['page after reload',after,''])
        out[f'{w}px {mode}']={'log':log,'errors':list(dict.fromkeys(errs))[:6]}
        await pg.screenshot(path=os.path.join(OUTD, f'{w}px-{mode}.png'))
        await ctx.close()
    await b.close()
  json.dump(out,open(os.path.join(OUTD, 'results.json'),'w'),indent=1)
  for k,v in out.items():
    bad=[l for l in v['log'] if l[1] in ('ERROR','EMPTY')]
    print(k,'| problems:',bad[:6],'| js errors:',v['errors'][:3],'| reload->',[l[1] for l in v['log'] if l[0]=='page after reload'])
asyncio.run(main())
