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
  const also = (topic, text, go) => ({ topic, text, go });

  /* ---------- what's important right now ---------- */
  function importantNow() {
    const out = [], mv = movement(), m = dm(), p = P();
    const priority = homePriority();

    // The first nights at home: one setup, done once.
    if (live() && chgStageIndex('Sleep') === 0 && chgSafeRemaining('Sleep') > 0) {
      const left = chgSafeRemaining('Sleep');
      out.push({ topic: 'Sleep', key: 'sleep-setup', title: 'Set up a safe place to sleep',
        body: `For every sleep, day or night, ${n()} goes down on ${p.p} back on a firm, flat surface with nothing else in it, ideally in your room. It takes a few minutes to check, and then it's done.`,
        link: link("openPage('chg:Sleep:safe')", left === chgSafeTotal('Sleep') ? 'Go through the checklist' : `Finish the last ${left === 1 ? 'check' : left + ' checks'}`) });
    }

    // Rolling: one change, three places it shows up.
    if (priority && priority.type === 'swaddle') {
      if (mv === 'trying' || mv === 'rolling') out.push({ topic: 'Sleep', key: 'rolling', title: `Rolling changes how ${n()} sleeps`,
        body: `Now that ${n()} ${mv === 'trying' ? `${p.is} trying to roll` : `${p.is} rolling`}, it's time to stop swaddling. Switch to regular sleepwear or a sleep sack that leaves the arms free, and keep putting ${p.o} down on ${p.p} back.`,
        also: [also('Safety', 'Clear the floor around the play mat, and change diapers where rolling off isn’t possible.', "openSafetyChecklist('reach',false)"),
               also('Daily rhythm', 'Lots of floor time is how rolling gets stronger.', "openPage('topic:Daily rhythm')")],
        tools: homePriorityTools(priority), link: link("openSection('Sleep','sleep-rolling')", 'See what to change') });
      else out.push({ topic: 'Sleep', key: 'rolling-soon', title: 'Rolling changes sleep safety',
        body: `Most babies first try to roll between 3 and 6 months. If you swaddle ${n()}, stop at the first attempt and switch to a sleep sack that leaves the arms free. You don't need to wait for a full roll.`,
        tools: homePriorityTools(priority), link: link("openSection('Sleep','sleep-rolling')", 'See what to change') });
    }

    // Sitting and pulling up both move the crib mattress down.
    if (live() && (answers.pullUp === 'Yes' || m >= 8) && answers.mattressLowest !== 'Yes') {
      const said = answers.pullUp === 'Yes';
      out.push({ topic: 'Sleep', key: 'mattress', title: said ? `Pulling up means the mattress goes all the way down` : `Lower the crib mattress before ${n()} pulls up`,
        body: said ? `Set the crib mattress to its lowest setting, and take down mobiles or anything ${n()} could grab from standing.` : `Most babies pull up between 8 and 10 months. Set the mattress to its lowest setting now, and take down mobiles or anything within reach of standing.`,
        also: said ? [also('Safety', 'Anchor dressers and shelves, and check cords and windows at standing height.', "openSafetyChecklist('mobile',false)"),
                      also('Daily rhythm', 'Cruising along the couch is great balance practice.', "openPage('topic:Daily rhythm')")] : null,
        tools: `<div class="home-action-tools"><button class="home-inline-check" aria-label="Mark done: crib mattress at its lowest" onclick="setAnswer('mattressLowest','Yes')"><span aria-hidden="true"></span>Mark done</button></div>`,
        link: link("openSection('Sleep','sleep-crib-height')", 'See the crib setup') });
    } else if (live() && answers.sit === 'Yes' && answers.mattressLowered !== 'Yes' && answers.mattressLowest !== 'Yes') {
      out.push({ topic: 'Sleep', key: 'sitting', title: 'Sitting means the crib mattress goes down',
        body: `Now that ${n()} can sit without support, lower the crib mattress to the next setting in your crib's manual, so ${p.s} can't tip over the rail.`,
        tools: `<div class="home-action-tools"><button class="home-inline-check" aria-label="Mark done: crib mattress lowered" onclick="setAnswer('mattressLowered','Yes')"><span aria-hidden="true"></span>Mark done</button></div>`,
        link: link("openSection('Sleep','sleep-crib-height')", 'See the crib setup') });
    }

    // One babyproofing check at a time, framed by what changed.
    if (priority && priority.type === 'check') {
      const item = safetyHomeItems()[priority.id] || {};
      const crawl = mv === 'crawling' && recent('movement');
      out.push({ topic: 'Safety', key: 'check:' + priority.id, reason: crawl ? `Now that ${n()} is crawling` : null,
        title: crawl ? `Crawling opens up the whole room` : priority.id === 'gates' ? 'If you have stairs, gate them first' : item.title,
        body: crawl ? `${n()} can reach much more now. Start with this one: ${item.title.charAt(0).toLowerCase() + item.title.slice(1)}. ${item.body || ''}` : (item.body || ''),
        also: crawl ? [also('Daily rhythm', 'Crawling games, like chasing a ball, build strength and confidence.', "openPage('topic:Daily rhythm')")] : null,
        tools: homePriorityTools(priority), link: link(`openHomeSafetyCheck('${priority.owner}','${priority.id}')`, 'See how to do it') });
    }

    // First foods: the things that matter in the first weeks.
    if (live() && hasFoodAnswer() && foodStage() === 'new' && recent('food'))
      out.push({ topic: 'Feeding', key: 'first-foods', title: 'First foods: what matters most',
        body: `Start with iron-rich foods like meat, beans or iron-fortified cereal. Offer peanut and egg early, one new food at a time, and keep offering them. Milk feeds stay the same for now, and gagging is a normal part of learning.`,
        link: link("openPage('topic:Feeding')", 'See the first-foods guide') });

    // An answer about milk changes what Home says straight away.
    if (live() && chgStageIndex('Feeding') < 2 && homeInputs().asked.milk === month && ['Breast milk', 'Formula', 'Both'].includes(profile.feed)) {
      const f = profile.feed;
      out.push({ topic: 'Feeding', key: 'milk', title: f === 'Formula' ? 'Formula feeding, for this age' : f === 'Both' ? 'Breast milk and formula together' : 'Breast milk, for this age',
        body: f === 'Formula' ? `Bottle amounts grow quickly in the first months, so let ${n()}'s hunger and fullness cues lead rather than the bottle. The feeding guide shows typical amounts for this age and how to prepare formula safely.`
          : f === 'Both' ? `Breast milk and formula add up to one total, so there's no need to count them separately. Let hunger and fullness cues guide each feed; the feeding guide shows amounts for both.`
          : `Feeding on cue is the plan for now. Plenty of wet diapers and steady weight gain tell you it's going well, and the feeding guide covers bottles of expressed milk too.`,
        link: link("openFeedingGuide('milk')", 'See the feeding guide') });
    }

    // A checkup in the next two weeks.
    const visit = upcomingVisit();
    if (visit && visit.days <= 14) out.push(visitItem(visit));
    return out.slice(0, 2);
  }

  function upcomingVisit() {
    if (!live()) return null;
    let age = healthJourneyFocus();
    if (age === 0 && (NOW - parse(profile.dob)) / DAY > 10) age = 1;
    const rec = healthRecord(age);
    if (rec && rec.status === 'attended') return null;
    const when = rec && rec.status === 'planned' ? parse(rec.date) : addMonths(parse(profile.dob), age);
    const days = Math.round((when - NOW) / DAY);
    if (days > 35 && !(rec && rec.status === 'planned')) return null;
    return { age, days, saved: rec && rec.status === 'planned' ? rec.date : null };
  }
  function visitItem(v) {
    const label = healthJourneyLabel(v.age);
    const when = v.saved ? (v.days < 0 ? `was on ${journeyDateLabel(v.saved)}` : `is on ${journeyDateLabel(v.saved)}`) : v.days <= 7 ? 'is around now' : v.days <= 14 ? 'is coming up in about 2 weeks' : `is about ${Math.round(v.days / 7)} weeks away`;
    return { topic: 'Health', key: 'visit:' + v.age, reason: v.saved ? `Saved for ${journeyDateLabel(v.saved)}` : v.age === 0 ? 'In the first week' : `Usually around ${v.age} months`, title: `The ${label.charAt(0).toLowerCase() + label.slice(1)} ${when}`,
      body: `${conceptHealthSummary(v.age)} ${v.saved && v.days < 0 ? 'Mark it as done once you’ve been, so the next one comes up.' : 'It helps to jot down your questions beforehand.'}`,
      link: link(`openPage('health-visit:${v.age}')`, 'See what’s checked') };
  }

  /* ---------- what's coming up ---------- */
  function comingUp(taken) {
    const out = [], m = dm(), mv = movement(), p = P();
    const fi = chgStageIndex('Feeding');
    if (live() && fi === 2 && m >= 4 && (!hasFoodAnswer() || foodStage() === 'preparing'))
      out.push({ topic: 'Feeding', key: 'solids-soon', title: 'Solids are getting closer',
        body: `Most babies start around 6 months, once they can sit with support, hold their head steady and show interest in your food. There's a little to get ready first, like a high chair and knowing the difference between gagging and choking.`,
        link: link("openPage('topic:Feeding')", 'Get ready for solids') });
    if (m === 3) out.push({ topic: 'Sleep', key: 'four-month', title: 'Sleep may change around 4 months',
      body: `Some babies start waking more at night or taking shorter naps as their sleep matures. It's normal, it passes, and it doesn't mean anything has gone wrong.`,
      link: link("openPage('chg:Sleep:e:0')", 'See how to respond if it happens') });
    const visit = upcomingVisit();
    if (visit && visit.days > 14) out.push(visitItem(visit));
    if (live() && m >= 5 && m < 8 && !['crawling', 'pulling'].includes(mv) && safetyPendingIds(safetyOwnedGuides().mobile.ids).length)
      out.push({ topic: 'Safety', key: 'crawl-soon', title: `Before ${n()} starts crawling`,
        body: `Most babies start moving between 6 and 10 months. A little babyproofing now, like gates, anchored furniture and covered outlets, saves a scramble later.`,
        link: link("openSafetyChecklist('mobile',false)", 'Start the babyproofing checklist') });
    if (live() && [7, 8].includes(m) && !['Yes', 'Stay'].includes(answers.twoNaps) && chgStageIndex('Sleep') === 2)
      out.push({ topic: 'Sleep', key: 'two-naps-soon', title: 'Two naps are on the way',
        body: `Between 6 and 9 months, the late catnap usually stops fitting. You'll know when ${n()} fights it most days and still makes it to bedtime happily.`,
        link: link("openPage('chg:Sleep:s:3')", 'See what changes') });
    return out.filter(i => !taken.some(t => t.topic === i.topic && t.key.split(':')[0] === i.key.split(':')[0])).slice(0, 2);
  }

  /* ---------- markup: Home's own components ----------
     Important items are rows inside the month card (with Home's Mark done controls),
     Coming up uses the "Prepare for next" list, and links use Home's text links. */
  const REASON = {
    'sleep-setup': 'For the first nights at home', rolling: 'Stop swaddling now', 'rolling-soon': 'Before the first attempt to roll',
    mattress: 'Before baby can pull up', sitting: 'Now that baby can sit', 'first-foods': 'You said baby has started solids',
    milk: 'Based on what you shared', 'solids-soon': 'Usually around 6 months', 'four-month': 'Around 4 months',
    'crawl-soon': 'Before baby is on the move', 'two-naps-soon': 'Usually 6–9 months'
  };
  function reasonFor(i) {
    if (i.reason) return i.reason;
    if (REASON[i.key]) return REASON[i.key];
    if (i.key === 'mattress' && answers.pullUp === 'Yes') return 'Now that baby is pulling up';
    if (i.key.startsWith('check:')) return i.key === 'check:gates' ? 'If your home has stairs' : 'Your next babyproofing check';
    if (i.key.startsWith('visit:')) return i.days === undefined ? 'Checkup' : 'Coming up';
    return 'Important right now';
  }
  function row(i) {
    const base = { topic: i.topic, title: babyCopy(i.title), body: babyCopy(i.body), action: i.link ? i.link.go : `openPage('topic:${i.topic}')`, art: 0,
      reason: i.key === 'mattress' && answers.pullUp === 'Yes' ? 'Now that baby is pulling up' : reasonFor(i) };
    let html = conceptRow(base);
    const extra = (i.also || []).filter(Boolean);
    if (extra.length) html += `<div class="home-milk-links brief-also">${extra.map(a => `<button class="textlink" onclick="${a.go}">${displayTopic(a.topic)}: ${a.text.charAt(0).toLowerCase() + a.text.slice(1).replace(/\.$/, '')} →</button>`).join('')}</div>`;
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
    const play = (() => { try { const model = playStageModel(), idea = model.primary[0]; return idea ? { topic: 'Daily rhythm', key: 'play', title: idea.title, body: conceptPlaySuggestion(idea), link: link(`openPage('play-activity:${model.phase.lo}:${idea.id}')`, '') } : null; } catch (e) { return null; } })();
    const close = !now.length && !next.length ? `You’re all caught up. Nothing needs your attention right now.` : !now.length ? `Nothing needs doing right now. The rest can wait until it’s closer.` : `Nothing else needs attention right now.`;

    let h = `<section class="connected-now" aria-label="What matters now"><div class="connected-summary"><div class="home-summary connected-summary-intro"><div class="home-summary-heading"><div class="home-month-eyebrow">${month === 0 || focus.confirmed ? 'What matters now' : 'Likely around now'}</div><h1>${focus.title}</h1></div><span class="home-summary-art" aria-hidden="true">${homeMonthArt(month)}</span><p class="heroanswer">${focus.body}</p><div class="home-summary-spectrum" aria-hidden="true">${TOPICS.map(([t]) => `<span style="background:${YEAR_PALETTES[t].bg}"></span>`).join('')}</div></div>`;
    if (now.length) h += `<div class="connected-summary-links">${now.map(row).join('')}</div>`;
    h += `</div>${homeMomentRow()}</section>`;
    if (since) h = `<p class="brief-unchanged">Nothing new since you last checked in on ${journeyDateLabel(iso(new Date(since)))}. Everything here is still current.</p>` + h;
    const ahead = [...next];
    if (play && live()) ahead.push({ ...play, reasonText: 'If you have a few minutes' });
    if (ahead.length) h += `<section class="connected-ahead" aria-label="Coming up"><div class="connected-section-heading"><h2>Coming up</h2><button class="textlink" onclick="openPage('ahead')">See all →</button></div><div class="connected-ahead-list">${ahead.map(i => i.reasonText ? `<div class="brief-row" data-brief="${i.key}">${conceptRow({ topic: i.topic, title: i.title, body: i.body, action: i.link.go, art: 0, reason: i.reasonText })}</div>` : row(i)).join('')}</div></section>`;
    h += `<p class="brief-close">${close}</p>`;
    return liveHomeCheckin() + h;
  }

  window.homeBriefingDebug = () => { const now = importantNow(); return { now: now.map(i => i.key + ' · ' + i.title), next: comingUp(now).map(i => i.key + ' · ' + i.title) }; };
  window.adaptiveHome = homeAtlas = function () {
    const raw = connectedHomeBeforeBehavior(), start = raw.indexOf('<section class="connected-now"'), end = raw.indexOf('<section class="connected-browse"');
    // Keep the month strip above and "Browse by category" below; the briefing replaces the cards between them.
    const top = raw.slice(0, start).replace(/<section class="connected-checkin"[\s\S]*?<\/section>/, '');
    return top + briefing() + raw.slice(end);
  };
})();
