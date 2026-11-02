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
  const COL = { diapers: ['#e7effc', '#46638c', '#9fb8df', '#d9e5fc'], bath: ['#e3f1f7', '#2a6078', '#8cc1d6', '#cfe9f4'], skin: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'], clothes: ['#efedff', '#625084', '#b4a5dc', '#e5e0fc'], sun: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'], teeth: ['#e6f5ec', '#356651', '#9bc7ac', '#ddf1e5'], nails: ['#fdeef2', '#a24d6a', '#f2b8c6', '#f4d6c4'], cord: ['#fdeef2', '#a24d6a', '#f2b8c6', '#f4d6c4'], need: ['#f5f1ea', '#4d443b', '#d8cbb8', '#ece6dc'] };
  const ICON = { diapers: 'diaper', bath: 'bath', skin: 'drop', clothes: 'shirt', sun: 'sun', teeth: 'tooth', nails: 'nail', cord: 'cord', need: 'bag' };
  const ART = {
    diapers: c => `<path d="M6 8h44v6a22 18 0 0 1-44 0Z" fill="${c[2]}"/><circle cx="66" cy="24" r="8" fill="${c[3]}"/>`,
    bath: c => `<rect x="4" y="18" width="52" height="16" rx="8" fill="${c[2]}"/><circle cx="22" cy="12" r="5" fill="${c[3]}"/><circle cx="34" cy="9" r="4" fill="${c[3]}"/>`,
    skin: c => `<circle cx="18" cy="20" r="14" fill="${c[2]}"/><circle cx="14" cy="16" r="2.5" fill="${c[3]}"/><circle cx="22" cy="23" r="2" fill="${c[3]}"/><rect x="40" y="18" width="34" height="8" rx="4" fill="${c[3]}"/>`,
    clothes: c => `<path d="M8 10l10-6h16l10 6-5 8h-4v16H17V18h-4Z" fill="${c[2]}"/><rect x="54" y="22" width="22" height="10" rx="5" fill="${c[3]}"/>`,
    sun: c => `<circle cx="20" cy="20" r="12" fill="${c[2]}"/><rect x="42" y="24" width="34" height="8" rx="4" fill="${c[3]}"/>`,
    teeth: c => `<rect x="6" y="10" width="14" height="20" rx="7" fill="${c[2]}"/><rect x="24" y="10" width="14" height="20" rx="7" fill="${c[2]}"/><rect x="46" y="22" width="28" height="8" rx="4" fill="${c[3]}"/>`,
    nails: c => `<rect x="10" y="6" width="14" height="28" rx="7" fill="${c[2]}"/><rect x="12" y="6" width="10" height="9" rx="4" fill="${c[3]}"/><circle cx="50" cy="24" r="8" fill="${c[3]}"/>`,
    cord: c => `<circle cx="20" cy="20" r="13" fill="${c[2]}"/><circle cx="20" cy="20" r="4" fill="${c[3]}"/>`,
    need: c => `<rect x="6" y="12" width="36" height="24" rx="6" fill="${c[2]}"/><path d="M16 12a8 7 0 0 1 16 0" stroke="${c[2]}" stroke-width="3" fill="none"/><rect x="50" y="24" width="24" height="8" rx="4" fill="${c[3]}"/>`
  };
  const go = (k, v) => `openPage('chg:${CAT}:d:t:${k}${v == null ? '' : ':' + v}')`;
  const rowK = (k, title, sub, onclick) => { const c = COL[k];
    return `<button class="hub-row hl-row" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="${onclick}"><span class="hub-dot">${hubArt(ICON[k], CAT)}</span><span class="hub-row-copy"><b>${F(title)}</b>${sub ? `<small>${F(sub)}</small>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  const tile = (k, t) => `<button class="care-tile" style="--hl-bg:${COL[k][0]};--hl-ink:${COL[k][1]}" onclick="${go(k)}"><span class="care-tile-ic">${hubArt(ICON[k], CAT)}</span><b>${F(t)}</b></button>`;

  const BASICS = [['diapers', 'Diapers'], ['bath', 'Baths and hair'], ['skin', 'Skin and rashes'], ['clothes', 'Clothes'], ['sun', 'Sun and heat'], ['teeth', 'Gums and teeth'], ['nails', 'Nails, ears, nose'], ['need', 'What you’ll need']];
  const HOME = [
    { title: 'Diapers, the cord and first baths', lead: 'It feels like a lot at first, and it gets quicker fast.',
      news: () => [['diapers', 'How to change a diaper', '8–12 a day for now', go('diapers')], ['cord', 'Cord stump care', 'Clean and dry until it falls off', `openPage('chg:${CAT}:d:cord')`], ['bath', 'Sponge baths', 'Until the cord falls off', go('bath')]] },
    { title: 'Tub baths and skin care', lead: 'The cord has healed, and care settles into a rhythm.',
      news: () => [['bath', 'Giving a tub bath', 'Once the cord has healed', go('bath')], ['skin', 'Baby acne and cradle cap', 'Common now, and easy to care for', go('skin')]] },
    { title: 'Drool, sun and busy hands', lead: 'Busy hands, lots of drool, and more time outside.',
      news: () => [['teeth', 'Sore gums and drool', 'What helps before the first tooth', go('teeth')], ['sun', 'Sun protection', careAge() >= 6 ? 'Shade first, and sunscreen now' : 'Shade first, sunscreen from 6 months', go('sun')]] },
    { title: 'First teeth and first steps', lead: 'Maya sits up, pulls up, and the first teeth arrive.',
      news: () => [['teeth', hasTooth() ? 'Brushing the first teeth' : 'Brushing starts with the first tooth', 'Twice a day, a rice-grain smear', go('teeth')], ['bath', 'The big tub', 'Once {s} {sit|sits} steadily', go('bath')], ['clothes', 'Shoes, or bare feet?', 'Bare feet indoors, soft shoes outside', go('clothes')]] }
  ];

  /* ---------- the home ---------- */
  window.careHome = function (selected = null) {
    const h = H(), now = stageNow(), v = Number.isInteger(selected) && HOME[selected] ? selected : now, st = HOME[v];
    const T = STAGE_TABLE[CAT].stages;
    const pills = h.pills('Everyday care by age', T.map((s, i) => ({ label: s.label, age: s.age, on: i === v, now: live() && i === now, onclick: `openPage('chg:${CAT}:s:${i}')`, change: typeof stageCanChange === 'function' && stageCanChange(CAT, i, now) ? `hubChangeStage('${CAT}',${i})` : '' })), CAT);
    const careNote = live() && profile.early && profile.due && ageMonths(parse(profile.due), NOW) !== actualMonth() ? (() => { const adj = careAge() !== actualMonth(); return `<p class="hub-agebasis">${F(adj ? `Following Maya’s adjusted age (${monthsLabel(careAge())}), like Feeding and Sleep.` : `Following Maya’s birthday age (${monthsLabel(actualMonth())}), like Feeding and Sleep.`)} <button onclick="hubSetAgeMode('care','${adj ? 'birthday' : 'adjusted'}')">${adj ? 'Use birthday age' : 'Use adjusted age'}</button></p>`; })() : '';
    let b = `<header class="hub-hero care-hero"><p class="hub-eyebrow">${STAGE[v]}</p><h1>${F(st.title)}</h1><p class="hub-lead">${F(st.lead)}</p></header>`;
    b += `<h2 class="hub-h2">${F(v === now && live() ? 'Right now' : 'At this stage')}</h2><div class="hub-list">${st.news().map(([k, t, s, on]) => rowK(k, t, s, on)).join('')}</div>`;
    b += `<h2 class="hub-h2">All the basics</h2><div class="care-grid">${BASICS.map(([k, t]) => tile(k, t)).join('')}</div>`;
    b += h.versus('Every change and every bath', ['Always', 'Gather everything first, and keep a hand on Maya.'], ['Never', 'Step away, even for a moment. Take {o} with you.']);
    const nx = HOME[v + 1];
    b += nx ? h.next(v === 0 ? 'Coming up after the first few weeks' : `Coming up at ${STAGE[v + 1].split('–')[0]} months`, nx.title, `openPage('chg:${CAT}:s:${v + 1}')`)
      : h.next('After the first birthday, usually 12–18 months', 'Toddler baths and first shoes', `openPage('chg:${CAT}:d:after1')`);
    b += h.note('Sleep sacks are in Sleep, and fevers and colds in Health. Ages are typical, and every baby moves at their own pace.');
    return `<div class="quiet-category hub-page care-v2" data-overview="${CAT}" data-care-stage="${v}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${careNote}${b}</div>`;
  };

  /* ---------- shared pieces for topic pages ---------- */
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
  const TOPIC = {
    diapers(v) {
      const h = H();
      const qa = [
        [['How many a day?', '8–12', 'Change when wet or dirty.'], ['Which size?', 'Newborn', 'Size 1 from about 8–10 pounds.']],
        [['Wet diapers', '6 or more a day', 'The sign {s’s} getting enough milk.'], ['Which size?', 'Size 1 or 2', 'Leaks or red marks at the legs mean size up.']],
        [['Wet diapers', '6 or more a day', 'Poops can space out, and that’s normal.'], ['Which size?', 'Size 2 or 3', 'Leaks or red marks at the legs mean size up.']],
        [['Wet diapers', '6 or more a day', 'Poop looks more like food now.'], ['Which size?', 'Size 3 or 4', 'Leaks or red marks at the legs mean size up.']]
      ][v];
      let b = head('diapers', ctx(v), 'Diapers', v === 0 ? 'How to change one, and what’s normal in there.' : 'How many, how to change one, and diaper rash.') + h.qa(qa);
      b += h2(v === 3 ? 'Wriggly changes' : 'How to change a diaper') + (v === 3 ? h.steps(['Hand {o} a toy to hold, or sing the same song each time.', 'Keep one hand on {o} on the changing table, always.', 'Once {s} {pull|pulls} up, a change standing up can be easier.']) : changeSteps());
      b += h.versus('Normal, or time to call?', ['Normal', (v === 0 ? 'Black, sticky poop for the first 3–4 days, then mustard-yellow' : 'Mustard-yellow') + ' if breastfed, yellow-tan if formula. Several a day to one every few days.'], ['Call your pediatrician', '4 or fewer wet diapers in a day. White, gray or red poop, or black after the first few days.']);
      b += fold('More about diapers', [
        ['Diaper rash', 'What helps, and when to call', rashSteps()],
        v === 0 && ['In the first weeks', 'The cord, and wipes or a washcloth', p_('Fold the top of the diaper down so the cord stump stays in the air.') + p_('Fragrance-free wipes or a soft washcloth and warm water both work.')],
        v === 0 && ['Cleaning down there', 'For girls and boys', p_('Always wipe front to back. In newborn girls, a little white discharge or a spot of blood is normal in the first weeks.') + p_('If uncircumcised, wash the outside only; don’t pull back the foreskin. If circumcised, put a dab of petroleum jelly on the tip at each change until it heals, in about 7–10 days. Call if there’s bleeding, swelling or pus.')],
        v === 2 && ['Once solids start', 'Usually around 6 months', p_('Poop gets thicker, browner and smellier, and can take on the color of what {s} ate.')],
        ['Sizes', 'When to move up', p_('Most babies start in newborn size and move to size 1 at around 8–10 pounds. Sizes overlap, so go by fit: leaks or red marks at the legs mean it’s time to size up.')],
        changes('diapers', ['8–12 a day. Fold the top below the cord.', '6 or more wet ones a day. Size up when leaks start.', 'Once solids start, poop changes.', 'Wriggly changes. A toy in hand helps.'], v)
      ]);
      return page('diapers', b);
    },
    bath(v) {
      const h = H();
      let b = head('bath', ctx(v), 'Baths and hair', ['Sponge baths until the cord stump falls off.', 'Once the cord has healed, a baby tub.', 'The same tub bath, often part of bedtime now.', 'Sitting up, then the big tub.'][v]);
      b += h.qa([
        [['How often?', '2–3 a week', 'In between, wipe {p} face, neck and diaper area.']],
        [['How often?', '2–3 a week', 'In about 2 inches of warm water, around 100°F.']],
        [['How often?', '2–3 a week', 'In about 2 inches of warm water, around 100°F.']],
        [['Where?', 'The big tub', 'Once {s} {sit|sits} steadily. Water no higher than {p} waist.']]
      ][v]);
      if (v === 0) b += h2('Give a sponge bath') + hubIconSteps([['home', 'Warm room, towel down', 'Everything within reach'], ['drop', 'Face, then body', 'Plain water, one part at a time'], ['towel', 'Diaper area last', 'Pat dry, into the skin folds']], CAT, 'Warm the room and lay baby on a towel. Wash the face, then the body one part at a time, then the diaper area last, and pat dry.');
      if (v === 1 || v === 2) b += h2('Give a tub bath') + h.steps(['Gather everything first: towel, washcloth, mild soap and a clean diaper.', 'Test the water with your wrist. It should feel warm, not hot.', 'Support {p} head and neck with one arm, and wash top to bottom with the other.', 'Lift {o} out onto the towel and wrap {o} up right away.']);
      if (v === 3) b += h2('In the big tub') + h.steps(['Use a non-slip mat, and keep the water about waist-high when {s’s} sitting.', 'Keep a hand on Maya the whole bath. Expect {o} to try to pull up.', 'A bath seat helps {o} sit, but it isn’t a safety seat. Stay within arm’s reach.']);
      b += h.versus('Every bath', ['Always', 'Gather everything first, then keep a hand on Maya the whole bath.'], ['Never', 'Step away, even for a moment. Babies can slip under in seconds. Take {o} with you.']);
      b += fold('More about baths', [
        v === 0 && ['Watch how it’s done', 'A short video', hubEmbed('uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth')],
        v === 0 && ['Keeping {o} warm', 'Eyes, creases and folds', p_('Keep {o} wrapped in a towel and uncover one part at a time. Wipe each eye from the inside corner out, and get into the creases of the neck, arms and legs.') + p_('About 5 minutes in a warm room is plenty.')],
        (v === 1 || v === 2) && ['Watch how it’s done', 'A short video', (window.hubFigure ? hubFigure('tub', CAT, 'A baby lying back in a baby tub with about 2 inches of warm water, a hand supporting the head and neck.') : '') + hubEmbed('VsUla1M7eHQ', 'How to give your baby a tub bath', 'Nemours KidsHealth')],
        v === 2 && ['Bath as part of bedtime', 'Bath, feed, book, bed', `<div class="hub-list care-link">${rowK('bath', 'Start a bedtime routine', 'In Sleep', "openPage('chg:Sleep:d:routine')")}</div>`],
        v > 0 && ['Washing hair', 'Once or twice a week', p_('A little mild baby shampoo is plenty. Rinse with a wet washcloth, front to back, so it stays out of {p} eyes.')],
        ['Water heater', 'Set it to 120°F or lower', p_('At 120°F or lower, tap water can’t scald.')],
        changes('bath', ['Sponge baths until the cord falls off.', 'Baby tub, 2–3 times a week.', 'Often part of bedtime now.', 'Sitting up, then the big tub.'], v)
      ]);
      return page('bath', b);
    },
    skin(v) {
      const h = H(), common = [['peeling', 'acne'], ['acne', 'cradle'], ['drool', 'eczema'], ['eczema', 'diaper']][v];
      let b = head('skin', ctx(v), 'Skin and rashes', 'Most baby rashes are harmless. Find the one you’re seeing.');
      b += `<div class="hub-list">${RASH_ORDER.map(id => { const r = RASH[id];
        return `<button class="hub-row care-rash" onclick="openPage('chg:${CAT}:d:rash:${id}')"><span class="hub-row-copy"><b>${F(r.t)}${common.includes(id) ? ' <em class="care-tag">Common now</em>' : ''}</b><small>${F(r.look)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`; }).join('')}</div>`;
      b += rashCall();
      b += fold('More about skin', [['Everyday skin care', 'Soap, moisturizer and laundry', h.steps(['Plain water is enough for most baths. Use a mild, fragrance-free soap only where needed.', 'Pat on a fragrance-free moisturizer while the skin is still damp.', 'Wash {p} clothes in a fragrance-free detergent.'])]]);
      return page('skin', b);
    },
    clothes(v) {
      const h = H();
      let b = head('clothes', ctx(v), 'Clothes', v === 3 ? 'Dressing for the weather, and bare feet for first steps.' : 'Babies can’t tell you they’re too hot or cold, so one rule helps.');
      b += h.qa(v === 3 ? [['Indoors', 'Bare feet', 'They help with balance while {s} {learn|learns} to walk.'], ['Outside', 'Soft shoes', 'Flexible soles, once {s’s} walking.']]
        : [['How many layers?', 'One more than you', 'Sweaty neck means too warm. Cool means add a layer.'], ['For sleep', 'Pajamas and a sleep sack', 'Snug-fitting. No hats or loose blankets.']]);
      if (v < 3) b += `<figure class="hub-figure hub-layers" role="img" aria-label="Dress baby in one more layer than you’re wearing."><div><span>${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}</span><b>${F('You')}</b><small>${F('Comfortable in 2 layers')}</small></div><i aria-hidden="true">+1</i><div class="is-baby"><span>${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}${hubArt('shirt', CAT)}</span><b>${F('Maya')}</b><small>${F('Needs 3')}</small></div></figure>`;
      if (v === 3) b += hubIconSteps([['home', 'Indoors: bare feet', 'They help with balance and feeling the floor'], ['sun', 'Outside: soft shoes', 'Flexible soles, room for toes, once walking']], CAT, 'Bare feet indoors. Soft, flexible shoes outside once walking.', false);
      b += fold('More about clothes', [
        v === 0 && ['Getting clothes on', 'Over a floppy head', p_('Stretch the neck opening wide and ease it over the back of {p} head first, then the face. Snaps or a zip down the front are easiest at first.')],
        v === 3 && ['Dressing for the weather', 'One more layer than you', p_('Feel the back of {p} neck. Sweaty means too warm; cool means add a layer. For sleep, snug-fitting pajamas and a sleep sack, no hats or loose blankets.')],
        v === 3 && ['Walkers', 'Skip the ones on wheels', p_('They don’t help with walking, and they can lead to falls down stairs.')],
        ['In the car seat', 'No puffy coats', p_('Take off puffy coats first. Buckle {o} in, then put a blanket over the straps.')],
        ['Sleep sacks and swaddles', 'In Sleep', `<div class="hub-list care-link">${rowK('clothes', 'What to use, and when to stop swaddling', 'In Sleep', "openPage('chg:Sleep:safe')")}</div>`],
        changes('clothes', ['One more layer than you, and easy snaps.', 'One more layer than you.', 'Layers for the season, and bibs for drool.', 'Bare feet indoors, soft shoes outside.'], v)
      ]);
      return page('clothes', b);
    },
    sun(v) {
      const h = H(), six = v === 3 || (v === 2 && careAge() >= 6) || (!live() && v >= 2);
      let b = head('sun', ctx(v), 'Sun and heat', six ? 'Shade still comes first, and sunscreen joins in now.' : 'Young skin burns easily, so shade comes first.');
      b += h.qa([six ? ['Sunscreen?', 'Yes, SPF 30 or more', 'Broad-spectrum, every 2 hours and after water.'] : ['Sunscreen?', 'From 6 months', 'Until then, shade and a hat. A little on the face only if there’s no shade.']]);
      b += h.steps(six ? ['Shade and a wide-brimmed hat, even with sunscreen on.', 'Sunscreen on skin you can’t cover, 15 minutes before going out.', 'Reapply every 2 hours, and after water play.'] : ['Keep {o} in the shade, especially in the middle of the day.', 'Light, long sleeves and a wide-brimmed hat.']);
      b += h.versus('Normal, or time to call?', ['Normal', 'A little sweaty and pink, cooling down quickly in the shade.'], ['Call your pediatrician', 'Fewer wet diapers than usual, or any sunburn before 1 year.']) + h.tip('Get help right away', 'Hot and flushed and hard to wake, floppy, or not feeding: get {o} somewhere cool and call 911.');
      b += fold('More about sun and heat', [
        ['Hot days', 'Layers, feeds and the stroller', h.steps(['One light layer, and the shade or indoors at midday.', !six ? 'Offer milk feeds more often. Under 6 months, milk is all {s} {need|needs}, no water.' : 'Offer milk feeds more often, and small sips of water once {s’s} eating solids.', 'Don’t drape a blanket over the stroller. It traps heat. Use the canopy or a clip-on shade.'])],
        ['At the pool or beach', 'What to bring', p_('Swim diapers, a sun shirt and a hat' + (six ? ', and a mineral sunscreen (zinc oxide).' : '.') + ' Keep a hand on {o} in any water, even shallow.')],
        six && ['What “broad-spectrum” means', 'On the label', p_('It blocks both kinds of the sun’s UV rays. Look for it on the label, with SPF 30 or more.')],
        changes('sun', ['Shade and a hat, no sunscreen yet.', 'Shade and a hat, no sunscreen yet.', 'Sunscreen can start at 6 months.', 'Shade, a hat and SPF 30.'], v)
      ]);
      return page('sun', b);
    },
    teeth(v) {
      const h = H(), tooth = hasTooth();
      const paste = `<figure class="hub-figure hub-paste" role="img" aria-label="Use a smear of toothpaste the size of a grain of rice, not a pea-sized amount."><div class="is-yes"><svg viewBox="0 0 160 60" aria-hidden="true"><rect x="58" y="34" width="96" height="14" rx="7" fill="#cfe3db"/><rect x="8" y="30" width="56" height="20" rx="8" fill="#a9cbbd"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${12 + i * 5.6}" y="16" width="3.4" height="15" rx="1.7" fill="#cfe3db"/>`).join('')}<ellipse cx="34" cy="14" rx="4.5" ry="2.6" fill="#fff" stroke="#7fb0cc" stroke-width="1.3"/></svg><b>✓ ${F('A grain of rice')}</b><small>${F('Under 3 years')}</small></div><div class="is-no"><svg viewBox="0 0 160 60" aria-hidden="true"><rect x="58" y="34" width="96" height="14" rx="7" fill="#cfe3db"/><rect x="8" y="30" width="56" height="20" rx="8" fill="#a9cbbd"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${12 + i * 5.6}" y="16" width="3.4" height="15" rx="1.7" fill="#cfe3db"/>`).join('')}<circle cx="34" cy="8" r="9" fill="#fff" stroke="#7fb0cc" stroke-width="1.3"/></svg><b>${F('Not a pea')}</b><small>${F('That’s from age 3')}</small></div></figure>`;
      const brushing = v === 3 && tooth;
      const lead = v < 2 ? 'Nothing to do yet. Here’s what’s coming.' : v === 2 ? 'Drooling and chewing on everything are normal now.' : tooth ? 'Brushing keeps the first teeth healthy.' : 'Brushing starts with the first tooth.';
      let b = head('teeth', ctx(v), brushing ? 'Brush the first teeth' : 'Gums and teeth', lead);
      b += h.qa([v === 3 ? (tooth ? ['How often?', 'Twice a day', 'A rice-grain smear of fluoride toothpaste, including before bed.'] : ['No tooth yet?', 'That’s normal', 'Some babies don’t get one until around the first birthday.']) : ['When’s the first tooth?', 'Around 6 months', 'Anywhere from about 4 to 12 months is normal.']]);
      const gumSteps = h.steps(['Wipe {p} gums with a clean, damp cloth once a day.', 'Keep a soft bib on and pat the chin dry, to avoid a drool rash.', 'Offer a cool, firm teething ring if {s} {seem|seems} sore.']);
      const skip = h.tip('Skip these', 'Teething necklaces, numbing gels and tablets. Ask your pediatrician about pain relief if needed.');
      const brushHow = paste + h.steps(['Brush gently twice a day with a soft baby toothbrush and fluoride toothpaste, including before bed.', 'No need to rinse. A little toothpaste left behind is fine.']);
      if (live() && v >= 2 && !tooth) b += `<button class="hub-already" onclick="setAnswer('hasTooth','Yes');render()">${F(v === 2 ? 'Maya already has a tooth? See how to brush' : 'Maya has a tooth now? Tell us')}</button>`;
      if (brushing || (v === 2 && tooth)) b += h2('How to brush') + brushHow;
      else if (v >= 2) b += h2('Drool and sore gums') + gumSteps + skip;
      if (v >= 2) b += h.versus('Normal, or time to call?', ['Normal', 'Drooling, chewing on everything, a bit fussier, and feeling a little warm.'], ['Call your pediatrician', 'A fever of 100.4°F or higher. Teething doesn’t cause one.']);
      b += fold('More about teeth', [
        v < 2 && ['Wiping gums', 'If you like', p_('Wiping {p} gums with a clean, damp cloth once a day gets {o} used to it.')],
        (brushing || (v === 2 && tooth)) && ['Drool and sore gums', 'More teeth are on the way', gumSteps + skip],
        v === 3 && !tooth && ['When the first tooth comes', 'How to brush', brushHow],
        v >= 2 && ['First dental visit', 'By the first birthday', p_('Book one after the first tooth comes in, and by the first birthday.')],
        changes('teeth', ['Nothing to do yet.', 'Nothing to do yet.', 'Drool, chewing and sore gums.', 'Brush twice a day from the first tooth.'], v)
      ]);
      return page('teeth', b);
    },
    nails(v) {
      const h = H();
      let b = head('nails', ctx(v), 'Nails, ears and nose', 'Small jobs, quick once you know how.');
      b += h.qa([['Nails', 'Once or twice a week', v < 2 ? 'They grow fast and can scratch {p} face.' : 'Easiest while {s’s} asleep.']]);
      b += h2('Trim tiny nails') + h.steps(['Wait until Maya is asleep or very relaxed.', 'Use baby clippers or a soft emery board, pressing the fingertip pad away from the nail.', 'File rough edges. A nick happens to everyone; press gently with a clean cloth.']);
      b += fold('More', [
        ['Ears', 'No cotton swabs inside', p_('Wipe the outside and behind the ears with a washcloth. Earwax clears on its own.')],
        ['Eyes', 'Inside corner out', p_('Wipe with a clean, damp cotton ball, a fresh one for each eye.')],
        ['A stuffy nose', 'Saline and gentle suction · In Health', `<div class="hub-list care-link">${rowK('nails', 'Colds and stuffy noses', 'In Health', "openPage('chg:Health:d:cold')")}</div>`]
      ]);
      return page('nails', b);
    },
    need(v) {
      const h = H(), now = stageNow();
      const L = [
        ['Newborn', [['Diapers', 'Newborn size (you’ll use 8–12 a day at first), and a pack of size 1. Fragrance-free wipes, zinc diaper cream and a changing pad.'], ['Baths', 'A baby tub, soft washcloths, a mild fragrance-free wash and a hooded towel.'], ['Skin', 'A fragrance-free moisturizer and a fragrance-free laundry detergent.'], ['Clothes', 'About 6–8 bodysuits and 6–8 sleepers, half in newborn and half in 0–3 month sizes, and a sun hat. Burp cloths. Sleep sacks are in Sleep.'], ['Nails and nose', 'Baby nail clippers or a soft file, saline drops and a bulb syringe.']]],
        ['4–6 months', [['Drool and teething', 'Soft bibs and a firm teething ring.'], ['Sun', 'A baby sunscreen, SPF 30 or more, for 6 months on, and a stroller sunshade.']]],
        ['7–12 months', [['Teeth', 'A soft baby toothbrush and fluoride toothpaste.'], ['Baths', 'A non-slip mat for the big tub.'], ['Feet', 'Soft, flexible shoes for outside, once {s’s} walking.']]]
      ];
      let b = head('need', live() ? `Everyday care · Maya’s ${STAGE[now]}` : 'Everyday care', 'What you’ll need', 'A short list. Most of it lasts the whole first year.');
      L.forEach(([when, items]) => { b += h2(when) + `<div class="hub-card care-need">${items.map(([t, d]) => `<div><b>${F(t)}</b><span>${F(d)}</span></div>`).join('')}</div>`; });
      b += h.note('There’s no need for wipe warmers or a separate laundry routine.');
      return page('need', b);
    }
  };

  /* ---------- the rash pages ---------- */
  const RASH_ORDER = ['acne', 'cradle', 'peeling', 'diaper', 'yeast', 'eczema', 'heat', 'drool'];
  const RASH = {
    acne: { alt: ['heat', 'eczema'], t: 'Baby acne', look: 'Small red or white bumps on the cheeks, nose and forehead', lead: 'Very common in the first weeks, usually starting at 2–4 weeks. It clears on its own.', steps: ['Wash {p} face with plain water once a day and pat dry.', 'Skip lotions and oils on the bumps, and never use acne products.', 'Tiny white dots on the nose (milia) are normal too, and fade without help.'] },
    cradle: { t: 'Cradle cap', look: 'Yellow, greasy or crusty patches on the scalp', lead: 'Common in the first months, and harmless. It usually clears up by the first birthday.', steps: ['Wash {p} hair with water or a little mild baby shampoo.', 'For stubborn flakes, rub in a little baby oil, wait a few minutes, brush gently with a soft brush, then wash the oil out.', 'Don’t pick at the flakes.'] },
    peeling: { t: 'Peeling, dry skin', look: 'Dry, flaky skin on the hands, feet and body', lead: 'Normal in the first weeks, as {p} skin gets used to the air.', steps: ['Keep baths short and use plain water.', 'A fragrance-free moisturizer is fine, but not needed.'] },
    diaper: { alt: ['yeast'], t: 'Diaper rash', look: 'Red skin where the diaper touches', lead: 'Most diaper rash clears up in 2–3 days with a few simple steps.', steps: ['Change often, and let the skin air out when you can.', 'A thick layer of zinc oxide cream at every change.', 'Skip wipes with alcohol or fragrance while it heals.'] },
    yeast: { alt: ['diaper'], t: 'Yeast diaper rash', look: 'Bright red in the skin folds, with small red spots around the edges', lead: 'A diaper rash that won’t clear with the usual cream may be yeast. It needs a different cream.', steps: ['Call your pediatrician, who may suggest an antifungal cream.', 'Keep changing often and airing the skin.'] },
    eczema: { alt: ['acne', 'drool'], t: 'Eczema', look: 'Dry, rough, itchy patches, often on the cheeks and in the creases', lead: 'Common in babies, and it comes and goes. Moisturizing is the main care.', steps: ['Short, lukewarm baths, then pat on a thick fragrance-free moisturizer while the skin is still damp.', 'Use fragrance-free soap and laundry detergent, and soft cotton clothes.', 'Keep {p} nails short to limit scratching.'], call: 'Show your pediatrician if the patches crack, ooze or keep {o} up, or moisturizing doesn’t help.' },
    heat: { alt: ['acne', 'eczema'], t: 'Heat rash', look: 'Tiny red bumps where {s} got too warm, like the neck and chest', lead: 'It comes from sweat. Cooling down is all it takes.', steps: ['Move {o} somewhere cooler and take off a layer.', 'Skip creams and ointments on it; they trap heat.', 'It usually fades within a day or two.'] },
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

  /* ---------- routes ---------- */
  // Older pages open the topic that now holds them, at the age they were about.
  const OLD = { sponge: ['bath', 0], tub: ['bath', 1], bathseat: ['bath', 3], skin: ['skin'], dress: ['clothes'], steps: ['clothes', 3], sun: ['sun'], gums: ['teeth', 2], teeth: ['teeth', 3], nails: ['nails'] };
  window.careTopic = function (k, v) { const now = stageNow(); v = Number.isInteger(v) && v >= 0 && v <= 3 ? v : now; return TOPIC[k] ? TOPIC[k](v) : null; };
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b, c] = p.split(':');
    if (cat === CAT && screen === 'd') {
      if (a === 't') { const r = careTopic(b, c == null ? null : Number(c)); if (r) return r; }
      if (a === 'rash') { const r = rashPage(b); if (r) return r; }
      if (OLD[a]) { const [k, v] = OLD[a]; return careTopic(k, v == null ? null : (k === 'teeth' && v === 3 && !hasTooth() ? 2 : v)); }
    }
    return baseRoute(p);
  };
})();
