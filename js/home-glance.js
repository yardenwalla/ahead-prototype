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
    const lead = now.slice().sort((p, q) => RANK.indexOf(p.id) - RANK.indexOf(q.id))[0];
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
    hero.skip = t[1].concat(p.rows.map(r => (/openPage\('([^']+)'\)/.exec(r[4]) || [])[1]).filter(Boolean));
    return `<section class="hg-hero">
      <span class="hg-hero-art" aria-hidden="true">${typeof homeMonthArt === 'function' ? homeMonthArt(actualMonth()).replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ') : ''}</span>
      <div class="hg-hero-copy">
        <p class="hg-eyebrow">${F('Right now')}</p>
        <h1>${F(HEAD[c.id] || c.title)}</h1>
        <p class="hg-lead">${F(p.lead)}</p>
        <div class="hg-window"><span class="hg-window-label"><b>${F(y.range(c))}</b> · ${F(y.whenShort(c, a))}</span>${y.windowBar(c, a)}</div>
        <p class="hg-list-label">${F(HELPS.includes(c.id) ? 'What helps' : 'Before it starts')}</p>
        <ul class="hg-tips">${t[0].map(x => `<li>${F(x)}</li>`).join('')}</ul>
        <button class="hg-more" onclick="${c.go}">${F('More on ' + c.title.charAt(0).toLowerCase() + c.title.slice(1))} ›</button>
      </div><div class="hg-spectrum" aria-hidden="true">${['Development', 'Feeding', 'Sleep', 'Health', 'Safety', 'Daily rhythm', 'Out and about'].map(t => `<span style="background:${YEAR_PALETTES[t] ? YEAR_PALETTES[t].bg : '#eee'}"></span>`).join('')}</div></section>`;
  }

  // Good to know this month: the four things that matter most for Maya right now, from any area.
  // Each has the ages it applies to (adjusted age; Health by birthday age, like checkups and fever) and a weight:
  // 3 = do it now or it's easy to get wrong, 2 = useful, 1 = filler. Things that just became true rank a little higher.
  // [area, from, to, weight, the thing to know, one line, page]
  // Each tile is one idea, complete on the card: the title is the fact, the line says why or what to do.
  const POOL = [
    ['Feeding', 0, 1, 3, '6 or more wet diapers a day means enough milk', 'From about day 5, it’s the easiest way to know', 'chg:Feeding:d:enough'],
    ['Feeding', 0, 1.5, 2.5, 'Nursed babies need vitamin D drops', '400 IU a day, from the first days. Breast milk is low in it', 'chg:Feeding:mock:xa:growth', '', 'breast'],
    ['Health', 0, 3, 3, 'Under 3 months, 100.4°F means call now', 'Day or night, even if {s} seems fine otherwise', 'chg:Health:d:sick', 'bday'],
    ['Sleep', 0, 2, 2, 'A pacifier at sleep lowers SIDS risk', 'Offer it at naps and bedtime. It’s fine if it falls out', 'chg:Sleep:d:where'],
    ['Sleep', 0, 3, 2, 'Share a room, not a bed', 'For the first 6 months, it lowers SIDS risk', 'chg:Sleep:d:where'],
    ['Safety', 0, 1.5, 2, 'Car seat straps should pass the pinch test', 'If you can pinch a fold of strap at the shoulder, tighten it', 'chg:Out and about:d:car'],
    ['Health', 0.5, 3, 2.5, 'Baby blues should lift by 2 weeks', 'If low mood or worry lasts longer, tell your doctor', 'chg:Health:d:you'],
    ['Health', 0.5, 1.25, 2.5, 'The 1-month checkup checks on you too', 'Expect questions about your mood and how you’re sleeping', 'health-visit:1', 'bday'],
    ['Feeding', 0.5, 2, 2, 'Extra-hungry days are normal', 'Growth spurts often hit around 3 and 6 weeks', 'chg:Feeding:d:enough'],
    ['Safety', 1, 3, 2, 'Never step away from the changing table', 'Even young babies can wriggle off the edge', 'chg:Safety:d:step:changing'],
    ['Health', 1.5, 2.25, 3, 'The first big round of shots is at 2 months', 'A low fever for a day after is common', 'health-visit:2', 'bday'],
    ['Safety', 2, 4, 2, 'Babies wriggle off beds before they roll', 'The floor is the safest place to set {o} down', 'safety-stage:reaching'],
    ['Feeding', 2, 4, 1.5, 'Shorter feeds are normal now', '{S’s} getting faster, not eating less', 'chg:Feeding:d:enough'],
    ['Health', 3, 4, 3, 'From 3 months, call at 101°F', 'Or any time {s} seems very ill', 'chg:Health:d:sick', 'bday'],
    ['Feeding', 3, 5, 2, 'Distracted feeding is normal now', 'A quiet, dim room helps {o} focus', 'chg:Feeding:d:cues'],
    ['Sleep', 3, 5, 3, 'Sleep often gets worse around 4 months', 'It lasts a few weeks and means {p} sleep is maturing', 'chg:Sleep:d:regress'],
    ['Sleep', 3, 5, 2.5, 'Swaddling stops once rolling starts', 'A swaddled baby can’t push up after rolling face down', 'chg:Sleep:d:swaddleoff'],
    ['Feeding', 4, 6, 3, 'Early peanut lowers peanut allergy risk', 'Offer it thinned, with first foods, then keep it up', 'chg:Feeding:d:allergens'],
    ['Sleep', 4, 6, 2, 'Rolling in {p} sleep is OK', 'Once {s} rolls both ways. Still put {o} down on {p} back', 'chg:Sleep:d:rolling'],
    ['Safety', 4, 7, 2, 'If it fits in a toilet-paper tube, it can choke {o}', 'A quick test for anything on the floor', 'chg:Safety:d:step:small'],
    ['Daily rhythm', 4, 9, 2, 'Teething doesn’t cause a fever', 'At 100.4°F or more, something else is going on', 'chg:Health:d:sick'],
    ['Feeding', 4.5, 6.5, 3, 'Ready for solids: steady head, sits with help', 'Plus leaning in for food and swallowing it, not pushing it out', 'chg:Feeding:d:signs'],
    ['Sleep', 5, 8, 2, 'Sleep training is optional', 'It’s a family choice, not a milestone', 'chg:Sleep:d:method'],
    ['Health', 6, 7, 2, 'From 6 months, call at 103°F', 'Or for any fever lasting more than a day', 'chg:Health:d:sick', 'bday'],
    ['Health', 6, 9, 2.75, 'The first flu shot is 2 doses', '4 weeks apart. After that, it’s one a year', 'health-visit:6', 'bday', 'season'],
    ['Feeding', 6, 8, 3, 'Iron stores run low around 6 months', 'Meat, beans, lentils and fortified cereal refill them', 'chg:Feeding:d:food'],
    ['Feeding', 6, 12, 2.5, 'No honey before {p} first birthday', 'Not even baked in. It can cause infant botulism', 'chg:Feeding:d:food'],
    ['Feeding', 6.5, 8.5, 2, 'Gagging is normal, and noisy', 'It’s how {s} learns to eat. Choking is silent', 'chg:Feeding:safe'],
    ['Safety', 7, 11, 2.5, 'A swallowed button battery is an emergency', 'Go to the ER right away, even if {s} seems fine', 'chg:Safety:d:step:small'],
    ['Health', 7, 12, 1.5, 'The first dentist visit is due by age 1', 'Book it once the first tooth shows', 'chg:Daily rhythm:d:teeth'],
    ['Feeding', 7.5, 9.5, 3, 'Cut finger foods the size of your finger', 'Soft enough to squash between your fingers', 'chg:Feeding:d:finger'],
    ['Sleep', 8, 10, 2, 'Separation anxiety can bring back night waking', 'The same short goodbye at bedtime helps', 'chg:Sleep:d:nightwake'],
    ['Health', 8.25, 9.75, 2.5, 'The 9-month checkup screens development', 'A short questionnaire about how {s} moves, talks and plays', 'health-visit:9', 'bday'],
    ['Feeding', 9, 11, 3, 'No cow’s milk to drink until 12 months', 'Yogurt and cheese are fine now', 'chg:Feeding:d:milk12'],
    ['Sleep', 9, 11, 2, 'Stuck standing in the crib? Practice by day', 'Show {o} how to bend {p} knees and sit down', 'chg:Sleep:d:rough'],
    ['Daily rhythm', 9, 12.5, 2, 'Bare feet are best for learning to walk', 'Save shoes for outside', 'chg:Daily rhythm:d:steps'],
    ['Safety', 9, 12.5, 2.5, 'The next car seat still faces back', 'Often until past age 2, up to the seat’s limit', 'chg:Out and about:d:car'],
    ['Safety', 10, 12.5, 2, 'Standing puts the stove in reach', 'Turn pot handles in and keep hot drinks back', 'safety-stage:pulling'],
    ['Feeding', 11, 12.5, 3, 'After 1, about 16–24 oz of milk a day', 'More can crowd out iron-rich food', 'chg:Feeding:d:milk12'],
    ['Sleep', 11, 12.5, 2, 'No soft toys in the crib until 1', 'After that, a small lovey can join', 'chg:Sleep:d:lovey'],
    ['Health', 11, 12.5, 3, 'The 12-month checkup tests for anemia', 'Usually a quick finger or heel prick', 'health-visit:12', 'bday']
  ];
  function picks() {
    const adj = Y().ageNow(), bday = (NOW - parse(profile.dob)) / (30.4375 * 864e5);
    const flu = NOW.getMonth() >= 8 || NOW.getMonth() <= 2;   // September to March
    const live = POOL.map(t => { const a = t[7] === 'bday' ? bday : adj; return { t, a }; })
      .filter(({ t, a }) => a >= t[1] && a < t[2] && (t[8] !== 'season' || flu) && (t[8] !== 'breast' || /breast|both|nurs/i.test(String(profile.feed || '') + String(profile.feedHow || ''))))
      .map(({ t, a }) => ({ t, score: t[3] + (a - t[1] < 1 ? 0.5 : 0) - (t[2] - a < 0.5 ? 0.25 : 0) }))
      .sort((x, y) => y.score - x.score || y.t[1] - x.t[1]);
    const out = [], per = {}, gos = new Set(hero.skip || []);
    for (const { t } of live) { if (out.length === 4) break; if ((per[t[0]] || 0) >= 2 || gos.has(t[6])) continue; per[t[0]] = (per[t[0]] || 0) + 1; gos.add(t[6]); out.push(t); }
    return out;
  }
  function glance() {
    const rows = picks(); glance.gos = rows.map(t => `openPage('${t[6]}')`);
    if (rows.length < 2) return '';
    const label = c => c === 'Daily rhythm' ? 'Everyday care' : c;
    const tile = t => `<button class="hg-tile" style="${yearTheme(t[0])}" onclick="openPage('${t[6]}')"><span class="hg-tile-top"><span class="hg-tile-ic">${typeof catIcon === 'function' ? catIcon(t[0]) : ''}</span><small class="hg-tile-cat">${F(label(t[0]))}</small></span><b>${F(t[4])}</b><small>${F(t[5])}</small></button>`;
    return `<h2 class="hg-h2">${F('Good to know this month')}</h2><div class="hg-tiles">${rows.map(tile).join('')}</div>`;
  }
  window.homeGlancePicks = () => picks().map(t => t[4]);

  // What the closest changes affect, one row each, taking turns so no single change fills the list.
  // Play ideas wait for the change's own page; these are the things worth doing before it arrives.
  function also(list) {
    if (!list.length) return '';
    const y = Y();
    return `<h2 class="hg-h2">${F('Also happening now')}</h2><div class="hg-also">${list.map(c => `<button class="hg-also-card" style="${yearTheme(c.cat)}" onclick="${c.go}"><span class="hg-also-art">${hubArt(c.icon, c.cat)}</span><span class="hg-also-copy"><b>${F(c.title)}</b><small>${F(y.TOUCH[c.id] || c.why)}</small></span>${chev}</button>`).join('')}</div>`;
  }

  function comingUp(later, a) {
    const two = later.slice(0, 2); if (!two.length) return '';
    const when = c => { const m = Math.max(Math.ceil(a), Math.floor(c.start)); return m >= 12 ? 'Around 1 year' : `${m} months`; };
    return `<section class="hg-next"><div class="hg-next-head"><b>${F('Coming up next')}</b><button class="hg-next-all" onclick="navigate('next')">${F('Timeline')} ›</button></div>
      <div class="hg-stops">${two.map(c => `<button class="hg-stop" style="${yearTheme(c.cat)}" onclick="${c.go}"><i aria-hidden="true"></i><small>${F(when(c))}</small><span class="hg-stop-row"><span class="hg-stop-art">${hubArt(c.icon, c.cat)}</span><b>${F(c.title)}</b></span><span class="hg-stop-why">${F(c.why)}</span></button>`).join('')}</div></section>`;
  }

  // On a month birthday: one slim line to add the month's photo, nothing more.
  function banner(main) {
    const b = main.querySelector('.hub-bday'); if (!b) return '';
    const photo = b.querySelector('.hub-bday-photo'); if (!photo || photo.querySelector('img')) return '';   // photo already added: nothing to ask
    const m = (b.querySelector('.hub-bday-num') || {}).textContent || '';
    photo.classList.add('hg-banner');
    const label = [...photo.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (label) label.textContent = F(`${name()} is ${m} month${m === '1' ? '' : 's'} today · Add {p} photo`);
    return photo.outerHTML;
  }

  function paintGlance() {
    const main = document.getElementById('main'); if (!main || !Y() || !H()) return;
    if (main.querySelector('.bday-year')) return;   // the first birthday has its own page: Ahead's year ends there
    const { a, lead, also: rest, later } = changes();
    if (!lead) return;
    const ageLine = main.querySelector('.home-age-line'), question = main.querySelector('.connected-checkin');
    let h = '<div class="hg-page">' + (ageLine ? ageLine.outerHTML : '') + banner(main);
    h += hero(lead, a);
    h += question ? question.outerHTML : '';
    h += glance() + also(rest) + comingUp(later, a);
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
