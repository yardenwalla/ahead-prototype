"""Do every save and answer a parent can make, then open every main page and report what changed,
plus the confirmation it showed. Read each block and ask: did it change everywhere the words promise,
and nowhere else?
    python3 tools/qa/browser/follow_through.py > follow.txt
Step forms:  "js code"  |  "CLICK:Button text"  |  "FILE:css selector"  |  "TOAST:Undo" (taps a button in the toast)
             "SAME" = report whether storage is back to how it was before the flow (for Undo)
Add a flow here whenever the app gets a new save, answer, toggle or toast button."""
import asyncio, datetime, difflib, json, sys
from playwright.async_api import async_playwright
from common import *
SURFACES = ['home', 'categories', 'timeline', 'chg:Timeline:firsts', 'profile', 'stages:Health', 'topic:Health',
            'topic:Development', 'topic:Safety', 'topic:Sleep', 'topic:Feeding', 'topic:Childcare', 'topic:Daily rhythm']
day = lambda n: (TODAY + datetime.timedelta(days=n)).isoformat()   # a date n days from today
P = lambda m, **k: profile(m, k.get('feed', 'Formula'), k.get('how', ''), k.get('pr', 'he'), k.get('nm', 'Theo'))
first = lambda t, chip=False: [("hubFirstFill(%s)" % json.dumps(t)) if chip else f"document.getElementById('firstTitle').value={json.dumps(t)}",
                                f"document.getElementById('firstDate').value='{day(-3)}'", "hubSaveFirst()"]
M = "openPage('chg:Timeline:milestone')"
FLOWS = [
 # Memories: firsts (typed and picked), and that each counts in Development
 ('First typed: Rolls over', P(5), [M] + first('Rolls over')),
 ('First picked: Rolled over', P(6), [M] + first('Rolled over', True)),
 ('First picked: Sat up', P(6), [M] + first('Sat up', True)),
 ('First picked: Crawled', P(9), [M] + first('Crawled', True)),
 ('First typed: First tooth', P(7), [M] + first('First tooth')),
 ('First: Change date from toast', P(6), [M] + first('Sat up') + ['TOAST:Change date']),
 # Memories: photos
 ('Month photo', P(5), ["navigate('timeline')", "FILE:#main input[type=file]"]),
 ('Photo, remove, Undo', P(5), ["navigate('timeline')", "FILE:#main input[type=file]", "CLICK:×", "TOAST:Undo"]),
 ('Photo then Home', P(5), ["navigate('timeline')", "FILE:#main input[type=file]", "navigate('home')"]),
 # Development
 ('Seen it: small skill', P(6), ["openPage('development-domain:6:Thinking')", "CLICK:Seen it"]),
 ('Seen it: big first, Change date', P(6), ["openPage('development-domain:6:Movement')", "CLICK:Seen it", "TOAST:Change date"]),
 # Checkups: these live in Health, never Memories
 ('Checkup past due: Mark it as done', P(5), ["openPage('health-visit:2')", "CLICK:Mark it as done", "CLICK:Mark it as done"]),
 ('Checkup date saved, 4 days out', P(5.85), ["openPage('visit-form:plan-6')", f"document.querySelector('#main input[type=date]').value='{day(4)}'", "CLICK:Save the date"]),
 ('Checkup date saved, 2 days out, then Home', P(8.5), ["navigate('home')", f"saveJourneyVisit(9,{{date:'{day(2)}',status:'planned'}})", "navigate('home')"]),
 ('Home checkup: Yes, it’s done', P(4.6), ["navigate('home')", "CLICK:Yes, it’s done"]),
 ('Home checkup: Yes, then Change date, save', P(4.6), ["navigate('home')", "CLICK:Yes, it’s done", "TOAST:Change date", f"document.querySelector('#editDate').value='{day(-10)}'", "CLICK:Save"]),
 ('Checkup edit: Mark as not done', P(4.6), ["navigate('home')", "CLICK:Yes, it’s done", "openPage('event-edit:visit-4')", "CLICK:Mark as not done"]),
 ('Home checkup: Not yet, See the checkup', P(4.6), ["navigate('home')", "CLICK:Not yet", "TOAST:See the checkup"]),
 ('Home checkup: We skipped it', P(4.6), ["navigate('home')", "CLICK:We skipped it", "TOAST:See the next one"]),
 # Home cards
 ('Home card ×', P(4.3), ["navigate('home')", "CLICK:×"]),
 # Safety
 ('Safety: Mark as done', P(5), ["openPage('chg:Safety:d:step:gear')", "CLICK:Mark as done"]),
 ('Safety: Doesn’t apply', P(5), ["openPage('chg:Safety:d:step:gear')", "CLICK:Doesn’t apply"]),
 ('Safety: rolling ticks clear rolling card', P(4.6), ["openPage('chg:Safety:d:step:small')", "CLICK:Mark as done", "openPage('chg:Safety:d:step:changing')", "CLICK:Mark as done"]),
 ('Safety: no stairs (Doesn’t apply)', P(7.5), ["openPage('chg:Safety:d:step:gates')", "CLICK:Doesn’t apply"]),
 # Sleep and Feeding
 ('Sleep: in a sleep sack', P(3), ["openPage('chg:Sleep:d:swaddleoff')", "CLICK:Done: Theo’s in a sleep sack"]),
 ('Home question: started solids, Just starting', P(6.3), ["navigate('home')", "CLICK:Just starting"]),
 ('Home question: Not yet', P(6.3), ["navigate('home')", "CLICK:Not yet"]),
 # Stage changes and their Undo (SAME = storage back to before)
 ('Stage Undo: Safety', P(5), ["openPage('safety-stage:rolling')", "CLICK:Make this", "TOAST:Undo", "SAME"]),
 ('Stage Undo: Sleep', P(5), ["openPage('chg:Sleep:s:1')", "CLICK:Make this", "TOAST:Undo", "SAME"]),
 ('Stage Undo: Feeding', P(5), ["openPage('chg:Feeding:mock:dirD:3')", "CLICK:Make this", "TOAST:Undo", "SAME"]),
 # Profile
 ('Profile: Feeding stage First foods', P(6.3), ["navigate('profile')", "CLICK:First foods"]),
 ('Profile: Two naps', P(7), ["navigate('profile')", "CLICK:Two naps"]),
 ('Profile: Crawling', P(5), ["navigate('profile')", "CLICK:Crawling"]),
 ('Profile: milk to Both', P(5), ["navigate('profile')", "profile.feed='Both';profile.feedHow='Nursing';persist&&persist();render()"]),
 # Childcare
 ('Childcare: add to shortlist', P(5), ["openPage('chg:Childcare:d:cand-center-new')", "document.getElementById('ccName').value='Little Oaks'", "ccSaveCand('center','new')"]),
 ('Childcare: choose a place', P(5), ["openPage('chg:Childcare:d:cand-center-new')", "document.getElementById('ccName').value='Little Oaks';document.getElementById('ccChosen').checked=true", "ccSaveCand('center','new')"]),
 ('Childcare: care card', P(5), ["openPage('chg:Childcare:d:card')", "['pName','Yarden','pPhone','6505551234','c1Name','Grandma'].forEach((v,i,a)=>{if(i%2)return;const e=document.getElementById(v);if(e){e.value=a[i+1];e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))}})", "openPage('chg:Childcare:d:card')"]),
]
def prune(v):
    """Empty defaults ({}, [], null) count the same as never saved."""
    if isinstance(v, str):
        try: v = json.loads(v)
        except ValueError: return v
    if isinstance(v, dict): v = {k: prune(x) for k, x in v.items() if prune(x) not in (None, {}, [], '')}
    if isinstance(v, list): v = [prune(x) for x in v]
    return v if v not in ({}, [], '') else None
LS = "JSON.stringify(Object.fromEntries(Object.keys(localStorage).filter(k=>!/home2|seen/.test(k)).sort().map(k=>[k,localStorage.getItem(k)])))"

async def snap(pg):
    o = {}
    for r in SURFACES:
        await pg.evaluate(opener(r)); await pg.wait_for_timeout(80)
        o[r] = await pg.evaluate("document.querySelector('#main').innerText")
    return o

async def flow(pw, name, prof, steps, log):
    b = await pw.chromium.launch(); errs = []
    pg = await new_page(b, errs); await load_family(pg, prof)
    before = await snap(pg); ls0 = await pg.evaluate(LS); notes, pages = [], []
    await pg.evaluate(opener('home'))
    for i, s in enumerate(steps):
        try:
            if s.startswith('CLICK:') or s.startswith('TOAST:'):
                if not await pg.evaluate(CLICK, s[6:]): notes.append('!! NOT FOUND: ' + s)
            elif s.startswith('FILE:'):
                await pg.set_input_files(s[5:], {'name': 'p.png', 'mimeType': 'image/png', 'buffer': TINY_PNG})
            elif s == 'SAME':
                a, z = json.loads(ls0), json.loads(await pg.evaluate(LS))
                ch = sorted(k for k in set(a) | set(z) if prune(a.get(k)) != prune(z.get(k)))
                notes.append('storage back to before: ' + ('YES' if not ch else '!! NO, still changed: ' + ', '.join(ch)))
                continue
            else:
                await pg.evaluate(s)
        except Exception as e:
            notes.append('!! ERROR ' + str(e)[:150])
        await pg.wait_for_timeout(250)
        t = await pg.evaluate(TOASTS)
        if t: notes.append('says: ' + t)
        pages.append(await pg.evaluate("String(page)"))
        nxt = steps[i + 1] if i + 1 < len(steps) else ''
        if not nxt.startswith('TOAST:'):   # keep the toast if the next step taps a button in it
            await pg.evaluate("document.querySelectorAll('.hub-toast,.journey-notice').forEach(t=>t.remove())")
    after = await snap(pg)
    out = [f'\n######## {name}', 'pages: ' + ' > '.join(pages)] + ['  ' + n for n in dict.fromkeys(notes)]
    if errs: out.append('  !! JS ERRORS: ' + ' | '.join(errs))
    for r in SURFACES:
        d = [l for l in difflib.unified_diff(before[r].split('\n'), after[r].split('\n'), lineterm='', n=0) if l[:1] in '+-' and not l.startswith(('+++', '---'))]
        if d: out += [f'  [{r}]'] + ['    ' + l[:160] for l in d[:24]]
    log.append((name, '\n'.join(out))); await b.close()

async def main():
    log = []; only = sys.argv[1:] 
    async with async_playwright() as pw:
        sem = asyncio.Semaphore(6)
        async def one(f):
            async with sem: await flow(pw, *f, log)
        await asyncio.gather(*[one(f) for f in FLOWS if not only or any(o.lower() in f[0].lower() for o in only)])
    order = [f[0] for f in FLOWS]
    print('\n'.join(t for _, t in sorted(log, key=lambda x: order.index(x[0]))))
asyncio.run(main())
