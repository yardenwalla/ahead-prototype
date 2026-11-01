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
    lock: (c) => `<rect x="5.5" y="10.5" width="13" height="10" rx="2" fill="${c.bg}"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v2"/>`,
    plug: (c) => `<rect x="4.5" y="4.5" width="15" height="15" rx="3.5" fill="${c.bg}"/><path d="M10 9.5v2.5M14 9.5v2.5M10 15.5h4"/>`,
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
    notepad: (c) => `<rect x="5.5" y="4" width="13" height="16.5" rx="2" fill="${c.bg}"/><path d="M8.5 2.8v2.6M12 2.8v2.6M15.5 2.8v2.6M8.5 10h7M8.5 13.5h7M8.5 17h4.5"/>`,
    stroller: (c) => `<path d="M5 6.5h7.5a6 6 0 0 1 6 6H5Z" fill="${c.bg}"/><path d="M5 6.5v6h13.5M12.5 6.5V12.5M18.5 12.5v1.5a2 2 0 0 1-2 2H7.5M3 4.5h2"/><circle cx="8" cy="19" r="1.6"/><circle cx="16" cy="19" r="1.6"/>`,
    plane: (c) => `<path d="M10.5 20.5v-1.8l2-1.4v-4.1l-7.5 3.1v-2l7.5-5V5a1.5 1.5 0 0 1 3 0v4.3l7.5 5v2l-7.5-3.1v4.1l2 1.4v1.8L14 19.4Z" transform="translate(-2 0) scale(.92)" fill="${c.bg}"/>`,
    bag: (c) => `<rect x="4.5" y="8" width="15" height="12" rx="2.5" fill="${c.bg}"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8M4.5 13h15M11 13v2h2v-2"/>`,
    fridge: (c) => `<rect x="6" y="3" width="12" height="18" rx="2.5" fill="${c.bg}"/><path d="M6 10h12M9 6v2M9 13v3"/>`,
    snow: (c) => `<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M10 5l2 2 2-2M10 19l2-2 2 2"/>`,
    road: (c) => `<path d="M5 21 10 3h4l5 18Z" fill="${c.bg}"/><path d="M5 21 10 3M19 21 14 3M12 6v2M12 11v2.5M12 16.5v3"/>`,
    carrier: (c) => `<path d="M8 9.5h8l-1 8.5a3 3 0 0 1-3 2.5 3 3 0 0 1-3-2.5Z" fill="${c.bg}"/><circle cx="12" cy="6" r="2.4"/><path d="M8 9.5 6 4M16 9.5l2-5.5"/>`,
    signs: (c) => `<path d="M8.5 13V6.2a1.4 1.4 0 0 1 2.8 0V11m0-6.3a1.4 1.4 0 0 1 2.8 0V11m0-4.8a1.4 1.4 0 0 1 2.8 0v8.3A5.5 5.5 0 0 1 11.4 20h-.6a5 5 0 0 1-3.9-1.9L4.3 14.8a1.5 1.5 0 0 1 2.2-2l2 1.7" fill="${c.bg}"/><path d="M19 3.5c1 .8 1.5 1.8 1.5 3M3.5 6.5c0-1.2.5-2.2 1.5-3"/>`,
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
  // Giving drops in a little milk: drops into an ounce or so, that small bottle first, then the usual feed.
  const smallBottle = (c, x, y) => `<rect x="${x - 14}" y="${y}" width="28" height="44" rx="10" fill="#fff"/><rect x="${x - 14}" y="${y + 30}" width="28" height="14" rx="7" fill="${MILK}"/><path d="M${x - 14} ${y + 30}h28" stroke="${NIP}" stroke-width="1.5"/><rect x="${x - 16}" y="${y - 4}" width="32" height="8" rx="4" fill="${c.bg}"/>`;
  Object.assign(SCENES, {
    dropa: (c) => `<svg viewBox="0 0 160 116">${backdrop(c, 80, 58, 50)}${shadow(c, 80, 102, 24)}${smallBottle(c, 80, 56)}<rect x="76" y="10" width="8" height="24" rx="4" fill="#fff"/><rect x="76" y="20" width="8" height="14" rx="4" fill="${NIP}"/><ellipse cx="80" cy="10" rx="8" ry="7" fill="${c.ink}" fill-opacity=".45"/><path d="M80 38c-3 4-4 6-4 8a4 4 0 0 0 8 0c0-2-1-4-4-8Z" fill="${NIP}"/></svg>`,
    dropb: (c) => `<svg viewBox="0 0 160 116">${backdrop(c, 80, 60, 50)}${shadow(c, 66, 106, 34)}<rect x="44" y="58" width="42" height="48" rx="20" fill="${c.bg}"/><circle cx="64" cy="42" r="17" fill="${SK}"/><path d="M57 40h.01M68 40h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/><g transform="rotate(-8 86 49)"><rect x="78" y="45.5" width="10" height="7" rx="3.5" fill="${NIP}"/><rect x="86" y="42" width="24" height="14" rx="7" fill="#fff"/><rect x="86" y="42" width="8" height="14" rx="4" fill="${MILK}"/></g></svg>`,
    dropc: (c) => `<svg viewBox="0 0 160 116">${backdrop(c, 80, 60, 50)}${shadow(c, 80, 104, 40)}<rect x="52" y="70" width="64" height="30" rx="15" fill="${c.bg}"/><circle cx="58" cy="66" r="17" fill="${SK}"/>${sleepEyes(58, 64, c.ink)}<path d="M100 40c-4-6-13-3-10 4 2 4 10 9 10 9s8-5 10-9c3-7-6-10-10-4Z" fill="${c.ink}" fill-opacity=".35"/></svg>`
  });
  // Out and about: the harness check (front view) and the carrier check.
  Object.assign(SCENES, {
    carseat: (c) => `<svg viewBox="0 0 320 150">
      <rect x="14" y="8" width="292" height="134" rx="22" fill="${c.pale}"/>${shadow(c, 160, 136, 64)}
      <path d="M108 40c0-20 16-28 52-28s52 8 52 28v76c0 14-10 20-24 20h-56c-14 0-24-6-24-20Z" fill="${c.bg}"/>
      <rect x="122" y="70" width="12" height="34" rx="6" fill="${SK}"/><rect x="186" y="70" width="12" height="34" rx="6" fill="${SK}"/>
      <rect x="134" y="62" width="52" height="60" rx="20" fill="#fff"/>
      <rect x="140" y="112" width="14" height="22" rx="7" fill="${SK}"/><rect x="166" y="112" width="14" height="22" rx="7" fill="${SK}"/>
      <circle cx="160" cy="44" r="19" fill="${SK}"/><path d="M152 42h.01M168 42h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="3.4" stroke-linecap="round"/><path d="M155 51q5 3 10 0" stroke="${c.ink}" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M146 62 156 114M174 62l-10 52" stroke="${c.ink}" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>
      <rect x="148" y="78" width="24" height="9" rx="3" fill="${c.ink}"/><rect x="153" y="110" width="14" height="11" rx="3" fill="${c.ink}" fill-opacity=".8"/>
      <path d="M190 82.5h40" stroke="${c.ink}" stroke-width="1.6" stroke-dasharray="3 4" stroke-linecap="round"/>
      <path d="M90 82.5h20" stroke="${c.ink}" stroke-width="1.6" stroke-dasharray="3 4" stroke-linecap="round"/>
      </svg>`,
    carrierfit: (c) => `<svg viewBox="0 0 320 150">
      <rect x="14" y="8" width="292" height="134" rx="22" fill="${c.pale}"/>
      <circle cx="160" cy="32" r="17" fill="#e8bda6"/>
      <path d="M104 86c0-22 18-34 56-34s56 12 56 34v56H104Z" fill="${c.ink}" fill-opacity=".18"/>
      <path d="M142 94 126 58M178 94l16-36" stroke="${c.ink}" stroke-opacity=".55" stroke-width="7" stroke-linecap="round"/>
      <path d="M146 122 124 110 119 130M174 122l22-12 5 20" stroke="${HK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <rect x="138" y="88" width="44" height="46" rx="16" fill="${c.bg}"/>
      <circle cx="160" cy="78" r="14" fill="${SK}"/><path d="M154 77h.01M166 77h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
      </svg>`
  });
  // Strollers: lying flat for little babies, sitting up once steady. Brake marked on the back wheel.
  const strollerBase = (c) => `<rect x="14" y="8" width="292" height="134" rx="22" fill="${c.pale}"/>${shadow(c, 160, 136, 70)}
      <path d="M124 122 150 94M196 122l-24-28M190 94l34-52" stroke="${c.ink}" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/><path d="M218 42h14" stroke="${c.ink}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="124" cy="122" r="12" fill="${c.ink}" fill-opacity=".55"/><circle cx="124" cy="122" r="4" fill="#fff"/><circle cx="196" cy="122" r="12" fill="${c.ink}" fill-opacity=".55"/><circle cx="196" cy="122" r="4" fill="#fff"/>
      <rect x="202" y="112" width="10" height="7" rx="2" fill="${c.ink}"/>`;
  Object.assign(SCENES, {
    stroller: (c) => `<svg viewBox="0 0 320 150">${strollerBase(c)}
      <rect x="104" y="68" width="98" height="30" rx="14" fill="${c.bg}"/><path d="M104 84a36 36 0 0 1 40-36v20h-26c-8 0-14 6-14 16Z" fill="${c.ink}" fill-opacity=".3"/>
      <circle cx="154" cy="68" r="10" fill="${SK}"/>${sleepEyes(154, 68, c.ink)}</svg>`,
    strollerUp: (c) => `<svg viewBox="0 0 320 150">${strollerBase(c)}
      <path d="M116 86h62l4-34h12l2 46H116Z" fill="${c.bg}"/>
      <rect x="154" y="64" width="26" height="30" rx="11" fill="#fff"/><rect x="128" y="84" width="34" height="12" rx="6" fill="#fff"/>
      <circle cx="167" cy="50" r="13" fill="${SK}"/><path d="M162 49h.01M172 49h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/><path d="M163 55q4 2.5 8 0" stroke="${c.ink}" stroke-opacity=".5" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M160 66l3 22M174 66l-3 22" stroke="${c.ink}" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/></svg>`
  });
  // Outgrowing the infant seat: the head within an inch of the top of the shell.
  Object.assign(SCENES, {
    outgrown: (c) => `<svg viewBox="0 0 320 150">
      <rect x="14" y="8" width="292" height="134" rx="22" fill="${c.pale}"/>${shadow(c, 160, 136, 60)}
      <path d="M112 30c0-12 12-18 48-18s48 6 48 18v86c0 14-10 20-24 20h-48c-14 0-24-6-24-20Z" fill="${c.bg}"/>
      <rect x="136" y="56" width="48" height="62" rx="20" fill="#fff"/>
      <circle cx="160" cy="34" r="20" fill="${SK}"/><path d="M152 33h.01M168 33h.01" stroke="${c.ink}" stroke-opacity=".6" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M146 56 156 112M174 56l-10 56" stroke="${c.ink}" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>
      <path d="M214 12v14M209 12h10M209 26h10" stroke="${c.ink}" stroke-width="2" stroke-linecap="round"/><path d="M180 12h28M180 26h28" stroke="${c.ink}" stroke-width="1.4" stroke-dasharray="2 3"/>
      <text x="226" y="23" font-size="12" font-weight="700" fill="${c.ink}" font-family="inherit">Under 1 inch left</text>
      </svg>`
  });
  const PANELS = {
    drops: { scenes: [['dropa', '1', 'A little milk', 'Drops in about 1 oz'], ['dropb', '2', 'Give that first', 'So you know it all went in'], ['dropc', '3', 'Then the usual feed', 'Breast or bottle']] },
    carseat: { scenes: ['carseat'], chips: ['Rear-facing, in the back seat', 'Chest clip level with the armpits', 'Straps snug: no slack to pinch', 'No puffy coat underneath'] },
    carrier: { scenes: ['carrierfit'], chips: ['Face visible, close enough to kiss', 'Chin off the chest', 'Knees up in an M shape', 'Back supported'] },
    stroller: { scenes: ['stroller'], chips: ['Lying flat while little', 'Harness on every time', 'Brakes on when you stop', 'No bags on the handles', 'No blanket over the top'] },
    strollerUp: { scenes: ['strollerUp'], chips: ['Sitting up once steady', 'Harness on every time', 'Brakes on when you stop', 'No bags on the handles', 'No blanket over the top'] },
    outgrown: { scenes: ['outgrown'], chips: ['Head within an inch of the top', 'Or past the height or weight on the label'] },
    swaddle: { scenes: [['swad1', '1', 'Diamond, top folded', 'Shoulders below the fold'], ['swad2', '2', 'One side across', 'Arm straight, tucked under'], ['swad3', '3', 'Snug and loose', 'Snug chest, room at the hips']] },
    tub: { scenes: ['tub'], chips: ['About 2 inches of water', 'Warm, about 100°F', 'One hand behind the head and neck'] },
    crib: { scenes: ['crib'], chips: ['On the back', 'Swaddle or sleep sack', 'Firm, flat mattress', 'Nothing else in the crib', 'Not a sofa or your bed', 'Cool and smoke-free', 'Pacifier, if you like'] },
    pace: { scenes: [['paced', 'good', 'Paced', 'Upright, bottle level'], ['tipped', 'bad', 'Avoid', 'Lying back, bottle tipped up']] },
    sizes: { scenes: [['strips', '1', '6–8 months', 'Strips the size of a finger'], ['pieces', '2', '9 months and up', 'Pea-sized pieces, grapes quartered']] }
  };
  window.hubFigure = function (name, cat = 'Feeding', caption = '') {
    const c = (typeof YEAR_PALETTES !== 'undefined' ? YEAR_PALETTES : {})[cat] || { ink: '#884866', bg: '#f7d9e5', pale: '#fceef3' };
    const P = PANELS[name];
    if (!P) return '';
    const label = caption.replace(/"/g, '&quot;');
    if (P.chips) return `<figure class="hub-figure is-wide" role="img" aria-label="${label}">${SCENES[P.scenes[0]](c).replace('<svg', '<svg aria-hidden="true"')}<div class="hub-fig-chips" aria-hidden="true">${P.chips.map(t => `<span>${t}</span>`).join('')}</div></figure>`;
    return `<figure class="hub-figure" role="img" aria-label="${label}"><div class="hub-fig-panels" aria-hidden="true">${P.scenes.map(([k, tone, t, sub]) => `<div class="hub-fig-panel">${SCENES[k](c)}<b class="is-${tone}">${tone === 'bad' ? '✕' : tone === 'good' ? '✓' : tone + '.'} ${t}</b><small>${sub}</small></div>`).join('')}</div></figure>`;
  };
  /* Baby signs: one card per sign, with the hand shape and its movement drawn in. */
  const HK = '#eec3aa', HL = '#d9a58a';
  const arrow = (x1, y1, x2, y2, ink) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 6, p = (d) => `${(x2 - h * Math.cos(a + d)).toFixed(1)} ${(y2 - h * Math.sin(a + d)).toFixed(1)}`; return `<path d="M${x1} ${y1}L${x2} ${y2}M${p(0.5)}L${x2} ${y2}L${p(-0.5)}" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; };
  const openHand = (x, y, r = 0, flip = false) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${flip ? -1 : 1} 1)"><rect x="-6" y="16" width="12" height="14" rx="5" fill="${HK}"/>${[[-12, 15], [-6, 18], [0, 17], [6, 14]].map(([fx, h]) => `<rect x="${fx}" y="${-1 - h}" width="5" height="${h + 6}" rx="2.5" fill="${HK}"/>`).join('')}<path d="M-6 13L-19 2" stroke="${HK}" stroke-width="7.5" stroke-linecap="round"/><rect x="-12" y="-4" width="23" height="22" rx="9" fill="${HK}"/></g>`;
  const fist = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-6" y="16" width="12" height="14" rx="5" fill="${HK}"/><rect x="-12" y="-6" width="23" height="24" rx="9" fill="${HK}"/>${[-8.5, -2.75, 3, 8.75].map(fx => `<circle cx="${fx - 0.5}" cy="-5" r="3.2" fill="${HK}"/>`).join('')}<rect x="-13" y="3" width="17" height="6" rx="3" fill="${HL}" fill-opacity=".55"/></g>`;
  // Fingers held together on the thumb, pointing right. Mirror it for the other hand.
  const pinch = (x, y, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)"><rect x="-30" y="-6" width="16" height="12" rx="5" fill="${HK}"/><path d="M-18 -10h12c10 0 16 6 18 10-2 4-8 10-18 10h-12a8 8 0 0 1-8-8v-4a8 8 0 0 1 8-8Z" fill="${HK}"/>${[-15, -9, -3].map(k => `<circle cx="${k}" cy="-8" r="3.6" fill="${HK}"/>`).join('')}<path d="M-10 3.5c6 0 14-1 21-3.5" stroke="${HL}" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>`;
  const taps = (x, y, ink) => `<path d="M${x} ${y - 14}v-6M${x - 9} ${y - 10}l-3-4M${x + 9} ${y - 10}l3-4" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`;
  // Baby signs: no drawings. Each card says what the sign means and how to make it, and plays a real person signing it (ASL University).
  const SIGN_LIST = {
    more: ['More', '“I want more.”', 'Tap the fingertips of both hands together.', 'nJwr-yWRdNQ'],
    eat: ['Eat', '“I’m hungry.”', 'Bring your fingertips to your lips.', 'OmylSinUxns'],
    milk: ['Milk', '“I want milk.”', 'Open and close one hand, like a gentle squeeze.', 'quk_XoRtZWk'],
    done: ['All done', '“I’m finished.”', 'Hold your hands up and twist them out, back and forth.', '7xQE2N0z7gM']
  };
  window.hubSigns = function () {
    return `<div class="hub-signs">${Object.values(SIGN_LIST).map(([w, m, how, id]) => `<div class="hub-sign">${window.hubEmbed(id, `The sign for ${w.toLowerCase()}`, 'ASL University', { small: true, loop: true })}<b>${w}</b><span class="hub-sign-means">${m}</span><small>${how}</small></div>`).join('')}</div><p class="hub-embed-credit">${F2('Clips from ASL University (Dr. Bill Vicars). Tap a picture to play it on a loop.')}</p>`;
  };

  // Videos that play right on the page. Nothing loads from YouTube until the parent taps play.
  window.hubEmbed = function (id, title, source, opts = {}) {
    const watch = `https://www.youtube.com/watch?v=${id}`;
    return `<figure class="hub-embed${opts.small ? ' is-small' : ''}"><button class="hub-embed-poster" data-yt="${id}" onclick="hubPlay(this,'${id}',${opts.loop ? 1 : 0})" aria-label="Play video: ${escA(title)}" style="background-image:url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)"><span class="hub-embed-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5Z" fill="currentColor"/></svg></span></button>${opts.small ? '' : `<figcaption><b>${F2(title)}</b><small>Video · ${escA(source)} · <a href="${watch}" target="_blank" rel="noopener">Open on YouTube ↗</a></small></figcaption>`}</figure>`;
  };
  window.hubPlay = function (btn, id, loop) {
    // Find the poster even when called without it (a link that only knows the video id).
    if (!btn || typeof btn.getAttribute !== 'function') btn = document.querySelector(`.hub-embed-poster[data-yt="${id}"]`);
    if (!btn) return;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1${loop ? `&loop=1&playlist=${id}&mute=1&controls=0` : ''}`;
    f.title = btn.getAttribute('aria-label') || 'Video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.className = 'hub-embed-frame';
    btn.replaceWith(f);
  };
  // Picture steps: a big icon per step, a short title and one line. Pass n = false for tiles with no numbers.
  window.hubIconSteps = function (items, cat = 'Feeding', caption = '', n = true) {
    const c = (typeof YEAR_PALETTES !== 'undefined' ? YEAR_PALETTES : {})[cat] || { ink: '#884866', bg: '#f7d9e5', pale: '#fceef3' };
    return `<figure class="hub-figure hub-iconsteps is-${items.length}" role="img" aria-label="${caption.replace(/"/g, '&quot;')}"><div class="hub-iconsteps-row" aria-hidden="true">${items.map(([icon, t, sub], i) => `<div class="hub-iconstep"><span class="hub-iconstep-art" style="background:${c.pale}">${window.hubArt(icon, cat)}</span><b>${n ? `<em>${i + 1}</em>` : ''}${F2(t)}</b>${sub ? `<small>${F2(sub)}</small>` : ''}</div>`).join('')}</div></figure>`;
  };
  const palOf = cat => (typeof YEAR_PALETTES !== 'undefined' ? YEAR_PALETTES : {})[cat] || { ink: '#884866', bg: '#f7d9e5', pale: '#fceef3' };
  const escA = t => String(t).replace(/"/g, '&quot;');
  // Range chart: one row per stage, a bar from lo to hi on a shared scale, Maya's row marked.
  window.hubRangeChart = function ({ title, items, max, nowIndex = -1, cat = 'Feeding', caption = '', note = '' }) {
    const c = palOf(cat);
    return `<figure class="hub-figure hub-range" role="img" aria-label="${escA(caption || title)}" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}"><b class="hub-fig-title">${F2(title)}</b>${items.map(([label, lo, hi, value], i) => `<div class="hub-range-row${i === nowIndex ? ' is-now' : ''}"><span class="hub-range-label">${F2(label)}${i === nowIndex ? `<em>${F2('Maya')}</em>` : ''}</span><span class="hub-range-track"><i style="left:${(lo / max * 100).toFixed(1)}%;width:${Math.max(3, (hi - lo) / max * 100).toFixed(1)}%"></i></span><b class="hub-range-value">${F2(value)}</b></div>`).join('')}${note ? `<small class="hub-fig-note">${F2(note)}</small>` : ''}</figure>`;
  };
  // Column chart: one column per stage, the bar spanning the usual range, so a rise or fall reads at a glance.
  window.hubColumnChart = function ({ title, items, max, nowIndex = -1, cat = 'Feeding', caption = '', note = '', unit = '' }) {
    const c = palOf(cat), W = 320, H = 178, top = 26, base = 132, n = items.length, gap = W / n, bw = Math.min(46, gap * 0.62);
    const y = v => base - (v / max) * (base - top);
    const mids = items.map(([, lo, hi], i) => [gap * i + gap / 2, y((lo + hi) / 2)]);
    const bars = items.map(([label, lo, hi, value], i) => {
      const x = gap * i + gap / 2, isNow = i === nowIndex, lines = String(label).split('|');
      // A full column up to the top of the range; the lighter cap is the range itself.
      return `<rect x="${(x - bw / 2).toFixed(1)}" y="${y(hi).toFixed(1)}" width="${bw.toFixed(1)}" height="${(base - y(hi)).toFixed(1)}" rx="8" fill="${isNow ? c.ink : c.bg}"/>`
        + `<text x="${x.toFixed(1)}" y="${(y(hi) - 7).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${c.ink}" font-family="inherit">${value}</text>`
        + lines.map((l, k) => `<text x="${x.toFixed(1)}" y="${base + 17 + k * 13}" text-anchor="middle" font-size="11" ${isNow ? 'font-weight="700"' : ''} fill="${c.ink}" fill-opacity="${isNow ? 1 : 0.7}" font-family="inherit">${l}</text>`).join('')
        + (isNow ? `<rect x="${(x - 22).toFixed(1)}" y="${base + 17 + lines.length * 13 - 7}" width="44" height="16" rx="8" fill="${c.ink}"/><text x="${x.toFixed(1)}" y="${base + 17 + lines.length * 13 + 5}" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fff" font-family="inherit">${F2('Maya')}</text>` : '');
    }).join('');
    const trend = `<path d="M${mids.map(([x, yy]) => `${x.toFixed(1)} ${yy.toFixed(1)}`).join('L')}" stroke="${c.ink}" stroke-opacity=".35" stroke-width="1.6" stroke-dasharray="3 4" fill="none"/>`;
    return `<figure class="hub-figure hub-columns" role="img" aria-label="${escA(caption || title)}"><b class="hub-fig-title">${F2(title)}</b><svg viewBox="0 0 ${W} ${H + (nowIndex >= 0 ? 14 : 0)}" aria-hidden="true"><path d="M0 ${base}H${W}" stroke="${c.ink}" stroke-opacity=".15"/>${bars}</svg>${note ? `<small class="hub-fig-note">${F2(note)}</small>` : ''}</figure>`;
  };
  // Timeline bar: a scale with a shaded window ("usually happens here") and an optional "Maya now" dot.
  window.hubWindowBar = function ({ title, from, to, band, ticks, now = null, cat = 'Sleep', caption = '', note = '', zones = null }) {
    const c = palOf(cat), pct = v => ((Math.max(from, Math.min(to, v)) - from) / (to - from) * 100).toFixed(1);
    const shade = zones ? zones.map(([a, b, label, tone]) => `<i class="is-${tone || 'band'}" style="left:${pct(a)}%;width:${(pct(b) - pct(a)).toFixed(1)}%"><span>${F2(label)}</span></i>`).join('')
      : `<i class="is-band" style="left:${pct(band[0])}%;width:${(pct(band[1]) - pct(band[0])).toFixed(1)}%"><span>${F2(band[2])}</span></i>`;
    return `<figure class="hub-figure hub-window" role="img" aria-label="${escA(caption || title)}" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}">${title ? `<b class="hub-fig-title">${F2(title)}</b>` : ''}<div class="hub-window-track">${shade}${now !== null && now >= from && now <= to ? `<b class="hub-window-now" style="left:${pct(now)}%"><span>${F2('Maya now')}</span></b>` : ''}</div><div class="hub-window-ticks">${ticks.map(([v, l]) => `<span style="left:${pct(v)}%">${F2(l)}</span>`).join('')}</div>${note ? `<small class="hub-fig-note">${F2(note)}</small>` : ''}</figure>`;
  };
  // A scale from one end to the other, with options placed along it (each one tappable).
  window.hubScale = function ({ title, left, right, items, cat = 'Sleep', caption = '' }) {
    const c = palOf(cat);
    return `<figure class="hub-figure hub-scale" role="img" aria-label="${escA(caption || title)}" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}"><b class="hub-fig-title">${F2(title)}</b><div class="hub-scale-ends"><span>${F2(left)}</span><span>${F2(right)}</span></div><div class="hub-scale-bar"></div><div class="hub-scale-items">${items.map(([name, sub, go], i) => `<button class="hub-scale-item" style="--k:${items.length > 1 ? (i / (items.length - 1)).toFixed(2) : 1}" onclick="${go}"><span><b>${F2(name)}</b><small>${F2(sub)}</small></span><em aria-hidden="true">›</em></button>`).join('')}</div><small class="hub-scale-hint">${F2('Swipe to see all ' + items.length)}</small></figure>`;
  };
  // A day as a line from morning to evening, with an icon at each moment.
  window.hubDayMarkers = function ({ title, events, from = 6 * 60, to = 20 * 60, cat = 'Feeding', caption = '', note = '' }) {
    const c = palOf(cat), pct = v => ((v - from) / (to - from) * 100).toFixed(1), clock = v => { const h = Math.floor(v / 60), mm = v % 60; return `${h % 12 || 12}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${h < 12 ? 'am' : 'pm'}`; };
    return `<figure class="hub-figure hub-daymarks" role="img" aria-label="${escA(caption || title)}" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}"><b class="hub-fig-title">${F2(title)}</b><ol class="hub-daymarks-list">${events.map(([t, icon, label]) => `<li><i>${window.hubArt(icon, cat)}</i><time>${clock(t)}</time><span>${F2(label)}</span></li>`).join('')}</ol>${note ? `<small class="hub-fig-note">${F2(note)}</small>` : ''}</figure>`;
  };
  // Stages in a row with arrows between them, the current one marked.
  window.hubStageStrip = function ({ title, items, nowIndex = -1, cat = 'Feeding', caption = '', numbered = false }) {
    const c = palOf(cat);
    return `<figure class="hub-figure hub-strip" role="img" aria-label="${escA(caption || title)}" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}"><b class="hub-fig-title">${F2(title)}</b><div class="hub-strip-row is-${items.length}">${items.map(([icon, label, when], i) => `<div class="hub-strip-step${i === nowIndex ? ' is-now' : ''}">${i === nowIndex ? `<em>${F2('Maya')}</em>` : ''}<span class="hub-strip-art${numbered ? ' is-num' : ''}">${numbered ? i + 1 : window.hubArt(icon, cat)}</span><b>${F2(label)}</b><small>${F2(when)}</small></div>`).join('')}</div></figure>`;
  };
  // Tiles by age band, Maya's band marked. items: [label, big, small]
  window.hubAgeTiles = function ({ title, items, nowIndex = -1, cat = 'Health', caption = '', note = '', stack = false }) {
    const c = palOf(cat);
    return `<figure class="hub-figure hub-agetiles is-${items.length}${stack ? ' is-stack' : ''}" role="img" aria-label="${escA(caption || title)}" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}">${title ? `<b class="hub-fig-title">${F2(title)}</b>` : ''}<div class="hub-agetiles-row">${items.map(([a, big, small], i) => `<div class="${i === nowIndex ? 'is-now' : ''}">${i === nowIndex ? `<em>${F2('Maya')}</em>` : ''}<small>${F2(a)}</small><b>${F2(big)}</b><p>${F2(small)}</p></div>`).join('')}</div>${note ? `<small class="hub-fig-note">${F2(note)}</small>` : ''}</figure>`;
  };
  const F2 = t => (window.__hub && window.__hub.F ? window.__hub.F(t) : t);
  window.hubArt = function (name, cat = 'Feeding') {
    const c = (typeof YEAR_PALETTES !== 'undefined' ? YEAR_PALETTES : {})[cat] || { ink: '#884866', bg: '#f7d9e5', pale: '#fceef3' };
    const draw = ART[name];
    if (!draw) return typeof yearIllustration === 'function' ? yearIllustration(cat, 0) : '';
    return `<svg viewBox="0 0 24 24" data-art="${name}" data-cat="${cat}" fill="none" stroke="${c.ink}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${draw(c)}</svg>`;
  };
  /* Every point on a page gets its own icon. The first use of an icon keeps it; a repeat is swapped
     for one that fits the row's words, or failing that, any icon not yet on the page. */
  const HINTS = [
    [/smoke|carbon monoxide|alarm/i, 'alarm'], [/medicine|cleaning|lock away/i, 'lock'], [/outlet|socket/i, 'plug'], [/window/i, 'window'], [/batter|magnet/i, 'battery'], [/coin|small parts|small objects/i, 'coin'],
    [/temperature|fever|thermometer/i, 'thermo'], [/anchor|dresser|bookcase|furniture|\btv/i, 'dresser'], [/\bgate|stairs/i, 'gate'],
    [/regression|waking more/i, 'moon'], [/first aid/i, 'shield'], [/latch|gag/i, 'mouth'],
    [/crib|bassinet|mattress/i, 'crib'], [/your room|room-sharing|in the room/i, 'home'], [/sleep sack|wearable|blanket|swaddl/i, 'sack'],
    [/on (his|her|their|the) back|back for|back to sleep/i, 'back'], [/car seat|the car\b|or swing\b/i, 'car'], [/swipe|bats? at/i, 'ball'], [/sofa|armchair|couch/i, 'sofa'],
    [/pacifier/i, 'pacifier'], [/night|dark/i, 'moon'], [/day from|daylight|curtain|morning/i, 'sun'], [/yawn|wind down|tired|wake window|nap/i, 'clock'],
    [/rock|holding|settle|fall asleep|cuddl|comfort/i, 'heart'], [/book|read|story|picture/i, 'book'], [/song|sing|music|rhyme|tune/i, 'music'],
    [/mirror|faces?\b/i, 'mirror'], [/rattle|toy/i, 'toy'], [/tummy|elbows|floor|mat\b/i, 'mat'], [/roll/i, 'roll'], [/\bsit/i, 'sit'],
    [/crawl|scoot/i, 'crawl'], [/stand|pull(s|ing)? up|cruis|walk|steps/i, 'stand'], [/ball/i, 'ball'], [/block|stack|container|basket|take one out|in and out/i, 'blocks'],
    [/peek|hide|hidden/i, 'peek'], [/wave|clap|gesture|point/i, 'wave'], [/smile|laugh|chuckle/i, 'smile'], [/coo|babbl|sound|talk|voice|word|puppet|chat/i, 'chat'],
    [/look|watch|eyes|follow|see/i, 'eye'], [/hear|listen/i, 'ear'], [/latch|nurs|breast/i, 'mouth'], [/bottle|formula|milk/i, 'bottle'],
    [/diaper|wet/i, 'diaper'], [/vitamin|drop/i, 'drop'], [/peanut|allergen/i, 'peanut'], [/egg/i, 'egg'], [/\bcup/i, 'cup'],
    [/food|meal|spoon|tray|eat/i, 'bowl'], [/bath|tub|wash/i, 'bath'], [/tooth|teeth|gum/i, 'tooth'], [/sun|shade/i, 'sun'], [/nail/i, 'nail'],
    [/cord/i, 'cord'], [/skin|cream|eczema|cradle cap|lotion/i, 'drop'], [/dress|cloth|layer|outfit/i, 'shirt'],
    [/pediatrician|doctor|checkup|call/i, 'steth'], [/safe|choking|first aid/i, 'shield'], [/hand|grasp|reach|explore/i, 'hand']
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

/* Every inner page opens with a large icon. A page that doesn't name one gets one that fits its title,
   or its category's own icon, so no page looks like a different template. */
window.hubPageIcon = function (cat, title) {
  const t = String(title || '').toLowerCase();
  const pick = [[/fever|sick|temperature/, 'thermo'], [/cold|stuffy|nose/, 'drop'], [/tooth|teeth|gum/, 'tooth'], [/sun/, 'sun'], [/bath|tub/, 'bath'], [/sign/, 'signs'],
    [/sleep|nap|night|bed/, 'moon'], [/swing|bouncer|seat|gate|proof|safe/, 'shield'], [/feed|food|meal|milk|bottle|solid/, 'bowl'], [/play|idea|game|toy/, 'hand'],
    [/checkup|visit|vaccine|doctor/, 'steth'], [/you|parent|feel/, 'heart'], [/ask|question/, 'chat'], [/car|stroller|carrier|outing|trip|fly/, 'stroller']].find(([r]) => r.test(t));
  const fallback = { Development: 'smile', Feeding: 'bowl', Sleep: 'moon', Health: 'steth', Safety: 'shield', 'Daily rhythm': 'bath', 'Out and about': 'stroller' }[cat] || 'star';
  return pick ? pick[1] : fallback;
};
