"""Compare two page_text.py runs. Lists every page whose layout outline changed, so a content-only
change can be proven to touch no layout (and a fix only the pages it should).
    python3 tools/qa/browser/layout_guard.py before.json after.json"""
import difflib, json, sys
o, n = json.load(open(sys.argv[1])), json.load(open(sys.argv[2]))
diff = {}
for fam in o:
    for r, v in o[fam].items():
        w = n.get(fam, {}).get(r)
        if w is None: diff.setdefault(r, set()).add(f'{fam}: page gone'); continue
        if v['sk'] != w['sk']:
            ch = [x for x in difflib.ndiff(v['sk'].split(), w['sk'].split()) if x[:1] in '+-'][:6]
            diff.setdefault(r, set()).add(f'{fam}: ' + ' '.join(ch)[:240])
    for r in n.get(fam, {}):
        if r not in o[fam]: diff.setdefault(r, set()).add(f'{fam}: new page')
for r in sorted(diff):
    print(r); [print('   ', x) for x in sorted(diff[r])[:3]]
print('pages whose layout changed:', len(diff))
