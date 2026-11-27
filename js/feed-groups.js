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
  // Nov 26 (Yarden: "the inspiration looks cleaner"): each page is the standard top card, two or three sections that
  // each open with one plain line, and one pink tips box at the end. No stacks of row cards.
  const sect = (title, line, fig) => `<h2 class="hub-h2">${F(title)}</h2>${line ? `<p class="fd-g-lead">${F(line)}</p>` : ''}${fig}`;
  const tips = (title, xs) => `<section class="ss-do fd-g-tips" style="margin-top:16px"><b>${F(title)}</b><ul class="ss-do-list">${xs.filter(Boolean).map(t => `<li>${F(t)}</li>`).join('')}</ul></section>`;
  // The tracker as photo tiles: each allergen in a form that's safe for a baby, tapped once it's been tried.
  const AL = [['Peanut', 'al-peanut', 'Thinned, smooth'], ['Egg', 'al-egg', 'Well cooked'], ['Dairy', 'al-dairy', 'Plain yogurt'], ['Wheat', 'al-wheat', 'Soft toast'], ['Soy', 'al-soy', 'Soft tofu'], ['Fish', 'al-fish', 'Flaked salmon'], ['Shellfish', 'al-shellfish', 'Minced shrimp'], ['Sesame', 'al-sesame', 'Thinned tahini'], ['Tree nuts', 'al-treenuts', 'Thin nut butter']];
  const alDone = () => { try { return JSON.parse(localStorage.getItem('ahead-fd-allergens') || '[]'); } catch (e) { return window.__alMem || []; } };
  const tick = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';
  const alPhotos = () => { const done = alDone();
    return `<section class="hub-card fd-al-photos" id="fd-al" data-photo="1"><div class="fd-al-h"><b>${F('Tap each one once {s’s} had it')}</b><small>${done.length} ${F('of')} ${AL.length}</small></div><div class="fd-al-grid">${AL.map(([a, img, sub]) => { const on = done.includes(a);
      return `<button type="button" class="fd-al-t${on ? ' is-on' : ''}" aria-pressed="${on}" onclick="__alTick('${a}')"><span class="fd-al-img"><img src="assets/feeding/${img}.jpg?v=1" alt="" loading="lazy">${on ? `<i>${tick}</i>` : ''}</span><b>${F(a)}</b></button>`; }).join('')}</div></section>`; };
  { const prev = window.__alTick; window.__alTick = a => { const el = document.getElementById('fd-al');
      if (!el || !el.dataset.photo) return prev && prev(a);
      let d = alDone(); d = d.includes(a) ? d.filter(x => x !== a) : d.concat(a); window.__alMem = d; try { localStorage.setItem('ahead-fd-allergens', JSON.stringify(d)); } catch (e) { }
      el.outerHTML = alPhotos(); }; }
  const mo = () => window.__fdx ? window.__fdx.ageMo() : 8;
  // Swap a section of an approved page (heading and its card) for new markup, keeping the rest of the page as is.
  const swapSection = (root, heading, html) => { const h = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === F(heading)); if (!h) return;
    let n = h.nextElementSibling; while (n && !n.matches('h2')) { const nx = n.nextElementSibling; n.remove(); n = nx; }
    const frag = document.createElement('div'); frag.innerHTML = html; h.replaceWith(...frag.childNodes); };
  // Nov 27 (Yarden: the newborn feed "needs a lot of work"; her calmer inspiration): one page instead of four heavy steps.
  // The feed as four photo steps, then the one technique her family needs (latch or paced bottle), ways to burp, and fixes.
  const nbFeed = () => { const T = H().TPLB, X = window.__fdx || {}, nurse = X.nurses ? X.nurses() : true;
    const steps = window.ctPhotoSteps([
      ['photo:feeding/cue-2', 'Spot early hunger', 'Stirring, rooting, hands to mouth. Crying comes late'],
      nurse ? ['photo:feeding/hold-cradle', 'Latch on', 'Nose to nipple. Wait for a wide mouth, then chin first']
        : ['photo:feeding/pace-step-1', 'Pace the bottle', '{S} sits upright, bottle about level. Let {o} draw it in'],
      nurse ? ['photo:feeding/laidback-feed', 'Burp and switch', 'When sucking slows, burp {o}, then offer the other side']
        : ['photo:feeding/pace-step-2', 'Pause and burp', 'Every 2–3 oz and at the end. No burp after a minute is fine'],
      ['photo:feeding/full', 'Stop when {s’s} full', 'Turning away or drifting off ends the feed, even if milk is left']]);
    const how = nurse
      ? tips('A good latch', ['It feels like a tug, not a pinch.', 'Lips flared out, like a fish.', 'You hear swallows as {s} {suck|sucks}.', 'Start the next feed on the last side.'])
      : tips('Pacing a bottle', ['About 2–4 oz, every 3–4 hours.', 'Tip it down every few sucks to pause.', 'Never prop a bottle. Always hold {o}.']);
    const fixes = nurse
      ? tips('If it’s not going smoothly', ['Pinching? Break the seal with a finger and try again.', 'Gulping? Lean back, so {s} {feed|feeds} uphill.', 'Dozing off? Try the other side.', 'Most feeds hurt? A lactation consultant can help.'])
      : tips('If it’s not going smoothly', ['Gulping or coughing? Pause and tip the bottle down.', 'Spit-up and hiccups are common.', 'Fussing after feeds? Burp more often.']);
    const video = nurse ? T.fold('Watch a good latch', typeof hubEmbed === 'function' ? hubEmbed('y--syZR0u1E', 'A good latch, step by step', 'Global Health Media') : '')
      : T.fold('Watch how to pace a bottle', typeof hubEmbed === 'function' ? hubEmbed('OGPm5SpLxXY', 'Watch how to pace a bottle', 'Lactation educators (IABLE)') : '');
    return page(head('heart', 'A feed, start to finish', 'Follow {p} cues, not the clock', 'Feeding before {s} {cry|cries} is easier for you both. Let {o} decide how much.'),
      sect('How a feed goes', '', steps) + how
      + sect('Ways to burp', '', T.photoGrid([['feeding/burp-shoulder', 'Over your shoulder', 'Chin on a cloth'], ['feeding/burp-sitting', 'Sitting on your lap', 'Hand under {p} chin'], ['feeding/burp-tummy', 'Tummy-down', 'Across your lap']]))
      + fixes.replace('fd-g-tips"', 'fd-g-tips is-plain"') + video); };
  const G = {
    // Milk feeds: hungrier days and distracted feeds on one page (the old two-step guide is gone).
    g_change: () => { const n = sections('m1_now'), d = sections('m2_distract'), lead = n['What to do'] ? (() => { const x = document.createElement('div'); x.innerHTML = n['What to do'].html; const p = x.querySelector('p, .hub-card-text, div'); return p ? p.textContent.trim().split('\n')[0] : ''; })() : '';
      return page(head('clock', 'How feeds are changing', 'Feeds change as {s} {grow|grows}', 'Hungrier days come and go, and daytime feeds get shorter. Both are normal.'),
        sect('Hungrier days', lead || 'Feed more often for a few days, and things settle again.', n['What’s normal'] ? n['What’s normal'].html : '')
        + sect('Distracted feeds', 'Short daytime feeds are okay. {S} still {get|gets} enough over the day.', '')
        + tips('For calmer feeds', ['Feed when {s’s} drowsy.', 'Let {o} hold your finger.', 'Save the chatting for later.', 'Pops off? Try again a little later.'])); },
    // How to start: the safety rows become one short tips box (no mismatched icons).
    z_start: () => withPage('z_start', root => swapSection(root, 'Keep {o} safe', tips('Keep {o} safe', ['Soft enough to squash easily.', 'Seated upright in a high chair, with you.', 'No added salt or sugar.']))),
    g_tex: () => { const T = H().TPLB, m = mo(), now = m < 7 ? 0 : m < 9 ? 1 : 2, nine = m >= 9;
      return page(head('avocado', 'Textures and finger foods', 'Move from smooth food to soft pieces', 'Lumps teach {o} to chew. Soft finger foods teach {o} to feed {o}self.'),
        sect('The texture progression', 'Move on once each one is easy, whatever the month. Aim for lumps by about 9 months.',
          T.photoSwitch([['Smooth', 'Around 6 months'], ['Lumpy', '7–8 months'], ['Soft pieces', '9 months on']],
            [['Avocado', ['feeding/tx-avo-1', 'feeding/tx-avo-2', 'feeding/tx-avo-3']], ['Banana', ['feeding/tx-ban-1', 'feeding/tx-ban-2', 'feeding/tx-ban-3']], ['Sweet potato', ['feeding/tx-sp-1', 'feeding/tx-sp-2', 'feeding/tx-sp-3']]], now))
        + sect('Finger foods to try', 'Soft enough to squish between your finger and thumb.',
          T.photoGridMore(nine ? [['feeding/pieces-9', 'Banana, avocado, egg', 'Ripe, or well cooked'], ['feeding/opt-broccoli', 'Broccoli', 'Well cooked, stem to hold'], ['feeding/opt-pasta', 'Pasta', 'Soft, well cooked'], ['feeding/nutbutter', 'Toast', 'Nut butter spread thin']]
            : [['feeding/opt-avocado', 'Avocado', 'Ripe strips'], ['feeding/opt-banana', 'Banana', 'Strips, not rounds'], ['feeding/opt-egg', 'Egg', 'Omelet strips'], ['feeding/nutbutter', 'Toast', 'Nut butter spread thin'], ['feeding/opt-broccoli', 'Broccoli', 'Well cooked, stem to hold'], ['feeding/opt-pasta', 'Pasta', 'Soft, well cooked']], 'See more foods'))
        + tips('Quick tips', ['Mash with a fork, not a blender.', 'Quarter grapes and cherry tomatoes.'])); },
    g_meal: () => { const T = H().TPLB, milk = ['Milk before or after meals, whichever suits {p} mood.', 'Water from a cup with meals, 4–8 oz a day at most.', 'Milk eases off slowly as meals grow, mostly after 9 months.'];
      if (mo() >= 8.5) return withPage('z_meal', root => addBefore(root, tips('Milk and water', milk)));
      const lead = sections('z_meal')._lead;
      return page(head('highchair', 'A meal, start to finish', 'First meals are just a few bites', 'Milk is still {p} main food. Let {o} set the pace.'),
        sect('What a meal looks like', '', `<div class="ct-page is-howto">${lead}</div>`)
        + sect('The simple flow', '', T.photoGrid([['feeding/meal-1', '1. Sit {o} up', 'Strapped in, facing you'], ['feeding/meal-2', '2. Offer a little', 'A spoonful, or a soft strip'], ['feeding/meal-3', '3. Let {o} lead', 'Done when {s} {turn|turns} away']]))
        + tips('Good to know', ['Pick a calm time, not a hungry one.', 'Expect mess. Most lands on the tray.', 'Milk can come before or after the meal.'])); },
    g_all: () => { const T = H().TPLB, X = window.__fdx, b = X && X.isBreast ? X.isBreast() : true, f = X && X.formulaFam ? X.formulaFam() : false, thin = !b ? 'formula' : f ? 'breast milk or formula' : 'breast milk';
      return page(head('peanut', 'Common allergens', 'Try the common allergens early', 'Start around 6 months. Ask first if {s} has severe eczema or an egg allergy.'),
        sect('The 9 common allergens', 'Try one at a time. Each photo shows one safe way to serve it.', alPhotos())
        + sect('How to introduce', '', window.ctPhotoSteps([['photo:feeding/pb-spoon', 'A little smooth peanut butter', 'About ½ teaspoon. Never whole nuts'], ['photo:feeding/pb-thin', 'Thin it', 'With warm water or ' + thin + ', until runny'], ['photo:feeding/pb-offer', 'Offer it at home', 'Early in the day, so you can watch']], [['Egg works the same way', 'Well cooked, never runny']]))
        + tips('Keep them coming', ['A few times a week once {s’ve} had it.', 'Peanut stirred into oatmeal, egg baked into pancakes.'])
        + T.calls({ ped: 'a few hives, or vomiting, after a new food.', nowLabel: 'Call 911', now: 'trouble breathing, swelling of the lips or face, hives all over, hives with vomiting, or {s’s} very sleepy or floppy.' })); }
  };
  const base = window.changesRoute;
  window.changesRoute = function (r, ...a) { const q = String(r).split(':');
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && q[3] === 'xa' && q[4] === 'feed' && window.__hub && !window.__fdIn) { window.__fdLast = r; return nbFeed(); }
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && G[q[3]] && window.__hub && !window.__fdIn) { window.__fdIn = true; let h; try { h = G[q[3]](q[4]); } finally { window.__fdIn = false; } window.__fdLast = r; return h; }
    return base.call(this, r, ...a); };
})();
