/* Ahead · Sleep, show and tell (preview, Nov 20). Yarden's mockups and page list as the brief; Ahead's own content.
   Photos (made in Canva, assets/sleep/) only where seeing beats reading:
     sleepy cues (alert / getting sleepy / overtired), stop swaddling (before and after), bedtime routine (four steps),
     where she sleeps (a labeled room), rolling in sleep (two frames), safe sleep (a labeled crib + a quick check).
   Drawn pictures everywhere else that a diagram explains better (no generic sleeping-baby photos):
     each stage's top card, short naps (pick how long the nap was), three naps to two and two to one (sample days),
     the example day (a full 24 hours), night waking (a decision flow), sleep training (where you are in each method).
   Facts: AAP (HealthyChildren.org) safe sleep and sleep guidance, as on the pages these build on. */
(function () {
  const H = () => window.__hub, C = () => window.__chg, m = () => C().ageNow();
  const F = s => H().F(s);
  const go = p => `openPage('${p}')`;
  const IMG = 'assets/sleep/';
  const nursing = () => { try { return C().method() === 'nurse'; } catch (e) { return false; } };
  const $ = s => document.querySelector('#main ' + s), $$ = s => [...document.querySelectorAll('#main ' + s)];
  const sec = t => { const h = $$('h2.hub-h2').find(x => x.textContent.trim() === t); return h ? [h, h.nextElementSibling] : [null, null]; };
  const card = (title, body, cls = '') => `<h2 class="hub-h2">${F(title)}</h2><section class="care-tpl-card ssw-card ${cls}">${body}</section>`;
  const top = html => { const t = $('.care-tpl') || $('.hub-detail-head'); if (t && t.classList.contains('care-tpl')) t.insertAdjacentHTML('afterbegin', html); else if (t) t.insertAdjacentHTML('afterend', `<div class="care-tpl">${html}</div>`); };
  const once = (el, k) => { if (!el || el.dataset['ssw' + k]) return false; el.dataset['ssw' + k] = '1'; return true; };

  /* ---------- a day (or a night) as a band of time ---------- */
  // segs: [from, to, 'nap'|'night'] in hours; night: [from, to] hours that are dark; caps: [hour, text]; moon/sun: hours.
  const COL = { day: '#fff1cc', dusk: '#f3dfe6', night: '#d9dbf3', nap: '#8f84dd', deep: '#5a5296' };
  function band(o) {
    const S = o.start, E = o.end, X = h => 8 + (h - S) / (E - S) * 304, pc = h => ((h - S) / (E - S) * 100);
    const dark = o.dark || [];
    const isDark = h => dark.some(([a, b]) => h >= a && h <= b);
    const stops = []; for (let h = S; h <= E + 1e-6; h += (E - S) / 48) stops.push(`<stop offset="${(pc(h)).toFixed(1)}%" stop-color="${isDark(h) ? COL.night : COL.day}"/>`);
    const id = 'g' + Math.random().toString(36).slice(2, 7);
    const pills = (o.segs || []).map(([a, b, k]) => { const w = X(b) - X(a); return `<rect x="${X(a)}" y="31" width="${Math.max(w, 8)}" height="36" rx="18" fill="${k === 'night' ? COL.deep : COL.nap}"/>${w > 26 ? `<text x="${X(a) + w / 2}" y="53" font-size="10" font-weight="800" fill="#fff" text-anchor="middle" letter-spacing="1">${k === 'night' && w > 90 ? F(o.nightLabel || 'z z') : 'z z'}</text>` : ''}`; }).join('');
    const ghost = (o.ghost || []).map(([a, b]) => `<rect x="${X(a)}" y="31" width="${X(b) - X(a)}" height="36" rx="18" fill="none" stroke="${COL.nap}" stroke-width="1.6" stroke-dasharray="3 4"/>`).join('');
    const sun = h => `<g transform="translate(${X(h)} 10)"><circle r="6.5" fill="#f2c14e"/><g stroke="#f2c14e" stroke-width="1.8" stroke-linecap="round"><path d="M-11 0h-2.5M11 0h2.5M-8 -6.5l-1.8-1.6M8 -6.5l1.8-1.6"/></g></g>`;
    const moon = (h, faint) => `<g transform="translate(${X(h)} 10)" opacity="${faint ? .35 : 1}"><path d="M2-6a6.5 6.5 0 1 0 5 10A5.5 5.5 0 0 1 2-6Z" fill="${COL.deep}"/></g>`;
    const spk = h => `<g stroke="#e0a73c" stroke-width="2" stroke-linecap="round"><path d="M${X(h)} 7v6"/><path d="M${X(h) - 7} 10l3.5 3.5"/><path d="M${X(h) + 7} 10l-3.5 3.5"/></g><circle cx="${X(h)}" cy="49" r="4" fill="#e0a73c"/>`;
    const dots = (o.dots || []).map(h => `<circle cx="${X(h)}" cy="49" r="4.5" fill="#e0a73c"/>`).join('');
    const icons = dots + (o.flat ? '' : (o.sparks || []).map(spk).join('') + (o.sun || []).map(sun).join('') + (o.moon || []).map(h => moon(h)).join('') + (o.moonFaint || []).map(h => moon(h, 1)).join('')
      + (o.arrow ? `<path d="M${X(o.arrow[0]) + 8} 10H${X(o.arrow[1]) - 10}" stroke="${COL.deep}" stroke-width="1.6" stroke-linecap="round" marker-end="url(#a${id})"/>` : ''));
    const wave = o.wave ? (() => { // sleep cycles: light at the top, deep at the bottom, a brief waking at each peak
      const n = o.wave, a = X(S + .15), b = X(E - .15), w = (b - a) / n; let d = `M${a} 34`;
      for (let i = 0; i < n; i++) { const x = a + i * w; d += ` C${x + w * .3} 34 ${x + w * .25} 66 ${x + w * .5} 66 S${x + w * .7} 34 ${x + w} 34`; }
      const peaks = Array.from({ length: n - 1 }, (_, i) => a + (i + 1) * w).map(x => `<g stroke="#e0a73c" stroke-width="2" stroke-linecap="round"><path d="M${x} 13v6"/><path d="M${x - 7} 16l3.5 3.5"/><path d="M${x + 7} 16l-3.5 3.5"/></g><circle cx="${x}" cy="34" r="3.8" fill="#e0a73c"/>`).join('');
      return `<path d="${d}" fill="none" stroke="${COL.deep}" stroke-width="2.6" stroke-linecap="round"/>${peaks}`;
    })() : '';
    let prev = -99, row = 0, two = false; // a label too close to the one before it drops to a second line
    const caps = (o.caps || []).map(([h, t, cls]) => { const p = pc(h), al = p < 6 ? 'is-start' : p > 96 ? 'is-end' : ''; row = p - prev < (o.gap || 30) ? 1 - row : 0; prev = p; if (row) two = true; return `<span class="${al} ${cls || ''} ${row ? 'is-low' : ''}" style="left:${p.toFixed(1)}%">${F(t)}</span>`; }).join('');
    return `<figure class="ssw-band ${o.cls || ''}" role="img" aria-label="${F(o.label)}">${o.title ? `<b class="ssw-band-title">${F(o.title)}</b>` : ''}<svg viewBox="${o.flat ? '0 20 320 56' : '0 0 320 78'}" aria-hidden="true">
      <defs><linearGradient id="${id}">${stops.join('')}</linearGradient><marker id="a${id}" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="${COL.deep}"/></marker></defs>
      <rect x="2" y="24" width="316" height="50" rx="25" fill="url(#${id})"/>${ghost}${pills}${wave}${icons}</svg><div class="ssw-caps${two ? ' is-two' : ''}">${caps}</div></figure>`;
  }

  // The newborn loop: feed, a little awake time, sleep, then again. Not a schedule.
  const loopFig = (cls = '') => `<figure class="ssw-loop ${cls}" role="img" aria-label="${F('Feed, a little awake time, then sleep. The loop repeats around the clock.')}">
      <div class="ssw-loop-row"><span class="is-feed"><b>${F('Feed')}</b><small>${F('When hungry')}</small></span><i aria-hidden="true">›</i><span class="is-awake"><b>${F('Awake')}</b><small>${F('Until the first yawn')}</small></span><i aria-hidden="true">›</i><span class="is-sleep"><b>${F('Sleep')}</b><small>${F('Then it starts again')}</small></span></div>
      <svg class="ssw-loop-back" viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true"><path d="M262 2v8a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8V6" fill="none" stroke="#8f84dd" stroke-width="1.8" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/><path d="M33 9l5-6 5 6" fill="none" stroke="#8f84dd" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>
      <figcaption>${F('Around the clock, often every 2–3 hours')}</figcaption></figure>`;

  /* ---------- top card: what's changing, drawn ---------- */
  const HERO = [
    [/tiny stretches/i, () => band({ flat: true, label: 'Short sleeps spread across day and night, between feeds.', start: 0, end: 24, dark: [[0, 6.5], [19, 24]],
      segs: [[.6, 2.4], [3.4, 5.4], [6.6, 8.2], [9.3, 11], [12.2, 13.6], [14.8, 16.6], [17.6, 19.1], [20.4, 22.4]].map(s => [...s, 'nap']),
      caps: [[3, 'Night'], [12, 'Day'], [21, 'Night']] })],
    [/body clock/i, () => band({ flat: true, label: 'Short naps by day, and the longest sleep moving to the night.', start: 7, end: 31, dark: [[19.2, 31]],
      segs: [[8.6, 9.5, 'nap'], [10.9, 12.1, 'nap'], [13.6, 14.4, 'nap'], [16, 16.8, 'nap'], [19.4, 24.6, 'night'], [25.1, 27.6, 'night'], [28, 30.8, 'night']],
      sun: [12.5], moon: [22], nightLabel: 'Longest', caps: [[12.5, 'Short naps by day'], [24, 'Longest sleep at night']] })],
    [/growing up/i, () => band({ flat: true, label: 'A night of sleep cycles, with a brief waking between each one.', start: 19, end: 31, dark: [[19, 31]],
      segs: [[19.3, 21.4, 'night'], [21.8, 23.7, 'night'], [24.1, 26, 'night'], [26.4, 28.3, 'night'], [28.7, 30.7, 'night']], dots: [21.6, 23.9, 26.2, 28.5],
      caps: [[19.5, 'Bedtime'], [25, 'Brief wakings between cycles'], [30.5, 'Morning']] })],
    [/rhythm/i, () => band({ flat: true, label: 'A day with a morning nap, a midday nap, a short catnap, then bedtime.', start: 7, end: 20, dark: [[19.3, 20]],
      segs: [[9, 10.3, 'nap'], [12.5, 13.8, 'nap'], [16.3, 16.8, 'nap']], moon: [19.4],
      caps: [[9.65, 'Morning nap'], [13.15, 'Midday nap'], [16.55, 'Catnap'], [19.4, 'Bedtime']] })],
    [/running out of room/i, () => band({ flat: true, label: 'A late catnap pushes bedtime later.', start: 7, end: 21, dark: [[20.3, 21]],
      segs: [[9.2, 10.6, 'nap'], [13.1, 14.5, 'nap'], [17.3, 17.8, 'nap']],
      caps: [[9.9, 'Nap'], [13.8, 'Nap'], [17.55, 'Catnap'], [20.4, 'Later bedtime']] })],
    [/brain is busy/i, () => band({ flat: true, label: 'A day with a morning nap and an afternoon nap, then bedtime.', start: 7, end: 20.5, dark: [[19.2, 20.5]],
      segs: [[9.5, 11, 'nap'], [14, 15.5, 'nap']], moon: [19.3], caps: [[10.25, 'Morning nap'], [14.75, 'Afternoon nap'], [19.3, 'Bedtime']] })]
  ];

  // Stage tabs (like Development's month tabs) and a photo of a baby that age beside the headline.
  const STAGES = [['Newborn', /round-the-clock/i, 'hero-0.jpg'], ['Longer nights', /longer nights/i, 'hero-1.jpg'], ['Three naps', /three naps/i, 'hero-2.jpg'], ['Two naps', /two naps/i, 'standing.jpg']];
  const stageNow = () => { try { return C().CFG.Sleep.stage(m()); } catch (e) { return -1; } };
  const tabs = view => { const cur = stageNow(), live = (() => { try { return C().live(); } catch (e) { return true; } })();
    return `<nav class="ssw-tabs" aria-label="${F('Sleep stages')}">${STAGES.map(([l], i) => `<button class="${i === view ? 'is-on' : ''} ${live && i === cur ? 'is-now' : ''}" onclick="${i === cur && live ? `openPage('topic:Sleep')` : `chgGo('chg:Sleep:s:${i}')`}" ${i === view ? 'aria-current="step"' : ''}>${F(l)}</button>`).join('')}</nav>`; };

  /* ---------- photo blocks ---------- */
  const photoRows = rows => `<ol class="ssw-photorows">${rows.map(([img, alt, t, s, tag, tone]) => `<li><span class="ssw-ph"><img src="${IMG + img}" alt="${F(alt)}" loading="lazy"></span><span class="ssw-copy">${tag ? `<em class="ssw-tag ${tone || ''}">${F(tag)}</em>` : ''}<b>${F(t)}</b><small>${F(s)}</small></span></li>`).join('')}</ol>`;
  const pinPhoto = (img, alt, pins, cls = '') => `<figure class="ssw-pinphoto ${cls}"><img src="${IMG + img}" alt="${F(alt)}">${pins.map(([l, x, y, side]) => `<span class="ssw-pin is-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(l)}</span></span>`).join('')}</figure>`;
  const pair = (a, b) => `<div class="ssw-pair">${[a, b].map(([img, alt, label, line, tone]) => `<figure><figcaption class="${tone || ''}">${F(label)}</figcaption><span class="ssw-ph"><img src="${IMG + img}" alt="${F(alt)}" loading="lazy"></span><small>${F(line)}</small></figure>`).join('')}</div>`;
  const notes = list => H().TPLB.ul(list);

  /* ---------- pages built here ---------- */
  function routinePage() {
    const mo = m(), teeth = mo >= 7 || answers.hasTooth === 'Yes';
    const S = [
      ['pajamas.jpg', 'A parent buttoning pajamas on a smiling baby on a changing pad', 'Change', 'Into pajamas. A bath first is optional'],
      nursing() ? ['feed-nurse.jpg', 'A parent holding a sleepy baby close in a glider', 'Feed', teeth ? 'Then brush {p} teeth' : 'A calm last feed']
        : ['feed.jpg', 'A parent giving a baby a bottle in a dim nursery', 'Feed', teeth ? 'Then brush {p} teeth' : 'A calm last feed'],
      ['book.jpg', 'A parent reading a board book to a baby on their lap', 'Book or song', 'The same one most nights'],
      ['down.jpg', 'A parent laying a drowsy baby on their back in a bare crib', 'Down to sleep', 'Sleepy but awake, on {p} back']
    ];
    const photos = `<section class="care-tpl-card ssw-photosteps"><ol>${S.map(([img, alt, t, s], i) => `<li><span class="ssw-ph"><img src="${IMG + img}" alt="${F(alt)}" loading="lazy"></span><span class="ssw-copy"><i>${i + 1}</i><b>${F(t)}</b><small>${F(s)}</small></span></li>`).join('')}</ol>`
      + notes([['', 'Same order, not a perfect clock', 'The order is what tells {o} sleep is coming'], ['', '15–20 minutes is plenty', 'Short enough to do every night']]) + `</section>`;
    const tips = mo < 3
      ? [['clock', 'Nights start to stretch', 'And {s} {get|gets} sleepy around the same time each evening.'], ['moon', 'An earlier bedtime comes later', 'Around 7–8 pm, once naps settle.']]
      : [['moon', 'Sleepy but awake is practice', 'Some nights {s}’ll fall asleep feeding. That’s fine.'], mo >= 6 && ['heart', 'A lovey can wait', 'Keep the crib empty until 12 months.']].filter(Boolean);
    return H().tplPage('Sleep', { type: 'howto', label: 'Routine', art: 'moon', title: 'A short bedtime routine, the same every night',
      why: mo < 2 ? 'From about 6–8 weeks, a few calm steps in the same order start to tell {o} it’s bedtime.' : 'A few calm steps in the same order help {o} wind down and know sleep is next.',
      stepsFig: () => photos, tipsTitle: 'Good to know', tips });
  }

  // Short naps: pick how long the nap was, and see when the next sleep lands. Awake time by age, from Sleep's own ranges.
  const awakeFor = mo => mo < 4 ? [1.75, '1¾ hrs'] : mo < 6 ? [2, '2 hrs'] : mo < 8 ? [2.25, '2¼ hrs'] : [2.75, '2¾ hrs'];
  const NAPS = [[.5, '30 min'], [.75, '45 min'], [1, '1 hour'], [1.5, '1½ hours']];
  const clock = h => { const hh = Math.floor(h + 1e-6), mm = Math.round((h - hh) * 60); return `${hh % 12 || 12}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${hh < 12 ? 'am' : 'pm'}`; };
  function shortFig(i) {
    const [len] = NAPS[i], [aw, awL] = awakeFor(m()), s0 = 9, end = s0 + len, next = end + aw;
    return band({ label: `A ${NAPS[i][1]} nap from 9 am, then about ${awL} awake, so the next nap comes around ${clock(next)}.`, start: 8.5, end: 13.6,
      segs: [[s0, end, 'nap'], [next, Math.min(next + 1.2, 13.5), 'nap']], gap: 36,
      caps: [[s0 + len / 2, `Ends ${clock(end)}`], [end + aw / 2, `Awake ~${awL}`], [Math.min(next + .6, 13), `Next nap ${clock(next)}`]] });
  }
  window.__sswShort = i => { const f = $('#ssw-short'); if (!f) return; f.innerHTML = shortFig(i); $$('.ssw-chips button').forEach((b, k) => b.setAttribute('aria-pressed', k === i)); };
  function shortNapPage() {
    const mo = m(), early = mo < 6, three = mo >= 4 && mo < 9 && answers.twoNaps !== 'Yes', start = 1;
    const ifs = [
      three && ['moon', 'Skipped the catnap?', 'Move bedtime earlier tonight.'],
      !early && ['sun', 'Short naps most days?', 'Try the nap 15 minutes earlier or later. A dark room and white noise help.'],
      mo >= 6 && mo < 10 && ['clock', 'Fighting the last nap most days?', 'It may be time for two naps.']
    ].filter(Boolean);
    const fig = () => `<section class="care-tpl-card ssw-card"><p class="ssw-ask">${F('How long was the nap?')}</p><div class="ssw-chips" role="group">${NAPS.map(([, l], i) => `<button aria-pressed="${i === start}" onclick="__sswShort(${i})">${F(l)}</button>`).join('')}</div><div id="ssw-short">${shortFig(start)}</div>`
      + notes([['', 'The last nap of the day?', 'Bedtime moves earlier the same way']]) + `</section>`;
    return H().tplPage('Sleep', { type: 'expect', label: 'Naps', art: 'sun', title: 'A short nap moves the next one up',
      why: early ? 'Naps of 30–45 minutes are very common now. They get longer with time.' : 'Timing, light, teething or a new skill can shorten naps for a while.',
      normalTitle: 'See how the day shifts', normal: fig,
      doOrdered: true, do: [['clock', 'Give it a few minutes', '{S} may resettle on {p} own'], ['eye', 'Watch for sleepy cues', 'More than the clock'], ['moon', 'Offer the next nap sooner', 'Even if it’s early']],
      action: () => ifs.length ? H().TPLB.sec('If it keeps happening', H().TPLB.rows(ifs, 'Sleep')) : '' });
  }

  // Night waking: what's happening → what to check → what to try, as a flow.
  const flow = () => `<section class="care-tpl-card ssw-flow">
      <div class="ssw-flow-step"><i>1</i><span><b>${F('{S} {wake|wakes} and {fuss|fusses}')}</b><small>${F('Pause a minute or two first')}</small></span></div>
      <div class="ssw-flow-fork"><span class="ssw-flow-yes"><b>${F('Settling?')}</b> ${F('Let {o} be.')}</span><span class="ssw-flow-no">${F('Still upset')}</span></div>
      <div class="ssw-flow-step"><i>2</i><span><b>${F('Check what {s} {need|needs}')}</b><small>${F('Hungry, wet, too warm, or unwell?')}</small></span></div>
      <div class="ssw-flow-arrow" aria-hidden="true"></div>
      <div class="ssw-flow-step"><i>3</i><span><b>${F('Feed, change or comfort')}</b><small>${F('Then settle {o} your usual way. Brief, dark and quiet.')}</small></span></div></section>`;
  const nightFig = () => band({ label: 'A night of sleep with brief wakings, most of them settling on their own.', start: 19, end: 31, dark: [[19, 31]],
    segs: [[19.4, 23.1, 'night'], [23.6, 26.5, 'night'], [27, 30.7, 'night']], sparks: [23.35, 26.75], caps: [[21.2, 'Sleep'], [25, 'Brief wakings'], [28.8, 'Back to sleep']] });
  function wakesPage() {
    const mo = m();
    return H().tplPage('Sleep', { type: 'expect', label: 'Night sleep', art: 'moon', title: 'Brief wakings happen between sleep cycles',
      why: 'Many babies stir and settle back on their own. A short pause first gives {o} the chance.',
      normalTitle: 'What a night looks like', normal: nightFig,
      doTitle: 'What to do', do: [], action: () => H().TPLB.sec('What to do', flow()) + H().TPLB.sec('Common reasons now', H().TPLB.chips(['Hunger', 'A new skill, like rolling', 'Teething or a cold', 'Overtired after short naps'],
        [['', 'Short naps today?', 'Try bedtime 30 minutes earlier for a few nights'], mo >= 6 && ['', 'Waking every hour or two?', 'Ask your pediatrician about night feeds']].filter(Boolean))),
      calls: { ped: 'night waking comes with a fever, poor feeding, or {s} {seem|seems} to be in pain.' } });
  }

  const nm = () => (typeof name === 'function' ? name() : 'your baby');
  // Safe sleep as the baby grows: the timeline that sat at the bottom of Safe sleep, on its own page.
  function safeGrowPage() {
    const html = baseRoute('chg:Sleep:safe'), d = document.createElement('div'); d.innerHTML = html;
    const head = d.querySelector('.hub-detail-head'), acc = d.querySelector('.hub-accs'), page = head && head.parentElement;
    if (!head || !acc || !page) return html;
    head.querySelector('h1').textContent = F('Safe sleep changes as {s} {grow|grows}');
    const lead = head.querySelector('.hub-lead'); if (lead) lead.textContent = F('The same few rules stay. These are the steps that change, and when.');
    const h2 = acc.querySelector('h2'); if (h2) h2.textContent = F('Step by step');
    [...page.children].forEach(c => { if (c !== head && c !== acc && !c.matches('.guide-detail-top, .monthly-page-header, style, .hub-detail-head')) c.remove(); });
    return d.innerHTML;
  }
  const routes = { 'chg:Sleep:d:routine': routinePage, 'chg:Sleep:d:shortnap': shortNapPage, 'chg:Sleep:d:wakes': wakesPage, 'chg:Sleep:d:safegrow': safeGrowPage };
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) { return routes[p] ? routes[p]() : baseRoute.apply(this, arguments); };

  /* ---------- pages dressed after they draw ---------- */
  const PAGES = {
    // Sleepy cues: three states side by side, so parents see the window to aim for.
    'chg:Sleep:d:steps0': () => {
      top(card('Alert, sleepy or overtired?', photoRows([
        ['alert.jpg', 'A wide-awake newborn with bright, open eyes', 'Alert', 'Bright eyes, looking around. Time to feed and play', 'Awake', 'is-day'],
        ['yawn.jpg', 'A newborn yawning', 'Getting sleepy', 'Yawning, rubbing eyes, a faraway stare. Start winding down now', 'Aim for this', 'is-go'],
        ['overtired.jpg', 'A newborn crying hard in a parent’s arms', 'Overtired', 'Fussing, arching, hard to calm. Soothe first, then down', 'Past the window', 'is-late']
      ]), 'ssw-cues'));
      const s1 = $$('.hub-iconstep small')[0]; if (s1) s1.textContent = F('At the first one you see');
      $$('.hub-row b').forEach(b => { if (/^Overtired looks like/.test(b.textContent)) b.closest('.hub-row').remove(); });
    },
    // Stop swaddling: the same crib, before and after.
    'chg:Sleep:d:swaddleoff': () => {
      const [h, body] = sec('How it changes'); if (!h) return;
      const fig = body.querySelector('.hub-strip-row'); if (fig) fig.outerHTML = pair(
        ['swaddle-before.jpg', 'A newborn asleep on their back, swaddled with arms in', 'Newborn', 'Swaddled, arms in, hips loose', 'is-before'],
        ['swaddle-after.jpg', 'The same baby in a sleeveless sleep sack, arms out', 'First try to roll', 'Sleep sack, arms free to push up', 'is-after']);
      h.textContent = F('Swaddle, then sleep sack');
    },
    // Where she sleeps: a labeled room, then the bassinet-to-crib switch.
    'chg:Sleep:d:where': () => {
      const mo = m();
      top(card('What room-sharing looks like', pinPhoto('room.jpg', 'A parents’ bedroom at night with a bare crib right beside the bed and a dim lamp', [['Own crib, nothing in it', 80, 45, 'l'], ['Right by your bed', 53, 72, 'l']])
        + (mo < 8 ? `<div class="ssw-switch"><span><b>${F('Bassinet')}</b><small>${F('The first months')}</small></span><i aria-hidden="true">›</i><span><b>${F('Crib')}</b><small>${F('At the first try to roll, or its weight limit')}</small></span></div>`
          + notes([['', 'Check the label', 'Bassinet weight limits are often 15–20 lb, and every model differs']]) : ''), 'ssw-room'));
    },
    // Safe sleep: a labeled crib, then a quick yes/skip check (Yarden's mockup).
    'chg:Sleep:safe': () => {
      const fig = $('.hub-detail > figure.hub-figure.is-wide, figure.hub-figure.is-wide'), tiles = $('.hub-ess3'); if (!fig) return;
      fig.outerHTML = pinPhoto('crib.jpg', 'A baby asleep on their back in a sleep sack, arms out, in a bare crib with a fitted sheet', [['On {p} back', 56, 31, 'r'], ['Sleep sack, arms free', 24, 40, 'b'], ['Firm, flat mattress', 82, 68, 'l'], ['Fitted sheet only', 18, 88, 'r']], 'ssw-crib');
      const [sh, sb] = sec('Setting up the crib'); if (sh) { sb.remove(); sh.remove(); }
      const acc = $('.hub-accs'); if (acc) acc.outerHTML = card('As ' + nm() + ' grows', `<button class="hub-row" onclick="${go('chg:Sleep:d:safegrow')}"><span class="hub-row-copy"><b>${F('What changes, and when')}</b><small>${F('Swaddle, crib, mattress and more, by age')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`, 'ssw-rowcard');
      if (tiles) tiles.outerHTML = card('Quick crib check', `<div class="ssw-yesno"><div class="is-yes"><b>${F('Yes')}</b><ul>${['Back to sleep', 'Own crib or bassinet', 'Sleep sack', 'A cool, smoke-free room', 'Pacifier, if you like'].map(t => `<li>${F(t)}</li>`).join('')}</ul></div><div class="is-no"><b>${F('Skip')}</b><ul>${['Loose blankets', 'Pillows', 'Bumpers', 'Stuffed toys', 'Sofas, beds, swings'].map(t => `<li>${F(t)}</li>`).join('')}</ul></div></div>`);
    }
  };
  // How to swaddle: a photo for each step.
  PAGES['chg:Sleep:d:swaddle'] = () => {
    const panels = $('.hub-fig-panels'); if (!panels) return;
    const S = [['swaddle-1.jpg', 'A swaddle blanket laid as a diamond with the top corner folded down'], ['swaddle-2.jpg', 'A newborn with one arm straight and one side of the blanket wrapped across and tucked under'], ['swaddle-3.jpg', 'A newborn fully swaddled, snug at the chest and loose at the hips']];
    const rows = [...panels.querySelectorAll('.hub-fig-panel')].map((p, i) => { const t = (p.querySelector('b') || {}).textContent || '', sub = (p.querySelector('small') || {}).textContent || ''; return `<li><span class="ssw-ph"><img src="${IMG + S[i][0]}" alt="${F(S[i][1])}" loading="lazy"></span><span class="ssw-copy"><i>${i + 1}</i><b>${F(t.replace(/^\d\.\s*/, ''))}</b><small>${F(sub)}</small></span></li>`; }).join('');
    const fig = panels.closest('figure'); const notesEl = fig.querySelector('.tpl-notes');
    fig.outerHTML = `<section class="care-tpl-card ssw-photosteps is-square"><ol>${rows}</ol>${notesEl ? notesEl.outerHTML : ''}</section>`;
  };
  // Newborn and early naps: the loop instead of three separate tiles.
  PAGES['chg:Sleep:d:napsearly'] = () => {
    const [h, body] = sec('What’s normal'); if (!h || !body) return;
    const steps = body.querySelector('.hub-iconsteps-row'); if (steps) { steps.outerHTML = loopFig(); h.textContent = F('Feed, awake, sleep, repeat'); }
  };
  // Night waking from 8 months: the same decision path as the earlier night waking page.
  PAGES['chg:Sleep:d:nightwake'] = () => {
    const [h, body] = sec('What to do'); if (!h || !body) return;
    const keep = body.querySelector('.tpl-notes'); const fl = document.createElement('div'); fl.innerHTML = flow(); const card = fl.firstElementChild;
    if (keep) card.insertAdjacentHTML('beforeend', keep.outerHTML); body.replaceWith(card);
  };
  // Rolling: you place, she rolls.
  PAGES['chg:Sleep:d:rolling'] = () => {
    const [h, body] = sec('What’s normal'); if (!h) return;
    h.textContent = F('You place, {s} {roll|rolls}');
    const keep = body.querySelector('.tpl-notes'); body.innerHTML = pair(
      ['back.jpg', 'A baby asleep on their back in a sleep sack in a bare crib', 'You place {o}', 'On {p} back, every sleep', 'is-before'],
      ['tummy.jpg', 'A baby asleep on their tummy in a sleep sack in a bare crib', '{S} {roll|rolls} over', 'Rolls both ways? Let {o} stay', 'is-after'])
      + notes([['', 'Rolls one way and gets stuck?', 'Turn {o} onto {p} back until {s} can roll back too']]) + (keep ? keep.outerHTML : '');
    body.classList.add('care-tpl-card', 'ssw-card');
  };

  // Three naps to two (and two to one): the two sample days, one above the other.
  const days = (a, b) => `<div class="ssw-days">${band(a)}${band(b)}</div>`;
  const DAYS = {
    'chg:Sleep:d:catnap': () => days(
      { title: 'Three naps', label: 'Three naps: morning, midday and a catnap, bedtime around 7:15 pm.', start: 7, end: 20.5, dark: [[19.25, 20.5]], segs: [[9, 10.3, 'nap'], [12.5, 13.8, 'nap'], [16.3, 16.8, 'nap']], moon: [19.25], caps: [[9.65, 'Nap'], [13.15, 'Nap'], [16.55, 'Catnap'], [19.25, 'Bed 7:15']] },
      { title: 'Two naps', label: 'Two naps: morning and afternoon, bedtime about 30 minutes earlier.', start: 7, end: 20.5, dark: [[18.75, 20.5]], segs: [[9.5, 11, 'nap'], [14, 15.5, 'nap']], ghost: [[16.3, 16.8]], moon: [18.75], caps: [[10.25, 'Morning nap'], [14.75, 'Afternoon nap'], [18.75, 'Bed 6:45']] }),
    'chg:Sleep:d:after': () => days(
      { title: 'Two naps', label: 'Two naps, morning and afternoon, bedtime around 7:15 pm.', start: 7, end: 20.5, dark: [[19.25, 20.5]], segs: [[9.5, 11, 'nap'], [14, 15.5, 'nap']], moon: [19.25], caps: [[10.25, 'Morning nap'], [14.75, 'Afternoon nap'], [19.25, 'Bed 7:15']] },
      { title: 'One nap', label: 'One longer nap around midday, bedtime a little earlier.', start: 7, end: 20.5, dark: [[18.75, 20.5]], segs: [[12, 14.5, 'nap']], moon: [18.75], caps: [[13.25, 'One longer nap'], [18.75, 'Bed 6:45']] })
  };
  // Sleep training: where you are, in each method.
  const ROOM = { // crib on the left, door on the right; dots are you, faint ones are where you move to over the nights
    'Bedtime fading': `<circle cx="23" cy="22" r="4.5" class="u"/>`,
    'Pick up, put down': `<circle cx="22" cy="15" r="4.5" class="u"/><path d="M22 20v7" class="u2"/>`,
    'Chair method': `<circle cx="22" cy="22" r="4.5" class="u"/><circle cx="34" cy="22" r="4" class="f"/><circle cx="45" cy="22" r="3.5" class="f2"/>`,
    'Timed check-ins': `<path d="M50 22H22" class="p"/><circle cx="64" cy="22" r="4.5" class="u"/>`,
    'Cry it out': `<circle cx="64" cy="22" r="4.5" class="u"/>`
  };
  const roomFig = k => `<svg class="ssw-roomfig" viewBox="0 0 70 40" aria-hidden="true"><rect x="2" y="4" width="54" height="34" rx="6" class="r"/><rect x="6" y="14" width="10" height="16" rx="2.5" class="c"/><path d="M56 14v14" class="d"/>${ROOM[k] || ''}</svg>`;

  function dress() {
    const main = document.querySelector('#main'); if (!main) return;
    const pg = (() => { try { return (0, eval)('page'); } catch (e) { return ''; } })();
    if (!/^(topic:Sleep|chg:Sleep)/.test(pg || '')) return;

    // Sleep's main page: the card sizes to its content, the drawing shows the stage, You might notice sits under it.
    const hero = main.querySelector('.hub-hero.sl-disc');
    if (once(hero, 'h')) {
      hero.classList.add('ssw-hero');
      const t = (hero.querySelector('h1') || {}).textContent || '', art = hero.querySelector('.sl-art'), aha = hero.querySelector('.sl-aha');
      const hit = HERO.find(([re]) => re.test(t)); if (art && hit) art.outerHTML = hit[1]();
      // Worth knowing: what she might notice plus the one thing to try, in one card inside the top card (Yarden's mockup).
      if (aha) {
        aha.classList.add('ssw-aha'); const lbl = aha.querySelector('small'); if (lbl) lbl.textContent = F('Worth knowing');
        const tryEl = (hero.nextElementSibling && hero.nextElementSibling.classList.contains('sl-try')) ? hero.nextElementSibling : main.querySelector('.sl-try');
        const tip = tryEl && tryEl.querySelector('p'), sp = aha.querySelector('span');
        // The original words stay: what she might notice, then the one thing to try, each on its own line.
        if (tip && sp) sp.insertAdjacentHTML('afterend', `<span class="ssw-try">${tip.innerHTML}</span>`);
        if (tryEl) tryEl.remove();
        hero.after(aha); // its own card right under the top card, like Health's "Worth knowing"
      }
      const eb = hero.querySelector('.hub-eyebrow'), ebt = eb ? eb.firstChild.textContent : '', view = STAGES.findIndex(([, re]) => re.test(ebt));
      if (view >= 0) {
        hero.dataset.sswView = view; // tabs are added by ensureTabs, after every other script has drawn
      }
    }
    // Rough day: short naps and night waking open their own pages.
    const rough = main.querySelector('.hub-rough');
    if (once(rough, 'r')) {
      const mo = m();
      rough.querySelectorAll('details.hub-rough-item').forEach(d => {
        const t = ((d.querySelector('summary b') || {}).textContent || '').trim();
        const to = t === 'Short naps' && mo >= 3 ? 'shortnap' : t === 'Waking a lot at night' && mo >= 3 && mo < 8 ? 'wakes' : null;
        if (!to) return;
        const dot = d.querySelector('.hub-dot');
        d.outerHTML = `<button class="hub-rough-item hub-rough-link" onclick="${go('chg:Sleep:d:' + to)}">${dot ? dot.outerHTML : ''}<b>${F(t)}</b><span class="hub-chev" aria-hidden="true">›</span></button>`;
      });
    }
    const head = main.querySelector('.hub-detail-head');
    if (!once(head, 'p')) return;
    if (PAGES[pg]) PAGES[pg]();
    // Videos fold into one quiet row, so they don't read like an ad.
    main.querySelectorAll('figure.hub-embed').forEach(fig => {
      const h = fig.previousElementSibling, t = (fig.querySelector('figcaption b') || {}).textContent || F('Watch how');
      fig.outerHTML = `<details class="ssw-video"><summary><span class="ssw-play" aria-hidden="true"></span><span><b>${F(t)}</b><small>${F('Video')}</small></span><span class="hub-chev" aria-hidden="true">›</span></summary>${fig.outerHTML}</details>`;
    });
    // Sample days for nap changes.
    if (DAYS[pg]) { const [h, body] = sec('What’s normal'); if (h && body) { h.textContent = F('Two sample days'); const keep = body.querySelector('.tpl-notes'); body.innerHTML = DAYS[pg]() + (keep ? keep.outerHTML : ''); body.classList.add('care-tpl-card', 'ssw-card'); } }
    // Example day: the whole 24 hours, night included.
    const rib = main.querySelector('.chg-ribbon');
    if (rib) {
      const toH = s => { const x = s.match(/(\d+)(?::(\d+))?\s*(am|pm)/); if (!x) return null; let h = +x[1] % 12 + (x[3] === 'pm' ? 12 : 0); return h + (+(x[2] || 0)) / 60; };
      const segs = [], li = [...main.querySelectorAll('.chg-day li')]; let bed = 19.25;
      li.forEach(l => { const ts = [...l.querySelectorAll('time')].map(t => toH(t.textContent)); if (l.classList.contains('is-sleep') && ts.length === 2) segs.push([ts[0], ts[1], 'nap']); if (l.classList.contains('is-bed') && ts[0]) bed = ts[0]; });
      segs.push([bed + .1, 30.9, 'night']);
      rib.outerHTML = band({ label: 'An example day and night: awake time, naps, then night sleep until morning.', start: 7, end: 31, dark: [[bed, 31]], segs, sun: [12.5], moon: [24], nightLabel: 'Night sleep', cls: 'ssw-24',
        caps: [[7, '7 am'], [12, 'Noon'], [bed, 'Bedtime'], [31, '7 am']] })
        + `<div class="ssw-key"><span><i class="k-awake"></i>${F('Awake')}</span><span><i class="k-nap"></i>${F('Nap')}</span><span><i class="k-night"></i>${F('Night sleep')}</span></div>`;
    }
  }
  // Stage tabs sit above the top card. Other scripts redraw the page after this one, so keep them in place on every change.
  function ensureTabs() {
    const hr = document.querySelector('#main .ssw-hero'); if (!hr || hr.dataset.sswView == null) return;
    const chip = hr.querySelector('.st-chip'); if (chip) chip.remove();
    if (!document.querySelector('#main .ssw-tabs')) hr.insertAdjacentHTML('beforebegin', tabs(+hr.dataset.sswView));
  }
  let queued = false;
  const watch = () => { const mn = document.querySelector('#main'); if (!mn || mn.__sswObs) return; mn.__sswObs = new MutationObserver(() => { if (queued) return; queued = true; Promise.resolve().then(() => { queued = false; try { ensureTabs(); } catch (e) { console.error(e); } }); }); mn.__sswObs.observe(mn, { childList: true, subtree: true }); };
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); watch(); ensureTabs(); } catch (e) { console.error(e); } return r; };
})();
