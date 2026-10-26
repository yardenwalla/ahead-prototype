/* Ahead stage system: one table, one timeline, one way to change a stage.
   Rules are documented in the project doc "ahead-stage-system.md".

   - The timeline shows every stage on a line. The category's illustration sits on the stage you're reading.
   - "Now" and a glow mark the baby's stage. They don't move while you browse.
   - Reading another stage the baby can be set to? "Change" sits above it. Tapping it sets the stage, with Undo.
   - Health has no Change: checkups follow the birthday. Safety only offers Change on stages ahead (forward only). */
(function () {
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const ageNow = () => actualMonth();

  // setFrom / setUntil: the ages (in months, by the age each guide follows) when Change is offered.
  window.STAGE_TABLE = {
    Sleep: { kind: 'pattern', stages: [
      { label: 'Newborn', age: '0–6 weeks', setUntil: 3 },
      { label: 'Days and nights', age: '6 wks–4 mo', setUntil: 6 },
      { label: 'Three naps', age: '4–9 months', setFrom: 4 },
      { label: 'Two naps', age: '6–12 months', setFrom: 5 }
    ] },
    Feeding: { kind: 'pattern', stages: [
      { label: 'Newborn', age: '0–6 weeks', setUntil: 3 },
      { label: 'Milk feeds', age: '6 wks–4 mo', setUntil: 6 },
      { label: 'Getting ready', age: '4–6 months', setFrom: 4 },
      { label: 'Starting solids', age: 'Around 6 mo', setFrom: 4 },
      { label: 'Textures', age: '7–9 months', setFrom: 6 },
      { label: 'Family meals', age: '9–12 months', setFrom: 8 }
    ] },
    Safety: { kind: 'skill', stages: [
      { key: 'setup', label: 'First setup', age: '0–3 months' },
      { key: 'reaching', label: 'Reaching and rolling', age: '3–5 months' },
      { key: 'rolling', label: 'Before crawling', age: '5–8 months' },
      { key: 'moving', label: 'Crawling', age: '8–9 months' },
      { key: 'pulling', label: 'Pulling up', age: '9 months+' }
    ] },
    Development: { kind: 'calendar', stages: [
      { key: 2, label: '2 months' }, { key: 4, label: '4 months' }, { key: 6, label: '6 months' }, { key: 9, label: '9 months' }, { key: 12, label: '1 year' }
    ] },
    'Daily rhythm': { kind: 'calendar', stages: [
      { label: 'Newborn', age: '0–3 weeks' }, { label: '1–3 months' }, { label: '4–6 months' }, { label: '7–12 months' }
    ] },
    Health: { kind: 'calendar', fixed: true, stages: [0, 1, 2, 4, 6, 9, 12].map(a => ({ key: a, label: a === 0 ? 'First week' : a === 12 ? '1 year' : a + (a === 1 ? ' month' : ' months') })) }
  };

  const guideAge = cat => (cat === 'Development' ? developmentMonth(ageNow()) : typeof hubAgeFor === 'function' ? hubAgeFor('care', ageNow()) : ageNow());

  // Can the parent make stage i (index into the table) the baby's stage right now?
  window.stageCanChange = function (cat, i, nowIndex) {
    const T = STAGE_TABLE[cat]; if (!T || T.fixed || !live() || i === nowIndex) return false;
    if (T.kind === 'skill') return i > nowIndex;
    const s = T.stages[i] || {}, a = guideAge(cat);
    if (s.setFrom != null && a < s.setFrom) return false;
    if (s.setUntil != null && a > s.setUntil) return false;
    return true;
  };

  /* ---------- the timeline ---------- */
  const SCENE = { Development: 4, Feeding: 0, Sleep: 1, Health: 1, Safety: 0, 'Daily rhythm': 1 };
  const esc3 = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  window.stageTimeline = function (cat, items, label) {
    const art = typeof yearIllustration === 'function' ? yearIllustration(cat, SCENE[cat] || 0) : '';
    return `<nav class="hub-stagebar" id="hub-pills" aria-label="${esc3(label || cat + ' stages')}">${items.map(it => {
      const top = it.now ? '<span class="hub-stage-top">Now</span>' : it.on && it.change ? `<button class="hub-stage-top is-change" onclick="${it.change}" aria-label="Change ${esc3(name())}’s stage to ${esc3(it.label)}">Change</button>` : '<span class="hub-stage-top"></span>';
      return `<div class="hub-stage ${it.on ? 'is-on' : ''} ${it.now ? 'is-now' : ''}">${top}<button class="hub-stage-hit" onclick="${it.onclick}" ${it.on ? 'aria-current="step"' : ''}><span class="hub-stage-node" aria-hidden="true">${it.on ? art : ''}</span><span class="hub-stage-name">${esc3(it.label)}</span>${it.age ? `<span class="hub-stage-age">${esc3(it.age)}</span>` : ''}</button></div>`;
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
  window.hubChangeStage = function (cat, i) {
    const T = STAGE_TABLE[cat]; if (!T) return;
    const snap = snapshot(cat), from = page, s = T.stages[i];
    if (cat === 'Sleep' || cat === 'Feeding') chgSetStage(cat, i, true);
    else if (cat === 'Safety') { setAnswer('movementGuide', s.key); page = 'topic:Safety'; render(); }
    else if (cat === 'Development') { hubSetStage('Development', s.key, true); page = 'topic:Development'; render(); }
    else if (cat === 'Daily rhythm') { hubSetStage('Care', i, true); page = 'topic:Daily rhythm'; render(); }
    scrollTo(0, 0);
    undoState = { cat, snap, page: from };
    toast(cat, s.label);
  };
})();
