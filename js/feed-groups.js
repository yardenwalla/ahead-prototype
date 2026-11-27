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
  // Nov 27 (Yarden: "I preferred the looks of the inspiration", and photos of the holds): a top card with the photo
  // beside the words, the feed as a numbered timeline of five small cards, then the holds (or a paced bottle) as photos.
  const ic = n => typeof hubArt === 'function' ? hubArt(n, CAT) : '';
  const hero = (eyebrow, title, lead, img) => `<div class="fd-hero"><div class="fd-hero-copy"><p class="fd-hero-eb">${F(eyebrow)}</p><h1>${F(title)}</h1><p>${F(lead)}</p></div><img class="fd-hero-img" src="assets/feeding/${img.replace(/^feeding\//, '')}.jpg?v=1" alt=""></div>`;
  const timeline = items => `<ol class="fd-tl">${items.map(([icon, t, sub], i) => `<li><span class="fd-tl-n">${i + 1}</span><div class="fd-tl-card"><span class="fd-tl-ic">${ic(icon)}</span><span><b>${F(t)}</b><small>${F(sub)}</small></span></div></li>`).join('')}</ol>`;
  // Nov 27, v3 (Yarden: "still a lot going on"; her bottle-feed mockup): the flow as five small photo steps in a row,
  // one technique card, photo rows with labels only, two short boxes side by side, and the video as one row.
  const flow = items => `<ol class="fd-flow">${items.map(([img, t, sub], i) => `<li><span class="fd-flow-img"><img src="assets/feeding/${img}.jpg" alt="" loading="lazy"><i>${i + 1}</i></span><b>${F(t)}</b><small>${F(sub)}</small></li>`).join('')}</ol>`;
  const strip = items => `<div class="fd-strip">${items.map(([img, t]) => `<figure><img src="assets/feeding/${img}.jpg" alt="" loading="lazy"><figcaption>${F(t)}</figcaption></figure>`).join('')}</div>`;
  const banner = (icon, t, sub, img, pill) => `<div class="fd-banner${img ? '' : ' is-text'}"><span class="fd-banner-ic">${ic(icon)}</span><div class="fd-banner-copy"><b>${F(t)}</b><span>${F(sub)}</span></div>${img ? `<span class="fd-banner-img"><img src="assets/feeding/${img}.jpg" alt="" loading="lazy">${pill ? `<i class="fd-level"></i><em>${F(pill)}</em>` : ''}</span>` : ''}</div>`;
  const PAIR_IC = { check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>', wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 17h7"/></svg>' };
  const pair = (a, b) => `<div class="fd-pair">${[a, b].map(([tone, icon, t, xs]) => `<section class="fd-pair-c is-${tone}"><b><span>${PAIR_IC[icon] || ic(icon)}</span>${F(t)}</b><ul>${xs.map(x => `<li>${F(x)}</li>`).join('')}</ul></section>`).join('')}</div>`;
  const watch = (img, t, sub, url) => `<a class="fd-watch" href="${url}" target="_blank" rel="noopener"><span class="fd-watch-img">${img ? `<img src="assets/feeding/${img}.jpg" alt="" loading="lazy">` : ''}<i><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg></i></span><span class="fd-watch-copy"><b>${F(t)}</b><small>${F(sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></a>`;
  // Nov 27 (Yarden's nursing mockup): nursing leads with the latch, the hardest part early on; then the rest of a feed
  // in three stages, holds and burps with one line each, two short notes and the video.
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
  // Nov 27 (Yarden's compact wireframe): the latch as one card (video, three steps, how it should feel), the rest of a
  // feed in one row, holds and burps as photo strips with names only, and one note.
  const nbNurse = () => {
    const vid = `<a class="fd-vid" href="https://www.youtube.com/watch?v=y--syZR0u1E" target="_blank" rel="noopener"><i><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg></i><b>${F('See a good latch up close')}</b><small>${F('A short video')}</small></a>`;
    const three = (xs, num) => `<ol class="fd-three${num ? ' is-num' : ''}">${xs.map(([t, x], k) => `<li>${num ? `<i>${k + 1}</i>` : ''}<b>${F(t)}</b><span>${F(x)}</span></li>`).join('')}</ol>`;
    const latch = `<section class="fd-card">${vid}${three([['Nose near nipple', 'Tummy to tummy.'], ['Wait for a wide mouth', 'Like a big yawn.'], ['Bring {o} close', 'Chin first, to you.']], true)}<div class="fd-feel"><span>${CHECK}</span><div><b>${F('You’ll feel a tug, not a pinch.')}</b><small>${F('{P} lips are turned out, chin against your breast.')}</small></div></div></section>`;
    const rest = `<section class="fd-card">${three([['Before', 'Rooting or hands to mouth.'], ['During', 'Listen for swallows. Pause or switch sides.'], ['When {s’s} done', '{S} {turn|turns} away or {relax|relaxes}.']])}</section>`;
    return page(head('heart', 'Newborn · First 6 weeks', 'A feed, start to finish', 'Get comfortable, follow {p} cues, and know when {s’s} done.'),
      sect('First, get a comfortable latch', '', latch) + sect('The rest of a feed', '', rest)
      + sect('Holds to try', '', `<section class="fd-card is-pad">${strip([['hold-crosscradle', 'Cross-cradle'], ['hold-cradle2', 'Cradle'], ['hold-laidback2', 'Laid-back'], ['hold-sidelying', 'Side-lying']])}</section>`)
      + sect('Ways to burp', '', `<section class="fd-card is-pad">${strip([['burp-shoulder', 'Over your shoulder'], ['burp-sitting', 'Sitting on your lap'], ['burp-tummy', 'Tummy-down']])}</section>`)
      + `<section class="fd-note is-pink"><b>${F('If it’s not going smoothly')}</b><p>${F('Pinching? Break the seal with a clean finger and try again. If most feeds still hurt or {s} can’t latch, a lactation consultant can help.')}</p></section>`); };
  const nbFeed = () => { if (window.__fdx && window.__fdx.nurses && window.__fdx.nurses()) return nbNurse();
 const X = window.__fdx || {}, nurse = X.nurses ? X.nurses() : true;
    const top = head(nurse ? 'heart' : 'bottle', 'Newborn · First 6 weeks', 'A feed, start to finish', nurse ? 'Follow {p} cues, take breaks, and know when {s’s} done.' : 'Follow {p} cues, pace the feed, and know when {s’s} done.');
    const steps = flow(nurse
      ? [['cue-2', 'Hunger cues', 'Rooting, hands to mouth'], ['hold-cradle', 'Latch on', 'Wide mouth, chin first'], ['nb-pause', 'Pause', 'When sucking slows'], ['nb-burp', 'Burp', 'Then the other side'], ['full', 'Fullness cues', 'Turning away, relaxed']]
      : [['cue-2', 'Hunger cues', 'Rooting, hands to mouth'], ['pace-step-1', 'Feed', 'Bottle about level'], ['pace-step-2', 'Pause', 'Tip it down to rest'], ['nb-burp', 'Burp', 'Every 2–3 oz'], ['full', 'Fullness cues', 'Turning away, relaxed']]);
    const how = nurse
      ? banner('heart', 'A good latch', 'Wide mouth, lips flared out. It should feel like a tug, not a pinch.')
        + sect('Holds to try', '', strip([['hold-crosscradle', 'Cross-cradle'], ['hold-cradle2', 'Cradle'], ['hold-laidback2', 'Laid-back'], ['hold-sidelying', 'Side-lying']]))
      : banner('bottle', 'A paced bottle', 'Keep the bottle about level, let {o} set the pace, and take breaks.', 'pace-level', 'About level');
    const notes = nurse
      ? pair(['pink', 'check', 'Good to know', ['Feed 8–12 times a day.', 'Start the next feed on the last side.', 'Spit-up and hiccups are common.']], ['lav', 'wind', 'If it’s not going smoothly', ['Pinching? Break the seal and try again.', 'Most feeds hurt? A lactation consultant can help.']])
      : pair(['pink', 'check', 'Good to know', ['About 2–4 oz, every 3–4 hours.', 'Never prop a bottle. Always hold {o}.', 'Spit-up and hiccups are common.']], ['lav', 'wind', 'If it’s not going smoothly', ['Gulping or coughing? Pause and tip the bottle down.', 'Fussing after feeds? Burp more often.']]);
    const vid = nurse ? watch('', 'Watch: A good latch', 'A short step-by-step video.', 'https://www.youtube.com/watch?v=y--syZR0u1E')
      : watch('pace-step-3', 'Watch: Pacing a bottle', 'A short look at a relaxed, baby-led feed.', 'https://www.youtube.com/watch?v=OGPm5SpLxXY');
    return page(top, sect('The simple flow', '', steps) + how + sect('Ways to burp', '', strip([['burp-shoulder', 'Over your shoulder'], ['burp-sitting', 'Sitting on your lap'], ['burp-tummy', 'Tummy-down']])) + notes + vid); };
  // Nov 27 (page-by-page pass to the nursing-page bar): pages that already lead with the right chart keep it; what sits
  // under it moves into the same compact pieces (a three-column card, a feel strip, short notes) instead of row stacks.
  const rowsOf = part => { if (!part) return []; const d = document.createElement('div'); d.innerHTML = part.html;
    return [...d.querySelectorAll('.hub-row')].map(r => [((r.querySelector('b') || {}).textContent || '').trim(), ((r.querySelector('small') || {}).textContent || '').trim()]); };
  const noteOf = part => { if (!part) return null; const d = document.createElement('div'); d.innerHTML = part.html; const p = [...d.querySelectorAll('p, .tpl-notes li')].find(x => x.querySelector('b') && !x.closest('.hub-row')); return p ? [p.querySelector('b').textContent.trim(), p.textContent.replace(p.querySelector('b').textContent, '').trim()] : null; };
  const BULB = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z"/></svg>';
  const colsCard = (xs, feel) => `<section class="fd-card"><ol class="fd-three">${xs.map(([t, x]) => `<li><b>${t}</b><span>${x}</span></li>`).join('')}</ol>${feel ? `<div class="fd-feel"><span>${/\?$/.test(feel[0]) ? BULB : CHECK}</span><div><b>${feel[0]}</b><small>${feel[1]}</small></div></div>` : ''}</section>`;
  const asGroup = root => { root.classList.add('fd-group'); return root; };
  // Nov 27 (Yarden: "does this look like the inspiration?" No, so rebuilt): the inspiration's shape (one card of three
  // rows, then one pink callout), with the numbers parents need kept inside the rows instead of in separate charts.
  const SPARK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l1.9 6.1 6.1 1.9-6.1 1.9L12 18.5l-1.9-6.1L4 10.5l6.1-1.9z"/></svg>';
  const listCard = rows => `<section class="fd-list">${rows.map(([icon, t, x, extra]) => `<div class="fd-list-r"><span class="fd-list-ic">${ic(icon)}</span><div><b>${F(t)}</b><span>${F(x)}</span>${extra || ''}</div></div>`).join('')}</section>`;
  const SUNSET = '<svg viewBox="0 0 24 24" fill="none" stroke="#9b4766" stroke-width="1.8" stroke-linecap="round"><path d="M3 18h18M6 18a6 6 0 0 1 12 0M12 6V3.5M4.9 9.9 3.5 8.5M19.1 9.9l1.4-1.4M7 21h10"/></svg>';
  const dayline = rows => `<section class="fd-list is-line">${rows.map(([icon, t, x, y]) => `<div class="fd-list-r"><span class="fd-list-ic">${icon === 'sunset' ? SUNSET : ic(icon)}</span><div><b>${F(t)}</b><span>${F(x)}</span>${y ? `<em>${F(y)}</em>` : ''}</div></div>`).join('')}</section>`;
  const callout = (t, x) => `<section class="fd-callout"><span>${SPARK}</span><div><b>${F(t)}</b><p>${F(x)}</p></div></section>`;
  const dayOfLife = () => { try { const p = JSON.parse(localStorage.getItem('ahead-v2-profile') || '{}'); return Math.floor((Date.now() - new Date(p.dob)) / 864e5) + 1; } catch (e) { return 10; } };
  // Nov 27 (Yarden's mockups, v3): the charts come back (they show what words can't), with what sits around them in
  // a few calm cards: a "good signs" card, one card for what to do and when to call, and a pink callout.
  const CLIP = '<svg viewBox="0 0 24 24" fill="none" stroke="#9b4766" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8.5 10h7M8.5 13.5h7M8.5 17h4"/></svg>';
  const rowsCard = rows => `<section class="fd-list">${rows.map(([icon, t, x]) => `<div class="fd-list-r"><span class="fd-list-ic">${icon === 'note' ? CLIP : ic(icon)}</span><div><b>${F(t)}</b><span>${F(x)}</span></div></div>`).join('')}</section>`;
  const dropSection = (root, heading) => { const h = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === F(heading)); if (!h) return; let n = h.nextElementSibling; while (n && !n.matches('h2')) { const nx = n.nextElementSibling; n.remove(); n = nx; } h.remove(); };
  // Nov 27 (Milk feeds pass): two-tile "see the difference" card, and a helper that lifts a card's small-print notes
  // out into a calm card (facts) and a pink callout (a question), so nothing is lost and nothing is small print.
  const compare = (a, b) => `<div class="fd-cmp">${[a, b].map(([tone, icon, t, x]) => `<section class="is-${tone}"><span class="fd-cmp-ic">${ic(icon)}</span><b>${F(t)}</b><small>${F(x)}</small></section>`).join('')}</div>`;
  const liftNotes = (card, icons) => { const ul = card && card.querySelector('.tpl-notes'); if (!ul) return; const facts = [], asks = [];
    [...ul.querySelectorAll('li')].forEach((li, i) => { const b = li.querySelector('b'), t = b ? b.textContent.trim().replace(/\.$/, '') : '', x = li.textContent.replace(b ? b.textContent : '', '').trim();
      (/\?$/.test(t) ? asks : facts).push([icons[i] || 'heart', t, x]); });
    ul.remove(); card.insertAdjacentHTML('afterend', (facts.length ? rowsCard(facts) : '') + asks.map(([, t, x]) => callout(t, x)).join('')); };
  const cardAfter = (root, heading) => { const h = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === F(heading)); return h && h.nextElementSibling; };
  const NB = {
    m1_eve: () => withPage('m1_eve', root => { asGroup(root);
      swapSection(root, 'What to do', rowsCard([['steth', 'Gaining well?', 'If your pediatrician says so, you can stop waking {o} for feeds.'], ['moon', 'When {s} {wake|wakes} hungry', 'Feed {o}. Keep it dim, and change {o} only if dirty.']])); }),
    m2_night: () => withPage('m2_night', root => { asGroup(root);
      const m = mo(), ck = m < 4 ? 4 : m < 6 ? 6 : m < 9 ? 9 : 12;
      swapSection(root, 'What to do', rowsCard([['moon', 'When {s} {wake|wakes}', 'Feed {o}. Keep it dim and quiet.'], ['steth', 'Want to drop a night feed?', 'Ask at {p} ' + ck + '-month checkup.']])); }),
    m2_away: () => withPage('m2_away', root => { asGroup(root); liftNotes(cardAfter(root, 'What to do'), ['clock', 'heart']); }),
    m1_apart: () => withPage('m1_apart', root => { asGroup(root); const h = root.querySelectorAll('h2'); const last = h[h.length - 1]; let c = last; while (c && !c.querySelector('.tpl-notes') && !c.matches('.tpl-notes')) c = c.nextElementSibling;
      if (c && c.matches('.tpl-notes')) { const w = document.createElement('section'); c.replaceWith(w); w.appendChild(c); c = w; }
      if (c) { liftNotes(c, ['bottle', 'clock']); if (!c.textContent.trim()) c.remove(); } }),
    nb_enough: () => withPage('nb_enough', root => { asGroup(root);
      const notes = root.querySelector('.tpl-notes'); if (notes) notes.remove();
      const w = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === F('{P} weight'));
      if (w) w.insertAdjacentHTML('beforebegin', rowsCard([['heart', 'Good signs during feeds', 'Long sucks and swallows you can hear, and {s’s} content for a while after most feeds.']]));
      dropSection(root, 'When to call');
      swapSection(root, 'What to do', rowsCard([['note', 'What to do', 'Note feeds and diapers until things feel settled. Checkups track {p} weight, so skip home scales.'], ['steth', 'When to call', 'Fewer wet diapers, dark urine, black poop after day 5, or not back to birth weight by 2 weeks.']])); }),
    nb_eve: () => withPage('nb_eve', root => { asGroup(root);
      const lead = root.querySelector('.ss-head .hub-lead, .ss-head p:last-child'); if (lead) lead.textContent = F('Evening cluster feeds are common and usually ease by 6–8 weeks.');
      const long = [...root.querySelectorAll('.hub-card, section, div')].find(e => /^How long it lasts/.test((e.textContent || '').trim()) && e.textContent.length < 160); if (long) long.remove();
      const todo = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === F('What to do'));
      let card = todo && todo.nextElementSibling; const notes = card && card.querySelector('.tpl-notes'); if (notes) notes.remove();
      if (card) card.insertAdjacentHTML('afterend', callout('Hard to wake for a feed?', 'Undress {o} to {p} diaper, or stroke {p} feet.')); })
  };
  const G = {
    // Milk feeds: hungrier days and distracted feeds on one page (the old two-step guide is gone).
    g_change: () => { const n = sections('m1_now'), lead = n['What to do'] ? (() => { const x = document.createElement('div'); x.innerHTML = n['What to do'].html; const p = x.querySelector('p, .hub-card-text, div'); return p ? p.textContent.trim().split('\n')[0] : ''; })() : '';
      return page(head('clock', 'How feeds are changing', 'Feeds change as {s} {grow|grows}', 'Hungrier days come and go, and daytime feeds get shorter. Both are common.'),
        sect('Hungrier days', lead || 'Feed more often for a few days, and things settle again.', n['What’s normal'] ? n['What’s normal'].html : '')
        + sect('Distracted feeds', 'Short daytime feeds are okay. {S} still {get|gets} enough over the day.',
          compare(['lav', 'eye', 'Busy room', 'Noise and movement, lots to watch'], ['pink', 'moon', 'Calmer spot', 'Dim and quiet. Save the chatting for later']))
        + callout('Try this', 'Feed when {s’s} drowsy, and let {o} hold your finger. Pops off? Try again a little later.')); },
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
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && NB[q[3]] && window.__hub && !window.__fdIn) { window.__fdIn = true; let h; try { h = NB[q[3]](); } finally { window.__fdIn = false; } window.__fdLast = r; return h; }
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && G[q[3]] && window.__hub && !window.__fdIn) { window.__fdIn = true; let h; try { h = G[q[3]](q[4]); } finally { window.__fdIn = false; } window.__fdLast = r; return h; }
    return base.call(this, r, ...a); };
})();
