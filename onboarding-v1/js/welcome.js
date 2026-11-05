/* Ahead · Onboarding, using the guide's shared palette and illustrations. */
(function () {
  const POINTS = [
    ['spark', 'Everything in one place', 'From sleep and feeding to development and everyday care, get practical guidance based on what pediatricians recommend, whenever you need it.'],
    ['rhythm', 'Helpful things, right when you need them', 'Get timely tips and heads-ups about what’s changing, what matters now, and what to prepare for next.'],
    ['dev', 'Made for your baby', 'Guidance tailored to your baby’s age and stage, so you can focus on what’s relevant to you.']
  ];
  // Point 1 shows the categories together; the others use the app's item pictures.
  function pointArt(i) {
    const pick = { spark: ['book', 'Development'], rhythm: ['clock', 'Sleep'], dev: ['heart', 'Feeding'] }[i];
    return typeof hubArt === 'function' && pick ? hubArt(pick[0], pick[1]) : icon(i);
  }
  function welcomeHtml() {
    return `<section class="welcome aw">
      <div class="aw-hero" aria-hidden="true"><div class="aw-grow">${[[1, 'Newborn'], [6, '6 months'], [10, '1 year']].map(([m, l], i) => `<figure style="--i:${i}"><span>${homeMonthArt(m)}</span><figcaption>${l}</figcaption></figure>`).join('<i></i>')}</div></div>
      <div class="eyebrow aw-eb">Your baby’s first year</div>
      <h1><span>Less searching.</span><span>More confidence</span><span>in what’s next.</span></h1>
      <p class="aw-lead">Everything you need to understand your baby, care for them with confidence, and enjoy every new stage.</p>
      <div class="aw-spectrum" aria-hidden="true">${['#e5e0fc','#f7d9e5','#d9e5fc','#ddf1e5','#f7e6c4','#cfe9f4','#fde3d3','#f8edb3'].map(c => `<span style="background:${c}"></span>`).join('')}</div>
      <div class="aw-points">${POINTS.map(([i, h, d]) => `<div class="promise aw-point"><span class="aw-point-icon is-${i}" aria-hidden="true">${pointArt(i)}</span><div><h3>${h}</h3><p>${d}</p></div></div>`).join('')}</div>
      <button class="primary aw-start" onclick="startSetup()">Set up your baby’s guide →</button>
    </section>`;
  }

  // Preserve the setup form, validation and values from the main renderer.
  // Only its header changes; profile editing uses the same two-step flow.
  function setupHeader() {
    const first = setupStep === 1;
    return `<div class="aw-steps" aria-label="Step ${first ? 1 : 2} of 2"><span class="${first ? 'current' : 'complete'}">${first ? '1' : '✓'}<b>Your baby</b></span><i aria-hidden="true"></i><span class="${first ? '' : 'current'}">2<b>Milk feeding</b></span></div>
      <header class="aw-setup-heading"><div><div class="eyebrow">${first ? 'Your baby' : 'Milk feeding'}</div><h1 id="awTitle">${first ? (draft.name ? `Let’s meet<br>${esc(draft.name)}.` : 'Let’s meet<br>your little one.') : `What milk is<br>${draft.name ? esc(draft.name) : 'your baby'} having?`}</h1>${first ? `<p class="aw-age" id="awAge"${draft.dob ? '' : ' hidden'}>${ageLine(draft.dob, draft.name)}</p>` : ''}</div><span class="aw-setup-art" aria-hidden="true">${first ? homeBabyArt() : yearIllustration('Feeding', 0)}</span></header>`;
  }

  function ageLine(dob, nm) {
    if (!dob) return '';
    const b = parse(dob), d = Math.floor((NOW - b) / 864e5); if (d < 0) return '';
    let m = (NOW.getFullYear() - b.getFullYear()) * 12 + NOW.getMonth() - b.getMonth(); if (NOW.getDate() < b.getDate()) m--;
    const since = new Date(b); since.setMonth(b.getMonth() + m); const w = Math.floor((NOW - since) / 864e5 / 7);
    const age = d < 7 ? `${d} day${d === 1 ? '' : 's'} old` : d < 91 ? `${Math.floor(d / 7)} weeks old` : `${m} months${w ? ` and ${w} week${w > 1 ? 's' : ''}` : ''} old`;
    return `<span aria-hidden="true">✦</span> ${esc(nm || 'Your baby')} is ${age}${d === 0 ? '. Welcome to the world' : ''}`;
  }
  // Step 2: milk as four tappable choices instead of a dropdown (the hidden select still does the saving).
  const MILK = [['Breast milk', 'drop', 'Breast milk'], ['Formula', 'bottle', 'Formula'], ['Both', 'heart', 'Both'], ['Prefer not to say', 'leaf', 'Prefer not to say']];
  window.awMilk = v => { const s = document.getElementById('feed'); if (s) s.value = v; draft.feed = v; document.querySelectorAll('.aw-milk button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v)); };
  function wireSetup(main) {
    const nmI = main.querySelector('#babyName'), dob = main.querySelector('#dob'), title = main.querySelector('#awTitle'), age = main.querySelector('#awAge');
    const update = () => { const nm = nmI ? nmI.value.trim() : ''; if (title && nmI) title.innerHTML = nm ? `Let’s meet<br>${esc(nm)}.` : 'Let’s meet<br>your little one.'; if (age && dob) { const l = ageLine(dob.value, nm); age.innerHTML = l; age.hidden = !l; } };
    if (nmI) nmI.addEventListener('input', update); if (dob) dob.addEventListener('input', update), dob.addEventListener('change', update);
    const feed = main.querySelector('#feed');
    if (feed && !main.querySelector('.aw-milk')) {
      const cur = draft.feed || feed.value;
      feed.closest('form').querySelector('label[for=feed]').hidden = true; feed.hidden = true;
      feed.insertAdjacentHTML('afterend', `<div class="aw-milk" role="group" aria-label="Milk feeds">${MILK.map(([v, a, l]) => `<button type="button" data-v="${v}" aria-pressed="${cur === v}" onclick="awMilk('${v}')"><span>${typeof hubArt === 'function' ? hubArt(a, 'Feeding') : ''}</span>${l}</button>`).join('')}</div>`);
    }
  }

  const baseRender = render;
  window.render = render = function () {
    const out = baseRender.apply(this, arguments);
    const main = document.querySelector('#main');
    if (main) {
      main.classList.toggle('is-onboarding', page === 'welcome' || page === 'setup');
      if (page === 'welcome') main.innerHTML = welcomeHtml();
      if (page === 'setup') {
        main.innerHTML = main.innerHTML.replace(/<div class="progress">[\s\S]*?(?=<form class="form")/, setupHeader());
        wireSetup(main);
      }
    }
    return out;
  };
})();

