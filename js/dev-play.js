/* Ahead · Development & play.
   The category answers three questions a parent has at every age:
     1. What might Maya be doing now?        → hero, "Through Maya's eyes", four area tiles
     2. How can I help?                       → each area page: the skills, what they look like, one idea to try
     3. What do we do in awake time?          → "Awake time with Maya" picture steps and illustrated ideas
   Skills are noticed ("Seen it"), never scored. Photos and videos of a skill play on the page; nothing sends
   the parent away to another site. Loaded after hub-categories.js and hub-pages.js, and replaces their
   Development screens. Sources: CDC milestone checklists (2022), AAP (HealthyChildren.org "Back to sleep,
   tummy to play" and "How active is your baby?"), WHO guidelines for children under 5 (2019). */
(function () {
  const H = () => window.__hub;
  const F = s => H().F(s);
  const B = s => (window.hubBabyify || (x => x))(s);
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const ageWord = ref => ref === 12 ? '1 year' : ref + ' months';
  const checkupWord = ref => ref === 12 ? '1-year' : ref + '-month';
  const devNow = () => devRef(developmentMonth(live() ? actualMonth() : month));
  const DOMAIN_TITLES = { Social: 'Social', Talking: 'Communication', Thinking: 'Thinking', Movement: 'Movement' };
  const DOMAIN_ICONS = { Social: 'smile', Talking: 'chat', Thinking: 'idea', Movement: 'sit' };

  /* ---------- What Maya might be doing: one plain sentence per stage, and per area ----------
     "own" speaks about this baby; "any" is for browsing a stage that isn't the baby's. */
  const COPY = {
    2: {
      own: ['Maya is starting to smile back at you', 'Maya watches your face, calms at your voice and, around 6–8 weeks, smiles back.'],
      any: ['Babies start smiling back', 'Babies watch faces, calm at a familiar voice and, around 6–8 weeks, smile back.'],
      areas: {
        Social: ['Maya calms with you and smiles back.', 'Babies calm with you and smile back.'],
        Talking: ['Maya makes little sounds besides crying.', 'Babies make little sounds besides crying.'],
        Thinking: ['Maya’s eyes follow you around the room.', 'Babies’ eyes follow you around the room.'],
        Movement: ['Maya lifts {p} head during tummy time.', 'Babies lift their head during tummy time.']
      }
    },
    4: {
      own: ['Maya is starting to chat back', 'Maya smiles to get your attention, coos when you talk and swipes at toys. Play is starting to feel like a conversation.'],
      any: ['Play starts to feel like a conversation', 'Babies smile to get your attention, coo when you talk and swipe at toys.'],
      areas: {
        Social: ['Maya smiles first and chuckles in play.', 'Babies smile first and chuckle in play.'],
        Talking: ['Maya coos and answers when you talk.', 'Babies coo and answer when you talk.'],
        Thinking: ['Maya studies {p} hands and knows a feed is coming.', 'Babies study their hands and know a feed is coming.'],
        Movement: ['Maya holds {p} head steady and swipes at toys.', 'Babies hold their head steady and swipe at toys.']
      }
    },
    6: {
      own: ['Maya is reaching for everything', 'Maya laughs out loud, takes turns making sounds with you and grabs whatever’s in reach. Rolling often shows up now too.'],
      any: ['Babies reach for everything', 'Babies laugh out loud, take turns making sounds and grab whatever’s in reach. Rolling often shows up too.'],
      areas: {
        Social: ['Maya knows familiar faces and laughs out loud.', 'Babies know familiar faces and laugh out loud.'],
        Talking: ['Maya squeals, blows raspberries and takes turns.', 'Babies squeal, blow raspberries and take turns.'],
        Thinking: ['Maya grabs toys and explores them with {p} mouth.', 'Babies grab toys and explore them with their mouth.'],
        Movement: ['Maya rolls from tummy to back and props on {p} hands.', 'Babies roll from tummy to back and prop on their hands.']
      }
    },
    9: {
      own: ['Maya is sitting up and finding things', 'Sitting up frees both hands for banging and passing toys. Expect babbling, peekaboo giggles and some tears when you leave.'],
      any: ['Babies sit up and look for things', 'Sitting up frees both hands for banging and passing toys. Expect babbling, peekaboo giggles and some tears when you leave.'],
      areas: {
        Social: ['Maya turns to {p} name and loves peekaboo.', 'Babies turn to their name and love peekaboo.'],
        Talking: ['Maya babbles and lifts {p} arms to be held.', 'Babies babble and lift their arms to be held.'],
        Thinking: ['Maya looks for dropped toys and bangs two together.', 'Babies look for dropped toys and bang two together.'],
        Movement: ['Maya sits on {p} own and passes toys hand to hand.', 'Babies sit on their own and pass toys hand to hand.']
      }
    },
    12: {
      own: ['Maya is waving and pulling up', 'Maya waves bye-bye, plays pat-a-cake with you and pulls up to stand. Many babies step along the furniture now.'],
      any: ['Babies wave and pull up to stand', 'Babies wave bye-bye, play pat-a-cake and pull up to stand. Many step along the furniture.'],
      areas: {
        Social: ['Maya joins in games like pat-a-cake.', 'Babies join in games like pat-a-cake.'],
        Talking: ['Maya waves and has a name for you.', 'Babies wave and have a name for you.'],
        Thinking: ['Maya finds hidden things and fills containers.', 'Babies find hidden things and fill containers.'],
        Movement: ['Maya pulls up and steps along the furniture.', 'Babies pull up and step along the furniture.']
      }
    }
  };
  window.DEV_COPY = COPY;

  /* ---------- Awake time: what a day of play looks like at this age (AAP, WHO) ---------- */
  const AWAKE = {
    2: [['mat', 'Tummy time', 'A few minutes, 2–3 times a day, building to 15–30 minutes by 7 weeks'], ['chat', 'Face to face', 'Talk and sing, then pause for a reply'], ['stroller', 'Out of the seat', 'No more than an hour at a time in a seat or swing']],
    4: [['mat', 'Tummy time', 'About 30 minutes a day in all, in short turns'], ['book', 'Books and mirrors', 'Board books, a baby mirror and safe things to hold'], ['stroller', 'Out of the seat', 'No more than an hour at a time in a seat or swing']],
    6: [['toy', 'Floor time', 'Toys close by to reach for and grab'], ['book', 'Read and name', 'Point to pictures and name what you see'], ['stroller', 'Out of the seat', 'No more than an hour at a time in a seat or stroller']],
    9: [['crawl', 'Room to move', 'Floor space to sit, roll and crawl'], ['peek', 'Hide and find', 'Peekaboo and hidden toys are perfect now'], ['chat', 'Talk it through', 'Describe what you’re doing as you go']],
    12: [['stand', 'Cruising space', 'Sturdy furniture to pull up on and step along'], ['shield', 'Skip the walker', 'Walkers lead to falls. A sturdy push toy is safer'], ['book', 'Books every day', 'Let Maya turn the pages and point']]
  };
  // Tummy time at 2 months: past 7 weeks, the target is the amount, not the build-up.
  const awakeFor = (ref, own) => {
    if (ref === 2 && own && live() && (NOW - parse(profile.dob)) / 864e5 >= 49) return [['mat', 'Tummy time', '15–30 minutes a day in all, in short turns'], ...AWAKE[2].slice(1)];
    return AWAKE[ref];
  };

  /* ---------- Play text fixes: "them" that means toys, and plainer "why" lines ---------- */
  const FIX = {
    'choose-two': { title: 'Which one does Maya want?' },
    'change-chat': { explain: 'Hearing you talk through the same routine every day is how words start to make sense.' },
    'tummy-reflection': { explain: 'A face at floor level gives Maya something worth lifting {p} head for.' },
    'mirror-company': { extend: 'Make one expression in the mirror, then copy whatever face comes back.' },
    'feet-discovery': { how: 'During time on {p} back on a firm floor mat, touch and name baby’s feet. Pause to let baby look, kick or reach for those toes.' },
    'roll-interest': { why: 'Gives baby a reason to turn.' },
    'two-hands': { explain: 'Turning one toy over gets both hands working together.' },
    'drop-return': { adapt: 'Let go of your own toy beside baby if {s} wants to hold on to the toy.' },
    'texture-basket': { notice: 'Baby may go back to one object, swap between two or explore the basket itself.' },
    'bang-two': { notice: 'Baby may tap the toys together, tap yours or explore each one on its own.' },
    'spoon-bowl': { how: 'Offer a large baby-safe spoon and a sturdy lightweight bowl during floor play. Let baby tap, turn and explore both.' },
    'family-photos': { why: 'Connects a familiar person with a name and a picture.' },
    'hidden-toy': { explain: 'Watching a toy disappear and finding it again is the whole fun of it.' },
    'empty-basket': { how: 'Put three large baby-safe toys in a shallow open basket. Let baby take the toys out, tip the basket or choose one to keep.' },
    'hello-wave': { explain: 'Waving the same way every time helps baby learn what a wave means.' },
    'knock-stack': { how: 'Stack two large lightweight baby blocks on the floor. Let baby touch the blocks or knock the tower over, then rebuild if {s} wants.', notice: 'Baby might brush the blocks, push the tower or watch it fall.' },
    'give-back': { adapt: 'Show it with a second toy if baby wants to hold on to the first one.' },
    'put-in': { explain: 'A container to aim for makes letting go of a toy part of the game.' },
    'teddy-hug': { how: 'Hug a baby-safe soft toy, then offer it to baby. Watch whether {s} {cuddle|cuddles}, {touch|touches} or {explore|explores} it in {p} own way.' },
    'stack-pair': { adapt: 'Hold the bottom block steady. Knocking the tower down is still play.' },
    'feed-teddy': { notice: 'Baby may bring the spoon near teddy or explore the spoon on {p} own.' }
  };
  const fixed = a => a && FIX[a.id] ? Object.assign({}, a, FIX[a.id]) : a;
  const ctxFor = a => Object.assign({}, (typeof PLAY_CONTEXT !== 'undefined' && PLAY_CONTEXT[a.id]) || {}, FIX[a.id] || {});

  /* ---------- One idea per area, from the same stage's ideas ---------- */
  const AREA_IDEA = {
    2: { Social: 'smile-pause', Talking: 'sound-answer', Thinking: 'face-follow', Movement: 'tummy-reflection' },
    4: { Social: 'mirror-company', Talking: 'sock-puppet', Thinking: 'fabric-feel', Movement: 'easy-grip' },
    6: { Social: 'mirror-faces', Talking: 'sound-side', Thinking: 'basket-out', Movement: 'supported-reach' },
    9: { Social: 'peek-corner', Talking: 'hello-wave', Thinking: 'hidden-toy', Movement: 'empty-basket' },
    12: { Social: 'gesture-song', Talking: 'action-book', Thinking: 'hide-helper', Movement: 'two-baskets' }
  };
  const ideasFor = lo => { const m = playStageModel(lo); return { phase: m.phase, primary: (m.primary || []).map(fixed), all: [...(m.primary || []), ...(m.more || [])].map(fixed) }; };
  const findIdea = (lo, id) => fixed(ideasFor(lo).all.find(a => a.id === id));
  // Illustration for an idea, recolored into Development's lilac.
  const ideaArt = (a, lo) => (typeof playActivityArt === 'function' ? playActivityArt(a, ideasFor(lo).phase) : '')
    .replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"').replace(/#ecf6fa/gi, '#f3f1ff').replace(/#cfe9f4/gi, '#dfdcfb');
  const ideaTile = (a, lo) => `<button class="dev-idea" onclick="openPage('chg:Development:d:idea:${lo}:${a.id}')"><span class="dev-idea-art">${ideaArt(a, lo)}</span><b>${F(B(a.title))}</b></button>`;
  // A different pair of ideas each day, so the summary feels fresh without growing.
  const todaysIdeas = list => { if (list.length <= 2) return list; const d = Math.floor((typeof NOW !== 'undefined' ? NOW : new Date()) / 864e5), i = d % list.length; return [list[i], list[(i + 1) % list.length]]; };

  /* ---------- Summary ---------- */
  window.developmentJourneyOverview = developmentJourneyOverview = function (selected = null) {
    const now = devNow(), ref = DEV_STAGES[selected] ? Number(selected) : now, age = ageWord(ref), h = H();
    const other = live() && ref !== now, c = COPY[ref], own = !other;
    const ageNote = live() && profile.early && profile.due ? (() => { const adj = developmentMonth(actualMonth()) !== actualMonth(); return `<p class="hub-agebasis">${F(adj ? `Following Maya’s adjusted age (${monthLabel(developmentMonth(actualMonth()))}). Pediatricians go by adjusted age for skills until about age 2.` : `Following Maya’s birthday age (${monthLabel(actualMonth())}).`)} <button onclick="hubSetAgeMode('dev','${adj ? 'birthday' : 'adjusted'}')">${adj ? 'Use birthday age' : 'Use adjusted age'}</button></p>`; })() : '';
    const devKeys = Object.keys(DEV_STAGES).map(Number), nowI = devKeys.indexOf(now);
    const pills = h.pills('Development by age', devKeys.map((k, i) => ({ label: STAGE_TABLE.Development.stages[i].label, age: STAGE_TABLE.Development.stages[i].age, on: k === ref, now: live() && k === now, onclick: `openPage('development-stage:${k}')`, change: stageCanChange('Development', i, nowI) ? `hubChangeStage('Development',${i})` : '' })), 'Development');
    const [title, lead] = own ? c.own : c.any;
    let b = h.hero({ eyebrow: `What to look for by ${age}`, title, lead });
    // One wonder per age, as a glance card.
    const EYES = { 2: ['8–12 in', 'smile', 'That’s how far Maya sees clearly, about the distance to your face during a feed.', 'That’s how far babies see clearly by 2 months, about the distance to a parent’s face during a feed.'], 4: ['Colors', 'colors', 'Maya is getting better at telling colors apart, and loves faces.', 'By 4 months, babies get better at telling colors apart, and love faces.'], 6: ['3D', 'cube', 'Maya’s eyes now work together to judge depth, which helps {o} reach.', 'By 6 months, babies’ eyes work together to judge depth, which helps them reach.'], 9: ['Out of sight', 'hidden', 'Maya is learning that a toy out of sight still exists. That’s why peekaboo is so exciting.', 'By 9 months, babies are learning that a toy out of sight still exists. That’s why peekaboo is so exciting.'], 12: ['Distance', 'toss', 'Maya can judge distance well enough to toss a toy with aim.', 'By 12 months, babies can judge distance well enough to toss a toy with aim.'] }[ref];
    b += `<section class="hub-card hub-eyes"><span class="hub-card-head"><b>${F(own ? 'Through Maya’s eyes' : `Through a baby’s eyes, by ${age}`)}</b></span><div class="hub-eyes-row"><span class="hub-eyes-ic">${h.art(EYES[1], 'Development')}</span><span class="hub-eyes-big">${F(EYES[0])}</span><span class="hub-eyes-cap">${F(own ? EYES[2] : EYES[3])}</span></div></section>`;
    // Q1: four areas, each with a sentence of what you might see.
    const tiles = Object.keys(DEV_DOMAINS).map(d => {
      const n = (DEVELOPMENT_DOMAINS[ref][d] || []).length;
      const moving = own && live() && d === 'Movement' && (answers.pullUp === 'Yes' || answers.crawl === 'Yes');
      const line = moving ? (answers.pullUp === 'Yes' ? 'Maya is already pulling up. Stepping along the furniture comes next.' : 'Maya is already crawling. Pulling up comes next.') : c.areas[d][own ? 0 : 1];
      return `<button class="hub-domain-tile" onclick="openPage('development-domain:${ref}:${d}')">${h.art(DOMAIN_ICONS[d], 'Development')}<b>${DOMAIN_TITLES[d]}</b><small>${F(line)}</small><span>${F(`${n} skill${n === 1 ? '' : 's'} to look for`)} ›</span></button>`;
    }).join('');
    b += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F(own ? 'What Maya might be doing' : 'What babies might be doing')}</b></span><div class="hub-domain-tiles">${tiles}</div></section>`;
    // Q3: awake time, then two illustrated ideas and the rest one tap away.
    const lo = own && live() ? playPhase(developmentMonth(actualMonth())).lo : ref, ideas = ideasFor(lo).primary;
    b += `<section class="hub-card dev-awake"><span class="hub-card-head"><b>${F(own ? 'Awake time with Maya' : `Awake time at ${age}`)}</b></span>${hubIconSteps(awakeFor(ref, own), 'Development', 'What awake time looks like at this age', false)}<p class="dev-awake-note">${F((own && live() && actualMonth() < 2 ? 'Right now Maya is awake for about 45–60 minutes at a time, feeds included. ' : '') + 'Screens aren’t recommended yet. Video chats with family are fine.')}</p><div class="dev-awake-ideas"><span class="dev-sub">${F('Ideas to try together')}</span><div class="dev-ideas is-pair">${todaysIdeas(ideas).map(a => ideaTile(a, lo)).join('')}</div><button class="hub-link" onclick="openPage('chg:Development:d:more:${lo}')">${F(`See all ${ideas.length} ideas`)} ›</button></div></section>`;
    if (ref >= 6) b += h.list('', [h.row({ icon: 'signs', cat: 'Development', title: 'Try a few baby signs', sub: 'More, eat, milk and all done', onclick: `openPage('chg:Development:d:signs')` })]);
    b += h.versus('Not yet, or time to ask?', ['Not yet', notYetLine(ref, now)], ['Talk to your pediatrician', 'Call if Maya loses a skill {s} had, or if something worries you. You don’t need to wait for the checkup.']);
    const nx = devKeys[devKeys.indexOf(ref) + 1];
    if (nx && live() && ref === now && nx - developmentMonth(actualMonth()) <= 1) b += h.next(`Coming up by ${ageWord(nx)}`, COPY[nx].any[0], `openPage('development-stage:${nx}')`);
    const top = (Q[ref] || [])[0];
    b += top ? `<section class="hub-card dev-faq"><span class="hub-card-head"><b>${F(other ? 'Common questions at this stage' : 'What other parents ask')}</b></span><p class="dev-faq-q">${F(top[0])}</p><p class="dev-faq-a">${F(top[1])}</p><button class="hub-link" onclick="openPage('chg:Development:d:faq:${ref}')">${F('More questions')} ›</button></section>` : h.more('What other parents ask', `openPage('chg:Development:d:faq:${ref}')`);
    return `<div class="quiet-category hub-page" data-overview="Development" style="${yearTheme('Development')}" data-development-guide="${ref}">${monthlyPageHeader('Development')}${pills}${ageNote}${b}<p class="hub-foot">${F('Ages are typical. Every baby moves at their own pace.')}</p></div>`;
  };
  // One answer to "is Maya behind?", used on the summary and in common questions.
  function notYetLine(ref, now) {
    const dm = live() ? developmentMonth(actualMonth()) : ref;
    if (!live() || dm < ref) return live() ? `Maya has until ${ageWord(ref)} for these, and some may show up sooner. Mention anything you’re unsure about at {p} next checkup.` : `These can show up any time before ${ageWord(ref)}.`;
    if (ref < now) return `Most babies do these by ${ageWord(ref)}. If Maya isn’t doing some of them yet, call your pediatrician rather than waiting for the next checkup.`;
    return `Most babies do these by ${ageWord(ref)}. If Maya isn’t doing some of them yet, bring it up at {p} ${checkupWord(ref)} checkup. It’s one of the most common questions.`;
  }

  /* ---------- Area page: the skills, what each looks like, and one idea ---------- */
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
  window.developmentDomainPage = developmentDomainPage = function (ref, domain) {
    const meta = DEV_DOMAINS[domain], labels = DEVELOPMENT_DOMAINS[ref]?.[domain];
    if (!meta || !labels) return developmentJourneyOverview(ref);
    const h = H(), age = ageWord(ref), own = !(live() && ref !== devNow());
    const media = typeof DEV_EXAMPLE_LINKS !== 'undefined' ? DEV_EXAMPLE_LINKS : {};
    const rows = labels.map(l => {
      const key = journeySkillKey(l), rec = journeyData().records.find(r => r.type === 'milestone' && r.skillKey === key) || (skillSeen(l) ? { reported: true } : null);
      const t = F(B(clearMilestone(l))), see = media[key] ? `<button class="dev-see" aria-expanded="false" data-title="${t}" onclick="devSeeIt(this,'${key}')">See what it looks like</button>` : '';
      return `<div class="hub-tick is-habit dev-skill"><span class="hub-tick-art">${h.art(DOMAIN_ICONS[domain] || 'smile', 'Development')}</span><span class="hub-row-copy"><b>${t}</b><small>${F(B(EXAMPLE_FIX[l] || DEV_EXAMPLES[l] || ''))}</small>${see}</span>${rec ? `<span class="hub-chip is-done">${F('Seen')} ✓</span>` : `<button class="hub-seen" onclick="hubSeen('${key}')">${F('Seen it')}</button>`}${see ? '<div class="dev-media" hidden></div>' : ''}</div>`;
    }).join('');
    const a = findIdea(ref, AREA_IDEA[ref][domain]);
    const tryCard = a ? `<section class="hub-card dev-try"><span class="hub-card-head"><b>${F('Try this together')}</b></span><button class="dev-try-row" onclick="openPage('chg:Development:d:idea:${ref}:${a.id}')"><span class="dev-idea-art">${ideaArt(a, ref)}</span><span class="hub-row-copy"><b>${F(B(a.title))}</b><small>${F(B(ctxFor(a).explain || a.why || playLineFull(a)))}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></section>` : '';
    const lead = COPY[ref].areas[domain][own ? 0 : 1];
    return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head"><span class="hub-big">${h.art(DOMAIN_ICONS[domain] || 'smile', 'Development')}</span><p class="hub-context">${esc(`${meta.title} · by ${age}`)}</p><h1>${F(own ? 'What Maya might be doing' : `What babies do by ${age}`)}</h1><p class="hub-lead">${F(lead)}</p></div><div class="hub-ticks">${rows}</div>${h.note(`Most babies do ${labels.length === 1 ? 'this' : 'these'} by ${age}. Tap “Seen it” to save the moment to Memories.`)}${tryCard}</div>`;
  };
  const EXAMPLE_FIX = { 'Steps while holding furniture': 'Holding on to the sofa or a low table, Maya takes a few steps sideways. Walking on {p} own usually comes between 12 and 18 months.' };
  const playLineFull = a => { const s = String(a.how || ''); const first = (s.match(/^.*?[.!?](\s|$)/) || [s])[0].trim(); return first; };

  /* ---------- Ideas: a picture grid, and a short page for each ---------- */
  function ideasPage(lo) {
    const { phase, primary } = ideasFor(lo);
    return devDetail('Ideas to try together', phase.title, 'A few minutes of any of these is plenty. Pick one that suits the moment.',
      `<div class="dev-ideas is-grid">${primary.map(a => ideaTile(a, lo)).join('')}</div>`);
  }
  function ideaPage(lo, id) {
    const a = findIdea(lo, id), h = H();
    if (!a) return ideasPage(lo);
    const ctx = ctxFor(a);
    const steps = (typeof playInstructionSteps === 'function' ? playInstructionSteps(a.how) : [a.how]).map(s => B(s));
    return devDetail(B(a.title), 'Ideas to try together', B(ctx.explain || a.why || ''),
      `<figure class="dev-idea-hero">${ideaArt(a, lo)}</figure>`
      + (ctx.needs && !sameAsStep(ctx.needs, steps[0]) ? h.tip('You’ll need', B(ctx.needs)) : '')
      + h.steps(steps)
      + (ctx.notice ? h.tip('What to notice', B(ctx.notice)) : '')
      + (a.adapt ? h.tip('Make it easier', B(a.adapt)) : '')
      + (ctx.extend ? h.tip('Ready for more', B(ctx.extend)) : '')
      + h.note('Stay close, and stop when Maya looks away or fusses. That’s {p} way of saying “enough for now.”'), true);
  }
  const words = t => String(t || '').toLowerCase().replace(/[^a-z\s-]/g, ' ').split(/\s+/).filter(w => w.length > 3);
  const sameAsStep = (needs, step) => { const n = words(needs), st = new Set(words(step)); return n.length && n.filter(w => st.has(w)).length / n.length >= 0.6; };
  function devDetail(title, context, lead, inner, noIcon) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="Development" style="${yearTheme('Development')}">${detailPageTop('Development')}<div class="hub-detail-head">${noIcon ? '' : `<span class="hub-big">${hubArt(hubPageIcon('Development', title), 'Development')}</span>`}<p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }

  /* ---------- Common questions, by stage ---------- */
  const Q = {
    2: [['Maya hates tummy time. Is that OK?', 'Lots of babies fuss at first. Try short turns of a minute or two, on your chest or with your face at {p} level, and build up from there.'],
        ['When will Maya smile at me?', 'Most babies smile back by about 6–8 weeks. Babies born early often smile a little later, going by their due date.']],
    4: [['Should Maya be rolling yet?', 'Not yet for most babies. Rolling usually shows up between 4 and 6 months, often tummy to back first. At the first try, stop swaddling.'],
        ['Do we need special toys?', 'No. Your face, a board book, a rattle and a baby mirror cover it. Babies learn the most from you.']],
    6: [['Does rolling mean both directions?', 'Not yet. Tummy to back and back to tummy are separate skills, and either can come first.'],
        ['When will Maya sit on {p} own?', 'Most babies sit without support by about 9 months. Until then, sitting propped on {p} hands is right on track.']],
    9: [['Why does Maya cry when I leave?', 'It’s separation anxiety, and it’s a sign of a strong bond. Say a short, warm goodbye instead of slipping away, and greet {o} when you’re back.'],
        ['What if Maya skips crawling?', 'Some babies scoot, roll or go straight to pulling up. What matters is that {s’s} finding ways to move. If {s} isn’t moving around at all, mention it at the 9-month checkup.'],
        ['What’s the questionnaire at the 9-month checkup?', 'Pediatricians recommend a development check at 9 months. You’ll answer a short set of questions about the skills on these pages, so it helps to notice them.']],
    12: [['Should Maya be walking by 1?', 'Not necessarily. Most babies pull up and step along furniture by 1, and many take first steps between 12 and 15 months. Walking on their own usually comes by 18 months.'],
         ['How can I help Maya walk?', 'Give {o} sturdy furniture to step along and plenty of time barefoot on the floor. A push toy works well. Skip baby walkers. They lead to falls and don’t help babies walk sooner.'],
         ['How many words should Maya say?', 'By 1, most babies have a name for a parent, like “mama” or “dada,” and wave bye-bye. More words usually come after the first birthday.']]
  };
  function faqPage(ref) {
    const qa = (q, a) => `<details class="faq-toggle"><summary><span>${F(q)}</span><span class="faq-plus" aria-hidden="true">＋</span></summary><div class="faq-answer"><p>${F(a)}</p></div></details>`;
    const now = devNow(), all = [...(Q[ref] || []),
      ['When should I talk to our pediatrician?', notYetLine(ref, now) + ' Call any time Maya loses a skill {s} had.'],
      ['Do I need to tap “Seen it” on every skill?', 'No. It’s there for the moments you want to keep. A skill you haven’t tapped doesn’t mean Maya isn’t doing it.']];
    return devDetail(live() && ref !== now ? 'Common questions at this stage' : 'What other parents ask', `By ${ageWord(ref)}`, '', `<section class="common-questions hub-faq">${all.map(([q, a]) => qa(q, a)).join('')}</section>`);
  }

  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a, b, c] = p.split(':');
    if (cat === 'Development' && screen === 'd') {
      if (a === 'more') return ideasPage(Number(b));
      if (a === 'idea') return ideaPage(Number(b), c);
      if (a === 'faq') return faqPage(DEV_STAGES[b] ? Number(b) : devRef());
    }
    return baseRoute(p);
  };
})();
