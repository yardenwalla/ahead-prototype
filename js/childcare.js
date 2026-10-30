/* Ahead · Childcare: finding care that fits, and handing over well.
   Parent's questions, in order: "What are my options?" (tiles), "Is this one right for us?" (fit, timing),
   "How do I check a place or person?" (questions with what a good answer sounds like, and a shortlist where each
   place or person gets its own checklist and notes), "What does the caregiver need to know?" (a care card made of taps).
   No stages: childcare changes with your plans, not your baby's age. No prices, reviews or provider search.
   Sources: AAP (HealthyChildren.org) "Choosing Child Care" and "Safe Sleep in Child Care"; Caring for Our Children,
   4th ed. (ratios: centers 1 adult to 3 babies, groups of 6 or fewer; family child care 1 adult to 2 babies), via childcare.gov. */
(function () {
  const CAT = 'Childcare';
  const H = () => window.__hub;
  const F = s => H().F(s);

  /* ---------- registration: the eighth category ---------- */
  if (typeof TOPICS !== 'undefined' && !TOPICS.some(([t]) => t === CAT)) TOPICS.push([CAT, 'childcare', []]);
  if (typeof YEAR_PALETTES !== 'undefined') YEAR_PALETTES[CAT] = { bg: '#f8edb3', pale: '#fcf7dd', ink: '#6b5a0e', accent: '#e0c862' };
  if (typeof CAT_ICON_SCENE !== 'undefined') CAT_ICON_SCENE[CAT] = 0;
  if (typeof YEAR_STORIES !== 'undefined' && !YEAR_STORIES[CAT]) YEAR_STORIES[CAT] = YEAR_STORIES['Daily rhythm'];

  const baseSnap = stageSnapshot;
  window.stageSnapshot = stageSnapshot = t => t === CAT ? { title: 'Daycare, nannies, sitters and family', body: 'Find care that fits, and hand over with confidence.' } : baseSnap(t);
  const baseYear = categoryYear;
  window.categoryYear = categoryYear = t => t === CAT ? childcare() : baseYear(t);
  const baseCategory = completeCategory;
  window.completeCategory = completeCategory = t => t === CAT ? childcare() : baseCategory(t);

  /* ---------- storage on this device ---------- */
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const esc3 = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rerender = () => { const y = scrollY; render(); scrollTo(0, y); };

  /* ---------- the five types of care ---------- */
  // Each item comes with what good looks like, because that's the part parents don't know. Sources: Child Care Aware of America checklists; HHS parent's guide; AAP.
  const TYPES = {
    center: { icon: 'blocks', name: 'Daycare center', short: 'Small groups by age', who: 'place',
      lead: 'A licensed center with trained teachers, where babies are cared for in a room with others their age.',
      good: 'You want set hours, backup staff when someone’s out, and other babies around.', mind: 'Babies catch more colds the first year. Centers close on holidays and have set pickup times.',
      when: ['Start looking early', 'Infant rooms often have waitlists of several months, so many families start during pregnancy.'],
      // Steps, in the order a parent meets them: a quick call, the tour (look, then ask three), and before signing.
      steps: [['Before you visit', 'check', 'A quick call, or a look online', [['Do you have a spot for a baby, and when?', 'Ask about the waitlist, and how often it moves.'], ['What are your hours and cost?', 'Including closed days and any extra fees.'], ['Are you licensed?', 'You can read their inspection reports on your state’s child care site.']]],
        ['On the tour: look for', 'look', 'You can see these for yourself', [['Babies sleeping on their backs, in bare cribs', 'No blankets, bumpers or toys.'], ['Enough grown-ups for the babies', 'No more than 3 babies per adult, and 6 in a room.'], ['Warm, unhurried caregivers', 'Talking to babies, and picking them up when they cry.'], ['A clean, calm room', 'A clean changing area, covered outlets and floor space to play.']]],
        ['On the tour: ask', 'ask', 'The three that tell you the most', [['How long have the baby-room teachers been here?', 'A year or more. Familiar faces matter most for babies.'], ['What happens if a baby isn’t tired at nap time, or wakes up early?', 'Never forced to sleep or left crying. Quiet play, then back down when sleepy.'], ['Walk me through a baby’s day.', 'Feeds and naps on each baby’s own schedule, floor time and outside every day, and no screens.']]],
        ['Before you sign', 'check', 'Easy to ask by email', [['Is everyone trained in infant CPR?', 'Yes, and it’s kept current.'], ['Has every staff member had a background check?', 'Yes, everyone.'], ['When does a sick child stay home?', 'A clear, written policy.'], ['How will I hear about my baby’s day?', 'A daily note on feeds, naps and diapers.']]]] },
    home: { icon: 'home', name: 'Home daycare', short: 'A small group in a home', who: 'place',
      lead: 'A provider cares for a small group of children in their own home, often a mix of ages.',
      good: 'You’d like a smaller group and a homey feel, often with more flexible hours.', mind: 'With one provider, you’ll need backup care when they’re sick or away.',
      when: ['A few months ahead', 'Good spots fill up, so start about 3–6 months before you need care.'],
      steps: [['Before you visit', 'check', 'A quick call, or a look online', [['Do you have a spot for a baby, and when?', 'And how many babies they take.'], ['What are your hours and cost?', 'Including closed days and any extra fees.'], ['Are you licensed?', 'You can read their inspection reports on your state’s child care site.']]],
        ['On the tour: look for', 'look', 'You can see these for yourself', [['A safe place for babies to sleep', 'Their own crib, bare, away from older kids.'], ['No more than 2 babies per adult', 'Count the babies, and the grown-ups.'], ['A warm, unhurried caregiver', 'Talking to the children, and calm when one cries.'], ['A baby-safe home', 'Gates, covered outlets, and no smoke smell.']]],
        ['On the tour: ask', 'ask', 'The three that tell you the most', [['Who covers when you’re sick or on vacation?', 'A backup plan they can tell you about now.'], ['What happens if a baby isn’t tired at nap time, or wakes up early?', 'Never forced to sleep or left crying. Quiet play, then back down when sleepy.'], ['Walk me through a baby’s day.', 'Feeds and naps on the baby’s own schedule, floor time, outside, and no TV.']]],
        ['Before you sign', 'check', 'Easy to ask by email', [['Are you trained in infant CPR?', 'Yes, and it’s kept current.'], ['Has every adult in the home had a background check?', 'Yes, everyone over 18.'], ['Are there pets, a pool or guns in the home?', 'Pets kept apart, any pool fenced, any guns locked and unloaded.'], ['When does a sick child stay home?', 'A clear, written policy.']]]] },
    nanny: { icon: 'hand', name: 'Nanny or nanny share', short: 'One caregiver at home', who: 'person',
      lead: 'A caregiver who looks after your baby at home. In a nanny share, two families split one nanny.',
      good: 'You want one-on-one care at home, on a schedule that fits yours.', mind: 'You become an employer, with payroll and taxes. Plan backup for when your nanny is sick.',
      when: ['About 2–3 months ahead', 'That leaves time for interviews, references and a paid trial day.'],
      steps: [['Before you meet', 'check', 'A short phone call', [['Which days and hours can you work?', 'A clear answer that matches what you need.'], ['What pay are you looking for?', 'So you both know it fits before you meet.'], ['How long have you cared for babies under 1?', 'At least a year, with babies this young.']]],
        ['At the interview: watch for', 'look', 'Have Maya there if you can', [['How they are with Maya', 'They get down to {p} level, talk and smile.'], ['Phone away, full attention', 'On Maya, and on you.']]],
        ['At the interview: ask', 'ask', 'The three that tell you the most', [['What would a day with Maya look like?', 'Naps and feeds by {p} cues, time outside, books, and no screens.'], ['How do you put a baby down to sleep?', 'On the back, in a crib with nothing else in it.'], ['What would you do if Maya wouldn’t stop crying?', 'Calm, practical steps, and a call to you if worried. Never shaking.']]],
        ['Before you hire', 'check', 'Worth doing every time', [['Call two families they’ve worked for', 'Ask what they loved, and anything they’d change.'], ['A background check', 'Most nanny agencies and sites can run one.'], ['Infant CPR', 'Current, or a class before they start.'], ['A paid trial day', 'While you’re home, to see how it feels.']]]] },
    family: { icon: 'heart', name: 'Family or friends', short: 'Someone you trust', who: 'person', talk: true,
      lead: 'A grandparent, relative or friend looks after your baby, at your home or theirs.',
      good: 'You’d like someone who already loves Maya, with flexible timing.', mind: 'Advice has changed since they had babies. Talk it through early, kindly and clearly.',
      when: ['A few weeks ahead', 'Enough time to talk through the routine and do a practice day together.'],
      steps: [['Talk it through', 'talk', 'Kindly, before the first day', [['Back to sleep, in a bare crib, even for naps', 'No blankets, bumpers or tummy sleeping. The biggest change since they had babies.'], ['The car seat, every ride', 'Rear-facing and buckled snugly, even for short trips.'], ['The day: naps, bedtime and feeds', 'And no honey, juice or new foods until you’ve tried them.'], ['If they feel frustrated', 'Put Maya down somewhere safe and step away for a minute. Never shake a baby.'], ['How you’ll stay in touch', 'A text after naps, or whatever suits you both.']]]] },
    sitter: { icon: 'moon', name: 'Babysitter', short: 'For a few hours', who: 'person',
      lead: 'Someone who watches your baby now and then, for a date night, an appointment or an afternoon.',
      good: 'You need a few hours of help, not regular care.', mind: 'Meet them with Maya first, and walk them through sleep and the car seat.',
      when: ['A week or two ahead', 'Try a short first visit while you’re at home, so everyone gets comfortable.'],
      steps: [['Before they come', 'check', 'A quick message or call', [['Have you looked after babies this young?', 'Yes, more than once.'], ['Are you trained in infant CPR?', 'Yes, ideally in the last 2 years.'], ['Can I call a family you’ve sat for?', 'Yes, gladly.']]],
        ['A first visit, while you’re home', 'look', 'An hour is enough', [['How they hold and talk to Maya', 'Calm, gentle and engaged.'], ['Show them sleep and the car seat', 'On the back in a bare crib, and buckled snugly.']]],
        ['Ask', 'ask', 'Before you head out', [['What would you do in an emergency?', 'Call 911 first, then you.'], ['What would you do if Maya won’t settle?', 'Hold, rock and soothe, and text you if it lasts.']]]] },
  };

  /* ---------- the summary screen: tiles for the types of care ---------- */
  function frame(body) {
    return `<div class="quiet-category hub-page" data-overview="${CAT}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${body}<p class="hub-foot">${F('Every family’s situation is different. Pick the care that fits yours.')}</p></div>`;
  }
  const shortlist = () => load('ahead-childcare-shortlist', {});
  function childcare() {
    const h = H(), card = load('ahead-carecard', {}), list = shortlist();
    let b = h.hero({ eyebrow: 'Childcare', title: 'Finding care that fits', checksLabel: 'Wherever you look', checks: ['Start early: spots for babies fill up fast', 'Ask every place or person the same safety questions', 'Visit before you decide, and bring Maya if you can'] });
    b += `<h2 class="hub-h2">${F('Types of care')}</h2><div class="cc-tiles">${Object.entries(TYPES).map(([k, t]) => { const n = (list[k] || []).length;
      return `<button class="cc-tile" onclick="openPage('chg:${CAT}:d:${k}')"><span class="cc-tile-art">${hubArt(t.icon, CAT)}</span><b>${F(t.name)}</b><small>${F(n ? `${n} on your shortlist` : t.short)}</small></button>`; }).join('')}</div>`;
    b += h.list('Before the first day', [
      h.row({ icon: 'notepad', cat: CAT, title: `${name()}’s care card`, sub: card.saved ? 'Ready to share with any caregiver' : 'A few taps, then share it with any caregiver', onclick: `openPage('chg:${CAT}:d:card')` })
    ]);
    b += h.tip('Ease in', 'A few short days before the real start helps you both. Leave with a quick, warm goodbye.');
    return frame(b);
  }

  /* ---------- questions you can change: hide ours, add your own ---------- */
  // Each question has a stable key ('d3' for ours, 'c…' for yours), so ticks on a shortlist survive edits.
  const qPrefs = () => load('ahead-childcare-qs', {});
  const questions = k => { const t = TYPES[k], p = qPrefs()[k] || {}, hid = p.hidden || [];
    let i = 0; const ours = [];
    t.steps.forEach(([g, kind, gs, qs]) => qs.forEach(([q, a]) => ours.push({ key: 'd' + i++, q, a, g, kind, gs })));
    return ours.filter(x => !hid.includes(x.key)).concat((p.added || []).map(x => ({ key: x.key, q: x.q, a: '', own: true, g: 'Your questions', kind: 'ask', gs: '' }))); };
  // The hint under each item: what a good answer sounds like when you ask, plain advice otherwise.
  const hint = x => x.own ? 'Your question' : x.kind === 'ask' ? 'Listen for: ' + x.a : x.a;
  // Group headings between questions, in the order they come.
  const grouped = (Q, row) => { let last = null, n = 0; const many = new Set(Q.map(x => x.g)).size > 1; return Q.map(x => { const head = x.g !== last && many ? `<p class="cc-group"><span>${++n}</span>${F(x.g)}${x.gs ? `<small>${F(x.gs)}</small>` : ''}</p>` : ''; last = x.g; return head + row(x); }).join(''); };
  const qEditing = {};
  window.ccQEdit = k => { qEditing[k] = !qEditing[k]; rerender(); };
  window.ccQHide = (k, key) => { const all = qPrefs(), p = all[k] = all[k] || {};
    if (key.startsWith('c')) p.added = (p.added || []).filter(x => x.key !== key); else p.hidden = (p.hidden || []).concat(key);
    save('ahead-childcare-qs', all); rerender(); };
  window.ccQAdd = k => { const el = document.getElementById('ccNewQ'), q = el && el.value.trim(); if (!q) return;
    const all = qPrefs(), p = all[k] = all[k] || {}; p.added = (p.added || []).concat({ key: 'c' + Date.now(), q }); save('ahead-childcare-qs', all); rerender(); };
  window.ccQReset = k => { const all = qPrefs(); delete all[k]; save('ahead-childcare-qs', all); rerender(); };

  /* ---------- one page per type, always in the same order ---------- */
  function typePage(k) {
    const t = TYPES[k], h = H(), mine = shortlist()[k] || [], noun = t.who === 'place' ? 'place' : 'person', Q = questions(k);
    const ed = qEditing[k], changed = !!qPrefs()[k];
    const qs = `<div class="cc-qs${ed ? ' is-editing' : ''}">${grouped(Q, x => `<div class="cc-q"><div><b>${x.own ? esc3(x.q) : F(x.q)}</b><small>${F(hint(x))}</small></div>${ed ? `<button class="cc-q-x" aria-label="Remove this question" onclick="ccQHide('${k}','${x.key}')">×</button>` : ''}</div>`)}`
      + (ed ? `<div class="cc-q-add"><input id="ccNewQ" placeholder="${esc3('Add your own question')}" autocomplete="off" onkeydown="if(event.key==='Enter')ccQAdd('${k}')"><button onclick="ccQAdd('${k}')">${F('Add')}</button></div>${changed ? `<button class="cc-q-reset" onclick="ccQReset('${k}')">${F('Bring back our questions')}</button>` : ''}` : '') + `</div>`;
    const shortRows = mine.map(c => h.row({ icon: t.icon, cat: CAT, title: esc3(c.name || 'Unnamed'), sub: `${(c.checks || []).filter(x => Q.some(y => y.key === x)).length} of ${Q.length} ${t.talk ? 'talked through' : 'checked'}${c.notes ? ' · has notes' : ''}`, onclick: `openPage('chg:${CAT}:d:cand-${k}-${c.id}')` }));
    return h.detail(CAT, 'Childcare', t.name, t.lead,
      `<section class="hub-card cc-fit"><div><b>${F('A good fit if')}</b><p>${F(t.good)}</p></div><div><b>${F('Keep in mind')}</b><p>${F(t.mind)}</p></div></section>`
      + h.tip(t.when[0], t.when[1])
      + `<div class="cc-qhead"><h2 class="hub-h2">${F(t.talk ? 'Things to talk through' : t.who === 'place' ? 'Checking a place' : 'Finding the right person')}</h2><button class="cc-qedit" onclick="ccQEdit('${k}')">${F(ed ? 'Done' : 'Edit')}</button></div>` + qs
      + `<h2 class="hub-h2">${F('Your shortlist')}</h2>`
      + (mine.length ? h.list('', shortRows) : `<p class="cc-lead">${F(t.talk ? `Add each person who’ll help, and tick off what you’ve talked through.` : `Add each ${noun} you’re considering. The steps above become a checklist for each one, with space for notes.`)}</p>`)
      + `<button class="hub-button is-secondary cc-add" onclick="openPage('chg:${CAT}:d:cand-${k}-new')">＋ ${F(`Add a ${noun}`)}</button>`, t.icon);
  }

  /* ---------- one place or person: tick the good answers, add notes, Save ---------- */
  function candidatePage(k, id) {
    const t = TYPES[k], h = H(), list = shortlist(), mine = list[k] || [], c = mine.find(x => x.id === id) || { id: 'new', name: '', contact: '', checks: [], notes: '' };
    const noun = t.who === 'place' ? 'place' : 'person', isNew = c.id === 'new';
    const checks = grouped(questions(k), x => `<label class="cc-check"><input type="checkbox" data-k="${x.key}" ${(c.checks || []).includes(x.key) ? 'checked' : ''}><span><b>${x.own ? esc3(x.q) : F(x.q)}</b>${x.a || x.own ? `<small>${F(hint(x))}</small>` : ''}</span></label>`);
    return h.detail(CAT, t.name, isNew ? `Add a ${noun}` : esc3(c.name), isNew ? '' : '',
      `<section class="hub-card cc-form"><label class="cc-field"><span>${F(t.who === 'place' ? 'Name of the place' : 'Their name')}</span><input id="ccName" value="${esc3(c.name)}" placeholder="${esc3(t.who === 'place' ? 'For example, Little Oaks' : 'For example, Sam')}" autocomplete="off"></label>
        <label class="cc-field"><span>${F('Phone or email (optional)')}</span><input id="ccContact" value="${esc3(c.contact)}" autocomplete="off"></label></section>`
      + `<h2 class="hub-h2">${F(t.talk ? 'What you’ve talked through' : 'Your checklist')}</h2><p class="cc-lead">${F(t.talk ? 'Tick each one once you’ve talked it over.' : 'Tick each one as you go, where you liked what you saw or heard.')}</p><section class="hub-card cc-checks">${checks}</section>`
      + `<h2 class="hub-h2">${F('Notes')}</h2><textarea id="ccNotes" class="cc-notes" rows="4" placeholder="${esc3('What stood out, how it felt, anything to follow up…')}">${esc3(c.notes)}</textarea>`
      + `<div class="cc-actions"><button class="hub-button" onclick="ccSaveCand('${k}','${c.id}')">${F('Save')}</button>${isNew ? '' : `<button class="cc-remove" onclick="ccRemoveCand('${k}','${c.id}')">${F('Remove from shortlist')}</button>`}</div>`, t.icon);
  }
  window.ccSaveCand = function (k, id) {
    const list = shortlist(), mine = list[k] = list[k] || [];
    const v = s => (document.getElementById(s) || {}).value || '';
    const checks = [...document.querySelectorAll('.cc-checks input:checked')].map(x => x.dataset.k);
    const rec = { id: id === 'new' ? String(Date.now()) : id, name: v('ccName').trim() || 'Unnamed', contact: v('ccContact').trim(), checks, notes: v('ccNotes').trim() };
    const i = mine.findIndex(x => x.id === rec.id); if (i >= 0) mine[i] = rec; else mine.push(rec);
    save('ahead-childcare-shortlist', list);
    openPage(`chg:${CAT}:d:${k}`);
  };
  window.ccRemoveCand = function (k, id) {
    const list = shortlist(); list[k] = (list[k] || []).filter(x => x.id !== id); save('ahead-childcare-shortlist', list);
    openPage(`chg:${CAT}:d:${k}`);
  };

  /* ---------- the care card: mostly taps, then Save, then Share ---------- */
  const OPT = {
    milk: ['Breast milk', 'Formula', 'Both'],
    often: ['Every 2–3 hours', 'Every 3–4 hours', 'When hungry'],
    oz: ['2–3 oz', '4–5 oz', '6–8 oz'],
    solids: ['Not yet', 'A few foods', 'Most foods'],
    naps: ['1', '2', '3', '4 or more'],
    asleep: ['Feeding', 'Rocking', 'Pacifier', 'White noise', 'On their own'],
    calm: ['Holding', 'Rocking', 'Singing', 'Walking around', 'Pacifier', 'Going outside'],
    allergy: ['None known', 'Yes']
  };
  const card = () => { const c = load('ahead-carecard', {}); if (!c.milk && profile.feed) c.milk = OPT.milk.includes(profile.feed) ? profile.feed : null; return c; };
  window.ccPick = function (k, v, multi) {
    const c = card();
    if (multi) { const a = c[k] || []; c[k] = a.includes(v) ? a.filter(x => x !== v) : a.concat(v); } else c[k] = c[k] === v ? null : v;
    save('ahead-carecard', c); rerender();
  };
  window.ccNapTime = (i, v) => { const c = card(); c.napTimes = c.napTimes || []; c.napTimes[i] = v; save('ahead-carecard', c); };
  const clock = v => { if (!v) return ''; const [h, m] = v.split(':').map(Number); return `${h % 12 || 12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'am' : 'pm'}`; };
  window.ccText = (k, v) => { const c = card(); c[k] = v; save('ahead-carecard', c); };
  window.ccCardMode = function (mode) { const c = card(); c.saved = mode === 'view'; save('ahead-carecard', c); scrollTo(0, 0); render(); };
  const chips = (k, multi, c) => `<div class="cc-chips">${OPT[k].map(v => { const on = multi ? (c[k] || []).includes(v) : c[k] === v; return `<button class="cc-chip${on ? ' is-on' : ''}" aria-pressed="${on}" onclick="ccPick('${k}','${v.replace(/'/g, '\\\'')}',${multi})">${F(v === 'On their own' ? 'On {p} own' : v)}</button>`; }).join('')}</div>`;
  const input = (k, label, c, type = 'text') => `<label class="cc-field"><span>${F(label)}</span><input type="${type}" value="${esc3(c[k])}" oninput="ccText('${k}', this.value)" autocomplete="off"></label>`;
  // What the caregiver sees, in plain sentences.
  function cardLines(c) {
    const P = babyPronouns(), L = [];
    const feed = [c.milk, c.often && c.often.toLowerCase(), c.oz && (c.milk !== 'Breast milk' || c.oz) && `about ${c.oz} a bottle`].filter(Boolean).join(', ');
    if (feed) L.push(['Feeding', feed + (c.solids && c.solids !== 'Not yet' ? `. Solids: ${c.solids.toLowerCase()}` : '')]);
    const sleep = [c.naps && `${c.naps} nap${c.naps === '1' ? '' : 's'} a day`, (c.asleep || []).length && `falls asleep with ${(c.asleep || []).map(x => x === 'On their own' ? `nothing, on ${P.p} own` : x.toLowerCase()).join(', ')}`].filter(Boolean).join(', ');
    if (sleep) L.push(['Sleep', sleep.charAt(0).toUpperCase() + sleep.slice(1)]);
    const times = (c.napTimes || []).slice(0, c.naps === '4 or more' ? 4 : Number(c.naps) || 0).filter(Boolean).map(clock);
    if (times.length) L.push(['Nap times', times.join(', ')]);
    if (c.bedtime) L.push(['Bedtime', clock(c.bedtime)]);
    if ((c.calm || []).length) L.push(['What helps', c.calm.map((x, i) => i ? x.toLowerCase() : x).join(', ')]);
    if (c.allergy) L.push(['Allergies and medicines', c.allergy === 'Yes' ? (c.allergyText || 'Yes, ask us') : 'None known']);
    if (c.docName || c.docPhone) L.push(['Pediatrician', [c.docName, c.docPhone].filter(Boolean).join(' · ')]);
    [[c.c1Name, c.c1Phone], [c.c2Name, c.c2Phone]].filter(([n, p]) => n || p).forEach(([n, p], i) => L.push([i ? 'Or' : 'Call us', [n, p].filter(Boolean).join(' · ')]));
    if (c.other) L.push(['Also', c.other]);
    return L;
  }
  const ALWAYS = () => `${name()} sleeps on ${babyPronouns().p} back, in a crib with nothing else in it, even for naps.`;
  function cardPage() {
    const h = H(), c = card(), nm = name(), bottles = c.milk && c.milk !== 'Breast milk';
    if (c.saved) {
      const L = cardLines(c);
      return h.detail(CAT, 'Before the first day', `${nm}’s care card`, '',
        `<section class="hub-card cc-view"><p class="cc-view-name">${esc3(nm)}</p>${L.map(([l, v]) => `<div class="cc-view-row"><b>${F(l)}</b><span>${esc3(v)}</span></div>`).join('')}<div class="cc-view-row is-always"><b>${F('Always')}</b><span>${F(ALWAYS())}</span></div></section>`
        + `<div class="cc-actions"><button class="hub-button" onclick="ccShare()">${F('Share the card')}</button><button class="hub-button is-secondary" onclick="ccCardMode('edit')">${F('Edit')}</button></div><p class="cc-done" id="ccDone" hidden></p>`
        + h.note('Sends a link that opens as a card on their phone. Only people you send it to can see it.'), 'notepad');
    }
    const sec = (title, inner) => `<section class="hub-card cc-sec"><b class="cc-sec-title">${F(title)}</b>${inner}</section>`;
    return h.detail(CAT, 'Before the first day', `${nm}’s care card`, 'Tap what fits. It takes about a minute, and you can share it with any caregiver.',
      sec('Feeding', chips('milk', false, c) + `<p class="cc-q-label">${F('How often')}</p>` + chips('often', false, c) + (bottles ? `<p class="cc-q-label">${F('Per bottle')}</p>` + chips('oz', false, c) : '') + (typeof actualMonth === 'function' && actualMonth() >= 5 ? `<p class="cc-q-label">${F('Solids')}</p>` + chips('solids', false, c) : ''))
      + sec('Sleep', `<p class="cc-q-label">${F('Naps a day')}</p>` + chips('naps', false, c)
        + (c.naps ? `<p class="cc-q-label">${F('Usual nap times')}</p><div class="cc-times">${Array.from({ length: c.naps === '4 or more' ? 4 : Number(c.naps) }, (_, i) => `<label><span>${F(['First', 'Second', 'Third', 'Fourth'][i])}</span><input type="time" value="${esc3((c.napTimes || [])[i])}" onchange="ccNapTime(${i}, this.value)"></label>`).join('')}</div>` : '')
        + `<div class="cc-times"><label><span>${F('Bedtime')}</span><input type="time" value="${esc3(c.bedtime)}" onchange="ccText('bedtime', this.value)"></label></div>`
        + `<p class="cc-q-label">${F('Falls asleep with')}</p>` + chips('asleep', true, c))
      + sec('What helps when {s’s} upset', chips('calm', true, c))
      + sec('Allergies or medicines', chips('allergy', false, c) + (c.allergy === 'Yes' ? input('allergyText', 'Which ones', c) : ''))
      + sec('Who to call', input('c1Name', 'Name', c) + input('c1Phone', 'Phone', c, 'tel') + input('c2Name', 'Second person (optional)', c) + input('c2Phone', 'Phone', c, 'tel') + input('docName', 'Pediatrician', c) + input('docPhone', 'Pediatrician’s phone', c, 'tel'))
      + sec('Anything else (optional)', `<input class="cc-other" value="${esc3(c.other)}" oninput="ccText('other', this.value)" placeholder="${esc3('For example, likes the blue blanket in the stroller')}" autocomplete="off">`)
      + `<p class="cc-always"><b>${F('Always included')}</b>${F(ALWAYS())}</p>`
      + `<div class="cc-actions"><button class="hub-button" onclick="ccCardMode('view')">${F('Save the card')}</button></div>`, 'notepad');
  }
  // Sharing sends a link that unfurls into a preview card in Messages, WhatsApp or email, like sharing a song.
  // The card's details ride in the link after the #, so they open on the caregiver's phone and never reach a server.
  const CARD_URL = 'https://yardenwalla.github.io/ahead-prototype/card.html';
  window.ccCardLink = function () {
    const c = card(), P = babyPronouns(), n = c.naps === '4 or more' ? 4 : Number(c.naps) || 0;
    const low = (a, own) => (a || []).map((x, i) => x === 'On their own' ? own : i ? x.toLowerCase() : x);
    const data = { n: name(), s: P.s, o: P.o, p: P.p, d: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      milk: c.milk, often: c.often, oz: c.milk && c.milk !== 'Breast milk' ? c.oz : null, solids: c.solids, naps: c.naps,
      times: (c.napTimes || []).slice(0, n).filter(Boolean).map(clock), bed: clock(c.bedtime), asleep: low(c.asleep, `On ${P.p} own`), calm: low(c.calm),
      allergy: c.allergy ? (c.allergy === 'Yes' ? (c.allergyText || 'Yes, please ask us') : 'None known') : null, other: c.other,
      c: [[c.c1Name, c.c1Phone], [c.c2Name, c.c2Phone]], doc: [c.docName, c.docPhone], a: ALWAYS() };
    Object.keys(data).forEach(k => { if (data[k] == null || data[k] === '' || (Array.isArray(data[k]) && !data[k].length)) delete data[k]; });
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(data)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${CARD_URL}#${b64}`;
  };
  window.ccShare = async function () {
    const url = ccCardLink(), done = document.getElementById('ccDone');
    const say = m => { if (done) { done.textContent = m; done.hidden = false; } };
    try { if (navigator.share) { await navigator.share({ title: `${name()}’s care card`, text: `Here’s ${name()}’s care card`, url }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(url); say('Link copied. Paste it into a text or email.'); } catch (e) { say('Couldn’t share from here. Try again on your phone.'); }
  };

  /* ---------- routes ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a] = p.split(':');
    if (cat === CAT && screen === 's') return childcare();
    if (cat === CAT && screen === 'd') {
      if (a === 'card') return cardPage();
      if (TYPES[a]) return typePage(a);
      const m = /^cand-(\w+)-(\w+)$/.exec(a || ''); if (m && TYPES[m[1]]) return candidatePage(m[1], m[2]);
    }
    return baseRoute(p);
  };
})();
