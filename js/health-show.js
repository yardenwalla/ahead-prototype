/* Ahead · Health, show don't tell (Nov 19). Same pattern as Safety and Development:
   - A row of checkups at the top, like Development's ages: tap one to read it. Checkups marked done carry a tick.
   - A real photo of this checkup in the top card, with pins on what's new at this visit. Each pin opens What to expect.
   - The questions to ask sit right on the checkup page, ready to tick at the visit, like Safety's checklist.
   window.__hlOld = true brings back the drawn version. Photos: Ahead's own (Canva), assets/health/. */
(function () {
  const F = s => (window.__hub ? window.__hub.F(s) : s);
  const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // Pins sit on what the pediatrician looks at. x and y are % of the photo (1200×960), side is where the label goes.
  const PHOTO = {
    0: { alt: 'A pediatrician checking a newborn lying on a baby scale', pins: [['Jaundice check', 52, 66, 't'], ['Weight check', 42, 84, 'r']] },
    1: { alt: 'A pediatrician listening to a baby’s chest while the mom smiles at the baby', pins: [['Heart and lungs', 48, 62, 'l']] },
    2: { alt: 'A baby on the exam table lifting her head and chest, the pediatrician smiling back', pins: [['Lifts head and chest', 40, 30, 't']] },
    4: { alt: 'A baby on his back reaching up for a rattle the pediatrician holds', pins: [['Reaches for toys', 64, 40, 'b']] },
    6: { alt: 'A smiling baby sitting on the exam table, leaning on his hands, beside the pediatrician', pins: [['Sits leaning on hands', 47, 78, 'b']] },
    9: { alt: 'A dad filling in a short questionnaire with his baby on his lap, the pediatrician across from them', pins: [['Development questionnaire', 62, 76, 'b']] },
    12: { alt: 'A toddler standing at a bench, holding on, as the pediatrician holds out her hands', pins: [['Stands holding on', 54, 60, 'r']] }
  };
  // The photo is 5:4 and its frame 4:3, so 3.125% is trimmed off the top and bottom.
  const yIn = y => Math.round(((y - 3.125) / 93.75) * 1000) / 10;
  window.healthCheckupPhoto = function (age) {
    const p = PHOTO[age];
    if (!p) return '';
    const pins = p.pins.map(([t, x, y, side]) => `<button class="hl-pin hl-pin-${side}" style="left:${x}%;top:${yIn(y)}%" onclick="openHealthDetail(${age},'expect')"><i></i><span>${F(t)}</span></button>`).join('');
    return `<figure class="hl-photo hl-hero-photo"><img src="assets/health/checkup-${age}.jpg" alt="${esc(p.alt)}">${pins}</figure>`;
  };

  // The checkups across the top, in Development's age-chip style.
  const SHORT = { 0: '1st wk', 1: '1 mo', 2: '2 mo', 4: '4 mo', 6: '6 mo', 9: '9 mo', 12: '12 mo' };
  const TICK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.4l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  window.healthCheckupPath = function (age, focus) {
    const isLive = typeof isCurrent !== 'function' || isCurrent();
    const done = a => { try { const r = healthRecord(a); return r && r.status === 'attended'; } catch (e) { return false; } };
    return `<nav class="hl-path" aria-label="Checkups">${WELL_VISITS.map(a => `<button class="${a === age ? 'is-on' : ''}${isLive && a === focus ? ' is-now' : ''}${done(a) ? ' is-done' : ''}" onclick="openPage('health-visit:${a}')"${a === age ? ' aria-current="page"' : ''}>${done(a) ? TICK : ''}${SHORT[a]}</button>`).join('')}<i class="st-chip" hidden></i></nav>`;
  };

  // Questions to ask, on the checkup page itself. Ticks and your own questions are shared with Your questions and notes.
  window.healthQuestionsCard = function (age) {
    const d = journeyData(), asked = d.checks['q' + age] || {}, own = d.questions[age] || [], qs = healthJourneyQuestions(age);
    const item = (key, q) => `<label class="hub-q-idea${asked[key] ? ' is-on' : ''}"><input type="checkbox" ${asked[key] ? 'checked' : ''} onchange="hubAskedQuestion(${age},${typeof key === 'number' ? key : `'${key}'`},this.checked)"><span>${q}</span></label>`;
    const n = qs.filter((q, i) => asked[i]).length + own.filter((q, i) => asked['m' + i]).length;
    const more = own.length || (typeof visitNotesFor === 'function' && visitNotesFor(age)) ? 'Your questions and notes' : 'Add your own, or notes from the visit';
    return `<h2 class="hub-h2 hl-q-h">${F('Questions to ask')}<small>${n} of ${qs.length + own.length} asked</small></h2><section class="hub-card hub-q-card hl-q-card">${qs.map((q, i) => item(i, q)).join('')}${own.map((q, i) => item('m' + i, esc(q))).join('')}<button class="hub-link hl-q-more" onclick="openHealthDetail(${age},'questions')">${F(more)} ›</button></section>`;
  };
})();
