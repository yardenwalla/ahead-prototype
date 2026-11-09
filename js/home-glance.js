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

  // Good to know this month: the four things that matter most for Maya right now, from any area.
  // Each has the ages it applies to (adjusted age; Health by birthday age, like checkups and fever) and a weight:
  // 3 = do it now or it's easy to get wrong, 2 = useful, 1 = filler. Things that just became true rank a little higher.
  // [area, from, to, weight, the thing to know, one line, page]
  // Each tile is one idea, complete on the card: the title is the fact, the line says why or what to do.
  const POOL = [
    ['Feeding', 0, 1, 3, '6+ wet diapers a day', 'From about day 5, the easiest sign {s’s} getting enough milk', 'chg:Feeding:d:enough'],
    ['Feeding', 0, 1.5, 2.5, 'Vitamin D drops', 'Nursed babies need 400 IU a day from the first days. Breast milk is low in it', 'chg:Feeding:mock:xa:growth', '', 'breast'],
    ['Sleep', 0, 4, 2, 'Pacifiers and SIDS', 'Offering one at sleep lowers the risk. It’s fine if it falls out', 'chg:Sleep:d:where'],
    ['Safety', 0, 1.5, 2, 'The car seat pinch test', 'If you can pinch a fold of strap at {p} shoulder, tighten it', 'chg:Out and about:d:car'],
    ['Health', 0.5, 1.25, 2.5, 'The 1-month checkup', 'Mostly weight and feeding. Bring a rough count of wet diapers', 'health-visit:1', 'bday'],
    ['Feeding', 0.5, 2, 2.5, 'Growth spurts', 'Extra-hungry days around 3 and 6 weeks are normal, not a supply problem', 'chg:Feeding:d:enough'],
    ['Sleep', 0.5, 2.5, 2.5, 'Crying peaks at 6–8 weeks', 'Then it eases by 3–4 months. It’s OK to put {o} down safely and step away', 'chg:Sleep:d:crying'],
    ['Health', 1.5, 2.25, 3, '2-month vaccines', 'The first big round. A low fever for a day after is common', 'health-visit:2', 'bday'],
    ['Development', 1.5, 4.5, 2.5, 'Flat spots', 'Switch which end of the crib {p} head goes each night. Awake tummy time helps too', 'chg:Development:d:idea:4:tummy'],
    ['Feeding', 1, 4, 2, 'Spit-up', 'Common until about 4–6 months. If {s’s} growing and content, it’s usually fine', 'chg:Feeding:d:enough'],
    ['Daily rhythm', 2.5, 4.5, 2, 'Drool', 'Lots of it from about 3 months is normal, and usually not teething yet', 'chg:Daily rhythm:d:gums'],
    ['Health', 3.5, 4.25, 2.5, '4-month vaccines', 'The second round, mostly the same shots as at 2 months', 'health-visit:4', 'bday'],
    ['Feeding', 2, 4, 2, 'Shorter feeds', '{S’s} getting faster at feeding, not eating less', 'chg:Feeding:d:enough'],
    ['Feeding', 3, 5, 2, 'Distracted feeding', 'Pulling off to look around is normal now. A quiet, dim room helps', 'chg:Feeding:d:cues'],
    ['Sleep', 3, 5, 3, 'The 4-month sleep change', 'More waking for a few weeks means {p} sleep is maturing, not going backward', 'chg:Sleep:d:regress'],
    ['Sleep', 3, 5, 2.5, 'Swaddling and rolling', 'Once {s} tries to roll, the swaddle comes off for good. Arms free in a sleep sack', 'chg:Sleep:d:swaddleoff'],
    ['Feeding', 4, 6, 3, 'Peanut, early', 'Offering it early, thinned, lowers the chance of a peanut allergy', 'chg:Feeding:d:allergens'],
    ['Sleep', 4, 6, 2, 'Rolling in {p} sleep', 'Once {s} rolls both ways, {s} can stay how {s} lands', 'chg:Sleep:d:rolling'],
    ['Safety', 4, 7, 2, 'The toilet-roll test', 'If it fits through a toilet-paper tube, it’s small enough to choke on', 'chg:Safety:d:step:small'],
    ['Feeding', 4.5, 6.5, 3, 'Signs {s’s} ready for solids', 'Steady head, sits with help, leans in for food, and swallows it', 'chg:Feeding:d:signs'],
    ['Sleep', 5, 8, 2, 'Sleep training', 'It’s optional: a family choice, not a milestone', 'chg:Sleep:d:method'],
    ['Health', 6, 9, 2.75, 'The first flu shot', 'It’s 2 doses, 4 weeks apart. After that, one a year', 'health-visit:6', 'bday', 'season'],
    ['Feeding', 6, 8, 3, 'Iron', '{P} stores run low around 6 months. Meat, beans and fortified cereal refill them', 'chg:Feeding:d:food'],
    ['Feeding', 6, 12, 2.5, 'No honey yet', 'Not until {p} first birthday, even baked in. It can cause botulism', 'chg:Feeding:d:food'],
    ['Feeding', 6.5, 8.5, 2.5, 'Gagging vs choking', 'Gagging is noisy and normal. Choking is silent', 'chg:Feeding:safe'],
    ['Safety', 7, 11, 2.5, 'Button batteries', 'If {s} might have swallowed one, go to the ER right away', 'chg:Safety:d:step:small'],
    ['Health', 7, 12, 1.5, 'The first dentist visit', 'Due once a tooth shows, and by {p} first birthday', 'chg:Daily rhythm:d:teeth'],
    ['Feeding', 7.5, 9.5, 3, 'Finger-sized pieces', 'Soft enough to squash between your fingers. Quarter grapes lengthwise', 'chg:Feeding:d:finger'],
    ['Sleep', 8, 10, 2, 'Night waking', 'Separation anxiety can bring it back. The same short goodbye helps', 'chg:Sleep:d:nightwake'],
    ['Health', 8.25, 9.75, 2.5, 'The 9-month checkup', 'It includes a development screen. Jot down your questions', 'health-visit:9', 'bday'],
    ['Feeding', 9, 11, 3, 'No cow’s milk to drink yet', 'Wait until 12 months. Yogurt and cheese are fine now', 'chg:Feeding:d:milk12'],
    ['Sleep', 9, 11, 2, 'Stuck standing in the crib', 'Practice sitting back down during the day. It gets easier at night', 'chg:Sleep:d:rough'],
    ['Daily rhythm', 9, 12.5, 2, 'Barefoot is best', 'Bare feet help balance for first steps. Save shoes for outside', 'chg:Daily rhythm:d:steps'],
    ['Safety', 9, 12.5, 2.5, 'The next car seat', 'It still faces back, often until past age 2', 'chg:Out and about:d:car'],
    ['Safety', 10, 12.5, 2, 'The stove', 'Standing brings it in reach. Turn pot handles in', 'safety-stage:pulling'],
    ['Feeding', 11, 12.5, 3, '16–24 oz of milk', 'About right a day after {p} first birthday. More crowds out food', 'chg:Feeding:d:milk12'],
    ['Sleep', 11, 12.5, 2, 'No soft toys yet', 'Keep the crib bare until {p} first birthday', 'chg:Sleep:d:lovey'],
    ['Health', 11, 12.5, 3, 'The 12-month checkup', 'It includes an anemia check, usually a quick finger prick', 'health-visit:12', 'bday']
  ];
  const OF = { 'Crying peaks at 6–8 weeks': 'crying', 'The 4-month sleep change': 'regress', 'Swaddling and rolling': 'roll', 'Rolling in {p} sleep': 'roll',
    'Signs {s’s} ready for solids': ['ready', 'solids'], 'Gagging vs choking': 'finger', 'Finger-sized pieces': 'finger',
    'Night waking': 'sep', 'The next car seat': 'carseat', 'Barefoot is best': 'steps', 'The stove': 'pull', '16–24 oz of milk': 'milk', 'No cow’s milk to drink yet': 'milk',
    'The first dentist visit': 'tooth', 'Stuck standing in the crib': 'pull' };
  function picks() {
    const adj = Y().ageNow(), bday = (NOW - parse(profile.dob)) / (30.4375 * 864e5);
    const flu = NOW.getMonth() >= 8 || NOW.getMonth() <= 2;   // September to March
    const live = POOL.map(t => { const a = t[7] === 'bday' ? bday : adj; return { t, a }; })
      .filter(({ t, a }) => a >= t[1] && a < t[2] && (t[8] !== 'season' || flu) && (t[8] !== 'breast' || /breast|both|nurs/i.test(String(profile.feed || '') + String(profile.feedHow || ''))))
      .map(({ t, a }) => ({ t, score: t[3] + (a - t[1] < 1 ? 0.5 : 0) - (t[2] - a < 0.5 ? 0.25 : 0) }))
      .sort((x, y) => y.score - x.score || y.t[1] - x.t[1]);
    const out = [], per = {}, gos = new Set((hero.skip || []).concat(picks.taken || []));
    for (const { t } of live) { if (out.length === 4) break; if ((per[t[0]] || 0) >= 2 || gos.has(t[6]) || [].concat(OF[t[4]] || []).includes(picks.lead)) continue; per[t[0]] = (per[t[0]] || 0) + 1; out.push(t); }
    return out;
  }
  function glance() {
    const rows = picks(); glance.gos = rows.map(t => t[6]);
    if (rows.length < 2) return '';
    const label = c => c === 'Daily rhythm' ? 'Everyday care' : c;
    const tile = t => `<button class="hg-tile" style="${yearTheme(t[0])}" onclick="openPage('${t[6]}')"><span class="hg-tile-top"><span class="hg-tile-ic">${typeof catIcon === 'function' ? catIcon(t[0]) : ''}</span><small class="hg-tile-cat">${F(label(t[0]))}</small></span><b>${F(t[4])}</b><small>${F(t[5])}</small></button>`;
    return `<h2 class="hg-h2">${F('Good to know this month')}</h2><div class="hg-tiles">${rows.map(tile).join('')}</div>`;
  }
  window.homeGlancePicks = () => picks().map(t => t[4]);

  // What the closest changes affect, one row each, taking turns so no single change fills the list.
  // Play ideas wait for the change's own page; these are the things worth doing before it arrives.
  // This month's focus: what to do for the changes happening now, one row each, taking turns.
  function focus(now) {
    const y = Y(), picked = [], seen = new Set(["openPage('chg:Health:d:you')"]);
    for (let i = 0; i < 5 && picked.length < 3; i++) for (const c of now) {
      const r = y.PAGES[c.id].rows.filter(r => r[1] !== 'Development')[i];
      if (r && !seen.has(r[4]) && picked.length < 3) { seen.add(r[4]); picked.push([c, r]); }
    }
    if (!picked.length) return '';
    const row = ([c, [icon, cat, title, sub, go]]) => `<button class="hub-row hg-row" onclick="${go}"><span class="hub-dot">${hubArt(icon, cat)}</span><span class="hub-row-copy"><small class="hub-row-eyebrow">${F(c.title)}</small><b>${F(title)}</b><small>${F(sub)}</small></span>${chev}</button>`;
    picks.taken = picked.map(([, r]) => (/openPage\('([^']+)'\)/.exec(r[4]) || [])[1]).filter(Boolean);
    return `<h2 class="hg-h2">${F('This month’s focus')}</h2><div class="hub-list hg-list">${picked.map(row).join('')}</div>`;
  }

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
    return `<label class="hg-banner" role="button"><span class="hg-banner-img"><img src="assets/share/month-${m}.jpg" alt=""></span><span class="hg-banner-copy"><b>${F(`${name()} is ${words[m]} month${m === 1 ? '' : 's'}`)}</b><small>${F(`Add {p} ${m}-month photo to Memories`)}</small></span><span class="hg-banner-plus" aria-hidden="true">＋</span>${input ? input.outerHTML : ''}</label>`;
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
    picks.lead = lead.id; picks.taken = [];
    const fo = focus([lead, ...rest].filter(c => !(c.id === 'crying' && a >= 2.5) && !(c === lead && c.id === 'crying')));   // the fussy-weeks card already says what helps
    h += glance() + fo + comingUp(later, a);
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
