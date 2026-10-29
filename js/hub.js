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
  const tip = (label, text) => `<div class="hub-tip"><b>${F(label)}</b>${F(text)}</div>`;
  const table = rows => `<div class="hub-card"><dl class="hub-table">${rows.map(r => `<div><dt>${F(r[0])}</dt><dd>${F(r[1])}</dd></div>`).join('')}</dl></div>`;
  const options = (items, chosen, onclick, cat = 'Feeding') => `<div class="hub-options">${items.map(([k, t, b, icon]) => `<button class="hub-option ${chosen === k ? 'is-on' : ''}${icon ? ' has-art' : ''}" aria-pressed="${chosen === k}" onclick="${onclick(k)}">${icon ? `<span class="hub-option-art">${art(icon, cat)}</span>` : ''}<span><b>${F(t)}</b><span>${F(b)}</span></span></button>`).join('')}</div>`;
  const segmented = (items, chosen, onclick) => `<div class="hub-seg" role="tablist">${items.map(([k, t]) => `<button role="tab" aria-selected="${chosen === k}" class="${chosen === k ? 'is-on' : ''}" onclick="${onclick(k)}">${F(t)}</button>`).join('')}</div>`;

  /* ---------- feeding facts ---------- */
  const m = () => C().ageNow();
  const meth = () => C().method();
  const nursing = () => meth() === 'nurse';
  const signsOn = i => !!(L().ready || {})[i];
  const signsSeen = () => READY.filter((_, i) => signsOn(i)).length;
  const approach = () => L().approach || null;
  const style = () => L().style || (approach() === 'finger' ? 'finger' : 'spoon');
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
      meals: { nurse: ['Milk', 'About 3–5 feeds', 'Alongside meals'], bottle: ['Formula', 'About 24 oz a day', 'Until 12 months'], expressed: ['Milk', 'About 20–24 oz', 'A day'], both: ['Milk', 'About 3–5 feeds', 'Bottles 6–8 oz each'] } }[stage];
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
    const recent = live && typeof foodWeeksIn === 'function' && foodWeeksIn() < 4;
    const first = recent ? 3 : cur;
    const G = SOLIDS_GUIDES.map(g => blw && g.i === 4 ? { ...g, title: 'From strips to small pieces' } : g);
    const startedEarly = live && answers.solidsStart && age < 6;
    h += list('Solids guides', G.map(g => row({ icon: g.icon, title: g.title, sub: g.i === 3 && startedEarly ? 'Where every baby starts' : g.when, chipText: g.i === first ? 'Start here' : '', onclick: go('chg:Feeding:s:' + g.i) })));
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
        meth() === 'bottle' ? row({ icon: 'bowl', title: 'Make bottles safely', sub: 'Follow the formula’s directions exactly', onclick: go('chg:Feeding:d:bottles') }) : row({ icon: 'drop', title: 'Start vitamin D drops', sub: 'Breastfed babies need them from the first days', chipText: 'Must know', chipTone: 'is-red', onclick: go('chg:Feeding:d:vitd') })
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
        aidDone() || (C().live() && foodStage() !== 'new' && foodStage() !== 'preparing') ? null : row({ icon: 'shield', title: 'Learn infant choking first aid', sub: 'Worth knowing before you need it', chipText: 'Not done yet', chipTone: 'is-red', onclick: "openPage('chg:Feeding:safe')" }),
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
        !aidDone() && !(C().live() && foodStage() === 'new') ? row({ icon: 'shield', title: 'Learn infant choking first aid', sub: 'Worth knowing before you need it', chipText: 'Not done yet', chipTone: 'is-red', onclick: "openPage('chg:Feeding:safe')" })
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
        meals: { nurse: [['Nursing', 'About 3–5 feeds a day'], ['Meals', '3, plus 1–2 snacks'], ['Water', '4–8 oz a day']], bottle: [age >= 12 ? ['Cow’s milk, if used', '16–24 oz a day'] : ['Formula', 'About 24 oz a day'], ['Meals', '3, plus 1–2 snacks'], ['Water', '4–8 oz a day']], expressed: [['Breast milk', 'About 20–24 oz a day'], ['Meals', '3, plus 1–2 snacks'], ['Water', '4–8 oz a day']], both: [['Milk', 'About 3–5 feeds a day, nursing and bottles'], ['Meals', '3, plus 1–2 snacks'], ['Water', '4–8 oz a day']] }
      }[stage];
      const head = { learn: ['Little and often', 'Newborns have tiny tummies, so frequent feeds are exactly what they need.'], rhythm: ['Feeds are settling into a rhythm', 'Feeds often get quicker or a little further apart now. Hungrier days still happen.'], ready: age >= 7 ? ['Milk is still the main drink', 'If {s} {haven’t|hasn’t} started solids yet, it’s worth starting soon. Mention it at {p} next checkup.'] : ['Milk is still everything', 'Nothing changes until solids begin. Keep feeding the way you have been.'], first: ['Milk still comes first', 'Solids are practice for now, so keep milk feeds going as usual. Offer milk before meals if {s} {seem|seems} too hungry to try food.'], textures: ['Milk and meals together', 'Meals are growing, but milk still matters. Most babies drop a feed or two on their own.'], meals: ['Meals take the lead', 'Milk comes alongside meals now. The bigger change comes around the first birthday.'] }[stage];
      const enough = stage === 'learn' ? 'At least 6 wet diapers a day after day 5, and back to birth weight by about 2 weeks.' : stage === 'first' || stage === 'textures' || stage === 'meals' ? 'Steady growth at checkups and plenty of wet diapers. How much {s} {eat|eats} at one meal matters much less.' : 'Steady growth at checkups and plenty of wet diapers.';
      const select = `<label class="hub-select">Showing amounts for <select onchange="chgChooseMethod(this.value)">${[['nurse', 'Nursing'], ['expressed', 'Breast milk in bottles'], ['bottle', 'Formula'], ['both', 'Nursing and bottles']].map(([v, l]) => `<option value="${v}" ${meth() === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
      const early = typeof profile !== 'undefined' && profile.early ? tip('Born early?', 'Follow your pediatrician’s milk and supplement plan first. These are general amounts.') : '';
      // How amounts change across the year, Maya's stage marked. Same numbers as the tables.
      const si = ['learn', 'rhythm', 'ready', 'first', 'textures', 'meals'].indexOf(stage), labels = ['Newborn', '1–4 months', '4–6 months', '6–7 months', '7–9 months', '9–12 months'];
      const chart = meth() === 'nurse' || meth() === 'both'
        ? hubColumnChart({ title: 'Milk feeds a day, across the year', items: [['Newborn', 8, 12, '8–12'], ['1–4|months', 6, 8, '6–8'], ['4–7|months', 5, 7, '5–7'], ['7–9|months', 4, 6, '4–6'], ['9–12|months', 3, 5, '3–5']], max: 12, nowIndex: [0, 1, 2, 2, 3, 4][si], cat, caption: 'Milk feeds go down across the year: 8 to 12 a day as a newborn, 6 to 8 at 1 to 4 months, 5 to 7 at 4 to 7 months, 4 to 6 at 7 to 9 months and 3 to 5 at 9 to 12 months.', note: 'Fewer, bigger feeds as Maya grows and solids join in. Every baby’s a little different.' })
        : meth() === 'bottle' ? hubColumnChart({ title: 'Formula per bottle, across the year', items: [['Newborn', 1, 3, '1–3 oz'], ['1–4|months', 4, 5, '4–5 oz'], ['4–6|months', 4, 6, '4–6 oz'], ['6–12|months', 6, 8, '6–8 oz']], max: 8, nowIndex: [0, 1, 2, 3, 3, 3][si], cat, caption: 'Bottles grow from 1 to 3 oz as a newborn to 6 to 8 oz from about 6 months.', note: 'Bigger bottles, fewer of them: about 4–5 a day by 6 months. The daily total stays around 24–32 oz until 12 months.' })
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
    if (id === 'storage') {
      return detail(cat, 'Breast milk in bottles', 'Store breast milk safely', 'Freshly pumped milk keeps well if you follow a few simple times.',
        hubIconSteps([['clock', 'Up to 4 hours', 'At room temperature'], ['fridge', 'Up to 4 days', 'At the back of the fridge'], ['snow', 'Up to 12 months', 'In the freezer, best within 6']], cat, 'Fresh breast milk keeps up to 4 hours at room temperature, 4 days in the fridge, and 12 months in the freezer, best within 6.', false)
        + table([['Thawed milk', '24 hours in the fridge. Don’t refreeze.'], ['After a feed', 'Use leftovers within 2 hours']])
        + steps(['Label each bag or bottle with the date, and use the oldest first.', 'Thaw in the fridge overnight or in a bowl of warm water, never the microwave.', 'Swirl to mix the fat back in. It’s normal for it to separate.'])
        + video('Storing and preparing breast milk', 'Northwestern Medicine', 'https://www.nm.org/healthbeat/healthy-tips/how-to-store-breast-milk', 'Guide'), 'bottle');
    }
    if (id === 'vitd') {
      // Vitamin D and iron, in one place. AAP: breast milk is low in both; formula has both added.
      // Iron (AAP, 2026): babies who only have breast milk need iron drops by 6 months; babies born early often start sooner.
      const f = meth() === 'bottle', early = typeof profile !== 'undefined' && profile.early;
      const ts = f ? [['Vitamin D', 'Usually covered', 'Formula has it added'], ['Iron', 'Usually covered', 'Formula has it added']]
        : [['Vitamin D', '400 IU a day', 'Drops, from the first days'], ['Iron', early ? 'Ask when to start' : 'Ask at 4 months', early ? 'Often from the first weeks' : 'Drops by 6 months, until iron-rich foods are going well']];
      return detail(cat, 'Milk feeds', 'Vitamin D and iron', f ? 'Formula has both added, so most formula-fed babies don’t need drops.' : 'Breast milk is low in vitamin D and iron, so breastfed and partly breastfed babies need a little extra.',
        `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F(f ? 'For formula-fed babies' : 'For breastfed babies')}</b></span>${tiles(ts)}</section>`
        + (f ? tip('When to ask', 'If Maya drinks less than about 32 oz of formula a day, ask your pediatrician about vitamin D drops.')
          : steps(age < 4 ? ['Ask which drops and how much at Maya’s next checkup.', 'Ask about iron at the 4-month checkup, and whether to give it with milk or on its own.'] : ['Keep giving vitamin D every day through the first year.', 'Ask at Maya’s next checkup whether {s} still {need|needs} iron drops, or if iron-rich foods are enough.']))
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
        + video('See how to cut dozens of foods', 'Solid Starts', 'https://www.solidstarts.com/safe-food-sizes-shapes-for-babies/', 'Guide'), 'avocado');
    }
    if (id === 'cup') {
      return detail(cat, 'Solids', 'Practice with an open cup', 'Sipping from a cup takes practice, and starting early makes the bottle-to-cup switch easier later.',
        steps(['Pour a little water into a small open cup.', 'Hold it to Maya’s lips and let {o} take a sip.', 'Offer it at meals. Spills are part of it.']) + tip('How much water?', 'About 4–8 oz a day is plenty. Milk is still the main drink.'), 'cup');
    }
    if (id === 'day') {
      return detail(cat, 'Family meals', 'What a day of meals looks like', 'Here’s one example to work from. Every family’s day looks a little different.',
        hubDayMarkers({ title: 'An example day', events: [[7 * 60, 'bottle', nursing() ? 'Wake up: nursing' : 'Wake up: milk'], [8 * 60, 'oats', 'Breakfast: oatmeal with mashed fruit'], [10 * 60, 'avocado', 'Snack: soft fruit or yogurt'], [12 * 60, 'lentils', 'Lunch: soft veggies and beans or meat'], [15 * 60, 'bottle', nursing() ? 'Afternoon: nursing' : 'Afternoon: milk, plus a snack if hungry'], [17 * 60 + 30, 'plate', 'Dinner: a small portion of yours'], [19 * 60, 'moon', nursing() ? 'Bedtime: nursing' : 'Bedtime: milk']], cat, caption: 'An example day of meals: milk on waking, breakfast, a snack, lunch, milk in the afternoon, dinner and milk at bedtime.' }) + tip('Light days are normal', 'Appetite goes up and down. Growth at checkups tells you more than any one meal.'), 'plate');
    }
    if (id === 'family') {
      return detail(cat, 'Family meals', 'Share your family’s food', 'Most of what you eat can work for Maya with a couple of small changes.',
        steps(['Set {p} portion aside before you add salt or spicy sauces.', 'Cut it into soft, small pieces or mash it a little.', 'Sit down together when you can. Watching you eat is how {s} {learn|learns}.']) + tip('Keep skipping, even after 1', 'Whole nuts, popcorn, whole grapes and hard raw vegetables are choking risks for years.'), 'plate');
    }
    if (id === 'milk12') {
      return nursing()
        ? detail(cat, 'Family meals', 'Nursing can carry on', 'There’s no need to stop at 12 months. Many families keep nursing well past the first birthday.', tip('Around the first birthday', 'Meals become the main food and nursing fits around them. Water from a cup is the main drink between feeds.') + tip('Ask at the checkup', 'Your pediatrician can talk through vitamin D and iron at the 12-month checkup.'), 'cup')
        : detail(cat, 'Family meals', m() >= 12 ? 'Switching to whole milk' : 'Plan the milk change at 12 months', m() >= 12 ? 'Now that Maya’s 1, whole cow’s milk can replace formula, and bottles can make way for cups.' : 'Around the first birthday, whole cow’s milk can replace formula, and bottles can make way for cups.',
          steps([meth() === 'both' ? 'At 12 months, swap formula bottles for whole cow’s milk, about 16–24 oz a day. Nursing can carry on alongside.' : 'At 12 months, swap formula for whole cow’s milk, about 16–24 oz a day.', 'Offer milk in an open or straw cup instead of a bottle.', 'Talk it through at the 12-month checkup.']) + tip('No rush on the bottle', 'Phasing it out over a few weeks is fine.'), 'cup');
    }
    if (id === 'after') {
      // Nursing families: no bottles to swap, so the page is about cow's milk and cups.
      if (meth() === 'nurse') return detail(cat, 'After the first birthday', 'Cow’s milk, from a cup', 'From 12 months, whole cow’s milk can be a drink alongside nursing. There’s no need to stop nursing.',
        steps(['Offer a little whole cow’s milk in an open or straw cup with a meal or snack.', 'Build up slowly. Your pediatrician can tell you how much milk fits alongside nursing.', 'Keep nursing as much or as little as works for you both.']) + tip('Already using a cup?', 'Water from a cup has been fine since about 6 months, so this is just a new drink in a familiar cup.'), 'cup');
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
    { t: 'Get a firm, flat crib or bassinet', s: 'With a fitted sheet and nothing else in it', art: 'crib', task: 0 },
    { t: 'Set it up in your room', s: 'Room-sharing is recommended for at least 6 months', art: 'home', task: 1 },
    { t: 'Choose a sleep sack instead of blankets', s: 'Light and unweighted, with no hat', art: 'sack', task: 2 },
    { t: 'Put Maya on {p} back for every sleep', s: 'Naps and nights, every time', art: 'back', habit: 'Every sleep' },
    { t: 'Move {o} to {p} crib after the car or swing', s: 'Car seats and swings aren’t for sleep', art: 'car', habit: 'Every time' },
    { t: 'Never sleep with Maya on a sofa or armchair', s: 'Feeding when you’re very tired? Do it in a bed cleared of pillows and blankets, then move {o} back to the crib', art: 'sofa', habit: 'Always' },
    { t: 'Keep the room smoke-free and comfortably cool', s: 'Overheating and smoke both raise the risk of SIDS', art: 'home', habit: 'Always' },
    { t: 'Offer a pacifier at sleep times', s: 'Once feeding’s going well. It’s linked to lower SIDS risk.', art: 'pacifier', habit: 'If you like' }
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
      clock: [['Total sleep', '14–17 hours', 'Including naps'], ['Wake window', '45–60 min', 'Between sleeps']],
      daynight: [['Total sleep', '14–17 hours', 'Including naps'], ['Wake window', '1–1½ hours', 'Between sleeps']],
      rhythm: [['Naps', '3 a day', 'The last is a short catnap'], ['Wake window', '2–2½ hours', 'Between sleeps'], ['Bedtime', '7–8 pm', 'Often'], ['Total sleep', '12–16 hours', 'Including naps']],
      two: [['Naps', '2 a day', 'Morning and afternoon'], ['Wake window', '2½–4 hours', 'Between sleeps'], ['Bedtime', '7–8 pm', 'Often'], ['Total sleep', '12–16 hours', 'Including naps']]
    }[key];
  }
  const NIGHT = {
    clock: 'Wake Maya for feeds until your pediatrician says you can stop, usually once {s’s} back to birth weight.',
    daynight: 'Once your pediatrician says it’s OK, let Maya wake you for feeds. Most babies still feed 2–3 times a night.',
    rhythm: 'Night feeds can carry on. Check with your pediatrician before dropping one.',
    two: 'Some babies still feed at night with two naps, and that’s fine. Ask your pediatrician before dropping one.'
  };
  const nightCard = (key, isNow = true) => `<button class="hub-card hub-glance" onclick="${go('chg:Sleep:d:day')}"><span class="hub-card-head"><b>${F(isNow && C().live() ? 'How Maya’s sleeping now' : isNow ? 'At this age' : 'At this stage')}</b>${chev}</span>${tiles(sleepGlance(key))}<span class="hub-card-note" id="sleep-night-feeds"><b>${F('At night')}</b> ${F(NIGHT[key])}</span></button>`;
  const swaddleRow = () => swaddleDue() ? row({ icon: 'sack', cat: 'Sleep', title: rolled() ? 'Stop swaddling now' : 'Stop swaddling at the first attempt to roll', sub: rolled() ? (answers.rollDirection === 'Trying to roll' ? 'Now that Maya’s trying to roll, use a sleep sack' : 'Now that Maya’s rolling, use a sleep sack') : 'Switch to a sleep sack that leaves the arms free', chipText: rolled() ? 'Do now' : 'Must know', chipTone: 'is-red', onclick: go('chg:Sleep:d:swaddle') }) : null;
  const mattressRow = () => mattressLowestDue() ? row({ icon: 'shield', cat: 'Sleep', title: 'Set the crib mattress to its lowest', sub: answers.pullUp === 'Yes' ? 'Now that Maya pulls up, use the lowest setting' : 'Before {s} {pull|pulls} up, use the lowest setting', chipText: 'Do now', chipTone: 'is-red', onclick: go('chg:Sleep:d:mattress') })
    : mattressDue() ? row({ icon: 'shield', cat: 'Sleep', title: 'Lower the crib mattress', sub: answers.sit === 'Yes' || answers.pullUp === 'Yes' || answers.crawl === 'Yes' ? 'Now that Maya sits, set it to the lowest setting' : 'Lowest setting before {s} can pull up', chipText: 'Do now', chipTone: 'is-red', onclick: go('chg:Sleep:d:mattress') }) : null;
  function settleRow() {
    const g = C().settlingGuide();
    const t = { learn: m() >= 4 ? ['Sleep training, if you choose it', 'A choice, not a must'] : ['Read ahead: sleep training', 'Some families start at 4–6 months or later'], trying: ['Support while sleep training', 'How to handle a rough night'], routine: ['When the routine changes', 'After short naps, travel or illness'], help: ['A routine with your help', 'Feeding or rocking to sleep can stay'] }[g] || ['Helping Maya settle', 'What works at this age'];
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
      h += hero({ eyebrow: 'Round-the-clock sleep', title: 'Short sleeps, day and night', checksLabel: 'What to expect', checks: ['Sleep comes in short stretches of 1–3 hours, day and night', 'Maya wakes when {s’s} hungry, so feeds set the rhythm', 'There’s no day and night pattern yet, and that’s expected'], button: n === all ? null : { label: 'Set up a safe sleep space', onclick: go('chg:Sleep:safe') } }) + B + (n === all ? list('', [row({ icon: 'moon', cat, title: 'Safe sleep setup', sub: 'Your space is set up. The habits are here too.', chipText: 'Done', chipTone: 'is-done', onclick: go('chg:Sleep:safe') })]) : '');
      h += nightCard(key, now);
      h += list('In these first weeks', [
        (now && swaddleRow()) || (answers.swaddleStopped === 'Yes' ? null : row({ icon: 'sack', cat, title: 'Swaddle safely, if you swaddle', sub: 'Snug at the chest, loose at the hips', onclick: go('chg:Sleep:d:swaddle') })),
        row({ icon: 'clock', cat, title: 'Start winding down at the first yawn', sub: 'A yawn or a quiet stare is your cue', onclick: go('chg:Sleep:d:cues') }),
        row({ icon: 'heart', cat, title: 'Help Maya fall asleep any way that works', sub: 'Feeding, rocking or holding is fine now', onclick: "openPage('chg:Sleep:d:soothe')" }),
        row({ icon: 'moon', cat, title: 'Keep nights dark and quiet', sub: 'It helps {p} body clock switch on', onclick: go('chg:Sleep:d:daynight') })
      ].filter(Boolean).slice(0, 3).concat([row({ icon: 'crib', cat, title: 'Where Maya sleeps', sub: 'In your room, in {p} own sleep space', onclick: go('chg:Sleep:d:where') })]));
      h += versus('Normal, or time to call?', ['Normal', 'Waking every 2–3 hours, grunts, squeaks and twitches in sleep.'], ['Call your pediatrician', 'Hard to wake for feeds, a temperature of 100.4°F or higher, or trouble breathing.'], ['When the crying won’t stop', go('chg:Sleep:d:crying')]);
    }
    if (key === 'daynight') {
      h += hero({ eyebrow: 'Longer nights', title: 'Nights are starting to stretch', checks: ['One stretch of night sleep starts to get longer', 'Maya starts to tell day from night, often by 6–8 weeks', 'Awake time grows to about 1–1½ hours, up from under an hour'] }) + B;
      h += nightCard(key, now);
      h += list('What helps now', [
        now ? swaddleRow() : null,
        row({ icon: 'moon', cat, title: 'Keep days bright and nights dim', sub: 'Daylight and chatter by day, quiet feeds at night', onclick: go('chg:Sleep:d:daynight') }),
        row({ icon: 'clock', cat, title: 'Start a short bedtime routine', sub: 'A feed, a diaper and a song is plenty', onclick: go('chg:Sleep:d:routine') }),
        now && swaddleDue() ? null : settleRow(),
        row({ icon: 'crib', cat, title: 'Where Maya sleeps', sub: 'In your room, in {p} own sleep space', onclick: go('chg:Sleep:d:where') })
      ]);
      if (now) h += eventRow(cat);
      h += versus('Normal, or time to call?', ['Normal', 'A long stretch one night and not the next, and fussier evenings.'], ['Call your pediatrician', 'Snoring most nights, pauses or gasps in sleep, or sleep changes with fever.']);
    }
    if (key === 'rhythm') {
      h += hero({ eyebrow: 'Three naps', title: 'Naps are finding a rhythm', checks: ['Naps settle into 3 a day, down from 4 or 5', 'Maya can stay awake about 2–2½ hours at a time, up from 1–1½', 'Bedtime moves earlier, to around 7–8 pm'].concat(m() < 6 ? ['Waking more at night? Sleep cycles mature around 4 months, and it usually settles in a few weeks'] : []) }) + B;
      h += nightCard(key, now);
      // Sleep training stays reachable as the last row; sleepy cues were covered at birth.
      const rows = [now ? swaddleRow() : null, now ? mattressRow() : null, row({ icon: 'clock', cat, title: 'Watch for sleepy cues', sub: 'A quiet stare, yawning or turning away', onclick: go('chg:Sleep:d:cues') })].filter(Boolean).slice(0, 2).concat(settleRow());
      h += list('What helps now', rows.concat([row({ icon: 'crib', cat, title: 'Where Maya sleeps', sub: 'Bassinet to crib, and when to move rooms', onclick: go('chg:Sleep:d:where') })]));
      if (now) h += eventRow(cat);
      h += versus('Normal, or time to call?', ['Normal', 'Naps of 30–45 minutes, and fighting a nap now and then.'], ['Call your pediatrician', 'Snoring most nights, pauses or gasps in sleep, or sleep changes with fever.']);
    }
    if (key === 'two') {
      const settled = answers.twoNaps === 'Yes' || age >= 10 || (now && answers.twoNaps !== 'Not yet');
      h += hero({ eyebrow: 'Two naps', title: settled ? 'Two naps a day' : 'Two naps are on the way', checks: settled ? ['Naps settle into 2 a day: one in the morning, one in the afternoon', 'Maya can stay awake about 2½–4 hours at a time, longest before bed', 'A short nap shifts the timing, not the number of naps'] : ['The late-afternoon catnap starts to drop, often between 6 and 9 months', 'Awake stretches grow to about 2½–4 hours', 'Bedtime may move a little earlier while {s} {adjust|adjusts}'] }) + B;
      h += nightCard(key, now);
      const rows = [now ? swaddleRow() : null, now ? mattressRow() : null, settled ? row({ icon: 'clock', cat, title: 'After a short nap, offer the next one sooner', sub: 'One rough day doesn’t end two naps', onclick: go('chg:Sleep:d:catnap') }) : row({ icon: 'clock', cat, title: 'Watch for a skipped catnap', sub: 'If {s} {skip|skips} it most days, try two naps', onclick: go('chg:Sleep:d:catnap') }), row({ icon: 'sit', cat, title: 'Practice new skills during the day', sub: 'Lots of floor time helps nights stay calm', onclick: go('chg:Sleep:d:skills') })].filter(Boolean).slice(0, 2).concat(settleRow());
      h += list('What helps now', rows.concat([row({ icon: 'crib', cat, title: 'Where Maya sleeps', sub: 'Bassinet to crib, and when to move rooms', onclick: go('chg:Sleep:d:where') })]));
      if (now) h += eventRow(cat);
      h += versus('Normal, or time to call?', ['Normal', 'Standing up in the crib, and protest at bedtime when you leave.'], ['Call your pediatrician', 'Snoring most nights, pauses or gasps in sleep, or sleep changes with fever.']);
    }
    const D = C().DATA.Sleep, N = D.CH[view + 1], A = D.CH[view].after;
    if (N) { let w = N.when.replace(/^Usually /, ''); if (/weeks–/.test(w)) w = w.split('–')[0]; h += next(`Coming up around ${w}`, N.rail, `chgGo('chg:Sleep:s:${view + 1}')`); }
    else if (A) h += next(`After the first birthday, ${A[0]}`, A[1], go('chg:Sleep:d:after'));
    h += (D.DEC[key] || []).length ? more('What other parents ask', go(`chg:Sleep:d:faq:${key}`)) : '';
    return frame(cat, view, cur, h);
  }

  /* ---------- sleep detail screens ---------- */
  function sleepDetail(id, arg) {
    if (id === 'soothe') return soothePage();
    const cat = 'Sleep', age = m(), stage = C().CFG.Sleep.stage(age), C0 = C().DATA.Sleep.CH[stage], key = SLEEP_KEYS[stage];
    if (id === 'safe') {
      const done = safeDone() === SLEEP_TASKS;
      const rows = SLEEP_SETUP.map(x => `<div class="hub-row is-static"><span class="hub-dot">${art(x.art, cat)}</span><span class="hub-row-copy"><b>${F(x.t)}</b><small>${F(x.s)}</small></span></div>`).join('');
      return detail(cat, 'Safe sleep', 'A safe place to sleep', 'Set up the space once, then a few habits keep every sleep safe.',
        figure('crib', cat, 'A baby asleep on their back in a sleep sack, in a bare crib with a firm mattress and fitted sheet.') + `<div class="hub-list">${rows}</div>`
        + `<div class="hub-actions">${done ? `<p class="hub-done">${F('You’ve set up Maya’s sleep space')} ✓</p>` : `<button class="hub-button" onclick="hubSleepSetUp()">${F('I’ve set this up')}</button>`}</div>`
        + `<h2 class="hub-h2">${F('As Maya starts moving')}</h2><div class="hub-list">`
        + `<div class="hub-row is-static" id="sleep-rolling"><span class="hub-dot">${art('roll', cat)}</span><span class="hub-row-copy"><b>${F('When {s} {try|tries} to roll')}</b><small>${F('Stop swaddling and keep putting {o} down on {p} back. If {s’s} in a bassinet, it’s time for the crib.')}</small></span></div>`
        + `<div class="hub-row is-static" id="sleep-crib-height"><span class="hub-dot">${art('shield', cat)}</span><span class="hub-row-copy"><b>${F('Before {s} can sit or pull up')}</b><small>${F('Lower the crib mattress, then set it to its lowest.')}</small></span></div></div>`
        + video('What a safe sleep space looks like', 'Safe to Sleep campaign', 'https://www.nichd.nih.gov/sites/default/files/publications/pubs/documents/safe_sleep_environment_rev.pdf', 'Guide'), 'moon');
    }
    if (id === 'day') {
      const flexible = ['clock', 'daynight'].includes(key);
      const day = C().sampleDay(C0).replace('<h3 class="chg-sample-title">', '<h3 class="chg-sample-title hub-h2">');
      return detail(cat, C0.rail, flexible ? 'There’s no schedule yet' : 'An example day', flexible ? 'For now, days follow a loop: a feed, a little awake time, then sleep. Clock times come later.' : 'Here’s one example built from typical wake windows. Real days will move around, and that’s fine.',
        `<div class="hub-card">${tiles(sleepGlance(key)).replace('hub-tiles', 'hub-tiles is-flat').replace(/<small>Naps<\/small><b>(\d) a day<\/b>/, '<small>Naps</small><b>$1</b>')}</div>` + `<div class="hub-card hub-dayplan">${day}</div>` + tip('At night', NIGHT[key]), 'clock');
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
        + versus('Normal, or time to call?', ['Normal', 'Long crying spells, often in the evening, in a baby who feeds and grows well.'], ['Call your pediatrician', (m() < 3 ? 'Right away for any fever of 100.4°F or higher. Also for ' : 'Crying with a fever, ') + 'poor feeding or vomiting, a weak or high-pitched cry, or crying that sounds like pain.'])
        + video('Why crying peaks, and what helps', 'Cook Children’s', 'https://www.cookchildrens.org/health-resources/newborn/care/period-of-purple-crying/', 'Guide'), 'heart');
    }
    if (id === 'daynight') {
      return detail(cat, 'Longer nights', 'Helping Maya tell day from night', 'Babies aren’t born knowing the difference. Light, sound and your routine teach {o}.',
        hubIconSteps([['sun', 'By day', 'Curtains open, normal noise, play and chatter'], ['moon', 'At night', 'Low lights, quiet and calm feeds']], cat, 'By day, open curtains, normal noise and play. At night, low lights and quiet, calm feeds.', false) + tip('When it clicks', 'Most babies’ body clocks switch on around 6–8 weeks, so give it time.'), 'moon');
    }
    if (id === 'routine') {
      return detail(cat, 'Sleep', 'A short bedtime routine', 'A few familiar steps in the same order tell Maya that sleep is coming.',
        hubIconSteps([['bottle', 'A feed', 'Then a fresh diaper and pajamas'], ['moon', 'Lights down', 'Dim and quiet'], ['book', 'A song or book', 'The same one most nights'], ['crib', 'Down on {p} back', 'In {p} own sleep space']], cat, 'A feed, fresh diaper and pajamas, lights down, a song or short book, then down on the back in the crib.') + tip('Keep it short', 'Familiar matters more than long. About 10–15 minutes is plenty.'), 'moon');
    }
    if (id === 'swaddle' && !rolled() && m() < 3) {
      return detail(cat, 'Sleep safety', 'Swaddling safely', 'A snug swaddle can help a newborn settle. It just needs to be done the safe way, and only until {s} {try|tries} to roll.',
        hubEmbed('pJCQf2Xxlrk', 'How to swaddle a newborn', 'Mount Sinai Parenting Center')
        + `<h2 class="hub-h2">${F('How to wrap')}</h2>` + figure('swaddle', 'Sleep', 'Three steps: lay the blanket as a diamond with the top folded down, bring one side across and tuck it under, then fold up the bottom and wrap the last side, snug at the chest and loose at the hips.') + steps(['Lay a thin blanket out like a diamond and fold the top corner down. Place Maya on {p} back with {p} shoulders just below the fold.', 'Hold one arm straight at {p} side, bring that side of the blanket across {p} chest and tuck it under {p} back.', 'Fold the bottom corner up loosely over {p} feet, leaving room for {p} legs to bend.', 'Bring the last side across and tuck it under {o}. Snug at the chest, loose at the hips.'])
        + `<h2 class="hub-h2">${F('Keep it safe')}</h2>` + steps(['Snug around the chest, with room for two fingers between the blanket and {p} chest.', 'Loose around the hips, so {p} legs can bend up and out like a frog.', 'Always on {p} back, never on {p} tummy or side.'])
        + tip('Stop at the first attempt to roll', 'Some babies try as early as 2 months, most between 3 and 6. Switch to a sleep sack that leaves the arms free.')
        + video('Swaddling for healthy hips', 'International Hip Dysplasia Institute', 'https://hipdysplasia.org/how-to-swaddle-your-baby-to-help-keep-their-hips-healthy/', 'Guide')
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
    if (id === 'methods') return detail(cat, 'Sleep training', 'Choosing an approach', '', methodScale(), 'book');
    if (id === 'where') {
      return detail(cat, 'Sleep', 'Where Maya sleeps', 'In your room for the first 6 months, in {p} own sleep space. After that, where {s} {sleep|sleeps} is your family’s call.',
        hubWindowBar({ title: 'In your room, in {p} own sleep space', from: 0, to: 12, zones: [[0, 6, 'Share a room', 'band'], [6, 12, 'Your call', 'calm']], ticks: [[0, 'Birth'], [6, '6 mo'], [12, '1 year']], now: (NOW - parse(profile.dob)) / 2629746e3, cat, caption: 'Keep baby in your room, in their own crib or bassinet, for the first 6 months. After that, moving to their own room is a family choice.' })
        + `<h2 class="hub-h2">${F('Bassinet to crib')}</h2>`
        + hubIconSteps([['clock', 'Check the label', 'Bassinets have a weight limit, often about 15–20 lb'], ['roll', 'Or once {s} {roll|rolls}', 'Or pushes up on hands and knees']], cat, 'Move from the bassinet to the crib at the bassinet’s weight limit, or once baby rolls or pushes up on hands and knees, whichever comes first.', false)
        + tip('Whichever comes first', 'Rolling or pushing up can tip a bassinet or carry Maya over its edge, even under the weight limit.')
        + `<h2 class="hub-h2">${F('Moving to {p} own room')}</h2>`
        + steps(['Keep the same bedtime steps, so the new room feels familiar.', 'Try naps in the new room for a few days first.', 'Set it up the same way: firm, flat and empty, on {p} back.'])
        + tip('No rush', 'Plenty of families room-share longer. Either way is fine after 6 months.'), 'crib');
    }
    if (id === 'catnap') {
      return detail(cat, 'Two naps', answers.twoNaps === 'Yes' || age >= 10 ? 'When a nap runs short' : 'Moving to two naps', 'The move from three naps to two takes a week or two, and some days will look messy.',
        hubWindowBar({ title: 'When three naps become two', from: 3, to: 12, band: [6, 9, '6–9 months'], ticks: [[3, '3 mo'], [6, '6 mo'], [9, '9 mo'], [12, '12 mo']], now: (NOW - parse(profile.dob)) / 2629746e3, cat, caption: 'Most babies move from three naps to two between 6 and 9 months.' })
        + steps(['Watch for a skipped or hard-to-fit late catnap most days.', 'Move bedtime about 30 minutes earlier during the switch.', 'After a short nap, offer the next sleep a little sooner.']) + tip('A third nap is still OK', 'On a day with short naps, a catnap can still help.'), 'clock');
    }
    if (id === 'skills') {
      return detail(cat, 'Two naps', 'Practice new skills during the day', 'Crawling and pulling up are exciting, and Maya may want to practice in the crib too.',
        steps(['Give {o} lots of floor time to practice by day.', 'Keep the bedtime routine the same.', 'If {s} {stand|stands} up in the crib, help {o} sit back down calmly, then say goodnight.']) + tip('It passes', 'Most babies settle back into sleep once the new skill feels familiar.'), 'sit');
    }
    if (id === 'after') { const A = C().DATA.Sleep.CH[3].after; return detail(cat, 'After the first birthday', A[1], 'Most babies still need two naps at their first birthday. The move to one nap usually comes between 13 and 18 months.',
      hubWindowBar({ title: 'When two naps become one', from: 9, to: 24, band: [13, 18, '13–18 months'], ticks: [[9, '9 mo'], [12, '1 year'], [18, '18 mo'], [24, '2 years']], now: (NOW - parse(profile.dob)) / 2629746e3, cat, caption: 'Most toddlers move from two naps to one between 13 and 18 months.' })
      + tip('The sign to watch for', 'Most days, {s} {fight|fights} the morning nap or {take|takes} a long time to fall asleep for it, yet {is} fine until the afternoon.') + tip('How to switch', 'Push the morning nap a little later every few days until it lands around lunchtime. An earlier bedtime helps while {s} {adjust|adjusts}.') + tip('Not yet?', 'Two naps after the first birthday is normal. There’s no rush.'), 'moon'); }
    if (id === 'method') {
      const x = (typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [])[Number(arg)];
      if (!x) return settlePage();
      const NIGHTS = {
        'Ferber': [['7:00 pm', 'Bedtime routine, then put Maya down drowsy but awake. Say goodnight and leave.'], ['If {s} {cry|cries}', 'Wait 3 minutes, then check in for a minute or two. Talk softly or pat, without picking {o} up.'], ['Still crying', 'Leave again and wait a little longer each time: 5 minutes, then 10.'], ['Night wakes', 'Feed if it’s time for a feed. Otherwise use the same check-ins.'], ['Next nights', 'Start the waits a few minutes longer than the night before.']],
        'Chair method': [['Nights 1–3', 'Sit in a chair right by the crib. Comfort with your voice or a hand until Maya falls asleep.'], ['Nights 4–6', 'Move the chair halfway to the door. Comfort with your voice more than touch.'], ['Nights 7–9', 'Move the chair to the doorway.'], ['After that', 'Say goodnight from outside the door.'], ['Night wakes', 'Go back to wherever the chair is that night.']],
        'Pick up, put down': [['7:00 pm', 'Bedtime routine, then put Maya down drowsy but awake.'], ['If {s} {cry|cries}', 'Pick {o} up and hold {o} until {s’s} calm, but not asleep.'], ['Then', 'Put {o} back down. Repeat as many times as it takes.'], ['Night wakes', 'Feed if it’s time for a feed, then the same pick up and put down.'], ['Good to know', 'The first nights can take many repeats. It gets quicker.']],
        'Cry it out': [['7:00 pm', 'Bedtime routine, then put Maya down awake. Say goodnight and leave.'], ['If {s} {cry|cries}', 'Don’t go back in until morning, unless it’s a planned feed or {s} {seem|seems} unwell.'], ['First nights', 'Crying can last a while at first.'], ['By night 3 or 4', 'Most babies cry much less and fall asleep faster.']],
        'Bedtime fading': [['First', 'Notice when Maya naturally falls asleep, say 8:30 pm.'], ['Nights 1–2', 'Start the bedtime routine so {s’s} in the crib at 8:30, when {s’s} truly sleepy.'], ['Once {s} {settle|settles} quickly', 'Move bedtime 15 minutes earlier.'], ['Repeat', 'Keep stepping earlier every couple of nights until you reach the bedtime you want.']]
      };
      const night = NIGHTS[x.name];
      const nightHtml = night ? `<h2 class="hub-h2">${F('What a night might look like')}</h2><div class="hub-card"><dl class="hub-timeline">${night.map(r => `<div><dt>${F(r[0])}</dt><dd>${F(r[1])}</dd></div>`).join('')}</dl></div>` : '';
      return detail(cat, 'Sleep training', x.name, x.title, `<div class="hub-card"><p class="hub-body">${esc(x.description)}</p></div>` + nightHtml + tip('Before you start', 'Check with your pediatrician, keep any night feeds {s} still {need|needs}, and pick a response every caregiver can repeat.') + `<a class="hub-more" href="${x.url}" target="_blank" rel="noopener"><span>${esc(x.link)} · ${esc(x.source || 'Cleveland Clinic')}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`, 'moon');
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
    const fromSafety = (typeof historyStack !== 'undefined' && historyStack.length && String(historyStack[historyStack.length - 1]).includes('Safety'));
    return detail(fromSafety ? 'Safety' : 'Feeding', fromSafety ? 'First aid' : 'Safety', 'If Maya is choking', 'Choking is silent: {s} can’t cry, cough or breathe. Gagging is noisy, and you can let {o} work it out.',
      `<section class="hub-card hub-versus"><div class="hub-vs" style="margin-top:0"><div><b>Gagging</b><p>${F('Coughing, sputtering, a red face. Stay calm and let {o} clear it.')}</p></div><div class="is-urgent"><b>Choking</b><p>${F('Silent, can’t cough or cry, lips turning blue. Act now.')}</p></div></div></section>`
      + `<h2 class="hub-h2">${F('What to do if {s} {is} choking')}</h2>`
      + steps(['Shout for help and have someone call 911.', 'Lay Maya face down along your forearm, head lower than {p} chest, supporting {p} jaw. Give up to 5 firm back blows between the shoulder blades.', 'Turn {o} face up on your other arm. With 2 fingers just below the nipple line, give up to 5 quick chest thrusts.', 'Keep switching between back blows and chest thrusts until the food comes out. If {s} {stop|stops} responding, call 911 and start infant CPR.'])
      + hubEmbed('ShaNuST_58A', 'What to do when a baby is choking', 'American Red Cross')
      + tip('Don’t sweep blindly', 'Only reach into {p} mouth if you can see the object and easily pick it out.')
      + tip('Take a class', 'A short infant first aid class lets you practice these steps on a doll. It’s the best way to feel ready.')
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
    const methods = typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [];
    const order = ['fading', 'pickup', 'chair', 'ferber', 'extinction'];
    const sorted = order.map(k => [methods.findIndex(x => x.kind === k), methods.find(x => x.kind === k)]).filter(x => x[1]);
    // The real difference between methods is whether you stay in the room. Say that once, then list the methods
    // as plain rows (what you'd do, in one line), and answer the one worry every parent has.
    const what = { fading: 'Start bedtime later, when {s’s} sleepier, then move it earlier', pickup: 'Pick {o} up to calm {o}, then lay {o} back down', chair: 'Sit by the crib, moving your chair away over a few nights', ferber: 'Check in at longer and longer gaps', extinction: 'Don’t go back in until morning, unless something’s wrong' };
    const r = k => { const x = methods.find(y => y.kind === k); return x ? row({ icon: k === 'fading' ? 'clock' : k === 'pickup' ? 'heart' : k === 'chair' ? 'sofa' : k === 'ferber' ? 'eye' : 'moon', cat: 'Sleep', title: x.name, sub: what[k], onclick: go('chg:Sleep:d:method:' + methods.indexOf(x)) }) : ''; };
    return `<p class="hub-para">${F('There’s no best method. The main difference is whether you stay in the room while Maya learns to fall asleep. Staying usually means less crying but takes longer. Leaving is usually quicker, with more crying at first.')}</p>`
      + list('You stay in the room', ['fading', 'pickup', 'chair'].map(r))
      + list('You leave the room', ['ferber', 'extinction'].map(r))
      + tip('Is it safe?', 'Studies haven’t found lasting harm to babies or to your bond. The best method is one you can stick with.');
  }
  function settlePage() {
    const age = m(), choice = C().settlingGuide();
    if (age < 4) {
      // Read ahead: the parent can learn about sleep training before it's time, without being told to start.
      const methods = typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [];
      return detail('Sleep', 'Read ahead', 'Sleep training can wait', 'It’s optional, and families who try it usually start around 4–6 months. For now, feeding, rocking or holding Maya to sleep is fine. You can’t spoil a young baby.',
        list('', [row({ icon: 'book', cat: 'Sleep', title: 'Curious about the options?', sub: 'The main approaches, in plain words', onclick: go('chg:Sleep:d:methods') })]) + list('', [row({ icon: 'heart', cat: 'Sleep', title: 'Help Maya fall asleep any way that works', sub: 'Soothing in the early months', onclick: go('chg:Sleep:d:soothe') })]), 'book');
    }
    return settleChoices(age, choice);
  }
  function soothePage() {
    return detail('Sleep', 'The early months', 'Helping Maya settle', 'Feeding, rocking or holding Maya to sleep is fine while sleep patterns are still developing. You can’t spoil a young baby.',
      steps(['Start winding down at the first sleepy cues, like a quiet stare or a yawn.', 'Keep a few familiar steps: a feed, a diaper and a quiet song.', 'Put {o} down on {p} back in {p} own sleep space.']) + list('', [row({ icon: 'heart', cat: 'Sleep', title: 'When the crying won’t stop', sub: 'What helps, and what to do if you need a break', onclick: go('chg:Sleep:d:crying') })]) + tip('Sleep training comes later, if at all', 'It’s an optional choice, usually considered from around 4–6 months.'), 'moon');
  }
  function settleChoices(age, choice) {
    const opts = [['learn', 'Compare sleep-training methods', 'See the main approaches side by side'], ['trying', 'Support while sleep training', 'How to handle a rough night'], ['routine', 'Keep a routine working', 'After short naps, travel or illness'], ['help', 'Settle with my help', 'Feeding or rocking to sleep can stay']];
    let content = '';
    if (choice === 'learn') {
      const methods = typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [];
      content = methodScale();
    }
    if (choice === 'trying') content = steps(['Compare a few nights, not one. Less time settling or less help needed is progress.', 'After a rough night, meet hunger, discomfort or illness first, then go back to your usual response.', 'If it isn’t getting easier after a week or two, pause and talk it through with your pediatrician.']);
    if (choice === 'routine') content = steps([age < 8 ? 'If naps are short and Maya’s tired again, keep offering the extra sleep.' : age < 12 ? 'New skills and separation anxiety can disrupt settling. Practice by day and keep bedtime familiar.' : 'One refused nap doesn’t mean {s’s} ready for one nap. Look for a pattern first.', 'After illness or travel, give the comfort {s} {need|needs}, then return to your familiar bedtime steps.', 'If sleep stays hard for a while, notice whether it’s falling asleep, waking or staying asleep, and mention it to your pediatrician.']);
    if (choice === 'help') content = steps(['Keep a short lead-in you can repeat: a feed, a diaper, then a song or book.', 'Feeding, rocking or holding to sleep can stay part of it, if it works for you.', 'Show other caregivers the same steps, so Maya hears familiar cues from everyone.']);
    return detail('Sleep', 'Optional', 'Sleep training, if you choose it', 'Sleep training is a choice, not a must. Helping Maya fall asleep can stay part of your routine if it works for you.',
      `<p class="hub-group">What would help right now?</p>` + options(opts.map(o => [o[0], o[1], o[2]]), choice, k => `chgChooseSettling('${k}')`) + `<div data-settling-guide="${choice}">${content}</div>`, 'moon');
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
    if ((cat === 'Sleep' || cat === 'Feeding') && screen === 'e') return eventDetail(cat, Number(a));
    return baseRoute(p);
  };
  // Building blocks shared with the other categories (js/hub-categories.js).
  window.__hub = { F, row, list, hero, tiles, glanceCard, versus, next, more, note, art, chev, chip, tip, steps, video, detail, mixedList, ticks, listMore,
    pills: (label, items) => `<nav class="hub-pills" id="hub-pills" aria-label="${esc(label)}">${items.map(it => `<button class="${it.on ? 'is-on' : ''} ${it.now ? 'is-now' : ''}" onclick="${it.onclick}" ${it.on ? 'aria-current="step"' : ''}>${esc(it.label)}${it.now && !it.on ? ' <span class="hub-now">Now</span>' : ''}</button>`).join('')}</nav>` };
  window.positionHubPills = function () {
    const r = document.getElementById('hub-pills'), s = r && r.querySelector('.is-on');
    if (r && s) r.scrollLeft = s.offsetLeft - (r.clientWidth - s.offsetWidth) / 2;
  };
})();
