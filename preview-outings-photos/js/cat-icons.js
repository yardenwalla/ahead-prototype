/* Category icons, one unified set: the same line weight, a soft fill in each category's own color and
   one gold sparkle in the same spot. Used wherever a category itself is shown (catIcon). */
(function () {
  const FILL = { Development: '#d8d0fa', Feeding: '#f2c6d8', Sleep: '#c3d5f8', Health: '#c5e6d2', Safety: '#f0d9a8', 'Daily rhythm': '#b7def0', 'Out and about': '#f6cdb5', Childcare: '#f3e08c' };
  const SP = '<path d="M19 3.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9Z" fill="#f1cf86" stroke="none"/>';
  const draw = (k, ink, fill) => {
    const S = `fill="${fill}"`, W = 'fill="#fff"';
    return ({
      Development: `<path d="M12 20v-7"/><path d="M12 13c0-3.5-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5Z" ${S}/><path d="M12 11.5c0-3 2.2-5 5.5-5 0 3-2.2 5-5.5 5Z" ${S}/><path d="M8 20h8"/>`,
      Feeding: `<path d="M4.5 12.5h15a7.5 7.5 0 0 1-15 0Z" ${S}/><path d="M9.5 9.5V3.8"/><ellipse cx="9.5" cy="6" rx="1.8" ry="2.6" ${S}/>`,
      Sleep: `<path d="M15.5 18.5A7.5 7.5 0 0 1 10 4.6a7.5 7.5 0 1 0 9 10.3 7.4 7.4 0 0 1-3.5 3.6Z" ${S}/><path d="M9.5 13.5c.6.6 1.6.6 2.2 0"/>`,
      Health: `<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" ${S}/><path d="M7.5 12h2.2l1.2-2.2 1.6 4 1.1-1.8h2.9"/>`,
      Safety: `<path d="M12 3.5 5 6v5.5c0 4.2 3 7.8 7 9 4-1.2 7-4.8 7-9V6Z" ${S}/><path d="m9 12 2.2 2.2L15.2 10"/>`,
      'Daily rhythm': `<path d="M3.5 12h17v1.5a5.5 5.5 0 0 1-5.5 5.5h-6a5.5 5.5 0 0 1-5.5-5.5Z" ${S}/><path d="M6 12V6.5a2 2 0 0 1 3.5-1.3"/><circle cx="12" cy="9.5" r="1.4" ${S}/><circle cx="15" cy="8.8" r="1.8" ${S}/><path d="M7 19l-.8 1.5M17 19l.8 1.5"/>`,
      'Out and about': `<path d="M5 11h12a6 6 0 0 1-12 0Z" ${S}/><path d="M5 11a6 6 0 0 1 6-6v6" ${S}/><path d="M17 11l1.2-4.5H20"/><circle cx="8" cy="19" r="1.6" ${S}/><circle cx="14.5" cy="19" r="1.6" ${S}/>`,
      Childcare: `<path d="M4 11 12 4.5 20 11"/><path d="M6 9.8V20h12V9.8" ${S}/><path d="M12 17s-3-1.8-3-4a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2.2-3 4-3 4Z" ${W}/>`
    })[k];
  };
  const old = window.catIcon;
  window.catIcon = function (t) {
    const p = typeof YEAR_PALETTES !== 'undefined' && YEAR_PALETTES[t], body = p && FILL[t] && draw(t, p.ink, FILL[t]);
    if (!body) return old ? old(t) : '';
    return `<svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke="${p.ink}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}${SP}</svg>`;
  };
  // The selected step on a category timeline shows the same icon.
  if (typeof timelineMarker === 'function') {
    window.timelineMarker = function (topic, selected = false, completed = false) {
      return `<span class="journey-stage-node${selected ? ' has-illustration' : ''}" aria-hidden="true">${selected ? catIcon(topic) : completed ? '✓' : ''}${selected && completed ? '<span class="journey-node-complete">✓</span>' : ''}</span>`;
    };
  }
})();
