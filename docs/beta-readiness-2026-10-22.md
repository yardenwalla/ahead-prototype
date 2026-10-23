# Ahead: pre-beta QA and fixes

Completed 22 October 2026. This pass checks functionality, chronological guidance and content usefulness across the first year. It preserves the existing visual identity and category structure.

## Source and coordination

Changes are based on main at `6b02109a4fba5bdf8829db29f59c14057537ec85`. Claude's intervening copy fixes are retained, including the stocked changing spot, US-practice wording, two-nap notice and “Measles, mumps and rubella.” This report supersedes the earlier QA report for the changed behavior below; historical reports are not evidence of the current build passing.

## Findings fixed

| Area | Problem found | Result |
| --- | --- | --- |
| Saved guides | New Sleep and Feeding guide bookmarks could reopen through old routes. | Bookmarks reopen the correct stage; existing legacy saved routes remain supported. |
| Browser navigation | Browser Back, Forward and reload did not consistently preserve the app view. | View history now follows in-app navigation. Reload retains the guide and preview month. A current-age view advances after the next birthday; an intentional preview stays a preview. Baby details and notes are not put in URLs. |
| Setup navigation | Native Back could lose typed setup answers. | Moving back and forward between the two setup steps retains the draft fields and milk choice. Reload of an unfinished setup restarts the short form. |
| Profile records | Correcting a birthday could detach notes, visits and checklist progress because storage used the birthday as identity. | Stable profile IDs preserve records through edits. Legacy profiles retain their existing storage key. A new baby with the same birthday does not inherit the previous baby's data. |
| Initial render | Static sample Home could flash before the real profile loaded. Invalid stored dates could break rendering. | A compact loading state precedes initialization. Invalid saved profiles recover to Welcome without deleting the old stored records. Date validation also runs when forms submit. |
| Month browsing | Some recommendation code used the baby's live age while viewing another month. Home and category stage calculations could disagree. | Selected-month guidance and Home use the same stage rules. Browsing does not record abilities or completion. |
| Six-week transition | Newborn guidance could remain until the two-month birthday. | Live Sleep and Feeding guidance use the actual six-week boundary, including adjusted age where applicable. |
| Feeding progression | A baby only beginning solids at an older age could be advanced to textures or meals automatically. | An explicit first-foods answer keeps Starting solids until the parent reports more experience. Established eating can still use age to suggest the next guide. An elapsed age range is replaced by “Next step · When baby is ready.” |
| Movement progression | Age defaults could override an explicitly selected earlier movement stage. | Reported abilities and explicit stage choices take precedence over age suggestions. Reporting pulling up does not fabricate crawling or rolling. |
| Home repetition | An old rolling report could dominate later monthly summaries indefinitely. | Movement-specific summaries use recent recorded changes; later months return to the monthly overview. The 8-month intro now focuses on purposeful exploration rather than repeating earlier toy-passing. |
| Prematurity | Home labels did not describe every category that used adjusted age; a 6-month solids intro could overwrite a younger adjusted-age summary. | Labels match the actual developmental guidance; Health retains birthday age. The chronological-age solids override no longer replaces the adjusted-age summary. |
| Safety context | A proactive checklist could look like a late or incorrectly named current task, especially for older joiners. | One “Your babyproofing checklist” carries progress forward. Its context explains preparing before crawling, a baby already on the move, or higher reach. No second copy of the checklist was added. |
| Safety links | Sleep-space links could land on a generic page instead of the relevant instruction. The old professional-directory URL returned an error. | Rolling and mattress links target the actual reference sections. The childproofer link uses the working IAFCS-operated directory. |
| Crib guidance | A universal middle mattress setting did not fit every crib. | Guidance follows the manufacturer's settings, lowering before sitting and using the lowest setting before standing. A timely earlier reminder is available. |
| Sleep support | A generic methods page did not provide a useful next step for families already trying or maintaining a routine. | One compact entry opens a persistent guide selector: compare methods, support while trying, maintain a routine, or settle with help. These show different practical guidance. Under four months, the page provides early settling support without training options. |
| Method comparison | The comparison needed the established illustrated treatment and a complete evidence-based option set. | The existing carousel presents Ferber, Chair, Pick up/put down, Cry it out and Bedtime fading, each with its own resource. No ranking of “gentlest” or guaranteed result is added. |
| Milk reference | Cycling a button obscured the available references. Combination feeding could show two ambiguous Milk rows or stack full bottle targets on top of nursing. | A labeled select makes the references explicit. Nursing and Bottles have distinct labels; a combined reference avoids double daily-feed counts and explains that bottle amounts depend on nursing. Changing milk type resets the reference choice. |
| Milk basics | Formula-only families saw breast-milk storage and pumping material, and vice versa. Some timing and supplement wording lacked precision. | Content and sources follow the selected milk type. Thawed storage is timed from fully thawed; leftovers have separate formula/breast-milk timing. Vitamin D wording distinguishes under-one and over-one needs and the formula threshold. Prescribed feeding plans take precedence over general formula guidance. |
| Solids wording | Readiness and texture progression could imply spoon feeding had to come first. Allergy-prevention wording was too broad. | Readiness uses offered food, and texture progression supports spoon feeding, self-feeding or both. Prevention language specifically identifies peanut and well-cooked egg. Relevant sources are available in the detail guides. |
| Play variety | Month 2 repeated the earlier activities instead of providing enough new ideas. | Six distinct month-2 activities now have full instructions, developmental context, variations and matching visuals. All monthly activity destinations and data were checked. |
| Accessibility | Some navigation announced “Back to Back.” | The accessible name is simply “Back” when the destination has no specific label. |

## Validation

Run locally with Node 20 or later:

```sh
node tools/qa/check-all.cjs
python3 tools/qa/link-check.py
```

The Node runner validates JavaScript syntax and local asset references, then runs:

`.github/workflows/qa.yml` runs these dependency-free app checks on pull requests and changes to main. External HTTP checks remain a separate command so temporary third-party outages do not block app changes. Local passing results below do not imply that the new GitHub workflow has already run.

| Suite | Coverage | Result |
| --- | --- | --- |
| Chronological journeys | 100 scripted families, 13 monthly checkpoints each, 64,503 template renders, 33,240 linked routes | 135,302 checks passed |
| Pronouns | Authored wording, three pronoun choices, legacy profiles, persistence and unchanged personal notes | 1,584 checks passed across 419 renders |
| Beta readiness | Stage permutations, navigation handlers, browser-history model, saved guides, profile identity, invalid data, six-week boundary, monthly activity data and explicit-vs-inferred answers | 227,171 checks passed; 10,383 renders and 9,107 handler destinations; zero failures |
| External URLs | 126 unique URLs extracted from rendered app states | 126 reachable; zero missing or unverified in this run |

The 100 families are scripted scenarios, not human participants. Template rendering and a browser-history model do not replace real browser testing. Reachable external URLs are an HTTP check, not an endorsement of every page or proof its content will never change. Link results are cached for an hour; use `--fresh` to recheck all URLs.

### Actual browser checks

Using the updated local app in Chrome:

- Completed the redesigned setup with a new test baby and formula feeding; browser Back/Forward retained the form and choice.
- Opened Sleep, used the method carousel, selected support while trying, and reloaded. The selected guide and page persisted. Browser Back returned to Sleep.
- Saved a stage guide and reopened it through Saved guides. In-app Back returned to Saved.
- Saved a 6-month appointment note, corrected the baby's birthday from a 5-month to an 8-month profile, and reopened the note. The exact note remained.
- Changed milk type to Both, answered the Home solids question with First foods at eight months, and verified Starting solids remained the guide.
- Verified the final combined milk reference labels and the tailored sleep-support layout visually. Reload retained the corrected accessible Back label and appointment note.

## Review boundaries

No failures remain in the covered automated flows. This is a substantially stronger basis for a small usability beta, not a guarantee that every device or parent situation has been tested.

Not completed by this pass: native iPhone Safari/Android testing, real-parent usability validation, or pediatric signoff. Medical edits were checked against primary guidance, but this is not clinician approval. Data remains saved in the browser on that device; this work does not add accounts, cloud sync, caregiver sharing or prenatal functionality. The intended scope remains the baby's first year.

## Primary references checked for changed guidance

- AAP infant sleep: https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx
- Cleveland Clinic methods: https://health.clevelandclinic.org/when-and-how-to-sleep-train-your-baby
- Bedtime-fading trial: https://pubmed.ncbi.nlm.nih.gov/27221288/
- AAP crib setup: https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Make-Babys-Room-Safe.aspx
- AAP vitamin D: https://www.healthychildren.org/English/healthy-living/nutrition/Pages/vitamin-d-on-the-double.aspx
- CDC milk storage: https://www.cdc.gov/breastfeeding/breast-milk-preparation-and-storage/handling-breastmilk.html
- AAP food-allergy prevention: https://www.healthychildren.org/English/healthy-living/nutrition/Pages/when-to-introduce-egg-peanut-butter-and-other-common-food-allergens-to-your-baby-food-allergy-prevention-tips.aspx
- CDC two-month activity examples: https://www.cdc.gov/act-early/milestones/2-months.html
- Professional directory: https://www.childproofingexperts.com/find-a-professional/
