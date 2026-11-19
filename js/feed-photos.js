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
  const SIGNS = [['sign-head', 'Steady head', 'Holds {p} head up well on {p} own'], ['sign-sits', 'Sits with support', 'Upright in a high chair, or on your lap'], ['sign-interest', 'Interested in food', 'Watches you eat, and reaches for it'], ['sign-spoon', 'Opens up and swallows', 'Moves food back instead of pushing it out']];
  const OPTS = [['opt-avocado', 'Avocado', 'Ripe strips'], ['opt-banana', 'Banana', 'Spears, not coins'], ['opt-egg', 'Egg', 'Omelet strips'], ['opt-sweetpotato', 'Sweet potato', 'Soft wedges, no skin'], ['opt-broccoli', 'Broccoli', 'Well cooked, stem to hold'], ['opt-pasta', 'Pasta', 'Soft, well cooked']];
  const rows = list => `<section class="ph-rows">${list.map(([src, t, d]) => `<div class="ph-row"><span class="ph-thumb">${img(src, t)}</span><span class="ph-sign-txt"><b>${F(t)}</b><span>${F(d)}</span></span></div>`).join('')}</section>`;
  window.__fdSign = k => { const a = (answers.readySigns || []).slice(), i = a.indexOf(k); if (i >= 0) a.splice(i, 1); else a.push(k); answers.readySigns = a; persist(); const y = scrollY; render(); scrollTo(0, y); };
  const own = (h1, re) => h1 && re.test(h1.textContent);
  function dress() {
    const main = document.querySelector('#main'); if (window.__fdPhotoOff || !main || !(typeof page === 'string' && page.startsWith('chg:Feeding'))) return;
    const h1s = [...main.querySelectorAll('.dev-area-head h1')], has = re => h1s.find(h => re.test(h.textContent));
    const h2 = re => [...main.querySelectorAll('h2.hub-h2')].find(h => re.test(h.textContent));
    // Is she ready?: each sign as a photo row the parent can tick (Nov 19).
    const ready = h2(/ready$/);
    if (ready && !main.querySelector('.ph-signs')) {
      const old = ready.nextElementSibling, notes = old && old.querySelector('.tpl-notes');
      const got = (answers.readySigns || []).filter(k => SIGNS.some(x => x[0] === k));
      ready.innerHTML = `${F('Signs {s’s} ready')} <small class="ph-count">${got.length} ${F('of')} ${SIGNS.length}</small>`;
      const box = document.createElement('div');
      box.innerHTML = `<section class="ph-signs">${SIGNS.map(([k, t, d]) => { const on = got.includes(k); return `<button class="ph-sign${on ? ' is-on' : ''}" aria-pressed="${on}" onclick="__fdSign('${k}')"><span class="ph-thumb">${img(k, t)}</span><span class="ph-sign-txt"><b>${F(t)}</b><span>${F(d)}</span></span><i class="ph-tick" aria-hidden="true"></i></button>`; }).join('')}</section>`
        + (got.length === SIGNS.length ? `<p class="ph-cap ph-all">${F('All four. Talk to {p} pediatrician about starting, if you haven’t yet.')}</p>` : '');
      if (old && (old.matches('.hub-iconsteps') || old.matches('.ph-block'))) old.replaceWith(...box.childNodes); else ready.after(...box.childNodes);
      if (notes) main.querySelector('.ph-signs').after(notes);
    }
    // How a meal goes: the three steps, photographed with the same baby.
    if (has(/First meals are just a few bites/)) { const f = main.querySelector('.care-tpl .hub-iconsteps'); tiles(f, [['meal-1', 'Strapped in, facing you'], ['meal-2', 'Offered a little on a spoon'], ['meal-3', 'Turning away when done']]); }
    // Safe finger foods: one food from too hard to safe, then good first options, then rows for cutting and cooking (Nov 19).
    if (has(/Finger foods should squish/) && !main.querySelector('.ph-trio')) {
      const sz = h2(/Sizes by age/), cut = h2(/Cut and cook/);
      if (sz && sz.nextElementSibling) {
        sz.textContent = F('Soft enough to squish');
        sz.nextElementSibling.outerHTML = `<section class="ph-trio">${[['ff-hard', 'no', 'Too hard', 'Raw carrot'], ['ff-spear', 'yes', 'Soft strips', '6–8 months'], ['ff-pieces', 'yes', 'Small pieces', 'From 9 months']].map(([src, ok, t, d]) => `<figure><span class="ph-tile">${img(src, t + ': ' + d)}</span><figcaption><b class="ph-mark is-${ok}">${F(t)}</b><span>${F(d)}</span></figcaption></figure>`).join('')}</section>`
          + `<p class="ph-cap">${F('Cook it until it squashes between your finger and thumb. If it does, {p} gums can manage it.')}</p>`
          + `<h2 class="hub-h2">${F('Good first options')}</h2><section class="ph-grid">${OPTS.map(([src, t, d]) => `<figure><span class="ph-tile">${img(src, t)}</span><figcaption><b>${F(t)}</b><span>${F(d)}</span></figcaption></figure>`).join('')}</section>`;
      }
      if (cut && cut.nextElementSibling) cut.nextElementSibling.outerHTML = rows([['grape', 'Quarter grapes lengthwise', 'And cherry tomatoes'], ['nutbutter', 'Spread nut butters thin', 'On toast strips, never in a lump'], ['peach', 'Take out the hard bits', 'Skins, pits and bones']]);
    }
    // Beyond purées: the same three foods at each age (Nov 19).
    const tex = h2(/Textures, as/);
    if (tex && !main.querySelector('.ph-tex')) {
      main.querySelectorAll('.ph-four').forEach(e => e.remove());
      const strip = tex.nextElementSibling, notes = strip && strip.querySelector('.tpl-notes');
      const cols = [['Smooth', 'Around 6 months'], ['Lumpy', '7–8 months'], ['Soft pieces', '9 months on']];
      const html = `<section class="ph-tex"><div class="ph-tex-row ph-tex-head"><span></span>${cols.map(([t, d]) => `<span><b>${F(t)}</b>${F(d)}</span>`).join('')}</div>${[['avo', 'Avocado'], ['sp', 'Sweet potato'], ['oat', 'Oatmeal']].map(([k, n]) => `<div class="ph-tex-row"><b class="ph-tex-food">${F(n)}</b>${[1, 2, 3].map(i => `<span class="ph-tile">${img('tx-' + k + '-' + i, n + ', ' + cols[i - 1][0].toLowerCase())}</span>`).join('')}</div>`).join('')}</section>`;
      if (strip && strip.matches('.hub-strip')) { strip.insertAdjacentHTML('beforebegin', html); strip.remove(); } else tex.insertAdjacentHTML('afterend', html);
      if (notes) main.querySelector('.ph-tex').after(notes);
    }
    // Making formula: the four steps, photographed.
    if (has(/Make every bottle safely/)) tiles(main.querySelector('.hub-iconsteps'), [['formula-1', 'Washing hands at the sink'], ['formula-2', 'A kettle just boiled'], ['formula-3', 'Levelling a scoop of formula'], ['formula-4', 'Testing drops of milk on the wrist']]);
    // Gagging or choking: two photo cards side by side, then the first-aid steps and the Red Cross video (Nov 19).
    const tell = h2(/How to tell/);
    if (tell && has(/Gagging is normal/) && !main.querySelector('.ph-vs')) {
      const v = tell.nextElementSibling, two = v && v.querySelector(':scope > div');
      if (two) two.outerHTML = `<div class="ph-vs">${[['gag', 'ok', 'Gagging', 'Normal, and common', ['Loud: coughing, sputtering', 'Red face, tongue pushed out', 'Clears it on {p} own'], 'Stay close and calm. Let {o} work it out.'], ['choke', 'stop', 'Choking', 'An emergency', ['Silent, or a high squeak', 'Can’t cough, cry or breathe', 'Lips turning blue'], 'Act now. The steps are below.']].map(([src, c, t, d, xs, act]) => `<div class="ph-vs-card is-${c}"><span class="ph-tile">${img(src, t)}</span><b>${F(t)}</b><small>${F(d)}</small><ul>${xs.map(x => `<li>${F(x)}</li>`).join('')}</ul><p>${F(act)}</p></div>`).join('')}</div>`;
    }
    const aid = h2(/choking$/i);
    if (aid) { const f = aid.nextElementSibling; if (f && f.matches('.hub-iconsteps')) f.classList.add('ph-numbered');
      if (f && typeof hubEmbed === 'function' && !main.querySelector('.ph-video')) f.insertAdjacentHTML('afterend', `<div class="ph-video">${hubEmbed('ShaNuST_58A', 'Choking first aid for babies under 1', 'American Red Cross')}</div>`); }
    // A feed, step by step: hunger cues, the paced bottle, burping and full, photographed.
    main.querySelectorAll('.xa-p').forEach(p => {
      const h1 = p.querySelector('.dev-area-head h1'); if (!h1) return;
      if (/hunger cues/.test(h1.textContent)) tiles(p.querySelector('.hub-strip'), [['cue-1', 'Stirring and turning to look'], ['cue-2', 'Rooting, hands to mouth'], ['cue-3', 'Crying, a late cue']]);
      else if (/Pace each bottle|paced bottle/.test(h1.textContent)) { const d = p.querySelector('.ss-do'); if (d && typeof hubEmbed === 'function' && !p.querySelector('.ph-video')) { d.classList.add('ph-steps'); d.insertAdjacentHTML('beforebegin', `<div class="ph-video">${hubEmbed('OGPm5SpLxXY', 'Paced bottle feeding', 'IABLE')}</div>`); } }
      else if (/^Burp|burp (her|him|them|.*) and offer/i.test(h1.textContent)) { const ill = p.querySelector('.fd-ill'); if (ill && typeof hubEmbed === 'function') ill.outerHTML = `<div class="ph-video">${hubEmbed('d8tJimekFGo', 'Three ways to burp', 'UNICEF')}</div>`; }
      else if (/full|done/i.test(h1.textContent) && !p.querySelector('.ph-photo')) { const m = p.querySelector('.ss-moment, .hub-iconsteps'); if (m) m.insertAdjacentHTML('beforebegin', PH.full()); }
    });
  }
  window.__feedPhotosDress = dress;
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
