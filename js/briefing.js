/* Ahead · Home as a briefing
   Home answers one question: what matters for this baby right now?

   • Important right now: things to act on this week (at most 2). The guidance is written out
     in full on Home, so a parent doesn't have to tap through to understand it.
   • Coming up: what to get ready for in the next few weeks (at most 2).
   • Then it says so plainly when nothing else needs attention, and when nothing has changed
     since the last visit. Some weeks that means one item, or none.
   • A change in the baby (rolling, sitting, crawling, pulling up, first foods) is one item that
     connects everything it affects: sleep, safety, play and feeding. That's the milestone engine.

   Uses the app's own building blocks: the month card, category colors, check-in card and
   completion controls. Nothing on Home is invented here that a guide page doesn't back up. */
(function () {
  const DAY = 864e5;
  const P = () => babyPronouns();
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const n = () => name();
  const live = () => isCurrent();
  const dm = () => developmentMonth(month);

  function movement() {
    if (!live()) return null;
    if (answers.pullUp === 'Yes') return 'pulling';
    if (answers.crawl === 'Yes') return 'crawling';
    if (answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection)) return 'rolling';
    if (answers.rollDirection === 'Trying to roll') return 'trying';
    return null;
  }
  // A change counts as news for four weeks after the parent tells us.
  function recent(key) {
    const d = answers.stageDates && answers.stageDates[key];
    return !!d && (NOW - parse(d)) / DAY <= 28;
  }
  const link = (go, label) => ({ go, label });

  /* ---------- what's important right now ---------- */
  function importantNow() {
    const out = [], mv = movement(), m = dm(), p = P();
    const priority = homePriority();

    // The first nights at home: one setup, done once.
    if (live() && chgStageIndex('Sleep') === 0 && chgSafeRemaining('Sleep') > 0) {
      const left = chgSafeRemaining('Sleep');
      out.push({ topic: 'Sleep', key: 'sleep-setup', title: `Get ${n()}’s sleep space ready`,
        body: `A bare crib or bassinet in your room, and ${p.o} on ${p.p} back for every sleep. It only takes a few minutes.`,
        link: link("openPage('chg:Sleep:safe')", 'See how to set it up') });
    }

    // A checkup this week comes before longer-running reminders.
    const visitSoon = upcomingVisit();
    if (visitSoon && visitSoon.days <= 7) out.push(visitItem(visitSoon));

    // An answer about milk changes what Home says straight away.
    if (live() && chgStageIndex('Feeding') < 2 && homeInputs().asked.milk === month && ['Breast milk', 'Formula', 'Both'].includes(profile.feed)) {
      const f = profile.feed;
      out.push({ topic: 'Feeding', key: 'milk', title: f === 'Formula' ? `Formula at ${n()}’s age` : f === 'Both' ? 'Mixing breast milk and formula' : `Nursing at ${n()}’s age`,
        body: f === 'Formula' ? `Let ${p.p} hunger and fullness lead. The guide has typical amounts and safe prep.`
          : f === 'Both' ? `Count them as one total, and let ${n()}’s cues guide each feed.`
          : `Feed when ${p.s} ${p.s === 'they' ? 'seem' : 'seems'} hungry. Plenty of wet diapers and steady weight mean it’s going well.`,
        link: link("openFeedingGuide('milk')", 'See the feeding guide') });
    }

    // The first weeks: feeding, then how the parent is doing, then the crying peak.
    const wk = live() ? Math.floor((NOW - parse(profile.dob)) / DAY / 7) : -1;
    if (wk >= 0 && wk < 2 && chgStageIndex('Feeding') === 0)
      out.push({ topic: 'Feeding', key: 'newborn-feeds', title: 'Feeding often is exactly right',
        body: `Most newborns feed 8–12 times a day, day and night. Plenty of wet diapers tells you it’s going well.`,
        link: link("openPage('topic:Feeding')", 'See newborn feeding') });
    if (wk >= 2 && wk < 6)
      out.push({ topic: 'Health', key: 'parent', title: 'How are you doing?',
        body: `Feeling weepy or overwhelmed is common in the early weeks. If it lasts more than a couple of weeks or feels heavy, you don’t have to wait it out.`,
        link: link("openPage('chg:Health:d:you')", 'Looking after you') });
    if (wk >= 6 && wk < 11)
      out.push({ topic: 'Sleep', key: 'crying', title: 'Fussy evenings are common right now',
        body: `Crying often peaks around 6–8 weeks and eases by 3–4 months. If it gets too much, it’s OK to put ${n()} down safely and take a break.`,
        link: link("openPage('chg:Sleep:d:crying')", 'What helps with crying') });

    // Rolling: one change, three places it shows up.
    if (priority && priority.type === 'swaddle') {
      if (mv === 'trying' || mv === 'rolling') out.push({ topic: 'Sleep', key: 'rolling', title: mv === 'trying' ? `${n()}’s trying to roll, so it’s time to stop swaddling` : `Now that ${n()}’s rolling, swaddling stops`,
        body: `Switch to a sleep sack that leaves ${p.p} arms free. During the day, plenty of floor time helps ${p.o} practice.`,
        tools: homePriorityTools(priority), link: link("openSection('Sleep','sleep-rolling')", 'See what to change') });
      else if (developmentMonth(actualMonth()) >= 6) out.push({ topic: 'Sleep', key: 'rolling-soon', title: 'Once rolling starts, swaddling stops',
        body: `Most babies roll by about 6 months. If ${n()} still sleeps swaddled, switch to a sleep sack that leaves ${p.p} arms free.`,
        tools: homePriorityTools(priority), link: link("openSection('Sleep','sleep-rolling')", 'See what to change') });
      else out.push({ topic: 'Sleep', key: 'rolling-soon', title: 'Rolling is on the way',
        body: `Most babies first try between 3 and 6 months. If you swaddle, that first try is your cue to switch to a sleep sack.`,
        tools: homePriorityTools(priority), link: link("openSection('Sleep','sleep-rolling')", 'See what to change') });
    }

    // Sitting and pulling up both move the crib mattress down.
    if (live() && (answers.pullUp === 'Yes' || m >= 8) && answers.mattressLowest !== 'Yes') {
      const said = answers.pullUp === 'Yes';
      out.push({ topic: 'Sleep', key: 'mattress', title: said ? `Now that ${n()} pulls up, set the crib mattress to its lowest` : `Set the crib mattress to its lowest`,
        body: said ? `Take down mobiles too, and anchor dressers and shelves. To ${n()}, they’re something to climb now.` : `Most babies pull up between 8 and 10 months, so it’s worth doing before then.`,
        tools: `<div class="home-action-tools"><button class="home-inline-check" aria-label="Mark done: crib mattress at its lowest" onclick="setAnswer('mattressLowest','Yes')"><span aria-hidden="true"></span>I’ve done this</button></div>`,
        link: link("openSection('Sleep','sleep-crib-height')", 'See the crib setup') });
    } else if (live() && answers.sit === 'Yes' && answers.mattressLowered !== 'Yes' && answers.mattressLowest !== 'Yes') {
      out.push({ topic: 'Sleep', key: 'sitting', title: `Now that ${n()} sits, lower the crib mattress`,
        body: `Moving it down a setting keeps ${p.o} from tipping over the rail.`,
        tools: `<div class="home-action-tools"><button class="home-inline-check" aria-label="Mark done: crib mattress lowered" onclick="setAnswer('mattressLowered','Yes')"><span aria-hidden="true"></span>I’ve done this</button></div>`,
        link: link("openSection('Sleep','sleep-crib-height')", 'See the crib setup') });
    }

    // One babyproofing check at a time, framed by what changed.
    if (priority && priority.type === 'check') {
      const item = safetyHomeItems()[priority.id] || {};
      const crawl = mv === 'crawling' && recent('movement');
      out.push({ topic: 'Safety', key: 'check:' + priority.id,         title: crawl ? `Crawling opens up the room` : priority.id === 'gates' ? 'If you have stairs, gate them first' : item.title,
        body: crawl ? `Start with this: ${item.title.charAt(0).toLowerCase() + item.title.slice(1)}. Then go room by room, and leave a clear stretch of floor for practice.` : (item.body || ''),
        tools: homePriorityTools(priority), link: link(`openHomeSafetyCheck('${priority.owner}','${priority.id}')`, 'See how to do it') });
    }

    // First foods: the things that matter in the first weeks.
    if (live() && hasFoodAnswer() && foodStage() === 'new' && recent('food'))
      out.push({ topic: 'Feeding', key: 'first-foods', title: `${n()}’s started solids`,
        body: `Now that ${n()} has started solids, lead with iron-rich foods, try peanut and egg early, and keep milk feeds going as usual.`,
        link: link("openPage('topic:Feeding')", 'See the first-foods guide') });

    // A checkup in the next two weeks.
    // Once solids are going, the allergen list stays on Home until it's done.
    if (live() && hasFoodAnswer() && ['new', 'textures'].includes(foodStage()) && !recent('food') && window.__chg) {
      const A = ['Peanut', 'Egg', 'Dairy', 'Wheat', 'Soy', 'Sesame', 'Tree nuts', 'Fish', 'Shellfish'], got = window.__chg.local.allergens || {}, t = A.filter(a => got[a]).length;
      if (t < A.length) out.push({ topic: 'Feeding', key: 'allergens', title: 'Try a new allergen', reason: `${t} of ${A.length} tried`,
        body: `Offering common allergens early and often can lower the chance of food allergies. ${A.find(a => !got[a])} is a good next one.`,
        link: link("openPage('chg:Feeding:d:allergens')", 'See how to offer each one') });
    }
    return out.filter((x, i) => out.findIndex(y => y.topic === x.topic) === i).slice(0, 2); // one card per category
  }

  // The next checkup still ahead (or a saved date). A past one that wasn't recorded is a Home question instead.
  function upcomingVisit() {
    if (!live()) return null;
    for (const age of WELL_VISITS) {
      const rec = healthRecord(age);
      if (rec && rec.status === 'attended') continue;
      const planned = rec && rec.status === 'planned';
      const due = age === 0 ? new Date(parse(profile.dob).getTime() + 5 * DAY) : addMonths(parse(profile.dob), age);
      const when = planned ? parse(rec.date) : due, days = Math.round((when - NOW) / DAY);
      if (!planned && days < 0) continue;
      if (days > 35 && !planned) return null;
      return { age, days, saved: planned ? rec.date : null };
    }
    return null;
  }
  function visitItem(v) {
    const label = healthJourneyLabel(v.age);
    const when = v.saved ? (v.days < 0 ? `was on ${journeyDateLabel(v.saved)}` : `is on ${journeyDateLabel(v.saved)}`) : v.days <= 7 ? 'is coming up' : v.days <= 14 ? 'is in about 2 weeks' : `is in about ${Math.round(v.days / 7)} weeks`;
    return { topic: 'Health', key: 'visit:' + v.age, reason: v.saved ? `Saved for ${journeyDateLabel(v.saved)}` : v.age === 0 ? 'In the first week' : `Usually around ${v.age} month${v.age === 1 ? '' : 's'}`, title: `${n()}’s ${label.charAt(0).toLowerCase() + label.slice(1)} ${when}`,
      body: conceptHealthSummary(v.age) + (v.saved && v.days < 0 ? ' Mark it done once you’ve been.' : ''),
      link: link(`openPage('health-visit:${v.age}')`, 'See what’s checked') };
  }

  /* ---------- what's coming up ---------- */
  function comingUp(taken) {
    const out = [], m = dm(), mv = movement(), p = P();
    const fi = chgStageIndex('Feeding');
    if (live() && fi === 2 && m >= 4 && m < 6 && (!hasFoodAnswer() || foodStage() === 'preparing'))
      out.push({ topic: 'Feeding', key: 'solids-soon', title: 'Solids are getting closer',
        body: `Most babies start around 6 months, once they’re ready. Here’s what to know first.`,
        link: link("openPage('topic:Feeding')", 'Get ready for solids') });
    if (m === 3) out.push({ topic: 'Sleep', key: 'four-month', title: 'Sleep might get bumpy around 4 months',
      body: `Some babies start waking more for a while. It’s normal, and it passes.`,
      link: link("openPage('chg:Sleep:e:0')", 'See how to respond if it happens') });
    const wk = live() ? Math.floor((NOW - parse(profile.dob)) / DAY / 7) : -1;
    if (wk >= 2 && wk < 6) out.push({ topic: 'Sleep', key: 'crying-soon', title: 'Evening crying often builds from now',
      body: `It usually peaks around 6–8 weeks, then eases. If ${n()} is already crying for long stretches, here’s what helps.`,
      link: link("openPage('chg:Sleep:d:crying')", 'What helps with crying') });
    const visit = upcomingVisit();
    if (visit && visit.days > 7) out.push(visitItem(visit));
    if (live() && m === 11) out.push({ topic: 'Feeding', key: 'one-year-milk', title: 'Milk and cups around the first birthday',
      body: `From 12 months, whole cow’s milk can be a drink from a cup, and bottles start to phase out.`,
      link: link("openPage('chg:Feeding:d:milk12')", 'See what changes') });
    if (live() && m >= 5 && m < 8 && !['crawling', 'pulling'].includes(mv) && safetyPendingIds(safetyOwnedGuides().mobile.ids).length)
      out.push({ topic: 'Safety', key: 'crawl-soon', title: `Before ${n()} starts crawling`,
        body: `Most babies get moving between 6 and 10 months. Babyproofing now saves a scramble later.`,
        link: link("openSafetyChecklist('mobile',false)", 'Start the babyproofing checklist') });
    // Near the first birthday, a moving baby is about to cruise and walk: one look ahead at what comes into reach.
    if (live() && m >= 11 && ['crawling', 'pulling'].includes(mv))
      out.push({ topic: 'Safety', key: 'steps-soon', title: 'First steps are on the way',
        body: `Cruising and walking bring table edges, stairs and low shelves into reach. A quick walk-through of each room helps.`,
        link: link("openPage('topic:Safety')", 'See what to check') });
    if (live() && [7, 8].includes(m) && !['Yes', 'Stay'].includes(answers.twoNaps) && chgStageIndex('Sleep') === 2)
      out.push({ topic: 'Sleep', key: 'two-naps-soon', title: 'Two naps are on the way',
        body: `Usually between 6 and 9 months, once the late-afternoon nap stops fitting.`,
        link: link("openPage('chg:Sleep:s:3')", 'See what changes') });
    return out.filter(i => !taken.some(t => t.topic === i.topic && t.key.split(':')[0] === i.key.split(':')[0])).slice(0, 2);
  }

  /* ---------- markup: Home's own components ----------
     Important items are rows inside the month card (with Home's Mark done controls),
     Coming up uses the "Prepare for next" list, and links use Home's text links. */
  function row(i) {
    const base = { topic: i.topic, title: babyCopy(i.title), body: babyCopy(i.body), action: i.link ? i.link.go : `openPage('topic:${i.topic}')`, art: 0,
      reason: null };
    let html = conceptRow(base);
    if (i.tools) html = `<div class="home-connected-sleep" style="${yearTheme(i.topic)}" data-brief="${i.key}"${i.key.startsWith('check:') ? ` data-home-check="${i.key.slice(6)}"` : ''}>${html}<div class="home-connected-actions">${i.tools}</div></div>`;
    else html = `<div class="brief-row" data-brief="${i.key}">${html}</div>`;
    return html;
  }

  // Say so when nothing has changed since the last visit, instead of inventing news.
  function sameAsLastVisit(sig) {
    if (!live()) return null;
    const key = 'ahead-v2-briefing:' + journeyKey();
    let last = null; try { last = JSON.parse(localStorage.getItem(key)); } catch (e) {}
    const now = NOW.getTime();
    if (!last || last.sig !== sig) { try { localStorage.setItem(key, JSON.stringify({ sig, at: now })); } catch (e) {} return null; }
    return now - last.at > 20 * 3600 * 1000 ? last.at : null;
  }

  function briefing() {
    const now = importantNow(), next = comingUp(now);
    const focus = homeCurrentFocus();
    const sig = [...now, ...next].map(i => i.key).join('|');
    const since = sameAsLastVisit(sig);
    const close = !live() ? `A preview of ${month === 0 ? 'the newborn weeks' : month + (month === 1 ? ' month' : ' months')}. Your guide follows ${n()}’s age.` : !now.length && !next.length ? `You’re all caught up for now.` : !now.length ? `Nothing to do right now. We’ll bring things up as they get closer.` : `That’s everything for now.`;

    let h = `<section class="connected-now" aria-label="What matters now"><div class="connected-summary"><div class="home-summary connected-summary-intro"><div class="home-summary-heading"><div class="home-month-eyebrow">${!live() ? (month > actualMonth() ? 'Coming at ' : 'Looking back at ') + (month === 0 ? 'the newborn weeks' : month + (month === 1 ? ' month' : ' months')) : 'What matters now'}</div><h1>${focus.title}</h1></div><span class="home-summary-art" aria-hidden="true">${homeMonthArt(month)}</span><p class="heroanswer">${focus.body}</p><div class="home-summary-spectrum" aria-hidden="true">${TOPICS.map(([t]) => `<span style="background:${YEAR_PALETTES[t].bg}"></span>`).join('')}</div></div>`;
    if (now.length) h += `<div class="connected-summary-links">${now.map(row).join('')}</div>`;
    h += `</div>${homeMomentRow()}</section>`;
    h += liveHomeCheckin();
    if (since) h = `<p class="brief-unchanged">Nothing’s changed since you checked in on ${journeyDateLabel(iso(new Date(since)))}.</p>` + h;
    const ahead = [...next];
    if (ahead.length) h += `<section class="connected-ahead" aria-label="Coming up"><div class="connected-section-heading"><h2>Coming up</h2></div><div class="connected-ahead-list">${ahead.map(row).join('')}</div></section>`;
    h += `<p class="brief-close">${close}</p>`;
    return h;
  }

  window.homeBriefingDebug = () => { const now = importantNow(); return { now: now.map(i => i.key + ' · ' + i.title), next: comingUp(now).map(i => i.key + ' · ' + i.title) }; };
  window.adaptiveHome = homeAtlas = function () {
    const raw = connectedHomeBeforeBehavior(), start = raw.indexOf('<section class="connected-now"'), end = raw.indexOf('<section class="connected-browse"');
    // Keep the month strip above and "Browse by category" below; the briefing replaces the cards between them.
    const top = raw.slice(0, start).replace(/<section class="connected-checkin"[\s\S]*?<\/section>/, '');
    return top + briefing() + raw.slice(end);
  };
})();
