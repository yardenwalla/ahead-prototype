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

  const nursing = () => { try { return /breast|nurs|both/i.test((JSON.parse(localStorage.getItem('ahead-v2-profile') || '{}').feed) || ''); } catch (e) { return false; } };
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


  // Photo steps (2–4), numbered, optionally one marked as the one to aim for.
  const photos = (list, aim) => `<div class="sv2-loop is-${list.length}">${list.map(([img, t, sub], i) => `<div class="${aim === i ? 'is-aim' : ''}">${aim === i ? `<em>${F('Aim for this')}</em>` : ''}<img src="${IMG + img}" alt=""><i>${i + 1}</i>${lab(t, sub)}</div>`).join('')}</div>`;
  // Two cards side by side; a photo when it helps, an icon otherwise.
  const two = (a, b) => `<div class="sv2-two">${[a, b].map(([tone, img, tag, t, sub, tryT, tryS]) => `<div class="is-${tone}${img ? '' : ' no-img'}">${img ? `<img src="${IMG + img}" alt="">` : ''}<em>${F(tag)}</em>${lab(t, sub)}${tryT ? `<p><b>${F(tryT)}</b>${F(tryS)}</p>` : ''}</div>`).join('')}</div>`;
  // Nights drawn to scale, 7 pm to 7 am: sleep in blue, each waking a gap.
  const N0 = 19, N1 = 31, np = h => ((h - N0) / (N1 - N0) * 100).toFixed(2) + '%';
  const night = (label, wakes, note, on) => `<div class="sv2-night${on ? ' is-on' : ''}"><b>${F(label)}${on ? ` <span>${F('Now')}</span>` : ''}</b><div class="sv2-nbar">${wakes.map(([h, w = .35, kind]) => `<s class="is-${kind || 'wake'}" style="left:${np(h)};width:${(w / (N1 - N0) * 100).toFixed(2)}%"></s>`).join('')}</div>${note ? `<small>${F(note)}</small>` : ''}</div>`;
  const nightScale = () => `<div class="sv2-nscale"><span>7 pm</span><span>11 pm</span><span>3 am</span><span>7 am</span></div>`;


  // Counted marks: one dot per waking or feed, so nothing needs decoding.
  const nowOf = ages => { const a = window.__chg.ageNow(); let k = -1; ages.forEach((x, i) => { if (x != null && a >= x) k = i; }); return k; };
  const tally = (unit, list, ages) => { const k = ages ? nowOf(ages) : -1; return `<div class="sv2-tally">${list.map(([l, n, stat, faded], i) => `<div class="${i === k ? 'is-on' : ''}"><b>${F(l)}${i === k ? ` <span>${F('Now')}</span>` : ''}</b><span class="sv2-dots">${Array.from({ length: n }, (_, j) => `<s class="${faded && j >= n - faded ? 'is-maybe' : ''}"></s>`).join('') || `<i>${F('None')}</i>`}</span><em>${F(stat)}</em></div>`).join('')}</div><p class="sv2-key"><s></s>${F(unit)}${list.some(x => x[3]) ? `<s class="is-maybe"></s>${F('Some nights')}` : ''}</p>`; };
  // Bars that grow: length is hours of sleep in one stretch.
  const grow = (list, ages) => { const k = nowOf(ages); return `<div class="sv2-grow">${list.map(([l, h, stat], i) => `<div class="${i === k ? 'is-on' : ''}"><b>${F(l)}${i === k ? ` <span>${F('Now')}</span>` : ''}</b><span><s style="width:${(h / 12 * 100).toFixed(1)}%"><em>${F(stat)}</em></s></span></div>`).join('')}</div>`; };

  const clock = (h, mnt) => { const a = (mnt / 60) * 360, hA = ((h % 12) + mnt / 60) * 30, p = (deg, r) => [50 + r * Math.sin(deg * Math.PI / 180), 50 - r * Math.cos(deg * Math.PI / 180)].map(n => n.toFixed(1));
    const [hx, hy] = p(hA, 22), [mx, my] = p(a, 32);
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#d3e1f6" stroke-width="4"/><line x1="50" y1="50" x2="${hx}" y2="${hy}" stroke="#46638c" stroke-width="6" stroke-linecap="round"/><line x1="50" y1="50" x2="${mx}" y2="${my}" stroke="#9fb8df" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="#46638c"/></svg>`; };

  const P = {
    // Fighting bedtime: the same protest, two reasons, shown side by side.
    'd:hiccup:bedtime': () => page('Bedtime', 'Fighting bedtime? It’s usually timing', 'Overtired and not tired enough look alike. Spot which one it is first.',
      vis('The same protest, two different reasons', '', `<div class="sv2-two">
        <div class="is-lav"><img src="${IMG}overtired.jpg" alt="A baby crying, overtired"><em>${F('Overtired')}</em>${lab('Fussy, frantic', 'Rubbing eyes, arching, hard to settle')}<p><b>${F('Try earlier')}</b>${F('Start the routine a little sooner.')}</p></div>
        <div class="is-sun"><img src="${IMG}hero-1.jpg" alt="A happy, wide-awake baby"><em>${F('Not tired yet')}</em>${lab('Bright-eyed, playful', 'Chatting instead of settling')}<p><b>${F('Try a little later')}</b>${F('Give {o} more time awake first.')}</p></div></div>`)
      + rows('What stays the same', [['eye', 'Follow {p} sleepy cues', 'Yawning, looking away, going quiet'], ['book', 'Keep the bedtime steps the same', 'Same calm routine, even if the start time moves']])
      + note('One change at a time.', 'Try earlier or later for a few nights before changing anything else.')
      + calls('sleep changes come with ' + fever() + ', poor feeding or pain.') + foot('Every baby moves at {p} own pace.')),


    // ---- Newborn and early months ----
    'd:steps0': () => page('Naps', 'Spot the yawn, soothe, then down', 'Winding down at the first sleepy cue makes settling easier than waiting for tears.',
      vis('Alert, sleepy or overtired?', '', photos([['alert.jpg', 'Alert', 'Ready to feed and play'], ['yawn.jpg', 'Getting sleepy', 'Yawning, staring off'], ['overtired.jpg', 'Overtired', 'Fussing and arching']], 1))
      + rows('Then three steps', [['', 'Sleepy cues', 'Start at the first one you see.'], ['', 'Soothe', 'Feed, rock, hold or shush. All fine.'], ['', 'Down', 'Drowsy or asleep, always on {p} back.']], true)
      + note('You can’t spoil a newborn.', 'Responding quickly helps {o} feel safe.', 'heart') + foot('Look for a few signs together. One yawn on its own can mean lots of things.')),
    'd:napsearly': () => page('Naps', 'Short, frequent naps are normal now', 'They come at different times each day, from 30 minutes to 2 hours.',
      vis('Feed, awake, sleep, repeat', 'Around the clock', photos([[nursing() ? 'feed-nurse.jpg' : 'feed.jpg', 'Feed', 'When hungry'], ['alert.jpg', 'Awake', 'Until the first yawn'], ['bassinetnap.jpg', 'Sleep', '30 min to 2 hrs']]) + `<p class="sv2-cap is-loop">↻ ${F('Then again, often every 2–3 hours')}</p>`)
      + rows('What helps', [['clock', 'Go by time awake, not the clock', 'Often about 45–60 minutes awake.'], ['eye', 'Start winding down early', 'At the first yawn or quiet stare.'], ['heart', 'Any nap counts', 'Naps in your arms or a carrier count too.']])
      + note('Dozed off in a car seat or swing?', 'Move {o} to {p} own flat, bare space.', 'crib', 'is-safe') + foot('Every baby moves at {p} own pace.')),
    'd:wakes': () => page('Night sleep', 'Waking at night is normal now', 'Most babies under 6 months wake to feed. Keep each waking short, dim and quiet.',
      vis('Wakings in one night', 'Normal now', tally('One waking, usually to feed', [['Newborn weeks', 4, '2–4 a night', 2], ['Around 6 months', 2, '1–2 a night', 1]], [0, 5]))
      + rows('When {s} stirs', [['', 'Pause first', 'Grunts and whimpers are normal. Give it 1–2 minutes.'], ['', 'Then help if needed', 'Feed, change or settle, in low light.'], ['', 'Check {s}’s not too warm', 'A sweaty neck means too warm.']], true)
      + note('Night feeds are normal now.', 'They drop on their own as {s} grows.') + calls('night waking comes with ' + fever() + ', poor feeding or pain, or {s} snores loudly or pauses in breathing.') + foot('Every baby moves at {p} own pace.')),
    'd:props': () => page('Night sleep', 'Only sleeps on you?', 'At this age that’s normal. You can step back slowly, a few nights at a time.',
      vis('Step back, a few nights each', 'Go slowly', photos([['sleepy.jpg', 'Hold until drowsy', 'Not fully asleep'], ['down.jpg', 'Into the crib', 'Hand on {p} chest'], ['goodbye.jpg', 'Sit nearby', 'Then farther away']]))
      + rows('Two ways to lay {o} down', [['moon', 'Drowsy, then down', 'Easier over time: {s} learns to finish falling asleep.'], ['heart', 'Deep asleep, then down', 'Wait for limp arms and slow breathing.']])
      + note('Getting sleepy holding {o}?', 'Put {o} in {p} crib, on {p} back. Never sleep with {o} on a sofa or armchair.', 'crib', 'is-safe') + foot('Feeding to sleep doesn’t have to change if it works for you.')),
    'd:daynight': () => page('Night sleep', 'Bright days and dim nights set {p} clock', 'Babies aren’t born knowing the difference. Light, sound and your routine help.',
      vis('Day and night, side by side', '', two(['sun', 'alert.jpg', 'By day', 'Bright and chatty', 'Curtains open, talk and play, even around naps.'], ['lav', 'nightfeed.jpg', 'At night', 'Dim and quiet', 'Low lights, few words, then straight back down.']))
      + rows('What to expect', [['sun', 'More awake by day', 'Once it clicks, often around 6–8 weeks.'], ['moon', 'Longest sleep at night', 'Often about 4–5 hours after bedtime.']])
      + note('Still waking {o} for feeds?', 'Keep going until {s}’s back to birth weight, or as your pediatrician says.') + foot('Every baby moves at {p} own pace.')),
    'd:stretch': () => page('Night sleep', '{P} longest sleep grows month by month', 'As {s} needs fewer night feeds, one stretch of sleep gets longer.',
      vis('Longest stretch of sleep', 'Typical', grow([['Newborn weeks', 3, '2–4 hrs'], ['3–4 months', 5, '5+ hrs'], ['Around 6 months', 7, '6–8 hrs'], ['9–12 months', 11, '10–12 hrs']], [0, 3, 5, 9]))
      + rows('What helps', [['moon', 'Let {o} sleep as long as {s} wants', 'Once your pediatrician says night feeds can wait.'], ['clock', 'Keep the same bedtime steps', 'They tell {o} the long sleep is coming.', 'd:routine']])
      + note('A few rough nights are normal.', 'New skills, teething or a cold, then the stretch comes back.') + foot('Ages are typical. Every baby moves at {p} own pace.')),
    'd:routine': () => page('Bedtime', 'Do the same bedtime steps every night', 'From about 6–8 weeks, a few calm steps in the same order tell {o} it’s bedtime.',
      vis('Four steps, same order', '15–20 minutes', photos([['pajamas.jpg', 'Pajamas', 'A bath is optional'], [nursing() ? 'feed-nurse.jpg' : 'feed.jpg', 'Feed', 'A calm last feed'], ['book.jpg', 'Book or song', 'The same most nights'], ['down.jpg', 'Down to sleep', 'Sleepy, on {p} back']]))
      + rows('Good to know', [['clock', 'Same order, not a perfect clock', 'The order is what tells {o} sleep is coming.'], ['moon', 'Nights start to stretch', '{S} gets sleepy around the same time each evening.'], ['sun', 'An earlier bedtime comes later', 'Around 7–8 pm, once naps settle.']])
      + foot('Every baby moves at {p} own pace.')),
    'd:predictable': () => page('Naps', 'Naps start to settle into set times', 'Around 3–4 months, {s} gets sleepy at about the same times each day.',
      vis('Sleepy at about the same times', 'Example', ends('Wake up 7:00 am', 'Bedtime 7:30 pm') + dayBar([[9, 10.25, '9 am'], [12.5, 13.75, '12:30'], [16, 16.75, '4 pm', 'cat']], 19.5) + legend([['awake', 'Awake'], ['nap', 'Nap']]))
      + rows('How to find {p} times', [['', 'Watch for a few days', 'Jot down when {s} gets sleepy.'], ['', 'Wind down first', 'A few calm, quiet minutes.'], ['', 'Down at those times', 'Most days, give or take.']], true)
      + note('Won’t settle for a nap?', 'If {s} isn’t tired yet, try again a little later.')
      + foot('Times are an example. Every baby moves at {p} own pace.')),
    'd:shortnap': () => page('Naps', 'A short nap changes the day', 'When a nap runs short, the next sleep usually needs to come sooner.',
      vis('When a nap runs short', '', photos([['nap.jpg', 'A short nap', '30–45 minutes'], ['yawn.jpg', 'Sleepy sooner', 'Next nap 15–30 min earlier'], ['down.jpg', 'Earlier bedtime', 'If the day runs short']]))
      + rows('', [['eye', 'Follow {p} cues', 'Bring the next sleep forward a little.'], ['moon', 'Earlier is better than overtired', 'An early bedtime is fine on short-nap days.', 'd:earlybed']])
      + note('Very common now.', 'Naps of 30–45 minutes are normal at 3–5 months. They get longer with time.') + foot('Every baby moves at {p} own pace.')),
    'd:regress': () => page('Night sleep', 'The 4‑month sleep regression is normal', '{P} sleep cycles are maturing, so {s} wakes more for a few weeks.',
      vis('Wakings in one night', 'A few weeks', tally('One waking', [['Before', 2, '1–2 wakings'], ['During', 6, 'Up every 1–2 hours'], ['A few weeks later', 2, '1–2 wakings again']], [null, 3, 5.5]))
      + rows('What helps', [['clock', 'Wait a minute or two', 'Many cries settle on their own.'], ['moon', 'Dark and quiet', 'Keep visits brief.'], ['heart', 'A feed if hungry', 'Comfort the way you always do.']])
      + note('No need to sleep train.', 'Keep doing what works, and it passes.') + calls('waking comes with ' + fever() + ', poor feeding or pain.') + foot('Ages are typical. Every baby moves at {p} own pace.')),
    'd:settle4': () => page('Bedtime', 'Try putting {o} down drowsy, once a day', 'From about 4 months, many babies can learn to fall asleep on their own.',
      vis('Practice, once a day', 'Often at bedtime', photos([['book.jpg', 'Your usual steps', 'Same order as always'], ['down.jpg', 'Down drowsy', 'Awake, on {p} back'], ['crib.jpg', 'Wait a minute', 'Before going in']]) + `<p class="sv2-cap is-loop">${F('Still upset? Help {o}, and try again another day.')}</p>`)
      + note('It’s practice, not a test.', 'Feeding or rocking to sleep is still fine.') + foot('Every baby moves at {p} own pace.')),
    'd:naphelp:fight': () => page('Naps', 'Fighting a nap?', 'You can’t make a baby sleep. Aim for rest: a fair try, a short break, then try again.',
      vis('A fair try, then a break', '', photos([['nap.jpg', 'Try 20–30 min', 'In a dark, calm room'], ['sleepy.jpg', 'Take a break', 'Up for a cuddle'], ['down.jpg', 'Try again', 'Or wait for the next nap']]))
      + `<h2 class="hub-h2">${F('Then check the timing')}</h2>` + two(['sun', 'hero-1.jpg', 'Not tired yet', 'Happy and chatty', '', 'Try a little later', ''], ['lav', 'overtired.jpg', 'Overtired', 'Eye rubs, arching', '', 'Start earlier', ''])
      + note('A nap on the go counts.', 'If {s} falls asleep in a car seat or swing, move {o} to a flat, safe space.', 'crib', 'is-safe') + foot('Every baby moves at {p} own pace.')),
    'd:naphelp:skip': () => page('Naps', 'What if a nap doesn’t happen?', 'It happens, and that’s okay. An earlier bedtime keeps {o} from getting overtired.',
      vis('Two possible evenings', '', two(['lav', 'nap.jpg', 'Usually better', 'Earlier bedtime', 'Helps {o} catch up, often a calmer night'], ['sun', 'overtired.jpg', 'Often harder', 'Usual bedtime', 'Often overtired by then']))
      + rows('What to do', [['', 'Move bedtime earlier', 'About 30 minutes earlier than usual.'], ['', 'Keep the usual routine', 'The same steps, just a bit earlier.'], ['', 'Watch for sleepy cues', '{S} may be ready sooner than usual.']], true)
      + foot('Every baby moves at {p} own pace.')),

    // ---- Older babies ----
    'd:hiccup:soon': () => page('Night sleep', 'Up soon after bedtime? Try earlier', 'A wake-up 30–60 minutes after bedtime often means {s} was overtired.',
      vis('Two usual reasons', '', two(['lav', 'overtired.jpg', 'Most often', 'Overtired', 'Eye rubs, arching', 'Try earlier', 'Bedtime 15–30 min sooner'], ['sun', 'hero-1.jpg', 'Sometimes', 'Not tired enough', 'Bright at bedtime', 'Cap the last nap', 'Or wake {o} gently']))
      + rows('What helps', [['', 'Feed earlier in the routine', 'Not right at the end, so {s} goes down awake.'], ['', 'Dark from the start', 'Lights low for the whole routine.']], true)
      + calls('sleep changes come with ' + fever() + ', poor feeding or pain.') + foot('Every baby moves at {p} own pace.')),
    'd:hiccup:early': () => page('Night sleep', 'Up before 6? Treat it as night', 'It’s often a late bedtime, early light, or a long last nap.',
      vis('Where to draw the line', '', two(['lav', 'nightwake.jpg', 'Before 6 am', 'Treat it as night', 'Dark, quiet and brief'], ['sun', 'hero-2.jpg', 'From 6 am', 'Start the day', 'Lights on, good morning']))
      + rows('Look for the cause', [['sun', 'Early light', 'Blackout curtains keep the room dark.'], ['moon', 'A late bedtime', 'Overtired babies wake early. Try 15–30 minutes earlier, for a week.'], ['clock', 'A long last nap', 'Cap it, so {s}’s tired enough for a full night.']])
      + calls('sleep changes come with ' + fever() + ', poor feeding or pain.') + foot('Every baby moves at {p} own pace.')),
    'd:nightfeeds': () => page('Night sleep', 'Night feeds drop as days get fuller', 'Many babies still feed once or twice a night, and that’s fine.',
      vis('Night feeds over the first year', 'Typical', tally('One night feed', [['Around 3 months', 3, '2–3 a night', 1], ['Around 6 months', 2, '1–2 a night', 1], ['Later in the first year', 1, '0–1 a night', 1]], [0, 5, 8]) + `<div class="sv2-inner"><i>${art('sunrise')}</i><p><b>${F('Last to go:')}</b> ${F('usually the feed closest to morning.')}</p></div>`)
      + rows('Ready to drop one?', [['', 'Ask your pediatrician first', 'They can say if {s}’s growing well enough.'], ['', 'Go slowly', 'A little shorter or smaller every few nights.'], ['', 'More by day', 'Full feeds while {s}’s awake.'], ['', 'Someone else goes in', 'Breastfed babies often settle more easily for a partner.']], true)
      + note('No bottle in bed.', 'Milk pooling on the teeth causes decay.', 'tooth', 'is-safe') + foot('Every baby moves at {p} own pace.')),
    'd:nightwake': () => page('Night sleep', 'Night waking can come back for a while', 'Babies who were sleeping well start waking again. It usually settles in a week or two.',
      vis('Wakings in one night', 'Typical', tally('One waking', [['Before', 1, 'Sleeping well'], ['For a week or two', 3, 'Waking again'], ['Then', 1, 'Settled again']])) + glance([['New skills', 'like pulling up'], ['Missing you', 'at bedtime'], ['Teething', 'or a cold']])
      + rows('What to do', [['', 'Wait or go in', 'Whatever feels right to you.'], ['', 'Brief, dark and boring', 'Then back down.'], ['', 'Comfort {o} when sick', 'Back to your usual routine once better.']], true)
      + note('Waking from hunger or habit?', 'Ask your pediatrician if night feeds are still needed.') + foot('Every baby moves at {p} own pace.')),
    'd:goodbye': () => page('Bedtime', 'Keep goodnights short and the same', 'Many babies protest when you leave around 8–10 months. It shows how attached {s} is.',
      vis('The same goodbye, every night', '', photos([['book.jpg', 'Your usual steps', 'Same order'], ['goodbye.jpg', 'Same goodnight words', 'Every time'], ['crib.jpg', 'Then leave', 'Even if {s} protests']]) + `<p class="sv2-cap is-loop">↻ ${F('Back briefly if needed: calm and boring')}</p>`)
      + rows('What’s normal now', [['heart', 'Crying as you leave', 'Right as you walk out.'], ['star', 'Only you will do', 'Especially at bedtime.'], ['stand', 'Standing up and calling', 'Wanting you to come back.']])
      + note('Predictable beats sneaking out.', 'Sneaking out can make {o} watch you more closely.') + foot('Every baby moves at {p} own pace.')),
    'd:yoursleep': () => page('Your sleep', 'Protect your own sleep too', 'A few changes help, even while {s} still wakes.',
      vis('Take shifts, if you can', 'Example', `<div class="sv2-shift"><div><b>${F('You’re on')}</b><small>9 pm – 2 am</small></div><div class="is-2"><b>${F('They’re on')}</b><small>2 am – 7 am</small></div></div><p class="sv2-cap">${F('With a partner or a helper, each of you gets one 4–5 hour stretch.')}</p>`)
      + rows('What helps', [['moon', 'Go to bed early', 'Soon after {p} bedtime.'], ['home', 'Let chores wait', 'Sleep when you can.'], ['bottle', 'Share a feed', 'Pumped milk or formula, if it fits your plan.']])
      + note('Sleepy during night feeds?', 'Use your bed, cleared of pillows, never a sofa. Then move {o} back to {p} crib.', 'crib', 'is-safe')
      + rows('', [['heart', 'Feeling low for more than 2 weeks?', 'Talk to your doctor, or call or text 1‑833‑852‑6262. In a crisis, call 988.']])),
    'd:away': () => page('Travel', 'Travel throws sleep off for a few days', 'A new time zone can too. A safe spot and your usual steps help most.',
      vis('Shifting bedtime by an hour', 'Example', `<div class="sv2-clocks is-4">${[[7, 0, 'Day 1'], [7, 15, 'Day 2'], [7, 30, 'Day 3'], [7, 45, 'Day 4']].map(([h, mn, d], i) => `<div class="${i === 3 ? 'is-on' : ''}">${clock(h, mn)}<b>${h}:${String(mn).padStart(2, '0')}</b><small>${F(d)}</small></div>`).join('')}</div><p class="sv2-cap">${F('For an hour or two, shift 15 minutes a day. For a bigger jump, switch to local time right away.')}</p>`)
      + rows('Before the first night', [['', 'Pack the sleep sack', 'And something that smells like home.'], ['', 'Set up a bare spot first', 'A play yard or crib, nothing in it.'], ['', 'Same bedtime steps', 'Always in the same order.']], true)
      + note('Car seats are for the car.', 'Move {o} to a flat spot once you arrive.', 'car', 'is-safe') + foot('The same works when the clocks change.')),

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
      + rows('What feels different', [['moon', 'Just a morning and an afternoon nap', 'Most daytime sleep moves into two longer naps.'], ['clock', 'A longer last awake stretch', 'Bedtime may come a bit earlier while {s} adjusts.', 'd:earlybed'], ['heart', 'A wobbly switch is normal', 'Some days still need a short extra nap.']])
      + note('The takeaway:', 'The catnap’s time goes to longer awake stretches, not a late extra nap.') + foot('Times are an example. Every baby moves at {p} own pace.')),

    // Nap transitions: before and after, on the same clock.
    'd:catnap': () => page('Naps', 'Three naps become two', 'Usually between 6 and 9 months, the third nap stops fitting as awake time grows.',
      vis('The day changes shape', 'Before → After', `<div class="sv2-ba"><b>${F('Three-nap day')}</b>${dayBar([[9, 10.25, 'Nap 1'], [12.5, 13.75, 'Nap 2'], [16.25, 16.75, 'Catnap', 'cat']])}</div><div class="sv2-ba-arrow" aria-hidden="true">↓</div>
        <div class="sv2-ba is-after"><b>${F('Two-nap day')}</b>${dayBar([[9.5, 11, 'Morning nap'], [14, 15.5, 'Afternoon nap']], 18.75, { ghost: [[16.25, 16.75]] })}</div>
        <p class="sv2-cap">${F('The catnap’s spot fills with awake time, and bedtime moves a little earlier.')}</p>`)
      + rows('Signs {s} may be ready', [['moon', 'The third nap is hard to fit', '{S} refuses it, or it pushes bedtime late.'], ['clock', '{S} stays happy awake longer', 'The gaps between naps start to stretch.'], ['sun', 'The first two naps get longer', '{S} may not need the short bridge anymore.']])
      + note('Try this:', 'On days {s} skips the catnap, move bedtime about 30 minutes earlier.') + foot('Ages are typical. Every baby moves at {p} own pace.')),
    'd:after': () => page('Naps', 'Two naps become one', 'This usually happens between 13 and 18 months, not at the first birthday.',
      vis('The day changes shape', 'Before → After', `<div class="sv2-ba"><b>${F('Two-nap day')}</b>${dayBar([[9.5, 11, 'Morning nap'], [14, 15.5, 'Afternoon nap']])}</div><div class="sv2-ba-arrow" aria-hidden="true">↓</div>
        <div class="sv2-ba is-after"><b>${F('One-nap day')}</b>${dayBar([[12, 14.5, 'One longer nap']], 18.75, { ghost: [[9.5, 11]] })}</div>
        <p class="sv2-cap">${F('The morning nap slides later until it becomes one nap around lunch.')}</p>`)
      + rows('Signs {s} may be ready', [['sun', 'Fights the morning nap most days', '{S} plays through it, or it takes ages to fall asleep.'], ['clock', 'The afternoon nap shrinks', 'Or bedtime drifts late.'], ['heart', 'Holds up fine until lunch', 'One longer midday nap starts to fit.']])
      + note('Try this:', 'Push the morning nap a bit later every few days, until it lands around lunch.') + foot('Ages are typical. Every baby moves at {p} own pace.')),

    // Up for an hour at night: the split night, then where to look.
    'd:hiccup:split': () => page('Night sleep', 'Up for an hour at night?', 'If {s}’s awake and happy for a long stretch, look at the whole day, not just bedtime.',
      vis('What a split night can look like', '', `<div class="sv2-split"><s class="is-night"></s><s class="is-up">${F('Awake')}</s><s class="is-night"></s></div><div class="sv2-split-l"><span>${F('Asleep')}</span><span>${F('Happy, alert, playing')}</span><span>${F('Asleep again')}</span></div>
        <div class="sv2-inner"><i>${art('sun')}</i><p><b>${F('Look at the day first.')}</b> ${F('Long naps or an early bedtime leave {o} less sleepy.')}</p></div>`)
      + rows('Three things to try', [['', 'Look at daytime sleep', 'Cap the last nap, or wake {o} gently if naps run long.'], ['', 'Keep wake-up time steady', 'The same morning time anchors the day.'], ['', 'Keep the night boring', 'Dark, quiet and brief. No play.']], true)
      + calls('waking is new and keeps going, or comes with ' + fever() + ', poor feeding or pain.') + foot('Every baby moves at {p} own pace.')),

    // Sleep training: a choice, then each method as a picture of what you do.
    settle: () => page('Sleep training', 'Sleep training is a choice, not a must', 'There’s no single right way, and rocking or feeding to sleep is fine too.',
      vis('Two things you can change', '', `<div class="sv2-pair"><div><i>${art('clock')}</i><b>${F('The timing')}</b><small>${F('Move bedtime earlier in small steps.')}</small></div><div><i>${art('heart')}</i><b>${F('Your response')}</b><small>${F('Choose how you’ll comfort {o}.')}</small></div></div>`)
      + `<h2 class="hub-h2">${F('Change the timing')}</h2><button class="sv2-fade" onclick="${go('d:method:4')}"><span class="sv2-fade-top"><i>${art('clock')}</i><span><b>${F('Bedtime fading')}</b><small>${F('Start later, then slowly shift earlier.')}</small></span><em>${F('Least crying')}</em></span><span class="sv2-fade-line"><b>8:30</b><s></s><b>8:15</b><s></s><b>8:00</b></span></button>`
      + rows('Choose how to comfort {o}', [['hand', 'Pick up, put down', 'Comfort in your arms, then put {o} back.', 'd:method:2', 'Some crying'], ['sofa', 'Chair method', 'Sit nearby, moving farther away over time.', 'd:method:1', 'Some crying'], ['clock', 'Timed check-ins', 'Leave, then come back for short check-ins.', 'd:method:0', 'More crying'], ['moon', 'Cry it out', 'Say goodnight and don’t go back in, except to feed or if {s}’s unwell.', 'd:method:3', 'Most crying']])
      + (() => { const a = window.__chg.ageNow(); const when = a < 4 ? 'It’s usually considered from 4–6 months.' : a <= 6 ? 'Many families consider it around 4–6 months.' : 'It can work at any age from here.';
        return rows('Before you start', [['steth', 'Check with your pediatrician first', when]]); })()
      + note('Pick one and stick with it.', 'Give it 1–2 weeks, the same way for every caregiver.') + foot('All methods are optional. Night feeds may still be needed.')),
    'd:method:4': () => page('Sleep training', 'Bedtime fading', 'Start at the time {s} naturally falls asleep, then move bedtime earlier, a little at a time.',
      vis('Watch bedtime shift', 'Example', `<div class="sv2-clocks">${[[8, 30, '8:30', 'Natural sleepy time'], [8, 15, '8:15', 'A few nights later'], [8, 0, '8:00', 'Closer to your goal']].map(([h, mn, t, s], i) => `<div class="${i === 2 ? 'is-on' : ''}">${clock(h, mn)}<b>${t}</b><small>${F(s)}</small></div>`).join('')}</div>
        <div class="sv2-inner"><i>${art('moon')}</i><p><b>${F('Same bedtime routine.')}</b> ${F('Only the time moves.')}</p></div>`)
      + glance([['Least', 'crying'], ['As usual', 'your comforting'], ['1–2 weeks', 'often takes']])
      + rows('How you do it', [['', 'Start at {p} real sleepy time', 'Notice when {s} actually falls asleep, and start bedtime there.'], ['', 'Keep it there a night or two', 'Until {s}’s falling asleep quickly.'], ['', 'Then move 15 minutes earlier', 'Repeat every couple of nights until you reach your goal.']], true)
      + note('Still wide awake?', 'Stay at the current time a little longer before moving earlier.', 'idea') + foot('Times are an example, not target bedtimes. Some babies adjust faster, some more slowly.')),
    'd:method:2': () => page('Sleep training', 'Pick up, put down', 'Comfort {o} in your arms when {s} cries, then let {o} try again in the crib.',
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
    'd:method:0': () => page('Sleep training', 'Timed check-ins', 'Say goodnight and step out. Come back for short check-ins, waiting longer each time.',
      vis('See the check-in rhythm', 'Example', `<div class="sv2-inner is-top"><i>${art('crib')}</i><p><b>${F('Goodnight')}</b> ${F('Down awake after your routine, then leave.')}</p></div>
        <div class="sv2-waits">${[3, 5, 10].map((n, i) => `<div class="is-${i}"><b>${n}</b><small>${F('min wait')}</small></div>`).join(`<span>↪<small>${F('check')}</small></span>`)}</div>
        <p class="sv2-cap is-loop">↻ ${F('Keep the longest wait if crying continues')}</p>
        <div class="sv2-inner"><i>${art('heart')}</i><p><b>${F('During a check (1–2 min):')}</b> ${F('Talk softly or pat, then leave while {s}’s still awake.')}</p></div>`)
      + glance([['More', 'crying'], ['In and out', 'your role'], ['1–2 weeks', 'often takes']])
      + rows('What happens next', [['', 'If {s} settles', 'Stop checking. Let {o} sleep.'], ['', 'If {s} wakes later', 'Feed if it’s time for a feed; otherwise the same check-ins.'], ['', 'Over the next nights', 'Start each wait a few minutes longer than the night before.']], true)
      + note('Do check-ins wind {o} up?', 'Try longer gaps, or another method.', 'heart') + foot('3, 5 and 10 minutes are an example, not required times. Keep meeting feeding and comfort needs.'))
  };

  const prev = window.changesRoute;
  window.changesRoute = function (p) {
    const k = /^chg:Sleep:(.+)$/.exec(p || ''); const r = k && P[k[1]];
    if (r) { try { return r(); } catch (e) { console.error(e); } }
    return prev.apply(this, arguments);
  };
  window.SLEEP_V2 = P;
})();
