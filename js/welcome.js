/* Ahead · Welcome and setup
   Same layout as the original welcome, new copy, and the app's colors and type. */
(function () {
  // The original welcome layout and icons, with the app's type.
  const POINTS = [
    ['spark', 'Everything in one place', 'Sleep, feeding, development, play, safety and checkups. One guide for the first year.'],
    ['dev', 'Know how to support your baby', 'Clear, digestible guidance on what they need and what you can do—without hours of research.'],
    ['explore', 'For your baby, as they grow', 'What’s relevant now and what to prepare for next, based on their age and what you’ve shared.']
  ];

  function welcomeHtml() {
    return `<section class="welcome aw">
      <div class="eyebrow">Your baby’s first year</div>
      <h1>Less searching.<br>More confidence in what’s next.</h1>
      <p class="aw-lead">Know what matters now and feel ready for what’s next, with guidance tailored to your baby.</p>
      <div class="aw-points">${POINTS.map(([i, h, d]) => `<div class="promise aw-point">${icon(i)}<div><h3>${h}</h3><p>${d}</p></div></div>`).join('')}</div>
      <button class="primary aw-start" onclick="startSetup()">Set up your baby’s guide →</button>
    </section>`;
  }

  const baseRender = render;
  window.render = render = function () {
    const out = baseRender.apply(this, arguments);
    const main = document.querySelector('#main');
    if (main) {
      main.classList.toggle('is-onboarding', page === 'welcome' || page === 'setup');
      if (page === 'welcome') main.innerHTML = welcomeHtml();
    }
    return out;
  };
})();
