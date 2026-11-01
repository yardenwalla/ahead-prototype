/* Ahead · Development & play: ideas as pictures, and skill photos and videos inside the app.
   Ideas to try together: four per stage, each a flat picture that opens a short how-to page.
   Each skill's CDC photo or video opens on the area page, so nobody leaves the app. */
(function () {
  const H = () => window.__hub;
  const F = s => H().F(s);
  const B = s => (window.hubBabyify || (x => x))(s);

  // Play text fixes: "them" that meant the toys, and plainer lines.
  const FIX = {
    'mirror-company': { extend: 'Make one expression in the mirror, then copy whatever face comes back.' },
    'two-hands': { explain: 'Turning one toy over gets both hands working together.' },
    'peek-face': { explain: 'Your face going away and coming back is the whole game, and it never gets old.' },
    'bang-two': { notice: 'Baby may tap the toys together, tap yours or explore each one on its own.' },
    'hidden-toy': { explain: 'Watching a toy disappear and finding it again is the whole fun of it.' },
    'empty-basket': { how: 'Put three large baby-safe toys in a shallow open basket. Let baby take the toys out, tip the basket or choose one to keep.' },
    'hello-wave': { explain: 'Waving the same way every time helps baby learn what a wave means.' },
    'stack-pair': { adapt: 'Hold the bottom block steady. Knocking the tower down is still play.' },
    'feed-teddy': { notice: 'Baby may bring the spoon near teddy or explore the spoon on {p} own.' }
  };
  const all = () => { const o = {}; for (let m = 0; m <= 12; m++) { const x = playStageModel(m); [...(x.primary || []), ...(x.more || [])].forEach(a => { if (!o[a.id]) o[a.id] = a; }); } return o; };
  const ctxFor = a => Object.assign({}, (typeof PLAY_CONTEXT !== 'undefined' && PLAY_CONTEXT[a.id]) || {}, FIX[a.id] || {});
  const find = id => { const a = all()[id]; return a ? Object.assign({}, a, FIX[id] || {}) : null; };
  const stageIdeas = ref => (window.DEV_STAGE_IDEAS[ref] || []).map(find).filter(Boolean);
  const tile = (a, ref) => `<button class="dev-idea" onclick="openPage('chg:Development:d:idea:${ref}:${a.id}')"><span class="dev-idea-art">${devPlayArt(a.id)}</span><b>${F(B(a.title))}</b></button>`;

  // The card on the summary: four pictures.
  window.devIdeasCard = ref => `<section class="hub-card dev-awake"><span class="hub-card-head"><b>${F('Ideas to try together')}</b></span><div class="dev-ideas">${stageIdeas(ref).map(a => tile(a, ref)).join('')}</div></section>`;

  // A skill's photo or video, opened on the page.
  window.devSeeIt = function (btn, key) {
    const box = btn.closest('.dev-skill').querySelector('.dev-media');
    if (!box) return;
    const open = !box.hidden;
    if (!open && !box.innerHTML) {
      const m = (typeof DEV_EXAMPLE_LINKS !== 'undefined' ? DEV_EXAMPLE_LINKS : {})[key];
      if (m && m.type === 'video') { const id = (m.href.match(/[?&]v=([\w-]{11})/) || [])[1]; box.innerHTML = id ? hubEmbed(id, btn.dataset.title || 'What it looks like', 'CDC') : ''; }
      else if (m) box.innerHTML = `<figure class="dev-photo"><img src="${m.href}" alt="${btn.dataset.title || ''}" loading="lazy"><figcaption>Photo · CDC</figcaption></figure>`;
    }
    box.hidden = open;
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? 'See what it looks like' : 'Hide';
  };
  window.devSeeButton = (key, title) => (typeof DEV_EXAMPLE_LINKS !== 'undefined' && DEV_EXAMPLE_LINKS[key]) ? `<button class="dev-see" aria-expanded="false" data-title="${title}" onclick="devSeeIt(this,'${key}')">See what it looks like</button>` : '';

  function frame(title, context, lead, inner) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head"><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }
  function ideasPage(ref) {
    return frame('Ideas to try together', `By ${ref === 12 ? '1 year' : ref + ' months'}`, 'A few minutes of any of these is plenty. Pick one that suits the moment.', `<div class="dev-ideas is-grid">${stageIdeas(ref).map(a => tile(a, ref)).join('')}</div>`);
  }
  function ideaPage(ref, id) {
    const a = find(id), h = H();
    if (!a) return ideasPage(ref);
    const ctx = ctxFor(a), steps = (typeof playInstructionSteps === 'function' ? playInstructionSteps(a.how) : [a.how]).map(s => B(s));
    return frame(B(a.title), 'Ideas to try together', B(ctx.explain || a.why || ''),
      `<figure class="dev-idea-hero">${devPlayArt(a.id)}</figure>` + h.steps(steps) + (ctx.notice ? h.tip('What to notice', B(ctx.notice)) : '')
      + h.note('Stay close, and stop when Maya looks away or fusses. That’s {p} way of saying “enough for now.”'));
  }
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b, c] = p.split(':');
    if ((cat === 'Development' || cat === 'Daily rhythm') && screen === 'd' && a === 'more') return ideasPage(devRef(Number(b)));
    if (cat === 'Development' && screen === 'd' && a === 'idea') return ideaPage(DEV_STAGES[b] ? Number(b) : devRef(Number(b)), c);
    return baseRoute(p);
  };
})();
