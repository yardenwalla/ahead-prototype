/* Ahead · Home at a glance (Nov 9 prototype).
   One screen that answers "what's going on with Maya right now?":
     Right now      the change that's closest, with its usual window and where Maya is on it
     At a glance    one line per area, from the same stage each category page leads with
     This month     up to 3 things worth getting ready, taken from what the closest changes affect
     Coming up next the next two changes on the Timeline, which keeps the whole year
   Everything comes from the Timeline's changes and the category stages, so Home, Timeline and Categories agree.
   Nothing to log, nothing to fill in. */
(function () {
  const Y = () => window.__ya, H = () => window.__hub, F = s => H().F(s);
  const chev = '<span class="hub-chev" aria-hidden="true">›</span>';
  const on = () => { try { return localStorage.getItem('ahead-home-classic') !== '1'; } catch (e) { return true; } };

  // How Home says each change when it's the one that's closest. Plain speech, one line.
  const HEAD = {
    crying: 'The fussy weeks are here', smile: 'First smiles are close', nights: 'Nights are starting to stretch',
    regress: 'Sleep may get bumpy for a few weeks', roll: 'Rolling could start any day', ready: 'Getting ready for solids',
    solids: 'First foods are close', twonaps: 'Three naps are becoming two', crawl: 'Maya is getting ready to move',
    sit: 'Sitting up on {p} own', tooth: 'A first tooth is on the way', finger: 'Thicker textures, and finger foods',
    meals: 'Meals are becoming part of the day', carseat: 'The next car seat', sep: 'Goodbyes may get harder',
    pull: 'Pulling up to stand', words: 'First words are close', milk: 'Time to switch to whole milk', steps: 'First steps are close'
  };
  const firstSentence = t => (String(t).match(/^.*?[.!?](\s|$)/) || [t])[0].trim();

  function changes() {
    const y = Y(), a = y.ageNow(), done = y.doneNow();
    const ahead = y.C.filter(c => c.end > a && !done[c.id] && y.PAGES[c.id]).sort((p, q) => p.start - q.start || p.end - q.end);
    return { a, now: ahead.filter(c => c.start <= a + 1).slice(0, 3), later: ahead.filter(c => c.start > a + 1) };
  }

  function hero(c, a) {
    const y = Y(), p = y.PAGES[c.id];
    return `<section class="hg-hero" style="${yearTheme(c.cat)}">
      <span class="hg-hero-art" aria-hidden="true">${typeof homeMonthArt === 'function' ? homeMonthArt(actualMonth()).replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ') : ''}</span>
      <div class="hg-hero-copy">
        <p class="hg-eyebrow">${F('Right now')}</p>
        <h1>${F(HEAD[c.id] || c.title)}</h1>
        <p class="hg-lead">${F(y.TOUCH[c.id] || firstSentence(p.lead))}</p>
        <div class="hg-window"><span class="hg-window-label"><b>${F(y.range(c))}</b> · ${F(y.whenShort(c, a))}</span>${y.windowBar(c, a)}</div>
        <button class="hg-btn" onclick="${c.go}">${F('See what it changes')} <span aria-hidden="true">→</span></button>
      </div></section>`;
  }

  // Good to know this month: the four things that matter most for Maya right now, from any area.
  // Each has the ages it applies to (adjusted age; Health by birthday age, like checkups and fever) and a weight:
  // 3 = do it now or it's easy to get wrong, 2 = useful, 1 = filler. Things that just became true rank a little higher.
  // [area, from, to, weight, the thing to know, one line, page]
  const POOL = [
    ['Feeding', 0, 1, 3, '6+ wet diapers', 'A day from about day 5 is the clearest sign feeds are going well', 'chg:Feeding:d:enough'],
    ['Sleep', 0, 2, 2, 'A pacifier at sleep', 'Offering one at naps and bedtime lowers SIDS risk. Nursing? Wait until feeds are going well', 'chg:Sleep:d:where'],
    ['Sleep', 0, 3, 2, 'Your room, {p} own bed', 'Room-sharing on a separate sleep surface for the first 6 months lowers SIDS risk', 'chg:Sleep:d:where'],
    ['Safety', 0, 1.5, 2, 'Car seat straps', 'Snug enough that you can’t pinch any slack at the shoulder. No puffy coats underneath', 'chg:Out and about:d:car'],
    ['Health', 0, 3, 3, '100.4°F', 'Under 3 months, this means calling right away, day or night', 'chg:Health:d:sick', 'bday'],
    ['Feeding', 0.5, 2, 2, 'Growth spurts', 'A few extra-hungry days around 3 and 6 weeks are normal, not a supply problem', 'chg:Feeding:d:enough'],
    ['Safety', 1, 3, 2, 'One hand on {o}', 'Wriggling starts early. On the changing table, never step away', 'chg:Safety:d:step:changing'],
    ['Sleep', 1.5, 3.5, 2, 'A bedtime routine', 'Start a short one now: the same 2 or 3 steps each night', 'chg:Sleep:d:routine'],
    ['Safety', 2, 4, 2, 'Not on the bed or sofa', 'Wriggling can tip {o} off, even before {s} rolls. The floor is safest', 'safety-stage:reaching'],
    ['Feeding', 2, 4, 1, 'Shorter feeds', 'Feeds get faster as {s} gets better at it. Quicker isn’t less', 'chg:Feeding:d:enough'],
    ['Health', 3, 4, 3, 'Now 101°F', 'The fever to call about changes at 3 months. Sooner if {s} seems very ill', 'chg:Health:d:sick', 'bday'],
    ['Sleep', 3, 5, 3, 'The 4-month change', 'More waking for a few weeks is sleep maturing, not going backward', 'chg:Sleep:d:regress'],
    ['Sleep', 3, 5, 3, 'Swaddle off', 'At the first try to roll, switch to a sleep sack, arms free', 'chg:Sleep:d:swaddleoff'],
    ['Feeding', 3, 5, 2, 'Distracted feeds', 'Pulling off to look around is normal. A quiet, dim room helps', 'chg:Feeding:d:cues'],
    ['Feeding', 4, 6, 3, 'Peanut, early', 'Early peanut lowers allergy risk. Eczema? Ask your pediatrician about timing', 'chg:Feeding:d:allergens'],
    ['Sleep', 4, 6, 2, 'Rolled onto {p} tummy?', 'Still put {o} down on {p} back. Once {s} rolls both ways, {s} can stay how {s} lands', 'chg:Sleep:d:rolling'],
    ['Safety', 4, 7, 2, 'The toilet-roll test', 'Anything that fits through a toilet-paper tube can choke {o}', 'chg:Safety:d:step:small'],
    ['Feeding', 4.5, 6.5, 3, '4 signs {s’s} ready', 'Age alone doesn’t decide solids. Tick off the signs as you see them', 'chg:Feeding:d:signs'],
    ['Sleep', 5, 7, 3, 'Lower the crib mattress', 'Do it before {s} can sit up on {p} own, not after', 'chg:Sleep:d:mattress'],
    ['Safety', 5, 7, 3, 'Choking first aid', 'Learn it before the first bite, so you’re ready if you ever need it', 'chg:Feeding:safe'],
    ['Health', 6, 7, 2, 'Now 103°F', 'The fever to call about changes at 6 months. Also call if a fever lasts more than a day', 'chg:Health:d:sick', 'bday'],
    ['Health', 6, 7.5, 3, 'First flu shot', 'From 6 months. The first season takes two doses, 4 weeks apart', 'health-visit:6', 'bday', 'flu'],
    ['Feeding', 6, 8, 3, 'Iron first', 'The iron {s} was born with runs low around now. Meat, beans or fortified cereal help', 'chg:Feeding:d:food'],
    ['Sleep', 6, 9, 2, 'The catnap goes', 'When {s} skips the late nap, bring bedtime earlier', 'chg:Sleep:d:catnap'],
    ['Safety', 6, 8, 2, 'Gates go in now', 'Screw-mounted at the top of stairs. A pressure gate there can give way', 'chg:Safety:d:step:gates'],
    ['Feeding', 6.5, 8.5, 2, 'Gagging vs choking', 'Loud and red-faced is gagging, and normal. Silent is choking', 'chg:Feeding:safe'],
    ['Safety', 7, 9.5, 3, 'Anchor furniture', 'Dressers, bookcases and TVs, before {s} pulls up on them', 'chg:Safety:d:step:anchor'],
    ['Feeding', 7.5, 9.5, 3, 'Finger-sized pieces', 'Soft enough to squash between your fingers. Quarter grapes lengthwise', 'chg:Feeding:d:finger'],
    ['Sleep', 8, 10, 3, 'Mattress to its lowest', 'Before {s} pulls up to stand in the crib', 'chg:Sleep:d:mattress'],
    ['Sleep', 8, 10, 2, 'Night waking again', 'Separation anxiety can wake {o}. The same short goodbye helps', 'chg:Sleep:d:nightwake'],
    ['Health', 8.25, 9.75, 2.5, 'The 9-month checkup', 'It includes a development screen. Jot down your questions', 'health-visit:9', 'bday'],
    ['Safety', 8, 11, 2, 'Window stops', 'Windows should open no more than 4 inches', 'chg:Safety:d:step:windows'],
    ['Feeding', 9, 11, 3, 'No cow’s milk to drink', 'Wait until 12 months. Yogurt and cheese are fine now', 'chg:Feeding:d:milk12'],
    ['Sleep', 9, 11, 2, 'Standing in the crib', 'Practice sitting back down in the day. It gets easier at night', 'chg:Sleep:d:rough'],
    ['Daily rhythm', 9, 12.5, 2, 'Barefoot indoors', 'Bare feet help balance for cruising and first steps. Shoes are for outside', 'chg:Daily rhythm:d:steps'],
    ['Safety', 9, 12.5, 2.5, 'Still rear-facing', 'The next car seat faces back too, often past age 2', 'chg:Out and about:d:car'],
    ['Feeding', 9.5, 12, 2, 'Practice with a cup', 'Bottles phase out between 12 and 18 months. Starting now makes it easier', 'chg:Feeding:d:milk12'],
    ['Safety', 10, 12.5, 2, 'Higher up', 'Standing brings the stove, tablecloths and hot drinks into reach', 'safety-stage:pulling'],
    ['Feeding', 11, 12.5, 3, '16–24 oz of milk', 'A day after the first birthday. More can crowd out iron-rich food', 'chg:Feeding:d:milk12'],
    ['Sleep', 11, 12.5, 2, 'A lovey at 1 year', 'Soft toys stay out of the crib until {p} first birthday', 'chg:Sleep:d:lovey'],
    ['Health', 11, 12.5, 3, 'The 12-month checkup', 'Anemia and lead checks, and the MMR and chickenpox shots', 'health-visit:12', 'bday'],
    ['Health', 0.5, 1.25, 2.5, 'The 1-month checkup', 'Growth, feeding, and how you’re doing too', 'health-visit:1', 'bday'],
    ['Health', 1.5, 2.25, 3, 'The 2-month vaccines', 'The first main round. A low fever after is common', 'health-visit:2', 'bday']
  ];
  function picks() {
    const adj = Y().ageNow(), bday = (NOW - parse(profile.dob)) / (30.4375 * 864e5);
    const flu = NOW.getMonth() >= 8 || NOW.getMonth() <= 2;   // September to March
    const live = POOL.map(t => { const a = t[7] === 'bday' ? bday : adj; return { t, a }; })
      .filter(({ t, a }) => a >= t[1] && a < t[2] && (t[8] !== 'flu' || flu))
      .map(({ t, a }) => ({ t, score: t[3] + (a - t[1] < 1 ? 0.5 : 0) - (t[2] - a < 0.5 ? 0.25 : 0) }))
      .sort((x, y) => y.score - x.score || y.t[1] - x.t[1]);
    const out = [], per = {}, gos = new Set();
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
  function focus(now) {
    const y = Y(), picked = [], seen = new Set(glance.gos || []);
    for (let i = 0; i < 5 && picked.length < 3; i++) for (const c of now) {
      const r = y.PAGES[c.id].rows.filter(r => r[1] !== 'Development')[i];
      if (r && !seen.has(r[4]) && picked.length < 3) { seen.add(r[4]); picked.push([c, r]); }
    }
    if (!picked.length) return '';
    const row = ([c, [icon, cat, title, sub, go]]) => `<button class="hub-row hg-row" onclick="${go}"><span class="hub-dot">${hubArt(icon, cat)}</span><span class="hub-row-copy"><small class="hub-row-eyebrow">${F(c.title)}</small><b>${F(title)}</b><small>${F(sub)}</small></span>${chev}</button>`;
    return `<h2 class="hg-h2">${F('This month’s focus')}</h2><div class="hub-list hg-list">${picked.map(row).join('')}</div>`;
  }

  function comingUp(later, a) {
    const two = later.slice(0, 2); if (!two.length) return '';
    const when = c => { const m = Math.max(Math.ceil(a), Math.floor(c.start)); return m >= 12 ? 'Around 1 year' : `${m} months`; };
    return `<button class="hg-next" onclick="navigate('next')"><span class="hg-next-head"><b>${F('Coming up next')}</b><em>${F('Timeline')} ›</em></span>
      <span class="hg-stops">${two.map(c => `<span class="hg-stop" style="${yearTheme(c.cat)}"><i aria-hidden="true"></i><small>${F(when(c))}</small><span class="hg-stop-row"><span class="hg-stop-art">${hubArt(c.icon, c.cat)}</span><b>${F(c.title)}</b></span><span class="hg-stop-why">${F(c.why)}</span></span>`).join('')}</span></button>`;
  }

  function paintGlance() {
    const main = document.getElementById('main'); if (!main || !Y() || !H()) return;
    const ageLine = main.querySelector('.home-age-line'), question = main.querySelector('.connected-checkin');
    const { a, now, later } = changes();
    if (!now.length) return;   // past the first year's changes: keep the usual Home
    let h = '<div class="hg-page">' + (ageLine ? ageLine.outerHTML : '');
    // The change that asks most of the parent leads; ties go to the one that's closest.
    const RANK = ['crawl', 'roll', 'pull', 'ready', 'solids', 'steps', 'sit', 'finger', 'meals', 'milk', 'crying', 'regress', 'twonaps', 'tooth', 'sep', 'carseat', 'nights', 'smile', 'words'];
    const lead = now.slice().sort((p, q) => RANK.indexOf(p.id) - RANK.indexOf(q.id))[0];
    h += hero(lead, a);
    h += question ? question.outerHTML : '';
    h += glance() + focus([lead, ...now.filter(c => c !== lead)]) + comingUp(later, a);
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
