/* Ahead · Home rules
   Applies the Home recommendation engine spec to the existing Home design.
   Same components and markup as before (check-in card, "Likely around now" card with rows,
   the swaddle action row, "Prepare for next"). What changes is which rows appear and what they say:

     • Every row is a candidate with a tier, a reason and copy.
     • Hard filters drop rows that don't fit this baby (e.g. solids before a parent says so).
     • Rank: must-know first, then what a parent told us, then dated items, then age-based.
     • Caps: 3 rows in the main card, one per category, including a timely play activity.
     • Each row's small label says why it's there: "Sleep · You said Maya is trying to roll".
     • "Prepare for next" shows up to 2 coming-up items from categories not already above. */

(function () {
  const live = () => isCurrent();
  const ageM = () => developmentMonth(month);

  function movement() {
    if (!live()) return null;
    if (answers.pullUp === 'Yes') return 'pulling';
    if (answers.crawl === 'Yes') return 'crawling';
    if (answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection)) return 'rolling';
    if (answers.rollDirection === 'Trying to roll') return 'trying';
    return null;
  }
  const said = mv => `You said ${name()} ${{ trying: 'is trying to roll', rolling: 'is rolling', crawling: 'is crawling', pulling: 'is pulling up' }[mv]}`;

  function stageIndex(cat) {
    return chgStageIndex(cat);
  }

  /* Copy for each stage, written to the content skill: verb-first, one line, no jargon. */
  const SLEEP_ROW = [
    ['Newborn sleep', 'Recognize sleepy cues and understand short sleeps around the clock.'],
    ['Days and nights', 'Use daylight and a short evening routine as nights begin to take shape.'],
    ['Three naps', 'Find awake-time guidance and a sample day for this stage.'],
    ['Two naps a day', 'See how the day can fit around two naps, and what helps during the transition.']
  ];
  const FEED_ROW = [
    ['Newborn feeding', 'Recognize hunger and fullness cues, and the signs milk intake is on track.'],
    ['Changing milk feeds', 'Understand changing feeds and how milk intake and growth fit together.'],
    ['Getting ready for solids', 'Spot the readiness signs and get set up before the first bite.'],
    ['Starting solids', 'Choose a way to offer food, prepare it safely and keep milk feeds alongside.'],
    ['Textures and finger foods', 'Build on first foods with textures and self-feeding practice suited to your baby.'],
    ['Family meals', 'Bring meals, milk feeds and cup practice together as eating skills grow.']
  ];

  /* ---------- candidates ---------- */
  const mo = n => `${n} ${n === 1 ? 'month' : 'months'}`;
  // Developmental rows name the age they're based on: adjusted age for babies born early.
  const ageReason = () => profile.early && developmentMonth(month) !== month ? `Common at ${mo(developmentMonth(month))} adjusted` : `Common at ${mo(month)}`;
  // A parent's answer is only the reason when the row is about that skill.
  const relevant = (mv, title) => ({ trying: /roll/i, rolling: /roll/i, crawling: /crawl|mov/i, pulling: /pull|stand|cruis/i }[mv] || /$^/).test(title || '');

  const relevantCheck = mv => !safetyAgeForward();
  function unfinishedSafety(row) {
    if (row.topic !== 'Safety') return true;
    const owner = row.priority?.owner || row.action?.match(/openSafetyChecklist\('([^']+)'/)?.[1] || safetyOwnerForStage(safetyStageNow());
    return safetyPendingIds(safetyOwnedGuides()[owner].ids).length > 0;
  }
  function candidates() {
    const m = ageM(), mv = movement(), out = [];
    const base = conceptConnections();               // the app's own rows for this month
    const byTopic = t => base.find(r => r.topic === t);
    const priority = homePriority();                 // swaddle or a safety check, from answers

    // Foundational guidance belongs at the beginning, without becoming a
    // permanent warning. Reuse the actual Sleep checklist and its saved state.
    if (live() && stageIndex('Sleep') === 0 && chgSafeRemaining('Sleep') > 0)
      out.push({topic:'Sleep',title:'Set up baby’s sleep space',body:'Back sleeping, a clear flat sleep space and room-sharing: six checks for the first nights at home.',action:"openPage('chg:Sleep:safe')",tier:'must',reason:'For the first nights at home'});

    // Must-know actions a parent's answer triggered
    if (priority && priority.type === 'swaddle')
      out.push({ topic: 'Sleep', kind: 'swaddle', tier: 'must', reported: !!mv, reason: mv ? 'Stop swaddling now' : 'Before the first attempt to roll', priority });
    if (live() && (answers.pullUp === 'Yes' || m >= 8) && answers.mattressLowest !== 'Yes')
      out.push({ topic: 'Sleep', kind: 'mattress', tier: 'must', reported: answers.pullUp === 'Yes', reason: answers.pullUp === 'Yes' ? said('pulling') : 'Before she pulls up' });
    else if (live() && answers.sit === 'Yes' && answers.mattressLowered !== 'Yes' && answers.mattressLowest !== 'Yes')
      out.push({ topic: 'Sleep', kind: 'mattressLower', tier: 'must', reported: true, reason: `You said ${name()} sits without support` });
    if (priority && priority.type === 'check')
      out.push({ topic: 'Safety', kind: 'check', tier: 'must', reported: !!mv && relevantCheck(mv), reason: mv && relevantCheck(mv) ? said(mv) : priority.owner === 'mobile' ? (safetyAgeForward()==='pulling'?'Prepare for a higher reach':'Prepare before scooting or crawling') : 'Prepare space for rolling', priority });

    // Development: the skill to watch now
    const dev = byTopic('Development');
    const devHit = !!mv && relevant(mv, dev && dev.title);
    if (dev) out.push({ ...dev, tier: 'should', reported: devHit,
      reason: devHit ? (mv === 'trying' ? 'Rolling is starting' : said(mv)) : ageReason(),
      body: devHit && mv === 'rolling' ? 'Recognize rolling skills and ways to support them through floor play.' : devHit && mv === 'trying' ? 'Recognize early rolling attempts and ways to support them through floor play.' : dev.body });

    // A guide may be suggested by age; a "You said" label must use the actual answer.
    const fi = stageIndex('Feeding'), food = live() && hasFoodAnswer() ? foodStage() : null;
    const milkAnswered = live() && fi < 2 && homeInputs().asked.milk === month;
    const milkRow = fi < 2 && ['Breast milk', 'Formula', 'Both'].includes(profile.feed) ? homeMilkData() : null;
    out.push({ topic: 'Feeding', title: milkRow ? milkRow.title : FEED_ROW[fi][0], body: milkRow ? milkRow.body : FEED_ROW[fi][1], action: "openPage('topic:Feeding')",
      tier: 'should', essential: fi === 0, reported: milkAnswered || fi >= 3 && !!food,
      prep: fi === 2 && m >= 5,
      reason: fi === 0 ? 'For the first weeks' : fi === 1 ? ageReason() : fi === 2 ? (food === 'preparing' ? `You said ${name()} hasn’t started solids` : 'Prepare before the first bite') : !food ? 'Solids status not shared yet' : `You said ${name()} ${food === 'new' ? 'has started solids' : food === 'textures' ? 'is managing more textures' : 'is eating meals'}`,
      reference: fi === 1 && !milkAnswered });

    // Sleep: the current stage (a reference row, so it ranks below actions)
    const si = stageIndex('Sleep');
    out.push({ topic: 'Sleep', title: SLEEP_ROW[si][0], body: SLEEP_ROW[si][1], action: "openPage('topic:Sleep')",
      tier: 'should', reference: !(live() && si === 3 && (answers.twoNaps === 'Yes' || chgSleepAuto())), reported: live() && si === 3 && answers.twoNaps === 'Yes',
      reason: si === 0 ? 'For the first weeks' : live() && si === 3 && answers.twoNaps === 'Yes' ? `You said ${name()} is on two naps` : si === 3 ? 'Two-nap guidance for this stage' : ageReason() });

    // Give learning a timely route from Home, before the parent needs to make
    // the decision. These are previews, never instructions to start or drop a nap.
    if (m === 3) out.push({topic:'Sleep',title:'The 4-month sleep change',body:'See what more waking or short naps can look like, and how to respond if they happen.',action:"openPage('chg:Sleep:e:0')",tier:'should',prep:true,upcoming:true,reason:'Coming up · Around 4 months'});
    if (m === 4 && chgSettlingGuide() === 'learn') out.push({topic:'Sleep',title:'Learn about sleep training',body:'Understand the optional methods before deciding whether to try. Learning about them is not a decision to start.',action:"openPage('chg:Sleep:settle')",tier:'should',prep:true,upcoming:true,reason:'An optional decision · Around 4–6 months'});
    if ([7,8].includes(m) && !['Yes','Stay'].includes(answers.twoNaps)) out.push({topic:'Sleep',title:'Before dropping the catnap',body:'Look for repeated days when the late nap no longer fits and baby manages comfortably until bedtime.',action:"openPage('chg:Sleep:s:3')",tier:'should',prep:true,upcoming:true,reason:'As the late catnap stops fitting'});

    // Health: the next visit, ranked up when it's close
    let age = healthJourneyFocus();
    // The first-week visit has passed after about 10 days; look ahead to the 1-month visit.
    if (age === 0 && live() && (NOW - parse(profile.dob)) / 864e5 > 10) age = 1;
    const rec = healthRecord(age);
    const due = addMonths(parse(profile.dob), age), days = Math.round(((rec?.status === 'planned' ? parse(rec.date) : due) - NOW) / 864e5);
    if (rec?.status !== 'attended' && (age >= month || rec?.status === 'planned'))
      out.push({ topic: 'Health', title: healthJourneyLabel(age), action: `openPage('health-visit:${age}')`,
        // The visit summary stays visible when an appointment is saved; the date shows in the label.
        body: conceptHealthSummary(age),
        tier: 'should', dated: true, days, upcoming: days > 14, prep: true,
        reason: rec?.status === 'planned' ? `${rec.date < iso(NOW) ? 'Saved date passed · ' : 'Saved for '}${journeyDateLabel(rec.date)}` : age === 0 ? 'In the first week' : `Usually around ${mo(age)}` });

    // Safety: the guide for how she moves now (when no specific check is pending)
    const saf = byTopic('Safety');
    const rollGuide = (mv === 'trying' || mv === 'rolling') && !safetyAgeForward() && safetyPendingIds(safetyOwnedGuides().reach.ids).length
      ? { title: 'Make room for rolling', body: 'Nearby objects, floor space and diaper changes.', action: `openSafetyChecklist('reach',false)`, art: 0 }
      // An older baby with no movement answers gets the next checklist, never an earlier one.
      : ['rolling', 'moving', 'pulling'].includes(safetyStageNow()) && !(mv === 'trying' || mv === 'rolling') && saf && /reaching and rolling/i.test(saf.title)
        ? { title: 'Before crawling', body: 'Gates, storage, outlets and furniture anchors.', action: `openSafetyChecklist('mobile',false)`, art: 0 } : {};
    const safetyRow = saf && { ...saf, ...rollGuide, tier: 'should', reported: !!mv && !safetyAgeForward(), prep: !mv, upcoming: !mv && m < 4, reason: mv && !safetyAgeForward() ? said(mv) : m < 3 ? 'For the first weeks' : m < 5 ? 'Prepare space for reaching and rolling' : 'Prepare for the next movement' };
    if (safetyRow && !(priority && priority.type === 'check') && unfinishedSafety(safetyRow)) out.push(safetyRow);

    // A practical activity earns a place alongside guidance; keep the same three-row cap.
    const model = playStageModel(), idea = model.primary[0];
    const play = byTopic('Daily rhythm') || (idea ? { topic: 'Daily rhythm', title: idea.title, body: conceptPlaySuggestion(idea), action: `openPage('play-activity:${model.phase.lo}:${idea.id}')` } : null);
    if (play) out.push({ ...play, tier: 'should', activity: true, reason: 'An activity for this stage' });
    return out;
  }

  function score(c) {
    let s = { must: 400, should: 200, nice: 0 }[c.tier];
    if (c.reported) s += 100;                       // reported beats suggested
    if (c.dated) s += c.days <= 14 ? 120 : -40;
    if (c.reference) s -= 30;
    if (c.activity) s += 10;
    if (c.essential) s += 50;
    if (c.upcoming) s -= 60;
    return s;
  }

  function choose() {
    const all = candidates().map(c => ({ ...c, s: score(c) })).sort((a, b) => b.s - a.s);
    const main = [], held = [], used = {};
    all.forEach(c => {
      if (c.tier === 'nice') return held.push({ c, why: 'Nice-to-know: lives on its category page' });
      if (used[c.topic]) return held.push({ c, why: `One per category: ${c.topic} already shown` });
      if (c.upcoming) return held.push({ c, why: 'Coming up, not now' });
      if (main.length >= 3) return held.push({ c, why: 'Cap of 3 reached' });
      used[c.topic] = 1; main.push(c);
    });
    // Prepare for next: coming-up items from categories not already in the main card
    const next = [];
    const pool = [...held.filter(h => h.c.upcoming || h.c.prep).map(h => h.c),
      ...connectedHomeSections().next.filter(r => !['Sleep', 'Feeding', 'Health'].includes(r.topic))]
      .filter(r => (!r.dated || r.days <= 35) && unfinishedSafety(r));
    // A checkup in the coming month must not disappear behind undated references.
    pool.sort((a, b) => Number(!!b.dated && b.days <= 35) - Number(!!a.dated && a.days <= 35));
    pool.forEach(r => { if (next.length < 2 && !used[r.topic] && !next.some(n => n.topic === r.topic) && r.topic !== 'Daily rhythm') next.push({ ...r, reason: r.reason || (r.topic === 'Safety' ? 'Before baby can reach the next space' : 'Coming up') }); });
    return { main, next, held };
  }
  window.homeRulesDebug = () => { const r = choose(); return { main: r.main.map(c => c.topic + ': ' + (c.title || c.kind) + ' — ' + c.reason), next: r.next.map(c => c.topic + ': ' + c.title), held: r.held.map(h => h.c.topic + ': ' + (h.c.title || h.c.kind) + ' — ' + h.why) }; };
  // Read-only diagnostics for reason/action/timing regression tests.
  window.homeRecommendationAudit = () => { const r = choose(); return {current: r.main, preparation: r.next}; };

  /* ---------- the same markup Home already uses ---------- */
  const baseRow = conceptRow;
  window.conceptRow = conceptRow = function (row, extra = '') {
    const html = baseRow({ ...row, title: babyCopy(row.title), body: babyCopy(row.body || '') }, extra);
    return row.reason ? html.replace(`<small>${displayTopic(row.topic)}</small>`, `<small>${displayTopic(row.topic)} · ${esc(babyCopy(row.reason))}</small>`) : html;
  };

  function swaddleRow(c) {
    const row = { topic: 'Sleep', title: 'Stop swaddling at the first attempt to roll', body: 'Use regular sleepwear or an unweighted sleep sack with arms free.', action: "openPage('topic:Sleep')", art: 0, reason: c.reason };
    return `<div class="home-connected-sleep" style="${yearTheme('Sleep')}">${homeRow(row)}<div class="home-connected-actions">${homePriorityTools(c.priority)}</div></div>`;
  }
  function mattressRow(c) {
    const lowest = c.kind === 'mattress', key = lowest ? 'mattressLowest' : 'mattressLowered';
    const row = { topic: 'Sleep', title: lowest ? 'Set the crib mattress to its lowest' : 'Lower the crib mattress', body: lowest ? 'Remove mobiles and anything she can reach from standing.' : 'Follow the crib manual for the right position; lower it before baby can sit.', action: "openPage('chg:Sleep:safe')", art: 0, reason: c.reason };
    return `<div class="home-connected-sleep" style="${yearTheme('Sleep')}">${conceptRow(row)}<div class="home-connected-actions"><div class="home-action-tools"><button class="home-inline-check" aria-label="Mark done: crib mattress lowered" onclick="setAnswer('${key}','Yes')"><span aria-hidden="true"></span>Mark done</button></div></div></div>`;
  }
  function checkRow(c) {
    const html = homePriorityRow(c.priority);
    const reason = c.priority.id === 'gates' ? 'If your home has stairs · Before baby reaches them' : c.reason;
    return html.replace(/<small>Safety · [^<]*<\/small>/, `<small>Safety · ${esc(reason)}</small>`);
  }

  // No nagging: an unanswered check-in shows for two weeks, then rests until next month.
  const baseQuestion = homeQuestion;
  window.homeQuestion = homeQuestion = function () {
    const k = baseQuestion(); if (!k) return k;
    const store = 'ahead-v2-checkin-shown:' + journeyKey();
    let shown = {}; try { shown = JSON.parse(localStorage.getItem(store)) || {}; } catch (e) {}
    const s = shown[k], now = NOW.getTime();
    if (!s || s.month !== month) { shown[k] = { at: now, month }; try { localStorage.setItem(store, JSON.stringify(shown)); } catch (e) {} return k; }
    return now - s.at > 14 * 864e5 ? null : k;
  };

  window.adaptiveHome = homeAtlas = function () {
    const raw = connectedHomeBeforeBehavior(), start = raw.indexOf('<section class="connected-now"'), end = raw.indexOf('<section class="connected-browse"');
    const { main, next } = choose();
    const focus = homeCurrentFocus(), summary = month === 5 && !focus.confirmed ? focus.body.split(/(?<=[.!?])\s+/)[0] : focus.body;
    const rows = main.filter(c => c.kind !== 'check').map(c => c.kind === 'swaddle' ? swaddleRow(c) : ['mattress', 'mattressLower'].includes(c.kind) ? mattressRow(c) : conceptRow(c)).join('');
    const check = main.find(c => c.kind === 'check');
    const hero = `<section class="connected-now" aria-label="What matters now"><div class="connected-summary"><div class="home-summary connected-summary-intro"><div class="home-summary-heading"><div class="home-month-eyebrow">${month === 0 || focus.confirmed ? 'What matters now' : 'Likely around now'}</div><h1>${focus.title}</h1></div><span class="home-summary-art" aria-hidden="true">${homeMonthArt(month)}</span><p class="heroanswer">${summary}</p><div class="home-summary-spectrum" aria-hidden="true">${TOPICS.map(([topic]) => `<span style="background:${YEAR_PALETTES[topic].bg}"></span>`).join('')}</div></div>${rows ? `<div class="connected-summary-links">${rows}</div>` : ''}</div>${check ? checkRow(check) : ''}${homeMomentRow()}</section>`;
    const preparation = next.length ? `<section class="connected-ahead" aria-label="Prepare for next"><div class="connected-section-heading"><h2>Prepare for next</h2><button class="textlink" onclick="openPage('ahead')">See all →</button></div><div class="connected-ahead-list">${next.map(row => conceptRow(row)).join('')}</div></section>` : '';
    return raw.slice(0, start) + liveHomeCheckin() + hero + preparation + raw.slice(end);
  };
})();

