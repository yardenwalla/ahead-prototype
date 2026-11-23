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
  const steps = (items, note) => `<section class="hub-card h2-steps"><ol>${items.map(([icon, tone, t, d]) => `<li>${ic(icon, tone)}<span><b>${F(t)}</b>${d ? `<small>${F(d)}</small>` : ''}</span></li>`).join('')}</ol>${note ? `<p class="h2-foot">${F(note)}</p>` : ''}</section>`;
  // "When to call" and other heads-ups: soft yellow, never red.
  const alert = (t, d, tone = 'yellow') => `<section class="h2-alert is-${tone}"><i aria-hidden="true">!</i><div><b>${F(t)}</b><p>${F(d)}</p></div></section>`;
  const sos = () => `<section class="h2-sos"><b>${F('Call 911 for emergency signs')}</b><p>${F('Struggling to breathe, blue lips, won’t wake or is floppy, or a seizure.')}</p></section>`;
  // Two tiles side by side: what's common, and when to call.
  const pair = (a, b) => `<div class="h2-pair"><div class="is-calm">${ic('', 'blue', SMILE)}<b>${F(a[0])}</b><p>${F(a[1])}</p></div><div class="is-call">${ic('', 'yellow', PHONE)}<b>${F(b[0])}</b><p>${F(b[1])}</p></div></div>`;
  // The top card: the guide's soft green card, with a photo when the page is about a moment you'll see.
  const top = (eyebrow, title, lead, photo, alt, cap) => `<div class="hub-detail-head h2-head${photo ? ' has-photo' : ''}"><p class="hub-context">${F(eyebrow)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}${photo ? `<figure class="h2-photo"><img src="assets/health/${photo}" alt="${e(alt)}"></figure>${cap ? `<p class="h2-cap">${F(cap)}</p>` : ''}` : ''}</div>`;
  const page = inner => `<div class="quiet-category hub-page hub-detail h2-page" data-overview="Health" style="${yearTheme('Health')}">${detailPageTop('Health')}${inner}</div>`;

  /* ---------- What to expect ---------- */
  // The visit, in order. Each step says what happens at this age (AAP Bright Futures; mood checks at 1, 2, 4 and 6 months).
  const MEASURE = ['steth', 'green', 'Measure and examine', 'Growth, then a head-to-toe exam'];
  // Nov 22: the steps are what happens at the visit; the topics you'll talk through sit under them as one row.
  const FORM = ['heart', 'pink', 'A short form for you', 'How you’re feeling since the birth'];
  const VISIT = {
    0: { lead: 'Feeding, weight and a jaundice check.', steps: [['steth', 'green', 'Weigh and examine', 'Weight and a jaundice check'], ['ear', 'peach', 'Go over the hospital tests', 'Hearing, heart and blood tests']], talk: [['bottle', 'Feeding', 'Feeds and diapers'], ['moon', 'Sleep', 'Where and how {s} {sleep|sleeps}'], ['heart', 'You', 'Your recovery']], before: 'Pick clothes that come off quickly. Feeding during the visit is fine.' },
    1: { lead: 'A short visit about feeding and growth.', steps: [MEASURE, FORM], talk: [['bottle', 'Feeding', 'How feeds are going'], ['smile', 'New skills', 'Moving and reacting'], ['moon', 'Sleep', 'Nights so far']], before: 'Pick clothes that come off quickly.' },
    2: { lead: 'A full checkup and the first round of shots.', steps: [MEASURE, FORM], talk: [['smile', 'New skills', 'Head control, smiles'], ['bottle', 'Feeding', 'Feeds and growth'], ['moon', 'Sleep', 'How nights are going']], before: 'Pick clothes that come off easily.' },
    4: { lead: 'Like 2 months, plus a first solids talk.', steps: [MEASURE, FORM], talk: [['roll', 'New skills', 'Reaching, rolling'], ['bowl', 'Feeding', 'Vitamin D, solids'], ['moon', 'Sleep', 'Night waking']], before: 'Bring your solids questions.' },
    6: { lead: 'Growth, sitting and teeth, and how first foods are going.', steps: [MEASURE, FORM], talk: [['sit', 'New skills', 'Sitting, babbling'], ['bowl', 'Feeding', 'First foods, iron'], ['tooth', 'Teeth', 'Fluoride, brushing']], before: 'Bring your questions about first foods.' },
    9: { lead: 'A short questionnaire about development, plus growth and teeth.', steps: [MEASURE, ['star', 'blue', 'A development questionnaire', 'Questions you answer about talking and play']], talk: [['bowl', 'Feeding', 'Textures, finger foods'], ['tooth', 'Teeth', 'Brushing'], ['ear', 'Eyes and ears', 'Anything you notice']] },
    12: { lead: 'New shots, a quick blood test and a talk about milk.', steps: [MEASURE, ['drop', 'peach', 'A quick blood test', 'A finger prick for iron, often lead']], talk: [['wave', 'New skills', 'Words, first steps'], ['cup', 'Milk and cups', 'Moving off bottles'], ['tooth', 'Teeth', 'Brushing, the dentist']], before: 'It’s a longer visit, so pack a snack.' }
  };
  // Shots are the last step of every visit (Nov 19 review), not a footnote.
  const SHOTS_STEP = { 0: 'Hepatitis B, if not given at birth', 1: 'Maybe one hepatitis B shot', 2: 'Usually last. The first big round', 4: 'Usually last. Second doses of the same ones', 6: 'Usually last. Third doses', 9: 'Often none, unless one was missed', 12: 'Usually last. New ones, boosters' };
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
  window.healthSickTiles = () => h2('Between checkups') + `<div class="h2-sick">${[['thermo', 'yellow', 'Fever', 'sick-fever'], ['drop', 'blue', 'Colds', 'cold'], ['bottle', 'pink', 'Tummy bugs', 'sick-tummy']].map(([icon, tone, t, id]) => `<button onclick="openPage('chg:Health:d:${id}')">${ic(icon, tone)}<b>${F(t)}</b></button>`).join('')}</div>`;
  // A real photo of this visit in the top card, with no labels: it sets the scene, the page says the rest.
  window.healthMainPhoto = age => `<figure class="h2-photo h2-main-photo"><img src="assets/health/checkup-${age}.jpg" alt="${e(PHOTO_ALT[age] || '')}"></figure>`;
  // Your visit, at a glance: the three pages as tiles, each with a line you'd want before opening it.
  window.healthGlance = function (age) {
    const v = window.__hv.VAX[age], d = journeyData(), asked = d.checks['q' + age] || {}, own = d.questions[age] || [];
    const total = healthJourneyQuestions(age).length + own.length, n = Object.keys(asked).filter(k => asked[k] && (!String(k).startsWith('m') || Number(String(k).slice(1)) < own.length)).length;
    const shots = age === 0 ? 'Maybe hepatitis B' : age === 1 ? 'Maybe one' : age === 9 ? 'Catch-up only' : { 2: 'The first round', 4: 'Second doses of the same ones', 6: 'Third doses of the same ones', 12: 'New ones, and boosters' }[age];
    // Nov 22 (Yarden's inspiration): the three pages as full rows, each line saying what's on that page at this age.
    const EXP = { 0: 'Weight, a jaundice check and the hospital tests', 1: 'Growth, an exam and how feeds are going', 2: 'Growth, an exam and new skills like smiling', 4: 'Growth, new skills and a first talk about solids', 6: 'Growth, sitting, first foods and teeth', 9: 'Growth, a development questionnaire and finger foods', 12: 'Growth, a blood test and moving to cups' };
    const VAXL = { 0: 'Hepatitis B and RSV protection', 1: 'Maybe a second hepatitis B shot', 2: 'The first big round, and helping {o} after', 4: 'Second doses, and helping {o} after', 6: 'Third doses, and the flu shot in season', 9: 'Usually none, unless one was missed', 12: 'New ones like measles, and boosters' };
    const ASKL = { 0: 'About feeding, diapers and sleep', 1: 'About feeds, sleep and crying', 2: 'About shots, sleep and feeds', 4: 'About solids, sleep and rolling', 6: 'About first foods, teeth and sleep', 9: 'About finger foods, words and moving', 12: 'About milk, cups and first steps' };
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
  const feverLine = mo => mo < 3 ? ['At this age, any fever needs a call', 'Under 3 months: 100.4°F (38°C) or higher? Call your pediatrician right away, day or night.']
    : mo < 6 ? ['At this age, call about a fever', '3 to 6 months: 101°F (38.3°C) or higher, or any fever lasting more than a day.']
    : ['When a fever needs a call', 'From 6 months: 103°F (39.4°C) or higher, or any fever lasting more than a day.'];
  function youPage() {
    const mo = m();
    return page(top('Looking after you', 'How are you doing?', 'A new baby is a lot, for every parent. Asking for help is part of caring for Maya.')
      + (mo >= 2 ? alert('Low for more than 2 weeks?', 'Feeling low or anxious most days, at any point this year, is worth telling your doctor.', 'blue')
        : hubWindowBar({ title: 'How long low feelings usually last', from: 0, to: 8, zones: [[0, 2, 'Common', 'band'], [2, 8, 'Still there? Get help', 'alert']], ticks: [[0, 'Birth'], [2, '2 weeks'], [4, '4 weeks'], [8, '8 weeks']], cat: 'Health', caption: 'Feeling weepy or overwhelmed is common in the first two weeks. If it lasts longer than that, get help.' }))
      + h2('Common, or time to get help?') + pair(mo < 1 ? ['Common in the first two weeks', 'Weepy or overwhelmed, with good moments too.'] : ['Common', 'Worn out or snappy. Rest and help work.'], ['Get help', 'Low mood or worry most days, or feeling you can’t cope.'])
      + `<section class="h2-before h2-line">${ic('heart', 'pink')}<div><b>${F('Talk to someone today')}</b><p>${F('National Maternal Mental Health Hotline: call or text, free, any time.')}</p><a class="h2-save" href="tel:18338526262">${F('Call 1-833-852-6262')}</a></div></section>`
      + h2('What helps') + rows([['steth', 'green', 'Tell your doctor how you feel', 'It’s common, and it’s treatable'], ['heart', 'pink', 'Take the help', 'Name one thing, like a meal or a nap'], mo < 1 ? ['notepad', 'yellow', 'Your postpartum checkup', 'If you gave birth, go even if you feel fine'] : ['moon', 'blue', 'Get one longer sleep', 'Someone else takes a feed']])
      + `<section class="h2-sos"><b>${F('If you’re thinking about harming yourself or Maya')}</b><p>${F('Call or text 988, or call 911, right now.')}</p><a class="h2-sos-btn" href="tel:988">${F('Call 988')}</a></section>`);
  }
  function sickHub() {
    const mo = m(), f = feverLine(mo);
    return page(top('Between checkups', 'When Maya seems sick', 'Most baby illnesses are mild and pass in a few days. Start with what you’re seeing.')
      + alert(f[0], f[1])
      + h2('What are you seeing?')
      + rows([['thermo', 'yellow', 'A fever', 'How to check, and when to call', "openPage('chg:Health:d:sick-fever')"],
        ['drop', 'blue', 'A cold or stuffy nose', 'Clear the nose so feeds go easier', "openPage('chg:Health:d:cold')"],
        ['bottle', 'pink', 'Vomiting or diarrhea', 'Keep feeds going, watch diapers', "openPage('chg:Health:d:sick-tummy')"]])
      + sos() + `<p class="h2-small is-center">${F('Not sure? Call your pediatrician’s office, day or night.')}</p>`);
  }
  function feverPage() {
    const mo = m(), u3 = mo < 3;
    const temp = feverTemp(mo), c = { '100.4°F': '38°C', '101°F': '38.3°C', '103°F': '39.4°C' }[temp];
    const title = u3 ? 'A fever at this age needs a call' : 'Most fevers mean the body is fighting a bug';
    const lead = u3 ? 'Even if {s} seems well otherwise, a fever under 3 months needs to be checked.' : 'How {s} {seem|seems} matters more than the number. Here’s when to call.';
    const chips = ['Seeming very unwell', 'A rash', 'Fewer wet diapers'].concat(u3 ? [] : ['A fever over a day']).map(t => `<li>${F(t)}</li>`).join('');
    const early = feverEarlyNote();
    const big = `<section class="h2-big"><div class="h2-big-top"><div><b>${temp.replace('°F', '')}<span>°F</span></b><small>${c} or higher</small></div><p>${F(u3 ? 'Call your pediatrician right away, day or night.' : mo < 6 ? 'Call your pediatrician, day or night.' : 'Call your pediatrician.')}</p></div><div class="h2-big-any"><b>${F('At any temperature, also call for')}</b><ul class="h2-chips">${chips}</ul>${early ? `<p>${F(early.trim())}</p>` : ''}</div></section>`

    const check = h2('Take {p} temperature') + `<section class="hub-card h2-thermo">${ic('thermo', 'blue')}<div><b>${F('Use a digital thermometer')}</b><p>${F(u3 ? 'Rectal is most accurate. Check any high reading that way.' : mo < 6 ? 'Rectal is most accurate. Forehead works well too.' : 'Rectal is most accurate. Forehead or ear work well too.')}</p></div></section>`
      + rows([['thermo', 'blue', 'Take a rectal temperature', 'Four quick steps', "openPage('chg:Health:d:sick-rectal')"]]);
    const help = h2('What helps') + rows([['bottle', 'yellow', 'Offer extra feeds', 'Little and often keeps {o} hydrated'], ['shirt', 'green', 'Dress {o} lightly', 'Extra layers keep a fever up'], ['moon', 'pink', 'Let {o} rest', 'Naps and quiet time']])
      + alert('Before any medicine', u3 ? 'Under 3 months, ask your pediatrician first.' : mo < 6 ? 'Acetaminophen can help. Ask your pediatrician for the dose.' : 'Acetaminophen or ibuprofen can help. Ask your pediatrician for the dose.', 'blue');
    return page(top('When Maya seems sick', title, lead) + big + check + help + sos());
  }
  function coldPage() {
    const mo = m();
    const seq = `<section class="hub-card h2-seq">${[['cold-saline.jpg', 'Saline drops', '2 per nostril, wait a minute'], ['cold-bulb.jpg', 'Gentle suction', 'Squeeze first, then tip in'], ['cold-feed.jpg', 'Then feed', 'Right away, while it’s clear']].map(([src, t, d], i) => `${i ? '<span class="h2-arrow" aria-hidden="true">›</span>' : ''}<figure><img src="assets/health/${src}" alt=""><figcaption><b>${F(t)}</b><small>${F(d)}</small></figcaption></figure>`).join('')}</section>`;
    return page(top('When Maya seems sick', 'A clear nose makes feeds easier', 'Colds are common in the first year, and most clear in 7–10 days.')
      + h2('Before feeds and sleep') + seq
      + `<p class="h2-small">${F('Up to 3 times a day, so {p} nose doesn’t get sore. Not after a feed: it can bring the milk up.')}</p>`
      + h2('Also helps') + rows([['snow', 'blue', 'A cool-mist humidifier', 'In {p} room at night'], ['bottle', 'yellow', 'Smaller, more frequent feeds', 'Easier with a stuffy nose'], ['shield', 'pink', 'Skip cold medicines', 'Not safe for babies. No honey before 1']])
      + alert('When to call', `A fever of ${feverTemp(mo)} or more, a cold past 10 days, fussing when lying down, or ear fluid.`)
      + sos());
  }
  function tummyPage() {
    // Nov 19 review: check how sick the baby is before any reassurance, so the warning signs come first.
    return page(top('When Maya seems sick', 'Keep {p} feeds going', 'First, check for the signs below. Most tummy bugs then pass in a day or two.')
      + h2('What to look for') + pair(['Common', 'Some loose poops or vomits, still feeding.'], ['Time to call', 'Can’t keep feeds down, a dry mouth, or blood in poop.'])
      + alert('Go to the ER', 'Green or bloody vomit.', 'peach')
      + `<section class="h2-watch">${ic('diaper', 'green')}<div><b>${F('Watch wet diapers')}</b><p>${F('Far fewer than usual, or none in 6 hours, can be a sign of dehydration.')}</p></div></section>`
      + h2('What helps') + rows([['bottle', 'yellow', 'Keep offering milk', 'Smaller feeds, more often'], ['hand', 'green', 'Wash hands after changes', 'Tummy bugs spread easily'], ['steth', 'pink', 'Ask before any medicine', 'Including anti-diarrhea medicine']])
      + sos());
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
        if (a === 'sick-rectal') return page(top('A fever', 'A rectal temperature, step by step', 'The most accurate reading for babies. It’s quick, and safe done gently.')
          + h2('Step by step') + steps([['hand', 'green', 'Get it ready', 'Wash the tip, add petroleum jelly'], ['moon', 'blue', 'Position {o}', 'On {p} back, knees to chest, or across your lap'], ['thermo', 'yellow', 'Slide it in gently', 'About ½ to 1 inch, never forcing it'], ['heart', 'pink', 'Hold until it beeps', 'Keep it steady, your hand cupping {p} bottom']])
          + alert('Keep it just for this', 'Wash it after each use, and label it so it’s never used in a mouth.', 'blue'));
        if (a === 'sick-tummy') return tummyPage();
      }
    }
    return baseRoute(p);
  };
})();
