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
  // Food and sitting follow Feeding's age (adjusted for babies born early); gear sizes and shots keep the birthday.
  const careAge = () => (typeof hubAgeFor === 'function' ? hubAgeFor('care', ageNow()) : ageNow());
  const eats = () => careAge() >= 6;
  const feed = () => (typeof profile !== 'undefined' && profile.feed) || 'Breast milk';
  const nursing = () => feed() !== 'Formula';
  const how = () => (typeof profile !== 'undefined' && profile.feedHow) || '';
  const pumps = () => how() !== 'Nursing'; // breast milk in bottles: pumped, or stored after weaning
  const pumping = () => pumps() && how() !== 'Stored'; // a pump comes along
  const formula = () => feed() !== 'Breast milk';
  // Moving, as the parent reported it in Safety (crawling or pulling up), never claimed from age alone.
  const moving = () => live() && typeof currentSafetyMovementStage === 'function' && ['moving', 'pulling'].includes(currentSafetyMovementStage());
  // Hot or cold, from the date: the weather page opens on the season the parent is in.
  const season = () => { const mo = (typeof NOW !== 'undefined' ? NOW : new Date()).getMonth(); return mo >= 4 && mo <= 8 ? 'hot' : mo >= 10 || mo <= 2 ? 'cold' : 'hot'; };
  let weatherView = null;
  const phaseView = {};   // which trip step each place page shows (see phases())

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

  // Destination pictures (Nov 13): one recognizable object per place, in the place's own colors, so the tiles say where at a glance.
  // They replace the earlier abstract shapes, on the tiles and on each place's page header.
  const PLACE_ART = {
    errands: c=>`<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M10 14h26l-2 23H12Z" fill="${c[3]}"/><path d="M16 15c0-9 14-9 14 0" stroke="${c[1]}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/></svg>`,
    road: c=>`<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M6 22c2-7 6-10 14-10h16c6 0 10 4 13 10h6c3 0 5 2 5 5v4H6Z" fill="${c[2]}"/><path d="M22 14h12l6 8H18Z" fill="#fff" opacity=".8"/><circle cx="18" cy="32" r="5" fill="${c[1]}" opacity=".75"/><circle cx="48" cy="32" r="5" fill="${c[1]}" opacity=".75"/><path d="M4 38h80" stroke="${c[3]}" stroke-width="3" stroke-linecap="round"/></svg>`,
    fly: c=>`<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M8 24 54 10c6-2 10 0 10 3s-3 5-8 6L14 29Z" fill="${c[2]}"/><path d="M28 18 22 4h7l14 10Z" fill="${c[1]}" opacity=".55"/><path d="M30 26l-4 11h7l10-14Z" fill="${c[1]}" opacity=".55"/><path d="M10 25 5 16h5l7 7Z" fill="${c[1]}" opacity=".55"/></svg>`,
    away: c=>`<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="8" y="12" width="36" height="25" rx="5" fill="${c[2]}"/><path d="M19 12V7c0-2 1-3 3-3h8c2 0 3 1 3 3v5" stroke="${c[1]}" stroke-width="2.4" fill="none" opacity=".7"/><path d="M8 22h36" stroke="#fff" stroke-width="2.4"/></svg>`,
    abroad: c=>`<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="10" y="4" width="26" height="34" rx="4" fill="${c[2]}"/><circle cx="23" cy="18" r="7" fill="none" stroke="#fff" stroke-width="2"/><path d="M16 18h14M23 11c-4 4-4 10 0 14M23 11c4 4 4 10 0 14" stroke="#fff" stroke-width="1.4" fill="none"/><path d="M17 31h12" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
    water: c=>`<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M8 16c4-12 34-12 38 0Z" fill="${c[3]}"/><path d="M27 15v20" stroke="${c[1]}" stroke-width="2.4" stroke-linecap="round" opacity=".6"/><path d="M4 33c5-4 9-4 14 0s9 4 14 0 9-4 14 0 9 4 14 0" stroke="${c[2]}" stroke-width="3.4" fill="none" stroke-linecap="round"/></svg>`,
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
  Object.assign(SHAPE, PLACE_ART);

  /* ---------- Show, don't tell (Nov 19) ----------
     Real photos where a parent needs to recognize something: the destination tiles, the carrier and stroller checks,
     the car seat on cold days, where the baby sits on a plane, and where the baby sleeps away from home.
     Made in Canva; tags follow Safety's rules (a detail a parent could miss, beside the thing, never on it).
     window.__oaOld = true shows the earlier version. */
  const SHOW = () => !window.__oaOld;
  const PH = k => `assets/outings/${k}.jpg`;
  const TILE_PHOTO_ALL = { errands: 'town', road: 'road', fly: 'fly', away: 'away', abroad: 'abroad', water: 'beach' };
  const TILE_PHOTO = { errands: 'town', road: 'road', fly: 'fly', away: 'away', abroad: 'abroad', water: 'beach' };
  const pinsHtml = list => (list || []).map(([label, x, y, side]) => `<span class="sf-pin oa-pin oa-pin-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(label)}</span></span>`).join('');
  // One photo with its tags, then the rows that say what to check.
  const checkRows = rows => `<ul class="oa-checkrows">${rows.filter(Boolean).map(([i, t, s]) => `<li><span class="oa-checkdot">${hubArt(i, CAT)}</span><span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}</span></li>`).join('')}</ul>`;
  const photoCard = (src, alt, pins, rows, cls = '') => `<section class="oa-photo-card${cls}"><figure class="oa-photo"><img src="${src}" alt="${F(alt)}" loading="lazy">${pinsHtml(pins)}</figure>${rows ? checkRows(rows) : ''}</section>`;
  // A same-scene before and after (Safety's Template 9 look), labels above the photos, at most one tag on the after.
  const beforeAfter = (b, a, rows, pos = ['50%', '50%']) => `<section class="oa-photo-card"><div class="oa-ba">${[b, a].map(([src, alt, label, pin], k) => `<figure><figcaption class="${k ? 'is-after' : 'is-before'}"><span class="oa-mark" aria-hidden="true">${k ? '✓' : '✕'}</span>${F(label || (k ? 'After' : 'Before'))}</figcaption><div class="oa-ba-img"><img src="${src}" alt="${F(alt)}" loading="lazy" style="object-position:${pos[k]} 50%">${pin ? pinsHtml([pin]) : ''}</div></figure>`).join('')}</div>${rows ? checkRows(rows) : ''}</section>`;
  // Two choices side by side, each a photo with its verdict under it.
  // Every page's header shows its own photo beside the headline (her inspiration and Sleep's mockup), in place of the flat art.
  const PAGE_PHOTO = { errands: 'town', road: 'road', fly: 'fly', away: 'away', abroad: 'abroad', water: 'beach', hot: 'hot-head', cold: 'cold-head', car: 'car-head', bigger: 'car-head', after1: 'car-head', carry: 'gear-carrier', stroller: 'gear-stroller', bag: 'gear-bag' };
  let headPhoto = null;
  // Things that come in order (seats, ways to carry), as photo cards side by side with when and one line under each.
  const photoSteps = (title, items) => `<h2 class="hub-h2">${F(title)}</h2><div class="oa-psteps" style="--n:${items.length}">${items.map(([src, alt, when, line]) => `<figure><img src="${src}" alt="${F(alt)}" loading="lazy"><figcaption><b>${F(when)}</b><small>${F(line)}</small></figcaption></figure>`).join('')}</div>`;
  // What the label on an airplane-approved car seat says, drawn so the red word is easy to find on your own seat.
  const aircraftLabel = () => `<section class="oa-label-card"><p class="oa-label-k">${F('Look for this on the car seat’s label')}</p><div class="oa-label"><span>${F('This restraint is certified for use in motor vehicles and')} <em>${F('aircraft')}</em>.</span></div><p class="oa-label-k is-sub">${F('“Aircraft” in red text means it can go on the plane.')}</p></section>`;
  const choicePair = (items) => `<section class="oa-photo-card"><div class="oa-choice">${items.map(([src, alt, title, line, ok]) => `<figure><img src="${src}" alt="${F(alt)}" loading="lazy"><figcaption class="${ok ? 'is-ok' : 'is-meh'}"><b>${F(title)}</b><small>${F(line)}</small></figcaption></figure>`).join('')}</div></section>`;

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
      + (SHOW() && headPhoto ? `<div class="dev-area-head ss-head oa-photo-head" style="--area:${c[0]};--area-ink:${c[1]}"><div class="oa-head-copy"><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div><img class="oa-head-img" src="${PH(headPhoto)}" alt=""></div>`
        : `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}"><span class="dev-area-head-art">${(SHAPE[key] || SHAPE.gear)(c)}</span><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`)
      + inner + `</div>`;
  }

  /* ---------- the home screen ---------- */
  const PLACES = [
    ['errands', 'Around town', ['Your first trips out', 'A walk, the store, eating out']],
    ['road', 'Road trips', ['Long drives and stops']],
    ['fly', 'Flying', ['Booking, security, the flight']],
    ['away', 'Staying away', ['Family, friends or a hotel']],
    ['abroad', 'Going abroad', ['Passport, shots and water', 'Passport, shots and water', 'Passport, shots, food and water']],
    ['water', 'Pool or beach', ['Shade, and holding on']]
  ];
  const placeSub = (id, subs, v) => {
    if (id === 'away' && v === 2) return moving() ? 'Babyproof it in 10 minutes' : 'Family, friends or a hotel';
    if (id === 'abroad') return subs[eats() ? 2 : 1];
    if (id === 'weather') return season() === 'cold' ? 'Dressing for walks and the car' : 'Heat, sun and the pool';
    return subs[Math.min(v, subs.length - 1)];
  };
  const places = v => { Object.keys(phaseView).forEach(k => delete phaseView[k]); return placesHtml(v); };   // pages open on step 1 when you come in from the home
  const placesHtml = v => `<h2 class="hub-h2">${F('Where are you headed?')}</h2><div class="oa-places">${PLACES.map(([id, label, subs]) => { const c = PAL[id === 'weather' ? season() : id]; const ph = SHOW() && TILE_PHOTO[id]; return `<button class="oa-place${ph ? ' has-photo' : ''}" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="${open(id)}">${ph ? `<span class="oa-place-photo"><img src="${PH(ph)}" alt="" loading="lazy"></span>` : `<span class="oa-place-art">${SHAPE[id](c)}</span>`}<b>${F(label)}</b><small>${F(placeSub(id, subs, v))}</small></button>`; }).join('')}</div>`;
  // Hot or cold isn't a place, so it's one quiet card for the season, under the places.
  const seasonCard = () => { const k = season(), c = PAL[k]; return `<button class="hub-next oa-season" style="background:${c[0]}" onclick="${open('weather')}"><span><small style="color:${c[1]}">${F('This season')}</small><b>${F(k === 'hot' ? 'Hot days out: shade, drinks and the car' : 'Cold days out: layers and the car seat')}</b></span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  const GEAR_C = { car: ['#e7effc', '#46638c'], stroller: ['#e6f5ec', '#356651'], carrier: ['#fdeef2', '#a24d6a'], bag: ['#fff3dc', '#8a6a2a'], snack: ['#fdeee6', '#9a5a3c'] };
  const GEAR_PH = { car: 'seat-infant', stroller: 'gear-stroller', carrier: 'gear-carrier', bag: 'gear-bag' };
  const gearRow = (icon, key, title, sub, id, chip) => `<button class="hub-row oa-row${SHOW() ? ' has-photo' : ''}" style="--hl-bg:${GEAR_C[key][0]};--hl-ink:${GEAR_C[key][1]}" onclick="${open(id)}">${SHOW() ? `<span class="oa-gear-img"><img src="${PH(GEAR_PH[key])}" alt="" loading="lazy"></span>` : `<span class="oa-dot">${hubArt(icon, CAT)}</span>`}<span class="hub-row-copy"><b>${F(title)}</b><small>${F(sub)}</small>${chip ? `<span class="hub-chip">${F(chip)}</span>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  function gear(v) {
    const n = bagItems(ageNow()).length, on = bagItems(ageNow()).filter(i => bagGet().includes(i[1])).length;
    return `<h2 class="hub-h2">${F('Your gear')}</h2><div class="hub-list">`
      + gearRow('car', 'car', 'Car seat', 'Which seat when, and how to install it', 'car')
      + gearRow('stroller', 'stroller', 'Stroller', 'Harness, brakes and the right recline', 'stroller')
      + gearRow('carrier', 'carrier', 'Carrier', 'Facing in, facing out, and on your back', 'carry')
      + gearRow('bag', 'bag', 'Diaper bag', 'Packed for how Maya is fed', 'bag', on ? `${on} of ${n} packed` : '')

      + `</div>`;
  }
  // What's new for outings, month by month: [from month, headline, one line, the page it opens].
  // What changes with age in this tab: [month, headline, one line, the page it opens, home row].
  // Only the three gear changes get a home row (see briefing.js): facing out, moving up from the infant seat, and
  // rear-facing past 1. Each depends on the gear's label, so the row says to check it, never that it's time.
  const NOWS = [
    [0, 'Short outings are good for you both', 'Fresh air and a change of scene help you both.', 'errands'],
    [2, 'Ready for a longer trip?', 'As feeds spread out, a long drive or a first flight gets easier.', 'road'],
    [4, 'Ready to face out?', 'Once Maya holds {p} head steady, check your carrier’s limits.', 'carry', ['Ready to face out?', 'Once Maya holds {p} head steady, check your carrier’s limits. Its instructions say when.', 'See the carrier guide']],
    [6, 'Snacks on the go, and {p} first overnight trip', 'The shopping cart’s own seat, snacks out, and babyproofing when you stay over.', 'errands'],
    [9, 'Watch the car seat’s limits', 'Moving to a convertible seat depends on the infant seat’s height and weight limits, printed on a sticker on the seat.', 'car', ['Maya may outgrow the infant car seat soon', 'Many babies do in the first year. The height and weight limits are on a sticker on the seat.', 'See which seat comes next']],
    [12, 'Rear-facing after the first birthday, too', 'Keep {o} rear-facing for as long as the seat allows.', 'car', ['Keep Maya rear-facing after the first birthday', 'Until the seat’s rear-facing limits, often age 2 or older. It protects {p} head and neck best.', 'See why it matters']]
  ];
  // For the home screen: the update for this month, or the one coming next month (so trips can be planned ahead).
  window.oaUpdate = m => { const n = NOWS.find(x => x[4] && (x[0] === m || x[0] === m + 1)); return n ? { soon: n[0] > m, at: n[0], title: F(n[4][0]), body: F(n[4][1]), label: n[4][2], action: open(n[3]) } : null; };
  // The 6-month card is about snacks and the cart seat, so it waits for Feeding's age; the rest go by birthday.
  const due = (n, m) => n[0] <= (n[0] === 6 ? Math.min(m, careAge()) : m);
  const nowFor = m => NOWS.filter(n => due(n, m)).pop();
  const nextFor = m => NOWS.find(n => n[0] > m && !due(n, m));
  function outAndAbout() {
    if (SHOW()) return home3();
    const m = ageNow(), v = stageFor(m), h = H(), n = nowFor(m), nx = nextFor(m);
    const HERO_PH = { 0: 'town', 2: 'road', 4: 'carry-out', 6: 'highchair', 9: 'seat-infant', 12: 'seat-convertible' };
    let b = `<header class="hub-hero oa-hero${SHOW() ? ' has-photo' : ''}">${SHOW() ? `<img class="oa-hero-img" src="${PH(HERO_PH[n[0]])}" alt="">` : ''}<p class="hub-eyebrow">${F(m < 1 ? 'In the first weeks' : `At ${m} ${m === 1 ? 'month' : 'months'}`)}</p><h1>${F(n[1])}</h1><p class="hub-lead">${F(n[2])}</p><button class="cc-hero-go oa-hero-go" onclick="${open(n[3])}">${F(n[4] ? n[4][2] : ({ errands: 'See around town', road: 'Plan a longer trip' })[n[3]] || 'See the guide')} ›</button></header>`;
    b += places(v) + seasonCard() + gear(v);
    b += h.versus('In the car', ['Every time', 'Look in the back seat before you walk away.'], ['Never', 'Leave Maya alone in the car, even for a minute.']);
    if (nx) b += h.next(`Next · around ${nx[0]} months`, nx[1], open(nx[3]), '', { 2: 'Plan a first long drive or flight around feeds.', 4: 'Check your carrier’s limits before facing out.', 6: 'Pack snacks, and a travel crib for overnights.', 9: 'Check the height and weight sticker on the car seat.', 12: 'Check the seat’s rear-facing limits on its label.' }[nx[0]] || '');
    // Only when neither the top card nor Coming up already talks about gear limits, so it's never said twice.
    if (!n[4] && !(nx && nx[4])) b += h.note('Car seats, carriers and strollers each have their own height and weight limits. You’ll find them in the manual and on the gear itself.');
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
  window.oaBagReset = function () {
    // Clear what's saved, then clear the screen. (It used to call oaBagToggle on each ticked item, which saved them all again.)
    try { localStorage.removeItem(BAG_KEY); } catch (e) { /* nothing saved */ }
    document.querySelectorAll('.oa-pack.is-on').forEach(el => { el.classList.remove('is-on'); el.setAttribute('aria-pressed', 'false'); });
    const n = document.querySelector('.oa-pack-count'); if (n) n.textContent = `0 of ${document.querySelectorAll('.oa-pack').length} packed`;
  };
  function bagItems(m) {
    const f = feed();
    return [
      ['diaper', 'diapers', 'Diapers', m < 6 ? 'One for every 2 hours out, plus 2 spares' : 'One for every 3 hours out, plus 2 spares'],
      ['towel', 'wipes', 'Wipes and a changing pad', 'And a bag for dirty diapers'],
      ['shirt', 'clothes', 'A spare outfit', 'For {o}, and a top for you, for blowouts'],
      ['mouth', 'burp', 'Burp cloths', ''],
      f !== 'Formula' && pumping() ? ['bottle', 'pump', 'Your pump and bottles with lids', 'If you’ll pump while you’re out'] : null,
      f !== 'Formula' && pumps() ? ['fridge', 'pumped', 'Pumped milk in a cooler with ice packs', 'If you’re bringing bottles'] : null,
      f !== 'Formula' && !pumps() ? ['heart', 'cover', 'A nursing cover or scarf', 'Only if you like one'] : null,
      f !== 'Breast milk' ? ['cube', 'formula', 'Formula for each feed, plus one', 'Or powder and water, kept apart'] : null,
      f !== 'Breast milk' ? ['cup', 'bottles', 'Clean bottles', 'One for each feed'] : null,
      m < 12 ? ['pacifier', 'pacifier', 'A pacifier, if {s} {use|uses} one', 'And a spare'] : null,
      ['sun', 'hat', 'A hat', 'Sun hat or warm hat'],
      ['sack', 'layer', 'An extra layer', 'For cold or air-conditioned places'],
      ['hand', 'sanitizer', 'Hand sanitizer', 'For you, before feeds and changes'],
      eats() ? ['bowl', 'snacks', 'Soft snacks and a spoon', ''] : null,
      eats() ? ['drop', 'cup', 'Water in a cup', ''] : null
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
  // What-ifs are a situation and what to do, so they read as rows (tiles squeeze the sentence into a narrow column).
  const ifs = (items, caption, heading = 'When things don’t go to plan') => rows(items, heading);
  const plan = (title, items, caption) => timeline(title, items, caption);

  // Staying away: the setup is a checklist, ticked off in each new place. Ticks are kept on this phone; "Start over" clears them.
  const AWAY_KEY = 'ahead-away';
  const awayItems = m => [['Ask for a crib, or bring a play yard', 'Most hotels have one. Ask when you book', 'notepad'], ['Check the crib, then empty it', 'No loose or missing parts. Away from windows and cords', 'crib'], m >= 6 ? ['Medicines and cleaners up high', 'Cords and small things too, at {p} level. Block any stairs', 'lock'] : ['Bags with medicines up high', 'Yours and everyone else’s', 'bag'], m >= 6 ? ['Bathroom doors closed', 'And an adult right beside {o} near any water', 'bath'] : null, ['Same bedtime as at home', 'The same steps, in {p} own sleep sack', 'clock']].filter(Boolean);
  window.oaAwayTick = i => { let on = []; try { on = JSON.parse(localStorage.getItem(AWAY_KEY)) || []; } catch (e) {} on = on.includes(i) ? on.filter(x => x !== i) : on.concat(i); try { localStorage.setItem(AWAY_KEY, JSON.stringify(on)); } catch (e) {} const y = scrollY; render(); scrollTo(0, y); };
  window.oaAwayReset = () => { try { localStorage.removeItem(AWAY_KEY); } catch (e) {} const y = scrollY; render(); scrollTo(0, y); };
  const awayList = m => { let on = []; try { on = JSON.parse(localStorage.getItem(AWAY_KEY)) || []; } catch (e) {} return `<div class="oa-away-head"><h2 class="hub-h2">${F('Set up your stay')}</h2>${on.length ? `<button class="hub-link" onclick="oaAwayReset()">${F('Start over')}</button>` : ''}</div>` + H().ticks(awayItems(m), i => on.includes(i), i => `oaAwayTick(${i})`, CAT); };

  /* Steps (Nov 14): long trip pages (Flying, Staying away) are split into the steps of the trip and show one step at a time,
     so the page stays short. Shorter pages (under about two screens) stay one page: a tap there costs more than the scroll it saves. The numbered bar is the overview of the whole trip; "Then: …" at the end of a step opens the next one.
     Every line from the one-page version is kept, in the step where it's needed. */
  window.oaPhase = (id, i, jump) => { phaseView[id] = i; render(); const bar = document.querySelector('#main .oa-steps'); if (jump && bar) scrollTo(0, bar.getBoundingClientRect().top + scrollY - 70); };
  const PHASE_ICON = { Book: 'notepad', Airport: 'bag', 'On board': 'plane', Arrive: 'home', 'Before you go': 'bag', 'While you’re there': 'sun', 'When you arrive': 'home', 'Settling in': 'moon' };
  const phases = (id, list) => {
    const ps = list.filter(Boolean), i = Math.min(phaseView[id] || 0, ps.length - 1), c = PAL[id];
    const bar = `<div class="oa-steps${SHOW() ? ' oa-tabs' : ''}" role="tablist" style="--oa-ink:${c[1]};--oa-bg:${c[0]};--oa-acc:${c[2]};--n:${ps.length}">${ps.map(([label], k, _a, icon = PHASE_ICON[label]) => `<button role="tab" aria-selected="${k === i}" class="${k === i ? 'is-on' : ''}${k < i ? ' is-done' : ''}" onclick="oaPhase('${id}',${k})"><span>${SHOW() && icon ? hubArt(icon, CAT) : k + 1}</span><b>${F(label)}</b></button>`).join('')}</div>`;
    const next = ps[i + 1] ? `<button class="hub-link oa-then" style="color:${c[1]}" onclick="oaPhase('${id}',${i + 1},1)">${F('Then: ' + ps[i + 1][0])} ›</button>` : '';
    return bar + ps[i][1] + next;   // no wrapper: the page's own styles expect these blocks directly on the page
  };
  const rows = (items, heading = '') => H().list(heading, items.filter(Boolean).map(([icon, title, s]) => H().row({ icon, cat: CAT, title, sub: s })));

  function detail(id) {
    if (SHOW()) { const p3 = detail3(id); if (p3) return p3; }
    headPhoto = PAGE_PHOTO[id === 'weather' ? (weatherView || season()) : id] || null;
    const m = ageNow(), bf = nursing(), fm = formula();
    const feedLine = bf && fm ? 'Nurse or give a bottle, wherever you’re comfortable.' : bf ? 'Nurse wherever you’re comfortable, or give a bottle of pumped milk.' : 'Give a bottle where you are. Formula doesn’t need warming.';

    if (id === 'errands') return sub('errands', 'Around town', m < 2 ? 'Your first trips out' : 'Short trips, home whenever you like', 'A walk, the store, a restaurant or a friend’s. One or two stops is plenty, and leaving early still counts.',
      plan('Plan your outing', [
        ['Before you go', 'clock', 'Feed first. Right after a feed is the calmest stretch.'],
        ['Getting there', 'car', 'In any car, even a taxi or a friend’s, {s} {ride|rides} in {p} own car seat.'],
        ['While you’re out', 'carrier', 'A carrier keeps your hands free, even with the stroller.'],
        eats() ? ['Snack time', 'highchair', 'In a high chair, strapped in, with you right there.'] : ['Heading home', 'home', 'Before the next nap, or sooner.']],
        'Feed first. In any car, she rides in her own car seat. A carrier keeps your hands free. Head home before the next nap, or sooner.')
      + (SHOW() ? `<h2 class="hub-h2">${F('At the store')}</h2>` + beforeAfter(
          [PH('cart-before'), 'An infant car seat balanced on top of a shopping cart', 'Seat on the cart', ['Can tip off', 50, 40, 'b']],
          [PH('cart-after'), 'A parent pushing a cart with the baby in a carrier on their chest', 'In a carrier', null],
          [['car', 'Never the infant seat on top', 'It can tip the cart, or fall off'], eats() ? ['shield', 'Or the cart’s own seat', 'With the strap on, once {s} {sit|sits} steadily'] : ['stroller', 'Or bring the stroller', 'And put the shopping underneath']]) : '')
      + ifs([
        ['bottle', 'Hungry while you’re out', feedLine],
        ['heart', 'Crying in public', 'Step outside, or walk with {o} close.'],
        ['diaper', 'A blowout', 'A family restroom, or your changing pad on a clean flat spot.']],
        'If the baby is hungry, feed them where you are. Crying in public happens to everyone. For a blowout, find a family restroom or use your changing pad.')
      + good([
        SHOW() ? null : ['shield', 'Car seats and shopping carts', eats() ? 'Use the cart’s own seat with the strap on, not the infant seat on top.' : 'An infant seat can tip off the top of a cart. Use a carrier or the stroller.'],
        eats() ? ['bowl', 'Eating out', 'A steady high chair, strapped in and pulled back from the table. Hot food to the middle.'] : ['bowl', 'Eating out', 'The car seat stays on the floor or in the stroller, never on top of a high chair.'],
        bf && pumps() ? ['fridge', 'Pumped milk', 'Fine cool or at room temperature. No need to warm it.'] : null,
        eats() ? ['bag', 'Bring {p} own food', 'Something soft from home, a bib and a spoon. A placemat keeps the tray clean.'] : ['hand', 'Holding {o}', 'It’s fine to ask people to wash their hands first, or to say no.']]));

    if (id === 'road') return sub('road', 'Road trips', 'Long drives go best in 2-hour stretches', 'Plan a stop every 2 hours to feed, change and stretch.',
      hubDayMarkers({ title: 'Plan your drive', events: [[9 * 60, 'car', 'Leave as a nap starts'], [11 * 60, 'bottle', 'Stop to feed and change'], [13 * 60, 'mat', eats() ? 'Stop for a snack and a stretch' : 'Stop to feed and stretch'], [15 * 60, 'home', 'Arrive']], from: 8 * 60, to: 16 * 60, cat: CAT, caption: 'Leave at 9 as a nap starts, stop at 11 to feed and change, stop at 1 to feed and stretch, arrive at 3.' })
      + pack([['toy', 'Soft toys only', 'Hard ones can fly in a sudden stop'], fm ? ['bag', 'One extra bottle', 'In case of traffic'] : null])
      + ifs([
        ['heart', 'Crying while you drive', 'Pull over somewhere safe, then take {o} out to soothe or feed.'],
        ['clock', 'Driving on your own', 'Plan a few more stops. Check on {o} only when you’re parked.'],
        ],
        'If the baby cries while you drive, pull over first. On your own, plan more stops and check on the baby only when parked.')
      + good([typeof profile !== 'undefined' && profile.early ? ['steth', 'Born early?', 'Ask your pediatrician how long rides can be.'] : null, ['moon', 'Naps on the road', 'Naps in the car seat are fine while you drive. When you stop, move {o} to a crib or play yard.'], bf ? ['mouth', 'Nursing or pumping on the road', 'Park first. {S} {stay|stays} buckled in whenever the car is moving.'] : null]));

    if (id === 'fly') return sub('fly', 'Flying', 'Most flight planning happens when you book', 'Then take the airport and the flight one step at a time.',
      phases('fly', [
        ['Book', (SHOW() ? `<h2 class="hub-h2">${F('Where will Maya sit?')}</h2>` + choicePair([[PH('seat-own'), 'A rear-facing infant car seat installed in a plane window seat with the lap belt', 'Own seat', 'Safest, in a car seat labeled for aircraft', 1], [PH('seat-lap'), 'A parent holding a baby on their lap in a plane seat', 'On your lap', 'Often free under 2, but less safe in turbulence', 0]])
            : H().versus('Where will Maya sit?', ['Own seat', 'Safest, in a car seat labeled for aircraft.'], ['On your lap', 'Often free under 2, but less safe in turbulence.']))
          + rows([['notepad', 'When you book', SHOW() ? 'Add {o}, and ask about a bassinet seat.' : 'Add {o}, ask about a bassinet seat, and check the car seat says “aircraft” in red.'], m < 2 ? ['steth', 'Flying in the first weeks', 'Ask your pediatrician first.'] : null])
          + (SHOW() ? aircraftLabel() : '')
          + pack([fm ? ['bottle', 'One extra bottle', 'In case of delays'] : null, ['diaper', 'Diapers for the trip, plus extra', 'At least one more than you think, for delays'], ['shirt', 'A change of clothes', 'For {o}, and a top for you, in your carry-on'], eats() ? ['bowl', 'Snacks {s} already eats', 'Soft and easy, for delays'] : null, m >= 3 ? ['drop', 'Medicine you might need', 'A fever reducer your pediatrician has OK’d, with its syringe'] : ['chat', 'Your pediatrician’s number', 'Under 3 months, any fever means calling them first'], ['book', 'Proof of {p} age', 'Like {p} birth certificate, for a lap seat']])],
        ['Airport', rows([['bag', 'At security', bf && !fm && !pumps() ? 'Nothing extra for nursing. If you bring pumped milk, tell the officer.' : bf && !fm && !pumping() ? 'Breast milk can go through, even more than 3.4 oz. Tell the officer.' : bf && !fm ? 'Pumped milk and your pump can go through. Tell the officer.' : !bf ? 'Formula and water can go through. Tell the officer.' : pumping() ? 'Milk, formula and your pump can go through. Tell the officer.' : 'Breast milk and formula can go through. Tell the officer.'], ['stroller', 'At the gate', 'Gate-check the stroller. It waits at the plane door.']])],
        ['On board', rows([['plane', 'Takeoff and landing', 'Out of the carrier, then ' + (bf && !fm && how() === 'Nursing' ? 'nurse {o} or offer a pacifier.' : 'a feed or a pacifier for {p} ears.')],
            ['heart', 'Crying on board', 'Walk the aisle or offer a feed. Most people understand.'],
            ['hand', 'A diaper change', 'Ask the crew which restroom has the fold-down table.']])],
        ['Arrive', rows([['clock', 'After you land', 'Short trip? Keep naps on home time. Longer? Shift them a little each day.']])
          + `<button class="hub-link" onclick="openPage('chg:Sleep:d:away')">${F('Sleep in a new time zone')} ›</button>`]]));

    if (id === 'abroad') return sub('abroad', 'Going abroad', 'Going abroad? The passport comes first', 'Plan the flight as usual, then add these steps.',
      plan('Plan your trip', [
        ['As soon as you book', 'notepad', 'Apply for {p} passport. It can take weeks.'],
        ['4–6 weeks before', 'steth', 'Ask your pediatrician about shots, including an early measles shot from 6 months.'],
        ['Before you leave', 'home', 'Save how you’d find a doctor there.']],
        'Apply for the passport as soon as you book. Four to six weeks before, ask the pediatrician about shots. Before you leave, save how you would find a doctor there.')
      + pack([['thermo', 'A thermometer', 'And the medicines your pediatrician okays'], ['drop', 'Rehydration salts', 'Ask your pediatrician which kind'], ['car', '{P} car seat', 'Taxis abroad may not have one']])
      + tiles('While you’re there', [['Water', 'Sealed bottled, or boiled', fm ? 'For formula, your drinks and washing bottles' : 'For your drinks, and for washing bottles'], ['Mosquitoes', 'Netting', 'Over the crib and stroller'], ['Food', 'Cooked, or fruit you peel', 'Once {s’s} eating solids'], ['Drinks', 'No ice', 'It’s often made with tap water']])
      + good([['chat', 'If one parent can’t come', 'They sign a notarized consent form for the passport appointment instead.']])
      + calls(['Call a doctor', 'A fever, fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', m < 3 ? 'Any fever under 3 months or in a malaria area, trouble breathing, or hard to wake.' : 'Any fever in a malaria area, trouble breathing, or hard to wake.']));

    if (id === 'away') return sub('away', 'Staying away', 'Ten minutes makes a new room baby-safe', 'Most homes and hotel rooms aren’t set up for babies. A quick check when you arrive covers most of it.',
      phases('away', [
        ['Before you go', (SHOW() ? `<h2 class="hub-h2">${F('Where {s} will sleep')}</h2>` + beforeAfter(
            [PH('hotel-before'), 'A hotel room with a big adult bed, pillows and a thick duvet', 'Adult bed', null],
            [PH('hotel-after'), 'The same hotel room with a bare play yard beside the bed', 'Bare play yard', null],
            [['crib', 'A play yard, or a crib made after June 2011', 'Ask the hotel for one, or bring your own'], ['sofa', 'Never an adult bed or a couch', 'Even for a nap, even with you right there']], ['28%', '88%']) : '')
          + pack([['sack', '{P} sleep sack', 'It smells like home'], ['home', 'The play yard’s own sheet', 'Only the one made for it'], ['star', 'A night light', 'For feeds in a dark, new room']])
          + (SHOW() ? '' : rows([['shield', 'Which crib is safe?', 'A play yard, or a crib made after June 2011. Never an adult bed or a couch.']]))],
        ['When you arrive', awayList(m)
          + rows([['hand', 'Pets', 'Never leave {o} alone with a pet, even a gentle one.'], eats() ? ['bowl', 'Grandparents and treats', 'Share your food rules once, kindly, before the first meal.'] : null])],
        ['Settling in', ifs([
            ['moon', 'A rough first night', 'New places can unsettle sleep. A few off nights are normal.'],
            ['heart', 'Well-meant advice', 'Share one rule kindly: on {p} back, in a bare crib.']],
            'A few off nights are normal. If you get advice, share one rule kindly: on the back, in a bare crib.')
          + `<button class="hub-link" onclick="openPage('chg:Sleep:d:away')">${F('Sleep in a new time zone')} ›</button>`]]));   // time zones live in Sleep

    if (id === 'water') return sub('water', 'Pool or beach', 'Short visits by the water work best', 'Babies get cold and overheat faster than you do.',
      todo('In the water', 'Hold {o} the whole time. Floats don’t stop drowning.')
      + plan('Plan your day by the water', [
        ['Go early', 'clock', 'Before the strongest sun.'],
        ['When you arrive', 'sun', m < 6 ? 'Set up in the shade of an umbrella or canopy, with a hat on {o}.' : 'Set up in the shade, with a hat and sunscreen on {o}.'],
        ['Before the nap', 'home', 'Feed in the shade, then head home.']],
        'Go early, before the strongest sun. Set up in the shade. Feed in the shade, then head home before the nap.')
      + pack([['diaper', 'Swim diapers', 'Most pools ask for one'], ['towel', 'A hooded towel', 'For warming up after a dip'], m >= 6 ? ['shield', 'Sunscreen', ''] : null])
      + ifs([
        ['snow', 'Shivering or blue lips', 'Out of the water. Dry and wrap {o} up.'],
        ['thermo', 'Flushed and fussy', 'Move to the shade and offer a feed.']],
        'If the baby shivers or their lips turn blue, take them out and wrap them up. If flushed and fussy, move to the shade and feed.')
      + good([['hand', 'Hot sand and decks', 'They can burn little feet. Keep shoes or a blanket handy.']]));

    if (id === 'weather') {
      const view = weatherView || season();
      const seg = `<div class="hub-seg oa-seg" role="tablist">${[['hot', 'Hot days'], ['cold', 'Cold days']].map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaWeather('${k}')">${t}</button>`).join('')}</div>`;
      const hot = (SHOW() ? `<h2 class="hub-h2">${F('In the stroller')}</h2>` + beforeAfter(
          [PH('shade-before'), 'A stroller on a sunny path with a blanket draped over the front', 'Blanket over it', ['Traps the heat', 50, 50, 'b']],
          [PH('shade-after'), 'The same stroller in the shade of a tree, canopy forward, baby in a sun hat', 'Canopy and shade', null],
          [['sun', 'Canopy forward, in the shade', 'Air can still flow through'], ['towel', 'Never a blanket over the top', 'Even a thin one makes it hot inside']]) : '') + `<h2 class="hub-h2">${F('What to do')}</h2>` + steps([['clock', 'Go out early or late', 'When it’s cooler out'], m < 6 ? ['sun', 'Shade, not sunscreen', 'If there’s no shade, a little on {p} face is OK'] : ['sun', 'Sunscreen', 'SPF 30 or more, every 2 hours'], ['bottle', 'Keep {o} hydrated', !eats() ? 'With extra milk feeds' : 'With extra milk feeds and sips of water'], ['car', 'Cool the car first', 'Then touch the car seat buckles: they can burn']], 'Go out early or late, keep {o} in the shade, keep {o} hydrated with extra milk feeds, and cool the car first.')
        + good([['thermo', 'How hot is too hot?', 'When the heat index is 90°F or more, keep outings short or stay in.'], m >= 2 ? ['leaf', 'Bug spray, from 2 months', 'Up to 30% DEET, or picaridin. Spray your hands, then rub it on {p} skin, not {p} hands.'] : ['leaf', 'Bug spray, from 2 months', 'Not yet. Until then, use netting over the stroller.'], ['fridge', 'Milk on hot days', 'Keep it in a cooler with ice packs, never in a hot car.']])
        + calls(['Call your pediatrician', 'Any sunburn, or fewer wet diapers than usual.'], ['Call 911', 'Hot to the touch and floppy or hard to wake.']);
      const coldSeat = `<h2 class="hub-h2">${F('In the car seat')}</h2>` + beforeAfter(
          [PH('cold-before'), 'A baby in a rear-facing car seat wearing a puffy snowsuit, the straps loose on top of it', 'Puffy coat', ['Straps loose', 34, 56, 'r']],
          [PH('cold-after'), 'The same baby in thin fleece, harness snug and buckled, with a blanket over the legs on top of it', 'Blanket on top', ['Harness snug', 72, 44, 'l']],
          [['shirt', 'Coat off before you buckle', 'A puffy coat squashes in a crash, leaving the straps too loose'], ['towel', 'Then a blanket or coat on top', 'Over the buckled straps, not under']])
        + `<h2 class="hub-h2">${F('What to do')}</h2>` + steps([['clock', 'Warm up the car first', 'Before you buckle {o} in'], ['shirt', 'One more layer on walks', 'Plus a hat and mittens'], ['hand', 'Check if {s’s} warm enough', 'Feel {p} chest. Cold hands are normal']], 'Warm up the car first. On walks, one more layer than you. Feel {p} chest to check {s’s} warm enough.');
      const cold = SHOW() ? coldSeat + good([['snow', 'Very cold or windy?', 'Keep walks short, or stay in.'], ['carrier', 'In a carrier', 'Your coat can go over you both, with {p} face uncovered.'], ['home', 'Once you’re somewhere warm', 'Take off {p} hat and extra layers, so {s} {don’t|doesn’t} overheat.']])
        + calls(['Call your pediatrician', 'Skin that’s pale, gray or blistered after being out in the cold.'], ['Call 911', 'Cold to the touch and floppy or hard to wake.']) : `<h2 class="hub-h2">${F('What to do')}</h2>` + steps([['clock', 'Warm up the car first', 'Before you buckle {o} in'], ['car', 'In the car seat', 'Thin layers, then a blanket over the buckled straps'], ['shirt', 'One more layer on walks', 'Plus a hat and mittens'], ['hand', 'Check if {s’s} warm enough', 'Feel {p} chest. Cold hands are normal']], 'Warm up the car first. In the car seat, thin layers with a blanket over the buckled straps. On walks, one more layer than you. Feel {p} chest to check {s’s} warm enough.')
        + good([['snow', 'Very cold or windy?', 'Keep walks short, or stay in.'], ['carrier', 'In a carrier', 'Your coat can go over you both, with {p} face uncovered.'], ['home', 'Once you’re somewhere warm', 'Take off {p} hat and extra layers, so {s} {don’t|doesn’t} overheat.']])
        + calls(['Call your pediatrician', 'Skin that’s pale, gray or blistered after being out in the cold.'], ['Call 911', 'Cold to the touch and floppy or hard to wake.']);
      return sub(view, 'Hot and cold days', view === 'hot' ? 'Babies heat up faster than you do' : 'Babies lose heat faster than you do', view === 'hot' ? 'Timing and shade do most of the work.' : 'Most of the work happens before you head out.',
        seg + (view === 'hot' ? hot : cold));
    }

    // Car seat: one page from birth past the first birthday. Next car seat and rear-facing after 1 live here now.
    if (id === 'car' || id === 'bigger' || id === 'after1') {
      // One page for the whole first year and beyond: no stages, so the seat-by-seat path shows from day one,
      // and Good to know holds what's true at any age. The home's "Coming up" card points back here when the limits matter.
      // Nov 19: installing and the harness fit live in Safety; this page keeps which seat, when, and seats away from home.
      return sub('gear', 'Your gear', 'Rear-facing, for as long as the seat allows', 'It protects {p} head and neck best. Here’s which seat comes when, and car seats on the go.',
        (SHOW() ? photoSteps('Which seat, and when', [[PH('seat-infant'), 'An infant car seat with a carry handle', 'From birth', 'An infant seat, rear-facing'], [PH('seat-convertible'), 'A bigger convertible car seat', 'Outgrows it', 'A convertible seat, still rear-facing'], [PH('seat-forward'), 'A convertible car seat set up forward-facing', 'Much later', 'Forward-facing, often well past age 2']])
          + `<p class="oa-psteps-note">${F('Move up when the seat’s label says, not by age: its height and weight limits are on a sticker on the seat.')}</p>` : '') + (SHOW() ? '' : timeline('Which seat, and when', [['From birth', 'car', 'An infant seat, rear-facing.'], ['Outgrows it', 'sit', 'A convertible seat, still rear-facing. The height and weight limits are on the seat’s label.'], ['Much later', 'stand', 'Forward-facing only after the seat’s rear-facing limits, often well past age 2.']], 'An infant seat rear-facing from birth, a convertible seat still rear-facing once the infant seat’s height or weight limit is reached, and forward-facing only after its rear-facing limits, often well past age 2.'))
        + good([['road', 'Taxis and other people’s cars', 'Bring {p} car seat. Most can be installed with just the seat belt.'], ['notepad', 'Only what came with it', 'No add-on inserts or head supports, and secondhand only if you know its history.'], ['steth', 'A free check', 'A certified car seat technician can check your install, usually for free.']])
        + `<h2 class="hub-h2">${F('Installing it')}</h2><div class="hub-list"><button class="hub-row oa-row" style="--hl-bg:${GEAR_C.car[0]};--hl-ink:${GEAR_C.car[1]}" onclick="openPage('chg:Safety:d:step:seat')"><span class="oa-dot">${hubArt('car', CAT)}</span><span class="hub-row-copy"><b>${F('Install it and check the fit')}</b><small>${F('Step by step, in Safety')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>`);
    }

    // Carrier and stroller follow Car seat: the same page at every age, with how it changes shown as a path from day one.
    if (id === 'carry') return sub('gear', 'Your gear', 'In a carrier, keep {p} face in view', 'A quick check every time keeps {o} breathing easy.',
      (SHOW() ? `<h2 class="hub-h2">${F('The quick check')}</h2>` + photoCard(PH('carrier'), 'A baby facing in on a parent’s chest in a soft carrier, face fully visible, chin up, knees bent in an M shape', [['Face in view', 63, 30, 'r'], ['Knees up', 70, 74, 'l']],
          [['eye', 'Face in view', 'Close enough to kiss, above the fabric'], ['mouth', 'Chin off {p} chest', 'So {s} can breathe easily'], ['carrier', 'Knees up in an M', 'Higher than {p} bottom, thighs supported'], ['back', 'Back supported', 'Snug, no slumping when you lean']])
        : hubFigure('carrier', CAT, 'In a carrier: face visible and close enough to kiss, chin off the chest, knees up in an M shape, back supported.'))
      + (SHOW() ? photoSteps('Ways to carry, as {s} {grow|grows}', [[PH('carry-newborn'), 'A newborn facing in on a parent’s chest, face turned to the side', 'From birth', 'Facing in'], [PH('carry-out'), 'A baby facing out in a carrier, head held steady', 'Head steady', 'Facing out, for short awake times'], [PH('carry-back'), 'An older baby carried on a parent’s back', 'Sits steadily', 'On your back']])
          + `<p class="oa-psteps-note">${F('Each within your carrier’s own limits. Its instructions say when.')}</p>` : '') + (SHOW() ? '' : timeline('Ways to carry, as {s} {grow|grows}', [['From birth', 'carrier', 'Facing in, face above the fabric.'], ['Head steady', 'eye', 'Facing out, for short awake times, within the carrier’s limits.'], ['Sits steadily', 'back', 'On your back, within the carrier’s limits.']], 'Facing in from birth. Facing out once the head is steady, for short awake times, within the carrier’s limits. On your back once sitting steadily.'))
      + good([SHOW() ? null : ['hand', 'Snug enough', 'When you lean forward, {s} {stay|stays} against you without slumping.'], ['moon', 'Asleep in the carrier', 'Move {o} to a flat bed when you can.'], ['cup', 'Away from the stove', 'And from hot drinks, while {s’s} in the carrier.']]));

    if (id === 'stroller') return sub('gear', 'Your gear', 'Harness on and brakes set, every outing', 'A quick check each outing keeps {o} snug and the stroller steady.',
      (SHOW() ? `<h2 class="hub-h2">${F('The quick check')}</h2>` + photoCard(PH('stroller'), 'A baby reclined in a stroller in a park, harness buckled, canopy open for shade', [['Harness buckled', 60, 64, 'r'], ['Canopy for shade', 50, 12, 'b']],
          [['shield', 'Harness on, every time', 'Even for a quick trip'], ['hand', 'Brakes on when you stop', 'Even on flat ground'], ['bag', 'No bags on the handles', 'They can tip the stroller back'], ['sun', 'Shade from the canopy', 'Pull it forward on sunny days']])
        : hubFigure('stroller', CAT, 'Harness on every time, brakes on when you stop, no bags on the handles and no blanket over the top.'))
      + timeline('Lying back, then sitting up', [['From birth', 'stroller', 'Lying back, or with the infant car seat clicked on.'], ['Sits steadily', 'back', 'Sitting up, if the stroller’s instructions allow it.']], 'Lying back from birth, or with the infant car seat clicked on. Sitting up once the baby sits steadily, if the stroller allows it.')
      + good([['car', 'A car seat on the frame', 'Listen for the click, then tug to check it’s locked on.'], ['hand', 'On a bus or train', 'Brakes on and a hand on the stroller while it moves.']]));

    if (id === 'bag') return sub('gear', 'Your gear', 'Packing the diaper bag', 'Everything Maya needs for a few hours out, packed for how {s} {is} fed.',
      (SHOW() ? `<figure class="oa-flatlay"><img src="${PH('bag-flatlay')}" alt="The everyday diaper bag laid out: diapers, wipes, a changing pad, a spare outfit, burp cloths, a pacifier, a hat and a layer" loading="lazy"></figure>` : '') + bagList(m) + good([fm && ['clock', 'Formula you’ve made up', 'Use it within 2 hours of mixing, or within 1 hour once the feed starts.'], bf && pumps() && ['snow', 'Pumped milk', 'Keeps 4 hours at room temperature, or a day in a cooler with ice packs. Once a feed starts, use it within 2 hours.']]));

    if (id === 'sick') return detail('abroad');
    if (id === 'snacks') return detail('errands');
    return null;
  }

  /* ---------- Outings v3 (Nov 20): pick the situation, then see only what applies ----------
     Her review: keep the six photo destinations, quiet everything under them; situation chips inside a page
     (Around town: Walk / Store / Restaurant; Pool or beach: Pool / Beach); one labeled photo as the main thing;
     "One thing to know" said once; plain headers (icon + name + one helpful line, no second photo);
     only low-priority extras (packing) fold away; rows say the fix, they don't open more pages.
     window.__oaOld = true still shows the earlier version. */
  const view3 = {};
  window.oaView = (id, k) => { view3[id] = k; const y = scrollY; render(); scrollTo(0, y); };
  const TILE3 = TILE_PHOTO_ALL;
  function page3(key, icon, title, lead, inner) {
    const c = PAL[key] || PAL.gear;
    return `<div class="quiet-category hub-page hub-detail oa3" data-overview="${CAT}" data-ss="1" data-oa-page="${key}" style="${yearTheme(CAT)};--ss-bg:${c[0]};--ss-ink:${c[1]}">${detailPageTop(CAT)}`
      + `<header class="oa3-head"><span class="oa3-head-ic">${hubArt(icon, CAT)}</span><div><h1>${F(title)}</h1>${lead ? `<p>${F(lead)}</p>` : ''}</div></header>` + inner + `</div>`;
  }
  const chips3 = (id, opts, view) => `<div class="hub-seg oa-seg oa3-chips" role="tablist">${opts.map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaView('${id}','${k}')">${F(t)}</button>`).join('')}</div>`;
  const one3 = text => `<section class="oa3-one"><span class="oa3-one-ic">${hubArt('idea', CAT)}</span><div><small>${F('One thing to know')}</small><b>${F(text)}</b></div></section>`;
  const fold3 = (icon, title, inner) => inner ? `<details class="oa3-fold"><summary><span class="hub-dot">${hubArt(icon, CAT)}</span><b>${F(title)}</b><i aria-hidden="true">⌄</i></summary><div class="oa3-fold-body">${inner}</div></details>` : '';
  const plainRows = items => { const it = items.filter(Boolean); return it.length ? `<div class="hub-list">${it.map(([icon, title, s]) => H().row({ icon, cat: CAT, title, sub: s })).join('')}</div>` : ''; };
  const fig3 = (src, alt, pins) => `<section class="oa-photo-card oa3-fig"><figure class="oa-photo"><img src="${PH(src)}" alt="${F(alt)}" loading="lazy">${pinsHtml(pins)}</figure></section>`;

  function home3() {
    const m = ageNow(), h = H(), n = nowFor(m), nx = nextFor(m);
    Object.keys(phaseView).forEach(k => delete phaseView[k]); Object.keys(view3).forEach(k => delete view3[k]);
    let b = `<header class="hub-hero oa-hero oa3-hero"><p class="hub-eyebrow">${F(m < 1 ? 'In the first weeks' : `At ${m} ${m === 1 ? 'month' : 'months'}`)}</p><h1>${F(n[1])}</h1><p class="hub-lead">${F(n[2])}</p>${PLACES.some(([pid]) => pid === n[3]) ? '' : `<button class="cc-hero-go oa-hero-go" onclick="${open(n[3])}">${F(n[4] ? n[4][2] : 'See the guide')} ›</button>`}</header>`;
    b += `<h2 class="hub-h2">${F('Where are you headed?')}</h2><div class="oa3-places">${PLACES.map(([id, label]) => `<button class="oa3-place" onclick="${open(id)}"><img src="${PH(TILE3[id])}" alt="" loading="lazy"><span><b>${F(label)}</b><i aria-hidden="true">›</i></span></button>`).join('')}</div>`;
    const k = season();
    b += `<div class="hub-list oa3-more">`
      + h.row({ icon: 'bag', cat: CAT, title: 'Your gear', sub: 'Car seat, stroller, carrier and diaper bag', onclick: open('gear') })
      + h.row({ icon: k === 'hot' ? 'sun' : 'snow', cat: CAT, title: k === 'hot' ? 'Hot days' : 'Cold days', sub: k === 'hot' ? 'Shade, drinks and the car' : 'Layers and the car seat', onclick: open('weather') })
      + `</div>`;
    if (nx) b += h.next(`Next · around ${nx[0]} months`, nx[1], open(nx[3]), '', { 2: 'Plan a first long drive or flight around feeds.', 4: 'Check your carrier’s limits before facing out.', 6: 'Pack snacks, and a travel crib for overnights.', 9: 'Check the height and weight sticker on the car seat.', 12: 'Check the seat’s rear-facing limits on its label.' }[nx[0]] || '');
    return `<div class="quiet-category hub-page" data-overview="${CAT}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${b}</div>`;
  }

  function bagList3(m) {
    const items = bagItems(m), have = bagGet(), on = items.filter(i => have.includes(i[1])).length;
    const G = [['Essentials', ['diapers', 'wipes', 'clothes', 'sanitizer']], ['Feeding', ['pump', 'pumped', 'cover', 'formula', 'bottles', 'burp', 'snacks', 'cup']], ['Extras', ['pacifier', 'hat', 'layer']]];
    const tile = ([icon, k, t, s]) => `<button class="oa-pack${have.includes(k) ? ' is-on' : ''}" data-k="${k}" aria-pressed="${have.includes(k)}" onclick="oaBagToggle('${k}')"><span class="oa-pack-art">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}</span><i aria-hidden="true">✓</i></button>`;
    return `<section class="hub-card oa-bag"><div class="oa-bag-head"><b class="oa-pack-count">${on} of ${items.length} packed</b><button class="hub-link" onclick="oaBagReset()">Clear ticks</button></div>`
      + G.map(([label, keys]) => { const g = items.filter(i => keys.includes(i[1])); return g.length ? `<p class="oa3-group">${F(label)}</p><div class="oa-packs">${g.map(tile).join('')}</div>` : ''; }).join('') + `</section>`;
  }

  function detail3(id) {
    const m = ageNow(), bf = nursing(), fm = formula();
    const feedLine = bf && fm ? 'Nurse or give a bottle, wherever you’re comfortable.' : bf ? 'Nurse wherever you’re comfortable, or give a bottle of pumped milk.' : 'Give a bottle where you are. Formula doesn’t need warming.';

    if (id === 'gear') return page3('gear', 'bag', 'Your gear', 'A quick check on each, every outing.',
      gear(ageNow()).replace(`<h2 class="hub-h2">${F('Your gear')}</h2>`, '')
      + h3note('Car seats, carriers and strollers each have their own height and weight limits. You’ll find them in the manual and on the gear itself.'));

    if (id === 'errands') {
      const v = view3.errands || 'walk';
      const walk = fig3('town', 'A parent pushing a stroller along a sunny street past a café')
        + one3('Head out right after a feed. It’s the calmest stretch.')
        + plainRows([['carrier', 'While you’re out', 'In any car, {s} {ride|rides} in {p} own car seat. A carrier keeps your hands free.'], ['heart', 'If plans change', 'Hungry, upset or a blowout? Find a quiet spot, or head home early. ' + (bf ? 'You can nurse wherever you’re comfortable.' : 'Formula doesn’t need warming.')]]);
      const store = beforeAfter(
          [PH('cart-before'), 'An infant car seat balanced on top of a shopping cart', 'Seat on the cart', null],
          [PH('cart-after'), 'A parent pushing a cart with the baby in a carrier on their chest', 'In a carrier', null],
          [eats() ? ['shield', 'Or the cart’s own seat', 'With the strap on, once {s} {sit|sits} steadily'] : ['stroller', 'Or bring the stroller', 'And put the shopping underneath']])
        + one3('Never balance an infant car seat on top of a shopping cart. It can tip, or fall off.');
      const rest = (eats() ? fig3('highchair', 'A baby strapped into a café high chair with a bowl of soft food', [['Strapped in', 70, 72, 'l']])
          : fig3('restaurant-young', 'An awake, smiling baby lying back in a stroller beside a café table, the coffee cup up on the table', REST_PINS))
        + one3(eats() ? 'Strap {o} in, and pull the high chair back from the table.' : 'The car seat stays on the floor or clicked onto the stroller, never on top of a high chair.')
        + plainRows([eats() ? ['bowl', 'Hot food to the middle', 'Out of reach of grabbing hands'] : null, eats() ? ['bag', 'Bring {p} own food', 'Something soft from home, a bib and a spoon'] : null, ['bottle', 'Feeding at the table', feedLine], bf && pumps() ? ['fridge', 'Pumped milk', 'Fine cool or at room temperature. No need to warm it.'] : null]);
      return page3('errands', 'home', 'Around town', 'One or two stops is plenty, and leaving early still counts.',
        chips3('errands', [['walk', 'Walk'], ['store', 'Store'], ['rest', 'Restaurant']], v) + (v === 'store' ? store : v === 'rest' ? rest : walk));
    }

    if (id === 'road') return page3('road', 'car', 'Road trips', 'Long drives go best in 2-hour stretches.',
      `<h2 class="hub-h2">${F('Plan your drive')}</h2><div class="oa3-stops" style="--n:3">${[['car', 'Leave', 'As a nap starts'], ['bottle', 'Every 2 hours', eats() ? 'Stop to feed, change and snack' : 'Stop to feed and change'], ['home', 'Arrive', 'Sleep moves to a crib or play yard']].map(([i, t, l]) => `<div><span>${hubArt(i, CAT)}</span><b>${F(t)}</b><small>${F(l)}</small></div>`).join('')}</div>`
      + one3('Only soft toys in the car. Hard ones can fly in a sudden stop.')
      + plainRows([['heart', 'Crying while you drive', 'Pull over somewhere safe, then take {o} out.'], ['moon', 'Naps on the road', 'Fine in the car seat while you drive.'], ['clock', 'Driving on your own', 'Plan a few more stops. Check on {o} only when you’re parked.'], bf ? ['mouth', 'Nursing or pumping', 'Park first. {S} {stay|stays} buckled in whenever the car is moving.'] : null, typeof profile !== 'undefined' && profile.early ? ['steth', 'Born early?', 'Ask your pediatrician how long rides can be.'] : null])
      + fold3('bag', 'Packing extras', fm ? plainRows([['bottle', 'One extra bottle', 'In case of traffic']]) : ''));

    if (id === 'fly') return page3('fly', 'plane', 'Flying', 'Most flight planning happens when you book.',
      phases('fly', [
        ['Book', `<h2 class="hub-h2">${F('Where will Maya sit?')}</h2>` + choicePair([[PH('seat-own'), 'A rear-facing infant car seat installed in a plane window seat with the lap belt', 'Own seat', 'Safest, in a car seat labeled for aircraft', 1], [PH('seat-lap'), 'A parent holding a baby on their lap in a plane seat', 'On your lap', 'Often free under 2, but less safe in turbulence', 0]])
          + plainRows([['notepad', 'When you book', 'Add {o}, and ask about a bassinet seat.'], m < 2 ? ['steth', 'Flying in the first weeks', 'Ask your pediatrician first.'] : null])
          + fold3('shield', 'Check the car seat label', aircraftLabel())
          + fold3('bag', 'Flight packing extras', plainRows([fm ? ['bottle', 'One extra bottle', 'In case of delays'] : null, ['diaper', 'Diapers for the trip, plus extra', 'At least one more than you think'], ['shirt', 'A change of clothes', 'For {o}, and a top for you, in your carry-on'], eats() ? ['bowl', 'Snacks {s} already eats', 'Soft and easy, for delays'] : null, m >= 3 ? ['drop', 'Medicine you might need', 'A fever reducer your pediatrician has OK’d, with its syringe'] : ['chat', 'Your pediatrician’s number', 'Under 3 months, any fever means calling them first'], ['book', 'Proof of {p} age', 'Like {p} birth certificate, for a lap seat']]))],
        ['Airport', plainRows([['bag', 'At security', bf && !fm && !pumps() ? 'Nothing extra for nursing. If you bring pumped milk, tell the officer.' : bf && !fm && !pumping() ? 'Breast milk can go through, even more than 3.4 oz. Tell the officer.' : bf && !fm ? 'Pumped milk and your pump can go through. Tell the officer.' : !bf ? 'Formula and water can go through. Tell the officer.' : pumping() ? 'Milk, formula and your pump can go through. Tell the officer.' : 'Breast milk and formula can go through. Tell the officer.'], ['stroller', 'At the gate', 'Gate-check the stroller. It waits at the plane door.']])],
        ['On board', one3('For takeoff and landing, take {o} out of the carrier, then ' + (bf && !fm && how() === 'Nursing' ? 'nurse or offer a pacifier for {p} ears.' : 'offer a feed or a pacifier for {p} ears.'))
          + plainRows([['heart', 'Crying on board', 'Walk the aisle or offer a feed. Most people understand.'], ['hand', 'A diaper change', 'Ask the crew which restroom has the fold-down table.']])],
        ['Arrive', plainRows([['clock', 'After you land', 'Short trip? Keep naps on home time. Longer? Shift them a little each day.']])
          + `<button class="hub-link" onclick="openPage('chg:Sleep:d:away')">${F('Sleep in a new time zone')} ›</button>`]]));

    if (id === 'away') return page3('away', 'crib', 'Staying away', 'Ten minutes makes a new room baby-safe.',
      phases('away', [
        ['Before you go', `<h2 class="hub-h2">${F('Where {s} will sleep')}</h2>` + beforeAfter(
            [PH('hotel-before'), 'A hotel room with a big adult bed, pillows and a thick duvet', 'Adult bed', null],
            [PH('hotel-after'), 'The same hotel room with a bare play yard beside the bed', 'Bare play yard', null],
            [['crib', 'A play yard, or a crib made after June 2011', 'Ask the hotel for one, or bring your own'], ['sofa', 'Never an adult bed or a couch', 'Even for a nap, even with you right there']], ['28%', '88%'])
          + fold3('bag', 'What to pack', plainRows([['sack', '{P} sleep sack', 'It smells like home'], ['home', 'Bringing your own play yard?', 'Pack only the sheet made for it'], ['star', 'A night light', 'For feeds in a dark, new room']]))],
        ['When you arrive', `<h2 class="hub-h2">${F('A room that’s safe for Maya')}</h2>` + fig3('away-room', 'A hotel room with a bare play yard against the wall and a travel bag up on a high closet shelf', AWAY_PINS)
          + checks3(m)
          + plainRows([['hand', 'Pets', 'Never leave {o} alone with a pet, even a gentle one.'], eats() ? ['bowl', 'Grandparents and treats', 'Share your food rules once, kindly, before the first meal.'] : null])],
        ['Settling in', plainRows([['clock', 'Same bedtime as at home', 'The same steps, in {p} own sleep sack'], ['moon', 'A rough first night', 'New places can unsettle sleep. A few off nights are common.'], ['heart', 'Well-meant advice', 'Share one rule kindly: on {p} back, in a bare crib.']])
          + `<button class="hub-link" onclick="openPage('chg:Sleep:d:away')">${F('Sleep in a new time zone')} ›</button>`]]));

    if (id === 'water') {
      const v = view3.water || 'pool';
      const pool = fig3('pool', 'A parent in the pool holding a smiling baby in a sun hat and swim shirt close with both arms', [['Held the whole time', 30, 84, 'r']])
        + one3('Hold {o} the whole time in the water. Floats don’t stop drowning.')
        + rows([['snow', 'Shivering or blue lips', 'Out of the water. Dry and wrap {o} up.'], ['thermo', 'Flushed and fussy', 'Move to the shade and offer a feed.']], 'When things don’t go to plan')
        + fold3('bag', 'Packing extras', plainRows([['diaper', 'Swim diapers', 'Most pools ask for one'], ['towel', 'A hooded towel', 'For warming up after a dip']]));
      const beach = fig3('beach-setup', 'A parent and baby in a sun hat sitting in the deep shade of a beach umbrella', [['Deep shade', 30, 22, 'r'], ['Sun hat', 56, 46, 'r']])
        + one3(m < 6 ? 'Set up in the shade of an umbrella or canopy, with a hat on {o}.' : 'Set up in the shade, with a hat and sunscreen on {o}.')
        + plainRows([['clock', 'Go early', 'Before the strongest sun, and head home before the nap'], ['hand', 'Hot sand', 'It can burn little feet. Keep shoes or a blanket handy.'], ['drop', 'In the water', 'Hold {o} the whole time. Floats don’t stop drowning.']])
        + rows([['thermo', 'Flushed and fussy', 'Move to the shade and offer a feed.'], ['snow', 'Shivering or blue lips', 'Out of the water. Dry and wrap {o} up.']], 'When things don’t go to plan')
        + fold3('bag', 'Packing extras', plainRows([['diaper', 'Swim diapers', 'For any dips'], ['towel', 'A hooded towel', 'For warming up after'], m >= 6 ? ['shield', 'Sunscreen', 'SPF 30 or more, every 2 hours'] : null]));
      return page3('water', 'sun', 'Pool or beach', 'Short visits work best. Babies get cold, and overheat, faster than you do.',
        chips3('water', [['pool', 'Pool'], ['beach', 'Beach']], v) + (v === 'beach' ? beach : pool));
    }

    if (id === 'abroad') return page3('abroad', 'notepad', 'Going abroad', 'The passport comes first. Apply as soon as you book.',
      phases('abroad', [
        ['Before you go', plan('Plan your trip', [
            ['As soon as you book', 'notepad', 'Apply for {p} passport. It can take weeks.'],
            ['4–6 weeks before', 'steth', 'Ask your pediatrician about shots, including an early measles shot from 6 months.'],
            ['Before you leave', 'home', 'Save how you’d find a doctor there.']], 'Apply for the passport as soon as you book. Four to six weeks before, ask the pediatrician about shots. Before you leave, save how you would find a doctor there.')
          + plainRows([['chat', 'If one parent can’t come', 'They sign a notarized consent form for the passport appointment instead.']])
          + fold3('bag', 'What to pack', plainRows([['car', '{P} own car seat', 'Taxis and rental cars may not have one'], ['thermo', 'A thermometer', 'And the medicines your pediatrician okays'], ['drop', 'Rehydration salts', 'Ask your pediatrician which kind']]))],
        ['When you arrive', one3('In any car or taxi, {s} {ride|rides} in {p} own car seat.')
          + plainRows([['drop', 'Water for ' + (fm ? 'formula and ' : '') + 'bottles', fm ? 'Sealed bottled, or boiled, for formula, your drinks and washing bottles' : 'Sealed bottled, or boiled, for your drinks and washing bottles'], ['leaf', 'Mosquito netting', 'Over the crib and stroller, if there’s no air conditioning or screens']])],
        ['While you’re there', plainRows([['cup', 'Drinks', 'No ice. It’s often made with tap water'], eats() ? ['bowl', 'Food', 'Cooked, or fruit you peel'] : null, ['bottle', 'A tummy bug', 'Keep feeding. Babies dry out faster than adults do.']])
          + calls(['Call a doctor', 'A fever, fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', m < 3 ? 'Any fever under 3 months or in a malaria area, trouble breathing, or hard to wake.' : 'Any fever in a malaria area, trouble breathing, or hard to wake.'])]]));

    if (id === 'weather') {
      const view = weatherView || season();
      const seg = `<div class="hub-seg oa-seg" role="tablist">${[['hot', 'Hot days'], ['cold', 'Cold days']].map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaWeather('${k}')">${t}</button>`).join('')}</div>`;
      const hot = beforeAfter(
          [PH('shade-before'), 'A stroller on a sunny path with a blanket draped over the front', 'Blanket over it', null],
          [PH('shade-after'), 'The same stroller in the shade of a tree, canopy forward, baby in a sun hat', 'Canopy and shade', null],
          null)
        + one3('Go out early or late, when it’s cooler, and keep {o} in the shade.')
        + plainRows([m < 6 ? ['sun', 'Shade, not sunscreen', 'If there’s no shade, a little on {p} face is OK'] : ['sun', 'Sunscreen', 'SPF 30 or more, every 2 hours'], ['bottle', 'Keep {o} hydrated', !eats() ? 'With extra milk feeds' : 'With extra milk feeds and sips of water'], ['car', 'Cool the car first', 'Then touch the buckles: they can burn']])
        + fold3('notepad', 'More for hot days', plainRows([['thermo', 'How hot is too hot?', 'When the heat index is 90°F or more, keep outings short or stay in.'], m >= 2 ? ['leaf', 'Bug spray, from 2 months', 'Up to 30% DEET, or picaridin. Spray your hands, then rub it on {p} skin, not {p} hands.'] : ['leaf', 'Bug spray, from 2 months', 'Not yet. Until then, use netting over the stroller.'], ['fridge', 'Milk on hot days', 'In a cooler with ice packs, never in a hot car.']]))
        + calls(['Call your pediatrician', 'Any sunburn, or fewer wet diapers than usual.'], ['Call 911', 'Hot to the touch and floppy or hard to wake.']);
      const cold = beforeAfter(
          [PH('cold-before'), 'A baby in a rear-facing car seat wearing a puffy snowsuit, the straps loose on top of it', 'Puffy coat', ['Straps loose', 34, 56, 'r']],
          [PH('cold-after'), 'The same baby in thin fleece, harness snug and buckled, with a blanket over the legs on top of it', 'Blanket on top', ['Harness snug', 72, 44, 'l']],
          [['shirt', 'Coat off before you buckle', 'A puffy coat squashes in a crash, leaving the straps too loose']])
        + one3('Warm up the car first, and feel {p} chest to check {s’s} warm enough. Cold hands are common.')
        + plainRows([['shirt', 'One more layer on walks', 'Plus a hat and mittens'], ['carrier', 'In a carrier', 'Your coat can go over you both, with {p} face uncovered.']])
        + fold3('notepad', 'More for cold days', plainRows([['snow', 'Very cold or windy?', 'Keep walks short, or stay in.'], ['home', 'Once you’re somewhere warm', 'Take off {p} hat and extra layers, so {s} {don’t|doesn’t} overheat.']]))
        + calls(['Call your pediatrician', 'Skin that’s pale, gray or blistered after being out in the cold.'], ['Call 911', 'Cold to the touch and floppy or hard to wake.']);
      return page3(view, view === 'hot' ? 'sun' : 'snow', 'Hot and cold days', view === 'hot' ? 'Babies heat up faster than you do.' : 'Babies lose heat faster than you do.', seg + (view === 'hot' ? hot : cold));
    }

    if (id === 'car' || id === 'bigger' || id === 'after1') return page3('gear', 'car', 'Car seat', 'Rear-facing, for as long as the seat allows. It protects {p} head and neck best.',
      photoSteps('Which seat, and when', [[PH('seat-infant'), 'An infant car seat with a carry handle', 'From birth', 'Infant seat, rear-facing'], [PH('seat-convertible'), 'A bigger convertible car seat', 'Outgrows it', 'Convertible, still rear-facing'], [PH('seat-forward'), 'A convertible car seat set up forward-facing', 'Much later', 'Forward-facing, often past age 2']])
      + `<p class="oa-psteps-note">${F('Move up when the label says, not by age. The limits are on a sticker on the seat.')}</p>`
      + one3('Every time you park, look in the back seat before you walk away.')
      + good([['road', 'Taxis and other people’s cars', 'Bring {p} car seat. Most can be installed with just the seat belt.'], ['notepad', 'Only what came with it', 'No add-on inserts or head supports, and secondhand only if you know its history.'], ['steth', 'A free check', 'A certified car seat technician can check your install, usually for free.']])
      + `<h2 class="hub-h2">${F('Installing it')}</h2><div class="hub-list"><button class="hub-row oa-row" style="--hl-bg:${GEAR_C.car[0]};--hl-ink:${GEAR_C.car[1]}" onclick="openPage('chg:Safety:d:step:seat')"><span class="oa-dot">${hubArt('car', CAT)}</span><span class="hub-row-copy"><b>${F('Install it and check the fit')}</b><small>${F('Step by step, in Safety')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>`);

    if (id === 'carry') return page3('gear', 'carrier', 'Carrier', 'Keep {p} face in view. A quick check every time keeps {o} breathing easy.',
      `<h2 class="hub-h2">${F('The quick check')}</h2>` + fig3('carrier', 'A baby facing in on a parent’s chest in a soft carrier, face fully visible, chin up, knees bent in an M shape', CARRY_PINS)
      + `<p class="oa-psteps-note oa3-under">${F('Back supported, and knees up in an M, higher than {p} bottom.')}</p>`
      + `<h2 class="hub-h2">${F('Ways to carry, as {s} {grow|grows}')}</h2><div class="oa3-thumbs">${[['carry-newborn', 'From birth', 'Facing in'], ['carry-out', 'Head steady', 'Facing out, for short awake times'], ['carry-back', 'Sits steadily', 'On your back']].map(([p, w, t]) => `<figure><img src="${PH(p)}" alt="" loading="lazy"><figcaption><b>${F(w)}</b><small>${F(t)}</small></figcaption></figure>`).join('')}</div>`
      + `<p class="oa-psteps-note">${F('Each within your carrier’s own limits. Its instructions say when.')}</p>`
      + good([['moon', 'Asleep in the carrier', 'Move {o} to a flat bed when you can.'], ['cup', 'Away from the stove', 'And from hot drinks, while {s’s} in the carrier.']]));

    if (id === 'stroller') return page3('gear', 'stroller', 'Stroller', 'Harness on and brakes set, every outing.',
      `<h2 class="hub-h2">${F('The quick check')}</h2>` + fig3('stroller', 'A baby reclined in a stroller in a park, harness buckled, canopy open for shade', [['Harness buckled', 60, 64, 'r'], ['Canopy for shade', 50, 12, 'b']])
      + one3('Brakes on whenever you stop, and no bags on the handles. They can tip it back.')
      + fold3('back', 'Lying back, then sitting up', plainRows([['stroller', 'From birth', 'Lying back, or with the infant car seat clicked on'], ['back', 'Sits steadily', 'Sitting up, if the stroller’s instructions allow it']]))
      + good([['car', 'A car seat on the frame', 'Listen for the click, then tug to check it’s locked on.'], ['hand', 'On a bus or train', 'Brakes on and a hand on the stroller while it moves.']]));

    if (id === 'bag') return page3('gear', 'bag', 'Diaper bag', 'Everything for a few hours out, packed for how {s} {is} fed.',
      `<figure class="oa-flatlay"><img src="${PH('bag-flatlay')}" alt="The everyday diaper bag laid out: diapers, wipes, a changing pad, a spare outfit, burp cloths, a pacifier, a hat and a layer" loading="lazy"></figure>`
      + bagList3(m) + good([fm && ['clock', 'Formula you’ve made up', 'Use it within 2 hours of mixing, or within 1 hour once the feed starts.'], bf && pumps() && ['snow', 'Pumped milk', 'Keeps 4 hours at room temperature, or a day in a cooler with ice packs. Once a feed starts, use it within 2 hours.']]));

    if (id === 'sick') return detail3('abroad');
    if (id === 'snacks') return detail3('errands');
    return null;
  }
  const AWAY_PINS = [['Bare play yard', 45, 62, 'b'], ['Bags up high', 82, 12, 'l']];
  const CARRY_PINS = [['Face in view', 64, 26, 'r'], ['Chin off the chest', 42, 40, 'l']];
  // Three quick checks for any new place (ticks saved on this phone, cleared with Start over).
  const CHECKS_KEY = 'ahead-away-3';
  window.oaCheck3 = i => { let on = []; try { on = JSON.parse(localStorage.getItem(CHECKS_KEY)) || []; } catch (e) {} on = on.includes(i) ? on.filter(x => x !== i) : on.concat(i); try { localStorage.setItem(CHECKS_KEY, JSON.stringify(on)); } catch (e) {} const y = scrollY; render(); scrollTo(0, y); };
  window.oaCheck3Reset = () => { try { localStorage.removeItem(CHECKS_KEY); } catch (e) {} const y = scrollY; render(); scrollTo(0, y); };
  const checks3 = m => {
    let on = []; try { on = JSON.parse(localStorage.getItem(CHECKS_KEY)) || []; } catch (e) {}
    const items = [['crib', 'Sleep space is clear and ready', 'A play yard or crib with only its own mattress and sheet'], ['lock', 'Cords, medicines and bags out of reach', 'Up high: yours and everyone else’s'], ['hand', m >= 6 ? 'Floors and furniture checked' : 'Nothing within reach of the crib', m >= 6 ? 'Small things off the floor, outlets covered, stairs blocked' : 'No cords, bags or blinds near the play yard']];
    return `<div class="oa-away-head"><h2 class="hub-h2">${F('Check the room')}</h2>${on.length ? `<button class="hub-link" onclick="oaCheck3Reset()">${F('Start over')}</button>` : ''}</div>`
      + `<div class="hub-list oa3-checks">${items.map(([icon, t, sub], i) => `<button class="hub-row${on.includes(i) ? ' is-on' : ''}" aria-pressed="${on.includes(i)}" onclick="oaCheck3(${i})"><span class="hub-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(t)}</b><small>${F(sub)}</small></span><i class="oa3-tick" aria-hidden="true">✓</i></button>`).join('')}</div>`
      + `<p class="oa-psteps-note">${F(`${on.length} of 3 checked`)}</p>`;
  };
  const REST_PINS = [];
  const h3note = t => `<p class="oa-psteps-note">${F(t)}</p>`;

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
