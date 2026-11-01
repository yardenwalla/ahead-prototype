/* MOCKUP ONLY (preview copy): every category home in the new Development look.
   A warm gradient top card in the category's own color with a flat picture, and tinted icon squares.
   Not part of the app; used to decide the design before building it properly. */
(function () {
  const SK = '#f4d6c4', HK = '#e8bda6';
  const eyes = (x, y, ink) => `<path d="M${x - 4.5} ${y}h.01M${x + 4.5} ${y}h.01" stroke="${ink}" stroke-opacity=".65" stroke-width="2.8" stroke-linecap="round"/>`;
  const sleepy = (x, y, ink) => `<path d="M${x - 7} ${y}q2.5 2 5 0M${x + 2} ${y}q2.5 2 5 0" stroke="${ink}" stroke-opacity=".55" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  const base = (c, inner) => `<svg viewBox="0 0 160 116" aria-hidden="true"><circle cx="80" cy="60" r="52" fill="#fff" fill-opacity=".55"/>${inner}</svg>`;
  const ART = {
    Sleep: c => base(c, `<rect x="30" y="34" width="6" height="62" rx="3" fill="${c.ink}" fill-opacity=".3"/><rect x="124" y="34" width="6" height="62" rx="3" fill="${c.ink}" fill-opacity=".3"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${44 + i * 12}" y="42" width="4" height="34" rx="2" fill="${c.ink}" fill-opacity=".14"/>`).join('')}<rect x="36" y="74" width="88" height="14" rx="5" fill="#fff"/><rect x="62" y="62" width="46" height="16" rx="8" fill="${c.accent}"/>${`<circle cx="54" cy="68" r="10" fill="${SK}"/>`}${sleepy(54, 68, c.ink)}<path d="M126 22a10 10 0 1 0 8 14 8 8 0 0 1-8-14Z" fill="#f3d58a"/>`),
    Feeding: c => base(c, `<rect x="48" y="58" width="42" height="44" rx="20" fill="${c.accent}"/><circle cx="66" cy="44" r="16" fill="${SK}"/>${eyes(66, 42, c.ink)}<g transform="rotate(-12 92 52)"><rect x="84" y="48" width="9" height="7" rx="3.5" fill="#efd08f"/><rect x="92" y="45" width="40" height="13" rx="6.5" fill="#fff"/><rect x="104" y="45" width="28" height="13" rx="6.5" fill="#fbecc6"/></g>`),
    Health: c => base(c, `<rect x="56" y="58" width="44" height="40" rx="18" fill="${c.accent}"/><circle cx="78" cy="44" r="16" fill="${SK}"/>${eyes(78, 42, c.ink)}<path d="M74 51q4 3 8 0" stroke="${c.ink}" stroke-opacity=".5" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M112 34v18a12 12 0 0 1-24 0" stroke="${c.ink}" stroke-opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="88" cy="74" r="6" fill="#fff"/><path d="M118 30c-3-4-9-2-7 3 1 3 7 6 7 6s6-3 7-6c2-5-4-7-7-3Z" fill="#f2b8c6"/>`),
    Safety: c => base(c, `<rect x="40" y="36" width="80" height="60" rx="6" fill="none"/><rect x="40" y="40" width="6" height="58" rx="3" fill="${c.ink}" fill-opacity=".35"/><rect x="114" y="40" width="6" height="58" rx="3" fill="${c.ink}" fill-opacity=".35"/><rect x="40" y="44" width="80" height="6" rx="3" fill="${c.ink}" fill-opacity=".35"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${54 + i * 12}" y="50" width="4" height="44" rx="2" fill="${c.ink}" fill-opacity=".2"/>`).join('')}<rect x="40" y="92" width="80" height="6" rx="3" fill="${c.ink}" fill-opacity=".35"/><path d="M80 20l12 4v7c0 6-5 10-12 13-7-3-12-7-12-13v-7Z" fill="#fff"/><path d="M75 31l4 4 7-8" stroke="${c.ink}" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
    'Daily rhythm': c => base(c, `<path d="M30 58h100l-8 30a10 10 0 0 1-9.6 7.4H47.6A10 10 0 0 1 38 88Z" fill="#fff"/><path d="M34 72h92l-4 16a10 10 0 0 1-9.6 7.4H47.6A10 10 0 0 1 38 88Z" fill="#cfe8f3"/><circle cx="66" cy="58" r="12" fill="${SK}"/>${sleepy(66, 58, c.ink)}<rect x="76" y="56" width="34" height="14" rx="7" fill="${SK}"/><circle cx="104" cy="40" r="5" fill="#fff"/><circle cx="114" cy="30" r="3.5" fill="#fff"/><circle cx="96" cy="30" r="2.5" fill="#fff"/>`),
    'Out and about': c => base(c, `<path d="M58 92 72 76M98 92 86 76M96 76l18-28" stroke="${c.ink}" stroke-opacity=".5" stroke-width="3.5" stroke-linecap="round"/><path d="M110 48h10" stroke="${c.ink}" stroke-width="5" stroke-linecap="round" stroke-opacity=".7"/><circle cx="58" cy="94" r="8" fill="${c.ink}" fill-opacity=".5"/><circle cx="98" cy="94" r="8" fill="${c.ink}" fill-opacity=".5"/><rect x="48" y="58" width="56" height="20" rx="10" fill="${c.accent}"/><path d="M48 70a24 24 0 0 1 26-24v14H58c-6 0-10 4-10 10Z" fill="${c.ink}" fill-opacity=".3"/><circle cx="84" cy="56" r="8" fill="${SK}"/>${sleepy(84, 56, c.ink)}<circle cx="124" cy="30" r="8" fill="#f3d58a"/>`),
    Childcare: c => base(c, `<path d="M42 58 80 30l38 28v40H42Z" fill="#fff"/><path d="M36 60 80 26l44 34" stroke="${c.ink}" stroke-opacity=".45" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="72" y="74" width="16" height="24" rx="4" fill="${c.accent}"/><circle cx="58" cy="70" r="7" fill="${SK}"/>${eyes(58, 69, c.ink)}<rect x="52" y="77" width="12" height="14" rx="6" fill="${c.accent}"/><circle cx="102" cy="64" r="9" fill="${HK}"/><rect x="94" y="73" width="16" height="22" rx="7" fill="${c.ink}" fill-opacity=".25"/>`)
  };

  // Direction A: the one number that matters right now, set huge, with what it means underneath.
  function numberFor(t, page) {
    const now = (page.querySelector('.hub-pills .is-now, [aria-current="step"], .is-now') || {}).textContent || '';
    const stage = (page.querySelector('.hub-hero .hub-eyebrow') || {}).textContent || '';
    const m = typeof actualMonth === 'function' ? actualMonth() : 6;
    if (t === 'Development') return [String(page.dataset.developmentGuide || m), `What most babies do by ${page.dataset.developmentGuide || m} months`];
    if (t === 'Sleep') return /two/i.test(stage) ? ['2', 'Naps a day'] : /three/i.test(stage) ? ['3', 'Naps a day'] : /longer/i.test(stage) ? ['6h', 'longest stretch at night'] : ['16h', 'of sleep a day, in short stretches'];
    if (t === 'Feeding') return /preparing/i.test(stage) ? ['4', 'Signs she’s ready for solids'] : /solid/i.test(stage) ? ['9', 'allergens to try'] : ['8–12', 'feeds a day'];
    if (t === 'Health') return [String(m), `Your ${m}-month checkup`];
    if (t === 'Safety') return ['8', 'Babyproofing checks'];
    if (t === 'Daily rhythm') return ['2–3', 'Baths a week'];
    if (t === 'Out and about') return ['1h', 'At most in a seat or stroller at a time'];
    if (t === 'Childcare') return ['4', 'Kinds of care to compare'];
    return ['', ''];
  }
  // Direction C: one quiet family of white shapes for every category, tone on tone like the big number.
  // Same shapes everywhere, nudged a little per category so pages feel related, never identical, and never a picture.
  function shapes(t, c) {
    const seed = { Development: 0, Sleep: 1, Feeding: 2, Health: 3, Safety: 4, 'Daily rhythm': 5, 'Out and about': 6, Childcare: 7 }[t] || 0;
    const r = [[0, 0], [14, -10], [-10, 12], [8, 16], [-14, -6], [18, 8], [-6, -14], [10, 4]][seed];
    const [dx, dy] = r;
    return `<svg viewBox="0 0 200 160" preserveAspectRatio="xMaxYMin slice">
      <circle cx="${168 + dx}" cy="${28 + dy}" r="74" fill="#fff" fill-opacity=".38"/>
      <circle cx="${112 + dx}" cy="${70 + dy}" r="30" fill="#fff" fill-opacity=".32"/>
      <path d="M${70 + dx} ${150} a${70} ${70} 0 0 1 ${140} 0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="10" stroke-linecap="round"/>
    </svg>`;
  }
  const pal = t => (typeof YEAR_PALETTES !== 'undefined' && (YEAR_PALETTES[t] || YEAR_PALETTES.Memories)) || { bg: '#eee', pale: '#f6f6f6', ink: '#444', accent: '#ccc' };
  // One page skeleton for every category: timeline, a top card with the same three parts and a picture,
  // then one question (if any), then everything else. Anything that used to sit inside the top card moves into its own card.
  function dress() {
    const page = document.querySelector('#main .hub-page[data-overview]:not(.hub-detail)');
    if (!page || page.dataset.mock) return;
    page.dataset.mock = '1';
    const t = page.dataset.overview;
    let hero = page.querySelector('.hub-hero, .dev-hero');
    if (!hero) return;
    // Development: same top card as everyone else, with the baby at this stage instead of the big number.
    if (hero.classList.contains('dev-hero')) {
      const ref = Number(page.dataset.developmentGuide) || 6;
      const h = document.createElement('header');
      h.className = 'hub-hero';
      h.innerHTML = `<p class="hub-eyebrow">${hero.querySelector('.dev-hero-eyebrow').textContent}</p><h1>${hero.querySelector('h1').textContent}</h1><p class="hub-lead">${hero.querySelector('.dev-hero-lead').textContent}</p>`;
      hero.replaceWith(h); hero = h;
      hero.dataset.art = (window.devHeroArt ? devHeroArt(ref) : '').replace('<circle cx="80" cy="60" r="52" fill="#efedff"/>', '<circle cx="80" cy="60" r="52" fill="#fff" fill-opacity=".55"/>');
    }
    hero.classList.add('mock-hero');
    // Move extras out of the top card.
    const keep = el => el.matches('.hub-eyebrow, h1, .hub-lead');
    const extras = [...hero.children].filter(el => !keep(el));
    const bare = extras.length && !hero.querySelector('.hub-checks-label') && extras.every(el => el.matches('button, .hub-pillrow, .hub-button'));
    if (bare) { extras.reverse().forEach(el => { el.classList.add('mock-bare'); hero.after(el); }); }
    else if (extras.length) {
      const card = document.createElement('section');
      card.className = 'hub-card mock-after';
      const label = hero.querySelector('.hub-checks-label');
      if (label) { const head = document.createElement('span'); head.className = 'hub-card-head'; head.innerHTML = `<b>${label.textContent}</b>`; card.appendChild(head); label.remove(); }
      extras.filter(el => el.isConnected && el.parentNode === hero).forEach(el => card.appendChild(el));
      hero.after(card);
    }
    if (!hero.querySelector('.hub-lead') && !hero.querySelector('p:not(.hub-eyebrow)')) {
      // No lead (checks list instead): use the first point as the lead so every card has the same three parts.
      const li = page.querySelector('.mock-after .hub-hero-checks li');
      if (li) { const p = document.createElement('p'); p.className = 'hub-lead'; p.textContent = li.textContent; hero.appendChild(p); li.remove(); }
    }
    // A question always comes right after the top card.
    const q = page.querySelector('.hub-napask, .connected-checkin, .hub-q');
    if (q) hero.after(q);
    const mode = window.MOCK_MODE || new URLSearchParams(location.search).get('look') || 'shapes';
    hero.classList.add('mode-' + mode);
    if (mode === 'number') {
      const [big, small] = numberFor(t, page);
      hero.insertAdjacentHTML('afterbegin', `<span class="mock-num" aria-hidden="true">${big}</span>`);
      if (small) hero.insertAdjacentHTML('beforeend', `<span class="mock-num-cap">${small}</span>`);
    } else {
      hero.insertAdjacentHTML('afterbegin', `<span class="mock-shapes" aria-hidden="true">${shapes(t, pal(t))}</span>`);
    }
  }
  const base_ = window.render;
  window.render = render = function (...a) { const r = base_.apply(this, a); try { dress(); } catch (e) {} return r; };
  const css = document.createElement('style');
  css.textContent = `
#main .hub-hero.mock-hero { position: relative; overflow: hidden; background: linear-gradient(160deg, var(--year-bg), var(--year-pale) 62%, #fdeee6) !important; padding-top: 22px }
#main .mock-hero-icon { position: absolute; right: 18px; top: 18px; width: 76px; height: 76px; border-radius: 50%; background: rgba(255,255,255,.7); box-shadow: 0 0 0 8px rgba(255,255,255,.28); display: grid; place-items: center; padding: 12px; pointer-events: none }
#main .mock-hero-icon svg { width: 100% !important; height: 100% !important }

#main .hub-hero.mock-hero > *:not(.mock-num):not(.mock-shapes) { position: relative }
#main .mock-num { position: absolute; right: 14px; top: -10px; font: 800 112px/1 var(--display-font, inherit); letter-spacing: -5px; color: #fff; opacity: .85; pointer-events: none }
#main .mock-num-cap { display: inline-block; margin-top: 12px; background: rgba(255,255,255,.75); color: var(--year-ink); font-size: 12.5px; font-weight: 700; border-radius: 999px; padding: 5px 11px }
#main .mock-shapes { position: absolute; top: 0; right: 0; width: 56%; height: 100%; pointer-events: none }
#main .mock-shapes svg { width: 100%; height: 100%; display: block }
#main .mode-shapes h1, #main .mode-shapes .hub-eyebrow { max-width: 78% }
#main .mode-shapes .hub-lead { background: none }
#main .hub-hero.mock-hero { min-height: 172px; padding: 20px 20px 22px !important; margin-bottom: 14px }
#main .hub-hero.mock-hero .hub-eyebrow, #main .hub-hero.mock-hero h1 { max-width: 68% }
#main .hub-hero.mock-hero h1 { font-size: 25px !important; line-height: 1.17 !important; margin: 6px 0 10px !important }
#main .hub-hero.mock-hero .hub-lead { max-width: 100%; margin: 0 }
#main .mock-after { margin-bottom: 14px }
#main .mock-bare { display: flex; margin: 0 0 14px !important; width: 100% }
#main .hub-button.mock-bare { justify-content: center }
#main .mock-after .hub-hero-checks { margin: 6px 0 0; padding-left: 18px }
#main .mock-after .hub-button { width: 100%; margin-top: 12px }
#main .mock-after > .hub-meter:first-child { margin-top: 0 }
#main .hub-page[data-overview="Development"] .dev-area { background: var(--year-pale) !important }
#main .hub-page[data-overview="Development"] .dev-area .dev-area-art circle:first-child { fill: #fff; fill-opacity: .7 }
#main .hub-page:not([data-overview="Development"]) .hub-row .hub-dot { background: var(--year-pale) }
#main .hub-page:not([data-overview="Development"]) .hub-glance .hub-tiles div, #main .hub-page:not([data-overview="Development"]) .hub-glance [class*=tile] { background: linear-gradient(160deg, var(--year-pale), #fff) }
`;
  document.head.appendChild(css);
})();
