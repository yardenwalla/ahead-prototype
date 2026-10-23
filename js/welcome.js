/* Ahead · Onboarding, using the guide's shared palette and illustrations. */
(function () {
  const POINTS = [
    ['spark', 'Everything in one place', 'Sleep, feeding, development, play, safety and checkups. One guide for the first year.'],
    ['dev', 'Know how to support your baby', 'Clear, digestible guidance on what they need and what you can do, without hours of research.'],
    ['explore', 'For your baby, as they grow', 'What’s relevant now and what to prepare for next, based on their age and what you’ve shared.']
  ];

  function welcomeHtml() {
    return `<section class="welcome aw">
      <div class="aw-intro"><div class="eyebrow">Your baby’s first year</div><div class="aw-baby" aria-hidden="true">${homeBabyArt()}</div></div>
      <h1><span>Less searching.</span><span>More confidence</span><span>in what’s next.</span></h1>
      <p class="aw-lead">Know what matters now and feel ready for what’s next, with guidance tailored to your baby.</p>
      <div class="aw-spectrum" aria-hidden="true">${Array(6).fill('<span></span>').join('')}</div>
      <div class="aw-points">${POINTS.map(([i, h, d]) => `<div class="promise aw-point"><span class="aw-point-icon" aria-hidden="true">${icon(i)}</span><div><h3>${h}</h3><p>${d}</p></div></div>`).join('')}</div>
      <button class="primary aw-start" onclick="startSetup()">Set up your baby’s guide →</button>
    </section>`;
  }

  // Preserve the setup form, validation and values from the main renderer.
  // Only its header changes; profile editing uses the same two-step flow.
  function setupHeader() {
    const first = setupStep === 1;
    return `<div class="aw-steps" aria-label="Step ${first ? 1 : 2} of 2"><span class="${first ? 'current' : 'complete'}">${first ? '1' : '✓'}<b>Your baby</b></span><i aria-hidden="true"></i><span class="${first ? '' : 'current'}">2<b>Milk feeding</b></span></div>
      <header class="aw-setup-heading"><div><div class="eyebrow">${first ? 'Your baby' : 'Milk feeding'}</div><h1>${first ? 'Let’s meet<br>your little one.' : 'What milk is<br>your baby having?'}</h1></div><span class="aw-setup-art" aria-hidden="true">${first ? homeBabyArt() : yearIllustration('Feeding', 0)}</span></header>`;
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

