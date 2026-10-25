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
  const back = (label, onclick) => `<div class="hub-browse"><button class="hub-link is-quiet" onclick="${onclick}">${F(label)} ›</button></div>`;
  const firstSentence = t => ((String(t || '').match(/^.*?[.!?](\s|$)/) || [String(t || '')])[0]).trim().replace(/\.$/, '');
  const shortLine = t => { const f = firstSentence(t); return f.length > 72 && f.includes(',') ? f.slice(0, f.indexOf(',')) : f; };
  // One thing to try, phrased as an action: the short prompt if there is one, otherwise the first line of how to do it.
  const playLine = a => { const s = typeof conceptPlaySuggestion === 'function' ? conceptPlaySuggestion(a) : ''; return s && !s.startsWith(a.why || '\u0000') ? firstSentence(s) : firstSentence(a.how || a.why); };

  /* ---------- Development: "What might I see, and how can I help?" ---------- */
  const DOMAIN_TITLES = { Social: 'Social', Talking: 'Communication', Thinking: 'Thinking', Movement: 'Movement' };
  window.developmentJourneyOverview = developmentJourneyOverview = function (selected = null) {
    const ref = DEV_STAGES[selected] ? Number(selected) : devRef(), now = devRef(developmentMonth(actualMonth())), age = ref === 12 ? '1 year' : ref + ' months';
    const st = DEV_STAGES[ref], h = H();
    const pills = h.pills('Development by age', Object.keys(DEV_STAGES).map(Number).map(k => ({ label: monthsLabel(k), on: k === ref, now: live() && k === now, onclick: `openPage('development-stage:${k}')` })));
    let b = h.hero({ eyebrow: `What you might see by ${age}`, title: st.title, lead: st.body });
    if (live() && ref !== now) b += back(`Back to where Maya is now`, "navigate('categories');openPage('topic:Development')");
    const tilesHtml = Object.keys(DEV_DOMAINS).map(d => {
      const labels = DEVELOPMENT_DOMAINS[ref][d] || [], seen = labels.filter(l => journeyData().records.some(r => r.type === 'milestone' && r.skillKey === journeySkillKey(l))).length;
      return `<button class="hub-tile is-link" onclick="openPage('development-domain:${ref}:${d}')"><b>${DOMAIN_TITLES[d]}</b><span>${F(`${labels.length} skills to look for`)} ›</span>${seen ? `<em>${F(`${seen} seen`)}</em>` : ''}</button>`;
    }).join('');
    b += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('What Maya might be doing')}</b></span><div class="hub-tiles">${tilesHtml}</div><span class="hub-card-note">${F(developmentMonth() < ref ? `Most babies show these by ${age}. Some may be here already, and others are on the way.` : `Most babies show these by ${age}.`)}</span></section>`;
    if (ref === now || !live()) {
      const ideas = (playStageModel().primary || []).slice(0, 3), lo = playPhase().lo;
      b += h.list('Try together', ideas.map(a => h.row({ icon: 'hand', cat: 'Development', title: a.title, sub: playLine(a), onclick: `openPage('play-activity:${lo}:${a.id}')` })));
      const extra = (playStageModel().primary || []).length - 3 + (playStageModel().more || []).length;
      if (extra > 0) b += h.more(`${extra} more ideas to try`, `openPage('chg:Development:d:more:${lo}')`);
    }
    b += h.versus('Not yet, or time to ask?', ['Not yet', `Every baby gets there at {p} own pace. These can show up any time before ${age}.`], ['Talk to your pediatrician', 'If Maya loses a skill, or something worries you. No need to wait for the checkup.']);
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

  /* ---------- Everyday care: "How do I take care of Maya day to day?" ---------- */
  const CARE = [
    { key: 'first', rail: 'The first weeks', when: 'Until the cord stump falls off' },
    { key: 'bath', rail: 'Bath time', when: 'Usually 2 weeks–6 months' },
    { key: 'teeth', rail: 'Teeth and bigger baths', when: 'Usually 6–12 months' }
  ];
  const careNow = () => { const days = (NOW - parse(profile.dob)) / 864e5; return days < 21 ? 0 : developmentMonth(actualMonth()) < 6 ? 1 : 2; };
  const careStage = () => live() ? careNow() : (month < 1 ? 0 : month < 6 ? 1 : 2);
  const bathSafety = () => H().versus('Bath safety', ['Always', 'Gather everything first and keep one hand on Maya the whole time.'], ['Never', 'Step away, even for a moment. Babies can slip under quietly in seconds.']);
  function everydayCare(selected = null) {
    const now = careStage(), v = CARE[selected] ? selected : now, h = H(), C0 = CARE[v];
    const pills = h.pills('Everyday care', CARE.map((c, i) => ({ label: c.rail, on: i === v, now: live() && i === now, onclick: `openPage('chg:Daily rhythm:s:${i}')` })));
    let b = '';
    if (v === 0) {
      b += h.hero({ eyebrow: C0.rail, title: 'Sponge baths until the cord falls off', lead: 'Until the cord stump falls off, usually in a week or two, a sponge bath a few times a week is all Maya needs.' });
      b += h.glanceCard('Maya’s care at a glance', [['Baths', '2–3 a week', 'Sponge baths for now'], ['Diapers', '8–12 a day', 'Change when wet or dirty']], `openPage('chg:Daily rhythm:d:sponge')`);
      b += h.list('In these first weeks', [
        h.row({ icon: 'towel', cat: 'Daily rhythm', title: 'Give a sponge bath', sub: 'A warm room, a washcloth and 5 minutes', onclick: `openPage('chg:Daily rhythm:d:sponge')` }),
        h.row({ icon: 'cord', cat: 'Daily rhythm', title: 'Keep the cord stump clean and dry', sub: 'Fold the diaper below it and let it air', onclick: `openPage('chg:Daily rhythm:d:cord')` }),
        h.row({ icon: 'nail', cat: 'Daily rhythm', title: 'Trim tiny nails', sub: 'Easiest while {s} {sleep|sleeps}', onclick: `openPage('chg:Daily rhythm:d:nails')` })
      ]);
      b += h.versus('Normal, or time to call?', ['Normal', 'A little crust or a spot of blood near the cord, peeling skin and baby acne.'], ['Call your pediatrician', 'Redness spreading around the cord, pus or a bad smell, or a temperature of 100.4°F or higher.']);
    }
    if (v === 1) {
      b += h.hero({ eyebrow: C0.rail, title: 'Bath time can be quick and simple', lead: 'Two or three baths a week is plenty in the first year. Many families make it part of bedtime.' });
      b += h.glanceCard('Maya’s care at a glance', [['Baths', '2–3 a week', 'More if you like'], ['Water', 'About 100°F', 'Warm, not hot']], `openPage('chg:Daily rhythm:d:tub')`);
      b += h.list('What helps now', [
        h.row({ icon: 'bath', cat: 'Daily rhythm', title: 'Give a tub bath', sub: 'About 2 inches of warm water is plenty', onclick: `openPage('chg:Daily rhythm:d:tub')` }),
        h.row({ icon: 'drop', cat: 'Daily rhythm', title: 'Keep skin soft', sub: 'Mild soap, and moisturizer only if it’s dry', onclick: `openPage('chg:Daily rhythm:d:skin')` }),
        h.row({ icon: 'moon', cat: 'Daily rhythm', title: 'Make it part of bedtime', sub: 'Bath, feed, book, bed', onclick: `openPage('chg:Sleep:d:routine')` })
      ]);
      b += bathSafety();
    }
    if (v === 2) {
      b += h.hero({ eyebrow: C0.rail, title: 'First teeth, splashier baths', lead: 'Once Maya can sit, bath time gets more fun. When the first tooth shows up, it’s time to start brushing.' });
      b += h.glanceCard('Maya’s care at a glance', [['Teeth', 'Brush twice a day', 'From the first tooth'], ['Toothpaste', 'A rice-grain smear', 'With fluoride']], `openPage('chg:Daily rhythm:d:teeth')`);
      b += h.list('What helps now', [
        h.row({ icon: 'tooth', cat: 'Daily rhythm', title: 'Brush the first teeth', sub: 'A soft brush and a tiny smear of toothpaste', onclick: `openPage('chg:Daily rhythm:d:teeth')` }),
        h.row({ icon: 'bath', cat: 'Daily rhythm', title: 'Bath seats aren’t safety seats', sub: 'Stay within arm’s reach, every bath', onclick: `openPage('chg:Daily rhythm:d:bathseat')` }),
        h.row({ icon: 'sun', cat: 'Daily rhythm', title: 'Protect {p} skin in the sun', sub: 'Shade first, then baby sunscreen', onclick: `openPage('chg:Daily rhythm:d:sun')` })
      ]);
      b += bathSafety();
    }
    if (live() && v !== now) b = b.replace('</header>', '</header>' + back('Back to your guide', `openPage('chg:Daily rhythm:s:${now}')`));
    const nx = CARE[v + 1];
    if (nx) b += h.next(`Coming up ${nx.when.replace(/^Usually /, 'around ').replace(/ ?2 weeks–6 months/, ' 2 weeks').replace(/6–12 months/, '6 months')}`, nx.rail, `openPage('chg:Daily rhythm:s:${v + 1}')`);
    return frame('Daily rhythm', `data-care-stage="${CARE[v].key}"`, pills, b);
  }
  window.everydayCare = everydayCare;

  function careDetail(id) {
    const h = H(), d = (ctx, title, lead, inner, artName) => h.detail('Daily rhythm', ctx, title, lead, inner, artName);
    if (id === 'sponge') return d('The first weeks', 'Give a sponge bath', 'Until the cord stump falls off, a sponge bath keeps Maya clean without getting the stump wet.',
      h.steps(['Warm the room and lay Maya on a towel, with everything you need within reach.', 'Wash {p} face with a damp washcloth and plain water, then the rest of {o}, uncovering one part at a time.', 'Finish with the diaper area, then pat {o} dry, paying attention to skin folds.'])
      + h.video('Watch a newborn bath, step by step', 'WebMD', 'https://www.webmd.com/parenting/baby/video/bathing-newborns') + h.tip('How often?', 'Two or three times a week is plenty. In between, wipe {p} face, neck and diaper area.'), 'towel');
    if (id === 'cord') return d('The first weeks', 'Keep the cord stump clean and dry', 'The stump usually dries up and falls off on its own in 1–3 weeks.',
      h.steps(['Fold the top of the diaper down so the stump stays in the air.', 'If it gets dirty, clean it gently with plain water and pat it dry.', 'Let it fall off by itself, even if it’s hanging by a thread.']) + h.tip('A little crust is normal', 'A spot of blood when it comes off is normal too. Call if the skin around it gets red, swollen or smelly.'), 'cord');
    if (id === 'nails') return d('The first weeks', 'Trim tiny nails', 'Baby nails grow fast and are sharp enough to scratch {p} face.',
      h.steps(['Wait until Maya is asleep or very relaxed.', 'Use baby nail clippers or a soft emery board, pressing the fingertip pad away from the nail.', 'File any rough edges. A nick happens to everyone; press gently with a clean cloth.']), 'nail');
    if (id === 'tub') return d('Bath time', 'Give a tub bath', 'Once the cord has healed, Maya’s ready for a baby tub.',
      h.steps(['Gather everything first: towel, washcloth, mild soap and a clean diaper.', 'Fill the tub with about 2 inches of warm water. Test it with your wrist; it should feel warm, not hot.', 'Support {p} head and neck with one arm, and wash from top to bottom with your other hand.', 'Lift {o} out onto the towel and wrap {o} up right away.'])
      + h.video('Watch a baby bath, step by step', 'WebMD', 'https://www.webmd.com/parenting/baby/video/bathing-newborns') + h.tip('Water heater', 'Set it below 120°F so tap water can’t scald.'), 'bath');
    if (id === 'skin') return d('Bath time', 'Keep skin soft', 'Most babies don’t need lotion. Less is usually more.',
      h.steps(['Use a mild, fragrance-free soap, and only on the parts that need it.', 'Pat dry instead of rubbing, especially in skin folds.', 'If skin looks dry, a little fragrance-free moisturizer helps. If it stays dry, try fewer baths.']) + h.tip('Red, itchy patches?', 'That could be eczema. Mention it to your pediatrician, who can suggest what helps.'), 'drop');
    if (id === 'teeth') return d('Teeth and bigger baths', 'Brush the first teeth', 'As soon as the first tooth appears, brushing helps keep it healthy.',
      h.steps(['Use a soft baby toothbrush and a smear of fluoride toothpaste the size of a grain of rice.', 'Brush gently twice a day, including before bed.', 'No need to rinse. A little toothpaste left behind is fine.']) + h.tip('First dental visit', 'Plan one by the first birthday, or within 6 months of the first tooth.'), 'tooth');
    if (id === 'bathseat') return d('Teeth and bigger baths', 'Bath seats aren’t safety seats', 'A bath seat can help Maya sit up, but it won’t keep {o} safe if you step away.',
      h.steps(['Keep the water shallow, about as high as {p} waist when sitting.', 'Stay within arm’s reach for the whole bath.', 'If you need to leave, wrap Maya in a towel and take {o} with you.']), 'bath');
    if (id === 'sun') return d('Teeth and bigger baths', 'Protect Maya’s skin in the sun', 'Babies’ skin burns easily, so shade comes first.',
      h.steps(['Keep {o} in the shade and dress {o} in light clothes and a wide-brimmed hat.', 'From 6 months, use a broad-spectrum sunscreen of SPF 30 or more on skin you can’t cover.', 'Reapply every 2 hours, and after water play.']) + h.tip('Younger than 6 months?', 'Shade and clothing are best. A little sunscreen on small areas is OK if shade isn’t possible.'), 'sun');
    return everydayCare();
  }

  // Everyday care everywhere a category is listed: its summary line, its picture and its year view.
  const baseSnap = stageSnapshot;
  window.stageSnapshot = stageSnapshot = function (topic) {
    const r = baseSnap(topic);
    if (topic !== 'Daily rhythm') return r;
    const v = careStage();
    return Object.assign({}, r, { title: ['Sponge baths and cord care', 'Bath time', 'First teeth and bigger baths'][v], body: ['Sponge baths until the cord falls off, plus diapers and nails.', 'Quick, simple baths a few times a week.', 'Brushing the first teeth and staying close at bath time.'][v] });
  };
  const baseArt = yearIllustration;
  window.yearIllustration = yearIllustration = (t, i = 0) => t === 'Daily rhythm' && typeof hubArt === 'function' ? hubArt(['bath', 'towel', 'tooth', 'drop'][Math.abs(i) % 4], 'Daily rhythm') : baseArt(t, i);
  const baseYear = categoryYear;
  window.categoryYear = categoryYear = t => t === 'Daily rhythm' ? everydayCare() : baseYear(t);
  const baseHub = yearHub;
  window.yearHub = yearHub = () => baseHub().replace('First responses → shared games', 'Sponge baths → first teeth');

  /* ---------- Safety: "What do I need to do before Maya moves?" ---------- */
  const SAFETY_HEAD = { setup: ['Set up a few things once', 'Check the car seat, hot water, smoke alarms and any pool access.'], reaching: ['Get ready for reaching and rolling', 'Rolling puts the play mat and changing spot within reach. A quick check covers it.'], rolling: ['Babyproof before Maya moves', 'Most babies start moving at 6–10 months. Getting ahead of it saves a scramble.'], moving: ['Keep going, one room at a time', 'Maya can reach much more now. Work through the rooms {s} {use|uses} most.'], pulling: ['Check what Maya can reach standing', 'Standing brings windows, cords and furniture into reach.'] };
  window.safetyMovementGuide = safetyMovementGuide = function (selected = null) {
    const keys = SAFETY_MOVEMENT_STAGES.map(p => p.key), now = live() ? safetyStageNow() : safetyMovementStage();
    const key = keys.includes(selected) ? selected : now, owner = safetyOwnerForStage(key), guide = safetyOwnedGuides()[owner], h = H();
    const browse = live() && key !== now, items = safetyHomeItems(), pending = safetyPendingIds(guide.ids), done = guide.ids.length - pending.length;
    const pills = h.pills('Safety by movement', SAFETY_MOVEMENT_STAGES.map(p => ({ label: p.rail, on: p.key === key, now: live() && p.key === now, onclick: `openPage('safety-stage:${p.key}')` })));
    let b = h.hero({ eyebrow: SAFETY_MOVEMENT_STAGES.find(p => p.key === key).rail, title: SAFETY_HEAD[key][0], lead: SAFETY_HEAD[key][1], meter: { label: owner === 'setup' ? 'Setup checks' : owner === 'reach' ? 'Reaching and rolling checks' : 'Babyproofing checks', n: done, of: guide.ids.length }, button: { label: pending.length ? (done ? 'Keep going with the checklist' : 'Open the checklist') : 'Review the checklist', onclick: `openSafetyChecklist('${owner}',${browse})` } });
    if (browse) b += back('Back to your guide', 'safetyBackToNow()');
    b += pending.length
      ? h.list(done ? 'Next up' : 'Start with these', pending.slice(0, 3).map(id => h.row({ icon: 'shield', cat: 'Safety', title: (items[id] || {}).title || id, sub: shortLine((items[id] || {}).body), onclick: browse ? `openSafetyChecklist('${owner}',true)` : `openHomeSafetyCheck('${owner}','${id}')` })))
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
    const pills = h.pills('Checkups', WELL_VISITS.map(a => ({ label: a === 0 ? 'First week' : a + (a === 1 ? ' month' : ' months'), on: a === age, now: live() && a === focus, onclick: `openPage('health-visit:${a}')` })));
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
    b += h.versus('Between checkups', ['Call your pediatrician', actualMonth() < 3 ? 'Under 3 months, a temperature of 100.4°F or higher means calling right away.' : 'Fever with fewer wet diapers, or anything that worries you.'], ['Call 911', 'Trouble breathing, blue lips, or {s} won’t wake up.']);
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
      return `<div class="hub-tick is-habit"><span class="hub-tick-art">${h.art('swallow', 'Development')}</span><span class="hub-row-copy"><b>${clearMilestone(l)}</b><small>${esc(DEV_EXAMPLES[l] || '')}</small></span>${rec ? `<span class="hub-chip is-done">${F('Seen')} ✓</span>` : `<button class="hub-seen" onclick="hubSeen('${key}')">${F('Seen it')}</button>`}</div>`; }).join('');
    const skill = journeySkills().find(s => labels.includes(s.label) && typeof devSkillActivity === 'function' && devSkillActivity(s)), act = skill && devSkillActivity(skill);
    const tryRow = act ? h.list('Try this together', [h.row({ icon: 'hand', cat: 'Development', title: act.title, sub: playLine(act), onclick: `openDevelopmentActivity('${skill.key}')` })]) : '';
    return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head"><p class="hub-context">${esc(`By ${age}`)}</p><h1>${esc(meta.title)}</h1><p class="hub-lead">${esc(DEV_STAGES[ref].summaries[domain])}</p></div><div class="hub-ticks">${rows}</div>${h.note(`Most babies show these by ${age}. Tap “Seen it” to save the moment to Maya’s timeline.`)}${tryRow}<a class="hub-video" href="${devSource(ref)}" target="_blank" rel="noopener"><span class="hub-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5Z" fill="currentColor"/></svg></span><span class="hub-row-copy"><b>${F('See what these look like')}</b><small>${F('Photos and videos · CDC')}</small></span><span class="hub-chev" aria-hidden="true">↗</span></a></div>`;
  };

  /* ---------- small detail screens for these categories ---------- */
  function detailFrame(cat, context, title, lead, inner) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="${cat}" style="${yearTheme(cat)}">${detailPageTop(cat)}<div class="hub-detail-head"><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if (cat === 'Development' && screen === 'd' && a === 'faq') { const ref = DEV_STAGES[b] ? Number(b) : devRef(); return detailFrame('Development', DEV_STAGES[ref].title, 'What other parents ask', '', devCommonQuestions(ref).replace('<h2>Common questions</h2>', '').replace('class="common-questions"', 'class="common-questions hub-faq"')); }
    if (cat === 'Daily rhythm' && screen === 's') return everydayCare(Number(a));
    if (cat === 'Daily rhythm' && screen === 'd' && a !== 'more') return careDetail(a);
    if ((cat === 'Daily rhythm' || cat === 'Development') && screen === 'd' && a === 'more') {
      const { phase, primary, more } = playStageModel(Number(b)), h = H();
      const all = [...primary.slice(3), ...more];
      return detailFrame('Development', phase.title, 'More ideas to try', 'Pick whatever suits the moment. There’s no need to do them all.', h.list('', all.map(x => h.row({ icon: 'hand', cat: 'Development', title: x.title, sub: playLine(x), onclick: `openPage('play-activity:${phase.lo}:${x.id}')` }))));
    }
    return baseRoute(p);
  };
})();
