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
      + gearRow('car', 'car', 'Car seat', v < 2 ? 'The fit, and taxis' : 'Time for a bigger seat?', v < 2 ? 'car' : 'bigger')
      + gearRow('stroller', 'stroller', 'Stroller', 'Harness, brakes and shade', 'stroller')
      + gearRow('carrier', 'carrier', 'Carrier', v < 2 ? 'Wraps, slings and soft carriers' : v === 1 ? 'When {s} can face out' : 'Front or back', 'carry')
      + gearRow('bag', 'bag', 'Diaper bag', 'Packed for how Maya is fed', 'bag', on ? `${on} of ${n} packed` : '')
      + (v === 2 ? gearRow('bowl', 'snack', 'Snacks', 'Soft foods, at a stop', 'snacks') : '')
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
     Each page does one job and ends there: no links onward, so it's never a rabbit hole.
     Visuals carry the answer (tiles for "what applies at Maya's age", picture steps, a strip for a trip in order),
     with at most one "What to do" card and one short list. A fact lives on one page only. */
  // Tiles for what applies now, each in its own soft color with a small icon: [icon, label, big, small, palette key].
  const nowTiles = (title, items) => `${title ? `<h2 class="oa-sec">${F(title)}</h2>` : ''}<div class="oa-now is-${items.filter(Boolean).length}">${items.filter(Boolean).map(([icon, label, big, small, k]) => { const c = PAL[k] || PAL.gear; return `<div style="--oa-bg:${c[0]};--oa-ink:${c[1]}"><span class="oa-now-art">${hubArt(icon, CAT)}</span><small>${F(label)}</small><b>${F(big)}</b>${small ? `<span>${F(small)}</span>` : ''}</div>`; }).join('')}</div>`;
  const steps = (items, caption, numbered = false) => hubIconSteps(items.filter(Boolean), CAT, F(caption), numbered);
  const strip = (title, items, caption) => hubStageStrip({ title, items: items.filter(Boolean), numbered: true, cat: CAT, caption });
  function detail(id) {
    const h = H(), m = ageNow();

    if (id === 'errands') {
      if (m < 2) return sub('errands', 'First outings', 'Your first outings', 'Going out is good for you both. Keep the first trips short and close to home.',
        steps([['clock', 'Right after a feed', 'When {s’s} calm'], ['hand', 'Hands washed', 'Before anyone holds {o}'], ['carrier', 'Carrier or stroller', 'The car seat stays in the car']], 'Go right after a feed, ask for hands washed before anyone holds her, and use a carrier or stroller in the store.')
        + lines([['Crowds, for now', 'Quiet places are fine. Skip busy indoor places and anyone who’s sick for the first couple of months.'], ['At the doctor’s office', 'Ask if there’s a separate waiting area for checkups, or wait in the car until they call you.'], ['Crying in the car', 'Crying won’t hurt {o} while {s’s} buckled in. Keep driving calmly, or pull over if you need a minute.']]));
      return sub('errands', 'Errands and walks', 'Errands and walks', 'Most everyday places are fine now.',
        steps([['car', 'Car seat stays in the car', 'Never on a shopping cart'], m >= 6 ? ['sit', 'Cart seat or high chair', 'Strap on, once {s} {sit|sits} well'] : ['carrier', 'Carrier or stroller', 'In the store'], ['stroller', 'Naps out', 'A flat stroller, or the carrier']], 'The car seat stays in the car, never on a cart. Use a carrier, stroller or the cart’s seat, and a flat stroller for naps.'));
    }

    if (id === 'road') return sub('road', 'Road trips', 'Plan a road trip', 'Long drives go better with a stop about every 2 hours.',
      hubDayMarkers({ title: 'An example drive', events: [[9 * 60, 'car', 'Leave as a nap starts'], [11 * 60, 'bottle', 'Feed and change'], [13 * 60, 'mat', 'Change and stretch'], [15 * 60, 'home', 'Arrive']], from: 8 * 60, to: 16 * 60, cat: CAT, caption: 'Leave at 9 as a nap starts, stop at 11 to feed and change, stop at 1 to change and stretch, arrive at 3.' })
      + todo('At every stop', ['Take {o} out of the car seat for a feed, a change and a stretch.', 'Feed only when the car is stopped.', m >= 6 ? 'Snacks at a stop too, and only soft toys in the car.' : 'An adult in the back seat helps on long drives.'])
      + (m >= 6 ? lines([['Outgrowing the car seat?', 'Install the next one and have it checked before the trip, not the night before.']]) : ''));

    if (id === 'fly') {
      const bf = nursing(), ff = formula();
      return sub('fly', 'Flying', 'Fly with Maya', m < 3 ? 'Waiting until 2–3 months is best if you can. After that, most of it is one choice when you book.' : 'Most of it is one choice when you book.',
        h.versus('Where will Maya sit?', ['Own seat', 'Safest. Buckle {o} into a car seat labeled for aircraft.'], ['On your lap', 'Often free under 2, but turbulence can throw a baby from your arms. Bring a birth certificate.'])
        + strip('On the day', [['bottle', 'Security', bf && ff ? 'Milk and formula over 3.4 oz are fine' : bf ? 'Milk and your pump are fine' : 'Formula and water are fine'], ['stroller', 'The gate', 'Check the stroller there'], ['plane', 'Up and down', 'A feed or pacifier helps {p} ears']], 'At security, milk and formula over 3.4 ounces are allowed; tell the officer. Gate-check the stroller. At takeoff and landing, a feed or pacifier helps the ears.')
        + lines([['Time zones', 'For a short trip, let naps and bedtime drift with the new time. For a longer stay, shift them a little each day, and again when you’re home.'], ['Rides from the airport', 'Bring the car seat. Taxis and rideshares need it too.']]));
    }

    if (id === 'abroad') return sub('abroad', 'Going abroad', 'Going abroad with Maya', 'A trip abroad adds a passport and a doctor’s visit, so start as soon as you book.',
      strip('Before you go', [['notepad', 'Now', 'Apply for {p} passport'], ['steth', 'A few weeks out', 'Pediatrician or travel clinic'], m >= 6 ? ['drop', '2+ weeks out', 'An early measles shot'] : null, ['home', 'Before you land', 'Find a doctor there']], 'Apply for the passport now, see the pediatrician or a travel clinic a few weeks out, get the early measles shot at least 2 weeks before from 6 months, and find a doctor where you’re staying.')
      + lines([['The passport', 'Apply in person with both parents and one photo. It can take several weeks, so pay to expedite if time is short.'], ['Pack', 'A thermometer, the medicines your pediatrician okays with doses for {p} weight, and oral rehydration salts if they suggest them.']])
      + nowTiles('While you’re there', [['drop', 'Water', 'Bottled or boiled', formula() ? 'For formula and washing bottles' : 'For anything besides nursing', 'road'], m >= 6 ? ['bowl', 'Food', 'Cooked or peeled', 'Skip ice and raw salads', 'abroad'] : null, ['sun', 'Mosquitoes', m < 2 ? 'Netting only' : 'Netting and spray', m < 2 ? 'No bug spray under 2 months' : 'DEET or picaridin', 'weather'], ['car', 'Car seat', 'Bring it', 'Plan rides with family or a car service', 'fly']])
      + h.versus('If {s} {get|gets} sick', ['Call a doctor', 'Fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', 'Hard to wake, blood in the poop, or any fever under 3 months.']));

    if (id === 'away') return sub('away', 'Staying away', 'Stay with family or in a hotel', 'Sleep the same way as at home: on the back, in an empty crib.',
      nowTiles('Where {s} {sleep|sleeps}', [['crib', 'Play yard', 'Its own mattress', 'Extra pads can leave gaps', 'away'], ['crib', 'Older crib', 'Made after June 2011', 'Older ones fall short', 'abroad'], ['crib', 'Hotel crib', 'Check it first', 'Take out pillows and bumpers', 'road']])
      + (m >= 6 ? `<h2 class="oa-sec">${F(moving() ? 'When you arrive' : 'Once {s’s} moving')}</h2>` + steps([['lock', 'Medicines up high', 'Check bags and nightstands'], ['gate', 'Stairs gated', 'Bathroom doors shut'], ['bath', 'Water watched', 'One adult at the pool, every second'], ['heart', 'Pets apart', 'Never alone together']], 'Medicines up high, including in bags; stairs gated and bathroom doors shut; one adult watching at the pool; pets never alone with the baby.')
        + lines([['Grandparents and treats', 'Say the rules once, kindly: no honey or cow’s milk to drink before 1, no whole grapes, nuts or popcorn, and no toys with small parts.']]) : ''));

    if (id === 'weather') {
      const view = weatherView || season();
      const seg = `<div class="hub-seg oa-seg" role="tablist">${[['hot', 'Hot days'], ['cold', 'Cold days']].map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaWeather('${k}')">${t}</button>`).join('')}</div>`;
      const hot = nowTiles('At Maya’s age', [['sun', 'Sun', m < 6 ? 'Shade first' : 'Shade and SPF 30', m < 6 ? 'A little sunscreen only if there’s none' : 'Every 2 hours, and after water', 'abroad'], ['drop', 'Drinks', m < 6 ? 'Extra milk feeds' : 'Milk, plus sips', m < 6 ? 'No water before 6 months' : 'Water from a cup', 'road'], ['leaf', 'Bugs', m < 2 ? 'No spray yet' : 'DEET or picaridin', m < 2 ? 'Netting and light sleeves' : 'Never on {p} hands', 'errands']])
        + todo('What to do', ['Go out early or late. When the heat index is 90°F or more, keep it short or stay in.', 'Shade the stroller with its canopy, never a blanket: it traps heat.', 'Cool the car first, and touch the buckles before you buckle {o} in.'])
        + lines([['Pool or beach', 'Stay within arm’s reach in the water, every second, and take {o} out if {s} {shiver|shivers}.']])
        + h.versus('Too hot?', ['Cool {o} down', 'Sweaty or flushed: shade, a layer off, a feed.'], ['Call 911', 'Hot to the touch and hard to wake or floppy.']);
      const cold = steps([['car', 'In the car seat', 'Thin layers, a blanket over the straps'], ['shirt', 'On walks', 'One more layer than you, a hat and mittens'], ['hand', 'Check', '{P} chest or neck, not {p} hands']], 'In the car seat, thin layers with a blanket over the straps; on walks, one more layer than you; check the chest or neck.')
        + lines([['Very cold or windy?', 'There’s no set temperature. Keep walks short, and warm the car up first.']])
        + h.versus('Too cold?', ['Head inside', 'Shivering, or red cheeks, ears or fingers.'], ['Get help right away', 'Skin that’s pale, gray or blistered, or very sleepy.']);
      return sub('weather', 'Hot and cold days', view === 'hot' ? 'Hot days out' : 'Cold days out', view === 'hot' ? 'Babies heat up faster than you do. Shade and timing do most of the work.' : 'Babies lose heat faster than you do. Layers and short trips do most of the work.',
        seg + (view === 'hot' ? hot : cold));
    }

    if (id === 'sick') return sub('sick', 'On a trip', 'If Maya gets sick on a trip', 'Most travel bugs are mild. A few things packed makes it calmer.',
      steps([['thermo', 'A thermometer', 'And medicines, dosed by weight'], ['drop', 'Rehydration salts', 'If your pediatrician suggests them'], ['notepad', 'Your numbers', 'After-hours line, insurance card']], 'Pack a thermometer and medicines, rehydration salts if suggested, and your pediatrician’s after-hours number.')
      + h.versus('Away from home', ['Call a doctor', 'Fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', 'Hard to wake, blood in the poop, or any fever under 3 months.']));

    if (id === 'car') return sub('gear', 'Your gear', 'Buckle in right, every ride', 'A car seat only protects Maya when it fits snugly, every ride.',
      hubFigure('carseat', CAT, 'Rear-facing in the back seat, chest clip level with the armpits, straps snug with no slack to pinch, and no puffy coat underneath.')
      + lines([['Only for the car', 'It’s for travel, not sleep. Once you arrive, move {o} to a flat sleep space.'], ['Every ride', 'Taxis and rideshares too. Skip add-on inserts and covers that go under the straps.'], ['A free check', 'Many fire stations and hospitals will check your install.']]));

    if (id === 'carry') return sub('gear', 'Your gear', 'Wear Maya safely', 'Holding Maya close is lovely for you both.',
      hubFigure('carrier', CAT, 'In a carrier: face visible and close enough to kiss, chin off the chest, knees up in an M shape, back supported.')
      + lines([m < 4 ? ['From day one', 'Wraps, slings and soft carriers all work. Practice at home first, and take extra care with slings.'] : null,
        m >= 2 && m < 6 ? ['Facing out', 'Once {s} {hold|holds} {p} head steady, usually around 4 months. Turn {o} back in for naps.'] : null,
        m >= 6 ? ['A backpack carrier', 'Once {s} {sit|sits} well on {p} own.'] : null]));

    if (id === 'stroller') return sub('gear', 'Your gear', 'Stroll safely', m < 6 ? 'Young babies ride lying back.' : 'Once Maya sits steadily, {s} can ride sitting up.',
      hubFigure(m < 6 ? 'stroller' : 'strollerUp', CAT, 'Harness on every time, brakes on when you stop, no bags on the handles and no blanket over the top.')
      + lines([['On cold days', 'A footmuff or a blanket tucked around {o} is fine. Just nothing draped over the top.']]));

    if (id === 'bag') return sub('gear', 'Your gear', 'Pack the diaper bag', 'Tap each thing as it goes in.',
      bagList(m) + milkOnTheGo());

    if (id === 'bigger') return sub('gear', 'Your gear', 'Moving to a bigger car seat', 'It’s about height or weight, not age.',
      hubFigure('outgrown', CAT, 'The infant seat is outgrown when the head is within an inch of the top of the shell, or past the height or weight on the label.')
      + hubStageStrip({ title: 'Car seats, in order', numbered: true, items: [['car', 'Infant seat', 'Rear-facing, from birth'], ['car', 'Convertible seat', 'Still rear-facing'], ['car', 'Forward-facing', 'Only after its rear-facing limits, often 2+']], cat: CAT, caption: 'Infant seat rear-facing from birth, then a convertible seat still rear-facing, and forward-facing only after its rear-facing limits, often age 2 or older.' })
      + lines([['A used seat?', 'Only if you know it’s never been in a crash and isn’t past its expiration date.']]));

    if (id === 'snacks') return sub('gear', 'On the go', 'Snacks and drinks on the go', 'Snacks make outings easier.',
      steps([['bowl', 'Soft foods', 'That squash between your fingers'], ['cup', 'Water in a cup', 'No juice before 1'], ['car', 'At a stop', 'Never handed back while you drive']], 'Pack soft foods and water in a cup, and offer them at a stop.')
      + lines([['Leave at home', 'Whole grapes, nuts and popcorn.']]));

    if (id === 'after1') return sub('gear', 'After the first birthday', 'Rear-facing for as long as the seat allows', 'Turning forward at 1 isn’t a milestone.',
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
