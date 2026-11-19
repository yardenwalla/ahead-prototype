/* Ahead · Feeding photos inside pages (Nov 18).
   Real photos where a parent has to recognize something: hunger and fullness cues, the signs of readiness for solids,
   and what a first meal looks like on the tray. Labels are drawn by the app, never baked into the image. */
(function () {
  const F = s => (window.__hub ? window.__hub.F(s) : s);
  const pin = ([label, x, y, side]) => `<span class="ph-pin ph-pin-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(label)}</span></span>`;
  const photo = (src, alt, pins, cls = '') => `<figure class="ph-photo ${cls}"><img src="assets/feeding/${src}.jpg" alt="${F(alt)}">${(pins || []).map(pin).join('')}</figure>`;
  const PH = {
    hungry: () => photo('hungry', 'A baby sucking on her hand, an active hunger cue', [['Hands to mouth', 34, 48, 'r']], 'is-square'),
    full: () => photo('full', 'A drowsy baby with relaxed, open hands after a feed', [['Relaxed, open hands', 18, 74, 'r'], ['Drifts off', 62, 28, 'l']], 'is-square'),
    ready: () => photo('ready', 'A baby sitting up in a high chair, head steady, reaching for a spoon', [['Steady head', 40, 18, 'l'], ['Sits with support', 28, 84, 'r'], ['Reaches for food', 70, 48, 'b']]),
    tray: () => photo('tray', 'A first-meal tray: soft avocado strips, smooth oatmeal and a ripe banana', [['Smooth oatmeal', 44, 30, 'r'], ['A soft strip to hold', 16, 60, 'r']])
  };
  window.__feedPhoto = PH;
  function dress() {
    const main = document.querySelector('#main'); if (window.__fdPhotoOff || !main || !(typeof page === 'string' && page.startsWith('chg:Feeding'))) return;
    // Is she ready?: one photo shows three signs, so it replaces the four icon tiles; swallowing can't be photographed.
    const ready = [...main.querySelectorAll('h2.hub-h2')].find(h => /ready$/.test(h.textContent) && h.nextElementSibling && h.nextElementSibling.matches('.hub-iconsteps'));
    if (ready && !main.querySelector('.ph-photo')) {
      const fig = ready.nextElementSibling, notes = fig.querySelector('.tpl-notes');
      const wrap = document.createElement('div'); wrap.className = 'ph-block';
      wrap.innerHTML = PH.ready() + `<p class="ph-cap">${F('And {s} {swallow|swallows} food, moving it back instead of pushing it out.')}</p>`;
      if (notes) wrap.appendChild(notes);
      fig.replaceWith(wrap);
    }
    // How a meal goes: the tray shows what "a soft strip" and "a spoonful" look like.
    const meal = [...main.querySelectorAll('.dev-area-head h1')].find(h => /First meals are just a few bites/.test(h.textContent));
    if (meal && !main.querySelector('.ph-photo')) { const steps = main.querySelector('.care-tpl h2.hub-h2'); if (steps) steps.insertAdjacentHTML('beforebegin', PH.tray()); }
    // A feed, step by step: hungry on step 1, full on the last step.
    main.querySelectorAll('.xa-p').forEach(p => {
      if (p.querySelector('.ph-photo')) return;
      const h1 = p.querySelector('.dev-area-head h1'); if (!h1) return;
      if (/hunger cues/.test(h1.textContent)) { const m = p.querySelector('.ss-moment'); if (m) m.insertAdjacentHTML('afterbegin', PH.hungry()); }
      else if (/full|done/i.test(h1.textContent)) { const m = p.querySelector('.ss-moment, .hub-iconsteps'); if (m) m.insertAdjacentHTML('beforebegin', PH.full()); }
    });
  }
  window.__feedPhotosDress = dress;
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
