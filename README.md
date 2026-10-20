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

## Files

| Path | What it is |
|---|---|
| `index.html` | App shell |
| `css/layout.css`, `css/experience.css` | The existing visual identity (unchanged) |
| `css/changes.css` | Styles for the new Sleep and Feeding pages, built only from the app's tokens |
| `js/app.js` | The existing app. Small edits route Sleep and Feeding to the new pages. |
| `js/changes-data.js` | All Sleep and Feeding copy and data. Edit content here. |
| `js/changes.js` | Renders the stage pages and detail screens |
| `js/boot.js` | Starts the app after every module has loaded |
| `tools/screenshot.py` | Playwright helper for screenshotting app states |

Older Sleep and Feeding routes from the previous prototype redirect to the new pages.

## Editing content

All Sleep and Feeding copy lives in `js/changes-data.js`. Write and review it with the ahead-content-editor skill so terms, tone and chronology stay consistent.

_Prototype. Pediatric review pending._
