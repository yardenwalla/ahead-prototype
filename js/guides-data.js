/* Ahead · Sleep and Feeding guides, written as a conversation and kept to the content guide's limits:
   a short answer of 1–2 sentences, at most 3 items per section, one line of why or how per item.
     short  — the short answer (page header)
     do     — what to do now
     know   — what to know: safety, how it connects, what changes
     normal — what's normal (short lines, no explanation needed)
     help   — when to call your pediatrician (the full triage is one tap away)
   "Maya" becomes the baby's name. {s} {o} {p} {S} {is} {has} {does} become the baby's pronouns.
   An item can carry a link: [title, body, onclick, link label]. Depth lives in FAQs and detail pages. */
window.AHEAD_GUIDES = {
 Sleep: {
  clock: {
   short: 'Newborns sleep 14–17 hours a day, in 1–3 hour stretches. No pattern yet, and that’s normal.',
   do: [
    ['Put Maya on {p} back for every sleep', 'Firm, flat surface, nothing else in it, in your room.', "openPage('chg:Sleep:safe')", 'Safe sleep checklist'],
    ['Start settling at the first yawn', 'Most newborns are ready to sleep after 45–60 minutes awake.'],
    ['Help Maya fall asleep any way that works', 'Feeding, rocking or holding to sleep is fine. You can’t spoil a newborn.']
   ],
   know: [
    ['Wake Maya for feeds for now', 'Until your pediatrician says you can stop, usually once birth weight is back.'],
    ['Day and night feel the same to Maya', 'Maya’s body clock switches on around 6–8 weeks.']
   ],
   normal: [['Waking every 2–3 hours'], ['Grunts, squeaks and twitches in sleep'], ['No two days alike']],
   help: 'Call if Maya is hard to wake for feeds or has a temperature of 100.4°F or higher.'
  },
  daynight: {
   short: 'Many babies start telling day from night now. Often the first sign is one longer stretch at night.',
   do: [
    ['Keep days bright and nights dim', 'Daylight and chatter by day; low light and quiet feeds at night.'],
    ['Start a short bedtime routine', 'A feed, a diaper and a song. Familiar matters more than long.'],
    ['Let Maya wake you for night feeds', 'Once your pediatrician says it’s OK. Most still feed 2–3 times a night.']
   ],
   know: [
    ['Bedtime starts late', 'Often 8–10 pm at first, then earlier over these weeks.'],
    ['Nights settle before naps', 'Naps still move around. That comes next.']
   ],
   normal: [['4–5 naps that move around'], ['A long stretch one night, not the next'], ['Fussier evenings, peaking around 6–8 weeks']],
   help: 'Call if Maya snores most nights, pauses or gasps in sleep, or sleep changes come with fever or poor feeding.'
  },
  rhythm: {
   short: 'Naps may start to follow a pattern: usually 3 a day, with Maya sleepy after about 2 hours awake.',
   do: [
    ['Watch for sleepy cues', 'A quiet gaze, yawning or turning away. Wind down before Maya gets upset.'],
    ['Keep the same steps before every sleep', 'A diaper, a song and your usual help settling.']
   ],
   know: [
    ['Rolling means no more swaddling', 'At the first attempt to roll, switch to a sleep sack with arms free.', "openSection('Sleep','sleep-rolling')", 'How sleep changes as Maya moves'],
    ['Night feeds can carry on', 'Check with your pediatrician before dropping one.']
   ],
   normal: [['Naps of 30–45 minutes'], ['Fighting a nap now and then'], ['Bedtime around 7–8 pm']],
   help: 'Call if Maya snores most nights, pauses or gasps in sleep, or sleep changes come with fever or poor feeding.'
  },
  two: {
   short: 'Between 6 and 9 months, most babies drop the late catnap and move to two naps. Look for a pattern, not one day.',
   do: [
    ['Watch for a skipped catnap most days', 'If Maya still reaches bedtime happily, try two naps.'],
    ['Move bedtime earlier during the switch', 'About 30 minutes earlier helps with the long afternoon.'],
    ['Lower the crib mattress before Maya sits', 'Then to its lowest before pulling up.', "openSection('Sleep','sleep-crib-height')", 'Crib setup']
   ],
   know: [
    ['Readiness shows in the day, not the age', 'A third nap can still help after a short one.'],
    ['Night feeds can carry on', 'Check with your pediatrician before dropping one.']
   ],
   normal: [['Catnap one day, none the next'], ['Bedtime creeping later before the switch'], ['New skills disturbing sleep']],
   help: 'Call if Maya snores most nights, pauses or gasps in sleep, or sleep changes come with fever or poor feeding.'
  },
  two10: {
   short: 'Two naps usually last well past the first birthday. A short nap can shift the timing, not the number.',
   do: [
    ['After a short nap, offer the next sleep earlier', 'One rough day doesn’t end the two-nap routine.'],
    ['Practice new skills while Maya is awake', 'Plenty of standing practice by day helps nights.']
   ],
   know: [
    ['Most babies move to one nap at 13–18 months', 'A few refused naps now are usually a phase.']
   ],
   normal: [['Standing up in the crib'], ['Separation anxiety at bedtime']],
   help: 'Call if Maya snores most nights, pauses or gasps in sleep, or sleep changes come with fever or poor feeding.'
  }
 },
 Feeding: {
  learn: {
   short: 'Newborns feed 8–12 times a day, often every 1–3 hours. Small, frequent feeds are exactly right.',
   do: [
    ['Feed at the first hunger cues', 'Rooting, lip smacking and hands to mouth come before crying.'],
    ['Let Maya end the feed', 'Turning away or slowing down means {s} {has} had enough.'],
    ['Get help early if nursing hurts', 'Pain past the first few seconds is worth a lactation visit.']
   ],
   know: [
    ['How to tell it’s going well', '6 or more wet diapers a day after day 5, and birth weight back by 2 weeks.'],
    ['Frequent feeds build supply', 'If you’re nursing, feeding often helps your milk come in.']
   ],
   normal: [['Feeding again an hour later'], ['A little spit-up in a happy baby'], ['Long feeds at first']],
   help: 'Call if Maya is hard to wake for feeds, looks more yellow, or has fewer wet diapers than expected.'
  },
  rhythm: {
   short: 'Feeds often get quicker or further apart now, usually 6–8 a day. Hungrier days still happen.',
   do: [
    ['Follow cues, not the clock', 'Offer milk at hunger cues; stop at fullness cues.'],
    ['Pace bottle feeds', 'Hold the bottle level and pause often. Never prop it.']
   ],
   know: [
    ['How to tell it’s going well', 'Steady growth at checkups and regular wet diapers.'],
    ['Shorter feeds are fine', 'Many babies just get more efficient.']
   ],
   normal: [['Quicker feeds'], ['Longer gaps between feeds'], ['A little spit-up']],
   help: 'Call if Maya has fewer wet diapers, keeps refusing feeds or is taking much less milk.'
  },
  ready: {
   short: 'Most babies start solids around 6 months, once they’re ready. Until then, milk is all Maya needs.',
   do: [
    ['Watch for the readiness signs', 'Steady head, sits with support, opens for food and swallows it.'],
    ['Choose how you’ll start', 'Purées, soft finger foods or both. Begin with an iron-rich food.'],
    ['Get set up before the first bite', 'A high chair with a harness, and a choking first-aid class.']
   ],
   know: [
    ['Gagging is normal; choking isn’t', 'Choking means trouble breathing or a weak cough. Call 911.'],
    ['Offer peanut and egg early', 'Once a few foods are going well. Ask first if Maya has severe eczema.', "openPage('chg:Feeding:allergy')", 'How to introduce allergens'],
    ['Milk stays the main food', 'Keep milk feeds as they are. Solids start as practice.']
   ],
   normal: [['A hungrier phase around 4 months'], ['Watching you eat, with no other signs'], ['Waking more at night']],
   help: 'Ask about timing if Maya was born early, has severe eczema or a food allergy, or shows no signs by 7 months.'
  },
  first: {
   short: 'A few bites once or twice a day is plenty. Breast milk or formula is still Maya’s main food.',
   do: [
    ['Start with an iron-rich food', 'Mashed beans, iron-fortified cereal or soft shredded meat.'],
    ['Introduce peanut and egg early', 'One at a time, in a safe form, then keep offering.', "openPage('chg:Feeding:allergy')", 'How to introduce allergens'],
    ['Let Maya decide how much', 'Turning away or closing {p} mouth means done.']
   ],
   know: [
    ['Make choking hazards safe', 'Quarter grapes, soften vegetables, thin nut butter. No whole nuts or popcorn.'],
    ['Not before 12 months', 'Honey, cow’s milk as a drink, and juice.'],
    ['Milk feeds stay the same', 'Sips of water from an open cup at meals are fine.']
   ],
   normal: [['Gagging and funny faces'], ['Eating almost nothing some days'], ['Changes in poop']],
   help: 'Call if hives or vomiting follow a new food. Call 911 for trouble breathing or swelling of the lips or tongue.'
  },
  textures: {
   short: 'Maya is ready for soft lumps and finger foods. Build on foods {s} already manages.',
   do: [
    ['Go from smooth to lumpy', 'Make a familiar food a little thicker each week.'],
    ['Offer soft finger foods', 'Finger-sized strips first, smaller pieces once {s} can pinch.'],
    ['Practice with an open cup', 'A few sips of water at meals.']
   ],
   know: [
    ['Make choking hazards safe', 'Quarter grapes, soften vegetables, cut food into strips.'],
    ['Milk still matters', 'Meals don’t need to replace milk feeds yet.'],
    ['Look at the week, not the meal', 'Appetite swings from day to day.']
   ],
   normal: [['Mess and dropped food'], ['Appetite that swings'], ['Wanting to do it alone']],
   help: 'Call if Maya keeps refusing textures or vomiting, or shows little interest in food after 9 months.'
  },
  meals: {
   short: 'Three meals and a snack or two, with milk alongside. Most family food can be adapted for Maya.',
   do: [
    ['Adapt a family meal', 'Set Maya’s portion aside before adding salt.'],
    ['Offer a cup at meals', 'Water from an open or straw cup.'],
    ['Plan the milk change at 12 months', 'Whole cow’s milk can replace formula then. Nursing can continue.']
   ],
   know: [
    ['A light day is normal', 'Growth at checkups tells you more than any meal.'],
    ['Still not before 12 months', 'Honey, cow’s milk as a drink, and juice.']
   ],
   normal: [['Picky phases'], ['Wanting to self-feed'], ['A big day, then a small one']],
   help: 'Call if Maya has fewer wet diapers, keeps refusing food or reacts to a new food.'
  }
 }
};
