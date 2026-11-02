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
  // Stages follow age: what changes for outings is germs and gear at first, then longer trips, then a sitting, snacking, moving baby.
  if (window.STAGE_TABLE) STAGE_TABLE[CAT] = { kind: 'calendar', fixed: true, stages: [
    { label: 'First outings', age: '0–2 months' },
    { label: 'Getting out more', age: '2–6 months' },
    { label: 'On the go', age: '6–12 months' }
  ] };
  if (typeof YEAR_STORIES !== 'undefined' && !YEAR_STORIES[CAT]) YEAR_STORIES[CAT] = YEAR_STORIES['Daily rhythm'];
  if (typeof CAT_ICON_SCENE !== 'undefined') CAT_ICON_SCENE[CAT] = 0;
  const baseTopic = displayTopic;
  window.displayTopic = displayTopic = t => t === CAT ? 'Outings and travel' : baseTopic(t);

  /* ---------- the baby ---------- */
  const STAGES = STAGE_TABLE[CAT].stages;
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
    const v = stageNow();
    return { title: ['Short outings, right after a feed', 'Longer trips fit between feeds now', 'Snacks, a bigger car seat and busier days'][v], body: ['Car seat, carrier and keeping germs away.', 'Road trips, flights and sleeping away.', 'Sitting up, snacking and moving.'][v], key: 'travel' };
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
    abroad: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'],
    away: ['#f6e8f3', '#7a4f74', '#e3b8cf', '#f4d6c4'],
    weather: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'],
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
    ['errands', 'Errands and walks', ['Crowds, the doctor, the car', 'The store, the park, a café', 'Stores, cafés and restaurants']],
    ['road', 'Road trips', ['Long drives and stops']],
    ['fly', 'Flying', ['Booking, security, the flight']],
    ['away', 'Staying away', ['Family, friends or a hotel']],
    ['weather', 'Hot and cold days', ['Walks, the car and the stroller']],
    ['abroad', 'Going abroad', ['Passport, shots, food and water']]
  ];
  const placeSub = (id, subs, v) => {
    if (id === 'away' && v === 2) return moving() ? 'Babyproof it in 10 minutes' : 'Family, friends or a hotel';
    if (id === 'weather') return season() === 'cold' ? 'Walks and the car seat' : 'Heat, bugs and the pool';
    return subs[Math.min(v, subs.length - 1)];
  };
  const places = v => `<h2 class="hub-h2">${F('Where are you headed?')}</h2><div class="oa-places">${PLACES.map(([id, label, subs]) => { const c = PAL[id]; return `<button class="oa-place" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="${open(id)}"><span class="oa-place-art">${SHAPE[id](c)}</span><b>${F(id === 'errands' && v === 0 ? 'First outings' : label)}</b><small>${F(placeSub(id, subs, v))}</small></button>`; }).join('')}</div>`;
  const GEAR_C = { car: ['#e7effc', '#46638c'], stroller: ['#e6f5ec', '#356651'], carrier: ['#fdeef2', '#a24d6a'], bag: ['#fff3dc', '#8a6a2a'], snack: ['#fdeee6', '#9a5a3c'] };
  const gearRow = (icon, key, title, sub, id, chip) => `<button class="hub-row oa-row" style="--hl-bg:${GEAR_C[key][0]};--hl-ink:${GEAR_C[key][1]}" onclick="${open(id)}"><span class="oa-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(sub)}</small>${chip ? `<span class="hub-chip">${F(chip)}</span>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  function gear(v) {
    const n = bagItems(ageNow()).length, on = bagItems(ageNow()).filter(i => bagGet().includes(i[1])).length;
    return `<h2 class="hub-h2">${F('Your gear')}</h2><div class="hub-list">`
      + gearRow('car', 'car', 'Car seat', v < 2 ? 'How it should fit' : 'Time for a bigger seat?', v < 2 ? 'car' : 'bigger')
      + gearRow('stroller', 'stroller', 'Stroller', 'Harness, brakes and shade', 'stroller')
      + gearRow('carrier', 'carrier', 'Carrier', v === 0 ? 'Wraps, slings and soft carriers' : v === 1 ? 'When {s} can face out' : 'Front and back carriers', 'carry')
      + gearRow('bag', 'bag', 'Diaper bag', 'Packed for how Maya is fed', 'bag', on ? `${on} of ${n} packed` : '')
      + (v === 2 ? gearRow('bowl', 'snack', 'Snacks', 'What to pack, and when to offer them', 'snacks') : '')
      + `</div>`;
  }
  function outAndAbout(selected = null) {
    const now = stageNow(), v = STAGES[selected] ? Number(selected) : now, h = H(), browsing = live() && v !== now;
    const pills = h.pills('Outings and travel by age', STAGES.map((st, i) => ({ label: st.label, age: st.age, on: i === v, now: live() && i === now, onclick: `openPage('chg:${CAT}:s:${i}')`, change: '' })), CAT);
    const HERO = [
      ['Short outings are good for you both', 'Go right after a feed, and skip crowds and anyone who’s sick for now.'],
      ['Longer trips fit between feeds now', 'Feeds spread out, so a long drive or a first flight gets easier.'],
      ['Outings get busier and more fun', 'Snacks come along now, and once {s’s} moving, babyproof wherever you stay.']
    ][v];
    let b = `<header class="hub-hero oa-hero"><p class="hub-eyebrow">${F(STAGES[v].label + ' · ' + STAGES[v].age)}</p><h1>${F(HERO[0])}</h1><p class="hub-lead">${F(HERO[1])}</p></header>`;
    b += places(v) + gear(v);
    b += h.versus('In the car', ['Every time', 'Look in the back seat before you walk away.'], ['Never', 'Leave Maya alone in the car, even for a minute.']);
    const nx = STAGES[v + 1];
    if (nx) b += h.next(`Coming up around ${[2, 6][v]} months`, ['Longer trips fit between feeds', 'Snacks, a bigger car seat and busier days'][v], `openPage('chg:${CAT}:s:${v + 1}')`);
    else b += h.next('After the first birthday', 'Rear-facing for as long as the seat allows', open('after1'));
    if (browsing) b = `<div class="hub-preview"><span>${v > now ? 'Preview' : 'Looking back'} · ${F(STAGES[v].age)}</span><button onclick="openPage('topic:${CAT}')">${F('Back to Maya’s stage')}</button></div>` + b;
    b += h.note('Car seats, carriers and strollers each have their own limits. Check the label and the manual.');
    return `<div class="quiet-category hub-page" data-overview="${CAT}" data-travel-stage="${v}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${pills}${b}</div>`;
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
      ['diaper', 'diapers', 'Diapers', m < 3 ? 'About 1 an hour, plus 2' : m < 9 ? '1 every 2 hours, plus 2' : '1 every 3 hours, plus 2'],
      ['towel', 'wipes', 'Wipes and a changing pad', ''],
      ['shirt', 'clothes', 'A change of clothes', 'For you both'],
      ['heart', 'burp', 'Burp cloths', f !== 'Formula' ? 'And a nursing cover, if you like one' : ''],
      f !== 'Formula' ? ['fridge', 'pumped', 'Pumped milk in a cooler bag', 'If you’re bringing some'] : null,
      f !== 'Breast milk' ? ['bottle', 'formula', 'Formula, powder and water packed apart', 'Mix when {s’s} hungry'] : null,
      f !== 'Breast milk' ? ['cup', 'bottles', 'Clean bottles', 'One for each feed, plus one'] : null,
      m < 12 ? ['pacifier', 'pacifier', 'A pacifier, if {s} {use|uses} one', 'And a spare'] : null,
      ['sun', 'hat', 'A hat', 'Sun hat or warm hat'],
      ['sack', 'layer', 'An extra layer', season() === 'cold' ? 'A blanket for over the straps' : 'For air-conditioned places'],
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
       → one "What to do" card, if there's an action list
       → "Good to know": rows with an icon, a plain title and one line
       → "Normal, or time to call?" where it applies.
     Section headings are the app's own (sentence case), tiles and icons take the page's one color, and nothing links onward.
     A fact lives on one page only. */
  const tiles = (heading, ts) => `<h2 class="hub-h2">${F(heading)}</h2>${H().tiles(ts.filter(Boolean))}`;
  const steps = (items, caption, numbered = false) => hubIconSteps(items.filter(Boolean), CAT, F(caption), numbered);
  const strip = (title, items, caption) => hubStageStrip({ title, items: items.filter(Boolean), numbered: true, cat: CAT, caption });
  const good = (rows, heading = 'Good to know') => { const r = rows.filter(Boolean); return r.length ? H().list(heading, r.map(([icon, title, s]) => H().row({ icon, cat: CAT, title, sub: s }))) : ''; };
  const feedingOut = () => nursing() && formula() ? 'Nurse wherever you’re comfortable. For bottles, bring powder and water separately and mix when {s’s} hungry.'
    : nursing() ? 'Nurse wherever you’re comfortable. A parked car or a quiet corner works too.' : 'Bring powder and water separately, and mix when {s’s} hungry.';

  function detail(id) {
    const h = H(), m = ageNow();

    if (id === 'errands') {
      if (m < 2) return sub('errands', 'First outings', 'Your first outings', 'Going out is good for you both. Keep the first trips short and close to home.',
        steps([['clock', 'Go right after a feed', 'When {s’s} likely to be calm'], ['hand', 'Wash hands first', 'Anyone who holds {o}'], ['carrier', 'Use a carrier or stroller', 'The car seat never goes on a shopping cart']], 'Go right after a feed, ask anyone who holds her to wash their hands first, and use a carrier or stroller in the store.')
        + good([['home', 'Quiet places, for now', 'Skip busy indoor places and anyone who’s sick for the first couple of months.'], ['steth', 'At the doctor’s office', 'Ask for a separate waiting area for checkups, or wait in the car until they call you.'], ['bottle', 'Feeding while you’re out', feedingOut()], ['car', 'Crying in the car', 'Crying won’t hurt {o} while {s’s} buckled in. Keep driving calmly, or pull over if you need a minute.']]));
      return sub('errands', 'Errands and walks', 'Errands and walks', 'Most everyday places are fine now. A few habits make them easier.',
        steps([['car', 'Car seat stays in the car', 'Never on top of a shopping cart'], m >= 6 ? ['sit', 'Use the cart’s seat', 'With the strap on, once {s} {sit|sits} well'] : ['carrier', 'Use a carrier or stroller', 'For the store'], ['stroller', 'Naps out', 'In a stroller that lies flat']], 'The car seat stays in the car, never on a cart. Use a carrier, a stroller or the cart’s seat, and a stroller that lies flat for naps.')
        + good([['home', 'Busy places', 'Washing hands and keeping away from anyone who’s sick still help most.'], ['bottle', 'Feeding while you’re out', feedingOut()], m >= 6 && ['sit', 'High chairs when you eat out', 'Use the straps, and wipe the tray before food goes on it.']]));
    }

    if (id === 'road') return sub('road', 'Road trips', 'Plan a road trip', 'Long drives go better with a stop about every 2 hours.',
      hubDayMarkers({ title: 'An example drive', events: [[9 * 60, 'car', 'Leave as a nap starts'], [11 * 60, 'bottle', 'Stop to feed and change'], [13 * 60, 'mat', 'Stop to change and stretch'], [15 * 60, 'home', 'Arrive']], from: 8 * 60, to: 16 * 60, cat: CAT, caption: 'Leave at 9 as a nap starts, stop at 11 to feed and change, stop at 1 to change and stretch, arrive at 3.' })
      + todo('At every stop', ['Take {o} out of the car seat for a feed, a change and a stretch.', 'Feed only when the car is stopped, never while you’re moving.', 'For long drives, an adult in the back seat helps.'])
      + good([['moon', 'Naps on the road', 'Fine in the car seat while you drive. Once you arrive, move {o} to a flat sleep space.'], m >= 6 && ['toy', 'Keeping {o} busy', 'Songs, a book or a soft toy. Only soft toys: hard ones can fly in a sudden stop.'], m >= 6 && ['bowl', 'Snacks', 'At a stop, or with an adult beside {o}. Never handed back while you drive.'], m >= 6 && ['car', 'Outgrowing the car seat?', 'Install the next one and have it checked before the trip, not the night before.']]));

    if (id === 'fly') {
      const bf = nursing(), ff = formula();
      return sub('fly', 'Flying', 'Fly with Maya', m < 3 ? 'Waiting until 2–3 months is best if you can. After that, most of it is one choice when you book.' : 'Most of it comes down to one choice when you book.',
        h.versus('Where will Maya sit?', ['Own seat', 'Safest. Buckle {o} into a car seat labeled for aircraft.'], ['On your lap', 'Often free under 2, but turbulence can throw a baby from your arms.'])
        + strip('On the day', [['bottle', 'Security', bf && !ff ? 'Milk over 3.4 oz is OK' : 'Milk and formula over 3.4 oz are OK'], ['stroller', 'At the gate', 'Check the stroller there'], ['plane', 'Takeoff and landing', 'A feed or a pacifier helps {p} ears'], ['car', 'The ride from the airport', 'Bring the car seat']], 'At security, milk and formula over 3.4 ounces are allowed. Check the stroller at the gate. At takeoff and landing, a feed or a pacifier helps the ears. Bring the car seat for the ride from the airport.')
        + good([['notepad', 'Proof of age', 'If {s} {fly|flies} on your lap, bring {p} birth certificate or a copy. Airlines often ask.'], ['fridge', 'Milk at security', `${bf && ff ? 'Breast milk, formula and water for mixing' : bf ? 'Breast milk, your pump' : 'Formula and water for mixing'} and ice packs are all allowed. Take them out and tell the officer.`], bf && ['mouth', 'Nursing on board', 'On your lap, you can nurse through takeoff and landing. Airports have private rooms for nursing and pumping, too.'], ['clock', 'Time zones', 'For a short trip, let naps and bedtime drift with the new time. For a longer stay, shift them a little each day, and again when you’re home.'], ['steth', 'Shots', 'Keep {p} routine shots on schedule. They help protect {o} in busy airports.']]));
    }

    if (id === 'abroad') return sub('abroad', 'Going abroad', 'Going abroad with Maya', 'A trip abroad adds a passport and a doctor’s visit, so start as soon as you book.',
      strip('Before you go', [['notepad', 'As soon as you book', 'Apply for {p} passport'], ['steth', 'A few weeks before', 'See the pediatrician or a travel clinic'], m >= 6 ? ['drop', '2 weeks before, at the latest', 'An early measles shot'] : null, ['home', 'Before you land', 'Find a doctor where you’ll stay']], 'Apply for the passport as soon as you book. See the pediatrician or a travel clinic a few weeks before. From 6 months, get an early measles shot at least 2 weeks before. Find a doctor where you’ll stay.')
      + tiles('While you’re there', [['Water', 'Bottled or boiled', formula() ? 'For formula and washing bottles' : 'For anything besides nursing'], ['Food', m >= 6 ? 'Cooked, or fruit you peel' : 'Milk only, for now', m >= 6 ? 'Skip ice and raw salads' : 'Nursing or formula, as at home'], ['Mosquitoes', m < 2 ? 'Netting, no spray' : 'Netting and bug spray', m < 2 ? 'No bug spray under 2 months' : 'With DEET or picaridin'], ['Car seat', 'Bring yours', 'Plan rides with family or a car service']])
      + good([['notepad', 'The passport', 'Apply in person with both parents and one photo. It can take several weeks, so pay to expedite if time is short.'], ['steth', 'Other shots', 'Some places need more, like hepatitis A from 6 months, or malaria medicine. The doctor will check where you’re going.'], ['thermo', 'What to pack', 'A thermometer, the medicines your pediatrician okays with doses for {p} weight, and rehydration salts if they suggest them.']])
      + h.versus('If {s} {get|gets} sick there', ['Call a doctor', 'Fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', 'Hard to wake, blood in the poop, or any fever under 3 months.']));

    if (id === 'away') return sub('away', 'Staying away', 'Stay with family or in a hotel', 'Sleep the same way as at home: on the back, in an empty crib.',
      tiles('Where {s} {sleep|sleeps}', [['A play yard', 'Use its own mattress', 'Extra mattresses or pads can leave gaps'], ['An older crib', 'Only if made after June 2011', 'Older cribs don’t meet today’s standards'], ['A hotel crib', 'Check it before you use it', 'For broken parts, pillows or bumpers'], ['Your room', 'Not your bed', '{P} own sleep space, even on vacation']])
      + (m >= 6 ? `<h2 class="hub-h2">${F(moving() ? 'When you arrive' : 'Once {s’s} moving, when you arrive')}</h2>` + steps([['lock', 'Put medicines up high', 'Check bags and nightstands too'], ['gate', 'Gate the stairs', 'And close bathroom doors'], ['bath', 'Watch {o} near water', 'One adult at the pool, every second'], ['heart', 'Keep pets apart', 'Never leave them alone together']], 'Put medicines up high, gate the stairs, have one adult watch at the pool, and never leave the baby alone with a pet.') : '')
      + good([m >= 6 && ['crib', 'Once {s} {pull|pulls} up', 'Take out a play yard’s bassinet insert, so {s} {sleep|sleeps} on the lowest level.'], ['moon', 'Naps somewhere new', 'Bring {p} sleep sack and anything that’s part of bedtime. A few off days are normal.'], ['bag', 'Packing for a few nights', 'Pack what you’d take for a day out, for each day, plus a few extra.'], m >= 6 && ['bowl', 'Grandparents and treats', 'Say the rules once, kindly: no honey or cow’s milk to drink before 1, no whole grapes, nuts or popcorn, and no toys with small parts.']]));

    if (id === 'weather') {
      const view = weatherView || season();
      const seg = `<div class="hub-seg oa-seg" role="tablist">${[['hot', 'Hot days'], ['cold', 'Cold days']].map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaWeather('${k}')">${t}</button>`).join('')}</div>`;
      const hot = tiles('At Maya’s age', [['Sun', m < 6 ? 'Shade first' : 'Shade and SPF 30', m < 6 ? 'A little sunscreen only if there’s no shade' : 'Every 2 hours, and after water'], ['Drinks', m < 6 ? 'Extra milk feeds' : 'Milk and sips of water', m < 6 ? 'No water before 6 months' : 'Water from a cup'], ['Bugs', m < 2 ? 'Netting, no spray' : 'DEET or picaridin', m < 2 ? 'No bug spray under 2 months' : 'Never on {p} hands'], ['Clothes', 'One light layer', 'And a wide-brimmed hat']])
        + todo('What to do', ['Go out early or late. When the heat index is 90°F or more, keep it short or stay in.', 'Shade the stroller with its canopy, never a blanket: a blanket traps heat.', 'Cool the car first, and touch the buckles before you buckle {o} in.'])
        + good([['bath', 'Pool or beach', 'Stay within arm’s reach in the water, every second. Take {o} out if {s} {shiver|shivers}.'], ['fridge', 'Milk in the heat', 'Keep it in a cooler bag out of the sun, never in a hot car.'], ['thermo', 'Too hot?', 'Sweaty, flushed or a hot chest. Move to the shade, take off a layer and offer a feed.'], m >= 2 && ['leaf', 'Bug spray tips', 'Skip oil of lemon eucalyptus, and sprays mixed with sunscreen.']])
        + h.versus('Normal, or time to call?', ['Call your pediatrician', 'Any sunburn, or fewer wet diapers than usual.'], ['Call 911', 'Hot to the touch and hard to wake or floppy.']);
      const cold = steps([['car', 'In the car seat', 'Thin layers, then a blanket over the straps'], ['shirt', 'On walks', 'One more layer than you, a hat and mittens'], ['hand', 'Check {p} chest', 'Or the back of {p} neck, not {p} hands']], 'In the car seat, thin layers with a blanket over the straps. On walks, one more layer than you. Check the chest or neck, not the hands.')
        + good([['snow', 'How cold is too cold?', 'There’s no set temperature. Keep walks short when it’s very cold or windy.'], ['stroller', 'In the stroller', 'A footmuff or a blanket tucked around {o} is fine. Just nothing draped over the top.'], ['carrier', 'In a carrier', 'Your coat can go over you both. Check that {s} {don’t|doesn’t} get too warm.'], ['car', 'Before you leave', 'Warm up the car first, so {s} can ride in thin layers.']])
        + h.versus('Normal, or time to call?', ['Head inside and warm up', 'Shivering, or red cheeks, ears or fingers.'], ['Get help right away', 'Skin that’s pale, gray or blistered, or {s} {seem|seems} very sleepy.']);
      return sub('weather', 'Hot and cold days', view === 'hot' ? 'Hot days out' : 'Cold days out', view === 'hot' ? 'Babies heat up faster than you do. Shade and timing do most of the work.' : 'Babies lose heat faster than you do. Layers and short trips do most of the work.',
        seg + (view === 'hot' ? hot : cold));
    }

    if (id === 'sick') return sub('sick', 'On a trip', 'If Maya gets sick on a trip', 'Most travel bugs are mild. A few things packed makes it calmer.',
      steps([['thermo', 'Pack a thermometer', 'And medicines, with doses for {p} weight'], ['drop', 'Ask about rehydration salts', 'For diarrhea or vomiting'], ['notepad', 'Save your numbers', 'Pediatrician’s after-hours line, insurance card']], 'Pack a thermometer and medicines, ask your pediatrician about rehydration salts, and save the after-hours number.')
      + h.versus('Normal, or time to call?', ['Call a doctor', 'Fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', 'Hard to wake, blood in the poop, or any fever under 3 months.']));

    if (id === 'car') return sub('gear', 'Your gear', 'Buckle in right, every ride', 'A car seat only protects Maya when it fits snugly, every ride.',
      hubFigure('carseat', CAT, 'Rear-facing in the back seat, chest clip level with the armpits, straps snug with no slack to pinch, and no puffy coat underneath.')
      + good([['clock', 'How long can {s} be in it?', 'There’s no exact limit. On long drives, take a break about every 2 hours.'], ['moon', 'Only for the car', 'It’s for travel, not sleep. Once you arrive, move {o} to a flat sleep space.'], ['car', 'Every ride', 'Taxis and rideshares too, however short.'], ['shield', 'Nothing extra', 'Skip add-on inserts, head supports and covers that go under the straps.'], ['steth', 'A free check', 'Many fire stations and hospitals will check how it’s installed.']]));

    if (id === 'carry') return sub('gear', 'Your gear', 'Wear Maya safely', 'Holding Maya close is lovely for you both. A quick check keeps {o} breathing easy.',
      hubFigure('carrier', CAT, 'In a carrier: face visible and close enough to kiss, chin off the chest, knees up in an M shape, back supported.')
      + good([m < 4 && ['carrier', 'From day one', 'Wraps, slings and soft carriers all work. Take extra care with slings under 4 months.'], ['hand', 'Snug enough', 'When you lean forward, {s} {stay|stays} against you without slumping.'], m < 3 && ['home', 'Practice at home first', 'Try it a few times with someone to help, before your first outing.'], m >= 2 && m < 6 && ['eye', 'Facing out', 'Once {s} {hold|holds} {p} head up steadily, usually around 4 months. Turn {o} back in for naps.'], m >= 6 && ['carrier', 'A backpack carrier', 'Once {s} {sit|sits} well on {p} own. Bend at the knees, not the waist.'], ['fridge', 'Not while cooking', 'Skip the stove and hot drinks while you’re wearing {o}.']]));

    if (id === 'stroller') return sub('gear', 'Your gear', 'Stroll safely', m < 6 ? 'Young babies ride lying back. A few habits keep every walk safe.' : 'Once Maya sits steadily, {s} can ride sitting up.',
      hubFigure(m < 6 ? 'stroller' : 'strollerUp', CAT, 'Harness on every time, brakes on when you stop, no bags on the handles and no blanket over the top.')
      + good([['sun', 'Shade', 'Use the canopy or a stroller shade. A blanket over the top traps heat.'], ['snow', 'On cold days', 'A footmuff or a blanket tucked around {o} is fine.'], ['car', 'A car seat on the stroller frame', 'Fine for walks. Once you’re home, move {o} to a flat sleep space.']]));

    if (id === 'bag') return sub('gear', 'Your gear', 'Pack the diaper bag', 'Tap each thing as it goes in. The list follows how Maya is fed.',
      bagList(m) + good([nursing() && ['fridge', 'Pumped milk', 'Up to 4 hours at room temperature, or 24 hours in a cooler bag with ice packs.'], formula() && ['bottle', 'Formula', 'Mix when {s’s} hungry. Use it within 2 hours, or within 1 hour of starting the feed.'], ['bag', 'Keep it packed', 'Restock as soon as you’re home, so the next outing is grab and go.']], 'Keeping milk safe'));

    if (id === 'bigger') return sub('gear', 'Your gear', 'Moving to a bigger car seat', 'Most babies outgrow the infant seat in the first year. It’s about height or weight, not age.',
      hubFigure('outgrown', CAT, 'The infant seat is outgrown when the head is within an inch of the top of the shell, or past the height or weight on the label.')
      + hubStageStrip({ title: 'Car seats, in order', numbered: true, items: [['car', 'Infant seat', 'Rear-facing, from birth'], ['car', 'Convertible seat', 'Still rear-facing'], ['car', 'Forward-facing', 'Only after its rear-facing limits, often 2+']], cat: CAT, caption: 'Infant seat rear-facing from birth, then a convertible seat still rear-facing, and forward-facing only after its rear-facing limits, often age 2 or older.' })
      + good([['steth', 'Get it checked', 'Many fire stations and hospitals will check the new seat for free.'], ['notepad', 'A used seat?', 'Only if you know it’s never been in a crash and isn’t past its expiration date.']]));

    if (id === 'snacks') return sub('gear', 'On the go', 'Snacks and drinks on the go', 'Snacks make outings easier. A little planning keeps them safe.',
      steps([['bowl', 'Pack soft foods', 'That squash between your fingers'], ['cup', 'Bring water in a cup', 'No juice before 1'], ['car', 'Offer them at a stop', 'Never handed back while you drive']], 'Pack soft foods and water in a cup, and offer them at a stop, not while driving.')
      + good([['shield', 'Leave at home', 'Whole grapes, nuts and popcorn, which are easy to choke on.']]));

    if (id === 'after1') return sub('gear', 'After the first birthday', 'Rear-facing for as long as the seat allows', 'Turning forward at 1 isn’t a milestone. Rear-facing protects the head and neck best.',
      todo('What to do', ['Keep Maya rear-facing until the seat’s rear-facing height or weight limit, often age 2 or older.', 'Legs touching the seat back is fine, and not a reason to turn forward.']));
    return null;
  }
  window.oaWeather = function (k) { weatherView = k; const y = scrollY; render(); scrollTo(0, y); };

  /* ---------- routes ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a] = p.split(':');
    if (cat === CAT && screen === 's') return outAndAbout(Number(a));
    if (cat === CAT && screen === 'd') { const pg = detail(a); if (pg) return pg; }
    return baseRoute(p);
  };
})();
