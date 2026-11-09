/* Ahead · Home preview: "What's ahead for Maya", a dashboard (Nov 8).
   Six tiles, one per area. A tile never shows what the parent can already see (current naps, a skill she has).
   Each tile shows one of three things Ahead knows and the parent doesn't have at a glance:
   - What's next in that area, and when (from Timeline's changes, skipping ones already done or past)
   - The next date (Health's checkup)
   - Progress on what to do before it happens (Safety's babyproofing for the stage)
   Below the tiles: This week, only for things that can't wait (a checkup, a season, a safety step). */
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MONTH = 30.4375 * 864e5;
  const P = () => (typeof babyPronouns === 'function' ? babyPronouns() : { s: 'they', o: 'them', p: 'their' });
  const fill = t => { const p = P(); return String(t).replace(/\{N\}/g, name()).replace(/\{s\}/g, p.s).replace(/\{o\}/g, p.o).replace(/\{p\}/g, p.p); };
  const careAge = () => { const from = profile.early && profile.due ? parse(profile.due) : parse(profile.dob); return Math.max(0, (NOW - from) / MONTH); };

  // Short tile names and one action line for each change on Timeline.
  const T = {
    crying: ['The crying peak', 'Fussy evenings peak around 6–8 weeks, then ease.'],
    smile: ['First smiles', 'Smile back and wait. It’s {p} first conversation.'],
    nights: ['Longer nights', 'A short bedtime routine helps the long stretch grow.'],
    regress: ['Sleep regression', 'More night waking for a few weeks. It passes.'],
    roll: ['Rolling', 'Lots of floor time helps. Keep the floor around {o} clear.'],
    ready: ['Ready for solids', 'Watch for the four readiness signs.'],
    solids: ['First foods', 'Lead with something rich in iron.'],
    twonaps: ['Two naps', 'A skipped catnap is usually the first sign.'],
    sit: ['Sitting up', 'Lower the crib mattress once {s} does.'],
    crawl: ['Crawling', 'Babyproof before {s} starts.'],
    tooth: ['First tooth', 'Start brushing from the very first one.'],
    finger: ['Finger foods', 'Soft strips {s} can pick up on {p} own.'],
    meals: ['Three meals', 'Soft pieces of what you eat, three times a day.'],
    sep: ['Separation anxiety', 'Short, warm goodbyes help.'],
    pull: ['Pulling up', 'Anchor dressers and bookcases to the wall.'],
    words: ['First words', 'Name things as you go through the day.'],
    milk: ['Whole milk', 'Start practicing with an open cup.'],
    steps: ['First steps', 'Bare feet are best indoors.']
  };
  const TILE = [['Sleep', 'Sleep'], ['Feeding', 'Feeding'], ['Development', 'Development'], ['Safety', 'Safety'], ['Health', 'Health'], ['Daily rhythm', 'Everyday care']];

  function when(c, a) {
    if (a >= c.start) return 'Any time now';
    const m = c.start - a;
    if (m < 0.75) return 'In the next few weeks';
    const n = Math.round(m);
    return `In about ${n} month${n === 1 ? '' : 's'}`;
  }
  function nextChange(cat) {
    const C = window.__yaC || [], done = window.__yaDone ? window.__yaDone() : {}, a = careAge();
    // Prefer a change that's just starting or still ahead; one that began long ago is old news.
    const all = C.filter(x => x.cat === cat && !done[x.id] && x.end > a && T[x.id]).sort((x, y) => x.start - y.start || x.end - y.end);
    const c = all.find(x => a - x.start < 1.5) || all[0];
    if (!c || c.start > a + 4) return null;
    return { eyebrow: when(c, a), big: T[c.id][0], line: fill(T[c.id][1]), go: c.go };
  }
  function healthTile() {
    const dob = parse(profile.dob), at = m => { const d = new Date(dob); d.setMonth(d.getMonth() + m); return d; };
    const recorded = typeof journeyData === 'function' ? journeyData().records.filter(r => r.type === 'visit') : [];
    const hit = m => recorded.some(r => String(r.title || '').startsWith(`${m}-month`) || r.checkupMonth === m);
    const m = [1, 2, 4, 6, 9, 12].find(k => at(k) >= new Date(NOW.getTime() - 14 * 864e5) && !hit(k));
    if (m == null) return null;
    const d = at(m), days = Math.round((d - NOW) / 864e5);
    const soon = days <= 0 ? 'Due now' : days < 14 ? `In ${days} day${days === 1 ? '' : 's'}` : days < 60 ? `In ${Math.round(days / 7)} weeks` : `In about ${Math.round(days / 30.4)} months`;
    return { eyebrow: `${m}-month checkup`, big: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), line: `${soon}. Save questions as you think of them.`, go: "openPage('topic:Health')" };
  }
  function safetyTile() {
    const s = window.__sfProgress ? window.__sfProgress() : null;
    if (!s || !s.of) return null;
    if (s.done >= s.of) return { eyebrow: 'Babyproofing', big: 'All done', line: 'Nothing left to set up for this stage.', go: s.go };
    return { eyebrow: 'Babyproofing done', big: `${s.done} of ${s.of}`, line: s.next ? `Next: ${s.next}` : 'Babyproofing for this stage.', go: s.go, meter: s.done / s.of };
  }
  const icon = cat => (typeof catIcon === 'function' ? catIcon(cat) : '');

  // Only what can't wait stays a weekly card.
  const THIS_WEEK = ['checkup', 'rsv', 'flu', 'clocks', 'hot-days', 'cold-car-seat', 'swaddle', 'swaddle-now', 'rolling-now', 'crawl-now', 'stand-now', 'stand-soon', 'car-seat', 'vitamin-d', 'safe-sleep', 'fever-rule'];

  // Every change still ahead (or underway, but started recently), across areas, soonest first.
  function upcoming() {
    const C = window.__yaC || [], done = window.__yaDone ? window.__yaDone() : {}, a = careAge();
    return C.filter(x => T[x.id] && !done[x.id] && x.end > a && a - x.start < 1.5 && x.start <= a + 3)
      .sort((x, y) => x.start - y.start || x.end - y.end).map(c => ({ c, when: when(c, a), soon: a >= c.start }));
  }
  const shortWhen = (c, a) => { if (a >= c.start) return 'Now'; if (c.start - a < 0.75) return 'Soon'; const n = Math.round(c.start - a); return `In ${n} month${n === 1 ? '' : 's'}`; };

  // v2, after walking through it as parents: one thing that matters most, then three glances. Nothing to read twice.
  function paint() {
    const main = document.getElementById('main'); if (!main || !main.querySelector('.connected-now') || main.querySelector('.hd-dash')) return;
    const week = [...main.querySelectorAll('.home2-card')].filter(el => THIS_WEEK.includes(el.dataset.card)).slice(0, 1);
    main.querySelectorAll('.connected-summary-links, section.connected-ahead:not(.brief-preview)').forEach(e => e.remove());
    const close = main.querySelector('.brief-close'); if (close) close.remove();
    const a = careAge(), up = upcoming(), hero = up[0];
    let h = '<section class="hd-dash">';
    if (hero) h += `<div class="hd-head"><h2>${esc(`Up next for ${name()}`)}</h2></div><button class="hd-hero" style="${yearTheme(hero.c.cat)}" onclick="${hero.c.go}"><span class="hd-hero-art">${typeof hubArt === 'function' ? hubArt(hero.c.icon, hero.c.cat) : ''}</span><small class="hd-when">${esc(hero.when)}</small><b class="hd-hero-title">${esc(T[hero.c.id][0])}</b><span class="hd-line">${esc(fill(T[hero.c.id][1]))}</span><span class="hd-hero-go">Read ahead ›</span></button>`;
    // Three glances: the next checkup, then the next changes in other areas. A word or two each.
    const glance = [];
    const ht = healthTile(); if (ht) glance.push({ cat: 'Health', top: ht.big, label: 'Checkup', go: ht.go });
    const used = new Set(hero ? [hero.c.cat] : []);
    up.slice(1).forEach(({ c }) => { if (glance.length < 3 && !used.has(c.cat)) { used.add(c.cat); glance.push({ cat: c.cat, top: shortWhen(c, a), label: T[c.id][0], go: c.go }); } });
    if (glance.length) h += `<div class="hd-glance" style="grid-template-columns:repeat(${glance.length},1fr)">${glance.map(g => `<button class="hd-mini" style="${yearTheme(g.cat)}" onclick="${g.go}"><span class="hd-ic">${icon(g.cat)}</span><b>${esc(g.top)}</b><span>${esc(g.label)}</span></button>`).join('')}</div>`;
    h += '</section>';
    if (week.length) h += `<section class="hd-week"><div class="hd-head"><h2>This week</h2></div><div class="hd-week-list"></div></section>`;
    main.querySelector('.connected-now').insertAdjacentHTML('afterend', h);
    const list = main.querySelector('.hd-week-list'); if (list) week.forEach(el => list.appendChild(el));
  }
  const base = window.render;
  window.render = render = function () {
    const r = base.apply(this, arguments);
    try { if (page === 'home' && (typeof isCurrent !== 'function' || isCurrent())) paint(); } catch (e) { console.error(e); }
    return r;
  };
})();
