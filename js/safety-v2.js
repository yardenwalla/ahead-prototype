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
    seat: { t: 'Install the car seat', s: 'Rear-facing', i: 'car', c: 'car', go: "openPage('chg:Out and about:d:car')", out: true,
      why: 'The car seat is the one piece of gear every baby uses from the first ride home.',
      steps: ['Install it rear-facing in the back seat, following the seat and car manuals.', 'Check the harness: straps at or below {p} shoulders, no slack you can pinch, chest clip at armpit level.', 'Keep {o} rear-facing for as long as the seat allows.'],
      tip: ['Get it checked', 'Trained car-seat checkers can look over the installation and show you the harness fit. Many fire stations and hospitals offer it, often for free.'],
      links: [['Find a car-seat check near you · NHTSA', 'https://www.nhtsa.gov/campaign/right-seat']] },
    sleep: { t: 'Set up a bare crib', s: 'Firm, flat and empty', i: 'moon', c: 'sleep', go: "openPage('chg:Sleep:safe')", sleep: true },
    cribspot: { t: 'Keep cords away from the crib', s: 'Blind, shade and monitor cords', i: 'window', c: 'sleep',
      tiles: [['crib', 'Away from windows', 'Not under or right beside one'], ['cord', 'Cordless blinds', 'Tying up the cord isn’t enough'], ['home', 'Monitor cords', 'At least 3 feet from the crib']],
      why: 'Cords from blinds, shades and monitors can wrap around {p} neck. It can happen from birth, so this comes first.',
      steps: ['Put the crib or bassinet away from windows.', 'Swap corded blinds and shades near it for cordless ones. Tying up the pull cord isn’t enough.', 'Keep monitor cords at least 3 feet from the crib or bassinet.'],
      links: [['Window covering cords · CPSC', cpsc]] },
    changing: { t: 'Make your changing spot safe', s: 'Supplies within arm’s reach, or a mat on the floor', i: 'diaper', c: 'body',
      vs: ['Where to change {o}', ['On a changing table', 'Use the strap, and keep one hand on {o} every time.'], ['On the floor', 'A mat on the floor. Never a bed or sofa, even for a second.']], tiles: null,
      tip: ['Everything within reach', 'Diapers, wipes and a change of clothes, so you never need to step away.'],
      why: 'Babies wriggle and roll sooner than you expect, and a fall from a changing table is one of the most common early injuries.',
      steps: ['Keep diapers, wipes and a change of clothes within arm’s reach of the changing spot.', 'On a raised table, use the strap and keep one hand on {o}, every time.', 'Or change {o} on a mat on the floor. Never leave {o} on a bed or sofa, even for a second.'],
    },
    gear: { t: 'Use swings and bouncers safely', s: 'Weight limits and straps, and never for sleep', i: 'mat', c: 'floor',
      tiles: [['notepad', 'Check the limits', 'Weight and age, on the label'], ['shield', 'Straps on', 'Every time, even for a minute'], ['home', 'On the floor', 'Never a table, counter, bed or sofa'], ['moon', 'Not for sleep', 'Asleep? Move {o} to {p} crib']],
      why: 'Swings, bouncers and floor seats are handy for a few hands-free minutes. A quick check keeps them safe.',
      steps: ['Check the label for weight and age limits, and stop once {s} {reach|reaches} them.', 'Use the straps every time, even for a minute.', 'Keep them on the floor, never on a table, counter, bed or sofa.', 'They’re not for sleep. If {s} {fall|falls} asleep, move {o} to {p} crib, on {p} back.'],
      tip: ['When to stop using a bouncer', 'Once {s} can sit up on {p} own or {try|tries} to climb out, even under the weight limit.'],
      tip2: ['Stay close', 'Keep {o} within sight, and keep older kids and pets from rocking or pushing it.'] },
    swaddle: { t: 'Stop swaddling at the first try to roll', get s() { return sleepAge() >= 4 ? 'Then a sleep sack' : 'Some babies try at 2 months'; }, i: 'sack', c: 'sleep', go: "openPage('chg:Sleep:d:swaddleoff')", sleep: true },
    bassinet: { t: 'Move from the bassinet to the crib', s: 'Once {s} {try|tries} to roll or push up, or at its weight limit', i: 'crib', c: 'sleep', go: "openPage('chg:Sleep:d:where')", sleep: true },
    small: { t: 'Clear {p} play space', s: 'Coins, batteries and small parts', i: 'coin', c: 'floor',
      fig: 'tube', tiles: [['mat', 'A firm play mat', 'On the floor, away from edges and cords'], ['eye', 'Floor check', 'Coins, magnets, older kids’ toys'], ['battery', 'Battery covers screwed shut', 'On remotes, key fobs and musical toys']],
      why: 'Rolling brings the floor within reach, and everything {s} {find|finds} goes in {p} mouth.',
      steps: ['Give {o} a firm play mat on the floor, away from furniture edges and cords. Beds and sofas aren’t safe for rolling practice.', 'Look around {p} play space at floor level for coins, magnets and pieces of older children’s toys.', 'Anything that fits inside an empty toilet-paper tube is small enough to choke on. Keep it out of reach.', 'Check that remotes, key fobs, musical books and toys have battery covers that screw shut. Keep spare batteries up high.'],
      tip: ['Button batteries are an emergency', 'If you think {s} swallowed a button battery or a magnet, go to the ER right away.'],
      links: [['Small-object checks · CHOP', 'https://www.chop.edu/centers-programs/injury-prevention-program/choking-and-suffocation']] },
    bags: { t: 'Give visitors’ bags a place up high', s: 'They often hold medicines', i: 'bag', c: 'body',
      why: 'Purses and backpacks often hold medicines, gum or batteries, and they usually end up on the floor.',
      steps: ['Pick a spot up high, like a hook or a closet shelf, for bags and coats.', 'Ask visitors to put their bags there when they arrive.'],
      tip: ['Child-resistant isn’t childproof', 'Caps slow children down but don’t stop them. Medicines still need to be up high and locked.'] },
    gates: { t: 'Gate the stairs', s: 'Screwed in at the top, so it can’t give way', i: 'gate', c: 'car',
      vs: ['Which gate where', ['Top of the stairs', 'A gate that screws into the wall. One that presses against the walls can give way.'], ['Bottom of the stairs', 'Either kind is fine.']], tiles: null, note: 'Use a gate made for babies, and fit it the way its instructions say.',
      why: 'Once {s} {crawl|crawls}, stairs are the biggest fall risk at home.',
      steps: ['At the top of the stairs, use a gate that screws into the wall. A gate that only presses against the walls can give way.', 'At the bottom, either kind is fine.', 'Use a gate made for babies, and fit it the way its instructions say.'],
      tip: ['Skip seated walkers with wheels', 'They let babies move fast toward stairs and other hazards, and they don’t help with walking. Floor play or a stationary activity center is safer.'],
      links: [['Room-by-room babyproofing · AAP', aap], ['Find a professional childproofer · Paid', 'https://www.childproofingexperts.com/find-a-professional/'], ['Seated walkers · AAP', 'https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Baby-Walkers-A-Dangerous-Choice.aspx']] },
    storage: { hi: 'crawl', t: 'Lock up low cabinets and drawers', s: 'Medicines, cleaners and knives', i: 'lock', c: 'high',
      tiles: [['lock', 'Latch it', 'Medicines, cleaners, pods, knives, bags'], ['up', 'Up high too', 'Medicines and cleaners, as well as latched'], ['home', 'Close off rooms', 'Bathroom, laundry and garage, with door-knob covers or a gate']],
      why: 'Crawling babies open every low door and drawer they can reach.',
      steps: ['Fit child latches or locks on cabinets and drawers that hold medicines, cleaners, detergent pods, knives or plastic bags.', 'Better still, move medicines and cleaners up high as well as latched.', 'Keep the bathroom, laundry room and garage closed off with door knob covers or a gate.'],
      tip: ['Relatch every time', 'Pull the door after you close it to check the latch holds.'],
      links: [['What to lock away · AAP', aap]] },
    outlets: { hi: 'crawl', t: 'Cover outlets', s: 'And tuck cords out of reach', i: 'plug', c: 'floor',
      tiles: [['plug', 'Outlet covers', 'Too big to swallow, and hard to pull out'], ['cord', 'Cords out of reach', 'Lamps and chargers behind furniture'], ['shield', 'Replacing outlets?', 'Tamper-resistant ones have shutters']],
      why: 'Outlets and cords sit right at crawling height.',
      steps: ['Use plug-in outlet covers {s} can’t pull out and that are too big to swallow.', 'Move lamp and charger cords out of reach, or tuck them behind furniture.', 'If you’re replacing outlets, tamper-resistant ones have built-in shutters.'],
      links: [['Childproofing your home · CPSC', cpsc]] },
    mattress: { t: 'Lower the crib mattress', s: 'Before {s} can sit up', i: 'crib', c: 'sleep', go: "openPage('chg:Sleep:d:mattress')", sleep: true },
    anchor: { hi: 'stand', t: 'Strap furniture and TVs to the wall', s: 'So nothing tips if {s} {pull|pulls} on it', i: 'dresser', c: 'body',
      tiles: [['dresser', 'Anti-tip straps', 'On dressers, bookcases and tall furniture'], ['blocks', 'TVs too', 'On the wall, or strapped to their stand'], ['clock', 'When', 'Now, before {s} {pull|pulls} on them']],
      why: 'Babies use furniture as a handhold to pull up, and dressers, bookcases and TVs can tip over onto them.',
      steps: ['Fit anti-tip straps to dressers, bookcases and other tall furniture {s} could pull on.', 'Mount TVs on the wall, or strap them to the furniture they stand on.', 'Do it any time before {s} {pull|pulls} up. Many families do it while babyproofing for crawling.'],
      links: [['Anchor it · CPSC', cpsc]] },
    windows: { hi: 'stand', t: 'Add window stops', s: 'Window stops and cordless blinds', i: 'window', c: 'car',
      tiles: [['window', 'Window stops', 'Open 4 inches at most'], ['home', 'One way out', 'One window per room an adult can open fully, for a fire'], ['cord', 'Cordless blinds', 'Tied-up cords can still be reached'], ['dresser', 'Furniture away', 'Nothing to climb near a window']],
      why: 'Standing puts windows and blind cords within reach. A screen keeps bugs out, not babies in.',
      steps: ['Fit window stops, small locks that keep windows from opening more than 4 inches. Screens don’t stop falls.', 'Keep at least one window in each room that an adult can open fully in a fire.', 'Swap corded blinds and shades for cordless ones. Tying up the pull cord isn’t enough: inner cords and loops can still be reached, from the floor or from furniture.', 'Move furniture {s} could climb away from windows.'],
      links: [['Window safety · CPSC', cpsc]] },
    kitchen: { hi: 'stand', t: 'Lock the stove and oven', s: 'Knob covers and an oven lock', i: 'stove', c: 'high',
      tiles: [['stove', 'Knob covers', 'So the burners can’t be turned on'], ['lock', 'An oven lock', 'So the door stays shut'], ['pot', 'Back burners', 'With pot handles turned in']],
      why: 'Standing brings stove knobs and the oven door within reach, and to {o} a knob is just a toy that turns.',
      steps: ['Fit knob covers so {s} can’t turn the burners on.', 'Add an oven lock so the door stays shut.', 'Cook on the back burners when you can, with pot handles turned in.'],
      links: [['Childproofing your home · CPSC', cpsc]] },
    pool: { hi: 'stand', t: 'Keep water out of reach', s: 'A toilet lock, a shut bathroom, and a fenced pool', i: 'bath', c: 'home',
      tiles: [['bath', 'Bathroom shut', 'A toilet-lid lock, and the door closed'], ['drop', 'Empty it', 'Buckets, tubs and wading pools, right after use'], ['shield', 'Fence the pool', 'At least 4 feet high, on all four sides, with a self-latching gate']],
      why: 'Babies can drown in an inch or two of water, quickly and quietly.',
      steps: ['Fit a toilet-lid lock, and keep the bathroom door closed.', 'Empty buckets, tubs and wading pools right after use.', 'If you have a pool or spa, fence it on all sides with a self-closing, self-latching gate. Keep doors to it locked, and close the gate every time.'],
      tip: ['Barriers don’t replace watching', 'Stay within arm’s reach whenever {s’s} near water.'],
      links: [['Pool Safely · CPSC', 'https://www.poolsafely.gov/parents/safety-tips/']] },
    mattress2: { t: 'Lower the crib mattress', get s() { return 'All the way down'; }, i: 'crib', c: 'sleep', go: "openPage('chg:Sleep:d:mattress')", sleep: true }
  };
  const STAGES = [
    { key: 'setup', label: 'First setup', age: 'From birth', title: 'Five things to set up once', lead: 'Before Maya can move, safety is about where {s} {ride|rides}, {sleep|sleeps} and {get|gets} changed.', ids: ['seat', 'sleep', 'cribspot', 'changing', 'gear'] },
    { key: 'reaching', label: 'Rolling', age: '3–6 months', title: 'Rolling puts the floor in reach', lead: 'At the first sign of rolling, the swaddle comes off and the floor needs clearing.', ids: ['swaddle', 'bassinet', 'small', 'bags'] },
    { key: 'rolling', label: 'Crawling', age: '6–9 months', title: 'Crawling opens up every room', lead: 'Most babies start crawling between 6 and 9 months. Do the low, reachable things first.', ids: ['gates', 'storage', 'outlets', 'mattress'] },
    { key: 'pulling', label: 'Pulling up', age: '9 months+', title: 'Standing puts higher things in reach', lead: 'Furniture becomes a handhold, and windows, the stove and water are suddenly within reach.', ids: ['anchor', 'windows', 'kitchen', 'pool', 'mattress2'] }
  ];

  // The top card's picture and "Look from her height" card (Nov 13), so Safety opens like Feeding, Sleep and Development.
  // The picture is the stage's main change; the card says where to look from the baby's own spot (at first setup, the back seat).
  const SF_ART = {"setup":"<svg fill=\"none\" viewBox=\"0 0 320 165\" aria-hidden=\"true\"><ellipse cx=\"160\" cy=\"145\" rx=\"104\" ry=\"9\" fill=\"#795b2c\" opacity=\".1\"/><circle cx=\"262\" cy=\"40\" r=\"21\" fill=\"#fff\" opacity=\".6\"/>\n<rect x=\"92\" y=\"128\" width=\"150\" height=\"12\" rx=\"6\" fill=\"#d9b678\"/>\n<path d=\"M104 128c-6-34 0-62 22-74 8-4 16-2 18 6l-6 34c22 10 52 13 80 12 12 0 18 8 16 18l-2 4Z\" fill=\"#e8c98e\"/>\n<path d=\"M122 120c-3-24 2-44 14-52l6 2-6 32c22 9 50 12 76 12l-2 6Z\" fill=\"#fbf0dc\"/>\n<path d=\"M110 92c10-58 104-58 118 2\" stroke=\"#c49a55\" stroke-width=\"7\" stroke-linecap=\"round\"/>\n<circle cx=\"156\" cy=\"104\" r=\"5\" fill=\"#c49a55\"/><path d=\"M70 46l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z\" fill=\"#e3b98a\"/><circle cx=\"252\" cy=\"104\" r=\"5\" fill=\"#f4d6c4\"/></svg>","reaching":"<svg fill=\"none\" viewBox=\"0 0 320 165\" aria-hidden=\"true\"><ellipse cx=\"160\" cy=\"145\" rx=\"104\" ry=\"9\" fill=\"#795b2c\" opacity=\".1\"/><circle cx=\"262\" cy=\"40\" r=\"21\" fill=\"#fff\" opacity=\".6\"/>\n<path d=\"M70 132l30-26h150l-30 26Z\" fill=\"#f4d6c4\"/><path d=\"M70 132h150v8H70Z\" fill=\"#e8b9a0\"/><path d=\"M220 132l30-26v8l-30 26Z\" fill=\"#e8b9a0\"/>\n<circle cx=\"150\" cy=\"104\" r=\"16\" fill=\"#e8c98e\"/><path d=\"M137 98c8 5 18 5 26 0\" stroke=\"#fbf0dc\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n<circle cx=\"258\" cy=\"136\" r=\"7\" fill=\"#c9a463\"/><circle cx=\"258\" cy=\"136\" r=\"3.5\" fill=\"#e8c98e\"/>\n<circle cx=\"278\" cy=\"140\" r=\"5\" fill=\"#b9bfc8\"/><circle cx=\"278\" cy=\"140\" r=\"2\" fill=\"#dfe3e8\"/>\n<path d=\"M44 140h236\" stroke=\"#795b2c\" stroke-width=\"1.6\" stroke-dasharray=\"5 5\" opacity=\".35\"/><path d=\"M84 52l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z\" fill=\"#e3b98a\"/></svg>","rolling":"<svg fill=\"none\" viewBox=\"0 0 320 165\" aria-hidden=\"true\"><ellipse cx=\"160\" cy=\"145\" rx=\"104\" ry=\"9\" fill=\"#795b2c\" opacity=\".1\"/><circle cx=\"262\" cy=\"40\" r=\"21\" fill=\"#fff\" opacity=\".6\"/>\n<path d=\"M168 140V112h30V86h30V60h30v80Z\" fill=\"#f4d6c4\"/>\n<rect x=\"84\" y=\"58\" width=\"8\" height=\"84\" rx=\"4\" fill=\"#c49a55\"/><rect x=\"170\" y=\"58\" width=\"8\" height=\"84\" rx=\"4\" fill=\"#c49a55\"/>\n<rect x=\"86\" y=\"62\" width=\"90\" height=\"8\" rx=\"4\" fill=\"#e8c98e\"/><rect x=\"86\" y=\"128\" width=\"90\" height=\"8\" rx=\"4\" fill=\"#e8c98e\"/>\n<rect x=\"102\" y=\"68\" width=\"6\" height=\"62\" rx=\"3\" fill=\"#e8c98e\"/><rect x=\"118\" y=\"68\" width=\"6\" height=\"62\" rx=\"3\" fill=\"#e8c98e\"/><rect x=\"134\" y=\"68\" width=\"6\" height=\"62\" rx=\"3\" fill=\"#e8c98e\"/><rect x=\"150\" y=\"68\" width=\"6\" height=\"62\" rx=\"3\" fill=\"#e8c98e\"/>\n<path d=\"M250 24l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z\" fill=\"#e3b98a\"/></svg>","pulling":"<svg fill=\"none\" viewBox=\"0 0 320 165\" aria-hidden=\"true\"><ellipse cx=\"160\" cy=\"145\" rx=\"104\" ry=\"9\" fill=\"#795b2c\" opacity=\".1\"/><circle cx=\"262\" cy=\"40\" r=\"21\" fill=\"#fff\" opacity=\".6\"/>\n<path d=\"M226 22v118\" stroke=\"#795b2c\" stroke-width=\"2\" opacity=\".25\" stroke-linecap=\"round\"/>\n<rect x=\"110\" y=\"56\" width=\"110\" height=\"84\" rx=\"8\" fill=\"#e8c98e\"/>\n<rect x=\"120\" y=\"66\" width=\"90\" height=\"20\" rx=\"5\" fill=\"#fbf0dc\"/><rect x=\"120\" y=\"92\" width=\"90\" height=\"20\" rx=\"5\" fill=\"#fbf0dc\"/><rect x=\"120\" y=\"118\" width=\"90\" height=\"16\" rx=\"5\" fill=\"#fbf0dc\"/>\n<circle cx=\"165\" cy=\"76\" r=\"3\" fill=\"#c49a55\"/><circle cx=\"165\" cy=\"102\" r=\"3\" fill=\"#c49a55\"/>\n<path d=\"M210 60h16\" stroke=\"#c49a55\" stroke-width=\"6\" stroke-linecap=\"round\"/><circle cx=\"226\" cy=\"60\" r=\"5\" fill=\"#795b2c\"/>\n<rect x=\"128\" y=\"28\" width=\"58\" height=\"28\" rx=\"5\" fill=\"#d9b678\"/><rect x=\"134\" y=\"33\" width=\"46\" height=\"18\" rx=\"3\" fill=\"#f4d6c4\"/>\n<path d=\"M78 40l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z\" fill=\"#e3b98a\"/></svg>"};
  const LOOK = { setup: ["Sit in the back seat beside {o}", "Anything loose back there could fly in a sudden stop, so stow it."],
    reaching: ["Lie on the floor where {s} {play|plays}", "Anything you can reach from there, {s} soon can."],
    rolling: ["Crawl through the rooms {s} will explore", "Open low doors and look under the sofa as you go."],
    pulling: ["Kneel and look up", "Anything {s} could grab, pull on or climb needs a second look."] };
  // Nov 18 preview: an eye-level photo with the stage's risks labeled. Labels are drawn by the app, not baked into
  // the image, and each one opens its checklist step and shows a tick once that step is done.
  const SF_PHOTO = {
    setup: { src: 'assets/safety/setup.jpg', alt: 'A newborn asleep on her back in a sleep sack, in a bare crib beside a changing table, with a cordless shade on the window',
      title: 'Five things to set up once', lead: 'Before {s} can move, start here.',
      spots: [['cribspot', 'Cordless shade', 30, 14, 'r'], ['changing', 'Supplies in reach', 9, 64, 'r'], ['sleep', 'Bare crib', 86, 50, 'l']] },
    reaching: { src: 'assets/safety/rolling.jpg', alt: 'A baby on her tummy on a play mat, with coins, a TV remote and an open handbag on the floor beside it',
      get title() { return answers.roll === 'Yes' ? 'Now {s’s} rolling' : 'Get ahead of rolling'; }, lead: 'Rolling often starts without warning.', lookLine: 'Whatever you can reach, {s} soon can.',
      spots: [['bags', 'Visitor’s bag', 80, 44, 'l'], ['small', 'Loose coins', 70, 80, 'b'], ['small', 'Remote batteries', 84, 70, 'l']] },
    rolling: { src: 'assets/safety/crawling.jpg', alt: 'A baby crawling across a living room toward open stairs, a low cabinet and a wall outlet',
      get title() { return answers.crawl === 'Yes' ? 'Now {s’s} on the move' : 'Get ahead of crawling'; }, look: 'Crawl the rooms {s’ll} explore', lookLine: 'Open low doors and look under the sofa.', lead: 'Do the low, reachable things first.',
      spots: [['storage', 'Low cabinets', 9, 27, 'r'], ['outlets', 'Bare outlet', 24.3, 37, 'b'], ['gates', 'Open stairs', 63, 11, 'l']] },
    pulling: { src: 'assets/safety/pulling.jpg', alt: 'A baby pulling up to stand on a tall dresser, with a TV on a low stand and a hanging blind cord by the window',
      get title() { return answers.pullUp === 'Yes' ? 'Now {s’s} pulling up' : 'Get ahead of standing'; }, lead: 'Furniture becomes something to grab.',
      spots: [['windows', 'Blind cord', 19, 44, 'b'], ['anchor', 'TV can tip', 42, 31, 'l'], ['anchor', 'Dresser can tip', 90, 70, 'bl']] } };
  const sfPhotoOn = key => SF_PHOTO[key] && !window.__sfPhotoOff;
  function sfPhoto(key) {
    if (!sfPhotoOn(key)) return '';
    const ph = SF_PHOTO[key];
    const pins = ph.spots.map(([id, label, x, y, side]) => { const done = status(id) === 'done';
      return `<button class="sf-pin sf-pin-${side}${done ? ' is-done' : ''}" style="left:${x}%;top:${y}%" onclick="${open(id)}" aria-label="${label}: ${STEP[id].t}${done ? ', done' : ''}"><i></i><span>${done ? '✓ ' : ''}${label}</span></button>`; }).join('');
    return `<figure class="sf-photo"><img src="${ph.src}" alt="${ph.alt}">${pins}</figure>`;
  }
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
    const look = LOOK[st.key];
    let b = `<header class="hub-hero sf-hero sf-disc"><p class="hub-eyebrow">${st.label} · ${st.age}</p><h1>${F(sfPhotoOn(st.key) ? SF_PHOTO[st.key].title : st.title)}</h1><p class="hub-lead">${F(sfPhotoOn(st.key) ? SF_PHOTO[st.key].lead : st.lead)}</p>${sfPhoto(st.key) || `<div class="sf-art">${SF_ART[st.key] || ""}</div>`}${look && !sfPhotoOn(st.key) ? `<div class="sf-look"><small>${F("Look from {p} height")}</small><b>${F(sfPhotoOn(st.key) && SF_PHOTO[st.key].look ? SF_PHOTO[st.key].look : look[0])}</b><span>${F(look[1])}</span></div>` : ""}</header>`;
    b += `<div class="sf-head"><h2 class="hub-h2">${F(!window.__sfPhotoOff ? 'Your safety checklist' : i < nowI && live ? 'Done these yet?' : i > nowI && live ? 'Get ready for this' : 'Do these now')}</h2><span class="sf-count">${of ? `${done} of ${of} done` : 'None apply'}</span></div><div class="hub-list sf-list">${rows}</div>`;
    if (look && sfPhotoOn(st.key)) b += `<div class="sf-look sf-look-after"><small>${F("Look from {p} height")}</small><b>${F(SF_PHOTO[st.key].look || look[0])}</b><span>${F(SF_PHOTO[st.key].lookLine || look[1])}</span></div>`;
    // Joined later, or skipped a stage? One quiet line back to the earliest stage with steps still open.
    if (live && i === nowI) {
      // Only stages that started while the parent was using Ahead: a parent who joins later has done the earlier steps.
      const START = { setup: 0, reaching: 3, rolling: 6, pulling: 9 };
      let joinMo = 0; try { if (profile.joined && profile.dob) joinMo = (parse(profile.joined) - parse(profile.dob)) / 864e5 / 30.44; } catch (e) {}
      const left = STAGES.slice(0, i).filter(s2 => (START[s2.key] ?? 0) >= joinMo - 0.5).map(s2 => [s2, s2.ids.filter(x => !status(x)).length]).filter(x => x[1]);
      if (left.length) b += `<button class="sf-earlier" onclick="openPage('safety-stage:${left[0][0].key}')">${F(`${left.reduce((t, x) => t + x[1], 0)} ${left.reduce((t, x) => t + x[1], 0) === 1 ? 'earlier step is' : 'earlier steps are'} still open`)} ›</button>`;
    }
    if (!window.__sfPhotoOff) b += h.versus('If something goes wrong', ['Poison Help', 'If {s} swallows something, call 1‑800‑222‑1222.'], ['Call 911', 'Can’t breathe, won’t wake, or swallowed a battery or magnet.']);
    else b += h.versus('If something goes wrong', ['Poison Help', 'Call 1-800-222-1222 if Maya swallows something that could be harmful.'], ['Call 911', 'If {s} can’t breathe or won’t wake. A swallowed battery or magnet means the ER right away.']);
    // Choking first aid lives in Feeding; the safety net links to it.
    b += `<div class="hub-browse"><button class="hub-link" onclick="openPage('chg:Feeding:safe')">${F(typeof actualMonth === 'function' && actualMonth() >= 12 ? 'Learn choking first aid for a child' : 'Learn infant choking first aid')} ›</button></div>`;
    if (nx) b += h.next(`Next · from about ${nx.age.replace(/\D.*$/, '')} months`, nx.label, `openPage('safety-stage:${nx.key}')`, '', { reaching: 'Clear the floor of small things and batteries.', rolling: 'Gates and cabinet locks go in before crawling.', pulling: 'Strap furniture and TVs to the wall.' }[nx.key] || '');
    b += h.note('Ages are typical. Every baby moves at their own pace.');
    return `<div class="quiet-category hub-page" data-overview="Safety" data-safety-stage="${key}" style="${yearTheme('Safety')}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader('Safety') : ''}${pills}${b}</div>`;
  };

  // The toilet-paper tube test, as a picture: anything that fits through it is small enough to choke on.
  const tubeFigure = () => `<figure class="hub-figure sf-tube" role="img" aria-label="${F('Anything that fits through an empty toilet-paper tube is small enough to choke on.')}"><svg viewBox="0 0 220 96" aria-hidden="true"><ellipse cx="70" cy="48" rx="34" ry="34" fill="#fff" stroke="#c9a46a" stroke-width="3"/><ellipse cx="70" cy="48" rx="22" ry="22" fill="#f7e6c4" stroke="#c9a46a" stroke-width="2"/><circle cx="64" cy="44" r="5" fill="#b9b1a4"/><circle cx="76" cy="52" r="4" fill="#8f8a83"/><rect x="66" y="36" width="10" height="6" rx="2" fill="#e38b6d"/><path d="M118 48h30" stroke="#795b2c" stroke-width="3" stroke-linecap="round"/><path d="m142 40 8 8-8 8" fill="none" stroke="#795b2c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="182" cy="48" r="16" fill="#fde3d3"/><path d="M174 48h16" stroke="#9a5a3c" stroke-width="3" stroke-linecap="round"/></svg><figcaption><b>${F('The tube test')}</b>${F('If it fits through an empty toilet-paper tube, it’s small enough to choke on. Keep it out of reach.')}</figcaption></figure>`;

  /* ---------- a step's page: Spot the risk → See the fix → Check your home (Nov 18) ----------
     The same three sections, in the same order, on every Safety step page.
     Spot the risk: an eye-level photo with the risk labeled (labels drawn by the app), or, with no photo, three tiles of
       where the risk hides. See the fix: the fixed version, as a photo, a right-vs-wrong pair or tiles, then how to do it.
     Check your home: one to three hands-on tests that show the fix is done right, then Mark as done.
     The old version stays behind window.__sfStepOld, in case the new one doesn't work out. */
  const PH = n => `assets/safety/steps/${n}.jpg`;
  const FIX = {
    cribspot: {
      ba: [[PH('cribspot-before'), 'A crib under a window with a corded blind, its cord hanging beside the crib', ['Blind cord', 43, 60, 'r']], [PH('cribspot-after'), 'The same crib with a cordless shade on the window', ['Cordless shade', 32, 9, 'b']]],
      spotTiles: [['window', 'A window', 'Under or right beside the crib'], ['cord', 'Corded blinds', 'Loops can reach into the crib'], ['plug', 'Monitor cords', 'Often plugged in right beside it']],
      fixPhoto: [PH('cribspot-fix'), 'A crib against an inside wall, away from a window with a cordless shade', [['Cordless shade', 20, 12, 'r']]],
      fix: [['window', 'Cordless blinds and shades', 'Tying up the cord isn’t enough'], ['plug', 'Monitor cords 3 feet away', 'From the crib or bassinet'], ['crib', 'Crib away from windows', 'Not under or right beside one']],
      checks: ['Stand beside the crib and stretch out an arm. You shouldn’t reach any cord.'] },
    changing: {
      ba: [[PH('changing-before'), 'A changing table with a bare pad and nothing within reach', null], [PH('changing-after'), 'The same table with a strapped pad and a caddy of diapers and wipes beside it', ['Strap', 36, 53, 'b']]],
      spotTiles: [['eye', 'Supplies out of reach', 'So you turn away for a second'], ['roll', 'A raised table', 'Babies roll sooner than you expect'], ['sofa', 'Beds and sofas', 'No edge to stop a roll']],
      fixPhoto: [PH('changing-fix'), 'A changing table with wipes and a changing pad within arm’s reach', [['Wipes within reach', 10, 64, 'r']]],
      fix: [['diaper', 'Supplies within reach', 'Diapers, wipes and a change of clothes'], ['hand', 'One hand on {o}, always', 'Even with the strap on'], ['mat', 'Or use the floor', 'A mat on the floor, never a bed or sofa']],
      checks: ['Put one hand on the pad. You should reach diapers, wipes and clothes with the other.'] },
    gear: {
      ba: [[PH('gear-before'), 'A baby bouncer sitting on a kitchen counter', null], [PH('gear-after'), 'The same bouncer on a rug on the floor', null]],
      spotTiles: [['sofa', 'Up on a surface', 'A table, counter, bed or sofa'], ['moon', 'Asleep in it', '{P} head can slump and block breathing'], ['shield', 'Straps left off', 'Babies wriggle and tip out']],
      fix: [['notepad', 'Check the limits', 'Weight and age, on the label'], ['hand', 'Straps on', 'Every time, even for a minute'], ['mat', 'On the floor', 'Never on a table, counter or bed'], ['crib', 'Not for sleep', 'Asleep? Move {o} to {p} crib']],
      notes: [['', 'Trying to climb out?', 'Time to stop, even under the weight limit']],
      checks: ['Buckle the straps and tug. They should stay shut.'] },
    small: {
      ba: [[PH('small-before'), 'Coins and a TV remote on the floor next to a play mat', ['Coins', 23, 64, 'r']], [PH('small-after'), 'The same floor, cleared', null]],
      spotPhoto: [PH('small-risk'), 'Coins and a TV remote on the floor next to a baby’s play mat', [['Coins', 46, 76, 'l'], ['Remote batteries', 82, 62, 't']]],
      spotLine: 'If it fits through an empty toilet-paper tube, it’s small enough to choke on.',
      fix: [['coin', 'The tube test', 'If it fits through a toilet-paper tube, it goes up high'], ['mat', 'A firm play mat', 'On the floor, away from edges and cords'], ['battery', 'Battery covers screwed shut', 'On remotes, key fobs and musical toys']],
      notes: [['', 'Swallowed a button battery or magnet?', 'Call 911 or go to the ER right away']],
      checks: ['Lie on the floor where {s} {play|plays}. Nothing within reach should fit through the tube.', 'Try a remote’s battery cover. It shouldn’t open without a screwdriver.'] },
    bags: {
      ba: [[PH('bags-before'), 'An open handbag on the entryway floor', null], [PH('bags-after'), 'The same entryway with the bag hanging on a wall hook', null]],
      spotPhoto: [PH('bags-risk'), 'An open handbag on the floor next to a baby’s play mat', [['Bag on the floor', 64, 40, 'l']]],
      fix: [['bag', 'A spot up high', 'A hook or closet shelf for bags and coats'], ['chat', 'Ask visitors to use it', 'As soon as they arrive']],
      notes: [['', 'Medicine caps aren’t childproof', 'They slow kids down but don’t stop them']],
      checks: [] },
    gates: {
      ba: [[PH('gates-before'), 'The top of a staircase seen from a baby’s height, with no gate', null], [PH('gates-after'), 'The same stairs with a gate screwed into the wall at the top', ['Screwed in', 21, 25, 'r']]],
      baFix: [['gate', 'Screwed in at the top', 'A pressure gate can give way there'], ['home', 'Either kind at the bottom', 'Pressure-fit or screwed in']],
      spotPhoto: [PH('gates-risk'), 'A baby crawling toward an open staircase with no gate', [['Open stairs', 52, 26, 'r']]],
      spotLine: 'Crawlers climb stairs early, and can fall from any step.',
      fixPair: [[PH('gates-ok'), 'A gate screwed into the wall at the top of the stairs', 'Screwed in at the top'], [PH('gates-no'), 'A pressure gate wedged between walls', 'Pressure gate: bottom only']],
      notes: [['', 'Skip seated walkers', 'They roll babies toward the stairs, and don’t help with walking']],
      checks: ['Push and pull the top gate hard. It shouldn’t shift.', 'Open it. It should swing away from the stairs, never out over them.'] },
    storage: {
      ba: [[PH('storage-before'), 'A low wooden cabinet with plain doors', null], [PH('storage-after'), 'The same cabinet with a child latch across the doors', ['Child latch', 29, 31, 'b']]],
      spotPhoto: [PH('storage-risk'), 'A low wooden cabinet at a crawling baby’s height', [['Doors that open easily', 32, 46, 'r']]],
      spotLine: 'Medicines, cleaners, detergent pods, knives and plastic bags are the ones to lock up.',
      fix: [['lock', 'Latch low doors and drawers', 'For medicines, cleaners, pods, knives and bags'], ['shield', 'Medicines and cleaners up high', 'Not just latched'], ['home', 'Close off rooms', 'Bathroom, laundry and garage, with knob covers or a gate']],
      checks: ['Tug each latched door and drawer a few times. It should catch after a crack, every time.'] },
    outlets: {
      ba: [[PH('outlets-before'), 'A low wall outlet with a charger cord hanging to the floor, seen from a baby’s height', null], [PH('outlets-after'), 'The same outlet with safety covers and the cord gone', ['Outlet cover', 43, 32, 'b']]],
      spotPhoto: [PH('outlets-risk'), 'A wall outlet with a cord, at a crawling baby’s eye level', [['Outlet', 33, 31, 'r'], ['Cord to pull on', 21, 72, 'r']]],
      fix: [['plug', 'Sliding outlet covers', 'They snap shut when you unplug'], ['shield', 'Best: tamper-resistant outlets', 'Built-in shutters, nothing to pull out'], ['cord', 'Cords out of reach', 'Lamps and chargers behind furniture']],
      checks: ['Try to open a cover with your fingertips. It should stay shut.', 'Crawl past lamps and chargers. No cord should hang within reach.'] },
    anchor: {
      ba: [[PH('anchor-before'), 'A baby pulling up on a tall dresser that isn’t fixed to the wall', null], [PH('anchor-after'), 'The same dresser with an anti-tip strap to the wall', ['Anti-tip strap', 86, 22, 'bl']]],
      spotPhoto: [PH('anchor-risk'), 'A baby pulling up on a tall dresser, with a TV on a low stand behind her', [['TV can tip', 17, 40, 'b'], ['Dresser can tip', 90, 74, 'bl']]],
      spotLine: 'Bookcases, and anything tall {s} could pull on, count too.',
      fixPhoto: [PH('anchor-fix'), 'A dresser held to the wall by an anti-tip strap, shown close up', [['Anti-tip strap', 60, 66, 'b']], 'tall'],
      fix: [['dresser', 'Anti-tip straps', 'On dressers, bookcases and tall furniture'], ['blocks', 'The TV too', 'On the wall, or strapped to its stand']],
      checks: ['Pull gently on the top of the dresser. It shouldn’t lean.', 'Rock the TV. It shouldn’t move.'] },
    windows: {
      ba: [[PH('windows-before'), 'A window swung wide open', null], [PH('windows-after'), 'The same window held a few inches open by a window stop', ['Window stop', 67, 50, 'l']]],
      spotPhoto: [PH('windows-risk'), 'A window with a hanging blind cord, near a low TV stand', [['Opens all the way', 14, 38, 'r'], ['Blind cord', 40, 80, 'r']]],
      spotLine: 'A screen keeps bugs out, not babies in.',
      fix: [['window', 'Window stops', 'So windows open 4 inches at most'], ['home', 'One window you can open fully', 'In each room, for a way out in a fire'], ['cord', 'Cordless blinds', 'No cords or loops to reach'], ['dresser', 'Furniture away', 'Nothing to climb near a window']],
      checks: ['Open each window with a stop. It should stop at 4 inches.', 'Kneel by each blind. No cord or loop should be within reach.'] },
    kitchen: {
      ba: [[PH('kitchen-before'), 'A stove with bare knobs and a pot handle sticking out', null], [PH('kitchen-after'), 'The same stove with knob covers, an oven lock and the pot handle turned in', ['Oven lock', 18, 57, 'r']]],
      spotTiles: [['stove', 'Stove knobs', 'Right at standing height'], ['thermo', 'The oven door', 'Hot glass, and a handle to pull'], ['hand', 'Pot handles', 'Sticking out over the edge']],
      fix: [['stove', 'Knob covers', 'So the burners can’t be turned on'], ['lock', 'An oven lock', 'So the door stays shut'], ['shield', 'An anti-tip bracket', 'So it can’t tip if {s} {climb|climbs} on the door'], ['pot', 'Back burners', 'With pot handles turned in']],
      checks: ['Try a covered knob. It shouldn’t turn.', 'Pull the oven door. The lock should hold it shut.'] },
    pool: {
      ba: [[PH('pool-before'), 'A bathroom with the toilet lid up and a bucket of water on the floor', null], [PH('pool-after'), 'The same bathroom with the toilet lid locked and no bucket', ['Lid lock', 40, 66, 'r']]],
      spotTiles: [['bath', 'The toilet', 'A lid up and a door left open'], ['drop', 'Buckets and tubs', 'An inch or two of water is enough'], ['sun', 'A pool or spa', 'A gap in the fence, or an open gate']],
      fix: [['lock', 'A toilet-lid lock', 'And keep the bathroom door closed'], ['cup', 'Empty standing water', 'Buckets, tubs and wading pools, right after use'], ['shield', 'Fence the pool', 'At least 4 feet high, on all four sides, with a self-latching gate']],
      notes: [['', 'Barriers don’t replace watching', 'Stay within arm’s reach whenever {s’s} near water']],
      checks: ['Pull the toilet lid. The lock should hold.', 'Have a pool? Let the gate go. It should close and latch by itself.'] }
  };
  // Leads say why now, in one line (the photo's caption carries any extra line).
  const LEAD2 = {
    cribspot: 'A cord in reach can wrap around a baby’s neck, even in the first weeks.',
    changing: 'Falls from changing tables are among the most common early injuries.',
    gear: 'Keep them on the floor, and stop once {s} can sit up on {p} own.',
    small: 'Rolling brings the floor in reach, and everything goes in {p} mouth.',
    bags: 'Bags often hold medicines, gum or batteries, and end up on the floor.',
    gates: 'Once {s} {crawl|crawls}, stairs are the biggest fall risk at home.',
    storage: 'Crawling babies open every low door and drawer they can reach.',
    outlets: 'Outlets and cords sit right at crawling height.',
    anchor: 'Dressers, bookcases and TVs can tip when {s} {pull|pulls} on them.',
    windows: 'Screens keep bugs out, not babies in.',
    kitchen: 'To {o}, a stove knob is just a toy that turns.',
    pool: 'Babies can drown in an inch or two of water, quickly and quietly.' };
  const pins = list => (list || []).map(([label, x, y, side]) => `<span class="sf-pin sf-pin-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(label)}</span></span>`).join('');
  const photo = (p, cls = '') => p ? `<figure class="sf-photo sf-step-photo${p[3] === 'tall' ? ' is-tall' : ''}${cls}"><img src="${p[0]}" alt="${F(p[1])}" loading="lazy">${pins(p[2])}</figure>` : '';
  const pair = pr => `<div class="sf-pair">${pr.map(([src, alt, label], k) => `<figure><img src="${src}" alt="${F(alt)}" loading="lazy"><figcaption class="${k ? 'is-no' : 'is-ok'}"><i aria-hidden="true">${k ? '✕' : '✓'}</i>${F(label)}</figcaption></figure>`).join('')}</div>`;
  const fixRows = rows => rows ? `<ul class="sf-fixrows">${rows.map(([i, t, sub]) => `<li><span class="sf-fixdot">${hubArt(i, 'Safety')}</span><span><b>${F(t)}</b><small>${F(sub)}</small></span></li>`).join('')}</ul>` : '';
  function stepPage(id) {
    if (window.__sfStepOld) return stepPageOld(id);
    const x = STEP[id], q = FIX[id], h = H(), B = h.TPLB; if (!x || x.go) return safetyMovementGuide();
    if (!q) return stepPageOld(id);
    const st = stageOf(id), s = status(id), c = C[x.c];
    const head = `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}"><span class="dev-area-head-art sf-head-art">${hubArt(x.i, 'Safety')}</span><p class="hub-context">${F(st ? st.label : 'Safety')}</p><h1>${F(x.t)}</h1><p class="hub-lead">${F(LEAD2[id] || x.why)}</p></div>`;
    if (q.ba && !window.__sfNoBA) {
      // Nov 18, round 2: Spot the risk and See the fix as one same-scene before and after, then the fix rows.
      const shot = ([src, alt, pin], k) => `<figure><figcaption class="${k ? 'is-after' : 'is-before'}">${k ? F('After') : F('Before')}</figcaption><div class="sf-ba-img"><img src="${src}" alt="${F(alt)}" loading="lazy">${pin ? pins([pin]) : ''}</div></figure>`;
      const ba = `<section class="care-tpl-card sf-card"><div class="sf-ba">${q.ba.map(shot).join('')}</div>${fixRows(q.baFix || q.fix)}${B.ul(q.notes)}</section>`;
      const tests2 = `<section class="care-tpl-card sf-card sf-checks"><ul>${q.checks.map(t => `<li><i aria-hidden="true"></i><span>${F(t)}</span></li>`).join('')}</ul></section>`;
      const acts = s === 'done' ? `<p class="hub-done">${F('Done')} ✓</p><button class="hub-link" onclick="sfSet('${id}','')">${F('Undo')}</button>`
        : `<button class="hub-button" onclick="sfSet('${id}','done');back()">${F('Mark as done')}</button><button class="hub-link sf-na" onclick="sfSet('${id}','${s === 'na' ? '' : 'na'}');back()">${F(s === 'na' ? 'It applies after all' : 'Doesn’t apply to our home')}</button>`;
      return `<div class="quiet-category hub-page hub-detail sf-step" data-overview="Safety" data-ss="1" data-sf-step="${id}" style="${yearTheme('Safety')};--ss-bg:${c[0]};--ss-ink:${c[1]}">${detailPageTop('Safety')}${head}`
        + `<div class="care-tpl is-getready">` + B.sec('Before and after', ba) + (q.checks.length ? B.sec('Check your home', tests2) : '') + `</div><div class="hub-actions sf-actions">${acts}</div></div>`;
    }
    // 1. Spot the risk
    const spot = q.spotPhoto ? `<section class="care-tpl-card sf-card">${photo(q.spotPhoto)}${q.spotLine ? `<p class="sf-cap">${F(q.spotLine)}</p>` : ''}</section>` : B.tiles(q.spotTiles, 'Safety');
    // 2. See the fix: the fixed version, then how to do it, in one card when there's a photo
    const how = fixRows(q.fix);
    const fix = `<section class="care-tpl-card sf-card">${q.fixPair ? pair(q.fixPair) : photo(q.fixPhoto)}${how}${B.ul(q.notes)}</section>`;
    // 3. Check your home: hands-on tests, then the one control
    const tests = `<section class="care-tpl-card sf-card sf-checks"><ul>${q.checks.map(t => `<li><i aria-hidden="true"></i><span>${F(t)}</span></li>`).join('')}</ul></section>`;
    const actions = s === 'done' ? `<p class="hub-done">${F('Done')} ✓</p><button class="hub-link" onclick="sfSet('${id}','')">${F('Undo')}</button>`
      : `<button class="hub-button" onclick="sfSet('${id}','done');back()">${F('Mark as done')}</button><button class="hub-link sf-na" onclick="sfSet('${id}','${s === 'na' ? '' : 'na'}');back()">${F(s === 'na' ? 'It applies after all' : 'Doesn’t apply to our home')}</button>`;
    return `<div class="quiet-category hub-page hub-detail sf-step" data-overview="Safety" data-ss="1" data-sf-step="${id}" style="${yearTheme('Safety')};--ss-bg:${c[0]};--ss-ink:${c[1]}">${detailPageTop('Safety')}${head}`
      + `<div class="care-tpl is-getready">` + B.sec('Spot the risk', spot) + B.sec('See the fix', fix) + B.sec('Check your home', tests) + `</div><div class="hub-actions sf-actions">${actions}</div></div>`;
  }

  /* ---------- the earlier step page (kept, behind window.__sfStepOld) ---------- */
  function stepPageOld(id) {
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
