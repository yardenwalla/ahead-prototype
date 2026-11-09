/* Ahead · Home at a glance (Nov 9 prototype).
   One screen that answers "what's going on with Maya right now?":
     Right now      the change that's closest, with its usual window and where Maya is on it
     At a glance    one line per area, from the same stage each category page leads with
     This month     up to 3 things worth getting ready, taken from what the closest changes affect
     Coming up next the next two changes on the Timeline, which keeps the whole year
   Everything comes from the Timeline's changes and the category stages, so Home, Timeline and Categories agree.
   Nothing to log, nothing to fill in. */
(function () {
  const Y = () => window.__ya, H = () => window.__hub, F = s => H().F(s);
  const chev = '<span class="hub-chev" aria-hidden="true">›</span>';
  const on = () => { try { return localStorage.getItem('ahead-home-classic') !== '1'; } catch (e) { return true; } };

  // How Home says each change when it's the one that's closest. Plain speech, one line.
  const HEAD = {
    crying: 'The fussy weeks are here', smile: 'First smiles are close', nights: 'Nights are starting to stretch',
    regress: 'Sleep may get bumpy for a few weeks', roll: 'Rolling could start any day', ready: 'Getting ready for solids',
    solids: 'First foods are close', twonaps: 'Three naps are becoming two', crawl: 'Maya is getting ready to move',
    sit: 'Sitting up on {p} own', tooth: 'A first tooth is on the way', finger: 'Thicker textures, and finger foods',
    meals: 'Meals are becoming part of the day', carseat: 'The next car seat', sep: 'Goodbyes may get harder',
    pull: 'Pulling up to stand', words: 'First words are close', milk: 'Time to switch to whole milk', steps: 'First steps are close'
  };
  const firstSentence = t => (String(t).match(/^.*?[.!?](\s|$)/) || [t])[0].trim();

  function changes() {
    const y = Y(), a = y.ageNow(), done = y.doneNow();
    const ahead = y.C.filter(c => c.end > a && !done[c.id] && y.PAGES[c.id]).sort((p, q) => p.start - q.start || p.end - q.end);
    return { a, now: ahead.filter(c => c.start <= a + 1).slice(0, 3), later: ahead.filter(c => c.start > a + 1) };
  }

  function hero(c, a) {
    const y = Y(), p = y.PAGES[c.id];
    return `<section class="hg-hero" style="${yearTheme(c.cat)}">
      <span class="hg-hero-art" aria-hidden="true">${typeof homeMonthArt === 'function' ? homeMonthArt(actualMonth()).replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ') : ''}</span>
      <div class="hg-hero-copy">
        <p class="hg-eyebrow">${F('Right now')}</p>
        <h1>${F(HEAD[c.id] || c.title)}</h1>
        <p class="hg-lead">${F(y.TOUCH[c.id] || firstSentence(p.lead))}</p>
        <div class="hg-window"><span class="hg-window-label"><b>${F(y.range(c))}</b> · ${F(y.whenShort(c, a))}</span>${y.windowBar(c, a)}</div>
        <button class="hg-btn" onclick="${c.go}">${F('See what it changes')} <span aria-hidden="true">→</span></button>
      </div></section>`;
  }

  // Four areas, one short line each: the stage that area's page leads with today.
  const GLANCE = [['Feeding', 'Feeding'], ['Sleep', 'Sleep'], ['Development', 'Development'], ['Health', 'Health']];
  function glance() {
    const tile = ([cat, label]) => `<button class="hg-tile" style="${yearTheme(cat)}" onclick="openPage('topic:${cat}')"><span class="hg-tile-ic">${typeof catIcon === 'function' ? catIcon(cat) : ''}</span><b>${F(typeof displayTopic === 'function' ? displayTopic(label) : label)}</b><small>${F(window.home2TileLine ? home2TileLine(cat) : '')}</small></button>`;
    return `<h2 class="hg-h2">${F('At a glance')}</h2><div class="hg-tiles">${GLANCE.map(tile).join('')}</div>`;
  }

  // What the closest changes affect, one row each, taking turns so no single change fills the list.
  // Play ideas wait for the change's own page; these are the things worth doing before it arrives.
  function focus(now) {
    const y = Y(), picked = [], seen = new Set();
    for (let i = 0; i < 4 && picked.length < 3; i++) for (const c of now) {
      const r = y.PAGES[c.id].rows.filter(r => r[1] !== 'Development')[i];
      if (r && !seen.has(r[4]) && picked.length < 3) { seen.add(r[4]); picked.push([c, r]); }
    }
    if (!picked.length) return '';
    const row = ([c, [icon, cat, title, sub, go]]) => `<button class="hub-row hg-row" onclick="${go}"><span class="hub-dot">${hubArt(icon, cat)}</span><span class="hub-row-copy"><small class="hub-row-eyebrow">${F(c.title)}</small><b>${F(title)}</b><small>${F(sub)}</small></span>${chev}</button>`;
    return `<h2 class="hg-h2">${F('This month’s focus')}</h2><div class="hub-list hg-list">${picked.map(row).join('')}</div>`;
  }

  function comingUp(later, a) {
    const two = later.slice(0, 2); if (!two.length) return '';
    const when = c => { const m = Math.max(Math.ceil(a), Math.floor(c.start)); return m >= 12 ? 'Around 1 year' : `${m} months`; };
    return `<button class="hg-next" onclick="navigate('next')"><span class="hg-next-head"><b>${F('Coming up next')}</b><em>${F('Timeline')} ›</em></span>
      <span class="hg-stops">${two.map(c => `<span class="hg-stop" style="${yearTheme(c.cat)}"><i aria-hidden="true"></i><small>${F(when(c))}</small><span class="hg-stop-row"><span class="hg-stop-art">${hubArt(c.icon, c.cat)}</span><b>${F(c.title)}</b></span><span class="hg-stop-why">${F(c.why)}</span></span>`).join('')}</span></button>`;
  }

  function paintGlance() {
    const main = document.getElementById('main'); if (!main || !Y() || !H()) return;
    const ageLine = main.querySelector('.home-age-line'), question = main.querySelector('.connected-checkin');
    const { a, now, later } = changes();
    if (!now.length) return;   // past the first year's changes: keep the usual Home
    let h = '<div class="hg-page">' + (ageLine ? ageLine.outerHTML : '');
    // The change that asks most of the parent leads; ties go to the one that's closest.
    const RANK = ['crawl', 'roll', 'pull', 'ready', 'solids', 'steps', 'sit', 'finger', 'meals', 'milk', 'crying', 'regress', 'twonaps', 'tooth', 'sep', 'carseat', 'nights', 'smile', 'words'];
    const lead = now.slice().sort((p, q) => RANK.indexOf(p.id) - RANK.indexOf(q.id))[0];
    h += hero(lead, a);
    h += question ? question.outerHTML : '';
    h += glance() + focus([lead, ...now.filter(c => c !== lead)]) + comingUp(later, a);
    h += `<p class="connected-preview-footnote">${F('Ahead isn’t medical advice and doesn’t replace your pediatrician.')}</p></div>`;
    main.innerHTML = h;
  }

  const baseRender = window.render;
  window.render = render = function () {
    const r = baseRender.apply(this, arguments);
    try { if (on() && page === 'home' && (typeof isCurrent !== 'function' || isCurrent())) paintGlance(); } catch (e) { console.error(e); }
    return r;
  };
  window.homeGlanceClassic = off => { try { off ? localStorage.setItem('ahead-home-classic', '1') : localStorage.removeItem('ahead-home-classic'); } catch (e) {} render(); };
})();
