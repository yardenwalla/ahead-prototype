"""Group everyone.py's flags by kind, most common first, with one example page and family each.
    python3 tools/qa/browser/everyone_report.py OUTDIR"""
import json, os, sys
from collections import defaultdict
d = json.load(open(os.path.join(sys.argv[1] if len(sys.argv) > 1 else 'everyone-out', 'flags.json')))
kinds = defaultdict(list)
for page, v in d.items():
    for flag, fam in v['bad'].items(): kinds[flag.split(':')[0]].append((page, flag, fam))
print(f'{len(d)} pages, {sum(v["profiles"] for v in d.values())} page visits\n')
for k, rows in sorted(kinds.items(), key=lambda x: -len(x[1])):
    print(f'== {k} ({len(rows)})')
    for page, flag, fam in sorted(rows)[:25]: print(f'   {page}: {flag[:110]}   [{fam}]')
