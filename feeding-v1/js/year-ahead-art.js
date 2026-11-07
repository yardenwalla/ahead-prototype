/* Ahead · Timeline illustrations. Home shows the baby growing; Timeline shows what's coming, so each month
   card gets one small object for its headline change (a bowl for solids, little shoes for first steps),
   drawn in the app's soft palette and outline. A cake marks the first birthday. */
(function () {
  const O = '#77647f', S = `stroke="${O}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;
  const C = { cream: '#fff9f1', rose: '#f0bfce', mint: '#b7e3d7', lav: '#c9bdec', blue: '#c3d7fb', sun: '#f8dc8c', peach: '#f6cdb0', cheek: '#eaa7ac', brown: '#d9b79c' };
  const star = (x, y, r = 4) => `<path d="M${x} ${y - r}l${r * .3} ${r * .7} ${r * .7} ${r * .3} -${r * .7} ${r * .3} -${r * .3} ${r * .7} -${r * .3} -${r * .7} -${r * .7} -${r * .3} ${r * .7} -${r * .3}Z" fill="${C.sun}" stroke="none"/>`;
  const face = (x, y, k = 1) => `<g ${S} fill="none"><path d="M${x - 6 * k} ${y}q1.5 -2 3 0M${x + 3 * k} ${y}q1.5 -2 3 0M${x - 4 * k} ${y + 6 * k}q4 4 8 0"/></g><circle cx="${x - 9 * k}" cy="${y + 4 * k}" r="${2.6 * k}" fill="${C.cheek}" opacity=".7"/><circle cx="${x + 9 * k}" cy="${y + 4 * k}" r="${2.6 * k}" fill="${C.cheek}" opacity=".7"/>`;
  const ART = {
    // A pacifier: the early weeks
    crying: `<g ${S}><path d="M40 24c-11 0-19 6-19 12s8 9 19 9 19-3 19-9-8-12-19-12Z" fill="${C.rose}"/><circle cx="40" cy="35" r="5" fill="${C.cream}"/><path d="M40 45v6" /><circle cx="40" cy="60" r="9" fill="none"/></g>`,
    // A smiling sun: first smiles
    smile: `<g ${S}><path d="M40 13v6M40 61v6M13 40h6M61 40h6M21 21l4 4M55 55l4 4M59 21l-4 4M25 55l-4 4" /><circle cx="40" cy="40" r="15" fill="${C.sun}"/></g>${face(40, 38, .9)}`,
    // Moon and stars: longer nights
    nights: `<g ${S}><path d="M47 18a22 22 0 1 0 15 32 18 18 0 0 1-15-32Z" fill="${C.blue}"/></g>${star(58, 22, 5)}${star(64, 36, 3.5)}${star(22, 20, 3)}`,
    // An alarm clock: more waking
    regress: `<g ${S}><path d="M24 26l-6-6M56 26l6-6M28 62l-4 5M52 62l4 5"/><circle cx="40" cy="43" r="19" fill="${C.lav}"/><circle cx="40" cy="43" r="13" fill="${C.cream}"/><path d="M40 35v8l5 4"/><path d="M19 22a6 6 0 0 1 9-4M61 22a6 6 0 0 0-9-4" fill="${C.rose}"/></g>`,
    // A beach ball: rolling
    roll: `<g ${S}><circle cx="40" cy="40" r="22" fill="${C.cream}"/><path d="M40 18A22 22 0 0 0 40 62C29 50 29 30 40 18Z" fill="${C.rose}"/><path d="M40 18A22 22 0 0 1 40 62C51 50 51 30 40 18Z" fill="${C.mint}"/></g><circle cx="40" cy="40" r="4" fill="${C.sun}" stroke="${O}" stroke-width="2.2"/>`,
    // A bowl and spoon: starting solids
    solids: `<g ${S}><path d="M50 14l-7 22" /><ellipse cx="51" cy="13" rx="4" ry="6" transform="rotate(18 51 13)" fill="${C.cream}"/><path d="M16 38h48c0 13-10 22-24 22S16 51 16 38Z" fill="${C.rose}"/><path d="M30 60h20" /></g><path d="M22 38q5-6 10-1 4-5 9 0 5-5 10 0 4-4 8 1" fill="${C.sun}" stroke="${O}" stroke-width="2.2" stroke-linejoin="round"/>`,
    // Sun behind a cloud: two naps
    twonaps: `<g ${S}><circle cx="48" cy="30" r="12" fill="${C.sun}"/><path d="M48 12v-2M64 30h2M60 18l2-2"/><path d="M22 56h34a9 9 0 0 0 0-18 12 12 0 0 0-23 2 8 8 0 0 0-11 16Z" fill="${C.cream}"/></g>`,
    // Stacked blocks: crawling and floor play
    crawl: `<g ${S}><rect x="14" y="42" width="22" height="22" rx="4" fill="${C.blue}"/><rect x="40" y="42" width="22" height="22" rx="4" fill="${C.mint}"/><rect x="27" y="17" width="22" height="22" rx="4" fill="${C.rose}" transform="rotate(-6 38 28)"/></g><text x="25" y="58" text-anchor="middle" font-size="12" font-weight="700" fill="${O}" font-family="Georgia,serif">A</text><text x="51" y="58" text-anchor="middle" font-size="12" font-weight="700" fill="${O}" font-family="Georgia,serif">B</text><text x="38" y="33" text-anchor="middle" font-size="12" font-weight="700" fill="${O}" font-family="Georgia,serif" transform="rotate(-6 38 28)">C</text>`,
    // A stacking ring toy: sitting up
    sit: `<g ${S}><path d="M40 14v44" /><circle cx="40" cy="14" r="4" fill="${C.sun}"/><rect x="22" y="54" width="36" height="9" rx="4.5" fill="${C.lav}"/><rect x="25" y="44" width="30" height="10" rx="5" fill="${C.blue}"/><rect x="28" y="35" width="24" height="9" rx="4.5" fill="${C.mint}"/><rect x="31" y="26" width="18" height="9" rx="4.5" fill="${C.rose}"/></g>`,
    // A happy tooth: the first tooth
    tooth: `<g ${S}><path d="M26 20c5-4 10-2 14 0 4-2 9-4 14 0 5 5 3 14 1 20l-3 18c-1 4-6 4-6 0l-2-10c-1-3-5-3-6 0l-2 10c0 4-5 4-6 0l-3-18c-2-6-4-15-1-20Z" fill="${C.cream}"/></g>${face(40, 32, .7)}${star(63, 18, 4)}`,
    // Avocado half: textures and finger foods
    finger: `<g ${S}><path d="M40 12c-12 0-17 16-21 26-4 13 5 26 21 26s25-13 21-26C57 28 52 12 40 12Z" fill="${C.mint}"/><path d="M40 20c-8 0-12 11-15 19-3 10 4 18 15 18s18-8 15-18c-3-8-7-19-15-19Z" fill="#e6f4d0"/><circle cx="40" cy="44" r="8" fill="${C.brown}"/></g>`,
    // A car seat: the next seat
    carseat: `<g ${S}><path d="M24 16c-4 0-6 4-5 8l6 28c1 5 4 8 9 8h22c4 0 6-3 6-6s-2-6-6-6H38L32 21c-1-3-4-5-8-5Z" fill="${C.blue}"/><path d="M28 30l6 18M24 64h36"/><path d="M20 30C26 10 56 14 58 46" fill="none"/><path d="M50 48c2-6 8-6 10 0" fill="none"/></g>`,
    // A teddy bear: separation anxiety
    sep: `<g ${S}><circle cx="24" cy="24" r="8" fill="${C.brown}"/><circle cx="56" cy="24" r="8" fill="${C.brown}"/><circle cx="40" cy="42" r="21" fill="${C.brown}"/><ellipse cx="40" cy="50" rx="9" ry="7" fill="${C.cream}"/><path d="M38 47h4l-2 2Z" fill="${O}"/></g><circle cx="33" cy="38" r="2" fill="${O}"/><circle cx="47" cy="38" r="2" fill="${O}"/><circle cx="28" cy="47" r="3" fill="${C.cheek}" opacity=".7"/><circle cx="52" cy="47" r="3" fill="${C.cheek}" opacity=".7"/>`,
    // A crib: pulling up to stand
    pull: `<g ${S}><path d="M14 22v42M66 22v42" /><rect x="14" y="30" width="52" height="24" rx="2" fill="${C.cream}"/><path d="M24 30v24M34 30v24M44 30v24M54 30v24"/><path d="M14 54h52" /><path d="M10 22h8M62 22h8" /></g><path d="M20 49h40" stroke="${C.lav}" stroke-width="5" stroke-linecap="round"/>`,
    // A speech bubble: first words
    words: `<g ${S}><path d="M18 18h44c4 0 6 2 6 6v20c0 4-2 6-6 6H38l-12 10v-10h-8c-4 0-6-2-6-6V24c0-4 2-6 6-6Z" fill="${C.lav}"/></g><text x="40" y="39" text-anchor="middle" font-size="14" font-weight="700" fill="${O}" font-family="Georgia,serif">mama</text>`,
    // A cup of milk: milk at 12 months
    milk: `<g ${S}><path d="M46 12l-4 14" /><path d="M22 24h36l-4 36c0 3-3 5-6 5H32c-3 0-6-2-6-5Z" fill="${C.cream}"/><path d="M24 36h32" /></g><path d="M25.5 37.5h29l-2.8 21.5c0 2-2 3.5-4.5 3.5H33c-2.5 0-4.5-1.5-4.5-3.5Z" fill="${C.blue}" opacity=".55"/>`,
    // Little shoes: first steps
    steps: `<g ${S}><path d="M16 38c0-6 4-9 9-9s7 3 7 8v6c3 1 9 3 9 9 0 4-3 6-7 6H22c-4 0-6-2-6-6Z" fill="${C.rose}"/><path d="M40 28c0-6 4-9 9-9s7 3 7 8v6c3 1 9 3 9 9 0 4-3 6-7 6H46c-4 0-6-2-6-6Z" fill="${C.rose}" transform="translate(0 -4)"/><path d="M16 52h25M40 44h25" /></g>`,
    // A pillow with a Z: one nap
    onenap: `<g ${S}><path d="M16 36c0-8 4-10 10-10h28c6 0 10 2 10 10v6c0 8-4 10-10 10H26c-6 0-10-2-10-10Z" fill="${C.lav}"/><path d="M14 30l4 4M66 30l-4 4M14 50l4-4M66 50l-4-4"/></g><text x="56" y="22" font-size="14" font-weight="700" fill="${O}" font-family="Georgia,serif">z</text><text x="64" y="14" font-size="10" font-weight="700" fill="${O}" font-family="Georgia,serif">z</text>`,
    // A stethoscope: a checkup month
    checkup: `<g ${S} fill="none"><path d="M24 14v14c0 9 7 15 16 15s16-6 16-15V14"/><path d="M40 43v8c0 7 6 11 12 11s10-4 10-10v-4"/></g><circle cx="62" cy="44" r="6" fill="${C.mint}" stroke="${O}" stroke-width="2.2"/><circle cx="24" cy="13" r="3" fill="${O}"/><circle cx="56" cy="13" r="3" fill="${O}"/>`,
    // A cake with one candle: the first birthday
    birthday: `<g ${S}><path d="M40 16v12" /><path d="M40 8c3 3 3 6 0 7-3-1-3-4 0-7Z" fill="${C.sun}"/><rect x="18" y="28" width="44" height="14" rx="4" fill="${C.rose}"/><rect x="14" y="42" width="52" height="20" rx="4" fill="${C.cream}"/><path d="M14 50c5 4 9 4 13 0s9-4 13 0 9 4 13 0 9-4 13 0" fill="none"/></g>`
  };
  const PALE = { Development: '#efedff', Feeding: '#fceef3', Sleep: '#edf2fe', Health: '#eef8f1', Safety: '#fcf3e4', 'Daily rhythm': '#ecf6fa', 'Out and about': '#fcf3e4' };
  // id: a change id, 'checkup' or 'birthday'; cat picks the soft background
  window.yaArt = function (id, cat) {
    const art = ART[id] || ART.checkup;
    return `<span class="ya-art" style="background:${PALE[cat] || '#f6f1fb'}"><svg viewBox="0 0 80 80" aria-hidden="true">${art}</svg></span>`;
  };
})();
