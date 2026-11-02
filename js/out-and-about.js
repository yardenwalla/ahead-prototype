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
     Each page does one job, like Sleep's subpages: one plain line, the "What to do" card that stands out,
     then at most one short list and one link. A fact lives on one page only:
     the car seat's rules on Car seat, the shopping cart on Errands, sleep spaces on Staying away. */
  function detail(id) {
    const h = H(), m = ageNow(), v = stageFor(m);

    if (id === 'errands') {
      if (m < 2) return sub('errands', 'First outings', 'Your first outings', 'Going out is good for you both. Keep the first trips short and close to home.',
        todo('What to do', ['Go right after a feed, when {s’s} likely to be calm.', 'Pick quiet places for now, and keep anyone who’s sick away. Ask people to wash their hands before holding {o}.', 'Leave the car seat in the car. In the store, wear {o} in a carrier or bring the stroller.'])
        + lines([['At the doctor’s office', 'Ask if there’s a separate waiting area for checkups, or wait in the car until they call you.'], ['Crying in the car', 'Crying won’t hurt {o} while {s’s} buckled in. Keep driving calmly, or pull over if you need a minute.']]));
      return sub('errands', 'Errands and walks', 'Errands and walks', 'Most everyday places are fine now.',
        todo('What to do', ['Leave the car seat in the car, never on top of a shopping cart.', m >= 6 ? 'Once {s} {sit|sits} well, the cart’s own seat or a high chair works, with the strap on.' : 'Wear {o} in a carrier or bring the stroller.', 'For naps out, a stroller that lies flat, or the carrier while you’re watching.']));
    }

    if (id === 'road') return sub('road', 'Road trips', 'Plan a road trip', 'Long drives go better with a stop about every 2 hours.',
      hubDayMarkers({ title: 'An example drive', events: [[9 * 60, 'car', 'Leave as a nap starts'], [11 * 60, 'bottle', 'Feed and change'], [13 * 60, 'mat', 'Change and stretch'], [15 * 60, 'home', 'Arrive']], from: 8 * 60, to: 16 * 60, cat: CAT, caption: 'Leave at 9 as a nap starts, stop at 11 to feed and change, stop at 1 to change and stretch, arrive at 3.' })
      + todo('At every stop', ['Take {o} out of the car seat for a feed, a change and a stretch.', 'Feed only when the car is stopped.', m >= 6 ? 'Snacks at a stop too, and soft toys only in the car.' : 'An adult in the back seat helps on long drives.'])
      + elsewhere('crib', 'Staying the night?', 'Where {s} will sleep', open('away')));

    if (id === 'fly') {
      const bf = nursing(), ff = formula();
      return sub('fly', 'Flying', 'Fly with Maya', m < 3 ? 'Waiting until 2–3 months is best if you can. After that, most of it is one choice when you book.' : 'Most of it is one choice when you book, and a little planning for the day.',
        h.versus('Where will Maya sit?', ['Own seat', 'Safest. Buckle {o} into a car seat labeled for aircraft.'], ['On your lap', 'Often free under 2, but turbulence can throw a baby from your arms. Bring a birth certificate.'])
        + todo('On the day', [bf && ff ? 'Breast milk, formula and water for mixing can go through security, more than 3.4 oz. Tell the officer.' : bf ? 'Breast milk and your pump can go through security, more than 3.4 oz. Tell the officer.' : 'Formula and water for mixing can go through security, more than 3.4 oz. Tell the officer.', 'Gate-check the stroller, and board early to fit the car seat in a window seat.', 'At takeoff and landing, a feed, a bottle or a pacifier helps {p} ears.'])
        + elsewhere('plane', 'Going abroad?', 'Passport, shots, food and water', open('abroad')));
    }

    if (id === 'abroad') return sub('abroad', 'Going abroad', 'Going abroad with Maya', 'A trip abroad adds a passport and a doctor’s visit. Start as soon as you book.',
      todo('As soon as you book', ['Apply for {p} passport in person, with both parents and one photo. It can take several weeks, so pay to expedite if time is short.', m >= 6 ? 'See your pediatrician or a travel clinic. {S} can get an early measles shot, at least 2 weeks before you go.' : 'See your pediatrician or a travel clinic about what protects {o} where you’re going.', 'Find a pediatrician or hospital near where you’ll stay.'])
      + lines([['Water and food', formula() ? 'Bottled or boiled water for formula and washing bottles. Cooked food and fruit you peel are safest.' : 'Nursing protects {o}. Bottled or boiled water for anything else, and fruit you peel.'], ['Mosquitoes', m < 2 ? 'No bug spray under 2 months. Use netting over the stroller and crib.' : 'Netting over the stroller and crib, and bug spray with DEET or picaridin.']])
      + elsewhere('thermo', 'If {s} {get|gets} sick on a trip', 'What to pack, and when to get help', open('sick')));

    if (id === 'away') return sub('away', 'Staying away', 'Stay with family or in a hotel', 'Sleep the same way as at home: on the back, in an empty crib.',
      lines([['A play yard', 'Use the mattress it came with. Extra mattresses or padding can leave gaps.'], ['An older crib', 'Ones made before June 2011 don’t meet today’s standards. If you’re not sure, bring a play yard.'], ['A hotel crib', 'Check for broken parts, and take out any pillows or bumpers.']])
      + (m >= 6 ? todo(moving() ? 'When you arrive' : 'Once {s’s} moving', ['Look at {p} level for medicines, cleaners and small things, including in bags.', 'Gate the stairs and close bathroom doors.', 'Near a pool, one adult’s only job is watching {o}.', 'Never leave {o} alone with a pet.']) : '')
      + elsewhere('moon', 'Safe sleep, step by step', 'Firm, flat and empty', "openPage('chg:Sleep:safe')", 'Sleep'));

    if (id === 'weather') {
      const view = weatherView || season();
      const seg = `<div class="hub-seg oa-seg" role="tablist">${[['hot', 'Hot days'], ['cold', 'Cold days']].map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaWeather('${k}')">${t}</button>`).join('')}</div>`;
      const hot = todo('What to do', ['Go out early or late, in the shade. When the heat index is 90°F or more, keep it short or stay in.', 'Shade the stroller with its canopy, never a blanket: it traps heat.', m < 6 ? 'Offer extra milk feeds. No water before 6 months.' : 'Offer extra milk feeds and sips of water from a cup.'])
        + lines([m >= 2 ? ['Bugs', 'Bug spray with DEET or picaridin is fine from 2 months, never on {p} hands.'] : ['Bugs', 'No bug spray under 2 months. Use netting and light sleeves.'], ['Water', 'At a pool or the beach, stay within arm’s reach, every second.']])
        + h.versus('Too hot?', ['Cool {o} down', 'Sweaty or flushed: shade, a layer off, a feed.'], ['Call 911', 'Hot to the touch and hard to wake or floppy.']);
      const cold = todo('What to do', ['Buckle {o} in thin layers, then put a blanket over the straps.', 'For walks, one more layer than you, a hat and mittens. Keep it short when it’s very cold or windy.', 'Check {p} chest or neck, not {p} hands.'])
        + h.versus('Too cold?', ['Head inside', 'Shivering, or red cheeks, ears or fingers.'], ['Get help right away', 'Skin that’s pale, gray or blistered, or very sleepy.']);
      return sub('weather', 'Hot and cold days', view === 'hot' ? 'Hot days out' : 'Cold days out', view === 'hot' ? 'Babies heat up faster than you do. Shade and timing do most of the work.' : 'Babies lose heat faster than you do. Layers and short trips do most of the work.',
        seg + (view === 'hot' ? hot : cold)
        + (view === 'hot' ? elsewhere('sun', 'Sun protection by age', 'Shade first, then sunscreen', "openPage('chg:Daily rhythm:d:sun')", 'Everyday care') : elsewhere('shirt', 'Dressing for the weather', 'One more layer than you', "openPage('chg:Daily rhythm:d:dress')", 'Everyday care')));
    }

    if (id === 'sick') return sub('sick', 'On a trip', 'If Maya gets sick on a trip', 'Most travel bugs are mild. A few things packed makes it calmer.',
      todo('Pack', ['A thermometer, and the medicines your pediatrician okays, with doses for {p} weight.', 'Oral rehydration salts, if your pediatrician suggests them.', '{P} insurance card, and your pediatrician’s after-hours number.'])
      + h.versus('Away from home', ['Call your pediatrician', 'Fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', 'Hard to wake, blood in the poop, or any fever under 3 months.'])
      + elsewhere('thermo', 'Fever by age', 'When to call', "openPage('chg:Health:d:sick')", 'Health'));

    if (id === 'car') return sub('gear', 'Your gear', 'Buckle in right, every ride', 'A car seat only protects Maya when it fits snugly, every ride.',
      hubFigure('carseat', CAT, 'Rear-facing in the back seat, chest clip level with the armpits, straps snug with no slack to pinch, and no puffy coat underneath.')
      + lines([['Only for the car', 'It’s for travel, not sleep. Once you arrive, move {o} to a flat sleep space.'], ['Every ride', 'Taxis and rideshares too. Skip add-on inserts and covers that go under the straps.']])
      + (m >= 6 ? elsewhere('car', 'Time for a bigger seat?', 'How to tell, and what’s next', open('bigger')) : '')
      + `<a class="hub-more" href="https://www.nhtsa.gov/campaign/right-seat" target="_blank" rel="noopener"><span>${F('Find a free car-seat check near you')}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`);

    if (id === 'carry') return sub('gear', 'Your gear', 'Wear Maya safely', 'Holding Maya close is lovely for you both.',
      hubFigure('carrier', CAT, 'In a carrier: face visible and close enough to kiss, chin off the chest, knees up in an M shape, back supported.')
      + lines([m < 4 ? ['From day one', 'Wraps, slings and soft carriers all work. Practice at home first, and take extra care with slings.'] : null,
        m >= 2 && m < 6 ? ['Facing out', 'Once {s} {hold|holds} {p} head steady, usually around 4 months. Turn {o} back in for naps.'] : null,
        m >= 6 ? ['A backpack carrier', 'Once {s} {sit|sits} well on {p} own.'] : null]));

    if (id === 'stroller') return sub('gear', 'Your gear', 'Stroll safely', m < 6 ? 'Young babies ride lying back.' : 'Once Maya sits steadily, {s} can ride sitting up.',
      hubFigure(m < 6 ? 'stroller' : 'strollerUp', CAT, 'Harness on every time, brakes on when you stop, no bags on the handles and no blanket over the top.'));

    if (id === 'bag') return sub('gear', 'Your gear', 'Pack the diaper bag', 'Tap each thing as it goes in.',
      bagList(m) + milkOnTheGo());

    if (id === 'bigger') return sub('gear', 'Your gear', 'Moving to a bigger car seat', 'It’s about height or weight, not age.',
      hubFigure('outgrown', CAT, 'The infant seat is outgrown when the head is within an inch of the top of the shell, or past the height or weight on the label.')
      + hubStageStrip({ title: 'Car seats, in order', numbered: true, items: [['car', 'Infant seat', 'Rear-facing, from birth'], ['car', 'Convertible seat', 'Still rear-facing'], ['car', 'Forward-facing', 'Only after its rear-facing limits, often 2+']], cat: CAT, caption: 'Infant seat rear-facing from birth, then a convertible seat still rear-facing, and forward-facing only after its rear-facing limits, often age 2 or older.' })
      + lines([['A used seat?', 'Only if you know it’s never been in a crash and isn’t past its expiration date.']]));

    if (id === 'snacks') return sub('gear', 'On the go', 'Snacks and drinks on the go', 'Snacks make outings easier.',
      todo('What to do', ['Pack soft foods that squash between your fingers, and water in a cup. No juice before 1.', 'Offer them at a stop, or with an adult beside Maya. Never hand food back while you drive.', 'Leave whole grapes, nuts and popcorn at home.']));

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
