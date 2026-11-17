/* Feeding on the shared page templates (Nov 16; see claude/ahead-page-templates.md).
   Each Feeding page is data: { type, label, art, title, why, ...fields }, drawn by the same templates as Sleep.
   Pages not listed here (the stage pages, the step-by-step feed and bottle walkthroughs, the example day) keep their own design. */
(function () {
  const H = () => window.__hub, X = () => window.__fdx, CAT = 'Feeding';
  const mo = () => X().ageMo(), nurse = () => X().nurses(), breast = () => X().isBreast(), fam = () => X().formulaFam(), pump = () => X().pumps();
  const onlyFormula = () => !breast();
  // The fever rule for the baby's age, short enough for a call line.
  const fev = () => { const m = mo(); return m < 3 ? 'a fever of 100.4°F or higher' : m < 6 ? 'a fever of 101°F or higher' : 'a fever of 103°F or higher, or over a day'; };
  const T = {
    // ---------- Milk: is it going well? ----------
    nb_enough: () => ({ type: 'expect', label: 'Getting enough', art: 'diaper', title: 'Wet diapers are your everyday sign',
      why: 'You don’t need to measure feeds. Diapers every day, and weight at checkups, tell you.',
      normalTitle: 'Wet diapers a day',
      normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['diaper', 'Days 1–2', '1–2'], ['diaper', 'Days 3–4', '3–4'], ['diaper', 'Day 5', 'About 5'], ['diaper', 'Day 6 on', '6 or more']], caption: 'Wet diapers a day: 1 to 2 on days 1 and 2, 3 to 4 on days 3 and 4, about 5 on day 5, then 6 or more.' }),
      normalNotes: [['', 'Poop', onlyFormula() ? 'Black and sticky at first, tan by day 6' : 'Black and sticky at first, yellow and seedy by day 6' + (nurse() ? ', 3 or more a day' : '')]],
      do: [['notepad', 'Note feeds and diapers', 'Until things feel settled'], ['steth', 'Go to the weight checks', 'No need to weigh at home']],
      doNotes: [nurse() ? ['', 'During feeds', 'Long sucks, and swallows you can hear'] : null, ['', 'After most feeds', '{S’s} content for a while']],
      calls: { ped: 'fewer wet diapers, dark urine, black poop after day 5, or not back to birth weight by 2 weeks.' } }),
    enough: () => ({ type: 'expect', label: 'Getting enough', art: 'diaper', title: 'Wet diapers and growth tell you {s’s} getting enough',
      why: mo() >= 6 || onlyFormula() ? 'No need to measure feeds. Your pediatrician checks {p} weight at each visit.' : 'Fewer poops can be normal after about 6 weeks. Wet diapers and growth are what count.',
      normal: [['diaper', '6 or more', 'Wet diapers a day, still'], ['steth', 'About 2× birth weight', 'By 4–5 months']],
      calls: { ped: 'fewer than 6 wet diapers a day, or {s’s} feeding much less.' } }),
    m1_now: () => ({ type: 'expect', label: 'Feeds now', art: 'clock', title: 'Hungrier some days? Often a growth spurt',
      why: 'Feeds change from week to week. Most of it is growth, not something going wrong.',
      normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['clock', 'Around 6 weeks', '2–3 hungrier days'], ['moon', 'In between', 'Calmer weeks'], ['clock', 'Around 3 months', 'Another, then it passes']], caption: 'A growth spurt around 6 weeks, calmer weeks in between, and another around 3 months.' }),
      do: nurse() ? 'Feed more often for a few days, and your milk catches up.' : 'Offer a little more if {s} still {seem|seems} hungry. It settles in a few days.',
      doNotes: nurse() ? [['', 'Pulls off and fusses?', 'Burp, then try again. Milk coming fast? Lean back']] : [['', 'Sucks hard and gets frustrated?', 'Try the next nipple size'], ['', 'Gulping or spilling?', 'Stay with the slower one']] }),
    m1_eve: () => ({ type: 'expect', label: 'Evenings and nights', art: 'moon', title: 'Night feeds are still normal',
      why: 'Some babies sleep one longer stretch by now, and many don’t yet. Both are normal.',
      normal: [['moon', '1–3 night feeds', 'Common now'], ['sunrise', 'Fussy evenings', 'Peak around 6 weeks, ease by 3–4 months']],
      do: 'Once your pediatrician says {s’s} gaining well, stop waking {o} for feeds. Still feed {o} when {s} {wake|wakes} hungry.' }),
    nb_eve: () => ({ type: 'expect', label: 'Evenings and nights', art: 'moon', title: 'Busy evenings, then quick, calm nights',
      why: 'Evenings can be feed after feed. At night, keep feeds short and sleepy, so {s} {learn|learns} that night is for sleeping.',
      do: [['sunrise', 'Evenings', nurse() ? 'Switch sides often, and take turns' : 'Smaller bottles, more often, and take turns'], ['moon', 'Nights', 'Lights low, voices quiet, no play'], ['diaper', 'Night diapers', 'Only if needed'], ['clock', 'Until birth weight', 'Wake {o} if 3 hours pass']],
      doNotes: [['', 'Hard to wake?', 'Undress {o} to {p} diaper, or stroke {p} feet']],
      calls: { ped: '{s’s} too sleepy to feed most times.' } }),
    m2_night: () => ({ type: 'expect', label: 'Evenings and nights', art: 'moon', title: 'Night feeds are still common',
      why: 'Many babies still feed once or twice a night around 4 months. Feeding {o} back to sleep is fine.',
      normal: [['moon', '1–2 night feeds', 'Still common'], ['sun', 'Distracted by day?', '{S} may make up for it at night']],
      do: 'Dropping night feeds is a choice to make with your pediatrician.' }),
    m2_distract: () => ({ type: 'expect', label: 'Distracted feeds', art: 'eye', title: 'Short daytime feeds are okay',
      why: '{S} may take a few gulps, then pop off to look around. Over the whole day, {s} still {get|gets} what {s} {need|needs}.',
      do: [['moon', 'Feed when drowsy', 'Just waking, or before sleep'], ['hand', 'Something to hold', 'Your finger, or a soft toy'], ['chat', 'Talk less', 'Save the chat for after']],
      doNotes: [['', 'Pops off?', 'End the feed, and try again a little later. No need to force it']],
      calls: { ped: 'fewer wet diapers than usual, or feeding much less for more than a few days.' } }),

    // ---------- Every day ----------
    nb_vitd: () => onlyFormula()
      ? { type: 'howto', label: 'Every day', art: 'drop', title: 'Vitamin D drops, until about 32 oz a day',
        why: 'About 32 oz of formula holds a full day’s vitamin D. Until {s} {drink|drinks} that much, {s} {need|needs} drops too.',
        pictureTitle: 'In the formula', picture: () => H().TPLB.tiles([['sun', 'Vitamin D', 'Drops until 32 oz a day'], ['drop', 'Iron', 'Choose a formula with iron']], CAT),
        ordered: false, steps: [['drop', 'The label’s dose', 'With the dropper that comes with them'], ['mouth', 'Inside {p} cheek', 'Drip it in slowly'], ['bottle', 'Or in 1 oz of milk', 'Make sure {s} {finish|finishes} it']],
        stepsNotes: mo() < 6 ? [['', 'No water yet', 'Milk is all {s} {need|needs} until about 6 months, even on hot days']] : null }
      : { type: 'howto', label: 'Every day', art: 'drop', title: 'Vitamin D drops, every day',
        why: 'Vitamin D builds strong bones, and breast milk has very little. A few drops a day fill the gap.',
        pictureTitle: 'What {s} {need|needs}', picture: () => H().TPLB.tiles([['sun', 'Vitamin D', '400 IU a day, through {p} first year'], ['drop', 'Iron', fam() ? 'Drops from 4 months, if mostly breast milk' : mo() < 4 ? 'Drops usually start at 4 months' : 'Drops from 4 months, until iron-rich foods are going well']], CAT),
        ordered: false, steps: [['drop', 'The label’s dose', 'With the dropper that comes with them'], ['mouth', 'Inside {p} cheek', nurse() ? 'Or on the nipple, just before a feed' : 'Drip it in slowly'], ['bottle', 'Or in 1 oz of milk', 'Make sure {s} {finish|finishes} it']],
        stepsNotes: mo() < 6 ? [['', 'No water yet', 'Milk is all {s} {need|needs} until about 6 months, even on hot days']] : null },
    z_iron: () => ({ type: 'expect', label: 'Iron', art: 'drop', title: '{P} iron from birth runs low by 4 months',
      why: fam() ? 'Breast milk is low in iron. If it’s more than half of {p} milk, {s} {need|needs} drops.' : 'Breast milk is low in iron, and {p} stores run low around now.',
      normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['drop', '4 months', 'Start iron drops'], ['bowl', '6–9 months', 'Stop once iron-rich foods are going well']], caption: 'Iron drops start at 4 months and stop once iron-rich foods are going well, around 6 to 9 months.' }),
      do: mo() < 4.5 ? 'Ask your pediatrician for the dose at the 4-month checkup. Give it like vitamin D: in {p} cheek, or in a little milk.' : 'Not on drops yet? Ask your pediatrician for the dose now. A call is fine.',
      doNotes: [['', 'Darker poop?', 'Iron can cause it. That’s normal']] }),

    // ---------- Bottles ----------
    basics: () => { const br = breast() && (pump() || X().stored()), fm = fam();
      const head = br && fm ? ['', 'Breast milk', 'Formula'] : ['', br ? 'Breast milk' : 'Formula'];
      const rows = br && fm ? [['Counter', 'Up to 4 hours', '2 hours after making it'], ['Fridge', 'Up to 4 days', 'Up to 24 hours. Night bottles can be made ahead'], ['Freezer', 'Best within 6 months', 'Don’t freeze'], ['Thawed', '24 hours in the fridge. Don’t refreeze', '—'], ['Left after a feed', 'Within 2 hours', 'Within 1 hour, then toss it']]
        : br ? [['Counter', 'Up to 4 hours'], ['Fridge', 'Up to 4 days'], ['Freezer', 'Best within 6 months, up to 12'], ['Thawed', '24 hours in the fridge. Don’t refreeze'], ['Left after a feed', 'Within 2 hours']]
        : [['Counter', '2 hours after making it'], ['Fridge', 'Up to 24 hours. Night bottles can be made ahead'], ['Freezer', 'Don’t freeze'], ['Left after a feed', 'Within 1 hour of starting, then toss it']];
      return { type: 'howto', label: 'Bottles', art: 'fridge', title: br && fm ? 'Breast milk keeps 4 hours out, formula 2' : br ? 'Breast milk keeps 4 hours out, 4 days cold' : 'Formula keeps 2 hours out, 1 day cold',
        why: 'Use these times so every bottle is fresh and safe.',
        pictureTitle: 'How long it keeps', picture: () => H().TPLB.table(head, rows).replace('</section>', H().TPLB.ul(br ? [fm ? ['', 'Mixed bottle', 'Like formula: within 1 hour once {s} {start|starts}'] : null, ['', 'Adding fresh milk', 'Cool it in the fridge first, and freeze in 2–4 oz portions']] : []) + '</section>'),
        stepsTitle: 'Warming a bottle', steps: [['drop', 'Warm water', 'Or a bottle warmer'], ['bottle', 'Swirl', 'To mix it'], ['hand', 'Test on your wrist', 'Warm, not hot']],
        stepsNotes: [['', 'Skip the microwave', 'It heats unevenly. Cold or room temperature is fine too']] }; },
    bottle: () => ({ type: 'howto', label: 'Bottles', art: 'bottle', title: 'A paced bottle lets {o} lead',
      why: 'Going slowly means less air, and {s} {stop|stops} when {s’s} full.',
      pictureTitle: 'Positions', picture: () => H().TPLB.tiles([['heart', 'Cradled, sitting up', 'Head higher than {p} tummy'], ['sofa', 'Upright on your lap', 'Facing sideways, head supported'], ['bottle', 'Side-lying', 'Along your arm. Slows the flow']], CAT),
      steps: [['bottle', 'Bottle fairly level', 'With milk filling the nipple'], ['mouth', 'Let {o} draw it in', 'Touch the nipple to {p} lip'], ['clock', 'Pause every few sucks', 'Tip it down, then let {o} start again'], ['hand', 'Switch arms halfway', 'And burp every 2–3 oz']],
      stepsNotes: [['', 'Hold the bottle for every feed', 'Never prop it']],
      tipsTitle: 'Nipples and cleaning', tips: [['bottle', 'Start with the slowest flow', 'Go up when {s} {suck|sucks} hard and {get|gets} frustrated. Gulping or coughing means too fast.'], ['eye', 'Wide or narrow?', 'Neither is better. Stick with one {s} {take|takes} calmly.'], ['drop', 'Clean after every feed', mo() < 4 ? 'Hot, soapy water, and sanitize often in the first months.' : 'Hot, soapy water, or the dishwasher.']] }),
    formula: () => ({ type: 'howto', label: 'Bottles', art: 'bottle', title: 'Mix formula exactly as the label says',
      why: 'Extra water or powder changes what {s} {get|gets}.',
      steps: [['hand', 'Wash your hands', 'And use a clean bottle'], ['drop', 'Water first', 'The amount on the label'], ['bottle', 'Level scoops', 'Then shake well'], ['hand', 'Test on your wrist', 'Warm or room temperature']],
      stepsNotes: [mo() < 5 ? ['', 'Under 2 months, born early, or a weak immune system?', 'Boil the water and let it cool about 5 minutes first'] : ['', 'Water', 'Clean tap or bottled water is fine'], ['', 'Which formula?', 'Any standard iron-fortified formula. Ask before a special one']],
      tipsTitle: 'Mixing with breast milk', tips: breast() ? [['drop', 'Make the formula with water first', 'Breast milk can’t replace the water.'], ['bottle', 'Then add breast milk', 'Or give the breast milk first, then top up with formula.']] : null }),
    pump: () => { const m = mo();
      if (m < 1.5) return { type: 'howto', label: 'Pumping', art: 'bottle', title: 'Pump 8–12 times a day at first',
        why: 'Including once at night. It tells your body how much milk to make.',
        ordered: false, steps: [['clock', 'Every 2–3 hours', 'Day and night, at first'], ['heart', 'It shouldn’t hurt', 'Your nipple moves freely in the flange'], ['eye', 'Output varies', 'From session to session']],
        stepsNotes: [fam() ? ['', 'With formula too?', 'Pump what feels sustainable. Any amount of breast milk helps'] : null, ['', 'Clean pump parts', 'Wash them after every use, and let them air-dry']] };
      if (m < 8.5) return { type: 'howto', label: 'Pumping', art: 'bottle', title: 'Pumping a little less often is normal now',
        why: 'Once your supply settles, many parents pump less often. How much {s} {need|needs} stays about the same until solids.',
        ordered: false, steps: [['clock', 'Fewer sessions', 'Spread through the day'], ['moon', 'The night pump', 'Ask a lactation consultant before dropping it'], ['bottle', 'Same total', 'About 24–30 oz of milk a day']],
        stepsNotes: [fam() ? ['', 'With formula too?', 'Pump what feels sustainable. Any amount of breast milk helps'] : null, ['', 'Clean pump parts', 'Wash them after every use, and let them air-dry']] };
      return { type: 'howto', label: 'Pumping', art: 'bottle', title: 'Pump a little less as meals grow',
        why: 'As solids grow, {s} {need|needs} a little less milk, and you can pump a little less.',
        ordered: false, steps: [['clock', 'Drop one session at a time', 'One every few days, so you stay comfortable'], ['bottle', 'Less milk over time', 'About 3–4 milk bottles a day by 9–12 months'], ['heart', 'Keep going, or wind down', 'Both are fine']] }; },
    m1_apart: () => nurse()
      ? { type: 'howto', label: 'Time apart', art: 'bottle', title: 'A first bottle goes best from someone else',
        why: 'A bottle lets a partner, a sitter or a caregiver feed {o}.',
        ordered: false, steps: [['heart', 'Someone else offers it', '{S} may wait for you otherwise'], ['moon', 'A calm moment', 'Not too hungry, not too tired'], ['bottle', 'Slow and level', 'Let {o} pause, like at the breast']],
        stepsNotes: [['', 'Start small', 'About 1–2 oz'], ['', 'Keep it up', 'A few times a week, so {s} {stay|stays} used to it']] }
      : { type: 'howto', label: 'Time apart', art: 'bottle', title: 'Anyone can feed {o} a bottle',
        why: 'A few things keep bottles calm and safe, whoever is feeding.',
        ordered: false, stepsTitle: 'What to tell caregivers', steps: [['clock', 'Feed on cue', 'Not the clock'], ['bottle', 'Upright and level', 'So {s} can pause'], ['hand', 'Burp partway', 'And at the end']] },
    m2_away: () => nurse() && !fam()
      ? { type: 'howto', label: 'Time apart', art: 'bag', title: 'Leave about 1–1½ oz for each hour apart',
        why: 'Small bottles, labeled and kept cold, so little goes to waste.',
        ordered: false, steps: [['bottle', '2–4 oz per bottle', 'So less is wasted'], ['notepad', 'Label each one', '{P} name and the date'], ['fridge', 'Keep it cold', 'A cooler and ice packs']],
        stepsNotes: [['', 'How long it keeps', '4 hours out, 4 days in the fridge. Thawed: 24 hours, never refreeze'], ['', 'Back together?', 'Nurse as usual. Many babies nurse more in the evening after a day apart']] }
      : { type: 'howto', label: 'Time apart', art: 'bag', title: 'Pack bottles labeled, cold and ready to mix',
        why: 'The same safe bottles, packed to travel.',
        ordered: false, steps: [['notepad', 'Label', '{P} name and the date on each bottle'], ['fridge', 'Keep cold', 'A cooler and ice packs: 24 hours'], ['bottle', 'Pack to mix', 'Powder and water kept apart']] },

    // ---------- Feeding challenges ----------
    x_gas: () => ({ type: 'expect', label: 'Feeding challenges', art: 'bottle', title: 'Some gassy fussing every day is normal',
      why: 'It’s often worst in the evening, and a few things help.',
      do: [['bottle', 'Burp mid-feed', 'Not just at the end'], ['roll', 'Bicycle {p} legs', 'Gently, on {p} back'], ['mat', 'Tummy time', 'Awake and watched']],
      doNotes: [['', 'Gas drops and gripe water', 'Gas drops are safe, but often don’t help. Ask before gripe water']],
      calls: { ped: 'crying 3 or more hours a day, or grunting with every breath.' } }),
    x_spit: () => ({ type: 'check', label: 'Feeding challenges', art: 'drop', title: 'Spit-up is common, and usually fine',
      why: 'It looks like more than it is once it spreads out.',
      signs: [['drop', '1–2 tbsp', 'At a time, often normal'], ['clock', mo() < 5 ? 'Peaks around 4 months' : 'Past the peak', 'Gone by 9–12 months']],
      tell: [['', 'Usually fine', 'Comfortable, growing, and plenty of wet diapers']],
      helps: [['heart', 'Upright after feeds', 'For 20–30 minutes'], ['bottle', 'Smaller feeds', 'More often'], ['hand', 'Stop when {s} {slow|slows}', 'No need to finish']],
      helpsNotes: [['', 'For sleep', 'Flat on {p} back, even with spit-up. No wedges'], fam() ? ['', 'Is it the formula?', 'Spit-up happens on any formula. Ask before switching'] : null],
      calls: { ped: 'forceful or green vomit, blood, or crying and arching at most feeds.' } }),
    x_allergy: () => ({ type: 'check', label: 'Feeding challenges', art: 'steth', title: 'A milk allergy is uncommon, and treatable',
      why: 'Most gas, fussing and spit-up isn’t an allergy.',
      signs: [['smile', 'Usually not an allergy', 'Gas, fussing or spit-up, in a baby who’s growing'], ['eye', 'Could be an allergy', 'Blood or mucus in poop, a rash, or vomiting after most feeds']],
      helps: [['notepad', 'Take a photo', 'Of the diaper or the rash'], nurse() ? ['heart', 'Keep nursing', 'Your pediatrician will say if anything should change'] : ['bottle', fam() ? 'Keep {p} milk the same' : 'Keep the same formula', 'Ask your pediatrician before changing it']],
      calls: { ped: 'you see any of these, or {s’s} gaining slowly.' } }),
    x_gain: () => ({ type: 'check', label: 'Feeding challenges', art: 'steth', title: 'Slow weight gain is worth a closer look',
      why: 'Some babies are just smaller. Your pediatrician watches {p} growth curve, not one number.',
      tellTitle: 'What to watch', signs: [['eye', 'Swallows', 'Long sucks and swallowing, not just dozing'], ['diaper', 'Wet diapers', '6 or more a day after the first week']],
      helps: [['clock', 'Feed often', mo() < 1 ? '8–12 times a day in the first weeks' : 'On cue, and more often if your pediatrician says'], ['steth', 'Follow the plan', 'Top-ups or set times, if suggested']],
      calls: { ped: 'fewer wet diapers, {s’s} hard to wake for feeds, or not back to birth weight by 2 weeks.' } }),
    x_hurt: () => ({ type: 'expect', label: 'Feeding challenges', art: 'heart', title: 'Feeds shouldn’t hurt after the first minute',
      why: 'A little tenderness in the first week is common. Pain all feed long usually means a shallow latch.',
      do: [['hand', 'Re-latch', 'Break the seal with a clean finger, then try again'], ['heart', 'Try another hold', 'Football or laid-back often helps'], ['steth', 'Get it checked', 'A lactation consultant can check the latch']],
      doNotes: [['', 'Signs of tongue-tie', 'Clicking, a heart-shaped tongue tip, or long feeds with slow gain']],
      calls: { ped: 'pain at most feeds after the first week, or {s} {seem|seems} hungry after most feeds.' } }),
    x_nobottle: () => ({ type: 'expect', label: 'Feeding challenges', art: 'bottle', title: 'Won’t take a bottle? It often takes practice',
      why: 'Many babies who nurse refuse a bottle at first, especially from the parent who nurses.',
      do: [['heart', 'Someone else offers', 'Ideally with you out of the room'], ['moon', 'Before {s’s} very hungry', 'Calm and a little sleepy is easiest'], ['bottle', 'Slow flow, warm milk', 'Try another nipple shape if {s} {fight|fights} it']],
      doNotes: [['', 'Keep it low-pressure', 'A few minutes once a day. Upset? Stop, and try again tomorrow']],
      calls: { ped: '{s} {refuse|refuses} all feeds, or has fewer wet diapers.' } }),
    x_refuse: () => ({ type: 'expect', label: 'Feeding challenges', art: 'bottle', title: 'Fussing at feeds is usually a small fix',
      why: 'It’s often air, a fast flow, or a stuffy nose.',
      do: [['clock', 'Feed early', 'Before crying starts'], ['bottle', 'Burp, then retry', 'Trapped air can feel like full'], nurse() ? ['heart', 'Lean back', 'If milk comes fast'] : ['bottle', 'Check the nipple', 'Too fast or too slow?'], ['drop', 'Clear {p} nose', 'Saline and gentle suction']],
      doNotes: mo() >= 3 ? [['', 'Distracted?', 'From 3–4 months, feed somewhere quiet and dim']] : null,
      calls: { ped: 'too sleepy to feed, refusing several feeds in a row, or ' + fev() + '.' } }),

    // ---------- Solids ----------
    z_ready: () => ({ type: 'expect', label: 'Is {s} ready?', art: 'highchair', title: 'Solids usually start around 6 months',
      why: 'Never before 4 months. Until then, milk is all {s} {need|needs}.',
      normalTitle: 'Signs {s’s} ready', normal: [['head', 'Steady head', 'Holds it up well'], ['sit', 'Sits with support', 'In a high chair'], ['hand', 'Interested', 'Reaches for food'], ['swallow', 'Swallows', 'Moves food back, not out']],
      normalNotes: [['', 'Starting early', 'Doesn’t help {o} sleep longer']],
      do: mo() < 6 ? 'Ask about it at {p} 6-month checkup.' : 'Ask about it at {p} next checkup.' }),
    z_start: () => ({ type: 'howto', label: 'How to start', art: 'bowl', title: 'Spoon-feeding and finger foods both work',
      why: 'Research doesn’t favor one. When food is soft and safely shaped, the choking risk is similar.',
      pictureTitle: 'Three ways to start', picture: () => H().TPLB.tiles([['bowl', 'Spoon-fed', 'Thicker and lumpier over time'], ['hand', 'Finger foods', 'Soft strips {s} {feed|feeds} {o}self'], ['plate', 'A mix', 'Spoon iron-rich foods, plus soft strips']], CAT),
      stepsTitle: 'Start with iron-rich foods', ordered: false, steps: [['meat', 'Meat', 'Soft or ground'], ['lentils', 'Beans or lentils', 'Mashed'], ['oats', 'Iron-fortified oatmeal', 'Thinned with milk'], ['egg', 'Egg', 'Well cooked'], ['avocado', 'Avocado', 'Mashed or in strips'], ['potato', 'Sweet potato', 'Soft-cooked']],
      tips: [['bowl', 'Soft and squishable', 'Smooth, mashed, or strips that squish between your fingers.'], ['highchair', 'Seated upright, with you', 'In a high chair with a harness, every time.'], ['plate', 'No added salt or sugar', 'Take {p} portion out before seasoning.']] }),
    z_meal: () => mo() >= 8.5
      ? { type: 'howto', label: 'Feeding {o}self', art: 'plate', title: 'Most family food works for {o} now',
        why: 'Soften it, and skip the added salt.',
        pictureTitle: 'Ideas from your plate', picture: () => H().TPLB.tiles([['meat', 'Shredded chicken', ''], ['egg', 'Scrambled egg', ''], ['lentils', 'Squashed beans', ''], ['bowl', 'Soft pasta', ''], ['avocado', 'Banana or ripe pear', ''], ['potato', 'Soft-cooked veggies', '']], CAT),
        ordered: false, steps: [['plate', 'From your plate', 'Take out {p} portion before adding salt'], ['hand', '{S} {feed|feeds} {o}self', 'Fingers first, a spoon to practice']] }
      : { type: 'howto', label: 'How a meal goes', art: 'highchair', title: 'First meals are just a few bites',
        why: 'Solids are practice for now. Let {o} set the pace.',
        steps: [['highchair', 'Sit {o} up', 'Strapped in, facing you, at a calm time'], ['bowl', 'Offer a little', 'A spoonful, or a soft strip to hold'], ['eye', 'Let {o} lead', 'Opens up, more. Turns away, done']],
        stepsNotes: [['', 'Expect mess', 'Funny faces too. Most of it ends up on the tray at first']] },
    z_textures: () => ({ type: 'expect', label: 'Beyond purées', art: 'avocado', title: 'Move from smooth food to soft pieces',
      why: 'Try the next texture once {s} {handle|handles} the last one easily.',
      normalTitle: 'Textures, as {s} {grow|grows}', normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['bowl', 'Around 6 months', 'Smooth and mashed'], ['avocado', '7–8 months', 'Lumpy mash, soft strips'], ['plate', '9 months on', 'Soft, chopped family food']], caption: 'Smooth and mashed around 6 months, lumpy mash and soft strips at 7 to 8 months, soft chopped family food from 9 months.' }),
      normalNotes: [['', 'Why not wait', 'Babies who stay on smooth purées a long time can find lumps harder later']],
      do: [['bowl', 'Mash with a fork', 'Instead of blending'], ['clock', 'One new texture at a time', 'Like lumpy banana, or flaked fish']] }),
    z_rotate: () => ({ type: 'expect', label: 'Keeping foods in rotation', art: 'peanut', title: 'Keep allergens in {p} meals once tried',
      why: 'A few times a week, for each one {s’s} had. Regular tastes help keep them safe for {o}.',
      do: [['peanut', 'Peanut', 'Powder or thinned peanut butter, in oatmeal or yogurt'], ['egg', 'Egg', 'A couple of times a week: scrambled, or in pancakes']],
      doNotes: [['', 'Variety', 'Different flavors and colors now make new foods easier later']] }),
    z_shapes: () => ({ type: 'howto', label: 'Safe finger foods', art: 'hand', title: 'Finger foods should squish when pressed',
      why: 'If it squashes between your fingers, {p} gums can manage it.',
      pictureTitle: 'Sizes by age', picture: () => H().TPLB.tiles([['hand', 'Before 9 months', 'Finger-size strips {s} can hold in {p} fist'], ['hand', 'From about 9 months', 'Small, pea-size pieces {s} can pinch']], CAT),
      ordered: false, stepsTitle: 'Cut and cook it safe', steps: [['plate', 'Quarter grapes', 'And cherry tomatoes, lengthwise'], ['bowl', 'Spread nut butters thin', 'Never in a lump'], ['pot', 'Cook hard veg soft', 'Like carrots'], ['hand', 'Take out the hard bits', 'Skins, pits and bones']] }),
    z_allergens: () => ({ type: 'howto', label: 'Common allergens', art: 'peanut', title: 'Try the common allergens early',
      why: 'Start them with first foods, around 6 months. Trying them early lowers the chance of a food allergy.',
      pictureTitle: 'Keep track', picture: () => X().pron(window.__alCard()),
      ordered: false, steps: [['peanut', 'One at a time', 'At home, earlier in the day'], ['egg', 'In a safe form', 'Thinned peanut butter or powder, egg well cooked'], ['plate', 'Keep it in {p} meals', 'Once it’s in']],
      stepsNotes: [['', 'Severe eczema or an egg allergy?', 'Ask your pediatrician before starting peanut']],
      tipsTitle: 'If there’s a reaction', tips: [['steth', 'A few hives, or vomiting', 'Call your pediatrician.'], ['alarm', 'Trouble breathing, or swelling of the lips or face', 'Or hives all over, hives with vomiting, or very sleepy or floppy. Call 911.']] }),
    z_plan: () => ({ type: 'expect', label: 'Foods to wait on', art: 'plate', title: 'No honey before 1, no choking risks before 4',
      why: 'A few foods aren’t safe for babies yet, even once solids are going well.',
      normalTitle: 'Wait until 1', normal: [['drop', 'Honey', 'It can carry botulism'], ['cup', 'Cow’s milk to drink', 'Fine in cooking'], ['cup', 'Juice', 'Water and milk instead']],
      doTitle: 'Choking risks, until 4', do: [['coin', 'Whole nuts', ''], ['plate', 'Whole grapes', ''], ['bowl', 'Popcorn', ''], ['meat', 'Hot dog rounds', ''], ['leaf', 'Hard raw veg', ''], ['peanut', 'Thick nut butter', '']],
      doNotes: [['', 'Some can be made safe', 'Cut or cooked soft, once {s’s} on finger foods']] }),
    z_milkfood: () => ({ type: 'expect', label: 'Milk and solids', art: 'cup', title: 'No set order for milk and meals',
      why: 'A meal fits in wherever {s’s} awake and happy.',
      do: [['bottle', 'Milk before or after', 'Whatever works for {o}'], ['cup', 'Water from a cup', 'Open or straw. Hold it, and let {o} try']],
      doNotes: [['', 'As meals grow', 'Milk drops a little at a time, mostly after 9 months']] }),
    z_day: () => ({ type: 'expect', label: 'Meals and milk', art: 'plate', title: 'Some days {s} {eat|eats} a lot, some days little',
      why: 'You choose what and when. {S} {choose|chooses} how much.',
      normalTitle: 'A typical week of meals',
      normal: () => { const v = [70, 35, 50, 90, 40, 60, 80], d = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        return `<figure class="hub-figure tpl-week" role="img" aria-label="${H().F('How much a baby eats over a week: some days a lot, some days little. It evens out.')}"><div class="tpl-week-bars">${v.map((x, i) => `<div><i style="height:${x}%"></i><small>${d[i]}</small></div>`).join('')}</div></figure>`; },
      normalNotes: [['', 'It evens out', 'Over the week']],
      do: [['plate', 'Keep offering', 'Without pressure'], ['clock', 'Look at the week', 'Not one meal']],
      doNotes: [['', 'Getting enough?', 'Wet diapers, energy, and steady growth at checkups']] }),
    z_milk12: () => { const b = X().isBottle();
      return { type: 'expect', label: 'Turning 1', art: 'cup', title: 'Start cups now, whole milk at 12 months',
        why: 'Starting a cup now makes saying goodbye to bottles easier later.',
        normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['cup', 'Now', 'An open or straw cup at meals'], ['cup', '12 months', b ? 'Formula to whole milk' : 'Whole milk in a cup, if you like'], ['bottle', '12–18 months', b ? 'Bottles phase out, bedtime last' : 'Nursing can keep going']], caption: 'A cup at meals now, whole milk at 12 months, and bottles phase out between 12 and 18 months.' }),
        do: [['cup', 'Whole milk', 'Not low-fat, until age 2'], ['cup', 'Up to 24 oz a day', b ? 'More crowds out iron-rich food' : 'From a cup. Nursing doesn’t count'], b ? ['bottle', 'One bottle at a time', 'Swap for a cup about a week apart'] : null].filter(Boolean),
        doNotes: [b ? ['', 'Picky about the taste?', 'Mix half and half with formula for a week. Toddler formula isn’t needed'] : null, ['', 'Vitamin D after 1', 'Ask your pediatrician what {s} {need|needs}']] }; },
    z_refuse: () => ({ type: 'expect', label: 'Feeding challenges', art: 'plate', title: 'Refusing food is common',
      why: 'Some days {s}’ll eat a lot, some days almost nothing.',
      do: [['clock', 'Try again later', 'It can take 10–15 tries'], ['hand', 'Let {o} touch it', 'Playing is learning'], ['plate', 'Eat together', '{S} {copy|copies} you']],
      doNotes: [['', 'You decide, {s} {decide|decides}', 'You choose what to offer. {S} {choose|chooses} whether and how much']],
      calls: { ped: 'refusing most foods for weeks, or fewer wet diapers.' } }),
    z_teeth: () => ({ type: 'expect', label: 'Feeding challenges', art: 'tooth', title: 'Teething can make feeds short and fussy',
      why: 'Sore gums can make feeds fussy for a few days.',
      do: [['snow', 'Something cold', 'A teether or cold washcloth'], ['bowl', 'Chilled food', 'Yogurt or mashed fruit'], ['clock', 'Shorter feeds', 'More often, for a few days']],
      doNotes: [['', 'Not for babies', 'Teething gels with benzocaine, or amber necklaces']],
      calls: { ped: fev() + ', or refusing to drink. Teething doesn’t cause fevers.' } }),
    z_sick: () => ({ type: 'expect', label: 'Feeding challenges', art: 'thermo', title: 'When {s’s} sick, milk and fluids come first',
      why: '{S} may eat less for a few days, and that’s okay.',
      do: [['bottle', 'Milk more often', 'In smaller amounts'], ['drop', 'Clear {p} nose', 'Saline before feeds'], ['bowl', 'Solids can wait', 'Until {s} {feel|feels} better']],
      calls: { ped: 'fewer wet diapers, refusing milk, or vomiting that keeps happening.' } }),
    z_reaction: () => ({ type: 'check', label: 'Feeding challenges', art: 'smile', title: 'Redness around the mouth is usually the food',
      why: 'Acidic foods can redden the skin they touch. A true reaction looks different.',
      signs: [['smile', 'Usually fine', 'Redness only where food touched, that fades'], ['eye', 'A true reaction', 'Hives, vomiting, or a rash that spreads']],
      helps: [['notepad', 'Note it', 'The food, and what happened. A photo helps'], ['clock', 'Hold off on that food', 'Ask before trying it again']],
      calls: { ped: 'a few hives, vomiting, or a rash that spreads.', now: 'trouble breathing, swelling of the lips or face, hives all over, hives with vomiting, or {s’s} very sleepy or floppy.', nowLabel: 'Call 911' } }),
    z_gag: () => ({ type: 'urgent', label: 'Gagging or choking', art: 'mouth', title: 'Gagging is normal. Choking is silent.',
      why: 'Gagging is how {s} {learn|learns} to handle food. It’s loud and can look scary, but it’s safe.',
      signs: [['mouth', 'Gagging: normal', 'Loud coughing, red face. Let {o} work it out'], ['alarm', 'Choking: act now', 'Silent or a high squeak, can’t cough or cry, turning blue']],
      tell: [['', 'Less likely when', '{S’s} seated upright, watched, with soft finger-size food']],
      doTitle: 'If {s’s} choking', doOrdered: true, do: [['hand', 'Back blows, 5 times', 'Face down along your forearm, head lower than {p} chest'], ['heart', 'Chest thrusts, 5 times', 'Face up, two fingers mid-chest'], ['clock', 'Repeat', 'Until it comes out, or help arrives']],
      link: ['https://www.redcross.org/take-a-class/cpr/performing-cpr/child-baby-cpr', 'Watch infant choking first aid · American Red Cross'],
      calls: { now: '{s} can’t cough, cry or breathe. Have someone call while you start back blows. If {s} {stop|stops} responding, start CPR.', nowLabel: 'Call 911' } })
  };

  // The two "Something not quite right?" menus keep their list, and end with the shared call card instead of the old boxes.
  const MENU = {
    x_tough: () => ({ ped: 'fewer wet diapers, too sleepy to feed, green or bloody vomit, or ' + fev() + '.' }),
    z_tough: () => ({ ped: 'vomiting or hives after a food, fewer wet diapers, or ' + fev() + '.', now: 'trouble breathing, or swelling of the lips or tongue.', nowLabel: 'Call 911' })
  };
  const menuTail = (h, calls) => { const i = h.indexOf('<section class="ss-moment"><section class="hub-card hub-versus"'); if (i < 0) return h;
    const tail = h.slice(i), styles = (tail.match(/<style>[\s\S]*?<\/style>/g) || []).join(''), t = tail.replace(/<style>[\s\S]*?<\/style>/g, '');
    const open = (t.match(/<div\b/g) || []).length, close = (t.match(/<\/div>/g) || []).length;
    return h.slice(0, i) + `<div class="care-tpl is-urgent">${H().TPLB.calls(calls)}</div>` + styles + '</div>'.repeat(Math.max(0, close - open)); };

  // Older Feeding pages that now open one of these.
  const ALIAS = { y_growth: 'enough', y_nurse: 'm1_now', y_bottle: 'm1_now', y_away: () => (X().stg() === 1 && mo() < 3 ? 'm1_apart' : 'm2_away'), y_night: 'm1_eve', y_evening: 'm1_eve',
    z_signs: 'z_ready', z_setup: 'z_start', z_tray: 'z_start', z_allergy: 'z_plan', z_notyet: 'z_plan', z_water: 'z_milkfood', z_family: 'z_meal', z_appetite: 'z_day' };
  const base = window.changesRoute;
  window.changesRoute = function (r, ...a) {
    if (window.__fdx && X().oldFeeding) r = X().oldFeeding(r);
    const q = String(r).split(':');
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && window.__hub && window.__fdx) {
      const al = ALIAS[q[3]]; if (al) q[3] = typeof al === 'function' ? al() : al;
      if (T[q[3]]) { const page = T[q[3]](q[4]); if (page) { window.__fdLast = r; return H().tplPage(CAT, page); } }
      if (MENU[q[3]]) return menuTail(base.call(this, r, ...a), MENU[q[3]]());
    }
    return base.call(this, r, ...a);
  };
})();
