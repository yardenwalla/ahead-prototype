"""Browser checks for the monthly Home (it needs a real page, so the node checks can't draw it).
Serve the app first:  python3 -m http.server 8765   then:  python3 tools/qa/browser/home_checks.py
Fails (exit 1) if:
  1. a month birthday shows the photo banner AND a question (it's one or the other: the banner first),
  2. a checkup question shows on Home at all (Health moves on by age; Nov 10),
  3. anything on Home runs off a small (320px) phone,
  4. a Home tap throws an error or does nothing,
  5. on a month birthday the month card names another month than the balloon (checked in two time zones),
  6. Home rows leave their guide's color,
  7. wording that read wrong for some families (pronouns, "1 months", formula poop, past-due checkups) comes back,
     or Home breaks for a baby born early who is days old,
  8. a due checkup can't be marked done, a born-early header shows one age, Home says "plus N more",
     or a nursing family's day-one plan has no bottle practice."""
import asyncio, calendar, datetime as dt, sys, base64, tempfile, os
from playwright.async_api import async_playwright

BASE = os.environ.get('AHEAD_URL', 'http://localhost:8765/index.html')
T = dt.date.today()
fails, passed = [], 0
def check(ok, msg):
    global passed
    if ok: passed += 1
    else: fails.append(msg)

def months_ago(n):
    y, m = divmod(T.month - 1 - n, 12); yy, mm = T.year + y, m + 1
    return dt.date(yy, mm, min(T.day, calendar.monthrange(yy, mm)[1]))

async def load(pg, dob, pr='she', feed='Breast milk'):
    prof = dict(name='Maya', pronouns=pr, dob=dob.isoformat(), due='', early=False, feed=feed, example=False, id='hc', joined=dob.isoformat())
    await pg.goto(BASE)
    await pg.evaluate("p=>{localStorage.clear();localStorage.setItem('ahead-v2-profile',JSON.stringify(p))}", prof)
    await pg.goto(BASE); await pg.wait_for_timeout(400)
    await pg.evaluate("navigate('home')"); await pg.wait_for_timeout(250)

has = lambda pg, sel: pg.evaluate(f"!!document.querySelector('.hg-page {sel}')")

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 390, 'height': 844})
        errors = []; pg.on('pageerror', lambda e: errors.append(str(e)))
        png = os.path.join(tempfile.mkdtemp(), 'p.png')
        open(png, 'wb').write(base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='))
        # 1-2. Birthdays: banner or question, never both
        for m in range(1, 12):
            await load(pg, months_ago(m))
            ban, q = await has(pg, '.hg-banner'), await has(pg, '.connected-checkin')
            check(ban, f'{m}-month birthday shows the photo banner')
            check(not (ban and q), f'{m}-month birthday shows the banner or a question, not both')
            if ban:
                await pg.set_input_files('.hg-banner input[type=file]', png); await pg.wait_for_timeout(600)
                await pg.evaluate("navigate('home')"); await pg.wait_for_timeout(250)
                check(not await has(pg, '.hg-banner'), f'{m} months: the banner leaves once the photo is added')
        await load(pg, months_ago(5))
        await pg.set_input_files('.hg-banner input[type=file]', png); await pg.wait_for_timeout(600)
        await pg.evaluate("navigate('home')"); await pg.wait_for_timeout(250)
        # Nov 10: Home no longer asks about past checkups (Health moves on by age), so no checkup question at all.
        check(not await pg.evaluate("[...document.querySelectorAll('.hg-page .connected-checkin')].some(q => /checkup/i.test(q.textContent))"), '5 months: no checkup question after the birthday photo')
        await load(pg, T - dt.timedelta(days=190))
        check(await has(pg, '.connected-checkin'), 'Not a birthday: the solids question shows as usual at 6 months')
        # 3-4. Small phone, and every Home tap
        small = await b.new_page(viewport={'width': 320, 'height': 640})
        for days, pr, feed in [(10, 'she', 'Formula'), (75, 'they', 'Both'), (160, 'he', 'Breast milk'), (245, 'she', 'Both'), (340, 'they', 'Formula')]:
            await load(small, T - dt.timedelta(days=days), pr, feed)
            off = await small.evaluate("""() => { const vw = document.documentElement.clientWidth;
              return [...document.querySelectorAll('.hg-page *')].filter(e => e.offsetParent && e.getBoundingClientRect().right > vw + 1).map(e => (e.innerText || e.className).slice(0, 40)) }""")
            check(not off, f'{days} days at 320px: nothing runs off screen {off[:2]}')
            await load(pg, T - dt.timedelta(days=days), pr, feed)
            n = await pg.evaluate("document.querySelectorAll('.hg-page [onclick]').length")
            for i in range(n):
                await load(pg, T - dt.timedelta(days=days), pr, feed)
                before = await pg.evaluate("page + document.querySelector('#main').innerHTML.length + !!document.querySelector('.hv-sheet')")
                e0 = len(errors)
                await pg.evaluate(f"document.querySelectorAll('.hg-page [onclick]')[{i}].click()"); await pg.wait_for_timeout(250)
                after = await pg.evaluate("page + document.querySelector('#main').innerHTML.length + !!document.querySelector('.hv-sheet')")
                check(len(errors) == e0, f'{days} days: Home tap {i} throws no error {errors[e0:e0+1]}')
                check(after != before, f'{days} days: Home tap {i} does something')

        # 5. Month birthdays: the card and the balloon agree, in two time zones. Dates are made in the page's own zone.
        for tz in ('UTC', 'America/Los_Angeles'):
            ctx = await b.new_context(viewport={'width': 390, 'height': 844}, timezone_id=tz); tp = await ctx.new_page()
            for m in range(2, 12):
                for back, want in ((0, m), (1, m - 1)):
                    await tp.goto(BASE)
                    await tp.evaluate("""([m, back]) => { const d = new Date(); d.setMonth(d.getMonth() - m); d.setDate(d.getDate() + back);
                      const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                      localStorage.clear(); localStorage.setItem('ahead-v2-profile', JSON.stringify({ name: 'Maya', pronouns: 'she', dob: iso, feed: 'Both', id: 'tz', joined: iso, example: false })) }""", [m, back])
                    await tp.goto(BASE); await tp.wait_for_timeout(300); await tp.evaluate("navigate('home')"); await tp.wait_for_timeout(200)
                    eb = await tp.evaluate("(document.querySelector('.he-eyebrow')||{}).innerText||''")
                    check((f'MONTH {want} ' in eb.upper() + ' ') if want >= 2 else 'WEEKS' in eb.upper(), f'{tz}: {m} months{" minus a day" if back else ""} says Month {want} (got {eb!r})')
            await ctx.close()

        # 6. One app: Home's rows use each guide's own color from the shared palette (Nov 10: Everyday care was yellow on Home, blue everywhere else).
        for days in (36, 160, 245):
            await load(pg, T - dt.timedelta(days=days))
            bad = await pg.evaluate("""() => [...document.querySelectorAll('.hg-page .hl-row')].map(r => {
                const go = (r.getAttribute('onclick') || '').match(/(?:chg|topic):([^:']+)/), cat = go ? go[1] : null, pal = cat && YEAR_PALETTES[cat];
                const bg = r.style.getPropertyValue('--hl-bg').trim().toLowerCase();
                return pal && bg !== pal.pale.toLowerCase() ? cat + ' ' + bg + ' vs ' + pal.pale : null }).filter(Boolean)""")
            check(not bad, f'{days} days: Home rows use their guide colors {bad[:2]}')
        # 7. Nov 14 full QA: wording that read wrong for some families, and a Home that broke for one.
        async def page_text(prof, route):
            await pg.goto(BASE)
            await pg.evaluate("p=>{localStorage.clear();localStorage.setItem('ahead-v2-profile',JSON.stringify(p))}", prof)
            await pg.goto(BASE); await pg.wait_for_timeout(400)
            await pg.evaluate(f"navigate('{route}')"); await pg.wait_for_timeout(300)
            return await pg.evaluate("document.querySelector('#main').innerText")
        def prof(days, **k):
            d = (T - dt.timedelta(days=days)).isoformat()
            return dict(dict(name='Ari', pronouns='he', dob=d, due='', early=False, feed='Formula', example=False, id='hc', joined=d), **k)
        import re
        for pr in ('he', 'they'):
            for days in (60, 130, 160):   # Guides lines for Everyday care 1–3 months, Rolling, Ready for solids
                t = await page_text(prof(days, pronouns=pr), 'categories')
                check(not re.search(r'for (him|them) first rolls|Getting (his|their) ready|dressing (his|their)\b', t), f'{pr}, {days} days: Guides tab pronouns read right')
            for days in (75, 100, 125):
                t = await page_text(prof(days, pronouns=pr), 'home')
                check('are hers' not in t, f'{pr}, {days} days: Home never says the hands "are hers"')
        t = await page_text(prof(5), 'next')
        check(not re.search(r'\b1 months\b', t), 'Timeline: "1 month", never "1 months"')
        t = await page_text(prof(8), 'home')
        check('yellow and seedy' not in t, 'Formula newborn: Home\'s poop line is not the breast-milk one')
        # A checkup two weeks past its date isn't "coming up" or "next" (Health moves on 17 days after).
        due2 = months_ago(2) - dt.timedelta(days=14)
        p2 = prof((T - due2).days)
        t = await page_text(p2, 'home') + await page_text(p2, 'categories')
        check(not re.search(r'2-month checkup is (coming up|next)', t), 'Two weeks past its date, the 2-month checkup is "due now"')
        # Born 8 weeks early, a few days old: Home's month card draws without an error, and says the age is adjusted.
        errors.clear()
        born = (T - dt.timedelta(days=3)).isoformat()
        t = await page_text(dict(name='', pronouns='he', dob=born, due=(T + dt.timedelta(days=53)).isoformat(), early=True, feed='Breast milk', feedHow='Pumping', example=False, id='hc', joined=born), 'home')
        check(await pg.evaluate("!!document.querySelector('.hg-page')") and not errors, f'Born early, days old: Home draws its month card {errors[:1]}')
        check('ADJUSTED' in t.upper().split('THROUGH')[0], 'Born early: Home\'s month card says the age is adjusted')
        # 8. Nov 14 fixes, round 2: mark a checkup done, both ages for babies born early, Home names its news, childcare by age.
        dob45 = (T - dt.timedelta(days=137)).isoformat()
        p45 = dict(name='Leo', pronouns='he', dob=dob45, due='', early=False, feed='Both', feedHow='Nursing', example=False, id='hc', joined=dob45)
        await page_text(p45, 'home'); await pg.evaluate("openPage('topic:Health')"); await pg.wait_for_timeout(300)
        check(await pg.evaluate("!!document.querySelector('.hl-done-link')"), '4.5 months: the due checkup offers "Mark it done"')
        await pg.evaluate("(document.querySelector('.hl-done-link button')||{click(){}}).click()"); await pg.wait_for_timeout(300)
        check(await pg.evaluate("healthRecord(4) && healthRecord(4).status === 'attended'"), 'Mark it done saves the checkup as done')
        check('6‑month' in await pg.evaluate("document.querySelector('#main').innerText"), 'After Mark it done, Health moves on to the next checkup')
        await pg.evaluate("navigate('categories')"); await pg.wait_for_timeout(300)
        t = await pg.evaluate("document.querySelector('#main').innerText")
        check('4-month checkup is due now' not in t, 'A checkup marked done is no longer "due now" on the Guides tab')
        dobE = (T - dt.timedelta(days=76)).isoformat()
        pE = dict(name='Theo', pronouns='he', dob=dobE, due=(T - dt.timedelta(days=20)).isoformat(), early=True, feed='Formula', example=False, id='hc', joined=dobE)
        await page_text(pE, 'home')
        for r in ['topic:Sleep', 'topic:Safety', 'topic:Out and about', 'topic:Childcare', 'chg:Sleep:d:routine']:
            await pg.evaluate(f"openPage('{r}')"); await pg.wait_for_timeout(200)
            hd = await pg.evaluate("(document.querySelector('#main .monthly-page-header p')||{}).textContent||''")
            check(re.search(r'Theo · \d+ weeks · [^·]+ adjusted$', hd), f'Born early: {r} header shows both ages ({hd})')
        for days in (137, 182, 300, 76):
            t = await page_text(prof(days), 'home')
            check(not re.search(r'plus \d+ more|Set to ', t), f'{days} days: Home names its guide news, no "plus N more"')
        pN = dict(prof(275, feed='Breast milk', feedHow='Nursing'))
        t = await page_text(pN, 'home'); await pg.evaluate("openPage('chg:Childcare:d:ready')"); await pg.wait_for_timeout(300)
        t = await pg.evaluate("document.querySelector('#main').innerText")
        check('offer a bottle' in t and 'goodbyes' in t, '9 months, nursing: day one has bottle practice and the goodbye tip')
        await b.close()
    print(f'Home browser checks: {passed} passed' + (f', {len(fails)} failed' if fails else ''))
    for f in fails: print('  FAIL', f)
    sys.exit(1 if fails else 0)

asyncio.run(main())
