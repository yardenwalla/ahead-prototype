/* Ahead · Timeline reimagined: the year as a path with the baby on it, the next few big changes as cards,
   and a read-ahead page per change that says when, the signs it's close, and everything it changes (each row
   opens the page that already covers it). Preview: two change pages (crawling, solids). */
(function () {
  const H = () => window.__hub, F = s => H().F(s);
  const MONTH = 30.4375 * 864e5;
  const ageNow = () => { const from = profile.early && profile.due ? parse(profile.due) : parse(profile.dob); return (NOW - from) / MONTH; };
  const C = [
    ['smile', 1.5, 2, 'Development', 'smile', 'First smiles', 'The first real back-and-forth', "openPage('development-stage:2')"],
    ['nights', 1.5, 4, 'Sleep', 'moon', 'Longer nights', 'One longer stretch at night', "openPage('chg:Sleep:s:1')"],
    ['regress', 3, 5, 'Sleep', 'moon', 'The 4-month sleep regression', 'More waking, for a few weeks', "openPage('chg:Sleep:d:regress')"],
    ['roll', 4, 6, 'Development', 'roll', 'Rolling', 'The swaddle comes off', "openPage('development-domain:6:Movement')"],
    ['solids', 6, 6.5, 'Feeding', 'bowl', 'Starting solids', 'Food joins milk', "openPage('chg:Timeline:c:solids')", 'Around 6 months'],
    ['twonaps', 6, 9, 'Sleep', 'sun', 'Three naps become two', 'The late catnap drops', "openPage('chg:Sleep:d:catnap')"],
    ['crawl', 6, 10, 'Development', 'crawl', 'Crawling', 'Every room opens up', "openPage('chg:Timeline:c:crawl')"],
    ['sit', 6, 9, 'Development', 'sit', 'Sitting up', 'Both hands free to play', "openPage('development-domain:9:Movement')"],
    ['tooth', 6, 12, 'Daily rhythm', 'tooth', 'The first tooth', 'Time to start brushing', "openPage('chg:Daily rhythm:d:teeth')"],
    ['sep', 8, 10, 'Development', 'heart', 'Separation anxiety', 'Goodbyes get harder for a while', "openPage('chg:Sleep:d:nightwake')"],
    ['pull', 9, 12, 'Development', 'stand', 'Pulling up to stand', 'Everything higher is in reach', "openPage('safety-stage:pulling')"],
    ['words', 10, 14, 'Development', 'chat', 'First words', 'Mama, dada and more', "openPage('development-domain:12:Talking')"],
    ['milk', 12, 12.5, 'Feeding', 'cup', 'Milk at 12 months', 'Cow’s milk from a cup', "openPage('chg:Feeding:d:milk12')", 'At 12 months'],
    ['steps', 12, 15, 'Development', 'stand', 'First steps', 'Walking, holding on at first', "openPage('development-domain:12:Movement')"],
    ['onenap', 13, 18, 'Sleep', 'sun', 'Two naps become one', 'One long midday nap', "openPage('chg:Sleep:d:after')"]
  ].map(([id, start, end, cat, icon, title, why, go, range]) => ({ id, start, end, cat, icon, title, why, go, range: range || `${start}–${end} months` }));
  const CHECKUPS = [2, 4, 6, 9, 12];
  const range = c => c.range.replace(/^(\d+(\.5)?)–/, (m, a) => `${Math.floor(+a)}–`);
  const soon = (c, a) => c.start <= a + 1 ? 'Could start any week now' : `In about ${Math.round(c.start - a)} month${Math.round(c.start - a) === 1 ? '' : 's'}`;

  window.nextPage = function () {
    const a = ageNow(), nm = name();
    const ahead = C.filter(c => c.end > a), next = ahead.filter(c => c.start >= a && c.start <= a + 3).slice(0, 3);
    let h = `<div class="ya-page"><div class="eyebrow">${F('The year ahead')}</div><h1>${F('Timeline')}</h1><p class="next-lead">${F(`The big changes coming for ${nm}, and what each one changes. Tap any to read ahead.`)}</p>`;
    if (next.length) h += `<h2 class="ya-h2">${F('Coming up next')}</h2><div class="ya-next">${next.map(c => `<button class="ya-card" style="${yearTheme(c.cat)}" onclick="${c.go}"><span class="ya-card-art">${hubArt(c.icon, c.cat)}</span><span class="ya-card-copy"><small>${F(range(c))}</small><b>${F(c.title)}</b><span>${F(c.why)}</span><em>${F(soon(c, a))} ›</em></span></button>`).join('')}</div>`;
    // The whole year as a path: changes where they usually start, a bar for their usual range, the baby's place marked.
    const rows = []; let placed = false;
    const marker = `<li class="ya-here"><span class="ya-node"></span><b>${F(`${nm} is here`)}</b><small>${F(a < 1 ? 'Newborn' : `${Math.floor(a)} month${Math.floor(a) === 1 ? '' : 's'}`)}</small></li>`;
    const items = [...C.map(c => ({ t: c.start, c })), ...CHECKUPS.map(v => ({ t: v + 0.01, v }))].sort((x, y) => x.t - y.t);
    items.forEach(it => {
      if (!placed && it.t > a) { rows.push(marker); placed = true; }
      if (it.v) { rows.push(`<li class="ya-pin${it.t < a ? ' is-past' : ''}"><span class="ya-node"></span><span>${F(`${it.v}-month checkup`)}</span></li>`); return; }
      const c = it.c, past = c.end <= a, now = c.start <= a && c.end > a;
      const w = Math.max(4, (Math.min(c.end, 18) - c.start) / 18 * 100), l = c.start / 18 * 100;
      rows.push(`<li class="ya-row${past ? ' is-past' : ''}${now ? ' is-now' : ''}" style="${yearTheme(c.cat)}"><span class="ya-node"></span><button onclick="${c.go}"><span class="ya-row-art">${hubArt(c.icon, c.cat)}</span><span class="ya-row-copy"><b>${F(c.title)}</b><small>${F(range(c))}${now ? ' · ' + F('happening now') : ''}</small><span class="ya-bar"><i style="left:${l}%;width:${w}%"></i><u style="left:${Math.min(a, 18) / 18 * 100}%"></u></span></span><span class="hub-chev" aria-hidden="true">›</span></button></li>`);
    });
    if (!placed) rows.push(marker);
    h += `<h2 class="ya-h2">${F('The first year')}</h2><ol class="ya-path">${rows.join('')}</ol>`;
    h += `<p class="hub-foot">${F('Ages are typical. Every baby moves at their own pace.')}</p></div>`;
    return h;
  };

  /* ---------- read-ahead pages ---------- */
  function changePage(id) {
    const h = H(), a = ageNow(), nm = name();
    if (id === 'crawl') return h.detail('Development', 'Coming up', 'Crawling', 'Most babies start moving between 6 and 10 months. Some scoot or roll instead, and some skip crawling altogether.',
      hubWindowBar({ title: 'When it usually starts', from: 4, to: 12, zones: [[6, 10, 'Crawling', 'band']], ticks: [[4, '4 mo'], [6, '6 mo'], [10, '10 mo'], [12, '1 year']], now: a, cat: 'Development', caption: 'Crawling usually starts between 6 and 10 months.' })
      + `<div class="hub-card hub-looks"><b class="hub-fig-title">${F('Signs it’s close')}</b><ul>${['Rocking on hands and knees', 'Pushing up high during tummy time', 'Pivoting in circles on the tummy'].map(t => `<li>${F(t)}</li>`).join('')}</ul></div>`
      + h.list('What it changes', [
        h.row({ icon: 'shield', cat: 'Safety', title: 'Babyproof before {s} moves', sub: 'Stair gates, cabinet locks and outlet covers', onclick: "openPage('safety-stage:rolling')" }),
        h.row({ icon: 'crib', cat: 'Sleep', title: 'Lower the crib mattress', sub: 'Before {s} can push up and lean over', onclick: "openPage('chg:Sleep:d:mattress')" }),
        h.row({ icon: 'crawl', cat: 'Development', title: 'Lots of floor time to practice', sub: 'A toy just out of reach helps', onclick: "openPage('development-domain:9:Movement')" }),
        h.row({ icon: 'stroller', cat: 'Out and about', title: 'Outings get busier', sub: 'A blanket won’t keep {o} put for long', onclick: "openPage('topic:Out and about')" })
      ])
      + h.tip('Not crawling by 10 months?', 'Many babies skip crawling and go straight to pulling up. If ' + nm + ' isn’t moving around at all, mention it at the 9-month checkup.'));
    if (id === 'solids') return h.detail('Feeding', 'Coming up', 'Starting solids', 'Around 6 months, food joins milk. It starts with a few bites a day, and milk stays the main food for months.',
      hubWindowBar({ title: 'When most babies start', from: 4, to: 9, zones: [[5.4, 7, 'About 6 months', 'band']], ticks: [[4, '4 mo'], [6, '6 mo'], [9, '9 mo']], now: a, cat: 'Feeding', caption: 'Most babies start solids around 6 months.' })
      + `<div class="hub-card hub-looks"><b class="hub-fig-title">${F('Signs {s’s} ready')}</b><ul>${['Holds {p} head steady on {p} own', 'Sits with a little support', 'Leans in when food comes {p} way', 'Swallows food instead of pushing it out'].map(t => `<li>${F(t)}</li>`).join('')}</ul></div>`
      + h.list('What it changes', [
        h.row({ icon: 'highchair', cat: 'Feeding', title: 'Get set up for the first bite', sub: 'A high chair, a soft spoon and a bib', onclick: "openPage('chg:Feeding:d:setup')" }),
        h.row({ icon: 'shield', cat: 'Safety', title: 'Learn infant choking first aid', sub: 'And how gagging is different', onclick: "openPage('chg:Feeding:safe')" }),
        h.row({ icon: 'bowl', cat: 'Feeding', title: 'Decide how you’d like to start', sub: 'Spoon-feeding, finger foods or a bit of both', onclick: "openPage('chg:Feeding:d:approach')" }),
        h.row({ icon: 'steth', cat: 'Health', title: 'Ask about allergens at the checkup', sub: 'The 6-month checkup is a good time', onclick: "openPage('health-visit:6')" })
      ])
      + h.tip('No need to rush', 'Starting at 6 months, not before 4. Until then, milk gives ' + nm + ' everything ' + (typeof babyPronouns === 'function' ? babyPronouns().s : 'they') + ' needs.'));
    return null;
  }
  const base = window.changesRoute;
  window.changesRoute = function (p) { const m = /^chg:Timeline:c:(\w+)$/.exec(p); if (m) { const pg = changePage(m[1]); if (pg) return pg; } return base(p); };
})();
