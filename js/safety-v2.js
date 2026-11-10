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
  // Swaddling follows Sleep's age (adjusted for babies born early); the pulling-up line follows Safety's own stage.
  const sleepAge = () => (typeof hubAgeFor === 'function' ? hubAgeFor('care') : typeof month !== 'undefined' ? month : 0);
  const pullingNow = () => answers.pullUp === 'Yes' || ((typeof isCurrent !== 'function' || isCurrent()) && typeof safetyStageNow === 'function' && safetyStageNow() === 'pulling');
  const item = id => (typeof safetyHomeItems === 'function' ? safetyHomeItems()[id] : null) || {};
  // Every step: title, the one line under it, its icon and color, and either a how-to here or a page elsewhere (Sleep).
  const STEP = {
    seat: { t: 'Install the car seat rear-facing', s: 'A trained checker can look it over, often for free', i: 'car', c: 'car', go: "openPage('chg:Out and about:d:car')", out: true,
      why: 'The car seat is the one piece of gear every baby uses from the first ride home.',
      steps: ['Install it rear-facing in the back seat, following the seat and car manuals.', 'Check the harness: straps at or below {p} shoulders, no slack you can pinch, chest clip at armpit level.', 'Keep {o} rear-facing for as long as the seat allows.'],
      tip: ['Get it checked', 'Trained car-seat checkers can look over the installation and show you the harness fit. Many fire stations and hospitals offer it, often for free.'],
      links: [['Find a car-seat check near you · NHTSA', 'https://www.nhtsa.gov/campaign/right-seat']] },
    sleep: { t: 'Set up a bare crib', s: 'Firm, flat and empty, in your room', i: 'moon', c: 'sleep', go: "openPage('chg:Sleep:safe')", sleep: true },
    cribspot: { t: 'Keep the crib or bassinet away from windows', s: 'And away from blind and monitor cords', i: 'window', c: 'sleep',
      tiles: [['crib', 'Away from windows', 'Not under or right beside one'], ['cord', 'Cordless blinds', 'Tying up the cord isn’t enough'], ['home', 'Monitor cords', 'At least 3 feet from the crib']],
      why: 'Cords from blinds, shades and monitors can wrap around {p} neck. It can happen from birth, so this comes first.',
      steps: ['Put the crib or bassinet away from windows.', 'Swap corded blinds and shades near it for cordless ones. Tying up the pull cord isn’t enough.', 'Keep monitor cords at least 3 feet from the crib or bassinet.'],
      links: [['Window covering cords · CPSC', cpsc]] },
    changing: { t: 'Set up your changing spot', s: 'Supplies within arm’s reach, or a mat on the floor', i: 'diaper', c: 'body',
      vs: ['Where to change {o}', ['On a changing table', 'Use the strap, and keep one hand on {o} every time.'], ['On the floor', 'A mat on the floor. Never a bed or sofa, even for a second.']], tiles: null,
      tip: ['Everything within reach', 'Diapers, wipes and a change of clothes, so you never need to step away.'],
      why: 'Babies wriggle and roll sooner than you expect, and a fall from a changing table is one of the most common early injuries.',
      steps: ['Keep diapers, wipes and a change of clothes within arm’s reach of the changing spot.', 'On a raised table, use the strap and keep one hand on {o}, every time.', 'Or change {o} on a mat on the floor. Never leave {o} on a bed or sofa, even for a second.'],
    },
    gear: { t: 'Check swings and bouncers', s: 'Weight limits and straps, and never for sleep', i: 'mat', c: 'floor',
      tiles: [['notepad', 'Check the limits', 'Weight and age, on the label'], ['shield', 'Straps on', 'Every time, even for a minute'], ['home', 'On the floor', 'Never a table, counter, bed or sofa'], ['moon', 'Not for sleep', 'Asleep? Move {o} to {p} crib']],
      why: 'Swings, bouncers and floor seats are handy for a few hands-free minutes. A quick check keeps them safe.',
      steps: ['Check the label for weight and age limits, and stop once {s} {reach|reaches} them.', 'Use the straps every time, even for a minute.', 'Keep them on the floor, never on a table, counter, bed or sofa.', 'They’re not for sleep. If {s} {fall|falls} asleep, move {o} to {p} crib, on {p} back.'],
      tip: ['When to stop using a bouncer', 'Once {s} can sit up on {p} own or {try|tries} to climb out, even under the weight limit.'],
      tip2: ['Stay close', 'Keep {o} within sight, and keep older kids and pets from rocking or pushing it.'] },
    swaddle: { t: 'Stop swaddling at the first try to roll', get s() { return sleepAge() >= 4 ? 'If {s’s} still swaddled, stop now. Then a sleep sack, arms free' : 'Some babies try at 2 months. Then a sleep sack, arms free'; }, i: 'sack', c: 'sleep', go: "openPage('chg:Sleep:d:swaddleoff')", sleep: true },
    bassinet: { t: 'Move from the bassinet to the crib', s: 'Once {s} {try|tries} to roll or push up, or at its weight limit', i: 'crib', c: 'sleep', go: "openPage('chg:Sleep:d:where')", sleep: true },
    small: { t: 'Clear the floor where {s} {play|plays}', s: 'Coins, button batteries and small parts out of reach', i: 'coin', c: 'floor',
      fig: 'tube', tiles: [['mat', 'A firm play mat', 'On the floor, away from edges and cords'], ['eye', 'Floor check', 'Coins, magnets, older kids’ toys'], ['battery', 'Battery covers screwed shut', 'On remotes, key fobs and musical toys']],
      why: 'Rolling brings the floor within reach, and everything {s} {find|finds} goes in {p} mouth.',
      steps: ['Give {o} a firm play mat on the floor, away from furniture edges and cords. Beds and sofas aren’t safe for rolling practice.', 'Look around {p} play space at floor level for coins, magnets and pieces of older children’s toys.', 'Anything that fits inside an empty toilet-paper tube is small enough to choke on. Keep it out of reach.', 'Check that remotes, key fobs, musical books and toys have battery covers that screw shut. Keep spare batteries up high.'],
      tip: ['Button batteries are an emergency', 'If you think {s} swallowed a button battery or a magnet, go to the ER right away.'],
      links: [['Small-object checks · CHOP', 'https://www.chop.edu/centers-programs/injury-prevention-program/choking-and-suffocation']] },
    bags: { t: 'Give visitors’ bags a place up high', s: 'They often hold medicines', i: 'bag', c: 'body',
      why: 'Purses and backpacks often hold medicines, gum or batteries, and they usually end up on the floor.',
      steps: ['Pick a spot up high, like a hook or a closet shelf, for bags and coats.', 'Ask visitors to put their bags there when they arrive.'],
      tip: ['Child-resistant isn’t childproof', 'Caps slow children down but don’t stop them. Medicines still need to be up high and locked.'] },
    gates: { t: 'Fit stair gates', s: 'Screwed in at the top, so it can’t give way', i: 'gate', c: 'car',
      vs: ['Which gate where', ['Top of the stairs', 'A gate that screws into the wall. One that presses against the walls can give way.'], ['Bottom of the stairs', 'Either kind is fine.']], tiles: null, note: 'Use a gate made for babies, and fit it the way its instructions say.',
      why: 'Once {s} {crawl|crawls}, stairs are the biggest fall risk at home.',
      steps: ['At the top of the stairs, use a gate that screws into the wall. A gate that only presses against the walls can give way.', 'At the bottom, either kind is fine.', 'Use a gate made for babies, and fit it the way its instructions say.'],
      tip: ['Skip seated walkers with wheels', 'They let babies move fast toward stairs and other hazards, and they don’t help with walking. Floor play or a stationary activity center is safer.'],
      links: [['Room-by-room babyproofing · AAP', aap], ['Find a professional childproofer · Paid', 'https://www.childproofingexperts.com/find-a-professional/'], ['Seated walkers · AAP', 'https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Baby-Walkers-A-Dangerous-Choice.aspx']] },
    storage: { hi: 'crawl', t: 'Lock up cabinets and drawers', s: 'Medicines, cleaners, knives and bags', i: 'lock', c: 'high',
      tiles: [['lock', 'Latch it', 'Medicines, cleaners, pods, knives, bags'], ['up', 'Up high too', 'Medicines and cleaners, as well as latched'], ['home', 'Close off rooms', 'Bathroom, laundry and garage, with door-knob covers or a gate']],
      why: 'Crawling babies open every low door and drawer they can reach.',
      steps: ['Fit child latches or locks on cabinets and drawers that hold medicines, cleaners, detergent pods, knives or plastic bags.', 'Better still, move medicines and cleaners up high as well as latched.', 'Keep the bathroom, laundry room and garage closed off with door knob covers or a gate.'],
      tip: ['Relatch every time', 'Pull the door after you close it to check the latch holds.'],
      links: [['What to lock away · AAP', aap]] },
    outlets: { hi: 'crawl', t: 'Cover outlets and move cords', s: 'Covers too big to swallow', i: 'plug', c: 'floor',
      tiles: [['plug', 'Outlet covers', 'Too big to swallow, and hard to pull out'], ['cord', 'Cords out of reach', 'Lamps and chargers behind furniture'], ['shield', 'Replacing outlets?', 'Tamper-resistant ones have built-in shutters']],
      why: 'Outlets and cords sit right at crawling height.',
      steps: ['Use plug-in outlet covers {s} can’t pull out and that are too big to swallow.', 'Move lamp and charger cords out of reach, or tuck them behind furniture.', 'If you’re replacing outlets, tamper-resistant ones have built-in shutters.'],
      links: [['Childproofing your home · CPSC', cpsc]] },
    mattress: { t: 'Lower the crib mattress', s: 'Once {s} can sit up, the lowest setting is safest', i: 'crib', c: 'sleep', go: "openPage('chg:Sleep:d:mattress')", sleep: true },
    anchor: { hi: 'stand', t: 'Strap furniture and TVs to the wall', s: 'So nothing tips if {s} {pull|pulls} on it', i: 'dresser', c: 'body',
      tiles: [['dresser', 'Anti-tip straps', 'On dressers, bookcases and tall furniture'], ['blocks', 'TVs too', 'On the wall, or strapped to their stand'], ['clock', 'When', 'Now, before {s} {pull|pulls} on them']],
      why: 'Babies use furniture as a handhold to pull up, and dressers, bookcases and TVs can tip over onto them.',
      steps: ['Fit anti-tip straps to dressers, bookcases and other tall furniture {s} could pull on.', 'Mount TVs on the wall, or strap them to the furniture they stand on.', 'Do it any time before {s} {pull|pulls} up. Many families do it while babyproofing for crawling.'],
      links: [['Anchor it · CPSC', cpsc]] },
    windows: { hi: 'stand', t: 'Make windows and blinds safe', s: 'Open no more than 4 inches, and no hanging cords', i: 'window', c: 'car',
      tiles: [['window', 'Window stops', 'Open 4 inches at most. Screens don’t stop falls'], ['home', 'One way out', 'One window per room an adult can open fully, for a fire'], ['cord', 'Cordless blinds', 'Tied-up cords can still be reached'], ['dresser', 'Furniture away', 'Nothing to climb near a window']],
      why: 'Standing puts windows and blind cords within reach.',
      steps: ['Fit window stops, small locks that keep windows from opening more than 4 inches. Screens don’t stop falls.', 'Keep at least one window in each room that an adult can open fully in a fire.', 'Swap corded blinds and shades for cordless ones. Tying up the pull cord isn’t enough: inner cords and loops can still be reached, from the floor or from furniture.', 'Move furniture {s} could climb away from windows.'],
      links: [['Window safety · CPSC', cpsc]] },
    kitchen: { hi: 'stand', t: 'Fit stove knob covers and an oven lock', s: 'Before {s} can reach the front of the stove', i: 'stove', c: 'high',
      tiles: [['stove', 'Knob covers', 'So the burners can’t be turned on'], ['lock', 'An oven lock', 'So the door stays shut'], ['pot', 'Back burners', 'With pot handles turned in']],
      why: 'Standing brings stove knobs and the oven door within reach.',
      steps: ['Fit knob covers so {s} can’t turn the burners on.', 'Add an oven lock so the door stays shut.', 'Cook on the back burners when you can, with pot handles turned in.'],
      links: [['Childproofing your home · CPSC', cpsc]] },
    pool: { hi: 'stand', t: 'Keep water out of reach', s: 'A toilet lock, a shut bathroom, and a fenced pool', i: 'bath', c: 'home',
      tiles: [['bath', 'Bathroom shut', 'A toilet-lid lock, and the door closed'], ['drop', 'Empty it', 'Buckets, tubs and wading pools, right after use'], ['shield', 'Fence the pool', 'All sides, with a self-closing, self-latching gate']],
      why: 'Babies can drown in an inch or two of water, quickly and quietly.',
      steps: ['Fit a toilet-lid lock, and keep the bathroom door closed.', 'Empty buckets, tubs and wading pools right after use.', 'If you have a pool or spa, fence it on all sides with a self-closing, self-latching gate. Keep doors to it locked, and close the gate every time.'],
      tip: ['Barriers don’t replace watching', 'Stay within arm’s reach whenever {s’s} near water.'],
      links: [['Pool Safely · CPSC', 'https://www.poolsafely.gov/parents/safety-tips/']] },
    mattress2: { t: 'Set the crib mattress to its lowest', get s() { return pullingNow() ? 'Now that Maya’s pulling up' : 'Before {s} can pull up'; }, i: 'crib', c: 'sleep', go: "openPage('chg:Sleep:d:mattress')", sleep: true }
  };
  const STAGES = [
    { key: 'setup', label: 'First setup', age: 'From birth', title: 'Five things to set up once', lead: 'Before Maya can move, safety is about where {s} {ride|rides}, {sleep|sleeps} and {get|gets} changed.', ids: ['seat', 'sleep', 'cribspot', 'changing', 'gear'] },
    { key: 'reaching', label: 'Rolling', age: '3–6 months', title: 'Rolling puts the floor in reach', lead: 'At the first sign of rolling, the swaddle comes off and the floor needs clearing. Rolling brings small things within reach, and a bassinet stops being safe.', ids: ['swaddle', 'bassinet', 'small', 'bags'] },
    { key: 'rolling', label: 'Crawling', age: '6–9 months', title: 'Crawling opens up every room', lead: 'Most babies start crawling between 6 and 9 months. Do the low, reachable things first.', ids: ['gates', 'storage', 'outlets', 'mattress'] },
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
    if (id === 'bassinet' && answers.inCrib === 'Yes') return 'done';
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
    if (id === 'bassinet' && v === 'done') answers.inCrib = 'Yes';
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
      return `<button class="hub-row hl-row sf-row${s ? ' is-' + s : ''}" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="${open(id)}"><span class="hub-dot">${hubArt(x.i, 'Safety')}</span><span class="hub-row-copy"><b>${F(x.t)}</b><small>${s === 'na' ? 'Doesn’t apply to your home' : F(x.s) + (x.sleep ? ' · In Sleep' : x.out ? ' · In Outings' : '')}</small></span><span class="sf-tick" role="checkbox" aria-checked="${s === 'done'}" aria-label="Mark done: ${x.t.replace(/"/g, '')}" onclick="event.stopPropagation();sfSet('${id}','${s === 'done' ? '' : 'done'}')">${s === 'done' ? '✓' : s === 'na' ? '–' : ''}</span></button>`; }).join('');
    let b = `<header class="hub-hero sf-hero"><p class="hub-eyebrow">${st.label} · ${st.age}</p><h1>${F(st.title)}</h1><p class="hub-lead">${F(st.lead)}</p></header>`;
    b += `<div class="sf-head"><h2 class="hub-h2">${F(i < nowI && live ? 'Done these yet?' : i > nowI && live ? 'Get ready for this' : 'Do these now')}</h2><span class="sf-count">${of ? (done ? `${done} of ${of} done` : '') : 'None apply'}</span></div><div class="hub-list sf-list">${rows}</div>`;
    // Joined later, or skipped a stage? One quiet line back to the earliest stage with steps still open.
    if (live && i === nowI) {
      // Only stages that started while the parent was using Ahead: a parent who joins later has done the earlier steps.
      const START = { setup: 0, reaching: 3, rolling: 6, pulling: 9 };
      let joinMo = 0; try { if (profile.joined && profile.dob) joinMo = (parse(profile.joined) - parse(profile.dob)) / 864e5 / 30.44; } catch (e) {}
      const left = STAGES.slice(0, i).filter(s2 => (START[s2.key] ?? 0) >= joinMo - 0.5).map(s2 => [s2, s2.ids.filter(x => !status(x)).length]).filter(x => x[1]);
      if (left.length) b += `<button class="sf-earlier" onclick="openPage('safety-stage:${left[0][0].key}')">${F(`${left.reduce((t, x) => t + x[1], 0)} ${left.reduce((t, x) => t + x[1], 0) === 1 ? 'earlier step is' : 'earlier steps are'} still open`)} ›</button>`;
    }
    b += h.versus('If something goes wrong', ['Poison Help', 'Call 1-800-222-1222 if Maya swallows something that could be harmful.'], ['Call 911', 'If {s} can’t breathe or won’t wake. A swallowed battery or magnet means the ER right away.']);
    // Choking first aid lives in Feeding; the safety net links to it.
    b += `<div class="hub-browse"><button class="hub-link" onclick="openPage('chg:Feeding:safe')">${F(typeof actualMonth === 'function' && actualMonth() >= 12 ? 'Learn choking first aid for a child' : 'Learn infant choking first aid')} ›</button></div>`;
    if (nx) b += h.next(`Next: ${nx.label}, from about ${nx.age.replace(/\D.*$/, '')} months`, nx.title, `openPage('safety-stage:${nx.key}')`);
    b += h.note('Ages are typical. Every baby moves at their own pace.');
    return `<div class="quiet-category hub-page" data-overview="Safety" data-safety-stage="${key}" style="${yearTheme('Safety')}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader('Safety') : ''}${pills}${b}</div>`;
  };

  // The toilet-paper tube test, as a picture: anything that fits through it is small enough to choke on.
  const tubeFigure = () => `<figure class="hub-figure sf-tube" role="img" aria-label="${F('Anything that fits through an empty toilet-paper tube is small enough to choke on.')}"><svg viewBox="0 0 220 96" aria-hidden="true"><ellipse cx="70" cy="48" rx="34" ry="34" fill="#fff" stroke="#c9a46a" stroke-width="3"/><ellipse cx="70" cy="48" rx="22" ry="22" fill="#f7e6c4" stroke="#c9a46a" stroke-width="2"/><circle cx="64" cy="44" r="5" fill="#b9b1a4"/><circle cx="76" cy="52" r="4" fill="#8f8a83"/><rect x="66" y="36" width="10" height="6" rx="2" fill="#e38b6d"/><path d="M118 48h30" stroke="#795b2c" stroke-width="3" stroke-linecap="round"/><path d="m142 40 8 8-8 8" fill="none" stroke="#795b2c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="182" cy="48" r="16" fill="#fde3d3"/><path d="M174 48h16" stroke="#9a5a3c" stroke-width="3" stroke-linecap="round"/></svg><figcaption><b>${F('The tube test')}</b>${F('If it fits through an empty toilet-paper tube, it’s small enough to choke on. Keep it out of reach.')}</figcaption></figure>`;

  /* ---------- a step's how-to ---------- */
  function stepPage(id) {
    const x = STEP[id], h = H(); if (!x || x.go) return safetyMovementGuide();
    const st = stageOf(id), s = status(id), c = C[x.c];
    const head = `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}"><span class="dev-area-head-art sf-head-art">${hubArt(x.hi || x.i, 'Safety')}</span><p class="hub-context">${F(st ? st.label : 'Safety')}</p><h1>${F(x.t)}</h1>${x.why ? `<p class="hub-lead">${F(x.why)}</p>` : ''}</div>`;
    const actions = s === 'done' ? `<p class="hub-done">${F('Done')} ✓</p><button class="hub-link" onclick="sfSet('${id}','')">${F('Undo')}</button>`
      : `<button class="hub-button" onclick="sfSet('${id}','done');back()">${F('Mark as done')}</button><button class="hub-link sf-na" onclick="sfSet('${id}','${s === 'na' ? '' : 'na'}');back()">${F(s === 'na' ? 'It applies after all' : 'Doesn’t apply to our home')}</button>`;
    const links = (x.links || []).map(([t, u]) => `<a class="hub-more" href="${u}" target="_blank" rel="noopener"><span>${t}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`).join('');
    return `<div class="quiet-category hub-page hub-detail" data-overview="Safety" data-ss="1" style="${yearTheme('Safety')};--ss-bg:${c[0]};--ss-ink:${c[1]}">${detailPageTop('Safety')}${head}`
      + (x.vs ? h.versus(x.vs[0], x.vs[1], x.vs[2]).replace('is-urgent', 'is-choice') : '')
      + (x.fig === 'tube' ? tubeFigure() : '')
      + (x.tiles ? hubIconSteps(x.tiles, 'Safety', F(x.tiles.map(t => t[1] + ': ' + t[2]).join('. ')), false) : x.tiles === null ? '' : h.steps(x.steps.map(F)))
      + (x.note ? `<p class="sf-note">${F(x.note)}</p>` : '')
      + (x.tip ? h.tip(x.tip[0], x.tip[1]) : '') + (x.tip2 ? h.tip(x.tip2[0], x.tip2[1]) : '') + `<div class="hub-actions sf-actions">${actions}</div></div>`;
  }

  /* ---------- routes, and older links into the new pages ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) { const m = /^chg:Safety:d:(?:step:(\w+)|(gear))$/.exec(p); return m ? stepPage(m[1] || m[2]) : baseRoute(p); };
  // Older checklist ids open the step that now holds them.
  const MAP = { batteries: 'small', rollspace: 'small', doors: 'storage', cords: 'windows', cribspot: 'cribspot', walkers: 'gates', changing: 'changing', seat: 'seat', small: 'small', bags: 'bags', gates: 'gates', storage: 'storage', outlets: 'outlets', anchor: 'anchor', windows: 'windows', pool: 'pool' };
  window.openHomeSafetyCheck = openHomeSafetyCheck = function (owner, id) { const to = MAP[id]; openPage(to ? `chg:Safety:d:step:${to}` : 'topic:Safety'); };
  window.openSafetyChecklist = openSafetyChecklist = function () { openPage('topic:Safety'); };
})();
