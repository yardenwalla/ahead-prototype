/* MOCKUP ONLY: Development, simple and readable at a glance.
   The main page has three things: what Maya is doing (top card + four areas), two ideas for today, and "Is Maya on track?".
   Everything else moves one tap away. */
(function () {
  const F = s => (window.__hub ? __hub.F(s) : s);
  const B = s => (window.hubBabyify || (x => x))(s);
  const KEYS = [2, 4, 6, 9, 12];
  const WAKE = m => m < 2 ? '45–60 minutes' : m < 3 ? '1–1½ hours' : m < 5 ? '1½–2 hours' : m < 7 ? '2–2½ hours' : m < 10 ? '2½–3 hours' : '3–4 hours';
  const BIG = {
    2: ['When will she smile at me?', 'Most babies smile back by about 6–8 weeks. If Maya was born early, count from her due date.'],
    4: ['Should she be rolling yet?', 'Not yet for most babies. Rolling usually shows up between 4 and 6 months.'],
    6: ['When will she sit on her own?', 'Most babies sit without support by about 9 months. Sitting propped on her hands is right on track.'],
    9: ['What about crawling?', 'Many babies skip crawling. Some scoot or roll instead. What matters is that Maya finds a way to move.'],
    12: ['Should she be walking?', 'Not yet for most babies. First steps often come between 12 and 15 months.']
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
    const ideas = page.querySelector('.dev-awake');
    if (ideas) {
      ideas.querySelector('.hub-card-head b').textContent = F('Try today');
      const all = [...ideas.querySelectorAll('.dev-idea')], i = today() % all.length;
      all.forEach((b, k) => { if (k !== i && k !== (i + 1) % all.length) b.remove(); });
      ideas.insertAdjacentHTML('beforeend', `<button class="hub-link dm-more" onclick="openPage('chg:Development:d:more:${ref}')">${F('More ideas for awake time')} ›</button>`);
    }
    const tiles = page.querySelector('.hub-glance');
    if (tiles) tiles.querySelector('.hub-card-head b').textContent = F('What Maya is working on');
    // One row for the worry, in the parent's words.
    const row = `<div class="hub-list"><button class="hub-row" onclick="openPage('chg:Development:d:ontrack:${ref}')"><span class="hub-dot">${hubArt('smile', 'Development')}</span><span class="hub-row-copy"><b>${F('Is Maya on track?')}</b><small>${F('What she’s likely doing, and when to call')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>`;
    (ideas || tiles).insertAdjacentHTML('afterend', row);
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
    const m = typeof actualMonth === 'function' ? actualMonth() : ref;
    const signs = ref >= 6 ? `<div class="hub-list"><button class="hub-row" onclick="openPage('chg:Development:d:signs')"><span class="hub-dot">${hubArt('signs', 'Development')}</span><span class="hub-row-copy"><b>${F('Try a few baby signs')}</b><small>${F('More, eat, milk and all done')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>` : '';
    return inner.replace('</div></div>', `</div></div>`).replace(/(<div class="dev-ideas is-grid">)/, `<p class="dm-wake">${F(`Maya is usually awake for ${WAKE(m)} at a time. A few minutes of any of these is plenty.`)}</p>$1`).replace(/<\/div>$/, `${signs}</div>`);
  }
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if (cat === 'Development' && screen === 'd' && a === 'ontrack') return onTrack(Number(b));
    if (cat === 'Development' && screen === 'd' && a === 'more') return moreIdeas(Number(b), baseRoute(p));
    return baseRoute(p);
  };
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
  const css = document.createElement('style');
  css.textContent = `
#main .dm-chips { display: flex; flex-wrap: wrap; gap: 6px }
#main .dm-chip { font-size: 13.5px; line-height: 1.3; padding: 8px 12px; border-radius: 999px; background: var(--year-pale); color: var(--ink) }
#main .dm-chips.is-done .dm-chip { background: #e6f5ec }
#main .dm-chips.is-done .dm-chip::before { content: "✓ "; color: #356651; font-weight: 700 }
#main .dm-a { margin: 0; font-size: 14.5px; line-height: 1.55; color: #4c4757 }
#main .dm-more { margin-top: 14px }
#main .dm-wake { margin: 0 0 14px; font-size: 14.5px; line-height: 1.5; color: #4c4757 }
#main .hub-page[data-overview="Development"] .hub-lead { color: #5c5361 }
`;
  document.head.appendChild(css);
})();
