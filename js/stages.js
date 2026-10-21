/* Ahead · When stages move
   - Check-ins: start when the usual window opens. "Not yet" or "Trying" → ask again in a week.
     Unanswered → show for two weeks, then rest until next month. Skip → rest a month.
   - Safety: a parent's answer moves it. Once the usual window has passed, the checklist moves
     forward on age (extra babyproofing is the safe mistake) without claiming the skill.
   - Adjusted age for everything developmental (until age 2); birthday age for Health. */
(function () {
  const DAY = 864e5;
  const store = () => 'ahead-v2-checkins:' + journeyKey();
  function load() { try { return Object.assign({ last: {}, shown: {}, skip: {} }, JSON.parse(localStorage.getItem(store())) || {}); } catch (e) { return { last: {}, shown: {}, skip: {} }; } }
  function keep(d) { try { localStorage.setItem(store(), JSON.stringify(d)); } catch (e) {} }
  const nowMs = () => NOW.getTime();
  const dm = () => developmentMonth(actualMonth());

  window.recordCheckin = function (key, value) { const d = load(); d.last[key] = { value, at: nowMs() }; delete d.shown[key]; d.ignored = 0; keep(d); };

  const rolling = () => answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection);
  // Is a key due? Never asked, or the last "not yet / trying" answer is a week old.
  function due(d, key, waitingValues) {
    const l = d.last[key];
    if (d.skip[key] && nowMs() - d.skip[key] < 30 * DAY) return false;
    if (!l) return true;
    return waitingValues.includes(l.value) && nowMs() - l.at >= 7 * DAY;
  }
  function candidates() {
    const d = load(), a = dm(), out = [];
    if (month < 4 && (!profile.feed || profile.feed === 'Prefer not to say') && !d.skip.milk && !d.last.milk) out.push('milk');
    if (a >= 3 && a <= 7 && !rolling() && answers.crawl !== 'Yes' && due(d, 'movement', ['not_yet', 'trying'])) out.push('movement');
    if (a >= 6 && answers.solids !== 'Yes' && due(d, 'food', ['preparing'])) out.push('food');
    if (a >= 7 && a <= 11 && answers.crawl !== 'Yes' && answers.pullUp !== 'Yes' && due(d, 'crawl', ['Not yet'])) out.push('crawl');
    if (a >= 7 && answers.crawl === 'Yes' && answers.pullUp !== 'Yes' && due(d, 'stand', ['Not yet'])) out.push('stand');
    if (a >= 6 && a < 9 && !['Yes', 'Stay'].includes(answers.twoNaps) && chgStageIndex('Sleep') === 2 && due(d, 'naps', ['Not yet'])) out.push('naps');
    return out;
  }
  // No nagging: an unanswered question shows for two weeks, then rests until next month.
  // A parent who has let two questions go unanswered gets one question a month, for one week.
  const answeredSince = (d, at) => Object.values(d.last).some(l => l.at >= at);
  function ignoredCount(d) {
    const t = nowMs();
    return Object.values(d.shown).filter(s => t - s.at > 14 * DAY && !answeredSince(d, s.at)).length + (d.ignored || 0);
  }
  function visible(key) {
    const d = load(), s = d.shown[key], t = nowMs(), quiet = ignoredCount(d) >= 2;
    if (!s || s.month !== month) {
      if (s && t - s.at > 14 * DAY && !answeredSince(d, s.at)) d.ignored = (d.ignored || 0) + 1;
      if (quiet && d.quietMonth === month) return false;           // one question a month when quiet
      d.shown[key] = { at: t, month }; if (quiet) d.quietMonth = month; keep(d); return true;
    }
    return t - s.at <= (quiet ? 7 : 14) * DAY;
  }
  window.homeQuestion = homeQuestion = function () {
    if (!isCurrent() || homeConceptDismissed) return null;
    return candidates().find(visible) || null;
  };
  // Category pages ask the same questions in context; skip them if answered in the last week.
  window.checkinDue = function (key, waiting) { const d = load(), l = d.last[key]; return !l || (waiting.includes(l.value) && nowMs() - l.at >= 7 * DAY); };

  const baseAnswer = answerHomeQuestion, baseLive = liveHomeCheckin;
  window.answerHomeQuestion = answerHomeQuestion = function (key, value) {
    if (key !== homeQuestion()) return;
    // Apply the answer first (the app checks the question is still showing), then remember when it was asked.
    if (key === 'naps') { recordCheckin(key, value); return setAnswer('twoNaps', value === 'Yes' ? 'Yes' : 'Not yet'); }
    const y = window.scrollY;
    baseAnswer(key, value);
    recordCheckin(key, value);
    render(); window.scrollTo(0, y);
  };
  window.skipHomeQuestion = skipHomeQuestion = function () {
    const key = homeQuestion(); if (!key) return;
    const d = load(); d.skip[key] = nowMs(); keep(d); render();
  };
  window.liveHomeCheckin = liveHomeCheckin = function () {
    const key = homeQuestion(); if (!key) return '';
    if (key !== 'naps') return baseLive().replace('This changes which safety setup to highlight.', 'Your answer updates Sleep and Safety.');
    return `<section class="connected-checkin"><div><h2>Is ${name()} skipping the late catnap most days?</h2><button class="connected-skip" onclick="skipHomeQuestion()">Skip</button></div><p>Your answer moves Sleep to two naps when she’s ready.</p><div class="connected-checkin-choices"><button onclick="answerHomeQuestion('naps','Not yet')">Not yet</button><button onclick="answerHomeQuestion('naps','Yes')">Yes</button></div></section>`;
  };

  /* ---------- Safety ---------- */
  const ORDER = ['setup', 'reaching', 'rolling', 'moving', 'pulling'];
  function answered() {
    if (answers.pullUp === 'Yes') return 'pulling';
    if (answers.crawl === 'Yes') return 'moving';
    if (rolling() || answers.rollDirection === 'Trying to roll') return 'rolling';
    return null;
  }
  // Past the usual window, the checklist moves forward on age, without claiming the skill.
  function byAge(a) { return a >= 10 ? 'moving' : a >= 7 ? 'rolling' : a >= 3 ? 'reaching' : 'setup'; }
  window.safetyAgeForward = function () { const s = answered(), g = byAge(dm()); return !s || ORDER.indexOf(g) > ORDER.indexOf(s) ? (ORDER.indexOf(g) > 1 ? g : null) : null; };
  function stageNow() {
    const s = answered(), g = byAge(dm());
    if (!s) return g;
    return ORDER.indexOf(g) > ORDER.indexOf(s) && ORDER.indexOf(g) > 1 ? g : s;
  }
  window.currentSafetyMovementStage = currentSafetyMovementStage = stageNow;
  window.safetyCurrentGuideStage = safetyCurrentGuideStage = stageNow;

  // "This is where she is now" on a Safety stage you're browsing
  window.chgSetSafety = function (key) {
    if (key === 'setup' || key === 'reaching') { answers.roll = 'Not yet'; answers.rollDirection = 'Not yet'; delete answers.crawl; delete answers.pullUp; }
    if (key === 'rolling') { answers.roll = 'Yes'; delete answers.crawl; delete answers.pullUp; }
    if (key === 'moving') { answers.roll = 'Yes'; answers.crawl = 'Yes'; delete answers.pullUp; }
    if (key === 'pulling') { answers.roll = 'Yes'; answers.crawl = 'Yes'; answers.pullUp = 'Yes'; }
    persist(); page = 'topic:Safety'; render(); window.scrollTo(0, 0);
  };
  const baseGuide = safetyMovementGuide;
  window.safetyMovementGuide = safetyMovementGuide = function (key) {
    const html = baseGuide.apply(this, arguments);
    if (!key || !isCurrent() || key === stageNow() || !ORDER.includes(key)) return html;
    return html.replace('</nav>', `</nav><button class="textlink chg-override" style="${yearTheme('Safety')}" onclick="chgSetSafety('${key}')">This is where ${name()} is now</button>`);
  };

  /* ---------- Which age a page uses ---------- */
  window.topicAge = topicAge = function (t) {
    return profile.early && t !== 'Health' ? monthLabel(developmentMonth()) + ' adjusted' : monthLabel(month);
  };
})();
