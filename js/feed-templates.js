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
  const fev = () => { const m = mo(); return m < 3 ? 'a fever of 100.4°F or higher, day or night' : m < 6 ? 'a fever that lasts more than a day or reaches 101°F' : 'a fever that lasts more than a day or reaches 103°F'; };
  // Nov 23 (round 3): under 3 months any fever gets its own "Call right away" row, as on Everyday care and Gas.
  const fevCalls = (signs, extra) => mo() < 3 ? Object.assign({ ped: signs.join(', or ').replace(/, or ([^,]*), or /, ', $1, or ') + '.', right: 'a rectal temperature of 100.4°F or higher' }, extra || {}) : Object.assign({ ped: signs.join(', ') + ', or ' + fev() + '.' }, extra || {});
  const T = {
    // ---------- Milk: is it going well? ----------
    nb_enough: () => ({ type: 'expect', label: 'Getting enough', art: 'diaper', title: 'Wet diapers are the best everyday sign',
      heroTitle: () => realMo() < 1 ? '' : 'What a good wet diaper looks like', hero: () => realMo() < 1 ? '' : `<section class="care-tpl-card">${H().TPLB.photoPins('feeding/wet-diaper', 'A heavy wet diaper beside a dry one', [['Heavy and wet', 27, 78, 'b'], ['Dry', 72, 78, 'b']], 'is-wide')}</section>`,
      why: 'Count wet diapers each day. Weight checks at checkups confirm it.',
      // Nov 24 flag 12: "day by day" only where the days are shown (the first month).
      normalTitle: () => realMo() < 1 ? 'Wet diapers and poop, day by day' : 'What to look for',
      normal: () => realMo() < 1 ? X().pron(X().firstCard(X().xBody(X().P.x_enough))) : realMo() >= 1 ? H().TPLB.tiles([['diaper', '6 or more', 'Wet diapers a day'], ['steth', 'Steady gain', 'At each weight check']], CAT) : window.hubStageStrip({ title: '', cat: CAT, items: [['diaper', 'Days 1–2', '1–2'], ['diaper', 'Days 3–4', '3–4'], ['diaper', 'Day 5', 'About 5'], ['diaper', 'Day 6 on', '6 or more']], caption: 'Wet diapers a day: 1 to 2 on days 1 and 2, 3 to 4 on days 3 and 4, about 5 on day 5, then 6 or more.' }),
      moreTitle: '{P} weight', more: () => realMo() < 1 ? X().pron(X().weightViz()) : '',
      normalNotes: [nurse() ? ['', 'Good signs during feeds', 'Long sucks, and swallows you can hear'] : null, ['', 'After most feeds', '{S’s} content for a while']],
      do: [['notepad', 'Note feeds and diapers', 'Until things feel settled'], ['steth', 'Go to the weight checks', 'No need to weigh at home']],
      calls: { ped: realMo() >= 1 ? 'fewer wet diapers, dark urine, or {s} {seem|seems} hungry after most feeds.' : 'fewer wet diapers, dark urine, black poop after day 5, or not back to birth weight by 2 weeks.' } }),
    enough: () => ({ type: 'expect', label: 'Getting enough', art: 'diaper', title: 'Wet diapers show {s’s} getting enough',
      heroTitle: 'What a good wet diaper looks like', hero: () => `<section class="care-tpl-card">${H().TPLB.photoPins('feeding/wet-diaper', 'A heavy wet diaper beside a dry one', [['Heavy and wet', 27, 78, 'b'], ['Dry', 72, 78, 'b']], 'is-wide')}</section>`,
      why: mo() >= 6 || onlyFormula() ? 'No need to measure feeds. Your pediatrician checks {p} weight at each checkup.' : 'Fewer poops can be normal after about 6 weeks. Wet diapers and growth are what count.',
      normal: [['diaper', '6 or more', 'Wet diapers a day'], ['steth', 'Steady growth', 'Checked at each checkup']],
      calls: { ped: 'dark urine, a dry mouth, or {s’s} feeding much less than usual.' } }),
    m1_now: () => ({ type: 'expect', label: 'Feeds now', art: 'clock', title: 'Hungrier some days? Often a growth spurt',
      why: 'Feeds bunch up for 2–3 days, then settle again.',
      normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['clock', 'Around 6 weeks', '2–3 hungrier days'], ['moon', 'In between', 'Calmer weeks'], ['calendar', 'Around 3 months', 'Another one, then it passes']], caption: 'A growth spurt around 6 weeks, calmer weeks in between, and another around 3 months.' }),
      do: nurse() ? 'Feed more often for a few days, and your milk catches up.' : 'Offer a little more if {s} still {seem|seems} hungry.',
      doNotes: nurse() ? [['', 'Pulls off and fusses?', 'Burp, then try again. Milk coming fast? Lean back']] : [['', 'Sucks hard and gets frustrated?', 'Try the next nipple size'], ['', 'Gulping or spilling?', 'Stay with the slower one']] }),
    m1_eve: () => ({ type: 'expect', label: 'Evenings and nights', art: 'moon', title: 'Night feeds are normal for now',
      why: 'Some babies sleep one longer stretch by now. Many don’t yet.',
      normalTitle: 'Night feeds over the first year', normal: () => window.__sv2nightFeeds ? window.__sv2nightFeeds() : '',
      do: 'Gaining well, says your pediatrician? You can stop waking {o}. Still feed {o} when {s} {wake|wakes} hungry.' }),
    nb_eve: () => ({ type: 'expect', label: 'Evenings and nights', art: 'moon', title: 'Busy evenings, then quick and calm nights',
      why: 'Evening cluster feeds are normal. Keep night feeds short and sleepy.',
      normalTitle: 'Night feeds over the first year', normal: () => window.__sv2nightFeeds ? window.__sv2nightFeeds() : '',
      do: [['sunrise', 'In the evening', nurse() ? 'Switch sides often to keep milk flowing' : 'Offer smaller bottles, more often'], ['moon', 'At night', 'Keep it dim, and change only if dirty'], realMo() >= 1 ? null : ['clock', 'Until back to birth weight', 'Wake {o} after 3 hours by day, 4 at night']].filter(Boolean),
      doNotes: [['', 'Hard to wake?', 'Undress {o} to {p} diaper, or stroke {p} feet']],
      calls: { ped: '{s’s} too sleepy to feed most times.' } }),
    m2_night: () => ({ type: 'expect', label: 'Evenings and nights', art: 'moon', title: 'Night feeds are common for a while',
      why: 'Busy, distracted days can mean more feeds at night. Feeding {o} back to sleep is fine.',
      normalTitle: 'Night feeds over the first year', normal: () => window.__sv2nightFeeds ? window.__sv2nightFeeds() : '',
      do: 'Feed {o} when {s} {wake|wakes}. Ask about dropping night feeds at {p} ' + (mo() < 4 ? 4 : mo() < 6 ? 6 : mo() < 9 ? 9 : 12) + '-month checkup.' }),
    m2_distract: () => ({ type: 'expect', label: 'Distracted feeds', art: 'eye', title: 'Short daytime feeds are perfectly okay',
      why: '{S} may gulp, pop off and look around. {S} still {get|gets} enough over the day.',
      do: [['moon', 'Feed when {s’s} drowsy', 'Just waking, or before sleep'], ['hand', 'Let {o} hold on', 'Your finger, or a soft toy'], ['chat', 'Talk later', 'Chatting pulls {p} attention away']],
      doNotes: [['', 'Pops off?', 'End the feed, and try again a little later. No need to force it']],
      calls: { ped: 'fewer wet diapers than usual, or feeding much less for more than a few days.' } }),

    // ---------- Every day ----------
    nb_vitd: () => onlyFormula()
      ? { type: 'howto', label: 'Vitamin D', art: 'drop', title: 'Vitamin D drops, every day for now',
        hero: () => window.aheadFig ? window.aheadFig('feeding/vitd-drop', [['Into the side of {p} mouth', 'bl', 52, 46]], 'Drip it in slowly, inside the cheek.', '35%') : '',
        why: 'Formula covers it once {s} {drink|drinks} about 32 oz a day. Until then, give drops too.',
        ordered: false, steps: [['drop', 'The label’s dose', 'Using the dropper that comes with them'], ['bottle', 'Or mix it into 1 oz of milk', 'Make sure {s} {finish|finishes} it']],
        stepsNotes: mo() < 6 ? [['', 'No water yet', 'Milk is all {s} {need|needs} until about 6 months, even on hot days']] : null }
      : { type: 'howto', label: 'Vitamin D', art: 'drop', title: 'Vitamin D drops, every single day',
        hero: () => window.aheadFig ? window.aheadFig('feeding/vitd-drop', [['Into the side of {p} mouth', 'bl', 52, 46]], nurse() ? 'Drip it slowly inside the cheek, or onto the nipple just before a feed.' : 'Drip it in slowly, inside the cheek.', '35%') : '',
        why: 'Vitamin D builds strong bones, and breast milk has very little. A few drops a day fill in the gap.',
        pictureTitle: 'What {s} {need|needs}', picture: () => H().TPLB.tiles([['sun', 'Vitamin D', '400 IU a day, through {p} first year'], ['drop', 'Iron', fam() ? 'Mostly breast milk? Drops from 4 months, or iron-rich foods at 6' : mo() < 4 ? 'Drops usually start at about 4 months' : 'Drops from 4 months, until iron-rich foods are going well']], CAT),
        ordered: false, steps: [['drop', 'The label’s dose', 'Using the dropper that comes with them'], ['bottle', 'Or mix it into 1 oz of milk', 'Make sure {s} {finish|finishes} it']],
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
      // Nov 24 (Feeding A): formula-only babies get iron from fortified formula; older babies keep iron-rich foods going.
      : !breast() ? { type: 'expect', label: 'Iron', art: 'drop', title: 'Iron-fortified formula covers {p} iron',
        why: mo() < 6 ? 'No drops needed. From about 6 months, iron-rich foods join in.' : 'Keep an iron-rich food at most meals as solids grow.',
        normalTitle: 'Where it comes from',
        normal: () => window.hubStageStrip({ title: '', cat: CAT, items: [['bottle', 'From birth', 'Iron-fortified formula'], ['bowl', '6 months on', 'Iron-rich foods too']], caption: 'Iron-fortified formula covers iron from birth. Iron-rich foods join in from about 6 months.' }),
        do: 'Choose an iron-fortified formula. Most standard ones are.',
        doNotes: [['', 'Darker poop?', 'Iron can cause it. That’s normal']] }
      : mo() >= 9 ? { type: 'expect', label: 'Iron', art: 'drop', title: 'Keep an iron-rich food at most meals',
        why: 'Meat, beans, lentils, eggs and iron-fortified cereal all count.',
        normalTitle: 'Easy iron-rich foods',
        normal: () => H().TPLB.photoGrid([['feeding/opt-egg', 'Egg', 'Omelet strips'], ['feeding/iron-oats', 'Iron-fortified oatmeal', 'With fruit, or nut butter'], ['feeding/iron-lentils', 'Beans or lentils', 'Soft, mashed or whole']]),
        do: 'Offer one at most meals. Vitamin C foods, like berries or tomato, help the iron absorb.',
        doNotes: [['', 'Darker poop?', 'Iron can cause it. That’s normal']] }
      : { type: 'expect', label: 'Iron', art: 'drop', title: fam() ? 'Mostly breast milk? Plan for iron by 6 months' : 'Breastfed babies need extra iron by 6 months',
        why: 'Iron stores run low from about 4 months, and breast milk has very little.',
        normalTitle: 'Iron-rich first foods',
        normal: () => H().TPLB.photoGrid([['feeding/iron-meat', 'Meat', 'Soft, minced or shredded'], ['feeding/iron-lentils', 'Beans or lentils', 'Mashed'], ['feeding/iron-oats', 'Iron-fortified cereal', 'Mixed with milk']]),
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
        stepsTitle: 'Warming a bottle', steps: [['drop', 'Set it in warm water', br ? 'Or a bottle warmer. Frozen? Thaw it in the fridge first' : 'Or a bottle warmer'], ['bottle', 'Swirl', br ? 'To mix the fat back in' : 'To mix it'], ['hand', 'Test it on your wrist', 'Warm, not hot']],
        stepsNotes: [['', 'Skip the microwave', 'It heats unevenly. Cold or room temperature is fine too']] }; },
    bottle: () => ({ type: 'howto', label: 'Bottles', art: 'bottle', title: 'A paced bottle lets {o} take the lead',
      why: 'Going slowly means less air, and {s} {stop|stops} when {s’s} full.',
      hero: () => H().TPLB.photoPins('feeding/pace-photo', 'A parent holding a baby upright with the bottle about level', [['Bottle about level', 55, 44, 'l'], ['Baby upright', 77, 62, 'b']], 'is-pace'),
      pictureTitle: 'Positions', picture: () => H().TPLB.tiles([['heart', 'Cradled, sitting up', 'Head higher than {p} tummy'], ['sofa', 'Upright on your lap', 'Facing sideways, head well supported'], ['bottle', 'Side-lying', 'Along your arm. Slows the flow']], CAT),
      // Nov 19: the same three steps and note as the walkthrough's Bottle step, word for word.
      // Nov 24 (Yarden): a photo for each step, in the same step card as Everyday care's how-tos.
      stepsTitle: 'Steps', stepsFig: () => ctPhotoSteps([['photo:feeding/pace-step-1', 'Let {o} draw it in', 'Touch the nipple to {p} lip'], ['photo:feeding/pace-step-2', 'Pause every few sucks', 'Tip it down, then let {o} start again'], ['photo:feeding/pace-step-3', 'Stop when {s’s} done', 'Even if milk is left. Burp every 2–3 oz']],
        [['Never prop a bottle', 'Always hold {o} and the bottle']]),
      tipsTitle: 'Nipples and cleaning', tipsFold: true, tips: [['bottle', 'Start with the slowest flow', 'Go up when {s} {suck|sucks} hard and {get|gets} frustrated. Gulping or coughing means it’s too fast.'], ['eye', 'Wide or narrow?', 'Neither is better. Stick with the one {s} {take|takes} calmly.'], ['drop', 'Clean after every feed', mo() < 4 ? 'Hot, soapy water, and sanitize often in the first months.' : 'Hot, soapy water, or the dishwasher.']] }),
    formula: () => ({ type: 'howto', ct: 'howto', label: 'Bottles', art: 'bottle', title: 'Mix formula exactly as the label says',
      why: 'The label’s amounts give {o} the right mix of nutrients and water, every time.',
      photo: 'feeding/formula-scoop', pos: '30%', alt: 'A level scoop of formula over the tin', call: [['Level, never heaped', 'tr', 60, 34]],
      near: [['Clean bottle', 'bottle'], ['Formula and its scoop', 'cup'], ['Clean water', 'drop']],
      moves: [['photo:feeding/formula-water', 'Wash your hands, then add the water', realMo() < 2 || early() ? 'Boiled, then cooled for 5 minutes, up to the line the label says' : 'Water first, up to the line the label says'], ['photo:feeding/formula-3', 'Add level scoops', 'Flat, never heaped. Then cap it and shake'], (realMo() < 2 || early() ? ['photo:feeding/formula-4', 'Cool it, then test it', 'Run it under cold water until a drop on your wrist feels warm, not hot'] : ['photo:feeding/formula-4', 'Test a few drops on your wrist', 'It should feel warm, never hot'])],
      tips: [realMo() < 2 || early() ? ['Why boiled water?', 'It kills a rare germ in powder. It matters most under 2 months, or if born early'] : ['Wash your hands first', 'And the bottle and the counter'],
        breast() ? ['Mixing with breast milk?', 'Make the formula with water first, then add the breast milk'] : ['Which formula?', 'Any standard iron-fortified one. Ask before a special formula']],
      safe: [['Never add extra water or powder', 'It can make {o} sick'], ['Never warm a bottle in the microwave', 'It heats unevenly and can burn {p} mouth']] }),
    pump: () => { const m = mo();
      // Nov 23 (Yarden: "more show and tell for pumping… formatted like other steps"): the same how-to layout as Making formula,
      // with illustrations (a hero with labels, Have nearby, four illustrated steps, notes, Keep safe).
      if (m < 1.5) return { type: 'howto', ct: 'howto', label: 'Pumping', art: 'bottle', title: 'Pump 8–12 times a day at first',
        why: 'Including once at night. Pumping often tells your body how much milk to make.',
        photo: 'feeding/pump-hero', pos: '15%', alt: 'A parent relaxing in an armchair while using a double breast pump', call: [['Flanges centered', 'tl', 36, 34], ['Start low', 'br', 84, 62]],
        near: [['Clean pump parts', 'bottle'], ['Bottles or bags', 'fridge'], ['A label and pen', 'notepad']],
        moves: [['photo:feeding/pump-1', 'Wash your hands', 'And use clean, dry pump parts'],
          ['photo:feeding/pump-2', 'Center your nipple in the flange', 'It should move freely in the tunnel, without rubbing'],
          ['photo:feeding/pump-3', 'Start low, then turn it up', 'Up to the strongest setting that’s still comfortable. About 15–20 minutes'],
          ['photo:feeding/pump-4', 'Label it and chill it', 'The date on each bottle or bag. Then wash the parts and let them air-dry']],
        tips: [['It shouldn’t hurt', 'Pain or rubbing? Try another flange size, and ask a lactation consultant'], fam() ? ['With formula too?', 'Pump what feels sustainable. Any amount of breast milk helps'] : ['Output varies', 'From session to session, and that’s normal']],
        safe: [['Wash every part after each use', 'Hot, soapy water, then air-dry on a clean towel'], ['Fresh milk keeps 4 hours out, 4 days in the fridge', 'Then freeze it. Best used within 6 months']] };
      if (m < 8.5) return { type: 'howto', label: 'Pumping', art: 'bottle', title: 'Pumping a little less often is normal now',
        why: 'Once your supply settles, fewer sessions is fine.',
        pictureTitle: 'How pumping changes', picture: () => (typeof hubStageStrip === 'function' ? hubStageStrip({ title: '', items: [['clock', 'First weeks', '8–12 a day'], ['moon', 'Supply settles', 'Fewer, spaced out'], ['bowl', 'Meals grow', 'Drop one at a time']], nowIndex: 1, cat: 'Feeding', caption: 'Pumping goes from 8 to 12 times a day in the first weeks, to fewer sessions once your supply settles, to dropping one at a time as meals grow.' }) : ''),
        ordered: false, steps: [['clock', 'Fewer sessions', 'Spaced through the day'], ['moon', 'The night pump', 'Ask before dropping it'], ['bottle', 'About 24–30 oz a day', 'What {s} {need|needs} until solids']],
        stepsNotes: fam() ? [['', 'With formula too?', 'Pump what feels sustainable. Any amount of breast milk helps']] : null };
      return { type: 'howto', label: 'Pumping', art: 'bottle', title: 'Pump a little less as meals grow',
        why: 'As solids grow, {s} {need|needs} a little less milk, and you can pump a little less.',
        pictureTitle: 'How pumping changes', picture: () => (typeof hubStageStrip === 'function' ? hubStageStrip({ title: '', items: [['clock', 'First weeks', '8–12 a day'], ['moon', 'Supply settles', 'Fewer, spaced out'], ['bowl', 'Meals grow', 'Fewer sessions']], nowIndex: 2, cat: 'Feeding', caption: 'Pumping goes from 8 to 12 times a day in the first weeks, to fewer sessions once your supply settles, and fewer again as meals grow.' }) : ''),
        ordered: false, steps: [['clock', 'Drop one session at a time', 'One every few days, so you stay comfortable'], ['bottle', 'Less milk over time', 'About 3–4 milk bottles a day by 9–12 months'], ['heart', 'Keep going, or wind down', 'Both are fine']] }; },
    // Nov 24 (Feeding E): families already giving formula get the caregiver version; everyone gets the paced bottle in photos.
    m1_apart: () => nurse() && !fam()
      ? { type: 'howto', label: 'Time apart', art: 'bottle', title: 'A first bottle goes best from someone else',
        why: 'A bottle lets a partner, a sitter or a caregiver feed {o}.',
        ordered: false, stepsTitle: 'How to give it', stepsFig: () => ctPhotoSteps([['photo:feeding/pace-step-1', 'Someone else offers it', '{S} may wait for you otherwise'], ['photo:feeding/pace-step-2', 'Hold the bottle level', 'So {s} can pause, like at the breast'], ['photo:feeding/pace-step-3', 'Let {o} stop', 'When {s} {turn|turns} away or {slow|slows} down']]),
        stepsNotes: [['', 'Start small', 'About 1–2 oz, at a calm moment'], ['', 'Keep it up', 'A few times a week, so {s} {stay|stays} used to it']] }
      : { type: 'howto', label: 'Time apart', art: 'bottle', title: 'Anyone can feed {o} from a bottle',
        why: 'Show these to anyone who feeds {o}.',
        ordered: false, stepsTitle: 'What to show caregivers', stepsFig: () => ctPhotoSteps([['photo:feeding/pace-step-1', 'Feed when {s} {look|looks} hungry', 'Rooting or hands to mouth, not the clock'], ['photo:feeding/pace-step-2', 'Sit {o} up, bottle level', 'So {s} can pause between sucks'], ['photo:feeding/burp-shoulder', 'Burp partway', 'And again at the end']]) },
    m2_away: () => !fam()
      ? { type: 'howto', label: 'Time apart', art: 'bag', title: mo() >= 9 ? 'Pack a bottle or two, plus {p} meals' : 'Leave about 1–1½ oz for each hour apart',
        why: mo() >= 9 ? 'Meals do more of the work now, so milk away from home can be small.' : 'Small bottles, so little goes to waste.',
        picture: () => H().TPLB.photoPins('feeding/away-bag', 'A small cooler bag with labeled bottles and an ice pack', [['Labeled and cold', 30, 30, 'r']]), pictureTitle: 'What to pack',
        ordered: false, steps: [['bottle', mo() >= 9 ? '4–6 oz per bottle' : '2–4 oz per bottle', 'So less is wasted'], ['notepad', 'Label each one', '{P} name and the date'], ['fridge', 'Keep it cold', 'In a cooler with ice packs']],
        stepsNotes: [['', 'How long it keeps', '4 hours out, 4 days in the fridge. Thawed: 24 hours, never refreeze'], ['', 'Back together?', 'Nurse as usual. Many babies nurse more in the evening after a day apart']] }
      // Nov 24 (Feeding A): formula-only families don't pack milk cold or label whose it is. Mixed families do both.
      : !breast() ? { type: 'howto', label: 'Time apart', art: 'bag', title: 'Pack formula to mix when {s’s} hungry',
        why: 'Powder and water travel apart. Once mixed, formula keeps 2 hours.',
        picture: () => H().TPLB.photoPins('feeding/away-bag', 'A small cooler bag packed with clean bottles', [['Clean bottles', 30, 30, 'r']]), pictureTitle: 'What to pack',
        ordered: false, steps: [['cup', 'Powder, measured out', 'In a formula dispenser, one feed per section'], ['drop', 'Water, in clean bottles', 'Mix right before the feed'], ['notepad', 'A note for the caregiver', 'How much, and roughly when']] }
      : { type: 'howto', label: 'Time apart', art: 'bag', title: 'Pack breast milk cold, and formula to mix there',
        why: 'Label the breast milk with {p} name and the date, so it’s used in order.',
        picture: () => H().TPLB.photoPins('feeding/away-bag', 'A small cooler bag with labeled bottles and an ice pack', [['Labeled and cold', 30, 30, 'r']]), pictureTitle: 'What to pack',
        ordered: false, steps: [['notepad', 'Label breast milk', '{P} name and the date'], ['fridge', 'Keep it cold', 'In a cooler with ice packs, up to 24 hours'], ['cup', 'Formula to mix there', 'Powder and water kept apart']] },

    // ---------- Feeding challenges ----------
    x_gas: () => ({ type: 'expect', ct: 'know', label: 'Feeding challenges', art: 'eye', title: 'Some gassy fussing every day is normal',
      photo: 'feeding/gas-hero', pos: '40%', cap: () => realMo() < 4 ? 'Most fussy in the evening, legs pulled up' : 'Past the usual peak, it’s less common',
      notice: ['Squirming and pulling {p} legs up', 'Fussier in the evening'],
      helpMoves: () => [['photo:feeding/burp-shoulder', 'Burp {o} mid-feed', 'Not just at the end'], ['photo:feeding/gas-bicycle', 'Bicycle {p} legs', 'Gently, with {o} on {p} back'], ...(realMo() < 6 ? [['photo:feeding/gas-tummy', 'Tummy time', 'While {s’s} awake and watched']] : [])],
      helpNotes: [['Gas drops and gripe water?', 'Gas drops are safe, but often don’t help. Ask before gripe water']],
      calls2: () => [['Call your pediatrician if:', 'crying 3 or more hours a day'], realMo() < 3 ? ['Call right away if:', 'a rectal temperature of 100.4°F or higher', 1] : null, ['Call 911 if:', 'grunting with every breath, ribs pulling in, or blue lips', 1]],
      why: () => realMo() < 4 ? 'It’s often worst in the evening, and it usually eases by 3–4 months.' : 'It’s past the usual peak now, so a lot of gas is worth a mention at the next checkup.',
      do: [['photo:feeding/gas-burp', 'Burp mid-feed', 'Not just at the end'], ['photo:feeding/gas-legs', 'Bicycle {p} legs', 'Gently, with {o} on {p} back'], ['photo:feeding/gas-tummy', 'Tummy time', 'Awake and watched']],
      doNotes: [['', 'Gas drops and gripe water', 'Gas drops are safe, but often don’t help. Ask before gripe water']],
      calls: { ped: 'crying 3 or more hours a day, or grunting every time {s} {breathe|breathes}.' } }),
    // Nov 24 (Feeding F): spit-up on the same "Is this normal?" template as gas, with a picture of what normal looks like.
    x_spit: () => ({ type: 'expect', ct: 'know', label: 'Feeding challenges', art: 'drop', title: 'Spit-up is common, and usually fine',
      photo: 'feeding/spit-up', pos: '45%', cap: 'A tablespoon or two looks like a lot once it spreads',
      notice: ['A little milk after most feeds', 'Comfortable, and still growing'],
      helps2: [['', 'Hold {o} upright after feeds', 'For 20–30 minutes'], ['', 'Smaller feeds', 'A little more often'], ['', 'Stop when {s} {slow|slows} down', 'No need to finish']],
      helpNotes: [['For sleep', 'Flat on {p} back, even with spit-up, and no wedges']],
      calls2: () => [['Call your pediatrician if:', 'it’s forceful, {s} {cry|cries} and {arch|arches} at most feeds, or {s’s} not gaining weight'], ['Call right away if:', 'green or bloody vomit', 1]],
      why: () => mo() >= 12 ? 'Spit-up this late is worth a mention at the next checkup.' : mo() < 5 ? 'It peaks around 4 months, and it’s usually gone by the first birthday.' : 'It’s past the peak, and it’s usually gone by the first birthday.',
      calls: { ped: 'spit-up that’s forceful, or {s’s} not gaining weight.', er: 'green or bloody vomit.' } }),
    x_allergy: () => ({ type: 'expect', ct: 'know', label: 'Feeding challenges', art: 'steth', title: 'A milk allergy is uncommon, and treatable',
      why: 'Most gas, fussing and spit-up isn’t an allergy at all.',
      notice: ['Blood or mucus in {p} poop', 'A rash, or vomiting after most feeds'],
      helps: [['notepad', 'Take a photo', 'Of the diaper or the rash'], nurse() ? ['heart', 'Keep nursing', 'Your pediatrician will say if anything should change'] : ['bottle', !breast() ? 'Keep the same formula' : !fam() ? 'Keep giving breast milk' : 'Keep {p} milk the same', 'Ask your pediatrician before changing it']],
      calls: { ped: 'you see either of these, or {s’s} gaining slowly.' } }),
    x_gain: () => ({ type: 'expect', ct: 'know', label: 'Feeding challenges', art: 'steth', title: 'Slow gain? Watch swallows and diapers',
      why: 'Some babies are just smaller. {P} growth curve matters more than one weigh-in.',
      notice: ['Dozing at feeds more than swallowing', 'Fewer than 6 wet diapers a day'],
      helps: [['clock', 'Feed often', mo() < 1 ? '8–12 times a day in the first weeks' : 'On cue, and more often if your pediatrician says'], ['steth', 'Follow your pediatrician’s plan', 'Top-ups or set feed times, if they’re suggested']],
      calls: { ped: '{s’s} hard to wake for feeds, or diapers stay low for a day' + (realMo() < 1 ? ', or {s’s} not back to birth weight by 2 weeks.' : '.') } }),
    // Nov 24 (Feeding A): nursing pages only for families who nurse; others get the bottle version of pulling off.
    x_hurt: () => !nurse() ? T.x_refuse() : ({ type: 'expect', ct: 'know', label: 'Feeding challenges', notice: ['Pain past the first minute of a feed', 'A flattened or creased nipple after'], art: 'sofa', title: 'Feeds shouldn’t hurt after the first minute',
      why: 'A little tenderness in the first week is common. Pain all feed long usually means a shallow latch.',
      do: [['hand', 'Re-latch', 'Break the seal with a clean finger, then try again'], ['heart', 'Line {o} up', 'Nose to nipple, so {p} mouth opens wide'], ['steth', 'Get it checked', 'A lactation consultant can check the latch']],
      // Nov 19: holds shown without the baby latched, so parents can copy the position.
      helpTop: () => H().TPLB.photoGrid([['feeding/cradle-real', 'Cradle', 'Baby across your lap, tummy to tummy'], ['feeding/laidback-feed', 'Laid-back', 'Lean back. Baby lies on you, tummy down']]),
      // Nov 19: a latch has to be seen, and AI tools won't draw breastfeeding, so a trusted video shows it.
      video: ['wjt-Ashodw8', 'How a deep latch looks', 'Global Health Media'],
      calls: { ped: 'pain at most feeds after the first week, {s} {seem|seems} hungry after most feeds, or clicking and long feeds with slow gain.' } }),
    x_nobottle: () => !nurse() ? T.x_refuse() : mo() >= 11 ? { type: 'expect', ct: 'know', label: 'Feeding challenges', art: 'cup', notice: ['Pushes the bottle away', 'Happy to sip from a cup'], title: 'No bottle? An open cup works now',
      why: 'Bottles phase out between 12 and 18 months anyway, so there’s no need to push one.',
      do: [['cup', 'Milk in an open or straw cup', 'With meals and snacks'], ['heart', 'Keep nursing', 'As much or as little as you both like']],
      calls: { ped: '{s} {refuse|refuses} most feeds and meals, or {have|has} fewer wet diapers.' } } : ({ type: 'expect', ct: 'know', label: 'Feeding challenges', notice: ['Pushes the nipple out, or cries', 'Takes it from others, but not from you'], art: 'bottle', title: 'Won’t take a bottle? It often takes practice',
      why: 'Many babies who nurse refuse a bottle at first, especially from the parent who nurses.',
      do: [['hand', 'Someone else offers', 'Ideally with you out of the room'], ['moon', 'Before {s’s} very hungry', 'Calm and a little sleepy is easiest'], ['bottle', 'Slow-flow nipple', 'Try another shape if {s} {fight|fights} it']],
      doNotes: [['', 'Keep it low-pressure', 'A few minutes once a day. Upset? Stop, and try again tomorrow']],
      calls: { ped: '{s} {refuse|refuses} all feeds, or {have|has} fewer wet diapers.' } }),
    x_refuse: () => ({ type: 'expect', ct: 'know', label: 'Feeding challenges', art: nurse() ? 'heart' : 'bottle', notice: ['Pulling off and fussing', 'Arching or turning away mid-feed'], title: 'Pulling off at feeds? Usually a small fix',
      why: 'It’s often air, a fast flow, or a stuffy nose.',
      // Nov 24 (Feeding E): physical steps get a photo each, in Everyday care's step card.
      doFig: () => window.ctPhotoSteps([['photo:feeding/burp-shoulder', 'Burp, then retry', 'Trapped air can feel like being full'], nurse() ? ['photo:feeding/laidback-feed', 'Lean back as you feed', 'It slows milk that comes fast'] : ['photo:feeding/pace-step-2', 'Check the nipple', 'Gulping means too fast. Frustrated means too slow'], ['photo:health/cold-saline', 'Clear {p} nose', 'A few saline drops, then gentle suction']],
        mo() >= 3 ? [['Distracted?', 'Feed somewhere quiet and dim']] : null),
      calls: () => fevCalls(['too sleepy to feed', 'refusing several feeds in a row']) }),

    // ---------- Solids ----------
    // Nov 19: the four signs sit in the top card as photo rows to tick (the same ticks as the Feeding stage page), and the advice under them follows the ticks.
    // Nov 19 (review): swallowing can only be seen once food is offered, so it moves to "In the first tastes".
    // Three signs before starting, each tappable; the result counts those three.
    z_ready: () => { const h = H(), m = mo(), n = [0, 1, 2].filter(i => h.signsOn(i)).length;
      return { type: 'expect', label: 'Is {s} ready?', art: 'highchair', title: 'Most babies start solids around 6 months',
        why: 'Three signs usually show up around then. Milk is all {s} {need|needs} until they do.',
        normalTitle: 'Signs to look for first', normal: () => h.TPLB.photoRows([0, 1, 2].map(i => [['feeding/sign-head', 'feeding/sign-sits', 'feeding/sign-interest2'][i], h.READY[i][3], ['Holds it up on {p} own', 'In a high chair, or on your lap', 'Reaches for your food, or watches every bite'][i]]), { title: 'Tap each one once you’ve seen it', isOn: h.signsOn, onclick: i => `hubToggleReady(${i})` }) + (n === 3 ? (m >= 6 ? h.TPLB.result('{S’s} ready to start!', 'All three signs, right on time.') : h.TPLB.result('All three signs!', 'Most babies still start around 6 months.', 'next')) : ''),
        moreTitle: 'In the first tastes', more: () => '<section class="ph-rowcard">' + h.TPLB.rows([['mouth', 'Swallows more than {s} {push|pushes} out', 'Pushing food out with the tongue is common at first. It fades with practice'], ['eye', 'Opens up as the spoon comes', 'And turns away when {s’ve} had enough']], 'Feeding') + '</section>',
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
        why: 'Small, soft pieces of your meal give {o} real practice.',
        pictureTitle: 'Ideas from your plate', picture: () => H().TPLB.chips(['Shredded chicken', 'Scrambled egg', 'Squashed beans', 'Soft pasta', 'Banana or ripe pear', 'Soft-cooked veggies']),
        ordered: false, steps: [['plate', 'Share from your plate', 'Take out {p} portion before adding salt'], ['hand', '{S} {feed|feeds} {o}self', 'Fingers first, and a spoon to practice']] }
      : { type: 'howto', ct: 'howto', label: 'First meals', art: 'highchair', title: 'First meals are just a few bites',
        why: 'Solids are practice for now, and milk is still {p} main food. Let {o} set the pace.',
        photo: 'feeding/first-foods', pos: '45%', alt: 'A baby in a high chair with a bowl of soft food', call: [['Sitting up, strapped in', 'tl', 44, 70], ['A few soft spoonfuls', 'br', 28, 80]],
        near: [['High chair', 'highchair'], ['Soft food', 'bowl'], ['Small spoon', 'cup'], ['Bib', 'shirt']],
        moves: [['photo:feeding/meal-1', 'Sit {o} up, facing you', 'Strapped in, at a calm time when {s’s} not too hungry'], ['photo:feeding/meal-2', 'Offer a little', 'A spoonful, or a soft strip {s} can hold'], ['photo:feeding/meal-3', 'Let {o} lead', '{S} {open|opens} up for more, and {turn|turns} away when done']],
        tips: [['Expect mess', 'Most of it ends up on the tray at first']], linkTo: ['Gagging or choking? Know the difference', 'chg:Feeding:mock:z_gag'],
        safe: [['Stay with {o}, sitting up', 'For the whole meal, every time'], ['Gagging is common and noisy', 'Choking is quiet, or only a weak cough. That’s when to start first aid']],
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
        doNotes: [['', 'Go by skills, not the month', 'The ages are only examples'], ['', 'Why not wait', 'Babies still on smooth purées past about 9 months can find lumps harder later']] }; },
    z_rotate: () => ({ type: 'expect', label: 'Keeping foods in rotation', art: 'peanut', title: 'Once {s’ve} had peanut or egg, keep it coming',
      why: 'Eating it a few times a week helps keep an allergy from starting.',
      doTitle: 'Easy ways to serve them', doFig: () => H().TPLB.photoGrid([['feeding/rot-oats', 'Peanut in oatmeal', 'Stir in thinned peanut butter'], ['feeding/rot-pancake', 'Egg in pancakes', 'Soft strips, well cooked']]),
      }),
    // Nov 19: the squish test in the top card, then sizes by age (this baby's marked), what to try, how to make risky foods safe, and safety while eating.
    z_shapes: () => { const T = H().TPLB, nine = mo() >= 9;
      return { type: 'howto', label: 'Safe finger foods', art: 'hand', title: 'Finger foods should squish when pressed',
        why: '{P} gums can mash it, no teeth needed.',
        heroTitle: 'The squish test', hero: () => `<section class="care-tpl-card ph-squish">${T.photoPins('feeding/squish2', 'A thumb and finger squishing a soft cooked sweet potato strip flat', [['Press gently', 38, 42, 'l'], ['It should give way', 47, 68, 'b']], 'is-wide')}</section>`,
        // Nov 19: like the inspiration, three blocks only: the squish test, what to try, and how to keep it safe (icons, not more photos).
        stepsTitle: 'A few foods to try', // Nov 23: from 9 months, one photo of pea-size pieces replaces the three strip photos.
        stepsFig: () => T.photoGridMore(nine ? [['feeding/pieces-9', 'Banana, avocado, egg', 'Soft, pea-size pieces'], ['feeding/opt-broccoli', 'Broccoli', 'Well cooked, stem to hold'], ['feeding/opt-pasta', 'Pasta', 'Soft, well cooked'], ['feeding/nutbutter', 'Toast', 'Nut butter spread thin']]
          : [['feeding/opt-avocado', 'Avocado', 'Ripe strips'], ['feeding/opt-banana', 'Banana', 'Strips, not rounds'], ['feeding/opt-egg', 'Egg', 'Omelet strips'], ['feeding/nutbutter', 'Toast', 'Nut butter spread thin'], ['feeding/opt-broccoli', 'Broccoli', 'Well cooked, stem to hold'], ['feeding/opt-pasta', 'Pasta', 'Soft, well cooked']], 'See more foods'),
        tips: [nine ? ['hand', 'Small, soft pieces', 'About pea-size, to pinch'] : ['hand', 'Finger-size strips', 'Easy to grip. Small pieces come later'], ['bowl', 'Quarter grapes lengthwise', 'Cherry tomatoes too. No whole nuts'], ['highchair', 'Seated upright, with you', 'Every bite, never on the move']] }; },
    z_allergens: () => ({ type: 'howto', label: 'Common allergens', art: 'peanut', title: 'Try the common allergens early',
      why: 'Start around 6 months. Ask first if {s} has severe eczema or an egg allergy.',
      pictureAfter: true, pictureTitle: 'Keep track', picture: () => X().pron(window.__alCard()),
      ordered: false, steps: [['peanut', 'One allergen at a time', 'At home, earlier in the day, so you can watch'], ['egg', 'In a safe form', 'Thinned peanut butter, egg well cooked'], ['plate', 'Keep it going', 'A few times a week once {s’ve} had it']],
      stepsTitle: 'Peanut, the safe way', stepsFig: () => ctPhotoSteps([['photo:feeding/pb-spoon', 'A little smooth peanut butter', 'About ½ teaspoon. Never whole nuts'], ['photo:feeding/pb-thin', 'Thin it', 'With warm water or breast milk, until runny'], ['photo:feeding/pb-offer', 'Offer it at home', 'Early in the day, so you can watch. Then a few times a week']], [['Egg works the same way', 'Well cooked, never runny']]),
      // Nov 24 flag 10: the reaction signs use the standard When to call card, like every other page.
      calls: { ped: 'a few hives, or vomiting, after a new food.', nowLabel: 'Call 911', now: 'trouble breathing, swelling of the lips or face, hives all over, hives with vomiting, or {s’s} very sleepy or floppy.' } }),
    z_plan: () => ({ type: 'expect', label: 'Foods to wait on', art: 'plate', title: mo() >= 12 ? 'Honey is fine now. Some foods wait until 4' : 'Honey waits until age 1, some foods until 4',
      why: 'A few foods aren’t safe for babies yet, even once solids are going well.',
      // Nov 19: photos, so a parent recognizes the food at a glance; a red cross marks each one.
      // Nov 19 (review): what simply waits, apart from what's fine once it's served differently (with the grape shown both ways).
      // Nov 24 (Feeding B): from the first birthday, honey and whole milk are fine; only the until-4 foods still wait.
      normalTitle: () => mo() >= 12 ? 'Fine from age 1' : 'Wait until age 1', normal: () => mo() >= 12 ? H().TPLB.photoGridMore([['feeding/no-honey', 'Honey', 'Fine now'], ['feeding/no-milk', 'Whole milk', 'Up to about 16 oz a day, from a cup']], '') : H().TPLB.photoGridMore([['feeding/no-honey', 'Honey', 'Risk of botulism'], ['feeding/no-milk', 'Cow’s milk to drink', 'Fine in cooking'], ['feeding/no-juice', 'Juice', 'Milk and water are all {s} {need|needs}']], '', 'no'),
      moreTitle: 'Serve these differently until age 4', more: () => H().TPLB.photoPins('feeding/grape', 'A whole grape beside one cut into quarters lengthwise', [['Whole: choking risk', 27, 64, 'b'], ['Quartered: fine', 70, 64, 'b']]) + '<section class="ph-rowcard">' + H().TPLB.rows([['photo:feeding/grape-q', 'Grapes and cherry tomatoes', 'Quarter them lengthwise'], ['photo:feeding/no-hotdog', 'Hot dogs and sausages', 'Never rounds like these. Cut thin strips'], ['photo:feeding/nutbutter', 'Nuts and nut butter', 'No whole nuts. Spread nut butter thin'], ['photo:feeding/carrot', 'Hard raw fruit and veg', 'Cook or grate until soft']], 'Feeding') + '</section>' }),
    z_milkfood: () => ({ type: 'expect', label: 'Milk and solids', art: 'cup', title: 'No set order for milk and meals',
      why: 'A meal fits in wherever {s’s} awake and happy.',
      heroTitle: 'Water from a cup', hero: () => H().TPLB.photoPins('feeding/g-cups', 'An open cup and a straw cup', [], 'is-wide'),
      do: [['bottle', 'Offer milk before or after', 'Either works, so go with {p} mood'], ['cup', 'Water from a cup', 'Open or straw. Hold it for {o}, and let {o} try']],
      doNotes: [['', 'Milk eases off slowly', '{S}’ll drink a little less as meals grow, mostly after 9 months']] }),
    z_day: () => ({ type: 'expect', label: 'Meals and milk', art: 'plate', title: 'Some days {s} {eat|eats} a lot, some days little',
      why: 'You choose what and when. {S} {choose|chooses} how much.',
      normalTitle: 'How much {s} {eat|eats}, day by day',
      normal: () => { const v = [70, 35, 50, 90, 40, 60, 80], d = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        return `<figure class="hub-figure tpl-week" role="img" aria-label="${H().F('How much a baby eats over a week: some days a lot, some days little. It evens out.')}"><div class="tpl-week-bars">${v.map((x, i) => `<div><i style="height:${x}%"></i><small>${d[i]}</small></div>`).join('')}</div></figure>`; },
      normalNotes: [['', 'That’s normal', 'Look at the week, not the day']],
      do: [['plate', 'Offer, then let {o} decide', 'No coaxing, bribes or extra bites'], ['heart', 'Pair new with familiar', 'Something {s} {like|likes}, next to something new']],
      doNotes: [['', 'Getting enough?', 'Wet diapers, energy, and steady growth at checkups']] }),
    z_milk12: () => { const b = X().isBottle(), f = fam();
      // Nov 24 (Feeding B, J): the headline fits the baby's age, and says why, not the same thing twice.
      return { type: 'expect', label: 'Turning 1', art: 'cup', title: mo() >= 12 ? 'Whole milk can start now, from a cup' : 'A cup at meals now, whole milk at 12 months',
        why: 'Cups are kinder to teeth, and practice now makes the switch easier.',
        heroTitle: 'From bottle to cup', hero: () => H().TPLB.photoPins('feeding/bottle-cup', 'A bottle next to an open cup of milk', [['Bottle', 33, 80, 'b'], ['Open cup', 62, 80, 'b']], 'is-wide'),
        do: [['cup', 'Whole milk', 'Not low-fat, until age 2'], ['drop', 'Up to 24 oz a day', b ? 'More crowds out iron-rich food' : 'From a cup. Nursing doesn’t count'], b ? ['bottle', 'Drop one bottle at a time', 'Swap one for a cup each week'] : null].filter(Boolean),
        doNotes: [b ? ['', 'Picky about the taste?', (f ? 'Mix half and half with formula' : 'Mix half and half with breast milk') + ' for a week. Toddler formula isn’t needed'] : null, ['', 'Vitamin D after 1', 'Ask your pediatrician how much {s} {need|needs}']] }; },
    z_refuse: () => ({ type: 'expect', ct: 'know', label: 'Feeding challenges', notice: ['Turning away or closing {p} mouth', 'Pushing food off the tray'], art: 'plate', title: 'Refusing food is normal, and it passes',
      why: 'Some days {s}’ll eat a lot, and some days almost nothing.',
      do: [['clock', 'Try again later', 'It can take 10–15 tries'], ['hand', 'Let {o} touch it first', 'Playing is learning'], ['plate', 'Eat together', '{S} {copy|copies} you']],
      doNotes: [['', 'Split the job', 'You choose what. {S} {choose|chooses} how much']],
      calls: { ped: 'refusing most foods for weeks, or fewer wet diapers.' } }),
    z_teeth: () => ({ type: 'expect', ct: 'know', label: 'Feeding challenges', notice: ['Drooling and chewing on {p} hands', 'Pulling off partway through feeds'], art: 'tooth', title: 'Teething can make feeds short and fussy',
      why: 'Sore gums usually settle in a few days.',
      do: [['snow', 'Chill a teether', 'Or a washcloth, to chew on'], mo() >= 6 ? ['bowl', 'Serve chilled food', 'Cool yogurt or mashed fruit soothes gums'] : ['hand', 'Rub {p} gums', 'With a clean finger, for a minute or two'], ['clock', 'Try shorter feeds', 'More often, until {p} gums settle']],
      doNotes: [['', 'Skip numbing gels and amber necklaces', 'Neither is safe for babies']],
      calls: () => mo() < 3 ? { ped: 'refusing to drink.', right: 'a rectal temperature of 100.4°F or higher. Teething doesn’t cause a fever' } : { ped: 'refusing to drink, or ' + fev() + '. Teething doesn’t cause a fever.' } }),
    z_sick: () => ({ type: 'expect', ct: 'know', label: 'Feeding challenges', notice: ['A stuffy nose that makes feeding hard', 'Wanting milk more than food'], art: 'thermo', title: 'When {s’s} sick, milk and fluids come first',
      why: '{S} may eat less for a few days. That’s okay.',
      do: [['bottle', 'Offer milk more often', 'Small feeds stay down better'], ['drop', 'Clear {p} nose first', 'Saline drops, then suction'], ['bowl', 'Let solids wait', 'Milk keeps {o} hydrated for now']],
      calls: { ped: 'fewer wet diapers, refusing milk, or vomiting that keeps happening.' } }),
    z_reaction: () => ({ type: 'expect', ct: 'know', label: 'Feeding challenges', art: 'mouth', title: 'Red around the mouth is usually from food',
      why: 'Acidic foods can redden the skin they touch. A true reaction looks different.',
      look: () => H().TPLB.photoGrid([['feeding/rash-mouth', '✓ Usually fine', 'Red only where food touched, and it fades'], ['feeding/rash-hives', '✕ A true reaction', 'Raised hives that spread, or vomiting']]),
      helps: [['notepad', 'Note it', 'The food, and what happened. A photo helps'], ['clock', 'Hold off on that food', 'Ask before trying it again']],
      calls: { ped: 'hives or vomiting follow a new food. Call the same day.', now: 'trouble breathing, swollen lips or face, or {s’s} very sleepy or floppy.', nowLabel: 'Call 911' } }),
    // Nov 19: the two photo cards in the top card; what to do side by side; the first-aid steps in order, the video right after them, the call card last.
    z_gag: () => { const T = H().TPLB;
      // Nov 19 (review): no photo of choking (a baby clutching the neck isn't how babies show it), and no "silent":
      // a choking baby may make no sound, or only a weak cough or high-pitched noise (MedlinePlus, Nationwide Children's).
      return { type: 'urgent', label: 'Gagging or choking', art: 'mouth', title: 'Gagging is normal. Choking isn’t.',
        why: 'Gagging is how {s} {learn|learns} to eat. Loud coughing means air is getting through.',
        tellTitle: 'How to tell them apart', figure: () => T.versus(['Gagging: stay close', 'Loud coughing or gagging, red face, watery eyes. Let {o} work it out.'], ['Choking: act now', 'Can’t cry or cough, or only a weak cough or high-pitched sound. Lips may turn blue.']),
        // Nov 24 (Yarden): a photo for every step, in Everyday care's step card. Holds per the 2025 AHA/AAP guidelines.
        doTitle: 'If {s’s} choking', doFig: () => ctPhotoSteps([['photo:feeding/choke-call', 'Get help', 'Have someone call 911, or call on speaker'],
          ['photo:feeding/choke-back', '5 back blows', 'Face down along your forearm, head lower than {p} chest. Firm blows between the shoulder blades'],
          ['photo:feeding/choke-chest', '5 chest thrusts', 'Turn {o} face up, head still low. Heel of one hand, center of the chest']],
          [['Repeat until it’s out', 'If {s} {stop|stops} responding, start CPR'], mo() >= 11.5 ? ['From age 1, the steps change', 'Children over 1 get abdominal thrusts. A child CPR class shows how'] : ['Never sweep {p} mouth with a finger', 'It can push food further in']]),
        video: ['ShaNuST_58A', 'Choking first aid for babies under 1', 'American Red Cross'],
        // Nov 24: one tap to the foods that cause most choking, so the Feeding page needs one safety row, not two.
        go: [['plate', 'Foods to wait on', 'Honey, and the foods that cause choking', 'chg:Feeding:mock:z_plan'], ['heart', 'Infant CPR, step by step', 'If {s} stops responding', 'chg:Health:d:cpr', 'Health']] }; },
  };

  // The two "Does something seem not quite right?" menus keep their list, and end with the shared call card instead of the old boxes.
  const MENU = {
    x_tough: () => fevCalls(['fewer wet diapers', 'too sleepy to feed'], { er: 'green or bloody vomit.' }),
    z_tough: () => fevCalls(['vomiting or hives after a food', 'fewer wet diapers'], { now: 'trouble breathing, or swollen lips or face.', nowLabel: 'Call 911' })
  };
  const menuTail = (h, calls) => { const i = h.indexOf('<section class="ss-moment"><section class="hub-card hub-versus"'); if (i < 0) return h;
    const tail = h.slice(i), styles = (tail.match(/<style>[\s\S]*?<\/style>/g) || []).join(''), t = tail.replace(/<style>[\s\S]*?<\/style>/g, '');
    const open = (t.match(/<div\b/g) || []).length, close = (t.match(/<\/div>/g) || []).length;
    return h.slice(0, i) + `<div class="care-tpl is-urgent">${H().TPLB.calls(calls)}</div>` + styles + '</div>'.repeat(Math.max(0, close - open)); };

  // Older Feeding pages that now open one of these.
  const ALIAS = { y_growth: 'enough', y_nurse: 'm1_now', y_bottle: 'm1_now', y_away: () => (X().stg() === 1 && mo() < 3 ? 'm1_apart' : 'm2_away'), y_night: 'm1_eve', y_evening: 'm1_eve',
    z_signs: 'z_ready', z_setup: 'z_start', z_tray: 'z_start', z_allergy: 'z_plan', z_notyet: 'z_plan', z_water: 'z_milkfood', z_family: 'z_meal', z_appetite: 'z_day', picky: 'z_refuse' };
  // Each page keeps Feeding's own header: the soft card in the color of what you tapped, with its small picture,
  // taken from the page it replaces, so Feeding looks like Feeding and Sleep looks like Sleep.

  /* Nov 23 (Yarden approved the before/after): making formula, a first meal and gas use Everyday care's page layout.
     A how-to: one big photo with pointing labels, "Have nearby" icons, three steps with small photos and up to two notes,
     then "Keep her safe". A what-to-know page: photo with a caption, what you may notice, what helps, the call card. */
  const CT_START = { tl: [80, 56], tr: [320, 56], bl: [80, 244], br: [320, 244] };
  // Everyday care's step card (photo, number in a circle, title, line), in Feeding's colors.
  const ctPhotoSteps = (moves, notes) => { const F = H().F; return `<div class="ct-stepcard" style="--ct-ink:#2b2733;--ct-soft:#6b6573;--ct-purple:#884866;--ct-lav:#f9e4ec;--ct-line:#ece7e2"><ol class="ct-steps2">${moves.map(([th, t, sub], k) => `<li><span class="ct-th">${/^photo:/.test(th) ? `<img src="assets/${th.slice(6)}.jpg?v=3" alt="" loading="lazy">` : `<i>${typeof hubArt === 'function' ? hubArt(th, 'Feeding') : ''}</i>`}</span><span class="ct-tx"><b><em>${k + 1}</em>${F(t)}</b><small>${F(sub)}.</small></span></li>`).join('')}</ol>${notes ? `<div class="ct-notes">${notes.filter(Boolean).map(([t, d]) => `<p><b>${F(t)}${/[.?!]$/.test(t) ? '' : '.'}</b> ${F(d)}${/[.?!]$/.test(d) ? '' : '.'}</p>`).join('')}</div>` : ''}</div>`; };
  window.ctPhotoSteps = ctPhotoSteps;
  const ctBody = q => { const F = H().F, v = x => typeof x === 'function' ? x() : x, A = n => typeof hubArt === 'function' ? hubArt(n, CAT) : '';
    const sent = t => { t = F(v(t) || ''); return !t ? '' : /[.?!]$/.test(t) ? t : t + '.'; };
    const h2 = t => `<h2 class="ct-h2">${F(t)}</h2>`;
    const notes = n => (n = (v(n) || []).filter(Boolean)).length ? `<div class="ct-notes">${n.map(([b, t]) => `<p><b>${sent(b)}</b> ${sent(t)}</p>`).join('')}</div>` : '';
    const call = v(q.call) || [];
    const arrows = call.map(([, at, x, y]) => { const [sx, sy] = CT_START[at], ex = x * 4, ey = y * 3, mx = (sx + ex) / 2, my = (sy + ey) / 2, dx = ex - sx, dy = ey - sy, b = at === 'tl' || at === 'br' ? 0.25 : -0.25;
      return `<path d="M${sx} ${sy} Q${(mx - dy * b).toFixed(0)} ${(my + dx * b).toFixed(0)} ${ex} ${ey}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" marker-end="url(#fdah)" filter="drop-shadow(0 1px 2px rgba(0,0,0,.35))"/>`; }).join('');
    const img = (src, alt, pos) => `<img src="assets/${src}.jpg?v=1" alt="${F(alt || '').replace(/"/g, '&quot;')}" loading="lazy" style="object-position:50% ${pos || '40%'}">`;
    if (q.ct === 'howto') return `<div class="ct-page is-howto">`
      + `<figure class="ct-hero">${img(q.photo, q.alt, q.pos)}<svg class="ct-arrows" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="fdah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#fff"/></marker></defs>${arrows}</svg>${call.map(([l, at]) => `<span class="ct-callout is-${at}">${F(l)}</span>`).join('')}</figure>`
      + (q.near ? h2('Have nearby') + `<div class="ct-near">${v(q.near).map(([t, i]) => `<span><i>${A(i)}</i><small>${F(t)}</small></span>`).join('')}</div>` : '')
      + h2('Do it in a few steps') + `<div class="ct-stepcard"><ol class="ct-steps2">${v(q.moves).map(([th, t, sub], k) => `<li><span class="ct-th">${/^photo:/.test(th) ? `<img src="assets/${th.slice(6)}.jpg?v=1" alt="" loading="lazy">` : `<i>${A(th)}</i>`}</span><span class="ct-tx"><b><em>${k + 1}</em>${F(v(t))}</b><small>${sent(sub)}</small></span></li>`).join('')}</ol>${notes(q.tips)}</div>`
      + (q.linkTo ? `<button class="ct-alt" onclick="openPage('${q.linkTo[1]}')">${F(q.linkTo[0])} <span aria-hidden="true">›</span></button>` : '')
      + (v(q.safe) ? h2('Keep {o} safe') + `<div class="ct-safecard">${notes(q.safe)}</div>` : '') + `</div>`;
    // Nov 24 (Yarden): every Feeding challenge uses this one layout. The picture shows only where there's something to see.
    const co = v(q.calls) || {}, calls = v(q.calls2) || [co.ped && ['Call your pediatrician if:', co.ped], co.right && ['Call right away if:', co.right, 1], co.er && ['Go to the ER if:', co.er, 1], co.now && [(co.nowLabel || 'Call 911') + ' if:', co.now, 1]];
    const hn = (v(q.helpNotes) || v(q.doNotes) || v(q.helpsNotes) || []).filter(Boolean).map(n => n.length === 3 ? n.slice(1) : n);
    const hl = v(q.helps2) || v(q.do) || v(q.helps) || [];
    return `<div class="ct-page is-know">` + (q.look ? h2('See what it looks like') + v(q.look) : q.photo ? h2('See what it looks like') + `<figure class="ct-look" id="ct-look">${img(q.photo, q.cap, q.pos)}<figcaption>${sent(q.cap)}</figcaption></figure>` : '')
      + (v(q.notice) ? h2('What you may notice') + `<div class="ct-notice">${v(q.notice).map(t => `<div>${F(t)}</div>`).join('')}</div>` : '')
      + h2('What helps') + (q.helpTop ? v(q.helpTop) : '') + (q.helpMoves ? ctPhotoSteps(v(q.helpMoves), hn) : q.doFig ? q.doFig() : `<div class="ct-helpcard"><ul class="ct-helps">${hl.filter(Boolean).map(t => `<li><i><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i><span class="ct-hl"><b>${F(Array.isArray(t) ? t[1] : t)}</b>${Array.isArray(t) && t[2] ? `<small>${sent(t[2])}</small>` : ''}</span></li>`).join('')}</ul>${notes(hn)}</div>`)
      + (q.video ? h2('Watch how') + `<div class="ph-video">${hubEmbed(...q.video)}</div>` : '')
      + h2('When to call') + `<section class="care-calls is-titled"><span class="care-calls-ico"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.6 3.5h2.6l1.3 4-2 1.4a11 11 0 0 0 6.6 6.6l1.4-2 4 1.3v2.6a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1Z"/></svg></span><div>${calls.filter(Boolean).map(([l, t, u]) => `<p${u ? ' class="is-urgent"' : ''}><b>${F(l)}</b> ${sent(t)}</p>`).join('')}</div></section></div>`; };
  const CT_PINK = ['#f7d9e5', '#884866'];
  const draw = (q, old) => { const h = H(), F = h.F, v = x => typeof x === 'function' ? x() : x;
    const m = typeof old === 'string' ? old.match(/<div class="dev-area-head ss-head" style="--area:(#[0-9a-f]+);--area-ink:(#[0-9a-f]+)">(<span class="dev-area-head-art"[^>]*>[\s\S]*?<\/svg><\/span>)?/i) : null;
    // Nov 24 (Feeding D): every Feeding page wears Feeding's pink, never another guide's blue or yellow.
    const bg = q.ct ? CT_PINK[0] : '#fbe4ec', ink = q.ct ? CT_PINK[1] : '#9b4766';
    // Nov 19: the topic's own icon on a white tile, as on the Safety step pages, in place of the abstract shapes readers found meaningless.
    const art = q.art && typeof hubArt === 'function' ? `<span class="dev-area-head-art sf-head-art">${hubArt(q.art, CAT)}</span>` : (m && m[3] ? m[3] : '');
    const why = v(q.why);
    return `<div class="quiet-category hub-page hub-detail care-v2" data-overview="${CAT}" data-ss="1" style="${typeof yearTheme === 'function' ? yearTheme(CAT) : ''};--ss-bg:${bg};--ss-ink:${ink}">${typeof detailPageTop === 'function' ? detailPageTop(CAT) : ''}`
      + `<div class="dev-area-head ss-head" style="--area:${bg};--area-ink:${ink}">${art}<p class="hub-context">${F(v(q.label) + (q.ct === 'howto' ? ' · How to' : ''))}</p><h1>${F(v(q.title))}</h1>${why ? `<p class="hub-lead">${F(why)}</p>` : ''}</div>`
      // Nov 19: a page's main visual comes first, right under the standard top card (never inside it), so every top card looks the same.
      + ((hero => hero ? `<div class="ph-first">${v(q.heroTitle) ? `<h2 class="hub-h2">${F(v(q.heroTitle))}</h2>` : ''}${hero}</div>` : '')(v(q.hero)))
      + (q.ct ? `<div class="care-tpl is-${q.ct}">${ctBody(q)}</div></div>` : `<div class="care-tpl is-${q.type}">${rowsNotCircles(() => h.TPLS[q.type](q, CAT))}</div></div>`); };
  // Nov 24 (Yarden: Feeding matches Sleep): unnumbered icon tiles read as plain rows, not big icon circles.
  const rowsNotCircles = fn => { const T = H().TPLB, orig = T.tiles;
    T.tiles = (items, cat, numbered) => { const it = typeof items === 'function' ? items() : items;
      return numbered || !Array.isArray(it) || it.some(t => t && /^photo:/.test(t[0])) ? orig(items, cat, numbered) : '<section class="ph-rowcard">' + T.rows(it, cat) + '</section>'; };
    try { return fn(); } finally { T.tiles = orig; } };
  const base = window.changesRoute;
  window.changesRoute = function (r, ...a) {
    if (window.__fdx && X().oldFeeding) r = X().oldFeeding(r);
    const q = String(r).split(':');
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && window.__hub && window.__fdx) {
      const al = ALIAS[q[3]]; if (al) q[3] = typeof al === 'function' ? al() : al;
      if (T[q[3]]) { const page = T[q[3]](q[4]); if (page) { window.__fdLast = r;
        // Nov 24 (Feeding B): a solids page read before solids is labeled as reading ahead, so "now" never means a 10-week-old.
        try { const id = q[3], am = X().ageMo(), prep = ['z_ready', 'z_signs', 'z_start', 'z_plan', 'z_allergens'].includes(id);
          const soon = /^z_/.test(id) && !['z_teeth', 'z_sick', 'z_iron'].includes(id) && (prep ? am < 4 : am < 5.5) && !(typeof answers !== 'undefined' && answers.solids === 'Yes');
          if (soon) { const lab = page.label; page.label = () => 'Read ahead · From about 6 months'; page.__lab = lab; } } catch (e) {} return draw(page, base.call(this, 'chg:' + CAT + ':mock:' + q.slice(3).join(':'), ...a)); } }
      if (MENU[q[3]]) return menuTail(base.call(this, r, ...a), MENU[q[3]]());
    }
    return base.call(this, r, ...a);
  };
})();
