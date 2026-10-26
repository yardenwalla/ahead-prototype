/* Ahead stage system: one table, one timeline, one way to change a stage.
   Rules are documented in the project doc "ahead-stage-system.md".

   - The timeline shows every stage on a line. The category's illustration sits on the stage you're reading.
   - "Now" and a glow mark the baby's stage. They don't move while you browse.
   - Reading another stage the baby can be set to? "Change" sits above it. Tapping it sets the stage, with Undo.
   - Health has no Change: checkups follow the birthday. Every other stage can be picked, in either direction,
     except the two that would give advice that's wrong for the age (see setFrom / setUntil). */
(function () {
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const ageNow = () => actualMonth();

  // setFrom / setUntil: safety limits only. Outside them, Change isn't offered (the stage can still be read).
  window.STAGE_TABLE = {
    Sleep: { kind: 'pattern', stages: [
      { label: 'Round-the-clock sleep', age: '0–6 weeks', setUntil: 3 },   // swaddling advice: not once a baby can roll
      { label: 'Longer nights', age: '6 wks–4 mo' },
      { label: 'Three naps', age: '4–9 months' },
      { label: 'Two naps', age: '6–12 months' }
    ] },
    Feeding: { kind: 'pattern', stages: [
      { label: 'Newborn feeds', age: '0–6 weeks' },
      { label: 'Milk feeds', age: '6 wks–4 mo' },
      { label: 'Preparing for solids', age: '4–6 months', setFrom: 4 },   // no solids guidance before 4 months
      { label: 'First foods', age: 'Around 6 mo', setFrom: 4 },
      { label: 'More textures', age: '7–9 months', setFrom: 4 },
      { label: 'Family meals', age: '9–12 months', setFrom: 4 }
    ] },
    Safety: { kind: 'skill', stages: [
      { key: 'setup', label: 'First setup', age: '0–3 months' },
      { key: 'reaching', label: 'Reaching and rolling', age: '3–5 months' },
      { key: 'rolling', label: 'Before crawling', age: '5–8 months' },
      { key: 'moving', label: 'Crawling', age: '8–9 months' },
      { key: 'pulling', label: 'Pulling up', age: '9 months+' }
    ] },
    Development: { kind: 'calendar', stages: [
      // Named for the milestone check the stage works toward, so "By 12 months" reads right for a 10-month-old.
      { key: 2, label: 'By 2 months' }, { key: 4, label: 'By 4 months' }, { key: 6, label: 'By 6 months' }, { key: 9, label: 'By 9 months' }, { key: 12, label: 'By 12 months' }
    ] },
    'Daily rhythm': { kind: 'calendar', stages: [
      { label: 'Newborn', age: '0–3 weeks' }, { label: '1–3 months' }, { label: '4–6 months' }, { label: '7–12 months' }
    ] },
    Health: { kind: 'calendar', fixed: true, stages: [0, 1, 2, 4, 6, 9, 12].map(a => ({ key: a, label: a === 0 ? 'First week' : a + (a === 1 ? ' month' : ' months') })) }
  };

  const guideAge = cat => (cat === 'Development' ? developmentMonth(ageNow()) : typeof hubAgeFor === 'function' ? hubAgeFor('care', ageNow()) : ageNow());

  // Can the parent make stage i (index into the table) the baby's stage right now?
  window.stageCanChange = function (cat, i, nowIndex) {
    const T = STAGE_TABLE[cat]; if (!T || T.fixed || !live() || i === nowIndex) return false;
    const s = T.stages[i] || {}, a = guideAge(cat);
    if (s.setFrom != null && a < s.setFrom) return false;
    if (s.setUntil != null && a > s.setUntil) return false;
    return true;
  };

  /* ---------- the timeline ---------- */
  const SCENE = { Development: 4, Feeding: 0, Sleep: 1, Health: 1, Safety: 0, 'Daily rhythm': 1 };
  const esc3 = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Why a stage you're reading can't be picked (shown in grey where Change would be).
  const lockNote = (cat, i) => {
    const T = STAGE_TABLE[cat], s = T && T.stages[i]; if (!s || T.fixed || !live()) return '';
    const a = guideAge(cat);
    if (s.setFrom != null && a < s.setFrom) return 'From ' + s.setFrom + ' months';
    if (s.setUntil != null && a > s.setUntil) return 'Until ' + s.setUntil + ' months';
    return '';
  };
  window.stageTimeline = function (cat, items, label) {
    const art = typeof yearIllustration === 'function' ? yearIllustration(cat, SCENE[cat] || 0) : '';
    const baby = esc3(typeof name === 'function' ? name() : 'your baby');
    return `<nav class="hub-stagebar" id="hub-pills" aria-label="${esc3(label || cat + ' stages')}">${items.map((it, i) => {
      const lock = it.on && !it.now && !it.change ? lockNote(cat, i) : '';
      const top = it.now ? '<span class="hub-stage-top" aria-hidden="true">Now</span>' : it.on && it.change ? `<button class="hub-stage-top is-change" onclick="${it.change}" aria-label="Change ${baby}’s stage to ${esc3(it.label)}">Change</button>` : `<span class="hub-stage-top${lock ? ' is-lock' : ''}">${lock}</span>`;
      // Screen readers hear which stage is the baby's, not just which one is open.
      const sr = it.now ? `<span class="sr-only">, ${baby}’s stage now</span>` : '';
      return `<div class="hub-stage ${it.on ? 'is-on' : ''} ${it.now ? 'is-now' : ''}">${top}<button class="hub-stage-hit" onclick="${it.onclick}" ${it.on ? 'aria-current="step"' : ''}><span class="hub-stage-node" aria-hidden="true">${it.on ? art : ''}</span><span class="hub-stage-name">${esc3(it.label)}</span>${it.age ? `<span class="hub-stage-age">${esc3(it.age)}</span>` : ''}${sr}</button></div>`;
    }).join('')}</nav>`;
  };
  window.positionHubPills = function () {
    const r = document.getElementById('hub-pills'), s = r && r.querySelector('.is-on');
    if (r && s) r.scrollLeft = s.offsetLeft - (r.clientWidth - s.offsetWidth) / 2;
  };

  // The shared building block used by Development, Everyday care, Safety and Health.
  if (window.__hub) {
    window.__hub.pills = function (label, items, cat) {
      return stageTimeline(cat || 'Development', items, label);
    };
  }

  /* ---------- changing a stage, with Undo ---------- */
  function snapshot(cat) {
    return {
      answers: JSON.parse(JSON.stringify(answers)),
      chg: typeof chgGetOverride === 'function' ? chgGetOverride(cat) : null,
      hub: typeof hubStageOverrideRaw === 'function' ? hubStageOverrideRaw(cat === 'Daily rhythm' ? 'Care' : cat) : null
    };
  }
  function restore(cat, s) {
    Object.keys(answers).forEach(k => delete answers[k]);
    Object.assign(answers, s.answers); persist();
    if (typeof chgSetOverride === 'function') chgSetOverride(cat, s.chg);
    if (typeof hubStageOverrideRestore === 'function') hubStageOverrideRestore(cat === 'Daily rhythm' ? 'Care' : cat, s.hub);
  }
  let undoState = null;
  function toast(cat, labelText) {
    if (!document.body || !document.createElement) return;
    document.querySelectorAll('.hub-toast').forEach(t => t.remove());
    const el = document.createElement('div');
    el.className = 'hub-toast'; el.setAttribute('role', 'status');
    el.innerHTML = `<div style="flex:1"><b>${esc3((cat === 'Daily rhythm' ? 'Everyday care' : cat) + ' now follows ' + labelText)}</b></div><button class="hub-toast-undo" onclick="stageUndo()">Undo</button>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    clearTimeout(window.__stageToastT);
    window.__stageToastT = setTimeout(() => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 300); }, 5000);
  }
  window.stageUndo = function () {
    if (!undoState) return;
    const { cat, snap, page: pg } = undoState; undoState = null;
    restore(cat, snap);
    document.querySelectorAll('.hub-toast').forEach(t => t.remove());
    page = pg; render(); scrollTo(0, 0);
  };
  /* ---------- Rule 3: picked stages the baby has outgrown ---------- */
  const GUIDE = { Sleep: 'Sleep', Feeding: 'Feeding', Safety: 'Safety', Development: 'Development', 'Daily rhythm': 'Everyday care' };
  const ageWords = () => { const m = actualMonth(); return m === 0 ? 'a few weeks old' : m === 12 ? '1 year old' : m + (m === 1 ? ' month' : ' months'); };
  window.stageOutgrown = function () {
    if (!live()) return [];
    // Outgrown = the age guess has moved on since the pick, and is now past it. Picking an earlier stage
    // doesn't trigger the question straight away; the baby's age has to move first.
    const out = [], add = (cat, pickI, guessI, guessAtPick) => {
      if (pickI == null || guessI == null || guessI <= pickI || (guessAtPick != null && guessI <= guessAtPick)) return;
      const to = cat === 'Development' ? 'the ' + STAGE_TABLE[cat].stages[guessI].label.replace('By ', '').replace(' months', '-month') + ' guide' : STAGE_TABLE[cat].stages[guessI].label;
      out.push({ cat, question: `${name()} is ${ageWords()} now. Move ${GUIDE[cat]} to ${to}?`, why: `You picked ${STAGE_TABLE[cat].stages[pickI].label}. Most babies have moved on by now, but you know ${name()} best.` });
    };
    ['Sleep', 'Feeding'].forEach(cat => { const o = typeof chgGetOverride === 'function' && chgGetOverride(cat); if (o) add(cat, o.i, chgComputedIndex(cat), o.g); });
    const devKeys = STAGE_TABLE.Development.stages.map(x => x.key);
    const dev = typeof hubStageOverrideRaw === 'function' && hubStageOverrideRaw('Development');
    if (dev && typeof dev === 'object') add('Development', devKeys.indexOf(Number(dev.v)), devKeys.indexOf(hubStageGuess('Development')), devKeys.indexOf(dev.g));
    const care = typeof hubStageOverrideRaw === 'function' && hubStageOverrideRaw('Care');
    if (care && typeof care === 'object') add('Daily rhythm', Number(care.v), hubStageGuess('Care'), care.g);
    const sk = STAGE_TABLE.Safety.stages.map(x => x.key);
    if (sk.includes(answers.safetyPick) && typeof safetyStageGuess === 'function') add('Safety', sk.indexOf(answers.safetyPick), sk.indexOf(safetyStageGuess()), answers.safetyPickGuess);
    return out;
  };
  // "Yes, move on": drop the pick so the guide follows age again.
  window.stageFollowAge = function (cat) {
    if (cat === 'Sleep' || cat === 'Feeding') chgSetOverride(cat, null);
    else if (cat === 'Development') hubSetStage('Development', null, true);
    else if (cat === 'Daily rhythm') hubSetStage('Care', null, true);
    else if (cat === 'Safety') { delete answers.safetyPick; delete answers.safetyPickGuess; persist(); }
  };
  // Telling us about a new movement replaces an older Safety pick (Rule 2: the most recent thing counts).
  if (typeof setAnswer === 'function') {
    const baseSetAnswer = setAnswer;
    window.setAnswer = setAnswer = function (id, a) {
      if (['roll', 'rollDirection', 'crawl', 'pullUp', 'movementGuide'].includes(id)) delete answers.safetyPick;
      return baseSetAnswer(id, a);
    };
  }

  window.hubChangeStage = function (cat, i) {
    const T = STAGE_TABLE[cat]; if (!T) return;
    const snap = snapshot(cat), from = page, s = T.stages[i];
    if (cat === 'Sleep' || cat === 'Feeding') chgSetStage(cat, i, true);
    else if (cat === 'Safety') { answers.safetyPickGuess = STAGE_TABLE.Safety.stages.findIndex(x => x.key === safetyStageGuess()); answers.safetyPick = s.key; persist(); page = 'topic:Safety'; render(); }
    else if (cat === 'Development') { hubSetStage('Development', s.key, true); page = 'topic:Development'; render(); }
    else if (cat === 'Daily rhythm') { hubSetStage('Care', i, true); page = 'topic:Daily rhythm'; render(); }
    scrollTo(0, 0);
    undoState = { cat, snap, page: from };
    toast(cat, s.label);
  };
})();
