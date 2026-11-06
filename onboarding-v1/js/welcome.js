/* Ahead · Onboarding, using the guide's shared palette and illustrations. */
(function () {
  const POINTS = [
    ['spark', 'Everything in one place', 'From sleep and feeding to development and everyday care, get practical guidance based on what pediatricians recommend, whenever you need it.'],
    ['rhythm', 'Helpful things, right when you need them', 'Get timely tips and heads-ups about what’s changing, what matters now, and what to prepare for next.'],
    ['dev', 'Made for your baby', 'Guidance tailored to your baby’s age and stage, so you can focus on what’s relevant to you.']
  ];
  // The memory book's taped polaroids, holding the app's own baby (or, on the milk step, the bottle).
  const polaroids = (art, tape = '#f2a7b8', size = '') => `<span class="aw-polar${size}" aria-hidden="true"><span class="aw-p-back"></span><span class="aw-p-mid"></span><span class="aw-p-front" style="--tape:${tape}"><i></i><span class="aw-p-photo">${art}</span></span></span>`;
  const POINT_ART = { spark: ['book', 'Development', '#efedff'], rhythm: ['clock', 'Sleep', '#edf2fe'], dev: ['heart', 'Feeding', '#fceef3'] };
  function welcomeHtml() {
    return `<section class="welcome aw">
      <div class="aw-intro"><div class="eyebrow">Your baby’s first year</div>${polaroids(homeBabyArt())}</div>
      <h1><span>Less searching.</span><span>More confidence</span><span>in what’s next.</span></h1>
      <p class="aw-lead">Everything you need to understand your baby, care for them with confidence, and enjoy every new stage.</p>
      <div class="aw-spectrum" aria-hidden="true">${['#e5e0fc','#f7d9e5','#d9e5fc','#ddf1e5','#f7e6c4','#cfe9f4','#fde3d3','#f8edb3'].map(c => `<span style="background:${c}"></span>`).join('')}</div>
      <div class="aw-points">${POINTS.map(([i, h, d]) => `<div class="promise aw-point"><span class="aw-point-icon" aria-hidden="true" style="background:${(POINT_ART[i] || [])[2] || ''}">${typeof hubArt === 'function' && POINT_ART[i] ? hubArt(POINT_ART[i][0], POINT_ART[i][1]) : icon(i)}</span><div><h3>${h}</h3><p>${d}</p></div></div>`).join('')}</div>
      <button class="primary aw-start" onclick="startSetup()">Set up your baby’s guide →</button>
    </section>`;
  }

  // Preserve the setup form, validation and values from the main renderer.
  // Only its header changes; profile editing uses the same two-step flow.
  function setupHeader() {
    const first = setupStep === 1;
    return `<div class="aw-steps" aria-label="Step ${first ? 1 : 2} of 2"><span class="${first ? 'current' : 'complete'}">${first ? '1' : '✓'}<b>Your baby</b></span><i aria-hidden="true"></i><span class="${first ? '' : 'current'}">2<b>Milk feeding</b></span></div>
      <header class="aw-setup-heading"><div><div class="eyebrow">${first ? 'Your baby' : 'Milk feeding'}</div><h1>${first ? 'Let’s meet<br>your little one.' : 'What milk is<br>your baby having?'}</h1></div><span class="aw-setup-art" aria-hidden="true">${polaroids(first ? homeBabyArt() : (typeof hubArt === 'function' ? hubArt('bottle', 'Feeding') : yearIllustration('Feeding', 0)), first ? '#f2a7b8' : '#a9c4ef', ' is-small')}</span></header>`;
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
      }
    }
    return out;
  };
})();

