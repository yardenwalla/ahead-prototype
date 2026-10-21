/* Ahead · Welcome and setup
   Same layout as the original welcome, new copy, and the app's colors and type. */
(function () {
  // The original welcome layout (mark, eyebrow, headline, promise, three points, button),
  // with the app's colors: each point uses its category's color and illustration.
  const POINTS = [
    ['Development', 'One change, everything it touches', 'When your baby starts rolling, see what it means for sleep, safety and play.'],
    ['Sleep', 'Only what matters now', 'A few things for this month, not a book to read.'],
    ['Health', 'From trusted sources', 'Based on AAP and CDC guidance, with links so you can check.']
  ];
  const SPECTRUM = ['#e5e0fc', '#f7d9e5', '#d9e5fc', '#ddf1e5', '#f7e6c4', '#cceee7'];

  function welcomeHtml() {
    return `<section class="welcome aw">
      <div class="aw-mark" aria-hidden="true">${SPECTRUM.map(c => `<span style="background:${c}"></span>`).join('')}</div>
      <div class="eyebrow">Your baby’s first year</div>
      <h1>Know what’s coming,<br>before it happens.</h1>
      <p class="aw-lead">Ahead follows your baby’s age and shows what’s next a few weeks early, along with everything it changes.</p>
      <div class="aw-points">${POINTS.map(([t, h, d]) => `<div class="promise aw-point" style="${yearTheme(t)}"><span class="connected-row-icon" aria-hidden="true">${yearIllustration(t, 1)}</span><div><h3>${h}</h3><p>${d}</p></div></div>`).join('')}</div>
      <button class="primary aw-start" onclick="startSetup()">Set up your baby’s timeline →</button>
      <small>About a minute. Your answers stay on this device.</small>
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
