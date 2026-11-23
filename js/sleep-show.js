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
  const COL = { day: '#fff1cc', dusk: '#f3dfe6', night: '#e0e9f6', nap: '#829cc3', deep: '#46638c' };
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

  // One-line leads for the top card (the drawing and Worth knowing carry the rest).
  const LEADS = [[/tiny stretches/i, 'The body clock isn’t running yet.'], [/body clock/i, 'Light and dark start to mean something.'], [/growing up/i, 'Sleep cycles start to work like yours.'],
    [/rhythm/i, '{S} {get|gets} sleepy at about the same times.'], [/running out of room/i, '{S} can stay awake longer now.'], [/brain is busy/i, 'New skills and missing you show up at night.']];
  // Worth knowing, per stage: what parents may notice, then the one thing to try. Two short lines.
  // v4 header photos, by headline: [regex, photo, alt, pins [label, x%, y%, side]]
  const HERO_PIC = [
    [/tiny stretches/i, 'nightfeed.jpg', 'A parent feeding a newborn in a dim room at night', [['Waking to feed is normal', 58, 74, 'l']]],
    [/body clock/i, 'room.jpg', 'A bedroom at night with a crib next to the bed and one small lamp on', [['Dim light at night', 34, 27, 'r'], ['Crib in your room', 62, 62, 'l']]],
    [/growing up/i, 'night.jpg', 'A baby asleep on their back in a sleep sack with arms out', [['Arms out, in a sleep sack', 30, 56, 'r'], ['On {p} back', 34, 86, 'r']]],
    [/rhythm/i, 'sleepy.jpg', 'A baby rubbing their eyes on a parent’s shoulder', [['Rubbing eyes', 41, 54, 'l']]],
    [/running out of room/i, 'nap10.jpg', 'A baby napping in a crib in the daytime', []],
    [/brain is busy/i, 'standing.jpg', 'A baby pulling up to stand in the crib', [['Pulls up to stand', 58, 74, 'r']]]];
  const WORTH = [
    [/tiny stretches/i, '{S}’s a noisy sleeper.', 'Grunts and wriggles are active sleep. Pause first, but if {s}’s hungry, feed {o}.'],
    [/body clock/i, 'One night is longer. The next isn’t.', 'Body clocks develop slowly. Morning daylight together helps.'],
    [/growing up/i, '{S} was sleeping longer. Now {s}’s waking again.', 'That’s common for a few weeks. Keep your bedtime steps the same.'],
    [/rhythm/i, 'The third nap gets harder to fit in.', 'It’s fine if it’s short. After short naps, an earlier bedtime helps.'],
    [/running out of room/i, 'The catnap pushes bedtime later.', 'If it keeps happening for a week, {s}’s nearly ready for two naps.'],
    [/brain is busy/i, '{S} {stand|stands} up in the crib at bedtime.', 'New skills show up at night. Practice sitting back down during the day.']
  ];

  // The newborn loop: feed, a little awake time, sleep, then again. Not a schedule.
  const loopFig = (cls = '') => `<figure class="ssw-loop ${cls}" role="img" aria-label="${F('Feed, a little awake time, then sleep. The loop repeats around the clock.')}">
      <div class="ssw-loop-row"><span class="is-feed"><b>${F('Feed')}</b><small>${F('When hungry')}</small></span><i aria-hidden="true">›</i><span class="is-awake"><b>${F('Awake')}</b><small>${F('Until the first yawn')}</small></span><i aria-hidden="true">›</i><span class="is-sleep"><b>${F('Sleep')}</b><small>${F('Then it starts again')}</small></span></div>
      <svg class="ssw-loop-back" viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true"><path d="M262 2v8a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8V6" fill="none" stroke="#829cc3" stroke-width="1.8" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/><path d="M33 9l5-6 5 6" fill="none" stroke="#829cc3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>
      <figcaption>${F('Around the clock, often every 2–3 hours')}</figcaption></figure>`;

  /* ---------- top card timeline: evenly spaced steps, not to scale ---------- */
  // [kind, label, detail]: kind is wake, nap, cat (short nap), sleep (newborn), more (naps keep going), bed.
  const RHYTHM = [
    [/tiny stretches/i, [['sleep', 'Sleep', '2–4h'], ['wake', 'Awake', '45–60m'], ['sleep', 'Sleep', '2–4h'], ['wake', 'Awake', '45–60m'], ['sleep', 'Sleep', '2–4h']], 'Day and night alike'],
    [/body clock/i, [['wake', 'Awake', '1–1½h'], ['nap', 'Nap', ''], ['wake', 'Awake', '1–1½h'], ['nap', 'Nap', ''], ['more', '4–5 naps', ''], ['bed', 'Night', '3–5h']]],
    [/growing up/i, [['wake', 'Awake', '1½–2½h'], ['nap', 'Nap 1', ''], ['wake', 'Awake', ''], ['nap', 'Nap 2', ''], ['wake', 'Awake', ''], ['nap', 'Nap 3', ''], ['bed', 'Night', '5h+']]],
    [/rhythm/i, [['wake', 'Wake', '2–2½h'], ['nap', 'Nap 1', ''], ['wake', 'Wake', '2–2½h'], ['nap', 'Nap 2', ''], ['wake', 'Wake', '2–2½h'], ['cat', 'Catnap', 'short'], ['bed', 'Bed', '7–8 pm']]],
    [/running out of room/i, [['wake', 'Wake', '2½–3h'], ['nap', 'Nap 1', ''], ['wake', 'Wake', '2½–3h'], ['nap', 'Nap 2', ''], ['wake', 'Wake', ''], ['cat', 'Catnap', 'fading'], ['bed', 'Bed', 'later']]],
    [/brain is busy/i, [['wake', 'Wake', '2½–4h'], ['nap', 'Nap 1', ''], ['wake', 'Wake', '2½–4h'], ['nap', 'Nap 2', ''], ['wake', 'Wake', '2½–4h'], ['bed', 'Bed', '7–8 pm']]]
  ];
  const ICO = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>',
    z: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h5l-5 6h5M13 12h6l-6 6h6"/></svg>' };
  const rhythm = ([, steps, note]) => `<div class="ssw-rhythm" role="img" aria-label="${F(steps.map(x => (x[1] + ' ' + x[2]).trim()).join(', '))}"><ol style="grid-template-columns:repeat(${steps.length},1fr)">${steps.map(([k, l, d], i) =>
      `<li class="is-${k}"><span class="ssw-rh-bar">${k === 'bed' ? ICO.moon : (k === 'nap' || k === 'cat' || k === 'sleep') ? ICO.z : k === 'more' ? '···' : i === 0 ? ICO.sun : ''}</span><b>${F(l)}</b>${d ? `<small>${F(d)}</small>` : ''}</li>`).join('')}</ol>${note ? `<p>${F(note)}</p>` : ''}</div>`;

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
      caps: [[9.9, 'Nap'], [13.8, 'Nap'], [17.55, 'Catnap'], [20, 'Later bedtime']] })],
    [/brain is busy/i, () => band({ flat: true, label: 'A day with a morning nap and an afternoon nap, then bedtime.', start: 7, end: 20.5, dark: [[19.2, 20.5]],
      segs: [[9.5, 11, 'nap'], [14, 15.5, 'nap']], moon: [19.3], caps: [[10.25, 'Morning nap'], [14.75, 'Afternoon nap'], [19.3, 'Bedtime']] })]
  ];

  // Stage tabs (like Development's month tabs) and a photo of a baby that age beside the headline.
  const STAGES = [['Newborn', /round-the-clock/i, 'hero-0.jpg'], ['Longer nights', /longer nights/i, 'hero-1.jpg'], ['Three naps', /three naps/i, 'hero-2.jpg'], ['Two naps', /two naps/i, 'standing.jpg']];
  const stageNow = () => { try { return C().CFG.Sleep.stage(m()); } catch (e) { return -1; } };
  const tabs = view => { const cur = stageNow(), live = (() => { try { return C().live(); } catch (e) { return true; } })();
    return `<nav class="ssw-tabs" aria-label="${F('Sleep stages')}">${STAGES.map(([l], i) => `<button class="${i === view ? 'is-on' : ''} ${live && i === cur ? 'is-now' : ''}" onclick="${i === cur && live ? `openPage('topic:Sleep')` : `chgGo('chg:Sleep:s:${i}')`}" ${i === view ? 'aria-current="step"' : ''}>${F(l)}</button>`).join('')}</nav>`; };

  /* ---------- photo blocks ---------- */
  const photoRows = rows => `<ol class="ssw-photorows">${rows.map(([img, alt, t, s, tag, tone]) => `<li><span class="ssw-ph"><img src="${IMG + (PHOTO_OF[img] || img)}" alt="${F(alt)}" loading="lazy"></span><span class="ssw-copy">${tag ? `<em class="ssw-tag ${tone || ''}">${F(tag)}</em>` : ''}<b>${F(t)}</b><small>${F(s)}</small></span></li>`).join('')}</ol>`;
  const pinPhoto = (img, alt, pins, cls = '') => `<figure class="ssw-pinphoto ${cls}"><img src="${IMG + (PHOTO_OF[img] || img)}" alt="${F(alt)}">${pins.map(([l, x, y, side]) => `<span class="ssw-pin is-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(l)}</span></span>`).join('')}</figure>`;
  const pair = (a, b) => `<div class="ssw-pair">${[a, b].map(([img, alt, label, line, tone]) => `<figure><figcaption class="${tone || ''}">${F(label)}</figcaption><span class="ssw-ph"><img src="${IMG + (PHOTO_OF[img] || img)}" alt="${F(alt)}" loading="lazy"></span><small>${F(line)}</small></figure>`).join('')}</div>`;
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
    const photos = `<section class="care-tpl-card ssw-photosteps"><ol>${S.map(([img, alt, t, s], i) => `<li><span class="ssw-ph"><img src="${IMG + (PHOTO_OF[img] || img)}" alt="${F(alt)}" loading="lazy"></span><span class="ssw-copy"><i>${i + 1}</i><b>${F(t)}</b><small>${F(s)}</small></span></li>`).join('')}</ol>`
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
      caps: [[s0 + len / 2, `Ends ${clock(end)}`], [end + aw / 2, `Wake window ~${awL}`], [Math.min(next + .6, 13), `Next nap ${clock(next)}`]] });
  }
  window.__sswShort = i => { const f = $('#ssw-short'); if (!f) return; f.innerHTML = shortFig(i); $$('.ssw-chips button').forEach((b, k) => b.setAttribute('aria-pressed', k === i)); };
  // ---- Sleep challenges (Nov 21), built like Feeding challenges: a question, four tiles for this age, "Other concerns" folded,
  // and short pages in the shared check template (How to tell · What helps · When to call), photos where they teach.
  // Sources: AAP (HealthyChildren.org) "Getting your baby to sleep", "Sleeping like a baby", "Safe sleep tips for sleep-deprived
  // parents"; Nationwide Children's; Royal Children's Hospital Melbourne; KidsHealth (Nemours) "Naps"; Harvard Health. Needs pediatric review.
  const WW = mo => mo < 1.5 ? [.75, 1, '45–60 min'] : mo < 3 ? [1, 1.5, '1–1½ hrs'] : mo < 5 ? [1.5, 2.5, '1½–2½ hrs'] : mo < 7 ? [2, 2.5, '2–2½ hrs'] : mo < 9 ? [2.5, 3.5, '2½–3½ hrs'] : [2.5, 4, '2½–4 hrs'];
  const ENDS = [[15.5, '3:30'], [16.5, '4:30'], [17.25, '5:15'], [18, '6:00']];
  function lateFig(i) {
    const [end] = ENDS[i], [lo, hi] = WW(m()), b0 = end + lo, b1 = end + hi, late = b0 > 20.5;
    return band({ label: `The last nap ends at ${clock(end)}, so bedtime lands between ${clock(b0)} and ${clock(b1)}.`, start: 13, end: 22.5, dark: [[Math.min(b0, 22.4), 22.5]], moon: [Math.min(b0, 22.3)],
      segs: [[end - 1, end, 'nap']], gap: 36, caps: [[end - .5, `Ends ${clock(end)}`], [Math.min(b0, 21.6), `Bedtime ~${clock(b0)}`]] })
      + `<p class="ssw-verdict ${late ? 'is-late' : ''}">${F(late ? 'That’s late for most families. Next time, wake {o} gently after 30–45 minutes.' : `Aim for bedtime between ${clock(b0)} and ${clock(b1)}.`)}</p>`;
  }
  window.__sswLate = i => { const f = $('#ssw-late'); if (!f) return; f.innerHTML = lateFig(i); $$('.ssw-late-chips button').forEach((b, k) => b.setAttribute('aria-pressed', k === i)); };
  const T = () => H().TPLB, ph = n => 'photo:sleep/' + n;
  const fever = () => { const mo = m(); return mo < 3 ? 'a temperature of 100.4°F or higher (call right away, day or night)' : mo < 6 ? 'a temperature of 101°F or higher' : 'a temperature of 103°F or higher, or a fever lasting more than a day'; };
  const CALL911 = { now: '{s} struggles to breathe or turns blue, won’t wake, or is floppy.', nowLabel: 'Call 911' };
  // Problem pages (Yarden's Nov 22 mockups): the parent's question as the title, the answer in a card, one picture (a sequence
  // for "what happens next", or two side by side for a choice), at most three steps, then when to call.
  const answer = (ic, b, line, eyebrow = '') => `<section class="ssw-answer"><i aria-hidden="true">${H().art(ic, 'Sleep')}</i><span>${eyebrow ? `<em>${F(eyebrow)}</em>` : ''}<b>${F(b)}</b><small>${F(line)}</small></span></section>`;
  const seq = (items, rule) => `<section class="care-tpl-card ssw-seq is-plain"><ol>${items.map(([ic, t, sub], i) => `<li class="${i ? '' : 'is-first'}"><i aria-hidden="true">${H().art(ic, 'Sleep')}</i><b>${F(t)}</b>${sub ? `<small>${F(sub)}</small>` : ''}</li>`).join('<li class="ssw-seq-arrow" aria-hidden="true">→</li>')}</ol>${rule ? `<p class="ssw-rule"><i aria-hidden="true">${H().art('idea', 'Sleep')}</i>${F(rule)}</p>` : ''}</section>`;
  const PHOTO_OF = {"ill/asleep.jpg": "nap.jpg", "ill/overtired.jpg": "overtired.jpg", "ill/happy.jpg": "hero-1.jpg"};
  const versus = (a, b) => `<section class="ssw-vs">${[a, b].map(([img, alt, t, line, best], i) => `<div class="${best ? 'is-best' : ''}"><em class="${best ? '' : 'is-blank'}">${best ? '✓ ' + F(best) : '&nbsp;'}</em><span class="ssw-vs-pic"><img src="${IMG + (PHOTO_OF[img] || img)}" alt="${F(alt)}" loading="lazy"></span><b>${F(t)}</b><small>${F(line)}</small></div>`).join('')}</section>`;
  const todo = list => `<section class="care-tpl-card ssw-todo"><ol>${list.map(([t, sub, ic], i) => `<li><i>${i + 1}</i><span><b>${F(t)}</b>${sub ? `<small>${F(sub)}</small>` : ''}</span>${ic ? `<u aria-hidden="true">${H().art(ic, 'Sleep')}</u>` : ''}</li>`).join('')}</ol></section>`;
  const psec = (h, html) => html ? `<h2 class="hub-h2">${F(h)}</h2>${html}` : '';
  const page = (label, title, body, art) => H().detail('Sleep', STAGES[Math.max(0, stageNow())] ? STAGES[Math.max(0, stageNow())][0] : label, title, '', `<div class="ssw-topic ssw-prob">${body}</div>`, art);
  const callsFor = extra => T().calls(Object.assign({ ped: extra }, CALL911));
  function shortNapProb() {
    const mo = m();
    return page('Naps', 'A short nap changes the day', answer('clock', 'The next sleep often needs to come sooner', 'Follow {p} cues and bring the next sleep forward a little.', 'What this usually means')
      + psec('How to adjust the day', seq([['sun', 'The nap was short', '', 'ill/short.jpg'], ['clock', 'Next nap 15–30 min earlier', '', 'ill/clock.jpg'], ['moon', 'Bedtime may come earlier too', '', 'ill/crib.jpg']], 'Earlier is usually better than overtired.'))
      + (mo < 6 ? `<p class="ssw-note"><b>${F('Very common now.')}</b> ${F('Naps of 30–45 minutes are normal at 3–5 months. They get longer with time.')}</p>` : `<p class="ssw-note"><b>${F('Short naps most days?')}</b> ${F('Try the nap 15 minutes earlier or later. A dark room and white noise help.')}</p>`), 'sun');
  }
  function skipProb() {
    return page('Naps', stageNow() === 2 ? 'What if the catnap doesn’t happen?' : 'What if a nap doesn’t happen?', answer('moon', 'It happens, and that’s okay', 'An earlier bedtime keeps {o} from getting overtired.')
      + psec('Two possible evenings', versus(['ill/asleep.jpg', 'A calm baby asleep in a sleep sack', 'An earlier bedtime', 'Helps {o} catch up, often a calmer night', 'Usually better'], ['ill/overtired.jpg', 'An overtired baby crying', 'The usual bedtime', 'Often an overtired, harder evening', '']))
      + psec('What to do', todo([['Move bedtime earlier', 'About 30 minutes earlier than usual', 'clock'], ['Keep the usual routine', 'The same steps, just a bit earlier', 'book'], ['Watch for sleepy cues', '{S} may be ready sooner than usual', 'eye']])), 'sun');
  }
  function lateProb() {
    const [, , wl] = WW(m());
    return page('Naps', 'A nap running close to bedtime?', answer('clock', 'Bedtime comes about one wake window after the last nap', `Right now that’s ${wl}. Tap when the nap ended.`)
      + `<section class="care-tpl-card ssw-card"><div class="ssw-chips ssw-late-chips" role="group">${ENDS.map(([, l], i) => `<button aria-pressed="${i === 1}" onclick="__sswLate(${i})">${F(l + ' pm')}</button>`).join('')}</div><div id="ssw-late">${lateFig(1)}</div></section>`
      + psec('Let {o} sleep, or wake {o}?', versus(['ill/asleep.jpg', 'A baby napping', 'Let {o} sleep', 'Fine if bedtime still lands by about 8 pm', ''], ['ill/happy.jpg', 'A baby awake and happy', 'Wake {o} gently', 'After 30–45 minutes, if bedtime would be very late', ''])), 'sun');
  }
  function fightProb() {
    return page('Naps', 'Fighting a nap?', answer('sun', 'You can’t make a baby sleep', 'Aim for rest: a fair try, a short break, then try again.')
      + psec('What to do', seq([['moon', '20–30 minutes', 'Dark and calm', 'ill/crib.jpg'], ['heart', 'A short break', 'Up and cuddles', 'ill/happy.jpg'], ['clock', 'Try again', 'Or wait for the next nap', 'ill/clock.jpg']], '', ['Nap time', 'Try again']))
      + psec('Next time, look at the timing', versus(['ill/happy.jpg', 'A happy, wide-awake baby', 'Not tired yet', 'Happy and chatty. Try a little later', ''], ['ill/overtired.jpg', 'An overtired baby crying', 'Overtired', 'Eye rubs, arching. Start earlier', '']))
      + `<p class="ssw-note"><b>${F('A nap on the go counts.')}</b> ${F('If {s} falls asleep in a car seat or swing, move {o} to a flat, safe space.')}</p>`, 'sun');
  }
  function nightProb() {
    const mo = m(), young = mo < 6;
    return page('Night sleep', young ? 'Waking at night is normal now' : 'Waking often at night?', answer('moon', young ? 'Most babies under 6 months wake to feed' : 'Everyone wakes between sleep cycles', young ? 'Keep each waking short, dim and quiet.' : 'Many babies settle back in a minute or two.')
      + psec('What to do when {s} stirs', seq([['eye', 'Stirring', 'Grunts, whimpers', 'ill/short.jpg'], ['clock', 'Pause first', '1–2 minutes', 'ill/clock.jpg'], ['heart', 'Help if needed', 'Feed, change, settle', 'ill/asleep.jpg']], 'Feel {p} neck: sweaty means too warm.', ['Night', 'Back to sleep']))
      + psec('Why bedtime matters at 2 am', versus(['down.jpg', 'A drowsy baby laid down in a crib', 'Down drowsy', 'Wakes and drifts back on {p} own', 'Easier at night'], [nursing() ? 'feed-nurse.jpg' : 'feed.jpg', 'A baby falling asleep while feeding', 'Asleep on the feed', 'Wakes looking for the feed again', '']))
      + `<p class="ssw-note"><b>${F(young ? 'Night feeds are normal now.' : 'Something new?')}</b> ${F(young ? 'They drop on their own as {s} grows.' : 'Teeth, a new skill or missing you can bring wakings back for 1–2 weeks.')}</p>`
      + (callsFor('night waking comes with ' + fever() + ', poor feeding or pain, or {s} snores loudly or pauses in breathing.')), 'moon');
  }
  function propsProb() {
    const mo = m();
    return page('Falling asleep', mo < 4 ? 'Only sleeps on you?' : 'Only sleeps with bouncing?', answer('heart', mo < 4 ? 'At this age, that’s normal' : 'It works, until it doesn’t', 'You can step back slowly, a few nights at a time.')
      + psec('Step back, a few nights each', seq([['heart', 'Until drowsy', 'Not fully asleep'], ['crib', 'Into the crib', 'Hand on {p} chest'], ['sofa', 'Sit nearby', 'Then farther away']]))
      + psec('Laying {o} down', versus(['down.jpg', 'A baby laid down drowsy in a crib', 'Drowsy, then down', 'Learns to finish falling asleep', 'Easier over time'], ['bassinetnap.jpg', 'A baby deeply asleep in a bassinet', 'Deep asleep, then down', 'Wait for limp arms and slow breathing', '']))
      + `<p class="ssw-note"><b>${F('Feeding to sleep?')}</b> ${F('It doesn’t have to change if it works for you.')}</p><p class="ssw-note is-safe"><b>${F('Getting sleepy holding {o}?')}</b> ${F('Put {o} in the crib, on {p} back. Never sleep with {o} on a sofa or armchair.')}</p>`, 'heart');
  }
  // Waking at night (one page for "Woke up?" and "Waking often").
  function nightPage() {
    const mo = m(), young = mo < 6;
    return H().tplPage('Sleep', { type: 'check', label: 'Sleep challenges', art: 'moon', title: young ? 'Waking at night is normal now' : 'Waking at night? Pause, then look',
      why: young ? 'Most babies under 6 months wake to feed. Here’s how to keep each waking short.' : 'Everyone wakes between sleep cycles. Many babies settle back in a minute or two.',
      tellTitle: 'What {s} might need',
      figure: () => T().tiles([['bottle', 'Hungry', 'A full, steady feed, then a long stretch'], ['heart', 'Help to resettle', 'A few sucks or a bounce, asleep in minutes'], ['diaper', 'Comfort', 'Wet, too warm, or a sudden cry']], 'Sleep')
        + `<section class="care-tpl-card ssw-card ssw-why2am"><p class="ssw-ask">${F('Why bedtime matters at 2 am')}</p>${pair([nursing() ? 'feed-nurse.jpg' : 'feed.jpg', 'A baby falling asleep while feeding', 'Asleep on the feed', 'Wakes looking for it again', 'is-red'], ['down.jpg', 'A drowsy baby laid down in a crib', 'Down drowsy', 'Wakes and drifts back', 'is-green'])}</section>`,
      tell: [young && ['', 'Night feeds are normal now', 'They drop on their own as {s} grows'], mo >= 7 && ['', 'Something new?', 'Teeth, a new skill or missing you can bring wakings back for 1–2 weeks']].filter(Boolean),
      helps: [[ph('back'), 'Pause first', '1–2 minutes'], [ph('nightfeed'), 'Dim and quiet', 'Feel {p} neck: sweaty is too warm'], [ph('down'), 'Down drowsy', 'At bedtime first']],
      helpsNotes: [['', 'Needs a bounce or a feed every time?', 'Step back slowly. See “Only sleeps with your help”']],
      calls: Object.assign({ ped: 'night waking comes with ' + fever() + ', poor feeding or pain, or {s} snores loudly or pauses in breathing.' }, CALL911) });
  }
  // Naps gone wrong: fighting, skipped, late or short.
  function napPage() {
    const mo = m();
    return H().tplPage('Sleep', { type: 'check', label: 'Sleep challenges', art: 'sun', title: 'A rough nap? The next sleep fixes it',
      why: 'Fighting it, skipped, short or late, the fix is in the timing.',
      tellTitle: 'How to tell',
      figure: () => T().tiles([['sun', 'Not tired yet', 'Happy and chatty in the crib'], ['eye', 'Overtired', 'Eye rubs, arching, hard to settle']], 'Sleep')
        + `<section class="care-tpl-card ssw-card"><p class="ssw-ask">${F('When did the last nap end?')}</p><div class="ssw-chips ssw-late-chips" role="group">${ENDS.map(([, l], i) => `<button aria-pressed="${i === 1}" onclick="__sswLate(${i})">${F(l + ' pm')}</button>`).join('')}</div><div id="ssw-late">${lateFig(1)}</div></section>`,
      tell: mo < 6 ? [['', 'Short naps are normal now', 'Naps of 30–45 minutes are common at 3–5 months']] : [],
      helps: [[ph('nap'), 'Fighting it?', '20–30 minutes, then a break'], [ph('sleepy'), 'Skipped it?', 'Next sleep earlier'], [ph('book'), 'Last nap late?', 'Wake {o} gently']],
      helpsNotes: [['', 'A nap on the go counts', 'If {s} falls asleep in a car seat or swing, move {o} to a flat, safe space'], mo >= 6 && mo < 10 && ['', 'Fighting the last nap most days?', 'Three naps may be becoming two']].filter(Boolean),
      calls: { ped: '{s}’s unusually sleepy or hard to wake, or has ' + fever() + '.' } });
  }
  // Only sleeps with your help: bouncing, rocking, feeding, or only in your arms.
  function propsPage() {
    const mo = m();
    return H().tplPage('Sleep', { type: 'check', label: 'Sleep challenges', art: 'heart', title: mo < 4 ? 'Only sleeps on you? Normal now' : 'Bouncing to sleep works, until it doesn’t',
      why: mo < 4 ? 'If it’s wearing you out, you can start stepping back slowly.' : 'You can step back slowly, a few nights at a time.',
      tellTitle: 'Step back, a few nights each',
      figure: () => T().tiles([['heart', 'Bounce till drowsy', 'Not fully asleep'], ['hand', 'Hold still', 'Gentle swaying is fine'], ['crib', 'Into the crib', 'A hand on {p} chest'], ['sofa', 'Sit nearby', 'Then a little farther']], 'Sleep', true),
      tell: [['', 'Feeding to sleep?', 'It doesn’t have to change if it works for you']],
      helps: [[ph(nursing() ? 'feed-nurse' : 'feed'), 'Feed earlier', 'Then pajamas and a book'], [ph('bassinetnap'), 'One crib nap a day', 'Morning is easiest'], [ph('down'), 'Deep asleep first', 'Limp arms, slow breathing']],
      helpsNotes: [['', 'Getting sleepy holding {o}?', 'Put {o} in the crib, on {p} back. Never sleep with {o} on a sofa or armchair']] });
  }
  // Getting more sleep yourself.
  function yourSleepPage() {
    return H().tplPage('Sleep', { type: 'check', label: 'Sleep challenges', art: 'heart', title: 'Protect your own sleep too',
      why: 'A few changes help, even while {s} still wakes.',
      tellTitle: 'Take shifts, if you can',
      figure: () => `<section class="care-tpl-card ssw-card">${band({ label: 'One night split into two shifts, so each adult gets one longer stretch of sleep.', start: 21, end: 31, segs: [[21.2, 26, 'night'], [26.1, 30.8, 'nap']], gap: 30, flat: 1, caps: [[23.6, 'You’re on'], [28.4, 'They’re on']] })}</section>`,
      tell: [['', 'With a partner or a helper', 'Each of you gets one stretch of 4–5 hours']],
      helps: [['moon', 'Bed early', 'Soon after {p} bedtime'], ['home', 'Let chores wait', 'Sleep when you can'], ['bottle', 'Share a feed', 'Pumped milk or formula, if it fits your plan']],
      helpsNotes: [['', 'Feeding and fighting sleep?', 'Feed in your bed, cleared of pillows and blankets, never on a sofa or armchair. If you doze off, move {o} back to {p} own space when you wake'],
        ['', 'Feeling low for more than two weeks?', 'Talk to your doctor, or call or text 1-833-852-6262, any time. In a crisis, call or text 988']] });
  }
  // The smaller hiccups, same template.
  const HICCUP = {
    soon: () => ({ title: 'Up soon after bedtime? Try earlier', why: 'A wake-up 30–60 minutes after bedtime often means {s} was overtired.', signs: [['eye', 'Overtired', 'Eye rubs, arching at bedtime'], ['sun', 'Late last nap', 'Not tired enough yet']],
      helps: [['clock', 'Bedtime earlier', '15–30 minutes, for a week'], ['bottle', 'Feed earlier', 'Not right at the end'], ['moon', 'Dark from the start', 'Lights low for the routine']] }),
    split: () => ({ title: 'Up for an hour at night? Look at the day', why: 'Sometimes {s} has had enough sleep already, from long naps or an early bedtime.', signs: [['sun', 'Long naps', 'More day sleep than usual'], ['moon', 'Happy, not upset', 'Chatting or playing in the crib']],
      helps: [['clock', 'Cap the last nap', 'Wake {o} gently'], ['sunrise', 'Same wake-up', 'Even after a rough night'], ['moon', 'Keep it boring', 'Dark, quiet and brief']] }),
    bedtime: () => ({ title: 'Fighting bedtime? It’s usually timing', why: 'Overtired and not tired enough look surprisingly alike.', signs: [['eye', 'Overtired', 'Eye rubs, arching, hard to settle'], ['sun', 'Not tired yet', 'Happy, chatty, wriggly']],
      helps: [['clock', 'Start earlier', 'If {s}’s overtired'], ['sun', 'A little later', 'If {s}’s not tired'], ['book', 'Same steps', '20–30 minutes, lights low']] }),
    early: () => ({ title: 'Up before 6? Treat it as night', why: 'It’s often a late bedtime, an early sunrise, or a long last nap.', signs: [['sunrise', 'Early light', 'The room gets bright'], ['moon', 'Late bedtime', 'Overtired babies wake early']],
      helps: [['moon', 'Before 6 am', 'Dark, quiet and brief'], ['home', 'Blackout curtains', 'Light wakes babies early'], ['clock', 'Earlier bedtime', '15–30 minutes, for a week']] }) };
  function hiccupPage(k) { const h = HICCUP[k] ? HICCUP[k]() : HICCUP.bedtime(); return H().tplPage('Sleep', Object.assign({ type: 'check', label: 'Sleep challenges', art: 'moon', calls: { ped: 'sleep changes come with ' + fever() + ', poor feeding or pain.' } }, h)); }
  // The hub: what's keeping her up? Four tiles for this age, one row, everything else folded.
  function roughPage() {
    const mo = m();
    const tile = (to, ic, t, sub, tone) => `<button class="ssw-ch-tile is-${tone}" onclick="${go(to)}"><span class="ssw-ch-ic">${H().art(ic, 'Sleep')}</span><b>${F(t)}</b><small>${F(sub)}</small></button>`;
    const W = ['chg:Sleep:d:wakes', 'moon', mo < 3 ? 'Waking at night' : 'Waking often', mo < 3 ? 'To feed, or something else' : 'Every hour or two', 'night'],
      N = ['chg:Sleep:d:shortnap', 'sun', 'A short nap', 'The rest of the day shifts', 'naps'], FN = ['chg:Sleep:d:naphelp:fight', 'sun', 'Fighting a nap', 'Crying instead of sleeping', 'bed'],
      P = ['chg:Sleep:d:props', 'heart', mo < 4 ? 'Only sleeps on you' : 'Needs bouncing to sleep', mo < 4 ? 'Wakes when set down' : 'Or rocking, or a feed', 'bed'],
      C = ['chg:Sleep:d:crying', 'heart', 'Crying a lot', 'Hard to settle in the evening', 'safe'],
      E = ['chg:Sleep:d:hiccup:early', 'sunrise', 'Up too early', 'Before 6 am', 'safe'],
      R = ['chg:Sleep:d:regress', 'moon', 'Was sleeping better', 'The 4-month sleep regression', 'safe'],
      S = ['chg:Sleep:d:nightwake', 'moon', 'Standing in the crib', 'Or missing you at night', 'safe'];
    P[4] = 'safe'; const four = mo < 3 ? [W, P, C, ['chg:Sleep:d:daynight', 'sunrise', 'Days and nights mixed', 'Awake when you’re not', 'naps']] : [W, N, FN, P];
    const used = four.map(x => x[0]);
    const row = (to, ic, t, sub) => H().row({ cat: 'Sleep', icon: ic, title: t, sub, onclick: go(to) });
    const other = [mo >= 3 && ['chg:Sleep:d:naphelp:skip', 'sun', 'A nap didn’t happen', 'Usually, an earlier bedtime'], mo >= 3 && ['chg:Sleep:d:naphelp:late', 'clock', 'A nap running close to bedtime', 'Let her sleep, or wake her?'], mo >= 3 && mo < 6 && R && ['chg:Sleep:d:regress', 'moon', 'Was sleeping better', 'The 4-month sleep regression'], mo >= 8 && ['chg:Sleep:d:nightwake', 'moon', 'Standing in the crib', 'Or missing you at night'], mo >= 3 && ['chg:Sleep:d:hiccup:soon', 'clock', 'Up soon after bedtime', 'Often overtired'], mo >= 6 && ['chg:Sleep:d:hiccup:split', 'sunrise', 'Awake for an hour at night', 'Look at the day'],
      mo >= 2 && ['chg:Sleep:d:hiccup:bedtime', 'book', 'Fighting bedtime', 'Usually the timing'], mo >= 4 && ['chg:Sleep:d:hiccup:early', 'sunrise', 'Up too early', 'Before 6 am'],
      mo < 3 && ['chg:Sleep:d:crying', 'heart', 'Crying a lot', 'What helps, and when it eases'], mo >= 8 && ['chg:Sleep:d:nightwake', 'moon', 'Night waking comes back', 'New skills, missing you'],
      ['chg:Sleep:d:away', 'plane', 'Traveling, or the clocks change', 'Keeping sleep on track']].filter(x => x && !used.includes(x[0]));
    const body = `<div class="ssw-ch-grid">${four.map(x => tile(...x)).join('')}</div>`
      + row('chg:Sleep:d:yoursleep', 'heart', 'Getting more sleep yourself', 'Shifts, safe night feeds, and you')
      + `<details class="ssw-ch-more"><summary><span><b>${F('Other sleep hiccups')}</b><small>${F(mo < 3 ? 'Bedtime, travel and more' : 'Skipped or late naps, early mornings and more')}</small></span><i aria-hidden="true">›</i></summary><div class="hub-list">${other.map(x => row(...x)).join('')}</div></details>`
      + T().calls(Object.assign({ ped: 'sleep changes come with ' + fever() + ', poor feeding or pain, or {s} snores loudly or pauses in breathing.' }, CALL911));
    return H().detail('Sleep', 'Sleep challenges', 'What’s keeping {o} up?', 'Pick what you’re noticing. Most of it is common, and fixable.', body, 'moon');
  }
  function shortNapPage() {
    const mo = m(), early = mo < 6, three = mo >= 4 && mo < 9 && answers.twoNaps !== 'Yes', start = 1;
    const ifs = [
      three && ['moon', 'Skipped the catnap?', 'Move bedtime earlier tonight.'],
      !early && ['sun', 'Short naps most days?', 'Try the nap 15 minutes earlier or later. A dark room and white noise help.'],
      mo >= 6 && mo < 10 && ['clock', 'Fighting the last nap most days?', 'It may be time for two naps.']
    ].filter(Boolean);
    const fig = () => `<section class="care-tpl-card ssw-card"><p class="ssw-ask">${F('Say a nap starts at 9 am. How long did it last?')}</p><div class="ssw-chips" role="group">${NAPS.map(([, l], i) => `<button aria-pressed="${i === start}" onclick="__sswShort(${i})">${F(l)}</button>`).join('')}</div><div id="ssw-short">${shortFig(start)}</div>`
      + notes([['', 'Go by {p} cues', 'The times are a guide, not a schedule'], ['', 'The last nap of the day?', 'Bedtime moves earlier the same way']]) + `</section>`;
    return H().tplPage('Sleep', { type: 'expect', label: 'Naps', art: 'sun', title: 'A short nap moves the next one up',
      why: early ? 'Naps of 30–45 minutes are very common now. They get longer with time.' : 'Timing, light, teething or a new skill can shorten naps for a while.',
      normalTitle: 'See how the day shifts', normal: fig,
      doOrdered: true, do: [['clock', 'Give it a few minutes', '{S} may resettle on {p} own'], ['eye', 'Watch for sleepy cues', 'More than the clock'], ['moon', 'Offer the next nap sooner', 'Even if it’s early']],
      action: () => ifs.length ? H().TPLB.sec('If it keeps happening', H().TPLB.rows(ifs, 'Sleep')) : '' });
  }

  // Night waking: what's happening → what to check → what to try, as a flow.
  // Night waking (Yarden's mockup): give it a moment, then two clear branches: hungry, or uncomfortable.
  const flow = () => `<section class="care-tpl-card ssw-flow">
      <div class="ssw-flow-first"><span><b>${F('First, give it a moment')}</b><small>${F('{S} may stir between sleep cycles and settle back on {p} own.')}</small></span><em>${F('1–2 min')}</em></div>
      <svg class="ssw-flow-split" viewBox="0 0 300 26" preserveAspectRatio="none" aria-hidden="true"><path d="M150 0v8M75 22V14a6 6 0 0 1 6-6h138a6 6 0 0 1 6 6v8" fill="none" stroke="#8a95ad" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>
      <div class="ssw-flow-two">
        <div class="is-feed"><b>${F('Still upset and hungry?')}</b><small>${F('Rooting, sucking hands, or getting more upset. Feed {o}.')}</small></div>
        <div class="is-comfort"><b>${F('Uncomfortable?')}</b><small>${F('Check for a wet diaper, too hot or cold, or sore gums. Then soothe.')}</small></div>
      </div>
      <p class="ssw-flow-end">${F('Then settle {o} your usual way: brief, dark and quiet.')}</p></section>`;
  const nightFig = () => band({ label: 'A night of sleep with brief wakings, most of them settling on their own.', start: 19, end: 31, dark: [[19, 31]],
    segs: [[19.4, 23.1, 'night'], [23.6, 26.5, 'night'], [27, 30.7, 'night']], sparks: [23.35, 26.75], caps: [[21.2, 'Sleep'], [25, 'Brief wakings'], [28.8, 'Back to sleep']] });
  function wakesPage() {
    const mo = m();
    return H().tplPage('Sleep', { type: 'expect', label: 'Night sleep', art: 'moon', title: 'Brief wakings happen between sleep cycles',
      why: 'Many babies stir and settle back on their own. A short pause first gives {o} the chance.',
      normalTitle: 'What a night looks like', normal: nightFig,
      doTitle: 'What to do', do: [], action: () => H().TPLB.sec('What to do', flow()) + H().TPLB.sec('Common reasons', H().TPLB.chips(['Hunger', 'A new skill, like rolling', 'Teething or a cold', 'Overtired after short naps'],
        [mo >= 6 && ['', 'Waking every hour or two?', 'Ask your pediatrician about night feeds']].filter(Boolean))),
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
  // Topic pages (Nov 20): each tile on the main page is a steady door that means the same thing at every age. Behind it,
  // one page per topic: what's new for the baby now, then anytime pages, then what comes next and what came before.
  // The "now" cards are read from the page the tile was tapped on, so they always match the main page.
  // [route, step (0–5 by age, null = any age), age label, title, line]
  const TOPICS = {
    night: { name: 'Night sleep', art: 'moon', lead: 'How nights change, from tiny stretches to sleeping through.', items: [
      ['d:daynight', 0, 'First weeks', 'Bright days and dim nights set {p} clock', 'Helping {o} tell day from night', 'sunrise'],
      ['d:stretch', 1, '6 weeks–3 months', '{P} longest night sleep grows over months', 'From 2–4 hours to 10–12 by a year', 'moon'],
      ['d:regress', 2, 'Around 4 months', 'Waking more is the 4-month sleep regression', 'Why it happens, and how to respond', 'wave'],
      ['d:wakes', null, 'Any age', 'Woke up? What {s} might need', 'Stirring, hungry, uncomfortable or unwell', 'eye'],
      ['d:nightfeeds', 4, '7–8 months', 'Night feeds drop as days get fuller', 'When to drop one, and how', 'bottle'],
      ['d:nightwake', 5, '8–12 months', 'Night waking often comes back for a while', 'New skills, teeth, and missing you', 'stand']] },
    naps: { name: 'Naps', art: 'sun', lead: 'How naps change, from any time at all to two a day.', items: [
      ['d:steps0', 0, 'First weeks', 'Spot the yawn, soothe, then down', 'Sleepy cues, and how to soothe', 'heart'],
      ['d:napsearly', 1, '6 weeks–3 months', 'Short, frequent naps are normal now', 'Arms, carrier and stroller naps all count', 'carrier'],
      ['d:predictable', 2, '3–5 months', 'Naps start to settle into set times', 'How to find {p} nap times', 'sunrise'],
      ['d:shortnap', null, 'From 3 months', 'When a nap doesn’t go to plan', 'Fighting it, skipped, too late or too short', 'clock'],
      ['d:day:2', 3, '5–7 months', 'An example day with three naps', 'Naps, awake time and bedtime', 'notepad'],
      ['d:catnap', 4, '7–8 months', 'Three naps become two', 'Signs, and how to switch', 'sun'],
      ['d:day:3', 5, '8–12 months', 'An example day with two naps', 'Naps, awake time and bedtime', 'notepad']] },
    bed: { name: 'Bedtime', art: 'book', lead: 'The routine, falling asleep, and bedtime as {s} {grow|grows}.', items: [
      ['d:routine', 1, 'From 6 weeks', 'A short bedtime routine, the same every night', 'Four calm steps, 15–20 minutes', 'book'],
      ['d:settle4', 2, '3–5 months', 'Try putting {o} down drowsy, once a day', 'How to practice, if you want to', 'moon'],
      ['settle', 3, 'From 4–6 months', 'Sleep training is a choice, not a must', 'When to start, and the methods', 'idea'],
      ['d:earlybed', 4, '7–8 months', 'Move bedtime earlier, to 7–8 pm', 'Once naps settle', 'clock'],
      ['d:goodbye', 5, '8–12 months', 'Keep bedtime goodbyes short and the same', 'Separation, and bedtime protests', 'heart']] },
    safe: { name: 'Safe sleep', art: 'crib', lead: 'The rules that stay the same, and the steps that change.', items: [
      ['safe', null, 'Every sleep', 'Safe sleep checklist', 'On {p} back, in {p} own bare sleep space', 'shield'],
      ['d:safegrow', null, 'All ages', 'What changes, and when', 'Swaddle, crib, mattress and more, by age', 'stand'],
      ['d:swaddle', 0, 'First weeks', 'Swaddle snug at the arms, loose at the hips', 'How to swaddle, and when to stop', 'swaddle'],
      ['d:rolling', 2, 'Once {s} {roll|rolls}', 'Rolling onto {p} tummy?', 'What to do before and after {s} can roll back', 'roll'],
      ['d:swaddleoff', 2, 'Before rolling', 'Stop swaddling at the first try to roll', 'Arms out, in a sleep sack', 'swaddle'],
      ['d:where', 3, 'First 6 months', 'Share a room until at least 6 months', 'And moving to the crib', 'home'],
      ['d:mattress', 4, 'Before {s} can sit', 'Lower the crib mattress', 'Lowest before {s} {stand|stands}', 'crib']] } };
  // Topic pages, v3 (Yarden's Nov 20 mockup): stage tabs, the stage and topic up top, "At this stage" in two lines, one
  // picture that shows it, this stage's cards on the topic, then the pages that are always useful. Every line comes from
  // what the guide already says (glance numbers, cards, Worth knowing). [bold, line] per stage: newborn, longer nights,
  // three naps, two naps.
  const AT = {
    night: [['Day and night look alike', 'Sleep comes in short pieces around the clock, with feeds in between.'],
      () => m() < 3 ? ['The longest sleep moves to the night', 'Daylight, and dim, quiet nights, help it settle there.'] : ['Waking can come back around 4 months', 'It’s a sign sleep is maturing, not a step backwards.'],
      ['Longer stretches from bedtime', 'Waking at night is still common, and some babies still need a feed.'],
      ['Long nights, with wake-ups now and then', 'A wake-up doesn’t mean the whole night is off track.']],
    naps: [['Naps happen any time', 'There’s no pattern yet. Sleepy cues are your best guide.'],
      () => m() < 3 ? ['Short, frequent naps', 'They’re often short, and that’s fine for now.'] : ['Naps start to find set times', '{S} {get|gets} sleepy at about the same times each day.'],
      ['Three naps, the last one short', 'The late catnap is a bridge to bedtime. It doesn’t need to be a full nap.'],
      ['Two naps, morning and afternoon', 'Most of the day’s sleep now comes in two longer naps.']],
    bed: [['No set bedtime yet', 'Days and nights are still mixed. Dim, quiet nights help set {p} clock.'],
      ['A short routine can start', 'A few calm steps in the same order start to signal bedtime.'],
      ['Bedtime follows the last nap', 'The routine stays the same. The time can move with the day.'],
      ['The same routine, a different evening', 'Missing you can make bedtime goodbyes harder.']],
    safe: [['On {p} back, in a bare sleep space', 'Every sleep, naps too. A swaddle is fine until the first signs of rolling.'],
      ['{S} may start trying to roll', 'That’s when the swaddle comes off. The rest of the rules stay the same.'],
      ['Moving more, same safe space', 'As {s} {roll|rolls} and {sit|sits}, the crib setup changes. The rules don’t.'],
      ['Standing soon, the crib stays bare', 'No pillows, bumpers, toys or blankets until 12 months.']] };
  const ALWAYS = { night: ['d:wakes', 'd:daynight'], naps: ['d:steps0', 'd:shortnap'], bed: ['d:routine'], safe: ['safe', 'd:safegrow', 'd:where'] };
  // Helpful right now: chosen by stage and age, not copied from the main page (Nov 21 review). A = the baby's age on
  // "Right now", or a typical age for another stage's tab. Stages: newborn to 6 weeks, longer nights to 5 months,
  // three naps 5–7 months, two naps from 7.
  const HELP = {
    night: [A => ['d:daynight'], A => A < 3 ? ['d:stretch'] : ['d:regress'], A => A >= 6 ? ['d:wakes', 'd:nightfeeds'] : ['d:wakes'], A => A < 8 ? ['d:nightfeeds'] : ['d:nightwake']],
    naps: [A => ['d:steps0'], A => A < 3 ? ['d:napsearly'] : ['d:predictable'], A => ['d:shortnap', 'd:catnap'], A => A < 8 ? ['d:day:3', 'd:catnap', 'd:shortnap'] : ['d:day:3', 'd:shortnap']],
    bed: [A => ['d:steps0'], A => A < 3 ? ['d:routine'] : ['d:routine', 'd:settle4'], A => ['settle'], A => A < 8 ? ['d:earlybed'] : ['d:goodbye']],
    safe: [A => ['d:swaddle'], A => ['d:swaddleoff', 'd:where'], A => A < 6 ? ['d:where', 'd:mattress', 'd:rolling'] : ['d:mattress', 'd:rolling'], A => ['d:mattress']] };
  const REP_AGE = [0.5, 2, 5.5, 9];
  // Bedtime: how the evening fits together (Yarden's mockup), for the nap stages. Times line up with the naps example day.
  const EVENING = [null, null,
    { steps: [['sun', '4:15–4:45', 'Last catnap'], ['book', '~6:55', 'Wind down'], ['moon', '~7:15', 'Bedtime']], tip: 'If the catnap ends early, bring bedtime forward instead of stretching the last awake time.' },
    { steps: [['sun', '~3:30', 'Last nap ends'], ['book', '~6:40', 'The same steps'], ['moon', '~7:00', 'Bedtime']], tip: 'The bedtime steps stay the same. Only the timing shifts as the last nap changes.' }];
  // One picture per topic and stage. Night: an example night. Naps: an example day. Safe sleep: the bare crib.
  const NIGHT = [
    { segs: [[19.4, 21.8, 'night'], [22.3, 24.8, 'night'], [25.3, 27.8, 'night'], [28.3, 30.8, 'night']], dots: [22.05, 25.05, 28.05], caps: [[20.6, '2–4 hours'], [25.05, 'Feeds between'], [31, 'Morning']] },
    { segs: [[19.5, 24.2, 'night'], [24.7, 27.6, 'night'], [28.1, 30.8, 'night']], dots: [24.45, 27.85], caps: [[21.8, 'Longest stretch'], [24.45, 'A feed'], [31, 'Morning']] },
    { segs: [[19.5, 26.6, 'night'], [27.1, 30.8, 'night']], sparks: [26.85], caps: [[19.5, 'Bedtime'], [26.85, 'A wake-up or feed'], [31, 'Morning']] },
    { segs: [[19.3, 24.8, 'night'], [25.2, 30.8, 'night']], sparks: [25], caps: [[19.3, 'Bedtime'], [25, 'A brief wake-up'], [31, 'Morning']] }];
  const NAPDAY = [
    { segs: [[7.6, 9.4, 'nap'], [10.4, 12.4, 'nap'], [13.4, 15.2, 'nap'], [16.2, 18, 'nap'], [19, 20.5, 'nap']], caps: [[8.5, 'Sleep'], [12.4, 'Awake 45–60 min'], [20.5, 'Day or night']], end: 20.5 },
    { segs: [[8.4, 9.1, 'nap'], [10.4, 11.3, 'nap'], [12.7, 13.5, 'nap'], [15, 15.7, 'nap'], [17, 17.5, 'nap']], dark: [[19.5, 20.5]], moon: [19.5], caps: [[8.75, 'Short naps'], [13.1, '4–5 a day'], [19.5, 'Bedtime']] },
    { segs: [[9, 10.3, 'nap'], [12.5, 13.8, 'nap'], [16.3, 16.8, 'nap']], dark: [[19.25, 20.5]], moon: [19.25], caps: [[9.65, 'Nap'], [13.15, 'Nap'], [16.55, 'Catnap'], [19.25, 'Bedtime']] },
    { segs: [[9.5, 11, 'nap'], [14, 15.5, 'nap']], dark: [[19.25, 20.5]], moon: [19.25], caps: [[10.25, 'Morning nap'], [14.75, 'Afternoon nap'], [19.25, 'Bedtime']] }];
  function topicFig(k, v, A) {
    if (k === 'night') { const o = v === 1 && m() >= 3 ? { segs: [[19.5, 23, 'night'], [23.4, 26, 'night'], [26.4, 28.6, 'night'], [29, 30.8, 'night']], dots: [23.2, 26.2, 28.8], caps: [[21.2, 'Sleep'], [26.2, 'Waking more often'], [31, 'Morning']] } : NIGHT[v]; return `<h2 class="hub-h2">${F('What a night can look like')}</h2><section class="care-tpl-card ssw-card">${band(Object.assign({ label: 'An example night, from bedtime to morning.', start: 19, end: 31, dark: [[19, 31]], gap: 28 }, o))}<p class="ssw-figtip">${F('An example. Every baby’s night looks a little different.')}</p></section>`; }
    if (k === 'naps' && v === 0) return `<h2 class="hub-h2">${F('How a day fits together')}</h2><section class="care-tpl-card ssw-card">${loopFig()}<p class="ssw-figtip">${F('No clock yet. Go by {p} sleepy cues.')}</p></section>`;
    if (k === 'naps') { const o = v === 1 && A >= 3 ? { segs: [[8.6, 9.7, 'nap'], [11.4, 12.6, 'nap'], [14.3, 15.3, 'nap'], [16.9, 17.4, 'nap']], dark: [[19.5, 20.5]], moon: [19.5], caps: [[9.15, 'Naps find set times'], [14.8, '3–4 a day'], [19.5, 'Bedtime']] } : NAPDAY[v], day = v === 2 ? `<button class="hub-card-cta ssw-figlink" onclick="${go('chg:Sleep:d:day:' + v)}">${F('Full example day')} ›</button>` : '';
      return `<h2 class="hub-h2">${F('How a day fits together')}</h2><section class="care-tpl-card ssw-card">${band(Object.assign({ label: 'An example day of naps.', start: 7, end: 20.5, gap: 26 }, o))}<p class="ssw-figtip">${F('An example, not a schedule. Go by {p} sleepy cues.')}</p>${day}</section>`; }
    if (k === 'bed' && EVENING[v]) { const E = EVENING[v];
      return `<h2 class="hub-h2">${F('What the evening can look like')}</h2><section class="care-tpl-card ssw-card"><ol class="ssw-evening">${E.steps.map(([ic, t, l], i) => `<li class="is-${ic}"><i aria-hidden="true">${H().art(ic, 'Sleep')}</i><b>${F(t)}</b><span>${F(l)}</span></li>`).join('')}</ol><p class="ssw-evetip"><i aria-hidden="true">✦</i>${F(E.tip)}</p><p class="ssw-figtip">${F('Example times. Go by {p} sleepy cues.')}</p></section>`; }
    if (k === 'safe') return `<h2 class="hub-h2">${F('A safe sleep space')}</h2>` + pinPhoto('crib.jpg', 'A baby asleep on their back in a sleep sack, arms out, in a bare crib with a fitted sheet', [['On {p} back', 56, 31, 'r'], ['Sleep sack, no blanket', 24, 40, 'b'], ['Bare crib, firm mattress', 80, 76, 'l']], 'ssw-crib');
    return '';
  }
  // What "Right now" lists on the main page for this view, so a topic page doesn't list the same guide again.
  // Mirrors dress(): routine → bedtime topic at three naps, two-naps example day added, room sharing until 6 months.
  function mainRoutes(src, v) {
    try {
      const d = document.createElement('div'); d.innerHTML = src === 'now' ? window.changesPage('Sleep') : baseRoute('chg:Sleep:s:' + src.replace(/^s/, ''));
      let rs = [...d.querySelectorAll('#sleep-night-feeds .hub-row[onclick], .sl-safe-list .hub-row[onclick]')].map(r => (((r.getAttribute('onclick') || '').match(/'chg:Sleep:([^']+)'/) || [])[1] || ''));
      if (v === 2) rs = rs.filter(r => r !== 'd:routine');
      if (v === 3) rs.push('d:day:3');
      if (src === 'now' && m() >= 6) rs = rs.filter(r => r !== 'd:where');
      return rs;
    } catch (e) { return []; }
  }
  function topicPage(p) {
    const [, , , k, src = 'now'] = p.split(':'), T = TOPICS[k]; if (!T) return baseRoute(p);
    const now = src === 'now', cur = stageNow(), v = now ? Math.max(cur, 0) : +src.replace(/^s/, '') || 0, live = (() => { try { return C().live(); } catch (e) { return true; } })();
    const R = H().row, all = Object.values(TOPICS).flatMap(t => t.items), find = r => all.find(x => x[0] === r);
    const row = ([r, , , t, sub, icon]) => R({ cat: 'Sleep', icon: icon || T.art, title: t, sub, onclick: go('chg:Sleep:' + r) });
    const A = now ? m() : REP_AGE[v], onMain = mainRoutes(src, v), help = HELP[k][v](A).filter(r => !onMain.includes(r)), helpful = help.map(find).filter(Boolean), always = ALWAYS[k].filter(r => !help.includes(r) && !(r === 'd:daynight' && v >= 3) && !(r === 'd:routine' && v === 0) && !(r === 'd:steps0' && v >= 3) && !(r === 'd:shortnap' && v === 0)).map(find).filter(Boolean);
    const at = typeof AT[k][v] === 'function' ? AT[k][v]() : AT[k][v];
    const stage = STAGES[v] ? STAGES[v][0] : '';
    const nowCard = `<section class="ssw-aha ssw-at"><i class="ssw-bulb" aria-hidden="true">${H().art(T.art, 'Sleep')}</i><small>${F('At this stage')}</small><b>${F(at[0])}</b><span>${F(at[1])}</span></section>`;
    const list = (h, xs, cls = '') => xs.length ? `<h2 class="hub-h2">${F(h)}</h2><div class="hub-list ${cls}">${xs.map(x => row(x)).join('')}</div>` : '';
    const inner = nowCard + topicFig(k, v, A) + list('Helpful right now', helpful) + list('Always here when you need it', always, 'ssw-always');
    const tabsHtml = `<nav class="ssw-tabs" aria-label="${F('Sleep stages')}">${STAGES.map(([l], i) => `<button class="${i === v ? 'is-on' : ''} ${live && i === cur ? 'is-now' : ''}" onclick="${go('chg:Sleep:t:' + k + ':' + (live && i === cur ? 'now' : 's' + i))}" ${i === v ? 'aria-current="step"' : ''}>${F(l)}</button>`).join('')}</nav>`;
    const html = H().detail('Sleep', stage + (now && live ? ' · Right now' : ''), T.name, '', `<div class="ssw-topic">${inner}</div>`, T.art);
    return html.replace('<div class="hub-detail-head">', tabsHtml + '<div class="hub-detail-head ssw-topic-head">');
  }
  const routes = { 'chg:Sleep:d:routine': routinePage, 'chg:Sleep:d:shortnap': shortNapProb, 'chg:Sleep:d:wakes': nightProb, 'chg:Sleep:d:frequent': nightProb, 'chg:Sleep:d:props': propsProb, 'chg:Sleep:d:yoursleep': yourSleepPage, 'chg:Sleep:d:rough': roughPage, 'chg:Sleep:d:safegrow': safeGrowPage };
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) { const nk = /^chg:Sleep:d:naphelp(?::(\w+))?$/.exec(p || ''); if (nk) return ({ skip: skipProb, late: lateProb, short: shortNapProb }[nk[1]] || fightProb)(); const hk = /^chg:Sleep:d:hiccup:(\w+)$/.exec(p || ''); if (hk) return hiccupPage(hk[1]); return routes[p] ? routes[p]() : /^chg:Sleep:t:/.test(p) ? topicPage(p) : baseRoute.apply(this, arguments); };

  /* ---------- pages dressed after they draw ---------- */
  const PAGES = {
    // Sleepy cues: three states side by side, so parents see the window to aim for.
    'chg:Sleep:d:steps0': () => {
      top(card('Alert, sleepy or overtired?', photoRows([
        ['alert.jpg', 'A wide-awake newborn with bright, open eyes', 'Alert', 'Bright eyes, looking around. Time to feed and play', 'Awake', 'is-day'],
        ['yawn.jpg', 'A newborn yawning', 'Getting sleepy', 'A faraway stare, slower moves, rubbing eyes, yawning. Start winding down now', 'Aim for this', 'is-go'],
        ['overtired.jpg', 'A newborn crying hard in a parent’s arms', 'Overtired?', 'Fussing, arching and hard to calm, after a long time awake. Soothe first, then down', 'May be overtired', 'is-late']
      ]) + notes([['', 'Look for a few signs together', 'One yawn or one cry on its own can mean lots of things']]), 'ssw-cues'));
      const s1 = $$('.hub-iconstep small')[0]; if (s1) s1.textContent = F('At the first one you see');
      $$('.hub-row b').forEach(b => { if (/^Overtired looks like/.test(b.textContent)) b.closest('.hub-row').remove(); });
    },
    // Stop swaddling: the same crib, before and after.
    'chg:Sleep:d:swaddleoff': () => {
      const [h, body] = sec('How it changes'); if (!h) return;
      const fig = body.querySelector('.hub-strip-row'); if (fig) fig.outerHTML = pair(
        ['swaddle-before.jpg', 'A newborn asleep on their back, swaddled with arms in', 'Before rolling', 'Swaddled, arms in, hips loose', 'is-before'],
        ['swaddle-after.jpg', 'The same baby in a sleeveless sleep sack, arms out', 'First try to roll', 'Sleep sack, arms free to push up', 'is-after']);
      h.textContent = F('Swaddle, then sleep sack');
    },
    // Where she sleeps: a labeled room, then the bassinet-to-crib switch.
    'chg:Sleep:d:where': () => {
      const mo = m();
      const [nh, nb] = sec('What’s normal'); if (nh && nb && nb.querySelector('.hub-windowbar, .hub-window, [class*=window]')) { nh.remove(); nb.remove(); }
      const keepNote = mo >= 4 ? notes([['', 'No rush after 6 months', 'Plenty of families room-share longer']]) : '';
      top(`<section class="ssw-photo-only">${pinPhoto('room.jpg', 'A parents’ bedroom at night with a bare crib right beside the bed and a dim lamp', [['Own crib, nothing in it', 80, 45, 'l'], ['Right by your bed', 53, 72, 'l']])}</section>`
        + (mo < 9 ? `<h2 class="hub-h2">${F('Moving to the crib')}</h2><section class="ssw-move"><span class="ssw-move-ic">${H().art('crib', 'Sleep')}</span><span><b>${F('At the first try to roll, or the bassinet’s limit')}</b><small>${F('Whichever comes first. Limits differ by model, so check the label.')}</small></span></section>` : '') + keepNote);
    },
    // Safe sleep: a labeled crib, then a quick yes/skip check (Yarden's mockup).
    'chg:Sleep:safe': () => {
      const fig = $('.hub-detail > figure.hub-figure.is-wide, figure.hub-figure.is-wide'), tiles = $('.hub-ess3'); if (!fig) return;
      fig.outerHTML = pinPhoto('crib.jpg', 'A baby asleep on their back in a sleep sack, arms out, in a bare crib with a fitted sheet', [['On {p} back', 56, 31, 'r'], ['Sleep sack, no blanket', 24, 40, 'b'], ['Bare crib, firm mattress', 80, 76, 'l']], 'ssw-crib');
      const [sh, sb] = sec('Setting up the crib'); if (sh) { sb.remove(); sh.remove(); }
      const check = (t, sub) => `<li><i aria-hidden="true">✓</i><span><b>${F(t)}</b><small>${F(sub)}</small></span></li>`;
      if (tiles) tiles.outerHTML = card('Check every sleep', `<ul class="ssw-checks">${check('On {p} back', 'For naps and night sleep')}${check('Own sleep space', 'Crib, bassinet or play yard. Not a sofa, bed, swing or car seat')}${check('Nothing else in the crib', 'A firm, flat mattress and a fitted sheet. No pillows, blankets, bumpers or toys')}</ul>`
        + notes([['', 'A cool, smoke-free room', 'A too-warm room is less safe. Use a sleep sack, not a blanket'], ['', 'A swaddle or a sleep sack', 'No swaddle once rolling starts'], ['', 'A pacifier, if you like', 'Once feeding is going well']]), 'ssw-check');
      const acc = $('.hub-accs'); if (acc) acc.outerHTML = card('As ' + nm() + ' grows', `<button class="hub-row" onclick="${go('chg:Sleep:d:safegrow')}"><span class="hub-row-copy"><b>${F('What changes, and when')}</b><small>${F('Swaddle, crib, mattress and more, by age')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`, 'ssw-rowcard');
    }
  };
  // Rough day or night: the two helpers lead, because they answer what parents ask most (Yarden, Nov 21).
  // How to swaddle: a photo for each step.
  PAGES['chg:Sleep:d:swaddle'] = () => {
    // Nov 21: the whole story, in the AAP's order (healthychildren.org, Swaddling: Is it Safe?). Five steps; the last is the check.
    const panels = $('.hub-fig-panels'); if (!panels) return;
    const S = [['swaddle-1.jpg', 'A swaddle blanket laid flat as a diamond with the top corner folded down', 'Lay the blanket as a diamond', 'Fold the top corner down'],
      ['swaddle-lay.jpg', 'A newborn on their back on the blanket, shoulders just below the fold', 'Baby on {p} back', 'Shoulders just below the fold'],
      ['swaddle-side.jpg', 'A newborn with one side of the blanket wrapped across the chest and tucked under', 'One side across first', 'Arm straight, tucked under {p} other side'],
      ['swaddle-3.jpg', 'A newborn fully swaddled, snug at the chest and loose at the hips', 'Other side across, bottom loose', 'Arm down, wrap and tuck. Fold the bottom up loosely']];
    const rows = S.map(([img, alt, t, sub], i) => `<li><span class="ssw-ph"><img src="${IMG + (PHOTO_OF[img] || img)}" alt="${F(alt)}" loading="lazy"></span><span class="ssw-copy"><i>${i + 1}</i><b>${F(t)}</b><small>${F(sub)}</small></span></li>`).join('')
      + `<li class="is-check"><span class="ssw-ph ssw-ph-check" aria-hidden="true">✓</span><span class="ssw-copy"><i>5</i><b>${F('Check the fit')}</b><small>${F('Room for two fingers at the chest. Legs free to bend up and out, like a frog.')}</small></span></li>`;
    const fig = panels.closest('figure');
    fig.outerHTML = `<section class="care-tpl-card ssw-photosteps is-square"><ol>${rows}</ol></section>`;
  };
  // Newborn and early naps: the loop instead of three separate tiles.
  PAGES['chg:Sleep:d:napsearly'] = () => {
    const [h, body] = sec('What’s normal'); if (!h || !body) return;
    const steps = body.querySelector('.hub-iconsteps-row'); if (steps) { steps.outerHTML = loopFig(); h.textContent = F('Feed, awake, sleep, repeat'); }
  };
  // Night waking from 8 months: the same decision path as the earlier night waking page.
  // Rolling: you place, she rolls.
  PAGES['chg:Sleep:d:rolling'] = () => {
    const [h, body] = sec('What’s normal'); if (!h) return;
    h.textContent = F('You place, {s} {roll|rolls}');
    const keep = body.querySelector('.tpl-notes'); body.innerHTML = pair(
      ['back.jpg', 'A baby asleep on their back in a sleep sack in a bare crib', '1 · You place {o}', 'Always on {p} back, every sleep', 'is-before'],
      ['tummy.jpg', 'A baby asleep on their tummy in a sleep sack in a bare crib', '2 · {S} {roll|rolls} over', 'Can roll both ways? Let {o} stay', 'is-after']).replace('<div class="ssw-pair">', '<div class="ssw-pair has-arrow">')
      + (keep ? keep.outerHTML : '');
    body.classList.add('care-tpl-card', 'ssw-card');
  };

  // Three naps to two (and two to one): the two sample days, one above the other.
  const days = (a, b) => `<div class="ssw-days">${band(a)}${band(b)}</div>`;
  const DAYS = {
    'chg:Sleep:d:catnap': () => days(
      { title: 'Example: three naps', label: 'An example day with three naps.', start: 7, end: 20.5, dark: [[19.25, 20.5]], segs: [[9, 10.3, 'nap'], [12.5, 13.8, 'nap'], [16.3, 16.8, 'nap']], moon: [19.25], caps: [[9.65, 'Nap'], [13.15, 'Nap'], [16.55, 'Catnap'], [19.25, 'Bedtime']] },
      { title: 'Example: two naps', label: 'An example day with two naps and an earlier bedtime.', start: 7, end: 20.5, dark: [[18.75, 20.5]], segs: [[9.5, 11, 'nap'], [14, 15.5, 'nap']], ghost: [[16.3, 16.8]], moon: [18.75], caps: [[10.25, 'Morning nap'], [14.75, 'Afternoon nap'], [18.75, 'Earlier bedtime']] }),
    'chg:Sleep:d:after': () => days(
      { title: 'Example: two naps', label: 'An example day with two naps.', start: 7, end: 20.5, dark: [[19.25, 20.5]], segs: [[9.5, 11, 'nap'], [14, 15.5, 'nap']], moon: [19.25], caps: [[10.25, 'Morning nap'], [14.75, 'Afternoon nap'], [19.25, 'Bedtime']] },
      { title: 'Example: one nap', label: 'An example day with one longer nap and an earlier bedtime.', start: 7, end: 20.5, dark: [[18.75, 20.5]], segs: [[12, 14.5, 'nap']], moon: [18.75], caps: [[13.25, 'One longer nap'], [18.75, 'Earlier bedtime']] })
  };

  // Every Sleep page opens with the app's header card: a white tile with one line icon, like Feeding, Safety and Childcare.
  const HEAD_ICON = [[/challenge|keeping|rough|hiccup/i, 'heart'], [/swaddl/i, 'swaddle'], [/mattress|crib|safe sleep|rolling/i, 'crib'], [/room|share/i, 'home'],
    [/training|method|fading|cry it out|check-in|pick up/i, 'clock'], [/goodbye/i, 'wave'], [/away|travel|time zone/i, 'plane'], [/your own sleep|yourself/i, 'heart'],
    [/crying|calm/i, 'heart'], [/example day|day with|two naps become|\bnaps?\b/i, 'sun'], [/bedtime|routine|drowsy|settle/i, 'book'], [/night|regression|wak/i, 'moon'], [/./, 'moon']];
  // Every Sleep guide page opens like the mockups: a plain header (eyebrow, question, one-line answer), no header card.
  function headIcon(main) {
    const head = main.querySelector('.hub-detail[data-overview="Sleep"] .hub-detail-head'); if (!head || head.dataset.sswIcon) return;
    if (head.closest('.hub-detail').querySelector('.ssw-hero')) return;
    head.classList.add('sv2-head'); head.classList.remove('ssw-plainhead'); head.dataset.sswIcon = '1';
    const pageEl = head.closest('.hub-detail'); if (pageEl) pageEl.classList.add('sv2-page');
  }

  function dress() {
    const main = document.querySelector('#main'); if (!main || main.querySelector('.sv2')) return;
    try { headIcon(main); } catch (e) { console.error(e); }
    const pg = (() => { try { return (0, eval)('page'); } catch (e) { return ''; } })();
    if (!/^(topic:Sleep|chg:Sleep)/.test(pg || '')) return;

    // Sleep's main page: the card sizes to its content, the drawing shows the stage, You might notice sits under it.
    const hero = main.querySelector('.hub-hero.sl-disc');
    if (once(hero, 'h')) {
      hero.classList.add('ssw-hero');
      const t = (hero.querySelector('h1') || {}).textContent || '', art = hero.querySelector('.sl-art'), aha = hero.querySelector('.sl-aha');
      // Nov 21: no timeline up top. The glance has the numbers and the Naps page has the day picture (one home each).
      if (art) art.remove();
      // Worth knowing: what she might notice plus the one thing to try, in one card inside the top card (Yarden's mockup).
      if (aha) {
        aha.classList.add('ssw-aha'); const lbl = aha.querySelector('small'); if (lbl) lbl.textContent = F('Worth knowing');
        const tryEl = (hero.nextElementSibling && hero.nextElementSibling.classList.contains('sl-try')) ? hero.nextElementSibling : main.querySelector('.sl-try');
        const tip = tryEl && tryEl.querySelector('p'), sp = aha.querySelector('span');
        // Nov 21: the main app's own stage copy (newer than ours), with its one thing to try as a "Try this" line.
        if (tip) { aha.querySelectorAll('b, span').forEach(e => e.remove()); aha.insertAdjacentHTML('beforeend', `<p class="ssw-try-line"><strong>${F('Try this:')}</strong> ${tip.innerHTML}</p>`); aha.classList.add('ssw-try-only'); }
        if (tryEl) tryEl.remove();
      }
      const eb = hero.querySelector('.hub-eyebrow'), ebt = eb ? eb.firstChild.textContent : '', view = STAGES.findIndex(([, re]) => re.test(ebt));
      if (view >= 0) {
        hero.dataset.sswView = view; // tabs are added by ensureTabs, after every other script has drawn
        // v4 (Nov 21, learning from Feeding, Safety and Development): a wide photo of this stage's real moment under the
        // words, with labels only where they teach something, then the one tip.
        const HP = HERO_PIC.find(([re]) => re.test(t));
        if (HP && !hero.querySelector('.ssw-hero-photo')) {
          const ld = hero.querySelector('.hub-lead') || hero.querySelector('h1');
          ld.insertAdjacentHTML('afterend', pinPhoto(HP[1], HP[2], HP[3], 'ssw-hero-photo'));
          hero.classList.add('ssw-v4');
        }
        const ah = hero.querySelector('.ssw-aha'); if (ah) { ah.classList.add('ssw-tip'); hero.append(ah); const lb = ah.querySelector('small'); if (lb) lb.remove(); ah.insertAdjacentHTML('afterbegin', `<i class="ssw-bulb" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"/></svg></i>`); }
      }
    }
    // Four topic tiles (Yarden's inspiration, Nov 20 rework): steady doors to Night sleep, Naps, Bedtime and Safe sleep that
    // mean the same thing at every age. This stage's own cards stay in plain words in "Right now" above them, so what's new is
    // visible without tapping.
    const glanceEl = main.querySelector('.sl-glance');
    if (glanceEl) glanceEl.querySelectorAll('.sl-gl small').forEach(e => { if (e.textContent.trim() === 'Awake') e.textContent = F('Wake window'); });
    // Nov 22 (Yarden's "Her day in three naps" mockup): the glance becomes a picture of her day, sun to moon, with a photo for
    // each sleep and how long it lasts; the three numbers sit underneath with icons. Then "See how it all works together".
    if (glanceEl && hero && !glanceEl.querySelector('.ssw-dc')) {
      const v = +(hero.dataset.sswView || 0), live = /^topic:Sleep|^chg:Sleep$/.test(pg), A = live ? m() : REP_AGE[v];
      const DAY = [
        { h: '{P} day, around the clock', sub: 'Feed, a little awake time, then sleep. Day and night alike.', loop: true, tiles: [[nursing() ? 'feed-nurse.jpg' : 'feed.jpg', 'Feed', 'Every 2–3 hours'], ['alert.jpg', 'Awake', '45–60 min'], ['hero-0.jpg', 'Sleep', 'Then again']] },
        A < 3 ? { h: '{P} day: lots of short naps', sub: '4–5 naps a day, often short. Any time is fine.', tiles: [['bassinetnap.jpg', 'Nap', 'Often short'], ['back.jpg', 'Nap', 'Often short'], ['night.jpg', 'Nap', 'Often short']], more: '+1–2' }
          : { h: '{P} day: naps find their times', sub: '3–4 naps, starting to land at similar times.', tiles: [['bassinetnap.jpg', 'Nap 1', '1–2 h'], ['back.jpg', 'Nap 2', '1–2 h'], ['night.jpg', 'Nap 3', 'Shorter']], more: '+1' },
        { h: '{P} day in three naps', sub: 'Two longer naps, and a short catnap to get {o} to bedtime.', tiles: [['nap.jpg', 'Nap 1', 'About 1–1½ h'], ['back.jpg', 'Nap 2', 'About 1–1½ h'], ['bassinetnap.jpg', 'Catnap', 'About 30–45 min']] },
        { h: '{P} day in two naps', sub: 'A morning and an afternoon nap, with longer awake time before bed.', tiles: [['nap10.jpg', 'Morning nap', 'About 1–1½ h'], ['nap.jpg', 'Afternoon nap', 'About 1–1½ h']] }][v];
      const hd = main.querySelector('.sl-gl-h'); if (hd) { hd.textContent = F(DAY.h); const row = hd.parentElement; if (row && !row.nextElementSibling?.classList?.contains('ssw-dc-sub')) row.insertAdjacentHTML('afterend', `<p class="ssw-dc-sub">${F(DAY.sub)}</p>`); }
      const tiles = DAY.tiles.map(([img, l, d]) => `<figure><span class="ssw-dc-pic"><img src="${IMG + img}" alt="" loading="lazy"><em>${F(l)}</em></span><figcaption>${F(d)}</figcaption></figure>`).join(DAY.loop ? '<i class="ssw-dc-arrow" aria-hidden="true">→</i>' : '<i class="ssw-dc-awake" aria-hidden="true"></i>')
        + (DAY.more ? `<i class="ssw-dc-awake" aria-hidden="true"></i><span class="ssw-dc-more">${F(DAY.more)}</span>` : '') + (DAY.loop ? '<i class="ssw-dc-arrow" aria-hidden="true">↻</i>' : '');
      const ICON = ['crib', 'clock', 'moon'];
      const stats = [...glanceEl.querySelectorAll('.sl-gl > div')].map((d, i) => `<div><i aria-hidden="true">${H().art(ICON[i] || 'moon', 'Sleep')}</i><span><b>${(d.querySelector('b') || {}).innerHTML || ''}</b><small>${F(((d.querySelector('small') || {}).textContent || '').toLowerCase())}</small></span></div>`).join('');
      const gl = glanceEl.querySelector('.sl-gl'); if (gl) gl.remove();
      glanceEl.insertAdjacentHTML('afterbegin', `<div class="ssw-dc"><div class="ssw-dc-sky${DAY.loop ? ' is-loop' : ''}"><i class="ssw-dc-sun" aria-hidden="true">${H().art('sun', 'Sleep')}</i><div class="ssw-dc-row">${tiles}</div><i class="ssw-dc-moon" aria-hidden="true">${H().art('moon', 'Sleep')}</i></div><div class="ssw-dc-stats">${stats}</div></div>`);
      glanceEl.classList.add('ssw-dc-card');
      // See how it all works together (nap stages): one short nap shifts the rest of the day.
      if (v >= 2 && !main.querySelector('.ssw-works')) glanceEl.insertAdjacentHTML('afterend', `<h2 class="hub-h2">${F('How it fits together')}</h2><button class="ssw-works" onclick="${go('chg:Sleep:d:shortnap')}"><span class="ssw-works-pic"><img src="${IMG + (v === 2 ? 'mattress.jpg' : 'standing.jpg')}" alt="" loading="lazy"><em>${F('If a nap is shorter')}</em></span><span class="ssw-works-r"><em>${F('Then the rest of the day shifts')}</em><span class="ssw-works-strip"><i></i><b></b><i></i><b></b><i class="is-short"></i><b class="is-moved"></b><i></i></span><small>${F('Move the next nap earlier, or plan for an earlier bedtime.')}</small></span></button>`);
    }
    if (hero && hero.__sswBand && glanceEl && !glanceEl.querySelector('.ssw-glance-band')) glanceEl.insertAdjacentElement('afterbegin', hero.__sswBand);
    // v4 "Right now for <name>" (Development's pattern): four photo tiles, each a topic plus this stage's guide, opening the
    // guide directly. A safety step that's due takes the Safe sleep tile until it's done. Other guides for this stage stay as
    // rows under the tiles; everything else is in "All sleep guides".
    const rl = main.querySelector('#sleep-night-feeds');
    if (hero && rl && !main.querySelector('.ssw-now-tiles')) {
      const view = +(hero.dataset.sswView || 0), live = /^topic:Sleep|^chg:Sleep$/.test(pg), A = live ? m() : REP_AGE[view];
      const routeOf = r => (((r.getAttribute('onclick') || '').match(/'chg:Sleep:([^']+)'/) || [])[1] || '');
      const sl = main.querySelector('.sl-safe-list'), due = sl ? [...sl.querySelectorAll('.hub-row[onclick]')].map(routeOf)[0] : null;
      // Introduce, build, retire (content standard): each guide is featured once, in the stage where it's new. A topic
      // with nothing new at a stage has no tile there, so no stage repeats another.
      const PLAN = [
        () => [['night', 'd:daynight'], ['naps', 'd:steps0'], ['safe', 'd:swaddle'], ['safe', 'd:where']],
        () => A < 3 ? [['night', 'd:stretch'], ['naps', 'd:napsearly'], ['bed', 'd:routine']] : [['night', 'd:regress'], ['naps', 'd:predictable'], ['bed', 'd:settle4'], ['safe', 'd:swaddleoff']],
        () => [['night', 'd:wakes'], ['bed', 'settle'], ['safe', A < 6 ? 'd:rolling' : 'd:mattress']],
        () => A < 8 ? [['night', 'd:nightfeeds'], ['naps', 'd:catnap'], ['bed', 'd:earlybed']] : [['night', 'd:nightwake'], ['bed', 'd:goodbye']]];
      const SHORT = { 'd:daynight': 'Days and nights', 'd:stretch': 'Longer stretches at night', 'd:regress': 'The 4-month sleep regression', 'd:wakes': 'Waking often at night', 'd:nightfeeds': 'Dropping night feeds', 'd:nightwake': 'Night waking comes back',
        'd:steps0': 'Spot the yawn, then soothe', 'd:napsearly': 'Short naps are normal', 'd:predictable': 'Finding nap times', 'd:shortnap': 'A short nap changes the day', 'd:catnap': 'Three naps to two', 'd:day:3': 'A day with two naps',
        'd:routine': 'A short bedtime routine', 'd:settle4': 'Down drowsy, once a day', 'settle': 'Sleep training, if you want', 'd:earlybed': 'An earlier bedtime', 'd:goodbye': 'Short, steady goodbyes',
        'd:swaddle': 'How to swaddle', 'd:where': 'Share a room', 'd:swaddleoff': 'Stop swaddling', 'd:rolling': 'Rolling in {p} sleep', 'd:mattress': 'Lower the mattress' };
      const SUB = { 'd:daynight': 'Help {p} body clock set', 'd:steps0': 'Before {s} gets overtired', 'd:swaddle': 'Snug arms, loose hips', 'd:where': '{P} own sleep space, near you',
        'd:stretch': 'What helps them come', 'd:napsearly': '30–45 minutes is common now', 'd:routine': 'Same steps, same order', 'd:regress': 'Why {s}’s waking more',
        'd:predictable': 'Naps start to settle', 'd:settle4': 'Practice falling asleep', 'd:swaddleoff': 'At the first try to roll', 'd:wakes': 'What to do when {s} stirs',
        'settle': 'Five ways, side by side', 'd:rolling': 'When to let {o} be', 'd:mattress': 'Before {s} sits or pulls up', 'd:nightfeeds': 'When and how',
        'd:catnap': 'Signs {s}’s ready', 'd:earlybed': 'Why it often helps', 'd:nightwake': 'New skills, a short phase', 'd:goodbye': 'Easier at bedtime too' };
      const PIC = { 'd:daynight': 'nightfeed.jpg', 'd:stretch': 'night.jpg', 'd:regress': 'tummy.jpg', 'd:wakes': 'night.jpg', 'd:nightfeeds': nursing() ? 'feed-nurse.jpg' : 'feed.jpg', 'd:nightwake': 'nightwake.jpg',
        'd:napsearly': 'bassinetnap.jpg', 'd:predictable': 'nap.jpg', 'd:shortnap': 'nap.jpg', 'd:catnap': 'nap10.jpg',
        'd:steps0': 'yawn.jpg', 'd:routine': 'pajamas.jpg', 'd:settle4': 'down.jpg', 'settle': 'goodbye.jpg', 'd:earlybed': 'book.jpg', 'd:goodbye': 'goodbye.jpg',
        'd:swaddle': 'swaddle-3.jpg', 'd:swaddleoff': 'swaddle-after.jpg', 'd:where': 'room.jpg', 'd:mattress': 'mattress.jpg', 'd:rolling': 'tummy.jpg' };
      const all = Object.values(TOPICS).flatMap(t => t.items), find = r => all.find(x => x[0] === r);
      const hpEl = hero.querySelector('.ssw-hero-photo img'), heroPic = hpEl ? hpEl.getAttribute('src') : '';
      const used = [];
      const tiles = PLAN[view]().map(([k, r]) => { const T = TOPICS[k]; used.push(r);
        const it = find(r) || [r, null, '', ((sl && sl.querySelector('.hub-row b')) || {}).textContent || '', ''];
        let pic = PIC[r] || 'crib.jpg'; if (heroPic.endsWith(pic)) pic = { 'room.jpg': 'crib.jpg', 'night.jpg': 'back.jpg', 'nightfeed.jpg': 'feed.jpg' }[pic] || 'crib.jpg';
        return `<button class="ssw-nt is-${k}" onclick="${go('chg:Sleep:' + r)}"><span class="ssw-nt-pic"><img src="${IMG + pic}" alt="" loading="lazy"></span><span class="ssw-nt-copy"><em><i aria-hidden="true">${H().art(T.art, 'Sleep')}</i>${F(T.name)}</em><b>${F(SHORT[r] || it[3])}</b></span><span class="ssw-nt-go" aria-hidden="true">›</span></button>`;
      }).join('');
      // Rows left over: guides for this stage that no tile opens. The routine is a reference from three naps on, and room
      // sharing shows until 6 months (Nov 21 review); both stay in All sleep guides.
      // The only carry-over: a safety step from an earlier stage that isn't done yet, as one catch-up row (Safety's pattern).
      // It leaves once the parent marks it, and never takes a tile.
      rl.querySelectorAll('.hub-row').forEach(r => r.remove());
      if (sl) { const dr = sl.querySelector('.hub-row'); if (due && !used.includes(due) && dr) { const b = dr.querySelector('.hub-row-copy b'), sm = dr.querySelector('.hub-row-copy small'); rl.append(dr); } sl.remove(); }
      if (used.some(r => /^d:day:/.test(r))) main.querySelectorAll('.sl-glance [onclick*="chg:Sleep:d:day:"], .sl-gl-h [onclick*="chg:Sleep:d:day:"]').forEach(e => e.remove());
      const n = (tiles.match(/class="ssw-nt /g) || []).length;
      rl.insertAdjacentHTML('beforebegin', `<div class="ssw-now-tiles${n % 2 ? ' is-odd' : ''}">${tiles}</div>`);
      // A safety step still to do is one more tile, with its tag, so Right now stays one grid.
      const grid = main.querySelector('.ssw-now-tiles');
      rl.querySelectorAll('.hub-row').forEach(row => { const r = routeOf(row), b = row.querySelector('.hub-row-copy b'), chip = row.querySelector('.hub-chip');
        grid.insertAdjacentHTML('beforeend', `<button class="ssw-nt is-safe" onclick="${go('chg:Sleep:' + r)}"><span class="ssw-nt-pic"><img src="${IMG + (PIC[r] || 'crib.jpg')}" alt="" loading="lazy"></span><span class="ssw-nt-copy"><em><i aria-hidden="true">${H().art(TOPICS.safe.art, 'Sleep')}</i>${F(TOPICS.safe.name)}</em><b>${F(SHORT[r] || (b ? b.textContent : ''))}</b>${chip ? chip.outerHTML : ''}</span><span class="ssw-nt-go" aria-hidden="true">›</span></button>`); });
      grid.classList.toggle('is-odd', grid.querySelectorAll('.ssw-nt').length % 2 === 1);
      rl.remove();
    }
    const rc = main.querySelector('.hub-rough-card small, [onclick*="chg:Sleep:d:rough"] small');
    if (rc) rc.textContent = F(m() >= 3 ? 'Waking often, fighting naps, only sleeping on you' : 'Waking often, crying, only sleeping on you');
    // Rough day: short naps and night waking open their own pages.
    const rough = main.querySelector('.hub-rough');
    if (once(rough, 'r')) {
      const mo = m();
      rough.querySelectorAll('details.hub-rough-item').forEach(d => {
        const t = ((d.querySelector('summary b') || {}).textContent || '').trim();
        const to = t === 'Short naps' && mo >= 3 ? ['shortnap', 'See how a short nap shifts the day'] : t === 'Waking a lot at night' && mo >= 3 && mo < 8 ? ['wakes', 'What to do when she wakes'] : null;
        if (!to || d.querySelector('.ssw-rough-more')) return;
        d.insertAdjacentHTML('beforeend', `<button class="hub-card-cta ssw-rough-more" onclick="${go('chg:Sleep:d:' + to[0])}">${F(to[1].replace('she', '{s}'))} ›</button>`);
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

  // Nov 22 (Yarden): the stage page as simple as the mockup, read top to bottom. Stage pills; the day as the headline;
  // one card for the day; one card for how it fits together; then at most three quiet rows (what's new now, a safety step
  // if one is due, and rough days). No header photo, no tip, no photo list, no Next card.
  // Nov 22 (Yarden's direction 2): each stage's top card shows what changes at that stage, as a picture; then three
  // photo rows (topic, then the guide), rough days, and what's next.
  function simplify() {
    const main = document.querySelector('#main'); if (!main) return;
    const hero = main.querySelector('.ssw-hero'); if (!hero || hero.dataset.simple) return;
    if (!main.querySelector('.ssw-dc') && !main.querySelector('.ssw-now-tiles')) return;
    const v = +(hero.dataset.sswView || 0), pg = (() => { try { return (0, eval)('page'); } catch (e) { return ''; } })();
    const A = /^topic:Sleep|^chg:Sleep$/.test(pg) ? m() : REP_AGE[v];
    hero.dataset.simple = '1'; hero.classList.add('ssv-hero');
    const art = n => H().art(n, 'Sleep');
    const nurse = nursing();
    const S = [
      { h: '{P} day, around the clock', lead: 'Feed, a little awake time, then sleep. Day and night look similar for now.', pic: nurse ? 'feed-nurse.jpg' : 'feed.jpg' },
      { h: '{P} sleep is growing more steady', lead: 'Around 4 months, sleep starts to come in longer stretches.', pic: 'back.jpg' },
      { h: '{P} day in three naps', lead: 'Two longer naps, and a short catnap to get {o} to bedtime.', pic: 'nap.jpg', day: 'd:day:2' },
      { h: '{P} day in two naps', lead: 'A morning and an afternoon nap, with longer awake time before bed.', pic: 'standing.jpg', day: 'd:day:3' }][v];
    const h1 = hero.querySelector('h1'), lead = hero.querySelector('.hub-lead');
    if (h1) h1.textContent = F(S.h); if (lead) lead.textContent = F(S.lead);
    hero.querySelectorAll('.ssw-hero-photo, .ssw-tip, .sl-aha, figure, .ssw-dc').forEach(e => e.remove());
    const chips = (names, durs) => `<div class="ssv-naps is-${names.length}">${names.map((n, i) => `<div><em>${F(n)}</em><span>${F(durs[i])}</span></div>`).join('')}</div>`;
    const stats = list => `<div class="ssv-stats">${list.map(([ic, b, sm]) => `<div><i aria-hidden="true">${art(ic)}</i><b>${F(b)}</b><small>${F(sm)}</small></div>`).join('')}</div>`;
    const arc = `<svg class="ssv-arc" viewBox="0 0 300 70" aria-hidden="true"><path d="M30 58 Q150 -10 270 58" fill="none" stroke="#e7a93a" stroke-width="2" stroke-dasharray="6 7" opacity=".7"/></svg><i class="ssv-sun" aria-hidden="true">${art('sun')}</i><i class="ssv-moon" aria-hidden="true">${art('moon')}</i>`;
    const VIS = [
      () => `<figure class="ssv-photo is-loop"><img src="${IMG + S.pic}" alt=""><div class="ssv-loop">${[['drop', 'Feed', 'Every', '2–3 hrs'], ['eye', 'Awake', '', '45–60 min'], ['crib', 'Sleep', 'About', '2–4 hrs']].map(([ic, t, a, b]) => `<span><i aria-hidden="true">${art(ic)}</i><b>${F(t)}</b><small>${a ? F(a) + '<br>' : ''}<span class="nw">${F(b)}</span></small></span>`).join('<u aria-hidden="true">→</u>')}</div></figure>`,
      () => `<figure class="ssv-photo is-compare"><img src="${IMG + S.pic}" alt=""><div class="ssv-compare"><div><i aria-hidden="true">${art('moon')}</i><span><b>${F('Earlier')}</b><small>${F('Up every 2–3 hrs')}</small></span><span class="ssv-bars"><s></s><s></s><s></s></span></div><div class="is-now"><i aria-hidden="true">${art('moon')}</i><span><b>${F('Now')}</b><small>${F('A longer first stretch, often 4–6 hrs')}</small></span><span class="ssv-bars"><s></s></span></div></div></figure>`,
      () => `<figure class="ssv-photo is-naps"><img src="${IMG + S.pic}" alt=""></figure>${chips(['Nap 1', 'Nap 2', 'Catnap'], ['About 1–1½ h', 'About 1–1½ h', 'About 30–45 min'])}${stats([['crib', '3', 'naps'], ['clock', '2–2½ hrs', 'awake window'], ['moon', '6–8 hrs', 'longest sleep']])}`,
      () => `<figure class="ssv-photo is-naps is-arc"><img src="${IMG + S.pic}" alt="">${arc}</figure>${chips(['Morning nap', 'Afternoon nap'], ['About 1–1½ h', 'About 1–1½ h'])}${stats([['crib', '2', 'naps'], ['clock', '2½–4 hrs', 'awake window'], ['moon', '10–12 hrs', 'longest sleep']])}`][v];
    hero.insertAdjacentHTML('beforeend', `<div class="ssv-vis"${S.day ? ` role="button" onclick="${go('chg:Sleep:' + S.day)}"` : ''}>${VIS()}</div>`);
    // Her day card and its heading now live in the top card.
    const gh = main.querySelector('.sl-gl-h'); if (gh) (gh.parentElement && gh.parentElement !== main ? gh.parentElement : gh).remove();
    main.querySelectorAll('.ssw-dc-sub, .sl-glance, .ssw-dc-card').forEach(e => e.remove());
    // See how it all works together: a short nap at three naps; three naps becoming two at two naps.
    const works = main.querySelector('.ssw-works');
    // After the first birthday the Next row already points to two naps becoming one, so the three-to-two card goes.
    if (works && v === 3 && A >= 12) works.previousElementSibling && works.previousElementSibling.matches('.hub-h2') && works.previousElementSibling.remove(), works.remove();
    else if (works && v === 3) works.outerHTML = `<button class="ssw-works ssv-shift" onclick="${go('chg:Sleep:d:catnap')}"><span class="ssv-shift-l"><em>${F('From three naps')}</em><em>${F('to two naps')}</em></span><span class="ssv-shift-r"><span class="ssv-shift-row"><b></b><b></b><b class="is-gone"></b></span><span class="ssv-shift-arrow" aria-hidden="true">↓</span><span class="ssv-shift-row"><b></b><b class="is-long"></b></span><small>${F('The afternoon nap gets longer as the third one fades.')}</small></span></button>`;
    // Right now: three rows, the topic first, then the guide (Feeding's photo rows).
    const ROWS = [
      [['Naps', 'd:steps0', 'Spot the yawn, then soothe', 'yawn.jpg'], ['Safe sleep', 'd:swaddle', 'How to swaddle', 'swaddle-3.jpg'], ['Sleep space', 'd:where', 'Set up a safe, cozy spot', 'room.jpg']],
      A < 3 ? [['Night sleep', 'd:stretch', 'Longer stretches at night', 'night.jpg'], ['Naps', 'd:napsearly', 'Short naps are normal', 'bassinetnap.jpg'], ['Bedtime', 'd:routine', 'A short bedtime routine', 'pajamas.jpg']]
        : [['Night sleep', 'd:regress', 'The 4-month sleep regression', 'night.jpg'], ['Bedtime', 'd:settle4', 'Down drowsy, once a day', 'down.jpg'], ['Safe sleep', 'd:swaddleoff', 'Stop swaddling', 'swaddle-after.jpg']],
      [['Night sleep', 'd:wakes', 'Waking often at night', 'night.jpg'], ['Bedtime', 'settle', 'Sleep training, if you want', 'book.jpg'], ['Safe sleep', 'd:mattress', 'Lower the mattress', 'mattress.jpg', 1]],
      A < 8 ? [['Night sleep', 'd:nightfeeds', 'Dropping night feeds', nurse ? 'feed-nurse.jpg' : 'feed.jpg'], ['Bedtime', 'd:earlybed', 'An earlier bedtime', 'book.jpg'], ['Safe sleep', 'd:mattress', 'Lower the mattress', 'mattress.jpg', 1]]
        : [['Night sleep', 'd:nightwake', 'Night waking comes back', 'nightwake.jpg'], ['Bedtime', 'd:goodbye', 'Short, steady goodbyes', 'goodbye.jpg'], ['Safe sleep', 'd:mattress', 'Lower the mattress', 'mattress.jpg', 1]]][v];
    const rows = ROWS.map(([t, r, g, img, safety]) => `<button class="hub-row fd-prow" onclick="${go('chg:Sleep:' + r)}"><span class="fd-thumb"><img src="${IMG + img}" alt="" loading="lazy"></span><span class="hub-row-copy"><b>${F(t)}</b><small>${F(g)}</small>${safety ? `<span class="hub-chip is-red">${F('Safety step')}</span>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`).join('');
    const grid = main.querySelector('.ssw-now-tiles');
    if (grid) grid.outerHTML = `<div class="hub-list fd-plist ssv-rows">${rows}</div>`;
    main.querySelectorAll('.ssw-simple-rows, .ssw-now-extra').forEach(e => e.remove());
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
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); simplify(); watch(); ensureTabs(); } catch (e) { console.error(e); } return r; };
})();
