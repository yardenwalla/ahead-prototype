# Ahead · Change log for Claude

The original changes below were merged in pull request #1. The new pre-beta QA changes are documented in **`docs/beta-readiness-2026-10-22.md`**, with concrete findings, resulting behavior, verification and limits. Review the new PR diff against main rather than reimplementing either list from an older HTML export. Claude's main-branch copy updates through `6b02109a4fba5bdf8829db29f59c14057537ec85` are preserved.

## Latest pre-beta pass

Latest correction: **`docs/progression-fixes-2026-10-22.md`** addresses Claude's two stalled-journey findings. Safety now advances preparation beyond saved movement while preserving the actual ability for Play. Feeding gets an evolving 28-day follow-up and a distinct textures answer. The new persisted no-further-answers suite is included in the QA runner. This supersedes the earlier frozen-stage acceptance rules.

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

## Monthly Stories and the first-year collage (2026-10-31)

- **Each month, 1–11:** a foil-number balloon in that month's color, the parent's photo taped on a polaroid, and "[Name] is five months" handwritten underneath. Designs are Yarden's (`assets/share/month-*.jpg`); the photo window, tilt and tape layer were measured from each design (`js/share-story.js`).
- **Where it appears:** right after a parent adds a month's photo (anywhere in the app), as a "Share [Name]'s 5-month photo" button on the month-birthday card on Home, and as a small share button on each month in Memories.
- **First birthday:** all twelve photos on one page under a gold "12", as a photo or a ~20-second video that zooms through each month and pulls back to the whole year. It opens from "Make [Name]'s first-year collage" on the birthday screen and in Memories at 12 months. Months without a photo stay as empty frames, and the sheet says how many are missing.
- **Share / Save:** the Story is drawn on the phone from the parent's own photo. Share opens the phone's share sheet (Instagram, Messages); Save downloads it. The video is recorded in the browser (MP4 in Safari and Chrome, WebM elsewhere).
- Monthly photos are now kept at about 840px (was 360px) so they're sharp in the Story, falling back to the small size if the phone runs out of room. Photos added before this change stay small.
- The handwriting font (Caveat, OFL) ships with the app in `assets/fonts` so the Story always draws it.
- Checked in Chromium: adding a 5-month photo opens the Story; Home, Memories and the birthday entry points open it; the collage and video render; the video saves (19.7s MP4). `check-all.cjs` matches main (the existing "Solids answer changes stage" assertion fails on main too).
- **Move the photo in the polaroid:** in the Story sheet, drag the photo to position it and zoom with the slider. The choice is saved per month and used in the year collage too. Photos are now kept whole (short side ~840px) instead of pre-cropped to a square, so there's room to move them; tall photos start a little above centre.
- **Remove a photo in Memories:** a small × on each monthly photo, with Undo in the toast.
- Share shows only where the phone can share files (iPhone Safari, Android Chrome); elsewhere there's one Save button.
- **One button on the first-birthday screen:** "Make [Name]'s first-year collage" once there are monthly photos (the collage includes the video, so the separate Play button is gone), otherwise "Add a first-birthday photo".
- **Memories shows the Stories:** "Month by month" is a row of each month's finished Story (balloon design with the photo). Months without a photo show the design with an empty polaroid and "＋ Add photo", and next month's design sits faintly at the end, so the empty state shows what the year becomes. Tapping a month opens its Story (move, zoom, Change photo, share). The newborn photo stays a plain photo; at 12 months the first card is the year collage.
- The × on a Memories photo matches the × on Home's cards.
- **12 months matches the other months:** Yarden's single-photo gold "12" is the 12-month Story ("[Name] is one!"). The twelve-photo collage is its own "[Name]'s first year" card above the row in Memories at 12 months, and the first-birthday button on Home opens it.
- No faint next-month card; the row shows only months the baby has reached.
- **Newborn matches the set:** Yarden's gold "Hello, World!" design with the name handwritten on the polaroid (the design already has a heart). It's the first card in the Memories row and opens like the other months.
- **Newborn caption:** the name with the birthday underneath ("May 31, 2026"), taken from the saved birthday.
- **One Share button, like sharing a song:** the Story sheet has a single Share button that opens the phone's share sheet (Messages, Instagram, Save Image). The picture is made the moment it's tapped, so the phone still treats it as the parent's tap; before, the file was prepared first, iPhone refused the share and it fell back to downloading. The video is two taps: Make the video, then Share the video.
- Where the share sheet isn't available (some in-app browsers), the finished picture appears with "Press and hold the picture to save or share it" instead of a download. A computer still downloads it.

## Development, Sleep, Health and Safety against their core jobs (2026-11-03)

Each category was checked against its job (project doc "Ahead jobs to be done") and walked month by month, and by tapping every stage. Previewed in `core-jobs/`.

- **Sleep:** the same four rows at every stage (Night sleep, Naps, Routine, Safe sleep), each titled with what's new. The bedtime routine is one thread on one page: introduced at Longer nights (with moving bedtime earlier at 3–4 months), a set 7–8 pm bedtime at Three naps, brushing and the same goodbye at Two naps. Sleep training sits in the top card from Three naps on, as its own page. Rough night is the one place for troubleshooting; under 3 months crying leads and opens the crying page. A stage tapped on the timeline (and its pages) reads as a typical baby at that stage, not at the baby's real age. The mattress page follows age. "What to do" is one short line per step.
- **Development:** a "Next, by N months" row, one small tick per skill on the area tiles (filled once seen, no counts), a pictured play idea on every area, baby signs as Communication's idea from 6 months, and the big question of each age as a small chart.
- **Health:** the sick page goes temperature → when a fever means calling (the baby's own rule) → feeling better → vomiting or diarrhea → Call 911 last, in calm cards. Ear infection signs are on the colds page; jaundice at home is on the first-week checkup. One fever wording everywhere.
- **Safety:** Pulling up opens before 9 months (an old route redirect sent it to Crawling), future stages say "Get ready for this stage", the car seat step opens Outings' car seat page, step pages end without outside links, choking is no longer described as always silent.
- **Category icons** (`js/cat-icons.js`) are now in the live app.
- `tools/qa/stage-rules.cjs` knew only three Safety stages; it now covers Pulling up. "Solids answer changes stage" in recommendation-quality fails as it did before this change.

## Memories: the moments that matter (2026-11-03)

- Firsts shows the big moments (smile, laugh, roll, sitting, crawling, first tooth, first word, waving, pulling up, first steps, and anything the parent types) with baby-book titles ("First laugh"). Every other skill marked "Seen it" stays under "See all", in a quiet "Other skills you noticed" list.
- Checkups appear only once one is saved (they arrive from Health), with no "None saved yet" prompt.
- Every month still asks for its photo, as before.

## Memories: the firsts book (2026-11-03)

"See all firsts" is a baby book, styled to Yarden's design: a header with a stack of taped polaroids, and one rounded cream page per month with the month handwritten, that month's photo as a tilted polaroid with gingham tape (an empty one adds the photo), the big firsts with ringed icons and handwritten notes, and the smaller skills noticed that month as soft tags under "Also this month". The Firsts card on the Memories tab uses the same cream card and ringed icons. The page keeps the app's cream background.

## Memories: the memory book card (2026-11-03)

The Firsts list on the Memories tab is replaced by one "[Name]'s memory book" card (handwritten title, "N firsts so far", "Open the book", a stack of taped polaroids, and "＋ Save a first"). The book's title is now "[Name]'s memory book". With nothing saved, the card opens Save a first.

## Timeline reimagined (2026-11-03)
Job: "Help me understand what's coming as my baby grows, when to expect important changes, and how to prepare for each new stage." Files: `js/year-ahead.js`, `js/year-ahead-art.js`, `css/year-ahead.css` (overrides `window.nextPage`, adds `chg:Timeline:c:<id>`).
- 17 big changes from the crying peak to first steps, each with a typical range. A change stays until its range ends or the parent reports it (rolled, solids, crawling, pulling up, tooth, two naps).
- "Coming up next": the next three changes as compact cards. "Later on": swipeable month cards up to 1 year, each with Timeline's own object illustration (Home keeps the growing baby), the changes starting that month with their ranges, and checkups pinned.
- Each change opens a read-ahead page: when, the signs it's close, then "What it changes", up to four rows labeled by area that open the existing page for each, and a when-to-call tip. Nothing is written twice.
- Stops at 1 year, because the app ends there.
