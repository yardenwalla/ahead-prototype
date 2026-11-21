/* Ahead · Onboarding, using the guide's shared palette and illustrations. */
(function () {
  const POINTS = [
    ['spark', 'Everything in one place', 'Get answers about sleep, feeding and everyday care, all based on what pediatricians recommend.'],
    ['rhythm', 'Know what’s coming', 'See what’s changing before it happens, so nothing catches you off guard.'],
    ['dev', 'Made for your baby', 'Focus on what matters for your baby’s age and stage right now.']
  ];
  const POINT_ART = { spark: ['book', 'Development', '#efedff'], rhythm: ['clock', 'Sleep', '#edf2fe'], dev: ['heart', 'Feeding', '#fceef3'] };
  // Nov 20 refresh (Yarden's inspiration board): the welcome shows the app instead of describing it, and setup uses
  // big tap targets (pronoun buttons, milk cards) and the same soft photos as the Guides. The form underneath is unchanged:
  // the new buttons only set the original fields, so saving, validation and profile edits work as before.
  const IMG = (src, cls) => `<img class="${cls || ''}" src="${src}" alt="" decoding="async">`;
  function welcomeHtml() {
    return `<section class="welcome aw ob-welcome">
      <h1><span>What matters now.</span><span>What’s coming next.</span></h1>
      <p class="aw-lead">Guidance matched to your baby’s exact age, all through the first year.</p>
      <div class="ob-collage" aria-hidden="true">
        <div class="ob-mini ob-mini-tl"><b>Timeline</b><small>What’s coming up</small><div class="ob-tl"><i></i><span></span><i></i><span></span><i></i><span></span></div></div>
        <div class="ob-mini ob-mini-guides"><b>Guides</b><small>Answers by stage</small><div class="ob-mini-pic">${IMG('assets/feeding/first-foods.jpg')}</div><span class="ob-bar"></span><span class="ob-bar short"></span></div>
        <div class="ob-mini ob-mini-home"><b>Home</b><small>What matters now</small><div class="ob-mini-month">${IMG('assets/dev/hero-12.jpg')}</div><div class="ob-mini-row"><span class="ob-dot">${IMG('assets/dev/toy-gym.jpg')}</span><span class="ob-bar"></span></div><div class="ob-mini-row"><span class="ob-dot">${IMG('assets/dev/toy-soft-rattle.jpg')}</span><span class="ob-bar short"></span></div></div>
      </div>
      <button class="primary aw-start" onclick="startSetup()">Get started</button>
      <p class="ob-time">About a minute to set up</p>
    </section>`;
  }

  // Steps: a back arrow beside two dots on a line, then a Guides-style photo that melts into the page, then the question.
  function setupHeader() {
    const first = setupStep === 1;
    return `<div class="ob-top"><div class="ob-progress" aria-label="Step ${first ? 1 : 2} of 2"><span class="ob-step ${first ? 'on' : 'done'}"><b>Your baby</b><i>${first ? '' : '✓'}</i></span><span class="ob-line ${first ? '' : 'full'}"></span><span class="ob-step ${first ? '' : 'on'}"><b>Feeding</b><i></i></span></div></div>
      <div class="ob-hero ${first ? 'ob-hero-baby' : 'ob-hero-milk'}" aria-hidden="true">${IMG(first ? 'assets/onboarding/bunny.jpg' : 'assets/onboarding/bottle.jpg')}</div>
      <h1 class="ob-q">${first ? 'Let’s meet your little one.' : 'How is your baby fed?'}</h1>`;
  }

  const MILK = [['Breast milk', 'Breast milk', '', 'drop'], ['Formula', 'Formula', '', 'bottle'], ['Both', 'Both', 'Breast milk and formula', 'both']];
  const MILK_ICON = {
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5c3 3.6 5.5 6.9 5.5 10a5.5 5.5 0 0 1-11 0c0-3.1 2.5-6.4 5.5-10z"/></svg>',
    bottle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2.8h4M10.5 2.8v2.4h3V2.8M9 5.2h6l.8 2.3v12a1.8 1.8 0 0 1-1.8 1.8h-4a1.8 1.8 0 0 1-1.8-1.8v-12zM8.4 11h3M8.4 14h3"/></svg>',
    both: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 6c2.2 2.6 4 5 4 7.3a4 4 0 0 1-8 0C4.5 11 6.3 8.6 8.5 6zM15.5 6c2.2 2.6 4 5 4 7.3a4 4 0 0 1-8 0"/></svg>'
  };
  const HOW = [['Nursing', 'Nursing'], ['Pumping', 'Pumped'], ['Both', 'Nursing + pumped'], ['Stored', 'Freezer stash']];

  function seg(cls, items, value, label) {
    return `<div class="ob-seg ${cls}" role="radiogroup" aria-label="${label}">${items.map(([v, t]) => `<button type="button" role="radio" data-v="${v}" aria-checked="${v === value}">${t}</button>`).join('')}</div>`;
  }
  // One listener on the page (other scripts may redraw the form's HTML, which drops listeners on its elements).
  const SEG_FOR = { 'ob-pron': '#babyPronouns', 'ob-milk': '#feed', 'ob-how': '#feedHow' };
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('#setupForm [role=radiogroup] button[data-v]');
    if (b) { const wrap = b.parentNode, key = Object.keys(SEG_FOR).find(k => wrap.classList.contains(k)), select = key && document.querySelector(SEG_FOR[key]);
      if (!select) return;
      select.value = b.dataset.v; select.dispatchEvent(new Event('change', { bubbles: true }));
      wrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-checked', String(x === b)));
      if (key === 'ob-milk') { const f = b.closest('form'), err = f.querySelector('#formError'); if (err) err.hidden = true; f.classList.remove('ob-need'); }
      return; }
  }, true);

  // Nothing picked yet: say so here instead of the browser's hidden-field error.
  const baseSubmit = window.submitSetup;
  window.submitSetup = submitSetup = function (e) {
    const feed = document.querySelector('#setupForm #feed');
    if (feed && !feed.value && typeof feed.closest === 'function' && document.querySelector('#setupForm .ob-milk')) { e && e.preventDefault(); const form = feed.closest('form'), err = form.querySelector('#formError');
      if (err) { err.textContent = 'Pick the closest one. You can change it anytime.'; err.hidden = false; }
      form.classList.add('ob-need'); const f = form.querySelector('.ob-milk button'); f && f.focus(); return; }
    return baseSubmit.apply(this, arguments);
  };

  function paintDates(root) {
    (root || document).querySelectorAll('.ob-date').forEach(w => {
      const inp = w.querySelector('input'), t = w.querySelector('.ob-date-text'); if (!inp || !t) return;
      const v = inp.value, d = v ? new Date(v + 'T12:00:00') : null;
      t.textContent = d && !isNaN(d) ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date';
      w.classList.toggle('has-value', !!v);
    });
  }
  ['input', 'change'].forEach(ev => document.addEventListener(ev, e => { if (e.target && e.target.closest && e.target.closest('.ob-date')) paintDates(); }, true));
  // On a computer, clicking anywhere on the field opens the calendar (phones already do this).
  document.addEventListener('click', e => { const inp = e.target && e.target.closest && e.target.closest('.ob-date input');
    if (inp && typeof inp.showPicker === 'function') { try { inp.showPicker(); } catch (err) {} } }, true);

  function enhanceSetup(main) {
    const back = main.querySelector(':scope > button.back, .back'), top = main.querySelector('.ob-top');
    if (back && top) { top.prepend(back); back.classList.add('ob-back'); }
    const form = main.querySelector('#setupForm'); if (!form) return;
    // Step 1: pronouns as three buttons; the born-early box says why it matters.
    const pro = form.querySelector('#babyPronouns');
    if (pro) { pro.classList.add('ob-hidden'); pro.tabIndex = -1; pro.setAttribute('aria-hidden', 'true');
      pro.insertAdjacentHTML('afterend', seg('ob-pron', [['they', 'They'], ['he', 'He'], ['she', 'She']], pro.value, 'How should we refer to your baby?'));
      const l = form.querySelector('label[for="babyPronouns"]'); if (l) l.removeAttribute('for'); }
    const early = form.querySelector('#early');
    if (early) { const l = early.closest('label'); [...l.childNodes].forEach(n => n.nodeType === 3 && n.remove());
      l.insertAdjacentHTML('beforeend', '<span class="ob-early"><b>Born before 37 weeks?</b><small>We’ll use the original due date where adjusted age matters.</small></span>');
      // The due date opens inside the same card, so the two read as one question.
      const due = form.querySelector('#dueBox'), card = document.createElement('div'); card.className = 'ob-early-card';
      l.parentNode.insertBefore(card, l); card.appendChild(l); if (due) { card.appendChild(due);
        const h = due.querySelector('.hint'); if (h) h.textContent = 'Guidance follows the due date; checkups follow the birthday.'; } }
    // Name: no "Optional" tag; one line says why we ask.
    const nm = form.querySelector('#babyName');
    if (nm) { const l = form.querySelector('label[for="babyName"]'); if (l) { const h = l.querySelector('.hint'); h && h.remove(); }
      nm.insertAdjacentHTML('afterend', '<p class="ob-help">We’ll use it throughout the app.</p>'); }
    // Dates: a calm "Select a date" field with a calendar icon that shows the date in words; the phone's own picker
    // still opens underneath (the real date input sits on top, invisible, so taps reach it).
    form.querySelectorAll('input[type=date]').forEach(inp => {
      if (inp.closest('.ob-date')) return;
      const wrap = document.createElement('div'); wrap.className = 'ob-date';
      inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp);
      inp.insertAdjacentHTML('beforebegin', '<span class="ob-date-text" aria-hidden="true"></span><svg class="ob-date-ic" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>');
    });
    paintDates(form);
    // Step 2: milk as three cards, then how breast milk is given as buttons, right under them.
    const feed = form.querySelector('#feed');
    if (feed) {
      feed.required = false; feed.classList.add('ob-hidden'); feed.tabIndex = -1; feed.setAttribute('aria-hidden', 'true');
      const intro = form.querySelector('.hint'); if (intro && /fits your day/.test(intro.textContent)) { intro.className = 'ob-sub'; intro.removeAttribute('style'); intro.textContent = 'So feeding tips fit how you actually feed. Change it anytime.'; }
      form.querySelectorAll('p.hint').forEach(h => /update this anytime/.test(h.textContent) && h.remove());
      const fl = form.querySelector('label[for="feed"]'); if (fl) fl.remove();
      feed.insertAdjacentHTML('afterend', `<div class="ob-milk" role="radiogroup" aria-label="How is your baby fed?">${MILK.map(([v, t, sub, ic]) => `<button type="button" role="radio" data-v="${v}" aria-checked="${feed.value === v}"><span class="ob-milk-ic ob-ic-${ic}">${MILK_ICON[ic]}</span><span class="ob-milk-t"><b>${t}</b>${sub ? `<small>${sub}</small>` : ''}</span><i aria-hidden="true"></i></button>`).join('')}</div>`);
      const how = form.querySelector('#feedHow');
      if (how) { how.classList.add('ob-hidden'); how.tabIndex = -1; how.setAttribute('aria-hidden', 'true');
        const hl = form.querySelector('label[for="feedHow"]'); if (hl) { hl.removeAttribute('for'); hl.textContent = 'How is breast milk given?'; }
        how.insertAdjacentHTML('afterend', seg('ob-how', HOW, how.value, 'How is breast milk given?'));
      }
      // The payoff button says the baby's name when we have it.
      const nameNow = (typeof draft !== 'undefined' && draft && draft.name || '').trim(), go = form.querySelector('button.primary');
      if (go && nameNow && /See what matters now/.test(go.textContent)) go.textContent = `See what matters for ${nameNow} →`;
    }
  }

  const baseRender = render;
  window.render = render = function () {
    const out = baseRender.apply(this, arguments);
    const main = document.querySelector('#main');
    if (main) {
      main.classList.toggle('is-onboarding', page === 'welcome' || page === 'setup');
      // Setup steps drop the app header (logo) so each step fits on one screen, like the inspiration board.
      if (document.body && document.body.classList) document.body.classList.toggle('ob-steps', page === 'setup');
      if (page === 'welcome') main.innerHTML = welcomeHtml();
      if (page === 'setup') {
        main.innerHTML = main.innerHTML.replace(/<div class="progress">[\s\S]*?(?=<form class="form")/, setupHeader());
        enhanceSetup(main);
      }
    }
    return out;
  };
})();

