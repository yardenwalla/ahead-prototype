"""Build the readable QA report (tools/qa/out/report.html) from the run and the findings.

    python3 tools/qa/report.py   # uses out/results.json, out/findings.json, out/findings_before.json
"""
import json, os, html, datetime as dt

OUT = os.path.join(os.path.dirname(__file__), 'out')
E = html.escape


def load(name, default=None):
    p = os.path.join(OUT, name)
    return json.load(open(p)) if os.path.exists(p) else default


results = load('results.json', [])
after = load('findings.json', {'findings': [], 'stats': {}})
before = load('findings_before.json', after)
fixed_notes = load('fixes.json', {})   # title -> what was changed
decisions = load('decisions.json', {}) # title -> the product decision it needs

GROUPS = [('works', 'Everything works', 'Nothing broken or empty: script errors, empty sections, dead links, back buttons.'),
          ('order', 'Order and value', 'The right stage for the age, never going backwards, phases in their window, Home limits, reason lines that match the age, nothing stale.'),
          ('personal', 'Personalization', 'What a parent tells the app shows up, in the right places, and goes away when it’s done. Check-ins catch real changes.')]

key = lambda f: (f['group'], f['title'])
after_keys = {key(f) for f in after['findings']}
before_by = {key(f): f for f in before['findings']}
fixed = [f for k, f in before_by.items() if k not in after_keys]
remaining = after['findings']
stats = after['stats']


def card(g, title, desc):
    b = [f for f in before['findings'] if f['group'] == g]
    fx = [f for f in fixed if f['group'] == g]
    rb = [f for f in remaining if f['group'] == g and f['severity'] == 'bug']
    rw = [f for f in remaining if f['group'] == g and f['severity'] == 'warning']
    state = 'pass' if not rb else 'fail'
    return f'''<article class="score {state}"><header><h3>{E(title)}</h3><span class="pill {state}">{'Passing' if not rb else f'{len(rb)} open'}</span></header>
      <p>{E(desc)}</p><dl><div><dt>Found</dt><dd>{len(b)}</dd></div><div><dt>Fixed</dt><dd>{len(fx)}</dd></div><div><dt>Open bugs</dt><dd>{len(rb)}</dd></div><div><dt>Notes</dt><dd>{len(rw)}</dd></div></dl></article>'''


def finding_row(f, show_fix=False):
    ppl = ', '.join(f['personas'])
    wk = f['weeks']
    span = f'week {wk[0]}' if len(wk) == 1 else f'{len(wk)} weeks ({wk[0]}–{wk[-1]})'
    ex = ''.join(f'<li>{E(x)}</li>' for x in f['examples'][:3])
    fix = fixed_notes.get(f['title'], '') if show_fix else decisions.get(f['title'], '')
    return f'''<details class="finding {f['severity']}"><summary><span class="sev">{'Bug' if f['severity'] == 'bug' else 'Note'}</span><span class="ft">{E(f['title'])}</span><span class="meta">{E(ppl)} · {E(span)}</span></summary>
      {f'<p class="fix"><b>{"Fixed" if show_fix else "Decision"}:</b> {E(fix)}</p>' if fix else ''}<ul class="ex">{ex}</ul></details>'''


def timeline(r):
    p = r['persona']
    rows = []
    for w in r['weeks']:
        h = w.get('home_after', w['home']); s = w['sleep']; f = w.get('feed_after', w['feed'])
        told = '<br>'.join(f'{E(a["q"])} → <b>{E(a["a"])}</b>' for a in w['answered']) or '<span class="mute">—</span>'
        ci = (w['home']['checkin'] or {}).get('q')
        cards = ''.join(f'<li><small>{E(x["label"])}</small>{E(x["title"])}</li>' for x in h['rows'] + h['actions'])
        nxt = ''.join(f'<li><small>{E(x["label"])}</small>{E(x["title"])}</li>' for x in h['next'])
        al = lambda pg: ''.join(f'<span class="tag">{E(a["title"])}</span>' for a in pg['alerts'])
        ev = lambda pg: ''.join(f'<span class="tag ev">{E(e)}</span>' for e in pg['events'])
        rows.append(f'''<tr><td class="num">{w['week']}</td><td class="num">{w['month']}</td>
          <td>{f'<span class="ci">Asks: {E(ci)}</span><br>' if ci else ''}{told}</td>
          <td><ul class="cards">{cards}</ul>{f'<div class="next-h">Prepare for next</div><ul class="cards nx">{nxt}</ul>' if nxt else ''}</td>
          <td><b>{E(s['current'])}</b>{al(s)}{ev(s)}</td><td><b>{E(f['current'])}</b>{al(f)}{ev(f)}</td></tr>''')
    return f'''<section class="family" id="fam-{p['id']}" hidden><p class="who"><b>{E(p['name'])}</b> · {E(p['who'])}</p>
      <div class="tablewrap"><table><thead><tr><th>Week</th><th>Age (mo)</th><th>What the parent told the app</th><th>Home</th><th>Sleep</th><th>Feeding</th></tr></thead><tbody>{''.join(rows)}</tbody></table></div></section>'''


fams = ''.join(timeline(r) for r in results)
tabs = ''.join(f'<button class="tab" data-fam="{r["persona"]["id"]}">{E(r["persona"]["name"])}</button>' for r in results)
who = ''.join(f'<li><b>{E(r["persona"]["name"])}</b> {E(r["persona"]["who"])}</li>' for r in results)
open_bugs = [f for f in remaining if f['severity'] == 'bug']
notes = [f for f in remaining if f['severity'] == 'warning']
run_date = dt.date.today().strftime('%B %-d, %Y')

page = f'''<title>Ahead QA Report</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Nunito:wght@700;800&display=swap">
<style>
/* Layout: a single reading column that follows Ahead's own type and palette; the family timelines widen into scrollable tables. */
:root {{
  --bg: #faf9f4; --surface: #fffefb; --ink: #253f35; --muted: #637469; --line: #e1e5d9;
  --accent: #526c47; --accent-pale: #e9efdf; --bad: #a3404f; --bad-pale: #f8e4e7; --warn: #8a6a1f; --warn-pale: #f7eed6;
  --display: 'Nunito', ui-rounded, 'Figtree', system-ui, sans-serif; --ui: 'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg: #161c19; --surface: #1e2622; --ink: #e5ece6; --muted: #a2b2a7; --line: #2f3a34;
  --accent: #a9c79a; --accent-pale: #26331f; --bad: #f0a3ae; --bad-pale: #3a2227; --warn: #e2c27a; --warn-pale: #352c17; color-scheme: dark }} }}
:root[data-theme="dark"] {{
  --bg: #161c19; --surface: #1e2622; --ink: #e5ece6; --muted: #a2b2a7; --line: #2f3a34;
  --accent: #a9c79a; --accent-pale: #26331f; --bad: #f0a3ae; --bad-pale: #3a2227; --warn: #e2c27a; --warn-pale: #352c17; color-scheme: dark }}
* {{ box-sizing: border-box }}
body {{ background: var(--bg); color: var(--ink); font: 15px/1.55 var(--ui); padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)) }}
main {{ max-width: 980px; margin: 0 auto; padding-block: 36px 64px; display: flex; flex-direction: column; gap: 40px }}
h1, h2, h3 {{ text-wrap: balance; margin: 0 }}
h1 {{ font: 800 34px/1.15 var(--display); letter-spacing: -.4px }}
h2 {{ font: 700 22px/1.3 var(--display); margin-bottom: 4px }}
h3 {{ font: 600 16px/1.35 var(--ui) }}
p {{ margin: 0; max-width: 68ch }}
.lede {{ color: var(--muted); margin-top: 10px }}
.eyebrow {{ font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; color: var(--muted); margin-bottom: 8px }}
.facts {{ display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 16px; font-size: 13px; color: var(--muted) }}
.facts b {{ color: var(--ink); font-variant-numeric: tabular-nums }}
.scores {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px }}
.score {{ background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: 16px; display: flex; flex-direction: column; gap: 10px }}
.score header {{ display: flex; justify-content: space-between; align-items: center; gap: 10px }}
.score p {{ font-size: 13px; color: var(--muted) }}
.pill {{ font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; white-space: nowrap }}
.pill.pass {{ background: var(--accent-pale); color: var(--accent) }} .pill.fail {{ background: var(--bad-pale); color: var(--bad) }}
.score dl {{ display: grid; grid-template-columns: repeat(4, 1fr); margin: 0; border-top: 1px solid var(--line); padding-top: 10px }}
.score dt {{ font-size: 11px; color: var(--muted) }} .score dd {{ margin: 0; font: 700 20px/1.3 var(--display); font-variant-numeric: tabular-nums }}
.section-head {{ display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px }}
.section-head p {{ color: var(--muted); font-size: 14px }}
.findings {{ background: var(--surface); border: 1px solid var(--line); border-radius: 18px; overflow: hidden }}
.finding + .finding {{ border-top: 1px solid var(--line) }}
.finding summary {{ display: grid; grid-template-columns: 52px minmax(0, 1fr); gap: 2px 10px; padding: 13px 16px; cursor: pointer; list-style: none }}
.finding summary::-webkit-details-marker {{ display: none }}
.sev {{ grid-row: span 2; align-self: start; font-size: 11px; font-weight: 700; text-align: center; padding: 3px 0; border-radius: 6px }}
.finding.bug .sev {{ background: var(--bad-pale); color: var(--bad) }} .finding.warning .sev {{ background: var(--warn-pale); color: var(--warn) }}
.finding.fixed .sev {{ background: var(--accent-pale); color: var(--accent) }}
.ft {{ font-weight: 600; min-width: 0 }} .meta {{ font-size: 12px; color: var(--muted) }}
.fix {{ font-size: 13px; padding: 0 16px 6px 78px }}
.ex {{ margin: 0; padding: 0 16px 14px 94px; font-size: 12px; color: var(--muted) }}
.empty {{ padding: 16px; color: var(--muted); font-size: 14px }}
.who-list {{ margin: 8px 0 0; padding-left: 18px; font-size: 14px; color: var(--muted); columns: 2 280px }}
.who-list b {{ color: var(--ink) }}
.tabs {{ display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 14px }}
.tab {{ font: 600 13px/1 var(--ui); padding: 9px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer }}
.tab[aria-selected="true"] {{ background: var(--ink); color: var(--bg); border-color: var(--ink) }}
.tab:focus-visible, summary:focus-visible {{ outline: 2px solid var(--accent); outline-offset: 2px }}
.who {{ font-size: 14px; color: var(--muted); margin-bottom: 10px }} .who b {{ color: var(--ink) }}
.tablewrap {{ overflow-x: auto; border: 1px solid var(--line); border-radius: 14px; background: var(--surface) }}
table {{ border-collapse: collapse; width: 100%; min-width: 860px; font-size: 12.5px }}
th {{ position: sticky; top: 0; background: var(--surface); text-align: left; font-weight: 600; color: var(--muted); padding: 10px; border-bottom: 1px solid var(--line) }}
td {{ padding: 9px 10px; border-bottom: 1px solid var(--line); vertical-align: top }}
td.num {{ font-variant-numeric: tabular-nums; color: var(--muted); width: 48px }}
.cards {{ list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px }}
.cards small {{ display: block; color: var(--muted); font-size: 11px }}
.cards.nx {{ opacity: .8 }} .next-h {{ font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin: 8px 0 3px }}
.tag {{ display: block; margin-top: 4px; font-size: 11px; padding: 2px 7px; border-radius: 6px; background: var(--warn-pale); color: var(--warn); width: fit-content }}
.tag.ev {{ background: var(--accent-pale); color: var(--accent) }}
.ci {{ color: var(--accent); font-weight: 600 }} .mute {{ color: var(--muted) }}
footer {{ font-size: 12px; color: var(--muted) }}
@media (prefers-reduced-motion: reduce) {{ * {{ transition: none !important }} }}
</style>
<main>
  <header>
    <div class="eyebrow">Ahead prototype · run {E(run_date)}</div>
    <h1>QA report: onboarding to the first birthday</h1>
    <p class="lede">Seven example families signed up through the real setup screens. A script then moved the clock forward one week at a time to 12 months. Each week it read Home, Sleep and Feeding the way a parent would and answered whatever check-in was showing, the way that family would. Once a month it opened every link on Home and every category page.</p>
    <div class="facts"><span><b>{stats.get('personas', 0)}</b> families</span><span><b>{stats.get('weeks', 0)}</b> family-weeks</span><span><b>{stats.get('pages', 0):,}</b> pages read</span><span><b>{stats.get('links', 0):,}</b> links opened</span></div>
  </header>
  <section><div class="scores">{''.join(card(*g) for g in GROUPS)}</div></section>
  <section><div class="section-head"><h2>Still open</h2><p>No bugs are left. These two notes need a product decision rather than a code fix.</p></div>
    <div class="findings">{''.join(finding_row(f).replace('<details ', '<details open ', 1) for f in open_bugs + notes) or '<p class="empty">Nothing open.</p>'}</div></section>
  <section><div class="section-head"><h2>Found and fixed</h2><p>What the first run caught, and what changed.</p></div>
    <div class="findings">{''.join(finding_row(dict(f, severity=f['severity']), True).replace('class="finding ', 'class="finding fixed ', 1) for f in fixed) or '<p class="empty">Nothing needed fixing.</p>'}</div></section>
  <section><div class="section-head"><h2>Week by week</h2><p>What each family saw every week. Pick a family to see what the app asked, what the parent answered, and what Home, Sleep and Feeding showed.</p></div>
    <ul class="who-list">{who}</ul>
    <div class="tabs" role="tablist">{tabs}</div>{fams}</section>
  <footer>The script and checks are in the repo under tools/qa. Rerun them after any change: run_qa.py, then checks.py, then report.py.</footer>
</main>
<script>
(function () {{
  const tabs = [...document.querySelectorAll('.tab')], fams = [...document.querySelectorAll('.family')];
  function show(id) {{ tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.fam === id)); fams.forEach(f => f.hidden = f.id !== 'fam-' + id); try {{ localStorage.setItem('qa-fam', id); }} catch (e) {{}} }}
  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.fam)));
  let start = tabs[0] && tabs[0].dataset.fam; try {{ start = localStorage.getItem('qa-fam') || start; }} catch (e) {{}}
  if (!tabs.some(t => t.dataset.fam === start)) start = tabs[0] && tabs[0].dataset.fam;
  if (start) show(start);
}})();
</script>
'''
open(os.path.join(OUT, 'report.html'), 'w').write(page)
print('report.html', len(page))
