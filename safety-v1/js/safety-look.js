/* Ahead · Safety in the same look as Sleep, Health and Development, and checklists that follow the child.
   - Safety home: the soft gradient top card in Safety's warm sand, with the faint white circle.
   - Checklist pages: Development's subpage header (a soft card with a small flat picture of the stage).
   - The babyproofing checklist leads with what the stage is about: gates and cabinets for crawling,
     furniture, windows and cords for pulling up. */
(function () {
  const C = { bg: '#f7e6c4', ink: '#795b2c', a: '#e8c98e', b: '#f4d6c4' };
  // A picture per stage: a baby-sized circle on the floor, then low, then reaching up to a tall block.
  const ART = {
    setup: `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="12" width="34" height="24" rx="7" fill="${C.a}"/><circle cx="54" cy="28" r="8" fill="${C.b}"/></svg>`,
    reach: `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="30" width="70" height="6" rx="3" fill="${C.a}"/><circle cx="26" cy="22" r="8" fill="${C.b}"/><circle cx="50" cy="26" r="4" fill="${C.a}"/></svg>`,
    mobile: `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="30" width="78" height="6" rx="3" fill="${C.a}"/><path d="M14 30a12 9 0 0 1 24 0Z" fill="${C.b}"/><rect x="56" y="10" width="20" height="20" rx="4" fill="${C.a}"/></svg>`
  };
  const LEAD = { pulling: ['anchor', 'windows', 'cords'], moving: ['gates', 'storage', 'outlets', 'doors'], rolling: ['gates', 'storage', 'outlets', 'doors'] };
  const viewing = () => { const p = typeof page === 'string' ? page : ''; const m = p.match(/^safety-stage:(\w+)/); return m ? m[1] : (typeof safetyStageNow === 'function' ? safetyStageNow() : ''); };
  const base = window.safetyOwnedGuides;
  window.safetyOwnedGuides = safetyOwnedGuides = function () {
    const g = base(), lead = LEAD[viewing()];
    if (lead && g.mobile) g.mobile = Object.assign({}, g.mobile, { ids: [...lead.filter(x => g.mobile.ids.includes(x)), ...g.mobile.ids.filter(x => !lead.includes(x))] },
      viewing() === 'pulling' ? { intro: 'Pulling up brings furniture, windows and cords into reach. Start with those, then the rest of the rooms.' } : {});
    return g;
  };
  function dress() {
    const home = document.querySelector('#main .hub-page[data-overview="Safety"]:not(.hub-detail)');
    if (home && home.dataset && !home.dataset.look) { home.dataset.look = '1'; const hero = home.querySelector('.hub-hero'); if (hero) hero.classList.add('sf-hero'); }
    const list = document.querySelector('#main .safety-owner-page');
    if (list && list.dataset && !list.dataset.look) {
      list.dataset.look = '1';
      const hero = list.querySelector('.experience-hero'), owner = list.dataset.safetyOwner || 'mobile';
      if (hero) {
        const kicker = (hero.querySelector('.eyebrow') || {}).textContent || '', title = (hero.querySelector('h1,h2') || {}).textContent || '', desc = (hero.querySelector('.experience-hero-description') || {}).textContent || '';
        const stage = { setup: 'First setup', reach: 'Rolling', mobile: viewing() === 'pulling' ? 'Pulling up' : 'Crawling' }[owner] || 'Safety';
        hero.outerHTML = `<div class="dev-area-head ss-head sf-head" style="--area:${C.bg};--area-ink:${C.ink}"><span class="dev-area-head-art">${ART[owner] || ART.mobile}</span><p class="hub-context">${stage}${kicker && !/^Prepare|^For a baby|^Check higher/.test(kicker) ? '' : ''}</p><h1>${title}</h1>${desc ? `<p class="hub-lead">${desc}</p>` : ''}</div>`;
      }
    }
  }
  const baseRender = window.render;
  window.render = render = function (...a) { const r = baseRender.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
