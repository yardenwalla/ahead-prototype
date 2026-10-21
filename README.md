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
- **Tracking uses the app's existing check-ins.**
  - Age sets the default stage.
  - Telling Home that Maya is trying to roll shows "Time to stop swaddling" on Sleep.
  - Feeding never moves into solids based on age alone. From 6 months it asks "Has Maya started solids?", and the answer moves the guide.

## Home rules

Home looks the same as before. `js/home-rules.js` applies the Home recommendation engine spec to the existing components, deciding which rows show and what they say:

- **Reason in each label.** Every row's small label now says why it's there, for example "Sleep · You said Maya is trying to roll" or "Feeding · Most babies start solids around 6 months".
- **Ranking and caps.**
  - Rows are ranked must-know first, then what a parent reported, then dated items, then age-based ones.
  - The main card holds at most 3 rows, one per category.
  - Play ideas are nice-to-know, so they stay on their own page.
  - "Prepare for next" shows up to 2 coming-up items from categories not already above.
- **Filters and timing.**
  - Feeding rows follow the new Feeding stages and never assume solids until a parent says so.
  - A checkup moves up from "Prepare for next" only when it's within 14 days.
  - The solids check-in waits until 6 months.
- **Copy updates.** The rows and check-ins have new copy, written to match the content guide.

Call `homeRulesDebug()` in the browser console to see what was shown, what was held back and why.

## QA

`tools/qa` plays seven example families week by week from onboarding to 12 months, answering check-ins the way each family would. It checks three things: nothing is broken or empty, everything follows the right order and stays useful, and the right personalization appears and disappears. The latest report is in `docs/qa-report.html`.

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
| `js/timeline.js`, `css/timeline.css` | Timeline entries in their category colors; removes the Year Ahead tab (each category's stage rail covers the year) |
| `js/boot.js` | Starts the app after every module has loaded |
| `tools/screenshot.py` | Playwright helper for screenshotting app states |

Older Sleep and Feeding routes from the previous prototype redirect to the new pages.

## Editing content

All Sleep and Feeding copy lives in `js/changes-data.js`. Write and review it with the ahead-content-editor skill so terms, tone and chronology stay consistent.

_Prototype. Pediatric review pending._
