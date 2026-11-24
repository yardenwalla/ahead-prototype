/* One "When to call" card everywhere (Nov 23, Yarden's design).
   A white card with one row per tier. Each row has an icon tile on the left, the action as a title on its own line,
   and the signs as a sentence under it. The urgent rows (911, ER, "right away") sit on a soft pink band with a red title.
   Every guide still builds its call lines its own way (hub.js TPLB.calls, care-v2, feed-templates, hubUrgent);
   this runs after each render and draws all of them the same way, so no guide can drift. */
(function () {
  const PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
  const CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // The action, in one of the app's fixed wordings.
  const title = (lab, urgent) => {
    const l = String(lab || '').replace(/\s*(if you see|if)?\s*:?\s*$/i, '').trim();
    if (/911/.test(l)) return ['Call 911 right away', 'u'];
    if (/^go to the er/i.test(l)) return ['Go to the ER', 'u'];
    if (/^call right away$/i.test(l) || (urgent && /^call your pediatrician$/i.test(l))) return ['Call your pediatrician right away', 'u'];
    if (/right away/i.test(l)) return [l, 'u'];
    return [l || 'Call your pediatrician', urgent ? 'u' : 'p'];
  };
  const sentence = html => {
    let t = String(html).trim().replace(/^[:\s]+/, '');
    const plain = t.replace(/<[^>]+>/g, '');
    if (plain) t = t.replace(/^(\s*(?:<[^>]+>\s*)*)([a-z])/, (m, a, c) => a + c.toUpperCase());
    if (plain && !/[.!?]\s*$/.test(plain) && !/<\/(ul|ol)>\s*$/.test(t)) t += '.';
    return t;
  };
  const row = ([t, tone], body) => `<div class="cw-row is-${tone}"><span class="cw-ico">${tone === 'u' ? CROSS : PHONE}</span><div class="cw-copy"><b>${esc(t)}</b><div class="cw-body">${body}</div></div></div>`;

  // Read the rows out of any of the app's call cards.
  function rowsOf(sec) {
    const out = [];
    if (sec.classList.contains('care-calls')) {
      const list = sec.querySelector('ul');
      if (list) {
        const note = sec.querySelector('.care-calls-note');
        out.push(row(['Call your pediatrician', 'p'], `<p>If you see:</p>${list.outerHTML}${note ? `<p class="cw-note">${note.innerHTML}</p>` : ''}`));
        return out;
      }
      sec.querySelectorAll('p').forEach(p => {
        if (p.closest('.care-calls-head')) return;
        const b = p.querySelector('b');
        if (!b) { if (out.length) out[out.length - 1] = out[out.length - 1].replace('</div></div></div>', `<p class="cw-note">${p.innerHTML}</p></div></div></div>`); return; }
        const lab = b.textContent; const rest = p.innerHTML.replace(b.outerHTML, '');
        out.push(row(title(lab, p.classList.contains('is-urgent')), `<p>${sentence(rest)}</p>`));
      });
    } else if (sec.matches('.hub-callout.is-urgent')) {
      const b = sec.querySelector('b'), p = sec.querySelector('p');
      out.push(row(title(b ? b.textContent : '', true), `<p>${sentence(p ? p.innerHTML : '')}</p>`));
    }
    return out;
  }
  const isUrgentBox = el => el && el.matches && el.matches('section.hub-callout.is-urgent') && !/safety first/i.test((el.querySelector('b') || {}).textContent || '');
  function apply() {
    const main = document.querySelector('#main'); if (!main) return;
    main.querySelectorAll('section.care-calls:not(.cw-done)').forEach(sec => {
      let rows = rowsOf(sec);
      // A 911 box right after the card joins it as its last row.
      let nx = sec.nextElementSibling;
      while (isUrgentBox(nx)) { rows = rows.concat(rowsOf(nx)); const gone = nx; nx = nx.nextElementSibling; gone.remove(); }
      const ownHead = sec.querySelector('.care-calls-head');
      const prev = sec.previousElementSibling, hasH2 = prev && /^H2$/.test(prev.tagName);
      const card = `${ownHead && !hasH2 ? '<h2 class="hub-h2">When to call</h2>' : ''}<section class="cw-card cw-done">${rows.join('')}</section>`;
      sec.outerHTML = card;
    });
    // A lone urgent box (no call card before it) becomes the same card with one row.
    main.querySelectorAll('section.hub-callout.is-urgent').forEach(sec => {
      if (!isUrgentBox(sec)) return;
      const prev = sec.previousElementSibling;
      if (prev && prev.classList.contains('cw-card')) { prev.insertAdjacentHTML('beforeend', rowsOf(sec).join('')); sec.remove(); return; }
      sec.outerHTML = `<section class="cw-card cw-done">${rowsOf(sec).join('')}</section>`;
    });
  }
  window.callsCardApply = apply;
  if (typeof window.render === 'function') {
    const base = window.render;
    window.render = render = function (...args) { const r = base.apply(this, args); try { apply(); } catch (e) { console.error(e); } return r; };
  }
  try { apply(); } catch (e) {}
})();
