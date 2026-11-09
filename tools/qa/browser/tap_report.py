"""Summarize tap_audit.py output: what's broken, and every link with where it landed, for a by-eye match check.
    python3 tools/qa/browser/tap_report.py [OUTDIR] > taps.txt"""
import glob, json, os, re, sys
from collections import defaultdict
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'out', 'taps')
JUNK = re.compile(r'\bundefined\b|\bnull\b|\bNaN\b|\[object|\$\{|Infinity')
bad, none, links = [], defaultdict(set), defaultdict(set)
total = 0
for f in sorted(glob.glob(os.path.join(D, '*.json'))):
    d = json.load(open(f)); fam = d['family']
    for r, p in d['pages'].items():
        if p.get('fail') or p.get('err'): bad.append(f"{fam} page {r}: {p.get('fail') or p['err']}")
        if JUNK.search(p.get('text', '')): bad.append(f"{fam} page {r}: junk text")
    for t in d['taps']:
        total += 1
        where = f"{fam} {t['from']} › “{t['label']}”"
        if t['kind'] in ('exc', 'missing'): bad.append(f"{where}: {t['kind']} {t.get('err', '')}")
        if t.get('err'): bad.append(f"{where}: JS error {t['err']}")
        if JUNK.search(t.get('text', '') + t.get('toast', '')): bad.append(f"{where}: junk text")
        if t['kind'] == 'nav' and len(t.get('text', '').strip()) < 40: bad.append(f"{where}: lands on a near-blank page {t['to']}")
        if t['kind'] == 'none': none[t['label']].add(t['from'])
        if t['kind'] == 'nav': links[(t['label'], t['to'], t['h1'])].add(fam)
print(f'{total} taps checked\n\n== PROBLEMS ({len(bad)})  (a lone "missing" can mean an earlier tap changed that row: check it by hand)'); print('\n'.join(sorted(set(bad))) or 'none')
print(f'\n== TAPS THAT DID NOTHING ({len(none)}): expected for file pickers, form labels, quick-fill chips, the current tab')
for l, fr in sorted(none.items()): print(f'  “{l}” on {", ".join(sorted(fr)[:4])}')
print(f'\n== WHERE EACH LINK LANDS ({len(links)}): read down it: does each page match the words on the button?')
for (l, to, h1), fams in sorted(links.items()): print(f'  “{l}” → {to}  [{h1}]')
