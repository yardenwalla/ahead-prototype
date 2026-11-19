/* Ahead · Feeding photos inside pages (Nov 18).
   Real photos where a parent has to recognize something: hunger and fullness cues, the signs of readiness for solids,
   and what a first meal looks like on the tray. Labels are drawn by the app, never baked into the image. */
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
    // Is she ready?: one photo shows three signs, so it replaces the four icon tiles; swallowing can't be photographed.
    const ready = h2(/ready$/);
    if (ready && ready.nextElementSibling && ready.nextElementSibling.matches('.hub-iconsteps') && !main.querySelector('.ph-photo')) {
      const fig = ready.nextElementSibling, notes = fig.querySelector('.tpl-notes');
      const wrap = document.createElement('div'); wrap.className = 'ph-block';
      wrap.innerHTML = PH.ready() + `<p class="ph-cap">${F('And {s} {swallow|swallows} food, moving it back instead of pushing it out.')}</p>`;
      if (notes) wrap.appendChild(notes);
      fig.replaceWith(wrap);
    }
    // How a meal goes: the three steps, photographed with the same baby.
    if (has(/First meals are just a few bites/)) { const f = main.querySelector('.care-tpl .hub-iconsteps'); tiles(f, [['meal-1', 'Strapped in, facing you'], ['meal-2', 'Offered a little on a spoon'], ['meal-3', 'Turning away when done']]); }
    // Safe finger foods: sizes by age, then each way to cut or cook it safely, before and after.
    if (has(/Finger foods should squish/)) {
      const figs = main.querySelectorAll('.care-tpl .hub-iconsteps');
      tiles(figs[0], [['tray', 'Soft finger-size strips of avocado'], ['pieces', 'Small, soft pea-size pieces']]);
      tiles(figs[1], [['grape', 'A whole grape, and one cut lengthwise into quarters'], ['nutbutter', 'Peanut butter spread thin on a toast strip'], ['carrot', 'A raw carrot, and a steamed one squished flat'], ['peach', 'A whole peach, then soft slices with the pit and skin taken out']]);
    }
    // Beyond purées: the same sweet potato four ways.
    const tex = h2(/Textures, as/);
    if (tex && !main.querySelector('.ph-four')) tex.insertAdjacentHTML('afterend', `<figure class="ph-photo ph-four is-wide"><img src="assets/feeding/textures.jpg" alt="${F('The same sweet potato four ways: smooth, mashed, lumpy and soft pieces')}"><figcaption>${['Smooth', 'Mashed', 'Lumpy', 'Soft pieces'].map(t => `<span>${F(t)}</span>`).join('')}</figcaption></figure>`);
    // Making formula: the four steps, photographed.
    if (has(/Make every bottle safely/)) tiles(main.querySelector('.hub-iconsteps'), [['formula-1', 'Washing hands at the sink'], ['formula-2', 'A kettle just boiled'], ['formula-3', 'Levelling a scoop of formula'], ['formula-4', 'Testing drops of milk on the wrist']]);
    // Gagging or choking: the Red Cross video under the first-aid steps.
    const aid = h2(/choking$/i);
    if (aid && typeof hubEmbed === 'function' && !main.querySelector('.ph-video')) { const f = aid.nextElementSibling; if (f) f.insertAdjacentHTML('afterend', `<div class="ph-video">${hubEmbed('ShaNuST_58A', 'Choking first aid for babies under 1', 'American Red Cross')}</div>`); }
    // A feed, step by step: hunger cues, the paced bottle, burping and full, photographed.
    main.querySelectorAll('.xa-p').forEach(p => {
      const h1 = p.querySelector('.dev-area-head h1'); if (!h1) return;
      if (/hunger cues/.test(h1.textContent)) tiles(p.querySelector('.hub-strip'), [['cue-1', 'Stirring and turning to look'], ['cue-2', 'Rooting, hands to mouth'], ['cue-3', 'Crying, a late cue']]);
      else if (/Pace each bottle|paced bottle/.test(h1.textContent)) { const d = p.querySelector('.ss-do'); if (d && typeof hubEmbed === 'function' && !p.querySelector('.ph-video')) d.insertAdjacentHTML('afterend', `<div class="ph-video">${hubEmbed('OGPm5SpLxXY', 'Paced bottle feeding', 'IABLE')}</div>`); }
      else if (/^Burp|burp (her|him|them|.*) and offer/i.test(h1.textContent)) { const ill = p.querySelector('.fd-ill'); if (ill && typeof hubEmbed === 'function') ill.outerHTML = `<div class="ph-video">${hubEmbed('d8tJimekFGo', 'Three ways to burp', 'UNICEF')}</div>`; }
      else if (/full|done/i.test(h1.textContent) && !p.querySelector('.ph-photo')) { const m = p.querySelector('.ss-moment, .hub-iconsteps'); if (m) m.insertAdjacentHTML('beforebegin', PH.full()); }
    });
  }
  window.__feedPhotosDress = dress;
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
