/* Nov 26 (Yarden): stages with many guides group them into a few subjects, like her inspiration.
   Each group is ONE page: the subjects as sections, read top to bottom, never a directory of links.
   The sections are taken from the existing pages, so content and design stay exactly as approved; only the headings
   change where a section needs to say what it's about on a shared page. The old pages still open on their own
   (Timeline, Home and search link to them). */
(function () {
  const CAT = 'Feeding', H = () => window.__hub, F = t => H().F(t);
  // Render a page and split it into its sections: what comes before the first heading, then each heading with what follows.
  const sections = id => {
    const box = document.createElement('div');
    box.innerHTML = window.changesRoute('chg:' + CAT + ':mock:' + id) || '';
    const out = { _head: box.querySelector('.ss-head'), _lead: '' };
    const ct = box.querySelector('.ct-page');
    if (ct) { let html = ''; for (const n of [...ct.children]) { if (n.matches('h2')) break; html += n.outerHTML; } out._lead = html; }
    box.querySelectorAll('h2').forEach(h => {
      if (h.closest('.ss-head')) return;
      let html = '', n = h.nextElementSibling;
      while (n && !n.matches('h2')) { html += n.outerHTML; n = n.nextElementSibling; }
      out[h.textContent.trim()] = { cls: h.className, html };
    });
    return out;
  };
  const sec = (title, part, cls) => part ? `<h2 class="${cls || part.cls || 'hub-h2'}">${F(title)}</h2>${part.html}` : '';
  const head = (art, label, title, why) => `<div class="dev-area-head ss-head" style="--area:#fbe4ec;--area-ink:#9b4766"><span class="dev-area-head-art sf-head-art">${typeof hubArt === 'function' ? hubArt(art, CAT) : ''}</span><p class="hub-context">${F(label)}</p><h1>${F(title)}</h1><p class="hub-lead">${F(why)}</p></div>`;
  const page = (top, body, kind) => `<div class="quiet-category hub-page hub-detail care-v2 fd-group" data-overview="${CAT}" data-ss="1" style="${typeof yearTheme === 'function' ? yearTheme(CAT) : ''};--ss-bg:#fbe4ec;--ss-ink:#9b4766">${typeof detailPageTop === 'function' ? detailPageTop(CAT) : ''}${top}<div class="care-tpl is-${kind || 'expect'}">${body}</div></div>`;
  // Leave out one row of a section when another section on the same page already covers it.
  const drop = (part, text) => { if (!part) return part; const d = document.createElement('div'); d.innerHTML = part.html;
    d.querySelectorAll('.hub-row').forEach(r => { if (r.textContent.trim().startsWith(text)) r.remove(); }); return { cls: part.cls, html: d.innerHTML }; };
  const pick = (o, ...names) => names.map(n => o[n]).find(Boolean);

  // Nov 26 (Yarden: "set it up like the sequence for how to feed in the newborn stage, since it all builds on itself").
  // One guide, its approved pages as steps, shown one at a time with the same step bar and Next as A feed, step by step.
  const stepBody = (id, extra) => { const box = document.createElement('div'); box.innerHTML = window.changesRoute('chg:' + CAT + ':mock:' + id) || '';
    const root = box.firstElementChild; if (!root) return { root: null, html: '' };
    root.querySelectorAll('.guide-detail-top').forEach(n => n.remove()); if (extra) extra(root);
    return { root, html: root.innerHTML }; };
  let xsCss = '';
  const seq = (title, steps, endLine, start, back) => {
    if (!xsCss) { const m = /<style>#main \.xs\{[\s\S]*?<\/style>/.exec(window.changesRoute('chg:' + CAT + ':mock:xa:feed') || ''); xsCss = m ? m[0] : ''; }
    const bodies = steps.map(([id, , extra]) => stepBody(id, extra)), n0 = Math.min(Number(start) || 0, steps.length - 1);
    const titles = bodies.map(b => { const h = b.root && b.root.querySelector('h1'); return h ? h.textContent : ''; });
    const bar = `<nav class="xs" aria-label="${F(title)}">${steps.map(([, label], i) => `<button type="button" class="xs-step${i === n0 ? ' is-on' : i < n0 ? ' is-done' : ''}" aria-current="${i === n0 ? 'step' : 'false'}" onclick="__xaGo(this,${i})"><span class="xs-dot">${i + 1}</span><span class="xs-l">${F(label)}</span></button>`).join('')}</nav>`;
    const foot = i => i < steps.length - 1 ? H().next('Next · step ' + (i + 2) + ' of ' + steps.length, titles[i + 1], `__xaGo(this,${i + 1})`) : H().next(endLine, 'Back to Feeding', back);
    const r0 = bodies[0].root, open = r0 ? r0.outerHTML.slice(0, r0.outerHTML.indexOf('>') + 1) : '<div class="quiet-category hub-page hub-detail care-v2">';
    return open + (typeof detailPageTop === 'function' ? detailPageTop(CAT) : '') + xsCss + `<div class="xa fd-seq">${bar}${bodies.map((b, i) => `<div class="xa-p"${i === n0 ? '' : ' hidden'}>${b.html}${foot(i)}</div>`).join('')}</div></div>`; };
  // The allergen step also carries how to keep allergens in rotation, so nothing from that page is lost.
  const withRotation = root => { const r = sections('z_rotate')['Easy ways to serve them']; if (!r) return;
    const call = [...root.querySelectorAll('h2')].find(h => h.textContent.trim() === 'When to call'); const frag = document.createElement('div');
    frag.innerHTML = `<h2 class="${r.cls}">${F('Once {s’ve} had them, keep them coming')}</h2>${r.html}`;
    [...frag.childNodes].forEach(n => call ? call.parentNode.insertBefore(n, call) : root.appendChild(n)); };
  // Adds sections from another page before a page's When to call card (or at its end), keeping that page's look.
  const addBefore = (root, html) => { const call = [...root.querySelectorAll('h2')].find(h => h.textContent.trim() === 'When to call'); const frag = document.createElement('div'); frag.innerHTML = html;
    [...frag.childNodes].forEach(n => call ? call.parentNode.insertBefore(n, call) : (root.querySelector('.care-tpl') || root).appendChild(n)); };
  const withPage = (id, add) => { const box = document.createElement('div'); box.innerHTML = window.changesRoute('chg:' + CAT + ':mock:' + id) || ''; const root = box.firstElementChild; if (!root) return ''; add(root); return box.innerHTML; };
  const G = {
    // A meal, start to finish: the approved meal page, then where milk and water fit (so drinks have a home on this stage).
    g_meal: () => withPage('z_meal', root => { const k = sections('z_milkfood')['What to do']; if (k) addBefore(root, `<h2 class="${k.cls}">${F('Milk and water')}</h2>${k.html}`); }),
    // Common allergens: the approved page, with keeping them in rotation before the reaction signs.
    g_all: () => withPage('z_allergens', root => { const r = sections('z_rotate')['Easy ways to serve them']; if (r) addBefore(root, `<h2 class="${r.cls}">${F('Keep them in rotation')}</h2>${r.html}`); })
  };
  const base = window.changesRoute;
  window.changesRoute = function (r, ...a) { const q = String(r).split(':');
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && G[q[3]] && window.__hub) { const h = G[q[3]](q[4]); window.__fdLast = r; return h; }
    return base.call(this, r, ...a); };
})();
