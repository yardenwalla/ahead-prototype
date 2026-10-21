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
    const rows = all('.connected-summary-links .connected-row').map(r => ({ label: txt(r.querySelector('small')), title: txt(r.querySelector('b')), body: txt(r.querySelector('.connected-row-copy > span')) }));
    const actions = all('.home-action-row').map(r => ({ label: txt(r.querySelector('small')), title: txt(r.querySelector('b')) }));
    const next = all('.connected-ahead-list .connected-row').map(r => ({ label: txt(r.querySelector('small')), title: txt(r.querySelector('b')) }));
    return {
      checkin: ci ? { q: txt(ci.querySelector('h2')), choices: all('.connected-checkin-choices button', ci).map(txt) } : null,
      hero: txt(m.querySelector('.home-summary-heading h1')), eyebrow: txt(m.querySelector('.home-month-eyebrow')),
      rows, actions, next, swaddle: all('.home-connected-sleep b').some(b => /swaddl/i.test(b.textContent)), problems: problems()
    };
  }

  function cat(name) {
    navigate('categories'); openPage('topic:' + name);
    const m = $m();
    const heads = all('.sleep-phase-ahead', m).map(s => ({ label: txt(s.querySelector('h3')), title: txt(s.querySelector('h4')) }));
    return {
      header: txt(m.querySelector('.monthly-page-header p')),
      current: txt(m.querySelector('.chg-rail [data-relevant="true"] > span:not(.journey-stage-node)')),
      selected: txt(m.querySelector('.chg-rail [aria-current="step"] > span:not(.journey-stage-node)')),
      eyebrow: txt(m.querySelector('.experience-hero .eyebrow')), title: txt(m.querySelector('.experience-hero h2')),
      alerts: heads.filter(h => !/^(Coming up|After the first birthday)/.test(h.label)),
      comingUp: heads.find(h => /^Coming up/.test(h.label)) || null,
      after: heads.find(h => /^After the first birthday/.test(h.label)) || null,
      checkin: txt(m.querySelector('.chg-checkin h2')),
      events: all('.chg-also .guide-resource-row b', m).map(txt),
      questions: all('.common-questions summary > span:first-child', m).map(txt),
      sections: all('.sleep-phase-help > h3, .chg-card-head h2, .common-questions > h2, .chg-also > h3', m).map(txt),
      rhythm: all('.chg-day li, .chg-amounts > div', m).map(txt),
      links: all('.sleep-reference-row', m).map(txt),
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
