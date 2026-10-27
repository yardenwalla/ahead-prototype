/* Ahead · Timeline: each saved moment and the saved toast wear their category's colors. */
/* Timeline: each saved moment wears its category's colors. */
(function () {
  const base = journeyTimeline;
  const catFor = { milestone: 'Development', visit: 'Health' };
  window.journeyTimeline = journeyTimeline = function () {
    const data = journeyData();
    const byId = {}; data.records.forEach(r => { byId[r.id] = catFor[r.type] || 'Development'; });
    return base().replace(/<button class="journey-timeline-entry([^"]*)" onclick="openPage\('event-edit:([^']+)'\)">/g,
      (m, cls, id) => `<button class="journey-timeline-entry${cls}" data-cat="${byId[id] || 'Development'}" style="${yearTheme(byId[id] || 'Development')}" onclick="openPage('event-edit:${id}')">`);
  };
})();

/* The "Saved to Memories" toast uses the saved moment's category. */
(function () {
  const base = journeyNoticeMarkup;
  window.journeyNoticeMarkup = journeyNoticeMarkup = function () {
    const html = base(); if (!html || !journeyNotice) return html;
    const cat = journeyNotice.kind === 'milestone' ? 'Development' : 'Health';
    return html.replace('<section class="journey-notice', `<section data-cat="${cat}" style="${yearTheme(cat)}" class="journey-notice`);
  };
})();

/* Year Ahead was removed: the stage rail on each category page covers the year.
   The tab goes, any leftover link to it is hidden, and old routes open the category page. */
(function () {
  const baseLegacy = chgLegacy;
  window.chgLegacy = chgLegacy = function (p) {
    if (p === 'year') return 'categories';
    if (p.startsWith('year:')) return 'topic:' + p.slice(5);
    return baseLegacy(p);
  };
  window.categoryModes = categoryModes = function () { return ''; };
  const baseRender = render;
  window.render = render = function () {
    baseRender();
    document.querySelectorAll('#nav button').forEach(b => { if (/Year Ahead/.test(b.textContent)) b.remove(); });
    document.querySelectorAll('#main [onclick]').forEach(el => {
      if (/(openPage|navigate)\('year(:[^']*)?'\)/.test(el.getAttribute('onclick'))) el.remove();
    });
  };
})();
