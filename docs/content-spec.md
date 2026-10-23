# Ahead content spec

The standard every string in Ahead is written and reviewed against. Content owner: Claude, with product sign-off from Yarden and clinical sign-off from a pediatrician. Last updated October 23, 2026.

## The promise

One change in your baby, everything it affects, before it happens. Ahead is a quick snapshot of what a parent needs now, not a book. When in doubt, cut.

## Voice

Warm, calm, plain and specific, like a friend who went through it recently and checked with the experts.

- Speak to "you". Use the baby's name and pronoun from the profile.
- Lead with what to do. Cautions go where they apply, never first.
- Concrete nouns: "a high chair with a harness", "a soft-cooked carrot".
- Give permission: "You don't have to pick one." "That's normal now."
- One hedge per screen at most. No "may", "can" and "often" stacked in one sentence.
- "Should" and "must" only for safety.
- Never assume the parent is the mother or that there are two parents.
- Neutral on breast milk, formula and both; on purées and baby-led weaning; on sleep training or not.
- No fear, no guilt, no filler intros, no exclamation marks except one earned celebration.

## Personal and generic copy

- **Personal copy** is about this baby: stage pages, tips, questions and answers, Home. It uses the name or the profile pronoun. Source strings are authored in the "she" form with a template in `js/baby-language.js`, so he, she and they all read correctly.
- **Generic copy** is reference material that applies to every baby: safe-sleep rules, checklist titles, source notes. It may say "baby" and "they".
- **Development and Play guides** (skill and activity pages) are instructions written for every baby. They use "baby" and "they" consistently and never switch to "she" on the same page.
- Never mix both in one section. If a card is personal, every line in it is personal.

## Glossary

Use these words, and only these, for these things.

| Use | Not |
| --- | --- |
| checkup in titles and labels ("the 6-month checkup") | visit and appointment are fine in sentences |
| pediatrician | doctor, provider, care team (care team only for a plan from several clinicians) |
| sleep space | crib, bassinet, sleep surface, when the advice covers all of them |
| wake window | awake time, time between sleeps (parents search "wake windows") |
| first foods, solids | weaning |
| breast milk, formula or both | breastfeeding vs formula |
| nursing | breastfeeding at the breast, when distinguishing from bottles |
| caregiver | anyone else looking after the baby |
| sleep regression | for the 4-month and separation-anxiety phases, framed as a normal step forward |
| cluster feeding, growth spurt, distracted feeding | clinical alternatives |
| purées, finger foods, baby-led weaning | |
| nap transition, with numbers ("the 3-to-2 nap transition"); catnap; contact nap | |
| check (Safety checklist item) | task, step |

## Stage names

Use exactly these, everywhere.

- **Sleep:** Newborn sleep (Birth–6 weeks) → Nights stretch out (Usually 6 weeks–3 months) → Naps settle in (Usually 4–6 months) → Naps drop to two (Usually 6–9 months). After the first birthday: Naps drop to one. Each name after the first says what changes, and each stage opens with "You’re here when…" so parents can recognize it. Come and go: The 4-month sleep regression, Separation anxiety.
- **Feeding:** Newborn feeding → Changing milk feeds → Getting ready for solids → Starting solids → Textures and finger foods → Family meals. Come and go: Cluster feeding and growth spurts, Distracted feeding, Teething and feeding.
- **Checkups:** first-week, 1, 2, 4, 6, 9 and 12 months.
- **Safety:** First setup → Reaching and rolling → Before crawling → Crawling and scooting → Before pulling up.

## Components

| Component | Pattern | Limit |
| --- | --- | --- |
| Hero headline | Plain statement of what's changing | ~40 characters |
| Hero description | What's happening, then what helps | 1–2 sentences, ~160 characters |
| Eyebrow or label | Short noun phrase | ~35 characters |
| Card or check title | Verb + object | ~60 characters |
| Body | Why, then what to do | 1–2 sentences, ~140 characters |
| Steps | One action each, verb first, real order | 3–5 steps |
| Answer (Q&A) | What to do now | 1–2 sentences |
| Small print (Q&A) | One extra fact or the when-to-call line | 1 sentence |
| Button or link | Verb + object, says where it goes | 1–5 words |
| Status chip | State, not instruction | 1–2 words |
| Check-in question | Plain question about the baby | ~45 characters |

Titles are statements, except in Common questions. Tips are actions, not situations.

## Mechanics

- Sentence case everywhere. No ALL CAPS.
- Periods on body sentences; none on titles, buttons, labels or chips.
- Numerals always ("3 naps"), except in stage names ("Naps drop to two"). Ranges with an en dash ("4–6 months"). "7:30 pm". "°F" with "°C" only in fever thresholds.
- Contractions ("you'll", "she's", "don't").
- No parentheses in body copy, no ellipses, no semicolons where two sentences work.

## Never ship

- Copy that describes the app instead of helping the parent ("This section uses…", "Your answer changes the guide you see" is allowed once, at the check-in).
- Editorial rationale, recaps, "based on" lines.
- A basic repeated after the month it was introduced, except a safety line with a new reason.
- Medicine doses (point to the label, a pharmacist or the pediatrician).
- Diagnosis. Route individual concerns to the pediatrician.

## Medical content

- State thresholds plainly, with when to call and when to call 911.
- Every number and medical claim has a named source (AAP, CDC, NIAID, CPSC, NHTSA, NHS) and is listed in the pediatric review packet until a clinician signs off.
- Show milk amounts only for the feeding method in the profile.

## Before anything merges

- [ ] Fits the voice and the component limits.
- [ ] Uses glossary words and canonical stage names.
- [ ] Personal copy is pronoun-safe for he, she and they.
- [ ] Doesn't repeat or contradict the months before and after, or another category.
- [ ] A tired parent gets the point from the first line, and knows the next step.
- [ ] Medical claims are in the review packet.
