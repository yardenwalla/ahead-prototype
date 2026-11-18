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
    0: { title: 'Feeding, weight and jaundice come first', lead: 'Usually 3–5 days after birth. Your hospital test results get checked too.', checks: [['bottle', 'green', 'Feeding and weight', 'Whether {s’s} regaining {p} birth weight'], ['eye', 'yellow', 'Jaundice', 'Skin and eyes, and a blood test if needed'], ['ear', 'blue', 'Newborn screening', 'Hearing, heart and blood-spot results from the hospital'], ['heart', 'peach', 'How you’re doing', 'Recovery, sleep and support at home']] },
    1: { title: 'A check on feeding, growth and you', lead: 'A short visit. Bring your feeding questions.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['bottle', 'yellow', 'Feeding', 'How feeds are going, and whether anything hurts'], ['smile', 'pink', 'Early responses', 'How {s} {move|moves} and {respond|responds} to you'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    2: { title: 'Growth and early skills, plus your questions', lead: 'No question is too small. Write them down before you go.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['smile', 'pink', 'Early development', 'Smiles, responses to you and head control'], ['bottle', 'yellow', 'Feeding', 'A good moment to ask about night feeds'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    4: { title: 'Movement, feeding and a first talk on solids', lead: 'Bring what you’ve noticed about rolling, reaching and feeds.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['roll', 'blue', 'Movement and play', 'Head control, reaching and smiles'], ['bottle', 'yellow', 'Feeding', 'Milk, vitamin D and readiness for solids'], ['moon', 'pink', 'Sleep', 'Night waking and how feeds fit in'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    6: { title: 'Growth, new skills, first foods and teeth', lead: 'Bring notes on how first foods are going.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['sit', 'blue', 'New skills', 'Rolling, reaching, sitting and early sounds'], ['bowl', 'yellow', 'First foods', 'How solids are going, and iron'], ['tooth', 'pink', 'Teeth', 'Tooth care, and a fluoride coating once teeth appear'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    9: { title: 'A development check, plus growth and feeding', lead: 'It’s a routine way to catch anything early.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['star', 'blue', 'Development questionnaire', 'You answer questions about talking, moving and playing'], ['bowl', 'yellow', 'Feeding and teeth', 'Textures, finger foods and brushing'], ['ear', 'pink', 'Hearing and vision', 'Anything you’ve noticed at home'], ['heart', 'peach', 'How you’re doing', 'A short questionnaire about your mood']] },
    12: { title: 'A blood test, plus the move to milk and cups', lead: 'Iron matters for a growing brain, and low iron is common now.', checks: [['steth', 'green', 'Growth and a head-to-toe exam', 'Weight, length and head size, then heart, hips, eyes and skin'], ['drop', 'pink', 'Anemia check', 'A finger or heel prick for iron'], ['home', 'blue', 'Lead check', 'A few questions, and a test if needed'], ['cup', 'yellow', 'Milk and cups', 'Moving off bottles, and how much milk'], ['wave', 'peach', 'Development', 'Gestures, sounds and first steps']] }
  };
  // Before you go: the full list once, at the first checkup. Later checkups list only what's new for that visit (none if nothing is).
  const BRING = age => age === 0 ? [['shirt', 'green', 'Easy clothes', 'Something that comes off quickly'], ['pacifier', 'peach', 'A feed or a pacifier', 'It’s fine to feed during the visit']]
    : age === 12 ? [['pacifier', 'peach', 'A snack and a cup', 'It’s a longer visit than usual']] : (EXPECT[age].bring || []);
  function expectPage(age) {
    const e = EXPECT[age];
    // First week: jaundice at home, since it peaks in these days (AAP, HealthyChildren.org).
    const jaundice = age === 0 ? '<h2 class="hub-h2">Yellow skin at home</h2>' + H().versus('', ['Normal', 'A little yellow on the face in the first week, feeding well.'], ['Call your pediatrician', 'Yellow belly, legs or eyes, poor feeding, or very sleepy.']) : '';
    // What's new at this visit leads; the growth check every visit has goes after it (Nov 18).
    const growth = e.checks.filter(c => c[0] === 'steth' && age >= 2).map(c => [c[0], c[1], 'The usual growth check', 'Weight, length, head size and a full exam']);
    const checks = growth.length ? [...e.checks.filter(c => c[0] !== 'steth' && c[0] !== 'heart'), ...growth, ...e.checks.filter(c => c[0] === 'heart')] : e.checks;
    return frame(head(age, 'green', e.title, e.lead) + H().list('What they’ll check', checks.map(c => row(...c))) + jaundice + H().list('Before you go', BRING(age).map(c => row(...c))));
  }

  /* ---------- Vaccines ---------- */
  const WHAT = { DTaP: 'Protects against whooping cough, diphtheria and tetanus', Hib: 'Protects against a cause of meningitis', Pneumococcal: 'Protects against pneumonia, ear infections and more', Polio: 'Protects against polio', 'Hepatitis B': 'Protects against a liver infection', Rotavirus: 'Protects against severe diarrhea', MMR: 'Protects against all three: measles, mumps and rubella', Chickenpox: 'Protects against chickenpox', 'Hepatitis A': 'Protects against a liver infection' };
  // REVIEW: doses follow the app's existing schedule. Hepatitis B numbering assumes a birth dose.
  const VAX = {
    0: { title: 'Hepatitis B, if it wasn’t given at birth', lead: 'Most babies get it in the hospital. This checkup makes sure.', shots: [['Hepatitis B', '1st dose, if not given at birth']] },
    1: { title: 'Maybe one shot today, or none', lead: 'Many offices give it with the 2-month shots.', shots: [['Hepatitis B', '2nd dose, now or at 2 months']] },
    2: { title: 'Often 2 to 4 shots, plus drops by mouth', lead: 'Many vaccines come combined in one shot.', shots: [['DTaP', '1st dose'], ['Hib', '1st dose'], ['Pneumococcal', '1st dose'], ['Polio', '1st dose'], ['Hepatitis B', '2nd dose, if not at 1 month']], oral: [['Rotavirus', '1st dose']] },
    4: { title: 'Mostly a repeat of the 2-month shots', lead: 'Often 2 or 3 shots, plus drops by mouth.', shots: [['DTaP', '2nd dose'], ['Hib', '2nd dose'], ['Pneumococcal', '2nd dose'], ['Polio', '2nd dose']], oral: [['Rotavirus', '2nd dose']] },
    6: { title: 'Mostly third doses of the same shots', lead: 'Some depend on the brand your office uses.', shots: [['DTaP', '3rd dose'], ['Pneumococcal', '3rd dose'], ['Hib', '3rd dose with some brands'], ['Hepatitis B', '3rd dose, now or by 18 months'], ['Polio', '3rd dose, now or by 18 months']], oral: [['Rotavirus', '3rd dose with some brands']] },
    9: { title: 'Often no shots at all', lead: 'Most babies are up to date by now.', shots: [['Hepatitis B', '3rd dose, if not given yet'], ['Polio', '3rd dose, if not given yet']] },
    12: { title: 'Mostly new vaccines, plus two boosters', lead: 'Some may wait until 15 months.', shots: [['MMR', '1st dose'], ['Chickenpox', '1st dose'], ['Hepatitis A', '1st dose'], ['Hib', 'Booster'], ['Pneumococcal', 'Booster']] }
  };
  // REVIEW: RSV, flu and COVID-19 timing.
  const SEASON = age => [
    age <= 6 ? ['RSV', 'Before {p} first RSV season, unless you had the vaccine 2+ weeks before birth'] : ['RSV', 'Before a second RSV season, only for some babies at higher risk'],
    ['Flu', age < 6 ? 'From 6 months, every fall' : 'Every fall. The first time takes 2 doses, 4 weeks apart'],
    ['COVID-19', age < 6 ? 'Recommended from 6 months to age 2' : 'Recommended from 6 months to age 2']
  ];
  // Each vaccine on one line: its name and dose, with what it protects against right underneath.
  const doses = xs => `<ul class="hv-doses">${xs.map(([n, d]) => WHAT[n] ? `<li class="hv-dose-more"><details><summary><b>${n}</b><span>${d}</span><i class="hv-plus" aria-hidden="true">＋</i></summary><em>${WHAT[n]}</em></details></li>` : `<li><b>${n}</b><span>${d}</span></li>`).join('')}</ul>`;
  function vaccinePage(age) {
    const v = VAX[age], s = SEASON(age);
    // Group rows carry no subtitle. Doses with a condition sit under a small label instead of a long dose line (Nov 18):
    // catch-up doses, doses that can wait, and doses that depend on the brand.
    const QUAL = [[/, if not.*$/, 'Only if missed earlier'], [/, now or by 18 months$/, 'Can wait until 18 months'], [/ with some brands$/, 'Depends on the brand'], [/, now or at 2 months$/, 'Now or at 2 months']];
    const grouped = xs => {
      const plain = xs.filter(x => !QUAL.some(([re]) => re.test(x[1])));
      const caps = QUAL.map(([re, label]) => [label, xs.filter(x => re.test(x[1])).map(([n, d]) => [n, d.replace(re, '')])]).filter(g => g[1].length);
      return (plain.length ? doses(plain) : '') + caps.map(([label, g], k) => `<p class="hv-doses-cap${!plain.length && !k ? ' is-first' : ''}">${F(label)}</p>` + doses(g)).join('');
    };
    const due = v.shots.filter(x => !/if not/.test(x[1]));
    const list = `<h2 class="hub-h2">At this checkup</h2><div class="hub-list">${row('shield', 'blue', 'Shots', '')}${grouped(v.shots)}${v.oral ? row('drop', 'green', 'By mouth', '') + grouped(v.oral) : ''}</div>`;
    const season = `<h2 class="hub-h2">Depends on the season</h2><div class="hub-list">${row('snow', 'peach', 'Ask which are due', '')}<ul class="hv-doses">${s.map(([n, d]) => `<li><b>${n}</b><em>${F(d)}</em></li>`).join('')}</ul></div>`;
    // REVIEW: for babies under 3 months, any fever of 100.4°F or more needs a call.
    const call = 'A fever of ' + (age <= 2 ? '100.4°F' : (typeof feverTemp === 'function' ? feverTemp(age) : '101°F')) + ' or higher, crying for 3+ hours, or swelling that grows.';
    const after = H().versus(due.length ? 'After the shots' : 'If {s} {get|gets} a shot', ['Normal for a day or two', 'Fussy or sleepy, a low fever, or a sore spot where the shot went in.'], ['Call your pediatrician', call]);
    // MMR and chickenpox can cause a late, mild reaction: its own note, so the normal box stays short (Nov 18).
    const late = age === 12 ? H().note('After MMR and chickenpox, a mild fever or rash 1–2 weeks later can be normal too.') : '';
    return frame(head(age, 'blue', v.title, v.lead) + list + season + after + late + H().note('Based on the AAP schedule. Your pediatrician confirms what’s due from Maya’s record.'));
  }

  /* ---------- Questions and notes: suggested questions in the parent's voice ---------- */
  const QUESTIONS = {
    0: ['Is {s} feeding enough?', 'When is {p} next weight check?', 'Does the jaundice need a follow-up?', 'Who do we call after hours?'],
    1: ['Is {s} growing well?', 'Feeding hurts or feels hard. Who can help us?', 'Where can I get help if I’m struggling?', 'Is hepatitis B due now or at 2 months?'],
    2: ['Is {s} growing well?', 'Can we stop waking {o} up for feeds?', 'Is fever medicine OK after {p} shots?', 'Anything to watch for before 4 months?'],
    4: ['Are {p} head control and reaching where they should be?', 'How will I know {s’s} ready for solids?', 'Does {s} need vitamin D or iron?', 'Should {s} still feed at night?'],
    6: ['How should milk feeds change as solids begin?', 'Allergies run in our family. Should we start allergens differently?', 'Is it time for a flu shot?', 'How do we care for {p} first teeth?'],
    9: ['What did the questionnaire show?', 'Is {s} ready for lumpier foods?', 'Are any vaccines still due?', 'What should we watch for next?'],
    12: ['When will we get the blood test results?', 'How should we move to milk and cups?', 'Are {p} gestures and sounds on track?', 'When should {s} see a dentist?']
  };
  window.healthJourneyQuestions = healthJourneyQuestions = age => (QUESTIONS[age] || []).map(F);

  const base = window.healthJourneyDetail;
  window.healthJourneyDetail = healthJourneyDetail = function (age, part) {
    if (!EXPECT[age]) return base(age, part);
    if (part === 'expect') return expectPage(age);
    if (part === 'vaccines') return vaccinePage(age);
    if (part === 'questions' || part === 'notes') {
      return base(age, part).replace(/<div class="hub-detail-head">[\s\S]*?<\/div>/, head(age, 'yellow', 'Questions worth asking at this visit', 'Tick them off as you ask. Notes you take stay with this checkup.'))
        .replace(/<p class="hub-q-hint">Tick them off as you go\.<\/p>/, '').replace(/(hub-page hub-detail)/, '$1 hv-page');
    }
    return base(age, part);
  };
})();
