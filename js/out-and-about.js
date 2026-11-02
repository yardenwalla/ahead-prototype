/* Ahead · Outings and travel, rebuilt around how parents think about leaving the house:
   "Where are we going, and what do I need to know for Maya's age?"
   Job: whenever we leave the house, from a walk to a flight, tell me how to do it safely and calmly at Maya's age.
   Rule: a page belongs here if it's about taking the baby somewhere: getting there, being there, or sleeping there.
   Ownership: sun by age and dressing live in Everyday care, safe sleep in Sleep, fevers in Health, babyproofing in Safety,
   milk and food in Feeding. Outings shows the travel-specific step and links to the home page, so nothing is written twice.

   The home screen: a top card for the age, then situations first ("Where are you headed?"), then the gear underneath,
   the one must-know car card, and what's next. Situation pages follow the order a trip happens (before, on the day,
   when you get there). Age decides what shows: nothing for a later age appears early.
   Sources (working notes, never in the app): scratchpad travel-sources.md, kept in the project as travel-sources. */
(function () {
  const CAT = 'Out and about';
  const H = () => window.__hub;
  const F = s => H().F(s);
  const live = () => typeof isCurrent !== 'function' || isCurrent();

  /* ---------- registration ---------- */
  if (typeof TOPICS !== 'undefined' && !TOPICS.some(([t]) => t === CAT)) TOPICS.push([CAT, 'travel', []]);
  if (typeof YEAR_PALETTES !== 'undefined') YEAR_PALETTES[CAT] = { bg: '#fde3d3', pale: '#fef2ea', ink: '#8a4a2c', accent: '#e8b096' };
  // No stages: outings change with where you're going, not with a stage. Age only changes a few lines inside the pages,
  // and the top card says what's new for outings this month, with one "Coming up" line for the next change.
  if (typeof YEAR_STORIES !== 'undefined' && !YEAR_STORIES[CAT]) YEAR_STORIES[CAT] = YEAR_STORIES['Daily rhythm'];
  if (typeof CAT_ICON_SCENE !== 'undefined') CAT_ICON_SCENE[CAT] = 0;
  const baseTopic = displayTopic;
  window.displayTopic = displayTopic = t => t === CAT ? 'Outings and travel' : baseTopic(t);

  /* ---------- the baby ---------- */
  const ageNow = () => live() ? actualMonth() : month;
  const stageFor = m => m < 2 ? 0 : m < 6 ? 1 : 2;
  const stageNow = () => stageFor(ageNow());
  const feed = () => (typeof profile !== 'undefined' && profile.feed) || 'Breast milk';
  const nursing = () => feed() !== 'Formula';
  const formula = () => feed() !== 'Breast milk';
  // Moving, as the parent reported it in Safety (crawling or pulling up), never claimed from age alone.
  const moving = () => live() && typeof currentSafetyMovementStage === 'function' && ['moving', 'pulling'].includes(currentSafetyMovementStage());
  // Hot or cold, from the date: the weather page opens on the season the parent is in.
  const season = () => { const mo = (typeof NOW !== 'undefined' ? NOW : new Date()).getMonth(); return mo >= 4 && mo <= 8 ? 'hot' : mo >= 10 || mo <= 2 ? 'cold' : 'hot'; };
  let weatherView = null;

  const baseSnap = stageSnapshot;
  window.stageSnapshot = stageSnapshot = function (topic) {
    if (topic !== CAT) return baseSnap(topic);
    const n = nowFor(ageNow());
    return { title: n[1], body: 'Errands, trips, the weather and your gear.', key: 'travel' };
  };
  const baseYear = categoryYear;
  window.categoryYear = categoryYear = t => t === CAT ? outAndAbout() : baseYear(t);
  const baseCategory = completeCategory;
  window.completeCategory = completeCategory = t => t === CAT ? outAndAbout() : baseCategory(t);

  /* ---------- colors and small flat pictures, in Development's shapes style ---------- */
  const PAL = {
    errands: ['#e6f5ec', '#356651', '#bfe3cf', '#f2b8c6'],
    road: ['#e7effc', '#46638c', '#9fb8df', '#d9e5fc'],
    fly: ['#ece8f8', '#5b4f8a', '#c3b8ea', '#e3b8cf'],
    abroad: ['#e2f3f1', '#2f6661', '#a9dbd4', '#fbe6bd'],
    away: ['#f6e8f3', '#7a4f74', '#e3b8cf', '#f4d6c4'],
    weather: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'],
    hot: ['#fff3dc', '#8a6a2a', '#f3d58a', '#f6c9a8'],
    cold: ['#e3e6f6', '#3d4a7a', '#b9c2ea', '#d9e5fc'],
    gear: ['#fde3d3', '#8a4a2c', '#f4c3a8', '#e7effc'],
    sick: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0']
  };
  const SHAPE = {
    // A path with a stop at the end.
    errands: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M6 30h50" stroke="${c[2]}" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 11"/><circle cx="70" cy="22" r="10" fill="${c[3]}"/></svg>`,
    // A road, its dashes, and a small car shape.
    road: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="2" y="24" width="86" height="12" rx="6" fill="${c[2]}"/><path d="M12 30h66" stroke="#fff" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round"/><rect x="24" y="8" width="28" height="12" rx="6" fill="${c[3]}"/></svg>`,
    // A flight path arcing up.
    fly: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M6 34Q40 -2 80 18" stroke="${c[2]}" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="1 7"/><circle cx="80" cy="18" r="7" fill="${c[3]}"/><circle cx="8" cy="34" r="4" fill="${c[2]}"/></svg>`,
    // A globe: a circle with one ring.
    abroad: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="${c[2]}"/><ellipse cx="20" cy="20" rx="7" ry="16" fill="none" stroke="#fff" stroke-width="2"/><circle cx="50" cy="28" r="7" fill="${c[3]}"/></svg>`,
    // A house shape, and a small circle beside it.
    away: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 18 22 4l18 14v18H4Z" fill="${c[2]}"/><circle cx="54" cy="28" r="8" fill="${c[3]}"/></svg>`,
    // Half a sun and a cool drop: hot and cold.
    weather: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 34a16 16 0 0 1 32 0Z" fill="${c[2]}"/><circle cx="54" cy="16" r="8" fill="${c[3] === '#fbe0d0' ? '#d9e5fc' : c[3]}"/></svg>`,
    hot: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="20" cy="22" r="14" fill="${c[2]}"/><rect x="42" y="26" width="40" height="8" rx="4" fill="${c[3]}"/></svg>`,
    cold: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="14" cy="14" r="6" fill="${c[2]}"/><circle cx="34" cy="24" r="8" fill="${c[3]}"/><circle cx="56" cy="12" r="5" fill="${c[2]}"/><rect x="4" y="32" width="76" height="5" rx="2.5" fill="${c[3]}"/></svg>`,
    gear: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="10" width="30" height="24" rx="8" fill="${c[2]}"/><circle cx="50" cy="28" r="7" fill="${c[3]}"/></svg>`,
    sick: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="10" y="2" width="12" height="28" rx="6" fill="${c[2]}"/><circle cx="16" cy="31" r="8" fill="${c[2]}"/><rect x="34" y="18" width="40" height="8" rx="4" fill="${c[3]}"/></svg>`
  };

  /* ---------- building blocks ---------- */
  const open = id => `openPage('chg:${CAT}:d:${id}')`;
  const sec = t => `<h2 class="oa-sec">${F(t)}</h2>`;
  // Plain lines in one white card: [title, line] pairs, or a single line.
  const lines = items => `<ul class="oa-lines">${items.filter(Boolean).map(x => Array.isArray(x) ? `<li><b>${F(x[0])}</b><span>${F(x[1])}</span></li>` : `<li>${F(x)}</li>`).join('')}</ul>`;
  // The one card that stands out on a page.
  const todo = (label, items) => `<section class="ss-do oa-do"><b>${F(label)}</b>${Array.isArray(items) ? `<ul>${items.filter(Boolean).map(t => `<li>${F(t)}</li>`).join('')}</ul>` : `<p>${F(items)}</p>`}</section>`;
  const know = (label, text) => `<p class="ss-know"><b>${F(label)}</b>${F(text)}</p>`;
  // A row that opens a page in another category, so the advice lives in one place.
  const elsewhere = (icon, title, sub, go, where) => `<div class="oa-link-row">${H().list('', [H().row({ icon, cat: CAT, title, sub: sub + (where ? ' · In ' + where : ''), onclick: go })])}</div>`;
  const rowTo = (icon, title, sub, id, chip) => H().row({ icon, cat: CAT, title, sub, onclick: open(id), chipText: chip });
  function sub(key, context, title, lead, inner) {
    const c = PAL[key] || PAL.gear;
    return `<div class="quiet-category hub-page hub-detail" data-overview="${CAT}" data-ss="1" data-oa-page="${key}" style="${yearTheme(CAT)};--ss-bg:${c[0]};--ss-ink:${c[1]}">${detailPageTop(CAT)}`
      + `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}"><span class="dev-area-head-art">${(SHAPE[key] || SHAPE.gear)(c)}</span><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`
      + inner + `</div>`;
  }

  /* ---------- the home screen ---------- */
  const PLACES = [
    ['errands', 'Errands and walks', ['The store, the doctor, changing', 'The store, a café, changing', 'Stores, cafés and snacks']],
    ['road', 'Road trips', ['Long drives and stops']],
    ['fly', 'Flying', ['Booking, security, the flight']],
    ['away', 'Staying away', ['Family, friends or a hotel']],
    ['weather', 'Hot and cold days', ['Walks, the car and the stroller']],
    ['abroad', 'Going abroad', ['Passport, shots and water', 'Passport, shots and water', 'Passport, shots, food and water']]
  ];
  const placeSub = (id, subs, v) => {
    if (id === 'away' && v === 2) return moving() ? 'Babyproof it in 10 minutes' : 'Family, friends or a hotel';
    if (id === 'weather') return season() === 'cold' ? 'Dressing for walks and the car' : 'Heat, sun and the pool';
    return subs[Math.min(v, subs.length - 1)];
  };
  const places = v => `<h2 class="hub-h2">${F('Where are you headed?')}</h2><div class="oa-places">${PLACES.map(([id, label, subs]) => { const c = PAL[id === 'weather' ? season() : id]; return `<button class="oa-place" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="${open(id)}"><span class="oa-place-art">${SHAPE[id](c)}</span><b>${F(id === 'errands' && v === 0 ? 'First outings' : label)}</b><small>${F(placeSub(id, subs, v))}</small></button>`; }).join('')}</div>`;
  const GEAR_C = { car: ['#e7effc', '#46638c'], stroller: ['#e6f5ec', '#356651'], carrier: ['#fdeef2', '#a24d6a'], bag: ['#fff3dc', '#8a6a2a'], snack: ['#fdeee6', '#9a5a3c'] };
  const gearRow = (icon, key, title, sub, id, chip) => `<button class="hub-row oa-row" style="--hl-bg:${GEAR_C[key][0]};--hl-ink:${GEAR_C[key][1]}" onclick="${open(id)}"><span class="oa-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(sub)}</small>${chip ? `<span class="hub-chip">${F(chip)}</span>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  function gear(v) {
    const n = bagItems(ageNow()).length, on = bagItems(ageNow()).filter(i => bagGet().includes(i[1])).length;
    return `<h2 class="hub-h2">${F('Your gear')}</h2><div class="hub-list">`
      + gearRow('car', 'car', 'Car seat', ageNow() < 6 ? 'Installing it and buckling in' : 'Fit, and when to size up', 'car')
      + gearRow('stroller', 'stroller', 'Stroller', 'Harness, brakes and shade', 'stroller')
      + gearRow('carrier', 'carrier', 'Carrier', ageNow() < 2 ? 'Wearing {o} safely' : ageNow() < 6 ? 'When {s} can face out' : 'Front and back carriers', 'carry')
      + gearRow('bag', 'bag', 'Diaper bag', 'Packed for how Maya is fed', 'bag', on ? `${on} of ${n} packed` : '')

      + `</div>`;
  }
  // What's new for outings, month by month: [from month, headline, one line, the page it opens].
  const NOWS = [
    [0, 'Short outings are good for you both', 'Fresh air and a change of scene help, even in the first weeks.', 'errands'],
    [2, 'Longer trips fit between feeds now', 'Feeds spread out, so a long drive or a first flight gets easier.', 'fly'],
    [4, 'Maya may be ready to face out', 'Once {p} head is steady, {s} can face out in the carrier.', 'carry'],
    [6, 'Snacks join your outings now', 'So do water in a cup and sunscreen, from 6 months.', 'errands'],
    [9, 'A bigger car seat may be next', 'Most babies outgrow the infant seat in the first year.', 'car'],
    [12, 'Rear-facing after the first birthday, too', 'Keep {o} rear-facing for as long as the seat allows.', 'after1']
  ];
  const nowFor = m => NOWS.filter(n => n[0] <= m).pop();
  const nextFor = m => NOWS.find(n => n[0] > m);
  function outAndAbout() {
    const m = ageNow(), v = stageFor(m), h = H(), n = nowFor(m), nx = nextFor(m);
    let b = `<header class="hub-hero oa-hero"><p class="hub-eyebrow">${F(m < 1 ? 'In the first weeks' : `At ${m} ${m === 1 ? 'month' : 'months'}`)}</p><h1>${F(n[1])}</h1><p class="hub-lead">${F(n[2])}</p></header>`;
    b += places(v) + gear(v);
    b += h.versus('In the car', ['Every time', 'Look in the back seat before you walk away.'], ['Never', 'Leave Maya alone in the car, even for a minute.']);
    if (nx) b += h.next(`Coming up around ${nx[0]} months`, nx[1], open(nx[3]));
    b += h.note('Car seats, carriers and strollers each have their own limits. Check the label and the manual.');
    return `<div class="quiet-category hub-page" data-overview="${CAT}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${b}</div>`;
  }

  /* ---------- the diaper bag: tap to tick off, kept on this phone, packed for how Maya is fed ---------- */
  const BAG_KEY = 'ahead-bag';
  const bagGet = () => { try { return JSON.parse(localStorage.getItem(BAG_KEY) || '[]'); } catch (e) { return []; } };
  window.oaBagToggle = function (k) {
    let have = bagGet(); have = have.includes(k) ? have.filter(x => x !== k) : have.concat(k);
    try { localStorage.setItem(BAG_KEY, JSON.stringify(have)); } catch (e) { /* the list still works for this visit */ }
    document.querySelectorAll(`.oa-pack[data-k="${k}"]`).forEach(el => { el.classList.toggle('is-on'); el.setAttribute('aria-pressed', el.classList.contains('is-on')); });
    const n = document.querySelector('.oa-pack-count'); if (n) n.textContent = `${document.querySelectorAll('.oa-pack.is-on').length} of ${document.querySelectorAll('.oa-pack').length} packed`;
  };
  window.oaBagReset = function () { try { localStorage.removeItem(BAG_KEY); } catch (e) { /* nothing saved */ } document.querySelectorAll('.oa-pack.is-on').forEach(el => oaBagToggle(el.dataset.k)); };
  function bagItems(m) {
    const f = feed();
    return [
      ['diaper', 'diapers', 'Diapers', m < 6 ? '1 every 2 hours, plus 2' : '1 every 3 hours, plus 2'],
      ['towel', 'wipes', 'Wipes and a changing pad', 'And a bag for dirty diapers'],
      ['shirt', 'clothes', 'A change of clothes', 'For you both'],
      ['heart', 'burp', 'Burp cloths', ''],
      f !== 'Formula' ? ['fridge', 'pumped', 'Pumped milk in a cooler with ice packs', 'If you’re bringing some'] : null,
      f !== 'Breast milk' ? ['bottle', 'formula', 'Formula powder and water', 'Packed separately'] : null,
      f !== 'Breast milk' ? ['cup', 'bottles', 'Clean bottles', 'One for each feed, plus one'] : null,
      m < 12 ? ['pacifier', 'pacifier', 'A pacifier, if {s} {use|uses} one', 'And a spare'] : null,
      ['sun', 'hat', 'A hat', 'Sun hat or warm hat'],
      ['sack', 'layer', 'An extra layer', 'For cold or air-conditioned places'],
      ['hand', 'sanitizer', 'Hand sanitizer', 'For you, before feeds and changes'],
      m >= 6 ? ['bowl', 'snacks', 'Soft snacks and a spoon', ''] : null,
      m >= 6 ? ['drop', 'cup', 'Water in a cup', ''] : null
    ].filter(Boolean);
  }
  function bagList(m) {
    const items = bagItems(m), have = bagGet(), on = items.filter(i => have.includes(i[1])).length;
    return `<section class="hub-card oa-bag"><div class="oa-bag-head"><b class="oa-pack-count">${on} of ${items.length} packed</b><button class="hub-link" onclick="oaBagReset()">Start over</button></div><div class="oa-packs">${items.map(([icon, k, t, s]) => `<button class="oa-pack${have.includes(k) ? ' is-on' : ''}" data-k="${k}" aria-pressed="${have.includes(k)}" onclick="oaBagToggle('${k}')"><span class="oa-pack-art">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}</span><i aria-hidden="true">✓</i></button>`).join('')}</div></section>`;
  }
  // Keeping milk safe on the go, for the family's own feeding method.
  const milkOnTheGo = () => lines([
    nursing() && ['Pumped milk, if you bring some', 'Fine at room temperature for up to 4 hours, or up to 24 hours in a cooler bag with ice packs.'],
    formula() && ['Formula', 'Carry the powder and the water separately and mix when {s’s} hungry. Once mixed, use it within 2 hours, or within 1 hour of starting the feed.'],
  ]);

  /* ---------- the pages ----------
     Every page follows the same pattern as Sleep's and Health's subpages, so the category reads as one piece:
       the colored header (the color of the tile the parent tapped)
       → the key answer as a visual (picture steps, a strip in time order, tiles, or a figure)
       → "Good to know": at most 3 rows
       → "Normal, or time to call?" only where it applies.
     Copy rule: one idea per line. A row is a plain title and one sentence about that title, nothing else.
     A fact lives on one page only:
       Car seat basics: installing, buckling, how long, add-ons, outgrowing it. Cold days: coats and blankets in the car seat.
       Stroller basics: shade and blankets over the stroller. Diaper bag: mixing and keeping milk. Errands: snacks out, the shopping cart.
       Road trips: stops. Staying away: a new place. Going abroad: what's different outside the US. */
  const tiles = (heading, ts) => `<h2 class="hub-h2">${F(heading)}</h2>${H().tiles(ts.filter(Boolean))}`;
  const steps = (items, caption, numbered = false) => hubIconSteps(items.filter(Boolean), CAT, F(caption), numbered);
  const strip = (title, items, caption) => hubStageStrip({ title, items: items.filter(Boolean), numbered: true, cat: CAT, caption });
  const good = (rows, heading = 'Good to know') => { const r = rows.filter(Boolean).slice(0, 3); return r.length ? H().list(heading, r.map(([icon, title, s]) => H().row({ icon, cat: CAT, title, sub: s }))) : ''; };
  const calls = (a, b) => H().versus('When to call', a, b);

  function detail(id) {
    const m = ageNow();

    if (id === 'errands') {
      // Wherever you go (a store, a café, the park, the doctor): the cart, changing, naps out, and feeding out.
      const nurse = ['mouth', 'Nursing or pumping', 'Nurse wherever you’re comfortable. To pump, ask for a nursing room, or use your parked car.'];
      const noTable = ['diaper', 'No changing table?', 'Lay your changing pad on the floor, or on the back seat of the car.'];
      const changing = ['diaper', 'On a changing table', 'Use the strap and keep a hand on {o}'];
      if (m < 2) return sub('errands', 'Errands and walks', 'Your first outings', 'A walk or a quick trip to a quiet store is a good start. Heading home early still counts.',
        `<h2 class="hub-h2">${F('Wherever you go')}</h2>` + steps([['clock', 'Go right after a feed', 'When {s’s} likely to be calm'], ['hand', 'Ask for clean hands', 'Before anyone holds {o}'], ['carrier', 'Wear {o} in a carrier', 'Easier than a car seat on a cart, and safer'], changing], 'Go right after a feed, ask for clean hands before anyone holds her, wear her in a carrier instead of putting the car seat on a cart, and on a changing table use the strap and keep a hand on her.')
        + good([['home', 'Crowds and germs, for now', 'Skip crowded indoor places and anyone who’s sick for the first couple of months.'], noTable, nursing() ? nurse : ['steth', 'At the doctor’s office', 'Ask if you can wait in the car until they call you.']]));
      return sub('errands', 'Errands and walks', 'Errands and walks', 'Stores, cafés, the park: most everyday places are fine now.',
        `<h2 class="hub-h2">${F('Wherever you go')}</h2>` + steps([['car', 'Car seat off the cart', 'Never set it on top of a shopping cart'], m >= 6 ? ['sit', 'Use the cart’s seat', 'With the strap on, once {s} {sit|sits} well'] : ['carrier', 'Carrier or stroller instead', 'For the store or a café'], changing, ['stroller', 'Asleep while you’re out?', 'Keep {o} in view, and move {o} to a flat bed when you can']], 'The car seat never goes on top of a shopping cart. Use a carrier, a stroller or the cart’s seat. On a changing table, use the strap and keep a hand on her. If she falls asleep, keep her in view and move her to a flat bed when you can.')
        + good(m >= 6 ? [noTable, ['bowl', 'Snacks out', 'Soft foods that squash between your fingers, while {s} {sit|sits} up and you watch. Not in the stroller or car.'], nursing() ? nurse : ['sit', 'High chairs', 'Use the straps every time.']]
          : [noTable, nursing() ? nurse : ['hand', 'Germs', 'Washing hands is still the best way to avoid colds.']]));
    }

    if (id === 'road') return sub('road', 'Road trips', 'Road trips', 'Plan a stop every couple of hours.',
      hubDayMarkers({ title: 'An example drive', events: [[9 * 60, 'car', 'Leave as a nap starts'], [11 * 60, 'bottle', 'Stop to feed and change'], [13 * 60, 'mat', 'Stop to feed and stretch'], [15 * 60, 'home', 'Arrive']], from: 8 * 60, to: 16 * 60, cat: CAT, caption: 'Leave at 9 as a nap starts, stop at 11 to feed and change, stop at 1 to feed and stretch, arrive at 3.' })
      + todo('At every stop', ['Take {o} out of the car seat for a stretch.', 'Pull over and take {o} out of the car seat to feed.', m >= 6 ? 'Snacks too: out of the car seat, at a stop.' : null])
      + good([['moon', 'Naps on the road', 'Naps in the car seat are fine while you drive. When you stop, move {o} to a crib or play yard.'], ['heart', 'Crying in the car', 'Crying won’t hurt {o} while {s’s} buckled in.'], m >= 6 ? ['toy', 'Toys in the car', 'Pack soft ones only. Hard toys can fly in a sudden stop.'] : ['home', 'Someone in the back', 'On long drives, an adult in the back seat helps.']]));

    if (id === 'fly') {
      const bf = nursing();
      return sub('fly', 'Flying', 'Flying with Maya', m < 3 ? 'Flying is generally fine after the first week, but waiting until 2–3 months is best if you can.' : 'Most of it comes down to where {s} {sit|sits}.',
        H().versus('Where will Maya sit?', ['Own seat', 'Safest, buckled into a car seat labeled for aircraft.'], ['On your lap', 'Often free under 2, but less safe if there’s turbulence.'])
        + strip('On the day', [['bottle', 'Security', bf && !formula() ? 'Breast milk is fine, even over 3.4 oz' : 'Milk and formula are fine, even over 3.4 oz'], ['stroller', 'At the gate', 'Leave the stroller there to be checked'], ['plane', 'Takeoff and landing', 'Nursing, a bottle or a pacifier eases {p} ears']], 'At security, milk and formula are fine even over 3.4 ounces. Check the stroller at the gate. At takeoff and landing, nursing, a bottle or a pacifier helps the ears.')
        + good([['notepad', 'Proof of age', 'Bring {p} birth certificate. Airlines often ask.'], ['carrier', 'A carrier in the airport', 'Handy for getting through. Take {o} out of it before takeoff and landing.'], bf ? ['fridge', 'Pumping', 'Your pump and ice packs can come through security.'] : ['bottle', 'An extra feed', 'Pack one more than the flight needs, in case of delays.']]));
    }

    if (id === 'abroad') return sub('abroad', 'Going abroad', 'Going abroad with Maya', 'Passports and shots come first, so start as soon as you book.',
      strip('Before you go', [['notepad', 'As soon as you book', 'Apply for {p} passport'], ['steth', 'A few weeks before', m < 6 ? 'Ask about shots, for {o} and for you' : 'Ask about shots and malaria medicine'], m >= 6 ? ['drop', 'At least 2 weeks before', 'A measles shot, given early for travel'] : null, ['home', 'Before you leave', 'Find a doctor near where you’ll stay']], 'Apply for the passport as soon as you book. A few weeks before, ask the pediatrician about shots. From 6 months, a measles shot is given early for travel, at least 2 weeks before. Find a doctor near where you’ll stay.')
      + tiles('While you’re there', [['Water', 'Sealed bottled, or boiled', m >= 6 ? 'For drinks, formula and washing bottles' : formula() ? 'For formula and washing bottles' : 'For washing bottles and pacifiers'], ['Mosquitoes', 'Netting', 'Over the crib and stroller'], m >= 6 ? ['Food', 'Cooked, or fruit you peel', 'Skip raw salads'] : null, m >= 6 ? ['Drinks', 'No ice', 'It’s often made with tap water'] : null])
      + good([['notepad', 'The passport', 'Apply in person with both parents. It can take several weeks.'], ['car', 'Car seats', 'Bring yours. Taxis abroad may not have one.'], ['thermo', 'What to pack', 'A thermometer, the medicines your pediatrician okays, and rehydration salts.']])
      + calls(['Call a doctor', m < 3 ? 'Fewer wet diapers, a dry mouth, or diarrhea that keeps going.' : 'A fever, fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', m < 3 ? 'A temperature of 100.4°F or higher, trouble breathing, or hard to wake.' : 'Any fever in a malaria area, trouble breathing, or hard to wake.']));

    if (id === 'away') {
      const arrive = m >= 6
        ? [['lock', 'Medicines up high', 'Check bags, nightstands and under sinks'], ['gate', 'Block the stairs', 'With a gate you bring or borrow'], ['bath', 'Watch {o} near water', 'An adult within arm’s reach, every second'], ['crib', 'Check the crib', 'Made after June 2011, away from blind cords']]
        : [['bag', 'Bags with medicines up high', 'Yours and your hosts’'], ['cord', 'Move the crib from blinds', 'So the cords can’t reach it'], ['crib', 'Check the crib', 'For broken or missing parts']];
      return sub('away', 'Staying away', 'Staying with family or in a hotel', m >= 6 ? 'Sleep the same way as at home, in {p} own crib or play yard, never your bed or a couch.' : 'Most homes and hotel rooms aren’t set up for babies. A quick look around when you arrive covers most of it.',
        `<h2 class="hub-h2">${F('When you arrive')}</h2>` + steps(arrive, m >= 6 ? 'Put medicines up high, block the stairs, watch her near water, and check the crib.' : 'Put bags with medicines up high, move the crib away from blinds, and check the crib.')
        + good(m >= 6 ? [['heart', 'Pets', 'Never leave {o} alone with a pet, even a gentle one.'], ['shield', 'Ask about guns', 'Any gun in the home should be locked and unloaded, with ammunition stored apart.'], ['bowl', 'Grandparents and treats', 'Share the food rules once, kindly: no honey, juice or cow’s milk to drink before 1.']]
          : [['crib', 'Where {s} {sleep|sleeps}', 'In {p} own crib or play yard, never your bed or a couch.'], ['home', 'Older cribs', 'Use a family crib only if it was made after June 2011.'], ['moon', 'A play yard', 'Use only its own mattress, with no extra padding.']]));
    }

    if (id === 'weather') {
      const view = weatherView || season();
      const seg = `<div class="hub-seg oa-seg" role="tablist">${[['hot', 'Hot days'], ['cold', 'Cold days']].map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaWeather('${k}')">${t}</button>`).join('')}</div>`;
      // Hot and cold days share one layout: four picture steps, then Good to know, then the call card.
      const hot = `<h2 class="hub-h2">${F('What to do')}</h2>` + steps([['clock', 'Go out early or late', 'When it’s cooler out'], m < 6 ? ['sun', 'Shade, not sunscreen', 'A little sunscreen only if there’s no shade'] : ['sun', 'Sunscreen', 'SPF 30 or more, every 2 hours'], ['bottle', 'Extra milk feeds', m < 6 ? 'No water before 6 months' : 'Plus sips of water from a cup'], ['car', 'Cool the car first', 'Then touch the car seat buckles: they can burn']], 'Go out early or late, keep her in the shade, offer extra milk feeds, and cool the car first.')
        + good([['thermo', 'How hot is too hot?', 'When the heat index is 90°F or more, keep outings short or stay in.'], m >= 2 ? ['leaf', 'Bugs', 'Spray with up to 30% DEET, or picaridin, onto your hands, then rub it on {p} skin. Keep it off {p} hands.'] : ['leaf', 'Bugs', 'No bug spray yet. Use netting over the stroller.'], ['bath', 'Pool or beach', 'Stay within arm’s reach in the water, every second.']])
        + calls(['Call your pediatrician', 'Any sunburn, or fewer wet diapers than usual.'], ['Call 911', 'Hot to the touch and floppy or hard to wake.']);
      const cold = `<h2 class="hub-h2">${F('What to do')}</h2>` + steps([['clock', 'Warm up the car first', 'So {s} can ride in thin layers'], ['car', 'In the car seat', 'Thin layers, then a blanket over the buckled straps'], ['shirt', 'One more layer on walks', 'Plus a hat and mittens'], ['hand', 'Check if {s’s} warm enough', 'Feel {p} chest. Cold hands are normal']], 'Warm up the car first. In the car seat, thin layers with a blanket over the buckled straps. On walks, one more layer than you. Feel her chest to check she’s warm enough.')
        + good([['snow', 'How cold is too cold?', 'There’s no set temperature. Keep walks short when it’s very cold or windy.'], ['carrier', 'In a carrier', 'Your coat can go over you both, with {p} face uncovered.'], ['home', 'Once you’re somewhere warm', 'Take off {p} hat and extra layers, so {s} {don’t|doesn’t} overheat.']])
        + calls(['Call your pediatrician', 'Skin that’s pale, gray or blistered after being out in the cold.'], ['Call 911', 'Cold to the touch and floppy or hard to wake.']);
      return sub(view, 'Hot and cold days', view === 'hot' ? 'Hot days out' : 'Cold days out', view === 'hot' ? 'Babies heat up faster than you do.' : 'Babies lose heat faster than you do.',
        seg + (view === 'hot' ? hot : cold));
    }

    if (id === 'sick') return sub('sick', 'On a trip', 'If Maya gets sick on a trip', 'Most travel bugs are mild. Packing a few things makes it calmer.',
      `<h2 class="hub-h2">${F('Before you go')}</h2>` + steps([['thermo', 'Pack a thermometer', 'And the medicines your pediatrician okays'], ['drop', 'Ask about rehydration salts', 'In case of diarrhea or vomiting'], ['notepad', 'Save a phone number', 'Your pediatrician’s after-hours line']], 'Pack a thermometer and medicines, ask your pediatrician about rehydration salts, and save the after-hours number.')
      + calls(['Call a doctor', 'A fever, fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', 'Hard to wake, trouble breathing, or blood in the poop.']));

    if (id === 'car' || id === 'bigger') {
      const install = `<h2 class="hub-h2">${F('Setting it up')}</h2>` + steps([['car', 'Pick one way to install it', 'Lower anchors or the seat belt, not both'], ['hand', 'Check it’s tight', 'Tug where it’s belted in: less than 1 inch of movement'], ['back', 'Set the recline', 'To the angle line on the seat'], ['shield', 'Buckle {o} in snugly', 'Harness straps at or below {p} shoulders']], 'Install it with the lower anchors or the seat belt, not both, so it moves less than 1 inch where it’s belted. Set the recline to the angle line. Buckle the straps at or below the shoulders.', true);
      if (m < 6) return sub('gear', 'Your gear', 'Car seat basics', 'Rear-facing in the back seat, never in front of an airbag.',
        install + hubFigure('carseat', CAT, 'Rear-facing in the back seat, chest clip level with the armpits, straps snug with no slack to pinch, and no puffy coat underneath.')
        + good([['clock', 'How long can {s} be in it?', 'There’s no set limit. On long drives, take breaks.'], ['notepad', 'Only what came with it', 'Skip add-on inserts and head supports.'], ['steth', 'A free check', 'A certified car seat technician can check it, usually for free.']]));
      return sub('gear', 'Your gear', 'Car seat basics', 'Rear-facing in the back seat, never in front of an airbag.',
        install
        + hubStageStrip({ title: 'Car seats, in order', numbered: true, items: [['car', 'Infant seat', 'Rear-facing, from birth'], ['car', 'Convertible seat', 'Still rear-facing'], ['car', 'Forward-facing', 'Only after its rear-facing limits, often age 2 or older']], cat: CAT, caption: 'Infant seat rear-facing from birth, then a convertible seat still rear-facing, and forward-facing only after its rear-facing limits, often age 2 or older.' })
        + good([['clock', 'Moving up from the infant seat', 'When {p} head is within an inch of the top, or {s’s} past its height or weight limit.'], ['steth', 'A free check', 'A certified car seat technician can check the new seat, usually for free.'], ['notepad', 'A used seat?', 'Only if you know its history: never in a crash, not expired or recalled.']]));
    }

    if (id === 'carry') return sub('gear', 'Your gear', 'Carrier basics', 'A quick check every time keeps {o} breathing easy.',
      hubFigure('carrier', CAT, 'In a carrier: face visible and close enough to kiss, chin off the chest, knees up in an M shape, back supported.')
      + good(m < 3 ? [['carrier', 'From day one', 'Wraps, ring slings and soft carriers all work, as long as {p} face stays above the fabric.'], ['hand', 'Snug enough', 'When you lean forward, {s} {stay|stays} against you without slumping.'], ['moon', 'Asleep in the carrier', 'Keep {p} face visible, and move {o} to a flat bed when you can.']]
        : m < 6 ? [['eye', 'Facing out', 'Once {p} head is steady, for short awake times. Turn {o} back in if {s} {get|gets} sleepy.'], ['hand', 'Snug enough', 'When you lean forward, {s} {stay|stays} against you without slumping.'], ['moon', 'Asleep in the carrier', 'Keep {p} face visible, and move {o} to a flat bed when you can.']]
        : [['carrier', 'A backpack carrier', 'Once {s} {sit|sits} well on {p} own. Keep every strap fastened.'], ['hand', 'Picking things up', 'Bend at the knees, not the waist.'], ['fridge', 'Not while cooking', 'Keep away from the stove and hot drinks.']]));

    if (id === 'stroller') return sub('gear', 'Your gear', 'Stroller basics', 'A few habits keep every walk safe.',
      hubFigure(m < 6 ? 'stroller' : 'strollerUp', CAT, 'Harness on every time, brakes on when you stop, no bags on the handles and no blanket over the top.')
      + good([['sun', 'Why no blanket over the top', 'It traps heat. Use the canopy instead.'], ['snow', 'On cold days', 'A footmuff or a blanket tucked around {o} is fine.'], m < 6 && ['car', 'A car seat on the frame', 'Listen for the click, then tug to check it’s locked on.']]));

    if (id === 'bag') return sub('gear', 'Your gear', 'Packing the diaper bag', 'Tap each thing as it goes in. The list follows how Maya is fed.',
      bagList(m) + good([formula() && ['bottle', 'Mixing formula', 'Room temperature is fine. Use it within 2 hours of mixing.'], formula() && ['clock', 'Leftover formula', 'Once a feed starts, use it within an hour, then toss the rest.'], nursing() && ['fridge', 'Pumped milk', 'Keeps 4 hours at room temperature, or a day in a cooler with frozen ice packs.'], ['sun', 'On hot days', 'Keep milk in a cooler with ice packs, never in a hot car.']]));

    if (id === 'snacks') return detail('errands');

    if (id === 'after1') return sub('gear', 'After the first birthday', 'Rear-facing for as long as the seat allows', 'Rear-facing protects the head and neck best.',
      todo('What to do', ['Keep Maya rear-facing until the seat’s rear-facing height or weight limit, often age 2 or older.', 'Legs touching the seat back is fine.']));
    return null;
  }
  window.oaWeather = function (k) { weatherView = k; const y = scrollY; render(); scrollTo(0, y); };

  /* ---------- routes ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a] = p.split(':');
    if (cat === CAT && screen === 's') return outAndAbout();
    if (cat === CAT && screen === 'd') { const pg = detail(a); if (pg) return pg; }
    return baseRoute(p);
  };
})();
