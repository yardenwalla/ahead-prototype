/* Ahead · Year Ahead, in the same visual language as the rest of the app.
   Hub: built like the Categories tab (eyebrow, title, directory rows).
   Category year: the category-page header, the experience hero, then one consistent
   list of stages with "where she is now" highlighted. Sleep and Feeding use the new
   stage model; the others reuse their existing stage content. */
(function () {
  const DATA = window.AHEAD_CHANGES;
  const SUMMARY = { Development: 'Faces → first words', Feeding: 'Milk → family meals', Sleep: 'Around the clock → two naps', Health: 'First checkup → first birthday', Safety: 'First setup → pulling up', 'Daily rhythm': 'First responses → shared games' };
  const T = s => esc(String(s == null ? '' : s)).replace(/Maya/g, name());

  /* ---------- hub ---------- */
  window.yearHub = yearHub = function () {
    return `<div class="year-hub-page"><div class="eyebrow">The first year · ${name()}</div><h1>Year Ahead</h1><p class="year-hub-lede">How each part of the first year unfolds, one stage into the next.</p><section class="category-directory" aria-label="The first year by category">${TOPICS.map(([t]) => `<button class="category-directory-row" data-cat="${t}" style="${yearTheme(t)}" onclick="openPage('year:${t}')"><span class="directory-art" aria-hidden="true">${yearIllustration(t, 1)}</span><span class="directory-copy"><b>${displayTopic(t)}</b><small>${SUMMARY[t]}</small></span><span class="directory-chevron" aria-hidden="true">${icon('arrow')}</span></button>`).join('')}</section><p class="exp-footer">Typical changes, not deadlines. Your baby’s abilities and care team help guide timing.</p></div>`;
  };

  /* ---------- stages for each category ---------- */
  function changesStops(cat) {
    const cur = chgStageIndex(cat);
    return { stops: DATA[cat].CH.map((c, i) => ({ when: c.when.replace(/^Usually /, ''), title: c.title, body: c.lead, go: `openPage('chg:${cat}:s:${i}')`, current: i === cur })),
      phases: DATA[cat].EV.map((e, i) => ({ when: e.when.replace(/^Usually /, ''), title: e.title, body: e.signs, go: `openPage('chg:${cat}:e:${i}')` })) };
  }
  // Reuse the existing year content for the other categories, read from their own markup.
  const ORIGINAL = categoryYear;
  function legacyStops(t) {
    const box = document.createElement('div'); box.innerHTML = ORIGINAL(t);
    const txt = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
    const stops = [...box.querySelectorAll('.development-year-stop, .journey-timeline-entry, .year-stop')].map(b => {
      const when = txt(b.querySelector('small'));
      return { when: when.replace(/\s*·\s*Your current guide.*$/i, ''), title: txt(b.querySelector('b, strong')), body: txt(b.querySelector('p')) || (b.querySelectorAll('small')[1] ? txt(b.querySelectorAll('small')[1]) : ''),
        go: b.getAttribute('onclick') || '', current: b.classList.contains('is-relevant') || b.classList.contains('is-current') || /current guide/i.test(when) };
    });
    const lede = txt(box.querySelector('.journey-lede, .year-title p'));
    const title = (box.querySelector('h1') || {}).innerHTML || displayTopic(t);
    const notes = [...box.querySelectorAll('.development-source-note, .year-caveat, .journey-footnote, .health-small')].map(txt).filter(Boolean);
    const resource = box.querySelector('a.guide-resource-row, .development-examples');
    const sources = box.querySelector('details.sources-disclosure');
    return { stops, lede, title: title.replace(/<br\s*\/?>/g, ' '), notes, resource: resource ? resource.outerHTML : '', sources: sources ? sources.outerHTML : '' };
  }

  const COPY = {
    Sleep: ['Sleep changes, stage by stage', 'Sleep goes through a few big changes in the first year. Each stage explains what’s happening and what helps.'],
    Feeding: ['From milk to family meals', 'Feeding moves from milk alone to meals at the table. Solids start when she’s ready, not on a set date.']
  };

  function header(t) {
    const backControl = backButton().replace('class="back"', 'class="monthly-back"').replace(/(<\/svg>)[\s\S]*?<\/button>/, '$1</button>');
    return `<div class="category-page-header"><div class="monthly-page-header">${backControl}<div><h1>${displayTopic(t)}</h1><p>The first year</p></div><span aria-hidden="true"></span></div></div>`;
  }
  function stopList(stops) {
    return `<ol class="yr-stops">${stops.map(s => `<li><button class="yr-stop ${s.current ? 'is-now' : ''}" onclick="${s.go}"><span class="yr-node" aria-hidden="true"></span><span class="yr-copy"><small>${esc(s.when.charAt(0).toUpperCase() + s.when.slice(1))}${s.current ? ` · Where ${name()} is now` : ''}</small><b>${T(s.title)}</b>${s.body ? `<span>${T(s.body)}</span>` : ''}</span><span class="yr-chev" aria-hidden="true">${icon('arrow')}</span></button></li>`).join('')}</ol>`;
  }

  window.categoryYear = categoryYear = function (t) {
    const isNew = t === 'Sleep' || t === 'Feeding';
    const d = isNew ? changesStops(t) : legacyStops(t);
    const [title, lede] = isNew ? COPY[t] : [d.title, d.lede];
    let h = `<div class="quiet-category parent-guide category-year yr-page" data-year="${t}" style="${yearTheme(t)}">${header(t)}`;
    h += `<header class="experience-hero"><div class="experience-hero-copy"><div class="eyebrow">The first year</div><h2>${title}</h2></div><span class="experience-hero-art" aria-hidden="true">${yearIllustration(t, 1)}</span>${lede ? `<p class="experience-hero-description">${T(lede)}</p>` : ''}</header>`;
    h += `<section class="yr-section"><h3 class="yr-h3">${t === 'Health' ? 'Routine checkups' : 'Stages'}</h3>${stopList(d.stops)}</section>`;
    if (d.phases && d.phases.length) h += `<section class="yr-section"><h3 class="yr-h3">Also comes and goes</h3><p class="yr-sub">These show up on top of a stage for a few weeks.</p>${d.phases.map(p => `<button class="guide-resource-row" onclick="${p.go}"><span class="guide-resource-mark" aria-hidden="true">${icon(t === 'Sleep' ? 'sleep' : 'feed')}</span><span><b>${T(p.title)}</b><small>${esc(p.when)} · ${T(p.body)}</small></span><span aria-hidden="true">→</span></button>`).join('')}</section>`;
    if (d.resource) h += d.resource;
    if (isNew) h += `<details class="sources-disclosure"><summary>Sources behind this guide <span aria-hidden="true">＋</span></summary><div class="source-line">${DATA[t].SOURCES.map(([n, u]) => `<p><a href="${u}" target="_blank" rel="noopener">${esc(n)} ↗</a></p>`).join('')}</div></details>`;
    else if (d.sources) h += d.sources;
    h += `<p class="exp-footer">${(d.notes && d.notes[0]) ? T(d.notes[0]) : 'Typical changes, not deadlines. Every baby moves at their own pace.'} Pediatric review pending.</p></div>`;
    return h;
  };
})();

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

/* The "Saved to Timeline" toast uses the saved moment's category. */
(function () {
  const base = journeyNoticeMarkup;
  window.journeyNoticeMarkup = journeyNoticeMarkup = function () {
    const html = base(); if (!html || !journeyNotice) return html;
    const cat = journeyNotice.kind === 'milestone' ? 'Development' : 'Health';
    return html.replace('<section class="journey-notice', `<section data-cat="${cat}" style="${yearTheme(cat)}" class="journey-notice`);
  };
})();
