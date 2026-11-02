/* Ahead · Sleep subpages in the same look as Development's area pages and Health's checkup pages:
   a soft header card in the color of the row it came from (naps: day, night sleep: night, routine: dusk,
   safe sleep: blue, sleep training: lavender) with a small flat picture, then "What to do" as the one card that stands out.
   Content is unchanged here; the copy lives in hub.js. Charts keep their original darker blues. */
(function () {
  const C = {
    naps: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'],
    night: ['#e3e6f6', '#3d4a7a', '#8e9ad0', '#c9cff0'],
    dusk: ['#f6e8f3', '#7a4f74', '#e3b8cf', '#f4d6c4'],
    safe: ['#e7effc', '#46638c', '#9fb8df', '#d9e5fc'],
    train: ['#ece8f8', '#5b4f8a', '#c3b8ea', '#e3b8cf']
  };
  const LANE = l => /tonight/i.test(l) ? 'night' : /nap/i.test(l) ? 'naps' : /routine|bedtime/i.test(l) ? 'dusk' : /safe|safety/i.test(l) ? 'safe' : /training|choice|read ahead/i.test(l) ? 'train' : 'night';
  // Small pictures in Development's flat-shape style: a sun and two naps; a moon and a long night; a setting sun;
  // a crib; a closed door with a nightlight.
  const ART = {
    naps: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="16" cy="20" r="12" fill="${c[2]}"/><rect x="36" y="15" width="22" height="10" rx="5" fill="${c[3]}"/><rect x="64" y="15" width="14" height="10" rx="5" fill="${c[3]}"/></svg>`,
    night: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M22 6a14 14 0 1 0 12 22A12 12 0 0 1 22 6Z" fill="${c[2]}"/><rect x="40" y="16" width="44" height="10" rx="5" fill="${c[3]}"/></svg>`,
    dusk: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M6 32a18 18 0 0 1 36 0Z" fill="${c[2]}"/><rect x="4" y="32" width="76" height="4" rx="2" fill="${c[3]}"/></svg>`,
    safe: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="20" width="56" height="14" rx="5" fill="${c[2]}"/><circle cx="20" cy="14" r="7" fill="${c[3]}"/></svg>`,
    train: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="8" width="26" height="28" rx="6" fill="${c[2]}"/><circle cx="44" cy="26" r="7" fill="${c[3]}"/></svg>`
  };
  function dress() {
    const page = document.querySelector('#main .hub-page.hub-detail[data-overview="Sleep"]');
    if (!page || !page.dataset || page.dataset.ss) return;
    const head = page.querySelector(':scope > .hub-detail-head'); if (!head) return;
    page.dataset.ss = '1';
    const ctx = ((head.querySelector('.hub-context') || {}).textContent || '').trim(), k = LANE(ctx), c = C[k];
    head.classList.add('dev-area-head', 'ss-head'); head.style.setProperty('--area', c[0]); head.style.setProperty('--area-ink', c[1]);
    const big = head.querySelector('.hub-big'); if (big) big.outerHTML = `<span class="dev-area-head-art">${ART[k](c)}</span>`;
    page.style.setProperty('--ss-bg', c[0]); page.style.setProperty('--ss-ink', c[1]);
    // What's happening / What to do / How you'll know: "What to do" becomes the one card that stands out;
    // the explanation sits above it as plain text, and the signs or reasons below it as a small note.
    page.querySelectorAll('.hub-moment').forEach(m => {
      const ps = [...m.children].filter(p => p.tagName === 'P');
      const lab = p => ((p.querySelector(':scope > b:first-child') || {}).textContent || '').trim();
      if (!ps.some(p => /^What to do/i.test(lab(p)))) return;
      const out = ps.map(p => {
        const l = lab(p), b = p.querySelector(':scope > b:first-child'); if (b) b.remove();
        const t = p.innerHTML.trim();
        if (/^What to do/i.test(l)) return `<section class="ss-do"><b>What to do</b><p>${t}</p></section>`;
        if (/^What’s happening/i.test(l)) return `<p class="ss-what">${t}</p>`;
        // "How you'll know" and "How long" often hold the "when" answer, so they stay easy to read.
        if (/^How (you’ll know|long)/i.test(l)) return `<p class="ss-know"><b>${l.replace(/\.$/, '')}</b>${t}</p>`;
        return `<p class="ss-small">${l ? `<b>${l.replace(/\.$/, ':')}</b> ` : ''}${t}</p>`;
      });
      m.className = 'ss-moment'; m.innerHTML = out.join('');
    });
    // Rough night: each problem's "Try tonight" gets the same What to do card.
    page.querySelectorAll('.hub-rough-body').forEach(body => {
      const t = body.querySelector('.hub-rough-try'), ul = t && t.nextElementSibling;
      if (!t || !ul || ul.tagName !== 'UL') return;
      const card = document.createElement('section'); card.className = 'ss-do ss-try';
      card.innerHTML = `<b>Try tonight</b>`; t.replaceWith(card); card.appendChild(ul);
      const why = body.querySelector('p > b'); if (why && /Likely why/.test(why.textContent)) { why.remove(); body.querySelector('p').classList.add('ss-what'); }
    });
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
