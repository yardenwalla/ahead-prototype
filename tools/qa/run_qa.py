"""Ahead QA: play example families week by week from onboarding to 12 months.

Each family onboards through the real setup screens, then the clock moves forward one week
at a time. Every week the script reads Home, Sleep and Feeding the way a parent would,
answers whatever check-in is showing (as that family would), and once a month opens every
link on every category page. Results go to tools/qa/out/results.json; checks.py turns them
into findings and report.py into a readable report.

    python3 tools/qa/run_qa.py            # all families
    python3 tools/qa/run_qa.py maya leo   # some families
"""
import asyncio, datetime as dt, json, os, sys
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
APP = 'file://' + os.path.join(ROOT, 'index.html')
QA_JS = open(os.path.join(os.path.dirname(__file__), 'qa.js')).read()
OUT = os.path.join(os.path.dirname(__file__), 'out')
BIRTH = dt.datetime(2026, 1, 5, 10, 0)

# Truth for each family: the week (from birth) each thing actually happens.
# Families answer the solids question when it's asked; some also save moments (first roll,
# pulling up) or tap "Already there?" themselves, the way a real parent might.
PERSONAS = [
    dict(id='maya', name='Maya', who='Typical: nursing, rolls at 5 months, solids at 6; saves moments, taps “Already there?”', feed='Breast milk', moments=True, proactive=True,
         roll_try=18, roll=21, swaddle_delay=1, solids=26, meals=34, crawl=36, pull=42, naps=30),
    dict(id='leo', name='Leo', who='Born 5 weeks early, formula; taps “Already there?” for solids', feed='Formula', early_days=35, proactive=True,
         roll_try=22, roll=26, swaddle_delay=0, solids=30, meals=38, crawl=42, pull=48, naps=38),
    dict(id='ava', links=False, name='Ava', who='Formula, early roller (3 months); saves moments', feed='Formula', moments=True,
         roll_try=13, roll=15, swaddle_delay=2, solids=25, meals=33, crawl=33, pull=39, naps=28),
    dict(id='noah', links=False, name='Noah', who='Breast milk and formula, starts solids late (7 months)', feed='Both',
         roll_try=17, roll=20, swaddle_delay=1, solids=31, meals=40, crawl=38, pull=46, naps=32),
    dict(id='zoe', links=False, name='Zoe', who='Fast mover: crawls at 6½ months, pulls up at 7½; saves moments', feed='Breast milk', moments=True,
         roll_try=12, roll=14, swaddle_delay=0, solids=26, meals=30, crawl=28, pull=32, naps=27),
    dict(id='mia', links=False, name='Mia', who='Never answers a check-in', feed='Breast milk', silent=True,
         roll_try=18, roll=21, solids=26, meals=34, crawl=36, pull=42, naps=30),
    dict(id='ivy', links=False, name='Ivy', who='Late napper: keeps 3 naps until 10½ months', feed='Breast milk',
         roll_try=17, roll=20, swaddle_delay=1, solids=26, meals=34, crawl=37, pull=44, naps=46),
    dict(id='rosa', links=False, name='Rosa', who='Born 8 weeks early, formula', feed='Formula', early_days=56,
         roll_try=24, roll=28, swaddle_delay=0, solids=34, meals=42, crawl=46, pull=52, naps=44),
    dict(id='sam', name='Sam', who='Joins at 8 months with nothing filled in', feed='Breast milk', join=35,
         roll_try=16, roll=19, swaddle_delay=0, solids=27, meals=35, crawl=37, pull=45, naps=33),
]


def truth(p, w):
    mv = 'pulling' if w >= p['pull'] else 'crawling' if w >= p['crawl'] else 'rolling' if w >= p['roll'] else 'trying' if w >= p['roll_try'] else 'none'
    food = 'established' if w >= p['meals'] else 'new' if w >= p['solids'] else 'preparing'
    return mv, food


def answer_for(question, p, w):
    """Which button this family taps for a check-in question."""
    mv, food = truth(p, w)
    q = question.lower()
    if 'trying to roll' in q:
        return {'none': 'Not yet', 'trying': 'Trying'}.get(mv, 'Rolling')
    if 'finger foods' in q:
        return 'Yes' if food == 'established' else 'Not yet'
    if 'times a day' in q and 'solids' in q:
        return '3 times' if w >= p['meals'] else 'Twice' if w >= p['solids'] + 8 else 'Once or less'
    if 'solids' in q:
        if 'where are you' in q:
            return {'preparing': 'Not started', 'new': 'First foods', 'established': 'Building meals'}[food]
        return {'preparing': 'Not yet', 'new': 'Once a day or less', 'established': '3 times a day'}[food]
    if 'crawling' in q:
        return 'Yes' if mv in ('crawling', 'pulling') else 'Not yet'
    if 'pulling up' in q:
        return 'Yes' if mv == 'pulling' else 'Not yet'
    if 'catnap' in q:
        return 'Yes' if w >= p['naps'] else 'Not yet'
    if 'what milk' in q:
        return p['feed']
    return None


MUTATES = ('setAnswer', 'answerHomeQuestion', 'skipHomeQuestion', 'chgToggleSafe', 'setFeedingStage', 'saveCurrentGuide',
           'setSafetyCheck', 'completeHomeCheck', 'confirmHomeSwaddle', 'chgCycleMethod', 'chgAnswer', 'remove', 'submit',
           'startSetup', 'useDemo', 'reset', 'setMovement', 'expAnswer', 'rollAnswer', 'markStage', 'saveJourney', 'chgOpen',
           'dismiss', 'setSleep', 'chooseSleepGuide', 'setMonth', 'navigate(')


async def onboard(pg, p):
    await pg.evaluate("localStorage.clear()")
    await pg.reload()
    await pg.evaluate("page='welcome';render()")
    await pg.click('.aw-start')
    await pg.fill('#babyName', p['name'])
    dob = BIRTH.date().isoformat()
    await pg.fill('#dob', dob)
    if p.get('early_days'):
        await pg.check('#early')
        await pg.fill('#due', (BIRTH + dt.timedelta(days=p['early_days'])).date().isoformat())
    await pg.click('#setupForm button.primary')
    await pg.select_option('#feed', p['feed'])
    await pg.click('#setupForm button.primary')
    return await pg.evaluate("__qa.state()")


async def click_text(pg, scope, label):
    loc = pg.locator(f"{scope} button", has_text=label).first
    if await loc.count():
        await loc.click()
        return True
    return False


async def run_persona(browser, p):
    ctx = await browser.new_context(viewport={'width': 430, 'height': 900})
    pg = await ctx.new_page()
    errors = []
    pg.on('pageerror', lambda e: errors.append(str(e)))
    join = p.get('join', 0)
    await pg.clock.install(time=BIRTH + dt.timedelta(weeks=join, hours=1))
    await pg.add_init_script(QA_JS)
    await pg.goto(APP)
    weeks, crawled, seen_swaddle, seen_check = [], set(), None, {}
    onboarding = await onboard(pg, p)
    last_month = None
    for w in range(join, 53):
        await pg.clock.set_fixed_time(BIRTH + dt.timedelta(weeks=w, hours=1))
        await pg.reload()
        err0 = len(errors)
        st = await pg.evaluate("__qa.state()")
        rec = dict(week=w, month=st['month'], dev=st['dev'], truth=truth(p, w), answered=[], clicks=[])
        rec['home'] = await pg.evaluate("__qa.home()")

        # 1. Home check-in, answered the way this family would (or ignored, for the silent family)
        ci = rec['home']['checkin']
        if ci and not p.get('silent'):
            a = answer_for(ci['q'], p, w)
            if a and await click_text(pg, '.connected-checkin', a):
                rec['answered'].append(dict(where='Home', q=ci['q'], a=a))
                rec['home_after'] = await pg.evaluate("__qa.home()")

        # 2. Swaddling: mark done once the family has actually stopped
        h = rec.get('home_after', rec['home'])
        if h['swaddle'] and not p.get('silent'):
            seen_swaddle = seen_swaddle if seen_swaddle is not None else w
            if w - seen_swaddle >= p.get('swaddle_delay', 0):
                await pg.evaluate("navigate('home')")
                loc = pg.locator('[data-brief^="rolling"] .home-inline-check').first
                if await loc.count():
                    await loc.click()
                    rec['answered'].append(dict(where='Home', q='Stop swaddling', a='Mark done'))

        # 2b. Safety checks on Home: this family ticks one off a week after it appears
        if not p.get('silent'):
            await pg.evaluate("navigate('home')")
            title = await pg.evaluate("(document.querySelector('[data-home-check] .connected-row b')||{}).textContent||''")
            if title:
                if seen_check.get(title) is None: seen_check[title] = w
                elif w - seen_check[title] >= 1:
                    loc = pg.locator('[data-home-check] .home-inline-check').first
                    if await loc.count():
                        await loc.click()
                        rec['answered'].append(dict(where='Home', q='Safety check: ' + title, a='Mark done'))
            mloc = pg.locator('.home-inline-check[aria-label*="mattress"]').first
            if await mloc.count():
                await mloc.click()
                rec['answered'].append(dict(where='Home', q='Crib mattress lowered', a='Mark done'))

        # 2c. Saved moments: families who use the timeline record the first roll and pulling up
        if p.get('moments') and not p.get('silent'):
            for k, label in (('roll', 'Rolls tummy to back'), ('pull', 'Pulls up to stand')):
                if w == p[k]:
                    ok = await pg.evaluate("(l)=>{try{return saveJourneySkill(journeySkillKey(l),{date:NOW.toISOString().slice(0,10)})!==false}catch(e){return String(e)}}", label)
                    rec['answered'].append(dict(where='Timeline', q='Moment: ' + label, a=str(ok)))
        rec['safety'] = await pg.evaluate("safetyStageNow()")

        # 3. Category pages, plus any check-in or auto-move notice showing on them
        rec['sleep'] = await pg.evaluate("__qa.cat('Sleep')")
        if not p.get('silent'):
            sl = rec['sleep']
            if sl['checkin']:
                rec['answered'].append(dict(where='Sleep', q='UNEXPECTED: ' + sl['checkin'], a='-'))
            if any(('We moved' in x['title'] or 'two-nap guidance' in x['title'].lower()) for x in sl['alerts']) and w < p['naps']:
                await pg.evaluate("navigate('categories');openPage('topic:Sleep')")
                loc = pg.locator('.sleep-phase-ahead button', has_text='Still on three naps').first
                if await loc.count():
                    await loc.click()
                    rec['answered'].append(dict(where='Sleep', q='We moved her to two naps', a='Keep on three naps'))
            sl2 = await pg.evaluate("__qa.cat('Sleep')")
            if w >= p['naps'] + 1 and sl2['current'] == 'Three naps':
                await pg.evaluate("navigate('categories');openPage('topic:Sleep')")
                loc = pg.locator('.chg-already').first
                if await loc.count():
                    await loc.click()
                    rec['answered'].append(dict(where='Sleep', q='Already there: two naps', a='Two naps'))
            rec['sleep_after'] = await pg.evaluate("__qa.cat('Sleep')")
        rec['feed'] = await pg.evaluate("__qa.cat('Feeding')")
        if p.get('proactive') and w == p['solids'] and rec['feed']['current'] == 'Preparing for solids':
            await pg.evaluate("navigate('categories');openPage('topic:Feeding')")
            loc = pg.locator('.chg-already').first
            if await loc.count():
                await loc.click()
                rec['answered'].append(dict(where='Feeding', q='Already there: starting solids', a='First foods'))
                rec['feed'] = await pg.evaluate("__qa.cat('Feeding')")
        if rec['feed']['checkin'] and not p.get('silent'):
            a = answer_for(rec['feed']['checkin'], p, w)
            if a and await click_text(pg, '.chg-checkin', a):
                rec['answered'].append(dict(where='Feeding', q=rec['feed']['checkin'], a=a))
                rec['feed_after'] = await pg.evaluate("__qa.cat('Feeding')")

        # 4. Once a month: open every link on Home and every category page (and one level deeper)
        if st['month'] != last_month and p.get('links', True):
            last_month = st['month']
            saved = await pg.evaluate("__qa.snap()")
            starts = ['home', 'timeline'] + [f'{k}:{t}' for k in ('topic',) for t in ['Development', 'Feeding', 'Sleep', 'Health', 'Safety', 'Daily rhythm']]
            visited = set()
            queue = [(s, 0) for s in starts]
            while queue:
                src, depth = queue.pop(0)
                await pg.evaluate(f"page={json.dumps(src)};historyStack=['home'];render()")
                ocs = await pg.evaluate("__qa.clickables()")
                for oc in ocs:
                    if any(m in oc for m in MUTATES) or (src, oc) in visited:
                        continue
                    visited.add((src, oc))
                    r = await pg.evaluate("([s,o])=>__qa.tryClick(s,o)", [src, oc])
                    if await pg.evaluate("(o)=>JSON.stringify(__qa.snap())!==JSON.stringify(o)", saved):
                        r['changed_state'] = True
                        await pg.evaluate("(o)=>__qa.restore(o)", saved)
                        await pg.reload()
                    rec['clicks'].append(r)
                    if depth == 0 and r['to'] != src and r['to'] not in [q[0] for q in queue] and r['to'] not in starts:
                        queue.append((r['to'], 1))
            await pg.evaluate("(o)=>__qa.restore(o)", saved)
            await pg.reload()
        rec['errors'] = errors[err0:]
        weeks.append(rec)
    await ctx.close()
    return dict(persona=p, onboarding=onboarding, weeks=weeks)


async def main(ids):
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        chosen = [p for p in PERSONAS if not ids or p['id'] in ids]
        results = await asyncio.gather(*[run_persona(browser, p) for p in chosen])
        for r in results:
            n = sum(len(x['clicks']) for x in r['weeks'])
            print(f"{r['persona']['id']:5s} weeks {len(r['weeks'])}  links opened {n}", flush=True)
        await browser.close()
    json.dump(results, open(os.path.join(OUT, 'results.json'), 'w'), ensure_ascii=False)


if __name__ == '__main__':
    asyncio.run(main(sys.argv[1:]))

