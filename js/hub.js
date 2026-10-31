/* Ahead · summary screens with details one tap away.
   Each stage page answers the parent's one question for that stage:
     hero (where things stand, one button) → what the baby's eating now → at most 3 rows → must-know safety → coming up → questions.
   Detail screens each do one job: tick off signs, a checklist, choose an approach, how-to steps, amounts.
   Copy is written to sound like a person talking. "Maya" becomes the baby's name; {s} {o} {p} {r} {S} {is} {has} {does}
   become pronouns, and {lean|leans} picks the verb form that matches. */
(function () {
  const C = () => window.__chg;
  const name_ = () => (typeof name === 'function' ? name() : 'your baby');
  const P = () => (typeof babyPronouns === 'function' ? babyPronouns() : { s: 'they', o: 'them', p: 'their', r: 'themselves', is: 'are', has: 'have', does: 'do' });
  // Pronouns, verb agreement and the baby's name, then escaped for HTML.
  const F = str => {
    const pr = P(), they = pr.s === 'they';
    let out = String(str == null ? '' : str)
      .replace(/\{s’(s|ve|ll)\}/g, (_, k) => they ? 'they’' + ({ s: 're', ve: 've', ll: 'll' })[k] : pr.s + '’' + ({ s: 's', ve: 's', ll: 'll' })[k])
      .replace(/\{S’(s|ve|ll)\}/g, (_, k) => cap(they ? 'they’' + ({ s: 're', ve: 've', ll: 'll' })[k] : pr.s + '’' + ({ s: 's', ve: 's', ll: 'll' })[k]))
      .replace(/\{([A-Za-z’']+)\|([A-Za-z’']+)\}/g, (_, a, b) => they ? a : b)
      .replace(/\{(s|o|p|r|S|P|is|has|does)\}/g, (_, k) => k === 'S' ? cap(pr.s) : k === 'P' ? cap(pr.p) : pr[k]);
    return esc(out).replace(/Maya/g, esc(name_()));
  };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const art = (n, cat) => (typeof hubArt === 'function' ? hubArt(n, cat) : '');
  const L = () => C().local;
  const store = (k, v) => { L()[k] = v; C().save(); };
  const go = p => `openPage('${p}')`;

  /* ---------- building blocks ---------- */
  const chev = '<span class="hub-chev" aria-hidden="true">›</span>';
  const chip = (t, tone = '') => t ? `<span class="hub-chip ${tone}">${F(t)}</span>` : '';
  // What matters now, read top to bottom: numbered, each item complete on its own, with an optional link for more.
  // Items: { title, sub, link, onclick, chipText, chipTone }. Rows built for lists can pass straight in (link defaults to "More").
  function flow(items, cat = 'Sleep') {
    const it = items.filter(Boolean);
    return `<ul class="hub-card hub-flow">${it.map(o => `<li><div class="hub-flow-item"><span class="hub-dot">${art(o.icon || 'moon', cat)}</span><div><b>${F(o.title)}</b>${chip(o.chipText, o.chipTone)}${o.sub ? `<p>${F(o.sub)}</p>` : ''}${o.onclick ? `<button class="hub-link" onclick="${o.onclick}">${F(o.link || 'More')} ›</button>` : ''}</div></div></li>`).join('')}</ul>`;
  }
  function row({ icon, cat, title, sub, chipText, chipTone, onclick }) {
    // No onclick: a row that's complete on its own (an idea to try), with no page behind it.
    if (!onclick) return `<div class="hub-row is-static"><span class="hub-dot">${art(icon, cat)}</span><span class="hub-row-copy"><b>${F(title)}</b>${sub ? `<small>${F(sub)}</small>` : ''}${chip(chipText, chipTone)}</span></div>`;
    return `<button class="hub-row" onclick="${onclick}"><span class="hub-dot">${art(icon, cat)}</span><span class="hub-row-copy"><b>${F(title)}</b>${sub ? `<small>${F(sub)}</small>` : ''}${chip(chipText, chipTone)}</span>${chev}</button>`;
  }
  const list = (heading, rows) => rows.filter(Boolean).length ? `${heading ? `<h2 class="hub-h2">${F(heading)}</h2>` : ''}<div class="hub-list">${rows.filter(Boolean).join('')}</div>` : '';
  // checks: what's changing at this stage, as 2–3 short ticks in place of a lead paragraph. Words only; the numbers live in the glance tiles below.
  function hero({ eyebrow, title, lead, checks, checksLabel = 'What’s changing', meter, button, extra = '' }) {
    return `<header class="hub-hero">${eyebrow ? `<p class="hub-eyebrow">${F(eyebrow)}</p>` : ''}<h1>${F(title)}</h1>${checks ? `<p class="hub-checks-label">${F(checksLabel)}</p><ul class="hub-hero-checks">${checks.map(t => `<li>${F(t)}</li>`).join('')}</ul>` : lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}${meter ? `<div class="hub-meter"><div class="hub-meter-label"><span>${F(meter.label)}</span><span>${meter.n} of ${meter.of}</span></div><div class="hub-bar"><i style="width:${Math.round(100 * meter.n / meter.of)}%"></i></div></div>` : ''}${button ? `<button class="hub-button" onclick="${button.onclick}">${F(button.label)}</button>` : ''}${extra}</header>`;
  }
  const tiles = ts => `<div class="hub-tiles">${ts.map(t => `<div><small>${F(t[0])}</small><b>${F(t[1])}</b><span>${F(t[2])}</span></div>`).join('')}</div>`;
  const glanceCard = (title, ts, onclick, note = '') => `<button class="hub-card hub-glance" onclick="${onclick}"><span class="hub-card-head"><b>${F(title)}</b>${chev}</span>${tiles(ts)}${note ? `<span class="hub-card-note">${F(note)}</span>` : ''}</button>`;
  // Normal versus call: two boxes side by side, with an optional link underneath.
  const versus = (title, a, b, link) => `<section class="hub-card hub-versus"><h3>${F(title)}</h3><div class="hub-vs"><div><b>${F(a[0])}</b><p>${F(a[1])}</p></div><div class="is-urgent"><b>${F(b[0])}</b><p>${F(b[1])}</p></div></div>${link ? `<button class="hub-link" onclick="${link[1]}">${F(link[0])} ›</button>` : ''}</section>`;
  const next = (when, title, onclick, extra = '') => `<button class="hub-next" onclick="${onclick}"><span><small>${F(when)}</small><b>${F(title)}</b></span>${chev}</button>${extra}`;
  const listMore = (label, onclick) => `<button class="hub-list-more" onclick="${onclick}"><span>${F(label)}</span>${chev}</button>`;
  const more = (label, onclick) => `<button class="hub-more" onclick="${onclick}"><span>${F(label)}</span>${chev}</button>`;
  const note = t => `<p class="hub-note">${F(t)}</p>`;
  // A video for things you have to see done. Opens the source in a new tab.
  const figure = (name, cat, caption) => (window.hubFigure ? hubFigure(name, cat, F(caption)) : '');
  const video = (title, source, url, kind = 'Video') => `<a class="hub-video" href="${url}" target="_blank" rel="noopener"><span class="hub-play" aria-hidden="true">${kind !== 'Guide' ? '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5Z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 3h7l4 4v14H7Z"/><path d="M10 12h5M10 16h5"/></svg>'}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(kind + ' · ' + source)}</small></span><span class="hub-chev" aria-hidden="true">↗</span></a>`;

  // Detail screen frame: the app's header, then a short headline and lead, then one job.
  function detail(cat, context, title, lead, inner, artName) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="${cat}" style="${yearTheme(cat)}">${typeof detailPageTop === 'function' ? detailPageTop(cat) : ''}<div class="hub-detail-head"><span class="hub-big">${art(artName || (window.hubPageIcon ? hubPageIcon(cat, title) : 'star'), cat)}</span><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }
  function ticks(rows, isOn, onclick, cat) {
    return `<div class="hub-ticks">${rows.map((r, i) => `<button class="hub-tick ${isOn(i) ? 'is-on' : ''}" role="checkbox" aria-checked="${isOn(i)}" onclick="${onclick(i)}"><span class="hub-tick-art">${art(r[2], cat)}</span><span class="hub-row-copy"><b>${F(r[0])}</b><small>${F(r[1])}</small></span><span class="hub-tick-box" aria-hidden="true">${isOn(i) ? '✓' : ''}</span></button>`).join('')}</div>`;
  }
  const steps = items => `<div class="hub-card"><ol class="hub-steps">${items.map(x => `<li>${F(x)}</li>`).join('')}</ol></div>`;
  // Answers first: for pages parents open with a question ("when", "how do I know", "how much").
  // Each card is [question, short answer, one line of detail]. One shared block, so pages stay consistent.
  const qa = items => `<section class="hub-qa">${items.filter(Boolean).map(([q, a, d]) => `<div><small>${F(q)}</small><b>${F(a)}</b>${d ? `<p>${F(d)}</p>` : ''}</div>`).join('')}</section>`;
  const tip = (label, text) => `<div class="hub-tip"><b>${F(label)}</b>${F(text)}</div>`;
  const table = rows => `<div class="hub-card"><dl class="hub-table">${rows.map(r => `<div><dt>${F(r[0])}</dt><dd>${F(r[1])}</dd></div>`).join('')}</dl></div>`;
  const options = (items, chosen, onclick, cat = 'Feeding') => `<div class="hub-options">${items.map(([k, t, b, icon]) => `<button class="hub-option ${chosen === k ? 'is-on' : ''}${icon ? ' has-art' : ''}" aria-pressed="${chosen === k}" onclick="${onclick(k)}">${icon ? `<span class="hub-option-art">${art(icon, cat)}</span>` : ''}<span><b>${F(t)}</b><span>${F(b)}</span></span></button>`).join('')}</div>`;
  const segmented = (items, chosen, onclick) => `<div class="hub-seg" role="tablist">${items.map(([k, t]) => `<button role="tab" aria-selected="${chosen === k}" class="${chosen === k ? 'is-on' : ''}" onclick="${onclick(k)}">${F(t)}</button>`).join('')}</div>`;

  /* ---------- feeding facts ---------- */
  const m = () => C().ageNow();
  const meth = () => C().method();
  const nursing = () => meth() === 'nurse';
  // One list of choking risks, used wherever foods come up (AAP).
  const chokeCard = () => `<section class="hub-card hub-skip"><b class="hub-fig-title">${F('Skip or change these')}</b><div class="hub-skip-chips">${['Whole nuts and seeds', 'Popcorn', 'Whole grapes or cherry tomatoes', 'Hot dog rounds', 'Hard raw veggies and apple', 'Spoonfuls of nut butter', 'Chunks of cheese or meat', 'Hard candy and gum'].map(t => `<span>${F(t)}</span>`).join('')}</div><p class="hub-skip-fix">${F('Quarter grapes lengthwise, cut hot dogs into thin strips, cook or grate hard veggies, and spread nut butter thinly.')}</p></section>`;
  const signsOn = i => !!(L().ready || {})[i];
  const signsSeen = () => READY.filter((_, i) => signsOn(i)).length;
  const approach = () => L().approach || null;
  const style = () => L().style || (approach() === 'finger' || m() >= 9 ? 'finger' : 'spoon');
  const tried = k => !!(L().allergens || {})[k];
  const setupLeft = () => (typeof chgSafeRemaining === 'function' ? chgSafeRemaining('Feeding') : 4);
  const aidDone = () => !!(L().safe && L().safe.Feeding && L().safe.Feeding[1]);

  const READY = [
    ['{S} {hold|holds} {p} head up on {p} own', 'Steady, without you supporting it', 'head'],
    ['{S} {sit|sits} up with a little support', 'In a high chair or propped on your lap', 'sit'],
    ['{S} {lean|leans} in when food comes {p} way', 'And {open|opens} {p} mouth for the spoon', 'mouth'],
    ['{S} {swallow|swallows} instead of pushing food out', 'That tongue push fades as {s} {get|gets} ready', 'swallow']
  ];
  const ALLERGENS = [['Peanut', 'thinned peanut butter'], ['Egg', 'well-cooked egg'], ['Dairy', 'a spoonful of yogurt'], ['Wheat', 'soft pasta'], ['Soy', 'soft tofu'], ['Sesame', 'a little tahini'], ['Tree nuts', 'thinned almond butter'], ['Fish', 'flaked salmon'], ['Shellfish', 'chopped shrimp']];

  // Milk amounts, written for the family's own feeding method. Typical, not targets.
  function milkTiles(stage) {
    const k = meth();
    const T = {
      learn: { nurse: [['Feeds', '8–12 a day', 'Little and often'], ['Between feeds', '1–3 hours', 'Day and night']],
        bottle: [['Per bottle', '1–3 oz', 'More as the weeks go on'], ['Feeds', '8–12 a day', 'Day and night']],
        expressed: m() < 1 ? [['Per bottle', '1–3 oz', 'More as the weeks go on'], ['Feeds', '8–12 a day', 'Day and night']] : [['Per bottle', '2–4 oz', 'Every 2–3 hours'], ['A day', 'About 25 oz', 'On average']],
        both: [['Feeds', '8–12 a day', 'Nursing and bottles'], ['Per bottle', '1–3 oz', 'More as the weeks go on']] },
      rhythm: { nurse: [['Feeds', 'About 6–8', 'A day'], ['Between feeds', '2–4 hours', 'Give or take']],
        bottle: [['Per bottle', '4–5 oz', 'Every 3–4 hours'], ['A day', 'About 24–32 oz', 'Most babies']],
        expressed: [['Per bottle', '3–4 oz', 'About 25 oz a day'], ['Feeds', 'About 6–8', 'A day']],
        both: [['Feeds', 'About 6–8', 'Nursing and bottles'], ['Per bottle', '4–5 oz', 'When you use one']] },
      ready: { nurse: [['Nursing', 'About 5–7 feeds', 'A day'], ['Between feeds', '3–4 hours', 'Give or take']],
        bottle: [['Per bottle', '4–6 oz', 'About 5–7 a day'], ['A day', '24–32 oz', 'Most babies']],
        expressed: [['Per bottle', '3–5 oz', m() <= 6 ? 'About 25 oz a day' : 'Follow {p} cues'], ['Feeds', 'About 5–7', 'A day']],
        both: [['Feeds', 'About 5–7', 'Nursing and bottles'], ['Per bottle', '4–6 oz', 'When you use one']] }
    };
    if (T[stage]) return T[stage][k] || T[stage].nurse;
    const milk = { first: { nurse: ['Milk', 'About 5–7 feeds', 'Still the main food'], bottle: ['Formula', '24–32 oz a day', 'Still the main food'], expressed: ['Milk', m() <= 6 ? 'About 25 oz a day' : 'About 24 oz a day', 'Still the main food'], both: ['Milk', 'About 5–7 feeds', 'Nursing and bottles'] },
      textures: { nurse: ['Milk', 'About 4–6 feeds', 'Alongside meals'], bottle: ['Formula', '24–30 oz a day', 'Alongside meals'], expressed: ['Milk', 'About 24 oz a day', 'Alongside meals'], both: ['Milk', 'About 4–6 feeds', 'Bottles 6–8 oz each'] },
      meals: { nurse: ['Milk', 'About 3–5 feeds', 'Alongside meals'], bottle: ['Formula', 'About 24 oz a day', 'No more than 32 oz'], expressed: ['Milk', 'About 20–24 oz', 'A day'], both: ['Milk', 'About 3–5 feeds', 'Bottles 6–8 oz each'] } }[stage];
    // From the first birthday, formula gives way to whole cow's milk from a cup (AAP: about 16–24 oz a day).
    if (stage === 'meals' && m() >= 12) Object.assign(milk, { nurse: ['Nursing', 'As often as suits you', 'Meals lead now'], bottle: ['Whole milk', '16–24 oz a day', 'From a cup'], expressed: ['Milk', '16–24 oz a day', 'From a cup'], both: ['Milk', '16–24 oz a day', 'From a cup, plus nursing'] });
    const food = { first: ['Solids', '1–2 small meals', 'A few bites is plenty'], textures: ['Meals', '2–3 a day', 'Bigger portions now'], meals: ['Meals', '3, plus 1–2 snacks', 'Family food, adapted'] }[stage];
    return [milk[k] || milk.nurse, food];
  }

  /* ---------- feeding summary screens ---------- */
  const STAGE_KEYS = ['learn', 'rhythm', 'ready', 'first', 'textures', 'meals'];
  const STAGE_RAIL_AGE = { learn: 'the first 6 weeks', rhythm: '6 weeks to 4 months', ready: '4 to 6 months', first: 'once solids start', textures: 'usually around 8 months', meals: 'usually around 10 months' };
  function pills(cat, view, cur) {
    const ST = STAGE_TABLE[cat].stages, live = C().live();
    if (cat === 'Feeding') {
      // Three stages for parents; the step inside each follows age (milk) or time since starting (solids).
      const inside = g => g === feedGroup(cur) ? cur : g === 0 ? (m() < 1.5 ? 0 : 1) : g === 1 ? 2 : 3;
            return stageTimeline(cat, ST.map((st, g) => ({ label: st.label, age: st.age, on: g === feedGroup(view), now: live && g === feedGroup(cur), onclick: g === 2 && live && feedGroup(cur) === 2 ? `openPage('topic:Feeding')` : `chgGo('chg:Feeding:s:${inside(g)}')`, change: stageCanChange(cat, g, feedGroup(cur)) ? `hubChangeStage('Feeding',${g})` : '' })), 'Feeding stages');
    }
    return stageTimeline(cat, ST.map((st, i) => ({ label: st.label, age: st.age, on: i === view, now: live && i === cur, onclick: `chgGo('chg:${cat}:s:${i}')`, change: stageCanChange(cat, i, cur) ? `hubChangeStage('${cat}',${i})` : '' })), cat + ' stages');
  }
  function frame(cat, view, cur, body) {
    return `<div class="quiet-category hub-page" data-overview="${cat}" style="${yearTheme(cat)}">${monthlyPageHeader(cat)}${pills(cat, view, cur)}${body}<p class="hub-foot">Ages are typical. Every baby moves at their own pace.</p></div>`;
  }
  // When a parent browses another stage, offer the one-tap update where it makes sense.
  // Stage changes live on the timeline now (Change above the stage you're reading).
  function browseLinks() { return ''; }
  // One question everywhere: Has X started solids? Just starting · For a while · Not yet
  function solidsAsk(q) {
    return `<section class="hub-assumed"><p>${F(q)}</p><div><button onclick="setFeedingStage('starting');hubToast('Got it','Feeding now shows first tastes.')">Just starting</button><button onclick="setFeedingStage('while');hubToast('Got it','${F('Feeding now matches where Maya is.')}')">For a while</button><button onclick="setFeedingStage('preparing')">Not yet</button></div></section>`;
  }
  function comingUp(cat, view) {
    const D = C().DATA[cat], N = D.CH[view + 1];
    if (!N) { const A = D.CH[view].after; return A ? next(`After the first birthday, ${A[0]}`, cat === 'Feeding' && meth() === 'nurse' ? 'Cow’s milk, from a cup' : A[1], go('chg:Feeding:d:after')) : ''; }
    let w = N.when.replace(/^Usually /, '').replace(/^around /, '');
    if (/weeks–/.test(w)) w = w.split('–')[0];
    // Inside Milk feeds, the next step keeps the same stage name, so name what changes instead.
    const rail = cat === 'Feeding' && view === 0 ? 'Feeds get quicker and further apart' : cat === 'Feeding' && view === 3 ? (approach() === 'finger' ? 'From strips to small pieces' : 'Thicker textures and finger foods') : N.rail;
    // Inside Solids, a parent whose baby is already there can say so in one tap.
    const ahead = '';
    if (cat === 'Feeding' && view === 2 && C().live() && foodCareAge() >= 6) return next('Next, when Maya is ready', rail, `chgGo('chg:${cat}:s:${view + 1}')`, ahead);
    return next(`Coming up around ${w}`, rail, `chgGo('chg:${cat}:s:${view + 1}')`, ahead);
  }
  const faqRow = (cat, key) => (C().DATA[cat].DEC[key] || []).length ? more('What other parents ask', go(`chg:${cat}:d:faq:${key}`)) : '';

  // Solids: one page for parents. A summary of what's typical at this age, then every guide, with the one for this age first.
  const SOLIDS_GUIDES = [
    { i: 3, k: 'first', icon: 'bowl', title: 'First tastes', sub: 'What to offer first, and how much', when: 'Usually from about 6 months' },
    { i: 4, k: 'textures', icon: 'avocado', title: 'Thicker textures and finger foods', sub: 'Lumpier food, and soft pieces to pick up', when: 'Usually around 7–8 months' },
    { i: 5, k: 'meals', icon: 'plate', title: 'Three meals a day', sub: 'Family food, with milk alongside', when: 'Usually around 9–10 months' }
  ];
  function solidsHub(cur) {
    const live = C().live(), age = m(), phase = STAGE_KEYS[cur] || 'first';
    let h = '';
    if (live && typeof foodAssumed === 'function' && foodAssumed()) h += `${solidsAsk('We’re showing solids for Maya’s age. {Have|Has} {s} started?')}`;
    if (live && !approach() && answers.solids === 'Yes') h += `<section class="hub-assumed"><p>${F('How do you serve food to Maya? It changes which tips we show.')}</p><div>${[['spoon', 'Spoon-feeding'], ['finger', 'Finger foods'], ['both', 'A bit of both']].map(([k, l]) => `<button onclick="hubApproach('${k}')">${l}</button>`).join('')}</div></section>`;
    const blw = approach() === 'finger';
    const S = { first: ['A few bites a day is all it takes', ['Solids start once or twice a day, a few bites at a time', 'Milk is still Maya’s main food', 'First meals are about practice, not amounts']],
      textures: blw ? ['More to pick up, and more variety', ['Meals go up to 2–3 a day, from 1–2', 'As Maya learns to pinch, pieces can get smaller', 'More foods and flavors join in']] : ['Thicker food, and more to pick up', ['Food gets lumpier, moving on from smooth purées', 'Soft finger foods join in, for Maya to pick up', 'Meals go up to 2–3 a day, from 1–2']],
      meals: ['Meals are part of the day now', ['Meals go up to 3 a day, plus a snack or two', 'Milk moves alongside meals instead of leading', 'Most of what you eat can work for Maya too']] }[phase];
    h += hero({ eyebrow: 'Solids', title: S[0], checks: S[1] });
    h += glanceCard(live ? 'What Maya’s eating now' : 'At this age', milkTiles(phase), go('chg:Feeding:d:milk:' + phase));
    // The guide for this age comes first; a baby who started in the last few weeks starts with First tastes.
    // Just started (they said so, or the start date is recent): First tastes is where to start.
    const recent = live && (answers.foodExperience === 'new' || (answers.solidsStart && typeof foodWeeksIn === 'function' && foodWeeksIn() < 4));
    const first = recent ? 3 : cur;
    const G = SOLIDS_GUIDES.map(g => blw && g.i === 4 ? { ...g, title: 'From strips to small pieces' } : g);
    const startedEarly = live && answers.solidsStart && age < 6;
    h += list('Solids guides', G.map(g => row({ icon: g.icon, title: g.title, sub: g.i === 3 && startedEarly ? 'Where every baby starts' : g.when, chipText: g.i === first ? (recent || !live ? 'Start here' : 'Now') : '', onclick: go('chg:Feeding:s:' + g.i) })));
    const t = ALLERGENS.filter(a => tried(a[0])).length;
    // Only what a parent comes back to: the allergen tracker. Gagging help and first aid sit in the box below and in the guides.
    if (t < ALLERGENS.length) h += list('Along the way', [row({ icon: 'peanut', title: 'Try a new allergen', sub: !t && typeof foodWeeksIn === 'function' && foodWeeksIn() >= 4 ? 'Already tried some? Tick them' : `${ALLERGENS.find(a => !tried(a[0]))[0]} is next`, chipText: `${t} of ${ALLERGENS.length}`, onclick: go('chg:Feeding:d:allergens') })]);
    h += versus('Gagging or choking?', ['Gagging', 'Coughing and a red face. It looks scary, but it’s normal.'], ['Choking', 'Silent and can’t cough or cry. Call 911 right away.'], ['Choking first aid, step by step', "openPage('chg:Feeding:safe')"]);
    // The guides list already shows what's next, so the only look-ahead here is past the first birthday.
    { const A = C().DATA.Feeding.CH[5].after; if (A) h += next(`After the first birthday, ${A[0]}`, meth() === 'nurse' ? 'Cow’s milk, from a cup' : A[1], go('chg:Feeding:d:after')); }
    return frame('Feeding', cur, cur, h);
  }
  function feedingSummary(view, cur, guide = false) {
    const key = STAGE_KEYS[view], age = m(), now = view === cur && !guide;
    let h = '';
    if (now && typeof feedingCheckinMarkup === 'function' && !(typeof foodAssumed === 'function' && foodAssumed())) h += feedingCheckinMarkup();
    // Reading a step that isn't the baby's: say so, and offer the way back.
    if (guide) h += `<div class="hub-preview"><span>${F('Solids guide · ' + ({ first: 'usually from about 6 months', textures: 'usually around 7–8 months', meals: 'usually around 9–10 months' }[key] || ''))}</span></div>`;
    else if (!now && C().live()) h += `<div class="hub-preview"><span>${view > cur ? 'Preview' : 'Looking back'} · ${F(STAGE_RAIL_AGE[key] || '')}</span><button onclick="openPage('topic:Feeding')">${F('Back to Maya’s stage')}</button></div>`;
    // A parent who hasn't answered, from 9 months: show the step for the age, and say so.
    if (now && typeof foodAssumed === 'function' && foodAssumed()) h += `${solidsAsk('We’re showing solids for Maya’s age. {Have|Has} {s} started?')}`;
    // Inside Solids: one quiet way to say where the baby really is, forward or back.
    const fix = '';
    // "New" stays on the rows of a new step until each is opened.
    const fresh = now && typeof foodRowNew === 'function';
    const foodOpenedHas = k => (answers.foodOpened || []).includes(k);

    const newChip = k => fresh && foodRowNew(k) ? { chipText: 'New', chipTone: 'is-new' } : {};
    const opened = (k, route) => `foodOpen('${k}');` + go(route);
    const newEyebrow = (label) => fresh && typeof foodStepIsNew === 'function' && foodStepIsNew() ? label + ' · New this month' : label;
    const B = browseLinks('Feeding', view, cur);
    const lateStart = C().live() && age >= 8 && (guide || (now && typeof hasFoodAnswer === 'function' && hasFoodAnswer() && ['preparing', 'new'].includes(foodStage())));
    const lateRow = lateStart ? row({ icon: 'shield', title: 'Bring your feeding questions to the checkup', sub: 'If first foods are only starting now, ask about iron and textures', onclick: "openHealthDetail(healthJourneyFocus(),'questions')" }) : '';

    if (key === 'learn') {
      h += hero({ eyebrow: 'Milk feeds', title: 'Feeding often is exactly right', checksLabel: 'What to expect', checks: ['Maya feeds 8–12 times a day, about every 1–3 hours', 'Feeds happen day and night, with no pattern yet', 'Small, frequent feeds are how newborns grow'] }) + B;
      h += glanceCard(view === cur && C().live() ? 'What Maya’s eating now' : 'At this stage', milkTiles('learn'), go('chg:Feeding:d:milk:learn'));
      h += list('In these first weeks', [
        row({ icon: 'diaper', title: 'How to tell Maya’s getting enough', sub: 'Wet diapers and weight tell you', onclick: go('chg:Feeding:d:enough') }),
        meth() === 'expressed' ? row({ icon: 'bottle', title: 'Store breast milk safely', sub: '4 hours out, 4 days in the fridge', onclick: go('chg:Feeding:d:storage') }) : meth() === 'bottle' ? row({ icon: 'hand', title: 'Feed at the first hunger cues', sub: 'Rooting and hands to mouth come before crying', onclick: go('chg:Feeding:d:cues') }) : row({ icon: 'mouth', title: 'Get a good latch', sub: 'A wide mouth and a deep latch make feeds comfortable', onclick: go('chg:Feeding:d:latch') }),
        meth() === 'bottle' ? row({ icon: 'bowl', title: 'Make bottles safely', sub: 'Follow the formula’s directions exactly', onclick: go('chg:Feeding:d:bottles') }) : row({ icon: 'drop', title: 'Start vitamin D drops', sub: 'Breastfed babies need them from the first days', chipText: 'Must know', chipTone: 'is-red', onclick: go('chg:Feeding:d:vitd') }),
        nursing() || meth() === 'both' ? row({ icon: 'heart', title: 'How a feed goes', sub: 'How long, both sides, burping and growth spurts', onclick: go('chg:Feeding:d:nursing') }) : null,
        nursing() || meth() === 'both' ? row({ icon: 'bottle', title: 'Pumping and a first bottle', sub: 'When to start, how much, and storing milk', onclick: go('chg:Feeding:d:pump') }) : null
      ]);
      h += versus('Normal, or time to call?', ['Normal', 'Feeding again an hour later, a little spit-up and long feeds at first.'], ['Call your pediatrician', 'Hard to wake for feeds, fewer wet diapers or looking more yellow.']);
    }
    if (key === 'rhythm') {
      h += hero({ eyebrow: 'Milk feeds', title: 'Feeds are getting quicker', checks: ['Feeds drop to about 6–8 a day, down from 8–12', 'Maya goes a little longer between feeds, about 2–4 hours', 'Many babies feed faster, so shorter feeds are normal'] }) + B;
      h += glanceCard(view === cur && C().live() ? 'What Maya’s eating now' : 'At this stage', milkTiles('rhythm'), go('chg:Feeding:d:milk:rhythm'));
      const ev = age < 3 ? 0 : 1;
      h += list('What helps now', [
        row({ icon: 'hand', title: 'Follow {p} cues, not the clock', sub: 'Offer milk when {s’s} hungry, stop when {s’s} full', onclick: go('chg:Feeding:d:cues') }),
        meth() === 'nurse' ? null : row({ icon: 'bowl', title: 'Pace {p} bottles', sub: 'Hold it level and pause every so often', onclick: go('chg:Feeding:d:pacing') }),
        row({ icon: 'drop', title: 'Vitamin D and iron', sub: meth() === 'bottle' ? 'Formula has both, so drops usually aren’t needed' : 'Keep up the daily vitamin D, and ask about iron', onclick: go('chg:Feeding:d:vitd') }),
        nursing() || meth() === 'both' ? row({ icon: 'bottle', title: 'Pumping and a bottle', sub: 'For time apart or going back to work', onclick: go('chg:Feeding:d:pump') }) : null,
        row({ icon: ev === 0 ? 'clock' : 'mouth', title: ev === 0 ? 'Cluster feeding is normal' : 'Distracted feeds are normal', sub: ev === 0 ? 'Lots of feeds close together, often in the evening' : 'Pulling off to look around usually passes', onclick: go(`chg:Feeding:e:${ev}`) })
      ]);
      h += versus('Normal, or time to call?', ['Normal', 'Quicker feeds, longer gaps and a little spit-up.'], ['Call your pediatrician', 'Fewer wet diapers, refusing feeds or taking much less milk.']);
    }
    if (key === 'ready') {
      const n = signsSeen();
      const head = n === 4 && age < 6 ? ['Maya’s showing the signs', 'Most babies start around 6 months, so check with your pediatrician if you’d like to start sooner.']
        : n === 4 ? ['Maya looks ready for solids', '{S} {is} showing all four signs. Pick a calm morning for the first taste.']
        : age >= 6 && !n ? ['Most babies start around now', 'When Maya shows all four signs, {s’s} ready for a first taste. Until then, milk gives {o} everything {s} {need|needs}.']
        : age >= 7 ? ['Some babies take a little longer', 'If Maya isn’t showing all four signs yet, mention it at {p} next checkup. Until then, milk gives {o} everything {s} {need|needs}.']
        : ['Solids are coming up soon', 'Most babies start around 6 months, once they’re ready. Until then, milk gives Maya everything {s} {need|needs}.'];
      h += hero({ eyebrow: 'Preparing for solids', title: head[0], lead: head[1], meter: { label: 'Maya’s readiness signs', n, of: 4 }, button: now && age >= 4 ? null : { label: 'See what to look for', onclick: go('chg:Feeding:d:signs') } }) + B;
      if (now && age >= 4 && !hasFoodAnswer() && !(typeof feedingCheckinModel === 'function' && feedingCheckinModel())) h += solidsAsk('Has Maya started solids?');   // the Quick question above covers it when due
      h += glanceCard(view === cur && C().live() ? 'What Maya’s eating now' : 'At this stage', milkTiles('ready'), go('chg:Feeding:d:milk:ready'));
      const left = setupLeft();
      h += list('Before you start', [
        now && age >= 4 ? row({ icon: 'eye', title: 'Check the readiness signs', sub: 'Four things to look for before the first bite', chipText: `${n} of 4`, chipTone: n === 4 ? 'is-done' : '', onclick: go('chg:Feeding:d:signs') }) : null,
        row({ icon: 'highchair', title: 'Get set up for the first bite', sub: 'A high chair, a soft spoon and first aid', chipText: left ? `${4 - left} of 4` : 'Done', chipTone: left ? '' : 'is-done', onclick: go('chg:Feeding:d:setup') }),
        row({ icon: 'bowl', title: 'Decide how you’d like to start', sub: 'Spoon-feeding, finger foods or a bit of both', chipText: approach() ? { spoon: 'Spoon-feeding', finger: 'Finger foods', both: 'A bit of both' }[approach()] : 'Pick one', chipTone: approach() ? 'is-done' : '', onclick: go('chg:Feeding:d:approach') }),
        meth() === 'bottle' ? null : row({ icon: 'drop', title: 'Ask about iron drops', sub: 'Babies who only have breast milk need them by 6 months', onclick: go('chg:Feeding:d:vitd') }),
        lateRow
      ]);
      h += note('Does Maya have severe eczema or an egg allergy? Talk to your pediatrician before starting, since peanut may need to come early.');
    }
    if (key === 'first') {
      h += hero({ eyebrow: guide ? '' : 'First tastes', title: guide ? 'First tastes' : 'A few bites a day is all it takes', checks: ['Solids start once or twice a day, a few bites at a time', 'Milk is still Maya’s main food', 'First meals are about practice, not amounts'] }) + B + fix;
      if (!guide) h += glanceCard(view === cur && C().live() ? 'What Maya’s eating now' : 'At this stage', milkTiles('first'), go('chg:Feeding:d:milk:first'));
      const t = ALLERGENS.filter(a => tried(a[0])).length, nextA = ALLERGENS.find(a => !tried(a[0]));
      h += list('What to focus on', [
        row({ icon: 'bowl', title: 'What to put on the tray', sub: 'Iron-rich foods, soft enough to squash', onclick: go('chg:Feeding:d:tray') }),
        row({ icon: 'hand', title: 'Let {o} set the pace', sub: 'Turning away or closing {p} mouth means {s’s} done', onclick: go('chg:Feeding:d:pace') }),
        meth() === 'bottle' ? null : row({ icon: 'drop', title: 'Keep up the vitamin D drops', sub: 'Through the first year, plus iron if your pediatrician says so', onclick: go('chg:Feeding:d:vitd') }),
        aidDone() || (C().live() && foodStage() !== 'new' && foodStage() !== 'preparing') ? null : row({ icon: 'shield', title: (typeof actualMonth === 'function' && actualMonth() >= 12 ? 'Learn choking first aid for a child' : 'Learn infant choking first aid'), sub: 'Worth knowing before you need it', chipText: 'Not done yet', chipTone: 'is-red', onclick: "openPage('chg:Feeding:safe')" }),
        lateRow
      ]);
    }
    if (key === 'textures') {
      h += hero({ eyebrow: guide ? '' : 'Thicker textures and finger foods', title: guide ? (approach() === 'finger' ? 'From strips to small pieces' : 'Thicker textures and finger foods') : 'Thicker food, and more to pick up', checks: guide && approach() === 'finger' ? ['As Maya learns to pinch, pieces go from long strips to small, soft bites', 'Meals go up to 2–3 a day, from 1–2', 'More foods and flavors join in'] : ['Food gets lumpier, moving on from smooth purées', 'Soft finger foods join in, for Maya to pick up', 'Meals go up to 2–3 a day, from 1–2'] }) + B + fix;
      if (!guide) h += glanceCard(view === cur && C().live() ? 'What Maya’s eating now' : 'At this stage', milkTiles('textures'), go('chg:Feeding:d:milk:textures'));
      h += list('What to focus on', [
        approach() === 'finger' ? null : row({ icon: 'bowl', title: 'Make food a little lumpier', sub: 'Thicker each week, so {s} {learn|learns} to chew', ...newChip('lumpy'), onclick: opened('lumpy', 'chg:Feeding:d:lumpy') }),
        row({ icon: 'avocado', title: 'Offer soft finger foods', sub: 'Strips first, small pieces once {s} can pinch', ...newChip('finger'), onclick: opened('finger', 'chg:Feeding:d:finger') }),
        // Catch-up: first aid stays until it's done; then a cup to practice with.
        !aidDone() && !(C().live() && foodStage() === 'new') ? row({ icon: 'shield', title: (typeof actualMonth === 'function' && actualMonth() >= 12 ? 'Learn choking first aid for a child' : 'Learn infant choking first aid'), sub: 'Worth knowing before you need it', chipText: 'Not done yet', chipTone: 'is-red', onclick: "openPage('chg:Feeding:safe')" })
          : row({ icon: 'cup', title: 'Practice with an open cup', sub: 'A few sips of water at meals', onclick: go('chg:Feeding:d:cup') }),
        row({ icon: 'hand', title: approach() === 'finger' ? 'Gagging on new foods?' : 'Gagging on lumpier food?', sub: 'It’s common for a while, and here’s what helps', onclick: go('chg:Feeding:d:notready') })
      ]);
      h += versus('Safe to offer, or a choking risk?', ['Safe to offer', 'Soft strips, grapes cut lengthwise into quarters and anything that squashes easily.'], ['Not safe yet', 'Whole nuts, popcorn, raw carrot and round slices of hot dog stay off the menu for years.']);
    }
    if (key === 'meals') {
      h += hero({ eyebrow: guide ? '' : 'Three meals a day', title: guide ? 'Three meals a day' : now ? 'Meals are part of the day now' : 'Meals become part of the day', checks: ['Meals go up to 3 a day, plus a snack or two', 'Milk moves alongside meals instead of leading', 'Most of what you eat can work for Maya too'] }) + B + fix;
      if (!guide) h += glanceCard(view === cur && C().live() ? 'What Maya’s eating now' : 'At this stage', milkTiles('meals'), go('chg:Feeding:d:milk:meals'));
      h += list('What to focus on', [
        row({ icon: 'plate', title: 'What a day of meals looks like', sub: 'A simple example to work from', ...newChip('day'), onclick: opened('day', 'chg:Feeding:d:day') }),
        row({ icon: 'bowl', title: 'Share your family’s food', sub: 'Set {p} portion aside before adding salt', ...newChip('family'), onclick: opened('family', 'chg:Feeding:d:family') }),
        row({ icon: 'cup', title: nursing() ? 'Nursing can carry on' : m() >= 12 ? 'Switching to whole milk' : 'Plan the milk change at 12 months', sub: nursing() ? 'For as long as it works for you both' : m() >= 12 ? 'Whole cow’s milk from a cup, about 16–24 oz a day' : 'Whole cow’s milk can replace formula then', onclick: go('chg:Feeding:d:milk12') })
      ]);
      h += m() >= 12 ? tip('Now that Maya’s 1', 'Honey and cow’s milk as a drink are fine now. Water and milk are still the best drinks, so there’s no need for juice.')
        : versus('Now, or after 12 months?', ['Fine now', 'Water from a cup, yogurt and cheese, and most family food.'], ['Wait until 12 months', 'Honey, cow’s milk as a drink, and juice.']);
    }
    h += (guide ? '' : comingUp('Feeding', view)) + faqRow('Feeding', key);
    return frame('Feeding', view, cur, h);
  }

  /* ---------- feeding detail screens ---------- */
  const FOODS = {
    lentils: { art: 'lentils', group: 'iron', title: 'Lentils or beans', sub: 'Cheap, easy and full of iron', why: 'They’re full of iron, cost very little and turn soft without much work.',
      base: 'Rinse red lentils and simmer them in water until very soft, about 20 minutes.',
      spoon: ['Blend with a little breast milk, formula or water until smooth and runny.', 'Offer a few spoonfuls. Over the next few weeks, blend it a little thicker.'],
      finger: ['Mash well, then let it cool and thicken a little.', 'Roll into soft balls, or spread a thin layer on a strip of toast for {o} to grab.'] },
    meat: { art: 'meat', group: 'iron', title: 'Meat or chicken', sub: 'Slow-cooked until it falls apart', why: 'Meat has the kind of iron babies absorb most easily.',
      base: 'Slow-cook beef, lamb or chicken until it falls apart with a fork.',
      spoon: ['Blend with a little of the cooking liquid until smooth.', 'Thin with breast milk, formula or water until it drips off the spoon.'],
      finger: ['Shred it into soft strands, or offer a strip about the size of your finger to gnaw on.', 'Check that it pulls apart easily before it goes on the tray.'] },
    egg: { art: 'egg', group: 'iron', title: 'Eggs', sub: 'Cooked all the way through', why: 'Eggs bring iron and protein, and offering them early may help prevent an egg allergy.',
      base: 'Cook the egg all the way through, hard-boiled or as a firm omelet.',
      spoon: ['Mash a hard-boiled egg with breast milk, formula or water until smooth.', 'Offer it early in the day the first time, since egg is a common allergen.'],
      finger: ['Slice a firm omelet into strips about the size of your finger.', 'Offer it early in the day the first time, since egg is a common allergen.'] },
    oats: { art: 'oats', group: 'iron', title: 'Iron-fortified oatmeal', sub: 'Mixed with breast milk or formula', why: 'Infant oatmeal has iron added, and it’s easy to make thinner or thicker.',
      base: 'Choose an infant oatmeal that says it’s fortified with iron.',
      spoon: ['Mix with breast milk, formula or water until it’s smooth and runny.', 'Make it a little thicker each week as {s} {get|gets} used to it.'],
      finger: ['Mix it thick, so it holds its shape.', 'Spread it on a strip of toast, or let {o} scoop it with {p} hands.'] },
    avocado: { art: 'avocado', group: 'veg', title: 'Avocado', sub: 'Ripe and soft, no cooking needed', why: 'It’s naturally soft, full of healthy fats and ready in seconds.',
      base: 'Pick a ripe avocado that gives a little when you press it.',
      spoon: ['Mash with a fork until smooth.', 'Thin with a little breast milk, formula or water if it’s too thick.'],
      finger: ['Cut it into strips about the size of your finger.', 'Roll the strips in a little infant cereal so they’re easier to hold.'] },
    potato: { art: 'potato', group: 'veg', title: 'Sweet potato', sub: 'Roasted or steamed until soft', why: 'It’s sweet, easy to make soft and most babies like it.',
      base: 'Roast or steam sweet potato until a fork slides in easily, about 25–30 minutes.',
      spoon: ['Mash or blend with a little breast milk, formula or water until smooth.', 'Leave it a little lumpier as the weeks go on.'],
      finger: ['Cut it into wedges about the size of your finger before cooking.', 'Let it cool, then check it squashes easily.'] }
  };

  function feedingDetail(id, arg) {
    const cat = 'Feeding', age = m();
    if (id === 'signs') {
      const n = signsSeen();
      const close = n === 4 && age < 6 ? 'Maya’s showing all four. Most babies start around 6 months, so check with your pediatrician if you’d like to start sooner.'
        : n === 4 ? 'Maya’s showing all four signs, so {s’s} ready for a first taste. Pick a calm morning when {s’s} not too hungry.'
        : 'Being curious about your food is a great sign, but on its own it doesn’t mean {s’s} ready. Most babies show all four around 6 months. To check the last two, let Maya sit with you at meals, and offer an empty soft spoon.';
      return detail(cat, 'Preparing for solids', 'Is Maya ready for solids?', 'Tap each sign as you notice it. Once you’ve seen all four, Maya’s ready for a first taste.',
        ticks(READY, signsOn, i => `hubToggleReady(${i})`, 'Development').replace('class="hub-ticks"', 'class="hub-ticks is-grid"') + `<div class="hub-tip is-plain">${F(close)}${typeof profile !== 'undefined' && profile.early ? ' ' + F('Since Maya was born early, check timing with your pediatrician.') : ''}</div>`
        // All four signs, from 6 months, and solids not started yet: one tap to say today's the day.
        + (n === 4 && age >= 6 && C().live() && answers.solids !== 'Yes' ? `<div class="hub-actions"><button class="hub-button" onclick="setFeedingStage('starting');hubToast('Got it','Feeding now shows first tastes.');openPage('topic:Feeding')">${F('We’re starting today')}</button></div>` : ''));
    }
    if (id === 'setup') {
      const SETUP = [['Get a high chair with a harness', 'One that keeps {o} upright, with {p} feet supported', 'highchair'], ['Learn infant choking first aid', 'A short class or video, so you know what to do', 'shield'], ['Know gagging from choking', 'Gagging is noisy and normal. Choking is silent.', 'mouth'], ['Have a soft spoon and an open cup', 'Small soft-tipped spoons, and a cup for sips of water', 'cup']];
      const on = i => !!(L().safe && L().safe.Feeding && L().safe.Feeding[i]), done = SETUP.filter((_, i) => on(i)).length;
      return detail(cat, 'Preparing for solids', 'Get set up for the first bite', 'A few things to sort out before the first meal. Tick them off as you go.',
        `<p class="hub-group">${done} of 4 done</p>` + ticks(SETUP, on, i => `chgToggleSafe('Feeding',${i})`, 'Feeding') + hubEmbed('ShaNuST_58A', 'What to do when a baby is choking', 'American Red Cross') + tip('Good to know', 'You don’t need special gadgets. A spoon, a bowl and a safe seat are plenty.'), 'highchair');
    }
    if (id === 'approach') {
      return detail(cat, 'Preparing for solids', 'Decide how you’d like to start', 'There’s no wrong choice, and you can change your mind any time.',
        options([['spoon', 'Spoon-feeding', 'You offer small spoonfuls of smooth food, then make it lumpier over time.', 'bowl'], ['finger', 'Finger foods', 'Maya feeds {r} soft pieces from the start. It’s messier, with lots of exploring.', 'hand'], ['both', 'A bit of both', 'Spoon some foods and offer others as finger foods. Many families do this.', 'plate']], approach(), k => `hubApproach('${k}')`)
        + tip('Whichever you choose', 'Readiness, safe food and letting Maya decide how much matter with every approach.'), 'bowl');
    }
    if (id === 'milk') {
      const stage = (STAGE_KEYS.includes(arg) && arg) || STAGE_KEYS[C().CFG.Feeding.stage(age)] || 'ready';
      const rowsByMeth = {
        learn: { nurse: [['Feeds', '8–12 a day'], ['Between feeds', 'Every 1–3 hours']], bottle: [['Per bottle', '1–2 oz at first, 2–3 oz by 2 weeks'], ['Feeds', '8–12 a day']], expressed: age < 1 ? [['Per bottle', '1–2 oz at first, 2–3 oz by 2 weeks'], ['Feeds', '8–12 a day']] : [['Per bottle', '2–4 oz'], ['A day', 'About 25 oz, on average']], both: [['Feeds', '8–12 a day in total'], ['Per bottle', '1–3 oz']] },
        rhythm: { nurse: [['Feeds', 'About 6–8 a day'], ['Between feeds', 'Every 2–4 hours']], bottle: [['Per bottle', '4–5 oz'], ['A day', 'About 24–32 oz']], expressed: [['Per bottle', '3–4 oz'], ['A day', 'About 25 oz']], both: [['Feeds', 'About 6–8 a day in total'], ['Per bottle', '4–5 oz']] },
        ready: { nurse: [['Nursing', 'About 5–7 feeds a day'], ['Between feeds', 'Every 3–4 hours']], bottle: [['Per bottle', '4–6 oz'], ['A day', 'Up to 32 oz']], expressed: [['Per bottle', '3–5 oz'], ['A day', age <= 6 ? 'About 25 oz' : 'Follow Maya’s cues']], both: [['Feeds', 'About 5–7 a day in total'], ['Per bottle', '4–6 oz']] },
        first: { nurse: [['Nursing', 'About 5–7 feeds a day'], ['Solids', '1–2 small meals a day'], ['Water', 'A few sips with meals']], bottle: [['Formula', '24–32 oz a day'], ['Solids', '1–2 small meals a day'], ['Water', 'A few sips with meals']], expressed: [['Breast milk', age <= 6 ? 'About 25 oz a day' : 'About 24 oz a day'], ['Solids', '1–2 small meals a day'], ['Water', 'A few sips with meals']], both: [['Milk', 'About 5–7 feeds a day, nursing and bottles'], ['Solids', '1–2 small meals a day'], ['Water', 'A few sips with meals']] },
        textures: { nurse: [['Nursing', 'About 4–6 feeds a day'], ['Meals', '2–3 a day'], ['Water', '4–8 oz a day']], bottle: [['Formula', '24–30 oz a day'], ['Meals', '2–3 a day'], ['Water', '4–8 oz a day']], expressed: [['Breast milk', 'About 24 oz a day'], ['Meals', '2–3 a day'], ['Water', '4–8 oz a day']], both: [['Milk', 'About 4–6 feeds a day, nursing and bottles'], ['Meals', '2–3 a day'], ['Water', '4–8 oz a day']] },
        meals: { nurse: [['Nursing', 'About 3–5 feeds a day'], ['Meals', '3, plus 1–2 snacks'], ['Water', age >= 12 ? 'Offer with meals and snacks' : '4–8 oz a day']], bottle: [age >= 12 ? ['Cow’s milk, if used', '16–24 oz a day'] : ['Formula', 'About 24 oz a day'], ['Meals', '3, plus 1–2 snacks'], ['Water', age >= 12 ? 'Offer with meals and snacks' : '4–8 oz a day']], expressed: [['Breast milk', 'About 20–24 oz a day'], ['Meals', '3, plus 1–2 snacks'], ['Water', age >= 12 ? 'Offer with meals and snacks' : '4–8 oz a day']], both: [['Milk', 'About 3–5 feeds a day, nursing and bottles'], ['Meals', '3, plus 1–2 snacks'], ['Water', age >= 12 ? 'Offer with meals and snacks' : '4–8 oz a day']] }
      }[stage];
      const head = { learn: ['Little and often', 'Newborns have tiny tummies, so frequent feeds are exactly what they need.'], rhythm: ['Feeds are settling into a rhythm', 'Feeds often get quicker or a little further apart now. Hungrier days still happen.'], ready: age >= 7 ? ['Milk is still the main drink', 'If {s} {haven’t|hasn’t} started solids yet, it’s worth starting soon. Mention it at {p} next checkup.'] : ['Milk is still everything', 'Nothing changes until solids begin. Keep feeding the way you have been.'], first: ['Milk still comes first', 'Solids are practice for now, so keep milk feeds going as usual. Offer milk before meals if {s} {seem|seems} too hungry to try food.'], textures: ['Milk and meals together', 'Meals are growing, but milk still matters. Most babies drop a feed or two on their own.'], meals: ['Meals take the lead', 'Milk comes alongside meals now. The bigger change comes around the first birthday.'] }[stage];
      const enough = stage === 'learn' ? 'At least 6 wet diapers a day after day 5, and back to birth weight by about 2 weeks.' : stage === 'first' || stage === 'textures' || stage === 'meals' ? 'Steady growth at checkups and plenty of wet diapers. How much {s} {eat|eats} at one meal matters much less.' : 'Steady growth at checkups and plenty of wet diapers.';
      const select = `<label class="hub-select">Showing amounts for <select onchange="chgChooseMethod(this.value)">${[['nurse', 'Nursing'], ['expressed', 'Breast milk in bottles'], ['bottle', 'Formula'], ['both', 'Nursing and bottles']].map(([v, l]) => `<option value="${v}" ${meth() === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
      const early = typeof profile !== 'undefined' && profile.early ? tip('Born early?', 'Follow your pediatrician’s milk and supplement plan first. These are general amounts.') : '';
      // How amounts change across the year, Maya's stage marked. Same numbers as the tables.
      const si = ['learn', 'rhythm', 'ready', 'first', 'textures', 'meals'].indexOf(stage), labels = ['Newborn', '1–4 months', '4–6 months', '6–7 months', '7–9 months', '9–12 months'];
      const chart = meth() === 'nurse' || meth() === 'both'
        ? hubColumnChart({ title: 'Milk feeds a day, across the year', items: [['Newborn', 8, 12, '8–12'], ['1–4|months', 6, 8, '6–8'], ['4–7|months', 5, 7, '5–7'], ['7–9|months', 4, 6, '4–6'], ['9–12|months', 3, 5, '3–5']], max: 12, nowIndex: [0, 1, 2, 2, 3, 4][si], cat, caption: 'Milk feeds go down across the year: 8 to 12 a day as a newborn, 6 to 8 at 1 to 4 months, 5 to 7 at 4 to 7 months, 4 to 6 at 7 to 9 months and 3 to 5 at 9 to 12 months.', note: 'Fewer, bigger feeds as Maya grows and solids join in. Every baby’s a little different.' })
        : meth() === 'bottle' ? hubColumnChart({ title: 'Formula per bottle, across the year', items: [['Newborn', 1, 3, '1–3 oz'], ['1–4|months', 4, 5, '4–5 oz'], ['4–6|months', 4, 6, '4–6 oz'], ['6–12|months', 6, 8, '6–8 oz']], max: 8, nowIndex: [0, 1, 2, 3, 3, 3][si], cat, caption: 'Bottles grow from 1 to 3 oz as a newborn to 6 to 8 oz from about 6 months.', note: 'Bigger bottles, fewer of them: about 4–5 a day by 6 months. The daily total is usually about 24 oz, and no more than 32, until 12 months.' })
        : hubColumnChart({ title: 'Breast milk per bottle, across the year', items: [['Newborn', 1, 3, '1–3 oz'], ['1–4|months', 3, 4, '3–4 oz'], ['4–12|months', 3, 5, '3–5 oz']], max: 6, nowIndex: [0, 1, 2, 2, 2, 2][si], cat, caption: 'Bottles of breast milk grow from 1 to 3 oz to about 3 to 5 oz, then stay there.', note: age <= 6 ? 'Breast milk changes with your baby, so bottles stay about 3–5 oz. About 25 oz a day is typical.' : 'Breast milk changes with your baby, so bottles stay about 3–5 oz.' });
      return detail(cat, C().DATA.Feeding.CH[C().CFG.Feeding.stage(age)].rail, head[0], head[1], chart + table(rowsByMeth[meth()] || rowsByMeth.nurse) + early + tip('How to tell {s’s} getting enough', enough) + note('These are typical amounts, not targets. Every baby’s a little different.') + select, 'bowl');
    }
    if (id === 'tray') {
      const grp = (title, g) => `<p class="hub-group">${F(title)}</p><div class="hub-list">${Object.entries(FOODS).filter(([, f]) => f.group === g).map(([k, f]) => row({ icon: f.art, title: f.title, sub: f.sub, onclick: go('chg:Feeding:d:food:' + k) })).join('')}</div>`;
      return detail(cat, 'Solids', 'There’s no perfect first food', 'Most families start with something rich in iron, then add fruits and vegetables. Whatever your family eats is a great place to start.',
        grp('Rich in iron', 'iron') + grp('Fruits and vegetables', 'veg') + `<section class="hub-card hub-skip"><b class="hub-fig-title">${F('Skip for now')}</b><div class="hub-skip-chips">${['Honey', 'Cow’s milk as a drink', 'Juice', 'Added salt or sugar', 'Whole nuts', 'Popcorn', 'Whole grapes', 'Raw carrot'].map(t => `<span>${t}</span>`).join('')}</div><small>${F('Anything hard or round is a choking risk.')}</small></section>`);
    }
    if (id === 'food') {
      const f = FOODS[arg] || FOODS.lentils, st = style();
      return detail(cat, 'What to put on the tray', f.title, f.why,
        segmented([['spoon', 'Spoon-feeding'], ['finger', 'Finger foods']], st, k => `hubStyle('${k}')`) + (st === 'finger' ? figure('sizes', cat, 'From 6 to 8 months, strips the size of a finger. From 9 months, pea-sized pieces, with grapes quartered.') : '') + steps([f.base, ...f[st]]) + tip('Is it soft enough?', 'It should squash easily between your thumb and finger.') + tip('Save yourself time', 'Make a batch and freeze extra in an ice cube tray. Each cube is about one meal.'), f.art);
    }
    if (id === 'notready') {
      if (approach() === 'finger') return detail(cat, 'Solids', 'Gagging on new foods', 'Gagging is a normal part of learning to eat. It moves food forward, away from the airway.',
        steps(['Stay calm and let {o} work it out. Most gagging passes in a few seconds.', 'Offer long, soft pieces {s} can hold in a fist, like ripe banana or soft-cooked carrot sticks.', 'Sit {o} upright, and stay with {o} for every meal.'])
        + tip('When to ask', 'If gagging isn’t getting less after a few weeks, or Maya vomits often or refuses food, mention it to your pediatrician.'));
      return detail(cat, 'Solids', 'Gagging on lumpier food', 'Lots of babies need a little longer with lumps. Going slowly is fine, as long as things keep moving.',
        steps(['Stay with smooth or thin, runny mashes for a week or two, the textures {s} already {manage|manages}.', 'Keep offering soft finger foods {s} can hold, like ripe banana or soft-cooked carrot sticks. Practice helps.', 'Try lumpier food again when {s’s} calm and hungry, alongside a food {s} already {like|likes}.'])
        + tip('When to ask', 'If lumps still aren’t getting easier after a few weeks, or Maya vomits often or refuses food, mention it to your pediatrician.'));
    }
    if (id === 'allergens') {
      const t = ALLERGENS.filter(a => tried(a[0])).length;
      return detail(cat, 'Solids', 'Try a new allergen', 'Offering common allergens early, once a few first foods are going well, may help prevent food allergies.',
        `<div class="hub-card"><div class="hub-card-head"><b>${F(t ? 'Tick the ones Maya has tried' : 'Has Maya tried any of these yet? Tick them')}</b><span class="hub-chip">${t} of ${ALLERGENS.length}</span></div><div class="chg-choices hub-chips">${ALLERGENS.map(([k]) => `<button class="${tried(k) ? 'is-on' : ''}" aria-pressed="${tried(k)}" onclick="hubAllergen('${k}')">${tried(k) ? '✓ ' : ''}${k}</button>`).join('')}</div></div>`
        + (tried('Peanut') ? '' : note('Severe eczema or an egg allergy? Talk to your pediatrician before trying peanut.'))
        + steps([(() => { const nx = ALLERGENS.find(x => !tried(x[0])); return nx ? `${nx[0]} is next. Try ${nx[1]}.` : 'Maya has tried them all. Keep offering each one a few times a week.'; })(), 'Offer a small amount early in the day, so you can watch how {s} {do|does} afterward.', 'Once it goes well, keep offering it a few times a week. That’s what helps most.'])
        + `<section class="hub-card hub-versus"><h3>${F('If something seems off')}</h3><div class="hub-vs"><div><b>Call your pediatrician</b><p>${F('A few hives around the mouth, or vomiting after a new food.')}</p></div><div class="is-urgent"><b>Call 911</b><p>${F('Trouble breathing, swelling of the lips or tongue, or {s} {seem|seems} floppy or pale.')}</p></div></div></section>`
, 'peanut');
    }
    if (id === 'pace') {
      return detail(cat, 'Solids', 'Let Maya set the pace', 'Babies are good at knowing how much they need. Your job is what and when; {p} job is how much.',
        `<div class="hub-card hub-two"><div><b>${F('Ready for more')}</b><p>${F('Leans in, opens {p} mouth, reaches for the spoon.')}</p></div><div><b>${F('All done')}</b><p>${F('Turns away, closes {p} mouth, pushes food off the tray.')}</p></div></div>`
        + tip('How much is enough?', 'A few spoonfuls or bites is plenty at first. Some days {s’ll} eat almost nothing, and that’s normal.') + tip('Make it easy', 'Sit together, keep it calm, and let {o} touch and explore. Mess is part of learning.'), 'hand');
    }
    if (id === 'enough') {
      const days = (NOW - parse(profile.dob)) / 864e5, newborn = days < 42, ageM = typeof actualMonth === 'function' ? actualMonth() : 0;
      if (!newborn) return detail(cat, 'Milk feeds', 'How to tell Maya’s getting enough', 'Past the newborn weeks, these signs tell you feeds are going well.',
        `<figure class="hub-figure hub-diapers" role="img" aria-label="About 5 to 6 wet diapers a day."><b class="hub-fig-title">${F('Wet diapers: about 5–6 a day')}</b><div class="hub-diaper-row">${Array.from({ length: 6 }, (_, i) => `<span class="${i === 5 ? 'is-maybe' : ''}">${hubArt('diaper', cat)}</span>`).join('')}</div><small>${F('Fewer than usual, or a dry mouth? Call your pediatrician.')}</small></figure>`
        + table([['Growth', 'Following {p} own curve at checkups'], ['After feeds', 'Content, and alert and curious when awake']])
        + `<section class="hub-card hub-versus"><h3>${F('When to call')}</h3><div class="hub-vs"><div><b>Call your pediatrician</b><p>${F('Fewer wet diapers, refusing feeds or taking much less milk than usual.')}</p></div><div class="is-urgent"><b>${ageM < 3 ? 'Call right away' : 'Fever'}</b><p>${F(feverRule(ageM))}</p></div></div></section>`, 'diaper');
      return detail(cat, 'Milk feeds', 'How to tell Maya’s getting enough', 'You can’t always see how much a newborn drinks, so these signs tell you instead.',
        // Wet diapers by day: one on day 1, two on day 2, building to 6 or more from day 6. Today is marked.
        `<figure class="hub-figure hub-diapers" role="img" aria-label="Wet diapers: about 1 on day 1, 2 on day 2, building to 6 or more a day from day 6."><b class="hub-fig-title">${F('Wet diapers, day by day')}</b><div class="hub-diaper-days">${[1, 2, 3, 4, 5, 6].map(d => `<div class="${Math.min(6, Math.floor(days) + 1) === d ? 'is-today' : ''}"><span class="hub-diaper-stack">${Array.from({ length: d }, () => '<i></i>').join('')}</span><b>${d === 6 ? '6+' : d}</b><small>${d === 6 ? 'Day 6 on' : 'Day ' + d}</small>${Math.min(6, Math.floor(days) + 1) === d ? `<em>${F('Today')}</em>` : ''}</div>`).join('')}</div></figure>`
        + table([['Poops', 'Yellow and seedy by day 5, often several a day'], ['Weight', 'Back to birth weight by about 2 weeks'], ['After feeds', 'Relaxed hands and a sleepy, content baby']])
        + (days < 21 ? tip('Wake {o} for feeds for now', 'Until {s’s} back to birth weight, wake {o} if it’s been more than about 3 hours. Your pediatrician will tell you when you can stop.') : tip('Once {s’s} back to birth weight', 'Most babies can feed when they wake. Your pediatrician will tell you if {s} still {need|needs} waking.'))
        + `<section class="hub-card hub-versus"><h3>${F('When to call')}</h3><div class="hub-vs"><div><b>Call your pediatrician</b><p>${F('Hard to wake for feeds, fewer wet diapers or looking more yellow.')}</p></div><div class="is-urgent"><b>Call right away</b><p>${F('A temperature of 100.4°F or higher.')}</p></div></div></section>`, 'diaper');
    }
    if (id === 'cues') {
      return detail(cat, 'Feeding', 'Reading Maya’s hunger cues', 'Feeding at the first signs of hunger is easier on you both than waiting for crying.',
        `<div class="hub-card hub-two hub-cues"><div><b>${F('Hungry')}</b><p>${F('Rooting, lip smacking, hands to mouth. Crying comes last.')}</p></div><div><b>${F('Full')}</b><p>${F('Slowing down, turning away, relaxed hands.')}</p></div></div>` + tip('You can’t overfeed a nursing baby', 'Offering the breast whenever {s} {seem|seems} hungry is exactly right.'), 'hand');
    }
    if (id === 'latch') {
      return detail(cat, 'Milk feeds', 'Getting a good latch', 'A deep latch is more comfortable for you and helps Maya get more milk. It takes practice for both of you.',
        hubEmbed('S5RijIXcHlk', 'How to breastfeed, with a good latch', 'Nemours KidsHealth')
        + hubIconSteps([['mouth', 'Wait for a wide mouth', 'Like a big yawn'], ['heart', 'Bring {o} in, chin first', 'Nose level with your nipple'], ['smile', 'Lips turned out', 'More areola above the top lip'], ['hand', 'Pinches? Try again', 'A clean finger in the corner breaks the suction']], cat, 'Wait for a wide mouth, bring baby in chin first with nose level with your nipple, look for lips turned out. If it pinches, break the suction with a clean finger and try again.')
        + `<section class="hub-card hub-versus"><h3>${F('Normal, or time for help?')}</h3><div class="hub-vs"><div><b>Normal</b><p>${F('A little tenderness in the first week, and a tug that eases after the first few sucks.')}</p></div><div><b>Ask for help</b><p>${F('Pain through the whole feed, cracked nipples, or clicking sounds. A lactation consultant can help, often in one visit.')}</p></div></div></section>`
        + tip('Feed at the first hunger cues', 'Rooting and hands to mouth come before crying, and a calm baby latches more easily.'), 'mouth');
    }
    if (id === 'nursing') {
      // How a feed goes, growth spurts and sore breasts (AAP, HealthyChildren.org; ACOG on mastitis).
      return detail(cat, 'Milk feeds', 'How a feed goes', 'Every baby feeds a little differently. Here’s what’s typical in the first weeks.',
        tiles([['How long', '10–20 min a side', 'Some babies take longer, and that’s fine'], ['Sides', 'Offer both', 'Start with the side you ended on last time'], ['Burping', 'Between sides', 'And at the end, if {s} {seem|seems} uncomfortable'], ['Done when', '{s} {let|lets} go', 'Relaxed hands, sleepy and content']])
        + `<h2 class="hub-h2">${F('Growth spurts')}</h2>` + hubStageStrip({ title: 'Days of feeding more often, around', items: [['clock', '2–3 weeks', 'For 2–3 days'], ['clock', '6 weeks', 'For 2–3 days'], ['clock', '3 months', 'For 2–3 days']], cat, caption: 'Growth spurts often come around 2–3 weeks, 6 weeks and 3 months, each lasting 2–3 days.' })
        + tip('Feeding nonstop for a day or two?', 'That’s usually a growth spurt, not low supply. Feeding more often is how your body makes more milk.')
        + versus('Sore breasts: normal, or time to call?', ['Normal', 'Full, heavy breasts in the first week, and some tenderness as you both learn.'], ['Call your doctor today', 'A hot, red, painful area, fever or chills, or cracked nipples that aren’t healing.'])
        + list('', [row({ icon: 'mouth', title: 'Get a good latch', sub: 'Most nipple pain comes from the latch', onclick: go('chg:Feeding:d:latch') })]), 'heart');
    }
    if (id === 'pump') {
      // Pumping and a first bottle (AAP; CDC milk storage guidelines).
      return detail(cat, 'Milk feeds', 'Pumping and a first bottle', 'A pump gives you flexibility: a night off, time apart, or going back to work.',
        tiles([['When to start', 'About 3–4 weeks', 'Once nursing is going well'], ['First bottle', 'From 3–4 weeks', 'Another adult can give it'], ['How much', 'About 1 oz an hour', 'For each hour you’re apart'], ['Per bottle', '2–4 oz', 'Up to about 3–5 oz by 4–6 months']])
        + `<h2 class="hub-h2">${F('Introducing the bottle')}</h2>`
        + steps(['Offer it when {s’s} hungry but calm, not starving.', 'Let someone else give it, since {s} may expect to nurse with you.', 'Hold the bottle level and pause every so often, so {s} {set|sets} the pace.'])
        + `<h2 class="hub-h2">${F('Storing breast milk')}</h2>`
        + hubIconSteps([['clock', 'Up to 4 hours', 'At room temperature'], ['fridge', 'Up to 4 days', 'At the back of the fridge'], ['snow', 'Up to 12 months', 'In the freezer, best within 6']], cat, 'Fresh breast milk keeps up to 4 hours at room temperature, 4 days in the fridge, and 12 months in the freezer, best within 6.', false)
        + tip('Pumping at work', 'Most workplaces must give you a private, non-bathroom space and break time to pump. Ask before your first day back.'), 'bottle');
    }
    if (id === 'storage') {
      return detail(cat, 'Breast milk in bottles', 'Store breast milk safely', 'Freshly pumped milk keeps well if you follow a few simple times.',
        hubIconSteps([['clock', 'Up to 4 hours', 'At room temperature'], ['fridge', 'Up to 4 days', 'At the back of the fridge'], ['snow', 'Up to 12 months', 'In the freezer, best within 6']], cat, 'Fresh breast milk keeps up to 4 hours at room temperature, 4 days in the fridge, and 12 months in the freezer, best within 6.', false)
        + table([['Thawed milk', '24 hours in the fridge. Don’t refreeze.'], ['After a feed', 'Use leftovers within 2 hours']])
        + steps(['Label each bag or bottle with the date, and use the oldest first.', 'Thaw in the fridge overnight or in a bowl of warm water, never the microwave.', 'Swirl to mix the fat back in. It’s normal for it to separate.'])
        + video('Storing and preparing breast milk', 'Northwestern Medicine', 'https://www.nm.org/healthbeat/healthy-tips/how-to-store-breast-milk', 'Guide'), 'bottle');
    }
    if (id === 'vitd') {
      // Vitamin D and iron, in one place. AAP: breast milk is low in both; formula has both added.
      // Iron (AAP): breastfed babies get iron drops from 4 months until iron-rich foods are going well; breastfed babies born early, from about 1 month through 12 months.
      // Vitamin D (AAP): 400 IU a day for breastfed and partly breastfed babies; after 1, many children still need 600 IU.
      const f = meth() === 'bottle', early = typeof profile !== 'undefined' && profile.early;
      const ts = f ? [['Vitamin D', 'Usually covered', 'Formula has it added'], ['Iron', 'Usually covered', 'Formula has it added']]
        : [['Vitamin D', '400 IU a day', 'Drops, from the first days'], ['Iron', early ? 'From about 1 month' : 'From 4 months', early ? 'Usually until 12 months, at the dose your pediatrician gives' : 'Drops until iron-rich foods are going well']];
      return detail(cat, 'Milk feeds', 'Vitamin D and iron', f ? 'Formula has both added, so most formula-fed babies don’t need drops.' : 'Breast milk is low in vitamin D and iron, so breastfed and partly breastfed babies need a little extra.',
        `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F(f ? 'For formula-fed babies' : 'For breastfed babies')}</b></span>${tiles(ts)}</section>`
        + (f ? tip('When to ask', 'If Maya drinks less than about 32 oz of formula a day, ask your pediatrician about vitamin D drops.')
          : steps(age >= 12 ? ['Ask at the 12-month checkup whether to keep giving vitamin D. After 1, many children still need it (600 IU a day).', 'Iron now comes from food: meat, beans, eggs and iron-fortified cereal.'] : age < 4 ? ['Give 400 IU of vitamin D every day, starting now. The label says how many drops that is.', early ? 'Ask your pediatrician for Maya’s iron dose. Babies born early usually start at about 1 month.' : 'At the 4-month checkup, ask your pediatrician for Maya’s iron dose.'] : ['Keep giving 400 IU of vitamin D every day through the first year.', early ? 'Keep giving iron drops, usually until 12 months.' : 'Give iron drops until iron-rich foods are going well. Ask at the next checkup when to stop.'])
          + (meth() === 'both' ? tip('Breast milk and formula?', 'Keep giving vitamin D until Maya drinks about 32 oz of formula a day.') : ''))
        + (!f || early ? `<h2 class="hub-h2">${F('How to give drops')}</h2>` + (window.hubFigure ? hubFigure('drops', cat, 'Mix the drops into about an ounce of milk, give that small bottle first, then the usual feed.') : '')
          + tip(meth() === 'nurse' ? 'No bottles? Easy' : 'Or straight from the dropper', (meth() === 'nurse' ? 'Put the drop on your nipple just before a feed, or squirt it slowly inside {p} cheek. ' : 'Squirt it slowly inside {p} cheek, not toward the back of the throat. ') + 'If {s} {spit|spits} up afterward, don’t give another dose.') : '')
        + note('Once solids start, iron-rich foods like meat, beans and iron-fortified oatmeal help too.'), 'drop');
    }
    if (id === 'bottles') {
      return detail(cat, 'Milk feeds', 'Make bottles safely', 'Formula is carefully balanced, so how you mix it matters.',
        hubIconSteps([['hand', 'Clean hands and bottles', 'Nipples too'], ['bottle', 'Mix it exactly', 'As the label says. Never add extra water.'], ['clock', 'Use within an hour', 'Then throw away what’s left']], cat, 'Wash your hands and bottles, mix exactly as the label says without extra water, and use it within an hour of starting a feed.') + tip('Warming', 'Room temperature is fine. If you warm it, use warm water, never the microwave.'), 'bowl');
    }
    if (id === 'pacing') {
      return detail(cat, 'Milk feeds', 'Pace Maya’s bottles', 'Paced feeding lets {o} drink at {p} own speed, a bit like nursing.',
        figure('pace', cat, 'Paced: baby upright with the bottle level. Avoid: baby lying back with the bottle tipped up.') + steps(['Hold Maya fairly upright and the bottle level, so milk fills just the tip.', 'Pause every few minutes and let {o} take a break.', 'Stop when {s} {turn|turns} away or slows down, even if there’s milk left.']) + tip('Never prop a bottle', 'Always hold Maya and the bottle during a feed.'), 'bowl');
    }
    if (id === 'lumpy') {
      return detail(cat, 'Solids', 'Make food a little lumpier', 'Moving to thicker food now helps Maya learn to chew and makes family food easier later.',
        hubStageStrip({ title: 'Textures across the year', items: [['bowl', 'Smooth', 'About 6 months'], ['bowl', 'Mashed, with lumps', '7–8 months'], ['hand', 'Soft pieces', '8–10 months'], ['plate', 'Family food, cut small', '10–12 months']], nowIndex: age < 7 ? 0 : age < 8 ? 1 : age < 10 ? 2 : 3, cat, caption: 'Textures go from smooth at about 6 months, to mashed with lumps, to soft pieces, to family food cut small by 10 to 12 months.' })
        + steps(['Start with foods {s} already {like|likes}, mashed with a fork instead of blended.', 'Leave small soft lumps, and make it a little thicker each week.', 'Let {o} hold a spoon too, even if most of it ends up on the tray.']) + tip('Gagging is part of learning', 'A little gagging as {s} {try|tries} new textures is normal. Stay calm and let {o} work it out.'), 'bowl');
    }
    if (id === 'finger') {
      return detail(cat, 'Solids', 'Offer soft finger foods', 'Picking up food is great practice for little hands, and lets Maya feed {r}.',
        figure('sizes', cat, 'From 6 to 8 months, strips the size of a finger. From 9 months, pea-sized pieces, with grapes quartered.') + steps(['Start with strips about the size of your finger, which are easy to grab with a whole hand.', 'Once {s} can pinch with thumb and finger, usually around 9 months, cut food into pea-sized pieces.', 'Quarter round foods like grapes and cherry tomatoes lengthwise, at every age.']) + tip('Is it soft enough?', 'It should squash easily between your thumb and finger.')
        + `<h2 class="hub-h2">${F('Good finger foods to try')}</h2><div class="hub-skip-chips is-good">${['Ripe banana', 'Avocado', 'Soft-cooked carrot or sweet potato', 'Steamed broccoli', 'Scrambled egg', 'Shredded chicken', 'Soft tofu', 'Pasta', 'Toast strips with a thin spread', 'Ripe pear or peach', 'Blueberries, squashed', 'Beans, mashed a little'].map(t => `<span>${F(t)}</span>`).join('')}</div>`
        + chokeCard()
        + video('See how to cut dozens of foods', 'Solid Starts', 'https://www.solidstarts.com/safe-food-sizes-shapes-for-babies/', 'Guide'), 'avocado');
    }
    if (id === 'cup') {
      return detail(cat, 'Solids', 'Practice with an open cup', 'Sipping from a cup takes practice, and starting early makes the bottle-to-cup switch easier later.',
        steps(['Pour a little water into a small open cup.', 'Hold it to Maya’s lips and let {o} take a sip.', 'Offer it at meals. Spills are part of it.']) + tip('How much water?', 'About 4–8 oz a day is plenty. Milk is still the main drink.'), 'cup');
    }
    if (id === 'day') {
      return detail(cat, 'Family meals', 'What a day of meals looks like', 'Here’s one example to work from. Every family’s day looks a little different.',
        hubDayMarkers({ title: 'An example day', events: [[7 * 60, 'bottle', nursing() ? 'Wake up: nursing' : m() >= 12 ? 'Wake up: 4–6 oz milk in a cup' : 'Wake up: 6–8 oz milk'], [8 * 60, 'oats', 'Breakfast: oatmeal with mashed fruit'], [10 * 60, 'avocado', 'Snack: soft fruit or yogurt'], [12 * 60, 'lentils', 'Lunch: soft veggies and beans or meat'], [15 * 60, 'bottle', nursing() ? 'Afternoon: nursing' : m() >= 12 ? 'Afternoon: 4–6 oz milk, plus a snack' : 'Afternoon: 6–8 oz milk, plus a snack if hungry'], [17 * 60 + 30, 'plate', 'Dinner: a small portion of yours'], [19 * 60, 'moon', nursing() ? 'Bedtime: nursing' : m() >= 12 ? 'Bedtime: 4–6 oz milk, then brush teeth' : 'Bedtime: 6–8 oz milk, then brush teeth']], cat, caption: 'An example day of meals: milk on waking, breakfast, a snack, lunch, milk in the afternoon, dinner and milk at bedtime.' }) + tip('Light days are normal', 'Appetite goes up and down. Growth at checkups tells you more than any one meal.'), 'plate');
    }
    if (id === 'family') {
      return detail(cat, 'Family meals', 'Share your family’s food', 'Most of what you eat can work for Maya with a couple of small changes.',
        steps(['Set {p} portion aside before you add salt or spicy sauces.', 'Cut it into soft, small pieces or mash it a little.', 'Sit down together when you can. Watching you eat is how {s} {learn|learns}.']) + tip('Keep skipping, even after 1', 'Whole nuts, popcorn, whole grapes and hard raw vegetables are choking risks for years.'), 'plate');
    }
    if (id === 'milk12') {
      return nursing()
        ? detail(cat, 'Family meals', 'Keep nursing, or wean', '',
            qa([['Do we have to stop nursing at 1?', 'No', 'Many families keep nursing well past the first birthday.'],
              ['Can {s} have cow’s milk too?', 'Yes, up to 16 oz a day', 'Whole milk from a cup, alongside nursing. Water between meals.']])
            + `<h2 class="hub-h2">${F('If you’d like to wean')}</h2>` + steps(['Drop one feed every week or so, starting with the one {s} {care|cares} least about.', 'Offer a snack, a cup of milk or a cuddle at that time instead.', 'Keep the bedtime and morning feeds until last. They’re usually the hardest to give up.'])
            + tip('Go easy on yourself', 'Weaning can stir up big feelings, and sometimes low mood. Slow and gradual is gentler on your body too.')
            + tip('Ask at the checkup', 'Your pediatrician can talk through vitamin D and iron at the 12-month checkup.'), 'cup')
        : detail(cat, 'Family meals', m() >= 12 ? 'Switching to whole milk' : 'Plan the milk change at 12 months', '',
          qa([['When do we switch from formula?', 'At 12 months', 'Whole cow’s milk replaces formula, and cups replace bottles.'],
            ['How much milk?', '16–24 oz a day', 'No more than 24, or it fills {o} up and lowers iron.'],
            ['Which milk?', 'Whole milk', 'Until 2, unless your pediatrician says otherwise.']])
          + `<h2 class="hub-h2">${F('Making the switch')}</h2>` + steps([meth() === 'both' ? 'Swap formula bottles for whole cow’s milk. Nursing can carry on alongside.' : 'Swap formula for whole cow’s milk. You can switch straight over.', 'Picky about the taste? Mix it half and half with formula for a week, then all milk.', 'Offer milk in an open or straw cup with meals and snacks, and water in between.']) + tip('No rush on the bottle', 'Phasing it out by about 18 months is fine. The bedtime bottle usually goes last.'), 'cup');
    }
    if (id === 'after') {
      // Nursing families: no bottles to swap, so the page is about cow's milk and cups.
      if (meth() === 'nurse') return detail(cat, 'After the first birthday', 'Cow’s milk, from a cup', 'From 12 months, whole cow’s milk can be a drink alongside nursing. There’s no need to stop nursing.',
        steps(['Offer a little whole cow’s milk in an open or straw cup with a meal or snack.', 'Build up slowly, to no more than about 16 oz a day alongside nursing.', 'Keep nursing as much or as little as works for you both.']) + tip('Already using a cup?', 'Water from a cup has been fine since about 6 months, so this is just a new drink in a familiar cup.'), 'cup');
      return detail(cat, 'After the first birthday', 'Bottles to cups', 'Most babies move off bottles between 12 and 18 months. Water from a cup is already fine from about 6 months, so cups won’t be new.',
        hubStageStrip({ title: 'Swap one bottle at a time', items: [['sun', 'Midday bottle', 'Goes first'], ['cup', 'The next one', 'A week or so later'], ['moon', 'Bedtime bottle', 'Usually goes last']], cat, caption: 'Swap the midday bottle for a cup first, then another every week or so. The bedtime bottle usually goes last.' })
        + tip('How much milk', 'If you’re using cow’s milk, about 16–24 oz a day from a cup is plenty.') + (meth() === 'bottle' ? '' : tip('Nursing is different', 'There’s no need to stop nursing at 12 months. Keep going for as long as it works for you both.')), 'cup');
    }
    if (id === 'faq') {
      const key = arg || STAGE_KEYS[C().CFG.Feeding.stage(age)], Q = C().DATA.Feeding.DEC[key] || [];
      return detail(cat, C().DATA.Feeding.CH[STAGE_KEYS.indexOf(key)]?.rail || 'Feeding', 'What other parents ask', '', `<section class="common-questions hub-faq">${Q.map((q, i) => C().question(cat, key, i, q)).join('')}</section>`);
    }
    return C().sub(cat, id, arg);
  }

  // Safe sleep reads in order. Setup tasks you finish once get a checkbox; habits you do every time don't.
  const SLEEP_SETUP = [
    { t: 'Get a firm, flat crib or bassinet', s: 'A fitted sheet and nothing else: no bumpers, loungers, inclined or weighted products', art: 'crib', task: 0 },
    { t: 'Set it up in your room', s: 'Room-sharing is recommended for at least 6 months', art: 'home', task: 1 },
    { t: 'A swaddle or sleep sack, not blankets', s: 'Swaddle until the first try to roll. Light and unweighted', art: 'sack', task: 2 },
    { t: 'Put Maya on {p} back for every sleep', s: 'Naps and nights, every time', art: 'back', habit: 'Every sleep' },
    { t: 'Only in {p} own sleep space', s: 'Never a sofa, armchair or your bed. If you might doze off holding {o}, put {o} down first', art: 'sofa', habit: 'Always' },
    { t: 'Move {o} after the car seat or swing', s: 'They aren’t for sleep', art: 'car', habit: 'Every time' },
    { t: 'Cool and smoke-free', s: 'Sweaty neck or chest means too warm', art: 'home', habit: 'Always' },
    { t: 'Offer a pacifier, if you like', s: 'Once feeding’s going well. It lowers SIDS risk', art: 'pacifier', habit: 'If you like' }
  ];
  const SLEEP_TASKS = SLEEP_SETUP.filter(x => x.task != null).length;
  const sleepTaskOn = i => !!(L().safe && L().safe.Sleep && L().safe.Sleep[i]);
  window.chgSafeTotal = (base => cat => cat === 'Sleep' ? SLEEP_TASKS : base(cat))(window.chgSafeTotal);
  window.chgSafeRemaining = (base => cat => cat === 'Sleep' ? SLEEP_SETUP.filter(x => x.task != null && !sleepTaskOn(x.task)).length : base(cat))(window.chgSafeRemaining);
  function mixedList(items, isOn, onclick, cat) {
    return `<div class="hub-ticks">${items.map(x => x.task != null
      ? `<button class="hub-tick ${isOn(x.task) ? 'is-on' : ''}" role="checkbox" aria-checked="${isOn(x.task)}" onclick="${onclick(x.task)}"><span class="hub-tick-art">${art(x.art, cat)}</span><span class="hub-row-copy"><b>${F(x.t)}</b><small>${F(x.s)}</small></span><span class="hub-tick-box" aria-hidden="true">${isOn(x.task) ? '✓' : ''}</span></button>`
      : `<div class="hub-tick is-habit"><span class="hub-tick-art">${art(x.art, cat)}</span><span class="hub-row-copy"><b>${F(x.t)}</b><small>${F(x.s)}</small></span><span class="hub-chip">${F(x.habit)}</span></div>`).join('')}</div>`;
  }

  /* ---------- sleep facts ---------- */
  const SLEEP_KEYS = ['clock', 'daynight', 'rhythm', 'two'];
  const rolled = () => answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways', 'Trying to roll'].includes(answers.rollDirection);
  const swaddleDue = () => (rolled() || m() >= 3) && answers.swaddleStopped !== 'Yes' && answers.crawl !== 'Yes' && answers.pullUp !== 'Yes' && (m() <= 6 || answers.swaddleStopped === 'No');
  const mattressLowestDue = () => (answers.pullUp === 'Yes' || m() >= 8) && answers.mattressLowest !== 'Yes';
  const mattressDue = () => !mattressLowestDue() && (m() >= 5 || answers.sit === 'Yes') && answers.mattressLowered !== 'Yes' && answers.mattressLowest !== 'Yes';
  const safeOn = i => !!(L().safe && L().safe.Sleep && L().safe.Sleep[i]);
  const safeDone = () => SLEEP_SETUP.filter(x => x.task != null && sleepTaskOn(x.task)).length;
  function sleepGlance(key) {
    return {
      clock: [['Naps', 'No pattern', 'Sleep comes and goes all day'], ['Wake window', '45–60 min', 'Between sleeps'], ['Bedtime', 'Not yet', 'Day and night are mixed up'], ['Total sleep', '14–17 hours', 'Including naps']],
      daynight: [['Naps', '4–5 a day', 'Short and frequent'], ['Wake window', '1–1½ hours', 'Between sleeps'], ['Bedtime', 'Often late', 'Moves earlier at 3–4 months'], ['Total sleep', '14–17 hours', 'Including naps']],
      rhythm: [['Naps', '3 a day', 'The last is a short catnap'], ['Wake window', '2–2½ hours', 'Between sleeps'], ['Bedtime', '7–8 pm', 'Most nights'], ['Total sleep', '12–16 hours', 'Including naps']],
      two: [['Naps', '2 a day', 'Morning and afternoon'], ['Wake window', '2½–4 hours', 'Between sleeps'], ['Bedtime', '7–8 pm', 'Most nights'], ['Total sleep', m() >= 12 ? '11–14 hours' : '12–16 hours', 'Including naps']]
    }[key];
  }
  const NIGHT = {
    clock: 'Expect to be up for feeds a few times a night for now.',
    daynight: 'Once your pediatrician says it’s OK, let Maya wake you for feeds. Most babies still feed 2–3 times a night.',
    rhythm: 'Many babies still feed 1–2 times a night. Check with your pediatrician before dropping one.',
    two: 'Some babies still feed at night with two naps, and that’s fine. Ask your pediatrician before dropping a night feed.'
  };
  const nightCard = (key, isNow = true) => { const head = F(isNow && C().live() ? 'Naps and sleep now' : isNow ? 'Naps and sleep at this age' : 'Naps and sleep at this stage'); return key === 'clock' || key === 'daynight' ? `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${head}</b></span>${tiles(sleepGlance(key))}<span class="hub-card-note" id="sleep-night-note"><b>${F('At night')}</b> ${F(NIGHT[key])}</span></section>` : `<button class="hub-card hub-glance" onclick="${go('chg:Sleep:d:day:' + SLEEP_KEYS.indexOf(key))}"><span class="hub-card-head"><b>${head}</b><small class="hub-card-cta">${F('Example day')} ›</small></span>${tiles(sleepGlance(key))}<span class="hub-card-note"><b>${F('At night')}</b> ${F(NIGHT[key])}</span></button>`; };
  const swaddleRow = (r = row) => swaddleDue() ? r({ icon: 'sack', cat: 'Sleep', title: rolled() ? 'Stop swaddling now' : 'Stop swaddling at the first try to roll', sub: rolled() ? (answers.rollDirection === 'Trying to roll' ? 'Now that Maya’s trying to roll, use a sleep sack' : 'Now that Maya’s rolling, use a sleep sack') : 'Switch to a sleep sack that leaves the arms free', chipText: rolled() ? 'Do now' : 'Must know', chipTone: 'is-red', onclick: go('chg:Sleep:d:swaddle') }) : null;
  const mattressRow = (r = row) => mattressLowestDue() ? r({ icon: 'shield', cat: 'Sleep', title: 'Set the crib mattress to its lowest', sub: answers.pullUp === 'Yes' ? 'Now that Maya pulls up, use the lowest setting' : 'Before {s} {pull|pulls} up, use the lowest setting', chipText: 'Do now', chipTone: 'is-red', onclick: go('chg:Sleep:d:mattress') })
    : mattressDue() ? r({ icon: 'shield', cat: 'Sleep', title: 'Lower the crib mattress', sub: answers.sit === 'Yes' || answers.pullUp === 'Yes' || answers.crawl === 'Yes' ? (answers.pullUp === 'Yes' ? 'Now that Maya pulls up' : answers.crawl === 'Yes' ? 'Now that Maya crawls' : 'Now that Maya sits') + ', set it to the lowest setting' : 'Lower it before {s} can sit, and lowest before {s} pulls up', chipText: 'Do now', chipTone: 'is-red', onclick: go('chg:Sleep:d:mattress') }) : null;
  // One fixed name for the sleep-training page, whatever was picked inside it, so the row always says what's behind it.
  const teethCopy = () => answers.hasTooth === 'Yes' || m() >= 7 ? 'Now with brushing teeth after the last feed' : 'A few steps, the same every night';
  // How sleep changes across the four stages, one row per big change, cells spanning the stages they cover.
  // The same chart on every stage; the stage being viewed is highlighted. AAP: feeding gaps, swaddling, sleep training from 4–6 months; Mayo Clinic: night stretches, naps.
  function sleepChart(view) {
    const heads = ['Newborn', 'Longer nights', 'Three naps', 'Two naps'];
    const rows = [
      ['Night feeds', [[0, 1, 'Wake to feed', 'First ~2 weeks'], [1, 4, 'Let {o} wake you']]],
      ['Longest stretch', [[0, 1, '2–3 hours'], [1, 2, 'Getting longer'], [2, 4, '5 hours or more']]],
      ['Swaddle', [[0, 2, 'Swaddle, if you like'], [2, 4, 'Sleep sack', 'From the first roll']]],
      ['Naps and bedtime', [[0, 1, 'Follow cues'], [1, 2, 'Start a routine'], [2, 4, 'Set times', 'Bedtime 7–8 pm']]],
      ['Naps a day', [[0, 1, 'Many'], [1, 2, '4–5'], [2, 3, '3'], [3, 4, '2']]],
      ['Sleep training', [[0, 2, 'Not yet'], [2, 4, 'An option', 'If you want it']]]
    ];
    const head = heads.map((t, i) => `<span class="${i === view ? 'is-on' : ''}">${F(t)}</span>`).join('');
    const body = rows.map(([label, cells]) => `<b class="hub-sc-label">${F(label)}</b>` + cells.map(([a, b, t, sub]) => `<span class="hub-sc-cell ${view >= a && view < b ? 'is-on' : ''}" style="grid-column:${a + 1} / ${b + 1}">${F(t)}${sub ? `<small>${F(sub)}</small>` : ''}</span>`).join('')).join('');
    return `<h2 class="hub-h2">${F('How sleep changes')}</h2><section class="hub-card hub-schart" role="table" aria-label="${F('How sleep changes from newborn to two naps')}"><div class="hub-sc-grid"><div class="hub-sc-head">${head}</div>${body}</div></section>`;
  }
  // Four fixed categories on every stage, so parents always know where to look and can see what's different now:
  // Night sleep · Naps · Routine · Safe sleep. Each row's title is this stage's answer. (AAP; Mayo Clinic.)
  // Sleep bars: what a night or a day actually looks like, row by row, so a parent sees the change instead of reading it.
  // rows: [label, segments [[from, to, kind]], marks [hour], isNow]; hours can run past 24 for nights. kinds: night, nap, awake.
  function sleepBars({ title, from, to, ticks, rows, key, caption }) {
    const pct = t => ((t - from) / (to - from) * 100).toFixed(2);
    const bar = ([label, segs, marks = [], now]) => `<div class="hub-sb-row${now ? ' is-now' : ''}"><span class="hub-sb-label">${F(label)}${now ? `<em>${F('Maya')}</em>` : ''}</span><div class="hub-sb-bar">${segs.map(([a, b, k, t]) => `<i class="is-${k}" style="left:${pct(a)}%;width:${(pct(b) - pct(a)).toFixed(2)}%">${t ? `<span>${F(t)}</span>` : ''}</i>`).join('')}${marks.map(t => `<b style="left:${pct(t)}%"></b>`).join('')}</div></div>`;
    return `<figure class="hub-figure hub-sb" role="img" aria-label="${F(caption)}"><b class="hub-fig-title">${F(title)}</b>${rows.map(bar).join('')}<div class="hub-sb-scale"><span></span><div>${ticks.map(([t, l]) => `<span style="left:${pct(t)}%">${l}</span>`).join('')}</div></div><div class="hub-sb-key">${key.map(([k, l]) => `<span><i class="is-${k}"></i>${F(l)}</span>`).join('')}</div></figure>`;
  }
  // Two-second pictures. counts: a row of icons per stage (wake-ups, naps); lengths: one bar per stage, labeled with its length.
  function sleepCounts({ title, rows, icon, caption }) {
    return `<figure class="hub-figure hub-counts" role="img" aria-label="${F(caption)}"><b class="hub-fig-title">${F(title)}</b>${rows.map(([label, n, note, now]) => `<div class="hub-count-row${now ? ' is-now' : ''}"><span class="hub-count-label">${F(label)}${now ? `<em>${F('Maya')}</em>` : ''}</span><span class="hub-count-icons">${Array.from({ length: n }, () => art(icon, 'Sleep')).join('')}</span><small>${F(note)}</small></div>`).join('')}</figure>`;
  }
  function sleepLengths({ title, rows, caption }) {
    const max = Math.max(...rows.map(r => r[1]));
    return `<figure class="hub-figure hub-lengths" role="img" aria-label="${F(caption)}"><b class="hub-fig-title">${F(title)}</b>${rows.map(([label, v, text, now]) => `<div class="hub-len-row${now ? ' is-now' : ''}"><span class="hub-count-label">${F(label)}${now ? `<em>${F('Maya')}</em>` : ''}</span><span class="hub-len-track"><i style="width:${(v / max * 100).toFixed(1)}%"><b>${F(text)}</b></i></span></div>`).join('')}</figure>`;
  }
  function sleepFour(key, now, view) {
    const cat = 'Sleep', age = m();
    const cr = (label, o) => row({ cat, ...o }).replace('<span class="hub-row-copy">', `<span class="hub-row-copy"><small class="hub-row-eyebrow">${F(label)}</small>`);
    const settled = answers.twoNaps === 'Yes' || age >= 10 || (now && answers.twoNaps !== 'Not yet');
    const mat = now ? mattressRow(o => o) : null, swd = now && swaddleDue() ? swaddleRow(o => o) : null;
    const safe = (mat && { ...mat, onclick: go('chg:Sleep:d:mattress') }) || (swd && { ...swd, onclick: go('chg:Sleep:d:swaddleoff') });
    const n = safeDone(), all = SLEEP_TASKS, days = (NOW - parse(profile.dob)) / 864e5;
    const R = {
      clock: [
        ['Night sleep', days < 14 ? { icon: 'bottle', title: 'Wake {o} for feeds until {s’s} back to birth weight', sub: 'After about 3 hours by day, or 4 at night', onclick: go('chg:Sleep:d:wakefeed') } : { icon: 'bottle', title: 'Back to birth weight? Let {o} wake you', sub: 'Once your pediatrician says so, often around 2 weeks', onclick: go('chg:Sleep:d:wakefeed') }],
        ['Naps', { icon: 'clock', title: 'Watch for sleepy cues, not the clock', sub: 'Wind down at the first yawn', onclick: go('chg:Sleep:d:cues') }],
        ['Routine', { icon: 'heart', title: 'Help {o} fall asleep any way that works', sub: 'Feeding, rocking or holding are all fine', onclick: go('chg:Sleep:d:settle0') }],
        ['Safe sleep', safe || { icon: 'crib', title: 'On {p} back, in {p} own space in your room', sub: n === all ? 'Safe sleep setup is done' : 'Firm, flat and empty, every sleep', chipText: n === all ? 'Done' : `${n} of ${all} set up`, chipTone: n === all ? 'is-done' : '', onclick: go('chg:Sleep:safe') }]],
      daynight: [
        ['Night sleep', age >= 3 ? { icon: 'moon', title: 'Waking more soon? The 4-month regression', sub: 'Often between 3 and 5 months, and it passes', onclick: go('chg:Sleep:d:regress') } : age < 2 ? { icon: 'sun', title: 'Days and nights mixed up?', sub: 'Bright days and dim nights sort it out, often by 6–8 weeks', onclick: go('chg:Sleep:d:daynight') } : { icon: 'moon', title: 'Let {o} sleep {p} longer stretch', sub: 'No need to wake {o} once your pediatrician says so', onclick: go('chg:Sleep:d:stretch') }],
        ['Naps', { icon: 'clock', title: 'Naps stay short and frequent', sub: age >= 3 ? 'Set times start to show up around now' : 'Set times come around 3–4 months', onclick: go('chg:Sleep:d:napsearly') }],
        ['Routine', age >= 3 ? { icon: 'moon', title: 'Start moving bedtime earlier', sub: 'Toward 7–8 pm, 15 minutes every few nights', onclick: go('chg:Sleep:d:earlybed') } : { icon: 'book', title: 'Start a short bedtime routine', sub: 'From about 6–8 weeks: a feed, a song, then down', onclick: go('chg:Sleep:d:routine') }],
        ['Safe sleep', safe || { icon: 'sack', title: 'Stop swaddling at the first try to roll', sub: 'Then a sleep sack, arms free', onclick: go('chg:Sleep:d:swaddleoff') }]],
      rhythm: age < 6 ? [
        ['Night sleep', { icon: 'moon', title: 'Waking more? It may be the 4-month regression', sub: 'It usually passes in a few weeks', onclick: go('chg:Sleep:d:regress') }],
        ['Naps', { icon: 'clock', title: 'Naps settle into set times', sub: 'When {s’s} usually sleepy', onclick: go('chg:Sleep:d:predictable') }],
        ['Routine', { icon: 'moon', title: 'Move bedtime earlier, to 7–8 pm', sub: 'Overtired babies wake more at night', onclick: go('chg:Sleep:d:earlybed') }],
        ['Safe sleep', safe || { icon: 'roll', title: 'Rolling onto {p} tummy?', sub: 'What to do before and after {s} can roll back', onclick: go('chg:Sleep:d:rolling') }]] : [
        ['Night sleep', age >= 8 ? { icon: 'moon', title: 'Night waking may come back', sub: 'New skills and missing you. Wait a few minutes before going in', onclick: go('chg:Sleep:d:nightwake') } : { icon: 'bottle', title: 'Fewer night feeds', sub: 'Many babies need one or two, some none', onclick: go('chg:Sleep:d:nightfeeds') }],
        ['Naps', { icon: 'clock', title: 'From three naps to two', sub: 'When {s} {skip|skips} the catnap most days', onclick: go('chg:Sleep:d:catnap') }],
        ['Routine', { icon: 'book', title: 'Keep the same bedtime routine', sub: 'Same steps, same order, every night', onclick: go('chg:Sleep:d:routine') }],
        ['Safe sleep', safe || (answers.mattressLowered === 'Yes' || answers.mattressLowest === 'Yes' ? { icon: 'roll', title: 'Rolling onto {p} tummy?', sub: 'What to do before and after {s} can roll back', onclick: go('chg:Sleep:d:rolling') } : { icon: 'shield', title: 'Lower the crib mattress', sub: 'Before {s} can sit on {p} own', onclick: go('chg:Sleep:d:mattress') })]],
      two: [
        ['Night sleep', { icon: 'moon', title: 'Night waking may come back', sub: 'New skills and missing you. Wait a few minutes before going in', onclick: go('chg:Sleep:d:nightwake') }],
        ['Naps', settled ? { icon: 'sun', title: 'Short naps or early mornings?', sub: 'Usually the timing, and it’s fixable', onclick: go('chg:Sleep:d:shortnaps') } : { icon: 'clock', title: 'From three naps to two', sub: 'When {s} {skip|skips} the catnap most days', onclick: go('chg:Sleep:d:catnap') }],
        ['Routine', answers.hasTooth === 'Yes' || age >= 7 ? { icon: 'tooth', title: 'Add brushing teeth to bedtime', sub: 'A rice-grain smear of fluoride toothpaste', onclick: go('chg:Sleep:d:routine') } : { icon: 'book', title: 'Keep the same bedtime routine', sub: 'Same steps, same order, every night', onclick: go('chg:Sleep:d:routine') }],
        ['Safe sleep', safe || (age >= 12 ? { icon: 'heart', title: 'A lovey is fine after 12 months', sub: 'Small and soft. No bottle in the crib', onclick: go('chg:Sleep:d:lovey') } : answers.mattressLowest === 'Yes' ? { icon: 'crib', title: 'Keep the crib bare', sub: 'No pillows, blankets or bumpers in the first year', onclick: go('chg:Sleep:safe') } : { icon: 'shield', title: 'Lower the crib mattress', sub: 'When {s} {sit|sits}, then lowest before {s} {pull|pulls} up', onclick: go('chg:Sleep:d:mattress') })]]
    }[key];
    const extra = key === 'clock' ? (swaddleDue() || answers.swaddleStopped === 'Yes' ? '' : listMore('How to swaddle safely', go('chg:Sleep:d:swaddle')))
      : key === 'daynight' ? '' : listMore('Sleep training, if you choose it', "openPage('chg:Sleep:settle')");
    return `<h2 class="hub-h2">${F('What’s different now')}</h2><div class="hub-list" id="sleep-night-feeds">${R.map(([l, o]) => cr(l, o)).join('')}</div>` + extra;
  }
  function settleRow() {
    const t = m() >= 4 ? ['Sleep training, if you choose it', 'Compare methods, or get support along the way'] : ['Sleep training, for later', 'A choice, not a must. Some families start at 4–6 months'];
    return row({ icon: 'book', cat: 'Sleep', title: t[0], sub: t[1], onclick: "openPage('chg:Sleep:settle')" });
  }
  function eventRow(cat) {
    const evs = C().CFG[cat].events(m());
    if (!evs.length) return '';
    const e = C().DATA[cat].EV[evs[0]];
    return list('Common around now', [row({ icon: cat === 'Sleep' ? 'moon' : 'clock', cat, title: e.title, sub: e.when, onclick: `openPage('chg:${cat}:e:${evs[0]}')` })]);
  }

  /* ---------- sleep summary screens ---------- */
  function sleepSummary(view, cur) {
    const key = SLEEP_KEYS[view], age = m(), now = view === cur, cat = 'Sleep';
    let h = '';
    let B = browseLinks(cat, view, cur);
    // Browsing another sleep stage: label it, same as Feeding.
    if (!now && C().live()) h += `<div class="hub-preview"><span>${view > cur ? 'Preview' : 'Looking back'} · ${F(STAGE_TABLE.Sleep.stages[view]?.age || '')}</span><button onclick="openPage('topic:Sleep')">${F('Back to Maya’s stage')}</button></div>`;
    if (key === 'clock') {
      const n = safeDone(), all = SLEEP_TASKS;
      h += hero({ eyebrow: 'Round-the-clock sleep', title: 'Short sleeps, day and night', lead: 'For now, feeds set the rhythm. Sleep comes in short stretches, and there’s no day or night pattern yet.' }) + B;
      h += nightCard(key, now);
      h += sleepFour(key, now, view);
      h += versus('Normal, or time to call?', ['Normal', 'Waking every 2–3 hours, grunts, squeaks and twitches in sleep.'], ['Call your pediatrician', 'Hard to wake for feeds, or a temperature of 100.4°F or higher. Trouble breathing: call 911.'], ['When the crying won’t stop', go('chg:Sleep:d:crying')]);
    }
    if (key === 'daynight') {
      h += hero({ eyebrow: 'Longer nights', title: 'Nights are starting to stretch', lead: 'Maya starts to tell day from night, and the first longer stretch of sleep shows up.' }) + B;
      h += nightCard(key, now);
      h += sleepFour(key, now, view);
      h += versus('Normal, or time to call?', ['Normal', 'A long stretch one night and not the next, and fussier evenings.'], ['Call your pediatrician', m() < 3 ? 'A temperature of 100.4°F or higher: call right away. Also snoring most nights, or pauses or gasps in sleep.' : 'Snoring most nights, pauses or gasps in sleep, or sleep changes with fever.']);
    }
    if (key === 'rhythm') {
      h += hero({ eyebrow: 'Three naps', title: 'Naps start happening at set times', lead: 'Sleep settles into a pattern you can plan your days around.' }) + B;
      h += nightCard(key, now);
      h += sleepFour(key, now, view);
      h += versus('Normal, or time to call?', ['Normal', 'Naps of 30–45 minutes, and a short cry between sleep cycles that settles in a few minutes.'], ['Call your pediatrician', 'Snoring most nights, pauses or gasps in sleep, fever or ear pulling, or a big change that lasts more than two weeks.']);
    }
    if (key === 'two') {
      const settled = answers.twoNaps === 'Yes' || age >= 10 || (now && answers.twoNaps !== 'Not yet');
      h += hero({ eyebrow: 'Two naps', title: settled ? 'Two naps a day' : 'Two naps are on the way', lead: settled ? 'Days settle into a morning and an afternoon nap, while new skills can stir up nights.' : 'The late catnap is on its way out, and days move toward two naps.' }) + B;
      h += nightCard(key, now);
      h += sleepFour(key, now, view);
      h += versus('Normal, or time to call?', ['Normal', 'Standing up in the crib, protest at bedtime, and a short cry in the night that settles in a few minutes.'], ['Call your pediatrician', 'Snoring most nights, pauses or gasps in sleep, fever or ear pulling, or a big change that lasts more than two weeks.']);
    }
    const D = C().DATA.Sleep, N = D.CH[view + 1], A = D.CH[view].after;
    if (N) { const a = (STAGE_TABLE.Sleep.stages[view + 1]?.age || '').replace(/^From /, ''), w = /wks/.test(a) ? '6 weeks' : a.split('–')[0] + (/months/.test(a) && !/–\d/.test(a.split('–')[0] + '–') ? ' months' : ''); h += next(`Next, usually from ${w.replace(/^(\d+)$/, '$1 months')}`, N.rail, `chgGo('chg:Sleep:s:${view + 1}')`); }
    else if (A) h += next(`After the first birthday, ${A[0]}`, A[1], go('chg:Sleep:d:after'));
    return frame(cat, view, cur, h);
  }

  /* ---------- sleep detail screens ---------- */
  function sleepDetail(id, arg) {
    if (id === 'soothe') return soothePage();
    const cat = 'Sleep', age = m(), stage = (id === 'day' || id === 'naps') && /^[0-3]$/.test(String(arg ?? '')) ? +arg : C().CFG.Sleep.stage(age), C0 = C().DATA.Sleep.CH[stage], key = SLEEP_KEYS[stage];
    // Change pages (the rows under "What's different now"): one shape for all of them.
    // A "How it changes" strip (when → the change → after, the baby's step marked), then What's happening,
    // What to do and How you'll know / Why it matters, then one visual or link only when it earns its place. (AAP; Mayo Clinic.)
    {
      const days = (NOW - parse(profile.dob)) / 864e5, mo = m();
      const strip = (items, now) => hubStageStrip({ title: 'How it changes', items, nowIndex: now, cat, caption: items.map(x => F(x[1] + ', ' + x[2])).join(', then ') });
      const page = (label, title, items, now, paras, extra = '', icon = 'moon') => detail(cat, label, title, '', (typeof items === 'string' ? items : items ? strip(items, now) : '') + `<section class="hub-moment">${paras.map(([k, v]) => `<p><b>${F(k)}</b> ${F(v)}</p>`).join('')}</section>` + extra, icon);
      const W = 'What’s happening.', D = 'What to do.', K = 'How you’ll know.', Y = 'Why it matters.';
      const P = {
        wakefeed: () => page('Night sleep', 'When you can stop waking {o} to feed', sleepCounts({ title: 'Night feeds, before and after', icon: 'bottle', rows: [['Until back to birth weight', 3, 'About 3 night feeds. You wake {o} every 3–4 hours', days < 14], ['After that', 2, 'Often fewer, as {s} {sleep|sleeps} longer and {wake|wakes} you when hungry', days >= 14]], caption: 'Until back to birth weight, about 3 feeds a night, waking baby every 3 to 4 hours. After that, baby wakes you.' }), -1,
          [[W, 'Newborns can sleep through hunger. Until Maya is back to birth weight, regular feeds matter more than long sleeps.'], [D, 'If {s} {sleep|sleeps} longer, wake {o} for a feed: after about 3 hours by day, or 4 at night.'], [K, 'Your pediatrician will tell you at a weight check, often around 2 weeks. Then {s} can wake you.']], '', 'bottle'),
        stretch: () => page('Night sleep', 'How long {s} can sleep at night', sleepLengths({ title: 'The longest stretch at night', rows: [['Newborn weeks', 3, '2–4 hours', mo < 2], ['By 3–4 months', 5, '5 hours or more', mo >= 2 && mo < 5], ['Around 6 months', 7, '6–8 hours', mo >= 5 && mo < 9], ['By 9–12 months', 10, 'Often 10 hours or more', mo >= 9]], caption: 'The longest stretch at night: 2 to 4 hours as a newborn, 5 hours or more by 3 to 4 months, 6 to 8 hours around 6 months, and often 10 hours or more by 9 to 12 months.' }), -1,
          [[W, 'As Maya grows, {s} can go longer between night feeds, so {p} longest stretch gets longer.'], [D, 'Once your pediatrician says you can stop waking {o}, let {o} sleep. Bright days and dim, quiet nights help {p} body clock put that stretch at night.'], [K, 'One stretch at night, often right after bedtime, starts lasting 4 or 5 hours.']]),
        regress: () => page('Night sleep', 'The 4-month sleep regression', sleepCounts({ title: 'Wake-ups in a night', icon: 'moon', rows: [['Before', 1, 'A long first stretch', mo < 3], ['During', 4, 'Up more often, between sleep cycles', mo >= 3 && mo < 6], ['A few weeks later', 1, 'Longer stretches again', mo >= 6]], caption: 'Before the regression, about one wake-up a night. During it, often 3 or 4. A few weeks later, back to about one.' }), -1,
          [[W, 'Around 4 months, sleep cycles mature and become more like an adult’s. Many babies wake more between cycles for a few weeks. It’s a step forward, not backward.'], [D, 'Keep doing what works: your usual routine and the help {s} {need|needs}. You don’t need to start sleep training to get through this. Give {o} a few minutes before going in, and feed {o} when {s} {seem|seems} hungry, though not every wake needs a feed. After a short nap, offer the next one sooner.'], [K, 'It often comes out of nowhere, usually between 3 and 5 months, and lasts a few weeks.']],
          `<div class="hub-card hub-looks"><b class="hub-fig-title">${F('What it can look like')}</b><ul>${['More night waking than a few weeks ago', 'Naps that end after 30–45 minutes', 'Harder to put down asleep'].map(t => `<li>${F(t)}</li>`).join('')}</ul></div>`),
        nightwake: () => page('Night sleep', 'Night waking may come back', null, -1,
          [[W, 'Crawling, pulling up and missing you can wake babies who were sleeping well. Babies also cry out between sleep cycles and settle on their own.'], [D, 'Wait a few minutes before going in. Keep it brief, dark and boring. By day, practice sitting back down from standing.'], [K, 'It starts around a new skill, or {s} {cry|cries} when you leave the room.']],
          `<h2 class="hub-h2">${F('Common reasons')}</h2>` + hubIconSteps([['stand', 'New skills', 'Practice by day. Standing? Help {o} lie down calmly'], ['heart', 'Missing you', 'Separation anxiety. More below'], ['tooth', 'Teeth or a cold', 'Comfort now, then back to your routine once {s’s} better'], ['bottle', 'Hunger or habit', 'Ask your pediatrician if night feeds are still needed']], cat, 'New skills: practice by day. Missing you: the same short goodbye. Teeth or a cold: comfort now. Hunger or habit: ask about night feeds.', false)
          + `<h2 class="hub-h2">${F('Separation anxiety')}</h2><div class="hub-card hub-looks"><b class="hub-fig-title">${F('What it can look like')}</b><ul>${['Crying as soon as you walk out', 'Waking and looking for you', 'Wanting only you at bedtime'].map(t => `<li>${F(t)}</li>`).join('')}</ul></div>`
          + `<section class="hub-moment"><p><b>${F('What to do.')}</b> ${F('Use the same short goodbye every night, like “I love you. Time to sleep.” Predictable works better than sneaking out. Keep the bedtime steps the same, and comfort {o} the way that fits your family.')}</p><p><b>${F('How long it lasts.')}</b> ${F('It often starts around 8–9 months, peaks around 9–10, and can come back in the second year. It’s a sign of how attached {s} is to you.')}</p></section>`),
        nightfeeds: () => page('Night sleep', 'Fewer night feeds', [['bottle', '2–3 a night', 'Around 3 months'], ['bottle', '1–2 a night', 'Around 6 months'], ['moon', '0–1 a night', 'Later in the first year']], mo < 5 ? 0 : mo < 9 ? 1 : 2,
          [[W, 'As Maya eats more by day, {s} needs less milk at night. Many babies still feed once or twice at this age, and breastfed babies often feed more.'], [D, 'Feed {o} when {s} {wake|wakes} hungry. Ask your pediatrician before dropping a night feed on purpose.'], [K, 'Maya is growing well, takes full feeds by day, and starts sleeping through a feed on {p} own.']], '', 'bottle'),
        shortnaps: () => page('Naps', 'Short naps and early mornings', `<div class="hub-card">${tiles([['Wake window now', '2½–4 hours', 'Longest before bed'], ['Treat it as night', 'Before 6 am', 'Quiet, brief, back to bed']])}</div>`, -1,
          [[W, 'Naps under 45 minutes and wake-ups before 6 am are common. Often the timing is a little off: too little or too much awake time.'], [D, 'Check the wake window: about 2½–4 hours now, longest before bed. Keep naps and early mornings dark and quiet, since dawn light or noise can wake {o}. Before 6 am, treat it like the night: quiet, brief, back to bed. If bedtime is after 8 pm, try 15–30 minutes earlier.'], [Y, 'Overtired babies nap shorter and wake earlier. After a short nap, an earlier bedtime helps {o} catch up.']], '', 'sun'),
        lovey: () => page('Safe sleep', 'Sleep after the first birthday', null, -1,
          [[W, 'After 12 months, the risk of SIDS is much lower, and a small soft toy can become a comfort.'], [D, 'A small lovey or a light blanket is fine now. Skip pillows, bumpers and big stuffed animals. No bottle in the crib, since milk pooling on teeth causes decay.'], [Y, 'A familiar comfort object can help {o} settle on {p} own, especially when {s} {miss|misses} you at night.']], '', 'heart'),
        cues: () => page('Naps', 'Watch for sleepy cues, not the clock', `<div class="hub-card hub-two"><div><b>${F('Getting tired')}</b><p>${F('A quiet stare, yawning, rubbing eyes or turning away.')}</p></div><div><b>${F('Overtired')}</b><p>${F('Fussing, arching or crying that’s hard to settle.')}</p></div></div>`, -1,
          [[W, 'Newborns can only stay awake a short while, and there’s no nap schedule yet.'], [D, 'At the first yawn, stare or eye rub, start winding down: dim light, a feed or a cuddle, then sleep.'], [Y, 'Catching the first cue makes sleep easier for you both.']], '', 'clock'),
        daynight: () => page('Night sleep', 'Help {o} tell day from night', null, -1,
          [[W, 'Babies aren’t born knowing day from night. Light, sound and your routine teach {p} body clock.'], [D, 'By day, open the curtains, chat and play, even around naps. At night, keep lights low and feeds quiet.'], [K, 'Maya is more awake during the day, and {p} longest sleep shifts to the night.']],
          hubIconSteps([['sun', 'By day', 'Curtains open, normal noise, play'], ['moon', 'At night', 'Low light, quiet, calm feeds']], cat, 'By day, open curtains, normal noise and play. At night, low lights and quiet feeds.', false), 'sun'),
        predictable: () => page('Naps', 'Naps settle into set times', `<div class="hub-two hub-card hub-sched"><div><b>${F('Newborn weeks')}</b><p>${F('Naps any time, whenever {s} {get|gets} sleepy')}</p></div><div class="is-now"><b>${F('Around 3–4 months')}</b><p>${F('About the same times each day, like 9 am, 12:30 and 4 pm')}</p></div></div>`, -1,
          [[W, 'Most days, Maya gets sleepy at about the same times. That’s {p} nap rhythm showing up.'], [D, 'For a few days, jot down when {s} {get|gets} sleepy. Then put {o} down at those times, after a short wind-down.'], [K, 'Maya yawns or fusses at similar times each day, and naps start to land in the same spots.']], tip('Won’t settle for a nap?', 'Awake less than usual? {s} may not be tired yet, so try quiet play first. Awake longer? {s} may be overtired, so try a darker room, more help, and wind down sooner next time.'), 'clock'),
        catnap: () => page('Naps', 'From three naps to two', sleepCounts({ title: 'Naps a day', icon: 'sun', rows: [['Before', 3, 'Morning, midday and a late catnap', !(answers.twoNaps === 'Yes' || mo >= 10)], ['After', 2, 'Morning and afternoon, bedtime a bit earlier', answers.twoNaps === 'Yes' || mo >= 10]], caption: 'Three naps, including a short late catnap, become two: one in the morning and one in the afternoon.' }), -1,
          [[W, 'Between 6 and 9 months, the short late-afternoon nap starts to drop. The switch takes a week or two.'], [D, 'Move bedtime about 30 minutes earlier during the switch. After a short nap, offer the next sleep a little sooner.'], [K, 'Most days, {s} {skip|skips} the catnap or it pushes bedtime late.']],
          tip('Not sure yet?', 'Decide over several days, not one. If {s} {melt|melts} down without the catnap, offer a short one, or move bedtime earlier.'), 'clock'),
        settle0: () => page('Routine', 'Help {o} fall asleep any way that works', null, -1,
          [[W, 'Newborns need help falling asleep, and you can’t spoil a young baby.'], [D, 'Feed, rock or hold {o} to sleep, then put {o} down on {p} back in {p} own sleep space. Still fussing after a feed and a fresh diaper? Try one way of soothing for a few minutes, since switching fast can make it harder. Once a day, you can practice putting {o} down drowsy but awake. If {s} {fuss|fusses}, pick {o} up and help {o}. It’s practice, not a test.'], [Y, 'Responding quickly helps {o} feel safe. Routines and sleep habits come later.']],
          `<h2 class="hub-h2">${F('Ways to soothe')}</h2>` + hubIconSteps([['heart', 'Hold and rock', 'Skin to skin, a slow sway'], ['ear', 'Shush', 'Or steady white noise'], ['sack', 'Swaddle', 'Until the first try to roll'], ['pacifier', 'A pacifier', 'Once feeding is going well']], cat, 'Ways to soothe: hold and rock, shush or white noise, a swaddle until the first try to roll, or a pacifier.', false), 'heart'),
        routine: () => page('Routine', mo >= 4 ? 'Your bedtime routine' : 'Start a short bedtime routine', null, -1,
          mo >= 4 ? [[W, 'The same few steps every night tell Maya sleep is coming, even on busy or unsettled days.'], [D, 'Keep it to 15–20 minutes, in the same order: a bath if you like, a feed, a song or book, then down drowsy but awake.'], [Y, 'A predictable routine helps {o} settle faster, and it carries {o} through regressions, travel and teething.']]
            : [[W, 'From about 6–8 weeks, a few calm steps in the same order start to tell {o} it’s bedtime.'], [D, 'Keep it to 15–20 minutes: a bath if you like, a feed, a song or book, then down drowsy but awake.'], [K, 'Maya gets sleepy around the same time each evening, and nights start to stretch.']],
          `<h2 class="hub-h2">${F('A simple routine')}</h2>` + hubIconSteps([['bath', 'Bath', 'Optional'], ['bottle', 'Feed', answers.hasTooth === 'Yes' || mo >= 7 ? 'Then brush {p} teeth' : 'Then pajamas'], ['book', 'A song or book', 'The same one'], ['crib', 'Down drowsy but awake', 'On {p} back']], cat, 'Bath if you like, a feed, a song or book, then down drowsy but awake.', true) + (mo >= 8 ? tip('Bedtime suddenly harder?', 'If the afternoon nap ended late, try bedtime 15–30 minutes later. If {s} {protest|protests} when you leave, use the same short goodbye every night.') : ''), 'book'),
        earlybed: () => page('Routine', 'Move bedtime earlier, to 7–8 pm', sleepBars({ title: 'When {s} falls asleep, week by week', ticks: [[18, '6 pm'], [20, '8 pm'], [22, '10 pm']], from: 18, to: 22, rows: [['Now', [[20.75, 22, 'night', '8:45 pm']]], ['A week later', [[20.25, 22, 'night', '8:15 pm']]], ['In 2–3 weeks', [[19.5, 22, 'night', '7:30 pm']]]], key: [['night', 'Asleep'], ['awake', 'Awake']], caption: 'Bedtime moves from about 8:45 pm to about 7:30 pm over 2 to 3 weeks, 15 minutes every few nights.' }), -1,
          [[W, 'Once naps settle, many babies are ready for an earlier bedtime.'], [D, 'Move bedtime 15 minutes earlier every few nights until it’s around 7–8 pm. Keep the same routine.'], [Y, 'Overtired babies have a harder time falling asleep and wake more at night. Earlier often means a better night.']], '', 'moon'),
        swaddleoff: () => page('Safe sleep', answers.swaddleStopped === 'Yes' || (rolled() && !swaddleDue()) ? 'Rolling over in sleep' : 'The swaddle comes off', [['sack', 'Swaddle', 'Newborn weeks'], ['roll', 'First try to roll', 'Switch that day'], ['sack', 'Sleep sack', 'Arms free']], answers.swaddleStopped === 'Yes' ? 2 : rolled() ? 1 : 0,
          [[W, 'Babies often start trying to roll around 3–4 months, sometimes as early as 2. Once they do, a swaddle isn’t safe, because they need their arms free to push up.'], [D, 'At {p} first try to roll, switch to a sleep sack with {p} arms free. Keep putting {o} down on {p} back for every sleep.'], [K, 'Maya rocks onto {p} side or {try|tries} to flip. Once {s} can roll both ways on {p} own, it’s fine to let {o} stay on {p} tummy. Rolled over but can’t roll back yet? Turn {o} onto {p} back.']],
          `<div class="hub-actions">${answers.swaddleStopped === 'Yes' ? `<p class="hub-done">${F('Maya is in a sleep sack')} ✓</p>` : `<button class="hub-button" onclick="setAnswer('swaddleStopped','Yes')">${F('Maya’s in a sleep sack now')}</button>`}</div>`
          + tip('Skip weighted sleep sacks', 'Any sleep sack should be light and unweighted.'), 'sack'),
        rolling: () => page('Safe sleep', 'Rolling in sleep', [['roll', 'Rolls one way', 'Often onto the tummy first'], ['hand', 'Turn {o} back', 'Until {s} can roll back'], ['star', 'Rolls both ways', 'Let {o} stay']], answers.rollDirection === 'Both ways' ? 2 : rolled() ? 1 : 0,
          [[W, 'Most babies roll one way before the other, often from back to tummy first. For a while, {s} may roll over and get stuck.'], [D, 'Always put {o} down on {p} back. If {s} {roll|rolls} onto {p} tummy and can’t roll back yet, gently turn {o} onto {p} back. Give {o} lots of tummy time during the day to practice rolling both ways. Keep the crib bare, with no positioners or wedges.'], [K, 'Once {s} rolls from tummy to back and back to tummy on {p} own, you can let {o} stay in whatever position {s} {choose|chooses}.']], '', 'roll'),
        napsearly: () => page('Naps', 'Naps stay short and frequent', hubIconSteps([['bottle', 'Feed', 'When hungry'], ['eye', 'Awake a little', 'About 1–1½ hours'], ['moon', 'Sleep', 'Then it starts again']], 'Sleep', 'Days follow a loop: a feed, a little awake time, then sleep.', true), -1,
          [[W, 'Most babies this age nap 4 or 5 times a day. Some naps last 30 minutes, some 2 hours, and the times change from day to day. That’s normal for now.'], [D, 'Go by how long {s’s} been awake, not the clock. After about 1–1½ hours, start winding down at the first yawn or quiet stare. Naps in your arms, the carrier or the stroller all count.'], [K, 'Around 3–4 months, {s} {start|starts} getting sleepy at about the same times each day, and naps get longer. That’s when set nap times start to work.']], '', 'clock'),
        mattress: () => page('Safe sleep', 'Lower the crib mattress', (() => { const crib = y => `<svg viewBox="0 0 80 60" width="84" height="63" aria-hidden="true" fill="none" stroke="#46638c" stroke-width="2" stroke-linecap="round"><path d="M6 6v50M74 6v50M6 10h68"/>${[16, 26, 36, 46, 56, 64].map(x => `<path d="M${x} 10v${y - 10}"/>`).join('')}<rect x="8" y="${y}" width="64" height="7" rx="2" fill="#d9e5fc"/></svg>`; const nowI = mattressLowestDue() || answers.mattressLowest === 'Yes' ? 2 : mattressDue() || answers.mattressLowered === 'Yes' ? 1 : 0; return `<figure class="hub-figure" role="img" aria-label="${F('The crib mattress at three heights: highest for a newborn, lower before baby can sit, lowest before baby can pull up.')}"><b class="hub-fig-title">${F('Mattress height')}</b><div class="hub-crib">${[[22, 'Highest', 'Newborn weeks'], [34, 'Lower', 'Before {s} can sit'], [46, 'Lowest', 'Before {s} can pull up']].map(([y, t, w], i) => `<div class="${i === nowI ? 'is-now' : ''}">${crib(y)}<b>${F(t)}</b><small>${F(w)}</small></div>`).join('')}</div></figure>`; })(), -1,
          [[W, 'Once babies can sit and pull up, a high mattress lets them lean or climb over the rail.'], [D, 'Lower the mattress before {s} can sit on {p} own, and set it to its lowest before {s} can pull up to stand. Keep the crib bare.'], [K, 'Maya pushes up on {p} hands and knees, or almost sits on {p} own. Do it before the skill arrives.']],
          steps(['Check your crib manual for the settings.', 'Lower the mattress and check it sits firmly in place.', 'Take down mobiles, and move anything {s} could use as a step.'])
          + `<div class="hub-actions"><button class="hub-button" onclick="setAnswer('${mattressLowestDue() ? 'mattressLowest' : 'mattressLowered'}','Yes')">${F('Done')}</button></div>`, 'shield')
      };
      if (P[id] && !(id === 'swaddle')) return P[id]();
    }
    if (id === 'safe') {
      // Three groups a parent can scan: what to set up once (checkboxes counted on the stage row), what to do every sleep, and what changes as she grows.
      const done = safeDone() === SLEEP_TASKS;
      const rowOf = x => `<div class="hub-row is-static"><span class="hub-dot">${art(x.art, cat)}</span><span class="hub-row-copy"><b>${F(x.t)}</b><small>${F(x.s)}</small></span></div>`;
      return detail(cat, 'Safe sleep', 'A safe place to sleep', 'Set up the space once, then a few habits keep every sleep safe.',
        figure('crib', cat, 'A baby asleep on their back in a sleep sack, in a bare crib with a firm mattress and fitted sheet.')
        + `<h2 class="hub-h2">${F('Set up once')}</h2><div class="hub-list">${SLEEP_SETUP.filter(x => x.task != null).map(rowOf).join('')}</div>`
        + `<div class="hub-actions">${done ? `<p class="hub-done">${F('You’ve set up Maya’s sleep space')} ✓</p>` : `<button class="hub-button" onclick="hubSleepSetUp()">${F('I’ve set this up')}</button>`}</div>`
        + `<h2 class="hub-h2">${F('Every sleep')}</h2><div class="hub-list">${SLEEP_SETUP.filter(x => x.task == null).map(rowOf).join('')}</div>`
        + `<h2 class="hub-h2">${F('As Maya grows')}</h2><div class="hub-list">`
        + `<div class="hub-row is-static" id="sleep-rolling"><span class="hub-dot">${art('roll', cat)}</span><span class="hub-row-copy"><b>${F('At the first try to roll')}</b><small>${F('Stop swaddling. If {s’s} in a bassinet, move {o} to the crib.')}</small></span></div>`
        + `<div class="hub-row is-static" id="sleep-crib-height"><span class="hub-dot">${art('shield', cat)}</span><span class="hub-row-copy"><b>${F('Before {s} can sit, then pull up')}</b><small>${F('Lower the crib mattress, then set it to its lowest.')}</small></span></div></div>`, 'moon');
    }
    if (id === 'day' || id === 'naps') {
      // Naps and a typical day, for the stage being viewed. Answers first (AAP: regular sleep cycles from about 4 months; Mayo Clinic: naps get more regular with age).
      const day = C().sampleDay(C0).replace('<h3 class="chg-sample-title">', '<h3 class="chg-sample-title hub-h2">');
      const Q = key === 'two' ? null : [['When do naps become predictable?', 'Around 3–4 months', key === 'rhythm' ? 'That’s about now, so it’s a good time to set a rhythm.' : 'Before that, sleep follows feeds, not the clock.'],
        ['How do I know {s’s} ready?', 'Sleepy at the same times', 'Most days, {s} {get|gets} tired around the same times, and naps last longer.']];
      return detail(cat, C0.rail, key === 'clock' || key === 'daynight' ? 'Naps for now' : 'Nap schedule', '',
        (key === 'clock' || key === 'daynight' ? hubIconSteps([['bottle', 'Feed', 'When hungry'], ['eye', 'Awake a little', key === 'clock' ? '45–60 minutes' : '1–1½ hours'], ['moon', 'Sleep', 'Then it starts again']], cat, 'Days follow a loop: a feed, a little awake time, then sleep.', true) : `<div class="hub-card hub-dayplan">${day}</div>` + steps(['Treat the times as a guide. Follow {p} sleepy cues, and expect days to shift by half an hour.', 'After a short nap, offer the next sleep a little sooner.', 'The last stretch before bed is usually the longest.'])), 'clock');
    }
    if (id === 'cues') {
      return detail(cat, 'Sleep', 'Spotting sleepy cues', 'Starting to wind down at the first signs of tiredness makes it easier for Maya to settle.',
        `<div class="hub-card hub-two"><div><b>${F('Getting tired')}</b><p>${F('A quiet stare, yawning, rubbing eyes or turning away.')}</p></div><div><b>${F('Overtired')}</b><p>${F('Fussing, arching or crying that’s hard to settle.')}</p></div></div>`
        + tip('Wake windows', { clock: 'Most newborns are ready to sleep after 45–60 minutes awake.', daynight: 'Around 1–1½ hours awake is typical now.', rhythm: 'About 2–2½ hours awake is typical now, a little longer before bedtime.', two: 'About 2½–4 hours awake is typical now, longest before bedtime.' }[key]), 'clock');
    }
    if (id === 'crying') {
      // The crying curve: builds from 2 weeks, peaks at 6–8 weeks, eases by 3–4 months. A dot shows where Maya is now (adjusted age if born early).
      const wk = (() => { try { const from = parse(profile.early && profile.due ? profile.due : profile.dob); return (NOW - from) / 6048e5; } catch (e) { return -1; } })();
      const X = w => 24 + w / 16 * 272, Y = w => 108 - 80 * (0.22 + 0.78 * Math.exp(-Math.pow((w - 7) / (w < 7 ? 3 : 3.8), 2)));
      const pts = Array.from({ length: 65 }, (_, i) => i / 4).map(w => `${X(w).toFixed(1)} ${Y(w).toFixed(1)}`);
      const pal = YEAR_PALETTES[cat] || YEAR_PALETTES.Sleep;
      const curve = `<figure class="hub-figure" role="img" aria-label="Crying builds from about 2 weeks, peaks around 6 to 8 weeks and eases by 3 to 4 months."><svg viewBox="0 0 320 150" aria-hidden="true">
        <rect x="6" y="6" width="308" height="138" rx="18" fill="${pal.pale}"/>
        <path d="M${pts.join('L')}L${X(16)} 112L24 112Z" fill="${pal.bg}"/><path d="M${pts.join('L')}" stroke="${pal.ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <path d="M24 112H296" stroke="${pal.ink}" stroke-opacity=".25"/>
        ${[[0, 'Birth'], [7, '6–8 weeks'], [14, '3–4 months']].map(([w, t]) => `<text x="${X(w)}" y="130" text-anchor="${w ? 'middle' : 'start'}" font-size="11" fill="${pal.ink}" fill-opacity=".75" font-family="inherit">${t}</text>`).join('')}
        ${wk >= 4.5 && wk <= 9.5 ? '' : `<text x="${X(7)}" y="${Y(7) - 9}" text-anchor="middle" font-size="11.5" font-weight="700" fill="${pal.ink}" font-family="inherit">The peak</text>`}
        ${wk >= 0 && wk <= 16 ? `<circle cx="${X(wk)}" cy="${Y(wk)}" r="6" fill="#fff" stroke="${pal.ink}" stroke-width="3"/><text x="${Math.min(268, Math.max(52, X(wk) + (wk < 7 ? 18 : -18)))}" y="${Y(wk) + 26}" text-anchor="middle" font-size="11.5" font-weight="700" fill="${pal.ink}" font-family="inherit">${F('Maya now')}</text>` : ''}
      </svg></figure>`;
      return detail(cat, 'The early months', 'When the crying won’t stop', 'Crying usually builds from about 2 weeks, peaks around 6–8 weeks and eases by 3–4 months. Some evenings nothing works, and that isn’t your fault.',
        curve +
        hubIconSteps([['diaper', 'Check the basics', 'Hungry, wet, too warm or cold, or overtired'], ['heart', 'Hold {o} close', 'Skin to skin, a slow walk or gentle rocking'], ['music', 'A steady sound', 'Shushing, white noise or a soft song'], ['pacifier', 'Something calming', (rolled() || m() >= 3 || answers.swaddleStopped === 'Yes' ? 'A pacifier, or a calm, dim room' : 'A pacifier, or a swaddle if {s} {is}n’t rolling yet')]], cat, 'Check the basics, hold baby close, try a steady sound, then offer a pacifier or a calm, dim room.')
        + `<section class="hub-card hub-callout"><b>${F('If you feel overwhelmed')}</b><p>${F('Put Maya down on {p} back in the crib, close the door and take a few minutes. Call someone you trust. Crying won’t hurt Maya. Shaking can, so never shake a baby.')}</p></section>`
        + tip('When it’s more than crying', 'Call your pediatrician if the crying comes with poor feeding or vomiting, a weak or high-pitched cry, or sounds like pain.'), 'heart');
    }
    if (id === 'daynight') {
      return detail(cat, 'Longer nights', 'Helping Maya tell day from night', 'Babies aren’t born knowing the difference. Light, sound and your routine teach {o}.',
        hubIconSteps([['sun', 'By day', 'Curtains open, normal noise, play and chatter'], ['moon', 'At night', 'Low lights, quiet and calm feeds']], cat, 'By day, open curtains, normal noise and play. At night, low lights and quiet, calm feeds.', false) + tip('When it clicks', 'Most babies’ body clocks switch on around 6–8 weeks, so give it time.'), 'moon');
    }
    if (id === 'routine') {
      // Answers first: the three questions parents ask, each answered in a few words, then the how-to (AAP).
      const teeth = answers.hasTooth === 'Yes' || m() >= 7;
      const Q = [['When should we start a bedtime routine?', 'Around 6–8 weeks', 'Before that, help {o} sleep any way that works.'],
        ['How do I know {s’s} ready?', 'Nights start to stretch', 'And {s} {get|gets} sleepy around the same time each evening.'],
        ['When does bedtime move to 7–8 pm?', 'Around 3–4 months', 'Move it 15 minutes earlier every few nights until you get there.']];
      const steps4 = [['bath', 'Bath', 'Optional, a few nights a week'], ['bottle', 'Feed', teeth ? 'Then brush {p} teeth' : 'Then a fresh diaper and pajamas'], ['book', 'A song or book', 'The same one most nights'], ['crib', 'Down drowsy but awake', 'On {p} back, in {p} own sleep space']];
      return detail(cat, 'Sleep', 'Bedtime routine', '',
        qa(Q)
        + `<h2 class="hub-h2">${F('A simple routine')}</h2>` + hubIconSteps(steps4, cat, 'Bath if you like, a feed, a song or book, then down drowsy but awake.', true)
        + tip('Keep it short', 'About 15–20 minutes, in the same order every night.')
        + tip('Why an earlier bedtime helps', 'Overtired babies have a harder time falling asleep and wake more at night. Once nights stretch, an earlier bedtime often means a better night.'), 'moon');
    }
    if (id === 'swaddle' && !rolled() && m() < 3) {
      return detail(cat, 'Sleep safety', 'Swaddling safely', 'A snug swaddle can help a newborn settle. It just needs to be done the safe way, and only until {s} {try|tries} to roll.',
        hubEmbed('pJCQf2Xxlrk', 'How to swaddle a newborn', 'Mount Sinai Parenting Center')
        + `<h2 class="hub-h2">${F('How to wrap')}</h2>` + figure('swaddle', 'Sleep', 'Three steps: lay the blanket as a diamond with the top folded down, bring one side across and tuck it under, then fold up the bottom and wrap the last side, snug at the chest and loose at the hips.') + steps(['Lay a thin blanket out like a diamond and fold the top corner down. Place Maya on {p} back with {p} shoulders just below the fold.', 'Hold one arm straight at {p} side, bring that side of the blanket across {p} chest and tuck it under {p} back.', 'Fold the bottom corner up loosely over {p} feet, leaving room for {p} legs to bend.', 'Bring the last side across and tuck it under {o}. Snug at the chest, loose at the hips.'])
        + `<h2 class="hub-h2">${F('Keep it safe')}</h2>` + steps(['Snug around the chest, with room for two fingers between the blanket and {p} chest.', 'Loose around the hips, so {p} legs can bend up and out like a frog.', 'Always on {p} back, never on {p} tummy or side.'])
        + tip('Stop at the first attempt to roll', 'Some babies try as early as 2 months, most between 3 and 6. Switch to a sleep sack that leaves the arms free.')
, 'moon');
    }
    if (id === 'swaddle') {
      return detail(cat, 'Sleep safety', 'Stop swaddling at the first attempt to roll', 'A swaddled baby who rolls onto {p} tummy can’t use {p} arms to move. So once rolling starts, the swaddle stops.',
        steps(['Switch to a sleep sack or wearable blanket that leaves the arms free.', 'Keep putting Maya down on {p} back.', 'If {s} {roll|rolls} over on {p} own both ways, you can leave {o} that way.'])
        + `<div class="hub-actions">${answers.swaddleStopped === 'Yes' ? `<p class="hub-done">${F('Maya is in a sleep sack')} ✓</p>` : `<button class="hub-button" onclick="setAnswer('swaddleStopped','Yes')">${F('Maya’s in a sleep sack now')}</button>`}</div>` + tip('Skip weighted sleep sacks', 'Any sleep sack should be light and unweighted.'), 'moon');
    }
    if (id === 'mattress') {
      const lowest = mattressLowestDue();
      return detail(cat, 'Sleep safety', lowest ? 'Set the crib mattress to its lowest' : 'Lower the crib mattress', lowest ? 'Once Maya can pull up, a higher mattress makes it easier to tip over the rail.' : 'Once Maya can sit, {s} can lean over the rail. Moving the mattress down keeps {o} safe.',
        steps(lowest ? ['Move the mattress to the lowest setting in your crib manual.', 'Take down mobiles and anything {s} can reach from standing.', 'Check nothing nearby could be used as a step.'] : ['Find the next setting down in your crib manual.', 'Lower the mattress and check it sits firmly in place.', 'Plan to go all the way down before {s} {pull|pulls} up.'])
        + `<div class="hub-actions"><button class="hub-button" onclick="setAnswer('${lowest ? 'mattressLowest' : 'mattressLowered'}','Yes')">Done</button></div>`, 'shield');
    }
    // Where baby sleeps: bassinet to crib, and when to move rooms. AAP: room-share, on a separate sleep surface, ideally for the first 6 months.
    if (id === 'nightwake') {
      // Night waking after 6 months: common reasons, what helps, and when to call (AAP).
      return detail(cat, 'Sleep', 'Waking at night', '',
        qa([['Is it normal to still wake at night?', 'Yes, very common', 'Many babies wake once or twice a night, even after sleeping through for a while.'],
          ['What helps most?', 'Wait a few minutes', 'Babies often cry out between sleep cycles, then settle on their own. If not, keep it brief, dark and boring.']])
        + `<h2 class="hub-h2">${F('Common reasons')}</h2>` + hubIconSteps([['stand', 'New skills', 'Practicing standing or crawling, even half asleep'], ['heart', 'Missing you', 'Separation anxiety peaks around 8–10 months'], ['tooth', 'Teeth or a cold', 'Discomfort wakes {o} up'], ['bottle', 'Habit or hunger', 'Ask your pediatrician if night feeds are still needed']], cat, 'New skills, missing you, teeth or a cold, or habit and hunger.', false)
        + `<h2 class="hub-h2">${F('What helps')}</h2>`
        + steps(['Keep it brief: a pat, a few quiet words, then out.', 'Stuck standing? Practice sitting back down during the day.', 'Respond the same way each time, so {s} {know|knows} what to expect.'])
        + versus('Normal, or time to call?', ['Normal', 'One or two wakings a night that settle with a little help.'], ['Call your pediatrician', 'Snoring, pauses in breathing, fever or ear pulling, or a big change that lasts more than two weeks.']), 'moon');
    }
    if (id === 'where') {
      return detail(cat, 'Sleep', 'Where Maya sleeps', 'In your room for the first 6 months, in {p} own sleep space. After that, where {s} {sleep|sleeps} is your family’s call.',
        hubWindowBar({ title: 'In your room, in {p} own sleep space', from: 0, to: 12, zones: [[0, 6, 'Share a room', 'band'], [6, 12, 'Your call', 'calm']], ticks: [[0, 'Birth'], [6, '6 mo'], [12, '1 year']], now: (NOW - parse(profile.dob)) / 2629746e3, cat, caption: 'Keep baby in your room, in their own crib or bassinet, for the first 6 months. After that, moving to their own room is a family choice.' })
        + `<h2 class="hub-h2">${F('Bassinet to crib')}</h2>`
        + hubIconSteps([['clock', 'Check the label', 'Bassinets have a weight limit, often about 15–20 lb'], ['roll', 'Or once {s} {roll|rolls}', 'Or pushes up on hands and knees']], cat, 'Move from the bassinet to the crib at the bassinet’s weight limit, or once baby rolls or pushes up on hands and knees, whichever comes first.', false)
        + tip('Whichever comes first', 'Rolling or pushing up can tip a bassinet or carry Maya over its edge, even under the weight limit.')
        + `<h2 class="hub-h2">${F('Moving to {p} own room')}</h2>`
        + steps(['Keep the same bedtime steps, so the new room feels familiar.', 'Try naps in the new room for a few days first.', 'Set it up the same way: firm, flat and empty, on {p} back.'])
        + tip('No rush', 'Plenty of families room-share longer. Either way is fine after 6 months.')
      + `<h2 class="hub-h2">${F('Setting up the room')}</h2>` + tiles([['Temperature', 'About 68–72°F', 'Comfortable for you in a T-shirt'], ['Clothes', 'One more layer', 'Than you’d wear, or a sleep sack'], ['White noise', 'Low and steady', 'Across the room, not by the crib'], ['Light', 'Dark for night', 'A dim night light for feeds']]), 'crib');
    }
    if (id === 'catnap') {
      return detail(cat, 'Two naps', answers.twoNaps === 'Yes' || age >= 10 ? 'When a nap runs short' : 'Moving to two naps', '',
        qa([['When do three naps become two?', 'Between 6 and 9 months', 'The switch takes a week or two, and some days will look messy.'],
          ['What’s the sign?', 'Skipping the catnap', 'Most days, the late-afternoon nap is skipped or pushes bedtime late.']])
        + `<h2 class="hub-h2">${F('Making the switch')}</h2>` + steps(['Move bedtime about 30 minutes earlier during the switch.', 'After a short nap, offer the next sleep a little sooner.']) + tip('A third nap is still OK', 'On a day with short naps, a catnap can still help.'), 'clock');
    }
    if (id === 'skills') {
      return detail(cat, 'Two naps', 'Practice new skills during the day', 'Crawling and pulling up are exciting, and Maya may want to practice in the crib too.',
        steps(['Give {o} lots of floor time to practice by day.', 'Keep the bedtime routine the same.', 'If {s} {stand|stands} up in the crib, help {o} sit back down calmly, then say goodnight.']) + tip('It passes', 'Most babies settle back into sleep once the new skill feels familiar.'), 'sit');
    }
    if (id === 'after') {
      const mo = m();
      return detail(cat, 'Naps', 'From two naps to one', '', sleepCounts({ title: 'Naps a day', icon: 'sun', rows: [['Before', 2, 'Morning and afternoon', true], ['After', 1, 'One longer nap around midday']], caption: 'Two naps, morning and afternoon, become one longer nap around midday, usually between 13 and 18 months.' })
        + `<section class="hub-moment">${[['What’s happening.', 'Usually between 13 and 18 months, two naps become one. Most babies still need two at their first birthday.'], ['What to do.', 'Push the morning nap a little later every few days until it lands around lunchtime. Move bedtime a little earlier while {s} {adjust|adjusts}.'], ['How you’ll know.', 'Most days, {s} {fight|fights} the morning nap, yet {is} fine until the afternoon. Two naps after the first birthday is normal, so there’s no rush.']].map(([k, v]) => `<p><b>${F(k)}</b> ${F(v)}</p>`).join('')}</section>`, 'sun');
    }
    if (id === 'method') {
      const x = (typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [])[Number(arg)];
      if (!x) return settlePage();
      const NIGHTS = {
        'Timed check-ins': [['7:00 pm', 'Bedtime routine, then put Maya down drowsy but awake. Say goodnight and leave.'], ['If {s} {cry|cries}', 'Wait 3 minutes, then check in for a minute or two. Talk softly or pat, without picking {o} up.'], ['Still crying', 'Leave again and wait a little longer each time: 5 minutes, then 10.'], ['Night wakes', 'Feed if it’s time for a feed. Otherwise use the same check-ins.'], ['Next nights', 'Start the waits a few minutes longer than the night before.']],
        'Chair method': [['Nights 1–3', 'Sit in a chair right by the crib. Comfort with your voice or a hand until Maya falls asleep.'], ['Nights 4–6', 'Move the chair halfway to the door. Comfort with your voice more than touch.'], ['Nights 7–9', 'Move the chair to the doorway.'], ['After that', 'Say goodnight from outside the door.'], ['Night wakes', 'Go back to wherever the chair is that night.']],
        'Pick up, put down': [['7:00 pm', 'Bedtime routine, then put Maya down drowsy but awake.'], ['If {s} {cry|cries}', 'Pick {o} up and hold {o} until {s’s} calm, but not asleep.'], ['Then', 'Put {o} back down. Repeat as many times as it takes.'], ['Night wakes', 'Feed if it’s time for a feed, then the same pick up and put down.'], ['Good to know', 'The first nights can take many repeats. It gets quicker.']],
        'Cry it out': [['7:00 pm', 'Bedtime routine, then put Maya down awake. Say goodnight and leave.'], ['If {s} {cry|cries}', 'Don’t go back in until morning, unless it’s a planned feed or {s} {seem|seems} unwell.'], ['First nights', 'Crying can last a while at first.'], ['By night 3 or 4', 'Most babies cry much less and fall asleep faster.']],
        'Bedtime fading': [['First', 'Notice when Maya naturally falls asleep, say 8:30 pm.'], ['Nights 1–2', 'Start the bedtime routine so {s’s} in the crib at 8:30, when {s’s} truly sleepy.'], ['Once {s} {settle|settles} quickly', 'Move bedtime 15 minutes earlier.'], ['Repeat', 'Keep stepping earlier every couple of nights until you reach the bedtime you want.']]
      };
      const night = NIGHTS[x.name];
      const nightHtml = night ? `<h2 class="hub-h2">${F('What a night might look like')}</h2><div class="hub-card"><dl class="hub-timeline">${night.map(r => `<div><dt>${F(r[0])}</dt><dd>${F(r[1])}</dd></div>`).join('')}</dl></div>` : '';
      return detail(cat, 'Sleep training', x.name, x.title, `<div class="hub-card"><p class="hub-body">${esc(x.description)}</p></div>` + nightHtml + tip('Before you start', 'Check with your pediatrician, keep any night feeds {s} still {need|needs}, and pick a response every caregiver can repeat.'), 'moon');
    }
    if (id === 'faq') {
      const k = arg || key, Q = C().DATA.Sleep.DEC[k] || [];
      return detail(cat, C().DATA.Sleep.CH[SLEEP_KEYS.indexOf(k)]?.rail || 'Sleep', 'What other parents ask', '', `<section class="common-questions hub-faq">${Q.map((q, i) => C().question(cat, k, i, q)).join('')}</section>`);
    }
    return C().sub(cat, id, arg);
  }

  /* ---------- come-and-go phases (both categories) ---------- */
  function eventDetail(cat, i) {
    const e = C().DATA[cat].EV[i];
    if (!e) return C().mainPage(cat, null, null);
    const T = C().T;
    return `<div class="quiet-category hub-page hub-detail" data-overview="${cat}" style="${yearTheme(cat)}">${typeof detailPageTop === 'function' ? detailPageTop(cat) : ''}<div class="hub-detail-head"><span class="hub-big">${art(cat === 'Sleep' ? 'moon' : 'clock', cat)}</span><p class="hub-context">${esc(e.when)}</p><h1>${T(e.title)}</h1><p class="hub-lead">${T(e.lead)}</p></div>`
      + (() => { const mm = String(e.when).match(/(\d+)–(\d+) months/); if (!mm) return ''; const nowM = (NOW - parse(profile.dob)) / 2629746e3;
          return hubWindowBar({ title: 'When it usually shows up', from: 0, to: 12, band: [Number(mm[1]), Number(mm[2]), `${mm[1]}–${mm[2]} mo`], ticks: [[0, 'Birth'], [3, '3 mo'], [6, '6 mo'], [9, '9 mo'], [12, '12 mo']], now: nowM, cat, caption: `${e.title} usually shows up between ${mm[1]} and ${mm[2]} months.` }); })()
      + `<div class="hub-card"><div class="hub-card-head"><b>What it looks like</b></div><ul class="hub-bullets">${(e.looks || []).map(x => `<li>${T(x)}</li>`).join('')}</ul></div>`
      + `<h2 class="hub-h2">What helps</h2><div class="hub-card"><ol class="hub-steps">${(e.helps || []).slice(0, 3).map(x => `<li><span><b>${T(x[0])}.</b> ${T(x[1]).replace(/ Bottles don’t need to get bigger every time\./, cat === 'Feeding' && meth() === 'nurse' ? '' : '$&')}</span></li>`).join('')}</ol></div>`
      + (e.lasts ? `<div class="hub-tip"><b>How long it lasts</b>${T(e.lasts)}</div>` : '')
      + (e.supportNote ? `<p class="hub-note">${T(e.supportNote)}</p>` : '') + `</div>`;
  }

  /* ---------- shared sub pages ---------- */
  function firstAid() {
    // Opened from Safety, the page wears Safety's colors and header; from Feeding, Feeding's.
    const over1 = (typeof actualMonth === 'function' ? actualMonth() : m()) >= 12;
    const fromSafety = (typeof historyStack !== 'undefined' && historyStack.length && String(historyStack[historyStack.length - 1]).includes('Safety'));
    return detail(fromSafety ? 'Safety' : 'Feeding', fromSafety ? 'First aid' : 'Safety', 'If Maya is choking', 'Choking is silent: {s} can’t cry, cough or breathe. Gagging is noisy, and you can let {o} work it out.',
      `<section class="hub-card hub-versus"><div class="hub-vs" style="margin-top:0"><div><b>Gagging</b><p>${F('Coughing, sputtering, a red face. Stay calm and let {o} clear it.')}</p></div><div class="is-urgent"><b>Choking</b><p>${F('Silent, can’t cough or cry, lips turning blue. Act now.')}</p></div></div></section>`
      + `<h2 class="hub-h2">${F('What to do if {s} {is} choking')}</h2>`
      // From the first birthday, first aid for a child (abdominal thrusts) replaces the infant method (AAP, American Red Cross).
      + (over1 ? steps(['Shout for help and have someone call 911.', 'Kneel or stand behind Maya and wrap your arms around {p} waist.', 'Make a fist just above {p} belly button, thumb side in. Grab it with your other hand.', 'Give quick, firm thrusts inward and upward until the food comes out. If {s} {stop|stops} responding, call 911 and start CPR.'])
        : steps(['Shout for help and have someone call 911.', 'Lay Maya face down along your forearm, head lower than {p} chest, supporting {p} jaw. Give up to 5 firm back blows between the shoulder blades.', 'Turn {o} face up on your other arm. With 2 fingers just below the nipple line, give up to 5 quick chest thrusts.', 'Keep switching between back blows and chest thrusts until the food comes out. If {s} {stop|stops} responding, call 911 and start infant CPR.'])
          + hubEmbed('ShaNuST_58A', 'What to do when a baby is choking', 'American Red Cross'))
      + tip('Don’t sweep blindly', 'Only reach into {p} mouth if you can see the object and easily pick it out.')
      + tip('Take a class', over1 ? 'A short child first aid and CPR class lets you practice on a doll. It’s the best way to feel ready.' : 'A short infant first aid class lets you practice these steps on a doll. It’s the best way to feel ready.')
      + `<button class="hub-learned${aidDone() ? ' is-done' : ''}" onclick="chgToggleSafe('Feeding',1)" aria-pressed="${aidDone()}">${aidDone() ? '✓ You’ve learned this' : 'I’ve learned this'}</button>`
      + `<a class="hub-more" href="https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx" target="_blank" rel="noopener"><span>${F('Preventing choking, and what to do · HealthyChildren.org')}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`, 'shield');
  }
  function helpPage(cat) {
    const D = C().DATA[cat], T = C().T, tone = l => /911/.test(l) ? 'is-red' : /pediatrician/i.test(l) ? 'is-red' : '';
    const TRIAGE = cat === 'Sleep' ? [
      ['Normal', 'Waking at night through the first year, and short naps while sleep patterns are still developing.'],
      ['Keep an eye on it', 'Settling getting harder or more waking than usual. Jot down feeds and any signs of discomfort.'],
      ['Call your pediatrician', 'Snoring most nights, pauses or gasping in sleep, sleep changes with fever or poor feeding, or a newborn who’s hard to wake for feeds.'],
      ['Call 911', 'Trouble breathing, blue or gray lips, or Maya won’t wake up.']
    ] : [
      ['Normal', 'Spit-up in a happy baby who’s growing, a few days of cluster feeding, gagging while learning to eat, and an appetite that changes day to day.'],
      ['Keep an eye on it', 'Shorter feeds or a smaller appetite. Keep track of wet diapers and how Maya seems overall.'],
      ['Call your pediatrician', 'Fewer wet diapers, not back to birth weight by 2 weeks, repeated vomiting, refusing feeds or food, hives after a new food, or blood in {p} poop.'],
      ['Call 911', 'Trouble breathing, swelling of the lips or tongue after a food, choking that doesn’t clear, or Maya is limp or won’t wake.']
    ];
    const cards = TRIAGE.map(x => `<div class="hub-card hub-triage"><span class="hub-chip ${tone(x[0])}">${F(x[0])}</span><p>${F(x[1])}</p></div>`).join('');
    return detail(cat, cat === 'Sleep' ? 'Sleep' : 'Feeding', cat === 'Sleep' ? 'When to ask for sleep help' : 'When to ask for feeding help', 'Most changes are normal. Here’s how to tell when it’s worth a call.', cards
      + (cat === 'Sleep' ? tip('Look after yourself too', 'If exhaustion or low mood is getting hard to manage, talk to your own doctor, or call or text the National Maternal Mental Health Hotline: 1-833-852-6262.') : tip('Feeding is hard work', 'If nursing hurts or feeding feels overwhelming, a lactation consultant can help, and it’s often covered by insurance. Asking for help is normal.'))
      + note(cat === 'Sleep' ? 'Before a visit, jot down a few nights of bedtimes, wakes and feeds. It helps your pediatrician see the pattern.' : 'Before a visit, jot down a day of feeds and wet diapers. It helps your pediatrician see the pattern.'), cat === 'Sleep' ? 'moon' : 'bowl');
  }
  // Sleep-training methods on one scale, from the most hands-on to the least.
  function methodScale() {
    // The five approaches as rows in two groups, gentlest first. No carousel: every option is visible.
    const methods = typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [];
    const pick = ks => ks.map(k => [methods.findIndex(x => x.kind === k), methods.find(x => x.kind === k)]).filter(x => x[1]);
    const rows = ks => pick(ks).map(([i, x]) => row({ icon: 'book', cat: 'Sleep', title: x.name, sub: x.title, onclick: go('chg:Sleep:d:method:' + i) }));
    return list('More of you, more gradual', rows(['fading', 'pickup', 'chair'])) + list('Less of you, often quicker', rows(['ferber', 'extinction']));
  }
  function settlePage() {
    const age = m(), choice = C().settlingGuide();
    if (age < 4) {
      // Read ahead: the parent can learn about sleep training before it's time, without being told to start.
      const methods = typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [];
      return detail('Sleep', 'Read ahead', 'Sleep training, for later', 'Sleep training is a choice, not a must. Families who choose it can start any time from about 4–6 months. Here’s what the options look like, so you can decide ahead of time.',
        methodScale() + tip('For now', 'Feeding, rocking or holding Maya to sleep is fine. You can’t spoil a young baby.'), 'book');
    }
    return settleChoices(age);
  }
  function soothePage() {
    return detail('Sleep', 'The early months', 'Helping Maya settle', 'Feeding, rocking or holding Maya to sleep is fine while sleep patterns are still developing. You can’t spoil a young baby.',
      steps(['Start winding down at the first sleepy cues, like a quiet stare or a yawn.', 'Keep a few familiar steps: a feed, a diaper and a quiet song.', 'Put {o} down on {p} back in {p} own sleep space.']) + tip('Sleep training comes later, if at all', 'It’s an optional choice, usually considered from around 4–6 months.'), 'moon');
  }
  function settleChoices(age) {
    // One page about one choice: is it time, the approaches side by side, what to expect, and that skipping it is fine. (AAP: optional, from about 4–6 months.)
    return detail('Sleep', 'Your choice', 'Sleep training, if you choose it', 'It’s a choice, not a must. Feeding or rocking to sleep can stay if it works for your family.',
      tip('Is Maya old enough?', (profile.early ? 'Go by adjusted age. ' : '') + (age >= 7 ? 'It can work at any age from here, once your pediatrician says weight and feeding are on track.' : 'Most families who try it start between 4 and 6 months, once your pediatrician says weight and feeding are on track.') + ' Wait if {s’s} sick, or during travel or the first weeks of daycare.')
      + methodScale()
      + tip('What to expect', 'Most methods take 1–2 weeks. Pick one that fits your family and stick with it, since switching often makes it harder.')
      + tip('If a night goes badly', 'Meet hunger, discomfort or illness first, then go back to your usual response. Not easier after a week or two? Pause and talk to your pediatrician.')
      + tip('Not for you?', 'That’s fine. Keep a short bedtime routine every caregiver repeats, and help {o} fall asleep however works.'), 'book');
  }

  /* ---------- actions ---------- */
  window.hubToggleReady = i => { const r = Object.assign({}, L().ready); r[i] = !r[i]; store('ready', r); C().rerender(); };
  window.hubAllergen = k => { const a = Object.assign({}, L().allergens); a[k] = !a[k]; store('allergens', a); C().rerender(); };
  window.hubApproach = k => { store('approach', k); if (k !== 'both') store('style', k); C().rerender(); if (typeof hubToast === 'function') hubToast('Got it', { spoon: 'Tips now lead with spoon-feeding.', finger: 'Tips now lead with finger foods.', both: 'Tips now cover spoon-feeding and finger foods.' }[k]); };
  window.hubStyle = k => { store('style', k); C().rerender(); };
  window.hubSleepSetUp = () => { const st = L().safe || (L().safe = { Sleep: {}, Feeding: {} }); st.Sleep = Object.assign({}, st.Sleep, { 0: true, 1: true, 2: true }); C().save(); C().rerender(); };
  window.hubFeedingSummary = () => feedingSummary(C().CFG.Feeding.stage(m()), C().CFG.Feeding.stage(m()));

  /* ---------- routing ---------- */
  const basePage = window.changesPage, baseRoute = window.changesRoute;
  window.changesPage = function (cat) {
    if (cat === 'Feeding') { const cur = C().CFG.Feeding.stage(m()); return cur >= 3 ? solidsHub(cur) : feedingSummary(cur, cur); }
    if (cat === 'Sleep') { const cur = C().CFG.Sleep.stage(m()); return sleepSummary(cur, cur); }
    return basePage(cat);
  };
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if ((cat === 'Feeding' || cat === 'Sleep') && !screen) return window.changesPage(cat);
    if (cat === 'Feeding' && screen === 's') { const cur = C().CFG.Feeding.stage(m()), v = Number(a); if (v >= 3 && v <= 5) return feedingSummary(v, cur, true); return feedingSummary(Number.isInteger(v) && C().DATA.Feeding.CH[v] ? v : cur, cur); }
    if (cat === 'Feeding' && screen === 'd') return feedingDetail(a, b);
    if (cat === 'Feeding' && screen === 'safe') return firstAid();
    if (cat === 'Feeding' && screen === 'allergy') return feedingDetail('allergens');
    if ((cat === 'Feeding' || cat === 'Sleep') && screen === 'help') return helpPage(cat);
    if (cat === 'Sleep' && screen === 'settle') return settlePage();
    if (cat === 'Sleep' && screen === 's') { const cur = C().CFG.Sleep.stage(m()), v = Number(a); return sleepSummary(Number.isInteger(v) && C().DATA.Sleep.CH[v] ? v : cur, cur); }
    if (cat === 'Sleep' && screen === 'd') return sleepDetail(a, b);
    if (cat === 'Sleep' && screen === 'safe') return sleepDetail('safe');
    if (cat === 'Sleep' && screen === 'e') return sleepDetail(Number(a) === 0 ? 'regress' : 'nightwake');
    if ((cat === 'Sleep' || cat === 'Feeding') && screen === 'e') return eventDetail(cat, Number(a));
    return baseRoute(p);
  };
  // Building blocks shared with the other categories (js/hub-categories.js).
  window.__hub = { F, qa, row, list, hero, tiles, glanceCard, versus, next, more, note, art, chev, chip, tip, steps, video, detail, mixedList, ticks, listMore,
    pills: (label, items) => `<nav class="hub-pills" id="hub-pills" aria-label="${esc(label)}">${items.map(it => `<button class="${it.on ? 'is-on' : ''} ${it.now ? 'is-now' : ''}" onclick="${it.onclick}" ${it.on ? 'aria-current="step"' : ''}>${esc(it.label)}${it.now && !it.on ? ' <span class="hub-now">Now</span>' : ''}</button>`).join('')}</nav>` };
  window.positionHubPills = function () {
    const r = document.getElementById('hub-pills'), s = r && r.querySelector('.is-on');
    if (r && s) r.scrollLeft = s.offsetLeft - (r.clientWidth - s.offsetWidth) / 2;
  };
})();
