# Ahead · prototype

Ahead helps first-time parents understand what their baby needs now and prepare for the next meaningful change. It keeps six category homes and a first-year view, with short guides and optional references.

Open `index.html` or serve this directory with GitHub Pages. There is no build step. A new browser starts with onboarding; Maya is a fictional example used in QA, not a preselected baby.

## Current editorial acceptance

Start with [the consolidated first-year acceptance report](docs/editorial-acceptance-2026-10-23.md). It records substantive fixes, retained content, repetition decisions, parent tasks and the limits of the review. The earlier dated reports describe their own snapshots and may contain superseded behavior.

[The content register](docs/editorial-acceptance-register.json) stores actual rendered/source text, timing, route and hashes. It is an inventory, not an automated quality score.

## Category jobs

| Category | What it helps a parent understand |
| --- | --- |
| Development | Recognizable emerging skills and how to support them; CDC reference ages, not monthly deadlines |
| Play & everyday activities | Concrete awake-time activities, their skill connection and easier/extended versions |
| Sleep | Changing nights and naps, awake ranges, bedtime, a matching sample day and optional settling support |
| Feeding | Milk references, solids preparation, first tastes, textures, meals and milk/cup transitions |
| Safety | Specific home changes before new movement; one saved checklist rather than copied tasks |
| Health | What each actual checkup reviews, vaccines/eligibility, questions, notes and explicit attendance |

## How guidance moves

- Sleep: **Newborn sleep → Nights stretch out → Naps settle in → Naps drop to two**. Age chooses the default; appropriate nap reports can change it. Optional sleep training is a separate choice. Browsing a future age never assigns that pattern to a newborn.
- Feeding: **Newborn feeding → Changing milk feeds → Getting ready for solids → Starting solids → Textures and finger foods → Family meals**. Eating experience comes from a parent's answer. Time prompts a follow-up; it does not invent progress. The milk selector separates nursing, expressed milk, formula and nursing with bottles.
- Safety separates **reported movement** from **preparation**. Preparation advances with age even if the only saved movement is an old roll. It never reports crawling or standing, or inserts standing play, without that information.
- Newborn Sleep/Feeding use the actual six-week boundary, not the two-month birthday. Developmental guidance uses adjusted age after early birth; Health follows birthday age. An individual milk/supplement plan takes priority over general references.
- Category rails keep **Your guide** on the recommendation while separately marking the page being read. Update actions describe what is being reported. Reading is never completion.
- Completed visits, skills and safety checks retain their explicit records. A missing record is unknown, not evidence that a visit was missed or a skill is absent.

## Home

`js/home-rules.js` chooses recommendations within the existing design:

- Each row states why it is useful now. Must-know actions, relevant reports and nearby appointments rank ahead of general references.
- At most three current rows and two preparation rows, with one category per area and no category duplicated between the two.
- In the first weeks, milk feeding, the first checkup and initial sleep setup take priority. Completed setup stops being promoted.
- Preparation includes the 4-month sleep change, optional training education around four months, first-food preparation and a possible catnap transition. A parent's chosen sleep approach and nap answers affect these suggestions.
- Checkup preparation stays close to the actual/expected visit. Unfinished safety work retains Done and Doesn't apply across stages.
- Food check-ins start around six developmental months and evolve from starting foods to textures/meals. Follow-ups are spaced 28 days after an answer or skip, with the existing quiet periods.

`homeRulesDebug()` and `homeRecommendationAudit()` expose the reasons for the current selection for QA.

## Validation

Run on Node 20+:

```sh
node tools/qa/check-all.cjs
python3 tools/qa/link-check.py
```

The six suites cover syntax/local assets, 100 scripted chronological families, pronouns, links/routes, recommendation contracts, 100 saved-once progression journeys and editorial regression contracts. Scripted scenarios are not human usability sessions or clinical approval.

After content changes:

```sh
node tools/qa/content-review-register.cjs --write
```

Review the changed units in their rendered context, then update the acceptance report. A different ID or shorter paragraph does not automatically make content useful.

Historical context: [beta-readiness fixes](docs/beta-readiness-2026-10-22.md), [recommendation review](docs/recommendation-quality-2026-10-22.md), [progression corrections](docs/progression-fixes-2026-10-22.md) and [Claude handoff log](docs/claude-change-log.md). Optional older browser-run scripts remain under `tools/qa`; their reports are not the current acceptance decision.

## Editing files

| Path | Responsibility |
| --- | --- |
| `index.html` | Static app shell and module order |
| `css/` | Shared visual identity and component styles |
| `js/app.js` | Home/Development/Play/Health/Safety templates, records, illustrations and some shared Sleep content |
| `js/changes-data.js` | Main Sleep/Feeding guides, questions, references and source links |
| `js/changes.js` | Sleep/Feeding rendering, contextual copy, milk reference and guide/nap choices |
| `js/home-rules.js` | Home ranking, reasons and timely preparation |
| `js/stages.js` | Reported information, follow-ups, quiet periods and proactive Safety progression |
| `js/baby-language.js` | Authored pronoun-aware copy; check new wording and verb agreement |
| `js/timeline.js` | Saved timeline presentation |
| `js/welcome.js` | Onboarding and value proposition |
| `js/navigation.js`, `js/boot.js` | Browser navigation/reload and startup |

Preserve the current visual identity, stable records, explicit topic ownership and digestible presentation. Use primary sources for new medical wording. Do not add content to fill a month, or treat a guide being opened as an action completed.

_Prototype. Pediatric review and real-parent usability testing remain pending._
