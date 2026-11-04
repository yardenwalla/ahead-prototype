/* Ahead · Development, Play, Safety and Health as summary screens.
   Same pattern as Sleep and Feeding: stage pills, a hero that answers the parent's question,
   at most 3 rows, a must-know card, coming up, and details one tap away (the existing focused pages). */
(function () {
  // A skill counts as seen if it's saved in Memories, or the parent already told us (crawling, pulling up, rolling).
  window.skillSeen = l => journeyData().records.some(r => r.type === 'milestone' && r.skillKey === journeySkillKey(l))
    || (typeof answers !== 'undefined' && ((answers.crawl === 'Yes' && /crawl/i.test(l)) || (answers.pullUp === 'Yes' && /pull(s|ing)? (up|to stand)/i.test(l)) || ((answers.roll === 'Yes' || answers.crawl === 'Yes') && /\broll/i.test(l)) || (answers.hasTooth === 'Yes' && /tooth/i.test(l))));
  const H = () => window.__hub;
  const F = s => H().F(s);
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const monthsLabel = n => n === 0 ? 'Newborn' : n === 12 ? '1 year' : n === 1 ? '1 month' : n + ' months';
  function frame(cat, attrs, pillsHtml, body) {
    return `<div class="quiet-category hub-page" data-overview="${cat}" style="${yearTheme(cat)}" ${attrs}>${monthlyPageHeader(cat)}${pillsHtml}${body}<p class="hub-foot">${cat === 'Health' ? 'Your pediatrician may schedule checkups a little differently.' : 'Ages are typical. Every baby moves at their own pace.'}</p></div>`;
  }
  // A parent can say "this is where Maya is now" for a category; it sticks until they change it.
  const STAGE_KEY = () => 'ahead-stage:' + journeyKey();
  const stageOverrides = () => { try { return JSON.parse(localStorage.getItem(STAGE_KEY())) || {}; } catch (e) { return {}; } };
  // Calendar guides (Rule 5): a parent's pick holds until the baby's age reaches the next stage, then age takes over.
  const guessFor = cat => cat === 'Development' ? devRef(developmentMonth(actualMonth())) : cat === 'Care' ? careFor((NOW - parse(profile.dob)) / 864e5, careAge()) : null;
  const writeOverrides = all => { try { localStorage.setItem(STAGE_KEY(), JSON.stringify(all)); } catch (e) {} };
  window.hubStageOverride = cat => {
    if (!live()) return undefined;
    const all = stageOverrides(), e = all[cat];
    if (e == null) return undefined;
    if (typeof e === 'object') return e.v;   // a pick holds until the parent changes it (Home asks when it's outgrown)
    return e;
  };
  window.hubStageGuess = guessFor;
  window.hubStageOverrideRaw = cat => { const e = stageOverrides()[cat]; return e == null ? null : JSON.parse(JSON.stringify(e)); };
  window.hubStageOverrideRestore = (cat, e) => { const all = stageOverrides(); if (e == null) delete all[cat]; else all[cat] = e; writeOverrides(all); };
  window.hubSetStage = function (cat, value, silent) {
    const all = stageOverrides(); if (value == null) delete all[cat]; else all[cat] = { v: value, g: guessFor(cat) };
    writeOverrides(all);
    if (!silent) { const y = scrollY; render(); scrollTo(0, y); }
  };
  const devNow = () => devRef(developmentMonth(live() ? actualMonth() : month));
  const pickedNote = (cat, label) => `<div class="hub-browse"><span class="hub-picked">${F('You picked this stage')}</span><button class="hub-link is-quiet" onclick="hubSetStage('${cat}',null)">${F(label)} ›</button></div>`;
  const back = (label, onclick) => `<div class="hub-browse"><button class="hub-link is-quiet" onclick="${onclick}">${F(label)} ›</button></div>`;
  const firstSentence = t => ((String(t || '').match(/^.*?[.!?](\s|$)/) || [String(t || '')])[0]).trim().replace(/\.$/, '');
  // Each check's own picture, so no two rows on a page share an icon.
  const SAFETY_ICON = { seat: 'car', water: 'thermo', alarms: 'alarm', pool: 'drop', gates: 'gate', storage: 'lock', outlets: 'plug', anchor: 'dresser', windows: 'window', cords: 'cord', doors: 'home', walkers: 'stroller', batteries: 'battery', bags: 'bag', small: 'coin', rollspace: 'mat', changing: 'diaper' };
  const SAFETY_SUB = { gates: 'Top of stairs: screwed in, so it can’t give way', windows: 'Small locks, so they open no more than 4 inches', anchor: 'So they can’t tip if Maya pulls on them', cords: 'Hanging cords can wrap around a baby’s neck', storage: 'Up high, with a child lock on the cabinet', small: 'Coins, magnets and pieces of older kids’ toys' };
  const shortLine = t => { const f = firstSentence(t); const cut = f.length > 72 && f.includes(',') ? f.slice(0, f.indexOf(',')) : f; return cut.split(/\s+/).length < 3 ? f : cut; };
  // One thing to try, phrased as an action: the short prompt if there is one, otherwise the first line of how to do it.
  const playLine = a => (window.hubBabyify || (x => x))(playLineRaw(a));
  const playLineRaw = a => { const s = typeof conceptPlaySuggestion === 'function' ? conceptPlaySuggestion(a) : ''; return s && !s.startsWith(a.why || '\u0000') ? firstSentence(s) : firstSentence(a.how || a.why); };

  /* ---------- Development: "What might I see, and how can I help?" ---------- */
  const DOMAIN_TITLES = { Social: 'Social', Talking: 'Communication', Thinking: 'Thinking', Movement: 'Movement' };
  const DOMAIN_ICONS = { Social: 'smile', Talking: 'chat', Thinking: 'idea', Movement: 'sit' };
  // Seen in the baby book, or reported elsewhere (rolling, crawling): the same test the area page uses.
  const devSkillSeen = l => { const key = journeySkillKey(l); return !!(journeyData().records.find(r => r.type === 'milestone' && r.skillKey === key) || skillSeen(l)); };
  window.developmentJourneyOverview = developmentJourneyOverview = function (selected = null) {
    const now = devNow(), ref = DEV_STAGES[selected] ? Number(selected) : now, age = ref + ' months';
    const st = DEV_STAGES[ref], h = H();
    // Born early: say which age Development follows, and switch it in one tap.
    const ageNote = live() && profile.early && profile.due ? (() => { const adj = developmentMonth(actualMonth()) !== actualMonth(); return `<p class="hub-agebasis">${F(adj ? `Following Maya’s adjusted age (${monthsLabel(developmentMonth(actualMonth()))}).` : `Following Maya’s birthday age (${monthsLabel(actualMonth())}).`)} <button onclick="hubSetAgeMode('dev','${adj ? 'birthday' : 'adjusted'}')">${adj ? 'Use birthday age' : 'Use adjusted age'}</button></p>`; })() : '';
    const devKeys = Object.keys(DEV_STAGES).map(Number), nowI = devKeys.indexOf(now);
    const pills = h.pills('Development by age', devKeys.map((k, i) => ({ label: STAGE_TABLE.Development.stages[i].label, age: STAGE_TABLE.Development.stages[i].age, on: k === ref, now: live() && k === now, onclick: `openPage('development-stage:${k}')`, change: stageCanChange('Development', i, nowI) ? `hubChangeStage('Development',${i})` : '' })), 'Development');
    // The top card: what this age looks like, with the answer to the big worry of the age in its own words.
    const LEAD = { 4: 'Play starts to feel like a conversation: smiles, little sounds and swiping at toys. Rolling usually follows, between 4 and 6 months.', 9: 'Sitting frees both hands for babbling, banging and finding things. Not crawling yet? Many babies skip it.', 12: 'Waving, copying and pulling up to stand. First steps usually come between 12 and 15 months.' };
    let b = `<section class="dev-hero"><p class="dev-hero-eyebrow">${F(`What to look for by ${ref === 12 ? '12 months' : age}`)}</p><h1>${F(st.title)}</h1><p class="dev-hero-lead">${F(LEAD[ref] || st.body)}</p></section>`;
    // What Maya is working on: four areas, each with a line of what you might see.
    const domainTiles = Object.keys(DEV_DOMAINS).map(d => {
      const labels = DEVELOPMENT_DOMAINS[ref][d] || [], c = window.devTileColors ? devTileColors(d) : null, hl = (window.DEV_HEADLINE || {})[ref]?.[d];
      const moving = d === 'Movement' && live() && ref === now && (answers.pullUp === 'Yes' || answers.crawl === 'Yes');
      const line = moving ? (answers.pullUp === 'Yes' ? 'Already pulling up' : 'Already crawling') : hl ? hl[0] : (st.summaries[d] || '');
      return `<button class="hub-domain-tile dev-tile" style="${c ? `--dt-bg:${c[0]};--dt-ink:${c[1]}` : ''}" onclick="openPage('development-domain:${ref}:${d}')"><span class="dev-tile-art">${window.devTileArt ? devTileArt(d, ref) : h.art(DOMAIN_ICONS[d], 'Development')}</span><small class="dev-tile-label">${DOMAIN_TITLES[d]}</small><b class="dev-tile-line">${(window.hubBabyify || (x => x))(F(line))}</b><span class="dev-tile-count">${labels.length ? `<span class="dev-tile-ticks" aria-hidden="true">${labels.map(devSkillSeen).sort((x, y) => y - x).map(v => `<i class="${v ? 'is-seen' : ''}"></i>`).join('')}</span>` : ''}${F(`${labels.length} skill${labels.length === 1 ? '' : 's'}`)} ›</span></button>`;
    }).join('');
    const other = live() && ref !== now;
    b += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F(other ? `What babies work on by ${age}` : 'What Maya is working on')}</b></span><div class="hub-domain-tiles">${domainTiles}</div></section>`;
    // Try today: two picture ideas that change each day, and the rest one tap away.
    b += window.devTodayCard ? devTodayCard(ref) : '';
    const nextRef = devKeys[devKeys.indexOf(ref) + 1];
    if (nextRef) b += h.next(`Next, by ${nextRef} months`, DEV_STAGES[nextRef].title, `openPage('development-stage:${nextRef}')`);
    else b += h.next('After the first birthday', 'First steps usually come between 12 and 15 months', `openPage('development-domain:12:Movement')`);
    return frame('Development', `data-development-guide="${ref}"`, pills + ageNote, b);
  };

  /* ---------- Play now lives inside Development & play ---------- */
  // Month pages for play open the matching Development age; the old Play slot is Everyday care.
  window.playStageOverview = playStageOverview = function (selected = null) {
    if (selected == null) return everydayCare();
    return developmentJourneyOverview(devRef(Number(selected)));
  };
  const basePlayActivity = playActivityPage;
  window.playActivityPage = playActivityPage = function (lo, id) {
    return basePlayActivity(lo, id).split(monthlyPageHeader('Daily rhythm')).join(monthlyPageHeader('Development')).split(yearTheme('Daily rhythm')).join(yearTheme('Development'));
  };
  const baseTopic = displayTopic;
  window.displayTopic = displayTopic = t => t === 'Daily rhythm' ? 'Everyday care' : t === 'Development' ? 'Development & play' : baseTopic(t);

  /* ---------- Everyday care: "How do I take care of Maya day to day?" ----------
     Stages follow age, like the monthly overview, because care changes as the baby grows. */
  const CARE = [
    { key: 'newborn', rail: 'Newborn', when: 'Until the cord stump falls off' },
    { key: 'early', rail: '1–3 months', when: 'Usually 1–3 months' },
    { key: 'middle', rail: '4–6 months', when: 'Usually 4–6 months' },
    { key: 'late', rail: '7–12 months', when: 'Usually 7–12 months' }
  ];
  const careFor = (days, m) => days < 28 ? 0 : m < 4 ? 1 : m < 7 ? 2 : 3;
  const careAge = () => (typeof hubAgeFor === 'function' ? hubAgeFor('care', actualMonth()) : developmentMonth(actualMonth()));
  const careStage = () => { return live() ? careFor((NOW - parse(profile.dob)) / 864e5, careAge()) : (month < 1 ? 0 : month < 4 ? 1 : month < 7 ? 2 : 3); };
  const bathSafety = () => H().versus('Bath safety', ['Always', 'Gather everything first, then keep a hand on Maya the whole bath.'], ['Never', 'Step away, even for a moment. Babies can slip under quietly in seconds.']);
  const careRow = (icon, title, sub, id) => H().row({ icon, cat: 'Daily rhythm', title, sub, onclick: id.startsWith('chg:') ? `openPage('${id}')` : `openPage('chg:Daily rhythm:d:${id}')` });
  function everydayCare(selected = null) {
    const now = careStage(), v = CARE[selected] ? selected : now, h = H(), C0 = CARE[v];
    const pills = h.pills('Everyday care by age', CARE.map((c, i) => ({ label: STAGE_TABLE['Daily rhythm'].stages[i].label, age: STAGE_TABLE['Daily rhythm'].stages[i].age, on: i === v, now: live() && i === now, onclick: `openPage('chg:Daily rhythm:s:${i}')`, change: stageCanChange('Daily rhythm', i, now) ? `hubChangeStage('Daily rhythm',${i})` : '' })), 'Daily rhythm');
    let b = '';
    if (v === 0) {
      b += h.hero({ eyebrow: 'Newborn', title: 'Caring for a brand-new baby', checksLabel: 'What to expect', checks: ['Sponge baths only, until the cord stump falls off', 'About 8–12 diaper changes a day', 'It feels like a lot at first, and it gets quicker fast'] });
      b += h.glanceCard(v === now ? 'Maya’s care at a glance' : 'At this stage', [['Baths', '2–3 a week', 'Sponge baths for now'], ['Diapers', '8–12 a day', 'Change when wet or dirty']], `openPage('chg:Daily rhythm:d:sponge')`);
      b += h.list('In these first weeks', [careRow('towel', 'Give a sponge bath', 'A warm room, a washcloth and 5 minutes', 'sponge'), careRow('cord', 'Keep the cord stump clean and dry', 'Fold the diaper below it and let it air', 'cord'), careRow('nail', 'Trim tiny nails', 'Easiest while {s} {sleep|sleeps}', 'nails')]);
      b += h.list('Every day', [careRow('shirt', 'Dress Maya for the weather', 'One more layer than you’re wearing', 'dress'), careRow('diaper', 'Diapers and skin', 'Gentle care, and what to do about diaper rash', 'skin')]);
      b += h.versus('Normal, or time to call?', ['Normal', 'A little crust or a spot of blood near the cord, peeling skin and baby acne.'], ['Call your pediatrician', 'Redness spreading around the cord, pus or a bad smell, or a temperature of 100.4°F or higher.']);
    }
    if (v === 1) {
      b += h.hero({ eyebrow: '1–3 months', title: 'Tub baths and everyday skin care', checks: ['Once the cord has healed, sponge baths become tub baths', 'Two or three baths a week is plenty', 'Dry skin and cradle cap are common now, and easy to care for'] });
      b += h.glanceCard(v === now ? 'Maya’s care at a glance' : 'At this stage', [['Baths', '2–3 a week', 'More if you like'], ['Water', 'About 100°F', 'Warm, not hot']], `openPage('chg:Daily rhythm:d:tub')`);
      b += h.list('What helps now', [careRow('bath', 'Give a tub bath', 'About 2 inches of warm water is plenty', 'tub'), careRow('drop', 'Care for dry skin and cradle cap', 'Mild soap, and a soft brush for the scalp', 'skin'), careRow('sun', 'Keep Maya out of direct sun', 'Shade and a hat when you’re outside', 'sun')]);
      b += bathSafety();
    }
    if (v === 2) {
      b += h.hero({ eyebrow: '4–6 months', title: 'Bath time becomes part of bedtime', checks: ['Many families move the bath to bedtime, to help wind down', 'Drooling and chewing start, often long before the first tooth', 'Grabbing and splashing make baths busier'] });
      b += h.glanceCard(v === now ? 'Maya’s care at a glance' : 'At this stage', [['Baths', '2–3 a week', 'Often before bed'], actualMonth() >= 6 ? ['Sun', 'Shade, then sunscreen', 'From 6 months'] : ['Sun', 'Shade first', 'Under 6 months']], `openPage('chg:Daily rhythm:d:tub')`);
      b += h.list('What helps now', [careRow('moon', 'Make the bath part of bedtime', 'Bath, feed, book, bed', 'chg:Sleep:d:routine'), careRow('tooth', 'Teething, drool and gums', 'Wipe gums and keep the chin dry', 'gums'), (careAge() >= 6 ? careRow('sun', 'Protect {p} skin in the sun', 'Shade first, then baby sunscreen', 'sun') : careRow('sun', 'Keep Maya in the shade', 'Hats and shade before sunscreen', 'sun'))]);
      b += bathSafety();
    }
    if (v === 3) {
      b += h.hero({ eyebrow: '7–12 months', title: 'First teeth and splashier baths', checks: ['Maya sits in the bath, so it gets splashier and more fun', 'The first tooth means brushing starts, twice a day', 'Pulling up and first steps change what {s} {need|needs} on {p} feet'] });
      b += h.glanceCard(v === now ? 'Maya’s care at a glance' : 'At this stage', [['Teeth', 'Brush twice a day', 'From the first tooth'], ['Toothpaste', 'A rice-grain smear', 'With fluoride']], `openPage('chg:Daily rhythm:d:teeth')`);
      const hasTooth = live() && (answers.hasTooth === 'Yes' || journeyData().records.some(r => r.type === 'milestone' && /tooth|teeth/i.test(r.title || '')));
      b += h.list('What helps now', [hasTooth || !live() ? careRow('tooth', 'Brush the first teeth', 'A soft brush and a tiny smear of toothpaste', 'teeth') : careRow('tooth', 'Teething, drool and gums', 'Drool, chewing and sore gums', 'gums'), careRow('bath', 'Bath seats aren’t safety seats', 'Stay within arm’s reach, every bath', 'bathseat'), careRow('sun', 'Protect {p} skin in the sun', 'Shade first, then baby sunscreen', 'sun'), (!live() || hubAgeFor('care', actualMonth()) >= 9) ? careRow('stand', 'Cruising and first steps', 'Bare feet indoors, and when shoes matter', 'steps') : null]);
      b += bathSafety();
    }
    const nx = CARE[v + 1];
    // The last stage still looks ahead: what changes after the first birthday.
    if (!nx) b += h.next('After the first birthday, usually 12–18 months', 'Toddler baths and first shoes', `openPage('chg:Daily rhythm:d:after1')`);
    if (nx) b += h.next(v === 0 ? 'Coming up after the first few weeks' : `Coming up at ${nx.rail.split('–')[0]} months`, ['', 'Tub baths and everyday skin care', 'Bath time becomes part of bedtime', 'First teeth and splashier baths'][v + 1], `openPage('chg:Daily rhythm:s:${v + 1}')`);
    // Born early: say which age Everyday care follows (it shares the setting with Feeding and Sleep), and switch it in one tap.
    const careNote = live() && profile.early && profile.due && ageMonths(parse(profile.due), NOW) !== actualMonth() ? (() => { const adj = careAge() !== actualMonth(); return `<p class="hub-agebasis">${F(adj ? `Following Maya’s adjusted age (${monthsLabel(careAge())}), like Feeding and Sleep.` : `Following Maya’s birthday age (${monthsLabel(actualMonth())}), like Feeding and Sleep.`)} <button onclick="hubSetAgeMode('care','${adj ? 'birthday' : 'adjusted'}')">${adj ? 'Use birthday age' : 'Use adjusted age'}</button></p>`; })() : '';
    return frame('Daily rhythm', `data-care-stage="${CARE[v].key}"`, pills + careNote, b); // read-only timeline: follows age, tap any stage to look back or ahead
  }
  window.everydayCare = everydayCare;

  function careDetail(id) {
    const h = H(), stageName = 'Everyday care', d = (ctx, title, lead, inner, artName) => h.detail('Daily rhythm', ctx, title, lead, inner, artName);
    if (id === 'sponge') return d('Newborn', 'Give a sponge bath', 'Until the cord stump falls off, a sponge bath keeps Maya clean without getting the stump wet.',
      hubIconSteps([['home', 'Warm room, towel down', 'Everything within reach'], ['drop', 'Face, then body', 'Plain water, one part at a time'], ['towel', 'Diaper area last', 'Pat dry, into the skin folds']], 'Daily rhythm', 'Warm the room and lay baby on a towel. Wash the face, then the body one part at a time, then the diaper area last, and pat dry.')
      + hubEmbed('uYQ_KNlcQwE', 'How to give your newborn a sponge bath', 'Nemours KidsHealth') + h.tip('How often?', 'Two or three times a week is plenty. In between, wipe {p} face, neck and diaper area.'), 'towel');
    if (id === 'cord') return d('Newborn', 'Keep the cord stump clean and dry', 'The stump usually dries up and falls off on its own in 1–3 weeks.',
      (() => { const wk = (NOW - parse(profile.dob)) / 6048e5, X = w => 24 + w / 4 * 272, pal = YEAR_PALETTES['Daily rhythm'];
        return `<figure class="hub-figure" role="img" aria-label="The cord stump usually falls off between 1 and 3 weeks after birth."><svg viewBox="0 0 320 96" aria-hidden="true"><rect x="6" y="6" width="308" height="84" rx="16" fill="${pal.pale}"/><rect x="${X(1)}" y="31" width="${X(3) - X(1)}" height="22" rx="11" fill="${pal.bg}"/><text x="${X(2)}" y="24" text-anchor="middle" font-size="11.5" font-weight="700" fill="${pal.ink}" font-family="inherit">Usually falls off</text><path d="M24 41H296" stroke="${pal.ink}" stroke-opacity=".25" stroke-dasharray="2 4"/>${[0, 1, 2, 3].map(w => `<text x="${X(w)}" y="76" text-anchor="${w === 0 ? 'start' : 'middle'}" font-size="11" fill="${pal.ink}" fill-opacity=".7" font-family="inherit">${w ? w + (w === 1 ? ' week' : ' weeks') : 'Birth'}</text>`).join('')}${wk >= 0 && wk <= 4 ? `<circle cx="${X(wk)}" cy="41" r="6" fill="#fff" stroke="${pal.ink}" stroke-width="3"/><text x="${Math.min(280, Math.max(40, X(wk)))}" y="64" text-anchor="middle" font-size="11.5" font-weight="700" fill="${pal.ink}" font-family="inherit">${F('Maya now')}</text>` : ''}</svg></figure>`; })()
      + h.steps(['Fold the top of the diaper down so the stump stays in the air.', 'If it gets dirty, clean it gently with plain water and pat it dry.', 'Let it fall off by itself, even if it’s hanging by a thread.'])
      + hubEmbed('qFPA-4A_8wY', 'How to care for the umbilical cord', 'Nemours KidsHealth') + h.tip('A little crust is normal', 'A spot of blood when it comes off is normal too. Call if the skin around it gets red, swollen or smelly.') + ((typeof babyPronouns === 'function' && babyPronouns().s === 'she') ? '' : h.tip('If {s} {were|was} circumcised', 'Put a dab of petroleum jelly on the tip at each diaper change until it heals, usually in a week to 10 days. Call if there’s bleeding, swelling or pus.')), 'cord');
    if (id === 'nails') return d(stageName, 'Trim tiny nails', 'Those tiny nails grow fast and are sharp enough to scratch {p} face.',
      h.steps(['Wait until Maya is asleep or very relaxed.', 'Use baby nail clippers or a soft emery board, pressing the fingertip pad away from the nail.', 'File any rough edges. A nick happens to everyone; press gently with a clean cloth.']), 'nail');
    if (id === 'tub') return d(stageName, 'Give a tub bath', 'Once the cord stump has fallen off and the spot is dry, Maya’s ready for a baby tub.',
      (window.hubFigure ? hubFigure('tub', 'Daily rhythm', 'A baby lying back in a baby tub with about 2 inches of warm water, a hand supporting the head and neck.') : '') + h.steps(['Gather everything first: towel, washcloth, mild soap and a clean diaper.', 'Fill the tub with about 2 inches of warm water. Test it with your wrist; it should feel warm, not hot.', 'Support {p} head and neck with one arm, and wash from top to bottom with your other hand.', 'Lift {o} out onto the towel and wrap {o} up right away.'])
      + hubEmbed('VsUla1M7eHQ', 'Giving a tub bath', 'Nemours KidsHealth') + h.tip('Never step away', 'Not even for a moment. If you need to leave, wrap Maya in a towel and take {o} with you.') + h.tip('Water heater', 'Set it to 120°F or lower so tap water can’t scald.'), 'bath');
    if (id === 'skin') return d(stageName, 'Skin, rashes and cradle cap', 'Most diaper rash clears up in a few days with a few simple steps.',
      hubIconSteps([['diaper', 'Change often', 'Let the skin air out when you can'], ['shield', 'Thick zinc cream', 'At every change']], 'Daily rhythm', 'Change diapers often and air the skin, and use a thick layer of zinc oxide cream at every change.', false)
      + h.versus('Normal, or time to call?', ['Normal', 'Pink and a little sore, better in a few days.'], ['Call your pediatrician', 'Blistering, bleeding, spreading, or not better in a few days.'])
      + h.list('Other skin care', [h.row({ icon: 'drop', cat: 'Daily rhythm', title: 'Dry skin', sub: 'Mild soap only where needed, then moisturizer on damp skin' }), h.row({ icon: 'head', cat: 'Daily rhythm', title: 'Cradle cap', sub: 'A little baby oil, then brush gently before the bath' }), h.row({ icon: 'eye', cat: 'Daily rhythm', title: 'Red, itchy patches', sub: 'Show your pediatrician, who can suggest what helps' })]), 'drop');
    if (id === 'dress') return d(stageName, 'Dress Maya for the weather', 'Babies can’t tell you they’re too hot or cold, so a simple rule helps.',
      `<figure class="hub-figure hub-layers" role="img" aria-label="Dress baby in one more layer than you’re wearing."><div><span>${hubArt('shirt', 'Daily rhythm')}${hubArt('shirt', 'Daily rhythm')}</span><b>${F('You')}</b><small>${F('Comfortable in 2 layers')}</small></div><i aria-hidden="true">+1</i><div class="is-baby"><span>${hubArt('shirt', 'Daily rhythm')}${hubArt('shirt', 'Daily rhythm')}${hubArt('shirt', 'Daily rhythm')}</span><b>${F('Maya')}</b><small>${F('Needs 3')}</small></div></figure>`
      + h.tips(['Feel the back of {p} neck. Sweaty means too warm; cool means add a layer.', 'Skip hats and heavy blankets for sleep. A sleep sack is enough.']) + h.tip('In the car seat', 'Take off puffy coats first. Buckle {o} in, then put a blanket over the straps.'), 'towel');
    if (id === 'gums') return d(stageName, 'Teething, drool and gums', 'Drooling and chewing on everything are normal now. Teeth can take a while to follow.',
      (live() && answers.hasTooth !== 'Yes' ? `<button class="hub-already" onclick="setAnswer('hasTooth','Yes');openPage('chg:Daily rhythm:d:teeth')">${name()} already has a tooth? See how to brush</button>` : '') + hubIconSteps([['towel', 'Wipe the gums', 'With a clean, damp cloth once a day'], ['shirt', 'A soft bib', 'And pat the chin dry, to avoid a drool rash'], ['ball', 'A teething ring', 'Cool and firm, if {s} {seem|seems} sore']], 'Daily rhythm', 'Wipe the gums once a day, keep a soft bib on, and offer a cool, firm teething ring.', false) + h.tip('Skip these', 'Teething necklaces, numbing gels and tablets. Ask your pediatrician about pain relief if needed.')  + (live() && answers.hasTooth !== 'Yes' ? '' : h.list('', [careRow('tooth', 'Brush the first teeth', 'Start as soon as the first one appears', 'teeth')])), 'tooth');
    if (id === 'steps') return d(stageName, 'Cruising and first steps', 'Pulling up and cruising along furniture usually come before walking. A few small changes help.',
      hubIconSteps([['home', 'Indoors: bare feet', 'They help with balance and feeling the floor'], ['sun', 'Outside: soft shoes', 'Flexible soles, room for toes, once walking']], 'Daily rhythm', 'Bare feet indoors. Soft, flexible shoes outside once walking.', false)
      + h.tip('In the bath', 'Expect {o} to pull up. Keep a hand on {o} the whole bath, and use a non-slip mat.') + h.tip('Walkers', 'Skip walkers on wheels. They don’t help with walking, and they can lead to falls down stairs.'), 'stand');
    if (id === 'after1') return d('After the first birthday', 'What changes after 1', 'Everyday care stays much the same. A few things shift as Maya becomes a toddler.',
      h.list('', [h.row({ icon: 'tooth', cat: 'Daily rhythm', title: 'Brushing', sub: 'Twice a day, a rice-grain smear of fluoride toothpaste, until about age 3' }), h.row({ icon: 'bath', cat: 'Daily rhythm', title: 'Baths', sub: 'Every day or a few times a week, a hand on Maya, the water shallow' })]), 'tooth');
    if (id === 'teeth') return d(stageName, 'Brush the first teeth', 'As soon as the first tooth appears, brushing helps keep it healthy.',
      `<figure class="hub-figure hub-paste" role="img" aria-label="Use a smear of toothpaste the size of a grain of rice, not a pea-sized amount."><div class="is-yes"><svg viewBox="0 0 160 60" aria-hidden="true"><rect x="58" y="34" width="96" height="14" rx="7" fill="#cfe3db"/><rect x="8" y="30" width="56" height="20" rx="8" fill="#a9cbbd"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${12 + i * 5.6}" y="16" width="3.4" height="15" rx="1.7" fill="#cfe3db"/>`).join('')}<ellipse cx="34" cy="14" rx="4.5" ry="2.6" fill="#fff" stroke="#7fb0cc" stroke-width="1.3"/></svg><b>✓ ${F('A grain of rice')}</b><small>${F('Under 3 years')}</small></div><div class="is-no"><svg viewBox="0 0 160 60" aria-hidden="true"><rect x="58" y="34" width="96" height="14" rx="7" fill="#cfe3db"/><rect x="8" y="30" width="56" height="20" rx="8" fill="#a9cbbd"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${12 + i * 5.6}" y="16" width="3.4" height="15" rx="1.7" fill="#cfe3db"/>`).join('')}<circle cx="34" cy="8" r="9" fill="#fff" stroke="#7fb0cc" stroke-width="1.3"/></svg><b>${F('Not a pea')}</b><small>${F('That’s from age 3')}</small></div></figure>`
      + h.steps(['Brush gently twice a day with a soft baby toothbrush, including before bed.', 'No need to rinse. A little toothpaste left behind is fine.']) + h.tip('First dental visit', 'Book one after the first tooth comes in, and by the first birthday.'), 'tooth');
    if (id === 'bathseat') return d(stageName, 'Bath seats aren’t safety seats', 'A bath seat can help Maya sit up, but it won’t keep {o} safe if you step away.',
      h.tips(['Keep the water shallow, about as high as {p} waist when sitting.', 'Keep a hand on Maya the whole bath.', 'If you need to leave, wrap Maya in a towel and take {o} with you.']), 'bath');
    const sunTiles = () => hubAgeTiles({ title: 'Sun protection by age', items: [['Under 6 months', 'Shade first', 'Clothes and a hat. A little sunscreen only if there’s no shade.'], ['6 months and up', 'Shade + SPF 30', 'Broad-spectrum, reapplied every 2 hours']], nowIndex: careAge() < 6 ? 0 : 1, cat: 'Daily rhythm', caption: 'Under 6 months, shade comes first. From 6 months, shade plus SPF 30 sunscreen.' });
    if (id === 'sun') return careAge() < 6 ? d(stageName, 'Keep Maya in the shade', 'Young babies’ skin burns easily, so shade comes first.',
      sunTiles() + h.tips(['Keep {o} in the shade, especially in the middle of the day.', 'Dress {o} in light, long sleeves and a wide-brimmed hat.']), 'sun')
      : d(stageName, 'Protect Maya’s skin in the sun', 'Shade still comes first, and sunscreen joins in now.',
      sunTiles() + h.tips(['Keep {o} in the shade, in light clothes and a wide-brimmed hat.', 'Sunscreen on skin you can’t cover, again after water play.']), 'sun');
    return everydayCare();
  }

  // Everyday care everywhere a category is listed: its summary line, its picture and its year view.
  const baseSnap = stageSnapshot;
  window.stageSnapshot = stageSnapshot = function (topic) {
    const r = baseSnap(topic);
    if (topic !== 'Daily rhythm') return r;
    const v = careStage();
    return Object.assign({}, r, { title: ['Baths, cord care and nails', 'Baths, skin and dressing', 'Bedtime baths, gums and shade', 'First teeth, bath safety and sun'][v], body: ['Sponge baths, the cord stump and tiny nails.', 'Tub baths, dry skin and dressing for the weather.', 'Bath as part of bedtime, drool and gums, and shade.', 'Brushing the first teeth, bath seats and sunscreen.'][v] });
  };
  const baseArt = yearIllustration;
  // Everyday care uses the same illustrated icon as the other categories (a tub), from app.js.
  const baseYear = categoryYear;
  window.categoryYear = categoryYear = t => t === 'Daily rhythm' ? everydayCare() : baseYear(t);
  const baseHub = yearHub;
  window.yearHub = yearHub = () => baseHub().replace('First responses → shared games', 'Baths and cord care → first teeth');

  /* ---------- Safety: "What do I need to do before Maya moves?" ---------- */
  const SAFETY_HEAD = { setup: ['Set up a few things once', 'Check the car seat, hot water, smoke alarms and any pool access.'], reaching: ['Get ready for reaching and rolling', 'Once rolling starts, small things on the floor are suddenly within reach. A quick check covers it.'], rolling: ['Babyproof before Maya moves', 'Most babies start moving at 6–10 months. Getting ahead of it saves a scramble.'], moving: ['Keep going, one room at a time', 'Maya can reach much more now. Work through the rooms {s} {use|uses} most.'], pulling: ['Check what Maya can reach standing', 'Standing brings windows, cords and furniture into reach.'] };
  window.safetyMovementGuide = safetyMovementGuide = function (selected = null) {
    const keys = SAFETY_MOVEMENT_STAGES.map(p => p.key), now = live() ? safetyStageNow() : safetyMovementStage();
    const key = keys.includes(selected) ? (live() && safetyGroup(selected) === safetyGroup(now) ? now : selected) : now, owner = safetyOwnerForStage(key), guide = safetyOwnedGuides()[owner], h = H();
    const browse = live() && key !== now, items = safetyHomeItems(), pending = safetyPendingIds(guide.ids), done = guide.ids.length - pending.length;
    // Lead with the checks this stage's headline is about (standing → windows and cords, for example).
    const FIRST = { rolling: ['gates', 'storage', 'outlets'], moving: ['doors', 'walkers', 'cords'], pulling: ['anchor', 'windows', 'cords'] }[key] || [];
    const rank = id => { const i = FIRST.indexOf(id); return i < 0 ? 99 : i; };
    const ST = STAGE_TABLE.Safety.stages, nowI = ST.findIndex(p => p.key === safetyGroup(now));
    const pills = h.pills('Safety by movement', ST.map((p, i) => ({ label: p.label, age: p.age, on: p.key === safetyGroup(key), now: live() && i === nowI, onclick: `openPage('safety-stage:${p.key}')`, change: stageCanChange('Safety', i, nowI) ? `hubChangeStage('Safety',${i})` : '' })), 'Safety');
    // Moving or standing by age alone (the parent hasn't said): get ready for it, don't claim it.
    const said = live() && (key === 'moving' ? (answers.crawl === 'Yes' || answers.pullUp === 'Yes') : key === 'pulling' ? answers.pullUp === 'Yes' : true);
    // Older babies aren't told standing is still to come: by about 10 months, the page talks about now.
    const head = !live() || said ? SAFETY_HEAD[key] : key === 'moving' ? ['Get ready for crawling, room by room', 'Most babies start moving between 6 and 10 months. Work through the rooms Maya will reach first.'] : key === 'pulling' ? (developmentMonth(actualMonth()) >= 10 ? ['Check what Maya can reach standing', 'Most babies pull up and cruise along furniture around now. That brings windows, cords and furniture into reach.'] : ['Get ready for pulling up', 'Standing usually comes between 8 and 10 months, and brings windows, cords and furniture into reach.']) : SAFETY_HEAD[key];
    let b = h.hero({ eyebrow: STAGE_TABLE.Safety.stages.find(p => p.key === safetyGroup(key)).label, title: head[0], lead: head[1], meter: { label: owner === 'setup' ? 'Setup checks' : owner === 'reach' ? 'Rolling checks' : safetyGroup(key) === 'pulling' ? 'Babyproofing checks, the same list as Crawling' : 'Babyproofing checks', n: done, of: guide.ids.length }, button: { label: pending.length ? (done ? 'Keep going with the checklist' : 'Open the checklist') : 'Review the checklist', onclick: `openSafetyChecklist('${owner}',${browse})` } });
    // The setup numbers worth remembering, as tiles.
    if (owner === 'setup') b += hubAgeTiles({ title: '', items: [['Water heater', '120°F', 'Or lower, so tap water can’t scald'], ['Smoke and carbon monoxide alarms', 'Monthly', 'Press the test button on each'], ['Car seat', 'Rear-facing', 'In the back seat, for as long as the seat allows']], cat: 'Safety', caption: 'Water heater 120°F or lower, test smoke and carbon monoxide alarms monthly, car seat rear-facing in the back seat.' });
    b += pending.length
      ? h.list(done ? 'Next up' : 'Start with these', [...pending].sort((x, y) => rank(x) - rank(y)).slice(0, owner === 'setup' ? 4 : 3).map(id => h.row({ icon: SAFETY_ICON[id] || 'shield', cat: 'Safety', title: (items[id] || {}).title || id, sub: SAFETY_SUB[id] || shortLine((items[id] || {}).body), onclick: browse ? `openSafetyChecklist('${owner}',true)` : `openHomeSafetyCheck('${owner}','${id}')` })))
      : h.note(guide.ids.every(id => safetyCheckStatus(id) === 'na') ? 'None of these apply to your home. Look again if your space changes.' : guide.ids.some(id => safetyCheckStatus(id) === 'na') ? 'You’ve checked everything for this stage. Some don’t apply to your home.' : 'You’ve done every check for this stage. Nice work.');
    // The sleep space, in step with Sleep: the swaddle comes off at the first try to roll; the crib mattress goes down
    // before sitting, and to its lowest before pulling up. Each row opens Sleep's page, so the advice lives in one place.
    if (key === 'reaching' && answers.swaddleStopped !== 'Yes' && !answers.neverSwaddled) b += h.list('In the sleep space', [h.row({ icon: 'sack', cat: 'Safety', title: 'Stop swaddling at the first try to roll', sub: 'Then a sleep sack, arms free', onclick: "openPage('chg:Sleep:d:swaddleoff')" })]);
    else if ((key === 'rolling' || key === 'moving') && answers.mattressLowered !== 'Yes' && answers.mattressLowest !== 'Yes') b += h.list('In the sleep space', [key === 'rolling' && developmentMonth(actualMonth()) <= 6 && answers.swaddleStopped !== 'Yes' && !answers.neverSwaddled ? h.row({ icon: 'sack', cat: 'Safety', title: 'Still swaddling? Stop now', sub: 'At the first try to roll, switch to a sleep sack', onclick: "openPage('chg:Sleep:d:swaddleoff')" }) : null, h.row({ icon: 'crib', cat: 'Safety', title: 'Lower the crib mattress', sub: 'Before or as soon as {s} {sit|sits}', onclick: "openPage('chg:Sleep:d:mattress')" })]);
    else if (key === 'pulling' && answers.mattressLowest !== 'Yes') b += h.list('In the sleep space', [h.row({ icon: 'crib', cat: 'Safety', title: 'Set the crib mattress to its lowest', sub: 'Before or as soon as {s} {stand|stands}', onclick: "openPage('chg:Sleep:d:mattress')" })]);
    // Choking first aid lives with Feeding, but parents look for it here too: one row, same page.
    const aid = !!(window.__chg && window.__chg.local.safe && window.__chg.local.safe.Feeding && window.__chg.local.safe.Feeding[1]);
    b += h.list('Good to know', [h.row({ icon: 'shield', cat: 'Safety', title: (typeof actualMonth === 'function' && actualMonth() >= 12 ? 'Learn choking first aid for a child' : 'Learn infant choking first aid'), sub: aid ? 'You’ve learned this. A refresher any time.' : 'A short video now, and a class if you can', chipText: aid ? 'Done' : '', chipTone: aid ? 'is-done' : '', onclick: "openPage('chg:Feeding:safe')" }), ['setup', 'reaching', 'rolling', 'moving'].includes(key) ? h.row({ icon: 'toy', cat: 'Safety', title: 'Swings, bouncers and floor seats', sub: 'Check the limits, strap in, keep them on the floor', onclick: "openPage('chg:Safety:d:gear')" }) : null]);
    // Joined later, or skipped a stage? One quiet row back to earlier checklists that still have checks open.
    if (live() && !browse) {
      const order = ['setup', 'reach', 'mobile'], names = { setup: 'First setup', reach: 'Rolling' }, gs = safetyOwnedGuides();
      const left = order.slice(0, order.indexOf(owner)).map(o => [o, safetyPendingIds(gs[o].ids).length]).filter(x => x[1]);
      if (left.length) b += h.list('', [h.row({ icon: 'notepad', cat: 'Safety', title: 'Earlier checks', sub: left.map(([o, n]) => `${n} from ${names[o]}`).join(', ') + ', if you haven’t done them', onclick: `openSafetyChecklist('${left[0][0]}',false)` })]);
    }
    b += h.versus('If something goes wrong', ['Poison Help', 'Call 1-800-222-1222 if Maya swallows something that could be harmful.'], ['Call 911', 'If {s} can’t breathe or won’t wake. A swallowed battery or magnet means the ER right away.']);
    const STG = STAGE_TABLE.Safety.stages, nxS = STG[STG.findIndex(p => p.key === safetyGroup(key)) + 1];
    if (nxS && !browse) b += h.next('Coming up', nxS.label, `openPage('safety-stage:${nxS.key}')`);
    b += h.more('Get help with babyproofing', `openSafetyChecklist('${owner}',${browse})`);
    return frame('Safety', `data-safety-stage="${key}" data-safety-owner="${owner}"`, pills, b);
  };

  /* ---------- Health: "What happens at this checkup?" ---------- */
  const EXPECT = { 0: 'Feeding, jaundice and newborn test results', 1: 'Growth, feeding comfort and early responses', 2: 'Growth, responses to you and milk feeding', 4: 'Movement, interaction, feeding and sleep', 6: 'Growth, new skills, first foods and teeth', 9: 'The development questionnaire, feeding and growth', 12: 'Growth, blood tests, teeth and feeding changes' };
  window.healthJourneyOverview = healthJourneyOverview = function (selected = null) {
    const focus = healthJourneyFocus(), age = WELL_VISITS.includes(selected) ? selected : focus, h = H();
    const record = healthRecord(age), done = record?.status === 'attended', planned = record?.status === 'planned';
    const label = healthJourneyLabel(age), the = 'the ' + label.charAt(0).toLowerCase() + label.slice(1);
    // "Now" only when the checkup is close (within about 2 weeks) or past due; otherwise it's the next one.
    const focusDue = focus === 0 ? new Date(parse(profile.dob).getTime() + 5 * 864e5) : addMonths(parse(profile.dob), focus), nowLabel = (focusDue - NOW) / 864e5 <= 14 ? 'Now' : 'Next';
    const pills = h.pills('Checkups', WELL_VISITS.map(a => ({ label: STAGE_TABLE.Health.stages[WELL_VISITS.indexOf(a)].label, on: a === age, now: live() && a === focus, nowLabel, onclick: `openPage('health-visit:${a}')` })), 'Health');
    const eyebrow = done ? `Done · ${journeyDateLabel(record.date)}` : planned ? `Saved for ${journeyDateLabel(record.date)}` : age === 0 ? 'In the first week' : live() ? `Due ${dueWhen(iso(addMonths(parse(profile.dob), age)))}` : `At ${age} month${age === 1 ? '' : 's'}`;
    const title = (done ? `You’ve been to ${the}` : `What happens at ${the}`).replace(/(\d+)-month/g, '$1\u2011month');   // keep "6-month" on one line
    // The buttons follow the checkup's timing: past due asks to add it, far ahead only saves a date.
    const dueAt = age === 0 ? new Date(parse(profile.dob).getTime() + 5 * 864e5) : addMonths(parse(profile.dob), age), dueDays = Math.round((dueAt - NOW) / 864e5);
    const pastDue = live() && !done && !planned && dueDays < -14, farAhead = !done && !planned && dueDays > 14;
    const eyebrow2 = pastDue ? `Was due ${dueWhen(iso(dueAt))}` : eyebrow;
    // A past checkup that was never confirmed doesn't vanish: one quiet line on the current checkup.
    let missedLine = '';
    if (false && live() && age === focus) {   // a missed checkup is asked once, on Home
      let skipped = {}; try { skipped = JSON.parse(localStorage.getItem('ahead-visit-skipped:' + journeyKey())) || {}; } catch (e) {}
      const prev = WELL_VISITS[WELL_VISITS.indexOf(focus) - 1], missed = prev != null && !healthRecord(prev) && !skipped[prev] ? prev : null;
      if (missed != null) missedLine = `<section class="hub-missed"><p>${F(`The ${healthJourneyLabel(missed).charAt(0).toLowerCase() + healthJourneyLabel(missed).slice(1)} isn’t in Memories yet.`)}</p><div><button onclick="hubVisitYes(${missed})">Add it</button><button onclick="hubVisitSkipped(${missed})">We skipped it</button></div></section>`;
    }
    let b = h.hero({ eyebrow: eyebrow2, title, lead: conceptHealthSummary(age), button: done ? { label: 'Add notes from the checkup', onclick: `openHealthDetail(${age},'notes')` } : pastDue ? { label: 'Add it to Memories', onclick: `openPage('visit-form:${age}')` } : { label: planned ? 'Change the date' : 'Save the date', onclick: `openPage('visit-form:plan-${age}')` } });
    if (pastDue) b += `<div class="hub-browse"><button class="hub-link" onclick="openPage('visit-form:plan-${age}')">${F('Booked for later? Save the date')} ›</button></div>`;
    else if (!done && !farAhead) b += `<div class="hub-browse"><button class="hub-link" onclick="openPage('visit-form:${age}')">${F(planned && record.date < iso(NOW) ? 'Been already? Mark it as done' : 'Already had this checkup? Mark it as done')} ›</button></div>`;
    if (live() && age !== focus) b += back('Back to your next checkup', `openPage('health-visit:${focus}')`);
    b += h.list('For the checkup', [
      h.row({ icon: 'clock', cat: 'Health', title: 'What to expect', sub: EXPECT[age], onclick: `openHealthDetail(${age},'expect')` }),
      `<span id="health-vaccines"></span>` + h.row({ icon: 'shield', cat: 'Health', title: 'Vaccines', sub: age === 0 ? 'Hepatitis B, and protection against RSV, a common winter virus' : ({ 1: 'Hepatitis B, dose 2 (if not at 2 months)', 2: 'DTaP, Hib, pneumococcal, polio, rotavirus and hepatitis B', 4: 'DTaP, Hib, pneumococcal, polio and rotavirus', 6: 'DTaP, pneumococcal and more, plus flu and COVID in season', 9: 'Usually catch-up only, plus flu in season', 12: 'MMR, chickenpox, hepatitis A, and Hib and pneumococcal boosters' })[age] || 'What’s due at this checkup', onclick: `openHealthDetail(${age},'vaccines')` }),
      h.row({ icon: 'notepad', cat: 'Health', title: 'Questions and notes', sub: visitNotesFor(age) ? 'Your questions, and notes from this checkup' : 'Bring your questions, and jot down the answers', onclick: `openHealthDetail(${age},'questions')` })
    ]);
    b += h.list('Between checkups', [
      h.row({ icon: 'thermo', cat: 'Health', title: `When Maya seems sick`, sub: 'Fevers, tummy bugs and when to call', onclick: "openPage('chg:Health:d:sick')" }),
      h.row({ icon: 'drop', cat: 'Health', title: 'Colds and stuffy noses', sub: 'Saline, suction, and when it’s an ear infection', onclick: "openPage('chg:Health:d:cold')" }),
      h.row({ icon: 'heart', cat: 'Health', title: 'How are you doing?', sub: 'Your health matters too', onclick: "openPage('chg:Health:d:you')" })
    ]);
    // "Between checkups" shows on every checkup page; "When to call" uses Maya's age now, so it shows on the current checkup only.
    const nowPage = !live() || age === focus;
    if (nowPage) b += h.versus('When to call', ['Call your pediatrician', feverRule(actualMonth())], ['Call 911', 'Struggles to breathe or turns blue, won’t wake or is floppy, or has a seizure.']);
    const nx = WELL_VISITS[WELL_VISITS.indexOf(age) + 1];
    if (nx != null) b += h.next(live() && age === focus ? 'After that' : 'Next checkup', healthJourneyLabel(nx), `openPage('health-visit:${nx}')`);
    return frame('Health', `data-health-journey="${age}"`, pills + missedLine, b);
  };

  window.hubSeen = function (key) {
    const rec = journeyData().records.find(r => r.type === 'milestone' && r.skillKey === key);
    if (!rec && typeof saveJourneySkill === 'function') saveJourneySkill(key, { date: iso(NOW) });
    const y = scrollY; render(); scrollTo(0, y);
  };
  // The big question at each checkpoint, on the area it's about.
  const DEV_BIG = {
    2: ['Social', 'When will {s} smile at me?', 'Most babies smile back by about 6–8 weeks.'],
    4: ['Movement', 'Should {s} be rolling yet?', 'Not yet for most babies. Rolling usually shows up between 4 and 6 months.'],
    6: ['Movement', 'When will {s} sit on {p} own?', 'Most babies sit without support by about 9 months. Sitting propped on {p} hands is right on track.'],
    9: ['Movement', 'What about crawling?', 'Many babies skip crawling. Some scoot or roll instead. What matters is that Maya finds a way to move.'],
    12: ['Movement', 'Should {s} be walking?', 'Not yet for most babies. First steps often come between 12 and 15 months.']
  };
  // [from, to, band start, band end, band label, ticks] in months, for the big question's picture.
  const DEV_BIG_BAR = {
    2: [0, 4, 1.2, 2.2, 'Smiling', [[0, 'Birth'], [2, '2 mo'], [4, '4 mo']]],
    4: [0, 9, 4, 6, 'Rolling', [[0, 'Birth'], [4, '4 mo'], [6, '6 mo'], [9, '9 mo']]],
    6: [3, 12, 6, 9, 'Sitting alone', [[3, '3 mo'], [6, '6 mo'], [9, '9 mo'], [12, '1 year']]],
    9: [4, 14, 6, 10, 'Crawling', [[4, '4 mo'], [6, '6 mo'], [10, '10 mo'], [14, '14 mo']]],
    12: [8, 18, 12, 15, 'First steps', [[8, '8 mo'], [12, '1 year'], [15, '15 mo'], [18, '18 mo']]]
  };
  // An icon that matches each skill's words.
  const SKILL_ICON = l => { const t = l.toLowerCase();
    return /peekaboo|hid|dropped/.test(t) ? 'peek' : /wave|goodbye/.test(t) ? 'wave' : /roll/.test(t) ? 'roll' : /crawl/.test(t) ? 'crawl' : /stand|pull|steps|furniture/.test(t) ? 'stand' : /sit/.test(t) ? 'sit' : /tummy|push/.test(t) ? 'mat' : /head/.test(t) ? 'head'
      : /cup|drink/.test(t) ? 'cup' : /mouth|lips|food|breast|bottle|feed/.test(t) ? 'mouth' : /mirror/.test(t) ? 'mirror' : /name|voice|loud|sound|hear/.test(t) && !/makes|babble/.test(t) ? 'ear'
      : /smil|laugh|chuckle|glad|familiar|shy|clingy|game|pat-a-cake/.test(t) ? 'smile' : /coo|babble|raspberr|squeal|word|mama|dada|sounds|no/.test(t) ? 'chat' : /look|watch|face|expression|eyes/.test(t) ? 'eye'
      : /hand|grasp|rake|thumb|finger|hold|swipe|reach|grab|arms|leg/.test(t) ? 'hand' : /toy|object|bang|container|put|stack/.test(t) ? 'blocks' : DOMAIN_ICONS_FALLBACK; };
  let DOMAIN_ICONS_FALLBACK = 'smile';
  // One idea per area at each checkpoint, each one of that checkpoint's pictured ideas (Movement has its own).
  const AREA_IDEA = { 2: { Social: 'close-face', Talking: 'song-listen', Thinking: 'bold-picture' }, 4: { Social: 'mirror-company', Talking: 'crinkle-book', Thinking: 'easy-grip' }, 6: { Social: 'peek-face', Talking: 'floor-drum', Thinking: 'two-hands' }, 9: { Social: 'ball-turns', Talking: 'hello-wave', Thinking: 'hidden-toy' }, 12: { Social: 'pretend-cup', Talking: 'action-book', Thinking: 'stack-pair' } };
  const devAreaIdea = (ref, domain) => { const id = AREA_IDEA[ref]?.[domain]; if (!id || typeof playStageModel !== 'function') return null; for (let m = 0; m <= 12; m++) { const x = playStageModel(m), a = [...(x.primary || []), ...(x.more || [])].find(y => y.id === id); if (a) return a; } return null; };
  function developmentDomainPageSigns(ref, domain, rows, big, tc, meta, age, h) {
    const tryCard = `<section class="hub-card dev-try"><span class="hub-card-head"><b>${F('Try this together')}</b></span><button class="dev-try-row" onclick="openPage('chg:Development:d:signs')"><span class="dev-idea-art dev-signs-art">${h.art('signs', 'Development')}</span><span class="hub-row-copy"><b>${F('Teach a few simple signs')}</b><small>${F('More, eat, milk and all done, so Maya can tell you before {s} can say it')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></section>`;
    const call = `<p class="dev-call">${F('Not all of these yet? Mention it at {p} next checkup. Call sooner if Maya loses a skill {s} had.')}</p>`;
    const credit = rows.includes('dev-see') ? `<p class="dev-credit">${F('Photos and videos: Source CDC, free at cdc.gov. The CDC doesn’t endorse Ahead.')}</p>` : '';
    return `<div class="quiet-category hub-page hub-detail dev-area-page is-${domain}" data-overview="Development" style="${yearTheme('Development')}${tc ? `;--area:${tc[0]};--area-ink:${tc[1]}` : ''}">${detailPageTop('Development')}<div class="dev-area-head">${window.devTileArt ? `<span class="dev-area-head-art">${devTileArt(domain, ref)}</span>` : ''}<p class="hub-context">${esc(`By ${age}`)}</p><h1>${esc(meta.title)}</h1><p class="hub-lead">${esc(DEV_STAGES[ref].summaries[domain])}</p></div><p class="dev-sub">${F(`Working on now, by ${age}`)}</p><div class="hub-ticks">${rows}</div>${big}${tryCard}${call}${credit}</div>`;
  }
  window.developmentDomainPage = developmentDomainPage = function (ref, domain) {
    const meta = DEV_DOMAINS[domain], labels = DEVELOPMENT_DOMAINS[ref]?.[domain];
    if (!meta || !labels) return developmentJourneyOverview(ref);
    const h = H(), age = ref === 12 ? '1 year' : ref + ' months';
    DOMAIN_ICONS_FALLBACK = DOMAIN_ICONS[domain] || 'smile';
    // Each skill once: its name, "Seen it", and what it looks like (words, photo or video) on tap.
    const hl = (window.DEV_HEADLINE || {})[ref]?.[domain];
    const ordered = hl ? [...labels].sort((x, y) => (hl[1].test(clearMilestone(y)) ? 1 : 0) - (hl[1].test(clearMilestone(x)) ? 1 : 0)) : labels;
    const tc = window.devTileColors ? devTileColors(domain) : null;
    const rows = ordered.map(l => { const key = journeySkillKey(l), rec = journeyData().records.find(r => r.type === 'milestone' && r.skillKey === key) || (skillSeen(l) ? { reported: true } : null);
      const see = window.devSeeButton ? devSeeButton(key, clearMilestone(l)) : '';
      const desc = (window.hubBabyify || (x => x))(F(DEV_EXAMPLES[l] || ''));
      return `<div class="hub-tick is-habit dev-skill"><span class="hub-tick-art">${h.art(SKILL_ICON(l), 'Development')}</span><span class="hub-row-copy"><b>${(window.hubBabyify || (x => x))(F(clearMilestone(l)))}</b>${desc ? `<small>${desc}</small>` : ''}${see}</span>${rec ? `<span class="hub-chip is-done">${F('Seen')} ✓</span>` : `<button class="hub-seen" onclick="hubSeen('${key}')">${F('Seen it')}</button>`}${see ? `<div class="dev-media" hidden></div>` : ''}</div>`; }).join('');
    // The big question, only on the area it's about.
    const W = DEV_BIG_BAR[ref], nowMo = live() ? (NOW - parse(profile.early && profile.due && developmentMonth(actualMonth()) !== actualMonth() ? profile.due : profile.dob)) / 2629746e3 : null;
    const big = DEV_BIG[ref] && DEV_BIG[ref][0] === domain ? `<section class="hub-card dev-bigq"><span class="hub-card-head"><b>${F(DEV_BIG[ref][1])}</b></span>${W && window.hubWindowBar ? hubWindowBar({ title: '', from: W[0], to: W[1], zones: [[W[2], W[3], W[4], 'band']], ticks: W[5], now: nowMo, cat: 'Development', caption: F(DEV_BIG[ref][2]) }) : ''}<p class="dev-bigq-a">${F(DEV_BIG[ref][2])}</p></section>` : '';
    // Try this together: on Movement, the idea that helps with the big question; elsewhere, an idea for one of these skills.
    const move = domain === 'Movement' && window.devMoveIdea ? devMoveIdea(ref) : null;
    const act = !move && devAreaIdea(ref, domain);
    const pic = move ? move.art : act && window.devPlayArt ? devPlayArt(act.id) : '';
    // From 6 months, Communication's idea is baby signs: a way to help Maya say what {s} {want|wants} before the words come.
    if (domain === 'Talking' && ref >= 6) return developmentDomainPageSigns(ref, domain, rows, big, tc, meta, age, h);
    const tryCard = move || act ? `<section class="hub-card dev-try"><span class="hub-card-head"><b>${F('Try this together')}</b></span><button class="dev-try-row" onclick="openPage('${move ? `chg:Development:d:move:${ref}` : `chg:Development:d:idea:${ref}:${act.id}`}')">${pic ? `<span class="dev-idea-art">${pic}</span>` : ''}<span class="hub-row-copy"><b>${F(move ? move.title : act.title)}</b><small>${move ? F(move.why) : playLine(act)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></section>` : '';
    const call = `<p class="dev-call">${F('Not all of these yet? Mention it at {p} next checkup. Call sooner if Maya loses a skill {s} had.')}</p>`;
    const credit = rows.includes('dev-see') ? `<p class="dev-credit">${F('Photos and videos: Source CDC, free at cdc.gov. The CDC doesn’t endorse Ahead.')}</p>` : '';
    return `<div class="quiet-category hub-page hub-detail dev-area-page is-${domain}" data-overview="Development" style="${yearTheme('Development')}${tc ? `;--area:${tc[0]};--area-ink:${tc[1]}` : ''}">${detailPageTop('Development')}<div class="dev-area-head">${window.devTileArt ? `<span class="dev-area-head-art">${devTileArt(domain, ref)}</span>` : ''}<p class="hub-context">${esc(`By ${age}`)}</p><h1>${esc(meta.title)}</h1><p class="hub-lead">${esc(DEV_STAGES[ref].summaries[domain])}</p></div><p class="dev-sub">${F(`Working on now, by ${age}`)}</p><div class="hub-ticks">${rows}</div>${big}${tryCard}${call}${credit}</div>`;
  };

  /* ---------- small detail screens for these categories ---------- */
  function detailFrame(cat, context, title, lead, inner) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="${cat}" style="${yearTheme(cat)}">${detailPageTop(cat)}<div class="hub-detail-head"><span class="hub-big">${hubArt(hubPageIcon(cat, title), cat)}</span><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }
  // One fever rule, used everywhere fever comes up. Source: AAP, HealthyChildren.org "Fever: When to Call the Pediatrician":
  // under 3 months, 100.4°F or higher; any age, a fever that keeps rising above 104°F; under 2, a fever lasting more than 24 hours.
  window.feverRule = m => m < 3
    ? 'A temperature of 100.4°F or higher: call your pediatrician right away, day or night.'
    : 'A fever that keeps going above 104°F, lasts more than a day, or comes with a rash, unusual sleepiness or fewer wet diapers.';
  window.feverBand = m => m < 3 ? 'Under 3 months' : '3 months and up';
  function healthDetail(id) {
    const h = H(), under3 = actualMonth() < 3;
    if (id === 'you') return detailFrame('Health', 'Looking after you', 'How are you doing?', 'Caring for a new baby is a lot, for every parent. Your health matters too, and asking for help is part of looking after Maya.',
      hubWindowBar({ title: 'How long low feelings usually last', from: 0, to: 8, zones: [[0, 2, 'Common', 'band'], [2, 8, 'Still there? Get help', 'alert']], ticks: [[0, 'Birth'], [2, '2 weeks'], [4, '4 weeks'], [8, '8 weeks']], cat: 'Health', caption: 'Feeling weepy or overwhelmed is common in the first two weeks. If it lasts longer than that, get help.' })
      + h.versus('Common, or time to get help?', actualMonth() < 1 ? ['Common in the first two weeks', 'Feeling weepy, anxious or overwhelmed, with good moments in between. It usually eases on its own.'] : ['Common', 'Feeling worn out, short-tempered or flat after weeks of broken sleep. Rest and a little help usually make a real difference.'], ['Get help', 'Low mood or worry most days, can’t sleep even when you could, or feeling you can’t cope.'])
      + `<section class="hub-card hub-callout"><b>${F('Talk to someone today')}</b><p>${F('Call or text the National Maternal Mental Health Hotline at 1-833-852-6262. It’s free, confidential and open any time, for moms, partners and new parents.')}</p><a class="hub-button" href="tel:18338526262">${F('Call 1-833-852-6262')}</a></section>`
      + `<h2 class="hub-h2">${F('What helps')}</h2>` + hubIconSteps([['steth', 'Say how you’re feeling', 'To your doctor or Maya’s pediatrician. It’s common and treatable'], ['heart', 'Take the help', 'And name something specific, like a meal or a nap'], actualMonth() < 1 ? ['notepad', 'Your postpartum checkup', 'If you gave birth, go even if you feel fine'] : ['moon', 'Trade nights', 'One longer stretch of sleep helps more than you’d think']], 'Health', F('Say how you are feeling to a doctor, take the help people offer, and trade nights for one longer stretch of sleep.'), false)
      + `<section class="hub-card hub-callout is-urgent"><b>${F('If you’re thinking about harming yourself or Maya')}</b><p>${F('Call or text 988, or call 911, right now.')}</p><a class="hub-button" href="tel:988">${F('Call 988')}</a></section>`);
    // "When Maya seems sick" is a short hub: the one fever rule for this baby's age, then one page per job
    // (take a temperature, help them feel better, tummy bugs, colds), and the emergency signs last (AAP, HealthyChildren.org).
    const m = actualMonth(), u3 = m < 3;
    const call911 = `<section class="hub-card hub-callout"><b>${F('Call 911 if Maya')}</b><p>${F('Struggles to breathe or turns blue, won’t wake or is floppy, or has a seizure.')}</p></section>`;
    const feverCard = `<section class="hub-card hub-fever is-calm"><div class="hub-fever-bands is-one"><div><small>${F(feverBand(m))}</small><b>${u3 ? '100.4°F<span> or higher</span>' : 'Above 104°F<span> and keeps going up</span>'}</b><p>${F(u3 ? 'Call your pediatrician right away, day or night.' : 'Or a fever that lasts more than a day. Call your pediatrician.')}</p></div></div><p class="hub-fever-note">${F('Also call if Maya seems very unwell, has a rash, is unusually sleepy, or is still unwell after the fever comes down.')}</p></section>`;
    // One flow, in the order a parent lives it: check for a fever and know when that means calling,
    // make them comfortable, then the two common bugs, and the emergency signs last.
    const thermo = () => {
      // Which thermometer, by age: rectal is most accurate all year; armpit works for a quick check (fever from 99°F);
      // forehead works at any age; ear readings only from 6 months.
      const fe = u3 ? ['Forehead', 'Fine for a quick check. If it reads 100.4°F or higher, check rectally'] : m < 6 ? ['Forehead', 'Reliable now. Ear thermometers work from 6 months'] : ['Forehead or ear', 'Both reliable now'];
      const tile = (icon, t, d, good) => `<div${good ? ' class="is-good"' : ''}><span class="hub-dot">${h.art(icon, 'Health')}</span><b>${F(t)}</b><p>${F(d)}</p></div>`;
      return `<div class="hub-card hub-thermo is-three">${tile('thermo', 'Rectal', 'The most accurate reading for babies', true)}${tile('hand', 'Armpit', u3 ? 'Easy, but less accurate. If it reads 99°F or higher, check rectally' : 'Easy, but less accurate. A fever starts at 99°F this way')}${tile('eye', fe[0], fe[1])}</div>`;
    };
    if (id === 'sick' || id === 'sick-temp' || id === 'sick-care') {
      return detailFrame('Health', 'Between checkups', 'When Maya seems sick', 'Most baby illnesses are mild and pass in a few days.',
        `<h2 class="hub-h2">${F('Check for a fever')}</h2>` + thermo()
        + `<h2 class="hub-h2">${F('When a fever means calling')}</h2>` + feverCard
        + `<h2 class="hub-h2">${F('Help {o} feel better')}</h2>`
        + hubIconSteps([['bottle', 'Extra feeds', 'Little and often'], ['shirt', 'Dress {o} lightly', 'No extra layers or blankets'], ['moon', 'Lots of rest', 'Naps and quiet time']], 'Health', 'Offer extra feeds, dress lightly, and let them rest.', false)
        + h.tip('Medicine', u3 ? 'Under 3 months, don’t give any medicine without asking your pediatrician first.' : m < 6 ? 'Acetaminophen can help, after checking with your pediatrician. Ask for the dose for {p} weight.' : 'Acetaminophen or ibuprofen can help. Ask your pediatrician for the dose for {p} weight, and check the label every time.')
        + h.list('A tummy bug or a cold?', [
          h.row({ icon: 'bottle', cat: 'Health', title: 'Vomiting or diarrhea', sub: 'Keep feeds going, and when to call', onclick: "openPage('chg:Health:d:sick-tummy')" }),
          h.row({ icon: 'drop', cat: 'Health', title: 'A cold or stuffy nose', sub: 'Saline, suction, and ear infections', onclick: "openPage('chg:Health:d:cold')" })
        ])
        + call911);
    }
    if (id === 'sick-tummy') {
      return detailFrame('Health', 'When Maya seems sick', 'Vomiting or diarrhea', 'Usually a tummy bug that passes in a day or two. Keeping {o} drinking is what matters.',
        hubIconSteps([['bottle', 'Keep feeds going', 'Breast milk or formula, a little at a time'], ['diaper', 'Watch the diapers', 'Far fewer wet ones can mean dehydration'], ['steth', 'Ask before medicine', 'Or any rehydration drink']], 'Health', 'Keep feeds going a little at a time, watch the wet diapers, and ask before giving medicine.', false)
        + h.versus('Normal, or time to call?', ['Normal', 'A few loose poops or a vomit or two for a day or so, while {s} still {feed|feeds} and has wet diapers.'], ['Call your pediatrician', 'Can’t keep feeds down, green or bloody vomit, blood in the poop, a swollen belly, a dry mouth or no tears.'])
        + call911);
    }
    return null;
  }
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if (cat === 'Development' && screen === 'd' && a === 'signs') return detailFrame('Development', 'Development & play', 'Try a few baby signs', 'A few simple signs let Maya tell you what {s} {want|wants} before {s} can say it. Tap one to watch it.',
      // "When" is a question, so it's an answer card first; the tips aren't an order, so they're tiles.
      H().qa([['When will {s} sign back?', 'Around 8–12 months', 'Signing won’t slow down {p} talking.']])
      + (window.hubSigns ? hubSigns() : '')
      + `<h2 class="hub-h2">${F('What helps')}</h2>` + hubIconSteps([['star', 'Start with 2 or 3', 'Ones you’ll use every day'], ['chat', 'Say it as you sign', '“More?”'], ['heart', 'Cheer {p} version', 'Even if it looks different']], 'Development', F('Start with two or three signs, say the word as you sign it, and cheer the baby’s version.'), false));
    if (cat === 'Development' && screen === 'd' && a === 'faq') { const ref = DEV_STAGES[b] ? Number(b) : devRef(); return detailFrame('Development', DEV_STAGES[ref].title, 'What other parents ask', '', devCommonQuestions(ref).replace('<h2>Common questions</h2>', '').replace('class="common-questions"', 'class="common-questions hub-faq"')); }
    // Swings, bouncers and floor seats: the label's limits, straps, the floor, and never for sleep (AAP, CPSC).
    if (cat === 'Safety' && screen === 'd' && a === 'gear') return detailFrame('Safety', 'Safety', 'Swings, bouncers and floor seats', 'Handy for a few minutes of hands-free time. A few habits keep them safe.',
      hubIconSteps([['shield', 'Check the label', 'Weight and age limits. Stop once Maya reaches them.'], ['hand', 'Strap in every time', 'Even for a minute'], ['home', 'On the floor', 'Never on a table, counter, bed or sofa'], ['moon', 'Not for sleep', 'Fell asleep? Move {o} to {p} crib, on {p} back']], 'Safety', 'Check the weight and age limits, strap in every time, keep it on the floor, and never use it for sleep.', false)
      + H().tip('When to stop using a bouncer', 'Once Maya can sit up on {p} own or {try|tries} to climb out, even if {s’s} under the weight limit.')
      + H().tip('Stay close', 'Keep Maya within sight, and keep older kids and pets from rocking or pushing it.'));
    // Colds and stuffy noses: saline and suction, a cool-mist humidifier, no cold medicines, and when to call (AAP).
    if (cat === 'Health' && screen === 'd' && a === 'cold') return detailFrame('Health', 'Health', 'Colds and stuffy noses', 'Most babies catch several colds in the first year. They usually clear up on their own in about 7–10 days.',
      // Clearing the nose is an order (saline, then suction); the rest are separate things that help.
      `<h2 class="hub-h2">${F('Clearing a stuffy nose')}</h2>` + hubIconSteps([['drop', 'Saline drops', 'A few drops in each nostril loosen the mucus'], ['swallow', 'Then gentle suction', 'A bulb syringe or nasal aspirator, before feeds and sleep']], 'Health', 'Saline drops first, then gentle suction before feeds and sleep.', true)
      + `<h2 class="hub-h2">${F('Also helps')}</h2>` + hubIconSteps([['snow', 'Cool-mist humidifier', 'In {p} room at night. Clean it every day'], ['bottle', 'Keep feeds going', 'Smaller, more frequent feeds are fine']], 'Health', 'A cool-mist humidifier at night, and plenty of feeds.', false)
      + H().tip('Skip cough and cold medicines', 'They aren’t safe for babies. No honey before 1 year either.')
      + H().versus('When to call', ['Call your pediatrician', 'Any fever under 3 months, fewer wet diapers, ear pulling, a cough or cold that lasts more than 10 days, or a fever that lasts more than a day.'], ['Call 911', 'Struggles to breathe, ribs pulling in with each breath, or lips turning blue.'])
      + `<h2 class="hub-h2">${F('When it might be an ear infection')}</h2>`
      + `<div class="hub-card hub-looks"><b class="hub-fig-title">${F('Ear infections often follow a cold. Look for')}</b><ul>${['Fussing and crying, especially lying down', 'Trouble sleeping, or a new fever', 'Pulling at an ear, along with these', 'Fluid draining from the ear'].map(t => `<li>${F(t)}</li>`).join('')}</ul></div>`
      + H().tip('Call your pediatrician', 'If you see these signs. Pulling at an ear on its own, without a cold or fever, is usually nothing.')
      + H().note('Wash hands often and keep sick visitors away, especially in the first months.'));
    if (cat === 'Health' && screen === 'd') { const pg = healthDetail(a); if (pg) return pg; }
    if (cat === 'Daily rhythm' && screen === 's') return everydayCare(Number(a));
    if (cat === 'Daily rhythm' && screen === 'd' && a !== 'more') return careDetail(a);
    if ((cat === 'Daily rhythm' || cat === 'Development') && screen === 'd' && a === 'more') {
      const { phase, primary, more } = playStageModel(Number(b)), h = H();
      const all = [...primary, ...more];
      return detailFrame('Development', phase.title, 'Ideas to try together', 'Pick whatever suits the moment. There’s no need to do them all.', h.list('', all.map(x => h.row({ icon: 'hand', cat: 'Development', title: (window.hubBabyify || (y => y))(x.title), sub: playLine(x) }))));
    }
    return baseRoute(p);
  };

  /* ---------- Checkup questions and notes: one page for the visit, in the Health guide's style ---------- */
  const baseHealthDetail = window.healthJourneyDetail;
  window.healthJourneyDetail = healthJourneyDetail = function (age, part) {
    if (part === 'help') {
      // When to get help as a ladder: urgent at the top, the checkup at the bottom.
      const rule = feverRule(actualMonth());
      const ladder = `<section class="hub-ladder" aria-label="When to get help"><div class="is-911"><b>${F('Call 911')}</b><p>${F('Struggles to breathe or turns blue, won’t wake or is floppy, or has a seizure.')}</p></div><div class="is-now"><b>${F('Call your pediatrician now')}</b><p>${F(rule.charAt(0) + rule.slice(1))} ${F('Also a lost skill, trouble feeding, fewer wet diapers, or a baby who seems unusually unwell.')}</p></div><div class="is-visit"><b>${F('Bring it to the checkup')}</b><p>${F('Questions about growth, everyday patterns or decisions coming up.')}</p></div></section>`;
      return baseHealthDetail(age, part).replace(/<section class="care-boundaries">[\s\S]*?<\/section>/, ladder);
    }
    if (part === 'vaccines') {
      const html = baseHealthDetail(age, part), cut = html.indexOf('Seasonal and individual');
      const routine = (html.slice(0, cut < 0 ? html.length : cut).match(/vaccine-detail/g) || []).length, seasonal = cut < 0 ? 0 : (html.slice(cut).match(/vaccine-detail/g) || []).length;
      const tiles = `<div class="hub-vax-count"><div><b>${routine}</b><span>${F('routine vaccines to expect')}</span></div>${seasonal ? `<div><b>${seasonal}</b><span>${F('seasonal ones to ask about')}</span></div>` : ''}</div>`;
      // After the shots: what's normal, and when to call (AAP).
      const after = age === 0 ? '' : H().versus('After the shots', ['Normal for a day or two', 'Fussy or sleepy, a low fever, and a sore, red spot where the shot went in.'], ['Call your pediatrician', 'A fever of 104°F or higher, crying for 3 hours or more, or swelling that keeps growing.']);
      const combo = `<p class="hub-vax-combo">${F('Many of these come combined, so it’s usually fewer shots than the list suggests. Some offices give 3 or more in one.')}</p>`;
      const out = (routine >= 2 ? html.replace(/(<section class="health-vaccines"><h2>[^<]*<\/h2>)/, `$1${combo}`) : html).replace('<p class="health-small">Combination vaccines may mean fewer injections.</p>', '');
      // October to March, the seasonal ones are marked "In season now", since this is when to ask for them.
      const mo = NOW.getMonth(), inSeason = mo >= 9 || mo <= 2;
      const marked = inSeason ? out.replace(/(<details class="guide-detail vaccine-detail vaccine-conditional"><summary><span><b>(?:Flu \(influenza\)|RSV, a common winter virus)<\/b>)/g, '$1<em class="hub-season-chip">In season now</em>') : out;
      return marked.replace(/<details class="guide-detail"><summary>What about side effects\?[\s\S]*?<\/details>/, '').replace(/(<section class="health-seasonal-protection"[\s\S]*?<\/section><\/section>)/, '$1' + after);
    }
    if (part !== 'questions' && part !== 'notes') return baseHealthDetail(age, part);
    const h = H(), e = v => esc(String(v)), own = journeyData().questions[age] || [], notes = visitNotesFor(age);
    const asked = (journeyData().checks['q' + age] || {});
    const ideas = healthJourneyQuestions(age).map((q, i) => `<label class="hub-q-idea${asked[i] ? ' is-on' : ''}"><input type="checkbox" ${asked[i] ? 'checked' : ''} onchange="hubAskedQuestion(${age},${i},this.checked)"><span>${q}</span></label>`).join('');
    // Your own questions tick off too, same as the suggested ones (stored as 'm0', 'm1'…).
    const mine = own.map((q, i) => `<div class="hub-q-mine"><label class="hub-q-idea${asked['m' + i] ? ' is-on' : ''}"><input type="checkbox" ${asked['m' + i] ? 'checked' : ''} onchange="hubAskedQuestion(${age},'m${i}',this.checked)"><span>${e(q)}</span></label><button onclick="removeJourneyQuestion(${age},${i})" aria-label="Remove this question">Remove</button></div>`).join('');
    const rec = healthRecord(age), attended = rec && rec.status === 'attended';
    const inner = `<section class="hub-card hub-q-card"><div class="hub-card-head"><b>Questions to ask</b><span class="hub-chip">${Object.entries(asked).filter(([k, v]) => v && (!String(k).startsWith('m') || Number(String(k).slice(1)) < own.length)).length} of ${healthJourneyQuestions(age).length + own.length} asked</span></div><p class="hub-q-hint">${F('Tick them off as you go.')}</p>${ideas}</section>`
      + `<section class="hub-card hub-q-card"><div class="hub-card-head"><b>Your questions</b></div>${mine || `<p class="hub-q-hint">${F('Anything on your mind about Maya. It’ll be here at the visit.')}</p>`}<form class="hub-q-add" onsubmit="submitJourneyQuestion(event,${age})"><input id="visitQuestion" maxlength="500" required placeholder="Add a question" aria-label="Add a question"><button>Add</button></form></section>`
      + `<section class="hub-card hub-q-card" id="visit-notes"><div class="hub-card-head"><b>Notes from the visit</b>${notes ? '<span class="hub-chip is-done">Saved</span>' : ''}</div><form onsubmit="submitVisitNotes(event,${age})"><textarea id="appointmentNotes" maxlength="6000" rows="6" placeholder="What the pediatrician said, next steps, things to remember…" aria-label="Notes from the visit">${e(notes)}</textarea><button class="hub-q-save">Save notes</button></form></section>`
      + (live() && !attended ? `<div class="hub-browse"><button class="hub-link" onclick="openPage('visit-form:${age}')">${F('Been to this checkup? Mark it as done')} ›</button></div>` : '');
    return h.detail('Health', healthJourneyLabel(age), 'Questions and notes', F('Bring your questions, and keep what you hear with this checkup.'), inner, 'steth');
  };
  // i: a suggested question's index, or 'm0'… for your own
  window.hubAskedQuestion = function (age, i, on) { const d = journeyData(); d.checks['q' + age] = Object.assign({}, d.checks['q' + age], { [i]: on }); saveJourneyData(d); const y = scrollY; render(); scrollTo(0, y); };
  window.hubVisitSkipped = function (a) { if (typeof recordCheckin === 'function') recordCheckin('visit:' + a, 'Skipped'); let o = {}; try { o = JSON.parse(localStorage.getItem('ahead-visit-skipped:' + journeyKey())) || {}; } catch (e) {} o[a] = true; try { localStorage.setItem('ahead-visit-skipped:' + journeyKey(), JSON.stringify(o)); } catch (e) {} render(); const nx = WELL_VISITS[WELL_VISITS.indexOf(a) + 1]; if (typeof hubToast === 'function') hubToast('Got it', 'Your pediatrician can catch up on anything at the next checkup.', nx != null ? ['See the next one', `document.querySelectorAll('.hub-toast').forEach(t=>t.remove());openPage('health-visit:${nx}')`] : null); };
})();
