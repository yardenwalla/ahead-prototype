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
  // Each question comes with what a good answer sounds like, because that's the part parents don't know.
  const SLEEP = ['Where and how do babies sleep?', 'Always on their back, in a crib with nothing else in it.'];
  const CPR = ['Is everyone trained in infant CPR and first aid?', 'Yes, and they keep it current.'];
  const TYPES = {
    center: { icon: 'blocks', name: 'Daycare center', short: 'Small groups by age', who: 'place',
      lead: 'A licensed center with trained teachers, where babies are cared for in a room with others their age.',
      good: 'You want set hours, backup staff when someone’s out, and other babies around.', mind: 'Babies catch more colds the first year. Centers close on holidays and have set pickup times.',
      when: ['Start looking early', 'Infant rooms often have waitlists of several months, so many families start during pregnancy.'],
      ask: [SLEEP, ['How many babies does each teacher look after?', 'No more than 3, in a room of 6 babies or fewer.'], CPR,
        ['How long have the baby-room teachers been here?', 'The same faces for a year or more. Babies do best with familiar caregivers.'],
        ['How do you comfort a crying baby?', 'They pick babies up, and feed on cue rather than by the clock.'],
        ['Are you licensed? Can I see your latest inspection?', 'Yes, gladly. You can also look it up on your state’s licensing site.'],
        ['When does a sick child stay home?', 'A clear written policy, and they’ll call you quickly.'],
        ['Can I visit any time?', 'Yes, without calling ahead.']] },
    home: { icon: 'home', name: 'Home daycare', short: 'A small group in a home', who: 'place',
      lead: 'A provider cares for a small group of children in their own home, often a mix of ages.',
      good: 'You’d like a smaller group and a homey feel, often with more flexible hours.', mind: 'With one provider, you’ll need backup care when they’re sick or away.',
      when: ['A few months ahead', 'Good spots fill up, so start about 3–6 months before you need care.'],
      ask: [SLEEP, ['How many children do you look after, and how many are babies?', 'No more than 2 babies per adult.'], CPR,
        ['Who else is in the home during the day?', 'Everyone over 18 has had a background check.'],
        ['Who covers when you’re sick or on vacation?', 'A backup plan they can tell you about now.'],
        ['Are you licensed? Can I see your latest inspection?', 'Yes, gladly. You can also look it up on your state’s licensing site.'],
        ['Can I visit any time?', 'Yes, without calling ahead.']] },
    nanny: { icon: 'hand', name: 'Nanny or nanny share', short: 'One caregiver at home', who: 'person',
      lead: 'A caregiver who looks after your baby at home. In a nanny share, two families split one nanny.',
      good: 'You want one-on-one care at home, on a schedule that fits yours.', mind: 'You become an employer, with payroll and taxes. Plan backup for when your nanny is sick.',
      when: ['About 2–3 months ahead', 'That leaves time for interviews, references and a paid trial day.'],
      ask: [['How long have you cared for babies under 1?', 'At least a year, with babies this young.'],
        ['How do you put a baby down to sleep?', 'On the back, in a crib with nothing else in it.'], ['Are you trained in infant CPR?', 'Yes, or happy to take a class before starting.'],
        ['What would you do if Maya wouldn’t stop crying?', 'Calm, practical steps, and a call to you if worried. Never shaking.'],
        ['Can I call two families you’ve worked for?', 'Yes, gladly.'], ['Are you okay with a background check?', 'Yes.'],
        ['Would you do a paid trial day?', 'Yes.'], ['Will you follow our routine for feeding, naps and screens?', 'Yes, and no screens at this age.']] },
    family: { icon: 'heart', name: 'Family or friends', short: 'Someone you trust', who: 'person', talk: true,
      lead: 'A grandparent, relative or friend looks after your baby, at your home or theirs.',
      good: 'You’d like someone who already loves Maya, with flexible timing.', mind: 'Advice has changed since they had babies. Talk it through early, kindly and clearly.',
      when: ['A few weeks ahead', 'Enough time to talk through the routine and do a practice day together.'],
      ask: [['Back to sleep, in a bare crib, even for naps', 'No blankets, bumpers or tummy sleeping. This is the biggest change since they had babies.'],
        ['The car seat, every ride', 'Rear-facing and buckled snugly, even for short trips.'], ['Feeding: what, when and how much', 'And no honey, juice or new foods until you’ve tried them.'],
        ['No smoking or vaping around Maya', 'Including in the car and on clothes.'], ['If they feel frustrated', 'Put Maya down somewhere safe and step away for a minute. Never shake a baby.'],
        ['No screens at this age', 'Talking, songs and books instead.']] },
    sitter: { icon: 'moon', name: 'Babysitter', short: 'For a few hours', who: 'person',
      lead: 'Someone who watches your baby now and then, for a date night, an appointment or an afternoon.',
      good: 'You need a few hours of help, not regular care.', mind: 'Meet them with Maya first, and walk them through sleep and the car seat.',
      when: ['A week or two ahead', 'Try a short first visit while you’re at home, so everyone gets comfortable.'],
      ask: [['Have you looked after babies this young?', 'Yes, more than once.'], ['How do you put a baby down to sleep?', 'On the back, in a crib with nothing else in it.'],
        ['Are you trained in infant CPR?', 'Yes, ideally within the last 2 years.'], ['What would you do in an emergency?', 'Call 911 first, then you.'],
        ['Can I call a family you’ve sat for?', 'Yes, gladly.']] }
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

  /* ---------- one page per type, always in the same order ---------- */
  function typePage(k) {
    const t = TYPES[k], h = H(), mine = shortlist()[k] || [], noun = t.who === 'place' ? 'place' : 'person';
    const qs = `<div class="cc-qs">${t.ask.map(([q, a]) => `<div class="cc-q"><b>${F(q)}</b><small>${F(t.talk ? a : 'Listen for: ' + a)}</small></div>`).join('')}</div>`;
    const shortRows = mine.map(c => h.row({ icon: t.icon, cat: CAT, title: esc3(c.name || 'Unnamed'), sub: `${(c.checks || []).length} of ${t.ask.length} ${t.talk ? 'talked through' : 'good answers'}${c.notes ? ' · has notes' : ''}`, onclick: `openPage('chg:${CAT}:d:cand-${k}-${c.id}')` }));
    return h.detail(CAT, 'Childcare', t.name, t.lead,
      `<section class="hub-card cc-fit"><div><b>${F('A good fit if')}</b><p>${F(t.good)}</p></div><div><b>${F('Keep in mind')}</b><p>${F(t.mind)}</p></div></section>`
      + h.tip(t.when[0], t.when[1])
      + `<h2 class="hub-h2">${F(t.talk ? 'Things to talk through' : 'Questions to ask')}</h2>` + qs
      + `<h2 class="hub-h2">${F('Your shortlist')}</h2>`
      + (mine.length ? h.list('', shortRows) : `<p class="cc-lead">${F(t.talk ? `Add each person who’ll help, and tick off what you’ve talked through.` : `Add each ${noun} you’re considering. The questions become a checklist for each one, with space for notes.`)}</p>`)
      + `<button class="hub-button is-secondary cc-add" onclick="openPage('chg:${CAT}:d:cand-${k}-new')">＋ ${F(`Add a ${noun}`)}</button>`, t.icon);
  }

  /* ---------- one place or person: tick the good answers, add notes, Save ---------- */
  function candidatePage(k, id) {
    const t = TYPES[k], h = H(), list = shortlist(), mine = list[k] || [], c = mine.find(x => x.id === id) || { id: 'new', name: '', contact: '', checks: [], notes: '' };
    const noun = t.who === 'place' ? 'place' : 'person', isNew = c.id === 'new';
    const checks = t.ask.map(([q, a], i) => `<label class="cc-check"><input type="checkbox" data-i="${i}" ${(c.checks || []).includes(i) ? 'checked' : ''}><span><b>${F(q)}</b><small>${F(t.talk ? a : 'Listen for: ' + a)}</small></span></label>`).join('');
    return h.detail(CAT, t.name, isNew ? `Add a ${noun}` : esc3(c.name), isNew ? '' : '',
      `<section class="hub-card cc-form"><label class="cc-field"><span>${F(t.who === 'place' ? 'Name of the place' : 'Their name')}</span><input id="ccName" value="${esc3(c.name)}" placeholder="${esc3(t.who === 'place' ? 'For example, Little Oaks' : 'For example, Sam')}" autocomplete="off"></label>
        <label class="cc-field"><span>${F('Phone or email (optional)')}</span><input id="ccContact" value="${esc3(c.contact)}" autocomplete="off"></label></section>`
      + `<h2 class="hub-h2">${F(t.talk ? 'What you’ve talked through' : 'Good answers')}</h2><p class="cc-lead">${F(t.talk ? 'Tick each one once you’ve talked it over.' : 'Tick each question where you liked the answer.')}</p><section class="hub-card cc-checks">${checks}</section>`
      + `<h2 class="hub-h2">${F('Notes')}</h2><textarea id="ccNotes" class="cc-notes" rows="4" placeholder="${esc3('What stood out, how it felt, anything to follow up…')}">${esc3(c.notes)}</textarea>`
      + `<div class="cc-actions"><button class="hub-button" onclick="ccSaveCand('${k}','${c.id}')">${F('Save')}</button>${isNew ? '' : `<button class="cc-remove" onclick="ccRemoveCand('${k}','${c.id}')">${F('Remove from shortlist')}</button>`}</div>`, t.icon);
  }
  window.ccSaveCand = function (k, id) {
    const list = shortlist(), mine = list[k] = list[k] || [];
    const v = s => (document.getElementById(s) || {}).value || '';
    const checks = [...document.querySelectorAll('.cc-checks input:checked')].map(x => Number(x.dataset.i));
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
    if ((c.calm || []).length) L.push(['What helps', c.calm.join(', ')]);
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
        + h.note('Saved on this device. Nothing is shared until you tap Share.'), 'notepad');
    }
    const sec = (title, inner) => `<section class="hub-card cc-sec"><b class="cc-sec-title">${F(title)}</b>${inner}</section>`;
    return h.detail(CAT, 'Before the first day', `${nm}’s care card`, 'Tap what fits. It takes about a minute, and you can share it with any caregiver.',
      sec('Feeding', chips('milk', false, c) + `<p class="cc-q-label">${F('How often')}</p>` + chips('often', false, c) + (bottles ? `<p class="cc-q-label">${F('Per bottle')}</p>` + chips('oz', false, c) : '') + (typeof actualMonth === 'function' && actualMonth() >= 5 ? `<p class="cc-q-label">${F('Solids')}</p>` + chips('solids', false, c) : ''))
      + sec('Sleep', `<p class="cc-q-label">${F('Naps a day')}</p>` + chips('naps', false, c) + `<p class="cc-q-label">${F('Falls asleep with')}</p>` + chips('asleep', true, c))
      + sec('What helps when {s’s} upset', chips('calm', true, c))
      + sec('Allergies or medicines', chips('allergy', false, c) + (c.allergy === 'Yes' ? input('allergyText', 'Which ones', c) : ''))
      + sec('Who to call', input('c1Name', 'Name', c) + input('c1Phone', 'Phone', c, 'tel') + input('c2Name', 'Second person (optional)', c) + input('c2Phone', 'Phone', c, 'tel') + input('docName', 'Pediatrician', c) + input('docPhone', 'Pediatrician’s phone', c, 'tel'))
      + sec('Anything else (optional)', `<input class="cc-other" value="${esc3(c.other)}" oninput="ccText('other', this.value)" placeholder="${esc3('For example, likes the blue blanket in the stroller')}" autocomplete="off">`)
      + `<p class="cc-always"><b>${F('Always included')}</b>${F(ALWAYS())}</p>`
      + `<div class="cc-actions"><button class="hub-button" onclick="ccCardMode('view')">${F('Save the card')}</button></div>`, 'notepad');
  }
  window.ccShare = async function () {
    const c = card(), text = `${name()}’s care card\n\n${cardLines(c).map(([l, v]) => `${l}: ${v}`).join('\n')}\n\nAlways: ${ALWAYS()}`, done = document.getElementById('ccDone');
    const say = m => { if (done) { done.textContent = m; done.hidden = false; } };
    try { if (navigator.share) { await navigator.share({ title: `${name()}’s care card`, text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text); say('Copied. Paste it into a text or email.'); } catch (e) { say('Couldn’t copy here. Select the card above and copy it.'); }
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
