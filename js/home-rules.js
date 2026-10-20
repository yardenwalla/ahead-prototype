/* Ahead · Home rules
   Applies the Home recommendation engine spec to the existing Home design.
   Same components and markup as before (check-in card, "Likely around now" card with rows,
   the swaddle action row, "Prepare for next"). What changes is which rows appear and what they say:

     • Every row is a candidate with a tier, a reason and copy.
     • Hard filters drop rows that don't fit this baby (e.g. solids before a parent says so).
     • Rank: must-know first, then what a parent told us, then dated items, then age-based.
     • Caps: 3 rows in the main card, one per category. Nice-to-know (play ideas) stays on its page.
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
    if (live()) return chgStageIndex(cat);
    const m = ageM();
    return cat === 'Sleep' ? (m < 2 ? 0 : m < 4 ? 1 : m < 6 ? 2 : 3) : (m < 2 ? 0 : m < 4 ? 1 : m < 6 ? 2 : m < 8 ? 3 : m < 10 ? 4 : 5);
  }

  /* Copy for each stage, written to the content skill: verb-first, one line, no jargon. */
  const SLEEP_ROW = [
    ['Newborn sleep', 'Short sleeps around the clock are normal. Start settling at the first yawn.'],
    ['Days and nights sort out', 'Bright days and dim nights help one longer night stretch appear.'],
    ['Naps find a rhythm', 'Naps start landing at similar times, about 2 hours apart.'],
    ['Two naps a day', 'The late catnap drops. An earlier bedtime helps during the switch.']
  ];
  const FEED_ROW = [
    ['Newborn feeding', 'Feed on demand, 8–12 times a day. Wet diapers tell you it’s enough.'],
    ['Feeds find a rhythm', 'Feeds spread out and get quicker. Milk is still everything she needs.'],
    ['Getting ready for solids', 'Spot the readiness signs and get set up before the first bite.'],
    ['Starting solids', 'Start with iron-rich foods, and offer peanut and egg early.'],
    ['Textures and finger foods', 'Move to soft finger foods, and keep choking hazards off her plate.'],
    ['Family meals', 'Three meals a day alongside milk. Cups come next.']
  ];

  /* ---------- candidates ---------- */
  function candidates() {
    const m = ageM(), mv = movement(), out = [];
    const base = conceptConnections();               // the app's own rows for this month
    const byTopic = t => base.find(r => r.topic === t);
    const priority = homePriority();                 // swaddle or a safety check, from answers

    // Must-know actions a parent's answer triggered
    if (priority && priority.type === 'swaddle')
      out.push({ topic: 'Sleep', kind: 'swaddle', tier: 'must', reported: true, reason: said(mv || 'trying'), priority });
    if (priority && priority.type === 'check')
      out.push({ topic: 'Safety', kind: 'check', tier: 'must', reported: true, reason: mv ? said(mv) : 'Before she starts to move', priority });

    // Development: the skill to watch now
    const dev = byTopic('Development');
    if (dev) out.push({ ...dev, tier: 'should', reported: !!mv,
      reason: mv === 'trying' ? 'Rolling is starting' : mv ? said(mv) : `Common at ${monthLabel(month).toLowerCase()}`,
      body: mv === 'rolling' ? 'What to notice, and how floor play helps her practise.' : mv === 'trying' ? 'What to notice as she starts, and how floor play helps.' : dev.body });

    // Feeding: the stage from the new Feeding guide. Solids only after a parent says so.
    const fi = stageIndex('Feeding'), food = live() && hasFoodAnswer() ? foodStage() : null;
    out.push({ topic: 'Feeding', title: FEED_ROW[fi][0], body: FEED_ROW[fi][1], action: "openPage('topic:Feeding')",
      tier: 'should', reported: fi >= 3 && !!food,
      prep: fi === 2,
      reason: fi === 0 ? 'For the first weeks' : fi === 2 ? (m >= 6 && live() ? `Tell us when ${name()} starts solids` : 'Most babies start solids around 6 months') : fi >= 3 && food ? `You said ${name()} ${food === 'new' ? 'has started solids' : 'is eating meals'}` : `Common at ${monthLabel(month).toLowerCase()}`,
      reference: fi === 1 });

    // Sleep: the current stage (a reference row, so it ranks below actions)
    const si = stageIndex('Sleep');
    out.push({ topic: 'Sleep', title: SLEEP_ROW[si][0], body: SLEEP_ROW[si][1], action: "openPage('topic:Sleep')",
      tier: 'should', reference: true, reason: si === 0 ? 'For the first weeks' : `Common at ${monthLabel(month).toLowerCase()}` });

    // Health: the next visit, ranked up when it's close
    const age = healthJourneyFocus(), rec = healthRecord(age);
    const due = addMonths(parse(profile.dob), age), days = Math.round((rec?.status === 'planned' ? parse(rec.date) : due) - NOW) / 864e5;
    if (rec?.status !== 'attended' && age >= month)
      out.push({ topic: 'Health', title: healthJourneyLabel(age), action: `openPage('health-visit:${age}')`,
        body: rec?.status === 'planned' ? 'Your questions and notes are saved with this visit.' : 'Preview the checks and pick the questions you want to ask.',
        tier: 'should', dated: true, days, upcoming: days > 14, prep: true,
        reason: rec?.status === 'planned' ? `Saved for ${journeyDateLabel(rec.date)}` : age === 0 ? 'In the first week' : age === month ? `Due at ${age} months` : `Due around ${age} months` });

    // Safety: the guide for how she moves now (when no specific check is pending)
    const saf = byTopic('Safety');
    const rollGuide = mv === 'trying' || mv === 'rolling'
      ? { title: 'Make room for rolling', body: 'Nearby objects, floor space and diaper changes.', action: `openSafetyChecklist('reach',false)`, art: 0 } : {};
    if (saf && !(priority && priority.type === 'check'))
      out.push({ ...saf, ...rollGuide, tier: 'should', reported: !!mv, prep: !mv, upcoming: !mv && m < 4, reason: mv ? said(mv) : m < 6 ? 'Most babies roll by 6 months' : 'Before she’s on the move' });

    // Play ideas are nice-to-know: they live on the Play page, not Home
    const play = byTopic('Daily rhythm');
    if (play) out.push({ ...play, tier: 'nice', reason: '' });
    return out;
  }

  function score(c) {
    let s = { must: 400, should: 200, nice: 0 }[c.tier];
    if (c.reported) s += 100;                       // reported beats suggested
    if (c.dated) s += c.days <= 14 ? 120 : -40;
    if (c.reference) s -= 30;
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
      ...connectedHomeSections().next.filter(r => !['Sleep', 'Feeding', 'Health'].includes(r.topic))];
    pool.forEach(r => { if (next.length < 2 && !used[r.topic] && !next.some(n => n.topic === r.topic) && r.topic !== 'Daily rhythm') next.push({ ...r, reason: r.reason || 'Coming up' }); });
    return { main, next, held };
  }
  window.homeRulesDebug = () => { const r = choose(); return { main: r.main.map(c => c.topic + ': ' + (c.title || c.kind) + ' — ' + c.reason), next: r.next.map(c => c.topic + ': ' + c.title), held: r.held.map(h => h.c.topic + ': ' + (h.c.title || h.c.kind) + ' — ' + h.why) }; };

  /* ---------- the same markup Home already uses ---------- */
  const baseRow = conceptRow;
  window.conceptRow = conceptRow = function (row, extra = '') {
    const html = baseRow(row, extra);
    return row.reason ? html.replace(`<small>${displayTopic(row.topic)}</small>`, `<small>${displayTopic(row.topic)} · ${esc(row.reason)}</small>`) : html;
  };

  function swaddleRow(c) {
    const row = { topic: 'Sleep', title: 'Time to stop swaddling', body: 'Use regular sleepwear or an unweighted sleep sack with arms free.', action: "openPage('topic:Sleep')", art: 0, reason: c.reason };
    return `<div class="home-connected-sleep" style="${yearTheme('Sleep')}">${homeRow(row)}<div class="home-connected-actions">${homePriorityTools(c.priority)}</div></div>`;
  }
  function checkRow(c) {
    const html = homePriorityRow(c.priority);
    return html.replace(/<small>Safety · [^<]*<\/small>/, `<small>Safety · ${esc(c.reason)}</small>`);
  }

  window.adaptiveHome = homeAtlas = function () {
    const raw = connectedHomeBeforeBehavior(), start = raw.indexOf('<section class="connected-now"'), end = raw.indexOf('<section class="connected-browse"');
    const { main, next } = choose();
    const focus = homeCurrentFocus(), summary = month === 5 && !focus.confirmed ? focus.body.split(/(?<=[.!?])\s+/)[0] : focus.body;
    const rows = main.filter(c => c.kind !== 'check').map(c => c.kind === 'swaddle' ? swaddleRow(c) : homeRow(c)).join('');
    const check = main.find(c => c.kind === 'check');
    const hero = `<section class="connected-now" aria-label="What matters now"><div class="connected-summary"><div class="home-summary connected-summary-intro"><div class="home-summary-heading"><div class="home-month-eyebrow">${month === 0 || focus.confirmed ? 'What matters now' : 'Likely around now'}</div><h1>${focus.title}</h1></div><span class="home-summary-art" aria-hidden="true">${homeMonthArt(month)}</span><p class="heroanswer">${summary}</p><div class="home-summary-spectrum" aria-hidden="true">${TOPICS.map(([topic]) => `<span style="background:${YEAR_PALETTES[topic].bg}"></span>`).join('')}</div></div>${rows ? `<div class="connected-summary-links">${rows}</div>` : ''}</div>${check ? checkRow(check) : ''}${homeMomentRow()}</section>`;
    const preparation = next.length ? `<section class="connected-ahead" aria-label="Prepare for next"><div class="connected-section-heading"><h2>Prepare for next</h2><button class="textlink" onclick="openPage('ahead')">See all →</button></div><div class="connected-ahead-list">${next.map(row => homeRow(row)).join('')}</div></section>` : '';
    return raw.slice(0, start) + liveHomeCheckin() + hero + preparation + raw.slice(end);
  };
})();
