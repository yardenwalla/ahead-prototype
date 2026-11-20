/* Ahead · One way to move between stages in every guide (Nov 19): the stage path from Health's checkups.
   A slim card at the top of each guide: the year's stages as dots on a line, the baby's stage marked "Now"
   (Health: "Next"), the one you're reading filled in, and done checkups ticked. Tap a dot to read
   that stage. It replaces the "All stages ›" chip and Development's age pills.
   Reading another stage in Sleep, Feeding or Safety still shows the banner with "This fits [name]".
   window.__pathOld = true brings back the chip and pills. */
(function () {
  if (typeof window.render !== 'function') return;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  // Short names for the dots (the stage pages keep their full names).
  const SHORT = {
    Sleep: ['Newborn', 'Longer nights', 'Three naps', 'Two naps'],
    Feeding: ['Newborn', 'Milk feeds', 'Ready for solids', 'First foods', 'Meals'],
    Safety: ['First setup', 'Rolling', 'Crawling', 'Pulling up'],
    Development: ['2 mo', '4 mo', '6 mo', '9 mo', '12 mo'],
    'Daily rhythm': ['Newborn', '1–3 mo', '4–6 mo', '6–12 mo'],
    Health: ['1st wk', '1 mo', '2 mo', '4 mo', '6 mo', '9 mo', '12 mo']
  };
  const short = a => String(a || '').replace(/ weeks?/g, ' wk').replace(/ months?\+?/g, ' mo').replace(/^From birth$/, 'Birth').replace(/^Once you start$/, 'When ready').replace(/^Around /, '~');
  function card(cat, items) {
    const ci = items.findIndex(x => x.now), names = SHORT[cat] || items.map(x => x.label);
    const ages = ((window.STAGE_TABLE || {})[cat] || {}).stages || [];
    // Health: the next checkup says when, visits with shots say so, and checkups marked done get a tick.
      const done = i => { try { return cat === 'Health' && healthRecord(WELL_VISITS[i]) && healthRecord(WELL_VISITS[i]).status === 'attended'; } catch (e) { return false; } };
    const sub = (it, i) => {
      if (cat === 'Health') {
        const a = WELL_VISITS[i];
        if (live() && it.now) return 'Next';   // the top card already says when
        return { 2: 1, 4: 1, 6: 1, 12: 1 }[a] ? 'Shots' : '';
      }
      if (live() && it.now) return 'Now';
      return ['Development', 'Daily rhythm'].includes(cat) ? '' : esc(short(ages[i] && ages[i].age));
    };
    const nodes = items.map((it, i) => {
      const cls = [it.on ? 'is-on' : '', done(i) ? 'is-done' : '', live() && it.now ? 'is-next' : '', live() && ci >= 0 && i < ci && !done(i) ? 'is-past' : ''].filter(Boolean).join(' ');
      return `<button class="sp-node ${cls}" onclick="${it.onclick}"${it.on ? ' aria-current="page"' : ''}><i>${done(i) ? CHECK : ''}</i><b>${esc(names[i] || it.label)}</b><small>${sub(it, i)}</small></button>`;
    }).join('');
    return `<nav class="sp-card" aria-label="Stages" style="--sp-n:${items.length}"><div class="sp-line">${nodes}</div></nav>`;
  }
  const base = window.render;
  window.render = render = function () {
    base.apply(this, arguments);
    if (window.__pathOld) return;
    const m = document.getElementById('main'), seen = window.stageItemsLast && window.stageItemsLast();
    if (!m || !seen || !seen.items || seen.items.length < 2 || !SHORT[seen.cat] || (typeof page === 'string' && page.startsWith('stages:'))) return;
    const pg = m.querySelector('.hub-page') || m;
    if (pg.querySelector('.sp-card')) return;
    m.querySelectorAll('.st-chip:not([hidden]), .dvx-ages, .hl-path, .h2-track-sec').forEach(e => e.remove());
    pg.querySelectorAll('.st-has-chip').forEach(e => e.classList.remove('st-has-chip'));
    pg.querySelectorAll('.st-eyebrow').forEach(e => e.classList.remove('st-eyebrow'));
    // Read-only guides don't need the banner: the path already shows what you're reading and where the baby is.
    if (!['Sleep', 'Feeding', 'Safety'].includes(seen.cat)) m.querySelectorAll('.st-banner').forEach(e => e.remove());
    const head = pg.querySelector('.monthly-page-header, .guide-detail-top');
    const html = card(seen.cat, seen.items);
    if (head) head.insertAdjacentHTML('afterend', html); else pg.insertAdjacentHTML('afterbegin', html);
  };
})();
