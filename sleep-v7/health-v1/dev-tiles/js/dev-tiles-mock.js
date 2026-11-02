/* MOCKUP ONLY: Development's area tiles in Sleep's style.
   Compact tiles; a small shape picture (no drawn babies); the area as a small colored label; one short bold line as the focus. */
(function () {
  const C = { Social: ['#fdeef2', '#a24d6a', '#f2b8c6', '#f4d6c4'], Talking: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'], Thinking: ['#e6f5ec', '#356651', '#bfe3cf', '#f2b8c6'], Movement: ['#e7effc', '#46638c', '#9fb8df', '#f4d6c4'] };
  // One short line per area per checkpoint: the thing to look for, in a few words.
  const LINE = {
    2: { Social: 'Smiles back at you', Talking: 'Makes sounds besides crying', Thinking: 'Follows you with {p} eyes', Movement: 'Lifts {p} head on {p} tummy' },
    4: { Social: 'Smiles to get your attention', Talking: 'Coos back at you', Thinking: 'Studies {p} hands', Movement: 'Holds {p} head steady' },
    6: { Social: 'Knows familiar faces', Talking: 'Takes turns making sounds', Thinking: 'Reaches to grab a toy', Movement: 'Rolls tummy to back' },
    9: { Social: 'Turns when you call {p} name', Talking: 'Babbles “mamama”', Thinking: 'Looks for a dropped toy', Movement: 'Sits on {p} own' },
    12: { Social: 'Plays pat-a-cake', Talking: 'Calls you mama or dada', Thinking: 'Finds a toy you hide', Movement: 'Pulls up to stand' }
  };
  const ART = {
    Social: c => `<svg viewBox="0 0 120 40"><circle cx="48" cy="20" r="14" fill="${c[2]}"/><circle cx="68" cy="20" r="14" fill="${c[3]}" fill-opacity=".9"/></svg>`,
    Talking: c => `<svg viewBox="0 0 120 40"><rect x="10" y="6" width="44" height="22" rx="11" fill="${c[2]}"/><path d="M20 27l-5 9 12-7Z" fill="${c[2]}"/><rect x="60" y="14" width="26" height="14" rx="7" fill="${c[3]}"/></svg>`,
    Thinking: c => `<svg viewBox="0 0 120 40"><path d="M12 34c2-16 10-24 22-24s20 8 22 24Z" fill="${c[2]}"/><circle cx="56" cy="29" r="6" fill="${c[3]}"/></svg>`,
    Movement: (c, ref) => ref <= 2 ? `<svg viewBox="0 0 120 40"><rect x="10" y="22" width="44" height="10" rx="5" fill="${c[2]}"/><circle cx="62" cy="18" r="8" fill="${c[3]}"/></svg>`
      : ref <= 4 ? `<svg viewBox="0 0 120 40"><rect x="10" y="24" width="44" height="10" rx="5" fill="${c[2]}"/><circle cx="62" cy="14" r="8" fill="${c[3]}"/></svg>`
      : ref <= 6 ? `<svg viewBox="0 0 120 40"><path d="M14 36a18 18 0 0 1 36 0Z" fill="${c[2]}"/><circle cx="32" cy="10" r="8" fill="${c[3]}"/></svg>`
      : ref <= 9 ? `<svg viewBox="0 0 120 40"><path d="M14 36a18 18 0 0 1 36 0Z" fill="${c[2]}"/><circle cx="32" cy="10" r="8" fill="${c[3]}"/><circle cx="62" cy="31" r="5" fill="${c[3]}"/></svg>`
      : `<svg viewBox="0 0 120 40"><rect x="44" y="12" width="40" height="5" rx="2.5" fill="${c[2]}"/><rect x="78" y="14" width="5" height="24" rx="2.5" fill="${c[2]}"/><rect x="24" y="16" width="14" height="22" rx="7" fill="${c[2]}"/><circle cx="31" cy="9" r="7" fill="${c[3]}"/></svg>`
  };
  function dress() {
    const page = document.querySelector('#main .hub-page[data-overview="Development"]:not(.hub-detail)');
    if (!page || page.dataset.tiles) return;
    page.dataset.tiles = '1';
    const ref = Number(page.dataset.developmentGuide) || 6;
    page.querySelectorAll('.dev-area').forEach(t => {
      const d = (t.className.match(/is-(\w+)/) || [])[1], c = C[d]; if (!c) return;
      const name = t.querySelector('b').textContent, count = t.querySelector(':scope > span:last-child').textContent;
      const line = (window.__hub ? __hub.F : (x => x))(LINE[ref][d]);
      t.innerHTML = `<span class="dt-art">${ART[d](c, ref)}</span><small class="dt-label">${name}</small><b class="dt-line">${line}</b><span class="dt-count">${count}</span>`;
      const sv = t.querySelector('.dt-art svg'); try { const bb = sv.getBBox(); sv.setAttribute('viewBox', `${bb.x - 2} ${bb.y - 2} ${bb.width + 4} ${bb.height + 4}`); } catch (e) {}
      t.classList.add('dt-tile'); t.style.setProperty('--dt-bg', c[0]); t.style.setProperty('--dt-ink', c[1]);
    });
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
  const css = document.createElement('style');
  css.textContent = `
#main .dt-tile { background: var(--dt-bg) !important; padding: 12px 14px 14px !important; gap: 2px !important; border-radius: 18px !important; min-height: 0; justify-content: flex-start !important; align-items: flex-start }
#main .dt-art { display: block; height: 30px; margin: 0 0 10px !important; padding: 0 14px !important }
#main .dt-art svg { height: 100%; width: auto; display: block }
#main .dt-label { font-size: 13px !important; font-weight: 600; color: var(--dt-ink) !important; line-height: 1.3 }
#main .dt-line { font-size: 16px !important; line-height: 1.25; font-weight: 700; color: var(--ink); margin: 2px 0 4px }
#main .dt-count { font-size: 13px; font-weight: 600; color: var(--dt-ink) !important; margin-top: auto !important; padding-top: 4px !important }
#main .dt-tile { display: flex !important; flex-direction: column !important; justify-content: flex-start !important; height: 100% }
#main .hub-domain-tiles:has(.dt-tile) { align-items: stretch }
`;
  document.head.appendChild(css);
})();
