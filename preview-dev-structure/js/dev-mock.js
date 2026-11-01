/* MOCKUP ONLY: Development, simple and readable at a glance.
   The main page has three things: what Maya is doing (top card + four areas), two ideas for today, and "Is Maya on track?".
   Everything else moves one tap away. */
(function () {
  const F = s => (window.__hub ? __hub.F(s) : s);
  const B = s => (window.hubBabyify || (x => x))(s);
  const KEYS = [2, 4, 6, 9, 12];
  const WAKE = m => m < 2 ? '45–60 minutes' : m < 3 ? '1–1½ hours' : m < 5 ? '1½–2 hours' : m < 7 ? '2–2½ hours' : m < 10 ? '2½–3 hours' : '3–4 hours';
  const BIG = {
    2: ['When will {s} smile at me?', 'Most babies smile back by about 6–8 weeks.'],
    4: ['Should {s} be rolling yet?', 'Not yet for most babies. Rolling usually shows up between 4 and 6 months.'],
    6: ['When will {s} sit on {p} own?', 'Most babies sit without support by about 9 months. Sitting propped on {p} hands is right on track.'],
    9: ['What about crawling?', 'Many babies skip crawling. Some scoot or roll instead. What matters is that Maya finds a way to move.'],
    12: ['Should {s} be walking?', 'Not yet for most babies. First steps often come between 12 and 15 months.']
  };
  const labelsAt = ref => Object.values(DEVELOPMENT_DOMAINS[ref] || {}).map(a => a[0]).filter(Boolean);
  const chip = l => `<span class="dm-chip">${F(B(clearMilestone(l)))}</span>`;
  const today = () => Math.floor((typeof NOW !== 'undefined' ? NOW : new Date()) / 864e5);

  function dress() {
    const page = document.querySelector('#main .hub-page[data-overview="Development"]:not(.hub-detail)');
    if (!page || page.dataset.mock) return;
    page.dataset.mock = '1';
    const ref = Number(page.dataset.developmentGuide), m = typeof actualMonth === 'function' ? actualMonth() : ref;
    // Move everything that isn't essential off the main page.
    page.querySelectorAll('.hub-eyes, .hub-versus, .hub-more, .hub-next').forEach(e => e.remove());
    page.querySelectorAll('.hub-list').forEach(l => { if (/baby signs|other parents/i.test(l.textContent)) l.remove(); });
    // Ideas: two for today, then one line and a link.
    const LEAD = {
      4: 'Play starts to feel like a conversation: smiles, little sounds and swiping at toys. Rolling usually follows, between 4 and 6 months.',
      9: 'Sitting frees both hands for babbling, banging and finding things. Not crawling yet? Many babies skip it.',
      12: 'Waving, copying and pulling up to stand. First steps usually come between 12 and 15 months.'
    };
    const lead = page.querySelector('.dev-hero-lead');
    if (lead && LEAD[ref]) lead.textContent = F(LEAD[ref]);
    const ideas = page.querySelector('.dev-awake');
    if (ideas) {
      ideas.querySelector('.hub-card-head b').textContent = F('Try today');
      const all = [...ideas.querySelectorAll('.dev-idea')], i = today() % all.length;
      all.forEach((b, k) => { if (k !== i && k !== (i + 1) % all.length) b.remove(); });
      ideas.insertAdjacentHTML('beforeend', `<button class="hub-link dm-more" onclick="openPage('chg:Development:d:more:${ref}')">${F('More ideas for awake time')} ›</button>`);
    }
    const tiles = page.querySelector('.hub-glance');
    if (tiles) {
      tiles.querySelector('.hub-card-head b').textContent = F('What Maya is working on');
      
      if (window.MOCK_MINI || /tiles=mini/.test(location.search)) tiles.querySelectorAll('.dev-area').forEach(t => { const d = (t.className.match(/is-(\w+)/) || [])[1], a = t.querySelector('.dev-area-art'); if (a && MINI[d]) { a.innerHTML = MINI[d](null, ref); a.classList.add('dm-mini'); } });
    }
  }

  // Small pictures for the four area tiles, in the same style as Sleep's tiles: simple shapes, no faces.
  const MINI = {
    Social: c => `<svg viewBox="0 0 120 40"><circle cx="46" cy="20" r="14" fill="#f2b8c6"/><circle cx="70" cy="22" r="11" fill="#f4d6c4"/><path d="M90 10c-2-3-7-1-5 2 1 2 5 5 5 5s4-3 5-5c2-3-3-5-5-2Z" fill="#e88aa3"/></svg>`,
    Talking: c => `<svg viewBox="0 0 120 40"><rect x="8" y="6" width="46" height="22" rx="11" fill="#f3d58a"/><path d="M18 26l-4 9 11-7Z" fill="#f3d58a"/><circle cx="22" cy="17" r="2.4" fill="#fff"/><circle cx="31" cy="17" r="2.4" fill="#fff"/><circle cx="40" cy="17" r="2.4" fill="#fff"/><rect x="62" y="14" width="30" height="16" rx="8" fill="#fbe6bd"/></svg>`,
    Thinking: c => `<svg viewBox="0 0 120 40"><path d="M14 34c2-16 10-24 22-24s20 8 22 24Z" fill="#bfe3cf"/><circle cx="58" cy="30" r="6" fill="#f2b8c6"/><path d="M76 12q6-8 12 0" stroke="#356651" stroke-opacity=".4" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-dasharray="2 4"/></svg>`,
    Movement: (c, ref) => ref <= 2 ? `<svg viewBox="0 0 120 40"><rect x="8" y="22" width="60" height="10" rx="5" fill="#b9cdf3"/><circle cx="74" cy="20" r="9" fill="#f4d6c4"/></svg>`
      : ref <= 4 ? `<svg viewBox="0 0 120 40"><rect x="8" y="24" width="58" height="10" rx="5" fill="#b9cdf3"/><circle cx="74" cy="16" r="9" fill="#f4d6c4"/><path d="M66 28l8-8" stroke="#f4d6c4" stroke-width="5" stroke-linecap="round"/></svg>`
      : ref <= 6 ? `<svg viewBox="0 0 120 40"><path d="M28 34a22 22 0 1 1 44 0" fill="#b9cdf3"/><path d="M50 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 0" fill="none"/><circle cx="50" cy="8" r="0" /></svg>`.replace('<path d="M50 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 0" fill="none"/><circle cx="50" cy="8" r="0" />', '<circle cx="50" cy="10" r="8" fill="#f4d6c4"/>')
      : ref <= 9 ? `<svg viewBox="0 0 120 40"><rect x="14" y="14" width="40" height="12" rx="6" fill="#b9cdf3"/><path d="M20 26v8M48 26v8" stroke="#f4d6c4" stroke-width="5" stroke-linecap="round"/><circle cx="62" cy="14" r="8" fill="#f4d6c4"/><path d="M78 34h30" stroke="#356651" stroke-opacity=".25" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 5"/></svg>`
      : `<svg viewBox="0 0 120 40"><rect x="34" y="8" width="44" height="5" rx="2.5" fill="#8fa6d6"/><rect x="72" y="12" width="4" height="26" rx="2" fill="#8fa6d6"/><rect x="40" y="18" width="12" height="16" rx="6" fill="#b9cdf3"/><circle cx="46" cy="12" r="0"/><circle cx="46" cy="12" r="7" fill="#f4d6c4"/><path d="M42 34v4M50 34v4" stroke="#f4d6c4" stroke-width="4" stroke-linecap="round"/></svg>`
  };
  const HINT = { 2: ['Social', 'Smiling back comes around 6–8 weeks'], 4: ['Movement', 'Rolling usually comes at 4–6 months'], 6: ['Movement', 'Sitting on {p} own comes by about 9 months'], 9: ['Movement', 'Not crawling? That’s OK'], 12: ['Movement', 'Walking usually comes at 12–15 months'] };
  // Fix 5: an idea for moving, on the Movement page, right under the big question.
  const MOVE = {
    4: { id: 'tummy-picture', title: 'A picture at floor level', art: () => devPlayArt('tummy-picture'), steps: ['During tummy time, prop a bold picture where Maya can see it.', 'Lie down facing {o} and talk about it.', 'Move it a little to one side so {s} turns to look.'], why: 'Turning to look is how rolling starts.' },
    6: { id: 'supported-reach', title: 'A toy beside your knee', art: () => devPlayArt('supported-reach'), steps: ['Sit Maya on the floor, supported around {p} chest as needed.', 'Hold a toy close beside your knee.', 'Let {o} lean and reach for it.'], why: 'Reaching while sitting builds the balance {s} needs to sit on {p} own.' },
    9: { id: 'toy-reach', title: 'A toy just out of reach', art: () => devHeroArt(9), steps: ['Put a favorite toy on the floor, a little out of Maya’s reach.', 'Cheer {o} on as {s} scoots, rolls or crawls toward it.', 'If {s} gets frustrated, move it a bit closer.'], why: 'A reason to move is all most babies need.' },
    12: { id: 'cruise-toy', title: 'Cruise to a toy', art: () => devHeroArt(12), steps: ['Put a toy at the far end of a sturdy sofa or low table.', 'Let Maya hold on and step sideways to reach it.', 'Stay close and keep the floor clear.'], why: 'Stepping along furniture comes before first steps.' }
  };
  const BIG_AREA = { 2: 'Social', 4: 'Movement', 6: 'Movement', 9: 'Movement', 12: 'Movement' };
  // Area pages answer "is she on track?" themselves: what she's likely doing already, the big question if it's about this area, and when to call.
  function dressArea() {
    const page = document.querySelector('#main .dev-area-page');
    if (!page || page.dataset.mock) return;
    page.dataset.mock = '1';
    const domain = (page.className.match(/is-(\w+)/) || [])[1];
    const ref = Number((page.querySelector('.hub-context') || {}).textContent.match(/\d+/)?.[0]) || 6;
    const r = ref === 1 ? 12 : ref, prev = KEYS[KEYS.indexOf(r) - 1];
    const done = prev ? (DEVELOPMENT_DOMAINS[prev][domain] || []) : [];
    const head = page.querySelector('.dev-area-head');
    page.querySelector('.hub-seen-meter, .hub-meter')?.remove();
    head.insertAdjacentHTML('afterend', `<p class="dm-sub">${F(`Working on now, by ${r === 12 ? '1 year' : r + ' months'}`)}</p>`);
    // Calmer skill cards: the title and Seen it; what it looks like opens on tap.
    page.querySelectorAll('.dev-skill').forEach(c => { const d = c.querySelector('.hub-row-copy small'), see = c.querySelector('.dev-see'), box = c.querySelector('.dev-media'); if (d && box) { box.dataset.desc = d.textContent; d.remove(); } else if (d && !see) d.remove(); });

    const note = page.querySelector('.hub-note');
    const big = BIG_AREA[r] === domain && BIG[r] ? `<section class="hub-card dm-bigq"><span class="hub-card-head"><b>${F(BIG[r][0])}</b></span><p class="dm-a">${F(BIG[r][1])}</p></section>` : '';
    const call = `<p class="dm-call">${F('Not all of these yet? Mention it at {p} next checkup. Call sooner if Maya loses a skill {s} had.')}</p>`;
    const mv = domain === 'Movement' && MOVE[r] ? MOVE[r] : null;
    if (mv) page.querySelectorAll('.dev-try, .hub-list').forEach(e => { if (/Try this together/i.test(e.textContent)) e.remove(); });
    const move = mv ? `<section class="hub-card dev-try"><span class="hub-card-head"><b>${F('Try this together')}</b></span><button class="dev-try-row" onclick="openPage('chg:Development:d:move:${r}')"><span class="dev-idea-art">${mv.art()}</span><span class="hub-row-copy"><b>${F(mv.title)}</b><small>${F(mv.why)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></section>` : '';
    if (note) { note.insertAdjacentHTML('afterend', big + move + call); note.remove(); }
    // The page ends on the call line: any older "Try this together" after it goes.
    if (mv) { const c = page.querySelector('.dm-call'); while (c && c.nextElementSibling) c.nextElementSibling.remove(); }
  }
  // "Is Maya on track?" on its own page.
  function onTrack(ref) {
    const prev = KEYS[KEYS.indexOf(ref) - 1], h = __hub, age = ref === 12 ? '1 year' : ref + ' months';
    const big = BIG[ref];
    return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head"><p class="hub-context">${F('Development & play')}</p><h1>${F('Is Maya on track?')}</h1><p class="hub-lead">${F('Every baby moves at their own pace. Here’s what most babies do around now.')}</p></div>
      <section class="hub-card"><span class="hub-card-head"><b>${F('Probably doing already')}</b></span><div class="dm-chips is-done">${(prev ? labelsAt(prev) : []).slice(0, 4).map(chip).join('') || `<span class="dm-chip">${F('Calms to your voice')}</span><span class="dm-chip">${F('Watches faces up close')}</span>`}</div></section>
      <section class="hub-card"><span class="hub-card-head"><b>${F(`Working on next, by ${age}`)}</b></span><div class="dm-chips">${labelsAt(ref).slice(0, 4).map(chip).join('')}</div></section>
      ${big ? `<section class="hub-card"><span class="hub-card-head"><b>${F(big[0])}</b></span><p class="dm-a">${F(big[1])}</p></section>` : ''}
      ${h.versus('When to call your pediatrician', ['Not yet', 'Some skills come a little later. Bring it up at the next checkup.'], ['Call', 'If Maya loses a skill she had, or isn’t doing most of the “already” list.'])}</div>`;
  }
  // More ideas: all four, how long she's usually awake, and baby signs from 6 months.
  function moreIdeas(ref, inner) {
    const m = typeof developmentMonth === 'function' ? developmentMonth(actualMonth()) : ref;
    const signs = ref >= 6 ? `<div class="hub-list"><button class="hub-row" onclick="openPage('chg:Development:d:signs')"><span class="hub-dot">${hubArt('signs', 'Development')}</span><span class="hub-row-copy"><b>${F('Try a few baby signs')}</b><small>${F('More, eat, milk and all done')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>` : '';
    return inner.replace('</div></div>', `</div></div>`).replace(/(<div class="dev-ideas is-grid">)/, `<p class="dm-wake">${F(`Maya is usually awake for ${WAKE(m)} at a time. A few minutes of any of these is plenty.`)}</p>$1`).replace(/<\/div>$/, `${signs}</div>`);
  }
  const baseSee = window.devSeeIt;
  window.devSeeIt = function (btn, key) { baseSee(btn, key); const box = btn.closest('.dev-skill').querySelector('.dev-media'); if (box) box.querySelectorAll('figcaption small').forEach(x => { x.textContent = 'Video · CDC'; });
    // One designed cover for every video instead of YouTube's random frame: the area's color and picture, the play button on top.
    const poster = box && box.querySelector('.hub-embed-poster');
    if (poster && !poster.dataset.cover) {
      const page = btn.closest('.dev-area-page'), dom = (page.className.match(/is-(\w+)/) || [])[1], ref = Number((page.querySelector('.hub-context') || {}).textContent.match(/\d+/)?.[0]) || 6;
      poster.dataset.cover = '1'; poster.style.backgroundImage = 'none';
      poster.insertAdjacentHTML('afterbegin', `<span class="dm-cover">${window.devAreaArt ? devAreaArt(dom, ref === 1 ? 12 : ref).replace('viewBox="14 6 132 104"', 'viewBox="0 4 160 112"') : ''}</span>`);
    } if (box && box.dataset.desc && !box.querySelector('.dm-desc')) box.insertAdjacentHTML('afterbegin', `<p class="dm-desc">${box.dataset.desc}</p>`); };
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if (cat === 'Development' && screen === 'd' && a === 'ontrack') return onTrack(Number(b));
    if (cat === 'Development' && screen === 'd' && a === 'move' && MOVE[b]) { const mv = MOVE[b]; return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head"><p class="hub-context">${F('Try this together')}</p><h1>${F(mv.title)}</h1><p class="hub-lead">${F(mv.why)}</p></div><figure class="dev-idea-hero">${mv.art()}</figure>${__hub.steps(mv.steps)}${__hub.note('Stay close, and stop when Maya looks away or fusses. That’s {p} way of saying “enough for now.”')}</div>`; }
    if (cat === 'Development' && screen === 'd' && a === 'more') return moreIdeas(Number(b), baseRoute(p));
    return baseRoute(p);
  };
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); dressArea(); } catch (e) { console.error(e); } return r; };
  const css = document.createElement('style');
  css.textContent = `
#main .dm-chips { display: flex; flex-wrap: wrap; gap: 6px }
#main .dm-chip { font-size: 13.5px; line-height: 1.3; padding: 8px 12px; border-radius: 999px; background: var(--year-pale); color: var(--ink) }
#main .dm-chips.is-done .dm-chip { background: #e6f5ec }
#main .dm-chips.is-done .dm-chip::before { content: "✓ "; color: #356651; font-weight: 700 }
#main .dm-a { margin: 0; font-size: 14.5px; line-height: 1.55; color: #4c4757 }
#main .dm-more { margin-top: 14px }
/* Top card like Sleep's: the soft gradient and one quiet white circle, no number. */
#main .dev-hero-num, #main .dev-hero-spark { display: none }
#main .dev-hero::after { content: ""; position: absolute; right: -40px; top: -50px; width: 170px; height: 170px; border-radius: 50%; background: #fff; opacity: .35; pointer-events: none }
#main .dev-hero > * { position: relative; z-index: 1 }
#main .dev-hero-eyebrow { letter-spacing: 0; text-transform: none; font-size: 12.5px; font-weight: 600 }
/* Skill photos and videos framed like the app: the area's color as a mat, rounded corners, an app-style play button, a small source tag. */
#main .dev-area-page .dev-media { background: var(--area, var(--year-pale)); border-radius: 18px; padding: 8px 8px 10px; margin-top: 8px }
#main .dev-area-page .dev-media .hub-embed { border: 0; border-radius: 12px; background: none; margin: 0 }
#main .dev-area-page .dev-media .hub-embed-poster { border-radius: 12px; aspect-ratio: 4 / 3; filter: saturate(.85) brightness(1.04) }
#main .dev-area-page .dev-media .hub-embed-play { background: var(--year-ink); color: #fff; width: 52px; height: 52px; margin: -26px 0 0 -26px; box-shadow: 0 0 0 8px rgba(255,255,255,.55) }
#main .dev-area-page .dev-media figcaption { padding: 8px 4px 0 }
#main .dev-area-page .dev-media figcaption b { display: none }
#main .dev-area-page .dev-media figcaption a { display: none }
#main .dev-area-page .dev-media figcaption small, #main .dev-area-page .dev-photo figcaption { font-size: 12px; font-weight: 600; color: var(--year-ink) }
#main .dev-area-page .dev-photo { background: none; border-radius: 12px }
#main .dev-area-page .hub-embed-poster[data-cover] { background: #fff !important; filter: none }
#main .dm-cover { position: absolute; inset: 0; display: block }
#main .dm-cover svg { width: 100%; height: 100%; display: block }
#main .dm-cover svg > circle:first-of-type { fill: var(--area, var(--year-pale)) }
#main .dev-area-page .hub-embed-poster[data-cover] .hub-embed-play { top: auto; bottom: 14px; left: auto; right: 14px; margin: 0; width: 44px; height: 44px }
#main .dev-area-page .dev-photo img { border-radius: 12px; aspect-ratio: 4 / 3; object-fit: cover; filter: saturate(.85) brightness(1.04) }
#main .dev-area-page .dev-photo figcaption { padding: 8px 4px 0 }
#main .dm-already { margin: 12px 0 0; font-size: 13.5px; line-height: 1.45; color: #356651; font-weight: 600 }
#main .dm-desc { margin: 4px 0 10px; font-size: 14px; line-height: 1.5; color: #5c5361 }
#main .dev-area-page .dev-skill { min-height: 0; padding: 12px 14px }
#main .dev-area-page .dev-skill .dev-see { margin-top: 4px }
#main .dm-hint { display: block; font-style: normal; font-size: 12.5px; font-weight: 600; color: var(--year-ink); background: rgba(255,255,255,.7); border-radius: 10px; padding: 5px 8px; margin: 6px 14px 2px; line-height: 1.3 }
#main .dev-area-art.dm-mini { height: 30px !important; margin: 14px 14px 8px !important; width: auto !important }
#main .dev-area-art.dm-mini svg { height: 100% !important; width: auto !important }
#main .dev-area:has(.dm-mini) { padding-top: 0 }
#main .dm-sub { margin: 18px 4px 10px; font-size: 13px; font-weight: 700; color: var(--year-ink) }
#main .dm-done { margin-top: 0 }
#main .dm-bigq { margin-top: 16px }
#main .dm-call { margin: 16px 4px 0; font-size: 14px; line-height: 1.5; color: #4c4757 }
#main .dm-call { color: #5c5361 }
#main .dm-wake { margin: 0 0 14px; font-size: 14.5px; line-height: 1.5; color: #4c4757 }
#main .hub-page[data-overview="Development"] .hub-lead { color: #5c5361 }
`;
  document.head.appendChild(css);
})();
