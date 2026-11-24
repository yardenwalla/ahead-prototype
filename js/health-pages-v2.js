/* Ahead · Health pages, round 3 (Nov 19), from Yarden's mockups: the checkup pages (What to expect, Vaccines,
   Questions and notes) and the "When Maya seems sick" pages (the hub, a fever, a cold, vomiting or diarrhea).
   One shared look: the soft top card (a real photo where the page is about a moment at the visit), white cards,
   rows with soft colored icon tiles, numbered steps for real sequences, soft yellow cards for "when to call",
   and one calm 911 card at the very end. Content follows the AAP (HealthyChildren.org) and the CDC.
   window.__hlOld = true brings back the earlier pages. */
(function () {
  const H = () => window.__hub, F = s => H().F(s);
  const e = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const TONE = { green: ['#e6f5ec', '#356651'], blue: ['#e7effc', '#46638c'], yellow: ['#fff3dc', '#8a6a2a'], peach: ['#fdeee6', '#9a5a3c'], pink: ['#fdeef2', '#a24d6a'] };
  const PHONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  const SMILE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 13.5a4.2 4.2 0 0 0 7 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="9.3" cy="10" r="1" fill="currentColor"/><circle cx="14.7" cy="10" r="1" fill="currentColor"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHEV = '<svg class="h2-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ART = (icon) => (window.hubArt ? hubArt(icon, 'Health') : '');
  const ic = (icon, tone, raw) => `<i class="h2-ic" style="--t-bg:${TONE[tone][0]};--t-ink:${TONE[tone][1]}">${raw || ART(icon)}</i>`;

  /* ---------- Shared blocks ---------- */
  const h2 = t => `<h2 class="hub-h2">${F(t)}</h2>`;
  // Rows: an icon tile, a title and one line. Rows that don't open anything get no chevron.
  const rows = items => `<section class="hub-card h2-rows">${items.map(([icon, tone, t, d, go]) => `<${go ? `button onclick="${go}"` : 'div'} class="h2-row${go ? ' is-go' : ''}">${ic(icon, tone)}<span><b>${F(t)}</b>${d ? `<small>${F(d)}</small>` : ''}</span>${go ? CHEV : ''}</${go ? 'button' : 'div'}>`).join('')}</section>`;
  // Numbered steps, for things that really happen in order.
  const steps = (items, note) => `<section class="hub-card h2-steps"><ol>${items.map(([icon, tone, t, d, raw]) => `<li>${ic(icon, tone, raw)}<span><b>${F(t)}</b>${d ? `<small>${F(d)}</small>` : ''}</span></li>`).join('')}</ol>${note ? `<p class="h2-foot">${F(note)}</p>` : ''}</section>`;
  // "When to call" and other heads-ups: soft yellow, never red.
  const alert = (t, d, tone = 'yellow') => `<section class="h2-alert is-${tone}"><i aria-hidden="true">!</i><div><b>${F(t)}</b><p>${F(d)}</p></div></section>`;
  const sos = () => `<section class="h2-sos"><b>${F('Call 911 for emergency signs')}</b><p>${F('Struggling to breathe, blue lips, won’t wake or is floppy, or a seizure.')}</p></section>`;
  // Two tiles side by side: what's common, and when to call.
  // Nov 23: Health's calm-vs-act pair uses the app's shared pair (green calm side, soft red call side).
  const pair = (a, b) => H().versus('', a, b);
  // The top card: the guide's soft green card, with a photo when the page is about a moment you'll see.
  const top = (eyebrow, title, lead, photo, alt, cap) => `<div class="hub-detail-head h2-head${photo ? ' has-photo' : ''}"><p class="hub-context">${F(eyebrow)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}${photo ? `<figure class="h2-photo"><img src="assets/health/${photo}" alt="${e(alt)}"></figure>${cap ? `<p class="h2-cap">${F(cap)}</p>` : ''}` : ''}</div>`;
  const page = inner => `<div class="quiet-category hub-page hub-detail h2-page" data-overview="Health" style="${yearTheme('Health')}">${detailPageTop('Health')}${inner}</div>`;

  /* ---------- What to expect ---------- */
  // The visit, in order. Each step says what happens at this age (AAP Bright Futures; mood checks at 1, 2, 4 and 6 months).
  const MEASURE = ['steth', 'green', 'Measure and examine', 'Growth, then a head-to-toe exam'];
  // Nov 22: the steps are what happens at the visit; the topics you'll talk through sit under them as one row.
  const FORM = ['heart', 'pink', 'A short form for you', 'How you’ve been feeling lately'];
  const VISIT = {
    0: { lead: 'Feeding, weight and a jaundice check.', steps: [['steth', 'green', 'Weigh and examine', 'Weight and a jaundice check'], ['ear', 'peach', 'Go over the hospital tests', 'Hearing, heart and blood tests']], talk: [['bottle', 'Feeding', 'Feeds and diapers'], ['moon', 'Sleep', 'Where and how {s} {sleep|sleeps}'], ['heart', 'Your recovery', 'And how you feel']], before: 'Pick clothes that come off quickly. Feeding during the visit is fine.' },
    1: { lead: 'A short visit about feeding and growth.', steps: [MEASURE, FORM], talk: [['bottle', 'Feeding', 'How feeds are going'], ['smile', 'New skills', 'Moving and reacting'], ['moon', 'Sleep', 'Nights so far']], before: 'Pick clothes that come off quickly.' },
    2: { lead: 'A full checkup and the first round of shots.', steps: [MEASURE, FORM], talk: [['smile', 'New skills', 'Head control, smiles'], ['bottle', 'Feeding', 'Feeds and growth'], ['moon', 'Sleep', 'How nights are going']], before: 'Pick clothes that come off easily.' },
    4: { lead: 'Much like the 2-month visit, with a few new topics.', steps: [MEASURE, FORM], talk: [['roll', 'New skills', 'Reaching, rolling'], ['bowl', 'Feeding', 'Vitamin D, and starting solids'], ['moon', 'Sleep', 'Night waking']], before: 'Jot down a few questions in Notes before you go.' },
    6: { lead: 'Growth, sitting and teeth, and how first foods are going.', steps: [MEASURE, FORM], talk: [['sit', 'New skills', 'Sitting, babbling'], ['bowl', 'Feeding', 'First foods, iron'], ['tooth', 'Teeth', 'Brushing, and a fluoride coating for new teeth']], before: 'Bring your questions about first foods.' },
    9: { lead: 'A short questionnaire about development, plus growth and teeth.', steps: [MEASURE, ['star', 'blue', 'A development questionnaire', 'Questions you answer about talking and play']], talk: [['bowl', 'Feeding', 'Textures, finger foods'], ['tooth', 'Teeth', 'Brushing'], ['ear', 'Eyes and ears', 'How {s} {see|sees} and {hear|hears}']] },
    12: { lead: 'New shots, a quick blood test and a talk about milk.', steps: [MEASURE, ['drop', 'peach', 'A quick blood test', 'A finger prick for iron, often lead']], talk: [['wave', 'New skills', 'Words, first steps'], ['cup', 'Milk and cups', 'Moving off bottles'], ['tooth', 'Teeth', 'Brushing, the dentist']], before: 'It’s a longer visit, so pack a snack.' }
  };
  // Shots are the last step of every visit (Nov 19 review), not a footnote.
  const SHOTS_STEP = { 0: 'Hepatitis B, if not given at birth', 1: 'Maybe a second hepatitis B shot', 2: 'The first big round, at the end of the visit', 4: 'Second doses of the same shots, at the end of the visit', 6: 'Third doses, at the end of the visit', 9: 'Usually none, unless one was missed', 12: 'New ones and boosters, at the end of the visit' };
  Object.keys(VISIT).forEach(a => VISIT[a].steps.push(['shield', 'blue', 'Shots', SHOTS_STEP[a]]));
  const PHOTO_ALT = { 0: 'A pediatrician checking a newborn on a baby scale', 1: 'A pediatrician listening to a baby’s chest', 2: 'A baby on the exam table lifting her head, the pediatrician smiling back', 4: 'A baby reaching for a rattle the pediatrician holds', 6: 'A smiling baby sitting on the exam table beside the pediatrician', 9: 'A dad filling in a questionnaire with his baby on his lap', 12: 'A toddler standing at a bench as the pediatrician holds out her hands' };
  function expectPage(age) {
    const hv = window.__hv, V = VISIT[age];
    const jaundice = age === 0 ? h2('Yellow skin at home') + pair(['Common', 'A little yellow on the face, feeding well.'], ['Time to call', 'Yellow belly or eyes, feeding poorly, or extra sleepy.']) : '';
    return page(top(hv.label(age), 'What to expect', V.lead)
      + h2('The visit, step by step') + steps(V.steps, 'Some offices do things in a different order.')
      + (V.talk ? `<section class="hub-card h2-talk"><b class="h2-talk-h">${F('You’ll also talk about')}</b><div class="h2-talk-row">${V.talk.map(([icon, t, d], i) => `<div>${ic(icon, ['yellow', 'peach', 'pink'][i])}<b>${F(t)}</b><small>${F(d)}</small></div>`).join('')}</div></section>` : '')
      + jaundice
      + (V.before ? `<section class="h2-before">${ic('notepad', 'yellow')}<div><b>${F('Before you go')}</b><p>${F(V.before)}</p></div></section>` : ''));
  }

  /* ---------- The checkup page (Health's main page) ---------- */
  // Nov 22: Between checkups as three tiles, each opening its own page in one tap.
  // Nov 23 review: one row to the sick hub, so falls, medicine and CPR are reachable from Health too.
  window.healthSickTiles = () => h2('Between checkups') + rows([['thermo', 'yellow', 'When Maya seems sick', 'Fever, colds, tummy bugs, falls and first aid', "openPage('chg:Health:d:sick')"]]);
  // A real photo of this visit in the top card, with no labels: it sets the scene, the page says the rest.
  window.healthMainPhoto = age => `<figure class="h2-photo h2-main-photo"><img src="assets/health/checkup-${age}.jpg" alt="${e(PHOTO_ALT[age] || '')}"></figure>`;
  // Your visit, at a glance: the three pages as tiles, each with a line you'd want before opening it.
  window.healthGlance = function (age) {
    const v = window.__hv.VAX[age], d = journeyData(), asked = d.checks['q' + age] || {}, own = d.questions[age] || [];
    const total = healthJourneyQuestions(age).length + own.length, n = Object.keys(asked).filter(k => asked[k] && (!String(k).startsWith('m') || Number(String(k).slice(1)) < own.length)).length;
    const shots = age === 0 ? 'Maybe hepatitis B' : age === 1 ? 'Maybe one' : age === 9 ? 'Catch-up only' : { 2: 'The first round', 4: 'Second doses of the same ones', 6: 'Third doses of the same ones', 12: 'New ones, and boosters' }[age];
    // Nov 22 (Yarden's inspiration): the three pages as full rows, each line saying what's on that page at this age.
    // Pass 2: each row says something the top card and the other rows don't.
    const EXP = { 0: 'Weight, a jaundice check and the hospital tests', 1: 'Growth and a head-to-toe exam', 2: 'Growth, an exam and new skills like smiling', 4: 'Growth and a head-to-toe exam', 6: 'Growth, an exam and new skills like sitting', 9: 'Growth, an exam and a short questionnaire', 12: 'Growth, an exam and a quick blood test' };
    const VAXL = { 0: 'Usually none, unless {s} missed one in the hospital', 1: 'Maybe a second hepatitis B shot', 2: 'The first big round, and helping {o} after', 4: 'What {s} {get|gets}, and helping {o} after', 6: 'Third doses, and the flu shot in season', 9: 'Usually none, unless one was missed', 12: 'New ones like measles, and boosters' };
    const ASKL = { 0: 'About feeding, diapers and sleep', 1: 'About feeds, sleep and crying', 2: 'About sleep, feeds and crying', 4: 'About sleep, rolling and reaching', 6: 'About iron, teeth and sleep', 9: 'About finger foods, words and moving', 12: 'About milk, cups and first steps' };
    return h2('Your visit, at a glance') + rows([
      ['clock', 'green', 'What to expect', EXP[age], `openHealthDetail(${age},'expect')`],
      ['shield', 'blue', 'Vaccines', VAXL[age], `openHealthDetail(${age},'vaccines')`],
      ['notepad', 'yellow', 'Questions', ASKL[age] + (n ? ` · ${n} of ${total} asked` : ''), `openHealthDetail(${age},'questions')`]]);
  };
  // The year of checkups as a path: done ones ticked, the next one marked, the one you're reading filled in.
  window.healthTracker = function (age, focus) {
    const isLive = typeof isCurrent !== 'function' || isCurrent();
    const SHORT = { 0: '1st wk', 1: '1 mo', 2: '2 mo', 4: '4 mo', 6: '6 mo', 9: '9 mo', 12: '12 mo' };
    const SHOTS = { 2: 1, 4: 1, 6: 1, 12: 1 };
    const done = a => { try { const r = healthRecord(a); return r && r.status === 'attended'; } catch (x) { return false; } };
    const due = a => a === 0 ? new Date(parse(profile.dob).getTime() + 5 * 864e5) : addMonths(parse(profile.dob), a);
    const days = Math.round((due(focus) - NOW) / 864e5);
    const when = days > 1 ? `in ${days < 14 ? days + ' days' : Math.round(days / 7) + ' weeks'}` : days >= -14 ? 'now' : '';
    const nodes = WELL_VISITS.map(a => {
      // Nov 22 (Yarden: "a checklist of where you are"): checkups behind her by age are ticked, the one you're reading is ringed.
      const behind = done(a) || (isLive && a < focus);
      const cls = [a === age ? 'is-on' : '', behind ? 'is-done' : '', isLive && a === focus ? 'is-next' : ''].filter(Boolean).join(' ');
      const sub = '';   // Nov 22: the inspiration's path: no sublabels, the top card gives the date
      return `<button class="h2-node ${cls}" onclick="openPage('health-visit:${a}')"${a === age ? ' aria-current="page"' : ''}><i>${(done(a) || (isLive && a < focus)) && a !== age ? CHECK : a === age ? '<span></span>' : CHECK}</i><b>${SHORT[a]}</b></button>`;
    }).join('');
    return h2('Your checkups this year') + `<section class="hub-card h2-track"><div class="h2-track-line">${nodes}</div><i class="st-chip" hidden></i></section>`;
  };

  /* ---------- Vaccines ---------- */
  const listNames = xs => { const n = xs.map((x, i) => /^(DTaP|Hib|MMR)$/.test(x[0]) || i === 0 ? x[0] : x[0].replace(/^[A-Z][a-z]/, c => c.toLowerCase())); return n.length > 4 ? n.join(', ') : n.length < 3 ? n.join(' and ') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1]; };
  // A row that opens in place to show each dose and what it protects against.
  const openRow = (icon, tone, t, d, items) => `<details class="h2-row is-open-row">${'<summary>'}${ic(icon, tone)}<span><b>${F(t)}</b><small>${F(d)}</small></span>${CHEV}</summary><ul class="h2-doses">${items.map(([n, w]) => `<li><b>${e(n)}</b><span>${F(w)}</span></li>`).join('')}</ul></details>`;
  function vaccinePage(age) {
    const hv = window.__hv, v = hv.VAX[age], s = hv.SEASON(age), WHAT = hv.WHAT;
    const nurse = profile.feed === 'Breast milk' && profile.feedHow === 'Nursing', bottle = profile.feed === 'Formula';
    const tip = nurse ? 'Hold {o} on your lap and nurse during or right after. It soothes.' : bottle ? 'Hold {o} on your lap, and offer a bottle right after. It soothes.' : 'Hold {o} on your lap, and offer a feed during or right after. It soothes.';
    const doses = xs => xs.map(([n, d]) => [n, d + (WHAT[n] ? '. ' + WHAT[n] : '')]);
    // Three groups (Nov 19 review): what's due at this visit, what depends on the season, and what comes later.
    const atVisit = h2('Due at this visit') + `<section class="hub-card h2-rows">`
      + (v.shots.length === 1 ? openRow('shield', 'blue', v.shots[0][0], v.shots[0][1], [['', WHAT[v.shots[0][0]] || '']]) : '')
      + (v.shots.length === 1 ? '' : openRow('shield', 'blue', age === 9 ? 'Catch-up shots' : 'Routine shots', age === 9 ? 'Only if one was missed' : age === 12 ? 'MMR, chickenpox, hepatitis A, plus 2 boosters' : listNames(v.shots), doses(v.shots)))
      + (v.oral ? openRow('drop', 'green', 'Drops by mouth', 'Rotavirus. No needle', doses(v.oral)) : '')
      + `</section>`
      + h2('Depends on the season') + `<section class="hub-card h2-rows">`
      + s.map(([n, d, more]) => more ? openRow(n === 'Flu' ? 'snow' : n === 'COVID-19' ? 'shield' : 'drop', n === 'Flu' ? 'blue' : n === 'COVID-19' ? 'green' : 'peach', n, d, more) : `<div class="h2-row">${ic('drop', 'peach')}<span><b>${F(n)}</b><small>${F(d)}</small></span></div>`).join('')
      + `</section>` + (hv.LATER(age) ? `<p class="h2-small">${F(hv.LATER(age))}</p>` : '');
    const callLine = `${age <= 2 ? '100.4°F' : feverTemp(age)} or more, 3 hours of crying, or swelling that grows.`;
    const after = h2('After the shots') + pair(['Common for a day or two', 'Fussy, sleepy, a low fever or a sore spot.'], ['Time to call', callLine])
      + (age === 12 ? `<p class="h2-small">${F('After MMR and chickenpox, a fever or rash 1–2 weeks later is common too.')}</p>` : '');
    // Leads that already explain the shots (0, 1, 9) keep the page's small picture; visits with several shots show how to hold the baby.
    const photo = [2, 4, 6, 12].includes(age);
    return page(top(hv.label(age), 'Vaccines', v.lead, photo ? 'shots.jpg' : '', 'A mom holding her baby close on her lap at the pediatrician’s office', photo ? tip : '')
      + atVisit + after
      + `<p class="h2-small">${F('Your pediatrician confirms what’s due from {p} record.')}</p>`);
  }

  /* ---------- Questions and notes ---------- */
  // Each question ticks off, and opens to keep what the pediatrician said right under it.
  window.h2Answer = function (age, key, ev) {
    ev.preventDefault();
    const d = journeyData(), v = ev.target.querySelector('textarea').value.trim();
    d.answers = d.answers || {}; d.answers['q' + age] = Object.assign({}, d.answers['q' + age], { [key]: v });
    if (v) d.checks['q' + age] = Object.assign({}, d.checks['q' + age], { [key]: true });
    saveJourneyData(d); window.__h2open = String(key); const y = scrollY; render(); scrollTo(0, y);
  };
  window.h2Toggle = function (age, key, ev) { ev.preventDefault(); ev.stopPropagation(); hubAskedQuestion(age, key, !((journeyData().checks['q' + age] || {})[key])); };
  function questionsPage(age) {
    const hv = window.__hv, d = journeyData(), asked = d.checks['q' + age] || {}, said = (d.answers || {})['q' + age] || {};
    const own = d.questions[age] || [], qs = healthJourneyQuestions(age);
    const all = [...qs.map((q, i) => [i, q, false]), ...own.map((q, i) => ['m' + i, e(q), true])];
    const n = all.filter(([k]) => asked[k]).length;
    const bar = `<div class="h2-progress"><b>${n} of ${all.length} asked</b><span>${all.map(([k]) => `<i class="${asked[k] ? 'is-on' : ''}"></i>`).join('')}</span></div>`;
    const item = ([k, q, mine], i) => {
      const a = said[k] || '', open = window.__h2open === String(k);
      return `<details class="h2-q${asked[k] ? ' is-on' : ''}"${open ? ' open' : ''}><summary><button class="h2-q-tick" aria-label="${asked[k] ? 'Mark as not asked' : 'Mark as asked'}" onclick="h2Toggle(${age},${typeof k === 'number' ? k : `'${k}'`},event)">${CHECK}</button><span>${q}</span>${CHEV}</summary>`
        + `<div class="h2-q-body${a ? '' : ' is-editing'}">${a ? `<div class="h2-said"><small>${F('Your pediatrician said')}</small>${e(a)}<button type="button" class="h2-edit" onclick="this.closest('.h2-q-body').classList.add('is-editing')">Edit</button></div>` : ''}<form onsubmit="h2Answer(${age},${typeof k === 'number' ? k : `'${k}'`},event)"><textarea rows="2" maxlength="1000" placeholder="${F('What did your pediatrician say?')}" aria-label="What your pediatrician said">${e(a)}</textarea><div><button class="h2-save">${a ? 'Update' : 'Save'}</button>${mine ? `<button type="button" class="h2-remove" onclick="removeJourneyQuestion(${age},${String(k).slice(1)})">Remove question</button>` : ''}</div></form></div></details>`;
    };
    const notes = visitNotesFor(age);
    window.__h2open = null;
    return page(top(hv.label(age), 'Questions and notes', 'Tick each one off as you ask, and keep the answer with it.', '', '')
      + bar + `<div class="h2-qs">${all.map(item).join('')}</div>`
      + `<details class="h2-add"><summary>＋ ${F('Add a question')}</summary><form class="hub-q-add" onsubmit="submitJourneyQuestion(event,${age})"><input id="visitQuestion" maxlength="500" required placeholder="${F('Anything on your mind about {o}')}" aria-label="Add a question"><button>Add</button></form></details>`
      + `<section class="h2-after" id="visit-notes">${ic('notepad', 'green')}<b class="h2-after-t">${F('Follow-ups and next steps')}</b><form onsubmit="submitVisitNotes(event,${age})"><textarea id="appointmentNotes" maxlength="6000" rows="3" placeholder="${F('A recheck, a referral, something to watch')}" aria-label="Notes from the visit">${e(notes)}</textarea><button class="h2-save">${notes ? 'Update notes' : 'Save notes'}</button></form></section>`);
  }

  const baseJD = window.healthJourneyDetail;
  window.healthJourneyDetail = healthJourneyDetail = function (age, part) {
    if (!window.__hlOld && window.__hv && window.__hv.EXPECT[age]) {
      if (part === 'expect') return expectPage(age);
      if (part === 'vaccines') return vaccinePage(age);
      if (part === 'questions' || part === 'notes') return questionsPage(age);
      if (part === 'help') return page(top('Between checkups', 'When to get help', 'From most urgent to least. Not sure? Call: someone answers day or night.')
        + sos()
        + alert('Call your pediatrician now', actualMonth() < 3 ? 'Any fever of 100.4°F or more, trouble feeding, a lost skill, or {s} seems very unwell.' : `A fever of ${feverTemp(actualMonth())} or more or over a day, trouble feeding, or a lost skill.`)
        + `<section class="h2-before">${ic('notepad', 'green')}<div><b>${F('Bring it to the checkup')}</b><p>${F('Questions about growth, everyday patterns or decisions coming up.')}</p></div></section>`);
    }
    return baseJD(age, part);
  };

  /* ---------- When Maya seems sick ---------- */
  const m = () => actualMonth();
  // The app's one call card, 911 row only, with no heading: it sits right under the age's fever rule.
  const call911 = () => H().TPLB.calls({ nowLabel: 'Call 911', now: '{s} {struggle|struggles} to breathe, {have|has} blue lips, won’t wake or {are|is} floppy, or {have|has} a seizure.' }).replace(/^<h2[^>]*>[\s\S]*?<\/h2>/, '');
  const feverLine = mo => mo < 3 ? ['At this age, any fever needs a call', 'Under 3 months: 100.4°F (38°C) or higher? Call your pediatrician right away, day or night.']
    : mo < 6 ? ['At this age, call about a fever', '3 to 6 months: 101°F (38.3°C) or higher, or any fever lasting more than a day.']
    : ['When a fever needs a call', 'From 6 months: 103°F (39.4°C) or higher, or any fever lasting more than a day.'];
  function youPage() {
    const mo = m();
    return page(top('Looking after you', 'How are you doing?', 'A new baby is a lot, for every parent. Asking for help is part of caring for Maya.')
      // Pass 2: no "How long low feelings last" bar; its Common / Get help zones repeated the two boxes below.
      + h2('Common, or time to get help?') + pair(mo < 1 ? ['Common in the first two weeks', 'Weepy or overwhelmed, with good moments too.'] : ['Common', 'Feeling worn out or snappy. Rest and an extra pair of hands usually help.'], ['Get help', 'Low mood or worry most days for over 2 weeks, or feeling you can’t cope.'])
      + `<section class="h2-before h2-line">${ic('', 'pink', PHONE)}<div><b>${F('Talk to someone today')}</b><p>${F('National Maternal Mental Health Hotline: call or text, free, any time.')}</p><a class="h2-save" href="tel:18338526262">${F('Call 1-833-852-6262')}</a></div></section>`
      + h2('What helps') + rows([['steth', 'green', 'Tell your own doctor or midwife how you feel', 'It’s common, and it’s treatable'], ['heart', 'pink', 'Take the help', 'Name one thing, like a meal or a nap'], mo < 1 ? ['notepad', 'yellow', 'Your postpartum checkup', 'If you gave birth, go even if you feel fine'] : ['moon', 'blue', 'Get one longer sleep', 'Someone else takes a feed']])
      + `<section class="h2-sos"><b>${F('If you’re thinking about harming yourself or Maya')}</b><p>${F('Call or text 988, or call 911, right now.')}</p><a class="h2-sos-btn" href="tel:988">${F('Call 988')}</a></section>`);
  }

  // Nov 23 (round 4, Yarden: "add these"): steps a parent can follow in the moment. Sources: AHA infant CPR (30 compressions
  // with the heel of one hand, about 1½ inches (2025 AHA/AAP: the two-finger method is no longer taught); 2 breaths; 2 minutes before leaving to call if alone); HealthyChildren (AAP) Head Injury;
  // HealthyChildren Using Liquid Medicines (the dosing tool that comes with it, never a kitchen spoon).
  function cprPage() {
    return page(top('Emergencies', 'Infant CPR, step by step', 'For a baby who won’t wake and isn’t breathing normally. Start right away.')
      // Nov 23 (show and tell): where your hands go (heel of one hand), on a training manikin.
      + (window.aheadFig ? window.aheadFig('health/cpr', [['Push here', 'bl', 32, 58], ['Other hand on the forehead', 'tr', 82, 32]], '', '50%') : '')
      // Nov 23 review: check breathing too (AHA), and say what a parent alone does after the first 2 minutes.
      + h2('If {s} won’t respond') + steps([['hand', 'pink', 'Tap and shout', 'Tap {p} foot and call {p} name. No response, and not breathing or only gasping? Start now'],
        ['', 'pink', 'Get 911 coming', 'Have someone call, or put your phone on speaker. Alone with no phone? Do 2 minutes of CPR, then go call 911 and come back to keep going', PHONE],
        ['back', 'blue', 'On {p} back, on something firm', 'The floor or a table'],
        ['heart', 'pink', '30 fast pushes', 'Heel of one hand, center of the chest. About 1½ inches deep, about 2 a second'],
        ['mouth', 'blue', '2 small breaths', 'Tilt {p} head back a little. Cover {p} mouth and nose with your mouth, and puff until the chest rises'],
        ['clock', 'yellow', 'Keep going', '30 pushes, then 2 breaths, until help arrives or {s} {start|starts} breathing']])
      + `<div class="hub-tip"><b>${F('Learn it hands-on')}</b>${F('A short infant CPR class, often free or low-cost at hospitals, makes these steps feel natural.')}</div>`);
  }
  function fallPage() {
    return page(top('Emergencies', 'After a fall or a bump on the head', 'Most falls from a bed or couch don’t cause lasting harm.')
      + (window.aheadFig ? window.aheadFig('health/fall', [], '', '35%') : '')
      + h2('Right after') + steps([['heart', 'blue', 'Pause before you pick {o} up', 'If {s’s} knocked out or not moving, leave {o} still'],
        ['hand', 'green', 'Comfort {o}, then check', 'Look over {p} head, arms and legs. A cool cloth eases a bump'],
        ['eye', 'pink', 'Watch {o} for a day or two', 'Feeding, waking and acting like {o}self']])
      + H().TPLB.calls({ ped: 'anything more than a light bump. Say how far {s} fell, and onto what.', right: 'vomiting, unusual sleepiness, crying you can’t calm, a bulging soft spot, or {s} isn’t moving an arm or leg', nowLabel: 'Call 911', now: '{s} {were|was} knocked out, {have|has} a seizure, {have|has} trouble breathing, or {are|is} bleeding and it won’t stop.' }));
  }
  function medicinePage() {
    const mo = m();
    return page(top('When Maya seems sick', 'Giving medicine, the safe way', 'The right dose depends on {p} weight and the product.')
      // Nov 23 review: the photo shows the action with no labels; the steps carry the words.
      + (window.aheadFig ? window.aheadFig('health/medicine', [], '', '30%') : '')
      + (mo < 3 ? alert('Under 3 months', 'Ask your pediatrician before any medicine, even acetaminophen.', 'pink') : mo < 6 ? alert('Under 6 months', 'Acetaminophen only. No ibuprofen until 6 months.') : '')
      + h2('Step by step') + steps([['info', 'green', 'Check the dose', 'From your pediatrician or pharmacist, for {p} weight'],
        ['drop', 'blue', 'Use the syringe that came with it', 'Never a kitchen spoon. Measure in mL'],
        ['hand', 'yellow', 'Hold {o} propped up, like for a feed', 'Squirt slowly inside {p} cheek, not at the back of the throat'],
        ['notepad', 'pink', 'Write down the time and amount', 'So no one gives a second dose by mistake']])
      + alert('Skip these', 'Cough and cold medicines, aspirin, and any medicine made for adults.', 'blue')
      + H().TPLB.calls({ pedLabel: 'Call Poison Help, 1-800-222-1222', ped: 'you gave too much, or the wrong medicine.', nowLabel: 'Call 911', now: 'trouble breathing, swelling of the lips or face, or {s} won’t wake.' }));
  }
  function sickHub() {
    const mo = m(), f = feverLine(mo);
    // Nov 23 review: the age's fever rule first, with Call 911 right under it (no separate "When to call" at the end).
    return page(top('Between checkups', 'When Maya seems sick', 'Most baby illnesses are mild and pass in a few days.')
      + alert(f[0], f[1]) + call911()
      + h2('What are you seeing?')
      + rows([['thermo', 'yellow', 'A fever', 'How to check, and when to call', "openPage('chg:Health:d:sick-fever')"],
        ['nose', 'blue', 'A cold or stuffy nose', 'Clear the nose so feeds go easier', "openPage('chg:Health:d:cold')"],
        ['bottle', 'pink', 'Vomiting or diarrhea', 'Keep feeds going, watch diapers', "openPage('chg:Health:d:sick-tummy')"],
        ['head', 'blue', 'A fall or a bump on the head', 'Right after, and the next day or two', "openPage('chg:Health:d:fall')"],
        ['drop', 'green', 'Giving medicine', 'The right tool, and the right dose', "openPage('chg:Health:d:medicine')"]])
      + rows([['heart', 'pink', 'Infant CPR, step by step', 'For a baby who won’t wake and isn’t breathing', "openPage('chg:Health:d:cpr')"]])
      + `<p class="h2-small is-center">${F('Not sure? Call your pediatrician’s office, day or night.')}</p>`);
  }
  function feverPage() {
    const mo = m(), u3 = mo < 3;
    const temp = feverTemp(mo), c = { '100.4°F': '38°C', '101°F': '38.3°C', '103°F': '39.4°C' }[temp];
    const title = u3 ? 'A fever at this age needs a call' : 'Most fevers mean the body is fighting a bug';
    const lead = u3 ? 'Even if {s} {seem|seems} well otherwise.' : 'How {s} {seem|seems} matters more than the number.';
    const chips = ['Seeming very unwell', 'A rash', 'Fewer wet diapers'].concat(u3 ? [] : ['Fever lasting over a day']).map(t => `<li>${F(t)}</li>`).join('');
    const early = feverEarlyNote();
    const big = `<section class="h2-big"><div class="h2-big-top"><div><b>${temp.replace('°F', '')}<span>°F</span></b><small>${c} or higher</small></div><p>${F(u3 ? 'Call your pediatrician right away, day or night.' : mo < 6 ? 'Call your pediatrician, day or night.' : 'Call your pediatrician.')}</p></div><div class="h2-big-any"><b>${F('At any temperature, also call for')}</b><ul class="h2-chips">${chips}</ul>${early ? `<p>${F(early.trim())}</p>` : ''}</div></section>`

    // Nov 23 review: one thermometer row (was a box plus a row saying the same), and the medicine point lives on its row.
    const check = rows([['thermo', 'blue', 'Take a rectal temperature', u3 ? 'Most accurate at {p} age' : mo < 6 ? 'Most accurate. A forehead thermometer works too' : 'Most accurate. Forehead or ear work too', "openPage('chg:Health:d:sick-rectal')"]]);
    const help = h2('What helps') + rows([['bottle', 'yellow', 'Offer extra feeds', 'Little and often keeps {o} hydrated'], ['shirt', 'green', 'Dress {o} lightly', 'Extra layers keep a fever up'], ['moon', 'pink', 'Let {o} rest', 'Naps and quiet time']])
      + rows([['drop', 'green', 'Giving medicine', u3 ? 'Under 3 months, ask before any medicine' : mo < 6 ? 'Acetaminophen can help. Ask for the dose' : 'Acetaminophen or ibuprofen. Ask for the dose', "openPage('chg:Health:d:medicine')"]]);
    return page(top('When Maya seems sick', title, lead) + big + call911() + check + help);
  }
  function coldPage() {
    const mo = m();
    const seq = `<section class="hub-card h2-seq">${[['cold-saline.jpg', 'Saline drops', '2 per nostril, wait a minute'], ['cold-bulb.jpg', 'Gentle suction', 'Squeeze, tip in, then let go slowly'], [profile.feed === 'Breast milk' && (profile.feedHow || 'Nursing') === 'Nursing' ? 'cold-nurse.jpg' : 'cold-feed.jpg', 'Then feed', 'Right away, while it’s clear']].map(([src, t, d], i) => `${i ? '<span class="h2-arrow" aria-hidden="true">›</span>' : ''}<figure><img src="assets/health/${src}" alt=""><figcaption><b>${F(t)}</b><small>${F(d)}</small></figcaption></figure>`).join('')}</section>`;
    return page(top('When Maya seems sick', 'A clear nose makes feeds easier', 'Colds are common in the first year, and most clear in 7–10 days.')
      + h2('Before feeds and sleep') + seq
      + `<p class="h2-small">${F('Up to 3 times a day, so {p} nose doesn’t get sore.')}</p>`
      + h2('Also helps') + rows([['snow', 'blue', 'A cool-mist humidifier', 'In {p} room at night'], ['bottle', 'yellow', 'Smaller, more frequent feeds', 'Easier with a stuffy nose'], ['shield', 'pink', 'Skip cold medicines', 'Not safe for babies, and no honey before 12 months']])
      // Nov 23 cohesion pass: the app's one When to call card (was a yellow box plus a separate 911 box).
      + H().TPLB.calls(mo < 3 ? { ped: 'a cold past 10 days, fussing more when lying down, or fluid coming from {p} ear.', right: 'a rectal temperature of 100.4°F or higher', nowLabel: 'Call 911', now: '{s} {struggle|struggles} to breathe, {have|has} blue lips, won’t wake or {are|is} floppy, or {have|has} a seizure.' } : { ped: `a fever that lasts more than a day or reaches ${feverTemp(mo)}, a cold past 10 days, fussing more when lying down, or fluid coming from {p} ear.`, nowLabel: 'Call 911', now: '{s} {struggle|struggles} to breathe, {have|has} blue lips, won’t wake or {are|is} floppy, or {have|has} a seizure.' }));
  }
  function tummyPage() {
    // Nov 19 review: check how sick the baby is before any reassurance, so the warning signs come first.
    // Nov 23 review: one place for every call (pediatrician, ER, 911) in the When to call card; what's common sits in the lead.
    return page(top('When Maya seems sick', 'Keep {p} feeds going', 'Most tummy bugs pass in a few days. Some loose poops or a few vomits are common if {s’s} still feeding.')
      + h2('What helps') + rows([['bottle', 'yellow', 'Smaller feeds, more often', 'Easier to keep down'], ['hand', 'green', 'Wash hands after changes', 'Tummy bugs spread easily'], ['steth', 'pink', 'Ask before any medicine', 'Including anti-diarrhea medicine']])
      // Nov 23 cohesion pass: ER and 911 together in the app's one When to call card, at the end (was a peach ER box mid-page and a 911 box).
      + H().TPLB.calls({ ped: 'can’t keep feeds down, a dry mouth, blood in {p} poop, or no wet diaper in 6 hours.', er: 'green or bloody vomit.', nowLabel: 'Call 911', now: '{s} {struggle|struggles} to breathe, {have|has} blue lips, won’t wake or {are|is} floppy, or {have|has} a seizure.' }));
  }
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    if (!window.__hlOld) {
      const [, cat, screen, a] = p.split(':');
      if (cat === 'Health' && screen === 'd') {
        if (a === 'sick') return sickHub();
        if (a === 'sick-fever' || a === 'sick-temp' || a === 'sick-care') return feverPage();
        if (a === 'cold') return coldPage();
        if (a === 'you') return youPage();
        // Nov 23 review: every physical step (the diaper and the position were missing); the photo carries no words, the steps do.
        if (a === 'sick-rectal') return page(top('When Maya seems sick', 'A rectal temperature, step by step', 'The most accurate reading for babies. It’s quick, and safe done gently.')
          + (window.aheadFig ? window.aheadFig('health/temp-position', [], '', '45%') : '')
          + h2('Step by step') + steps([['thermo', 'green', 'Turn it on, clean the tip', 'Soap and water, then a little petroleum jelly'], ['back', 'blue', 'Undo {p} diaper, knees up', 'On {p} back, knees toward {p} chest, or tummy down across your lap'], ['hand', 'yellow', 'Slide it in gently', 'About ½ to 1 inch, never forcing it'], ['clock', 'pink', 'Hold until it beeps, then read it', 'Your hand cupping {p} bottom. Note the number and time']])
          + `<div class="hub-tip"><b>${F('Keep it just for this')}</b>${F('Wash it after each use, and label it so it’s never used in a mouth.')}</div>`);
        if (a === 'sick-tummy') return tummyPage();
        if (a === 'cpr') return cprPage();
        if (a === 'fall') return fallPage();
        if (a === 'medicine') return medicinePage();
      }
    }
    return baseRoute(p);
  };
})();
