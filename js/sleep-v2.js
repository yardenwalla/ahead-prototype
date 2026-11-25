/* Sleep guide pages, Nov 23 (Yarden's mockups): show, don't tell.
   One shape for every page: eyebrow, question, one-line answer; one picture card that carries the idea;
   at most three rows; one closing card (lavender takeaway, or orange only for safety); When to call where it applies. */
(function () {
  const F = s => window.__hub.F(s);
  const H = () => window.__hub;
  const IMG = 'assets/sleep/';
  const art = n => H().art(n, 'Sleep');
  const go = r => `openPage('chg:Sleep:${r}')`;
  const fever = () => { try { const mo = window.__chg.ageNow(); return mo < 3 ? 'a temperature of 100.4°F or higher (call right away, day or night)' : mo < 6 ? 'a fever that lasts more than a day or reaches 101°F' : 'a fever that lasts more than a day or reaches 103°F'; } catch (e) { return 'a fever'; } };

  const nursing = () => { try { return /breast|nurs|both/i.test((JSON.parse(localStorage.getItem('ahead-v2-profile') || '{}').feed) || ''); } catch (e) { return false; } };
  const page = (eyebrow, title, lead, body) => H().detail('Sleep', eyebrow, title, lead, `<div class="sv2">${body}</div>`, 'moon').replace('<div class="hub-detail-head', '<div class="hub-detail-head sv2-head');
  const vis = (label, tag, inner) => `<section class="sv2-vis"><header><em>${F(label)}</em>${tag ? `<span>${F(tag)}</span>` : ''}</header>${inner}</section>`;
  const glance = list => `<div class="sv2-glance">${list.map(([b, s]) => `<div><b>${F(b)}</b><small>${F(s)}</small></div>`).join('')}</div>`;
  const rows = (h, list, numbered) => `${h ? `<h2 class="hub-h2">${F(h)}</h2>` : ''}<div class="sv2-rows">${list.map(([ic, t, s, to, chip], i) => {
    const lead = numbered ? `<i class="is-num">${i + 1}</i>` : `<i>${art(ic)}</i>`;
    const inner = `${lead}<span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}${chip ? `<em class="sv2-chip">${F(chip)}</em>` : ''}</span>${to ? '<u aria-hidden="true">›</u>' : ''}`;
    return to ? `<button class="sv2-row" onclick="${go(to)}">${inner}</button>` : `<div class="sv2-row">${inner}</div>`; }).join('')}</div>`;
  const note = (b, t, ic = 'star', tone = '') => `<div class="sv2-note ${tone}"><i>${art(ic)}</i><p><b>${F(b)}</b> ${F(t)}</p></div>`;
  const calls = ped => H().TPLB.calls({ ped, now: '{s} {struggle|struggles} to breathe or {turn|turns} blue, won’t wake, or {are|is} floppy.', nowLabel: 'Call 911' });
  const foot = t => `<p class="sv2-foot">${F(t)}</p>`;

  // A day drawn to scale: every block is as long as it really is.
  const H0 = 7, H1 = 20, pct = h => ((h - H0) / (H1 - H0) * 100).toFixed(2) + '%';
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
  const photos = (list, aim, plain) => `<div class="sv2-loop is-${list.length}${plain ? ' is-plain' : ''}">${list.map(([img, t, sub], i) => `<div class="${aim === i ? 'is-aim' : ''}"><img src="${IMG + img}" alt="">${plain ? '' : `<i>${i + 1}</i>`}${lab(t, sub)}${aim === i ? `<em>${F('Aim for this')}</em>` : ''}</div>`).join('')}</div>`;
  window.__sv2photos = list => `<div class="sv2">${photos(list)}</div>`;
  // Nov 24 (Sleep C): photos that match the baby's age, past the newborn months.
  const age = () => { try { return window.__chg.ageNow(); } catch (e) { return 0; } };
  const OT = () => age() >= 4 ? 'older-overtired.jpg' : 'overtired.jpg', YAWN = () => age() >= 4 ? 'older-yawn.jpg' : 'yawn.jpg';
  const formulaOnly = () => { try { return /^formula/i.test((JSON.parse(localStorage.getItem('ahead-v2-profile') || '{}').feed) || ''); } catch (e) { return false; } };
  const breastOnly = () => { try { return /^breast/i.test((JSON.parse(localStorage.getItem('ahead-v2-profile') || '{}').feed) || ''); } catch (e) { return false; } };
  // Weeks old (by due date for an early baby), for advice that changes within the first months.
  const weeks = () => { try { const p = JSON.parse(localStorage.getItem('ahead-v2-profile') || '{}'), d = Date.parse((p.early && p.due) || p.dob); return isNaN(d) ? age() * 4.35 : (Date.now() - d) / 6048e5; } catch (e) { return age() * 4.35; } };
  // Method pages: three labeled facts, so each tile reads on its own.
  const mglance = list => `<div class="sv2-glance is-labeled">${list.map(([l, v]) => `<div><small>${F(l)}</small><b>${F(v)}</b></div>`).join('')}</div>`;
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
  // Nov 24: Feeding's night pages show the same chart, so both guides answer "how many night feeds" the same way.
  window.__sv2clusterFeeds = () => `<div class="sv2">${vis('A newborn day, by feeds', 'Example', tally('One feed', [['Afternoon', 2, 'Every 2–3 hours'], ['Evening', 5, 'Close together', 1], ['Overnight', 2, 'Often a longer stretch']]))}</div>`;
  window.__sv2nightFeeds = () => `<div class="sv2">${vis('Night feeds over the first year', 'Typical', tally('One night feed', [['Newborn weeks', 4, 'Several a night', 1], ['Around 3 months', 3, 'Still common', 1], ['Around 6 months', 2, 'Often fewer', 1], ['Later in the first year', 1, 'Often none', 1]], [0, 2.5, 5, 8]))}</div>`;
  const grow = (list, ages) => { const k = nowOf(ages); return `<div class="sv2-grow">${list.map(([l, h, stat], i) => `<div class="${i === k ? 'is-on' : ''}"><b>${F(l)}${i === k ? ` <span>${F('Now')}</span>` : ''}</b><span><s style="width:${(h / 12 * 100).toFixed(1)}%"><em>${F(stat)}</em></s></span></div>`).join('')}</div>`; };

  const clock = (h, mnt) => { const a = (mnt / 60) * 360, hA = ((h % 12) + mnt / 60) * 30, p = (deg, r) => [50 + r * Math.sin(deg * Math.PI / 180), 50 - r * Math.cos(deg * Math.PI / 180)].map(n => n.toFixed(1));
    const [hx, hy] = p(hA, 22), [mx, my] = p(a, 32);
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#d3e1f6" stroke-width="4"/><line x1="50" y1="50" x2="${hx}" y2="${hy}" stroke="#46638c" stroke-width="6" stroke-linecap="round"/><line x1="50" y1="50" x2="${mx}" y2="${my}" stroke="#9fb8df" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="#46638c"/></svg>`; };

  const P = {
    // Fighting bedtime: the same protest, two reasons, shown side by side.
    'd:hiccup:bedtime': () => page('Bedtime', 'Fighting bedtime? It’s usually timing', 'Overtired and not tired enough look alike. Spot which one it is first.',
      vis('The same protest, two different reasons', '', `<div class="sv2-two">
        <div class="is-lav"><img src="${IMG}${OT()}" alt="A baby crying, overtired"><em>${F('Overtired')}</em>${lab('Fussy, frantic', 'Rubbing eyes, arching, hard to settle')}<p><b>${F('Try earlier')}</b>${F('Start the routine a little sooner.')}</p></div>
        <div class="is-sun"><img src="${IMG}hero-1.jpg" alt="A happy, wide-awake baby"><em>${F('Not tired yet')}</em>${lab('Bright-eyed, playful', 'Chatting instead of settling')}<p><b>${F('Try a little later')}</b>${F('Give {o} more time awake first.')}</p></div></div>`)
      + rows('What stays the same', [['eye', 'Follow {p} sleepy cues', 'Yawning, looking away, going quiet'], ['book', 'Keep the bedtime steps the same', 'Same calm routine, even if the start time moves']])
      + note('One change at a time.', 'Try earlier or later for a few nights before changing anything else.')
      + calls('sleep changes come with ' + fever() + ', poor feeding or pain.')),


    // ---- Newborn and early months ----
    'd:steps0': () => page('Naps', 'Spot the yawn, soothe, then down', 'Winding down at the first sleepy cue makes settling easier than waiting for tears.',
      vis('Alert, sleepy or overtired?', '', photos([['alert.jpg', 'Alert', 'Ready to feed and play'], ['yawn.jpg', 'Getting sleepy', 'Yawning, staring off'], [OT(), 'Overtired', 'Fussing and arching']], 1, true))
      + `<h2 class="hub-h2">${F('At the first sleepy cue')}</h2>` + photos([['sleepy.jpg', 'Soothe', 'Feed, rock, hold or shush'], ['down.jpg', 'Down', 'Drowsy or asleep, on {p} back']])
      + note('You can’t spoil a newborn.', 'Responding quickly helps {o} feel safe.', 'heart') + foot('Look for a few signs together. One yawn on its own can mean lots of things.')),
    'd:napsearly': () => page('Naps', 'Short, frequent naps are normal now', 'They come at different times each day, from 30 minutes to 2 hours.',
      vis('Feed, awake, sleep, repeat', 'Around the clock', photos([[nursing() ? 'feed-nurse.jpg' : 'feed.jpg', 'Feed', 'When hungry'], ['alert.jpg', 'Awake', 'Until the first yawn'], ['bassinetnap.jpg', 'Sleep', '30 min to 2 hrs']]) + `<p class="sv2-cap is-loop">↻ ${F('Then again, often every 2–3 hours')}</p>`)
      + rows('What helps', [['clock', 'Go by time awake, not the clock', weeks() < 6 ? 'Often about 45–60 minutes awake.' : 'Often about 1 to 1½ hours awake.'], ['eye', 'Start winding down early', 'At the first yawn or quiet stare.'], ['heart', 'Any nap counts', 'Naps in your arms or a carrier count too.']])
      + note('Dozed off in a car seat or swing?', 'Move {o} to {p} own flat, bare space.', 'crib', 'is-safe') + foot('Every baby moves at {p} own pace.')),
    'd:wakes': () => page('Night sleep', 'Waking at night is normal now', age() >= 6 ? 'Many still wake once to feed. Keep it short, dim and quiet.' : 'Most babies under 6 months wake to feed. Keep each waking short, dim and quiet.',
      vis('Wakings in one night', 'Normal now', tally('One waking', [['Newborn weeks', 4, 'Several a night', 2], ['Around 6 months', 2, 'Fewer, for many', 1]], [0, 5]))
      + rows('When {s} stirs', [['', 'Pause first', 'Grunts and whimpers are normal. Give it 1–2 minutes.'], ['', 'Then help if needed', 'Feed, change or settle, in low light.'], ['', 'Check {s}’s not too warm', 'A sweaty neck means too warm.']], true)
      + note('Hungry, or just stirring?', 'If {s} settles in a minute or two without a feed, it wasn’t hunger.') + calls('night waking comes with ' + fever() + ', poor feeding or pain, or {s} {snore|snores} loudly or {have|has} long pauses in breathing.')),
    'd:props': () => page('Night sleep', 'Only falls asleep on you?', 'That’s common now. Let {o} drift off on you, then move {o} to {p} crib.',
      vis('Step back, a few nights each', 'Go slowly', photos([['sleepy.jpg', 'Hold until sleepy', 'Drowsy or asleep'], ['down.jpg', 'Into the crib', 'Hand on {p} chest'], ['chair-1.jpg', 'Sit nearby', 'Then farther away']]))
      + rows('Two ways to lay {o} down', [['moon', 'Drowsy, then down', 'Easier over time: {s} {learn|learns} to finish falling asleep.'], ['heart', 'Deep asleep, then down', 'Wait for limp arms and slow breathing.']])
      + note('Getting sleepy holding {o}?', 'Put {o} in {p} crib, on {p} back. Never sleep with {o} on a sofa or armchair.', 'crib', 'is-safe') + foot('Feeding to sleep doesn’t have to change if it works for you.')),
    'd:daynight': () => page('Night sleep', 'Bright days and dim nights set {p} clock', 'Babies aren’t born knowing the difference. Light, sound and your routine help.',
      vis('Day and night, side by side', '', two(['sun', 'alert.jpg', 'By day', 'Bright and chatty', 'Curtains open, talk and play, even around naps.'], ['lav', nursing() ? 'feed-nurse.jpg' : 'nightfeed.jpg', 'At night', 'Dim and quiet', 'Low lights, few words, then straight back down.']))
      + rows('What to expect', [['sun', 'More awake by day', 'Once it clicks, often around 6–8 weeks.'], ['moon', 'Longest sleep at night', 'Often about 4–5 hours after bedtime.']])
      + note('Still waking {o} for feeds?', 'Keep going until {s}’s back to birth weight, or as your pediatrician says.') + foot('Every baby moves at {p} own pace.')),
    'd:stretch': () => page('Night sleep', '{P} longest sleep grows month by month', 'As {s} needs fewer night feeds, one stretch of sleep gets longer.',
      vis('Longest stretch of sleep', 'Typical', grow([['Newborn weeks', 3, '2–4 hrs'], ['3–4 months', 5, 'Often 4–5 hrs'], ['Around 6 months', 7, '6+ hrs, for many']], [0, 3, 5]))
      + rows('What helps', [['moon', 'Let {o} sleep as long as {s} wants', 'Once your pediatrician says night feeds can wait.'], ['clock', 'Keep the same bedtime steps', 'They tell {o} the long sleep is coming.', 'd:routine']])
      + note('Not there yet?', 'Many healthy babies don’t sleep 6 hours straight at 6 months, or even at 1.') + foot('Ages are typical. Every baby moves at {p} own pace.')),
    'd:routine': () => page('Bedtime', 'Do the same bedtime steps every night', 'From about 6–8 weeks, a few calm steps in the same order tell {o} it’s bedtime.',
      vis('Four steps, same order', '15–20 minutes', photos([['pajamas.jpg', 'Pajamas', 'A bath is optional'], [nursing() ? 'feed-nurse.jpg' : 'feed.jpg', 'Feed', 'A calm last feed'], ['book.jpg', 'Book or song', 'The same most nights'], ['down.jpg', 'Down to sleep', 'Sleepy, on {p} back']]))
      + rows('Good to know', [['clock', 'Same order, not a perfect clock', 'The order is what tells {o} sleep is coming.'], ['moon', 'Nights start to stretch', '{S} gets sleepy around the same time each evening.'], ['sun', 'An earlier bedtime comes later', 'Around 7–8 pm, once naps settle.']])
      + foot('Every baby moves at {p} own pace.')),
    'd:predictable': () => page('Naps', 'Naps start to settle into set times', 'Around 3–4 months, {s} gets sleepy at about the same times each day.',
      vis('Sleepy at about the same times', 'Example', ends('Wake up 7:00 am', 'Bedtime 7:30 pm') + dayBar([[9, 10.25, '9 am'], [12.5, 13.75, '12:30'], [16, 16.75, '4 pm', 'cat']], 19.5) + legend([['awake', 'Awake'], ['nap', 'Nap'], ['night', 'Bedtime']]))
      + rows('How to find {p} times', [['', 'Watch for a few days', 'Jot down when {s} gets sleepy.'], ['', 'Wind down first', 'A few calm, quiet minutes.'], ['', 'Down at those times', 'Most days, give or take.']], true)
      + note('Won’t settle for a nap?', 'If {s} isn’t tired yet, try again a little later.')
      + foot('Times are an example. Every baby moves at {p} own pace.')),
    'd:shortnap': () => page('Naps', 'A short nap moves the day earlier', age() < 6 ? 'A 30–45 minute nap is common at this age. Plan the next sleep a little sooner.' : 'Teething or a new skill can cut a nap short. Plan the next sleep a little sooner.',
      vis('When a nap runs short', '', photos([['nap.jpg', 'A short nap', '30–45 minutes'], [YAWN(), 'Sleepy sooner', 'Next nap 15–30 min earlier'], ['book.jpg', 'Earlier bedtime', 'If the day runs short']]))
      + rows('', [['eye', 'Follow {p} cues', 'Sleepy signs matter more than the clock.']])
      + note(age() < 6 ? 'Naps get longer with time.' : 'Short naps still happen.', 'A dark room and white noise can help a nap last.') + foot('Every baby moves at {p} own pace.')),
    'd:regress': () => page('Night sleep', 'The 4‑month sleep regression is normal', '{P} sleep cycles are maturing, so {s} wakes more for a few weeks.',
      vis('Wakings in one night', 'A few weeks', tally('One waking', [['Before', 2, 'Your usual nights'], ['During', 6, 'More wakings'], ['A few weeks later', 2, 'Back to usual']], [null, 3, 5.5]))
      + rows('What helps', [['clock', 'Wait a minute or two', 'Many cries settle on their own.'], ['moon', 'Dark and quiet', 'Keep visits brief.'], ['heart', 'A feed if hungry', 'Comfort the way you always do.']])
      + note('No need to sleep train.', 'Keep doing what works, and it passes.') + calls('waking comes with ' + fever() + ', poor feeding or pain.') + foot('Ages are typical. Every baby moves at {p} own pace.')),
    'd:settle4': () => page('Bedtime', 'Try putting {o} down drowsy, once a day', 'From about 4 months, many babies can learn to fall asleep on their own.',
      vis('Practice, once a day', 'Often at bedtime', photos([['book.jpg', 'Your usual steps', 'Same order as always'], ['down.jpg', 'Down drowsy', 'Awake, on {p} back'], ['crib.jpg', 'Wait a minute', 'Before going in']]) + `<p class="sv2-cap is-loop">${F('Still upset? Help {o}, and try again another day.')}</p>`)
      + note('It’s practice, not a test.', 'Feeding or rocking to sleep is still fine.') + foot('Every baby moves at {p} own pace.')),
    'd:naphelp:fight': () => page('Naps', 'Fighting a nap?', 'You can’t make a baby sleep. Aim for rest: a fair try, a short break, then try again.',
      vis('A fair try, then a break', '', photos([['nap.jpg', 'Try 20–30 min', 'In a dark, calm room'], ['sleepy.jpg', 'Take a break', 'Up for a cuddle'], ['back.jpg', 'Try again', 'Or wait for the next nap']]))
      + `<h2 class="hub-h2">${F('Then check the timing')}</h2>` + two(['sun', 'hero-1.jpg', 'Not tired yet', 'Happy and chatty', '', 'Try a little later', ''], ['lav', OT(), 'Overtired', 'Eye rubs, arching', '', 'Start earlier', ''])
      + note('A nap on the go counts.', 'If {s} falls asleep in a car seat or swing, move {o} to a flat, safe space.', 'crib', 'is-safe') + foot('Every baby moves at {p} own pace.')),
    'd:naphelp:skip': () => page('Naps', 'What if a nap doesn’t happen?', 'It happens, and that’s okay. An earlier bedtime keeps {o} from getting overtired.',
      vis('Two possible evenings', '', two(['lav', 'nap.jpg', 'Usually better', 'Earlier bedtime', 'Helps {o} catch up, often a calmer night'], ['sun', OT(), 'Often harder', 'Usual bedtime', 'Often overtired by then']))
      + rows('What to do', [['', 'Move bedtime earlier', 'About 30 minutes earlier than usual.'], ['', 'Keep the usual routine', 'The same steps, just a bit earlier.'], ['', 'Watch for sleepy cues', '{S} may be ready sooner than usual.']], true)
      + foot('Every baby moves at {p} own pace.')),

    // ---- Older babies ----
    'd:hiccup:soon': () => page('Night sleep', 'Up soon after bedtime? Try earlier', 'A wake-up 30–60 minutes after bedtime often means {s} was overtired.',
      vis('Two usual reasons', '', two(['lav', OT(), 'Most often', 'Overtired', 'Eye rubs, arching', 'Try earlier', 'Bedtime 15–30 min sooner'], ['sun', 'hero-1.jpg', 'Sometimes', 'Not tired enough', 'Bright at bedtime', 'Cap the last nap', 'Or wake {o} gently']))
      + rows('What helps', [['', 'Feed earlier in the routine', 'Not right at the end, so {s} goes down awake.'], ['', 'Dark from the start', 'Lights low for the whole routine.']], true)
      + calls('sleep changes come with ' + fever() + ', poor feeding or pain.')),
    'd:hiccup:early': () => page('Night sleep', 'Up before 6? Treat it as night', 'Early waking is common and usually fixable. Look for one cause at a time.',
      vis('Where to draw the line', '', two(['lav', 'nightwake.jpg', 'Before 6 am', 'Treat it as night', 'Dark, quiet and brief'], ['sun', 'hero-2.jpg', 'From 6 am', 'Start the day', 'Lights on, good morning']))
      + rows('Look for the cause', [['sun', 'Early light', 'Blackout curtains keep the room dark.'], ['moon', 'A late bedtime', 'Overtired babies wake early. Try 15–30 minutes earlier, for a week.'], ['clock', 'A long last nap', 'Cap it, so {s}’s tired enough for a full night.']])
      + calls('sleep changes come with ' + fever() + ', poor feeding or pain.')),
    'd:nightfeeds': () => page('Night sleep', 'Night feeds drop as days get fuller', 'Many babies still feed once or twice a night, and that’s fine.',
      vis('Night feeds over the first year', 'Typical', tally('One night feed', [['Around 3 months', 3, 'Still common', 1], ['Around 6 months', 2, 'Often fewer', 1], ['Later in the first year', 1, 'Often none', 1]], [0, 5, 8]) + `<div class="sv2-inner"><i>${art('sunrise')}</i><p><b>${F('Last to go:')}</b> ${F('usually the feed closest to morning.')}</p></div>`)
      + rows('Ready to drop one?', [['', 'Ask your pediatrician first', 'To check Maya is growing well enough.'], ['', 'Go slowly', 'A little shorter or smaller every few nights.'], ['', 'More by day', 'Full feeds while {s’s} awake.'], ['', 'Someone else goes in', formulaOnly() ? 'Many babies settle more easily for a partner.' : 'Breastfed babies often settle more easily for a partner.']], true)
      + note('No bottle in bed.', 'Milk pooling on the teeth causes decay.', 'tooth', 'is-safe')),
    'd:nightwake': () => page('Night sleep', 'Night waking can come back for a while', 'It’s a sleep regression, and it usually settles in a week or two.',
      vis('Wakings in one night', 'Typical', tally('One waking', [['Before', 1, 'Sleeping well'], ['For a week or two', 3, 'Waking again'], ['Then', 1, 'Settled again']])) + glance([['New skills', 'like pulling up'], ['Missing you', 'at bedtime'], ['Teething', 'or a cold']])
      + rows('What to do', [['clock', 'Give {o} a few minutes', 'Many babies settle back on their own.'], ['moon', 'Keep visits dark and quiet', 'Low light, few words, then out.'], ['heart', 'Sick or teething? Comfort more', 'Back to your usual routine once better.']])
      + note('Waking from hunger or habit?', 'Ask your pediatrician if night feeds are still needed.') + foot('Every baby moves at {p} own pace.')),
    'd:goodbye': () => page('Bedtime', 'Keep goodnights short and the same', 'Many babies protest when you leave around 8–10 months. It shows how attached {s} is.',
      vis('The same goodbye, every night', '', photos([['book.jpg', 'Your usual steps', 'Same order'], ['goodbye.jpg', 'Same goodnight words', 'Every time'], ['crib.jpg', 'Then leave', 'Even if {s} protests']]) + `<p class="sv2-cap is-loop">↻ ${F('Back briefly if needed: calm and boring')}</p>`)
      + rows('What’s normal now', [['heart', 'Crying as you leave', 'Right as you walk out.'], ['star', 'Only you will do', 'Especially at bedtime.'], ['stand', 'Standing up and calling', 'Wanting you to come back.']])
      + note('Predictable beats sneaking out.', 'Sneaking out can make {o} watch you more closely.')),
    // Nov 24 (Sleep C): before 1, this is a look ahead; the photos show the change.
    'd:lovey': () => page(age() < 12 ? 'Read ahead · From 12 months' : 'Safe sleep', 'After 1, a small lovey can join the crib', 'By then the risk of sudden infant death is much lower, and a lovey can comfort {o}.',
      vis('Before and after 1', '', photos([['back.jpg', 'Before 1', 'Nothing in the crib'], ['lovey-crib.jpg', 'After 1', 'One small lovey']], null, true))
      + rows('What’s okay after 12 months', [['toy', 'A small lovey', 'Soft, with no loose parts.'], ['sack', 'A thin blanket', 'Light, not heavy.']])
      + note('Keep the rest bare.', 'No pillows, bumpers or big stuffed animals.', 'crib', 'is-safe')),
    'd:yoursleep': () => page('Your sleep', 'Your sleep matters too', 'A few changes help, even on hard nights.',
      vis('Take shifts, if you can', 'Example', `<div class="sv2-shift"><div><b>${F('You’re on')}</b><small>9 pm – 2 am</small></div><div class="is-2"><b>${F('Partner’s on')}</b><small>2 am – 7 am</small></div></div><p class="sv2-cap">${F('With a partner or a helper, each of you gets one 4–5 hour stretch.')}</p>`)
      + rows('What helps', [['moon', 'Go to bed early', 'Soon after {p} bedtime.'], ['home', 'Let chores wait', 'Sleep when you can.'], ['bottle', 'Share a feed', formulaOnly() ? 'Anyone can give a bottle.' : breastOnly() ? 'Pumped milk in a bottle, if it fits your plan.' : 'Pumped milk or formula, if it fits your plan.']])
      + note('Sleepy during night feeds?', 'Use your bed, cleared of pillows, never a sofa. Then move {o} back to {p} crib.', 'crib', 'is-safe')
      + rows('', [['heart', 'Feeling low for more than 2 weeks?', 'Talk to your doctor, or call or text 1‑833‑852‑6262. In a crisis, call 988.']])),
    'd:away': () => page('Travel', 'Travel throws sleep off for a few days', 'A safe spot and your usual bedtime steps help most, even across time zones.',
      vis('A new time zone', '', two(['lav', '', 'An hour or two', 'Shift slowly', '', 'Move 15 minutes a day', 'Or just switch, if it’s easier'], ['sun', '', 'A bigger jump', 'Switch right away', '', 'Use local time from day 1', 'Bright mornings, dim evenings']))
      + `<h2 class="hub-h2">${F('Before the first night')}</h2>` + photos([['crib.jpg', 'Pack the sleep sack', 'And something from home'], ['playyard.jpg', 'Set up a bare spot', 'Play yard or crib, nothing in it'], ['book.jpg', 'Same bedtime steps', 'In the same order']])
      + note('Car seats are for the car.', 'Move {o} to a flat spot once you arrive.', 'car', 'is-safe') + foot('The same works when the clocks change.')),

    // Example days, drawn to scale.
    'd:day:2': () => page('Naps', 'Most rest comes from two longer naps', 'A short catnap bridges the gap to bedtime.',
      vis('One possible day', 'Not a fixed schedule', ends('Wake up 7:00 am', 'Bedtime 7:15 pm')
        + dayBar([[9, 10.25, 'Nap 1<br><small>9:00–10:15</small>'], [12.5, 13.75, 'Nap 2<br><small>12:30–1:45</small>'], [16.25, 16.75, 'Catnap<br><small>4:15–4:45</small>', 'cat']], 19.25)
        + legend([['awake', 'Awake'], ['nap', 'Nap'], ['cat', 'Catnap'], ['night', 'Bedtime']]))
      + rows('What matters more than the clock', [['moon', 'The first two naps', 'Often 1–2 hours each.'], ['clock', 'Cap the catnap', 'Wake {o} after about 45 minutes, so bedtime stays on time.'], ['sun', 'A flexible afternoon', 'If a nap runs short, the rest of the day shifts.']])
      + foot('Times are an example, not a schedule.')),
    'd:day:3': () => page('Naps', 'Two naps, with longer stretches awake', 'The late catnap drops, so {s’s} awake longer before bed.',
      vis('One possible day', 'Longer awake times', ends('Wake up 7:00 am', 'Bedtime 7:15 pm')
        + dayBar([[9.75, 11, 'Morning nap<br><small>9:45–11:00</small>'], [14.25, 15.5, 'Afternoon nap<br><small>2:15–3:30</small>']], 19.25)
        + legend([['awake', 'Awake'], ['nap', 'Nap'], ['night', 'Bedtime']]))
      + rows('What feels different', [['sun', 'A later first nap', 'Often 2½–3 hours after waking.'], ['clock', 'A longer last awake stretch', 'Bedtime may come a bit earlier while {s} adjusts.'], ['heart', 'A wobbly switch is normal', 'Some days still need a short extra nap.']])
      + note('Keep wake-up time steady.', 'The same morning time anchors both naps.') + foot('Times are an example, not a schedule.')),

    // Nap transitions: before and after, on the same clock.
    'd:catnap': () => page('Naps', 'Three naps become two', 'Usually between 6 and 9 months, the third nap stops fitting as awake time grows.',
      vis('The day changes shape', 'Before → After', `<div class="sv2-ba"><b>${F('Three-nap day')}</b>${dayBar([[9, 10.25, 'Nap 1'], [12.5, 13.75, 'Nap 2'], [16.25, 16.75, 'Catnap', 'cat']], 19)}</div><div class="sv2-ba-arrow" aria-hidden="true">↓</div>
        <div class="sv2-ba is-after"><b>${F('Two-nap day')}</b>${dayBar([[9.5, 11, 'Morning nap'], [14, 15.5, 'Afternoon nap']], 18.5)}</div>
        ${legend([['awake', 'Awake'], ['nap', 'Nap'], ['night', 'Bedtime']])}<p class="sv2-cap">${F('The catnap’s spot fills with awake time, and bedtime moves a little earlier.')}</p>`)
      + rows('Signs {s} may be ready', [['moon', 'The third nap is hard to fit', '{S} refuses it, or it pushes bedtime late.'], ['clock', '{S} stays happy awake longer', 'The gaps between naps start to stretch.'], ['sun', 'The first two naps get longer', '{S} may not need the short bridge anymore.']])
      + note('Try this:', 'On days {s} skips the catnap, move bedtime about 30 minutes earlier.') + foot('Ages are typical. Every baby moves at {p} own pace.')),
    'd:after': () => page(age() < 13 ? 'Read ahead · From 13 months' : 'Naps', 'Two naps become one', 'This usually happens between 13 and 18 months, not at the first birthday.',
      vis('The day changes shape', 'Before → After', `<div class="sv2-ba"><b>${F('Two-nap day')}</b>${dayBar([[9.5, 11, 'Morning nap'], [14, 15.5, 'Afternoon nap']], 19)}</div><div class="sv2-ba-arrow" aria-hidden="true">↓</div>
        <div class="sv2-ba is-after"><b>${F('One-nap day')}</b>${dayBar([[12, 14.5, 'One longer nap']], 18.5)}</div>
        ${legend([['awake', 'Awake'], ['nap', 'Nap'], ['night', 'Bedtime']])}<p class="sv2-cap">${F('The morning nap slides later until it becomes one nap around lunch. Bedtime may come a little earlier for a while.')}</p>`)
      + rows('Signs {s} may be ready', [['sun', 'Fights the morning nap most days', '{S} plays through it, or it takes ages to fall asleep.'], ['clock', 'The afternoon nap shrinks', 'Or bedtime drifts late.'], ['heart', 'Holds up fine until lunch', 'One longer midday nap starts to fit.']])
      + note('Try this:', 'Push the morning nap a bit later every few days, until it lands around lunch.') + foot('Ages are typical. Every baby moves at {p} own pace.')),

    // Up for an hour at night: the split night, then where to look.
    'd:hiccup:split': () => page('Night sleep', 'Up for an hour at night?', 'If {s}’s awake and happy for a long stretch, look at the whole day, not just bedtime.',
      vis('Usually, the day is the reason', '', two(['sun', 'nap10.jpg', 'By day', 'Long naps', 'Or an early bedtime', 'Cap the last nap', 'Or wake {o} gently'], ['lav', 'nightwake.jpg', 'So at night', 'Up and happy', 'For an hour or more', 'Keep it boring', 'Dark, quiet and brief']))
      + note('Keep wake-up time steady.', 'The same morning time anchors the whole day.')
      + calls('waking is new and keeps going, or comes with ' + fever() + ', poor feeding or pain.')),

    // Sleep training: a choice, then each method as a picture of what you do.
    settle: () => page('Sleep training', 'Sleep training is a choice, not a must', 'There’s no single right way, and rocking or feeding to sleep is fine too.',
      `<h2 class="hub-h2">${F('Change the timing')}</h2><button class="sv2-fade" onclick="${go('d:method:4')}"><span class="sv2-fade-top"><i>${art('clock')}</i><span><b>${F('Bedtime fading')}</b><small>${F('Start later, then slowly shift earlier.')}</small></span><em>${F('Least crying')}</em></span><span class="sv2-fade-line"><b>8:30</b><s></s><b>8:15</b><s></s><b>8:00</b></span></button>`
      + rows('Choose how to comfort {o}', [['hand', 'Pick up, put down', 'Comfort in your arms, then put {o} back.', 'd:method:2', 'Some crying'], ['sofa', 'Chair method', 'Sit nearby, moving farther away over time.', 'd:method:1', 'Some crying'], ['clock', 'Timed check-ins', 'Leave, then come back for short check-ins.', 'd:method:0', 'More crying'], ['moon', 'Cry it out', 'Say goodnight and don’t go back in, except to feed or if {s}’s unwell.', 'd:method:3', 'Most crying']])
      + (() => { const a = window.__chg.ageNow(); const when = a < 4 ? 'It’s usually considered from 4–6 months.' : a <= 6 ? 'Many families consider it around 4–6 months.' : 'It can work at any age from here.';
        return rows('Before you start', [['steth', 'Check with your pediatrician first', when]]); })()
      + note('Pick one and stick with it.', 'Give it 1–2 weeks, the same way for every caregiver.') + foot('Night feeds may still be needed.')),
    'd:method:4': () => page('Sleep training', 'Bedtime fading', 'Start at the time {s} naturally {fall|falls} asleep, then move bedtime earlier, a little at a time.',
      vis('Watch bedtime shift', 'Example', `<div class="sv2-clocks">${[[8, 30, '8:30', 'Natural sleepy time'], [8, 15, '8:15', 'A few nights later'], [8, 0, '8:00', 'Closer to your goal']].map(([h, mn, t, s], i) => `<div class="${i === 2 ? 'is-on' : ''}">${clock(h, mn)}<b>${t}</b><small>${F(s)}</small></div>`).join('')}</div>
        <div class="sv2-inner"><i>${art('moon')}</i><p><b>${F('Same bedtime routine.')}</b> ${F('Only the time moves.')}</p></div>`)
      + mglance([['Crying', 'The least'], ['You', 'As usual'], ['Usually takes', '1–2 weeks']])
      + rows('How you do it', [['', 'Start at {p} real sleepy time', 'Notice when {s} actually {fall|falls} asleep, and start bedtime there.'], ['', 'Keep it there a night or two', 'Until {s}’s falling asleep quickly.'], ['', 'Then move 15 minutes earlier', 'Repeat every couple of nights until you reach your goal.']], true)
      + note('Still wide awake?', 'Stay at the current time a little longer before moving earlier.', 'idea') + foot('Times are an example, not target bedtimes. Some babies adjust faster, some more slowly.')),
    'd:method:2': () => page('Sleep training', 'Pick up, put down', '{S} learns to settle in the crib, with you close by.',
      vis('One calming loop', 'Repeat as needed', `<div class="sv2-loop">${[['down.jpg', 'Put {o} down', 'Drowsy, on {p} back'], ['pickup.jpg', 'Pick up if crying', 'Hold until calmer'], ['goodbye.jpg', 'Put back down', 'Before {s}’s fully asleep']].map(([img, t, s], i) => `<div><img src="${IMG + img}" alt=""><i>${i + 1}</i>${lab(t, s)}</div>`).join('')}</div><p class="sv2-cap is-loop">↻ ${F('Repeat the same calm response')}</p>`)
      + mglance([['Crying', 'Some'], ['You', 'In the room'], ['Usually takes', '1–2 weeks']])
      + rows('What happens at night', [['clock', 'The first nights take the most loops', 'Give it a week before you judge it.'], ['moon', 'Night wakes use the same loop', 'Feed if it’s time for a feed.']])
      + note('Safe sleep, every time:', 'On {p} back, in {p} own bare crib.', 'crib', 'is-safe') + foot('Some babies move faster, some more slowly.')),
    'd:method:1': () => page('Sleep training', 'The chair method', 'Stay close at first, then move toward the door over a few nights.',
      vis('Watch where you move', 'From crib toward door', photos([['chair-1.jpg', 'Nights 1–3', 'Right by the crib'], ['chair-2.jpg', 'Nights 4–6', 'Halfway to the door'], ['chair-3.jpg', 'Nights 7–9', 'In the doorway'], ['crib.jpg', 'Then', 'Goodnight from outside']]))
      + mglance([['Crying', 'Some'], ['You', 'Nearby'], ['Usually takes', '1–2 weeks']])
      + rows('What you do each night', [['heart', 'Sit quietly in that night’s spot', 'Comfort with your voice or a pat, less each night.'], ['moon', 'If {s} wakes', 'Go back to the same spot. Feed if it’s time for a feed.'], ['clock', 'Move when {s} settles easily', 'Stay longer at a spot if {s} needs it.']])
      + note('The idea:', '{S} learns to fall asleep with you nearby, then with you farther away.') + foot('Some babies move faster, some more slowly.')),
    'd:method:0': () => page('Sleep training', 'Timed check-ins', 'Say goodnight and step out. Come back for short check-ins, waiting longer each time.',
      vis('See the check-in rhythm', 'Example', `<div class="sv2-inner is-top"><i>${art('crib')}</i><p><b>${F('Goodnight')}</b> ${F('Down awake after your routine, then leave.')}</p></div>
        <div class="sv2-waits">${[3, 5, 10].map((n, i) => `<div class="is-${i}"><b>${n}</b><small>${F('min wait')}</small></div>`).join(`<span>↪<small>${F('check')}</small></span>`)}</div>
        <p class="sv2-cap is-loop">↻ ${F('Keep the longest wait if crying continues')}</p>
        <div class="sv2-inner"><i>${art('heart')}</i><p><b>${F('During a check (1–2 min):')}</b> ${F('Talk softly or pat, then leave while {s}’s still awake.')}</p></div>`)
      + mglance([['Crying', 'More'], ['You', 'In and out'], ['Usually takes', '1–2 weeks']])
      + rows('What happens next', [['', 'If {s} settles', 'Stop checking. Let {o} sleep.'], ['', 'If {s} wakes later', 'Feed if it’s time for a feed; otherwise the same check-ins.'], ['', 'Over the next nights', 'Start each wait a few minutes longer than the night before.']], true)
      + note('Do check-ins wind {o} up?', 'Try longer gaps, or another method.', 'heart') + foot('3, 5 and 10 minutes are an example, not required times. Keep meeting feeding and comfort needs.')),
    // Nov 23 (round 3): cry it out on the same layout as the other four methods, so parents can compare them side by side.
    'd:method:3': () => page('Sleep training', 'Cry it out', 'Say goodnight, then leave the room until morning.',
      vis('See how a night goes', 'Example', `<div class="sv2-inner is-top"><i>${art('crib')}</i><p><b>${F('Goodnight')}</b> ${F('Your usual routine, then down awake. Leave the room.')}</p></div>
        <div class="sv2-inner"><i>${art('moon')}</i><p><b>${F('If {s} cries')}</b> ${F('Stay out until morning, unless it’s a planned feed or {s} seems unwell.')}</p></div>`)
      + mglance([['Crying', 'The most'], ['You', 'Outside'], ['Usually takes', 'A few nights']])
      + rows('What to expect', [['', 'The first nights', 'Crying can last a while.'], ['', 'By night 3 or 4', 'Most babies cry much less and fall asleep faster.']], true)
      + note('Want to stay closer?', 'Timed check-ins or the chair method go more slowly, with you nearby.', 'heart') + foot('Some babies move faster, some more slowly.'))
  };

  const prev = window.changesRoute;
  window.changesRoute = function (p) {
    const k = /^chg:Sleep:(.+)$/.exec(p || ''); const r = k && P[k[1]];
    if (r) { try { return r(); } catch (e) { console.error(e); } }
    return prev.apply(this, arguments);
  };
  window.SLEEP_V2 = P;
})();
