/* Ahead · Timeline reimagined: the year as a path with the baby on it, the next few big changes as the bigger steps,
   and a read-ahead page per change that says when, the signs it's close, and everything it changes (each row
   opens the page that already covers it). Preview: two change pages (crawling, solids). */
(function () {
  const H = () => window.__hub, F = s => H().F(s);
  const MONTH = 30.4375 * 864e5;
  const ageNow = () => { const from = profile.early && profile.due ? parse(profile.due) : parse(profile.dob); return (NOW - from) / MONTH; };
  const C = [
    ['crying', 0.5, 4, 'Sleep', 'heart', 'The crying peak', 'Fussy evenings, at their worst around 6–8 weeks', "__GO__", '2 weeks–4 months'],
    ['smile', 1.5, 2, 'Development', 'smile', 'First smiles', 'Maya starts smiling back when you smile', "__GO__"],
    ['nights', 1.5, 4, 'Sleep', 'moon', 'Longer nights', 'One longer sleep at night, often 4–5 hours', "__GO__"],
    ['regress', 3, 5, 'Sleep', 'moon', 'The sleep regression', 'More night waking, for a few weeks', "__GO__"],
    ['roll', 4, 6, 'Development', 'roll', 'Rolling', 'Clear the floor, and never leave {o} on a bed or sofa', "__GO__", 'Usually 4–6 months'],
    ['ready', 4, 6, 'Feeding', 'highchair', 'Ready for solids', 'Watching for the signs, and choosing how to start', "__GO__", '4–6 months'],
    ['solids', 6, 6.5, 'Feeding', 'bowl', 'First foods', 'Food alongside milk, a few bites at first', "__GO__", 'Around 6 months'],
    ['twonaps', 6, 9, 'Sleep', 'sun', 'Three naps become two', 'Two naps a day, and an earlier bedtime', "__GO__"],
    ['crawl', 6, 10, 'Development', 'crawl', 'Crawling', 'Maya can get around, so babyproof first', "__GO__"],
    ['sit', 6, 9, 'Development', 'sit', 'Sitting up', 'Maya sits up without your help', "__GO__"],
    ['tooth', 6, 12, 'Daily rhythm', 'tooth', 'The first tooth', 'Time to start brushing', "__GO__"],
    ['finger', 7, 9, 'Feeding', 'bowl', 'Thicker textures', 'Lumpier food, and pieces to pick up', "__GO__"],
    ['meals', 9, 10, 'Feeding', 'plate', 'Three meals a day', 'Soft pieces of family food, three times a day', "__GO__", 'Around 9 months'],
    ['carseat', 9, 12, 'Out and about', 'car', 'Outgrowing the infant car seat', 'Most outgrow the infant seat by height', "__GO__", 'When {p} head nears the top of the seat'],
    ['sep', 8, 10, 'Development', 'heart', 'Separation anxiety', 'Goodbyes and bedtime can get harder', "__GO__"],
    ['pull', 9, 12, 'Development', 'stand', 'Pulling up to stand', 'Maya stands holding furniture, so anchor it', "__GO__"],
    ['words', 10, 14, 'Development', 'chat', 'First words', 'Often “mama” or “dada” for a parent', "__GO__"],
    ['milk', 12, 12.5, 'Feeding', 'cup', 'Switching to whole milk', 'Whole milk from a cup can replace formula', "__GO__", 'At 12 months'],
    ['steps', 12, 15, 'Development', 'stand', 'First steps', 'Walking holding on, then on {p} own', "__GO__"]
  ].map(([id, start, end, cat, icon, title, why, go, range]) => ({ id, start, end, cat, icon, title, why, go: ({ ready: "openPage('chg:Feeding:mock:dirD:2')", meals: "openPage('chg:Feeding:mock:dirD:4')" })[id] || `openPage('chg:Timeline:c:${id}')`, range: range || `${start}–${end} months` }));
  const CHECKUPS = [1, 2, 4, 6, 9, 12];   // the same well visits Health shows (after the first-week visit)
  // One line per checkup, the same as Health's checkups list.
  const CHECK_LINE = { 1: 'Growth, feeding and how you’re doing', 2: 'The first main round of vaccines', 4: 'Movement, feeding and sleep questions, and vaccines', 6: 'First foods and teeth, and vaccines', 9: 'A development check, growth and catch-up vaccines', 12: 'Anemia and lead checks, milk and cups, and vaccines' };
  const TOUCH = {
    smile: 'More face-to-face time, and play starts to feel like a conversation.',
    nights: 'A longer stretch at night, and a good time to start a bedtime routine.',
    regress: 'More night waking for a few weeks, so protect your own rest too.',
    roll: 'Beds and sofas are off-limits, and the floor needs clearing.',
    sit: 'The crib mattress goes lower, and the bouncer’s days are numbered.',
    twonaps: 'Bedtime moves earlier, and there’s more time for outings between naps.',
    tooth: 'Brushing starts, and sore gums can mean fussier days.',
    crawl: 'Every room opens up: time to babyproof, lower the crib mattress and make floor time.',
    solids: 'A high chair, choking first aid, and a new rhythm to your days.',
    finger: 'Messier meals, new food shapes, and knowing gagging from choking.',
    sep: 'Harder goodbyes, night waking, and a gentler start with caregivers.',
    pull: 'Furniture gets strapped to the wall, and the crib mattress goes to its lowest.',
    words: 'More talking, reading and naming things together.',
    milk: 'Cow’s milk from a cup, and the bottle starts to go.',
    carseat: 'A new car seat, still facing the back.',
    steps: 'Everything higher is in reach, and more time on {p} feet.',
    onenap: 'One long midday nap, and a new shape to your days.'
  };
  const AREA = { Development: 'Play', Feeding: 'Feeding', Sleep: 'Sleep', Health: 'Health', Safety: 'Safety', 'Daily rhythm': 'Everyday care', 'Out and about': 'Outings', Childcare: 'Childcare' };
  const touches = c => { const p = PAGES[c.id]; return p ? [...new Set(p.rows.map(r => r[1]))] : []; };
  const touchPills = c => { const t = touches(c); return t.length > 1 ? `<span class="ya-touch">${t.map(cat => `<span class="ya-touch-pill" style="${yearTheme(cat)}">${typeof catIcon === 'function' ? catIcon(cat) : ''}${F(AREA[cat] || cat)}</span>`).join('')}</span>` : ''; };
  const range = c => c.range.replace(/^(\d+(\.5)?)–/, (m, a) => `${Math.floor(+a)}–`);
  const soon = (c, a) => c.start <= a ? 'Could happen any time now' : c.start <= a + 1 ? 'Could start any week now' : `In about ${Math.round(c.start - a)} month${Math.round(c.start - a) === 1 ? '' : 's'}`;

  // The baby's reported changes, so a change they've already told us about drops behind them.
  const doneNow = () => { const an = typeof answers !== 'undefined' ? answers : {};
    // Stages the baby is already past (from the category pages) count as behind too, so the Timeline agrees with them.
    const st = cat => { try { return chgStageIndex(cat); } catch (e) { return -1; } }, sl = st('Sleep'), fg = (() => { try { return feedGroup(st('Feeding')); } catch (e) { return -1; } })();
    const own = (() => { try { return (journeyData().records || []).filter(r => r.type === 'milestone').map(r => String(r.title || '').toLowerCase()).join(' | '); } catch (e) { return ''; } })(), saw = re => re.test(own);
    return { smile: saw(/smil/), sit: saw(/\bsat\b|sits|sitting/), words: saw(/word|mama|dada/), steps: saw(/step|walk/), roll: saw(/roll/) || (typeof rolled === 'function' && rolled()) || an.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(an.rollDirection), solids: an.solids === 'Yes' || fg >= 3, ready: fg >= 3, meals: fg >= 4, finger: fg >= 4, crawl: an.crawl === 'Yes' || saw(/crawl/), pull: an.pullUp === 'Yes' || saw(/pull|stand/), tooth: an.hasTooth === 'Yes' || saw(/tooth/), twonaps: an.twoNaps === 'Yes' || sl >= 3, nights: sl >= 2 }; };
  const ageLabel = a => { const m = Math.floor(a), w = Math.floor((a - m) * 4.35); return m === 0 ? `${Math.max(1, w)} week${w === 1 ? '' : 's'}` : `${m} month${m === 1 ? '' : 's'}${w ? `, ${w} week${w === 1 ? '' : 's'}` : ''}`; };
  const whenShort = (c, a) => c.id === 'crying' && a >= 2 ? 'easing now' : c.id === 'crawl' && c.end - a <= 1 ? 'some babies skip it' : c.start <= a ? 'any time now' : c.start <= a + 1 ? 'any week now' : `in about ${Math.round(c.start - a)} month${Math.round(c.start - a) === 1 ? '' : 's'}`;
  // A small bar under each next change: its usual window, and where the baby is today.
  const windowBar = (c, a) => { const p = PAGES[c.id]; if (!p) return ''; const [from, to, zs, ze] = p.bar, pct = v => Math.max(0, Math.min(100, (v - from) / (to - from) * 100)); return `<span class="ya-bar" aria-hidden="true"><i style="left:${pct(zs)}%;width:${pct(ze) - pct(zs)}%"></i>${a >= from && a <= to ? `<u style="left:${pct(a)}%"></u>` : ''}</span>`; };
  // Home uses this to open a change's page only while the change is still ahead.
  window.timelineChangeLive = id => { const c = C.find(x => x.id === id); return !!(c && PAGES[id] && c.end > ageNow() && !doneNow()[id]); };

  /* Timeline as a path (Nov 7): no cards on top. The path starts at the baby's spot, the next three changes are
     the bigger steps right after it, then each month to the first birthday with its smaller changes and checkups.
     Changes behind the baby fold into one quiet line above. Every change opens its read-ahead page. */
  window.nextPage = function () {
    const a = ageNow(), nm = name(), done = doneNow();
    // Born early, with Development on birthday age: its rows sit by birthday age (shifted onto this adjusted-age path).
    // Safety has its own switch, so its rows shift the same way when it follows the birthday.
    const bday = g => !!(profile.early && profile.due) && typeof hubAgeFor === 'function' && hubAgeFor(g, actualMonth()) === actualMonth() && hubAgeFor('care', actualMonth()) !== actualMonth();
    const gap0 = profile.early && profile.due ? Math.max(0, (parse(profile.due) - parse(profile.dob)) / MONTH) : 0;
    const shiftFor = cat => (cat === 'Development' && bday('dev')) || (cat === 'Safety' && bday('safety')) ? gap0 : 0;
    const CC = C.map(c => shiftFor(c.cat) ? Object.assign({}, c, { start: c.start - shiftFor(c.cat), end: c.end - shiftFor(c.cat) }) : c);
    const ahead = CC.filter(c => c.end > a && !done[c.id]).sort((x, y) => x.start - y.start || x.end - y.end), next = ahead.slice(0, 3), later = ahead.slice(3);
    const behind = CC.filter(c => c.end <= a || done[c.id]).sort((x, y) => x.start - y.start || x.end - y.end);
    // Ages here follow adjusted age for a baby born early, so dates count from the due date to match.
    // Checkups follow the birthday, so each sits at the adjusted month it falls in.
    const early = !!(profile.early && profile.due), born = parse(early ? profile.due : profile.dob), gap = early ? Math.max(0, (parse(profile.due) - parse(profile.dob)) / MONTH) : 0;
    const monthDate = m => { const d = new Date(born); d.setMonth(d.getMonth() + m); return d.toLocaleDateString('en-US', { month: 'long' }); };
    const label = m => m >= 12 ? '1 year' : m === 1 ? '1 month' : `${m} months`;
    const node = '<span class="ya-node" aria-hidden="true"></span>', chev = '<span class="hub-chev" aria-hidden="true">›</span>';
    let h = `<div class="ya-page ya-pathpage"><div class="eyebrow ya-eyebrow">${F(`${nm}’s year ahead`)}</div><h1>${F('Timeline')}</h1><p class="next-lead">${F(`Where ${nm} is now, and the big changes ahead. Tap any to read ahead.`)}${early ? ' ' + F(bday('dev') || bday('safety') ? `Feeding, sleep and care follow ${nm}’s adjusted age. ${bday('dev') && bday('safety') ? 'Development, safety' : bday('dev') ? 'Development' : 'Safety'} and checkups follow {p} birthday.` : `The ages follow ${nm}’s adjusted age. Checkups follow {p} birthday.`) : ''}</p><ol class="ya-path">`;
    if (behind.length) h += `<li class="ya-behind">${node}<button onclick="this.parentNode.classList.toggle('is-open')" aria-expanded="false">${F(`Earlier on (${behind.length})`)} <span aria-hidden="true">›</span></button><div class="ya-behind-list">${behind.map(c => `<button style="${yearTheme(c.cat)}" onclick="${c.go}"><span>${hubArt(c.icon, c.cat)}</span>${F(c.title)}</button>`).join('')}</div></li>`;
    h += `<li class="ya-here">${node}<b>${F(`${nm} now`)}</b><small>${F(early ? ageLabel(a) + ' adjusted' : (typeof babyAge === 'function' ? babyAge() : ageLabel(a)))}</small></li>`;
    h += '%%DUENOW%%';
    h += next.map(c => `<li class="ya-row is-next" style="${yearTheme(c.cat)}">${node}<button onclick="${c.go}"><span class="ya-row-art">${hubArt(c.icon, c.cat)}</span><span class="ya-row-copy"><small class="ya-when">${F(range(c))} · ${F(whenShort(c, a))}</small><b>${F(c.title)}</b><span class="ya-why">${F(c.id === 'crying' && a >= 2 ? 'Past the worst. Fussy evenings ease over the next few weeks' : c.why)}</span>${windowBar(c, a + shiftFor(c.cat))}</span>${chev}</button></li>`).join('');
    const months = {}; later.forEach(c => { const m = Math.min(12, Math.max(Math.ceil(a), Math.floor(c.start))); (months[m] = months[m] || []).push(c); });
    const bm = early ? Math.min(12, Math.max(Math.ceil(a), Math.round(12 - gap))) : null; if (early && 12 > a + gap) months[bm] = months[bm] || [];
    // A checkup due now (within about 3 weeks) and not marked done stays on the path, beside "now".
    const attended = v => { try { const r = healthRecord(v); return r && r.status === 'attended'; } catch (e) { return false; } };
    const checks = {}, dueNow = [];
    CHECKUPS.filter(v => (v > a + gap || (v > a + gap - 0.75)) && !attended(v)).forEach(v => {
      // Due now (on or before today's age): it sits with "now", not under next month.
      if (v - gap <= a + 0.25) { dueNow.push(v); return; }
      const m = Math.min(12, Math.max(Math.ceil(a), Math.round(v - gap))); (checks[m] = checks[m] || []).push(v); months[m] = months[m] || []; });
    const checkRow = (v, sub) => `<li class="ya-row" style="${yearTheme('Health')}">${node}<button onclick="openPage('health-visit:${v}')"><span class="ya-row-art">${hubArt('steth', 'Health')}</span><span class="ya-row-copy"><b>${F(`${v}-month checkup`)}</b><small>${F(sub)}</small></span>${chev}</button></li>`;
    Object.keys(months).map(Number).sort((x, y) => x - y).forEach(m => {
      // Born early: the headings follow adjusted age, so show the month only; "4 months" over a "6-month checkup" reads as a contradiction.
      // A heading for the month we're in would just repeat "[name] now", so its rows follow on without one.
      const thisMonth = (() => { const d = new Date(born); d.setMonth(d.getMonth() + m); return d.getFullYear() === NOW.getFullYear() && d.getMonth() === NOW.getMonth(); })();
      if (!thisMonth) h += early ? `<li class="ya-pin">${node}<b>${F('Around ' + monthDate(m))}</b></li>` : `<li class="ya-pin">${node}<b>${F(label(m))}</b> · ${F('around ' + monthDate(m))}</li>`;
      h += months[m].map(c => `<li class="ya-row" style="${yearTheme(c.cat)}">${node}<button onclick="${c.go}"><span class="ya-row-art">${hubArt(c.icon, c.cat)}</span><span class="ya-row-copy"><b>${F(c.title)}</b><small>${F(range(c))}</small></span>${chev}</button></li>`).join('');
      h += (checks[m] || []).map(v => checkRow(v, gap ? 'By birthday age · ' + CHECK_LINE[v].charAt(0).toLowerCase() + CHECK_LINE[v].slice(1) : CHECK_LINE[v])).join('');
      if (early && m === bm && 12 > a + gap) h += `<li class="ya-pin">${node}<b>${F('First birthday')}</b></li>`;
    });
    // Nov 14 (Yarden): once the first year is nearly done, a calm look past it instead of a dead end. No links: Ahead covers year one.
    const after = a >= 8 ? `<section class="hub-card ya-after"><b class="hub-card-label">${F('After the first birthday')}</b><p class="hub-card-text">${F('Ahead covers the first year. Here’s what usually comes next.')}</p><ul class="ya-after-list">${[['One nap a day', 'Usually between 12 and 18 months'], ['More words, and pointing to show you', 'Often by 15–18 months'], ['The 15-month checkup', 'With a few more vaccines'], ['Goodbye to bottles', 'Cups only by about 18 months']].map(([t, w]) => `<li><b>${F(t)}</b><small>${F(w)}</small></li>`).join('')}</ul></section>` : '';
    h += `<li class="ya-pin ya-end">${node}<b>${F(early ? 'A year, by adjusted age' : 'First birthday')}</b></li></ol>${after}<p class="hub-foot">${F('Ages are typical. Every baby moves at their own pace.')}</p></div>`;
    h = h.replace('%%DUENOW%%', dueNow.map(v => checkRow(v, 'Due now · ' + (gap ? 'by birthday age · ' : '') + CHECK_LINE[v].charAt(0).toLowerCase() + CHECK_LINE[v].slice(1))).join(''));
    return h;
  };

  /* Timeline (Nov 15): the year as four chapters you open and close. Closed, a chapter is one calm header; open, its
     stops run down a trail on the left, one card each, in time order: what's behind her is quiet, "Maya is here" marks
     today, the next change is outlined. Today's chapter starts open; opening another closes it. Each card opens its page. */
  const ROAD = [[0, 3, 'Birth–2 months', 'First smiles & settling in', 3, '#fbe8dc', '#c98d6f'], [3, 6, '3–5 months', 'Rolling & changing sleep', 4, '#ece4f6', '#8f7bc4'],
    [6, 9, '6–8 months', 'First foods & sitting up', 6, '#e6efdd', '#5f8c55'], [9, 13, '9–12 months', 'Standing & first words', 10, '#e3e9f5', '#5d74a6']];
  const listPage = window.nextPage;
  window.nextPage = function () {
    if (typeof window.stToy !== 'function') return listPage();
    const a = ageNow(), nm = name(), done = doneNow();
    const bday = g => !!(profile.early && profile.due) && typeof hubAgeFor === 'function' && hubAgeFor(g, actualMonth()) === actualMonth() && hubAgeFor('care', actualMonth()) !== actualMonth();
    const gap = profile.early && profile.due ? Math.max(0, (parse(profile.due) - parse(profile.dob)) / MONTH) : 0;
    const shiftFor = cat => (cat === 'Development' && bday('dev')) || (cat === 'Safety' && bday('safety')) ? gap : 0;
    // Timeline keeps big moments and changes to prepare for; feeding steps (readiness, textures, meals) live in Feeding.
    const CC = C.filter(c => !['ready', 'finger', 'meals'].includes(c.id)).map(c => shiftFor(c.cat) ? Object.assign({}, c, { start: c.start - shiftFor(c.cat), end: c.end - shiftFor(c.cat) }) : c);
    const attended = v => { try { const r = healthRecord(v); return r && r.status === 'attended'; } catch (e) { return false; } };
    const nextId = (CC.filter(c => !(c.end <= a || done[c.id] || (c.id === 'tooth' && a >= 8))).sort((x, y) => x.start - y.start || x.end - y.end)[0] || {}).id;
    const here = Math.max(0, ROAD.findIndex(r => a >= r[0] && a < r[1]));
    const born = parse(profile.early && profile.due ? profile.due : profile.dob);
    const mon = m => { const d = new Date(born); d.setMonth(d.getMonth() + m); return d.toLocaleDateString('en-US', { month: 'short' }); };
    const chev = '<span class="hub-chev" aria-hidden="true">›</span>';
    let out = '';
    const foldPref = (() => { try { return JSON.parse(localStorage.getItem('ahead-yt-fold') || '{}'); } catch (e) { return {}; } })();
    ROAD.forEach(([from, to, ages, title, toy, bg, ink], i) => {
      const its = CC.filter(c => c.start >= from && c.start < to).map(c => ({ m: c.start, c })).concat(CHECKUPS.filter(v => v - gap >= from && v - gap < to).map(v => ({ m: v - gap, v }))).sort((x, y) => x.m - y.m);
      const passed = s => s.v != null ? attended(s.v) || s.m < a - 0.5 : done[s.c.id] || s.c.end <= a;
      // In today's chapter, what's behind her comes first, then "Maya is here", then what's ahead (in time order).
      if (i === here) its.sort((x, y) => passed(y) - passed(x) || x.m - y.m);
      let body = '', placed = i !== here;
      const nOld = 0;
      if (nOld) body += `<li class="yt-oldbtn"><i class="yt-dot"></i><button onclick="ytOld(this)">✓ ${nOld} ${F(nOld === 1 ? 'thing' : 'things')} ${F('behind {o}')}<span>${F('Show')}</span></button></li>`;
      its.forEach(s => {
        if (!placed && !passed(s)) { body += `<li class="yt-me"><i class="yt-dot"></i><span>${F(`${nm} is here`)}<small>${F(typeof babyAge === 'function' ? babyAge() : '')}</small></span></li>`; placed = true; }
        const pd = passed(s);
        if (s.v != null) body += `<li class="yt-stop${pd ? ' is-done' : ''}"><i class="yt-dot"></i><button onclick="openPage('health-visit:${s.v}')"><span class="yt-c"><small>${F(`${s.v} month${s.v === 1 ? '' : 's'}`)}</small><b>${F(`${s.v}-month checkup`)}</b></span>${pd ? '<i class="yt-tick">✓</i>' : chev}</button></li>`;
        else { const c = s.c, nx = c.id === nextId;
          body += `<li class="yt-stop${pd ? ' is-done' : ''}${nx ? ' is-next' : ''}"><i class="yt-dot"></i><button onclick="${c.go}"><span class="yt-c"><small>${F(range(c))}${nx ? ` · ${F(whenShort(c, a))}` : ''}</small><b>${F(c.title)}</b>${nx ? `<span>${F(c.id === 'crying' && a >= 2 ? 'Past the worst. Fussy evenings ease over the next few weeks' : c.why)}</span>` : ''}</span>${done[c.id] ? '<i class="yt-tick">✓</i>' : chev}</button></li>`; }
      });
      if (!placed) body += `<li class="yt-me"><i class="yt-dot"></i><span>${F(`${nm} is here`)}<small>${F(typeof babyAge === 'function' ? babyAge() : '')}</small></span></li>`;
      const SH = { crying: 'crying peak', smile: 'first smiles', nights: 'longer nights', regress: 'sleep regression', roll: 'rolling', ready: 'solids prep', solids: 'first foods', twonaps: 'two naps', crawl: 'crawling', sit: 'sitting up', tooth: 'first tooth', finger: 'textures', meals: 'three meals', carseat: 'car seat', sep: 'separation', pull: 'pulling up', words: 'first words', milk: 'whole milk', steps: 'first steps' };
      const ahead = its.filter(s => !passed(s)), nameOf = s => s.v != null ? `${s.v}-month checkup` : SH[s.c.id] || s.c.title;
      const preview = to <= a ? F(`All behind ${'{o}'} ✓`) : ahead.length ? F(`${ahead.length} ahead · ${ahead.slice(0, 3).map(nameOf).join(', ')}${ahead.length > 3 ? '…' : ''}`) : '';
      out += (false ? `<button class="yt-earlier" onclick="ytEarlier(this)"><i class="yt-dot"></i><span>✓ ${F(`${ROAD[0][2].split('–')[0]}–${ROAD[here - 1][2].split('–')[1]} · ${here} ${here === 1 ? 'chapter' : 'chapters'} behind {o}`)}</span><b>${F('Show')}</b></button>` : '') + `<section class="yt-ch is-open yt-road yt-sticky${i === here ? ' is-here' : ''}${to <= a ? ' is-past' : ''}${(foldPref[i] != null ? foldPref[i] : to <= a) ? ' is-fold' : ''}" data-i="${i}" style="${typeof window.monthTheme === 'function' ? window.monthTheme(from + 1) : ''};--yt:${bg};--yti:${ink};--ytp:${(ROAD[i - 1] || ROAD[i])[5]};--ytn:${(ROAD[i + 1] || ROAD[i])[5]}">
        <button class="yt-head" onclick="ytTap(this.parentNode)" aria-expanded="${!(foldPref[i] != null ? foldPref[i] : to <= a)}"><span class="yt-hc">${to <= a ? '' : `<span class="yt-rel${i === here ? ' is-now' : ''}">${F(i === here ? 'Now' : i === here + 1 ? `Next · in about ${Math.max(1, Math.round(from - a))} month${Math.max(1, Math.round(from - a)) === 1 ? '' : 's'}` : 'Later')}</span>`}<small>${F(ages)} · ${mon(from)}–${mon(Math.min(to, 12) - 1)}</small><b>${F(title)}</b><span class="yt-prev">${preview}</span></span><i class="yt-caret" aria-hidden="true">›</i></button>
        <div class="yt-body"><ol class="yt-list">${body}</ol></div></section>`;
    });
    return `<div class="ya-page yt-page"><h1 class="yt-h1">${F(`${nm}’s first year`)}</h1><p class="yt-lead">${F(`${nm} is ${typeof babyAge === 'function' ? babyAge() : ''}${a < 12 ? ` · ${Math.max(1, Math.round(12 - a))} month${Math.round(12 - a) === 1 ? '' : 's'} to {p} first birthday` : ''}`)}</p><div class="yt-map"><svg class="yt-trail" aria-hidden="true"><path class="t1"/><path class="t2"/></svg>${out}<div class="yt-end"><i class="yt-dot"></i><span class="yt-endc"><small>${F('The destination')} · ${mon(12)}</small><b>${F('One whole year!')}</b></span><span class="yt-endcake" aria-hidden="true">${window.stToy('cake')}</span></div></div><p class="hub-foot">${F('Ages are typical. Every baby moves at their own pace.')}</p><button class="yt-back" onclick="ytBack()" aria-label="${F(`Back to ${nm}`)}"><i>↑</i> ${F(`Back to ${nm}`)}</button></div>` + (setTimeout(() => { window.ytTrail && window.ytTrail(); window.ytCenter && window.ytCenter(); }, 0), '');
  };
  /* Nov 16 · two familiar patterns to compare (preview only, switch at the top):
     Tracker: like an order tracker. One line of steps in order; ticked behind her, a filled line up to today, grey ahead.
     Feed: the original Timeline with month headers that stay pinned at the top as you scroll (like a calendar's schedule view). */
  const chapterTL = window.nextPage;
  const tlMode = () => { try { return localStorage.getItem('ahead-tl-try') || 'tracker'; } catch (e) { return 'tracker'; } };
  window.tlTry = m => { try { localStorage.setItem('ahead-tl-try', m); } catch (e) {} navigate('next'); };
  const tlSwitch = m => `<div class="tl-try" role="group" aria-label="Preview: pick a Timeline style"><small>Preview</small>${[['tracker', 'Tracker'], ['feed', 'Feed']].map(([k, l]) => `<button class="${m === k ? 'is-on' : ''}" onclick="tlTry('${k}')" aria-pressed="${m === k}">${l}</button>`).join('')}</div>`;
  window.nextPage = function () {
    if (typeof window.stToy !== 'function') return chapterTL();
    const m = tlMode(), nm = name(), a = ageNow();
    const cake = `<span class="tl-cake" aria-hidden="true">${window.stToy('cake')}</span>`;
    if (m === 'feed') {
      return listPage().replace('ya-page ya-pathpage', 'ya-page ya-pathpage tl-feed').replace('<div class="eyebrow', tlSwitch(m) + '<div class="eyebrow')
        .replace(/(<li class="ya-pin ya-end">[\s\S]*?<\/b>)/, `$1${cake}`);
    }
    // Tracker. Drag Maya along the bar to see any age: the headline, colors and list follow her; "Back to today" snaps her home.
    const done = doneNow();
    const bday = g => !!(profile.early && profile.due) && typeof hubAgeFor === 'function' && hubAgeFor(g, actualMonth()) === actualMonth() && hubAgeFor('care', actualMonth()) !== actualMonth();
    const gap = profile.early && profile.due ? Math.max(0, (parse(profile.due) - parse(profile.dob)) / MONTH) : 0;
    const shiftFor = cat => (cat === 'Development' && bday('dev')) || (cat === 'Safety' && bday('safety')) ? gap : 0;
    const CC = C.filter(c => !['ready', 'finger', 'meals'].includes(c.id)).map(c => shiftFor(c.cat) ? Object.assign({}, c, { start: c.start - shiftFor(c.cat), end: c.end - shiftFor(c.cat) }) : c);
    const attended = v => { try { const r = healthRecord(v); return r && r.status === 'attended'; } catch (e) { return false; } };
    const all = CC.map(c => ({ m: c.start, c })).concat(CHECKUPS.map(v => ({ m: v - gap, v }))).sort((x, y) => x.m - y.m || (x.c && y.c ? x.c.end - y.c.end : 0));
    // What she's told us only counts from today on; looking back, it's by age alone.
    const st = (s, x) => s.v != null ? ((x >= a && attended(s.v)) || s.m < x - 0.75 ? 'done' : s.m <= x + 0.25 ? 'now' : 'next') : ((x >= a && done[s.c.id]) || s.c.end <= x ? 'done' : s.c.start <= x + 0.25 ? 'now' : 'next');
    const title = s => s.v != null ? `${s.v}-month checkup` : s.c.title;
    const when = s => s.v != null ? `${s.v} mo` : (/month|week/.test(range(s.c)) ? range(s.c).replace(/^Usually |^Around |^At /, '').replace(' months', ' mo').replace(' month', ' mo') : `${s.c.start}–${s.c.end} mo`);
    const go = s => s.v != null ? `openPage('health-visit:${s.v}')` : s.c.go;
    const ageTxt = x => x < 1 ? `${Math.max(1, Math.round(x * 4.35))} weeks` : x >= 11.9 ? '1 year' : `${Math.floor(x)} month${Math.floor(x) === 1 ? '' : 's'}`;
    const isToday = x => Math.abs(x - a) < 0.13;
    // Timeline schedules: each row is what, when, and (only when there's something to do) how to prepare. No line repeats its title.
    const PREP = { crying: 'Plan for fussier evenings', smile: 'Face-to-face time is the best play now', nights: 'A good time to start a bedtime routine', regress: 'Line up extra night help if you can', roll: 'Keep {o} off beds and sofas', solids: 'Get a high chair', sit: 'Lower the crib mattress', twonaps: 'Bedtime may need to move earlier', crawl: 'Babyproof the floor first', tooth: 'Start brushing', sep: 'Practice short, upbeat goodbyes', pull: 'Anchor furniture to the wall', carseat: 'Check {p} height against the seat', words: 'Name things as you go about your day', milk: 'Offer it in a cup, 16–24 oz a day', steps: 'Barefoot is best indoors' };
    const bornD = parse(profile.early && profile.due ? profile.due : profile.dob);
    const calMon = mm => new Date(bornD.getTime() + mm * MONTH).toLocaleDateString('en-US', { month: 'long' });
    const longWhen = s => when(s).replace(/ mo$/, ' months').replace(/^(\d+) months$/, (q, n) => n === '1' ? '1 month' : q);
    // Nov 17 · "Around now", then the months ahead. Every change has one permanent home: its typical month.
    // Before that month it waits in the timeline; from that month until its window closes (and unless recorded) it's
    // in "Around now"; after that it's Earlier. So at any moment it appears exactly once.
    const HOME = { crying: 1.5, smile: 1.5, nights: 3, regress: 4, roll: 5, solids: 6, twonaps: 7, sit: 7, tooth: 7, crawl: 8, sep: 9, carseat: 10, pull: 10, words: 12, milk: 12, steps: 12 };
    const homeOf = s => s.v != null ? s.v - gap : (HOME[s.c.id] != null ? HOME[s.c.id] - shiftFor(s.c.cat) : s.c.start);
    try { const mo0 = Math.max(0, Math.min(11, Math.floor(a))); if (typeof window.monthColor === 'function') YEAR_PALETTES.__tl = { ink: window.monthColor(mo0, .45, 30), bg: window.monthColor(mo0, .88), pale: window.monthColor(mo0, .94), accent: window.monthColor(mo0, .6) }; } catch (e) {}
    const icon = n => hubArt(n, typeof YEAR_PALETTES !== 'undefined' && YEAR_PALETTES.__tl ? '__tl' : 'Development');
    const shortRange = s => longWhen(s).replace(/^Usually |^Around |^At /, '');
    const listHTML = x => {
      const where = s => {
        if (s.v != null) return (x >= a && attended(s.v)) || s.m < x - 0.75 ? 'earlier' : s.m <= x + 0.25 ? 'now' : 'ahead';
        if ((x >= a && done[s.c.id]) || s.c.end <= x) return 'earlier';
        return homeOf(s) <= x + 0.25 ? 'now' : 'ahead';
      };
      const TIP = { crying: x >= 2 ? 'Past the worst now' : 'Plan for fussy evenings', smile: 'Lots of face time', nights: 'Start a bedtime routine', regress: 'Line up night help', roll: 'Keep {o} off beds and sofas', solids: 'Get a high chair', twonaps: 'Move bedtime earlier', sit: 'Lower the crib mattress', crawl: 'Babyproof first', tooth: 'Start brushing', sep: 'Keep goodbyes short', pull: 'Anchor furniture', carseat: 'Check its height limit', words: 'Name things all day', milk: 'Offer it in a cup', steps: 'Barefoot indoors' };
      const line = s => s.v != null ? (where(s) === 'now' ? 'Due now · Book it if you haven’t' : 'Book it a few weeks ahead') : where(s) === 'now' ? `${shortRange(s)}${TIP[s.c.id] ? ' · ' + TIP[s.c.id] : ''}` : `Usually ${shortRange(s)}`;
      const catOf = s => s.v != null ? 'Health' : s.c.cat;
      const tile = s => `<span class="tl-ic" style="${yearTheme(catOf(s))}">${hubArt(s.v != null ? 'steth' : s.c.icon, catOf(s))}</span>`;
      const row = s => `<li class="tl-gr"><button onclick="${go(s)}">${tile(s)}<span class="tl-t"><b>${F(title(s))}</b><small>${F(line(s))}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></li>`;
      const now = all.filter(s => where(s) === 'now').sort((p, q) => (q.v != null) - (p.v != null) || homeOf(q) - homeOf(p));
      const ahead = all.filter(s => where(s) === 'ahead'), earlier = all.filter(s => where(s) === 'earlier');
      let h = `<li class="tl-soon"><h2 class="tl-h2">${F('Around now')}</h2><p class="tl-intro">${F(`Little leaps around ${isToday(x) && typeof babyAge === 'function' ? babyAge() : ageTxt(x)}. Every baby moves at {p} own pace.`)}</p>`;
      h += now.length ? `<ol class="tl-gcard">${now.map(row).join('')}</ol>` : `<p class="tl-quiet">${F(x < 1 ? 'Your first weeks together. Here’s what’s coming first.' : 'A calm stretch. Here’s what’s next.')}</p>`;
      h += `</li>`;
      // The months ahead: one card per month, each change at its home month.
      const months = [...new Set(ahead.map(s => Math.round(homeOf(s))))].sort((p, q) => p - q);
      months.forEach(mm => {
        const its = ahead.filter(s => Math.round(homeOf(s)) === mm).sort((p, q) => (p.v != null) - (q.v != null) || homeOf(p) - homeOf(q));
        h += `<li class="tl-ent"><i class="tl-dot"></i><div class="tl-ghead"><span class="tl-pill">${F(mm >= 12 ? 'Around 1 year' : `Around ${mm} month${mm === 1 ? '' : 's'}`)}</span><span class="tl-gmon">${F(calMon(mm))}</span></div><ol class="tl-gcard">${its.map(row).join('')}</ol></li>`;
      });
      h += `<li class="tl-ent tl-bday"><i class="tl-dot"></i><div class="tl-gcard tl-bcard"><span class="tl-t"><b>${F('First birthday!')}</b><small>${F(calMon(12))}</small></span>${cake}</div></li>`;
      if (earlier.length) h += `<li class="tl-earlier"><button onclick="this.parentNode.classList.toggle('is-open')">${F(`Earlier in {p} year (${earlier.length})`)}<i class="yt-caret" aria-hidden="true">›</i></button><ol class="tl-gcard">${earlier.map(s => `<li class="tl-gr"><button onclick="${go(s)}">${tile(s)}<span class="tl-t"><b>${F(title(s))}</b><small>${F(s.v != null ? `At ${s.v} months` : `Usually ${shortRange(s)}`)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></li>`).join('')}</ol></li>`;
      return h;
    };
    const head = x => { const mo = Math.max(0, Math.min(11, Math.floor(x))), cov = typeof window.stCover === 'function' ? window.stCover(mo) : null; return cov ? F(cov.title) : ''; };
    const ends = x => { const t = isToday(x), left = Math.max(0, 12 - x), eta = left < 0.5 ? 'any day now' : left < 1.5 ? 'in about a month' : `in about ${Math.round(left)} months`, d = Math.round(Math.abs(x - a));
      return t ? `<b>${F(`${nm} is ${typeof babyAge === 'function' ? babyAge() : ''}`)}</b><span>${F(x >= 12 ? 'Happy first birthday!' : left < 0.5 ? 'Cake any day now!' : `${Math.max(1, Math.round(left))} month${Math.max(1, Math.round(left)) === 1 ? '' : 's'} until cake`)}</span>` : `<b>${F(`At ${ageTxt(x)}`)}</b><button class="tl-home" onclick="tlScrub(null)">${F('Back to today')}</button>`; };
    const theme = x => typeof window.monthTheme === 'function' ? window.monthTheme(Math.max(0, Math.min(11, Math.floor(x)))) : '';
    const art = x => `<img class="tl-hb" src="assets/home/babies/handle-${Math.max(0, Math.min(11, Math.floor(x + 0.15)))}.webp?v=1122t" alt="">`;
    window.__tl = { a, listHTML, head, ends, theme, art };
    const hinted = (() => { try { return !!localStorage.getItem('ahead-tl-dragged'); } catch (e) { return true; } })();
    const pct = Math.max(0, Math.min(100, a / 12 * 100));
    const grad = (w, to) => typeof window.monthColor === 'function' ? `linear-gradient(90deg,${[...Array(12)].map((_, i) => `${window.monthColor(i, w, to)} ${Math.round((i + 0.5) / 12 * 100)}%`).join(',')})` : '';
    let h = `<div class="ya-page tl-track" style="${theme(a)};--tlp:${pct}%;--tla:${pct}%;--tlg:${grad(.86)};--tlf:${grad(.42)}"><p class="eyebrow tl-eyebrow">${F('Timeline')}</p><div class="tl-top"><h1 class="yt-h1">${F(`${nm}’s year ahead`)}</h1></div>`;
    h += `<div class="tl-prog${hinted ? '' : ' tl-hint'}"><div class="tl-ride"><span class="tl-baby" role="slider" tabindex="0" aria-label="${F(`Drag ${nm} to see another age`)}" aria-valuemin="0" aria-valuemax="12" aria-valuenow="${a.toFixed(1)}" aria-valuetext="${F(ageTxt(a))}" onkeydown="tlKey(event)" style="${theme(a)}">${art(a)}<em class="tl-tip">${F(hinted ? ageTxt(a) : 'Drag me')}</em></span><span class="tl-flag" aria-hidden="true"><img class="tl-cakeimg" src="assets/home/babies/cake.webp" alt=""></span></div><div class="tl-bar"><i></i><button class="tl-nowmark" onclick="tlScrub(null)" aria-label="${F('Back to today')}"></button></div><div class="tl-ticks" aria-hidden="true">${[[0, 'Birth'], [12, 'First birthday']].map(([v, l]) => `<span style="left:${v / 12 * 100}%">${F(l)}</span>`).join('')}${hinted ? '' : `<em class="tl-hintline">${F(`Drag ${nm} to peek ahead`)}</em>`}</div><div class="tl-ends">${ends(a)}</div></div>`;
    const gvars = x => typeof window.monthColor === 'function' ? `--g-bg:${window.monthColor(Math.max(0, Math.min(11, Math.floor(x))), .86)};--g-ink:${window.monthColor(Math.max(0, Math.min(11, Math.floor(x))), .45, 30)}` : '';
    window.__tl.gvars = gvars;
    h += `<ol class="tl-steps tl-groups tl-around" style="${gvars(a)}">${listHTML(a)}</ol>`;
    h += `</div>`;
    setTimeout(() => window.tlBind && window.tlBind(), 0);
    return h;
  };
  // Scrubbing: only the parts that change are redrawn, so the drag stays under the finger.
  window.tlScrub = function (x, live) {
    const T = window.__tl, pg = document.querySelector('#main .tl-track'); if (!T || !pg) return;
    if (x == null) x = T.a; x = Math.max(0, Math.min(12, x));
    // Let go: snap to a whole month, or to today when close to it.
    if (!live) x = Math.abs(x - T.a) < 0.5 ? T.a : Math.round(x);
    const q = Math.abs(x - T.a) < 0.13 ? T.a : Math.round(x * 4) / 4;
    pg.style.setProperty('--tlp', (x / 12 * 100) + '%');
    pg.classList.toggle('is-away', q !== T.a);
    
    // The cake stays put: the line ends before it, so the baby never covers it.
    const b = pg.querySelector('.tl-baby'), tip = b.querySelector('.tl-tip');
    if (String(q) === pg.dataset.q) return; pg.dataset.q = String(q);
    const mo = String(Math.max(0, Math.min(11, Math.floor(q))));
    if (pg.dataset.mo !== mo) { pg.dataset.mo = mo;
      T.theme(q).split(';').forEach(d => { const i = d.indexOf(':'); if (i > 0) b.style.setProperty(d.slice(0, i).trim(), d.slice(i + 1).trim()); });
      [...b.children].forEach(c => { if (c !== tip) c.remove(); }); b.insertAdjacentHTML('afterbegin', T.art(q));
      const hd = pg.querySelector('.tl-status'), nx = T.head(q); if (hd && hd.innerHTML !== nx) { hd.classList.remove('is-swap'); void hd.offsetWidth; hd.innerHTML = nx; hd.classList.add('is-swap'); } }
    tip.textContent = q >= 11.9 ? '1 year' : q < 1 ? `${Math.max(1, Math.round(q * 4.35))} wk` : `${Math.floor(q)} months`;
    pg.querySelector('.tl-ends').innerHTML = T.ends(q);
    const ol = pg.querySelector('.tl-steps'), was = new Set([...ol.querySelectorAll('.is-now')].map(e => e.dataset.id));
    ol.innerHTML = T.listHTML(q); ol.setAttribute('style', T.gvars(q));
    ol.querySelectorAll('.is-now').forEach(e => { if (!was.has(e.dataset.id)) e.classList.add('is-new'); });
    b.setAttribute('aria-valuenow', q.toFixed(1)); b.setAttribute('aria-valuetext', pg.querySelector('.tl-ends b').textContent);
  };
  window.tlKey = e => { const T = window.__tl, pg = document.querySelector('#main .tl-track'); if (!T || !pg) return; const cur = parseFloat(pg.dataset.q || T.a); if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { tlScrub(Math.floor(cur) + 1); e.preventDefault(); } if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { tlScrub(Math.ceil(cur) - 1); e.preventDefault(); } };
  window.tlBind = function () {
    const pr = document.querySelector('#main .tl-prog'); if (!pr || pr.dataset.bound) return; pr.dataset.bound = '1';
    const bar = pr.querySelector('.tl-bar'), baby = pr.querySelector('.tl-baby');
    const xOf = e => { const r = bar.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 12; };
    let on = false;
    const start = e => { if (e.target.closest('button')) return; on = true; lastX = xOf(e); pr.classList.add('is-drag'); pr.classList.remove('tl-hint'); try { localStorage.setItem('ahead-tl-dragged', '1'); } catch (er) {} try { pr.setPointerCapture(e.pointerId); } catch (er) {} tlScrub(xOf(e), true); e.preventDefault(); };
    pr.addEventListener('pointerdown', start);
    let lastX = null; pr.addEventListener('pointermove', e => { if (on) tlScrub(lastX = xOf(e), true); });
    const end = () => { if (on && lastX != null) tlScrub(lastX); on = false; lastX = null; pr.classList.remove('is-drag'); };
    pr.addEventListener('pointerup', end); pr.addEventListener('pointercancel', end);
  };
  // Focus as you scroll, without moving anything: every chapter ahead stays open, and the one in the middle of the
  // screen is in focus while the others soften back. Nothing opens or closes under the finger, so momentum scrolling
  // on a phone never fights the page. Tapping a header still folds or opens it.
  window.ytOpen = function (sec) {
    const open = !sec.classList.contains('is-open');
    sec.classList.toggle('is-open', open); sec.querySelector('.yt-head').setAttribute('aria-expanded', String(open));
    const t0 = performance.now(); (function t() { window.ytTrail(); if (performance.now() - t0 < 520) requestAnimationFrame(t); })();
  };
  // Focus on a few stops at a time: the ones near the middle of the screen are crisp, the rest fade with distance.
  // Nothing moves or resizes, so it stays smooth under a finger. The page opens centred on "Maya is here".
  const ytScroller = el => { for (let p = el && el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowY; if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight) return p; } return document.scrollingElement; };
  let ytRaf = 0;
  // Where am I: the pinned bar names the chapter and how it relates to today; when "Maya is here" is off screen,
  // a "Back to Maya" pill points the way back.
  const ytFocus = () => {
    ytRaf = 0; const me = document.querySelector('#main .yt-me'), pill = document.querySelector('#main .yt-back'); if (!pill) return;
    const r = me && me.offsetParent ? me.getBoundingClientRect() : null, off = r && (r.bottom < 60 || r.top > innerHeight - 110);
    pill.classList.toggle('is-on', !!off); if (off) pill.querySelector('i').textContent = r.top > innerHeight - 110 ? '↓' : '↑';
  };
  window.ytBack = () => { const me = document.querySelector('#main .yt-me'); if (!me) return; if (!me.offsetParent) { const sec = me.closest('.yt-ch'); sec && sec.classList.contains('is-fold') && window.ytTap(sec); }
    const sc = ytScroller(me); sc.scrollTo({ top: sc.scrollTop + me.getBoundingClientRect().top - innerHeight * 0.38, behavior: 'smooth' }); };

  document.addEventListener('scroll', () => { if (!ytRaf) ytRaf = requestAnimationFrame(ytFocus); }, { passive: true, capture: true });
  window.ytFocus = ytFocus;
  // Tap a chapter bar (even while it's pinned) to fold or open it; the bar stays under your finger.
  window.ytTap = sec => { const head = sec.querySelector('.yt-head'), y0 = head.getBoundingClientRect().top, sc = ytScroller(sec);
    const f = sec.classList.toggle('is-fold'); head.setAttribute('aria-expanded', String(!f));
    try { const p = JSON.parse(localStorage.getItem('ahead-yt-fold') || '{}'); p[sec.dataset.i] = f; localStorage.setItem('ahead-yt-fold', JSON.stringify(p)); } catch (e) {}
    const d = sec.getBoundingClientRect().top - y0; if (d < 0) sc.scrollTop += d; window.ytTrail(); ytFocus(); };
  window.ytEarlier = btn => { const show = !btn.classList.contains('is-on'); btn.classList.toggle('is-on', show); btn.querySelector('b').textContent = show ? 'Hide' : 'Show'; document.querySelectorAll('#main .yt-road.is-past').forEach(x => x.classList.toggle('yt-hide', !show)); window.ytTrail(); ytFocus(); };
  window.ytFold = sec => { sec.dataset.user = '1'; const f = !sec.classList.contains('is-fold'); sec.classList.toggle('is-fold', f); sec.querySelector('.yt-head').setAttribute('aria-expanded', String(!f)); window.ytTrail(); ytFocus(); };
  window.ytOld = btn => { const sec = btn.closest('.yt-ch'), on = sec.classList.toggle('show-old'); btn.querySelector('span').textContent = on ? 'Hide' : 'Show'; window.ytTrail(); ytFocus(); };
  window.ytCenter = () => { const me = document.querySelector('#main .yt-me'); if (!me) return ytFocus(); const sc = ytScroller(me); sc.scrollTop += me.getBoundingClientRect().top - innerHeight * 0.38; window.__ytStart = sc.scrollTop; ytFocus(); };
  // A gentle winding trail on the left of each open chapter, through its stops.
  window.ytTrail = function () {
    const map = document.querySelector('#main .yt-map'); if (!map) return;
    const svg = map.querySelector('.yt-trail'), box = map.getBoundingClientRect();
    const pts = [...map.querySelectorAll('.yt-list > li > .yt-dot, .yt-earlier .yt-dot, .yt-end .yt-dot')].filter(d => d.getBoundingClientRect().height > 0).map(d => { const r = d.getBoundingClientRect(); return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top]; }).filter(p => p[1] >= 0 && p[1] <= box.height);
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`); svg.style.setProperty('width', box.width + 'px', 'important'); svg.style.setProperty('height', box.height + 'px', 'important');
    if (pts.length < 2) return;
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2, w = i % 2 ? 8 : -8; d += ` C${x0 + w} ${my} ${x1 + w} ${my} ${x1} ${y1}`; }
    svg.querySelectorAll('path').forEach(p => p.setAttribute('d', d));
  };
  window.addEventListener('resize', () => window.ytTrail && window.ytTrail());

  // On a change's page: where it sits in the year, and where the baby is. Tapping it opens the whole Timeline.
  function yearStrip(c) {
    const a = ageNow(), max = 13, pct = v => Math.max(0, Math.min(100, v / max * 100));
    const ticks = [0, 3, 6, 9, 12].map(m => `<span style="left:${pct(m)}%">${m === 0 ? 'Birth' : m === 12 ? '1 yr' : m + 'm'}</span>`).join('');
    return `<button class="ya-yearstrip" onclick="navigate('next')"><span class="ya-ys-top"><b>${F(`On ${name()}’s year ahead`)}</b><em>${F('See the whole year')} ›</em></span><span class="ya-ys-bar" aria-hidden="true"><i style="left:${pct(c.start)}%;width:${pct(Math.min(c.end, max)) - pct(c.start)}%"></i>${a <= max ? `<u style="left:${pct(a)}%"><small>${F(`${name()} now`)}</small></u>` : ''}</span><span class="ya-ys-ticks" aria-hidden="true">${ticks}</span></button>`;
  }

  /* ---------- read-ahead pages: when, the signs it's close, what it changes, one reassuring note ---------- */
  // [from, to, zoneStart, zoneEnd, zoneLabel] in months; rows open the page that already covers each effect.
  const PAGES = {
    crying: { lead: 'From about 2 weeks, many babies cry more, often in the late afternoon and evening. It peaks around 6–8 weeks and eases by 3–4 months.', bar: [0, 4, 0.5, 3, 'Peaks at 6–8 weeks'], signsTitle: 'What it can look like', signs: ['Fussier evenings', 'Crying that’s hard to settle, even after a feed', 'Pulling up legs or going red in the face'],
      rows: [['heart', 'Sleep', 'When the crying won’t stop', 'What helps, and when it eases', "openPage('chg:Sleep:d:crying')"], ['heart', 'Health', 'Looking after you', 'It’s OK to put {o} down safely and step away', "openPage('chg:Health:d:you')"]],
      calls: { ped: 'crying comes with a fever or poor feeding, or the cry sounds different.', now: 'under 3 months, a temperature of 100.4°F or higher.', nowLabel: 'Call right away' } },
    smile: { lead: 'Around 6–8 weeks, most babies start smiling back at you. It’s the first real back-and-forth between you.', bar: [0, 4, 1.4, 2.1, 'Smiling back'], signs: ['Watching your face closely', 'Calming at your voice', 'Little coos when you talk'],
      rows: [['smile', 'Development', 'Lots of face-to-face time', 'Close up, where {s} can see you best', "openPage('development-domain:2:Social')"], ['chat', 'Development', 'Talk back to {p} sounds', 'Pause, and give {o} a turn', "openPage('development-domain:2:Talking')"]],
      tip: ['Not smiling back by 2 months?', 'Some babies take a little longer. Mention it at the 2-month checkup.'] },
    nights: { lead: 'Somewhere between 6 weeks and 4 months, one sleep at night starts to stretch longer, often to 4–5 hours.', bar: [0, 6, 1.5, 4, 'Nights stretch'], signs: ['More awake during the day', 'The longest sleep moves to the night', 'Sleepy around the same time each evening'],
      rows: [['sun', 'Sleep', 'Help {o} tell day from night', 'Bright days, dim and quiet nights', "openPage('chg:Sleep:d:daynight')"], ['book', 'Sleep', 'Start a short bedtime routine', 'From about 6–8 weeks', "openPage('chg:Sleep:d:routine')"], ['moon', 'Sleep', 'How long {s} can sleep at night', 'The longest stretch grows over months', "openPage('chg:Sleep:d:stretch')"]],
      tip: ['Still waking every 2–3 hours?', 'That’s normal for many babies this age, especially breastfed babies. Stretches grow over months, not nights.'] },
    regress: { lead: 'Around 4 months, sleep cycles mature, and many babies wake more for a few weeks. It’s a step forward, not backward.', bar: [1, 7, 3, 5, 'Often here'], signs: ['More night waking than a few weeks ago', 'Naps of 30–45 minutes', 'Harder to put down asleep'],
      rows: [['moon', 'Sleep', 'What helps during the regression', 'Wait a minute before going in', "openPage('chg:Sleep:d:regress')"], ['moon', 'Sleep', 'Rough day or night? Quick fixes', 'Waking a lot, short naps, up too early', "openPage('chg:Sleep:d:rough')"], ['heart', 'Health', 'Looking after you', 'Broken sleep is hard. Your rest matters too', "openPage('chg:Health:d:you')"]],
      calls: { ped: 'waking comes with a fever, poor feeding or pain. That’s not the regression.' } },
    roll: { lead: 'Rolling usually starts at 4–6 months. It changes how {s} sleeps and where {s} can go.', bar: [2, 8, 4, 6, 'Rolling'], signs: ['Rocking side to side on {p} back', 'Pushing up on straight arms in tummy time', 'Rolling onto {p} side'],
      rows: [['sack', 'Sleep', 'Stop swaddling at the first signs of trying to roll', 'Then a sleep sack, arms free', "openPage('chg:Sleep:d:swaddleoff')"], ['coin', 'Safety', 'Clear {p} play space', 'Small things go straight in the mouth', "openPage('chg:Safety:d:step:small')"], ['shield', 'Safety', 'Beds and sofas are off-limits', 'Even for a second', "openPage('safety-stage:reaching')"], ['mat', 'Development', 'Tummy time to practice', 'A toy just to one side helps', "openPage('development-domain:6:Movement')"]],
      tip: ['Rolled onto {p} tummy in sleep?', 'Always put {o} down on {p} back. Once {s} rolls both ways on {p} own, {s} can stay how {s} lands.'] },
    sit: { pics: [['dev/m6-leans-on-hands', 'Sits propped on {p} hands', 'Leaning forward for balance'], ['feeding/sign-sits', 'A steady head and back', 'Upright, with a little support'], ['dev/play-toy-beside-knee', 'Reaches while sitting', 'For a toy just beside {o}']], lead: 'Most babies sit on their own by about 9 months. First comes sitting propped on their hands.', bar: [4, 12, 6, 9, 'Sitting up'], signs: ['Sitting propped on {p} hands', 'A steady head and back', 'Reaching for toys while sitting'],
      rows: [['crib', 'Sleep', 'Lower the crib mattress', 'Before {s} can sit on {p} own', "openPage('chg:Sleep:d:mattress')"], ['mat', 'Safety', 'Time to retire the bouncer', 'Once {s} sits up or tries to climb out', "openPage('chg:Safety:d:gear')"], ['sit', 'Development', 'A toy beside your knee', 'Reaching while sitting builds balance', "openPage('development-domain:6:Movement')"]],
      tip: ['Not sitting by 9 months?', 'Mention it at the 9-month checkup.'] },
    twonaps: { lead: 'Usually between 6 and 9 months, the late-afternoon catnap drops and days settle into two naps.', bar: [4, 12, 6, 9, 'Two naps'], signs: ['Skipping the catnap most days', 'The catnap pushes bedtime late', 'Fine until bedtime without it'],
      rows: [['sun', 'Sleep', 'How to make the switch', 'It takes a week or two', "openPage('chg:Sleep:d:catnap')"], ['book', 'Sleep', 'Bedtime a little earlier', 'While the catnap goes', "openPage('chg:Sleep:d:routine')"], ['stroller', 'Out and about', 'Longer outings between naps', 'More time out of the house', "openPage('topic:Out and about')"]],
      tip: ['Messy days are normal', 'On a day with short naps, a catnap can still help.'] },
    tooth: { lead: 'Most babies get their first tooth between 6 and 12 months, usually a bottom front tooth.', bar: [3, 15, 6, 12, 'First tooth'], signs: ['More drooling and chewing', 'Swollen or tender gums', 'A little fussier than usual'],
      rows: [['tooth', 'Daily rhythm', 'Start brushing', 'A rice-grain smear of fluoride toothpaste', "openPage('chg:Daily rhythm:d:teeth')"], ['tooth', 'Daily rhythm', 'Soothing sore gums', 'A clean finger or a chilled teething ring', "openPage('chg:Daily rhythm:d:gums')"], ['thermo', 'Health', 'Teething doesn’t cause a high fever', 'A fever means checking for something else', "openPage('chg:Health:d:sick')"]],
      tip: ['No tooth yet?', 'Some babies get their first tooth later. Ask at a checkup if you don’t see any by 18 months.'] },
    crawl: { pics: [['dev/crawl-rock', 'Rocks on hands and knees', 'Back and forth, not moving yet'], ['dev/m6-straight-arms', 'Pushes up high', 'On straight arms in tummy time'], ['dev/reaching-6', 'Pivots on {p} tummy', 'Turning to reach a toy']], lead: 'Most babies start moving between 6 and 10 months. Some scoot or roll instead, and some skip crawling altogether.', bar: [4, 12, 6, 10, 'Crawling'], signs: ['Rocking on hands and knees', 'Pushing up high during tummy time', 'Pivoting in circles on {p} tummy'],
      rows: [['shield', 'Safety', 'Babyproof before {s} moves', 'Stair gates, cabinet locks and outlet covers', "openPage('safety-stage:rolling')"], ['crib', 'Sleep', 'Lower the crib mattress', 'Before {s} can sit on {p} own', "openPage('chg:Sleep:d:mattress')"], ['crawl', 'Development', 'Lots of floor time to practice', 'A toy just out of reach helps', "openPage('development-domain:9:Movement')"], ['stroller', 'Out and about', 'Outings get busier', 'A blanket won’t keep {o} put for long', "openPage('topic:Out and about')"]],
      tip: ['Not crawling by 10 months?', 'Many babies skip crawling and go straight to pulling up. If Maya isn’t moving around at all, mention it at the 9-month checkup.'] },
    solids: { pics: [['feeding/sign-head', 'Steady head', 'Holds it up on {p} own'], ['feeding/sign-sits', 'Sits with support', 'In a high chair, or on your lap'], ['feeding/sign-interest2', 'Leans in for food', 'Watches you eat, leans in'], ['feeding/sign-spoon', 'Swallows, not pushes out', 'Food goes down, not back out']], lead: 'Around 6 months, food joins milk. It starts with a few bites a day, and milk stays the main food for months.', bar: [4, 9, 5.4, 7, 'About 6 months'], signsTitle: 'Signs {s’s} ready', signs: ['Holds {p} head steady on {p} own', 'Sits with a little support', 'Leans in when food comes {p} way', 'Swallows food instead of pushing it out'],
      rows: [['highchair', 'Feeding', 'Get set up for the first bite', 'A high chair, a soft spoon and a bib', "openPage('chg:Feeding:d:setup')"], ['shield', 'Safety', 'Learn infant choking first aid', 'And how gagging is different', "openPage('chg:Feeding:safe')"], ['bowl', 'Feeding', 'Decide how you’d like to start', 'Spoon-feeding, finger foods or a bit of both', "openPage('chg:Feeding:d:approach')"], ['steth', 'Health', 'Ask about allergens at the checkup', 'The 6-month checkup is a good time', "openPage('health-visit:6')"]],
      tip: ['No need to rush', 'Around 6 months is the usual start, never before 4. Until then, milk gives Maya everything {s} {need|needs}.'] },
    finger: { lead: 'Around 7–9 months, food moves past smooth purées to soft lumps, and pieces {s} can pick up. Meals get messier, and that’s how {s} learns.', bar: [5, 11, 7, 9, 'Textures'], signs: ['Moving food around {p} mouth to chew', 'Raking food toward {o} with {p} fingers', 'Reaching for the spoon'],
      rows: [['bowl', 'Feeding', 'Thicker textures, step by step', 'From mashed to soft lumps', "openPage('chg:Feeding:d:lumpy')"], ['bowl', 'Feeding', 'Safe finger food sizes', 'Soft, and cut the right shape', "openPage('chg:Feeding:d:finger')"], ['shield', 'Safety', 'Gagging versus choking', 'Know the difference before you start', "openPage('chg:Feeding:safe')"]],
      tip: ['Lots of gagging at first?', 'It’s noisy and normal while {s} learns to move food around. Choking is different: a weak cough or no sound at all.'] },
    carseat: { lead: 'Many babies outgrow the infant car seat in the first year, usually by height before weight. The next seat still faces the back.', bar: [4, 14, 8, 12, 'Often here'], signs: ['{P} head is within an inch of the top of the seat', 'Close to the weight limit on the label'], signsNote: 'Feet touching the back seat is fine, and not a reason to switch.',
      rows: [['car', 'Out and about', 'Which seat comes next', 'Infant seat, then a convertible seat, still rear-facing', "openPage('chg:Out and about:d:car')"]],
      tip: ['Still facing the back', 'Keep {o} rear-facing as long as the new seat allows, often well past age 2.'] },
    sep: { lead: 'Around 8–10 months, many babies get upset when you leave. It means {s} knows you, and knows when you’re gone.', bar: [5, 14, 8, 10, 'Often peaks'], signs: ['Crying when you leave the room', 'Clinging around new people', 'Waking at night looking for you'],
      rows: [['moon', 'Sleep', 'Night waking may come back', 'The same short goodbye helps', "openPage('chg:Sleep:d:nightwake')"], ['home', 'Childcare', 'Settling in with a caregiver', 'A familiar goodbye routine helps', "openPage('topic:Childcare')"], ['smile', 'Development', 'Peekaboo helps', 'Things that go away come back', "openPage('development-domain:9:Social')"]],
      tip: ['Short goodbyes work best', 'Say goodbye, then go. Sneaking out makes the next goodbye harder.'] },
    pull: { lead: 'Between 9 and 12 months, most babies pull up on furniture, then start cruising along it.', bar: [6, 14, 9, 12, 'Pulling up'], signs: ['Getting up on {p} knees', 'Pulling up on your legs or the sofa', 'Standing while holding on'],
      rows: [['dresser', 'Safety', 'Check furniture and TVs are strapped down', 'Best done before crawling, so nothing tips when {s} pulls', "openPage('chg:Safety:d:step:anchor')"], ['crib', 'Sleep', 'Crib mattress to its lowest', 'Before {s} pulls up to stand', "openPage('chg:Sleep:d:mattress')"], ['shield', 'Safety', 'Windows, the stove and water', 'Everything higher is in reach', "openPage('safety-stage:pulling')"], ['stand', 'Development', 'Cruise to a toy', 'Steps along the sofa build balance', "openPage('development-domain:12:Movement')"]],
      tip: ['Stuck standing at night?', 'Practice sitting back down by day, then it gets easier at night.'] },
    words: { lead: 'Around the first birthday, many babies say “mama” or “dada” for a parent. Understanding comes before talking.', bar: [6, 16, 10, 14, 'First words'], signs: ['Babbling with lots of sounds', 'Turning when you say {p} name', 'Pointing or waving to tell you something'],
      rows: [['chat', 'Development', 'Talk about what {s}’s looking at', 'Name it, then pause for {o}', "openPage('development-domain:12:Talking')"], ['signs', 'Development', 'Teach a few simple signs', 'More, eat, milk and all done', "openPage('chg:Development:d:signs')"], ['book', 'Development', 'Ideas for awake time', 'Books, songs and games', "openPage('chg:Development:d:more:12')"]],
      tip: ['Not saying “mama” or “dada” yet?', 'Mention it at the 12-month checkup. Gestures like waving count too.'] },
    milk: { lead: 'At 12 months, whole cow’s milk can replace formula, from a cup. Breastfeeding can carry on as long as you both want.', bar: [9, 15, 12, 12.8, '12 months'], signsTitle: 'Getting ready', signs: ['Practice with an open or straw cup', 'Offer a little water with meals', 'No juice needed'],
      rows: [['cup', 'Feeding', 'The 12-month milk plan', 'How much, and when', "openPage('chg:Feeding:d:milk12')"], ['cup', 'Feeding', 'From bottle to cup', 'One bottle at a time', "openPage('chg:Feeding:d:cup')"], ['steth', 'Health', 'The 12-month checkup', 'An anemia check and milk questions', "openPage('health-visit:12')"]],
      tip: ['How much milk?', 'About 16–24 oz a day after the first birthday. More can crowd out iron-rich food.'] },
    steps: { lead: 'Most babies take their first steps between 12 and 15 months. Some walk earlier, and some later.', bar: [9, 18, 12, 15, 'First steps'], signs: ['Cruising along furniture', 'Standing alone for a moment', 'Walking while holding both your hands'],
      rows: [['shield', 'Safety', 'Check what {s} can reach standing', 'Windows, the stove and water', "openPage('safety-stage:pulling')"], ['stand', 'Daily rhythm', 'Cruising and first steps', 'Barefoot is best indoors', "openPage('chg:Daily rhythm:d:steps')"], ['stand', 'Development', 'A push toy to walk with', 'Sturdy, and on a flat floor', "openPage('development-domain:12:Movement')"]],
      tip: ['Not walking at 12 months?', 'Very common. Mention it if {s} isn’t walking on {p} own by 18 months.'] },
    onenap: { lead: 'Usually between 13 and 18 months, two naps become one long midday nap.', bar: [11, 20, 13, 18, 'One nap'], signs: ['Fighting the morning nap', 'Fine until the afternoon without it', 'A short afternoon nap after a long morning one'],
      rows: [['sun', 'Sleep', 'Making the switch', 'Push the first nap later', "openPage('chg:Sleep:d:after')"], ['book', 'Sleep', 'Bedtime a little earlier', 'While {s} adjusts', "openPage('chg:Sleep:d:routine')"]],
      tip: ['No rush', 'Two naps after the first birthday is normal.'] }
  };
  function changePage(id) {
    const h = H(), c = C.find(x => x.id === id), p = PAGES[id]; if (!c || !p) return null;
    const a = ageNow(), cat = c.cat, past = c.end <= a, now = c.start <= a && c.end > a;
    const when = past ? 'Already behind ' + name() : now ? 'Any time now' : c.start - a <= 1 ? 'Could start any week now' : `In about ${Math.round(c.start - a)} month${Math.round(c.start - a) === 1 ? '' : 's'}`;
    // Nov 23 cohesion pass: where every sign has a real photo, the signs show as Feeding's photo rows (show, don't tell).
    // Nov 14: the signs used to sit at the end of the top card's paragraph. As their own short list they scan at a glance.
    const look = `<h2 class="hub-h2">${F(c.end <= a ? 'What it looked like' : p.signsTitle || 'Signs it’s close')}</h2>${p.pics ? h.TPLB.photoRows(p.pics) : `<ul class="ya-signs">${p.signs.map(x => `<li>${F(x)}</li>`).join('')}</ul>`}${p.signsNote ? `<p class="ya-signs-note">${F(p.signsNote)}</p>` : ''}`;
    return h.detail(cat, `${range(c)} · ${when}`, c.title, p.lead,
      look
      + h.list('What it changes', p.rows.slice(0, 4).map(([icon, rc, title, sub, go]) => h.row({ icon, cat: rc, title, sub, onclick: go }).replace('<span class="hub-row-copy">', `<span class="hub-row-copy"><small class="hub-row-eyebrow">${F(AREA[rc] || rc)}</small>`)))
      // Nov 23: a tip that's really a call line uses the app's one When to call card.
      + (p.calls ? h.TPLB.calls(p.calls) : h.tip(p.tip[0], p.tip[1])), c.icon)
      // Nov 23 cohesion pass: Feeding, Everyday care and Outings changes opened on a bare header (no card), unlike
      // Development and Sleep. Give them the same header card every guide page uses: the guide's soft color, its icon on a white tile.
      .replace(/<div class="hub-detail-head">\s*<span class="hub-big">/, m => {
        const pal = (typeof YEAR_PALETTES !== 'undefined' && YEAR_PALETTES[cat]) || null;
        if (!pal || /^(Development|Sleep)$/.test(cat)) return m;
        return `<div class="hub-detail-head dev-area-head ss-head ya-chg-head" style="--area:color-mix(in srgb, ${pal.bg} 50%, ${pal.pale});--area-ink:${pal.ink}"><span class="dev-area-head-art sf-head-art">`;
      });
  }
  const base = window.changesRoute;
  window.changesRoute = function (p) { const m = /^chg:Timeline:c:(\w+)$/.exec(p); if (m) { const pg = changePage(m[1]); if (pg) return pg; } return base(p); };
  // Home reads the same changes, so both tabs always agree.
  window.__ya = { C, PAGES, TOUCH, ageNow, doneNow, range, whenShort, windowBar, F };
})();
