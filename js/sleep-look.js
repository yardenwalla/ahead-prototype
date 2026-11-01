/* Ahead · Sleep's look: the same warm design as Development, with no change to Sleep's content.
   - A soft gradient top card in Sleep's blue.
   - The four "Naps and sleep now" tiles each take the color of their time of day (naps: day, wake window: morning,
     bedtime: dusk, longest stretch: night) and a small picture drawn from the tile's own number, so it changes as the baby grows.
   - "What's different now" rows use the same time-of-day colors; "Rough night?" uses the calm night color. */
(function () {
  const TIME = [
    // Naps: daytime butter. Small pills, one per nap.
    { bg: '#fff3dc', ink: '#8a6a2a', art: n => !n ? `<svg viewBox="0 0 120 40">${[[8,14,10],[30,24,14],[54,12,8],[70,26,12],[92,16,10],[108,24,8]].map(([x,y,w]) => `<rect x="${x}" y="${y}" width="${w}" height="8" rx="4" fill="#f3d58a"/>`).join('')}</svg>` : `<svg viewBox="0 0 120 40">${Array.from({ length: n }, (_, i) => `<rect x="${6 + i * 38}" y="12" width="${i === n - 1 && n > 2 ? 22 : 32}" height="16" rx="8" fill="#f3d58a"/>`).join('')}</svg>` },
    // Wake window: morning sky. An arc between two sleeps.
    { bg: '#e7effc', ink: '#46638c', art: (n, h, txt) => { const hrs = /min/.test(txt) ? (parseInt(txt, 10) || 45) / 60 : (parseFloat(String(txt).replace('½', '.5').match(/[\d.]+/g)?.slice(-1)[0]) || 2); const w = Math.round(28 + 80 * Math.min(hrs, 4) / 4), x0 = 60 - w / 2, x1 = 60 + w / 2; return `<svg viewBox="0 0 120 40"><circle cx="${x0}" cy="30" r="6" fill="#9fb8df"/><circle cx="${x1}" cy="30" r="6" fill="#9fb8df"/><path d="M${x0 + 6} 30Q60 ${30 - w * .45} ${x1 - 6} 30" stroke="#46638c" stroke-opacity=".45" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="1 6"/><circle cx="60" cy="${Math.round(30 - w * .26)}" r="6" fill="#f3d58a"/></svg>`; } },
    // Bedtime: dusk. The sun setting under the horizon.
    { bg: '#f6e8f3', ink: '#7a4f74', art: (n, h, txt) => /not yet/i.test(txt) ? `<svg viewBox="0 0 120 40"><path d="M8 30h104" stroke="#7a4f74" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="2 7"/><circle cx="40" cy="14" r="2" fill="#7a4f74" fill-opacity=".35"/><circle cx="78" cy="10" r="2" fill="#f3d58a"/></svg>` : `<svg viewBox="0 0 120 40"><circle cx="60" cy="30" r="13" fill="#f2b8a2"/><rect x="0" y="30" width="120" height="10" fill="#f6e8f3"/><path d="M8 30h104" stroke="#7a4f74" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/><circle cx="96" cy="10" r="2" fill="#7a4f74" fill-opacity=".4"/></svg>` },
    // Longest stretch: night. A long bar across the dark.
    { bg: '#e3e6f6', ink: '#3d4a7a', art: (n, h) => `<svg viewBox="0 0 120 40"><rect x="6" y="16" width="108" height="10" rx="5" fill="#fff" fill-opacity=".7"/><rect x="6" y="16" width="${Math.max(16, Math.round(108 * Math.min(h || 6, 12) / 12))}" height="10" rx="5" fill="#8e9ad0"/><path d="M104 6a6 6 0 1 0 6 8 5 5 0 0 1-6-8Z" fill="#f3d58a"/></svg>` }
  ];
  function dress() {
    const page = document.querySelector('#main .hub-page[data-overview="Sleep"]:not(.hub-detail)');
    if (!page || !page.dataset || page.dataset.look) return;
    page.dataset.look = '1';
    const hero = page.querySelector('.hub-hero');
    if (hero) hero.classList.add('sm-hero');
    dressRows(page);
    // Parents can look ahead: say so under the stage timeline.
    const bar = page.querySelector('.hub-stagebar');
    if (bar && !page.querySelector('.ss-hint')) bar.insertAdjacentHTML('afterend', '<p class="ss-hint">Tap a stage to see what’s coming.</p>');
    const tiles = [...page.querySelectorAll('.hub-glance .hub-tiles > *')];
    tiles.slice(0, 4).forEach((d, i) => {
      const t = TIME[i]; if (!t) return;
      const txt = (d.querySelector('b') || {}).textContent || '', num = parseInt(txt, 10), naps = isNaN(num) ? 0 : num, hrs = (txt.match(/(\d+)\s*hours?/) || txt.match(/[–-](\d+)/) || [])[1];
      d.classList.add('sm-tile');
      d.style.setProperty('--sm-bg', t.bg); d.style.setProperty('--sm-ink', t.ink);
      d.insertAdjacentHTML('afterbegin', `<span class="sm-art">${t.art(naps, hrs ? Number(hrs) : num, txt)}</span>`);
    });
  }
  const ROW = { 'Naps': ['#fff3dc', '#8a6a2a'], 'Night sleep': ['#e3e6f6', '#3d4a7a'], 'Night feeds': ['#e3e6f6', '#3d4a7a'], 'Routine': ['#f6e8f3', '#7a4f74'], 'Bedtime': ['#f6e8f3', '#7a4f74'] };
  function dressRows(page) {
    page.querySelectorAll('.hub-row').forEach(r => {
      const label = [...r.querySelectorAll('small, .hub-row-label, .hub-row-copy > span, .hub-row-copy > i')].map(e => e.textContent.trim()).find(t => ROW[t]) || (r.querySelector('.hub-row-copy') || {}).textContent;
      const key = Object.keys(ROW).find(k => String(label || '').trim().startsWith(k));
      if (!key) return;
      r.classList.add('sm-row'); r.style.setProperty('--sm-bg', ROW[key][0]); r.style.setProperty('--sm-ink', ROW[key][1]);
    });
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
