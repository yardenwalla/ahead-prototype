# Follow-up: prevent stalled Safety and Feeding journeys

This corrects two progression defects identified after the prior QA pass. It supersedes the earlier acceptance reports wherever they describe a parent-selected movement stage stopping preparation or first-food guidance having only an Already there route forward.

## Safety

- Keep **reported movement** separate from the **preparation guide**.
- Select the preparation guide from the further-ahead of age-based preparation and reported/explicitly chosen movement. An old first-roll record cannot freeze it at rolling.
- A parent who reported rolling at five months receives mobile babyproofing on Home at eight months and higher-reach preparation at nine months, without reporting crawling or pulling up.
- Use preparation wording when the skill has not been reported. Play uses reported movement, so a future safety guide does not silently insert standing play.
- Keep existing checklist IDs and completion/not-applicable states. Do not ask the family to check completed items twice. Earlier unfinished work remains accessible using the existing carry-forward rules.
- Correcting baby's movement changes the recorded ability. It does not cancel age-appropriate preparation.

## Feeding

- Keep the initial solids question for unknown status or Not yet.
- After First foods, ask **“What is [name] managing now?”** with **First tastes / More textures and finger foods / Regular meals**.
- Offer the follow-up after 28 days since the last feeding answer, on Home and in the current Feeding guide. Answering or skipping is shared across both places; existing quiet-period rules remain.
- First tastes retains Starting solids. More textures selects Textures and finger foods. Regular meals selects Family meals from ten months; before that, it uses the earlier eating-skills guide and progresses with age.
- Textures is now a distinct saved experience. It is not treated as a report of established meals, nor automatically advanced to family meals at a later birthday.
- Never treat the answer date as the date solids actually started. Time creates a prompt, not a claim about readiness or eating ability.
- Legacy First foods answers without dates can receive the progression question immediately. Newly reported first foods are not asked again immediately.
- Baby's updates and the stage rail remain available for deliberate changes. A new explicit answer clears an obsolete Feeding guide override.

## Why the previous checks missed this

Earlier checks verified that a saved answer survived age changes. That was insufficient: they accepted a frozen preparation guide and did not require a visible way for feeding guidance to advance later. Those assertions now distinguish facts from preparation. A separate suite deliberately saves information once and then stops answering, reloading real persisted app state each month.

## Verification

`node tools/qa/check-all.cjs` runs five suites, including `progression-followups.cjs`:

- 100 additional scripted families, each visiting all 13 monthly checkpoints from newborn to month 12.
- 1,300 persisted monthly checkpoints, 445 prominent feeding follow-ups and 7,224 assertions.
- Term and early-born babies, solids reported at six through nine months, and a first roll saved once.
- Continued safety preparation on Home; no invented movement or standing play.
- Visible feeding follow-ups for otherwise frozen users, late starters, texture/meal answers, reload, the 27/28-day boundary, skipped questions, old records without dates, and explicit corrections.
- All existing suites still pass. Current route-check results are in `tools/qa/out/beta-readiness.json`; this suite's result is in `tools/qa/out/progression-followups.json`.
- All 126 extracted external URLs remain reachable.

Actual Chrome verification used an isolated local QA sample of a nine-month baby with a saved roll and First foods answered 35 days earlier. Home showed the prominent progression question and mobile babyproofing. Choosing More textures changed Home wording and opened the correct texture guide; the question disappeared. Safety showed Prepare for pulling up and the babyproofing checklist while the only recorded movement remained rolling. The QA seeding page is local preview scaffolding and is not included in the app or PR.

These are product progression fixes. They do not add new clinical deadlines, a solids-start tracker, onboarding questions or a new visual treatment. Scripted scenarios are not real-parent usability or pediatric review.
