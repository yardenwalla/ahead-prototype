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
  // Nov 14 (Yarden, option a): a baby born early keeps adjusted-age stages, but things that run on the calendar since
  // birth (back to birth weight, the first-week diaper count, the 3–5 day checkup, the cord) follow the real age.
  // Once such a baby is 3 weeks old by birthday, those lines give way to the care team's plan.
  const earlyPastFirstWeeks = () => { try { return !!(profile && profile.early && profile.due && cur() && (NOW - parse(profile.dob)) / 864e5 >= 21); } catch (e) { return false; } };
  function calendarLinesForEarly() {
    const m = document.getElementById('main'); if (!m || !earlyPastFirstWeeks()) return;
    const o = { he: 'him', she: 'her', they: 'them' }[profile.pronouns] || 'them';
    const plan = `Born early? Follow your care team’s advice on how often to wake ${o} for feeds.`;
    // Whole sentences about waking until back to birth weight.
    const walk = document.createTreeWalker(m, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walk.nextNode()) nodes.push(walk.currentNode);
    nodes.forEach(n => {
      let t = n.nodeValue, t0 = t;
      t = t.replace(/Until (?:he|she|they)(?:’s|’re| is| are)? back to birth weight,? (?:if [^,.]+,\s*)?wake (?:him|her|them)[^.]*\./g, plan)
           .replace(/^Until (?:he|she|they)(?:’s|’re| is| are)? back to birth weight,? wake (?:him|her|them) for feeds$/, 'Ask your care team about waking for feeds')
           .replace(/^Until (?:he|she|they)(?:’s|’re| is| are)? back to birth weight$/, 'Your care team’s plan comes first')
           .replace(/Newborns often doze off mid-feed\. /, '')
           .replace(/^First checkup at 3–5 days old[^.]*\.$/, '')
           .replace(/^Go to the early weight checks\. /, '').replace(/^Go to the early weight checks\.$/, '')
           .replace(/^A dip in the first days is normal\. /, 'Born early, growth is checked on the adjusted-age curve. ')
           .replace(/,? or not back to birth weight by 2 weeks\./, '.')
           .replace(/^From day 6: /, '')
           .replace(/^Back to birth weight by about 2 weeks$/, 'Steady gains at each checkup');
      if (t !== t0) n.nodeValue = t;
    });
    // A note whose only point is getting back to birth weight goes, label and all.
    nodes.forEach(n => { if (n.isConnected && /^\s*not back to birth weight by 2 weeks\.\s*$/.test(n.nodeValue)) { const e = n.parentElement; if (e) e.remove(); } });
    // Empty list items or notes left behind.
    m.querySelectorAll('li, p.ss-small, .x-note').forEach(e => { if (!e.textContent.trim()) e.remove(); });
    // The first-week diaper count (day 1, day 2… day 6): replaced by the line the care team uses after the first weeks.
    m.querySelectorAll('h2').forEach(h => {
      if (/^Wet diapers, (the first week|day by day)$/.test(h.textContent.trim())) {
        const next = h.nextElementSibling; if (next) next.remove();
        h.insertAdjacentHTML('afterend', `<p class="hub-lead-p">6 or more wet diapers a day, and steady gains at checkups, are the everyday signs.</p>`);
        h.textContent = 'Wet diapers now';
      }
    });
    m.querySelectorAll('figure.hub-diapers, .hub-card').forEach(c => { if (/Days 1–2/.test(c.textContent) && /Day 6/.test(c.textContent)) c.remove(); });
    // The first-month weight curve (birth weight, the early dip, back by 2 weeks), and Home's week-one poop row.
    // Remove the smallest block that holds the whole curve (its title through its last week), so nothing is left half-drawn.
    const curve = [...m.querySelectorAll('figure, section, div')].filter(c => /Some loss\s*up to 10%/.test(c.textContent) && /4 weeks/.test(c.textContent) && !/What to|WHAT TO/i.test(c.textContent));
    curve.filter(c => !curve.some(o => o !== c && c.contains(o))).forEach(c => c.remove());
    m.querySelectorAll('.hl-row, .hub-row').forEach(r => { if (/by the end of week one/.test(r.textContent)) r.remove(); });
  }
  if (typeof window.render === 'function') {
    const baseRender2 = window.render;
    window.render = render = function (...args) { const r = baseRender2.apply(this, args); try { calendarLinesForEarly(); } catch (e) {} return r; };
  }
  function esc2v(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
})();
