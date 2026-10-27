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
  const freshState = () => ({ safe: { Sleep: {}, Feeding: {} }, method: null, dismissed: {}, ans: {} });
  let local = freshState();
  try { local = Object.assign(local, JSON.parse(localStorage.getItem(STORE)) || {}); } catch (e) {}
  function save() { try { localStorage.setItem(STORE, JSON.stringify(local)); } catch (e) {} }
  window.resetBabyChanges = function () { local = freshState(); save(); };
  window.chgSafeRemaining = cat => DATA[cat].SAFE.filter((_, i) => !local.safe[cat][i]).length;
  window.chgSafeTotal = cat => DATA[cat].SAFE.length;

  const T = s => esc(babyCopy(String(s == null ? '' : s))).replace(/Maya/g, name());
  // Everything developmental follows adjusted age for babies born early (until age 2).
  const ageNow = () => (typeof hubAgeFor === 'function' ? hubAgeFor('care') : developmentMonth());

  /* ---------- where is this baby? ---------- */
  function rolling() { return answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection); }
  function tryingToRoll() { return answers.rollDirection === 'Trying to roll'; }

  /* Stage rules
     Age moves a stage when there's nothing to report (newborn → days and nights → naps).
     A parent's answer moves a stage you can see (two naps, solids, finger foods).
     Once the usual window has passed: Sleep moves on by itself with an undo, Feeding keeps asking.
     A parent can always say "This is where she is now" (an override that lasts until age moves past it). */
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const inFirstSixWeeks = m => m < 2 && (!live() || (NOW - parse(profile.early && profile.due ? profile.due : profile.dob)) / 864e5 < 42);
  // A parent's pick holds (Rule 2). It only drops when the stage table says it no longer fits this age (Rule 4).
  function overridden(cat, computed) {
    const o = live() && local.override && local.override[cat];
    if (!o) return computed;
    const T = window.STAGE_TABLE && STAGE_TABLE[cat], st = T && T.stages[o.i], m = ageNow();
    if (!st || (st.setFrom != null && m < st.setFrom) || (st.setUntil != null && m > st.setUntil)) { delete local.override[cat]; save(); return computed; }
    return o.i;
  }
  window.chgComputedIndex = cat => (cat === 'Sleep' ? sleepComputed(ageNow()) : feedComputed(ageNow()));
  window.chgGetOverride = cat => (local.override && local.override[cat]) ? JSON.parse(JSON.stringify(local.override[cat])) : null;
  window.chgSetOverride = (cat, o) => { local.override = Object.assign({}, local.override); if (o) local.override[cat] = o; else delete local.override[cat]; save(); };
  function sleepComputed(m) {
    if (inFirstSixWeeks(m)) return 0;
    if (m < 4) return 1;
    const said = live() ? answers.twoNaps : null;
    if (said === 'Yes') return 3;                       // the parent told us (Rule 2)
    if (said === 'Stay' || said === 'Not yet') return 2;
    return m >= 9 ? 3 : 2;                              // age guess: most babies take two naps by 9 months (Rule 1)
  }
  function sleepStage(m) {
    return overridden('Sleep', sleepComputed(m));
  }
  // The "we moved her" notice shows for three weeks after the move, then the page simply carries on.
  function autoNoticeFresh() {
    const t = (typeof NOW !== 'undefined' ? NOW : new Date()).getTime();
    local.autoSeen = local.autoSeen || {};
    const k = profile.id || profile.dob; if (!local.autoSeen[k]) { local.autoSeen[k] = t; save(); }
    return t - local.autoSeen[k] <= 21 * 864e5;
  }
  window.chgSleepAuto = function () { const m = ageNow(); return live() && sleepComputed(m) === 3 && answers.twoNaps !== 'Yes' && m >= 9; };
  function sleepEvents(m) { return m >= 3 && m < 6 ? [0] : m >= 8 && m <= 11 ? [1] : []; }
  // Feeding never moves into solids on age alone: a parent answer moves it.
  function feedStage(m) { return overridden('Feeding', feedComputed(m)); }
  function feedComputed(m) {
    const fs = typeof foodStage === 'function' ? foodStage() : 'preparing';
    if (inFirstSixWeeks(m)) return 0;
    if (m < 4) return 1;
    // Unknown solids status from 6 months: show Starting solids and let the check-in find out.
    // Only a parent's "Not yet" keeps the Getting ready guide.
    const known = typeof hasFoodAnswer !== 'function' || hasFoodAnswer();
    // No answer yet: age guess (Rule 1). Most babies start solids by 6 months, textures by 8, family meals by 10.
    // No answer yet: solids stages wait for the parent (Feeding asks). Until then, Preparing for solids.
    // From 9 months with no answer, show the step for the age (and Feeding says so).
    if (!known && live()) return typeof foodAssumed === 'function' && foodAssumed() ? (fs === 'established' ? 5 : 4) : 2;
    // The parent told us (Rule 2). Their answer holds; Home asks again when it may be out of date (Rule 3).
    if (fs === 'preparing') return 2;
    if (fs === 'new') return 3;
    if (fs === 'textures') return 4;
    return 5;
  }
  function feedEvents(m) { return m < 3 ? [0] : m < 7 ? [1] : [2]; }

  const CFG = {
    Sleep: { stage: sleepStage, events: sleepEvents, evIcon: 'moon', rhythmTitle: 'Sleep at a glance', closeTitle: 'At night', closeIcon: 'moon',
      foot: 'If sleep changes come with fever, poor feeding or trouble breathing, call your pediatrician.' },
    Feeding: { stage: feedStage, events: feedEvents, evIcon: 'feed', rhythmTitle: 'How much and how often', closeTitle: 'How to tell it’s enough', closeIcon: 'check',
      foot: 'If feeding changes come with fever, fewer wet diapers or trouble breathing, call your pediatrician.' }
  };

  function method() {
    if (local.method) return local.method;
    return { 'Formula': 'bottle', 'Both': 'both', 'Breast milk': 'nurse' }[profile.feed] || 'both';
  }
  window.resetMilkMethod = function () { delete local.method; save(); };
  window.resetFeedingStageOverride = function () { if (local.override?.Feeding) { delete local.override.Feeding; save(); } };
  window.chgChooseMethod = function (value) {
    if (!['nurse','expressed','bottle','both'].includes(value)) return;
    local.method = value; save(); const y = scrollY; render(); scrollTo(0, y);
    document.getElementById('milk-reference-choice')?.focus();
  };

  /* ---------- the must-know card ---------- */
  function alertFor(cat, cur, view) {
    if (view !== cur) return null;
    const m = ageNow();
    if (cat === 'Sleep') {
      // Age is enough: these come before the skill, and a parent's answer only changes the label.
      if ((rolling() || tryingToRoll() || m >= 3) && answers.swaddleStopped !== 'Yes' && (m <= 6 || answers.swaddleStopped === 'No'))
        return { reason: rolling() || tryingToRoll() ? 'Stop swaddling now' : 'Before the first attempt to roll', title: 'Stop swaddling at the first attempt to roll', body: 'Use regular sleepwear or an unweighted sleep sack with arms free.', act: 'Mark done', done: true, go: "setAnswer('swaddleStopped','Yes')" };
      if (cur === 0) { const n = Object.values(local.safe.Sleep).filter(Boolean).length; return n === DATA.Sleep.SAFE.length ? null : { reason: 'Safe sleep setup', title: n + ' of ' + DATA.Sleep.SAFE.length + ' checked', body: 'Back to sleep, a clear crib in your room, and never on a sofa.', act: 'Open checklist', go: "openPage('chg:Sleep:safe')" }; }
      if ((answers.pullUp === 'Yes' || m >= 8) && answers.mattressLowest !== 'Yes')
        return { reason: answers.pullUp === 'Yes' ? 'You said ' + (profile.name || 'your baby') + ' is pulling up' : 'Before she pulls up', title: 'Set the crib mattress to its lowest', body: 'Remove mobiles and anything she can reach from standing.', act: 'Mark done', done: true, go: "setAnswer('mattressLowest','Yes')" };
      if ((m >= 5 || answers.sit === 'Yes') && answers.mattressLowered !== 'Yes' && answers.mattressLowest !== 'Yes')
        return { reason: answers.sit === 'Yes' ? 'You said baby can sit without support' : 'Prepare before baby can sit up', title: 'Lower the crib mattress', body: 'Move it down before baby can sit. Follow the crib manual for the right position; use the lowest setting before pulling up.', act: 'Mark done', done: true, go: "setAnswer('mattressLowered','Yes')" };
      return null;
    }
    const A = DATA.Feeding.ALERT, key = cur === 0 ? 'newborn' : cur === 2 ? '5' : cur === 4 ? '8' : null;
    if (!key || local.dismissed['feed-' + key]) return null;
    if (key === 'newborn' && method() === 'bottle') return null;
    const a = A[key]; let title = a[1];
    if (key === '5') { const n = Object.values(local.safe.Feeding).filter(Boolean).length; title = n + ' of ' + DATA.Feeding.SAFE.length + ' ready'; }
    const screen = { settle: 'milk', safe: 'safe' }[a[4]] || 'safe';
    return { reason: key === '8' ? 'As textures and self-feeding develop' : a[0], title, body: a[2], act: a[3], go: "openPage('chg:Feeding:" + screen + "')" };
  }

  /* ---------- builders: only the app's own components ----------
     experience-hero · sleep-phase-help (heading + list) · sleep-phase-ahead (heads-up panel)
     sleep-snapshot-patterns + sleep-phase-metrics (data card) · guide-resource-row
     common-questions + faq-toggle · sleep-reference-row · safety-check-list · sources-disclosure */
  const helpList = (title, items) => `<section class="sleep-phase-help">${title ? "<h3>"+title+"</h3>" : ""}<ul>${items.map(([t, b]) => `<li>${t ? `<h4>${T(t)}</h4>` : ''}${b ? `<p>${T(b)}</p>` : ''}</li>`).join('')}</ul></section>`;
  // Pronoun tokens in guide copy: {s} {o} {p} {r} {S} {is} {has} {does}.
  const fmt = str => {
    const pr = typeof babyPronouns === 'function' ? babyPronouns() : { s: 'she', o: 'her', p: 'her', r: 'herself', is: 'is', has: 'has', does: 'does' };
    return String(str || '').replace(/\{(s|o|p|r|S|is|has|does)\}/g, (_, k) => k === 'S' ? pr.s.charAt(0).toUpperCase() + pr.s.slice(1) : pr[k]);
  };
  // The guide for a stage, or the same shape built from a come-and-go phase.
  function guideFor(cat, C, isEv, late) {
    const G = window.AHEAD_GUIDES && window.AHEAD_GUIDES[cat];
    if (!isEv && G) return G[late && G[C.key + '10'] ? C.key + '10' : C.key] || G[C.key] || {};
    return {
      short: C.lead,
      do: C.helps || [],
      know: [['Why it happens', C.why]].concat(C.lasts ? [['How long it lasts', C.lasts]] : []).concat(C.supportNote ? [['Keep in mind', C.supportNote]] : []),
      normal: (C.looks || []).map(t => ['', t]),
      help: C.call ? 'Call your pediatrician if ' + C.call.charAt(0).toLowerCase() + C.call.slice(1) : ''
    };
  }
  // One section of a guide. Items are [title, body] or [title, body, onclick, link label].
  function guideSection(cat, title, items, extra = '', after = '') {
    items = (items || []).filter(Boolean);
    if (!items.length && !extra && !after) return '';
    const list = items.length ? `<ul>${items.map(([t, b, go, label]) => `<li>${t ? `<h4>${T(fmt(t))}</h4>` : ''}${b ? `<p>${T(fmt(b))}</p>` : ''}${go ? `<button class="textlink chg-item-link" onclick="${go}">${T(fmt(label))} →</button>` : ''}</li>`).join('')}</ul>` : '';
    return `<section class="sleep-phase-help chg-guide-section"><h3>${title}</h3>${list}${after}${extra}</section>`;
  }
  const headsUp = (label, title, body, extra = '') => `<section class="sleep-phase-ahead"><h3>${label}</h3><article>${title ? `<h4>${title}</h4>` : ''}${body ? `<p>${body}</p>` : ''}</article>${extra}</section>`;
  const resourceRow = (go, mk, title, sub, arrow = '→') => `<button class="guide-resource-row" onclick="${go}"><span class="guide-resource-mark" aria-hidden="true">${icon(mk)}</span><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span><span aria-hidden="true">${arrow}</span></button>`;
  const refRow = (go, mk, label) => `<button class="textlink sleep-reference-row" onclick="${go}"><span class="sleep-reference-mark" aria-hidden="true">${icon(mk)}</span><span>${label}</span><span aria-hidden="true">→</span></button>`;

  /* Some stages answer one big question, so the page leads with that answer in the format that fits it:
     signs to tick, a checklist, options side by side, normal-versus-call. Other stages use the standard guide. */
  const READY_SIGNS = [
    ['Holds {p} head steady', 'Keeps {p} head up without help.'],
    ['Sits with support', 'Sits upright in a high chair or on your lap.'],
    ['Opens up for food', 'Leans in and opens {p} mouth when you offer a spoon.'],
    ['Swallows food', 'Keeps it in instead of pushing it back out with {p} tongue.']
  ];
  const ALLERGENS = ['Peanut', 'Egg', 'Dairy', 'Wheat', 'Soy', 'Sesame', 'Tree nuts', 'Fish', 'Shellfish'];
  window.chgToggleReady = function (i) { local.ready = local.ready || {}; local.ready[i] = !local.ready[i]; save(); const y = scrollY; render(); scrollTo(0, y); };
  window.chgToggleAllergen = function (k) { local.allergens = local.allergens || {}; local.allergens[k] = !local.allergens[k]; save(); const y = scrollY; render(); scrollTo(0, y); };
  const checkRows = (rows, isOn, go) => `<div class="safety-check-list">${rows.map((x, i) => `<article class="safety-check-row ${isOn(i) ? 'is-done' : ''}"><button class="safety-check-control" role="checkbox" aria-checked="${!!isOn(i)}" aria-label="${esc(fmt(x[0]))}" onclick="${go(i)}"><span aria-hidden="true">${isOn(i) ? '✓' : ''}</span></button><div class="safety-check-copy"><h3>${T(fmt(x[0]))}</h3><p>${T(fmt(x[1]))}</p></div></article>`).join('')}</div>`;
  const leadSection = (title, chip, inner) => `<section class="safety-check-section chg-lead"><div class="safety-check-section-head"><h3>${title}</h3>${chip ? `<span class="safety-check-progress">${chip}</span>` : ''}</div>${inner}</section>`;
  // A stage hub: the next step, then a tile per topic. Each tile opens one short screen.
  const tile = (title, status, go, mk) => `<button style="${yearTheme('Feeding')}" onclick="${go}"><span aria-hidden="true">${icon(mk)}</span><b>${T(fmt(title))}<small>${T(fmt(status))}</small></b><span class="connected-chevron" aria-hidden="true">›</span></button>`;
  const hub = (next, heading, tiles) => `<section class="connected-ahead chg-next"><div class="connected-section-heading"><h2>Your next step</h2></div><div class="connected-ahead-list">${conceptRow({ topic: 'Feeding', title: fmt(next[0]), body: fmt(next[1]), action: next[2], art: 0 })}</div></section>`
    + `<section class="connected-browse chg-tiles"><div class="connected-section-heading"><h2>${heading}</h2></div><div class="connected-category-grid">${tiles.join('')}</div></section>`;
  const readySeen = () => READY_SIGNS.filter((_, i) => (local.ready || {})[i]).length;
  const allergensTried = () => ALLERGENS.filter(k => (local.allergens || {})[k]).length;
  function stageLead(cat, C, view) {
    if (cat !== 'Feeding') return '';
    if (C.key === 'ready') {
      const seen = readySeen(), left = DATA.Feeding.SAFE.filter((_, i) => !local.safe.Feeding[i]).length;
      const next = seen < 4 ? ['Watch for the readiness signs', `${seen} of 4 seen so far. Most babies show all 4 around 6 months.`, "openPage('chg:Feeding:signs')"]
        : left ? ['Get set up for the first bite', `${left} of 4 left: a high chair, first aid and a few basics.`, "openPage('chg:Feeding:safe')"]
        : ['Ready for the first taste', 'Start with an iron-rich food on a calm morning.', `chgGo('chg:Feeding:s:${view + 1}')`];
      return hub(next, 'Before solids start', [
        tile('Readiness signs', `${seen} of 4 seen`, "openPage('chg:Feeding:signs')", 'dev'),
        tile('First-bite setup', left ? `${4 - left} of 4 done` : 'All done', "openPage('chg:Feeding:safe')", 'safety'),
        tile('Purées or baby-led weaning', 'Pick an approach', "openPage('chg:Feeding:approach')", 'question'),
        tile('Milk feeds', 'No change yet', `openPage('chg:Feeding:amounts:${view}')`, 'feed')]);
    }
    if (C.key === 'first') {
      const tried = allergensTried(), nextOne = ALLERGENS.find(k => !(local.allergens || {})[k]);
      const next = !tried ? ['Start with an iron-rich food', 'Mashed beans, soft shredded meat or iron-fortified cereal.', "openPage('chg:Feeding:offer')"]
        : nextOne ? ['Keep introducing allergens', `${tried} of ${ALLERGENS.length} tried. Next up: ${nextOne.toLowerCase()}.`, "openPage('chg:Feeding:allergens')"]
        : ['Keep allergens on the menu', 'Offer each one a few times a week.', "openPage('chg:Feeding:allergens')"];
      return hub(next, 'First foods', [
        tile('Gagging or choking', 'Know the difference', "openPage('chg:Feeding:gag')", 'safety'),
        tile('What to offer', 'Iron-rich first', "openPage('chg:Feeding:offer')", 'feed'),
        tile('Allergens', `${tried} of ${ALLERGENS.length} tried`, "openPage('chg:Feeding:allergens')", 'note'),
        tile('How much', 'A few bites is plenty', `openPage('chg:Feeding:amounts:${view}')`, 'rhythm')]);
    }
    return '';
  }
  // The short screens behind the tiles.
  function stageScreen(screen, a) {
    const ctx = s => `${s} · ${name()}`;
    if (screen === 'signs') {
      const seen = readySeen(), on = i => !!(local.ready || {})[i];
      const note = seen === 4 ? `${name()} shows all 4 signs. Pick a calm morning for the first taste.` : `Most babies show all 4 around 6 months. Wanting your food isn’t a sign on its own.`;
      return detail('Feeding', 'Preparing for solids', `Is ${name()} ready?`, `Tick each sign as you see it. ${seen} of 4 so far.`,
        leadSection('Readiness signs', `${seen} of 4`, checkRows(READY_SIGNS, on, i => `chgToggleReady(${i})`)) + `<p class="chg-lead-note">${T(note)}${profile.early ? ` Since ${T(name())} was born early, check timing with your pediatrician.` : ''}</p>`);
    }
    if (screen === 'approach')
      return detail('Feeding', 'Preparing for solids', 'Purées, baby-led weaning or both', 'There’s no wrong choice. Pick one and adjust as you go.',
        `<div class="chg-options">${[['Purées', 'You spoon small bites, then make them lumpier over time.', 'Good if you want to see how much goes in.'],
          ['Baby-led weaning', 'Soft finger foods {s} picks up {r}.', 'Good if you’re fine with mess and dropped food.'],
          ['Both', 'Spoon some foods, offer others as finger foods.', 'What many families end up doing.']].map(([t, b, g]) => `<article><h4>${T(t)}</h4><p>${T(fmt(b))}</p><b>${T(g)}</b></article>`).join('')}</div>`);
    if (screen === 'gag')
      return detail('Feeding', 'First foods', 'Gagging or choking?', 'Gagging is common while babies learn to eat. Choking is rare, and you need to act fast.',
        `<div class="chg-vs"><article><h4>Gagging</h4><p>Coughing, sputtering, a red face.</p><b>Normal. Stay calm and let ${T(name())} work it out.</b></article><article class="is-urgent"><h4>Choking</h4><p>Silent, can’t cry or cough, turning blue.</p><b>Call 911 and start infant first aid.</b></article></div><button class="textlink chg-item-link" onclick="openPage('chg:Feeding:safe')">Learn infant choking first aid →</button>`);
    if (screen === 'offer')
      return detail('Feeding', 'First foods', 'What to offer first', 'A few bites once or twice a day. Milk is still the main food.',
        `<section class="sleep-phase-help chg-guide-section"><ul>${[['Iron-rich foods', 'Mashed beans, soft shredded meat or iron-fortified cereal.'], ['Soft enough to squash', 'Quarter grapes. Skip whole nuts and popcorn.'], ['{S} decides how much', 'Turning away or closing {p} mouth means done.']].map(([t, b]) => `<li><h4>${T(fmt(t))}</h4><p>${T(fmt(b))}</p></li>`).join('')}</ul></section><p class="chg-lead-note">Not before 12 months: honey, cow’s milk as a drink, and juice.</p>`);
    if (screen === 'allergens') {
      const tried = allergensTried();
      return detail('Feeding', 'First foods', 'Allergens', 'One new allergen at a time, early in the day. Once it goes well, keep offering it a few times a week.',
        leadSection('Tap each one once tried', `${tried} of ${ALLERGENS.length}`, `<div class="chg-choices chg-allergens">${ALLERGENS.map(k => { const v = !!(local.allergens || {})[k]; return `<button class="${v ? 'is-on' : ''}" aria-pressed="${v}" onclick="chgToggleAllergen('${k}')">${v ? '✓ ' : ''}${k}</button>`; }).join('')}</div>`)
        + `<div class="chg-vs"><article><h4>Hives around the mouth</h4><b>Stop the food and call your pediatrician.</b></article><article class="is-urgent"><h4>Swelling or trouble breathing</h4><b>Call 911.</b></article></div><button class="textlink chg-item-link" onclick="openPage('chg:Feeding:allergy')">How to introduce each one →</button>`);
    }
    if (screen === 'amounts') { const v = Number(a); return detail('Feeding', DATA.Feeding.CH[v] ? DATA.Feeding.CH[v].title : 'Feeding', DATA.Feeding.CH[v] && DATA.Feeding.CH[v].key === 'ready' ? 'Milk feeds' : 'How much', DATA.Feeding.CH[v] && DATA.Feeding.CH[v].key === 'ready' ? 'Keep milk feeds as they are until solids start.' : 'A few bites once or twice a day. Milk feeds stay the same.', mainPage('Feeding', v, null, true)); }
    return '';
  }
  const PROMOTED = { 'Feeding:ready': 1, 'Feeding:first': 0 };

  function rail(cat, view, cur, isEv) {
    const CH = DATA[cat].CH;
    return `<nav class="journey-stage-rail chg-rail" id="chg-rail" aria-label="${cat} stages">${CH.map((c, i) => {
      const sel = i === view && !isEv;
      return `<button class="journey-stage ${sel ? 'is-current' : ''} ${i === cur ? 'is-relevant' : ''}" onclick="chgGo('chg:${cat}:s:${i}')" ${sel ? 'aria-current="step"' : ''} ${i === cur ? 'data-relevant="true"' : ''} aria-label="${esc(c.rail)}${i === cur ? ', your current guide' : ''}">${timelineMarker(cat, sel)}<span>${esc(c.rail)}</span></button>`;
    }).join('')}</nav>`;
  }

  function sources(cat, filter = null) {
    const selected = DATA[cat].SOURCES.filter(([title]) => !filter || filter.test(title));
    return `<details class="sources-disclosure"><summary>Sources behind this guide <span aria-hidden="true">＋</span></summary><div class="source-line">${selected.map(([t, u]) => `<p><a href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a></p>`).join('')}</div></details>`;
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
    const cells = [['Total', total ? total + ' h' : '—'], ['Naps', C.key === 'clock' ? 'Many' : C.key === 'daynight' ? 'Varies' : naps || '—'], ['Awake', span || '—'], ['Bedtime', bed || 'Varies']];
    return `<section class="sleep-phase-metrics chg-metrics" aria-label="Sleep at a glance">${cells.map(([k, v]) => `<div><span>${k}</span><strong>${esc(String(v))}</strong></div>`).join('')}<p>Typical range · Includes naps</p></section>`;
  }
  function dayOrder(rows) {
    return `<ol class="chg-day">${rows.map(r => { const k = r[0] === 'Awake' ? 'awake' : r[0] === 'Bedtime' ? 'bed' : 'sleep'; return `<li class="is-${k}"><span>${esc(r[0])}</span><time>${esc(r[1])}</time></li>`; }).join('')}</ol>`;
  }

  // One example, using durations inside the same guide's ranges. Keep the nap
  // count, wake windows and bedtime internally consistent rather than loading
  // a second, unrelated schedule. Early sleep remains a flexible loop.
  function sampleDay(C) {
    if (['clock', 'daynight'].includes(C.key))
      return `<p class="chg-card-note chg-flexible-day">${C.key === 'clock' ? 'Feed, a little awake time, sleep. Then the loop starts again, around the clock.' : 'Feed, a little awake time, sleep. Naps don’t need set times yet.'}</p>`;
    const minutes = value => {
      const normalized = value.replace(/~/g, '').replace(/½/g,'.5').replace(/¼/g,'.25').replace(/¾/g,'.75');
      const values = normalized.match(/\d+(?:\.\d+)?/g).map(Number);
      return Math.round(values.reduce((a,b)=>a+b,0) / values.length * (/min/.test(value) ? 1 : 60));
    };
    const clock = value => { const h=Math.floor(value/60), m=value%60; return `${h%12||12}${m?':'+String(m).padStart(2,'0'):''} ${h<12?'am':'pm'}`; };
    const time = value => `<time datetime="${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}">${clock(value)}</time>`;
    let at=7*60, nap=0;
    const rows=[`<li class="is-awake"><span>Wake up</span>${time(at)}</li>`];
    for (const [label,duration] of C.rhythm) {
      if (label === 'Awake') at+=minutes(duration);
      else if (/nap/i.test(label)) {
        const end=at+minutes(duration); nap++;
        rows.push(`<li class="is-sleep" data-sample-nap="${nap}"><span>${label==='Catnap'?'Catnap':'Nap '+nap}</span><span class="chg-sample-times">${time(at)}–${time(end)}</span></li>`); at=end;
      } else if (label === 'Bedtime') rows.push(`<li class="is-bed"><span>Bedtime</span>${time(at)}</li>`);
    }
    return `<h3 class="chg-sample-title">Example day · ${nap} naps</h3><ol class="chg-day" aria-label="Example day with ${nap} naps">${rows.join('')}</ol>`;
  }

  // The last age in a label like "Usually 4–6 months", "Usually around 6 months" or "Birth–6 weeks", in months.
  function rangeEnd(when) {
    const x = String(when || '').match(/(\d+)\s*(months?|weeks?)\s*$/);
    return x ? (/week/.test(x[2]) ? Number(x[1]) / 4.3 : Number(x[1])) : null;
  }

  /* ---------- the category page ---------- */
  function mainPage(cat, view, ev, onlyRhythm) {
    const D = DATA[cat], cfg = CFG[cat], m = ageNow(), cur = cfg.stage(m);
    if (view == null) view = cur;
    const isEv = ev != null, original = isEv ? D.EV[ev] : D.CH[view], N = isEv ? null : D.CH[view + 1];
    const establishedTwoNaps = cat === 'Sleep' && !isEv && view === 3 && m >= 10;
    const C = establishedTwoNaps ? {...original,
      lead: 'A morning nap and an afternoon nap make up the day. New skills or a short nap may change the timing without changing the number of naps.',
      why: 'Longer awake periods make room for two naps. A disrupted day does not by itself mean baby is ready to drop another nap.',
      rhythmNote: 'Use the morning and afternoon naps as anchors; timing can shift after a short nap.',
      helps: [['After a short or missed nap', 'Offer the next sleep earlier if baby is tired. One disrupted day does not mean the two-nap routine has stopped working.'],
        ['When new skills interrupt sleep', 'Practice new movements during awake time and keep the bedtime sequence familiar. The routine support below covers changes after illness or travel too.']]} : original;
    const rel = view < cur ? 'past' : view === cur ? 'now' : 'next';
    const chosenSleepGuide = cat === 'Sleep' && live() && local.override?.Sleep;
    const eyebrow = isEv ? C.when : rel === 'now' ? (cat === 'Feeding' ? (view <= 1 ? 'Recommended for this age' : hasFoodAnswer() ? 'Based on what you shared' : 'Your feeding guide') : chosenSleepGuide ? 'Your selected sleep guide' : answers.twoNaps === 'Yes' || answers.twoNaps === 'Stay' ? 'Based on your nap pattern' : 'Recommended for this age') : (rel === 'past' ? 'Earlier · ' : 'Coming up · ') + C.when;
    const A = isEv ? null : alertFor(cat, cur, view);
    const meth = method();

    let h = `<div class="quiet-category parent-guide sleep-snapshot chg-page" data-overview="${cat}" style="${yearTheme(cat)}">`;
    h += monthlyPageHeader(cat) + rail(cat, view, cur, isEv);
    const unknownFood = cat === 'Feeding' && !isEv && view === cur && m >= 6 && !hasFoodAnswer();
    const guideNow = guideFor(cat, C, isEv, establishedTwoNaps);
    const lead = unknownFood ? 'Whether you’re getting ready or have already started, this guide covers first foods, what’s safe, allergens and how milk feeds fit in.' : fmt(guideNow.short || C.lead);
    h += `<header class="experience-hero"><div class="experience-hero-copy"><div class="eyebrow">${esc(eyebrow)}</div><h2>${T(C.title)}</h2></div><span class="experience-hero-art" aria-hidden="true">${catIcon(cat)}</span><p class="experience-hero-description">${T(lead)}</p></header>`;

    if (cat === 'Feeding' && !isEv && view === cur && typeof feedingCheckinMarkup === 'function')
      h += feedingCheckinMarkup();

    if (cat === 'Sleep' && !isEv && view === cur && chgSleepAuto() && autoNoticeFresh())
      h += headsUp('Updated for this age', 'Showing two-nap guidance', '', `<button class="textlink chg-headsup-link" onclick="setAnswer('twoNaps','Stay')">Still on three naps? Show Three naps →</button>`);
    // Parents can explore any age. Only an appropriate, observable change
    // offers an update; reading a future age guide is not a stage selection.
    const canUpdate = cat === 'Feeding' ? m >= 4 && view >= 2 : m >= 5 && [2,3].includes(view);
    if (!isEv && view !== cur && live())
      h += `<div class="chg-browse-links">${canUpdate ? `<button class="textlink chg-override" onclick="chgSetStage('${cat}',${view})">${cat === 'Sleep' ? view === 3 ? 'Taking two naps? Update your guide' : 'Still taking three naps? Update your guide' : ({2:'Not started solids? Update your guide',3:'Already started solids? Update your guide',4:'Managing soft lumps or finger foods? Update your guide',5:'Eating regular meals? Update your guide'}[view])}</button>` : ''}<button class="textlink chg-back-now" onclick="chgGo('chg:${cat}:s:${cur}')">← Back to your guide</button></div>`;

    const stage = isEv ? '' : stageLead(cat, C, view);
    if (A && !stage) h += headsUp(T(A.reason), T(A.title), T(A.body), A.done
      ? `<div class="home-action-tools"><button class="home-inline-check" onclick="${A.go}"><span aria-hidden="true"></span>${esc(A.act)}</button></div>`
      : `<button class="textlink chg-headsup-link" onclick="${A.go}">${esc(A.act)} →</button>`);

    // The guide answers the same questions, in the order a parent would ask them:
    // what to do, what to know, what's normal, and when to call. FAQs and sources sit below.
    let rhythmHtml = '', normalExtra = '';
    if (!isEv) {
    // Rhythm card
    let rows = (C.rhythm || []).filter(r => !r[2] || r[2] === 'all' || meth === 'both' || r[2] === meth).map(r => cat === 'Feeding' && C.key === 'meals' && m < 12 && r[0] === 'Milk' && r[2] === 'bottle' ? [r[0], 'About 24 oz a day; follow hunger and fullness cues', r[2]] : cat === 'Feeding' && C.key === 'meals' && m >= 12 && r[0] === 'Milk' && r[2] === 'bottle' ? ['Cow’s milk, if used', '16–24 oz a day; plan the change from formula with your pediatrician', r[2]] : r);
    if (cat === 'Feeding' && meth === 'expressed' && !isEv) {
      rows = rows.filter(r => r[0] !== 'Feeds a day');
      const milkAge = live() ? actualMonth() : m;
      const reference = milkAge < 1 ? [['Breast-milk bottles','Amounts change quickly in the first weeks; follow your discharge feeding plan.']]
        : milkAge <= 6 ? [['Daily breast milk','About 25 oz on average at 1–6 months; needs vary.'],['Bottle example','With 8 milk feeds a day: roughly 3 oz per feed.']]
        : [['Breast-milk bottles','Keep usual milk feeds alongside food; amounts change gradually as eating grows.']];
      rows = [...reference, ...rows];
    }
    if (cat === 'Feeding' && meth === 'bottle') rows=rows.map(r=>r[0]==='Bottles'?['Per formula bottle',r[1]]:r[0]==='Milk'?['Formula',r[1]]:r);
    if (cat === 'Feeding' && meth === 'both') rows = rows.filter(r => !(r[0] === 'Feeds a day' && r[2] === 'bottle')).map(r => {
      if (r[0] === 'Feeds a day') return ['Total milk feeds', r[1]];
      if (r[0] === 'Milk' && r[2] === 'nurse') return ['Nursing', r[1]];
      if (r[0] === 'Milk' && r[2] === 'bottle') return ['Bottles', m < 12 ? 'Amounts depend on how much baby nurses; follow hunger and fullness cues.' : 'Extra milk depends on nursing and meals. Discuss the transition at the 12-month checkup.'];
      if (r[0] === 'Bottles' && r[2] === 'bottle') return ['Formula-only bottle', r[1].replace(', up to 32 oz a day', '')];
      return r;
    });
    const title = isEv ? (cat === 'Sleep' ? 'Naps and nights' : 'Feeds right now') : cfg.rhythmTitle;
    const sub = !isEv && cat === 'Sleep' ? 'Awake time is the stretch between sleeps.' : !isEv && cat === 'Feeding' ? profile.early ? 'General reference. After early birth, follow your pediatrician’s milk and supplement plan.' : esc(C.total || '') : '';
    let card = `<div class="chg-card-head"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;
    if (cat === 'Feeding' && !isEv) card += `<div class="chg-milk-reference"><label for="milk-reference-choice">Milk reference</label><select id="milk-reference-choice" onchange="chgChooseMethod(this.value)">${[['nurse','Nursing'],['expressed','Breast-milk bottles'],['bottle',C.key==='meals'&&m>=12?'Formula to milk':'Formula bottles'],['both','Nursing and bottles']].map(([v,label])=>`<option value="${v}" ${meth===v?'selected':''}>${label}</option>`).join('')}</select></div>`;
    if (cat === 'Sleep' && !isEv) card += sleepMetrics(C);
    if (rows.length) card += cat === 'Sleep' && !isEv ? sampleDay(C) : cat === 'Sleep' ? dayOrder(rows) : `<dl class="chg-amounts">${rows.map(r => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl>`;
    if (C.rhythmNote) card += `<p class="chg-card-note">${T(C.rhythmNote)}</p>`;
    if (C.night) card += `<div class="chg-card-foot" id="${cat === 'Sleep' ? 'sleep-night-feeds' : 'feeding-enough'}"><b>${cfg.closeTitle}</b><p>${T(C.night)}</p></div>`;
    rhythmHtml = `<section class="sleep-snapshot-patterns chg-rhythm">${card}</section>`;
    if (onlyRhythm) return rhythmHtml;

    }

    const fold = (title, inner) => inner ? `<details class="guide-detail chg-fold"><summary>${title} <span aria-hidden="true">＋</span></summary><div class="chg-fold-body">${inner}</div></details>` : '';
    if (stage) {
      if (cat === 'Feeding' && view === cur && m >= 9 && hasFoodAnswer() && ['preparing', 'new'].includes(foodStage()))
        h += resourceRow("openHealthDetail(healthJourneyFocus(),'questions')", 'health', 'Bring your feeding experience to the checkup', 'If first foods are only beginning now, discuss readiness, iron and a plan for building textures.');
      h += stage;
    } else {
      const G = guideFor(cat, C, isEv, establishedTwoNaps);
      // 1. What to do
      let doExtra = '';
      {
        const hBefore = h; h = '';
        if (cat === 'Feeding' && !isEv && view === cur && m >= 9 && hasFoodAnswer() && ['preparing', 'new'].includes(foodStage()))
          h += resourceRow("openHealthDetail(healthJourneyFocus(),'questions')", 'health', 'Bring your feeding experience to the checkup', 'If first foods are only beginning now, discuss readiness, iron and a plan for building textures.');
    
        if (cat === 'Sleep' && !isEv && view === cur && m >= 4) {
          const support = {
            learn:['Settling and sleep training',m<=6?'From around 4–6 months, learn about optional methods before deciding whether to try.':'Compare optional methods, or choose support for the approach you already use.'],
            trying:['Support while sleep training','Look for progress in settling, handle a rough night and know when to review the plan.'],
            routine:['When a familiar routine changes','Adjust after short naps, travel or illness while keeping familiar bedtime cues.'],
            help:['A routine with your help','Build repeatable bedtime cues around feeding, rocking or holding baby to sleep.']
          }[settlingGuide()];
          h += resourceRow("openPage('chg:Sleep:settle')", 'moon', support[0], support[1]);
        }
    
        doExtra = h; h = hBefore;
      }
      h += guideSection(cat, 'What to do', G.do, doExtra + (cat === 'Feeding' && !isEv && C.key === 'first' ? sourceLink('https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html', 'CDC · Food preparation and texture examples') : ''));
      // Everything else sits in rows a parent opens only if they want it, so the page stays one screen of reading.
      const listOf = items => (items || []).filter(Boolean).length ? `<ul class="chg-fold-list">${items.filter(Boolean).map(([t, b, go, label]) => `<li>${t ? `<b>${T(fmt(t))}</b>` : ''}${b ? `<p>${T(fmt(b))}</p>` : ''}${go ? `<button class="textlink chg-item-link" onclick="${go}">${T(fmt(label))} →</button>` : ''}</li>`).join('')}</ul>` : '';
      let more = '';
      more += fold(cat === 'Sleep' ? 'Naps, nights and wake windows' : 'How much and how often', rhythmHtml);
      more += fold(cat === 'Sleep' ? 'Sleep safety and what changes' : 'Safety, allergens and milk', listOf(G.know));
      // 3. What's normal, including the phases that come and go
      if (!isEv && view === cur) {
        const evs = cfg.events(m);
        if (evs.length) normalExtra = `<section class="chg-also"><h3 class="chg-h3">Also common around now</h3>${evs.map(k => { const e = D.EV[k]; return resourceRow(`openPage('chg:${cat}:e:${k}')`, cfg.evIcon, T(e.title), `${esc(e.when)}. ${T(e.signs)}`); }).join('')}</section>`;
      }

      more += fold('What’s normal', listOf(G.normal) + normalExtra);
      if (G.help) more += fold('When to call your pediatrician', `<p>${T(fmt(G.help))}</p><button class="textlink chg-item-link" onclick="openPage('chg:${cat}:help')">How to tell what’s normal →</button>`);
      if (more) h += `<section class="common-questions chg-more">${more}</section>`;
    }

    if (isEv) h += `<button class="textlink chg-back-link" onclick="back()">← Back to ${esc(D.CH[cur].rail.toLowerCase())}</button>`;

    if (!isEv && !N && C.after) h += headsUp(`After the first birthday · ${esc(C.after[0])}`, T(C.after[1]), T(C.after[2]));
    // Coming up: what's next, and a one-tap way to say she's already there.
    if (!isEv && N && rel !== 'next') {
      const elapsed = rangeEnd(N.when) != null && m > rangeEnd(N.when);
      const canReportNext = cat === 'Feeding' ? m >= 4 && view + 1 >= 2 : m >= 5 && view === 2;
      h += headsUp(elapsed ? 'Next step · When baby is ready' : `Coming up · ${esc(N.when)}`, T(N.title), `${T(fmt((window.AHEAD_GUIDES?.[cat]?.[N.key]?.short) || N.signs))}`, `<button class="textlink chg-headsup-link" onclick="chgGo('chg:${cat}:s:${view + 1}')">See what changes →</button>${rel === 'now' && live() && canReportNext ? `<button class="textlink chg-already" onclick="chgSetStage('${cat}',${view + 1})">${cat === 'Feeding' ? ({2:'Still milk-only? Prepare for solids',3:'Already started solids? Update your guide',4:'Managing soft lumps or finger foods? Update your guide',5:'Eating regular meals? Update your guide'}[view + 1]) : 'Taking two naps? Update your guide'}</button>` : ''}`);
    }

    if (!isEv) {
      const Q = D.DEC[C.key] || [];
      if (Q.filter((_, i) => PROMOTED[cat + ':' + C.key] !== i).length) h += `<section class="common-questions"><h2>${rel === 'now' ? 'Common questions right now' : 'Common questions at this stage'}</h2>${Q.map((q, i) => PROMOTED[cat + ':' + C.key] === i ? '' : question(cat, C.key, i, q)).join('')}</section>`;
    }
    let links = '';
    if (cat === 'Sleep') {
      links += refRow("openPage('chg:Sleep:safe')", 'safety', 'Safe sleep setup');
      if (m < 4 || isEv || view !== cur) links += refRow("openPage('chg:Sleep:settle')", 'moon', m < 4 ? 'Sleep training, for later' : 'Settling and sleep training');
      links += refRow("openPage('chg:Sleep:help')", 'health', 'When to ask for sleep help');
    } else {
      links += refRow("openPage('chg:Feeding:milk')", 'feed', 'Breast milk and formula basics');
      if (view >= 2) { links += refRow("openPage('chg:Feeding:safe')", 'safety', 'Feeding safety and first aid'); links += refRow("openPage('chg:Feeding:allergy')", 'note', 'Introducing allergens'); }
      links += refRow("openPage('chg:Feeding:help')", 'health', 'When to ask for feeding help');
    }
    h += `<section class="common-questions chg-more chg-more-guides"><details class="guide-detail chg-fold"><summary>More ${cat === 'Sleep' ? 'sleep' : 'feeding'} guides and sources <span aria-hidden="true">＋</span></summary><div class="chg-fold-body sleep-reference-area">${links}${sources(cat)}</div></details></section>`;
    h += `<p class="exp-footer">Ages are typical. Every baby moves at their own pace.</p></div>`;
    return h;
  }

  // Common questions: the app's accordion, with the one-tap decoder inside it.
  function question(cat, stageKey, i, q) {
    const key = cat + ':' + stageKey + ':' + i, ans = local.ans[key], o = ans != null ? q[2][ans] : null;
    const open = local.open === key ? ' open' : '';
    let inner = q[3] === 'compare'
      ? `<div class="chg-comparison">${q[2].map(x=>`<h4>${T(x[0])}</h4><p>${T(x[1])}</p>`).join('')}<p>${T(q[4])}</p></div>`
      : `<p>${T(q[1])}</p><div class="chg-choices">${q[2].map((x, j) => `<button class="${ans === j ? 'is-on' : ''}" aria-pressed="${ans === j}" onclick="chgAnswer('${key}',${j})">${T(x[0])}</button>`).join('')}</div>`;
    if (o && q[3] !== 'compare') {
      inner += `<p class="chg-answer"><b>${cat === 'Feeding' && stageKey === 'first' && i === 0 && ans === 1 ? 'Act now:' : 'Try this:'}</b> ${T(o[1])}</p>`;
      if (o[2]) inner += `<p class="chg-answer"><b>Good to know:</b> ${T(o[2])}</p>`;
      if (o[3] != null) inner += `<button class="textlink chg-answer-link" onclick="openPage('chg:${cat}:e:${o[3]}')">Read about ${T(DATA[cat].EV[o[3]].title.replace(/^The /, 'the '))} →</button>`;
      if (o[4]) inner += `<button class="textlink chg-answer-link" onclick="openPage('${o[4].route}')">${T(o[4].label)} →</button>`;
    }
    return `<details class="faq-toggle"${open} ontoggle="chgOpen('${key}',this.open)"><summary><span>${T(q[0])}</span><span class="faq-plus" aria-hidden="true">＋</span></summary><div class="faq-answer">${inner}</div></details>`;
  }

  /* ---------- detail screens ---------- */
  function detail(cat, context, title, description, inner, foot) {
    return `<div class="quiet-category parent-guide sleep-snapshot chg-page chg-detail" data-overview="${cat}" style="${yearTheme(cat)}">${detailPageTop(cat)}${detailHeading({ context, title, description: T(description), art: catIcon(cat) })}${inner}${foot ? `<p class="exp-footer">${foot}</p>` : ''}</div>`;
  }
  function checklist(cat) {
    const list = DATA[cat].SAFE, st = local.safe[cat], left = list.filter((_, i) => !st[i]).length;
    return `<section class="safety-check-section"><div class="safety-check-section-head"><h3>${cat === 'Sleep' ? 'Your setup' : 'Before the first bite'}</h3><span class="safety-check-progress">${left ? left + ' left' : 'All done'}</span></div><div class="safety-check-list">${list.map((x, i) => `<article class="safety-check-row ${st[i] ? 'is-done' : ''}"><button class="safety-check-control" role="checkbox" aria-checked="${!!st[i]}" aria-label="Mark done: ${esc(x[0])}" onclick="chgToggleSafe('${cat}',${i})"><span aria-hidden="true">${st[i] ? '✓' : ''}</span></button><div class="safety-check-copy"><h3>${T(x[0])}</h3><p>${T(x[1])}</p></div></article>`).join('')}</div></section>`;
  }
  const callout = (label, title, body) => headsUp(label, title, body);

  function settlingGuide() {
    const valid = ['learn', 'trying', 'routine', 'help'];
    if (valid.includes(local.settlingGuide)) return local.settlingGuide;
    return {in_progress: 'trying', tried: 'trying', trained: 'routine', not_planning: 'help'}[answers.sleepTraining] || 'learn';
  }
  window.chgSettlingGuide = settlingGuide;
  window.chgChooseSettling = function (value) {
    if (!['learn', 'trying', 'routine', 'help'].includes(value)) return;
    local.settlingGuide = value; save();
    const y = scrollY; render(); scrollTo(0, y);
    document.getElementById('settling-guide')?.focus();
  };
  function settlingPage() {
    const choice = settlingGuide(), m = ageNow();
    const options = [['learn','Compare sleep-training methods'],['trying','Support while trying sleep training'],['routine','Keep a routine working'],['help','Settle with my help']];
    let content = '';
    if (choice === 'learn') content = `<p class="chg-settling-intro">Sleep training is optional and is usually considered from 4–6 months. Ask your pediatrician about readiness, especially after early birth or with feeding or growth concerns.</p>` + sleepMethodLearningContent(false) +
      `<details class="guide-detail"><summary>Before you start <span aria-hidden="true">＋</span></summary>${helpList('', [['Choose a response you can repeat', 'Think about how much hands-on soothing you want to offer and what each caregiver can sustain.'],['Keep needed night feeds', 'Choose how to respond between feeds. Learning to settle does not mean baby no longer needs to eat.'],['Know when to pause', 'Respond to illness, discomfort and hunger. If the approach feels unmanageable, stop and review the plan rather than pushing through.']])}</details>`;
    if (choice === 'trying') content = helpList('Look for progress in settling', [
      ['Compare a few nights', 'Is baby taking less time to settle or needing less help? A needed night feed can still be part of progress.'],
      ['After a difficult night', 'Respond to hunger, discomfort or illness. Once those needs are met, use your chosen settling response. One rough night does not call for a new method.'],
      ['If it isn’t getting easier', 'Pause if settling is not improving or the response feels hard to sustain. Bring a few nights of bedtime, wakes and feeds to your pediatrician to review what may be getting in the way.']]);
    if (choice === 'routine') {
      const timing = m < 8 ? 'If naps are short and baby is tired again, keep offering the extra sleep. Don’t drop a nap just because bedtime has improved.' : m < 12 ? 'New movements and separation anxiety can disrupt settling. Practice new skills during awake time and keep the bedtime sequence familiar.' : 'One refused nap does not mean baby is ready for one nap. Look for a repeated pattern before changing the day.';
      content = helpList('Keep what works', [['When naps change', timing], ['After illness or travel', 'Offer the comfort baby needs during the disruption. When it passes, return to familiar bedtime steps and adjust timing around the day’s naps.'],['If sleep stays difficult', 'Notice whether the problem is falling asleep, waking between feeds or staying asleep. Discuss a persistent change, especially with discomfort, feeding or growth concerns.']]);
    }
    if (choice === 'help') content = helpList('Build a routine around your help', [
      ['Keep the lead-in familiar', 'Use a short sequence you can repeat: a feed, diaper change, then a quiet song or book. Feeding, rocking or holding to sleep can remain part of it.'],
      ['Make it repeatable for another caregiver', 'Show them the same steps and the soothing baby responds to. They can offer comfort their own way while keeping familiar cues.'],
      ['If settling is taking longer', 'Check hunger, discomfort and whether the last nap changed. Adjust bedtime to tiredness before adding more steps to the routine.']]);
    const picker = `<div class="chg-settling-picker"><label for="settling-guide">What would help right now?</label><select id="settling-guide" onchange="chgChooseSettling(this.value)">${options.map(([v,t])=>`<option value="${v}" ${choice===v?'selected':''}>${t}</option>`).join('')}</select></div>`;
    return detail('Sleep', ageNow() < 4 ? 'Read ahead' : 'Your approach · Optional', ageNow() < 4 ? 'Sleep training, for later' : 'Settling and sleep training', ageNow() < 4 ? 'Families who sleep train usually start from 4–6 months, if at all. Here’s what the options look like, so you can decide ahead of time.' : 'Choose the guidance you need. Helping baby fall asleep can remain part of your routine.', picker + `<div data-settling-guide="${choice}">${content}</div>` +
      `<details class="sources-disclosure"><summary>Sources behind this guide <span aria-hidden="true">＋</span></summary><p><a href="https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/Getting-Your-Baby-to-Sleep.aspx" target="_blank" rel="noopener">AAP · Settling and nighttime needs ↗</a></p><p><a href="https://health.clevelandclinic.org/when-and-how-to-sleep-train-your-baby" target="_blank" rel="noopener">Cleveland Clinic · Timing and approaches ↗</a></p></details>`, '');
  }

  function sub(cat, screen, a, b) {
    const D = DATA[cat];
    if (cat === 'Feeding') { const st = stageScreen(screen, a); if (st) return st; }
    if (cat === 'Sleep' && screen === 'safe') return detail(cat, 'Safe sleep', 'Safe sleep setup', 'Set this up once, before birth or in the first days. It applies to every nap and every night, whichever way you settle baby.',
      checklist(cat) + helpList('As baby grows', D.GROW).replace('<h4>When baby tries to roll</h4>','<h4 id="sleep-rolling">When baby tries to roll</h4>').replace('<h4>Before baby can sit</h4>','<h4 id="sleep-crib-height">Before baby can sit</h4>') + sources(cat, /AAP/), 'Based on AAP safe sleep guidance, 2022.');
    if (cat === 'Sleep' && screen === 'settle' && ageNow() < 4) return detail(cat, 'The early months', 'Helping baby settle', 'Feeding, rocking or holding can help baby fall asleep while sleep patterns are still developing.',
      helpList('A gentle routine', [['Follow sleepy cues', 'Try settling when baby gets quieter, looks away or yawns. Timing can vary between sleeps.'], ['Keep the steps familiar', 'A feed, diaper change and a quiet song can become a short routine. Keep responding to hunger and comfort needs.']]) + refRow("openPage('chg:Sleep:safe')", 'safety', 'Safe sleep setup'), '');
    if (cat === 'Sleep' && screen === 'settle') return settlingPage();
    if (screen === 'help') return detail(cat, cat, cat === 'Sleep' ? 'When to ask for sleep help' : 'When to ask for feeding help',
      '',
      helpList('How to tell', D.TRIAGE.map(x => [x[0], babyCopy(x[1]).split(' · ').join('. ') + '.'])) +
      (cat === 'Sleep' ? callout('For you', 'Look after yourself too', 'If exhaustion or low mood is getting hard to manage, talk to your own doctor, or call or text the National Maternal Mental Health Hotline: 1-833-852-6262.')
        : callout('For you', 'Feeding is hard work', 'If nursing hurts or feeding feels overwhelming, a lactation consultant can help, and is often covered by insurance. Asking for help is normal.')),
      (cat === 'Sleep' ? 'Before a visit, note a few nights of bedtime, wakes and feeds.' : 'Before a visit, note a day of feeds and wet diapers.') + ' It helps your pediatrician see the pattern.');
    if (cat === 'Feeding' && screen === 'safe') return detail(cat, 'Before the first bite', 'Feeding safety and first aid', 'Prepare the seat and learn first aid before starting. Revisit food preparation as textures and self-feeding change.',
      checklist(cat) + helpList('Once baby is eating', D.GROW), 'Based on AAP and CDC guidance.');
    if (cat === 'Feeding' && screen === 'milk') {
      const type = profile.feed;
      const items = D.METH.filter(x => type === 'Formula' ? !/Breast milk|Pumping/.test(x[0]) : type === 'Breast milk' ? !/formula/i.test(x[0]) : true);
      const title = type === 'Formula' ? 'Formula basics' : type === 'Breast milk' ? 'Breast milk basics' : 'Breast milk and formula basics';
      const bottleSteps = D.BOTTLE_STEPS.map(t => type === 'Formula' ? t.replace(/ Breast milk:.*$/, '') : type === 'Breast milk' ? t.replace(/^Formula:.*? Breast milk:/, 'Breast milk:') : t);
      return detail(cat, 'Your milk reference', title, 'Store, prepare and offer milk safely. Follow any feeding plan your pediatrician has given you.',
        `<section class="common-questions">${question('Feeding','learn',2,D.DEC.learn[2])}</section>` + helpList('The essentials', items.map(x => [x[0] + ' · ' + x[1], x[2]])) + helpList('Every bottle', bottleSteps.map(t => ['', t])) + sources(cat, /storage|preparation|Vitamin D|Spit-up/), '');
    }
    if (cat === 'Feeding' && screen === 'allergy') { const G = D.ALLERGY; return detail(cat, 'Starting solids · Usually around 6 months', 'Introducing allergens', 'Introducing peanut and well-cooked egg alongside other first foods may help prevent those allergies.',
      helpList('The common ones', [['', G.foods]]) + helpList('How to start', G.how.map(t => ['', t])) + helpList('If baby reacts', [['Mild', G.mild], ['Serious', G.serious]]) +
      callout('Before you start', '', T(G.ask)) + sources(cat, /allergens|Starting solid/), 'Based on NIAID and AAP guidance.'); }
    if (screen === 'q') { const v = Number(a), st = D.CH[v]; if (st) local.open = cat + ':' + st.key + ':' + Number(b); return mainPage(cat, v === CFG[cat].stage(ageNow()) ? null : v, null); }
    return mainPage(cat, null, null);
  }

  /* ---------- routing ---------- */
  window.changesPage = function (cat) { return mainPage(cat, null, null); };
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if (!DATA[cat]) return journeyCategories();
    if (screen === 's') { const v = Number(a); return mainPage(cat, Number.isInteger(v) && DATA[cat].CH[v] ? v : null, null); }
    if (screen === 'e') { const v = Number(a); return mainPage(cat, null, Number.isInteger(v) && DATA[cat].EV[v] ? v : null); }
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
  // Change on the timeline. What it sets depends on the stage: an answer where one exists, otherwise a pick.
  window.chgSetStage = function (cat, i) {
    const m = ageNow();
    if (typeof stageCanChange === 'function' && !stageCanChange(cat, i, cat === 'Feeding' ? feedGroup(CFG[cat].stage(m)) : CFG[cat].stage(m))) return chgGo('chg:' + cat + ':s:' + i);
    local.override = Object.assign({}, local.override); delete local.override[cat];
    if (cat === 'Sleep') {
      if (i >= 2 && m >= 4) { answers.twoNaps = i === 3 ? 'Yes' : 'Stay'; persist(); }
      else local.override.Sleep = { i, g: sleepComputed(m) };
    }
    if (cat === 'Feeding') {
      // i is one of the three stages parents see: Milk feeds, Preparing for solids, Solids.
      if (i === 1) { answers.solids = 'Not yet'; delete answers.foodExperience; delete answers.solidsStart; persist(); }
      else if (i === 2) { answers.solids = 'Yes'; if (!answers.solidsStart) answers.solidsStart = iso(NOW); persist(); }
      else local.override.Feeding = { i: inFirstSixWeeks(m) ? 0 : 1, g: feedComputed(m) };
    }
    save();
    // A Change counts as the parent's answer, so Home doesn't ask the same thing straight away.
    if (typeof recordCheckin === 'function') {
      if (cat === 'Sleep' && i >= 2) recordCheckin('naps', i === 3 ? 'Yes' : 'Stay');
      if (cat === 'Feeding' && i >= 1) recordCheckin('food', i === 1 ? 'preparing' : 'new');
    }
    page = 'topic:' + cat; render(); window.scrollTo(0, 0);
  };
  window.chgAnswerCheckin = function (key, value) {
    if (!['food','food-progress','naps'].includes(key)) return;
    if (key !== 'naps' && !['preparing','new','textures','established','hold'].includes(value)) return;
    if (typeof recordCheckin === 'function') recordCheckin(key, value);
    if (key === 'naps') setAnswer('twoNaps', value === 'Yes' ? 'Yes' : 'Not yet');
    if (key === 'food-progress' && value === 'hold') return holdFoodStep();
    if (key === 'food-progress') return acceptFoodStep(value);
    if (key === 'food' || key === 'food-progress') setFeedingStage(value);
  };
  window.chgStageIndex = function (cat) { return CFG[cat].stage(ageNow()); };
  window.chgStageLabel = function (cat) { const i = CFG[cat].stage(ageNow()); if (cat === 'Feeding') return STAGE_TABLE.Feeding.stages[feedGroup(i)].label; const c = DATA[cat].CH[i]; return c ? c.rail : ''; };
  // Internals the summary-and-detail screens (js/hub.js) build on.
  window.__chg = { DATA, CFG, ageNow, method, T, fmt, question, checklist, sources, live, mainPage, sub, sampleDay, guideFor, settlingGuide, alertFor, autoNoticeFresh,
    get local() { return local; }, save, rerender() { const y = scrollY; render(); scrollTo(0, y); } };
})();

/* Older Sleep and Feeding routes from the previous prototype now land on the new pages. */
(function () {
  window.canonicalSavedRoute = function (data) {
    const p = data.route, m = developmentMonth(data.month);
    if (p.startsWith('sleep-phase:')) {
      const i = {newborn:0,daynight:1,maturing:2,naps:2,twonaps:3}[p.split(':')[1]];
      return 'chg:Sleep:s:' + (i == null ? m < 2 ? 0 : m < 4 ? 1 : m < 9 ? 2 : 3 : i);
    }
    if (p.startsWith('sleep-stage:')) return 'chg:Sleep:settle';
    if (p.startsWith('sleep-age')) return 'chg:Sleep:s:' + (m < 2 ? 0 : m < 4 ? 1 : m < 9 ? 2 : 3);
    if (p.startsWith('feeding-guide:')) {
      const i = {milk:m < 2 ? 0 : 1,preparing:2,new:3,established:m < 10 ? 4 : 5}[p.split(':')[1]];
      return 'chg:Feeding:s:' + (i == null ? 2 : i);
    }
    return p;
  };
  window.chgLegacy = function (p) {
    if (/^sleep-detail:.*:(space|rolling)/.test(p)) return 'chg:Sleep:safe';
    if (/^sleep-detail:.*:help/.test(p)) return 'chg:Sleep:help';
    if (p === 'sleep-stage:prepare' || /^sleep-detail:.*:(training|method|prepare)/.test(p)) return 'chg:Sleep:settle';
    if (/^sleep-(age|stage|phase)/.test(p) || p.startsWith('feeding-guide:')) return canonicalSavedRoute({route:p,month});
    if (/^sleep-detail/.test(p)) return 'topic:Sleep';
    if (p === 'feeding-update') return p;
    return p;
  };
  const toFeeding = () => openPage('topic:Feeding');
  window.openHomeMilkGuide = () => openPage('chg:Feeding:milk');
  window.openFeedingGuide = toFeeding;
  window.openFeedingFiveGuide = toFeeding;
  window.openSleepPhase = () => openPage('topic:Sleep');

  const previousSection = openSection;
  window.openSection = openSection = function (topic, id) {
    if (topic === 'Sleep') {
      const part = ['sleep-setup','sleep-rolling','sleep-crib-height'].includes(id) ? 'safe' :
        id === 'sleep-training' ? 'settle' : id === 'sleep-help' ? 'help' : null;
      openPage(part ? 'chg:Sleep:' + part : 'topic:Sleep');
      if (['sleep-night-feeds','sleep-rolling','sleep-crib-height'].includes(id)) revealSection(id);
      return;
    }
    if (topic === 'Feeding') {
      const part = id === 'bottle-handling' || id === 'milk-reference' ? 'milk' :
        /allerg/.test(id) ? 'allergy' : /safety|choking/.test(id) ? 'safe' : null;
      if (part) { openPage('chg:Feeding:' + part); return; }
    }
    return previousSection.apply(this, arguments);
  };
})();

