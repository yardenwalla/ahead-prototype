/* Ahead · Feeding's look: the same warm design as Sleep, Health and Development, with no change to Feeding's content.
   - A soft gradient top card in Feeding's pink, with the same quiet white circle.
   - Each "Feeds now" tile takes its own soft color and a small picture drawn from its own number,
     so it changes as the baby grows (feeds: one drop per feed; time between: an arc; diapers: one per diaper;
     bottle: filled to the ounces; weight: a gentle climb).
   - The "Your feeding questions" rows each get a soft color for what they're about. */
(function () {
  const nums = t => (String(t).replace('½', '.5').match(/[\d.]+/g) || []).map(Number);
  const top = t => { const n = nums(t); return n.length ? n[n.length - 1] : 0; };
  const TILE = [
    // Feeds a day: one small drop per feed, in a soft row.
    [/^Feeds a day|^Meals/i, '#fdeef2', '#a24d6a', t => { const n = Math.max(2, Math.min(nums(t)[0] || 6, 10)); const gap = 12; return `<svg viewBox="0 0 120 40">${Array.from({ length: n }, (_, i) => `<path d="M${6 + i * gap + 4} 12c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10Z" fill="#f2b8cb"/>`).join('')}</svg>`; }],
    // Time between feeds: an arc from one feed to the next.
    [/^Time between/i, '#e7effc', '#46638c', t => { const h = Math.min(top(t) || 3, 4); const w = Math.round(30 + 76 * h / 4); return `<svg viewBox="0 0 120 40"><path d="M8 32Q${8 + w / 2} ${4} ${8 + w} 32" fill="none" stroke="#9db5dc" stroke-width="2.5" stroke-dasharray="3 5" stroke-linecap="round"/><circle cx="8" cy="32" r="5" fill="#46638c"/><circle cx="${8 + w}" cy="32" r="5" fill="#46638c" fill-opacity=".45"/></svg>`; }],
    // Wet diapers: one small diaper each.
    [/^Wet diapers/i, '#fff3dc', '#8a6a2a', t => { const n = Math.max(1, Math.min(nums(t)[0] || 6, 8)); return `<svg viewBox="0 0 120 40">${Array.from({ length: n }, (_, i) => `<path d="M${4 + i * 14} 12h11v6c0 5-2.5 9-5.5 9S${4 + i * 14} 23 ${4 + i * 14} 18Z" fill="#f3d58a"/>`).join('')}</svg>`; }],
    // A day's total, filled toward 32 oz.
    [/a day/i, '#fdeee6', '#9a5a3c', t => { const oz = Math.min(top(t) || 24, 32); return `<svg viewBox="0 0 120 40"><rect x="6" y="16" width="108" height="10" rx="5" fill="#fff" fill-opacity=".8"/><rect x="6" y="16" width="${Math.round(108 * oz / 32)}" height="10" rx="5" fill="#f4c7ab"/></svg>`; }],
    // A bottle filled to the ounces (out of 8).
    [/per bottle/i, '#fdeee6', '#9a5a3c', t => { const oz = Math.min(top(t) || 4, 8); const fill = Math.round(24 * oz / 8); return `<svg viewBox="0 0 120 40"><rect x="8" y="9" width="20" height="28" rx="6" fill="#fff" stroke="#e9b99c" stroke-width="2"/><rect x="10" y="${35 - fill}" width="16" height="${fill}" rx="4" fill="#f4c7ab"/><rect x="13" y="3" width="10" height="6" rx="2" fill="#e9b99c"/></svg>`; }],
    // Each feed: two sides, one after the other.
    [/^Each feed/i, '#f6e8f3', '#7a4f74', () => `<svg viewBox="0 0 120 40"><rect x="6" y="14" width="46" height="12" rx="6" fill="#e2c3dc"/><rect x="58" y="14" width="30" height="12" rx="6" fill="#e2c3dc" fill-opacity=".6"/></svg>`],
    // Weight: a gentle climb.
    [/^Weight/i, '#e6f5ec', '#356651', () => `<svg viewBox="0 0 120 40"><path d="M6 32C30 31 40 24 58 20S92 10 112 6" fill="none" stroke="#9fd0b4" stroke-width="3" stroke-linecap="round"/><circle cx="112" cy="6" r="4" fill="#356651"/></svg>`],
    // Water from a cup.
    [/^Water/i, '#e7effc', '#46638c', () => `<svg viewBox="0 0 120 40"><path d="M8 8h20l-3 26H11Z" fill="#fff" stroke="#9db5dc" stroke-width="2"/><path d="M10 20h16l-2 14H12Z" fill="#c9d8f2"/></svg>`]
  ];
  const ROW = [
    [/^Every|^Fewer|^Quick|^Milk is|^Milk and|^Three meals/i, '#e7effc', '#46638c'],
    [/^Count wet|^Wet diapers|^Most of it|^Appetite/i, '#fff3dc', '#8a6a2a'],
    [/^Your milk|^Your supply|^Make bottles|^Bottles|^How long to|^Water from|^Whole milk/i, '#fdeef2', '#a24d6a'],
    [/^Vitamin D|^Keep up|^Check the|^What to put|^Lumpier|^Safe pieces/i, '#e6f5ec', '#356651'],
    [/^How to/i, '#fdeee6', '#9a5a3c'],
    [/^When & how often|^How much/i, '#e7effc', '#46638c'],
    [/^Your body/i, '#fdeef2', '#a24d6a'],
    [/^Make|^Store|^Pumping/i, '#f6e8f3', '#7a4f74'],
    [/^Vitamin D/i, '#e6f5ec', '#356651'],
    [/^A feed, step by step/i, '#fdeee6', '#9a5a3c'],
    [/^When & how much/i, '#e7effc', '#46638c'],
    [/getting enough/i, '#fff3dc', '#8a6a2a'],
    [/^Gas|^Gagging/i, '#fdeee6', '#9a5a3c'],
    [/^Your milk|^Pumping/i, '#fdeef2', '#a24d6a'],
    [/^Bottles/i, '#f6e8f3', '#7a4f74'],
    [/^Vitamins/i, '#e6f5ec', '#356651']
  ];
  function dress() {
    const page = document.querySelector('#main .hub-page[data-overview="Feeding"]:not(.hub-detail)');
    if (!page || !page.dataset || page.dataset.look) return;
    page.dataset.look = '1';
    const hero = page.querySelector('.hub-hero');
    if (hero) hero.classList.add('fm-hero');
    page.querySelectorAll('.hub-glance .hub-tiles > *').forEach(d => {
      const label = ((d.querySelector('small') || {}).textContent || '').trim(), txt = ((d.querySelector('b') || {}).textContent || '').trim();
      const t = TILE.find(([re]) => re.test(label + ' | ' + txt)); if (!t) return;
      d.classList.add('sm-tile');
      d.style.setProperty('--sm-bg', t[1]); d.style.setProperty('--sm-ink', t[2]);
      d.insertAdjacentHTML('afterbegin', `<span class="sm-art" aria-hidden="true">${t[3](txt)}</span>`);
    });
    page.querySelectorAll('.hub-row').forEach(r => {
      const title = ((r.querySelector('.hub-row-copy b') || {}).textContent || '').trim();
      const c = ROW.find(([re]) => re.test(title)); if (!c) return;
      r.classList.add('sm-row'); r.style.setProperty('--sm-bg', c[1]); r.style.setProperty('--sm-ink', c[2]);
    });
  }
  const base = window.render;
  if (typeof base !== 'function') return;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();

/* Ahead · Feeding subpages in the same look as Sleep, Health and Development subpages: a soft header card in the color of
   the row it came from (Feeds: blue, Getting enough: butter, Milk: pink, Food: green, Tough feed: peach) with a small flat picture,
   then "What to do" as the one card that stands out. Uses the shared .ss-head / .ss-do styles (css/sleep-sub-look.css). */
(function () {
  const C = {
    feeds: ['#e7effc', '#46638c', '#9fb8df', '#d9e5fc'], enough: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'],
    milk: ['#fdeef2', '#a24d6a', '#f2b8c6', '#f4d6c4'], food: ['#e6f5ec', '#356651', '#bfe3cf', '#f3d58a'], tough: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0']
  };
  const LANE = l => /^feeds|how much|how to feed|rhythm/i.test(l) ? 'feeds' : /enough/i.test(l) ? 'enough' : /^milk|your milk|breastfeeding|bottle|pumping/i.test(l) ? 'milk' : /tough|gas|gagging/i.test(l) ? 'tough' : 'food';
  const ART = {
    feeds: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="16" cy="20" r="12" fill="${c[2]}"/><path d="M16 12v8l5 4" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none"/><rect x="36" y="15" width="22" height="10" rx="5" fill="${c[3]}"/><rect x="64" y="15" width="14" height="10" rx="5" fill="${c[3]}"/></svg>`,
    enough: c => `<svg viewBox="0 0 90 40" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${6 + i * 13} 12h10v6c0 5-2.3 9-5 9s-5-4-5-9Z" fill="${i < 4 ? c[2] : c[3]}"/>`).join('')}</svg>`,
    milk: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="8" y="10" width="16" height="26" rx="5" fill="${c[2]}"/><rect x="11" y="4" width="10" height="6" rx="2" fill="${c[3]}"/><path d="M44 8c6 9 9 14 9 19a9 9 0 0 1-18 0c0-5 3-10 9-19Z" fill="${c[3]}"/></svg>`,
    food: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 18h40a20 20 0 0 1-40 0Z" fill="${c[2]}"/><circle cx="62" cy="20" r="9" fill="${c[3]}"/></svg>`,
    tough: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="18" cy="20" r="12" fill="${c[2]}"/><circle cx="42" cy="14" r="5" fill="${c[3]}"/><circle cx="54" cy="24" r="4" fill="${c[3]}"/><circle cx="64" cy="14" r="3" fill="${c[3]}"/></svg>`
  };
  function dress() {
    const page = document.querySelector('#main .hub-page.hub-detail[data-overview="Feeding"]');
    if (!page || !page.dataset || page.dataset.ss) return;
    const head = page.querySelector(':scope > .hub-detail-head'); if (!head) return;
    page.dataset.ss = '1';
    const ctx = ((head.querySelector('.hub-context') || {}).textContent || '').trim(), k = LANE(ctx), c = C[k];
    head.classList.add('dev-area-head', 'ss-head'); head.style.setProperty('--area', c[0]); head.style.setProperty('--area-ink', c[1]);
    const big = head.querySelector('.hub-big'), art = `<span class="dev-area-head-art">${ART[k](c)}</span>`;
    if (big) big.outerHTML = art; else head.insertAdjacentHTML('afterbegin', art);
    page.style.setProperty('--ss-bg', c[0]); page.style.setProperty('--ss-ink', c[1]);
    page.querySelectorAll('.hub-moment').forEach(m => {
      const ps = [...m.children].filter(p => p.tagName === 'P');
      const lab = p => ((p.querySelector(':scope > b:first-child') || {}).textContent || '').trim();
      if (!ps.some(p => /^What to do/i.test(lab(p)))) return;
      const out = ps.map(p => {
        const l = lab(p), b = p.querySelector(':scope > b:first-child'); if (b) b.remove();
        const t = p.innerHTML.trim();
        if (/^What to do/i.test(l)) return `<section class="ss-do"><b>What to do</b><p>${t}</p></section>`;
        if (/^What’s happening/i.test(l)) return `<p class="ss-what">${t}</p>`;
        if (/^How (you’ll know|long)/i.test(l)) return `<p class="ss-know"><b>${l.replace(/\.$/, '')}</b>${t}</p>`;
        return `<p class="ss-small">${l ? `<b>${l.replace(/\.$/, ':')}</b> ` : ''}${t}</p>`;
      });
      m.className = 'ss-moment'; m.innerHTML = out.join('');
    });
  }
  const base = window.render;
  if (typeof base !== 'function') return;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
