/* Ahead · Health's look: the same warm design as Sleep and Development, with no change to Health's content.
   - A soft gradient top card in Health's green, with the same quiet white circle.
   - Each row's icon square takes a soft color for what it's about, the way Sleep's rows follow the time of day:
     the checkup itself (what to expect, vaccines, questions) in greens and blues, the in-between pages in warmer tones. */
(function () {
  const ROW = [
    [/^What to expect/i, '#e6f5ec', '#356651'],
    [/^Vaccines/i, '#e7effc', '#46638c'],
    [/^Questions and notes/i, '#fff3dc', '#8a6a2a'],
    [/seems sick/i, '#fdeee6', '#9a5a3c'],
    [/^Colds/i, '#e7effc', '#46638c'],
    [/^How are you doing/i, '#fdeef2', '#a24d6a']
  ];
  function dress() {
    const page = document.querySelector('#main .hub-page[data-overview="Health"]:not(.hub-detail)');
    if (!page || !page.dataset || page.dataset.look) return;
    page.dataset.look = '1';
    const hero = page.querySelector('.hub-hero');
    if (hero) hero.classList.add('hl-hero');
    page.querySelectorAll('.hub-row').forEach(r => {
      const t = ((r.querySelector('.hub-row-copy b') || {}).textContent || '').trim();
      const m = ROW.find(([re]) => re.test(t));
      if (!m) return;
      r.classList.add('hl-row'); r.style.setProperty('--hl-bg', m[1]); r.style.setProperty('--hl-ink', m[2]);
    });
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
})();
