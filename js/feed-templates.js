/* Feeding on the shared page templates (Nov 16; see claude/ahead-page-templates.md).
   Each Feeding page is data: { type, label, art, title, why, ...fields }, drawn by the same templates as Sleep.
   Pages not listed here (the stage pages, the step-by-step feed and bottle walkthroughs, the example day) keep their own design. */
(function () {
  const H = () => window.__hub, X = () => window.__fdx, CAT = 'Feeding';
  const mo = () => X().ageMo(), nurse = () => X().nurses(), breast = () => X().isBreast(), fam = () => X().formulaFam(), pump = () => X().pumps();
  const onlyFormula = () => !breast();
  // Real age, for babies born early: birth-weight and first-week lines follow it (adjusted age sets the stage).
  const early = () => typeof profile !== 'undefined' && !!(profile && profile.early);
  const realMo = () => (typeof actualMonth === 'function' ? actualMonth() : mo());
  // The fever rule for the baby's age, short enough for a call line.
  const fev = () => { const m = mo(); return m < 3 ? 'a fever of 100.4°F or higher, day or night' : m < 6 ? 'a fever of 101°F or higher' : 'a fever of 103°F or higher, or one lasting over a day'; };
  const T = {
    // ---------- Milk: is it going well? ----------
    nb_enough: () => ({ type: 'expect', label: 'Getting enough', art: 'diaper', title: 'Wet diapers are the best everyday sign',
      why: 'You don’t need to measure feeds. Diapers every day, and weight at checkups, tell you.',
      normalTitle: 'Wet diapers and poop, day by day',
      normal: () => realMo() < 1 ? X().pron(X().firstCard(X().xBody(X().P.x_enough))) : realMo() >= 1 ? H().TPLB.tiles([['diaper', '6 or more', 'Wet diapers a day'], ['steth', 'Steady gain', 'At each weight check']], CAT) : window.hubStageStrip({ title: '', cat: CAT, items: [['diaper', 'Days 1–2', '1–2'], ['diaper', 'Days 3–4', '3–4'], ['diaper', 'Day 5', 'About 5'], ['diaper', 'Day 6 on', '6 or more']], caption: 'Wet diapers a day: 1 to 2 on days 1 and 2, 3 to 4 on days 3 and 4, about 5 on day 5, then 6 or more.' }),
      moreTitle: '{P} weight', more: () => realMo() < 1 ? X().pron(X().weightViz()) : '',
      normalNotes: [nurse() ? ['', 'Good signs during feeds', 'Long sucks, and swallows you can hear'] : null, ['', 'After most feeds', '{S’s} content for a while']],
      do: [['notepad', 'Note feeds and diapers', 'Until things feel settled'], ['steth', 'Go to the weight checks', 'No need to weigh at home']],
      calls: { ped: realMo() >= 1 ? 'fewer wet diapers, dark urine, or {s} {seem|seems} hungry after most feeds.' : 'fewer wet diapers, dark urine, black poop after day 5, or not back to birth weight by 2 weeks.' } }),
    enough: () => ({ type: 'expect', label: 'Getting enough', art: 'diaper', title: 'Wet diapers show {s’s} getting enough',
      why: mo() >= 6 || onlyFormula() ? 'No need to measure feeds. Your pediatrician checks {p} weight at each visit.' : 'Fewer poops can be normal after about 6 weeks. Wet diapers and growth are what count.',
      normal: [['diaper', '6 or more wet diapers', 'Every day'], ['steth', 'Steady growth', 'Checked at each visit']],
      calls: { ped: 'fewer than 6 wet diapers a day, or {s’s} feeding much less.' } }),
    m1_now: () => ({ type: 'expect', label: 'Feeds now', art: 'clock', title: 'Hungrier some days? Often a growth spurt',
      why: 'Expect 2–3 hungrier days around 6 weeks and 3 months.',
      normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['clock', 'Around 6 weeks', '2–3 hungrier days'], ['moon', 'In between', 'Calmer weeks'], ['clock', 'Around 3 months', 'Another one, then it passes']], caption: 'A growth spurt around 6 weeks, calmer weeks in between, and another around 3 months.' }),
      do: nurse() ? 'Feed more often for a few days, and your milk catches up.' : 'Offer a little more if {s} still {seem|seems} hungry.',
      doNotes: nurse() ? [['', 'Pulls off and fusses?', 'Burp, then try again. Milk coming fast? Lean back']] : [['', 'Sucks hard and gets frustrated?', 'Try the next nipple size'], ['', 'Gulping or spilling?', 'Stay with the slower one']] }),
    m1_eve: () => ({ type: 'expect', label: 'Evenings and nights', art: 'moon', title: 'Night feeds are normal for now',
      why: 'Some babies sleep one longer stretch by now. Many don’t yet.',
      normal: [['moon', '1–3 night feeds', 'Common now'], ['sunrise', 'Fussy evenings', 'Peak around 6 weeks, ease by 3–4 months']],
      do: 'Gaining well, says your pediatrician? You can stop waking {o}. Still feed {o} when {s} {wake|wakes} hungry.' }),
    nb_eve: () => ({ type: 'expect', label: 'Evenings and nights', art: 'moon', title: 'Busy evenings, then quick and calm nights',
      why: 'Evenings can be feed after feed. Keep night feeds short and sleepy.',
      do: [['sunrise', 'Evenings', nurse() ? 'Switch sides often' : 'Smaller bottles, more often'], ['moon', 'Nights', 'Dim and quiet. Change only if soiled'], realMo() >= 1 ? null : ['clock', 'Until back to birth weight', 'Wake {o} if 3 hours pass']].filter(Boolean),
      doNotes: [['', 'Hard to wake?', 'Undress {o} to {p} diaper, or stroke {p} feet']],
      calls: { ped: '{s’s} too sleepy to feed most times.' } }),
    m2_night: () => ({ type: 'expect', label: 'Evenings and nights', art: 'moon', title: 'Night feeds are common for a while',
      why: 'Many babies still feed once or twice a night. Feeding {o} back to sleep is fine.',
      normal: [['moon', '1–2 night feeds', 'Still common'], ['sun', 'Busy days', 'Distracted daytime feeds can mean more at night']],
      do: 'Feed {o} when {s} {wake|wakes}. Ask about dropping night feeds at {p} 4-month checkup.' }),
    m2_distract: () => ({ type: 'expect', label: 'Distracted feeds', art: 'eye', title: 'Short daytime feeds are perfectly okay',
      why: '{S} may gulp, pop off and look around. {S} still {get|gets} enough over the day.',
      do: [['moon', 'Feed when drowsy', 'Just waking, or before sleep'], ['hand', 'Something to hold', 'Your finger, or a soft toy'], ['chat', 'Talk less', 'Save the chatting for after']],
      doNotes: [['', 'Pops off?', 'End the feed, and try again a little later. No need to force it']],
      calls: { ped: 'fewer wet diapers than usual, or feeding much less for more than a few days.' } }),

    // ---------- Every day ----------
    nb_vitd: () => onlyFormula()
      ? { type: 'howto', label: 'Every day', art: 'drop', title: 'Vitamin D drops, every day for now',
        why: 'Formula covers it once {s} {drink|drinks} about 32 oz a day. Until then, give drops too.',
        ordered: false, steps: [['drop', 'The label’s dose', 'Using the dropper that comes with them'], ['mouth', 'Inside {p} cheek', 'Drip it in slowly'], ['bottle', 'Or mixed in 1 oz of milk', 'Make sure {s} {finish|finishes} it']],
        stepsNotes: mo() < 6 ? [['', 'No water yet', 'Milk is all {s} {need|needs} until about 6 months, even on hot days']] : null }
      : { type: 'howto', label: 'Every day', art: 'drop', title: 'Vitamin D drops, every single day',
        why: 'Vitamin D builds strong bones, and breast milk has very little. A few drops a day fill in the gap.',
        pictureTitle: 'What {s} {need|needs}', picture: () => H().TPLB.tiles([['sun', 'Vitamin D', '400 IU a day, through {p} first year'], ['drop', 'Iron', fam() ? 'Drops from 4 months, if mostly breast milk' : mo() < 4 ? 'Drops usually start at about 4 months' : 'Drops from 4 months, until iron-rich foods are going well']], CAT),
        ordered: false, steps: [['drop', 'The label’s dose', 'Using the dropper that comes with them'], ['mouth', 'Inside {p} cheek', nurse() ? 'Or on the nipple, just before a feed' : 'Drip it in slowly'], ['bottle', 'Or mixed in 1 oz of milk', 'Make sure {s} {finish|finishes} it']],
        stepsNotes: mo() < 6 ? [['', 'No water yet', 'Milk is all {s} {need|needs} until about 6 months, even on hot days']] : null },
    // Nov 17: AAP clinical report (Pediatrics, July 2026). Exclusively breastfed babies born at term: iron by 4 months,
    // or wait for iron-rich foods at 6. Born early: iron starts in the first weeks, on the pediatrician's plan.
    z_iron: () => early()
      ? { type: 'expect', label: 'Iron', art: 'drop', title: 'Babies born early need iron sooner',
        why: 'Most iron is stored in the last weeks of pregnancy, so babies born early start with less. It usually starts in the first weeks.',
        normalTitle: 'Iron',
        normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['drop', 'First weeks', 'Iron starts, from drops or formula'], ['bowl', '6 months on', 'Iron-rich foods join in']], caption: 'For babies born early, iron starts in the first weeks, from drops or formula. Iron-rich foods join in from about 6 months.' }),
        do: 'Follow the iron plan from your pediatrician or the hospital. Not sure {s’s} on one? Call and ask.',
        doNotes: [['', 'Darker poop?', 'Iron can cause it. That’s normal']] }
      : { type: 'expect', label: 'Iron', art: 'drop', title: 'Breastfed babies need extra iron by 6 months',
        why: 'Iron stores run low from about 4 months, and breast milk has very little.',
        normalTitle: 'Two ways to get it',
        normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['drop', '4 months', 'Iron drops'], ['bowl', 'Or 6 months', 'Iron-rich foods from the first meals']], caption: 'Either iron drops from 4 months, or iron-rich foods from the first meals at about 6 months.' }),
        do: mo() < 4.5 ? 'Ask about iron at the 4-month checkup, and choose drops now or iron-rich foods at 6 months.' : 'Not on drops? Make iron-rich foods part of the first meals.',
        doNotes: [fam() ? ['', 'Mostly formula?', 'Iron-fortified formula has iron. Ask at the checkup if {s} {need|needs} more'] : null, ['', 'Darker poop?', 'Iron can cause it. That’s normal']] },
    // ---------- Bottles ----------
    basics: () => { const br = breast() && (pump() || X().stored()), fm = fam();
      const head = br && fm ? ['', 'Breast milk', 'Formula'] : ['', br ? 'Breast milk' : 'Formula'];
      const rows = br && fm ? [['Counter', 'Up to 4 hours', '2 hours after making it'], ['Fridge', 'Up to 4 days', 'Up to 24 hours. Night bottles can be made ahead'], ['Freezer', 'Best within 6 months', 'Don’t freeze'], ['Thawed', '24 hours in the fridge. Don’t refreeze', '—'], ['Left over after a feed', 'Within 2 hours', 'Within 1 hour, then toss it']]
        : br ? [['Counter', 'Up to 4 hours'], ['Fridge', 'Up to 4 days'], ['Freezer', 'Best within 6 months, up to 12'], ['Thawed', '24 hours in the fridge. Don’t refreeze'], ['Left over after a feed', 'Within 2 hours']]
        : [['Counter', '2 hours after making it'], ['Fridge', 'Up to 24 hours. Night bottles can be made ahead'], ['Freezer', 'Don’t freeze'], ['Left over after a feed', 'Within 1 hour of starting, then toss it']];
      return { type: 'howto', label: 'Bottles', art: 'fridge', title: br && fm ? 'Breast milk keeps 4 hours out, formula 2' : br ? 'Breast milk keeps 4 hours out, 4 days cold' : 'Formula keeps 2 hours out, 24 in the fridge',
        why: br ? 'Use these times for every bottle.' : 'Night bottles can be made ahead and kept cold.',
        pictureTitle: 'How long it keeps', picture: () => H().TPLB.table(head, rows).replace('</section>', H().TPLB.ul(br ? [fm ? ['', 'Mixed bottle', 'Like formula: within 1 hour once {s} {start|starts}'] : null, ['', 'Adding to stored milk', 'Cool the fresh milk in the fridge first']] : []) + '</section>'),
        stepsTitle: 'Warming a bottle', steps: [['drop', 'Warm water', 'Or a bottle warmer'], ['bottle', 'Swirl', 'To mix it'], ['hand', 'Test it on your wrist', 'Warm, not hot']],
        stepsNotes: [['', 'Skip the microwave', 'It heats unevenly. Cold or room temperature is fine too']] }; },
    bottle: () => ({ type: 'howto', label: 'Bottles', art: 'bottle', title: 'A paced bottle lets {o} take the lead',
      why: 'Going slowly means less air, and {s} {stop|stops} when {s’s} full.',
      hero: () => H().TPLB.photoPins('feeding/pace-photo', 'A parent holding a baby upright with the bottle about level', [['Bottle about level', 55, 44, 'l'], ['Baby upright', 77, 62, 'b']], 'is-pace'),
      pictureTitle: 'Positions', picture: () => H().TPLB.tiles([['heart', 'Cradled, sitting up', 'Head higher than {p} tummy'], ['sofa', 'Upright on your lap', 'Facing sideways, head well supported'], ['bottle', 'Side-lying', 'Along your arm. Slows the flow']], CAT),
      // Nov 19: the same three steps and note as the walkthrough's Bottle step, word for word.
      steps: [['mouth', 'Let {o} draw it in', 'Touch the nipple to {p} lip'], ['clock', 'Pause every few sucks', 'Tip it down, then let {o} start again'], ['hand', 'Stop when {s’s} done', 'Even if milk is left. Burp every 2–3 oz']],
      stepsNotes: [['', 'Never prop a bottle', 'Always hold {o} and the bottle']],
      tipsTitle: 'Nipples and cleaning', tipsFold: true, tips: [['bottle', 'Start with the slowest flow', 'Go up when {s} {suck|sucks} hard and {get|gets} frustrated. Gulping or coughing means it’s too fast.'], ['eye', 'Wide or narrow?', 'Neither is better. Stick with the one {s} {take|takes} calmly.'], ['drop', 'Clean after every feed', mo() < 4 ? 'Hot, soapy water, and sanitize often in the first months.' : 'Hot, soapy water, or the dishwasher.']] }),
    formula: () => ({ type: 'howto', label: 'Bottles', art: 'bottle', title: 'Mix formula exactly as the label says',
      why: 'Extra water or powder changes what {s} {get|gets} from it.',
      // Nov 19 (review): the water and scoop photos show the measuring itself; the steps match the walkthrough's.
      steps: [['photo:feeding/formula-1', 'Wash', 'Hands, counter and bottle'], ['photo:feeding/formula-water', 'Water first', realMo() < 2 || early() ? 'Boiled, cooled 5 minutes, to the line the label says' : 'To the line the label says'], ['photo:feeding/formula-scoop', 'Then level scoops', 'Flat, never heaped. Then shake'], ['photo:feeding/formula-4', 'Test on your wrist', 'Warm, never hot']],
      stepsNotes: [realMo() < 2 || early() ? ['', 'Why hot water?', 'It kills a rare germ in powder. It matters most under 2 months, or if born early'] : ['', 'Water', 'Clean tap or bottled water is fine. Boiled and cooled if {s} has a weak immune system'], ['', 'Which formula?', 'Any standard iron-fortified formula. Ask before a special one']],
      tipsTitle: 'Mixing with breast milk', tips: breast() ? [['drop', 'Make the formula with water first', 'Breast milk can’t replace the water.'], ['bottle', 'Then add breast milk', 'Or give the breast milk first, then top up with formula.']] : null }),
    pump: () => { const m = mo();
      if (m < 1.5) return { type: 'howto', label: 'Pumping', art: 'bottle', title: 'Pump 8–12 times a day at first',
        why: 'Including once at night. It tells your body how much milk to make.',
        ordered: false, steps: [['clock', 'Every 2–3 hours', 'Day and night, at first'], ['heart', 'It shouldn’t hurt', 'Your nipple moves freely in the flange'], ['eye', 'Output varies', 'From session to session']],
        stepsNotes: [fam() ? ['', 'With formula too?', 'Pump what feels sustainable. Any amount of breast milk helps'] : null, ['', 'Clean pump parts', 'Wash them after every use, and let them air-dry']] };
      if (m < 8.5) return { type: 'howto', label: 'Pumping', art: 'bottle', title: 'Pumping a little less often is normal now',
        why: 'Once your supply settles, fewer sessions is fine.',
        ordered: false, steps: [['clock', 'Fewer sessions', 'Spaced through the day'], ['moon', 'The night pump', 'Ask before dropping it'], ['bottle', 'About 24–30 oz a day', 'What {s} {need|needs} until solids']],
        stepsNotes: fam() ? [['', 'With formula too?', 'Pump what feels sustainable. Any amount of breast milk helps']] : null };
      return { type: 'howto', label: 'Pumping', art: 'bottle', title: 'Pump a little less as meals grow',
        why: 'As solids grow, {s} {need|needs} a little less milk, and you can pump a little less.',
        ordered: false, steps: [['clock', 'Drop one session at a time', 'One every few days, so you stay comfortable'], ['bottle', 'Less milk over time', 'About 3–4 milk bottles a day by 9–12 months'], ['heart', 'Keep going, or wind down', 'Both are fine']] }; },
    m1_apart: () => nurse()
      ? { type: 'howto', label: 'Time apart', art: 'bottle', title: 'A first bottle goes best from someone else',
        why: 'A bottle lets a partner, a sitter or a caregiver feed {o}.',
        ordered: false, steps: [['heart', 'Someone else offers it', '{S} may wait for you otherwise'], ['moon', 'A calm moment', 'Not too hungry, not too tired'], ['bottle', 'Slow and level', 'Let {o} pause, like at the breast']],
        stepsNotes: [['', 'Start small', 'About 1–2 oz'], ['', 'Keep it up', 'A few times a week, so {s} {stay|stays} used to it']] }
      : { type: 'howto', label: 'Time apart', art: 'bottle', title: 'Anyone can feed {o} from a bottle',
        why: 'Share these three with anyone who feeds {o}.',
        ordered: false, stepsTitle: 'What to tell caregivers', steps: [['clock', 'Feed on cue', 'Not the clock'], ['bottle', 'Sit {o} up, bottle level', 'So {s} can pause'], ['hand', 'Burp partway', 'And at the end']] },
    m2_away: () => !fam()
      ? { type: 'howto', label: 'Time apart', art: 'bag', title: 'Leave about 1–1½ oz for each hour apart',
        why: 'Small bottles, labeled and kept cold, so little goes to waste.',
        ordered: false, steps: [['bottle', '2–4 oz per bottle', 'So less is wasted'], ['notepad', 'Label each one', '{P} name and the date'], ['fridge', 'Keep it cold', 'In a cooler with ice packs']],
        stepsNotes: [['', 'How long it keeps', '4 hours out, 4 days in the fridge. Thawed: 24 hours, never refreeze'], ['', 'Back together?', 'Nurse as usual. Many babies nurse more in the evening after a day apart']] }
      : { type: 'howto', label: 'Time apart', art: 'bag', title: 'Pack bottles labeled, cold and ready to mix',
        why: 'Three things before you hand {o} off.',
        ordered: false, steps: [['notepad', 'Label', '{P} name and the date on each bottle'], ['fridge', 'Keep cold', 'Cooler with ice packs, up to 24 hours'], ['bottle', 'Pack to mix', 'Powder and water kept apart']] },

    // ---------- Feeding challenges ----------
    x_gas: () => ({ type: 'expect', label: 'Feeding challenges', art: 'bottle', title: 'Some gassy fussing every day is normal',
      why: 'It’s often worst in the evening, and a few things help.',
      do: [['photo:feeding/gas-burp', 'Burp mid-feed', 'Not just at the end'], ['photo:feeding/gas-legs', 'Bicycle {p} legs', 'Gently, with {o} on {p} back'], ['photo:feeding/gas-tummy', 'Tummy time', 'Awake and watched']],
      doNotes: [['', 'Gas drops and gripe water', 'Gas drops are safe, but often don’t help. Ask before gripe water']],
      calls: { ped: 'crying 3 or more hours a day, or grunting every time {s} {breathe|breathes}.' } }),
    x_spit: () => ({ type: 'check', label: 'Feeding challenges', art: 'drop', title: 'Spit-up is common, and usually fine',
      why: 'A little looks like a lot once it spreads.',
      figure: () => H().TPLB.versus(['Normal spit-up', 'About 1–2 tbsp at a time, in a baby who’s comfortable and growing.'], ['Worth a call', 'Forceful or green, with blood, or crying and arching at most feeds.'], [['', 'It passes', (mo() < 5 ? 'It peaks around 4 months' : 'It’s past the peak') + ', and usually gone by about 9–12 months']]),
      helps: [['heart', 'Upright after feeds', 'For 20–30 minutes'], ['bottle', 'Smaller feeds', 'More often'], ['hand', 'Stop when {s} {slow|slows}', 'No need to finish']],
      helpsNotes: [['', 'For sleep', 'Flat on {p} back, even with spit-up, and no wedges']],
      calls: { ped: 'spit-up that’s forceful, green or bloody, or {s’s} not gaining weight.' } }),
    x_allergy: () => ({ type: 'check', label: 'Feeding challenges', art: 'steth', title: 'A milk allergy is uncommon, and treatable',
      why: 'Most gas, fussing and spit-up isn’t an allergy at all.',
      figure: () => H().TPLB.versus(['Usually not an allergy', 'Gas, fussing or spit-up, in a baby who’s growing well.'], ['Could be an allergy', 'Blood or mucus in poop, a rash, or vomiting after most feeds.']),
      helps: [['notepad', 'Take a photo', 'Of the diaper or the rash'], nurse() ? ['heart', 'Keep nursing', 'Your pediatrician will say if anything should change'] : ['bottle', fam() ? 'Keep {p} milk the same' : 'Keep the same formula', 'Ask your pediatrician before changing it']],
      calls: { ped: 'blood or mucus in poop, a rash, vomiting after most feeds, or slow gain.' } }),
    x_gain: () => ({ type: 'check', label: 'Feeding challenges', art: 'steth', title: 'Slow gain? Watch swallows and diapers',
      why: 'Some babies are just smaller. {P} growth curve matters more than one weigh-in.',
      tellTitle: 'What to watch', signs: [['eye', 'Swallows', 'Long sucks and swallows, not just dozing'], ['diaper', 'Wet diapers', '6 or more a day after the first week']],
      helps: [['clock', 'Feed often', mo() < 1 ? '8–12 times a day in the first weeks' : 'On cue, and more often if your pediatrician says'], ['steth', 'Follow the plan', 'Top-ups or set times, if they’re suggested']],
      calls: { ped: 'fewer wet diapers, or {s’s} hard to wake for feeds' + (realMo() < 1 ? ', or not back to birth weight by 2 weeks.' : '.') } }),
    x_hurt: () => ({ type: 'expect', label: 'Feeding challenges', art: 'sofa', title: 'Feeds shouldn’t hurt after the first minute',
      why: 'A little tenderness in the first week is common. Pain all feed long usually means a shallow latch.',
      do: [['hand', 'Re-latch', 'Break the seal with a clean finger, then try again'], ['sofa', 'Try another hold', 'Like the two above'], ['steth', 'Get it checked', 'A lactation consultant can check the latch']],
      // Nov 19: holds shown without the baby latched, so parents can copy the position.
      hero: () => H().TPLB.photoGrid([['feeding/hold-cradle', 'Cradle', 'Baby across your lap, tummy to tummy'], ['feeding/hold-laidback', 'Laid-back', 'Lean back. Baby lies on you, tummy down']]), heroTitle: 'Holds to try',
      // Nov 19: a latch has to be seen, and AI tools won't draw breastfeeding, so a trusted video shows it.
      video: ['wjt-Ashodw8', 'How a deep latch looks', 'Global Health Media'],
      calls: { ped: 'pain at most feeds after the first week, {s} {seem|seems} hungry after most feeds, or clicking and long feeds with slow gain.' } }),
    x_nobottle: () => ({ type: 'expect', label: 'Feeding challenges', art: 'bottle', title: 'Won’t take a bottle? It often takes practice',
      why: 'Many babies who nurse refuse a bottle at first, especially from the parent who nurses.',
      do: [['hand', 'Someone else offers', 'Ideally with you out of the room'], ['moon', 'Before {s’s} very hungry', 'Calm and a little sleepy is easiest'], ['bottle', 'Slow-flow nipple', 'Try another shape if {s} {fight|fights} it']],
      doNotes: [['', 'Keep it low-pressure', 'A few minutes once a day. Upset? Stop, and try again tomorrow']],
      calls: { ped: '{s} {refuse|refuses} all feeds, or has fewer wet diapers.' } }),
    x_refuse: () => ({ type: 'expect', label: 'Feeding challenges', art: 'bottle', title: 'Pulling off at feeds? Usually a small fix',
      why: 'It’s often air, a fast flow, or a stuffy nose.',
      do: [['hand', 'Burp, then retry', 'Trapped air can feel like being full'], nurse() ? ['sofa', 'Lean back', 'If milk comes fast'] : ['bottle', 'Check the nipple', 'Too fast or too slow?'], ['drop', 'Clear {p} nose', 'Saline and gentle suction']],
      doNotes: mo() >= 3 ? [['', 'Distracted?', 'From 3–4 months, feed somewhere quiet and dim']] : null,
      calls: { ped: 'too sleepy to feed, refusing several feeds in a row, or ' + fev() + '.' } }),

    // ---------- Solids ----------
    // Nov 19: the four signs sit in the top card as photo rows to tick (the same ticks as the Feeding stage page), and the advice under them follows the ticks.
    // Nov 19 (review): swallowing can only be seen once food is offered, so it moves to "In the first tastes".
    // Three signs before starting, each tappable; the result counts those three.
    z_ready: () => { const h = H(), m = mo(), n = [0, 1, 2].filter(i => h.signsOn(i)).length;
      return { type: 'expect', label: 'Is {s} ready?', art: 'highchair', title: 'Most babies start solids around 6 months',
        why: 'Three signs usually show up around then. Milk is all {s} {need|needs} until they do.',
        normalTitle: 'Signs to look for first', normal: () => h.TPLB.photoRows([0, 1, 2].map(i => [['feeding/sign-head', 'feeding/sign-sits', 'feeding/sign-interest2'][i], h.READY[i][3], ['Holds it up on {p} own', 'In a high chair, or on your lap', 'Watches you eat, leans in'][i]]), { title: 'Tap each one once you’ve seen it', isOn: h.signsOn, onclick: i => `hubToggleReady(${i})` }) + (n === 3 ? (m >= 6 ? h.TPLB.result('{S’s} ready to start!', 'All three signs, right on time.') : h.TPLB.result('All three signs!', 'Most babies still start around 6 months.', 'next')) : ''),
        moreTitle: 'In the first tastes', more: () => '<section class="ph-rowcard">' + h.TPLB.rows([['mouth', 'Swallows more than {s} {push|pushes} out', 'Pushing food out with the tongue is common at first. It fades with practice'], ['eye', 'Opens up as the spoon comes', 'And turns away when {s’s} had enough']], 'Feeding') + '</section>',
        doTitle: n === 3 ? 'Next step' : 'What to do',
        do: n === 3 && m < 6 ? 'Ask {p} pediatrician whether to start now or at 6 months.'
          : n === 3 ? 'Pick a calm morning when {s’s} not too hungry, and offer a few soft tastes.'
          : m < 6 ? 'Once you’ve seen all three, ask about starting solids at {p} 6-month checkup.'
          : 'Not all three yet? Some babies take a few more weeks. Mention it at {p} next checkup.',
        doNotes: [['', 'Good to know', 'Starting early won’t help {o} sleep any longer']],
        action: n === 3 && m >= 6 && answers.solids !== 'Yes' ? () => `<div class="hub-actions"><button class="hub-button" onclick="setFeedingStage('starting');hubToast('Got it','Feeding now shows first tastes.');openPage('topic:Feeding')">${H().F('We’re starting today')}</button></div>` : null }; },
    z_start: () => ({ type: 'howto', label: 'How to start', art: 'bowl', title: 'Start with soft foods rich in iron',
      why: 'By spoon, as finger foods, or both. All are fine when it’s soft.',
      // Nov 19 (review): every food here is iron-rich (avocado and sweet potato live on Finger foods and Beyond purées).
      pictureTitle: 'Iron-rich first foods', picture: () => H().TPLB.photoGridMore([['feeding/iron-meat', 'Meat', 'Finely ground, cooked soft'], ['feeding/iron-lentils', 'Lentils', 'Cooked soft, mashed'], ['feeding/iron-oats', 'Baby cereal', 'Iron-fortified'], ['feeding/opt-egg', 'Egg', 'Well cooked'], ['feeding/iron-beans', 'Beans', 'Mashed'], ['feeding/iron-tofu', 'Tofu', 'Soft strips']], 'See more foods'),
      stepsTitle: 'Three ways to start', stepsFig: () => H().TPLB.tiles([['bowl', 'Spoon-fed', 'Thicker and lumpier over time'], ['hand', 'Finger foods', 'Soft strips {s} {feed|feeds} {o}self'], ['plate', 'A mix', 'Iron-rich foods by spoon, plus soft strips']], CAT),
      tips: [['bowl', 'Soft enough to squash', 'Between your finger and thumb.'], ['highchair', 'Seated upright, with you', 'In a high chair with a harness, every time.'], ['plate', 'No added salt or sugar', 'Take {p} portion out before seasoning.']] }),
    z_meal: () => mo() >= 8.5
      ? { type: 'howto', label: 'Feeding {o}self', art: 'plate', title: 'Most family foods are fine for {o} now',
        why: 'Soften it, and skip the added salt.',
        pictureTitle: 'Ideas from your plate', picture: () => H().TPLB.chips(['Shredded chicken', 'Scrambled egg', 'Squashed beans', 'Soft pasta', 'Banana or ripe pear', 'Soft-cooked veggies']),
        ordered: false, steps: [['plate', 'From your plate', 'Take out {p} portion before adding salt'], ['hand', '{S} {feed|feeds} {o}self', 'Fingers first, and a spoon to practice']] }
      : { type: 'howto', label: 'How a meal goes', art: 'highchair', title: 'First meals are just a few bites',
        why: 'Solids are practice for now. Let {o} set the pace.',
        steps: [['photo:feeding/meal-1', 'Sit {o} up', 'Strapped in, facing you, at a calm time'], ['photo:feeding/meal-2', 'Offer a little', 'A spoonful, or a soft strip to hold'], ['photo:feeding/meal-3', 'Let {o} lead', 'Opens up for more, turns away when done']],
        stepsNotes: [['', 'Expect mess', 'Funny faces too. Most of it ends up on the tray at first']] },
    // Nov 19: the same three foods at each texture, with this baby's column marked, in the top card.
    z_textures: () => { const m = mo(), now = m < 7 ? 0 : m < 9 ? 1 : 2, T = H().TPLB;
      return { type: 'expect', label: 'Beyond purées', art: 'avocado', title: 'Move from smooth food to soft pieces',
        why: 'Lumps help {o} learn to chew. Go one step at a time.',
        heroTitle: 'One food, three textures', hero: () => T.photoSwitch([['Smooth', 'Around 6 months'], ['Lumpy', '7–8 months'], ['Soft pieces', '9 months on']],
          [['Avocado', ['feeding/tx-avo-1', 'feeding/tx-avo-2', 'feeding/tx-avo-3']], ['Banana', ['feeding/tx-ban-1', 'feeding/tx-ban-2', 'feeding/tx-ban-3']], ['Sweet potato', ['feeding/tx-sp-1', 'feeding/tx-sp-2', 'feeding/tx-sp-3']]], now),
        // Nov 19 (fresh read vs the Safety steps): one section of short rows instead of two blocks of three-line tiles.
        doTitle: 'Moving up a texture', doFig: () => '<section class="ph-rowcard">' + T.rows([['bowl', 'Mash with a fork', 'Instead of blending'], ['clock', 'Move on once this one is easy', 'Usually after a week or two'], ['hand', 'Pieces should squish', 'Between your finger and thumb']], 'Feeding') + '</section>',
        doNotes: [['', 'Go by skills, not the month', 'Move on once {s} {handle|handles} this texture easily. The ages are only examples'], ['', 'Why not wait', 'Babies still on smooth purées past about 9 months can find lumps harder later']] }; },
    z_rotate: () => ({ type: 'expect', label: 'Keeping foods in rotation', art: 'peanut', title: 'Once {s’s} had peanut or egg, keep it coming',
      why: 'A few times a week. Stopping can raise the chance of an allergy.',
      do: [['peanut', 'Peanut', 'Peanut powder or thinned peanut butter, in oatmeal or yogurt'], ['egg', 'Egg', 'A couple of times a week: scrambled, or in pancakes']],
      }),
    // Nov 19: the squish test in the top card, then sizes by age (this baby's marked), what to try, how to make risky foods safe, and safety while eating.
    z_shapes: () => { const T = H().TPLB, nine = mo() >= 9;
      return { type: 'howto', label: 'Safe finger foods', art: 'hand', title: 'Finger foods should squish when pressed',
        why: 'Press it between your finger and thumb. If it squashes, {p} gums can manage it.',
        heroTitle: 'The squish test', hero: () => `<section class="care-tpl-card ph-squish">${T.photoPins('feeding/squish2', 'A finger pressing a soft steamed carrot flat', [['Press gently', 38, 42, 'l'], ['It should give way', 47, 68, 'b']], 'is-wide')}</section>`,
        // Nov 19: like the inspiration, three blocks only: the squish test, what to try, and how to keep it safe (icons, not more photos).
        stepsTitle: 'A few foods to try', stepsFig: () => T.photoGridMore([['feeding/opt-avocado', 'Avocado', 'Ripe strips'], ['feeding/opt-banana', 'Banana', 'Strips, not rounds'], ['feeding/opt-egg', 'Egg', 'Omelet strips'], ['feeding/nutbutter', 'Toast', 'Nut butter spread thin'], ['feeding/opt-broccoli', 'Broccoli', 'Well cooked, stem to hold'], ['feeding/opt-pasta', 'Pasta', 'Soft, well cooked']], 'See more foods'),
        tips: [nine ? ['hand', 'Small, soft pieces', 'About pea-size, to pinch'] : ['hand', 'Finger-size strips', 'Easy to grip. Small pieces come later'], ['bowl', 'Quarter grapes, no whole nuts', 'Cherry tomatoes too'], ['highchair', 'Seated upright, with you', 'Every bite, never on the move']] }; },
    z_allergens: () => ({ type: 'howto', label: 'Common allergens', art: 'peanut', title: 'Try the common allergens early',
      why: 'Start around 6 months. Ask first if {s} has severe eczema or an egg allergy.',
      pictureAfter: true, pictureTitle: 'Keep track', picture: () => X().pron(window.__alCard()),
      ordered: false, steps: [['peanut', 'One at a time', 'At home, earlier in the day'], ['egg', 'In a safe form', 'Thinned peanut butter, egg well cooked'], ['plate', 'Keep it going', 'A few times a week once {s’s} had it']],
      tipsTitle: 'If there’s a reaction', tips: [['steth', 'A few hives, or vomiting', 'Call your pediatrician.'], ['alarm', 'Trouble breathing, or swelling of the lips or face', 'Or hives all over, hives with vomiting, or very sleepy or floppy. Call 911.']] }),
    z_plan: () => ({ type: 'expect', label: 'Foods to wait on', art: 'plate', title: 'Honey waits until age 1, some foods until 4',
      why: 'A few foods aren’t safe for babies yet, even once solids are going well.',
      // Nov 19: photos, so a parent recognizes the food at a glance; a red cross marks each one.
      // Nov 19 (review): what simply waits, apart from what's fine once it's served differently (with the grape shown both ways).
      normalTitle: 'Wait until age 1', normal: () => H().TPLB.photoGridMore([['feeding/no-honey', 'Honey', 'Risk of botulism'], ['feeding/no-milk', 'Cow’s milk to drink', 'Fine in cooking'], ['feeding/no-juice', 'Juice', 'Breast milk or formula']], '', 'no'),
      moreTitle: 'Serve these differently until age 4', more: () => H().TPLB.photoPins('feeding/grape', 'A whole grape beside one cut into quarters lengthwise', [['Whole: choking risk', 27, 64, 'b'], ['Quartered: fine', 70, 64, 'b']]) + '<section class="ph-rowcard">' + H().TPLB.rows([['bowl', 'Grapes and cherry tomatoes', 'Quarter them lengthwise'], ['plate', 'Hot dogs and sausages', 'Thin strips, never rounds'], ['peanut', 'Nuts and nut butter', 'No whole nuts. Spread nut butter thin'], ['hand', 'Hard raw fruit and veg', 'Cook or grate until soft']], 'Feeding') + '</section>', moreNotes: [['', 'Popcorn waits until 4', 'There’s no safe way to serve it']] }),
    z_milkfood: () => ({ type: 'expect', label: 'Milk and solids', art: 'cup', title: 'No set order for milk and meals',
      why: 'A meal fits in wherever {s’s} awake and happy.',
      do: [['bottle', 'Milk before or after', 'Whatever works for {o}'], ['cup', 'Water from a cup', 'Open or straw. Hold it for {o}, and let {o} try']],
      doNotes: [['', 'As meals grow', '{S}’ll slowly drink less milk, mostly after 9 months']] }),
    z_day: () => ({ type: 'expect', label: 'Meals and milk', art: 'plate', title: 'Some days {s} {eat|eats} a lot, some days little',
      why: 'You choose what and when. {S} {choose|chooses} how much.',
      normalTitle: 'How much {s} {eat|eats}, day by day',
      normal: () => { const v = [70, 35, 50, 90, 40, 60, 80], d = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        return `<figure class="hub-figure tpl-week" role="img" aria-label="${H().F('How much a baby eats over a week: some days a lot, some days little. It evens out.')}"><div class="tpl-week-bars">${v.map((x, i) => `<div><i style="height:${x}%"></i><small>${d[i]}</small></div>`).join('')}</div></figure>`; },
      normalNotes: [['', 'That’s normal', 'Look at the week, not the day']],
      do: [['plate', 'Keep offering', 'Without pressure'], ['clock', 'Look at the week', 'Not one meal']],
      doNotes: [['', 'Getting enough?', 'Wet diapers, energy, and steady growth at checkups']] }),
    z_milk12: () => { const b = X().isBottle(), f = fam();
      return { type: 'expect', label: 'Turning 1', art: 'cup', title: 'Start cups now, and whole milk at 12 months',
        why: 'A cup at meals now makes the switch easier.',
        do: [['cup', 'Whole milk', 'Not low-fat, until age 2'], ['cup', 'Up to 24 oz a day', b ? 'More crowds out iron-rich food' : 'From a cup. Nursing doesn’t count'], b ? ['bottle', 'Drop one bottle at a time', 'Swap one for a cup each week'] : null].filter(Boolean),
        doNotes: [b ? ['', 'Picky about the taste?', (f ? 'Mix half and half with formula' : 'Mix half and half with breast milk') + ' for a week. Toddler formula isn’t needed'] : null, ['', 'Vitamin D after 1', 'Ask your pediatrician how much {s} {need|needs}']] }; },
    z_refuse: () => ({ type: 'expect', label: 'Feeding challenges', art: 'plate', title: 'Refusing food is common and normal',
      why: 'Some days {s}’ll eat a lot, and some days almost nothing.',
      do: [['clock', 'Try again later', 'It can take 10 to 15 tries'], ['hand', 'Let {o} touch it first', 'Playing is learning'], ['plate', 'Eat together', '{S} {copy|copies} you']],
      doNotes: [['', 'Your part, and {p}', 'You choose what. {S} {choose|chooses} how much']],
      calls: { ped: 'refusing most foods for weeks, or fewer wet diapers.' } }),
    z_teeth: () => ({ type: 'expect', label: 'Feeding challenges', art: 'tooth', title: 'Teething can make feeds short and fussy',
      why: 'Sore gums usually settle in a few days.',
      do: [['snow', 'Something cold', 'A teether or a cold washcloth'], ['bowl', 'Chilled food', 'Yogurt or mashed fruit'], ['clock', 'Shorter feeds', 'More often, for a few days']],
      doNotes: [['', 'Not for babies', 'Teething gels with benzocaine, or amber necklaces']],
      calls: { ped: fev() + ', or refusing to drink. Teething doesn’t cause a fever.' } }),
    z_sick: () => ({ type: 'expect', label: 'Feeding challenges', art: 'thermo', title: 'When {s’s} sick, milk and fluids come first',
      why: '{S} may eat less for a few days. That’s okay.',
      do: [['bottle', 'Milk more often', 'In smaller amounts'], ['drop', 'Clear {p} nose', 'Saline drops, then suction'], ['bowl', 'Solids can wait', 'Until {s} {feel|feels} better']],
      calls: { ped: 'fewer wet diapers, refusing milk, or vomiting that keeps happening.' } }),
    z_reaction: () => ({ type: 'check', label: 'Feeding challenges', art: 'mouth', title: 'Red around the mouth is usually from food',
      why: 'Acidic foods can redden the skin they touch. A true reaction looks different.',
      figure: () => H().TPLB.versus(['Usually fine', 'Redness only where food touched, that fades.'], ['A true reaction', 'Hives, vomiting, or a rash that spreads.']),
      helps: [['notepad', 'Note it', 'The food, and what happened. A photo helps'], ['clock', 'Hold off on that food', 'Ask before trying it again']],
      calls: { ped: 'a few hives, vomiting, or a rash that spreads.', now: 'trouble breathing, swollen lips or face, or {s’s} very sleepy or floppy.', nowLabel: 'Call 911' } }),
    // Nov 19: the two photo cards in the top card; what to do side by side; the first-aid steps in order, the video right after them, the call card last.
    z_gag: () => { const T = H().TPLB;
      // Nov 19 (review): no photo of choking (a baby clutching the neck isn't how babies show it), and no "silent":
      // a choking baby may make no sound, or only a weak cough or high-pitched noise (MedlinePlus, Nationwide Children's).
      return { type: 'urgent', label: 'Gagging or choking', art: 'mouth', title: 'Gagging is normal. Choking isn’t.',
        why: 'Gagging is how {s} {learn|learns} to eat. Loud coughing means air is getting through.',
        tellTitle: 'How to tell them apart', figure: () => T.versus(['Gagging: stay close', 'Loud coughing or gagging, red face, watery eyes. Let {o} work it out.'], ['Choking: act now', 'Can’t cry or cough, or only a weak cough or high-pitched sound. Lips may turn blue.']),
        doTitle: 'If {s’s} choking', doFig: () => T.numbered([['Get help', 'Have someone call 911, or call on speaker'], ['5 back blows', 'Face down on your forearm, jaw supported. Firm, between the shoulder blades'], ['5 chest thrusts', 'Face up, heel of one hand mid-chest'], ['Repeat', 'Until it’s out. If {s} {stop|stops} responding, start CPR']], 'stop'),
        doNotes: [['', 'Never sweep {p} mouth with a finger', 'It can push food further in']],
        video: ['ShaNuST_58A', 'Choking first aid for babies under 1', 'American Red Cross'],
        calls: { now: '{s} {stop|stops} responding. Start CPR while you wait.', nowLabel: 'Call 911' } }; },
  };

  // The two "Does something seem not quite right?" menus keep their list, and end with the shared call card instead of the old boxes.
  const MENU = {
    x_tough: () => ({ ped: 'fewer wet diapers, too sleepy to feed, green or bloody vomit, or ' + fev() + '.' }),
    z_tough: () => ({ ped: 'vomiting or hives after a food, fewer wet diapers, or ' + fev() + '.', now: 'trouble breathing, or swollen lips or face.', nowLabel: 'Call 911' })
  };
  const menuTail = (h, calls) => { const i = h.indexOf('<section class="ss-moment"><section class="hub-card hub-versus"'); if (i < 0) return h;
    const tail = h.slice(i), styles = (tail.match(/<style>[\s\S]*?<\/style>/g) || []).join(''), t = tail.replace(/<style>[\s\S]*?<\/style>/g, '');
    const open = (t.match(/<div\b/g) || []).length, close = (t.match(/<\/div>/g) || []).length;
    return h.slice(0, i) + `<div class="care-tpl is-urgent">${H().TPLB.calls(calls)}</div>` + styles + '</div>'.repeat(Math.max(0, close - open)); };

  // Older Feeding pages that now open one of these.
  const ALIAS = { y_growth: 'enough', y_nurse: 'm1_now', y_bottle: 'm1_now', y_away: () => (X().stg() === 1 && mo() < 3 ? 'm1_apart' : 'm2_away'), y_night: 'm1_eve', y_evening: 'm1_eve',
    z_signs: 'z_ready', z_setup: 'z_start', z_tray: 'z_start', z_allergy: 'z_plan', z_notyet: 'z_plan', z_water: 'z_milkfood', z_family: 'z_meal', z_appetite: 'z_day' };
  // Each page keeps Feeding's own header: the soft card in the color of what you tapped, with its small picture,
  // taken from the page it replaces, so Feeding looks like Feeding and Sleep looks like Sleep.
  const draw = (q, old) => { const h = H(), F = h.F, v = x => typeof x === 'function' ? x() : x;
    const m = typeof old === 'string' ? old.match(/<div class="dev-area-head ss-head" style="--area:(#[0-9a-f]+);--area-ink:(#[0-9a-f]+)">(<span class="dev-area-head-art"[^>]*>[\s\S]*?<\/svg><\/span>)?/i) : null;
    const bg = m ? m[1] : '#fbe4ec', ink = m ? m[2] : '#9b4766';
    // Nov 19: the topic's own icon on a white tile, as on the Safety step pages, in place of the abstract shapes readers found meaningless.
    const art = q.art && typeof hubArt === 'function' ? `<span class="dev-area-head-art sf-head-art">${hubArt(q.art, CAT)}</span>` : (m && m[3] ? m[3] : '');
    const why = v(q.why);
    return `<div class="quiet-category hub-page hub-detail care-v2" data-overview="${CAT}" data-ss="1" style="${typeof yearTheme === 'function' ? yearTheme(CAT) : ''};--ss-bg:${bg};--ss-ink:${ink}">${typeof detailPageTop === 'function' ? detailPageTop(CAT) : ''}`
      + `<div class="dev-area-head ss-head" style="--area:${bg};--area-ink:${ink}">${art}<p class="hub-context">${F(v(q.label))}</p><h1>${F(v(q.title))}</h1>${why ? `<p class="hub-lead">${F(why)}</p>` : ''}</div>`
      // Nov 19: a page's main visual comes first, right under the standard top card (never inside it), so every top card looks the same.
      + (q.hero ? `<div class="ph-first">${q.heroTitle ? `<h2 class="hub-h2">${F(v(q.heroTitle))}</h2>` : ''}${v(q.hero)}</div>` : '')
      + `<div class="care-tpl is-${q.type}">${h.TPLS[q.type](q, CAT)}</div></div>`; };
  const base = window.changesRoute;
  window.changesRoute = function (r, ...a) {
    if (window.__fdx && X().oldFeeding) r = X().oldFeeding(r);
    const q = String(r).split(':');
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && window.__hub && window.__fdx) {
      const al = ALIAS[q[3]]; if (al) q[3] = typeof al === 'function' ? al() : al;
      if (T[q[3]]) { const page = T[q[3]](q[4]); if (page) { window.__fdLast = r; return draw(page, base.call(this, 'chg:' + CAT + ':mock:' + q.slice(3).join(':'), ...a)); } }
      if (MENU[q[3]]) return menuTail(base.call(this, r, ...a), MENU[q[3]]());
    }
    return base.call(this, r, ...a);
  };
})();
