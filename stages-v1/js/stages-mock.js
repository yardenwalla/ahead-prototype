/* Ahead · Mock (Sleep only): stages behind a "See all stages" row instead of a strip at the top.
   The page leads with the baby's stage; one row under the top card opens a stages page (a vertical list with
   what changes at each stage and "Ari's stage now"). Reading another stage keeps the Preview banner, which
   also offers "Make this Ari's stage" where a parent can change it. */
(function () {
  const CAT = 'Sleep';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const ONE = [
    'Short sleeps around the clock, waking to feed',
    'Days and nights sort out, and one sleep stretches longer',
    'Naps settle into set times, with a regular bedtime',
    'A morning and an afternoon nap, and longer nights'
  ];
  const live = () => typeof isCurrent !== 'function' || isCurrent();
  const cur = () => (typeof chgStageIndex === 'function' ? chgStageIndex(CAT) : 0);
  const nm = () => esc(typeof name === 'function' ? name() : 'your baby');

  function allRow() {
    const T = STAGE_TABLE[CAT].stages, c = cur();
    const dots = T.map((s, i) => `<i class="${i < c ? 'is-past' : i === c ? 'is-now' : ''}"></i>`).join('');
    return `<button class="st-all" onclick="openPage('stages:${CAT}')"><span class="st-dots" aria-hidden="true">${dots}</span><span class="st-all-copy"><b>See all sleep stages</b><small>${nm()} is in ${esc(T[c].label)} · ${c + 1} of ${T.length}</small></span><span class="st-chev" aria-hidden="true">›</span></button>`;
  }

  function stagesPage() {
    const T = STAGE_TABLE[CAT].stages, c = cur();
    const items = T.map((s, i) => {
      const go = i === c ? `openPage('topic:${CAT}')` : `chgGo('chg:${CAT}:s:${i}')`;
      return `<li class="st-item ${i === c ? 'is-now' : i < c ? 'is-past' : ''}"><span class="st-node" aria-hidden="true">${i === c && typeof catIcon === 'function' ? catIcon(CAT) : ''}</span><button class="st-card" onclick="${go}">${i === c ? `<span class="st-tag">${nm()}’s stage now</span>` : ''}<b>${esc(s.label)}</b><small class="st-age">${esc(s.age || '')}</small><span class="st-one">${esc(ONE[i] || '')}</span><span class="st-chev" aria-hidden="true">›</span></button></li>`;
    }).join('');
    return `<div class="quiet-category hub-page hub-detail" style="${yearTheme(CAT)}">${hubPageTop('Sleep stages')}<p class="st-lead">Sleep changes in steps. Tap a stage to see what to expect.</p><ol class="st-list">${items}</ol><p class="st-foot">Ages are typical. If ${nm()}’s sleep looks more like another stage, open it and tap “Make this ${nm()}’s stage”.</p></div>`;
  }

  const baseOpen = window.openPage;
  const baseRender = window.render;
  window.render = render = function () {
    if (typeof page === 'string' && page === 'stages:' + CAT) {
      const m = document.getElementById('main');
      try { baseRender.apply(this, arguments); } catch (e) {}
      if (m) { m.innerHTML = stagesPage(); }
      return;
    }
    baseRender.apply(this, arguments);
    if (typeof page !== 'string' || !live()) return;
    const onTopic = page === 'topic:' + CAT, sm = page.match(/^chg:Sleep:s:(\d+)$/);
    if (!onTopic && !sm) return;
    const m = document.getElementById('main'); if (!m) return;
    m.querySelectorAll('nav.hub-stagebar').forEach(n => n.remove());
    const hero = m.querySelector('header.hub-hero');
    if (hero && !m.querySelector('.st-all')) hero.insertAdjacentHTML('afterend', allRow());
    if (sm) {
      const i = Number(sm[1]), c = cur(), banner = m.querySelector('.hub-preview');
      if (banner && i !== c && typeof stageCanChange === 'function' && stageCanChange(CAT, i, c)) {
        banner.insertAdjacentHTML('beforeend', `<button class="st-make" onclick="hubChangeStage('${CAT}',${i})">Make this ${nm()}’s stage</button>`);
      }
    }
  };
  // Keep the Categories tab lit on the stages page.
  if (typeof activeNavigationTab === 'function') {
    const baseTab = activeNavigationTab;
    window.activeNavigationTab = activeNavigationTab = function () { return typeof page === 'string' && page.startsWith('stages:') ? 'categories' : baseTab(); };
  }
})();
