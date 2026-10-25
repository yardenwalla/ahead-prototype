/* Ahead · small illustrations for the summary and detail screens.
   Same language as the app’s own icons: a 24-unit grid, 1.5 line, round joins and one soft tint fill. No faces or sparkles. */
(function () {
  /* Small icons: same language as the app's own icons — 24-unit grid, 1.5 line, round joins,
     one soft tint fill for depth. No faces, no sparkles. */
  const BOWL = (t) => `<path d="M3 11h18c0 4.4-4 8-9 8s-9-3.6-9-8Z" fill="${t}"/>`;
  const ART = {
    head: (c) => `<circle cx="12" cy="8.5" r="4" fill="${c.bg}"/><path d="M5 20.5c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5"/>`,
    sit: (c) => `<circle cx="12" cy="5.5" r="2.5" fill="${c.bg}"/><path d="M8.6 10h6.8l1 7H7.6Z" fill="${c.bg}"/><path d="M4.5 20.5h15"/>`,
    mouth: (c) => `<ellipse cx="9" cy="8" rx="3.2" ry="4.2" fill="${c.bg}" transform="rotate(-35 9 8)"/><path d="m11.2 11.4 7.3 9.1"/>`,
    swallow: (c) => `<circle cx="12" cy="8" r="4.5" fill="${c.bg}"/><path d="M12 15v6m-2.5-2.5L12 21l2.5-2.5"/>`,
    highchair: (c) => `<rect x="7" y="3" width="10" height="8" rx="2" fill="${c.bg}"/><path d="M4 11h16M8 11l-2 9.5M16 11l2 9.5M8.8 16h6.4"/>`,
    bowl: (c) => `${BOWL(c.bg)}<path d="m14 8 5-5"/>`,
    lentils: (c) => `${BOWL(c.bg)}<path d="M8.5 8.6h.01M12 7.8h.01M15.5 8.6h.01" stroke-width="2.4"/>`,
    meat: (c) => `<ellipse cx="14.5" cy="9.5" rx="6" ry="4.5" fill="${c.bg}" transform="rotate(-45 14.5 9.5)"/><path d="m10 14-5 5m-1.2-1.6 1.4 3.2 3.2 1.4"/>`,
    egg: (c) => `<path d="M12 3c3.5 0 6 5 6 9.5a6 6 0 0 1-12 0C6 8 8.5 3 12 3Z" fill="${c.bg}"/><circle cx="12" cy="13.5" r="2.5"/>`,
    oats: (c) => `${BOWL(c.bg)}<path d="M9 7.5c-.8-.9-.8-2 0-3m3 3c-.8-.9-.8-2 0-3m3 3c-.8-.9-.8-2 0-3"/>`,
    avocado: (c) => `<path d="M12 3c3 0 5 4 5.6 8.6A5.6 5.6 0 0 1 6.4 11.6C7 7 9 3 12 3Z" fill="${c.bg}"/><circle cx="12" cy="14" r="2.5"/>`,
    potato: (c) => `<path d="M4.5 13.5C4.5 9 8 6 12.5 6s7 2.8 7 6.2S16.5 19 11.5 19s-7-1.6-7-5.5Z" fill="${c.bg}"/><path d="M10 11h.01M14 13.5h.01M9 15h.01" stroke-width="2"/>`,
    peanut: (c) => `<path d="M9.8 3.5a3.8 3.8 0 0 1 3.7 4.8c-.3 1 .1 1.8.8 2.5a4.4 4.4 0 1 1-6.6 5.4c-.5-.9-.4-1.9.2-2.8.5-.8.4-1.6-.1-2.4a3.8 3.8 0 0 1 2-7.5Z" fill="${c.bg}"/>`,
    hand: (c) => `<path d="M8.5 13V6.2a1.4 1.4 0 0 1 2.8 0V11m0-6.3a1.4 1.4 0 0 1 2.8 0V11m0-4.8a1.4 1.4 0 0 1 2.8 0v8.3A5.5 5.5 0 0 1 11.4 20h-.6a5 5 0 0 1-3.9-1.9L4.3 14.8a1.5 1.5 0 0 1 2.2-2l2 1.7" fill="${c.bg}"/>`,
    cup: (c) => `<path d="M6 4h12l-1.6 16H7.6Z" fill="${c.bg}"/><path d="M6.6 9.5h10.8"/>`,
    clock: (c) => `<circle cx="12" cy="12" r="8.5" fill="${c.bg}"/><path d="M12 7.5V12l3 2"/>`,
    diaper: (c) => `<path d="M3.5 7h17v3c0 5-3.8 8.5-8.5 8.5S3.5 15 3.5 10Z" fill="${c.bg}"/><path d="M3.5 10.5h17"/>`,
    drop: (c) => `<path d="M12 3c3.5 4.5 6 8 6 11a6 6 0 0 1-12 0c0-3 2.5-6.5 6-11Z" fill="${c.bg}"/>`,
    plate: (c) => `<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5" fill="${c.bg}"/>`,
    shield: (c) => `<path d="m12 3 8 3v6c0 4.5-3.5 7.5-8 9-4.5-1.5-8-4.5-8-9V6Z" fill="${c.bg}"/><path d="m9 12 2 2 4-4"/>`,
    moon: (c) => `<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z" fill="${c.bg}"/>`,
    bath: (c) => `<path d="M3 12h18v1.5a5.5 5.5 0 0 1-5.5 5.5h-7A5.5 5.5 0 0 1 3 13.5Z" fill="${c.bg}"/><path d="M6 12V6.5a2 2 0 0 1 4 0M7 19l-1 2m12-2 1 2"/>`,
    tooth: (c) => `<path d="M7.5 3.6c2-.8 3 .6 4.5.6s2.5-1.4 4.5-.6 3 3.4 2.5 6c-.5 2.4-1.3 4-1.7 6.8-.3 2.4-1 3.9-2 3.9s-1.3-1.4-1.6-3.3c-.3-1.3-.8-2-1.7-2s-1.4.7-1.7 2C10 18.9 9.7 20.3 8.7 20.3s-1.7-1.5-2-3.9C6.3 13.6 5.5 12 5 9.6c-.5-2.6.5-5.2 2.5-6Z" fill="${c.bg}"/>`,
    sun: (c) => `<circle cx="12" cy="12" r="4" fill="${c.bg}"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>`,
    nail: (c) => `<path d="M8 21v-11a4 4 0 0 1 8 0v11" fill="${c.bg}"/><path d="M10 10a2 2 0 0 1 4 0v2h-4Z"/>`,
    cord: (c) => `<circle cx="12" cy="12" r="8.5" fill="${c.bg}"/><path d="M12 10.5c1 0 1.6.7 1.6 1.5s-.7 1.6-1.6 1.6-1.4-.6-1.4-1.3"/>`,
    pacifier: (c) => `<ellipse cx="12" cy="14" rx="7.5" ry="4.5" fill="${c.bg}"/><path d="M10 10.2c0-2.6.8-5.2 2-5.2s2 2.6 2 5.2"/><circle cx="12" cy="14" r="1.8"/>`,
    towel: (c) => `<rect x="5" y="3.5" width="14" height="17" rx="2" fill="${c.bg}"/><path d="M5 8h14M5 16h14"/>`
  };
  /* Figures: flat, outline-free scenes on a soft backdrop. Words live in HTML under the picture, in the app's type. */
  const SK = '#f4d6c4', MILK = '#fbecc6', NIP = '#efd08f';
  const sleepEyes = (x, y, ink) => `<path d="M${x - 6} ${y}q2.5 2 5 0M${x + 1} ${y}q2.5 2 5 0" stroke="${ink}" stroke-opacity=".55" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  const backdrop = (c, cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.pale}"/>`;
  const shadow = (c, cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="4" fill="${c.ink}" fill-opacity=".07"/>`;
  const bottle = (x, y, rot, fill = 12) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - 8}" y="${y - 3.5}" width="10" height="7" rx="3.5" fill="${NIP}"/><rect x="${x}" y="${y - 7}" width="44" height="14" rx="7" fill="#fff"/><rect x="${x}" y="${y - 7}" width="${fill}" height="14" rx="7" fill="${MILK}"/><rect x="${x + 36}" y="${y - 7}" width="8" height="14" rx="4" fill="#fff" stroke="#000" stroke-opacity=".06"/></g>`;
  const SCENES = {
    crib: (c) => `<svg viewBox="0 0 320 150">
      <rect x="14" y="8" width="292" height="134" rx="22" fill="${c.pale}"/>
      ${shadow(c, 160, 132, 124)}
      <rect x="44" y="28" width="10" height="104" rx="5" fill="${c.ink}" fill-opacity=".32"/><rect x="266" y="28" width="10" height="104" rx="5" fill="${c.ink}" fill-opacity=".32"/>
      <rect x="44" y="34" width="232" height="8" rx="4" fill="${c.ink}" fill-opacity=".32"/>
      ${Array.from({ length: 13 }, (_, i) => `<rect x="${66 + i * 16}" y="42" width="5" height="56" rx="2.5" fill="${c.ink}" fill-opacity=".12"/>`).join('')}
      <rect x="54" y="96" width="212" height="22" rx="7" fill="#fff"/>
      <rect x="54" y="96" width="212" height="7" rx="3.5" fill="${c.bg}" fill-opacity=".6"/>
      <rect x="44" y="116" width="232" height="7" rx="3.5" fill="${c.ink}" fill-opacity=".32"/>
      <rect x="114" y="72" width="78" height="25" rx="12.5" fill="${c.bg}"/>
      <path d="M128 84.5h48" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 4"/>
      <circle cx="102" cy="84" r="14" fill="${SK}"/>${sleepEyes(102, 84, c.ink)}
      </svg>`,
    paced: (c) => `<svg viewBox="0 0 160 116">${backdrop(c, 80, 60, 50)}${shadow(c, 66, 106, 34)}
      <rect x="44" y="58" width="42" height="48" rx="20" fill="${c.bg}"/>
      <circle cx="64" cy="42" r="17" fill="${SK}"/><path d="M57 40h.01M68 40h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
      ${bottle(86, 49, 0)}</svg>`,
    tipped: (c) => `<svg viewBox="0 0 160 116">${backdrop(c, 80, 60, 50)}${shadow(c, 84, 102, 46)}
      <rect x="56" y="76" width="66" height="24" rx="12" fill="${c.bg}"/>
      <circle cx="46" cy="84" r="16" fill="${SK}"/>${sleepEyes(46, 82, c.ink)}
      ${bottle(58, 70, -42, 44)}</svg>`,
    strips: (c) => `<svg viewBox="0 0 160 116">${backdrop(c, 80, 58, 50)}
      <rect x="34" y="34" width="92" height="15" rx="7.5" fill="#b8d78d" transform="rotate(-8 80 41)"/>
      <rect x="30" y="56" width="98" height="15" rx="7.5" fill="#f2ad74"/>
      <rect x="34" y="78" width="90" height="15" rx="5" fill="#ecdcb8" transform="rotate(6 80 85)"/></svg>`,
    pieces: (c) => `<svg viewBox="0 0 160 116">${backdrop(c, 80, 58, 50)}
      ${[[44, 44, '#b8d78d'], [60, 36, '#f2ad74'], [52, 60, '#ecdcb8'], [70, 54, '#b8d78d'], [40, 74, '#f2ad74'], [62, 78, '#ecdcb8'], [78, 70, '#f2ad74']].map(([x, y, f], i) => `<rect x="${x}" y="${y}" width="10" height="10" rx="3" fill="${f}" transform="rotate(${(i * 23) % 40 - 20} ${x + 5} ${y + 5})"/>`).join('')}
      <g transform="translate(112 60)">${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `<path d="M${sx * 2} ${sy * 2}h${sx * 13}a${13} 17 0 0 ${sx * sy > 0 ? 1 : 0} ${-sx * 13} ${sy * 17}Z" fill="${sx < 0 ? '#9d86cf' : '#b8a4e3'}"/>`).join('')}</g></svg>`
  };
  const PANELS = {
    crib: { scenes: ['crib'], chips: ['On the back', 'In a sleep sack', 'Firm, flat mattress', 'Nothing else in the crib'] },
    pace: { scenes: [['paced', 'good', 'Paced', 'Upright, bottle level'], ['tipped', 'bad', 'Avoid', 'Lying back, bottle tipped up']] },
    sizes: { scenes: [['strips', 'good', '6–8 months', 'Strips the size of a finger'], ['pieces', 'good', '9 months and up', 'Pea-sized pieces, grapes quartered']] }
  };
  window.hubFigure = function (name, cat = 'Feeding', caption = '') {
    const c = (typeof YEAR_PALETTES !== 'undefined' ? YEAR_PALETTES : {})[cat] || { ink: '#884866', bg: '#f7d9e5', pale: '#fceef3' };
    const P = PANELS[name];
    if (!P) return '';
    const label = caption.replace(/"/g, '&quot;');
    if (P.chips) return `<figure class="hub-figure is-wide" role="img" aria-label="${label}">${SCENES[P.scenes[0]](c).replace('<svg', '<svg aria-hidden="true"')}<div class="hub-fig-chips" aria-hidden="true">${P.chips.map(t => `<span>${t}</span>`).join('')}</div></figure>`;
    return `<figure class="hub-figure" role="img" aria-label="${label}"><div class="hub-fig-panels" aria-hidden="true">${P.scenes.map(([k, tone, t, sub]) => `<div class="hub-fig-panel">${SCENES[k](c)}<b class="is-${tone}">${tone === 'bad' ? '✕' : '✓'} ${t}</b><small>${sub}</small></div>`).join('')}</div></figure>`;
  };
  window.hubArt = function (name, cat = 'Feeding') {
    const c = (typeof YEAR_PALETTES !== 'undefined' ? YEAR_PALETTES : {})[cat] || { ink: '#884866', bg: '#f7d9e5', pale: '#fceef3' };
    const draw = ART[name];
    if (!draw) return typeof yearIllustration === 'function' ? yearIllustration(cat, 0) : '';
    return `<svg viewBox="0 0 24 24" fill="none" stroke="${c.ink}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${draw(c)}</svg>`;
  };
})();
