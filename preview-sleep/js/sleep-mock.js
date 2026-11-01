/* MOCKUP ONLY: Sleep in the Development design language, same content.
   Warm gradient top card; the four "now" tiles each get a color for their time of day and a tiny picture of the fact itself. */
(function () {
  const TIME = [
    // Naps: daytime butter. Small pills, one per nap.
    { bg: '#fff3dc', ink: '#8a6a2a', art: n => !n ? `<svg viewBox="0 0 120 40">${[[8,14,10],[30,24,14],[54,12,8],[70,26,12],[92,16,10],[108,24,8]].map(([x,y,w]) => `<rect x="${x}" y="${y}" width="${w}" height="8" rx="4" fill="#f3d58a"/>`).join('')}</svg>` : `<svg viewBox="0 0 120 40">${Array.from({ length: n }, (_, i) => `<rect x="${6 + i * 38}" y="12" width="${i === n - 1 && n > 2 ? 22 : 32}" height="16" rx="8" fill="#f3d58a"/>`).join('')}</svg>` },
    // Wake window: morning sky. An arc between two sleeps.
    { bg: '#e7effc', ink: '#46638c', art: () => `<svg viewBox="0 0 120 40"><circle cx="12" cy="30" r="6" fill="#9fb8df"/><circle cx="108" cy="30" r="6" fill="#9fb8df"/><path d="M18 30Q60-6 102 30" stroke="#46638c" stroke-opacity=".45" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="1 6"/><circle cx="60" cy="12" r="7" fill="#f3d58a"/></svg>` },
    // Bedtime: dusk. The sun setting under the horizon.
    { bg: '#f6e8f3', ink: '#7a4f74', art: () => `<svg viewBox="0 0 120 40"><circle cx="60" cy="30" r="13" fill="#f2b8a2"/><rect x="0" y="30" width="120" height="10" fill="#f6e8f3"/><path d="M8 30h104" stroke="#7a4f74" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/><circle cx="96" cy="10" r="2" fill="#7a4f74" fill-opacity=".4"/></svg>` },
    // Longest stretch: night. A long bar across the dark.
    { bg: '#e3e6f6', ink: '#3d4a7a', art: (n, h) => `<svg viewBox="0 0 120 40"><rect x="6" y="16" width="108" height="10" rx="5" fill="#fff" fill-opacity=".7"/><rect x="6" y="16" width="${Math.max(16, Math.round(108 * Math.min(h || 6, 12) / 12))}" height="10" rx="5" fill="#8e9ad0"/><path d="M104 6a6 6 0 1 0 6 8 5 5 0 0 1-6-8Z" fill="#f3d58a"/></svg>` }
  ];
  function dress() {
    const page = document.querySelector('#main .hub-page[data-overview="Sleep"]:not(.hub-detail)');
    if (!page || page.dataset.mock) return;
    page.dataset.mock = '1';
    const hero = page.querySelector('.hub-hero');
    if (hero) hero.classList.add('sm-hero');
    const tiles = [...page.querySelectorAll('.hub-glance .hub-tiles > *')];
    tiles.slice(0, 4).forEach((d, i) => {
      const t = TIME[i]; if (!t) return;
      const txt = (d.querySelector('b') || {}).textContent || '', num = parseInt(txt, 10), naps = isNaN(num) ? 0 : num, hrs = (txt.match(/(\d+)\s*hours?/) || txt.match(/[–-](\d+)/) || [])[1];
      d.classList.add('sm-tile');
      d.style.setProperty('--sm-bg', t.bg); d.style.setProperty('--sm-ink', t.ink);
      d.insertAdjacentHTML('afterbegin', `<span class="sm-art">${t.art(naps, hrs ? Number(hrs) : num)}</span>`);
    });
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) {} return r; };
  const css = document.createElement('style');
  css.textContent = `
#main .sm-hero { background: linear-gradient(160deg, #d9e5fc, #e9effd 58%, #fdeee6) !important; position: relative; overflow: hidden }
#main .sm-hero::after { content: ""; position: absolute; right: -40px; top: -50px; width: 170px; height: 170px; border-radius: 50%; background: #fff; opacity: .35; pointer-events: none }
#main .sm-hero > * { position: relative; z-index: 1 }
#main .sm-tile { background: var(--sm-bg) !important; border-radius: 18px !important; padding: 12px 14px 14px !important }
#main .sm-tile small:first-of-type, #main .sm-tile > small { color: var(--sm-ink) !important; font-weight: 600 }
#main .sm-art { display: block; height: 30px; margin: 0 0 8px }
#main .sm-art svg { height: 100%; width: auto; display: block }
`;
  document.head.appendChild(css);
})();
