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
    // After a Feeding change, Home leads with it until the parent opens Feeding.
    const fn = live() && typeof foodHomeNote === 'function' ? foodHomeNote() : null;
    if (fn === 'new') { const tx = foodStage() === 'textures';
      out.push({ topic: 'Feeding', key: 'food-step', reason: 'New in Feeding', title: tx ? 'Thicker food, and more to pick up' : 'Meals are part of the day now',
        body: tx ? `Make food a little lumpier, and add soft pieces ${n()} can pick up.` : `Three meals and a snack or two, with milk alongside. Most of what you eat can work for ${n()} too.`,
        link: link("openPage('topic:Feeding')", 'See what’s new') }); }
    const fq = live() && typeof feedingCheckinModel === 'function' ? feedingCheckinModel() : null;
    if (!fn && fq && fq.key === 'food-progress' && typeof homeQuestion === 'function' && homeQuestion() !== 'food-progress')
      out.push({ topic: 'Feeding', key: 'food-ask', reason: 'Quick question in Feeding', title: fq.title, body: fq.why, link: link("openPage('topic:Feeding')", 'Answer in Feeding') });
    if (fn === 'hold') out.push({ topic: 'Feeding', key: 'food-hold', reason: 'Going slowly', title: 'Not ready for lumps yet',
        body: `That’s fine. Here’s how to build up slowly, and when to ask your pediatrician.`, link: link("openPage('chg:Feeding:d:notready')", 'See the tips') });

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
        body: said ? `Take down mobiles too, and anchor dressers and shelves. To ${n()}, they’re something to climb now.` : (m >= 10 ? `Most babies pull up by now, so it’s worth doing soon.` : m >= 8 ? `Many babies pull up around now. Set it to the lowest setting before ${n()} does.` : `Most babies pull up between 8 and 10 months, so it’s worth doing before then.`),
        tools: `<div class="home-action-tools"><button class="home-inline-check" aria-label="Mark done: crib mattress at its lowest" onclick="setAnswer('mattressLowest','Yes')"><span aria-hidden="true"></span>I’ve done this</button></div>`,
        link: link("openSection('Sleep','sleep-crib-height')", 'See the crib setup') });
    } else if (live() && answers.sit === 'Yes' && answers.mattressLowered !== 'Yes' && answers.mattressLowest !== 'Yes') {
      out.push({ topic: 'Sleep', key: 'sitting', title: `Now that ${n()} sits, lower the crib mattress`,
        body: `Moving it down a setting keeps ${p.o} from tipping over the rail.`,
        tools: `<div class="home-action-tools"><button class="home-inline-check" aria-label="Mark done: crib mattress lowered" onclick="setAnswer('mattressLowered','Yes')"><span aria-hidden="true"></span>I’ve done this</button></div>`,
        link: link("openSection('Sleep','sleep-crib-height')", 'See the crib setup') });
    }

    // One babyproofing check at a time, framed by what changed.
    // One safety check per visit: after one is done, the next waits until the parent comes back (about 12 hours).
    let safetyRest = false; try { safetyRest = Date.now() - Number(localStorage.getItem('ahead-safety-last:' + journeyKey()) || 0) < 12 * 3600e3; } catch (e) {}
    if (priority && priority.type === 'check' && !safetyRest) {
      const item = safetyHomeItems()[priority.id] || {};
      const crawl = mv === 'crawling' && recent('movement');
      out.push({ topic: 'Safety', key: 'check:' + priority.id,         title: crawl ? `Now that ${n()} crawls, start here` : priority.id === 'gates' ? 'If you have stairs, gate them first' : item.title,
        body: crawl ? `${item.title}. Then go room by room, and leave a clear stretch of floor for practice.` : (item.body || ''),
        tools: homePriorityTools(priority), link: link(`openHomeSafetyCheck('${priority.owner}','${priority.id}')`, 'See how to do it') });
    }

    // First foods: the things that matter in the first weeks.
    if (live() && hasFoodAnswer() && foodStage() === 'new' && recent('food'))
      out.push({ topic: 'Feeding', key: 'first-foods', title: `${n()}’s started solids`,
        body: `Now that ${n()} has started solids, lead with iron-rich foods, try peanut and egg early, and keep milk feeds going as usual.`,
        link: link("openPage('topic:Feeding')", 'See the first-foods guide') });

    // A checkup in the next two weeks.
    // Solids: in the month the next guide starts to fit, it joins What matters now, after safety work.
    // Solids: when the next guide starts to fit this baby (by when solids started, not just age), it joins What matters now.
    if (live() && typeof foodStage === 'function' && foodStage() !== 'preparing' && typeof foodPhaseDates === 'function') { const st = foodStage(), d = foodPhaseDates(), fresh = k => d && (NOW - d[k]) / 864e5 < 30;
      if (st === 'textures' && fresh('textures')) out.push({ topic: 'Feeding', key: 'solids-textures-now', title: approach7() ? 'From strips to small pieces' : 'Time for thicker textures',
        body: approach7() ? `As ${n()} learns to pinch, food can get smaller and more varied.` : `${n()} is ready for lumpier food and soft pieces ${P().s} can pick up.`, link: link("openPage('chg:Feeding:s:4')", 'Read the guide') });
      if (st === 'established' && fresh('established')) out.push({ topic: 'Feeding', key: 'solids-meals-now', title: 'Time for three meals a day',
        body: `Most babies eat three meals and a snack or two from about now.`, link: link("openPage('chg:Feeding:s:5')", 'Read the guide') });
    }
    // Development: the month a new "what to look for" stage begins, Home says so.
    if (live()) { const keys = [2, 4, 6, 9, 12], dmn = dm(), k = keys.find(x => x >= dmn), prev = keys[keys.indexOf(k) - 1];
      if (k && prev != null && dmn === prev + 1) out.push({ topic: 'Development', key: 'dev-stage:' + k, title: `New things to look for by ${k} months`,
        body: `What most babies do by ${k} months, and simple ways to play along.`, link: link(`openPage('development-stage:${k}')`, 'See what’s new') }); }
    // Once solids are going, the allergen list stays on Home until it's done.
    if (live() && hasFoodAnswer() && ['new', 'textures'].includes(foodStage()) && !recent('food') && window.__chg) {
      const A = ['Peanut', 'Egg', 'Dairy', 'Wheat', 'Soy', 'Sesame', 'Tree nuts', 'Fish', 'Shellfish'], got = window.__chg.local.allergens || {}, t = A.filter(a => got[a]).length;
      const ask = !t && typeof foodWeeksIn === 'function' && foodWeeksIn() >= 4;   // started a while ago: ask what's been tried, don't assume none
      if (t < A.length) out.push({ topic: 'Feeding', key: 'allergens:' + t, title: ask ? `Which allergens has ${n()} tried?` : 'Try a new allergen', reason: `${t} of ${A.length} tried`,
        body: ask ? `Tick the ones ${n()} has already had, and we’ll suggest the next one.` : `Offering common allergens early and often can lower the chance of food allergies. ${A.find(a => !got[a])} is a good next one.`,
        link: link("openPage('chg:Feeding:d:allergens')", 'See how to offer each one') });
    }
    // Anything new since the last visit goes first, so it's never buried under a standing to-do.
    const ranked = freshFirst(out);
    return ranked.filter((x, i) => ranked.findIndex(y => y.topic === x.topic) === i).slice(0, 2); // one card per category
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
      // The first-week visit happens within days of birth: a week past it, assume it's done rather than calling it due.
      if (!planned && days < (age === 0 ? -7 : -14)) continue;
      if (days > 35 && !planned) return null;
      return { age, days, saved: planned ? rec.date : null };
    }
    return null;
  }
  function visitItem(v) {
    const label = healthJourneyLabel(v.age);
    const when = v.saved ? (v.days < 0 ? `was on ${journeyDateLabel(v.saved)}` : `is on ${journeyDateLabel(v.saved)}`) : v.days < 0 ? 'is due now' : `is ${dueWhen(iso(addMonths(parse(profile.dob), v.age)))}`;
    return { topic: 'Health', key: 'visit:' + v.age, reason: v.saved ? `Saved for ${journeyDateLabel(v.saved)}` : v.age === 0 ? 'In the first week' : `Due ${dueWhen(iso(addMonths(parse(profile.dob), v.age)))}`, title: `${n()}’s ${label.charAt(0).toLowerCase() + label.slice(1)} ${when}`,
      body: conceptHealthSummary(v.age) + (v.saved && v.days < 0 ? ' Mark it done once you’ve been.' : ''),
      link: link(`openPage('health-visit:${v.age}')`, 'See what’s checked') };
  }

  var approach7 = () => { try { return (window.__chg && window.__chg.local && window.__chg.local.approach) === 'finger'; } catch (e) { return false; } };
  /* ---------- what's coming up ---------- */
  function comingUp(taken) {
    const out = [], m = dm(), mv = movement(), p = P();
    const fi = chgStageIndex('Feeding');
    if (live() && fi === 2 && m >= 4 && m < 6 && (!hasFoodAnswer() || foodStage() === 'preparing'))
      out.push({ topic: 'Feeding', key: 'solids-soon', title: 'Solids are getting closer',
        body: `Most babies start around 6 months, once they’re ready. Here’s what to know first.`,
        link: link("openPage('topic:Feeding')", 'Get ready for solids') });
    // Solids: a heads-up a few weeks before the next guide fits.
    if (live() && typeof foodStage === 'function' && foodStage() !== 'preparing' && typeof foodPhaseDates === 'function') {
      const st = foodStage(), d = foodPhaseDates(), soon = k => d && (d[k] - NOW) / 864e5 <= 35;
      if (st === 'new' && soon('textures') && foodWeeksIn() >= 2) out.push({ topic: 'Feeding', key: 'solids-textures', title: 'Thicker textures and finger foods are next',
        body: `In a few weeks, most babies move on to lumpier food and soft pieces they can pick up.`, link: link("openPage('chg:Feeding:s:4')", 'Read the guide') });
      if (st === 'textures' && soon('established')) out.push({ topic: 'Feeding', key: 'solids-meals', title: 'Three meals a day is next',
        body: `From about 9 months, most babies eat three meals and a snack or two.`, link: link("openPage('chg:Feeding:s:5')", 'Read the guide') });
    }
    if (m === 3) out.push({ topic: 'Sleep', key: 'four-month', title: 'Sleep might get bumpy around 4 months',
      body: `Some babies start waking more for a while. It’s normal, and it passes.`,
      link: link("openPage('chg:Sleep:e:0')", 'See how to respond if it happens') });
    const wk = live() ? Math.floor((NOW - parse(profile.dob)) / DAY / 7) : -1;
    if (wk >= 2 && wk < 6) out.push({ topic: 'Sleep', key: 'crying-soon', title: 'Evening crying often builds from now',
      body: `It usually peaks around 6–8 weeks, then eases. If ${n()} is already crying for long stretches, here’s what helps.`,
      link: link("openPage('chg:Sleep:d:crying')", 'What helps with crying') });
    const visit = upcomingVisit();
    if (visit && visit.days > 7) out.push(visitItem(visit));
    // Older babies: the first birthday checkup is the next big thing, even a few months out.
    if (live() && !visit && m >= 9) { const due = addMonths(parse(profile.dob), 12), wks = Math.round((due - NOW) / DAY / 7);
      if (wks > 0 && !healthRecord(12)) out.push({ topic: 'Health', key: 'visit-ahead:12', title: `${n()}’s 12-month checkup is in about ${wks > 8 ? Math.round(wks / 4.3) + ' months' : wks + ' weeks'}`, body: conceptHealthSummary(12), link: link("openPage('health-visit:12')", 'See what’s checked') }); }
    if (live() && m >= 10 && m < 12) out.push({ topic: 'Feeding', key: 'one-year-milk', title: 'Milk and cups around the first birthday',
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
    return freshFirst(out).filter(i => !taken.some(t => t.topic === i.topic && t.key.split(':')[0] === i.key.split(':')[0])).slice(0, 2);
  }

  /* ---------- markup: Home's own components ----------
     Important items are rows inside the month card (with Home's Mark done controls),
     Coming up uses the "Prepare for next" list, and links use Home's text links. */
  // Home's own cards say what's new: a card that wasn't there on the last visit is tagged "New" for this visit.
  let freshKeys = new Set();
  const clearedKey = () => 'ahead-v2-home-cleared:' + journeyKey();
  const cleared = () => { try { return JSON.parse(localStorage.getItem(clearedKey())) || {}; } catch (e) { return {}; } };
  window.hubHomeClear = function (key, hide) { const c = cleared(); c[key] = NOW.getTime(); try { localStorage.setItem(clearedKey(), JSON.stringify(c)); } catch (e) {} if (hide) { const y = scrollY; render(); scrollTo(0, y); if (typeof hubToast === 'function') hubToast('Hidden', 'It’s still in its guide if you need it.'); } };
  // Opening a card clears it only if the parent stays a few seconds, so a mis-tap doesn't lose it.
  const openKey = () => 'ahead-v2-home-open:' + journeyKey();
  window.hubHomeOpen = function (key) { try { localStorage.setItem(openKey(), JSON.stringify({ key, at: Date.now() })); } catch (e) {} };
  function settleOpened() { let o = null; try { o = JSON.parse(localStorage.getItem(openKey())); localStorage.removeItem(openKey()); } catch (e) {} if (o && o.key && Date.now() - o.at >= 4000) hubHomeClear(o.key); }
  let seenAt = {};
  function freshFirst(items) {
    markFresh(items);
    if (!live()) return items;
    const c = cleared(), t = NOW.getTime();
    // Gone once opened or hidden. Anything else leaves Home after two weeks, except safety to-dos, which wait until they're done.
    const keep = items.filter(i => !c[i.key] && (i.key.startsWith('check:') || i.tools || !seenAt[i.key] || t - seenAt[i.key] < 14 * 864e5));
    return [...keep.filter(i => freshKeys.has(i.key)), ...keep.filter(i => !freshKeys.has(i.key))];
  }
  function markFresh(items) {
    if (!live()) return;
    const key = 'ahead-v2-seen:' + journeyKey(), t = NOW.getTime();
    let seen = null; try { seen = JSON.parse(localStorage.getItem(key)); } catch (e) {}
    seen = seen || { _since: t };
    // "New" only once the parent has been using Ahead for a while, so day one isn't all New.
    items.forEach(i => { if (seen[i.key] == null) seen[i.key] = t; if (seen[i.key] - seen._since > 6 * 3600 * 1000 && t - seen[i.key] < 6 * 3600 * 1000) freshKeys.add(i.key); });
    seenAt = seen;
    try { localStorage.setItem(key, JSON.stringify(seen)); } catch (e) {}
  }
  // Looking ahead on Home: what will be different by the picked month, one line per area, each opening that area at that month.
  function previewChanges() {
    if (live() || month <= actualMonth() || typeof hubAgeFor !== 'function') return '';
    const nowM = actualMonth(), care = x => hubAgeFor('care', x), dev = x => developmentMonth(x);
    const feed = c => c >= 9 ? 'Three meals a day, with milk alongside' : c >= 7 ? 'Thicker textures and finger foods' : c >= 6 ? 'First tastes of solids' : c >= 4 ? 'Getting ready for solids' : null;
    const sleep = c => c >= 8 ? 'Likely down to two naps' : c >= 4 ? 'Usually three naps' : c >= 1.5 ? 'Longer stretches at night' : null;
    const safe = d => d >= 9 ? 'Pulling up: anchor furniture and lower the crib mattress' : d >= 6 ? 'On the move: stair gates and babyproofing' : d >= 3 ? 'Reaching and rolling: clear the floor, stop swaddling' : null;
    const devT = d => { const k = typeof devRef === 'function' ? devRef(d) : null; return k != null && DEV_STAGES[k] ? DEV_STAGES[k].title : null; };
    const visit = x => WELL_VISITS.includes(x) ? healthJourneyLabel(x) : null;
    const lines = [
      ['Feeding', feed(care(month)), feed(care(nowM))], ['Sleep', sleep(care(month)), sleep(care(nowM))],
      ['Development', devT(dev(month)), devT(dev(nowM))], ['Safety', safe(dev(month)), safe(dev(nowM))], ['Health', visit(month), visit(nowM)]
    ].filter(([, a, b]) => a && a !== b);
    if (!lines.length) return '';
    return `<section class="connected-ahead brief-preview" aria-label="What changes"><div class="connected-section-heading"><h2>${esc(`What changes by ${month} months`)}</h2></div><div class="connected-ahead-list">${lines.map(([t, a]) => `<div class="brief-row brief-card">${conceptRow({ topic: t, title: babyCopy(a), body: '', action: `openPage('topic:${t}')`, art: 0, reason: null })}</div>`).join('')}</div></section>`;
  }
  function row(i) {
    // Like a notification: opening a card or hiding it clears it from Home. Safety to-dos clear when done, "Doesn't apply" or hidden.
    const todo = i.key.startsWith('check:') || !!i.tools, go = i.link ? i.link.go : `openPage('topic:${i.topic}')`;
    const base = { topic: i.topic, title: babyCopy(i.title), body: babyCopy(i.body), action: todo ? go : `hubHomeOpen('${i.key}');${go}`, art: 0, reason: null };
    let html = conceptRow(base) + `<button class="brief-hide" onclick="hubHomeClear('${i.key}',true)" aria-label="Hide this from Home">×</button>`;
    if (i.tools) html = `<div class="home-connected-sleep brief-card" style="${yearTheme(i.topic)}" data-brief="${i.key}"${todo ? ` data-home-check="${i.key.slice(6)}"` : ''}>${html}<div class="home-connected-actions">${i.tools}</div></div>`;
    else html = `<div class="brief-row brief-card" data-brief="${i.key}">${html}</div>`;
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
    freshKeys = new Set();
    settleOpened();
    const now = importantNow(), next = comingUp(now);
    const focus = homeCurrentFocus();
    const sig = [...now, ...next].map(i => i.key).join('|') + '|' + actualMonth() + '|' + (typeof chgStageIndex === 'function' ? ['Sleep', 'Feeding'].map(chgStageIndex).join(',') : '');

    const close = !live() ? '' : !now.length && !next.length ? `You’re all caught up for now.` : !now.length ? `Nothing to do right now. We’ll bring things up as they get closer.` : `That’s everything for now.`;

    let h = `${live() ? `<p class="home-age-line">${esc(name())} · ${esc(monthLabel(actualMonth()))}${profile.early && profile.due && typeof developmentMonth === 'function' && developmentMonth(actualMonth()) !== actualMonth() ? ` <button class="hub-agechip" onclick="openPage('age-context')" aria-label="${esc(monthLabel(developmentMonth(actualMonth())))} adjusted. About age">· ${developmentMonth(actualMonth())} adjusted <span aria-hidden="true">ⓘ</span></button>` : ''}</p>` : ''}<section class="connected-now" aria-label="What matters now"><div class="connected-summary"><div class="home-summary connected-summary-intro"><div class="home-summary-heading"><div class="home-month-eyebrow">${!live() ? (month > actualMonth() ? 'Coming up · ' : 'Looking back · ') + (month === 0 ? 'Newborn' : month + (month === 1 ? ' month' : ' months')) : 'What matters now'}</div><h1>${focus.title}</h1></div><span class="home-summary-art" aria-hidden="true">${homeMonthArt(month)}</span><p class="heroanswer">${focus.body}</p><div class="home-summary-spectrum" aria-hidden="true">${TOPICS.map(([t]) => `<span style="background:${YEAR_PALETTES[t].bg}"></span>`).join('')}</div></div>`;
    if (now.length) h += `<div class="connected-summary-links">${now.map(row).join('')}</div>`;
    h += `</div>${homeMomentRow()}</section>`;
    h += previewChanges();
    h += liveHomeCheckin();
    const ahead = [...next];
    if (ahead.length) h += `<section class="connected-ahead" aria-label="Coming up"><div class="connected-section-heading"><h2>Coming up</h2></div><div class="connected-ahead-list">${ahead.map(row).join('')}</div></section>`;
    if (close) h += `<p class="brief-close">${close}</p>`;
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
