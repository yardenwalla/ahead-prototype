# Ahead · prototype

A clickable prototype of **Ahead**, a baby-roadmap app for first-time parents. The example baby is Maya, 5 months old.

Open `index.html` in a browser. There's no build step and nothing to install. Everything runs from static files, so the repo can also be served with GitHub Pages.

## What's in this version

The app looks and works the same as the previous prototype, with two exceptions: **Sleep** and **Feeding** are rebuilt around the changes a baby goes through rather than a schedule.

- **Stages** sit on the rail at the top and move in order.
  - Sleep: Newborn sleep → Days and nights → Naps find a rhythm → Two naps
  - Feeding: Newborn feeding → Feeds find a rhythm → Getting ready for solids → Starting solids → Textures and finger foods → Family meals
- **Come-and-go phases** appear under "Also common around now" on top of the current stage. Examples: the 4-month sleep regression, separation anxiety, cluster feeding, distracted feeding and teething.
- **Each stage page follows the same order:**
  1. Hero
  2. Must-know card (only when it applies)
  3. Why it's happening
  4. Wake windows, or How much and how often
  5. What helps
  6. Call card
  7. Also common around now
  8. Common questions
  9. Coming up
  10. Link rows and sources
- **Detail screens:**
  - Sleep: safe sleep setup, settling and sleep training, when to ask for help
  - Feeding: milk and formula basics, feeding safety and first aid, introducing allergens, when to ask for help
- **Age suggests stages; parent reports take precedence.** Parents can correct guidance with "Already there?" or "This is where she is now." An explicit first-foods answer stays on Starting solids until eating experience is updated.

## Home rules

Home looks the same as before. `js/home-rules.js` applies the Home recommendation engine spec to the existing components, deciding which rows show and what they say:

- **Reason in each label.** Every row's small label now says why it's there, for example "Sleep · You said Maya is trying to roll" or "Feeding · Most babies start solids around 6 months".
- **Ranking and caps.**
  - Rows are ranked must-know first, then what a parent reported, then dated items, then age-based ones.
  - The main card holds at most 3 rows, one per category.
  - A practical Play activity can earn a main-card slot, within the same three-row cap.
  - "Prepare for next" shows up to 2 coming-up items from categories not already above.
- **Filters and timing.**
  - Feeding rows distinguish the suggested guide from what the parent actually reported. Unknown solids status is labeled as unknown.
  - A checkup moves up from "Prepare for next" only when it's within 14 days.
  - The solids check-in waits until 6 months.
- **Copy updates.** The rows and check-ins have new copy, written to match the content guide.

Call `homeRulesDebug()` in the browser console to see what was shown, what was held back and why.

## When stages move

- **Age provides default guidance.** Development, Play and Health follow their age references. Sleep suggests Two naps at 9 months; Safety respects explicitly selected movement stages and reported abilities. Feeding suggests textures at 8 months and family meals at 10 only after established eating is reported. A first-foods answer remains Starting solids regardless of age.
- **Newborn Sleep and Feeding transition after six weeks**, using actual days for the current baby rather than waiting for the two-month birthday. Monthly previews use the typical stage for that month.
- **One question is left: "Has Maya started solids?"** From 6 months, at most once a month. If nobody answers, it shows for two weeks, then rests until next month. Feeding never moves into solids on age alone, because a wrong guess means advice about allergens and finger foods for a baby who hasn't started.
- **Safety runs ahead of the usual age,** because extra babyproofing is the safe mistake:
  - reaching and rolling from 3 months
  - crawling prep from 5 months
  - babyproofing from 8 months
  - furniture reach from 9 months
  - "Stop swaddling" from 3 months
  - lower the crib mattress before sitting, following its manual; lowest before standing
- **Saved moments count.** Saving "Rolls tummy to back" or "Pulls up to stand" in the timeline moves Safety and changes the labels to "You said…".
- **When Sleep moves to two naps on its own,** a notice says so for three weeks, with a one-tap undo ("Still on three naps?").
- **Parents can always correct a stage.**
  - The Coming up card has "Already there? Move Maya to …".
  - Any other stage they're viewing has "This is where Maya is now" and "← Back to where Maya is now".
- **Navigating between stages** uses the timeline at the top of each category.
  - No Previous/Next links.
  - Coming up cards only in Sleep, Feeding, Safety and Development (each checkpoint points to the next one).
  - Safety's current checklist shows up to 3 unfinished checks from earlier checklists, but only ones the family actually opened. Someone who joins at 8 months is assumed to have done the earlier ones.
- **Which age is used:** adjusted age for everything developmental (until age 2), birthday age for Health. Pages say which one they use.

## QA

The content and personalization regression pass is documented in `docs/content-qa-2026-10-21.md`.
Run `node tools/qa/content-journeys.cjs` for the fast template/handler checks across 100 scripted families and 13 monthly checkpoints. This does not replace browser, editorial or pediatric review.

The latest pre-beta fixes and actual browser checks are documented in `docs/beta-readiness-2026-10-22.md`. Run `node tools/qa/check-all.cjs` (Node 20+) for syntax, local assets and all three regression suites, then `python3 tools/qa/link-check.py` for external URLs. These are scripted checks, not 100 human usability sessions.

The handoff log is `docs/claude-change-log.md`. Setup optionally records he/him, she/her or they/them for baby-specific wording; older profiles use neutral wording. Run `node tools/qa/pronouns.cjs` to check authored copy, verb agreement, persistence and unchanged personal notes.

`tools/qa` plays nine example families week by week from onboarding to 12 months. Each family answers the solids question its own way, and some also save moments or tap “Already there?”. It checks three things: nothing is broken or empty, everything follows the right order and stays useful, and the right personalization appears and disappears. The latest report is in `docs/qa-report.html`.

To rerun it after any change:
1. `python3 tools/qa/run_qa.py` plays the families (takes about 25 minutes).
2. `python3 tools/qa/checks.py` turns the run into findings.
3. `python3 tools/qa/report.py` builds the report.

## Files

| Path | What it is |
|---|---|
| `index.html` | App shell |
| `css/layout.css`, `css/experience.css` | The existing visual identity (unchanged) |
| `css/changes.css` | Styles for the new Sleep and Feeding pages, built only from the app's tokens |
| `js/app.js` | The existing app. Small edits route Sleep and Feeding to the new pages. |
| `js/changes-data.js` | All Sleep and Feeding copy and data. Edit content here. |
| `js/changes.js` | Renders the stage pages and detail screens |
| `js/home-rules.js` | Home rules: which rows show and their reason labels |
| `js/stages.js` | When stages move: weekly re-ask, no-nag rules, Safety moving forward on age, adjusted age labels |
| `js/timeline.js`, `css/timeline.css` | Timeline entries in their category colors; removes the Year Ahead tab (each category's stage rail covers the year) |
| `js/boot.js` | Starts the app after every module has loaded |
| `js/navigation.js` | Browser Back/Forward and reload restoration without putting baby details in URLs |
| `tools/screenshot.py` | Playwright helper for screenshotting app states |

Older Sleep and Feeding routes from the previous prototype redirect to the new pages.

## Editing content

All Sleep and Feeding copy lives in `js/changes-data.js`. Write and review it with the ahead-content-editor skill so terms, tone and chronology stay consistent.

_Prototype. Pediatric review pending._

