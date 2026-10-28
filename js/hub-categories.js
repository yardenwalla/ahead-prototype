/* Ahead · Development, Play, Safety and Health as summary screens.
   Same pattern as Sleep and Feeding: stage pills, a hero that answers the parent's question,
   at most 3 rows, a must-know card, coming up, and details one tap away (the existing focused pages). */
(function () {
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
  const SAFETY_SUB = { gates: 'Screw-mounted at the top, either kind at the bottom', windows: 'Openings no wider than 4 inches', storage: 'Up high, with a child lock on the cabinet', small: 'Coins, batteries and bottle caps are the usual finds' };
  const shortLine = t => { const f = firstSentence(t); const cut = f.length > 72 && f.includes(',') ? f.slice(0, f.indexOf(',')) : f; return cut.split(/\s+/).length < 3 ? f : cut; };
  // One thing to try, phrased as an action: the short prompt if there is one, otherwise the first line of how to do it.
  const playLine = a => (window.hubBabyify || (x => x))(playLineRaw(a));
  const playLineRaw = a => { const s = typeof conceptPlaySuggestion === 'function' ? conceptPlaySuggestion(a) : ''; return s && !s.startsWith(a.why || '\u0000') ? firstSentence(s) : firstSentence(a.how || a.why); };

  /* ---------- Development: "What might I see, and how can I help?" ---------- */
  const DOMAIN_TITLES = { Social: 'Social', Talking: 'Communication', Thinking: 'Thinking', Movement: 'Movement' };
  const DOMAIN_ICONS = { Social: 'smile', Talking: 'chat', Thinking: 'idea', Movement: 'sit' };
  window.developmentJourneyOverview = developmentJourneyOverview = function (selected = null) {
    const now = devNow(), ref = DEV_STAGES[selected] ? Number(selected) : now, age = ref + ' months';
    const st = DEV_STAGES[ref], h = H();
    // Born early: say which age Development follows, and switch it in one tap.
    const ageNote = live() && profile.early && profile.due ? (() => { const adj = developmentMonth(actualMonth()) !== actualMonth(); return `<p class="hub-agebasis">${F(adj ? `Following Maya’s adjusted age (${monthsLabel(developmentMonth(actualMonth()))}).` : `Following Maya’s birthday age (${monthsLabel(actualMonth())}).`)} <button onclick="hubSetAgeMode('dev','${adj ? 'birthday' : 'adjusted'}')">${adj ? 'Use birthday age' : 'Use adjusted age'}</button></p>`; })() : '';
    const devKeys = Object.keys(DEV_STAGES).map(Number), nowI = devKeys.indexOf(now);
    const pills = h.pills('Development by age', devKeys.map((k, i) => ({ label: STAGE_TABLE.Development.stages[i].label, age: STAGE_TABLE.Development.stages[i].age, on: k === ref, now: live() && k === now, onclick: `openPage('development-stage:${k}')`, change: stageCanChange('Development', i, nowI) ? `hubChangeStage('Development',${i})` : '' })), 'Development');
    let b = h.hero({ eyebrow: `What to look for by ${age}`, title: st.title, lead: st.body });
    // One thing about how Maya sees the world at this age: a number you can take in at a glance.
    const EYES = { 2: ['8–12 in', 'smile', 'How far Maya sees clearly. About your face during a feed.'], 4: ['Colors', 'colors', 'Maya is getting better at telling colors and shades apart, and loves faces.'], 6: ['3D', 'cube', 'Maya’s eyes now work together to judge depth, which helps {o} reach.'], 9: ['Still there', 'hidden', 'Maya knows a hidden toy hasn’t vanished. That’s why peekaboo is so exciting.'], 12: ['Distance', 'toss', 'Maya can judge distance well enough to toss a toy with aim.'] }[ref];
    // Browsing another stage: say what babies do at that age, not what this baby does.
    const other = live() && ref !== now;
    const EYES_ANY = { 2: 'How far babies see clearly by 2 months. About a parent’s face during a feed.', 4: 'By 4 months, babies get better at telling colors apart, and love faces.', 6: 'By 6 months, babies’ eyes work together to judge depth, which helps them reach.', 9: 'By 9 months, babies know a hidden toy hasn’t vanished. That’s why peekaboo is so exciting.', 12: 'By 12 months, babies can judge distance well enough to toss a toy with aim.' };
    if (EYES && other) EYES[2] = EYES_ANY[ref];
    if (EYES) b += `<section class="hub-card hub-eyes"><span class="hub-card-head"><b>${F(other ? `Through a baby’s eyes, by ${age}` : 'Through Maya’s eyes')}</b></span><div class="hub-eyes-row"><span class="hub-eyes-ic">${h.art(EYES[1], 'Development')}</span><span class="hub-eyes-big">${F(EYES[0])}</span><span class="hub-eyes-cap">${F(EYES[2])}</span></div></section>`;
    // Four tiles, each with a line of what you might actually see, so the card is useful before anyone taps in.
    const domainTiles = Object.keys(DEV_DOMAINS).map(d => {
      const labels = DEVELOPMENT_DOMAINS[ref][d] || [], seen = labels.filter(l => journeyData().records.some(r => r.type === 'milestone' && r.skillKey === journeySkillKey(l))).length;
      return `<button class="hub-domain-tile" onclick="openPage('development-domain:${ref}:${d}')">${h.art(DOMAIN_ICONS[d], 'Development')}<b>${DOMAIN_TITLES[d]}</b><small>${(window.hubBabyify || (x => x))(F(d === 'Movement' && live() && ref === now && (answers.pullUp === 'Yes' || answers.crawl === 'Yes') ? `Maya is already ${answers.pullUp === 'Yes' ? 'pulling up' : 'crawling'}, so {s’s} ahead on movement. These are the skills that come first.` : (st.summaries[d] || '')))}</small><span>${F(seen ? `${seen} of ${labels.length} seen` : `${labels.length} skill${labels.length === 1 ? '' : 's'}`)} ›</span></button>`;
    }).join('');
    b += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('What Maya might be doing')}</b></span><div class="hub-domain-tiles">${domainTiles}</div></section>` ;
    if (ref === now || !live()) {
      const ideas = (playStageModel().primary || []).slice(0, 3), lo = playPhase().lo;
      const extra = (playStageModel().primary || []).length - 3 + (playStageModel().more || []).length;
      const total = (playStageModel().primary || []).length + (playStageModel().more || []).length;
      b += h.list('', [h.row({ icon: 'hand', cat: 'Development', title: 'Ideas to try together', sub: 'Simple games that fit into your day', chipText: `${total} ideas`, onclick: `openPage('chg:Development:d:more:${lo}')` })]);
    }
    const reached = live() && developmentMonth(actualMonth()) >= ref;
    b += h.versus('Not yet, or time to ask?', ['Not yet', reached && ref < now ? `Most babies show these by ${age}. If Maya isn’t doing some of them yet, it’s worth calling your pediatrician rather than waiting for the checkup.` : reached ? `Most babies show these by ${age}. If Maya isn’t doing some of them yet, mention it at {p} next checkup. It’s a common question.` : `Every baby gets there in their own time. These can show up any time before ${age}.`], ['Talk to your pediatrician', 'Call if Maya loses a skill {s} had, or if something worries you. You don’t need to wait for the checkup.']);
    const keys = Object.keys(DEV_STAGES).map(Number), nx = keys[keys.indexOf(ref) + 1];
    if (nx && live() && ref === now && nx - developmentMonth(actualMonth()) <= 1) b += h.next(`Coming up by ${monthsLabel(nx)}`, DEV_STAGES[nx].title, `openPage('development-stage:${nx}')`);
    b += h.more(other ? 'Common questions at this stage' : 'What other parents ask', `openPage('chg:Development:d:faq:${ref}')`);
    b += `<a class="hub-more" href="${devSource(ref)}" target="_blank" rel="noopener"><span>${F('See photos and videos of each skill')}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`;
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
      b += h.hero({ eyebrow: 'Newborn', title: 'Caring for a brand-new baby', lead: 'For now it’s sponge baths, keeping the cord stump dry and lots of diapers. It feels like a lot, and it gets quicker fast.' });
      b += h.glanceCard(v === now ? 'Maya’s care at a glance' : 'At this stage', [['Baths', '2–3 a week', 'Sponge baths for now'], ['Diapers', '8–12 a day', 'Change when wet or dirty']], `openPage('chg:Daily rhythm:d:sponge')`);
      b += h.list('In these first weeks', [careRow('towel', 'Give a sponge bath', 'A warm room, a washcloth and 5 minutes', 'sponge'), careRow('cord', 'Keep the cord stump clean and dry', 'Fold the diaper below it and let it air', 'cord'), careRow('nail', 'Trim tiny nails', 'Easiest while {s} {sleep|sleeps}', 'nails')]);
      b += h.list('Every day', [careRow('shirt', 'Dress Maya for the weather', 'One more layer than you’re wearing', 'dress'), careRow('diaper', 'Diapers and skin', 'Gentle care, and what to do about diaper rash', 'skin')]);
      b += h.versus('Normal, or time to call?', ['Normal', 'A little crust or a spot of blood near the cord, peeling skin and baby acne.'], ['Call your pediatrician', 'Redness spreading around the cord, pus or a bad smell, or a temperature of 100.4°F or higher.']);
    }
    if (v === 1) {
      b += h.hero({ eyebrow: '1–3 months', title: 'Tub baths and everyday skin care', lead: 'Once the cord has healed, Maya can have real baths. Two or three a week is plenty in the first year.' });
      b += h.glanceCard(v === now ? 'Maya’s care at a glance' : 'At this stage', [['Baths', '2–3 a week', 'More if you like'], ['Water', 'About 100°F', 'Warm, not hot']], `openPage('chg:Daily rhythm:d:tub')`);
      b += h.list('What helps now', [careRow('bath', 'Give a tub bath', 'About 2 inches of warm water is plenty', 'tub'), careRow('drop', 'Care for dry skin and cradle cap', 'Mild soap, and a soft brush for the scalp', 'skin'), careRow('sun', 'Keep Maya out of direct sun', 'Shade and a hat when you’re outside', 'sun')]);
      b += bathSafety();
    }
    if (v === 2) {
      b += h.hero({ eyebrow: '4–6 months', title: 'Bath time becomes part of bedtime', lead: 'Many families use the bath to start winding down. Drool and chewing often start now too, long before the first tooth.' });
      b += h.glanceCard(v === now ? 'Maya’s care at a glance' : 'At this stage', [['Baths', '2–3 a week', 'Often before bed'], actualMonth() >= 6 ? ['Sun', 'Shade, then sunscreen', 'From 6 months'] : ['Sun', 'Shade first', 'Under 6 months']], `openPage('chg:Daily rhythm:d:tub')`);
      b += h.list('What helps now', [careRow('moon', 'Make the bath part of bedtime', 'Bath, feed, book, bed', 'chg:Sleep:d:routine'), careRow('tooth', 'Teething, drool and gums', 'Wipe gums and keep the chin dry', 'gums'), careRow('sun', 'Keep Maya in the shade', 'Hats and shade before sunscreen', 'sun')]);
      b += bathSafety();
    }
    if (v === 3) {
      b += h.hero({ eyebrow: '7–12 months', title: 'First teeth and splashier baths', lead: 'Once Maya can sit, bath time gets more fun. When the first tooth shows up, it’s time to start brushing.' });
      b += h.glanceCard(v === now ? 'Maya’s care at a glance' : 'At this stage', [['Teeth', 'Brush twice a day', 'From the first tooth'], ['Toothpaste', 'A rice-grain smear', 'With fluoride']], `openPage('chg:Daily rhythm:d:teeth')`);
      const hasTooth = live() && (answers.hasTooth === 'Yes' || journeyData().records.some(r => r.type === 'milestone' && /tooth|teeth/i.test(r.title || '')));
      b += h.list('What helps now', [hasTooth || !live() ? careRow('tooth', 'Brush the first teeth', 'A soft brush and a tiny smear of toothpaste', 'teeth') : careRow('tooth', 'Teething, drool and gums', 'Drool, chewing and sore gums', 'gums'), careRow('bath', 'Bath seats aren’t safety seats', 'Stay within arm’s reach, every bath', 'bathseat'), careRow('sun', 'Protect {p} skin in the sun', 'Shade first, then baby sunscreen', 'sun'), (!live() || hubAgeFor('care', actualMonth()) >= 9) ? careRow('stand', 'Cruising and first steps', 'Bare feet indoors, and when shoes matter', 'steps') : null]);
      b += bathSafety();
    }
    const nx = CARE[v + 1];
    // The last stage still looks ahead: what changes after the first birthday.
    if (!nx) b += h.next('After the first birthday, usually 12–18 months', 'Toddler baths and first shoes', `openPage('chg:Daily rhythm:d:after1')`);
    if (nx) b += h.next(v === 0 ? 'Coming up after the first few weeks' : `Coming up at ${nx.rail.split('–')[0]} months`, ['', 'Tub baths and everyday skin care', 'Bath time becomes part of bedtime', 'First teeth and splashier baths'][v + 1], `openPage('chg:Daily rhythm:s:${v + 1}')`);
    return frame('Daily rhythm', `data-care-stage="${CARE[v].key}"`, pills, b); // read-only timeline: follows age, tap any stage to look back or ahead
  }
  window.everydayCare = everydayCare;

  function careDetail(id) {
    const h = H(), stageName = 'Everyday care', d = (ctx, title, lead, inner, artName) => h.detail('Daily rhythm', ctx, title, lead, inner, artName);
    if (id === 'sponge') return d('Newborn', 'Give a sponge bath', 'Until the cord stump falls off, a sponge bath keeps Maya clean without getting the stump wet.',
      h.steps(['Warm the room and lay Maya on a towel, with everything you need within reach.', 'Wash {p} face with a damp washcloth and plain water, then the rest of {o}, uncovering one part at a time.', 'Finish with the diaper area, then pat {o} dry, paying attention to skin folds.'])
      + h.video('Bathing your baby, step by step', 'KidsHealth', 'https://kidshealth.org/en/parents/bathing-baby.html', 'Guide') + h.tip('How often?', 'Two or three times a week is plenty. In between, wipe {p} face, neck and diaper area.'), 'towel');
    if (id === 'cord') return d('Newborn', 'Keep the cord stump clean and dry', 'The stump usually dries up and falls off on its own in 1–3 weeks.',
      h.steps(['Fold the top of the diaper down so the stump stays in the air.', 'If it gets dirty, clean it gently with plain water and pat it dry.', 'Let it fall off by itself, even if it’s hanging by a thread.']) + h.tip('A little crust is normal', 'A spot of blood when it comes off is normal too. Call if the skin around it gets red, swollen or smelly.') + ((typeof babyPronouns === 'function' && babyPronouns().s === 'she') ? '' : h.tip('If your baby was circumcised', 'Put a dab of petroleum jelly on the tip at each diaper change until it heals, usually in a week to 10 days. Call if there’s bleeding, swelling or pus.')), 'cord');
    if (id === 'nails') return d(stageName, 'Trim tiny nails', 'Those tiny nails grow fast and are sharp enough to scratch {p} face.',
      h.steps(['Wait until Maya is asleep or very relaxed.', 'Use baby nail clippers or a soft emery board, pressing the fingertip pad away from the nail.', 'File any rough edges. A nick happens to everyone; press gently with a clean cloth.']), 'nail');
    if (id === 'tub') return d(stageName, 'Give a tub bath', 'Once the cord stump has fallen off and the spot is dry, Maya’s ready for a baby tub.',
      (window.hubFigure ? hubFigure('tub', 'Daily rhythm', 'A baby lying back in a baby tub with about 2 inches of warm water, a hand supporting the head and neck.') : '') + h.steps(['Gather everything first: towel, washcloth, mild soap and a clean diaper.', 'Fill the tub with about 2 inches of warm water. Test it with your wrist; it should feel warm, not hot.', 'Support {p} head and neck with one arm, and wash from top to bottom with your other hand.', 'Lift {o} out onto the towel and wrap {o} up right away.'])
      + h.video('Bathing your baby, step by step', 'KidsHealth', 'https://kidshealth.org/en/parents/bathing-baby.html', 'Guide') + h.tip('Never step away', 'Not even for a moment. If you need to leave, wrap Maya in a towel and take {o} with you.') + h.tip('Water heater', 'Set it to 120°F or lower so tap water can’t scald.'), 'bath');
    if (id === 'skin') return d(stageName, 'Diaper rash and skin', 'Most diaper rash clears up in a few days with a few simple steps.',
      h.steps(['Change diapers often, and let the skin air out when you can.', 'Use a thick layer of zinc oxide cream at every change.', 'Call your pediatrician if it blisters, bleeds, spreads or isn’t better in a few days.']) + h.tip('Dry skin and cradle cap', 'Dry skin is common. Use a mild, fragrance-free soap only where needed, then pat on a fragrance-free moisturizer while the skin is still damp. For crusty patches on the scalp, rub in a little baby oil and brush gently before the bath.') + h.tip('Red, itchy patches?', 'Show your pediatrician, who can suggest what helps.'), 'drop');
    if (id === 'dress') return d(stageName, 'Dress Maya for the weather', 'Babies can’t tell you they’re too hot or cold, so a simple rule helps.',
      h.steps(['Dress Maya in one more layer than you’re comfortable in.', 'Feel the back of {p} neck. Sweaty means too warm; cool means add a layer.', 'Skip hats and heavy blankets for sleep. A sleep sack is enough.']) + h.tip('In the car seat', 'Take off puffy coats first. Buckle {o} in, then put a blanket over the straps.'), 'towel');
    if (id === 'gums') return d(stageName, 'Teething, drool and gums', 'Drooling and chewing on everything are normal now. Teeth can take a while to follow.',
      (live() && answers.hasTooth !== 'Yes' ? `<button class="hub-already" onclick="setAnswer('hasTooth','Yes');openPage('chg:Daily rhythm:d:teeth')">${name()} already has a tooth? See how to brush</button>` : '') + h.steps(['Wipe {p} gums with a clean, damp cloth once a day.', 'Keep a soft bib on and pat the chin dry to avoid a drool rash.', 'Offer a cool, firm teething ring if {s} {seem|seems} sore.']) + h.tip('Skip these', 'Teething necklaces, numbing gels and tablets. Ask your pediatrician about pain relief if needed.')  + (live() && answers.hasTooth !== 'Yes' ? '' : h.list('', [careRow('tooth', 'Brush the first teeth', 'Start as soon as the first one appears', 'teeth')])), 'tooth');
    if (id === 'steps') return d(stageName, 'Cruising and first steps', 'Pulling up and cruising along furniture usually come before walking. A few small changes help.',
      h.steps(['Let Maya go barefoot indoors. Bare feet help {o} balance and feel the floor.', 'Save shoes for outside, once {s’s} walking. Pick soft, flexible soles with room for the toes.', 'Expect {o} to pull up in the bath. Keep a hand on {o} the whole bath, and use a non-slip mat.']) + h.tip('Walkers', 'Skip walkers on wheels. They don’t help with walking, and they can lead to falls down stairs.'), 'stand');
    if (id === 'after1') return d('After the first birthday', 'What changes after 1', 'Everyday care stays much the same. A few things shift as Maya becomes a toddler.',
      h.steps(['Keep brushing twice a day with a rice-grain smear of fluoride toothpaste, until about age 3.', 'Baths can be every day or a few times a week. Keep a hand on Maya the whole bath, and the water shallow.']) + h.tip('Shoes', 'Bare feet are best indoors while Maya learns to walk. Soft, flexible shoes are for outside.'), 'tooth');
    if (id === 'teeth') return d(stageName, 'Brush the first teeth', 'As soon as the first tooth appears, brushing helps keep it healthy.',
      h.steps(['Use a soft baby toothbrush and a smear of fluoride toothpaste the size of a grain of rice.', 'Brush gently twice a day, including before bed.', 'No need to rinse. A little toothpaste left behind is fine.']) + h.tip('First dental visit', 'Book one after the first tooth comes in, and by the first birthday.'), 'tooth');
    if (id === 'bathseat') return d(stageName, 'Bath seats aren’t safety seats', 'A bath seat can help Maya sit up, but it won’t keep {o} safe if you step away.',
      h.steps(['Keep the water shallow, about as high as {p} waist when sitting.', 'Keep a hand on Maya the whole bath.', 'If you need to leave, wrap Maya in a towel and take {o} with you.']), 'bath');
    if (id === 'sun') return actualMonth() < 6 ? d(stageName, 'Keep Maya in the shade', 'Young babies’ skin burns easily, so shade comes first.',
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
    const head = !live() || said ? SAFETY_HEAD[key] : key === 'moving' ? ['Get ready for crawling, room by room', 'Most babies start moving between 6 and 10 months. Work through the rooms Maya will reach first.'] : key === 'pulling' ? ['Get ready for pulling up', 'Standing usually comes between 8 and 10 months, and brings windows, cords and furniture into reach.'] : SAFETY_HEAD[key];
    let b = h.hero({ eyebrow: STAGE_TABLE.Safety.stages.find(p => p.key === safetyGroup(key)).label, title: head[0], lead: head[1], meter: { label: owner === 'setup' ? 'Setup checks' : owner === 'reach' ? 'Reaching and rolling checks' : 'Babyproofing checks', n: done, of: guide.ids.length }, button: { label: pending.length ? (done ? 'Keep going with the checklist' : 'Open the checklist') : 'Review the checklist', onclick: `openSafetyChecklist('${owner}',${browse})` } });
    b += pending.length
      ? h.list(done ? 'Next up' : 'Start with these', [...pending].sort((x, y) => rank(x) - rank(y)).slice(0, 3).map(id => h.row({ icon: 'shield', cat: 'Safety', title: (items[id] || {}).title || id, sub: SAFETY_SUB[id] || shortLine((items[id] || {}).body), onclick: browse ? `openSafetyChecklist('${owner}',true)` : `openHomeSafetyCheck('${owner}','${id}')` })))
      : h.note(`You’ve done every check for this stage. Nice work.`);
    if (key === 'reaching' || (key === 'rolling' && answers.swaddleStopped !== 'Yes' && !answers.neverSwaddled)) b += h.list('In the sleep space', [h.row({ icon: 'sack', cat: 'Safety', title: key === 'rolling' ? 'Switch to a sleep sack' : 'Stop swaddling at the first attempt to roll', sub: key === 'rolling' ? 'Swaddling stops at the first attempt to roll' : 'Have a sleep sack that leaves the arms free ready', onclick: "openPage('chg:Sleep:safe')" })]);
    // Choking first aid lives with Feeding, but parents look for it here too: one row, same page.
    const aid = !!(window.__chg && window.__chg.local.safe && window.__chg.local.safe.Feeding && window.__chg.local.safe.Feeding[1]);
    b += h.list('Good to know', [h.row({ icon: 'shield', cat: 'Safety', title: 'Learn infant choking first aid', sub: aid ? 'You’ve learned this. A refresher any time.' : 'A short video now, and a class if you can', chipText: aid ? 'Done' : '', chipTone: aid ? 'is-done' : '', onclick: "openPage('chg:Feeding:safe')" })]);
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
    const eyebrow = done ? `Done · ${journeyDateLabel(record.date)}` : planned ? `Saved for ${journeyDateLabel(record.date)}` : age === 0 ? 'In the first week' : live() ? `Due around ${journeyDateLabel(iso(addMonths(parse(profile.dob), age)))}` : `At ${age} month${age === 1 ? '' : 's'}`;
    const title = (done ? `You’ve been to ${the}` : `What happens at ${the}`).replace(/(\d+)-month/g, '$1\u2011month');   // keep "6-month" on one line
    // The buttons follow the checkup's timing: past due asks to add it, far ahead only saves a date.
    const dueAt = age === 0 ? new Date(parse(profile.dob).getTime() + 5 * 864e5) : addMonths(parse(profile.dob), age), dueDays = Math.round((dueAt - NOW) / 864e5);
    const pastDue = live() && !done && !planned && dueDays < -3, farAhead = !done && !planned && dueDays > 14;
    const eyebrow2 = pastDue ? `Was due around ${journeyDateLabel(iso(dueAt))}` : eyebrow;
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
      `<span id="health-vaccines"></span>` + h.row({ icon: 'shield', cat: 'Health', title: 'Vaccines', sub: age === 0 ? 'Hepatitis B, and protection against RSV, a common winter virus' : ({ 1: 'The second hepatitis B dose may be due', 2: 'Usually the first big round of shots, plus an oral vaccine', 4: 'Usually the second round of the 2-month vaccines', 6: 'Usually the third round, plus a flu shot in season', 9: 'Often just catch-up shots, plus flu in season', 12: 'Usually measles, mumps and rubella, chickenpox and hepatitis A' })[age] || 'What’s due at this checkup', onclick: `openHealthDetail(${age},'vaccines')` }),
      h.row({ icon: 'hand', cat: 'Health', title: 'Questions and notes', sub: visitNotesFor(age) ? 'Your questions, and notes from this checkup' : 'Bring your questions, and jot down the answers', onclick: `openHealthDetail(${age},'questions')` })
    ]);
    b += h.list('Between checkups', [
      h.row({ icon: 'steth', cat: 'Health', title: `When Maya seems sick`, sub: 'Fevers, medicine and when to call', onclick: "openPage('chg:Health:d:sick')" }),
      h.row({ icon: 'heart', cat: 'Health', title: 'How are you doing?', sub: 'Your health matters too', onclick: "openPage('chg:Health:d:you')" })
    ]);
    b += h.versus('When to call', ['Call your pediatrician', feverRule(actualMonth())], ['Call 911', 'Struggles to breathe or turns blue, won’t wake or is floppy, or has a seizure.']);
    const nx = WELL_VISITS[WELL_VISITS.indexOf(age) + 1];
    if (nx != null) b += h.next(live() && age === focus ? 'After that' : 'Next checkup', healthJourneyLabel(nx), `openPage('health-visit:${nx}')`);
    return frame('Health', `data-health-journey="${age}"`, pills + missedLine, b);
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
    return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head"><p class="hub-context">${esc(`By ${age}`)}</p><h1>${esc(meta.title)}</h1><p class="hub-lead">${esc(DEV_STAGES[ref].summaries[domain])}</p></div><div class="hub-ticks">${rows}</div>${h.note(`Most babies show these by ${age}. Tap “Seen it” to save the moment to Memories.`)}${tryRow}${h.video('Watch each of these skills in action', 'CDC', devSource(ref), 'Photos and videos')}</div>`;
  };

  /* ---------- small detail screens for these categories ---------- */
  function detailFrame(cat, context, title, lead, inner) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="${cat}" style="${yearTheme(cat)}">${detailPageTop(cat)}<div class="hub-detail-head"><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }
  // One fever rule, used everywhere fever comes up. Source: HealthyChildren.org, "When to Call the Pediatrician".
  // One fever rule, used everywhere fever comes up. Source: AAP, HealthyChildren.org "Fever and Your Baby" and "Fever: When to Call the Pediatrician".
  window.feverRule = m => m < 3
    ? 'A temperature of 100.4°F or higher: call your pediatrician right away, day or night.'
    : m < 6 ? 'A temperature of 101°F or higher, a fever that lasts more than a day, or a fever with a rash or unusual sleepiness.'
    : 'A temperature of 103°F or higher, a fever that lasts more than a day, or a fever with a rash or unusual sleepiness.';
  window.feverBand = m => m < 3 ? 'Under 3 months' : m < 6 ? '3 to 6 months' : '6 months and up';
  function healthDetail(id) {
    const h = H(), under3 = actualMonth() < 3;
    if (id === 'you') return detailFrame('Health', 'Looking after you', 'How are you doing?', 'Caring for a new baby is a lot, for every parent. Your health matters too, and asking for help is part of looking after Maya.',
      h.versus('Common, or time to get help?', actualMonth() < 1 ? ['Common in the first two weeks', 'Feeling weepy, anxious or overwhelmed, with good moments in between. It usually eases on its own.'] : ['Common', 'Feeling worn out, short-tempered or flat after weeks of broken sleep. Rest and a little help usually make a real difference.'], ['Get help', 'Low mood or worry that lasts more than two weeks, can’t sleep even when you could, or feeling you can’t cope.'])
      + `<section class="hub-card hub-callout"><b>${F('Talk to someone today')}</b><p>${F('Call or text the National Maternal Mental Health Hotline at 1-833-852-6262. It’s free, confidential and open any time, for moms, partners and new parents.')}</p><a class="hub-button" href="tel:18338526262">${F('Call 1-833-852-6262')}</a></section>`
      + h.steps(['Tell your doctor or Maya’s pediatrician how you’re feeling. They ask because it’s common and treatable.', 'Take the help people offer, and name something specific, like a meal or a nap.', actualMonth() < 1 ? 'If you gave birth, go to your postpartum checkup, even if you feel fine.' : 'Trade nights or naps with another adult if you can. One longer stretch of sleep helps more than you’d think.'])
      + `<section class="hub-card hub-callout is-urgent"><b>${F('If you’re thinking about harming yourself or Maya')}</b><p>${F('Call or text 988, or call 911, right now.')}</p><a class="hub-button" href="tel:988">${F('Call 988')}</a></section>`);
    if (id === 'sick') return detailFrame('Health', 'Between checkups', 'When Maya seems sick', 'Most baby illnesses are mild, but young babies can get sick quickly. Here’s what to watch for.',
      `<section class="hub-card hub-callout"><b>${F('Fever at Maya’s age')}</b><p>${F(actualMonth() < 3 ? 'Maya is under 3 months, so a temperature of 100.4°F or higher means calling your pediatrician right away, day or night.' : 'Call your pediatrician for ' + feverRule(actualMonth()).charAt(0).toLowerCase() + feverRule(actualMonth()).slice(1))}</p></section>`
      + `<section class="hub-card hub-callout is-urgent"><b>${F('Call 911 if Maya')}</b><p>${F('Struggles to breathe or turns blue, won’t wake or is floppy, or has a seizure.')}</p></section>`
      + h.list('Good to know', [
        h.row({ icon: 'clock', cat: 'Health', title: 'Take a rectal temperature', sub: 'It’s the most accurate way for babies. Forehead and ear readings are less reliable.', onclick: '' }).replace('<button class="hub-row" onclick=""', '<div class="hub-row is-static"').replace('<button class="hub-row"', '<div class="hub-row is-static"').replace(/<\/button>$/, '</div>').replace('<span class="hub-chev" aria-hidden="true">›</span>', ''),
        h.row({ icon: 'drop', cat: 'Health', title: 'Watch for dehydration', sub: 'Far fewer wet diapers, a dry mouth, no tears or a sunken soft spot. If you see these, call your pediatrician today.', onclick: '' }).replace('<button class="hub-row" onclick=""', '<div class="hub-row is-static"').replace('<button class="hub-row"', '<div class="hub-row is-static"').replace(/<\/button>$/, '</div>').replace('<span class="hub-chev" aria-hidden="true">›</span>', ''),
        h.row({ icon: 'bottle', cat: 'Health', title: 'Ask before giving medicine', sub: 'Under 3 months, check with your pediatrician before any medicine. Ibuprofen is only for babies 6 months and up. Doses go by weight, so check the label or ask a pharmacist.', onclick: '' }).replace('<button class="hub-row" onclick=""', '<div class="hub-row is-static"').replace('<button class="hub-row"', '<div class="hub-row is-static"').replace(/<\/button>$/, '</div>').replace('<span class="hub-chev" aria-hidden="true">›</span>', '')
      ])
      + h.tip('Skip cough and cold medicines', 'They aren’t safe for babies. Saline drops and a bulb syringe help with a stuffy nose.')
      + h.video('When to call about a fever', 'HealthyChildren.org', 'https://www.healthychildren.org/English/health-issues/conditions/fever/pages/When-to-Call-the-Pediatrician.aspx', 'Guide'));
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
      const all = [...primary, ...more];
      return detailFrame('Development', phase.title, 'Ideas to try together', 'Pick whatever suits the moment. There’s no need to do them all.', h.list('', all.map(x => h.row({ icon: 'hand', cat: 'Development', title: (window.hubBabyify || (y => y))(x.title), sub: playLine(x), onclick: `openPage('play-activity:${phase.lo}:${x.id}')` }))));
    }
    return baseRoute(p);
  };

  /* ---------- Checkup questions and notes: one page for the visit, in the Health guide's style ---------- */
  const baseHealthDetail = window.healthJourneyDetail;
  window.healthJourneyDetail = healthJourneyDetail = function (age, part) {
    if (part !== 'questions' && part !== 'notes') return baseHealthDetail(age, part);
    const h = H(), e = v => esc(String(v)), own = journeyData().questions[age] || [], notes = visitNotesFor(age);
    const asked = (journeyData().checks['q' + age] || {});
    const ideas = healthJourneyQuestions(age).map((q, i) => `<label class="hub-q-idea${asked[i] ? ' is-on' : ''}"><input type="checkbox" ${asked[i] ? 'checked' : ''} onchange="hubAskedQuestion(${age},${i},this.checked)"><span>${q}</span></label>`).join('');
    // Your own questions tick off too, same as the suggested ones (stored as 'm0', 'm1'…).
    const mine = own.map((q, i) => `<div class="hub-q-mine"><label class="hub-q-idea${asked['m' + i] ? ' is-on' : ''}"><input type="checkbox" ${asked['m' + i] ? 'checked' : ''} onchange="hubAskedQuestion(${age},'m${i}',this.checked)"><span>${e(q)}</span></label><button onclick="removeJourneyQuestion(${age},${i})" aria-label="Remove this question">Remove</button></div>`).join('');
    const rec = healthRecord(age), attended = rec && rec.status === 'attended';
    const inner = `<section class="hub-card hub-q-card"><div class="hub-card-head"><b>Questions to ask</b><span class="hub-chip">${Object.entries(asked).filter(([k, v]) => v && !String(k).startsWith('m')).length} of ${healthJourneyQuestions(age).length} asked</span></div><p class="hub-q-hint">${F('Tick them off as you go.')}</p>${ideas}</section>`
      + `<section class="hub-card hub-q-card"><div class="hub-card-head"><b>Your questions</b></div>${mine || `<p class="hub-q-hint">${F('Anything on your mind about Maya. It’ll be here at the visit.')}</p>`}<form class="hub-q-add" onsubmit="submitJourneyQuestion(event,${age})"><input id="visitQuestion" maxlength="500" required placeholder="Add a question" aria-label="Add a question"><button>Add</button></form></section>`
      + `<section class="hub-card hub-q-card" id="visit-notes"><div class="hub-card-head"><b>Notes from the visit</b>${notes ? '<span class="hub-chip is-done">Saved</span>' : ''}</div><form onsubmit="submitVisitNotes(event,${age})"><textarea id="appointmentNotes" maxlength="6000" rows="6" placeholder="What the pediatrician said, next steps, things to remember…" aria-label="Notes from the visit">${e(notes)}</textarea><button class="hub-q-save">Save notes</button></form></section>`
      + (live() && !attended ? `<div class="hub-browse"><button class="hub-link" onclick="openPage('visit-form:${age}')">${F('Been to this checkup? Mark it as done')} ›</button></div>` : '');
    return h.detail('Health', healthJourneyLabel(age), 'Questions and notes', F('Bring your questions, and keep what you hear with this checkup.'), inner, 'steth');
  };
  // i: a suggested question's index, or 'm0'… for your own
  window.hubAskedQuestion = function (age, i, on) { const d = journeyData(); d.checks['q' + age] = Object.assign({}, d.checks['q' + age], { [i]: on }); saveJourneyData(d); const y = scrollY; render(); scrollTo(0, y); };
  window.hubVisitSkipped = function (a) { let o = {}; try { o = JSON.parse(localStorage.getItem('ahead-visit-skipped:' + journeyKey())) || {}; } catch (e) {} o[a] = true; try { localStorage.setItem('ahead-visit-skipped:' + journeyKey(), JSON.stringify(o)); } catch (e) {} render(); const nx = WELL_VISITS[WELL_VISITS.indexOf(a) + 1]; if (typeof hubToast === 'function') hubToast('Got it', 'Your pediatrician can catch up on anything at the next checkup.', nx != null ? ['See the next one', `document.querySelectorAll('.hub-toast').forEach(t=>t.remove());openPage('health-visit:${nx}')`] : null); };
})();
