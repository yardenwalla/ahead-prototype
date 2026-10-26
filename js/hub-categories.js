/* Ahead · Development, Play, Safety and Health as summary screens.
   Same pattern as Sleep and Feeding: stage pills, a hero that answers the parent's question,
   at most 3 rows, a must-know card, coming up, and details one tap away (the existing focused pages). */
(function () {
  const H = () => window.__hub;
  const F = s => H().F(s);
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const monthsLabel = n => n === 0 ? 'Newborn' : n === 12 ? '1 year' : n === 1 ? '1 month' : n + ' months';
  function frame(cat, attrs, pillsHtml, body) {
    return `<div class="quiet-category hub-page" data-overview="${cat}" style="${yearTheme(cat)}" ${attrs}>${monthlyPageHeader(cat)}${pillsHtml}${body}<p class="hub-foot">Ages are typical. Every baby moves at their own pace.</p></div>`;
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
    if (typeof e === 'object') { if (e.g !== guessFor(cat)) { delete all[cat]; writeOverrides(all); return undefined; } return e.v; }
    return e;
  };
  window.hubStageOverrideRaw = cat => { const e = stageOverrides()[cat]; return e == null ? null : JSON.parse(JSON.stringify(e)); };
  window.hubStageOverrideRestore = (cat, e) => { const all = stageOverrides(); if (e == null) delete all[cat]; else all[cat] = e; writeOverrides(all); };
  window.hubSetStage = function (cat, value, silent) {
    const all = stageOverrides(); if (value == null) delete all[cat]; else all[cat] = { v: value, g: guessFor(cat) };
    writeOverrides(all);
    if (!silent) { const y = scrollY; render(); scrollTo(0, y); }
  };
  const devNow = () => { const o = hubStageOverride('Development'); return DEV_STAGES[o] ? Number(o) : devRef(developmentMonth(actualMonth())); };
  const pickedNote = (cat, label) => `<div class="hub-browse"><span class="hub-picked">${F('You picked this stage')}</span><button class="hub-link is-quiet" onclick="hubSetStage('${cat}',null)">${F(label)} ›</button></div>`;
  const back = (label, onclick) => `<div class="hub-browse"><button class="hub-link is-quiet" onclick="${onclick}">${F(label)} ›</button></div>`;
  const firstSentence = t => ((String(t || '').match(/^.*?[.!?](\s|$)/) || [String(t || '')])[0]).trim().replace(/\.$/, '');
  const shortLine = t => { const f = firstSentence(t); return f.length > 72 && f.includes(',') ? f.slice(0, f.indexOf(',')) : f; };
  // One thing to try, phrased as an action: the short prompt if there is one, otherwise the first line of how to do it.
  const playLine = a => (window.hubBabyify || (x => x))(playLineRaw(a));
  const playLineRaw = a => { const s = typeof conceptPlaySuggestion === 'function' ? conceptPlaySuggestion(a) : ''; return s && !s.startsWith(a.why || '\u0000') ? firstSentence(s) : firstSentence(a.how || a.why); };

  /* ---------- Development: "What might I see, and how can I help?" ---------- */
  const DOMAIN_TITLES = { Social: 'Social', Talking: 'Communication', Thinking: 'Thinking', Movement: 'Movement' };
  const DOMAIN_ICONS = { Social: 'smile', Talking: 'chat', Thinking: 'idea', Movement: 'sit' };
  window.developmentJourneyOverview = developmentJourneyOverview = function (selected = null) {
    const now = devNow(), ref = DEV_STAGES[selected] ? Number(selected) : now, age = ref === 12 ? '1 year' : ref + ' months';
    const st = DEV_STAGES[ref], h = H();
    const devKeys = Object.keys(DEV_STAGES).map(Number), nowI = devKeys.indexOf(now);
    const pills = h.pills('Development by age', devKeys.map((k, i) => ({ label: monthsLabel(k), on: k === ref, now: live() && k === now, onclick: `openPage('development-stage:${k}')`, change: stageCanChange('Development', i, nowI) ? `hubChangeStage('Development',${i})` : '' })), 'Development');
    let b = h.hero({ eyebrow: `What you might see by ${age}`, title: st.title, lead: st.body });
    // One thing about how Maya sees the world at this age: a number you can take in at a glance.
    const EYES = { 2: ['8–12 in', 'smile', 'How far Maya sees clearly. About your face during a feed.'], 4: ['Colors', 'colors', 'Maya is getting better at telling colors and shades apart, and loves faces.'], 6: ['3D', 'cube', 'Maya’s eyes now work together to judge depth, which helps {o} reach.'], 9: ['Still there', 'hidden', 'Maya knows a hidden toy hasn’t vanished. That’s why peekaboo is so exciting.'], 12: ['Distance', 'toss', 'Maya can judge distance well enough to toss a toy with aim.'] }[ref];
    if (EYES) b += `<section class="hub-card hub-eyes"><span class="hub-card-head"><b>${F('Through Maya’s eyes')}</b></span><div class="hub-eyes-row"><span class="hub-eyes-ic">${h.art(EYES[1], 'Development')}</span><span class="hub-eyes-big">${F(EYES[0])}</span><span class="hub-eyes-cap">${F(EYES[2])}</span></div></section>`;
    // Four tiles, each with a line of what you might actually see, so the card is useful before anyone taps in.
    const domainTiles = Object.keys(DEV_DOMAINS).map(d => {
      const labels = DEVELOPMENT_DOMAINS[ref][d] || [], seen = labels.filter(l => journeyData().records.some(r => r.type === 'milestone' && r.skillKey === journeySkillKey(l))).length;
      return `<button class="hub-domain-tile" onclick="openPage('development-domain:${ref}:${d}')">${h.art(DOMAIN_ICONS[d], 'Development')}<b>${DOMAIN_TITLES[d]}</b><small>${(window.hubBabyify || (x => x))(F(st.summaries[d] || ''))}</small><span>${F(seen ? `${seen} of ${labels.length} seen` : `${labels.length} skill${labels.length === 1 ? '' : 's'}`)} ›</span></button>`;
    }).join('');
    b += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('What Maya might be doing')}</b></span><div class="hub-domain-tiles">${domainTiles}</div></section>` + h.note(developmentMonth() < ref ? `Most babies show these by ${age}. Some may be here already, and others are on the way.` : `Most babies show these by ${age}.`);
    if (ref === now || !live()) {
      const ideas = (playStageModel().primary || []).slice(0, 3), lo = playPhase().lo;
      const extra = (playStageModel().primary || []).length - 3 + (playStageModel().more || []).length;
      b += h.list('Try together', [...ideas.map(a => h.row({ icon: 'hand', cat: 'Development', title: (window.hubBabyify || (x => x))(a.title), sub: playLine(a), onclick: `openPage('play-activity:${lo}:${a.id}')` })), extra > 0 ? h.listMore(`See ${extra} more ideas`, `openPage('chg:Development:d:more:${lo}')`) : '']);
    }
    b += h.versus('Not yet, or time to ask?', ['Not yet', `Every baby gets there in their own time. These can show up any time before ${age}.`], ['Talk to your pediatrician', 'If Maya loses a skill, or something worries you. No need to wait for the checkup.']);
    const keys = Object.keys(DEV_STAGES).map(Number), nx = keys[keys.indexOf(ref) + 1];
    if (nx && live() && ref === now && nx - developmentMonth(actualMonth()) <= 1) b += h.next(`Coming up by ${monthsLabel(nx)}`, DEV_STAGES[nx].title, `openPage('development-stage:${nx}')`);
    b += h.more('What other parents ask', `openPage('chg:Development:d:faq:${ref}')`);
    b += `<a class="hub-more" href="${devSource(ref)}" target="_blank" rel="noopener"><span>${F('See CDC photos and videos')}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`;
    return frame('Development', `data-development-guide="${ref}"`, pills, b);
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
  const careFor = (days, m) => days < 21 ? 0 : m < 4 ? 1 : m < 7 ? 2 : 3;
  const careAge = () => (typeof hubAgeFor === 'function' ? hubAgeFor('care', actualMonth()) : developmentMonth(actualMonth()));
  const careStage = () => { const o = hubStageOverride('Care'); if (CARE[o]) return Number(o); return live() ? careFor((NOW - parse(profile.dob)) / 864e5, careAge()) : (month < 1 ? 0 : month < 4 ? 1 : month < 7 ? 2 : 3); };
  const bathSafety = () => H().versus('Bath safety', ['Always', 'Gather everything first and keep one hand on Maya the whole time.'], ['Never', 'Step away, even for a moment. Babies can slip under quietly in seconds.']);
  const careRow = (icon, title, sub, id) => H().row({ icon, cat: 'Daily rhythm', title, sub, onclick: id.startsWith('chg:') ? `openPage('${id}')` : `openPage('chg:Daily rhythm:d:${id}')` });
  function everydayCare(selected = null) {
    const now = careStage(), v = CARE[selected] ? selected : now, h = H(), C0 = CARE[v];
    const pills = h.pills('Everyday care by age', CARE.map((c, i) => ({ label: STAGE_TABLE['Daily rhythm'].stages[i].label, age: STAGE_TABLE['Daily rhythm'].stages[i].age, on: i === v, now: live() && i === now, onclick: `openPage('chg:Daily rhythm:s:${i}')`, change: stageCanChange('Daily rhythm', i, now) ? `hubChangeStage('Daily rhythm',${i})` : '' })), 'Daily rhythm');
    let b = '';
    if (v === 0) {
      b += h.hero({ eyebrow: 'Newborn', title: 'Caring for a brand-new baby', lead: 'For now it’s sponge baths, keeping the cord stump dry and lots of diapers. It feels like a lot, and it gets quicker fast.' });
      b += h.glanceCard('Maya’s care at a glance', [['Baths', '2–3 a week', 'Sponge baths for now'], ['Diapers', '8–12 a day', 'Change when wet or dirty']], `openPage('chg:Daily rhythm:d:sponge')`);
      b += h.list('In these first weeks', [careRow('towel', 'Give a sponge bath', 'A warm room, a washcloth and 5 minutes', 'sponge'), careRow('cord', 'Keep the cord stump clean and dry', 'Fold the diaper below it and let it air', 'cord'), careRow('nail', 'Trim tiny nails', 'Easiest while {s} {sleep|sleeps}', 'nails')]);
      b += h.list('Every day', [careRow('shirt', 'Dress Maya for the weather', 'One more layer than you’re wearing', 'dress'), careRow('diaper', 'Diapers and skin', 'Gentle care, and what to do about diaper rash', 'skin')]);
      b += h.versus('Normal, or time to call?', ['Normal', 'A little crust or a spot of blood near the cord, peeling skin and baby acne.'], ['Call your pediatrician', 'Redness spreading around the cord, pus or a bad smell, or a temperature of 100.4°F or higher.']);
    }
    if (v === 1) {
      b += h.hero({ eyebrow: '1–3 months', title: 'Tub baths and everyday skin care', lead: 'Once the cord has healed, Maya can have real baths. Two or three a week is plenty in the first year.' });
      b += h.glanceCard('Maya’s care at a glance', [['Baths', '2–3 a week', 'More if you like'], ['Water', 'About 100°F', 'Warm, not hot']], `openPage('chg:Daily rhythm:d:tub')`);
      b += h.list('What helps now', [careRow('bath', 'Give a tub bath', 'About 2 inches of warm water is plenty', 'tub'), careRow('drop', 'Care for dry skin and cradle cap', 'Mild soap, and a soft brush for the scalp', 'skin'), careRow('sun', 'Keep Maya out of direct sun', 'Shade and a hat when you’re outside', 'sun')]);
      b += bathSafety();
    }
    if (v === 2) {
      b += h.hero({ eyebrow: '4–6 months', title: 'Bath time becomes part of bedtime', lead: 'Many families use the bath to start winding down. Drool and chewing often start now too, long before the first tooth.' });
      b += h.glanceCard('Maya’s care at a glance', [['Baths', '2–3 a week', 'Often before bed'], ['Sun', 'Shade first', 'Under 6 months']], `openPage('chg:Daily rhythm:d:tub')`);
      b += h.list('What helps now', [careRow('moon', 'Make the bath part of bedtime', 'Bath, feed, book, bed', 'chg:Sleep:d:routine'), careRow('tooth', 'Look after drool and gums', 'Wipe gums and keep the chin dry', 'gums'), careRow('sun', 'Keep Maya in the shade', 'Hats and shade before sunscreen', 'sun')]);
      b += bathSafety();
    }
    if (v === 3) {
      b += h.hero({ eyebrow: '7–12 months', title: 'First teeth and splashier baths', lead: 'Once Maya can sit, bath time gets more fun. When the first tooth shows up, it’s time to start brushing.' });
      b += h.glanceCard('Maya’s care at a glance', [['Teeth', 'Brush twice a day', 'From the first tooth'], ['Toothpaste', 'A rice-grain smear', 'With fluoride']], `openPage('chg:Daily rhythm:d:teeth')`);
      b += h.list('What helps now', [careRow('tooth', 'Brush the first teeth', 'A soft brush and a tiny smear of toothpaste', 'teeth'), careRow('bath', 'Bath seats aren’t safety seats', 'Stay within arm’s reach, every bath', 'bathseat'), careRow('sun', 'Protect {p} skin in the sun', 'Shade first, then baby sunscreen', 'sun')]);
      b += bathSafety();
    }
    const nx = CARE[v + 1];
    if (nx) b += h.next(v === 0 ? 'Coming up after the first few weeks' : `Coming up at ${nx.rail.split('–')[0]} months`, ['', 'Tub baths and everyday skin care', 'Bath time becomes part of bedtime', 'First teeth and splashier baths'][v + 1], `openPage('chg:Daily rhythm:s:${v + 1}')`);
    return frame('Daily rhythm', `data-care-stage="${CARE[v].key}"`, pills, b);
  }
  window.everydayCare = everydayCare;

  function careDetail(id) {
    const h = H(), stageName = CARE[careStage()].rail, d = (ctx, title, lead, inner, artName) => h.detail('Daily rhythm', ctx, title, lead, inner, artName);
    if (id === 'sponge') return d('Newborn', 'Give a sponge bath', 'Until the cord stump falls off, a sponge bath keeps Maya clean without getting the stump wet.',
      h.steps(['Warm the room and lay Maya on a towel, with everything you need within reach.', 'Wash {p} face with a damp washcloth and plain water, then the rest of {o}, uncovering one part at a time.', 'Finish with the diaper area, then pat {o} dry, paying attention to skin folds.'])
      + h.video('Watch a newborn bath, step by step', 'WebMD', 'https://www.webmd.com/parenting/baby/video/bathing-newborns') + h.tip('How often?', 'Two or three times a week is plenty. In between, wipe {p} face, neck and diaper area.'), 'towel');
    if (id === 'cord') return d('Newborn', 'Keep the cord stump clean and dry', 'The stump usually dries up and falls off on its own in 1–3 weeks.',
      h.steps(['Fold the top of the diaper down so the stump stays in the air.', 'If it gets dirty, clean it gently with plain water and pat it dry.', 'Let it fall off by itself, even if it’s hanging by a thread.']) + h.tip('A little crust is normal', 'A spot of blood when it comes off is normal too. Call if the skin around it gets red, swollen or smelly.') + h.tip('If your baby was circumcised', 'Put a dab of petroleum jelly on the tip at each diaper change until it heals, usually in a week to 10 days. Call if there’s bleeding, swelling or pus.'), 'cord');
    if (id === 'nails') return d(stageName, 'Trim tiny nails', 'Baby nails grow fast and are sharp enough to scratch {p} face.',
      h.steps(['Wait until Maya is asleep or very relaxed.', 'Use baby nail clippers or a soft emery board, pressing the fingertip pad away from the nail.', 'File any rough edges. A nick happens to everyone; press gently with a clean cloth.']), 'nail');
    if (id === 'tub') return d(stageName, 'Give a tub bath', 'Once the cord has healed, Maya’s ready for a baby tub.',
      (window.hubFigure ? hubFigure('tub', 'Daily rhythm', 'A baby lying back in a baby tub with about 2 inches of warm water, a hand supporting the head and neck.') : '') + h.steps(['Gather everything first: towel, washcloth, mild soap and a clean diaper.', 'Fill the tub with about 2 inches of warm water. Test it with your wrist; it should feel warm, not hot.', 'Support {p} head and neck with one arm, and wash from top to bottom with your other hand.', 'Lift {o} out onto the towel and wrap {o} up right away.'])
      + h.video('Watch a baby bath, step by step', 'WebMD', 'https://www.webmd.com/parenting/baby/video/bathing-newborns') + h.tip('Water heater', 'Set it below 120°F so tap water can’t scald.'), 'bath');
    if (id === 'skin') return d(stageName, 'Care for dry skin, cradle cap and diaper rash', 'Most babies don’t need lotion. Less is usually more.',
      h.steps(['Use a mild, fragrance-free soap, and only on the parts that need it.', 'Pat dry instead of rubbing, especially in skin folds. A little fragrance-free moisturizer helps if skin looks dry.', 'For crusty patches on the scalp, rub in a little baby oil, then brush gently with a soft brush before the bath.']) + h.tip('Diaper rash?', 'Change diapers often, let the skin air out when you can, and use a thick layer of zinc oxide cream. Call if it blisters or isn’t better in a few days.') + h.tip('Red, itchy patches?', 'That could be eczema. Mention it to your pediatrician, who can suggest what helps.'), 'drop');
    if (id === 'dress') return d(stageName, 'Dress Maya for the weather', 'Babies can’t tell you they’re too hot or cold, so a simple rule helps.',
      h.steps(['Dress Maya in one more layer than you’re comfortable in.', 'Feel the back of {p} neck. Sweaty means too warm; cool means add a layer.', 'Skip hats and heavy blankets for sleep. A sleep sack is enough.']) + h.tip('In the car seat', 'Take off puffy coats first. Buckle {o} in, then put a blanket over the straps.'), 'towel');
    if (id === 'gums') return d(stageName, 'Look after drool and gums', 'Drooling and chewing on everything are normal now. Teeth can take a while to follow.',
      h.steps(['Wipe {p} gums with a clean, damp cloth once a day.', 'Keep a soft bib on and pat the chin dry to avoid a drool rash.', 'Offer a cool, firm teething ring if {s} {seem|seems} sore.']) + h.tip('Skip these', 'Teething necklaces, numbing gels and tablets. Ask your pediatrician about pain relief if needed.'), 'tooth');
    if (id === 'teeth') return d(stageName, 'Brush the first teeth', 'As soon as the first tooth appears, brushing helps keep it healthy.',
      h.steps(['Use a soft baby toothbrush and a smear of fluoride toothpaste the size of a grain of rice.', 'Brush gently twice a day, including before bed.', 'No need to rinse. A little toothpaste left behind is fine.']) + h.tip('First dental visit', 'Plan one by the first birthday, or within 6 months of the first tooth.'), 'tooth');
    if (id === 'bathseat') return d(stageName, 'Bath seats aren’t safety seats', 'A bath seat can help Maya sit up, but it won’t keep {o} safe if you step away.',
      h.steps(['Keep the water shallow, about as high as {p} waist when sitting.', 'Stay within arm’s reach for the whole bath.', 'If you need to leave, wrap Maya in a towel and take {o} with you.']), 'bath');
    if (id === 'sun') return careStage() < 3 ? d(stageName, 'Keep Maya in the shade', 'Young babies’ skin burns easily, so shade comes first.',
      h.steps(['Keep {o} in the shade, especially in the middle of the day.', 'Dress {o} in light, long sleeves and a wide-brimmed hat.', 'If you can’t find shade, a little sunscreen on small areas like the face is OK.']) + h.tip('From 6 months', 'Broad-spectrum sunscreen of SPF 30 or more becomes part of the routine.'), 'sun')
      : d(stageName, 'Protect Maya’s skin in the sun', 'Shade still comes first, and sunscreen joins in now.',
      h.steps(['Keep {o} in the shade and dress {o} in light clothes and a wide-brimmed hat.', 'Use a broad-spectrum sunscreen of SPF 30 or more on skin you can’t cover.', 'Reapply every 2 hours, and after water play.']), 'sun');
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
  window.yearIllustration = yearIllustration = (t, i = 0) => t === 'Daily rhythm' && typeof hubArt === 'function' ? hubArt(['bath', 'towel', 'tooth', 'drop'][Math.abs(i) % 4], 'Daily rhythm').replace('viewBox="0 0 24 24"', 'viewBox="-7 -7 38 38"').replace('stroke-width="1.5"', 'stroke-width="1.3"').replace('aria-hidden="true">', `aria-hidden="true"><circle cx="12" cy="12" r="18" fill="${(YEAR_PALETTES['Daily rhythm'] || {}).pale || '#eef8f5'}" stroke="none"/>`) : baseArt(t, i);
  const baseYear = categoryYear;
  window.categoryYear = categoryYear = t => t === 'Daily rhythm' ? everydayCare() : baseYear(t);
  const baseHub = yearHub;
  window.yearHub = yearHub = () => baseHub().replace('First responses → shared games', 'Baths and cord care → first teeth');

  /* ---------- Safety: "What do I need to do before Maya moves?" ---------- */
  const SAFETY_HEAD = { setup: ['Set up a few things once', 'Check the car seat, hot water, smoke alarms and any pool access.'], reaching: ['Get ready for reaching and rolling', 'Rolling puts the play mat and changing spot within reach. A quick check covers it.'], rolling: ['Babyproof before Maya moves', 'Most babies start moving at 6–10 months. Getting ahead of it saves a scramble.'], moving: ['Keep going, one room at a time', 'Maya can reach much more now. Work through the rooms {s} {use|uses} most.'], pulling: ['Check what Maya can reach standing', 'Standing brings windows, cords and furniture into reach.'] };
  window.safetyMovementGuide = safetyMovementGuide = function (selected = null) {
    const keys = SAFETY_MOVEMENT_STAGES.map(p => p.key), now = live() ? safetyStageNow() : safetyMovementStage();
    const key = keys.includes(selected) ? selected : now, owner = safetyOwnerForStage(key), guide = safetyOwnedGuides()[owner], h = H();
    const browse = live() && key !== now, items = safetyHomeItems(), pending = safetyPendingIds(guide.ids), done = guide.ids.length - pending.length;
    // Lead with the checks this stage's headline is about (standing → windows and cords, for example).
    const FIRST = { rolling: ['gates', 'storage', 'outlets'], moving: ['doors', 'outlets', 'storage'], pulling: ['anchor', 'windows', 'cords'] }[key] || [];
    const rank = id => { const i = FIRST.indexOf(id); return i < 0 ? 99 : i; };
    const nowI = keys.indexOf(now), ST = STAGE_TABLE.Safety.stages;
    const pills = h.pills('Safety by movement', SAFETY_MOVEMENT_STAGES.map((p, i) => ({ label: ST[i].label, age: ST[i].age, on: p.key === key, now: live() && p.key === now, onclick: `openPage('safety-stage:${p.key}')`, change: stageCanChange('Safety', i, nowI) ? `hubChangeStage('Safety',${i})` : '' })), 'Safety');
    let b = h.hero({ eyebrow: SAFETY_MOVEMENT_STAGES.find(p => p.key === key).rail, title: SAFETY_HEAD[key][0], lead: SAFETY_HEAD[key][1], meter: { label: owner === 'setup' ? 'Setup checks' : owner === 'reach' ? 'Reaching and rolling checks' : 'Babyproofing checks', n: done, of: guide.ids.length }, button: { label: pending.length ? (done ? 'Keep going with the checklist' : 'Open the checklist') : 'Review the checklist', onclick: `openSafetyChecklist('${owner}',${browse})` } });
    b += pending.length
      ? h.list(done ? 'Next up' : 'Start with these', [...pending].sort((x, y) => rank(x) - rank(y)).slice(0, 3).map(id => h.row({ icon: 'shield', cat: 'Safety', title: (items[id] || {}).title || id, sub: shortLine((items[id] || {}).body), onclick: browse ? `openSafetyChecklist('${owner}',true)` : `openHomeSafetyCheck('${owner}','${id}')` })))
      : h.note(`You’ve done every check for this stage. Nice work.`);
    if (key === 'rolling' || key === 'reaching') b += h.list('', [h.row({ icon: 'moon', cat: 'Safety', title: 'Rolling changes the sleep space too', sub: 'Stop swaddling at the first attempt to roll', onclick: "openSection('Sleep','sleep-rolling')" })]);
    b += h.versus('If something goes wrong', ['Poison Help', 'Call 1-800-222-1222 if Maya swallows something that could be harmful.'], ['Call 911', 'If {s} can’t breathe or won’t wake. A swallowed battery or magnet means the ER right away.']);
    const nx = keys[keys.indexOf(key) + 1];
    if (nx && !browse) b += h.next('Coming up', SAFETY_MOVEMENT_STAGES.find(p => p.key === nx).rail, `openPage('safety-stage:${nx}')`);
    b += h.more('Get help with babyproofing', `openSafetyChecklist('${owner}',${browse})`);
    return frame('Safety', `data-safety-stage="${key}" data-safety-owner="${owner}"`, pills, b);
  };

  /* ---------- Health: "What happens at this checkup?" ---------- */
  const EXPECT = { 0: 'Feeding, jaundice and newborn test results', 1: 'Growth, feeding comfort and early responses', 2: 'Growth, responses to you and milk feeding', 4: 'Movement, interaction, feeding and sleep', 6: 'Growth, new skills, first foods and teeth', 9: 'The development questionnaire, feeding and growth', 12: 'Growth, blood tests, teeth and feeding changes' };
  window.healthJourneyOverview = healthJourneyOverview = function (selected = null) {
    const focus = healthJourneyFocus(), age = WELL_VISITS.includes(selected) ? selected : focus, h = H();
    const record = healthRecord(age), done = record?.status === 'attended', planned = record?.status === 'planned';
    const label = healthJourneyLabel(age), the = 'the ' + label.charAt(0).toLowerCase() + label.slice(1);
    const pills = h.pills('Checkups', WELL_VISITS.map(a => ({ label: a === 0 ? 'First week' : a + (a === 1 ? ' month' : ' months'), on: a === age, now: live() && a === focus, onclick: `openPage('health-visit:${a}')` })), 'Health');
    const eyebrow = done ? `Done · ${journeyDateLabel(record.date)}` : planned ? `Saved for ${journeyDateLabel(record.date)}` : age === 0 ? 'In the first week' : `Usually at ${age} month${age === 1 ? '' : 's'}`;
    const title = done ? `You’ve been to ${the}` : `What happens at ${the}`;
    let b = h.hero({ eyebrow, title, lead: conceptHealthSummary(age), button: done ? { label: 'Add notes from the visit', onclick: `openHealthDetail(${age},'notes')` } : { label: planned ? 'Change the date' : 'Save the date', onclick: `openPage('visit-form:${age}')` } });
    if (!done) b += `<div class="hub-browse"><button class="hub-link" onclick="openPage('visit-form:${age}')">${F(planned && record.date < iso(NOW) ? 'Been already? Mark it as done' : 'Already had this visit? Mark it as done')} ›</button></div>`;
    if (live() && age !== focus) b += back('Back to your next checkup', `openPage('health-visit:${focus}')`);
    b += h.list('Before you go', [
      h.row({ icon: 'clock', cat: 'Health', title: 'What to expect', sub: EXPECT[age], onclick: `openHealthDetail(${age},'expect')` }),
      `<span id="health-vaccines"></span>` + h.row({ icon: 'shield', cat: 'Health', title: 'Vaccines', sub: age === 0 ? 'Hepatitis B and RSV protection to check' : age === 1 ? 'Doses that may be due this month' : age === 9 ? 'Catch-up doses and seasonal protection' : 'Expected doses and seasonal protection', onclick: `openHealthDetail(${age},'vaccines')` }),
      h.row({ icon: 'hand', cat: 'Health', title: 'Questions to ask', sub: 'A few ideas, plus space for your own', onclick: `openHealthDetail(${age},'questions')` })
    ]);
    b += h.list('Between checkups', [
      h.row({ icon: 'steth', cat: 'Health', title: `When Maya seems sick`, sub: 'Fevers, medicine and when to call', onclick: "openPage('chg:Health:d:sick')" }),
      h.row({ icon: 'heart', cat: 'Health', title: 'How are you doing?', sub: 'Your health matters too', onclick: "openPage('chg:Health:d:you')" })
    ]);
    b += h.versus('When to call', ['Call your pediatrician', actualMonth() < 3 ? 'Under 3 months, a temperature of 100.4°F or higher means calling right away.' : 'Fever with fewer wet diapers, or anything that worries you.'], ['Call 911', 'Trouble breathing, blue lips, or {s} won’t wake up.']);
    const nx = WELL_VISITS[WELL_VISITS.indexOf(age) + 1];
    if (nx != null) b += h.next(`Next checkup`, healthJourneyLabel(nx), `openPage('health-visit:${nx}')`);
    b += h.more('Your appointment notes', `openHealthDetail(${age},'notes')`);
    return frame('Health', `data-health-journey="${age}"`, pills, b);
  };

  window.hubSeen = function (key) {
    const rec = journeyData().records.find(r => r.type === 'milestone' && r.skillKey === key);
    if (!rec && typeof saveJourneySkill === 'function') saveJourneySkill(key, { date: iso(NOW) });
    const y = scrollY; render(); scrollTo(0, y);
  };
  window.developmentDomainPage = developmentDomainPage = function (ref, domain) {
    const meta = DEV_DOMAINS[domain], labels = DEVELOPMENT_DOMAINS[ref]?.[domain];
    if (!meta || !labels) return developmentJourneyOverview(ref);
    const h = H(), age = ref === 12 ? '1 year' : ref + ' months';
    // Each skill once: what it looks like, and a tap when you've seen it. No separate page per skill.
    const rows = labels.map(l => { const key = journeySkillKey(l), rec = journeyData().records.find(r => r.type === 'milestone' && r.skillKey === key);
      return `<div class="hub-tick is-habit"><span class="hub-tick-art">${h.art(DOMAIN_ICONS[domain] || 'smile', 'Development')}</span><span class="hub-row-copy"><b>${clearMilestone(l)}</b><small>${esc(DEV_EXAMPLES[l] || '')}</small></span>${rec ? `<span class="hub-chip is-done">${F('Seen')} ✓</span>` : `<button class="hub-seen" onclick="hubSeen('${key}')">${F('Seen it')}</button>`}</div>`; }).join('');
    const skill = journeySkills().find(s => labels.includes(s.label) && typeof devSkillActivity === 'function' && devSkillActivity(s)), act = skill && devSkillActivity(skill);
    const tryRow = act ? h.list('Try this together', [h.row({ icon: 'hand', cat: 'Development', title: act.title, sub: playLine(act), onclick: `openDevelopmentActivity('${skill.key}')` })]) : '';
    return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head"><p class="hub-context">${esc(`By ${age}`)}</p><h1>${esc(meta.title)}</h1><p class="hub-lead">${esc(DEV_STAGES[ref].summaries[domain])}</p></div><div class="hub-ticks">${rows}</div>${h.note(`Most babies show these by ${age}. Tap “Seen it” to save the moment to Maya’s timeline.`)}${tryRow}${h.video('Watch each of these skills in action', 'CDC', devSource(ref), 'Photos and videos')}</div>`;
  };

  /* ---------- small detail screens for these categories ---------- */
  function detailFrame(cat, context, title, lead, inner) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="${cat}" style="${yearTheme(cat)}">${detailPageTop(cat)}<div class="hub-detail-head"><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }
  function healthDetail(id) {
    const h = H(), under3 = actualMonth() < 3;
    if (id === 'you') return detailFrame('Health', 'Looking after you', 'How are you doing?', 'Caring for a new baby is a lot. Your health matters too, and asking for help is part of looking after Maya.',
      h.versus('Common, or time to get help?', ['Common in the first two weeks', 'Feeling weepy, anxious or overwhelmed, with good moments in between. It usually eases on its own.'], ['Get help', 'Low mood or worry that lasts more than two weeks, can’t sleep even when you could, or feeling you can’t cope.'])
      + `<section class="hub-card hub-callout"><b>${F('Talk to someone today')}</b><p>${F('Call or text the National Maternal Mental Health Hotline at 1-833-852-6262. It’s free, confidential and open any time, for moms, partners and new parents.')}</p><a class="hub-button" href="tel:18338526262">${F('Call 1-833-852-6262')}</a></section>`
      + h.steps(['Tell your doctor or Maya’s pediatrician how you’re feeling. They ask because it’s common and treatable.', 'Take the help people offer, and name something specific, like a meal or a nap.', 'Go to your own postpartum checkup, even if you feel fine.'])
      + h.tip('If you’re thinking about harming yourself or Maya', 'Call or text 988, or call 911, right now.')
      + h.note('Partners can feel this way too.'));
    if (id === 'sick') return detailFrame('Health', 'Between checkups', 'When Maya seems sick', 'Most baby illnesses are mild, but young babies can get sick quickly. Here’s what to watch for.',
      h.versus('Fever', ['3 months and up', 'Call if a fever lasts more than a day, or comes with fewer wet diapers, a rash or unusual sleepiness.'], ['Under 3 months', 'A temperature of 100.4°F or higher: call your pediatrician right away, day or night.'])
      + h.list('Good to know', [
        h.row({ icon: 'clock', cat: 'Health', title: 'Take a rectal temperature', sub: 'It’s the most accurate way for babies. Forehead and ear readings are less reliable.', onclick: '' }).replace('<button class="hub-row"', '<div class="hub-row is-static"').replace(/<\/button>$/, '</div>').replace('<span class="hub-chev" aria-hidden="true">›</span>', ''),
        h.row({ icon: 'drop', cat: 'Health', title: 'Watch for dehydration', sub: 'Far fewer wet diapers, a dry mouth, no tears or a sunken soft spot.', onclick: '' }).replace('<button class="hub-row"', '<div class="hub-row is-static"').replace(/<\/button>$/, '</div>').replace('<span class="hub-chev" aria-hidden="true">›</span>', ''),
        h.row({ icon: 'bottle', cat: 'Health', title: 'Ask before giving medicine', sub: 'Nothing under 3 months without your pediatrician. Ibuprofen only from 6 months. Doses go by weight.', onclick: '' }).replace('<button class="hub-row"', '<div class="hub-row is-static"').replace(/<\/button>$/, '</div>').replace('<span class="hub-chev" aria-hidden="true">›</span>', '')
      ])
      + `<section class="hub-card hub-callout is-urgent"><b>${F('Call 911 if Maya')}</b><p>${F('Struggles to breathe or turns blue, won’t wake or is floppy, or has a seizure.')}</p></section>`
      + h.tip('Skip cough and cold medicines', 'They aren’t safe for babies. Saline drops and a bulb syringe help with a stuffy nose.')
      + h.video('When to call about a fever', 'HealthyChildren · AAP', 'https://www.healthychildren.org/English/health-issues/conditions/fever/pages/When-to-Call-the-Pediatrician.aspx', 'Guide'));
    return null;
  }
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if (cat === 'Development' && screen === 'd' && a === 'faq') { const ref = DEV_STAGES[b] ? Number(b) : devRef(); return detailFrame('Development', DEV_STAGES[ref].title, 'What other parents ask', '', devCommonQuestions(ref).replace('<h2>Common questions</h2>', '').replace('class="common-questions"', 'class="common-questions hub-faq"')); }
    if (cat === 'Health' && screen === 'd') { const pg = healthDetail(a); if (pg) return pg; }
    if (cat === 'Daily rhythm' && screen === 's') return everydayCare(Number(a));
    if (cat === 'Daily rhythm' && screen === 'd' && a !== 'more') return careDetail(a);
    if ((cat === 'Daily rhythm' || cat === 'Development') && screen === 'd' && a === 'more') {
      const { phase, primary, more } = playStageModel(Number(b)), h = H();
      const all = [...primary.slice(3), ...more];
      return detailFrame('Development', phase.title, 'More ideas to try', 'Pick whatever suits the moment. There’s no need to do them all.', h.list('', all.map(x => h.row({ icon: 'hand', cat: 'Development', title: (window.hubBabyify || (y => y))(x.title), sub: playLine(x), onclick: `openPage('play-activity:${phase.lo}:${x.id}')` }))));
    }
    return baseRoute(p);
  };
})();
