/* Ahead · Sleep and Feeding, organized as the changes a baby goes through.
   Stages (the rail) move in order. Come-and-go phases (regressions, cluster feeding…)
   sit on top of a stage and show under "Also common around now".
   Renders with the app's own chrome: monthly header, journey rail, experience hero. */

(function () {
  const DATA = window.AHEAD_CHANGES;

  Object.assign(ICON, {
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    chat: '<path d="M5 5h14v10H10l-4 4v-4H5Z"/>',
    moon: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z"/>',
    next: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    chev: '<path d="m9 6 6 6-6 6"/>'
  });

  /* ---------- state that belongs to these pages ---------- */
  const STORE = 'ahead-v2-changes';
  let local = { safe: { Sleep: { 0: true, 1: true }, Feeding: { 0: true } }, method: null, dismissed: {}, ans: {} };
  try { local = Object.assign(local, JSON.parse(localStorage.getItem(STORE)) || {}); } catch (e) {}
  function save() { try { localStorage.setItem(STORE, JSON.stringify(local)); } catch (e) {} }

  const T = s => esc(String(s == null ? '' : s)).replace(/Maya/g, name());
  const ageNow = () => actualMonth();

  /* ---------- where is this baby? ---------- */
  function rolling() { return answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection); }
  function tryingToRoll() { return answers.rollDirection === 'Trying to roll'; }

  function sleepStage(m) {
    // A check-in answer about the late catnap beats the age default.
    if (isCurrent() && answers.twoNaps === 'Yes' && m >= 5) return 3;
    if (isCurrent() && answers.twoNaps === 'No' && m >= 4 && m < 10) return 2;
    return m < 2 ? 0 : m < 4 ? 1 : m < 6 ? 2 : 3;
  }
  function sleepEvents(m) { return m >= 3 && m < 6 ? [0] : m >= 8 && m <= 11 ? [1] : []; }
  // Feeding never moves into solids on age alone: a parent answer moves it.
  function feedStage(m) {
    const fs = typeof foodStage === 'function' ? foodStage() : 'preparing';
    if (m < 2) return 0;
    if (m < 4) return 1;
    if (fs === 'preparing') return 2;
    if (fs === 'new') return m >= 8 ? 4 : 3;
    return m >= 10 ? 5 : 4;
  }
  function feedEvents(m) { return m < 3 ? [0] : m < 7 ? [1] : [2]; }

  const CFG = {
    Sleep: { stage: sleepStage, events: sleepEvents, evIcon: 'moon', rhythmTitle: 'Wake windows', closeTitle: 'At night', closeIcon: 'moon',
      foot: 'If sleep changes come with fever, poor feeding or trouble breathing, call your pediatrician.' },
    Feeding: { stage: feedStage, events: feedEvents, evIcon: 'feed', rhythmTitle: 'How much and how often', closeTitle: 'How to tell it’s enough', closeIcon: 'check',
      foot: 'If feeding changes come with fever, fewer wet diapers or trouble breathing, call your pediatrician.' }
  };

  function method() {
    if (local.method) return local.method;
    return { 'Formula': 'bottle', 'Both': 'both' }[profile.feed] || 'nurse';
  }

  /* ---------- the must-know card ---------- */
  function alertFor(cat, cur, view) {
    if (view !== cur) return null;
    const m = ageNow();
    if (cat === 'Sleep') {
      if (cur === 0) { const n = Object.values(local.safe.Sleep).filter(Boolean).length; return { reason: 'Safe sleep setup', title: n + ' of ' + DATA.Sleep.SAFE.length + ' checked', body: 'Back to sleep, a clear crib in your room, and never on a sofa.', act: 'Open checklist', go: "openPage('chg:Sleep:safe')" }; }
      if ((rolling() || tryingToRoll()) && answers.swaddleStopped !== 'Yes' && m < 9)
        return { reason: 'You said ' + name() + (rolling() ? ' is rolling' : ' is trying to roll'), title: 'Time to stop swaddling', body: 'Use regular sleepwear or an unweighted sleep sack with arms free.', act: 'Done', go: "setAnswer('swaddleStopped','Yes')" };
      if (answers.pullUp === 'Yes' && answers.mattressLowest !== 'Yes')
        return { reason: 'You said ' + name() + ' is pulling up', title: 'Set the crib mattress to its lowest', body: 'Remove mobiles and anything she can reach from standing.', act: 'Done', go: "setAnswer('mattressLowest','Yes')" };
      return null;
    }
    const A = DATA.Feeding.ALERT, key = cur === 0 ? 'newborn' : cur === 2 ? '5' : cur === 4 ? '8' : null;
    if (!key || local.dismissed['feed-' + key]) return null;
    if (key === 'newborn' && method() === 'bottle') return null;
    const a = A[key]; let title = a[1];
    if (key === '5') { const n = Object.values(local.safe.Feeding).filter(Boolean).length; title = n + ' of ' + DATA.Feeding.SAFE.length + ' ready'; }
    const screen = { settle: 'milk', safe: 'safe' }[a[4]] || 'safe';
    return { reason: a[0], title, body: a[2], act: a[3], go: "openPage('chg:Feeding:" + screen + "')" };
  }

  /* ---------- small builders ---------- */
  const row = (inner, cls = '') => `<div class="chg-row ${cls}">${inner}</div>`;
  const section = (title, sub, inner, cls = '') => `<section class="chg-section ${cls}"><div class="chg-section-head"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${inner}</section>`;
  const mark = n => `<span class="chg-mark" aria-hidden="true">${icon(n)}</span>`;
  const linkRow = (title, sub, go) => `<button class="chg-link" onclick="${go}"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${icon('chev')}</button>`;

  function rail(cat, view, cur, isEv) {
    const CH = DATA[cat].CH;
    return `<nav class="journey-stage-rail chg-rail" id="chg-rail" aria-label="${cat} stages">${CH.map((c, i) => {
      const sel = i === view && !isEv, past = i < cur;
      return `<button class="journey-stage ${sel ? 'is-current' : ''} ${i === cur ? 'is-relevant' : ''} ${past ? 'is-recorded' : ''}" onclick="chgGo('chg:${cat}:s:${i}')" ${sel ? 'aria-current="step"' : ''} ${i === cur ? 'data-relevant="true"' : ''} aria-label="${esc(c.rail)}${i === cur ? ', where ' + name() + ' is now' : ''}">${timelineMarker(cat, sel, past)}<span>${esc(c.rail)}</span></button>`;
    }).join('')}</nav>`;
  }

  function sources(cat) {
    return `<details class="sources-disclosure"><summary>Sources behind this guide <span aria-hidden="true">＋</span></summary><div class="source-line">${DATA[cat].SOURCES.map(([t, u]) => `<p><a href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a></p>`).join('')}</div></details>`;
  }

  /* ---------- the category page ---------- */
  function mainPage(cat, view, ev) {
    const D = DATA[cat], cfg = CFG[cat], m = ageNow(), cur = cfg.stage(m);
    if (view == null) view = cur;
    const isEv = ev != null, C = isEv ? D.EV[ev] : D.CH[view], N = isEv ? null : D.CH[view + 1];
    const rel = view < cur ? 'past' : view === cur ? 'now' : 'next';
    const eyebrow = isEv ? C.label + ' · ' + C.when : (rel === 'now' ? 'Around now · ' : rel === 'past' ? 'Earlier · ' : 'Coming up · ') + C.when;
    const A = isEv ? null : alertFor(cat, cur, view);
    const meth = method();

    let h = `<div class="quiet-category chg-page" data-overview="${cat}" style="${yearTheme(cat)}">`;
    h += monthlyPageHeader(cat) + rail(cat, view, cur, isEv);

    h += `<header class="experience-hero chg-hero"><div class="experience-hero-copy"><div class="eyebrow">${esc(eyebrow)}</div><h2>${T(C.title)}</h2></div><span class="experience-hero-art" aria-hidden="true">${yearIllustration(cat, 1)}</span><p class="experience-hero-description">${T(C.lead)}</p></header>`;

    // One observable check-in moves Feeding into solids; age alone never does.
    if (cat === 'Feeding' && !isEv && view === cur && cur === 2 && m >= 6)
      h += `<section class="chg-alert chg-checkin">${mark('feed')}<div><small>Most babies start around now</small><h3>Has ${name()} started solids?</h3><p>Your answer moves this guide to the right stage.</p><div class="chg-checkin-choices"><button onclick="setFeedingStage('preparing')">Not yet</button><button onclick="setFeedingStage('new')">First foods</button><button onclick="setFeedingStage('established')">Eating meals</button></div></div></section>`;
    if (A) h += `<section class="chg-alert">${mark('safety')}<div><small>${T(A.reason)}</small><h3>${T(A.title)}</h3><p>${T(A.body)}</p><button class="chg-btn" onclick="${A.go}">${esc(A.act)}</button></div></section>`;


    if (isEv && C.looks && C.looks.length)
      h += section('What you might notice', '', `<div class="chg-card">${C.looks.map(t => row(`<span class="chg-dot"></span><p>${T(t)}</p>`)).join('')}</div>`);

    h += section('Why it’s happening', '', `<div class="chg-card">${row(mark('bulb') + `<p class="chg-ink">${T(C.why)}</p>`)}${isEv && C.lasts ? row(mark('clock') + `<div><small class="chg-label">How long it lasts</small><p class="chg-ink">${T(C.lasts)}</p></div>`, 'is-tint') : ''}</div>`);

    // rhythm
    const rows = (C.rhythm || []).filter(r => !r[2] || r[2] === 'all' || meth === 'both' || r[2] === meth);
    let rh = '';
    if (rows.length) {
      if (cat === 'Sleep') {
        rh += `<ol class="chg-day">${rows.map(r => { const k = r[0] === 'Awake' ? 'awake' : r[0] === 'Bedtime' ? 'bed' : 'sleep'; return `<li class="is-${k}"><span class="chg-day-pill">${esc(r[0])}</span><span class="chg-day-rule"></span><b>${esc(r[1])}</b></li>`; }).join('')}</ol>`;
      } else {
        rh += `<dl class="chg-amounts">${rows.map(r => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl>`;
      }
    }
    if (C.rhythmNote) rh += `<p class="${rows.length ? 'chg-note' : 'chg-ink'}">${T(C.rhythmNote)}</p>`;
    if (C.night) rh += `<div class="chg-close">${mark(cfg.closeIcon)}<div><small class="chg-label">${cfg.closeTitle}</small><p class="chg-ink">${T(C.night)}</p></div></div>`;
    let sub = '';
    if (!isEv && cat === 'Sleep') sub = 'How long baby is awake between sleeps. ' + esc(C.total) + '.';
    if (!isEv && cat === 'Feeding') sub = esc(C.total || '') + ' Shown for ' + { nurse: 'nursing', bottle: 'bottle feeding', both: 'nursing and bottles' }[meth] + '. <button class="chg-inline" onclick="chgCycleMethod()">Change</button>';
    h += section(isEv ? (cat === 'Sleep' ? 'Naps and nights' : 'Feeds right now') : cfg.rhythmTitle, sub, `<div class="chg-card chg-pad">${rh}</div>`);

    h += section('What helps', '', `<ol class="chg-card chg-steps">${C.helps.map((x, i) => `<li><span class="chg-num">${i + 1}</span><div><h3>${T(x[0])}</h3><p>${T(x[1])}</p></div></li>`).join('')}</ol>`);

    if (C.call) h += `<section class="chg-call">${mark('health')}<div><small>Call your pediatrician if</small><p>${T(C.call)}</p></div></section>`;

    if (!isEv && view === cur) {
      const evs = cfg.events(m);
      if (evs.length) h += section('Also common around now', 'These come and go, on top of the stage above.', evs.map(k => { const e = D.EV[k]; return `<button class="chg-event" onclick="openPage('chg:${cat}:e:${k}')">${mark(cfg.evIcon)}<span><small>${esc(e.label)} · ${esc(e.when)}</small><b>${T(e.title)}</b><em>${T(e.signs)}</em></span>${icon('chev')}</button>`; }).join(''));
    }

    if (isEv) h += `<button class="chg-btn is-quiet" onclick="back()">Back to ${esc(D.CH[cur].rail.toLowerCase())}</button>`;
    else {
      const Q = D.DEC[C.key] || [];
      if (Q.length) h += section(rel === 'now' ? 'Common questions right now' : 'Common questions at this stage', '', `<div class="chg-card">${Q.map((q, i) => `<button class="chg-q" onclick="openPage('chg:${cat}:q:${view}:${i}')">${mark('chat')}<b>${T(q[0])}</b>${icon('chev')}</button>`).join('')}</div>`);
    }

    if (!isEv && !N && C.after) h += `<section class="chg-next is-static">${mark('next')}<span><small>After the first birthday · ${esc(C.after[0])}</small><b>${T(C.after[1])}</b><em>${T(C.after[2])}</em></span></section>`;
    if (!isEv && N && rel !== 'next') h += `<button class="chg-next" onclick="chgGo('chg:${cat}:s:${view + 1}')">${mark('next')}<span><small>Coming up · ${esc(N.when)}</small><b>${T(N.title)}</b><em>Signs it’s starting: ${T(N.signs)}</em></span>${icon('chev')}</button>`;

    // link rows
    let links = '';
    if (cat === 'Sleep') {
      links += linkRow('Safe sleep setup', 'The basics for every nap and night', "openPage('chg:Sleep:safe')");
      if (cur > 0) links += linkRow('Settling and sleep training', 'Helping baby to sleep, or comparing methods', "openPage('chg:Sleep:settle')");
      links += linkRow('When to ask for sleep help', '', "openPage('chg:Sleep:help')");
    } else {
      links += linkRow('Breast milk and formula basics', 'Storage, pumping, formula and vitamin D', "openPage('chg:Feeding:milk')");
      if (view >= 2) {
        links += linkRow('Feeding safety and first aid', 'Choking hazards, gagging and the setup for solids', "openPage('chg:Feeding:safe')");
        links += linkRow('Introducing allergens', 'Peanut, egg and the rest, and what a reaction looks like', "openPage('chg:Feeding:allergy')");
      }
      links += linkRow('When to ask for feeding help', '', "openPage('chg:Feeding:help')");
    }
    h += `<div class="chg-card chg-links">${links}</div>`;
    h += sources(cat);
    h += `<p class="chg-foot">Ages are typical. Every baby moves at their own pace. Pediatric review pending.</p></div>`;
    return h;
  }

  /* ---------- detail screens ---------- */
  function detail(cat, context, title, description, inner, foot) {
    return `<div class="quiet-category chg-page chg-detail" data-overview="${cat}" style="${yearTheme(cat)}">${detailPageTop(cat)}${detailHeading({ context, title, description: T(description), art: yearIllustration(cat, 1) })}${inner}${foot ? `<p class="chg-foot is-left">${foot}</p>` : ''}</div>`;
  }
  function checklist(cat) {
    const list = DATA[cat].SAFE, st = local.safe[cat];
    const n = list.filter((_, i) => st[i]).length;
    return `<div class="chg-section-head is-row"><h2>${cat === 'Sleep' ? 'Your setup' : 'Before the first bite'}</h2><p>${n} of ${list.length} done</p></div><div class="chg-card">${list.map((x, i) => row(`<button class="chg-check ${st[i] ? 'is-on' : ''}" aria-pressed="${!!st[i]}" aria-label="Mark ${esc(x[0])} done" onclick="chgToggleSafe('${cat}',${i})">${st[i] ? icon('check') : ''}</button><div><h3>${T(x[0])}</h3><p>${T(x[1])}</p></div>`)).join('')}</div>`;
  }
  const bullets = list => `<div class="chg-card">${list.map(x => row(`<span class="chg-dot"></span><div><h3>${T(x[0])}</h3><p>${T(x[1])}</p></div>`)).join('')}</div>`;
  const numbered = list => `<ol class="chg-card chg-steps">${list.map((t, i) => `<li><span class="chg-num">${i + 1}</span><div><p class="chg-ink">${T(t)}</p></div></li>`).join('')}</ol>`;
  const tagged = list => `<div class="chg-card">${list.map(x => row(`<div><h3>${T(x[0])} <span class="chg-tag">${esc(x[1])}</span></h3><p>${T(x[2])}</p></div>`)).join('')}</div>`;
  const callout = (label, title, body) => `<section class="chg-call">${mark('health')}<div><small>${label}</small>${title ? `<h3>${title}</h3>` : ''}<p>${body}</p></div></section>`;
  function triage(cat) {
    const tone = ['normal', 'watch', 'call', 'urgent'];
    return `<div class="chg-card">${DATA[cat].TRIAGE.map((x, i) => row(`<div><span class="chg-chip is-${tone[i]}">${esc(x[0])}</span><ul>${x[1].split(' · ').map(t => `<li>${T(t)}</li>`).join('')}</ul></div>`)).join('')}</div>`;
  }

  function sub(cat, screen, a, b) {
    const D = DATA[cat];
    if (cat === 'Sleep' && screen === 'safe') return detail(cat, 'Safe sleep', 'Safe sleep setup', 'Set this up once, before birth or in the first days. It applies to every nap and every night, whichever way you settle baby.',
      checklist(cat) + section('As baby grows', 'We’ll remind you when you tell us about each new skill.', bullets(D.GROW)), 'Based on AAP safe sleep guidance, 2022. Pediatric review pending.');
    if (cat === 'Sleep' && screen === 'settle') return detail(cat, 'Your choice · from 4–6 months', 'Settling and sleep training', 'Helping Maya fall asleep by feeding, rocking or holding is normal at any age. You only need to change it if it isn’t working for your family.',
      section('When to consider it', '', `<div class="chg-card chg-pad"><p class="chg-ink">${T('Most families who try sleep training wait until at least 4–6 months. Check with your pediatrician first, especially if Maya was born early or growth has been a question.')}</p></div>`) +
      section('The approaches', 'From gentlest to most direct. All of them can work.', tagged(D.METH)) + section('Before you start', '', numbered(D.SETTLE_BEFORE)) +
      `<section class="chg-call is-soft">${mark('bulb')}<div><small>Good to know</small><h3>Most methods help within 1–2 weeks</h3><p>Studies that followed families for years haven’t found lasting harm from sleep training, or from choosing not to.</p></div></section>`, 'Pediatric review pending.');
    if (screen === 'help') return detail(cat, cat, cat === 'Sleep' ? 'When to ask for sleep help' : 'When to ask for feeding help',
      cat === 'Sleep' ? 'Most sleep changes are normal and pass. Here’s how to tell when something is worth a call.' : 'Most feeding ups and downs are normal. Here’s how to tell when something is worth a call.',
      triage(cat) + (cat === 'Sleep' ? callout('For you', 'Look after yourself too', 'If exhaustion or low mood is getting hard to manage, talk to your own doctor, or call or text the National Maternal Mental Health Hotline: 1-833-852-6262.')
        : callout('For you', 'Feeding is hard work', 'If nursing hurts or feeding feels overwhelming, a lactation consultant can help, and is often covered by insurance. Asking for help is normal.')),
      (cat === 'Sleep' ? 'Before a visit, note a few nights of bedtime, wakes and feeds.' : 'Before a visit, note a day of feeds and wet diapers.') + ' It helps your pediatrician see the pattern. Pediatric review pending.');
    if (cat === 'Feeding' && screen === 'safe') return detail(cat, 'Before solids · Usually 4–6 months', 'Feeding safety and first aid', 'Set up once, before the first bite. Then keep the hazards list in mind as she moves to finger foods.',
      checklist(cat) + section('Once she’s eating', 'We’ll remind you when she moves to finger foods.', bullets(D.GROW)), 'Based on AAP and CDC guidance. Pediatric review pending.');
    if (cat === 'Feeding' && screen === 'milk') return detail(cat, 'Breast milk, formula or both', 'Breast milk and formula basics', 'Every way of feeding works. Here’s how to store, mix and serve milk safely.',
      section('The essentials', 'What to know, whichever milk you use.', tagged(D.METH)) + section('Every bottle', '', numbered(D.BOTTLE_STEPS)) +
      `<section class="chg-call is-soft">${mark('bulb')}<div><small>Good to know</small><h3>Combination feeding counts too</h3><p>Many families use both breast milk and formula. Choose what works for you, and change if you need to.</p></div></section>`, 'Pediatric review pending.');
    if (cat === 'Feeding' && screen === 'allergy') { const G = D.ALLERGY; return detail(cat, 'Starting solids · Usually around 6 months', 'Introducing allergens', 'Offering common allergens early, and often, lowers the chance of food allergy.',
      `<div class="chg-card chg-pad"><small class="chg-label">The common ones</small><p class="chg-ink">${T(G.foods)}</p></div>` + section('How to start', '', numbered(G.how)) +
      section('If she reacts', '', `<div class="chg-card">${row(`<div><span class="chg-chip is-call">Mild</span><p class="chg-ink">${T(G.mild)}</p></div>`)}${row(`<div><span class="chg-chip is-urgent">Serious</span><p class="chg-ink">${T(G.serious)}</p></div>`)}</div>`) +
      callout('Before you start', '', T(G.ask)), 'Based on NIAID and AAP guidance. Pediatric review pending.'); }
    if (screen === 'q') {
      const view = Number(a), qi = Number(b), stage = D.CH[view], q = (D.DEC[stage.key] || [])[qi];
      if (!q) return mainPage(cat, view, null);
      const key = cat + ':' + stage.key + ':' + qi, ans = local.ans[key];
      let h = `<section class="chg-card chg-pad chg-ask"><h3>${T(q[1])}</h3><div>${q[2].map((o, i) => `<button class="chg-choice ${ans === i ? 'is-on' : ''}" aria-pressed="${ans === i}" onclick="chgAnswer('${key}',${i})">${T(o[0])}</button>`).join('')}</div></section>`;
      if (ans != null && q[2][ans]) {
        const o = q[2][ans];
        h += `<div class="chg-card"><div class="chg-row is-stack"><small class="chg-label">Try this</small><p class="chg-ink">${T(o[1])}</p></div><div class="chg-row is-stack"><small class="chg-label">Good to know</small><p class="chg-ink">${T(o[2])}</p></div></div>`;
        if (o[3] != null) h += `<button class="chg-btn" onclick="openPage('chg:${cat}:e:${o[3]}')">Read about ${T(D.EV[o[3]].title.replace(/^The /, 'the '))}</button>`;
      }
      h += `<button class="chg-btn is-quiet" onclick="back()">Back to ${esc(stage.rail.toLowerCase())}</button>`;
      return detail(cat, view === CFG[cat].stage(ageNow()) ? 'Common questions right now' : 'Common questions · ' + stage.rail, q[0], '', h, CFG[cat].foot);
    }
    return mainPage(cat, null, null);
  }

  /* ---------- routing ---------- */
  window.changesPage = function (cat) { return mainPage(cat, null, null); };
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if (!DATA[cat]) return '';
    if (screen === 's') { const v = Number(a); return mainPage(cat, v === CFG[cat].stage(ageNow()) ? null : v, null); }
    if (screen === 'e') return mainPage(cat, null, Number(a));
    return sub(cat, screen, a, b);
  };
  // Rail taps switch views in place, like tabs; the back button still leaves the category.
  window.chgGo = function (p) { const [, cat, , a] = p.split(':'); page = Number(a) === CFG[cat].stage(ageNow()) ? 'topic:' + cat : p; render(); window.scrollTo(0, 0); };
  window.chgToggleSafe = function (cat, i) { local.safe[cat][i] = !local.safe[cat][i]; save(); const y = scrollY; render(); scrollTo(0, y); };
  window.chgAnswer = function (key, i) { local.ans[key] = i; save(); const y = scrollY; render(); scrollTo(0, y); };
  window.chgCycleMethod = function () { local.method = { nurse: 'bottle', bottle: 'both', both: 'nurse' }[method()]; save(); const y = scrollY; render(); scrollTo(0, y); };
  window.positionChgRail = function () {
    const r = document.getElementById('chg-rail'), s = r && (r.querySelector('[aria-current="step"]') || r.querySelector('[data-relevant="true"]'));
    if (r && s) r.scrollLeft = s.offsetLeft - (r.clientWidth - s.offsetWidth) / 2;
  };
  window.chgStageLabel = function (cat) { const c = DATA[cat].CH[CFG[cat].stage(ageNow())]; return c ? c.rail : ''; };
})();

/* Older Sleep and Feeding routes from the previous prototype now land on the new pages. */
(function () {
  window.chgLegacy = function (p) {
    if (/^sleep-detail:.*:(space|rolling)/.test(p)) return 'chg:Sleep:safe';
    if (/^sleep-detail:.*:help/.test(p)) return 'chg:Sleep:help';
    if (p === 'sleep-stage:prepare' || /^sleep-detail:.*:(training|method|prepare)/.test(p)) return 'chg:Sleep:settle';
    if (/^sleep-(age|stage|phase|detail)/.test(p)) return 'topic:Sleep';
    if (/^feeding-(guide|update)/.test(p)) return 'topic:Feeding';
    return p;
  };
  const toFeeding = () => openPage('topic:Feeding');
  window.openHomeMilkGuide = () => openPage('chg:Feeding:milk');
  window.openFeedingGuide = toFeeding;
  window.openFeedingFiveGuide = toFeeding;
  window.openSleepPhase = () => openPage('topic:Sleep');
})();
