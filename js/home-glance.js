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
  function month(lead) {
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
    return `<label class="hg-banner" role="button"><img class="hg-banner-img" src="assets/home/balloon-${m}.jpg" alt=""><span class="hg-banner-copy"><b>${F(`${name()} is ${words[m]} month${m === 1 ? '' : 's'}`)}</b><small>${F(`Add {p} ${m}-month photo to Memories`)}</small></span><span class="hg-banner-plus" aria-hidden="true">＋</span>${input ? input.outerHTML : ''}</label>`;
  }

  // Home as "Through her eyes" + "You might notice…" (Nov 9 mock, 3 months written).
  // Home explains, Timeline schedules: every line says why or what's normal, never just when.
  // eyes: [headline, explanation]. notice: [what you'd see her do, why, category for color, art, page or ''].
  const MONTHS = {
    1: { eyes: ['Your face is her favorite view', 'She sees best about 8–12 inches away, right about where your face is when you hold her. That’s why she studies you so closely.'],
      notice: [['She cries more in the evenings', 'Crying often peaks around 6–8 weeks, then eases by 3–4 months. Late afternoon and evening tend to be hardest.', 'Sleep', 'heart', 'chg:Sleep:d:crying'],
        ['She gets fussy after about an hour awake', 'Many babies this age can only manage about an hour before they’re tired. Individual needs vary.', 'Sleep', 'moon', 'chg:Sleep:d:cues'],
        ['She suddenly wants to feed all the time', 'Growth spurts around 3 and 6 weeks can mean a few days of near-constant feeding. It passes.', 'Feeding', 'bowl', 'chg:Feeding:d:enough'],
        ['She’s pooping less often', 'After about 6 weeks, a few days between poops can be normal, especially for breastfed babies.', 'Daily rhythm', 'tooth', 'chg:Daily rhythm:d:look:2:poop']] },
    5: { eyes: ['The world is within reach', 'Maya is getting better at judging distance. That’s why reaching for toys suddenly looks so much more intentional.'],
      notice: [['She keeps stopping mid-feed', 'There’s suddenly so much to look at. Getting distracted during feeds is common at this age.', 'Feeding', 'bowl', 'chg:Feeding:d:cues'],
        ['Everything goes in her mouth', 'It’s how she explores, and it doesn’t always mean she’s teething.', 'Development', 'smile', ''],
        ['She’s fussier after being awake a while', 'Many babies can manage about two hours awake at a time, but individual needs vary.', 'Sleep', 'moon', 'chg:Sleep:d:cues'],
        ['She’s watching you eat', 'Interest in food is growing. It’s one clue as solids get closer, alongside the other readiness signs.', 'Feeding', 'highchair', 'chg:Feeding:d:signs']] },
    8: { eyes: ['She knows you still exist when you leave', 'Maya now understands that people and things are still there when she can’t see them. It’s why she looks for dropped toys, and why goodbyes got harder.'],
      notice: [['She cries when you leave the room', 'That’s separation anxiety. It’s a sign of how attached she is to you, and it eases with time.', 'Development', 'heart', ''],
        ['She’s waking at night again', 'Separation anxiety and new skills can both bring night waking back for a while. A short, same goodbye helps.', 'Sleep', 'moon', 'chg:Sleep:d:nightwake'],
        ['She drops food off the high chair, again and again', 'It’s a game. She’s testing where things go, and checking they’re still there.', 'Feeding', 'bowl', ''],
        ['She says “dadada”', 'It’s practice with sounds. It usually doesn’t mean “dad” just yet.', 'Development', 'chat', 'development-domain:12:Talking']] }
  };
  function monthCard(M, lead, a, next) {
    const m = Math.floor(a), when = m < 2 ? `${Math.max(1, Math.round(a * 4.35))} weeks` : `Month ${m}`;
    const art = typeof homeMonthArt === 'function' ? homeMonthArt(actualMonth()).replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ') : '';
    const row = ([title, why, cat, icon, go]) => {
      const inner = `<span class="hn-art" style="${yearTheme(cat)}">${hubArt(icon, cat)}</span><span class="hn-copy"><b>${F(title)}</b><span>${F(why)}</span></span>${go ? chev : ''}`;
      return go ? `<button class="hn-row" onclick="openPage('${go}')">${inner}</button>` : `<div class="hn-row">${inner}</div>`;
    };
    return `<section class="he-hero"><p class="he-eyebrow">${F(when)} · ${F(`Through ${name()}’s eyes`)}</p><div class="he-copy"><h1>${F(M.eyes[0])}</h1><p class="he-lead">${F(M.eyes[1])}</p></div><span class="he-art" aria-hidden="true">${art}</span></section>
      <h2 class="hn-h2">${F('You might notice…')}</h2>
      <div class="hn-list">${M.notice.map(row).join('')}</div>
      <button class="hn-timeline" onclick="navigate('next')"><span>${F(`Explore ${name()}’s timeline`)}</span>${chev}</button>`;
  }

  function paintGlance() {
    const main = document.getElementById('main'); if (!main || !Y() || !H()) return;
    if (main.querySelector('.bday-year')) return;   // the first birthday has its own page: Ahead's year ends there
    const { a, lead, also: rest, later } = changes();
    if (!lead) return;
    const ageLine = main.querySelector('.home-age-line'), question = main.querySelector('.connected-checkin');
    const M = MONTHS[Math.floor(a)];
    if (M) {
      main.innerHTML = '<div class="hg-page">' + banner(main) + monthCard(M, lead, a, [lead, ...rest, ...later].find(c => !({1:['crying'],5:[],8:['sep']}[Math.floor(a)] || []).includes(c.id))) + (question ? question.outerHTML : '') + `<p class="connected-preview-footnote">${F('Ahead isn’t medical advice and doesn’t replace your pediatrician.')}</p></div>`;
      return;
    }
    let h = '<div class="hg-page">' + (ageLine ? ageLine.outerHTML : '') + banner(main);
    h += hero(lead, a);
    h += question ? question.outerHTML : '';
    h += month(lead.id) + comingUp(later, a);
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
