/* QA helpers injected into the prototype by run_qa.py.
   They read what a parent would see; they never change app logic. */
window.__qa = (function () {
  const $m = () => document.querySelector('#main');
  const txt = el => (el ? el.innerText.replace(/\s+/g, ' ').trim() : '');
  const all = (sel, root) => [...(root || $m()).querySelectorAll(sel)];

  // Anything a parent should never see on screen
  const BAD = /\bundefined\b|\bnull\b|\bNaN\b|\[object|\$\{|\{\{|Infinity/;

  function problems() {
    const m = $m(), out = [], t = txt(m);
    if (t.length < 60) out.push('Page is empty or nearly empty');
    const bad = t.match(BAD); if (bad) out.push(`Shows “${bad[0]}” on screen`);
    if (/review pending|pediatrician-reviewed|pediatric (advisor )?review/i.test(t)) out.push('Mentions pediatric review');
    if (/Previous checklist|Next: (Before|Your first)/.test(t)) out.push('Has a Previous/Next link between stages');
    // headings with nothing under them
    all('section, .sleep-phase-help, .common-questions, .sleep-snapshot-patterns').forEach(s => {
      const h = s.querySelector('h2,h3'); if (!h) return;
      const rest = s.textContent.replace(h.textContent, '').replace(/\s+/g, ' ').trim();
      if (rest.length < 3) out.push(`Empty section: “${txt(h)}”`);
    });
    all('li, p, b, h1, h2, h3, h4, small').forEach(e => { if (!e.textContent.trim() && !e.querySelector('svg,img') && e.childElementCount === 0) out.push(`Empty <${e.tagName.toLowerCase()}> element`); });
    all('a[href]').forEach(a => { const h = a.getAttribute('href'); if (!h || h === '#' || /undefined/.test(h)) out.push(`Broken link: “${txt(a)}”`); });
    return [...new Set(out)];
  }

  function clickables() {
    return [...new Set(all('[onclick]').map(e => e.getAttribute('onclick')).filter(Boolean))];
  }

  function home() {
    navigate('home');
    const m = $m();
    const ci = m.querySelector('.connected-checkin');
    // Home is a briefing: "Important right now" cards, then "Coming up" cards.
    const brief = sel => all(sel).map(r => ({ label: txt(r.querySelector('small')), title: txt(r.querySelector('b')), body: txt(r.querySelector('.connected-row-copy > span')) }));
    const rows = brief('.connected-summary-links .connected-row'), actions = [], next = brief('.connected-ahead-list .connected-row');
    return {
      checkin: ci ? { q: txt(ci.querySelector('h2')), choices: all('.connected-checkin-choices button', ci).map(txt) } : null,
      hero: txt(m.querySelector('.home-summary-heading h1')), eyebrow: txt(m.querySelector('.home-month-eyebrow')), close: txt(m.querySelector('.brief-close')),
      rows, actions, next, swaddle: all('[data-brief^="rolling"]').length > 0, problems: problems()
    };
  }

  function cat(name) {
    navigate('categories'); openPage('topic:' + name);
    const m = $m();
    // Summary screens: stage pills, a hero, rows (red chips are must-knows), normal-versus-call cards, coming up.
    const red = all('.hub-row', m).filter(r => r.querySelector('.hub-chip.is-red')).map(r => ({ label: txt(r.querySelector('.hub-chip')), title: txt(r.querySelector('.hub-row-copy b')) }));
    const cards = all('.hub-versus h3', m).map(h => ({ label: 'Card', title: txt(h) }));
    const auto = all('.hub-auto .hub-note', m).map(n => ({ label: 'Updated for this age', title: txt(n) }));
    const nexts = all('.hub-next', m).map(n => ({ label: txt(n.querySelector('small')), title: txt(n.querySelector('b')) }));
    const pill = sel => txt(m.querySelector(sel)).replace(/\s*Now$/, '');
    return {
      header: txt(m.querySelector('.monthly-page-header p')),
      current: pill('.hub-stage.is-now .hub-stage-name'),
      selected: pill('.hub-stage.is-on .hub-stage-name'),
      eyebrow: txt(m.querySelector('.hub-eyebrow')), title: txt(m.querySelector('.hub-hero h1')),
      alerts: [...auto, ...red, ...cards],
      comingUp: nexts.find(h => /^Coming up/.test(h.label)) || null,
      after: nexts.find(h => /^After the first birthday/.test(h.label)) || null,
      checkin: txt(m.querySelector('.chg-checkin h2')),
      events: all('.hub-row', m).filter(r => /:e:\d/.test(r.getAttribute('onclick') || '')).map(r => txt(r.querySelector('.hub-row-copy b'))),
      questions: all('.hub-more', m).map(txt),
      sections: all('.hub-h2, .hub-versus h3', m).map(txt),
      rhythm: all('.hub-tiles > div', m).map(txt),
      links: all('.hub-row', m).map(r => txt(r.querySelector('.hub-row-copy b'))),
      text: txt(m), problems: problems()
    };
  }

  // Open one clickable from a page and report what happened.
  function tryClick(fromPage, onclick) {
    const errs = [];
    const onErr = e => errs.push(String(e.message || e));
    window.addEventListener('error', onErr);
    try {
      page = fromPage; historyStack = ['home']; render();
      const before = page;
      (0, eval)(onclick);
      const after = page;
      const p = problems();
      let backOk = true;
      if (after !== before && typeof back === 'function') { back(); backOk = !!txt($m()); }
      return { onclick, from: fromPage, to: after, problems: p, errors: errs, backOk };
    } catch (e) { return { onclick, from: fromPage, to: page, problems: [], errors: [String(e.message || e)], backOk: false }; }
    finally { window.removeEventListener('error', onErr); }
  }

  // Click-through must not change the family's state: snapshot and restore storage.
  function snap() { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; }
  function restore(o) { localStorage.clear(); Object.entries(o).forEach(([k, v]) => localStorage.setItem(k, v)); }

  return { snap, restore, home, cat, problems, clickables, tryClick, state: () => ({ month: actualMonth(), dev: developmentMonth(actualMonth()), profile, answers: { ...answers } }) };
})();
