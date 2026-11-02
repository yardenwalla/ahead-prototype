/* Ahead · play pictures for Development & play.
   Same flat language as the newer scenes in hub-art.js: no outlines, a soft backdrop in the category's palette,
   simple shapes, dot eyes. Words live in HTML under the picture. One picture per idea. */
(function () {
  const SK = '#f4d6c4', HK = '#e8bda6', SUN = '#f3d58a', ROSE = '#f2b8c6', MINT = '#bfe3cf', SKY = '#cfe3f7';
  const pal = () => { const p = (typeof YEAR_PALETTES !== 'undefined' && YEAR_PALETTES.Development) || { bg: '#e5e0fc', pale: '#efedff', ink: '#625084', accent: '#b4a5dc' }; return Object.assign({}, p, { bg: p.accent }); };
  const svg = (inner, c) => `<svg viewBox="0 0 160 116" aria-hidden="true"><circle cx="80" cy="60" r="52" fill="${c.pale}"/>${inner}</svg>`;
  const shadow = (c, cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="4" fill="${c.ink}" fill-opacity=".08"/>`;
  const face = (c, x, y, r = 12, look = 0) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SK}"/><path d="M${x - r * .36 + look} ${y - 1}h.01M${x + r * .36 + look} ${y - 1}h.01" stroke="${c.ink}" stroke-opacity=".65" stroke-width="2.8" stroke-linecap="round"/><path d="M${x - 3 + look} ${y + r * .38}q3 2.4 6 0" stroke="${c.ink}" stroke-opacity=".5" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  const limb = (pts, w = 6, col = SK) => `<path d="M${pts.map(p => p.join(' ')).join(' L')}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  // A sitting baby whose bottom rests at (x, y). Arms: [[elbow], [hand]] for each side.
  const sit = (c, x, y, { left = [[x - 16, y - 24], [x - 20, y - 14]], right = [[x + 16, y - 24], [x + 20, y - 14]], look = 0 } = {}) =>
    `${shadow(c, x, y + 2, 30)}<rect x="${x - 26}" y="${y - 10}" width="52" height="12" rx="6" fill="${c.bg}"/><circle cx="${x - 26}" cy="${y - 4}" r="5" fill="${SK}"/><circle cx="${x + 26}" cy="${y - 4}" r="5" fill="${SK}"/>`
    + `<rect x="${x - 13}" y="${y - 38}" width="26" height="34" rx="12" fill="${c.bg}"/>`
    + limb([[x - 10, y - 32], ...left]) + limb([[x + 10, y - 32], ...right]) + face(c, x, y - 49, 13, look);
  // Lying on the back, head on the left.
  const back = (c, x, y, { up = true } = {}) => `${shadow(c, x + 4, y + 8, 38)}<rect x="${x - 18}" y="${y - 6}" width="40" height="18" rx="9" fill="${c.bg}"/>`
    + limb([[x + 18, y], [x + 30, y - 12], [x + 36, y - 8]], 6) + limb([[x + 18, y + 8], [x + 32, y - 2], [x + 38, y + 2]], 6)
    + (up ? limb([[x - 6, y - 4], [x - 2, y - 20]], 5) + limb([[x + 4, y - 4], [x + 10, y - 18]], 5) : '') + face(c, x - 28, y + 2, 12);
  // On the tummy, propped on forearms, head up on the left.
  const tummy = (c, x, y) => `${shadow(c, x + 6, y + 6, 40)}<rect x="${x - 14}" y="${y - 10}" width="46" height="16" rx="8" fill="${c.bg}"/>`
    + limb([[x + 30, y - 2], [x + 44, y]], 6) + limb([[x - 10, y - 6], [x - 18, y + 2], [x - 30, y + 2]], 5) + face(c, x - 24, y - 14, 12, -2);
  // A grown-up: head and shoulders at the side of the scene.
  const grownup = (c, x, y, side = 1) => `<path d="M${x - 26} ${y + 44}c0-24 10-34 26-34s26 10 26 34Z" fill="${c.ink}" fill-opacity=".2"/><circle cx="${x}" cy="${y}" r="15" fill="${HK}"/><path d="M${x - 15} ${y - 2}c2-12 26-14 30 0" fill="${c.ink}" fill-opacity=".45"/><path d="M${x - 5 + side * 2} ${y + 1}h.01M${x + 5 + side * 2} ${y + 1}h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="2.6" stroke-linecap="round"/><path d="M${x - 3 + side * 2} ${y + 7}q3 2.4 6 0" stroke="${c.ink}" stroke-opacity=".5" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  const mirror = (c, x, y) => `<rect x="${x - 3}" y="${y + 18}" width="6" height="16" rx="3" fill="${c.ink}" fill-opacity=".35"/><ellipse cx="${x}" cy="${y}" rx="15" ry="20" fill="${c.ink}" fill-opacity=".35"/><ellipse cx="${x}" cy="${y}" rx="11.5" ry="16.5" fill="#fff"/><path d="M${x - 6} ${y - 6}l7-7M${x - 6} ${y + 1}l11-11" stroke="${SKY}" stroke-width="2" stroke-linecap="round"/>`;
  const rattle = (x, y, rot = -30) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - 2.5}" y="${y}" width="5" height="16" rx="2.5" fill="${SUN}"/><circle cx="${x}" cy="${y - 4}" r="8" fill="${ROSE}"/><circle cx="${x - 2.5}" cy="${y - 6.5}" r="2" fill="#fff" fill-opacity=".7"/></g>`;
  const ball = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${SUN}"/><path d="M${x - r} ${y}q${r} ${-r * .7} ${r * 2} 0" stroke="#fff" stroke-opacity=".8" stroke-width="2" fill="none"/>`;
  const book = (c, x, y, w = 34) => `<path d="M${x - w / 2} ${y}l${w / 2} 4 ${w / 2}-4v20l-${w / 2} 4-${w / 2}-4Z" fill="#fff"/><path d="M${x} ${y + 4}v20" stroke="${c.bg}" stroke-width="2"/><circle cx="${x - w / 4}" cy="${y + 11}" r="4" fill="${ROSE}"/><rect x="${x + 4}" y="${y + 8}" width="${w / 2 - 8}" height="7" rx="3.5" fill="${MINT}"/>`;
  const card = (x, y) => `<rect x="${x - 12}" y="${y - 15}" width="24" height="30" rx="4" fill="#fff"/><circle cx="${x}" cy="${y - 4}" r="6" fill="#4b4560"/><rect x="${x - 7}" y="${y + 6}" width="14" height="4" rx="2" fill="#4b4560"/>`;
  const notes = (c, x, y) => `<path d="M${x} ${y}v-12l8-2v12" stroke="${c.ink}" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="${x - 2}" cy="${y}" r="3" fill="${c.ink}" fill-opacity=".5"/><circle cx="${x + 6}" cy="${y - 2}" r="3" fill="${c.ink}" fill-opacity=".5"/>`;
  const block = (x, y, s, f) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="4" fill="${f}"/>`;
  const basket = (c, x, y) => `<path d="M${x - 20} ${y - 14}h40l-5 18h-30Z" fill="${c.ink}" fill-opacity=".3"/><path d="M${x - 20} ${y - 14}h40" stroke="${c.ink}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>`;
  const cloth = (c, x, y) => `<path d="M${x - 18} ${y}c2-14 8-20 18-20s16 6 18 20Z" fill="${MINT}"/><path d="M${x - 8} ${y - 4}l4-8M${x + 2} ${y - 2}l4-10" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>`;
  const bowl = (c, x, y) => `<path d="M${x - 14} ${y - 10}h28c0 8-6 13-14 13s-14-5-14-13Z" fill="${SKY}"/><path d="M${x - 14} ${y - 10}h28" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
  const cup = (x, y) => `<path d="M${x - 7} ${y - 16}h14l-2 16h-10Z" fill="${MINT}"/><path d="M${x + 7} ${y - 12}c5 0 5 7 0 7" stroke="${MINT}" stroke-width="2.4" fill="none"/>`;
  const bear = (c, x, y) => `<circle cx="${x - 7}" cy="${y - 27}" r="4" fill="#d9b48f"/><circle cx="${x + 7}" cy="${y - 27}" r="4" fill="#d9b48f"/><rect x="${x - 11}" y="${y - 18}" width="22" height="20" rx="10" fill="#d9b48f"/><circle cx="${x}" cy="${y - 22}" r="9" fill="#d9b48f"/><path d="M${x - 3} ${y - 23}h.01M${x + 3} ${y - 23}h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="2.2" stroke-linecap="round"/>`;
  const leaf = (x, y, r, f) => `<path d="M${x} ${y}c${r} -${r} ${r * 2} 0 0 ${r * 1.4}c-${r * 2} -${r * 1.4} -${r} -${r * 2.4} 0 -${r * 1.4}Z" fill="${f}"/>`;
  const wave = (c, x, y) => `<path d="M${x} ${y}q4-4 8 0M${x + 2} ${y - 6}q5-5 10 0" stroke="${c.ink}" stroke-opacity=".4" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;

  const S = {
    // By 2 months
    'close-face': c => svg(grownup(c, 52, 44, 1) + `<rect x="74" y="74" width="40" height="22" rx="11" fill="${c.bg}"/>` + face(c, 92, 62, 13, -2) + `<path d="M44 92c14 4 50 6 70 2" stroke="${HK}" stroke-width="9" stroke-linecap="round" fill="none"/>`, c),
    'chest-chat': c => svg(`<path d="M20 104c6-30 30-40 70-40s58 12 62 40Z" fill="${c.ink}" fill-opacity=".2"/><circle cx="116" cy="40" r="15" fill="${HK}"/><path d="M101 38c2-12 26-14 30 0" fill="${c.ink}" fill-opacity=".45"/><path d="M109 41h.01M117 41h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="2.6" stroke-linecap="round"/>` + `<rect x="54" y="66" width="40" height="16" rx="8" fill="${c.bg}"/>` + limb([[60, 74], [52, 82]], 5) + face(c, 92, 60, 12, 2), c),
    'bold-picture': c => svg(back(c, 82, 80) + `<g transform="rotate(-8 56 38)">${card(56, 38)}</g>`, c),
    'song-listen': c => svg(grownup(c, 50, 46, 1) + `<rect x="78" y="76" width="38" height="20" rx="10" fill="${c.bg}"/>` + face(c, 96, 66, 12, -2) + notes(c, 76, 34) + notes(c, 98, 24), c),
    // By 4 months
    'mirror-company': c => svg(sit(c, 64, 96, { right: [[80, 70], [92, 62]] }) + mirror(c, 112, 48), c),
    'easy-grip': c => svg(back(c, 82, 80, { up: false }) + limb([[76, 76], [80, 58]], 5) + rattle(84, 52, 20), c),
    'tummy-picture': c => svg(tummy(c, 78, 84) + `<g transform="rotate(6 116 64)">${card(118, 66)}</g>`, c),
    'crinkle-book': c => svg(sit(c, 64, 96, { right: [[80, 74], [90, 76]] }) + `<g transform="rotate(-8 112 72)">${book(c, 112, 66, 38)}</g>`, c),
    // By 6 months
    'two-hands': c => svg(sit(c, 80, 98, { left: [[66, 78], [74, 68]], right: [[94, 78], [86, 68]] }) + ball(80, 66, 8), c),
    'peek-face': c => svg(grownup(c, 48, 46, 1) + `<rect x="33" y="38" width="13" height="18" rx="6.5" fill="#d9a88f"/><rect x="50" y="38" width="13" height="18" rx="6.5" fill="#d9a88f"/>` + sit(c, 108, 98, { left: [[94, 76], [90, 66]], right: [[122, 76], [128, 66]] }), c),
    'supported-reach': c => svg(sit(c, 72, 98, { right: [[88, 72], [102, 66]] }) + rattle(112, 64, 30) + `<path d="M40 80c-8 4-10 14-6 20" stroke="${HK}" stroke-width="9" stroke-linecap="round" fill="none"/>`, c),
    'floor-drum': c => svg(sit(c, 64, 98, { right: [[80, 80], [96, 78]] }) + bowl(c, 108, 90) + wave(c, 116, 70), c),
    // By 9 months
    'hidden-toy': c => svg(sit(c, 60, 98, { right: [[76, 80], [92, 84]] }) + cloth(c, 110, 98) + `<circle cx="122" cy="94" r="5" fill="${ROSE}"/>`, c),
    'empty-basket': c => svg(sit(c, 62, 98, { right: [[78, 78], [90, 72]] }) + basket(c, 112, 96) + ball(96, 70, 6) + block(104, 74, 9, ROSE) + `<circle cx="118" cy="80" r="5" fill="${MINT}"/>`, c),
    'ball-turns': c => svg(sit(c, 50, 98, { right: [[66, 82], [76, 90]] }) + ball(92, 92, 8) + `<path d="M104 92h14" stroke="${c.ink}" stroke-opacity=".3" stroke-width="2" stroke-dasharray="2 4" stroke-linecap="round"/>` + grownup(c, 128, 56, -1), c),
    'hello-wave': c => svg(sit(c, 70, 98, { right: [[86, 66], [92, 50]] }) + `<circle cx="92" cy="46" r="5" fill="${SK}"/>` + wave(c, 100, 44) + bear(c, 122, 98), c),
    // By 12 months
    'pretend-cup': c => svg(sit(c, 68, 98, { right: [[82, 70], [74, 62]] }) + cup(78, 66) + bear(c, 116, 98), c),
    'stack-pair': c => svg(sit(c, 60, 98, { right: [[76, 80], [92, 80]] }) + block(98, 84, 16, MINT) + block(100, 68, 13, ROSE) + block(118, 88, 12, SUN), c),
    'action-book': c => svg(sit(c, 62, 98, { left: [[48, 70], [52, 58]], right: [[76, 70], [72, 58]] }) + `<g transform="rotate(-6 112 74)">${book(c, 112, 70, 40)}</g>`, c),
    'two-baskets': c => svg(sit(c, 54, 98, { right: [[70, 78], [84, 72]] }) + `<g transform="translate(94 100) scale(.7)">${basket(c, 0, 0)}</g><g transform="translate(122 100) scale(.7)">${basket(c, 0, 0)}</g>` + ball(84, 68, 6) + `<path d="M98 80q12-14 24 0" stroke="${c.ink}" stroke-opacity=".3" stroke-width="2" stroke-dasharray="2 4" fill="none" stroke-linecap="round"/>`, c)
  };

  // Crawling on hands and knees, head on the right.
  const crawl = (c, x, y) => `${shadow(c, x, y + 2, 34)}<rect x="${x - 22}" y="${y - 26}" width="40" height="18" rx="9" fill="${c.bg}"/>`
    + limb([[x - 16, y - 12], [x - 22, y - 2], [x - 34, y]], 6) + limb([[x + 10, y - 14], [x + 12, y]], 6) + limb([[x + 2, y - 14], [x + 2, y]], 6) + face(c, x + 22, y - 30, 12, 2);
  // Standing, holding a low table, head up.
  const standAt = (c, x, y) => `${shadow(c, x + 10, y + 2, 34)}<rect x="${x + 14}" y="${y - 44}" width="40" height="6" rx="3" fill="${c.ink}" fill-opacity=".35"/><rect x="${x + 46}" y="${y - 40}" width="5" height="40" rx="2.5" fill="${c.ink}" fill-opacity=".3"/>`
    + limb([[x - 6, y - 22], [x - 7, y]], 7) + limb([[x + 6, y - 22], [x + 7, y]], 7) + `<rect x="${x - 12}" y="${y - 50}" width="24" height="30" rx="11" fill="${c.bg}"/>`
    + limb([[x + 8, y - 44], [x + 20, y - 42]], 5) + limb([[x - 8, y - 44], [x - 14, y - 34]], 5) + face(c, x, y - 60, 12, 2);
  // The baby at each Development stage, for the top of the page.
  const HERO = {
    2: c => svg(back(c, 86, 80) + `<circle cx="46" cy="40" r="4" fill="${SUN}"/>`, c),
    4: c => svg(tummy(c, 82, 84) + rattle(118, 74, 30), c),
    6: c => svg(sit(c, 72, 98, { right: [[88, 72], [100, 62]] }) + ball(110, 58, 8), c),
    9: c => svg(crawl(c, 74, 96) + block(110, 82, 12, MINT), c),
    12: c => svg(standAt(c, 62, 100) + ball(118, 98, 7), c)
  };
  // Small pictures for the four areas.
  const AREA = {
    Social: c => svg(`<circle cx="62" cy="58" r="20" fill="${HK}"/><path d="M42 54c3-17 37-19 40 0" fill="${c.ink}" fill-opacity=".45"/><path d="M55 60h.01M68 60h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/><path d="M58 68q4 3 8 0" stroke="${c.ink}" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/>` + face(c, 104, 66, 15, -2) + `<path d="M84 34c-3-4-9-2-7 3 1 3 7 6 7 6s6-3 7-6c2-5-4-7-7-3Z" fill="${ROSE}"/>`, c),
    Talking: c => svg(face(c, 64, 70, 17, 2) + `<rect x="88" y="30" width="44" height="28" rx="14" fill="#fff"/><path d="M94 56l-6 10 14-8Z" fill="#fff"/><path d="M100 44h.01M110 44h.01M120 44h.01" stroke="${c.ink}" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>`, c),
    Thinking: c => svg(face(c, 58, 64, 16, 4) + cloth(c, 104, 92) + `<circle cx="118" cy="86" r="7" fill="${ROSE}"/><path d="M90 44q6-8 12 0" stroke="${c.ink}" stroke-opacity=".35" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="2 4"/>`, c),
    Movement: c => svg(crawl(c, 78, 94), c)
  };
  window.devHeroArt = ref => HERO[ref] ? HERO[ref](pal()) : '';
  window.devAreaArt = (d, ref) => (d === 'Movement' && HERO[ref] ? HERO[ref](pal()) : AREA[d] ? AREA[d](pal()) : '').replace('viewBox="0 0 160 116"', 'viewBox="14 6 132 104" preserveAspectRatio="xMidYMid meet"');
  // Four ideas per stage, in the order a parent might try them.
  window.DEV_STAGE_IDEAS = { 2: ['close-face', 'chest-chat', 'bold-picture', 'song-listen'], 4: ['mirror-company', 'easy-grip', 'tummy-picture', 'crinkle-book'], 6: ['two-hands', 'peek-face', 'supported-reach', 'floor-drum'], 9: ['hidden-toy', 'empty-basket', 'ball-turns', 'hello-wave'], 12: ['pretend-cup', 'stack-pair', 'action-book', 'two-baskets'] };
  window.devPlayArt = id => (S[id] ? S[id](pal()) : '');
})();
