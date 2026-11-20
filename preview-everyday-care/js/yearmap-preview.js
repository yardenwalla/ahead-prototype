/* PREVIEW · Year Ahead as a map of the year.
   Not a tab: opened from "Explore the first year" on Home. One shared month axis,
   one row per category, each stage drawn as a band across the months it usually
   covers, and a "Today" line through all of them. */
(function () {
  const DATA = window.AHEAD_CHANGES;
  const W = 62;            // pixels per month
  const MONTHS = 12;

  function rows() {
    const sleepAt = [[0, 1.5], [1.5, 4], [4, 6], [6, 12]];
    const feedAt = [[0, 1.5], [1.5, 4], [4, 6], [6, 8], [8, 10], [10, 12]];
    const r = [];
    r.push({ cat: 'Sleep', bands: DATA.Sleep.CH.map((c, i) => ({ from: sleepAt[i][0], to: sleepAt[i][1], label: c.rail, go: `openPage('chg:Sleep:s:${i}')` })) });
    r.push({ cat: 'Feeding', bands: DATA.Feeding.CH.map((c, i) => ({ from: feedAt[i][0], to: feedAt[i][1], label: c.rail, go: `openPage('chg:Feeding:s:${i}')` })) });
    r.push({ cat: 'Development', bands: [[2, 0, 2], [4, 2, 4], [6, 4, 6], [9, 6, 9], [12, 9, 12]].map(([k, a, b]) => ({ from: a, to: b, label: DEV_STAGES[k].title, go: `openPage('development-stage:${k}')` })) });
    r.push({ cat: 'Safety', bands: [['setup', 0, 3], ['reaching', 3, 4], ['rolling', 4, 7], ['moving', 7, 9], ['pulling', 9, 12]].map(([k, a, b]) => ({ from: a, to: b, label: SAFETY_MOVEMENT_STAGES.find(s => s.key === k).rail, go: `openSafetyStage('${k}',true)` })) });
    r.push({ cat: 'Health', dots: [0, 1, 2, 4, 6, 9, 12].map(a => ({ at: a, label: a === 0 ? '1 wk' : a + ' mo', go: `openPage('health-visit:${a}')` })) });
    r.push({ cat: 'Daily rhythm', dots: Array.from({ length: 13 }, (_, a) => ({ at: a, label: '', go: `openPage('play-stage:${a}')`, small: true })) });
    return r;
  }

  window.yearHub = yearHub = function () {
    const age = Math.min(MONTHS, Math.max(0, (NOW - parse(profile.dob)) / (30.44 * 864e5)));
    const width = (MONTHS + 0.6) * W;
    const backControl = backButton().replace('class="back"', 'class="monthly-back"').replace(/(<\/svg>)[\s\S]*?<\/button>/, '$1</button>');
    const axis = Array.from({ length: MONTHS + 1 }, (_, m) => `<span class="ym-tick ${m % 3 === 0 ? 'is-major' : ''}" style="left:${m * W + 8}px">${m % 3 === 0 ? (m === 0 ? 'Birth' : m + ' mo') : ''}</span>`).join('');
    const body = rows().map(row => {
      const inner = row.bands
        ? row.bands.map(b => { const now = age >= b.from && age < b.to; return `<button class="ym-band ${now ? 'is-now' : age >= b.to ? 'is-past' : ''}" style="left:${b.from * W + 8}px;width:${(b.to - b.from) * W - 4}px" onclick="${b.go}" title="${esc(b.label)}"><span>${esc(b.label)}</span></button>`; }).join('')
        : row.dots.map(d => `<button class="ym-dot ${d.small ? 'is-small' : ''} ${age >= d.at ? 'is-past' : ''}" style="left:${d.at * W + 8}px" onclick="${d.go}" aria-label="${displayTopic(row.cat)} ${d.label || 'month ' + d.at}"><i></i>${d.label ? `<span>${d.label}</span>` : ''}</button>`).join('');
      return `<div class="ym-row" style="${yearTheme(row.cat)}"><button class="ym-name" onclick="openPage('year:${row.cat}')"><i></i>${displayTopic(row.cat) === 'Play & everyday activities' ? 'Play' : displayTopic(row.cat)}</button><div class="ym-lane" style="width:${width}px">${inner}</div></div>`;
    }).join('');
    return `<div class="quiet-category parent-guide ym-page"><div class="category-page-header"><div class="monthly-page-header">${backControl}<div><h1>Year Ahead</h1><p>${name()}’s first year</p></div><span aria-hidden="true"></span></div></div>
      <p class="ym-lede">Every part of the first year on one map. The line shows where ${name()} is now.</p>
      <div class="ym-map" id="ym-map"><div class="ym-scroll" id="ym-scroll"><div class="ym-axis" style="width:${width}px">${axis}</div>${body}<div class="ym-today" style="left:${age * W + 8}px"><span>Today</span></div></div></div>
      <p class="ym-hint">Scroll sideways to see the whole year. Tap a stage to read about it, or a category name for its full year.</p>
      <p class="exp-footer">Typical timing, not deadlines. Every baby moves at their own pace.</p></div>`;
  };

  // Open the map scrolled so today sits a third of the way in
  const baseRender = render;
  window.render = render = function () {
    baseRender();
    const nav = document.getElementById('nav');
    if (nav) [...nav.querySelectorAll('button')].forEach(b => { if (/Year Ahead/.test(b.textContent)) b.remove(); });
    const sc = document.getElementById('ym-scroll'), t = sc && sc.querySelector('.ym-today');
    if (sc && t) { const age = (NOW - parse(profile.dob)) / (30.44 * 864e5); sc.scrollLeft = Math.max(0, (Math.floor(age) - 1.3) * W); }
  };
  const baseTab = activeNavigationTab;
  window.activeNavigationTab = activeNavigationTab = function () { const t = baseTab(); return t === 'year' ? 'home' : t; };
  // Year Ahead is a page you open, so it gets a back button: give it a history entry
  const baseNavigate = navigate;
  window.navigate = navigate = function (p) { if (p === 'year') return openPage('year'); return baseNavigate(p); };
})();
