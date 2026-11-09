# Browser checks

These drive the real app in a phone-sized browser. They complement `tools/qa/check-all.cjs`, which runs without a browser.

Serve the app first, from the repo root: `python3 -m http.server 8765`. Then run these from this folder:

| Script | What it answers | Time |
|---|---|---|
| `tap_audit.py [outdir] [Family]` then `tap_report.py [outdir]` | Does every button and link, on every page, for six families, work and land on the page its words name? | ~10 min per family; run all six together |
| `follow_through.py [name filter…]` | After each save, answer or Undo, did the change show up everywhere the confirmation promises, and nowhere it shouldn't? | ~3 min |
| `everyone.py OUT` then `everyone_report.py OUT` | Every combination of family (age, milk set-up, pronouns, named or not, born early, answers), crawled page by page, with automatic flags for wording and display problems. `OUT/texts.json` holds every page's words for the editorial read. | ~20 min |
| `phone_conditions.py OUT` | The key tasks at 320–430px wide, normally and inside a locked-down frame like the Claude app's file viewer. | ~3 min |
| `page_text.py out.json` on the old and the new version, then `layout_guard.py old.json new.json` | Which pages changed layout? (Proves a words-only change touched no layout.) | ~3 min each |

`follow_through.py` holds the list of every save a parent can make. Add one whenever the app gets a new save, answer, toggle or toast button.
