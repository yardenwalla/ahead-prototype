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
  const src = n => `assets/care/${n}.jpg?v=1120a`;
  const img = (n, alt) => `<img src="${src(n)}" alt="${F(alt).replace(/"/g, '&quot;')}" loading="lazy">`;
  const pin = ([label, x, y, side]) => `<span class="ph-pin ph-pin-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(label)}</span></span>`;
  const photo = (n, alt, pins, cls = '') => `<figure class="ph-photo ph-hero care-ph ${cls}">${img(n, alt)}${(pins || []).map(pin).join('')}</figure>`;

  // Top card photos, one per stage (Newborn, 1–3, 4–6, 6–12 months).
  const HERO = [['hero-0', 'A newborn on a changing pad, a hand resting on the tummy'], ['hero-1', 'A baby wrapped in a hooded towel after a bath'],
    ['hero-2', 'A baby with a bib, chewing a teething ring'], ['hero-3', 'A parent brushing a baby’s first teeth']];

  // Which photo goes with which page, by the page's route (after "chg:Daily rhythm:d:").
  const ROW = [[/^p:sponge/, 'sponge'], [/^p:tub/, 'tubbath'], [/^cord/, 'cord'], [/^(h|t):diapers:[01]/, 'diaper'], [/^(h:diapers:2|t:diapers:[23])/, 'wriggle'],
    [/^(h|t):skin/, 'cream'], [/^t:nails/, 'nails'], [/^t:clothes/, 'clothes'], [/^t:sun/, 'sun'], [/^p:teething/, 'teethers'], [/^t:bath:[01]/, 'tub'], [/^t:bath:2/, 'tub'],
    [/^t:bath:3/, 'bigtub'], [/^p:feet/, 'feet'], [/^h:gums/, 'gums'], [/^p:brush/, 'hero-3']];
  const rowPhoto = r => (ROW.find(([re]) => re.test(r)) || [])[1];
  // "Is this normal?" tiles: what a parent would see.
  const SEE = { 'rash:peeling': 'peeling', 'rash:newborn': 'milia', 'look:0:cord': 'cord', 'rash:acne': 'acne', 'rash:cradle': 'cradle', 'look:1:poop': 'cleandiaper',
    'rash:drool': 'drool', 'p:teething': 'soregums', 'rash:eczema': 'eczema', 'look:3:poop': 'solids', 'rash:heat': 'heat' };
  // Is this normal? pages: the photo for "What it looks like".
  const RASH = { peeling: 'peeling', newborn: 'milia', acne: 'acne', cradle: 'cradle', drool: 'drool', eczema: 'eczema', heat: 'heat' };

  // How-to pages: [section title, photo, alt, pins]. Pins name the thing they sit next to, and say why it matters.
  const PAGE = [
    [/^p:sponge/, ['How it looks', 'sponge', 'A sponge bath on a towel: one arm washed at a time, the rest wrapped', [['The rest stays wrapped', 30, 74, 'r'], ['A bowl of warm water', 86, 60, 'l']]], 'bath'],
    [/^p:tub/, ['How it looks', 'tubbath', 'A baby in a baby tub, a hand behind the head', [['A hand behind the head', 18, 21, 'r'], ['About 2 inches of water', 58, 84, 'l']]], 'bath'],
    [/^t:bath:3/, ['How it looks', 'bigtub', 'A family tub with shallow water, a towel ready on the edge', [['Shallow water', 62, 66, 'l']]], 'bath'],
    [/^cord/, ['How it looks', 'cord', 'A newborn belly, the cord stump open to the air', [['Left open to the air', 50, 52, 'r']]], 'cord'],
    [/^(h|t):diapers:[01]/, ['How it looks', 'diaper', 'Fastening a clean diaper at the waist', [['Two fingers fit at the waist', 54, 40, 'l']]], 'diapers'],
    [/^(h:diapers:2|t:diapers:[23])/, ['How it looks', 'wriggle', 'Changing a baby on a floor mat, a toy in hand and a hand on the tummy', [['Something to hold', 40, 42, 'l'], ['A hand on {o}', 32, 74, 'r'], ['All in reach', 90, 54, 'l']]], 'diapers'],
    [/^h:skin/, ['How it looks', 'cream', 'Smoothing thick cream onto a baby’s leg after a bath', [['A thick, fragrance-free cream', 50, 46, 'b']]], 'skin'],
    [/^t:clothes/, ['Three layers, for example', 'clothes', 'A bodysuit, pajamas and a sleep sack laid out', [['Bodysuit', 30, 26, 'r'], ['Pajamas', 62, 40, 'r'], ['Sleep sack', 25, 66, 'r']]], 'clothes'],
    [/^t:sun/, ['How it looks', 'sun', 'A baby in a sun hat and long sleeves, in the stroller’s shade', [['Wide-brimmed hat', 42, 28, 'l'], ['Long, light sleeves', 24, 76, 'r']]], 'sun'],
    [/^p:teething/, ['What to do', 'teethers', 'A teething ring and a firm rubber teether', [['Chilled, not frozen', 44, 62, 'b'], ['Firm rubber', 80, 47, 'b']], '', 'What to do'], 'teeth'],
    [/^h:gums/, ['How it looks', 'gums', 'Wiping a baby’s gums with a cloth on a finger', [['A soft, damp cloth', 40, 72, 'r']]], 'teeth'],
    [/^p:feet/, ['How it looks', 'feet', 'A barefoot baby standing at the sofa', [['Bare feet grip the floor', 48, 90, 'r']]], 'clothes']
  ];

  // How it changes: the gear as a path, the same block as Outings' "Which seat, and when". Each step is named by the cue
  // to move on, not an age, and the step this page is about is outlined.
  const STEPS = {
    bath: ['Which tub, and when', [['sponge', 'A sponge bath on a towel', 'Cord still on', 'Sponge baths'], ['tubbath', 'A baby tub with a sling', 'Cord healed', 'A baby tub'],
      ['tubinbig', 'A baby tub set inside the big tub', 'Too big, can’t sit yet', 'Baby tub in the big tub'], ['bigtub', 'The big tub with shallow water', 'Sits steadily', 'The big tub']],
      'Move on by what {s} can do, not the age on the box.'],
    nails: ['File, then clippers', [['nailfile', 'Filing a newborn’s nails with a soft emery board', 'First weeks', 'A soft file, maybe twice a week'], ['nails', 'Trimming nails with small baby clippers', 'Once you’re ready', 'Baby clippers, about once a week']],
      'Either is fine at any age. A file can’t nick the skin.']
  };
  const STEP_ON = { 'p:sponge': ['bath', 0], 'p:tub': ['bath', 1], 't:bath:0': ['bath', 0], 't:bath:1': ['bath', 1], 't:bath:2': ['bath', 2], 't:bath:3': ['bath', 3], 't:nails:0': ['nails', 0], 't:nails:1': ['nails', 1], 't:nails:2': ['nails', 1], 't:nails:3': ['nails', 1] };
  const gearPath = (k, on) => { const [title, items, note] = STEPS[k];
    return `<h2 class="hub-h2">${F(title)}</h2><div class="care-psteps" style="--n:${items.length}">${items.map(([n, alt, when, line], i) => `<figure class="${i === on ? 'is-on' : ''}">${img(n, alt)}<figcaption><b>${F(when)}</b><small>${F(line)}</small></figcaption></figure>`).join('')}</div><p class="care-psteps-note">${F(note)}</p>`; };
  function addPath(main, r) {
    const hit = STEP_ON[r]; if (!hit || main.querySelector('.care-psteps')) return;
    // After the how-to and its safety rows, before Good to know and the video.
    // Nails: the two tools are the page's picture, so the path is the first section (like Outings' car seat page).
    if (hit[0] === 'nails') { const head = main.querySelector('.dev-area-head'); if (head) { head.insertAdjacentHTML('afterend', gearPath(hit[0], hit[1])); return; } }
    const hs = [...main.querySelectorAll('h2.hub-h2')], before = hs.find(h => /^(Good to know|Watch how|When to call)$/.test(h.textContent.trim()));
    const html = gearPath(hit[0], hit[1]);
    if (before) before.insertAdjacentHTML('beforebegin', html); else (main.querySelector('.hub-page') || main).insertAdjacentHTML('beforeend', html);
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

  function dressHome(main) {
    const v = Number((main.querySelector('[data-care-stage]') || {}).dataset?.careStage);
    const hero = main.querySelector('.care-hero.care-disc');
    if (hero && !hero.classList.contains('care-life')) {
      const art = hero.querySelector('.care-art'), h = HERO[v] || HERO[0];
      if (art) art.outerHTML = `<div class="sf-photo care-life-photo">${img(h[0], h[1])}</div>`;
      // "New now" as one quiet line under the photo, like Feeding's Try this. The page it opens says the rest.
      const note = hero.querySelector('.care-nownote');
      if (note) { const t = note.querySelector('b'); const line = document.createElement('div'); line.className = 'care-newline'; line.setAttribute('role', 'button'); line.tabIndex = 0;
        line.setAttribute('onclick', note.getAttribute('onclick')); line.innerHTML = `<p><b>${F('New:')}</b> ${t ? t.innerHTML : ''}</p><span aria-hidden="true">›</span>`; note.replaceWith(line); }
      hero.classList.add('care-life');
    }
    const h2 = [...main.querySelectorAll('h2.hub-h2')].find(h => /^(Right now for|At this stage)/.test(h.textContent));
    if (h2) photoRows(h2.nextElementSibling);
    main.querySelectorAll('.care-see > button').forEach(b => {
      const n = SEE[routeOf(b)], art = b.querySelector('.care-see-art'); if (!n || !art || art.classList.contains('ph-tile')) return;
      art.className = 'care-see-art ph-tile'; art.innerHTML = img(n, b.textContent.trim()); b.classList.add('care-see-ph');
    });
  }

  function dressPage(main, r) {
    const head = main.querySelector('.dev-area-head'); if (!head) return;
    // All how-tos: the same photo rows.
    if (/^how/.test(r)) { main.querySelectorAll('.hub-list').forEach(photoRows); return; }
    // Is this normal? pages: a real photo in place of the body outline.
    const rm = r.match(/^rash:(\w+)/);
    if (rm && RASH[rm[1]]) { const fig = main.querySelector('.care-map'); const svg = fig && fig.querySelector('svg');
      if (svg) { const s = document.createElement('span'); s.className = 'care-map-ph ph-tile'; s.innerHTML = img(RASH[rm[1]], (head.querySelector('h1') || {}).textContent || ''); svg.replaceWith(s); fig.classList.add('has-photo'); }
      return; }
    addPath(main, r);
    const hit = PAGE.find(([re]) => re.test(r)); if (!hit || main.querySelector('.care-ph')) return;
    const [title, n, alt, pins, cls, into] = hit[1];
    // Most pages: the photo is the first section. A photo of what helps sits at the top of that page's own section instead.
    const own = into && [...main.querySelectorAll('h2.hub-h2')].find(h => h.textContent.trim() === into);
    if (own) own.insertAdjacentHTML('afterend', photo(n, alt, pins, (cls || '') + ' is-in'));
    else head.insertAdjacentHTML('afterend', `<h2 class="hub-h2">${F(title)}</h2>` + photo(n, alt, pins, cls || ''));
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
