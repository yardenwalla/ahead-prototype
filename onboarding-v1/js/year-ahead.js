/* Ahead · Timeline reimagined: the year as a path with the baby on it, the next few big changes as cards,
   and a read-ahead page per change that says when, the signs it's close, and everything it changes (each row
   opens the page that already covers it). Preview: two change pages (crawling, solids). */
(function () {
  const H = () => window.__hub, F = s => H().F(s);
  const MONTH = 30.4375 * 864e5;
  const ageNow = () => { const from = profile.early && profile.due ? parse(profile.due) : parse(profile.dob); return (NOW - from) / MONTH; };
  const C = [
    ['crying', 0.5, 3, 'Sleep', 'heart', 'The crying peak', 'Fussy evenings, at their worst around 6–8 weeks', "__GO__", '2 weeks–3 months'],
    ['smile', 1.5, 2, 'Development', 'smile', 'First smiles', 'Maya starts smiling back when you smile', "__GO__"],
    ['nights', 1.5, 4, 'Sleep', 'moon', 'Longer nights', 'One longer sleep at night, often 4–5 hours', "__GO__"],
    ['regress', 3, 5, 'Sleep', 'moon', 'The 4-month sleep shift', 'More night waking, for a few weeks', "__GO__"],
    ['roll', 4, 6, 'Development', 'roll', 'Rolling', 'The swaddle comes off', "__GO__"],
    ['solids', 6, 6.5, 'Feeding', 'bowl', 'Starting solids', 'Food alongside milk, a few bites at first', "__GO__", 'Around 6 months'],
    ['twonaps', 6, 9, 'Sleep', 'sun', 'Three naps become two', 'Two naps a day, and an earlier bedtime', "__GO__"],
    ['crawl', 6, 10, 'Development', 'crawl', 'Crawling', 'Maya can get around, so babyproof first', "__GO__"],
    ['sit', 6, 9, 'Development', 'sit', 'Sitting up', 'Maya sits up without your help', "__GO__"],
    ['tooth', 6, 12, 'Daily rhythm', 'tooth', 'The first tooth', 'Time to start brushing', "__GO__"],
    ['finger', 7, 9, 'Feeding', 'bowl', 'Textures and finger foods', 'Lumpier food, and pieces to pick up', "__GO__"],
    ['carseat', 9, 12, 'Out and about', 'car', 'A bigger car seat', 'Most outgrow the infant seat by height', "__GO__", 'Often in the first year'],
    ['sep', 8, 10, 'Development', 'heart', 'Separation anxiety', 'Goodbyes and bedtime can get harder', "__GO__"],
    ['pull', 9, 12, 'Development', 'stand', 'Pulling up to stand', 'Maya stands holding furniture, so anchor it', "__GO__"],
    ['words', 10, 14, 'Development', 'chat', 'First words', 'Often “mama” or “dada” for a parent', "__GO__"],
    ['milk', 12, 12.5, 'Feeding', 'cup', 'Milk at 12 months', 'Whole milk from a cup can replace formula', "__GO__", 'At 12 months'],
    ['steps', 12, 15, 'Development', 'stand', 'First steps', 'Walking holding on, then on {p} own', "__GO__"]
  ].map(([id, start, end, cat, icon, title, why, go, range]) => ({ id, start, end, cat, icon, title, why, go: `openPage('chg:Timeline:c:${id}')`, range: range || `${start}–${end} months` }));
  const CHECKUPS = [2, 4, 6, 9, 12];
  const TOUCH = {
    smile: 'More face-to-face time, and play starts to feel like a conversation.',
    nights: 'A longer stretch at night, and a good time to start a bedtime routine.',
    regress: 'More night waking for a few weeks, so protect your own rest too.',
    roll: 'The swaddle comes off, beds and sofas are off-limits, and the floor needs clearing.',
    sit: 'The crib mattress goes lower, and the bouncer’s days are numbered.',
    twonaps: 'Bedtime moves earlier, and there’s more time for outings between naps.',
    tooth: 'Brushing starts, and sore gums can mean fussier days.',
    crawl: 'Every room opens up: time to babyproof, lower the crib mattress and make floor time.',
    solids: 'A high chair, choking first aid, and a new rhythm to your days.',
    finger: 'Messier meals, new food shapes, and knowing gagging from choking.',
    sep: 'Harder goodbyes, night waking, and a gentler start with caregivers.',
    pull: 'Furniture gets strapped to the wall, and the crib mattress goes to its lowest.',
    words: 'More talking, reading and naming things together.',
    milk: 'Cow’s milk from a cup, and the bottle starts to go.',
    carseat: 'A new car seat, still facing the back.',
    steps: 'Everything higher is in reach, and more time on {p} feet.',
    onenap: 'One long midday nap, and a new shape to your days.'
  };
  const AREA = { Development: 'Play', Feeding: 'Feeding', Sleep: 'Sleep', Health: 'Health', Safety: 'Safety', 'Daily rhythm': 'Everyday care', 'Out and about': 'Outings', Childcare: 'Childcare' };
  const touches = c => { const p = PAGES[c.id]; return p ? [...new Set(p.rows.map(r => r[1]))] : []; };
  const touchPills = c => { const t = touches(c); return t.length > 1 ? `<span class="ya-touch">${t.map(cat => `<span class="ya-touch-pill" style="${yearTheme(cat)}">${typeof catIcon === 'function' ? catIcon(cat) : ''}${F(AREA[cat] || cat)}</span>`).join('')}</span>` : ''; };
  const range = c => c.range.replace(/^(\d+(\.5)?)–/, (m, a) => `${Math.floor(+a)}–`);
  const soon = (c, a) => c.start <= a ? 'Could happen any time now' : c.start <= a + 1 ? 'Could start any week now' : `In about ${Math.round(c.start - a)} month${Math.round(c.start - a) === 1 ? '' : 's'}`;

  window.nextPage = function () {
    const a = ageNow(), nm = name();
    const an = typeof answers !== 'undefined' ? answers : {};
    const done = { roll: typeof rolled === 'function' && rolled(), solids: an.solids === 'Yes', crawl: an.crawl === 'Yes', pull: an.pullUp === 'Yes', tooth: an.hasTooth === 'Yes', twonaps: an.twoNaps === 'Yes' };
    const ahead = C.filter(c => c.end > a && !done[c.id]).sort((x, y) => x.start - y.start), next = ahead.slice(0, 3);
    let h = `<div class="ya-page"><div class="eyebrow ya-eyebrow">${F(`${nm}’s year ahead`)}</div><h1>${F('Timeline')}</h1><p class="next-lead">${F(`The big changes coming for ${nm}, and what each one changes. Tap any to read ahead.`)}</p>`;
    if (next.length) h += `<h2 class="ya-h2">${F('Coming up next')}</h2><div class="ya-next">${next.map(c => `<button class="ya-card" style="${yearTheme(c.cat)}" onclick="${c.go}"><span class="ya-card-art">${hubArt(c.icon, c.cat)}</span><span class="ya-card-copy"><small>${F(range(c))} · ${F(soon(c, a).replace(/^Could happen any time now$/, 'any time now').replace(/^Could start /, '').replace(/^In about/, 'in about'))}</small><b>${F(c.title)}</b><span>${F(c.why)}</span></span><span class="hub-chev" aria-hidden="true">›</span></button>`).join('')}</div>`;
    // Later on: swipe through the months ahead and watch the baby grow. Each month card has that month's picture
    // (the same baby who grows on Home), its date, the changes that usually start then, and a checkup if one is due.
    const later = ahead.filter(c => !next.includes(c));
    const born = parse(profile.dob), monthDate = m => { const d = new Date(born); d.setMonth(d.getMonth() + m); return d.toLocaleDateString('en-US', { month: 'long' }); };
    const months = {}; later.forEach(c => { const m = Math.min(12, Math.max(Math.ceil(a), Math.floor(c.start))); (months[m] = months[m] || []).push(c); });
    CHECKUPS.filter(v => v > a).forEach(v => { months[v] = months[v] || []; });
    const keys = Object.keys(months).map(Number).sort((x, y) => x - y);
    const label = m => m >= 12 ? '1 year' : `${m} months`;
    const card = m => `<section class="ya-month"><div class="ya-month-top"><span class="ya-month-art">${typeof yaArt === 'function' ? (m === 12 ? yaArt('birthday', 'Feeding') : months[m].length ? yaArt(months[m][0].id, months[m][0].cat) : yaArt('checkup', 'Health')) : ''}</span><div class="ya-month-head"><b>${F(label(m))}</b><small>${F(m >= 13 ? 'In the second year' : 'Around ' + monthDate(m))}</small></div></div><div class="ya-month-list">${months[m].map(c => `<button class="ya-chip" style="${yearTheme(c.cat)}" onclick="${c.go}"><span>${hubArt(c.icon, c.cat)}</span><em>${F(c.title)}<small>${F(range(c))}${c.start <= a ? ' · ' + F('any time now') : ''}</small></em></button>`).join('')}${CHECKUPS.includes(m) && m > a ? `<span class="ya-month-pin">${F(`${m}-month checkup`)}</span>` : ''}</div></section>`;
    if (keys.length) h += `<h2 class="ya-h2">${F('Later on')}</h2><p class="ya-sub">${F(`Swipe to see what’s coming, month by month.`)}</p><div class="ya-months">${keys.map(card).join('')}</div>`;
    h += `<p class="hub-foot">${F('Ages are typical. Every baby moves at their own pace.')}</p></div>`;
    return h;
  };

  /* ---------- read-ahead pages: when, the signs it's close, what it changes, one reassuring note ---------- */
  // [from, to, zoneStart, zoneEnd, zoneLabel] in months; rows open the page that already covers each effect.
  const PAGES = {
    crying: { lead: 'From about 2 weeks, many babies cry more, often in the late afternoon and evening. It peaks around 6–8 weeks and eases by 3–4 months.', bar: [0, 4, 0.5, 3, 'Peaks at 6–8 weeks'], signsTitle: 'What it can look like', signs: ['Fussier evenings', 'Crying that’s hard to settle, even after a feed', 'Pulling up legs or going red in the face'],
      rows: [['heart', 'Sleep', 'When the crying won’t stop', 'What helps, and when it eases', "openPage('chg:Sleep:d:crying')"], ['heart', 'Health', 'Looking after you', 'It’s OK to put {o} down safely and step away', "openPage('chg:Health:d:you')"]],
      tip: ['Crying with a fever, poor feeding, or a cry that sounds different?', 'Call your pediatrician. Under 3 months, a temperature of 100.4°F or higher means calling right away.'] },
    smile: { lead: 'Around 6–8 weeks, most babies start smiling back at you. It’s the first real back-and-forth between you.', bar: [0, 4, 1.4, 2.1, 'Smiling back'], signs: ['Watching your face closely', 'Calming at your voice', 'Little coos when you talk'],
      rows: [['smile', 'Development', 'Lots of face-to-face time', 'Close up, where {s} can see you best', "openPage('development-domain:2:Social')"], ['chat', 'Development', 'Talk back to {p} sounds', 'Pause, and give {o} a turn', "openPage('development-domain:2:Talking')"]],
      tip: ['Not smiling back by 2 months?', 'Some babies take a little longer. Mention it at the 2-month checkup.'] },
    nights: { lead: 'Somewhere between 6 weeks and 4 months, one sleep at night starts to stretch longer, often to 4–5 hours.', bar: [0, 6, 1.5, 4, 'Nights stretch'], signs: ['More awake during the day', 'The longest sleep moves to the night', 'Sleepy around the same time each evening'],
      rows: [['sun', 'Sleep', 'Help {o} tell day from night', 'Bright days, dim and quiet nights', "openPage('chg:Sleep:d:daynight')"], ['book', 'Sleep', 'Start a short bedtime routine', 'From about 6–8 weeks', "openPage('chg:Sleep:d:routine')"], ['moon', 'Sleep', 'How long {s} can sleep at night', 'The longest stretch grows over months', "openPage('chg:Sleep:d:stretch')"]],
      tip: ['Still waking every 2–3 hours?', 'That’s normal for many babies this age, especially breastfed babies. Stretches grow over months, not nights.'] },
    regress: { lead: 'Around 4 months, sleep cycles mature, and many babies wake more for a few weeks. It’s a step forward, not backward.', bar: [1, 7, 3, 5, 'Often here'], signs: ['More night waking than a few weeks ago', 'Naps of 30–45 minutes', 'Harder to put down asleep'],
      rows: [['moon', 'Sleep', 'What helps during the regression', 'Wait a minute before going in', "openPage('chg:Sleep:d:regress')"], ['moon', 'Sleep', 'Rough night? Quick fixes', 'Waking a lot, short naps, up too early', "openPage('chg:Sleep:d:rough')"], ['heart', 'Health', 'Looking after you', 'Broken sleep is hard. Your rest matters too', "openPage('chg:Health:d:you')"]],
      tip: ['Waking with a fever, poor feeding or pain?', 'That’s not the regression. Call your pediatrician.'] },
    roll: { lead: 'Most babies roll between 4 and 6 months, and some try as early as 2 months. Rolling changes how {s} sleeps and where {s} can go.', bar: [2, 8, 4, 6, 'Rolling'], signs: ['Rocking side to side on {p} back', 'Pushing up on straight arms in tummy time', 'Rolling onto {p} side'],
      rows: [['sack', 'Sleep', 'Stop swaddling at the first try to roll', 'Then a sleep sack, arms free', "openPage('chg:Sleep:d:swaddleoff')"], ['coin', 'Safety', 'Clear the floor where {s} plays', 'Small things go straight in the mouth', "openPage('chg:Safety:d:step:small')"], ['shield', 'Safety', 'Beds and sofas are off-limits', 'Even for a second', "openPage('safety-stage:reaching')"], ['mat', 'Development', 'Tummy time to practice', 'A toy just to one side helps', "openPage('development-domain:6:Movement')"]],
      tip: ['Rolled onto {p} tummy in sleep?', 'Always put {o} down on {p} back. Once {s} rolls both ways on {p} own, {s} can stay how {s} lands.'] },
    sit: { lead: 'Most babies sit on their own by about 9 months. First comes sitting propped on their hands.', bar: [4, 12, 6, 9, 'Sitting up'], signs: ['Sitting propped on {p} hands', 'A steady head and back', 'Reaching for toys while sitting'],
      rows: [['crib', 'Sleep', 'Lower the crib mattress', 'Before {s} can sit on {p} own', "openPage('chg:Sleep:d:mattress')"], ['mat', 'Safety', 'Time to retire the bouncer', 'Once {s} sits up or tries to climb out', "openPage('chg:Safety:d:gear')"], ['sit', 'Development', 'A toy beside your knee', 'Reaching while sitting builds balance', "openPage('development-domain:6:Movement')"]],
      tip: ['Not sitting by 9 months?', 'Mention it at the 9-month checkup.'] },
    twonaps: { lead: 'Usually between 6 and 9 months, the late-afternoon catnap drops and days settle into two naps.', bar: [4, 12, 6, 9, 'Two naps'], signs: ['Skipping the catnap most days', 'The catnap pushes bedtime late', 'Fine until bedtime without it'],
      rows: [['sun', 'Sleep', 'How to make the switch', 'It takes a week or two', "openPage('chg:Sleep:d:catnap')"], ['book', 'Sleep', 'Bedtime a little earlier', 'While the catnap goes', "openPage('chg:Sleep:d:routine')"], ['stroller', 'Out and about', 'Longer outings between naps', 'More time out of the house', "openPage('topic:Out and about')"]],
      tip: ['Messy days are normal', 'On a day with short naps, a catnap can still help.'] },
    tooth: { lead: 'Most babies get their first tooth between 6 and 12 months, usually a bottom front tooth.', bar: [3, 15, 6, 12, 'First tooth'], signs: ['More drooling and chewing', 'Swollen or tender gums', 'A little fussier than usual'],
      rows: [['tooth', 'Daily rhythm', 'Start brushing', 'A rice-grain smear of fluoride toothpaste', "openPage('chg:Daily rhythm:d:teeth')"], ['tooth', 'Daily rhythm', 'Soothing sore gums', 'A clean finger or a chilled teething ring', "openPage('chg:Daily rhythm:d:gums')"], ['thermo', 'Health', 'Teething doesn’t cause a high fever', 'A fever means checking for something else', "openPage('chg:Health:d:sick')"]],
      tip: ['No tooth yet?', 'Some babies get their first tooth later. Ask at a checkup if you don’t see any by 18 months.'] },
    crawl: { lead: 'Most babies start moving between 6 and 10 months. Some scoot or roll instead, and some skip crawling altogether.', bar: [4, 12, 6, 10, 'Crawling'], signs: ['Rocking on hands and knees', 'Pushing up high during tummy time', 'Pivoting in circles on {p} tummy'],
      rows: [['shield', 'Safety', 'Babyproof before {s} moves', 'Stair gates, cabinet locks and outlet covers', "openPage('safety-stage:rolling')"], ['crib', 'Sleep', 'Lower the crib mattress', 'Before {s} can push up and lean over', "openPage('chg:Sleep:d:mattress')"], ['crawl', 'Development', 'Lots of floor time to practice', 'A toy just out of reach helps', "openPage('development-domain:9:Movement')"], ['stroller', 'Out and about', 'Outings get busier', 'A blanket won’t keep {o} put for long', "openPage('topic:Out and about')"]],
      tip: ['Not crawling by 10 months?', 'Many babies skip crawling and go straight to pulling up. If Maya isn’t moving around at all, mention it at the 9-month checkup.'] },
    solids: { lead: 'Around 6 months, food joins milk. It starts with a few bites a day, and milk stays the main food for months.', bar: [4, 9, 5.4, 7, 'About 6 months'], signsTitle: 'Signs {s’s} ready', signs: ['Holds {p} head steady on {p} own', 'Sits with a little support', 'Leans in when food comes {p} way', 'Swallows food instead of pushing it out'],
      rows: [['highchair', 'Feeding', 'Get set up for the first bite', 'A high chair, a soft spoon and a bib', "openPage('chg:Feeding:d:setup')"], ['shield', 'Safety', 'Learn infant choking first aid', 'And how gagging is different', "openPage('chg:Feeding:safe')"], ['bowl', 'Feeding', 'Decide how you’d like to start', 'Spoon-feeding, finger foods or a bit of both', "openPage('chg:Feeding:d:approach')"], ['steth', 'Health', 'Ask about allergens at the checkup', 'The 6-month checkup is a good time', "openPage('health-visit:6')"]],
      tip: ['No need to rush', 'Not before 4 months. Until then, milk gives Maya everything {s} {need|needs}.'] },
    finger: { lead: 'Around 7–9 months, food moves past smooth purées to soft lumps, and pieces {s} can pick up. Meals get messier, and that’s how {s} learns.', bar: [5, 11, 7, 9, 'Textures'], signs: ['Moving food around {p} mouth to chew', 'Raking food toward {o} with {p} fingers', 'Reaching for the spoon'],
      rows: [['bowl', 'Feeding', 'Thicker textures, step by step', 'From mashed to soft lumps', "openPage('chg:Feeding:d:lumpy')"], ['bowl', 'Feeding', 'Safe finger food sizes', 'Soft, and cut the right shape', "openPage('chg:Feeding:d:finger')"], ['shield', 'Safety', 'Gagging versus choking', 'Know the difference before you start', "openPage('chg:Feeding:safe')"]],
      tip: ['Lots of gagging at first?', 'It’s noisy and normal while {s} learns to move food around. Choking is different: a weak cough or no sound at all.'] },
    carseat: { lead: 'Many babies outgrow the infant car seat in the first year, usually by height before weight. The next seat still faces the back.', bar: [4, 14, 8, 12, 'Often here'], signs: ['{p} head is within an inch of the top of the seat', 'Close to the weight limit on the label', 'Feet touching the back seat is fine'],
      rows: [['car', 'Out and about', 'Which seat comes next', 'Infant seat, then a convertible seat, still rear-facing', "openPage('chg:Out and about:d:car')"]],
      tip: ['Still facing the back', 'Keep {o} rear-facing as long as the new seat allows, often until age 2 or older.'] },
    sep: { lead: 'Around 8–10 months, many babies get upset when you leave. It means {s} knows you, and knows when you’re gone.', bar: [5, 14, 8, 10, 'Often peaks'], signs: ['Crying when you leave the room', 'Clinging around new people', 'Waking at night looking for you'],
      rows: [['moon', 'Sleep', 'Night waking may come back', 'The same short goodbye helps', "openPage('chg:Sleep:d:nightwake')"], ['home', 'Childcare', 'Settling in with a caregiver', 'Short handovers work best', "openPage('topic:Childcare')"], ['smile', 'Development', 'Peekaboo helps', 'Things that go away come back', "openPage('development-domain:9:Social')"]],
      tip: ['Short goodbyes work best', 'Say goodbye, then go. Sneaking out makes the next goodbye harder.'] },
    pull: { lead: 'Between 9 and 12 months, most babies pull up on furniture, then start cruising along it.', bar: [6, 14, 9, 12, 'Pulling up'], signs: ['Getting up on {p} knees', 'Pulling up on your legs or the sofa', 'Standing while holding on'],
      rows: [['dresser', 'Safety', 'Strap furniture and TVs to the wall', 'So nothing tips when {s} pulls', "openPage('chg:Safety:d:step:anchor')"], ['crib', 'Sleep', 'Crib mattress to its lowest', 'Before {s} pulls up to stand', "openPage('chg:Sleep:d:mattress')"], ['shield', 'Safety', 'Windows, the stove and water', 'Everything higher is in reach', "openPage('safety-stage:pulling')"], ['stand', 'Development', 'Cruise to a toy', 'Steps along the sofa build balance', "openPage('development-domain:12:Movement')"]],
      tip: ['Stuck standing at night?', 'Practice sitting back down by day, then it gets easier at night.'] },
    words: { lead: 'Around the first birthday, many babies say “mama” or “dada” for a parent. Understanding comes before talking.', bar: [6, 16, 10, 14, 'First words'], signs: ['Babbling with lots of sounds', 'Turning when you say {p} name', 'Pointing or waving to tell you something'],
      rows: [['chat', 'Development', 'Talk about what {s}’s looking at', 'Name it, then pause for {o}', "openPage('development-domain:12:Talking')"], ['signs', 'Development', 'Teach a few simple signs', 'More, eat, milk and all done', "openPage('chg:Development:d:signs')"], ['book', 'Development', 'Ideas for awake time', 'Books, songs and games', "openPage('chg:Development:d:more:12')"]],
      tip: ['Not saying “mama” or “dada” yet?', 'Mention it at the 12-month checkup. Gestures like waving count too.'] },
    milk: { lead: 'At 12 months, whole cow’s milk can replace formula, from a cup. Breastfeeding can carry on as long as you both want.', bar: [9, 15, 12, 12.8, '12 months'], signsTitle: 'Getting ready', signs: ['Practice with an open or straw cup', 'Offer a little water with meals', 'No juice needed'],
      rows: [['cup', 'Feeding', 'The 12-month milk plan', 'How much, and when', "openPage('chg:Feeding:d:milk12')"], ['cup', 'Feeding', 'From bottle to cup', 'One bottle at a time', "openPage('chg:Feeding:d:cup')"], ['steth', 'Health', 'The 12-month checkup', 'An anemia check and milk questions', "openPage('health-visit:12')"]],
      tip: ['How much milk?', 'About 16–24 oz a day after the first birthday. More can crowd out iron-rich food.'] },
    steps: { lead: 'Most babies take their first steps between 12 and 15 months. Some walk earlier, and some later.', bar: [9, 18, 12, 15, 'First steps'], signs: ['Cruising along furniture', 'Standing alone for a moment', 'Walking while holding both your hands'],
      rows: [['shield', 'Safety', 'Check what {s} can reach standing', 'Windows, the stove and water', "openPage('safety-stage:pulling')"], ['stand', 'Daily rhythm', 'Cruising and first steps', 'Barefoot is best indoors', "openPage('chg:Daily rhythm:d:steps')"], ['stand', 'Development', 'A push toy to walk with', 'Sturdy, and on a flat floor', "openPage('development-domain:12:Movement')"]],
      tip: ['Not walking at 12 months?', 'Very common. Mention it if {s} isn’t walking on {p} own by 18 months.'] },
    onenap: { lead: 'Usually between 13 and 18 months, two naps become one long midday nap.', bar: [11, 20, 13, 18, 'One nap'], signs: ['Fighting the morning nap', 'Fine until the afternoon without it', 'A short afternoon nap after a long morning one'],
      rows: [['sun', 'Sleep', 'Making the switch', 'Push the morning nap later', "openPage('chg:Sleep:d:after')"], ['book', 'Sleep', 'Bedtime a little earlier', 'While {s} adjusts', "openPage('chg:Sleep:d:routine')"]],
      tip: ['No rush', 'Two naps after the first birthday is normal.'] }
  };
  function changePage(id) {
    const h = H(), c = C.find(x => x.id === id), p = PAGES[id]; if (!c || !p) return null;
    const a = ageNow(), cat = c.cat, past = c.end <= a, now = c.start <= a && c.end > a;
    const when = past ? 'Already behind ' + name() : now ? 'Happening around now' : c.start - a <= 1 ? 'Could start any week now' : `In about ${Math.round(c.start - a)} month${Math.round(c.start - a) === 1 ? '' : 's'}`;
    const look = `${p.signsTitle || 'Signs it’s close'}: ${p.signs.map(x => x.charAt(0).toLowerCase() + x.slice(1)).join(', ')}.`;
    return h.detail(cat, `${range(c)} · ${when}`, c.title, p.lead + ' ' + look,
      `<p class="ya-connect">${F(`Here’s what it changes, and how to get ready.`)}</p>`
      + h.list('What it changes', p.rows.slice(0, 4).map(([icon, rc, title, sub, go]) => h.row({ icon, cat: rc, title, sub, onclick: go }).replace('<span class="hub-row-copy">', `<span class="hub-row-copy"><small class="hub-row-eyebrow">${F(AREA[rc] || rc)}</small>`)))
      + h.tip(p.tip[0], p.tip[1]), c.icon);
  }
  const base = window.changesRoute;
  window.changesRoute = function (p) { const m = /^chg:Timeline:c:(\w+)$/.exec(p); if (m) { const pg = changePage(m[1]); if (pg) return pg; } return base(p); };
})();
