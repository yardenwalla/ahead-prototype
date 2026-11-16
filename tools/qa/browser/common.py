"""Shared bits for the browser checks: the test families, how to load one, and page readers.
Serve the app first, from the repo root:  python3 -m http.server 8765"""
import base64, datetime, json, re
PORT = 8765
TODAY = datetime.date.today()
# (age in months, milk, how, pronouns, name, weeks early)
FAMILIES = [(0.4, 'Breast milk', 'Nursing', 'she', 'Noor', 0), (2.5, 'Formula', '', 'he', 'Theo', 8),
            (6, 'Both', 'Pumping', 'they', 'Kai', 0), (10, 'Breast milk', 'Pumping', 'she', 'Mia', 0),
            (4.5, 'Both', 'Nursing', 'he', 'Leo', 0), (11.6, 'Formula', '', 'she', 'Rosa', 0)]
TABS = ('home', 'categories', 'timeline', 'profile', 'next')
TINY_PNG = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')

def dob(months):
    return (TODAY - datetime.timedelta(days=int(max(months, 0.1) * 30.44))).isoformat()

def profile(age, feed='Formula', how='', pr='he', name='Theo', early=0):
    born = dob(age)
    p = {'name': name, 'dob': born, 'pronouns': pr, 'id': 'c', 'example': False, 'joined': born, 'feed': feed, 'feedHow': how}
    if early:
        p['early'] = True
        p['due'] = (datetime.date.fromisoformat(born) + datetime.timedelta(weeks=early)).isoformat()
    return p

def opener(route):
    return f"navigate('{route}')" if route in TABS else f"openPage({json.dumps(route)})"

async def new_page(browser, errors):
    ctx = await browser.new_context(viewport={'width': 390, 'height': 844})
    await ctx.route(re.compile(r'^https?://(?!localhost)'), lambda r: r.abort())  # no outside sites
    pg = await ctx.new_page()
    pg.on('pageerror', lambda e: errors.append(str(e)[:200]))
    pg.on('dialog', lambda d: d.dismiss())
    return pg

async def load_family(pg, prof):
    await pg.goto(f'http://localhost:{PORT}/index.html')
    await pg.evaluate("p=>{localStorage.clear();localStorage.setItem('ahead-v2-profile',JSON.stringify(p))}", prof)
    await pg.reload(); await pg.wait_for_timeout(400)

STORAGE = "()=>JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])))"
RESTORE = """ls=>{localStorage.clear();for(const[k,v] of Object.entries(JSON.parse(ls)))localStorage.setItem(k,v);
 document.querySelectorAll('.hub-toast,.journey-notice').forEach(t=>t.remove());
 try{historyStack.length=0}catch(e){};try{journeyNotice=null}catch(e){};try{window.__hubBooking=null}catch(e){}}"""
TOASTS = "()=>[...document.querySelectorAll('.hub-toast,.journey-notice')].map(t=>t.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean).join(' | ')"
CLICK = """t=>{const e=[...document.querySelectorAll('#main button,#main [onclick],#main summary,#main label,.hub-toast button')]
 .find(e=>(e.innerText||e.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim().startsWith(t));if(!e)return false;e.click();return true}"""
