/* Ahead · Childcare: finding care that fits, and handing over well.
   Parent's questions, in order: "What are my options?", "Is this one right for us, and how do I check a place or person?",
   "What does the caregiver need to know?". So: five types of care, one page each built the same way
   (good fit if / keep in mind · when to start looking · questions to ask · your notes), and a care card to share.
   No stages: childcare changes with your plans, not your baby's age. No prices, reviews or provider search.
   Sources: AAP (HealthyChildren.org) "Choosing Child Care", "Safe Sleep in Child Care"; Caring for Our Children ratios. */
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

  /* ---------- notes and the care card, kept on this device ---------- */
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const esc3 = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- the five types of care ---------- */
  // The safety basics every caregiver should meet, asked the same way everywhere (AAP).
  const SAFETY = ['Do babies always sleep on their backs, in a crib with nothing else in it?', 'Is everyone trained in infant CPR and first aid?', 'What happens if a baby gets sick or hurt?'];
  const TYPES = {
    center: { icon: 'blocks', name: 'Daycare center', short: 'Teachers and small groups by age',
      lead: 'A licensed center with trained teachers, where babies are cared for in a room with others their age.',
      good: 'You want set hours, backup staff when someone’s out, and other babies around.', mind: 'Babies catch more colds the first year. Centers close on holidays and have set pickup times.',
      when: ['Start looking early', 'Infant rooms often have waitlists of several months, so many families start during pregnancy.'],
      ask: ['How many babies does each teacher look after? (No more than 3 or 4 is best.)', 'Are you licensed? Can I see your latest inspection?', 'Can you follow our feeding plan, and store breast milk?', 'Can I drop in any time?', 'What’s your policy when a baby is sick?'] },
    home: { icon: 'home', name: 'Home daycare', short: 'A small group in a provider’s home',
      lead: 'A provider cares for a small group of children in their own home, often a mix of ages.',
      good: 'You’d like a smaller group and a homey feel, often with more flexible hours.', mind: 'With one provider, you’ll need backup care when they’re sick or away.',
      when: ['A few months ahead', 'Good spots fill up, so start about 3–6 months before you need care.'],
      ask: ['Are you licensed? Can I see your latest inspection?', 'How many children do you look after, and how many are babies?', 'Who covers when you’re sick or on vacation?', 'Where do babies nap, and can I see it?', 'Can I drop in any time?'] },
    nanny: { icon: 'hand', name: 'Nanny or nanny share', short: 'One caregiver in your home',
      lead: 'A caregiver who looks after your baby at home. In a nanny share, two families split one nanny.',
      good: 'You want one-on-one care at home, on a schedule that fits yours.', mind: 'You become an employer, with payroll and taxes. Plan backup for when your nanny is sick.',
      when: ['About 2–3 months ahead', 'That leaves time for interviews, references and a few paid trial days.'],
      ask: ['How long have you cared for babies under 1?', 'Can I call two families you’ve worked for?', 'Are you comfortable with a background check?', 'How would you spend a day with Maya?', 'Will you follow our routine for sleep, feeding and screens?'] },
    family: { icon: 'heart', name: 'Family or friends', short: 'Someone you already know and trust',
      lead: 'A grandparent, relative or friend looks after your baby, at your home or theirs.',
      good: 'You’d like someone who already loves Maya, with flexible timing.', mind: 'Advice has changed since they had babies. Talk through expectations early, kindly and clearly.',
      when: ['A few weeks ahead', 'Enough time to talk through the routine and do a practice day together.'],
      ask: ['Babies sleep on their backs in a bare crib, even for naps. Is that okay with you?', 'Can you use the car seat for every ride, buckled snugly?', 'How will you feed Maya: when, and how much?', 'What would you do if Maya seemed sick?', 'How should we keep in touch during the day?'] },
    sitter: { icon: 'moon', name: 'Babysitter', short: 'For an evening or a few hours',
      lead: 'Someone who watches your baby now and then, for a date night, an appointment or an afternoon.',
      good: 'You need a few hours of help, not regular care.', mind: 'Meet them with Maya first, and walk them through sleep and the car seat.',
      when: ['A week or two ahead', 'Try a short first visit while you’re at home, so everyone gets comfortable.'],
      ask: ['Have you looked after babies this young?', 'Are you trained in infant CPR?', 'Do you know how to put a baby down to sleep safely?', 'Can I call a family you’ve sat for?'] }
  };

  /* ---------- the summary screen ---------- */
  function frame(body) {
    return `<div class="quiet-category hub-page" data-overview="${CAT}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${body}<p class="hub-foot">${F('Every family’s situation is different. Pick the care that fits yours.')}</p></div>`;
  }
  function childcare() {
    const h = H(), card = load('ahead-carecard', {}), filled = Object.values(card).filter(v => String(v || '').trim()).length;
    let b = h.hero({ eyebrow: 'Childcare', title: 'Finding care that fits', checksLabel: 'Wherever you look', checks: ['Start early: spots for babies fill up fast', 'Ask every place or person the same safety questions', 'Visit before you decide, and bring Maya if you can'] });
    b += h.list('Types of care', Object.entries(TYPES).map(([k, t]) => h.row({ icon: t.icon, cat: CAT, title: t.name, sub: t.short, onclick: `openPage('chg:${CAT}:d:${k}')` })));
    b += h.list('Before the first day', [
      h.row({ icon: 'notepad', cat: CAT, title: `${name()}’s care card`, sub: filled ? 'Ready to share with any caregiver' : 'Everything a caregiver needs, in one place to share', onclick: `openPage('chg:${CAT}:d:card')` })
    ]);
    b += h.tip('Ease in', 'A few short days before the real start helps you both. Leave with a quick, warm goodbye.');
    return frame(b);
  }

  /* ---------- one page per type, always in the same order ---------- */
  function typePage(k) {
    const t = TYPES[k], h = H(), notes = load('ahead-childcare-notes', {});
    return h.detail(CAT, 'Childcare', t.name, t.lead,
      `<section class="hub-card cc-fit"><div><b>${F('A good fit if')}</b><p>${F(t.good)}</p></div><div><b>${F('Keep in mind')}</b><p>${F(t.mind)}</p></div></section>`
      + h.tip(t.when[0], t.when[1])
      + `<h2 class="hub-h2">${F(k === 'family' ? 'Talk it through' : 'Questions to ask')}</h2>`
      + `<p class="cc-lead">${F(k === 'family' ? 'Start with the safety basics, then the everyday.' : 'The first three are about safety. Ask them everywhere.')}</p>` + h.steps((k === 'family' ? [] : SAFETY).concat(t.ask))
      + `<h2 class="hub-h2">${F('Your notes')}</h2><textarea class="cc-notes" rows="5" placeholder="${esc3(k === 'family' || k === 'sitter' ? 'Names, numbers, what you talked about…' : 'Places or people you’re considering, and what you thought…')}" oninput="ccNote('${k}', this.value)">${esc3(notes[k])}</textarea><small class="cc-saved">${F('Saved on this device as you type.')}</small>`
      + h.list('', [h.row({ icon: 'notepad', cat: CAT, title: `${name()}’s care card`, sub: 'Share it with the caregiver before day one', onclick: `openPage('chg:${CAT}:d:card')` })]), t.icon);
  }
  window.ccNote = (k, v) => { const n = load('ahead-childcare-notes', {}); n[k] = v; save('ahead-childcare-notes', n); };

  /* ---------- the care card: fill once, share with anyone ---------- */
  const FIELDS = [['feeds', 'Feeding', 'What and how much, and how often'], ['naps', 'Sleep', 'Nap times, and how ' + '{s} {fall|falls} asleep'], ['soothe', 'What helps', 'Songs, holds or a favorite toy'], ['allergies', 'Allergies and medicines', 'Or “None”'], ['doctor', 'Pediatrician', 'Name and phone'], ['contacts', 'If you need us', 'Names and phone numbers']];
  function cardText() {
    const c = load('ahead-carecard', {}), nm = name();
    const lines = FIELDS.filter(([k]) => String(c[k] || '').trim()).map(([k, l]) => `${l}: ${c[k].trim()}`);
    return `${nm}’s care card\n\n${lines.join('\n')}\n\nAlways: ${nm} sleeps on ${babyPronouns().p} back, in a crib with nothing else in it, even for naps.`;
  }
  function cardPage() {
    const h = H(), c = load('ahead-carecard', {});
    if (!c.feeds && profile.feed) c.feeds = profile.feed === 'Both' ? 'Breast milk and formula' : profile.feed;
    const field = ([k, label, hint]) => `<label class="cc-field"><span>${F(label)}</span><textarea rows="1" onfocus="this.style.height='auto';this.style.height=this.scrollHeight+'px'" placeholder="${esc3(F(hint))}" oninput="ccCard('${k}', this.value);this.style.height='auto';this.style.height=this.scrollHeight+'px'">${esc3(c[k])}</textarea></label>`;
    return h.detail(CAT, 'Before the first day', `${name()}’s care card`, 'Fill it in once, then share it with daycare, a nanny, a sitter or family. Add only what’s useful.',
      `<section class="hub-card cc-card">${FIELDS.map(field).join('')}<p class="cc-always"><b>${F('Always included')}</b>${F(`${name()} sleeps on {p} back, in a crib with nothing else in it, even for naps.`)}</p></section>`
      + `<div class="cc-actions"><button class="hub-button" onclick="ccShare()">${F('Share the card')}</button></div><p class="cc-done" id="ccDone" hidden></p>`
      + h.note('Saved on this device. Nothing is shared until you tap Share.'), 'notepad');
  }
  window.ccCard = (k, v) => { const c = load('ahead-carecard', {}); c[k] = v; save('ahead-carecard', c); };
  window.ccShare = async function () {
    const text = cardText(), done = document.getElementById('ccDone');
    const say = m => { if (done) { done.textContent = m; done.hidden = false; } };
    try { if (navigator.share) { await navigator.share({ title: `${name()}’s care card`, text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text); say('Copied. Paste it into a text or email.'); } catch (e) { say('Couldn’t copy here. Select the details above and copy them.'); }
  };

  /* ---------- routes ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a] = p.split(':');
    if (cat === CAT && screen === 's') return childcare();
    if (cat === CAT && screen === 'd') { if (a === 'card') return cardPage(); if (TYPES[a]) return typePage(a); }
    return baseRoute(p);
  };
})();
