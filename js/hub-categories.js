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
      const labels = DEVELOPMENT_DOMAINS[ref][d] || [], noticed = labels.filter(l => journeyData().records.some(r => r.type === 'milestone' && r.skillKey === journeySkillKey(l))).length;
      return `<button class="hub-tile" onclick="openPage('development-domain:${ref}:${d}')"><small>${DOMAIN_TITLES[d]}</small><b>${clearMilestone(labels[0] || '')}</b><span>${noticed ? F(`${noticed} you’ve noticed`) : F(labels.length > 1 ? `and ${labels.length - 1} more to look for` : 'Tap to see more')}</span></button>`;
    }).join('');
    b += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('What Maya might be doing')}</b></span><div class="hub-tiles">${tilesHtml}</div><span class="hub-card-note">${F(developmentMonth() < ref ? `Most babies show these by ${age}. Some may be here already, and others are on the way.` : `Most babies show these by ${age}.`)}</span></section>`;
    if (ref === now || !live()) {
      const ideas = (playStageModel().primary || []).slice(0, 3), lo = playPhase().lo;
      b += h.list('How you can help', ideas.map(a => h.row({ icon: 'hand', cat: 'Development', title: a.title, sub: playLine(a), onclick: `openPage('play-activity:${lo}:${a.id}')` })));
    }
    b += h.versus('Not yet, or time to ask?', ['Not yet', `Every baby gets there at {p} own pace. These can show up any time before ${age}.`], ['Talk to your pediatrician', 'If Maya loses a skill, or something worries you. No need to wait for the checkup.']);
    const keys = Object.keys(DEV_STAGES).map(Number), nx = keys[keys.indexOf(ref) + 1];
    if (nx && live() && ref === now && nx - developmentMonth(actualMonth()) <= 1) b += h.next(`Coming up by ${monthsLabel(nx)}`, DEV_STAGES[nx].title, `openPage('development-stage:${nx}')`);
    b += h.more('What other parents ask', `openPage('chg:Development:d:faq:${ref}')`);
    b += `<a class="hub-more" href="${devSource(ref)}" target="_blank" rel="noopener"><span>${F('See CDC photos and videos')}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`;
    return frame('Development', `data-development-guide="${ref}"`, pills, b);
  };

  /* ---------- Play: "What can we do together today?" ---------- */
  window.playStageOverview = playStageOverview = function (selected = null) {
    const { phase, primary, more } = playStageModel(selected), h = H(), nowLo = playPhase(developmentMonth(actualMonth())).lo;
    const pills = h.pills('Play by month', PLAY_MONTHS.map(p => ({ label: monthsLabel(p.lo), on: p.lo === phase.lo, now: live() && p.lo === nowLo, onclick: `openPage('play-stage:${p.lo}')` })));
    let b = h.hero({ eyebrow: `Play at ${monthsLabel(phase.lo).toLowerCase()}`.replace('play at newborn', 'Play in the newborn weeks').replace(/^play/, 'Play'), title: phase.title, lead: playMonthlyOverview(phase.intro), button: primary[0] ? { label: 'Try today’s idea', onclick: `openPage('play-activity:${phase.lo}:${primary[0].id}')` } : null });
    if (live() && phase.lo !== nowLo) b += back('Back to this month', `openPage('play-stage:${nowLo}')`);
    b += h.list('Ideas for this month', primary.slice(0, 3).map(a => h.row({ icon: 'hand', cat: 'Daily rhythm', title: a.title, sub: playLine(a), onclick: `openPage('play-activity:${phase.lo}:${a.id}')` })));
    const extra = primary.length - 3 + more.length;
    if (extra > 0) b += h.more(`${extra} more ideas`, `openPage('chg:Daily rhythm:d:more:${phase.lo}')`);
    b += h.tip('Follow Maya’s lead', 'Stay close during play, and stop when {s} {turn|turns} away, {fuss|fusses} or {seem|seems} tired.');
    const nx = PLAY_MONTHS[phase.lo + 1];
    if (nx) b += h.next('Next month', nx.title, `openPage('play-stage:${nx.lo}')`);
    return frame('Daily rhythm', `data-play-stage="${phase.lo}"`, pills, b);
  };

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

  window.developmentDomainPage = developmentDomainPage = function (ref, domain) {
    const meta = DEV_DOMAINS[domain], labels = DEVELOPMENT_DOMAINS[ref]?.[domain];
    if (!meta || !labels) return developmentJourneyOverview(ref);
    const h = H(), age = ref === 12 ? '1 year' : ref + ' months';
    const rows = labels.map(l => { const key = journeySkillKey(l), rec = journeyData().records.find(r => r.type === 'milestone' && r.skillKey === key);
      return `<button class="hub-row" onclick="openPage('skill-guide:${key}')"><span class="hub-dot">${h.art('swallow', 'Development')}</span><span class="hub-row-copy"><b>${clearMilestone(l)}</b><small>${esc(shortLine(DEV_EXAMPLES[l] || ''))}</small></span>${rec ? `<span class="hub-chip is-done">Noticed</span>` : ''}<span class="hub-chev" aria-hidden="true">›</span></button>`; }).join('');
    return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head"><p class="hub-context">${esc(DEV_STAGES[ref].title)}</p><h1>${esc(meta.title)}</h1><p class="hub-lead">${esc(DEV_STAGES[ref].summaries[domain])}</p></div><div class="hub-list">${rows}</div>${h.note(`Most babies show these by ${age}. Tap one to see what it looks like and how to help.`)}<a class="hub-more" href="${devSource(ref)}" target="_blank" rel="noopener"><span>${F('See CDC photos and videos')}</span><span class="hub-chev" aria-hidden="true">↗</span></a></div>`;
  };

  /* ---------- small detail screens for these categories ---------- */
  function detailFrame(cat, context, title, lead, inner) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="${cat}" style="${yearTheme(cat)}">${detailPageTop(cat)}<div class="hub-detail-head"><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if (cat === 'Development' && screen === 'd' && a === 'faq') { const ref = DEV_STAGES[b] ? Number(b) : devRef(); return detailFrame('Development', DEV_STAGES[ref].title, 'What other parents ask', '', devCommonQuestions(ref).replace('<h2>Common questions</h2>', '').replace('class="common-questions"', 'class="common-questions hub-faq"')); }
    if (cat === 'Daily rhythm' && screen === 'd' && a === 'more') {
      const { phase, primary, more } = playStageModel(Number(b)), h = H();
      const all = [...primary.slice(3), ...more];
      return detailFrame('Daily rhythm', phase.title, 'More ideas to try', 'Pick whatever suits the moment. There’s no need to do them all.', h.list('', all.map(x => h.row({ icon: 'hand', cat: 'Daily rhythm', title: x.title, sub: playLine(x), onclick: `openPage('play-activity:${phase.lo}:${x.id}')` }))));
    }
    return baseRoute(p);
  };
})();
