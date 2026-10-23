# Recommendation acceptance review for the small beta

## Standard

For each recommendation: can a first-time parent understand why it appears, identify a useful next action, recognize whether it is for now or preparation, and see a meaningful response to information they report?

Reviewed the default monthly entry surfaces from newborn through month 12: Home and all six categories (91 combinations), plus the linked stage guides, checklists and decision support. Added a separate executable recommendation contract suite across 312 age, prematurity, milk and solids states. The review uses the current pre-beta branch; it does not replace the prototype with a new layout.

## Editorial decisions and fixes

| Area | Finding | Change / acceptance decision |
| --- | --- | --- |
| Home preparation | A distant checkup could enter Prepare for next even though it was more than a month away. | Both default and saved appointments must be within 35 days to enter that section. The full Health rail and saved appointment remain available. A passed saved date remains pending until explicitly completed. |
| Home applicability | Stair-gate context was overwritten with a generic safety reason. | The task now says “If your home has stairs · Before baby reaches them.” Doesn’t apply carries into Safety and removes that task from Home. |
| Home completion | A resolved checklist could still be promoted as preparation or a rolling reference. | Filter recommendations by the unfinished work at their actual destination. Completed checklists remain available as references in Safety. |
| Home milk answer | Choosing milk could leave a stale reference selected; the generic Home row did not reflect the choice. | Reset the reference when milk is answered. Early milk rows use the relevant milk wording. An answer just given earns a Home slot; the destination shows the matching reference. |
| Feeding start | The Home recommendation promised help offering food, but the Starting solids page largely began with allergens and meal cues. | First in What helps is “Make one food manageable,” covering mashed/puréed food, soft self-feeding food and using both. A direct CDC preparation-example link provides the next level of detail. No fixed first ingredient or duplicate food FAQ is added. |
| Combination feeding | The combined reference retained a whole-day bottle ceiling alongside nursing. | The combined view shows a bottle-only feed amount; the all-bottle reference retains its daily guidance. |
| Late first foods | Staying on first foods was appropriately supported, but there was no connection to the age-relevant checkup. | At 9 months or later, an explicit Not yet or First foods answer offers a compact checkup-questions link about readiness, iron and texture progression. Unknown status is not treated as proof of a delay. No new reminder appears for established eating. |
| Milk questions | Bottle-refusal advice assumed the parent was nursing, including formula-only families. | The question and responses now distinguish accepting a bottle from another caregiver versus refusing whoever offers, without assuming nursing. |
| Newborn timing | The call-for-help line applied a six-wet-diaper expectation without the day-of-life qualification. | The line distinguishes the early days and qualifies the six-diaper expectation after day 5. |
| Sleep relevance | The two-nap guide still taught dropping the catnap at 12 months. | From 10 months, the guide focuses on short/missed naps and disruptions while retaining the two-nap metrics, sample day and optional settling support. Earlier guidance retains transition tips. Reporting a current nap count is not treated as a newly dated transition. |
| Sleep completed work | The newborn setup promotion remained after every item was checked. | Completed setup stops being promoted; the safe-sleep reference remains. A reported rolling attempt takes priority over the generic newborn setup. |
| Saved sitting | Saving sitting updated the record but did not trigger crib guidance before the age default. | A reported unsupported-sitting skill triggers the lower-mattress instruction in Home and Sleep. Completing the instruction clears the action without inventing pulling-up. |
| Correcting movement | An earlier stage override could survive a correction made in Baby’s updates. | The latest explicit movement choice replaces that override, including corrections to an earlier stage. |
| Development preparation | A 5-month parent was prompted about the 9-month guide as Coming up. | Distant preparation cards are suppressed. Every reference age remains available in the top rail. |
| Health consistency | A suggested question used “screening” while the surrounding guide calls the parent-facing tool a questionnaire. | “What did the development questionnaire tell us?” |

## Category acceptance matrix

| Category | Why it is relevant | Useful action | Timing and reported-information response |
| --- | --- | --- | --- |
| Home | Age-based summaries say Likely around now; reported facts and appointments have separate reason labels. | Open the corresponding guide, finish a specific task, or answer a relevant check-in. | Three current recommendations and at most two preparation items; approximately one month for checkups. Completed/not-applicable tasks leave the action list. Not every answer must displace higher-priority work: its category guidance still changes. |
| Development | Reference ages and recognizable skills explain the stage without declaring every skill is due today. | See an example, try supportive play, or save a noticed skill and date. | Saving is optional; unsaved is unknown rather than missing. Mobility records update related guidance; unrelated milestones remain memories rather than changing unrelated care. |
| Play | Each idea states the skill/practice it supports and provides instructions and adaptations. | Try one of six monthly activities, with four initially visible. | Age selects the collection. Reported crawling/pulling-up can substitute a suitable movement activity. Reading or doing play is not required to unlock later skills. |
| Sleep | The age stage explains patterns; movement-based setup changes are distinct from settling choice. | Read the age snapshot, follow a timely setup instruction, or choose practical settling support. | Nap-count choices change the stage and matching sample; movement reports change setup guidance. Optional settling choices change support without asserting clinical progress. Completed setup is not new work. |
| Feeding | Milk reference, readiness and eating experience have separate roles. | Understand milk feeds, prepare for solids, offer manageable first food, or build eating skills. | Milk choice changes references; Not yet, First foods and Eating meals change guides. First foods is not advanced solely because the baby is older. Later-starting families get a relevant checkup connection. |
| Safety | A stage explains the next reachable environment and preparation context. | Complete or mark a check not applicable; open practical installation help. | Checklist IDs and progress carry forward once. Reported movement changes guidance and play; a guide suggested by age does not become a reported ability. |
| Health | A specific well visit names the exam, vaccines and decisions it covers. | Review checks/vaccines, save a question or note, record a date, and mark a visit complete. | Appointment dates influence Home timing; attendance advances the current visit. Notes are retained but are not automatically interpreted as a new feeding plan or medical fact. |

## Automated evidence

`node tools/qa/check-all.cjs` includes the new `recommendation-quality.cjs` suite. This suite verifies 312 states, 819 recommendation destinations and 8,205 contracts, including:

- Every emitted recommendation has a reason and a useful destination or specific completion action.
- Home caps and one-row-per-category rules remain intact.
- Preparation excludes checkups outside 35 days, including boundary cases at 35 and 36 days.
- Milk and solids answers visibly change the appropriate content.
- Sitting and pulling-up records change the relevant category guidance; pulling-up also changes Play.
- Done and Doesn’t apply persist across Home and Safety; completed work is not promoted again.
- Later Development references remain navigable without becoming distant homework.
- Current nap-count reports are not interpreted as a newly dated transition.

The existing 100-family chronological suite and pronoun suite also pass. Updated route-test results are in `tools/qa/out/beta-readiness.json`; the new suite's summary is `tools/qa/out/recommendation-quality.json`. These are scripted contract checks, not human usefulness ratings.

## Actual browser observations

With a newly set-up nine-month test baby in Chrome: Home displayed the conditional stair-gate label; choosing Doesn’t apply replaced it with the next unfinished task; First foods opened Starting solids rather than textures; the new food-preparation content and late-starter checkup link were present; the checkup link opened the relevant Health questions; and completing the crib action removed it from Home, making room for the reported first-foods recommendation. Reload retained the state and corrected Health wording.

## Result and boundaries

The reviewed recommendation paths meet the small-beta reason/action/timing/response standard after these fixes. That is an editorial acceptance decision supported by executable behavior checks, not proof that every parent will find every line useful. Parents still need to validate comprehension and value in the beta; native mobile-browser and pediatric review remain separate outstanding work. No accounts, caregiver sharing, new tracking requirements or design-system changes were introduced.

Clinical wording references checked for this pass:

- CDC food preparation: https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html
- AAP early milk-intake signs: https://www.healthychildren.org/English/ages-stages/baby/breastfeeding/Pages/How-to-Tell-if-Baby-is-Getting-Enough-Milk.aspx
- Existing AAP crib-height and sleep guidance linked in the preceding beta-readiness report remains the basis for the movement and sleep setup rules.
