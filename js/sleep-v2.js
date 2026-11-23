/* Sleep guide pages, Nov 23 (Yarden's mockups): show, don't tell.
   One shape for every page: eyebrow, question, one-line answer; one picture card that carries the idea;
   at most three rows; one closing card (lavender takeaway, or orange only for safety); When to call where it applies. */
(function () {
  const F = s => window.__hub.F(s);
  const H = () => window.__hub;
  const IMG = 'assets/sleep/';
  const art = n => H().art(n, 'Sleep');
  const go = r => `openPage('chg:Sleep:${r}')`;
  const fever = () => { try { const mo = window.__chg.ageNow(); return mo < 3 ? 'a temperature of 100.4°F or higher' : mo < 6 ? 'a temperature of 101°F or higher' : 'a fever of 103°F or higher, or one lasting more than a day'; } catch (e) { return 'a fever'; } };

  const page = (eyebrow, title, lead, body) => H().detail('Sleep', eyebrow, title, lead, `<div class="sv2">${body}</div>`, 'moon').replace('<div class="hub-detail-head', '<div class="hub-detail-head sv2-head');
  const vis = (label, tag, inner) => `<section class="sv2-vis"><header><em>${F(label)}</em>${tag ? `<span>${F(tag)}</span>` : ''}</header>${inner}</section>`;
  const glance = list => `<div class="sv2-glance">${list.map(([b, s]) => `<div><b>${F(b)}</b><small>${F(s)}</small></div>`).join('')}</div>`;
  const rows = (h, list, numbered) => `${h ? `<h2 class="hub-h2">${F(h)}</h2>` : ''}<div class="sv2-rows">${list.map(([ic, t, s, to, chip], i) => {
    const lead = numbered ? `<i class="is-num">${i + 1}</i>` : `<i>${art(ic)}</i>`;
    const inner = `${lead}<span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}${chip ? `<em class="sv2-chip">${F(chip)}</em>` : ''}</span>${to ? '<u aria-hidden="true">›</u>' : ''}`;
    return to ? `<button class="sv2-row" onclick="${go(to)}">${inner}</button>` : `<div class="sv2-row">${inner}</div>`; }).join('')}</div>`;
  const note = (b, t, ic = 'star', tone = '') => `<div class="sv2-note ${tone}"><i>${art(ic)}</i><p><b>${F(b)}</b> ${F(t)}</p></div>`;
  const calls = ped => H().TPLB.calls({ ped, now: '{s} struggles to breathe or turns blue, won’t wake, or is floppy.', nowLabel: 'Call 911' });
  const foot = t => `<p class="sv2-foot">${F(t)}</p>`;

  // A day drawn to scale: every block is as long as it really is.
  const H0 = 7, H1 = 19.25, pct = h => ((h - H0) / (H1 - H0) * 100).toFixed(2) + '%';
  const dayBar = (naps, bed = H1, opts = {}) => {
    const segs = []; let t = H0;
    naps.forEach(([a, b, , kind]) => { segs.push(['awake', t, a]); segs.push([kind || 'nap', a, b]); t = b; });
    segs.push(['awake', t, bed]); if (bed < H1) segs.push(['night', bed, H1]);
    const bar = segs.map(([k, a, b]) => `<s class="is-${k}" style="left:${pct(a)};width:calc(${pct(b)} - ${pct(a)} - 3px)"></s>`).join('')
      + (opts.ghost || []).map(([a, b]) => `<s class="is-ghost" style="left:${pct(a)};width:calc(${pct(b)} - ${pct(a)} - 3px)"></s>`).join('');
    const labels = naps.map(([a, b, lab]) => `<span style="left:${pct((a + b) / 2)}">${lab}</span>`).join('');
    return `<div class="sv2-bar">${bar}</div><div class="sv2-bar-labels">${labels}</div>`;
  };
  const ends = (wake, bed) => `<div class="sv2-ends"><span><i>${art('sun')}</i>${F(wake)}</span><span>${F(bed)}<i>${art('moon')}</i></span></div>`;
  const legend = list => `<div class="sv2-legend">${list.map(([k, t]) => `<span><s class="is-${k}"></s>${F(t)}</span>`).join('')}</div>`;
  const lab = (t, s) => `<b>${F(t)}</b><small>${F(s)}</small>`;

  const clock = (h, mnt) => { const a = (mnt / 60) * 360, hA = ((h % 12) + mnt / 60) * 30, p = (deg, r) => [50 + r * Math.sin(deg * Math.PI / 180), 50 - r * Math.cos(deg * Math.PI / 180)].map(n => n.toFixed(1));
    const [hx, hy] = p(hA, 22), [mx, my] = p(a, 32);
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#d9d3f6" stroke-width="4"/><line x1="50" y1="50" x2="${hx}" y2="${hy}" stroke="#5b4fc4" stroke-width="6" stroke-linecap="round"/><line x1="50" y1="50" x2="${mx}" y2="${my}" stroke="#a79cf0" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="#5b4fc4"/></svg>`; };

  const P = {
    // Fighting bedtime: the same protest, two reasons, shown side by side.
    'd:hiccup:bedtime': () => page('Bedtime', 'Fighting bedtime? It’s usually timing', '{S} may be overtired, or not sleepy enough yet. The two look alike, so look for the difference first.',
      vis('The same protest, two different reasons', '', `<div class="sv2-two">
        <div class="is-lav"><img src="${IMG}overtired.jpg" alt="A baby crying, overtired"><em>${F('Overtired')}</em>${lab('Fussy, frantic', 'Rubbing eyes, arching, hard to settle')}<p><b>${F('Try earlier')}</b>${F('Start the routine a little sooner.')}</p></div>
        <div class="is-sun"><img src="${IMG}hero-1.jpg" alt="A happy, wide-awake baby"><em>${F('Not tired yet')}</em>${lab('Bright-eyed, playful', 'Chatting instead of settling')}<p><b>${F('Try a little later')}</b>${F('Give {o} more time awake first.')}</p></div></div>`)
      + rows('What stays the same', [['eye', 'Follow {p} sleepy cues', 'Yawning, looking away, going quiet'], ['book', 'Keep the bedtime steps the same', 'Same calm routine, even if the start time moves']])
      + note('One change at a time.', 'Try earlier or later for a few nights before changing anything else.')
      + calls('sleep changes come with ' + fever() + ', poor feeding or pain.') + foot('Every baby moves at {p} own pace.')),

    // Example days, drawn to scale.
    'd:day:2': () => page('Three naps', 'An example day with three naps', 'Two longer naps and a short catnap, and how they fit together.',
      vis('One possible day', 'Not a fixed schedule', ends('Wake up 7:00 am', 'Bedtime 7:15 pm')
        + dayBar([[9, 10.25, 'Nap 1<br><small>9:00–10:15</small>'], [12.5, 13.75, 'Nap 2<br><small>12:30–1:45</small>'], [16.25, 16.75, 'Catnap<br><small>4:15–4:45</small>', 'cat']])
        + legend([['awake', 'Awake'], ['nap', 'Nap'], ['cat', 'Short catnap']]))
      + rows('What matters more than the clock', [['moon', 'Two longer naps', 'They do most of the daytime rest.'], ['clock', 'A short last nap', 'Often 30–45 minutes, just enough to reach bedtime.'], ['sun', 'A flexible afternoon', 'If a nap runs short, the rest of the day shifts.', 'd:shortnap']])
      + note('The takeaway:', 'Think of the catnap as a bridge to bedtime, not another full nap.') + foot('Times are an example. Every baby moves at {p} own pace.')),
    'd:day:3': () => page('Two naps', 'An example day with two naps', 'Two longer naps, with longer awake stretches in between.',
      vis('One possible day', 'Longer awake times', ends('Wake up 7:00 am', 'Bedtime 7:15 pm')
        + dayBar([[9.75, 11, 'Morning nap<br><small>9:45–11:00</small>'], [14.25, 15.5, 'Afternoon nap<br><small>2:15–3:30</small>']])
        + legend([['awake', 'Awake'], ['nap', 'Nap']]))
      + rows('How this stage feels different', [['moon', 'Just a morning and an afternoon nap', 'Most daytime sleep moves into two longer naps.'], ['clock', 'A longer last awake stretch', 'Bedtime may come a bit earlier while {s} adjusts.', 'd:earlybed'], ['heart', 'A wobbly switch is normal', 'Some days still need a short extra nap.']])
      + note('The takeaway:', 'The catnap’s time goes to longer awake stretches, not a late extra nap.') + foot('Times are an example. Every baby moves at {p} own pace.')),

    // Nap transitions: before and after, on the same clock.
    'd:catnap': () => page('Naps', 'Three naps become two', 'Usually between 6 and 9 months, the third nap stops fitting as awake time grows.',
      vis('The day changes shape', 'Before → After', `<div class="sv2-ba"><b>${F('Three-nap day')}</b>${dayBar([[9, 10.25, 'Nap 1'], [12.5, 13.75, 'Nap 2'], [16.25, 16.75, 'Catnap', 'cat']])}</div><div class="sv2-ba-arrow" aria-hidden="true">↓</div>
        <div class="sv2-ba is-after"><b>${F('Two-nap day')}</b>${dayBar([[9.5, 11, 'Morning nap'], [14, 15.5, 'Afternoon nap']], 18.75, { ghost: [[16.25, 16.75]] })}</div>
        <p class="sv2-cap">${F('The catnap’s spot fills with awake time, and bedtime moves a little earlier.')}</p>`)
      + rows('Signs {s} may be ready', [['moon', 'The third nap is hard to fit', '{S} refuses it, or it pushes bedtime late.'], ['clock', '{S} stays happy awake longer', 'The gaps between naps start to stretch.'], ['sun', 'The first two naps get longer', '{S} may not need the short bridge anymore.']])
      + note('Try this:', 'Let the catnap go on days {s} skips it, and use a bedtime about 30 minutes earlier while {s} adjusts.') + foot('Ages are typical. Every baby moves at {p} own pace.')),
    'd:after': () => page('Naps', 'Two naps become one', 'Usually between 13 and 18 months. Most babies still need two naps at their first birthday.',
      vis('The day changes shape', 'Before → After', `<div class="sv2-ba"><b>${F('Two-nap day')}</b>${dayBar([[9.5, 11, 'Morning nap'], [14, 15.5, 'Afternoon nap']])}</div><div class="sv2-ba-arrow" aria-hidden="true">↓</div>
        <div class="sv2-ba is-after"><b>${F('One-nap day')}</b>${dayBar([[12, 14.5, 'One longer nap']], 18.75, { ghost: [[9.5, 11]] })}</div>
        <p class="sv2-cap">${F('The morning nap slides later until it becomes one nap around lunch.')}</p>`)
      + rows('Signs {s} may be ready', [['sun', 'Fights the morning nap most days', '{S} plays through it, or it takes ages to fall asleep.'], ['clock', 'The afternoon nap shrinks', 'Or bedtime drifts late.'], ['heart', 'Holds up fine until lunch', 'One longer midday nap starts to fit.']])
      + note('Try this:', 'Push the morning nap a little later every few days until it lands around lunch, with an earlier bedtime while {s} adjusts.') + foot('Ages are typical. Every baby moves at {p} own pace.')),

    // Up for an hour at night: the split night, then where to look.
    'd:hiccup:split': () => page('Night sleep', 'Up for an hour at night?', 'If {s}’s awake and happy for a long stretch, look at the whole day, not just bedtime.',
      vis('What a split night can look like', '', `<div class="sv2-split"><s class="is-night"></s><s class="is-up">${F('Awake')}</s><s class="is-night"></s></div><div class="sv2-split-l"><span>${F('Asleep')}</span><span>${F('Happy, alert, playing')}</span><span>${F('Asleep again')}</span></div>
        <div class="sv2-inner"><i>${art('sun')}</i><p><b>${F('Often the answer is in the day.')}</b> ${F('Long naps or an early bedtime can leave {o} less sleepy at night.')}</p></div>`)
      + rows('Three things to try', [['', 'Look at daytime sleep', 'Cap the last nap, or wake {o} gently if naps run long.'], ['', 'Keep wake-up time steady', 'The same morning time anchors the day.'], ['', 'Keep the night boring', 'Dark, quiet and brief. No play.']], true)
      + calls('waking is new and keeps going, or comes with ' + fever() + ', poor feeding or pain.') + foot('Every baby moves at {p} own pace.')),

    // Sleep training: a choice, then each method as a picture of what you do.
    settle: () => page('Sleep training', 'Sleep training is a choice, not a must', 'There’s no single right way, and rocking or feeding to sleep is fine too.',
      vis('Two things you can change', '', `<div class="sv2-pair"><div><i>${art('clock')}</i><b>${F('The timing')}</b><small>${F('Move bedtime earlier in small steps.')}</small></div><div><i>${art('heart')}</i><b>${F('Your response')}</b><small>${F('Choose how you’ll comfort {o}.')}</small></div></div>`)
      + `<h2 class="hub-h2">${F('Change the timing')}</h2><button class="sv2-fade" onclick="${go('d:method:4')}"><span class="sv2-fade-top"><i>${art('clock')}</i><span><b>${F('Bedtime fading')}</b><small>${F('Start later, then slowly shift earlier.')}</small></span><em>${F('Least crying')}</em></span><span class="sv2-fade-line"><b>8:30</b><s></s><b>8:15</b><s></s><b>8:00</b></span></button>`
      + rows('Choose how to comfort {o}', [['hand', 'Pick up, put down', 'Comfort in your arms, then put {o} back.', 'd:method:2', 'Some crying'], ['sofa', 'Chair method', 'Sit nearby, moving farther away over time.', 'd:method:1', 'Some crying'], ['clock', 'Timed check-ins', 'Leave, then come back for short check-ins.', 'd:method:0', 'More crying'], ['moon', 'Cry it out', 'Say goodnight and don’t go back in, except to feed or if {s}’s unwell.', 'd:method:3', 'Most crying']])
      + (() => { const a = window.__chg.ageNow(); const when = a < 4 ? '{S}’s still young for it. Often considered from 4–6 months.' : a <= 6 ? '{S}’s in the window: often considered around 4–6 months.' : 'It can work at any age from here.';
        return rows('Before you start', [['steth', 'Readiness matters more than a date', when + ' Check with your pediatrician about growth and feeding first.']]); })()
      + note('Pick one and stick with it.', 'Give it 1–2 weeks, the same way for every caregiver.') + foot('All methods are optional. Night feeds may still be needed.')),
    'd:method:4': () => page('Sleep training', 'Bedtime fading', 'Start at the time {s} naturally falls asleep, then move bedtime earlier, a little at a time.',
      vis('Watch bedtime shift', 'Example', `<div class="sv2-clocks">${[[8, 30, '8:30', 'Natural sleepy time'], [8, 15, '8:15', 'A few nights later'], [8, 0, '8:00', 'Closer to your goal']].map(([h, mn, t, s], i) => `<div class="${i === 2 ? 'is-on' : ''}">${clock(h, mn)}<b>${t}</b><small>${F(s)}</small></div>`).join('')}</div>
        <div class="sv2-inner"><i>${art('moon')}</i><p><b>${F('Same bedtime routine.')}</b> ${F('Only the time moves.')}</p></div>`)
      + glance([['Least', 'crying'], ['As usual', 'your comforting'], ['1–2 weeks', 'often takes']])
      + rows('How you do it', [['', 'Start at {p} real sleepy time', 'Notice when {s} actually falls asleep, and start bedtime there.'], ['', 'Keep it there a night or two', 'Until {s}’s falling asleep quickly.'], ['', 'Then move 15 minutes earlier', 'Repeat every couple of nights until you reach your goal.']], true)
      + note('Still wide awake?', 'Stay at the current time a little longer before moving earlier.', 'idea') + foot('Times are an example, not target bedtimes. Some babies adjust faster, some more slowly.')),
    'd:method:2': () => page('Sleep training', 'Pick up, put down', 'Comfort {o} in your arms when {s} cries, then give {o} another chance to settle in the crib.',
      vis('One calming loop', 'Repeat as needed', `<div class="sv2-loop">${[['down.jpg', 'Put {o} down', 'Drowsy, on {p} back'], ['sleepy.jpg', 'Pick up if crying', 'Hold until calmer'], ['goodbye.jpg', 'Put back down', 'Before {s}’s fully asleep']].map(([img, t, s], i) => `<div><img src="${IMG + img}" alt=""><i>${i + 1}</i>${lab(t, s)}</div>`).join('')}</div><p class="sv2-cap is-loop">↻ ${F('Repeat the same calm response')}</p>`)
      + glance([['Some', 'crying'], ['In the room', 'where you are'], ['1–2 weeks', 'often takes']])
      + rows('What happens at night', [['heart', 'If {s} cries, comfort {o}', 'Pick {o} up until calm, not asleep, then lay {o} back down.'], ['moon', 'Night wakes use the same loop', 'Feed if it’s time for a feed.']])
      + note('Safe sleep, every time:', 'On {p} back, in {p} own bare crib.', 'crib', 'is-safe') + foot('Some babies move faster, some more slowly.')),
    'd:method:1': () => page('Sleep training', 'The chair method', 'Stay close at first, then move toward the door over a few nights.',
      vis('Watch where you move', 'From crib toward door', `<div class="sv2-map"><div class="sv2-map-room"><span class="sv2-crib" aria-hidden="true">${art('crib')}</span>${[1, 2, 3].map(n => `<i class="is-${n}">${n}</i>`).join('')}</div><div class="sv2-map-door"><small>${F('Outside')}</small><i class="is-4">4</i></div></div>
        <div class="sv2-steps4">${[['Nights 1–3', 'Right by the crib'], ['Nights 4–6', 'Halfway to the door'], ['Nights 7–9', 'In the doorway'], ['Then', 'Goodnight from outside']].map(([t, s], i) => `<div><b>${i + 1} · ${F(t)}</b><small>${F(s)}</small></div>`).join('')}</div>`)
      + glance([['Some', 'crying'], ['In the room', 'at first'], ['1–2 weeks', 'often takes']])
      + rows('What you do each night', [['heart', 'Sit quietly in that night’s spot', 'Comfort with your voice or a pat, less each night.'], ['moon', 'If {s} wakes', 'Go back to the same spot. Feed if it’s time for a feed.'], ['clock', 'Move when {s} settles easily', 'Stay longer at a spot if {s} needs it.']])
      + note('The idea:', '{S} learns to fall asleep with you nearby, then with you farther away.') + foot('Some babies move faster, some more slowly.')),
    'd:method:0': () => page('Sleep training', 'Timed check-ins', 'Say goodnight, step out, and come back for short check-ins, with longer waits between them.',
      vis('See the check-in rhythm', 'Example', `<div class="sv2-inner is-top"><i>${art('crib')}</i><p><b>${F('Goodnight')}</b> ${F('Down awake after your routine, then leave.')}</p></div>
        <div class="sv2-waits">${[3, 5, 10].map((n, i) => `<div class="is-${i}"><b>${n}</b><small>${F('min wait')}</small></div>`).join(`<span>↪<small>${F('check')}</small></span>`)}</div>
        <p class="sv2-cap is-loop">↻ ${F('Keep the longest wait if crying continues')}</p>
        <div class="sv2-inner"><i>${art('heart')}</i><p><b>${F('During a check (1–2 min):')}</b> ${F('Talk softly or pat, then leave while {s}’s still awake.')}</p></div>`)
      + glance([['More', 'crying'], ['In and out', 'your role'], ['1–2 weeks', 'often takes']])
      + rows('What happens next', [['', 'If {s} settles', 'Stop checking. Let {o} sleep.'], ['', 'If {s} wakes later', 'Feed if it’s time for a feed; otherwise the same check-ins.'], ['', 'Over the next nights', 'Start each wait a few minutes longer than the night before.']], true)
      + note('Check-ins suit some babies more than others.', 'If they wind {o} up, longer gaps or another method can help.', 'heart') + foot('3, 5 and 10 minutes are an example, not required times. Keep meeting feeding and comfort needs.'))
  };

  const prev = window.changesRoute;
  window.changesRoute = function (p) {
    const k = /^chg:Sleep:(.+)$/.exec(p || ''); const r = k && P[k[1]];
    if (r) { try { return r(); } catch (e) { console.error(e); } }
    return prev.apply(this, arguments);
  };
  window.SLEEP_V2 = P;
})();
