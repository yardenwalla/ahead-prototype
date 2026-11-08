/* Ahead · Home cards v4 (preview)
   The card library from the Home cards doc (v4.1), with three changes from the Nov 5 review:
   1. Must-knows wait for the parent: a safety or feeding must-know that went live while they were away
      still shows (for up to 4 weeks) until they've seen it. Checkups show from 2 weeks before.
   2. The category tiles are live: each says where the baby is now in a few words.
   3. Cards carry their own one-tap answers ("Already rolling" / "Not yet"), so a card can learn
      something and change on the spot, without a separate question.
   Rules: one idea per card, titles 8 words at most, bodies 25 words at most, worded true either way
   when we don't know. At most 2 "now" and 2 "coming up", one per category, one safety card. */
(function () {
  if (typeof window.render !== 'function') return;
  const DAY = 864e5;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  /* ---------- the baby's state, from the app's own answers ---------- */
  const store = () => { try { return JSON.parse(localStorage.getItem('ahead-home2:' + journeyKey())) || {}; } catch (e) { return {}; } };
  const save = st => { try { localStorage.setItem('ahead-home2:' + journeyKey(), JSON.stringify(st)); } catch (e) {} };
  const daysSince = iso => iso ? Math.floor((NOW - parse(iso)) / DAY) : null;

  /* ---------- use what the app already knows (no new questions) ---------- */
  // A first saved in Memories ("Rolls over", "Crawling", "First tooth") counts as the parent telling us.
  const MEM = [['pulling', /pull(s|ing|ed)? (up|to stand)|stands? (up|holding|with)|cruis/i], ['crawling', /crawl|scoot/i], ['sitting', /sits?( up)? without|sitting (up|alone|on)|sits alone/i], ['rolling', /roll/i], ['tooth', /tooth|teeth/i]];
  function memoryFirsts() {
    const out = {};
    try {
      const recs = journeyData().records.filter(r => r.type === 'milestone' && r.status === 'attended');
      const skills = typeof journeySkills === 'function' ? journeySkills() : [];
      for (const r of recs) {
        const text = (r.title || '') + ' ' + ((skills.find(x => x.key === r.skillKey) || {}).label || '');
        for (const [k, re] of MEM) if (re.test(text)) { if (!out[k] || r.date < out[k]) out[k] = r.date; break; }
      }
    } catch (e) {}
    return out;
  }
  const RANK = ['none', 'rolling', 'sitting', 'crawling', 'pulling'];
  function syncFromApp() {
    const mf = memoryFirsts(), a = answers; let changed = false;
    a.stageDates = a.stageDates || {};
    const cur = a.pullUp === 'Yes' ? 'pulling' : a.crawl === 'Yes' ? 'crawling' : a.sit === 'Yes' ? 'sitting' : a.roll === 'Yes' ? 'rolling' : 'none';
    let best = null; for (const k of ['pulling', 'crawling', 'sitting', 'rolling']) if (mf[k]) { best = k; break; }
    if (best && RANK.indexOf(best) > RANK.indexOf(cur)) {
      if (best === 'pulling') { a.pullUp = 'Yes'; a.crawl = a.crawl === 'Yes' ? 'Yes' : a.crawl; }
      if (best === 'crawling') a.crawl = 'Yes';
      if (best === 'sitting') a.sit = 'Yes';
      if (['rolling', 'sitting', 'crawling', 'pulling'].includes(best) && a.roll !== 'Yes' && mf.rolling) a.roll = 'Yes';
      if (best === 'rolling') a.roll = 'Yes';
      a.stageDates.movement = mf[best]; changed = true;
      const st = store(); if (best === 'sitting') { st.sitAt = mf[best]; save(st); }
    }
    if (mf.tooth && a.tooth !== 'Yes') { a.tooth = 'Yes'; const st = store(); st.toothAt = mf.tooth; delete st.toothNo; save(st); changed = true; }
    if (a.twoNaps === 'Yes') { const st = store(); if (!st.napsAt) { st.napsAt = iso(NOW); save(st); } }
    if (changed && typeof persist === 'function') persist();
  }
  // Steps ticked in Safety's checklist count as done on Home, and the other way round.
  const safetyDone = id => { try { return ['done', 'na'].includes((journeyData().checks.safetyHome || {})[id]); } catch (e) { return false; } };
  function tickSafety(ids) { try { const data = journeyData(); data.checks.safetyHome = Object.assign({}, data.checks.safetyHome || {}); ids.forEach(id => { if (!data.checks.safetyHome[id]) data.checks.safetyHome[id] = 'done'; }); saveJourneyData(data); } catch (e) {} }
  // Born early: cards follow adjusted age, except Health (checkups and shots follow the birthday).
  const adjustedDays = () => (profile.early && profile.due && (typeof ageMode !== 'function' || ageMode('dev') !== 'birthday')) ? Math.floor((NOW - parse(profile.due)) / DAY) : null;
  // Places that don't change their clocks
  const noDst = (() => { try { return ['America/Phoenix', 'Pacific/Honolulu', 'America/Puerto_Rico'].includes(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch (e) { return false; } })();

  function state() {
    syncFromApp();
    const st = store(), a = answers || {}, dob = parse(profile.dob);
    const d = Math.floor((NOW - dob) / DAY);
    const feed = profile.feed === 'Formula' ? 'formula' : profile.feed === 'Both' ? 'both' : profile.feed === 'Breast milk' ? 'breast' : 'unknown';
    const sd = a.stageDates || {};
    let move = null;
    if (a.pullUp === 'Yes') move = 'pulling';
    else if (a.crawl === 'Yes') move = 'crawling';
    else if (a.sit === 'Yes' && !(a.roll === 'Yes')) move = 'sitting';
    else if (a.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(a.rollDirection)) move = a.sit === 'Yes' ? 'sitting' : 'rolling';
    else if (a.rollDirection === 'Not yet' || a.rollDirection === 'Trying to roll') move = 'none';
    // A "not yet" for the next step: rolling done, crawling Not yet, etc.
    const notYet = { rolling: move === 'none', crawling: a.crawl === 'Not yet' && !['crawling', 'pulling'].includes(move), pulling: a.pullUp === 'Not yet' && move !== 'pulling' };
    const moveAt = (move === 'sitting' && st.sitAt) || sd.movement || null;
    const food = typeof foodStage === 'function' ? foodStage() : 'preparing';
    const assumed = typeof foodAssumed === 'function' && foodAssumed();   // the app guessing by age isn't the parent telling us
    const start = !assumed && typeof foodStartDate === 'function' && food !== 'preparing' ? foodStartDate() : null;
    const solids = start ? 'started' : (a.solids === 'Not yet' || st.solidsNo) ? 'notyet' : null;
    const solidsAt = st.solidsToldAt || (sd.food) || (a.solidsStart) || null;
    return {
      d, dBirth: d, dAdj: adjustedDays(), feed, date: new Date(NOW), birth: dob, n: name(), p: babyPronouns(),
      move, notYet, moveAt: moveAt ? daysSince(moveAt) : null,
      swaddle: a.swaddleStopped === 'Yes' ? 'sack' : a.neverSwaddled === 'Yes' ? 'never' : null,
      solids, solidsDays: start ? Math.floor((NOW - start) / DAY) : null, solidsTold: solidsAt ? daysSince(solidsAt) : null,
      solidsNoAt: st.solidsNo ? daysSince(st.solidsNo) : null,
      tooth: a.tooth === 'Yes' ? true : st.toothNo ? false : null, toothAt: st.toothAt ? daysSince(st.toothAt) : null, toothNoAt: st.toothNo ? daysSince(st.toothNo) : null,
      naps: a.twoNaps === 'Yes' ? 2 : a.twoNaps === 'Stay' ? 3 : null, napsAt: st.napsAt ? daysSince(st.napsAt) : null,
      opened: st.opened || {}, seen: st.seen || {}, snooze: st.snooze || {}, views: st.views || {}, lastNewAt: st.lastNewAt || 0, firstDay: st.firstDay || iso(NOW), answeredAt: st.answeredAt || 0, q: !peeking && typeof homeQuestion === 'function' ? homeQuestion() : null
    };
  }
  // Pages a parent has opened (only the few that unlock a Home card), and whether Childcare has a plan.
  const VISIT_KEY = () => 'ahead-home2-visited:' + journeyKey();
  const visited = id => { try { return (JSON.parse(localStorage.getItem(VISIT_KEY())) || {})[id] || 0; } catch (e) { return 0; } };
  const noteVisit = p => { const m = /^chg:Out and about:d:(fly|carry)$/.exec(p || ''); if (!m) return; try { const v = JSON.parse(localStorage.getItem(VISIT_KEY())) || {}; v[m[1]] = Date.now(); localStorage.setItem(VISIT_KEY(), JSON.stringify(v)); } catch (e) {} };
  const childcareSet = () => { try { return !!JSON.parse(localStorage.getItem('ahead-childcare-started')) || Object.keys(JSON.parse(localStorage.getItem('ahead-childcare-shortlist')) || {}).length > 0; } catch (e) { return false; } };
  const at = (s, d) => Object.assign({}, s, { d, date: new Date(s.birth.getTime() + d * DAY) });
  const mo = s => s.d / 30.44, month_ = s => s.date.getMonth() + 1;
  const breast = s => s.feed === 'breast' || s.feed === 'both';
  const moved = (s, ...lv) => lv.includes(s.move);
  const opened = (s, id) => !!s.opened[id];

  /* ---------- words: pronouns and verb pairs ---------- */
  function w(s, str) {
    const p = s.p, they = p.s === 'they';
    return str.replace(/\{N\}/g, s.n)
      .replace(/\{Hes\}/g, they ? 'They’re' : (p.s === 'he' ? 'He’s' : 'She’s')).replace(/\{hes\}/g, they ? 'they’re' : p.s + '’s')
      .replace(/\{He\}/g, p.s[0].toUpperCase() + p.s.slice(1)).replace(/\{he\}/g, p.s).replace(/\{him\}/g, p.o).replace(/\{his\}/g, p.p).replace(/\{His\}/g, p.p[0].toUpperCase() + p.p.slice(1))
      .replace(/\{Ns\}/g, s.n + '’s')
      .replace(/\{([a-z’']+)\|([a-z’']+)\}/g, (m, a, b) => they ? b : a);
  }

  /* ---------- checkups ---------- */
  const VISITS = [[0, 'first-week', 4], [1, '1-month', 30], [2, '2-month', 61], [4, '4-month', 122], [6, '6-month', 183], [9, '9-month', 274], [12, '12-month', 365]];
  function checkupNow(s) {
    for (const [age, label, day] of VISITS) {
      const rec = typeof healthRecord === 'function' ? healthRecord(age) : null;
      if (rec && rec.status === 'attended') continue;
      const due = rec && rec.status === 'planned' ? Math.floor((parse(rec.date) - s.birth) / DAY) : day;
      if (s.d - due >= -14 && s.d - due <= 3) return { age, label, ahead: due - s.d };
    }
    return null;
  }
  const TIP = {
    'first-week': 'They’ll check {his} weight (most lose a little, then regain it by 2 weeks) and look for jaundice.',
    '1-month': 'They’ll ask how you’re doing too. It’s a good moment to say if things feel heavy.',
    '2-month': 'The first main round of vaccines. Nursing or a bottle during the shots calms most babies.',
    '4-month': 'Vaccines, and a good time to ask about sleep and when to start solids.',
    '6-month': 'Vaccines, first foods and teeth, and the flu shot if it’s the season.',
    '9-month': 'There’s a short questionnaire about what {hes} doing. Nothing to prepare: it just helps spot anything early.',
    '12-month': 'Expect a quick blood test for iron (and in many places lead), plus new vaccines.'
  };

  /* ---------- the cards ---------- */
  const C = [];
  const card = (id, cat, pri, show, title, body, o = {}) => C.push(Object.assign({ id, cat, pri, show, title, body, slot: 'now', safety: false, go: `openPage('topic:${cat}')` }, o));
  const T = x => typeof x === 'function' ? x : () => x;
  const ask = (opts) => ({ ask: opts });   // [[label, js], ...]

  // First weeks
  card('vitamin-d', 'Feeding', 1, s => breast(s) && s.d <= 28, s => s.d > 28 ? 'Vitamin D drops, every day' : 'Start vitamin D drops',
    'Breast milk is low in vitamin D, so pediatricians recommend a 400 IU drop every day, from the first days through the first year.', { must: 1, grace: 14, go: "openPage('chg:Feeding:d:vitd')", catchup: 42 });   // early weeks only: by later months parents have heard it from their pediatrician
  card('poop-colors', 'Daily rhythm', 2, s => s.d <= 7, 'Poop changes color this week',
    s => `Black and sticky at first, then green, then ${s.feed === 'breast' ? 'yellow' : 'yellow or tan'} by about day 5. That change means feeding is going well.`, { grace: 0, go: "openPage('topic:Daily rhythm')" });
  card('safe-sleep', 'Sleep', 1, s => s.d <= 21, '{N}’s safest sleep spot', 'On {his} back, in a bare crib or bassinet in your room, for at least 6 months. It can halve the risk of SIDS.',
    { safety: 1, must: 1, catchup: 30, go: "openPage('chg:Sleep:d:where')" });
  card('day-night', 'Sleep', 4, s => s.d >= 7 && s.d <= 35, 'Days and nights mixed up?', 'Common now, and it usually sorts out by 6–8 weeks. Bright days and dim, quiet night feeds help {his} body clock.', { go: "openPage('chg:Sleep:d:daynight')" });
  card('cluster', 'Feeding', 4, s => (s.d >= 10 && s.d <= 24) || (s.d >= 38 && s.d <= 48), 'Feeding nonstop? Often a growth spurt',
    s => s.feed === 'breast' ? 'Hourly feeds are common around 3 and 6 weeks, and settle in 2–3 days. Feeding more is how your body makes more.' : 'Days of extra hunger are common around 3 and 6 weeks. Follow {his} cues: it settles in 2–3 days.', { go: "openPage('chg:Feeding:d:cues')" });
  card('tummy-time', 'Development', 3, s => s.d >= 5 && s.d <= 42, 'Tummy time starts now', 'A few minutes on {his} tummy, a few times a day while {hes} awake, builds neck strength.', { go: "openPage('development-domain:2:Movement')" });
  card('formula-hour', 'Feeding', 3, s => (s.feed === 'formula' || s.feed === 'both') && s.d >= 3 && s.d <= 35, 'Leftover formula goes after an hour', 'Once {he} {starts|start} a bottle, toss what’s left within an hour, since germs grow fast.', { go: "openPage('topic:Feeding')" });
  card('first-bottle', 'Feeding', 4, s => s.feed === 'breast' && s.d >= 21 && s.d <= 42, 'A first bottle, if you’ll ever need one', '3 to 6 weeks is the easiest time, once nursing is going well. Babies who don’t try one early can resist it later.', { go: "openPage('chg:Feeding:d:bottles')" });
  card('crying-peak', 'Sleep', 4, s => s.d >= 35 && s.d <= 63, 'The fussiest weeks: they ease by 3–4 months', 'Crying usually peaks around 6–8 weeks, and some evenings nothing works. That isn’t you. At your limit, put {him} down safely and step away.', { go: "openPage('chg:Sleep:d:crying')" });
  // 6 weeks to 4 months
  card('routine', 'Sleep', 3, s => s.d >= 42 && s.d <= 70, 'Nights start to stretch: add a bedtime routine', 'Bath, feed, song: a short routine in the same order helps that longer stretch land at night instead of the afternoon.', { catchup: 90, go: "openPage('chg:Sleep:d:routine')" });
  card('fewer-poops', 'Daily rhythm', 4, s => s.feed === 'breast' && s.d >= 42 && s.d <= 90, 'Days without a poop can be normal', 'After about 6 weeks, some breastfed babies go days between poops. Wet diapers, 6 or more a day, tell you {hes} getting enough.', { go: "openPage('topic:Daily rhythm')" });
  card('swaddle', 'Safety', 1, s => s.d >= 49 && s.d <= 120 && !s.swaddle && !moved(s, 'rolling', 'sitting', 'crawling', 'pulling'), 'If you swaddle: when to stop',
    'Rolling usually starts at 4–6 months. At the first signs of trying, switch to a sleep sack with arms free.',
    Object.assign({ grace: 14, safety: 1, must: 1, go: "openPage('chg:Sleep:d:swaddleoff')" }, ask([['In a sleep sack now', "setAnswer('swaddleStopped','Yes')"], ['We don’t swaddle', "setAnswer('neverSwaddled','Yes')"]])));
  card('swaddle-now', 'Safety', 1, s => !s.swaddle && moved(s, 'rolling', 'sitting', 'crawling', 'pulling') && s.d <= 180, s => moved(s, 'rolling') ? '{Ns} rolling: time to stop swaddling' : 'Time to stop swaddling',
    'If {hes} still swaddled, switch to a sleep sack with arms free tonight. A swaddled baby who rolls can’t push up.',
    Object.assign({ fromAnswer: 1, safety: 1, must: 1, go: "openPage('chg:Sleep:d:swaddleoff')" }, ask([['In a sleep sack now', "setAnswer('swaddleStopped','Yes')"], ['We don’t swaddle', "setAnswer('neverSwaddled','Yes')"]])));
  card('distracted', 'Feeding', 4, s => s.d >= 90 && s.d <= 135, 'Suddenly pulling off to look around?', 'Common around 3–5 months: everything is more interesting than milk. A quiet, dim room helps.', { go: "openPage('chg:Feeding:d:cues')" });
  card('iron', 'Feeding', 3, s => breast(s) && (profile.early ? s.d >= 28 : s.d >= 100) && s.d <= 122 && !(typeof healthRecord === 'function' && healthRecord(4) && healthRecord(4).status === 'attended'), 'Ask about iron at the 4-month checkup',
    s => s.feed === 'breast' ? 'Pediatricians recommend iron drops for breastfed babies from 4 months until iron-rich foods are going well. A quick question at this visit.' : 'For mostly breastfed babies, pediatricians recommend iron drops from 4 months until iron-rich foods are going well. Worth asking.', { go: "openPage('health-visit:4')" });
  card('four-month', 'Sleep', 3, s => s.d >= 100 && s.d <= 140, 'More waking? Common around 4 months', 'More waking for a few weeks is common now. It’s {his} sleep maturing, not something you broke.', { catchup: 150, go: "openPage('chg:Sleep:d:regress')" });
  // Rolling
  const MOVE_ASK = (yes, key) => ask([[yes, `setAnswer('${key}','Yes')`], ['Not yet', key === 'roll' ? "setAnswer('rollDirection','Not yet')" : `setAnswer('${key}','Not yet')`]]);
  const fresh7 = (s, k) => s.notYet[k] && s.moveAt != null && s.moveAt <= 7;
  const freshNo = (s, k) => s.notYet[k] && s.moveAt != null && s.moveAt <= 28;
  card('rolling-soon', 'Safety', 1, s => s.d >= 105 && s.d <= 180 && (s.move == null || s.move === 'none'),
    s => fresh7(s, 'rolling') ? 'Rolling is coming: two quick changes' : 'Rolling, or about to? Two quick changes',
    'Usually between 4 and 6 months. Change {him} on the floor or with a hand on {him}, and sweep the floor for small things.',
    Object.assign({ safety: 1, must: 1, topic: 'move', go: "openPage('safety-stage:rolling')" }, MOVE_ASK('Already rolling', 'roll')));
  card('rolling-now', 'Safety', 1, s => moved(s, 'rolling', 'sitting') && s.moveAt != null && s.moveAt <= 28 && s.d <= 210,
    s => moved(s, 'rolling') ? 'Now that {N} rolls: gear changes' : '{Ns} on the move: gear changes',
    'The crib takes over from the bassinet, and many swings and bouncers have a rolling limit too (it’s in their instructions).', { fromAnswer: 1, safety: 1, must: 1, go: "openPage('safety-stage:rolling')", done: 1 });
  card('rolling-tummy', 'Sleep', 4, s => moved(s, 'rolling', 'sitting', 'crawling') && s.moveAt != null && s.moveAt <= 35 && s.d <= 210, 'Rolling onto {his} tummy at night?', 'Keep putting {him} down on {his} back. Once {he} {rolls|roll} both ways on {his} own, {he} can stay how {he} {lands|land}.', { go: "openPage('chg:Sleep:d:rolling')" });
  // Sitting
  card('sitting-gear', 'Daily rhythm', 3, s => (moved(s, 'sitting') && s.moveAt != null && s.moveAt <= 28) || (s.move == null && s.d >= 200 && s.d <= 240),
    s => moved(s, 'sitting') ? 'Now that {N} sits: a quick gear check' : 'Sitting up? A quick gear check',
    'Sitting on {his} own usually means the stroller’s upright seat instead of the bassinet attachment. Infant tubs often stop at sitting too.',
    { fromAnswer: 1, go: "openPage('chg:Out and about:d:stroller')" });
  // Solids
  card('first-bite', 'Feeding', 3, s => (s.d >= 150 && s.d <= 200 && s.solids !== 'started') || (s.solidsDays != null && s.solidsDays <= 45 && s.solidsTold != null && s.solidsTold <= 28 && opened(s, 'solids-1')),
    s => s.solidsDays == null ? 'Before the first bite: gagging vs choking' : 'Gagging vs choking: how to tell',
    'Gagging is loud, red-faced and normal: it’s how {he} {learns|learn}. Choking is silent. A short infant first aid video before you start helps.', { must: 1, topic: 'food', go: "openPage('chg:Feeding:d:setup')" });
  card('solids-maybe', 'Feeding', 3, s => s.d >= 176 && s.d <= 240 && s.solids !== 'started', 'Starting solids? Lead with iron', 'Iron runs low around 6 months, so meat, beans, lentils or iron-fortified oatmeal make the best first foods.',
    Object.assign({ must: 1, topic: 'food', go: "openPage('chg:Feeding:d:food')" }, ask([['Started already', "home2Solids(true)"], ['Not yet', "home2Solids(false)"]])));
  card('solids-2', 'Feeding', 2, s => s.solidsDays != null && s.solidsDays >= 0 && s.solidsDays <= 120, 'Offer peanut and egg early', 'Giving common allergens early, then keeping them in {his} week, lowers the chance of a food allergy. Severe eczema? Ask your pediatrician first.', { fromAnswer: 1, must: 1, go: "openPage('chg:Feeding:d:allergens')" });
  card('off-menu', 'Feeding', 2, s => s.solidsDays != null && s.solidsTold != null && s.solidsTold <= 70 && (opened(s, 'solids-1') || opened(s, 'solids-maybe') || s.solidsDays > 45), 'Still off the menu until 1', 'No honey, and no whole grapes, nuts or popcorn: they’re common choking risks before {his} first birthday.', { must: 1, go: "openPage('chg:Feeding:d:food')" });
  card('choking-foods', 'Feeding', 2, s => s.solidsDays != null && s.solidsTold != null && s.solidsTold <= 90 && opened(s, 'off-menu'), '', '', { must: 1, go: "openPage('chg:Feeding:d:setup')" });
  card('solids-poop', 'Daily rhythm', 4, s => s.solidsDays != null && s.solidsDays >= 5 && s.solidsDays <= 25, 'Poop changes with solids', 'Thicker, browner and smellier, sometimes the color of what {he} ate. All normal.', { go: "openPage('topic:Daily rhythm')" });
  card('solids-3', 'Feeding', 4, s => s.solidsDays != null && s.solidsDays >= 14 && s.solidsDays <= 80 && opened(s, 'solids-2'), 'A few sips of water at meals', 'Up to 4–8 oz a day, from an open or straw cup. Starting now makes leaving bottles at 12 months easier.', { go: "openPage('chg:Feeding:d:cup')" });
  card('textures', 'Feeding', 3, s => s.solidsDays != null && s.solidsDays >= 28 && mo(s) >= 7 && mo(s) <= 9.5, 'Time for lumpier food', 'Thicker textures and soft pieces {he} can pick up. Babies who move past smooth purées by about 9 months take to lumps more easily.', { go: "openPage('chg:Feeding:d:lumpy')" });
  card('solids-late', 'Feeding', 2, s => s.solids === 'notyet' && s.solidsNoAt != null && s.solidsNoAt <= 21 && mo(s) >= 8, 'Not started solids yet? An easy way in', 'Iron matters most now, so it’s worth a quick call to your pediatrician about an easy way in.', { go: "openPage('chg:Feeding:d:notready')" });
  // Moving
  card('crawl-soon', 'Safety', 1, s => s.d >= 150 && s.d <= 300 && !moved(s, 'crawling', 'pulling') && (moved(s, 'rolling', 'sitting') || s.d >= 183),
    s => fresh7(s, 'crawling') ? 'Crawling is coming: babyproof first' : 'Crawling, or close to it? Babyproof now',
    'It usually starts between 6 and 10 months. Start with stair gates, cabinet locks, outlet covers, and tall furniture strapped to the wall.',
    Object.assign({ safety: 1, must: 1, topic: 'move', go: "openPage('safety-stage:moving')" }, MOVE_ASK('Already crawling', 'crawl')));
  card('crawl-now', 'Safety', 1, s => moved(s, 'crawling') && s.moveAt != null && s.moveAt <= 42, 'Now that {N} crawls, start with the stairs', 'A gate screwed into the wall at the top, and either kind at the bottom. No stairs? This one’s done.', { fromAnswer: 1, safety: 1, must: 1, done: 1, go: "openPage('chg:Safety:d:step:gates')" });
  card('stand-soon', 'Safety', 1, s => (s.d >= 230 || (moved(s, 'crawling') && s.d >= 200)) && s.d <= 365 && s.move !== 'pulling',
    s => fresh7(s, 'pulling') ? 'Pulling up is next: mattress down first' : 'Pulling up, or close? Mattress down first',
    'Usually between 9 and 12 months. Set the crib mattress to its lowest before {he} can stand in it.',
    Object.assign({ safety: 1, must: 1, topic: 'move', go: "openPage('chg:Sleep:d:mattress')" }, MOVE_ASK('Already pulling up', 'pullUp')));
  card('stand-now', 'Safety', 1, s => moved(s, 'pulling') && s.moveAt != null && s.moveAt <= 42,
    s => opened(s, 'stand-soon') ? 'Now that {N} pulls up: the next reach' : 'Now that {N} pulls up: mattress down',
    s => opened(s, 'stand-soon') ? 'Stove knobs, cords and anything heavy at standing height are in reach now. Move them up or out of the way.' : 'Crib mattress to its lowest today, so {he} can’t climb out.', { fromAnswer: 1, safety: 1, must: 1, done: 1, go: "openPage('safety-stage:pulling')" });
  card('cruising', 'Safety', 2, s => moved(s, 'pulling') && opened(s, 'stand-now') && s.moveAt != null && s.moveAt >= 10 && s.moveAt <= 60, 'Cruising, or about to? The next reach', 'After pulling up comes walking along the furniture. Tablecloths, low shelves and anything near the coffee table’s edge come into reach next.', { safety: 1, go: "openPage('safety-stage:pulling')" });
  card('stuck-standing', 'Sleep', 4, s => moved(s, 'pulling') && s.moveAt != null && s.moveAt >= 5 && s.moveAt <= 35, 'Standing in the crib and can’t get down?', 'Very common for a few weeks. Practice bending {his} knees to sit down during the day.', { go: "openPage('chg:Sleep:d:nightwake')" });
  card('new-skills-sleep', 'Sleep', 4, s => moved(s, 'crawling') && s.moveAt != null && s.moveAt >= 3 && s.moveAt <= 24, 'New skills, more waking: it passes', 'Extra waking for a week or two is common while {he} {practices|practice}. Keeping bedtime the same helps.', { go: "openPage('chg:Sleep:d:regress')" });
  // Sleep shifts
  card('six-month-sleep', 'Sleep', 3, s => s.d >= 183 && s.d <= 215, '{His} own room is now an option', 'Where {he} {sleeps|sleep} from here is your call: the room-sharing advice covers the first 6 months.', { catchup: 215, go: "openPage('chg:Sleep:d:where')" });
  card('two-naps-soon', 'Sleep', 3, s => s.d >= 200 && s.d <= 270 && s.naps !== 2, 'Ready for two naps?', 'Between 6 and 9 months, the late nap often stops fitting, or bedtime drifts later. A week of that is the sign.',
    Object.assign({ topic: 'naps', go: "openPage('chg:Sleep:d:catnap')" }, ask([['On two naps', "home2Naps(2)"], ['Still three', "home2Naps(3)"]])));
  card('two-naps', 'Sleep', 3, s => s.naps === 2 && s.d <= 300 && s.napsAt != null && s.napsAt <= 28, 'Two naps: bedtime moves earlier', 'While {he} {adjusts|adjust}, move bedtime about 30 minutes earlier. The switch takes a week or two.', { fromAnswer: 1, go: "openPage('chg:Sleep:d:catnap')" });
  card('separation', 'Daily rhythm', 4, s => s.d >= 240 && s.d <= 290, 'Clingier lately? It’s a good sign', 'Common from about 8 months, and it means {he} {knows|know} you. A short, same-every-time goodbye helps.', { catchup: 300, go: "openPage('topic:Development')" });
  // Teeth
  card('teething', 'Daily rhythm', 4, s => s.d >= 150 && s.d <= 240 && s.tooth !== true, 'Teething can start weeks before a tooth', 'Drool and chewing often start weeks before the first tooth, usually between 6 and 10 months. A chilled (not frozen) teething ring helps.',
    Object.assign({ topic: 'tooth', catchup: 240, go: "openPage('chg:Daily rhythm:d:gums')" }, ask([['Has a tooth', "home2Tooth(true)"], ['Not yet', "home2Tooth(false)"]])));
  card('first-tooth', 'Daily rhythm', 3, s => s.tooth === true && s.toothAt != null && s.toothAt <= 28, 'Teeth are here: time to brush', 'Brush twice a day with a rice-grain smear of fluoride toothpaste, the last time after the bedtime feed.', { fromAnswer: 1, go: "openPage('chg:Daily rhythm:d:teeth')" });
  // From when first teeth are most common: brushing starts with the first tooth, so the card is true either way.
  card('tooth-soon', 'Daily rhythm', 4, s => s.d >= 183 && s.d <= 300 && s.tooth !== true, 'First tooth in, or on the way?', 'Brushing starts with the first tooth: a rice-grain smear of fluoride toothpaste, twice a day.', { topic: 'tooth', go: "openPage('chg:Daily rhythm:d:t:teeth:3')" });
  // Every baby's first dentist visit is due by 1, tooth or not.
  card('dentist', 'Health', 4, s => (s.tooth === true && opened(s, 'first-tooth') && s.toothAt >= 10 && s.toothAt <= 60) || (s.d >= 320 && s.d <= 365), 'The first dentist visit comes early', 'Book it once the first tooth is in, and by {his} first birthday. They’ll check {his} teeth and show you how to brush.', { go: "openPage('chg:Daily rhythm:d:teeth')" });
  // Round 2 (Nov 7): timely discoveries, new options and cards from what the parent does in Ahead.
  card('solids-approach', 'Feeding', 4, s => s.d >= 160 && s.d <= 190 && s.solids !== 'started', 'How to start solids is your call', 'Spoon-feeding, soft finger foods or a bit of both all work, so pick what suits your family.', { go: "openPage('chg:Feeding:d:approach')" });
  card('sleep-training', 'Sleep', 4, s => s.d >= 125 && s.d <= 180, 'Sleep training is an option, not a must', 'Some families try it from about 4–6 months, and many never do. Either way is fine.', { go: "openPage('sleep-stage:prepare')" });
  card('flying', 'Out and about', 3, s => visited('fly') && visited('fly') >= Date.now() - 21 * DAY, 'Flying soon? Feed at takeoff and landing', 'Sucking helps {his} ears adjust to the pressure change.', { go: "openPage('chg:Out and about:d:fly')" });
  card('carrier', 'Out and about', 4, s => visited('carry') && s.d >= 120 && s.d <= 170, 'Ready to face out in the carrier?', 'Once {his} head control is strong, check your carrier’s instructions, since many allow facing out around now.', { go: "openPage('chg:Out and about:d:carry')" });
  card('fever-rule', 'Health', 2, s => s.d >= 3 && s.d <= 45, 'One rule for the first 3 months', 'A temperature of 100.4°F or more means calling your pediatrician, day or night. Save the after-hours number now.', { grace: 14, must: 1, go: "openPage('topic:Health')" });
  card('pacifier', 'Sleep', 3, s => s.d >= (s.feed === 'formula' ? 7 : 21) && s.d <= 49, 'A pacifier at sleep time helps', 'Offering one for naps and bedtime lowers SIDS risk, and it’s fine if it falls out.', { go: "openPage('chg:Sleep:d:where')" });
  card('flat-spots', 'Sleep', 4, s => s.d >= 21 && s.d <= 75, 'Switch which end {his} head goes', 'Alternating each night, plus tummy time, helps prevent a flat spot on the back of {his} head.', { go: "openPage('chg:Sleep:d:where')" });
  card('childcare-waitlist', 'Childcare', 3, s => s.d >= 28 && s.d <= 90 && !childcareSet(), 'Need childcare later? Look now', 'Infant spots can have waitlists of several months, so it helps to start looking early.', { go: "openPage('topic:Childcare')" });
  card('no-cereal', 'Feeding', 4, s => s.d >= 90 && s.d <= 130, 'No cereal in the bottle', 'It doesn’t help babies sleep longer, and it can cause choking and overfeeding.', { go: "openPage('chg:Feeding:d:signs')" });
  card('talk-back', 'Development', 4, s => s.d >= 50 && s.d <= 90, 'Talk back when {he} {coos|coo}', 'Pause after each coo so {he} can answer: it’s {his} first conversation.', { go: "openPage('development-domain:2:Talking')" });
  card('drowsy-awake', 'Sleep', 4, s => s.d >= 115 && s.d <= 165, 'Try putting {him} down drowsy but awake', 'Settling in the crib on {his} own now makes night wakings easier later.', { go: "openPage('chg:Sleep:d:routine')" });
  card('baby-signs', 'Development', 4, s => s.d >= 210 && s.d <= 280, 'Try “more” and “all done” at meals', 'Sign them as you say the words, and {he} may sign back before {he} {talks|talk}.', { go: "openPage('chg:Development:d:signs')" });
  card('barefoot', 'Daily rhythm', 4, s => (moved(s, 'pulling') || s.d >= 290) && s.d <= 350, 'Barefoot is best indoors', 'Bare feet help {him} balance while cruising and walking. Save shoes for outside.', { go: "openPage('chg:Daily rhythm:d:steps')" });
  card('comfort-object', 'Sleep', 4, s => s.d >= 340 && s.d <= 366, 'A lovey can join the crib at 1', 'From the first birthday, one small soft toy is fine. Until then, keep the crib bare.', { go: "openPage('chg:Sleep:d:where')" });
  card('naps-three', 'Sleep', 4, s => s.d >= 120 && s.d <= 165 && s.naps !== 2, 'Naps are settling into three a day', 'About 2 hours awake between them is typical now, so a yawn around then is your cue.', { go: "openPage('chg:Sleep:s:2')" });
  card('new-foods', 'Feeding', 4, s => s.solidsDays != null && s.solidsDays >= 45 && s.d >= 255 && s.d <= 345, 'A “no” to a new food isn’t final', 'It can take 10 or more tries before a baby takes to a food, so keep offering it calmly.', { go: "openPage('chg:Feeding:d:food')" });
  // Health
  card('checkup', 'Health', 2, s => !!checkupNow(s), s => { const c = checkupNow(s); return c.label[0].toUpperCase() + c.label.slice(1) + ' checkup: what to know'; }, s => TIP[checkupNow(s).label],
    { slot: s => checkupNow(s) && checkupNow(s).ahead >= 2 ? 'soon' : 'now', go: s => `openPage('health-visit:${checkupNow(s).age}')`, key: s => { const v = checkupNow(s); return v ? 'checkup:' + v.label + (v.ahead <= 3 ? ':week' : '') : 'checkup'; } });
  card('rsv', 'Health', 2, s => [10, 11, 12, 1, 2, 3].includes(month_(s)) && s.d <= 243 && [4, 5, 6, 7, 8, 9].includes(s.birth.getMonth() + 1), 'Born before RSV season? Ask about the shot', 'It’s the top reason babies end up in the hospital. An antibody shot protects babies under 8 months through their first season.', { go: "openPage('topic:Health')"});
  card('flu', 'Health', 3, s => [9, 10, 11, 12, 1, 2].includes(month_(s)) && s.d >= 183, 'Flu season: {his} first shot can start', '{His} first season takes two doses, 4 weeks apart, so starting early means {hes} covered sooner.', { go: "openPage('topic:Health')" });
  // Gear, outings, seasons
  card('sunscreen', 'Out and about', 4, s => s.d >= 180 && s.d <= 230 && month_(s) >= 4 && month_(s) <= 9, 'Sunscreen is fine to use now', 'SPF 30 or more on skin you can’t cover. Shade and a hat still come first.', { go: "openPage('chg:Daily rhythm:d:sun')" });
  card('hot-days', 'Out and about', 4, s => [6, 7, 8].includes(month_(s)) && s.date.getDate() <= 14, s => s.d < 183 ? 'Hot days: milk, not water' : 'Hot days: extra milk and a few sips',
    s => s.d < 183 ? 'Under 6 months, extra milk feeds are all {he} {needs|need}, even on the hottest days. Water can wait.' : 'More milk feeds than usual, plus a few sips of water from a cup at meals.', { go: "openPage('chg:Out and about:d:weather')" });
  card('cold-car-seat', 'Out and about', 4, s => [11, 12, 1].includes(month_(s)) && s.date.getDate() <= 14, 'Cold days: coats off in the car seat', 'Puffy coats leave the straps too loose in a crash. Buckle {him} in thin layers, then put the coat or a blanket over the straps.', { go: "openPage('chg:Out and about:d:car')" });
  card('car-seat', 'Out and about', 1, s => s.d >= 270 && s.d <= 305, 'Next car seat: still facing back', 'In an infant seat? Many babies outgrow it by height before weight. The next seat still faces backward, often until age 2 or beyond.', { safety: 1, must: 1, catchup: 345, go: "openPage('chg:Out and about:d:car')" });
  card('milk12', 'Feeding', 3, s => s.d >= 320 && s.d <= 370, 'At 12 months: whole milk from a cup',
    s => s.feed === 'formula' ? 'Whole cow’s milk can replace formula straight away, with no need for toddler formula. About 2 cups a day is plenty.'
      : s.feed === 'both' ? 'Formula can switch to whole cow’s milk, about 2 cups a day, and nursing can carry on as long as you both want.'
      : 'Whole cow’s milk can join meals, about 2 cups a day, and nursing can carry on as long as you both want.', { slot: 'soon', go: "openPage('chg:Feeding:d:milk12')" });
  card('bottle-cup', 'Feeding', 3, s => (s.feed === 'formula' || s.feed === 'both') && s.d >= 335 && (opened(s, 'milk12') || s.d >= 350), 'Bottles to cups, one at a time', 'Swap one bottle a day for a cup, keep the bedtime one for last, and aim to be off bottles by about 18 months.', { go: "openPage('chg:Feeding:d:cup')" });
  card('clocks', 'Sleep', 4, s => s.d >= 60 && dstWeek(s), 'Clocks change this weekend', 'Shift naps and bedtime by about 15 minutes a day over a few days, and it barely shows.', { go: "openPage('topic:Sleep')" });
  function dstWeek(s) {
    const y = s.date.getFullYear(), sun = (m, n) => { const d = new Date(y, m - 1, 1); d.setDate(1 + (7 - d.getDay()) % 7 + 7 * (n - 1)); return d; };
    return [sun(3, 2), sun(11, 1)].some(c => { const k = (c - s.date) / DAY; return k >= 0 && k <= 6; });
  }


  /* ---------- copy v6: every word comes from HOME_COPY ---------- */
  const K = window.HOME_COPY || {};
  const cp = (key, visit) => s => (K[key] || '').replace(/\{visit\}/g, visit ? visit(s) : '');
  C.forEach(c => { if (K[c.id + ':t']) c.title = cp(c.id + ':t'); if (K[c.id]) c.body = cp(c.id); });
  const set = (id, title, body) => { const c = C.find(x => x.id === id); if (title) c.title = title; if (body) c.body = body; };
  const pickK = f => s => K[f(s)] || '';
  set('vitamin-d', pickK(s => s.d > 28 ? 'vitamin-d:t-late' : 'vitamin-d:t'));
  set('poop-colors', null, pickK(s => s.feed === 'breast' ? 'poop-colors:breast' : 'poop-colors'));
  set('cluster', null, pickK(s => s.feed === 'breast' ? 'cluster:breast' : 'cluster'));
  set('swaddle-now', pickK(s => moved(s, 'rolling') ? 'swaddle-now:t' : 'swaddle-now:t-other'));
  set('iron', pickK(s => profile.early ? 'iron:t-early' : 'iron:t'), pickK(s => profile.early ? 'iron:early' : s.feed === 'breast' ? 'iron:breast' : 'iron'));
  set('rolling-soon', pickK(s => fresh7(s, 'rolling') ? 'rolling-soon:t' : 'rolling-soon:t-cond'));
  set('crawl-soon', pickK(s => fresh7(s, 'crawling') ? 'crawl-soon:t' : 'crawl-soon:t-cond'));
  set('stand-soon', pickK(s => fresh7(s, 'pulling') ? 'stand-soon:t' : 'stand-soon:t-cond'), pickK(s => fresh7(s, 'pulling') ? 'stand-soon' : 'stand-soon:cond'));
  set('crawl-now', null, pickK(s => opened(s, 'crawl-soon') ? 'crawl-now' : 'crawl-now:first'));
  set('rolling-now', pickK(s => moved(s, 'rolling') ? 'rolling-now:t' : 'rolling-now:t-other'));
  set('sitting-gear', pickK(s => moved(s, 'sitting') ? 'sitting-gear:t' : 'sitting-gear:t-cond'));
  set('first-bite', pickK(s => s.solidsDays == null ? 'first-bite:t' : 'first-bite:t-after'));
  set('stand-now', pickK(s => opened(s, 'stand-soon') ? 'stand-now:t-after' : 'stand-now:t'), pickK(s => opened(s, 'stand-soon') ? 'stand-now:after' : 'stand-now'));
  set('hot-days', pickK(s => s.d < 183 ? 'hot-days:t' : 'hot-days:t-older'), pickK(s => s.d < 183 ? 'hot-days' : 'hot-days:older'));
  set('milk12', null, pickK(s => K['milk12:' + s.feed] ? 'milk12:' + s.feed : 'milk12'));
  set('checkup', s => (K[checkupNow(s).ahead >= 2 ? 'checkup:t-soon' : 'checkup:t'] || '').replace('{visit}', checkupNow(s).label), s => { const v = checkupNow(s), base = (profile.early && K['checkup:' + v.label + ':early']) || K['checkup:' + v.label + ':' + s.feed] || K['checkup:' + v.label] || ''; let n = 0; try { n = ((journeyData().questions || {})[v.age] || []).length; } catch (e) {} return n ? base + ` You have ${n} question${n === 1 ? '' : 's'} saved.` : base; });

  /* ---------- every card opens a page that continues it ---------- */
  const ROUTE = {
    'poop-colors': "openPage('chg:Daily rhythm:d:t:diapers:0')", 'fewer-poops': "openPage('chg:Daily rhythm:d:t:diapers:1')", 'solids-poop': "openPage('chg:Daily rhythm:d:t:diapers:2')",
    'newborn-normal': "openPage('chg:Daily rhythm:d:t:skin:0')", 'tub-baths': "openPage('chg:Daily rhythm:d:t:bath:1')",
    teething: "openPage('chg:Daily rhythm:d:t:teeth:2')", 'first-tooth': "openPage('chg:Daily rhythm:d:t:teeth:3')", dentist: "openPage('chg:Daily rhythm:d:t:teeth:3')",
    sunscreen: "openPage('chg:Daily rhythm:d:t:sun:2')",
    separation: "openPage('development-domain:9:Social')",
    rsv: "openPage('home2:rsv')", flu: "openPage('home2:flu')", clocks: "openPage('home2:clocks')",
    reaching: "openPage('safety-stage:reaching')", 'rolling-soon': "openPage('safety-stage:reaching')", 'rolling-now': "openPage('safety-stage:reaching')",
    'first-bottle': "openPage('chg:Feeding:d:pump')", 'bottle-cup': "openPage('chg:Feeding:d:after')", 'solids-1': "openPage('chg:Feeding:d:tray')", 'solids-maybe': "openPage('chg:Feeding:d:tray')",
    'off-menu': "openPage('chg:Feeding:d:tray')", 'solids-late': "openPage('chg:Feeding:d:signs')", cluster: "openPage('chg:Feeding:d:nursing')"
  };
  C.forEach(c => { if (ROUTE[c.id]) c.go = ROUTE[c.id]; });
  // Cards are notifications, not a form: no buttons on them. Home learns from its one top question, Memories,
  // Development's "Seen it", and the Feeding and Sleep stages. Opening or dismissing a card clears it.
  C.forEach(c => { delete c.ask; delete c.done; });
  // A card about a big change that's still ahead opens that change's Timeline page (one page, two ways in).
  const TIMELINE = { 'rolling-soon': 'roll', 'crawl-soon': 'crawl', 'stand-soon': 'pull', 'four-month': 'regress', 'crying-peak': 'crying', separation: 'sep', 'car-seat': 'carseat', milk12: 'milk' };
  C.forEach(c => { const t = TIMELINE[c.id]; if (!t) return; const base = c.go; c.go = s => (typeof timelineChangeLive === 'function' && timelineChangeLive(t)) ? `openPage('chg:Timeline:c:${t}')` : (typeof base === 'function' ? base(s) : base); });

  /* ---------- age basis and Safety's checklist ---------- */
  // Development and sleep cards follow a preemie's adjusted age; the first-days basics and leave planning follow the birthday.
  const BIRTH_AGE = c => c.cat === 'Health' || ['iron', 'vitamin-d', 'poop-colors', 'safe-sleep', 'formula-hour', 'first-bottle', 'pacifier', 'childcare-waitlist'].includes(c.id);
  const DONE_IN_SAFETY = { 'rolling-soon': ['small', 'changing'], reaching: ['small'], 'crawl-soon': ['gates', 'storage', 'outlets', 'anchor'], 'crawl-now': ['gates'] };
  const DONE_ANSWER = { 'stand-soon': () => answers.mattressLowest === 'Yes', 'stand-now': () => answers.mattressLowest === 'Yes' && !0, 'sitting-gear': () => answers.mattressLowered === 'Yes' || answers.mattressLowest === 'Yes' };
  const doneElsewhere = (c, s) => (DONE_IN_SAFETY[c.id] && DONE_IN_SAFETY[c.id].every(safetyDone)) || (c.id === 'stand-soon' && DONE_ANSWER['stand-soon']()) || (c.id === 'stand-now' && !opened(s, 'stand-soon') && answers.mattressLowest === 'Yes') || (c.id === 'sitting-gear' && DONE_ANSWER['sitting-gear']()) || (c.id === 'clocks' && noDst);
  const forCard = (c, s) => (s.dAdj != null && !BIRTH_AGE(c)) ? at(s, s.dAdj) : s;

  /* ---------- picking ---------- */
  let peeking = false;   // working out Home's cards before its question is chosen
  const KEY = (c, s) => c.key ? c.key(s) : c.id;
  function wasTrue(c, s, within, step) {
    for (let back = step; back <= within; back += step) { const d = s.d - back; if (d < 0) break; try { if (c.show(at(s, d))) return true; } catch (e) {} }
    return false;
  }
  // A calm Home: at most one card per screen that asks a parent to be careful.
  const CAUTION = ['fever-rule', 'off-menu', 'choking-foods', 'first-bite', 'cold-car-seat', 'hot-days'];
  // Seasonal and checkup cards keep their own timing; they're never brought forward.
  const SEASONAL = ['checkup', 'hot-days', 'cold-car-seat', 'clocks', 'sunscreen', 'flu', 'rsv', 'flying'];
  const caution = c => !!c.safety || CAUTION.includes(c.id);
  function pick(s) {
    const first = s.firstDay === iso(NOW);
    // While Home's one question is about a topic, cards on that topic wait for the answer.
    const qTopic = qTopicOf(s);
    const live = C.filter(c => isLive(c, s, first, qTopic));
    return arrange(s, live, first);
  }
  const qTopicOf = s => s.q === 'movement' || s.q === 'crawl' || s.q === 'stand' ? 'move' : s.q === 'food' || s.q === 'food-progress' ? 'food' : s.q === 'naps' ? 'naps' : s.q === 'tooth' ? 'tooth' : null;
  function isLive(c, s, first, qTopic) {
    {
      if (c.once !== false && s.opened[KEY(c, s)] != null) return false;
      const sk = s.snooze[KEY(c, s)]; if (sk != null && Date.now() - sk < 21 * DAY) return false;
      const vw = s.views[KEY(c, s)]; if (vw && vw.n >= (c.must ? 1e9 : 2)) return false;
      if (c.id === 'checkup' && !checkupNow(s)) return false;
      if (c.topic && c.topic === qTopic) return false;
      if (doneElsewhere(c, s)) return false;
      const sc = forCard(c, s);
      let ok = false; try { ok = c.show(sc); } catch (e) {}
      if (ok) return true;
      if (c.must && s.seen[c.id] == null && wasTrue(c, sc, c.grace != null ? c.grace : 7, 1)) return true;      // waits briefly for the parent, never past its moment
      return !!(first && c.catchup && sc.d <= c.catchup && wasTrue(c, sc, 400, 7));
    }
  }
  function arrange(s, live, first) {
    const leaving = c => { const sc = forCard(c, s); try { return !c.show(at(sc, sc.d + 4)); } catch (e) { return true; } };
    // A card the parent just unlocked with an answer leads, so the answer visibly does something.
    const justAnswered = Date.now() - s.answeredAt < 12 * 3600e3, pri = c => c.fromAnswer && justAnswered ? 0 : c.pri;
    const tiredOf = c => c.must && (s.views[KEY(c, s)] || {}).n >= 2 ? 1 : 0;
    live.sort((a, b) => (tiredOf(a) - tiredOf(b)) || (pri(a) - pri(b)) || (leaving(b) - leaving(a)) || ((s.seen[a.id] != null) - (s.seen[b.id] != null)) || (C.indexOf(a) - C.indexOf(b)));
    const now = [], soon = [], cats = new Set(); let safety = false;
    for (const c of live) {
      const tired = c.must && (s.views[KEY(c, s)] || {}).n >= 2;
      if (!tired && cats.has(c.cat)) continue;
      const slot = typeof c.slot === 'function' ? c.slot(s) : c.slot, box = slot === 'soon' ? soon : now;
      // No fixed cap: every must-know shows. Good-to-know cards fill in only while Home has fewer than 3.
      if (!(c.pri <= 2 || c.must) && now.length + soon.length >= 3) continue;
      if (caution(c) && safety) continue;   // one caution card per screen (safety or health rule); the next one waits
      if (tired) { if (now.length + soon.length >= 3) continue; box.push(c); safety = safety || caution(c); continue; }
      box.push(c); cats.add(c.cat); safety = safety || caution(c);
    }
    const quiet = !first && s.lastNewAt && Date.now() - s.lastNewAt >= 7 * DAY && ![...now, ...soon].some(c => s.seen[c.id] == null);
    if (quiet) {
      const ahead = C.filter(c => !c.must && !c.ask && !c.key && !SEASONAL.includes(c.id) && now.length + soon.length < 3 && s.opened[KEY(c, s)] == null && s.seen[c.id] == null && !cats.has(c.cat) && (() => { const sc = forCard(c, s); try { return !c.show(sc) && [7, 14, 21].some(k => c.show(at(sc, sc.d + k))); } catch (e) { return false; } })())
        .sort((a, b) => a.pri - b.pri || C.indexOf(a) - C.indexOf(b));
      if (ahead.length) soon.push(ahead[0]);
    }
    return { now, soon };
  }

  /* ---------- actions ---------- */
  const mark = (field, id) => { const st = store(); st[field] = st[field] || {}; st[field][id] = Date.now(); save(st); };
  // Like the old Home: opening a card clears it only once the parent has stayed on its page a few seconds, so a mis-tap doesn't lose it.
  window.home2Open = (id, go) => { const st = store(); st.pending = { id, at: Date.now() }; save(st); try { (new Function(go))(); } catch (e) { render(); } };
  function settlePending() { const st = store(); if (st.pending) { if (Date.now() - st.pending.at >= 4000) { st.opened = st.opened || {}; st.opened[st.pending.id] = Date.now(); } delete st.pending; save(st); } }
  window.home2Hide = id => { mark('opened', id); const y = scrollY; render(); scrollTo(0, y); if (typeof hubToast === 'function') hubToast('Hidden', 'It’s still in its guide if you need it.'); };
  window.home2Done = id => { mark('opened', id); if (DONE_IN_SAFETY[id]) tickSafety(DONE_IN_SAFETY[id]); if (id === 'stand-now') { answers.mattressLowest = 'Yes'; persist(); } const y = scrollY; render(); scrollTo(0, y); if (typeof hubToast === 'function') hubToast('Done', 'Nice. It’s ticked off in Safety too.'); };
  const toast = (t, b) => { if (typeof hubToast === 'function') hubToast(t, b); };
  // A "not yet" snoozes the card for 3 weeks (the toast promises we'll check back); any other answer closes it.
  const NOT_YET = /'Not yet'|home2Solids\(false\)|home2Tooth\(false\)|home2Naps\(3\)/;
  window.home2Answer = (id, js, label) => {
    if (NOT_YET.test(js)) { const st1 = store(); st1.snooze = st1.snooze || {}; st1.snooze[id] = Date.now(); if (st1.views) delete st1.views[id]; save(st1); } else mark('opened', id);
    const st0 = store(); st0.answeredAt = Date.now(); save(st0);
    try { (new Function(js))(); } catch (e) {}
    const y = scrollY; render(); scrollTo(0, y); toast('Got it', label);
  };
  window.home2Solids = yes => {
    const st = store();
    if (yes) { st.solidsToldAt = iso(NOW); delete st.solidsNo; save(st); if (typeof setFeedingStage === 'function') setFeedingStage('starting'); }
    else { st.solidsNo = iso(NOW); save(st); }
  };
  window.home2Tooth = yes => { const st = store(); if (yes) { st.toothAt = iso(NOW); delete st.toothNo; save(st); setAnswer('tooth', 'Yes'); } else { st.toothNo = iso(NOW); save(st); } };
  window.home2Naps = n => { const st = store(); st.napsAt = iso(NOW); save(st); setAnswer('twoNaps', n === 2 ? 'Yes' : 'Stay'); };
  const ANSWERED = { 'Already rolling': 'Home now shows what rolling changes.', 'Already crawling': 'Home now shows what crawling changes.', 'Already pulling up': 'Home now shows what standing changes.',
    'Not yet': 'We’ll check back in a few weeks.', 'Started already': 'Home now shows first foods.', 'In a sleep sack now': 'One less thing to change when rolling starts.', 'We don’t swaddle': 'We won’t bring swaddling up again.',
    'Has a tooth': 'Home now shows tooth care.', 'On two naps': 'Home now shows the bedtime change.', 'Still three': 'We’ll check back in a few weeks.' };

  /* ---------- markup ---------- */
  function row(c, s0) {
    const s = forCard(c, s0);
    const id = KEY(c, s), title = esc(w(s, T(c.title)(s))), body = esc(w(s, T(c.body)(s))), go = typeof c.go === 'function' ? c.go(s) : c.go;
    let tools = '';
    if (c.ask) tools = `<div class="home2-ask">${c.ask.map(([label, js]) => `<button onclick="home2Answer('${id}',&quot;${js.replace(/"/g, '&quot;')}&quot;,'${esc(ANSWERED[label] || '')}')">${esc(label)}</button>`).join('')}</div>`;
    else if (c.done) tools = `<div class="home2-ask"><button class="home2-done" onclick="home2Done('${id}')"><span aria-hidden="true"></span>Done</button></div>`;
    const inner = conceptRow({ topic: c.cat, title, body, action: `home2Open('${id}',&quot;${go.replace(/"/g, '&quot;')}&quot;)`, art: 0 }) + `<button class="brief-hide" onclick="home2Hide('${id}')" aria-label="Hide this from Home">×</button>`;
    return `<div class="brief-row brief-card home2-card" data-card="${c.id}">${inner}${tools}</div>`;
  }

  /* ---------- live category tiles ---------- */
  function tileLine(topic, s) {
    const m = mo(s);
    if (topic === 'Feeding') {
      const f = typeof foodStage === 'function' ? foodStage() : 'preparing';
      if (s.solidsDays != null) return f === 'established' ? 'Three meals a day' : f === 'textures' ? 'Thicker textures, finger foods' : `First tastes · week ${Math.max(1, Math.ceil((s.solidsDays + 1) / 7))}`;
      return m >= 6 ? 'Milk, and solids when ready' : m >= 4 ? 'Getting ready for solids' : s.feed === 'formula' ? 'Formula feeds' : s.feed === 'both' ? 'Breast milk and formula' : s.feed === 'breast' ? 'Breast milk feeds' : 'Milk feeds';
    }
    if (topic === 'Sleep') return s.naps === 2 ? 'Two naps, longer nights' : m < 1.5 ? 'Short sleeps around the clock' : m < 3 ? 'One longer stretch at night' : m < 7 ? 'Regular naps, a set bedtime' : m < 9 ? 'Moving toward two naps' : 'Usually two naps by now';
    if (topic === 'Safety') return moved(s, 'pulling') ? 'Pulling up: furniture and the stove' : moved(s, 'crawling') ? 'Crawling: gates and locks' : moved(s, 'rolling', 'sitting') ? 'Rolling: swaddle off, floor clear' : m >= 9 ? 'Crawling and pulling up' : m >= 6 ? 'Crawling, or getting ready' : m >= 3 ? 'Reaching: hot drinks, small things' : 'First setup: car seat and crib';
    if (topic === 'Health') { const c = checkupNow(s); if (c) return `${c.label[0].toUpperCase() + c.label.slice(1)} checkup ${c.ahead > 0 ? 'in ' + c.ahead + ' days' : 'now'}`;
      const nx = VISITS.find(([, , day]) => day > s.d); return nx ? `Next: ${nx[1]} checkup` : 'Checkups for year two'; }
    if (topic === 'Development') return m < 2 ? 'First looks and smiles' : m < 4 ? 'Smiles, sounds, swiping' : m < 6 ? 'Reaching, laughing, rolling' : m < 9 ? 'Sitting, babbling, finding things' : 'Waving, copying, pulling up';
    if (topic === 'Daily rhythm') return s.tooth === true ? 'Brushing first teeth' : m < 1 ? 'Cord care and sponge baths' : m < 4 ? 'Tub baths and a rhythm' : 'Drool, gums and bath play';
    if (topic === 'Out and about') return m < 2 ? 'Short walks, car seat basics' : m < 6 ? 'Carrier and stroller outings' : 'Longer trips, sun and snacks';
    return '';
  }

  /* ---------- the headline each category page leads with ---------- */
  let tileCache = { sig: null, lines: {} };
  function pageHeadlines() {
    const sig = journeyKey() + iso(NOW) + JSON.stringify(answers) + profile.feed + localStorage.getItem('ahead-v4-journey:' + (profile.id || profile.dob) + ':baby');
    if (tileCache.sig === sig) return tileCache.lines;
    const keepPage = page, keepHist = historyStack.slice(), keepAns = JSON.stringify(answers), keepY = scrollY, snap = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); snap[k] = localStorage.getItem(k); }
    const lines = {}, main = document.getElementById('main'), keepHtml = main.innerHTML;
    for (const cat of ['Development', 'Feeding', 'Sleep', 'Health', 'Safety', 'Daily rhythm', 'Out and about', 'Childcare']) {
      try {
        page = 'topic:' + cat; baseRender();
        const h = [...main.querySelectorAll('h1,h2')].find(x => !x.closest('.monthly-page-header,.guide-detail-top') && !x.classList.contains('hub-h2') && x.innerText.trim());
        if (h) lines[cat] = h.innerText.trim().replace(/\s+/g, ' ');
      } catch (e) {}
    }
    // put everything back exactly as it was
    page = keepPage; historyStack = keepHist; Object.keys(answers).forEach(k => delete answers[k]); Object.assign(answers, JSON.parse(keepAns));
    Object.keys(localStorage).forEach(k => { if (!(k in snap)) localStorage.removeItem(k); }); Object.entries(snap).forEach(([k, v]) => { if (localStorage.getItem(k) !== v) localStorage.setItem(k, v); });
    main.innerHTML = keepHtml; scrollTo(0, keepY);
    tileCache = { sig, lines };
    return lines;
  }

  /* ---------- put it on Home ---------- */
  const baseRender = window.render;
  const PAGES = {
    rsv: { cat: 'Health', ctx: 'Vaccines', title: 'The RSV shot', what: 'RSV is a common winter virus. For most adults it’s a cold, but it can make young babies very sick. One shot protects them for the season.',
      doIt: 'If {N} was born before RSV season and hasn’t had the shot, ask at the next checkup or call to book it.',
      know: ['Who it’s for', 'Babies under 8 months in their first RSV season, usually October to March. Babies born during the season often get it before leaving hospital.'],
      know2: ['Had the RSV vaccine in pregnancy?', 'If it was at least 2 weeks before birth, most babies don’t need the shot too. Your pediatrician can confirm.'] },
    flu: { cat: 'Health', ctx: 'Vaccines', title: 'A first flu shot', what: 'From 6 months, babies can have the flu shot each fall and winter.',
      doIt: 'Ask at the next checkup, or book it on its own. The first season takes two doses, 4 weeks apart.',
      know: ['Why two doses', 'The first dose starts {his} protection and the second completes it, so starting early in the season helps.'],
      know2: ['After the shot', 'A sore leg or a low fever for a day is common.'] },
    clocks: { cat: 'Sleep', ctx: 'Daily rhythm', title: 'When the clocks change', what: 'A one-hour jump can throw naps and bedtime off for a few days.',
      doIt: 'Starting a few days before, move naps and bedtime by about 15 minutes a day, so the change is done by the weekend.',
      know: ['Or just let it settle', 'Some families keep their usual times and give it a few days. Most babies adjust within a week either way.'],
      know2: ['Light helps', 'Bright mornings and a dim bedtime help {his} body clock catch up.'] }
  };
  function pageHtml(id) {
    const P0 = PAGES[id], s = state();
    const k = ([t, b]) => `<p class="ss-know"><b>${esc(t)}</b>${esc(w(s, b))}</p>`;
    // The same subpage look as every other guide: a soft colored header with a small picture, and the page's color inside.
    const pal = (typeof YEAR_PALETTES !== 'undefined' && YEAR_PALETTES[P0.cat]) || { bg: '#eef8f1', ink: '#356651' };
    const ART = { rsv: 'shield', flu: 'steth', clocks: 'clock' };
    return `<div class="quiet-category hub-page hub-detail care-v2" data-ss="1" data-overview="${esc(P0.cat)}" style="${yearTheme(P0.cat)};--ss-bg:${pal.bg};--ss-ink:${pal.ink}"><div class="guide-detail-top"><div class="monthly-page-header"><button class="monthly-back" onclick="back()" aria-label="Back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"></path></svg></button><div><h1>${esc(typeof displayTopic === 'function' ? displayTopic(P0.cat) : P0.cat)}</h1><p>${esc(name())} · ${esc(monthLabel(actualMonth()))}</p></div><span class="monthly-save" aria-hidden="true"></span></div></div>`
      + `<div class="dev-area-head ss-head" style="--area:${pal.bg};--area-ink:${pal.ink}">${typeof hubArt === 'function' ? `<span class="dev-area-head-art" aria-hidden="true">${hubArt(ART[id] || 'steth', P0.cat)}</span>` : ''}<p class="hub-context">${esc(P0.ctx)}</p><h1>${esc(P0.title)}</h1></div><section class="ss-moment"><p class="ss-what">${esc(w(s, P0.what))}</p><section class="ss-do"><b>What to do</b><p>${esc(w(s, P0.doIt))}</p></section>${k(P0.know)}${k(P0.know2)}</section></div>`;
  }
  // Home asks at most one question a week, so it never feels like a form. The missed-checkup question is separate.
  // Only when it's needed. Questions whose answer brings time-sensitive guidance can ask any week: crawling and
  // pulling up (babyproofing, the crib mattress), solids starting (peanut, egg, honey, choking foods), and the milk a
  // parent skipped at setup. Nap and next-food-step questions wait for a visit where Home has nothing new to show.
  const SAFETY_Q = ['crawl', 'stand', 'food', 'milk'];
  function newOnHome() {
    peeking = true;
    try { const s = state(), p = pick(s), today = iso(NOW); return [...p.now, ...p.soon].some(c => s.seen[c.id] == null || iso(new Date(s.seen[c.id])) === today); }
    catch (e) { return false; } finally { peeking = false; }
  }
  if (typeof window.homeQuestion === 'function') {
    const baseQ = window.homeQuestion;
    window.homeQuestion = homeQuestion = function () {
      const key = 'ahead-home2-lastq:' + journeyKey();
      let last = null; try { last = JSON.parse(localStorage.getItem(key)); } catch (e) {}
      const up = last && NOW.getTime() - last.at < 7 * DAY;   // a question already showing this week stays put
      const next = (typeof homeQuestionQueue === 'function' ? homeQuestionQueue() : [])[0];
      if (!up && next && !SAFETY_Q.includes(next) && newOnHome()) return null;
      // "Mattress down" comes before the question about pulling up, never hidden behind it.
      const standWaits = () => { const st = store(); return !(st.seen || {})['stand-soon'] && !(st.opened || {})['stand-soon']; };
      if (!up && next === 'stand' && standWaits()) return null;
      const k = baseQ(); if (!k) return k;
      if (k === 'stand' && !(up && last.k === 'stand') && standWaits()) return null;
      if (last && last.k !== k && NOW.getTime() - last.at < 7 * DAY) return null;
      if (!last || last.k !== k) { try { localStorage.setItem(key, JSON.stringify({ k, at: NOW.getTime() })); } catch (e) {} }
      return k;
    };
  }
  window.render = render = function () {
    try { noteVisit(page); } catch (e) {}
    if (typeof page === 'string' && page.startsWith('home2:') && PAGES[page.slice(6)]) {
      const m = document.getElementById('main'); if (m) m.innerHTML = pageHtml(page.slice(6)); return;
    }
    const r = baseRender.apply(this, arguments);
    try { if (page === 'home' && (typeof isCurrent !== 'function' || isCurrent())) paint(); } catch (e) { console.error(e); }
    return r;
  };
  /* ---------- Profile: what Ahead knows, so parents can see it and fix it (never a form to fill in) ---------- */
  const dayLabel = iso => parse(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  window.home2Forget = key => {
    const st = store();
    if (key === 'solids') { delete st.solidsToldAt; save(st); setFeedingStage('preparing'); return; }
    if (key === 'tooth') { delete st.toothAt; st.toothNo = iso(NOW); save(st); setAnswer('tooth', null); return; }
    if (key === 'naps') { delete st.napsAt; save(st); setAnswer('twoNaps', null); return; }
    if (key === 'sack') { setAnswer('swaddleStopped', null); return; }
    if (key === 'never') { setAnswer('neverSwaddled', null); return; }
  };
  function knowsHtml() {
    const s = state(), a = answers, mf = memoryFirsts(), n = esc(s.n), rows = [];
    const row = (label, sub, btn) => rows.push(`<div class="home2-know-row"><div><b>${esc(label)}</b><small>${esc(sub)}</small></div>${btn || ''}</div>`);
    const fix = key => `<button class="home2-know-fix" onclick="home2Forget('${key}')">Not right</button>`;
    const mem = `<button class="home2-know-fix" onclick="openPage('chg:Timeline:firsts')">In Memories</button>`;
    const mv = { pulling: 'Pulling up', crawling: 'Crawling', sitting: 'Sitting on ' + s.p.p + ' own', rolling: 'Rolling' }[s.move];
    if (mv) { const d = (a.stageDates || {}).movement; row(mv, (d ? 'Since ' + dayLabel(d) + ' · ' : '') + (mf[s.move] ? 'From Memories' : 'Change it under “How ' + s.n + ' moves”'), mf[s.move] ? mem : ''); }
    if (s.solidsDays != null && a.solidsStart) row('Started solids', 'Since ' + dayLabel(a.solidsStart), fix('solids'));
    if (s.tooth === true) row('Has teeth', mf.tooth ? 'First tooth ' + dayLabel(mf.tooth) + ' · From Memories' : 'You told us on Home', mf.tooth ? mem : fix('tooth'));
    if (s.naps === 2) row('On two naps', 'You told us on Home', fix('naps'));
    if (s.swaddle === 'sack') row('In a sleep sack', 'No more swaddle cards', fix('sack'));
    if (s.swaddle === 'never') row('Doesn’t swaddle', 'No swaddle cards', fix('never'));
    if (!rows.length) return '';
    return `<h2 class="hub-h2">What Ahead knows</h2><p class="hub-where-lead">From your answers and Memories. Fix anything that’s not right.</p><section class="hub-card home2-know">${rows.join('')}</section>`;
  }

  // Remember what was shown: "waits until seen", and a card shown on 3 visits without a tap retires.
  function recordShown(s, now, soon) {
    const st = store(); st.seen = st.seen || {}; st.firstDay = st.firstDay || iso(NOW); st.views = st.views || {}; const today = iso(NOW);
    [...now, ...soon].forEach(c => { if (st.seen[c.id] == null) { st.seen[c.id] = Date.now(); st.lastNewAt = Date.now(); } const k = KEY(c, forCard(c, s)), v = st.views[k] || { n: 0, last: '' }; if (v.last !== today) st.views[k] = { n: v.n + 1, last: today }; }); save(st);
  }
  // Home's set is fixed for the day: dismissing or opening a card doesn't pull in the next one until tomorrow.
  // The exception is a card the parent just unlocked by answering Home's question.
  function forToday(s, r) {
    const st = store(), today = iso(NOW);
    const first = s.firstDay === today, qt = qTopicOf(s), byId = id => C.find(c => c.id === id);
    if (!st.today || st.today.date !== today) {
      // A card brought forward on a quiet week isn't live yet: remember it, so it stays for the day.
      st.today = { date: today, now: r.now.map(c => c.id), soon: r.soon.map(c => c.id), ahead: r.soon.filter(c => !isLive(c, s, first, qt)).map(c => c.id) }; save(st); return r;
    }
    // Same day: the cards chosen this morning, minus any opened or dismissed, plus a card an answer just unlocked.
    const ahead = new Set(st.today.ahead || []);
    const keep = ids => (ids || []).map(byId).filter(c => c && (isLive(c, s, first, qt) || (ahead.has(c.id) && s.opened[KEY(c, s)] == null)));
    const out = { now: keep(st.today.now), soon: keep(st.today.soon) };
    const justAnswered = Date.now() - s.answeredAt < 12 * 3600e3, had = new Set([...(st.today.now || []), ...(st.today.soon || [])]);
    const fresh = justAnswered ? [...r.now, ...r.soon].filter(c => (c.fromAnswer || c.must) && !had.has(c.id)) : [];
    if (fresh.length) { out.now = fresh.concat(out.now); st.today.now = fresh.map(c => c.id).concat(st.today.now || []); save(st); }
    out.cleared = had.size > 0 && !out.now.length && !out.soon.length;
    return out;
  }
  // Answering Home's question counts as "just answered", so the card it unlocks shows on this visit.
  if (typeof window.answerHomeQuestion === 'function') {
    const baseAnswerQ = window.answerHomeQuestion;
    window.answerHomeQuestion = answerHomeQuestion = function () { const st = store(); st.answeredAt = Date.now(); save(st); return baseAnswerQ.apply(this, arguments); };
  }
  window.home2RecordShown = () => { const s = state(), r = forToday(s, pick(s)); recordShown(s, r.now, r.soon); };
  function paint() {
    const main = document.getElementById('main'); if (!main) return;
    settlePending();
    // The month card: the baby's exact age on top, and the category line on the birthday card too.
    try {
      const dob = parse(profile.dob), now = new Date(NOW), days = Math.floor((now - dob) / DAY);
      let m = (now.getFullYear() - dob.getFullYear()) * 12 + now.getMonth() - dob.getMonth(); if (now.getDate() < dob.getDate()) m--;
      const since = new Date(dob); since.setMonth(dob.getMonth() + m); const wks = Math.floor((now - since) / DAY / 7);
      const ageText = days < 91 ? (days < 7 ? `${days} day${days === 1 ? '' : 's'} old` : `${Math.floor(days / 7)} weeks old`) : `${m} months${wks ? `, ${wks} week${wks > 1 ? 's' : ''}` : ''}`;
      const eb = main.querySelector('.connected-summary-intro:not(.hub-bday) .home-month-eyebrow'); if (eb) eb.remove();   // the header above already says the age ('Leo · 4 weeks'), so the card doesn't repeat it
      const bd = main.querySelector('.connected-summary-intro.hub-bday');
      if (bd && !bd.querySelector('.home-summary-spectrum')) {
        const spec = document.querySelector('.home-summary-spectrum') ? '' : `<div class="home-summary-spectrum" aria-hidden="true">${['#e5e0fc', '#f7d9e5', '#d9e5fc', '#ddf1e5', '#f7e6c4', '#cfe9f4', '#fde3d3', '#f8edb3'].map(c => `<span style="background:${c}"></span>`).join('')}</div>`;
        bd.insertAdjacentHTML('beforeend', spec);
      }
    } catch (e) {}
    // Home asks at most one question, in its own slot at the top; the cards below are notifications only.
    const s = state(), r = forToday(s, pick(s)), { now, soon } = r;
    // remember what was shown, for "waits until seen"
    recordShown(s, now, soon);
    const summary = main.querySelector('.connected-summary');
    if (summary) {
      summary.querySelectorAll('.connected-summary-links').forEach(e => e.remove());
      if (now.length) summary.insertAdjacentHTML('beforeend', `<div class="connected-summary-links">${now.map(c => row(c, s)).join('')}</div>`);
    }
    main.querySelectorAll('section.connected-ahead:not(.brief-preview)').forEach(e => e.remove());
    const close = main.querySelector('.brief-close');
    const aheadHtml = soon.length ? `<section class="connected-ahead" aria-label="Coming up"><div class="connected-section-heading"><h2>Coming up</h2></div><div class="connected-ahead-list">${soon.map(c => row(c, s)).join('')}</div></section>` : '';
    if (close) { close.insertAdjacentHTML('beforebegin', aheadHtml); close.textContent = r.cleared ? 'You’re all caught up for today.' : !now.length && !soon.length ? `Nothing new this week. ${s.n}’s right on track.` : 'That’s everything for today.'; }
  }

  // For checks
  window.home2Audit = () => {
    const s = state(), r = forToday(s, pick(s));
    const out = (c, slot) => { const sc = forCard(c, s), go = typeof c.go === 'function' ? c.go(sc) : c.go;
      return { id: c.id, key: KEY(c, sc), slot, cat: c.cat, pri: c.pri, must: !!c.must, safety: !!c.safety, fromAnswer: !!c.fromAnswer, done: !!c.done,
        title: w(sc, T(c.title)(sc)), body: w(sc, T(c.body)(sc)), go, ask: (c.ask || []).map(([label, js]) => ({ label, js })) }; };
    return { d: s.d, dAdj: s.dAdj, move: s.move, solids: s.solids, solidsDays: s.solidsDays, tooth: s.tooth, naps: s.naps, swaddle: s.swaddle, q: s.q,
      cards: [...r.now.map(c => out(c, 'now')), ...r.soon.map(c => out(c, 'soon'))] };
  };
  window.home2Settle = () => settlePending();
  window.home2Debug = () => { const s = state(), r = pick(s); return { d: s.d, move: s.move, now: r.now.map(c => c.id + ' · ' + w(s, T(c.title)(s))), soon: r.soon.map(c => c.id + ' · ' + w(s, T(c.title)(s))) }; };
})();
