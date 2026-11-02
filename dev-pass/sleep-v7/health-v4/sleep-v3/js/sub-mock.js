/* MOCKUP ONLY: calmer Sleep subpages.
   1 The header takes the color of the row you tapped (naps: day, night sleep: night, routine: dusk, safe sleep: Sleep blue).
   2 Charts use the soft time-of-day colors instead of dark navy.
   3 "What to do" is the one thing that stands out; "What's happening" is one short line above it; "How you'll know" is a small note.
   4 One visual and one action: tips fold into the steps, and "Done" is a quiet button. */
(function () {
  const COLORS = { 'Naps': ['#fff3dc', '#f3d58a', '#8a6a2a'], 'Three naps': ['#fff3dc', '#f3d58a', '#8a6a2a'], 'Two naps': ['#fff3dc', '#f3d58a', '#8a6a2a'], 'Night sleep': ['#e3e6f6', '#8e9ad0', '#3d4a7a'], 'Night feeds': ['#e3e6f6', '#8e9ad0', '#3d4a7a'], 'Routine': ['#f6e8f3', '#e3b8cf', '#7a4f74'], 'Bedtime': ['#f6e8f3', '#e3b8cf', '#7a4f74'] };
  function dress() {
    const page = document.querySelector('#main .hub-detail[data-overview="Sleep"], #main .hub-page.hub-detail');
    if (!page || page.dataset.sub || !/Sleep/.test((page.querySelector('.monthly-page-header') || {}).textContent || '')) return;
    page.dataset.sub = '1';
    const head = page.querySelector('.hub-detail-head');
    const label = (head && head.querySelector('.hub-context, p') || {}).textContent || '';
    const [bg, mid, ink] = COLORS[label.trim()] || ['#e7effc', '#9fb8df', '#46638c'];
    page.style.setProperty('--sub-bg', bg); page.style.setProperty('--sub-mid', mid); page.style.setProperty('--sub-ink', ink);
    page.classList.add('sub-calm');
    // 3: split the three bold-led paragraphs.
    const moment = page.querySelector('.hub-moment');
    if (moment) {
      const ps = [...moment.querySelectorAll('p')], find = re => ps.find(p => re.test((p.querySelector('b') || {}).textContent || ''));
      const what = find(/happening/i), todo = find(/to do/i), know = find(/know/i);
      let html = '';
      if (what) { what.querySelector('b').remove(); html += `<p class="sub-what">${what.innerHTML.trim()}</p>`; }
      if (todo) { todo.querySelector('b').remove(); html += `<section class="sub-do"><b>What to do</b><p>${todo.innerHTML.trim()}</p></section>`; }
      if (know) { know.querySelector('b').remove(); html += `<p class="sub-know"><b>How you’ll know:</b> ${know.innerHTML.trim()}</p>`; }
      ps.filter(p => ![what, todo, know].includes(p)).forEach(p => { html += p.outerHTML; });
      moment.outerHTML = `<section class="hub-moment sub-moment">${html}</section>`;
    }
    // 4: fold a tip into the steps card (or under "What to do"), and quiet the Done button.
    const tip = page.querySelector('.hub-tip'), steps = page.querySelector('.hub-steps'), doCard = page.querySelector('.sub-do');
    if (tip) { const t = `<p class="sub-tipline"><b>${(tip.querySelector('b') || {}).textContent || 'Tip'}</b> ${tip.textContent.replace((tip.querySelector('b') || {}).textContent || '', '').trim()}</p>`; (doCard || (steps && steps.closest('.hub-card')) || page).insertAdjacentHTML('beforeend', t); tip.remove(); }
    if (steps && doCard) { const old = steps.closest('.hub-card'); doCard.appendChild(steps); if (old && !old.textContent.trim()) old.remove(); }
    const done = page.querySelector('.hub-actions .hub-button'); if (done) done.classList.add('sub-quiet');
  }
  const base = window.render;
  window.render = render = function (...a) { const r = base.apply(this, a); try { dress(); } catch (e) { console.error(e); } return r; };
  const css = document.createElement('style');
  css.textContent = `
#main .sub-calm .hub-detail-head { background: var(--sub-bg); border-radius: 24px; padding: 20px 20px 22px; margin: 0 0 16px; position: relative; overflow: hidden }
#main .sub-calm .hub-detail-head::after { content: ""; position: absolute; right: -40px; top: -50px; width: 150px; height: 150px; border-radius: 50%; background: #fff; opacity: .4 }
#main .sub-calm .hub-detail-head > * { position: relative; z-index: 1 }
#main .sub-calm .hub-detail-head .hub-big { display: none }
#main .sub-calm .hub-detail-head .hub-context { color: var(--sub-ink); margin: 0 0 4px }
#main .sub-calm .hub-detail-head h1 { margin: 0 }
#main .sub-calm .hub-figure { box-shadow: none }
#main .sub-calm .hub-figure svg[stroke], #main .sub-calm .hub-figure svg [stroke]:not([stroke="none"]) { stroke: var(--sub-ink) }
#main .sub-calm .hub-figure .is-now, #main .sub-calm .hub-figure [class*=is-now] { background: var(--sub-bg) !important }
#main .sub-calm .hub-range-track i, #main .sub-calm .hub-range-row.is-now .hub-range-track i { background: var(--sub-mid) !important }
#main .sub-calm .hub-range-value, #main .sub-calm .hub-range-track b { color: var(--sub-ink) !important }
#main .sub-calm [style*="#34406a"], #main .sub-calm [fill="#34406a"] { fill: var(--sub-mid) }
#main .sub-calm .hub-dayline [data-k="night"], #main .sub-calm .hub-strip-seg.is-night { background: var(--sub-mid) !important }
#main .sub-moment { margin-top: 16px }
#main .sub-what { margin: 0 4px 12px; font-size: 15px; line-height: 1.55; color: #4c4757 }
#main .sub-do { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 16px 18px; margin: 0 0 12px }
#main .sub-do > b { display: block; font-size: 13px; font-weight: 700; color: var(--sub-ink); margin-bottom: 6px }
#main .sub-do > p { margin: 0; font-size: 15.5px; line-height: 1.55; color: var(--ink) }
#main .sub-do .hub-steps { margin: 12px 0 0; padding-top: 12px; border-top: 1px solid var(--line) }
#main .sub-know { margin: 0 4px 10px; font-size: 13.5px; line-height: 1.5; color: #6b6670 }
#main .sub-know b { font-weight: 600; color: #4c4757 }
#main .sub-tipline { margin: 12px 0 0; padding-top: 12px; border-top: 1px solid var(--line); font-size: 13.5px; line-height: 1.5; color: #6b6670 }
#main .sub-tipline b { color: var(--sub-ink); font-weight: 600 }
#main .hub-button.sub-quiet { background: var(--sub-bg) !important; color: var(--sub-ink) !important; border: 0 }
`;
  document.head.appendChild(css);
})();
