"""Check links emitted by beta-readiness.cjs; blocked hosts remain unverified.
Usage: python tools/qa/link-check.py
No browser automation. HEAD first; GET only if HEAD is unsupported or says missing.
"""
import concurrent.futures, json, pathlib, urllib.request, urllib.error, time, sys

out = pathlib.Path(__file__).parent / 'out'
urls = json.loads((out / 'beta-links.json').read_text())
previous = out / 'beta-link-results.json'
cache = {}
if '--fresh' not in sys.argv and previous.exists() and time.time() - previous.stat().st_mtime < 3600:
    cache = {x['url']:x for x in json.loads(previous.read_text()) if x.get('result') == 'reachable'}

def check(url):
    if url in cache: return cache[url]
    result = {'url': url}
    for method in ['HEAD', 'GET']:
        try:
            req = urllib.request.Request(url, method=method, headers={'User-Agent': 'Ahead-link-check/1.0'})
            with urllib.request.urlopen(req, timeout=15) as response:
                result.update(status=response.status, final=response.url)
                if method == 'GET': response.read(1024)
            break
        except urllib.error.HTTPError as error:
            result['status'] = error.code
            if method == 'HEAD' and error.code in [404, 405]: continue
            break
        except Exception as error:
            result.update(status='unverified', error=str(error))
            break
    code = result.get('status')
    result['result'] = 'reachable' if isinstance(code,int) and 200 <= code < 300 else 'missing' if code in [404,410] else 'unverified'
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(check, urls))
(out / 'beta-link-results.json').write_text(json.dumps(results, indent=2))
print(json.dumps({'total':len(results), 'reachable':sum(x['result']=='reachable' for x in results),
                  'issues':[x for x in results if x['result']!='reachable']}, indent=2))
