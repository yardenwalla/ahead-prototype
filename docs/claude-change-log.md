# Ahead · Change log for Claude

The original changes below were merged in pull request #1. The new pre-beta QA changes are documented in **`docs/beta-readiness-2026-10-22.md`**, with concrete findings, resulting behavior, verification and limits. Review the new PR diff against main rather than reimplementing either list from an older HTML export. Claude's main-branch copy updates through `6b02109a4fba5bdf8829db29f59c14057537ec85` are preserved.

## Latest pre-beta pass

Follow-up acceptance review: **`docs/recommendation-quality-2026-10-22.md`** records the reason/action/timing/personalization findings, exact behavior changes and category acceptance matrix. Its regression suite is included in `node tools/qa/check-all.cjs`. This adds targeted fixes on PR #2, not a separate redesign. The original QA report below describes the preceding snapshot; use the new report and current generated summaries for the latest test results.

The new pass fixes saved-guide routes, browser navigation/reload, birthday-edit data continuity, invalid profile recovery, six-week and preview-age rules, explicit feeding/movement choices, repetitive Home movement summaries, Safety context and links, tailored Sleep support, milk-reference ambiguity and milk-specific detail content, plus month-2 Play variety. It retains the current design treatment. The full report above is the source of truth; automated coverage and actual browser checks are listed separately.

The older sections below describe the previous pass and retain its historical validation boundaries.

## Home

| Change | Exact result or rule |
| --- | --- |
| Agreed introductions | Retain the approved 3-month, 6-month-unanswered-solids and 8-month introductions. |
| Remaining monthly summaries | Replace app-navigation language such as “Play shows how” and “Health explains” with descriptions of baby’s changing skills and practical implications. |
| Movement personalization | Use only the ability actually reported. A suggested safety stage must never become “You’ve noticed rolling.” A “Not yet” answer remains “Not yet.” |
| First-food history | If the parent selected first foods, the reason remains “You said [name] has started solids,” even if a later guide is suggested by age. Do not call that “eating meals.” |
| Unknown food history | Use “Solids status not shared yet.” The Starting solids guide can be offered as an introduction without claiming baby has begun. |
| Sleep progression | Use “Two-nap guidance for this stage” for an age-based recommendation. Use “You said [name] is on two naps” only after confirmation. |
| Play | A relevant activity may occupy one of the existing three Home rows and link directly to its instructions. Keep the three-row cap and one row per category. |
| Checkup preparation | Prioritize a checkup in the next 35 days within the existing two-item preparation cap. Keep saved earlier appointments visible until marked attended. A past saved date is not evidence of attendance. |
| Safety reasons | Match the checklist/action: “Prepare space for rolling” or “Secure spaces within reach.” Don’t attach a rolling reason to a crawling checklist. |

Exact Feeding row descriptions:

- Newborn feeding: “Recognize hunger and fullness cues, and the signs milk intake is on track.”
- Feeds find a rhythm: “Understand changing feeds and how milk intake and growth fit together.”
- Getting ready for solids: “Spot the readiness signs and get set up before the first bite.”
- Starting solids: “Choose a way to offer food, prepare it safely and keep milk feeds alongside.”
- Textures and finger foods: “Build on first foods with textures and self-feeding practice suited to your baby.”
- Family meals: “Bring meals, milk feeds and cup practice together as eating skills grow.”

## Health

Home and the main checkup card now share these exact summaries:

| Checkup | Summary |
| --- | --- |
| First week | Feeding, weight, jaundice and results from the newborn screening checks. |
| 1 month | Growth, feeding and how you’re doing, plus any vaccine doses due. |
| 2 months | Growth, early responses and the first main round of vaccines. |
| 4 months | New movement, feeding and sleep questions, plus the next round of vaccines. |
| 6 months | Growth, first foods, tooth care and vaccines—including whether flu vaccination is due. |
| 9 months | A development questionnaire, growth and feeding, plus any vaccine doses still due. |
| 12 months | Growth, anemia screening, lead testing when needed, new vaccines and milk and cup questions. |

Keep Questions and Appointment Notes separate. Main links now describe their destination in plain language. Selected exam headings use “Newborn exam,” “Feeding and solids,” “New skills,” “Development questionnaire” and “Feeding and teeth.”

The appointment-ranking calculation now converts milliseconds to days before rounding. Booking a visit retains its purpose; completing it removes it from pending recommendations.

## Sleep, Feeding and Safety

- Fresh Sleep and Feeding checklists start unchecked. Starting a genuinely new baby setup clears example progress in the newer module. Editing details retains progress. Existing saved legacy checkmarks are not erased because they cannot reliably be distinguished from intentional completion.
- Before 4 months, settling support uses “Helping baby settle” with sleepy cues and a short routine. It does not introduce training methods. Later sleep training remains optional.
- Remove universal claims that a nap schedule could not work before this stage. Describe a developing pattern with variability.
- The early day/night example is a sequence, not a full day: its nap count says “Varies.” Later full-day examples keep their actual counts.
- The older-age solids check-in asks “Has [name] started solids?” without saying the parent is overdue.
- Texture guidance supports purées, self-feeding or both. It does not assume spoonfuls came first.
- The 10–11-month bottle reference is separated from the later milk amount. The earlier 16–24 oz value is not used as the under-one metric.
- Bottle leftovers: “Formula: discard leftovers within 1 hour of starting the feed. Breast milk: use leftovers within 2 hours after the feed ends, then discard.”
- Remove the claim that choking is always silent. Include breathing difficulty or an ineffective cough even when there is some sound. Keep detailed help in its existing reference location.
- Reporting pulling up records pulling up; it does not also report crawling and rolling.

## Onboarding and pronouns

One optional question is added to the existing first setup screen, after the name:

**How should we refer to your baby? · Optional**

- They/them (default)
- He/him
- She/her

Save as `profile.pronouns`. The choice is editable in Baby’s details and survives reload. Existing real profiles without the field use they/them; the named Maya example explicitly uses she/her.

This choice changes wording only. It must not change clinical guidance, recorded abilities, saved moments, appointments or notes. Do not infer pronouns from the name.

Baby-specific Sleep/Feeding copy uses explicit authored templates for subject, object, possessive and reflexive forms, with the matching verbs. Examples: “Is he fed and changed?”, “Are they fed and changed?”, “Can I give him water?” and “Can I give them water?” Generic educational wording may remain neutral. Personal notes are never rewritten.

## Onboarding design — applied

Welcome now shares the main app’s cream canvas, pastel icon backgrounds, existing baby illustration and six-color accent. The agreed headline and three benefits are unchanged; deliberate line breaks avoid a stranded final word.

The existing two-step setup now uses labeled progress, compact illustrated title cards and shared rounded inputs. Baby details use a warm neutral card; milk feeding uses the Feeding pink and existing bottle illustration. The early-birth checkbox has a compact mint treatment. All form fields, validation, optional pronouns, saved values and profile-editing behavior remain intact. Onboarding styles are scoped so category screens retain their design.

## Validation and boundaries

The first pass covered 100 scripted families across 1,300 monthly checkpoints, all six categories and linked guides. The separate pronoun pass covers all three choices, old profiles, conditional answers, saving/reloading/editing, and preservation of personal notes. See `docs/content-qa-2026-10-21.md` and the scripts under `tools/qa/`.

The redesigned welcome and both setup steps were visually inspected in a managed browser preview. Setup progression, back navigation, retained answers and completion into personalized Home were checked. The pronoun regression suite passes 1,584 checks across 419 renders. This is not pediatric approval or a full visual QA pass of every app screen.

Existing age-based guide advancement remains a product decision: suggested guidance is distinct from confirmed skill mastery. This update includes onboarding-only visual changes, with no merge or production deployment.
