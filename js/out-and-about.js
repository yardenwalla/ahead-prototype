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
    ['errands', 'Errands and walks', ['The store, the park, the doctor', 'The store, the park, a café', 'Stores, cafés and restaurants']],
    ['road', 'Road trips', ['Long drives and stops']],
    ['fly', 'Flying', ['Booking, security, the flight']],
    ['away', 'Staying away', ['Family, friends or a hotel']],
    ['weather', 'Hot and cold days', ['Walks, the car and the stroller']],
    ['abroad', 'Going abroad', ['Passport, shots, food and water']]
  ];
  const placeSub = (id, subs, v) => {
    if (id === 'away' && v === 2) return moving() ? 'Babyproof it in 10 minutes' : 'Family, friends or a hotel';
    if (id === 'weather') return season() === 'cold' ? 'Cold walks and the car seat' : 'Heat, shade and the car';
    return subs[Math.min(v, subs.length - 1)];
  };
  const places = v => `<h2 class="hub-h2">${F('Where are you headed?')}</h2><div class="oa-places">${PLACES.map(([id, label, subs]) => { const c = PAL[id]; return `<button class="oa-place" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="${open(id)}"><span class="oa-place-art">${SHAPE[id](c)}</span><b>${F(label)}</b><small>${F(placeSub(id, subs, v))}</small></button>`; }).join('')}</div>`;
  const GEAR_C = { car: ['#e7effc', '#46638c'], stroller: ['#e6f5ec', '#356651'], carrier: ['#fdeef2', '#a24d6a'], bag: ['#fff3dc', '#8a6a2a'] };
  const gearRow = (icon, key, title, sub, id, chip) => `<button class="hub-row oa-row" style="--hl-bg:${GEAR_C[key][0]};--hl-ink:${GEAR_C[key][1]}" onclick="${open(id)}"><span class="oa-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(sub)}</small>${chip ? `<span class="hub-chip">${F(chip)}</span>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  function gear(v) {
    const n = bagItems(ageNow()).length, on = bagItems(ageNow()).filter(i => bagGet().includes(i[1])).length;
    return `<h2 class="hub-h2">${F('Your gear')}</h2><div class="hub-list">`
      + gearRow('car', 'car', 'Car seat', ['Rear-facing and snug, every ride', 'Rear-facing and snug, every ride', 'Still rear-facing, maybe a bigger seat'][v], 'car')
      + gearRow('stroller', 'stroller', 'Stroller', v < 2 ? 'Lying back for now' : 'Sitting up, once {s} {sit|sits} steadily', 'stroller')
      + gearRow('carrier', 'carrier', 'Carrier', ['Wraps, slings and soft carriers', 'Facing in, then out once {p} head is steady', 'Front or back, and longer walks'][v], 'carry')
      + gearRow('bag', 'bag', 'Diaper bag', 'Packed for how Maya is fed', 'bag', on ? `${on} of ${n} packed` : '')
      + `</div>`;
  }
  // New for Maya now: only what actually changes at this stage, each opening its page.
  function newNow(v) {
    const rows = [
      [rowTo('home', 'Your first outings', 'Short trips, crowds and the doctor’s waiting room', 'errands')],
      [rowTo('eye', 'Facing out in the carrier', 'Once {p} head is steady', 'carry'), rowTo('sun', 'Bug spray is OK from 2 months', 'Which kinds, and how', 'weather')],
      [rowTo('car', 'Moving to a bigger car seat', 'Still rear-facing, whatever the age', 'bigger'), rowTo('bowl', 'Snacks and water on the go', 'Soft foods, and only when you can watch', 'snacks')]
    ][v];
    return H().list('New for Maya now', rows);
  }
  function outAndAbout(selected = null) {
    const now = stageNow(), v = STAGES[selected] ? Number(selected) : now, h = H(), browsing = live() && v !== now;
    const pills = h.pills('Outings and travel by age', STAGES.map((st, i) => ({ label: st.label, age: st.age, on: i === v, now: live() && i === now, onclick: `openPage('chg:${CAT}:s:${i}')`, change: '' })), CAT);
    const HERO = [
      { title: 'Short outings are good for you both', checks: ['Short trips work best, right after a feed', 'Skip crowds and anyone who’s sick for now', 'Maya rides rear-facing in the car seat, every ride'], label: 'What to expect' },
      { title: 'Longer trips fit between feeds now', checks: ['Feeds spread out, so a long drive or a first flight is doable', 'Once {p} head is steady, {s} can face out in a carrier', 'Still no water, and shade before sunscreen, until 6 months'] },
      { title: 'Outings get busier and more fun', checks: ['Snacks and a cup of water come along now', 'Most babies outgrow the infant car seat this year. The next one still faces back', 'Once {s’s} moving, babyproof wherever you stay'] }
    ][v];
    let b = `<header class="hub-hero oa-hero"><p class="hub-eyebrow">${F(STAGES[v].label + ' · ' + STAGES[v].age)}</p><h1>${F(HERO.title)}</h1><p class="hub-checks-label">${F(HERO.label || 'What’s changing')}</p><ul class="hub-hero-checks">${HERO.checks.map(t => `<li>${F(t)}</li>`).join('')}</ul></header>`;
    b += newNow(v) + places(v) + gear(v);
    b += h.versus('In the car', ['Every ride', 'Buckled in, rear-facing, and a look at the back seat before you walk away.'], ['Never', 'Leave Maya alone in the car, even for a minute.']);
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
      f === 'Breast milk' ? ['heart', 'nursing', 'A burp cloth', 'A cover only if you like one'] : ['bottle', 'formula', 'Formula, powder and water packed apart', 'Mix when {s’s} hungry'],
      f !== 'Breast milk' ? ['bottle', 'bottles', 'Clean bottles', 'One for each feed, plus one'] : null,
      m < 12 ? ['pacifier', 'pacifier', 'A pacifier, if {s} {use|uses} one', 'And a spare'] : null,
      ['sun', 'hat', 'A hat', 'Sun hat or warm hat'],
      ['sack', 'layer', 'An extra layer', 'A light blanket for over the straps'],
      ['hand', 'sanitizer', 'Hand sanitizer', 'For you, before feeds and changes'],
      m >= 6 ? ['bowl', 'snacks', 'Soft snacks and a spoon', ''] : null,
      m >= 6 ? ['cup', 'cup', 'Water in a cup', ''] : null
    ].filter(Boolean);
  }
  function bagList(m) {
    const items = bagItems(m), have = bagGet(), on = items.filter(i => have.includes(i[1])).length;
    return `<section class="hub-card oa-bag"><div class="oa-bag-head"><b class="oa-pack-count">${on} of ${items.length} packed</b><button class="hub-link" onclick="oaBagReset()">Start over</button></div><div class="oa-packs">${items.map(([icon, k, t, s]) => `<button class="oa-pack${have.includes(k) ? ' is-on' : ''}" data-k="${k}" aria-pressed="${have.includes(k)}" onclick="oaBagToggle('${k}')"><span class="oa-pack-art">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}</span><i aria-hidden="true">✓</i></button>`).join('')}</div></section>`;
  }
  // Keeping milk safe on the go, for the family's own feeding method.
  const milkOnTheGo = () => lines([
    nursing() && ['Pumped milk', 'Fine at room temperature for up to 4 hours, or up to 24 hours in a cooler bag with ice packs.'],
    formula() && ['Formula', 'Carry the powder and the water separately and mix when {s’s} hungry. Once mixed, use it within 2 hours, or within 1 hour of starting the feed.'],
    ['In the heat', 'Keep milk in a cooler bag out of the sun, and never leave it in a hot car.']
  ]);

  /* ---------- the pages ---------- */
  function detail(id) {
    const h = H(), m = ageNow(), v = stageFor(m);

    if (id === 'errands') {
      if (m < 2) return sub('errands', 'Errands and walks', 'Your first outings', 'Going out with a newborn is fine, and fresh air helps you both. Keep the first trips short and simple.',
        todo('Before you go', ['Go right after a feed, when {s’s} likely to be calm.', 'Start with somewhere quiet and close, like a walk or a short drive.', 'It’s fine to turn around and go home. Everyone does.'])
        + sec('Germs, for the first couple of months')
        + lines([['Skip crowds for now', 'A quiet trip to the store is fine. Busy, enclosed places and anyone who’s sick are the ones to avoid until after {p} 2-month shots.'], ['Hands first', 'Ask people to wash their hands before holding {o}, and it’s fine to say no to holding at all.'], ['At the doctor’s office', 'Ask whether there’s a well-baby waiting area, or wait in the car until they call you.']])
        + sec('While you’re out')
        + lines([['The car seat stays in the car', 'Never set it on top of a shopping cart. Use a carrier, a stroller, or a cart with a built-in baby seat that reclines.'], nursing() && ['Feeding', 'Nurse wherever you’re comfortable. A parked car or a quiet corner works too.'], ['Crying in the car', 'Buckled in, {s’s} safe even when {s’s} upset. If you need to, pull over somewhere safe and take a minute.']])
        + know('Fever under 3 months', 'A temperature of 100.4°F or higher means calling your pediatrician right away, day or night, wherever you are.'));
      return sub('errands', 'Errands and walks', 'Errands and walks', 'Most everyday places are fine now. A few habits make them easier.',
        lines([['The car seat stays in the car', 'Never on top of a shopping cart. Use a carrier, the stroller, or the cart’s own seat once {s} {sit|sits} well, with the strap on.'],
          m >= 6 && ['High chairs out', 'Use the straps, and check it’s steady and away from the table edge. Wipe the tray first.'],
          ['Naps out', 'A car seat isn’t for sleep once you’re out of the car. A stroller that lies flat, or the carrier while you’re awake and watching, works.'],
          nursing() && ['Feeding', 'Nurse wherever you’re comfortable.'],
          ['Busy places', 'Hand-washing and staying away from anyone who’s sick still help most.']])
        + elsewhere('bag', 'Pack the diaper bag', 'A tap-to-pack list', open('bag')));
    }

    if (id === 'road') return sub('road', 'Road trips', 'Plan a road trip', 'Long drives go better with stops built in. The car seat does the hard part.',
      sec('Before you go')
      + lines([['Check the car seat', v === 2 ? 'If {s’s} close to outgrowing the infant seat, install the next one before the trip and have it checked.' : 'Straps snug at or below {p} shoulders, no slack you can pinch.'], ['Pack within reach', 'Diapers, a change of clothes and feeds in the front of the car, not the trunk.'], m >= 6 && ['Soft toys only', 'Anything hard or heavy can fly around in a sudden stop.']])
      + sec('On the road')
      + hubDayMarkers({ title: 'A stop about every 2 hours', events: [[9 * 60, 'car', 'Leave as a nap starts'], [11 * 60, 'bottle', 'Stop: feed and change'], [13 * 60, 'mat', 'Stop: change, stretch, play'], [15 * 60, 'home', 'Arrive']], from: 8 * 60, to: 16 * 60, cat: CAT, caption: 'An example drive: leave at 9 as a nap starts, stop at 11 to feed and change, stop at 1 to change and stretch, arrive at 3.' })
      + todo('Every stop', ['Take {o} out of the car seat for a while: a feed, a change, a stretch.', 'Feed only when the car is stopped. Never take {o} out while you’re moving.', m >= 6 ? 'Snacks at a stop, or with an adult in the back beside {o}.' : 'An adult in the back seat helps on long drives.'])
      + know('How long in the car seat?', m < 2 ? 'There’s no exact limit, but young babies do best with a break about every 2 hours. Babies born early may need shorter stretches, so ask your pediatrician.' : 'There’s no exact limit. A break about every 2 hours suits most babies.')
      + sec('When you arrive')
      + lines([['Car seat naps end at the car', 'Sleeping in the car seat is fine while you drive. Once you arrive, move {o} to a flat sleep space.']])
      + elsewhere('crib', 'Staying the night?', 'Sleep, babyproofing and grandparents', open('away')));

    if (id === 'fly') {
      const bf = nursing(), ff = formula();
      return sub('fly', 'Flying', 'Fly with Maya', 'Most of it comes down to one choice when you book, and a little planning for the day.',
        sec('When you book')
        + h.versus('Where will Maya sit?', ['Own seat', 'Safest. Buckle {o} into a car seat labeled for aircraft.'], ['On your lap', 'Often free under 2, but turbulence can throw a baby from your arms.'])
        + lines([['Bring proof of age', 'If Maya flies on your lap, airlines often ask to see a birth certificate or a copy, even on domestic flights.'], m < 3 && ['Under 3 months?', 'Flying is generally safe after the first week, but waiting until 2–3 months is best if you can. Busy airports spread colds easily.'], ['Gate-check the stroller', 'Most airlines let you check a stroller and a car seat at the gate for free.']])
        + elsewhere('plane', 'Going abroad?', 'Passport, shots, food and water', open('abroad'))
        + sec('Through security')
        + lines([[bf && ff ? 'Milk and formula' : bf ? 'Breast milk' : 'Formula', `${bf ? 'Breast milk' : 'Formula'}${bf && ff ? ', formula' : ''} and water for mixing can all go through, more than 3.4 oz. Take them out and tell the officer.`], bf && ['Your pump', 'A breast pump is a medical device, so it goes in your carry-on as well as your bag.'], ['Ice packs', 'Fine for keeping milk cold.'], bf && ['Pumping or nursing', 'Airports have private rooms for it that aren’t bathrooms. Ask at the information desk.']])
        + sec('On the plane')
        + todo('Takeoff and landing', ['Feed {o}, or offer a pacifier. Swallowing helps {p} ears.', 'Board early, so there’s time to install the car seat in a window seat.'])
        + (bf ? know('Nursing on board', 'A window seat gives you more privacy. If {s’s} in a car seat, nurse before takeoff and after the seatbelt sign goes off.') : '')
        + sec('When you arrive')
        + lines([['Time zones', 'For a short trip, many families let naps and bedtime drift with the new time. For longer stays, shift them a little each day.'], ['Rides from the airport', 'Bring the car seat for every ride, including taxis and rideshares.']])
        + elsewhere('crib', 'Where will {s} sleep?', 'Hotel cribs, play yards and old cribs', open('away')));
    }

    if (id === 'abroad') return sub('abroad', 'Going abroad', 'Going abroad with Maya', 'A trip abroad adds paperwork and a doctor’s visit. Start about 6 weeks out if you can.',
      sec('As soon as you book')
      + todo('Two things to start now', ['Apply for {p} passport. Babies apply in person with both parents and one photo. It can take several weeks, so start early.', 'Book a visit with your pediatrician or a travel clinic a few weeks before you go.'])
      + elsewhere('notepad', 'How to apply for a baby’s passport', 'Form, photo and what both parents bring', "window.open('https://travel.state.gov/content/travel/en/passports/apply-renew-passport/under-16.html','_blank')")
      + sec('At the doctor’s visit')
      + lines([['Routine shots', 'Make sure {s’s} up to date.'], m >= 6 ? ['An early measles shot', 'Babies 6 months and older get one at least 2 weeks before traveling abroad. It doesn’t replace the one at 12 months.'] : ['Under 6 months', 'Some vaccines can’t be given yet, so ask what else protects {o} where you’re going.'], ['Anything else for where you’re going', 'Some places need extra protection, like hepatitis A from 6 months or malaria medicine. The doctor will check.']])
      + sec('While you’re there')
      + lines([['Water', formula() ? 'Use bottled or boiled and cooled water for formula, and for washing bottles.' : 'Nursing protects {o}. Use bottled or boiled water for anything else {s} {drink|drinks}.'], m >= 6 && ['Food', 'Cooked foods and fruit you peel yourself are safest. Skip ice and raw salads.'], ['Mosquitoes', m < 2 ? 'Under 2 months, no bug spray: use netting over the stroller, carrier and crib, and long sleeves.' : 'Netting over the stroller, carrier and crib, long sleeves, and bug spray with DEET or picaridin.'], ['Car seats', 'Taxis abroad may not have a way to fit one. A seat that installs with a seat belt works almost anywhere.']])
      + elsewhere('thermo', 'If {s} {get|gets} sick on a trip', 'What to pack and when to get help', open('sick')));

    if (id === 'away') {
      const mob = m >= 6;
      return sub('away', 'Staying away', 'Stay with family or in a hotel', 'Sleep the same way as at home, and take ten minutes to look around when you arrive.',
        sec('Where {s} {sleep|sleeps}')
        + hubFigure('crib', CAT, 'On the back, in a sleep sack, on a firm flat mattress, with nothing else in the crib.').replace('Swaddle or sleep sack', m < 2 ? 'Swaddle or sleep sack' : 'Sleep sack, arms free')
        + lines([['A play yard or portable crib', 'Use the mattress it came with, and skip extra mattresses or padding. They can leave gaps {s} could get stuck in.'], ['An older crib', 'Cribs made before June 2011 don’t meet today’s safety standards. If it’s older, or you’re not sure, bring a play yard.'], ['A hotel crib', 'It may not meet current standards. Check it for broken or missing parts, and take out any pillows or bumpers.'], ['Your own bed', 'Room-share, but keep {o} in {p} own sleep space, even on vacation.']])
        + elsewhere('moon', 'Safe sleep, step by step', 'Firm, flat and empty', "openPage('chg:Sleep:safe')", 'Sleep')
        + (mob ? sec(moving() ? 'Maya is moving: a 10-minute sweep' : 'Once {s’s} moving: a 10-minute sweep')
          + todo('When you arrive', ['Get down to {p} level and look for medicines, cleaners and small things, including in bags and on nightstands.', 'Gate the top and bottom of stairs, close bathroom doors, and find out where the pool or any water is.', 'Tie up blind cords, and push TVs and anything heavy back from the edge.', 'Keep pets and their food bowls apart from {o}.'])
          + elsewhere('gate', 'The full babyproofing checklist', 'Gates, cabinets, cords and more', "openPage('topic:Safety')", 'Safety')
          : lines([['Bags and medicines', 'Ask visitors and hosts to keep bags, with their medicines, up high.']]))
        + sec('Family and food')
        + lines([m >= 6 && ['Grandparents and treats', 'It’s fine to say the rules once and kindly: no honey or cow’s milk to drink before 1, and no whole grapes, nuts or popcorn.'], ['Naps somewhere new', 'Bring {p} sleep sack and anything that’s part of bedtime. A few off days are normal.']]));
    }

    if (id === 'weather') {
      const view = weatherView || season();
      const seg = `<div class="oa-seg"><div class="hub-seg" role="tablist">${[['hot', 'Hot days'], ['cold', 'Cold days']].map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaWeather('${k}')">${t}</button>`).join('')}</div></div>`;
      const hot = todo('On a hot day', ['Go out early or late, and stay in the shade.', 'Use the stroller’s canopy or a clip-on shade. A blanket over the stroller traps heat.', 'Cool the car before {s} {get|gets} in, and touch the buckles first: they can burn.'])
        + lines([['Drinks', m < 6 ? 'No water before 6 months. Offer extra milk feeds instead.' : 'Extra milk feeds, plus small sips of water from a cup, up to 4–8 oz a day.'], ['Too hot?', 'Sweaty, flushed, hot chest, fussy. Move somewhere cooler, take off a layer and offer a feed.']])
        + (m >= 2 ? lines([['Bugs', 'From 2 months, bug spray with DEET or picaridin is fine. Put it on your hands, then on {p} skin and clothes, never on {p} hands. Skip oil of lemon eucalyptus, and sprays mixed with sunscreen.']]) : lines([['Bugs', 'Under 2 months, skip bug spray. Use netting over the stroller or carrier, and long, light sleeves.']]))
        + h.versus('Heat', ['Call your pediatrician', 'Fewer wet diapers, or a sunburn, at any age under 1.'], ['Call 911', 'Hot to the touch and hard to wake or floppy.'])
        + elsewhere('sun', 'Sun protection by age', m < 6 ? 'Shade first, then a little sunscreen' : 'Shade, and sunscreen of SPF 30 or more', "openPage('chg:Daily rhythm:d:sun')", 'Everyday care');
      const cold = todo('On a cold day', ['Buckle {o} into the car seat in thin layers, then put a blanket or coat over the straps.', 'Skip car seat covers that go behind {p} back or under the straps.', 'Warm up the car before you go.'])
        + lines([['Walks', 'One more layer than you, plus a hat and mittens. Keep walks short when it’s very cold or windy.'], ['In a carrier', 'Your coat can go over you both. Check that {s} {don’t|doesn’t} get too warm.'], ['Too cold?', 'Feel {p} chest or the back of {p} neck, not {p} hands. Cool means add a layer.']])
        + h.versus('Cold', ['Head inside and warm up', 'Shivering, or red cheeks, ears or fingers.'], ['Get help right away', 'Skin that’s pale, gray or blistered, or {s} {seem|seems} very sleepy or floppy.'])
        + elsewhere('shirt', 'Dressing for the weather', 'One more layer than you', "openPage('chg:Daily rhythm:d:dress')", 'Everyday care');
      return sub('weather', 'Hot and cold days', view === 'hot' ? 'Hot days out' : 'Cold days out', view === 'hot' ? 'Babies heat up faster than adults and can’t cool down as well. Shade and timing do most of the work.' : 'Babies lose heat faster than adults. Layers and short trips do most of the work.',
        seg + (view === 'hot' ? hot : cold));
    }

    if (id === 'sick') return sub('sick', 'On a trip', 'If Maya gets sick on a trip', 'Most travel bugs are mild. Packing a few things and knowing where to go makes it calmer.',
      todo('Before you go', ['Pack a thermometer, the medicines your pediatrician okays, saline drops and diaper cream. Ask about doses by {p} weight.', 'Save your pediatrician’s after-hours number, and look up the nearest urgent care or children’s hospital where you’ll stay.', 'Bring {p} insurance card. Going abroad? Check whether your plan covers {o} there.'])
      + lines([['Diarrhea or vomiting', 'Keep feeding. Watch for fewer wet diapers, a dry mouth or no tears, and call if you see them.']])
      + elsewhere('thermo', 'When to call, and fever by age', 'The rule for Maya’s age', "openPage('chg:Health:d:sick')", 'Health'));

    if (id === 'car') return sub('gear', 'Your gear', 'Buckle in right, every ride', 'A car seat only protects Maya when it fits snugly, every single ride.',
      hubFigure('carseat', CAT, 'Rear-facing in the back seat, chest clip level with the armpits, straps snug with no slack to pinch, and no puffy coat underneath.')
      + h.qa([['How long can {s} be in it?', 'Breaks every 2 hours', 'On long drives. It’s for travel, not for sleep outside the car.'], ['When does {s} face forward?', 'Not this year', 'Rear-facing until the seat’s rear-facing limit, often age 2 or older.']])
      + lines([['The pinch test', 'Once buckled, try to pinch the strap at {p} shoulder. If you can grab a fold, tighten it.'], ['Only what came with the seat', 'Skip add-on inserts, head supports and covers that go behind {o} or under the straps.'], ['On a cold day', 'Thin layers, then a blanket or coat over the buckled straps.'], ['Not on a cart or a table', 'The car seat goes in the car. Out of it, Maya sleeps on a flat surface.'], ['Taxis, rideshares and other cars', 'Bring the car seat for every ride. A trained checker can look over your install, often for free.']])
      + (m >= 6 ? elsewhere('car', 'Moving to a bigger car seat', 'When the infant seat is outgrown', open('bigger')) : '')
      + `<a class="hub-more" href="https://www.nhtsa.gov/campaign/right-seat" target="_blank" rel="noopener"><span>${F('Find a free car-seat check near you')}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`);

    if (id === 'carry') return sub('gear', 'Your gear', 'Wear Maya safely', 'Holding Maya close is lovely for you both. A quick check keeps {o} breathing easy.',
      hubFigure('carrier', CAT, 'In a carrier: face visible and close enough to kiss, chin off the chest, knees up in an M shape, back supported.')
      + todo('Every time', ['You can see {p} face, close enough to kiss {p} head.', 'Chin off {p} chest, with a finger’s width of room.', 'Snug enough that {s} {don’t|doesn’t} slump when you lean forward.'])
      + lines([
        m < 4 && ['Wraps and slings', 'Both work from birth. Take extra care with slings under 4 months: a curled-up position can make breathing harder.'],
        m < 4 && ['A newborn insert', 'Some soft carriers need one until {s’s} big enough. Check the label.'],
        m >= 2 && ['Facing out', 'Once Maya holds {p} head steady, {s} can face out if your carrier allows it. Turn {o} back in for naps.'],
        m >= 6 && ['Backpack carriers', 'Once {s} {sit|sits} well on {p} own. Bend at the knees, not the waist.'],
        ['Not while cooking', 'Skip the stove and hot drinks while you’re wearing {o}.'],
        ['Naps in the carrier', 'Fine while you’re awake and watching. Move {o} to a flat sleep space when you can.']]));

    if (id === 'stroller') return sub('gear', 'Your gear', 'Stroll safely', m < 6 ? 'Young babies ride lying back. A few habits keep every walk safe.' : 'Once Maya sits steadily, {s} can ride sitting up. A few habits keep every walk safe.',
      hubFigure(m < 6 ? 'stroller' : 'strollerUp', CAT, 'Harness on every time, brakes on when you stop, no bags on the handles and no blanket over the top.')
      + lines([['No blanket over the top', 'It traps heat. Use the canopy or a shade made for strollers.'], ['Bags in the basket', 'Bags on the handles can tip it over.'], ['Car seat on a stroller frame', 'Fine for a walk. Once you’re home, move {o} to a flat sleep space.'], ['Jogging strollers', 'Check the label for the minimum age, and ask your pediatrician before you run with {o}.']]));

    if (id === 'bag') return sub('gear', 'Your gear', 'Pack the diaper bag', 'Tap each thing as it goes in. The list follows how Maya is fed.',
      bagList(m) + sec('Keeping milk safe') + milkOnTheGo() + h.tip('Keep it packed', 'Restock as soon as you’re home, so the next outing is grab and go.'));

    if (id === 'bigger') return sub('gear', 'Your gear', 'Moving to a bigger car seat', 'Most babies outgrow the infant car seat in the first year. That’s about height or weight, not age.',
      hubFigure('outgrown', CAT, 'The infant seat is outgrown when the head is within an inch of the top of the shell, or past the height or weight on the label.')
      + hubStageStrip({ title: 'Car seats, in order', numbered: true, items: [['car', 'Infant seat', 'Rear-facing, from birth'], ['car', 'Convertible seat', 'Still rear-facing'], ['car', 'Forward-facing', 'Only after its rear-facing limits, often 2+']], cat: CAT, caption: 'Infant seat rear-facing from birth, then a convertible seat still rear-facing, and forward-facing only after its rear-facing limits, often age 2 or older.' })
      + lines([['Switch before a long trip', 'Install the new seat and have it checked before a big drive, not the night before.'], ['Not at the first birthday', 'Turning forward at 1 isn’t a milestone. Rear-facing protects the head and neck best.'], ['A used seat?', 'Only if you know its history: never in a crash, not past its expiration date, with all its parts.']]));

    if (id === 'snacks') return sub('gear', 'On the go', 'Snacks and drinks on the go', 'Snacks make outings easier. A little planning keeps them safe.',
      todo('Packing snacks', ['Soft finger foods that squash easily between your fingers.', 'Water in a cup. No juice before 1.', 'Leave whole grapes, nuts and popcorn at home.'])
      + h.versus('Snacks in the car', ['Fine', 'At a stop, or with an adult beside Maya.'], ['Skip', 'Handing food back while you drive.'])
      + elsewhere('bowl', 'Gagging, choking and first aid', 'What to do if {s} {choke|chokes}', "openPage('chg:Feeding:safe')", 'Feeding'));

    if (id === 'after1') return sub('gear', 'After the first birthday', 'Rear-facing for as long as the seat allows', 'After the first birthday, the car seat still faces the back.',
      h.steps(['Keep Maya rear-facing until the seat’s rear-facing height or weight limit, often age 2 or older.', 'Only then turn the seat forward, with the harness.'])
      + h.tip('Legs touching the seat back?', 'That’s fine and safe. It isn’t a reason to turn forward.'));
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
