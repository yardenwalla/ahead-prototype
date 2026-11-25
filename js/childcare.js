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

  /* ---------- colors and small flat pictures, in the same style as Outings and Development ---------- */
  // Each page takes the color of the tile or row the parent tapped: [background, ink, shape, second shape].
  const PAL = {
    center: ['#e7effc', '#46638c', '#9fb8df', '#f8e3a0'],
    home: ['#e6f5ec', '#356651', '#bfe3cf', '#f8e3a0'],
    nanny: ['#fdeef2', '#a24d6a', '#f2b8c6', '#fbe6bd'],
    family: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#f8e3a0'],
    sitter: ['#ece8f8', '#5b4f8a', '#c3b8ea', '#f8e3a0'],
    plan: ['#fcf3cf', '#6b5a0e', '#f0d872', '#e7effc'],
    pay: ['#e2f3f1', '#2f6661', '#a9dbd4', '#fbe6bd'],
    ready: ['#fff3dc', '#8a6a2a', '#f3d58a', '#fdeef2'],
    card: ['#fcf3cf', '#6b5a0e', '#f0d872', '#e6f5ec'],
    backup: ['#f6e8f3', '#7a4f74', '#e3b8cf', '#fbe6bd'],
    help: ['#fdeef2', '#a24d6a', '#f2b8c6', '#e6f5ec'],
    fit: ['#e7effc', '#46638c', '#9fb8df', '#f8e3a0'],
    start: ['#e6f5ec', '#356651', '#bfe3cf', '#f8e3a0']
  };
  const SHAPE = {
    // Three blocks: a room of babies.
    center: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="16" width="20" height="20" rx="5" fill="${c[2]}"/><rect x="28" y="16" width="20" height="20" rx="5" fill="${c[2]}"/><rect x="16" y="0" width="20" height="16" rx="5" fill="${c[3]}"/></svg>`,
    // A house, and a small circle beside it.
    home: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 18 22 4l18 14v18H4Z" fill="${c[2]}"/><circle cx="54" cy="28" r="8" fill="${c[3]}"/></svg>`,
    // A big circle and a small one: a grown-up and a baby.
    nanny: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="18" cy="20" r="16" fill="${c[2]}"/><circle cx="44" cy="28" r="8" fill="${c[3]}"/></svg>`,
    // Two overlapping circles, close together.
    family: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="16" cy="20" r="14" fill="${c[2]}"/><circle cx="36" cy="20" r="14" fill="${c[3]}" opacity=".9"/></svg>`,
    // A crescent moon and a star: evenings out.
    sitter: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M30 6a16 16 0 1 0 8 28A13 13 0 0 1 30 6Z" fill="${c[2]}"/><circle cx="52" cy="12" r="5" fill="${c[3]}"/></svg>`,
    // A path of dots to a stop: a plan.
    plan: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M6 30h50" stroke="${c[2]}" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 11"/><circle cx="70" cy="22" r="10" fill="${c[3]}"/></svg>`,
    // Two coins.
    pay: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="18" cy="22" r="14" fill="${c[2]}"/><circle cx="42" cy="14" r="10" fill="${c[3]}"/></svg>`,
    // A bag shape.
    ready: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="12" width="34" height="24" rx="8" fill="${c[2]}"/><path d="M14 12a7 7 0 0 1 14 0" stroke="${c[2]}" stroke-width="4" fill="none"/><circle cx="54" cy="28" r="7" fill="${c[3]}"/></svg>`,
    // A card.
    card: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="6" width="40" height="30" rx="7" fill="${c[2]}"/><rect x="11" y="14" width="18" height="4" rx="2" fill="#fff"/><rect x="11" y="22" width="24" height="4" rx="2" fill="#fff"/><circle cx="58" cy="28" r="7" fill="${c[3]}"/></svg>`,
    // A sturdy half-circle, and a second circle in reserve.
    backup: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 36a18 18 0 0 1 36 0Z" fill="${c[2]}"/><circle cx="52" cy="14" r="8" fill="${c[3]}"/></svg>`,
    // Three dots, one picked out: choosing.
    fit: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="12" cy="22" r="8" fill="${c[2]}"/><circle cx="34" cy="22" r="12" fill="${c[3]}"/><circle cx="56" cy="22" r="8" fill="${c[2]}"/></svg>`,
    // A sprout: care that's growing.
    start: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M22 38V20" stroke="${c[2]}" stroke-width="5" stroke-linecap="round"/><path d="M22 22c0-10 8-16 18-16 0 10-8 16-18 16Z" fill="${c[2]}"/><path d="M22 26c0-8-6-12-14-12 0 8 6 12 14 12Z" fill="${c[3]}"/></svg>`,
    // A heart.
    help: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M22 36 6 20a9 9 0 0 1 16-10 9 9 0 0 1 16 10Z" fill="${c[2]}"/><circle cx="52" cy="28" r="7" fill="${c[3]}"/></svg>`
  };
  // A subpage: the colored header the newer tabs use, in the color of the tile or row that opened it.
  // Nov 19: every page and row in Childcare's own yellow (no rainbow), with the outline icon the page passes in.
  const CC = ['#fcf7dd', '#6b5a0e', '#f0d872', '#f8e3a0'];
  const ICON_OF = { center: 'blocks', home: 'home', nanny: 'smile', family: 'heart', sitter: 'moon', plan: 'notepad', pay: 'coin', ready: 'bag', card: 'notepad', backup: 'shield', help: 'star', fit: 'eye', start: 'sun' };
  function sub(key, context, title, lead, inner, icon) {
    const c = CC;
    return `<div class="quiet-category hub-page hub-detail" data-overview="${CAT}" data-ss="1" data-cc-page="${key}" style="${yearTheme(CAT)};--ss-bg:${c[0]};--ss-ink:${c[1]};--year-bg:${c[0]};--year-pale:${c[0]};--year-ink:${c[1]}">${detailPageTop(CAT)}`
      + `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}"><span class="dev-area-head-art sf-head-art">${hubArt(icon || ICON_OF[key] || 'notepad', CAT)}</span><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`
      + inner + `</div>`;
  }
  // A row on the tab's home: a soft colored icon square, like Outings' gear rows.
  const homeRow = (key, icon, title, sub2, id) => { const c = CC; return `<button class="hub-row oa-row" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:${id}')"><span class="oa-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(sub2)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`; };

  /* ---------- storage on this device ---------- */
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const esc3 = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rerender = () => { const y = scrollY; render(); scrollTo(0, y); };
  window.ccRerender = rerender;   // Nov 23 audit: the backup people "Done" button called rerender(), which isn't global, so the tap threw and did nothing

  /* ---------- the five types of care ---------- */
  // Each item comes with what good looks like, because that's the part parents don't know. Sources: Child Care Aware of America checklists; HHS parent's guide; AAP.
  const TYPES = {
    center: { icon: 'blocks', name: 'Daycare center', short: 'Set hours, built-in backup', who: 'place',
      lead: 'A licensed center with trained teachers, where babies are cared for in a room with others their age.',
      good: 'You want set hours, backup staff when someone’s out, and other babies around.', mind: 'Babies tend to catch more colds in their first year of group care.',
      when: ['As early as you can', 'Infant rooms have the longest waitlists. Join a few now, even before you’re sure.'],
      // Steps, in the order a parent meets them: a quick call, the tour (look, then ask three), and before signing.
      steps: [['Before you visit', 'check', 'A quick call, or a look online', [['Do you have a spot for a baby, and when?', 'Ask about the waitlist, and how often it moves.'], ['What are your hours and cost?', 'Including closed days and any extra fees.'], ['Are you licensed?', 'A licensed center is inspected by your state.']]],
        ['On the tour: look for', 'look', 'You can see these for yourself', [['Babies sleeping on their backs, in bare cribs', 'No blankets, bumpers or toys.'], ['Enough grown-ups for the babies', 'Recommended: up to 3 babies per adult, 6 per room.'], ['Warm, unhurried caregivers', 'Talking to babies, and picking them up when they cry.'], ['A clean, calm room', 'A clean changing area, covered outlets and floor space to play.']]],
        ['On the tour: ask', 'ask', 'The three that tell you the most', [['How long have the baby-room teachers been here?', 'A year or more. Familiar faces matter most for babies.'], ['What happens if a baby isn’t tired at nap time, or wakes up early?', 'Never forced to sleep or left crying. Quiet play, then back down when sleepy.'], ['Walk me through a baby’s day.', 'Feeds and naps on each baby’s own schedule, floor time and outside every day, and no screens.']]],
        ['Before you sign', 'check', 'Easy to ask by email', [['Is everyone trained in infant CPR?', 'Yes, and it’s kept current.'], ['Has every staff member had a background check?', 'Yes, everyone.'], ['When does a sick child stay home?', 'A clear, written policy.'], ['How will I hear about my baby’s day?', 'A daily note on feeds, naps and diapers.'], ['Can I have it in writing?', 'Hours, fees, closed days, and how much notice either side gives.'], ['Are children and staff up to date on vaccines?', 'Yes, with a clear policy, and hand-washing before feeds and after changes.']]]] },
    home: { icon: 'home', name: 'Home daycare', short: 'A small group, often more flexible', who: 'place',
      lead: 'A provider cares for a small group of children in their own home, often a mix of ages.',
      good: 'You’d like a smaller group and a homey feel, often with more flexible hours.', mind: 'With one provider, you’ll need backup care when they’re sick or away.',
      when: ['At least 3 months ahead', 'Openings come up more often than at centers, but good spots fill by word of mouth.'],
      steps: [['Before you visit', 'check', 'A quick call, or a look online', [['Do you have a spot for a baby, and when?', 'Also ask how many babies they take.'], ['What are your hours and cost?', 'Including closed days and any extra fees.'], ['Are you licensed?', 'A licensed home daycare is inspected by your state.']]],
        ['On the tour: look for', 'look', 'You can see these for yourself', [['A safe place for babies to sleep', 'Their own crib, bare, away from older kids.'], ['Enough grown-ups for the babies', 'Recommended: no more than 2 babies per adult. Your state may allow more.'], ['A warm, unhurried caregiver', 'Talking to the children, and calm when one cries.'], ['A baby-safe home', 'Gates, covered outlets, and no smoke smell.']]],
        ['On the tour: ask', 'ask', 'The three that tell you the most', [['Who covers when you’re sick or on vacation?', 'A backup plan they can tell you about now.'], ['What happens if a baby isn’t tired at nap time, or wakes up early?', 'Never forced to sleep or left crying. Quiet play, then back down when sleepy.'], ['Walk me through a baby’s day.', 'Feeds and naps on the baby’s own schedule, floor time, outside, and no TV.']]],
        ['Before you sign', 'check', 'Easy to ask by email', [['Are you trained in infant CPR?', 'Yes, and it’s kept current.'], ['Has every adult in the home had a background check?', 'Yes, everyone over 18.'], ['Are there pets, a pool or guns in the home?', 'Pets kept apart, any pool fenced, any guns locked and unloaded.'], ['When does a sick child stay home?', 'A clear, written policy.'], ['Can I have it in writing?', 'Hours, fees, closed days, and how much notice either side gives.'], ['Are children and staff up to date on vaccines?', 'Yes, with a clear policy, and hand-washing before feeds and after changes.']]]] },
    nanny: { icon: 'smile', name: 'Nanny', short: 'One-on-one at home. Sharing costs less', who: 'person',
      lead: 'A caregiver who looks after your baby at home. In a nanny share, two families split one nanny.',
      good: 'You want one-on-one care at home, on a schedule that fits yours.', mind: 'Agree on paid time off up front, and plan backup for when they’re sick or away. ',
      when: ['About 3 months ahead', 'That leaves time for interviews, references and a paid trial day.'],
      steps: [['Before you meet', 'check', 'A short phone call. Listen for:', [['Which days and hours can you work?', 'A clear answer that matches what you need.'], ['What pay are you looking for?', 'So you both know it fits before you meet.'], ['How long have you cared for babies under 1?', 'Real experience with babies this young.']]],
        ['At the interview: watch for', 'look', 'Have Maya there if you can', [['How they are with Maya', 'They get down to {p} level, talk and smile.'], ['Phone away, full attention', 'On Maya, and on you.']]],
        ['At the interview: ask', 'ask', 'The three that tell you the most', [['What would a day with Maya look like?', 'Naps and feeds by {p} cues, time outside, books, and no screens.'], ['How do you put a baby down to sleep?', 'On the back, in a crib with nothing else in it.'], ['What would you do if Maya wouldn’t stop crying?', 'Calm, practical steps, and a call to you if worried. Never shaking.']]],
        ['Before you hire', 'check', 'Worth doing every time', [['Call two families they’ve worked for', 'Ask what they loved, and anything they’d change.'], ['A background check', 'Most nanny agencies and sites can run one.'], ['Infant CPR', 'Current, or a class before they start.'], ['A paid trial day', 'While you’re home, to see how it feels.'], ['A written agreement', 'Hours, pay, paid days off, sick days, and how much notice either of you gives.']]]] },
    family: { icon: 'heart', name: 'Family care', short: 'Flexible, and someone you trust', who: 'person', talk: true,
      lead: 'A grandparent, relative or friend looks after your baby, at your home or theirs.',
      good: 'You’d like someone who already loves Maya, with flexible timing.', mind: 'Some safety advice has changed since they had babies.',
      when: ['A few weeks ahead', 'Enough time to talk through the routine together.'],
      steps: [['Talk it through', 'talk', 'Kindly, before the first day', [['Back to sleep, in a bare crib', 'Even for naps. This advice has changed.'], ['How you’ll stay in touch', 'The hours week to week, and that either of you can say if it isn’t working.'], ['The car seat, every ride', 'Rear-facing, and buckled snugly.'], ['Naps, bedtime and feeds', 'Share {p} care card, so you match.'], ['Crying can wear anyone down', 'Put Maya down safely and take a minute. Never shake a baby.'], ['Infant CPR', 'A short class is worth it.']]]] },
    sitter: { icon: 'moon', name: 'Babysitter', short: 'For a few hours', who: 'person',
      lead: 'A few hours of care, so you can rest or go out.',
      good: 'You need a few hours of help, not regular care.', mind: 'Keep the first night short, and stay reachable.',
      when: ['A week or two ahead', 'Time for a short first visit while you’re at home, so everyone gets comfortable.'],
      steps: [['Before the sitter comes', 'check', 'Or a call. Listen for:', [['Have you looked after babies this young?', 'Yes, more than once.'], ['Are you trained in infant CPR?', 'Yes, ideally in the last 2 years.'], ['Can I call a family you’ve sat for?', 'Yes, gladly.']]],
        ['A first visit, while you’re home', 'look', 'An hour is enough', [['How they hold and talk to Maya', 'Calm, gentle and engaged.'], ['Show them sleep and the car seat', 'On the back in a bare crib, and buckled snugly.']]],
        ['On the visit: ask', 'ask', 'Before the sitter’s first time alone', [['What would you do in an emergency?', 'Call 911 first, then you.'], ['What would you do if Maya wouldn’t settle?', 'Hold, rock and soothe, and text you if it lasts.']]]] },
  };

  // Where to actually look, by type. Kinds of places only, never a named site or company.
  const WHERE = {
    center: [['book', 'Your state’s child care website', 'Licensed centers, with inspection reports'], ['chat', 'Your local child care referral agency', 'Free, and knows who has openings'], ['heart', 'Other parents nearby', 'Neighborhood groups and friends']],
    home: [['book', 'Your state’s child care website', 'Licensed home daycares, with inspection reports'], ['chat', 'Your local child care referral agency', 'Free, and knows who has openings'], ['heart', 'Other parents nearby', 'Ask who they used']],
    nanny: [['heart', 'Local parent groups', 'Often a good place to start'], ['notepad', 'A nanny agency', 'They screen candidates, for a fee'], ['eye', 'Caregiver websites', 'Lots of choice; you do the checking']],
    sitter: [['heart', 'Friends and other parents', 'Ask who they trust'], ['eye', 'Caregiver websites', 'Many list sitters near you'], ['blocks', 'Daycare teachers', 'Some babysit evenings. Check the center’s policy']]
  };

  /* ---------- the journey pages: the same layout as Outings ----------
     A plan in order ("Plan your …" timeline), what to send ("Pack for care"), "When things don't go to plan", "Good to know" (≤3). */
  const tl = (title, items) => line(title, items.filter(Boolean).map(([when, icon, text]) => [icon, when, text]));
  const packCard = (title, sub, items) => `<section class="oa-extra cc-extra"><b>${F(title)}</b><small>${F(sub)}</small><ul>${items.filter(Boolean).map(([icon, t, x]) => `<li><span class="oa-extra-art">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b>${x ? `<small>${F(x)}</small>` : ''}</span></li>`).join('')}</ul></section>`;
  // Steps that happen in order: numbered, top to bottom, joined by a line.
  const seq = (heading, items) => `<h2 class="hub-h2">${F(heading)}</h2><ol class="hub-card cc-seq">${items.map(([t, d], i) => `<li><i>${i + 1}</i><div><b>${F(t)}</b><small>${F(d)}</small></div></li>`).join('')}</ol>`;
  const picSteps = (heading, items, caption) => heading === 'When things don’t go to plan' ? rows(heading, items.filter(Boolean).map(([icon, t, s2]) => [icon, t, s2])) : `<h2 class="hub-h2">${F(heading)}</h2>` + hubIconSteps(items.filter(Boolean), CAT, F(caption), false);
  const rows = (heading, items) => H().list(heading, items.filter(Boolean).map(([icon, title, sub, go]) => H().row({ icon, cat: CAT, title, sub, onclick: go })));
  // Round 11 (Yarden's inspiration): calmer pages. A bold line per row, with the detail one tap away; a timeline with
  // icons; a one-line callout for the next step.
  // Must-know safety stays in view (content guide): those rows show their line without a tap.
  const MUST = /sleep|crib|car seat|crying|shake|cpr/i;
  const peekRow = (i, t, d, extra) => MUST.test(t) && d ? `<div class="cc-must"><span>${hubArt(i, CAT)}</span><div><b>${F(t)}</b><small>${F(d)}</small>${extra || ''}</div></div>`
    : `<details><summary><span>${hubArt(i, CAT)}</span><b>${F(t)}</b></summary><p>${F(d)}</p>${extra || ''}</details>`;
  const peek = (heading, items) => `${heading ? `<h2 class="hub-h2">${F(heading)}</h2>` : ''}<div class="hub-card cc-peek">${items.filter(Boolean).map(([i, t, d]) => peekRow(i, t, d)).join('')}</div>`;
  const line = (heading, items) => `<h2 class="hub-h2">${F(heading)}</h2><ol class="hub-card cc-line">${items.filter(Boolean).map(([i, t, d]) => `<li><span>${hubArt(i, CAT)}</span><div><b>${F(t)}</b><small>${F(d)}</small></div></li>`).join('')}</ol>`;
  const callout = (icon, html) => `<p class="cc-callout"><span>${hubArt(icon, CAT)}</span><span>${html}</span></p>`;
  // Advice for when things go wrong, folded behind one row (review feedback: keep the main actions in front).
  const fold = (title, sub2, items) => `<details class="hub-card cc-more"><summary><span>${hubArt('chat', CAT)}</span><div><b>${F(title)}</b><small>${F(sub2)}</small></div></summary><ul>${items.filter(Boolean).map(([, t, d]) => `<li><b>${F(t)}</b><small>${F(d)}</small></li>`).join('')}</ul></details>`;
  // Good to know: a bold line each, detail one tap away; a row that opens a page keeps its normal look.
  const good = items => { const it = items.filter(Boolean).slice(0, 3); return it.some(x => x[3]) ? rows('Good to know', it) : peek('Good to know', it); };
  const go = id => `openPage('chg:${CAT}:d:${id}')`;
  const feedNow = () => (typeof profile !== 'undefined' && profile.feed) || 'Breast milk';

  // Setting up a backup is a to-do list, so it's a checklist you can tick, kept on this phone.
  const BACKUP = [['Name two backup people', 'Family, friends or a sitter you could call at short notice.', 'heart'], ['Ask work about backup care', 'Some jobs offer backup care days.', 'notepad'], ['Save their numbers', 'In your phone, and on Maya’s care card under “Who to call”.', 'moon']];
  window.ccBackupTick = i => { const on = load('ahead-childcare-backup', []); save('ahead-childcare-backup', on.includes(i) ? on.filter(x => x !== i) : on.concat(i)); rerender(); };
  // Review feedback: name the backup people here, and they're saved straight to the care card.
  // Fresh eyes (Yarden): the page explains what backup is for first; naming people comes after, folded until you
  // choose to add them. Names go straight onto the care card.
  const backupPeople = () => { const c = load('ahead-carecard', {}), f = (k, label, type) => `<label class="cc-field"><span>${F(label)}</span><input ${type === 'tel' ? 'type="tel" inputmode="tel"' : ''} value="${esc3(c[k])}" oninput="ccText('${k}', this.value)" autocomplete="off"></label>`;
    const named = [[c.c1Name, c.c1Phone], [c.c2Name, c.c2Phone]].filter(([n]) => n), asked = load('ahead-childcare-backup', []).includes(1);
    return `<h2 class="hub-h2">${F('Set up your backup')}</h2>`
      + `<details class="hub-card cc-more cc-backup"${named.length ? '' : ''}><summary><span>${hubArt('heart', CAT)}</span><div><b>${F(named.length ? named.map(([n]) => n).join(' and ') : 'Name two backup people')}</b><small>${F(named.length ? 'Your backup people. Tap to change' : 'Family, friends or a sitter you could call at short notice')}</small></div></summary>`
      + `<div class="cc-backup-f"><p class="cc-h2sub">${F('They’re added to {p} care card, so your caregiver has them too.')}</p><div class="cc-two-f">${f('c1Name', 'First person')}${f('c1Phone', 'Phone', 'tel')}</div><div class="cc-two-f">${f('c2Name', 'Second person')}${f('c2Phone', 'Phone', 'tel')}</div><button class="hub-button cc-next2" onclick="ccRerender()">${F('Done')}</button></div></details>`
      + H().ticks([BACKUP[1]], () => asked, () => 'ccBackupTick(1)', CAT)
      + (named.length && asked ? H().note('Your backup plan is set. Check it again whenever your care changes.') : ''); };
  const backupList = () => { const on = load('ahead-childcare-backup', []); return `<h2 class="hub-h2">${F('Set up your backup')}</h2>` + H().ticks(BACKUP, i => on.includes(i), i => `ccBackupTick(${i})`, CAT) + (BACKUP.every((_, i) => on.includes(i)) ? H().note('Your backup plan is set. Check it again whenever your care changes.') : ''); };

  function journey(id) {
    const h = H(), m = typeof actualMonth === 'function' ? actualMonth() : 0, fd = feedNow(), bm = fd !== 'Formula', fm = fd !== 'Breast milk';
    // Round 9 (Yarden's inspiration): two things to settle, a numbered path with the first step highlighted, the rest
    // tucked away, one tip, and one button on to the options.
    if (id === 'plan') return sub('plan', 'Before you choose', 'Start about 3 months ahead', 'Infant spots fill first, so join waitlists now.',
      `<section class="cc-two"><h2>${F('Start with two things')}</h2><p>${F('They narrow every choice that follows.')}</p><div>${[['clock', 'Your schedule', 'Days and hours you need'], ['coin', 'Your budget', 'What works each month']].map(([i, t, d]) => `<div><span>${hubArt(i, CAT)}</span><b>${F(t)}</b><small>${F(d)}</small></div>`).join('')}</div></section>`
      + `<h2 class="hub-h2">${F('Your path to care')}</h2><p class="cc-h2sub">${F('Suggested timing. It varies by kind of care and where you live.')}</p>`
      + `<ol class="cc-route">${[['Now', 'Join a few daycare waitlists.'], ['About 3 months before care starts', 'Tour daycares, or meet nannies.'], ['6–8 weeks before', 'Check references, and choose.'], ['2 weeks before', 'Get ready for day one.']].map(([t, d, x], i) => `<li class="${i ? '' : 'is-first'}"><i>${i + 1}</i><div><b>${F(t)}</b><span>${F(d)}</span>${x ? `<small>${F(x)}</small>` : ''}</div></li>`).join('')}</ol>`
      + `<details class="hub-card cc-more"><summary><span>${hubArt('chat', CAT)}</span><div><b>${F('If plans change')}</b><small>${F('Short on time, odd hours, or nothing fits yet')}</small></div></summary>`
      + `<ul>${[['Short on time?', 'Your local child care referral agency is free and knows who has openings.'], ['Hours outside 9 to 5', 'Home daycares and nannies often stretch further than centers.'], ['Nothing feels right', 'Keep looking. Family or a sitter can fill the gap, and a mix is common.']].map(([t, d]) => `<li><b>${F(t)}</b><small>${F(d)}</small></li>`).join('')}</ul></details>`
      + (typeof profile !== 'undefined' && profile.early ? h.tip('Born early?', 'Ask your pediatrician when, and what kind of care, makes sense for {o}.') : '')
      + `<p class="cc-worth-tip">${hubArt('idea', CAT)}<span><b>${F('Worth knowing:')}</b> ${F('Waitlists move, so check in every month.')}</span></p>`
      + `<button class="hub-button cc-next2" onclick="openPage('chg:${CAT}:d:compare')">${F('Compare your options')} →</button>`
      + `<button class="hub-link cc-quizlink" onclick="openPage('chg:${CAT}:d:fit')">${F('Not sure which kind fits? Take the quick quiz')}</button>`, 'notepad');

    // Review feedback: three clear groups: what it costs, help paying, and what to check with work or a tax adviser.
    if (id === 'pay') return sub('pay', 'Before you choose', 'Paying for care', 'Care costs a lot, and there’s more help than most parents know.',
      peek('What care really costs', [
        ['eye', 'Prices vary by city', 'Ask each place for the full cost, fees included. A nanny usually costs the most.'],
        ['lock', 'Deposits are common', 'Many daycares ask for one to hold a spot.'],
        ['coin', 'A nanny comes with taxes', 'You’re usually their employer. Pay $3,000 or more in 2026, and payroll taxes are due.']])
      + picSteps('Ways families save', [
        ['coin', 'Child care assistance', 'From your state, if you qualify.'],
        ['home', 'Early Head Start', 'Free, for babies in families who qualify.']],
        'Child care assistance from your state, and Early Head Start, for families who qualify.')
      + peek('Check at work or tax time', [
        ['notepad', 'A pre-tax care account', m < 1 ? 'Up to $7,500 a year per family (2026). A birth lets you sign up within about 30 days.' : 'Up to $7,500 a year per family (2026). Missed the window after the birth? Sign up at open enrollment.'],
        
        ['shield', 'A tax credit', '20–50% of up to $3,000 in care costs for one child (2026). You can use both, for different costs.']])
      + callout('idea', `<b>${F('Start here:')}</b> ${F('ask work about a pre-tax care account, and check if you qualify for state help.')}`), 'coin');

    if (id === 'ready') {
      // Personal to the care they chose: a place (daycare, home daycare), someone at your home (a nanny), or family.
      const ch = chosenNow(), kind = ch ? ch.k : '', who = ch ? esc3(ch.c.name) : '', place = kind === 'center' || kind === 'home', atHome = kind === 'nanny';
      const just = ch && load('ahead-childcare-justchose', '') === ch.c.id; if (just) save('ahead-childcare-justchose', '');
      const steps = place ? [
          ['3 weeks before', 'notepad', 'Send the enrollment forms and shot record.'],
          ['2 weeks before', 'heart', 'Fill in Maya’s care card, and name two backup people.'],
          ['The week before', 'clock', 'A short visit together, then a short day.'],
          ['The night before', 'bag', 'Pack and label everything.'],
          ['Day one', 'sun', 'A quick, warm goodbye.']]
        : atHome ? [
          ['3 weeks before', 'notepad', 'Agree on hours, pay and duties in writing.'],
          ['2 weeks before', 'heart', 'Fill in Maya’s care card, and name two backup people.'],
          ['The week before', 'clock', 'A paid trial day, with you at home.'],
          ['The night before', 'home', 'Leave the care card out, and stock bottles, diapers and clothes.'],
          ['Day one', 'sun', 'A quick, warm goodbye.']]
        : kind === 'family' ? [
          ['2 weeks before', 'chat', 'Talk through safe sleep, the car seat and the day’s rhythm.'],
          ['The week before', 'clock', 'A practice day together.'],
          ['The night before', 'bag', 'Pack and label everything, if it’s at their place.'],
          ['Day one', 'sun', 'A quick, warm goodbye.']]
        : [
          ['2 weeks before', 'heart', 'Fill in Maya’s care card, and name two backup people.'],
          ['The week before', 'clock', 'A short visit together, then a short day.'],
          ['The night before', 'bag', 'Pack and label everything.'],
          ['Day one', 'sun', 'A quick, warm goodbye.']];
      // Nov 14 (QA): a nursed baby practices a bottle first, and a baby starting at 7–12 months gets a word on goodbyes.
      const nurses0 = typeof profile !== 'undefined' && profile.feed !== 'Formula' && ['Nursing', 'Both'].includes(profile.feedHow || 'Nursing');
      if (nurses0 && kind !== 'family') steps.unshift(['4 weeks before', 'bottle', 'Have someone else offer a bottle a few times a week, so Maya gets used to it.']);
      const am1 = typeof actualMonth === 'function' ? actualMonth() : 0;
      const goodbyeTip = am1 >= 7 && am1 <= 12 ? H().tip('Starting around now?', 'From about 8 months, many babies cry harder at goodbyes. It means {s} {know|knows} who {s’s} close to. A short, same goodbye each time helps.') : '';
      const lead = atHome ? 'A paid trial day, with you at home, makes the real start easier for you all.' : kind === 'family' ? 'A practice day together makes the real start easier for everyone.' : 'A visit and a short practice day make the start easier.';
      return sub('ready', 'Care chosen', who ? `Get ready for ${who}` : 'Get ready for day one', lead,
      (just ? `<div class="hub-card cc-chosen-note"><b>${F(`You chose ${who}.`)}</b><span>${F('Here’s how to get ready for day one.')}</span></div>` : '')
      + tl('Your countdown to day one', steps,
        steps.map(x => `${x[0]}: ${x[2]}`).join(' '))
      + `<h2 class="hub-h2">${F('Before day one')}</h2>`      + careCardButton(load('ahead-carecard', {}))
      + packCard(atHome ? 'Set up at home' : 'Pack for care', atHome ? 'So the day runs without you' : 'Label everything with {p} name', [
        ['bottle', bm && fm ? 'Milk or formula, plus one extra' : bm ? 'Pumped milk, plus one extra' : 'Formula, plus one extra', bm ? 'Labeled with the date, in a cooler bag' : 'And clean bottles, labeled with the date'],
        ['shirt', 'A spare outfit or two', 'For spills and blowouts'],
        ['diaper', 'Diapers and wipes', atHome ? 'Where your nanny can find them' : 'If asked'],
        m >= 6 ? ['bowl', 'Food, if the caregiver doesn’t provide it'] : null])
      + fold('If things don’t go to plan', 'Bottles, tears at drop-off, and more', [
        m < 9 ? ['cup', 'Won’t take a bottle', 'Let the caregiver try, with you out of the room.'] : null,
        ['smile', 'Tears at drop-off', 'Keep goodbyes short. Ask for a text once {s’s} settled.'],
        ['eye', 'Running low', 'Ask for a text when ' + (bm && fm ? 'milk, formula or diapers' : bm ? 'milk or diapers' : 'formula or diapers') + ' run low.'],
        ['chat', 'Something feels off', 'Talk early. It’s OK to change care.'],
        ['drop', 'Ask about feeds', 'How many feeds to expect, and how the caregiver warms bottles.']])
      + H().next('Next · once care starts', 'Settle in', 'ccStarted()', '', 'How care is going, and sick days.'), 'bag');
    }

    if (id === 'backup') return sub('backup', 'Backup care', 'When care falls\u00a0through', 'Every family has days without care. A plan now makes them easier.',
      picSteps('Days you’ll need it', [
        ['thermo', '{S’s} sick', 'Keep {o} home, with you or a backup person.'],
        ['home', 'The caregiver is sick', 'Call your backup, or a sitter you know.'],
        ['hand', 'Your caregiver leaves', 'Family or a sitter for now, while you find new care.'],
        ['sun', 'Closed days', 'Plan holidays early: family, a sitter or time off.']],
        'When the baby is sick, take turns or call your backup. When the caregiver is sick, call a sitter. If your caregiver leaves, cover with family or a sitter while you find new care. Plan daycare holidays early.')
      + backupPeople()
      + good([['blocks', 'Overlap old and new care', 'A few days of both, if you can, when you change care.']]), 'shield');

    if (id === 'share') return sub('nanny', 'Nanny share', 'Set up a nanny share', 'Two families split one nanny, for close to one-on-one care.',
      seq('How to set it up', [
        ['Find a family', 'Ask in local parent groups. A baby close in age is easiest.'],
        ['Agree on the basics', 'Whose home, the hours, and how you split the pay.'],
        ['Hire the nanny together', 'Meet them as a group, then put it all in writing.']])
      + peek('When things don’t go to plan', [
        ['thermo', 'One child is sick', 'Agree up front whether the share goes ahead, and at whose home.'],
        ['hand', 'A family leaves', 'Agree how much notice each family gives, so the nanny isn’t left short.']])
      + good([['coin', 'Both families are employers', 'Each pays its share, and its own taxes.'], ['clock', 'Check in as schedules change', 'Check in every few months as naps and needs shift.']])
      + `<div class="hub-list cc-plan-row">` + homeRow('plan', 'notepad', 'Next: Hire a nanny', 'Call, meet and check, together', 'hire-nanny') + `</div>`, 'hand');

    if (id === 'compare') return comparePage();
    if (id === 'fit') {
      const f = load('ahead-childcare-fit', {}), done = FIT_Q.every(([q]) => f[q]), top = done ? fitResults(f) : [];
      const qs = FIT_Q.map(([q, label, opts]) => `<section class="hub-card cc-sec"><b class="cc-sec-title">${F(label)}</b><div class="cc-chips">${opts.map(o => `<button class="cc-chip${f[q] === o ? ' is-on' : ''}" aria-pressed="${f[q] === o}" onclick="ccFit('${q}','${o.replace(/'/g, '\\\'')}')">${F(o)}</button>`).join('')}</div></section>`).join('');
      const res = done ? `<h2 class="hub-h2">${F('Worth looking at first')}</h2><div class="oa-places">${top.map(k => { const c = PAL[k === 'share' ? 'nanny' : k], nm = k === 'share' ? 'Nanny share' : CMP_NAME[k]; return `<button class="oa-place" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:${k}')"><span class="oa-place-art">${SHAPE[k === 'share' ? 'nanny' : k](c)}</span><b>${F(nm)}</b><small>${F(WHY[k])}</small></button>`; }).join('')}</div>`
        // A next step: the top match, step by step, and a way back to the plan.
        + (() => { const k = top[0], tk = k === 'share' ? 'share' : PLAN_T[k] ? 'hire-' + k : k, nm = k === 'share' ? 'Set up a nanny share' : PLAN_T[k] || CMP_NAME[k]; return `<button class="hub-button cc-quiz-next" onclick="openPage('chg:${CAT}:d:${tk}')">${F(`Next: ${nm}, step by step`)} ›</button><button class="hub-link cc-back-plan" onclick="openPage('chg:${CAT}:d:plan')">${F('Back to your plan')} ›</button>`; })() : '';
      return sub('fit', 'Before you choose', 'Which care fits us?', 'Four quick taps. Many families end up with a mix.',
        qs + (res || `<p class="cc-lead cc-fit-wait">${F(`${FIT_Q.filter(([q]) => f[q]).length} of 4 answered. Your matches show up here once you’ve answered all four.`)}</p>`));
    }

    if (id === 'start') return sub('start', 'Care started', 'The first months', 'Trust takes a few weeks to build, on both sides.',
      line('Check-ins', [
        ['sunrise', 'First week', 'Short days, and a quick chat at pickup.'],
        ['chat', 'After a month', 'A proper check-in about what’s working.'],
        ['notepad', 'Every few months', 'Update Maya’s care card.'],
        m >= 9 ? ['home', 'Around 12–18 months', 'Many centers move babies up a room. Ask for short visits first.'] : null])
      + H().versus('Sick day: home or care?', ['Fine to go', 'A runny nose, if {s} {are|is} eating and playing as usual.'],
        ['Keep home', 'A fever, vomiting or diarrhea. Each place has its own policy, so ask for it.'])
      + peek('If something doesn’t feel right', [
        ['smile', 'Bring up something small', 'A quick, kind word early goes a long way.'],
        ['heart', 'Harder drop-offs', 'Common from about 8 months. Keep goodbyes short and warm.'],
        ['shield', 'Speak up about a real worry', 'Keep {o} home and speak up. At licensed care, you can also report it to your state.']])
      // Nov 23 cohesion pass: the app's one When to call card, in place of a yellow callout and a separate 911 line.
      + H().TPLB.calls({ ped: m < 3 ? '' : m < 6 ? 'a fever of 101°F or higher, or one that lasts more than a day.' : 'a fever of 103°F or higher, or one that lasts more than a day.', right: m < 3 ? 'a rectal temperature of 100.4°F or higher' : '', nowLabel: 'Call 911', now: '{s} struggles to breathe, turns blue, won’t wake, or has a seizure.' }), 'sun');
    // Doulas and help with recovery belong to the first weeks. From 4 months, the same page is about care for the baby.
    if (id === 'help') { const early = m < 4; return sub('help', 'Help now and then', 'Extra help at home', early ? 'Help in the early months isn’t only for when you go back to work.' : 'Help at home isn’t only for when you go back to work.',
      picSteps('Kinds of help', early ? [
        ['heart', 'A postpartum doula', 'Feeding, rest and recovery.'],
        ['moon', 'A night nanny', 'Overnight, so you can sleep.'],
        ['home', 'Family and friends', 'Ask for one thing, like a meal or an hour.'],
        ['clock', 'A sitter for a break', 'A few hours to rest or get out.', go('sitter')]] : [
        ['heart', 'A helper at home', 'Plays with Maya while you work.'],
        ['moon', 'A night nanny', 'Overnight, so you can sleep.'],
        ['home', 'Family and friends', 'An hour or an afternoon with Maya.'],
        ['clock', 'A sitter', 'A few hours with Maya, now and then.', go('sitter')]],
        early ? 'A postpartum doula helps with feeding and recovery. A night nanny covers nights. Family and friends can help with specific tasks. A sitter gives you a break.' : 'A helper plays with Maya while you’re home. A night nanny covers nights. Family and friends can spend an hour or an afternoon with Maya. A sitter looks after Maya for a few hours.')
      + peek('Where to look', early ? [['smile', 'Other parents', 'Ask who helped them, and what it was like'], ['steth', 'Your hospital or pediatrician’s office', 'Many keep lists of local doulas and night nannies'], ['eye', 'Doula directories and agencies', 'Search for postpartum doulas near you']]
        : [['smile', 'Other parents', 'Ask who helped them, and what it was like'], ['steth', 'Your pediatrician’s office', 'Some keep lists of local nannies and sitters'], ['eye', 'Caregiver websites and agencies', 'Search for part-time or overnight help near you']])
      + good([early ? ['coin', 'Insurance may cover a doula', 'Some insurance and some state health plans cover doula care. Ask yours.'] : null, ['notepad', 'Book a few weeks ahead', early ? 'Doulas and night nannies often fill up, so ask a few weeks ahead.' : 'Night nannies often fill up, so ask a few weeks ahead.']]), 'star'); }
    return null;
  }

  // For the home screen (briefing.js): a nudge to update the care card when routines tend to change.
  window.ccUpdate = m => {
    const c = load('ahead-carecard', {}); if (!c.saved) return null;
    const U = { 4: ['Naps may be changing', 'Update Maya’s care card so the caregiver knows the new rhythm.', 'card', 'Update the card'],
      6: ['Starting solids?', 'Add them to Maya’s care card, so the caregiver knows what {s’s} tried.', 'card', 'Update the card'],
      8: ['Drop-offs may get harder for a while', 'It’s common from around 8 months. Here’s what helps.', 'start', 'See what helps'] }[m];
    return U ? { key: 'childcare:' + m, title: F(U[0]), body: F(U[1]), action: `openPage('chg:${CAT}:d:${U[2]}')`, label: U[3] } : null;
  };

  /* ---------- the summary screen: tiles for the types of care ---------- */
  function frame(body) {
    return `<div class="quiet-category hub-page" data-overview="${CAT}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${body}</div>`;
  }
  const shortlist = () => load('ahead-childcare-shortlist', {});
  // The care card gets its own button, like Sleep's "Rough night?": it's the one thing a parent sends to someone else,
  // so it stands apart from the reading rows. Saved, it goes straight to sharing.
  const STEPS = [['plan', 'Find care', 'Months before'], ['ready', 'Get ready', 'Weeks before'], ['start', 'Settle in', 'The first months']];
  function stepNow() {
    if (load('ahead-childcare-started', false)) return 'start';
    const list = shortlist(); if (Object.values(list).some(a => (a || []).some(c => c.chosen))) return 'ready';
    return 'plan';
  }
  const NOW_CARD = {
    plan: ['Start with what you need', 'Your days and hours, and a budget. Then look at the kinds of care that fit, and start early: spots for babies fill up.', 'See the plan'],
    ready: ['Getting ready for day one', 'A few short days first, the care card, and enough food packed. Here’s the week before, step by step.', 'Get ready'],
    start: ['The first months', 'Settling in takes a few weeks, for both of you. Here’s what going well looks like, and when to speak up.', 'See what to expect']
  };
  window.ccStarted = () => { save('ahead-childcare-started', true); save('ahead-childcare-stage', 2); openPage(`chg:${CAT}:d:start`); };
  // The journey as one path: four steps, the current one picked out, so the home never has to list everything.
  const journeyStrip = () => { const now = stepNow(); return `<nav class="cc-route" aria-label="Your childcare plan">${STEPS.map(([id, label, hint], i) => `<button class="cc-route-step${id === now ? ' is-now' : ''}" onclick="openPage('chg:${CAT}:d:${id}')"${id === now ? ' aria-current="step"' : ''}>${id === now ? `<em>${F('You’re here')}</em>` : ''}<i>${i + 1}</i><b>${F(label)}</b><small>${F(hint)}</small></button>`).join('')}</nav>`; };

  /* ---------- Which care fits us? Three taps, then the types worth looking at first ---------- */
  const FIT_Q = [
    ['hours', 'Which hours do you need?', ['Weekdays, regular hours', 'Early, late or weekends', 'Part-time, some days']],
    ['budget', 'How’s the budget?', ['Tight', 'Some room', 'Flexible']],
    ['family', 'Could family or friends help?', ['Yes, some days', 'Not really']],
    ['group', 'What feels right for now?', ['Other babies around', 'One-on-one', 'Not sure yet']]
  ];
  window.ccFit = (q, v) => { const f = load('ahead-childcare-fit', {}); f[q] = f[q] === v ? undefined : v; save('ahead-childcare-fit', f); rerender(); };
  function fitResults(f) {
    const sc = { center: 0, home: 0, nanny: 0, share: 0, family: 0 };
    if (f.hours === 'Weekdays, regular hours') { sc.center += 2; sc.home += 1; }
    if (f.hours === 'Early, late or weekends') { sc.center -= 2; sc.nanny += 2; sc.home += 1; sc.family += 1; }
    if (f.hours === 'Part-time, some days') { sc.home += 1; sc.family += 2; sc.share += 1; }
    if (f.budget === 'Tight') { sc.home += 2; sc.center += 1; sc.family += 1; sc.nanny -= 3; sc.share -= 1; }
    if (f.budget === 'Some room') { sc.center += 1; sc.share += 2; sc.home += 1; }
    if (f.budget === 'Flexible') { sc.nanny += 2; sc.share += 1; }
    if (f.family === 'Yes, some days') sc.family += 3; else if (f.family === 'Not really') sc.family -= 5;
    if (f.group === 'Other babies around') { sc.center += 2; sc.home += 1; }
    if (f.group === 'One-on-one') { sc.nanny += 2; sc.share += 1; sc.family += 1; }
    // Only types that actually fit: a poor match (a center for weekend hours) never shows just to fill a slot.
    const ranked = Object.entries(sc).sort((a, b) => b[1] - a[1]), fits = ranked.filter(([, v]) => v > 0);
    return (fits.length ? fits : ranked.slice(0, 1)).slice(0, f.family === 'Yes, some days' ? 3 : 2).map(([k]) => k);
  }
  const WHY = { center: 'Set hours, other babies, and built-in backup.', home: 'A smaller group, often with more flexible hours.', nanny: 'One-on-one, on your schedule.', share: 'Close to one-on-one, with the cost split.', family: 'Someone you trust, with flexible days.' };

  function careCardButton(card) {
    return `<button class="hub-rough-card cc-card-button" onclick="openPage('chg:${CAT}:d:card')"><span class="hub-rough-moon" aria-hidden="true">${hubArt('notepad', CAT)}</span><span class="hub-rough-copy"><b>${F(`${name()}’s care card`)}</b><small>${F(card.saved ? (ccCur() === 2 ? 'Keep it current as routines change' : 'Ready to send to any caregiver') : 'Feeds, naps and who to call, ready to share')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  }
  // Nov 12: Childcare moves with the family's plans, in three stages. It moves on by itself when the app already knows
  // (a pick saved on the shortlist, "Care has started"), and a parent can pick the stage from "All stages".
  const CC_ART = ["<svg viewBox=\"0 0 160 164\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\">\n <ellipse cx=\"80\" cy=\"151\" rx=\"74\" ry=\"9\" fill=\"#e2c993\" opacity=\".35\"/>\n <path d=\"M96 75 119 57l23 18v56H96Z\" fill=\"#dfb9b0\"/><path d=\"M98 76 119 60l22 16\" fill=\"none\" stroke=\"#ac8581\" stroke-width=\"3\" stroke-linejoin=\"round\"/><rect x=\"111\" y=\"93\" width=\"15\" height=\"19\" rx=\"5\" fill=\"#fff1d5\"/><rect x=\"113\" y=\"117\" width=\"17\" height=\"14\" rx=\"5\" fill=\"#fff1d5\"/>\n <circle cx=\"54\" cy=\"68\" r=\"23\" fill=\"#e4af9a\"/><path d=\"M32 61c3-19 24-29 41-13 5 4 8 10 8 15\" fill=\"#69544f\"/><path d=\"M38 50c-5 7-6 14-5 20\" fill=\"none\" stroke=\"#69544f\" stroke-width=\"8\" stroke-linecap=\"round\"/>\n <path d=\"M20 147c-2-35 10-57 34-59 26-2 42 19 43 59Z\" fill=\"#adc1c7\"/><path d=\"M72 105c9 11 14 21 15 37\" fill=\"none\" stroke=\"#829da6\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n <ellipse cx=\"83\" cy=\"115\" rx=\"27\" ry=\"22\" fill=\"#e8c7ad\"/><circle cx=\"80\" cy=\"100\" r=\"16\" fill=\"#edc6ad\"/><path d=\"M67 99c3-13 22-18 28-5\" fill=\"none\" stroke=\"#ad8979\" stroke-width=\"5\" stroke-linecap=\"round\"/><path d=\"M57 130c7-12 18-15 27-11 8 4 16 14 19 26H62Z\" fill=\"#d5bada\"/>\n <path d=\"M47 114c5 8 14 10 20 12\" fill=\"none\" stroke=\"#e4af9a\" stroke-width=\"8\" stroke-linecap=\"round\"/>\n <circle cx=\"118\" cy=\"35\" r=\"5\" fill=\"#e6bc70\"/><path d=\"M139 28v10m-5-5h10\" stroke=\"#d6ad5d\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n </svg>", "<svg viewBox=\"0 0 160 164\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\">\n <ellipse cx=\"80\" cy=\"153\" rx=\"72\" ry=\"8\" fill=\"#bfd8c3\" opacity=\".45\"/>\n <rect x=\"112\" y=\"41\" width=\"34\" height=\"48\" rx=\"9\" fill=\"#fffaf0\" stroke=\"#aec7ae\" stroke-width=\"2\"/><path d=\"M121 56h15m-15 8h12m-12 8h9\" stroke=\"#8ab09b\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n <path d=\"M29 146c0-34 11-53 38-53s42 19 44 53Z\" fill=\"#96c5ad\"/>\n <circle cx=\"68\" cy=\"69\" r=\"23\" fill=\"#dfaa94\"/><path d=\"M46 60c3-21 31-28 44-6 2 4 3 8 2 12\" fill=\"#625249\"/><path d=\"M47 70c-4-11-3-20 2-26\" stroke=\"#625249\" stroke-width=\"8\" stroke-linecap=\"round\"/>\n <path d=\"M86 111c6 4 11 9 14 18\" fill=\"none\" stroke=\"#74ae92\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n <circle cx=\"106\" cy=\"103\" r=\"17\" fill=\"#f1c5b0\"/><path d=\"M91 99c2-13 18-18 27-5\" fill=\"none\" stroke=\"#ad7f6d\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n <path d=\"M83 144c2-19 13-29 28-29 14 0 25 10 28 29Z\" fill=\"#d0d7ef\"/>\n <path d=\"M52 113c8 13 22 19 37 20\" stroke=\"#dfaa94\" stroke-width=\"10\" fill=\"none\" stroke-linecap=\"round\"/>\n <path d=\"M30 40c4-6 8-6 12 0 4-6 9-6 13 0-4 8-10 13-13 15-5-3-10-8-12-15Z\" fill=\"#e9ab9b\" opacity=\".85\"/>\n </svg>", "<svg viewBox=\"0 0 160 164\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\">\n <ellipse cx=\"83\" cy=\"153\" rx=\"74\" ry=\"8\" fill=\"#ecc8c4\" opacity=\".42\"/>\n <path d=\"M26 147c2-34 18-55 43-55 28 0 42 20 43 55Z\" fill=\"#c4aecf\"/>\n <circle cx=\"66\" cy=\"69\" r=\"24\" fill=\"#dcab98\"/><path d=\"M44 62c1-20 20-30 39-16 6 4 9 10 8 18\" fill=\"#67574d\"/><path d=\"M45 64c-6-6-6-14-4-18\" stroke=\"#67574d\" stroke-width=\"8\" stroke-linecap=\"round\"/>\n <path d=\"M60 77c4 5 11 6 16 0\" fill=\"none\" stroke=\"#9d675b\" stroke-width=\"2.7\" stroke-linecap=\"round\"/>\n <circle cx=\"117\" cy=\"97\" r=\"19\" fill=\"#f0c4aa\"/><path d=\"M100 92c3-13 19-19 30-8\" fill=\"none\" stroke=\"#ad8b77\" stroke-width=\"5\" stroke-linecap=\"round\"/><path d=\"M104 103c4 3 8 3 12 0\" fill=\"none\" stroke=\"#aa7766\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n <path d=\"M92 146c2-16 14-29 29-29 16 0 27 14 28 29Z\" fill=\"#b7d5bd\"/>\n <path d=\"M73 120c6-13 19-19 30-14\" fill=\"none\" stroke=\"#dcab98\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n <path d=\"M115 44c5-10 11-10 16-2 6-7 12-5 14 0 1 9-8 16-15 19-9-5-16-10-15-17Z\" fill=\"#d9a0a3\"/>\n <path d=\"M14 80l9-4m-2-12 7 3m110 1 8 7\" stroke=\"#d7a5aa\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n </svg>"];
  const CC_STAGES = [
    { label: 'Finding care', age: 'Months before', one: 'Kinds of care, costs and when to start looking', eyebrow: 'Finding care', t: 'Start looking early', lead: 'Infant spots go fast. Here’s what each kind of care looks like.',
      worth: ['Worth knowing before you look', 'The best tour question isn’t about activities.', 'Ask how they handle crying and naps, and who covers when someone’s out.'] },
    { label: 'Care chosen', age: 'Weeks before', one: 'Getting ready for day one, and a backup plan', eyebrow: 'Care chosen', t: 'Make day one familiar', lead: 'Ease in over a week or two, so the first real goodbye isn’t the first time.',
      worth: ['Worth knowing before day one', 'A practice day helps more than a perfect schedule.', 'Visit together first, then let the caregiver take the lead while you’re nearby.'] },
    { label: 'Care started', age: 'Once care starts', one: 'Settling in, each day, and when to speak up', eyebrow: 'Care started', t: 'How is care going?', lead: 'What happens after goodbye matters more than the goodbye itself.',
      worth: ['Worth knowing now', 'Tears at drop-off don’t tell the whole story.', 'Many babies protest the goodbye, then settle. Ask how {s} did after you left.'] }
  ];
  const ccAuto = () => ({ plan: 0, ready: 1, start: 2 })[stepNow()];
  const ccCur = () => { const o = load('ahead-childcare-stage', null); return typeof o === 'number' ? o : ccAuto(); };
  window.ccCurStage = ccCur;
  // Moving stage says it in the family's words, with Undo (like every stage change in the app).
  window.ccSetStage = i => { const before = load('ahead-childcare-stage', null); save('ahead-childcare-stage', i); page = `topic:${CAT}`; render(); scrollTo(0, 0);
    if (typeof hubToast === 'function') hubToast(F(['Back to finding care', 'Care chosen', 'Care started'][i]), F('Childcare now shows this stage.'), ['Undo', `document.querySelectorAll('.hub-toast').forEach(t=>t.remove());ccStageUndo(${JSON.stringify(before)})`]); };
  window.ccStageUndo = b => { if (b === null) { try { localStorage.removeItem('ahead-childcare-stage'); } catch (e) {} } else save('ahead-childcare-stage', b); page = `topic:${CAT}`; render(); scrollTo(0, 0); };
  // Nov 19, round 3: the main page shows the four options as photo cards (one line each); the comparison is its own
  // page, one card per question, with small pictures for the answers. Facts, not scores (AAP: 3 babies per adult in
  // an infant room; Caring for Our Children: at most 2 under-2s per adult in a home daycare).
  const COLS = [['center', 'Daycare'], ['home', 'Home daycare'], ['nanny', 'Nanny'], ['family', 'Family']];
  const ONE = { center: 'A licensed center with trained teachers', home: 'A small group in a provider’s home', nanny: 'One-on-one care in your home', family: 'Someone who already knows {o}' };
  const dots = n => `<span class="cc-dots" aria-hidden="true">${[1, 2, 3].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
  const ppl = n => `<span class="cc-ppl" aria-hidden="true">${Array.from({ length: n }, () => '<svg viewBox="0 0 12 14"><circle cx="6" cy="4" r="3"/><path d="M1 14a5 5 0 0 1 10 0Z"/></svg>').join('')}</span>`;
  const ok = '<span class="cc-ok" aria-hidden="true">✓</span>', no = '<span class="cc-no" aria-hidden="true">–</span>';
  const QS = [
    ['hours', 'clock', 'Hours', { center: [dots(1), 'Set hours'], home: [dots(2), 'Some flex'], nanny: [dots(3), 'Your schedule'], family: [dots(3), 'Agreed together'] }, ['nanny', 'family']],
    ['group', 'blocks', 'Group size', { center: [ppl(3), '3 per adult, 6 in a room'], home: [ppl(2), '2 babies per adult, plus older kids'], nanny: [ppl(1), 'Just yours (2 if shared)'], family: [ppl(1), 'Just yours'] }, []],
    ['sick', 'thermo', 'If {s’s} sick', { center: [no, 'Stays home'], home: [no, 'Stays home'], nanny: [ok, 'Care goes on'], family: [ok, 'Care goes on'] }, ['nanny', 'family']],
    ['backup', 'shield', 'If the caregiver’s out', { center: [ok, 'Other staff cover'], home: [no, 'You find backup'], nanny: [no, 'You find backup'], family: [no, 'You find backup'] }, ['center']],
    ['cost', 'coin', 'What you pay for', { center: ['', 'Tuition'], home: ['', 'Tuition'], nanny: ['', 'Salary + payroll taxes'], family: ['', 'Whatever you agree'] }, []]
  ];
  // Round 6: one question at a time. Tabs (or a swipe) switch the question; each kind of care answers it in a full
  // sentence and opens its own page; "What to ask" turns the answer into a tour question. Sources: AAP (ratios, sick
  // days), Caring for Our Children (home daycare), IRS (nanny payroll taxes).
  // Round 8 (Yarden's mockup): the question as the headline, the care type as the bold line (same spot on every
  // tab, so it's easy to compare), and the answer as one grey line.
  const CMP_NAME = { center: 'Daycare center', home: 'Home daycare', nanny: 'Nanny', family: 'Family care' };
  const TOPICS_CMP = [
    ['hours', 'Hours', 'clock', 'Which hours do you need?', 'Early starts, late pickups and weekends narrow your options.', {
      center: 'Set hours. Ask about early drop-off.', home: 'Set hours, often a bit more flexible',
      nanny: 'Works your schedule, as you agree', family: 'Up to you both, week to week' }, 'What are your hours, and what happens if I’m running late?'],
    ['group', 'Group size', 'blocks', 'How many babies per adult?', 'These are recommended limits. Your state’s rules may allow more, so ask.', {
      center: 'Recommended: 3 per adult, 6 in a room', home: 'Recommended: 2 babies per adult',
      nanny: 'Just your baby, or 2 in a nanny share', family: 'Usually just your baby' }, 'How many babies does each caregiver look after?'],
    ['sick', 'Sick days', 'thermo', 'What happens when Maya is sick?', 'It depends on the kind of care, and each provider’s policy.', {
      center: 'Usually home, but each center sets its policy', home: 'Usually home, and it may close if the provider’s sick',
      nanny: 'Often can keep caring, if you agreed ahead', family: 'Often can keep caring, if they’re comfortable' }, 'Which illnesses mean Maya needs to stay home, and when can {s} come back?'],
    ['cost', 'Cost', 'coin', 'What will care cost?', 'Prices vary a lot by city, so ask each place for the full cost.', {
      center: 'Monthly tuition, often with a deposit', home: 'Tuition, often about the same as a center',
      nanny: 'Usually the most: a salary, plus taxes', family: 'Whatever you agree, from nothing to a wage' }, 'What’s the total cost, including fees, closed days and deposits?']
  ];
  let cmpAt = 0;
  window.ccTopic = i => { cmpAt = (i + TOPICS_CMP.length) % TOPICS_CMP.length; rerender(); };
  window.ccSwipe = (el) => { let x0 = null; el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) ccTopic(cmpAt + (dx < 0 ? 1 : -1)); }, { passive: true }); };
  // Nov 23 (Yarden's inspiration): every kind of care side by side, so comparing is looking across a row, not tapping
  // four tabs and remembering. Facts, not scores (design guide); each column opens that kind of care.
  // Nov 23 (Yarden's mockup): calendar / people / heart / coins on the rows; building / house / person / people on top.
  const GRID_ROWS = [
    ['calendar', 'Hours', { center: 'Set hours', home: 'Set, often flexible', nanny: 'Your schedule', family: 'Flexible' }],
    ['people', 'Babies per adult', { center: '3 babies', home: '2 babies', nanny: '1', family: '1 usually' }, 'Recommended limits. Your state’s rules may allow more, so ask.'],
    ['heart', 'When {s’s} sick', { center: 'Stays home', home: 'Stays home; may close', nanny: 'Usually still on', family: 'Usually still on' }],
    ['coins', 'What you pay', { center: 'Monthly tuition', home: 'Tuition, often similar', nanny: 'Salary + taxes', family: 'What you agree' }]
  ];
  const GRID_ICON = { center: 'school', home: 'home', nanny: 'person', family: 'people' };
  const GRID_COL = { center: 'Daycare', home: 'Home daycare', nanny: 'Nanny', family: 'Family' };
  function comparePage() {
    const head = `<div class="cc-grid-head"><span></span>${COLS.map(([k]) => `<button onclick="openPage('chg:${CAT}:d:${k}')" aria-label="${F(CMP_NAME[k])}"><span>${hubArt(GRID_ICON[k], CAT)}</span>${F(GRID_COL[k])}</button>`).join('')}</div>`;
    const rows = GRID_ROWS.map(([ic, label, cells, note]) => `<div class="cc-grid-row"><div class="cc-grid-label">${hubArt(ic, CAT)}<b>${F(label)}</b></div>${COLS.map(([k]) => `<div>${F(cells[k])}</div>`).join('')}${note ? `<p class="cc-grid-note">${F(note)}</p>` : ''}</div>`).join('');
    const foot = `<p class="cc-grid-foot">${hubArt('info', CAT)}<span>${F('Prices vary a lot by city, so ask each place for the full cost, including fees and closed days.')}</span></p>`;
    return sub('compare', 'Kinds of care', 'Compare your\u00a0options', 'The same four questions, across each kind of care.', `<section class="cc-grid">${head}${rows}</section>${foot}`, 'blocks');
  }
  function childcare() {
    const card = load('ahead-carecard', {}), list = shortlist(), am = typeof actualMonth === 'function' ? actualMonth() : 0, fd0 = feedNow(), bm0 = fd0 !== 'Formula', fm0 = fd0 !== 'Breast milk';
    const cur = ccCur(), mm = typeof page === 'string' && /^chg:Childcare:s:(\d)/.exec(page), view = mm ? +mm[1] : cur, S = CC_STAGES[view];
    if (typeof stageTimeline === 'function') stageTimeline(CAT, CC_STAGES.map((st, i) => ({ label: st.label, age: st.age, on: i === view, now: i === cur, onclick: `openPage('chg:${CAT}:s:${i}')`, change: `ccSetStage(${i})` })));
    // The top card: where the family is, with a scene of it.
    // Nov 19, round 4: on Finding care the top card *is* the options: headline, then the four kinds of care as photo
    // tiles and the side-by-side compare, so the page opens on one designed card instead of art plus a tip.
    // Round 5 (Yarden: the inspiration does it better): a light top card with its picture, then the options below it.
    // Round 9 (Yarden): a real photo for each stage, with the headline under it.
    // Nov 20 (Yarden): three pills at the top instead of "All stages" and the Previewing banner. A dot marks where the
    // family is; tapping another pill previews it, with one button in the family's own words to move there.
    const PILL = ['Find care', 'Get ready', 'Settle in'], MOVE = ['Back to finding care', 'We’ve chosen care', 'Care has started'];
    let b = `<nav class="cc-pills" aria-label="${F('Childcare stages')}">${PILL.map((n, i) => `<button class="${i === view ? 'is-on' : ''}${i === cur ? ' is-now' : ''}" aria-current="${i === view ? 'page' : 'false'}" onclick="openPage('chg:${CAT}:s:${i}')">${i === cur ? '<i aria-hidden="true"></i>' : ''}${F(n)}${i === cur ? `<span class="cc-sr">${F(', where you are now')}</span>` : ''}</button>`).join('')}</nav>`
      + (view !== cur ? `<div class="cc-pill-note"><span>${F(view > cur ? 'Just a preview.' : 'A look back.')}</span><button onclick="ccSetStage(${view})">${F(MOVE[view])} →</button></div>` : '');
    // Nov 23 cohesion pass: the same top card as every other guide (label, headline, lead, then the photo in the 16:10 frame).
    b += `<header class="hub-hero cc-hero cc-std-hero"><p class="cc-std-eyebrow">${F(S.eyebrow)}</p><h1>${F(S.t)}</h1><p class="hub-lead">${F(S.lead)}</p><div class="cc-std-photo"><img src="assets/childcare/stage${view}.jpg" alt=""></div></header>`
      ;   // Nov 22: Get ready's tip now lives in the easing-in steps below
    if (view === 0) {
      // Nov 19: the signature visual. Four kinds of regular care side by side, facts not scores; a chip highlights a row
      // and ticks the cell that's strongest on it, but nothing picks a winner for the family (design guide).
      // Round 6: four big photo cards, one line each, then the comparison one tap away.
      b += `<div class="cc-grid2">${COLS.map(([k]) => { const m = (list[k] || []).length; return `<button class="cc-card2" onclick="openPage('chg:${CAT}:d:${k}')"><img src="assets/childcare/card-${k}.jpg" alt="" loading="lazy"><b>${F(CMP_NAME[k])}&nbsp;›</b><small>${F(m ? `${m} on your shortlist` : ONE[k])}</small></button>`; }).join('')}</div>`
        + `<div class="hub-list cc-cmp-link">` + homeRow('fit', 'blocks', 'Compare your options', 'Hours, group size, sick days and cost', 'compare')
        + homeRow('plan', 'notepad', 'Plan your care', 'When to start, and what comes next', 'plan') + `</div>`;
      // Round 12 (Yarden): the rest is one tap away, so the page is the four options and two next steps.
      b += `<details class="hub-card cc-more cc-more-links"><summary><span>${hubArt('star', CAT)}</span><div><b>${F('More help and planning')}</b><small>${F('Babysitters, extra help, paying, a quick quiz')}</small></div></summary><div class="hub-list">`
        + homeRow('sitter', 'moon', 'Babysitter', 'For a night out, or a break', 'sitter')
        + homeRow('help', 'heart', 'Extra help at home', am < 4 ? 'A doula or a night nanny, early on' : 'A helper while you’re home, or at night', 'help')
        + homeRow('pay', 'coin', 'Paying for care', 'A pre-tax account, a tax credit and more', 'pay')
        + homeRow('quiz', 'eye', 'Not sure? Take the quick quiz', 'Four taps, and where to look first', 'fit') + `</div></details>`;
    } else if (view === 1) {
      // Nov 22 (Yarden's inspiration): how easing in goes, on the page itself. The dated countdown stays on Get ready for day one.
      const ch1 = chosenNow(), k1 = ch1 ? ch1.k : '', home1 = k1 === 'nanny', fam1 = k1 === 'family';
      const ease = home1 ? [['Meet at home together', 'Let Maya get to know {p} nanny with you there.'], ['A paid trial day', 'You stay home, a room away.'], ['A quick, warm goodbye', 'The same short goodbye each time.']]
        : fam1 ? [['Spend time together first', 'Let Maya get used to their place and their way.'], ['A practice day', 'A few hours, then a full day.'], ['A quick, warm goodbye', 'The same short goodbye each time.']]
        : [['Visit together', 'Let Maya explore and meet {p} caregiver.'], ['A short practice day', 'A few hours first, then build up.'], ['A quick, warm goodbye', 'The same short goodbye each time.']];
      b += `<h2 class="hub-h2">${F('Easing in, step by step')}</h2><ol class="cc-route cc-ease">${ease.map(([t, d], i) => `<li><i>${i + 1}</i><div><b>${F(t)}</b><span>${F(d)}</span></div></li>`).join('')}</ol>`;
      b += careCardButton(card);
      b += `<h2 class="hub-h2">${F('Before day one')}</h2><div class="hub-list">`
        + homeRow('ready', 'bag', 'Get ready for day one', `Your countdown, and packing ${bm0 && fm0 ? 'milk and formula' : bm0 ? 'pumped milk' : 'formula'}`, 'ready')
        + homeRow('backup', 'shield', 'When care falls through', 'Set up your backup now', 'backup') + `</div>`;
    } else {
      // Review (Nov 20): the useful question is how the baby is doing while you're away, so the page shows a good daily
      // update, then what to watch for. Replaces the two big Going well / Speak up panels.
      b += dailyUpdate(am);
      b += `<h2 class="hub-h2">${F('What to watch for')}</h2><div class="hub-card cc-watch"><p class="is-good"><i aria-hidden="true"></i><span><b>${F('Going well')}</b>${F('{S} settles with support, and is cared for warmly all day.')}</span></p><p class="is-act"><i aria-hidden="true"></i><span><b>${F('Speak up that day')}</b>${F('An injury no one explains, unsafe sleep, or worries brushed off. An injury? Call your pediatrician.')}</span></p></div>`;
      b += careCardButton(card);
      b += `<h2 class="hub-h2">${F('Day to day')}</h2><div class="hub-list">`
        + homeRow('start', 'sun', 'The first months', 'Check-ins, sick days, and speaking up', 'start')
        + homeRow('backup', 'shield', 'When care falls through', 'Sick days, closed days, a caregiver who leaves', 'backup') + `</div>`;
    }
    if (view < 2) b += H().next(view === 0 ? 'Next · once you’ve chosen care' : 'Next · once care starts', view === 0 ? 'Get ready for day one' : 'Settle in', `openPage('chg:${CAT}:s:${view + 1}')`, '', view === 0 ? 'A practice day, packing and backup care.' : 'How care is going, and sick days.');
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

  /* ---------- the steps, one at a time ---------- */
  // Tabs name each step in one word; each kind of step has its own shape: quick checks as icon rows,
  // things to look for as picture tiles, questions as cards with the answer to listen for tucked inside.
  const TAB = { 'Before you visit': 'Call', 'On the tour: look for': 'Look', 'On the tour: ask': 'Ask', 'Before you sign': 'Sign', 'Before you meet': 'Call', 'At the interview: watch for': 'Watch', 'At the interview: ask': 'Ask', 'Before you hire': 'Check', 'Before the sitter comes': 'Message', 'A first visit, while you’re home': 'Visit', 'Ask': 'Ask', 'On the visit: ask': 'Ask', 'Your questions': 'Yours' };
  const ICONS = [[/crying/i, 'heart'], [/spot|waitlist/i, 'notepad'], [/hours|days/i, 'clock'], [/cost|pay/i, 'coin'], [/licens|inspection/i, 'shield'], [/sleep|crib/i, 'crib'], [/grown-up|babies per adult|2 babies/i, 'smile'], [/warm|caregiver|hold|how they are/i, 'heart'], [/clean|calm room/i, 'home'], [/baby-safe home|safe home/i, 'shield'], [/phone|attention/i, 'eye'], [/cpr/i, 'steth'], [/background/i, 'shield'], [/sick/i, 'thermo'], [/hear about|day\?/i, 'chat'], [/pets|pool|guns/i, 'home'], [/references|families|family you/i, 'chat'], [/trial/i, 'clock'], [/car seat/i, 'car'], [/babies this young|under 1/i, 'smile'], [/frustrat/i, 'heart'], [/feeds|naps, bedtime/i, 'bottle'], [/touch/i, 'chat']];
  const iconFor = q => (ICONS.find(([r]) => r.test(q)) || [0, 'star'])[1];
  const stepView = {};
  window.ccStep = (k, i) => { stepView[k] = i; rerender(); };
  window.ccFlip = el => el.classList.toggle('is-open');
  // Nov 19: what a good place looks like, as a labeled photo at a baby's eye level (the tiles below say why).
  // Labels name the thing, sit beside it, and never cover a child.
  const ROOM = {
    center: ['assets/childcare/room-center.jpg', 'A calm daycare infant room: bare cribs along one wall, two caregivers on the floor with three babies, and a changing area with a sink', [['Bare cribs', 14, 17, 't', 'bare cribs'], ['2 adults, 3 babies', 38, 93, 'r', 'grown-ups']]],
    // Review feedback: the nanny interview shows what to notice too.
    nanny: ['assets/childcare/room-nanny.jpg', 'A caregiver lying on a play mat face to face with a baby doing tummy time, smiling and talking, while the baby’s mother watches from the sofa', [['Down at {p} level', 22, 76, 't', 'how they are'], ['Smiling, talking to {o}', 47, 52, 't', 'how they are'], ['You, nearby', 85, 34, 'l']]],
    home: ['assets/childcare/room-home.jpg', 'A home daycare living room: one caregiver on a play mat with a baby and two toddlers, a bare portable crib and a baby gate', [['Bare crib', 27, 18, 't', 'to sleep'], ['Baby gate', 80, 16, 'l']]]
  };
  const roomPhoto = k => { const r = ROOM[k]; if (!r) return ''; return `<figure class="sf-photo cc-room"><img src="${r[0]}" alt="${F(r[1])}" loading="lazy">${r[2].map(([l, x, y, side, to]) => to ? `<button class="cc-pin cc-pin-${side}" style="left:${x}%;top:${y}%" onclick="ccPin(this,'${to}')"><i></i><span>${F(l)}</span></button>` : `<span class="cc-pin cc-pin-${side}" style="left:${x}%;top:${y}%"><i></i><span>${F(l)}</span></span>`).join('')}</figure>`; };
  // A photo label opens the row that explains it.
  window.ccPin = (el, to) => { const box = el.closest('.cc-steps') || document; const d = [...box.querySelectorAll('.cc-peek details')].find(x => x.querySelector('summary').textContent.toLowerCase().includes(to));
    if (!d) return; d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'center' }); d.classList.add('is-flash'); setTimeout(() => d.classList.remove('is-flash'), 1200); };
  const MERGED = { 'On the tour: look for': 'Tour', 'At the interview: watch for': 'Meet', 'A first visit, while you’re home': 'Visit' };
  // (titles for merged steps below)
  const MERGED_T = { 'Before you visit': 'Call ahead', 'On the tour: look for': 'On the tour', 'Before you sign': 'Before you sign', 'Before you meet': 'Call first', 'At the interview: watch for': 'Meet them', 'Before you hire': 'Check references', 'Before the sitter comes': 'A quick message', 'A first visit, while you’re home': 'A first visit' };
  function stepsBlock(k, Q, t) {
    const groups = []; Q.forEach(x => { let g = groups.find(y => y.name === x.g); if (!g) groups.push(g = { name: x.g, kind: x.kind, sub: x.gs, items: [] }); g.items.push(x); });
    // Your own questions join the "ask" step.
    const yours = groups.find(g => g.name === 'Your questions'), askG = groups.find(g => g.kind === 'ask' && g !== yours);
    if (yours && askG) { askG.items.push(...yours.items); groups.splice(groups.indexOf(yours), 1); }
    // Round 8: what to look for and what to ask happen at the same visit, so they're one step.
    for (let i = groups.length - 1; i > 0; i--) if (groups[i].kind === 'ask' && groups[i - 1].kind === 'look') { groups[i - 1].asks = groups[i].items; if (t.who === 'place') groups[i - 1].sub = 'Look around, then ask three questions'; groups.splice(i, 1); }
    const cur = Math.min(stepView[k] || 0, groups.length - 1), g = groups[cur];
    const tabs = groups.length > 1 ? `<div class="cc-tabs" role="tablist">${groups.map((x, i) => `<button role="tab" aria-selected="${i === cur}" class="${i === cur ? 'is-on' : ''}" onclick="ccStep('${k}',${i})"><i>${i + 1}</i>${F(MERGED[x.name] || TAB[x.name] || x.name)}</button>`).join('<span class="cc-tab-sep" aria-hidden="true">›</span>')}</div>` : '';
    // One step only (Family or friends): the page heading already names it, so just the short line under it.
    const head = groups.length > 1 ? `<div class="cc-stephead"><b>${F(MERGED_T[g.name] || g.name)}</b>${g.sub ? `<small>${F(g.sub)}</small>` : ''}</div>` : g.sub && !t.plan ? `<div class="cc-stephead"><small>${F(g.sub)}</small></div>` : '';
    let body = '';
    // Questions: the question in bold, what to listen for one tap away.
    const askRows = items => peek('', items.map(x => ['chat', x.own ? esc3(x.q) : x.q, x.own ? 'Your own question' : 'Listen for: ' + x.a]));
    const askCards = items => `<div class="cc-asks">${items.map((x, i) => `<button class="cc-ask" onclick="ccFlip(this)"><em>${i + 1}</em><b>${x.own ? esc3(x.q) : F(x.q)}</b>${x.own ? `<small class="cc-own">${F('Your question')}</small>` : `<span class="cc-listen"><small>${F('Listen for')}</small>${F(x.a)}</span><small class="cc-tap">${F('What to listen for')} ›</small>`}</button>`).join('')}</div>`;
    if (g.kind === 'look') body += roomPhoto(k) + `<p class="cc-sublabel">${F(t.who === 'place' ? 'Look for' : 'Notice')}</p>` + peek('', g.items.map(x => [iconFor(x.q), x.q, x.a])) + (g.asks ? `<p class="cc-sublabel">${F(g.asks.length === 3 ? 'Three questions to ask' : 'Questions to ask')}</p>` + askRows(g.asks) : '');
    else if (g.kind === 'ask') body += askCards(g.items);
    else if (g.kind === 'talk') {
      // Review (Nov 20): two groups, and the crib photo sits inside safe sleep, where it teaches something.
      const row = x => { const sleep = /sleep|crib/i.test(x.q) && !x.own;
        return x.own ? peekRow(iconFor(x.q), esc3(x.q), 'Your own topic') : peekRow(iconFor(x.q), x.q, x.a, sleep ? `<details class="cc-photo-peek"><summary>${F('See it')}</summary><figure class="cc-peek-photo"><img src="assets/childcare/sleep-sack.jpg" alt="A baby asleep on her back in a sleep sack, arms out, in a bare crib" loading="lazy"><figcaption>${F('On the back, in a sleep sack, in a bare crib. No blankets, bumpers or pillows.')}</figcaption></figure></details>` : ''); };
      const safe = g.items.filter(x => !x.own && /sleep|crib|car seat|crying|cpr/i.test(x.q)), rest = g.items.filter(x => !safe.includes(x));
      body += `<h2 class="hub-h2">${F('Agree on safety')}</h2><div class="hub-card cc-peek">${safe.map(row).join('')}</div>`
        + `<h2 class="hub-h2">${F('Share Maya’s routine')}</h2><div class="hub-card cc-peek">${rest.map(row).join('')}</div>`;
    }
    else body += `<div class="cc-quick">${g.items.map(x => `<div class="cc-quick-row"><span>${hubArt(iconFor(x.q), CAT)}</span><div><b>${x.own ? esc3(x.q) : F(x.q)}</b>${x.a ? `<small>${F(x.a)}</small>` : ''}</div></div>`).join('')}</div>`;
    const nx = groups[cur + 1], noun = t.who === 'place' ? 'place' : 'person';
    const nav = nx ? `<button class="hub-button cc-next2" onclick="ccStep('${k}',${cur + 1});scrollTo(0,0)">${F('Next: ' + (MERGED_T[nx.name] || nx.name))} →</button>`
      : t.talk ? '' : `<button class="hub-button is-secondary cc-next2" onclick="openPage('chg:${CAT}:d:${k}')">${F('Done: back to ' + (CMP_NAME[k] || t.name))} →</button>`;
    const where = cur === 0 && FIND[k] && !t.summary ? `<p class="cc-find">${hubArt('eye', CAT)}<span>${F(FIND[k])}</span></p>` : '';
    return `<section class="cc-steps">${tabs}${where}${head}${body}${nav}</section>`;
  }

  /* ---------- one page per type, always in the same order ---------- */
  // Round 8 (Yarden's mockup): each kind of care is a short summary: a photo card with one plain headline, three
  // things to know, one row into the step-by-step plan (its own page), and the other options as photos.
  let nannyMode = 0;
  window.ccNanny = i => { nannyMode = i; rerender(); };
  const SUMMARY = {
    center: { head: 'Trained teachers, and other babies around', plan: ['Choose a daycare', '3 steps: call, tour, sign'],
      know: [['notepad', 'Infant rooms fill first', 'Join a few waitlists now', go('plan')], ['thermo', 'Expect more colds the first year', 'Plan backup for sick days at home', go('backup')]] },
    home: { head: 'A small group, in a home', plan: ['Choose a home daycare', '3 steps: call, tour, sign'],
      know: [['clock', 'Start about 3 months ahead', 'Good spots fill by word of mouth', go('plan')], ['shield', 'You’ll need backup care', 'For when the provider is sick or away', go('backup')]] },
    nanny: { head: 'One caregiver, just for Maya', plan: ['How to hire a nanny', '3 steps. Start about 3 months ahead'],
      know: [['coin', 'Usually the highest cost', 'Compare costs, or see a nanny share', `ccTopic(3);openPage('chg:${CAT}:d:compare')`], ['shield', 'You’ll need backup care', 'For sick days or time off', go('backup')], ['notepad', 'You’ll be the employer', 'Payroll, taxes and how to pay', go('pay')]] },
    share: { head: 'One nanny, shared by two families', plan: ['How to set up a share', 'Find a family, agree, hire together'], to: 'share',
      know: [['coin', 'Costs less than a nanny alone', 'Two families split the pay'], ['smile', 'Close to one-on-one', 'One nanny, and two babies'], ['clock', 'Start about 3 months ahead', 'Finding a family takes time']] },
    sitter: { noPhoto: 1, plan: ['Find a babysitter', '2 steps: a message, then a first visit'],
      know: [['crib', 'Back to sleep, in a bare crib', 'Every sleep, even naps. Tell your sitter.'], ['clock', 'Book a week or two ahead', 'Time for a first visit while you’re home'], ['moon', 'Keep the first night short', 'And stay reachable by phone'], ['notepad', 'Leave Maya’s care card', 'Feeds, naps and who to call', go('card')]] },
    family: { head: 'Care from someone who loves Maya', plan: ['Talk it through', 'Safety, and Maya’s routine'],
      know: [['clock', 'Agree on the hours', 'And that either of you can say if it isn’t working'], ['crib', 'Some advice has changed', 'Go over sleep and car seats together']] }
  };
  const candLine = (c, Q) => { const liked = c.liked != null ? c.liked : c.notes, cut = x => esc3(x.length > 34 ? x.slice(0, 33) + '…' : x);
    const bits = [liked && 'Liked: ' + cut(liked), c.worry && 'Worry: ' + cut(c.worry), c.confirm && 'To confirm'].filter(Boolean);
    return bits.length ? bits.join(' · ') : F(`${(c.checks || []).filter(x => Q.some(y => y.key === x)).length} of ${Q.length} checked`); };
  function summaryPage(k) {
    const t = TYPES[k], h = H(), mine = shortlist()[k] || [], Q = questions(k), S = SUMMARY[k === 'nanny' && nannyMode ? 'share' : k];
    const toggle = k === 'nanny' ? `<div class="cc-seg" role="tablist">${['Nanny', 'Nanny share'].map((n, i) => `<button role="tab" aria-selected="${i === nannyMode}" class="${i === nannyMode ? 'is-on' : ''}" onclick="ccNanny(${i})">${F(n)}</button>`).join('')}</div>` : '';
    const hero = `<header class="cc-photo-hero"><img src="assets/childcare/card-${k === 'nanny' && nannyMode ? 'share' : k}.jpg" alt="" loading="lazy"><div><p class="hub-eyebrow">${F(k === 'nanny' && nannyMode ? 'Nanny share' : CMP_NAME[k])}</p><h1>${F(S.head)}</h1></div></header>`;
    const shortRows = mine.map(c => h.row({ icon: t.icon, cat: CAT, title: esc3(c.name || 'Unnamed'), sub: c.chosen ? F(t.talk ? 'Helping' : 'Chosen') : candLine(c, Q), onclick: `openPage('chg:${CAT}:d:cand-${k}-${c.id}')` }));
    const others = S.noPhoto ? '' : COLS.filter(([x]) => x !== k).map(([x]) => `<button class="cc-mini" onclick="openPage('chg:${CAT}:d:${x}')"><img src="assets/childcare/card-${x}.jpg" alt="" loading="lazy"><b>${F(CMP_NAME[x])}&nbsp;›</b></button>`).join('');
    const page = sub(k, 'Kinds of care', t.name, S.noPhoto ? t.lead : '',
      (S.noPhoto ? '' : hero) + toggle
      + (k === 'center' && typeof profile !== 'undefined' && profile.early ? h.tip('Born early?', 'Ask your pediatrician when group care makes sense for {o}.') : '')
      + rows('What to know', S.know)
      + `<div class="hub-list cc-plan-row">` + homeRow('plan', t.talk ? 'chat' : 'notepad', S.plan[0], S.plan[1], S.to || 'hire-' + k) + `</div>`
      + (t.talk ? '' : h.list('Your shortlist', shortRows.concat(h.row({ icon: 'notepad', cat: CAT, title: F(k === 'nanny' && nannyMode ? 'Add a family or nanny you’re considering' : `Add a ${t.who === 'place' ? 'place' : 'person'} you’re considering`), sub: F('Keep notes, so you can compare later'), onclick: `openPage('chg:${CAT}:d:cand-${k}-new')` }))) + (mine.some(c => c.chosen) ? rows('', [['bag', 'Get ready for day one', 'Easing in, and what to send', go('ready')]]) : ''))
      + (others ? `<h2 class="hub-h2">${F('Explore other options')}</h2><div class="cc-minis">${others}</div>` : ''), t.icon);
    return S.noPhoto ? page : page.replace('<div class="dev-area-head', '<div class="cc-head-hidden dev-area-head');
  }
  const PLAN_T = { center: 'Choose a daycare', home: 'Choose a home\u00a0daycare', nanny: 'Hire a nanny', family: 'Talk it through', sitter: 'Find a babysitter' };
  function planPage(k) {
    const t = TYPES[k];
    const sleepNow = k === 'family' ? `<figure class="cc-type-photo cc-family-photo"><img src="assets/childcare/family-talk.jpg" alt="A grandmother holding a smiling baby on her lap, talking to him, with the baby’s parent beside them"></figure>` : '';
    return sub(k, t.name, PLAN_T[k], t.talk ? 'Have this talk a few weeks before the first day.' : k === 'sitter' ? 'Two steps, a week or two ahead.' : 'Three steps, starting about 3\u00a0months ahead.', sleepNow + stepsBlock(k, questions(k), Object.assign({ plan: 1 }, t)), t.icon);
  }
  function typePage(k) {
    if (SUMMARY[k]) return summaryPage(k);
    const t = TYPES[k], h = H(), mine = shortlist()[k] || [], noun = t.who === 'place' ? 'place' : 'person', Q = questions(k);
    const ed = false, changed = false;
    const qs = !ed ? stepsBlock(k, Q, t) : `<div class="cc-qs is-editing">${grouped(Q, x => `<div class="cc-q"><div><b>${x.own ? esc3(x.q) : F(x.q)}</b><small>${F(hint(x))}</small></div>${ed ? `<button class="cc-q-x" aria-label="Remove this question" onclick="ccQHide('${k}','${x.key}')">×</button>` : ''}</div>`)}`
      + (ed ? `<div class="cc-q-add"><input id="ccNewQ" placeholder="${esc3('Add your own question')}" autocomplete="off" onkeydown="if(event.key==='Enter')ccQAdd('${k}')"><button onclick="ccQAdd('${k}')">${F('Add')}</button></div>${changed ? `<button class="cc-q-reset" onclick="ccQReset('${k}')">${F('Bring back our questions')}</button>` : ''}` : '') + `</div>`;
    const shortRows = mine.map(c => h.row({ icon: t.icon, cat: CAT, title: esc3(c.name || 'Unnamed'), sub: c.chosen ? F(t.talk ? 'Helping' : 'Chosen') : `${(c.checks || []).filter(x => Q.some(y => y.key === x)).length} of ${Q.length} ${t.talk ? 'talked through' : 'checked'}${c.notes ? ' · has notes' : ''}`, onclick: `openPage('chg:${CAT}:d:cand-${k}-${c.id}')` }));
    const fit = FIT[k];
    const top = fit ? `<h2 class="hub-h2">${F('Good fit if you…')}</h2><div class="cc-fit3">${fit.good.map(([i, txt]) => `<div><span>${hubArt(i, CAT)}</span><b>${F(txt)}</b></div>`).join('')}</div>`
        + rows('Keep in mind', fit.mind)
      : `<section class="hub-card cc-fit"><div><b>${F('A good fit if')}</b><p>${F(t.good)}</p></div><div><b>${F('Keep in mind')}</b><p>${F(t.mind)}</p></div><div class="cc-when"><span class="cc-when-art">${hubArt('idea', CAT)}</span><div><small>${F(t.talk ? 'When to ask' : 'When to start looking')}</small><b>${F(t.when[0])}</b><p>${F(t.when[1])}</p></div></div></section>`;
    const page0 = sub(k, 'Kinds of care', t.name, fit ? fit.lead : t.lead,
      top
      + (k === 'center' && typeof profile !== 'undefined' && profile.early ? h.tip('Born early?', 'Ask your pediatrician when group care makes sense for {o}.') : '')
      + (WHERE[k] && !fit ? rows('Where to look', WHERE[k]) : '')
      + (k === 'sitter' || k === 'family' ? careCardButton(load('ahead-carecard', {})) : '')
      + `<div class="cc-qhead"><h2 class="hub-h2">${F(t.talk ? 'Things to talk through' : t.who === 'place' ? 'Checking a place' : 'Finding the right person')}</h2></div>` + qs
      + `<h2 class="hub-h2">${F(t.talk ? 'Who’s helping' : 'Your shortlist')}</h2>`
      + (mine.length ? h.list('', shortRows) + (mine.some(c => c.chosen) ? rows('', [['bag', 'Get ready for day one', 'Easing in, and what to send', go('ready')]]) : '') : `<p class="cc-lead">${F(t.talk ? `Add each person who’ll help, and tick off what you’ve talked through.` : `Add each ${noun} you’re considering, and tick off each step.`)}</p>`)
      + `<button class="hub-button is-secondary cc-add" onclick="openPage('chg:${CAT}:d:cand-${k}-new')">＋ ${F(`Add a ${noun}`)}</button>`, t.icon);
    // A real photo above the top card, for the four regular kinds of care.
    return fit ? page0.replace('<div class="dev-area-head', `<figure class="cc-type-photo"><img src="assets/childcare/card-${k}.jpg" alt="" loading="lazy"></figure><div class="cc-photo-head dev-area-head`) : page0;
  }
  const FIND = {
    center: 'Find places on your state’s child care website, through a local referral agency, or from parents nearby.',
    home: 'Find providers on your state’s child care website, through a local referral agency, or from parents nearby.',
    nanny: 'Find people through local parent groups, a nanny agency, or caregiver websites.',
    sitter: 'Ask friends and other parents, look on caregiver websites, or ask daycare teachers who babysit evenings.'
  };
  const FIT = {
    center: { lead: 'Trained teachers and set hours. Infant rooms fill first, so join a few waitlists now.',
      good: [['clock', 'Want set hours'], ['blocks', 'Like other babies around'], ['shield', 'Want staff to cover sick days']],
      mind: [['thermo', 'More colds in the first year', 'Plan backup for sick days at home', go('backup')]] },
    home: { lead: 'A small group in a provider’s home. Start looking at least 3 months ahead.',
      good: [['home', 'Want a homey setting'], ['blocks', 'Like a small, mixed group'], ['clock', 'Need a little flexibility']],
      mind: [['hand', 'One provider', 'Plan backup for when they’re sick or away', go('backup')]] },
    nanny: { lead: 'One caregiver, in your home. Start looking about 3 months ahead.',
      good: [['clock', 'Want a flexible schedule'], ['smile', 'Prefer one\u2011on\u2011one care'], ['home', 'Want care in your home']],
      mind: [['notepad', 'You become an employer', 'Payroll taxes, and how to pay', go('pay')], ['coin', 'Usually the highest cost', 'Sharing a nanny splits it', go('share')], ['shield', 'Plan backup', 'For when they’re sick or away', go('backup')]] },
    family: { lead: 'Someone who already knows Maya. Talk it through a few weeks before you start.',
      good: [['heart', 'Want someone who loves {o}'], ['clock', 'Need flexible timing'], ['coin', 'Need to keep costs down']],
      mind: [['chat', 'Agree on the hours', 'And that either of you can say if it isn’t working']] }
  };


  /* ---------- one place or person: tick the good answers, add notes, Save ---------- */
  function candidatePage(k, id) {
    const t = TYPES[k], h = H(), list = shortlist(), mine = list[k] || [], c = mine.find(x => x.id === id) || { id: 'new', name: '', contact: '', checks: [], notes: '' };
    const noun = t.who === 'place' ? 'place' : 'person', isNew = c.id === 'new';
    // Same steps as the page, one at a time. Every box stays in the page, so Save keeps ticks from all steps.
    const Qs = questions(k), gnames = [...new Set(Qs.map(x => x.g))];
    const ctabs = gnames.length > 1 ? `<div class="cc-tabs" role="tablist">${gnames.map((g, i) => `<button type="button" role="tab" aria-selected="${!i}" class="${i ? '' : 'is-on'}" onclick="ccCandStep(${i})"><i>${i + 1}</i>${F(TAB[g] || g)}</button>`).join('')}</div>` : '';
    const checks = ctabs + gnames.map((g, i) => `<div class="cc-cstep" data-step="${i}"${i ? ' hidden' : ''}>${Qs.filter(x => x.g === g).map(x => `<label class="cc-check"><input type="checkbox" data-k="${x.key}" ${(c.checks || []).includes(x.key) ? 'checked' : ''}><span><b>${x.own ? esc3(x.q) : F(x.q)}</b>${x.a || x.own ? `<small>${F(hint(x))}</small>` : ''}</span></label>`).join('')}</div>`).join('');
    // Round 10 (review feedback): after a call or visit, three quick notes are what help when comparing later. The
    // full checklist is still there, folded away.
    const done = (c.checks || []).filter(x => Qs.some(y => y.key === x)).length;
    const note = (id, label, ph, v) => `<label class="cc-field"><span>${F(label)}</span><textarea id="${id}" class="cc-notes" rows="2" placeholder="${esc3(ph)}">${esc3(v)}</textarea></label>`;
    return sub(k, t.name, isNew ? `Add a ${noun}` : esc3(c.name), isNew ? 'Notes on each one make comparing easy later.' : '',
      `<section class="hub-card cc-form"><label class="cc-field"><span>${F(t.who === 'place' ? 'Name of the place' : 'Their name')}</span><input id="ccName" value="${esc3(c.name)}" placeholder="${esc3(t.who === 'place' ? 'For example, Little Oaks' : 'For example, Sam')}" autocomplete="off"></label>
        <label class="cc-field"><span>${F('Phone or email (optional)')}</span><input id="ccContact" value="${esc3(c.contact)}" autocomplete="off"></label></section>`
      + `<h2 class="hub-h2">${F('After your call or visit')}</h2><section class="hub-card cc-form">`
      + note('ccLiked', 'What stood out', t.who === 'place' ? 'For example, calm room, teachers on the floor' : 'For example, got right down to ' + (typeof name === 'function' ? name() : 'the baby') + '’s level', c.liked != null ? c.liked : c.notes)
      + note('ccWorry', 'Anything that worried you', 'For example, a TV on in the background', c.worry)
      + note('ccConfirm', 'Still to confirm', 'For example, the sick-day policy, in writing', c.confirm) + `</section>`
      + `<details class="hub-card cc-more cc-fullcheck"${done ? ' open' : ''}><summary><span>${hubArt('notepad', CAT)}</span><div><b>${F('The full checklist')}</b><small>${F(`${done} of ${Qs.length} ticked. Optional`)}</small></div></summary><div class="cc-checkwrap">${checks.replace(/(<div class="cc-cstep")/, '<section class="cc-checks">$1').replace(/$/, '</section>')}</div></details>`
      + `<label class="cc-check cc-chosen hub-card"><input type="checkbox" id="ccChosen" ${c.chosen ? 'checked' : ''}><span><b>${F(t.talk ? 'They’re helping' : 'We chose this one')}</b><small>${F(k === 'sitter' ? 'Saved as your sitter, with the care card ready to share' : 'Moves you on to getting ready for day one')}</small></span></label>`
      + `<div class="cc-actions"><button class="hub-button cc-next2" onclick="ccSaveCand('${k}','${c.id}')">${F('Save')}</button>${isNew ? '' : `<button class="cc-remove" onclick="ccRemoveCand('${k}','${c.id}')">${F('Remove from shortlist')}</button>`}</div>`, t.icon);
  }
  window.ccCandStep = i => { document.querySelectorAll('.cc-checkwrap .cc-tabs button').forEach((b, j) => { b.classList.toggle('is-on', j === i); b.setAttribute('aria-selected', j === i); }); document.querySelectorAll('.cc-cstep').forEach((d, j) => { d.hidden = j !== i; }); };
  // The care a family picked most recently ("We chose this one"), so Get ready can speak to it.
  const chosenNow = () => { const list = shortlist(); let best = null;
    Object.keys(list).forEach(k => (list[k] || []).forEach(c => { if (c.chosen && (!best || Number(c.id) > Number(best.c.id))) best = { k, c }; }));
    return best; };
  window.ccChosenNow = chosenNow;
  window.ccSaveCand = function (k, id) {
    const list = shortlist(), mine = list[k] = list[k] || [];
    const v = s => (document.getElementById(s) || {}).value || '';
    const checks = [...document.querySelectorAll('.cc-checks input:checked')].map(x => x.dataset.k);
    const rec = { id: id === 'new' ? String(Date.now()) : id, name: v('ccName').trim() || 'Unnamed', contact: v('ccContact').trim(), checks, liked: v('ccLiked').trim(), worry: v('ccWorry').trim(), confirm: v('ccConfirm').trim(), notes: '', chosen: !!(document.getElementById('ccChosen') || {}).checked };
    if (rec.chosen) { const o = load('ahead-childcare-stage', null); if (typeof o === 'number' && o < 1) save('ahead-childcare-stage', 1); }   // a pick moves Childcare on
    const i = mine.findIndex(x => x.id === rec.id), was = i >= 0 && mine[i].chosen; if (i >= 0) mine[i] = rec; else mine.push(rec);
    save('ahead-childcare-shortlist', list);
    // Just picked? Go straight to getting ready, so it isn't buried at the bottom of the shortlist.
    if (rec.chosen && !was) { save('ahead-childcare-justchose', rec.id); openPage(`chg:${CAT}:d:ready`); return; }
    openPage(`chg:${CAT}:d:${k}`);
  };
  window.ccRemoveCand = function (k, id) {
    const list = shortlist(); list[k] = (list[k] || []).filter(x => x.id !== id); save('ahead-childcare-shortlist', list);
    openPage(`chg:${CAT}:d:${k}`);
  };

  /* ---------- the care card: mostly taps, then Save, then Share ---------- */
  const OPT = {
    milk: ['Breast milk', 'Formula', 'Both'],
    often: ['Every 2–3 hours', 'Every 3–4 hours', 'A few times a day', 'When hungry'],
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
  const input = (k, label, c, type = 'text') => `<label class="cc-field"><span>${F(label)}</span><input type="${type}" ${type === 'tel' ? 'inputmode="tel" onblur="ccPhoneCheck(this)"' : ''} value="${esc3(c[k])}" oninput="ccText('${k}', this.value)" autocomplete="off">${type === 'tel' ? `<small class="cc-field-warn" hidden>${F('That doesn’t look like a phone number.')}</small>` : ''}</label>`;
  window.ccPhoneCheck = el => { const w = el.parentElement.querySelector('.cc-field-warn'); if (w) w.hidden = !el.value || /^[\d\s()+.\-]{7,}$/.test(el.value.trim()); };
  // What the caregiver sees, in plain sentences.
  function cardLines(c) {
    const P = babyPronouns(), L = [];
    const feed = [c.milk, c.often && c.often.toLowerCase(), c.oz && `about ${c.oz} a bottle`].filter(Boolean).join(', ');
    if (feed) L.push(['Feeding', feed + (c.solids && c.solids !== 'Not yet' ? `. Solids: ${c.solids.toLowerCase()}` : '')]);
    const sleep = [c.naps && `${c.naps} nap${c.naps === '1' ? '' : 's'} a day`, (c.asleep || []).length && `falls asleep with ${(c.asleep || []).map(x => x === 'On their own' ? `nothing, on ${P.p} own` : x.toLowerCase()).join(', ')}`].filter(Boolean).join(', ');
    if (sleep) L.push(['Sleep', sleep.charAt(0).toUpperCase() + sleep.slice(1)]);
    const times = (c.napTimes || []).slice(0, c.naps === '4 or more' ? 4 : Number(c.naps) || 0).filter(Boolean).map(clock);
    if (times.length) L.push(['Nap times', times.join(', ')]);
    if (c.bedtime) L.push(['Bedtime', clock(c.bedtime)]);
    if ((c.calm || []).length) L.push(['What helps', c.calm.map((x, i) => i ? x.toLowerCase() : x).join(', ')]);
    if (c.allergy) L.push(['Allergies and medicines', c.allergy === 'Yes' ? (c.allergyText || 'Yes, ask us') : 'None known']);
    if (c.pName || c.pPhone) L.push(['Parent', [c.pName, c.pPhone].filter(Boolean).join(' · ')]);
    if (c.docName || c.docPhone) L.push(['Pediatrician', [c.docName, c.docPhone].filter(Boolean).join(' · ')]);
    [[c.c1Name, c.c1Phone], [c.c2Name, c.c2Phone]].filter(([n, p]) => n || p).forEach(([n, p], i) => L.push([i ? 'Or' : 'Backup', [n, p].filter(Boolean).join(' · ')]));
    if (c.other) L.push(['Also', c.other]);
    return L;
  }
  const ALWAYS = () => `${name()} sleeps on ${babyPronouns().p} back, in a crib with nothing else in it, even for naps.`;
  // Round 10 (review feedback): the card first, in four sections a caregiver would look for. Each section shows what
  // it says now; tapping it opens just that section to edit. Optional details stay folded. Only facts the parent has
  // already told the app are filled in (milk), never guesses.
  let cardEdit = null;
  window.ccCardEdit = k => { cardEdit = cardEdit === k ? null : k; rerender(); };
  const CARD_SECS = [
    ['feed', 'bottle', 'Feeding', 'Milk, bottles and meals'],
    ['sleep', 'moon', 'Sleep', 'Naps and settling'],
    ['calm', 'heart', 'What comforts {o}', 'How to help when {s’s} upset'],
    ['who', 'steth', 'Contacts and health', 'Who to call, and allergies']
  ];
  // A good daily update, as an example (Care started).
  const dailyUpdate = m => `<h2 class="hub-h2">${F('A good daily update')}</h2><p class="cc-h2sub">${F('Ask your caregiver what Maya’s day looked like.')}</p>`
    + `<section class="hub-card cc-update"><header><span>${hubArt('chat', CAT)}</span><div><b>${F('Today with Maya')}</b><small>${F('Example update')}</small></div></header><dl>`
    + [['bottle', 'Feeds', m >= 7 ? 'Two bottles and lunch, ate well' : 'Three bottles, fed comfortably'], ['moon', 'Naps', m >= 9 ? 'A morning nap and an afternoon nap' : 'Two naps, one shorter than usual'], ['smile', 'How {s} settled', 'Upset at drop-off, then enjoyed floor play']]
        .map(([i, t, d]) => `<div><dt>${hubArt(i, CAT)}${F(t)}</dt><dd>${F(d)}</dd></div>`).join('') + `</dl></section>`;
  function secSummary(k, c) {
    const P = babyPronouns();
    if (k === 'feed') return [c.milk === 'Both' ? 'Nursing and formula' : c.milk, c.often && c.often.toLowerCase(), c.milk && c.milk !== 'Breast milk' || c.oz ? c.oz && `about ${c.oz} a bottle` : null, c.solids && c.solids !== 'Not yet' && `solids: ${c.solids.toLowerCase()}`].filter(Boolean).join(', ');
    if (k === 'sleep') { const n = c.naps === '4 or more' ? 4 : Number(c.naps) || 0, t = (c.napTimes || []).slice(0, n).filter(Boolean).map(clock);
      return [c.naps && `${c.naps} nap${c.naps === '1' ? '' : 's'} a day${t.length ? ` (${t.join(', ')})` : ''}`, c.bedtime && `bedtime ${clock(c.bedtime)}`, (c.asleep || []).length && `falls asleep with ${(c.asleep || []).map(x => x === 'On their own' ? `nothing, on ${P.p} own` : x.toLowerCase()).join(', ')}`].filter(Boolean).join(', '); }
    if (k === 'calm') return (c.calm || []).map((x, i) => i ? x.toLowerCase() : x).join(', ');
    return [c.pName || c.pPhone ? `You: ${[c.pName, c.pPhone].filter(Boolean).join(' ')}` : '', c.c1Name || c.c1Phone ? `Backup: ${[c.c1Name, c.c1Phone].filter(Boolean).join(' ')}` : '', c.docName ? `Pediatrician: ${c.docName}` : '', c.allergy ? `Allergies: ${c.allergy === 'Yes' ? (c.allergyText || 'yes') : 'none known'}` : ''].filter(Boolean).join(' · ');
  }
  const more = (label, inner, open) => `<details class="cc-opt"${open ? ' open' : ''}><summary>${F(label)}</summary>${inner}</details>`;
  function secEdit(k, c) {
    if (k === 'feed') return chips('milk', false, c) + `<p class="cc-q-label">${F('How often')}</p>` + chips('often', false, c)
      + (c.milk && c.milk !== 'Breast milk' || c.milk === 'Breast milk' ? `<p class="cc-q-label">${F('Per bottle')}</p>` + chips('oz', false, c) : '')
      + (typeof actualMonth === 'function' && actualMonth() >= 5 ? `<p class="cc-q-label">${F('Solids')}</p>` + chips('solids', false, c) : '');
    if (k === 'sleep') { const n = c.naps === '4 or more' ? 4 : Number(c.naps) || 0;
      return `<p class="cc-q-label">${F('Naps a day')}</p>` + chips('naps', false, c) + `<p class="cc-q-label">${F('Falls asleep with')}</p>` + chips('asleep', true, c)
        + more('Add nap times and bedtime (optional)', `<div class="cc-times cc-nap-times">${[0, 1, 2, 3].map(i => `<label class="${i < n ? '' : 'is-off'}"><span>${F(['First', 'Second', 'Third', 'Fourth'][i])}</span><input type="time" value="${esc3((c.napTimes || [])[i])}" onchange="ccNapTime(${i}, this.value)" ${i < n ? '' : 'disabled tabindex="-1"'}></label>`).join('')}</div><div class="cc-times"><label><span>${F('Bedtime')}</span><input type="time" value="${esc3(c.bedtime)}" onchange="ccText('bedtime', this.value)"></label></div>`, c.bedtime || (c.napTimes || []).some(Boolean)); }
    if (k === 'calm') return chips('calm', true, c) + more('Add a note (optional)', `<input class="cc-other" value="${esc3(c.other)}" oninput="ccText('other', this.value)" placeholder="${esc3('For example, likes being sung to')}" autocomplete="off">`, !!c.other);
    return input('pName', 'Your name', c) + input('pPhone', 'Your phone', c, 'tel') + input('c1Name', 'Backup person', c) + input('c1Phone', 'Their phone', c, 'tel')
      + `<p class="cc-q-label">${F('Allergies or medicines')}</p>` + chips('allergy', false, c) + (c.allergy === 'Yes' ? input('allergyText', 'Which ones', c) : '')
      + more('Add a pediatrician and a second backup (optional)', input('docName', 'Pediatrician', c) + input('docPhone', 'Pediatrician’s phone', c, 'tel') + input('c2Name', 'Second backup', c) + input('c2Phone', 'Their phone', c, 'tel'), !!(c.docName || c.docPhone || c.c2Name));
  }
  function cardPage() {
    const h = H(), c = card(), nm = name();
    if (c.saved) {
      // Preview: exactly what the caregiver gets.
      return sub('card', 'Care card', 'Preview for a caregiver', 'This is exactly what they’ll get.',
        `<div class="acc cc-preview">${window.aheadCareCard ? aheadCareCard(cardData(), true) : ''}</div>`
        + (c.pPhone || c.c1Phone ? '' : `<button class="cc-nudge" onclick="ccCardMode('edit');ccCardEdit('who')"><b>${F('Add who to call first')}</b><span>${F('So the caregiver can reach you, or your backup.')} ›</span></button>`)
        + (c.pPhone || c.c1Phone ? `<button class="hub-button cc-next2" onclick="ccShare()">${F('Send the card')}</button>` : '') + `<p class="cc-done" id="ccDone" hidden></p>`
        + `<button class="hub-link cc-quizlink" onclick="ccCardMode('edit')">${F('Back to editing')}</button>`
        + `<p class="cc-privacy">${F('It sends as a link that opens this card. Anyone with the link can open it, so send it only to people caring for {o}.')}</p>`, 'notepad');
    }
    const secs = CARD_SECS.map(([k, icon, t, d]) => { const sum = secSummary(k, c), open = cardEdit === k;
      return `<section class="hub-card cc-csec${open ? ' is-open' : ''}"><button class="cc-csec-head" onclick="ccCardEdit('${k}')" aria-expanded="${open}"><span>${hubArt(icon, CAT)}</span><div><b>${F(t)}</b><small class="${sum ? 'is-set' : ''}">${sum ? esc3(sum) : F(d)}</small></div><em>${F(open ? 'Done' : sum ? 'Edit' : 'Add')}</em></button>${open ? `<div class="cc-csec-body">${secEdit(k, c)}</div>` : ''}</section>`; }).join('');
    const filled = CARD_SECS.filter(([k]) => secSummary(k, c)).length;
    return sub('card', 'Care card', `${nm}’s care card`, 'Everything a caregiver needs, in one place.',
      `<p class="cc-h2sub">${F(`${filled} of 4 filled in. Change it anytime.`)}</p>` + secs
      + `<p class="cc-always"><b>${F('Always included')}</b>${F(ALWAYS())}</p>`
      + `<button class="hub-button cc-next2" onclick="ccCardMode('view')">${F('Preview for a caregiver')} →</button>`
      + `<p class="cc-h2sub cc-center">${F('See exactly what they’ll get before you send it.')}</p>`, 'notepad');
  }
  // The card page (card.html) still opens a card for the preview; sharing no longer puts the details in a link.
  // The card page next to this app (so a preview shares its own card page). Opened from a file, fall back to the live one.
  const CARD_URL = typeof location !== 'undefined' && location.protocol.startsWith('http') ? new URL('card.html', location.href).href.split('?')[0] : 'https://yardenwalla.github.io/ahead-prototype/card.html';
  const cardData = function () {
    const c = card(), P = babyPronouns(), n = c.naps === '4 or more' ? 4 : Number(c.naps) || 0;
    const low = (a, own) => (a || []).map((x, i) => x === 'On their own' ? own : i ? x.toLowerCase() : x);
    const data = { n: name(), s: P.s, o: P.o, p: P.p, d: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      milk: c.milk, often: c.often, oz: c.milk ? c.oz : null, solids: c.solids, naps: c.naps,
      times: (c.napTimes || []).slice(0, n).filter(Boolean).map(clock), bed: clock(c.bedtime), asleep: low(c.asleep, `On ${P.p} own`), calm: low(c.calm),
      allergy: c.allergy ? (c.allergy === 'Yes' ? (c.allergyText || 'Yes, please ask us') : 'None known') : null, other: c.other,
      par: (c.pName || c.pPhone) ? [c.pName, c.pPhone] : null, c: [[c.c1Name, c.c1Phone], [c.c2Name, c.c2Phone]], doc: [c.docName, c.docPhone], a: ALWAYS() };
    Object.keys(data).forEach(k => { if (data[k] == null || data[k] === '' || (Array.isArray(data[k]) && !data[k].length)) delete data[k]; });
    return data;
  };
  window.ccCardLink = function () {
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(cardData())))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${CARD_URL}?c=${b64}`;
  };
  // The same card as plain text: what a caregiver needs at a glance.
  window.ccCardText = function () {
    const d = cardData(), L = [];
    const nap = d.naps ? `${d.naps === '4 or more' ? '4 or more' : d.naps} nap${d.naps === '1' ? '' : 's'} a day${d.times ? ` (${d.times.join(', ')})` : ''}` : '';
    L.push(`${d.n}’s care card`);
    if (d.milk) L.push(`Feeding: ${[d.milk, d.often && d.often.toLowerCase(), d.oz].filter(Boolean).join(', ')}${d.solids ? `. Solids: ${d.solids.toLowerCase()}` : ''}`);
    if (nap || d.bed) L.push(`Sleep: ${[nap, d.bed && `bedtime ${d.bed}`].filter(Boolean).join(', ')}`);
    if (d.asleep) L.push(`Falls asleep with: ${d.asleep.join(', ').toLowerCase()}`);
    if (d.calm) L.push(`If upset, try: ${d.calm.join(', ').toLowerCase()}`);
    if (d.allergy) L.push(`Allergies: ${d.allergy}`);
    if (d.other) L.push(d.other);
    if (d.par) L.push(`Parent: ${d.par.filter(Boolean).join(' ')}`);
    const calls = (d.c || []).filter(x => x && (x[0] || x[1])).map(x => x.filter(Boolean).join(' '));
    if (calls.length) L.push(`Backup: ${calls.join(' · ')}`);
    if (d.doc && (d.doc[0] || d.doc[1])) L.push(`Pediatrician: ${d.doc.filter(Boolean).join(' ')}`);
    if (d.a) L.push(d.a);
    L.push('', `Full card: ${ccCardLink()}`);
    return L.join('\n');
  };
  // Yarden prefers the link that opens the designed card. The page now says plainly who can open it.
  window.ccShare = async function () {
    const url = ccCardLink(), done = document.getElementById('ccDone');
    // If the phone's share sheet or the clipboard says no, show the link with its own Copy button, so there's always a way to send it.
    const fallback = () => { if (!done) return; done.hidden = false; done.innerHTML = `${F('Copy this link and paste it into a text or email.')}<span class="cc-link"><input readonly value="${esc3(url)}" onclick="this.select()" aria-label="Care card link"><button onclick="ccCopy(this)">${F('Copy')}</button></span>`; };
    const data = { title: `${name()}’s care card`, url };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try { await navigator.share(data); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url); if (done) { done.textContent = F('Link copied. Paste it into a text or email.'); done.hidden = false; } if (typeof hubToast === 'function') hubToast('Link copied', 'Paste it into a text or email.'); } catch (e) { fallback(); }
  };
  window.ccCopy = async function (btn) {
    const input = btn.previousElementSibling; input.select(); input.setSelectionRange(0, 99999);
    let ok = false; try { await navigator.clipboard.writeText(input.value); ok = true; } catch (e) { try { ok = document.execCommand('copy'); } catch (e2) {} }
    btn.textContent = ok ? 'Copied' : 'Select and copy';
    if (ok && typeof hubToast === 'function') hubToast('Link copied', 'Paste it into a text or email.');
  };

  /* ---------- routes ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a] = p.split(':');
    if (cat === CAT && screen === 's') return childcare();
    if (cat === CAT && screen === 'd') {
      if (a === 'card') return cardPage();
      const j = journey(a); if (j) return j;
      if (TYPES[a]) return typePage(a);
      const hp = /^hire-(\w+)$/.exec(a || ''); if (hp && PLAN_T[hp[1]]) return planPage(hp[1]);
      const m = /^cand-(\w+)-(\w+)$/.exec(a || ''); if (m && TYPES[m[1]]) return candidatePage(m[1], m[2]);
    }
    return baseRoute(p);
  };
})();
