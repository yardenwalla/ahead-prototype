/* Ahead · When stages move
   - Stages move on age by themselves. Parents can always say "This is where she is now",
     and a saved moment (first roll, pulling up) moves Safety too.
   - The one question left: "Has she started solids?", at most once a month from 6 months,
     because a wrong guess there means the wrong advice. Unanswered → show for two weeks.
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
    if (a >= 6 && (!hasFoodAnswer() || foodStage() === 'preparing') && chgStageIndex('Feeding') <= 3 && due(d, 'food', ['preparing'])) out.push('food');
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
  // Category pages ask the same question in context, on the same monthly rhythm.
  window.checkinDue = function (key, waiting) { const d = load(); return due(d, key, waiting); };

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
  // The checklist moves ahead of the usual age, without claiming the skill:
  // reaching and rolling from 3 months, crawling prep from 5, babyproofing from 8, furniture reach from 9.
  function byAge(a) { return a >= 9 ? 'pulling' : a >= 8 ? 'moving' : a >= 5 ? 'rolling' : a >= 3 ? 'reaching' : 'setup'; }
  window.safetyAgeForward = function () { const s = answered(), g = byAge(dm()); return !s || ORDER.indexOf(g) > ORDER.indexOf(s) ? (ORDER.indexOf(g) > 1 ? g : null) : null; };
  function stageNow() {
    const s = answered(), g = byAge(dm());
    if (!s) return g;
    return ORDER.indexOf(g) > ORDER.indexOf(s) && ORDER.indexOf(g) > 1 ? g : s;
  }
  window.currentSafetyMovementStage = currentSafetyMovementStage = stageNow;
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
    if (key === 'setup' || key === 'reaching') { answers.roll = 'Not yet'; answers.rollDirection = 'Not yet'; delete answers.crawl; delete answers.pullUp; }
    if (key === 'rolling') { answers.roll = 'Yes'; delete answers.crawl; delete answers.pullUp; }
    if (key === 'moving') { answers.crawl = 'Yes'; delete answers.pullUp; }
    if (key === 'pulling') { answers.pullUp = 'Yes'; }
    persist(); page = 'topic:Safety'; render(); window.scrollTo(0, 0);
  };
  // No standing "Update baby's movement" toggle: the timeline, "This is where she is now" and saved moments cover it.
  window.safetyMovementUpdate = safetyMovementUpdate = function () { return ''; };
  window.safetyBackToNow = function () { page = 'topic:Safety'; render(); window.scrollTo(0, 0); };
  const browseLinks = key => `<div class="chg-browse-links" style="${yearTheme('Safety')}">${key ? `<button class="textlink chg-override" onclick="chgSetSafety('${key}')">This is where ${name()} is now</button>` : ''}<button class="textlink chg-back-now" onclick="safetyBackToNow()">← Back to where ${name()} is now</button></div>`;
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
    const html = baseDev.apply(this, arguments);
    const ref = Number((html.match(/data-development-guide="(\d+)"/) || [])[1]);
    if (!ref || !isCurrent()) return html;
    const now = devRef(developmentMonth(actualMonth())), keys = Object.keys(DEV_STAGES).map(Number);
    if (ref !== now) return html.replace('</nav>', `</nav><div class="chg-browse-links" style="${yearTheme('Development')}"><button class="textlink chg-back-now" onclick="navigate('categories');openPage('topic:Development')">← Back to where ${name()} is now</button></div>`);
    const next = keys[keys.indexOf(ref) + 1];
    if (!next) return html;
    const card = `<section class="sleep-phase-ahead" style="${yearTheme('Development')}"><h3>Coming up · By ${next} months</h3><article><h4>${DEV_STAGES[next].title}</h4><p>${DEV_STAGES[next].body}</p></article><button class="textlink chg-headsup-link" onclick="openPage('development-stage:${next}')">See what’s next →</button></section>`;
    const src = devGuideSources(ref);
    return html.includes(src) ? html.replace(src, card + src) : html.replace(/<\/div>$/, card + '</div>');
  };

  /* ---------- Which age a page uses ---------- */
  window.topicAge = topicAge = function (t) {
    return profile.early && t !== 'Health' ? monthLabel(developmentMonth()) + ' adjusted' : monthLabel(month);
  };
})();

