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
  // Everything developmental follows adjusted age for babies born early (until age 2).
  const ageNow = () => developmentMonth(actualMonth());

  /* ---------- where is this baby? ---------- */
  function rolling() { return answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection); }
  function tryingToRoll() { return answers.rollDirection === 'Trying to roll'; }

  /* Stage rules
     Age moves a stage when there's nothing to report (newborn → days and nights → naps).
     A parent's answer moves a stage you can see (two naps, solids, finger foods).
     Once the usual window has passed: Sleep moves on by itself with an undo, Feeding keeps asking.
     A parent can always say "This is where she is now" (an override that lasts until age moves past it). */
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  function overridden(cat, computed) {
    const o = live() && local.override && local.override[cat];
    if (!o) return computed;
    if (o.base !== computed) { delete local.override[cat]; save(); return computed; }
    return o.i;
  }
  function sleepComputed(m) {
    if (m < 2) return 0;
    if (m < 4) return 1;
    const said = live() ? answers.twoNaps : null;
    if (said === 'Yes' && m >= 5) return 3;
    if (m >= 9 && said !== 'Stay') return 3;          // window passed: move on, with an undo
    if (!live() && m >= 6) return 3;                  // previewing another month: typical age
    return 2;
  }
  function sleepStage(m) { return overridden('Sleep', sleepComputed(m)); }
  // The "we moved her" notice shows for three weeks after the move, then the page simply carries on.
  function autoNoticeFresh() {
    const t = (typeof NOW !== 'undefined' ? NOW : new Date()).getTime();
    local.autoSeen = local.autoSeen || {};
    const k = profile.dob; if (!local.autoSeen[k]) { local.autoSeen[k] = t; save(); }
    return t - local.autoSeen[k] <= 21 * 864e5;
  }
  window.chgSleepAuto = function () { const m = ageNow(); return live() && sleepComputed(m) === 3 && answers.twoNaps !== 'Yes' && m >= 9; };
  function sleepEvents(m) { return m >= 3 && m < 6 ? [0] : m >= 8 && m <= 11 ? [1] : []; }
  // Feeding never moves into solids on age alone: a parent answer moves it.
  function feedStage(m) { return overridden('Feeding', feedComputed(m)); }
  function feedComputed(m) {
    const fs = typeof foodStage === 'function' ? foodStage() : 'preparing';
    if (m < 2) return 0;
    if (m < 4) return 1;
    if (fs === 'preparing') return 2;
    if (fs === 'new') return m >= 10 ? 5 : m >= 8 ? 4 : 3;   // once solids start, age moves textures and meals
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
      // Age is enough: these come before the skill, and a parent's answer only changes the label.
      if ((rolling() || tryingToRoll() || m >= 3) && answers.swaddleStopped !== 'Yes' && (m <= 6 || answers.swaddleStopped === 'No'))
        return { reason: rolling() ? 'You said ' + name() + ' is rolling' : tryingToRoll() ? 'You said ' + name() + ' is trying to roll' : 'Before she tries to roll', title: 'Stop swaddling at the first attempt to roll', body: 'Use regular sleepwear or an unweighted sleep sack with arms free.', act: 'Mark done', done: true, go: "setAnswer('swaddleStopped','Yes')" };
      if ((answers.pullUp === 'Yes' || m >= 8) && answers.mattressLowest !== 'Yes')
        return { reason: answers.pullUp === 'Yes' ? 'You said ' + name() + ' is pulling up' : 'Before she pulls up', title: 'Set the crib mattress to its lowest', body: 'Remove mobiles and anything she can reach from standing.', act: 'Mark done', done: true, go: "setAnswer('mattressLowest','Yes')" };
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

  /* ---------- builders: only the app's own components ----------
     experience-hero · sleep-phase-help (heading + list) · sleep-phase-ahead (heads-up panel)
     sleep-snapshot-patterns + sleep-phase-metrics (data card) · guide-resource-row
     common-questions + faq-toggle · sleep-reference-row · safety-check-list · sources-disclosure */
  const helpList = (title, items) => `<section class="sleep-phase-help"><h3>${title}</h3><ul>${items.map(([t, b]) => `<li>${t ? `<h4>${T(t)}</h4>` : ''}${b ? `<p>${T(b)}</p>` : ''}</li>`).join('')}</ul></section>`;
  const headsUp = (label, title, body, extra = '') => `<section class="sleep-phase-ahead"><h3>${label}</h3><article>${title ? `<h4>${title}</h4>` : ''}${body ? `<p>${body}</p>` : ''}</article>${extra}</section>`;
  const resourceRow = (go, mk, title, sub, arrow = '→') => `<button class="guide-resource-row" onclick="${go}"><span class="guide-resource-mark" aria-hidden="true">${icon(mk)}</span><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span><span aria-hidden="true">${arrow}</span></button>`;
  const refRow = (go, mk, label) => `<button class="textlink sleep-reference-row" onclick="${go}"><span class="sleep-reference-mark" aria-hidden="true">${icon(mk)}</span><span>${label}</span><span aria-hidden="true">→</span></button>`;

  function rail(cat, view, cur, isEv) {
    const CH = DATA[cat].CH;
    return `<nav class="journey-stage-rail chg-rail" id="chg-rail" aria-label="${cat} stages">${CH.map((c, i) => {
      const sel = i === view && !isEv;
      return `<button class="journey-stage ${sel ? 'is-current' : ''} ${i === cur ? 'is-relevant' : ''}" onclick="chgGo('chg:${cat}:s:${i}')" ${sel ? 'aria-current="step"' : ''} ${i === cur ? 'data-relevant="true"' : ''} aria-label="${esc(c.rail)}${i === cur ? ', your current guide' : ''}">${timelineMarker(cat, sel)}<span>${esc(c.rail)}</span></button>`;
    }).join('')}</nav>`;
  }

  function sources(cat) {
    return `<details class="sources-disclosure"><summary>Sources behind this guide <span aria-hidden="true">＋</span></summary><div class="source-line">${DATA[cat].SOURCES.map(([t, u]) => `<p><a href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a></p>`).join('')}</div></details>`;
  }

  // Sleep's rhythm card: the app's four-number strip, then the day in order.
  function sleepMetrics(C) {
    const rows = C.rhythm, naps = rows.filter(r => /nap/i.test(r[0])).length, awake = rows.filter(r => r[0] === 'Awake').map(r => r[1]);
    const bed = (rows.find(r => r[0] === 'Bedtime') || [, ''])[1].replace(/^often /, '');
    const total = (C.total.match(/(\d+–\d+)/) || [, ''])[1];
    const num = v => v.replace(/^~/, '').replace(/\s*(h|min)$/, '').split('–');
    const unit = awake.length && /min/.test(awake[0]) ? ' min' : ' h';
    const lo = awake.length ? num(awake[0])[0] : '', hi = awake.length ? num(awake[awake.length - 1]).slice(-1)[0] : '';
    const span = awake.length ? (lo === hi ? lo : lo + '–' + hi) + unit : '';
    const cells = [['Total', total ? total + ' h' : '—'], ['Naps', C.key === 'clock' ? 'Many' : naps || '—'], ['Awake', span || '—'], ['Bedtime', bed || 'Varies']];
    return `<section class="sleep-phase-metrics chg-metrics" aria-label="Sleep at a glance">${cells.map(([k, v]) => `<div><span>${k}</span><strong>${esc(String(v))}</strong></div>`).join('')}<p>Typical range · Includes naps</p></section>`;
  }
  function dayOrder(rows) {
    return `<ol class="chg-day">${rows.map(r => { const k = r[0] === 'Awake' ? 'awake' : r[0] === 'Bedtime' ? 'bed' : 'sleep'; return `<li class="is-${k}"><span>${esc(r[0])}</span><time>${esc(r[1])}</time></li>`; }).join('')}</ol>`;
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

    let h = `<div class="quiet-category parent-guide sleep-snapshot chg-page" data-overview="${cat}" style="${yearTheme(cat)}">`;
    h += monthlyPageHeader(cat) + rail(cat, view, cur, isEv);
    h += `<header class="experience-hero"><div class="experience-hero-copy"><div class="eyebrow">${esc(eyebrow)}</div><h2>${T(C.title)}</h2></div><span class="experience-hero-art" aria-hidden="true">${yearIllustration(cat, 1)}</span><p class="experience-hero-description">${T(C.lead)}</p></header>`;

    // One check-in moves Feeding into solids, at most once a month; age alone never does.
    if (cat === 'Feeding' && !isEv && view === cur && cur === 2 && m >= 6 && (typeof checkinDue !== 'function' || checkinDue('food', ['preparing'])))
      h += `<section class="connected-checkin chg-checkin"><div><h2>${m >= 9 ? 'Most babies have started solids by now' : `Has ${name()} started solids?`}</h2></div><p>${m >= 9 ? `Tell us where ${name()} is, and this guide will catch up.` : 'Your answer moves this guide to the right stage. We’ll check again next month.'}${profile.early ? ' Born early? Your care team may suggest a different time.' : ''}</p><div class="connected-checkin-choices"><button onclick="chgAnswerCheckin('food','preparing')">Not yet</button><button onclick="chgAnswerCheckin('food','new')">First foods</button><button onclick="chgAnswerCheckin('food','established')">Eating meals</button></div></section>`;

    if (cat === 'Sleep' && !isEv && view === cur && chgSleepAuto() && autoNoticeFresh())
      h += headsUp(`Most babies are on two naps by now`, `We moved ${name()} to Two naps`, '', `<button class="textlink chg-headsup-link" onclick="setAnswer('twoNaps','Stay')">Still on three naps? Keep ${name()} on Naps find a rhythm →</button>`);
    // Browsing another stage: correct it, or go back to where she is now.
    if (!isEv && view !== cur && live())
      h += `<div class="chg-browse-links"><button class="textlink chg-override" onclick="chgSetStage('${cat}',${view})">This is where ${name()} is now</button><button class="textlink chg-back-now" onclick="chgGo('chg:${cat}:s:${cur}')">← Back to where ${name()} is now</button></div>`;

    if (A) h += headsUp(T(A.reason), T(A.title), T(A.body), A.done
      ? `<div class="home-action-tools"><button class="home-inline-check" onclick="${A.go}"><span aria-hidden="true"></span>${esc(A.act)}</button></div>`
      : `<button class="textlink chg-headsup-link" onclick="${A.go}">${esc(A.act)} →</button>`);

    if (isEv && C.looks && C.looks.length) h += helpList('What you might notice', C.looks.map(t => ['', t]));
    h += helpList('Why it’s happening', [['', C.why]].concat(isEv && C.lasts ? [['How long it lasts', C.lasts]] : []));

    // Rhythm card
    const rows = (C.rhythm || []).filter(r => !r[2] || r[2] === 'all' || meth === 'both' || r[2] === meth);
    const title = isEv ? (cat === 'Sleep' ? 'Naps and nights' : 'Feeds right now') : cfg.rhythmTitle;
    const sub = !isEv && cat === 'Sleep' ? 'How long baby is awake between sleeps.' : !isEv && cat === 'Feeding' ? `${esc(C.total || '')} Shown for ${{ nurse: 'nursing', bottle: 'bottle feeding', both: 'nursing and bottles' }[meth]}. <button class="textlink chg-inline" onclick="chgCycleMethod()">Change</button>` : '';
    let card = `<div class="chg-card-head"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;
    if (cat === 'Sleep' && !isEv) card += sleepMetrics(C);
    if (rows.length) card += cat === 'Sleep' ? dayOrder(rows) : `<dl class="chg-amounts">${rows.map(r => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl>`;
    if (C.rhythmNote) card += `<p class="chg-card-note">${T(C.rhythmNote)}</p>`;
    if (C.night) card += `<div class="chg-card-foot"><b>${cfg.closeTitle}</b><p>${T(C.night)}</p></div>`;
    h += `<section class="sleep-snapshot-patterns chg-rhythm">${card}</section>`;

    h += helpList('What helps', C.helps);

    if (C.call) h += resourceRow("openPage('chg:" + cat + ":help')", 'health', 'Call your pediatrician if', T(C.call));

    if (!isEv && view === cur) {
      const evs = cfg.events(m);
      if (evs.length) h += `<section class="chg-also"><h3 class="chg-h3">Also common around now</h3><p class="chg-sub">These come and go, on top of the stage above.</p>${evs.map(k => { const e = D.EV[k]; return resourceRow(`openPage('chg:${cat}:e:${k}')`, cfg.evIcon, T(e.title), `${esc(e.label)} · ${esc(e.when)}. ${T(e.signs)}`); }).join('')}</section>`;
    }

    if (isEv) h += `<button class="textlink chg-back-link" onclick="back()">← Back to ${esc(D.CH[cur].rail.toLowerCase())}</button>`;
    else {
      const Q = D.DEC[C.key] || [];
      if (Q.length) h += `<section class="common-questions"><h2>${rel === 'now' ? 'Common questions right now' : 'Common questions at this stage'}</h2>${Q.map((q, i) => question(cat, C.key, i, q)).join('')}</section>`;
    }

    if (!isEv && !N && C.after) h += headsUp(`After the first birthday · ${esc(C.after[0])}`, T(C.after[1]), T(C.after[2]));
    // Coming up: what's next, and a one-tap way to say she's already there.
    if (!isEv && N && rel !== 'next') h += headsUp(`Coming up · ${esc(N.when)}`, T(N.title), `Signs it’s starting: ${T(N.signs)}`, `<button class="textlink chg-headsup-link" onclick="chgGo('chg:${cat}:s:${view + 1}')">See what changes →</button>${rel === 'now' && live() ? `<button class="textlink chg-already" onclick="chgSetStage('${cat}',${view + 1})">Already there? Move ${name()} to ${esc(N.rail)}</button>` : ''}`);

    let links = '';
    if (cat === 'Sleep') {
      links += refRow("openPage('chg:Sleep:safe')", 'safety', 'Safe sleep setup');
      if (cur > 0) links += refRow("openPage('chg:Sleep:settle')", 'moon', 'Settling and sleep training');
      links += refRow("openPage('chg:Sleep:help')", 'health', 'When to ask for sleep help');
    } else {
      links += refRow("openPage('chg:Feeding:milk')", 'feed', 'Breast milk and formula basics');
      if (view >= 2) { links += refRow("openPage('chg:Feeding:safe')", 'safety', 'Feeding safety and first aid'); links += refRow("openPage('chg:Feeding:allergy')", 'note', 'Introducing allergens'); }
      links += refRow("openPage('chg:Feeding:help')", 'health', 'When to ask for feeding help');
    }
    h += `<div class="sleep-reference-area"><p class="sleep-reference-label">References</p>${links}${sources(cat)}</div>`;
    h += `<p class="exp-footer">Ages are typical. Every baby moves at their own pace.</p></div>`;
    return h;
  }

  // Common questions: the app's accordion, with the one-tap decoder inside it.
  function question(cat, stageKey, i, q) {
    const key = cat + ':' + stageKey + ':' + i, ans = local.ans[key], o = ans != null ? q[2][ans] : null;
    const open = local.open === key ? ' open' : '';
    let inner = `<p>${T(q[1])}</p><div class="chg-choices">${q[2].map((x, j) => `<button class="${ans === j ? 'is-on' : ''}" aria-pressed="${ans === j}" onclick="chgAnswer('${key}',${j})">${T(x[0])}</button>`).join('')}</div>`;
    if (o) {
      inner += `<p class="chg-answer"><b>Try this:</b> ${T(o[1])}</p><p class="chg-answer"><b>Good to know:</b> ${T(o[2])}</p>`;
      if (o[3] != null) inner += `<button class="textlink chg-answer-link" onclick="openPage('chg:${cat}:e:${o[3]}')">Read about ${T(DATA[cat].EV[o[3]].title.replace(/^The /, 'the '))} →</button>`;
    }
    return `<details class="faq-toggle"${open} ontoggle="chgOpen('${key}',this.open)"><summary><span>${T(q[0])}</span><span class="faq-plus" aria-hidden="true">＋</span></summary><div class="faq-answer">${inner}</div></details>`;
  }

  /* ---------- detail screens ---------- */
  function detail(cat, context, title, description, inner, foot) {
    return `<div class="quiet-category parent-guide sleep-snapshot chg-page chg-detail" data-overview="${cat}" style="${yearTheme(cat)}">${detailPageTop(cat)}${detailHeading({ context, title, description: T(description), art: yearIllustration(cat, 1) })}${inner}${foot ? `<p class="exp-footer">${foot}</p>` : ''}</div>`;
  }
  function checklist(cat) {
    const list = DATA[cat].SAFE, st = local.safe[cat], left = list.filter((_, i) => !st[i]).length;
    return `<section class="safety-check-section"><div class="safety-check-section-head"><h3>${cat === 'Sleep' ? 'Your setup' : 'Before the first bite'}</h3><span class="safety-check-progress">${left ? left + ' left' : 'All done'}</span></div><div class="safety-check-list">${list.map((x, i) => `<article class="safety-check-row ${st[i] ? 'is-done' : ''}"><button class="safety-check-control" role="checkbox" aria-checked="${!!st[i]}" aria-label="Mark done: ${esc(x[0])}" onclick="chgToggleSafe('${cat}',${i})"><span aria-hidden="true">${st[i] ? '✓' : ''}</span></button><div class="safety-check-copy"><h3>${T(x[0])}</h3><p>${T(x[1])}</p></div></article>`).join('')}</div></section>`;
  }
  const callout = (label, title, body) => headsUp(label, title, body);

  function sub(cat, screen, a, b) {
    const D = DATA[cat];
    if (cat === 'Sleep' && screen === 'safe') return detail(cat, 'Safe sleep', 'Safe sleep setup', 'Set this up once, before birth or in the first days. It applies to every nap and every night, whichever way you settle baby.',
      checklist(cat) + helpList('As baby grows', D.GROW), 'Based on AAP safe sleep guidance, 2022.');
    if (cat === 'Sleep' && screen === 'settle') return detail(cat, 'Your choice · from 4–6 months', 'Settling and sleep training', 'Helping Maya fall asleep by feeding, rocking or holding is normal at any age. You only need to change it if it isn’t working for your family.',
      helpList('When to consider it', [['', 'Most families who try sleep training wait until at least 4–6 months. Check with your pediatrician first, especially if Maya was born early or growth has been a question.']]) +
      helpList('The approaches', D.METH.map(x => [x[0] + ' · ' + x[1], x[2]])) + helpList('Before you start', D.SETTLE_BEFORE.map(t => ['', t])) +
      callout('Good to know', 'Most methods help within 1–2 weeks', 'Studies that followed families for years haven’t found lasting harm from sleep training, or from choosing not to.'), '');
    if (screen === 'help') return detail(cat, cat, cat === 'Sleep' ? 'When to ask for sleep help' : 'When to ask for feeding help',
      cat === 'Sleep' ? 'Most sleep changes are normal and pass. Here’s how to tell when something is worth a call.' : 'Most feeding ups and downs are normal. Here’s how to tell when something is worth a call.',
      helpList('How to tell', D.TRIAGE.map(x => [x[0], x[1].split(' · ').join('. ') + '.'])) +
      (cat === 'Sleep' ? callout('For you', 'Look after yourself too', 'If exhaustion or low mood is getting hard to manage, talk to your own doctor, or call or text the National Maternal Mental Health Hotline: 1-833-852-6262.')
        : callout('For you', 'Feeding is hard work', 'If nursing hurts or feeding feels overwhelming, a lactation consultant can help, and is often covered by insurance. Asking for help is normal.')),
      (cat === 'Sleep' ? 'Before a visit, note a few nights of bedtime, wakes and feeds.' : 'Before a visit, note a day of feeds and wet diapers.') + ' It helps your pediatrician see the pattern.');
    if (cat === 'Feeding' && screen === 'safe') return detail(cat, 'Before solids · Usually 4–6 months', 'Feeding safety and first aid', 'Set up once, before the first bite. Then keep the hazards list in mind as she moves to finger foods.',
      checklist(cat) + helpList('Once she’s eating', D.GROW), 'Based on AAP and CDC guidance.');
    if (cat === 'Feeding' && screen === 'milk') return detail(cat, 'Breast milk, formula or both', 'Breast milk and formula basics', 'Every way of feeding works. Here’s how to store, mix and serve milk safely.',
      helpList('The essentials', D.METH.map(x => [x[0] + ' · ' + x[1], x[2]])) + helpList('Every bottle', D.BOTTLE_STEPS.map(t => ['', t])) +
      callout('Good to know', 'Combination feeding counts too', 'Many families use both breast milk and formula. Choose what works for you, and change if you need to.'), '');
    if (cat === 'Feeding' && screen === 'allergy') { const G = D.ALLERGY; return detail(cat, 'Starting solids · Usually around 6 months', 'Introducing allergens', 'Offering common allergens early, and often, lowers the chance of food allergy.',
      helpList('The common ones', [['', G.foods]]) + helpList('How to start', G.how.map(t => ['', t])) + helpList('If she reacts', [['Mild', G.mild], ['Serious', G.serious]]) +
      callout('Before you start', '', T(G.ask)), 'Based on NIAID and AAP guidance.'); }
    if (screen === 'q') { const v = Number(a), st = D.CH[v]; if (st) local.open = cat + ':' + st.key + ':' + Number(b); return mainPage(cat, v === CFG[cat].stage(ageNow()) ? null : v, null); }
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
  window.chgNotYet = function (k) { local.notYet = Object.assign({}, local.notYet, { [k]: Date.now() }); save(); const y = scrollY; render(); scrollTo(0, y); };
  window.chgOpen = function (key, open) { if (open) local.open = key; else if (local.open === key) local.open = null; };
  window.chgAnswer = function (key, i) { local.ans[key] = i; local.open = key; save(); const y = scrollY; render(); scrollTo(0, y); };
  window.chgCycleMethod = function () { local.method = { nurse: 'bottle', bottle: 'both', both: 'nurse' }[method()]; save(); const y = scrollY; render(); scrollTo(0, y); };
  window.positionChgRail = function () {
    const r = document.getElementById('chg-rail'), s = r && (r.querySelector('[aria-current="step"]') || r.querySelector('[data-relevant="true"]'));
    if (r && s) r.scrollLeft = s.offsetLeft - (r.clientWidth - s.offsetWidth) / 2;
  };
  // "This is where she is now": sets the parent's answer where one exists, otherwise an override.
  window.chgSetStage = function (cat, i) {
    const m = ageNow();
    if (cat === 'Sleep') {
      if (i === 3) { if (local.override) delete local.override.Sleep; save(); return setAnswer('twoNaps', 'Yes'); }
      if (i === 2 && m >= 4) { if (local.override) delete local.override.Sleep; save(); answers.twoNaps = 'Stay'; persist(); }
      else { local.override = Object.assign({}, local.override, { Sleep: { i, base: sleepComputed(m) } }); save(); }
    }
    if (cat === 'Feeding') {
      if (local.override) delete local.override.Feeding;
      if (i >= 3) { save(); setFeedingStage(i === 3 ? 'new' : 'established'); if (i === 5 && feedComputed(m) !== 5) { local.override = Object.assign({}, local.override, { Feeding: { i, base: feedComputed(m) } }); save(); } }
      else if (i === 2 && m >= 4) { save(); setFeedingStage('preparing'); }
      else { local.override = Object.assign({}, local.override, { Feeding: { i, base: feedComputed(m) } }); save(); }
    }
    page = 'topic:' + cat; render(); window.scrollTo(0, 0);
  };
  window.chgAnswerCheckin = function (key, value) {
    if (typeof recordCheckin === 'function') recordCheckin(key, value);
    if (key === 'naps') setAnswer('twoNaps', value === 'Yes' ? 'Yes' : 'Not yet');
    if (key === 'food') setFeedingStage(value);
  };
  window.chgStageIndex = function (cat) { return CFG[cat].stage(ageNow()); };
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
