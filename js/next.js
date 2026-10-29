/* Ahead · What's next: one timeline across every category, for the next few months.
   Home is "now", Next is "coming up", Categories is "look something up", Memories is "look back".
   Each item opens the matching category page. Things a parent has already told us about (solids started,
   two naps) drop out. Timing follows the same basis as each category: checkups and travel by birthday age,
   everything else by adjusted age for babies born early. */
(function () {
  const ICON = { Development: 'smile', Feeding: 'bowl', Sleep: 'moon', Health: 'steth', Safety: 'shield', 'Daily rhythm': 'bath', 'Out and about': 'stroller' };
  const F = s => (window.__hub ? window.__hub.F(s) : s);
  const DAY = 864e5, MONTH = 30.4375 * DAY;
  const born = () => parse(profile.dob);
  const careFrom = () => (profile.early && profile.due ? parse(profile.due) : born());
  const ageAt = (from, d = NOW) => (d - from) / MONTH;
  // The date a given age (in months) is reached, counted from birth or from the due date.
  const dateAt = (from, m) => { const d = new Date(from); d.setMonth(d.getMonth() + Math.floor(m)); d.setDate(d.getDate() + Math.round((m % 1) * 30.4)); return d; };
  const when = d => { const days = Math.round((d - NOW) / DAY); if (days <= 0) return 'now'; if (days < 7) return 'this week'; if (days < 35) return `in about ${Math.round(days / 7)} week${Math.round(days / 7) === 1 ? '' : 's'}`; return 'around ' + d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); };

  // Each item: when it usually starts and ends, the age it follows, what's happening, and what to do.
  // stage: the category stage it belongs to (Sleep and Feeding), so "Around now" matches the category page.
  function items() {
    const a = typeof answers !== 'undefined' ? answers : {};
    const solids = a.solids === 'Yes';
    const I = (start, end, basis, cat, title, line, todo, go, o = {}) => ({ start, end, basis, cat, title, line, todo, go, ...o });
    const list = [
      I(1.5, 4, 'care', 'Sleep', 'Nights start to stretch', 'One longer stretch of sleep at night is often the first sign.', 'Keep nights dark and quiet so that stretch can grow.', "openPage('chg:Sleep:s:1')", { stage: 1 }),
      I(3, 5, 'care', 'Sleep', 'The 4-month sleep regression', 'More night waking for a few weeks, as sleep cycles mature.', 'Keep your usual routine. It usually passes in a few weeks.', "openPage('chg:Sleep:e:0')"),
      I(4, 9, 'care', 'Sleep', 'Naps settle into three a day', 'With about 2–2½ hours awake in between.', 'Watch for sleepy cues about 2 hours after waking.', "openPage('chg:Sleep:s:2')", { stage: 2 }),
      I(6, 9, 'care', 'Sleep', 'The late nap drops, leaving two', 'Usually between 6 and 9 months.', 'Move bedtime a little earlier while the catnap goes.', "openPage('chg:Sleep:s:3')", { stage: 3, skip: a.twoNaps === 'Yes' }),
      I(8, 10, 'care', 'Sleep', 'Separation anxiety can disrupt sleep', 'Bedtime protests can come back for a while.', 'Keep goodbyes short and bedtime familiar.', "openPage('chg:Sleep:e:1')"),
      I(13, 18, 'care', 'Sleep', 'Two naps become one', 'Usually between 13 and 18 months.', 'Push the morning nap a little later every few days.', "openPage('chg:Sleep:d:after')"),
      I(0.6, 3, 'care', 'Feeding', 'Cluster feeding: lots of feeds close together', 'Often around 3 weeks, 6 weeks and 3 months.', 'Feed when Maya’s hungry. It usually settles in a few days.', "openPage('chg:Feeding:e:0')"),
      I(4, 6, 'care', 'Feeding', 'Getting ready for solids', 'Most babies are ready around 6 months.', 'Tick off the four readiness signs as you see them.', "openPage('chg:Feeding:d:signs')", { stage: 2, skip: solids }),
      I(6, 7, 'care', 'Feeding', 'First tastes of solids', 'A few bites a day, while milk stays the main food.', 'Pick a calm morning and start with something rich in iron.', "openPage('chg:Feeding:s:3')", { stage: 3, skip: solids }),
      I(7, 9, 'care', 'Feeding', 'Thicker textures and finger foods', 'Lumpier food, and soft pieces to pick up.', 'Mash instead of blending, and offer soft finger-sized strips.', "openPage('chg:Feeding:s:4')", { stage: 4, skip: solids && a.foodExperience === 'established' }),
      I(9, 12, 'care', 'Feeding', 'Meals grow to three a day', 'With milk alongside.', 'Offer what you eat, cut small and soft.', "openPage('chg:Feeding:s:5')", { stage: 5 }),
      I(12, 13, 'care', 'Feeding', 'The milk change at 12 months', 'Whole milk from a cup can replace formula.', 'Swap one bottle at a time for a cup.', "openPage('chg:Feeding:d:milk12')"),
      I(3, 6, 'care', 'Safety', 'Rolling brings the floor within reach', 'Time to clear small things away.', 'Clear the floor, and switch to a sleep sack at the first roll.', "openPage('safety-stage:reaching')"),
      I(6, 10, 'care', 'Safety', 'Crawling opens up the whole room', 'Time to babyproof, room by room.', 'Gate the stairs and check each room at floor level.', "openPage('safety-stage:moving')", { skip: a.crawl === 'Yes' }),
      I(8, 10, 'care', 'Safety', 'Pulling up on furniture', 'Time to anchor dressers and other furniture.', 'Anchor dressers and set the crib mattress to its lowest.', "openPage('safety-stage:pulling')", { skip: a.pullUp === 'Yes', soonOnly: true }),
      I(0.5, 1, 'care', 'Daily rhythm', 'First tub bath', 'Once the cord stump has fallen off and healed.', 'About 2 inches of warm water, with a hand on Maya the whole time.', "openPage('chg:Daily rhythm:d:tub')"),
      I(4, 6, 'care', 'Daily rhythm', 'Drooling and chewing start', 'Often long before the first tooth.', '', "openPage('chg:Daily rhythm:d:gums')", { icon: 'tooth' }),
      I(6, 12, 'care', 'Daily rhythm', 'The first tooth arrives', 'Usually between 6 and 12 months.', '', "openPage('chg:Daily rhythm:d:teeth')", { skip: a.hasTooth === 'Yes', icon: 'tooth' }),
      I(6, 7, 'care', 'Daily rhythm', 'Sunscreen can join in', 'From 6 months, alongside shade.', '', "openPage('chg:Daily rhythm:d:sun')", { icon: 'sun' }),
      I(9, 12, 'care', 'Daily rhythm', 'Cruising and first steps', 'Pulling up and cruising come before walking.', '', "openPage('chg:Daily rhythm:d:steps')", { icon: 'stand' }),
      I(3, 6, 'birth', 'Out and about', 'Longer trips get easier', 'Steadier heads and feeds make road trips and flights more doable.', 'On long drives, plan a stop every 2 hours.', "openPage('chg:Out and about:s:1')"),
      I(6, 12, 'birth', 'Out and about', 'Outgrowing the infant car seat', 'Many babies do in the first year. The next seat still faces back.', '', "openPage('chg:Out and about:d:bigger')", { icon: 'car' })
    ];
    // Development: what most babies do by each stage.
    if (typeof DEV_STAGES !== 'undefined') Object.keys(DEV_STAGES).map(Number).filter(r => r > 0).forEach(r => list.push(I(r - 0.5, r, 'care', 'Development', DEV_STAGES[r].title, `What most babies do by ${r === 12 ? '1 year' : r + ' months'}.`, 'See the skills to look for, and simple ways to play along.', `openPage('development-stage:${r}')`)));
    // Checkups, by birthday age, skipping any already recorded.
    if (typeof WELL_VISITS !== 'undefined') WELL_VISITS.filter(v => v > 0).forEach(v => {
      const rec = typeof healthRecord === 'function' ? healthRecord(v) : null;
      list.push(I(v, v + 0.4, 'birth', 'Health', healthJourneyLabel(v), v === 9 ? 'Growth, development and any catch-up shots.' : 'Growth, development and the vaccines due.', 'Add your questions now, so they’re ready at the visit.', `openHealthDetail(${v},'questions')`, { skip: rec && rec.status === 'attended' }));
    });
    const cur = cat => (typeof chgStageIndex === 'function' ? chgStageIndex(cat) : null);
    return list.filter(x => !x.skip && !(x.soonOnly && ageAt(careFrom()) >= 7)).map(x => {
      const from = x.basis === 'birth' ? born() : careFrom(), now = ageAt(from);
      let at = dateAt(from, x.start), state = x.start > now ? 'ahead' : now < x.end ? 'now' : 'past';
      // Sleep and Feeding follow the category page: the current stage is "now", earlier ones are done,
      // and a later stage whose usual start has passed is "coming up soon" rather than "now".
      if (x.stage != null && cur(x.cat) != null) {
        const c = cur(x.cat);
        state = x.stage === c ? (now < x.end + 1 ? 'now' : 'past') : x.stage < c ? 'past' : 'ahead';
        if (state === 'ahead' && x.start <= now) at = new Date(NOW.getTime() + 14 * DAY);
      }
      return { ...x, at, now, state };
    });
  }

  function card(i) {
    return `<button class="next-item" style="${yearTheme(i.cat)}" onclick="${i.go}"><span class="next-dot">${hubArt(i.icon || ICON[i.cat] || 'star', i.cat)}</span><span class="next-copy"><small>${esc(displayTopic(i.cat))}</small><b>${F(i.title)}</b><span>${F(i.line)}</span></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  }

  window.nextPage = function () {
    const all = items();
    const nowItems = all.filter(i => i.state === 'now');
    // Around now: the current stage in each category, plus a passing phase if one is happening (a regression, separation anxiety).
    const here = [...Object.values(nowItems.reduce((o, i) => { const k = i.cat + (i.stage == null && /regression|anxiety|Cluster/.test(i.title) ? ':phase' : ''); if (!o[k] || i.start > o[k].start) o[k] = i; return o; }, {}))].sort((a, b) => a.start - b.start);
    const ahead = all.filter(i => i.state === 'ahead').sort((a, b) => a.at - b.at);
    const soon = ahead.filter(i => i.at - NOW <= 4 * MONTH), later = ahead.filter(i => i.at - NOW > 4 * MONTH && i.start <= 13);
    // Group by calendar month. Each item's date already follows the right age (adjusted for early babies),
    // so the headings are plain dates and the page runs on one clock.
    const groups = [], thisMonth = NOW.getFullYear() * 12 + NOW.getMonth();
    soon.forEach(i => { const k = i.at.getFullYear() * 12 + i.at.getMonth(); let g = groups.find(x => x.k === k); if (!g) groups.push(g = { k, at: i.at, list: [] }); g.list.push(i); });
    const label = m => m === 0 ? 'Newborn' : m === 12 ? '1 year' : `${m} month${m === 1 ? '' : 's'}`;
    // Born early: both ages, so the month headings line up with the adjusted-age guides.
    const ageNote = d => { const b = Math.floor(ageAt(born(), d)), c = Math.floor(ageAt(careFrom(), d)); return `Maya will be ${label(b)}${c !== b ? ` · ${Math.max(0, c)} adjusted` : ''}`; };
    let h = `<div class="next-page"><div class="eyebrow">${F('Coming up for Maya')}</div><h1>${F('Timeline')}</h1><p class="next-lead">${F('The next few months at a glance, across everything. Tap anything to read ahead.')}</p>`;
    if (here.length) h += `<section class="next-group is-now"><div class="next-when"><b>${F('Around now')}</b><span>${F(label(Math.floor(ageAt(born()))))}</span></div><div class="next-list">${here.map(card).join('')}</div></section>`;
    h += groups.map(g => `<section class="next-group"><div class="next-when"><b>${F(g.k === thisMonth ? 'Later this month' : g.at.toLocaleDateString('en-US', { month: 'long' }))}</b><span>${F(g.k === thisMonth ? '' : ageNote(new Date(g.at.getFullYear(), g.at.getMonth(), 15)))}</span></div><div class="next-list">${g.list.map(card).join('')}</div></section>`).join('');
    if (!soon.length && !here.length) h += `<p class="next-lead">${F('That’s the first year covered. Keep these guides close as Maya grows.')}</p>`;
    if (later.length) h += `<details class="next-later"><summary>${F('Later in the year')} <span>${later.length}</span></summary><div class="next-list">${later.map(i => card(i).replace('</small>', ` · ${esc(when(i.at).replace(/^around /, ''))}</small>`)).join('')}</div></details>`;
    h += `<p class="hub-foot">${F('Ages are typical. Every baby moves at their own pace.')}</p></div>`;
    return h;
  };

  /* ---------- Home answers say they were saved ---------- */
  ['confirmHomeSwaddle', 'completeHomeCheck'].forEach(fn => {
    const base = window[fn];
    if (typeof base !== 'function') return;
    window[fn] = function (...args) {
      const r = base.apply(this, args);
      if (typeof hubToast === 'function') {
        if (fn === 'confirmHomeSwaddle') hubToast('Saved', F('Sleep now shows sleep-sack tips for Maya. You can change this in Baby’s details.'));
        else hubToast(args[1] === 'na' ? 'Hidden' : 'Done', args[1] === 'na' ? 'We won’t bring this up again.' : 'Ticked off in Safety.');
      }
      return r;
    };
  });

  /* ---------- the tab ---------- */
  const NEXT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h12M12 6l6 6-6 6"/><path d="M20 4v16"/></svg>';
  const baseRender = render;
  let lastPage = null;
  window.render = render = function () {
    const isNext = page === 'next';
    baseRender();
    // A confirmation belongs to the screen it was made on: clear it once the parent moves on.
    try { if (lastPage !== null && lastPage !== page) document.querySelectorAll('.hub-toast').forEach(t => t.remove()); } catch (e) { /* no DOM */ }
    lastPage = page;
    // DOM touch-ups only; skipped quietly where there's no full DOM (the test runner).
    try {
      const nav = document.getElementById('nav');
      if (nav && !nav.hidden && typeof nav.querySelector === 'function') {
        let btn = nav.querySelector('[data-tab="next"]');
        if (!btn) { btn = document.createElement('button'); btn.dataset.tab = 'next'; btn.setAttribute('onclick', "navigate('next')"); btn.innerHTML = NEXT_ICON + 'Timeline'; const home = nav.querySelector('button'); home ? home.after(btn) : nav.prepend(btn); }
        // The highlighted tab is the one you came from: a page opened from Next or Home keeps that tab lit.
        const roots = { home: 0, next: 1, categories: 2, timeline: 3 }, from = isNext ? 'next' : (typeof historyStack !== 'undefined' ? [...historyStack].reverse().find(p => p in roots) : null);
        if (from === 'next' || (from === 'home' && page !== 'home' && !/^(categories|timeline)$/.test(page))) {
          const tabs = [...nav.querySelectorAll('button')], target = from === 'next' ? btn : tabs.find(b => /navigate\('home'\)/.test(b.getAttribute('onclick') || ''));
          if (target) { tabs.forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); }); target.classList.add('active'); target.setAttribute('aria-current', 'page'); }
        }
      }
      if (isNext) document.getElementById('main').innerHTML = nextPage();
      // Home's "Coming up" gets a way into the full timeline.
      const ahead = document.querySelector('#main .connected-ahead:not(.brief-preview) .connected-section-heading');
      if (ahead && typeof ahead.insertAdjacentHTML === 'function' && !ahead.querySelector('.next-link')) ahead.insertAdjacentHTML('beforeend', `<button class="textlink next-link" onclick="navigate('next')">${F('See the full timeline')} →</button>`);
    } catch (e) { /* no DOM to touch */ }
  };
})();

/* Old activity pages are retired: any link that still points at one opens the ideas list for that stage. */
(function () {
  if (typeof openPage !== 'function') return;
  const base = openPage;
  window.openPage = openPage = function (p, ...rest) {
    const m = /^play-activity:(\d+):/.exec(String(p || ''));
    return base(m ? `chg:Development:d:more:${m[1]}` : p, ...rest);
  };
})();
