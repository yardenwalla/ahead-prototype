/* Ahead · The remaining Development and Health subpages in the same header style as the others
   (Development's area pages, Health's checkup pages, Sleep's subpages): a soft card in the color of what you tapped,
   with a small flat picture. Uses the same .ss-head styles as Sleep (css/sleep-sub-look.css). */
(function () {
  const PAL = {
    green: ['#e6f5ec', '#356651', '#bfe3cf', '#f2b8c6'], blue: ['#e7effc', '#46638c', '#9fb8df', '#d9e5fc'],
    yellow: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'], peach: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'], pink: ['#fdeef2', '#a24d6a', '#f2b8c6', '#f4d6c4']
  };
  const ART = {
    // Health: a thermometer for feeling sick, a drop for colds, a heart-ish pair for you, a calendar for checkups.
    sick: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="10" y="2" width="12" height="28" rx="6" fill="${c[2]}"/><circle cx="16" cy="31" r="8" fill="${c[2]}"/><rect x="34" y="18" width="40" height="8" rx="4" fill="${c[3]}"/></svg>`,
    cold: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M18 4c7 10 11 16 11 22a11 11 0 0 1-22 0c0-6 4-12 11-22Z" fill="${c[2]}"/><circle cx="44" cy="28" r="7" fill="${c[3]}"/></svg>`,
    you: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="18" cy="20" r="14" fill="${c[2]}"/><circle cx="38" cy="26" r="9" fill="${c[3]}"/></svg>`,
    visit: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="6" width="34" height="30" rx="7" fill="${c[2]}"/><rect x="4" y="6" width="34" height="9" rx="4" fill="${c[3]}"/></svg>`,
    // Development: play pieces, a reach toward a toy, and two hands for signs.
    play: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="16" cy="22" r="12" fill="${c[2]}"/><rect x="34" y="16" width="16" height="16" rx="4" fill="${c[3]}"/></svg>`,
    move: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M6 34a16 16 0 0 1 32 0Z" fill="${c[2]}"/><circle cx="58" cy="28" r="7" fill="${c[3]}"/></svg>`,
    signs: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="6" y="8" width="16" height="26" rx="8" fill="${c[2]}"/><rect x="28" y="12" width="16" height="22" rx="8" fill="${c[3]}"/></svg>`
  };
  function pick(cat, text) {
    if (cat === 'Health') return /sick|fever|symptom|vomit|cold|stuffy/i.test(text) ? ['peach', 'sick'] : /how are you|you’re doing|your health/i.test(text) ? ['pink', 'you'] : ['green', 'visit'];
    if (cat === 'Development') return /sign/i.test(text) ? ['yellow', 'signs'] : /reach|move|cruise|roll|floor|knee/i.test(text) && !/ideas to try/i.test(text) ? ['blue', 'move'] : ['pink', 'play'];
    return null;
  }
  function dress() {
    const page = document.querySelector('#main .hub-page.hub-detail');
    if (!page || !page.dataset || page.dataset.ss) return;
    const cat = page.dataset.overview, head = page.querySelector(':scope > .hub-detail-head');
    if (!head || head.classList.contains('dev-area-head') || (cat !== 'Health' && cat !== 'Development')) return;
    const text = head.textContent, p = pick(cat, text); if (!p) return;
    page.dataset.ss = '1';
    const c = PAL[p[0]];
    head.classList.add('dev-area-head', 'ss-head'); head.style.setProperty('--area', c[0]); head.style.setProperty('--area-ink', c[1]);
    page.style.setProperty('--ss-bg', c[0]); page.style.setProperty('--ss-ink', c[1]);
    const big = head.querySelector('.hub-big'); const art = `<span class="dev-area-head-art">${ART[p[1]](c)}</span>`;
    if (big) big.outerHTML = art; else head.insertAdjacentHTML('afterbegin', art);
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
