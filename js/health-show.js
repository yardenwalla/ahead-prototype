/* Ahead · Health, show don't tell (Nov 19, round 2).
   A row of checkups at the top, like Development's ages: tap one to read it. Checkups marked done carry a tick.
   Photos only where a parent needs to recognize or do something: how to hold the baby for shots, what helps a cold
   (assets/health/, made in Canva). A photo of a checkup room added nothing, so the top card keeps its drawing.
   window.__hlOld = true brings back the earlier version. */
(function () {
  const F = s => (window.__hub ? window.__hub.F(s) : s);

  // The checkups across the top, in Development's age-chip style.
  const SHORT = { 0: '1st wk', 1: '1 mo', 2: '2 mo', 4: '4 mo', 6: '6 mo', 9: '9 mo', 12: '12 mo' };
  const TICK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.4l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  window.healthCheckupPath = function (age, focus) {
    const isLive = typeof isCurrent !== 'function' || isCurrent();
    const done = a => { try { const r = healthRecord(a); return r && r.status === 'attended'; } catch (e) { return false; } };
    return `<nav class="hl-path" aria-label="Checkups">${WELL_VISITS.map(a => `<button class="${a === age ? 'is-on' : ''}${isLive && a === focus ? ' is-now' : ''}${done(a) ? ' is-done' : ''}" onclick="openPage('health-visit:${a}')"${a === age ? ' aria-current="page"' : ''}>${done(a) ? TICK : ''}${SHORT[a]}</button>`).join('')}<i class="st-chip" hidden></i></nav>`;
  };

})();
