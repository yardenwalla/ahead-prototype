"""Turn results.json into findings, in three groups:

  works        nothing broken or empty: errors, empty sections, dead links, back buttons
  order        chronology and value: right stage for the age, never backwards, windows,
               Home caps, reason labels that match the age, nothing stale
  personal     the right personalization at the right time: reported changes show up
               (and go away) on Home and the category pages; check-ins catch real changes
"""
import json, os, re
from collections import defaultdict

OUT = os.path.join(os.path.dirname(__file__), 'out')
SLEEP = ['Round-the-clock sleep', 'Longer nights', 'Three naps', 'Two naps']
FEED = ['Newborn feeds', 'Milk feeds', 'Preparing for solids', 'First foods', 'More textures', 'Family meals']
# Hero eyebrows can use a stage's full name; the timeline uses the short one.
SHORT = {'Newborn sleep': 'Newborn', 'Newborn feeding': 'Newborn', 'Changing milk feeds': 'Milk feeds', 'Getting ready for solids': 'Getting ready', 'Textures and finger foods': 'Textures', 'Naps and bedtime': 'Three naps', 'Two naps a day': 'Two naps'}
WINDOWS = {  # come-and-go phases: months they may appear in
    'The 4-month sleep regression': (3, 5), 'Separation anxiety': (8, 11),
    'Cluster feeding and growth spurts': (0, 2), 'Distracted feeding': (3, 6), 'Teething and feeding': (7, 12)}


def exp_sleep(m, naps=None, adj_weeks=99):
    """Stage rules: age guesses (two naps by 9 months); a parent's answer wins and holds."""
    if adj_weeks < 6.2: return SLEEP[0]
    if m < 4: return SLEEP[1]
    if naps == 'Yes': return SLEEP[3]
    if naps in ('Stay', 'Not yet'): return SLEEP[2]
    return SLEEP[3] if m >= 9 else SLEEP[2]


def exp_safety(m, mv):
    """Safety runs ahead of the usual age; a parent's answer or a saved moment can only move it further."""
    order = ['setup', 'reaching', 'rolling', 'moving', 'pulling']
    age = 'pulling' if m >= 9 else 'moving' if m >= 8 else 'rolling' if m >= 5 else 'reaching' if m >= 3 else 'setup'
    said = {'pulling': 'pulling', 'crawling': 'moving', 'rolling': 'rolling', 'trying': 'rolling'}.get(mv)
    return age if not said or order.index(age) >= order.index(said) else said


def exp_feed(m, food, adj_weeks=99):
    if adj_weeks < 6.2: return FEED[0]
    if m < 4: return FEED[1]
    if food is None: return FEED[2]   # solids stages wait for the parent's answer; the check-in asks
    if food == 'preparing': return FEED[2]
    if food == 'new': return FEED[3]          # first tastes stay until the parent reports more
    if food == 'textures': return FEED[4]
    return FEED[5] if m >= 8 else FEED[4]


class Findings:
    def __init__(self):
        self.items = defaultdict(lambda: dict(weeks=set(), personas=set(), examples=[]))

    def add(self, group, sev, title, persona, week, example=''):
        k = (group, sev, title)
        it = self.items[k]
        it['weeks'].add(week); it['personas'].add(persona)
        if example and len(it['examples']) < 4 and example not in it['examples']:
            it['examples'].append(example)

    def rows(self):
        out = []
        for (g, s, t), v in self.items.items():
            out.append(dict(group=g, severity=s, title=t, personas=sorted(v['personas']), weeks=sorted(v['weeks']), examples=v['examples']))
        order = {'bug': 0, 'warning': 1}
        return sorted(out, key=lambda r: (r['group'], order[r['severity']], -len(r['weeks'])))


def all_home_items(h):
    return [('row', x) for x in h['rows']] + [('action', x) for x in h['actions']] + [('next', x) for x in h['next']]


def check(results):
    F = Findings()
    stats = dict(weeks=0, pages=0, links=0, personas=len(results))
    for r in results:
        p = r['persona']; pid = p['id']
        reported = dict(mv='none', food=None, swaddle_done=False, mattress_done=False, naps=None)
        reask = {}
        notice_weeks = 0
        auto_first = None
        stats.setdefault('checkin_weeks', {})[pid] = sum(1 for w in r['weeks'] if w['home']['checkin'])
        stats.setdefault('page_prompt_weeks', {})[pid] = sum(1 for w in r['weeks'] if w['feed'].get('checkin') and not w['home']['checkin'])
        last_no, solids_seen = None, None
        stats.setdefault('family_weeks', {})[pid] = len(r['weeks'])
        learned = {}
        prev_sleep = prev_feed = -1
        sig_run, last_sig, ci_run, last_ci = 0, None, 0, None
        for w in r['weeks']:
            stats['weeks'] += 1; stats['pages'] += 3; stats['links'] += len(w['clicks'])
            wk, m, dmo = w['week'], w['month'], w['dev']
            where0 = f'{pid} · week {wk} ({m} mo)'
            def apply(answers):
              for a in answers:
                  q, ans = a['q'].lower(), a['a']
                  if q.startswith('unexpected'): F.add('personal', 'bug', 'A question showed that should no longer be asked', pid, wk, f'{where0}: {a["q"]}'); continue
                  if q.startswith('moment:'):
                      if 'pulls up' in q: reported['mv'] = 'pulling'
                      elif 'rolls' in q and reported['mv'] in ('none', 'trying'): reported['mv'] = 'rolling'
                      continue
                  if 'already there: two naps' in q: reported['naps'] = 'Yes'; continue
                  if 'already there: starting solids' in q: reported['food'] = 'new'; continue
                  if 'managing now' in q: reported['food'] = {'First tastes': 'new', 'More textures and finger foods': 'textures', 'Regular meals': 'established'}[ans]; continue
                  if 'mattress' in q: reported['mattress_done'] = True; continue
                  if 'safety check' in q: continue
                  if 'catnap' in q: reported['naps'] = 'Yes' if ans == 'Yes' else 'Not yet'; continue
                  if 'we moved her' in q: reported['naps'] = 'Stay'; continue
                  if 'where she is now' in q: reported['naps'] = 'Yes'; continue
                  if 'finger foods' in q:
                      if ans == 'Yes': reported['food'] = 'established'
                      continue
                  if 'roll' in q and 'swaddl' not in q:
                      reported['mv'] = {'Trying': 'trying', 'Rolling': 'rolling'}.get(ans, reported['mv'])
                  elif 'crawl' in q and ans == 'Yes': reported['mv'] = 'crawling'
                  elif 'pulling up' in q and ans == 'Yes': reported['mv'] = 'pulling'
                  elif 'solids' in q:
                      reported['food'] = {'Not started': 'preparing', 'Not yet': 'preparing', 'First foods': 'new', 'Building meals': 'established', 'Eating meals': 'established'}[ans]
                  elif 'swaddl' in q: reported['swaddle_done'] = True
            apply([a for a in w['answered'] if a['where'] in ('Home', 'Timeline') or a['q'].startswith('Already there: starting')])
            moment_now = any(a['where'] == 'Timeline' for a in w['answered'])   # Home was read before the moment was saved
            def learn():
              for k, v in (('roll_try', reported['mv'] in ('trying', 'rolling', 'crawling', 'pulling')), ('roll', reported['mv'] in ('rolling', 'crawling', 'pulling')),
                           ('crawl', reported['mv'] in ('crawling', 'pulling')), ('pull', reported['mv'] == 'pulling'),
                           ('solids', reported['food'] in ('new', 'established')), ('meals', reported['food'] == 'established')):
                  if v and k not in learned: learned[k] = wk
            learn()

            h = w.get('home_after', w['home']); s = w['sleep']; f = w['feed']
            where = f'{pid} · week {wk} ({m} mo)'

            # ---------- works ----------
            for e in w['errors']: F.add('works', 'bug', f'Script error: {e[:90]}', pid, wk, where)
            for name, pg in (('Home', w['home']), ('Sleep', s), ('Feeding', w['feed'])):
                for pr in pg['problems']: F.add('works', 'bug', f'{name}: {pr}', pid, wk, where)
            for c in w['clicks']:
                tgt = c['to']
                for e in c['errors']: F.add('works', 'bug', f'Tapping a link throws an error ({c["from"]})', pid, wk, f'{where}: {c["onclick"][:60]} → {e[:80]}')
                for pr in c['problems']: F.add('works', 'bug', f'Opens to a broken page: {pr}', pid, wk, f'{where}: from {c["from"]} → {tgt}')
                if not c['backOk']: F.add('works', 'bug', 'Back button leads to an empty page', pid, wk, f'{where}: {c["onclick"][:60]}')

            # ---------- order ----------
            adj_weeks = wk - p.get('early_days', 0) / 7
            es, ef = exp_sleep(dmo, reported['naps'], adj_weeks), exp_feed(dmo, reported['food'], adj_weeks)
            # Babies born early: developmental pages say they use adjusted age
            if p.get('early_days'):
                for name, pg in (('Sleep', s), ('Feeding', f)):
                    if 'adjusted' not in pg.get('header', ''): F.add('order', 'bug', f'{name} doesn’t say it uses adjusted age for a baby born early', pid, wk, f'{where}: “{pg.get("header")}”')
            # Stage rules: with no answer, Sleep follows the age guess quietly; the timeline shows it.
            if s['current'] != es: F.add('order', 'bug', 'Sleep shows the wrong stage for the age', pid, wk, f'{where}: shows “{s["current"]}”, expected “{es}”')
            if f['current'] != ef: F.add('order', 'bug', 'Feeding shows the wrong stage for the age and answers', pid, wk, f'{where}: shows “{f["current"]}”, expected “{ef}”')
            si = SLEEP.index(s['current']) if s['current'] in SLEEP else -1
            fi = FEED.index(f['current']) if f['current'] in FEED else -1
            if si < prev_sleep and reported['naps'] == 'Stay': prev_sleep = si   # the parent chose to stay on three naps
            elif si < prev_sleep: F.add('order', 'bug', 'Sleep stage went backwards', pid, wk, where)
            if fi < prev_feed: F.add('order', 'bug', 'Feeding stage went backwards', pid, wk, where)
            prev_sleep, prev_feed = (si if reported['naps'] == 'Stay' else max(prev_sleep, si)), max(prev_feed, fi)
            for name, pg, lst in (('Sleep', s, SLEEP), ('Feeding', f, FEED)):
                if SHORT.get(pg['eyebrow'], pg['eyebrow']) != pg['current']: F.add('order', 'bug', f'{name} hero doesn’t match the current stage', pid, wk, f'{where}: “{pg["eyebrow"]}”')
                last = pg['current'] == lst[-1]
                if not last and not pg['comingUp']: F.add('order', 'bug', f'{name}: no “Coming up” card before the last stage', pid, wk, where)
                if last and not pg['after']: F.add('order', 'warning', f'{name}: last stage has no “after the first birthday” note', pid, wk, where)
                for ev in pg['events']:
                    lo, hi = WINDOWS.get(ev, (0, 12))
                    if not lo <= dmo <= hi: F.add('order', 'bug', f'{name}: “{ev}” shows outside its usual window', pid, wk, f'{where}')
                when = re.search(r'(\d+)\s*months?$', pg['eyebrow'].replace('–', '-')) or re.search(r'-(\d+)\s*months', pg['eyebrow'].replace('–', '-'))
                if when and int(when.group(1)) + 2 < dmo and not (name == 'Sleep' and reported['naps'] == 'Stay'): F.add('order', 'warning', f'{name}: still on a stage whose usual window ended 3+ months ago', pid, wk, f'{where}: “{pg["eyebrow"]}”')
                if not pg['questions'] and pg['current'] not in ('Milk feeds',): F.add('order', 'warning', f'{name}: no common questions on the current stage', pid, wk, f'{where}: {pg["current"]}')

            cards = h['rows'] + h['actions']
            if not cards and not h.get('close'): F.add('order', 'bug', 'Home is empty and doesn’t say the parent is caught up', pid, wk, where)
            if len(cards) > 3: F.add('order', 'bug', 'Home shows more than 3 cards', pid, wk, f'{where}: {len(cards)}')
            cats = [x['label'].split(' · ')[0] for x in cards]
            if len(cats) != len(set(cats)): F.add('order', 'bug', 'Home shows two cards from the same category', pid, wk, f'{where}: {cats}')
            titles = [x['title'] for _, x in all_home_items(h)]
            if len(titles) != len(set(titles)): F.add('order', 'bug', 'Home shows the same card twice', pid, wk, f'{where}: {titles}')
            for kind, x in all_home_items(h):
                n = re.search(r'Common at (\d+) months?( adjusted)?', x['label'])
                if n and n.group(2) and int(n.group(1)) != dmo: F.add('order', 'bug', 'Reason line names the wrong adjusted age', pid, wk, f'{where}: {x["label"]}')
                if n and not n.group(2) and p.get('early_days') and dmo != m and x['label'].split(' · ')[0] in ('Development', 'Sleep', 'Feeding'):
                    F.add('order', 'bug', 'Reason line uses birthday age for a baby born early', pid, wk, f'{where}: {x["label"]}')
                if n and not n.group(2) and int(n.group(1)) != m: F.add('order', 'bug', 'Reason line names the wrong age', pid, wk, f'{where}: {x["label"]}')
                n = re.search(r'Due at (\d+) months?', x['label'])
                if n and int(n.group(1)) != m: F.add('order', 'bug', 'Checkup says “Due at” the wrong month', pid, wk, f'{where}: {x["label"]}')
                n = re.match(r'(\d+)-month checkup', x['title'])
                if n and int(n.group(1)) < m: F.add('order', 'bug', 'Home shows a checkup for an age already passed', pid, wk, f'{where}: {x["title"]}')
                if re.search(r'\b1 months\b', x['label'] + ' ' + x['title']): F.add('order', 'bug', 'Grammar: “1 months”', pid, wk, f'{where}: {x["label"]}')
                said = re.search(r'You said \w+ (is trying to roll|is rolling|is crawling|is pulling up)', x['label'])
                topic = x['label'].split(' · ')[0]
                if said and topic == 'Development' and not re.search({'is trying to roll': 'roll', 'is rolling': 'roll', 'is crawling': 'crawl|mov', 'is pulling up': 'pull|stand|cruis'}[said.group(1)], x['title'], re.I):
                    F.add('order', 'bug', 'Reason line doesn’t match the card it’s on', pid, wk, f'{where}: {x["label"]} — {x["title"]}')
                if re.search(r'reaching and rolling', x['title'], re.I) and dmo >= 5: F.add('order', 'bug', 'Home suggests an earlier stage’s checklist', pid, wk, f'{where}: {x["title"]}')
                if x['title'] == 'First-week checkup' and wk >= 2: F.add('order', 'bug', 'First-week checkup still showing after the first weeks', pid, wk, where)
                if 'Rolling is starting' in x['label'] and reported['mv'] != 'trying': F.add('order', 'bug', '“Rolling is starting” shows when the parent hasn’t said so', pid, wk, f'{where}')
            sig = json.dumps([titles, (h['checkin'] or {}).get('q')])
            sig_run = sig_run + 1 if sig == last_sig else 1; last_sig = sig
            if sig_run == 7: F.add('order', 'warning', 'Home unchanged for 7+ weeks in a row', pid, wk, f'{where}: {titles}')

            # ---------- personal ----------
            mv = reported['mv']
            # Stop swaddling comes before rolling: from 3 months on age, or sooner if a moment says she's rolling
            swaddle_due = (mv in ('trying', 'rolling') or dmo >= 3) and dmo <= 6 and not reported['swaddle_done']
            home_sw, sleep_sw = w['home']['swaddle'], any('swaddl' in a['title'].lower() for a in s['alerts'])
            if swaddle_due and w.get('home_after'): home_sw = w['home_after']['swaddle']
            if swaddle_due and not home_sw: F.add('personal', 'bug', 'From 3 months, Home doesn’t show “stop swaddling”', pid, wk, where)
            if swaddle_due and not sleep_sw: F.add('personal', 'bug', 'From 3 months, Sleep doesn’t show “stop swaddling”', pid, wk, where)
            exs = exp_safety(dmo, mv)
            if w.get('safety') and w['safety'] != exs: F.add('order', 'bug', 'Safety is on the wrong stage for the age and moments', pid, wk, f'{where}: “{w["safety"]}”, expected “{exs}”')
            if reported['swaddle_done'] and (sleep_sw or w['home']['swaddle']) and not any('swaddl' in a['q'].lower() for a in w['answered']):
                F.add('personal', 'bug', '“Stop swaddling” comes back after it was marked done', pid, wk, where)
            if dmo < 3 and mv == 'none' and (sleep_sw or home_sw):
                F.add('personal', 'bug', '“Stop swaddling” shows before 3 months', pid, wk, where)
            text_home = ' '.join(x['label'] + ' ' + x['title'] for _, x in all_home_items(h)).lower()
            for _, x in all_home_items(h):
                said_mv = re.search(r'You said \w+ is (crawling|pulling up|rolling|trying to roll)', x['label'])
                if said_mv and {'crawling': ('crawling', 'pulling'), 'pulling up': ('pulling',), 'rolling': ('rolling', 'crawling', 'pulling'), 'trying to roll': ('trying',)}[said_mv.group(1)] and mv not in {'crawling': ('crawling', 'pulling'), 'pulling up': ('pulling',), 'rolling': ('rolling', 'crawling', 'pulling'), 'trying to roll': ('trying', 'rolling', 'crawling', 'pulling')}[said_mv.group(1)]:
                    F.add('personal', 'bug', 'Home claims the parent said something they didn’t', pid, wk, f'{where}: {x["label"]}')
            if mv in ('crawling', 'pulling') and not moment_now and (h['rows'] + h['actions']) and not re.search(r'crawl|stair|gate|move|pull|mattress|^safety|\ssafety', text_home):
                F.add('personal', 'bug', 'Said she’s crawling, but nothing on Home reflects it', pid, wk, where)
            if (mv == 'pulling' or dmo >= 8) and not reported['mattress_done']:
                if not any('mattress' in a['title'].lower() for a in s['alerts']): F.add('personal', 'bug', 'From 8 months (or a pulling-up moment), Sleep doesn’t show the mattress step', pid, wk, where)
                if 'mattress' not in text_home and not moment_now: F.add('personal', 'bug', 'From 8 months (or a pulling-up moment), Home doesn’t show the crib mattress step', pid, wk, where)
            vit = any('vitamin d' in a['title'].lower() for a in f['alerts'])
            if f['current'] == FEED[0]:
                if p['feed'] != 'Formula' and not vit: F.add('personal', 'bug', 'Nursing newborn, but no vitamin D reminder', pid, wk, where)
                if p['feed'] == 'Formula' and vit: F.add('personal', 'bug', 'Formula-fed baby gets the vitamin D reminder', pid, wk, where)
            if f['current'] == FEED[4] and not any('choking' in a['title'].lower() for a in f['alerts']):
                F.add('personal', 'warning', 'Eating finger foods, but no choking-hazards alert', pid, wk, where)
            if (reported['food'] == 'preparing' or (reported['food'] is None and dmo < 6)) and re.search(r'starting solids|first foods|textures|allergen|finger', text_home):
                F.add('personal', 'bug', 'Home shows solids content before the parent said solids started', pid, wk, f'{where}: {text_home[:120]}')
            for x in h['rows']:
                if x['label'].startswith('Feeding') and reported['food'] in ('new', 'established') and 'You said' not in x['label'] and 'started solids' not in x.get('body', '') and not any(a['q'].startswith('Already there: starting') for a in w['answered']):
                    F.add('personal', 'warning', 'Feeding row doesn’t mention what the parent told us', pid, wk, f'{where}: {x["label"]}')
            apply([a for a in w['answered'] if a['where'] not in ('Home', 'Timeline') and not a['q'].startswith('Already there: starting')]); learn()
            # Only one question remains (solids), at most once a month
            hq = (w['home']['checkin'] or {}).get('q')
            asked_here = [q for q in (hq, w['sleep'].get('checkin'), w['feed'].get('checkin')) if q]
            for q in asked_here:
                # Stage rules allow the naps question (from 6 months on Three naps) and "outgrown" questions; movement questions stay off.
                if re.search(r'roll|crawl|pull', q, re.I) and not re.search(r'Move Safety to', q): F.add('personal', 'bug', 'A movement question still shows', pid, wk, f'{where}: “{q}”')
            solids_q = any('solids' in q for q in asked_here)
            if solids_q and last_no is not None and wk - last_no < 4 and not any('solids' in a['q'] and a['a'] == 'Not yet' and wk == last_no for a in w['answered']):
                F.add('personal', 'bug', 'Solids question came back within a month of “Not yet”', pid, wk, f'{where}: answered week {last_no}')
            if not p.get('silent') and last_no is not None and not solids_q and wk - last_no > 6 and f['current'] in (FEED[2], FEED[3]) and reported['food'] in (None, 'preparing'):
                F.add('personal', 'warning', 'Solids question didn’t come back within 6 weeks', pid, last_no, f'{pid}: “Not yet” in week {last_no}'); last_no = wk
            for a in w['answered']:
                if 'solids' in a['q'] and a['a'] == 'Not yet': last_no = wk
                if a['where'] == 'Home' and hq == a['q'] and w.get('home_after') and (w['home_after']['checkin'] or {}).get('q') == a['q']:
                    F.add('personal', 'bug', 'Question asked again right after it was answered', pid, wk, f'{where}: “{a["q"]}”')
            qs = [a['q'] for a in w['answered'] if a['a'] in ('Not yet', 'Yes', 'Trying', 'Rolling', 'First foods', 'Not started', 'Eating meals', 'Building meals')]
            norm = lambda q: 'solids' if 'solids' in q else 'catnap' if 'catnap' in q else q
            if len(qs) != len(set(map(norm, qs))): F.add('personal', 'warning', 'Asked the same question twice in one week (Home and a category page)', pid, wk, f'{where}: {qs}')
            if any(re.search(r'We moved|two-nap guidance', a['title'], re.I) for a in s['alerts']):
                notice_weeks += 1
                if notice_weeks == 5: F.add('personal', 'bug', '“We moved her to two naps” notice stays longer than a month', pid, wk, where)
            ci = (w['home']['checkin'] or {}).get('q')
            ci_run = ci_run + 1 if ci and ci == last_ci else (1 if ci else 0); last_ci = ci
            if ci_run == 6: F.add('personal', 'warning', 'Same check-in shown 6+ weeks in a row', pid, wk, f'{where}: “{ci}”')

        # How quickly did the app learn about real changes?
        if not p.get('silent'):
            for k, label in (('solids', 'starting solids'),):
                tw = max(p[k], p.get('join', 0))
                if tw > 52: continue
                lw = learned.get(k)
                if k == 'roll_try' and p.get('join', 0) > p['roll']: continue
                if k == 'roll' and p.get('join', 0) > p['roll']: continue
                if lw is None: F.add('personal', 'bug', f'Never asked about {label}, so it never personalized', pid, tw, f'{pid}: {label} at week {tw}')
                elif lw - tw > 5: F.add('personal', 'warning', f'Took {lw - tw} weeks to find out about {label}', pid, tw, f'{pid}: happened week {tw}, learned week {lw}')
    return F.rows(), stats


if __name__ == '__main__':
    import sys
    src, dst = (sys.argv[1:3] + ['results.json', 'findings.json'][len(sys.argv[1:3]):])
    res = json.load(open(os.path.join(OUT, src)))
    rows, stats = check(res)
    json.dump(dict(findings=rows, stats=stats), open(os.path.join(OUT, dst), 'w'), ensure_ascii=False, indent=1)
    print(stats)
    for r in rows:
        print(f"[{r['group']:8s}] {r['severity']:7s} {r['title']}  — {','.join(r['personas'])} · {len(r['weeks'])} wks · e.g. {r['examples'][:1]}")

