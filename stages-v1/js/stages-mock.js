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
  const TITLE = { Sleep: 'Sleep stages', Feeding: 'Feeding stages', Safety: 'Safety stages', Development: 'Development by age', 'Daily rhythm': 'Everyday care by age', Health: 'Checkups' };
  const LEAD = {
    Sleep: 'Sleep changes in steps. Tap a stage to see what to expect.',
    Feeding: 'From milk to first foods to family meals. Tap a stage to see what to expect.',
    Safety: 'Each stage brings a few things to change at home, before your baby can reach them.',
    Development: 'What most babies do by each age. Tap one to see what to look for.',
    'Daily rhythm': 'How everyday care changes through the first year.',
    Health: 'Seven checkups in the first year. Tap one to see what happens.'
  };
  // One line per stage: what changes there. Kept to what each stage page already says.
  const ONE = {
    Sleep: ['Short sleeps around the clock, waking to feed', 'Days and nights sort out, and one sleep stretches longer', 'Naps settle into set times, with a regular bedtime', 'A morning and an afternoon nap, and longer nights'],
    Feeding: ['Breast milk or formula is everything Maya needs', 'Watching for readiness signs and getting set up', 'First tastes, then textures, then three meals a day'],
    Safety: ['Car seat, crib and changing spot, set up once', 'Swaddle off, and small things off the floor', 'Gates, locks and covers before Maya moves', 'Furniture anchored, and water and the stove out of reach'],
    Development: ['First looks and smiles', 'Smiles, little sounds and swiping at toys', 'Reaching, laughing and rolling', 'Sitting up, babbling and finding things', 'Waving, copying and pulling up'],
    'Daily rhythm': ['The cord, diapers and first sponge baths', 'Tub baths start, and care settles into a rhythm', 'Drool, teething and more fun at bath time', 'Brushing starts with the first tooth'],
    Health: ['Feeding, weight and a jaundice check', 'Growth, feeding and how you’re doing', 'The first main round of vaccines', 'Movement, feeding and sleep questions, and vaccines', 'First foods and teeth, and vaccines', 'A short development questionnaire', 'Anemia and lead checks, milk and cups, and vaccines']
  };
  const CHANGEABLE = ['Sleep', 'Feeding', 'Safety'];
  const fill = s => String(s).replace(/Maya/g, typeof name === 'function' ? name() : 'your baby');
  const ageOf = it => it.age && !/^By |months?$|^Newborn$|^First week$/.test(it.label) ? it.age : '';

  let last = null; const store = {};
  window.stageTimeline = function (cat, items) { last = { cat, items }; store[cat] = items; return ''; };
  if (window.__hub) window.__hub.pills = (label, items, cat) => window.stageTimeline(cat || 'Development', items, label);

  const nowTag = cat => cat === 'Health' ? 'Next checkup' : `${nm()}’s stage now`;
  const topicGo = cat => `openPage('topic:${cat}')`;

  function stagesPage(cat) {
    const items = store[cat] || [];
    const ci = items.findIndex(x => x.now);
    const list = items.map((it, i) => {
      const cls = it.now ? 'is-now' : ci >= 0 && i < ci ? 'is-past' : '';
      const age = ageOf(it);
      return `<li class="st-item ${cls}"><span class="st-node" aria-hidden="true">${it.now && typeof catIcon === 'function' ? catIcon(cat) : ''}</span><button class="st-card" onclick="${it.now ? topicGo(cat) : it.onclick}">${it.now ? `<span class="st-tag">${nowTag(cat)}</span>` : ''}<b>${esc(it.label)}</b>${age ? `<small class="st-age">${esc(age)}</small>` : ''}<span class="st-one">${esc(fill((ONE[cat] || [])[i] || ''))}</span><span class="st-chev" aria-hidden="true">›</span></button></li>`;
    }).join('');
    const foot = cat === 'Health' ? `Checkups follow ${nm()}’s birthday.` : CHANGEABLE.includes(cat) ? `Ages are typical. If ${nm()} seems more like another stage, open it and tap “Make this ${nm()}’s stage”.` : 'Ages are typical. Every baby moves at their own pace.';
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
      const chip = `<button class="st-chip" onclick="openPage('stages:${cat}')">${cat === 'Health' ? 'All checkups' : 'All stages'} <span aria-hidden="true">›</span></button>`;
      const eb = hero.querySelector('.hub-eyebrow');
      if (eb && hero.firstElementChild === eb) { eb.classList.add('st-eyebrow'); eb.insertAdjacentHTML('beforeend', chip); }
      else { hero.classList.add('st-has-chip'); hero.insertAdjacentHTML('afterbegin', chip.replace('class="st-chip"', 'class="st-chip st-chip-abs"')); }
    }
    // Reading another stage: say so, with a way back (and a way to make it the baby's stage where that's allowed).
    const ci = items.findIndex(x => x.now), oi = items.findIndex(x => x.on);
    if (!live() || ci < 0 || oi < 0 || oi === ci) return;
    const on = items[oi];
    const back = `<button onclick="${topicGo(cat)}">${cat === 'Health' ? 'Back to the next checkup' : `Back to ${nm()}’s stage`}</button>`;
    const make = on.change && CHANGEABLE.includes(cat) ? `<button class="st-make" onclick="${on.change}">Make this ${nm()}’s stage</button>` : '';
    const banner = m.querySelector('.hub-preview');
    if (banner) {
      if (!/Back to/.test(banner.innerHTML)) banner.insertAdjacentHTML('beforeend', back);
      if (make && !banner.querySelector('.st-make')) banner.insertAdjacentHTML('beforeend', make);
    } else if (hero) {
      const what = oi < ci ? 'Looking back' : cat === 'Health' ? 'Coming up' : 'Preview';
      const age = ['Development', 'Daily rhythm', 'Health'].includes(cat) ? on.label : ageOf(on);
      hero.insertAdjacentHTML('beforebegin', `<div class="hub-preview"><span>${what}${age ? ' · ' + esc(age) : ''}</span>${back}${make}</div>`);
    }
  };
  if (typeof activeNavigationTab === 'function') {
    const baseTab = activeNavigationTab;
    window.activeNavigationTab = activeNavigationTab = function () { return typeof page === 'string' && page.startsWith('stages:') ? 'categories' : baseTab(); };
  }
})();
