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
  const RASH = { peeling: 'peeling', newborn: 'milia', acne: 'acne', cradle: 'cradle', drool: 'drool', eczema: 'eczema', heat: 'heat' };

  // How-to pages: [section title, photo, alt, pins]. Pins name the thing they sit next to, and say why it matters.
  const PAGE = [
    [/^p:sponge/, ['A sponge bath, set up', 'sponge', 'A sponge bath on a towel: one arm washed at a time, the rest wrapped', [['The rest stays wrapped', 30, 74, 'r'], ['A bowl of warm water', 86, 60, 'l']]], 'bath'],
    [/^p:tub/, ['A safe tub bath', 'tubbath', 'A baby in a baby tub, a hand behind the head', [['A hand behind the head', 18, 21, 'r'], ['About 2 inches of water', 58, 84, 'l']]], 'bath'],
    [/^t:bath:2/, ['Bath, then bed', 'bedtime', 'A baby wrapped in a towel after a bath, pajamas and a sleep sack laid out', [['Straight into a towel', 30, 30, 'r'], ['Pajamas laid out first', 74, 52, 'l']]], 'bath'],
    [/^t:bath:3/, ['The big tub, set up', 'bigtub', 'A family tub with shallow water, a towel ready on the edge', [['Shallow water', 62, 66, 'l']]], 'bath'],
    [/^cord/, ['Let the cord air out', 'cord', 'A newborn belly, the cord stump open to the air', [['Left open to the air', 50, 52, 'r']]], 'cord'],
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
  const STEPS = {
    bath: ['Which tub, and when', [['tubbath', 'A baby tub with a newborn sling', 'Cord healed', 'Baby tub, with the sling'],
      ['tubinbig', 'A baby tub set inside the big tub', 'Too big, can’t sit yet', 'Baby tub in the big tub'], ['bigtub', 'The big tub with shallow water', 'Sits steadily', 'The big tub']],
      'Move on by what {s} can do, not the age on the box.'],
    nails: ['File, then clippers', [['nailfile', 'Filing a newborn’s nails with a soft emery board', 'First weeks', 'A soft file, maybe twice a week'], ['nails', 'Trimming nails with small baby clippers', 'Once you’re ready', 'Baby clippers, about once a week']],
      'Either is fine at any age. A file can’t nick the skin.']
  };
  const STEP_ON = { 'p:tub': ['bath', 0], 't:bath:1': ['bath', 0], 't:bath:2': ['bath', 1], 't:bath:3': ['bath', 2], 't:nails:0': ['nails', 0], 't:nails:1': ['nails', 1], 't:nails:2': ['nails', 1], 't:nails:3': ['nails', 1] };
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


  // What you need, before the steps (the inspiration's order): object photos with a plain label.
  const NEED = { 'p:sponge': [['towel', 'Towel'], ['washcloth', 'Washcloth'], ['cleandiaper', 'Clean diaper'], ['soap', 'Mild soap']],
    'p:tub': [['tub', 'Baby tub'], ['towel', 'Towel'], ['washcloth', 'Washcloth'], ['cleandiaper', 'Clean diaper']],
    't:bath:2': [['tub', 'Baby tub'], ['towel', 'Towel'], ['washcloth', 'Washcloth'], ['cleandiaper', 'Clean diaper']],
    't:bath:3': [['bigtub', 'Non-slip mat'], ['towel', 'Towel'], ['washcloth', 'Washcloth'], ['cleandiaper', 'Clean diaper']] };
  const needBlock = items => `<h2 class="hub-h2">${F('What you need')}</h2><div class="care-need">${items.map(([n, l]) => `<figure>${img(n, l)}<figcaption>${F(l)}</figcaption></figure>`).join('')}</div>`;

  // Steps are a real sequence, so they read as numbered rows (no pictures), the same on every page.
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
  const ZOOM = { cradle: [52, 24, 'br'], acne: [27, 57, 'br'], newborn: [57, 57, 'bl'], peeling: [17, 52, 'br'], drool: [55, 60, 'tr'], eczema: [43, 54, 'br'], heat: [50, 48, 'tr'] };
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
      ['cord', 'Care for the cord', 'Keep it clean, dry and in the air.', 'cord'], ['t:nails:0', 'Trim tiny nails', 'While {s} {sleep|sleeps}, with a file or clippers.', 'nails'],
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

  function dressHome(main) {
    const v = Number((main.querySelector('[data-care-stage]') || {}).dataset?.careStage);
    const hero = main.querySelector('.care-hero.care-disc');
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
    numberSteps(main); lineIcons(main); sizeUp(main, r);
    const rm = r.match(/^rash:(\w+)/);
    if (rm && RASH[rm[1]]) { skinPage(main, rm[1]); return; }
    addPath(main, r);
    if (main.querySelector('.care-psteps')) main.querySelectorAll('.tpl-notes li').forEach(li => { if (/big tub comes once/i.test(li.textContent)) li.remove(); });
    const hit = PAGE.find(([re]) => re.test(r)); if (!hit || main.querySelector('.care-ph')) return;
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
