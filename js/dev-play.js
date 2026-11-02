/* Ahead · Development & play: ideas as pictures, and skill photos and videos inside the app.
   Ideas to try together: four per stage, each a flat picture that opens a short how-to page.
   Each skill's CDC photo or video opens on the area page, so nobody leaves the app. */
(function () {
  const H = () => window.__hub;
  const F = s => H().F(s);
  const B = s => (window.hubBabyify || (x => x))(s);

  // Play text fixes: "them" that meant the toys, and plainer lines.
  const FIX = {
    'choose-two': { title: 'Which one does Maya want?' },
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

  // Try today, on the summary: two of the stage's ideas, a different pair each day, and the rest one tap away.
  window.devTodayCard = ref => {
    const list = stageIdeas(ref), d = Math.floor((typeof NOW !== 'undefined' ? NOW : new Date()) / 864e5), i = list.length ? d % list.length : 0;
    const two = list.length > 2 ? [list[i], list[(i + 1) % list.length]] : list;
    return `<section class="hub-card dev-awake"><span class="hub-card-head"><b>${F('Try today')}</b></span><div class="dev-ideas">${two.map(a => tile(a, ref)).join('')}</div><button class="hub-link dev-more-link" onclick="openPage('chg:Development:d:more:${ref}')">${F('More ideas for awake time')} ›</button></section>`
      // From 6 months: a few baby signs, so Maya can say what she wants before she has the words.
      + (ref >= 6 ? H().list('', [H().row({ icon: 'signs', cat: 'Development', title: 'Try a few baby signs', sub: 'More, eat, milk and all done', onclick: `openPage('chg:Development:d:signs')` })]) : '');
  };
  // How long Maya is usually awake at a time, by the age the guides follow (adjusted age for babies born early). Same ranges as Sleep.
  const WAKE = m => m < 2 ? '45–60 minutes' : m < 3 ? '1–1½ hours' : m < 5 ? '1½–2 hours' : m < 7 ? '2–2½ hours' : m < 10 ? '2½–3 hours' : '3–4 hours';
  // On Movement, the idea that answers the big question of the age.
  const MOVE = {
    4: { id: 'tummy-picture', title: 'A picture at floor level', why: 'Turning to look is how rolling starts.', steps: ['During tummy time, prop a bold picture where Maya can see it.', 'Lie down facing {o} and talk about it.', 'Move it a little to one side so {s} {turn|turns} to look.'] },
    6: { id: 'supported-reach', title: 'A toy beside your knee', why: 'Reaching while sitting builds the balance {s} {need|needs} to sit on {p} own.', steps: ['Sit Maya on the floor, supported around {p} chest as needed.', 'Hold a toy close beside your knee.', 'Let {o} lean and reach for it.'] },
    9: { id: 'toy-reach', hero: 9, title: 'A toy just out of reach', why: 'A reason to move is all most babies need.', steps: ['Put a favorite toy on the floor, a little out of Maya’s reach.', 'Cheer {o} on as {s} {scoot|scoots}, {roll|rolls} or {crawl|crawls} toward it.', 'If {s} {get|gets} frustrated, move it a bit closer.'] },
    12: { id: 'cruise-toy', hero: 12, title: 'Cruise to a toy', why: 'Stepping along furniture, called cruising, comes before first steps.', steps: ['Put a toy at the far end of a sturdy sofa or low table.', 'Let Maya hold on and step sideways to reach it.', 'Stay close and keep the floor clear.'] }
  };
  const moveArt = mv => mv.hero ? (window.devHeroArt ? devHeroArt(mv.hero) : '') : devPlayArt(mv.id);
  window.devMoveIdea = ref => MOVE[ref] ? Object.assign({}, MOVE[ref], { art: moveArt(MOVE[ref]) }) : null;

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
    if (!open && box.dataset.desc && !box.querySelector('.dev-desc')) box.insertAdjacentHTML('afterbegin', `<p class="dev-desc">${box.dataset.desc}</p>`);
    box.querySelectorAll('.hub-embed figcaption small').forEach(x => { x.textContent = 'Video · CDC'; });
    box.hidden = open;
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? 'See what it looks like' : 'Hide';
  };
  // Skills that are obvious from words alone don't get a photo or video; the one-line description is enough.
  const NO_MEDIA = new Set(['laughs', 'squeals', 'chuckles-during-play', 'smiles-back-at-you', 'makes-sounds-beyond-crying', 'responds-to-loud-sounds', 'moves-both-arms-and-legs', 'looks-at-your-face', 'seems-glad-to-see-you', 'likes-looking-at-self-in-a-mirror', 'waves-goodbye', 'raises-arms-to-be-picked-up', 'enjoys-peekaboo', 'coos', 'brings-hands-to-mouth', 'puts-things-in-mouth-to-explore']);
  window.devSeeButton = (key, title) => (typeof DEV_EXAMPLE_LINKS !== 'undefined' && DEV_EXAMPLE_LINKS[key] && !NO_MEDIA.has(key)) ? `<button class="dev-see" aria-expanded="false" data-title="${title}" onclick="devSeeIt(this,'${key}')">See what it looks like</button>` : '';

  function frame(title, context, lead, inner) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head"><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }
  function ideasPage(ref) {
    const live = typeof isCurrent !== 'function' || isCurrent(), m = live ? developmentMonth(actualMonth()) : ref, h = H();
    const lead = live && devRef(m) === ref ? `Maya is usually awake for ${WAKE(m)} at a time. A few minutes of any of these is plenty.` : 'A few minutes of any of these is plenty. Pick one that suits the moment.';
    const pics = stageIdeas(ref), shown = new Set(pics.map(a => a.id));
    // Six more ideas per stage, picked for variety (a book, a song, outside, moving, everyday things), in one collapsed list.
    const MORE = { 2: ['smile-pause', 'change-chat', 'book-voices', 'outside-pause', 'slow-song', 'floor-company'], 4: ['sock-puppet', 'page-pat', 'barefoot-kicks', 'lap-sway', 'follow-toy', 'touch-rhyme'], 6: ['mirror-faces', 'roll-interest', 'rhyming-page', 'leaf-watch', 'sound-side', 'feet-discovery'], 9: ['lift-flap', 'knock-stack', 'peek-corner', 'roll-ball', 'song-pause', 'spoon-bowl'], 12: ['feed-teddy', 'open-close', 'body-song', 'put-in', 'follow-point', 'stir-bowl'] };
    const extra = (MORE[ref] || []).filter(id => !shown.has(id)).map(find).filter(Boolean);
    const more = extra.filter(Boolean).length ? `<details class="dev-more-ideas"><summary><span>${F(`${extra.length} more ideas`)}</span><span class="faq-plus" aria-hidden="true">＋</span></summary><ul class="dev-more-list">${extra.filter(Boolean).map(a => `<li><button onclick="openPage('chg:Development:d:idea:${ref}:${a.id}')"><span>${F(B(a.title))}</span><span class="hub-chev" aria-hidden="true">›</span></button></li>`).join('')}</ul></details>` : '';
    const signs = false && ref >= 6 ? h.list('', [h.row({ icon: 'signs', cat: 'Development', title: 'Try a few baby signs', sub: 'More, eat, milk and all done', onclick: `openPage('chg:Development:d:signs')` })]) : '';
    return frame('Ideas to try together', `Awake time · by ${ref === 12 ? '1 year' : ref + ' months'}`, lead, `<div class="dev-ideas is-grid">${pics.map(a => tile(a, ref)).join('')}</div>${more}`);
  }
  function movePage(ref) {
    const mv = window.devMoveIdea(ref), h = H();
    if (!mv) return ideasPage(ref);
    return frame(mv.title, 'Try this together', mv.why, `<figure class="dev-idea-hero">${mv.art}</figure>` + h.steps(mv.steps) + h.note('Stay close, and stop when Maya looks away or fusses. That’s {p} way of saying “enough for now.”'));
  }
  function ideaPage(ref, id) {
    const a = find(id), h = H();
    if (!a) return ideasPage(ref);
    const ctx = ctxFor(a), steps = (typeof playInstructionSteps === 'function' ? playInstructionSteps(a.how) : [a.how]).map(s => B(s));
    return frame(B(a.title), 'Ideas to try together', B(ctx.explain || a.why || ''),
      (devPlayArt(a.id) ? `<figure class="dev-idea-hero">${devPlayArt(a.id)}</figure>` : '') + h.steps(steps) + (ctx.notice ? h.tip('What to notice', B(ctx.notice)) : '')
      + h.note('Stay close, and stop when Maya looks away or fusses. That’s {p} way of saying “enough for now.”'));
  }
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b, c] = p.split(':');
    if ((cat === 'Development' || cat === 'Daily rhythm') && screen === 'd' && a === 'more') return ideasPage(devRef(Number(b)));
    if (cat === 'Development' && screen === 'd' && a === 'move') return movePage(DEV_STAGES[b] ? Number(b) : devRef(Number(b)));
    if (cat === 'Development' && screen === 'd' && a === 'idea') return ideaPage(DEV_STAGES[b] ? Number(b) : devRef(Number(b)), c);
    return baseRoute(p);
  };
})();
