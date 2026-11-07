/* Ahead · One app (Nov 7 cohesion pass).
   Small shared rules every section uses, so the same fact reads the same way everywhere. */
(function () {
  // One age format: days in the first week, weeks until 3 months, then months, then "1 year".
  window.babyAge = function () {
    if (typeof profile === 'undefined' || !profile.dob || typeof parse !== 'function') return '';
    const days = Math.max(0, Math.floor((NOW - parse(profile.dob)) / 864e5));
    if (days < 7) return `${Math.max(1, days)} day${days === 1 ? '' : 's'}`;
    if (days < 91) { const w = Math.floor(days / 7); return `${w} week${w === 1 ? '' : 's'}`; }
    const m = typeof actualMonth === 'function' ? actualMonth() : Math.floor(days / 30.44);
    return m >= 12 ? '1 year' : `${m} months`;
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
  function esc2v(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
})();
