# Content and personalization QA · October 21, 2026

Scope: Home and all six categories, newborn through 12 months. Preserve existing CSS, illustrations, page layouts, rails, completion controls and disclosures. This pass fixes copy and the state/ranking errors that made it inconsistent.

## Changes

| Area | Finding | Resolution |
| --- | --- | --- |
| Home | Improved monthly introductions could be replaced with category-navigation copy after a movement answer. | Monthly and movement summaries describe baby, practical implications and preparation. The agreed 3-, 6- and 8-month introductions are retained. |
| Home and Development | A five-month "Not yet" answer could inherit the age-based safety stage and become "You’ve noticed rolling." | Development claims use reported movement. Anticipatory safety guidance stays separate from observed abilities. |
| Home and Feeding | A parent who reported first foods could be labeled as having reported meals after the guide advanced by age. | "You said" wording follows the saved answer; suggested guide and food history remain distinct. |
| Home and Sleep | The age-based two-nap guide sounded like confirmed progress. | Labels describe the suggested guide; the parent can retain the three-nap guide. |
| Home and Health | Most checkup rows were generic; saved earlier appointments could disappear. The day-distance calculation rounded milliseconds before converting to days. | Shared visit-specific summaries, date math rounded in days, saved appointments retained until marked attended. |
| Home preparation | Undated references could displace a checkup in the next month. | A checkup within 35 days earns priority within the existing two-item preparation cap. |
| Home and Play | All activities were excluded as "nice to know." | A stage-appropriate activity can earn one of the same three Home slots. The activity links directly to its instructions. |
| Home and Safety | Reasons referenced rolling even when the checklist was for more mobile babies. | Reasons name the preparation or the actual reported movement. |
| Health | Main visit descriptions still used vague older copy. | Home and Health share the same checkup summary; link descriptions and selected exam titles use plain language. Existing visit, vaccine, questions and notes pages remain. |
| Sleep | Early settling routes introduced training methods; routine descriptions implied every baby follows a schedule. | Under-four-month settling guidance offers cues and a short routine; later training remains optional. Routine descriptions allow variability. |
| Sleep metrics | An early-stage example sequence was counted as a full day's two naps. | The early day/night stage shows "Varies" for nap count; later full-day examples keep their actual nap counts. |
| Sleep and Feeding checklists | Fresh state had some items checked by default. | Fresh checklists start unchecked. A genuinely new setup resets the new-module example progress; edits to an existing profile preserve it. Existing explicitly saved progress is retained. |
| Feeding | Texture guidance assumed every family started with spoonfuls; unknown solids status sounded overdue. | Copy supports purées, self-feeding or both, and asks the same neutral status question at later ages. |
| Feeding | The 10–11-month meal guide inherited a 16–24 oz bottle value used for later milk guidance. | Its under-one milk reference is separated from the after-one value. Individual feeding plans still take precedence. |
| Feeding references | Bottle leftovers used one ambiguous timing rule; choking was described as invariably silent. | Separate formula and breast-milk timings; choking wording includes ineffective cough or breathing difficulty even with some sound. |
| Safety reports | Selecting pulling up also recorded crawling and rolling. | Only the selected ability is recorded. |

## Verification

`node tools/qa/content-journeys.cjs` loads the production scripts in their actual order with a lightweight DOM stub. It runs 100 scripted families through 13 monthly checkpoints, including different milk types, early birth, unanswered questions, later solids, movement answers and nap preferences. It renders all categories, linked skill/activity/checkup screens, every Sleep/Feeding stage and event, and every conditional FAQ answer branch.

Assertions cover populated templates, broken interpolation, Home caps, truthful reported-history labels, browsing without recording skills, date ranking, attended checkups, default checklist progress and early settling support. Additional targeted handler checks cover new setup and an eight-month late joiner. All modified JavaScript files pass `node --check`.

Recorded result: 100 families, 1,300 monthly checkpoints, 64,503 template renders, 33,240 linked-route renders and 135,302 passing assertions. These counts include repeated renders for different states; they are not counts of unique screens or independent users.

## Source checks for changed clinical wording

- [CDC · Formula preparation and storage](https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/preparation-and-storage.html)
- [CDC · Breast milk storage](https://www.cdc.gov/breastfeeding/breast-milk-preparation-and-storage/handling-breastmilk.html)
- [MedlinePlus · Infant choking](https://medlineplus.gov/ency/article/000048.htm)
- [AAP · Sample menu, 8–12 months](https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/sample-one-day-menu-for-an-8-to-12-month-old.aspx)
- [CDC · Cups and eating skills](https://www.cdc.gov/infant-toddler-nutrition/mealtime/fingers-spoons-forks-and-cups.html)
- [AAP · Infant sleep](https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx)

## Limits and retained product decisions

This is scripted template/handler QA and an editorial pass, not 100 human reviews, a browser visual assessment or clinical approval. External links were not exhaustively tested. The older browser QA report is a separate historical run.

Age can still recommend a later feeding guide after solids have begun; it does not establish that the baby has mastered its skills. Sleep still offers two-nap guidance by age with an option to keep the earlier guide. These existing progression choices were preserved.

Existing legacy checklist records do not contain enough history to distinguish an old example checkmark from an intentional completion. This patch fixes fresh defaults and new setups without erasing saved user progress.

No CSS or illustration changes. No merge or production deployment is part of this pull request.
