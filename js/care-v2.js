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
  const stageNow = () => live() ? (((NOW - parse(profile.dob)) / 864e5) < 28 ? 0 : careAge() < 4 ? 1 : careAge() < 6 ? 2 : 3) : (month < 1 ? 0 : month < 4 ? 1 : month < 6 ? 2 : 3);
  const STAGE = ['Newborn', '1–3 months', '4–6 months', '6–12 months'];
  const monthsLabel = n => n === 0 ? 'Newborn' : n === 12 ? '1 year' : n === 1 ? '1 month' : n + ' months';
  const hasTooth = () => !live() || answers.hasTooth === 'Yes' || (typeof journeyData === 'function' && journeyData().records.some(r => r.type === 'milestone' && /tooth|teeth/i.test(r.title || '')));

  // Each topic's soft color pair, its icon, and a small flat picture for the page header.
  const COL = { diapers: ['#e7effc', '#46638c', '#9fb8df', '#d9e5fc'], bath: ['#e3f1f7', '#2a6078', '#8cc1d6', '#cfe9f4'], skin: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'], clothes: ['#efedff', '#625084', '#b4a5dc', '#e5e0fc'], sun: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'], teeth: ['#e6f5ec', '#356651', '#9bc7ac', '#ddf1e5'], nails: ['#fdeef2', '#a24d6a', '#f2b8c6', '#f4d6c4'], cord: ['#fdeef2', '#a24d6a', '#f2b8c6', '#f4d6c4'], need: ['#f5f1ea', '#4d443b', '#d8cbb8', '#ece6dc'], look: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'] };
  COL.down = COL.diapers;
  const ICON = { diapers: 'diaper', bath: 'bath', skin: 'drop', clothes: 'shirt', sun: 'sun', teeth: 'tooth', nails: 'nail', cord: 'cord', need: 'bag', look: 'eye', down: 'heart' , nose: 'steth', wet: 'drop', feet: 'stand', yellow: 'sun'};
  COL.paci = COL.clothes; ICON.paci = 'pacifier';   // Nov 23: the pacifier how-to row
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

  const BASICS = [['diapers', 'Diapers'], ['bath', 'Baths and hair'], ['skin', 'Skin and rashes'], ['clothes', 'Clothes'], ['sun', 'Sun and heat'], ['teeth', 'Gums and teeth'], ['nails', 'Nails, ears, nose']];
  // "Right now": only what changes at this stage (the content map), each opening its topic at this stage.
  const HOME = [
    { title: 'Diapers, the cord and first baths', lead: 'It feels like a lot at first, and it gets quicker fast.',
      news: () => [['diapers', 'Diapers, day by day', 'What to expect in the first week, and how to change one', go('diapers', 0)], ['cord', 'Cord stump care', 'Clean and dry until it falls off', `openPage('chg:${CAT}:d:cord')`], ['bath', 'Sponge baths', 'Until the cord falls off', go('bath', 0)], ['skin', 'Normal newborn skin', 'Peeling, white bumps and blotches', go('skin', 0)]] },
    { title: 'Tub baths and skin care', lead: 'The cord has healed, and care settles into a rhythm.',
      news: () => [['bath', 'Tub baths can start', 'About 3 a week, and hair too', go('bath', 1)], ['skin', 'Baby acne and cradle cap', 'Common now, and easy to care for', go('skin', 1)], ['diapers', 'Fewer poops can be normal', 'And straining isn’t constipation', go('diapers', 1)]] },
    { title: 'Drool, sun and busy hands', lead: 'Busy hands, lots of drool, and more time outside.',
      news: () => [['teeth', 'Teething', 'What helps, and what to skip', go('teeth', 2)], ['sun', 'Sunscreen', careAge() >= 6 ? 'It can start now' : 'It can start at 6 months', go('sun', 2)], ['skin', 'Drool rash and eczema', 'Common now', go('skin', 2)], solids() && live() && answers.solids === 'Yes' ? ['diapers', 'Poop once solids start', 'What’s normal now', go('diapers', 2)] : null].filter(Boolean) },
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
  // Nov 17: an Is this normal? page whose headline is just a name ("Baby acne") answers the question with a verdict
  // right under the name, in place of the "Is this normal?" label. ok = usually normal, watch = get it looked at.
  const VERDICT_ICON = { ok: '<path d="M8 12.5l2.6 2.6L16 9.6"/>', watch: '<path d="M12 7.5v5.5M12 16.4v.1"/>' };
  const verdictChip = v => v ? `<p class="care-verdict is-${v[0]}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/>${VERDICT_ICON[v[0]]}</svg>${F(v[1])}</p>` : '';
  const HEAD_ICON = { diapers: 'diaper', down: 'diaper', bath: 'bath', skin: 'drop', clothes: 'shirt', sun: 'sun', teeth: 'tooth', nails: 'nail', cord: 'cord', need: 'bag' };
  const head = (k, ctx, title, lead, verdict) => { const c = COL[k];
    // Nov 22: one icon style. Page headers use the same line icon in a white square as Feeding, not a flat drawing;
    // every "Is this normal?" page gets the eye, like Feeding's.
    const ic = verdict || k === 'look' ? 'eye' : HEAD_ICON[k];
    return `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}">${ic && typeof hubArt === 'function' ? `<span class="dev-area-head-art sf-head-art" aria-hidden="true">${hubArt(ic, CAT)}</span>` : `<span class="dev-area-head-art"><svg viewBox="0 0 90 40" aria-hidden="true">${ART[k](c)}</svg></span>`}${verdict ? '' : `<p class="hub-context">${F(ctx)}</p>`}<h1>${F(title)}</h1>${verdictChip(verdict)}${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`; };
  // Nov 15: every Everyday care page uses the same few blocks, in story order: what's happening, how (steps or a
  // picture), "Good to know" (one list, three rows at most), related pages, and only on a page about a worry, one quiet
  // "When to call" card. The builders still write tips, small print and call boxes in older shapes; this gathers them.
  let careWorry = false;
  const GTK_ICON = [[/car seat|puffy/i, 'car'], [/tooth|teeth|gum|dental|bottle in bed/i, 'tooth'], [/bath|tub|water heater/i, 'bath'], [/sun|hot day|heat/i, 'sun'], [/shoe|walker/i, 'stand'], [/nick|nail|\bears?\b/i, 'hand'], [/floppy|hard to wake/i, 'thermo'], [/hat|snap|zip|clothes/i, 'shirt'], [/pee|poop|diaper|size|rash/i, 'diaper'], [/fever|teething/i, 'thermo'], [/sunscreen/i, 'sun'], [/skip|never/i, 'shield']];
  const CALL_ROWS = [
    [/^A diaper rash not better in 2–3 days/i, ['Rash not better in 2–3 days?', 'Or blisters, pus or bright red folds: call your pediatrician.']],
    [/^Any sunburn before age 1/i, ['Sunburn before age 1', 'Call your pediatrician right away.']],
    [/^Hot and flushed and hard to wake/i, ['Hot, floppy or hard to wake', 'Cool {o} down and call 911.']]
  ];
  const callCard = inner => {
    const ok = [], call = [], now = [], rows = [], links = [];
    const strip = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const add = (arr, t) => { t = strip(t); if (t && !arr.includes(t)) arr.push(t); };
    const row = (title, sub) => { title = strip(title).replace(/:$/, ''); sub = strip(sub); if (!title || rows.some(r => r[0] === title)) return; const ic = (GTK_ICON.find(([re]) => re.test(title + ' ' + sub)) || [, 'notepad'])[1]; rows.push([title, sub, ic]); };
    let out = inner
      .replace(/<section class="hub-card hub-versus">(?:<h3>[^<]*<\/h3>)?<div class="hub-vs"><div><b>([\s\S]*?)<\/b><p>([\s\S]*?)<\/p><\/div><div class="(is-urgent|is-call)"><b>([\s\S]*?)<\/b><p>([\s\S]*?)<\/p><\/div><\/div><\/section>/g,
        (m, a, at, cls, b, bt) => { if (!/normal|usually/i.test(strip(a)) || !/call/i.test(strip(b))) return m; add(ok, at); add(cls === 'is-urgent' ? now : call, bt); return ''; })
      .replace(/<div class="hub-tip"><b>(?:Call your pediatrician|When to call)<\/b>([\s\S]*?)<\/div>/g, (m, t) => { add(call, t); return ''; })
      .replace(/<p class="care-p"><b>Call your pediatrician:<\/b>([\s\S]*?)<\/p>/g, (m, t) => { add(call, t); return ''; })
      .replace(/<p class="ss-small"><b>Call your pediatrician:<\/b>([\s\S]*?)<\/p>/g, (m, t) => { add(call, t); return ''; })
      .replace(/<section class="hub-card hub-callout is-urgent"><b>([\s\S]*?)<\/b><p>([\s\S]*?)<\/p><\/section>/g, (m, lab, t) => { if (/safety first/i.test(strip(lab))) return m; now.push([strip(lab), strip(t)]); return ''; })
      // Good to know: small print, tips and labelled facts become rows in one list
      .replace(/<p class="ss-small"><b>([^<]*?):?<\/b>\s*([\s\S]*?)<\/p>/g, (m, lab, t) => { row(lab, t); return ''; })
      .replace(/<div class="hub-tip"><b>([\s\S]*?)<\/b>([\s\S]*?)<\/div>/g, (m, lab, t) => { row(lab, t); return ''; })
      .replace(/<p class="ss-know"><b>((?!How you’ll know|Why it matters|What’s normal|What to look for|Which sunscreen)[^<]*?)<\/b>([\s\S]*?)<\/p>/g, (m, lab, t) => { row(lab, t); return ''; })
      // related pages go last, after what you need to know
      .replace(/<div class="hub-list care-link">[\s\S]*?<\/div>(?=<|$)/g, m => { links.push(m); return ''; });
    const urgent = now.map(x => Array.isArray(x) ? x : [/911/.test(x) ? 'Call 911' : 'Call right away', x]);
    let calls = '';
    if (careWorry) {
      const low = t => t.charAt(0).toLowerCase() + t.slice(1);
      const line = (cls, lab, t) => `<p class="${cls}"><b>${F(lab)} if:</b> ${F(low(t))}</p>`;
      const lines = (call.length ? line('', 'Call your pediatrician', call.join(' ')) : '') + urgent.sort((a, b) => /911/.test(a[0]) - /911/.test(b[0])).map(([lab, t]) => line('is-urgent', /911/.test(lab) ? 'Call 911' : 'Call right away', t)).join('');
      const phone = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
      if (lines) calls = `<section class="care-calls"><div class="care-calls-head"><span class="care-calls-ico">${phone}</span><h3>${F('When to call')}</h3></div>${lines}</section>`;
    } else {
      [...call, ...urgent.map(u => u[1])].forEach(t => { const hit = CALL_ROWS.find(([re]) => re.test(t)); hit ? row(hit[1][0], hit[1][1]) : row('When to call', t); });
    }
    // Nov 15: a Good to know title follows the bold-line rule: it names its subject and gives the takeaway, and the grey line adds the detail.
    const REW = [
      [/^Why only 2–3 a week/, () => ['More baths can dry {p} skin', 'In between, wipe {p} face, neck and diaper area.']],
      [/^Water heater/, () => ['Set the water heater to 120°F or lower', 'So scalds are much less likely.']],
      [/^Not from teething/, () => ['Fever or diarrhea isn’t teething', 'Neither is diaper rash or a runny nose. Something else is going on.']],
      [/^Skip these/, () => ['Skip numbing gels and teething necklaces', 'And teething tablets. Ask your pediatrician before any pain medicine.']],
      [/^No bottle in bed/, () => ['No bottle in bed once teeth come', 'Milk on teeth overnight causes cavities.']],
      [/^First dental visit/, () => ['First dentist visit', 'When the first tooth comes in, and no later than the first birthday.']],
      [/^How a shoe should fit/, () => ['Leave a finger’s width at the big toe', 'Check the fit every month.']],
      [/^Rash not better in 2–3 days/, () => ['Call if a rash isn’t better in 2–3 days', 'Or if it has blisters, pus or bright red folds.']],
      [/^Tiny white bumps on the gums/, () => ['Tiny white gum bumps are normal', 'They go away on their own.']],
      [/^Ears$/, () => ['Clean only the outside of the ears', 'A washcloth works. Never put cotton swabs inside.']],
      [/^If you nick the skin/, () => ['A small nick happens to everyone', 'Press gently with a clean cloth.']],
      [/^Snaps or zips/, () => ['Snaps or zips, never strings', 'Nothing with strings near the neck.']],
      [/^In the car seat/, () => ['No puffy coats in the car seat', 'Buckle {o} in, then lay a blanket over the straps.']],
      [/^Hot days/, (sub) => ['On hot days, offer extra milk feeds', /no water/.test(sub) ? 'Milk is all {s} needs. No water yet.' : 'And a few sips of water from a cup.']],
      [/^Sunburn before age 1/, () => ['Call about any sunburn under age 1', 'Right away, even a mild one.']],
      [/^Hot, floppy or hard to wake/, () => ['Hot, floppy or hard to wake? Call 911 now', 'Cool {o} down while you wait for help.']],
      [/^A pink or orange stain/, () => ['A pink stain is usually just pee', 'Still there after day 4? {S} may need more feeds.']],
      [/^Time for the next size/, () => ['Leaks mean it’s time to size up', 'So do red marks at the legs or waist.']],
      [/^What’s next/, () => ['The first tooth usually comes around 6 months', 'Keep wiping the gums until then.']],
      [/^What changes next|^Poop changes with solids/, () => ['Solids make poop thicker and smellier', 'Sometimes the color of the food. Pears, prunes and peaches help if it’s hard.']],
      [/^When to move to the big tub/, () => ['The big tub comes once {s} {sit|sits} steadily', 'Often around 6–8 months. Until then, the baby tub.']],
      [/^Feed often/, () => ['Sunlight doesn’t treat jaundice', 'Feed often, and let your pediatrician check.']]
    ];
    rows.forEach(r => { const hit = REW.find(([re]) => re.test(r[0])); if (hit) { const [t, sub] = hit[1](r[1]); r[0] = t; r[1] = sub; } });
    const gtk = rows.length ? H().list('Good to know', rows.slice(0, 3).map(([title, sub, icon]) => H().row({ icon, cat: CAT, title, sub }))) : '';
    if (rows.length > 3 && typeof console !== 'undefined') console.warn('Good to know has more than 3 rows', rows.map(r => r[0]));
    if (!gtk && !calls && !links.length && out === inner) return inner;
    return out + gtk + links.join('') + calls;
  };
  // Nov 15: the two Everyday care templates. Whatever older builder made a page, its blocks are put back in one fixed order:
  //   How-to:          top card (headline + why) · the picture · how (steps or tiles) · What to do · How you'll know · a button ·
  //                    a side topic (if a diaper rash starts) · the bath-safety rule · Good to know · Watch how (video) · related pages
  //   Is this normal?: top card with the verdict · what it looks like · what helps · related pages · When to call
  // Both are the same order, so every page in the guide reads the same way. QA: tools/qa/browser/care_blocks.py.
  const SLOT = ['head', 'why', 'visual', 'how', 'do', 'know', 'action', 'side', 'rule', 'gtk', 'watch', 'related', 'calls'];
  const slotOf = (el, prev) => {
    const c = el.classList, t = (el.textContent || '').trim();
    if (c.contains('guide-detail-top') || c.contains('dev-area-head') || c.contains('ss-head') || el.matches('header')) return 'head';
    if (c.contains('care-calls')) return 'calls';
    if (c.contains('care-link')) return 'related';
    if (c.contains('hub-versus') && /^Every bath/.test(t)) return 'rule';
    if (c.contains('hub-actions') || c.contains('hub-already') || el.matches('button.hub-button')) return 'action';
    if (c.contains('ss-do')) return 'do';
    if (c.contains('ss-know')) return 'know';
    if (el.matches('p.ss-what, p.care-p, p.care-lead')) return 'why';
    if (el.matches('h2')) return /^Good to know/.test(t) ? 'gtk' : /^If a diaper rash starts/.test(t) ? 'side' : null;
    if (prev === 'side' && !c.contains('ss-do')) return 'side';   // a heading takes the slot of what follows it
    if (prev === 'gtk' && c.contains('hub-list')) return 'gtk';
    if (c.contains('hub-embed')) return 'watch';
    if (c.contains('care-map') || c.contains('care-ramp') || c.contains('hub-poop') || c.contains('hub-poop2') || c.contains('hub-layers') || c.contains('hub-agetiles') || c.contains('hub-strip') || c.contains('hub-paste') || c.contains('care-carousel')) return 'visual';
    return 'how';
  };
  const templateOrder = html => {
    if (typeof document === 'undefined' || !document.createElement) return html;
    const box = document.createElement('div'); box.innerHTML = html;
    const flat = [];
    [...box.children].forEach(el => el.matches('section.ss-moment') ? flat.push(...el.children) : flat.push(el));
    const buckets = Object.fromEntries(SLOT.map(k => [k, []]));
    for (let i = 0; i < flat.length; i++) {
      const el = flat[i]; let slot = slotOf(el, i ? flat[i - 1].__slot : null);
      if (slot === null) { const next = flat[i + 1]; slot = next ? (slotOf(next, null) || 'how') : 'how'; }
      el.__slot = slot; buckets[slot].push(el);
    }
    // The why belongs in the top card, under the headline, not floating below it.
    const top = buckets.head.find(e => e.classList.contains('dev-area-head') || e.classList.contains('ss-head')), why = buckets.why[0];
    if (top && why && !top.querySelector('.hub-lead')) { const l = document.createElement('p'); l.className = 'hub-lead'; l.innerHTML = why.innerHTML; top.appendChild(l); buckets.why.shift(); }
    // A video is a "Watch how" extra near the end, a compact row that opens full width when played.
    if (buckets.watch.length) buckets.watch.unshift(Object.assign(document.createElement('h2'), { className: 'hub-h2', textContent: 'Watch how' }));
    return SLOT.map(k => buckets[k].map(el => el.outerHTML).join('')).join('');
  };
  const page = (k, inner) => { const c = COL[k]; return `<div class="quiet-category hub-page hub-detail care-v2" data-overview="${CAT}" data-ss="1" style="${yearTheme(CAT)};--ss-bg:${c[0]};--ss-ink:${c[1]}">${templateOrder(detailPageTop(CAT) + callCard(inner))}</div>`; };
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

  /* ---------- Pictures that show instead of tell ---------- */
  // Bath picture steps, drawn in the same soft style as the diaper steps.
  const BATH_ART = (() => {
    const SK = '#f7dcca', INK = '#2a6078', BG = '#e3f1f7', WA = '#bfe3f0', PH = '#c98f72', SL = '#8cc1d6';
    const base = inner => `<svg viewBox="0 0 300 180" aria-hidden="true"><rect width="300" height="180" rx="22" fill="${BG}"/>${inner}</svg>`;
    const tub = (water = true) => `<path d="M40 86 h220 v22 q0 34 -34 34 h-152 q-34 0 -34 -34 Z" fill="#fff" stroke="#8cc1d6" stroke-width="3"/>${water ? `<path d="M46 104 h208 v4 q0 28 -28 28 h-152 q-28 0 -28 -28 Z" fill="${WA}"/>` : ''}`;
    const babyIn = `<circle cx="96" cy="94" r="20" fill="${SK}"/><path d="M89 92q3 3 6 0M101 92q3 3 6 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/><rect x="114" y="92" width="74" height="30" rx="15" fill="${SK}"/><path d="M186 104 q26 -4 38 -16" stroke="${SK}" stroke-width="11" stroke-linecap="round" fill="none"/>`;
    const hand = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-9" y="0" width="22" height="48" rx="6" fill="${SL}"/><rect x="-7" y="-26" width="18" height="30" rx="9" fill="${PH}"/></g>`;
    const towel = (x, y) => `<g transform="translate(${x} ${y})"><rect width="56" height="30" rx="8" fill="#fdeee6" stroke="#f4c3a8" stroke-width="2"/><path d="M8 10h40M8 20h40" stroke="#f4c3a8" stroke-width="2"/></g>`;
    const label = (x, y, t) => `<text x="${x}" y="${y}" font-size="12" font-weight="700" fill="${INK}">${t}</text>`;
    return [
      base(tub(false) + towel(48, 30) + `<g transform="translate(120 34)"><rect width="34" height="24" rx="6" fill="#fff" stroke="#9bc7ac" stroke-width="2"/></g><g transform="translate(168 30)"><rect width="22" height="30" rx="8" fill="#fff" stroke="#e3b8cf" stroke-width="2"/><rect x="6" y="-6" width="10" height="8" rx="3" fill="#e3b8cf"/></g><g transform="translate(206 32)"><rect width="40" height="26" rx="7" fill="#fff" stroke="#9fb8df" stroke-width="2"/></g>`),
      base(tub(true) + hand(150, 70, 0) + `<path d="M262 104 v32" stroke="${INK}" stroke-width="2"/><path d="M258 104 h8 M258 136 h8" stroke="${INK}" stroke-width="2"/>` + label(200, 40, 'about 100°F') + label(196, 160, 'about 2 inches')),
      base(tub(true) + `<path d="M34 150 L82 110" stroke="${SL}" stroke-width="16" stroke-linecap="round"/><ellipse cx="92" cy="108" rx="20" ry="9" fill="${PH}"/>` + babyIn),
      base(tub(true) + babyIn + `<rect x="62" y="58" width="26" height="18" rx="5" fill="#fff" stroke="#9bc7ac" stroke-width="2"/>` + label(150, 44, 'face first, hair last')),
      base(`<rect x="70" y="40" width="160" height="104" rx="30" fill="#fdeee6" stroke="#f4c3a8" stroke-width="2"/><path d="M98 52 q52 -26 104 0 v20 h-104 Z" fill="#fbe0d0"/><circle cx="150" cy="80" r="22" fill="${SK}"/><path d="M143 78q3 3 6 0M155 78q3 3 6 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M144 88 q6 5 12 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`)
    ];
  })();
  const bathCarousel = () => carousel('bath', [
    [BATH_ART[0], 'Get everything ready', 'Towel, washcloth, mild soap and a clean diaper, all within reach.'],
    [BATH_ART[1], 'About 2 inches of warm water', 'Around 100°F. Test it with your wrist before {s} goes in.'],
    [BATH_ART[2], 'Support the head and neck', 'One hand behind {o} the whole bath.'],
    [BATH_ART[3], 'Face first, hair last', 'So {s} {stay|stays} warm. A mild shampoo on the hair.'],
    [BATH_ART[4], 'Wrap and pat dry', 'Into the creases, then a clean diaper.']
  ]);
  // Where each rash usually shows up, on a simple baby outline.
  const ZONES = {
    cheeks: '<ellipse cx="62" cy="44" rx="9" ry="7"/><ellipse cx="98" cy="44" rx="9" ry="7"/>', nose: '<circle cx="80" cy="44" r="5"/>',
    scalp: '<path d="M54 26 q26 -24 52 0 q-26 -8 -52 0Z"/>', chin: '<ellipse cx="80" cy="60" rx="12" ry="6"/>', neck: '<rect x="64" y="66" width="32" height="9" rx="4.5"/>',
    creases: '<ellipse cx="40" cy="104" rx="7" ry="6"/><ellipse cx="120" cy="104" rx="7" ry="6"/><ellipse cx="62" cy="168" rx="7" ry="6"/><ellipse cx="98" cy="168" rx="7" ry="6"/>',
    chest: '<ellipse cx="80" cy="92" rx="22" ry="12"/>', diaper: '<path d="M60 128 h40 v12 q-20 14 -40 0Z"/>', folds: '<path d="M58 142 q6 8 4 18 M102 142 q-6 8 -4 18" stroke="#e8836a" stroke-width="6" fill="none" stroke-linecap="round"/>',
    body: '<ellipse cx="80" cy="100" rx="22" ry="20"/><ellipse cx="80" cy="44" rx="16" ry="12"/>'
  };
  const RASH_ZONES = { eczema: ['cheeks', 'creases'], drool: ['chin', 'neck'], cradle: ['scalp'], acne: ['cheeks', 'nose'], heat: ['neck', 'chest'], diaper: ['diaper'], yeast: ['folds'], peeling: ['body'], newborn: ['body'] };
  const ZONE_WORDS = { eczema: 'Cheeks, scalp, and the outside of the arms and legs', drool: 'Chin and neck', cradle: 'The scalp', acne: 'Cheeks and nose', heat: 'The neck and chest, where it’s warm', diaper: 'Where the diaper rubs, not in the skin folds', yeast: 'Deep in the skin folds', peeling: 'Anywhere, often the hands and feet', newborn: 'Anywhere on the body' };
  const rashMap = id => { const z = RASH_ZONES[id]; if (!z) return '';
    const fill = z.map(k => ZONES[k]).join('');
    return `<figure class="care-map" role="img" aria-label="${F(RASH[id].t)}: usually ${F(RASH[id].look).toLowerCase()}"><svg viewBox="0 0 160 190" aria-hidden="true"><g fill="#f3d9c6" stroke="#e6c3aa" stroke-width="1.5"><circle cx="80" cy="44" r="30"/><rect x="50" y="70" width="60" height="70" rx="26"/><rect x="26" y="78" width="22" height="50" rx="11" transform="rotate(-14 37 103)"/><rect x="112" y="78" width="22" height="50" rx="11" transform="rotate(14 123 103)"/><rect x="54" y="132" width="20" height="50" rx="10"/><rect x="86" y="132" width="20" height="50" rx="10"/></g><path d="M58 128 h44 v14 q-22 16 -44 0Z" fill="#fff" stroke="#c9d9f5" stroke-width="2"/><g fill="#e8836a" fill-opacity=".55">${fill}</g></svg><figcaption><b>${F('Where it shows up')}</b><span>${F(ZONE_WORDS[id] || RASH[id].look)}</span>${['eczema', 'drool', 'heat', 'diaper', 'yeast', 'acne'].includes(id) ? `<small>${F('On darker skin it can look brown, purple or gray rather than red.')}</small>` : ''}</figcaption></figure>`; };
  // The glass test for the one rash that's an emergency.
  // Nov 24 (Everyday care): the glass test is something a parent does, so it's shown in photos. The fever rule lives once, in When to call.
  const glassTest = () => H().TPLB.photoGrid([['care/glass-fade', '✓ Fades under the glass', 'Usually fine, if {s} {seem|seems} well'], ['care/glass-nofade', '✕ Doesn’t fade', 'Call 911 or go to the ER']])
    + `<div class="care-glass-note" style="margin:8px 4px 0;font-size:13.5px;line-height:1.4;color:#5f6b74">${F('Press the side of a clear glass firmly on the spots. On darker skin, check paler spots too, like the palms and soles.')}</div>`;
  // Poop colors, in the swatch style from the Feeding pages.
  // Nov 15: poop colors as circles. Normal colors with what usually explains them; colors that mean a call, with when.
  const POOP_OK = [['#d9a62a', 'Yellow', 'Often seedy if breastfed'], ['#7d8a3a', 'Green', 'Common, and normal'], ['#c9a273', 'Tan', 'Common on formula'], ['#7a5232', 'Brown', 'Common after solids'], ['#d9822b', 'Orange', 'Normal too']];
  const POOP_CALL = [['#ece8e0', 'White or gray', 'Call right away'], ['#2f2a26', 'Black', 'After day 5'], ['#b3312c', 'Red', 'Or streaks of blood']];
  const poopDot = ([c, t, n]) => `<div class="poop-dot"><span style="--c:${c}"></span><b>${F(t)}</b><small>${F(n)}</small></div>`;
  const poopChart = () => `<figure class="hub-card hub-poop2" role="img" aria-label="Normal poop colors are yellow, green, tan, brown and orange. Call your pediatrician for white or gray (right away), black after the first 2 to 3 days, or red."><div class="poop-group is-ok"><b class="poop-tag">${F('Normal')}</b><div class="poop-row is-5">${POOP_OK.map(poopDot).join('')}</div></div><div class="poop-group is-call"><b class="poop-tag">${F('Worth a call')}</b><div class="poop-row is-3">${POOP_CALL.map(poopDot).join('')}</div></div><figcaption>${F('Black and sticky is normal for the first few days.')}</figcaption></figure>`;
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
  const NEWLABEL = ['For the first weeks', 'New at 1–3 months', 'New at 4–6 months', 'New at 6–12 months'];
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
  window.careSet = (key, val) => { answers[key] = val; if (typeof persist === 'function') persist(); const y = scrollY; render(); scrollTo(0, y); };
  const seg = (key, cur, opts) => `<div class="care-seg" role="group">${opts.map(([val, t]) => `<button class="${cur === val ? 'is-on' : ''}" aria-pressed="${cur === val}" onclick="careSet('${key}','${val}')">${F(t)}</button>`).join('')}</div>`;
  // Asked once, right here: pronouns don't tell us this. Until it's answered, the general rule shows.
  // Pronouns decide what shows: girls see their care, boys see both kinds, they see all three. Nothing to pick.
  const downThere = () => {
    const h = H(), pr = typeof profile !== 'undefined' ? profile.pronouns : '';
    const girl = h.tip(pr === 'she' ? 'Cleaning {p} diaper area' : 'Girls', 'Wipe front to back, every change. A little white discharge, or light bleeding for a few days (often days 2–10), is normal. It comes from pregnancy hormones.');
    const circ = h.tip('Circumcised', 'A dab of petroleum jelly on the tip at every change, and warm water instead of wipes, until it heals in about 7–10 days. A red tip and a soft yellow film are normal healing.');
    const boy = h.tip('Not circumcised', 'Wash the outside like the rest of the diaper area. Never pull back the foreskin. It loosens on its own, over years.');
    const callG = 'Bleeding that lasts more than 3–4 days, or starts after the first week.', callC = 'After a circumcision: bleeding bigger than a quarter, swelling, pus-filled blisters, a fever, no pee within 8 hours, or a plastic ring still on after 10 days.';
    return pr === 'she' ? girl + callTip(callG) : pr === 'he' ? circ + boy + callTip(callC) : girl + circ + boy + callTip(`Girls: ${callG.charAt(0).toLowerCase() + callG.slice(1)} ${callC}`);
  };
  // Nov 15: the first week at a glance. Wet diapers rise as a little column of drops; the poop color to expect sits under each day.
  const DROP = '<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M6 1C6 1 1.5 6.2 1.5 9a4.5 4.5 0 0 0 9 0C10.5 6.2 6 1 6 1Z"/></svg>';
  const wetChart = () => { const D = [['Days 1–2', 2, '1–2', '#2f2a26', 'Black, sticky'], ['Days 3–4', 3, '3+', '#6b6a33', 'Turning green'], ['Day 5', 5, '5+', '#d9a62a', () => live() && profile.feed === 'Formula' ? 'Tan or yellow' : 'Yellow, seedy'], ['Day 6 on', 6, '6+', '#d9a62a', 'Yellow, often after feeds']];
    return `<figure class="hub-card wet-chart" role="img" aria-label="Wet diapers a day: 1 to 2 on days 1 and 2, 3 or more on days 3 and 4, 5 or more on day 5, 6 or more from day 6. Poop goes from black and sticky to green to yellow."><div class="wet-label">${F('Wet diapers a day')}</div><div class="wet-grid">`
      + D.map(([d, n, w]) => `<div class="wet-col"><span class="wet-drops">${Array.from({ length: 6 }, (_, i) => `<i class="${i < n ? 'on' : ''}">${DROP}</i>`).join('')}</span><b>${F(w)}</b><small>${F(d)}</small></div>`).join('')
      + `</div><div class="wet-label is-poop">${F('Poop')}</div><div class="wet-grid">`
      + D.map(([, , , c, t]) => `<div class="wet-col"><span class="wet-poop" style="--c:${c}"></span><small>${F(val(t))}</small></div>`).join('')
      + `</div></figure>`; };
  const ramp = () => `<div class="hub-card care-ramp">${[['Days 1–2', '1–2 wet', 'Black, sticky poop', '#2f2a26'], ['Days 3–4', '3 or more wet', 'Turning green, then yellow', '#5e5a2c'], ['Day 5', '5 or more wet', 'Yellow and seedy if breastfed, tan if formula', '#d9a62a'], ['From about day 6', '6 or more wet', 'Often a poop after feeds', '#d9a62a']].map(([d, w, p, c]) => `<div><i class="care-swatch" style="background:${c}"></i><b>${F(d)}</b><span>${F(w)}</span><small>${F(p)}</small></div>`).join('')}</div>`;
  const rashHow = () => H().steps(['Change often, and let the skin air out when you can.', 'A thick layer of zinc oxide or petroleum cream at every change. Fragrance-free wipes, and no antibiotic ointment.', 'Shiny, bright red in the skin folds is often yeast, which needs a different cream. Regular diaper rash usually spares the folds.']) + H().tip('Call your pediatrician', 'Not better in 2–3 days, or blisters, pus, oozing or a fever.');
  // Each rash opens right here: what it looks like, what helps, when to call. One tap, never two.
  const rashLink = ids => `<div class="hub-card care-folds">${ids.map(id => { const r = RASH[id];
    return `<details class="care-fold"><summary><span><b>${F(r.t)}</b><small>${F(r.look)}</small></span><i aria-hidden="true">›</i></summary><div class="care-fold-body">${rashMap(id)}<p class="care-p">${F(r.lead)}</p>${H().tips(r.steps)}${r.call ? `<p class="care-p is-fold"><b>${F('Call your pediatrician:')}</b> ${F(r.call)}</p>` : ''}${r.alt ? `<p class="care-p">${F('Not quite it? It could be ' + r.alt.map(a => RASH[a].t.toLowerCase()).join(' or ') + '.')}</p>` : ''}</div></details>`; }).join('')}</div>`;
  // Nov 22 (Yarden's rule: "Which of these is it?" gets a side-by-side that shows the difference). Each tile is the real
  // photo, the name, and the one detail that tells it apart: where it shows up, and when.
  const RASH_TELL = { acne: 'Cheeks and nose, from 2–4 weeks', cradle: 'Greasy flakes on the scalp', peeling: 'Hands and feet, first weeks', diaper: 'Red where the diaper touches', yeast: 'Bright red, into the folds', eczema: 'Dry, rough and itchy', heat: 'Neck and chest, after getting warm', drool: 'Chin and neck, where drool sits', newborn: 'White dots or blotches, from birth', strawberry: 'A raised red patch that grows' };
  const RASH_PHOTO = ['acne', 'cradle', 'drool', 'eczema', 'heat', 'newborn', 'peeling'];
  // Rashes with no photo yet (diaper area, birthmarks) sit under the tiles as plain rows.
  const rashPick = ids => { const ph = ids.filter(id => RASH_PHOTO.includes(id)), rest = ids.filter(id => !RASH_PHOTO.includes(id));
    return (ph.length ? `<div class="care-common care-pickgrid">${ph.map(id => `<button class="care-common-tile" onclick="openPage('chg:${CAT}:d:rash:${id}')"><img src="assets/care/rash-${id}.jpg?v=1" alt="" loading="lazy"><span><b>${F(RASH[id].t)}</b><small>${F(RASH_TELL[id] || RASH[id].look)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>` : '')
      + (rest.length ? `<div class="hub-list care-link">${rest.map(id => rowK(id === 'yeast' ? 'diapers' : 'look', RASH[id].t, RASH_TELL[id] || RASH[id].look, `openPage('chg:${CAT}:d:rash:${id}')`)).join('')}</div>` : ''); };
  const lookLink = (key, t, sub) => `<div class="hub-list care-link">${rowK('look', t, sub, `openPage('chg:${CAT}:d:look:${stageNow()}:${key}')`)}</div>`;
  // How often babies poop depends on what they drink. Mixed feeding sits in between.
  const fewerLine = () => { const f = typeof profile !== 'undefined' && live() ? profile.feed : '';
    return f === 'Formula' ? 'Formula-fed babies usually poop most days, and fewer poops than at first is normal.' : f === 'Both' ? 'From about 3–6 weeks, poops often space out. On breast milk and formula, anywhere from a few a day to one every few days can be normal.' : 'From about 3–6 weeks, many breastfed babies poop less often, some only once a week. Formula-fed babies usually go most days.'; };
  const urgent = t => hubUrgent(t);   // the one emergency box (design guide)

  const TOPIC = {
    diapers: v => topicPage('diapers', v, {
      title: 'Diapers',
      lead: ['What to expect in the first week, and how to change one.', 'Fewer poops can be normal now, and sizes go up.', solids() ? 'Solids change what’s in the diaper.' : 'Not much changes until solids start.', 'Wriggly changes, and poop that looks like food.'],
      news: [
        [['Day by day, the first week', ramp() + p_('Many breastfed babies poop after every feed in the first weeks.')], ['How to change a diaper', diaperCarousel()], ['Care down there', downThere()], ['A pink or orange stain?', p_('In the first days, a pink or brick-colored stain is usually very concentrated pee. It can mean {s} {need|needs} more feeds. Call if it lasts past the first few days.')], ['The cord', p_('Fold the top of the diaper down so the stump stays in the air.') + `<div class="hub-list care-link">${rowK('cord', 'Cord stump care', 'Until it falls off', `openPage('chg:${CAT}:d:cord')`)}</div>`]],
        [['Fewer poops can be normal', p_('From about 3–6 weeks, many breastfed babies poop less often, some only once a week. That’s fine if it’s soft and {s’s} feeding and gaining well. Formula-fed babies usually go most days.') + p_('Still 6 or more wet diapers a day.')], ['Straining isn’t constipation', p_('Grunting, straining and going red is normal. Constipation means hard, pebble-like poop.') + H().tip('Call your pediatrician', 'Hard poop, blood, or straining for more than 10 minutes without success.')], ['Sizing up', p_('Leaks, red marks at the legs or waist, or tabs that don’t reach the middle mean it’s time for the next size. Keep a spare pack one size up.')]],
        [solids() && ['Once solids start', p_('Poop gets thicker, browner and smellier, can take on the color of the food, and may have bits in it. That’s normal.') + p_('It can get harder too. Pears, prunes and peaches help. Call if it’s hard and pebbly for more than a few days.')]],
        [['Wriggly changes', H().steps(['Hand {o} a toy to hold, or sing the same song each time.', 'Keep one hand on {o} on the changing table, always.', 'Once {s} {pull|pulls} up, a standing change can be easier.'])], solids() && ['Poop once solids start', p_('Thicker, browner, sometimes with bits of food. Pears, prunes and peaches help if it gets hard.')]]
      ],
      base: [v > 0 && ['How to change a diaper', 'Five steps', diaperCarousel()], ['Diaper rash', 'What helps, and yeast rash', rashHow()], v === 0 && ['Sizing up', 'When to move up', p_('Leaks, red marks at the legs or waist, or tabs that don’t reach the middle mean it’s time for the next size.')], v > 0 && ['Care down there', 'For girls and boys', downThere()], ['How many wet diapers?', '6 or more a day after the first week', p_('6 or more wet diapers a day is the sign {s’s} getting enough milk.')]],
      call: v => H().versus('Normal, or time to call?', ['Normal', 'Yellow, green or brown. ' + (v === 0 ? 'Black and sticky only at first.' : 'Several a day, or one every few days.')], ['Call your pediatrician', 'Black after day 5, red, or white. Or fewer than 4 wet diapers a day.']) + urgent('White, gray or chalky poop. Call your pediatrician right away.')
    }),

    bath: v => topicPage('bath', v, {
      title: 'Baths and hair',
      lead: ['Sponge baths until the cord stump falls off.', 'Tub baths can start.', 'Often part of bedtime now.', 'Sitting up, and the big tub.'],
      news: [
        [['Sponge baths for now', hubEmbed('uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth') + p_('Until the cord stump falls off' + (anatomy() !== 'girl' ? ' (and a circumcision heals)' : '') + '. Face first with plain water, then the body one part at a time, diaper area last. Keep {o} wrapped and warm.') + p_('In between, wipe {p} face, neck and diaper area. Not straight after a feed, or when {s’s} hungry.')]],
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
        [['Normal newborn skin', H().steps(['Peeling or flaky skin in the first 1–2 weeks.', 'Tiny white bumps on the nose and chin (milia). They fade in a few weeks.', 'Red blotches with a white or yellow center, from about day 2. Gone in 1–2 weeks.', 'Pink marks on the eyelids or back of the neck (stork bites), and blue-gray patches on the back or bottom. Birthmarks, not bruises.']) + p_('None of these need treatment.')]],
        [['Common now', rashLink(['acne', 'cradle', 'strawberry'])]],
        [['Common now', rashLink(['drool', 'eczema'])]],
        [['Common now', rashLink(['heat', 'eczema'])]]
      ],
      base: [['What’s this rash?', 'All the common ones', rashLink(RASH_ORDER)], ['Everyday skin care', 'Soap, lotion and laundry', H().steps(['Plain water is enough for most baths. Fragrance-free soap only on dirty spots.', 'Most babies don’t need lotion. For dry skin, a little fragrance-free moisturizer.', 'Wash new clothes before wearing. Fragrance-free detergent if {p} skin is sensitive.'])]],
      call: v => H().versus('Normal, or time to call?', ['Normal', 'Spots that come and go, in a happy baby.'], ['Call your pediatrician', 'A rash with a fever, blisters or pus, or one that spreads.' + (v === 0 ? ' Tiny blisters in the first 2 weeks: call now.' : '')]) + urgent('Purple or red dots that don’t fade when you press a glass on them. Call 911 or go to the ER.')
    }),

    clothes: v => topicPage('clothes', v, {
      title: 'Clothes',
      lead: ['Babies can’t tell you they’re too hot or cold, so one rule helps.', 'Swaddling stops once rolling starts.', '', 'Bare feet for first steps.'],
      news: [
        [['How many layers', `<figure class="hub-figure hub-layers" role="img" aria-label="Dress baby in one more layer than you’re wearing."><div><span>${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}</span><b>${F('You')}</b><small>${F('Comfortable in 2 layers')}</small></div><i aria-hidden="true">+1</i><div class="is-baby"><span>${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}</span><b>${F('Maya')}</b><small>${F('Needs 3')}</small></div></figure>` + p_('One more layer than you. Feel the back of {p} neck: sweaty means too warm, cool means add a layer.')], ['No hats indoors', p_('Once you’re home, skip hats inside and for sleep. They can make {o} too warm.')], ['Getting clothes on', p_('Stretch the neck opening wide and ease it over the back of {p} head first, then the face. Snaps or a zip down the front, and nothing with strings or ribbons near the neck.')]],
        [['Stop swaddling at the first roll', `<div class="hub-list care-link">${rowK('clothes', 'Swaddles and sleep sacks', 'When to switch · In Sleep', "openPage('chg:Sleep:safe')")}</div>`]],
        [],
        [['Bare feet first, soft shoes later', p_('Bare feet or socks indoors help {o} balance while {s} {learn|learns} to walk. Shoes only once {s’s} walking outside: soft, flexible and non-skid. Check the fit every month.')]]
      ],
      base: [v > 0 && ['How many layers', 'One more than you', p_('One more layer than you. Sweaty neck means too warm; cool means add a layer.')], ['For sleep', 'Snug pajamas and a sleep sack', p_('Snug-fitting pajamas, no loose or oversized clothes, and a sleep sack instead of blankets.')], ['In the car seat', 'No puffy coats', p_('Take off puffy coats first. Buckle {o} in, then put a blanket over the straps. If you can pinch the strap, tighten it.')]]
    }),

    sun: v => topicPage('sun', v, {
      title: 'Sun and heat',
      lead: ['Young skin burns easily, so shade comes first.', '', sixPlus(v) ? 'Sunscreen can start now.' : 'Sunscreen can start at 6 months.', ''],
      news: [
        [['Shade, not sunscreen', p_('Keep {o} out of direct sun: shade, light long sleeves and a wide-brimmed hat. If there’s no shade, a little sunscreen on small spots like the face is OK.')]],
        [],
        [['Sunscreen from 6 months', p_('Broad-spectrum (it says so on the label), SPF 30 or more. Mineral (zinc oxide or titanium) is gentlest; skip sprays. Put it on 15–30 minutes before going out, and again every 2 hours and after swimming.')]],
        []
      ],
      base: [!sixPlus(v) ? ['Sun protection', 'Shade first', p_('Shade, light long sleeves and a wide-brimmed hat. A little sunscreen on the face only if there’s no shade.')] : ['Sun protection', 'Shade, a hat and SPF 30', p_('Shade and a hat first, then sunscreen on skin you can’t cover, every 2 hours and after swimming.')], ['Hot days', 'Layers, feeds and the stroller', H().steps(['One light layer, and shade or indoors at midday.', F('Extra milk feeds keep {o} hydrated.'), 'Don’t cover the stroller with a blanket. It traps heat. Use the canopy or a clip-on shade.'])], ['At the pool or beach', 'What to bring', p_('Swim diapers, a sun shirt and a hat' + (sixPlus(v) ? ', and mineral sunscreen.' : '.') + ' Keep a hand on {o} in any water, even shallow.')]],
      call: () => H().versus('Normal, or time to call?', ['Normal', 'A little pink and sweaty, cooling off in the shade.'], ['Call your pediatrician', 'Any sunburn before age 1, or fewer wet diapers.']) + urgent('Hot and flushed and hard to wake, floppy, or not feeding. Cool {o} down and call 911. Never leave {o} in a car.')
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
      call: v => v >= 2 ? H().versus('Normal, or time to call?', ['Normal', 'Drool, chewing and sore gums.'], ['Call your pediatrician', 'A fever, diarrhea or a rash. Teething doesn’t cause them.']) : ''
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
  };

  /* ---------- the rash pages ---------- */
  const RASH_ORDER = ['acne', 'cradle', 'peeling', 'diaper', 'yeast', 'eczema', 'heat', 'drool'];
  const RASH = {
    acne: { normal: 'Bumps that come and go for a few weeks.', alt: ['heat', 'eczema'], t: 'Baby acne', look: 'Small red or white bumps on the cheeks, nose and forehead', lead: 'It often starts at 2–4 weeks, comes from pregnancy hormones, and clears on its own.', steps: ['Wash {p} face with plain water once a day and pat dry.', 'Skip lotions and oils on the bumps. Never use acne products.', 'Tiny white dots on the nose, called milia, are normal too and fade without help.'] },
    cradle: { normal: 'Flakes that come back now and then.', t: 'Cradle cap', look: 'Yellow, greasy or crusty patches on the scalp', lead: 'It shows up in the first months and usually clears by the first birthday.', steps: ['Wash {p} hair with water or a little mild baby shampoo.', 'For stubborn flakes, rub in a little baby oil, wait a few minutes, brush gently with a soft brush, then wash the oil out.', 'Don’t pick at the flakes.'] },
    peeling: { normal: 'Dry, peeling patches in the first weeks.', t: 'Peeling, dry skin', look: 'Dry, flaky skin on the hands, feet and body', lead: 'It happens in the first weeks, as {p} skin gets used to the air.', steps: ['Keep baths short, and use only plain water.', 'A fragrance-free moisturizer is fine, but not needed.'] },
    diaper: { normal: 'Redness that fades in 2–3 days with cream.', alt: ['yeast'], short: 'Change often, give it air time, and a thick layer of zinc cream at every change. Fragrance-free wipes, and no antibiotic ointment.', t: 'Diaper rash', look: 'Red skin where the diaper touches', lead: 'It usually clears up in 2–3 days with a few simple steps.', steps: ['Change often, and let the skin air out when you can.', 'A thick layer of zinc oxide cream at every change.', 'Skip wipes with alcohol or fragrance while it heals.'] },
    yeast: { normal: 'It clears within days of the right cream.', alt: ['diaper'], t: 'Yeast diaper rash', look: 'Bright red in the skin folds, with small red spots around the edges', lead: 'A rash that lingers for days may be yeast.', steps: ['Call your pediatrician, who may suggest an antifungal cream.', 'Keep changing often and airing the skin.'] },
    eczema: { normal: 'Patches that come and go, often in dry weather.', alt: ['acne', 'drool'], t: 'Eczema', look: 'Dry, rough, itchy patches, often on the cheeks and in the creases', lead: 'It comes and goes. Dry skin makes it flare.', steps: ['Short, lukewarm baths, then a thick fragrance-free moisturizer while the skin is still damp.', 'Use fragrance-free soap and detergent, and soft cotton clothes.', 'Keep {p} nails short so {s} {scratch|scratches} less.'], call: 'The patches crack, ooze or keep {o} up, or cream doesn’t help.' },
    heat: { normal: 'Bumps that fade once {s’s} cooler.', alt: ['acne', 'eczema'], t: 'Heat rash', look: 'Tiny red bumps where {s} got too warm, like the neck and chest', lead: 'It comes from sweat, and cooling down is all it takes.', steps: ['Move {o} somewhere cooler and take off a layer.', 'Skip creams and ointments on it; they trap heat.', 'It usually fades in a day or two.'] },
    newborn: { normal: 'Marks that fade over weeks or months.', t: 'Newborn marks and skin blotches', look: 'Tiny white bumps on the nose, red blotches with a pale center, pink marks on the eyelids or neck, blue-gray patches on the back', lead: 'Most are there from birth or show up in the first weeks.', steps: ['Nothing to treat. They fade on their own, and the birthmarks aren’t bruises.'] },
    strawberry: { normal: 'It grows for a few months, then slowly fades.', t: 'Strawberry mark', look: 'A raised red patch that grows for a while, then slowly fades', lead: 'A common birthmark (hemangioma). It often shows up at 2–4 weeks, grows for several months, then slowly fades over years.', steps: ['Nothing to do at home. Your pediatrician will keep an eye on it.', 'Mention it at the next checkup, so they can see how fast it grows.'], call: 'It’s near an eye, the nose, mouth or diaper area, bleeds, or grows very fast.' },
    drool: { normal: 'Redness that clears when the skin stays dry.', alt: ['eczema'], t: 'Drool rash', look: 'Red, chapped skin on the chin, cheeks and neck', lead: 'Wet skin gets chapped. It clears once {p} chin stays dry.', steps: ['Pat the chin and neck dry through the day, and keep a soft bib on.', 'A thin layer of petroleum jelly at bedtime protects the skin.'] }
  };
  // Nov 14: each rash says what's normal for that rash, and its own call signs sit in the same box, not in a second one.
  function rashCall(r) {
    const h = H();
    return h.versus('Normal, or time to call?', ['Normal', (r && r.normal) || 'Spots that come and go, in a happy baby.'], ['Call your pediatrician', (r && r.call) || 'A rash with a fever, blisters or oozing, or one that spreads.'])
      + hubUrgent('Tiny purple-red dots that don’t fade when you press on them, especially with a fever. Call 911 or go to the ER.');
  }
  function rashPage(id) {
    const r = RASH[id], h = H(); if (!r) return null;
    let b = head('skin', 'Skin and rashes', r.t, r.lead);
    // Each rash gets its own picture up top, so Little bumps and Flaky scalp don't open pages that look the same.
    const mini = { newborn: 'milia', yeast: 'diaper' }[id] || id;
    // Nov 21: the header keeps its small drawing; the real photo goes in "What it looks like", where the parent compares.
    let photo = '';
    if (window.careMini) { window.__carePhotoOff = true; const m = careMini(mini); window.__carePhotoOff = false; if (m) b = b.replace(/<span class="dev-area-head-art">[\s\S]*?<\/svg><\/span>/, `<span class="dev-area-head-art care-rash-art">${m}</span>`); photo = careMini(mini); if (!/<img/.test(photo)) photo = ''; }
    b += (photo ? rashMap(id).replace(/<svg viewBox="0 0 160 190"[\s\S]*?<\/svg>/, photo.replace('care-see-photo', 'care-map-photo')) : rashMap(id)) + h2('What helps') + h.steps(r.steps);
    if (id === 'diaper') b += `<div class="hub-list care-link">${rowK('diapers', 'Diapers', 'How to change one, and what’s normal', go('diapers'))}</div>`;
    if (r.alt) b += `<div class="hub-list care-link">${r.alt.map(a => `<button class="hub-row care-rash" onclick="openPage('chg:${CAT}:d:rash:${a}')"><span class="hub-row-copy"><b>${F('Not quite it? ' + RASH[a].t)}</b><small>${F(RASH[a].look)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`).join('')}</div>`;
    b += rashCall(r);
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
  const toothBtn = (here) => live() && !hasTooth() ? (here ? `<button class="hub-already" onclick="careSet('hasTooth','Yes')">${F('Got a first tooth? Tap to mark it')}</button>` : `<div class="hub-list" style="margin-top:14px">${rowK('teeth', 'Got a first tooth?', 'See how to brush it', `careSet('hasTooth','Yes');openPage('chg:${CAT}:d:p:brush')`)}</div>`) : '';
const sunAges = () => typeof hubAgeTiles === 'function' ? hubAgeTiles({ title: 'Sun protection by age', items: [['Under 6 months', 'Shade, a hat and long sleeves', 'Sunscreen only on small spots, if there’s no shade'], ['6 months and up', 'Shade + SPF 30', 'Reapply every 2 hours, and after water']], nowIndex: careAge() < 6 ? 0 : 1, cat: CAT, caption: 'Under 6 months, shade, clothes and a hat. From 6 months, shade plus SPF 30 sunscreen, reapplied every 2 hours and after swimming.' }) : '';
  const callTip = t => H().tip('Call your pediatrician', t);
  // Diaper rash: the two things that help as tiles, and when it's more than a rash.
  const rashBlock = (one, calls) => calls ? rashBlock(true).replace('A diaper rash not better', `${F(calls)} Or a rash not better`) : `<h2 class="hub-h2">${F('If a diaper rash starts')}</h2>` + hubIconSteps([['diaper', 'Change often', 'And let the skin air out'], ['shield', 'Thick zinc cream', 'A thick layer, every change']], CAT, 'Change often and let the skin air out, and use a thick layer of zinc cream at every change.', false)
    + H().tip('Call your pediatrician', 'A diaper rash not better in 2–3 days, or with blisters, pus or bright red folds.');

  // One question per page. vis comes first (a chart or steps), then the answer, then extra (a video, a call line).
  const Q = {
    firstweek: { k: 'diapers', title: 'What’s in the diaper, the first week', vis: () => ramp(),
      W: '', D: 'Feed often, 8–12 times a day, and keep a rough count of wet diapers for the first week.',
      K: 'From about day 6, that pattern means {s’s} getting enough.', Y: 'It’s usually concentrated pee. Still there after day 4? {S} may need more feeds.', Yl: 'A pink or orange stain',
      extra: () => callTip('Fewer wet diapers than the chart, black poop after day 5, or blood in the poop.') + urgent('White, gray or chalky poop, or watery poop many times a day. Call your pediatrician right away.') },
    change: { i: 'hand', k: 'diapers', title: 'How to change a diaper', vis: () => diaperCarousel(),
      D: () => 'Change when wet or dirty, about 8–12 times a day at first. Keep one hand on {o} on the changing table, always.' + (stageNow() === 0 ? ' Until the cord falls off, fold the top of the diaper down below it.' : ''),
      K: 'Leaks, red marks at the legs or waist, or tabs that don’t reach the middle.', Kl: 'Time for the next size',
      extra: () => rashBlock() },
    cord: { k: 'cord', title: 'Keep the cord stump clean and dry', vis: () => hubStageStrip({ title: 'The cord stump', items: [['cord', 'Birth', 'Clamped, then dries out'], ['clock', '1–3 weeks', 'Falls off by itself'], ['smile', 'Once it’s off', 'A small belly button scab']], nowIndex: -1, cat: CAT, caption: 'The cord stump dries and falls off on its own, usually in 1 to 3 weeks.' }),
      W: 'The stump dries up and falls off on its own, usually in 1–3 weeks.', show: { t: 'See the fold', img: 'show-cord', alt: 'A parent folds the top of the diaper down below the cord stump',
        pins: [['Stump in the air', 52, 36, 'r'], ['Top folded down', 48, 66, 'r']], cap: ['Air helps it dry.', 'Fold the diaper down below the stump.'] },
      moves: [['drop', 'Clean only if dirty', 'Plain water, pat dry'], ['hand', 'Let it fall off', 'Even by a thread, don’t pull']],
      tilesT: 'Keep it dry', say: [['cd-1', 'Fold the top of the diaper down, so the stump stays in the air.'], ['cd-2', 'If it gets dirty, clean it with plain water and pat it dry.'], ['cd-3', 'Let it fall off on its own, even if it’s hanging on by a thread.']], tiles: () => [['photo:care/cd-1', 'Fold the diaper down', 'So the stump stays in the air'], ['photo:care/cd-2', 'Clean with plain water', 'Only if dirty, then pat dry'], ['photo:care/cd-3', 'Let it fall off', 'Even if it’s hanging on']], D: '',
      extra: () => hubEmbed('qFPA-4A_8wY', 'Caring for the umbilical cord', 'Nemours KidsHealth') + lookLink('cord', 'Smell, crust or a little blood?', 'What’s normal, and when to call') },
    sponge: { k: 'bath', title: 'Sponge baths for now', vis: () => hubEmbed('uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth'),
      W: () => '2–3 sponge baths a week until the cord falls off' + (anatomy() !== 'girl' ? ' (and a circumcision heals)' : '') + ', so the cord stays dry.', tilesT: 'Step by step', tilesN: true, say: [['sp-1', 'Lay {o} on a towel in a warm room, with a bowl of warm water, a washcloth and a clean diaper in reach.'], ['sp-2', 'Wipe {p} face and the outside of {p} ears with plain water first.'], ['sp-3b', 'Uncover one part at a time, wash it, then wrap it back up.'], ['sp-4b', 'Wash the diaper area last, then pat {o} dry.']], tiles: () => [['photo:care/sp-1', 'Set up in a warm room', 'Towel in reach, water about 100°F'], ['photo:care/sp-2', 'Wipe the face first', 'Plain water, no soap'], ['photo:care/sp-3b', 'Wash the body', 'One part at a time, the rest wrapped'], ['photo:care/sp-4b', 'Pat every crease dry', 'Diaper area washed last, then a fresh diaper']], D: '',
      Y: 'More baths can dry {p} skin. In between, wipe {p} face, neck and diaper area.', Yl: 'Why only 2–3 a week' },
    newskin: { k: 'skin', title: 'Newborn skin', vis: () => looks('What it can look like', ['Peeling or flaky skin in the first 1–2 weeks', 'Tiny white bumps on the nose and chin', 'Red blotches with a white or yellow center, gone in 1–2 weeks', 'Pink marks on the eyelids or neck, and blue-gray patches on the back or bottom: birthmarks, not bruises', 'From about 2 weeks: baby acne on the cheeks, and flaky cradle cap on the scalp']),
      W: 'Newborn skin does a lot of surprising things in the first weeks. Almost all of it is normal.', D: 'Nothing to treat. Plain water, and no lotions or creams on bumps.',
      extra: () => urgent('Clusters of tiny blisters in the first 2 weeks. Call your pediatrician right away.') },
    nailsnose: { k: 'nails', title: () => stageNow() === 0 && live() ? 'Trim nails once or twice a week' : 'Trim nails once a week',
      W: 'They grow fast and are sharp enough to scratch {p} face.', tilesT: 'Step by step', tilesN: true, say: [['nl-1', 'Trim while {s} {are|is} asleep or drowsy, when {p} hands are still.'], ['nl-2', 'Press the finger pad back, away from the nail, so you only catch nail.'], ['nl-3', 'Clip along the curve, then file any sharp corners smooth.']], sayNotes: [['Toenails?', 'Cut those straight across.']], tiles: () => [['photo:care/nl-1', 'Wait until {s} {are|is} asleep', 'Or drowsy after a feed. It’s the easiest time'], ['photo:care/nl-2', 'Press the finger pad back', 'So the clippers only catch nail'], ['photo:care/nl-3', 'Clip along the curve', 'Then file any sharp corners smooth']], D: '',
      K: 'A small nick happens to everyone. Press gently with a clean cloth.', Kl: 'If you nick the skin', Y: 'Wipe the outside with a washcloth. No cotton swabs inside.', Yl: 'Ears',
      extra: () => false ? H().tip('Sticky eyes', 'Wipe from the inside corner out, a fresh damp cotton ball for each eye. Most blocked tear ducts open on their own by the first birthday.') + callTip('A red or swollen eyelid, a red lump at the inner corner of the eye, or yellow-green discharge with redness.') : '' },
    fewer: { i: 'diaper', k: 'diapers', title: 'Fewer poops can be normal', W: () => fewerLine(), D: 'Change {o} when wet or dirty, and let the skin air out before a fresh diaper.',
      K: 'Leaks, red marks at the legs or waist, or tabs that don’t reach the middle.', Kl: 'Time for the next size', extra: () => rashBlock() + lookLink('poop', 'Poop look different?', 'Colors, and when to call') },
    tub: { k: 'bath', title: 'Tub baths can start', vis: () => hubEmbed('VsUla1M7eHQ', 'Giving a tub bath', 'Nemours KidsHealth'),
      W: () => 'Once the cord has fallen off and healed' + (anatomy() !== 'girl' ? ' (and a circumcision too)' : '') + '. About 3 baths a week, washing hair at 2 or 3 of them with a mild shampoo.', D: '',
      tilesT: 'At the tub', tiles: () => [['drop', 'About 2 inches', 'Of warm water'], ['bath', 'Warm, not hot', 'On your wrist, about 100°F'], ['hand', 'A hand behind the head', 'The whole bath']], tips: false,
      extra: () => `<p class="ss-small"><b>Water heater:</b> ${F('Set it to 120°F or lower, so scalds are much less likely.')}</p>` + H().versus('Every bath', ['Always', 'Keep a hand on Maya the whole bath.'], ['Never', 'Step away, even for a second. Babies can slip under quietly. Wrap {o} in a towel and take {o} with you.']) },
    acne: { i: 'smile', k: 'skin', late: true, title: 'Acne, cradle cap and birthmarks', vis: () => rashLink(['acne', 'cradle', 'strawberry']),
      W: () => live() && careAge() >= 4 ? 'Baby acne should be fading by now. Cradle cap can last until the first birthday.' : 'All common now, and none need cream or medicine.', tips: false,
      K: 'Baby acne usually fades by 4–6 months, cradle cap by the first birthday.', Kl: 'How long it lasts' },
    gums: { i: 'tooth', k: 'teeth', title: 'Wipe {p} gums', W: 'Wiping now gets {o} used to brushing later.', D: '', K: () => live() && careAge() >= 5 ? 'Teeth can come any week now.' : 'The first tooth usually comes around 6 months.', Kl: 'What’s next', Y: () => stageNow() === 0 ? 'Tiny white bumps on a newborn’s gums are normal, and go away on their own.' : '', Yl: 'Good to know', extra: () => stageNow() >= 2 ? toothBtn(false) : '' },
    shade: { k: 'sun', title: 'Shade is the best protection from the sun', vis: () => sunAges(), W: 'Under 6 months, skin burns fast and babies overheat easily.', tiles: () => [['home', 'Find shade', 'Especially midday'], ['shirt', 'Cover up', 'Light long sleeves and a wide hat']], tips: false, D: '',
      Y: 'Extra milk feeds, and no water yet. One light layer, and the canopy, not a blanket, over the stroller.', Yl: 'Hot days',
      extra: () => urgent('Any sunburn before age 1. Call your pediatrician right away.') + urgent('Hot and flushed and hard to wake, floppy, or not feeding. Cool {o} down and call 911.') },
    teething: { k: 'teeth', title: 'Teething makes gums sore, not feverish',
      W: 'Drool, chewing and fussy days are the usual signs. First teeth often come at 6–12 months.', tiles: () => [['hand', 'A clean finger', 'Rub the sore gums'], ['ring', 'A firm teething ring', 'Chilled, but never frozen'], ['shirt', 'A soft bib', 'Pat the drool dry']], tips: false, D: '',
      Y: 'Fever, diarrhea, diaper rash or a runny nose means something else is going on.', Yl: 'Not from teething',
      extra: () => H().tip('Skip these', 'Numbing gels, teething tablets and amber teething necklaces. Ask your pediatrician before any pain medicine.') + toothBtn(false) },
    drool: { i: 'drop', k: 'skin', late: true, title: 'Drool rash and eczema', vis: () => rashLink(['drool', 'eczema']),
      W: 'All that drool, and dry air, can leave {p} skin red and rough.', D: '',
      },
    six: { k: 'sun', vis: () => sunAges(), title: () => careAge() >= 7 ? 'Shade first, then sunscreen on bare skin' : 'Start sunscreen once {s’s} 6 months', W: 'Shade and a hat still come first.', strip: () => hubStageStrip({ title: 'When to put sunscreen on', items: [['clock', 'Before you go out', '15–30 minutes ahead'], ['sun', 'Every 2 hours', 'Again, all day'], ['drop', 'After a swim', 'Again, every time']], cat: CAT, caption: 'Put sunscreen on 15 to 30 minutes before going out, again every 2 hours, and again after water.' }), K: 'Broad-spectrum, SPF 30 or more. Mineral is gentlest; skip sprays.', Kl: 'Which sunscreen', D: '',
      Y: 'Extra milk feeds. One light layer, and the canopy, not a blanket, over the stroller.', Yl: 'Hot days',
      extra: () => urgent('Any sunburn before age 1. Call your pediatrician right away.') + urgent('Hot and flushed and hard to wake, floppy, or not feeding. Cool {o} down and call 911.') },
    after1: { k: 'bath', ctx: 'After 1', title: 'Brushing and baths after 1', W: 'Not much changes in the toddler years.', tilesT: 'What carries on', tiles: () => [['tooth', 'Brushing', 'Twice a day, a rice-grain smear'], ['bath', 'Baths', 'About 3 a week'], ['stand', 'Shoes', 'Soft and flexible, once walking outside']],
      K: 'By the first birthday, if you haven’t been yet.', Kl: 'First dental visit' },
    bedbath: { k: 'bath', title: 'A warm bath can be part of bedtime', W: 'Bath, feed, book, bed: a warm bath helps many babies wind down.', tilesT: 'Bath basics', tiles: () => [['clock', 'About 3 a week', 'More can dry {p} skin'], ['drop', '2 inches, about 100°F', 'Test with your wrist'], ['bath', 'Wash hair at 2 or 3', 'With a mild shampoo']], tips: false, D: '',
      K: 'Once {s} {sit|sits} steadily without help, often around 6–8 months. Until then, the baby tub.', Kl: 'When to move to the big tub',
      extra: () => H().versus('Every bath', ['Always', 'Keep a hand on Maya the whole bath.'], ['Never', 'Step away, even for a second. Babies can slip under quietly. Take {o} with you.']) },
    diapers46: { i: 'diaper', k: 'diapers', title: 'Diapers stay much the same', W: 'Until solids start, wet diapers and poop look much like before.', get D() { const rolls = typeof answers !== 'undefined' && (answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways', 'Trying to roll'].includes(answers.rollDirection)); return 'Count on at least 6 wet diapers a day. Size up when you see leaks, or red marks at the legs or waist. ' + (rolls ? 'Now that {s} {roll|rolls}, keep one hand on {o} the whole change, use the strap, and never step away. Or change {o} on the floor.' : 'Keep one hand on {o} at every change, since rolling can start any day.'); },
      K: 'Once solids start, poop gets thicker, browner and smellier. If it gets hard, pears, prunes and peaches help.', Kl: 'What changes next', extra: () => rashBlock() + lookLink('poop', 'Poop look different?', 'Colors, and when to call') },
    solids: { i: 'bowl', k: 'diapers', title: 'Poop once solids start', W: 'Thicker, browner and smellier, sometimes the color of what {s} ate, with bits of food.', D: 'Nothing to do; it’s normal. If it gets hard, pears, prunes and peaches help.',
      extra: () => callTip('Hard, pebble-like poop for more than a few days, or blood.') },
    brush: { k: 'teeth', title: () => hasTooth() ? 'Brushing the first teeth' : 'Brushing starts with the first tooth', vis: () => paste(),
      W: () => hasTooth() ? '' : 'No tooth yet is normal. Some babies get one close to their first birthday.', D: 'Twice a day with a soft baby toothbrush and a rice-grain smear of fluoride toothpaste, including before bed. No need to rinse.',
      K: 'When the first tooth comes in, and by the first birthday.', Kl: 'First dental visit', Y: 'Milk on new teeth overnight causes cavities.', Yl: 'No bottle in bed', extra: () => toothBtn(true) },
    bigtub: { k: 'bath', title: 'Move to the big tub', W: 'Once {s} {sit|sits} steadily on {p} own, the big tub is fine.', tilesT: 'Make it safe', tiles: () => [['shield', 'A non-slip mat', 'In the tub'], ['drop', 'Waist-deep at most', 'When {s} {sit|sits}'], ['hand', 'Pulls up?', 'Gently sit {o} back down']], tips: false, D: '',
      extra: () => H().versus('Every bath', ['Always', 'Keep a hand on Maya the whole bath.'], ['Never', 'Step away, even for a second. Babies can slip under quietly. Take {o} with you.']),
      Y: 'They can tip over, and babies can slip out.', Yl: 'Skip bath seats' },
    feet: { k: 'clothes', ctx: () => live() && careAge() < 10 ? 'Feet and shoes · Usually around the first birthday' : 'Feet and shoes', title: 'Bare feet first, soft shoes later', W: 'Bare feet help {o} balance and feel the floor while {s} {learn|learns} to walk.', tiles: () => [['home', 'Barefoot indoors', 'Or socks'], ['stand', 'Shoes once walking', 'Outside only'], ['sizes', 'Soft and flexible', 'With non-skid soles']], D: '',
      K: 'About a finger’s width at the big toe. Check every month.', Kl: 'How a shoe should fit', Y: 'They don’t help with walking, and can lead to falls.', Yl: 'Skip walkers on wheels' },
    wriggly: { i: 'toy', k: 'diapers', title: 'When diaper changes become a wrestle', W: 'Rolling and crawling make changes trickier. A few things help.', tiles: () => [['toy', 'Something to hold', 'A toy, or the same song each time'], ['hand', 'One hand on {o}', 'Always'], ['stand', 'Pulling up?', 'Try a standing change']], tips: false, D: '',
      K: 'Once solids start, poop gets thicker, browner and smellier, sometimes the color of the food. If it gets hard, pears, prunes and peaches help.', Kl: 'Poop changes with solids',
      extra: () => rashBlock() + lookLink('poop', 'Poop look different?', 'Colors, and when to call') },
    // Any time
    dress: { k: 'clothes', title: 'Dress {o} in one more layer than you', vis: () => layers(), D: 'Feel the back of {p} neck: sweaty means too warm, cool means add a layer.',
      extra: () => H().tip('No hats indoors', 'A hat is for going out.') + H().tip('Snaps or zips', 'Nothing with strings near the neck.') + H().tip('In the car seat', 'No puffy coats under the straps. Buckle {o} in, then put a blanket over the straps.') },
    rashes: { i: 'leaf', k: 'skin', title: 'What’s this rash?', vis: () => rashLink(RASH_ORDER), W: 'Most baby rashes are harmless. Find the one you’re seeing.',
      extra: () => looks('Everyday skin care', ['Plain water is enough for most baths', 'Fragrance-free soap only on dirty spots', 'Most babies don’t need lotion', 'Fragrance-free detergent if {p} skin is sensitive']) + rashCall() }
  };
  const h2_ = t => `<h2 class="hub-h2">${F(t)}</h2>`;
  const val = x => typeof x === 'function' ? x() : x;
  function qPage(id) {
    const q = Q[id]; if (!q) return null;
    const W = val(q.W), D = val(q.D), K = val(q.K), Y = val(q.Y);
    let b = head(q.k, val(q.ctx) || LABEL[q.k], val(q.title), '') + (q.vis && !q.late ? q.vis() : '') + `<section class="ss-moment">`
      + (W ? `<p class="ss-what">${F(W)}</p>` : '') + (q.strip ? q.strip() : '') + (q.show && window.__careShowCard ? `<h2 class="hub-h2">${F(q.show.t)}</h2>` + window.__careShowCard(q.show) + (q.moves ? `<h2 class="hub-h2">${F('Steps')}</h2>` + window.__careMoves(q.moves) : '') : '') + (q.tiles && !q.show ? `<h2 class="hub-h2">${F(q.tilesT || 'What helps')}</h2>` + (q.say && window.__careKeySteps ? window.__careKeySteps(null, null, val(q.say), val(q.sayNotes)).replace('is-say is-photo', q.tilesN ? 'is-say is-photo' : 'is-say is-photo no-num') : H().TPLB.tiles(q.tiles(), CAT, !!q.tilesN)) : '') + (D ? `<section class="ss-do"><b>What to do</b>${Array.isArray(D) ? (q.tips ? `<ul class="care-do care-tips">${D.map(t => `<li>${F(t)}</li>`).join('')}</ul>` : `<ol class="care-do">${D.map(t => `<li>${F(t)}</li>`).join('')}</ol>`) : `<p>${F(D)}</p>`}</section>` : '')
      + (K ? `<p class="ss-know"><b>${F(q.Kl || 'How you’ll know')}</b>${F(K)}</p>` : '') + (Y ? `<p class="ss-small"><b>${F((q.Yl || 'Why it matters') + ':')}</b> ${F(Y)}</p>` : '') + `</section>` + (q.vis && q.late ? q.vis() : '') + (q.extra ? q.extra() : '');
    return page(q.k, b);
  }

  /* ---------- The "What to do now" pages: one strict, calm template ----------
     A title, one line on what's happening, What to do as up to 3 short steps (the one card that stands out),
     at most one picture or video (only when it teaches), one sentence on what's normal, and one quiet line on
     when to call. A red line only for something truly urgent. Nothing else. */
  const Q2 = {
    // Newborn diapers in one place (Nov 7): how many, how to change, and cleaning down there.
    newdiapers: { k: 'diapers', title: 'Diapers in the first weeks', W: 'About 8–12 changes a day at first. Wet diapers are how you know feeding is going well.',
      // The table already shows the count and the poop colors, so neither is said again; the how-to is one tap away.
      do: ['Wipe front to back, and let the skin dry.', 'Keep one hand on {o} on the changing table, always.'], vis: () => `<h2 class="hub-h2">${F('Wet diapers, day by day')}</h2>` + ramp() + `<details class="hub-card care-howto"><summary>${F('How to change one, step by step')}</summary>${diaperCarousel()}</details>`,
      call: 'Fewer wet diapers than this, or black poop after day 5.', urgent: 'White, gray or chalky poop: call right away.',
      extra: () => `<h2 class="hub-h2">${F('Cleaning down there')}</h2>` + downThere() },
    firstweek: { k: 'diapers', title: 'Diapers in the first week', W: 'Wet diapers build up day by day as feeding gets going.',
      do: ['Feed often, 8–12 times a day.', 'Keep a rough count of wet diapers this week.', 'From about day 6, expect 6 or more a day.'], vis: () => ramp(),
      call: 'Fewer wet diapers than this, or black poop after day 5.', urgent: 'White, gray or chalky poop: call right away.' },
    change: { k: 'diapers', title: 'How to change a diaper', W: 'About 8–12 times a day at first. It gets quick.',
      do: ['Have a clean diaper, wipes and cream within reach.', 'Wipe front to back, and let the skin dry.', 'Keep one hand on {o} on the changing table, always.'], vis: () => diaperCarousel(),
      N: 'Leaks or red marks at the legs mean it’s time for the next size.' },
    downthere: { k: 'diapers', i: 'heart', title: 'Cleaning down there', W: () => profile.pronouns === 'he' ? 'For boys, it depends on whether {s’s} circumcised.' : profile.pronouns === 'she' ? 'Gentle cleaning, front to back.' : 'A little different for girls and boys.', custom: () => downThere() },
    cordbath: { k: 'cord', title: 'The cord, and sponge baths', W: 'The cord stump dries and falls off on its own, usually in 1–3 weeks.',
      do: ['Fold the diaper down below the stump, and keep it dry.', 'Sponge baths 2–3 times a week until it falls off: face first, diaper area last.', 'Let it fall off by itself. No alcohol needed.'], vis: () => hubEmbed('uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth'),
      N: 'It darkens and dries, and a spot of blood when it comes off is normal.', call: 'A yellow, smelly discharge, redness around it, or still on after 3 weeks.' },
    nails: { k: 'nails', i: 'nail', title: 'Trim tiny nails', W: 'They grow fast and can scratch {p} face.',
      do: ['About once a week, while {s’s} asleep.', 'Baby clippers or a soft file, pressing the fingertip pad away.', 'File to a rounded edge.'], N: 'A small nick happens to everyone. Press gently with a clean cloth.' },
    tub: { k: 'bath', title: 'Tub baths', W: 'Once the cord has fallen off and healed.',
      do: ['About 2 inches of warm water, around 100°F. Test it with your wrist. (Water heater at 120°F or lower.)', 'One hand behind {p} head and neck the whole time.', 'About 3 baths a week; hair 2–3 times with a mild shampoo.'], vis: () => hubEmbed('VsUla1M7eHQ', 'How to give your baby a tub bath', 'Nemours KidsHealth'),
      urgent: 'Never step away, even for a second. Take {o} with you.' },
    gums: { k: 'teeth', title: 'Wipe {p} gums', W: 'A clean mouth before teeth come gets {o} used to it.',
      do: ['Twice a day, with a soft, clean cloth.', 'After the first feed and before bed.'], N: 'The first tooth usually comes around 6 months.' },
    shade: { k: 'sun', title: 'Shade is the best protection from the sun', W: 'Under 6 months, skin burns fast and babies overheat easily.',
      do: ['Shade, light long sleeves and a wide-brimmed hat.', 'On hot days, extra milk feeds, and the canopy, not a blanket, over the stroller.', 'No shade at all? Ask your pediatrician about a little sunscreen on the face.'], call: 'Any sunburn.' },
    teething: { k: 'teeth', title: 'Teething', W: 'The first tooth usually comes around 6 months. Anywhere from 4 to 12 is normal.',
      do: ['Rub {p} gums with a clean finger.', 'Offer a firm teething ring, chilled in the fridge, not frozen.', 'Skip numbing gels and teething necklaces.'], N: 'Drool, chewing on everything and extra fussing.', call: 'A fever, diarrhea or a rash: teething doesn’t cause those.' },
    six: { k: 'sun', title: 'Sunscreen can start at 6 months', W: 'Shade and a hat still come first.',
      do: ['Sunscreen: broad-spectrum, SPF 30 or more, every 2 hours.', 'Mineral is gentlest. Skip sprays.'], call: 'Any sunburn.' },
    brush: { k: 'teeth', title: () => hasTooth() ? 'Brushing' : 'Brushing, from the first tooth', W: () => hasTooth() ? 'Twice a day keeps new teeth healthy.' : 'No tooth yet is normal. Some come close to the first birthday.',
      do: ['A soft baby toothbrush, twice a day, including before bed. No bottle in bed.', 'A rice-grain smear of fluoride toothpaste. No need to rinse.', 'First dental visit by the first birthday.'], vis: () => paste(), extra: () => toothBtn() },
    bigtub: { k: 'bath', title: 'The big tub', W: 'Once {s} {sit|sits} steadily on {p} own.',
      do: ['A non-slip mat, and water no higher than {p} waist.', 'A hand on {o} the whole time.', 'Skip bath seats. They can tip over.'], urgent: 'Never step away, even for a second.' },
    feet: { k: 'clothes', title: 'Bare feet first, soft shoes later', W: 'Bare feet help {o} balance while {s} {learn|learns} to walk.',
      do: ['Barefoot or socks indoors.', 'Soft, flexible shoes only once {s’s} walking outside.', 'Skip walkers on wheels.'] },
    wriggly: { k: 'diapers', i: 'toy', title: 'Rolling and wriggly changes', W: 'A first roll often comes before you expect it, and a baby can roll off a changing table in a second.',
      do: ['Keep one hand on {o} the whole change, from now on.', 'Have everything within reach first. If you need both hands, change {o} on the floor.', 'Hand {o} a toy, or sing the same song each time.', 'Once {s} {pull|pulls} up, try a standing change.'] }
  };
  function q2Page(id) {
    const q = Q2[id]; if (!q) return null;
    const W = val(q.W);
    let b = head(q.k, LABEL[q.k], val(q.title), '') + (W ? `<p class="ss-what">${F(W)}</p>` : '');
    if (q.custom) b += q.custom();
    if (q.do) b += `<section class="ss-do"><b>What to do</b><ol class="care-do">${q.do.map(t => `<li>${F(t)}</li>`).join('')}</ol></section>`;
    if (q.vis) b += q.vis();
    if (q.N) b += `<p class="ss-know"><b>What’s normal</b>${F(q.N)}</p>`;
    if (q.urgent) b += hubUrgent(q.urgent);
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
        vis: () => hubEmbed('qFPA-4A_8wY', 'Caring for the umbilical cord', 'Nemours KidsHealth'),
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
        doText: 'Shade, light long sleeves and a wide-brimmed hat. On hot days, extra milk feeds. No shade at all? Ask your pediatrician about a little sunscreen on the face.',
        normal: 'Too much sun shows as pink skin, often hours later.', call: 'Any sunburn.' },
      2: { line: 'Sunscreen from 6 months', get answer() { return sixNow() ? 'At 6 months, sunscreen can join shade and a hat.' : 'Shade only until 6 months. Then sunscreen can join in.'; }, 
        get doText() { return sixNow() ? 'Shade and a hat first. Then broad-spectrum sunscreen, SPF 30 or more, every 2 hours. Mineral is gentlest.' : 'Keep {o} in the shade, with light long sleeves and a wide-brimmed hat. From 6 months, add SPF 30 sunscreen every 2 hours.'; },
        normal: 'Too much sun shows as pink skin, often hours later.', call: 'Any sunburn.' },
      3: { line: 'Bare feet first, soft shoes later', answer: 'Bare feet help {o} balance while {s} {learn|learns} to walk.',
        doText: 'Barefoot or socks indoors. Soft, flexible shoes only once {s’s} walking outside. In the sun: shade, a hat, and SPF 30 sunscreen every 2 hours.' }
    },
    teeth: {
      2: { line: 'Teething often starts', answer: 'The first tooth usually comes around 6 months. Anywhere from 4 to 12 is normal.',
        doText: 'Comfort sore gums with gentle pressure and something cool, and skip the remedies that aren’t safe.',
        normal: 'Drool, chewing on everything and extra fussing.',
        vis: () => hubIconSteps([['hand', 'A clean finger', 'Rub the gums'], ['ring', 'A teething ring', 'Chilled, not frozen'], ['shield', 'Skip these', 'Numbing gels, necklaces']], CAT, 'Rub the gums with a clean finger, offer a chilled teething ring, and skip numbing gels and teething necklaces.', false), call: 'A fever, diarrhea or a rash: teething doesn’t cause those.', extra: () => toothBtn() },
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
    if (s.urgent) b += hubUrgent(s.urgent);
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
    diapers: { items: [['diaper', '8–12 a day', 'Newborn'], ['hand', 'Rolling starts', 'Often 4–6 months'], ['toy', 'A toy to hold', 'When wriggly'], ['stand', 'Standing changes', 'Once pulling up']], now: v => [0, 0, 1, answers.pullUp === 'Yes' ? 3 : 2][v], stage: [0, 2, 3, 3], caption: 'Diapers: 8 to 12 a day as a newborn, rolling often from 4 to 6 months, a toy to hold when wriggly, and standing changes once pulling up.' },
    bath: { items: [['bath', 'Sponge baths', 'Until the cord falls off'], ['tub', 'Baby tub', 'Once the cord heals'], ['mat', 'Big tub', 'Once sitting steadily']], now: v => [0, 1, 1, 2][v], stage: [0, 1, 3], caption: 'Baths: sponge baths until the cord falls off, a baby tub once it heals, and the big tub once sitting steadily.' },
    skin: { items: [['drop', 'Peeling and spots', 'First weeks'], ['smile', 'Acne and cradle cap', '1–3 months'], ['leaf', 'Drool rash', 'From about 4 months']], now: v => [0, 1, 2, 2][v], stage: [0, 1, 2], caption: 'Skin: peeling and spots in the first weeks, baby acne and cradle cap at 1 to 3 months, and drool rash from about 4 months.' },
    dress: { items: [['sun', 'Shade only', 'Under 6 months'], ['drop', 'Shade and sunscreen', 'From 6 months'], ['stand', 'Soft shoes', 'Once walking outside']], now: v => v <= 1 ? 0 : v === 2 ? (sixNow() ? 1 : 0) : (walkingSoon() ? 2 : 1), stage: [1, 2, 3], caption: 'Sun and shoes: shade only under 6 months, sunscreen from 6 months, and soft shoes once walking outside.' },
    teeth: { items: [['tooth', 'Teething', 'Often from 4–6 months'], ['smile', 'First tooth', 'Around 6 months'], ['drop', 'Brushing', 'From the first tooth'], ['steth', 'Dentist', 'By the first birthday']], now: v => v < 2 ? -1 : hasTooth() ? 2 : 0, stage: [2, 3, 3, 3], caption: 'Teeth: teething often from 4 to 6 months, the first tooth around 6 months, brushing from the first tooth, and a dentist visit by the first birthday.' }
  };
  // Your daily care: every care job that applies at this age, with the answer for now; "New" marks what changed.
  const DAILY = [
    () => [['diapers', '8–12 a day, one hand on {o}'], ['down', null], ['cord', 'Keep it dry. It falls off in 1–3 weeks'], ['bath', 'Sponge baths, 2–3 a week'], ['dress', 'One more layer than you'], ['nails', 'Trim weekly, while {s’s} asleep']],
    () => [['diapers', 'When wet or dirty, one hand on {o}'], ['bath', 'Baby tub, about 3 a week'], ['skin', 'Baby acne and cradle cap'], ['dress', 'One more layer, and shade only'], ['nails', 'Trim weekly, while {s’s} asleep']],
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
    () => ({ diapers: 'One hand on {o}, always', bath: 'Baby tub, about 3 a week', skin: 'Acne and cradle cap', dress: '+1 layer, shade only', teeth: 'From about 4 months', nails: 'Trim weekly' }),
    () => ({ diapers: 'One hand on {o}, always', bath: 'About 3 a week', skin: 'Pat drool dry often', dress: sixNow() ? 'Shade + SPF 30' : 'Shade only until 6 months', teeth: 'Teething often starts', nails: 'Trim weekly' }),
    () => ({ diapers: 'A hand on {o}, a toy to hold', bath: 'Big tub once sitting', skin: 'Pat drool dry often', dress: 'Bare feet indoors', teeth: hasTooth() ? 'Brush twice a day' : 'Soothe gums until a tooth', nails: 'Trim weekly' })
  ];
  const LATER = { teeth: 'From about 4 months', skin: 'Peeling is normal' };
  const NOTYET = { teeth: 'Teething usually starts around 4–6 months. There’s nothing to do yet.', skin: 'In the first weeks, peeling skin and tiny white bumps are normal and clear up on their own. Nothing else to do yet.' };
  const topicRow = (k, v) => { const s = tFor(k, v); if (!s) return ''; const c = COL[TCOL[k]];
    return `<button class="hub-row hl-row" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:c:${k}:${v}')"><span class="hub-dot">${hubArt(ICON[TCOL[k]], CAT)}</span><span class="hub-row-copy"><b>${F(TNAME[k])}</b><small>${F(val(s.line))}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  // Older links land on the topic and stage they were about.
  const Q2T = { firstweek: ['diapers', 0], change: ['diapers', 0], downthere: ['down', 0], fewer: ['look', 1], solids: ['look', 2], wriggly: ['diapers', 2], cordbath: ['cord', 0], cord: ['cord', 0], sponge: ['bath', 0], tub: ['bath', 1], bigtub: ['bath', 3], newskin: ['look', 0], acne: ['skin', 1], drool: ['skin', 2], rashes: ['look', 0], dress: ['dress', 0], shade: ['dress', 1], six: ['dress', 2], feet: ['dress', 3], gums: ['teeth', 2], teething: ['teeth', 2], brush: ['teeth', 3], nails: ['nails', 0], nailsnose: ['nails', 0] };

  const STAGES = [
    { title: 'Diapers, the cord and first baths', lead: 'It feels like a lot at first, and it gets quicker fast. Most of what looks odd in the first weeks is normal.',
      tiles: () => [['Diapers', '8–12 a day', 'Change when wet or dirty'], ['Baths', '2–3 a week', 'Sponge baths until the cord falls off'], ['Clothes', '+1 layer', 'One more than you'], ['Sun', 'Shade first', 'Sunscreen only without shade']],
      // The first weeks bring the most to learn, so they're grouped, like Health's checkup page, to stay easy to scan.
      rows: () => ['firstweek', 'change', 'downthere', 'cordbath', 'nails'],
      call: ['Peeling skin, tiny white bumps, sneezing, and black poop at first.', '100.4°F or higher, fewer wet diapers, white poop, or yellow skin that spreads.'] },
    { title: 'Tub baths and skin care', lead: 'The cord has healed, and care settles into a rhythm. Poops can space out, and baby acne is common.',
      tiles: () => [['Diapers', '6+ wet a day', 'A hand on {o}, every change'], ['Baths', 'About 3 a week', 'In a baby tub'], ['Clothes', '+1 layer', 'One more than you'], ['Sun', 'Shade first', 'Sunscreen only without shade']],
      rows: () => (rollingNow() ? ['wriggly', 'tub', 'shade'] : ['tub', 'gums', 'shade']),
      call: ['Fewer poops if breastfed, grunting, and baby acne.', '100.4°F or higher, hard poop, blood, or fewer wet diapers.'] },
    { title: 'Drool, sun and busy hands', lead: 'Lots of drool, and the first tooth is on its way, often around 6 months. At 6 months, sunscreen can join shade and a hat.',
      tiles: () => [['Diapers', '6+ wet a day', live() && answers.solids === 'Yes' ? 'Poop changes with solids' : 'Size up for leaks'], ['Baths', 'About 3 a week', 'Often at bedtime'], ['Clothes', '+1 layer', 'One more than you'], sixNow() ? ['Sun', 'Shade + SPF 30', 'Sunscreen from 6 months'] : ['Sun', 'Shade first', 'Sunscreen only without shade']],
      rows: () => ['wriggly', 'teething', sixNow() ? 'six' : 'shade'],
      call: ['Drool, chewing and more fussing.', 'A fever (teething doesn’t cause one), or any sunburn.'] },
    { title: 'First teeth and the big tub', lead: 'Brushing starts with the first tooth, the big tub comes once sitting, and bare feet help when first steps come.',
      tiles: () => [['Diapers', '6+ wet a day', 'Wriggly changes'], ['Baths', 'About 3 a week', 'The big tub once sitting'], walkingSoon() ? ['Clothes', 'Bare feet indoors', 'Soft shoes outside'] : ['Clothes', '+1 layer', 'One more than you'], ['Sun', 'Shade + SPF 30', 'Every 2 hours']],
      rows: () => ['brush', 'bigtub', walkingSoon() ? 'feet' : null, 'wriggly'].filter(Boolean),
      call: ['Wriggly changes, firmer poop, and no tooth yet.', 'A fever, hard poop for days, or any sunburn.'] }
  ];
  // "Now" means now: sunscreen only from 6 months, shoes only once pulling up and cruising are close.
  const sixNow = () => !live() || careAge() >= 6;
  const rollingNow = () => live() && (answers.roll === 'Yes' || answers.rollDirection === 'Trying to roll');
  const walkingSoon = () => !live() || careAge() >= 9 || answers.pullUp === 'Yes';
  const qRow = (id, eyebrow = true) => { const q = Q2[id] || Q[id], c = COL[q.k];
    return `<button class="hub-row hl-row" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:q:${id}')"><span class="hub-dot">${hubArt(q.i || ICON[q.k], CAT)}</span><span class="hub-row-copy">${eyebrow ? `<small class="hub-row-eyebrow">${F(LABEL[q.k])}</small>` : ''}<b>${F(val(q.title))}</b>${q.sub ? `<small>${F(q.sub)}</small>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  window.careHome = function (selected = null) {
    const h = H(), now = stageNow(), v = Number.isInteger(selected) && STAGES[selected] ? selected : now, st = STAGES[v], nx = STAGES[v + 1];
    const T = STAGE_TABLE[CAT].stages;
    const pills = h.pills('Everyday care by age', T.map((s, i) => ({ label: s.label, age: s.age, on: i === v, now: live() && i === now, onclick: `openPage('chg:${CAT}:s:${i}')`, change: typeof stageCanChange === 'function' && stageCanChange(CAT, i, now) ? `hubChangeStage('${CAT}',${i})` : '' })), CAT);
    let b = `<header class="hub-hero care-hero"><p class="hub-eyebrow">${STAGE[v]}</p><h1>${F(st.title)}</h1><p class="hub-lead">${F(st.lead)}</p></header>`;
    // No tiles: Everyday care's answers are mostly actions, not numbers, so they read better as rows (like Health).
    const shop = '';
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
  function lookOff(v, openK) {
    const h = H(), now = v == null ? stageNow() : v, solidsOn = live() && answers.solids === 'Yes';
    const block = (normal, todo, call, urgentT, urgentL) => (normal ? `<p class="care-p"><b>${F('Normal:')}</b> ${F(normal)}</p>` : '') + (todo ? `<p class="care-p"><b>${F('What to do:')}</b> ${F(todo)}</p>` : '') + (call ? `<p class="care-p"><b>${F('Call your pediatrician:')}</b> ${F(call)}</p>` : '')
      + (urgentT ? hubUrgent(urgentT) : '');
    const ans = (title, tiles, call, urgentT) => `<h2 class="hub-h2">${F(title)}</h2>` + hubIconSteps(tiles, CAT, F(tiles.map(t => t[1] + ': ' + t[2]).join('. ')), false) + block('', '', call, urgentT);
    const rashLine = id => { const r = RASH[id]; return `<li><b>${F(r.t)}</b> ${F(r.look)}</li>`; };
    const rashOrder = [['newborn', 'acne', 'peeling', 'heat'], ['acne', 'heat', 'cradle', 'eczema'], ['drool', 'eczema', 'heat', 'cradle'], ['heat', 'eczema', 'drool', 'cradle']][now];
    const rest = RASH_ORDER.concat('strawberry', 'newborn').filter((id, i, a) => a.indexOf(id) === i && !rashOrder.includes(id) && id !== 'diaper' && id !== 'yeast' && !(now >= 2 && ['newborn', 'peeling', 'strawberry', 'acne', 'cradle'].includes(id)) && !(now === 1 && ['newborn', 'peeling'].includes(id)) && !(now === 0 && id === 'strawberry') && !(now <= 1 && id === 'drool'));
    const under3 = now === 0 || (now === 1 && (!live() || actualMonth() < 3));
    const rashCall = 'A rash with a fever, blisters or pus, or one that spreads.', rashNow = [now === 0 ? 'Tiny blisters in the first 2 weeks' : '', under3 ? 'any fever of 100.4°F or higher before 3 months' : ''].filter(Boolean).join(', or ');
    // Nov 22: the same short call list as every other page. The glass test above already holds the 911 sign.
    const rashCalls = ctCalls({ ped: ['A rash that spreads, oozes or blisters', 'A rash with any fever, floppiness or poor feeding. Call right away', now === 0 && careAge() < 1 ? 'Tiny blisters in the first 2 weeks. Call right away' : null] });
    const diaperRow = `<div class="hub-list care-link">${rowK('diapers', 'Red under the diaper?', 'Diaper rash or yeast: see the difference', `openPage('chg:${CAT}:d:rash:diaper')`)}</div>`;
    const otherRashes = !rest.length ? '' : `<div class="hub-list care-link">${rowK('look', 'Other rashes', rest.slice(0, 3).map((id, i) => i ? RASH[id].t.toLowerCase() : RASH[id].t).join(', ') + (rest.length > 3 ? ' and more' : ''), `openPage('chg:${CAT}:d:look:${now}:rashmore')`)}</div>`;
    const items = {
      poop: ['Nearly every poop color is normal', 'White, gray, red, or black after the first days means a call.', poopChart()
        + `<h2 class="hub-h2">${F('Also normal')}</h2>` + hubIconSteps([
          now === 0 ? ['clock', 'Black at first', 'For the first few days'] : live() && profile.feed === 'Formula' ? ['clock', 'Most days', 'Usual on formula'] : ['clock', 'Fewer poops', live() && profile.feed === 'Both' ? 'A few days apart can be normal' : 'Breastfed babies can go days between'],
          ['diaper', 'Straining, going red', 'Even when it comes out soft'],
          solidsOn || now >= 3 ? ['bowl', 'Thicker with solids', 'Hard? Pears, prunes, peaches'] : ['drop', '6+ wet diapers', 'Every day']], CAT, 'Also normal.', false)
        + block('', '', 'Fewer than 6 wet diapers a day, or hard, pebble-like poop.', (now <= 1 ? 'White, gray or chalky poop, or watery poop many times a day.' : 'White, gray or chalky poop.') + ' Call your pediatrician right away.')],
      rash: ['Spots, bumps or patches of dry skin', now >= 2 ? 'Drool rash, eczema, heat rash' : 'Rashes, acne, cradle cap', 'Most are harmless and clear on their own. Find the one that looks like it.', `<h2 class="hub-h2">${F('Which one looks like it?')}</h2>` + rashPick(rashOrder) + diaperRow + otherRashes
        // One call line: the glass test above already holds the 911 sign.
        + `<h2 class="hub-h2">${F('Worried? Press a glass on the spots')}</h2>` + glassTest() + rashCalls],
      // The less common rashes for this age, on their own page, each with what it looks like and what to do.
      rashmore: ['Cradle cap and eczema look different', 'Find the one that matches', `<h2 class="hub-h2">${F('Which one looks like it?')}</h2>` + rashPick(rest) + rashCalls],
      cord: ['Crust or a little blood on the cord', 'Or a little smell', 'A little crust, smell or a spot of blood is normal while it heals.', ans('What’s normal', [['cord', 'Darkens and dries', 'Crust is normal'], ['drop', 'A spot or two of blood', 'When it falls off'], ['clock', 'Falls off', 'Usually in the first 3 weeks']],
        'A yellow, smelly discharge, redness around it, crying when you touch it, or still on after 3 weeks.')],
      nose: ['A stuffy or noisy nose', 'Snuffly breathing, sneezing', ''],
      eyes: ['Sticky or watery eyes', 'Goo, or a blocked tear duct', 'Both are usually normal, and most clear on their own.', ans('Usually normal, and what helps', [['drop', 'Snuffly breathing', 'Usually dried milk or mucus, not a cold'], ['eye', 'A watery eye, not red', 'Often a blocked tear duct'], ['hand', 'Sticky eyes', 'Wipe from the inside corner out'], ['steth', 'A stuffy nose', 'A few saline drops, then gentle suction']],
        'A red or swollen eyelid, yellow-green discharge with redness, or a red lump near the inner corner of the eye.', 'Struggling to breathe, or blue lips. Call 911.')
        ],
      yellow: ['Yellow skin', 'Jaundice in the first weeks', 'A little yellow in the first week is common. It’s called jaundice, and your pediatrician checks it at the first visit.', H().tip('Feed often', 'Sunlight doesn’t treat it, so let your pediatrician check.') + ans('What to look for', [['sun', 'Yellow on the face', 'Shows in the first days, then fades'], ['eye', 'On darker skin', 'Check the whites of the eyes and gums']],
        'Yellow spreading to the belly or legs, yellow whites of the eyes, or fewer wet diapers.', 'Any yellow in the first 24 hours, or yellow and hard to wake or not feeding well.')],
      gums: ['Drool, sore gums or extra fussing', 'Could it be teething?', ans('Usually teething', [['drop', 'Lots of drool', 'And chewing on everything'], ['tooth', 'Sore, swollen gums', 'Often the bottom front'], ['clock', 'A few fussy days', 'Then it settles']],
        'Fever, diarrhea or a runny nose. Teething doesn’t cause those, so something else is going on.') + `<div class="hub-list care-link">${rowK('teeth', 'Soothe sore gums', 'What helps, and what to skip', `openPage('chg:${CAT}:d:p:teething')`)}</div>`],
      head: ['A flat spot or bald patch', 'From lying on {p} back', ''],
      quirks: ['Hiccups and sneezes', 'And sudden startles', ''],
      swelling: ['Swollen breasts or genitals', 'From pregnancy hormones', ''],
      belly: ['A bulging belly button', 'Often an umbilical hernia', ''],
      crossing: ['Eyes that cross or wander', now >= 2 ? 'Worth a check after 4 months' : 'Common before 4 months', ''],
      hearing: ['Not reacting to sounds?', 'How {s} {hear|hears}, and when to ask', ''],
      breathing: ['Pauses in breathing', 'Then a few quick breaths', ''],
      hot: ['Too hot or too cold?', 'Sweaty, flushed, chilly, what to wear', ans('Check and adjust', [['shirt', 'One more layer', 'Than you’re wearing'], ['hand', 'Feel the neck', 'Sweaty: too warm. Cool: add one'], ['home', 'No hat indoors', 'And no puffy coat in the car seat']],
        'Any sunburn before age 1, right away.', 'Hot and flushed and hard to wake, floppy, or not feeding. Cool {o} down and call 911.')]
    };
    const order = [['poop', 'rash', 'cord', 'yellow', 'breathing', 'quirks', 'swelling', 'eyes', 'nose', 'hearing'], ['poop', 'rash', 'head', 'belly', 'eyes', 'crossing', 'breathing', 'nose', 'hearing'], ['gums', 'rash', 'head', 'poop', 'crossing', 'nose', 'hearing'], ['gums', 'rash', 'poop', 'nose', 'hearing']][now];
    const LI = { poop: 'diaper', rash: 'drop', cord: 'cord', yellow: 'sun', eyes: 'eye', nose: 'nose', gums: 'tooth', hot: 'thermo', head: 'head', swelling: 'clock', belly: 'cord', crossing: 'eyes2', hearing: 'ear', quirks: 'smile', breathing: 'moon' };
    // Nov 14: a page opened from the list answers first. The list keeps its short subtitle; the page leads with the verdict.
    if (openK && items[openK]) { const it = items[openK], [t, sub] = it, verdict = it.length > 3 ? it[2] : sub, body = it[it.length - 1];
      return page('look', head('look', 'Is this normal?', t, verdict) + body ); }
    // Nov 22 (Yarden's inspiration): lead with what's common at this age, as photo tiles; poop gets its own color card.
    const COMMON = [[['newborn', 'Tiny white dots', 'Newborn spots'], ['peeling', 'Dry, peeling skin', 'Often hands and feet, first weeks']],
      [['acne', 'Little bumps', 'Baby acne'], ['cradle', 'A flaky scalp', 'Cradle cap']],
      [['drool', 'A red, chapped chin', 'Drool rash'], ['eczema', 'Dry, rough patches', 'Eczema']],
      [['heat', 'Tiny red bumps', 'Heat rash'], ['eczema', 'Dry, rough patches', 'Eczema']]][now];
    const WHEN = ['in the first weeks', 'around 1–3 months', 'around 4–6 months', 'around 6–12 months'][now];
    let b = head('look', 'Is this normal?', 'Most things that look odd are normal', 'Find the one that matches what you see.');
    b += h2('Common ' + WHEN) + `<div class="care-common">${COMMON.map(([id, t, sub]) => `<button class="care-common-tile" onclick="${cgo('rash:' + id)}"><img src="assets/care/rash-${id}.jpg?v=1" alt="" loading="lazy"><span><b>${F(t)}</b><small>${F(sub)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>`;
    b += `<button class="hub-card care-poopcard" onclick="openPage('chg:${CAT}:d:look:${now}:poop')"><span class="care-poopdots" aria-hidden="true"><i style="background:#d9b13b"></i><i style="background:#7f9a46"></i><i style="background:#8a5a35"></i></span><span><b>${F('Different poop?')}</b><small>${F('What the colors mean, and which ones need a call')}</small></span><i class="care-chev" aria-hidden="true">›</i></button>`;
    b += h2('Something else?') + `<div class="hub-card care-folds care-lookoff">${order.filter(k => k !== 'poop').map(k => { const [t, sub] = items[k]; return `<button class="care-pick" onclick="openPage('chg:${CAT}:d:${k === 'gums' ? 'p:teething' : `look:${now}:${k}`}')"><span class="care-ico">${hubArt(LI[k], CAT)}</span><span><b>${F(t)}</b><small>${F(sub)}</small></span><i aria-hidden="true">›</i></button>`; }).join('')}</div>`;
    return page('look', b);
  }

  /* ---------- routes ---------- */
  // Older pages open the topic that now holds them, at the age they were about.
  const OLD = { sponge: ['bath', 0], tub: ['bath', 1], bathseat: ['bath', 3], skin: ['skin'], dress: ['clothes'], steps: ['clothes', 3], sun: ['sun'], gums: ['teeth', 2], teeth: ['teeth', 3], nails: ['nails'] };
  window.careTopic = function (k, v) { const now = stageNow(); v = Number.isInteger(v) && v >= 0 && v <= 3 ? v : now; return TOPIC[k] ? TOPIC[k](v) : null; };
  const baseRoute = window.changesRoute;
  /* ---------- Everyday care page templates (Nov 15) ----------
     Every detail page is one of three templates. Each has the same sections, with the same plain titles, in the same
     order, so a parent learns where things are. A page is data: fill in its fields and the template draws it.

     Template   Parent's question            Top card                    Sections
     expect     What's normal right now?     the takeaway + why          What's normal · What to do · When to call?
     howto      How do I do this?            the direct answer           Steps · Keep {o} safe? · Watch how?
     check      Should I be worried?         the name + the verdict      How to tell · What helps · When to call
     (The guide's main page is the stage overview: what's changing now, what needs action, what's coming.)

     Section titles say what's in them, never an abstract label ("What it means for you"). One call card name everywhere.
     Numbers only on Steps, where order matters. A How-to page never has a call card; its warnings are "Keep {o} safe".

     Fields (text can use {s} {o} {p} and {a|b}; any field can be a function):
       all     type, k (color and art), title, why (one sentence)
       expect  normal: a figure, or [[icon, bold, line], ...] (2–3); do (one or two sentences); doRows: up to 2 short follow-ups shown inside the What to do card;
               calls { ped, now, nowLabel }
       howto   steps [[icon, bold, line], ...] (3–5, one action each); safe [[icon, bold rule, line]] (≤2); video [id, title, source]
       check   where (rash id for the body map); tell: short notes shown inside the figure (≤2); notRight (a text link) [title, line, route];
               helps [[icon, bold, line]]; calls { ped, now, nowLabel }
     To add a page: add an entry to TPL under its route. QA: tools/qa/browser/care_blocks.py. */
  const PHONE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
  // Nov 21 (content panel, AAP): under 3 months, any fever is 100.4°F or higher, and it means calling right away, day or night.
  const feverNum = t => typeof t === 'string' && (!live() || careAge() < 3) && /\ba fever\b(?! of)/.test(t) && !/100\.4/.test(t) ? t.replace(/\ba fever\b(?! of)/, 'a fever of 100.4°F or higher (call right away, day or night)') : t;
  // Nov 22: a list of short signs (like Health's), the newborn fever rule as its own line, and 911 in its own red box.
  // Nov 22: the AAP number for this baby's age, like Health's fever page.
  const feverItem = () => !live() || careAge() < 3 ? 'A fever of 100.4°F or higher. Call right away, day or night' : careAge() < 6 ? 'A fever of 101°F or higher, or one that lasts more than a day' : 'A fever of 103°F or higher, or one that lasts more than a day';
  const callsCard = (c, title) => !c ? '' : Array.isArray(val(c.ped)) ? h2(title || 'When to call') + `<section class="care-calls is-titled is-list"><span class="care-calls-ico">${PHONE}</span><div><p><b>${F('Call your pediatrician if you see')}</b></p><ul>${val(c.ped).filter(Boolean).map(x => `<li>${F(x === 'FEVER' ? feverItem() : x)}</li>`).join('')}</ul>${c.note ? `<p class="care-calls-note">${F(val(c.note))}</p>` : ''}</div></section>` + (c.now ? hubUrgent(F(val(c.now)), 'Call 911 right away') : '') : h2(title || 'When to call') + `<section class="care-calls is-titled"><span class="care-calls-ico">${PHONE}</span><div>`
      + (c.ped ? `<p><b>${F('Call your pediatrician if:')}</b> ${F(feverNum(val(c.ped)))}</p>` : '')
      + (c.now ? `<p class="is-urgent"><b>${F((c.nowLabel || 'Call right away') + ' if:')}</b> ${F(val(c.now))}</p>` : '') + `</div></section>`;
  const TB = {
    top: (q, lead) => head(q.k, val(q.eyebrow) || LABEL[q.k], val(q.title), val(lead), val(q.verdict)),
    // One card per section: the main action, then up to two short follow-ups inside the same card.
    card: (text, notes) => { if (!text) return ''; notes = (val(notes) || []).filter(Boolean); return `<section class="ss-do care-tpl-card"><p>${F(val(text))}</p>${notes.length ? `<ul class="tpl-notes"${notes.length > 2 ? ' data-over-limit="notes"' : ''}>${notes.map(([, t, sub]) => `<li><b style="color:#302d3c">${F(t)}${/[?!.]$/.test(t) ? '' : '.'}</b> ${F(sub)}${/[?!.]$/.test(sub) ? '' : '.'}</li>`).join('')}</ul>` : ''}</section>`; },
    // Nov 21: a tile whose art is 'photo:<path>' shows that photo (the shared builder Feeding uses).
    tiles: (items, numbered) => items && items.length ? H().TPLB.tiles(items, CAT, numbered) : '',
    rows: rows => { rows = (val(rows) || []).filter(Boolean); return rows.length ? `<div class="hub-list"${rows.length > 3 ? ' data-over-limit="rows"' : ''}>${rows.map(([icon, t, sub]) => H().row({ icon, cat: CAT, title: t, sub })).join('')}</div>` : ''; },
    video: v => v ? hubEmbed(...v) : '',
    link: l => l ? `<div class="hub-list care-link">${rowK('look', l[0], l[1], `openPage('chg:${CAT}:d:${val(l[2])}')`)}</div>` : '',
    section: (title, body) => body ? h2(F(title)) + body : '',
    // Short notes go inside the figure they explain, so a section is one card, not a stack of boxes.
    noted: (fig, notes) => { notes = (val(notes) || []).filter(Boolean); if (!fig || !notes.length) return fig || '';
      const ul = `<ul class="tpl-notes">${notes.map(([icon, t, sub]) => `<li><b style="color:#302d3c">${F(t)}${/[?!.]$/.test(t) ? '' : '.'}</b> ${F(sub)}${/[?!.]$/.test(sub) ? '' : '.'}</li>`).join('')}</ul>`;
      const i = fig.lastIndexOf('</figure>'); return i < 0 ? fig + ul : fig.slice(0, i) + ul + fig.slice(i); },
    more: l => l ? `<button class="tpl-more" onclick="openPage('chg:${CAT}:d:${val(l[2])}')">${F(l[0])} <span>${F(l[1])} ›</span></button>` : ''
  };
  // Nov 22: steps with one key photo. A photo only where a parent would otherwise have to picture their hands or the
  // baby's position; the rest of the steps are a plain numbered list with room for the words.
  // Nov 22: the steps read as full sentences, the way you'd explain it to a friend (q.say), not a bold title plus a fragment.
  const keySteps = (st, kp, say, notes) => `<div class="hub-card care-keysteps">${kp ? `<figure class="care-keyphoto"><img src="assets/care/${kp[0]}.jpg?v=1" alt="${F(kp[1])}" loading="lazy"></figure>` : ''}<ol class="is-say${say && Array.isArray(say[0]) ? ' is-photo' : ''}">${say ? say.map(t => Array.isArray(t) ? `<li><span class="care-stepph"><img src="assets/care/${t[0]}.jpg?v=2" alt="" loading="lazy"></span><span class="care-steptx">${F(t[1])}</span></li>` : `<li>${F(t)}</li>`).join('') : st.map(t => `<li><b>${F(t[1])}</b>${t[2] ? `<span>${F(t[2])}</span>` : ''}</li>`).join('')}</ol>${(notes || []).map(n => `<p class="care-keynote"><b>${F(n[0])}</b> ${F(n[1])}</p>`).join('')}</div>`;
  window.__careKeySteps = keySteps;
  // Nov 22 (Yarden's mockup as inspiration): a how-to shows the one move that's hard to picture in a big labeled photo,
  // says it in the caption, then gives 2–3 short steps. Labels use Safety's dot-and-pill style.
  const showCard = sh => `<div class="hub-card care-show"><figure class="care-show-photo"><img src="assets/care/${sh.img}.jpg?v=1" alt="${F(sh.alt)}" loading="lazy">${(sh.pins || []).map(([l, x, y, side]) => `<span class="sf-pin sf-pin-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(l)}</span></span>`).join('')}</figure><p class="care-show-cap"><b>${F(sh.cap[0])}</b> ${F(sh.cap[1])}</p>${sh.note ? `<p class="care-show-cap is-note"><b>${F(sh.note[0])}</b> ${F(sh.note[1])}</p>` : ''}</div>`;
  // Nov 22 (Yarden: match Outings, Health, Feeding, Childcare): steps are Feeding's numbered icon tiles, a few words each,
  // with at most two short notes inside the same card. Old [title, line] steps still render as a list.
  // Nov 22 (Yarden's mockups): simple steps are numbered rows (title + one line); icon tiles cramped the words.
  const moves = (mv, notes) => { if (!mv || !mv.length) return ''; notes = (val(notes) || []).map(n => n.length === 2 ? ['', n[0].replace(/,$/, ''), n[1]] : n);
    if (mv[0].length === 3 && !/^photo:/.test(mv[0][0])) mv = mv.map(m => [m[1], m[2]]);
    // Nov 22 (Yarden): a physical move gets a photo per step, as numbered photo rows; each photo does a different job
    // from the main one above it (that one shows the hold or setup, these show the movement).
    if (/^photo:/.test(mv[0][0])) { let n = 0; const rows = H().TPLB.photoRows(mv.map(([ph, t, sub]) => [ph.slice(6), t, sub])).replace('class="ph-rows"', 'class="ph-rows care-photosteps"').replace(/<span class="ph-sign-txt"><b>/g, m => m + `<span class="care-stepn">${++n}</span>`);
      const ul = notes.length ? `<ul class="tpl-notes">${notes.map(([, t, sub]) => `<li><b style="color:#302d3c">${F(t)}${/[?!.]$/.test(t) ? '' : '.'}</b> ${F(sub)}${/[?!.]$/.test(sub) ? '' : '.'}</li>`).join('')}</ul>` : '';
      return rows.slice(0, rows.lastIndexOf('</section>')) + ul + '</section>'; }
    return mv[0].length === 3 ? TB.noted(TB.tiles(mv, true), notes) : keySteps(mv.map(m => [null, m[0], m[1]]), null, null, notes.map(n => [n[1], n[2]])); };
  // Nov 22 (Yarden): every how-to in the same order: the photo, what to have nearby, a few steps, one thing
  // that's good to know, then how to keep {o} safe.
  const nearby = items => items && items.length ? `<p class="care-near-h">${F('Have nearby')}</p><div class="care-near">${items.map(t => `<span>${F(t)}</span>`).join('')}</div>` : '';
  const goodLine = g => g ? `<p class="care-good"><b>${F('Good to know:')}</b> ${F(g)}</p>` : '';
  const showPage = q => { const sh = val(q.show); return TB.top(q, q.why)
      + TB.section(val(q.pictureTitle) || 'At a glance', q.picture ? q.picture() : '')
      + TB.section(sh.t, showCard(sh))
      + nearby(val(q.nearby))
      + TB.section(q.movesT || 'Do it in a few steps', moves(val(q.moves), val(q.movesNotes)))
      + goodLine(val(q.good))
      + (q.full ? `<div class="hub-list care-link">${rowK('diapers', 'The full change, step by step', 'Fresh one under, wipe, fasten', `openPage('chg:${CAT}:d:h:diapers:1')`)}</div>` : '')
      + TB.section(q.tipsTitle || 'Keep {o} safe', TB.rows(val(q.tips || q.safe)) + (q.link ? TB.link(val(q.link)) : ''))
      + (q.urgent ? hubUrgent(F(val(q.urgent)), 'Call 911 right away') : '')
      + TB.section('Watch how', TB.video(q.video)); };
  window.__careShowPage = showPage; window.__careShowCard = showCard; window.__careMoves = moves;
  const TEMPLATES = {
    expect: q => { const n = val(q.normal); return TB.top(q, q.why)
      + TB.section('What’s normal', TB.noted(Array.isArray(n) ? TB.tiles(n, false) : n, q.normalNotes))
      + (q.show && !window.__stepsAll ? TB.section(val(q.show).t, showCard(val(q.show))) + TB.section(q.movesT || 'Steps', moves(val(q.moves), val(q.movesNotes))) : TB.section('What to do', q.say ? keySteps(null, null, val(q.say), val(q.sayNotes)).replace('is-say is-photo', 'is-say is-photo no-num') : Array.isArray(q.do) ? TB.noted(TB.tiles(q.do, false), q.doRows) : TB.card(q.do, q.doRows))) + (q.extra ? q.extra() : '')
      + TB.section('Watch how', TB.video(q.video))
      + callsCard(q.calls); },
    howto: q => { if (q.show && !window.__stepsAll) return showPage(q); const st = val(q.steps), ordered = q.ordered !== false; return TB.top(q, q.why)
      + TB.section(val(q.pictureTitle) || 'At a glance', q.picture ? q.picture() : '')
      + nearby(val(q.need))
      // Nov 22: the same shapes as the show-and-tell pages: numbered rows for steps, icon rows for things to do in any order.
      + TB.section(ordered ? 'Do it in a few steps' : 'What to do', (q.keyPhoto || q.say) && ordered && !window.__stepsAll ? TB.noted(keySteps(st, val(q.keyPhoto), val(q.say), val(q.sayNotes)), q.stepsNotes)
        : st && st.length && /^photo:/.test(st[0][0]) ? TB.noted(TB.tiles(st, ordered), q.stepsNotes) : ordered ? moves(st, q.stepsNotes) : TB.rows(st) + goodLine((val(q.stepsNotes) || []).map(n => n[1] + '. ' + n[2]).join(' '))) + (q.extra ? q.extra() : '')
      + TB.section(q.tipsTitle || 'Keep {o} safe', TB.rows(q.tips || q.safe) + (q.link ? TB.link(val(q.link)) : ''))
      + (q.urgent ? hubUrgent(F(val(q.urgent)), 'Call 911 right away') : '')
      + TB.section('Watch how', TB.video(q.video)); },
    // Nov 21: the header keeps its small drawing; the real photo goes in "What it looks like", where the parent compares.
    check: q => { let t = TB.top(q, q.why); const mid = q.where ? ({ newborn: 'milia', yeast: 'diaper' }[q.where] || q.where) : '';
      // Nov 22 (Yarden's inspiration): a rash page leads with a big labeled photo of the real thing, captioned with where it
      // shows up and what it looks like; "What helps" is rows with a full sentence; a "Not quite it?" link points to the look-alike.
      const big = q.where && RASH_IMG[q.where];
      let fig;
      if (big) fig = window.__careShowCard({ img: 'rash-' + q.where, alt: RASH[q.where] ? RASH[q.where].t : '', pins: [big], cap: [ZONE_WORDS[q.where] + '.', LOOKS[q.where] + '.'] });
      else if (q.where === 'diaper' || q.where === 'yeast') fig = diaperVs();
      else {
        window.__carePhotoOff = true; const m = mid && window.careMini ? careMini(mid) : ''; window.__carePhotoOff = false;
        const ph = mid && window.careMini ? careMini(mid) : '', photo = /<img/.test(ph) ? ph.replace('care-see-photo', 'care-map-photo') : '';
        fig = q.where ? tellMap(q.where) : q.figure ? q.figure() : q.signs ? TB.tiles(val(q.signs), false) : '';
        if (photo && q.where) fig = fig.replace(/<svg viewBox="0 0 160 190"[\s\S]*?<\/svg>/, photo);
        if (q.tellTiles && fig && window.__hub && window.__hub.TPLB.minis) fig = window.__hub.TPLB.minis(fig, val(q.tell), CAT); else fig = TB.noted(fig, q.tell);
      }
      const vsTitle = q.where === 'diaper' || q.where === 'yeast' ? 'Spot the difference' : '';
      const nq = q.where && NOT_QUITE[q.where];
      return t + TB.section(vsTitle || q.tellTitle || (q.verdict ? 'What it looks like' : 'How to tell'), big ? TB.noted(fig, q.tell) : fig)
        + TB.section('What helps', q.where || q.helpsRows ? TB.rows(val(q.helps)) + (q.helpsNotes ? `<div class="hub-card care-help-note">${(val(q.helpsNotes) || []).map(n => `<p><b>${F(n[1])}</b> ${F(n[2])}</p>`).join('')}</div>` : '') : TB.noted(TB.tiles(val(q.helps), false), q.helpsNotes))
        + (nq ? `<div class="hub-list fd-plist care-notquite"><button class="hub-row fd-prow" onclick="${cgo('rash:' + nq[0])}"><span class="fd-thumb">${RASH_IMG[nq[0]] ? `<img src="assets/care/rash-${nq[0]}.jpg?v=1" alt="" loading="lazy">` : `<span class="care-nq-ic">${hubArt('diaper', CAT)}</span>`}</span><span class="hub-row-copy"><b>${F('Not quite it? ' + nq[1])}</b><small>${F(nq[2])}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>` : '')
        + callsCard(q.calls); }
  };
  /* ---------- Nov 22 (Yarden's mockups): two templates for every Everyday care page ----------
     How to:        header, ONE large photo (corner tags that never cover a face) with a "what to look at" strip,
                    Have nearby, Do it in a few steps, Good to know, Keep {o} safe.
     What to know:  header card, See what it looks like (one photo, caption on it), What you may notice,
                    What helps, When to call.
     The same order on every page, so a parent learns it once. */
  const CT_CHECK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const ctSent = t => { t = F(val(t) || ''); return !t ? '' : /[.?!]$/.test(t) ? t : t + '.'; };
  // Which part of each 4:3 photo stays in the 16:10 frame (0% keeps the top): faces stay whole, and on a look photo the
  // thing to recognize sits above the caption.
  const CT_POS = { 'show-tub': '40%', 'show-paste': '50%', 'show-gums': '0%', 'show-brush': '10%', 'show-diaper': '15%', 'show-sun': '20%', 'show-crib': '20%', 'show-wriggle': '30%',
    'rash-newborn': '100%', 'rash-acne': '80%', 'rash-eczema': '60%', 'rash-heat': '75%', 'rash-drool': '75%', 'rash-cradle': '0%', 'look-yellow': '40%', 'look-eyes': '40%', 'look-teething': '30%', 'look-nose': '45%' };
  const ctImg = (img, alt) => `<img src="assets/care/${img}.jpg?v=5" alt="${F(alt || '').replace(/"/g, '&quot;')}" loading="lazy" style="object-position:50% ${CT_POS[img] || '35%'}">`;
  const ctHead = (q, kind) => `<header class="ct-head"><p class="ct-eyebrow">${F((val(q.topic) || LABEL[q.k]) + ' · ' + kind)}</p><h1>${F(val(q.title))}</h1>${val(q.why) ? `<p>${F(val(q.why))}</p>` : ''}</header>`;
  const ctPhoto = sh => `<section class="ct-photo-card"><figure class="ct-photo">${ctImg(sh.img, sh.alt)}${(val(sh.tags) || []).map(([l, at]) => `<span class="ct-tag is-${at}"><i></i>${F(l)}</span>`).join('')}</figure>`
    + `<div class="ct-strip"><b>${F('✦ ' + sh.t)}</b><span>${F(val(sh.line))}</span></div></section>`;
  const ctSteps = mv => `<ol class="ct-steps">${mv.map(m => { const [t, sub] = m.length === 3 ? [m[1], m[2]] : m; return `<li><b>${F(t)}</b>${sub ? `<span>${ctSent(sub)}</span>` : ''}</li>`; }).join('')}</ol>`;
  const ctGood = g => g ? `<p class="ct-good"><b>${F('Good to know:')}</b> ${ctSent(g)}</p>` : '';
  const ctSafe = rows => { rows = (val(rows) || []).filter(Boolean); return rows.length ? `<section class="ct-safe"><i>${CT_CHECK}</i><div><b>${F('Keep {o} safe')}</b>${rows.map(r => `<p><b>${ctSent(r[1])}</b>${r[2] ? ' ' + ctSent(r[2]) : ''}</p>`).join('')}</div></section>` : ''; };
  const ctH2 = t => `<h2 class="ct-h2">${F(t)}</h2>`;
  const ctFull = `<div class="hub-list">${rowK('diapers', 'The full diaper change', 'Start to finish, step by step', `openPage('chg:${CAT}:d:h:diapers:1')`)}</div>`;
  /* Nov 22 (Yarden's how-to mockup): labels that point. Each label sits in a corner and a soft white arrow curves to the
     spot it names, so it teaches without covering a face. sh.call = [[text, corner, x%, y%], ...]. */
  const CT_START = { tl: [80, 56], tr: [320, 56], bl: [80, 244], br: [320, 244] };
  const ctArrows = calls => `<svg class="ct-arrows" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="ctah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#fff"/></marker></defs>${calls.map(([, at, x, y]) => {
      const [sx, sy] = CT_START[at], ex = x * 4, ey = y * 3, mx = (sx + ex) / 2, my = (sy + ey) / 2, dx = ex - sx, dy = ey - sy, bend = at === 'tl' || at === 'br' ? 0.25 : -0.25;
      return `<path d="M${sx} ${sy} Q${(mx - dy * bend).toFixed(0)} ${(my + dx * bend).toFixed(0)} ${ex} ${ey}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" marker-end="url(#ctah)" filter="drop-shadow(0 1px 2px rgba(0,0,0,.35))"/>`; }).join('')}</svg>`;
  const ctPhoto2 = sh => { const calls = val(sh.call) || []; return `<figure class="ct-hero">${ctImg(sh.img, sh.alt)}${calls.length ? ctArrows(calls) : ''}${calls.map(([l, at]) => `<span class="ct-callout is-${at}">${F(l)}</span>`).join('')}</figure>`; };
  // "Have nearby" as small icons, the way the mockup shows it.
  const NEAR_ICON = { 'Towel': 'towel', 'Washcloth': 'folded', 'Warm water': 'basin', 'Bowl of warm water': 'basin', 'Clean diaper': 'diaper', 'Diaper': 'diaper', 'Little tub': 'bath', 'Mild soap': 'soap', 'Clean clothes': 'shirt',
    'Non-slip mat': 'mat', 'Unscented wipes': 'folded', 'Wipes': 'folded', 'Zinc diaper cream': 'soap', 'Small toy': 'toy', 'Toy': 'toy', 'Bath toys': 'duck', 'Pull-on diaper': 'diaper', 'Nail clippers or a file': 'nail',
    'Good light': 'idea', 'Soft cloth': 'folded', 'Water': 'drop', 'Soft toothbrush': 'tooth', 'Fluoride toothpaste': 'soap', 'Stroller canopy': 'stroller', 'Light layers': 'shirt', 'Wide-brim hat': 'sun', 'Sunscreen, SPF 30+': 'soap', 'Changing pad': 'mat', 'Diaper cream': 'soap', 'Small nail clippers or a file': 'nail' };
  const ctNear = items => `<div class="ct-near">${items.map(t => `<span><i>${hubArt(NEAR_ICON[t] || 'heart', CAT)}</i><small>${F(t)}</small></span>`).join('')}</div>`;
  // Steps: a small photo of the move where one exists (each shows something the big photo doesn't), else an icon.
  const ctSteps2 = mv => `<ol class="ct-steps2">${mv.map(([th, t, sub], i) => `<li><span class="ct-th">${/^photo:/.test(th) ? `<img src="assets/${th.slice(6)}.jpg?v=5" alt="" loading="lazy">` : `<i>${hubArt(th, CAT)}</i>`}</span><span class="ct-tx"><b><em>${i + 1}</em>${F(val(t))}</b>${sub ? `<small>${ctSent(sub)}</small>` : ''}</span></li>`).join('')}</ol>`;
  const ctRoutine = r => `<section class="ct-routine"><b>${CT_MOON}${F(r.t)}</b><div>${r.items.map(([ic, l], i) => `${i ? '<span class="ct-arr" aria-hidden="true">→</span>' : ''}<span><i>${hubArt(ic, CAT)}</i><small>${F(l)}</small></span>`).join('')}</div></section>`;
  const CT_MOON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>';
  const CT_BULB = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"/></svg>';
  const ctGood2 = g => { g = (Array.isArray(g) ? g : [g]).filter(Boolean); return g.length ? `<section class="ct-goodcard"><i>${CT_BULB}</i><div><b>${F('Good to know')}</b>${g.map(t => `<p>${ctSent(t)}</p>`).join('')}</div></section>` : ''; };
  const CT_GUIDE = ['#e3f1f7', '#2a6078'];
  const ctNotes2 = n => { n = (n || []).filter(Boolean); return n.length ? `<div class="ct-notes">${n.map(([b, t]) => `<p><b>${ctSent(b)}</b> ${ctSent(t)}</p>`).join('')}</div>` : ''; };
  const ctTop = (k, ctx, t, lead, verdict) => head(k, ctx, t, lead, verdict).replace(/--area:[^;]+;--area-ink:[^"]+/, `--area:${CT_GUIDE[0]};--area-ink:${CT_GUIDE[1]}`);
  const howtoPage = q => { const sh = val(q.show), mv = val(q.moves) || [], near = val(q.nearby) || [];
    return `<div class="ct-page is-howto">` + ctTop(q.k, (val(q.topic) || LABEL[q.k]) + ' · How to', val(q.title), val(q.why)) + (sh ? ctPhoto2(sh) : '') + (q.routine ? ctRoutine(val(q.routine)) : '')
      + (near.length ? ctH2('Have nearby') + ctNear(near) : '')
      + (mv.length ? ctH2(q.movesT || 'Do it in a few steps') + `<div class="ct-stepcard">${ctSteps2(mv)}${ctNotes2((val(q.notes) || []).slice(q.safeN || 0))}</div>` : '')
      + (q.full ? ctFull : '') + (q.link && !q.full ? `<button class="ct-alt" onclick="openPage('chg:${CAT}:d:${val(q.link)[2]}')">${F('Red skin? See diaper rash or yeast')} <span aria-hidden="true">›</span></button>` : '')
      + ((val(q.notes) || []).slice(0, q.safeN || 0).length ? ctH2('Keep {o} safe') + `<div class="ct-safecard">${ctNotes2(val(q.notes).slice(0, q.safeN))}</div>` : '')
      + (q.video ? ctH2('Watch how') + TB.video(q.video) : '') + `</div>`; };
  const ctLook = (img, cap, alt) => `<figure class="ct-look" id="ct-look">${ctImg(img, alt || cap)}<figcaption>${ctSent(cap)}</figcaption></figure>`;
  // The photo caption says where and what; these two tiles add when and how it behaves, so nothing repeats.
  const NOTICE = { acne: [['Red or white bumps, no itch'], ['Worse when {s’s} warm or fussy']], cradle: [['Sometimes on the brows and behind the ears'], ['No itch, and no fuss']],
    peeling: [['In the first weeks'], ['No cracks or pain']], diaper: [['Red where the diaper rubs'], ['The skin folds stay clear']], yeast: [['Deep in the skin folds'], ['Still there after 2–3 days of zinc cream']],
    eczema: [['Itchy, rough skin'], ['Also on the arms and legs']], heat: [['After getting hot or sweaty'], ['On the neck, chest and in creases']], newborn: [['Tiny white dots that don’t itch'], ['Pink patches on the eyelids or the back of the neck']],
    strawberry: [['A raised red patch'], ['Grows for a few months, then fades']], drool: [['Also on the neck and cheeks'], ['Worse on drooly days']] };
  // Nov 22 (Yarden: "why do these look less pretty"): the mockup's pages are light because every block is short:
  // one-line tiles, one-line helps, and the call card is one or two lines, not a list.
  const lowerFirst = t => /^(I|AAP|OK)\b/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1);
  const joinOr = a => a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ', or ' + a[a.length - 1];
  /* Nov 23: When to call is the same card as Feeding and Sleep: the phone icon, "Call your pediatrician if:" and one
     short line of a few-word signs, then "Call right away if:" and "Call 911 if:" in red, all inside the one card. */
  const ctFever = () => (!live() || careAge() < 3) ? 'a rectal temperature of 100.4°F or higher, or under 97.5°F' : careAge() < 6 ? 'a fever of 101°F or higher' : 'a fever of 103°F or higher';
  const ctCalls = c => { c = val(c); if (!c) return ''; const items = (val(c.ped) || []).filter(Boolean); if (!Array.isArray(items)) return callsCard(c);
    const under3 = !live() || careAge() < 3, urgent = [], plain = [];
    items.forEach(x => { if (x === 'FEVER') (under3 ? urgent : plain).push(ctFever());
      else if (/\. Call right away$/.test(x)) urgent.push(lowerFirst(x.replace(/\. Call right away$/, ''))); else plain.push(lowerFirst(x)); });
    const line = (label, a, cls) => a.length ? `<p${cls ? ` class="${cls}"` : ''}><b>${F(label)}</b> ${F(a)}${/[.?!]$/.test(a) ? '' : '.'}</p>` : '';
    return ctH2('When to call') + `<section class="care-calls is-titled"><span class="care-calls-ico">${PHONE}</span><div>`
      + line('Call your pediatrician if:', joinOr(plain)) + line('Call right away if:', joinOr(urgent), 'is-urgent')
      + (c.now ? line('Call 911 if:', lowerFirst(val(c.now)), 'is-urgent') : '') + (c.note ? `<p>${F(val(c.note))}</p>` : '')
      + (items.includes('FEVER') ? `<button class="ct-alt is-call" onclick="openPage('chg:Health:d:sick-rectal')">${F('How to take {p} temperature')} <span aria-hidden="true">›</span></button>` : '')
      + `</div></section>`; };
  const knowPage = (q, o) => `<div class="ct-page is-know">` + ctTop('look', (val(q.eyebrow) || LABEL[q.k]) + (val(q.eyebrow) === 'Is this normal?' ? '' : ' · What to know'), val(q.title), val(q.why), val(q.verdict))
    + (o.photo ? ctH2(o.photoTitle || 'See what it looks like') + o.photo : '')
    + (o.notice && o.notice.length ? ctH2('What you may notice') + `<div class="ct-notice">${o.notice.slice(0, 2).map(t => `<div>${F(t)}</div>`).join('')}</div>` : '')
    + (o.steps && o.steps.length ? ctH2(o.helpsTitle || 'What helps') + `<div class="ct-stepcard">${ctSteps2(o.steps)}</div>` : '')
    + (!(o.steps && o.steps.length) && o.helps && o.helps.length ? ctH2(o.helpsTitle || 'What helps') + `<ul class="ct-helps">${o.helps.slice(0, 3).map(t => `<li><i>${CT_CHECK}</i><span>${F(t)}</span></li>`).join('')}</ul>` : '')
    + (val(q.safe) ? ctH2('Keep {o} safe') + `<div class="ct-safecard"><div class="ct-notes">${val(q.safe).map(([b, t]) => `<p><b>${F(b)}.</b> ${F(t)}.</p>`).join('')}</div></div>` : '')
    + (o.alt || '') + ctCalls(q.calls) + `</div>`;
  const ctNotes = n => (val(n) || []).filter(Boolean).map(x => x.length === 3 ? ctSent(x[1]) + ' ' + ctSent(x[2]) : ctSent(x[0]) + ' ' + ctSent(x[1])).join(' ');
  TEMPLATES.howto = q => howtoPage(q);
  const oldCheck = TEMPLATES.check;
  const titles = a => { const v = val(a); return !v ? [] : !Array.isArray(v) ? [v] : v; }; const titlesOf = a => titles(a).filter(Boolean).map(x => Array.isArray(x) ? (x.length === 3 ? x[1] : x[0]) : x);
  TEMPLATES.check = q => { const w = q.where, nq = w && NOT_QUITE[w];
    const LOOK_CAP = { acne: 'Small bumps on the cheeks and nose', cradle: 'Greasy, yellow flakes on the scalp', eczema: 'Dry, rough patches. On darker skin, they can look brown, purple or gray', heat: 'Tiny red bumps where it’s warm',
      newborn: 'Tiny white dots on the nose and cheeks', peeling: 'Dry, flaky skin on the hands and feet', drool: 'Red, chapped skin on the chin', strawberry: 'Most often on the face, scalp, chest or back' };
    // Nov 24 (Everyday care): newborn marks are three different things, so each gets its own photo.
    const photo = w === 'newborn' ? H().TPLB.photoGrid([['care/rash-newborn', 'White dots', 'Milia, on the nose and cheeks'], ['care/mark-stork', 'Pink patches', 'Eyelids or the back of the neck'], ['care/mark-slate', 'Blue-gray patches', 'Birthmarks, often on the back']]) : w && RASH_IMG[w] ? ctLook('rash-' + w, LOOK_CAP[w], RASH[w] && RASH[w].t)
      : (w === 'diaper' || w === 'yeast') ? diaperVs() : q.lookImg ? ctLook(q.lookImg, val(q.lookCap)) : q.figure ? q.figure() : '';
    const notice = val(q.notice) || (NOTICE[w] ? NOTICE[w].map(x => x[0]) : titlesOf(q.signs || q.tell));
    // Nov 24 (Everyday care): the "not quite it?" link is a row, like every other way out of a page.
    const alt = nq ? `<div class="hub-list fd-plist care-notquite"><button class="hub-row fd-prow" onclick="${cgo('rash:' + nq[0])}"><span class="fd-thumb">${RASH_IMG[nq[0]] ? `<img src="assets/care/rash-${nq[0]}.jpg?v=1" alt="" loading="lazy">` : `<span class="care-nq-ic">${hubArt('diaper', CAT)}</span>`}</span><span class="hub-row-copy"><b>${F('Not quite it? ' + nq[1])}</b><small>${F(nq[2])}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>` : '';
    return knowPage(q, { photo, photoTitle: (w === 'diaper' || w === 'yeast') ? 'Spot the difference' : q.lookTitle, notice, helps: val(q.helpsShort) || titlesOf(q.helps), steps: val(q.helpSteps), alt }); };
  TEMPLATES.expect = q => { const n = val(q.normal);
    return knowPage(q, { photo: q.lookImg ? ctLook(q.lookImg, val(q.lookCap)) : typeof n === 'string' ? n : '',
      notice: val(q.notice) || (Array.isArray(n) ? titlesOf(n) : []), helps: val(q.helpsShort) || titlesOf(val(q.moves) && val(q.moves).length ? q.moves : q.do), helpsTitle: q.helpsTitle, steps: val(q.helpSteps), alt: q.extra ? q.extra() : '' }); };
  const tplPage = q => { const c = CT_GUIDE; return `<div class="quiet-category hub-page hub-detail care-v2 care-tpl is-${q.type}" data-overview="${CAT}" data-ss="1" style="${yearTheme(CAT)};--ss-bg:${c[0]};--ss-ink:${c[1]}">${detailPageTop(CAT)}${TEMPLATES[q.type](q)}</div>`; };
  const LOOKS = { acne: 'Small red or white bumps. On darker skin, darker bumps', cradle: 'Yellow patches that look greasy or crusty', peeling: 'Dry, flaky skin that peels off',
    diaper: 'Red, sore skin. On darker skin, darker or purple', yeast: 'Bright red, with small spots around the edges', eczema: 'Dry, rough, itchy patches. On darker skin, darker or gray',
    heat: 'Tiny red bumps. On darker skin, darker or skin-colored', newborn: 'White dots, pink blotches or blue-gray patches', drool: 'Red, chapped skin. On darker skin, darker patches' };
  const tellMap = id => rashMap(id).replace(/<figcaption>[\s\S]*<\/figcaption>/, `<figcaption><b class="tpl-where">${F(ZONE_WORDS[id] || '')}</b><span class="tpl-look">${F(LOOKS[id] || '')}</span></figcaption>`);
  const RASH_IMG = { acne: ['Small red or white bumps', 42, 66, 'b'], cradle: ['Greasy, yellowish flakes', 66, 14, 'l'], drool: ['Red, chapped skin', 55, 62, 'b'],
    eczema: ['Dry, rough patch', 62, 62, 'b'], heat: ['Tiny red bumps', 52, 32, 'r'], newborn: ['Tiny white dots', 52, 50, 'r'], peeling: ['Dry, peeling skin', 48, 34, 'r'],
    // Nov 24 flag 8: a real photo, on the face (most often the face, scalp, chest or back).
    strawberry: ['A raised red patch', 57, 22, 'r'] };
  const NOT_QUITE = { acne: ['heat', 'Heat rash', 'Tiny bumps where the skin gets sweaty'], heat: ['acne', 'Baby acne', 'Bumps on the cheeks and nose'],
    cradle: ['eczema', 'Eczema', 'Dry, rough patches that itch'], eczema: ['drool', 'Drool rash', 'Only where saliva touches the chin and neck'],
    drool: ['eczema', 'Eczema', 'Dry patches beyond the chin'], newborn: ['acne', 'Baby acne', 'Bumps that start around 2–4 weeks'],
    peeling: ['eczema', 'Eczema', 'Dry patches that keep coming back'], diaper: ['yeast', 'Possible yeast rash', 'Bright red in the folds, with spots at the edges'],
    yeast: ['diaper', 'Diaper rash', 'Red where the diaper rubs, the folds spared'] };
  const diaperVs = () => { const card = (id, t, chip, cls) => `<figure class="care-vs-card">${(rashMap(id).match(/<svg[\s\S]*?<\/svg>/) || [''])[0]}<figcaption><b>${F(t)}</b><span>${F(LOOKS[id])}.</span><em class="${cls}">${F(chip)}</em></figcaption></figure>`;
    return `<div class="care-vs">${card('diaper', 'Diaper rash', 'Usually better with zinc cream', 'is-ok')}${card('yeast', 'Possible yeast rash', 'Ask about an antifungal', 'is-ask')}</div>`; };
  const rc = ped => ({ calls: { ped } });
  const RASH_CALLS = { ped: ['A rash that spreads, oozes or blisters', 'FEVER'] };
  const RASH_911 = 'Tiny purple-red dots that don’t fade when you press on them.';
  const TPL = {
    't:diapers:0': { type: 'expect', k: 'diapers', title: 'Wet diapers go up day by day',
      why: 'From about day 6, six or more a day means {s’s} getting enough milk.',
      normal: () => TB.noted(wetChart(), [['diaper', 'A pink or orange stain is usually just pee', 'Still there after day 4? {S} may need more feeds']]),
      do: 'Feed often, 8–12 times a day, and keep a rough count of wet diapers this week.',
      calls: { ped: ['Fewer wet diapers than the chart', 'Black poop after day 5', 'White, gray or chalky poop. Call right away', 'Watery poop many times a day. Call right away'] } },
    't:diapers:2': { type: 'expect', k: 'diapers', title: 'Diapers stay the same, but rolling starts',
      why: 'Rolling can start any day, even on a changing table.',
      normal: [['drop', '6 or more wet a day', 'A sign {s’s} feeding well'], ['diaper', 'Poop looks the same', 'Until solids start']],
      do: 'Keep one hand on {o} the whole change. Have everything within reach first, or change {o} on the floor.',
      doRows: [['diaper', 'Size up when it leaks', 'Or leaves red marks, or the tabs don’t reach the middle'], ['diaper', 'Diaper rash?', 'Thick zinc cream at every change, and let the skin air out']],
      calls: { ped: ['A rash not better in 2–3 days', 'Blisters, pus or bright red folds'] } },
    'p:tub': { type: 'howto', k: 'bath', title: 'Tub baths can start',
      why: () => 'Once the cord' + (anatomy() !== 'girl' ? ' and any circumcision have' : ' has') + ' healed, about 3 baths a week is plenty.',
      need: ['A baby tub', 'A towel', 'A washcloth', 'Mild, unscented soap', 'A clean diaper and clothes'],
      say: [['tb-1', 'Set everything within reach, then fill the tub with about 2 inches of warm water.'],
        ['tb-3', 'Lower {o} in feet first, with one hand behind {p} head. A warm washcloth on {p} tummy keeps {o} cozy.'],
        ['tb-4', 'Wash {p} face first and {p} hair last, tipping {p} head back so water runs away from {p} eyes.'],
        ['tb-5', 'Lift {o} straight into the towel and pat {o} dry, creases too.']],
      sayNotes: [['Is the water right?', 'It should feel warm, not hot, on the inside of your wrist (about 100°F).'], ['How long?', 'Five to 10 minutes is plenty. Lots of babies cry in their first baths, and it gets easier for both of you.']],
      steps: [['photo:care/tb-1', 'Fill about 2 inches of water', 'About 100°F. Towel and washcloth in reach'], ['photo:care/tb-2', 'Wash the face first', 'Plain water, no soap'], ['photo:care/tb-3', 'Wash the body', 'A hand behind {p} head the whole time'], ['photo:care/tb-4', 'Wash the hair last', 'Shampoo 2 or 3 times a week'], ['photo:care/tb-5', 'Lift {o} into a towel', 'Pat dry, into every crease']],
      safe: [['hand', 'A hand on {o} the whole bath', 'To step away, take {o} with you'], ['thermo', 'Water about 100°F', 'Heater set at 120°F or lower']],
      video: ['VsUla1M7eHQ', 'Giving a tub bath', 'Nemours KidsHealth'] },
    'rash:acne': { type: 'check', k: 'skin', eyebrow: 'Is this normal?', title: 'Baby acne', verdict: () => RASH_VERDICT.acne, where: 'acne',
      why: 'It shows up around 2–4 weeks and clears on its own by 4–6 months.',
      helps: [['drop', 'Wash with plain water once a day', 'Then gently pat it dry.'], ['shield', 'Leave the bumps alone', 'Skip lotions, oils and acne creams.']],
      calls: rc(['Bumps filled with pus', 'Not fading by 6 months old', 'FEVER']).calls }
  };
  TPL['t:bath:1'] = TPL['p:tub'];
  /* ----- How-to pages ----- */
  TPL['p:sponge'] = { type: 'howto', k: 'bath', title: 'Sponge baths for now',
    why: 'They keep the cord dry until it falls off.',
    need: ['A towel', 'A washcloth', 'A bowl of warm water', 'Mild, unscented soap', 'A clean diaper and clothes'],
    say: [['sp-1', 'Lay {o} on the towel in a warm room, with everything in reach.'],
      ['sp-2', 'Wipe {p} face and the outside of {p} ears with plain water first.'],
      ['sp-3b', 'Uncover one part at a time, wash it, then wrap it back up.'],
      ['sp-4b', 'Wash the diaper area last, then pat {o} dry.']],
    sayNotes: [['Is the water right?', 'It should feel warm, not hot, on the inside of your wrist (about 100°F).'], ['How often?', 'Two or three times a week. In between, just wipe {p} face, neck and diaper area.']],
    steps: [['photo:care/sp-1', 'Set up in a warm room', 'Towel in reach, water about 100°F'], ['photo:care/sp-2', 'Wipe the face first', 'Plain water, no soap'], ['photo:care/sp-3b', 'Wash the body', 'One part at a time, the rest wrapped'], ['photo:care/sp-4b', 'Pat every crease dry', 'Diaper area washed last, then a fresh diaper']],
    safe: [['hand', 'A hand on {o} the whole time', 'Never step away on a raised surface']],
    video: ['uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth'] };
  TPL['t:bath:0'] = TPL['p:sponge'];
  TPL['t:bath:2'] = { type: 'howto', k: 'bath', title: 'A warm bath can be part of bedtime',
    why: 'A warm bath helps many babies wind down, and the same order every night helps most.',
    steps: [['photo:care/bt-1', 'Give a warm bath', 'About 100°F. Test it with your wrist'], ['photo:care/bt-2', 'Feed {o}', 'Lights low, voice calm'], ['photo:care/bt-3', 'Read a book', 'The same one every night is fine'], ['photo:care/bt-4', 'Lay {o} down awake', 'On {p} back, in {p} own sleep space']],
    say: [['bt-1', 'Start with a warm bath, then wrap {o} up snug in a towel.'], ['bt-2', 'Feed {o} with the lights low and your voice calm.'], ['bt-3', 'Read a short book. The same one every night is fine.'], ['bt-4', 'Lay {o} down drowsy but awake, on {p} back in {p} own sleep space.']],
    sayNotes: [['Is the water right?', 'It should feel warm, not hot, on the inside of your wrist (about 100°F).'], ['A bath every night?', 'About 3 a week is plenty. On other nights, go straight to the feed.']],
    safe: [['hand', 'A hand on {o} the whole bath', 'To step away, take {o} with you']] };
  TPL['t:bath:3'] = { type: 'howto', k: 'bath', title: 'Move to the big tub',
    why: 'Once {s} {sit|sits} steadily on {p} own, the big tub is fine.',
    steps: [['photo:care/bg-1', 'Put a non-slip mat in the tub', 'Before {s} {get|gets} in'], ['photo:care/bg-2', 'Fill it to {p} waist at most', 'And keep a hand on {o}']],
    need: ['A non-slip bath mat', 'A towel', 'A washcloth', 'Mild, unscented soap'],
    say: [['bg-1', 'Put the mat in the tub before {s} {get|gets} in.'], ['bg-2', 'Fill it with a few inches of water, no higher than {p} waist when {s} {sit|sits}.']],
    sayNotes: [['Is the water right?', 'It should feel warm, not hot, on the inside of your wrist (about 100°F).']],
    safe: [['hand', 'A hand on {o} the whole bath', 'To step away, take {o} with you'], ['stand', 'Sit {o} back down if {s} {stand|stands}', 'Standing in the tub leads to falls'], ['tub', 'Skip bath seats', 'They can tip, and babies slip out']] };
  // Nov 22: the rash itself lives on its own page (photos, the yeast look-alike, when to call); a how-to just points there.
  const diaperRash = window.__stepsAll ? [['diaper', 'Diaper rash? Thick zinc cream', 'At every change, then air it out']] : [];
  const rashLinkRow = ['Red skin under the diaper?', 'Thick zinc cream helps. Or is it yeast? See the difference', 'rash:diaper'];
  TPL['h:diapers:0'] = { type: 'howto', k: 'diapers', title: 'Change a diaper',
    why: 'About 8–12 a day in the first weeks, so you’ll get lots of practice.',
    steps: [['photo:care/dn-1', 'Lay {o} down, a hand on {o}', 'The fresh diaper open and ready'], ['photo:care/dn-2', 'Wipe front to back', 'Water or unscented wipes, then let the skin air-dry'], ['photo:care/dn-3', 'Slide the fresh one under and fasten', 'Below the cord stump, snug but two fingers fit at the waist']],
    need: ['A fresh diaper', 'Water or unscented wipes', 'Diaper cream, if there’s redness'],
    say: [['dn-1', 'Open the fresh diaper first, then lay {o} down with one hand on {o}.'], ['dn-2', 'Open the dirty diaper and wipe front to back.'], ['dn-3', 'Once the skin is dry, slide the fresh diaper under {o} and fasten it below the cord stump.']],
    sayNotes: () => [['Snug enough?', 'Two fingers should slip in at the waist.'], ...(anatomy() === 'boy' ? [['Little boy?', 'Point the penis down before you fasten, so the diaper doesn’t leak.']] : [])],
    tips: diaperRash.length ? diaperRash : undefined };
  TPL['h:diapers:1'] = { type: 'howto', k: 'diapers', title: 'Change a diaper',
    why: 'Change {o} when wet or dirty, about 6 or more a day.',
    steps: [['photo:care/dn-1', 'Lay {o} down, a hand on {o}', 'The fresh diaper open and ready'], ['photo:care/dn-2', 'Wipe front to back', 'Water or unscented wipes, then let the skin air-dry'], ['photo:care/dn-3', 'Slide the fresh one under and fasten', 'Snug, but two fingers fit at the waist']],
    need: ['A fresh diaper', 'Water or unscented wipes', 'Diaper cream, if there’s redness'],
    say: [['dn-1', 'Open the fresh diaper first, then lay {o} down with one hand on {o}.'], ['dn-2', 'Open the dirty diaper and wipe front to back.'], ['dn-3', 'Once the skin is dry, slide the fresh diaper under {o} and fasten it.']],
    sayNotes: () => [['Snug enough?', 'Two fingers should slip in at the waist.'], ...(anatomy() === 'boy' ? [['Little boy?', 'Point the penis down before you fasten, so the diaper doesn’t leak.']] : [])],
    tipsTitle: 'Good to know', tips: [['diaper', 'Leaks mean it’s time to size up', 'So do red marks on the legs'], ...diaperRash] };
  TPL['h:diapers:2'] = { type: 'howto', k: 'diapers', title: 'Change a wriggler',
    why: 'Rolling can start any day, so set up before {s} {go|goes} down.',
    steps: [['photo:care/wg-1', 'Get everything in reach', 'Wipes and a fresh diaper, before {s} {roll|rolls}'], ['photo:care/wg-2', 'Hand {o} a toy to hold', 'Or sing the same song each time'], ['photo:care/wg-3', 'Keep a hand on {o}', 'Never step away, even for a second'], ['photo:care/wg-4', 'Too wriggly? Change on the floor', 'On a mat, where {s} can’t fall']],
    need: ['A fresh diaper', 'Wipes', 'A small toy to hold'],
    say: [['wg-1', 'Get everything in reach before you lay {o} down.'], ['wg-2', 'Hand {o} the toy to hold, or sing the same song each time.'], ['wg-3', 'Keep one hand on {o} the whole change, even to reach for something.'], ['wg-4', 'Too wriggly for the table? Change {o} on a mat on the floor.']],
    tips: diaperRash.length ? diaperRash : undefined };
  const skinCare = { type: 'expect', k: 'skin', title: '{P} skin needs less care, not more',
    why: 'Washing too often, or too many products, can dry it out.',
    normal: [['drop', 'Peeling and dry patches', 'In the first weeks'], ['smile', 'Little spots and bumps', 'Come and go on their own'], ['sun', 'Blotchy when it’s cold', 'It evens out when warm']],
    do: [['bath', 'Plain warm water', 'About 3 baths a week'], ['towel', 'Pat dry', 'Into the creases'], ['drop', 'Cream on dry patches', 'Thick, fragrance-free'], ['shirt', 'Soft cotton', 'Washed fragrance-free']],
    calls: RASH_CALLS };
  [0, 1, 2, 3].forEach(v => { TPL[`h:skin:${v}`] = skinCare; });
  const gums = { type: 'howto', k: 'teeth', title: 'Wipe {p} gums morning and night',
    why: 'It makes brushing feel familiar once teeth come in.',
    steps: [['photo:care/gm-1', 'Wrap a damp cloth on your finger', 'Clean and soft'], ['photo:care/gm-2', 'Wipe the gums gently', 'Top and bottom, morning and night']],
    need: ['A clean, soft cloth'],
    say: [['gm-1', 'Wet the cloth and wrap it around your finger.'], ['gm-2', 'Gently wipe {p} top and bottom gums, morning and night.']],
    tipsTitle: 'Good to know', tips: [['drop', 'No toothpaste yet', 'Start with the first tooth'], ['smile', 'Tiny white gum bumps are normal', 'They go away on their own'], ['tooth', 'First tooth around 6 months', 'Keep wiping the gums until then']] };
  [0, 1, 2, 3].forEach(v => { TPL[`h:gums:${v}`] = gums; });
  TPL['p:brush'] = { type: 'howto', k: 'teeth', title: 'Brushing starts with the first tooth',
    why: 'No tooth yet is normal. Some babies get one close to their first birthday.',
    pictureTitle: 'How much toothpaste', picture: () => paste(),
    steps: [['photo:care/br-1', 'Add a rice-grain of toothpaste', 'Fluoride, on a soft baby toothbrush'], ['photo:care/br-2', 'Brush every tooth gently', 'Twice a day, once right before bed'], ['photo:care/br-3', 'Skip the rinse', 'A little swallowed is fine']],
    need: ['A small, soft toothbrush', 'Fluoride toothpaste'],
    say: [['br-1', 'Squeeze a rice-grain of toothpaste onto the brush.'], ['br-2', 'Gently brush every tooth, front and back.'], ['br-3', 'Skip the rinse. A little swallowed is fine at this amount.']],
    sayNotes: [['When to brush?', 'Twice a day, and always right before bed.']],
    extra: () => toothBtn(true),
    tipsTitle: 'Good to know', tips: [['bottle', 'No bottle in bed once teeth come', 'Milk overnight causes cavities'], ['tooth', 'First dentist visit', 'After the first tooth, by age 1']] };
  TPL['p:feet'] = { type: 'howto', k: 'clothes', eyebrow: 'Feet and shoes · usually around the first birthday', title: 'Bare feet first, soft shoes later',
    why: 'Bare feet help {o} balance and feel the floor while {s} {learn|learns} to walk.',
    steps: [['stand', 'Barefoot indoors', 'Or non-skid socks'], ['road', 'Shoes once walking', 'Outside only'], ['hand', 'Soft and flexible', 'Bends easily, with non-skid soles']], ordered: false,
    stepsNotes: [['', 'Good fit', 'A finger’s width at the big toe. Check it every month']],
    safe: [['shield', 'Skip walkers on wheels', 'They don’t help with walking, and lead to falls']] };
  TPL['t:clothes:3'] = TPL['p:feet'];
  const sunSafe = feeds => [['bottle', 'On hot days, offer extra milk feeds', feeds ? 'Milk is all {s} needs, no water yet' : 'And sips of water from a cup'], ['sun', 'Call your pediatrician about any sunburn under age 1', 'Even a mild one']];
  const SUN_911 = 'Hot, floppy or hard to wake, or not feeding. While you wait, move {o} to shade, undress {o} and sponge with cool water.';
  const shade = { type: 'howto', k: 'sun', title: 'Shade is the best protection from the sun',
    why: 'Under 6 months, skin burns fast and babies overheat easily.',
    pictureTitle: 'Sun protection by age', picture: () => sunAges(),
    steps: [['clock', 'Go out early or late in the day', 'The midday sun is the strongest'], ['shirt', 'Light, loose long sleeves', 'And a wide-brimmed hat'], ['stroller', 'Use the stroller canopy', 'Not a blanket over it. That traps heat']], ordered: false,
    safe: sunSafe(true), urgent: SUN_911 };
  const six = { type: 'howto', k: 'sun', title: () => careAge() >= 7 ? 'Shade first, then sunscreen on bare skin' : 'Start sunscreen once {s’s} 6 months',
    why: 'Shade and a hat still come first. Sunscreen covers the skin they don’t.',
    pictureTitle: 'Sun protection by age', picture: () => sunAges(),
    steps: [['photo:care/ss-1', 'Put it on before you go out', '15–30 minutes early'], ['photo:care/ss-2', 'Cover every bit of bare skin', 'Ears, feet and the back of the neck']],
    need: ['Broad-spectrum SPF 30 or more', 'A wide-brim hat'],
    say: [['ss-1', 'Put it on 15–30 minutes before you head out.'], ['ss-2', 'Cover every bit of bare skin, including ears, feet and the back of the neck.']],
    sayNotes: [['Which kind?', 'Mineral sunscreen is gentlest on baby skin. Skip sprays.']],
    safe: sunSafe(false), urgent: SUN_911 };
  TPL['t:sun:0'] = shade; TPL['t:sun:1'] = shade; TPL['t:sun:3'] = six; TPL['t:sun:2'] = () => careAge() < 6 ? shade : six;
  const nails = { type: 'howto', k: 'nails', title: () => stageNow() === 0 && live() ? 'Trim nails once or twice a week' : 'Trim nails once a week',
    why: 'They grow fast, and are sharp enough to scratch {p} face.',
    steps: [['photo:care/nl-1', 'Wait until {s} {are|is} asleep', 'Or drowsy after a feed. It’s the easiest time'], ['photo:care/nl-2', 'Press the finger pad back', 'So the clippers only catch nail'], ['photo:care/nl-3', 'Clip along the curve', 'Then file any sharp corners smooth']],
    need: ['Small nail clippers or scissors', 'A nail file'],
    say: [['nl-1', 'Trim while {s} {are|is} asleep or drowsy, when {p} hands are still.'], ['nl-2', 'Press the finger pad back, away from the nail, so you only catch nail.'], ['nl-3', 'Clip along the curve, then file any sharp corners smooth.']],
    sayNotes: [['Toenails?', 'Cut those straight across.']],
    tipsTitle: 'Good to know', tips: [['heart', 'A small nick happens to everyone', 'Press gently with a clean cloth']] };
  [0, 1, 2, 3].forEach(v => { TPL[`t:nails:${v}`] = nails; });

  /* ----- What to expect pages ----- */
  // Nov 22: the same show-and-tell as every how-to: the fold in a labeled photo, then two short steps.
  TPL.cord = { type: 'expect', k: 'cord', title: 'Keep the cord stump clean and dry',
    show: { t: 'See the fold', img: 'show-cord', alt: 'A parent folds the top of the diaper down below the cord stump',
      pins: [['Stump in the air', 52, 36, 'r'], ['Top folded down', 48, 66, 'r']], cap: ['Air helps it dry.', 'Fold the diaper down below the stump.'] },
    moves: [['drop', 'Clean only if dirty', 'Plain water, pat dry'], ['hand', 'Let it fall off', 'Even by a thread, don’t pull']],
    why: 'The stump dries up and falls off on its own, usually in 1–3 weeks.',
    normal: () => hubStageStrip({ title: 'The cord stump', items: [['cord', 'Birth', 'Clamped, then dries out'], ['clock', '1–3 weeks', 'Falls off by itself'], ['smile', 'Once it’s off', 'A small belly button scab']], nowIndex: -1, cat: CAT, caption: 'The cord stump dries and falls off on its own, usually in 1 to 3 weeks.' }),
    normalNotes: [['', 'A little crust, smell or a spot of blood is normal', 'Especially as it falls off']],
    do: [['photo:care/cd-1', 'Fold the diaper down', 'So the stump stays in the air'], ['photo:care/cd-2', 'Clean with plain water', 'Only if dirty, then pat dry'], ['photo:care/cd-3', 'Let it fall off', 'Even if it’s hanging on']],
    say: [['cd-1', 'Fold the top of the diaper down, so the stump stays in the air.'], ['cd-2', 'If it gets dirty, clean it with plain water and pat it dry.'], ['cd-3', 'Let it fall off on its own, even if it’s hanging on by a thread.']],
    video: ['qFPA-4A_8wY', 'Caring for the umbilical cord', 'Nemours KidsHealth'],
    calls: { ped: ['A yellow, smelly discharge', 'Redness spreading around it', 'Crying when you touch it', 'It’s still on after 3 weeks', 'FEVER'] } };
  TPL['t:diapers:1'] = { type: 'expect', k: 'diapers', title: 'Fewer poops can be normal',
    why: () => { const f = live() ? profile.feed : ''; return f === 'Formula' ? 'Formula-fed babies usually poop most days, just less than at first.' : f === 'Breast milk' ? 'From about 3–6 weeks, many breastfed babies poop less often, some only once a week.' : 'From about 3–6 weeks, poops often space out. Breastfed babies can go days between.'; },
    normal: [['diaper', 'Soft poop', 'Even days apart'], ['drop', '6 or more wet a day', 'Still the sign of enough milk']],
    do: [['diaper', 'Change when wet or dirty', 'About 6 or more a day'], ['leaf', 'Let the skin air out', 'Before a fresh diaper'], ['diaper', 'Size up when it leaks', 'Or red marks, or tabs that barely reach']],
    doRows: [['', 'Diaper rash?', 'Thick zinc cream at every change. Call if it lasts more than 2–3 days']],
    calls: { ped: ['Hard, pebble-like poop', 'Fewer than 6 wet diapers a day', 'A rash with blisters or pus'] } };
  // One idea per page: from 6 months, the diaper page is about changing a wriggler. Solids poop lives on the poop page.
  TPL['h:diapers:3'] = { type: 'howto', k: 'diapers', title: 'Change a wriggler',
    why: 'Rolling, crawling and pulling up make changes a two-handed job.',
    steps: [['photo:care/wg-1', 'Get everything in reach', 'Wipes and a fresh diaper first'], ['photo:care/wg-2', 'Hand {o} a toy to hold', 'Or sing the same song each time'], ['photo:care/wg-3', 'Keep a hand on {o}', 'Never step away, even for a second'], ['photo:care/wg-5', 'Pulling up? Change {o} standing', 'Pull-on diapers make it easy']],
    need: ['A pull-on diaper', 'Wipes', 'A small toy to hold'],
    say: [['wg-1', 'Get everything in reach before you start.'], ['wg-2', 'Hand {o} the toy to hold, or sing the same song each time.'], ['wg-3', 'Keep one hand on {o} the whole change, even to reach for something.'], ['wg-5', 'Once {s} {pull|pulls} up, try changing {o} standing, in a pull-on diaper.']],
    tips: diaperRash.length ? diaperRash : undefined };
  TPL['t:diapers:3'] = TPL['h:diapers:3'];

  // Nov 22: show-me versions of every how-to (one labeled teaching photo, a caption, 2–3 short steps).
  const WATER = ['Is the water right?', 'It should feel warm, not hot, on the inside of your wrist (about 100°F).'];
  Object.assign(TPL['p:sponge'], { eyebrow: 'Baths · How to', title: 'Sponge baths until the cord falls off',
    why: 'A dry stump heals faster, so the tub waits. Two or three a week is plenty.',
    show: { t: 'See how', img: 'show-sponge', alt: 'A parent washes one arm of a newborn who is wrapped in a towel',
      pins: [['One arm out', 52, 62, 'r'], ['The rest wrapped up', 84, 82, 'l']], cap: ['Keep {o} wrapped and warm.', 'Uncover one part at a time.'] },
    nearby: ['Towel', 'Washcloth', 'Warm water', 'Clean diaper'],
    moves: [['hand', 'Test the water', 'Warm on your wrist, about 100°F'], ['eye', 'Eyes, then face', 'Plain water, inner corner out'], ['drop', 'Then the body', 'Mild soap, diaper area last. Pat dry, creases too']],
    movesNotes: [], good: 'Between baths, just wipe the face, neck and diaper area. A wet cord stump just gets patted dry.' });
  Object.assign(TPL['p:tub'], { eyebrow: 'Baths · How to', title: 'Tub baths, with a steady hold',
    show: { t: 'See the hold', img: 'show-tub', alt: 'A parent cradles her baby’s head in one hand in a small tub, a washcloth over the tummy',
      pins: [['Hand behind the head', 30, 60, 'b'], ['Warm washcloth', 50, 88, 'r']],
      cap: ['About 2 inches of warm water.', 'Towel, washcloth and clean clothes within reach.'] },
    nearby: ['Towel', 'Washcloth', 'Mild soap', 'Clean clothes'],
    moves: [['photo:care/tb-lower', 'Lower {o} in feet first', 'Keep supporting the head and neck'], ['photo:care/tb-2', 'Wash face, then body', 'Plain water on the face, hair last'], ['photo:care/tb-5', 'Lift out and wrap up', 'Pat dry, creases too']],
    movesNotes: [], good: 'Five to 10 minutes is plenty, and crying at first is normal. Shampoo just 2 or 3 times a week.' });
  Object.assign(TPL['t:bath:3'], { eyebrow: 'Baths · What changes', title: 'Moving up to the big tub',
    why: 'Once {s} {sit|sits} steadily, the family tub is fine. A good setup is what keeps it safe.',
    show: { t: 'See the setup', img: 'show-bigtub', alt: 'A parent checks a few inches of water over a non-slip mat in a bathtub',
      pins: [['Non-slip mat', 22, 84, 'r'], ['A few inches of water', 32, 56, 'r']],
      cap: ['Shallow is safer.', 'No higher than {p} waist, sitting.'] },
    nearby: ['Non-slip mat', 'Towel', 'Washcloth'],
    moves: [['shield', 'Mat down first', 'So {s} can’t slide'], ['drop', 'Check the water', 'Warm on your wrist, about 100°F'], ['bath', 'Sit {o} away from the faucet', 'The spout gets hot. Drain the tub once {s’s} out']],
    movesNotes: [], good: 'Bath seats don’t make baths safer. They can tip, and babies slip out.',
    safe: [['hand', 'A hand on {o} the whole bath', 'To step away, take {o} with you'], ['stand', 'Sit {o} back down if {s} {stand|stands}', 'Standing in the tub leads to falls']] });
  Object.assign(nails, { eyebrow: 'Nails · How to', title: 'Trim tiny nails without nicking skin',
    why: () => (stageNow() === 0 && live() ? 'They grow fast, so plan on a trim once or twice a week.' : 'They grow fast, so plan on a trim about once a week.'),
    show: { t: 'See the finger position', img: 'show-nails', alt: 'A parent presses a baby’s finger pad back while clipping the nail',
      pins: [['Pad pressed back', 26, 30, 'r'], ['Just the white tip', 46, 48, 'r']],
      cap: ['Hold the finger steady.', 'Then the clippers only catch nail.'] },
    // Nov 22: the photo above shows the grip; these two show the moments around it, so no picture repeats.
    moves: [['photo:care/nl-1', 'Wait for a sleepy moment', 'Asleep or drowsy, hands still'], ['photo:care/nl-3', 'Clip along the curve', 'Then file any sharp corners. Toes go straight across']],
    nearby: ['Baby clippers or a file', 'Good light'],
    movesNotes: [], good: 'Sharp again already? That’s normal. A quick file every few days keeps the edges smooth.',
    tipsTitle: undefined, tips: undefined, safe: [['heart', 'If you nick the skin', 'Press gently with a clean cloth. It happens to everyone']] });
  const diaperShow = cord => ({ t: 'See the setup', img: 'show-diaper', alt: 'A parent keeps one hand on his newborn’s tummy, a fresh diaper open beside them',
    pins: [['Hand on {p} tummy', 57, 40, 'l'], ['Fresh diaper open', 80, 86, 'l']],
    cap: ['Everything within reach first.', 'Then a hand on {o} the whole time.'] });
  Object.assign(TPL['h:diapers:0'], { eyebrow: 'Diapers · How to', title: 'Diaper changes, start to finish', show: diaperShow(true),
    nearby: ['Clean diaper', 'Unscented wipes', 'Zinc cream'],
    moves: [['photo:care/dn-under', 'Fresh one under', 'Slide it in before you open the old one'], ['photo:care/dn-2', 'Wipe front to back', 'Old diaper’s front first, then wipes'], ['photo:care/dn-fasten', 'Old one out, fasten', 'Below the cord, two fingers at the waist']],
    // Nov 22: what surprises first-timers in the first weeks, said before they see it.
    good: () => anatomy() === 'boy' ? 'Point the penis down before you fasten. If he’s circumcised, a dab of petroleum jelly on the tip each change until it heals.'
      : anatomy() === 'girl' ? 'A little white discharge, or a spot of blood, in the first weeks is normal. It comes from pregnancy hormones.' : 'Let the skin air-dry for a moment before you fasten.',
    safe: [['hand', 'A hand on {o} the whole time', 'Never step away on a raised surface']],
    link: rashLinkRow });
  Object.assign(TPL['h:diapers:1'], { eyebrow: 'Diapers · How to', title: 'Diaper changes, start to finish', show: diaperShow(false),
    nearby: ['Clean diaper', 'Unscented wipes', 'Zinc cream'],
    moves: [['photo:care/dn-under', 'Fresh one under', 'Slide it in before you open the old one'], ['photo:care/dn-2', 'Wipe front to back', 'Old diaper’s front first, then wipes'], ['photo:care/dn-fasten', 'Old one out, fasten', 'Snug, two fingers at the waist']],
    good: () => anatomy() === 'boy' ? 'Point the penis down before you fasten, so the diaper doesn’t leak.' : 'Let the skin air-dry for a moment before you fasten.',
    safe: [['hand', 'A hand on {o} the whole time', 'Never step away on a raised surface']], link: rashLinkRow });
  const wriggleShow = { t: 'See the setup', img: 'show-wriggle', alt: 'A parent keeps a hand on her baby’s tummy while he holds a soft toy',
    pins: [['Toy in hand', 40, 70, 'b'], ['Hand on tummy', 72, 46, 'b']],
    cap: ['Keep one hand on {o}', 'the whole change.'] };
  Object.assign(TPL['h:diapers:2'], { eyebrow: 'Diapers · What changes', title: 'Diaper changes with a wriggler', show: wriggleShow,
    movesT: 'What’s different now', full: true,
    moves: [['toy', 'Something to hold', 'A toy, or the same song'], ['hand', 'A hand on the tummy', 'Before {s} {roll|rolls} away'], ['mat', 'Too wriggly?', 'Use a mat on the floor']], good: 'Leaks or red marks on the legs mean it’s time for the next size.',
    tipsTitle: undefined, tips: undefined, safe: [['hand', 'A hand on {o} the whole time', 'Never step away on a raised surface']], link: rashLinkRow });
  Object.assign(TPL['h:diapers:3'], { eyebrow: 'Diapers · What changes', title: 'Diaper changes with a wriggler', show: wriggleShow,
    movesT: 'What’s different now', full: true,
    moves: [['toy', 'Something to hold', 'A toy, or the same song'], ['mat', 'On the floor', 'Nowhere to fall'], ['stand', 'Pulling up?', 'Change {o} standing, in pull-ons']], good: 'Leaks or red marks on the legs mean it’s time for the next size.',
    tipsTitle: undefined, tips: undefined, safe: [['hand', 'A hand on {o} the whole time', 'Never step away on a raised surface']], link: rashLinkRow });
  Object.assign(TPL['t:bath:2'], { eyebrow: 'Baths · Bedtime', show: { t: 'See how it ends', img: 'show-crib', alt: 'A parent lays his drowsy baby on her back in a bare crib, in a sleep sack',
      pins: [['On {p} back', 66, 62, 'l'], ['Bare crib', 24, 84, 'r']],
      cap: ['Drowsy, not asleep.', 'On {p} back, in a bare crib.'] },
    movesT: 'Before that, a few steps',
    moves: [['bath', 'A short warm bath', 'About 100°F, warm on your wrist'], ['moon', 'A feed in dim light', 'Low lights, calm voice'], ['book', 'A short book', 'The same one every night is fine']],
    good: 'Two or three baths a week is enough. On other nights, skip straight to the feed.' });
  Object.assign(TPL['p:brush'], { eyebrow: 'Teeth · First tooth',
    show: { t: 'See how', img: 'show-brush', alt: 'A dad gently brushes his baby’s front teeth with a soft brush, the baby on his lap',
      pins: [['Soft brush', 46, 52, 'l']], cap: ['Sit {o} on your lap,', 'leaning back on you.'] },
    nearby: ['Soft toothbrush', 'Fluoride toothpaste'],
    moves: [['drop', 'Add a rice grain of paste', 'With fluoride. It protects new teeth'], ['tooth', 'Brush every tooth', 'Front and back, twice a day'], ['smile', 'Skip the rinse', 'A rice grain is fine to swallow']],
    good: 'The first dentist visit is after the first tooth, and by the first birthday.',
    tipsTitle: undefined, tips: undefined, safe: [['bottle', 'No bottle in bed once teeth come', 'Milk overnight causes cavities']] });
  Object.assign(gums, { eyebrow: 'Teeth · Before teeth', show: { t: 'See how', img: 'show-gums', alt: 'A parent wipes her baby’s gums with a damp cloth wrapped on her finger',
      pins: [['Damp cloth on a finger', 76, 52, 'l']], cap: ['Gentle is enough.', 'Morning and night, top and bottom.'] },
    nearby: ['Clean soft cloth', 'Water'],
    moves: [['drop', 'Wet the cloth', 'Plain water, no toothpaste yet'], ['hand', 'Wrap it on a finger', 'A soft edge against the gums'], ['smile', 'Wipe top and bottom', 'Gently, morning and night']],
    good: 'Tiny white bumps on the gums are normal. They go away on their own.', tipsTitle: undefined, tips: undefined });
  Object.assign(six, { eyebrow: 'Sun · From 6 months', show: { t: 'See where it goes', img: 'show-sun', alt: 'A parent rubs sunscreen on her baby’s cheek; the baby wears a wide-brim hat',
      pins: [['Wide-brim hat', 86, 30, 'l'], ['Sunscreen on cheeks', 60, 62, 'l']],
      cap: ['Shade and a hat come first.', 'Sunscreen covers the skin they don’t.'] },
    nearby: ['Broad-spectrum SPF 30+', 'Wide-brim hat'],
    moves: [['clock', 'Put it on early', '15–30 minutes before you go out'], ['hand', 'Cover bare skin', 'Face, ears, hands, feet, back of the neck'], ['sun', 'Put more on', 'Every 2 hours, and after water']],
    good: 'Mineral sunscreen is gentlest on young skin. Skip sprays.' });
  TPL['p:teething'] = { type: 'expect', k: 'teeth', title: 'Teething makes gums sore, not feverish',
    why: 'Drool, chewing and a few fussy days are the usual signs.',
    normal: [['drop', 'Lots of drool', 'A bib helps'], ['hand', 'Chewing on everything', 'Fingers, toys, even you'], ['clock', 'Fussy for a few days', 'Then it passes']],
    normalNotes: [['', 'First tooth', 'Often around 6 months, anywhere from 4 to 12']],
    do: [['hand', 'A clean finger', 'Rub the sore gums'], ['ring', 'A firm teething ring', 'Chilled, but never frozen'], ['shirt', 'A soft bib', 'Pat the drool dry']],
    doRows: [['', 'Skip numbing gels, necklaces and tablets', 'Ask your pediatrician before any pain medicine']],
    extra: () => toothBtn(false),
    calls: { ped: ['FEVER', 'Diarrhea or a runny nose'], note: 'Teething doesn’t cause these, so something else is going on.' } };
  const dress = { type: 'expect', k: 'clothes', title: 'Dress {o} in one more layer than you',
    why: 'Babies can’t warm or cool themselves well yet, so they need a little more than you.',
    normal: () => layers(), normalNotes: [['', 'No hats indoors', 'A hat is for going out'], ['', 'For sleep, snug pajamas and a sleep sack', 'No loose clothes, and no blankets']],
    do: [['hand', 'Feel the back of the neck', 'Sweaty: too warm. Cool: add a layer'], ['shirt', 'Snaps or zips', 'Never strings near the neck'], ['car', 'No puffy coats in the car seat', 'Buckle in, then a blanket on top']] };
  [0, 1, 2].forEach(v => { TPL[`t:clothes:${v}`] = dress; });
  TPL.after1 = { type: 'expect', k: 'teeth', eyebrow: 'After 1', title: 'Brushing and baths after 1',
    why: 'Not much changes in the toddler years.',
    normal: [['tooth', 'Brushing', 'Twice a day, a rice-grain smear'], ['bath', 'Baths', 'About 3 a week'], ['shirt', 'Shoes', 'Soft and flexible, once walking outside']],
    do: [['tooth', 'See a dentist', 'By age 1'], ['bottle', 'Never a bottle in bed', 'Milk on teeth causes cavities'], ['hand', 'A hand on {o}', 'In the bath, every time']] };

  /* ----- Is this normal? pages ----- */
  TPL['look-cord'] = { type: 'check', eyebrow: 'Is this normal?', k: 'cord', title: 'Crust or a little blood on the cord', verdict: ['ok', 'Usually normal'],
    why: 'It’s part of healing. A faint smell can be too; a bad smell means call.',
    signs: [['cord', 'Darkens and dries', 'It shrinks and gets hard'], ['drop', 'A spot or two of blood', 'When it falls off'], ['clock', 'Falls off', 'Usually in the first 3 weeks']],
    // Nov 21: a real photo of a healing stump, the same layout as the rash pages.
    figure: () => window.__careShowCard({ img: 'rash-cord', alt: 'A healing cord stump: dark, dry and a little crusty', pins: [['Dark and dry', 50, 42, 'r']], cap: ['Usually falls off in 1–3 weeks.', 'A spot or two of blood when it comes off is normal.'] }),
    helps: [['diaper', 'Fold the diaper down', 'So the stump stays dry'], ['drop', 'Clean with plain water', 'Only if dirty, then pat dry']],
    calls: { ped: ['A yellow, smelly discharge', 'Redness spreading around it', 'Crying when you touch it', 'It’s still on after 3 weeks', 'FEVER'] } };
  TPL['look-eyes'] = { type: 'check', eyebrow: 'Is this normal?', k: 'skin', title: 'Sticky eyes or a noisy nose', verdict: ['ok', 'Usually normal'],
    why: 'Most of it clears on its own with a little care at home.',
    signs: [['ear', 'Snuffly breathing', 'Usually dried milk or mucus, not a cold'], ['eye', 'A watery eye, not red', 'Often a blocked tear duct']],
    helps: [['towel', 'Sticky eyes', 'Wipe from the inside corner out'], ['drop', 'A stuffy nose', 'A few saline drops, then gentle suction']],
    calls: { ped: ['A red or swollen eyelid', 'Yellow-green goo with redness', 'A red lump near the inner corner of the eye'], now: 'Struggling to breathe, or lips turning blue.' } };
  TPL['look-yellow'] = { type: 'check', eyebrow: 'Is this normal?', k: 'skin', title: 'Yellow skin', verdict: ['watch', 'Common after the first day'],
    why: 'It’s called jaundice. Yellow in the first 24 hours needs a call right away.',
    signs: [['sun', 'Yellow on the face', 'Shows in the first days, then fades'], ['eye', 'On darker skin', 'Check the whites of the eyes and gums'], ['hand', 'Try the press test', 'Press the nose in daylight. Yellow as you lift? Call']],
    helps: [['bottle', 'Feed often', 'It helps clear the yellow'], ['steth', 'Your pediatrician checks it', 'Sunlight doesn’t treat it']],
    calls: { ped: ['Yellow spreading to the belly or legs', 'Yellow in the whites of the eyes', 'Fewer wet diapers', 'Any yellow in the first 24 hours. Call right away', 'Yellow and hard to wake, or not feeding well. Call right away'] } };
  const RASH_VERDICT = { acne: ['ok', 'Usually normal'], cradle: ['ok', 'Usually normal'], peeling: ['ok', 'Usually normal'], diaper: ['ok', 'Common'], yeast: ['watch', 'Needs a different cream'], eczema: ['watch', 'Common, and treatable'], heat: ['ok', 'Usually normal'], newborn: ['ok', 'Usually harmless'], strawberry: ['ok', 'Usually harmless'], drool: ['ok', 'Usually normal'] };
  const rashCheck = (id, helps, more) => Object.assign({ type: 'check', k: 'skin', eyebrow: 'Is this normal?', title: RASH[id].t, verdict: RASH_VERDICT[id], where: id, why: RASH[id].lead, helps, calls: RASH_CALLS }, more || {});
  TPL['rash:cradle'] = rashCheck('cradle', [['drop', 'Wash with water or a little mild shampoo', 'A few times a week is plenty.'], ['hand', 'Leave the flakes alone', 'They lift on their own. Picking can make the scalp sore.']],
    { calls: rc(['It spreads past the scalp', 'It looks red and weepy, or seems to itch']).calls, helpsNotes: [['', 'Stubborn flakes?', 'Rub in a little baby oil, wait a few minutes, brush gently with a soft brush, then wash the oil out']] });
  TPL['rash:peeling'] = rashCheck('peeling', [['bath', 'Keep baths short', 'Plain water is all the skin needs.'], ['drop', 'Moisturizer is optional', 'If you use one, pick a fragrance-free one.']], rc(['Cracked or bleeding skin', 'Still dry after a month']));
  TPL['rash:diaper'] = rashCheck('diaper', [['diaper', 'Change often and let the skin air out', 'A few minutes diaper-free helps it heal.'], ['shield', 'Use a thick zinc oxide cream', 'Spread it on thickly at every change.'], ['drop', 'Use gentle wipes', 'Or plain water, with no alcohol or fragrance while it heals.']],
    { calls: { ped: ['Not better in 2–3 days', 'Blisters, pus or bright red folds', 'FEVER'] } });
  TPL['rash:yeast'] = rashCheck('yeast', [['steth', 'Call your pediatrician', 'They may suggest an antifungal cream.'], ['diaper', 'Keep changing often', 'And give the skin some air.']], rc(['No better after a few days of cream', 'FEVER']));
  TPL['rash:eczema'] = rashCheck('eczema', [['bath', 'Keep baths short and lukewarm', 'Then smooth a thick, fragrance-free cream onto the damp skin.'], ['shirt', 'Go fragrance-free', 'For soap and laundry detergent, with soft cotton clothes.'], ['nail', 'Keep nails short', 'So scratching does less damage.']],
    { calls: { ped: ['Patches that crack or ooze', 'It keeps {o} up at night', 'Cream doesn’t help'], now: RASH_CALLS.now, nowLabel: 'Call 911' } });
  TPL['rash:heat'] = rashCheck('heat', [['home', 'Cool {o} down', 'Move somewhere cooler and take a layer off.'], ['shield', 'Skip creams on it', 'They trap heat against the skin.']], Object.assign({ why: 'It comes from sweat, and fades within a day or two of cooling down.' }, rc(['Not gone in 3 days', 'Bumps filled with pus', 'FEVER'])));
  TPL['rash:newborn'] = rashCheck('newborn', [['smile', 'Nothing to treat', 'They fade on their own.'], ['heart', 'Blue-gray patches aren’t bruises', 'Many fade by school age.']], rc(['A mark that’s raised, bleeds or grows fast', 'A bruise you can’t explain']));
  TPL['rash:strawberry'] = rashCheck('strawberry', [['eye', 'Nothing to do at home', 'Your pediatrician will keep an eye on it.'], ['steth', 'Mention it at the next checkup', 'So they can see how fast it grows.']],
    { where: null, lookImg: 'rash-strawberry', lookCap: 'Most often on the face, scalp, chest or back', why: 'Also called a hemangioma, it’s the most common birthmark in babies.', signs: [['heart', 'A raised red patch', 'Often from 2–4 weeks'], ['clock', 'Grows, then fades', 'Over months, then years']], calls: { ped: ['Near an eye, the nose, mouth or diaper area', 'Bleeding, or growing very fast'] } });
  TPL['rash:drool'] = rashCheck('drool', [['towel', 'Pat {p} chin dry often', 'A soft cotton bib helps. Take it off for sleep.'], ['moon', 'A thin layer of petroleum jelly at bedtime', 'It protects the sore skin overnight.']], rc(['Cracked, bleeding or oozing skin', 'No better after a week']));

  let tplNow = 0;   // the stage a look:<stage>:<topic> page was opened for
  TPL.poop = { type: 'check', k: 'diapers', eyebrow: 'Is this normal?', title: 'Nearly every poop color is normal',
    why: 'Color mostly comes down to what {s} {eat|eats} and how fast it moves through.',
    figure: () => poopChart(),
    tellTiles: true,
    tell: () => [
      tplNow === 0 ? null : live() && profile.feed === 'Formula' ? ['clock', 'Most days', 'Usual on formula'] : ['clock', 'Days apart', live() && profile.feed === 'Both' ? 'Fine if feeding well' : 'Normal if breastfed'],
      ['diaper', 'Straining', 'Normal if poop is soft'],
      tplNow >= 2 ? ['bowl', 'After solids', 'Thicker and smellier'] : null],
    helps: () => [['hand', 'Straining or gassy?', 'Bicycle {p} legs and rub {p} tummy'], (tplNow >= 3 || solids()) ? ['bowl', 'Hard poop?', 'Pears, prunes or peaches'] : ['bottle', 'Keep feeding as usual', 'Milk keeps it soft']],
    calls: { ped: () => ['Fewer than 6 wet diapers a day', 'Hard, pebble-like poop', 'White, gray or chalky poop. Call right away', tplNow <= 1 ? 'Watery poop many times a day. Call right away' : null] } };

  /* ----- Nov 22: every page's content in the two templates (Yarden's mockups). One large photo per page; its corner
     tags (bl/br/tl/tr) sit where they don't cover a face or the thing being shown. ----- */
  const CT_PAGES = {
    sponge: { topic: 'Baths', title: 'Give a sponge bath', why: 'Until the cord falls off, keep the stump dry, so no soaking. Lay {o} on a towel on a flat surface in a warm room.',
      show: { img: 'show-sponge', alt: 'A parent washes one arm of a newborn who is wrapped in a towel', tags: [['Wrapped up', 'bl'], ['Wash one part', 'br']], t: 'The move to see', line: 'Keep the rest of {o} wrapped while you wash one area.' },
      nearby: ['Towel', 'Washcloth', 'Warm water', 'Clean diaper'],
      moves: [['Test the water', 'Warm, not hot, on the inside of your wrist'], ['Eyes, then face', 'Plain water, a clean corner of the cloth for each eye, inner corner out'], ['Wash, cover, repeat', 'Mild soap, one part at a time, then wrap it back up. Diaper area last']],
      good: 'Wash the hair last with the damp cloth, then pat dry, into every crease. A wet cord stump just gets patted dry. Then a fresh diaper and clothes.',
      safe: [['hand', 'A hand on {o} the whole time', 'Never step away on a raised surface']], video: TPL['p:sponge'].video },
    tub: { topic: 'Baths', title: 'Give a tub bath', why: 'Once the cord has fallen off and the belly button is dry, the little tub is ready. The key is a steady hold.',
      show: { img: 'show-tub', alt: 'A parent cradles her baby’s head in one hand in a small tub, a washcloth over the tummy', tags: [['Head supported', 'bl'], ['Warm washcloth', 'br']], t: 'First, see the hold', line: 'One hand supports {p} head and neck for the whole bath.' },
      nearby: ['Baby tub', 'Washcloth', 'Towel', 'Clean clothes'],
      moves: [['Prepare the water', 'About 2 inches deep, warm on your wrist (about 100°F)'], ['Lower {o} in feet first', 'Your arm behind {p} shoulders, your hand holding {p} far armpit'], ['Wash with your free hand', 'Plain water on the face, mild soap on the body, hair last with {p} head tipped back']],
      good: 'Lift {o} straight into the towel and pat the creases dry. Five to 10 minutes is plenty, and crying at first is normal.',
      safe: [['hand', 'A hand on {o} the whole time', 'If you need to step away, take {o} with you'], ['thermo', 'Water heater at 120°F or lower', 'Check the dial on the heater, or ask your landlord']], video: TPL['p:tub'].video },
    bedtime: { topic: 'Baths', title: 'A bath before bedtime', why: 'The familiar order matters more than bathing every night.',
      show: { img: 'show-crib', alt: 'A parent lays his drowsy baby on her back in a bare crib, in a sleep sack', tags: [['On {p} back', 'tl'], ['Bare crib', 'bl']], t: 'The little routine', line: 'Bath, feed, book, then into {p} own safe sleep space.' },
      moves: [['A short warm bath', 'Warm, not hot, on the inside of your wrist'], ['Feed and wind down', 'Dim lights and a quiet voice. Brush any teeth after the feed'], ['Read, then sleep', 'Into the crib drowsy but awake, on {p} back']],
      good: 'Two or three baths a week is enough. On other nights, go straight to the feed.',
      safe: [['hand', 'A hand on {o} in the bath', 'Never leave {o} alone in water']] },
    bigtub: { topic: 'Baths', title: 'Move to the big tub', why: 'Once {s} {sit|sits} steadily without support, the family tub can work.',
      show: { img: 'show-bigtub', alt: 'A parent checks a few inches of water over a non-slip mat in a bathtub', tags: [['Non-slip mat', 'bl'], ['Shallow water', 'br']], t: 'Check the setup', line: 'A non-slip mat, and water no higher than {p} waist when {s} {sit|sits}.' },
      nearby: ['Non-slip mat', 'Towel', 'Washcloth'],
      moves: [['Mat down first', 'Before {s} {get|gets} in. Sit {o} away from the spout'], ['Check the water', 'Warm, not hot, about 100°F'], ['Wash with one hand', 'The other stays on {o}. Drain the tub right after']],
      good: 'Bath seats don’t make baths safer, and they can tip. They don’t replace a hand on {o}.',
      safe: [['hand', 'Never leave {o} alone in water', 'Not even for a moment. Take {o} with you'], ['stand', 'Sit {o} back down if {s} {stand|stands}', 'Standing in the tub leads to falls']] },
    diaper: cord => ({ topic: 'Diapers', title: 'Change a diaper, start to finish', why: 'You’ll do this a lot, and the order quickly becomes automatic. Start with everything in reach.',
      show: { img: 'show-diaper', alt: 'A parent keeps one hand on his newborn’s tummy, a fresh diaper open beside them', tags: [['Hand on tummy', 'bl'], ['Fresh one ready', 'br']], t: 'See the setup', line: 'Open the clean diaper before you unfasten the dirty one.' },
      nearby: ['Clean diaper', 'Unscented wipes', 'Zinc diaper cream, for red skin'],
      moves: [['Fresh one under the dirty one', 'Roll {o} gently to one side and slide it in, open, tabs at the back'], ['Open, wipe, fold', 'Undo the dirty one, wipe the worst with its front, fold it under {o}, then wipes front to back'], ['Old one out, new one on', cord ? 'Pull the dirty one away, bring the clean front up and fold it below the stump. Stick the tabs, two fingers of room' : 'Pull the dirty one away, bring the clean front up and stick the tabs, two fingers of room']],
      good: () => anatomy() === 'boy' ? (cord ? 'Point the penis down before you fasten. If he’s circumcised, a dab of petroleum jelly on the tip each change until it heals.' : 'Point the penis down before you fasten, so the diaper doesn’t leak.')
        : anatomy() === 'girl' && cord && careAge() < 1 ? 'A little white discharge, or a spot of blood, from her vagina in the first weeks is normal. It comes from your pregnancy hormones.' : 'Red skin under the diaper? A thick layer of zinc diaper cream at every change usually clears it.',
      link: rashLinkRow, safe: [['hand', 'A hand on {o} the whole time', 'Never step away on a raised surface']] }),
    wriggle: stand => ({ topic: 'Diapers', title: stand ? 'Diaper changes on the move' : 'Change a wriggler', why: stand ? 'Once {s} {pull|pulls} to stand, pull-on diapers can be easier.' : 'Rolling changes how you set up, not the whole diaper routine.',
      show: stand ? { img: 'show-stand', alt: 'A toddler stands holding the sofa while a parent kneels beside her with a clean pull-on diaper', tags: [['Holding the sofa', 'bl'], ['Pull-on ready', 'br']], t: 'A new option', line: 'If {s} can stand steadily, change {o} standing, in pull-ons.' }
        : { img: 'show-wriggle', alt: 'A parent keeps a hand on her baby’s tummy while he holds a soft toy', tags: [['Toy to hold', 'bl'], ['Hand on tummy', 'br']], t: 'The trick to see', line: stand ? 'If {s} can stand steadily, change {o} standing, in pull-ons.' : 'Give {o} something to focus on, with everything already in reach.' },
      nearby: stand ? ['Pull-on diaper', 'Wipes', 'Toy'] : ['Diaper', 'Wipes', 'Small toy'],
      moves: stand ? [['Get everything ready', 'If {s’s} wobbly, change {o} lying on the floor instead'], ['Let {o} hold on', 'To the sofa edge, or give {o} a toy'], ['Off, wipe, on', 'Tear the sides of the dirty one, wipe front to back, step {o} into the new one']]
        : [['Hand {o} a toy', 'Or sing the same song each time'], ['A hand on {p} tummy', 'Before {s} {roll|rolls} away'], ['Too wriggly? Use the floor', 'A mat on the floor avoids a fall']],
      good: 'Leaks, or red marks on the legs, mean it’s time for the next size.', full: true,
      safe: [['hand', 'Never step away on a raised surface', 'Or change {o} on the floor']] }),
    nails: { topic: 'Nails', title: 'Trim tiny nails without a nick', why: 'They grow fast. Check twice a week and trim when they’re sharp.',
      show: { img: 'show-nails', alt: 'A parent presses a baby’s finger pad back while clipping the nail', tags: [['Pad pushed back', 'bl'], ['Just the nail', 'tr']], t: 'See the grip', line: 'Gently press the finger pad away from the nail before clipping.' },
      nearby: ['Baby nail clippers or a file', 'Good light'],
      moves: [['Choose a sleepy moment', 'Still hands make it easier'], ['Press the fingertip back', 'Make space between the nail and the skin'], ['Clip, then smooth', 'Follow the curve of fingernails. Toenails straight across']],
      good: 'If clippers feel intimidating, a soft nail file works too. Sharp again in a few days is normal.',
      safe: [['heart', 'A small nick happens to everyone', 'Press a clean cloth on it until it stops']] },
    gums: { topic: 'Teeth', title: 'Wipe {p} gums', why: 'A soft, damp cloth is all you need before teeth arrive.',
      show: { img: 'show-gums', alt: 'A parent wipes her baby’s gums with a damp cloth wrapped on her finger', tags: [['Damp cloth', 'tr'], ['Gentle wipe', 'bl']], t: 'See the motion', line: 'Wrap a damp cloth around one finger and wipe gently.' },
      nearby: ['Clean soft cloth', 'Water'],
      moves: [['Wet the cloth', 'Plain water'], ['Wrap it around your finger', 'A soft edge against the gums'], ['Wipe top and bottom', 'Morning and night. No toothpaste yet']],
      good: 'Tiny white bumps on the gums are normal. White patches on the tongue or cheeks that don’t wipe off may be thrush, so call your pediatrician.' },
    brush: { topic: 'Teeth', title: 'Brush that first tiny tooth', why: 'As soon as it appears, brush twice a day with fluoride toothpaste.',
      show: { img: 'show-brush', alt: 'A dad gently brushes his baby’s front teeth with a soft brush, the baby on his lap', tags: [['Soft brush', 'bl'], ['On your lap', 'br']], t: 'How much toothpaste?', line: 'Just a smear the size of one grain of rice.' },
      nearby: ['Soft toothbrush', 'Fluoride toothpaste'],
      moves: [['Add a tiny smear', 'Fluoride toothpaste, no more than shown'], ['Brush every tooth', 'Gently, front and back, twice a day. The last time after the bedtime feed'], ['Skip the rinse', 'Swallowing this tiny amount is fine']],
      good: 'First dentist visit after that first tooth, and by the first birthday.',
      safe: [['bottle', 'No bottle in bed', 'Milk on teeth overnight causes cavities']] },
    shade: { topic: 'Sun', title: 'Shade first', why: 'Under 6 months, skin burns fast and babies overheat easily.',
      show: { img: 'show-shade', alt: 'A stroller with its canopy up, parked in the shade of a tree', tags: [['Canopy up', 'bl'], ['Sides open', 'br']], t: 'See a cool setup', line: 'Use the canopy, never a blanket over the stroller. A blanket traps heat.' },
      nearby: ['Stroller canopy', 'Light layers', 'Wide-brim hat'],
      moves: [['Plan cooler hours', 'Go out early or later in the day'], ['Cover gently', 'Loose long sleeves and a wide-brim hat'], ['Check {o} often', 'Hot, red or sweaty? Move somewhere cooler']],
      good: 'Under 6 months, sunscreen only on small spots like the cheeks, and only when there’s no shade. Regular sunscreen starts at 6 months.',
      safe: sunSafe(true), urgent: SUN_911 },
    six: { topic: 'Sun', title: 'Sunscreen joins shade', why: 'Shade and a hat still come first. Sunscreen covers the skin they don’t.',
      show: { img: 'show-sun', alt: 'A parent rubs sunscreen on her baby’s cheek; the baby wears a wide-brim hat', tags: [['Wide-brim hat', 'tr'], ['SPF 30+', 'br']], t: 'What to cover', line: 'Remember the ears, feet and the back of the neck.' },
      nearby: ['Mineral sunscreen, SPF 30+', 'Wide-brim hat'],
      moves: [['Apply before going out', 'About 15–30 minutes beforehand'], ['Cover bare skin', 'Cheeks, ears, feet and back of neck'], ['Reapply', 'Every 2 hours, and after water']],
      good: 'Look for “broad-spectrum” on the label. Mineral (zinc oxide) sunscreen is gentlest on young skin. Skip sprays.',
      safe: sunSafe(false), urgent: SUN_911 },
    dress: { topic: 'Clothes', title: 'How warm to dress {o}', why: 'Use {p} neck or chest, not cold hands, as your clue.',
      show: { img: 'show-dress', alt: 'A parent feels the back of an awake baby’s neck; the baby lies on a firm, bare changing pad', tags: [['Light layers', 'bl'], ['Feel the neck', 'tr']], t: 'The simple check', line: 'Feel the back of the neck: sweaty means too warm.' },
      moves: [['One more layer than you', 'Comfy in a T-shirt? Add a light layer for {o}'], ['Check {p} neck', 'Sweaty: take a layer off. Feels cool: add one'], ['At bedtime', 'Sleepwear or a wearable blanket (sleep sack), no loose blankets']],
      good: 'No hats indoors. In the car seat, skip puffy coats under the straps: buckle in, then a blanket on top.',
      safe: [['shirt', 'Snaps or zips', 'Never strings or cords near the neck']] },
    feet: { topic: 'Clothes', title: 'Bare feet first, shoes later', why: 'Bare feet help {o} sense the floor as {s} {learn|learns} to walk.',
      show: { img: 'show-shoes', alt: 'Soft first-walker shoes beside non-slip socks on a rug', tags: [['Room at the toe', 'tl'], ['Flexible sole', 'bl']], t: 'Look for this', line: 'A soft sole that bends easily and has grip.' },
      moves: [['Barefoot indoors', 'Or non-slip socks when needed'], ['Shoes for outdoors', 'Once {s’s} walking outside'], ['Check the fit', 'While {s} {stand|stands}, press the toe: about a finger’s width of room']],
      good: 'Recheck the fit every month or two. Little feet grow fast.',
      safe: [['shield', 'Skip walkers on wheels', 'They don’t help with walking, and they lead to falls']] }
  };
  const asHowto = (key, o) => Object.assign(key, { type: 'howto', eyebrow: undefined, picture: undefined, pictureTitle: undefined, steps: undefined, need: undefined, say: undefined, tips: undefined, tipsTitle: undefined, movesT: undefined, movesNotes: undefined, stepsNotes: undefined }, o);
  asHowto(TPL['p:sponge'], CT_PAGES.sponge); asHowto(TPL['p:tub'], CT_PAGES.tub); asHowto(TPL['t:bath:2'], CT_PAGES.bedtime); asHowto(TPL['t:bath:3'], CT_PAGES.bigtub);
  asHowto(TPL['h:diapers:0'], CT_PAGES.diaper(true)); asHowto(TPL['h:diapers:1'], CT_PAGES.diaper(false)); asHowto(TPL['h:diapers:2'], CT_PAGES.wriggle(false)); asHowto(TPL['h:diapers:3'], CT_PAGES.wriggle(true));
  asHowto(nails, CT_PAGES.nails); asHowto(gums, CT_PAGES.gums); asHowto(TPL['p:brush'], CT_PAGES.brush); asHowto(shade, CT_PAGES.shade); asHowto(six, CT_PAGES.six);
  asHowto(dress, CT_PAGES.dress); asHowto(TPL['p:feet'], CT_PAGES.feet);
  // Nov 22 (Yarden's how-to mockup, second pass): pointing labels on the big photo, icon "Have nearby", and a small photo
  // per step where one exists. Every step photo shows a different moment from the big photo.
  const PH = n => 'photo:care/' + n;
  const showAs = (q, call) => Object.assign(val(q.show), { call });
  [[TPL['p:sponge'], [['Keep {o} wrapped', 'br', 72, 72], ['Wash one part at a time', 'bl', 34, 52]],
    ['Towel', 'Washcloth', 'Bowl of warm water', 'Mild soap'],
    [[PH('sp-1'), 'Prepare', 'Everything in reach. Water warm, not hot, on your wrist'], [PH('sp-2'), 'Eyes, then face', 'Plain water, a clean corner of the cloth for each eye'], [PH('sp-3b'), 'Wash, cover, repeat', 'Mild soap, one part at a time. Diaper area last']]],
   [TPL['p:tub'], [['Hand behind the head', 'bl', 42, 56], ['Warm washcloth', 'br', 56, 84]],
    ['Little tub', 'Towel', 'Washcloth', 'Mild soap'],
    [[PH('tb-1'), 'Prepare', 'About 2 inches of water, warm on your wrist'], [PH('tb-lower'), 'Lower in gently', 'Feet first, your arm behind {p} shoulders'], [PH('tb-5'), 'Wash and wrap', 'Face, body, hair last. Then straight into the towel']]],
   [TPL['t:bath:3'], [['A non-slip mat', 'tl', 24, 84], ['Shallow water', 'br', 62, 66]],
    ['Non-slip mat', 'Towel', 'Bath toys'],
    [[PH('bg-1'), 'Mat down first', 'Before {s} {get|gets} in. Sit {o} away from the spout'], [PH('bg-2'), 'Check the water', 'Warm, not hot, no higher than {p} waist'], ['hand', 'A hand on {o} the whole bath', 'Wash with your free hand. Drain the tub right after']]],
   [nails, [['Pad pressed back', 'bl', 30, 30], ['Just the white tip', 'tr', 52, 46]],
    ['Nail clippers or a file', 'Good light'],
    [[PH('nl-1'), 'Choose a sleepy moment', 'Still hands make it easier'], ['hand', 'Press the fingertip back', 'Make space between the nail and the skin'], [PH('nl-3'), 'Clip, then smooth', 'Follow the curve. Toenails straight across']]],
   [gums, [['Damp cloth on a finger', 'tr', 44, 50]],
    ['Soft cloth', 'Water'],
    [[PH('gm-1'), 'Wet the cloth', 'Plain water, no toothpaste yet'], ['hand', 'Wrap it on a finger', 'A soft edge against the gums'], ['smile', 'Wipe top and bottom', 'Gently, morning and night']]],
   [TPL['p:brush'], [['Soft brush', 'bl', 46, 52]],
    ['Soft toothbrush', 'Fluoride toothpaste'],
    [[PH('br-1'), 'Add a tiny smear', 'The size of a grain of rice'], ['tooth', 'Brush every tooth', 'Front and back, twice a day. Last thing at night'], [PH('br-3'), 'Skip the rinse', 'Just wipe {p} mouth. Swallowing this tiny amount is fine']]],
   [six, [['Wide-brim hat', 'tr', 74, 30], ['Sunscreen on bare skin', 'bl', 50, 56]],
    ['Sunscreen, SPF 30+', 'Wide-brim hat'],
    [[PH('ss-1'), 'Put it on early', '15–30 minutes before you go out'], ['hand', 'Cover bare skin', 'Cheeks, ears, feet and the back of the neck'], ['clock', 'Put more on', 'Every 2 hours, and after water']]],
   [shade, [['Canopy up', 'tr', 40, 24]],
    ['Stroller canopy', 'Light layers', 'Wide-brim hat'],
    [['clock', 'Plan cooler hours', 'Go out early or later in the day'], ['shirt', 'Cover gently', 'Loose long sleeves and a wide-brim hat'], ['stroller', 'Canopy, never a blanket', 'A blanket over the stroller traps heat']]],
   [dress, [['Feel the neck', 'tr', 86, 56], ['Light layers', 'bl', 46, 70]],
    [],
    [['shirt', 'One more layer than you', 'Comfy in a T-shirt? Add a light layer for {o}'], ['hand', 'Check {p} neck', 'Sweaty: take a layer off. Feels cool: add one'], ['moon', 'At bedtime', 'Sleepwear or a sleep sack, no loose blankets']]],
   [TPL['p:feet'], [['Room at the toe', 'tl', 22, 30], ['Flexible sole', 'bl', 30, 62]],
    [],
    [['stand', 'Barefoot indoors', 'Or non-slip socks when needed'], ['road', 'Shoes for outdoors', 'Once {s’s} walking outside'], ['hand', 'Check the fit', 'While {s} {stand|stands}, press the toe: a finger’s width of room']]]
  ].forEach(([q, call, nearby, moves]) => { showAs(q, call); Object.assign(q, { nearby, moves }); });
  // Diapers: the clean-under trick, and rolling to the side (never lifting by the ankles).
  [[TPL['h:diapers:0'], true], [TPL['h:diapers:1'], false]].forEach(([q, cord]) => { showAs(q, [['One hand on {o}', 'bl', 40, 46], ['Fresh diaper ready', 'tr', 82, 84]]);
    Object.assign(q, { nearby: ['Diaper', 'Wipes', 'Zinc diaper cream', 'Changing pad'],
      moves: [[PH('dn-under'), 'Fresh one under', 'Roll {o} gently to one side and slide it under the dirty one'], [PH('dn-2'), 'Open and wipe', 'Wipe the worst with the dirty front, then wipes front to back'], [PH('dn-fasten'), 'Old one out, fasten', cord ? 'Bring the front up below the stump. Snug, not tight' : 'Bring the front up and fasten. Snug, not tight']] }); });
  showAs(TPL['h:diapers:2'], [['Something to hold', 'tr', 34, 56], ['One hand on {p} tummy', 'br', 62, 46]]);
  Object.assign(TPL['h:diapers:2'], { nearby: ['Diaper', 'Wipes', 'Small toy'],
    moves: [[PH('wg-1'), 'Get ready', 'A clean diaper and wipes within reach'], ['toy', 'Keep {o} busy', 'A toy to hold, or a song'], [PH('wg-4'), 'Too wriggly? Use the floor', 'On a mat there’s nowhere to fall']] });
  showAs(TPL['h:diapers:3'], [['Holding the sofa', 'bl', 22, 60], ['Pull-on ready', 'br', 66, 52]]);
  Object.assign(TPL['h:diapers:3'], { nearby: ['Pull-on diaper', 'Wipes', 'Toy'],
    moves: [[PH('wg-1'), 'Get ready', 'If {s’s} wobbly, change {o} lying on the floor'], [PH('wg-5'), 'Let {o} hold on', 'To the sofa edge, with you close'], ['diaper', 'Off, wipe, on', 'Tear the sides of the dirty one, wipe front to back, step {o} in']] });
  // Bedtime: the routine as a strip under the photo, then the steps.
  showAs(TPL['t:bath:2'], [['On {p} back', 'tl', 76, 74], ['A bare crib', 'bl', 30, 84]]);
  Object.assign(TPL['t:bath:2'], { routine: undefined, nearby: [],
    moves: [['thermo', 'Keep it warm', 'A short bath, warm on your wrist. Not needed every night'], ['moon', 'Keep it calm', 'Dim lights and a quiet voice. Feed, then brush any teeth'], ['crib', 'Follow the routine', 'Into the crib drowsy but awake, on {p} back']] });

  /* Nov 23 (Yarden: "is this the clearest the copy can be?"): every line is a short whole sentence, every step title says
     what to do, the photo labels name the same things as the steps, and Good to know adds something the steps don't. */
  const HT = (q, o) => { if (o.call) showAs(q, o.call); delete o.call; Object.assign(q, o); };
  HT(TPL['p:sponge'], { why: 'Until the cord stump falls off, wash {o} with a damp cloth, not in water.',
    call: [['Wrapped in a towel', 'br', 72, 72], ['A damp cloth, no soaking', 'bl', 34, 52]],
    nearby: ['Towel', 'Washcloth', 'Bowl of warm water', 'Mild soap'],
    moves: [[PH('sp-1'), 'Get everything ready', 'Undress {o} on a towel in a warm room, and wrap {o} up. Test the water on your wrist: warm, not hot'],
      [PH('sp-2'), 'Wipe {p} eyes and face', 'Use plain water, and a clean corner of the cloth for each eye'],
      [PH('sp-3b'), 'Wash one area at a time', 'Uncover one part, wash it, pat it dry and cover it again. Get into the creases. Hair and diaper area last']],
    good: 'Done? A fresh diaper and clothes right away. If the cord stump gets wet, just pat it dry.',
    safe: [['hand', 'Keep a hand on {o} the whole time', 'Never step away from a changing table or bed']] });
  Object.assign(val(TPL['p:tub'].show), { alt: 'A parent bathes a baby wrapped in a thin cloth in a small tub, her forearm behind the baby’s shoulders and her hand behind the head' });
  HT(TPL['p:tub'], { why: () => careAge() < 1 ? 'Once the cord stump falls off and the belly button heals, {s} can have a real bath. Two or three a week is plenty.' : 'Two or three short baths a week is plenty.',
    call: [['{P} head on your arm', 'tr', 53, 38]],
    nearby: ['Little tub', 'Towel', 'Washcloth', 'Mild soap'],
    moves: [[PH('tb-1'), 'Fill about 2 inches of water', 'Test it on your wrist. It should feel warm, not hot'],
      [PH('tb-hold'), 'Lower {o} in, feet first', 'Then rest {p} head and neck on your arm, like this'],
      [PH('tb-5'), 'Wash, rinse, then wrap', 'Face first, hair last, rinsing with a cupped hand. Lift {o} straight into the towel and pat the creases dry']],
    good: 'Five to 10 minutes is plenty. Lots of babies cry in their first baths, and it gets easier.',
    safe: [['hand', 'Keep a hand on {o} the whole time', 'If you need to step away, take {o} with you'], ['thermo', 'Set your water heater to 120°F or lower', 'Hotter tap water can scald in seconds']] });
  HT(TPL['t:bath:3'], { why: 'Once {s} {sit|sits} steadily on {p} own, {s} can move to the family tub.',
    call: [['Non-slip mat', 'tl', 24, 84], ['A few inches of water', 'br', 62, 66]],
    nearby: ['Non-slip mat', 'Towel', 'Washcloth', 'Bath toys'],
    moves: [[PH('bg-1'), 'Mat down, then the water', 'A few inches, no higher than {p} waist when {s} {sit|sits}'],
      [PH('bg-2'), 'Test it, then sit {o} in', 'Warm, not hot, on your wrist. Sit {o} facing away from the faucet'],
      [PH('bigtub-sit'), 'Keep one hand on {o}', 'Wash with your other hand. Drain the tub as soon as {s’s} out']],
    good: 'Bath seats can tip over, so they don’t make baths safer. Your hand does.',
    safe: [['hand', 'Never leave {o} alone in the water', 'Not even for a moment'], ['stand', 'Standing up? Sit {o} back down', 'Most bath falls start that way']] });
  HT(TPL['t:bath:2'], { title: 'Bath, then bed', why: 'The same calm order each night helps {o} wind down.',
    call: [['On {p} back', 'tl', 76, 74], ['Nothing else in the crib', 'bl', 30, 84]],
    // Nov 24 (Everyday care): one photo per step, so the routine shows once, in order.
    moves: () => [[PH('bt-1'), 'A short, warm bath', 'Or skip it. Two or three baths a week is enough'],
      [live() && profile.feed !== 'Formula' ? 'photo:sleep/feed-nurse' : PH('bt-2'), () => careAge() >= 6 ? 'Feed, then brush' : 'Feed, nice and calm', () => careAge() >= 6 ? 'Brush any teeth after the last feed. Keep the lights low' : 'Keep the lights low and your voice quiet'],
      [PH('bt-3'), 'A book or a song', 'The same one most nights'],
      [PH('bt-4'), 'Into the crib', 'Drowsy but awake, on {p} back']],
    good: '',
    safe: [['hand', 'Keep a hand on {o} in the bath', 'Never leave {o} alone in the water']] });
  [[TPL['h:diapers:0'], true], [TPL['h:diapers:1'], false]].forEach(([q, cord]) => HT(q, {
    why: 'Set everything within reach first. In a few days, it’s automatic.',
    call: [['A hand on {o}', 'bl', 40, 46], ['Clean diaper ready', 'tr', 82, 84]],
    nearby: ['Clean diaper', 'Wipes', 'Changing pad'],
    moves: [[PH('dn-under'), 'Slide the clean one under', 'Roll {o} gently to one side and tuck it under the dirty diaper'],
      [PH('dn-2'), 'Open and wipe', 'Wipe front to back. Lots of poop? Wipe most of it off with the dirty diaper first'],
      [PH('dn-fasten'), 'Pull out the old one and fasten', cord && careAge() < 1 ? 'Fold the front down below the cord stump. Leave room for two fingers at the waist' : 'Snug, with room for two fingers at the waist']],
    good: () => anatomy() === 'boy' ? (cord && careAge() < 1 ? 'Point his penis down before you fasten, so the diaper doesn’t leak. If he’s circumcised, put a dab of petroleum jelly on the tip at each change until it heals.' : 'Point his penis down before you fasten, so the diaper doesn’t leak.')
      : anatomy() === 'girl' && cord && careAge() < 1 ? 'A little white discharge or a spot of blood in her diaper is normal in the first weeks. It comes from pregnancy hormones.' : 'Let the skin air-dry for a moment before the clean diaper goes on.',
    safe: [['hand', 'Keep a hand on {o} the whole time', 'Never step away from a changing table or bed']] }));
  HT(TPL['h:diapers:2'], { why: 'Once {s} {roll|rolls}, keep {o} busy and keep a hand on {o}.',
    call: [['A toy to hold', 'tr', 34, 56], ['A hand on {p} tummy', 'br', 62, 46]],
    nearby: ['Clean diaper', 'Wipes', 'Small toy'],
    moves: [[PH('wg-1'), 'Set up before you start', 'Open the clean diaper and put the wipes within reach'],
      [PH('wg-2'), 'Give {o} something to hold', 'A toy, or the same song each time, keeps {o} busy'],
      [PH('wg-4'), 'Move to the floor if needed', 'If {s} {keep|keeps} rolling, change {o} on a mat on the floor']],
    good: 'Leaks or red marks on {p} legs mean it’s time for the next size up.',
    safe: [['hand', 'Never step away from a changing table or bed', '{S} can roll off in a second']] });
  HT(TPL['h:diapers:3'], { why: 'Once {s} {pull|pulls} up to stand, pull-on diapers let you change {o} standing.',
    call: [['Holding the sofa', 'bl', 22, 60], ['Pull-on ready', 'br', 66, 52]],
    nearby: ['Pull-on diaper', 'Wipes', 'Toy'],
    moves: [[PH('wg-5'), 'Let {o} hold on', 'Have {o} stand at the sofa, with you kneeling close'],
      [PH('pullon-tear'), 'Take off the old one', 'Tear the sides to get it off, then wipe front to back'],
      [PH('pullon-step'), 'Step {o} into the new one', 'Pull it up snug. For a messy diaper, lay {o} down instead']],
    good: 'Leaks or red marks on {p} legs mean it’s time for the next size up.',
    safe: [['hand', 'Still wobbly on {p} feet?', 'Change {o} lying down on the floor']] });
  HT(nails, { why: 'Little nails are sharp enough to scratch {p} face. Check them once or twice a week.',
    call: [['Pad pressed back', 'bl', 30, 30], ['Just the white tip', 'tr', 52, 46]],
    nearby: ['Small nail clippers or a file', 'Good light'],
    moves: [[PH('nl-1'), 'Wait for a sleepy moment', '{P} hands stay still when {s’s} asleep or drowsy after a feed'],
      ['photo:care/step-nailpad', 'Press the fingertip pad back', 'That makes room, so you only catch the nail'],
      [PH('nl-3'), 'Clip, then file smooth', 'Follow the curve on fingers. Cut toenails straight across']],
    good: 'A soft nail file works well too, if clippers make you nervous.',
    safe: [['heart', 'A small nick happens to everyone', 'Press a clean cloth on it until it stops']] });
  HT(gums, { why: 'Before teeth come in, a quick wipe keeps {p} mouth clean and gets {o} used to it.',
    call: [['Damp cloth on a finger', 'tr', 44, 50]],
    nearby: ['Soft cloth', 'Water'],
    moves: [[PH('gm-1'), 'Wet a soft cloth, wrap one finger', 'Plain water is all you need. No toothpaste yet'],
      [PH('gm-2'), 'Wipe the top and bottom gums', 'Gently, in the morning and at night']] });
  Object.assign(val(TPL['p:brush'].show), { img: 'show-paste', alt: 'A tiny smear of toothpaste on a soft toothbrush, next to one grain of rice' });
  HT(TPL['p:brush'], { why: 'As soon as the first tooth shows, brush twice a day with a little fluoride toothpaste.',
    call: [['A smear the size of a grain of rice', 'tl', 47, 42]],
    nearby: ['Soft toothbrush', 'Fluoride toothpaste'],
    moves: [[PH('br-1'), 'Add a tiny smear', 'Fluoride toothpaste, no more than the photo shows'],
      [PH('br-2'), 'Brush each tooth gently', 'Front and back, twice a day. Do the last brush after the bedtime feed'],
      [PH('br-3'), 'Skip the rinse', 'Just wipe {p} mouth. Swallowing this tiny amount is fine']],
    good: 'Book the first dentist visit after the first tooth, and by {p} first birthday.',
    safe: [['bottle', 'Don’t put {o} to bed with a bottle', 'Milk on teeth overnight causes cavities']] });
  HT(six, { title: 'Sunscreen can start at 6 months', why: 'Shade and a hat still come first. Sunscreen covers the skin those can’t reach.',
    call: [['Wide-brim hat', 'tr', 74, 30], ['Sunscreen on bare skin', 'bl', 50, 56]],
    nearby: ['Sunscreen, SPF 30+', 'Wide-brim hat'],
    moves: [[PH('ss-1'), 'Put it on before you go out', '15 to 30 minutes ahead, so it has time to work'],
      [PH('ss-2'), 'Cover all bare skin', 'Don’t forget the ears, feet and the back of the neck'],
      [PH('sun-reapply'), 'Put more on every 2 hours', 'And again after water or a lot of sweat']],
    good: ['Choose broad-spectrum, SPF 30 or higher. Mineral (zinc oxide) is gentlest. Skip sprays', 'On hot days, offer extra milk feeds and a few sips of water'],
    safe: [['thermo', 'Hot, floppy or hard to wake? Call 911', 'Then move {o} to shade and cool {p} skin with water'], ['sun', 'Any sunburn before age 1? Call your pediatrician', '']], urgent: undefined });
  HT(shade, { title: 'Keep {o} in the shade', why: 'Under 6 months, skin burns fast. Shade does most of the work.',
    call: [['Canopy up', 'tr', 40, 24]],
    nearby: ['Stroller canopy', 'Light layers', 'Wide-brim hat'],
    moves: [[PH('shade-early'), 'Go out early or late', 'The sun is strongest from late morning to mid-afternoon'],
      [PH('shade-sleeves'), 'Cover {p} arms and legs', 'Light, loose long sleeves and a wide-brim hat'],
      [PH('th-sun'), 'Use the canopy, not a blanket', 'A blanket over the stroller traps heat']],
    good: ['No shade at all? A little sunscreen on small spots, like the cheeks, is OK', 'On hot days, offer extra milk feeds. No water yet'],
    safe: [['thermo', 'Hot, floppy or hard to wake? Call 911', 'Then move {o} to shade and cool {p} skin with water'], ['sun', 'Any sunburn before age 1? Call your pediatrician', '']], urgent: undefined });
  HT(dress, { why: 'Cold hands are normal and don’t mean {s’s} cold. Feel the back of {p} neck instead.',
    call: [['Feel the neck', 'tr', 86, 56], ['Light layers', 'bl', 46, 70]],
    moves: [['photo:care/th-dress', 'Add one more layer than you', 'Comfy in a T-shirt? Dress {o} in a T-shirt and a light layer'],
      ['photo:care/step-neck', 'Feel the back of {p} neck', 'Sweaty means take a layer off. Cool means add one'],
      ['photo:sleep/swaddle-after', 'Use a sleep sack at night', 'A wearable blanket, so nothing loose goes in the crib']],
    good: 'Skip hats indoors. In the car seat, skip puffy coats: buckle {o} in, then lay a blanket over the straps.',
    safe: [['shirt', 'Choose snaps or zips', 'Nothing with strings or cords near the neck']] });
  HT(TPL['p:feet'], { why: 'Bare feet help {o} feel the floor and find {p} balance while learning to walk.',
    call: [['Room at the toe', 'tl', 22, 30], ['Flexible sole', 'bl', 30, 62]],
    moves: [[PH('th-feet'), 'Go barefoot indoors', 'Use non-slip socks on slippery floors'],
      [PH('feet-shoes'), 'Add shoes for outside', 'Once {s’s} walking outdoors. Soft, bendy soles are best'],
      [PH('feet-fit'), 'Check the fit', 'Press the toe while {s} {stand|stands}. Leave about a finger’s width of room']],
    good: 'Little feet grow fast. Check the fit every month or two.',
    safe: [['shield', 'Skip walkers on wheels', 'They don’t help with walking, and they lead to falls']] });

  // Nov 23: notes in the steps card, at most two, safety first. Each is a bold lead and one short sentence.
  const NOTES = (q, notes, more) => Object.assign(q, { notes, good: undefined, safe: undefined, urgent: undefined }, more || {});
  NOTES(TPL['p:sponge'], [['Keep a hand on {o}', 'Never step away from a changing table or bed'], ['Cord stump wet?', 'Just pat it dry. It doesn’t need cleaning']]);
  NOTES(TPL['p:tub'], [['Keep a hand on {o} the whole time', 'To step away, take {o} with you'], ['Water heater at 120°F or lower', 'Hotter tap water can scald in seconds']]);
  NOTES(TPL['t:bath:3'], [['Never leave {o} alone in water', 'Not even for a moment'], ['Skip bath seats', 'They can tip, and they don’t replace your hand']]);
  TPL['t:bath:3'].moves[2] = [PH('bigtub-sit'), 'Keep one hand on {o}', 'Wash with your other hand. If {s} {stand|stands}, sit {o} back down'];
  NOTES(TPL['t:bath:2'], [['Keep a hand on {o} in the bath', 'Never leave {o} alone in water']]);
  [[TPL['h:diapers:0'], true], [TPL['h:diapers:1'], false]].forEach(([q, cord]) => NOTES(q, () => [['Keep a hand on {o}', 'Never step away from a changing table or bed'],
    anatomy() === 'boy' ? ['Point his penis down', cord && careAge() < 1 ? 'It stops leaks. If he’s circumcised, dab petroleum jelly on the tip until it heals' : 'It stops leaks']
      : anatomy() === 'girl' && cord && careAge() < 1 ? ['White discharge or a spot of blood?', 'Normal in the first weeks, from pregnancy hormones'] : ['Let the skin air-dry', 'Just for a moment, before the clean diaper goes on']]));
  NOTES(TPL['h:diapers:2'], [['Never step away from a changing table or bed', '{S} can roll off in a second'], ['Leaks or red marks on the legs?', 'Time for the next size up']]);
  NOTES(TPL['h:diapers:3'], [['Still wobbly?', 'Change {o} lying down on the floor'], ['Leaks or red marks on the legs?', 'Time for the next size up']]);
  NOTES(nails, [['A small nick?', 'It happens to everyone. Press a clean cloth on it'], ['Two people make it easier', 'One holds, one trims']]);
  NOTES(gums, [['White patches that don’t wipe off?', 'It may be thrush. Call your pediatrician']]);
  NOTES(TPL['p:brush'], [['No bottle in bed', 'Milk on teeth overnight causes cavities'], ['First dentist visit', 'After the first tooth, and by {p} first birthday']]);
  NOTES(six, [['Hot, floppy or hard to wake? Call 911', 'Then move {o} to shade and cool {p} skin with water'], ['Any sunburn before age 1?', 'Call your pediatrician']]);
  six.moves[0] = [PH('ss-1'), 'Put it on before you go out', 'Broad-spectrum, SPF 30 or more, 15 to 30 minutes ahead. Mineral (zinc oxide) is gentlest'];
  NOTES(shade, [['Hot, floppy or hard to wake? Call 911', 'Then move {o} to shade and cool {p} skin with water'], ['Any sunburn before age 1?', 'Call your pediatrician']]);
  shade.moves[1] = [PH('shade-sleeves'), 'Cover {p} arms and legs', 'Light, loose long sleeves and a wide-brim hat. No shade? A little sunscreen on small spots'];
  NOTES(dress, [['No strings near the neck', 'Snaps, zips and buttons are fine'], ['No puffy coats in the car seat', 'Buckle {o} in, then lay a blanket over the straps']]);
  [[TPL['p:sponge'], 1], [TPL['p:tub'], 2], [TPL['t:bath:3'], 2], [TPL['t:bath:2'], 1], [TPL['h:diapers:0'], 1], [TPL['h:diapers:1'], 1], [TPL['h:diapers:2'], 1], [TPL['h:diapers:3'], 1],
    [nails, 0], [gums, 0], [TPL['p:brush'], 1], [six, 2], [shade, 2], [dress, 2], [TPL['p:feet'], 1]].forEach(([q, n]) => { q.safeN = n; });
  NOTES(TPL['p:feet'], [['Skip walkers on wheels', 'They don’t help with walking, and they lead to falls'], ['Little feet grow fast', 'Check the fit every month or two']]);

  // What to know: one photo with the caption on it.
  Object.assign(TPL.cord, { eyebrow: 'Cord', normalNotes: undefined, lookImg: 'show-cord', lookCap: 'Stump in the air, diaper folded down', show: undefined, normal: [['cord', 'A dry, dark stump as it heals'], ['drop', 'A small crust or spot of blood as it comes off']],
    moves: [['diaper', 'Fold the diaper below it'], ['drop', 'If it’s dirty, plain water and pat dry'], ['hand', 'Let it fall off. Don’t pull']] });
  Object.assign(TPL['look-cord'], { lookImg: 'rash-cord', lookCap: 'Dark, dry and a little crusty', figure: undefined });
  Object.assign(TPL['look-eyes'], { lookImg: 'look-eyes', lookCap: 'A little crust in the inner corner' });
  Object.assign(TPL['look-yellow'], { lookImg: 'look-yellow', lookCap: 'A yellow tint. Check in daylight' });
  Object.assign(TPL['p:teething'], { eyebrow: 'Teeth', lookImg: 'look-teething', lookCap: 'Drool, chewing and a firm teething ring' });
  Object.assign(skinCare, { eyebrow: 'Skin', lookImg: 'look-skin', lookCap: 'Dry skin is common, and easy to soothe' });
  TPL.poop.lookTitle = 'Colors at a glance';
  // Nov 22: one short line per tile and per help, like the mockups.
  Object.assign(TPL.cord, { notice: ['A dry, dark stump as it heals', 'A crust or spot of blood as it comes off'], helpsShort: ['Fold the diaper below it', 'If it’s dirty, plain water and pat dry', 'Let it fall off. Don’t pull'],
    calls: { ped: ['Smelly ooze or red skin around it', 'Bleeding that won’t stop', 'Still on after 3 weeks', 'FEVER'] } });
  Object.assign(TPL['look-cord'], { notice: ['A dark, dry stump', 'A spot of blood as it falls off'], helpsShort: ['Fold the diaper down below it', 'Plain water only if it’s dirty, then pat dry'],
    calls: { ped: ['Smelly ooze or red skin around it', 'Bleeding that won’t stop', 'Still on after 3 weeks', 'FEVER'] } });
  TPL['look-cord'] = TPL.cord;
  // Nov 22 (Yarden): eyes and nose are two concerns, so two pages, each with its own photo.
  Object.assign(TPL['look-eyes'], { title: 'Sticky or watery eyes', why: 'Often a blocked tear duct. It usually clears on its own in the first year.',
    notice: ['A watery eye that isn’t red', 'A little crust after sleep'], helpsShort: ['Wipe from the inner corner out, with warm water', 'A clean cotton ball for each wipe, and each eye', 'Ask your pediatrician to show you a tear-duct massage'],
    calls: { ped: ['A red, swollen eyelid', 'Yellow-green goo', 'A red lump by the inner corner', 'FEVER', 'A red eye with goo in the first 2 weeks. Call right away'] } });
  TPL['look-nose'] = { type: 'check', eyebrow: 'Is this normal?', k: 'skin', title: 'A stuffy or noisy nose',
    why: 'Babies breathe through their noses, so a little mucus sounds loud. It’s usually normal.',
    notice: ['Snuffly breathing, feeding fine', 'Sneezing, which clears the nose'],
    helpsShort: ['A few salt-water (saline) drops in each nostril', 'Then squeeze a rubber bulb syringe, insert the tip gently and let go', 'Feed slowly if a stuffy nose makes it hard'],
    // Nov 24 flag 5 (Yarden: steps should be photos): the same three photos as Health's cold page.
    helpSteps: [['photo:health/cold-saline', 'Saline drops', '2 in each nostril, then wait a minute'], ['photo:health/cold-bulb', 'Gentle suction', 'Squeeze the bulb, tip in, then let go slowly'], ['photo:health/cold-feed', 'Then feed', 'Right away, while the nose is clear']],
    calls: { ped: ['Too stuffy to feed', 'Fast breathing', 'FEVER'], now: 'Working hard to breathe: ribs pulling in, grunting, or blue lips.' } };
  // Nov 23 (content audit): common first-year worries that had no page. Sources: HealthyChildren (AAP) Back to Sleep, Tummy to Play;
  // Positional Skull Deformities; Common Conditions in Newborns; MedlinePlus newborn hormones.
  TPL['look-head'] = { type: 'check', eyebrow: 'Is this normal?', lookImg: 'look-head', lookCap: 'Time upright and on {p} tummy helps it round out', k: 'skin', title: 'A flat spot or bald patch on {p} head', verdict: ['ok', 'Common, and easy to help'],
    why: 'Back sleeping is safest, but steady pressure can flatten a soft head or rub the hair thin.',
    notice: ['A bald patch where {p} head rests', 'A flatter spot on one side or the back'],
    helpsShort: ['Daily tummy time, up to 15–30 minutes by 7 weeks', 'Alternate which way {p} head points in the crib', 'Less time in car seats and swings'],
    calls: { ped: ['A flat spot that’s getting worse', '{s} always {turn|turns} {p} head the same way', 'Ears that look uneven', 'A ridge along the skull'] } };
  TPL['look-quirks'] = { type: 'check', eyebrow: 'Is this normal?', lookImg: 'look-quirks', lookCap: 'A sneeze is how a newborn clears {p} nose', k: 'skin', title: 'Hiccups and sneezes', verdict: ['ok', 'Usually normal'],
    why: '{P} nervous system is still settling in, so little jolts and hiccups are part of the first months.',
    notice: ['Hiccups after feeds', 'Sneezes that clear {p} nose', 'Arms flung out at a loud sound'],
    helpsShort: ['Hiccups pass on their own', 'Startles waking {o}? Swaddle until {s} {try|tries} to roll'],
    calls: { ped: ['Sneezing with a cough', 'Trouble feeding', 'Jerking that keeps going when you hold {p} arm still', 'FEVER'] } };
  TPL['look-swelling'] = { type: 'check', eyebrow: 'Is this normal?', lookImg: 'look-swelling', lookCap: 'It fades on its own over the first weeks', k: 'skin', title: 'Swollen breasts or genitals', verdict: ['ok', 'Usually normal'],
    why: 'Pregnancy hormones cause it, in boys and girls. It goes down on its own in a few weeks.',
    notice: ['A lump under a nipple', 'A drop of milky fluid', 'Swollen labia or scrotum'],
    helpsShort: ['Leave it alone. Don’t squeeze or massage', 'It usually goes down in 2–4 weeks'],
    calls: { ped: ['Breast skin that’s red, hot or tender', 'FEVER'] } };
  // Nov 23 (Yarden: add pacifiers, hearing and vision). Sources: HealthyChildren (AAP) Pacifiers and Thumb Sucking,
  // Pacifier Safety, AAP safe sleep 2022; Hearing Loss in Children; Warning Signs of Vision Problems in Children.
  TPL['p:pacifier'] = { type: 'expect', eyebrow: 'Pacifiers', lookImg: 'look-paci', lookCap: 'A wide shield and no loose parts', k: 'clothes',
    title: 'A pacifier is fine, and helps at sleep', verdict: ['ok', 'Your choice'],
    why: () => live() && profile.feed === 'Formula' ? 'Offering one at naps and bedtime lowers the risk of SIDS.' : 'It lowers the risk of SIDS. Nursing? Start once feeding is going well.',
    notice: ['It falls out once {s’s} asleep', 'Some babies never take one, and that’s fine'],
    helpsShort: ['Offer it after a feed, never in place of one', 'No need to put it back once {s’s} asleep', 'Sterilize it often until 6 months'],
    safe: [['No strings or clips', 'Never around {p} neck or tied to the crib'], ['One piece, never a bottle nipple', 'Replace it if it tears. Nothing sweet on it, and never honey']] };
  // Source: periodic breathing (Cleveland Clinic, KidsHealth): pauses up to 10 seconds, then quick breaths, gone by about 6 months.
  TPL['look-breathing'] = { type: 'check', eyebrow: 'Is this normal?', lookImg: 'look-breathing', lookCap: 'Chest still for a few seconds, then quick breaths', k: 'skin', title: 'Pauses in breathing', verdict: ['ok', 'Common in the first months'],
    why: 'A pause of up to 10 seconds, then quick breaths, is normal. It fades as {s} {grow|grows}.',
    notice: ['A pause, quick breaths, then steady again', 'Most often in deep sleep'],
    helpsShort: ['Keep every sleep safe: on {p} back, in a bare crib', 'A short pause, then quick breaths, needs nothing from you'],
    calls: { ped: ['Pauses still happening after 6 months', 'Snoring with long pauses', 'A pause longer than 10 seconds. Call right away'], now: 'Blue or gray lips or skin, {s} won’t wake, or {s} isn’t breathing. Start CPR, and never shake {o}.' } };
  TPL['look-crossing'] = () => ({ type: 'check', eyebrow: 'Is this normal?', lookImg: 'look-crossing', lookCap: 'One eye drifting while the other looks ahead', k: 'skin',
    title: 'Eyes that cross or wander', verdict: tplNow >= 2 || careAge() >= 4 ? ['watch', 'Worth a check now'] : ['ok', 'Common before 4 months'],
    why: tplNow >= 2 || careAge() >= 4 ? 'By about 4 months, eyes usually move together.' : 'Eye muscles are still learning to work together, so eyes that drift now and then are normal at this age.',
    notice: tplNow >= 2 || careAge() >= 4 ? ['One eye turns in or out often', 'Tilting {p} head to look at things'] : ['A drift now and then, often when tired', 'Wide skin over the nose can make eyes look crossed'],
    helpsShort: ['Mention it at {p} next checkup', 'A photo or video of it helps'],
    calls: { ped: [tplNow >= 2 || careAge() >= 4 ? 'Crossing that happens often' : 'Crossing all the time', 'A white pupil, even in a photo', 'Not looking at your face'] } });
  TPL['look-hearing'] = () => ({ type: 'check', eyebrow: 'Is this normal?', lookImg: 'look-hearing', lookCap: 'Turning toward a sound shows {s} heard it', k: 'skin',
    title: 'Most babies hear well', verdict: ['ok', 'Easy to check at home'],
    why: 'Most pass the newborn hearing test. How {s} {react|reacts} to sound tells you more.',
    notice: tplNow === 0 ? ['Startles at a loud noise', 'Calms or stills at your voice'] : tplNow === 1 ? ['Startles at a loud noise', 'Starts turning toward your voice'] : tplNow === 2 ? ['Turns toward a new sound', 'Takes turns making sounds with you'] : ['Turns when you say {p} name', 'Babbles “mamama” or “dadada”'],
    helpsShort: tplNow === 0 && careAge() < 1 ? ['Check the hospital hearing result is in', 'Not passed? A retest by 1 month'] : ['Talk and sing to {o} through the day', 'Mention any worry at {p} next checkup'],
    calls: { ped: tplNow <= 1 ? ['No startle at loud noises', 'Not turning to sounds by 4 months'] : ['Not turning toward sounds', tplNow === 3 ? 'No “mama” or “dada” by 15 months' : 'Notices you only once {s} {see|sees} you'] } });
  TPL['look-belly'] = { type: 'check', eyebrow: 'Is this normal?', lookImg: 'look-belly', lookCap: 'Soft, and it pushes out more when {s} {cry|cries}', k: 'cord', title: 'A bulging belly button', verdict: ['ok', 'Usually harmless'],
    why: 'It’s an umbilical hernia, a small gap in the muscles. Most close on their own.',
    notice: ['Bigger when {s} {cry|cries} or {strain|strains}', 'Soft, and goes back in when {s’s} calm'],
    helpsShort: ['Leave it alone. No coins, tape or binders', 'Mention it at the next checkup'],
    calls: { ped: ['It keeps getting bigger', 'It’s hard, swollen or tender, won’t go back in, or comes with vomiting. Call right away'] } };
  Object.assign(TPL['look-yellow'], { lookCap: 'Press the nose. Yellow shows as it pales', notice: ['It starts on the face, then moves down', 'On darker skin, check the eyes and gums'], helpsShort: ['Feed often. It helps clear the yellow', 'Go to every checkup, even if {s} looks fine'],
    calls: { ped: ['Yellow spreading to the belly or legs', 'Still yellow after 2 weeks', 'Any yellow in the first 24 hours. Call right away', 'Yellow and very sleepy or not feeding. Call right away', 'Pale, chalky poop. Call right away'] } });
  Object.assign(TPL['p:teething'], { why: 'It comes and goes, a few days at a time, before each new tooth.', notice: ['More drooling and chewing', 'A few fussy days'], helpsShort: ['Rub sore gums with a clean finger', 'A chilled, not frozen, teething ring', 'Skip numbing gels and teething necklaces'],
    calls: { ped: ['FEVER', 'Diarrhea', 'Very fussy or not feeding'] } });
  Object.assign(skinCare, { notice: () => stageNow() === 0 ? ['Peeling in the first weeks', 'Spots and blotches that come and go'] : ['Dry patches after baths or in cold weather', 'Redness on the chin from drool'], helpsShort: ['Short baths in plain warm water', 'Pat dry, into the creases', 'Thick, fragrance-free cream on dry patches'],
    calls: { ped: ['A rash that cracks, oozes or spreads', 'FEVER'] } });
  Object.assign(TPL['t:diapers:1'], { notice: ['Soft poop, even days apart', 'Still 6 or more wet diapers a day'], helpsShort: ['Change when wet or dirty', 'Let the skin air out before a fresh one', 'Size up when it leaks'] });
  Object.assign(TPL.poop, { notice: () => [((tplNow >= 3 && careAge() >= 6) || solids()) ? 'Thicker and smellier after solids' : tplNow === 0 && careAge() < 1 ? (live() && profile.feed === 'Formula' ? 'Wet diapers matter more than how often {s} {poop|poops}' : '3 or more poops a day by day 5') : live() && profile.feed === 'Formula' ? 'A poop most days, on formula' : 'Days apart can be normal if breastfed', 'Straining and a red face, with soft poop'],
    calls: () => ({ ped: [tplNow === 0 && careAge() < 1 && !(live() && profile.feed === 'Formula') ? 'Fewer than 3 poops a day after day 5' : 'Hard, pebble-like poop', 'Black poop after day 5', 'Blood in the poop', 'White, gray or chalky poop. Call right away', tplNow <= 1 ? 'Watery poop many times a day. Call right away' : 'Diarrhea and no wet diaper in 6–8 hours. Call right away'] }),
    helpsShort: () => ['Gas? Move {p} legs gently like pedaling a bike', ((tplNow >= 3 && careAge() >= 6) || solids()) ? 'Pears, prunes or peaches for hard poop' : 'Keep feeding as usual. Milk keeps it soft'] });
  Object.assign(TPL['t:diapers:0'], { helpsShort: ['Feed often, 8–12 times a day', 'Keep a rough count of wet diapers this week'] });
  Object.assign(TPL['t:diapers:2'], { helpsShort: ['A hand on {o} the whole change', 'Everything in reach first', 'Or change {o} on the floor'] });
  Object.assign(TPL.after1, { eyebrow: 'After age 1', title: 'Brush twice a day, and see a dentist', why: 'The rest of {p} care stays much the same.', lookImg: 'after1-brush', lookCap: 'A smear the size of a grain of rice', notice: ['Most toddlers push back on brushing', 'More teeth, often molars, by 18 months'], helpsShort: ['Brush twice a day, a rice-grain smear', 'No dentist visit yet? Book one now', 'Baths about 3 times a week are plenty'] });
  Object.assign(TPL['rash:eczema'], { helpsShort: ['Short, lukewarm baths, then thick cream on damp skin', 'Cream at least once a day, even on good days', 'Fragrance-free soap and laundry detergent'],
    calls: { ped: ['Cracked or oozing patches', 'Itching that cream doesn’t help', 'FEVER', 'Yellow crusts, pus or painful blisters. Call right away'] } });
  Object.assign(TPL['rash:peeling'], { helpsShort: ['Keep baths short, in plain water', 'A fragrance-free cream if it cracks'] });
  Object.assign(TPL['rash:newborn'], { why: 'Most fade on their own. Blue-gray patches are birthmarks, not bruises.', helpsShort: ['Nothing to treat. They fade on their own', 'Skip creams and scrubbing'], calls: { ped: ['A mark that’s raised, bleeds or grows fast', 'A bruise you can’t explain'] } });
  Object.assign(TPL['rash:acne'], { helpsShort: ['Wash with plain water once a day', 'Leave the bumps alone', 'Skip lotions, oils and acne creams'] });
  Object.assign(TPL['rash:heat'], { helpsShort: ['Cool {o} down: shade and fewer layers', 'Skip creams on it. They trap heat'] });
  Object.assign(TPL['rash:diaper'], { helpsShort: ['Change often, with a few minutes diaper-off on a towel', 'A thick layer of zinc diaper cream at every change', 'Water or fragrance-free wipes while it heals'] });
  Object.assign(TPL['rash:yeast'], { helpsShort: ['Ask your pediatrician about an antifungal cream', 'Keep changing often, and let the skin air out'] });
  Object.assign(TPL['rash:cradle'], { helpsShort: ['Wash with water or a little mild shampoo', 'Don’t pick at the flakes', 'Stubborn ones? Rub in a little olive oil, brush gently with a soft brush, then wash'], calls: { ped: ['Spreading to the face or body', 'Red, weepy or itchy'] } });


  window.changesRoute = function (p) {
    const [, cat, screen, a, b, c] = p.split(':');
    careWorry = cat === CAT && screen === 'd' && (a === 'look' || a === 'rash' || (a === 't' && (b === 'skin' || (b === 'diapers' && Number(c == null ? stageNow() : c) === 0))));
    if (cat === CAT && screen === 'd') {
      { const st = c == null ? stageNow() : Number(c), key = a === 't' || a === 'h' ? `${a}:${b}:${st}` : a === 'look' ? (c === 'poop' ? 'poop' : c ? 'look-' + c : '') : [a, b].filter(x => x != null).join(':'); if (a === 'look') tplNow = Number(b) || 0; else tplNow = st; let q = TPL[key]; if (typeof q === 'function') q = q(); if (q) return tplPage(q); }
      if (a === 'c') { const r = topic3(b, c == null ? stageNow() : Number(c)); if (r) return r; }
      if (a === 'q') { const t = Q2T[b]; const r = t ? (t[0] === 'look' ? lookOff(t[1]) : topic3(t[0], t[1])) : (q2Page(b) || qPage(b)); if (r) return r; }
      if (a === 'look') return lookOff(b == null ? null : Number(b), c);
      if (a === 'how') return careHow(b == null ? null : Number(b));
      if (a === 'h') { const r = careSteps(b, c == null ? null : Number(c)); if (r) return r; }
      if (a === 'routine') return careRoutine(b == null ? null : Number(b));
      if (a === 'p') { if (b === 'drool') return lookOff(null, 'rash'); const r = qPage(b) || q2Page(b); if (r) return r; }
      if (a === 't') { if (b === 'skin') return lookOff(c == null ? null : Number(c), 'rash'); const v = c == null ? stageNow() : Number(c), ids = T2Q[b]; if (ids) { const id = ids[v] === 'solids' && !(live() && answers.solids === 'Yes') ? 'diapers46' : ids[v] === 'six' && v === 2 && careAge() < 6 ? 'shade' : ids[v]; return qPage(id); } }
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
    { title: 'Most things that look odd are normal', lead: 'The first weeks are the busiest for care, and it gets quicker fast.',
      groups: [['Every day', [['diapers', 'Diapers', '8–12 changes a day', 'At least 6 wet a day by day 6. Wipe front to back, and let the skin dry.', 1, 'newdiapers'], ['cord', 'The cord', 'Keep it clean and dry', 'It falls off in 1–3 weeks', 1], ['teeth', 'Gums', 'Wipe twice a day', 'With a soft, clean cloth', 1, 'gums'], ['clothes', 'Clothes', 'One layer more than you', 'No hat indoors']]],
               ['Each week', [['bath', 'Sponge baths', '2 or 3 a week', 'Until the cord falls off', 1], ['nails', 'Nails', 'Trim once a week', 'They grow fast, and they’re sharp']]]] },
    { title: 'Care settles into a rhythm', lead: 'Tub baths start once the cord heals, and most days look alike now.',
      groups: [['Every day', [['diapers', 'Diapers', 'Fewer poops can be normal', 'Keep a hand on {o} at every change', 1], ['skin', 'Skin', 'Plain water on the face', 'Baby acne and cradle cap are common', 1, 'acne'], ['teeth', 'Gums', 'Wipe twice a day', 'With a soft, clean cloth', 0, 'gums'], ['clothes', 'Clothes', 'One layer more than you', 'No hat indoors']]],
               ['Each week', [['bath', 'Tub baths', 'About 3 a week', 'Hair washed in 2 or 3', 1], ['nails', 'Nails', 'Trim once a week', 'Easiest while asleep']]],
               ['Outside', [['sun', 'Sun', 'Shade first', 'Long sleeves and a wide-brimmed hat']]]] },
    { title: 'Drool and busy hands', lead: 'Teething often starts, rolling begins, and bath time gets more fun.',
      groups: [['Every day', [hasTooth() ? ['teeth', 'Teeth and teething', 'Brush twice a day', 'A rice-grain smear of toothpaste. A chilled ring helps sore gums', 1, 'teething'] : ['teeth', 'Teething', 'Chewing and drool are normal', 'Wipe gums twice a day and pat the chin dry. A chilled ring helps', 1, 'teething'], ['diapers', 'Diapers', 'Keep a hand on {o} at every change', (answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways', 'Trying to roll'].includes(answers.rollDirection)) ? 'Use the strap, or change {o} on the floor' : 'Rolling can start any day']]],
               ['Each week', [['bath', 'Baths', 'About 3 a week', 'Often part of bedtime'], ['nails', 'Nails', 'Trim once a week', '']]],
               ['Outside', [['sun', 'Sun', careAge() >= 6 ? 'Shade, then SPF 30' : 'Shade first', careAge() >= 6 ? 'Sunscreen from 6 months, on skin you can’t cover' : 'Sunscreen only if there’s no shade', careAge() >= 6 ? 1 : 0]]]] },
    { title: 'First teeth and the big tub', lead: 'From 6 months, sunscreen can join shade on sunny days.',
      groups: [['Every day', [hasTooth() ? ['teeth', 'Teeth', 'Brush twice a day', 'A rice-grain smear of fluoride toothpaste', 1, 'brush'] : ['teeth', 'Teeth', 'Brush from the first tooth', 'Until then, wipe gums twice a day', 1, 'brush'], ['diapers', 'Diaper changes', 'Keep a hand on {o}', 'A toy to hold helps with wriggling', 1], ['feet', 'Feet and shoes', 'Bare feet indoors', 'Soft shoes once walking outside', 1, 'feet']]],
               ['Each week', [['bath', 'Baths', 'About 3 a week', 'The big tub, once sitting steadily', 1], ['nails', 'Nails', 'Trim once a week', '']]],
               ['Outside', [['sun', 'Sun', 'Shade, then SPF 30', 'Again every 2 hours and after water']]]] }
  ];
  // Nov 12 (Yarden's "one home" concept): the main page shows one new change, a few things you may be noticing, and two
  // doors: "How do I…?" (every how-to, plus the care routine one tap down) and "Is this normal?" (start from what you see).
  const CARE_NEW = [
    { art: 'bath', t: 'Sponge baths until the cord falls off', d: 'Until the cord falls off, which usually takes 1–3 weeks.', cta: 'See how', go: 'p:sponge',
      see: [['acne', 'Baby acne', 'rash:acne'], ['milia', 'Newborn marks', 'rash:newborn'], ['yellow', 'Yellow skin', 'look:0:yellow']] },
    { art: 'bath', t: 'Tub baths, a few a week', d: 'The cord has healed, so the little tub is ready.', cta: 'See how', go: 'p:tub',
      see: [['acne', 'Baby acne', 'rash:acne'], ['cradle', 'Cradle cap', 'rash:cradle'], ['diaper', 'Poop colors', 'look:1:poop']] },
    { art: 'roll', t: 'Changes get more hands-on', d: 'Rolling and wriggling make diaper changes trickier.', cta: 'Change a wriggler', go: 'h:diapers:2',
      see: [['drool', 'Drool rash', 'rash:drool'], ['teething', 'Teething', 'p:teething'], ['eczema', 'Eczema', 'rash:eczema']] },
    { art: 'tooth', t: 'A tiny tooth, a new routine', d: 'Brushing twice a day starts once the first tooth is in.', cta: 'How to brush', go: 'p:brush',
      also: { t: 'The big tub, once {s} {sit|sits} steadily', cta: 'How to', go: 't:bath:3', key: 'bath' },
      see: [['teeth9', 'Teething', 'p:teething'], ['solids', 'Poop after solids', 'look:3:poop'], ['heat', 'Heat rash', 'rash:heat']] }
  ];
  const cgo = r => `openPage('chg:${CAT}:d:${r}')`;
  window.careHome = function (selected = null) {
    const h = H(), R = ROUTINE(), now = stageNow(), v = Number.isInteger(selected) && R[selected] ? selected : now, st = R[v], nx = R[v + 1];
    // Nov 14 (Yarden, born early): cord and first baths follow the calendar, not adjusted age. Once a baby born early is a
    // month old by birthday, the cord is long gone, so the first-weeks card becomes the tub-bath one.
    const realDays = typeof profile !== 'undefined' && profile.dob ? Math.floor((NOW - parse(profile.dob)) / 864e5) : 0;
    const pastCord = live() && v === now && typeof profile !== 'undefined' && profile.early && realDays >= 28 && v <= 1;
    let N = pastCord ? { art: 'bath', t: 'Tub baths, a few a week', d: 'The cord has long since healed, so tub baths are fine now.', cta: 'See how', go: 'p:tub',
      see: [['acne', 'Baby acne', 'rash:acne'], ['cradle', 'Cradle cap', 'rash:cradle'], ['diaper', 'Poop colors', 'look:1:poop']] } : CARE_NEW[v];
    if (v === 3 && v === now && live() && careAge() >= 9) N = Object.assign({}, N, { t: 'More teeth to brush, twice a day', also: Object.assign({}, N.also, { t: 'Baths in the big tub, a hand on {o}', lbl: 'Also now:' }) });
    const T = STAGE_TABLE[CAT].stages;
    const pills = h.pills('Everyday care by age', T.map((s, i) => ({ label: s.label, age: s.age, on: i === v, now: live() && i === now, onclick: `openPage('chg:${CAT}:s:${i}')` })), CAT);
    const careNote = live() && profile.early && profile.due && ageMonths(parse(profile.due), NOW) !== actualMonth() ? (() => { const adj = careAge() !== actualMonth(); return `<p class="hub-agebasis">${F(adj ? `Following Maya’s adjusted age (${monthsLabel(careAge())}), like Feeding and Sleep.` : `Following Maya’s birthday age (${monthsLabel(actualMonth())}), like Feeding and Sleep.`)} <button onclick="hubSetAgeMode('care','${adj ? 'birthday' : 'adjusted'}')">${adj ? 'Use birthday age' : 'Use adjusted age'}</button></p>`; })() : '';
    // The top card, built like Feeding's: the stage, a scene, and what's new inside.
    // Nov 21 (Yarden: rework Everyday care the way Feeding was done): Development's top card. Stage and age, headline and
    // lead full width, one real-life photo of the stage's moment in Development's frame, then what's new in its own box.
    const LIFE = [['cl-newborn', 'A dad giving his newborn a sponge bath on a towel, a hand on the baby'], ['cl-tub', 'A mom lifting her baby out of a first tub bath in a hooded towel'],
      ['cl-drool', 'A mom patting her teething baby’s drooly chin dry'], ['cl-brush', 'A dad brushing his baby’s first teeth']][v];
    const EYE = ['Newborn · first 4 weeks', '1–3 months', '4–6 months', '6–12 months'][v];
    let b = `<header class="hub-hero care-hero care-disc fd-life"><p class="hub-eyebrow">${F(EYE)}</p><h1>${F(st.title)}</h1><p class="hub-lead">${F(v === 3 && live() && careAge() >= 9 ? 'More teeth to brush, baths in the big tub, and pulling up makes changes a two-hands job.' : st.lead)}</p>`
      + `<div class="sf-photo fd-life-photo"><img src="assets/care/${LIFE[0]}.jpg?v=1" alt="${F(LIFE[1])}"></div>`
      // Nov 21 design review: one compact strip like Feeding's "Try this" (two lines at most), so the card stays near Feeding's height.
      // Nov 23 (Yarden): at 6–12 months both changes in the headline get the same weight, as two lines of one box.
      + (N.also ? `<div class="care-newbox is-two"><button onclick="${cgo(N.go)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg><span><b>${F('New now:')}</b> ${F(N.t)}. <em>${F(N.cta)} ›</em></span></button><button onclick="${cgo(N.also.go)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M6 12V6a2 2 0 0 1 4 0"/></svg><span><b>${F(N.also.lbl || 'Coming up:')}</b> ${F(N.also.t)}. <em>${F(N.also.cta)} ›</em></span></button></div>`
        : `<button class="care-newbox" onclick="${cgo(N.go)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg><span><b>${F('New now:')}</b> ${F(N.t)}. <em>${F(N.cta)} ›</em></span></button>`) + `</header>`;
    // Care at a glance (Nov 13): how often, at this age, in the same three-tile card Feeding and Sleep open with.
    { const ICON = { Diapers: 'diaper', 'Wet diapers': 'diaper', 'Sponge baths': 'bath', 'Tub baths': 'tub', Baths: 'tub', 'Nail trims': 'nail', 'Gum wipes': 'tooth', Brushing: 'tooth' };
      const PAL = [['#e3ecf7', '#3f5f8a'], ['#f4e6ee', '#87496a'], ['#e5f0e7', '#3f7350']];
      // Built exactly like Feeding's glance (same markup and styles): heading above, three tiles of label, number, line.
      const CSS = `<style>#main .fd-gl-h{margin:18px 2px 10px}#main .fd-glance{padding:10px!important}#main .fd-glance .fd-gl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}#main .fd-gl>*{all:unset;box-sizing:border-box;display:block;border-radius:12px;background:var(--sm-bg);padding:10px 10px 11px;min-width:0}#main .fd-gl small{display:block;font-size:11px;font-weight:700;color:var(--sm-ink);line-height:1.25}#main .fd-gl b{display:block;font-size:17px;line-height:1.2;letter-spacing:-.2px;color:var(--ink,#2b2732);margin-top:5px;overflow-wrap:break-word}#main .fd-gl span{display:block;font-size:11.5px;line-height:1.3;color:#6d666d;margin-top:4px}</style>`;
      b += CSS + `<h2 class="hub-h2 fd-gl-h">${F('Care at a glance')}</h2><section class="hub-card hub-glance is-static fd-glance"><div class="fd-gl">${OFTEN[v].map(([l, n, per], i) => `<div style="--sm-bg:${PAL[i][0]};--sm-ink:${PAL[i][1]}"><small>${F(l)}</small><b>${F(n)}</b><span>${F(per)}</span></div>`).join('')}</div></section>`; }
    // Right now (Nov 13 redesign, built like Feeding's "Right now for Maya"): this stage's how-tos on the page itself, not
    // behind a "How do I…?" door. Up to four rows; the one the New now card already opens is left out. Each row's line says how,
    // because how often lives in Care at a glance above.
    const SEE = N.see;
    { const NEWKEY = ['bath', 'bath', 'diapers', 'teeth'][v];
      const HINT = { 'p:sponge': 'Face first, diaper area last', 'p:tub': 'A safe hold, and 2 inches of warm water', 'cord': 'Diaper folded below it, and let it fall off',
        'h:diapers:0': 'Fresh diaper under first, then wipe', 'h:diapers:1': 'Fresh diaper under first, then wipe', 'h:diapers:2': 'Set up first, and a hand on {o}', 't:diapers:3': 'A toy to hold helps',
        'h:skin:1': 'Plain water, and cream for dry patches', 'h:skin:2': 'Plain water, and cream for dry patches', 'p:teething': 'What helps, and what to skip',
        't:bath:2': 'Bath, feed, book, sleep', 't:bath:3': 'Once {s} {sit|sits} steadily', 'p:feet': 'Soft shoes once walking outside', 'h:gums:1': 'A soft cloth on your finger', 't:sun:1': 'A hat, long sleeves and the canopy up', 't:sun:2': 'Shade first, sunscreen from 6 months', 't:sun:3': 'Again every 2 hours, after shade and a hat', 't:clothes:0': 'One layer more than you',
        't:clothes:0': 'One layer more than you', 'p:brush': 'A rice-grain smear, twice a day' };
      const nail = r => /^t:nails/.test(r) ? 'While {s} {sleep|sleeps}, with a file or clippers' : null;
      // What matters most at each stage, in order (Nov 13: everything important shows on the page; "All how-tos" only adds the rest).
      // Nov 22 (Yarden): only what changes at this stage shows here; everything else lives in All how-tos.
      const ORDER = [['diapers', 'cord', 'nails', 'clothes'], ['skin', 'sun'], ['bath'], ['bath', ...(!live() || careAge() >= 8 ? ['diapers'] : []), 'sun', ...(!live() || careAge() >= 9 || now < 3 ? ['clothes'] : [])]][v];   // shoes only once walking is near
      const tiled = new Set(SEE.map(x => x[2])), byKey = k => HOWTO[v].find(x => x[0] === k);
      const rows = ORDER.map(byKey).filter(x => x && x[0] !== NEWKEY && !(N.also && x[0] === N.also.key) && !tiled.has(x[3])).slice(0, 4);   // nothing twice: a tile that opens the same page wins
      // Nov 21: each row previews its page with a small real-life photo, like Feeding's guide rows (92px, full row height).
      const THUMB = { diapers: v >= 2 ? 'th-wriggle' : 'th-diaper', cord: 'th-cord', nails: 'th-nails', clothes: 'th-dress', skin: 'th-skin', sun: 'th-sun', bath: v >= 3 ? 'th-bigtub' : v === 2 ? 'th-bath5' : 'th-tub', feet: 'th-feet', teeth: 'th-brush' };
      const prow = (k, t, sub, on) => THUMB[k] ? `<button class="hub-row fd-prow" onclick="${on}"><span class="fd-thumb"><img src="assets/care/${THUMB[k]}.jpg?v=3" alt="" loading="lazy"></span><span class="hub-row-copy"><b>${F(t)}</b><small>${F(sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>` : rowK(k, t, sub, on);
      b += h2(v === now || !live() ? 'Right now for Maya' : 'At this stage') + `<div class="hub-list fd-plist">${rows.map(([k, t, sub, r]) => prow(r === 'p:feet' ? 'feet' : k, t, HINT[r] || nail(r) || sub, cgo(r))).join('')}</div>`
        + `<div class="hub-list">${rowK('need', 'All how-tos', 'Every step-by-step for this age', cgo('how:' + v))}</div>`; }
    // Is this normal? The three things parents most often see at this stage, as pictures, and one way into everything else.
    b += `<h2 class="hub-h2">${F('Is this normal?')}</h2><div class="care-see">${SEE.map(([id, t, r]) => `<button onclick="${cgo(r)}"><span class="care-see-art">${window.careMini ? careMini(id) : ''}</span><b>${F(t)}</b></button>`).join('')}</div>`;
    b += `<div class="hub-list" style="margin-top:10px">${rowK('look', 'Something else look off?', 'Find the one that matches', cgo('look:' + v))}</div>`;
    const NEXT_SUB = ['Tub baths and a weekly routine.', 'Most babies start drooling a lot. A bib saves outfits.', 'Get sunscreen and a soft toothbrush ready.', 'Twice-a-day brushing and a first dentist visit.'][v];
    b += nx ? h.next(v === 0 ? 'Next · after the first few weeks' : `Next · usually from ${STAGE[v + 1].split('–')[0]} months`, nx.title, `openPage('chg:${CAT}:s:${v + 1}')`, '', NEXT_SUB)
      : h.next('Next · after the first birthday', 'Brushing and baths after 1', `openPage('chg:${CAT}:d:after1')`, '', NEXT_SUB);
    b += h.note('Ages are typical. Every baby moves at their own pace.');
    return `<div class="quiet-category hub-page care-v2" data-overview="${CAT}" data-care-stage="${v}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${careNote}${b}</div>`;
  };
  const routeLine = ([k, label, val, sub, isNew, pg], v) => pg ? cgo('p:' + pg) : k === 'cord' ? cgo('cord') : go(k, v);
  // "How do I…?" (Nov 12): how-tos named as the task ("Give a tub bath"), the ones useful at this age first; then the
  // care routine one tap down; then any other topic.
  const HOWTO = [
    [['bath', 'Give a sponge bath', '2–3 a week, until the cord falls off', 'p:sponge'], ['diapers', 'Change a diaper', '8–12 changes a day at first', 'h:diapers:0'], ['cord', 'Keep the cord stump clean', 'Keep it clean and dry', 'cord'], ['nails', 'Trim tiny nails', 'Check once or twice a week', 't:nails:0'], ['clothes', 'How warm to dress {o}', 'One layer more than you', 't:clothes:0'], ['paci', 'Offer a pacifier', 'At sleep, once feeding is going well', 'p:pacifier']],
    [['bath', 'Give a tub bath', 'About 3 a week, with a safe hold', 'p:tub'], ['diapers', 'Change a diaper', 'About 6–10 changes a day', 'h:diapers:1'], ['skin', '{P} skin needs less care', 'Plain water, and cream for dry patches', 'h:skin:1'], ['nails', 'Trim tiny nails', 'Check once or twice a week', 't:nails:1'], ['teeth', 'Wipe {p} gums', 'A soft cloth, twice a day', 'h:gums:1'], ['sun', 'Keep {o} in the shade', 'Shade and clothing first', 't:sun:1'], ['paci', 'Offer a pacifier', 'Safe at sleep, and your choice', 'p:pacifier']],
    [['diapers', 'Change a wriggler', 'Set up first, and a hand on {o}', 'h:diapers:2'], ['teeth', 'Teething makes gums sore', 'What helps, and what to skip', 'p:teething'], ['bath', 'Bath, then bed', 'About 3 a week, often at bedtime', 't:bath:2'], ['skin', '{P} skin needs less care', 'Plain water, and cream for dry patches', 'h:skin:2'], ['nails', 'Trim tiny nails', 'Check once or twice a week', 't:nails:2'], ['sun', 'Keep {o} in the shade', 'Shade, then sunscreen from 6 months', 't:sun:2']],
    [['teeth', 'Brush that first tiny tooth', 'Twice a day, a rice-grain smear', 'p:brush'], ['bath', 'Move to the big tub', 'About 3 a week, once {s} {sit|sits} steadily', 't:bath:3'], ['diapers', 'Diaper changes on the move', 'A toy to hold helps', 't:diapers:3'], ['clothes', 'Bare feet first, shoes later', 'Soft shoes once walking outside', 'p:feet'], ['nails', 'Trim tiny nails', 'Check once or twice a week', 't:nails:3'], ['sun', 'Sunscreen from 6 months', 'SPF 30, again every 2 hours', 't:sun:3']]
  ];
  // How often, at a glance: three tiles in Sleep's glance style, each the same shape (what, how many, per what).
  const OFTEN = [
    [['Diapers', '8–12', 'A day'], ['Sponge baths', '2–3', 'A week'], ['Nail trims', '1–2', 'A week']],
    [['Wet diapers', '6+', 'A day'], ['Tub baths', 'About 3', 'A week'], ['Nail trims', '1', 'A week']],
    [['Baths', 'About 3', 'A week'], ['Gum wipes', '2', 'A day'], ['Nail trims', '1', 'A week']],
    [['Brushing', '2', 'A day'], ['Baths', 'About 3', 'A week'], ['Nail trims', '1', 'A week']]
  ];
  // Every topic named as the task, like the how-tos above it.
  const TASK = { diapers: 'Change a diaper', bath: 'Give a bath', skin: 'Keep skin comfortable', clothes: 'Dress {o}', sun: 'Keep {o} sun-safe', teeth: 'Care for gums and teeth', nails: 'Trim nails, clean ears and nose' };
  const TASK_SUB = { diapers: 'Wipe front to back, and let it dry', bath: 'About 3 a week', skin: 'Plain water, and moisturizer for dry patches', clothes: 'One layer more than you', sun: 'Shade and clothing first', teeth: 'Wipe gums twice a day', nails: 'Files, clippers and tiny fingers' };
  // Step-by-step pages for the How do I… rows that used to open a chart or a picker: one way to do the task,
  // then a single link to what's normal. Same shape as every other how-to.
  const STEPS = {
    diapers: v => v === 2 ? ['Change a wriggler', 'Rolling can start any day, so set up first.', [
        ['bag', 'Set up first', 'Wipes and diaper in reach'], ['hand', 'A hand on {o}', 'Never step away'],
        ['toy', 'Something to hold', 'Or sing the same song each time'], ['mat', 'Too wriggly?', 'A mat on the floor']],
        null, ['Poop or pee looks different', 'Colors, and when to call', 'look:2:poop']]
      : ['Change a diaper', v === 0 ? 'About 8–12 a day in the first weeks. Open the fresh diaper before you start.' : 'Change {o} when wet or dirty, about 6 or more a day.', [
        ['hand', 'A hand on {o}', 'On a flat surface'], ['diaper', 'Wipe front to back', 'Water or unscented wipes'],
        ['drop', 'Let it air-dry', 'Then slide a fresh one under {o}'], v === 0 ? ['cord', 'Fasten it below the cord stump', 'Snug, but two fingers fit at the waist'] : ['sizes', 'Fasten it snug', 'With room for two fingers at the waist']],
        v === 0 ? null : ['Time for the next size', 'Leaks, or red marks at the legs or waist.'],
        v === 0 ? ['What’s in the diaper, the first weeks', 'How many, and what color', 't:diapers:0'] : ['Fewer poops can be normal', 'And when to call', 't:diapers:1']],
    skin: v => ['{P} skin needs less care, not more', 'Washing too often, or too many products, can dry it out.', [
        ['bath', 'Plain warm water', 'About 3 baths a week'], ['towel', 'Pat dry', 'Into the creases'],
        ['drop', 'Cream for dry patches', 'Thick, fragrance-free, after the bath'],
        v >= 2 ? ['smile', 'Drool rash', 'Wipe the chin dry, then petroleum jelly'] : ['shirt', 'Soft cotton', 'Washed fragrance-free']],
        null, ['Spots, bumps or patches of dry skin', v >= 2 ? 'Drool rash, eczema, heat rash' : 'Rashes, acne, cradle cap', 't:skin:' + v]],
    gums: v => ['Wipe {p} gums morning and night', 'It makes brushing feel familiar once teeth come in.', [
        ['hand', 'A cloth on your finger', 'Clean and damp'], ['tooth', 'Wipe gently', 'The top and bottom gums'], ['clock', 'No toothpaste yet', 'Until the first tooth comes in']],
        v === 0 ? ['Tiny white bumps on the gums', 'Normal in newborns, and they go away on their own.'] : ['What’s next', 'The first tooth usually comes around 6 months.'], null]
  };
  window.careSteps = function (k, v) {
    v = Number.isInteger(v) && v >= 0 && v <= 3 ? v : stageNow();
    if (!STEPS[k]) return null;
    const [title, lead, steps, tip, link] = STEPS[k](v), h = H(), ic = { gums: 'teeth' }[k] || k;
    let b = head(ic, { diapers: 'Diapers', skin: 'Skin and rashes', gums: 'Teeth' }[k], title, lead) + h2('Step by step') + hubIconSteps(steps, CAT, F(steps.map(t => t[1] + ': ' + t[2]).join('. ')));
    if (tip) b += h.tip(tip[0], tip[1]);
    if (k === 'diapers') b += rashBlock();   // diaper rash care and when to call, as the old diaper pages had it
    if (link) b += `<div class="hub-list care-link">${rowK(k === 'skin' ? 'skin' : 'diapers', link[0], link[1], cgo(link[2]))}</div>`;
    return page(ic, b);
  };
  window.careHow = function (v) {
    v = Number.isInteger(v) && v >= 0 && v <= 3 ? v : stageNow();
    const list = HOWTO[v], GC = [['#e3f1f7', '#2a6078'], ['#e7effc', '#46638c'], ['#f8e9f0', '#8a4a67']];
    let b = head('bath', 'Everyday care · ' + STAGE[v], 'How do I…?', 'Steps for the care you do again and again.');
    // How often lives on each task's own line (one home per fact), not in a separate set of tiles.
    // One list: this age's how-tos first, then any other topic, so there's no second heading for a card or two.
    const listed = new Set(list.map(x => ({ cord: 'skin' }[x[0]] || x[0])));
    const more = BASICS.filter(([k]) => !listed.has(k));
    b += h2(`Useful at ${v === 0 ? 'this age' : STAGE[v]}`) + `<div class="hub-list">${list.map(([k, t, sub, r]) => rowK(k, t, sub, cgo(r))).join('')}${more.map(([k]) => k === 'teeth' && v < 3 ? rowK(k, 'Clean gums', 'A soft cloth, twice a day', cgo('h:gums:' + v)) : k === 'skin' ? rowK(k, TASK[k], 'Plain water, and cream for dry patches', cgo('h:skin:' + v)) : rowK(k, TASK[k], TASK_SUB[k], go(k, v))).join('')}</div>`;
    return page('bath', b);
  };
  window.careRoutine = v => careHow(v);   // the routine is the "How often" glance now

})();
