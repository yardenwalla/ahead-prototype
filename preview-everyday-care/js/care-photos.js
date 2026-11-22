/* Ahead · Everyday care, show and tell (Nov 20, preview).
   The same move Feeding, Health, Safety and Development made: real photos where a parent learns by seeing.
   - Main page: a real-life photo per stage in the top card, a compact "New now" line under it (like Feeding's Try this),
     photo rows for "Right now", and photo tiles for "Is this normal?".
   - How-to pages: one photo right under the standard top card, with at most three labels the app draws on top.
   - Is this normal? pages: the photo replaces the little body outline in "What it looks like".
   Words, order and sections are unchanged; only the pictures change. Photos: assets/care/ (made in Canva).
   Off switch for side-by-side checks: window.__carePhotoOff = true. */
(function () {
  const F = s => (window.__hub ? window.__hub.F(s) : s);
  const CAT = 'Daily rhythm';
  const src = n => `assets/care/${n}.jpg?v=1122g`;
  const img = (n, alt) => `<img src="${src(n)}" alt="${F(alt).replace(/"/g, '&quot;')}" loading="lazy">`;
  const pin = ([label, x, y, side]) => `<span class="ph-pin ph-pin-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(label)}</span></span>`;
  const photo = (n, alt, pins, cls = '') => `<figure class="ph-photo ph-hero care-ph ${cls}">${img(n, alt)}${(pins || []).map(pin).join('')}</figure>`;

  // Top card photos, one per stage (Newborn, 1–3, 4–6, 6–12 months).
  const HERO = [['sponge', 'A sponge bath on a towel'], ['hero-1', 'A baby wrapped in a hooded towel after a bath'],
    ['wriggle', 'Changing a baby on a floor mat, a toy in hand'], ['hero-3', 'A parent brushing a baby’s first teeth']];

  // Which photo goes with which page, by the page's route (after "chg:Daily rhythm:d:").
  const ROW = [[/^p:sponge/, 'sponge'], [/^p:tub/, 'tubbath'], [/^cord/, 'cord'], [/^(h|t):diapers:[01]/, 'diaper'], [/^(h:diapers:2|t:diapers:[23])/, 'wriggle'],
    [/^(h|t):skin/, 'cream'], [/^t:nails/, 'nails'], [/^t:clothes/, 'clothes'], [/^t:sun/, 'sun'], [/^p:teething/, 'teethers'], [/^t:bath:[01]/, 'tub'], [/^t:bath:2/, 'tub'],
    [/^t:bath:3/, 'bigtub'], [/^p:feet/, 'feet'], [/^h:gums/, 'gums'], [/^p:brush/, 'hero-3']];
  const rowPhoto = r => (ROW.find(([re]) => re.test(r)) || [])[1];
  // "Is this normal?" tiles: what a parent would see.
  const SEE = { 'rash:peeling': 'peeling', 'rash:newborn': 'milia', 'look:0:cord': 'cord', 'rash:acne': 'acne', 'rash:cradle': 'cradle', 'look:1:poop': 'cleandiaper',
    'rash:drool': 'drool', 'p:teething': 'soregums', 'rash:eczema': 'eczema', 'look:3:poop': 'solids', 'rash:heat': 'heat' };
  // Is this normal? pages: the photo for "What it looks like".
  const TILE_CROP = { milia: [45, 45, 1.3], cradle: [45, 35, 1.3], heat: [50, 48, 1.2], peeling: [50, 45, 1.1], cord: [50, 48, 1.4], acne: [36, 60, 1.5], eczema: [40, 50, 1.2] };
  const SEE_LINE = { 'rash:peeling': 'Common in the first weeks.', 'rash:newborn': 'Tiny bumps that fade on their own.', 'look:0:cord': 'A little is normal as it heals.',
    'rash:acne': 'Baby acne, gone by 4–6 months.', 'rash:cradle': 'Cradle cap, usually gone by age 1.', 'look:1:poop': 'Can be fine if feeds go well.',
    'rash:drool': 'Comes with drool. Easy to soothe.', 'p:teething': 'Teething can start around now.', 'rash:eczema': 'Often eczema. Thick cream helps.',
    'look:3:poop': 'Thicker, browner and smellier.', 'rash:heat': 'Cool down and dress lighter.' };
  const RASH = { peeling: 'peeling', newborn: 'milia', acne: 'acne', cradle: 'cradle', drool: 'drool', eczema: 'eczema', heat: 'heat' };

  // How-to pages: [section title, photo, alt, pins]. Pins name the thing they sit next to, and say why it matters.
  const PAGE = [
    [/^p:sponge/, ['A sponge bath, set up', 'sponge', 'A sponge bath on a towel: one arm washed at a time, the rest wrapped', [['The rest stays wrapped', 30, 74, 'r'], ['A bowl of warm water', 86, 60, 'l']]], 'bath'],
    [/^p:tub/, ['A safe tub bath', 'tubbath', 'A baby in a baby tub, a hand behind the head', [['A hand behind the head', 18, 21, 'r'], ['About 2 inches of water', 58, 84, 'l']]], 'bath'],
    [/^t:bath:2/, ['Bath, then bed', 'bedtime', 'A baby wrapped in a towel after a bath, pajamas and a sleep sack laid out', [['Straight into a towel', 30, 30, 'r'], ['Pajamas laid out first', 74, 52, 'l']]], 'bath'],
    [/^t:bath:3/, ['The big tub, set up', 'bigtub', 'A family tub with shallow water, a towel ready on the edge', [['Shallow water', 62, 66, 'l']]], 'bath'],
    [/^cord/, ['Let the cord air out', 'cord', 'A newborn belly, the cord stump open to the air', [['Diaper folded below it', 50, 74, 'r']]], 'cord'],
    [/^(h|t):diapers:[01]/, ['A diaper that fits', 'diaper', 'Fastening a clean diaper at the waist', [['Two fingers fit at the waist', 54, 40, 'l']]], 'diapers'],
    [/^(h:diapers:2|t:diapers:[23])/, ['A floor-mat change', 'wriggle', 'Changing a baby on a floor mat, a toy in hand and a hand on the tummy', [['Something to hold', 40, 42, 'l'], ['A hand on {o}', 32, 74, 'r'], ['All in reach', 90, 54, 'l']]], 'diapers'],
    [/^h:skin/, ['Cream on dry patches', 'cream', 'Smoothing thick cream onto a baby’s leg after a bath', [['A thick, fragrance-free cream', 50, 46, 'b']]], 'skin'],
    [/^t:clothes/, ['Three layers, for example', 'clothes', 'A bodysuit, pajamas and a sleep sack laid out', [['Bodysuit', 30, 26, 'r'], ['Pajamas', 62, 40, 'r'], ['Sleep sack', 25, 66, 'r']]], 'clothes'],
    [/^t:sun/, ['A sun-safe outfit', 'sun', 'A baby in a sun hat and long sleeves, in the stroller’s shade', [['Wide-brimmed hat', 42, 28, 'l'], ['Long, light sleeves', 24, 76, 'r']]], 'sun'],
    [/^p:teething/, ['What to do', 'teethers', 'A teething ring and a firm rubber teether', [['Chilled, not frozen', 44, 62, 'b'], ['Firm rubber', 80, 47, 'b']], '', 'What to do'], 'teeth'],
    [/^h:gums/, ['Wiping the gums', 'gums', 'Wiping a baby’s gums with a cloth on a finger', [['A soft, damp cloth', 40, 72, 'r']]], 'teeth'],
    [/^p:feet/, ['Barefoot indoors', 'feet', 'A barefoot baby standing at the sofa', [['Bare feet grip the floor', 48, 90, 'r']]], 'clothes']
  ];

  // How it changes: the gear as a path, the same block as Outings' "Which seat, and when". Each step is named by the cue
  // to move on, not an age, and the step this page is about is outlined.
  // How it changes: the same text timeline as Outings' "Which seat, and when" (icons, no photos), current row marked.
  const STEPS = {
    bath: ['Which tub, and when', [['Cord healed', 'bath', 'A baby tub, with the newborn sling.'], ['Too big, can’t sit yet', 'bath', 'The baby tub, set inside the big tub.'], ['Sits steadily', 'sit', 'The big tub, often around 6–8 months. A non-slip mat and shallow water.']]],
    nails: ['File, then clippers', [['First weeks', 'hand', 'A soft file, maybe twice a week. It can’t nick the skin.'], ['Once you’re ready', 'hand', 'Baby clippers, about once a week. Either is fine at any age.']]]
  };
  const STEP_ON = { 't:bath:1': ['bath', 0], 't:bath:2': ['bath', 1], 't:bath:3': ['bath', 2], 't:nails:0': ['nails', 0], 't:nails:1': ['nails', 1], 't:nails:2': ['nails', 1], 't:nails:3': ['nails', 1] };
  const NOHERO = new Set(['p:sponge', 'p:tub', 'h:diapers:2', 'h:diapers:3', 't:diapers:3']); // their step photos already show it
  const gearPath = (k, on) => { const [title, items] = STEPS[k], c = (window.YEAR_PALETTES || {})['Daily rhythm'] || { ink: '#2a6078', bg: '#cfe9f4', pale: '#ecf6fa' };
    return `<figure class="hub-figure hub-daymarks oa-timeline care-timeline" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}"><b class="hub-fig-title">${F(title)}</b><ol class="hub-daymarks-list">${items.map(([when, icon, text], i) => `<li class="${i === on ? 'is-on' : ''}"><i>${window.hubArt ? hubArt(icon, 'Daily rhythm') : ''}</i><time>${F(when)}</time><span>${F(text)}</span></li>`).join('')}</ol></figure>`; };
  function addCue(main, r) {
    return;
    const at = main.querySelector('.care-psteq-notes') || main.querySelector('.care-psteq');
    const html = `<p class="care-cue"><b>${F(c[0])}</b> ${F(c[1])}</p>`;
    if (at) at.insertAdjacentHTML('afterend', html); else { const hd = main.querySelector('.dev-area-head'); if (hd) hd.insertAdjacentHTML('afterend', html); }
  }
  function addPath(main, r) {
    const hit = STEP_ON[r]; if (!hit || main.querySelector('.care-timeline')) return;
    // After the how-to and its safety rows, before Good to know and the video.
    // Nails: the two tools are the page's picture, so the path is the first section (like Outings' car seat page).
    const hs = [...main.querySelectorAll('h2.hub-h2')], before = hs.find(h => /^(Good to know|Watch how|When to call)$/.test(h.textContent.trim()));
    const html = gearPath(hit[0], hit[1]);
    if (before) before.insertAdjacentHTML('beforebegin', html); else (main.querySelector('.hub-page') || main).insertAdjacentHTML('beforeend', html);
  }


  // What you need, before the steps (the inspiration's order): object photos with a plain label.
  // No supply gallery: the photos already show what's used.
  const NEED = {};
  const needBlock = items => `<h2 class="hub-h2">${F('What you need')}</h2><div class="care-need">${items.map(([n, l]) => `<figure>${img(n, l)}<figcaption>${F(l)}</figcaption></figure>`).join('')}</div>`;

  // Steps are a real sequence, so they read as numbered rows (no pictures), the same on every page.
  // Steps that teach a physical technique: Feeding's photo tiles (one row of small photos, numbered, notes in the card).
  // null = that step has no photo of its own; it moves to the top of the card's notes, so the row stays at 3–4.
  const SEQ = { 'p:sponge': [null, 'spface', 'spbody', 'spdry'],
    'p:tub': [null, 'bathface', 'tubbath', null, 'hero-1'],
    'p:brush': ['brushrice', 'brushpos', 'teeth2'],
    'h:diapers:2': ['dsetup', null, 'dtoy', 'wriggle'], 'h:diapers:3': ['dsetup', null, 'dtoy', 'dstand'], 't:diapers:3': ['dsetup', null, 'dtoy', 'dstand'],
    'h:diapers:0': [null, 'dwipe', 'dslide', 'cord'], 'h:diapers:1': [null, 'dwipe', 'dslide', 'diaper'],
    't:nails:0': ['nsleep', 'npress', 'nailfile'], 't:nails:1': ['nsleep', 'npress', 'nails'], 't:nails:2': ['nsleep', 'npress', 'nails'], 't:nails:3': ['nsleep', 'npress', 'nails'] };
  function photoSteps(main, r) {
    const pics = SEQ[r]; if (!pics) return false;
    const h = [...main.querySelectorAll('h2.hub-h2')].find(x => x.textContent.trim() === 'Steps'); const fig = h && h.nextElementSibling;
    if (!fig) return false; if (fig.classList.contains('ph-tiles')) return true;
    const steps = [...fig.querySelectorAll('.hub-iconstep')]; if (steps.length !== pics.length) return false;
    let notes = fig.querySelector('.tpl-notes'); const moved = []; let lead = '';
    steps.forEach((st, i) => { const art = st.querySelector('.hub-iconstep-art');
      if (!pics[i]) { const b = st.querySelector('b').cloneNode(true); b.querySelectorAll('em').forEach(e => e.remove()); const sm = st.querySelector('small');
        if (i === 0) { lead = `<b>${b.innerHTML}.</b> ${sm ? sm.innerHTML : ''}${sm && /[.?!]$/.test(sm.textContent.trim()) ? '' : '.'}`; st.remove(); return; }
        moved.push(`<li><b style="color:#302d3c">${b.innerHTML}.</b> ${sm ? sm.innerHTML : ''}${sm && /[.?!]$/.test(sm.textContent.trim()) ? '' : '.'}</li>`); st.remove(); return; }
      if (art) art.outerHTML = `<span class="ph-tile">${img(pics[i], st.querySelector('b').textContent)}</span>`; });
    fig.querySelectorAll('.hub-iconstep b em').forEach((e, i) => { e.textContent = i + 1; });
    const n = pics.filter(Boolean).length; fig.className = fig.className.replace(/\bis-\d\b/, 'is-' + n) + ' ph-tiles care-tiles';
    if (lead) fig.insertAdjacentHTML('afterbegin', `<p class="care-tiles-lead"><span>First</span>${lead}</p>`);
    if (moved.length) { if (!notes) { notes = document.createElement('ul'); notes.className = 'tpl-notes'; fig.appendChild(notes); } notes.insertAdjacentHTML('afterbegin', moved.join('')); }
    return true;
  }

  const DIAPER_SVG = (() => {
    const body = '<path d="M30 38h100v8c0 10-6 16-16 22l-14 8c-6 4-8 10-8 18v8H68v-8c0-8-2-14-8-18l-14-8c-10-6-16-12-16-22Z" fill="#fff" stroke="#c9dde6" stroke-width="2"/>'
      + '<rect x="52" y="41" width="56" height="14" rx="4" fill="#e3f1f7"/>';
    const wrap = (inner, bg) => `<svg viewBox="10 14 140 105" role="img" aria-hidden="true" style="display:block;width:100%;aspect-ratio:1;background:${bg}">${inner}</svg>`;
    const fit = body
      + '<path d="M16 40c10-4 30-4 44 0l4 12c-14 3-32 3-44-1Z" fill="#8cc1d6"/><rect x="54" y="42" width="12" height="11" rx="3" fill="#2a6078" opacity=".85"/>'
      + '<path d="M144 40c-10-4-30-4-44 0l-4 12c14 3 32 3 44-1Z" fill="#8cc1d6"/><rect x="94" y="42" width="12" height="11" rx="3" fill="#2a6078" opacity=".85"/>'
      + '<path d="M58 30v-8m44 8v-8" stroke="#2a6078" stroke-width="2" stroke-linecap="round"/><path d="M62 22h36" stroke="#2a6078" stroke-width="2" stroke-dasharray="3 4" stroke-linecap="round"/>';
    const small = body
      + '<path d="M8 43c6-3 16-3 24-1l2 6c-8 2-18 2-24 0Z" fill="#e9b4a8"/><rect x="28" y="41" width="8" height="10" rx="3" fill="#9b3326" opacity=".85"/>'
      + '<path d="M152 43c-6-3-16-3-24-1l-2 6c8 2 18 2 24 0Z" fill="#e9b4a8"/><rect x="124" y="41" width="8" height="10" rx="3" fill="#9b3326" opacity=".85"/>'
      + '<path d="M40 64l-4 6m-4-10l-5 4M120 64l4 6m4-10l5 4" stroke="#d9785f" stroke-width="2" stroke-linecap="round"/>';
    return { fit: wrap(fit, '#ecf6fa'), small: wrap(small, '#fbefec') };
  })();
  const PAIRS = {
    diapers: ['Does it still fit?', [['svg:fit', 'Fits well', 'The tabs close near the middle, with two fingers’ room.', 'ok'], ['svg:small', 'Time to size up', 'The tabs barely reach the front. Or red marks, or leaks.', 'no']]],
    clothes: ['Dress for the room', [['coolroom', 'Cool room', 'Long sleeves and feet, then a sleep sack.', 'ok'], ['warmroom', 'Warm room', 'One light layer is enough.', 'ok']]]
  };
  function pairBlock(k) { const [t, items] = PAIRS[k];
    return `<h2 class="hub-h2">${F(t)}</h2><div class="care-pair">${items.map(([n, b, l, c]) => `<figure class="is-${c}">${/^svg:/.test(n) ? DIAPER_SVG[n.slice(4)] : img(n, b)}<figcaption><b>${F(b)}</b><small>${F(l)}</small></figcaption></figure>`).join('')}</div>`; }
  function addPair(main, r) {
    if (main.querySelector('.care-pair')) return;
    const k = /^(h|t):diapers/.test(r) ? 'diapers' : /^t:clothes/.test(r) ? 'clothes' : null; if (!k) return;
    const hs = [...main.querySelectorAll('h2.hub-h2')], at = hs.find(h => /^(Good to know|What’s normal)$/.test(h.textContent.trim()));
    if (at) at.insertAdjacentHTML('beforebegin', pairBlock(k));
    // the pair shows the size-up signs, so the text row saying the same goes
    if (k === 'diapers') main.querySelectorAll('.hub-row').forEach(row => { if (/size up/i.test(row.textContent)) row.remove(); });
  }

  function numberSteps(main) {
    const h = [...main.querySelectorAll('h2.hub-h2')].find(x => x.textContent.trim() === 'Steps'); if (!h) return;
    const fig = h.nextElementSibling; if (!fig || !fig.classList.contains('hub-iconsteps') || fig.classList.contains('care-nsteps')) return;
    const row = fig.querySelector('.hub-iconsteps-row'); if (!row) return;
    const items = [...row.querySelectorAll('.hub-iconstep')].map((st, i) => { const b = st.querySelector('b'), sm = st.querySelector('small'); const t = b ? b.cloneNode(true) : null; if (t) t.querySelectorAll('em').forEach(e => e.remove());
      return `<li><span class="care-n">${i + 1}</span><div><b>${t ? t.innerHTML : ''}</b>${sm ? `<small>${sm.innerHTML}</small>` : ''}</div></li>`; }).join('');
    const ol = document.createElement('ol'); ol.innerHTML = items; row.replaceWith(ol); fig.classList.add('care-nsteps');
  }


  // Any drawn picture left in an icon spot becomes the plain line icon, so every icon looks the same.
  const TUB = '<svg viewBox="0 0 24 24" fill="none" stroke="#2a6078" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"/><path d="M6 11V6.5A2.5 2.5 0 0 1 10.5 5"/><path d="m7 18-1 2m11-2 1 2"/></svg>';
  const lineIcons = main => main.querySelectorAll('.hub-dot svg[viewBox="0 0 100 100"], .hub-iconstep-art svg[viewBox="0 0 100 100"]').forEach(s => { s.outerHTML = TUB; });

  // Skin pages, like the inspiration: a big photo with a close-up circle, then what helps, then how to tell normal from time to call.
  const ZOOM = { cradle: [45, 35, 'br'], acne: [36, 60, 'tl'], newborn: [45, 45, 'br'], peeling: [35, 45, 'br'], drool: [55, 60, 'tr'], eczema: [40, 48, 'br'], heat: [50, 48, 'tr'] };
  function sizeUp(main, r) {
    if (!/^(h:diapers|t:diapers)/.test(r) || /size up/i.test(main.textContent) || !window.__hub) return;
    const row = window.__hub.row({ icon: 'diaper', cat: CAT, title: 'Leaks mean it’s time to size up', sub: 'So do red marks at the legs or waist, or tabs that don’t reach the middle.' });
    const h = [...main.querySelectorAll('h2.hub-h2')].find(x => x.textContent.trim() === 'Good to know');
    const list = h && h.nextElementSibling;
    if (list && list.querySelectorAll('.hub-row').length < 3) list.insertAdjacentHTML('beforeend', row);
    else if (!h) (main.querySelector('.hub-page') || main).insertAdjacentHTML('beforeend', window.__hub.list('Good to know', [row]));
  }

  function skinPage(main, id) {
    const fig = main.querySelector('.care-map'); if (!fig || main.querySelector('.care-skin')) return;
    const where = (fig.querySelector('.tpl-where') || {}).textContent || '', look = (fig.querySelector('.tpl-look') || {}).innerHTML || '';
    const [x, y, corner] = ZOOM[id] || [50, 50, 'tr'], n = RASH[id], S = 3;
    const pos = Math.max(0, Math.min(1, (y / 100 - 0.375) / 0.25)), top = pos * 0.25, py = ((y / 100 - top) / 0.75) * 100;   // 4:3 window on a square photo
    const bp = c => ((c / 100 * S - 0.5) / (S - 1) * 100).toFixed(1) + '%';
    const name = (main.querySelector('.dev-area-head h1') || {}).textContent || '';
    fig.outerHTML = `<figure class="ph-photo ph-hero care-ph care-skin" style="--py:${(pos * 100).toFixed(0)}%">${img(n, name)}
      <span class="care-zoom is-${corner}" style="background-image:url('${src(n)}');background-position:${bp(x)} ${bp(y)}"></span>
</figure>${where ? `<p class="care-skin-where"><b>${F('Where:')}</b> ${F(where)}</p>` : ''}`;
    const callH = [...main.querySelectorAll('h2.hub-h2')].find(h => h.textContent.trim() === 'When to call'), calls = main.querySelector('.care-calls');
    if (!callH || !calls) return;
    const ps = [...calls.querySelectorAll('p')], ped = ps.find(p => /pediatrician/i.test(p.textContent)), urgent = ps.find(p => /911|ER\b/.test(p.textContent));
    const clean = p => p.innerHTML.trim();
    callH.textContent = F('How to tell');
    calls.outerHTML = `<div class="care-tell"><div class="is-ok"><b class="care-tell-k"><span class="care-tell-ic"><svg viewBox="0 0 24 24" fill="none" stroke="#2a6078" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>${F('Normal')}</b><p>${look}</p></div>`
      + `<div class="is-call"><b class="care-tell-k"><span class="care-tell-ic"><svg viewBox="0 0 24 24" fill="none" stroke="#9b3326" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg></span>${F('Time to call')}</b><p>${ped ? clean(ped) : ''}</p></div></div>`
      + (urgent ? `<p class="care-tell-911">${urgent.innerHTML}</p>` : '');
  }

  const route = () => (typeof page === 'string' && page.startsWith('chg:' + CAT + ':d:')) ? page.slice(('chg:' + CAT + ':d:').length) : null;
  const onCare = () => typeof page === 'string' && (page === 'topic:' + CAT || page.startsWith('chg:' + CAT));
  const routeOf = el => { const m = (el.getAttribute('onclick') || '').match(/chg:Daily rhythm:d:([^']+)'/); return m ? m[1] : null; };

  // Rows that open a how-to get a photo on the left, like Feeding's "Right now" rows.
  function photoRows(list) {
    if (!list || list.classList.contains('fd-plist')) return;
    const rows = [...list.querySelectorAll(':scope > .hub-row')];
    if (!rows.length || rows.some(r => !rowPhoto(routeOf(r) || ''))) return;   // all or none, so a list never mixes looks
    rows.forEach(r => { const dot = r.querySelector('.hub-dot'); if (!dot) return; const s = document.createElement('span'); s.className = 'fd-thumb'; s.innerHTML = img(rowPhoto(routeOf(r)), ''); dot.replaceWith(s); r.classList.add('fd-prow'); r.removeAttribute('style'); });
    list.classList.add('fd-plist', 'care-plist');
  }

  // Rows whose page didn't change since the stage before become one quiet line of links, so a parent who checks in
  // each stage sees what's new up top, and the routine is still one tap away.
  const SAME = { 1: [/^h:diapers/, /^t:nails/], 2: [/^h:skin/, /^t:sun/, /^t:nails/] };
  const SHORT = { 'h:diapers': 'Diapers', 't:nails': 'Nails', 'h:skin': 'Skin care', 't:sun': 'Sun' };
  function sameAsBefore(list, v) {
    if (!list || !SAME[v] || list.parentElement.querySelector('.care-same')) return;
    const same = [...list.querySelectorAll(':scope > .hub-row')].filter(r => SAME[v].some(re => re.test(routeOf(r) || '')));
    if (!same.length) return;
    const chips = same.map(r => { const k = Object.keys(SHORT).find(k => (routeOf(r) || '').startsWith(k)); return `<button class="care-same-chip" onclick="${r.getAttribute('onclick')}">${F(SHORT[k] || r.querySelector('b').textContent)}</button>`; }).join('');
    same.forEach(r => r.remove());
    list.insertAdjacentHTML('afterend', `<div class="care-same"><span>${F('Same as before')}</span>${chips}</div>`);
  }

  const NEWS = [
    [['p:sponge', 'Sponge baths for now', 'Until the cord falls off, usually 1–3 weeks.'], ['h:diapers:0', 'Change a diaper', 'Front to back, then let it air-dry.', 'diaper'],
      ['cord', 'Care for the cord', 'Keep it clean, dry and in the air.', 'cord'], ['t:nails:0', 'Trim tiny nails', 'A file at first, then clippers.', 'nails'],
      ['t:clothes:0', 'Dress {o} in layers', 'One layer more than you.', 'clothes']],
    [['p:tub', 'The first tub bath may be close', 'Once the cord falls off and the belly button heals.'], ['h:skin:1', 'Keep skin comfortable', 'Plain water, and cream for dry patches.', 'cream'],
      ['t:sun:1', 'Keep {o} sun-safe', 'Shade and clothing first, no sunscreen yet.', 'sun']],
    [['h:diapers:2', 'When {s} {wriggle|wriggles} through changes', 'Set up a mat on the floor, with everything in reach.'], ['t:bath:2', 'Make the bath part of bedtime', 'A warm bath helps many babies wind down.', 'bedtime']],
    [['p:brush', 'When the first tooth peeks through', 'Start brushing morning and night.'], ['t:bath:3', 'Ready for the big tub?', 'Once {s} {sit|sits} steadily on {p} own.', 'bigtub'],
      ['t:sun:3', 'Sunscreen can start now', 'On skin that shade and clothes don’t cover.', 'sun'], ['t:diapers:3', 'Changes on the move', 'A toy to hold, and stand-up changes once {s} {pull|pulls} up.', 'wriggle'],
      ['p:feet', 'Bare feet, then first shoes', 'Soft shoes once {s’s} walking outside.', 'feet']]
  ];
  // Everything else new at this stage, as cards under the top card. Routine that didn't change lives in Care at a glance and All how-tos.
  function newCards(main, hero, v) {
    if (!NEWS[v] || main.querySelector('.care-news')) return;
    const go = r => `openPage('chg:${CAT}:d:${r}')`;
    const cards = NEWS[v].slice(1).map(([r, t, l, n]) => `<button class="care-news-card" onclick="${go(r)}">${img(n, '')}<span><b>${F(t)}</b><small>${F(l)}</small></span><i aria-hidden="true">›</i></button>`).join('');
    const who = ((main.querySelector('h2.hub-h2') && [...main.querySelectorAll('h2.hub-h2')].map(h => h.textContent).find(t => /^Right now for /.test(t))) || '').replace(/^Right now for /, '');
    if (cards) hero.insertAdjacentHTML('afterend', `<h2 class="hub-h2 care-news-h">${who ? F('Also new for ') + who : F('Also new now')}</h2><div class="care-news">${cards}</div>`);
    // The old "Right now" list and its "Same as before" line go: every new thing is now a card.
    const h2 = [...main.querySelectorAll('h2.hub-h2')].find(h => /^(Right now for|At this stage)/.test(h.textContent));
    if (h2) { const list = h2.nextElementSibling; if (list && list.nextElementSibling && list.nextElementSibling.classList.contains('care-same')) list.nextElementSibling.remove(); if (list) list.remove(); h2.remove(); }
  }

  // Stage tabs at the top, like Development and Feeding (in place of "All stages ›").
  const TABS = ['Newborn', '1–3 mo', '4–6 mo', '6–12 mo'];
  function stageTabs(main, v) {
    if (main.querySelector('.care-tabs')) return;
    // The app adds a "Looking back / Previewing" banner on stages that aren't the baby's; the tabs replace it.
    setTimeout(() => { const bn = main.querySelector('.st-banner'); if (bn) bn.remove(); else window.__careNow = v;
      main.querySelectorAll('.care-tabs button').forEach((b, i) => b.classList.toggle('is-now', i === window.__careNow)); }, 0);
    const now = window.__careNow;
    const chip = main.querySelector('.care-hero .st-chip'); if (chip) chip.remove();
    const nav = `<nav class="care-tabs" aria-label="Everyday care by age">${TABS.map((t, i) => `<button class="${i === v ? 'is-on' : ''}${i === now ? ' is-now' : ''}" onclick="openPage('chg:${CAT}:s:${i}')"${i === v ? ' aria-current="page"' : ''}>${F(t)}</button>`).join('')}</nav>`;
    const head = main.querySelector('.monthly-page-header'); if (head) head.insertAdjacentHTML('afterend', nav);
  }

  const ROUTINES = [
    ['Bathing', 'From sponge baths to the big tub.', 'tubbath', ['p:sponge', 'p:tub', 't:bath:2', 't:bath:3']],
    ['Teeth and gums', 'Gum wipes now, brushing from the first tooth.', 'gums', ['h:gums:0', 'h:gums:1', 'p:teething', 'p:brush']],
    ['Diapering', 'Changes, sizes and diaper rash.', 'diaper', ['h:diapers:0', 'h:diapers:1', 'h:diapers:2', 't:diapers:3']],
    ['Nail care', 'Short and smooth, about once a week.', 'nails', ['t:nails:0', 't:nails:1', 't:nails:2', 't:nails:3']],
    ['Skin care', 'Plain water, and cream for dry patches.', 'cream', ['h:skin:1', 'h:skin:1', 'h:skin:2', 'h:skin:3']],
    ['Dressing', 'Layers, sleepwear and the car seat.', 'clothes', ['t:clothes:0', 't:clothes:1', 't:clothes:2', 't:clothes:2']],
    ['Sun protection', 'Shade first, then sunscreen from 6 months.', 'sun', ['t:sun:0', 't:sun:1', 't:sun:2', 't:sun:3']]
  ];
  const ROUTINE_CORD = ['The cord', 'Clean, dry and in the air until it falls off.', 'cord', ['cord']];
  const LOOK_PH = { 'p:teething': 'soregums', rash: 'eczema', poop: 'cleandiaper', cord: 'cord', yellow: 'milia', eyes: 'eyes' };
  function lookPage(main) {
    const box = main.querySelector('.care-lookoff'); if (!box || box.classList.contains('care-news')) return;
    box.querySelectorAll('.care-pick').forEach(b => {
      const r = (b.getAttribute('onclick') || '').replace(/.*d:/, '').replace(/'.*/, ''), k = r === 'p:teething' ? r : r.split(':').pop();
      const ic = b.querySelector('.care-ico'); if (ic && LOOK_PH[k]) ic.outerHTML = img(LOOK_PH[k], '');
      b.className = 'care-news-card';
    });
    box.className = 'care-news care-lookoff';
  }

  function routinesPage(main, v) {
    if (main.querySelector('.care-routines')) return;
    const page = main.querySelector('.hub-page') || main, head = main.querySelector('.monthly-page-header');
    const keep = head ? head.outerHTML : '';
    const list = (v === 0 ? [ROUTINE_CORD, ...ROUTINES] : ROUTINES).map(([t, l, n, rs]) => `<button class="care-news-card" onclick="openPage('chg:${CAT}:d:${rs[Math.min(v, rs.length - 1)]}')">${img(n, '')}<span><b>${F(t)}</b><small>${F(l)}</small></span><i aria-hidden="true">›</i></button>`).join('');
    page.innerHTML = keep + `<div class="dev-area-head ss-head" style="--area:#e3f1f7;--area-ink:#2a6078"><p class="hub-context">${F('Care routines')}</p><h1>${F('The basics, for {o} now')}</h1><p class="hub-lead">${F('Each one opens the version for {p} age.')}</p></div><div class="care-news care-routines">${list}</div>`;
  }

  function dressHome(main) {
    const v = Number((main.querySelector('[data-care-stage]') || {}).dataset?.careStage);
    const hero = main.querySelector('.care-hero.care-disc');
    stageTabs(main, v);
    if (hero && !hero.classList.contains('care-life')) {
      const art = hero.querySelector('.care-art'), h = HERO[v] || HERO[0];
      if (art) art.outerHTML = `<div class="sf-photo care-life-photo">${img(h[0], h[1])}</div>`;
      // "New now" as one quiet line under the photo, like Feeding's Try this. The page it opens says the rest.
      const note = hero.querySelector('.care-nownote');
      if (note) { const t = note.querySelector('b'), d = [...note.querySelectorAll('p,span,small')].find(e => e.textContent.trim().length > 20 && !e.querySelector('b') && !/›/.test(e.textContent)); const line = document.createElement('div'); line.className = 'care-newline'; line.setAttribute('role', 'button'); line.tabIndex = 0;
        line.setAttribute('onclick', note.getAttribute('onclick')); const top = NEWS[v] && NEWS[v][0] && !/cord has long since healed/.test(note.textContent) ? NEWS[v][0] : null;
        line.innerHTML = `<div><p>${top ? F(top[1]) : (t ? t.innerHTML : '')}</p><small>${top ? F(top[2]) : (d ? d.innerHTML : '')}</small></div><span aria-hidden="true">›</span>`; note.replaceWith(line); }
      hero.classList.add('care-life');
    }
    if (hero) newCards(main, hero, v);
    const all = [...main.querySelectorAll('.care-all-how')].find(a => /:how:/.test(a.getAttribute('onclick') || ''));
    if (all && !all.classList.contains('care-routine-row')) { all.className = 'care-routine-row'; all.innerHTML = `<span class="care-routine-ic"><svg viewBox="0 0 24 24" fill="none" stroke="#2a6078" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg></span><span><b>${F('Care routines')}</b><small>${F('Bathing, teeth, nails and more, for {o} now.')}</small></span><i aria-hidden="true">›</i>`; }
    main.querySelectorAll('.care-see > button').forEach(b => {
      const r = routeOf(b), n = v === 3 && r === 'p:teething' ? 'soregums' : SEE[r], art = b.querySelector('.care-see-art'); if (!n || !art || art.classList.contains('ph-tile')) return;
      art.className = 'care-see-art ph-tile'; art.innerHTML = img(n, b.textContent.trim()); b.classList.add('care-see-ph');
      const line = v === 3 && r === 'p:teething' ? 'Drool and chewing are common.' : SEE_LINE[r], name = b.querySelector('b');
      if (line && name && !b.querySelector('.care-see-line')) name.insertAdjacentHTML('afterend', `<small class="care-see-line">${F(line)}</small><i class="care-see-go" aria-hidden="true">›</i>`);
      // Small tiles zoom in on the thing itself, so it reads at this size.
      const c = TILE_CROP[n], im = art.querySelector('img'); if (c && im) { im.style.objectPosition = `${c[0]}% ${c[1]}%`; im.style.transformOrigin = `${c[0]}% ${c[1]}%`; im.style.transform = `scale(${c[2]})`; }
    });
  }

  function dressPage(main, r) {
    const head = main.querySelector('.dev-area-head'); if (!head) return;
    // All how-tos: the same photo rows.
    const hm = r.match(/^how:(\d)/); if (hm) { routinesPage(main, +hm[1]); return; }
    if (/^look:\d$/.test(r)) { lookPage(main); return; }
    // Is this normal? pages: a real photo in place of the body outline.
    const seq = photoSteps(main, r); if (!seq) numberSteps(main); lineIcons(main); sizeUp(main, r); addPair(main, r);
    const rm = r.match(/^rash:(\w+)/);
    if (rm && RASH[rm[1]]) { skinPage(main, rm[1]); return; }
    addPath(main, r);
    if (main.querySelector('.care-timeline')) main.querySelectorAll('.tpl-notes li').forEach(li => { if (/big tub comes once/i.test(li.textContent)) li.remove(); });
    addCue(main, r);
    const hit = PAGE.find(([re]) => re.test(r)); if (!hit || main.querySelector('.care-ph')) return;
    // One prominent picture, then the strip: never the same photo twice, and the fit pair already shows the diaper.
    if (NOHERO.has(r) || (SEQ[r] || []).includes(hit[1][1]) || (hit[1][1] === 'diaper' && main.querySelector('.care-pair'))) return;
    const [title, n, alt, pins, cls, into] = hit[1];
    // Most pages: the photo is the first section. A photo of what helps sits at the top of that page's own section instead.
    const own = into && [...main.querySelectorAll('h2.hub-h2')].find(h => h.textContent.trim() === into);
    if (own) own.insertAdjacentHTML('afterend', photo(n, alt, pins, (cls || '') + ' is-in'));
    else head.insertAdjacentHTML('afterend', `<h2 class="hub-h2">${F(title)}</h2>` + photo(n, alt, pins, cls || '') + (NEED[r] ? needBlock(NEED[r]) : ''));
  }

  function dress() {
    if (window.__carePhotoOff || !onCare()) return;
    const main = document.querySelector('#main'); if (!main) return;
    const r = route();
    if (r == null || main.querySelector('[data-care-stage]')) dressHome(main); else dressPage(main, r);
  }
  window.__carePhotosDress = dress;
  const base = window.render;
  window.render = render = function (...a) { const out = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return out; };
})();
