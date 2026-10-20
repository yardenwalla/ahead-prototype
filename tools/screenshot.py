# Screenshot app states with Playwright.
# Usage: python3 tools/screenshot.py "$PWD/index.html" out/shot "" "openPage('topic:Sleep')"
import sys, asyncio
from playwright.async_api import async_playwright
# usage: shot.py file.html out_prefix "js1" "js2" ...
async def main():
    f, pre, *steps = sys.argv[1:]
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width':430,'height':900}, device_scale_factor=1)
        errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
        await pg.goto('file://'+f); await pg.wait_for_timeout(700)
        for i,s in enumerate(steps):
            if s: await pg.evaluate(s)
            await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'{pre}{i}.png', full_page=True)
        print('\n'.join(errs[:10]))
        await b.close()
asyncio.run(main())
