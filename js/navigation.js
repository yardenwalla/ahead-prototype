/* Browser history follows the same views as the app's own navigation.
   No baby details or notes go into the URL. History entries contain only view state. */
(function () {
  if (!window.history || typeof window.history.pushState !== 'function') return;
  const KEY = 'aheadNavigation';
  const baseRender = render, baseBack = back;
  let started = false, restoring = false, appBack = false, current = null, inheritedPrevious = null;
  let entries = [], cursor = -1, serial = 0;
  const context = () => journeyKey();
  const signature = s => [s.page, s.month, s.step].join('|');
  const snapshot = () => ({[KEY]: 1, id: Date.now() + ':' + (++serial), context: context(), page, month, step: setupStep,
    followAge: month === actualMonth(), previous: current ? current.previous : inheritedPrevious,
    stack: [...historyStack], scroll: window.scrollY || 0});
  const usable = s => s && s[KEY] === 1 && s.context === context() &&
    typeof s.page === 'string' && Number.isInteger(s.month) && s.month >= 0 && s.month <= 12;
  function restore(s) {
    page = s.page; month = s.followAge ? actualMonth() : s.month; setupStep = s.step === 2 ? 2 : 1;
    historyStack = Array.isArray(s.stack) ? [...s.stack] : [];
  }
  function retainSetup() {
    if (page !== 'setup') return;
    if (setupStep === 2) { const feed = document.querySelector('#feed'); if (feed) draft.feed = feed.value; }
    else {
      const field = id => document.querySelector('#' + id);
      if (field('babyName')) draft = {...draft, name: field('babyName').value,
        pronouns: field('babyPronouns').value, dob: field('dob').value,
        early: field('early').checked, due: field('due').value};
    }
  }
  window.render = render = function () {
    if (!started) {
      const state = window.history.state;
      // Partial setup is not stored; a reload safely starts that short form again.
      if (usable(state) && !['setup', 'welcome'].includes(state.page)) { restore(state); inheritedPrevious = state.previous || null; }
      started = true;
    }
    const result = baseRender.apply(this, arguments), next = snapshot();
    if (restoring) { next.id = current.id; current = next; entries[cursor] = next; return result; }
    if (!current || current.context !== next.context) {
      if (current && current.context !== next.context) next.previous = null;
      entries = [next]; cursor = 0; current = next;
      window.history.replaceState(next, ''); return result;
    }
    if (signature(current) === signature(next)) {
      current = next; entries[cursor] = next;
      window.history.replaceState(next, ''); return result;
    }
    current.scroll = window.scrollY || 0;
    window.history.replaceState(current, '');
    if (appBack) {
      const previous = entries[cursor - 1] || current.previous;
      if (previous && signature({...previous, month: previous.followAge ? actualMonth() : previous.month}) === signature(next)) window.history.back();
      else { current = next; entries[cursor] = next; window.history.replaceState(next, ''); }
      return result;
    }
    next.previous = {page:current.page,month:current.month,step:current.step,followAge:current.followAge};
    entries = entries.slice(0, cursor + 1); entries.push(next); cursor++;
    current = next; window.history.pushState(next, '');
    return result;
  };
  window.back = back = function () {
    appBack = true;
    try { return baseBack.apply(this, arguments); } finally { appBack = false; }
  };
  window.addEventListener('popstate', function (event) {
    retainSetup();
    const state = event.state;
    if (!usable(state)) {
      // Never reopen a previous baby's view after a new setup.
      page = actualMonth() >= 0 ? 'home' : 'welcome'; month = actualMonth(); historyStack = [];
      current = null; render(); return;
    }
    const found = entries.findIndex(s => s.id === state.id);
    if (found >= 0) cursor = found;
    else { entries = [state]; cursor = 0; }
    current = state;
    restoring = true;
    try { restore(state); render(); window.scrollTo(0, state.scroll || 0); }
    finally { restoring = false; }
  });
})();
