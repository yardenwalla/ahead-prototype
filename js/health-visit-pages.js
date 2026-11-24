/* Ahead · Checkup pages (What to expect, Vaccines, Questions and notes) in the same look as Development's area pages:
   a soft card in the color of the row you tapped on Health, with a small flat picture, then the app's rows.
   Copy is short and in the parent's voice. Lines marked REVIEW need a pediatrician's check before launch. */
(function () {
  const H = () => window.__hub, F = s => H().F(s);
  const T = { green: ['#e6f5ec', '#356651'], blue: ['#e7effc', '#46638c'], yellow: ['#fff3dc', '#8a6a2a'], peach: ['#fdeee6', '#9a5a3c'], pink: ['#fdeef2', '#a24d6a'] };
  const P = { green: ['#e6f5ec', '#356651', '#bfe3cf', '#f2b8c6'], blue: ['#e7effc', '#46638c', '#9fb8df', '#bfe3cf'], yellow: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fbe6bd'] };
  // Pictures: a measuring bar beside a baby; a shot beside a drop; a note card.
  const ART = {
    green: c => `<svg viewBox="0 0 80 40" aria-hidden="true"><rect x="4" y="2" width="12" height="36" rx="6" fill="${c[2]}"/><circle cx="36" cy="24" r="14" fill="${c[3]}"/></svg>`,
    blue: c => `<svg viewBox="0 0 80 40" aria-hidden="true"><rect x="2" y="14" width="40" height="14" rx="7" fill="${c[2]}"/><path d="M58 6c6 9 10 15 10 20a10 10 0 0 1-20 0c0-5 4-11 10-20Z" fill="${c[3]}"/></svg>`,
    shot: c => `<svg viewBox="0 0 80 40" aria-hidden="true"><rect x="2" y="14" width="40" height="14" rx="7" fill="${c[2]}"/></svg>`,
    yellow: c => `<svg viewBox="0 0 80 40" aria-hidden="true"><rect x="2" y="4" width="30" height="34" rx="7" fill="${c[2]}"/><circle cx="44" cy="28" r="9" fill="${c[3]}"/></svg>`
  };
  const label = age => age === 0 ? 'First-week checkup' : age === 12 ? '12-month checkup' : `${age}-month checkup`;
  const head = (age, tone, title, lead) => `<div class="dev-area-head hv-head" style="--area:${P[tone][0]};--area-ink:${P[tone][1]}"><span class="dev-area-head-art">${(tone === 'blue' && !VAX[age].oral ? ART.shot : ART[tone])(P[tone])}</span><p class="hub-context">${label(age)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`;
  const row = (icon, tone, title, sub) => H().row({ icon, cat: 'Health', title, sub }).replace('class="hub-row is-static"', `class="hub-row is-static hl-row" style="--hl-bg:${T[tone][0]};--hl-ink:${T[tone][1]}"`);
  const frame = inner => `<div class="quiet-category hub-page hub-detail hv-page" data-overview="Health" style="${yearTheme('Health')}">${detailPageTop('Health')}${inner}</div>`;
  const lines = xs => `<ul class="hv-lines">${xs.map(([n, d]) => `<li><b>${F(n)}</b>${d ? `<span>${F(d)}</span>` : ''}</li>`).join('')}</ul>`;
  const details = (summary, inner, cls = '') => `<details class="hv-more ${cls}"><summary>${summary}<span class="hv-plus" aria-hidden="true">＋</span></summary>${inner}</details>`;

  /* ---------- What to expect ---------- */
  const EXPECT = {
    0: { lead: 'A first check after coming home: feeding, weight and jaundice, plus your hospital test results.', checks: [['bottle', 'green', 'Feeding and weight', 'Whether {s} {are|is} getting back toward birth weight'], ['eye', 'yellow', 'Jaundice', 'Skin and eyes, with a quick blood test if needed'], ['ear', 'blue', 'Newborn screening', 'Hearing, heart and blood-spot results from the hospital'], ['heart', 'peach', 'How you’re doing', 'Recovery, sleep and support at home']] },
    1: { lead: 'A check of how feeding and growth are going, and how you’re doing.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['bottle', 'yellow', 'Feeding', 'How feeds are going, and whether anything hurts'], ['smile', 'pink', 'Early responses', 'How {s} {move|moves} and {react|reacts} to people and sounds'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    2: { lead: 'A check of how Maya is growing and moving, and a chance to ask anything.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['smile', 'pink', 'Early development', 'How {s} {respond|responds} to you and {hold|holds} {p} head'], ['bottle', 'yellow', 'Feeding', 'A good moment to ask about night feeds'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    4: { lead: 'Growth, new movement and feeding, and a first chat about solids.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['roll', 'blue', 'Movement and play', 'Head control, reaching and smiles'], ['bottle', 'yellow', 'Feeding', 'Milk, vitamin D and signs of readiness for solids'], ['moon', 'pink', 'Sleep', 'Night waking and how feeds fit in'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    6: { lead: 'Growth, new skills, first foods and teeth.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['sit', 'blue', 'New skills', 'Rolling, reaching, sitting with support, and sounds'], ['bowl', 'yellow', 'First foods', 'How solids are going, and iron'], ['tooth', 'pink', 'Teeth', 'Tooth care, and a fluoride coating once teeth appear'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    9: { lead: 'A short development questionnaire, plus growth and feeding.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['star', 'blue', 'Development questionnaire', 'You answer questions about talking, moving and playing'], ['bowl', 'yellow', 'Feeding and teeth', 'Textures, finger foods and brushing'], ['ear', 'pink', 'Hearing and vision', 'Anything you’ve noticed at home'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    12: { lead: 'Growth, a blood test for anemia, and moving to milk and cups.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['drop', 'pink', 'Anemia check', 'A quick blood test'], ['home', 'blue', 'Lead test', 'A finger-prick test, routine in many areas'], ['cup', 'yellow', 'Milk and cups', 'Moving off bottles, and how much milk'], ['wave', 'peach', 'Development', 'Gestures, sounds and first steps']] }
  };
  // What's new at each age, step by step (AAP Bright Futures; mood screening at 1, 2, 4 and 6 months; fluoride varnish once teeth appear).
  // Each step: the line every visit shares, then tags for what's covered at this age.
  const FEEL = 'How you’re feeling';
  const VISIT = {
    0: { measure: ['Weight', 'Back to birth weight?'], ask: ['Feeding', 'Diapers', 'Sleep', 'Your recovery'], exam: ['Jaundice'], test: ['Results from the hospital', ['Hearing', 'Heart', 'Blood spot']], shots: 'Hepatitis B, only if {s} didn’t get it in the hospital.' },
    1: { ask: ['Feeding', FEEL], exam: ['Moving', 'Reacting to sounds'], shots: 'Maybe one: hepatitis B, if it’s not left for 2 months.' },
    2: { ask: ['Feeding', 'Sleep', FEEL], exam: ['Head control', 'Smiling at you'], shots: 'The first full round. Usually at the end of the visit.' },
    4: { ask: ['Feeding', 'Vitamin D', 'Ready for solids?', FEEL], exam: ['Head control', 'Reaching'], shots: 'Mostly the same ones as at 2 months.' },
    6: { ask: ['First foods', 'Iron', 'Sleep', FEEL], exam: ['Sitting', 'Fluoride, if teeth are in'], shots: 'Third doses, plus flu in season.' },
    9: { askLine: 'A short questionnaire about development.', ask: ['Talking', 'Moving', 'Playing'], exam: ['Hearing', 'Vision', 'Teeth'], shots: 'Often none, unless one was missed.' },
    12: { ask: ['Bottles to cups', 'How much milk', 'First words'], exam: ['Standing', 'First steps', 'Teeth'], test: ['A finger or heel prick', ['Iron', 'Lead, where routine']], shots: 'Mostly new vaccines this time.' }
  };
  // Before you go: the full list once, at the first checkup. Later checkups list only what's new for that visit (none if nothing is).
  const BRING = age => age === 0 ? [['shirt', 'green', 'Easy clothes', 'Something that comes off quickly'], ['pacifier', 'peach', 'A feed or a pacifier', 'It’s fine to feed during the visit']]
    : age === 12 ? [['pacifier', 'peach', 'A snack and a cup', 'A longer visit, with a blood test']] : (EXPECT[age].bring || []);
  function expectPage(age) {
    const e = EXPECT[age];
    // First week: jaundice at home, since it peaks in these days (AAP, HealthyChildren.org).
    const jaundice = age === 0 ? H().versus('Yellow skin at home: normal, or time to call?', ['Normal', 'A little yellow on the face in the first week, feeding well.'], ['Call your pediatrician', 'Yellow on the belly, legs or eyes, poor feeding, or very sleepy.']) : '';
    if (window.__hlOld) return frame(head(age, 'green', 'What to expect', e.lead) + H().list('What they’ll check', e.checks.map(c => row(...c))) + jaundice + H().list('Before you go', BRING(age).map(c => row(...c))));
    // Nov 19, round 2: the visit in the order it happens, one step per stop, with tags for what's covered at this age.
    // Order: measuring first, then questions, the pediatrician's exam, tests, and shots last (AAP Bright Futures visit flow).
    const V = VISIT[age], tags = xs => `<span class="hl-tags">${xs.map(x => `<em>${F(x)}</em>`).join('')}</span>`;
    const steps = [
      ['stand', 'green', 'Weigh and measure', 'Undressed down to the diaper.', V.measure || ['Weight', 'Length', 'Head size']],
      ['chat', 'yellow', 'Questions for you', V.askLine || 'Your pediatrician asks about', V.ask],
      ['steth', 'pink', 'The exam', 'Heart, hips, eyes and skin, plus', V.exam],
      V.test && ['drop', 'peach', 'A quick test', V.test[0], V.test[1]],
      ['shield', 'blue', 'Shots', V.shots]
    ].filter(Boolean);
    const flow = `<h2 class="hub-h2">${F('How the visit goes')}</h2><section class="hub-card hl-flow"><ol>${steps.map(([icon, tone, t, d, xs]) => `<li style="--hl-bg:${T[tone][0]};--hl-ink:${T[tone][1]}"><i class="hl-flow-ic">${hubArt(icon, 'Health')}</i><div><b>${F(t)}</b><span>${F(d)}</span>${xs ? tags(xs) : ''}</div></li>`).join('')}</ol><p class="hl-flow-note">${F('Some offices do these in a different order.')}</p></section>`;
    return frame(head(age, 'green', 'What to expect', e.lead) + flow + jaundice + H().list('Before you go', BRING(age).map(c => row(...c))));
  }

  /* ---------- Vaccines ---------- */
  const WHAT = { DTaP: 'Protects against whooping cough, diphtheria and tetanus', Hib: 'Protects against a cause of meningitis', Pneumococcal: 'Protects against pneumonia and ear infections', Polio: 'Protects against polio', 'Hepatitis B': 'Protects against a liver infection', Rotavirus: 'Protects against severe diarrhea', MMR: 'Protects against measles, mumps and rubella', Chickenpox: 'Protects against chickenpox', 'Hepatitis A': 'Protects against a liver infection' };
  // REVIEW: doses follow the app's existing schedule. Hepatitis B numbering assumes a birth dose.
  const VAX = {
    0: { lead: 'Hepatitis B is usually given at birth. This visit checks it was.', shots: [['Hepatitis B', '1st dose, if not given at birth']] },
    1: { lead: 'Maybe one shot today, or none: hepatitis B’s 2nd dose can wait until 2 months.', shots: [['Hepatitis B', '2nd dose, now or at 2 months']] },
    2: { lead: 'Many come combined, so it’s often 2 to 4 shots, plus drops by mouth.', shots: [['DTaP', '1st dose'], ['Hib', '1st dose'], ['Pneumococcal', '1st dose'], ['Polio', '1st dose'], ['Hepatitis B', '2nd dose, if not at 1 month']], oral: [['Rotavirus', '1st dose']] },
    4: { lead: 'The same as at 2 months, minus hepatitis B. Often 2 or 3 shots, plus drops by mouth.', shots: [['DTaP', '2nd dose'], ['Hib', '2nd dose'], ['Pneumococcal', '2nd dose'], ['Polio', '2nd dose']], oral: [['Rotavirus', '2nd dose']] },
    6: { lead: 'Third doses of most, and some depend on the brand your office uses.', shots: [['DTaP', '3rd dose'], ['Pneumococcal', '3rd dose'], ['Hib', '3rd dose with some brands'], ['Hepatitis B', '3rd dose, now or by 18 months'], ['Polio', '3rd dose, now or by 18 months']], oral: [['Rotavirus', '3rd dose with some brands']] },
    9: { lead: 'Often no shots at all, just a catch-up if anything was missed.', shots: [['Hepatitis B', '3rd dose, if not given yet'], ['Polio', '3rd dose, if not given yet']] },
    12: { lead: 'Mostly new vaccines, as separate shots. Some may wait until 15 months.', shots: [['MMR', '1st dose'], ['Chickenpox', '1st dose'], ['Hepatitis A', '1st dose'], ['Hib', 'Booster'], ['Pneumococcal', 'Booster']] }
  };
  // REVIEW: RSV, flu and COVID-19 timing.
  // Seasonal protection, by what a baby can get at this age (AAP 2026–27): RSV is an antibody shot, not a vaccine,
  // for babies under 8 months in their first RSV season unless the mother had the RSV vaccine at least 14 days before
  // birth; a second-season dose only for some higher-risk babies 8–19 months. Flu every fall from 6 months.
  // COVID-19 recommended for all babies 6–23 months. Under 6 months, flu and COVID-19 are "coming later".
  const SEASON = age => [
    age < 8 ? ['RSV antibody', 'One shot for {p} first RSV season', [['RSV season', 'Usually October to March'], ['Already had it?', 'Many babies get it at birth. One shot covers the season'], ['Not needed if', 'The RSV vaccine was given in pregnancy, at least 2 weeks before birth']]]
      : ['RSV antibody', 'Only for some higher-risk babies'],
    ...(age >= 6 ? [['Flu', 'Every fall. 2 doses the first time', [['The first time', '2 doses, at least 4 weeks apart']]], ['COVID-19', 'For all babies 6 to 23 months', [['How many doses', 'Your pediatrician will say']]]] : [])
  ];
  const LATER = age => age < 6 ? 'Flu and COVID-19 shots start at 6 months.' : '';
  // Each vaccine on one line: its name and dose, with what it protects against right underneath.
  const doses = xs => `<ul class="hv-doses">${xs.map(([n, d]) => WHAT[n] ? `<li class="hv-dose-more"><details><summary><b>${n}</b><span>${d}</span><i class="hv-plus" aria-hidden="true">＋</i></summary><em>${WHAT[n]}</em></details></li>` : `<li><b>${n}</b><span>${d}</span></li>`).join('')}</ul>`;
  function vaccinePage(age) {
    const v = VAX[age], s = SEASON(age);
    const names = s.map(x => x[0]), title = names.length === 3 ? `${names[0]}, ${names[1].toLowerCase()} and ${names[2]}` : names.join(' and ');
    const shotsSub = age === 12 ? 'Usually given as separate shots' : '';
    const list = `<h2 class="hub-h2">At this checkup</h2><div class="hub-list">${row('shield', 'blue', 'Shots', shotsSub)}${doses(v.shots)}${v.oral ? row('drop', 'green', 'By mouth', 'Drops, not a shot') + doses(v.oral) : ''}</div>`;
    const season = `<h2 class="hub-h2">Depends on the season</h2><div class="hub-list">${row('snow', 'peach', title, 'Your pediatrician will say which are due')}<ul class="hv-doses">${s.map(([n, d]) => `<li><b>${n}</b><em>${d}</em></li>`).join('')}</ul></div>`;
    // REVIEW: for babies under 3 months, any fever of 100.4°F or more needs a call.
    const call = age <= 2 ? 'A fever of 100.4°F+, 3 hours of crying that won’t stop, or swelling that grows.' : 'A fever of ' + (typeof feverTemp === 'function' ? feverTemp(age) : '101°F') + '+, 3 hours of crying that won’t stop, or swelling that grows.';
    const after = H().versus('After the shots', ['Normal for a day or two', 'Fussy or sleepy, a low fever, and a sore red spot where the shot went in.' + (age === 12 ? ' A fever or rash 1–2 weeks later can also be normal after MMR and chickenpox.' : '')], ['Call your pediatrician', call]);
    // Nov 19 (show, don't tell): how to help during the shots, as a photo, on the visits with several shots (AAP, CDC).
    const nurse = profile.feed === 'Breast milk' && profile.feedHow === 'Nursing', bottle = profile.feed === 'Formula';
    const during = window.__hlOld || ![2, 4, 6, 12].includes(age) ? '' : `<h2 class="hub-h2">${F('Help {o} through the shots')}</h2><section class="hub-card hl-during"><figure class="hl-photo"><img src="assets/health/shots.jpg" alt="A mom holding her baby close on her lap while a nurse gets ready"><span class="hl-tag" style="left:41%;top:74%"><i></i><span>${F('Thighs free')}</span></span></figure>`
      + H().list('', [row('heart', 'pink', 'Hold {o} on your lap', 'Close and upright, not lying on the table'), row('bottle', 'yellow', nurse ? 'Nurse during or right after' : bottle ? 'A bottle right after' : 'A feed during or right after', 'Sucking soothes'), row('shirt', 'green', 'Easy-off clothes', age === 12 ? 'Shots go in the thigh or the arm' : 'Shots go in the thigh this year')]) + `</section>`;
    return frame(head(age, 'blue', 'Vaccines', v.lead) + list + season + during + after + H().note('Based on the schedule pediatricians recommend. Your pediatrician confirms what’s due from Maya’s record.'));
  }

  /* ---------- Questions and notes: suggested questions in the parent's voice ---------- */
  const QUESTIONS = {
    0: ['Is {s} feeding enough?', 'When should {p} weight be checked again?', 'Do we need a jaundice follow-up?', 'Who do we call after hours?'],
    1: ['Is {s} growing well?', 'Feeding hurts or is hard. Can someone help?', 'Who can I talk to if I’m struggling?', 'Is the hepatitis B shot due now?'],
    2: ['Is {s} growing well?', 'Can we stop waking {o} up to feed at night?', 'Can I give {o} fever medicine after the shots?', 'Anything to watch before the 4-month checkup?'],
    4: ['Are {p} head control and reaching on track?', 'How will I know when {s’s} ready for solids?', 'Does {s} need vitamin D or iron?', 'Should {s} still feed at night?'],
    6: ['How should milk feeds change as solids begin?', 'Allergies run in our family. Should we start allergens differently?', 'Is it time for a flu shot?', 'How do we care for {p} teeth?'],
    9: ['What did the questionnaire show?', 'Is {s} ready for lumpier foods?', 'Are any vaccines still due?', 'Anything to watch before the 12-month checkup?'],
    12: ['When will the blood test results come back?', 'How do we switch to whole milk and cups?', 'Do {p} gestures and sounds look on track?', 'When should {s} see a dentist?']
  };
  window.healthJourneyQuestions = healthJourneyQuestions = age => (QUESTIONS[age] || []).map(F);

  // Shared with js/health-pages-v2.js (Nov 19 redesign of the checkup pages).
  window.__hv = { EXPECT, VISIT, VAX, SEASON, LATER, WHAT, label, T, P };
  const base = window.healthJourneyDetail;
  window.healthJourneyDetail = healthJourneyDetail = function (age, part) {
    if (!EXPECT[age]) return base(age, part);
    if (part === 'expect') return expectPage(age);
    if (part === 'vaccines') return vaccinePage(age);
    if (part === 'questions' || part === 'notes') {
      return base(age, part).replace(/<div class="hub-detail-head">[\s\S]*?<\/div>/, head(age, 'yellow', 'Questions and notes', 'Tick them off as you ask. What you hear stays with this checkup.'))
        .replace(/<p class="hub-q-hint">Tick them off as you go\.<\/p>/, '').replace(/(hub-page hub-detail)/, '$1 hv-page');
    }
    return base(age, part);
  };
})();
