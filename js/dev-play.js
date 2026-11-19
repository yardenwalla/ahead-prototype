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
  // Nov 19: Ahead's own photos for play ideas (Canva), so tiles and idea pages match the rest of Development.
  const PHOTO = { 'close-face': 'play-close-face', 'chest-chat': 'play-chest-chat', 'bold-picture': 'play-bold-picture', 'song-listen': 'play-song-listen',
    'sound-answer': 'play-sound-answer', 'mirror-company': 'play-mirror-company', 'easy-grip': 'play-easy-grip', 'tummy-picture': 'play-tummy-picture', 'crinkle-book': 'play-crinkle-book',
    'two-hands': 'play-two-hands', 'peek-face': 'play-peekaboo', 'supported-reach': 'play-toy-beside-knee', 'floor-drum': 'play-floor-drum',
    'hidden-toy': 'play-hidden-toy', 'empty-basket': 'play-empty-basket', 'ball-turns': 'play-ball-turns', 'hello-wave': 'play-hello-wave',
    'put-in': 'play-put-in', 'pretend-cup': 'play-pretend-cup', 'stack-pair': 'play-stack-pair', 'action-book': 'play-action-book', 'two-baskets': 'play-two-baskets',
    // Nov 19: the six more ideas for each age.
    'smile-pause': 'play-smile-pause', 'change-chat': 'play-change-chat', 'book-voices': 'play-book-voices', 'outside-pause': 'play-outside-pause', 'slow-song': 'play-slow-song', 'floor-company': 'play-floor-company', 'sock-puppet': 'play-sock-puppet', 'page-pat': 'play-page-pat', 'barefoot-kicks': 'play-barefoot-kicks', 'lap-sway': 'play-lap-sway', 'follow-toy': 'play-follow-toy', 'touch-rhyme': 'play-touch-rhyme', 'mirror-faces': 'play-mirror-faces', 'roll-interest': 'play-roll-interest', 'rhyming-page': 'play-rhyming-page', 'leaf-watch': 'play-leaf-watch', 'sound-side': 'play-sound-side', 'feet-discovery': 'play-feet-discovery', 'lift-flap': 'play-lift-flap', 'knock-stack': 'play-knock-stack', 'peek-corner': 'play-peek-corner', 'roll-ball': 'play-roll-ball', 'song-pause': 'play-song-pause', 'spoon-bowl': 'play-spoon-bowl', 'feed-teddy': 'play-feed-teddy', 'open-close': 'play-open-close', 'body-song': 'play-body-song', 'follow-point': 'play-follow-point', 'stir-bowl': 'play-stir-bowl' };
  const photo = id => PHOTO[id] ? `<img class="dev-idea-photo" src="assets/dev/${PHOTO[id]}.jpg?v=2" alt="">` : '';
  const tile = (a, ref) => `<button class="dev-idea" onclick="openPage('chg:Development:d:idea:${ref}:${a.id}')"><span class="dev-idea-art">${photo(a.id) || devPlayArt(a.id)}</span><b>${F(B(a.title))}</b></button>`;

  // Try today, on the summary: two of the stage's ideas, a different pair each day, and the rest one tap away.
  window.devTodayCard = ref => {
    const list = stageIdeas(ref), d = Math.floor((typeof NOW !== 'undefined' ? NOW : new Date()) / 864e5), i = list.length ? d % list.length : 0;
    const two = list.length > 2 ? [list[i], list[(i + 1) % list.length]] : list;
    return `<section class="hub-card dev-awake"><span class="hub-card-head"><b>${F((typeof isCurrent !== 'function' || isCurrent()) && devRef(developmentMonth(actualMonth())) !== ref ? 'Ideas for this age' : 'Try today')}</b></span><div class="dev-ideas">${two.map(a => tile(a, ref)).join('')}</div>`
      // From 6 months: a few baby signs, so Maya can say what she wants before she has the words. One of the things to try, inside the same card.
      + `<button class="hub-link dev-more-link" onclick="openPage('chg:Development:d:more:${ref}')">${F('More ways to play')} ›</button></section>`;
  };
  // How long Maya is usually awake at a time, by the age the guides follow (adjusted age for babies born early). Same ranges as Sleep.
  // Awake time comes from Sleep, so the two tabs always give the same number: Sleep's stage for this baby
  // (three naps or two) when there is one, and the age otherwise.
  const SLEEP_WAKE = ['45–60 minutes', '1–1½ hours', '2–2½ hours', '2½–4 hours'];
  const WAKE = m => { try { if ((typeof isCurrent !== 'function' || isCurrent()) && typeof chgStageIndex === 'function') { const i = chgStageIndex('Sleep'); if (SLEEP_WAKE[i]) return SLEEP_WAKE[i]; } } catch (e) {} return m < 2 ? '45–60 minutes' : m < 4 ? '1–1½ hours' : m < 7 ? '2–2½ hours' : '2½–4 hours'; };
  // On Movement, the idea that answers the big question of the age.
  const MOVE = {
    4: { id: 'tummy-picture', title: 'A picture at floor level', why: 'Turning to look is how rolling starts.', steps: ['During tummy time, prop a bold picture where Maya can see it.', 'Lie down facing {o} and talk about it.', 'Move it a little to one side so {s} turns to look.'] },
    6: { id: 'supported-reach', title: 'A toy beside your knee', why: 'Reaching while sitting builds the balance {s} needs to sit on {p} own.', steps: ['Sit Maya on the floor, supported around {p} chest as needed.', 'Hold a toy close beside your knee.', 'Let {o} lean and reach for it.'] },
    9: { id: 'toy-reach', hero: 9, title: 'A toy just out of reach', why: 'A reason to move is all most babies need.', steps: ['Put a favorite toy on the floor, a little out of Maya’s reach.', 'Cheer {o} on as {s} scoots, rolls or crawls toward it.', 'If {s} gets frustrated, move it a bit closer.'] },
    12: { id: 'cruise-toy', hero: 12, title: 'Cruise to a toy', why: 'Stepping along furniture comes before first steps.', steps: ['Put a toy at the far end of a sturdy sofa or low table.', 'Let Maya hold on and step sideways to reach it.', 'Clear other toys off the floor so {s} doesn’t trip.'] }
  };
  const moveArt = mv => mv.hero ? (window.devHeroArt ? devHeroArt(mv.hero) : '') : devPlayArt(mv.id);
  // Nov 14: a play card's second line says what the game builds, the same line its page opens with.
  window.devIdeaExplain = id => { const a = find(id); return a ? (ctxFor(a).explain || a.why || '') : ''; };
  window.devMoveIdea = ref => MOVE[ref] ? Object.assign({}, MOVE[ref], { art: moveArt(MOVE[ref]) }) : null;

  // A skill's photo or video, opened on the page.
  // Nov 18: Ahead's own photos, in one style, for milestones a still photo shows well. Motion and sound milestones keep the CDC video.
  const OWN_PHOTO = { 'pushes-onto-elbows-during-tummy-time': 'm4-elbows', 'pushes-up-with-straight-arms-on-tummy': 'm6-straight-arms', 'reaches-to-grab-a-toy': 'm6-reaches', 'leans-on-hands-when-sitting': 'm6-leans-on-hands', 'knows-familiar-people': 'm6-familiar-people', 'closes-lips-to-show-they-don-t-want-more-food': 'm6-closes-lips', 'likes-looking-at-self-in-a-mirror': 'm6-mirror', 'puts-things-in-mouth-to-explore': 'm6-mouthing' };
  // Where each photo sits in its square frame (vertical %), so faces and the skill both stay in view.
  const OWN_POS = { 'm6-reaches': 0, 'm6-closes-lips': 30, 'm6-leans-on-hands': 40, 'm6-familiar-people': 0, 'm4-elbows': 55, 'm6-straight-arms': 50 };
  window.devSeeIt = function (btn, key) {
    const box = btn.closest('.dev-skill').querySelector('.dev-media');
    if (!box) return;
    const open = !box.hidden;
    if (!open && !box.innerHTML) {
      const m = (typeof DEV_EXAMPLE_LINKS !== 'undefined' ? DEV_EXAMPLE_LINKS : {})[key];
      if (OWN_PHOTO[key]) box.innerHTML = `<figure class="dev-photo is-own"><img src="assets/dev/${OWN_PHOTO[key]}.jpg?v=2" alt=""${btn.dataset.title || ''}" loading="lazy"></figure>`;
      else if (m && m.type === 'video') { const id = (m.href.match(/[?&]v=([\w-]{11})/) || [])[1]; box.innerHTML = id ? hubEmbed(id, btn.dataset.title || 'What it looks like', 'CDC') : ''; }
      else if (m) box.innerHTML = `<figure class="dev-photo"><img src="${m.href}" alt="${btn.dataset.title || ''}" loading="lazy"><figcaption>Photo · CDC</figcaption></figure>`;
    }
    if (!open && box.dataset.desc && !box.querySelector('.dev-desc')) box.insertAdjacentHTML('afterbegin', `<p class="dev-desc">${box.dataset.desc}</p>`);
    box.querySelectorAll('.hub-embed figcaption small').forEach(x => { x.textContent = 'Video · CDC'; });
    box.hidden = open;
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? 'See what it looks like' : 'Hide';
  };
  // Skills that are obvious from words alone don't get a photo or video; the one-line description is enough.
  const NO_MEDIA = new Set([]);   // Nov 18: every milestone shows something (sound milestones play the CDC clip, with audio)
  window.devSeeButton = (key, title) => (typeof DEV_EXAMPLE_LINKS !== 'undefined' && DEV_EXAMPLE_LINKS[key] && !NO_MEDIA.has(key)) ? `<button class="dev-see" aria-expanded="false" data-title="${title}" onclick="devSeeIt(this,'${key}')">See what it looks like</button>` : '';

  // An idea from a later stage than the baby's says so in its kicker, so it doesn't read as one for today.
  const ahead = ref => (typeof isCurrent !== 'function' || isCurrent()) && ref > devRef(developmentMonth(actualMonth())) ? ` · by ${ref === 12 ? '1 year' : ref + ' months'}` : '';
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
    // Nov 19 preview: toys that fit this age, what she's outgrown, and what isn't needed (AAP 2018 toys report;
    // Sosa 2016 on electronic toys; CPSC on crib toys at 5 months). Things Safety owns point to Safety.
    const TOYS = { 6: {
      now: [['toy-rattle', 'A ball rattle'], ['toy-bowl', 'A pot and a spoon'], ['toy-books', 'Board books']],
      away: [['eye', 'High-contrast cards', '{S} {see|sees} colors well now'], ['crib', 'The crib mobile', 'Take it down now, before {s} can grab it']] } }[ref];
    const toys = TOYS ? `<section class="dev-toys"><h2 class="hub-h2">${F('Toys that fit now')}</h2><p class="dev-toys-lead">${F('Simple things you may already have.')}</p>`
      + `<div class="dev-toy-grid">${TOYS.now.map(([img, t]) => `<div class="dev-toy"><img src="assets/dev/${img}.jpg?v=1" alt=""><b>${F(t)}</b></div>`).join('')}</div>`
      + `<div class="dev-putaway"><h3>${F('Ready to put away')}</h3>${TOYS.away.map(([ic, t, sub]) => `<div class="dev-putaway-row"><span class="dev-putaway-ic" aria-hidden="true">${H().art(ic, 'Development')}</span><span><b>${F(t)}</b><small>${F(sub)}</small></span></div>`).join('')}</div></section>` : '';
    return frame('Ideas to try together', `Play ideas · by ${ref === 12 ? '1 year' : ref + ' months'}`, lead, `<div class="dev-ideas is-grid">${pics.map(a => tile(a, ref)).join('')}</div>${more}${toys}`);
  }
  function movePage(ref) {
    const mv = window.devMoveIdea(ref), h = H();
    if (!mv) return ideasPage(ref);
    return frame(mv.title, 'Try this together' + ahead(ref), mv.why, `<figure class="dev-idea-hero">${mv.art}</figure>` + h.steps(mv.steps) + h.note('Stay close, and stop when Maya looks away or fusses. That’s {p} way of saying “enough for now.”'));
  }
  function ideaPage(ref, id) {
    const a = find(id), h = H();
    if (!a) return ideasPage(ref);
    const ctx = ctxFor(a), steps = (typeof playInstructionSteps === 'function' ? playInstructionSteps(a.how) : [a.how]).map(s => B(s));
    return frame(B(a.title), 'Ideas to try together' + ahead(ref), B(ctx.explain || a.why || ''),
      (photo(a.id) ? `<figure class="dev-idea-hero is-photo">${photo(a.id)}</figure>` : devPlayArt(a.id) ? `<figure class="dev-idea-hero">${devPlayArt(a.id)}</figure>` : '') + h.steps(steps) + (ctx.notice ? h.tip('What to notice', B(ctx.notice)) : '')
      + h.note('Stay close, and stop when Maya looks away or fusses. That’s {p} way of saying “enough for now.”'));
  }
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b, c] = p.split(':');
    if ((cat === 'Development' || cat === 'Daily rhythm') && screen === 'd' && a === 'more') return ideasPage(devRef(Number(b)));
    // All milestones for an age, the four areas on one page (Nov 11). Each area opens its own page to mark what Maya does.
    if (cat === 'Development' && screen === 'd' && a === 'all') { const ref = DEV_STAGES[b] ? Number(b) : devRef(Number(b)), seen = window.devSkillSeen || (() => false), hb = window.hubBabyify || (x => x);
      const NAMES = { Social: 'Social and feelings', Talking: 'Talking and listening', Thinking: 'Thinking and learning', Movement: 'Movement' };
      const body = Object.keys(DEV_DOMAINS).map(d => { const L = DEVELOPMENT_DOMAINS[ref][d] || [], c = window.devTileColors ? devTileColors(d) : ['#f1ecfa', '#5b4f8a'];
        return `<h2 class="hub-h2">${F(NAMES[d] || d)}</h2><div class="hub-card" style="padding:4px 16px">${L.map(l => `<p style="display:flex;gap:10px;align-items:center;margin:0;padding:10px 0;border-bottom:1px solid var(--line,#f0ebe8);font-size:14.5px"><span style="width:20px;height:20px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:12px;${seen(l) ? `background:${c[1]};color:#fff` : `border:1.5px solid ${c[1]}`}">${seen(l) ? '✓' : ''}</span>${hb(F(l))}</p>`).join('')}<button class="hub-link" style="display:block;padding:10px 0" onclick="openPage('development-domain:${ref}:${d}')">${F('Mark what Maya does')} ›</button></div>`; }).join('');
      return frame('All milestones', `By ${ref === 12 ? '12 months' : ref + ' months'}`, 'Notice what Maya is doing. There’s no score to complete, and every baby gets there at their own pace.', body); }
    if (cat === 'Development' && screen === 'd' && a === 'move') return movePage(DEV_STAGES[b] ? Number(b) : devRef(Number(b)));
    if (cat === 'Development' && screen === 'd' && a === 'idea') return ideaPage(DEV_STAGES[b] ? Number(b) : devRef(Number(b)), c);
    return baseRoute(p);
  };
})();
