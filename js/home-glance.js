/* Ahead · Home (Nov 9 prototype). Written so a parent gets the value just by reading it, without tapping:
     Month birthday  a slim banner to add the month's photo, only on the day
     Right now       the change happening now, said specifically, with what helps or what to do first, inline
     Good to know    four facts that are true this month, each one idea, complete on the card
     Also now        the other changes happening now, one line each
     Coming up next  the next two changes, each opening its own page; Timeline has the whole year
   Everything comes from the Timeline's changes, so Home and Timeline always agree. Nothing to log or fill in. */
(function () {
  const Y = () => window.__ya, H = () => window.__hub, F = s => H().F(s);
  const chev = '<span class="hub-chev" aria-hidden="true">›</span>';
  const on = () => { try { return localStorage.getItem('ahead-home-classic') !== '1'; } catch (e) { return true; } };

  // How Home names the change happening now: specific, and said the way a friend would.
  const HEAD = {
    crying: 'The fussy weeks are here', smile: 'First real smiles are coming', nights: 'A longer sleep at night is coming',
    regress: 'Sleep may get worse for a few weeks', roll: 'Rolling could start any day', ready: 'Solids are about a month away',
    solids: 'First foods could start any week', twonaps: 'Three naps are becoming two', crawl: 'Crawling could start any week',
    sit: 'Sitting on {p} own is close', tooth: 'A first tooth could come any week', finger: 'Time for lumpier food and finger foods',
    meals: 'Meals are becoming three a day', carseat: '{P} infant car seat is getting small', sep: 'Goodbyes are about to get harder',
    pull: 'Pulling up to stand could start any week', words: 'First words are coming', milk: 'Whole milk starts at 12 months', steps: 'First steps could come any week'
  };
  // Changes you live through get "What helps"; changes you can get ahead of get "Before it starts".
  const HELPS = ['crying', 'regress', 'sep', 'tooth', 'nights', 'smile', 'twonaps'];

  // Home's month is the calendar month, like the birthday card and Memories (from the due date if born early).
  // The timeline's fractional age (days ÷ 30.44) fell short on some month birthdays: "ten months" over a Month 9 card.
  const homeMonth = () => Math.max(0, Math.min(11, ageMonths(parse(profile.early && profile.due ? profile.due : profile.dob), NOW)));
  window.homeMonth = homeMonth;
  function changes() {
    const y = Y(), a = y.ageNow(), done = y.doneNow();
    const ahead = y.C.filter(c => c.end > a && !done[c.id] && y.PAGES[c.id]).sort((p, q) => p.start - q.start || p.end - q.end);
    const now = ahead.filter(c => c.start <= a + 1).slice(0, 3);
    // The change that asks most of the parent leads; ties go to the one that's closest.
    const RANK = ['crying', 'crawl', 'roll', 'pull', 'ready', 'solids', 'steps', 'regress', 'sit', 'finger', 'meals', 'milk', 'twonaps', 'tooth', 'sep', 'carseat', 'nights', 'smile', 'words'];
    const rank = c => c.id === 'crying' && a >= 2.5 ? 99 : RANK.indexOf(c.id);   // once the peak has passed, crying steps back
    const lead = now.slice().sort((p, q) => rank(p) - rank(q))[0];
    return { a, lead, also: now.filter(c => c !== lead), later: ahead.filter(c => c.start > a + 1) };
  }

  // The three things worth knowing about each change, said in full on Home. [tips, tiles they make redundant]
  const TIPS = {
    crying: [['Rocking, shushing, a walk or white noise often help', 'Fussiest in the late afternoon and evening is typical', 'It’s OK to put {o} down safely and step away for a few minutes'], []],
    smile: [['Get close: {s} sees best about a foot away', 'Smile and talk, then pause so {s} can answer', 'Not smiling back by 2 months? Mention it at the checkup'], []],
    nights: [['Bright light and play by day, dim and quiet at night', 'A short bedtime routine can start now', 'Night feeds are still normal'], []],
    regress: [['Wait a minute before going in. {S} may resettle', 'Keep bedtime and the routine the same', 'It usually passes in a few weeks'], ['chg:Sleep:d:regress']],
    roll: [['Stop swaddling at the first try to roll', 'Never leave {o} on a bed or sofa, even for a second', 'Keep putting {o} down on {p} back to sleep'], ['chg:Sleep:d:swaddleoff', 'chg:Sleep:d:rolling', 'safety-stage:reaching']],
    ready: [['Watch for a steady head, sitting with help, and leaning in for food', 'Pick a high chair with a harness and a footrest', 'Learn infant choking first aid before the first bite'], ['chg:Feeding:d:signs']],
    solids: [['Start with iron-rich foods, a few bites once a day', 'Offer peanut and egg early, one new food at a time', 'Milk stays {p} main food for now'], ['chg:Feeding:d:allergens', 'chg:Feeding:d:food']],
    twonaps: [['{S} may start fighting the late-afternoon catnap', 'When it drops, move bedtime a little earlier', 'The switch can take a week or two'], ['chg:Sleep:d:catnap']],
    crawl: [['Gate the stairs. Screw-mounted at the top', 'Cover outlets and lock away cleaners and medicines', 'Get down to {p} level and pick up anything small'], ['chg:Safety:d:step:small']],
    sit: [['Lower the crib mattress before {s} sits on {p} own', 'Retire the bouncer once {s} sits or tries to climb out', 'A toy beside your knee helps {o} practice reaching'], []],
    tooth: [['Brush with a rice-grain smear of fluoride toothpaste', 'A chilled, not frozen, teething ring soothes gums', 'Skip numbing gels and teething necklaces'], ['chg:Daily rhythm:d:teeth']],
    finger: [['Move from smooth purée to mashed food with soft lumps', 'Offer soft pieces {s} can squash with {p} gums', 'Quarter grapes lengthwise. Skip whole nuts and popcorn'], ['chg:Feeding:d:finger']],
    meals: [['Three meals, plus a snack or two', 'Most of what you eat works for {o}, soft and unsalted', 'Milk now comes alongside meals, not instead of them'], []],
    carseat: [['Time for a new seat when {p} head is within an inch of the top', 'The next seat still faces the back', 'Height usually runs out before weight'], ['chg:Out and about:d:car']],
    sep: [['Say a short, cheerful goodbye, then go', 'Don’t sneak out. It makes the next goodbye harder', 'Peekaboo teaches {o} that you come back'], ['chg:Sleep:d:nightwake']],
    pull: [['Strap dressers, bookcases and TVs to the wall', 'Lower the crib mattress to its lowest setting', 'Practice sitting back down from standing'], ['safety-stage:pulling']],
    words: [['Name what {s’s} looking at, then pause for {o}', 'Read together every day, even for a minute', 'Waving and pointing count as talking'], []],
    milk: [['At 12 months, whole milk from a cup can replace formula', 'About 16–24 oz a day. More crowds out food', 'Start dropping bottles, one at a time'], ['chg:Feeding:d:milk12']],
    steps: [['Bare feet are best indoors', 'Check what {s} can reach standing: the stove, cords, tablecloths', 'Most walk by 15 months. Ask if {s} isn’t by 18'], ['chg:Daily rhythm:d:steps', 'safety-stage:pulling']]
  };

  function hero(c, a) {
    const y = Y(), p = y.PAGES[c.id], t = TIPS[c.id] || [p.rows.slice(0, 3).map(r => r[2]), []];
    hero.skip = [];
    return `<section class="hg-hero">
      <span class="hg-hero-art" aria-hidden="true">${typeof homeMonthArt === 'function' ? homeMonthArt(actualMonth()).replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ') : ''}</span>
      <div class="hg-hero-copy">
        <p class="hg-eyebrow">${F('Right now')}</p>
        <h1>${F(HEAD[c.id] || c.title)}</h1>
        <p class="hg-lead">${F(HELPS.includes(c.id) ? p.lead.split(/(?<=\.)\s/).slice(0, 2).join(' ') : `${p.signsTitle || 'Signs it’s close'}: ${p.signs.map((x, i) => i ? x.charAt(0).toLowerCase() + x.slice(1) : x.charAt(0).toLowerCase() + x.slice(1)).join(', ')}.`)}</p>
        <div class="hg-window"><span class="hg-window-label"><b>${F(y.range(c))}</b> · ${F(y.whenShort(c, a))}</span>${y.windowBar(c, a)}</div>
        <button class="hg-btn" onclick="${c.go}">${F('See what it changes')} <span aria-hidden="true">→</span></button>
      </div><div class="hg-spectrum" aria-hidden="true">${['Development', 'Feeding', 'Sleep', 'Health', 'Safety', 'Daily rhythm', 'Out and about'].map(t => `<span style="background:${YEAR_PALETTES[t] ? YEAR_PALETTES[t].bg : '#eee'}"></span>`).join('')}</div></section>`;
  }

  // This month for Maya: three cards, the things parents wish they'd known and the things that change their day.
  // A card earns a place on Home only if it is proactive (no warnings, emergencies or "when to call": those live in the
  // categories and search), non-obvious, true for this month, about the baby, and changes what you do or expect.
  // [area, art, from, to, weight, headline (the whole point), one line, page, Timeline change it belongs to, flag]
  // Ages are adjusted age; checkups follow the birthday ('bday').
  const CARDS = [
    ['Feeding', 'bowl', 0, 1, 3, 'Newborns feed 8–12 times a day', 'Day and night. Bunched-up evening feeds are normal, not a sign of low milk', 'chg:Feeding:d:enough'],
    ['Sleep', 'moon', 0, 1.5, 3, 'Days and nights start out mixed up', 'Most babies sort it out by 6–8 weeks. Bright days and dim nights help', 'chg:Sleep:d:daynight', 'nights'],
    ['Feeding', 'bowl', 0, 1, 2.5, 'Wet diapers show feeding is working', '6 or more a day from about day 5', 'chg:Feeding:d:enough'],
    ['Feeding', 'bowl', 0, 1.5, 2, 'Nursed babies need vitamin D drops', '400 IU a day, from the first days', 'chg:Feeding:mock:xa:growth', '', 'breast'],
    ['Feeding', 'bowl', 0.5, 2, 2.5, 'Growth spurts make babies extra hungry', 'Expect a few days of near-constant feeding around 3 and 6 weeks', 'chg:Feeding:d:enough'],
    ['Sleep', 'heart', 0.5, 2.5, 3, 'Crying peaks around 6–8 weeks', 'Then it eases by 3–4 months. Evenings are usually the hardest', 'chg:Sleep:d:crying', 'crying'],
    ['Development', 'smile', 1, 2, 2.5, 'Real smiles arrive around 6–8 weeks', 'The first ones that answer yours, not just in sleep', 'development-domain:2:Social', 'smile'],
    ['Sleep', 'clock', 1.5, 3.5, 2.5, 'Babies this age can only stay awake about an hour', 'Fussing after 60–90 minutes up often means tired, not hungry', 'chg:Sleep:d:cues'],
    ['Feeding', 'bowl', 2, 4, 2, 'Feeds get much faster', 'Ten minutes can be a full feed now. Quicker isn’t less', 'chg:Feeding:d:enough'],
    ['Development', 'mat', 1.5, 4.5, 2, 'Flat spots are common now', 'Switch which end of the crib {p} head goes, and add awake tummy time', 'chg:Development:d:idea:4:tummy'],
    ['Sleep', 'sun', 2, 4, 2.5, 'Short naps are normal until about 4 months', '30–45 minutes is typical. Naps lengthen as sleep matures', 'chg:Sleep:d:napsearly'],
    ['Daily rhythm', 'tooth', 2.5, 4.5, 2, 'Drool isn’t always teething', 'Lots of drool from 3 months is normal. Teeth usually come later', 'chg:Daily rhythm:d:gums'],
    ['Sleep', 'moon', 3, 5, 3, 'Sleep often gets worse around 4 months', 'For a few weeks. It means {p} sleep is maturing, not going backward', 'chg:Sleep:d:regress', 'regress'],
    ['Feeding', 'bowl', 3, 5, 2, 'Distracted feeding is a phase', 'Pulling off to look around is normal. A quiet, dim room helps', 'chg:Feeding:d:cues'],
    ['Sleep', 'sack', 3, 5, 2.5, 'The swaddle comes off at the first roll', 'Have a sleep sack ready before rolling starts', 'chg:Sleep:d:swaddleoff', 'roll'],
    ['Feeding', 'bowl', 4, 6.5, 3, 'Early peanut lowers allergy risk', 'Offer it thinned with first foods, then keep it in the rotation', 'chg:Feeding:d:allergens'],
    ['Feeding', 'highchair', 4.5, 6.5, 3, 'Readiness matters more than age for solids', 'Steady head, sits with help, leans in, and swallows instead of pushing food out', 'chg:Feeding:d:signs', 'ready'],
    ['Sleep', 'moon', 5, 8, 2, 'Sleep training is optional', 'A family choice, not a milestone', 'chg:Sleep:d:method'],
    ['Feeding', 'bowl', 6, 8, 3, 'Iron matters most in first foods', '{P} stores run low around 6 months. Meat, beans and fortified cereal refill them', 'chg:Feeding:d:food'],
    ['Feeding', 'bowl', 6, 8, 2.5, 'Milk is still the main food', 'First meals are practice. A few bites a day is plenty', 'chg:Feeding:d:milk'],
    ['Sleep', 'sun', 6, 9, 2.5, 'Two naps free up your day', 'When the late catnap drops, there’s time for longer outings', 'chg:Sleep:d:catnap', 'twonaps'],
    ['Health', 'steth', 6, 9, 2, 'The first flu shot is 2 doses', '4 weeks apart, then once a year', 'health-visit:6', '', 'season', 'bday'],
    ['Feeding', 'bowl', 7.5, 9.5, 3, '{S} can start feeding {r}', 'Soft finger foods, cut the size of your finger', 'chg:Feeding:d:finger', 'finger'],
    ['Development', 'chat', 8, 11, 2.5, '{S} understands more than {s} can say', 'Name things as you go. {P} name and “no” often land first', 'development-domain:12:Talking'],
    ['Sleep', 'moon', 8, 10, 2, 'Separation anxiety can bring night waking back', 'The same short goodbye at bedtime helps', 'chg:Sleep:d:nightwake', 'sep'],
    ['Health', 'steth', 8.25, 9.75, 2, 'The 9-month checkup looks at development', 'Note how {s} moves, babbles and plays, to share', 'health-visit:9', '', '', 'bday'],
    ['Feeding', 'cup', 9, 11.5, 3, 'No cow’s milk to drink until 12 months', 'Yogurt and cheese are fine now', 'chg:Feeding:d:milk12', 'milk'],
    ['Daily rhythm', 'stand', 9, 12.5, 2, 'Bare feet help first steps', 'Save shoes for outside', 'chg:Daily rhythm:d:steps', 'steps'],
    ['Out and about', 'car', 9, 12.5, 2, 'The next car seat still faces back', 'Often until past age 2', 'chg:Out and about:d:car', 'carseat'],
    ['Sleep', 'sun', 10, 12.5, 2, 'Two naps usually last past the first birthday', 'Most move to one nap at 13–18 months', 'chg:Sleep:d:after'],
    ['Feeding', 'cup', 11, 12.5, 3, 'At 1, milk drops to 16–24 oz a day', 'More can crowd out iron-rich food', 'chg:Feeding:d:milk12', 'milk'],
    ['Health', 'steth', 11, 12.5, 2.5, 'The 12-month checkup includes an iron check', 'Usually a quick finger prick', 'health-visit:12', '', '', 'bday']
  ];
  function cards(lead) {
    const adj = Y().ageNow(), bday = (NOW - parse(profile.dob)) / (30.4375 * 864e5);
    const flu = NOW.getMonth() >= 8 || NOW.getMonth() <= 2;   // September to March
    const nursing = /breast|both|nurs/i.test(String(profile.feed || '') + String(profile.feedHow || ''));
    const live = CARDS.map(t => ({ t, a: t[11] === 'bday' ? bday : adj }))
      .filter(({ t, a }) => a >= t[2] && a < t[3] && t[8] !== lead && (t[10] !== 'season' || flu) && (t[10] !== 'breast' || nursing))
      .map(({ t, a }) => ({ t, score: t[4] + (a - t[2] < 1 ? 0.5 : 0) }))
      .sort((x, y) => y.score - x.score || y.t[2] - x.t[2]).map(x => x.t);
    // Three different areas when possible, so the section never reads as one topic.
    const out = [], used = new Set();
    for (const t of live) if (out.length < 3 && !used.has(t[0])) { out.push(t); used.add(t[0]); }
    for (const t of live) if (out.length < 3 && !out.includes(t)) out.push(t);
    return out;
  }
  function monthCards(lead) {
    const list = cards(lead); if (!list.length) return '';
    const label = c => c === 'Daily rhythm' ? 'Everyday care' : c === 'Out and about' ? 'Outings' : c === 'Development' ? 'Development' : c;
    return `<h2 class="hg-h2">${F(`This month for ${name()}`)}</h2><div class="hg-cards">${list.map(t => `<button class="hg-card" style="${yearTheme(t[0])}" onclick="openPage('${t[7]}')"><span class="hg-card-art" aria-hidden="true">${hubArt(t[1], t[0])}</span><span class="hg-card-copy"><small>${F(label(t[0]))}</small><b>${F(t[5])}</b><span>${F(t[6])}</span></span>${chev}</button>`).join('')}</div>`;
  }
  window.homeGlancePicks = () => { try { return cards(changes().lead.id).map(t => t[5]); } catch (e) { return []; } };
  window.homeCardText = () => CARDS.map(t => t[5] + ' ' + t[6]);

  function comingUp(later, a) {
    const two = later.slice(0, 2); if (!two.length) return '';
    const when = c => { const m = Math.max(Math.ceil(a), Math.floor(c.start)); return m >= 12 ? 'Around 1 year' : `${m} months`; };
    return `<section class="hg-next"><div class="hg-next-head"><b>${F('Coming up next')}</b><button class="hg-next-all" onclick="navigate('next')">${F('Timeline')} ›</button></div>
      <div class="hg-stops">${two.map(c => `<button class="hg-stop" style="${yearTheme(c.cat)}" onclick="${c.go}"><i aria-hidden="true"></i><small>${F(when(c))}</small><span class="hg-stop-row"><span class="hg-stop-art">${hubArt(c.icon, c.cat)}</span><b>${F(c.title)}</b></span><span class="hg-stop-why">${F(c.why)}</span></button>`).join('')}</div></section>`;
  }

  // On a month birthday: one slim line to add the month's photo, nothing more.
  // On a month birthday: one slim card in the Memories style, the month's balloon photo and a handwritten line.
  function banner(main) {
    const b = main.querySelector('.hub-bday'); if (!b) return '';
    const photo = b.querySelector('.hub-bday-photo'); if (!photo || photo.querySelector('img')) return '';   // photo already added
    const m = +((b.querySelector('.hub-bday-num') || {}).textContent || 0); if (!m || m > 11) return '';
    const input = photo.querySelector('input'); const words = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
    return `<label class="hg-banner" role="button"><img class="hg-banner-img" src="assets/home/balloon-${m}.png" alt=""><span class="hg-banner-copy"><b>${F(`${name()} is ${words[m]} month${m === 1 ? '' : 's'}`)}</b><small>${F(`Add {p} ${m}-month photo to Memories`)}</small></span><span class="hg-banner-plus" aria-hidden="true">＋</span>${input ? input.outerHTML : ''}</label>`;
  }

  // Home as "Through her eyes" + "You might notice…" (Nov 9 mock, 3 months written).
  // Home explains, Timeline schedules: every line says why or what's normal, never just when.
  // eyes: [headline, explanation]. notice: [what you'd see her do, why, category for color, art, page or ''].
  // Lengths are fixed so every card reads the same: a title of 7 words or fewer, a "why" of 10–19 words,
  // an eyes headline of 7 words or fewer and an eyes line of 12–19 words (checked in tools/qa/home-value.cjs).
  const MONTHS = {
    0: { eyes: ['She sees you best up close', 'She focuses best about 8–12 inches away, just about the distance to your face during a feed.'],
      notice: [['She sleeps in short bursts', 'Newborns sleep most of the day, but only 2–4 hours at a time, day and night.', 'Sleep', 'crib', 'chg:Sleep:d:stretch'],
        ['She wants to feed constantly', 'Eight to twelve feeds a day is normal. Long evening feeds are cluster feeding, not low milk.', 'Feeding', 'bottle', 'chg:Feeding:d:enough',
          ['She wants to feed often', 'Six to ten bottles a day is normal at first, and hungrier days come and go.']],
        ['She startles and hiccups a lot', 'Her nervous system is still settling in. Sudden startles, hiccups and sneezes are all normal.', 'Development', 'hand', ''],
        ['Her poop keeps changing color', 'Black and sticky at first, then yellow and seedy by about the end of week one.', 'Daily rhythm', 'diaper', 'chg:Daily rhythm:d:look:0:poop']] },
    1: { eyes: ['Faces are her favorite thing', 'She can follow your face for a few seconds as you move, and she studies it closely.'],
      notice: [['She cries more in the evenings', 'Crying often peaks around 6–8 weeks, then eases by 3–4 months. Evenings tend to be hardest.', 'Sleep', 'sunrise', 'chg:Sleep:d:crying'],
        ['She fusses after an hour awake', 'Many babies this age can only manage about an hour awake before they’re tired again.', 'Sleep', 'clock', 'chg:Sleep:d:cues'],
        ['She suddenly wants to feed nonstop', 'Growth spurts around 3 and 6 weeks can mean a few days of near-constant feeding.', 'Feeding', 'bottle', 'chg:Feeding:d:enough'],
        ['She’s pooping less often', 'After about 6 weeks, a few days between poops can be normal, especially for breastfed babies.', 'Daily rhythm', 'diaper', 'chg:Daily rhythm:d:look:2:poop',
          ['She’s pooping less often', 'Fewer poops than in the first weeks is normal. On formula, most babies still go most days.']]] },
    2: { eyes: ['Colors are coming into focus', 'She’s starting to see colors more clearly. Her eyes may cross now and then until about 4 months.'],
      notice: [['She stares at her hands', 'She’s just discovering that those hands belong to her, and that she can move them.', 'Development', 'hand', ''],
        ['She coos when you talk', 'It’s her first conversation. Pause after you speak, and she’ll often coo right back.', 'Development', 'chat', 'development-domain:2:Talking'],
        ['She spits up a lot', 'It’s common. It often peaks around 4 months and is usually gone by her first birthday.', 'Feeding', 'drop', 'chg:Feeding:mock:spit'],
        ['She sleeps longer at night', 'One longer stretch often shows up around now, though every baby gets there on her own timeline.', 'Sleep', 'moon', 'chg:Sleep:d:stretch']] },
    3: { eyes: ['Moving things are fascinating', 'She can follow a toy smoothly from side to side now, so slow, sweeping games are a hit.'],
      notice: [['She’s drooling a lot', 'Drool picks up around now. It’s normal, and it usually isn’t a sign of teething yet.', 'Daily rhythm', 'drops', 'chg:Daily rhythm:d:gums'],
        ['She keeps pulling off mid-feed', 'There’s suddenly so much to look at. Distracted feeding is common from around now.', 'Feeding', 'eye', 'chg:Feeding:mock:distract'],
        ['She sucks on her hands', 'It’s one of her first ways to calm herself down, not always a sign she’s hungry.', 'Development', 'mouth', ''],
        ['She laughs out loud', 'Laughing often starts around 3–4 months. It’s her first way of sharing something funny with you.', 'Development', 'smile', '']] },
    4: { eyes: ['Colors are getting brighter', 'Around 4–5 months, her color vision fills in, so bold, bright toys and books suddenly grab her.'],
      notice: [['She’s waking more at night', 'Around 4 months, sleep cycles mature, and lots of babies wake more often for a few weeks.', 'Sleep', 'moon', 'chg:Sleep:d:regress'],
        ['Her naps are short', 'Short naps, even 30 minutes, are normal right now. Longer ones come as her sleep matures.', 'Sleep', 'clock', 'chg:Sleep:d:napsearly'],
        ['All the squealing and raspberries', 'She’s practicing the mouth movements she’ll need for talking. Make the sounds back to her.', 'Development', 'music', ''],
        ['She grabs your hair and glasses', 'Reaching is brand new. She’s grabbing whatever is close, not doing it on purpose.', 'Development', 'hand', '']] },
    5: { eyes: ['The world is within reach', 'She’s getting better at judging distance, so her reaching suddenly looks much more intentional.'],
      notice: [['Everything goes in her mouth', 'Mouthing is how she learns what things feel like, taste like and do.', 'Development', 'mouth', ''],
        ['She’s fussy after two hours awake', 'Many babies this age can manage about two hours awake before they need another nap.', 'Sleep', 'clock', 'chg:Sleep:d:day:2'],
        ['She’s watching you eat', 'Interest in food is one clue that solids are getting close, alongside the other readiness signs.', 'Feeding', 'highchair', 'chg:Feeding:d:signs'],
        ['She shrieks just for fun', 'She’s discovering how loud her voice can be. It’s play, not a sign she’s upset.', 'Development', 'ear', '']] },
    6: { eyes: ['She can spot you across the room', 'Her distance vision has sharpened, so she may light up before you even get close.'],
      notice: [['She only eats a few bites', 'First meals are practice. Milk is still her main food for now, and that’s expected.', 'Feeding', 'bowl', 'chg:Feeding:d:food'],
        ['Her poop looks different', 'Once solids start, poop gets firmer and smellier, and sometimes takes on the color of her food.', 'Daily rhythm', 'diaper', 'chg:Daily rhythm:d:look:3:poop'],
        ['She babbles “ba-ba-ba”', 'Strings of sounds are practice for words. Talk back, and she’ll keep the conversation going.', 'Development', 'chat', ''],
        ['She’s shy with new people', 'It’s a sign she knows who her people are. Give her time to warm up.', 'Development', 'peek', '']] },
    7: { eyes: ['She loves the baby in the mirror', 'She doesn’t know it’s her yet. Recognizing herself usually comes after her first birthday.'],
      notice: [['She fights the late nap', 'She can stay awake longer now, so that last nap starts pushing too close to bedtime.', 'Sleep', 'sun', 'chg:Sleep:d:catnap'],
        ['She rocks on hands and knees', 'She’s practicing getting her arms and legs to work together. Some babies skip crawling entirely.', 'Development', 'crawl', ''],
        ['She bangs and drops everything', 'She’s learning cause and effect: when I do this, that happens. Expect lots of repeats.', 'Development', 'blocks', ''],
        ['She grabs for the spoon', 'She wants to do it herself. A spoon of her own while you feed her helps.', 'Feeding', 'eat', '']] },
    8: { eyes: ['She knows you still exist', 'She now understands things are still there when she can’t see them. It’s why goodbyes got harder.'],
      notice: [['She cries when you leave', 'That’s separation anxiety. It shows how attached she is to you, and it eases with time.', 'Development', 'wave', ''],
        ['She’s waking at night again', 'Separation anxiety and new skills can both bring night waking back. A short, same goodbye helps.', 'Sleep', 'moon', 'chg:Sleep:d:nightwake'],
        ['She drops food again and again', 'It’s a game. She’s testing where things go and checking that they’re still there.', 'Feeding', 'toss', ''],
        ['She says “dadada”', 'It’s practice with sounds, and it usually doesn’t mean “dad” just yet. Keep talking back.', 'Development', 'chat', 'development-domain:9:Talking']] },
    9: { eyes: ['She follows where you look', 'She’s starting to follow your gaze and gestures, so naming what you’re both looking at lands now.'],
      notice: [['She’s fascinated by crumbs', 'She’s learning to pick up tiny things between her thumb and finger, so crumbs are irresistible.', 'Development', 'pieces', ''],
        ['She looks at you, then a toy', 'She’s sharing her attention with you, using looks and sounds. Pointing grows out of this.', 'Development', 'eye', ''],
        ['She lifts her arms to you', 'She’s telling you she wants to be picked up, using her body before she has words.', 'Development', 'heart', ''],
        ['She turns down new foods', 'That’s normal. Many babies need to try a food 10–15 times before they like it.', 'Feeding', 'plate', 'chg:Feeding:mock:picky']] },
    10: { eyes: ['Words are starting to mean things', 'She’s learning that the sounds you make stand for things, like her name, “bath” and “milk”.'],
      notice: [['She can’t get down in the crib', 'Pulling up is new, but sitting back down isn’t yet. Practicing during the day helps.', 'Sleep', 'crib', 'chg:Sleep:d:nightwake'],
        ['She cruises along the sofa', 'Stepping sideways while holding on builds the balance she’ll need for walking on her own.', 'Development', 'sofa', ''],
        ['She copies your sounds and faces', 'Imitation is how she learns. Make a sound, pause, and see if she copies it.', 'Development', 'mirror', ''],
        ['She throws her food', 'It’s often her way of telling you she’s full, before she has the words for it.', 'Feeding', 'toss', '']] },
    11: { eyes: ['She knows faces in photos', 'She may recognize people she knows in pictures now, so family photos make great first books.'],
      notice: [['She pauses when you say “no”', 'She’s starting to understand it, but stopping herself is still really hard at this age.', 'Development', 'idea', ''],
        ['She’s starting to wave', 'She’s learning to communicate by copying what you do. Wave back, and say the word too.', 'Development', 'wave', ''],
        ['She has no teeth yet', 'First teeth come anywhere from about 6 to 12 months. Some babies turn 1 with none.', 'Daily rhythm', 'tooth', 'chg:Daily rhythm:d:teeth'],
        ['She’s eating a little less', 'Growth slows down toward the first birthday, and her appetite often slows down with it.', 'Feeding', 'plate', '']] }
  };
  // Each month's card takes the color of that month's balloon in Memories, so the two tabs feel like one book.
  const BALLOON = ['#f2a98a', '#4da9d4', '#6c91b1', '#619863', '#659056', '#4da5d0', '#e9b553', '#eb9669', '#e37889', '#e98067', '#9a6fa4', '#d9708a'];
  const mix = (hex, w, to = 255) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - w) + to * w).toString(16).padStart(2, '0')).join('');
  const monthTheme = m => { const c = BALLOON[Math.max(0, Math.min(11, m))];
    return `--m-bg1:${mix(c, .84)};--m-bg2:${mix(c, .92)};--m-line:${mix(c, .7)};--m-ink:${mix(c, .45, 30)};--m-chip:${mix(c, .78)}`; };

  // "See what Maya sees": the month's picture twice, as you see it and as she does. Filters follow how vision
  // develops: blurry and nearly colorless at first, color filling in by 4–5 months, sharp detail by about 9 months.
  const VIEW = [['blur(4px) grayscale(.8)', 'Beyond about a foot, the world is a soft blur, mostly in light and dark.'],
    ['blur(3.2px) grayscale(.7) contrast(1.35)', 'Faces up close are clearest. Colors are still faint.'],
    ['blur(2.4px) saturate(.45) contrast(1.2)', 'Colors are starting to come through, but softly.'],
    ['blur(1.8px) saturate(.6)', 'Moving things are easier to follow. Colors are getting stronger.'],
    ['blur(1.2px) saturate(.85)', 'Colors are filling in, and bright, bold things really stand out.'],
    ['blur(.8px)', 'She can judge distance now, so the world feels within reach.'],
    ['blur(.5px)', 'She can spot you across the room.'],
    ['blur(.35px)', 'Her vision is close to yours, just a little softer.'],
    ['blur(.2px)', 'She sees nearly what you see.'],
    ['none', 'She sees tiny details now, like a crumb on the rug.'], ['none', 'She sees what you see.'], ['none', 'She sees what you see.']];
  window.homeEyes = open => {
    const old = document.querySelector('.hv-sheet'); if (old) old.remove(); if (!open) return;
    const m = homeMonth(), art = typeof homeMonthArt === 'function' ? homeMonthArt(actualMonth()).replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ') : '';
    const d = document.createElement('div'); d.className = 'hv-sheet'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', F(`What ${name()} sees`));
    d.innerHTML = `<div class="hv-card" style="${monthTheme(m)}"><button class="hv-close" onclick="homeEyes(false)" aria-label="Close">×</button>
      <p class="hv-eyebrow">${F(`Through ${name()}’s eyes`)}</p>
      <div class="hv-pair"><figure><span class="hv-art">${art}</span><figcaption>${F('What you see')}</figcaption></figure>
      <figure><span class="hv-art hv-hers" style="--hv-filter:${VIEW[m][0]}">${art}</span><figcaption>${F(`What ${name()} sees`)}</figcaption></figure></div>
      <p class="hv-line">${F(VIEW[m][1])}</p></div>`;
    d.onclick = e => { if (e.target === d) homeEyes(false); };
    document.body.appendChild(d); requestAnimationFrame(() => d.classList.add('is-on'));
  };

  // The copy is written for "she". Turn it into pronoun tokens so it reads right for every baby.
  const P = t => String(t).replace(/\bherself\b/g, '{r}').replace(/\b(hold|feed|keeps|to|with|for|give|let|watch|help|tell) her\b/g, '$1 {o}')
    .replace(/\bher\b/g, '{p}').replace(/\bHer\b/g, '{P}').replace(/\bShe’s\b/g, '{S’s}').replace(/\bshe’s\b/g, '{s’s}').replace(/\bShe\b/g, '{S}').replace(/\bshe\b/g, '{s}');
  function monthCard(M, lead, a, next) {
    const m = homeMonth(), wk = Math.max(1, Math.round(a * 4.35)), when = m < 2 ? `${wk} week${wk === 1 ? '' : 's'}` : `Month ${m}`;
    const art = typeof homeMonthArt === 'function' ? homeMonthArt(actualMonth()).replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ') : '';
    // A row can carry a formula version [title, why] as its sixth item: Feeding gives formula families other numbers.
    const row = ([title, why, cat, icon, go, formula]) => {
      if (formula && profile.feed === 'Formula') [title, why] = formula;
      // The app's own row (hub-row + hub-dot), with Health/Safety's soft topic color behind the drawing.
      const tone = ({ Sleep: ['#e7effc', '#46638c'], Feeding: ['#fdeef2', '#a24d6a'], Development: ['#ecebfb', '#4f4a8c'], 'Daily rhythm': ['#fff3dc', '#8a6a2a'] })[cat] || ['#e6f5ec', '#356651'];
      const st = `--hl-bg:${tone[0]};--hl-ink:${tone[1]}`, inner = `<span class="hub-dot">${hubArt(icon, cat)}</span><span class="hub-row-copy"><b>${F(P(title))}</b><small>${F(P(why))}</small></span>`;
      return go ? `<button class="hub-row hl-row" style="${st}" onclick="openPage('${go}')">${inner}${chev}</button>` : `<div class="hub-row hl-row is-static" style="${st}">${inner}</div>`;
    };
    return `<section class="he-hero" style="${monthTheme(m)}"><p class="he-eyebrow">${F(when)} · ${F(`Through ${name()}’s eyes`)}</p><div class="he-copy"><h1>${F(P(M.eyes[0]))}</h1><p class="he-lead">${F(P(M.eyes[1]))}</p>${m <= 4 ? `<button class="he-see" onclick="homeEyes(true)"><span aria-hidden="true">👁</span> ${F(`See what ${name()} sees`)}</button>` : ''}</div><span class="he-art" aria-hidden="true">${art}</span></section>
      <h2 class="hub-h2">${F('You might notice…')}</h2>
      <div class="hub-list hg-rows">${M.notice.map(row).join('')}</div>
      <button class="hub-more hg-tl" onclick="navigate('next')"><span>${F(`Explore ${name()}’s timeline`)}</span>${chev}</button>` + newInGuides();
  }

  /* ---------- Guides: what changed as she grew ----------
     A guide is "Updated" when what it leads with this month differs from last month, until the parent opens it.
     Nothing is held back: the change shows the day the month turns. */
  const OPENED = () => 'ahead-guides-opened:' + journeyKey();
  const opened = () => { try { return JSON.parse(localStorage.getItem(OPENED())) || {}; } catch (e) { return {}; } };
  const guideLines = m => {
    const keep = month; let html = '';
    try { month = m; html = BASE_CATS(); } catch (e) {} finally { month = keep; }
    const out = {}; html.replace(/data-cat="([^"]+)"[\s\S]*?<small>([\s\S]*?)<\/small>/g, (x, cat, line) => { out[cat] = line.replace(/<[^>]+>/g, '').trim(); });
    return out;
  };
  let updCache = { key: null, list: [] };
  window.guidesUpdated = () => {
    if (typeof BASE_CATS !== 'function' || typeof isCurrent === 'function' && !isCurrent()) return [];
    const m = actualMonth(), key = m + '|' + JSON.stringify(opened()) + '|' + journeyKey();
    if (updCache.key === key) return updCache.list;
    let list = [];
    if (m >= 1) { const now = guideLines(m), before = guideLines(m - 1), seen = opened(); list = Object.keys(now).filter(c => before[c] && now[c] !== before[c] && seen[c] !== m); }
    updCache = { key, list }; return list;
  };
  // Opening a guide clears its "Updated" tag for this month.
  if (typeof window.openPage === 'function') {
    const baseOpen = window.openPage;
    window.openPage = openPage = function (p) {
      const t = /^topic:(.+)$/.exec(String(p || ''));
      if (t) { try { const o = opened(); o[t[1]] = actualMonth(); localStorage.setItem(OPENED(), JSON.stringify(o)); } catch (e) {} }
      return baseOpen.apply(this, arguments);
    };
  }
  const BASE_CATS = typeof window.journeyCategories === 'function' ? window.journeyCategories : null;
  if (BASE_CATS) {
    window.journeyCategories = journeyCategories = function () {
      let html = BASE_CATS().replace(/<h1>Categories<\/h1>/, '<h1>Guides</h1>').replace(/Guidance for /, 'For ');
      // Each tile says what the guide covers right now: the headline its page opens with, plus the short stage label when it adds something.
      const heads = typeof window.home2PageHeadlines === 'function' && (typeof isCurrent !== 'function' || isCurrent()) ? home2PageHeadlines() : {};
      html = html.replace(/(data-cat="([^"]+)"[\s\S]*?)<small>([\s\S]*?)<\/small>/g, (all, pre, cat, small) => {
        const status = small.replace(/<[^>]+>/g, '').trim(), head = (heads[cat] || '').trim(), lo = x => x.toLowerCase().replace(/[‐‑–]/g, '-').replace(/\s+/g, ' ');
        if (!head) return all;
        const same = lo(head).includes(lo(status)) || lo(status).includes(lo(head)), short = status.split(/\s+/).length <= 4;
        if (same) return `${pre}<small>${esc(head)}</small>`;
        if (!short) return `${pre}<small>${small}</small>`;
        return `${pre}<em class="dir-chip">${small}</em><small>${esc(head)}</small>`;
      });
      const upd = guidesUpdated();
      upd.forEach(cat => { html = html.replace(new RegExp(`(data-cat="${cat}"[\\s\\S]*?<b>[^<]*)(</b>)`), '$1 <span class="guide-upd">Updated</span>$2'); });
      return html;
    };
  }
  // "New in Maya's guides", as in Yarden's Home reference: a soft lavender card, a sparkle, one line, and the count.
  // Several guides changed: open Guides and briefly glow the ones that changed, so the eye goes straight to them.
  window.homeGuidesFlash = cats => {
    navigate('categories');
    setTimeout(() => cats.forEach(c => { const el = document.querySelector(`.category-directory-row[data-cat="${c}"]`); if (el) { el.classList.add('is-flash'); setTimeout(() => el.classList.remove('is-flash'), 1800); } }), 60);
  };
  function newInGuides() {
    // The app's own tappable row (hub-list + hub-row + hub-dot), exactly as the guides use it: white card, hairline, soft square.
    const n = guidesUpdated().length;
    const spark = `<svg viewBox="0 0 32 32" fill="none" stroke="#7A4F6D" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M13 6c.8 4.4 2.3 5.9 6.7 6.7-4.4.8-5.9 2.3-6.7 6.7-.8-4.4-2.3-5.9-6.7-6.7C10.7 11.9 12.2 10.4 13 6Z" fill="#fff"/><path d="M23.5 17.5c.4 2.2 1.1 2.9 3.3 3.3-2.2.4-2.9 1.1-3.3 3.3-.4-2.2-1.1-2.9-3.3-3.3 2.2-.4 2.9-1.1 3.3-3.3Z" fill="#f1d697" stroke="#c9a24a"/></svg>`;
    const upd = guidesUpdated(), go = upd.length === 1 ? `openPage('topic:${upd[0]}')` : upd.length ? `homeGuidesFlash(${JSON.stringify(upd).replace(/"/g, '&quot;')})` : "navigate('categories')";
    return `<div class="hub-list hg-newlist"><button class="hub-row" onclick="${go}"><span class="hub-dot hg-new-dot">${spark}</span><span class="hub-row-copy"><b>${F(n ? `New in ${name()}’s guides` : `${name()}’s guides`)}</b><small>${F(n ? 'A few things changed as {s’s} grown' : 'Practical help for where {s} is now')}</small></span>${n ? `<span class="guide-upd hg-new-count">${n} new</span>` : ''}${chev}</button></div>`;
  }

  // The page ends with two small matching tiles: what's next on Timeline, and what changed in Guides.
  function footTiles(next, a) {
    const upd = guidesUpdated(), n = upd.length, show = n ? upd.slice(0, 3) : ['Feeding', 'Sleep', 'Development'];
    const names = upd.map(c => typeof displayTopic === 'function' ? displayTopic(c) : c);
    const ink = next ? ((YEAR_PALETTES[next.cat] || {}).ink || '#5b4a8b') : '#5b4a8b';
    const tl = next ? `<button class="hf-tile" onclick="${next.go}"><small>${F('Next on Timeline')}</small><span class="hf-art hl-row" style="--hl-bg:${(YEAR_PALETTES[next.cat] || {}).pale || '#efedff'};--hl-ink:${ink}"><span class="hub-dot">${hubArt(next.icon, next.cat)}</span></span><b>${F(next.title)}</b><span class="hf-sub" style="color:${ink}">${F(Y().whenShort(next, a).replace(/^./, c => c.toUpperCase()))}</span></button>`
      : `<button class="hf-tile" onclick="navigate('next')"><small>${F('Timeline')}</small><b>${F('The year ahead')}</b></button>`;
    const gd = `<button class="hf-tile" onclick="navigate('categories')"><small>${F('Guides')}</small><span class="hf-marks" aria-hidden="true">${show.map(c => `<i style="${yearTheme(c)}">${typeof catIcon === 'function' ? catIcon(c) : ''}</i>`).join('')}</span><b>${n ? `<i class="hx-new" aria-hidden="true"></i>${F(`${n} updated`)}` : F('This month')}</b><span class="hf-sub">${F(n ? (n === 1 ? names[0] : n === 2 ? `${names[0]} and ${names[1]}` : `${names[0]} and more`) : 'Everything for now')}</span></button>`;
    return `<div class="hf-grid">${tl}${gd}</div>`;
  }

  // Style guide: Home is white and cream; categories show as their mark in a soft circle; links to other places are white rows.
  function timelineCard(next, a) {
    if (!next) return '';
    const ink = (YEAR_PALETTES[next.cat] || {}).ink || '#5b4a8b';
    return `<h2 class="hub-h2 hn-h2">${F(`${name()}’s timeline`)}</h2><div class="hub-list hx-card"><button class="hub-row hx-row" style="${yearTheme(next.cat)}" onclick="${next.go}"><span class="hub-dot">${hubArt(next.icon, next.cat)}</span><span class="hub-row-copy"><small class="hx-when" style="color:${ink}">${F(Y().range(next) + ' · ' + Y().whenShort(next, a))}</small><b>${F(next.title)}</b><small>${F(next.why)}</small></span>${chev}</button>
      <button class="hub-row hx-row hx-all" onclick="navigate('next')"><span class="hub-row-copy"><b>${F('See the whole year')}</b></span>${chev}</button></div>`;
  }
  function guidesRow() {
    const upd = guidesUpdated(), n = upd.length, show = n ? upd.slice(0, 3) : ['Feeding', 'Sleep', 'Development'];
    const names = upd.map(c => typeof displayTopic === 'function' ? displayTopic(c) : c);
    const sub = n ? (n === 1 ? `${names[0]} changed as {s’s} grown` : n === 2 ? `${names[0]} and ${names[1]} changed as {s’s} grown` : `${names[0]}, ${names[1]} and more changed as {s’s} grown`) : 'Practical help for where {s} is now';
    const marks = `<span class="hx-marks" aria-hidden="true">${show.map(c => `<i style="${yearTheme(c)}">${typeof catIcon === 'function' ? catIcon(c) : ''}</i>`).join('')}</span>`;
    return `<h2 class="hub-h2 hn-h2">${F(`${name()}’s guides`)}</h2><div class="hub-list hx-card"><button class="hub-row hx-row" onclick="navigate('categories')">${marks}<span class="hub-row-copy"><b>${n ? '<i class="hx-new" aria-hidden="true"></i>' : ''}${F(n ? `${n} guide${n === 1 ? '' : 's'} updated` : 'Everything for this month')}</b><small>${F(sub)}</small></span>${chev}</button></div>`;
  }

  // Where to go next: Timeline and Guides as two rows in one card, each saying what's waiting there.
  function exploreCard(next, a) {
    const upd = guidesUpdated(), n = upd.length, names = upd.map(c => typeof displayTopic === 'function' ? displayTopic(c) : c);
    const tl = next ? `Next up: ${next.title.charAt(0).toLowerCase() + next.title.slice(1)}, ${Y().whenShort(next, a)}` : 'The big changes still ahead';
    const gd = n ? (n === 1 ? `${names[0]} changed as {s’s} grown` : `${names[0]} and ${n === 2 ? names[1] : 'more'} changed as {s’s} grown`) : 'Practical help for where {s} is now';
    const tlArt = `<span class="hx-art" style="${yearTheme(next ? next.cat : 'Development')}">${next ? hubArt(next.icon, next.cat) : ''}</span>`;
    const gdArt = `<span class="hx-art" style="${yearTheme(upd[0] || 'Feeding')}">${typeof catIcon === 'function' ? catIcon(upd[0] || 'Feeding') : ''}</span>`;
    return `<h2 class="hn-h2">${F('Keep exploring')}</h2><div class="hx-card">
      <button class="hx-row" onclick="navigate('next')">${tlArt}<span class="hx-copy"><b>${F(`${name()}’s timeline`)}</b><small>${F(tl)}</small></span>${chev}</button>
      <button class="hx-row" onclick="navigate('categories')">${gdArt}<span class="hx-copy"><b>${F(`${name()}’s guides`)}${n ? ` <span class="guide-upd">${n} updated</span>` : ''}</b><small>${F(gd)}</small></span>${chev}</button></div>`;
  }

  function paintGlance() {
    const main = document.getElementById('main'); if (!main || !Y() || !H()) return;
    if (main.querySelector('.bday-year')) return;   // the first birthday has its own page: Ahead's year ends there
    const { a, lead, also: rest, later } = changes();
    const M = MONTHS[homeMonth()];
    if (!lead && !M) return;
    // One card above the month card, never two: on a month birthday the photo banner shows and the question waits
    // until the photo is added or the birthday has passed (Yarden, Nov 9).
    const ageLine = main.querySelector('.home-age-line'), top = banner(main), question = top ? null : main.querySelector('.connected-checkin');
    if (M) {
      main.innerHTML = '<div class="hg-page">' + top + (question ? question.outerHTML : '') + monthCard(M, lead, a, [lead, ...rest, ...later].find(c => !({1:['crying'],5:[],8:['sep']}[homeMonth()] || []).includes(c.id))) + `<p class="connected-preview-footnote">${F('Ahead isn’t medical advice and doesn’t replace your pediatrician.')}</p></div>`;
      return;
    }
    let h = '<div class="hg-page">' + (ageLine ? ageLine.outerHTML : '') + top;
    h += hero(lead, a);
    h += question ? question.outerHTML : '';
    h += monthCards(lead.id) + comingUp(later, a);
    h += `<p class="connected-preview-footnote">${F('Ahead isn’t medical advice and doesn’t replace your pediatrician.')}</p></div>`;
    main.innerHTML = h;
  }

  const baseRender = window.render;
  window.render = render = function () {
    const r = baseRender.apply(this, arguments);
    try { if (on() && page === 'home' && (typeof isCurrent !== 'function' || isCurrent())) paintGlance(); } catch (e) { console.error(e); }
    return r;
  };
  window.homeGlanceClassic = off => { try { off ? localStorage.setItem('ahead-home-classic', '1') : localStorage.removeItem('ahead-home-classic'); } catch (e) {} render(); };
})();
