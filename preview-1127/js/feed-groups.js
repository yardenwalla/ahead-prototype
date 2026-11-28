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
  const withPage = (id, add) => { const box = document.createElement('div'); box.innerHTML = window.changesRoute('chg:' + CAT + ':mock:' + id) || ''; const root = box.querySelector('.hub-page') || box.firstElementChild; if (!root) return ''; add(root); return box.innerHTML; };
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
  const swapSection = (root, heading, html, title) => { if (title) html = `<h2 class="hub-h2">${F(title)}</h2>` + html; const h = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === F(heading)); if (!h) return;
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
    const vid = `<a class="fd-vid has-img" href="https://www.youtube.com/watch?v=y--syZR0u1E" target="_blank" rel="noopener"><span class="fd-vid-img"><img src="assets/feeding/latch-thumb.jpg" alt="" loading="lazy"><i><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg></i></span><b>${F('See a good latch up close')}</b><small>${F('A short video')}</small></a>`;
    const three = (xs, num) => `<ol class="fd-three${num ? ' is-num' : ''}">${xs.map(([t, x, svg], k) => `<li>${num ? `<i>${k + 1}</i>` : ''}${svg ? `<em class="fd-three-ic">${svg}</em>` : ''}<b>${F(t)}</b><span>${F(x)}</span></li>`).join('')}</ol>`;
    const latch = `<section class="fd-card">${vid}${three([['Nose near nipple', 'Tummy to tummy.'], ['Wait for a wide mouth', 'Like a big yawn.'], ['Bring {o} close', 'Chin first, to you.']], true)}<div class="fd-feel"><span>${CHECK}</span><div><b>${F('You’ll feel a tug, not a pinch.')}</b><small>${F('{P} lips are turned out, chin against your breast.')}</small></div></div></section>`;
    const rest = `<section class="fd-card">${three([['Before', 'Rooting or hands to mouth.', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>'], ['During', 'Listen for swallows. Pause or switch sides.', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6v12M15 6v12"/></svg>'], ['When {s’s} done', '{S} {turn|turns} away or {relax|relaxes}.', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M9 14.5c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5M9.5 10h.01M14.5 10h.01"/></svg>']])}</section>`;
    return page(head('heart', 'Newborn · First 6 weeks', 'A feed, start to finish', 'Get comfortable, follow {p} cues, and know when {s’s} done.'),
      sect('First, get a comfortable latch', '', latch) + sect('The rest of a feed', '', rest)
      + sect('Holds to try', '', `<section class="fd-card is-pad">${strip([['hold-crosscradle', 'Cross-cradle'], ['hold-cradle2', 'Cradle'], ['hold-laidback2', 'Laid-back'], ['hold-sidelying', 'Side-lying']])}</section>`)
      + sect('Ways to burp', '', `<section class="fd-card is-pad">${strip([['burp-shoulder', 'Over your shoulder'], ['burp-sitting', 'Sitting on your lap'], ['burp-tummy', 'Tummy-down']])}</section>`)
      + `<section class="fd-note is-pink"><b>${F('If it’s not going smoothly')}</b><p>${F('Pinching? Break the seal with a clean finger and try again. If most feeds still hurt or {s} can’t latch, a lactation consultant can help, and check for tongue-tie.')}</p></section>`
      + `<p class="fd-lav"><b>${F('A first bottle?')}</b> ${F('Around 3–4 weeks, once nursing is going well.')}</p>`); };
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
      : pair(['pink', 'check', 'Good to know', [(d => d < 2 ? 'About 1–2 tsp, every 2–3 hours.' : d < 4 ? 'About 1 oz, every 2–3 hours.' : d < 14 ? 'About 1½–2 oz, every 2–3 hours.' : 'About 2–4 oz, every 3–4 hours.')(mo() * 30.44), 'Never prop a bottle. Always hold {o}.', 'Spit-up and hiccups are common.']], ['lav', 'wind', 'If it’s not going smoothly', ['Gulping or coughing? Pause and tip the bottle down.', 'Fussing after feeds? Burp more often.']]);
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
  const rowsCard = rows => `<section class="fd-list">${rows.map(([icon, t, x]) => `<div class="fd-list-r"><span class="fd-list-ic">${icon === 'note' ? CLIP : icon === 'sunset' ? SUNSET : ic(icon)}</span><div><b>${F(t)}</b><span>${F(x)}</span></div></div>`).join('')}</section>`;
  const dropSection = (root, heading) => { const h = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === F(heading)); if (!h) return; let n = h.nextElementSibling; while (n && !n.matches('h2')) { const nx = n.nextElementSibling; n.remove(); n = nx; } h.remove(); };
  // Nov 27 (Milk feeds pass): two-tile "see the difference" card, and a helper that lifts a card's small-print notes
  // out into a calm card (facts) and a pink callout (a question), so nothing is lost and nothing is small print.
  const compare = (a, b) => `<div class="fd-cmp">${[a, b].map(([tone, icon, t, x]) => `<section class="is-${tone}"><span class="fd-cmp-ic">${ic(icon)}</span><b>${F(t)}</b><small>${F(x)}</small></section>`).join('')}</div>`;
  const liftNotes = (card, icons) => { const ul = card && card.querySelector('.tpl-notes'); if (!ul) return; const facts = [], asks = [];
    [...ul.querySelectorAll('li')].forEach((li, i) => { const b = li.querySelector('b'), t = b ? b.textContent.trim().replace(/\.$/, '') : '', x = li.textContent.replace(b ? b.textContent : '', '').trim();
      (/\?$/.test(t) ? asks : facts).push([icons[i] || 'heart', t, x]); });
    ul.remove(); card.insertAdjacentHTML('afterend', (facts.length ? rowsCard(facts) : '') + asks.map(([, t, x]) => callout(t, x)).join('')); };
  const numCard = rows => `<section class="fd-num">${rows.map(([t, x], i) => `<div><i>0${i + 1}</i><span><b>${F(t)}</b><small>${F(x)}</small></span></div>`).join('')}</section>`;
  const numIcons = rows => `<section class="fd-list fd-numic">${rows.map(([svg, t, x], i) => `<div class="fd-list-r"><span class="fd-list-ic">${svg}<i>${i + 1}</i></span><div><b>${F(t)}</b><span>${F(x)}</span></div></div>`).join('')}</section>`;
  const nursing = () => !!(window.__fdx && window.__fdx.nurses && window.__fdx.nurses());
  const helpCard = (t, rows) => `<section class="fd-help"><header><span>${SPARK}</span><b>${F(t)}</b></header>${rowsCard(rows)}</section>`;
  const nightChart = () => { const m = mo(), k = m < 1.5 ? 0 : m < 2.5 ? 1 : m < 5 ? 2 : m < 8 ? 3 : 4;
    const rows = [['Newborn weeks', 4, 'Several a night'], ['Around 2 months', 3, 'Still common'], ['Around 3 months', 3, 'Often 1–2'], ['Around 6 months', 2, 'Often fewer'], ['Near 1 year', 1, 'Often none']];
    return `<div class="sv2 is-feed"><section class="sv2-vis"><header><em>${F('Night feeds over the first year')}</em><span>${F('Typical')}</span></header><div class="fd-tally">${rows.map(([l, nn, st], i) => `<div class="${i === k ? 'is-on' : ''}"><b>${F(l)}</b><span class="sv2-dots">${Array.from({ length: nn }, (_, j) => `<s class="${j === nn - 1 ? 'is-maybe' : ''}"></s>`).join('')}</span><em>${i === k ? `<i>${F('Now')}</i>` : ''}${F(st)}</em></div>`).join('')}</div><p class="sv2-key"><s></s>${F('One night feed')}<s class="is-maybe"></s>${F('Some nights')}</p></section></div>`; };
  const spurtChart = () => { const base = window.__fdSpurtFig ? window.__fdSpurtFig() : ''; if (!base) return '';
    const bump = c => `L${c - 46},140 C${c - 26},140 ${c - 20},${82} ${c},${82} C${c + 20},82 ${c + 26},140 ${c + 46},140`;
    const pill = (x, y, t, w, fill, ink) => `<rect x="${x - w / 2}" y="${y - 13}" width="${w}" height="24" rx="12" fill="${fill}"/><text x="${x}" y="${y + 3.5}" text-anchor="middle" style="fill:${ink};font-weight:700;font-size:11.5px">${F(t)}</text>`;
    const svg = `<svg viewBox="0 0 320 175" width="100%" aria-hidden="true" style="font:600 11px/1 var(--body-font, system-ui);fill:#6b6170"><path d="M14,140 ${bump(88)} ${bump(250)} L306,140" fill="#f7d9e5" stroke="#884866" stroke-width="2.5" stroke-linejoin="round"/>`
      + pill(88, 58, 'Growth spurt', 92, '#fbe4ec', '#884866') + pill(250, 58, 'Growth spurt', 92, '#fbe4ec', '#884866') + pill(169, 120, 'Calmer weeks', 92, '#efedf8', '#4f4a63')
      + `<text x="14" y="164">${F('Birth')}</text><text x="88" y="164" text-anchor="middle">${F('6 weeks')}</text><text x="169" y="164" text-anchor="middle">${F('2 months')}</text><text x="250" y="164" text-anchor="middle">${F('3 months')}</text></svg>`;
    return base.replace(/<svg[\s\S]*<\/svg>/, svg); };
  const doCard = (parts, note) => `<section class="fd-do"><p>${parts.map(([t, bold]) => bold ? `<b>${F(t)}</b>` : F(t)).join(' ')}</p>${note ? `<p class="fd-do-note"><b>${F(note[0])}</b> ${F(note[1])}</p>` : ''}</section>`;
  const photoRows = rows => `<section class="fd-list fd-photorows">${rows.map(([img, t, x]) => `<div class="fd-list-r"><span class="fd-pr-img"><img src="assets/feeding/${img}.jpg" alt="" loading="lazy"></span><div><b>${F(t)}</b><span>${F(x)}</span></div></div>`).join('')}</section>`;
  const checkCard = rows => `<section class="fd-list fd-checks">${rows.map(([t, x]) => `<div class="fd-list-r"><span class="fd-ck">${CHECK}</span><div><b>${F(t)}</b><span>${F(x)}</span></div></div>`).join('')}</section>`;
  const stageTiles = xs => `<div class="fd-stiles">${xs.map(([img, pill, tone, t, x]) => `<section><span class="fd-st-img"><img src="assets/feeding/${img}.jpg" alt="" loading="lazy"></span><em class="is-${tone}">${F(pill)}</em><b>${F(t)}</b><small>${F(x)}</small></section>`).join('')}</div>`;
  const textRows = rows => `<section class="fd-list fd-trows">${rows.map(([t, x]) => `<div class="fd-list-r"><div><b>${F(t)}</b><span>${F(x)}</span></div></div>`).join('')}</section>`;
  const realMo = () => (window.__fdx && window.__fdx.realMo) ? window.__fdx.realMo() : mo();
  const feverCall = () => realMo() < 3 ? { right: 'a rectal temperature of 100.4°F or higher' } : {};
  const fevTail = () => { const m = realMo(); return m < 3 ? '' : ', or a fever that lasts more than a day or reaches ' + (m < 6 ? '101' : '103') + '°F'; };
  const photoNotice = (img, pos, cap, chips) => `<section class="fd-pn"><figure><img src="assets/${img}.jpg" alt="" loading="lazy" style="object-position:50% ${pos}"><figcaption>${F(cap)}</figcaption></figure><div>${chips.map(c => `<span>${F(c)}</span>`).join('')}</div></section>`;
  const numRows = (rows, foot) => `<section class="fd-list fd-numrows">${rows.map(([t, x], i) => `<div class="fd-list-r"><span class="fd-nr">${i + 1}</span><div><b>${F(t)}</b><span>${F(x)}</span></div></div>`).join('')}${foot ? `<p class="fd-foot"><b>${F(foot[0])}</b> ${F(foot[1])}</p>` : ''}</section>`;
  const swapHelps = (root, rows) => { const h = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === 'What helps'); if (!h) return; let n = h.nextElementSibling; while (n && !/^H2$/.test(n.tagName)) { const nx = n.nextElementSibling; n.remove(); n = nx; } h.insertAdjacentHTML('afterend', rowsCard(rows)); };
  const cardAfter = (root, heading) => { const h = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === F(heading)); return h && h.nextElementSibling; };
  // Nov 27 (Yarden's mockup): formula families get one page, start to finish, instead of four steps. The type switch
  // changes only the making steps; storage and cleaning are the same for every type.
  const fmPage = () => { const X = window.__fdx || {}, br = X.isBreast ? X.isBreast() : false;
    const card = (img, n, t, x) => `<section class="fd-fm-step"><span class="fd-fm-img"><img src="assets/feeding/${img}.jpg" alt="" loading="lazy"><i>${n}</i></span><b>${F(t)}</b><small>${F(x)}</small></section>`;
    const tabs = [['rtf', 'Ready-to-feed'], ['powder', 'Powder'], ['conc', 'Concentrate']];
    const make = {
      powder: ['Make a powder bottle', 'Follow the label exactly. Never water it down.', card('formula-1', 1, 'Start clean', 'Clean hands and bottle.') + card('formula-water', 2, 'Water first', 'Boiled, cooled 5 minutes.') + card('formula-scoop', 3, 'Level scoops', 'Flat, never heaped. Then shake.') + card('formula-4', 4, 'Test on your wrist', 'Warm, never hot.')],
      conc: ['Make a concentrate bottle', 'Follow the label exactly. Never water it down.', card('formula-1', 1, 'Start clean', 'Clean hands and bottle.') + card('formula-water', 2, 'Water first', 'Boiled, cooled 5 minutes.') + card('formula-conc', 3, 'Then concentrate', 'The amount on the label. Swirl.') + card('formula-4', 4, 'Test on your wrist', 'Warm, never hot.')],
      rtf: ['Pour a ready-to-feed bottle', 'No water, no mixing.', card('formula-1', 1, 'Start clean', 'Clean hands and bottle.') + card('formula-rtf', 2, 'Shake and pour', 'Feed it as it is.')] };
    const rtfRows = rowsCard([['hand', 'Start clean', 'Clean hands and bottle.'], ['bottle', 'Shake and pour', 'Feed it as it is.'], ['clock', 'Opened?', 'Refrigerate it, and use it by the time on the label.']]);
    const alert = `<section class="fd-alert"><span>!</span><div><b>${F('Extra care for young or premature babies')}</b><p>${F('Powder isn’t sterile. Under 2 months or born early, ready-to-feed is safest. Ask your pediatrician if your tap water is safe.')}</p></div></section>`;
    const top = head('bottle', 'Bottles · How to', 'Formula, start to finish', 'Make it, store it, clean up.');
    const body = `<div class="fd-fm" data-t="powder"><h2 class="hub-h2">${F('Which type are you using?')}</h2><div class="fd-seg">${tabs.map(([k, l]) => `<button class="is-${k}" onclick="this.closest('.fd-fm').dataset.t='${k}'">${F(l)}</button>`).join('')}</div>`
      + `<p class="fd-g-lead">${F('Any iron-fortified formula works. Switching brands is fine.')}</p>`
      + Object.entries(make).map(([k, [t, line, cards]]) => `<div class="fd-fm-t is-${k}"><h2 class="hub-h2">${F(t)}</h2><p class="fd-g-lead">${F(line)}</p><div class="fd-fm-grid">${cards}</div>${k === 'powder' ? alert : k === 'rtf' ? `<p class="fd-pnote is-plain"><b>${F('Opened?')}</b> ${F('Refrigerate it, and use it by the time on the label.')}</p>` : ''}</div>`).join('')
      + `</div>`
      + sect('How long it keeps', '', `<div class="fd-keep"><section class="is-pink"><b>2 h</b><span>${F('After mixing')}</span><small>${F('At room temperature')}</small></section><section class="is-blue"><b>24 h</b><span>${F('In the fridge')}</span><small>${F('If chilled right away')}</small></section><section class="is-green"><b>1 h</b><span>${F('Once a feed starts')}</span><small>${F('Then toss what’s left')}</small></section></div>`)
      + `<p class="fd-pnote is-plain"><b>${F('Remember:')}</b> ${F('Don’t reuse leftovers or microwave a bottle. Warm it in a bowl of warm water.')}${br ? ' ' + F('Breast milk keeps longer: 4 hours out, 4 days in the fridge.') : ''}</p>`
      + sect('Clean after every feed', '', `<ol class="fd-three is-clean"><li><em class="fd-three-ic">${ic('hand')}</em><b>${F('1. Take apart')}</b><span>${F('Bottle, nipple and ring.')}</span></li><li><em class="fd-three-ic">${ic('drop')}</em><b>${F('2. Wash')}</b><span>${F('In hot, soapy water, or the dishwasher.')}</span></li><li><em class="fd-three-ic">${ic('sun')}</em><b>${F('3. Air-dry')}</b><span>${F('On a rack, not a towel.')}</span></li></ol>`)
      + callout('Sanitize once a day for now', 'Boil 5 minutes, steam, or a sanitize cycle. Most important under 2 months.');
    return page(top, body, 'howto'); };
  // Nov 27 (Yarden's mockup): "Using expressed milk".
  const bmPage = () => { const T = H().TPLB;
    const steps = [['bm-oldest', 'Oldest first', 'From the fridge, or thawed frozen milk.'], ['bm-swirl2', 'Swirl gently', 'The cream layer is common.'], ['bm-warm', 'Warm or cool', 'Test a few drops on your wrist.']];
    const table = `<section class="fd-tbl2"><div class="is-h">${F('Milk')}</div><div class="is-h">${F('Counter')}</div><div class="is-h">${F('Fridge')}</div><div class="is-h">${F('Freezer')}</div><b>${F('Fresh')}</b><div>${F('4 hrs')}</div><div>${F('4 days')}</div><div>${F('6 mo')}<small>${F('best')}</small></div><b>${F('Thawed')}</b><div>${F('1–2 hrs')}</div><div>${F('24 hrs')}</div><div>${F('Never')}<small>${F('refreeze')}</small></div></section>`;
    return page(head('bottle', 'Bottles · How to', 'Using pumped milk', 'Make a bottle, check storage times, and clean up, all in one place.'),
      sect('Get a bottle ready', '', `<section class="fd-bm"><div class="fd-bm-3">${steps.map(([img, t, x], k) => `<div><span class="fd-fm-img"><img src="assets/feeding/${img}.jpg" alt="" loading="lazy"><i>${k + 1}</i></span><b>${F(t)}</b><small>${F(x)}</small></div>`).join('')}</div><p class="fd-pnote"><b>${F('Never microwave.')}</b> ${F('It heats unevenly and can burn.')}</p></section>`)
      + sect('How long milk keeps', '', table)
      + `<p class="fd-pnote"><b>${F('Once {s} {start|starts} a bottle:')}</b> ${F('use what’s left within 2 hours after the feed ends.')}</p><p class="fd-g-lead">${F('Freeze it flat in 2–4 oz bags. Out and about? A cooler with frozen ice packs keeps milk cold for up to 24 hours.')}</p>`
      + sect('Clean after every feed', '', `<section class="fd-clean3"><ol>${[['Take apart', 'Bottle, nipple, pump parts'], ['Wash', 'Hot, soapy water or dishwasher'], ['Air-dry', 'On a clean rack']].map(([t, x], k) => `<li><i>${k + 1}</i><b>${F(t)}</b><span>${F(x)}</span></li>`).join('')}</ol><p class="fd-foot2"><b>${F('Sanitize daily')}</b> ${F('if {s’s} under 2 months, born early, or has a weak immune system. Boil 5 minutes, steam, or use a sanitize cycle.')}</p></section>`)
      + `<p class="fd-lav"><b>${F('Every day:')}</b> ${F('vitamin D drops. If you ever add formula, any iron-fortified one works.')}</p>`, 'howto'); };
  const NB = {
    // v3 (Yarden: liked the befores; her mockups): the befores, with a tighter night chart, icon rows for what to do,
    // and the early-weeks-only "hard to wake" callout.
    // v4 (Yarden's mockup): chart, then one compact action card with the key action in bold and a call line.
    m1_eve: () => withPage('m1_eve', root => { asGroup(root); root.querySelectorAll('h1').forEach(h => { h.textContent = h.textContent.replace('are normal', 'are common'); }); swapSection(root, 'What’s normal', nightChart(), 'How night feeds change');
      swapSection(root, 'What to do', doCard([['Once your pediatrician confirms {s’s} gaining well, you can stop waking {o}.'], ['Feed {o} when {s} {wake|wakes} hungry.', 1], ['Keep nights dim and quiet.']],
        ['Hard to wake or too sleepy to feed?', 'Call your pediatrician.']), 'What to do'); }),
    m2_night: () => withPage('m2_night', root => { asGroup(root); swapSection(root, 'What’s normal', nightChart(), 'How night feeds change');
      const m = mo(), ck = m < 4 ? 4 : m < 6 ? 6 : m < 9 ? 9 : 12;
      swapSection(root, 'What to do', doCard([['Feeding {o} back to sleep is fine. Keep nights dim and quiet.'], ['Ask about dropping night feeds at {p} ' + ck + '-month checkup.', 1]]), 'What to do'); }),
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
    nb_eve: () => withPage('nb_eve', root => { asGroup(root); root.querySelectorAll('h2').forEach(h => { if (/What’s normal/.test(h.textContent)) h.textContent = F('A newborn evening and night'); });
      const lead = root.querySelector('.ss-head .hub-lead, .ss-head p:last-child'); if (lead) lead.textContent = F('Evening cluster feeds are common and usually ease by 6–8 weeks.');
      const long = [...root.querySelectorAll('.hub-card, section, div')].find(e => /^How long it lasts/.test((e.textContent || '').trim()) && e.textContent.length < 160); if (long) long.remove();
      const todo = [...root.querySelectorAll('h2')].find(x => x.textContent.trim() === F('What to do'));
      let card = todo && todo.nextElementSibling; const notes = card && card.querySelector('.tpl-notes'); if (notes) notes.remove();
      if (card) card.insertAdjacentHTML('afterend', callout('Hard to wake for a feed?', 'Undress {o} to {p} diaper, or stroke {p} feet.')); })
  };
  const G = {
    day: () => G.fd_day(),
    // Milk feeds: hungrier days and distracted feeds on one page (the old two-step guide is gone).
    g_change: () => { const n = sections('m1_now'), lead = n['What to do'] ? (() => { const x = document.createElement('div'); x.innerHTML = n['What to do'].html; const p = x.querySelector('p, .hub-card-text, div'); return p ? p.textContent.trim().split('\n')[0] : ''; })() : '';
      return page(head('clock', 'How feeds are changing', 'Feeds change as {s} {grow|grows}', 'Hungrier days come and go, and daytime feeds get shorter. Both are common.'),
        sect('Hungrier days', lead || 'Feed more often for a few days, and things settle again.', spurtChart())
        + sect('Distracted feeds', 'Short daytime feeds are okay. {S} still {get|gets} enough over the day.',
          helpCard('What helps', [['moon', 'Feed when {s’s} drowsy', '{S} may settle in more easily.'], ['hand', 'Let {o} hold your finger', 'It can help {o} stay focused.'], ['chat', 'Save the chatting for later', 'A quiet spot means less to look at.'], ['clock', 'Pops off? Try again a little later', '{S} may just need a short break.']]))); },
    // How to start: the safety rows become one short tips box (no mismatched icons).
    // Nov 27 (Ready for solids, Yarden's mockups): three ways as photo rows first, the iron-rich foods grid, then one
    // "before the first bite" callout that keeps every safety line from the old tips box.
    // v2 (Yarden's own mockups): three calm pages: photo tiles, one checklist, one callout or plain note.
    z_start: () => withPage('z_start', root => { asGroup(root); const tpl = root.querySelector('.care-tpl'); if (!tpl) return; const T = H().TPLB;
      const ironH = [...tpl.querySelectorAll('h2')].find(h => /Iron-rich/.test(h.textContent)), grid = ironH && ironH.nextElementSibling;
      tpl.innerHTML = sect('Three ways to start', '', T.photoGrid([['feeding/tx-avo-1', 'Spoon-fed', 'Smooth or mashed, then thicker'], ['feeding/opt-egg', 'Finger foods', 'Soft strips {s} can hold'], ['feeding/way-mix', 'A mix', 'Try both, at {p} pace']]))
        + sect('Iron-rich first foods', 'Offer an iron-rich food from the beginning.', '');
      if (grid) tpl.appendChild(grid);
      tpl.insertAdjacentHTML('beforeend', sect('Before the first bite', '', checkCard([['Seated upright, with you', 'In a supportive high chair, watched the whole time.'], ['Soft enough to squash', 'In a safe size, shape and texture.']]))
        + `<p class="fd-lav">${F('Milk is still {p} main food. Start with small tastes, and skip added salt or sugar.')}</p>`); }),
    z_ready: () => withPage('z_ready', root => { asGroup(root); dropSection(root, 'In the first tastes');
      swapSection(root, 'What to do', callout('When these signs come together', 'Once you’ve seen all three, ask about starting at {p} 6-month checkup.')); }),
    z_iron: () => { const X = window.__fdx || {}, br = X.isBreast ? X.isBreast() : true, fam = X.formulaFam ? X.formulaFam() : false;
      if (!br) return withPage('z_iron', root => { asGroup(root); const c = cardAfter(root, 'What to do'); if (!c) return;
        const ps = [...c.querySelectorAll('p, li')].filter(x => !x.querySelector('p, li')), note = ps.find(p => p.querySelector('b')), main = ps.filter(p => p !== note).map(p => p.textContent.trim()).filter(Boolean);
        swapSection(root, 'What to do', doCard([['Offer an iron-rich food most days, even a small amount.', 1]].concat(main.map(t => [t])), note ? [note.querySelector('b').textContent.trim(), note.textContent.replace(note.querySelector('b').textContent, '').replace('normal', 'common').trim()] : null), 'What to do'); });
      return page(head('drop', 'Iron', 'Iron matters before and after first foods', 'Babies who get mostly breast milk may need iron drops before food gives them enough.'),
        sect('What changes, and when', '', stageTiles([['vitd-drop', 'Before solids', 'pink', 'Ask about iron drops', 'Often from about 4 months. Timing and amount depend on {p} feeding and birth history.'], ['iron-meat', 'With first foods', 'green', 'Offer iron-rich foods', 'Iron-fortified cereal, soft meat or mashed beans.']]))
        + callout('Ask about {p} iron needs now', 'Especially if {s} arrived early. {P} pediatrician can tell you whether to give drops, how much, and when to stop.')
        + sect('Good to know', '', rowsCard([['drop', 'Keep up the drops', 'Even as foods start, until {p} pediatrician says to stop.'], fam && ['bottle', 'Also on formula?', 'Iron-fortified formula may already cover {p} needs. Ask if you’re unsure.'], ['diaper', 'Darker poop?', 'Iron can cause it. That’s common.']].filter(Boolean))), 'expect'); },
    // v3 (Yarden's own mockups): the old photo page with clearer headings; the grape photo gets its own section.
    z_plan: () => withPage('z_plan', root => { asGroup(root); const lead = root.querySelector('.hub-lead'); if (lead) lead.textContent = F('A few foods need to wait. Others are safe once they’re prepared differently.');
      const h = [...root.querySelectorAll('h2')].find(x => /differently/.test(x.textContent)); if (!h) return; h.textContent = F('Change the shape, not the food');
      const fig = h.nextElementSibling, pins = fig ? fig.querySelectorAll('.ph-pin > span') : [];
      if (pins[0]) pins[0].innerHTML = '✕ ' + F('Whole: choking risk'); if (pins[1]) pins[1].innerHTML = '✓ ' + F('Cut lengthwise');
      if (fig) { fig.classList.add('fd-grapefig'); fig.insertAdjacentHTML('afterend', `<p class="fd-figcap"><b>${F('Grapes and cherry tomatoes:')}</b> ${F('quarter them lengthwise, until about age 4.')}</p>`); }
      const rows = fig && fig.nextElementSibling && fig.nextElementSibling.nextElementSibling; if (rows) { const g = [...rows.querySelectorAll('.hub-row')].find(r => /Grapes/.test(r.textContent)); if (g) g.remove();
        rows.insertAdjacentHTML('beforebegin', `<h2 class="hub-h2">${F('Other common choking hazards')}</h2>`); } }),
    z_gag: () => withPage('z_gag', root => { asGroup(root); const lead = root.querySelector('.hub-lead'); if (lead) lead.textContent = F('Gagging helps {o} learn to eat. Choking needs action right away.');
      const v = root.querySelector('.tpl-versus');
      if (v) v.innerHTML = `<div><div class="is-ok"><b>${F('Gagging')}</b><p>${F('Loud coughing or gagging, red face, watery eyes.')}</p><em>${CHECK} ${F('Stay close while {s} {cough|coughs} it out')}</em></div><div class="is-act"><b>${F('Choking')}</b><p>${F('Can’t cry or cough, or only a weak cough or high-pitched sound. Lips may turn blue.')}</p><em>! ${F('Act now')}</em></div></div>`;
      const ren = { 'Get help': 'Call 911', '5 back blows': 'Give 5 back blows', '5 chest thrusts': 'Give 5 chest thrusts' };
      root.querySelectorAll('.ct-steps2 b').forEach(b => { const n = [...b.childNodes].find(x => x.nodeType === 3 && x.textContent.trim()); if (n && ren[n.textContent.trim()]) n.textContent = ren[n.textContent.trim()]; });
      root.querySelectorAll('b').forEach(b => { if (b.textContent.trim() === 'Foods to wait on') { const sm = b.parentNode.querySelector('small'); if (sm) sm.textContent = F('Honey, and foods that need a safer shape'); } }); }),
    // Nov 27 (Meals, Yarden's own mockups): the photos and the week chart stay; rows carry the extra lines.
    z_meal: () => withPage('z_meal', root => { asGroup(root);
      swapSection(root, 'What to do', rowsCard([['bowl', 'Share from your plate', 'Take out {p} portion before adding salt.'], ['hand', 'Let {o} feed {o}self', 'Fingers first, and a spoon to practice. Expect some mess.']])
        + callout('Keep it soft', 'Pieces should be easy to mash with your fingers.'), 'How to do it'); }),
    z_day: () => withPage('z_day', root => { asGroup(root);
      const wk = root.querySelector('.tpl-week'); if (wk) wk.innerHTML = wk.innerHTML.replace('not the day', 'not one meal').replace('That’s normal.', 'That’s common.').replace("That's normal.", "That's common.");
      const h = [...root.querySelectorAll('h2')].find(x => /day by day/.test(x.textContent)); if (h) h.textContent = F('A week of appetites');
      swapSection(root, 'What to do', rowsCard([['heart', 'Offer, then let {o} decide', 'No coaxing, bribes or extra bites.'], ['bowl', 'Pair new with familiar', 'Something {s} likes, next to something new.'], ['drop', 'Getting enough?', 'Wet diapers, energy, and steady growth at checkups.']]), 'What helps'); }),
    z_milk12: () => withPage('z_milk12', root => { asGroup(root); const X = window.__fdx || {}, nurseOnly = X.nurses && X.nurses() && !(X.formulaFam && X.formulaFam()), m = Math.floor(mo());
      const lead = root.querySelector('.hub-lead'); if (lead && m < 12) lead.textContent = F('Cups are kinder to teeth, and practice now makes the switch easier.');
      const photoH = [...root.querySelectorAll('h2')].find(x => /Milk from a cup/.test(x.textContent)); if (photoH) { const img = photoH.nextElementSibling && photoH.nextElementSibling.querySelector('img'); if (img) img.src = 'assets/feeding/cup-straw.jpg'; photoH.remove(); }
      swapSection(root, 'What to do', `<div class="fd-twot is-ic"><section class="is-lav"><em>${F(m < 12 ? 'Now' : 'Every day')}</em><span class="fd-tw-ic">${ic('cup')}</span><b>${F('Practice with a cup')}</b><small>${F('Small sips of water from an open or straw cup, at meals.')}</small></section>`
        + `<section class="is-peach"><em>${F('At 12 months')}</em><span class="fd-tw-ic">${ic('bottle')}</span><b>${F('Whole milk can start')}</b><small>${F('From a cup, not low-fat. Up to 24 oz a day, so there’s room for iron-rich food.')}</small></section></div>`
        + `<h2 class="hub-h2">${F('Good to know')}</h2>` + rowsCard([nurseOnly ? ['heart', 'Nursing can carry on', 'As long as you both like.'] : ['bottle', 'Phase out bottles', 'Between 12 and 18 months. Swap one for a cup each week.'], !nurseOnly && X.formulaFam && X.formulaFam() && ['cup', 'Picky about the taste?', 'Mix half and half with formula for a week. Toddler formula isn’t needed.'], ['sun', 'Vitamin D after 1', 'Ask your pediatrician how much {s} {need|needs}.']].filter(Boolean)), 'The transition at a glance'); }),
    fd_day: () => { const X = window.__fdx || {}; if (X.stg && X.stg() < 4) return G.fd_day_early(); if (!(X.stg && X.stg() === 4)) return window.changesRoute('chg:' + CAT + ':mock:fd_day');
      const parts = [['rot-oats', 'Morning', [['7 am', 'milk'], ['8 am', 'breakfast']]], ['plate-veg', 'Midday', [['10 am', 'snack'], ['12 pm', 'lunch'], ['', 'Water from a cup'], ['1 pm', 'milk before a nap']]], ['opt-banana', 'Afternoon', [['3:30 pm', 'snack']]], ['opt-pasta', 'Evening', [['5:30 pm', 'dinner'], ['7 pm', 'milk before bed']]]];
      return page(head('heart', 'Example day', 'A day at 9–12 months', 'An example, not a schedule. {S} {lead|leads}, and no two days look the same.'),
        sect('Example day', '', `<section class="fd-list fd-photorows fd-dayrows">${parts.map(([img, t, xs]) => `<div class="fd-list-r"><span class="fd-pr-img"><img src="assets/feeding/${img}.jpg" alt="" loading="lazy"></span><div><b>${F(t)}</b><span>${xs.map(([h, x]) => h ? `<strong>${h}</strong> ${F(x)}` : F(x)).join(' · ')}</span></div></div>`).join('')}</section>`)
        + callout('There’s room to flex', 'Milk feeds and meals can move around naps, appetite, and your family’s routine.'), 'expect'); },
    // Nov 27 (Feeding challenges, Yarden's recommended updates). Each page: what it looks like, what to try, one note,
    // then the app's standard "When to call" card so the exact thresholds stay.
    x_gas: () => { const m = mo(), T = H().TPLB;
      return page(head('eye', 'Feeding challenges', 'Gas can make feeds fussy', m < 4 ? 'A little discomfort is common, and it usually eases by 3–4 months.' : 'A little is common. A lot, past 4 months, is worth a mention at the next checkup.'),
        sect('What gas can look like', '', compare(['pink', 'hand', 'Squirming or pulling up legs', 'Often between feeds'], ['lav', 'heart', 'Passing gas, then settling', 'Discomfort may come and go']))
        + sect('What helps', '', `<section class="fd-try">${T.photoGrid([['feeding/burp-shoulder', 'Burp midway', 'Pause gently when {s} {need|needs} it.'], ['feeding/gas-bicycle', 'Move {p} legs', 'Bicycle them while {s’s} on {p} back and awake.']])}${rowsCard([m < 6 && ['sun', 'And tummy time', 'While awake and watched, between feeds.'], ['drop', 'Gas drops or gripe water?', 'Drops are safe, but often don’t help. Ask before gripe water.']].filter(Boolean))}</section>`)
        + T.calls({ ped: 'crying 3 or more hours a day.', right: realMo() < 3 ? 'a rectal temperature of 100.4°F or higher' : '', now: 'grunting with every breath, ribs pulling in, or blue lips.', nowLabel: 'Call 911' }), 'expect'); },
    // Nov 27 (Yarden's pick from the Show and Tell zip): spot the clue, try the fix.
    x_refuse: () => { const m = mo(), X = window.__fdx || {}, bot = !(X.nurses && X.nurses()), T = H().TPLB;
      const rows = [['Gulps, coughs or fusses', 'Slow things down', bot ? 'Pause, let {o} settle, and check the nipple isn’t too fast.' : 'Pause, let {o} settle, and try a more laid-back hold.'], m >= 3 && ['Looks around mid-feed', 'Find a calm spot', 'Less light and noise can help {o} focus.'], ['Sounds stuffy', 'Clear {p} nose', 'Try saline drops, and gentle suction if needed.']].filter(Boolean);
      const ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>';
      return page(head(bot ? 'bottle' : 'heart', 'Feeding challenges', 'Pulling away during feeds', 'A clue often comes just before {s} {pull|pulls} off.'),
        sect('Spot the clue → try the fix', '', `<section class="fd-clue">${rows.map(([n, t, x]) => `<div><span class="fd-cl-if"><em>${F('If ' + '{s}' + '…')}</em>${F(n)}</span><span class="fd-cl-arr">${ARROW}</span><div><em>${F('Try this')}</em><b>${F(t)}</b><small>${F(x)}</small></div></div>`).join('')}</section>`)
        + `<p class="fd-lav"><b>${F('Still pulling off?')}</b> ${F('Give {o} a moment. If {s} {seem|seems} hungry, reposition and offer again.' + (m >= 3 ? ' Shorter feeds can happen as babies grow.' : ''))}</p>`
        + T.calls({ ped: '{s} {refuse|refuses} several feeds in a row, {have|has} fewer wet diapers, or {are|is} unusually sleepy.', ...feverCall() }), 'expect'); },
    x_gain: () => withPage('x_gain', root => { asGroup(root); swapHelps(root, [['clock', 'Feed often', realMo() < 1 ? '8–12 times a day in the first weeks.' : 'On cue, and more often if your pediatrician says.'], ['steth', 'Follow your pediatrician’s plan', 'Top-ups or set feed times, if they’re suggested.']]); root.querySelectorAll('.care-calls p').forEach(p => { p.innerHTML = p.innerHTML.replace('feeds, or diapers stay low for a day, or', 'feeds, diapers stay low for a day, or'); }); const cap = [...root.querySelectorAll('figcaption, .fd-growth-cap, p')].find(x => /same curve/.test(x.textContent));
      const note = `<p class="fd-lav"><b>${F('Your pediatrician reads the curve.')}</b> ${F('One weigh-in can look low. Ask at the next checkup what {p} pattern means.')}</p>`;
      const fig = cap && (cap.closest('figure, section, .fd-card') || cap); if (fig) fig.insertAdjacentHTML('afterend', note); }),
    x_hurt: () => { const X = window.__fdx || {}; if (!(X.nurses && X.nurses())) return G.x_refuse(); const T = H().TPLB;
      return page(head('heart', 'Feeding challenges', 'Feeds shouldn’t keep hurting', 'Pain past the first minute is a reason to adjust the latch and get help.'),
        sect('First, check the latch', '', numCard([['Break the seal', 'If it pinches, slide a clean finger into the corner of {p} mouth.'], ['Try again, chin first', 'Nose to nipple, and wait for a wide-open mouth.'], ['Check how it feels', 'A deep latch may tug, but shouldn’t keep pinching.']]))
        + sect('See the technique', '', watch('latch-thumb', 'How a deep latch looks', 'A short video · Global Health Media', 'https://www.youtube.com/watch?v=wjt-Ashodw8'))
        + `<p class="fd-lav"><b>${F('Try another hold.')}</b> ${F('Cradle or laid-back can make it easier to bring {o} close. A lactation consultant can check the latch too.')}</p>`
        + T.calls({ ped: 'feeds still hurt after the first week, nipples crack or bleed, or {s} {seem|seems} hungry after most feeds.' }), 'expect'); },
    x_allergy: () => { const T = H().TPLB;
      return page(head('steth', 'Feeding challenges', 'A milk allergy is uncommon', 'Symptoms are worth checking, but most everyday feeding troubles aren’t allergies.'),
        sect('What deserves a closer look', '', compare(['pink', 'diaper', 'Blood or mucus in the poop', 'Especially with other feeding symptoms'], ['lav', 'star', 'A rash, hives, or repeated vomiting', 'After feeds, or with other signs']))
        + `<p class="fd-lav"><b>${F('Gas or spit-up alone?')}</b> ${F('These are common, and don’t usually mean a milk allergy.')}</p>`
        + sect('What to do next', '', rowsCard([['note', 'Note what you see', 'Take a photo, and jot down when it happens.'], ['steth', 'Talk with {p} pediatrician', 'Ask before removing foods or changing formula.']]))
        + T.calls({ ped: 'you see either of these, or {s’s} gaining slowly.', now: 'trouble breathing, or swelling of the lips or face.', nowLabel: 'Call 911' }), 'expect'); },
    z_sick: () => { const T = H().TPLB, X = window.__fdx || {}, milk = X.isBreast && X.isBreast() ? (X.formulaFam && X.formulaFam() ? 'breast milk or formula' : 'breast milk') : 'formula';
      return page(head('thermo', 'Feeding challenges', 'When {s’s} sick, milk comes first', 'It’s okay if solids take a back seat for a little while.'),
        sect('What matters most today', '', doCard([['Offer breast milk or formula more often, in smaller amounts.']]))
        + sect('Make feeds a little easier', '', rowsCard([['drop', 'Clear a stuffy nose', 'Saline drops, then gentle suction, before feeds.'], ['heart', 'Watch energy and diapers', 'Can {s} stay awake to feed? Are wet diapers still happening?']]))
        + T.calls({ ped: realMo() < 3 ? 'fewer wet diapers, or vomiting that keeps happening.' : 'fewer wet diapers, vomiting that keeps happening, or a fever over a day or ' + (realMo() < 6 ? '101' : '103') + '°F.', ...feverCall(), now: 'trouble breathing, or {s’s} very hard to wake.', nowLabel: 'Call 911' }), 'expect'); },
    x_tough: () => { const X = window.__fdx || {}; if (!(X.stg && X.stg() >= 3)) return withPage('x_tough', root => { asGroup(root);
        const ttl = root.querySelector('.dev-area-head h1'); if (ttl) ttl.textContent = F('Common feeding worries, and what helps');
        const lead = root.querySelector('.hub-lead'); if (lead) lead.textContent = F('Find what you’re seeing, then the right next step.');
        const grid = root.querySelector('.fdt-grid'); if (grid) grid.insertAdjacentHTML('beforebegin', `<h2 class="hub-h2">${F('What’s happening?')}</h2>`);
        const first = root.querySelector('.fdt-row'); if (first) first.insertAdjacentHTML('beforebegin', `<h2 class="hub-h2">${F('Other common challenges')}</h2>`);
        const more = root.querySelector('details.fdt-more'); if (more) { const rows = [...more.querySelectorAll('.fdt-row')]; rows.forEach(r => more.parentNode.insertBefore(r, more)); more.remove(); } });
      return withPage('x_tough', root => { asGroup(root); const ttl = root.querySelector('.dev-area-head h1, .dev-area-head h2, .hub-title'); if (ttl) ttl.textContent = F('Common mealtime worries, and what helps');
        const lead = root.querySelector('.hub-lead'); if (lead) lead.textContent = F('Find what you’re seeing, then the right next step.');
        const ren = { 'Gagging': ['Gagging or choking', 'Know the difference, and what to do'], 'Refusing food': ['Refusing food', 'Turning away, or eating less'], 'A rash after a new food': ['A rash after food', 'Spot a possible reaction'], 'Constipation': ['Constipation', 'When new foods change poop'] };
        root.querySelectorAll('.fdt-tile').forEach(t => { const b = t.querySelector('b'), sm = t.querySelector('small, span:not(.fdt-ic)'), r = b && ren[b.textContent.trim()]; if (r) { b.textContent = F(r[0]); if (sm) sm.textContent = F(r[1]); } });
        const grid = root.querySelector('.fdt-grid'); if (grid) grid.insertAdjacentHTML('beforebegin', `<h2 class="hub-h2">${F('What’s happening?')}</h2>`);
        const row = root.querySelector('.fdt-row'); if (row) row.insertAdjacentHTML('beforebegin', `<h2 class="hub-h2">${F('Other common challenges')}</h2>`);
        const calls = root.querySelector('.care-tpl.is-urgent'); if (calls) calls.outerHTML = `<div class="care-tpl is-urgent">${H().TPLB.calls({ ped: 'fewer wet diapers, or a fever over a day or 103°F.', er: 'green or bloody vomit.', now: 'trouble breathing, or a severe reaction.', nowLabel: 'Call 911' })}</div>`; }); },
    // Nov 27 (Yarden's mockups): bottle refusal and refusing food.
    x_nobottle: () => { const X = window.__fdx || {}; if (!(X.nurses && X.nurses()) || mo() >= 11) return window.changesRoute('chg:' + CAT + ':mock:x_nobottle'); const T = H().TPLB;
      return page(head('bottle', 'Feeding challenges', 'Won’t take a bottle? It often takes practice', 'Many babies who nurse need time to get used to a bottle. Keep it low-pressure.'),
        sect('What you might notice', '', photoNotice('feeding/nobottle-other', '35%', 'A calm moment with another caregiver can help.', ['Pushes the nipple out, or cries', 'Turns away from the bottle']))
        + sect('What to try', '', numRows([['Have someone else offer it', 'Ideally with the nursing parent out of the room.'], ['Choose a calm moment', 'Before {s’s} very hungry. Start with a small amount.'], ['Keep the pace gentle', 'Try a slow-flow nipple. Let {o} pause or stop.']], ['If {s} {resist|resists}:', 'Stop, and try again tomorrow. A few minutes a day is plenty.']))
        + T.calls({ ped: '{s} {refuse|refuses} all feeds, or {have|has} fewer wet diapers.' }), 'expect'); },
    z_refuse: () => { const T = H().TPLB;
      return page(head('plate', 'Feeding challenges', 'Refusing food is common, and it passes', 'Some days {s}’ll eat a lot. Other days, almost nothing.'),
        sect('See what {s’s} telling you', '', photoNotice('feeding/refuse-turn', '40%', 'Turning away or closing {p} mouth means “not now.”', ['Turns away, or closes {p} mouth', 'Pushes food off the tray']))
        + sect('What helps', '', `<div class="fd-withfoot">${rowsCard([['clock', 'Try again another time', 'A new food can take 10–15 relaxed tries.'], ['hand', 'Let {o} touch and explore', 'Playing with food is part of learning.'], ['bowl', 'Eat together', '{S} {learn|learns} by watching you.']])}<p class="fd-foot"><b>${F('Split the job.')}</b> ${F('You choose what to offer. {S} {decide|decides} how much to eat.')}</p></div>`)
        + T.calls({ ped: 'refusing most foods for weeks, or fewer wet diapers.' }), 'expect'); },
    // Nov 27 (last challenge pages): the same calm pattern as bottle refusal and refusing food.
    x_spit: () => { const m = mo(), T = H().TPLB;
      return page(head('drop', 'Feeding challenges', 'Spit-up is common, and usually fine', m >= 12 ? 'Spit-up this late is worth a mention at the next checkup.' : m < 5 ? 'It peaks around 4 months, and it’s usually gone by the first birthday.' : 'It’s past the peak, and it’s usually gone by the first birthday.'),
        sect('See what it looks like', '', photoNotice('feeding/spit-up', '45%', 'A tablespoon or two looks like a lot once it spreads.', ['A little milk after most feeds', 'Comfortable, and still growing']))
        + sect('What helps', '', rowsCard([['heart', 'Hold {o} upright after feeds', 'For 20–30 minutes.'], ['bottle', 'Smaller feeds, more often', 'A little less each time.'], ['hand', 'Stop when {s} {slow|slows} down', 'No need to finish.']]))
        + callout('For sleep', 'Flat on {p} back, even with spit-up. No wedges.')
        + T.calls({ ped: '{s} {spit|spits} up forcefully, {cry|cries} and {arch|arches} at most feeds, or {are|is} not gaining weight.', er: 'green or bloody vomit.' }), 'expect'); },
    z_reaction: () => withPage('z_reaction', root => { asGroup(root); swapHelps(root, [['note', 'Note it', 'The food, and what happened. A photo helps.'], ['clock', 'Hold off on that food', 'Ask before trying it again.']]); const c = root.querySelector('.care-calls'); const wrap = c && c.previousElementSibling && /When to call/.test(c.previousElementSibling.textContent) ? c.previousElementSibling : null;
      if (c) { if (wrap) wrap.remove(); c.outerHTML = H().TPLB.calls({ ped: 'a few hives, or vomiting, after a new food. Call the same day.', now: 'trouble breathing, swelling of the lips or face, or hives all over.', nowLabel: 'Call 911' }); } }),
    z_teeth: () => { const m = mo(), T = H().TPLB;
      return page(head('tooth', 'Feeding challenges', 'Teething can make feeds short and fussy', 'Sore gums usually settle in a few days. Teething doesn’t cause a fever.'),
        sect('See what it looks like', '', photoNotice('care/look-teething', '30%', 'Sore gums can make sucking uncomfortable.', ['Drooling and chewing on {p} hands', 'Pulling off partway through feeds']))
        + sect('What helps', '', rowsCard([['snow', 'Chill a teether', 'Or a washcloth, to chew on.'], m >= 6 ? ['bowl', 'Serve chilled food', 'Cool yogurt or mashed fruit soothes gums.'] : ['hand', 'Rub {p} gums', 'With a clean finger, for a minute or two.'], ['clock', 'Try shorter feeds', 'More often, until {p} gums settle.']]))
        + callout('Skip numbing gels and amber necklaces', 'Neither is safe for babies.')
        + T.calls({ ped: 'refusing to drink' + fevTail() + '.', ...feverCall() }), 'expect'); },
    nb_vitd: () => { const X = window.__fdx || {}, fam = X.formulaFam && X.formulaFam();
      return page(head('drop', 'Vitamin D', 'Vitamin D drops, every day', 'Vitamin D helps build strong bones. Breast milk contains very little.'),
        sect('How to give the drops', '', `<section class="fd-photo1"><img src="assets/feeding/vitd-drop.jpg" alt="" loading="lazy"><div><b>${F('Aim toward the inside of {p} cheek.')}</b><p>${F('Give it slowly, or mix the dose into a little milk {s} will finish.')}</p></div></section>`)
        + sect('What {s} {need|needs}', '', rowsCard([['sun', 'Vitamin D · 400 IU a day', 'For breastfed and partly breastfed babies, from the first days.'], ['note', 'Check the product label', 'Strengths vary. Use the dropper it comes with.']]))
        + sect('Good to know', '', rowsCard([fam && ['bottle', 'Also on formula?', 'How much formula {s} {drink|drinks} can change whether drops are needed. Ask {p} pediatrician.'], ['drop', 'Iron is a separate question', 'Drops often start around 4 months for breastfed babies.'], ['cup', 'No water yet', 'Milk is all {s} {need|needs} until about 6 months, even on hot days.']].filter(Boolean))), 'expect'); },
    // Example day, earlier stages (Yarden's mockups): four parts of the day, dots for feeds.
    fd_day_early: () => { const X = window.__fdx || {}, st = X.stg ? X.stg() : 0;
      if (st === 3) { const nurse = X.nurses && X.nurses(), milk = nurse ? (X.formulaFam && X.formulaFam() ? 'Nurse or a bottle' : 'Nurse') : 'A bottle';
        const rows = [['7 am', 'm', 'Milk feed', milk], ['8 am', 'f', 'Breakfast', 'A few spoonfuls of an iron-rich food'], ['11 am', 'm', 'Milk feed', 'Before a nap'], ['3 pm', 'm', 'Milk feed', 'After waking'], ['5:30 pm', 'f', 'Dinner', 'Soft pieces of family food'], ['7 pm', 'm', 'Milk feed', 'Before bed']];
        return page(head('heart', 'Example day · 6–9 months', 'A day at 6–9 months', 'Milk still matters, with a few first meals alongside it.'),
          sect('One possible day', 'Milk feeds and meals shown together.', `<section class="fd-times">${rows.map(([t, k, b, x]) => `<div><em>${t}</em><i class="is-${k}"></i><span><b>${F(b)}</b><small>${F(x)}</small></span></div>`).join('')}</section><p class="fd-key"><i class="is-m"></i>${F('Milk')}<i class="is-f"></i>${F('Meal or snack')}</p>`)
          + `<p class="fd-lav"><b>${F('An example, not a schedule.')}</b> ${F('Milk feeds and meals can move around naps and appetite.')}</p>`, 'expect'); }
      const D = { 0: ['Example day · Newborn', 'A newborn day', 'Feeds around the clock. Evenings often bunch together.', [3, 2, 3, 3]], 1: ['Example day · 3–4 months', 'A day at 3–4 months', 'Feeds may spread out, with longer pauses between some of them.', [2, 3, 1, 1]], 2: ['Example day · 4–6 months', 'A day at 4–6 months', 'A more predictable rhythm may be emerging.', [2, 2, 1, 1]] }[st];
      if (!D) return window.changesRoute('chg:' + CAT + ':mock:fd_day');
      const parts = [['Morning', '6 am–noon'], ['Afternoon', 'Noon–6 pm'], ['Evening', '6 pm–midnight'], ['Overnight', 'Midnight–6 am']];
      return page(head('heart', D[0], D[1], D[2]),
        sect('One possible day', 'The dots are feeds, not exact clock times.', `<section class="fd-dots">${parts.map(([t, r], k) => `<div><span><b>${F(t)}</b><small>${F(r)}</small></span><span class="fd-dd"><span>${'<i></i>'.repeat(D[3][k])}</span>${st === 0 && k === 2 ? `<small>${F('Often close together')}</small>` : ''}</span><em>${D[3][k]} ${F(D[3][k] === 1 ? 'feed' : 'feeds')}</em></div>`).join('')}</section>`)
        + `<p class="fd-lav"><b>${F('Not a schedule.')}</b> ${F('Follow hunger and fullness cues. {S} may feed more or less often.')}</p>`, 'expect'); },
    g_tex: () => { const T = H().TPLB, m = mo(), now = m < 7 ? 0 : m < 9 ? 1 : 2, nine = m >= 9;
      return page(head('avocado', 'Textures and finger foods', 'Move from smooth food to soft pieces', 'Lumps teach {o} to chew. Soft finger foods teach {o} to feed {o}self.'),
        sect('The texture progression', 'Move on once each one is easy, whatever the month. Aim for lumps by about 9 months.',
          T.photoSwitch([['Smooth', 'Around 6 months'], ['Lumpy', '7–8 months'], ['Soft pieces', '9 months on']],
            [['Avocado', ['feeding/tx-avo-1', 'feeding/tx-avo-2', 'feeding/tx-avo-3']], ['Banana', ['feeding/tx-ban-1', 'feeding/tx-ban-2', 'feeding/tx-ban-3']], ['Sweet potato', ['feeding/tx-sp-1', 'feeding/tx-sp-2', 'feeding/tx-sp-3']]], now))
        + sect('Finger foods to try', 'Soft pieces {s} can pick up and hold.',
          T.photoGridMore(nine ? [['feeding/pieces-9', 'Banana, avocado, egg', 'Ripe, or well cooked'], ['feeding/opt-broccoli', 'Broccoli', 'Well cooked, stem to hold'], ['feeding/opt-pasta', 'Pasta', 'Soft, well cooked'], ['feeding/nutbutter', 'Toast', 'Nut butter spread thin']]
            : [['feeding/opt-avocado', 'Avocado', 'Ripe strips'], ['feeding/opt-banana', 'Banana', 'Strips, not rounds'], ['feeding/opt-egg', 'Egg', 'Omelet strips'], ['feeding/nutbutter', 'Toast', 'Nut butter spread thin'], ['feeding/opt-broccoli', 'Broccoli', 'Well cooked, stem to hold'], ['feeding/opt-pasta', 'Pasta', 'Soft, well cooked']], 'See more foods'))
        + `<section class="fd-squish"><div class="fd-sq-top"><div><em>${F('Before you serve')}</em><b>${F('The squish test')}</b><p>${F('Press a piece. It should flatten easily.')}</p></div><svg viewBox="0 0 96 40" width="96" height="40" aria-hidden="true"><rect x="4" y="6" width="30" height="28" rx="7" fill="#9fae6b"/><path d="M42 20h16m-5-5 5 5-5 5" stroke="#9b4766" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="78" cy="22" rx="15" ry="7" fill="#9fae6b"/></svg></div><small>${F('Fork-mash for lumps. Quarter round foods lengthwise.')}</small></section>`); },
    g_meal: () => { const T = H().TPLB, milk = ['Milk before or after meals, whichever suits {p} mood.', 'Water from a cup with meals, 4–8 oz a day at most.', 'Milk eases off slowly as meals grow, mostly after 9 months.'];
      if (mo() >= 8.5) return withPage('z_meal', root => addBefore(root, sect('Milk and water', '', rowsCard([['drop', 'Milk before or after meals', 'Whichever suits {p} mood.'], ['cup', 'Water from a cup', 'With meals, 4–8 oz a day at most.'], ['clock', 'Milk eases off slowly', 'As meals grow, mostly after 9 months.']]))));
      const lead = sections('z_meal')._lead;
      return page(head('highchair', 'A meal, start to finish', 'First meals are just a few bites', 'Milk is still {p} main food. Let {o} set the pace.'),
        sect('What a meal looks like', '', `<div class="ct-page is-howto">${lead}</div>`)
        + sect('The simple flow', '', T.photoGrid([['feeding/meal-1', '1. Sit {o} up', 'Strapped in, facing you'], ['feeding/meal-2', '2. Offer a little', 'A spoonful, or a soft strip'], ['feeding/meal-3', '3. Let {o} lead', 'Done when {s} {turn|turns} away']]))
        + sect('Good to know', '', rowsCard([['heart', 'Pick a calm time', 'Not when {s’s} very hungry.'], ['bowl', 'Expect mess', 'Most of it lands on the tray.'], ['drop', 'Milk before or after', 'Either works.'], ['hand', 'Pushing food out?', 'The tongue does that at first. It fades.']]))); },
    g_all: () => { const T = H().TPLB, X = window.__fdx, b = X && X.isBreast ? X.isBreast() : true, f = X && X.formulaFam ? X.formulaFam() : false, thin = !b ? 'formula' : f ? 'breast milk or formula' : 'breast milk';
      return page(head('peanut', 'Common allergens', 'Try the common allergens early', 'Start around 6 months. Ask first if {s} has severe eczema or an egg allergy.'),
        sect('The 9 common allergens', 'Try one at a time. Each photo shows one safe way to serve it.', alPhotos())
        + sect('How to introduce', '', window.ctPhotoSteps([['photo:feeding/pb-spoon', 'A little smooth peanut butter', 'About ½ teaspoon. Never whole nuts'], ['photo:feeding/pb-thin', 'Thin it', 'With warm water or ' + thin + ', until runny'], ['photo:feeding/pb-offer', 'Offer it at home', 'Early in the day, so you can watch']], [['Egg works the same way', 'Well cooked, never runny']]))
        + callout('Keep them coming', 'A few times a week once {s’s} had it, like peanut stirred into oatmeal or egg baked into pancakes.')
        + T.calls({ ped: 'a few hives, or vomiting, after a new food.', nowLabel: 'Call 911', now: 'trouble breathing, swelling of the lips or face, or hives all over.' })); }
  };
  const base = window.changesRoute;
  window.changesRoute = function (r, ...a) { const q = String(r).split(':');
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && q[3] === 'xa' && q[4] === 'feed' && window.__hub && !window.__fdIn) { window.__fdLast = r; return nbFeed(); }
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && q[3] === 'xa' && /^prep/.test(q[4] || '') && window.__hub && !window.__fdIn && window.__fdx && window.__fdx.formulaFam && window.__fdx.formulaFam()) { window.__fdLast = r; return fmPage(); }
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && q[3] === 'xa' && /^prep/.test(q[4] || '') && window.__hub && !window.__fdIn && window.__fdx && window.__fdx.isBreast && window.__fdx.isBreast() && window.__fdx.nurses && !window.__fdx.nurses()) { window.__fdLast = r; return bmPage(); }
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && NB[q[3]] && window.__hub && !window.__fdIn) { window.__fdIn = true; let h; try { h = NB[q[3]](); } finally { window.__fdIn = false; } window.__fdLast = r; return h; }
    if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && G[q[3]] && window.__hub && !window.__fdIn) { window.__fdIn = true; let h; try { h = G[q[3]](q[4]); } finally { window.__fdIn = false; } window.__fdLast = r; return h; }
    return base.call(this, r, ...a); };
})();
