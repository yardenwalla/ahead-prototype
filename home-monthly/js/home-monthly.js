/* Ahead · Home preview: a monthly Home (Nov 8).
   Home updates once a month instead of feeling like a feed:
   1. The month card and Home's one question, as today.
   2. This week: only what can't wait for the month (a checkup, a season, a safety step the baby just made necessary).
   3. Big changes this month: the same changes as Timeline, for this month only.
   4. This month, area by area: one line for each area with something new, and one quiet line naming the rest.
   Preview only: the area lines are written for each month of the year and follow the parent's answers where it
   matters (solids started, moving). */
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MONTH = 30.4375 * 864e5;
  const P = () => (typeof babyPronouns === 'function' ? babyPronouns() : { s: 'they', o: 'them', p: 'their' });
  const fill = t => { const p = P(), n = name(); return String(t).replace(/\{N\}/g, n).replace(/\bMaya\b/g, n).replace(/\{s\}/g, p.s).replace(/\{o\}/g, p.o).replace(/\{p\}/g, p.p).replace(/\{S\}/g, p.s[0].toUpperCase() + p.s.slice(1)); };
  const careAge = () => { const from = profile.early && profile.due ? parse(profile.due) : parse(profile.dob); return Math.max(0, (NOW - from) / MONTH); };
  const bdayAge = () => Math.max(0, (NOW - parse(profile.dob)) / MONTH);
  const AREA = { Development: 'Development & play', Feeding: 'Feeding', Sleep: 'Sleep', Health: 'Health', Safety: 'Safety', 'Daily rhythm': 'Everyday care' };
  const ORDER = ['Feeding', 'Sleep', 'Development', 'Safety', 'Daily rhythm', 'Health'];
  const solids = () => typeof answers !== 'undefined' && answers.solids === 'Yes';
  const moving = () => typeof answers !== 'undefined' && (answers.crawl === 'Yes' || answers.pullUp === 'Yes');

  // What's new in each area, month by month. Only areas with something new get a line.
  // Health follows the birthday (checkups); everything else follows adjusted age for babies born early.
  const LINES = {
    0: { Feeding: 'Feed whenever {s} shows hunger, usually 8–12 times a day. Wet diapers tell you it’s going well.',
      Sleep: 'Short sleeps around the clock are normal. On {p} back, in a bare crib, for every sleep.',
      Development: '{N} sees your face best from about a foot away, so get close when you talk.',
      'Daily rhythm': 'Sponge baths until the cord stump falls off, usually in 1–3 weeks.',
      Safety: 'The two things to get right first: the car seat and a safe place to sleep.' },
    1: { Feeding: 'Cluster feeding, lots of feeds close together, is normal around growth spurts.',
      Sleep: 'Evening crying often builds now and peaks around 6–8 weeks. It does pass.',
      Development: 'First real smiles usually arrive by 2 months.',
      'Daily rhythm': 'Once the cord stump has healed, {N} is ready for a first tub bath.' },
    2: { Sleep: 'One longer stretch at night is often the first sign nights are changing. A simple bedtime routine helps it grow.',
      Development: '{N} starts cooing. Talk back when {s} does, and leave a pause for {o} to answer.' },
    3: { Sleep: 'The 4-month sleep regression can start around now: more night waking for a few weeks.',
      Development: '{N} starts swiping at toys and bringing {p} hands to {p} mouth.',
      Safety: 'Reaching starts: keep hot drinks and small things out of arm’s reach.' },
    4: { Feeding: 'Solids usually start around 6 months. Start watching for the readiness signs now.',
      Sleep: 'Stop swaddling at the first sign {s}’s trying to roll.',
      Development: 'Chuckles when you play, and swipes at toys within reach.',
      Safety: 'Rolling can start any day, so beds and sofas are off-limits now.',
      'Daily rhythm': 'Drooling and chewing often start long before a first tooth.' },
    5: { Feeding: 'Readiness signs to watch: a steady head, sitting with support and real interest in food.',
      Sleep: 'Naps usually settle into three a day, with about 2 hours awake in between.',
      Development: 'Laughs, blows raspberries and may roll from tummy to back.' },
    6: { Feeding: () => solids() ? 'A few bites a day is plenty. Once a few foods are going well, try a new allergen.' : 'Solids can start whenever you’re ready. Lead with something rich in iron.',
      Development: 'Knows familiar faces, and leans on {p} hands to sit.',
      Safety: () => moving() ? 'Keep going with babyproofing, one room at a time.' : 'Crawling is coming. Babyproof room by room before it starts.',
      'Daily rhythm': 'Sunscreen can start now, alongside shade and a hat.' },
    7: { Feeding: () => solids() ? 'Time for thicker textures: mash instead of blending, and try soft finger foods.' : 'If solids haven’t started yet, now’s a good time. Lead with something rich in iron.',
      Sleep: 'The late catnap may start dropping, leaving two naps.',
      Development: 'Passes toys from hand to hand and looks for things that drop.',
      'Daily rhythm': 'A first tooth could come any time now. Gums can be sore before it does.' },
    8: { Feeding: () => solids() ? 'Soft finger foods {s} can pick up, cut into strips the size of your finger.' : 'If solids haven’t started yet, now’s a good time. Lead with something rich in iron.',
      Sleep: 'Separation anxiety can make bedtime harder. Short, warm goodbyes help.',
      Development: 'Plays peekaboo and looks when you say {p} name.',
      Safety: 'Lower the crib mattress once {s} can sit up on {p} own.' },
    9: { Feeding: 'Meals grow toward three a day, with milk alongside.',
      Development: 'Gets into sitting on {p} own and rakes food toward {o} with {p} fingers.',
      Safety: 'Pulling up is next: anchor dressers and bookcases to the wall.' },
    10: { Feeding: 'Soft pieces of what you’re eating, cut small, work well now.',
      Development: 'First words may come soon, often “mama” or “dada”.',
      'Daily rhythm': 'Brush any teeth twice a day with a rice-grain smear of fluoride toothpaste.' },
    11: { Feeding: 'At 12 months, whole milk from a cup can take over from formula. Start practicing with the cup now.',
      Development: 'Cruises along furniture, and may take a step or two holding on.',
      Health: 'Book a first dentist visit for around the first birthday.' },
    12: { Feeding: 'Whole milk from a cup can start now, up to about 16 oz a day.',
      Sleep: 'Two naps usually last until somewhere between 13 and 18 months.',
      Development: 'Waves bye-bye, and first steps may be close.' }
  };
  const CHECK = { 1: 'The 1-month checkup: growth, feeding and how you’re doing.', 2: 'The 2-month checkup brings the first main round of vaccines.', 4: 'The 4-month checkup: movement, feeding and sleep, plus vaccines.', 6: 'The 6-month checkup: first foods, teeth and vaccines.', 9: 'The 9-month checkup includes a development check.', 12: 'The 12-month checkup: vaccines, plus anemia and lead checks.' };
  const GO = { Feeding: "openPage('topic:Feeding')", Sleep: "openPage('topic:Sleep')", Development: "openPage('topic:Development')", Safety: "openPage('topic:Safety')", 'Daily rhythm': "openPage('topic:Daily rhythm')", Health: "openPage('topic:Health')" };

  function areaLines() {
    const m = Math.min(12, Math.floor(careAge())), hb = Math.min(12, Math.floor(bdayAge()));
    const src = LINES[m] || {}, out = [];
    ORDER.forEach(cat => {
      let t = cat === 'Health' ? (CHECK[hb] || src.Health) : src[cat];
      if (typeof t === 'function') t = t();
      if (t) out.push([cat, fill(t)]);
    });
    return { m, out, quiet: ORDER.filter(c => !out.some(x => x[0] === c)) };
  }

  // Big changes this month: Timeline's changes that are underway or start within the next month.
  function bigChanges() {
    const C = window.__yaC || [], done = window.__yaDone ? window.__yaDone() : {}, a = careAge();
    return C.filter(c => !done[c.id] && c.start <= a + 1 && c.end > a).sort((x, y) => x.start - y.start).slice(0, 3)
      .map(c => ({ c, when: c.start <= a ? 'Any time now' : 'In the next few weeks' }));
  }

  // Only what can't wait for the month stays a weekly card.
  const THIS_WEEK = ['checkup', 'rsv', 'flu', 'clocks', 'hot-days', 'cold-car-seat', 'swaddle', 'swaddle-now', 'rolling-now', 'crawl-now', 'stand-now', 'stand-soon', 'car-seat', 'vitamin-d', 'safe-sleep', 'fever-rule'];

  const icon = cat => (typeof catIcon === 'function' ? catIcon(cat) : '');
  function paintMonthly() {
    const main = document.getElementById('main'); if (!main || !main.querySelector('.connected-now')) return;
    if (main.querySelector('.hm-month')) return;
    // 1. Pull this week's cards out of the old card list; everything else is covered by the month.
    const weekCards = [...main.querySelectorAll('.home2-card')].filter(el => THIS_WEEK.includes(el.dataset.card)).slice(0, 2);
    main.querySelectorAll('.connected-summary-links, section.connected-ahead:not(.brief-preview)').forEach(e => e.remove());
    const close = main.querySelector('.brief-close'); if (close) close.remove();
    let { m, out, quiet } = areaLines(); const big = bigChanges();
    // A checkup already on This week isn't said twice.
    if (weekCards.some(el => el.dataset.card === 'checkup')) out = out.filter(x => x[0] !== 'Health');
    let h = '';
    if (weekCards.length) h += `<section class="hm-sec hm-week"><div class="hm-head"><h2>This week</h2></div><div class="hm-week-list"></div></section>`;
    if (big.length) h += `<section class="hm-sec"><div class="hm-head"><h2>Big changes this month</h2><button class="hm-link" onclick="navigate('next')">See the year ›</button></div>`
      + big.map(({ c, when }) => `<button class="hm-big" style="${yearTheme(c.cat)}" onclick="${c.go}"><span class="hm-big-ic">${typeof hubArt === 'function' ? hubArt(c.icon, c.cat) : ''}</span><span class="hm-big-copy"><small>${esc(when)} · ${esc(fill(c.range))}</small><b>${esc(c.title)}</b><span>${esc(fill(c.why))}</span></span><span class="hm-go" aria-hidden="true">›</span></button>`).join('') + `</section>`;
    h += `<section class="hm-sec hm-month"><div class="hm-head"><h2>What’s new this month</h2></div><div class="hm-list">`
      + out.map(([cat, t]) => `<button class="hm-row" style="${yearTheme(cat)}" onclick="${GO[cat]}"><span class="hm-row-ic">${icon(cat)}</span><span class="hm-row-copy"><small>${esc(AREA[cat])}</small><span>${esc(t)}</span></span><span class="hm-go" aria-hidden="true">›</span></button>`).join('')
      + `</div>${quiet.length ? `<p class="hm-quiet">${esc(`Nothing new in ${listOf(quiet.map(c => AREA[c]))} this month.`)}</p>` : ''}</section>`;
    h += `<p class="hm-close">${esc(`Next month’s Home arrives on ${nextBirthday()}.`)}</p>`;
    main.querySelector('.connected-now').insertAdjacentHTML('afterend', h);
    const list = main.querySelector('.hm-week-list'); if (list) weekCards.forEach(el => list.appendChild(el));
  }
  const listOf = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1];
  function nextBirthday() {
    const dob = parse(profile.dob), d = new Date(dob); let k = 0;
    while (d <= NOW && k < 24) { k++; d.setTime(dob.getTime()); d.setMonth(dob.getMonth() + k); }
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  }
  const baseRender = window.render;
  window.render = render = function () {
    const r = baseRender.apply(this, arguments);
    try { if (page === 'home' && (typeof isCurrent !== 'function' || isCurrent())) paintMonthly(); } catch (e) { console.error(e); }
    return r;
  };
})();
