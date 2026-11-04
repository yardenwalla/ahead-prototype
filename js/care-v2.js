/* Ahead · Everyday care, rebuilt (Nov 2026).
   Job: "Show me how to do the everyday care, and tell me what changes as my baby grows."
   Rule: hands-on care you do again and again for the baby's body or clothes. One-time babyproofing is Safety,
   illness is Health, the sleep space is Sleep, milk and solids are Feeding.
   The home is the same at every age: what's new now (two or three rows), then the same basics as a quiet grid.
   Each basic is one topic page that leads with the answer for the baby's age, then how to do it,
   how it changes, and what's normal. Tapping another age in "How it changes" shows that age's page. */
(function () {
  const H = () => window.__hub, F = s => H().F(s);
  const CAT = 'Daily rhythm';
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const careAge = () => (typeof hubAgeFor === 'function' ? hubAgeFor('care', actualMonth()) : developmentMonth(actualMonth()));
  const stageNow = () => live() ? (((NOW - parse(profile.dob)) / 864e5) < 28 ? 0 : careAge() < 4 ? 1 : careAge() < 7 ? 2 : 3) : (month < 1 ? 0 : month < 4 ? 1 : month < 7 ? 2 : 3);
  const STAGE = ['Newborn', '1–3 months', '4–6 months', '7–12 months'];
  const monthsLabel = n => n === 0 ? 'Newborn' : n === 12 ? '1 year' : n === 1 ? '1 month' : n + ' months';
  const hasTooth = () => !live() || answers.hasTooth === 'Yes' || (typeof journeyData === 'function' && journeyData().records.some(r => r.type === 'milestone' && /tooth|teeth/i.test(r.title || '')));

  // Each topic's soft color pair, its icon, and a small flat picture for the page header.
  const COL = { diapers: ['#e7effc', '#46638c', '#9fb8df', '#d9e5fc'], bath: ['#e3f1f7', '#2a6078', '#8cc1d6', '#cfe9f4'], skin: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'], clothes: ['#efedff', '#625084', '#b4a5dc', '#e5e0fc'], sun: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'], teeth: ['#e6f5ec', '#356651', '#9bc7ac', '#ddf1e5'], nails: ['#fdeef2', '#a24d6a', '#f2b8c6', '#f4d6c4'], cord: ['#fdeef2', '#a24d6a', '#f2b8c6', '#f4d6c4'], need: ['#f5f1ea', '#4d443b', '#d8cbb8', '#ece6dc'], look: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'] };
  COL.down = COL.diapers;
  const ICON = { diapers: 'diaper', bath: 'bath', skin: 'drop', clothes: 'shirt', sun: 'sun', teeth: 'tooth', nails: 'nail', cord: 'cord', need: 'bag', look: 'eye', down: 'heart' , nose: 'steth', wet: 'drop', feet: 'stand', yellow: 'sun'};
  const ART = {
    diapers: c => `<path d="M6 8h44v6a22 18 0 0 1-44 0Z" fill="${c[2]}"/><circle cx="66" cy="24" r="8" fill="${c[3]}"/>`,
    bath: c => `<rect x="4" y="18" width="52" height="16" rx="8" fill="${c[2]}"/><circle cx="22" cy="12" r="5" fill="${c[3]}"/><circle cx="34" cy="9" r="4" fill="${c[3]}"/>`,
    skin: c => `<circle cx="18" cy="20" r="14" fill="${c[2]}"/><circle cx="14" cy="16" r="2.5" fill="${c[3]}"/><circle cx="22" cy="23" r="2" fill="${c[3]}"/><rect x="40" y="18" width="34" height="8" rx="4" fill="${c[3]}"/>`,
    clothes: c => `<path d="M8 10l10-6h16l10 6-5 8h-4v16H17V18h-4Z" fill="${c[2]}"/><rect x="54" y="22" width="22" height="10" rx="5" fill="${c[3]}"/>`,
    sun: c => `<circle cx="20" cy="20" r="12" fill="${c[2]}"/><rect x="42" y="24" width="34" height="8" rx="4" fill="${c[3]}"/>`,
    teeth: c => `<rect x="6" y="10" width="14" height="20" rx="7" fill="${c[2]}"/><rect x="24" y="10" width="14" height="20" rx="7" fill="${c[2]}"/><rect x="46" y="22" width="28" height="8" rx="4" fill="${c[3]}"/>`,
    nails: c => `<rect x="10" y="6" width="14" height="28" rx="7" fill="${c[2]}"/><rect x="12" y="6" width="10" height="9" rx="4" fill="${c[3]}"/><circle cx="50" cy="24" r="8" fill="${c[3]}"/>`,
    cord: c => `<circle cx="20" cy="20" r="13" fill="${c[2]}"/><circle cx="20" cy="20" r="4" fill="${c[3]}"/>`,
    look: c => `<circle cx="20" cy="20" r="14" fill="${c[2]}"/><circle cx="20" cy="20" r="5" fill="${c[3]}"/><rect x="42" y="18" width="34" height="8" rx="4" fill="${c[3]}"/>`,
    need: c => `<rect x="6" y="12" width="36" height="24" rx="6" fill="${c[2]}"/><path d="M16 12a8 7 0 0 1 16 0" stroke="${c[2]}" stroke-width="3" fill="none"/><rect x="50" y="24" width="24" height="8" rx="4" fill="${c[3]}"/>`
  };
  const go = (k, v) => `openPage('chg:${CAT}:d:t:${k}${v == null ? '' : ':' + v}')`;
  const rowK = (k, title, sub, onclick) => { const c = COL[k] || (k === 'yellow' ? COL.sun : COL.look);
    return `<button class="hub-row hl-row" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="${onclick}"><span class="hub-dot">${hubArt(ICON[k], CAT)}</span><span class="hub-row-copy"><b>${F(title)}</b>${sub ? `<small>${F(sub)}</small>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  const tile = (k, t, v) => `<button class="care-tile" style="--hl-bg:${COL[k][0]};--hl-ink:${COL[k][1]}" onclick="${k === 'cord' ? `openPage('chg:${CAT}:d:cord')` : go(k, v)}"><span class="care-tile-ic">${hubArt(ICON[k], CAT)}</span><b>${F(t)}</b></button>`;

  const BASICS = [['diapers', 'Diapers'], ['bath', 'Baths and hair'], ['skin', 'Skin and rashes'], ['clothes', 'Clothes'], ['sun', 'Sun and heat'], ['teeth', 'Gums and teeth'], ['nails', 'Nails, ears, nose'], ['need', 'What you’ll need']];
  // "Right now": only what changes at this stage (the content map), each opening its topic at this stage.
  const HOME = [
    { title: 'Diapers, the cord and first baths', lead: 'It feels like a lot at first, and it gets quicker fast.',
      news: () => [['diapers', 'Diapers, day by day', 'What to expect in the first week, and how to change one', go('diapers', 0)], ['cord', 'Cord stump care', 'Clean and dry until it falls off', `openPage('chg:${CAT}:d:cord')`], ['bath', 'Sponge baths', 'Until the cord falls off', go('bath', 0)], ['skin', 'Normal newborn skin', 'Peeling, white bumps and blotches', go('skin', 0)]] },
    { title: 'Tub baths and skin care', lead: 'The cord has healed, and care settles into a rhythm.',
      news: () => [['bath', 'Tub baths can start', 'About 3 a week, and hair too', go('bath', 1)], ['skin', 'Baby acne and cradle cap', 'Common now, and easy to care for', go('skin', 1)], ['diapers', 'Fewer poops can be normal', 'And straining isn’t constipation', go('diapers', 1)]] },
    { title: 'Drool, sun and busy hands', lead: 'Busy hands, lots of drool, and more time outside.',
      news: () => [['teeth', 'Teething', 'What helps, and what to skip', go('teeth', 2)], ['sun', 'Sunscreen and water', careAge() >= 6 ? 'Both can start now' : 'Both start at 6 months', go('sun', 2)], ['skin', 'Drool rash and eczema', 'Common now', go('skin', 2)], solids() && live() && answers.solids === 'Yes' ? ['diapers', 'Poop with solids', 'What’s normal now', go('diapers', 2)] : null].filter(Boolean) },
    { title: 'First teeth and first steps', lead: 'Maya sits up, pulls up, and the first teeth arrive.',
      news: () => [['teeth', hasTooth() ? 'Brushing and a first dental visit' : 'Brushing starts with the first tooth', 'Twice a day, a rice-grain smear', go('teeth', 3)], ['bath', 'The big tub', 'And why to skip bath seats', go('bath', 3)], ['clothes', 'Shoes, or bare feet?', 'Bare feet indoors, soft shoes outside', go('clothes', 3)]] }
  ];

  /* ---------- the home ---------- */
  window.careHome = function (selected = null) {
    const h = H(), now = stageNow(), v = Number.isInteger(selected) && HOME[selected] ? selected : now, st = HOME[v];
    const T = STAGE_TABLE[CAT].stages;
    const pills = h.pills('Everyday care by age', T.map((s, i) => ({ label: s.label, age: s.age, on: i === v, now: live() && i === now, onclick: `openPage('chg:${CAT}:s:${i}')`, change: typeof stageCanChange === 'function' && stageCanChange(CAT, i, now) ? `hubChangeStage('${CAT}',${i})` : '' })), CAT);
    const careNote = live() && profile.early && profile.due && ageMonths(parse(profile.due), NOW) !== actualMonth() ? (() => { const adj = careAge() !== actualMonth(); return `<p class="hub-agebasis">${F(adj ? `Following Maya’s adjusted age (${monthsLabel(careAge())}), like Feeding and Sleep.` : `Following Maya’s birthday age (${monthsLabel(actualMonth())}), like Feeding and Sleep.`)} <button onclick="hubSetAgeMode('care','${adj ? 'birthday' : 'adjusted'}')">${adj ? 'Use birthday age' : 'Use adjusted age'}</button></p>`; })() : '';
    let b = `<header class="hub-hero care-hero"><p class="hub-eyebrow">${STAGE[v]}</p><h1>${F(st.title)}</h1><p class="hub-lead">${F(st.lead)}</p></header>`;
    b += `<h2 class="hub-h2">${F(v === now && live() ? 'Right now' : 'At this stage')}</h2><div class="hub-list">${st.news().map(([k, t, s, on]) => rowK(k, t, s, on)).join('')}</div>`;
    const basics = v === 0 ? BASICS.filter(([k]) => k !== 'teeth').concat() : BASICS;
    if (v === 0) basics.splice(1, 0, ['cord', 'Cord stump']);
    b += `<h2 class="hub-h2">All the basics</h2><div class="care-grid">${basics.map(([k, t]) => tile(k, t, v)).join('')}</div>`;
    b += h.versus('Every change and every bath', ['Always', 'Gather everything first, and keep a hand on Maya.'], ['Never', 'Step away, even for a moment. Take {o} with you.']);
    const nx = HOME[v + 1];
    b += nx ? h.next(v === 0 ? 'Coming up after the first few weeks' : `Coming up at ${STAGE[v + 1].split('–')[0]} months`, nx.title, `openPage('chg:${CAT}:s:${v + 1}')`)
      : h.next('After the first birthday, usually 12–18 months', 'Toddler baths and first shoes', `openPage('chg:${CAT}:d:after1')`);
    b += h.note('Sleep sacks are in Sleep, and fevers and colds in Health. Ages are typical, and every baby moves at their own pace.');
    return `<div class="quiet-category hub-page care-v2" data-overview="${CAT}" data-care-stage="${v}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${careNote}${b}</div>`;
  };

  /* ---------- shared pieces for topic pages ---------- */
  ART.down = ART.diapers;
  const head = (k, ctx, title, lead) => { const c = COL[k];
    return `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}"><span class="dev-area-head-art"><svg viewBox="0 0 90 40" aria-hidden="true">${ART[k](c)}</svg></span><p class="hub-context">${F(ctx)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`; };
  const page = (k, inner) => { const c = COL[k]; return `<div class="quiet-category hub-page hub-detail care-v2" data-overview="${CAT}" data-ss="1" style="${yearTheme(CAT)};--ss-bg:${c[0]};--ss-ink:${c[1]}">${detailPageTop(CAT)}${inner}</div>`; };
  const h2 = t => `<h2 class="hub-h2">${F(t)}</h2>`;
  // "How it changes": one line per age, the baby's own age marked, each opening that age's version of the page.
  const strip = (k, lines, v) => { const now = stageNow();
    return h2('How it changes') + `<div class="hub-card care-strip">${lines.map((t, i) => `<button class="care-step${i === v ? ' is-on' : ''}" onclick="${go(k, i)}"${i === v ? ' aria-current="true"' : ''}><b>${STAGE[i]}${live() && i === now ? ' · Now' : ''}</b><span>${F(t)}</span></button>`).join('')}</div>`; };
  const ctx = v => `Everyday care · ${STAGE[v]}`;
  const changeSteps = () => H().steps(['Lay out a clean diaper, wipes and cream before you start.', 'Unfasten, and use the front of the old diaper to wipe the worst away.', 'Wipe front to back, then lift {p} bottom gently with a hand underneath, or roll {o} to one side, to slide the clean one under.', 'Let the skin dry, add cream if it looks red, and fasten so two fingers fit at the waist.']);
  const rashSteps = () => hubIconSteps([['diaper', 'Change often', 'Let the skin air out when you can'], ['shield', 'Thick zinc cream', 'At every change'], ['steth', 'Not better in 2–3 days?', 'Or blistering, oozing, spreading: call']], CAT, 'Change diapers often and air the skin, use a thick layer of zinc oxide cream at every change, and call your pediatrician if it blisters, oozes, spreads or isn’t better in 2–3 days.');

  /* ---------- the topic pages ----------
     Calm by default: the answer for this age, the one how-to that matters now, and when to call.
     Everything else sits in one "More" card, a row per topic that opens in place. Nothing is cut. */
  const fold = (title, items) => { const it = items.filter(Boolean); if (!it.length) return '';
    return h2(title) + `<div class="hub-card care-folds">${it.map(([t, sub, body]) => `<details class="care-fold"><summary><span><b>${F(t)}</b>${sub ? `<small>${F(sub)}</small>` : ''}</span><i aria-hidden="true">›</i></summary><div class="care-fold-body">${body}</div></details>`).join('')}</div>`; };
  const p_ = t => `<p class="care-p">${F(t)}</p>`;
  const changes = (k, lines, v) => ['How it changes as {s} {grow|grows}', 'What’s different at each age', `<div class="care-strip">${lines.map((t, i) => `<button class="care-step${i === v ? ' is-on' : ''}" onclick="${go(k, i)}"${i === v ? ' aria-current="true"' : ''}><b>${STAGE[i]}${live() && i === stageNow() ? ' · Now' : ''}</b><span>${F(t)}</span></button>`).join('')}</div>`];

  /* Step-by-step pictures for things parents learn by seeing: one card per step, swiped sideways.
     Each card is a picture and one short line. The video, where there is one, sits right under it. */
  const carousel = (k, frames, video) => { const c = COL[k];
    return `<section class="care-carousel" style="--cc-bg:${c[0]};--cc-ink:${c[1]}" aria-roledescription="carousel"><div class="care-track" tabindex="0" onscroll="careDots(this)">${frames.map(([svg, t, line], i) => `<figure class="care-card" aria-label="Step ${i + 1} of ${frames.length}: ${t.replace(/"/g, '')}">${svg}<figcaption><small>${i + 1} of ${frames.length}</small><b>${F(t)}</b><span>${F(line)}</span></figcaption></figure>`).join('')}</div><div class="care-dots" aria-hidden="true">${frames.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</div>${video ? `<a class="care-video" href="https://www.youtube.com/watch?v=${video[0]}" target="_blank" rel="noopener"><span class="care-play" aria-hidden="true">▶</span><span><b>${F('Watch it done')}</b><small>${F(video[1])} · ${F(video[2])}</small></span><span aria-hidden="true">↗</span></a>` : ''}</section>`; };
  window.careDots = el => { const i = Math.round(el.scrollLeft / (el.firstElementChild ? el.firstElementChild.offsetWidth + 12 : 1)); el.parentNode.querySelectorAll('.care-dots i').forEach((d, j) => d.classList.toggle('on', j === i)); };
  const DIAPER_ART = (() => {
    const SK = '#f7dcca', LEG = '#f1cdb6', INK = '#46638c', BG = '#e7effc', PH = '#c98f72', SL = '#8eaee0';
    const base = inner => `<svg viewBox="0 0 300 180" aria-hidden="true"><rect width="300" height="180" rx="22" fill="${BG}"/><rect x="22" y="40" width="256" height="104" rx="26" fill="#fff"/>${inner}</svg>`;
    const baby = `<circle cx="70" cy="92" r="24" fill="${SK}"/><path d="M62 90q3 3 6 0M74 90q3 3 6 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/><rect x="92" y="70" width="80" height="44" rx="20" fill="#c9d9f5"/><path d="M110 72 q-6 -14 -16 -18M110 112 q-6 14 -16 18" stroke="${SK}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M190 80 q22 -6 30 -26M190 104 q22 6 30 26" stroke="${LEG}" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="222" cy="52" r="7" fill="${LEG}"/><circle cx="222" cy="132" r="7" fill="${LEG}"/>`;
    const diaper = (f, l) => `<path d="M166 72 h22 q10 0 10 10 v20 q0 10 -10 10 h-22 Z" fill="${f}" stroke="${l}" stroke-width="2"/>`;
    const hand = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-9" y="0" width="22" height="48" rx="6" fill="${SL}"/><rect x="-7" y="-26" width="18" height="30" rx="9" fill="${PH}"/><rect x="7" y="-20" width="7" height="16" rx="3.5" fill="${PH}"/></g>`;
    const arrow = (x1, y1, x2, y2) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 7; return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M${x2 - h * Math.cos(a - .5)} ${y2 - h * Math.sin(a - .5)} L${x2} ${y2} L${x2 - h * Math.cos(a + .5)} ${y2 - h * Math.sin(a + .5)}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; };
    return [
      base(baby + diaper('#fff6dc', '#f3d58a') + `<g transform="translate(236 20)"><rect width="44" height="30" rx="7" fill="#fff" stroke="#9fb8df" stroke-width="2"/><path d="M8 15h28" stroke="#9fb8df" stroke-width="2"/></g><g transform="translate(184 14)"><rect width="40" height="26" rx="7" fill="#fff" stroke="#9bc7ac" stroke-width="2"/><rect x="13" y="-4" width="14" height="7" rx="3" fill="#9bc7ac"/></g><g transform="translate(134 18)"><rect width="36" height="13" rx="6.5" fill="#f2b8c6"/><rect x="34" y="3" width="8" height="7" rx="2" fill="#a24d6a"/></g>`),
      base(baby + diaper('#fff6dc', '#f3d58a') + `<path d="M166 72 h-14 q-6 0 -6 6 v28 q0 6 6 6 h14 Z" fill="#fffbee" stroke="#f3d58a" stroke-width="2" stroke-dasharray="4 3"/>` + arrow(178, 152, 150, 152) + hand(178, 132, -10)),
      base(baby + `<path d="M166 72 h22 q10 0 10 10 v20 q0 10 -10 10 h-22 Z" fill="#fffbee" stroke="#f3d58a" stroke-width="2" stroke-dasharray="4 3"/><rect x="168" y="84" width="22" height="16" rx="5" fill="#fff" stroke="#9bc7ac" stroke-width="2"/>` + hand(180, 112, 0) + arrow(150, 30, 196, 30) + `<text x="150" y="22" font-size="11.5" font-weight="700" fill="${INK}">front to back</text>`),
      base(baby + `<path d="M150 66 h52 q10 0 10 10 v32 q0 10 -10 10 h-52 Z" fill="#fff" stroke="#9fb8df" stroke-width="2"/><path d="M150 74 h-10 M150 110 h-10" stroke="#9fb8df" stroke-width="4" stroke-linecap="round"/>` + arrow(262, 92, 230, 92) + hand(196, 140, -20)),
      base(baby + diaper('#fff', '#9fb8df') + `<path d="M160 74 h12 M160 110 h12" stroke="#9fb8df" stroke-width="5" stroke-linecap="round"/><g transform="translate(150 50) rotate(-90)"><rect x="-20" y="-6" width="26" height="7" rx="3.5" fill="${PH}"/><rect x="-20" y="3" width="26" height="7" rx="3.5" fill="${PH}"/></g><circle cx="250" cy="34" r="15" fill="#fff"/><path d="M243 34 l5 5 9 -11" stroke="#356651" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`)
    ];
  })();
  const diaperCarousel = () => carousel('diapers', [
    [DIAPER_ART[0], 'Get everything ready', 'A clean diaper, wipes and cream within reach.'],
    [DIAPER_ART[1], 'Open and fold down', 'Unfasten, and use the front to wipe the worst away.'],
    [DIAPER_ART[2], 'Wipe front to back', 'Into the creases, then let the skin dry.'],
    [DIAPER_ART[3], 'Slide the clean one under', 'Lift gently with a hand under {p} bottom.'],
    [DIAPER_ART[4], 'Fasten', 'Cream if it looks red. Two fingers of room at the waist.']
  ]);
  /* ---------- the topic pages ----------
     Like Sleep: each page leads with what's new at this stage, open. What never changes (how to change a
     diaper, nail trimming, bath safety) is said once and folds away below, so moving up a stage never means
     rereading. A stage with nothing new for a topic just shows the reference, open. When to call stays visible. */
  const NEWLABEL = ['For the first weeks', 'New at 1–3 months', 'New at 4–6 months', 'New at 7–12 months'];
  const topicPage = (k, v, o) => {
    const h = H(), N = ((o.news || [])[v] || []).filter(Boolean), B = (o.base || []).filter(Boolean);
    let b = head(k, ctx(v), o.title, (o.lead || [])[v] || '');
    if (N.length) b += `<p class="care-newlabel">${F(NEWLABEL[v])}</p>` + N.map(([t, body]) => h2(t) + body).join('') + (o.call ? o.call(v) : '') + fold('Good to know at any age', B);
    else b += B.map(([t, , body]) => h2(t) + body).join('') + (o.call ? o.call(v) : '');
    return page(k, b);
  };
  const solids = () => !live() || answers.solids === 'Yes';
  const sixPlus = v => v === 3 || (v === 2 && (!live() ? true : careAge() >= 6));

  // Care down there: we know from onboarding for she and he; for they, a switch. Boys also choose circumcised or not.
  const anatomy = () => answers.careAnatomy || (profile.pronouns === 'he' ? 'boy' : profile.pronouns === 'she' ? 'girl' : '');
  window.careNeedTick = id => { const key = 'ahead-care-need'; let on = {}; try { on = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {} on[id] = !on[id]; try { localStorage.setItem(key, JSON.stringify(on)); } catch (e) {} const y = scrollY; render(); scrollTo(0, y); };
  window.careSet = (key, val) => { answers[key] = val; if (typeof persist === 'function') persist(); const y = scrollY; render(); scrollTo(0, y); };
  const seg = (key, cur, opts) => `<div class="care-seg" role="group">${opts.map(([val, t]) => `<button class="${cur === val ? 'is-on' : ''}" aria-pressed="${cur === val}" onclick="careSet('${key}','${val}')">${F(t)}</button>`).join('')}</div>`;
  // Asked once, right here: pronouns don't tell us this. Until it's answered, the general rule shows.
  const downThere = () => {
    const h = H(), d = answers.careDown || '';
    let b = seg('careDown', d, [['girl', 'Girl'], ['circ', 'Boy, circumcised'], ['boy', 'Boy, not circumcised']]);
    if (d === 'girl') return b + h.steps(['Wipe front to back, every change.', 'A little white discharge, or light bleeding for a few days (often between days 2 and 10), is normal. It comes from mom’s hormones.', 'Swollen-looking genitals are normal at first too, and settle over the first weeks.'])
      + h.tip('Call your pediatrician', 'Bleeding that lasts more than 3–4 days, or starts after the first week.');
    if (d === 'circ') return b + h.steps(['A dab of petroleum jelly on the tip at every change, so it doesn’t stick to the diaper.', 'Clean gently with warm water, not wipes, until it heals, in about 7–10 days.', 'A red tip and a soft yellow film are normal healing. If there’s a small plastic ring, let it fall off on its own, usually in 5–10 days.'])
      + h.tip('Call your pediatrician', 'Bleeding bigger than a quarter, swelling, pus-filled blisters, a fever, no pee within 8 hours, or a ring still on after 10 days.');
    if (d === 'boy') return b + h.steps(['Wash the outside like the rest of the diaper area. Nothing special is needed.', 'Never pull back the foreskin. It loosens on its own, over years.']);
    return b + p_('Pick one above to see only the care that fits. Until then, here’s each:') + h.tip('Girls', 'Wipe front to back, every change. A little discharge or light bleeding in the first days is normal.') + h.tip('Boys, circumcised', 'A dab of petroleum jelly on the tip at every change, until it heals in about 7–10 days.') + h.tip('Boys, not circumcised', 'Wash the outside only. Never pull back the foreskin.');
  };
  const ramp = () => `<div class="hub-card care-ramp">${[['Days 1–2', '1–2 wet', 'Black, sticky poop'], ['Days 3–4', '3 or more wet', 'Turning green, then yellow'], ['Day 5', '5 or more wet', 'Yellow and seedy if breastfed, tan if formula'], ['From about day 6', '6 or more wet', 'Often a poop after feeds']].map(([d, w, p]) => `<div><b>${F(d)}</b><span>${F(w)}</span><small>${F(p)}</small></div>`).join('')}</div>`;
  const rashHow = () => H().steps(['Change often, and let the skin air out when you can.', 'A thick layer of zinc oxide or petroleum cream at every change. Fragrance-free wipes, and no antibiotic ointment.', 'Shiny, bright red in the skin folds is often yeast, which needs a different cream. Regular diaper rash usually spares the folds.']) + H().tip('Call your pediatrician', 'Not better in 2–3 days, or blisters, pus, oozing or a fever.');
  // Each rash opens right here: what it looks like, what helps, when to call. One tap, never two.
  const rashLink = ids => `<div class="hub-card care-folds">${ids.map(id => { const r = RASH[id];
    return `<details class="care-fold"><summary><span><b>${F(r.t)}</b><small>${F(r.look)}</small></span><i aria-hidden="true">›</i></summary><div class="care-fold-body"><p class="care-p">${F(r.lead)}</p>${H().tips(r.steps)}${r.call ? `<p class="care-p"><b>${F('Call your pediatrician:')}</b> ${F(r.call)}</p>` : ''}${r.alt ? `<p class="care-p">${F('Not quite it? It could be ' + r.alt.map(a => RASH[a].t.toLowerCase()).join(' or ') + '.')}</p>` : ''}</div></details>`; }).join('')}</div>`;
  const urgent = t => `<p class="care-urgent"><b>${F('Get help right away:')}</b> ${F(t)}</p>`;

  const TOPIC = {
    diapers: v => topicPage('diapers', v, {
      title: 'Diapers',
      lead: ['What to expect in the first week, and how to change one.', 'Fewer poops can be normal now, and sizes go up.', solids() ? 'Solids change what’s in the diaper.' : 'Not much changes until solids start.', 'Wriggly changes, and poop that looks like food.'],
      news: [
        [['Day by day, the first week', ramp() + p_('Many breastfed babies poop after every feed in the first weeks.')], ['How to change a diaper', diaperCarousel()], ['Care down there', downThere()], ['A pink or orange stain?', p_('In the first days, a pink or brick-colored stain is usually very concentrated pee. It can mean {s} {need|needs} more feeds. Call if it lasts past the first few days.')], ['The cord', p_('Fold the top of the diaper down so the stump stays in the air.') + `<div class="hub-list care-link">${rowK('cord', 'Cord stump care', 'Until it falls off', `openPage('chg:${CAT}:d:cord')`)}</div>`]],
        [['Fewer poops can be normal', p_('From about 3–6 weeks, many breastfed babies poop less often, some only once a week. That’s fine if it’s soft and {s’s} feeding and gaining well. Formula-fed babies usually go most days.') + p_('Still 6 or more wet diapers a day.')], ['Straining isn’t constipation', p_('Grunting, straining and going red is normal. Constipation means hard, pebble-like poop.') + H().tip('Call your pediatrician', 'Hard poop, blood, or straining for more than 10 minutes without success.')], ['Sizing up', p_('Leaks, red marks at the legs or waist, or tabs that don’t reach the middle mean it’s time for the next size. Keep a spare pack one size up.')]],
        [solids() && ['Once solids start', p_('Poop gets thicker, browner and smellier, can take on the color of the food, and may have bits in it. That’s normal.') + p_('It can get harder too. Pears, prunes and peaches help. Call if it’s hard and pebbly for more than a few days.')]],
        [['Wriggly changes', H().steps(['Hand {o} a toy to hold, or sing the same song each time.', 'Keep one hand on {o} on the changing table, always.', 'Once {s} {pull|pulls} up, a standing change can be easier.'])], solids() && ['Poop with solids', p_('Thicker, browner, sometimes with bits of food. Pears, prunes and peaches help if it gets hard.')]]
      ],
      base: [v > 0 && ['How to change a diaper', 'Five steps', diaperCarousel()], ['Diaper rash', 'What helps, and yeast rash', rashHow()], v === 0 && ['Sizing up', 'When to move up', p_('Leaks, red marks at the legs or waist, or tabs that don’t reach the middle mean it’s time for the next size.')], v > 0 && ['Care down there', 'For girls and boys', downThere()], ['How many wet diapers?', '6 or more a day after the first week', p_('6 or more wet diapers a day is the sign {s’s} getting enough milk.')]],
      call: v => H().versus('Normal, or time to call?', ['Normal', 'Yellow, green, orange or brown. ' + (v === 0 ? 'Black and sticky only in the first few days.' : 'Anywhere from several a day to once every few days.')], ['Call your pediatrician', 'Black poop after day 3, red or blood, fewer than 4 wet diapers a day, or watery poop many times a day (right away under 3 months).']) + urgent('White, gray or chalky poop. Call your pediatrician right away.')
    }),

    bath: v => topicPage('bath', v, {
      title: 'Baths and hair',
      lead: ['Sponge baths until the cord stump falls off.', 'Tub baths can start.', 'Often part of bedtime now.', 'Sitting up, and the big tub.'],
      news: [
        [['Sponge baths for now', hubEmbed('uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth') + p_('Until the cord stump falls off (and a circumcision heals). Face first with plain water, then the body one part at a time, diaper area last. Keep {o} wrapped and warm.') + p_('In between, wipe {p} face, neck and diaper area. Not straight after a feed, or when {s’s} hungry.')]],
        [['Tub baths can start', hubEmbed('VsUla1M7eHQ', 'How to give your baby a tub bath', 'Nemours KidsHealth') + p_('About 2 inches of warm water, around 100°F. Test it with your wrist or elbow. One hand behind {p} head and neck the whole time.')], ['How often', p_('About 3 baths a week is plenty in the first year. More can dry {p} skin.')], ['Washing hair', p_('2–3 times a week with a little mild baby shampoo. Rinse with a wet washcloth, front to back.')]],
        [['Part of bedtime', p_('Many families make the bath part of a calm bedtime routine.') + `<div class="hub-list care-link">${rowK('bath', 'Start a bedtime routine', 'Bath, feed, book, bed · In Sleep', "openPage('chg:Sleep:d:routine')")}</div>`]],
        [['The big tub', H().steps(['Once {s} {sit|sits} steadily on {p} own, the big tub is fine.', 'A non-slip mat, and water no higher than {p} waist when sitting.', 'Expect {o} to try to pull up. Keep a hand on {o}.'])], ['Skip bath seats', p_('Pediatricians advise against them. They can tip over, and babies can slip out. A seat isn’t a safety device.')]]
      ],
      base: [v !== 1 && ['How often', 'About 3 a week', p_('About 3 baths a week is plenty in the first year. More can dry {p} skin.')], v > 1 && ['The water', '2 inches, about 100°F', p_('About 2 inches of warm water, around 100°F. Test it with your wrist or elbow.')], v > 1 && ['Washing hair', '2–3 times a week', p_('A little mild baby shampoo. Rinse with a wet washcloth, front to back.')], ['Water heater', '120°F or lower', p_('At 120°F or lower, tap water can’t scald.')]],
      call: () => H().versus('Every bath', ['Always', 'Keep a hand on Maya the whole bath.'], ['Never', 'Step away, even for a second. Babies can slip under quietly. Take {o} with you.'])
    }),

    skin: v => topicPage('skin', v, {
      title: 'Skin and rashes',
      lead: ['Newborn skin does a lot of surprising, normal things.', 'Baby acne and cradle cap are common now.', 'Drool, and sometimes eczema.', 'Heat rash in warm weather, and eczema that comes and goes.'],
      news: [
        [['Normal newborn skin', H().steps(['Peeling or flaky skin in the first 1–2 weeks.', 'Tiny white bumps on the nose and chin (milia). They fade in a few weeks.', 'Red blotches with a white or yellow center, from about day 2. Gone in 1–2 weeks.', 'Pink marks on the eyelids or back of the neck (stork bites), and blue-gray patches on the back or bottom. Birthmarks, not bruises.']) + p_('None of these need treatment.')], ['Yellow skin?', `<div class="hub-list care-link">${rowK('yellow', 'Jaundice', 'What to watch for · In Health', "openPage('chg:Health:d:jaundice')")}</div>`]],
        [['Common now', rashLink(['acne', 'cradle', 'strawberry'])]],
        [['Common now', rashLink(['drool', 'eczema'])]],
        [['Common now', rashLink(['heat', 'eczema'])]]
      ],
      base: [['What’s this rash?', 'All the common ones', rashLink(RASH_ORDER)], ['Everyday skin care', 'Soap, lotion and laundry', H().steps(['Plain water is enough for most baths. Fragrance-free soap only on dirty spots.', 'Most babies don’t need lotion. For dry skin, a little fragrance-free moisturizer.', 'Wash new clothes before wearing. Fragrance-free detergent if {p} skin is sensitive.'])]],
      call: v => H().versus('Normal, or time to call?', ['Normal', 'Spots or patches that come and go while Maya seems happy and comfortable.'], ['Call your pediatrician', 'A rash with a fever, blisters, pus or oozing, or one that keeps spreading.' + (v === 0 ? ' Clusters of tiny blisters in the first 2 weeks: call now.' : '')]) + urgent('Purple or red dots that don’t fade when you press a glass on them. Call 911 or go to the ER.')
    }),

    clothes: v => topicPage('clothes', v, {
      title: 'Clothes',
      lead: ['Babies can’t tell you they’re too hot or cold, so one rule helps.', 'Swaddling stops once rolling starts.', '', 'Bare feet for first steps.'],
      news: [
        [['How many layers', `<figure class="hub-figure hub-layers" role="img" aria-label="Dress baby in one more layer than you’re wearing."><div><span>${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}</span><b>${F('You')}</b><small>${F('Comfortable in 2 layers')}</small></div><i aria-hidden="true">+1</i><div class="is-baby"><span>${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}</span><b>${F('Maya')}</b><small>${F('Needs 3')}</small></div></figure>` + p_('One more layer than you. Feel the back of {p} neck: sweaty means too warm, cool means add a layer.')], ['No hats indoors', p_('Once you’re home, skip hats inside and for sleep. They can make {o} too warm.')], ['Getting clothes on', p_('Stretch the neck opening wide and ease it over the back of {p} head first, then the face. Snaps or a zip down the front, and nothing with strings or ribbons near the neck.')]],
        [['Stop swaddling at the first roll', `<div class="hub-list care-link">${rowK('clothes', 'Swaddles and sleep sacks', 'When to switch · In Sleep', "openPage('chg:Sleep:safe')")}</div>`]],
        [],
        [['Bare feet, then soft shoes', p_('Bare feet or socks indoors help {o} balance while {s} {learn|learns} to walk. Shoes only once {s’s} walking outside: soft, flexible and non-skid. Check the fit every month.')]]
      ],
      base: [v > 0 && ['How many layers', 'One more than you', p_('One more layer than you. Sweaty neck means too warm; cool means add a layer.')], ['For sleep', 'Snug pajamas and a sleep sack', p_('Snug-fitting pajamas, no loose or oversized clothes, and a sleep sack instead of blankets.')], ['In the car seat', 'No puffy coats', p_('Take off puffy coats first. Buckle {o} in, then put a blanket over the straps. If you can pinch the strap, tighten it.')]]
    }),

    sun: v => topicPage('sun', v, {
      title: 'Sun and heat',
      lead: ['Young skin burns easily, so shade comes first.', '', sixPlus(v) ? 'Sunscreen and sips of water can start now.' : 'Sunscreen and water can start at 6 months.', ''],
      news: [
        [['Shade, not sunscreen', p_('Keep {o} out of direct sun: shade, light long sleeves and a wide-brimmed hat. If there’s no shade, a little sunscreen on small spots like the face is OK.')], ['No water yet', p_('Even on hot days, extra milk feeds are all {s} {need|needs}. No water before 6 months.')]],
        [],
        [['Sunscreen from 6 months', p_('Broad-spectrum (it says so on the label), SPF 30 or more. Mineral (zinc oxide or titanium) is gentlest; skip sprays. Put it on 15–30 minutes before going out, and again every 2 hours and after water.')], ['Water from 6 months', p_('Small sips from a cup with meals, about 4–8 ounces a day in all. Milk is still the main drink.')]],
        []
      ],
      base: [!sixPlus(v) ? ['Sun protection', 'Shade first', p_('Shade, light long sleeves and a wide-brimmed hat. A little sunscreen on the face only if there’s no shade.')] : ['Sun protection', 'Shade, a hat and SPF 30', p_('Shade and a hat first, then sunscreen on skin you can’t cover, every 2 hours and after water.')], ['Hot days', 'Layers, feeds and the stroller', H().steps(['One light layer, and shade or indoors at midday.', sixPlus(v) ? 'Extra milk feeds, and sips of water.' : 'Extra milk feeds. No water before 6 months.', 'Don’t cover the stroller with a blanket. It traps heat. Use the canopy or a clip-on shade.'])], ['At the pool or beach', 'What to bring', p_('Swim diapers, a sun shirt and a hat' + (sixPlus(v) ? ', and mineral sunscreen.' : '.') + ' Keep a hand on {o} in any water, even shallow.')]],
      call: () => H().versus('Normal, or time to call?', ['Normal', 'A little sweaty and pink, cooling down quickly in the shade.'], ['Call your pediatrician', 'Any sunburn before age 1, or fewer wet diapers than usual.']) + urgent('Hot and flushed and hard to wake, floppy, or not feeding. Cool {o} down and call 911. Never leave {o} in a car.')
    }),

    teeth: v => { const tooth = hasTooth(); return topicPage('teeth', v, {
      title: v === 3 && tooth ? 'Teeth' : 'Gums and teeth',
      lead: ['Nothing to do yet.', 'A quick wipe of the gums.', 'Teething often starts now.', tooth ? 'Brushing, and a first dental visit.' : 'Brushing starts with the first tooth.'],
      news: [
        [['Little white bumps on the gums?', p_('Normal in newborns. They go away on their own in the first month or two.')]],
        [['Wiping gums', p_('Twice a day, wipe {p} gums with a soft, clean cloth: after the first feed and before bed. It gets {o} used to it.')]],
        [['Teething', p_('The first tooth usually comes around 6 months, often a bottom front one. Anywhere from about 4 to 12 months is normal.') + H().steps(['What you’ll see: drool, chewing on everything, sore gums, and more fussing.', 'What helps: a clean finger on the gums, or a firm rubber teething ring, chilled in the fridge, not frozen.', 'Teething doesn’t cause fever, diarrhea, diaper rash or a runny nose.'])], ['Skip these', p_('Numbing gels, homeopathic teething tablets, and amber or other teething necklaces. Ask your pediatrician before any pain medicine.')], live() && !tooth ? ['First tooth already?', `<button class="hub-already" onclick="careSet('hasTooth','Yes');openPage('chg:${CAT}:d:c:teeth:3')">${F('Got a first tooth? See how to brush')}</button>`] : null],
        [live() && !tooth ? ['No tooth yet?', p_('That’s normal. Some babies don’t get one until around their first birthday.') + `<button class="hub-already" onclick="careSet('hasTooth','Yes');openPage('chg:${CAT}:d:c:teeth:3')">${F('Got a first tooth? See how to brush')}</button>`] : null, [tooth ? 'Brushing' : 'When the first tooth comes', `<figure class="hub-figure hub-paste" role="img" aria-label="Use a smear of toothpaste the size of a grain of rice, not a pea-sized amount."><div class="is-yes"><svg viewBox="0 0 160 60" aria-hidden="true"><rect x="58" y="34" width="96" height="14" rx="7" fill="#cfe3db"/><rect x="8" y="30" width="56" height="20" rx="8" fill="#a9cbbd"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${12 + i * 5.6}" y="16" width="3.4" height="15" rx="1.7" fill="#cfe3db"/>`).join('')}<ellipse cx="34" cy="14" rx="4.5" ry="2.6" fill="#fff" stroke="#7fb0cc" stroke-width="1.3"/></svg><b>✓ ${F('A grain of rice')}</b><small>${F('Under 3 years')}</small></div><div class="is-no"><svg viewBox="0 0 160 60" aria-hidden="true"><rect x="58" y="34" width="96" height="14" rx="7" fill="#cfe3db"/><rect x="8" y="30" width="56" height="20" rx="8" fill="#a9cbbd"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${12 + i * 5.6}" y="16" width="3.4" height="15" rx="1.7" fill="#cfe3db"/>`).join('')}<circle cx="34" cy="8" r="9" fill="#fff" stroke="#7fb0cc" stroke-width="1.3"/></svg><b>${F('Not a pea')}</b><small>${F('That’s from age 3')}</small></div></figure>` + p_('Twice a day with a soft baby toothbrush and a rice-grain smear of fluoride toothpaste, including before bed. No need to rinse.')], ['First dental visit', p_('When the first tooth comes in, and by the first birthday. Your pediatrician may also paint on fluoride varnish at checkups.')], ['No bottle in bed', p_('Milk sitting on new teeth overnight causes cavities.')]]
      ],
      base: [v > 1 && ['Wiping gums', 'Before teeth come in', p_('Twice a day with a soft, clean cloth.')], v === 3 && ['Teething', 'What helps, and what to skip', H().steps(['A clean finger on the gums, or a firm teething ring chilled in the fridge.', 'Skip numbing gels, homeopathic tablets and teething necklaces.', 'Teething doesn’t cause fever, diarrhea or diaper rash.'])]],
      call: v => v >= 2 ? H().versus('Normal, or time to call?', ['Normal', 'Drooling, chewing on everything, sore gums, and more fussing.'], ['Call your pediatrician', 'A fever of 100.4°F or higher, diarrhea or a rash. Those aren’t from teething.']) : ''
    }); },

    nails: v => topicPage('nails', v, {
      title: 'Nails, ears, nose and eyes',
      lead: ['Small jobs, quick once you know how.', '', '', ''],
      news: [[
        ['Trim tiny nails', p_('At least once a week. They grow fast and can scratch {p} face.') + H().steps(['Wait until Maya is asleep or very relaxed.', 'Baby clippers or a soft file, pressing the fingertip pad away from the nail.', 'File to a rounded edge. Don’t bite them off. A nick happens to everyone; press gently with a clean cloth.'])],
        ['Little white bumps on the gums?', p_('Normal in newborns. They go away on their own in the first month or two.')],
        ['Sneezing and noisy breathing', p_('Common in newborns. It’s usually dried milk or mucus, not a cold or allergies.')],
        ['Watery or sticky eyes', p_('About 1 in 10 newborns has a blocked tear duct: a watery eye that isn’t red. Most open on their own by the first birthday. Wipe from the inside corner out, a fresh damp cotton ball for each eye.') + H().tip('Call your pediatrician', 'A red or swollen eyelid, a red lump at the inner corner, or yellow-green discharge with redness.')]
      ]],
      base: [v > 0 && ['Nails', 'At least once a week', H().steps(['When {s’s} asleep or relaxed.', 'Baby clippers or a soft file, pressing the fingertip pad away from the nail.', 'File to a rounded edge.'])], ['Ears', 'No cotton swabs inside', p_('Wipe the outside and behind the ears with a washcloth. Earwax clears on its own.')], v > 0 && ['Eyes', 'Wipe inside corner out', p_('A fresh damp cotton ball for each eye. A watery eye that isn’t red is often a blocked tear duct, and most open by the first birthday.')], ['A stuffy nose', 'Saline and gentle suction · In Health', `<div class="hub-list care-link">${rowK('nose', 'Colds and stuffy noses', 'In Health', "openPage('chg:Health:d:cold')")}</div>`]]
    }),

    need(v) {
      const h = H(), stage = { 0: 0, 2: 1, 3: 2 }[v] ?? 0;
      // One-time shopping, so it's a checklist you can tick, kept on this phone.
      const L = [
        [['Diapers', 'Newborn size, and a pack of size 1', 'diaper'], ['Wipes and diaper cream', 'Fragrance-free wipes, zinc cream', 'shield'], ['A changing pad', 'Or a towel on the floor', 'home'],
         ['A baby tub', 'With soft washcloths and a hooded towel', 'bath'], ['A mild, fragrance-free wash', 'For hair and dirty spots', 'drop'], ['Bodysuits and sleepers', '6–8 of each, newborn and 0–3 months', 'shirt'],
         ['A sun hat', 'Wide-brimmed', 'sun'], ['Baby nail clippers', 'Or a soft file', 'nail'], ['Saline drops and a bulb syringe', 'For a stuffy nose', 'eye']],
        [['Soft bibs', 'For all the drool', 'shirt'], ['A firm teething ring', 'One you can chill in the fridge', 'toy'], ['Mineral sunscreen, SPF 30', 'For 6 months on', 'sun'], ['A stroller sunshade', 'Not a blanket over the stroller', 'home']],
        [['A soft baby toothbrush', 'For the first tooth', 'tooth'], ['Fluoride toothpaste', 'A rice-grain smear', 'drop'], ['A non-slip tub mat', 'For the big tub', 'bath'], ['Soft, flexible shoes', 'Only once walking outside', 'stand']]
      ][stage];
      const key = 'ahead-care-need', on = (() => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return {}; } })();
      const id = i => `${stage}-${i}`;
      let b = head('need', LABEL.need, v === 0 ? 'What you’ll need' : `What you’ll need at ${STAGE[v]}`, v === 0 ? 'A short list. Most of it lasts the whole first year.' : 'Just a few additions.');
      b += h.ticks(L, i => !!on[id(i)], i => `careNeedTick('${id(i)}')`, CAT);
      if (v === 0) b += h.note('Most babies don’t need lotion, and your regular laundry detergent is fine unless {p} skin is sensitive. Sleep sacks are in Sleep.');
      return page('need', b);
    }
  };

  /* ---------- the rash pages ---------- */
  const RASH_ORDER = ['acne', 'cradle', 'peeling', 'diaper', 'yeast', 'eczema', 'heat', 'drool'];
  const RASH = {
    acne: { alt: ['heat', 'eczema'], t: 'Baby acne', look: 'Small red or white bumps on the cheeks, nose and forehead', lead: 'Very common in the first weeks, usually starting at 2–4 weeks. It clears on its own.', steps: ['Wash {p} face with plain water once a day and pat dry.', 'Skip lotions and oils on the bumps, and never use acne products.', 'Tiny white dots on the nose (milia) are normal too, and fade without help.'] },
    cradle: { t: 'Cradle cap', look: 'Yellow, greasy or crusty patches on the scalp', lead: 'Common in the first months, and harmless. It usually clears up by the first birthday.', steps: ['Wash {p} hair with water or a little mild baby shampoo.', 'For stubborn flakes, rub in a little baby oil, wait a few minutes, brush gently with a soft brush, then wash the oil out.', 'Don’t pick at the flakes.'] },
    peeling: { t: 'Peeling, dry skin', look: 'Dry, flaky skin on the hands, feet and body', lead: 'Normal in the first weeks, as {p} skin gets used to the air.', steps: ['Keep baths short and use plain water.', 'A fragrance-free moisturizer is fine, but not needed.'] },
    diaper: { alt: ['yeast'], short: 'Change often, give it air time, and a thick layer of zinc cream at every change. Fragrance-free wipes, and no antibiotic ointment.', t: 'Diaper rash', look: 'Red skin where the diaper touches', lead: 'Most diaper rash clears up in 2–3 days with a few simple steps.', steps: ['Change often, and let the skin air out when you can.', 'A thick layer of zinc oxide cream at every change.', 'Skip wipes with alcohol or fragrance while it heals.'] },
    yeast: { alt: ['diaper'], t: 'Yeast diaper rash', look: 'Bright red in the skin folds, with small red spots around the edges', lead: 'A diaper rash that won’t clear with the usual cream may be yeast. It needs a different cream.', steps: ['Call your pediatrician, who may suggest an antifungal cream.', 'Keep changing often and airing the skin.'] },
    eczema: { alt: ['acne', 'drool'], t: 'Eczema', look: 'Dry, rough, itchy patches, often on the cheeks and in the creases', lead: 'Common in babies, and it comes and goes. Moisturizing is the main care.', steps: ['Short, lukewarm baths, then pat on a thick fragrance-free moisturizer while the skin is still damp.', 'Use fragrance-free soap and laundry detergent, and soft cotton clothes.', 'Keep {p} nails short to limit scratching.'], call: 'The patches crack, ooze or keep {o} up, or moisturizing doesn’t help.' },
    heat: { alt: ['acne', 'eczema'], t: 'Heat rash', look: 'Tiny red bumps where {s} got too warm, like the neck and chest', lead: 'It comes from sweat. Cooling down is all it takes.', steps: ['Move {o} somewhere cooler and take off a layer.', 'Skip creams and ointments on it; they trap heat.', 'It usually fades within a day or two.'] },
    newborn: { t: 'Newborn marks and blotches', look: 'Tiny white bumps on the nose, red blotches with a pale center, pink marks on the eyelids or neck, blue-gray patches on the back', lead: 'All common in the first weeks.', steps: ['Nothing to treat. They fade on their own, and the birthmarks aren’t bruises.'] },
    strawberry: { t: 'Strawberry mark', look: 'A raised red patch that grows for a while, then slowly fades', lead: 'A common birthmark (hemangioma). It often shows up at 2–4 weeks, grows for several months, then slowly fades over years.', steps: ['Nothing to do at home. Your pediatrician will keep an eye on it.', 'Mention it at the next checkup, so they can see how fast it grows.'], call: 'Call sooner if it’s near an eye, the nose, mouth or diaper area, bleeds, or grows very fast.' },
    drool: { alt: ['eczema'], t: 'Drool rash', look: 'Red, chapped skin on the chin, cheeks and neck', lead: 'From all the drool that comes with teething.', steps: ['Pat the chin and neck dry through the day, and keep a soft bib on.', 'A thin layer of petroleum jelly at bedtime protects the skin.'] }
  };
  function rashCall() {
    const h = H();
    return h.versus('Normal, or time to call?', ['Normal', 'Spots or patches that come and go while Maya seems happy and comfortable.'], ['Call your pediatrician', 'A rash with a fever, blisters, oozing or crusting, or one that keeps spreading.'])
      + h.tip('Get help right away', 'Tiny purple-red dots that don’t fade when you press on them, especially with a fever. Call 911 or go to the ER.');
  }
  function rashPage(id) {
    const r = RASH[id], h = H(); if (!r) return null;
    let b = head('skin', 'Skin and rashes', r.t, r.lead) + h.tip('What it looks like', r.look) + h2('What helps') + h.steps(r.steps);
    if (r.call) b += h.tip('When to call', r.call);
    if (id === 'diaper') b += `<div class="hub-list care-link">${rowK('diapers', 'Diapers', 'How to change one, and what’s normal', go('diapers'))}</div>`;
    if (r.alt) b += `<div class="hub-list care-link">${r.alt.map(a => `<button class="hub-row care-rash" onclick="openPage('chg:${CAT}:d:rash:${a}')"><span class="hub-row-copy"><b>${F('Not quite it? ' + RASH[a].t)}</b><small>${F(RASH[a].look)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`).join('')}</div>`;
    b += rashCall();
    return page('skin', b);
  }

  /* ---------- Everyday care in Sleep's design ----------
     Home: a top card, "Care now" tiles, "What's different now" (one row per change at this stage, labeled with
     its basic), a "What's this rash?" card (like Sleep's "Rough night?"), "Normal, or time to call?", Next,
     and a short "Any time" list. Every row opens one question, answered the way Sleep answers:
     what's happening, What to do (the one card that stands out), how you'll know, and one picture or video. */
  const LABEL = { diapers: 'Diapers', bath: 'Baths', skin: 'Skin', clothes: 'Clothes', sun: 'Sun', teeth: 'Teeth', nails: 'Nails', cord: 'Cord stump', need: 'What you’ll need' };
  const looks = (title, items) => `<div class="hub-card hub-looks"><b class="hub-fig-title">${F(title)}</b><ul>${items.map(t => `<li>${F(t)}</li>`).join('')}</ul></div>`;
  const paste = () => `<figure class="hub-figure hub-paste" role="img" aria-label="Use a smear of toothpaste the size of a grain of rice, not a pea-sized amount."><div class="is-yes"><svg viewBox="0 0 160 60" aria-hidden="true"><rect x="58" y="34" width="96" height="14" rx="7" fill="#cfe3db"/><rect x="8" y="30" width="56" height="20" rx="8" fill="#a9cbbd"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${12 + i * 5.6}" y="16" width="3.4" height="15" rx="1.7" fill="#cfe3db"/>`).join('')}<ellipse cx="34" cy="14" rx="4.5" ry="2.6" fill="#fff" stroke="#7fb0cc" stroke-width="1.3"/></svg><b>✓ ${F('A grain of rice')}</b><small>${F('Under 3 years')}</small></div><div class="is-no"><svg viewBox="0 0 160 60" aria-hidden="true"><rect x="58" y="34" width="96" height="14" rx="7" fill="#cfe3db"/><rect x="8" y="30" width="56" height="20" rx="8" fill="#a9cbbd"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${12 + i * 5.6}" y="16" width="3.4" height="15" rx="1.7" fill="#cfe3db"/>`).join('')}<circle cx="34" cy="8" r="9" fill="#fff" stroke="#7fb0cc" stroke-width="1.3"/></svg><b>${F('Not a pea')}</b><small>${F('That’s from age 3')}</small></div></figure>`;
  const layers = () => `<figure class="hub-figure hub-layers" role="img" aria-label="Dress baby in one more layer than you’re wearing."><div><span>${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}</span><b>${F('You')}</b><small>${F('Comfortable in 2 layers')}</small></div><i aria-hidden="true">+1</i><div class="is-baby"><span>${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}</span><b>${F('Maya')}</b><small>${F('Needs 3')}</small></div></figure>`;
  const toothBtn = (here) => live() && !hasTooth() ? `<button class="hub-already" onclick="careSet('hasTooth','Yes')${here ? '' : `;openPage('chg:${CAT}:d:p:brush')`}">${F(here ? 'Got a first tooth? Tap to mark it' : 'Got a first tooth? See how to brush')}</button>` : '';
const sunAges = () => typeof hubAgeTiles === 'function' ? hubAgeTiles({ title: 'Sun protection by age', items: [['Under 6 months', 'Shade first', 'Sunscreen only if there’s no shade'], ['6 months and up', 'Shade + SPF 30', 'Sunscreen on skin you can’t cover']], nowIndex: careAge() < 6 ? 0 : 1, cat: CAT, caption: 'Under 6 months, shade, clothes and a hat. From 6 months, shade plus SPF 30 sunscreen, reapplied every 2 hours and after water.' }) : '';
  const callTip = t => H().tip('Call your pediatrician', t);
  // Diaper rash: the two things that help as tiles, and when it's more than a rash.
  const rashBlock = (one, calls) => calls ? rashBlock(true).replace('A diaper rash not better', `${F(calls)} Or a diaper rash not better`) : `<h2 class="hub-h2">${F('If a diaper rash starts')}</h2>` + hubIconSteps([['diaper', 'Change often', 'And let the skin air out'], ['shield', 'Thick zinc cream', 'A thick layer, every change']], CAT, 'Change often and let the skin air out, and use a thick layer of zinc cream at every change.', false)
    + H().tip('Call your pediatrician', 'A diaper rash not better in 2–3 days, with blisters, pus or oozing, or shiny bright red in the skin folds.');

  // One question per page. vis comes first (a chart or steps), then the answer, then extra (a video, a call line).
  const Q = {
    firstweek: { k: 'diapers', title: 'What’s in the diaper, the first week', vis: () => ramp(),
      W: 'Wet diapers and poop change fast as feeding gets going.', D: 'Feed often, 8–12 times a day, and keep a rough count of wet diapers for the first week.',
      K: 'From about day 6, that pattern means {s’s} getting enough. A pink or orange stain in the first days is usually just very concentrated pee, and can mean {s} {need|needs} more feeds.',
      extra: () => callTip('Fewer wet diapers than the chart shows, black poop after day 3, red or bloody poop, a pink stain past the first few days, or watery poop many times a day (right away under 3 months).') + urgent('White, gray or chalky poop. Call your pediatrician right away.') },
    change: { i: 'hand', k: 'diapers', title: 'How to change a diaper', vis: () => diaperCarousel(),
      D: 'Change when wet or dirty, about 8–12 times a day at first. Keep one hand on {o} on the changing table, always.',
      K: 'Leaks, red marks at the legs or waist, or tabs that don’t reach the middle.', Kl: 'Time for the next size',
      extra: () => rashBlock() },
    cord: { k: 'cord', title: 'Keep the cord clean and dry', vis: () => hubStageStrip({ title: 'The cord stump', items: [['cord', 'Birth', 'Clamped and drying'], ['clock', '1–3 weeks', 'Falls off on its own'], ['heart', 'Once it’s off', 'A small belly button scab']], nowIndex: -1, cat: CAT, caption: 'The cord stump dries and falls off on its own, usually in 1 to 3 weeks.' }),
      W: 'The stump dries up and falls off on its own, usually in 1–3 weeks.', tilesT: 'Keep it dry', tiles: () => [['diaper', 'Fold the diaper down', 'So the stump stays in the air'], ['drop', 'Dirty? Plain water', 'Then pat dry. No alcohol'], ['heart', 'Let it fall off', 'Even if it’s hanging on']], D: '',
      K: 'It darkens and dries out. A spot of blood when it comes off is normal.', Kl: 'How you’ll know it’s healing',
      extra: () => hubEmbed('qFPA-4A_8wY', 'How to care for the umbilical cord', 'Nemours KidsHealth') + callTip('A yellow, smelly discharge, redness or warmth around the base, crying when you touch it, bleeding that doesn’t stop, or still on after 3 weeks.') + H().tip('A small moist lump after it falls off', 'It can happen, and your pediatrician treats it quickly.') },
    sponge: { k: 'bath', title: 'Sponge baths for now', late: true, vis: () => hubEmbed('uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth'),
      W: '2–3 sponge baths a week until the cord falls off (and a circumcision heals), so the cord stays dry.', D: ['Warm the room. Not straight after a feed.', 'Face first with plain water, then the body one part at a time, diaper area last.', 'Keep {o} wrapped, and pat dry into the creases.'],
      Y: 'More baths can dry {p} skin. In between, wipe {p} face, neck and diaper area.', Yl: 'Why not more' },
    newskin: { k: 'skin', title: 'Newborn skin', vis: () => looks('What it can look like', ['Peeling or flaky skin in the first 1–2 weeks', 'Tiny white bumps on the nose and chin', 'Red blotches with a white or yellow center, gone in 1–2 weeks', 'Pink marks on the eyelids or neck, and blue-gray patches on the back or bottom: birthmarks, not bruises', 'From about 2 weeks: baby acne on the cheeks, and flaky cradle cap on the scalp']),
      W: 'Newborn skin does a lot of surprising things in the first weeks. Almost all of it is normal.', D: 'Nothing to treat. Plain water, and no lotions or creams on bumps.',
      extra: () => urgent('Clusters of tiny blisters in the first 2 weeks. Call your pediatrician right away.') + `<div class="hub-list care-link">${rowK('yellow', 'Yellow skin?', 'Jaundice · In Health', "openPage('chg:Health:d:jaundice')")}</div>` },
    nailsnose: { k: 'nails', title: 'Trim nails once a week',
      W: 'They grow fast and are sharp enough to scratch {p} face.', D: ['Wait until {s’s} asleep.', 'Baby clippers or a soft file, pressing the fingertip pad away from the nail.', 'File to a rounded edge.'],
      K: 'A small nick happens to everyone. Press gently with a clean cloth.', Kl: 'If you nick the skin', Y: 'Wipe the outside of the ears with a washcloth. No cotton swabs inside.', Yl: 'Ears',
      extra: () => false ? H().tip('Sticky eyes', 'Wipe from the inside corner out, a fresh damp cotton ball for each eye. Most blocked tear ducts open on their own by the first birthday.') + callTip('A red or swollen eyelid, a red lump at the inner corner of the eye, or yellow-green discharge with redness.') : '' },
    fewer: { i: 'clock', k: 'diapers', title: 'Fewer poops can be normal', vis: () => hubStageStrip({ title: 'How often, if breastfed', items: [['diaper', 'First weeks', 'Often after every feed'], ['diaper', 'From 3–6 weeks', 'Can be once a week']], nowIndex: typeof profile !== 'undefined' && profile.feed === 'Formula' ? -1 : (live() && (NOW - parse(profile.dob)) / 864e5 < 21 ? 0 : 1), cat: CAT, caption: 'In the first weeks, often after every feed. From about 3 to 6 weeks, it can be as little as once a week.' }),
      W: 'From about 3–6 weeks, many breastfed babies poop less often, some only once a week. Formula-fed babies usually go most days.', D: 'Count wet diapers, not poops: 6 or more a day means {s’s} getting enough. Grunting, straining and going red to poop is normal too.',
      K: 'It’s soft when it comes, and {s’s} feeding and gaining well.', extra: () => rashBlock(true, 'Hard, pebble-like poop, blood, or straining for more than 10 minutes without success.') + urgent('White, gray or chalky poop. Call your pediatrician right away.') },
    tub: { k: 'bath', title: 'Tub baths can start', vis: () => (window.hubFigure ? hubFigure('tub', CAT, 'A baby lying back in a baby tub with about 2 inches of warm water, a hand supporting the head and neck.') : ''),
      W: 'Once the cord has fallen off and healed (and a circumcision too). About 3 baths a week, and hair 2–3 times a week with a mild shampoo.', D: ['Gather everything first: towel, washcloth, mild soap, a clean diaper.', 'Test the water with your wrist before {s} goes in.', 'Wash {p} face first and hair last, so {s} {stay|stays} warm.'],
      extra: () => hubEmbed('VsUla1M7eHQ', 'Giving a tub bath', 'Nemours KidsHealth') + `<p class="ss-small"><b>Water heater:</b> ${F('set it to 120°F or lower, so scalds are much less likely.')}</p>` + H().versus('Every bath', ['Always', 'Keep a hand on Maya the whole bath.'], ['Never', 'Step away, even for a second. Babies can slip under quietly. Wrap {o} in a towel and take {o} with you.']) },
    acne: { i: 'smile', k: 'skin', late: true, title: 'Baby acne and cradle cap', vis: () => rashLink(['acne', 'cradle', 'strawberry']),
      W: 'All three are common now, and nothing here needs treatment at home.', tips: false,
      K: 'Baby acne usually fades by 4–6 months, cradle cap by the first birthday.', Kl: 'How long it lasts' },
    gums: { i: 'tooth', k: 'teeth', title: 'Wipe {p} gums', W: 'Wiping now gets {o} used to brushing later.', D: '', K: 'First teeth usually come around 6 months.', Kl: 'What’s next', Y: () => stageNow() === 0 ? 'Tiny white bumps on a newborn’s gums are normal, and go away on their own.' : '', Yl: 'Good to know' },
    shade: { k: 'sun', title: 'Shade first', vis: () => sunAges(), W: 'Under 6 months, skin burns fast and babies overheat easily.', tiles: () => [['home', 'Shade first', 'Especially midday'], ['shirt', 'Cover up', 'Light long sleeves and a wide hat'], ['sun', 'No shade at all?', 'A little mineral sunscreen on the face']], tips: false, D: '',
      Y: 'Extra milk feeds, and no water yet. One light layer, and the canopy, not a blanket, over the stroller.', Yl: 'Hot days',
      extra: () => callTip('Any sunburn before age 1, right away.') + urgent('Hot and flushed and hard to wake, floppy, or not feeding. Cool {o} down and call 911.') },
    teething: { k: 'teeth', title: 'Soothe sore gums', vis: () => looks('What you’ll see', ['Drool, and chewing on everything', 'Sore, swollen gums', 'More fussing than usual, for a few days']),
      W: 'The first tooth usually comes around 6 months, often a bottom front one. Anywhere from 4 to 12 months is normal.', tiles: () => [['hand', 'A clean finger', 'Rub the sore gums'], ['toy', 'A teething ring', 'Firm, chilled, not frozen'], ['shirt', 'A soft bib', 'Pat the drool dry']], tips: false, D: '',
      Y: 'Teething doesn’t cause fever, diarrhea, diaper rash or a runny nose. If you see those, check “Seems sick” in Health.', Yl: 'Good to know',
      extra: () => H().tip('Skip these', 'Numbing gels, homeopathic teething tablets, and amber or other teething necklaces. Ask your pediatrician before any pain medicine.') },
    drool: { i: 'drop', k: 'skin', late: true, title: 'Drool rash and eczema', vis: () => rashLink(['drool', 'eczema']),
      W: 'All that drool, and dry air, can leave {p} skin red and rough.', D: '',
      },
    six: { k: 'sun', vis: () => sunAges(), title: () => careAge() >= 7 ? 'Shade first, then sunscreen on bare skin' : 'Start sunscreen and water at 6 months', W: () => careAge() >= 7 ? 'Shade and a hat still come first.' : 'From 6 months, sunscreen and sips of water can start. Shade and a hat still come first.', strip: () => hubStageStrip({ title: 'When to put sunscreen on', items: [['clock', 'Before you go out', '15–30 minutes ahead'], ['sun', 'Every 2 hours', 'Again, all day'], ['drop', 'After water', 'Again, every time']], cat: CAT, caption: 'Put sunscreen on 15 to 30 minutes before going out, again every 2 hours, and again after water.' }), K: 'Broad-spectrum, SPF 30 or more. Mineral is gentlest; skip sprays.', Kl: 'Which sunscreen', D: '',
      Y: 'Extra milk feeds, plus up to 4–8 ounces of water a day from a cup. One light layer, and the canopy, not a blanket, over the stroller.', Yl: 'Hot days',
      extra: () => callTip('Any sunburn before age 1, right away.') + urgent('Hot and flushed and hard to wake, floppy, or not feeding. Cool {o} down and call 911.') },
    after1: { k: 'bath', title: 'Brushing and baths after 1', W: 'Care stays much the same as {s} {become|becomes} a toddler.', tilesT: 'What carries on', tiles: () => [['tooth', 'Brushing', 'Twice a day, a rice-grain smear'], ['bath', 'Baths', 'A few times a week, a hand on {o}'], ['stand', 'Shoes', 'Soft and flexible, once walking outside']],
      K: 'By the first birthday, if you haven’t been yet.', Kl: 'First dental visit' },
    bedbath: { k: 'bath', title: 'Bath time can be part of bedtime', W: 'Bath, feed, book, bed: a warm bath helps many babies wind down.', tilesT: 'Bath basics', tiles: () => [['clock', 'About 3 a week', 'Still plenty'], ['drop', '2 inches, about 100°F', 'Test with your wrist'], ['bath', 'Hair 2–3 times a week', 'With a mild shampoo']], tips: false, D: '',
      extra: () => H().versus('Every bath', ['Always', 'Keep a hand on Maya the whole bath.'], ['Never', 'Step away, even for a second. Babies can slip under quietly. Take {o} with you.']) },
    diapers46: { i: 'diaper', k: 'diapers', title: 'Diapers stay much the same', W: 'Until solids start, wet diapers and poop look much like before.', D: 'Count on at least 6 wet diapers a day. Size up when you see leaks, or red marks at the legs or waist.',
      K: 'Once solids start, poop gets thicker, browner and smellier.', Kl: 'What changes next', extra: () => rashBlock(true, 'Hard, pebble-like poop, blood, or fewer than 4 wet diapers a day.') + urgent('White, gray or chalky poop. Call your pediatrician right away.') },
    solids: { i: 'bowl', k: 'diapers', title: 'Poop once solids start', W: 'Thicker, browner and smellier, sometimes the color of what {s} ate, with bits of food.', D: 'Nothing to do; it’s normal. If it gets hard, pears, prunes and peaches help.',
      extra: () => callTip('Hard, pebble-like poop for more than a few days, or blood.') },
    brush: { k: 'teeth', title: () => hasTooth() ? 'Brushing the first teeth' : 'Brushing starts with the first tooth', vis: () => paste(),
      W: () => hasTooth() ? '' : 'No tooth yet? That’s normal. Some babies don’t get one until around their first birthday.', D: 'Twice a day with a soft baby toothbrush and a rice-grain smear of fluoride toothpaste, including before bed. No need to rinse.',
      K: 'When the first tooth comes in, and by the first birthday.', Kl: 'First dental visit', Y: 'Milk on new teeth overnight causes cavities, so no bottle in bed.', Yl: 'Good to know', extra: () => toothBtn(true) },
    bigtub: { k: 'bath', title: 'Move to the big tub', W: 'Once {s} {sit|sits} steadily on {p} own, the big tub is fine.', tilesT: 'Make it safe', tiles: () => [['shield', 'A non-slip mat', 'In the tub'], ['drop', 'Waist-deep at most', 'When {s} {sit|sits}'], ['hand', 'Pulls up?', 'Sit {o} back down']], tips: false, D: '',
      extra: () => H().versus('Every bath', ['Always', 'Keep a hand on Maya the whole bath.'], ['Never', 'Step away, even for a second. Babies can slip under quietly. Take {o} with you.']),
      Y: 'Skip bath seats. They can tip over, and babies can slip out.', Yl: 'Good to know' },
    feet: { k: 'clothes', title: 'Bare feet, then soft shoes', W: 'Bare feet help {o} balance and feel the floor while {s} {learn|learns} to walk.', D: 'Barefoot or socks indoors. Shoes only once {s’s} walking outside: soft, flexible and non-skid.',
      K: 'About a finger’s width at the big toe. Check every month.', Kl: 'How a shoe should fit', Y: 'Skip walkers on wheels. They don’t help with walking, and can lead to falls.', Yl: 'Good to know' },
    wriggly: { i: 'toy', k: 'diapers', title: 'Make changes easier', W: 'Rolling and crawling can turn changes into a wrestle.', tiles: () => [['toy', 'Something to hold', 'A toy, or the same song each time'], ['hand', 'One hand on {o}', 'Always'], ['stand', 'Pulling up?', 'Try a standing change']], tips: false, D: '',
      K: 'Once solids start, poop gets thicker, browner and smellier, sometimes the color of the food. If it gets hard, pears, prunes and peaches help.', Kl: 'Poop changes with solids',
      extra: () => rashBlock(true, 'Hard, pebble-like poop, blood, or fewer than 4 wet diapers a day.') + urgent('White, gray or chalky poop. Call your pediatrician right away.') },
    // Any time
    dress: { k: 'clothes', title: 'Dressing for the weather', vis: () => layers(), D: 'One more layer than you. Feel the back of {p} neck: sweaty means too warm, cool means add a layer.',
      extra: () => looks('Also', ['No hats indoors, including for sleep', 'For sleep: snug pajamas and a sleep sack, no loose blankets', 'Snaps or zips, and nothing with strings near the neck']) + H().tip('In the car seat', 'No puffy coats under the straps. Buckle {o} in, then put a blanket over the straps.') },
    rashes: { i: 'leaf', k: 'skin', title: 'What’s this rash?', vis: () => rashLink(RASH_ORDER), W: 'Most baby rashes are harmless. Find the one you’re seeing.',
      extra: () => looks('Everyday skin care', ['Plain water is enough for most baths', 'Fragrance-free soap only on dirty spots', 'Most babies don’t need lotion', 'Fragrance-free detergent if {p} skin is sensitive']) + rashCall() }
  };
  const h2_ = t => `<h2 class="hub-h2">${F(t)}</h2>`;
  const val = x => typeof x === 'function' ? x() : x;
  function qPage(id) {
    const q = Q[id]; if (!q) return null;
    const W = val(q.W), D = val(q.D), K = val(q.K), Y = val(q.Y);
    let b = head(q.k, LABEL[q.k], val(q.title), '') + (q.vis && !q.late ? q.vis() : '') + `<section class="ss-moment">`
      + (W ? `<p class="ss-what">${F(W)}</p>` : '') + (q.strip ? q.strip() : '') + (q.tiles ? `<h2 class="hub-h2">${F(q.tilesT || 'What helps')}</h2>` + hubIconSteps(q.tiles(), CAT, F(q.tiles().map(t => t[1] + ': ' + t[2]).join('. ')), false) : '') + (D ? `<section class="ss-do"><b>What to do</b>${Array.isArray(D) ? (q.tips ? `<ul class="care-do care-tips">${D.map(t => `<li>${F(t)}</li>`).join('')}</ul>` : `<ol class="care-do">${D.map(t => `<li>${F(t)}</li>`).join('')}</ol>`) : `<p>${F(D)}</p>`}</section>` : '')
      + (K ? `<p class="ss-know"><b>${F(q.Kl || 'How you’ll know')}</b>${F(K)}</p>` : '') + (Y ? `<p class="ss-small"><b>${F((q.Yl || 'Why it matters') + ':')}</b> ${F(Y)}</p>` : '') + `</section>` + (q.vis && q.late ? q.vis() : '') + (q.extra ? q.extra() : '');
    return page(q.k, b);
  }

  /* ---------- The "What to do now" pages: one strict, calm template ----------
     A title, one line on what's happening, What to do as up to 3 short steps (the one card that stands out),
     at most one picture or video (only when it teaches), one sentence on what's normal, and one quiet line on
     when to call. A red line only for something truly urgent. Nothing else. */
  const Q2 = {
    firstweek: { k: 'diapers', title: 'Diapers in the first week', W: 'Wet diapers build up day by day as feeding gets going.',
      do: ['Feed often, 8–12 times a day.', 'Keep a rough count of wet diapers this week.', 'From about day 6, expect 6 or more a day.'], vis: () => ramp(),
      N: 'Black, sticky poop for the first few days, then yellow and seedy (tan if formula). A pink stain in the first days is usually just very concentrated pee.',
      call: 'Fewer wet diapers than this, or black poop after day 3.', urgent: 'White, gray or chalky poop: call right away.' },
    change: { k: 'diapers', title: 'How to change a diaper', W: 'About 8–12 times a day at first. It gets quick.',
      do: ['Have a clean diaper, wipes and cream within reach.', 'Wipe front to back, and let the skin dry.', 'Keep one hand on {o} on the changing table, always.'], vis: () => diaperCarousel(),
      N: 'Leaks or red marks at the legs mean it’s time for the next size.' },
    downthere: { k: 'diapers', i: 'heart', title: 'Cleaning down there', W: 'A little different for girls and boys.', custom: () => downThere() },
    cordbath: { k: 'cord', title: 'The cord, and sponge baths', W: 'The cord stump dries and falls off on its own, usually in 1–3 weeks.',
      do: ['Fold the diaper down below the stump, and keep it dry.', 'Sponge baths 2–3 times a week until it falls off: face first, diaper area last.', 'Let it fall off by itself. No alcohol needed.'], vis: () => hubEmbed('uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth'),
      N: 'It darkens and dries, and a spot of blood when it comes off is normal.', call: 'A yellow, smelly discharge, redness around it, or still on after 3 weeks.' },
    nails: { k: 'nails', i: 'nail', title: 'Trim tiny nails', W: 'They grow fast and can scratch {p} face.',
      do: ['About once a week, while {s’s} asleep.', 'Baby clippers or a soft file, pressing the fingertip pad away.', 'File to a rounded edge.'], N: 'A small nick happens to everyone. Press gently with a clean cloth.' },
    tub: { k: 'bath', title: 'Tub baths', W: 'Once the cord has fallen off and healed.',
      do: ['About 2 inches of warm water, around 100°F. Test it with your wrist. (Water heater at 120°F or lower.)', 'One hand behind {p} head and neck the whole time.', 'About 3 baths a week; hair 2–3 times with a mild shampoo.'], vis: () => hubEmbed('VsUla1M7eHQ', 'How to give your baby a tub bath', 'Nemours KidsHealth'),
      urgent: 'Never step away, even for a second. Take {o} with you.' },
    gums: { k: 'teeth', title: 'Wipe {p} gums', W: 'A clean mouth before teeth come gets {o} used to it.',
      do: ['Twice a day, with a soft, clean cloth.', 'After the first feed and before bed.'], N: 'First teeth usually come around 6 months.' },
    shade: { k: 'sun', title: 'Shade first', W: 'Under 6 months, skin burns fast and babies overheat easily.',
      do: ['Shade, light long sleeves and a wide-brimmed hat.', 'On hot days, extra milk feeds (no water yet), and the canopy, not a blanket, over the stroller.', 'No shade at all? Ask your pediatrician about a little sunscreen on the face.'], call: 'Any sunburn.' },
    teething: { k: 'teeth', title: 'Teething', W: 'The first tooth usually comes around 6 months. Anywhere from 4 to 12 is normal.',
      do: ['Rub {p} gums with a clean finger.', 'Offer a firm teething ring, chilled in the fridge, not frozen.', 'Skip numbing gels and teething necklaces.'], N: 'Drool, chewing on everything and extra fussing.', call: 'A fever of 100.4°F or higher, diarrhea or a diaper rash. Teething doesn’t cause those.' },
    six: { k: 'sun', title: 'Sunscreen and water from 6 months', W: 'Shade and a hat still come first.',
      do: ['Sunscreen: broad-spectrum, SPF 30 or more, every 2 hours.', 'Mineral is gentlest. Skip sprays.', 'Water: small sips from a cup with meals, about 4–8 ounces a day.'], call: 'Any sunburn.' },
    brush: { k: 'teeth', title: () => hasTooth() ? 'Brushing' : 'Brushing, from the first tooth', W: () => hasTooth() ? 'Twice a day keeps new teeth healthy.' : 'No tooth yet is normal. Some come close to the first birthday.',
      do: ['A soft baby toothbrush, twice a day, including before bed. No bottle in bed.', 'A rice-grain smear of fluoride toothpaste. No need to rinse.', 'First dental visit by the first birthday.'], vis: () => paste(), extra: () => toothBtn() },
    bigtub: { k: 'bath', title: 'The big tub', W: 'Once {s} {sit|sits} steadily on {p} own.',
      do: ['A non-slip mat, and water no higher than {p} waist.', 'A hand on {o} the whole time.', 'Skip bath seats. They can tip over.'], urgent: 'Never step away, even for a second.' },
    feet: { k: 'clothes', title: 'Bare feet, then soft shoes', W: 'Bare feet help {o} balance while {s} {learn|learns} to walk.',
      do: ['Barefoot or socks indoors.', 'Soft, flexible shoes only once {s’s} walking outside.', 'Skip walkers on wheels.'] },
    wriggly: { k: 'diapers', i: 'toy', title: 'Wriggly changes', W: 'Rolling and crawling can turn changes into a wrestle.',
      do: ['Hand {o} a toy, or sing the same song each time.', 'Keep one hand on {o}, always.', 'Once {s} {pull|pulls} up, try a standing change.'] }
  };
  function q2Page(id) {
    const q = Q2[id]; if (!q) return null;
    const W = val(q.W);
    let b = head(q.k, LABEL[q.k], val(q.title), '') + (W ? `<p class="ss-what">${F(W)}</p>` : '');
    if (q.custom) b += q.custom();
    if (q.do) b += `<section class="ss-do"><b>What to do</b><ol class="care-do">${q.do.map(t => `<li>${F(t)}</li>`).join('')}</ol></section>`;
    if (q.vis) b += q.vis();
    if (q.N) b += `<p class="ss-know"><b>What’s normal</b>${F(q.N)}</p>`;
    if (q.urgent) b += `<p class="care-urgent">${F(q.urgent)}</p>`;
    if (q.call) b += `<p class="care-call"><b>${F('Call your pediatrician:')}</b> ${F(q.call)}</p>`;
    if (q.extra) b += q.extra();
    return page(q.k, b);
  }

  /* ---------- Everyday care, organized the way parents sort it (Nov 2) ----------
     One fixed set of topics, in the same order at every stage. A stage shows only the topics with something new,
     each row = the topic + what's new now. Each topic page: a one-line answer, What to do (3 steps at most), at most
     one picture or video, what's normal, one "call" line; anything extra opens in place below. */
  const TOPIC_ORDER = ['diapers', 'down', 'cord', 'bath', 'skin', 'dress', 'teeth', 'nails'];
  const TNAME = { diapers: 'Diapers', cord: 'The cord', bath: 'Bath time', skin: 'Skin', dress: 'Clothes and sun', teeth: 'Teeth', nails: 'Nails, eyes and ears', down: 'Care down there' };
  const TCOL = { diapers: 'diapers', down: 'down', cord: 'cord', bath: 'bath', skin: 'skin', dress: 'clothes', teeth: 'teeth', nails: 'nails' };
  const solidsYes = () => live() && answers.solids === 'Yes';
  const sizes = () => p_('Most babies start in newborn size and move to size 1 at around 8–10 pounds. Leaks, red marks at the legs or waist, or tabs that don’t reach the middle mean it’s time for the next size.');
  // Care down there, shown right on the Diapers page: no fold to open. We know girl or boy from onboarding;
  // only "they" gets a Girl/Boy switch. For boys we show both circumcised and not, unless we already know.
  const downInline = () => {
    const a = anatomy(), circ = answers.circumcised;
    const row = (t, x) => `<span class="care-down-row">${t ? `<strong>${F(t)}</strong>` : ''}${F(x)}</span>`;
    let b = '<div class="ss-know care-down"><b>Care down there</b>';
    if (!(profile.pronouns === 'he' || profile.pronouns === 'she')) b += (a ? '' : row('', 'Choose one to see the care that fits.')) + seg('careAnatomy', a, [['girl', 'Girl'], ['boy', 'Boy']]);
    let call = '';
    if (a === 'girl') {
      b += row('', 'Wipe front to back, every change.') + row('', 'A little white discharge or light spotting in the first weeks is normal. It comes from hormones passed on before birth.');
      call = 'Bleeding that lasts more than 3–4 days, or starts after the first week.';
    } else if (a === 'boy') {
      if (circ !== 'No') b += row(circ === 'Yes' ? '' : 'If circumcised', 'A dab of petroleum jelly on the tip at every change, and warm water instead of wipes until it heals, in 7–10 days. A red tip and a soft yellow film are normal.');
      if (circ !== 'Yes') b += row(circ === 'No' ? '' : 'If not circumcised', 'Wash the outside only. Never pull back the foreskin.');
      if (circ !== 'No') call = 'Bleeding bigger than a quarter, pus or swelling, or no pee within 8 hours of the circumcision.';
    }
    b += '</div>';
    return b + (call ? `<p class="ss-small"><b>${F('Call your pediatrician:')}</b> ${F(call)}</p>` : '');
  };
  const downLabel = () => { const a = anatomy(); return a === 'girl' ? 'For girls' : a === 'boy' ? (answers.circumcised === 'Yes' ? 'Circumcised' : answers.circumcised === 'No' ? 'Not circumcised' : 'For boys') : 'For girls and boys'; };
  // Girl or boy from onboarding pronouns; only a "they" baby gets a Girl/Boy toggle. Boys get a
  // Circumcised / Not circumcised toggle, starting on circumcised; the choice is remembered.
  const downAnat = () => anatomy() || 'girl';
  const downCirc = () => answers.circumcised || 'Yes';
  const downPick = x => F(downAnat() === 'girl' ? x.girl : downCirc() === 'Yes' ? x.cut : x.uncut);
  const downToggles = () => (profile.pronouns === 'he' || profile.pronouns === 'she' ? '' : seg('careAnatomy', downAnat(), [['girl', 'Girl'], ['boy', 'Boy']]))
    + (downAnat() === 'boy' ? seg('circumcised', downCirc(), [['Yes', 'Circumcised'], ['No', 'Not circumcised']]) : '');
  const T3 = {
    // Care down there: girl or boy comes from onboarding pronouns. No switches: a "they" baby sees both,
    // and boys see circumcised and not, unless the parent has already told us.
    down: {
      0: { html: true, pre: () => `<div class="care-toggles">${downToggles()}</div>`,
        vis: () => downAnat() === 'boy' && downCirc() === 'Yes' ? hubIconSteps([['drop', 'Add petroleum jelly', 'A dab on a square of gauze'], ['hand', 'Lay it over the tip', 'Loosely, jelly side down'], ['diaper', 'Use a new one', 'At every diaper change']], CAT, 'Put a dab of petroleum jelly on a gauze square, lay it loosely over the tip, and use a fresh one at each diaper change until it heals.') : '',
        get line() { const a = anatomy(); return a === 'girl' ? 'Wiping, and what’s normal' : a === 'boy' ? 'Circumcised or not' : 'For girls and boys'; },
        get answer() { return downAnat() === 'boy' ? 'Only gentle cleaning is needed, plus a little extra care while a circumcision heals.' : 'Only gentle cleaning is needed. A few things in the first weeks look surprising, and they’re normal.'; },
        get doText() { return downPick({ girl: 'Wipe front to back at every change, gently, between the folds.',
          cut: 'Keep the tip from sticking to the diaper until it heals, in 7–10 days. Clean it with warm water, not wipes.',
          uncut: 'Wash the outside only. Never pull back the foreskin.' }); },
        get normal() { return downPick({ girl: 'A little white discharge or light spotting, and swollen-looking genitals, in the first weeks. It comes from hormones passed on before birth.',
          cut: 'While it heals: a red tip and a soft yellow film. A plastic ring, if there is one, falls off on its own in 5–10 days.',
          uncut: 'The foreskin stays attached for years, and loosens on its own.' }); },
        get call() { return downPick({ girl: 'Bleeding that lasts more than 3–4 days, or starts after the first week.',
          cut: 'Bleeding bigger than a quarter, pus or swelling, no pee within 8 hours, or a ring still on after 10 days.',
          uncut: 'Redness, swelling or pain when {s} {pee|pees}.' }); } }
    },
    diapers: {
      0: { line: 'How to change one', get answer() { return CURV === 0 ? 'About 8–12 changes a day at first. It gets quick.' : 'Fewer changes now than in the first weeks. Change when wet or dirty.'; },
        get doText() { return 'Change when wet or dirty, and keep one hand on {o} on the changing table.' + (CURV === 0 ? ' Fold the top down below the cord stump.' : ''); },
        normal: 'A good fit: two fingers slide in at the waist, and no red marks at the legs.', vis: () => diaperCarousel(),
        urgent: 'White, gray or chalky poop: call your pediatrician right away.',
        more: () => [['Sizes', 'When to move up', sizes()]] },
      2: { line: 'Rolling on the changing table', answer: 'Most babies roll from 4–6 months, often with no warning, and can roll off in a second.',
        doText: 'Set up every change so you never need to step away.',
        vis: () => hubIconSteps([['hand', 'One hand on {o}', 'Every change'], ['mat', 'The floor', 'When you need both hands'], ['toy', 'A toy to hold', 'Keeps hands busy']], CAT, 'Keep one hand on the baby, change on the floor when you need both hands, and give the baby a toy to hold.', false),
        urgent: 'Never step away from the changing table, even for a second.' },
      3: { line: 'Wriggly changes', answer: 'Rolling and crawling can turn changes into a wrestle.',
        doText: 'Keep changes quick, and keep {p} hands busy.',
        vis: () => hubIconSteps([['toy', 'A toy to hold', 'Or the same song'], ['hand', 'One hand on {o}', 'Every change'], ['stand', 'Standing changes', 'Once {s} {pull|pulls} up']], CAT, 'Hand the baby a toy, keep one hand on the baby, and try standing changes once pulling up.', false) }
    },
    cord: {
      0: { line: 'Keep it dry. It falls off in 1–3 weeks', answer: 'The stump dries and falls off on its own, usually in 1–3 weeks.',
        doText: 'Fold the diaper down below it and keep it dry. If it gets dirty, a little soap and water. Let it fall off by itself.',
        normal: 'It darkens and dries, and there’s a spot of blood when it comes off.',
        vis: () => hubEmbed('qFPA-4A_8wY', 'How to care for the umbilical cord', 'Nemours KidsHealth'),
        call: 'A yellow, smelly discharge, redness around it, or still on after 3 weeks.' }
    },
    bath: {
      0: { line: 'Sponge baths until the cord falls off', answer: '2–3 sponge baths a week, until the cord stump falls off. In between, wipe {p} face, neck and diaper area.',
        doText: 'In a warm room: face first with plain water, then the body, diaper area last. Keep {o} wrapped and warm.',
        vis: () => hubEmbed('uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth'),
        urgent: 'Never leave {o} alone in a bath, even for a second.' },
      1: { line: 'Tub baths can start', answer: 'About 3 baths a week in a baby tub, once the cord has healed.',
        doText: 'About 2 inches of warm water, around 100°F. One hand behind {p} head and neck the whole time. Hair 2–3 times a week, with a little mild shampoo.',
        normal: 'The water’s right when it feels warm, not hot, on your wrist.',
        vis: () => hubEmbed('VsUla1M7eHQ', 'How to give a tub bath', 'Nemours KidsHealth'),
        urgent: 'Never step away, even for a second. Take {o} with you.' },
      3: { line: 'The big tub, once {s} {sit|sits} steadily', answer: 'Once {s} {sit|sits} steadily on {p} own, the big tub is fine.',
        doText: 'Set up the big tub the same safe way every time, and stay right there. Skip bath seats; they can tip over.',
        normal: 'Sitting steadily means sitting up without your hands or {p} own for support.',
        vis: () => hubIconSteps([['mat', 'Non-slip mat', 'In the tub'], ['drop', 'Shallow water', 'A few inches'], ['hand', 'A hand on {o}', 'The whole time']], CAT, 'A non-slip mat, a few inches of water, and a hand on the baby the whole time.', false),
        urgent: 'Never step away, even for a second.' }
    },
    skin: {
      1: { line: 'Baby acne and cradle cap', answer: 'Both are common now and clear up on their own: acne by 4–6 months, cradle cap usually by the first birthday.',
        doText: 'Keep it gentle. Skip acne creams, and don’t pick at the flakes.',
        normal: 'Baby acne: small red bumps on the cheeks and nose. Cradle cap: yellow, greasy flakes on the scalp.',
        vis: () => hubIconSteps([['drop', 'Baby acne', 'Plain water only, no lotions'], ['bath', 'Cradle cap', 'Rub in a little oil, then a mild shampoo']], CAT, 'Baby acne: plain water only, no lotions. Cradle cap: rub in a little oil, then wash with a mild shampoo.', false), call: 'A rash with a fever, pus or oozing, or one that keeps spreading.' },
      2: { line: 'Drool rash and dry skin', answer: 'Drool can leave a red, rough rash on the chin and neck. Dry, rough patches are common too.',
        doText: 'Keep drool off {p} skin, and keep moisture in.',
        normal: 'Drool rash stays where the drool lands. Dry patches feel rough and can come and go.',
        vis: () => hubIconSteps([['towel', 'Pat drool dry', 'Chin and neck, often'], ['bath', 'Keep baths short', 'Lukewarm water'], ['drop', 'Use thick cream', 'Fragrance-free']], CAT, 'Pat the chin and neck dry often, keep baths short and lukewarm, and use a thick fragrance-free cream.', false),
        call: 'Patches that crack, ooze or bleed, or itching that keeps {o} up.' }
    },
    dress: {
      0: { line: 'One more layer than you', answer: 'Babies can’t tell you they’re too hot or cold, so one rule helps.',
        doText: 'Dress {o} in one more layer than you. No hats indoors. Choose snaps or zips, with no ties or strings near the neck. No puffy coats under car seat straps.',
        normal: 'Feel the back of {p} neck: sweaty means too warm, cool means add a layer.', vis: () => layers() },
      1: { line: 'Shade, not sunscreen', answer: 'Under 6 months, keep {o} out of direct sun.', 
        doText: 'Shade, light long sleeves and a wide-brimmed hat. On hot days, extra milk feeds, and no water yet. No shade at all? Ask your pediatrician about a little sunscreen on the face.',
        normal: 'Too much sun shows as pink skin, often hours later.', call: 'Any sunburn.' },
      2: { line: 'Sunscreen from 6 months', get answer() { return sixNow() ? 'At 6 months, sunscreen can join shade and a hat.' : 'Shade only until 6 months. Then sunscreen can join in.'; }, 
        get doText() { return sixNow() ? 'Shade and a hat first. Then broad-spectrum sunscreen, SPF 30 or more, every 2 hours. Mineral is gentlest.' : 'Keep {o} in the shade, with light long sleeves and a wide-brimmed hat. From 6 months, add SPF 30 sunscreen every 2 hours.'; },
        normal: 'Too much sun shows as pink skin, often hours later.', call: 'Any sunburn.' },
      3: { line: 'Bare feet, then soft shoes', answer: 'Bare feet help {o} balance while {s} {learn|learns} to walk.',
        doText: 'Barefoot or socks indoors. Soft, flexible shoes only once {s’s} walking outside. In the sun: shade, a hat, and SPF 30 sunscreen every 2 hours.' }
    },
    teeth: {
      2: { line: 'Teething often starts', answer: 'The first tooth usually comes around 6 months. Anywhere from 4 to 12 is normal.',
        doText: 'Comfort sore gums with gentle pressure and something cool, and skip the remedies that aren’t safe.',
        normal: 'Drool, chewing on everything and extra fussing.',
        vis: () => hubIconSteps([['hand', 'A clean finger', 'Rub the gums'], ['toy', 'A teething ring', 'Chilled, not frozen'], ['shield', 'Skip these', 'Numbing gels, necklaces']], CAT, 'Rub the gums with a clean finger, offer a chilled teething ring, and skip numbing gels and teething necklaces.', false), call: 'A fever of 100.4°F or higher, diarrhea or a rash. Teething doesn’t cause those.', extra: () => toothBtn() },
      3: { line: () => hasTooth() ? 'Brushing, twice a day' : 'Brushing starts with the first tooth', answer: () => hasTooth() ? 'Twice a day keeps new teeth healthy.' : 'No tooth yet is normal. Some come close to the first birthday.',
        get doText() { return hasTooth() ? 'A soft baby toothbrush and a rice-grain smear of fluoride toothpaste, twice a day. No bottle in bed. Book a first dental visit by the first birthday.' : 'Until the first tooth, comfort sore gums with a clean finger or a chilled teething ring. Once it’s in, brush twice a day with a rice-grain smear of fluoride toothpaste. Book a first dental visit by the first birthday.'; },
        get normal() { return hasTooth() ? 'Brushed well: no white film left along the gumline.' : 'Drool, chewing on everything and extra fussing can mean a tooth is on its way.'; }, vis: () => paste(), extra: () => toothBtn() }
    },
    nails: {
      0: { line: 'Trimming nails, wiping eyes and ears', answer: 'Tiny nails grow fast and can scratch. Eyes and ears just need a gentle wipe.',
        doText: 'Trim nails once a week, ideally while {s’s} asleep. Eyes and ears only need a gentle wipe.',
        normal: 'Nails are short enough when they don’t catch on a soft cloth.',
        vis: () => hubIconSteps([['nail', 'Trim nails', 'With baby clippers or a soft file'], ['eye', 'Wipe each eye', 'Nose side out, a fresh damp cotton ball'], ['ear', 'Wipe the ears', 'Outside only, no cotton swabs']], CAT, 'Nails: baby clippers or a soft file. Eyes: a fresh damp cotton ball for each eye. Ears: a washcloth, no cotton swabs.', false),
        call: 'A red or swollen eyelid, or yellow-green discharge with redness.' }
    }
  };
  const tFor = (k, v) => { const T = T3[k]; if (!T) return null; const s = T[v]; return s && (!s.when || s.when()) ? s : null; };
  let CURV = 0;
  function topic3(k, v) {
    CURV = v;
    let s = tFor(k, v), vv = v;
    if (!s) { for (let i = v; i >= 0 && !s; i--) { if (T3[k] && T3[k][i]) { s = T3[k][i]; vv = i; } } }
    if (!s && NOTYET[k]) { const hw = HOW[k]; return page(TCOL[k], head(TCOL[k], `Everyday care · ${STAGE[v]}`, TNAME[k], '') + `<p class="ss-what care-answer">${F(NOTYET[k])}</p>` + (hw ? careWhen(k, v) : '') + (k === 'skin' ? `<div class="hub-list care-link">${rowK('look', 'Something look off?', 'Poop, rashes, the cord, eyes and more', `openPage('chg:${CAT}:d:look:${v}')`)}</div>` : '')); }
    if (!s) return null;
    const ck = TCOL[k];
    let b = head(ck, `Everyday care · ${STAGE[v]}`, TNAME[k], '') + `<p class="ss-what care-answer">${F(val(s.answer))}</p>`;
    if (s.pre) b += s.pre();
    const T = x => s.html ? x : F(x); // html: the copy is already built (rows with labels), text inside already templated
    if (s.doText) b += `<section class="ss-do"><b>What to do</b><p>${T(s.doText)}</p></section>`;
    if (s.normal) b += `<p class="ss-know"><b>What to look for</b>${T(s.normal)}</p>`;
    if (s.vis) b += s.vis() || '';
    if (s.urgent) b += `<p class="care-urgent">${F(s.urgent)}</p>`;
    if (s.call) b += `<p class="ss-small"><b>${F('Call your pediatrician:')}</b> ${T(s.call)}</p>`;
    if (s.extra) b += s.extra();
    if (s.more) { const m = s.more(); b += `<div class="hub-card care-folds">${m.map(([t, sub, body]) => `<details class="care-fold"><summary><span><b>${F(t)}</b>${sub ? `<small>${F(sub)}</small>` : ''}</span><i aria-hidden="true">›</i></summary><div class="care-fold-body">${body}</div></details>`).join('')}</div>`; }
    if (HOW[k]) b += careWhen(k, v);
    return page(ck, b);
  }
  // The "when": each topic across the year, with the baby's place marked.
  const careWhen = (k, v) => { const hw = HOW[k], now = live() ? hw.now(stageNow()) : hw.now(v), here = hw.now(v);
    return `<section class="hub-card care-when" aria-label="${F('How it changes')}"><b class="hub-fig-title">${F('How it changes')}</b><ol class="care-when-line is-${hw.items.length}">${hw.items.map(([, label, when], i) => {
      const st = hw.stage[i], tag = i === now ? `<em>${F('Maya')}</em>` : '';
      return `<li class="${i === now ? 'is-now' : ''}${i === here && i !== now ? ' is-here' : ''}"><button onclick="openPage('chg:${CAT}:d:c:${k}:${st}')"><i aria-hidden="true"></i>${tag}<b>${F(label)}</b><small>${F(when)}</small></button></li>`; }).join('')}</ol></section>`; };
  const HOW = {
    diapers: { items: [['diaper', '8–12 a day', 'Newborn'], ['hand', 'A hand on {o}', 'Once rolling'], ['toy', 'A toy to hold', 'When wriggly'], ['stand', 'Standing changes', 'Once pulling up']], now: v => [0, 0, 1, answers.pullUp === 'Yes' ? 3 : 2][v], stage: [0, 2, 3, 3], caption: 'Diapers: 8 to 12 a day as a newborn, a hand on the baby once rolling, a toy to hold when wriggly, and standing changes once pulling up.' },
    bath: { items: [['bath', 'Sponge baths', 'Until the cord falls off'], ['tub', 'Baby tub', 'Once the cord heals'], ['mat', 'Big tub', 'Once sitting steadily']], now: v => [0, 1, 1, 2][v], stage: [0, 1, 3], caption: 'Baths: sponge baths until the cord falls off, a baby tub once it heals, and the big tub once sitting steadily.' },
    skin: { items: [['drop', 'Peeling and spots', 'First weeks'], ['smile', 'Acne and cradle cap', '1–3 months'], ['leaf', 'Drool rash', 'From about 4 months']], now: v => [0, 1, 2, 2][v], stage: [0, 1, 2], caption: 'Skin: peeling and spots in the first weeks, baby acne and cradle cap at 1 to 3 months, and drool rash from about 4 months.' },
    dress: { items: [['sun', 'Shade only', 'Under 6 months'], ['drop', 'Shade and sunscreen', 'From 6 months'], ['stand', 'Soft shoes', 'Once walking outside']], now: v => v <= 1 ? 0 : v === 2 ? (sixNow() ? 1 : 0) : (walkingSoon() ? 2 : 1), stage: [1, 2, 3], caption: 'Sun and shoes: shade only under 6 months, sunscreen from 6 months, and soft shoes once walking outside.' },
    teeth: { items: [['tooth', 'Teething', 'Often from 4–6 months'], ['smile', 'First tooth', 'Around 6 months'], ['drop', 'Brushing', 'From the first tooth'], ['steth', 'Dentist', 'By the first birthday']], now: v => v < 2 ? -1 : hasTooth() ? 2 : 0, stage: [2, 3, 3, 3], caption: 'Teeth: teething often from 4 to 6 months, the first tooth around 6 months, brushing from the first tooth, and a dentist visit by the first birthday.' }
  };
  // Your daily care: every care job that applies at this age, with the answer for now; "New" marks what changed.
  const DAILY = [
    () => [['diapers', '8–12 a day, one hand on {o}'], ['down', null], ['cord', 'Keep it dry. It falls off in 1–3 weeks'], ['bath', 'Sponge baths, 2–3 a week'], ['dress', 'One more layer than you'], ['nails', 'Trim weekly, while {s’s} asleep']],
    () => [['diapers', 'Change when wet or dirty'], ['bath', 'Baby tub, about 3 a week'], ['skin', 'Baby acne and cradle cap'], ['dress', 'One more layer, and shade only'], ['nails', 'Trim weekly, while {s’s} asleep']],
    () => [['diapers', 'Rolling: one hand on {o}, always'], ['bath', 'Baby tub, about 3 a week'], ['skin', 'Drool rash and dry skin'], ['dress', sixNow() ? 'Shade, a hat and sunscreen' : 'Shade only until 6 months'], ['teeth', 'Teething often starts'], ['nails', 'Trim weekly, while {s’s} asleep']],
    () => [['diapers', 'Wriggly: give {o} a toy to hold'], ['bath', 'The big tub, once {s} {sit|sits} steadily'], ['skin', 'Drool rash and dry skin'], ['dress', 'Bare feet indoors, sunscreen outside'], ['teeth', hasTooth() ? 'Brushing, twice a day' : 'Brushing starts with the first tooth'], ['nails', 'Trim weekly, while {s’s} asleep']]
  ];
  const dailyRow = (k, v, line) => { const c = COL[TCOL[k]], isNew = v > 0 && T3[k] && T3[k][v] && tFor(k, v);
    const sub = line == null ? val((T3[k][v] || T3[k][0]).line) : line;
    return `<button class="hub-row hl-row" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:c:${k}:${v}')"><span class="hub-dot">${hubArt(ICON[TCOL[k]], CAT)}</span><span class="hub-row-copy"><b>${F(TNAME[k])}${isNew ? `<em class="care-new">${F('New')}</em>` : ''}</b><small>${F(sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  // New for Maya now: the topics that change at this stage. All the basics: the same six tiles at every age.
  const NEWNOW = [['diapers', 'down', 'cord', 'bath'], ['bath', 'skin', 'dress'], ['diapers', 'skin', 'dress', 'teeth'], ['diapers', 'bath', 'dress', 'teeth']];
  const BASIC6 = ['diapers', 'bath', 'skin', 'dress', 'teeth', 'nails'];
  const hasAny = (k, v) => { for (let i = v; i >= 0; i--) if (T3[k] && T3[k][i]) return true; return false; };
  const basicTile = (k, v) => { const c = COL[TCOL[k]], ok = hasAny(k, v) || k !== 'teeth';
    return `<button class="care-tile${ok ? '' : ' is-later'}" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:c:${k}:${v}')"><span class="care-tile-ic">${hubArt(ICON[TCOL[k]], CAT)}</span><span class="care-tile-copy"><b>${F(TNAME[k])}</b><small>${F(TILE[v]()[k])}</small></span></button>`; };
  // A basic with nothing to do yet says so, and when it starts, instead of showing a later stage's advice.
  // One glanceable line per tile: the answer for this age, mostly a number.
  const TILE = [
    () => ({ diapers: '8–12 a day', bath: '2–3 sponge baths a week', skin: 'Peeling is normal', dress: '+1 layer, shade only', teeth: 'From about 4 months', nails: 'Trim weekly' }),
    () => ({ diapers: 'When wet or dirty', bath: 'Baby tub, about 3 a week', skin: 'Acne and cradle cap', dress: '+1 layer, shade only', teeth: 'From about 4 months', nails: 'Trim weekly' }),
    () => ({ diapers: 'One hand on {o}, always', bath: 'About 3 a week', skin: 'Pat drool dry often', dress: sixNow() ? 'Shade + SPF 30' : 'Shade only until 6 months', teeth: 'Teething often starts', nails: 'Trim weekly' }),
    () => ({ diapers: 'A hand on {o}, a toy to hold', bath: 'Big tub once sitting', skin: 'Pat drool dry often', dress: 'Bare feet indoors', teeth: hasTooth() ? 'Brush twice a day' : 'Soothe gums until a tooth', nails: 'Trim weekly' })
  ];
  const LATER = { teeth: 'From about 4 months', skin: 'Peeling is normal' };
  const NOTYET = { teeth: 'Teething usually starts around 4–6 months. There’s nothing to do yet.', skin: 'In the first weeks, peeling skin and tiny white bumps are normal and clear up on their own. Nothing else to do yet.' };
  const topicRow = (k, v) => { const s = tFor(k, v); if (!s) return ''; const c = COL[TCOL[k]];
    return `<button class="hub-row hl-row" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:c:${k}:${v}')"><span class="hub-dot">${hubArt(ICON[TCOL[k]], CAT)}</span><span class="hub-row-copy"><b>${F(TNAME[k])}</b><small>${F(val(s.line))}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  // Older links land on the topic and stage they were about.
  const Q2T = { firstweek: ['diapers', 0], change: ['diapers', 0], downthere: ['down', 0], fewer: ['look', 1], solids: ['look', 2], wriggly: ['diapers', 3], cordbath: ['cord', 0], cord: ['cord', 0], sponge: ['bath', 0], tub: ['bath', 1], bigtub: ['bath', 3], newskin: ['look', 0], acne: ['skin', 1], drool: ['skin', 2], rashes: ['look', 0], dress: ['dress', 0], shade: ['dress', 1], six: ['dress', 2], feet: ['dress', 3], gums: ['teeth', 2], teething: ['teeth', 2], brush: ['teeth', 3], nails: ['nails', 0], nailsnose: ['nails', 0] };

  const STAGES = [
    { title: 'Diapers, the cord and first baths', lead: 'It feels like a lot at first, and it gets quicker fast. Most of what looks odd in the first weeks is normal.',
      tiles: () => [['Diapers', '8–12 a day', 'Change when wet or dirty'], ['Baths', '2–3 a week', 'Sponge baths until the cord falls off'], ['Clothes', '+1 layer', 'One more than you'], ['Sun', 'Shade only', 'No sunscreen yet']],
      // The first weeks bring the most to learn, so they're grouped, like Health's checkup page, to stay easy to scan.
      rows: () => ['firstweek', 'change', 'downthere', 'cordbath', 'nails'],
      call: ['Peeling skin, tiny white bumps, sneezing, and black poop for the first few days.', 'A temperature of 100.4°F or higher, fewer wet diapers than expected, white or gray poop, a red or smelly cord, or yellow skin that’s spreading.'] },
    { title: 'Tub baths and skin care', lead: 'The cord has healed, and care settles into a rhythm. Poops can space out, and baby acne is common.',
      tiles: () => [['Diapers', '6+ wet a day', 'Poops can space out'], ['Baths', 'About 3 a week', 'In a baby tub'], ['Clothes', '+1 layer', 'One more than you'], ['Sun', 'Shade only', 'No sunscreen yet']],
      rows: () => ['tub', 'gums', 'shade'],
      call: ['Fewer poops if breastfed, grunting and going red to poop, and baby acne.', 'A temperature of 100.4°F or higher, hard pebble-like poop, blood in the diaper, or fewer wet diapers than usual.'] },
    { title: 'Drool, sun and busy hands', lead: 'Lots of drool, and teething often starts. At 6 months, sunscreen can join shade and a hat.',
      tiles: () => [['Diapers', '6+ wet a day', live() && answers.solids === 'Yes' ? 'Poop changes with solids' : 'Size up for leaks'], ['Baths', 'About 3 a week', 'Often at bedtime'], ['Clothes', '+1 layer', 'One more than you'], sixNow() ? ['Sun', 'Shade + SPF 30', 'Sunscreen from 6 months'] : ['Sun', 'Shade only', 'No sunscreen yet']],
      rows: () => ['teething', sixNow() ? 'six' : 'shade'],
      call: ['Lots of drool, chewing on everything, and more fussing than usual.', 'A fever of 100.4°F or higher (teething doesn’t cause one), or any sunburn.'] },
    { title: 'First teeth and the big tub', lead: 'Brushing starts with the first tooth, the big tub comes once sitting, and bare feet help when first steps come.',
      tiles: () => [['Diapers', '6+ wet a day', 'Wriggly changes'], ['Baths', 'About 3 a week', 'The big tub once sitting'], walkingSoon() ? ['Clothes', 'Bare feet indoors', 'Soft shoes outside'] : ['Clothes', '+1 layer', 'One more than you'], ['Sun', 'Shade + SPF 30', 'Every 2 hours']],
      rows: () => ['brush', 'bigtub', walkingSoon() ? 'feet' : null, 'wriggly'].filter(Boolean),
      call: ['Wriggly changes, firmer poop with solids, and no tooth yet.', 'A fever of 100.4°F or higher (teething doesn’t cause one), hard poop for days, or any sunburn.'] }
  ];
  // "Now" means now: sunscreen and water only from 6 months, shoes only once pulling up and cruising are close.
  const sixNow = () => !live() || careAge() >= 6;
  const walkingSoon = () => !live() || careAge() >= 9 || answers.pullUp === 'Yes';
  const qRow = (id, eyebrow = true) => { const q = Q2[id] || Q[id], c = COL[q.k];
    return `<button class="hub-row hl-row" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:q:${id}')"><span class="hub-dot">${hubArt(q.i || ICON[q.k], CAT)}</span><span class="hub-row-copy">${eyebrow ? `<small class="hub-row-eyebrow">${F(LABEL[q.k])}</small>` : ''}<b>${F(val(q.title))}</b>${q.sub ? `<small>${F(q.sub)}</small>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  window.careHome = function (selected = null) {
    const h = H(), now = stageNow(), v = Number.isInteger(selected) && STAGES[selected] ? selected : now, st = STAGES[v], nx = STAGES[v + 1];
    const T = STAGE_TABLE[CAT].stages;
    const pills = h.pills('Everyday care by age', T.map((s, i) => ({ label: s.label, age: s.age, on: i === v, now: live() && i === now, onclick: `openPage('chg:${CAT}:s:${i}')`, change: typeof stageCanChange === 'function' && stageCanChange(CAT, i, now) ? `hubChangeStage('${CAT}',${i})` : '' })), CAT);
    let b = `<header class="hub-hero care-hero"><p class="hub-eyebrow">${STAGE[v]}</p><h1>${F(st.title)}</h1><p class="hub-lead">${F(st.lead)}</p></header>`;
    // No tiles: Everyday care's answers are mostly actions, not numbers, so they read better as rows (like Health).
    const shop = v === 1 ? '' : `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('need', v)}">${F(v === 0 ? 'Getting ready? What you’ll need' : 'What you’ll need now')} ›</button></div>`;
    b += `<h2 class="hub-h2">${F(live() && v !== now ? `New at ${STAGE[v].toLowerCase() === 'newborn' ? 'the newborn stage' : STAGE[v]}` : 'New for Maya now')}</h2><div class="hub-list">${NEWNOW[v].map(k => topicRow(k, v)).join('')}</div>`;
    b += `<h2 class="hub-h2">${F('All the basics')}</h2><div class="care-grid">${BASIC6.map(k => basicTile(k, v)).join('')}</div>` + shop;
    b += `<button class="hub-rough-card care-rash-card" onclick="openPage('chg:${CAT}:d:look:${v}')"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Something look off?')}</b><small>${F(['Poop, rashes, the cord, eyes and more', 'Poop, rashes, eyes and more', 'Drool, rashes, poop and more', 'Drool, rashes, poop and more'][v])}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    b += h.versus('Normal, or time to call?', ['Normal', st.call[0]], ['Call your pediatrician', st.call[1]]);
    b += nx ? h.next(v === 0 ? 'Next, after the first few weeks' : `Next, usually from ${STAGE[v + 1].split('–')[0]} months`, nx.title, `openPage('chg:${CAT}:s:${v + 1}')`)
      : h.next('After the first birthday', 'Toddler baths and first shoes', `openPage('chg:${CAT}:d:after1')`);
    b += h.note('Sleep sacks are in Sleep, and fevers and colds in Health. Ages are typical, and every baby moves at their own pace.');
    return `<div class="quiet-category hub-page care-v2" data-overview="${CAT}" data-care-stage="${v}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${b}</div>`;
  };
  // Older links: a topic at a stage opens that stage's main question for it.
  const T2Q = { diapers: ['firstweek', 'fewer', 'solids', 'wriggly'], bath: ['sponge', 'tub', 'bedbath', 'bigtub'], skin: ['newskin', 'acne', 'drool', 'rashes'], clothes: ['dress', 'dress', 'dress', 'feet'], sun: ['shade', 'shade', 'six', 'six'], teeth: ['gums', 'gums', 'teething', 'brush'], nails: ['nailsnose', 'nailsnose', 'nailsnose', 'nailsnose'] };

  /* ---------- "Something look off?" ----------
     The in-the-moment door, like Sleep's "Rough night?": pick what you're seeing, and the answer opens right there
     (what's normal, what to do, when to call), with anything urgent first. Ordered for the baby's stage. */
  function lookOff(v) {
    const h = H(), now = v == null ? stageNow() : v, solidsOn = live() && answers.solids === 'Yes';
    const block = (normal, todo, call, urgentT, urgentL) => (normal ? `<p class="care-p"><b>${F('Normal:')}</b> ${F(normal)}</p>` : '') + (todo ? `<p class="care-p"><b>${F('What to do:')}</b> ${F(todo)}</p>` : '') + (call ? `<p class="care-p"><b>${F('Call your pediatrician:')}</b> ${F(call)}</p>` : '')
      + (urgentT ? `<p class="care-urgent"><b>${F(urgentL || 'Get help right away:')}</b> ${F(urgentT)}</p>` : '');
    const rashLine = id => { const r = RASH[id]; return `<li><b>${F(r.t)}</b> ${F(r.look + '. ' + (r.short || r.steps[0]))}</li>`; };
    const rashOrder = [['newborn', 'peeling', 'acne'], ['acne', 'cradle', 'strawberry'], ['drool', 'eczema', 'heat'], ['drool', 'eczema', 'heat']][now];
    const rest = RASH_ORDER.concat('strawberry', 'newborn').filter((id, i, a) => a.indexOf(id) === i && !rashOrder.includes(id) && !(now >= 2 && ['newborn', 'peeling', 'strawberry', 'acne', 'cradle'].includes(id)) && !(now === 1 && ['newborn', 'peeling'].includes(id)));
    const items = {
      poop: ['Poop or pee looks different', 'Colors, fewer poops, and when to call', block(
        (now === 0 ? 'Black and sticky for the first 2–3 days, then mustard-yellow and seedy if breastfed, tan if formula. ' : now <= 1 ? 'Mustard-yellow and seedy if breastfed, tan if formula. ' : '') + 'Green, yellow, orange and brown are all normal.' + (now >= 1 ? ' After the first weeks, breastfed babies can go days between poops.' : '') + (solidsOn || now === 3 ? ' Once solids start, poop gets thicker, browner and smellier, sometimes the color of the food.' : '') + ' Grunting, straining and going red to poop is normal too.',
        'Look at the color at each change. If something seems off, take a photo to show your pediatrician. Expect 6 or more wet diapers a day.',
        'Fewer than 4 wet diapers a day after the first week, ' + (now === 0 ? 'black poop after day 3, ' : '') + 'red or blood, hard pebble-like poop, or watery poop many times a day' + (now <= 1 ? ' (call right away if {s’s} under 3 months)' : '') + '.' + (now === 0 ? ' A pink or orange stain in the diaper after the first few days.' : ''),
        'White, gray or chalky poop. Call your pediatrician right away.')],
      rash: ['Spots, bumps or dry skin', now >= 2 ? 'Drool rash, eczema, heat rash' : 'Rashes, acne, cradle cap', `<ul class="care-list">${rashOrder.map(rashLine).join('')}</ul><details class="care-more"><summary>${F('More rashes')}</summary><ul class="care-list">${rest.map(rashLine).join('')}</ul></details>`
        + `<p class="care-p"><b>${F('Every day:')}</b> ${F('plain water for most baths, fragrance-free soap only on dirty spots, and most babies don’t need lotion.')}</p>` + block('', '', 'A rash with a fever, blisters, pus or oozing, or one that keeps spreading.' + (now === 0 ? ' Call right away for clusters of tiny blisters in the first 2 weeks.' : ''), 'Purple or red dots that don’t fade when you press a glass on them. Call 911 or go to the ER.')],
      cord: ['The cord', 'Smell, crust or a little blood', block('Darkening and drying, a little crust, and a spot of blood when it falls off, usually at 1–3 weeks.', 'Keep it dry and let it fall off on its own.', 'A yellow, smelly discharge, redness or warmth around it, bleeding that doesn’t stop, crying when you touch it, or still on after 3 weeks. A small moist lump after it falls off: show your pediatrician, who treats it quickly.')],
      eyes: ['Sticky eyes or a stuffy nose', 'Snuffles, sneezing, tear ducts', block('Sneezing and snuffly breathing (dried milk or mucus, not a cold), and a watery eye that isn’t red (often a blocked tear duct that opens by the first birthday).', 'Wipe sticky eyes from the nose side out, a fresh damp cotton ball for each. For a stuffy nose, a few saline drops and gentle suction. Ears: wipe the outside only, no cotton swabs.', 'A red or swollen eyelid, yellow-green discharge with redness, or a red lump at the inner corner.', 'Struggling to breathe, or blue lips. Call 911.')
        + `<div class="hub-list care-link">${rowK('nose', 'Colds and stuffy noses', 'In Health', "openPage('chg:Health:d:cold')")}</div>`],
      yellow: ['Yellow skin', 'Jaundice in the first weeks', block('Some yellow on the face in the first days is common, and usually fades on its own. On darker skin, check the whites of the eyes and the gums.', 'Sunlight isn’t a safe treatment. Feed often, and let your pediatrician check it.', 'Yellow spreading to the belly or legs, yellow whites of the eyes, or fewer wet diapers.', 'Any yellow in the first 24 hours, or yellow and hard to wake or not feeding well.')
        + `<div class="hub-list care-link">${rowK('yellow', 'Jaundice', 'What to watch for · In Health', "openPage('chg:Health:d:jaundice')")}</div>`],
      gums: ['Drool, sore gums or extra fussing', 'Could it be teething?', block('Drool, chewing on everything, sore gums and more fussing than usual, often from about 4 months.', 'A clean finger on the gums, or a firm teething ring chilled in the fridge. Skip numbing gels and teething necklaces. Fever, diarrhea or a runny nose aren’t from teething: see “Seems sick, or has a fever?” below.', '')],
      hot: ['Too hot or too cold?', 'Sweaty, flushed, chilly, what to wear', block('A warm, slightly sweaty neck after a feed or a nap.', 'Dress {o} in one more layer than you. Feel the back of {p} neck: sweaty means take off a layer, cool means add one. No hats indoors, no puffy coats under car seat straps, and snaps or zips with nothing near the neck. At the pool: a sun shirt, swim diapers, and a hand on {o} in any water.', 'Any sunburn before age 1, right away.', 'Hot and flushed and hard to wake, floppy, or not feeding. Cool {o} down and call 911.')]
    };
    const order = [['poop', 'rash', 'cord', 'yellow', 'eyes'], ['poop', 'rash', 'eyes'], ['gums', 'rash', 'poop', 'eyes'], ['gums', 'rash', 'poop', 'eyes']][now];
    const LI = { poop: 'diaper', rash: 'drop', cord: 'cord', yellow: 'steth', eyes: 'eye', gums: 'tooth', hot: 'thermo' };
    let b = head('look', 'Is this normal?', 'Something look off?', 'Pick what you’re seeing.');
    b += `<div class="hub-card care-folds care-lookoff">${order.map(k => { const [t, sub, body] = items[k]; return `<details class="care-fold"><summary><span class="care-ico">${hubArt(LI[k], CAT)}</span><span><b>${F(t)}</b><small>${F(sub)}</small></span><i aria-hidden="true">›</i></summary><div class="care-fold-body">${body}</div></details>`; }).join('')}</div>`;
    b += `<div class="hub-list care-link"><button class="hub-row hl-row" style="--hl-bg:#fdeee6;--hl-ink:#9a5a3c" onclick="openPage('chg:Health:d:sick')"><span class="hub-dot">${hubArt('thermo', 'Health')}</span><span class="hub-row-copy"><b>${F('Seems sick, or has a fever?')}</b><small>In Health</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>`;
    return page('look', b);
  }

  /* ---------- routes ---------- */
  // Older pages open the topic that now holds them, at the age they were about.
  const OLD = { sponge: ['bath', 0], tub: ['bath', 1], bathseat: ['bath', 3], skin: ['skin'], dress: ['clothes'], steps: ['clothes', 3], sun: ['sun'], gums: ['teeth', 2], teeth: ['teeth', 3], nails: ['nails'] };
  window.careTopic = function (k, v) { const now = stageNow(); v = Number.isInteger(v) && v >= 0 && v <= 3 ? v : now; return TOPIC[k] ? TOPIC[k](v) : null; };
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b, c] = p.split(':');
    if (cat === CAT && screen === 'd') {
      if (a === 'c') { const r = topic3(b, c == null ? stageNow() : Number(c)); if (r) return r; }
      if (a === 'q') { const t = Q2T[b]; const r = t ? (t[0] === 'look' ? lookOff(t[1]) : topic3(t[0], t[1])) : (q2Page(b) || qPage(b)); if (r) return r; }
      if (a === 'look') return lookOff(b == null ? null : Number(b));
      if (a === 'p') { const r = qPage(b) || q2Page(b); if (r) return r; }
      if (a === 't') { if (b === 'need') return careTopic('need', c == null ? null : Number(c)); const v = c == null ? stageNow() : Number(c), ids = T2Q[b]; if (ids) { const id = ids[v] === 'solids' && !(live() && answers.solids === 'Yes') ? 'diapers46' : ids[v] === 'six' && v === 2 && careAge() < 6 ? 'shade' : ids[v]; return qPage(id); } }
      if (a === 'cord') return qPage('cord');
      if (a === 'after1') return qPage('after1');
      if (a === 'rash') { const r = rashPage(b); if (r) return r; }
      const OLDQ = { sponge: 'sponge', tub: 'tub', bathseat: 'bigtub', skin: 'rashes', dress: 'dress', steps: 'feet', sun: stageNow() >= 2 ? 'six' : 'shade', gums: 'teething', teeth: 'brush', nails: 'nailsnose' };
      if (OLDQ[a]) return qPage(OLDQ[a]);
    }
    return baseRoute(p);
  };

  /* ---------- The home: Maya's care routine (replaces the two lists above) ---------- */
  // One card: what care looks like at this age, grouped by how often. Each line opens its basic at this age.
  // A line that changed at this stage carries "New".
  const ROUTINE = () => [
    { title: 'Most of what looks odd is normal', lead: 'The first weeks are the busiest for care, and it gets quicker fast.',
      groups: [['Every day', [['wet', 'Wet diapers', 'Count them this week', 'By day 6, at least 6 a day', 1, 'firstweek'], ['diapers', 'Diaper changes', '8–12 a day', 'Wipe front to back', 1, 'change'], ['down', 'Care down there', ...({ girl: ['Wipe front to back', 'A little discharge is normal'], circ: ['Petroleum jelly at each change', 'Until it heals, 7–10 days'], boy: ['Wash the outside only', 'Never pull back the foreskin'] }[answers.careDown] || ['Gentle cleaning with warm water', 'Tap to see the care that fits']), 1, 'downthere'], ['cord', 'The cord', 'Keep it clean and dry', 'It falls off in 1–3 weeks', 1], ['teeth', 'Gums', 'Wipe twice a day', 'With a soft, clean cloth', 1, 'gums'], ['clothes', 'Clothes', 'One layer more than you', 'No hat indoors']]],
               ['Each week', [['bath', 'Sponge baths', '2 or 3 a week', 'Until the cord falls off', 1], ['nails', 'Nails', 'Trim once a week', 'They grow fast, and they’re sharp']]]] },
    { title: 'Care settles into a rhythm', lead: 'The cord has healed, so tub baths can start, and most days look alike now.',
      groups: [['Every day', [['diapers', 'Diapers', 'At least 6 wet a day', 'Fewer poops can be normal now', 1], ['skin', 'Skin', 'Plain water on the face', 'Baby acne and cradle cap are common', 1, 'acne'], ['teeth', 'Gums', 'Wipe twice a day', 'With a soft, clean cloth', 0, 'gums'], ['clothes', 'Clothes', 'One layer more than you', 'No hat indoors']]],
               ['Each week', [['bath', 'Tub baths', 'About 3 a week', 'Hair 2–3 times a week, mild shampoo', 1], ['nails', 'Nails', 'Trim once a week', 'Easiest while asleep']]],
               ['Outside', [['sun', 'Sun', 'Shade first', 'Long sleeves and a wide-brimmed hat']]]] },
    { title: 'Drool and busy hands', lead: 'Teething often starts, and bath time gets more fun. At 6 months, sunscreen can join shade.',
      groups: [['Every day', [['teeth', 'Teething', 'Chewing and drool are normal', 'A chilled teething ring helps', 1, 'teething'], ['teeth', 'Gums', 'Wipe twice a day', 'Until the first tooth', 0, 'gums'], ['skin', 'Drool', 'Pat the chin dry often', 'It keeps drool rash away', 1], ['diapers', 'Diapers', 'At least 6 wet a day', 'Poop changes once solids start']]],
               ['Each week', [['bath', 'Baths', 'About 3 a week', 'Often part of bedtime'], ['nails', 'Nails', 'Trim once a week', '']]],
               ['Outside', [['sun', 'Sun', careAge() >= 6 ? 'Shade, then SPF 30' : 'Shade first', careAge() >= 6 ? 'Sunscreen can start now' : 'Sunscreen starts at 6 months', careAge() >= 6 ? 1 : 0]]]] },
    { title: 'First teeth and first steps', lead: 'Brushing starts with the first tooth, and the big tub comes once Maya sits steadily.',
      groups: [['Every day', [hasTooth() ? ['teeth', 'Teeth', 'Brush twice a day', 'A rice-grain smear of fluoride toothpaste', 1, 'brush'] : ['teeth', 'Teeth', 'Brush from the first tooth', 'Until then, wipe gums twice a day', 1, 'brush'], ['diapers', 'Diaper changes', 'Keep a hand on {o}', 'A toy to hold helps with wriggling', 1], ['feet', 'Feet and shoes', 'Bare feet indoors', 'Soft shoes once walking outside', 1, 'feet']]],
               ['Each week', [['bath', 'Baths', 'About 3 a week', 'The big tub, once sitting steadily', 1], ['nails', 'Nails', 'Trim once a week', '']]],
               ['Outside', [['sun', 'Sun', 'Shade, then SPF 30', 'Again every 2 hours and after water']]]] }
  ];
  window.careHome = function (selected = null) {
    const h = H(), R = ROUTINE(), now = stageNow(), v = Number.isInteger(selected) && R[selected] ? selected : now, st = R[v], nx = R[v + 1];
    const T = STAGE_TABLE[CAT].stages;
    const pills = h.pills('Everyday care by age', T.map((s, i) => ({ label: s.label, age: s.age, on: i === v, now: live() && i === now, onclick: `openPage('chg:${CAT}:s:${i}')` })), CAT);
    const careNote = live() && profile.early && profile.due && ageMonths(parse(profile.due), NOW) !== actualMonth() ? (() => { const adj = careAge() !== actualMonth(); return `<p class="hub-agebasis">${F(adj ? `Following Maya’s adjusted age (${monthsLabel(careAge())}), like Feeding and Sleep.` : `Following Maya’s birthday age (${monthsLabel(actualMonth())}), like Feeding and Sleep.`)} <button onclick="hubSetAgeMode('care','${adj ? 'birthday' : 'adjusted'}')">${adj ? 'Use birthday age' : 'Use adjusted age'}</button></p>`; })() : '';
    let b = `<header class="hub-hero care-hero"><p class="hub-eyebrow">${STAGE[v]}</p><h1>${F(st.title)}</h1><p class="hub-lead">${F(st.lead)}</p></header>`;
    const line = ([k, label, val, sub, isNew, pg]) => { const c = COL[{ wet: 'diapers', feet: 'clothes' }[k] || k] || COL.bath; if (live() && v < now) isNew = 0;
      return `<button class="rt-line" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="${pg ? `openPage('chg:${CAT}:d:p:${pg}')` : k === 'cord' ? `openPage('chg:${CAT}:d:cord')` : go(k, v)}"><span class="rt-ic">${hubArt(ICON[k], CAT)}</span><span class="rt-copy"><small>${F(label)}${isNew && v > 0 ? `<em>${F('New')}</em>` : ''}</small><b>${F(val)}</b>${sub ? `<i>${F(sub)}</i>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
    b += `<section class="rt-card"><div class="rt-head"><b>${F(`${live() && v === now ? name() + '’s' : 'The'} care routine`)}</b><small>${F(v === now && live() ? 'Right now' : 'At ' + STAGE[v].toLowerCase())}</small></div>`
      + st.groups.map(([g, items]) => `<div class="rt-group"><p class="rt-when">${F(g)}</p>${items.map(line).join('')}</div>`).join('') + `</section>`
      + (v === 1 ? '' : `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('need', v)}">${F(v === 0 ? 'Getting ready? What you’ll need' : live() && v === now ? 'What you’ll need now' : `What you’ll need at ${STAGE[v]}`)} ›</button></div>`);
    b += `<button class="hub-rough-card care-rash-card" onclick="openPage('chg:${CAT}:d:look:${v}')"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Something look off?')}</b><small>${F(['Poop, rashes, the cord, eyes and more', 'Poop, rashes, eyes and more', 'Drool, rashes, poop and more', 'Drool, rashes, poop and more'][v])}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    b += nx ? h.next(v === 0 ? 'Next, after the first few weeks' : `Next, usually from ${STAGE[v + 1].split('–')[0]} months`, nx.title, `openPage('chg:${CAT}:s:${v + 1}')`)
      : h.next('After the first birthday', 'Brushing and baths after 1', `openPage('chg:${CAT}:d:after1')`);
    b += h.note('Ages are typical. Every baby moves at their own pace.');
    return `<div class="quiet-category hub-page care-v2" data-overview="${CAT}" data-care-stage="${v}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${careNote}${b}</div>`;
  };
})();
