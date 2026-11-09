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

  // At a glance: one thing per area that's true for Maya this month and easy to miss, never the stage name.
  // Each is a rule of thumb, a number that changes with age, or a step that's due now, and opens the page that explains it.
  // [area, the thing to know, one line, page]. Feeding, sleep and safety follow adjusted age; fever follows birthday age (AAP).
  const FEVER = m => m < 3 ? ['100.4°F', 'Under 3 months, this means calling right away, day or night', "openPage('chg:Health:d:sick')"]
    : m < 6 ? ['101°F', 'From 3 months, call at this or higher, or sooner if {s} seems very ill', "openPage('chg:Health:d:sick')"]
    : ['103°F', 'From 6 months, call at this, or for any fever lasting more than a day', "openPage('chg:Health:d:sick')"];
  const KNOW = {
    0: { Feeding: ['6+ wet diapers', 'A day from about day 5 is the clearest sign feeds are going well', "openPage('chg:Feeding:d:enough')"],
         Sleep: ['A pacifier at sleep', 'Offering one at naps and bedtime lowers SIDS risk. Nursing? Wait until feeds are going well', "openPage('chg:Sleep:d:where')"],
         Safety: ['Car seat straps', 'Snug enough that you can’t pinch any slack at the shoulder. No puffy coats underneath', "openPage('chg:Out and about:d:car')"] },
    1: { Feeding: ['Growth spurts', 'A few extra-hungry days around 3 and 6 weeks are normal, not a supply problem', "openPage('chg:Feeding:d:enough')"],
         Sleep: ['Your room, {p} own bed', 'Room-sharing on a separate sleep surface for the first 6 months lowers SIDS risk', "openPage('chg:Sleep:d:where')"],
         Safety: ['One hand on {o}', 'Wriggling starts early. On the changing table, never step away', "openPage('chg:Safety:d:step:changing')"] },
    2: { Feeding: ['Shorter feeds', 'Feeds get faster as {s} gets better at it. Quicker isn’t less', "openPage('chg:Feeding:d:milk:rhythm')"],
         Sleep: ['A bedtime routine', 'Start a short one now: the same 2 or 3 steps each night', "openPage('chg:Sleep:d:routine')"],
         Safety: ['Not on the bed or sofa', 'Wriggling can tip {o} off, even before {s} rolls. The floor is safest', "openPage('safety-stage:reaching')"] },
    3: { Feeding: ['Distracted feeds', 'Pulling off to look around is normal. A quiet, dim room helps', "openPage('chg:Feeding:d:cues')"],
         Sleep: ['The 4-month change', 'More waking for a few weeks is sleep maturing, not going backward', "openPage('chg:Sleep:d:regress')"],
         Safety: ['Swaddle off', 'At the first try to roll, switch to a sleep sack, arms free', "openPage('chg:Sleep:d:swaddleoff')"] },
    4: { Feeding: ['Peanut, early', 'Early peanut lowers allergy risk. Eczema? Ask your pediatrician about timing', "openPage('chg:Feeding:d:allergens')"],
         Sleep: ['Rolled onto {p} tummy?', 'Still put {o} down on {p} back. Once {s} rolls both ways, {s} can stay how {s} lands', "openPage('chg:Sleep:d:rolling')"],
         Safety: ['The toilet-roll test', 'Anything that fits through a toilet-paper tube can choke {o}', "openPage('chg:Safety:d:step:small')"] },
    5: { Feeding: ['4 signs {s’s} ready', 'Age alone doesn’t decide solids. Tick off the signs as you see them', "openPage('chg:Feeding:d:signs')"],
         Sleep: ['Lower the crib mattress', 'Do it before {s} can sit up on {p} own, not after', "openPage('chg:Sleep:d:mattress')"],
         Safety: ['Choking first aid', 'Learn it before the first bite, so you’re ready if you ever need it', "openPage('chg:Feeding:safe')"] },
    6: { Feeding: ['Iron first', 'The iron {s} was born with runs low around now. Meat, beans or fortified cereal help', "openPage('chg:Feeding:d:food')"],
         Sleep: ['The catnap goes', 'When {s} skips the late nap, bring bedtime earlier', "openPage('chg:Sleep:d:catnap')"],
         Safety: ['Gates go in now', 'Screw-mounted at the top of stairs. A pressure gate there can give way', "openPage('chg:Safety:d:step:gates')"] },
    7: { Feeding: ['Gagging vs choking', 'Loud and red-faced is gagging, and normal. Silent is choking', "openPage('chg:Feeding:safe')"],
         Sleep: ['Night waking again', 'Separation anxiety can wake {o}. The same short goodbye helps', "openPage('chg:Sleep:d:nightwake')"],
         Safety: ['Anchor furniture', 'Dressers, bookcases and TVs, before {s} pulls up on them', "openPage('chg:Safety:d:step:anchor')"] },
    8: { Feeding: ['Finger-sized pieces', 'Soft enough to squash between your fingers. Quarter grapes lengthwise', "openPage('chg:Feeding:d:finger')"],
         Sleep: ['Mattress to its lowest', 'Before {s} pulls up to stand in the crib', "openPage('chg:Sleep:d:mattress')"],
         Safety: ['Poison Help', 'Save 1-800-222-1222 now. Medicines and cleaners go up high', "openPage('chg:Safety:d:step:storage')"] },
    9: { Feeding: ['No cow’s milk to drink', 'Wait until 12 months. Yogurt and cheese are fine now', "openPage('chg:Feeding:d:milk12')"],
         Sleep: ['Standing in the crib', 'Practice sitting back down in the day. It gets easier at night', "openPage('chg:Sleep:d:rough')"],
         Safety: ['Window stops', 'Windows should open no more than 4 inches', "openPage('chg:Safety:d:step:windows')"] },
    10: { Feeding: ['Practice with a cup', 'Bottles phase out between 12 and 18 months. Starting now makes it easier', "openPage('chg:Feeding:d:milk12')"],
         Sleep: ['Two naps for a while', 'Most keep two naps until 13–18 months', "openPage('chg:Sleep:d:after')"],
         Safety: ['Still rear-facing', 'Keep {o} facing back until the seat’s rear-facing limit, often past age 2', "openPage('chg:Out and about:d:car')"] },
    11: { Feeding: ['16–24 oz of milk', 'A day after the first birthday. More can crowd out iron-rich food', "openPage('chg:Feeding:d:milk12')"],
         Sleep: ['A lovey at 1 year', 'Soft toys stay out of the crib until {p} first birthday', "openPage('chg:Sleep:d:lovey')"],
         Safety: ['Higher up', 'Standing brings the stove, tablecloths and hot drinks into reach', "openPage('safety-stage:pulling')"] }
  };
  const HEALTH_DUE = { 0: ['1-month checkup', 'Growth, feeding and how you’re doing'], 1: ['2-month vaccines', 'The first main round. A low fever after is common'], 6: ['First flu shot', 'From 6 months. The first season takes two doses, 4 weeks apart'], 7: ['First tooth? Dentist', 'The first dental visit is after the first tooth, by {p} first birthday'], 8: ['9-month checkup', 'It includes a development screen. Jot down your questions'], 11: ['12-month checkup', 'Anemia and lead checks, and the MMR and chickenpox shots'] };
  function glance() {
    const adj = Math.max(0, Math.min(11, Math.floor(Y().ageNow()))), bday = Math.max(0, Math.min(11, actualMonth()));
    const k = KNOW[adj], due = HEALTH_DUE[bday], fever = FEVER(bday);
    const health = due && !(bday === 6 && (NOW.getMonth() > 2 && NOW.getMonth() < 8)) ? [due[0], due[1], bday === 7 ? "openPage('chg:Daily rhythm:d:teeth')" : `openPage('health-visit:${({ 0: 1, 1: 2, 6: 6, 8: 9, 11: 12 })[bday]}')`] : fever;
    const rows = [['Feeding', k.Feeding], ['Sleep', k.Sleep], ['Health', health], ['Safety', k.Safety]];
    const tile = ([cat, [big, line, go]]) => `<button class="hg-tile" style="${yearTheme(cat)}" onclick="${go}"><span class="hg-tile-top"><span class="hg-tile-ic">${typeof catIcon === 'function' ? catIcon(cat) : ''}</span><small class="hg-tile-cat">${F(cat)}</small></span><b>${F(big)}</b><small>${F(line)}</small></button>`;
    glance.gos = rows.map(r => r[1][2]);
    return `<h2 class="hg-h2">${F('Good to know this month')}</h2><div class="hg-tiles">${rows.map(tile).join('')}</div>`;
  }

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
