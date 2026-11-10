/* Ahead · Baby's details, simpler and more complete (preview).
   The same page: Safety follows its four stages like the other rows, and editing reads like editing, not setup. */
(function () {
  const H = () => window.__hub;
  const adjustedMonth = m => developmentMonth(m);
  const ageMode = group => (profile.early && profile.due && profile.ageMode && profile.ageMode[group]) || 'adjusted';
  const esc2 = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  window.profMove = function (v) {
    if (v === 'none') { answers.roll = 'Not yet'; answers.rollDirection = 'Not yet'; answers.crawl = 'Not yet'; delete answers.pullUp; }
    if (v === 'rolling') { answers.roll = 'Yes'; answers.rollDirection = 'Both ways'; answers.crawl = 'Not yet'; delete answers.pullUp; }
    if (v === 'crawling') { answers.roll = 'Yes'; if (!answers.rollDirection || answers.rollDirection === 'Not yet') answers.rollDirection = 'Both ways'; answers.crawl = 'Yes'; delete answers.pullUp; }
    if (v === 'pulling') { answers.roll = 'Yes'; answers.crawl = 'Yes'; answers.pullUp = 'Yes'; }
    answers.movementSetByParent = true; delete answers.safetyPick;
    if (typeof markStage === 'function') markStage('movement');
    persist(); const y = scrollY; render(); scrollTo(0, y);
    if (typeof hubToast === 'function') hubToast('Updated', `Sleep, Safety and Home now match what ${name()} is doing.`);
  };
  if (typeof profileRework !== 'function') return;
    window.profileRework = profileRework = function () {
      const h = H(), nm = esc2(name());
      const photo = (() => { if (typeof hubPhotoFor !== 'function') return null; for (let m = 12; m >= 0; m--) { const p = hubPhotoFor(m); if (p) return typeof p === 'string' ? p : p.src || p.url || null; } return null; })();
      // A keepsake-style card: the baby's initial, name and age, with the details as tappable pills.
      const edit = step => `editingProfile=true;draft={...profile};setupStep=${step};openPage('setup')`;
      let b = `<section class="you-hero"><button class="you-edit" onclick="${edit(1)}" aria-label="Edit ${nm}’s details">Edit</button><div class="you-top">${photo ? `<span class="you-avatar has-photo" aria-hidden="true"><img src="${photo}" alt=""></span>` : `<span class="you-avatar" aria-hidden="true">${esc2((profile.name || 'B').charAt(0).toUpperCase())}</span>`}<div><h1>${nm}</h1><p class="you-age">${esc2(typeof babyAge === 'function' ? babyAge() : monthLabel(birthdayAge()))} old · <span style="white-space:nowrap">born ${esc2(parse(profile.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}</span></p></div></div>`
        + `<div class="you-pills"><button onclick="${edit(2)}">${hubArt('bottle', 'You')}<span>${esc2((() => { const f = profile.feed, how = f && f !== 'Formula' ? profile.feedHow : '', plus = f === 'Both' ? ' and formula' : ''; if (!f) return 'Milk not set'; if (f === 'Formula') return 'Formula'; if (how === 'Pumping') return 'Pumped breast milk' + plus; if (how === 'Stored') return 'Stored breast milk' + plus; return 'Breast milk' + plus + (how === 'Nursing' ? ' · nursing' : how === 'Both' ? ' · nursing and pumping' : ''); })())}</span></button><button onclick="${edit(1)}">${hubArt('smile', 'You')}<span>${esc2(babyPronounLabel())}</span></button></div></section>`;
      if (profile.early && profile.due) b += `<h2 class="hub-h2">Ages</h2>` + hubAgeBlock();
      // Where the baby is now: set it right here. Sleep, Feeding and Safety can be changed; the rest follow age.
      const pick = (cat, title, nowI, labels) => `<div class="hub-where-row" style="${yearTheme(cat)}"><span class="hub-dot" style="${yearTheme(cat)}">${catIcon(cat)}</span><div class="hub-where-copy"><b>${title}</b><div class="hub-where-chips" role="group" aria-label="${title} stage">${labels.map((l, i) => { const on = i === nowI, ok = on || stageCanChange(cat, i, nowI); return `<button class="${on ? 'is-on' : ''}" ${on ? `aria-pressed="true" onclick="hubToast('Already set','${esc2(title)} already shows ${esc2(l)}. Tap another stage to change it.')"` : ok ? `onclick="hubProfileStage('${cat}',${i})"` : 'disabled'}>${esc2(l)}</button>`; }).join('')}</div></div></div>`;
      const twoAges = profile.early && profile.due && adjustedMonth(actualMonth()) !== actualMonth();
      // Born early: say which age each one follows, since there are two.
      const fixed = (cat, title, label, basis) => `<div class="hub-where-row"><span class="hub-dot" style="${yearTheme(cat)}">${catIcon(cat)}</span><div class="hub-where-copy"><b>${title}</b><small>${esc2(label)} · ${twoAges ? (basis === 'birthday' ? `by ${nm}’s birthday age` : `by ${basis === 'dev' ? (ageMode('dev') === 'birthday' ? 'birthday' : 'adjusted') : (ageMode('care') === 'birthday' ? 'birthday' : 'adjusted')} age`) : `changes as ${nm} grows`}</small></div></div>`;
      const careRail = ['Newborn', '1–3 months', '4–6 months', '7–12 months'];
      const careNow = (() => { const d = (NOW - parse(profile.dob)) / 864e5, mm = hubAgeFor('care', actualMonth()); return careRail[d < 21 ? 0 : mm < 4 ? 1 : mm < 7 ? 2 : 3]; })();
      const chips = (opts, on, fn) => `<div class="hub-where-chips">${opts.map(([v, l]) => `<button class="${on === v ? 'is-on' : ''}" aria-pressed="${on === v}" onclick="${fn(v)}">${esc2(l)}</button>`).join('')}</div>`;
      const safetyRow = () => {
        const stage = STAGE_TABLE.Safety.stages[safeI] ? STAGE_TABLE.Safety.stages[safeI].label : '';
        const dm = safetyMonth(actualMonth());
        const moveNow = answers.pullUp === 'Yes' ? 'pulling' : answers.crawl === 'Yes' ? 'crawling' : (answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection)) ? 'rolling' : (answers.roll === 'Not yet' || answers.crawl === 'Not yet') ? 'none' : null;
        const ahead = { First_setup: 'none', Rolling: 'rolling', Crawling: 'crawling', 'Pulling up': 'pulling' };
        const why = stage === 'First setup' ? 'Showing first setup.' : `Showing the ${stage.toLowerCase()} stage${moveNow !== ahead[stage] ? `, so your home is ready before ${nm} gets there` : ''}.`;
        const opts = [['none', 'Not yet'], ['rolling', 'Rolling'], ...(dm >= 5 || moveNow === 'crawling' || moveNow === 'pulling' ? [['crawling', 'Crawling']] : []), ...(dm >= 6 || moveNow === 'pulling' ? [['pulling', 'Pulling up']] : [])];
        return `<div class="hub-where-row"><span class="hub-dot" style="${yearTheme('Safety')}">${catIcon('Safety')}</span><div class="hub-where-copy"><b>How ${nm} moves</b>${dm >= 2 ? chips(opts, moveNow, v => `profMove('${v}')`) : ''}<small>Safety · ${esc2(why)}</small></div></div>`;
      };
      const safeI = STAGE_TABLE.Safety.stages.findIndex(p => p.key === safetyGroup(safetyStageNow()));
      b += `<h2 class="hub-h2">Where ${nm} is now</h2><p class="hub-where-lead">This sets what each guide shows. Tap to change it if it’s not quite right.</p><section class="hub-card hub-where">`
        + pick('Feeding', 'Feeding', feedGroup(chgStageIndex('Feeding')), STAGE_TABLE.Feeding.stages.map(x => x.label))
        + pick('Sleep', 'Sleep', chgStageIndex('Sleep'), STAGE_TABLE.Sleep.stages.map(x => x.label))
        + pick('Safety', 'Safety', safeI, STAGE_TABLE.Safety.stages.map(x => x.label))
        + fixed('Development', 'Development & play', 'By ' + devRef(developmentMonth(actualMonth())) + ' months', 'dev')
        + fixed('Daily rhythm', 'Everyday care', careNow, 'care')
        + fixed('Health', 'Health', 'Next: ' + healthJourneyLabel(healthJourneyFocus()), 'birthday')
        + `</section>`;
      b += `<button class="you-link" onclick="openPage('trust')">How we choose guidance ›</button>`;
      b += h.note(window.AHEAD_STORAGE_PERSISTS === false ? 'This viewer can’t keep your entries after you close it. Open Ahead in your phone’s browser to keep them.' : 'Your answers, notes and photos stay on this phone.');
      return `<div class="quiet-category hub-page hub-detail" style="${yearTheme('You')}">${hubPageTop(`${esc2(name())}’s details`)}${b}</div>`;
    };
  // Editing: same two short steps, worded as editing
  const baseRender = window.render;
  if (typeof baseRender === 'function') window.render = render = function () {
    baseRender.apply(this, arguments);
    if (page !== 'setup' || !editingProfile) return;
    const m = document.getElementById('main'); if (!m) return;
    const nm = esc2(name());
    m.querySelectorAll('.progress').forEach(x => x.remove());
    const h1 = m.querySelector('h1'), eb = m.querySelector('.eyebrow'), btn = m.querySelector('#setupForm .primary');
    if (setupStep === 1) { if (h1) h1.textContent = `${nm}’s details`; if (eb) eb.textContent = 'Edit'; if (btn) btn.textContent = 'Next'; }
    else { if (h1) h1.textContent = `How ${nm} has milk`; if (eb) eb.textContent = 'Edit'; if (btn) btn.textContent = 'Save'; m.querySelectorAll('.setup-advice').forEach(x => x.remove()); }
    m.querySelectorAll('#feed option').forEach(o => { if (o.textContent === 'Both') { o.value = 'Both'; o.textContent = 'Breast milk and formula'; } });
  };
})();
