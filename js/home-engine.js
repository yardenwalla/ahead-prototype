/* Ahead · Home recommendation engine
   Spec: "Ahead · Home recommendation engine spec" (Claude Docs).

   Every possible Home card is written once below as a rule. The engine never invents
   cards; it runs the same pipeline every time Home renders:

     collect every rule → hard filters → rank → caps (3 cards, one per category) → Home
                                                                     └→ notification (must-know only)

   Rules that don't make it are kept with the reason, so "How Home chose these" can show them. */

(function () {
  /* ---------- engine state: signals that aren't already app answers ---------- */
  const KEY = 'ahead-v2-engine';
  let E = { done: {}, snooze: {}, notified: {}, confirm: null };
  try { E = Object.assign(E, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const saveE = () => { try { localStorage.setItem(KEY, JSON.stringify(E)); } catch (e) {} };
  const DAY = 864e5;
  const today = () => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; };
  const fmtDate = d => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  /* ---------- context: what the engine knows about this baby ---------- */
  function context() {
    const live = isCurrent();               // previewing another month uses age only
    const m = developmentMonth(month);      // adjusted age
    const roll = !live ? null : (answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection)) ? 'yes' : answers.rollDirection === 'Trying to roll' ? 'trying' : (answers.roll === 'Not yet' || answers.rollDirection === 'Not yet') ? 'no' : null;
    const food = live && hasFoodAnswer() ? foodStage() : null;          // preparing | new | established | null (not asked)
    let changes = {}; try { changes = JSON.parse(localStorage.getItem('ahead-v2-changes')) || {}; } catch (e) {}
    const safeSleep = Object.values((changes.safe || {}).Sleep || { 0: true, 1: true }).filter(Boolean).length;
    const safeFeed = Object.values((changes.safe || {}).Feeding || { 0: true }).filter(Boolean).length;
    // Next well visit. The example family has saved theirs; others use the due date.
    const visit = [...WELL_VISITS, 15].find(n => n > m) ?? 15;
    const due = addMonths(parse(profile.dob), visit);
    const saved = live && profile.example && visit === 6 ? new Date(today().getTime() + 14 * DAY) : null;
    return {
      live, m, roll, food,
      started: food === 'new' || food === 'established',
      fingerFoods: food === 'established' || (food === 'new' && m >= 8),
      nursing: profile.feed !== 'Formula',
      crawl: live ? answers.crawl || null : null,
      pullUp: live ? answers.pullUp || null : null,
      sitting: live ? answers.sitSupport || null : null,
      twoNaps: live ? answers.twoNaps || null : null,
      swaddleStopped: answers.swaddleStopped === 'Yes',
      mattressLowest: answers.mattressLowest === 'Yes',
      safeSleep, safeFeed,
      visit, visitDate: saved || due, visitSaved: !!saved,
      daysToVisit: Math.round(((saved || due) - today()) / DAY),
      reachPending: typeof safetyPendingIds === 'function' ? safetyPendingIds(['rollspace', 'changing']) : [],
      gatesPending: typeof safetyPendingIds === 'function' ? safetyPendingIds(['gates']) : []
    };
  }

  /* ---------- the rules ----------
     tier: must | should | nice      type: must-do | check-in | checkup | coming-up | reassurance
     hard(c): null when eligible, otherwise the reason it's filtered (shown in "How Home chose these")
     reported(c): true when a parent's answer triggered it (reported beats suggested)       */
  const N = () => name();
  const RULES = [
    { id: 'sleep.stop-swaddling', cat: 'Sleep', type: 'must-do', tier: 'must', cooldown: 3, notify: true,
      hard: c => c.roll !== 'yes' && c.roll !== 'trying' ? 'Not rolling or trying yet' : c.swaddleStopped ? 'Already marked done' : null,
      reported: () => true,
      reason: c => `You said ${N()} ${c.roll === 'yes' ? 'is rolling' : 'is trying to roll'}`,
      title: () => 'Stop swaddling now',
      line: () => 'Use regular sleepwear or an unweighted sleep sack with arms free.',
      push: () => [`${N()} may be rolling soon`, 'Time to stop swaddling.'],
      open: "openPage('topic:Sleep')", done: { label: 'Done', act: "engineDone('sleep.stop-swaddling','swaddleStopped')" } },

    { id: 'sleep.mattress-lowest', cat: 'Sleep', type: 'must-do', tier: 'must', cooldown: 3, notify: true,
      hard: c => c.pullUp !== 'Yes' ? 'Not pulling up yet' : c.mattressLowest ? 'Already marked done' : null,
      reported: () => true,
      reason: () => `You said ${N()} is pulling up`,
      title: () => 'Set the crib mattress to its lowest',
      line: () => 'Remove mobiles and anything she can reach from standing.',
      push: () => [`${N()} is pulling up`, 'Lower the crib mattress tonight.'],
      open: "openPage('chg:Sleep:safe')", done: { label: 'Done', act: "engineDone('sleep.mattress-lowest','mattressLowest')" } },

    { id: 'sleep.safe-setup', cat: 'Sleep', type: 'must-do', tier: 'must', cooldown: 3,
      hard: c => c.m > 1 ? 'Only for the first weeks' : c.safeSleep >= 6 ? 'Checklist complete' : null,
      reason: c => `${c.safeSleep} of 6 checked`,
      title: () => 'Finish your safe sleep setup',
      line: () => 'Back to sleep, a clear crib in your room, and never on a sofa.',
      open: "openPage('chg:Sleep:safe')" },

    { id: 'sleep.two-naps', cat: 'Sleep', type: 'check-in', tier: 'should', cooldown: 14,
      hard: c => !c.live ? 'Check-ins only ask about today' : c.m < 6 || c.m > 9 ? 'Outside the 3-to-2 nap window' : c.twoNaps ? 'Already answered' : null,
      reason: () => 'Most babies start around now',
      title: () => `Is ${N()} skipping the late catnap most days?`,
      line: () => 'Your answer moves Sleep to the right stage.',
      choices: [['Yes, most days', "engineAnswer('twoNaps','Yes','Sleep moved to Two naps')"], ['Not yet', "engineAnswer('twoNaps','No','Sleep stays on Naps find a rhythm')"]] },

    { id: 'sleep.4mo-regression', cat: 'Sleep', type: 'reassurance', tier: 'should',
      hard: c => c.m < 3 || c.m > 5 ? 'Outside its usual window' : 'Not reported; it lives on the Sleep page',
      title: () => 'The 4-month sleep regression' },

    { id: 'dev.rolling', cat: 'Development', type: 'check-in', tier: 'should', cooldown: 14,
      hard: c => !c.live ? 'Check-ins only ask about today' : c.m < 3 || c.m > 7 ? 'Outside the rolling window' : c.roll === 'yes' ? 'Already rolling' : c.roll ? 'Already answered this month' : null,
      unlocks: true,
      reason: () => 'Most babies start around now',
      title: () => `Is ${N()} trying to roll?`,
      line: () => 'This changes which sleep and safety steps come first.',
      choices: [['Not yet', "engineMovement('not_yet')"], ['Trying', "engineMovement('trying')"], ['Rolling', "engineMovement('rolling')"]] },

    { id: 'dev.sitting', cat: 'Development', type: 'check-in', tier: 'should', cooldown: 14,
      hard: c => !c.live ? 'Check-ins only ask about today' : c.m < 4 || c.m > 7 ? 'Outside the sitting window' : c.sitting === 'Yes' ? 'Already answered' : null,
      reason: () => 'Most babies start around now',
      title: () => `Is ${N()} sitting with support yet?`,
      line: () => 'It’s one of the signs she’s getting ready for solids.',
      choices: [['Yes', "engineAnswer('sitSupport','Yes','Feeding: one readiness sign checked')"], ['Not yet', "engineAnswer('sitSupport','Not yet','We’ll ask again in a couple of weeks')"]] },

    { id: 'dev.crawl', cat: 'Development', type: 'check-in', tier: 'should', cooldown: 14,
      hard: c => !c.live ? 'Check-ins only ask about today' : c.m < 7 || c.m > 11 ? 'Outside the crawling window' : c.crawl === 'Yes' ? 'Already crawling' : null,
      unlocks: true,
      reason: () => 'Most babies start around now',
      title: () => `Has ${N()} started crawling?`,
      line: () => 'Moving across the floor changes which spaces need attention.',
      choices: [['Not yet', "engineAnswer('crawl','Not yet','We’ll ask again in a few weeks')"], ['Yes', "engineAnswer('crawl','Yes','Safety moved to Crawling')"]] },

    { id: 'feed.vitamin-d', cat: 'Feeding', type: 'must-do', tier: 'must', cooldown: 7,
      hard: c => c.m > 2 ? 'Only for the first weeks' : !c.nursing ? 'Formula already contains it' : null,
      reason: () => `Because ${N()} has breast milk`,
      title: () => 'Ask about vitamin D drops',
      line: () => 'Breastfed babies need vitamin D drops every day, starting in the first days.',
      open: "openPage('chg:Feeding:milk')", done: { label: 'Done', act: "engineDone('feed.vitamin-d')" } },

    { id: 'feed.solids-started', cat: 'Feeding', type: 'check-in', tier: 'should', cooldown: 14,
      hard: c => !c.live ? 'Check-ins only ask about today' : c.m < 6 ? 'Too early to ask' : c.food ? 'Already answered' : null,
      unlocks: true,
      reason: () => 'Most babies start around now',
      title: () => `Has ${N()} started solids?`,
      line: () => 'Feeding only moves to solids when you tell us.',
      choices: [['Not yet', "engineFood('preparing')"], ['First foods', "engineFood('new')"], ['Eating meals', "engineFood('established')"]] },

    { id: 'feed.before-first-bite', cat: 'Feeding', type: 'coming-up', tier: 'should', cooldown: 14,
      hard: c => c.m < 5 || c.m > 7 ? 'Outside the before-solids window' : c.started ? 'Already eating solids' : c.safeFeed >= 4 ? 'Checklist complete' : null,
      reason: () => 'Most babies start solids around 6 months',
      title: () => 'Get set up before the first bite',
      line: c => `High chair, choking first aid and a few basics. ${c.safeFeed} of 4 ready.`,
      open: "openPage('chg:Feeding:safe')" },

    { id: 'feed.allergens', cat: 'Feeding', type: 'must-do', tier: 'should', cooldown: 14,
      hard: c => !c.started ? 'Hard filter: not on solids yet' : null,
      reported: () => true,
      reason: () => `You said ${N()} is eating solids`,
      title: () => 'Start peanut and egg early',
      line: () => 'Offer common allergens early and often. Here’s how to start safely.',
      open: "openPage('chg:Feeding:allergy')" },

    { id: 'feed.choking', cat: 'Feeding', type: 'must-do', tier: 'must', cooldown: 7, notify: true,
      hard: c => !c.fingerFoods ? 'Hard filter: no finger foods yet' : null,
      reported: () => true,
      reason: () => `You said ${N()} eats finger foods`,
      title: () => 'Keep choking hazards off her plate',
      line: () => 'Whole grapes, nuts, popcorn and hard raw vegetables need preparing first.',
      push: () => [`${N()} is eating finger foods`, 'Here’s what to keep off her plate.'],
      open: "openPage('chg:Feeding:safe')", done: { label: 'Got it', act: "engineDone('feed.choking')" } },

    { id: 'feed.distracted', cat: 'Feeding', type: 'reassurance', tier: 'should', cooldown: 14,
      hard: c => c.m < 4 || c.m > 6 ? 'Outside its usual window' : null,
      reason: () => 'Common around now',
      title: () => 'Short, distracted feeds are normal',
      line: () => 'Her curiosity is taking off. Wet diapers matter more than any single feed.',
      open: "openPage('chg:Feeding:e:1')" },

    { id: 'health.checkup', cat: 'Health', type: 'checkup', tier: 'should', cooldown: 3, notify: true,
      hard: c => c.daysToVisit < 0 ? 'Visit date has passed' : c.daysToVisit > 14 ? `Not within 14 days (${c.visit}-month visit is ${c.daysToVisit} days away)` : null,
      dated: true,
      reason: c => c.visitSaved ? 'From your calendar' : `Due around ${fmtDate(c.visitDate)}`,
      title: c => `${c.visit}-month checkup is ${fmtDate(c.visitDate)}`,
      line: () => 'Preview the checks and pick the questions you want to ask.',
      push: c => [`${N()}’s checkup is in 3 days`, 'Pick the questions you want to ask.'],
      open: "openPage('topic:Health')" },

    { id: 'safety.reach', cat: 'Safety', type: 'must-do', tier: 'should', cooldown: 7,
      hard: c => c.roll !== 'yes' && c.roll !== 'trying' ? 'Not rolling or trying yet' : !c.reachPending.length ? 'Checks already done' : null,
      reported: () => true,
      reason: c => `You said ${N()} ${c.roll === 'yes' ? 'is rolling' : 'is trying to roll'}`,
      title: () => 'Give rolling more room',
      line: c => `${c.reachPending.length} quick check${c.reachPending.length > 1 ? 's' : ''} for the floor and diaper changes.`,
      open: "openPage('topic:Safety')" },

    { id: 'safety.gates', cat: 'Safety', type: 'must-do', tier: 'must', cooldown: 3, notify: true,
      hard: c => c.crawl !== 'Yes' ? 'Not crawling yet' : !c.gatesPending.length ? 'Already done' : null,
      reported: () => true,
      reason: () => `You said ${N()} is crawling`,
      title: () => 'Gate the stairs',
      line: () => 'Use a hardware-mounted gate at the top. Pressure gates are for the bottom only.',
      push: () => [`${N()} is on the move`, 'Time to gate the stairs.'],
      open: "openPage('topic:Safety')" },

    { id: 'play.texture-toys', cat: 'Play', type: 'reassurance', tier: 'nice',
      hard: () => 'Nice-to-know: lives on the Play page only',
      title: () => 'Smooth or bumpy? A texture game' }
  ];

  /* ---------- pipeline ---------- */
  const TIER = { must: 400, should: 200, nice: 0 };
  function score(r, c) {
    let s = TIER[r.tier];
    if (r.reported && r.reported(c)) s += 100;   // reported beats suggested
    if (r.dated) s += 150 - c.daysToVisit;       // dated and close
    if (r.type === 'check-in') s += r.unlocks ? 60 : 40; // answers that change what parents see
    if (r.type === 'reassurance') s -= 20;
    return s;
  }
  function run() {
    const c = context(), now = Date.now(), held = [], ok = [];
    RULES.forEach(r => {
      if (r.tier === 'nice') return held.push({ r, why: r.hard(c) });
      const f = r.hard(c);
      if (f) return held.push({ r, why: f });
      if (E.done[r.id]) return held.push({ r, why: 'Already marked done' });
      if (E.snooze[r.id] && E.snooze[r.id] > now) return held.push({ r, why: `You said “Not for us”, back after ${fmtDate(new Date(E.snooze[r.id]))}` });
      ok.push({ r, s: score(r, c) });
    });
    ok.sort((a, b) => b.s - a.s);
    const shown = [], used = {};
    ok.forEach(x => {
      if (used[x.r.cat]) return held.push({ r: x.r, why: `One card per category: ${x.r.cat} already has one` });
      if (x.r.type === 'check-in' && used.checkin) return held.push({ r: x.r, why: 'One check-in at a time; it’s next in line' });
      if (shown.length >= 3) return held.push({ r: x.r, why: `${x.r.tier === 'must' ? 'Must' : 'Should'}-know, but the cap of 3 is reached; it waits for next week` });
      used[x.r.cat] = 1; if (x.r.type === 'check-in') used.checkin = 1; shown.push(x);
    });
    // Notifications: must-know (or a checkup 3 days out), new, never 2 in 48h, quiet hours 8 pm–8 am.
    const hour = new Date().getHours(), last = Math.max(0, ...Object.values(E.notified));
    let push = null, pushWhy = 'Nothing this week needs a notification.';
    const cand = shown.find(x => x.r.notify && !E.notified[x.r.id] && (x.r.tier === 'must' || (x.r.dated && c.daysToVisit <= 3)));
    if (cand) {
      if (now - last < 2 * DAY) pushWhy = 'Held: one was already sent in the last 48 hours.';
      else if (hour >= 20 || hour < 8) { push = cand; pushWhy = 'Queued for 8 am (quiet hours).'; }
      else { push = cand; pushWhy = 'Sends now: must-know, new, and nothing sent in 48 hours.'; }
    }
    return { c, shown, held, push, pushWhy };
  }

  /* ---------- Home markup ---------- */
  const catTheme = cat => yearTheme(cat === 'Play' ? 'Daily rhythm' : cat);
  function card({ r }, c) {
    const choices = r.choices ? `<div class="eng-choices">${r.choices.map(([l, a]) => `<button onclick="${a}">${esc(l)}</button>`).join('')}</div>` : '';
    const actions = r.choices ? '' : `<div class="eng-actions">${r.open ? `<button class="eng-open" onclick="${r.open}">Open</button>` : ''}${r.done ? `<button class="eng-done" onclick="${r.done.act}">${esc(r.done.label)}</button>` : ''}</div>`;
    return `<article class="eng-card" data-rule="${r.id}" data-type="${r.type}" style="${catTheme(r.cat)}">
      <div class="eng-card-top"><span class="eng-reason"><b>${esc(r.cat === 'Play' ? 'Play' : displayTopic(r.cat))}</b> · ${esc(r.reason(c))}</span><button class="eng-not" onclick="engineNotForUs('${r.id}')" aria-label="Not for us: hide this card">Not for us</button></div>
      <h3>${esc(r.title(c))}</h3>${r.line ? `<p>${esc(r.line(c))}</p>` : ''}${choices}${actions}</article>`;
  }
  window.engineHomeSection = function () {
    const out = run(), { c, shown, held, push, pushWhy } = out;
    const confirm = E.confirm && Date.now() - E.confirm.at < 15000 ? `<p class="eng-confirm" role="status">✓ ${esc(E.confirm.text)}</p>` : '';
    const head = `<div class="connected-section-heading eng-head"><h2>${c.live ? `For ${name()} this week` : `At ${monthLabel(month).toLowerCase()}`}</h2>${c.live ? '' : '<span class="eng-preview">Preview by age</span>'}</div>`;
    const body = shown.length ? shown.map(x => card(x, c)).join('') : `<p class="eng-quiet">${c.live ? `Nothing new this week. Everything for ${name()} is on track.` : 'Home stays quiet at this age unless something you tell us needs action.'}</p>`;
    const why = `<details class="eng-why"><summary>How Home chose these <span aria-hidden="true">＋</span></summary>
      <ol class="eng-why-shown">${shown.map((x, i) => `<li><b>${i + 1}. ${esc(x.r.title(c))}</b><span>${esc(x.r.tier)}-know · ${esc(x.r.type)} · score ${x.s}</span></li>`).join('') || '<li>No cards passed every filter.</li>'}</ol>
      <h4>Held back</h4><ul class="eng-why-held">${held.map(x => `<li><b>${esc(x.r.title(c))}</b><span>${esc(x.why)}</span></li>`).join('')}</ul>
      <h4>Notification</h4><p class="eng-push">${push ? `<b>“${esc(push.r.push(c)[0])}” · ${esc(push.r.push(c)[1])}</b><br>` : ''}${esc(pushWhy)}</p>
      <p class="eng-small">Prototype view of the engine. Rules live in js/home-engine.js.</p></details>`;
    return `<section class="eng-home" aria-label="For ${name()} this week">${head}${confirm}<div class="eng-list">${body}</div>${why}</section>`;
  };
  window.engineRun = run;
  window.ENGINE_RULES = RULES;

  /* ---------- actions ---------- */
  function rerender() { const y = scrollY; render(); scrollTo(0, y); }
  function confirmMsg(text) { E.confirm = { text, at: Date.now() }; saveE(); }
  window.engineNotForUs = function (id) {
    const r = RULES.find(x => x.id === id), days = r && r.tier === 'must' ? (r.cooldown || 3) : 14;
    E.snooze[id] = Date.now() + days * DAY; confirmMsg('Hidden. Thanks, that helps us get Home right.'); rerender();
  };
  window.engineDone = function (id, answerKey) {
    E.done[id] = true; confirmMsg('Marked done.');
    if (answerKey) setAnswer(answerKey, 'Yes'); else rerender();
  };
  window.engineAnswer = function (key, value, msg) { confirmMsg(msg); setAnswer(key, value); };
  window.engineMovement = function (v) {
    confirmMsg(v === 'not_yet' ? 'We’ll ask again in a couple of weeks.' : 'Sleep and Safety updated for rolling.');
    if (v === 'rolling') setAnswer('roll', 'Yes'); else setAnswer('rollDirection', v === 'trying' ? 'Trying to roll' : 'Not yet');
  };
  window.engineFood = function (v) {
    confirmMsg(v === 'preparing' ? 'Feeding stays on Getting ready for solids.' : v === 'new' ? 'Feeding moved to Starting solids.' : 'Feeding moved to Textures and finger foods.');
    setFeedingStage(v);
  };
  window.engineReset = function () { E = { done: {}, snooze: {}, notified: {}, confirm: null }; saveE(); rerender(); };
})();

/* Home: month strip, then this week's cards, then the month story, then browse.
   The engine replaces the old check-in, row list and "Prepare for next". */
(function () {
  const before = adaptiveHome;
  window.adaptiveHome = homeAtlas = function () {
    const raw = connectedHomeBeforeBehavior(), start = raw.indexOf('<section class="connected-now"'), end = raw.indexOf('<section class="connected-browse"');
    if (start < 0 || end < 0) return before();
    const focus = homeCurrentFocus(), summary = month === 5 && !focus.confirmed ? focus.body.split(/(?<=[.!?])\s+/)[0] : focus.body;
    const hero = `<section class="connected-now eng-story" aria-label="What’s going on"><div class="connected-summary"><div class="home-summary connected-summary-intro"><div class="home-summary-heading"><div class="home-month-eyebrow">${month === 0 || focus.confirmed ? 'What matters now' : 'Likely around now'}</div><h1>${focus.title}</h1></div><span class="home-summary-art" aria-hidden="true">${homeMonthArt(month)}</span><p class="heroanswer">${summary}</p><div class="home-summary-spectrum" aria-hidden="true">${TOPICS.map(([topic]) => `<span style="background:${YEAR_PALETTES[topic].bg}"></span>`).join('')}</div></div></div></section>`;
    return raw.slice(0, start) + engineHomeSection() + hero + raw.slice(end);
  };
})();
