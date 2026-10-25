/* Ahead · small illustrations for the summary and detail screens.
   Same style as the app's icons: thin outline in the category's ink, flat pastel fills, a small gold sparkle. */
(function () {
  const SKIN = '#f7dccb', GOLD = '#f1d697', WHITE = '#fffaf0';
  const spark = (x, y) => `<path d="m${x} ${y - 6} 2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2Z" fill="${GOLD}" stroke="none"/>`;
  const face = (cx, cy, r, mouth) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${SKIN}"/><path d="M${cx - r * .35} ${cy - r * .1}h.01M${cx + r * .35} ${cy - r * .1}h.01" stroke-width="3"/>${mouth}`;
  const ART = {
    head: (c) => `${face(50, 44, 20, `<path d="M43 51q7 5 14 0"/>`)}<path d="M38 82q0-16 12-16t12 16" fill="${c.bg}"/><path d="M44 63v4m12-4v4"/>${spark(76, 22)}`,
    sit: (c) => `${face(50, 30, 13, `<path d="M45 35q5 3 10 0"/>`)}<path d="M38 48q12-8 24 0l3 22H35Z" fill="${c.bg}"/><path d="M30 76q20 8 40 0" fill="none"/><path d="M33 70q-6 4-2 8h38q4-4-2-8" fill="${c.pale}"/>${spark(78, 26)}`,
    mouth: (c) => `${face(42, 50, 20, `<ellipse cx="42" cy="57" rx="4.5" ry="5" fill="#d9907f"/>`)}<path d="M64 62 84 42" stroke-width="3"/><ellipse cx="62" cy="64" rx="7" ry="4.5" transform="rotate(-45 62 64)" fill="${c.pale}"/>${spark(78, 24)}`,
    swallow: (c) => `${face(50, 48, 21, `<path d="M42 55q8 6 16 0"/>`)}<path d="M33 39q3-3 6 0m22 0q3-3 6 0"/><path d="M70 64q6 2 6 8" fill="none"/>${spark(76, 24)}`,
    highchair: (c) => `<path d="M34 22h32v30H34Z" fill="${c.pale}"/><path d="M28 52h44v8H28Z" fill="${c.bg}"/><path d="M36 60 30 86m34-26 6 26M42 60l-2 26m18-26 2 26"/><path d="M44 30v14h12V30" fill="${WHITE}"/>${spark(78, 22)}`,
    bowl: (c) => `<path d="M22 50h56a28 22 0 0 1-56 0Z" fill="${c.pale}"/><path d="M38 72h24v6H38Z" fill="${c.bg}"/><path d="M58 50 74 22" stroke-width="3"/><ellipse cx="76" cy="20" rx="5" ry="3.5" transform="rotate(-60 76 20)" fill="${WHITE}"/>${spark(30, 30)}`,
    lentils: (c) => `<path d="M20 52h60a30 22 0 0 1-60 0Z" fill="${c.pale}"/><path d="M26 52q24-12 48 0" fill="#f2c27b"/>${[[36,47],[46,44],[56,45],[64,48],[42,50],[52,49]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#e39a5c" stroke="none"/>`).join('')}${spark(76, 26)}`,
    meat: (c) => `<path d="M30 66q-8-22 10-34 18-10 30 4 10 14-6 28-16 10-34 2Z" fill="#e7b39a"/><path d="M36 64 22 78" stroke-width="5"/><circle cx="20" cy="80" r="5" fill="${WHITE}"/><path d="M44 46q8-4 14 2"/>${spark(76, 24)}`,
    egg: (c) => `<ellipse cx="50" cy="52" rx="22" ry="27" fill="${WHITE}"/><circle cx="50" cy="56" r="11" fill="#f5c64f"/>${spark(76, 24)}`,
    oats: (c) => `<path d="M22 52h56a28 22 0 0 1-56 0Z" fill="${c.pale}"/><path d="M28 52q22-10 44 0" fill="#efe2c4"/><path d="M40 38q-4-6 0-12m10 12q-4-6 0-12m10 12q-4-6 0-12" fill="none"/>${spark(78, 26)}`,
    avocado: (c) => `<path d="M50 18q14 0 18 22 6 30-18 38-24-8-18-38 4-22 18-22Z" fill="#b9d58c"/><path d="M50 26q10 2 12 20 3 22-12 26-15-4-12-26 2-18 12-20Z" fill="#e7f0c3"/><circle cx="50" cy="56" r="9" fill="#a8774f"/>${spark(78, 22)}`,
    potato: (c) => `<path d="M22 58q4-22 30-26 26-2 28 16 0 18-28 22-30 4-30-12Z" fill="#f0a96d"/><path d="M40 50q6-4 12 0m6 8q5-3 10 0" fill="none"/>${spark(76, 24)}`,
    peanut: (c) => `<path d="M40 22q16-4 18 14-2 8 4 14 10 12-4 26-18 8-26-8-4-10 2-16 4-6 0-14-2-12 6-16Z" fill="#e8c38f"/><path d="M44 34h.01M52 30h.01M48 60h.01M56 66h.01" stroke-width="3"/>${spark(78, 26)}`,
    hand: (c) => `<path d="M36 84V52l-6-12q-2-6 4-6 4 0 6 6l4 8V26q0-5 5-5t5 5v20-24q0-5 5-5t5 5v24-18q0-5 5-5t5 5v36q0 22-20 22H44q-8 0-8-6Z" fill="${SKIN}"/>${spark(80, 24)}`,
    cup: (c) => `<path d="M30 30h40l-5 50H35Z" fill="${c.pale}"/><path d="M33 44h34" /><path d="M34 46q16 6 32 0l-1 12H35Z" fill="#cfe3f5" stroke="none"/>${spark(78, 24)}`,
    clock: (c) => `<circle cx="50" cy="52" r="26" fill="${c.pale}"/><path d="M50 36v16l10 8"/>${spark(78, 24)}`,
    diaper: (c) => `<path d="M22 34h56v8q-4 24-28 30-24-6-28-30Z" fill="${WHITE}"/><path d="M22 42h56" /><path d="M36 52q14 8 28 0" fill="none"/><circle cx="30" cy="38" r="2" fill="${c.bg}"/><circle cx="70" cy="38" r="2" fill="${c.bg}"/>${spark(80, 22)}`,
    drop: (c) => `<path d="M50 18q20 26 20 40a20 20 0 0 1-40 0q0-14 20-40Z" fill="#fbe7a6"/><path d="M42 60q2 8 10 8" fill="none"/>${spark(78, 26)}`,
    plate: (c) => `<circle cx="52" cy="52" r="28" fill="${WHITE}"/><circle cx="52" cy="52" r="18" fill="${c.pale}"/><path d="M18 30v20m-4-20v12m8-12v12M18 50v30M86 30q-6 10 0 20v30"/><circle cx="46" cy="48" r="4" fill="#b9d58c" stroke="none"/><circle cx="57" cy="55" r="4" fill="#f0a96d" stroke="none"/>${spark(80, 20)}`,
    shield: (c) => `<path d="M50 18 76 28v22q0 20-26 32-26-12-26-32V28Z" fill="${c.pale}"/><path d="m40 50 7 7 14-14"/>${spark(80, 22)}`,
    moon: (c) => `<path d="M64 66A26 26 0 1 1 46 22a20 20 0 0 0 18 44Z" fill="${c.pale}"/>${spark(74, 26)}${spark(84, 42)}`
  };
  window.hubArt = function (name, cat = 'Feeding') {
    const c = (typeof YEAR_PALETTES !== 'undefined' ? YEAR_PALETTES : {})[cat] || { ink: '#884866', bg: '#f7d9e5', pale: '#fceef3' };
    const draw = ART[name];
    if (!draw) return typeof yearIllustration === 'function' ? yearIllustration(cat, 0) : '';
    return `<svg viewBox="0 0 100 100" fill="none" stroke="${c.ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${draw(c)}</svg>`;
  };
})();
