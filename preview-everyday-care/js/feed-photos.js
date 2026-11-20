/* Ahead · Feeding photos in the step-by-step walkthroughs (Nov 18–19).
   Templated Feeding pages draw their own photos through the shared photo blocks (hub.js TPLB). The walkthroughs aren't
   templated on purpose, so their photos are added here: hunger cues, the paced-bottle video, burping, full, and the formula steps. */
(function () {
  const F = s => (window.__hub ? window.__hub.F(s) : s);
  const pin = ([label, x, y, side]) => `<span class="ph-pin ph-pin-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(label)}</span></span>`;
  const photo = (src, alt, pins, cls = '') => `<figure class="ph-photo ${cls}"><img src="assets/feeding/${src}.jpg" alt="${F(alt)}">${(pins || []).map(pin).join('')}</figure>`;
  const PH = {
    full: () => photo('full', 'A drowsy baby with relaxed, open hands after a feed', [['Relaxed, open hands', 18, 74, 'r'], ['Drifts off', 62, 28, 'l']], 'is-square'),
    ready: () => photo('ready', 'A baby sitting up in a high chair, head steady, reaching for a spoon', [['Steady head', 40, 18, 'l'], ['Sits with support', 28, 84, 'r'], ['Reaches for food', 70, 48, 'b']]),
    tray: () => photo('tray', 'A first-meal tray: soft avocado strips, smooth oatmeal and a ripe banana', [['Smooth oatmeal', 44, 30, 'r'], ['A soft strip to hold', 16, 60, 'r']])
  };
  window.__feedPhoto = PH;
  // Swap a strip's icons for photos, keeping its words: the same set, made real (Nov 18).
  const img = (src, alt) => `<img src="assets/feeding/${src}.jpg" alt="${F(alt)}" loading="lazy">`;
  function tiles(fig, list) {
    if (!fig || fig.classList.contains('ph-tiles')) return;
    const arts = fig.querySelectorAll('.hub-iconstep-art, .hub-strip-art, .fd-ill > figure > svg');
    if (arts.length !== list.length) return;
    arts.forEach((a, i) => { const [src, alt] = list[i]; const span = document.createElement('span'); span.className = 'ph-tile'; span.innerHTML = img(src, alt); a.replaceWith(span); });
    fig.classList.add('ph-tiles');
  }
  const own = (h1, re) => h1 && re.test(h1.textContent);
  function dress() {
    const main = document.querySelector('#main'); if (window.__fdPhotoOff || !main || !(typeof page === 'string' && page.startsWith('chg:Feeding'))) return;
    const h1s = [...main.querySelectorAll('.dev-area-head h1')], has = re => h1s.find(h => re.test(h.textContent));
    const h2 = re => [...main.querySelectorAll('h2.hub-h2')].find(h => re.test(h.textContent));
    // Making formula: the four steps, photographed.
    if (has(/Make every bottle safely/)) tiles(main.querySelector('.hub-iconsteps'), [['formula-1', 'Washing hands at the sink'], ['formula-water', 'Pouring water into the bottle up to the line'], ['formula-scoop', 'A scoop of formula leveled flat with a knife'], ['formula-4', 'Testing drops of milk on the wrist']]);
    // A feed, step by step: hunger cues, the paced bottle, burping and full, photographed.
    main.querySelectorAll('.xa-p').forEach(p => {
      const h1 = p.querySelector('.dev-area-head h1'); if (!h1) return;
      if (/hunger cues/.test(h1.textContent)) tiles(p.querySelector('.hub-strip'), [['cue-1', 'Stirring and turning to look'], ['cue-2', 'Rooting, hands to mouth'], ['cue-3', 'Crying, a late cue']]);
      else if (/^Burp|burp (her|him|them|.*) and offer/i.test(h1.textContent)) { const ill = p.querySelector('.fd-ill'); if (ill && typeof hubEmbed === 'function') ill.outerHTML = `<div class="ph-video">${hubEmbed('d8tJimekFGo', 'Three ways to burp', 'UNICEF')}</div>`; }
      else if (/full|done/i.test(h1.textContent) && !/Pace|bottle/i.test(h1.textContent) && !p.querySelector('.ph-photo')) { const m = p.querySelector('.ss-moment, .hub-iconsteps'); if (m) m.insertAdjacentHTML('beforebegin', PH.full()); }
    });
  }
  window.__feedPhotosDress = dress;
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
