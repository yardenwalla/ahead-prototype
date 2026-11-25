/* Ahead · Sleep subpages in the same look as Development's area pages and Health's checkup pages:
   a soft header card in the color of the row it came from (naps: day, night sleep: night, routine: dusk,
   safe sleep: blue, sleep training: lavender) with a small flat picture, then "What to do" as the one card that stands out.
   Content is unchanged here; the copy lives in hub.js. Charts keep their original darker blues. */
(function () {
  const C = {
    naps: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'],
    night: ['#edf2fe', '#4e678e', '#9fb8df', '#c9cff0'],
    dusk: ['#edf2fe', '#46638c', '#e3b8cf', '#f4d6c4'],
    safe: ['#edf2fe', '#46638c', '#a0b7d9', '#d9e5fc'],
    train: ['#e8eef8', '#536075', '#abbcd5', '#e3b8cf']
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
    // Nov 24: a real icon that matches the page, like every other guide, in place of the placeholder shapes.
    const ic = /crib|mattress|room|safe/i.test(ctx + head.textContent) ? 'crib' : /nap/i.test(ctx) ? 'sun' : /routine|bedtime/i.test(ctx) ? 'book' : 'moon';
    const art = typeof hubArt === 'function' ? `<span class="dev-area-head-art sf-head-art" aria-hidden="true">${hubArt(ic, 'Sleep')}</span>` : `<span class="dev-area-head-art">${ART[k](c)}</span>`;
    const big = head.querySelector('.hub-big'); if (big) big.outerHTML = art; else if (!head.querySelector('.dev-area-head-art')) head.insertAdjacentHTML('afterbegin', art);
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
        // One idea per line: each sentence of "What to do" is its own step.
        if (/^What to do/i.test(l)) { const lines = t.split(/(?<=\.)\s+(?=[A-Z“])/).filter(Boolean); return `<section class="ss-do"><b>What to do</b>${lines.length > 1 ? `<ul class="ss-do-list">${lines.map(x => `<li>${x}</li>`).join('')}</ul>` : `<p>${t}</p>`}</section>`; }
        // What's happening moves up into the header card when the page has no lead of its own.
        if (/^What’s happening/i.test(l)) { const lead = head.querySelector('.hub-lead'); if (!lead || !lead.textContent.trim()) { if (lead) lead.innerHTML = t; else head.insertAdjacentHTML('beforeend', `<p class="hub-lead">${t}</p>`); return ''; } return `<p class="ss-what">${t}</p>`; }
        // "How you'll know" and "How long" often hold the "when" answer, so they stay easy to read.
        if (/^(How (you’ll know|long)|Why it matters)/i.test(l)) return `<p class="ss-know"><b>${l.replace(/\.$/, '')}</b>${t}</p>`;
        return `<p class="ss-small">${l ? `<b>${l.replace(/\.$/, ':')}</b> ` : ''}${t}</p>`;
      });
      m.className = 'ss-moment'; m.innerHTML = out.join('');
    });
    // Rough night: each problem's "Try tonight" gets the same What to do card.
    page.querySelectorAll('.hub-rough-body').forEach(body => {
      const t = body.querySelector('.hub-rough-try'), ul = t && t.nextElementSibling;
      if (!t || !ul || ul.tagName !== 'UL') return;
      const card = document.createElement('section'); card.className = 'ss-do ss-try';
      card.innerHTML = `<b>Try this</b>`; t.replaceWith(card); card.appendChild(ul);
      const why = body.querySelector('p > b'); if (why && /Likely why/.test(why.textContent)) { why.remove(); body.querySelector('p').classList.add('ss-what'); }
    });
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
