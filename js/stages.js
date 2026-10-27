/* Ahead · When stages move
   - Stages move on age by themselves. Parents can always say "This is where she is now",
     and a saved moment (first roll, pulling up) moves Safety too.
   - Feeding check-ins evolve from starting solids to textures/meals, at most every 28 days.
     Time prompts a question; only a parent's answer advances eating experience.
   - Safety moves ahead of the usual age (extra babyproofing is the safe mistake), never claiming the skill.
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
  // Is a key due? Never asked, or the last "not yet" answer is a month old.
  const WAIT = 28 * DAY;
  function due(d, key, waitingValues) {
    const l = d.last[key];
    if (d.skip[key] && nowMs() - d.skip[key] < WAIT) return false;
    if (!l) return true;
    return waitingValues.includes(l.value) && nowMs() - l.at >= WAIT;
  }
  function candidates() {
    const d = load(), a = dm(), out = [];
    if (month < 4 && (!profile.feed || profile.feed === 'Prefer not to say') && !d.skip.milk && !d.last.milk) out.push('milk');
    const food = feedingCheckin();
    if (food) out.push(food.key);
    // Sleep (Rule 1 and Rule 3): from 6 months, while the guide is on Three naps, ask about the late catnap.
    // A "not yet" (or a Change back to Three naps) is asked again a month later.
    const sa = typeof hubAgeFor === 'function' ? hubAgeFor('care', actualMonth()) : a;
    if (sa >= 6 && typeof chgStageIndex === 'function' && chgStageIndex('Sleep') === 2 && answers.twoNaps !== 'Yes' && due(d, 'naps', ['No', 'Not yet', 'Stay'])) out.push('naps');
    // Rule 3: a stage the parent picked that the baby's age has moved past. Asked once; "Not yet" rests for a month.
    if (typeof stageOutgrown === 'function') stageOutgrown().forEach(o => { if (due(d, 'outgrown:' + o.cat, ['Not yet'])) out.push('outgrown:' + o.cat); });
    return out;
  }
  function feedingCheckin() {
    if (!isCurrent() || dm() < 6) return null;
    const d = load(), stage = foodStage();
    const times = [d.last.food?.at, d.last['food-progress']?.at].filter(Number.isFinite);
    const latest = times.length ? Math.max(...times) : null, day = answers.stageDates?.food;
    // A date-only stamp is a fallback for direct stage updates. It must not
    // turn a precise answer from that same day into a later local-noon answer.
    const answeredAt = day && (latest === null || day > iso(new Date(latest))) ? parse(day).getTime() : latest;
    const recentlyAnswered = Number.isFinite(answeredAt) && nowMs() - answeredAt < WAIT;
    if (!hasFoodAnswer() || stage === 'preparing') {
      if (d.skip.food && nowMs() - d.skip.food < WAIT || hasFoodAnswer() && recentlyAnswered) return null;
      return {key:'food', title:`Has ${name()} started solids?`, why:'We’ll match the feeding guide to where you are.',
        choices:[['preparing','Not yet'],['new','Once a day or less'],['textures','Twice a day'],['established','3 times a day']]};
    }
    if (!['new','textures'].includes(stage)) return null;
    const key = 'food-progress';
    if (d.skip[key] && nowMs() - d.skip[key] < WAIT) return null;
    // An answer date is not a solids-start date. Use it only to space the next question.
    if (recentlyAnswered) return null;
    return {key, title:`How many times a day is ${name()} eating solids?`, why:'We’ll match the feeding guide to where you are.',
      choices:[['new','Once or less'],['textures','Twice'],['established','3 times']]};
  }
  window.feedingCheckinModel = feedingCheckin;
  window.homeQuestionQueue = () => candidates();
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
  // One question per visit: once a parent answers, the next one waits until tomorrow.
  const answeredRecently = d => Object.values(d.last).some(l => l && Number.isFinite(l.at) && nowMs() - l.at < 20 * 3600 * 1000);
  window.homeQuestion = homeQuestion = function () {
    if (!isCurrent() || homeConceptDismissed) return null;
    if (answeredRecently(load())) return null;
    return candidates().find(visible) || null;
  };
  // Category pages ask the same question in context, on the same monthly rhythm.
  window.checkinDue = function (key, waiting) { const d = load(); return due(d, key, waiting); };
  window.skipFeedingCheckin = function (key) {
    if (!['food','food-progress'].includes(key)) return;
    const d = load(); d.skip[key] = nowMs(); keep(d); render();
  };
  window.feedingCheckinMarkup = function (surface = 'category') {
    const q = feedingCheckin(); if (!q || !visible(q.key)) return '';
    const handler = surface === 'home' ? 'answerHomeQuestion' : 'chgAnswerCheckin';
    return `<section class="connected-checkin${surface==='category'?' chg-checkin':''}"><div><h2>${q.title}</h2><button class="connected-skip" onclick="skipFeedingCheckin('${q.key}')">Skip</button></div><p>${q.why}</p><div class="connected-checkin-choices">${q.choices.map(([value,label])=>`<button onclick="${handler}('${q.key}','${value}')">${label}</button>`).join('')}</div></section>`;
  };

  const baseAnswer = answerHomeQuestion, baseLive = liveHomeCheckin;
  const confirmAnswer = key => {
    if (typeof hubToast !== 'function') return;
    const label = { food: 'Feeding', 'food-progress': 'Feeding', naps: 'Sleep' }[key] || (key.startsWith('outgrown:') ? key.slice(9).replace('Daily rhythm', 'Everyday care') : null);
    if (label) setTimeout(() => hubToast('Got it', `${label} now matches what you told us.`), 0);
  };
  window.answerHomeQuestion = answerHomeQuestion = function (key, value) {
    if (key !== homeQuestion()) return;
    confirmAnswer(key);
    if (key.startsWith('outgrown:')) {
      if (!['Yes', 'Not yet'].includes(value)) return;
      recordCheckin(key, value);
      if (value === 'Yes') stageFollowAge(key.slice(9));
      return render();
    }
    if (key === 'food-progress') {
      if (!['new','textures','established'].includes(value)) return;
      recordCheckin(key, value); return setFeedingStage(value);
    }
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
    if (key === 'food' || key === 'food-progress') return feedingCheckinMarkup('home');
    if (key.startsWith('outgrown:')) {
      const o = (stageOutgrown() || []).find(x => 'outgrown:' + x.cat === key); if (!o) return '';
      return `<section class="connected-checkin"><div><h2>${o.question}</h2><button class="connected-skip" onclick="skipHomeQuestion()">Skip</button></div><p>${o.why}</p><div class="connected-checkin-choices"><button onclick="answerHomeQuestion('${key}','Not yet')">Not yet</button><button onclick="answerHomeQuestion('${key}','Yes')">Yes, move on</button></div></section>`;
    }
    if (key !== 'naps') return baseLive().replace('This changes which safety setup to highlight.', 'Your answer updates Sleep and Safety.');
    return `<section class="connected-checkin"><div><h2>Is ${name()} skipping the late catnap most days?</h2><button class="connected-skip" onclick="skipHomeQuestion()">Skip</button></div><p>Your answer updates the nap guidance.</p><div class="connected-checkin-choices"><button onclick="answerHomeQuestion('naps','Not yet')">Not yet</button><button onclick="answerHomeQuestion('naps','Yes')">Yes</button></div></section>`;
  };

  /* ---------- Safety ---------- */
  const ORDER = ['setup', 'reaching', 'rolling', 'moving', 'pulling'];
  function answered() {
    if (answers.pullUp === 'Yes') return 'pulling';
    if (answers.crawl === 'Yes') return 'moving';
    if (rolling() || answers.rollDirection === 'Trying to roll') return 'rolling';
    return null;
  }
  // The checklist moves ahead of the usual age, without claiming the skill:
  // reaching and rolling from 3 months, crawling prep from 5, babyproofing from 8, furniture reach from 9.
  function byAge(a) { return a >= 9 ? 'pulling' : a >= 8 ? 'moving' : a >= 5 ? 'rolling' : a >= 3 ? 'reaching' : 'setup'; }
  function reportedStage() {
    const s = answered(), chosen = ORDER.includes(answers.movementGuide) ? answers.movementGuide : null;
    return [s, chosen].filter(Boolean).sort((a,b)=>ORDER.indexOf(b)-ORDER.indexOf(a))[0] || (dm()<3?'setup':'reaching');
  }
  window.safetyAgeForward = function () { const s = reportedStage(), g = byAge(dm()); return ORDER.indexOf(g) > Math.max(1, ORDER.indexOf(s)) ? g : null; };
  function stageGuess() {
    const s = reportedStage(), g = byAge(dm());
    return ORDER.indexOf(g) > ORDER.indexOf(s) ? g : s;
  }
  // A parent's pick (Change on the timeline) holds, in either direction, until they change it
  // or tell us about a new movement. Home asks when the baby may have outgrown it.
  // A pick on the timeline, or what the parent said about movement, sets Safety (Rule 2). With neither, the age guess.
  function stageNow() {
    if (live2() && ORDER.includes(answers.safetyPick)) {
      const g = stageGuess();
      return answers.safetyPick === 'rolling' && ['moving', 'pulling'].includes(g) ? g : answers.safetyPick;
    }
    // Only an explicit "this is how they move now" (What's new) can set Safety below the age guess.
    // A saved first (a roll, a crawl) is a minimum: it can move Safety ahead, never back.
    if (live2() && answers.movementSetByParent) {
      const said = answered() || (answers.roll === 'Not yet' && answers.rollDirection === 'Not yet' ? 'reaching' : null);
      if (said) return said;
    }
    return stageGuess();
  }
  const live2 = () => typeof isCurrent !== 'function' || isCurrent();
  window.safetyStageGuess = stageGuess;
  // Observed movement drives Play; preparation may run ahead without claiming that skill.
  window.currentSafetyMovementStage = currentSafetyMovementStage = reportedStage;
  window.safetyStageNow = stageNow;

  // Must-know actions come from age as well as answers: stop swaddling before rolling, one safety check at a time.
  window.homePriority = homePriority = function () {
    if (!isCurrent()) return null;
    const a = dm(), roll = rolling() || answers.rollDirection === 'Trying to roll';
    if ((roll || a >= 3) && answers.swaddleStopped !== 'Yes' && (a <= 6 || answers.swaddleStopped === 'No')) return { topic: 'Sleep', type: 'swaddle' };
    const st = stageNow(), mobile = st === 'moving' || st === 'pulling';
    const owner = mobile ? 'mobile' : st === 'rolling' || roll ? 'reach' : null, ids = mobile ? safetyOwnedGuides().mobile.ids : owner ? ['rollspace', 'changing'] : [];
    const id = safetyPendingIds(ids)[0]; return id ? { topic: 'Safety', type: 'check', owner, id } : null;
  };
  window.safetyCurrentGuideStage = safetyCurrentGuideStage = stageNow;

  // "This is where she is now" on a Safety stage you're browsing
  window.chgSetSafety = function (key) {
    if (!ORDER.includes(key)) return;
    answers.movementGuide = key;
    markStage('movement');
    if (key === 'setup' || key === 'reaching') { answers.roll = 'Not yet'; answers.rollDirection = 'Not yet'; delete answers.crawl; delete answers.pullUp; }
    if (key === 'rolling') { answers.roll = 'Yes'; delete answers.crawl; delete answers.pullUp; }
    if (key === 'moving') { answers.crawl = 'Yes'; delete answers.pullUp; }
    if (key === 'pulling') { answers.pullUp = 'Yes'; }
    persist(); page = 'topic:Safety'; render(); window.scrollTo(0, 0);
  };
  // No standing "Update baby's movement" toggle: the timeline, "This is where she is now" and saved moments cover it.
  window.safetyMovementUpdate = safetyMovementUpdate = function () { return ''; };
  window.safetyBackToNow = function () { page = 'topic:Safety'; render(); window.scrollTo(0, 0); };
  const browseLinks = key => `<div class="chg-browse-links" style="${yearTheme('Safety')}"><button class="textlink chg-back-now" onclick="safetyBackToNow()">← Back to your guide</button></div>`;
  const baseGuide = safetyMovementGuide;
  window.safetyMovementGuide = safetyMovementGuide = function (key) {
    const html = baseGuide.apply(this, arguments);
    if (!key || !isCurrent() || key === stageNow() || !ORDER.includes(key)) return html;
    return html.replace('</nav>', '</nav>' + browseLinks(key));
  };
  // A checklist opened from "Coming up" is a preview: offer the way back.
  const baseOwner = safetyOwnerChecklist;
  window.safetyOwnerChecklist = safetyOwnerChecklist = function (owner, stage, preview) {
    const html = baseOwner.apply(this, arguments);
    if (!isCurrent() || !String(page).endsWith(':preview') || page === 'topic:Safety') return html;
    return html.replace('</nav>', '</nav>' + browseLinks(null));
  };

  /* Navigation between stages is the timeline at the top. At the bottom of the current checklist:
     unfinished checks from earlier checklists (at most 3), then one "Coming up" card. No Previous/Next links. */
  window.safetyGuidePagination = safetyGuidePagination = function (owner, preview) {
    if (preview || !isCurrent() || String(page).endsWith(':preview')) return '';
    const guides = safetyOwnedGuides(), keys = Object.keys(guides), i = keys.indexOf(owner);
    let h = '';
    // Only checklists this family actually opened carry forward. Someone who joins at 8 months
    // is assumed to have done the earlier ones; Safety is about getting ahead of what's next.
    const opened = safetyGuideOrigins();
    const earlier = keys.slice(0, i).filter(k => opened[k]).flatMap(k => safetyPendingIds(guides[k].ids).map(id => [k, id]));
    if (earlier.length) h += `<section class="safety-check-section safety-carry"><div class="safety-check-section-head"><h3>Still to do from earlier</h3><span class="safety-check-progress">${earlier.length} left</span></div>${safetyCheckGroup(earlier.slice(0, 3).map(x => x[1]), () => 'reference', 3)}${earlier.length > 3 ? `<button class="textlink" onclick="openSafetyChecklist('${earlier[0][0]}',true)">See all ${earlier.length} →</button>` : ''}</section>`;
    const next = keys[i + 1];
    if (next) h += `<section class="sleep-phase-ahead"><h3>Coming up</h3><article><h4>${guides[next].title}</h4><p>${guides[next].intro}</p></article><button class="textlink chg-headsup-link" onclick="openSafetyChecklist('${next}',true)">See the checklist →</button></section>`;
    return h;
  };

  /* ---------- Development: the same navigation rule ----------
     Current checkpoint: a "Coming up" card for the next one. Another checkpoint: a way back. */
  const baseDev = developmentJourneyOverview;
  window.developmentJourneyOverview = developmentJourneyOverview = function () {
    let html = baseDev.apply(this, arguments);
    const ref = Number((html.match(/data-development-guide="(\d+)"/) || [])[1]);
    if (!ref) return html;
    // Finish the page the way a conversation would: how you can help, and when to check in.
    const help = `<section class="sleep-phase-help chg-guide-section dev-help" style="${yearTheme('Development')}"><h3>How you can help</h3><ul><li><p>Floor time, talking back and games like peekaboo do more than any toy.</p><button class="textlink chg-item-link" onclick="openPage('topic:Daily rhythm')">Ideas for this month →</button></li></ul></section>`
      + `<section class="sleep-phase-help chg-guide-section dev-help" style="${yearTheme('Development')}"><h3>When to check in with your pediatrician</h3><ul><li><p>If ${name()} loses a skill, or something worries you, mention it. No need to wait for the checkup.</p></li></ul></section>`;
    const qs = devCommonQuestions(ref);
    if (html.includes(qs)) html = html.replace(qs, help + qs);
    if (!isCurrent()) return html;
    const now = devRef(developmentMonth(actualMonth())), keys = Object.keys(DEV_STAGES).map(Number);
    if (ref !== now) return html.replace('</nav>', `</nav><div class="chg-browse-links" style="${yearTheme('Development')}"><button class="textlink chg-back-now" onclick="navigate('categories');openPage('topic:Development')">← Back to where ${name()} is now</button></div>`);
    const next = keys[keys.indexOf(ref) + 1];
    // The rail keeps later guides available. Do not present distant skills as preparation due now.
    if (!next || next - developmentMonth(actualMonth()) > 1) return html;
    const card = `<section class="sleep-phase-ahead" style="${yearTheme('Development')}"><h3>Coming up · By ${next} months</h3><article><h4>${DEV_STAGES[next].title}</h4><p>${DEV_STAGES[next].body}</p></article><button class="textlink chg-headsup-link" onclick="openPage('development-stage:${next}')">See what’s next →</button></section>`;
    const src = devGuideSources(ref);
    return html.includes(src) ? html.replace(src, card + src) : html.replace(/<\/div>$/, card + '</div>');
  };

  /* ---------- Which age a page uses ---------- */
  window.topicAge = topicAge = function (t) {
    return profile.early && t !== 'Health' ? monthLabel(developmentMonth()) + ' adjusted' : monthLabel(month);
  };
})();

