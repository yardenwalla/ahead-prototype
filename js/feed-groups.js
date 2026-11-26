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

  const G = {
    // Textures and finger foods: the two skills of this stage, then how to keep pieces safe.
    // Nov 26 (Yarden: the stitched version was overwhelming). Built like her inspiration: a short top card, two subjects
    // each with one line and one picture, then one strip of how-tos and one of safety. Details stay on the full pages.
    g_skills: () => { const T = H().TPLB, m = window.__fdx ? window.__fdx.ageMo() : 8, now = m < 7 ? 0 : m < 9 ? 1 : 2, nine = m >= 9;
      const lead = t => `<p class="fd-g-lead">${F(t)}</p>`;
      const check = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';
      const strip = (title, items) => `<section class="fd-g-strip"><b class="fd-g-strip-h">${F(title)}</b><ul>${items.map(t => `<li><i>${check}</i><span>${F(t)}</span></li>`).join('')}</ul></section>`;
      const foods = nine ? [['feeding/pieces-9', 'Banana, avocado, egg', 'Small, soft pieces'], ['feeding/opt-broccoli', 'Broccoli', 'Well cooked'], ['feeding/opt-pasta', 'Pasta', 'Soft, well cooked'], ['feeding/nutbutter', 'Toast', 'Nut butter spread thin']]
        : [['feeding/opt-avocado', 'Avocado', 'Ripe strips'], ['feeding/opt-banana', 'Banana', 'Strips, not rounds'], ['feeding/opt-egg', 'Egg', 'Omelet strips'], ['feeding/opt-broccoli', 'Broccoli', 'Well cooked'], ['feeding/opt-pasta', 'Pasta', 'Soft, well cooked'], ['feeding/nutbutter', 'Toast', 'Nut butter spread thin']];
      return page(head('avocado', 'First foods', 'Build {p} eating skills', 'Lumps teach {o} to chew. Finger foods teach {o} to feed {o}self.'),
        `<h2 class="hub-h2">${F('Move through textures')}</h2>` + lead('Move on once each one is easy.')
        + T.photoSwitch([['Smooth', 'Around 6 months'], ['Lumpy', '7–8 months'], ['Soft pieces', '9 months on']],
          [['Avocado', ['feeding/tx-avo-1', 'feeding/tx-avo-2', 'feeding/tx-avo-3']], ['Banana', ['feeding/tx-ban-1', 'feeding/tx-ban-2', 'feeding/tx-ban-3']], ['Sweet potato', ['feeding/tx-sp-1', 'feeding/tx-sp-2', 'feeding/tx-sp-3']]], now)
        + `<h2 class="hub-h2">${F('Try safe finger foods')}</h2>` + lead('Soft enough to squish between your finger and thumb.')
        + T.photoGridMore(foods, 'See more foods')
        + strip('How to keep building', ['Mash with a fork, not a blender', nine ? 'Small, pea-size pieces {s} can pinch' : 'Finger-size strips {s} can hold', 'Lumps by about 9 months make chewing easier later'])
        + strip('Keep {o} safe', ['Seated upright, with you, every bite', 'Quarter grapes lengthwise. No whole nuts'])); },
    // A meal, start to finish, then where milk and water fit around it.
    g_meal: () => { const m = sections('z_meal'), k = sections('z_milkfood'), hd = m._head;
      const title = hd && hd.querySelector('h1') ? hd.querySelector('h1').textContent : 'First meals are just a few bites';
      const why = hd && hd.querySelector('.hub-lead') ? hd.querySelector('.hub-lead').textContent : '';
      const rest = Object.keys(m).filter(n => !n.startsWith('_')).map(n => sec(n, m[n])).join('');
      // The first-meals page uses the how-to layout (its styles live under .ct-page), so its sections keep that wrapper.
      const ct = !!m._lead, milk = sec('Milk and water around meals', k['What to do']);
      return page(head('highchair', 'How a meal goes', title, why), ct ? `<div class="ct-page is-howto">${m._lead + rest}</div>` + milk : rest + milk, ct ? 'howto' : 'expect'); },
    // Allergens, then gagging and choking, then the foods to serve differently. Allergy reactions close the page.
    g_safe: () => { const a = sections('z_allergens'), r = sections('z_rotate'), g = sections('z_gag');
      const choke = Object.keys(g).find(n => /^If .*choking$/.test(n));
      return page(head('shield', 'Keep meals safe', 'Try allergens early. Learn choking first aid.', 'Start allergens around 6 months. Ask first if {s} has severe eczema or an egg allergy.'),
        sec('Try the common allergens', a['Peanut, the safe way']) + sec('Keep track', a['Keep track']) + sec('Keep them coming', r['Easy ways to serve them'])
        + sec('Gagging or choking?', g['How to tell them apart']) + (choke ? sec(choke, g[choke]) : '')
        + sec('When to call', a['When to call'])); },
    // Milk feeds: growth spurts and distracted feeds are both "feeds are changing".
    g_change: () => { const n = sections('m1_now'), d = sections('m2_distract');
      return page(head('clock', 'Feeds now', 'Feeds change as {s} {grow|grows}', 'Hungrier days come in spurts, and busy eyes make daytime feeds short. Both are normal.'),
        sec('Hungrier days', n['What’s normal']) + sec('When {s’s} hungrier', n['What to do']) + sec('When {s’s} distracted', d['What to do'])); }
  };
  const base = window.changesRoute;
  window.changesRoute = function (r, ...a) { const q = String(r).split(':');
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && G[q[3]] && window.__hub) { const h = G[q[3]](); window.__fdLast = r; return h; }
    return base.call(this, r, ...a); };
})();
