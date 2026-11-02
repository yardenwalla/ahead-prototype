/* Ahead · Safety, rebuilt around one job:
   "Before my baby can reach something new, tell me what to change at home, one stage at a time."
   A step belongs here only if it is (1) a one-time change to the baby's surroundings (home, car seat, crib, gear),
   (2) brought on by a new stage (coming home, rolling, crawling, pulling up), and (3) specific to babies.
   Habits live with their activity (Everyday care, Sleep, Feeding). Sleep owns the sleep space: its steps appear here
   at the right stage but open Sleep's own page, so the advice lives in one place.
   Each stage page: the big idea, four or five steps to tick, the safety-net card, and what's next. */
(function () {
  const H = () => window.__hub, F = s => H().F(s);
  const C = { car: ['#e7effc', '#46638c'], sleep: ['#e3e6f6', '#3d4a7a'], body: ['#fdeee6', '#9a5a3c'], floor: ['#fff3dc', '#8a6a2a'], home: ['#e6f5ec', '#356651'], high: ['#fdeef2', '#a24d6a'] };
  const SAND = ['#f7e6c4', '#795b2c', '#e8c98e', '#f4d6c4'];
  const cpsc = 'https://www.cpsc.gov/safety-education/safety-guides/kids-and-babies/Childproofing-Your-Home';
  const aap = 'https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Childproofing-Your-Home.aspx';
  const item = id => (typeof safetyHomeItems === 'function' ? safetyHomeItems()[id] : null) || {};
  // Every step: title, the one line under it, its icon and color, and either a how-to here or a page elsewhere (Sleep).
  const STEP = {
    seat: { t: 'Install the car seat rear-facing', s: 'A trained checker can look it over, often for free', i: 'car', c: 'car',
      why: 'The car seat is the one piece of gear every baby uses from the first ride home.',
      steps: ['Install it rear-facing in the back seat, following the seat and car manuals.', 'Check the harness: straps at or below {p} shoulders, no slack you can pinch, chest clip at armpit level.', 'Keep {o} rear-facing for as long as the seat allows.'],
      tip: ['Get it checked', 'Trained car-seat checkers can look over the installation and show you the harness fit. Many fire stations and hospitals offer it, often for free.'],
      links: [['Find a car-seat check near you · NHTSA', 'https://www.nhtsa.gov/campaign/right-seat']] },
    sleep: { t: 'Set up a bare crib', s: 'Firm, flat and empty, in your room', i: 'moon', c: 'sleep', go: "openPage('chg:Sleep:safe')", sleep: true },
    changing: { t: 'Set up your changing spot', s: 'Supplies within arm’s reach, or a mat on the floor', i: 'diaper', c: 'body',
      why: 'Babies wriggle and roll sooner than you expect, and a fall from a changing table is one of the most common early injuries.',
      steps: ['Keep diapers, wipes and a change of clothes within arm’s reach of the changing spot.', 'On a raised table, use the strap and keep one hand on {o}, every time.', 'Or change {o} on a mat on the floor, where there’s nothing to fall from.'],
      tip: ['Never step away', 'Even for a second. A strap doesn’t replace a hand on {o}.'] },
    gear: { t: 'Check swings and bouncers', s: 'Weight limits and straps, and never for sleep', i: 'mat', c: 'floor', go: "openPage('chg:Safety:d:gear')", own: true },
    swaddle: { t: 'Stop swaddling at the first roll', s: 'Then a sleep sack, arms free', i: 'sack', c: 'sleep', go: "openPage('chg:Sleep:d:swaddleoff')", sleep: true },
    bassinet: { t: 'Move from the bassinet to the crib', s: 'Once {s} {roll|rolls}, or at the bassinet’s weight limit', i: 'crib', c: 'sleep', go: "openPage('chg:Sleep:d:where')", sleep: true },
    small: { t: 'Clear the floor where {s} {play|plays}', s: 'Coins, button batteries and small parts out of reach', i: 'coin', c: 'floor',
      why: 'Rolling brings the floor within reach, and everything {s} {find|finds} goes in {p} mouth.',
      steps: ['Look around {p} play space at floor level for coins, magnets and pieces of older children’s toys.', 'Anything that fits inside an empty toilet-paper tube is small enough to choke on. Keep it out of reach.', 'Check that remotes, key fobs, musical books and toys have battery covers that screw shut. Keep spare batteries up high.'],
      tip: ['Button batteries are an emergency', 'If you think {s} swallowed a button battery or a magnet, go to the ER right away.'],
      links: [['Small-object checks · CHOP', 'https://www.chop.edu/centers-programs/injury-prevention-program/choking-and-suffocation']] },
    bags: { t: 'Give visitors’ bags a place up high', s: 'They often hold medicines', i: 'bag', c: 'body',
      why: 'Purses and backpacks often hold medicines, gum or batteries, and they usually end up on the floor.',
      steps: ['Pick a spot up high, like a hook or a closet shelf, for bags and coats.', 'Ask visitors to put their bags there when they arrive.'],
      tip: ['Child-resistant isn’t childproof', 'Caps slow children down but don’t stop them. Medicines still need to be up high and locked.'] },
    gates: { t: 'Fit stair gates', s: 'Screwed in at the top, so it can’t give way', i: 'gate', c: 'car',
      why: 'Once {s} {crawl|crawls}, stairs are the biggest fall risk at home.',
      steps: ['At the top of the stairs, use a gate that screws into the wall. A gate that only presses against the walls can give way.', 'At the bottom, either kind is fine.', 'Use gates made for children, and follow their instructions.'],
      tip: ['Skip seated walkers with wheels', 'They let babies move fast toward stairs and other hazards, and they don’t help with walking. Floor play or a stationary activity center is safer.'],
      links: [['Baby walkers · AAP', 'https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Baby-Walkers-A-Dangerous-Choice.aspx']] },
    storage: { t: 'Lock up cabinets and drawers', s: 'Medicines, cleaners, knives and plastic bags locked up; bathroom and laundry closed off', i: 'lock', c: 'high',
      why: 'Crawling babies open every low door and drawer they can reach.',
      steps: ['Fit child latches or locks on cabinets and drawers that hold medicines, cleaners, detergent pods, knives or plastic bags.', 'Better still, move medicines and cleaners up high as well as latched.', 'Keep the bathroom, laundry room and garage closed off with door knob covers or a gate.'],
      tip: ['Relatch every time', 'Pull the door after you close it to check the latch holds.'],
      links: [['What to lock away · AAP', aap]] },
    outlets: { t: 'Cover outlets and move cords', s: 'Covers too big to swallow', i: 'plug', c: 'floor',
      why: 'Outlets and cords sit right at crawling height.',
      steps: ['Use plug-in outlet covers {s} can’t pull out and that are too big to swallow.', 'Move lamp and charger cords out of reach, or tuck them behind furniture.', 'If you’re replacing outlets, tamper-resistant ones have built-in shutters.'],
      links: [['Childproofing your home · CPSC', cpsc]] },
    mattress: { t: 'Lower the crib mattress', s: 'Before or as soon as {s} {sit|sits}', i: 'crib', c: 'sleep', go: "openPage('chg:Sleep:d:mattress')", sleep: true },
    anchor: { t: 'Strap furniture and TVs to the wall', s: 'So they can’t tip if {s} {pull|pulls} on them', i: 'dresser', c: 'body',
      why: 'Babies use furniture as a handhold to pull up, and dressers, bookcases and TVs can tip over onto them.',
      steps: ['Fit anti-tip straps to dressers, bookcases and other tall furniture {s} could pull on.', 'Mount TVs on the wall, or strap them to the furniture they stand on.', 'Do it any time before {s} {pull|pulls} up. Many families do it while babyproofing for crawling.'],
      links: [['Anchor it · CPSC', cpsc]] },
    windows: { t: 'Make windows and blinds safe', s: 'Open no more than 4 inches, and no hanging cords', i: 'window', c: 'car',
      why: 'Standing puts windows and blind cords within reach.',
      steps: ['Fit window stops, small locks that keep windows from opening more than 4 inches. Screens don’t stop falls.', 'Keep at least one window in each room that an adult can open fully in a fire.', 'Swap corded blinds and shades for cordless ones. Hanging cords and loops can wrap around a baby’s neck.', 'Move cribs and furniture {s} could climb away from windows.'],
      links: [['Window safety · CPSC', cpsc]] },
    kitchen: { t: 'Fit stove knob covers and an oven lock', s: 'Once {s} can reach the front of the stove', i: 'fridge', c: 'high',
      why: 'Standing brings stove knobs and the oven door within reach.',
      steps: ['Fit knob covers so {s} can’t turn the burners on.', 'Add an oven lock so the door stays shut.', 'Cook on the back burners when you can, with pot handles turned in.'],
      links: [['Childproofing your home · CPSC', cpsc]] },
    pool: { t: 'Block the way to water', s: 'A toilet lock, a shut bathroom, and a fenced pool', i: 'bath', c: 'home',
      why: 'Babies can drown in a few inches of water, quickly and quietly.',
      steps: ['Fit a toilet-lid lock, and keep the bathroom door closed.', 'Empty buckets, tubs and wading pools right after use.', 'If you have a pool or spa, fence it on all sides with a self-closing, self-latching gate.'],
      tip: ['Barriers don’t replace watching', 'Stay within arm’s reach whenever {s’s} near water.'],
      links: [['Pool Safely · CPSC', 'https://www.poolsafely.gov/parents/safety-tips/']] },
    mattress2: { t: 'Set the crib mattress to its lowest', s: 'Before or as soon as {s} {stand|stands}', i: 'crib', c: 'sleep', go: "openPage('chg:Sleep:d:mattress')", sleep: true }
  };
  const STAGES = [
    { key: 'setup', label: 'First setup', age: 'From birth', title: 'Set up a few things before Maya comes home', lead: 'Before {s} can move, it’s about the car seat, where {s} {sleep|sleeps} and where {s’s} changed.', ids: ['seat', 'sleep', 'changing', 'gear'] },
    { key: 'reaching', label: 'Rolling', age: '3–6 months', title: 'Rolling puts the floor in reach', lead: 'Once Maya rolls, {s} can get out of a swaddle or a bassinet, and small things on the floor are in reach.', ids: ['swaddle', 'bassinet', 'small', 'bags'] },
    { key: 'rolling', label: 'Crawling', age: '6–9 months', title: 'Crawling opens up every room', lead: 'Most babies start moving between 6 and 10 months. Do the low, reachable things first.', ids: ['gates', 'storage', 'outlets', 'mattress'] },
    { key: 'pulling', label: 'Pulling up', age: '9 months+', title: 'Standing brings everything higher into reach', lead: 'Furniture becomes a handhold, and windows, the stove and water are suddenly within reach.', ids: ['anchor', 'windows', 'kitchen', 'pool', 'mattress2'] }
  ];
  const group = k => k === 'moving' ? 'rolling' : k;
  const stageOf = id => STAGES.find(st => st.ids.includes(id));

  /* ---------- done or doesn't apply ---------- */
  const data = () => journeyData();
  const stored = id => ((data().checks || {}).safetyHome || {})[id] || '';
  function status(id) {
    // Sleep's own answers count, so ticking in either place shows in both.
    if (id === 'swaddle') return answers.swaddleStopped === 'Yes' || answers.neverSwaddled ? 'done' : stored(id);
    if (id === 'mattress') return answers.mattressLowered === 'Yes' || answers.mattressLowest === 'Yes' ? 'done' : stored(id);
    if (id === 'mattress2') return answers.mattressLowest === 'Yes' ? 'done' : stored(id);
    if (id === 'sleep' && typeof safeDone === 'function' && typeof SLEEP_TASKS !== 'undefined' && safeDone() === SLEEP_TASKS) return 'done';
    if (id === 'small') { const a = stored('small'), b = stored('batteries'); return a === 'done' || b === 'done' ? 'done' : a || b; }
    return stored(id);
  }
  window.sfSet = function (id, v) {
    const d = data(); d.checks.safetyHome = Object.assign({}, d.checks.safetyHome);
    const ids = id === 'small' ? ['small', 'batteries'] : id === 'storage' ? ['storage', 'doors'] : id === 'windows' ? ['windows', 'cords'] : [id];
    ids.forEach(x => { if (v) d.checks.safetyHome[x] = v; else delete d.checks.safetyHome[x]; });
    if (id === 'swaddle' && v === 'done') answers.swaddleStopped = 'Yes';
    if (id === 'mattress' && v === 'done') answers.mattressLowered = 'Yes';
    if (id === 'mattress2' && v === 'done') answers.mattressLowest = 'Yes';
    if (typeof persist === 'function') persist();
    saveJourneyData(d); const y = scrollY; render(); scrollTo(0, y);
  };
  const open = id => STEP[id].go || `openPage('chg:Safety:d:step:${id}')`;

  /* ---------- the stage page ---------- */
  window.safetyMovementGuide = safetyMovementGuide = function (selected = null) {
    const h = H(), live = typeof isCurrent !== 'function' || isCurrent();
    const now = group(typeof safetyStageNow === 'function' ? safetyStageNow() : 'setup'), key = group(STAGES.some(s => s.key === group(selected)) ? selected : now);
    const i = Math.max(0, STAGES.findIndex(s => s.key === key)), st = STAGES[i], nx = STAGES[i + 1];
    const nowI = STAGES.findIndex(s => s.key === now);
    const pills = h.pills('Safety by movement', STAGES.map((s, j) => ({ label: s.label, age: s.age, on: j === i, now: live && j === nowI, onclick: `openPage('safety-stage:${s.key}')`, change: typeof stageCanChange === 'function' && stageCanChange('Safety', j, nowI) ? `hubChangeStage('Safety',${j})` : '' })), 'Safety');
    const sts = st.ids.map(status), done = sts.filter(x => x === 'done').length, na = sts.filter(x => x === 'na').length, of = st.ids.length - na;
    const rows = st.ids.map((id, k) => { const x = STEP[id], c = C[x.c], s = sts[k];
      return `<button class="hub-row hl-row sf-row${s ? ' is-' + s : ''}" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="${open(id)}"><span class="hub-dot">${hubArt(x.i, 'Safety')}</span><span class="hub-row-copy"><b>${F(x.t)}</b><small>${s === 'na' ? 'Doesn’t apply to your home' : F(x.s) + (x.sleep ? ' · In Sleep' : '')}</small></span><span class="sf-tick" aria-hidden="true">${s === 'done' ? '✓' : s === 'na' ? '–' : ''}</span></button>`; }).join('');
    let b = `<header class="hub-hero sf-hero"><p class="hub-eyebrow">${st.label} · ${st.age}</p><h1>${F(st.title)}</h1><p class="hub-lead">${F(st.lead)}</p></header>`;
    b += `<div class="sf-head"><h2 class="hub-h2">${F(i < nowI && live ? 'Done these yet?' : 'Do these now')}</h2><span class="sf-count">${of ? `${done} of ${of} done` : 'None apply'}</span></div><div class="hub-list sf-list">${rows}</div>`;
    b += h.versus('If something goes wrong', ['Poison Help', 'Call 1-800-222-1222 if Maya swallows something that could be harmful.'], ['Call 911', 'If {s} can’t breathe or won’t wake. A swallowed battery or magnet means the ER right away.']);
    if (nx) b += h.next(`Next: ${nx.label}, around ${nx.age.replace(/\D.*$/, '')} months`, nx.title, `openPage('safety-stage:${nx.key}')`);
    b += h.note('Ages are typical. Every baby moves at their own pace.');
    return `<div class="quiet-category hub-page" data-overview="Safety" data-safety-stage="${key}" style="${yearTheme('Safety')}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader('Safety') : ''}${pills}${b}</div>`;
  };

  /* ---------- a step's how-to ---------- */
  function stepPage(id) {
    const x = STEP[id], h = H(); if (!x || x.go) return safetyMovementGuide();
    const st = stageOf(id), s = status(id), c = C[x.c];
    const head = `<div class="dev-area-head ss-head" style="--area:${SAND[0]};--area-ink:${SAND[1]}"><span class="dev-area-head-art"><svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="30" width="78" height="6" rx="3" fill="${SAND[2]}"/><circle cx="24" cy="22" r="8" fill="${SAND[3]}"/><rect x="48" y="12" width="20" height="18" rx="4" fill="${SAND[2]}"/></svg></span><p class="hub-context">${st ? st.label : 'Safety'}</p><h1>${F(x.t)}</h1><p class="hub-lead">${F(x.why)}</p></div>`;
    const actions = s === 'done' ? `<p class="hub-done">${F('Done')} ✓</p><button class="hub-link" onclick="sfSet('${id}','')">${F('Undo')}</button>`
      : `<button class="hub-button" onclick="sfSet('${id}','done');back()">${F('Mark as done')}</button><button class="hub-link sf-na" onclick="sfSet('${id}','${s === 'na' ? '' : 'na'}');back()">${F(s === 'na' ? 'It applies after all' : 'Doesn’t apply to our home')}</button>`;
    const links = (x.links || []).map(([t, u]) => `<a class="hub-more" href="${u}" target="_blank" rel="noopener"><span>${F(t)}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`).join('');
    return `<div class="quiet-category hub-page hub-detail" data-overview="Safety" data-ss="1" style="${yearTheme('Safety')};--ss-bg:${c[0]};--ss-ink:${c[1]}">${detailPageTop('Safety')}${head}`
      + h.steps(x.steps.map(F)) + (x.tip ? h.tip(x.tip[0], x.tip[1]) : '') + `<div class="hub-actions sf-actions">${actions}</div>` + links + `</div>`;
  }

  /* ---------- routes, and older links into the new pages ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) { const m = /^chg:Safety:d:step:(\w+)$/.exec(p); return m ? stepPage(m[1]) : baseRoute(p); };
  // Older checklist ids open the step that now holds them.
  const MAP = { batteries: 'small', rollspace: 'small', doors: 'storage', cords: 'windows', walkers: 'gates', changing: 'changing', seat: 'seat', small: 'small', bags: 'bags', gates: 'gates', storage: 'storage', outlets: 'outlets', anchor: 'anchor', windows: 'windows', pool: 'pool' };
  window.openHomeSafetyCheck = openHomeSafetyCheck = function (owner, id) { const to = MAP[id]; openPage(to ? `chg:Safety:d:step:${to}` : 'topic:Safety'); };
  window.openSafetyChecklist = openSafetyChecklist = function () { openPage('topic:Safety'); };
})();
