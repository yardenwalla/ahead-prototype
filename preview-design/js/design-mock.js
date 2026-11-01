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
  const pal = t => (typeof YEAR_PALETTES !== 'undefined' && (YEAR_PALETTES[t] || YEAR_PALETTES.Memories)) || { bg: '#eee', pale: '#f6f6f6', ink: '#444', accent: '#ccc' };
  function dress() {
    const page = document.querySelector('#main .hub-page[data-overview]:not(.hub-detail)');
    if (!page) return;
    const t = page.dataset.overview;
    if (t === 'Development') return;
    const hero = page.querySelector('.hub-hero');
    if (!hero || hero.classList.contains('mock-hero')) return;
    hero.classList.add('mock-hero');
    const draw = ART[t] || ART[page.dataset.cat];
    if (draw) hero.insertAdjacentHTML('afterbegin', `<span class="mock-hero-art">${draw(pal(t))}</span><span class="mock-hero-spark" aria-hidden="true">✦</span>`);
  }
  const base_ = window.render;
  window.render = render = function (...a) { const r = base_.apply(this, a); try { dress(); } catch (e) {} return r; };
  const css = document.createElement('style');
  css.textContent = `
#main .hub-hero.mock-hero { position: relative; overflow: hidden; background: linear-gradient(160deg, var(--year-bg), var(--year-pale) 62%, #fdeee6) !important; padding-top: 22px }
#main .mock-hero-art { position: absolute; right: -14px; top: -8px; width: 150px; height: 110px; opacity: .95; pointer-events: none }
#main .mock-hero-art svg { width: 100%; height: 100% }
#main .mock-hero-spark { position: absolute; right: 18px; top: 108px; color: #f1c75b; font-size: 14px }
#main .hub-hero.mock-hero > *:not(.mock-hero-art):not(.mock-hero-spark) { position: relative }
#main .hub-hero.mock-hero h1, #main .hub-hero.mock-hero > p:first-of-type, #main .hub-hero.mock-hero .hub-eyebrow, #main .hub-hero.mock-hero > span:not([class^=mock]) { max-width: 66% }
#main .hub-hero.mock-hero h1 { font-size: 27px; line-height: 1.15 }
#main .hub-page:not([data-overview="Development"]) .hub-row .hub-dot { background: var(--year-pale) }
#main .hub-page:not([data-overview="Development"]) .hub-glance .hub-tiles div, #main .hub-page:not([data-overview="Development"]) .hub-glance [class*=tile] { background: linear-gradient(160deg, var(--year-pale), #fff) }
`;
  document.head.appendChild(css);
})();
