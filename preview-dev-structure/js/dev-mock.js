/* MOCKUP ONLY: Development reordered the way parents think.
   1 Maya now (already doing / working on next)  2 Awake time with Maya (how long, how a wake window can flow, ideas that say what they help with)
   3 What she's working on (the four area tiles)  4 The big question at this age, answered on the page  5 When to call, tied to "already doing". */
(function () {
  const F = s => (window.__hub ? __hub.F(s) : s);
  const KEYS = [2, 4, 6, 9, 12];
  const WAKE = m => m < 2 ? ['45–60 min', 0.85] : m < 3 ? ['1–1½ hours', 1.25] : m < 5 ? ['1½–2 hours', 1.75] : m < 7 ? ['2–2½ hours', 2.25] : m < 10 ? ['2½–3 hours', 2.75] : ['3–4 hours', 3.5];
  // How a wake window can flow, by age. Each piece: [icon, label, share of the window, color].
  const FLOW = m => m < 3
    ? [['bottle', 'Feed', 3, '#fbe3ec'], ['smile', 'Face time', 2, '#fdeee6'], ['mat', 'Tummy time', 2, '#e6f5ec'], ['moon', 'Wind down', 2, '#e3e6f6']]
    : m < 7
      ? [['bottle', 'Feed', 3, '#fbe3ec'], ['mat', 'Floor play', 4, '#e6f5ec'], ['book', 'A book', 2, '#fff3dc'], ['sun', 'Outside', 3, '#e7effc'], ['moon', 'Wind down', 2, '#e3e6f6']]
      : [['bowl', 'Meal or feed', 3, '#fbe3ec'], ['crawl', 'Move and explore', 5, '#e6f5ec'], ['book', 'Books', 2, '#fff3dc'], ['sun', 'Outside', 4, '#e7effc'], ['moon', 'Wind down', 2, '#e3e6f6']];
  // What each idea helps with, in a parent's words.
  const HELPS = { 'close-face': 'Smiling back', 'chest-chat': 'Lifting her head', 'bold-picture': 'Focusing her eyes', 'song-listen': 'Early sounds', 'mirror-company': 'Smiling first', 'easy-grip': 'Holding a toy', 'tummy-picture': 'Pushing up on elbows', 'crinkle-book': 'Swiping and grabbing', 'two-hands': 'Using both hands', 'peek-face': 'Laughing', 'supported-reach': 'Reaching and sitting', 'floor-drum': 'Cause and effect', 'hidden-toy': 'Looking for hidden things', 'empty-basket': 'Picking up and letting go', 'ball-turns': 'Taking turns', 'hello-wave': 'Waving', 'pretend-cup': 'Copying you', 'stack-pair': 'Stacking and letting go', 'action-book': 'Words and gestures', 'two-baskets': 'Moving things around' };
  // The one question parents ask most at each checkpoint, answered in full.
  const BIG = {
    2: ['When will she smile at me?', 'Most babies smile back by about 6–8 weeks. If Maya was born early, count from her due date.'],
    4: ['Should she be rolling yet?', 'Not yet for most babies. Rolling usually shows up between 4 and 6 months, often tummy to back first. At the first try, stop swaddling.'],
    6: ['When will she sit on her own?', 'Most babies sit without support by about 9 months. Until then, sitting propped on her hands is right on track.'],
    9: ['What about crawling?', 'Crawling isn’t on the checklist because many babies skip it. Some scoot, roll or go straight to pulling up. What matters is that Maya finds a way to move by about 9–10 months.'],
    12: ['Should she be walking?', 'Not necessarily. Most babies pull up and step along furniture by 1. First steps often come between 12 and 15 months, and walking on their own by 18 months.']
  };
  const labelsAt = ref => Object.values(DEVELOPMENT_DOMAINS[ref] || {}).map(arr => arr[0]).filter(Boolean);
  const chip = l => `<span class="dm-chip">${F((window.hubBabyify || (x => x))(clearMilestone(l)))}</span>`;

  function dress() {
    const page = document.querySelector('#main .hub-page[data-overview="Development"]:not(.hub-detail)');
    if (!page || page.dataset.mock) return;
    page.dataset.mock = '1';
    const ref = Number(page.dataset.developmentGuide), prev = KEYS[KEYS.indexOf(ref) - 1];
    const m = typeof actualMonth === 'function' ? actualMonth() : ref;
    const hero = page.querySelector('.dev-hero');
    const eyes = page.querySelector('.hub-eyes');
    const tiles = page.querySelector('.hub-glance');
    const ideas = page.querySelector('.dev-awake');
    const versus = page.querySelector('.hub-versus');
    const signs = [...page.querySelectorAll('.hub-list')].find(l => /baby signs/i.test(l.textContent));
    // 1. Maya now
    const now = `<section class="hub-card dm-now"><span class="hub-card-head"><b>${F('Maya now')}</b></span>
      ${prev ? `<p class="dm-sub">${F('Probably doing already')}</p><div class="dm-chips is-done">${labelsAt(prev).slice(0, 4).map(chip).join('')}</div>` : `<p class="dm-sub">${F('Right now')}</p><div class="dm-chips is-done"><span class="dm-chip">${F('Lots of sleep, short alert moments')}</span><span class="dm-chip">${F('Calms to your voice')}</span><span class="dm-chip">${F('Watches faces up close')}</span></div>`}
      <p class="dm-sub">${F(`Working on next, by ${ref === 12 ? '1 year' : ref + ' months'}`)}</p><div class="dm-chips">${labelsAt(ref).slice(0, 4).map(chip).join('')}</div></section>`;
    // 2. Awake time
    const [wake, hrs] = WAKE(m), flow = FLOW(m), total = flow.reduce((a, x) => a + x[2], 0);
    const flowHtml = `<div class="dm-flow">${flow.map(([ic, l, w, c]) => `<span class="dm-step" style="flex:${w};background:${c}"><i>${hubArt(ic, 'Development')}</i><small>${F(l)}</small></span>`).join('')}</div>`;
    if (ideas) {
      ideas.querySelectorAll('.dev-idea').forEach(b => { const id = (b.getAttribute('onclick').match(/:([a-z-]+)'\)$/) || [])[1]; if (HELPS[id]) b.insertAdjacentHTML('beforeend', `<small class="dm-helps">${F('Helps with: ' + HELPS[id].toLowerCase())}</small>`); });
      const head = ideas.querySelector('.hub-card-head');
      head.innerHTML = `<b>${F('Awake time with Maya')}</b>`;
      head.insertAdjacentHTML('afterend', `<div class="dm-wake"><span class="dm-wake-big">${F(wake)}</span><span class="dm-wake-cap">${F('Usually awake at a time, then ready to sleep again')}</span></div><p class="dm-sub">${F('A wake window might look like')}</p>${flowHtml}<p class="dm-sub">${F('Ideas to try together')}</p>`);
      if (m <= 6) ideas.insertAdjacentHTML('beforeend', `<p class="dm-note">${F(m < 2 ? 'Tummy time: a few minutes, 2–3 times a day, building to 15–30 minutes by 7 weeks.' : 'Tummy time: about 30 minutes a day in all, in short turns.')}</p>`);
    }
    // 4. Big question
    const big = BIG[ref] ? `<section class="hub-card dm-big"><span class="hub-card-head"><b>${F('The big question at this age')}</b></span><p class="dm-q">${F(BIG[ref][0])}</p><p class="dm-a">${F(BIG[ref][1])}</p></section>` : '';
    // 5. When to call, tied to "already doing"
    if (versus) {
      const urgent = versus.querySelector('.is-urgent p');
      if (urgent) urgent.textContent = F(prev ? 'If Maya isn’t doing most of the “probably doing already” skills, or loses a skill she had. You don’t need to wait for the checkup.' : 'If Maya doesn’t respond to loud sounds, or something worries you. You don’t need to wait for the checkup.');
    }
    // Reorder: hero, Maya now, awake time, signs, the four areas, big question, through her eyes, when to call, questions.
    const after = (a, html) => { a.insertAdjacentHTML('afterend', html); return a.nextElementSibling; };
    let cur = after(hero, now);
    if (ideas) { cur.after(ideas); cur = ideas; }
    if (signs) { cur.after(signs); cur = signs; }
    if (tiles) { tiles.querySelector('.hub-card-head b').textContent = F('What she’s working on'); cur.after(tiles); cur = tiles; }
    if (big) cur = after(cur, big);
    if (eyes) { cur.after(eyes); cur = eyes; }
    if (versus) { cur.after(versus); }
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
  const css = document.createElement('style');
  css.textContent = `
#main .dm-sub { margin: 12px 0 8px; font-size: 13px; font-weight: 600; color: var(--year-ink) }
#main .dm-chips { display: flex; flex-wrap: wrap; gap: 6px }
#main .dm-chip { font-size: 13px; line-height: 1.3; padding: 7px 11px; border-radius: 999px; background: var(--year-pale); color: var(--ink) }
#main .dm-chips.is-done .dm-chip { background: #e6f5ec }
#main .dm-chips.is-done .dm-chip::before { content: "✓ "; color: #356651; font-weight: 700 }
#main .dm-wake { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin: 4px 0 2px }
#main .dm-wake-big { font: 800 26px/1.1 var(--display-font, inherit); color: var(--year-ink) }
#main .dm-wake-cap { font-size: 13px; color: #5c5361 }
#main .dm-flow { display: flex; gap: 4px; margin-bottom: 4px }
#main .dm-step { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 10px 2px; border-radius: 12px; min-width: 0; text-align: center }
#main .dm-step i { width: 22px; height: 22px; display: block }
#main .dm-step i svg { width: 100%; height: 100% }
#main .dm-step small { font-size: 11px; line-height: 1.15; font-weight: 600; color: var(--ink) }
#main .dm-helps { display: block; padding: 0 4px; font-size: 12px; color: var(--year-ink); margin-top: -4px }
#main .dm-note { margin: 12px 0 0; font-size: 13px; color: #5c5361 }
#main .dm-q { margin: 2px 0 6px; font-weight: 700; font-size: 16px }
#main .dm-a { margin: 0; font-size: 14.5px; line-height: 1.55; color: #4c4757 }
`;
  document.head.appendChild(css);
})();
