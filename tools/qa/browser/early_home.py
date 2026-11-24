"""Nov 23 (Yarden, on her phone): a 7-month-old born 9 weeks early saw "Month 5" and the 5-month story on Home,
next to his 7-month keepsake. Home's month card and the story are numbered by the birthday month. What they say
about the baby follows the adjusted month, and the card shows no "adjusted" line.
    python3 tools/qa/browser/early_home.py   (app served on 8765)"""
import asyncio, datetime, re, os
PORT = os.environ.get('PORT', '8765')
from playwright.async_api import async_playwright
async def main():
    fails = []
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        for months, weeks_early in [(7.05, 9), (6.05, 4), (4.05, 8), (10.05, 14)]:
            dob = (datetime.date.today() - datetime.timedelta(days=int(months * 30.44))).isoformat()
            due = (datetime.date.fromisoformat(dob) + datetime.timedelta(weeks=weeks_early)).isoformat()
            pg = await b.new_page(viewport={'width': 390, 'height': 844}); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)[:150]))
            await pg.goto(f'http://localhost:{PORT}/index.html')
            await pg.evaluate("([d,u])=>{localStorage.clear();localStorage.setItem('ahead-v2-profile',JSON.stringify({name:'Ari',dob:d,due:u,early:true,pronouns:'he',id:'p',feed:'Both',feedHow:'Nursing',joined:d}))}", [dob, due])
            await pg.reload(); await pg.wait_for_timeout(800)
            real = await pg.evaluate("actualMonth()")
            card = await pg.evaluate("()=>{const c=document.querySelector('.ms-card');return c?c.innerText:''}")
            if not re.search(rf'\bMonth {real}\b', card): fails.append(f'{months}m, {weeks_early}w early: card says {card[:40]!r}, expected Month {real}.')
            if 'adjusted' in card.lower(): fails.append(f'{months}m: the card says "adjusted"')
            if card:
                await pg.evaluate("stOpen()"); await pg.wait_for_timeout(1200)
                giant = await pg.evaluate("()=>{const g=document.querySelector('.st-giant');return g?g.innerText.trim():''}")
                if giant != str(real): fails.append(f'{months}m: the story cover says {giant!r}, expected {real}')
            if errs: fails.append(f'{months}m: JS errors {errs}')
            await pg.close()
        await b.close()
    print('\n'.join(fails) if fails else 'Early-baby Home checks passed')
asyncio.run(main())
