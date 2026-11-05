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

  function state() {
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
      d, feed, date: new Date(NOW), birth: dob, n: name(), p: babyPronouns(),
      move, notYet, moveAt: moveAt ? daysSince(moveAt) : null,
      swaddle: a.swaddleStopped === 'Yes' ? 'sack' : a.neverSwaddled === 'Yes' ? 'never' : null,
      solids, solidsDays: start ? Math.floor((NOW - start) / DAY) : null, solidsTold: solidsAt ? daysSince(solidsAt) : null,
      solidsNoAt: st.solidsNo ? daysSince(st.solidsNo) : null,
      tooth: a.tooth === 'Yes' ? true : st.toothNo ? false : null, toothAt: st.toothAt ? daysSince(st.toothAt) : null, toothNoAt: st.toothNo ? daysSince(st.toothNo) : null,
      naps: a.twoNaps === 'Yes' ? 2 : a.twoNaps === 'Stay' ? 3 : null, napsAt: st.napsAt ? daysSince(st.napsAt) : null,
      opened: st.opened || {}, seen: st.seen || {}, firstDay: st.firstDay || iso(NOW), answeredAt: st.answeredAt || 0, q: typeof homeQuestion === 'function' ? homeQuestion() : null
    };
  }
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
    'Breast milk is low in vitamin D, so pediatricians recommend a 400 IU drop every day, from the first days through the first year.', { must: 1, go: "openPage('chg:Feeding:d:vitd')", catchup: 330 });
  card('poop-colors', 'Daily rhythm', 2, s => s.d <= 7, 'Poop changes color this week',
    s => `Black and sticky at first, then green, then ${s.feed === 'breast' ? 'yellow' : 'yellow or tan'} by about day 5. That change means feeding is going well.`, { go: "openPage('topic:Daily rhythm')" });
  card('safe-sleep', 'Sleep', 1, s => s.d <= 21, '{N}’s safest sleep spot', 'On {his} back, in a bare crib or bassinet in your room, for at least 6 months. It can halve the risk of SIDS.',
    { safety: 1, must: 1, catchup: 120, go: "openPage('chg:Sleep:d:where')" });
  card('newborn-normal', 'Daily rhythm', 4, s => s.d >= 8 && s.d <= 35, 'Snuffles, sticky eyes and baby acne are normal', 'All common in the first weeks, and all clear on their own. Snuffles are often just dried milk.', { go: "openPage('chg:Daily rhythm:d:skin')" });
  card('day-night', 'Sleep', 4, s => s.d >= 7 && s.d <= 35, 'Days and nights mixed up?', 'Common now, and it usually sorts out by 6–8 weeks. Bright days and dim, quiet night feeds help {his} body clock.', { go: "openPage('chg:Sleep:d:daynight')" });
  card('cluster', 'Feeding', 4, s => (s.d >= 10 && s.d <= 24) || (s.d >= 38 && s.d <= 48), 'Feeding nonstop? Often a growth spurt',
    s => s.feed === 'breast' ? 'Hourly feeds are common around 3 and 6 weeks, and settle in 2–3 days. Feeding more is how your body makes more.' : 'Days of extra hunger are common around 3 and 6 weeks. Follow {his} cues: it settles in 2–3 days.', { go: "openPage('chg:Feeding:d:cues')" });
  card('tub-baths', 'Daily rhythm', 4, s => s.d >= 14 && s.d <= 28, 'First tub bath: once the cord falls off', 'Usually at 1–3 weeks. A few inches of warm water, and a hand on {him} the whole time.', { go: "openPage('chg:Daily rhythm:d:tub')" });
  card('first-bottle', 'Feeding', 4, s => s.feed === 'breast' && s.d >= 21 && s.d <= 42, 'A first bottle, if you’ll ever need one', '3 to 6 weeks is the easiest time, once nursing is going well. Babies who don’t try one early can resist it later.', { go: "openPage('chg:Feeding:d:bottles')" });
  card('postpartum', 'Health', 4, s => s.d >= 14 && s.d <= 49, 'Your own checkup is due too', 'If you gave birth: a check-in in the first 3 weeks, and a full visit by 12 weeks.', { go: "openPage('chg:Health:d:you')" });
  card('crying-peak', 'Sleep', 4, s => s.d >= 35 && s.d <= 63, 'The fussiest weeks: they ease by 3–4 months', 'Crying usually peaks around 6–8 weeks, and some evenings nothing works. That isn’t you. At your limit, put {him} down safely and step away.', { go: "openPage('chg:Sleep:d:crying')" });
  // 6 weeks to 4 months
  card('drool', 'Daily rhythm', 4, s => s.d >= 60 && s.d <= 115, 'All that drool usually isn’t teeth yet', 'Drooling and chewing on fists often start around 2–4 months, long before a first tooth. It’s how babies explore.', { go: "openPage('chg:Daily rhythm:d:gums')" });
  card('routine', 'Sleep', 3, s => s.d >= 42 && s.d <= 77, 'Nights start to stretch: add a bedtime routine', 'Bath, feed, song: a short routine in the same order helps that longer stretch land at night instead of the afternoon.', { catchup: 150, go: "openPage('chg:Sleep:d:routine')" });
  card('shorter-feeds', 'Feeding', 4, s => breast(s) && s.d >= 42 && s.d <= 60, 'Shorter feeds are normal now', 'Around 6 weeks, many breastfed babies get faster and go 2–4 hours between feeds. It doesn’t mean less milk.', { go: "openPage('chg:Feeding:d:nursing')" });
  card('fewer-poops', 'Daily rhythm', 4, s => s.feed === 'breast' && s.d >= 42 && s.d <= 90, 'Days without a poop can be normal', 'After about 6 weeks, some breastfed babies go days between poops. Wet diapers, 6 or more a day, tell you {hes} getting enough.', { go: "openPage('topic:Daily rhythm')" });
  card('swaddle', 'Safety', 1, s => s.d >= 49 && s.d <= 120 && !s.swaddle && !moved(s, 'rolling', 'sitting', 'crawling', 'pulling'), 'If you swaddle: when to stop',
    'At the first sign of rolling, which can be as early as 2 months. That day, switch to a sleep sack with arms free.',
    Object.assign({ safety: 1, must: 1, go: "openPage('chg:Sleep:d:swaddleoff')" }, ask([['In a sleep sack now', "setAnswer('swaddleStopped','Yes')"], ['We don’t swaddle', "setAnswer('neverSwaddled','Yes')"]])));
  card('swaddle-now', 'Safety', 1, s => !s.swaddle && moved(s, 'rolling', 'sitting', 'crawling', 'pulling') && s.d <= 240, s => moved(s, 'rolling') ? '{Ns} rolling: time to stop swaddling' : 'Time to stop swaddling',
    'If {hes} still swaddled, switch to a sleep sack with arms free tonight. A swaddled baby who rolls can’t push up.',
    Object.assign({ fromAnswer: 1, safety: 1, must: 1, go: "openPage('chg:Sleep:d:swaddleoff')" }, ask([['In a sleep sack now', "setAnswer('swaddleStopped','Yes')"], ['We don’t swaddle', "setAnswer('neverSwaddled','Yes')"]])));
  card('reaching', 'Safety', 2, s => s.d >= 90 && s.d <= 130 && !moved(s, 'rolling', 'sitting', 'crawling', 'pulling'), 'Grabbing starts soon: hot drinks first', 'Swiping and grabbing usually start around 3–5 months, and they’re fast. Hold hot drinks well away from {him}.', { safety: 1, must: 1, go: "openPage('safety-stage:reaching')" });
  card('distracted', 'Feeding', 4, s => s.d >= 90 && s.d <= 135, 'Suddenly pulling off to look around?', 'Common around 3–5 months: everything is more interesting than milk. A quiet, dim room helps.', { go: "openPage('chg:Feeding:d:cues')" });
  card('iron', 'Feeding', 3, s => breast(s) && s.d >= 100 && s.d <= 122 && !(typeof healthRecord === 'function' && healthRecord(4) && healthRecord(4).status === 'attended'), 'Ask about iron at the 4-month checkup',
    s => s.feed === 'breast' ? 'Pediatricians recommend iron drops for breastfed babies from 4 months until iron-rich foods are going well. A quick question at this visit.' : 'For mostly breastfed babies, pediatricians recommend iron drops from 4 months until iron-rich foods are going well. Worth asking.', { go: "openPage('health-visit:4')" });
  card('four-month', 'Sleep', 3, s => s.d >= 100 && s.d <= 140, 'More waking? Common around 4 months', 'More waking for a few weeks is common now. It’s {his} sleep maturing, not something you broke.', { catchup: 165, go: "openPage('chg:Sleep:d:regress')" });
  card('carrier', 'Out and about', 4, s => s.d >= 120 && s.d <= 170, 'Carrier: facing out can start soon', 'Once {his} head control is strong, often around 4–6 months, many carriers allow facing out. The minimum is in the instructions.', { go: "openPage('chg:Out and about:d:carry')" });
  // Rolling
  const MOVE_ASK = (yes, key) => ask([[yes, `setAnswer('${key}','Yes')`], ['Not yet', key === 'roll' ? "setAnswer('rollDirection','Not yet')" : `setAnswer('${key}','Not yet')`]]);
  const fresh7 = (s, k) => s.notYet[k] && s.moveAt != null && s.moveAt <= 7;
  const freshNo = (s, k) => s.notYet[k] && s.moveAt != null && s.moveAt <= 28;
  card('rolling-soon', 'Safety', 1, s => s.d >= 105 && s.d <= 200 && (freshNo(s, 'rolling') || s.move == null),
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
  card('solids-ready', 'Feeding', 3, s => (s.d >= 140 && s.d <= 175 && s.solids == null) || (s.d >= 140 && s.d <= 245 && s.solids === 'notyet' && s.solidsNoAt != null && s.solidsNoAt <= 28), 'Solids are getting close',
    'Around 6 months, once {he} {sits|sit} with a little support, {holds|hold} {his} head steady and {leans|lean} in for food.',
    Object.assign({ slot: 'soon', topic: 'food', go: "openPage('chg:Feeding:d:signs')" }, ask([['Started already', "home2Solids(true)"], ['Not yet', "home2Solids(false)"]])));
  card('first-bite', 'Feeding', 3, s => (opened(s, 'solids-ready') && ((s.d >= 150 && s.d <= 175 && s.solids == null) || (s.solids === 'notyet' && s.solidsNoAt != null && s.solidsNoAt <= 28 && s.d <= 245))) || (s.solidsDays != null && s.solidsDays <= 45 && s.solidsTold != null && s.solidsTold <= 28 && opened(s, 'solids-1')),
    s => s.solidsDays == null ? 'Before the first bite: gagging vs choking' : 'Gagging vs choking: how to tell',
    'Gagging is loud, red-faced and normal: it’s how {he} {learns|learn}. Choking is silent. A short infant first aid video before you start helps.', { must: 1, topic: 'food', go: "openPage('chg:Feeding:d:setup')" });
  card('solids-maybe', 'Feeding', 3, s => s.d >= 176 && s.d <= 245 && s.solids == null, 'Starting solids? Lead with iron', 'Iron runs low around 6 months, so meat, beans, lentils or iron-fortified oatmeal make the best first foods.',
    Object.assign({ must: 1, topic: 'food', go: "openPage('chg:Feeding:d:food')" }, ask([['Started already', "home2Solids(true)"], ['Not yet', "home2Solids(false)"]])));
  card('solids-1', 'Feeding', 3, s => s.solidsDays != null && s.solidsDays <= 45 && s.solidsTold != null && s.solidsTold <= 21 && !opened(s, 'solids-maybe'), 'First foods: lead with iron', 'Iron runs low around 6 months, so meat, beans, lentils or iron-fortified oatmeal make the best first foods.', { fromAnswer: 1, must: 1, go: "openPage('chg:Feeding:d:food')" });
  card('solids-2', 'Feeding', 2, s => s.solidsDays != null && ((s.solidsDays >= 7 && s.solidsDays <= 120 && (opened(s, 'solids-1') || opened(s, 'solids-maybe'))) || (s.solidsDays > 21 && s.solidsDays <= 120)), 'Offer peanut and egg early', 'Giving common allergens early, then keeping them in {his} week, lowers the chance of a food allergy. Severe eczema? Ask your pediatrician first.', { must: 1, go: "openPage('chg:Feeding:d:allergens')" });
  card('off-menu', 'Feeding', 2, s => s.solidsDays != null && s.solidsTold != null && s.solidsTold <= 70 && (opened(s, 'solids-1') || opened(s, 'solids-maybe') || s.solidsDays > 45), 'Still off the menu until 1', 'No honey, and no whole grapes, nuts or popcorn: they’re common choking risks before {his} first birthday.', { must: 1, go: "openPage('chg:Feeding:d:food')" });
  card('solids-poop', 'Daily rhythm', 4, s => s.solidsDays != null && s.solidsDays >= 5 && s.solidsDays <= 25, 'Poop changes with solids', 'Thicker, browner and smellier, sometimes the color of what {he} ate. All normal.', { go: "openPage('topic:Daily rhythm')" });
  card('solids-3', 'Feeding', 4, s => s.solidsDays != null && s.solidsDays >= 14 && s.solidsDays <= 80 && opened(s, 'solids-2'), 'A few sips of water at meals', 'Up to 4–8 oz a day, from an open or straw cup. Starting now makes leaving bottles at 12 months easier.', { go: "openPage('chg:Feeding:d:cup')" });
  card('solids-unknown', 'Feeding', 3, s => s.solids == null && s.d >= 246 && s.d <= 300, 'Started solids? Offer peanut and egg early', 'Giving common allergens early, then keeping them in {his} week, lowers the chance of a food allergy. Severe eczema? Ask your pediatrician first.',
    Object.assign({ must: 1, topic: 'food', go: "openPage('chg:Feeding:d:allergens')" }, ask([['Started already', "home2Solids(true)"], ['Not yet', "home2Solids(false)"]])));
  card('textures', 'Feeding', 3, s => s.solidsDays != null && s.solidsDays >= 28 && mo(s) >= 7 && mo(s) <= 9.5, 'Time for lumpier food', 'Thicker textures and soft pieces {he} can pick up. Babies who move past smooth purées by about 9 months take to lumps more easily.', { go: "openPage('chg:Feeding:d:lumpy')" });
  card('meals', 'Feeding', 3, s => s.solidsDays != null && s.solidsDays >= 70 && mo(s) >= 9 && mo(s) <= 11, 'Three meals a day, from about now', 'Most babies eat three meals and a snack or two from about now, with milk alongside.', { go: "openPage('chg:Feeding:d:day')" });
  card('solids-late', 'Feeding', 2, s => s.solids === 'notyet' && mo(s) >= 8, 'Not started solids yet? An easy way in', 'Iron matters most now, so it’s worth a quick call to your pediatrician about an easy way in.', { go: "openPage('chg:Feeding:d:notready')" });
  // Moving
  card('crawl-soon', 'Safety', 1, s => s.d >= 150 && s.d <= 300 && (moved(s, 'rolling', 'sitting') || s.d >= 210) && (freshNo(s, 'crawling') || (s.move == null || (moved(s, 'none', 'rolling', 'sitting') && !freshNo(s, 'crawling') && s.d >= 210))),
    s => fresh7(s, 'crawling') ? 'Crawling is coming: babyproof first' : 'Crawling, or close to it? Babyproof now',
    'It usually starts between 6 and 10 months. Start with stair gates, cabinet locks, outlet covers, and tall furniture strapped to the wall.',
    Object.assign({ safety: 1, must: 1, topic: 'move', go: "openPage('safety-stage:moving')" }, MOVE_ASK('Already crawling', 'crawl')));
  card('crawl-now', 'Safety', 1, s => moved(s, 'crawling') && s.moveAt != null && s.moveAt <= 42, 'Now that {N} crawls, start with the stairs', 'A gate screwed into the wall at the top, and either kind at the bottom. No stairs? This one’s done.', { fromAnswer: 1, safety: 1, must: 1, done: 1, go: "openPage('chg:Safety:d:step:gates')" });
  card('stand-soon', 'Safety', 1, s => s.d >= 230 && s.d <= 365 && (freshNo(s, 'pulling') || s.move !== 'pulling'),
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
  card('six-month-sleep', 'Sleep', 3, s => s.d >= 183 && s.d <= 215, '{His} own room is now an option', 'Where {he} {sleeps|sleep} from here is your call: the room-sharing advice covers the first 6 months.', { catchup: 240, go: "openPage('chg:Sleep:d:where')" });
  card('two-naps-soon', 'Sleep', 3, s => s.d >= 200 && s.d <= 270 && (s.naps == null || (s.naps === 3 && s.napsAt != null && s.napsAt <= 21)), 'Ready for two naps?', 'Between 6 and 9 months, the late nap often stops fitting, or bedtime drifts later. A week of that is the sign.',
    Object.assign({ topic: 'naps', go: "openPage('chg:Sleep:d:catnap')" }, ask([['On two naps', "home2Naps(2)"], ['Still three', "home2Naps(3)"]])));
  card('two-naps', 'Sleep', 3, s => s.naps === 2 && s.d <= 300 && s.napsAt != null && s.napsAt <= 28, 'Two naps: bedtime moves earlier', 'While {he} {adjusts|adjust}, move bedtime about 30 minutes earlier. The switch takes a week or two.', { fromAnswer: 1, go: "openPage('chg:Sleep:d:catnap')" });
  card('separation', 'Daily rhythm', 4, s => s.d >= 240 && s.d <= 290, 'Clingier lately? It’s a good sign', 'Common from about 8 months, and it means {he} {knows|know} you. A short, same-every-time goodbye helps.', { catchup: 330, go: "openPage('topic:Development')" });
  // Teeth
  card('teething', 'Daily rhythm', 4, s => s.d >= 165 && s.d <= (s.tooth === false ? 230 : 200) && s.tooth !== true, 'Teething can start weeks before a tooth', 'Drool and chewing often start weeks before the first tooth, usually between 6 and 10 months. A chilled (not frozen) teething ring helps.',
    Object.assign({ topic: 'tooth', catchup: 200, go: "openPage('chg:Daily rhythm:d:gums')" }, ask([['Has a tooth', "home2Tooth(true)"], ['Not yet', "home2Tooth(false)"]])));
  card('first-tooth', 'Daily rhythm', 3, s => s.tooth === true && s.toothAt != null && s.toothAt <= 28, 'Teeth are here: time to brush', 'Brush twice a day with a rice-grain smear of fluoride toothpaste, the last time after the bedtime feed.', { fromAnswer: 1, go: "openPage('chg:Daily rhythm:d:teeth')" });
  card('dentist', 'Health', 4, s => s.tooth === true && ((opened(s, 'first-tooth') && s.toothAt >= 10 && s.toothAt <= 60) || s.d >= 320), 'The first dentist visit comes early', 'Book it once the first tooth is in, and by {his} first birthday. They’ll check {his} teeth and show you how to brush.', { go: "openPage('chg:Daily rhythm:d:teeth')" });
  card('biting', 'Feeding', 4, s => breast(s) && s.tooth === true && s.toothAt >= 7 && s.toothAt <= 42, 'If {he} {bites|bite} while nursing', 'It usually doesn’t last long. A calm pause and a short break stop most babies.', { go: "openPage('chg:Feeding:d:nursing')" });
  // Health
  card('checkup', 'Health', 2, s => !!checkupNow(s), s => { const c = checkupNow(s); return c.label[0].toUpperCase() + c.label.slice(1) + ' checkup: what to know'; }, s => TIP[checkupNow(s).label],
    { once: false, slot: s => checkupNow(s) && checkupNow(s).ahead >= 2 ? 'soon' : 'now', go: s => `openPage('health-visit:${checkupNow(s).age}')`, key: s => 'checkup:' + checkupNow(s).label });
  card('rsv', 'Health', 2, s => [10, 11, 12, 1, 2, 3].includes(month_(s)) && s.d <= 243 && [4, 5, 6, 7, 8, 9].includes(s.birth.getMonth() + 1), 'Born before RSV season? Ask about the shot', 'It’s the top reason babies end up in the hospital. An antibody shot protects babies under 8 months through their first season.', { go: "openPage('topic:Health')" });
  card('flu', 'Health', 3, s => [9, 10, 11, 12, 1, 2].includes(month_(s)) && s.d >= 183, 'Flu season: {his} first shot can start', '{His} first season takes two doses, 4 weeks apart, so starting early means {hes} covered sooner.', { go: "openPage('topic:Health')" });
  // Gear, outings, seasons
  card('sunscreen', 'Out and about', 4, s => s.d >= 180 && s.d <= 230 && month_(s) >= 4 && month_(s) <= 9, 'Sunscreen is fine to use now', 'SPF 30 or more on skin you can’t cover. Shade and a hat still come first.', { go: "openPage('chg:Daily rhythm:d:sun')" });
  card('hot-days', 'Out and about', 4, s => [6, 7, 8].includes(month_(s)) && s.date.getDate() <= 14, s => s.d < 183 ? 'Hot days: milk, not water' : 'Hot days: extra milk and a few sips',
    s => s.d < 183 ? 'Under 6 months, extra milk feeds are all {he} {needs|need}, even on the hottest days. Water can wait.' : 'More milk feeds than usual, plus a few sips of water from a cup at meals.', { go: "openPage('chg:Out and about:d:weather')" });
  card('cold-car-seat', 'Out and about', 4, s => [11, 12, 1].includes(month_(s)) && s.date.getDate() <= 14, 'Cold days: coats off in the car seat', 'Puffy coats leave the straps too loose in a crash. Buckle {him} in thin layers, then put the coat or a blanket over the straps.', { go: "openPage('chg:Out and about:d:car')" });
  card('car-seat', 'Out and about', 1, s => s.d >= 270 && s.d <= 305, 'Next car seat: still facing back', 'In an infant seat? Many babies outgrow it by height before weight. The next seat still faces backward, often until age 2 or beyond.', { safety: 1, must: 1, catchup: 345, go: "openPage('chg:Out and about:d:car')" });
  card('first-steps', 'Development', 4, s => s.d >= 300 && s.d <= 340, 'No rush on first steps', 'Anywhere from 9 to 18 months is normal for walking, and many babies cruise along furniture for weeks first.', { go: "openPage('topic:Development')" });
  card('first-words', 'Development', 4, s => s.d >= 335 && s.d <= 365, 'First words: what counts', '“Mama” or “dada” said to the right person counts, and so does a sound {he} always {uses|use} for one thing, like “ba” for ball.', { go: "openPage('topic:Development')" });
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

  /* ---------- picking ---------- */
  const KEY = (c, s) => c.key ? c.key(s) : c.id;
  function wasTrue(c, s, within, step) {
    for (let back = step; back <= within; back += step) { const d = s.d - back; if (d < 0) break; try { if (c.show(at(s, d))) return true; } catch (e) {} }
    return false;
  }
  function pick(s) {
    const first = s.firstDay === iso(NOW);
    const qTopic = s.q === 'movement' || s.q === 'crawl' || s.q === 'stand' ? 'move' : s.q === 'food' ? 'food' : null;
    const live = C.filter(c => {
      if (c.once !== false && s.opened[KEY(c, s)] != null) return false;
      if (c.id === 'checkup' && !checkupNow(s)) return false;
      if (c.topic && c.topic === qTopic) return false;
      let ok = false; try { ok = c.show(s); } catch (e) {}
      if (ok) return true;
      if (c.must && s.seen[c.id] == null && wasTrue(c, s, 28, 2)) return true;      // waits for the parent
      return !!(first && c.catchup && s.d <= c.catchup && wasTrue(c, s, 400, 7));
    });
    const later = at(s, s.d + 4), leaving = c => { try { return !c.show(later); } catch (e) { return true; } };
    // A card the parent just unlocked with an answer leads, so the answer visibly does something.
    const justAnswered = Date.now() - s.answeredAt < 12 * 3600e3, pri = c => c.fromAnswer && justAnswered ? 0 : c.pri;
    live.sort((a, b) => (pri(a) - pri(b)) || (leaving(b) - leaving(a)) || ((s.seen[a.id] != null) - (s.seen[b.id] != null)) || (C.indexOf(a) - C.indexOf(b)));
    const now = [], soon = [], cats = new Set(); let safety = false;
    for (const c of live) {
      if (cats.has(c.cat) || (c.safety && safety)) continue;
      const slot = typeof c.slot === 'function' ? c.slot(s) : c.slot, box = slot === 'soon' ? soon : now;
      if (box.length >= 2) continue;
      box.push(c); cats.add(c.cat); safety = safety || !!c.safety;
    }
    return { now, soon };
  }

  /* ---------- actions ---------- */
  const mark = (field, id) => { const st = store(); st[field] = st[field] || {}; st[field][id] = Date.now(); save(st); };
  window.home2Open = (id, go) => { mark('opened', id); try { (new Function(go))(); } catch (e) { render(); } };
  window.home2Hide = id => { mark('opened', id); const y = scrollY; render(); scrollTo(0, y); if (typeof hubToast === 'function') hubToast('Hidden', 'It’s still in its guide if you need it.'); };
  window.home2Done = id => { mark('opened', id); const y = scrollY; render(); scrollTo(0, y); if (typeof hubToast === 'function') hubToast('Done', 'Nice. It’s ticked off in Safety too.'); };
  const toast = (t, b) => { if (typeof hubToast === 'function') hubToast(t, b); };
  window.home2Answer = (id, js, label) => {
    mark('opened', id); const st0 = store(); st0.answeredAt = Date.now(); save(st0);
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
  function row(c, s) {
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

  /* ---------- put it on Home ---------- */
  const baseRender = window.render;
  window.render = render = function () {
    const r = baseRender.apply(this, arguments);
    try { if (page === 'home' && (typeof isCurrent !== 'function' || isCurrent())) paint(); } catch (e) { console.error(e); }
    return r;
  };
  function paint() {
    const main = document.getElementById('main'); if (!main) return;
    const s = state(), { now, soon } = pick(s);
    // remember what was shown, for "waits until seen"
    const st = store(); st.seen = st.seen || {}; st.firstDay = st.firstDay || iso(NOW); [...now, ...soon].forEach(c => { if (st.seen[c.id] == null) st.seen[c.id] = Date.now(); }); save(st);
    const summary = main.querySelector('.connected-summary');
    if (summary) {
      summary.querySelectorAll('.connected-summary-links').forEach(e => e.remove());
      if (now.length) summary.insertAdjacentHTML('beforeend', `<div class="connected-summary-links">${now.map(c => row(c, s)).join('')}</div>`);
    }
    main.querySelectorAll('section.connected-ahead:not(.brief-preview)').forEach(e => e.remove());
    const close = main.querySelector('.brief-close');
    const aheadHtml = soon.length ? `<section class="connected-ahead" aria-label="Coming up"><div class="connected-section-heading"><h2>Coming up</h2></div><div class="connected-ahead-list">${soon.map(c => row(c, s)).join('')}</div></section>` : '';
    if (close) { close.insertAdjacentHTML('beforebegin', aheadHtml); close.textContent = !now.length && !soon.length ? `Nothing new this week. ${s.n}’s right on track.` : 'That’s everything for now.'; }
    // live tiles
    main.querySelectorAll('.connected-category-grid button').forEach(b => {
      const m = (b.getAttribute('onclick') || '').match(/topic:([^']+)'/); if (!m) return;
      const line = tileLine(m[1], s); if (!line || b.querySelector('.home2-tile')) return;
      const label = b.querySelector('b'); if (label) label.insertAdjacentHTML('afterend', `<small class="home2-tile">${esc(line)}</small>`);
      b.classList.add('home2-live');
    });
    const h = main.querySelector('.connected-browse h2'); if (h) h.textContent = `Where ${s.n} is now`;
  }

  // For checks
  window.home2Debug = () => { const s = state(), r = pick(s); return { d: s.d, move: s.move, now: r.now.map(c => c.id + ' · ' + w(s, T(c.title)(s))), soon: r.soon.map(c => c.id + ' · ' + w(s, T(c.title)(s))) }; };
})();
