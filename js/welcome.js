/* Ahead · Welcome and setup
   The first screen shows the app's promise the way the app itself works:
   one change in your baby, and everything it affects, a few weeks early.
   Built from the app's own components (the Home hero, connected rows, category colors). */
(function () {
  const SPECTRUM = ['#e5e0fc', '#f7d9e5', '#d9e5fc', '#ddf1e5', '#f7e6c4', '#cceee7'];
  // A sample of what one change touches, shown as the rows parents will see on Home.
  const EXAMPLE = [
    { topic: 'Sleep', art: 0, title: 'Stop swaddling at the first attempt to roll', body: 'Switch to a sleep sack with arms free.' },
    { topic: 'Safety', art: 0, title: 'Clear the floor around the play mat', body: 'Rolling puts new things within reach.' },
    { topic: 'Development', art: 1, title: 'What to notice as rolling starts', body: 'Tummy to back usually comes first.' },
    { topic: 'Daily rhythm', art: 1, title: 'A floor game that helps with rolling', body: 'Place a toy just out of reach.' }
  ];
  const row = r => `<div class="connected-row aw-row" style="${yearTheme(r.topic)}"><span class="connected-row-icon" aria-hidden="true">${yearIllustration(r.topic, r.art)}</span><span class="connected-row-copy"><small>${displayTopic(r.topic)}</small><b>${r.title}</b><span>${r.body}</span></span></div>`;
  const POINTS = [
    ['Only what matters now', 'A few things for this month, not a book to read.'],
    ['Moves with your baby', 'Stages update as your baby grows. Born early? We use adjusted age.'],
    ['From trusted sources', 'Based on AAP and CDC guidance, with links so you can check.']
  ];

  function welcomeHtml() {
    return `<section class="aw" aria-labelledby="aw-title">
      <div class="home-summary aw-hero">
        <div class="home-summary-heading"><div class="home-month-eyebrow">Your baby’s first year</div><h1 id="aw-title">Know what’s coming, before it happens.</h1></div>
        <span class="home-summary-art" aria-hidden="true">${homeMonthArt(5)}</span>
        <p class="heroanswer">Ahead follows your baby’s age and shows what’s next a few weeks early, along with everything it changes.</p>
        <div class="home-summary-spectrum" aria-hidden="true">${SPECTRUM.map(c => `<span style="background:${c}"></span>`).join('')}</div>
      </div>
      <section class="aw-example">
        <div class="connected-section-heading"><h2>One change, everything it touches</h2></div>
        <p class="aw-sub">For example, when your baby starts to roll:</p>
        <div class="aw-rows">${EXAMPLE.map(row).join('')}</div>
      </section>
      <ul class="aw-points">${POINTS.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ul>
      <button class="primary aw-start" onclick="startSetup()">Set up your baby’s timeline</button>
      <p class="aw-note">About a minute. Your answers stay on this device.</p>
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
