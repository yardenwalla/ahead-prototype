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
  function sub(key, context, title, lead, inner) {
    const c = PAL[key] || PAL.plan;
    return `<div class="quiet-category hub-page hub-detail" data-overview="${CAT}" data-ss="1" data-cc-page="${key}" style="${yearTheme(CAT)};--ss-bg:${c[0]};--ss-ink:${c[1]};--year-bg:${c[0]};--year-pale:${c[0]};--year-ink:${c[1]}">${detailPageTop(CAT)}`
      + `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}"><span class="dev-area-head-art">${(SHAPE[key] || SHAPE.plan)(c)}</span><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`
      + inner + `</div>`;
  }
  // A row on the tab's home: a soft colored icon square, like Outings' gear rows.
  const homeRow = (key, icon, title, sub2, id) => { const c = PAL[key]; return `<button class="hub-row oa-row" style="--hl-bg:${c[0]};--hl-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:${id}')"><span class="oa-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(sub2)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`; };

  /* ---------- storage on this device ---------- */
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const esc3 = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rerender = () => { const y = scrollY; render(); scrollTo(0, y); };

  /* ---------- the five types of care ---------- */
  // Each item comes with what good looks like, because that's the part parents don't know. Sources: Child Care Aware of America checklists; HHS parent's guide; AAP.
  const TYPES = {
    center: { icon: 'blocks', name: 'Daycare center', short: 'Set hours, built-in backup', who: 'place',
      lead: 'A licensed center with trained teachers, where babies are cared for in a room with others their age.',
      good: 'You want set hours, backup staff when someone’s out, and other babies around.', mind: 'Babies tend to catch more colds in their first year of group care.',
      when: ['About 6 months ahead', 'Infant rooms often have waitlists, so join a few early. Less time than that? Your referral agency knows who has openings now.'],
      // Steps, in the order a parent meets them: a quick call, the tour (look, then ask three), and before signing.
      steps: [['Before you visit', 'check', 'A quick call, or a look online', [['Do you have a spot for a baby, and when?', 'Ask about the waitlist, and how often it moves.'], ['What are your hours and cost?', 'Including closed days and any extra fees.'], ['Are you licensed?', 'You can read their inspection reports on your state’s child care site.']]],
        ['On the tour: look for', 'look', 'You can see these for yourself', [['Babies sleeping on their backs, in bare cribs', 'No blankets, bumpers or toys.'], ['Enough grown-ups for the babies', 'Best is 3 babies per adult, and 6 in a room. Your state may allow a few more.'], ['Warm, unhurried caregivers', 'Talking to babies, and picking them up when they cry.'], ['A clean, calm room', 'A clean changing area, covered outlets and floor space to play.']]],
        ['On the tour: ask', 'ask', 'The three that tell you the most', [['How long have the baby-room teachers been here?', 'A year or more. Familiar faces matter most for babies.'], ['What happens if a baby isn’t tired at nap time, or wakes up early?', 'Never forced to sleep or left crying. Quiet play, then back down when sleepy.'], ['Walk me through a baby’s day.', 'Feeds and naps on each baby’s own schedule, floor time and outside every day, and no screens.']]],
        ['Before you sign', 'check', 'Easy to ask by email', [['Is everyone trained in infant CPR?', 'Yes, and it’s kept current.'], ['Has every staff member had a background check?', 'Yes, everyone.'], ['When does a sick child stay home?', 'A clear, written policy.'], ['How will I hear about my baby’s day?', 'A daily note on feeds, naps and diapers.'], ['Can I have it in writing?', 'Hours, fees, closed days, and how much notice either side gives.'], ['Are children and staff up to date on vaccines?', 'Yes, with a clear policy, and hand-washing before feeds and after changes.']]]] },
    home: { icon: 'home', name: 'Home daycare', short: 'A small group, often most affordable', who: 'place',
      lead: 'A provider cares for a small group of children in their own home, often a mix of ages.',
      good: 'You’d like a smaller group and a homey feel, often with more flexible hours.', mind: 'With one provider, you’ll need backup care when they’re sick or away.',
      when: ['About 3 months ahead', 'Good spots fill up, often through word of mouth.'],
      steps: [['Before you visit', 'check', 'A quick call, or a look online', [['Do you have a spot for a baby, and when?', 'Also ask how many babies they take.'], ['What are your hours and cost?', 'Including closed days and any extra fees.'], ['Are you licensed?', 'You can read their inspection reports on your state’s child care site.']]],
        ['On the tour: look for', 'look', 'You can see these for yourself', [['A safe place for babies to sleep', 'Their own crib, bare, away from older kids.'], ['Enough grown-ups for the babies', 'Best is no more than 2 babies per adult in a home daycare.'], ['A warm, unhurried caregiver', 'Talking to the children, and calm when one cries.'], ['A baby-safe home', 'Gates, covered outlets, and no smoke smell.']]],
        ['On the tour: ask', 'ask', 'The three that tell you the most', [['Who covers when you’re sick or on vacation?', 'A backup plan they can tell you about now.'], ['What happens if a baby isn’t tired at nap time, or wakes up early?', 'Never forced to sleep or left crying. Quiet play, then back down when sleepy.'], ['Walk me through a baby’s day.', 'Feeds and naps on the baby’s own schedule, floor time, outside, and no TV.']]],
        ['Before you sign', 'check', 'Easy to ask by email', [['Are you trained in infant CPR?', 'Yes, and it’s kept current.'], ['Has every adult in the home had a background check?', 'Yes, everyone over 18.'], ['Are there pets, a pool or guns in the home?', 'Pets kept apart, any pool fenced, any guns locked and unloaded.'], ['When does a sick child stay home?', 'A clear, written policy.'], ['Can I have it in writing?', 'Hours, fees, closed days, and how much notice either side gives.'], ['Are children and staff up to date on vaccines?', 'Yes, with a clear policy, and hand-washing before feeds and after changes.']]]] },
    nanny: { icon: 'hand', name: 'Nanny or nanny share', short: 'One-on-one at home. Sharing costs less', who: 'person',
      lead: 'A caregiver who looks after your baby at home. In a nanny share, two families split one nanny.',
      good: 'You want one-on-one care at home, on a schedule that fits yours.', mind: 'You’re usually their employer, with taxes to handle. And you’ll need backup when they’re sick or away.',
      when: ['About 3 months ahead', 'That leaves time for interviews, references and a paid trial day.'],
      steps: [['Before you meet', 'check', 'A short phone call. Listen for:', [['Which days and hours can you work?', 'A clear answer that matches what you need.'], ['What pay are you looking for?', 'So you both know it fits before you meet.'], ['How long have you cared for babies under 1?', 'Real experience with babies this young.']]],
        ['At the interview: watch for', 'look', 'Have Maya there if you can', [['How they are with Maya', 'They get down to {p} level, talk and smile.'], ['Phone away, full attention', 'On Maya, and on you.']]],
        ['At the interview: ask', 'ask', 'The three that tell you the most', [['What would a day with Maya look like?', 'Naps and feeds by {p} cues, time outside, books, and no screens.'], ['How do you put a baby down to sleep?', 'On the back, in a crib with nothing else in it.'], ['What would you do if Maya wouldn’t stop crying?', 'Calm, practical steps, and a call to you if worried. Never shaking.']]],
        ['Before you hire', 'check', 'Worth doing every time', [['Call two families they’ve worked for', 'Ask what they loved, and anything they’d change.'], ['A background check', 'Most nanny agencies and sites can run one.'], ['Infant CPR', 'Current, or a class before they start.'], ['A paid trial day', 'While you’re home, to see how it feels.'], ['A written agreement', 'Hours, pay, paid days off, sick days, and how much notice either of you gives.']]]] },
    family: { icon: 'heart', name: 'Family or friends', short: 'Flexible, and someone you trust', who: 'person', talk: true,
      lead: 'A grandparent, relative or friend looks after your baby, at your home or theirs.',
      good: 'You’d like someone who already loves Maya, with flexible timing.', mind: 'Some safety advice is new since they had babies. Talk it through early and kindly.',
      when: ['A few weeks ahead', 'Enough time to talk through the routine and do a practice day together.'],
      steps: [['Talk it through', 'talk', 'Kindly, before the first day', [['Back to sleep, in a bare crib, even for naps', 'No blankets, bumpers or tummy sleeping. The biggest change since they had babies.'], ['The car seat, every ride', 'Rear-facing and buckled snugly, even for short trips.'], ['The day: naps, bedtime and feeds', 'Share {p} care card, so you both follow the same routine.'], ['Crying can wear anyone down', 'Put Maya down somewhere safe and take a minute. Never shake a baby.'], ['Infant CPR', 'A short class is worth it for anyone caring for {o} regularly.']]]] },
    sitter: { icon: 'moon', name: 'Babysitter', short: 'For a few hours', who: 'person',
      lead: 'Someone who watches your baby now and then. A few hours to yourself is good for your baby too.',
      good: 'You need a few hours of help, not regular care.', mind: 'Keep the first night short, and stay reachable.',
      when: ['A week or two ahead', 'Time for a short first visit while you’re at home, so everyone gets comfortable.'],
      steps: [['Before the sitter comes', 'check', 'A quick message or call. Listen for:', [['Have you looked after babies this young?', 'Yes, more than once.'], ['Are you trained in infant CPR?', 'Yes, ideally in the last 2 years.'], ['Can I call a family you’ve sat for?', 'Yes, gladly.']]],
        ['A first visit, while you’re home', 'look', 'An hour is enough', [['How they hold and talk to Maya', 'Calm, gentle and engaged.'], ['Show them sleep and the car seat', 'On the back in a bare crib, and buckled snugly.']]],
        ['On the visit: ask', 'ask', 'Before the sitter’s first time alone', [['What would you do in an emergency?', 'Call 911 first, then you.'], ['What would you do if Maya wouldn’t settle?', 'Hold, rock and soothe, and text you if it lasts.']]]] },
  };

  // Where to actually look, by type. Kinds of places only, never a named site or company.
  const WHERE = {
    center: [['book', 'Your state’s child care website', 'Every licensed center near you, with its inspection reports'], ['chat', 'Your local child care referral agency', 'It’s free, and they know who has openings'], ['heart', 'Other parents nearby', 'Neighborhood groups, and friends with older kids']],
    home: [['book', 'Your state’s child care website', 'Licensed home daycares near you, with inspection reports'], ['chat', 'Your local child care referral agency', 'It’s free, and they know who has openings'], ['heart', 'Other parents nearby', 'Ask who they used, and how they found them']],
    nanny: [['heart', 'Local parent groups', 'The most common way to find a nanny, or a family to share one'], ['notepad', 'A nanny agency', 'They find and screen candidates for you, for a fee'], ['eye', 'Caregiver websites', 'Lots of choice, and you do the checking yourself']],
    sitter: [['heart', 'Friends and other parents', 'Ask who they trust'], ['eye', 'Caregiver websites', 'Many list sitters near you'], ['blocks', 'Daycare teachers', 'Many babysit evenings. Check that their center is OK with it']]
  };

  /* ---------- the journey pages: the same layout as Outings ----------
     A plan in order ("Plan your …" timeline), what to send ("Pack for care"), "When things don't go to plan", "Good to know" (≤3). */
  const tl = (title, items, caption) => { const c = YEAR_PALETTES[CAT]; return `<figure class="hub-figure hub-daymarks oa-timeline" role="img" aria-label="${F(caption)}" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}"><b class="hub-fig-title">${F(title)}</b><ol class="hub-daymarks-list">${items.filter(Boolean).map(([when, icon, text]) => `<li><i>${hubArt(icon, CAT)}</i><time>${F(when)}</time><span>${F(text)}</span></li>`).join('')}</ol></figure>`; };
  const packCard = (title, sub, items) => `<section class="oa-extra cc-extra"><b>${F(title)}</b><small>${F(sub)}</small><ul>${items.filter(Boolean).map(([icon, t, x]) => `<li><span class="oa-extra-art">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b>${x ? `<small>${F(x)}</small>` : ''}</span></li>`).join('')}</ul></section>`;
  const picSteps = (heading, items, caption) => `<h2 class="hub-h2">${F(heading)}</h2>` + hubIconSteps(items.filter(Boolean), CAT, F(caption), false);
  const rows = (heading, items) => H().list(heading, items.filter(Boolean).map(([icon, title, sub, go]) => H().row({ icon, cat: CAT, title, sub, onclick: go })));
  const good = items => rows('Good to know', items.filter(Boolean).slice(0, 3));
  const go = id => `openPage('chg:${CAT}:d:${id}')`;
  const feedNow = () => (typeof profile !== 'undefined' && profile.feed) || 'Breast milk';

  // Setting up a backup is a to-do list, so it's a checklist you can tick, kept on this phone.
  const BACKUP = [['Name two backup people', 'Family, friends or a sitter you could call at short notice.', 'heart'], ['Ask work about backup care', 'Some jobs offer backup care days.', 'notepad'], ['Save their numbers', 'In your phone, and on the fridge.', 'moon']];
  window.ccBackupTick = i => { const on = load('ahead-childcare-backup', []); save('ahead-childcare-backup', on.includes(i) ? on.filter(x => x !== i) : on.concat(i)); rerender(); };
  const backupList = () => { const on = load('ahead-childcare-backup', []); return `<h2 class="hub-h2">${F('Set up your backup')}</h2>` + H().ticks(BACKUP, i => on.includes(i), i => `ccBackupTick(${i})`, CAT); };

  function journey(id) {
    const h = H(), m = typeof actualMonth === 'function' ? actualMonth() : 0, fd = feedNow(), bm = fd !== 'Formula', fm = fd !== 'Breast milk';
    if (id === 'plan') return sub('plan', 'Find care', 'Plan your care', 'Work back from the day you need care. Most families start looking sooner than they expect.',
      packCard('Before you look', 'Two things to settle first', [['clock', 'Your days and hours', 'Early and late ones too'], ['coin', 'A monthly budget', 'And any help from work or your state']])
      + tl('Your countdown', [
        ['6 months before', 'notepad', 'Join a few daycare waitlists.'],
        ['3 months before', 'home', 'Visit home daycares, or meet nannies.'],
        ['6–8 weeks before', 'shield', 'Decide, call references, sign up.'],
        ['2 weeks before', 'heart', 'Get ready for day one.']],
        'Six months before, join daycare waitlists. Three months before, visit home daycares or meet nannies. Six to eight weeks before, decide and sign up. Two weeks before, get ready for day one.')
      + H().note('Less time than this? That’s common. See below.')
      + picSteps('When things don’t go to plan', [
        ['clock', 'Short on time?', 'Your local child care referral agency is free and knows who has openings.'],
        ['moon', 'Hours outside 9 to 5', 'Ask home daycares and nannies about early or late hours.'],
        ['eye', 'Nothing feels right', 'Keep looking. Family or a sitter can fill the gap.']],
        'Starting soon: ask your referral agency who has openings. Odd hours: ask home daycares and nannies. Nothing right yet: keep looking, with family or a sitter in between.')
      + good([['steth', 'Born early?', 'Ask your pediatrician when, and what kind of care, makes sense for {o}.'], ['notepad', 'Waitlists move', 'Check in every month or so. Spots open up.'], ['blocks', 'A mix is common', 'Family two days and daycare three is a plan too.']])
      + `<button class="hub-button is-secondary cc-add" onclick="openPage('chg:${CAT}:d:fit')">${F('Next: Which care fits us?')} ›</button>`, 'notepad');

    if (id === 'pay') return sub('pay', 'Setting it up', 'Paying for care', 'Care is one of a family’s biggest monthly costs. There are more ways to pay less than most parents know.',
      picSteps('Ways to pay less', [
        ['coin', 'Help from your state', 'If you qualify. Your referral agency helps you apply.'],
        ['notepad', 'A pre-tax care account', 'Through many jobs. A new baby lets you join mid-year.'],
        ['shield', 'A tax credit', 'Takes part of what you pay off your taxes.'],
        ['home', 'Early Head Start', 'Free care, for families who qualify.']],
        'Help from your state, a pre-tax care account through work, a federal tax credit, and Early Head Start.')
      + rows('', [['hand', 'If you hire a nanny', 'You’re usually their employer, with taxes to pay. A nanny payroll service can handle them.']])
      + good([['eye', 'Prices vary a lot', 'A nanny usually costs most, then a daycare center, then a home daycare. Ask each place for the full cost, fees included.'], ['lock', 'Deposits', 'Many daycares ask for a deposit or a fee to hold a spot.'], ['heart', 'Paying family', 'Paying a relative may still count toward the tax credit. Ask a tax professional.']]), 'coin');

    if (id === 'ready') {
      // Personal to the care they chose: a place (daycare, home daycare), someone at your home (a nanny), or family.
      const ch = chosenNow(), kind = ch ? ch.k : '', who = ch ? esc3(ch.c.name) : '', place = kind === 'center' || kind === 'home', atHome = kind === 'nanny';
      const just = ch && load('ahead-childcare-justchose', '') === ch.c.id; if (just) save('ahead-childcare-justchose', '');
      const steps = place ? [
          ['3 weeks before', 'notepad', 'Send the enrollment forms and shot record.'],
          ['2 weeks before', 'heart', 'Fill in Maya’s care card, and name two backup people.'],
          ['The week before', 'clock', 'A short visit together, then a short day.'],
          ['The night before', 'bag', 'Pack and label everything.'],
          ['Day one', 'heart', 'A quick, warm goodbye.']]
        : atHome ? [
          ['3 weeks before', 'notepad', 'Agree on hours, pay and duties in writing.'],
          ['2 weeks before', 'heart', 'Fill in Maya’s care card, and name two backup people.'],
          ['The week before', 'clock', 'A paid trial day, with you at home.'],
          ['The night before', 'home', 'Leave the care card out, and stock bottles, diapers and clothes.'],
          ['Day one', 'heart', 'A quick, warm goodbye.']]
        : kind === 'family' ? [
          ['2 weeks before', 'chat', 'Talk through safe sleep, the car seat and the day’s rhythm.'],
          ['The week before', 'clock', 'A practice day together.'],
          ['The night before', 'bag', 'Pack and label everything, if it’s at their place.'],
          ['Day one', 'heart', 'A quick, warm goodbye.']]
        : [
          ['2 weeks before', 'notepad', 'Fill in Maya’s care card, and name two backup people.'],
          ['The week before', 'clock', 'A short visit together, then a short day.'],
          ['The night before', 'bag', 'Pack and label everything.'],
          ['Day one', 'heart', 'A quick, warm goodbye.']];
      const lead = atHome ? 'A paid trial day, with you at home, makes the real start easier for you all.' : kind === 'family' ? 'A practice day together makes the real start easier for everyone.' : 'A visit and a short practice day first make the real start easier for you both.';
      return sub('ready', 'Setting it up', who ? `Get ready for ${who}` : 'Get ready for day one', lead,
      (just ? `<div class="hub-card cc-chosen-note"><b>${F(`You chose ${who}.`)}</b><span>${F('Here’s how to get ready for day one.')}</span></div>` : '')
      + tl('Your countdown to day one', steps,
        steps.map(x => `${x[0]}: ${x[2]}`).join(' '))
      + careCardButton(load('ahead-carecard', {}))
      + packCard(atHome ? 'Set up at home' : 'Pack for care', atHome ? 'So the day runs without you' : 'Label everything with {p} name. Your caregiver may have a list too', [
        ['bottle', bm && fm ? 'Milk or formula for each feed, plus one extra' : bm ? 'Pumped milk for each feed, plus one extra' : 'Formula for each feed, plus one extra',
          (bm ? 'Bottles labeled with {p} name and the date, in a cooler bag' : 'With clean bottles, labeled with {p} name') + (m >= 6 ? '. Food too, if your caregiver doesn’t provide it' : '')],
        ['shirt', 'A spare outfit or two', 'For spills and blowouts'],
        ['diaper', 'Diapers, wipes and cream', atHome ? 'Where your nanny can find them' : 'If your caregiver asks for them']])
      + picSteps('When things don’t go to plan', [
        m < 9 ? ['bottle', 'Won’t take a bottle', 'Let the caregiver try, with you out of the room.'] : null,
        ['heart', 'Tears at drop-off', 'Keep goodbyes short. Ask for a text once {s’s} settled.'],
        ['clock', 'Running low', 'Ask for a text when ' + (bm && fm ? 'milk, formula or diapers' : bm ? 'milk or diapers' : 'formula or diapers') + ' run low.'],
        ['chat', 'Something feels off', 'Talk early. It’s OK to change care.']],
        'If the baby won’t take a bottle, let the caregiver try while you’re away. Keep goodbyes short. Ask to hear when every bottle is finished. If something feels off, talk early.')
      + good([['chat', 'Ask about feeds', 'How many feeds to expect, and how the caregiver warms bottles.']])
      + `<button class="hub-button is-secondary cc-add" onclick="ccStarted()">${F('Care has started? Next: Settle in')} ›</button>`, 'bag');
    }

    if (id === 'backup') return sub('backup', 'Setting it up', 'When care falls through', 'Every family has days when care doesn’t happen. A plan made now makes them easier.',
      backupList()
      + picSteps('When things don’t go to plan', [
        ['thermo', '{S’s} sick', 'Call your backup, or keep {o} home.'],
        ['home', 'The caregiver is sick', 'Call your backup, or a sitter you know.'],
        ['hand', 'Your nanny quits', 'Family or a sitter for now, then an agency.'],
        ['sun', 'Closed days', 'Plan holidays early: family, a sitter or time off.']],
        'When the baby is sick, take turns or call your backup. When the caregiver is sick, call a sitter. If a nanny quits, cover with family or a temporary nanny. Plan daycare holidays early.')
      + good([['blocks', 'Changing care', 'Overlap the old and new care for a few days if you can.']]), 'shield');

    if (id === 'share') return sub('nanny', 'Nanny or nanny share', 'Sharing a nanny', 'Two families split one nanny, for close to one-on-one care at a lower cost.',
      `<h2 class="hub-h2">${F('How to set it up')}</h2>` + hubIconSteps([
        ['heart', 'Find a family', 'Through local parent groups'],
        ['home', 'Agree the basics', 'Whose home, the hours and the split'],
        ['notepad', 'Hire together', 'Meet the nanny, and write it down']], CAT, F('Find a family through parent groups, agree whose home, the hours and the split, then meet the nanny together and write it down.'), true)
      + picSteps('When things don’t go to plan', [
        ['thermo', 'One child is sick', 'Agree up front whether the share goes ahead, and at whose home.'],
        ['hand', 'A family leaves', 'Agree how much notice each family gives, so the nanny isn’t left short.']],
        'Agree up front what happens when one baby is sick, and how much notice a family gives before leaving.')
      + good([['coin', 'Two employers', 'Each family pays its share, and its own taxes.'], ['clock', 'Schedules change', 'Check in every few months as naps and needs shift.']]), 'hand');

    if (id === 'fit') {
      const f = load('ahead-childcare-fit', {}), done = FIT_Q.every(([q]) => f[q]), top = done ? fitResults(f) : [];
      const qs = FIT_Q.map(([q, label, opts]) => `<section class="hub-card cc-sec"><b class="cc-sec-title">${F(label)}</b><div class="cc-chips">${opts.map(o => `<button class="cc-chip${f[q] === o ? ' is-on' : ''}" aria-pressed="${f[q] === o}" onclick="ccFit('${q}','${o.replace(/'/g, '\\\'')}')">${F(o)}</button>`).join('')}</div></section>`).join('');
      const res = done ? `<h2 class="hub-h2">${F('Worth looking at first')}</h2><div class="oa-places">${top.map(k => { const c = PAL[k === 'share' ? 'nanny' : k], nm = k === 'share' ? 'Nanny share' : TYPES[k].name; return `<button class="oa-place" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:${k}')"><span class="oa-place-art">${SHAPE[k === 'share' ? 'nanny' : k](c)}</span><b>${F(nm)}</b><small>${F(WHY[k])}</small></button>`; }).join('')}</div>` : '';
      return sub('fit', 'Kinds of care', 'Which care fits us?', 'Four quick taps. There’s no wrong answer, and many families end up with a mix.',
        qs + (res || `<p class="cc-lead cc-fit-wait">${F('Your matches show up here once you’ve answered all four.')}</p>`));
    }

    if (id === 'start') return sub('start', 'Once care starts', 'Settle in', 'The first months are about building trust, on both sides.',
      tl('Plan the first months', [
        ['The first week', 'clock', 'Short days, and a quick chat at pickup.'],
        ['After a month', 'chat', 'A proper check-in about what’s working.'],
        ['Every few months', 'notepad', 'Update Maya’s care card.'],
        ...(m >= 9 ? [['Around 12–18 months', 'home', 'Many centers move babies up to the toddler room. Ask for a few short visits first.']] : [])],
        'In the first week, short days and a chat at pickup. After a month, a proper check-in. Every few months, update the care card.' + (m >= 9 ? ' Around 12 to 18 months, many centers move babies up to the toddler room.' : ''))
      + rows('Each day', [
        ['bag', 'At drop-off', 'Say how the night went and when {s} last ate'],
        ['eye', 'At pickup', 'Look over the day’s notes: feeds, naps and diapers'],
        ['moon', 'Short naps at care?', 'An earlier bedtime that night helps']])
      + H().versus('Sick days: care or home?', ['Usually fine to go', 'A runny nose, if {s} {are|is} eating and playing as usual.'],
        ['Usually a day at home', m < 3 ? 'Any fever: call your pediatrician first. And after vomiting or diarrhea.' : 'Until 24 hours without a fever, and without fever medicine. And after vomiting or diarrhea.'])
      + H().note('Every place has its own sick policy. Ask for it in writing.')
      + `<h2 class="hub-h2">${F('Signs it’s going well')}</h2>` + H().tips(['{S} {seem|seems} settled at pickup, even if drop-off has tears.', 'The caregiver tells you about small problems, not just good news.', 'You can call or drop in anytime.'])
      + picSteps('When things don’t go to plan', [
        ['smile', 'Something small', 'Bring it up early and kindly.'],
        ['heart', 'Harder drop-offs', 'Common from 8 months. Keep goodbyes short and warm.'],
        ['shield', 'A real worry', 'Injuries or unsafe sleep: keep {o} home and speak up.']],
        'Bring small things up early. Harder drop-offs from around 8 months are common, so keep goodbyes short. For injuries or unsafe sleep, keep the baby home and speak up right away.')
      + good([['thermo', 'Lots of colds at first', 'Common in the first year of care. Line up backup care', go('backup')], ['book', 'A real worry at licensed care?', 'You can also report it on your state’s child care website'], (() => { const ch = typeof chosenNow === 'function' ? chosenNow() : null; return !ch || ch.k === 'nanny' ? ['hand', 'If you have a nanny', 'Agree on paid time off up front, and check in on pay once a year'] : null; })()]), 'heart');
    if (id === 'help') return sub('help', 'Kinds of care', 'Extra help at home', 'Help in the early months isn’t only for when you go back to work.',
      picSteps('Kinds of help', [
        ['heart', 'A postpartum doula', 'Feeding, rest and recovery in the first weeks.'],
        ['moon', 'Overnight help', 'A trained night nanny covers nights.'],
        ['home', 'Family and friends', 'Ask for one thing: a meal, laundry, an hour.'],
        ['clock', 'A sitter for a break', 'A few hours to rest or get out.', go('sitter')]],
        'A postpartum doula helps with feeding and recovery. Overnight help covers nights. Family and friends can help with specific tasks. A sitter gives you a break.')
      + rows('Where to look', [['smile', 'Other parents', 'Ask who helped them, and what it was like'], ['steth', 'Your hospital or pediatrician’s office', 'Many keep lists of local doulas and newborn care specialists'], ['eye', 'Doula directories and agencies', 'Search for postpartum doulas near you']])
      + good([['coin', 'Insurance may help', 'Some health plans and state Medicaid programs cover doula care. Ask yours.'], ['notepad', 'Book early', 'Doulas and overnight help often fill up, so ask a few weeks ahead.'], ['chat', 'Asking is OK', 'Most people want to help. They just need to know how.']]), 'heart');
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
    return `<div class="quiet-category hub-page" data-overview="${CAT}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${body}<p class="hub-foot">${F('Every family’s situation is different. Pick the care that fits yours.')}</p></div>`;
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
  window.ccStarted = () => { save('ahead-childcare-started', true); openPage(`chg:${CAT}:d:start`); };
  // The journey as one path: four steps, the current one picked out, so the home never has to list everything.
  const journeyStrip = () => { const now = stepNow(); return `<nav class="cc-path" aria-label="Your childcare plan">${STEPS.map(([id, label, hint], i) => `<button class="cc-path-step${id === now ? ' is-now' : ''}" onclick="openPage('chg:${CAT}:d:${id}')"${id === now ? ' aria-current="step"' : ''}>${id === now ? `<em>${F('You’re here')}</em>` : ''}<i>${i + 1}</i><b>${F(label)}</b><small>${F(hint)}</small></button>`).join('')}</nav>`; };

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
  const WHY = { center: 'Set hours, other babies, and built-in backup.', home: 'A smaller group, often the most affordable.', nanny: 'One-on-one, on your schedule.', share: 'Close to one-on-one, with the cost split.', family: 'Someone you trust, with flexible days.' };

  function careCardButton(card) {
    return `<button class="hub-rough-card cc-card-button" onclick="openPage('chg:${CAT}:d:card')"><span class="hub-rough-moon" aria-hidden="true">${hubArt('notepad', CAT)}</span><span class="hub-rough-copy"><b>${F(`${name()}’s care card`)}</b><small>${F(card.saved ? 'Ready to send to any caregiver' : 'Feeds, naps and who to call, ready to share')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  }
  function childcare() {
    const card = load('ahead-carecard', {}), list = shortlist(), n = NOW_CARD.plan, am = typeof actualMonth === 'function' ? actualMonth() : 0, fd0 = feedNow(), bm0 = fd0 !== 'Formula', fm0 = fd0 !== 'Breast milk';
    // The same shape as Outings: one card to start, the kinds of care as tiles, the care card, then one list
    // for setting care up, in the order you meet it. No step rail: the app can't know where a family is.
    let b = `<header class="hub-hero cc-hero"><p class="hub-eyebrow">${F('Find care')}</p><h1>${F(n[0])}</h1><p class="hub-lead">${F(n[1])}</p><button class="cc-hero-go" onclick="openPage('chg:${CAT}:d:plan')">${F(n[2])} ›</button></header>`;
    const kinds = [['center'], ['home'], ['nanny'], ['family'], ['sitter', 'For a night out, or a break'], ['help', am < 4 ? 'A doula or overnight help, early on' : 'A doula, night help or a sitter', 'Extra help at home']];
    b += `<h2 class="hub-h2">${F('What kind of care?')}</h2><div class="oa-places">${kinds.map(([k, short, title]) => { const t = TYPES[k] || {}, c = PAL[k], m = (list[k] || []).length;
      return `<button class="oa-place" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="openPage('chg:${CAT}:d:${k}')"><span class="oa-place-art">${SHAPE[k](c)}</span><b>${F(title || t.name)}</b><small>${F(m ? `${m} on your shortlist` : short || t.short)}</small></button>`; }).join('')}</div>`
      + `<button class="hub-link cc-quiz-link" onclick="openPage('chg:${CAT}:d:fit')">${F('Not sure which? Take the quick quiz')} ›</button>`;
    b += careCardButton(card);
    b += `<h2 class="hub-h2">${F('Setting it up')}</h2><div class="hub-list">`
      + homeRow('pay', 'coin', 'Paying for care', 'Help from your state, work and taxes', 'pay')
      + homeRow('ready', 'bag', 'Get ready for day one', `A practice day first, and packing ${bm0 && fm0 ? 'milk and formula' : bm0 ? 'pumped milk' : 'formula'}`, 'ready')
      + homeRow('backup', 'shield', 'When care falls through', 'Sick days, closed days, a caregiver who quits', 'backup')
      + homeRow('start', 'heart', 'Settle in', am >= 9 ? 'Each day, sick days and moving up a room' : am >= 7 ? 'Each day, sick days and harder goodbyes' : 'Each day, sick days and when to speak up', 'start') + `</div>`;
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
  const ICONS = [[/spot|waitlist/i, 'notepad'], [/hours|days/i, 'clock'], [/cost|pay/i, 'coin'], [/licens|inspection/i, 'shield'], [/sleep|crib/i, 'crib'], [/grown-up|babies per adult|2 babies/i, 'smile'], [/warm|caregiver|hold|how they are/i, 'heart'], [/clean|calm room/i, 'home'], [/baby-safe home|safe home/i, 'shield'], [/phone|attention/i, 'eye'], [/cpr/i, 'steth'], [/background/i, 'shield'], [/sick/i, 'thermo'], [/hear about|day\?/i, 'chat'], [/pets|pool|guns/i, 'home'], [/references|families|family you/i, 'chat'], [/trial/i, 'clock'], [/car seat/i, 'car'], [/babies this young|under 1/i, 'smile'], [/frustrat/i, 'heart'], [/feeds|naps, bedtime/i, 'bottle'], [/touch/i, 'chat']];
  const iconFor = q => (ICONS.find(([r]) => r.test(q)) || [0, 'star'])[1];
  const stepView = {};
  window.ccStep = (k, i) => { stepView[k] = i; rerender(); };
  window.ccFlip = el => el.classList.toggle('is-open');
  function stepsBlock(k, Q, t) {
    const groups = []; Q.forEach(x => { let g = groups.find(y => y.name === x.g); if (!g) groups.push(g = { name: x.g, kind: x.kind, sub: x.gs, items: [] }); g.items.push(x); });
    // Your own questions join the "ask" step.
    const yours = groups.find(g => g.name === 'Your questions'), askG = groups.find(g => g.kind === 'ask' && g !== yours);
    if (yours && askG) { askG.items.push(...yours.items); groups.splice(groups.indexOf(yours), 1); }
    const cur = Math.min(stepView[k] || 0, groups.length - 1), g = groups[cur];
    const tabs = groups.length > 1 ? `<div class="cc-tabs" role="tablist">${groups.map((x, i) => `<button role="tab" aria-selected="${i === cur}" class="${i === cur ? 'is-on' : ''}" onclick="ccStep('${k}',${i})"><i>${i + 1}</i>${F(TAB[x.name] || x.name)}</button>`).join('')}</div>` : '';
    // One step only (Family or friends): the page heading already names it, so just the short line under it.
    const head = groups.length > 1 ? `<div class="cc-stephead"><b>${F(g.name)}</b>${g.sub ? `<small>${F(g.sub)}</small>` : ''}</div>` : g.sub ? `<div class="cc-stephead"><small>${F(g.sub)}</small></div>` : '';
    let body = '';
    if (g.kind === 'look') body = `<div class="cc-look">${g.items.map(x => `<div class="cc-look-tile"><span>${hubArt(iconFor(x.q), CAT)}</span><b>${F(x.q)}</b><small>${F(x.a)}</small></div>`).join('')}</div>`;
    else if (g.kind === 'ask') body = `<div class="cc-asks">${g.items.map((x, i) => `<button class="cc-ask" onclick="ccFlip(this)"><em>${i + 1}</em><b>${x.own ? esc3(x.q) : F(x.q)}</b>${x.own ? `<small class="cc-own">${F('Your question')}</small>` : `<span class="cc-listen"><small>${F('Listen for')}</small>${F(x.a)}</span><small class="cc-tap">${F('What to listen for')} ›</small>`}</button>`).join('')}</div>`;
    else body = `<div class="cc-quick">${g.items.map(x => `<div class="cc-quick-row"><span>${hubArt(iconFor(x.q), CAT)}</span><div><b>${x.own ? esc3(x.q) : F(x.q)}</b>${x.a ? `<small>${F(x.a)}</small>` : ''}</div></div>`).join('')}</div>`;
    const nav = groups.length > 1 && cur < groups.length - 1 ? `<button class="cc-next" onclick="ccStep('${k}',${cur + 1})">${F('Next: ' + (TAB[groups[cur + 1].name] || groups[cur + 1].name))} ›</button>` : '';
    return `<section class="cc-steps">${tabs}${head}${body}${nav}</section>`;
  }

  /* ---------- one page per type, always in the same order ---------- */
  function typePage(k) {
    const t = TYPES[k], h = H(), mine = shortlist()[k] || [], noun = t.who === 'place' ? 'place' : 'person', Q = questions(k);
    const ed = false, changed = false;
    const qs = !ed ? stepsBlock(k, Q, t) : `<div class="cc-qs is-editing">${grouped(Q, x => `<div class="cc-q"><div><b>${x.own ? esc3(x.q) : F(x.q)}</b><small>${F(hint(x))}</small></div>${ed ? `<button class="cc-q-x" aria-label="Remove this question" onclick="ccQHide('${k}','${x.key}')">×</button>` : ''}</div>`)}`
      + (ed ? `<div class="cc-q-add"><input id="ccNewQ" placeholder="${esc3('Add your own question')}" autocomplete="off" onkeydown="if(event.key==='Enter')ccQAdd('${k}')"><button onclick="ccQAdd('${k}')">${F('Add')}</button></div>${changed ? `<button class="cc-q-reset" onclick="ccQReset('${k}')">${F('Bring back our questions')}</button>` : ''}` : '') + `</div>`;
    const shortRows = mine.map(c => h.row({ icon: t.icon, cat: CAT, title: esc3(c.name || 'Unnamed'), sub: c.chosen ? F(t.talk ? 'Helping' : 'Chosen') : `${(c.checks || []).filter(x => Q.some(y => y.key === x)).length} of ${Q.length} ${t.talk ? 'talked through' : 'checked'}${c.notes ? ' · has notes' : ''}`, onclick: `openPage('chg:${CAT}:d:cand-${k}-${c.id}')` }));
    return sub(k, 'Kinds of care', t.name, t.lead,
      `<section class="hub-card cc-fit"><div><b>${F('A good fit if')}</b><p>${F(t.good)}</p></div><div><b>${F('Keep in mind')}</b><p>${F(t.mind)}</p></div><div class="cc-when"><span class="cc-when-art">${hubArt('eye', CAT)}</span><div><small>${F(t.talk ? 'When to ask' : 'When to start looking')}</small><b>${F(t.when[0])}</b><p>${F(t.when[1])}</p></div></div></section>`
      + (k === 'center' && typeof profile !== 'undefined' && profile.early ? h.tip('Born early?', 'Ask your pediatrician when group care makes sense for {o}.') : '')
      + (WHERE[k] ? rows('Where to look', WHERE[k]) : '')
      + (k === 'family' ? rows('Before you agree', [['clock', 'The hours', 'Can they do your hours, week after week?'], ['chat', 'Speaking up', 'Could you tell them if you’d like something done differently?'], ['heart', 'A trial week', 'Try it first. It’s OK to say thank you, and choose something else.']]) : '')
      + (k === 'sitter' || k === 'family' ? careCardButton(load('ahead-carecard', {})) : '')
      + (k === 'nanny' ? rows('', [['hand', 'Sharing a nanny', 'Finding a family, and what to agree up front', go('share')]]) : '')
      + `<div class="cc-qhead"><h2 class="hub-h2">${F(t.talk ? 'Things to talk through' : t.who === 'place' ? 'Checking a place' : 'Finding the right person')}</h2></div>` + qs
      + `<h2 class="hub-h2">${F(t.talk ? 'Who’s helping' : 'Your shortlist')}</h2>`
      + (mine.length ? h.list('', shortRows) + (mine.some(c => c.chosen) ? rows('', [['bag', 'Get ready for day one', 'Easing in, and what to send', go('ready')]]) : '') : `<p class="cc-lead">${F(t.talk ? `Add each person who’ll help, and tick off what you’ve talked through.` : `Add each ${noun} you’re considering. The steps above become a checklist for each one, with space for notes.`)}</p>`)
      + `<button class="hub-button is-secondary cc-add" onclick="openPage('chg:${CAT}:d:cand-${k}-new')">＋ ${F(`Add a ${noun}`)}</button>`, t.icon);
  }

  /* ---------- one place or person: tick the good answers, add notes, Save ---------- */
  function candidatePage(k, id) {
    const t = TYPES[k], h = H(), list = shortlist(), mine = list[k] || [], c = mine.find(x => x.id === id) || { id: 'new', name: '', contact: '', checks: [], notes: '' };
    const noun = t.who === 'place' ? 'place' : 'person', isNew = c.id === 'new';
    // Same steps as the page, one at a time. Every box stays in the page, so Save keeps ticks from all steps.
    const Qs = questions(k), gnames = [...new Set(Qs.map(x => x.g))];
    const ctabs = gnames.length > 1 ? `<div class="cc-tabs" role="tablist">${gnames.map((g, i) => `<button type="button" role="tab" aria-selected="${!i}" class="${i ? '' : 'is-on'}" onclick="ccCandStep(${i})"><i>${i + 1}</i>${F(TAB[g] || g)}</button>`).join('')}</div>` : '';
    const checks = ctabs + gnames.map((g, i) => `<div class="cc-cstep" data-step="${i}"${i ? ' hidden' : ''}>${Qs.filter(x => x.g === g).map(x => `<label class="cc-check"><input type="checkbox" data-k="${x.key}" ${(c.checks || []).includes(x.key) ? 'checked' : ''}><span><b>${x.own ? esc3(x.q) : F(x.q)}</b>${x.a || x.own ? `<small>${F(hint(x))}</small>` : ''}</span></label>`).join('')}</div>`).join('');
    return sub(k, t.name, isNew ? `Add a ${noun}` : esc3(c.name), '',
      `<section class="hub-card cc-form"><label class="cc-field"><span>${F(t.who === 'place' ? 'Name of the place' : 'Their name')}</span><input id="ccName" value="${esc3(c.name)}" placeholder="${esc3(t.who === 'place' ? 'For example, Little Oaks' : 'For example, Sam')}" autocomplete="off"></label>
        <label class="cc-field"><span>${F('Phone or email (optional)')}</span><input id="ccContact" value="${esc3(c.contact)}" autocomplete="off"></label>
        <label class="cc-check cc-chosen"><input type="checkbox" id="ccChosen" ${c.chosen ? 'checked' : ''}><span><b>${F(t.talk ? 'They’re helping' : 'We chose this one')}</b></span></label></section>`
      + `<h2 class="hub-h2">${F(t.talk ? 'What you’ve talked through' : 'Your checklist')}</h2><p class="cc-lead">${F(t.talk ? 'Tick each one once you’ve talked it over.' : 'Tick each one as you go, where you liked what you saw or heard.')}</p><div class="cc-checkwrap">${checks.replace(/(<div class="cc-cstep")/, '<section class="hub-card cc-checks">$1').replace(/$/, '</section>')}</div>`
      + `<h2 class="hub-h2">${F('Notes')}</h2><textarea id="ccNotes" class="cc-notes" rows="4" placeholder="${esc3('What stood out, how it felt, anything to follow up…')}">${esc3(c.notes)}</textarea>`
      + `<div class="cc-actions"><button class="hub-button" onclick="ccSaveCand('${k}','${c.id}')">${F('Save')}</button>${isNew ? '' : `<button class="cc-remove" onclick="ccRemoveCand('${k}','${c.id}')">${F('Remove from shortlist')}</button>`}</div>`, t.icon);
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
    const rec = { id: id === 'new' ? String(Date.now()) : id, name: v('ccName').trim() || 'Unnamed', contact: v('ccContact').trim(), checks, notes: v('ccNotes').trim(), chosen: !!(document.getElementById('ccChosen') || {}).checked };
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
  const input = (k, label, c, type = 'text') => `<label class="cc-field"><span>${F(label)}</span><input type="${type}" value="${esc3(c[k])}" oninput="ccText('${k}', this.value)" autocomplete="off"></label>`;
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
    if (c.docName || c.docPhone) L.push(['Pediatrician', [c.docName, c.docPhone].filter(Boolean).join(' · ')]);
    [[c.c1Name, c.c1Phone], [c.c2Name, c.c2Phone]].filter(([n, p]) => n || p).forEach(([n, p], i) => L.push([i ? 'Or' : 'Call us', [n, p].filter(Boolean).join(' · ')]));
    if (c.other) L.push(['Also', c.other]);
    return L;
  }
  const ALWAYS = () => `${name()} sleeps on ${babyPronouns().p} back, in a crib with nothing else in it, even for naps.`;
  function cardPage() {
    const h = H(), c = card(), nm = name(), bottles = !!c.milk;
    if (c.saved) {
      const L = cardLines(c);
      // Saved, the card shows exactly as a caregiver will see it when you send it.
      return sub('card', 'Care card', `${nm}’s care card`, 'This is what a caregiver sees when you send it.',
        `<button class="hub-button cc-share" onclick="ccShare()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>${F('Share the card')}</button><button class="hub-link cc-edit" onclick="ccCardMode('edit')">${F('Edit the card')} ›</button><p class="cc-done" id="ccDone" hidden></p>`
        + `<div class="acc cc-preview">${window.aheadCareCard ? aheadCareCard(cardData(), true) : ''}</div>`
        + h.note('Sending it shares a link that opens as this card on their phone. Only people you send it to can see it.'), 'notepad');
    }
    const sec = (title, inner) => `<section class="hub-card cc-sec"><b class="cc-sec-title">${F(title)}</b>${inner}</section>`;
    return sub('card', 'Care card', `${nm}’s care card`, 'Tap what fits. It takes about a minute, and you can share it with any caregiver.',
      sec('Feeding', chips('milk', false, c) + `<p class="cc-q-label">${F('How often')}</p>` + chips('often', false, c) + (bottles ? `<p class="cc-q-label">${F('Per bottle')}</p>` + chips('oz', false, c) : '') + (typeof actualMonth === 'function' && actualMonth() >= 5 ? `<p class="cc-q-label">${F('Solids')}</p>` + chips('solids', false, c) : ''))
      + sec('Sleep', `<p class="cc-q-label">${F('Naps a day')}</p>` + chips('naps', false, c)
        + (c.naps ? `<p class="cc-q-label">${F('Usual nap times')}</p><div class="cc-times">${Array.from({ length: c.naps === '4 or more' ? 4 : Number(c.naps) }, (_, i) => `<label><span>${F(['First', 'Second', 'Third', 'Fourth'][i])}</span><input type="time" value="${esc3((c.napTimes || [])[i])}" onchange="ccNapTime(${i}, this.value)"></label>`).join('')}</div>` : '')
        + `<div class="cc-times"><label><span>${F('Bedtime')}</span><input type="time" value="${esc3(c.bedtime)}" onchange="ccText('bedtime', this.value)"></label></div>`
        + `<p class="cc-q-label">${F('Falls asleep with')}</p>` + chips('asleep', true, c))
      + sec('What helps when {s’s} upset', chips('calm', true, c))
      + sec('Allergies or medicines', chips('allergy', false, c) + (c.allergy === 'Yes' ? input('allergyText', 'Which ones', c) : ''))
      + sec('Who to call', input('c1Name', 'Name', c) + input('c1Phone', 'Phone', c, 'tel') + input('c2Name', 'Second person (optional)', c) + input('c2Phone', 'Phone', c, 'tel') + input('docName', 'Pediatrician', c) + input('docPhone', 'Pediatrician’s phone', c, 'tel'))
      + sec('Anything else (optional)', `<input class="cc-other" value="${esc3(c.other)}" oninput="ccText('other', this.value)" placeholder="${esc3('For example, likes being sung to')}" autocomplete="off">`)
      + `<p class="cc-always"><b>${F('Always included')}</b>${F(ALWAYS())}</p>`
      + `<div class="cc-actions"><button class="hub-button" onclick="ccCardMode('view')">${F('Save the card')}</button></div>`, 'notepad');
  }
  // Sharing sends one link that opens the whole card. The link carries the details itself (?c=…, which messaging apps keep);
  // the card page is a static file, so nothing is saved anywhere.
  // The card page next to this app (so a preview shares its own card page). Opened from a file, fall back to the live one.
  const CARD_URL = typeof location !== 'undefined' && location.protocol.startsWith('http') ? new URL('card.html', location.href).href.split('?')[0] : 'https://yardenwalla.github.io/ahead-prototype/card.html';
  const cardData = function () {
    const c = card(), P = babyPronouns(), n = c.naps === '4 or more' ? 4 : Number(c.naps) || 0;
    const low = (a, own) => (a || []).map((x, i) => x === 'On their own' ? own : i ? x.toLowerCase() : x);
    const data = { n: name(), s: P.s, o: P.o, p: P.p, d: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      milk: c.milk, often: c.often, oz: c.milk ? c.oz : null, solids: c.solids, naps: c.naps,
      times: (c.napTimes || []).slice(0, n).filter(Boolean).map(clock), bed: clock(c.bedtime), asleep: low(c.asleep, `On ${P.p} own`), calm: low(c.calm),
      allergy: c.allergy ? (c.allergy === 'Yes' ? (c.allergyText || 'Yes, please ask us') : 'None known') : null, other: c.other,
      c: [[c.c1Name, c.c1Phone], [c.c2Name, c.c2Phone]], doc: [c.docName, c.docPhone], a: ALWAYS() };
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
    const calls = (d.c || []).filter(x => x && (x[0] || x[1])).map(x => x.filter(Boolean).join(' '));
    if (calls.length) L.push(`Call: ${calls.join(' · ')}`);
    if (d.doc && (d.doc[0] || d.doc[1])) L.push(`Pediatrician: ${d.doc.filter(Boolean).join(' ')}`);
    if (d.a) L.push(d.a);
    L.push('', `Full card: ${ccCardLink()}`);
    return L.join('\n');
  };
  window.ccShare = async function () {
    const url = ccCardLink(), done = document.getElementById('ccDone');
    // If the phone's share sheet or the clipboard says no, show the link with its own Copy button, so there's always a way to send it.
    const fallback = () => { if (!done) return; done.hidden = false; done.innerHTML = `${F('Copy this link and paste it into a text or email.')}<span class="cc-link"><input readonly value="${esc3(url)}" onclick="this.select()" aria-label="Care card link"><button onclick="ccCopy(this)">${F('Copy')}</button></span>`; };
    const data = { title: `${name()}’s care card`, url };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try { await navigator.share(data); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url); if (done) { done.textContent = F('Link copied. Paste it into a text or email.'); done.hidden = false; } } catch (e) { fallback(); }
  };
  window.ccCopy = async function (btn) {
    const input = btn.previousElementSibling; input.select(); input.setSelectionRange(0, 99999);
    let ok = false; try { await navigator.clipboard.writeText(input.value); ok = true; } catch (e) { try { ok = document.execCommand('copy'); } catch (e2) {} }
    btn.textContent = ok ? 'Copied' : 'Select and copy';
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
      const m = /^cand-(\w+)-(\w+)$/.exec(a || ''); if (m && TYPES[m[1]]) return candidatePage(m[1], m[2]);
    }
    return baseRoute(p);
  };
})();
