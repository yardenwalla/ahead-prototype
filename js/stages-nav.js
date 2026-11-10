/* Ahead · Stages behind a small chip instead of a strip at the top of every category.
   Each category page leads with the baby's stage. A small "All stages ›" chip on the top card's first line
   ("All checkups ›" in Health) opens a stages page: a vertical list with each stage's ages, one line on what
   changes, and the baby's stage marked. Reading another stage shows a Preview banner with "Back to [name]'s
   stage" and, where a parent can change it (Sleep, Feeding, Safety), "Make this [name]'s stage". */
(function () {
  if (typeof window.stageTimeline !== 'function') return;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const nm = () => esc(typeof name === 'function' ? name() : 'your baby');
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const TITLE = { Sleep: 'Sleep by age', Feeding: 'Feeding by age', Safety: 'Safety by age', Development: 'Development by age', 'Daily rhythm': 'Everyday care by age', Health: 'Checkups' };
  const LEAD = {
    Sleep: 'Sleep changes in steps. Tap one to see what to expect.',
    Feeding: 'From milk to first foods to family meals. Tap one to see what to expect.',
    Safety: 'Each new skill brings a few things to change at home, before your baby can reach them.',
    Development: 'What most babies do by each age. Tap one to see what to look for.',
    'Daily rhythm': 'How everyday care changes through the first year.',
    Health: 'Seven checkups in the first year. Tap one to see what happens.'
  };
  // One line per stage: what changes there. Kept to what each stage page already says.
  const ONE = {
    Sleep: ['Short sleeps around the clock, waking to feed', 'Days and nights sort out, and one sleep stretches longer', 'Naps settle into set times, with a regular bedtime', 'A morning and an afternoon nap, and longer nights'],
    Feeding: ['Lots of feeds, day and night, while Maya learns to eat', 'Feeds get quicker and further apart', 'Milk is still everything, and the signs for solids show up', 'First tastes, textures and lots of mess', 'Three meals a day, and milk still matters'],
    Safety: ['Car seat, crib and changing spot, set up once', 'Swaddle off, and small things off the floor', 'Gates, locks and covers before Maya moves', 'Furniture anchored, and water and the stove out of reach'],
    Development: ['First looks and smiles', 'Smiles, little sounds and swiping at toys', 'Reaching, laughing and rolling', 'Sitting up, babbling and finding things', 'Waving, copying and pulling up'],
    'Daily rhythm': ['The cord, diapers and first sponge baths', 'Tub baths start, and care settles into a rhythm', 'Drool, teething and more fun at bath time', 'Brushing starts with the first tooth'],
    Health: ['Feeding, weight and a jaundice check', 'Growth, feeding and how you’re doing', 'The first main round of vaccines', 'Movement, feeding and sleep questions, and vaccines', 'First foods and teeth, and vaccines', 'A short development questionnaire', 'Anemia and lead checks, milk and cups, and vaccines']
  };
  const CHANGEABLE = ['Sleep', 'Feeding', 'Safety'];
  const fill = s => String(s).replace(/Maya/g, typeof name === 'function' ? name() : 'your baby');
  const ageOf = it => it.age && !/^By |months?$|^Newborn$|^First week$/.test(it.label) ? it.age : '';

  let last = null, seen = null; const store = {};
  window.stageTimeline = function (cat, items) { last = seen = { cat, items }; store[cat] = items; return ''; };
  // For checks: the stages behind the page last shown (what the old strip drew).
  window.stageItemsLast = () => seen;
  if (window.__hub) window.__hub.pills = (label, items, cat) => window.stageTimeline(cat || 'Development', items, label);

  const nowTag = cat => cat === 'Health' ? 'Next checkup' : `Where ${nm()} is now`;
  const topicGo = cat => `openPage('topic:${cat}')`;

  function stagesPage(cat) {
    const items = store[cat] || [];
    const ci = items.findIndex(x => x.now);
    const list = items.map((it, i) => {
      const cls = it.now ? 'is-now' : ci >= 0 && i < ci ? 'is-past' : '';
      let age = ageOf(it);
      // Checkups behind the baby say whether they're marked, so a parent can see what may have been missed.
      if (cat === 'Health' && ci >= 0 && i < ci) { try { const v = WELL_VISITS[i], r = typeof healthRecord === 'function' ? healthRecord(v) : null, sk = (() => { try { return !!(JSON.parse(localStorage.getItem('ahead-visit-skipped:' + journeyKey())) || {})[v]; } catch (e) { return false; } })(); age = r && r.status === 'attended' ? 'Done' : sk ? 'Skipped' : 'Not marked yet · tap to add it'; } catch (e) {} }
      return `<li class="st-item ${cls}"><span class="st-node" aria-hidden="true">${it.now && typeof catIcon === 'function' ? catIcon(cat) : ''}</span><button class="st-card" onclick="${it.now ? topicGo(cat) : it.onclick}">${it.now ? `<span class="st-tag">${nowTag(cat)}</span>` : ''}<b>${esc(it.label)}</b>${age ? `<small class="st-age">${esc(age)}</small>` : ''}<span class="st-one">${esc(fill((ONE[cat] || [])[i] || ''))}</span><span class="st-chev" aria-hidden="true">›</span></button></li>`;
    }).join('');
    const foot = cat === 'Health' ? `Checkups follow ${nm()}’s birthday.` : CHANGEABLE.includes(cat) ? `Ages are typical. If another one fits ${nm()} better, open it and tap “This fits ${nm()}”.` : 'Ages are typical. Every baby moves at their own pace.';
    return `<div class="quiet-category hub-page hub-detail" style="${yearTheme(cat)}">${hubPageTop(TITLE[cat] || 'Stages')}<p class="st-lead">${esc(LEAD[cat] || '')}</p><ol class="st-list">${list}</ol><p class="st-foot">${foot}</p></div>`;
  }

  const baseRender = window.render;
  window.render = render = function () {
    const m = document.getElementById('main');
    if (typeof page === 'string' && page.startsWith('stages:')) {
      const cat = page.slice(7), keep = page;
      page = 'topic:' + cat; try { baseRender.apply(this, arguments); } catch (e) {} page = keep;   // refreshes the stage list
      if (m) m.innerHTML = stagesPage(cat);
      return;
    }
    last = null;
    baseRender.apply(this, arguments);
    if (!last || !m) return;
    const { cat, items } = last;
    const pg = m.querySelector('.hub-page') || m;
    const kids = [...pg.children].filter(e => !e.matches('.monthly-page-header, .hub-preview, nav, .hub-agebasis'));
    const hero = kids.find(e => e.matches('.hub-hero, .dev-hero, header')) || kids[0];   // the top card (skip the born-early age switch)
    // The chip: on the top card's first line when it has one, otherwise in its top corner.
    if (hero && !m.querySelector('.st-chip')) {
      const chip = `<button class="st-chip" onclick="openPage('stages:${cat}')">${cat === 'Health' ? 'All checkups' : 'All ages'} <span aria-hidden="true">›</span></button>`;
      const eb = hero.querySelector('.hub-eyebrow');
      if (eb && hero.firstElementChild === eb) { eb.classList.add('st-eyebrow'); eb.insertAdjacentHTML('beforeend', chip); }
      else { hero.classList.add('st-has-chip'); hero.insertAdjacentHTML('afterbegin', chip.replace('class="st-chip"', 'class="st-chip st-chip-abs"')); }
    }
    // Reading another stage: say so, with a way back (and a way to make it the baby's stage where that's allowed).
    const ci = items.findIndex(x => x.now), oi = items.findIndex(x => x.on);
    if (!live() || ci < 0 || oi < 0 || oi === ci) return;
    const on = items[oi];
    // A small card: what you're reading, and the way back. Where a parent can change the stage, two equal buttons.
    const old = m.querySelector('.hub-preview');
    const what = oi < ci ? 'Looking back' : cat === 'Health' ? 'Coming up' : 'Previewing';
    const stage = cat === 'Health' ? on.label.replace(/ months?$/, '-month').replace('First week', 'First-week') + ' checkup' : on.label;
    const when = ['Development', 'Daily rhythm', 'Health'].includes(cat) ? '' : ageOf(on) || (old && old.querySelector('span') ? old.querySelector('span').textContent.replace(/^[^·]*·\s*/, '') : '');
    const backTxt = cat === 'Health' ? 'your next checkup' : `where ${nm()} is now`;
    const changeable = on.change && CHANGEABLE.includes(cat);
    const icon = typeof catIcon === 'function' ? catIcon(cat) : '';
    const html = `<section class="hub-preview st-banner${changeable ? ' has-make' : ''}" aria-label="${what}"><div class="st-banner-top"><span class="st-banner-icon" aria-hidden="true">${icon}</span><div class="st-banner-copy"><small>${what}</small><b>${esc(stage)}${when ? ` <i>· ${esc(when)}</i>` : ''}</b></div>${changeable ? '' : `<button class="st-btn st-btn-back" onclick="${topicGo(cat)}">Back to ${backTxt}</button>`}</div>${changeable ? `<div class="st-banner-actions"><button class="st-btn st-btn-back" onclick="${topicGo(cat)}">Back to ${backTxt}</button><button class="st-btn st-btn-make" onclick="${on.change}">This fits ${nm()}</button></div>` : ''}</section>`;
    if (old) old.outerHTML = html; else if (hero) hero.insertAdjacentHTML('beforebegin', html);
  };
  if (typeof activeNavigationTab === 'function') {
    const baseTab = activeNavigationTab;
    window.activeNavigationTab = activeNavigationTab = function () { return typeof page === 'string' && page.startsWith('stages:') ? 'categories' : baseTab(); };
  }
})();
