/* Ahead · Out and about: car seats, carriers, strollers, trips and flights.
   Parent's question: "How do I take Maya out, and on trips, safely and without stress?"
   Parents arrive with a situation ("we fly next month"), so the page leads with six situation tiles that work at any age.
   Age only shapes the top card, the "new at this age" rows and the details inside each page.
   One home per task: the car seat installation check stays in Safety's First setup; using the seat on trips lives here.
   Sources: AAP (HealthyChildren.org) car seats, baby carriers and flying with baby; FAA child safety seats. */
(function () {
  const CAT = 'Out and about';
  const H = () => window.__hub;
  const F = s => H().F(s);
  const live = () => typeof isCurrent !== 'function' || isCurrent();

  /* ---------- registration: the seventh category ---------- */
  if (typeof TOPICS !== 'undefined' && !TOPICS.some(([t]) => t === CAT)) TOPICS.push([CAT, 'travel', []]);
  if (typeof YEAR_PALETTES !== 'undefined') YEAR_PALETTES[CAT] = { bg: '#fde3d3', pale: '#fef2ea', ink: '#8a4a2c', accent: '#e8b096' };
  if (window.STAGE_TABLE) STAGE_TABLE[CAT] = { kind: 'calendar', fixed: true, stages: [
    { label: 'First outings', age: '0–3 months' },
    { label: 'Longer trips', age: '3–6 months' },
    { label: 'On the go', age: '6–12 months' }
  ] };
  if (typeof YEAR_STORIES !== 'undefined' && !YEAR_STORIES[CAT]) YEAR_STORIES[CAT] = YEAR_STORIES['Daily rhythm'];
  if (typeof CAT_ICON_SCENE !== 'undefined') CAT_ICON_SCENE[CAT] = 0;

  const ART = ['stroller', 'car', 'plane', 'bag'];
  const baseArt = yearIllustration;
  window.yearIllustration = yearIllustration = (t, i = 0) => t === CAT && typeof hubArt === 'function'
    ? hubArt(ART[Math.abs(i) % ART.length], CAT).replace('viewBox="0 0 24 24"', 'viewBox="-7 -7 38 38"').replace('stroke-width="1.5"', 'stroke-width="1.3"').replace('aria-hidden="true">', `aria-hidden="true"><circle cx="12" cy="12" r="18" fill="${YEAR_PALETTES[CAT].pale}" stroke="none"/>`)
    : baseArt(t, i);
  const baseTopic = displayTopic;
  window.displayTopic = displayTopic = t => t === CAT ? 'Outings and travel' : baseTopic(t);

  /* ---------- stage: follows age (birthday age; trips don't change with adjusted age) ---------- */
  const STAGES = STAGE_TABLE[CAT].stages;
  const ageNow = () => live() ? actualMonth() : month;
  const stageFor = m => m < 3 ? 0 : m < 6 ? 1 : 2;
  const stageNow = () => stageFor(ageNow());

  const baseSnap = stageSnapshot;
  window.stageSnapshot = stageSnapshot = function (topic) {
    if (topic !== CAT) return baseSnap(topic);
    const v = stageNow();
    return { title: ['Car seat, carriers and first outings', 'Road trips, flights and sleep away', 'A bigger car seat and snacks on the go'][v], body: ['Buckling in right, wearing Maya safely and what to pack.', 'Flying, long drives and sleeping somewhere new.', 'Still rear-facing, backpack carriers and food on the go.'][v], key: 'travel' };
  };
  const baseYear = categoryYear;
  window.categoryYear = categoryYear = t => t === CAT ? outAndAbout() : baseYear(t);
  const baseCategory = completeCategory;
  window.completeCategory = completeCategory = t => t === CAT ? outAndAbout() : baseCategory(t);

  function frame(attrs, pillsHtml, body) {
    return `<div class="quiet-category hub-page" data-overview="${CAT}" style="${yearTheme(CAT)}" ${attrs}>${monthlyPageHeader(CAT)}${pillsHtml}${body}<p class="hub-foot">${F('Car seats, carriers and strollers each have their own limits. Check the label and the manual.')}</p></div>`;
  }
  const row = (icon, title, sub, id) => H().row({ icon, cat: CAT, title, sub, onclick: `openPage('chg:${CAT}:d:${id}')` });

  /* ---------- the summary screen ---------- */
  // Situations, the way parents think about them: how you're getting around, and the trips you take. Every tile works at every age.
  const GROUPS = [['Getting around', [['car', 'Car seat', 'car'], ['stroller', 'Stroller', 'stroller'], ['carrier', 'Carrier', 'carry']]],
    ['Trips', [['plane', 'Flying', 'fly'], ['road', 'Road trips', 'road'], ['crib', 'Sleeping away', 'away']]]];
  const grid = () => GROUPS.map(([head, tiles]) => `<h2 class="hub-h2">${F(head)}</h2><div class="oa-grid">${tiles.map(([icon, label, id]) => `<button class="oa-tile" onclick="openPage('chg:${CAT}:d:${id}')"><span class="oa-tile-art">${hubArt(icon, CAT)}</span><b>${F(label)}</b></button>`).join('')}</div>`).join('');
  const bagRow = () => H().list('Before any outing', [row('bag', 'Pack the diaper bag', 'A tap-to-pack checklist', 'bag')]);
  function outAndAbout(selected = null) {
    const now = stageNow(), v = STAGES[selected] ? Number(selected) : now, h = H(), browsing = live() && v !== now;
    const pills = h.pills('Outings and travel by age', STAGES.map((st, i) => ({ label: st.label, age: st.age, on: i === v, now: live() && i === now, onclick: `openPage('chg:${CAT}:s:${i}')`, change: '' })), CAT);
    let b = '';
    if (v === 0) {
      b += h.hero({ eyebrow: 'First outings', title: 'Short outings are good for you both', checksLabel: 'What to expect', checks: ['Short trips out start, and fresh air helps you both', 'Maya rides rear-facing in the car seat, every ride', 'For the first couple of months, skip crowds and anyone who’s sick'] });
      b += grid() + bagRow();
      b += h.versus('In the car', ['Every time', 'Check the back seat before you walk away.'], ['Never', 'Leave Maya alone in the car, even for a minute.']);
    } else if (v === 1) {
      b += h.hero({ eyebrow: 'Longer trips', title: 'Bigger trips get easier now', checks: ['Steadier head control makes carriers and strollers easier', 'More predictable feeds make a road trip or first flight doable', 'Maya can face out in a carrier once {p} head is steady'] });
      b += grid() + bagRow();
      b += h.versus('Car seat naps', ['In the car', 'Fine while you drive, buckled in properly.'], ['Out of the car', 'Move Maya to a flat surface to sleep.']);
    } else {
      b += h.hero({ eyebrow: 'On the go', title: 'Outings get busier and more fun', checks: ['Snacks come along now, alongside milk feeds', 'Maya may outgrow the infant car seat, and the next one still faces back', 'Once {s} {sit|sits} well, {s} can ride sitting up in the stroller'] });
      b += grid() + bagRow();
      b += h.list('New at this age', [row('car', 'Moving to a bigger car seat', 'Still rear-facing, whatever the age', 'bigger'), row('bowl', 'Snacks on the go', 'Soft foods, and only when you can watch', 'snacks')]);
      b += h.versus('Snacks in the car', ['Fine', 'At a stop, or with an adult beside Maya.'], ['Skip', 'Handing food back while you drive.']);
    }
    const nx = STAGES[v + 1];
    if (nx) b += h.next(`Coming up around ${[3, 6][v]} months`, ['Longer trips and first flights', 'A bigger car seat and snacks'][v], `openPage('chg:${CAT}:s:${v + 1}')`);
    else b += h.next('After the first birthday', 'Rear-facing for as long as the seat allows', `openPage('chg:${CAT}:d:after1')`);
    if (browsing) b = `<div class="hub-preview"><span>${v > now ? 'Preview' : 'Looking back'} · ${F(STAGES[v].age)}</span><button onclick="openPage('topic:${CAT}')">${F('Back to Maya’s stage')}</button></div>` + b;
    return frame(`data-travel-stage="${v}"`, pills, b);
  }

  /* ---------- the diaper bag: tap to tick off, kept on this phone ---------- */
  const BAG_KEY = 'ahead-bag';
  const bagGet = () => { try { return JSON.parse(localStorage.getItem(BAG_KEY) || '[]'); } catch (e) { return []; } };
  window.oaBagToggle = function (k) {
    let have = bagGet(); have = have.includes(k) ? have.filter(x => x !== k) : have.concat(k);
    try { localStorage.setItem(BAG_KEY, JSON.stringify(have)); } catch (e) { /* the list still works for this visit */ }
    document.querySelectorAll(`.oa-pack[data-k="${k}"]`).forEach(el => { el.classList.toggle('is-on'); el.setAttribute('aria-pressed', el.classList.contains('is-on')); });
    const n = document.querySelector('.oa-pack-count'); if (n) n.textContent = `${document.querySelectorAll('.oa-pack.is-on').length} of ${document.querySelectorAll('.oa-pack').length} packed`;
  };
  window.oaBagReset = function () { try { localStorage.removeItem(BAG_KEY); } catch (e) { /* nothing saved */ } document.querySelectorAll('.oa-pack.is-on').forEach(el => oaBagToggle(el.dataset.k)); };
  function bagList(m) {
    const items = [['diaper', 'diapers', 'Diapers', '1 an hour, plus 2'], ['towel', 'wipes', 'Wipes', 'And a changing pad'], ['shirt', 'clothes', 'Spare clothes', 'For you both'], ['bottle', 'milk', typeof profile !== 'undefined' && profile.feed === 'Formula' ? 'Formula' : 'Milk feeds', typeof profile !== 'undefined' && profile.feed !== 'Breast milk' ? 'Powder and water packed apart' : ''], ['sun', 'hat', 'Hat', 'For sun or cold'], ['sack', 'blanket', 'Light blanket', ''], ['hand', 'sanitizer', 'Hand sanitizer', '']]
      .concat(m >= 6 ? [['bowl', 'snacks', 'Soft snacks', 'And a spoon'], ['cup', 'cup', 'Water in a cup', '']] : []);
    const have = bagGet(), on = items.filter(i => have.includes(i[1])).length;
    return `<section class="hub-card oa-bag"><div class="oa-bag-head"><b class="oa-pack-count">${on} of ${items.length} packed</b><button class="hub-link" onclick="oaBagReset()">Start over</button></div><div class="oa-packs">${items.map(([icon, k, t, sub]) => `<button class="oa-pack${have.includes(k) ? ' is-on' : ''}" data-k="${k}" aria-pressed="${have.includes(k)}" onclick="oaBagToggle('${k}')"><span class="oa-pack-art">${hubArt(icon, CAT)}</span><span><b>${t}</b>${sub ? `<small>${sub}</small>` : ''}</span><i aria-hidden="true">✓</i></button>`).join('')}</div></section>`;
  }

  /* ---------- detail screens ---------- */
  function detail(id) {
    const h = H(), m = ageNow(), d = (title, lead, inner, art) => h.detail(CAT, 'Outings and travel', title, lead, inner, art);
    if (id === 'car') return d('Buckle in right, every ride', 'A car seat only protects Maya when it fits snugly, every single ride.',
      hubFigure('carseat', CAT, 'Rear-facing in the back seat, chest clip level with the armpits, straps snug with no slack to pinch, and no puffy coat underneath.')
      + h.tip('The pinch test', 'Once buckled, try to pinch the strap at {p} shoulder. If you can grab a fold, tighten it.')
      + h.tip('Car seats are for the car', 'Once you arrive, move Maya to a flat surface to sleep. Never set the seat on a table or a shopping cart.')
      + h.tip('Taxis and rideshares', 'Bring the car seat for every ride, however short. A certified technician can check your install for free.')
      + h.video('Car seats: information for families', 'HealthyChildren.org', 'https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Car-Safety-Seats-Information-for-Families.aspx', 'Guide'), 'car');
    if (id === 'carry') return d('Wear Maya safely', 'Holding Maya close is lovely for you both. A quick check keeps {o} breathing easy.',
      hubFigure('carrier', CAT, 'In a carrier: face visible and close enough to kiss, chin off the chest, knees up in an M shape, back supported.')
      + (m < 4 ? h.tip('Slings', 'Take extra care under 4 months. A sling can curl a baby into a C shape that makes breathing harder.') : '')
      + (m >= 3 ? h.tip('Facing out', 'Once Maya holds {p} head steady, {s} can face out if your carrier allows. Turn {o} back in for naps.') : '')
      + (m >= 6 ? h.tip('Backpack carriers', 'Once Maya sits well on {p} own, a backpack carrier works. Bend at the knees, not the waist.') : '')
      + h.video('Carriers: backpacks, front packs and slings', 'HealthyChildren.org', 'https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Baby-Carriers.aspx', 'Guide'), 'carrier');
    if (id === 'stroller') return d('Stroll safely', m < 6 ? 'Little babies ride lying flat. A few habits keep every walk safe.' : 'Once Maya sits steadily, {s} can ride sitting up. A few habits keep every walk safe.',
      hubFigure(m < 6 ? 'stroller' : 'strollerUp', CAT, 'Harness on every time, brakes on when you stop, no bags on the handles and no blanket over the top.')
      + h.tip('Car seat on a stroller frame', 'Fine for a walk. Once you’re home, move Maya to a flat surface to sleep.'), 'stroller');
    if (id === 'bag') return d('Pack the diaper bag', 'Tap each thing as it goes in.',
      bagList(m) + h.tip('Keep it packed', 'Restock as soon as you’re home, so the next outing is grab and go.'), 'bag');
    // Flying, in the order a trip happens: before you go, at the airport, on the plane, when you arrive.
    if (id === 'fly') {
      // A trip in four legs. Each leg says when, then 2–3 specific things to do, so it reads like a plan, not a list of facts.
      const it = (icon, t, sub, link) => `<li><span class="oa-leg-ic">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b><small>${F(sub)}</small>${link || ''}</span></li>`;
      const leg = (n, title, when, items) => `<section class="hub-card oa-leg"><header><span class="oa-leg-n">${n}</span><span><b>${F(title)}</b><small>${F(when)}</small></span></header><ul>${items.join('')}</ul></section>`;
      const passport = `<a class="oa-leg-link" href="https://travel.state.gov/content/travel/en/passports/apply-renew-passport/under-16.html" target="_blank" rel="noopener">Passport form and steps ↗</a>`;
      const pack = ['Extra milk or formula, for delays', 'A change of clothes for you both', 'Pacifier or bottle for takeoff', 'A couple of small new toys', 'Passport, if you’re going abroad'];
      return d('Fly with Maya', 'The safest place for Maya on a plane is in {p} own seat, in a car seat approved for aircraft.',
        leg(1, 'Book and get ready', 'A few weeks before', [
          it('shield', 'Book Maya a seat if you can', 'Safer than your lap in turbulence. Check the car seat’s label says it’s approved for aircraft.'),
          it('book', 'Going abroad? Get Maya a passport', 'Apply in person with form DS-11. Both parents come, with one photo of Maya.', passport),
          it('steth', m < 3 ? 'Check in with your pediatrician' : 'Traveling abroad? Ask about vaccines', m < 3 ? 'Under 3 months, it’s worth waiting if you can. Colds spread easily in airports.' : 'Ask a few weeks before you go.')])
        + `<section class="hub-card hub-skip is-pack oa-leg-pack"><b class="hub-fig-title">${F('Pack in your carry-on')}</b><div class="hub-skip-chips">${pack.map(t => `<span>${F(t)}</span>`).join('')}</div></section>`
        + leg(2, 'At the airport', 'Security and boarding', [
          it('bottle', 'Milk goes through security', 'Formula, breast milk and water for mixing are all allowed. Tell the officer you have them.'),
          it('car', 'Board early', 'Gives you time to install the car seat, in a window seat.')])
        + leg(3, 'On the plane', 'Takeoff to landing', [
          it('swallow', 'Feed at takeoff and landing', 'Swallowing eases ear pressure. A pacifier works too.'),
          m >= 6 ? it('toy', 'Keep {o} busy', 'Bring out one new toy at a time, and walk the aisle when the seatbelt sign is off.') : it('heart', 'Hold, feed and let {o} sleep', 'Walk the aisle when the seatbelt sign is off.')])
        + leg(4, 'When you arrive', 'The first few days', [
          it('crib', 'Set up a safe place to sleep', 'Firm, flat and empty, even in a hotel.', `<button class="oa-leg-link" onclick="openPage('chg:${CAT}:d:away')">Sleeping away from home ›</button>`),
          it('sun', 'Ease into a new time zone', 'Shift naps and bedtime toward local time over a few days. Morning daylight helps.')])
        + h.video('Flying with babies: parent questions and tips', 'HealthyChildren.org', 'https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Flying-with-Baby.aspx', 'Guide'), 'plane');
    }
    if (id === 'away') return d('Sleep away from home', 'New places are fine for sleep, as long as the sleep space is the same as at home: firm, flat and empty.',
      hubFigure('crib', CAT, 'On the back, in a sleep sack, on a firm flat mattress, with nothing else in the crib.') +
      h.steps(['Bring or borrow a portable crib or play yard, and use only the mattress it came with.', 'Keep it bare: no pillows, blankets or bumpers, even if a hotel adds them.', 'Check a hotel crib for broken or missing parts before you use it.'])
      + h.tip('Sharing a room', 'Room-sharing is great. Keep Maya in {p} own sleep space, not your bed.'), 'crib');
    if (id === 'road') return d('Plan a road trip', 'Long drives go better with a few stops built in.',
      hubDayMarkers({ title: 'A stop about every 2 hours', events: [[9 * 60, 'car', 'Leave, ideally as a nap starts'], [11 * 60, 'bottle', 'Stop: feed and change'], [13 * 60, 'mat', 'Stop: change, stretch, play'], [15 * 60, 'home', 'Arrive']], from: 8 * 60, to: 16 * 60, cat: CAT, caption: 'An example drive: leave at 9 as a nap starts, stop at 11 to feed and change, stop at 1 to change and stretch, arrive at 3.' })
      + h.steps(['Drive through a nap when you can.', 'For longer drives, an adult in the back seat helps.'])
      + h.tip('Feeding', 'Stop the car to feed. Never take Maya out of the car seat while you’re moving.')
      + h.tip('Car seat naps', 'Sleeping in the car seat is fine while you drive. Once you arrive, move {o} to a flat surface.'), 'car');
    if (id === 'bigger') return d('Moving to a bigger car seat', 'Most babies outgrow the infant car seat in the first year. That’s about height or weight, not age.',
      hubFigure('outgrown', CAT, 'The infant seat is outgrown when the head is within an inch of the top of the shell, or past the height or weight on the label.')
      + hubStageStrip({ title: 'Car seats, in order', numbered: true, items: [['car', 'Infant seat', 'Rear-facing, from birth'], ['car', 'Convertible seat', 'Still rear-facing'], ['car', 'Forward-facing', 'Only after its rear-facing limits, often 2+']], cat: CAT, caption: 'Infant seat rear-facing from birth, then a convertible seat still rear-facing, and forward-facing only after its rear-facing limits, often age 2 or older.' })
      + h.tip('Not at the first birthday', 'Turning forward at 1 isn’t a milestone. Rear-facing protects the head and neck best.'), 'car');
    if (id === 'snacks') return d('Snacks and drinks on the go', 'Snacks make outings easier. A little planning keeps them safe.',
      h.steps(['Pack soft finger foods that squash easily, and water in a cup.', 'Offer snacks when you can watch: at a stop, or with an adult beside Maya.', 'Leave whole grapes, nuts and popcorn at home.']), 'bowl');
    if (id === 'after1') return d('Rear-facing for as long as the seat allows', 'After the first birthday, the car seat still faces the back.',
      h.steps(['Keep Maya rear-facing until the seat’s rear-facing height or weight limit, often age 2 or older.', 'Only then turn the seat forward, with the harness.'])
      + h.tip('Legs touching the seat back?', 'That’s fine and safe. It isn’t a reason to turn forward.'), 'car');
    return null;
  }

  /* ---------- routes and search ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a] = p.split(':');
    if (cat === CAT && screen === 's') return outAndAbout(Number(a));
    if (cat === CAT && screen === 'd') { const pg = detail(a); if (pg) return pg; }
    return baseRoute(p);
  };
})();
