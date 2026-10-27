/* Ahead · small illustrations for the summary and detail screens.
   Same language as the app’s own icons: a 24-unit grid, 1.5 line, round joins and one soft tint fill. No faces or sparkles. */
(function () {
  /* Small icons: same language as the app's own icons — 24-unit grid, 1.5 line, round joins,
     one soft tint fill for depth. No faces, no sparkles. */
  const BOWL = (t) => `<path d="M3 11h18c0 4.4-4 8-9 8s-9-3.6-9-8Z" fill="${t}"/>`;
  const ART = {
    head: (c) => `<circle cx="12" cy="8.5" r="4" fill="${c.bg}"/><path d="M5 20.5c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5"/>`,
    sit: (c) => `<circle cx="12" cy="5.5" r="2.5" fill="${c.bg}"/><path d="M8.6 10h6.8l1 7H7.6Z" fill="${c.bg}"/><path d="M4.5 20.5h15"/>`,
    mouth: (c) => `<path d="M4.5 10.5c2.5 6 12.5 6 15 0Z" fill="${c.bg}"/><path d="M4.5 10.5c2.6-1.6 4.8-1.2 7.5 0 2.7-1.2 4.9-1.6 7.5 0"/>`,
    alarm: (c) => `<path d="M3.5 6h17" /><path d="M6 6a6 6 0 0 0 12 0Z" fill="${c.bg}"/><circle cx="12" cy="8.5" r="1.2"/><path d="M8 16.5c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5M6 19.5c1.8 1.4 3.8 2 6 2s4.2-.6 6-2"/>`,
    window: (c) => `<rect x="5" y="3.5" width="14" height="17" rx="1.5" fill="${c.bg}"/><path d="M12 3.5v17M5 12h14"/>`,
    battery: (c) => `<circle cx="12" cy="12" r="7" fill="${c.bg}"/><circle cx="12" cy="12" r="4.5"/><path d="M12 10.3v3.4M10.3 12h3.4"/>`,
    coin: (c) => `<circle cx="8.5" cy="14.5" r="4" fill="${c.bg}"/><circle cx="16.5" cy="9" r="3" fill="${c.bg}"/><path d="M14.5 19.5h5"/>`,
    thermo: (c) => `<path d="M10 4.5a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0Z" fill="${c.bg}"/><path d="M12 15v2.5"/>`,
    dresser: (c) => `<rect x="5" y="4.5" width="14" height="13.5" rx="1.5" fill="${c.bg}"/><path d="M5 11.2h14M10.5 8h3M10.5 14.6h3M7.5 18v2M16.5 18v2M19 6.5l2-1.5"/>`,
    gate: (c) => `<path d="M4.5 5v15M19.5 5v15"/><rect x="4.5" y="8.5" width="15" height="9" fill="${c.bg}"/><path d="M8.5 8.5v9M12 8.5v9M15.5 8.5v9"/>`,
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
    smile: (c) => `<circle cx="12" cy="12" r="8.5" fill="${c.bg}"/><path d="M8.5 13.5a4 4 0 0 0 7 0M9.3 9.5h.01M14.7 9.5h.01"/>`,
    chat: (c) => `<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5Z" fill="${c.bg}"/><path d="M8.5 10h.01M12 10h.01M15.5 10h.01"/>`,
    idea: (c) => `<path d="M12 3a6 6 0 0 1 3.6 10.8c-.7.5-1.1 1.3-1.1 2.2v.5h-5V16c0-.9-.4-1.7-1.1-2.2A6 6 0 0 1 12 3Z" fill="${c.bg}"/><path d="M9.8 19.5h4.4M10.6 21.5h2.8"/>`,
    crib: (c) => `<rect x="4" y="10" width="16" height="7" rx="1.5" fill="${c.bg}"/><path d="M4 5v15M20 5v15M4 10h16M8 10v7M12 10v7M16 10v7"/>`,
    home: (c) => `<path d="M4 11 12 4l8 7v9H4Z" fill="${c.bg}"/><path d="M10 20v-5h4v5"/>`,
    sack: (c) => `<path d="M8.5 4h7l1.5 3-1 2v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9L7 7Z" fill="${c.bg}"/><path d="M12 9.5v7"/>`,
    back: (c) => `<circle cx="6.5" cy="13" r="2.5" fill="${c.bg}"/><rect x="9.5" y="10.5" width="11" height="5" rx="2.5" fill="${c.bg}"/><path d="M3 18.5h18"/>`,
    car: (c) => `<path d="M4 15.5v-3l2.2-4.6A2 2 0 0 1 8 6.8h8a2 2 0 0 1 1.8 1.1l2.2 4.6v3Z" fill="${c.bg}"/><path d="M4 12.5h16M4 15.5v2.5h3v-2.5m10 0v2.5h3v-2.5"/>`,
    sofa: (c) => `<rect x="5.5" y="5.5" width="13" height="7.5" rx="2"/><path d="M3 11.5a1.8 1.8 0 0 1 3.6 0V14h10.8v-2.5a1.8 1.8 0 0 1 3.6 0V17.5H3Z" fill="${c.bg}"/><path d="M5 17.5V20m14-2.5V20"/>`,
    heart: (c) => `<path d="M12 20s-7.5-4.5-7.5-10.2A4.1 4.1 0 0 1 12 7.3a4.1 4.1 0 0 1 7.5 2.5C19.5 15.5 12 20 12 20Z" fill="${c.bg}"/>`,
    book: (c) => `<path d="M3.5 5.5c2.8-1 5.8-1 8.5.6 2.7-1.6 5.7-1.6 8.5-.6V19c-2.8-1-5.8-1-8.5.6-2.7-1.6-5.7-1.6-8.5-.6Z" fill="${c.bg}"/><path d="M12 6.1v13.5"/>`,
    music: (c) => `<path d="M9 17V6l10-2v11"/><circle cx="6.5" cy="17" r="2.5" fill="${c.bg}"/><circle cx="16.5" cy="15" r="2.5" fill="${c.bg}"/>`,
    mirror: (c) => `<ellipse cx="12" cy="10" rx="6" ry="7" fill="${c.bg}"/><path d="M12 17v4M9 21h6M9.5 8l2.5-2.5"/>`,
    toy: (c) => `<circle cx="6.8" cy="6.8" r="2.3" fill="${c.bg}"/><circle cx="17.2" cy="6.8" r="2.3" fill="${c.bg}"/><circle cx="12" cy="12.5" r="6.5" fill="${c.bg}"/><path d="M9.8 11.5h.01M14.2 11.5h.01M10.5 14.8q1.5 1 3 0"/>`,
    mat: (c) => `<path d="M3 15.5 8 11h13l-5 4.5Z" fill="${c.bg}"/><path d="M3 15.5v2.5h13v-2.5M16 18l5-4.5V11M9.5 13.2h6"/>`,
    roll: (c) => `<circle cx="12" cy="13" r="6.5" fill="${c.bg}"/><path d="M5 8.5A8 8 0 0 1 17.5 5M17.5 5l-.4 3.3M17.5 5l-3.2-.6"/>`,
    crawl: (c) => `<circle cx="6.5" cy="9" r="2.5" fill="${c.bg}"/><path d="M9 11.5h6.5a3 3 0 0 1 3 3V18M9.5 12 8 18M14 14.5l1 3.5"/><path d="M3 20h18"/>`,
    stand: (c) => `<circle cx="12" cy="5" r="2.5" fill="${c.bg}"/><path d="M12 8v7l-3 5m3-5 3 5M7.5 11.5h9"/>`,
    ball: (c) => `<circle cx="12" cy="12" r="8" fill="${c.bg}"/><path d="M5.5 8.5c4 2.2 9 2.2 13 0M5.5 15.5c4-2.2 9-2.2 13 0"/>`,
    blocks: (c) => `<rect x="3.5" y="12.5" width="7.5" height="7.5" rx="1.5" fill="${c.bg}"/><rect x="13" y="12.5" width="7.5" height="7.5" rx="1.5"/><rect x="8.25" y="4" width="7.5" height="7.5" rx="1.5" fill="${c.bg}"/>`,
    peek: (c) => `<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" fill="${c.bg}"/><path d="M4.5 4.5l15 15"/>`,
    wave: (c) => `<path d="M9 13V7.5a1.3 1.3 0 0 1 2.6 0V11m0-5a1.3 1.3 0 0 1 2.6 0v5m0-3.5a1.3 1.3 0 0 1 2.6 0v7A5 5 0 0 1 11.8 20h-.4a5 5 0 0 1-4-2L5 15a1.4 1.4 0 0 1 2-2l2 1.5" fill="${c.bg}"/><path d="M3.5 8c.4-1.6 1.4-2.8 3-3.5M19 4c1.2.9 1.8 2.1 2 3.5"/>`,
    eye: (c) => `<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" fill="${c.bg}"/><circle cx="12" cy="12" r="2.5"/>`,
    ear: (c) => `<path d="M7.5 9.5a5.5 5.5 0 0 1 11 0c0 3.2-2.6 4.2-3.2 6.8-.4 2-1.9 3.7-3.9 3.7a3.4 3.4 0 0 1-3.4-3.4" fill="${c.bg}"/><path d="M10.8 9.8a2.2 2.2 0 0 1 4.4 0c0 1.4-1.3 1.8-1.7 2.8"/>`,
    bottle: (c) => `<rect x="8" y="8.5" width="8" height="12" rx="2.5" fill="${c.bg}"/><path d="M9 8.5V7h6v1.5M10.5 7c0-1.8.6-3.5 1.5-3.5s1.5 1.7 1.5 3.5M8 13h3M8 16h3"/>`,
    shirt: (c) => `<path d="M8.5 4 4 7l2 3.5 2-1V20h8V9.5l2 1L20 7l-4.5-3a3.5 3.5 0 0 1-7 0Z" fill="${c.bg}"/>`,
    steth: (c) => `<path d="M6 3.5V8a4 4 0 0 0 8 0V3.5"/><path d="M10 12v2.5a4.5 4.5 0 0 0 9 0V13"/><circle cx="19" cy="11" r="2" fill="${c.bg}"/>`,
    leaf: (c) => `<path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15Z" fill="${c.bg}"/><path d="m5 19 8-8"/>`,
    star: (c) => `<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z" fill="${c.bg}"/>`,
    near: (c) => `<circle cx="5.5" cy="12" r="4" fill="#f4d6c4"/><path d="M4.3 11.2h.01M6.9 11.2h.01" stroke-width="2"/><circle cx="18.8" cy="12.5" r="3" fill="#f4d6c4"/><path d="M17.9 12h.01M19.8 12h.01" stroke-width="1.8"/><path d="M10.6 12.2h4.6" stroke-dasharray="1.4 1.8"/>`,
    colors: (c) => `<circle cx="9" cy="9.5" r="5" fill="#f4b6a6" stroke="none" fill-opacity=".9"/><circle cx="15" cy="9.5" r="5" fill="#a9cfe8" stroke="none" fill-opacity=".9"/><circle cx="12" cy="15" r="5" fill="#f3d58a" stroke="none" fill-opacity=".9"/>`,
    cube: (c) => `<path d="M12 3.5 19.5 7.5v9L12 20.5 4.5 16.5v-9Z" fill="${c.bg}"/><path d="M4.5 7.5 12 11.5l7.5-4M12 11.5v9"/>`,
    hidden: (c) => `<circle cx="16.5" cy="10" r="3" fill="#f3d58a"/><path d="M3 19c1-6 4-9 8-9s7 3 8 9Z" fill="${c.bg}"/><path d="M6.5 15.5c1.2-1.5 2.6-2.2 4.2-2.2"/>`,
    toss: (c) => `<circle cx="18" cy="17" r="3" fill="${c.bg}"/><path d="M4 18C5 9 10 5 15 6" stroke-dasharray="1.5 2.2"/><path d="M13.5 4.2 15.3 6l-2 1.4"/>`,
    towel: (c) => `<rect x="5" y="3.5" width="14" height="17" rx="2" fill="${c.bg}"/><path d="M5 8h14M5 16h14"/>`
  };
  /* Figures: flat, outline-free scenes on a soft backdrop. Words live in HTML under the picture, in the app's type. */
  const SK = '#f4d6c4', MILK = '#fbecc6', NIP = '#efd08f';
  const sleepEyes = (x, y, ink) => `<path d="M${x - 6} ${y}q2.5 2 5 0M${x + 1} ${y}q2.5 2 5 0" stroke="${ink}" stroke-opacity=".55" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  const backdrop = (c, cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.pale}"/>`;
  const shadow = (c, cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="4" fill="${c.ink}" fill-opacity=".07"/>`;
  const bottle = (x, y, rot, fill = 12) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - 8}" y="${y - 3.5}" width="10" height="7" rx="3.5" fill="${NIP}"/><rect x="${x}" y="${y - 7}" width="44" height="14" rx="7" fill="#fff"/><rect x="${x}" y="${y - 7}" width="${fill}" height="14" rx="7" fill="${MILK}"/><rect x="${x + 36}" y="${y - 7}" width="8" height="14" rx="4" fill="#fff" stroke="#000" stroke-opacity=".06"/></g>`;
  const SCENES = {
    tub: (c) => `<svg viewBox="0 0 320 150">
      <rect x="14" y="8" width="292" height="134" rx="22" fill="${c.pale}"/>
      ${shadow(c, 160, 128, 104)}
      <path d="M56 62h208l-15 54a14 14 0 0 1-13.5 10.3H84.5A14 14 0 0 1 71 116Z" fill="#fff"/>
      <path d="M64 92h192l-7 24a14 14 0 0 1-13.5 10.3H84.5A14 14 0 0 1 71 116Z" fill="#cfe8f3"/>
      <path d="M64 92h192" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-opacity=".8"/>
      <path d="M40 132c14-6 34-20 56-40" stroke="#e8bda6" stroke-width="11" stroke-linecap="round" fill="none"/><ellipse cx="99" cy="90" rx="9" ry="6" fill="#e8bda6"/>
      <rect x="112" y="78" width="74" height="22" rx="11" fill="${SK}"/>
      <circle cx="102" cy="80" r="14" fill="${SK}"/>${sleepEyes(102, 80, c.ink)}
      <path d="M274 92v34M270 92h8M270 126h8" stroke="${c.ink}" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`,
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
  // Swaddling, in three steps: the blanket as a diamond, one side across, then snug at the chest and loose at the hips.
  const swBase = c => `${backdrop(c, 80, 58, 50)}<path d="M80 12 128 58 80 104 32 58Z" fill="${c.bg}"/><path d="M60 32h40l-20 16Z" fill="#fff" fill-opacity=".75"/>`;
  const swBaby = (y = 0) => `<rect x="70" y="${44 + y}" width="20" height="38" rx="10" fill="${SK}"/><circle cx="80" cy="${36 + y}" r="10" fill="${SK}"/>`;
  Object.assign(SCENES, {
    swad1: (c) => `<svg viewBox="0 0 160 116">${swBase(c)}${swBaby()}${sleepEyes(80, 36, c.ink)}</svg>`,
    swad2: (c) => `<svg viewBox="0 0 160 116">${swBase(c)}${swBaby()}${sleepEyes(80, 36, c.ink)}<path d="M32 58 94 46 96 84 80 104Z" fill="${c.ink}" fill-opacity=".16"/></svg>`,
    swad3: (c) => `<svg viewBox="0 0 160 116">${backdrop(c, 80, 58, 50)}${shadow(c, 80, 104, 26)}<path d="M66 48c0-6 6-8 14-8s14 2 14 8v26c0 14 6 22 6 26H60c0-4 6-12 6-26Z" fill="${c.bg}"/><path d="M66 56h28" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/><circle cx="80" cy="36" r="10" fill="${SK}"/>${sleepEyes(80, 36, c.ink)}</svg>`
  });
  const PANELS = {
    swaddle: { scenes: [['swad1', '1', 'Diamond, top folded', 'Shoulders below the fold'], ['swad2', '2', 'One side across', 'Arm straight, tucked under'], ['swad3', '3', 'Snug and loose', 'Snug chest, room at the hips']] },
    tub: { scenes: ['tub'], chips: ['About 2 inches of water', 'Warm, about 100°F', 'One hand behind the head and neck'] },
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
    return `<figure class="hub-figure" role="img" aria-label="${label}"><div class="hub-fig-panels" aria-hidden="true">${P.scenes.map(([k, tone, t, sub]) => `<div class="hub-fig-panel">${SCENES[k](c)}<b class="is-${tone}">${tone === 'bad' ? '✕' : tone === 'good' ? '✓' : tone + '.'} ${t}</b><small>${sub}</small></div>`).join('')}</div></figure>`;
  };
  window.hubArt = function (name, cat = 'Feeding') {
    const c = (typeof YEAR_PALETTES !== 'undefined' ? YEAR_PALETTES : {})[cat] || { ink: '#884866', bg: '#f7d9e5', pale: '#fceef3' };
    const draw = ART[name];
    if (!draw) return typeof yearIllustration === 'function' ? yearIllustration(cat, 0) : '';
    return `<svg viewBox="0 0 24 24" data-art="${name}" data-cat="${cat}" fill="none" stroke="${c.ink}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${draw(c)}</svg>`;
  };
  /* Every point on a page gets its own icon. The first use of an icon keeps it; a repeat is swapped
     for one that fits the row's words, or failing that, any icon not yet on the page. */
  const HINTS = [
    [/smoke|carbon monoxide|alarm/i, 'alarm'], [/window/i, 'window'], [/batter|magnet/i, 'battery'], [/coin|small parts|small objects/i, 'coin'],
    [/temperature|fever|thermometer/i, 'thermo'], [/anchor|dresser|bookcase|furniture|\btv/i, 'dresser'], [/\bgate|stairs/i, 'gate'],
    [/regression|waking more/i, 'moon'], [/first aid/i, 'shield'], [/latch|gag/i, 'mouth'],
    [/crib|bassinet|mattress/i, 'crib'], [/your room|room-sharing|in the room/i, 'home'], [/sleep sack|wearable|blanket|swaddl/i, 'sack'],
    [/on (his|her|their|the) back|back for|back to sleep/i, 'back'], [/car seat|the car\b|or swing\b/i, 'car'], [/swipe|bats? at/i, 'ball'], [/sofa|armchair|couch/i, 'sofa'],
    [/pacifier/i, 'pacifier'], [/night|dark/i, 'moon'], [/day from|daylight|curtain|morning/i, 'sun'], [/yawn|wind down|tired|wake window|nap/i, 'clock'],
    [/rock|holding|settle|fall asleep|cuddl|comfort/i, 'heart'], [/book|read|story|picture/i, 'book'], [/song|sing|music|rhyme/i, 'music'],
    [/mirror|faces?\b/i, 'mirror'], [/rattle|toy/i, 'toy'], [/tummy|elbows|floor|mat\b/i, 'mat'], [/roll/i, 'roll'], [/\bsit/i, 'sit'],
    [/crawl|scoot/i, 'crawl'], [/stand|pull(s|ing)? up|cruis|walk|steps/i, 'stand'], [/ball/i, 'ball'], [/block|stack|container|basket|take one out|in and out/i, 'blocks'],
    [/peek|hide|hidden/i, 'peek'], [/wave|clap|gesture|point/i, 'wave'], [/smile|laugh|chuckle/i, 'smile'], [/coo|babbl|sound|talk|voice|word|puppet|chat/i, 'chat'],
    [/look|watch|eyes|follow|see/i, 'eye'], [/hear|listen/i, 'ear'], [/latch|nurs|breast/i, 'mouth'], [/bottle|formula|milk/i, 'bottle'],
    [/diaper|wet/i, 'diaper'], [/vitamin|drop/i, 'drop'], [/peanut|allergen/i, 'peanut'], [/egg/i, 'egg'], [/\bcup/i, 'cup'],
    [/food|meal|spoon|tray|eat/i, 'bowl'], [/bath|tub|wash/i, 'bath'], [/tooth|teeth|gum/i, 'tooth'], [/sun|shade/i, 'sun'], [/nail/i, 'nail'],
    [/cord/i, 'cord'], [/skin|cream|eczema|cradle cap|lotion/i, 'drop'], [/dress|cloth|layer|outfit/i, 'shirt'],
    [/pediatrician|doctor|checkup|call/i, 'steth'], [/gate|stairs|anchor|outlet|safe|choking|first aid/i, 'shield'], [/hand|grasp|reach|explore/i, 'hand']
  ];
  const POOL = ['star', 'leaf', 'heart', 'ball', 'book', 'music', 'sun', 'eye', 'toy', 'blocks', 'clock', 'home'];
  window.hubDistinctIcons = function (root = document.getElementById('main')) {
    if (!root) return;
    const used = new Set();
    root.querySelectorAll('.hub-dot svg[data-art], .hub-tick-art svg[data-art]').forEach(svg => {
      const name = svg.getAttribute('data-art');
      const holder = svg.closest('.hub-row, .hub-tick, button, div') || svg.parentElement;
      const text = (holder.querySelector('b') || holder).textContent + ' ' + ((holder.querySelector('small') || {}).textContent || '');
      const fits = HINTS.filter(([re]) => re.test((holder.querySelector('b') || holder).textContent)).map(([, n]) => n).filter(n => ART[n]);
      // The icon follows the row's words: keep it if the title supports it, otherwise switch to the first icon that fits.
      if (!used.has(name) && (!fits.length || fits.includes(name))) { used.add(name); return; }
      const hint = [...fits, ...HINTS.filter(([re]) => re.test(text)).map(([, n]) => n)].find(n => ART[n] && !used.has(n));
      if (!hint && !used.has(name)) { used.add(name); return; }
      const pick = hint || POOL.find(n => ART[n] && !used.has(n));
      if (!pick) return;
      used.add(pick);
      svg.outerHTML = window.hubArt(pick, svg.getAttribute('data-cat') || 'Feeding');
    });
  };
})();

/* Home: a baby who grows through the year, one picture per month that matches the month's summary.
   Same drawing family as the rest of the app (devMilestoneArt): lying, then propped, sitting, crawling,
   pulling up, waving and, at one year, cruising with a birthday balloon. */
(function () {
  if (typeof devMilestoneArt !== 'function') return;
  const SCENES = [null, 'faces', 'back', 'coo', 'reach', 'hold-toy', 'closed-mouth', 'transfer', 'crawl', 'hide', 'stand', 'wave', 'cruise'];
  const balloon = '<g><path d="M216 66q-5 22 3 44" stroke="#b9a7c7" fill="none"/><ellipse cx="216" cy="46" rx="16" ry="20" fill="#f0bfce"/><path d="m213 66 3 4 3-4Z" fill="#f0bfce"/><text x="216" y="52" text-anchor="middle" font-size="17" font-family="Georgia,serif" fill="#77647f" stroke="none">1</text></g>';
  window.homeMonthArt = homeMonthArt = function (age) {
    const m = Math.max(0, Math.min(12, age | 0)), scene = SCENES[m];
    let art = m === 0 ? homeBabyArt() : devMilestoneArt(scene, true, m, 'Daily rhythm');
    if (m > 0) { // the baby grows: about 80% size at one month, full size at one year, standing on the same ground
      const k = (0.8 + 0.2 * (m - 1) / 11).toFixed(3), t = `translate(${(130 * (1 - k)).toFixed(1)} ${(150 * (1 - k)).toFixed(1)}) scale(${k})`;
      art = art.replace(/(v24H18Z"[^>]*\/>)([\s\S]*)<\/svg>$/, `$1<g transform="${t}">$2</g></svg>`);
    }
    if (m === 12) art = art.replace(/<\/svg>$/, balloon + '</svg>');
    return `<span class="home-month-scene" data-home-art-month="${m}" data-home-art-scene="${scene || 'newborn'}">${art}</span>`;
  };
})();

/* One icon per category, used everywhere the category itself is shown: Categories, Home, the stage
   timeline, Baby's details and questions. Same illustration family as the rest of the app. */
window.CAT_ICON_SCENE = { Development: 4, Feeding: 1, Sleep: 1, Health: 0, Safety: 0, 'Daily rhythm': 0 };
window.catIcon = function (t) { return typeof yearIllustration === 'function' ? yearIllustration(t, CAT_ICON_SCENE[t] ?? 0) : ''; };
