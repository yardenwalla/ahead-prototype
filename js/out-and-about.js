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
    water: ['#e0f2fb', '#2b6582', '#9fd3ec', '#fbe6bd'],
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
    water: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 26q8-8 16 0t16 0 16 0 16 0" stroke="${c[2]}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="72" cy="12" r="7" fill="${c[3]}"/></svg>`,
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
    ['errands', 'Around town', ['Your first trips out', 'A walk, the store, a café']],
    ['road', 'Road trips', ['Long drives and stops']],
    ['fly', 'Flying', ['Booking, security, the flight']],
    ['away', 'Staying away', ['Family, friends or a hotel']],
    ['abroad', 'Going abroad', ['Passport, shots and water', 'Passport, shots and water', 'Passport, shots, food and water']],
    ['water', 'Pool or beach', ['Shade, and holding on']]
  ];
  const placeSub = (id, subs, v) => {
    if (id === 'away' && v === 2) return moving() ? 'Babyproof it in 10 minutes' : 'Family, friends or a hotel';
    if (id === 'weather') return season() === 'cold' ? 'Dressing for walks and the car' : 'Heat, sun and the pool';
    return subs[Math.min(v, subs.length - 1)];
  };
  const places = v => `<h2 class="hub-h2">${F('Where are you headed?')}</h2><div class="oa-places">${PLACES.map(([id, label, subs]) => { const c = PAL[id === 'weather' ? season() : id]; return `<button class="oa-place" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="${open(id)}"><span class="oa-place-art">${SHAPE[id](c)}</span><b>${F(label)}</b><small>${F(placeSub(id, subs, v))}</small></button>`; }).join('')}</div>`;
  // Hot or cold isn't a place, so it's one quiet card for the season, under the places.
  const seasonCard = () => { const k = season(), c = PAL[k]; return `<button class="hub-next oa-season" style="background:${c[0]}" onclick="${open('weather')}"><span><small style="color:${c[1]}">${F('This season')}</small><b>${F(k === 'hot' ? 'Hot days out: shade, drinks and the car' : 'Cold days out: layers and the car seat')}</b></span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  const GEAR_C = { car: ['#e7effc', '#46638c'], stroller: ['#e6f5ec', '#356651'], carrier: ['#fdeef2', '#a24d6a'], bag: ['#fff3dc', '#8a6a2a'], snack: ['#fdeee6', '#9a5a3c'] };
  const gearRow = (icon, key, title, sub, id, chip) => `<button class="hub-row oa-row" style="--hl-bg:${GEAR_C[key][0]};--hl-ink:${GEAR_C[key][1]}" onclick="${open(id)}"><span class="oa-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(sub)}</small>${chip ? `<span class="hub-chip">${F(chip)}</span>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  function gear(v) {
    const n = bagItems(ageNow()).length, on = bagItems(ageNow()).filter(i => bagGet().includes(i[1])).length;
    return `<h2 class="hub-h2">${F('Your gear')}</h2><div class="hub-list">`
      + gearRow('car', 'car', 'Car seat', 'Setting it up, and which seat when', 'car')
      + gearRow('stroller', 'stroller', 'Stroller', 'Harness, brakes and shade', 'stroller')
      + gearRow('carrier', 'carrier', 'Carrier', 'Facing in, facing out, and on your back', 'carry')
      + gearRow('bag', 'bag', 'Diaper bag', 'Packed for how Maya is fed', 'bag', on ? `${on} of ${n} packed` : '')

      + `</div>`;
  }
  // What's new for outings, month by month: [from month, headline, one line, the page it opens].
  // Every age-related change in the tab, places and gear alike: [month, headline, one line, the page it opens, home row].
  // The same list drives the top card here and the home screen's update row (see home-rules.js), so a parent
  // hears about each change without having to come back and spot it. Month 0 is the welcome, not an update.
  const NOWS = [
    [0, 'Short outings are good for you both', 'Fresh air and a change of scene help, even in the first weeks.', 'errands'],
    [2, 'Bug spray can start', 'From 2 months, for walks and trips on buggy days.', 'weather', ['Bug spray can start', 'See which kinds are okay from 2 months, and how to put it on.']],
    [4, 'Facing out may be next', 'Once {p} head is steady, {s} can face out in the carrier for short stretches.', 'carry', ['Facing out in the carrier', 'See when it’s okay, and for how long.']],
    [6, 'What changes for outings at 6 months', 'Sunscreen, the shopping cart’s own seat, snacks out, and babyproofing when you stay over.', 'errands', ['What changes for outings at 6 months', 'Sunscreen, the cart’s own seat, snacks out, and babyproofing when you stay over.']],
    [9, 'Watch the car seat’s limits', 'Many babies outgrow the infant seat this year. The label tells you when.', 'car', ['Check the infant car seat’s limits', 'Many babies outgrow it this year. See which seat comes next.']],
    [12, 'Rear-facing after the first birthday, too', 'Keep {o} rear-facing for as long as the seat allows.', 'car', ['Rear-facing past the first birthday', 'See why, and when a convertible seat comes in.']]
  ];
  // For the home screen: the update for this month, or the one coming next month (so trips can be planned ahead).
  window.oaUpdate = m => { const n = NOWS.find(x => x[4] && (x[0] === m || x[0] === m + 1)); return n ? { soon: n[0] > m, at: n[0], title: F(n[4][0]), body: F(n[4][1]), action: open(n[3]) } : null; };
  const nowFor = m => NOWS.filter(n => n[0] <= m).pop();
  const nextFor = m => NOWS.find(n => n[0] > m);
  function outAndAbout() {
    const m = ageNow(), v = stageFor(m), h = H(), n = nowFor(m), nx = nextFor(m);
    let b = `<header class="hub-hero oa-hero"><p class="hub-eyebrow">${F(m < 1 ? 'In the first weeks' : `At ${m} ${m === 1 ? 'month' : 'months'}`)}</p><h1>${F(n[1])}</h1><p class="hub-lead">${F(n[2])}</p></header>`;
    b += places(v) + seasonCard() + gear(v);
    b += h.versus('In the car', ['Every time', 'Look in the back seat before you walk away.'], ['Never', 'Leave Maya alone in the car, even for a minute.']);
    if (nx) b += h.next(`Coming up around ${nx[0]} months`, nx[1], open(nx[3]));
    b += h.note('Car seats, carriers and strollers each have their own limits. Check the label and the manual.');
    return `<div class="quiet-category hub-page" data-overview="${CAT}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${b}</div>`;
  }

  /* ---------- the diaper bag: tap to tick off, kept on this phone, packed for how Maya is fed ---------- */
  const BAG_KEY = 'ahead-bag';
  // Ticks only last for the day, so the list is always ready for the next outing with no upkeep.
  const today = () => (typeof NOW !== 'undefined' ? NOW : new Date()).toDateString();
  const bagGet = () => { try { const v = JSON.parse(localStorage.getItem(BAG_KEY) || '{}'); return v && v.day === today() && Array.isArray(v.have) ? v.have : []; } catch (e) { return []; } };
  window.oaBagToggle = function (k) {
    let have = bagGet(); have = have.includes(k) ? have.filter(x => x !== k) : have.concat(k);
    try { localStorage.setItem(BAG_KEY, JSON.stringify({ day: today(), have })); } catch (e) { /* the list still works for this visit */ }
    document.querySelectorAll(`.oa-pack[data-k="${k}"]`).forEach(el => { el.classList.toggle('is-on'); el.setAttribute('aria-pressed', el.classList.contains('is-on')); });
    const n = document.querySelector('.oa-pack-count'); if (n) n.textContent = `${document.querySelectorAll('.oa-pack.is-on').length} of ${document.querySelectorAll('.oa-pack').length} packed`;
  };
  window.oaBagReset = function () { try { localStorage.removeItem(BAG_KEY); } catch (e) { /* nothing saved */ } document.querySelectorAll('.oa-pack.is-on').forEach(el => oaBagToggle(el.dataset.k)); };
  function bagItems(m) {
    const f = feed();
    return [
      ['diaper', 'diapers', 'Diapers', m < 6 ? 'One for every 2 hours out, plus 2 spares' : 'One for every 3 hours out, plus 2 spares'],
      ['towel', 'wipes', 'Wipes and a changing pad', 'And a bag for dirty diapers'],
      ['shirt', 'clothes', 'A spare outfit', 'For {o}, and a top for you, for blowouts'],
      ['heart', 'burp', 'Burp cloths', ''],
      f !== 'Formula' ? ['bottle', 'pump', 'Your pump and bottles with lids', 'If you’ll pump while you’re out'] : null,
      f !== 'Formula' ? ['fridge', 'pumped', 'Pumped milk in a cooler with ice packs', 'If you’re bringing bottles'] : null,
      f !== 'Breast milk' ? ['bottle', 'formula', 'Formula for each feed, plus one', 'Ready-to-feed, or powder and water packed apart'] : null,
      f !== 'Breast milk' ? ['cup', 'bottles', 'Clean bottles', 'One for each feed'] : null,
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
    return `<section class="hub-card oa-bag"><div class="oa-bag-head"><b class="oa-pack-count">${on} of ${items.length} packed</b><button class="hub-link" onclick="oaBagReset()">Clear ticks</button></div><div class="oa-packs">${items.map(([icon, k, t, s]) => `<button class="oa-pack${have.includes(k) ? ' is-on' : ''}" data-k="${k}" aria-pressed="${have.includes(k)}" onclick="oaBagToggle('${k}')"><span class="oa-pack-art">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}</span><i aria-hidden="true">✓</i></button>`).join('')}</div></section>`;
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
  // The same timeline as Road trips' example drive, with words ("When you book") where the drive has clock times.
  const timeline = (title, items, caption) => { const c = YEAR_PALETTES[CAT]; return `<figure class="hub-figure hub-daymarks oa-timeline" role="img" aria-label="${F(caption)}" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}"><b class="hub-fig-title">${F(title)}</b><ol class="hub-daymarks-list">${items.filter(Boolean).map(([when, icon, text]) => `<li><i>${hubArt(icon, CAT)}</i><time>${F(when)}</time><span>${F(text)}</span></li>`).join('')}</ol></figure>`; };
  const good = (rows, heading = 'Good to know') => { const r = rows.filter(Boolean).slice(0, 3); return r.length ? H().list(heading, r.map(([icon, title, s]) => H().row({ icon, cat: CAT, title, sub: s }))) : ''; };
  const calls = (a, b) => H().versus('When to call', a, b);

  /* Every place page follows one layout, modeled on Road trips, so the tab reads as one piece:
       header → "Plan your …" (an example plan, in order) → "Pack for this" (only the extras on top of the everyday bag)
       → "When things don’t go to plan" (two to four what-ifs) → "Good to know" (at most 3). Going abroad adds "When to call".
     Gear pages: header → the one picture or steps → "Good to know". Written for every family: with or without a car,
     however the baby is fed. A fact lives on one page only. */
  const pack = items => { const it = items.filter(Boolean); return it.length ? `<section class="oa-extra"><b>${F('Pack for this')}</b><small>${F('On top of your everyday diaper bag')}</small><ul>${it.map(([icon, t, s]) => `<li><span class="oa-extra-art">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}</span></li>`).join('')}</ul></section>` : ''; };
  const ifs = (items, caption, heading = 'When things don’t go to plan') => `<h2 class="hub-h2">${F(heading)}</h2>` + steps(items, caption);
  const plan = (title, items, caption) => timeline(title, items, caption);

  function detail(id) {
    const m = ageNow(), bf = nursing(), fm = formula();
    const feedLine = bf && fm ? 'Nurse or give a bottle, wherever you’re comfortable.' : bf ? 'Nurse wherever you’re comfortable, or give a bottle of pumped milk.' : 'Give a bottle where you are. Formula doesn’t need warming.';

    if (id === 'errands') return sub('errands', 'Around town', m < 2 ? 'Your first trips out' : 'Short trips, home whenever you like', 'A walk, the store, a café or a friend’s. One or two stops is plenty.',
      plan('Plan your outing', [
        ['Before you leave', 'clock', 'Feed {o}. Right after a feed is the longest calm stretch.'],
        ['Getting there', 'stroller', 'On foot, a carrier or the stroller. In any car, even a taxi or a friend’s, {s} {ride|rides} in {p} own car seat.'],
        ['While you’re out', 'carrier', 'A carrier keeps your hands free, even if you bring the stroller too.'],
        m >= 6 ? ['Snack time', 'highchair', 'In a high chair with the strap on, and you right there.'] : null,
        ['Heading home', 'home', 'Before the next nap, or whenever you’ve had enough.']],
        'Feed first. Walk with a carrier or stroller, or ride in any car with the baby in their own car seat. A carrier keeps your hands free. Head home whenever you like.')
      + ifs([
        ['bottle', 'Hungry while you’re out', feedLine],
        ['heart', 'Crying in public', 'It happens to every parent. Step outside, walk with {o} close, or offer a feed.'],
        ['diaper', 'A blowout', 'Look for a family restroom. No table? Your changing pad on a clean flat spot works.'],
        ['home', 'You want to go home', 'Go. Leaving early still counts as a good outing.']],
        'If the baby is hungry, feed them where you are. Crying in public happens to everyone. For a blowout, find a family restroom or use your changing pad. Heading home early is fine.')
      + good([
        ['car', 'Car seats and shopping carts', m >= 6 ? 'Use the cart’s own seat with the strap on, not the infant seat on top.' : 'An infant seat can tip off the top of a cart. Use a carrier or the stroller.'],
        ['moon', 'Asleep in the car seat?', 'Fine while you ride. Once you’re home, move {o} to {p} crib.'],
        m >= 6 ? ['cup', 'At a café', 'Keep hot drinks and plates past {p} reach. {S} will grab.'] : ['hand', 'Holding {o}', 'It’s fine to ask people to wash their hands first, or to say no.']]));

    if (id === 'road') return sub('road', 'Road trips', 'Road trips', 'Plan a stop every couple of hours.',
      hubDayMarkers({ title: 'Plan your drive', events: [[9 * 60, 'car', 'Leave as a nap starts'], [11 * 60, 'bottle', 'Stop to feed and change'], [13 * 60, 'mat', 'Stop to feed and stretch'], [15 * 60, 'home', 'Arrive']], from: 8 * 60, to: 16 * 60, cat: CAT, caption: 'Leave at 9 as a nap starts, stop at 11 to feed and change, stop at 1 to feed and stretch, arrive at 3.' })
      + pack([['toy', 'Soft toys only', 'Hard ones can fly in a sudden stop'], fm ? ['bottle', 'One extra bottle', 'In case of traffic'] : null, bf ? ['fridge', 'A cooler bag with ice packs', 'If you’re bringing pumped milk'] : null])
      + ifs([
        ['car', 'Crying while you drive', 'Pull over somewhere safe, then take {o} out to soothe or feed.'],
        ['clock', 'Driving on your own', 'Plan a few more stops. Check on {o} only when you’re parked.'],
        m >= 6 ? ['bowl', 'Snack time', 'Only at a stop, out of the car seat.'] : null],
        'If the baby cries while you drive, pull over first. On your own, plan more stops and check on the baby only when parked.')
      + good([['clock', 'How long between breaks?', 'There’s no official limit. Every couple of hours suits most babies. Born early? Ask your pediatrician.'], ['moon', 'Naps on the road', 'Naps in the car seat are fine while you drive. When you stop, move {o} to a crib or play yard.'], bf ? ['mouth', 'Nursing or pumping on the road', 'Park first. {S} stays buckled in whenever the car is moving.'] : null]));

    if (id === 'fly') return sub('fly', 'Flying', 'Flying with Maya', 'Most of the planning happens when you book.',
      H().versus('Where will Maya sit?', ['Own seat', 'Safest, buckled into a car seat labeled for aircraft.'], ['On your lap', 'Often free under 2, but less safe if there’s turbulence.'])
      + plan('Plan your flight', [
        ['When you book', 'notepad', 'Add {o} to your booking, and ask about a bassinet seat.'],
        ['The car seat', 'car', 'For a seat on the plane, look for the red text on its label that says it’s certified for aircraft.'],
        ['At security', 'bag', bf && !fm ? 'Pumped milk and your pump can go through, if you bring them. Tell the officer.' : !bf ? 'Formula and water for {o} can go through. Tell the officer.' : 'Milk, formula and your pump can all go through. Tell the officer.'],
        ['At the gate', 'stroller', 'Ask for a gate-check tag. The stroller waits for you at the plane door.'],
        ['Takeoff and landing', 'plane', bf && !fm ? 'Nurse {o}, or offer a pacifier, to help {p} ears.' : 'Feed {o} or offer a pacifier to help {p} ears.']],
        'When you book, add the baby and ask about a bassinet seat. For a seat on the plane, check the car seat label says it’s certified for aircraft. Milk, formula and your pump can go through security. Gate-check the stroller. Feed or offer a pacifier at takeoff and landing.')
      + pack([fm ? ['bottle', 'One extra bottle', 'In case of delays'] : null, ['shirt', 'A spare top for you', 'For spit-up on board'], ['notepad', 'Proof of {p} age', 'Like {p} birth certificate, for a lap seat']])
      + ifs([
        ['heart', 'Crying on board', 'Walk the aisle when the seatbelt sign is off, or offer a feed. Most people understand.'],
        ['diaper', 'A diaper change', 'Ask the crew which restroom has the fold-down table.']],
        'If the baby cries, walk the aisle or offer a feed. Ask the crew which restroom has a changing table.')
      + good([['steth', 'Flying in the first weeks', 'Ask your pediatrician first.'], ['carrier', 'A carrier in the airport', 'Handy for getting through. Take {o} out of it before takeoff and landing.'], ['clock', 'Time zones', 'On a short trip, keep naps near home time. On a longer one, shift them a little each day.']]));

    if (id === 'abroad') return sub('abroad', 'Going abroad', 'Going abroad with Maya', 'Everything on Flying applies. These are the extra steps, and the passport comes first.',
      plan('Plan your trip', [
        ['As soon as you book', 'notepad', 'Apply for {p} passport in person. It can take several weeks.'],
        ['4–6 weeks before', 'steth', 'Ask your pediatrician about shots and malaria medicine, for {o} and for you. From 6 months, that includes an early measles shot.'],
        ['Before you leave', 'home', 'Save how you’d find a doctor there. Your hotel or travel insurance can help.']],
        'Apply for the passport as soon as you book. Four to six weeks before, ask the pediatrician about shots. Before you leave, save how you would find a doctor there.')
      + pack([['thermo', 'A thermometer', 'And the medicines your pediatrician okays'], ['drop', 'Rehydration salts', 'Ask your pediatrician which kind'], ['car', '{P} car seat', 'Taxis abroad may not have one']])
      + tiles('While you’re there', [['Water', 'Sealed bottled, or boiled', fm ? 'For formula, drinks and washing bottles' : 'For drinks and washing bottles'], ['Mosquitoes', 'Netting', 'Over the crib and stroller'], ['Food', 'Cooked, or fruit you peel', 'Once {s’s} eating solids'], ['Drinks', 'No ice', 'It’s often made with tap water']])
      + good([['notepad', 'If one parent can’t come', 'To the passport appointment, they can sign a consent form instead.']])
      + calls(['Call a doctor', 'A fever, fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', 'Any fever under 3 months or in a malaria area, trouble breathing, or hard to wake.']));

    if (id === 'away') return sub('away', 'Staying away', 'Staying with family or in a hotel', 'Most homes and hotel rooms aren’t set up for babies. Ten minutes when you arrive covers most of it.',
      plan('Plan your stay', [
        ['Before you go', 'notepad', 'Ask for a crib, or bring a play yard. At a hotel, ask for a room away from the pool.'],
        ['When you arrive', 'crib', 'Check the crib for loose or missing parts. Set it away from windows and cords, and empty it.'],
        ['At {p} level', m >= 6 ? 'lock' : 'bag', m >= 6 ? 'Move medicines, cleaners, cords and small things up high, and block any stairs.' : 'Put bags with medicines up high, yours and everyone else’s.'],
        m >= 6 ? ['Around the house', 'bath', 'Close bathroom doors. Near a pool or bath, an adult stays right beside {o}.'] : null,
        ['Bedtime', 'moon', 'The same bedtime steps as at home, in {p} own sleep sack.']],
        'Before you go, ask for a crib or bring a play yard. When you arrive, check and empty the crib, then make the room safe at the baby’s level. Keep the same bedtime steps.')
      + pack([['sack', '{P} sleep sack', 'It smells like home'], ['crib', 'The play yard’s own sheet', 'Only the one made for it'], ['moon', 'A night light', 'For feeds in a dark, new room']])
      + ifs([
        ['moon', 'A rough first night', 'New places can unsettle sleep. A few off nights are normal.'],
        ['heart', 'Well-meant advice', 'Share one rule kindly: on {p} back, in a bare crib.']],
        'A few off nights are normal. If you get advice, share one rule kindly: on the back, in a bare crib.')
      + good([['shield', 'Which crib is safe?', 'A play yard, or a crib made after June 2011. Never an adult bed or a couch.'], ['heart', 'Pets', 'Never leave {o} alone with a pet, even a gentle one.'], m >= 6 ? ['bowl', 'Grandparents and treats', 'Share the food rules once, kindly: no honey, juice or cow’s milk to drink before 1.'] : null]));

    if (id === 'water') return sub('water', 'Pool or beach', 'Pool or beach', 'In the water, hold {o} the whole time.',
      plan('Plan your day by the water', [
        ['Early', 'clock', 'Go in the morning, before the strongest sun.'],
        ['Set up', 'sun', m < 6 ? 'Shade first: an umbrella or canopy, and a hat.' : 'Shade, a hat, and sunscreen, SPF 30 or more.'],
        ['In the water', 'hand', 'Hold {o} the whole time, even with a float. Keep dips short.'],
        ['Before the nap', 'home', 'A feed in the shade, then home.']],
        'Go early, set up in the shade, hold the baby the whole time in the water with short dips, then feed in the shade and head home.')
      + pack([['diaper', 'Swim diapers', 'Most pools ask for one'], ['towel', 'A hooded towel', 'For warming up after a dip'], m >= 6 ? ['sun', 'Sunscreen', 'Again after the water'] : null])
      + ifs([
        ['snow', 'Shivering or blue lips', 'Out of the water. Dry and wrap {o} up.'],
        ['sun', 'Flushed and fussy', 'Move to the shade and offer a feed.']],
        'If the baby shivers or their lips turn blue, take them out and wrap them up. If flushed and fussy, move to the shade and feed.')
      + good([['shield', 'Floats aren’t safety gear', 'Arm floats and baby floats don’t prevent drowning.'], ['hand', 'Hot sand and decks', 'They can burn little feet. Keep shoes or a blanket handy.']]));

    if (id === 'weather') {
      const view = weatherView || season();
      const seg = `<div class="hub-seg oa-seg" role="tablist">${[['hot', 'Hot days'], ['cold', 'Cold days']].map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaWeather('${k}')">${t}</button>`).join('')}</div>`;
      const hot = `<h2 class="hub-h2">${F('What to do')}</h2>` + steps([['clock', 'Go out early or late', 'When it’s cooler out'], m < 6 ? ['sun', 'Shade, not sunscreen', 'Only if there’s no shade: a little on the face'] : ['sun', 'Sunscreen', 'SPF 30 or more, every 2 hours'], ['bottle', 'Keep {o} hydrated', m < 6 ? 'With extra milk feeds. No water before 6 months' : 'With extra milk feeds and sips of water'], ['car', 'Cool the car first', 'Then touch the car seat buckles: they can burn']], 'Go out early or late, keep her in the shade, keep her hydrated with extra milk feeds, and cool the car first.')
        + good([['thermo', 'How hot is too hot?', 'When the heat index is 90°F or more, keep outings short or stay in.'], m >= 2 ? ['leaf', 'Bug spray, from 2 months', 'Up to 30% DEET, or picaridin. Spray your hands, then rub it on {p} skin, not {p} hands.'] : ['leaf', 'Bug spray, from 2 months', 'Not yet. Until then, use netting over the stroller.'], ['fridge', 'Milk on hot days', 'Keep it in a cooler with ice packs, never in a hot car.']])
        + calls(['Call your pediatrician', 'Any sunburn, or fewer wet diapers than usual.'], ['Call 911', 'Hot to the touch and floppy or hard to wake.']);
      const cold = `<h2 class="hub-h2">${F('What to do')}</h2>` + steps([['clock', 'Warm up the car first', 'So {s} can ride in thin layers'], ['car', 'In the car seat', 'Thin layers, then a blanket over the buckled straps'], ['shirt', 'One more layer on walks', 'Plus a hat and mittens'], ['hand', 'Check if {s’s} warm enough', 'Feel {p} chest. Cold hands are normal']], 'Warm up the car first. In the car seat, thin layers with a blanket over the buckled straps. On walks, one more layer than you. Feel her chest to check she’s warm enough.')
        + good([['snow', 'How cold is too cold?', 'There’s no set temperature. Keep walks short when it’s very cold or windy.'], ['carrier', 'In a carrier', 'Your coat can go over you both, with {p} face uncovered.'], ['home', 'Once you’re somewhere warm', 'Take off {p} hat and extra layers, so {s} {don’t|doesn’t} overheat.']])
        + calls(['Call your pediatrician', 'Skin that’s pale, gray or blistered after being out in the cold.'], ['Call 911', 'Cold to the touch and floppy or hard to wake.']);
      return sub(view, 'Hot and cold days', view === 'hot' ? 'Hot days out' : 'Cold days out', view === 'hot' ? 'Babies heat up faster than you do.' : 'Babies lose heat faster than you do.',
        seg + (view === 'hot' ? hot : cold));
    }

    // Car seat: one page from birth past the first birthday. Next car seat and rear-facing after 1 live here now.
    if (id === 'car' || id === 'bigger' || id === 'after1') {
      const install = `<h2 class="hub-h2">${F('Setting it up')}</h2>` + steps([['car', 'Pick one way to install it', 'Lower anchors or the seat belt, not both'], ['hand', 'Check it’s tight', 'Tug where it’s belted in: less than 1 inch of movement'], ['back', 'Set the recline', 'To the angle line on the seat'], ['shield', 'Buckle {o} in snugly', 'Harness straps at or below {p} shoulders']], 'Install it with the lower anchors or the seat belt, not both, so it moves less than 1 inch where it’s belted. Set the recline to the angle line. Buckle the straps at or below the shoulders.', true);
      // One page for the whole first year and beyond: no stages, so the seat-by-seat path shows from day one,
      // and Good to know holds what's true at any age. The home's "Coming up" card points back here when the limits matter.
      return sub('gear', 'Your gear', 'Car seat basics', 'Rear-facing in the back seat, for as long as the seat allows.',
        hubFigure('carseat', CAT, 'Rear-facing in the back seat, chest clip level with the armpits, straps snug with no slack to pinch, and no puffy coat underneath.')
        + install
        + hubStageStrip({ title: 'Which seat, and when', numbered: true, items: [['car', 'Infant seat', 'Rear-facing, from birth until its height or weight limit'], ['car', 'Convertible seat', 'Still rear-facing. Legs touching the seat back is fine'], ['car', 'Forward-facing', 'Only after its rear-facing limits, often age 2 or older']], cat: CAT, caption: 'An infant seat rear-facing from birth until its height or weight limit, then a convertible seat still rear-facing, and forward-facing only after its rear-facing limits, often age 2 or older.' })
        + good([['car', 'Taxis and other people’s cars', 'Bring {p} car seat. Most can be installed with just the seat belt.'], ['notepad', 'Only what came with it', 'Skip add-on inserts and head supports, and use a secondhand seat only if you know its history.'], ['steth', 'A free check', 'A certified car seat technician can check your install, usually for free.']]));
    }

    // Carrier and stroller follow Car seat: the same page at every age, with how it changes shown as a path from day one.
    if (id === 'carry') return sub('gear', 'Your gear', 'Carrier basics', 'A quick check every time keeps {o} breathing easy.',
      hubFigure('carrier', CAT, 'In a carrier: face visible and close enough to kiss, chin off the chest, knees up in an M shape, back supported.')
      + hubStageStrip({ title: 'Ways to carry, as {s} {grow|grows}', numbered: true, items: [['carrier', 'Facing in', 'From birth, face above the fabric'], ['carrier', 'Facing out', 'Once {p} head is steady, for short awake times'], ['carrier', 'On your back', 'Once {s} {sit|sits} steadily and the label allows']], cat: CAT, caption: 'Facing in from birth, facing out once the head is steady for short awake times, and on your back once sitting steadily and the label allows.' })
      + good([['hand', 'Snug enough', 'When you lean forward, {s} {stay|stays} against you without slumping.'], ['moon', 'Asleep in the carrier', 'Keep {p} face visible, and move {o} to a flat bed when you can.'], ['cup', 'Away from the stove', 'And from hot drinks, while {s’s} in the carrier.']]));

    if (id === 'stroller') return sub('gear', 'Your gear', 'Stroller basics', 'Harness on every time, and brakes on whenever you stop.',
      hubFigure('stroller', CAT, 'Harness on every time, brakes on when you stop, no bags on the handles and no blanket over the top.')
      + hubStageStrip({ title: 'Lying back, then sitting up', numbered: true, items: [['stroller', 'Lying back', 'From birth, or with the infant car seat clicked on'], ['stroller', 'Sitting up', 'Once {s} can sit steadily on {p} own, as the label allows']], cat: CAT, caption: 'Lying back from birth, or with the infant car seat clicked on, then sitting up once the baby can sit steadily, as the label allows.' })
      + good([['sun', 'Why no blanket over the top', 'It traps heat. Use the canopy instead.'], ['car', 'A car seat on the frame', 'Listen for the click, then tug to check it’s locked on.'], ['stroller', 'On a bus or train', 'Brakes on and a hand on the stroller while it moves.']]));

    if (id === 'bag') return sub('gear', 'Your gear', 'Packing the diaper bag', 'Packed for how Maya is fed. Ticks clear by the next day, so it’s ready for every outing.',
      bagList(m) + good([fm && ['bottle', 'Mixed formula', 'Use it within 2 hours of mixing, or within 1 hour once the feed starts.'], bf && ['fridge', 'Pumped milk', 'Keeps 4 hours at room temperature, or a day in a cooler with frozen ice packs.']]));

    if (id === 'sick') return detail('abroad');
    if (id === 'snacks') return detail('errands');
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
