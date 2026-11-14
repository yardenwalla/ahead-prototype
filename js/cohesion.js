/* Ahead · One app (Nov 7 cohesion pass).
   Small shared rules every section uses, so the same fact reads the same way everywhere. */
(function () {
  // One age format: days in the first week, weeks until 3 months, then months, then "1 year".
  const fromDays = (days, m) => {
    if (days < 7) return `${Math.max(1, days)} day${days === 1 ? '' : 's'}`;
    if (days < 91) { const w = Math.floor(days / 7); return `${w} week${w === 1 ? '' : 's'}`; }
    return m >= 12 ? '1 year' : `${m} months`;
  };
  window.babyAge = function () {
    if (typeof profile === 'undefined' || !profile.dob || typeof parse !== 'function') return '';
    const days = Math.max(0, Math.floor((NOW - parse(profile.dob)) / 864e5));
    return fromDays(days, typeof actualMonth === 'function' ? actualMonth() : Math.floor(days / 30.44));
  };
  // Adjusted age, counted from the due date, in the same format ("2 weeks", "3 months").
  window.adjustedAge = function () {
    if (typeof profile === 'undefined' || !profile.early || !profile.due || typeof parse !== 'function') return '';
    const days = Math.max(0, Math.floor((NOW - parse(profile.due)) / 864e5));
    if (days < 7) return 'newborn';
    return fromDays(days, typeof ageMonths === 'function' ? ageMonths(parse(profile.due), NOW) : Math.floor(days / 30.44));
  };
  const cur = () => typeof month === 'undefined' || typeof actualMonth !== 'function' || month === actualMonth();
  if (typeof window.topicAge === 'function') {
    const prev = window.topicAge;
    window.topicAge = topicAge = t => { const r = prev(t); return cur() && !/adjusted/.test(r) ? babyAge() : r; };
  }
  if (typeof window.hubPageTop === 'function') {
    const prevTop = window.hubPageTop;
    window.hubPageTop = title => prevTop(title).replace(/(<p>[^<]*· )([^<]*)(<\/p>)/, (all, a, b, c) => typeof monthLabel === 'function' && b === esc2v(monthLabel(actualMonth())) ? a + babyAge() + c : all);
  }
  // Nov 14 (QA): a baby born early shows both ages the same way in every guide's header, e.g. "10 weeks · 2 weeks adjusted".
  // Guides used to differ ("Newborn adjusted" in Safety, "10 weeks" in Outings), which confused parents.
  if (typeof window.render === 'function') {
    const baseRender = window.render;
    window.render = render = function (...args) {
      const r = baseRender.apply(this, args);
      try {
        if (profile && profile.early && profile.due && cur()) {
          const nm = (typeof name === 'function' ? name() : '').replace(/&amp;/g, '&'), both = `${babyAge()} · ${adjustedAge()} adjusted`;
          document.querySelectorAll('#main .monthly-page-header p:not(.monthly-preview)').forEach(p => {
            if (!p.children.length && p.textContent.startsWith(nm + ' · ')) p.textContent = `${nm} · ${both}`;
          });
        }
      } catch (e) {}
      return r;
    };
  }
  function esc2v(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
})();
