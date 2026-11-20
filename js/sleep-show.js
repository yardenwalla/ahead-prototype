/* Ahead · Sleep, show and tell (preview, Nov 19). Yarden's mockup as inspiration, Ahead's own content.
   - Sleep's top card: the "You might notice" story keeps its words, and the small drawing becomes the shape of
     the baby's day (morning nap, midday nap, catnap, bedtime), so parents see the rhythm instead of reading it.
   - Bedtime routine: the four steps as photo rows (what each step looks like), with the two notes that matter.
   - Short naps and night waking get their own pages (they were lines inside Rough day): a small picture of what
     happens, then numbered steps. Rough day opens them, so each thing still has one home.
   Facts: AAP (HealthyChildren.org) sleep guidance, the same as the pages these replace. */
(function () {
  const H = () => window.__hub, C = () => window.__chg, m = () => C().ageNow();
  const F = s => H().F(s);
  const go = p => `openPage('${p}')`;
  const IMG = 'assets/sleep/';
  const nursing = () => { try { return C().method() === 'nurse'; } catch (e) { return false; } };

  /* ---------- pictures ---------- */
  const NIGHT = { bg: '#e3e6f6', ink: '#3d4a7a', pill: '#a9b2e0', soft: '#c9cff0' };
  const zz = (x, y) => `<text x="${x}" y="${y}" font-size="11" font-weight="700" fill="#fff" text-anchor="middle" font-family="inherit">z z</text>`;
  const spark = (x, y, c) => `<g stroke="${c}" stroke-width="2.4" stroke-linecap="round"><path d="M${x} ${y - 14}v7"/><path d="M${x - 11} ${y - 9}l4 5"/><path d="M${x + 11} ${y - 9}l-4 5"/></g>`;
  // Labels sit under the picture as HTML, so they read clearly at any width and say what they are on their own.
  const fig = (label, svg, labels) => `<figure class="ssw-fig" role="img" aria-label="${F(label)}">${svg}<figcaption style="grid-template-columns:repeat(${labels.length},1fr)">${labels.map(l => `<span>${F(l)}</span>`).join('')}</figcaption></figure>`;

  // The night: a sleep, a short waking, back to sleep.
  const nightFig = () => fig('A sleep, a brief waking, then back to sleep.', `<svg viewBox="0 0 300 70" aria-hidden="true">
      <path d="M36 14a9 9 0 1 0 9 12 7.5 7.5 0 0 1-9-12Z" fill="#f3d58a"/>
      <path d="M14 46H290" stroke="${NIGHT.ink}" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>
      <rect x="20" y="36" width="88" height="20" rx="10" fill="${NIGHT.pill}"/>${zz(64, 50)}
      ${spark(150, 44, '#e3b45a')}<circle cx="150" cy="46" r="4" fill="#e3b45a"/>
      <rect x="192" y="36" width="88" height="20" rx="10" fill="${NIGHT.pill}"/>${zz(236, 50)}</svg>`,
    ['Sleep', 'Brief waking', 'Back to sleep']);

  // A short nap: the nap ends early, awake time is shorter, and the next nap comes sooner than planned (the dashed pill).
  const DAY = { pill: '#f3d58a', ink: '#8a6a2a' };
  const napFig = () => fig('A short nap, a shorter time awake, then the next nap a little earlier than planned.', `<svg viewBox="0 0 300 70" aria-hidden="true">
      <path d="M14 46H290" stroke="${DAY.ink}" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>
      <rect x="40" y="36" width="44" height="20" rx="10" fill="${DAY.pill}"/>
      <rect x="84" y="36" width="44" height="20" rx="10" fill="none" stroke="${DAY.ink}" stroke-opacity=".35" stroke-width="1.6" stroke-dasharray="3 4"/>
      <path d="M96 46H184" stroke="${DAY.ink}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 6" stroke-opacity=".6"/>
      <rect x="196" y="36" width="70" height="20" rx="10" fill="${DAY.pill}"/>
</svg>`,
    ['Nap ends early', 'Less time awake', 'Next nap comes sooner']);

  // The shape of the day, for the top card: sun, a pill per nap (the catnap shorter), the moon at bedtime.
  const dayStrip = (naps) => {
    const n = naps.length, gap = 220 / n, pills = naps.map((l, i) => { const w = /cat/i.test(l) ? 30 : 46, x = 46 + i * gap + (gap - w) / 2; return `<rect x="${x}" y="22" width="${w}" height="18" rx="9" fill="#b9a6e6"/>${zz(x + w / 2, 35)}`; }).join('');
    return `<figure class="ssw-day" role="img" aria-label="${F('A day with ' + naps.join(', ').toLowerCase() + ', then bedtime.')}"><svg viewBox="0 0 300 52" aria-hidden="true">
      <path d="M20 31H282" stroke="#5b4f8a" stroke-opacity=".3" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 6"/>
      <circle cx="20" cy="31" r="9" fill="#f3c45a"/>${spark(20, 20, '#f3c45a')}
      ${pills}<path d="M280 20a11 11 0 1 0 11 15 9 9 0 0 1-11-15Z" fill="#b9a6e6"/></svg>
      <figcaption><span>${F('Wake up')}</span>${naps.map(l => `<span>${F(l)}</span>`).join('')}<span>${F('Bedtime')}</span></figcaption></figure>`;
  };

  /* ---------- pages ---------- */
  // Bedtime routine: four steps, each with a photo of what it looks like. Teeth join the feed step from the first tooth.
  function routinePage() {
    const mo = m(), teeth = mo >= 7 || answers.hasTooth === 'Yes';
    const S = [
      ['pajamas.jpg', 'Change', 'Into pajamas. A bath first is optional'],
      [nursing() ? 'feed-nurse.jpg' : 'feed.jpg', 'Feed', teeth ? 'Then brush {p} teeth' : 'A calm last feed'],
      ['book.jpg', 'Book or song', 'The same one most nights'],
      ['crib.jpg', 'Down to sleep', 'Sleepy but awake, on {p} back']
    ];
    const photos = `<section class="care-tpl-card ssw-photosteps"><ol>${S.map(([img, t, s], i) => `<li><span class="ssw-ph"><img src="${IMG + img}" alt="" loading="lazy"></span><span class="ssw-copy"><i>${i + 1}</i><b>${F(t)}</b><small>${F(s)}</small></span></li>`).join('')}</ol>`
      + H().TPLB.ul([['', 'Same order, not a perfect clock', 'The order is what tells {o} sleep is coming'], ['', '15–20 minutes is plenty', 'Short enough to do every night']]) + `</section>`;
    const tips = mo < 3
      ? [['clock', 'Nights start to stretch', 'And {s} {get|gets} sleepy around the same time each evening.'], ['moon', 'An earlier bedtime comes later', 'Around 7–8 pm, once naps settle.']]
      : [['moon', 'Sleepy but awake is practice', 'Some nights {s}’ll fall asleep feeding. That’s fine.'], mo >= 6 && ['heart', 'A lovey can wait', 'Keep the crib empty until 12 months.']].filter(Boolean);
    return H().tplPage('Sleep', { type: 'howto', label: 'Routine', art: 'moon', title: 'A short bedtime routine, the same every night',
      why: mo < 2 ? 'From about 6–8 weeks, a few calm steps in the same order start to tell {o} it’s bedtime.' : 'A few calm steps in the same order help {o} wind down and know sleep is next.',
      stepsFig: () => photos, tipsTitle: 'Good to know', tips });
  }

  function shortNapPage() {
    const mo = m(), early = mo < 6, three = mo >= 4 && mo < 9 && answers.twoNaps !== 'Yes';
    const ifs = [
      three && ['moon', 'Skipped the catnap?', 'Move bedtime earlier tonight.'],
      !early && ['sun', 'Short naps most days?', 'Try the nap 15 minutes earlier or later. A dark room and white noise help.'],
      mo >= 6 && mo < 10 && ['clock', 'Fighting the last nap most days?', 'It may be time for two naps.']
    ].filter(Boolean);
    return H().tplPage('Sleep', { type: 'expect', label: 'Naps', art: 'sun', title: 'A short nap moves the next one up',
      why: early ? 'Naps of 30–45 minutes are very common now. They get longer with time.' : 'Timing, light, teething or a new skill can shorten naps for a while.',
      normalTitle: 'How the day shifts', normal: napFig,
      doOrdered: true, do: [['clock', 'Give it a few minutes', '{S} may resettle on {p} own'], ['eye', 'Watch for sleepy cues', 'More than the clock'], ['moon', 'Offer the next nap sooner', 'And bedtime, if the day runs short']],
      action: () => ifs.length ? H().TPLB.sec('If it keeps happening', H().TPLB.rows(ifs, 'Sleep')) : '' });
  }

  function wakesPage() {
    const mo = m();
    return H().tplPage('Sleep', { type: 'expect', label: 'Night sleep', art: 'moon', title: 'Brief wakings happen between sleep cycles',
      why: 'Many babies stir and settle back on their own. A short pause first gives {o} the chance.',
      normalTitle: 'What a night looks like', normal: nightFig,
      doOrdered: true, do: [['ear', 'Pause and listen', 'A minute or two. {S} may settle'], ['diaper', 'Check what {s} {need|needs}', 'Hungry, wet or uncomfortable?'], ['heart', 'Settle {o} the usual way', 'Brief, dark and quiet']],
      action: () => H().TPLB.sec('Common reasons now', H().TPLB.chips(['Hunger', 'A new skill, like rolling', 'Teething or a cold', 'Overtired after short naps'],
        [['', 'Short naps today?', 'Try bedtime 30 minutes earlier for a few nights'], mo >= 6 && ['', 'Waking every hour or two?', 'Ask your pediatrician about night feeds']].filter(Boolean))),
      calls: { ped: 'night waking comes with a fever, poor feeding, or {s} {seem|seems} to be in pain.' } });
  }

  const routes = { 'chg:Sleep:d:routine': routinePage, 'chg:Sleep:d:shortnap': shortNapPage, 'chg:Sleep:d:wakes': wakesPage };
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) { return routes[p] ? routes[p]() : baseRoute.apply(this, arguments); };

  /* ---------- dressing pages after they draw ---------- */
  function dress() {
    const main = document.querySelector('#main'); if (!main) return;
    // Top card: the day's shape replaces the small drawing on the three- and two-nap stages.
    const hero = main.querySelector('.hub-page[data-overview="Sleep"]:not(.hub-detail) .hub-hero');
    if (hero && !hero.dataset.ssw) {
      hero.dataset.ssw = '1';
      const eb = ((hero.querySelector('.hub-eyebrow') || {}).firstChild || {}).textContent || '', art = hero.querySelector('.sl-art');
      const naps = /three/i.test(eb) ? ['Morning nap', 'Midday nap', 'Catnap'] : /two/i.test(eb) ? ['Morning nap', 'Afternoon nap'] : null;
      const h1 = ((hero.querySelector('h1') || {}).textContent || '');
      if (art && naps && /nap|rhythm|day/i.test(h1)) art.outerHTML = dayStrip(naps);
    }
    // Rough day: short naps and night waking open their own pages instead of folding open.
    const rough = main.querySelector('.hub-rough');
    if (rough && !rough.dataset.ssw) {
      rough.dataset.ssw = '1'; const mo = m();
      rough.querySelectorAll('details.hub-rough-item').forEach(d => {
        const t = ((d.querySelector('summary b') || {}).textContent || '').trim();
        const to = t === 'Short naps' && mo >= 3 ? 'shortnap' : t === 'Waking a lot at night' && mo >= 3 && mo < 8 ? 'wakes' : null;
        if (!to) return;
        const dot = d.querySelector('.hub-dot');
        d.outerHTML = `<button class="hub-rough-item hub-rough-link" onclick="${go('chg:Sleep:d:' + to)}">${dot ? dot.outerHTML : ''}<b>${F(t)}</b><span class="hub-chev" aria-hidden="true">›</span></button>`;
      });
    }
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
