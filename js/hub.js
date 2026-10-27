/* Ahead · summary screens with details one tap away.
   Each stage page answers the parent's one question for that stage:
     hero (where things stand, one button) → what the baby's eating now → at most 3 rows → must-know safety → coming up → questions.
   Detail screens each do one job: tick off signs, a checklist, choose an approach, how-to steps, amounts.
   Copy is written to sound like a person talking. "Maya" becomes the baby's name; {s} {o} {p} {r} {S} {is} {has} {does}
   become pronouns, and {lean|leans} picks the verb form that matches. */
(function () {
  const C = () => window.__chg;
  const name_ = () => (typeof name === 'function' ? name() : 'your baby');
  const P = () => (typeof babyPronouns === 'function' ? babyPronouns() : { s: 'they', o: 'them', p: 'their', r: 'themselves', is: 'are', has: 'have', does: 'do' });
  // Pronouns, verb agreement and the baby's name, then escaped for HTML.
  const F = str => {
    const pr = P(), they = pr.s === 'they';
    let out = String(str == null ? '' : str)
      .replace(/\{s’(s|ve|ll)\}/g, (_, k) => they ? 'they’' + ({ s: 're', ve: 've', ll: 'll' })[k] : pr.s + '’' + ({ s: 's', ve: 's', ll: 'll' })[k])
      .replace(/\{S’(s|ve|ll)\}/g, (_, k) => cap(they ? 'they’' + ({ s: 're', ve: 've', ll: 'll' })[k] : pr.s + '’' + ({ s: 's', ve: 's', ll: 'll' })[k]))
      .replace(/\{([a-z’']+)\|([a-z’']+)\}/g, (_, a, b) => they ? a : b)
      .replace(/\{(s|o|p|r|S|P|is|has|does)\}/g, (_, k) => k === 'S' ? cap(pr.s) : k === 'P' ? cap(pr.p) : pr[k]);
    return esc(out).replace(/Maya/g, esc(name_()));
  };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const art = (n, cat) => (typeof hubArt === 'function' ? hubArt(n, cat) : '');
  const L = () => C().local;
  const store = (k, v) => { L()[k] = v; C().save(); };
  const go = p => `openPage('${p}')`;

  /* ---------- building blocks ---------- */
  const chev = '<span class="hub-chev" aria-hidden="true">›</span>';
  const chip = (t, tone = '') => t ? `<span class="hub-chip ${tone}">${F(t)}</span>` : '';
  function row({ icon, cat, title, sub, chipText, chipTone, onclick }) {
    return `<button class="hub-row" onclick="${onclick}"><span class="hub-dot">${art(icon, cat)}</span><span class="hub-row-copy"><b>${F(title)}</b>${sub ? `<small>${F(sub)}</small>` : ''}</span>${chip(chipText, chipTone)}${chev}</button>`;
  }
  const list = (heading, rows) => rows.filter(Boolean).length ? `${heading ? `<h2 class="hub-h2">${F(heading)}</h2>` : ''}<div class="hub-list">${rows.filter(Boolean).join('')}</div>` : '';
  function hero({ eyebrow, title, lead, meter, button, extra = '' }) {
    return `<header class="hub-hero"><p class="hub-eyebrow">${F(eyebrow)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}${meter ? `<div class="hub-meter"><div class="hub-meter-label"><span>${F(meter.label)}</span><span>${meter.n} of ${meter.of}</span></div><div class="hub-bar"><i style="width:${Math.round(100 * meter.n / meter.of)}%"></i></div></div>` : ''}${button ? `<button class="hub-button" onclick="${button.onclick}">${F(button.label)}</button>` : ''}${extra}</header>`;
  }
  const tiles = ts => `<div class="hub-tiles">${ts.map(t => `<div><small>${F(t[0])}</small><b>${F(t[1])}</b><span>${F(t[2])}</span></div>`).join('')}</div>`;
  const glanceCard = (title, ts, onclick, note = '') => `<button class="hub-card hub-glance" onclick="${onclick}"><span class="hub-card-head"><b>${F(title)}</b>${chev}</span>${tiles(ts)}${note ? `<span class="hub-card-note">${F(note)}</span>` : ''}</button>`;
  // Normal versus call: two boxes side by side, with an optional link underneath.
  const versus = (title, a, b, link) => `<section class="hub-card hub-versus"><h3>${F(title)}</h3><div class="hub-vs"><div><b>${F(a[0])}</b><p>${F(a[1])}</p></div><div class="is-urgent"><b>${F(b[0])}</b><p>${F(b[1])}</p></div></div>${link ? `<button class="hub-link" onclick="${link[1]}">${F(link[0])} ›</button>` : ''}</section>`;
  const next = (when, title, onclick, extra = '') => `<button class="hub-next" onclick="${onclick}"><span><small>${F(when)}</small><b>${F(title)}</b></span>${chev}</button>${extra}`;
  const listMore = (label, onclick) => `<button class="hub-list-more" onclick="${onclick}"><span>${F(label)}</span>${chev}</button>`;
  const more = (label, onclick) => `<button class="hub-more" onclick="${onclick}"><span>${F(label)}</span>${chev}</button>`;
  const note = t => `<p class="hub-note">${F(t)}</p>`;
  // A video for things you have to see done. Opens the source in a new tab.
  const figure = (name, cat, caption) => (window.hubFigure ? hubFigure(name, cat, F(caption)) : '');
  const video = (title, source, url, kind = 'Video') => `<a class="hub-video" href="${url}" target="_blank" rel="noopener"><span class="hub-play" aria-hidden="true">${kind !== 'Guide' ? '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5Z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 3h7l4 4v14H7Z"/><path d="M10 12h5M10 16h5"/></svg>'}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(kind + ' · ' + source)}</small></span><span class="hub-chev" aria-hidden="true">↗</span></a>`;

  // Detail screen frame: the app's header, then a short headline and lead, then one job.
  function detail(cat, context, title, lead, inner, artName) {
    return `<div class="quiet-category hub-page hub-detail" data-overview="${cat}" style="${yearTheme(cat)}">${typeof detailPageTop === 'function' ? detailPageTop(cat) : ''}<div class="hub-detail-head">${artName ? `<span class="hub-big">${art(artName, cat)}</span>` : ''}<p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>${inner}</div>`;
  }
  function ticks(rows, isOn, onclick, cat) {
    return `<div class="hub-ticks">${rows.map((r, i) => `<button class="hub-tick ${isOn(i) ? 'is-on' : ''}" role="checkbox" aria-checked="${isOn(i)}" onclick="${onclick(i)}"><span class="hub-tick-art">${art(r[2], cat)}</span><span class="hub-row-copy"><b>${F(r[0])}</b><small>${F(r[1])}</small></span><span class="hub-tick-box" aria-hidden="true">${isOn(i) ? '✓' : ''}</span></button>`).join('')}</div>`;
  }
  const steps = items => `<div class="hub-card"><ol class="hub-steps">${items.map(x => `<li>${F(x)}</li>`).join('')}</ol></div>`;
  const tip = (label, text) => `<div class="hub-tip"><b>${F(label)}</b>${F(text)}</div>`;
  const table = rows => `<div class="hub-card"><dl class="hub-table">${rows.map(r => `<div><dt>${F(r[0])}</dt><dd>${F(r[1])}</dd></div>`).join('')}</dl></div>`;
  const options = (items, chosen, onclick) => `<div class="hub-options">${items.map(([k, t, b]) => `<button class="hub-option ${chosen === k ? 'is-on' : ''}" aria-pressed="${chosen === k}" onclick="${onclick(k)}"><b>${F(t)}</b><span>${F(b)}</span></button>`).join('')}</div>`;
  const segmented = (items, chosen, onclick) => `<div class="hub-seg" role="tablist">${items.map(([k, t]) => `<button role="tab" aria-selected="${chosen === k}" class="${chosen === k ? 'is-on' : ''}" onclick="${onclick(k)}">${F(t)}</button>`).join('')}</div>`;

  /* ---------- feeding facts ---------- */
  const m = () => C().ageNow();
  const meth = () => C().method();
  const nursing = () => meth() === 'nurse';
  const signsOn = i => !!(L().ready || {})[i];
  const signsSeen = () => READY.filter((_, i) => signsOn(i)).length;
  const approach = () => L().approach || null;
  const style = () => L().style || (approach() === 'finger' ? 'finger' : 'spoon');
  const tried = k => !!(L().allergens || {})[k];
  const setupLeft = () => (typeof chgSafeRemaining === 'function' ? chgSafeRemaining('Feeding') : 4);
  const aidDone = () => !!(L().safe && L().safe.Feeding && L().safe.Feeding[1]);

  const READY = [
    ['{S} holds {p} head up on {p} own', 'Steady, without you supporting it', 'head'],
    ['{S} {sit|sits} up with a little support', 'In a high chair or propped on your lap', 'sit'],
    ['{S} {lean|leans} in when food comes {p} way', 'And opens {p} mouth for the spoon', 'mouth'],
    ['{S} {swallow|swallows} instead of pushing food out', 'That tongue push fades as {s} {get|gets} ready', 'swallow']
  ];
  const ALLERGENS = [['Peanut', 'thinned peanut butter'], ['Egg', 'well-cooked egg'], ['Dairy', 'a spoonful of yogurt'], ['Wheat', 'soft pasta'], ['Soy', 'soft tofu'], ['Sesame', 'a little tahini'], ['Tree nuts', 'thinned almond butter'], ['Fish', 'flaked salmon'], ['Shellfish', 'chopped shrimp']];

  // Milk amounts, written for the family's own feeding method. Typical, not targets.
  function milkTiles(stage) {
    const k = meth();
    const T = {
      learn: { nurse: [['Feeds', '8–12 a day', 'Little and often'], ['Between feeds', '1–3 hours', 'Day and night']],
        bottle: [['Per bottle', '1–3 oz', 'More as the weeks go on'], ['Feeds', '8–12 a day', 'Day and night']],
        expressed: m() < 1 ? [['Per bottle', '1–3 oz', 'More as the weeks go on'], ['Feeds', '8–12 a day', 'Day and night']] : [['Per bottle', '2–4 oz', 'Every 2–3 hours'], ['A day', 'About 25 oz', 'On average']],
        both: [['Feeds', '8–12 a day', 'Nursing and bottles'], ['Per bottle', '1–3 oz', 'More as the weeks go on']] },
      rhythm: { nurse: [['Feeds', 'About 6–8', 'A day'], ['Between feeds', '2–4 hours', 'Give or take']],
        bottle: [['Per bottle', '4–5 oz', 'Every 3–4 hours'], ['A day', 'About 24–32 oz', 'Most babies']],
        expressed: [['Per bottle', '3–4 oz', 'About 25 oz a day'], ['Feeds', 'About 6–8', 'A day']],
        both: [['Feeds', 'About 6–8', 'Nursing and bottles'], ['Per bottle', '4–5 oz', 'When you use one']] },
      ready: { nurse: [['Nursing', 'About 5–7 feeds', 'A day'], ['Between feeds', '3–4 hours', 'Give or take']],
        bottle: [['Per bottle', '4–6 oz', 'About 5–7 a day'], ['A day', 'Up to 32 oz', 'Most babies']],
        expressed: [['Per bottle', '3–5 oz', m() <= 6 ? 'About 25 oz a day' : 'Follow {p} cues'], ['Feeds', 'About 5–7', 'A day']],
        both: [['Feeds', 'About 5–7', 'Nursing and bottles'], ['Per bottle', '4–6 oz', 'When you use one']] }
    };
    if (T[stage]) return T[stage][k] || T[stage].nurse;
    const milk = { first: { nurse: ['Milk', 'About 5–7 feeds', 'Still the main food'], bottle: ['Formula', '24–32 oz a day', 'Still the main food'], expressed: ['Milk', m() <= 6 ? 'About 25 oz a day' : 'Bottles as before', 'Still the main food'], both: ['Milk', 'As before', 'Still the main food'] },
      textures: { nurse: ['Milk', 'About 4–6 feeds', 'Alongside meals'], bottle: ['Formula', '24–30 oz a day', 'Alongside meals'], expressed: ['Milk', 'About 24 oz a day', 'Alongside meals'], both: ['Milk', 'As before', 'Alongside meals'] },
      meals: { nurse: ['Milk', 'About 3–5 feeds', 'Alongside meals'], bottle: ['Formula', 'About 24 oz a day', 'Until 12 months'], expressed: ['Milk', 'About 20–24 oz', 'A day'], both: ['Milk', 'As before', 'Alongside meals'] } }[stage];
    const food = { first: ['Solids', '1–2 small meals', 'A few bites is plenty'], textures: ['Meals', '2–3 a day', 'Bigger portions now'], meals: ['Meals', '3, plus 1–2 snacks', 'Family food, adapted'] }[stage];
    return [milk[k] || milk.nurse, food];
  }

  /* ---------- feeding summary screens ---------- */
  const STAGE_KEYS = ['learn', 'rhythm', 'ready', 'first', 'textures', 'meals'];
  function pills(cat, view, cur) {
    const ST = STAGE_TABLE[cat].stages, live = C().live();
    return stageTimeline(cat, ST.map((st, i) => ({ label: st.label, age: st.age, on: i === view, now: live && i === cur, onclick: `chgGo('chg:${cat}:s:${i}')`, change: stageCanChange(cat, i, cur) ? `hubChangeStage('${cat}',${i})` : '' })), cat + ' stages');
  }
  function frame(cat, view, cur, body) {
    return `<div class="quiet-category hub-page" data-overview="${cat}" style="${yearTheme(cat)}">${monthlyPageHeader(cat)}${pills(cat, view, cur)}${body}<p class="hub-foot">Ages are typical. Every baby moves at their own pace.</p></div>`;
  }
  // When a parent browses another stage, offer the one-tap update where it makes sense.
  // Stage changes live on the timeline now (Change above the stage you're reading).
  function browseLinks() { return ''; }
  function comingUp(cat, view) {
    const D = C().DATA[cat], N = D.CH[view + 1];
    if (!N) { const A = D.CH[view].after; return A ? next(`After the first birthday, ${A[0]}`, A[1], go('chg:Feeding:d:after')) : ''; }
    let w = N.when.replace(/^Usually /, '').replace(/^around /, '');
    if (/weeks–/.test(w)) w = w.split('–')[0];
    return next(`Coming up around ${w}`, N.rail, `chgGo('chg:${cat}:s:${view + 1}')`);
  }
  const faqRow = (cat, key) => (C().DATA[cat].DEC[key] || []).length ? more('What other parents ask', go(`chg:${cat}:d:faq:${key}`)) : '';

  function feedingSummary(view, cur) {
    const key = STAGE_KEYS[view], age = m(), now = view === cur;
    let h = '';
    if (now && typeof feedingCheckinMarkup === 'function') h += feedingCheckinMarkup();
    const B = browseLinks('Feeding', view, cur);
    const lateStart = now && age >= 9 && typeof hasFoodAnswer === 'function' && hasFoodAnswer() && ['preparing', 'new'].includes(foodStage());
    const lateRow = lateStart ? row({ icon: 'shield', title: 'Bring your feeding questions to the checkup', sub: 'If first foods are only starting now, ask about iron and textures', onclick: "openHealthDetail(healthJourneyFocus(),'questions')" }) : '';

    if (key === 'learn') {
      h += hero({ eyebrow: 'Newborn feeds', title: 'Feeding often is exactly right', lead: 'Newborns feed 8–12 times a day, often every 1–3 hours. Small, frequent feeds are how they grow.' }) + B;
      h += glanceCard(view === cur ? 'What Maya’s eating now' : 'At this stage', milkTiles('learn'), go('chg:Feeding:d:milk'));
      h += list('In these first weeks', [
        row({ icon: 'diaper', title: 'How to tell Maya’s getting enough', sub: 'Wet diapers and weight tell you', onclick: go('chg:Feeding:d:enough') }),
        meth() === 'expressed' ? row({ icon: 'bottle', title: 'Store breast milk safely', sub: '4 hours out, 4 days in the fridge', onclick: go('chg:Feeding:d:storage') }) : meth() === 'bottle' ? row({ icon: 'hand', title: 'Feed at the first hunger cues', sub: 'Rooting and hands to mouth come before crying', onclick: go('chg:Feeding:d:cues') }) : row({ icon: 'mouth', title: 'Get a good latch', sub: 'A wide mouth and a deep latch make feeds comfortable', onclick: go('chg:Feeding:d:latch') }),
        meth() === 'bottle' ? row({ icon: 'bowl', title: 'Make bottles safely', sub: 'Follow the formula’s directions exactly', onclick: go('chg:Feeding:d:bottles') }) : row({ icon: 'drop', title: 'Ask about vitamin D drops', sub: 'Breastfed babies need them from the first days', chipText: 'Must know', chipTone: 'is-red', onclick: go('chg:Feeding:d:vitd') })
      ]);
      h += versus('Normal, or time to call?', ['Normal', 'Feeding again an hour later, a little spit-up and long feeds at first.'], ['Call your pediatrician', 'Hard to wake for feeds, fewer wet diapers or looking more yellow.']);
    }
    if (key === 'rhythm') {
      h += hero({ eyebrow: 'Milk feeds', title: 'Feeds are getting quicker', lead: 'Many babies get faster at feeding now and go a little longer between feeds. Hungrier days still happen, and that’s normal.' }) + B;
      h += glanceCard(view === cur ? 'What Maya’s eating now' : 'At this stage', milkTiles('rhythm'), go('chg:Feeding:d:milk'));
      const ev = age < 3 ? 0 : 1;
      h += list('What helps now', [
        row({ icon: 'hand', title: 'Follow {p} cues, not the clock', sub: 'Offer milk when {s’s} hungry, stop when {s’s} full', onclick: go('chg:Feeding:d:cues') }),
        meth() === 'nurse' ? null : row({ icon: 'bowl', title: 'Pace {p} bottles', sub: 'Hold it level and pause every so often', onclick: go('chg:Feeding:d:pacing') }),
        row({ icon: ev === 0 ? 'clock' : 'mouth', title: ev === 0 ? 'Cluster feeding is normal' : 'Distracted feeds are normal', sub: ev === 0 ? 'Lots of feeds close together, often in the evening' : 'Pulling off to look around usually passes', onclick: go(`chg:Feeding:e:${ev}`) })
      ]);
      h += versus('Normal, or time to call?', ['Normal', 'Quicker feeds, longer gaps and a little spit-up.'], ['Call your pediatrician', 'Fewer wet diapers, refusing feeds or taking much less milk.']);
    }
    if (key === 'ready') {
      const n = signsSeen();
      const head = n === 4 && age < 6 ? ['Maya’s showing the signs', 'Most babies start around 6 months, so check with your pediatrician if you’d like to start sooner.']
        : n === 4 ? ['Maya looks ready for solids', '{S} {is} showing all four signs. Pick a calm morning for the first taste.']
        : age >= 6 && !hasFoodAnswer() ? ['Solids start at different times', 'Tell us whether Maya has started, and this guide will match. If not yet, here’s what to look for.']
        : age >= 7 ? ['Some babies take a little longer', 'If Maya isn’t showing all four signs yet, mention it at {p} next checkup. Until then, milk gives {o} everything {s} {need|needs}.']
        : ['Solids are coming up soon', 'Most babies start around 6 months, once they’re ready. Until then, milk gives Maya everything {s} {need|needs}.'];
      h += hero({ eyebrow: 'Preparing for solids', title: head[0], lead: head[1], meter: { label: 'Maya’s readiness signs', n, of: 4 }, button: { label: n === 4 && age >= 6 && now ? 'Tell us when {s’ve} started' : 'See what to look for', onclick: n === 4 && age >= 6 && now ? "chgSetStage('Feeding',3)" : go('chg:Feeding:d:signs') } }) + B;
      h += glanceCard(view === cur ? 'What Maya’s eating now' : 'At this stage', milkTiles('ready'), go('chg:Feeding:d:milk'));
      const left = setupLeft();
      h += list('Before you start', [
        row({ icon: 'highchair', title: 'Get set up for the first bite', sub: 'A high chair, a soft spoon and first aid', chipText: left ? `${4 - left} of 4` : 'Done', chipTone: left ? '' : 'is-done', onclick: go('chg:Feeding:d:setup') }),
        row({ icon: 'bowl', title: 'Decide how you’d like to start', sub: 'Spoon-feeding, finger foods or a bit of both', chipText: approach() ? { spoon: 'Spoon-feeding', finger: 'Finger foods', both: 'A bit of both' }[approach()] : 'Pick one', chipTone: approach() ? 'is-done' : '', onclick: go('chg:Feeding:d:approach') }),
        lateRow
      ]);
      h += note('Does Maya have severe eczema or an egg allergy? Talk to your pediatrician before starting, since peanut may need to come early.');
    }
    if (key === 'first') {
      h += hero({ eyebrow: 'First foods', title: 'A few bites a day is all it takes', lead: 'Milk is still doing the heavy lifting. For now, meals are mostly about practice.' }) + B;
      h += glanceCard(view === cur ? 'What Maya’s eating now' : 'At this stage', milkTiles('first'), go('chg:Feeding:d:milk'));
      const t = ALLERGENS.filter(a => tried(a[0])).length, nextA = ALLERGENS.find(a => !tried(a[0]));
      h += list('What to focus on', [
        row({ icon: 'bowl', title: 'What to put on the tray', sub: 'Iron-rich foods, soft enough to squash', onclick: go('chg:Feeding:d:tray') }),
        row({ icon: 'peanut', title: 'Try a new allergen', sub: nextA ? `One {s} {haven’t|hasn’t} had yet, like ${nextA[1]}` : 'Keep offering the ones {s’ve} tried', chipText: `${t} of ${ALLERGENS.length}`, onclick: go('chg:Feeding:d:allergens') }),
        row({ icon: 'hand', title: 'Let {o} set the pace', sub: 'Turning away or closing {p} mouth means {s’s} done', onclick: go('chg:Feeding:d:pace') }),
        (aidDone() || lateRow) ? null : row({ icon: 'shield', title: 'Learn infant choking first aid', sub: 'Worth knowing before you need it', chipText: 'Not done yet', chipTone: 'is-red', onclick: "openPage('chg:Feeding:safe')" }),
        lateRow
      ]);
      h += versus('Gagging or choking?', ['Gagging', 'Coughing and a red face. It looks scary, but it’s normal.'], ['Choking', 'Silent and can’t cough or cry. Call 911 right away.'], ['Choking first aid, step by step', "openPage('chg:Feeding:safe')"]);
    }
    if (key === 'textures') {
      h += hero({ eyebrow: 'More textures', title: 'Time for lumps and finger foods', lead: 'Maya is ready for thicker food and soft pieces {s} can pick up. Build on the foods {s} already {like|likes}.' }) + B;
      h += glanceCard(view === cur ? 'What Maya’s eating now' : 'At this stage', milkTiles('textures'), go('chg:Feeding:d:milk'));
      h += list('What to focus on', [
        row({ icon: 'bowl', title: 'Make food a little lumpier', sub: 'Thicker each week, so {s} {learn|learns} to chew', onclick: go('chg:Feeding:d:lumpy') }),
        row({ icon: 'avocado', title: 'Offer soft finger foods', sub: 'Strips first, small pieces once {s} can pinch', onclick: go('chg:Feeding:d:finger') }),
        // Catch-up: first-food basics stay until they're done.
        ALLERGENS.some(a => !tried(a[0])) ? row({ icon: 'peanut', title: 'Try a new allergen', sub: 'Keep going until {s’ve} tried them all', chipText: `${ALLERGENS.filter(a => tried(a[0])).length} of ${ALLERGENS.length}`, onclick: go('chg:Feeding:d:allergens') })
          : !aidDone() ? row({ icon: 'shield', title: 'Learn infant choking first aid', sub: 'Worth knowing before you need it', chipText: 'Not done yet', chipTone: 'is-red', onclick: "openPage('chg:Feeding:safe')" })
          : row({ icon: 'cup', title: 'Practice with an open cup', sub: 'A few sips of water at meals', onclick: go('chg:Feeding:d:cup') })
      ]);
      h += versus('Safe to offer, or a choking risk?', ['Safe to offer', 'Soft strips, grapes cut lengthwise into quarters and anything that squashes easily.'], ['Skip for now', 'Whole nuts, popcorn, raw carrot and round slices of hot dog.']);
    }
    if (key === 'meals') {
      h += hero({ eyebrow: 'Family meals', title: 'Meals are part of the day now', lead: 'Three meals and a snack or two, with milk alongside. Most of what you eat can work for Maya too.' }) + B;
      h += glanceCard(view === cur ? 'What Maya’s eating now' : 'At this stage', milkTiles('meals'), go('chg:Feeding:d:milk'));
      h += list('What to focus on', [
        row({ icon: 'plate', title: 'What a day of meals looks like', sub: 'A simple example to work from', onclick: go('chg:Feeding:d:day') }),
        row({ icon: 'bowl', title: 'Share your family’s food', sub: 'Set {p} portion aside before adding salt', onclick: go('chg:Feeding:d:family') }),
        row({ icon: 'cup', title: nursing() ? 'Nursing can carry on' : 'Plan the milk change at 12 months', sub: nursing() ? 'For as long as it works for you both' : 'Whole cow’s milk can replace formula then', onclick: go('chg:Feeding:d:milk12') })
      ]);
      h += versus('Not before 12 months', ['Fine now', 'Water from a cup, yogurt and cheese, and most family food.'], ['Wait until 12 months', 'Honey, cow’s milk as a drink, and juice.']);
    }
    h += comingUp('Feeding', view) + faqRow('Feeding', key);
    return frame('Feeding', view, cur, h);
  }

  /* ---------- feeding detail screens ---------- */
  const FOODS = {
    lentils: { art: 'lentils', group: 'iron', title: 'Lentils or beans', sub: 'Cheap, easy and full of iron', why: 'They’re full of iron, cost very little and turn soft without much work.',
      base: 'Rinse red lentils and simmer them in water until very soft, about 20 minutes.',
      spoon: ['Blend with a little breast milk, formula or water until smooth and runny.', 'Offer a few spoonfuls. Over the next few weeks, blend it a little thicker.'],
      finger: ['Mash well, then let it cool and thicken a little.', 'Roll into soft balls, or spread a thin layer on a strip of toast for {o} to grab.'] },
    meat: { art: 'meat', group: 'iron', title: 'Meat or chicken', sub: 'Slow-cooked until it falls apart', why: 'Meat has the kind of iron babies absorb most easily.',
      base: 'Slow-cook beef, lamb or chicken until it falls apart with a fork.',
      spoon: ['Blend with a little of the cooking liquid until smooth.', 'Thin with breast milk, formula or water until it drips off the spoon.'],
      finger: ['Shred it into soft strands, or offer a strip about the size of your finger to gnaw on.', 'Check that it pulls apart easily before it goes on the tray.'] },
    egg: { art: 'egg', group: 'iron', title: 'Eggs', sub: 'Cooked all the way through', why: 'Eggs bring iron and protein, and offering them early may help prevent an egg allergy.',
      base: 'Cook the egg all the way through, hard-boiled or as a firm omelet.',
      spoon: ['Mash a hard-boiled egg with breast milk, formula or water until smooth.', 'Offer it early in the day the first time, since egg is a common allergen.'],
      finger: ['Slice a firm omelet into strips about the size of your finger.', 'Offer it early in the day the first time, since egg is a common allergen.'] },
    oats: { art: 'oats', group: 'iron', title: 'Iron-fortified oatmeal', sub: 'Mixed with breast milk or formula', why: 'Infant oatmeal has iron added, and it’s easy to make thinner or thicker.',
      base: 'Choose an infant oatmeal that says it’s fortified with iron.',
      spoon: ['Mix with breast milk, formula or water until it’s smooth and runny.', 'Make it a little thicker each week as {s} {get|gets} used to it.'],
      finger: ['Mix it thick, so it holds its shape.', 'Spread it on a strip of toast, or let {o} scoop it with {p} hands.'] },
    avocado: { art: 'avocado', group: 'veg', title: 'Avocado', sub: 'Ripe and soft, no cooking needed', why: 'It’s naturally soft, full of healthy fats and ready in seconds.',
      base: 'Pick a ripe avocado that gives a little when you press it.',
      spoon: ['Mash with a fork until smooth.', 'Thin with a little breast milk, formula or water if it’s too thick.'],
      finger: ['Cut it into strips about the size of your finger.', 'Roll the strips in a little infant cereal so they’re easier to hold.'] },
    potato: { art: 'potato', group: 'veg', title: 'Sweet potato', sub: 'Roasted or steamed until soft', why: 'It’s sweet, easy to make soft and most babies like it.',
      base: 'Roast or steam sweet potato until a fork slides in easily, about 25–30 minutes.',
      spoon: ['Mash or blend with a little breast milk, formula or water until smooth.', 'Leave it a little lumpier as the weeks go on.'],
      finger: ['Cut it into wedges about the size of your finger before cooking.', 'Let it cool, then check it squashes easily.'] }
  };

  function feedingDetail(id, arg) {
    const cat = 'Feeding', age = m();
    if (id === 'signs') {
      const n = signsSeen();
      const close = n === 4 && age < 6 ? 'Maya’s showing all four. Most babies start around 6 months, so check with your pediatrician if you’d like to start sooner.'
        : n === 4 ? 'Maya’s showing all four signs, so {s’s} ready for a first taste. Pick a calm morning when {s’s} not too hungry.'
        : 'Being curious about your food is a great sign, but on its own it doesn’t mean {s’s} ready. Most babies show all four around 6 months.';
      return detail(cat, 'Preparing for solids', 'Is Maya ready for solids?', 'Tap each sign as you notice it. Once you’ve seen all four, Maya’s ready for a first taste.',
        ticks(READY, signsOn, i => `hubToggleReady(${i})`, 'Development') + `<div class="hub-tip is-plain">${F(close)}${typeof profile !== 'undefined' && profile.early ? ' ' + F('Since Maya was born early, check timing with your pediatrician.') : ''}</div>`);
    }
    if (id === 'setup') {
      const SETUP = [['Get a high chair with a harness', 'One that keeps {o} upright, with {p} feet supported', 'highchair'], ['Learn infant choking first aid', 'A short class or video, so you know what to do', 'shield'], ['Know gagging from choking', 'Gagging is noisy and normal. Choking is silent.', 'mouth'], ['Have a soft spoon and an open cup', 'Small soft-tipped spoons, and a cup for sips of water', 'cup']];
      const on = i => !!(L().safe && L().safe.Feeding && L().safe.Feeding[i]), done = SETUP.filter((_, i) => on(i)).length;
      return detail(cat, 'Preparing for solids', 'Get set up for the first bite', 'A few things to sort out before the first meal. Tick them off as you go.',
        `<p class="hub-group">${done} of 4 done</p>` + ticks(SETUP, on, i => `chgToggleSafe('Feeding',${i})`, 'Feeding') + tip('Good to know', 'You don’t need special gadgets. A spoon, a bowl and a safe seat are plenty.'), 'highchair');
    }
    if (id === 'approach') {
      return detail(cat, 'Preparing for solids', 'Decide how you’d like to start', 'There’s no wrong choice, and you can change your mind any time.',
        options([['spoon', 'Spoon-feeding', 'You offer small spoonfuls of smooth food, then make it lumpier over time.'], ['finger', 'Finger foods', 'Maya feeds {r} soft pieces from the start. It’s messier, with lots of exploring.'], ['both', 'A bit of both', 'Spoon some foods and offer others as finger foods. Many families do this.']], approach(), k => `hubApproach('${k}')`)
        + tip('Whichever you choose', 'Readiness, safe food and letting Maya decide how much matter with every approach.'), 'bowl');
    }
    if (id === 'milk') {
      const stage = STAGE_KEYS[C().CFG.Feeding.stage(age)] || 'ready';
      const rowsByMeth = {
        learn: { nurse: [['Feeds', '8–12 a day'], ['Between feeds', 'Every 1–3 hours']], bottle: [['Per bottle', '1–2 oz at first, 2–3 oz by 2 weeks'], ['Feeds', '8–12 a day']], expressed: age < 1 ? [['Per bottle', '1–2 oz at first, 2–3 oz by 2 weeks'], ['Feeds', '8–12 a day']] : [['Per bottle', '2–4 oz'], ['A day', 'About 25 oz, on average']], both: [['Feeds', '8–12 a day in total'], ['Per bottle', '1–3 oz']] },
        rhythm: { nurse: [['Feeds', 'About 6–8 a day'], ['Between feeds', 'Every 2–4 hours']], bottle: [['Per bottle', '4–5 oz'], ['A day', 'About 24–32 oz']], expressed: [['Per bottle', '3–4 oz'], ['A day', 'About 25 oz']], both: [['Feeds', 'About 6–8 a day in total'], ['Per bottle', '4–5 oz']] },
        ready: { nurse: [['Nursing', 'About 5–7 feeds a day'], ['Between feeds', 'Every 3–4 hours']], bottle: [['Per bottle', '4–6 oz'], ['A day', 'Up to 32 oz']], expressed: [['Per bottle', '3–5 oz'], ['A day', age <= 6 ? 'About 25 oz' : 'Follow Maya’s cues']], both: [['Feeds', 'About 5–7 a day in total'], ['Per bottle', '4–6 oz']] },
        first: { nurse: [['Nursing', 'About 5–7 feeds a day'], ['Solids', '1–2 small meals a day'], ['Water', 'A few sips with meals']], bottle: [['Formula', '24–32 oz a day'], ['Solids', '1–2 small meals a day'], ['Water', 'A few sips with meals']], expressed: [['Breast milk', age <= 6 ? 'About 25 oz a day' : 'Bottles as before'], ['Solids', '1–2 small meals a day'], ['Water', 'A few sips with meals']], both: [['Milk', 'Nursing and bottles as before'], ['Solids', '1–2 small meals a day'], ['Water', 'A few sips with meals']] },
        textures: { nurse: [['Nursing', 'About 4–6 feeds a day'], ['Meals', '2–3 a day'], ['Water', '4–8 oz a day']], bottle: [['Formula', '24–30 oz a day'], ['Meals', '2–3 a day'], ['Water', '4–8 oz a day']], expressed: [['Breast milk', 'About 24 oz a day'], ['Meals', '2–3 a day'], ['Water', '4–8 oz a day']], both: [['Milk', 'Nursing and bottles as before'], ['Meals', '2–3 a day'], ['Water', '4–8 oz a day']] },
        meals: { nurse: [['Nursing', 'About 3–5 feeds a day'], ['Meals', '3, plus 1–2 snacks'], ['Water', '4–8 oz a day']], bottle: [age >= 12 ? ['Cow’s milk, if used', '16–24 oz a day'] : ['Formula', 'About 24 oz a day'], ['Meals', '3, plus 1–2 snacks'], ['Water', '4–8 oz a day']], expressed: [['Breast milk', 'About 20–24 oz a day'], ['Meals', '3, plus 1–2 snacks'], ['Water', '4–8 oz a day']], both: [['Milk', 'Nursing and bottles as before'], ['Meals', '3, plus 1–2 snacks'], ['Water', '4–8 oz a day']] }
      }[stage];
      const head = { learn: ['Little and often', 'Newborns have tiny tummies, so frequent feeds are exactly what they need.'], rhythm: ['Feeds are settling into a rhythm', 'Feeds often get quicker or a little further apart now. Hungrier days still happen.'], ready: age >= 7 ? ['Milk is still the main drink', 'If {s} {haven’t|hasn’t} started solids yet, it’s worth starting soon. Mention it at {p} next checkup.'] : ['Milk is still everything', 'Nothing changes until solids begin. Keep feeding the way you have been.'], first: ['Milk still comes first', 'Solids are practice for now, so keep milk feeds going as usual. Offer milk before meals if {s} {seem|seems} too hungry to try food.'], textures: ['Milk and meals together', 'Meals are growing, but milk still matters. Most babies drop a feed or two on their own.'], meals: ['Meals take the lead', 'Milk comes alongside meals now. The bigger change comes around the first birthday.'] }[stage];
      const enough = stage === 'learn' ? 'At least 6 wet diapers a day after day 5, and back to birth weight by about 2 weeks.' : stage === 'first' || stage === 'textures' || stage === 'meals' ? 'Steady growth at checkups and plenty of wet diapers. How much {s} {eat|eats} at one meal matters much less.' : 'Steady growth at checkups and plenty of wet diapers.';
      const select = `<label class="hub-select">Showing amounts for <select onchange="chgChooseMethod(this.value)">${[['nurse', 'Nursing'], ['expressed', 'Breast milk in bottles'], ['bottle', 'Formula'], ['both', 'Nursing and bottles']].map(([v, l]) => `<option value="${v}" ${meth() === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
      const early = typeof profile !== 'undefined' && profile.early ? tip('Born early?', 'Follow your pediatrician’s milk and supplement plan first. These are general amounts.') : '';
      return detail(cat, C().DATA.Feeding.CH[C().CFG.Feeding.stage(age)].rail, head[0], head[1], table(rowsByMeth[meth()] || rowsByMeth.nurse) + early + tip('How to tell {s’s} getting enough', enough) + note('These are typical amounts, not targets. Every baby’s a little different.') + select, 'bowl');
    }
    if (id === 'tray') {
      const grp = (title, g) => `<p class="hub-group">${F(title)}</p><div class="hub-list">${Object.entries(FOODS).filter(([, f]) => f.group === g).map(([k, f]) => row({ icon: f.art, title: f.title, sub: f.sub, onclick: go('chg:Feeding:d:food:' + k) })).join('')}</div>`;
      return detail(cat, 'First foods', 'There’s no perfect first food', 'Most families start with something rich in iron, then add fruits and vegetables. Whatever your family eats is a great place to start.',
        grp('Rich in iron', 'iron') + grp('Fruits and vegetables', 'veg') + note('Skip for now: honey, cow’s milk as a drink, juice, added salt or sugar, whole nuts, popcorn and anything hard or round, like raw carrot or whole grapes.'));
    }
    if (id === 'food') {
      const f = FOODS[arg] || FOODS.lentils, st = style();
      return detail(cat, 'What to put on the tray', f.title, f.why,
        segmented([['spoon', 'Spoon-feeding'], ['finger', 'Finger foods']], st, k => `hubStyle('${k}')`) + (st === 'finger' ? figure('sizes', cat, 'From 6 to 8 months, strips the size of a finger. From 9 months, pea-sized pieces, with grapes quartered.') : '') + steps([f.base, ...f[st]]) + tip('Is it soft enough?', 'It should squash easily between your thumb and finger.') + tip('Save yourself time', 'Make a batch and freeze extra in an ice cube tray. Each cube is about one meal.'), f.art);
    }
    if (id === 'allergens') {
      const t = ALLERGENS.filter(a => tried(a[0])).length;
      return detail(cat, 'First foods', 'Try a new allergen', 'Offering common allergens early, once a few first foods are going well, may help prevent food allergies.',
        `<div class="hub-card"><div class="hub-card-head"><b>${F('Tick the ones Maya has tried')}</b><span class="hub-chip">${t} of ${ALLERGENS.length}</span></div><div class="chg-choices hub-chips">${ALLERGENS.map(([k]) => `<button class="${tried(k) ? 'is-on' : ''}" aria-pressed="${tried(k)}" onclick="hubAllergen('${k}')">${tried(k) ? '✓ ' : ''}${k}</button>`).join('')}</div></div>`
        + steps(['Pick one Maya hasn’t tried, in a safe form, like a spoonful of yogurt or peanut butter thinned into a purée.', 'Offer a small amount early in the day, so you can watch how {s} {do|does} afterward.', 'Once it goes well, keep offering it a few times a week. That’s what helps most.'])
        + `<section class="hub-card hub-versus"><h3>${F('If something seems off')}</h3><div class="hub-vs"><div><b>Call your pediatrician</b><p>${F('A few hives around the mouth, or vomiting after a new food.')}</p></div><div class="is-urgent"><b>Call 911</b><p>${F('Trouble breathing, swelling of the lips or tongue, or {s} {seem|seems} floppy or pale.')}</p></div></div></section>`
        + note('If Maya has severe eczema or an egg allergy, talk to your pediatrician before trying peanut.'), 'peanut');
    }
    if (id === 'pace') {
      return detail(cat, 'First foods', 'Let Maya set the pace', 'Babies are good at knowing how much they need. Your job is what and when; {p} job is how much.',
        `<div class="hub-card hub-two"><div><b>${F('Ready for more')}</b><p>${F('Leans in, opens {p} mouth, reaches for the spoon.')}</p></div><div><b>${F('All done')}</b><p>${F('Turns away, closes {p} mouth, pushes food off the tray.')}</p></div></div>`
        + tip('How much is enough?', 'A few spoonfuls or bites is plenty at first. Some days {s’ll} eat almost nothing, and that’s normal.') + tip('Make it easy', 'Sit together, keep it calm, and let {o} touch and explore. Mess is part of learning.'), 'hand');
    }
    if (id === 'enough') {
      return detail(cat, 'Newborn feeds', 'How to tell Maya’s getting enough', 'You can’t always see how much a newborn drinks, so these signs tell you instead.',
        table([['Wet diapers', 'At least 6 a day after day 5'], ['Poops', 'Yellow and seedy by day 5, often several a day'], ['Weight', 'Back to birth weight by about 2 weeks'], ['After feeds', 'Relaxed hands and a sleepy, content baby']])
        + ((NOW - parse(profile.dob)) / 864e5 < 21 ? tip('Wake {o} for feeds for now', 'Until {s’s} back to birth weight, wake {o} if it’s been more than about 3 hours. Your pediatrician will tell you when you can stop.') : tip('Once {s’s} back to birth weight', 'Most babies can feed when they wake. Your pediatrician will tell you if {s} still {need|needs} waking.'))
        + `<section class="hub-card hub-versus"><h3>${F('When to call')}</h3><div class="hub-vs"><div><b>Call your pediatrician</b><p>${F('Hard to wake for feeds, fewer wet diapers or looking more yellow.')}</p></div><div class="is-urgent"><b>Call right away</b><p>${F('A temperature of 100.4°F or higher under 3 months.')}</p></div></div></section>`, 'diaper');
    }
    if (id === 'cues') {
      return detail(cat, 'Feeding', 'Reading Maya’s hunger cues', 'Feeding at the first signs of hunger is easier on you both than waiting for crying.',
        `<div class="hub-card hub-two"><div><b>${F('Hungry')}</b><p>${F('Rooting, lip smacking, hands to mouth. Crying comes last.')}</p></div><div><b>${F('Full')}</b><p>${F('Slowing down, turning away, relaxed hands.')}</p></div></div>` + tip('You can’t overfeed a nursing baby', 'Offering the breast whenever {s} {seem|seems} hungry is exactly right.'), 'hand');
    }
    if (id === 'latch') {
      return detail(cat, 'Newborn feeds', 'Getting a good latch', 'A deep latch is more comfortable for you and helps Maya get more milk. It takes practice for both of you.',
        video('Watch a good latch, step by step', 'Nemours KidsHealth', 'https://kidshealth.org/en/parents/breastfeed-video.html')
        + steps(['Wait for a wide-open mouth, like a yawn.', 'Bring Maya to you, chin first, with {p} nose level with your nipple.', 'Look for lips turned out and more of the areola showing above {p} top lip than below.', 'If it pinches, slip a clean finger into the corner of {p} mouth to break the suction, then try again.'])
        + `<section class="hub-card hub-versus"><h3>${F('Normal, or time for help?')}</h3><div class="hub-vs"><div><b>Normal</b><p>${F('A little tenderness in the first week, and a tug that eases after the first few sucks.')}</p></div><div><b>Ask for help</b><p>${F('Pain through the whole feed, cracked nipples, or clicking sounds. A lactation consultant can help, often in one visit.')}</p></div></div></section>`
        + tip('Feed at the first hunger cues', 'Rooting and hands to mouth come before crying, and a calm baby latches more easily.'), 'mouth');
    }
    if (id === 'storage') {
      return detail(cat, 'Breast milk in bottles', 'Store breast milk safely', 'Freshly pumped milk keeps well if you follow a few simple times.',
        table([['Room temperature', 'Up to 4 hours'], ['Fridge', 'Up to 4 days, at the back'], ['Freezer', 'Best within 6 months, up to 12'], ['Thawed milk', '24 hours in the fridge. Don’t refreeze.'], ['After a feed', 'Use leftovers within 2 hours']])
        + steps(['Label each bag or bottle with the date, and use the oldest first.', 'Thaw in the fridge overnight or in a bowl of warm water, never the microwave.', 'Swirl to mix the fat back in. It’s normal for it to separate.'])
        + video('Storing and preparing breast milk', 'Northwestern Medicine', 'https://www.nm.org/healthbeat/healthy-tips/how-to-store-breast-milk', 'Guide'), 'bottle');
    }
    if (id === 'vitd') {
      return detail(cat, 'Newborn feeds', 'Ask about vitamin D drops', 'Breast milk is low in vitamin D, so breastfed and partly breastfed babies need drops from the first days.',
        steps(['Ask your pediatrician which drops to use and how much, ideally at the first-week checkup.', 'Give them once a day, at a time that’s easy to remember, like the first morning feed.', 'Keep going until your pediatrician says you can stop.']) + tip('Formula-fed?', 'Most formula already has vitamin D added, so ask before adding drops.'), 'drop');
    }
    if (id === 'bottles') {
      return detail(cat, 'Newborn feeds', 'Make bottles safely', 'Formula is carefully balanced, so how you mix it matters.',
        steps(['Wash your hands and use clean bottles and nipples.', 'Follow the directions on the formula exactly. Never add extra water to stretch it.', 'Use it within an hour of starting a feed, then throw away what’s left.']) + tip('Warming', 'Room temperature is fine. If you warm it, use warm water, never the microwave.'), 'bowl');
    }
    if (id === 'pacing') {
      return detail(cat, 'Milk feeds', 'Pace Maya’s bottles', 'Paced feeding lets {o} drink at {p} own speed, a bit like nursing.',
        figure('pace', cat, 'Paced: baby upright with the bottle level. Avoid: baby lying back with the bottle tipped up.') + steps(['Hold Maya fairly upright and the bottle level, so milk fills just the tip.', 'Pause every few minutes and let {o} take a break.', 'Stop when {s} {turn|turns} away or slows down, even if there’s milk left.']) + tip('Never prop a bottle', 'Always hold Maya and the bottle during a feed.'), 'bowl');
    }
    if (id === 'lumpy') {
      return detail(cat, 'More textures', 'Make food a little lumpier', 'Moving to thicker food now helps Maya learn to chew and makes family food easier later.',
        steps(['Start with foods {s} already {like|likes}, mashed with a fork instead of blended.', 'Leave small soft lumps, and make it a little thicker each week.', 'Let {o} hold a spoon too, even if most of it ends up on the tray.']) + tip('Gagging is part of learning', 'A little gagging as {s} {try|tries} new textures is normal. Stay calm and let {o} work it out.'), 'bowl');
    }
    if (id === 'finger') {
      return detail(cat, 'More textures', 'Offer soft finger foods', 'Picking up food is great practice for little hands, and lets Maya feed {r}.',
        figure('sizes', cat, 'From 6 to 8 months, strips the size of a finger. From 9 months, pea-sized pieces, with grapes quartered.') + steps(['Start with strips about the size of your finger, which are easy to grab with a whole hand.', 'Once {s} can pinch with thumb and finger, usually around 9 months, cut food into pea-sized pieces.', 'Quarter round foods like grapes and cherry tomatoes lengthwise, at every age.']) + tip('Is it soft enough?', 'It should squash easily between your thumb and finger.')
        + video('See how to cut dozens of foods', 'Solid Starts', 'https://www.solidstarts.com/safe-food-sizes-shapes-for-babies/', 'Guide'), 'avocado');
    }
    if (id === 'cup') {
      return detail(cat, 'More textures', 'Practice with an open cup', 'Sipping from a cup takes practice, and starting early makes the bottle-to-cup switch easier later.',
        steps(['Pour a little water into a small open cup.', 'Hold it to Maya’s lips and let {o} take a sip.', 'Offer it at meals. Spills are part of it.']) + tip('How much water?', 'About 4–8 oz a day is plenty. Milk is still the main drink.'), 'cup');
    }
    if (id === 'day') {
      return detail(cat, 'Family meals', 'What a day of meals looks like', 'Here’s one example to work from. Every family’s day looks a little different.',
        table([['Wake up', nursing() ? 'Nursing' : 'Milk'], ['Breakfast', 'Oatmeal with mashed fruit'], ['Snack', 'Soft fruit or yogurt'], ['Lunch', 'Soft veggies and beans or meat'], ['Afternoon', nursing() ? 'Nursing' : 'Milk, plus a snack if hungry'], ['Dinner', 'A small portion of your dinner'], ['Bedtime', nursing() ? 'Nursing' : 'Milk']]) + tip('Light days are normal', 'Appetite goes up and down. Growth at checkups tells you more than any one meal.'), 'plate');
    }
    if (id === 'family') {
      return detail(cat, 'Family meals', 'Share your family’s food', 'Most of what you eat can work for Maya with a couple of small changes.',
        steps(['Set {p} portion aside before you add salt or spicy sauces.', 'Cut it into soft, small pieces or mash it a little.', 'Sit down together when you can. Watching you eat is how {s} {learn|learns}.']) + tip('Wait until 12 months', 'Honey, cow’s milk as a main drink and juice.') + tip('Keep skipping, even after 1', 'Whole nuts, popcorn, whole grapes and hard raw vegetables are choking risks for years.'), 'plate');
    }
    if (id === 'milk12') {
      return nursing()
        ? detail(cat, 'Family meals', 'Nursing can carry on', 'There’s no need to stop at 12 months. Many families keep nursing well past the first birthday.', tip('Around the first birthday', 'Meals become the main food and nursing fits around them. Water from a cup is the main drink between feeds.') + tip('Ask at the checkup', 'Your pediatrician can talk through vitamin D and iron at the 12-month checkup.'), 'cup')
        : detail(cat, 'Family meals', 'Plan the milk change at 12 months', 'Around the first birthday, whole cow’s milk can replace formula, and bottles can make way for cups.',
          steps(['At 12 months, swap formula for whole cow’s milk, about 16–24 oz a day.', 'Offer milk in an open or straw cup instead of a bottle.', 'Talk it through at the 12-month checkup.']) + tip('No rush on the bottle', 'Phasing it out over a few weeks is fine.'), 'cup');
    }
    if (id === 'after') {
      return detail(cat, 'After the first birthday', 'Bottles to cups', 'Most babies move off bottles between 12 and 18 months. Going one bottle at a time keeps it easy.',
        steps(['Swap the bottle Maya cares least about for an open or straw cup first, often the midday one.', 'Every week or so, swap another. The bedtime bottle usually goes last.', 'If you’re using cow’s milk, about 16–24 oz a day from a cup is plenty.']) + tip('Nursing is different', 'There’s no need to stop nursing at 12 months. Keep going for as long as it works for you both.'), 'cup');
    }
    if (id === 'faq') {
      const key = arg || STAGE_KEYS[C().CFG.Feeding.stage(age)], Q = C().DATA.Feeding.DEC[key] || [];
      return detail(cat, C().DATA.Feeding.CH[STAGE_KEYS.indexOf(key)]?.rail || 'Feeding', 'What other parents ask', '', `<section class="common-questions hub-faq">${Q.map((q, i) => C().question(cat, key, i, q)).join('')}</section>`);
    }
    return C().sub(cat, id, arg);
  }

  // Safe sleep reads in order. Setup tasks you finish once get a checkbox; habits you do every time don't.
  const SLEEP_SETUP = [
    { t: 'Get a firm, flat crib or bassinet', s: 'With a fitted sheet and nothing else in it', art: 'crib', task: 0 },
    { t: 'Set it up in your room', s: 'Room-sharing is recommended for at least 6 months', art: 'home', task: 1 },
    { t: 'Choose a sleep sack instead of blankets', s: 'Light and unweighted, with no hat', art: 'sack', task: 2 },
    { t: 'Put Maya on {p} back for every sleep', s: 'Naps and nights, every time', art: 'back', habit: 'Every sleep' },
    { t: 'Move {o} to {p} crib after the car or swing', s: 'Car seats and swings aren’t for sleep', art: 'car', habit: 'Every time' },
    { t: 'Never sleep with Maya on a sofa or armchair', s: 'Feeding when you’re very tired? Do it in a bed cleared of pillows and blankets, then move {o} back to the crib', art: 'sofa', habit: 'Always' },
    { t: 'Keep the room smoke-free and comfortably cool', s: 'Overheating and smoke both raise the risk of SIDS', art: 'home', habit: 'Always' },
    { t: 'Offer a pacifier at sleep times', s: 'Once feeding’s going well. It’s linked to lower SIDS risk.', art: 'pacifier', habit: 'If you like' }
  ];
  const SLEEP_TASKS = SLEEP_SETUP.filter(x => x.task != null).length;
  const sleepTaskOn = i => !!(L().safe && L().safe.Sleep && L().safe.Sleep[i]);
  window.chgSafeTotal = (base => cat => cat === 'Sleep' ? SLEEP_TASKS : base(cat))(window.chgSafeTotal);
  window.chgSafeRemaining = (base => cat => cat === 'Sleep' ? SLEEP_SETUP.filter(x => x.task != null && !sleepTaskOn(x.task)).length : base(cat))(window.chgSafeRemaining);
  function mixedList(items, isOn, onclick, cat) {
    return `<div class="hub-ticks">${items.map(x => x.task != null
      ? `<button class="hub-tick ${isOn(x.task) ? 'is-on' : ''}" role="checkbox" aria-checked="${isOn(x.task)}" onclick="${onclick(x.task)}"><span class="hub-tick-art">${art(x.art, cat)}</span><span class="hub-row-copy"><b>${F(x.t)}</b><small>${F(x.s)}</small></span><span class="hub-tick-box" aria-hidden="true">${isOn(x.task) ? '✓' : ''}</span></button>`
      : `<div class="hub-tick is-habit"><span class="hub-tick-art">${art(x.art, cat)}</span><span class="hub-row-copy"><b>${F(x.t)}</b><small>${F(x.s)}</small></span><span class="hub-chip">${F(x.habit)}</span></div>`).join('')}</div>`;
  }

  /* ---------- sleep facts ---------- */
  const SLEEP_KEYS = ['clock', 'daynight', 'rhythm', 'two'];
  const rolled = () => answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways', 'Trying to roll'].includes(answers.rollDirection);
  const swaddleDue = () => (rolled() || m() >= 3) && answers.swaddleStopped !== 'Yes' && (m() <= 6 || answers.swaddleStopped === 'No');
  const mattressLowestDue = () => (answers.pullUp === 'Yes' || m() >= 8) && answers.mattressLowest !== 'Yes';
  const mattressDue = () => !mattressLowestDue() && (m() >= 5 || answers.sit === 'Yes') && answers.mattressLowered !== 'Yes' && answers.mattressLowest !== 'Yes';
  const safeOn = i => !!(L().safe && L().safe.Sleep && L().safe.Sleep[i]);
  const safeDone = () => SLEEP_SETUP.filter(x => x.task != null && sleepTaskOn(x.task)).length;
  function sleepGlance(key) {
    return {
      clock: [['Total sleep', '14–17 hours', 'Including naps'], ['Wake window', '45–60 min', 'Between sleeps']],
      daynight: [['Total sleep', '14–17 hours', 'Including naps'], ['Wake window', '1–1½ hours', 'Between sleeps']],
      rhythm: [['Naps', '3 a day', 'The last is a short catnap'], ['Wake window', '2–2½ hours', 'Between sleeps'], ['Bedtime', '7–8 pm', 'Often'], ['Total sleep', '12–16 hours', 'Including naps']],
      two: [['Naps', '2 a day', 'Morning and afternoon'], ['Wake window', '2½–4 hours', 'Between sleeps'], ['Bedtime', '7–8 pm', 'Often'], ['Total sleep', '12–16 hours', 'Including naps']]
    }[key];
  }
  const NIGHT = {
    clock: 'Wake Maya for feeds until your pediatrician says you can stop, usually once {s’s} back to birth weight.',
    daynight: 'Once your pediatrician says it’s OK, let Maya wake you for feeds. Most babies still feed 2–3 times a night.',
    rhythm: 'Night feeds can carry on. Check with your pediatrician before dropping one.',
    two: 'Some babies still feed at night with two naps, and that’s fine. Ask your pediatrician before dropping one.'
  };
  const nightCard = (key, isNow = true) => `<button class="hub-card hub-glance" onclick="${go('chg:Sleep:d:day')}"><span class="hub-card-head"><b>${F(isNow ? 'How Maya’s sleeping now' : 'At this stage')}</b>${chev}</span>${tiles(sleepGlance(key))}<span class="hub-card-note" id="sleep-night-feeds"><b>${F('At night')}</b> ${F(NIGHT[key])}</span></button>`;
  const swaddleRow = () => swaddleDue() ? row({ icon: 'sack', cat: 'Sleep', title: rolled() ? 'Stop swaddling now' : 'Stop swaddling at the first attempt to roll', sub: rolled() ? (answers.rollDirection === 'Trying to roll' ? 'Now that Maya’s trying to roll, use a sleep sack' : 'Now that Maya’s rolling, use a sleep sack') : 'Switch to a sleep sack that leaves the arms free', chipText: rolled() ? 'Do now' : 'Must know', chipTone: 'is-red', onclick: go('chg:Sleep:d:swaddle') }) : null;
  const mattressRow = () => mattressLowestDue() ? row({ icon: 'shield', cat: 'Sleep', title: 'Set the crib mattress to its lowest', sub: answers.pullUp === 'Yes' ? 'Now that Maya pulls up, use the lowest setting' : 'Before {s} {pull|pulls} up, use the lowest setting', chipText: 'Do now', chipTone: 'is-red', onclick: go('chg:Sleep:d:mattress') })
    : mattressDue() ? row({ icon: 'shield', cat: 'Sleep', title: 'Lower the crib mattress', sub: answers.sit === 'Yes' ? 'Now that Maya sits, move it down a setting' : 'Move it down before {s} can sit up', chipText: 'Do now', chipTone: 'is-red', onclick: go('chg:Sleep:d:mattress') }) : null;
  function settleRow() {
    const g = C().settlingGuide();
    const t = { learn: m() >= 4 ? ['Sleep training, if you choose it', 'A choice, not a must'] : ['Read ahead: sleep training', 'Some families start at 4–6 months or later'], trying: ['Support while sleep training', 'How to handle a rough night'], routine: ['When the routine changes', 'After short naps, travel or illness'], help: ['A routine with your help', 'Feeding or rocking to sleep can stay'] }[g] || ['Helping Maya settle', 'What works at this age'];
    return row({ icon: 'moon', cat: 'Sleep', title: t[0], sub: t[1], onclick: "openPage('chg:Sleep:settle')" });
  }
  function eventRow(cat) {
    const evs = C().CFG[cat].events(m());
    if (!evs.length) return '';
    const e = C().DATA[cat].EV[evs[0]];
    return list('Common around now', [row({ icon: cat === 'Sleep' ? 'moon' : 'clock', cat, title: e.title, sub: e.when, onclick: `openPage('chg:${cat}:e:${evs[0]}')` })]);
  }

  /* ---------- sleep summary screens ---------- */
  function sleepSummary(view, cur) {
    const key = SLEEP_KEYS[view], age = m(), now = view === cur, cat = 'Sleep';
    let h = '';
    let B = browseLinks(cat, view, cur);
    if (key === 'clock') {
      const n = safeDone(), all = SLEEP_TASKS;
      h += hero({ eyebrow: 'Round-the-clock sleep', title: 'Short sleeps, day and night', lead: 'Newborns sleep 14–17 hours a day in stretches of 1–3 hours. There’s no pattern yet, and that’s normal.', button: n === all ? null : { label: 'Set up a safe sleep space', onclick: go('chg:Sleep:safe') } }) + B + (n === all ? list('', [row({ icon: 'moon', cat, title: 'Safe sleep setup', sub: 'Your space is set up. The habits are here too.', chipText: 'Done', chipTone: 'is-done', onclick: go('chg:Sleep:safe') })]) : '');
      h += nightCard(key, now);
      h += list('In these first weeks', [
        swaddleRow() || (answers.swaddleStopped === 'Yes' ? null : row({ icon: 'sack', cat, title: 'Swaddle safely, if you swaddle', sub: 'Snug at the chest, loose at the hips', onclick: go('chg:Sleep:d:swaddle') })),
        row({ icon: 'clock', cat, title: 'Start winding down at the first yawn', sub: 'A yawn or a quiet stare is your cue', onclick: go('chg:Sleep:d:cues') }),
        row({ icon: 'heart', cat, title: 'Help Maya fall asleep any way that works', sub: 'Feeding, rocking or holding is fine now', onclick: "openPage('chg:Sleep:d:soothe')" }),
        row({ icon: 'moon', cat, title: 'Keep nights dark and quiet', sub: 'It helps {p} body clock switch on', onclick: go('chg:Sleep:d:daynight') })
      ].filter(Boolean).slice(0, 3));
      h += versus('Normal, or time to call?', ['Normal', 'Waking every 2–3 hours, grunts, squeaks and twitches in sleep.'], ['Call your pediatrician', 'Hard to wake for feeds, a temperature of 100.4°F or higher, or trouble breathing.'], ['When the crying won’t stop', go('chg:Sleep:d:crying')]);
    }
    if (key === 'daynight') {
      h += hero({ eyebrow: 'Longer nights', title: 'Nights are starting to stretch', lead: 'Many babies start telling day from night now. Often the first sign is one longer stretch of sleep at night.' }) + B;
      h += nightCard(key, now);
      h += list('What helps now', [
        swaddleRow(),
        row({ icon: 'moon', cat, title: 'Keep days bright and nights dim', sub: 'Daylight and chatter by day, quiet feeds at night', onclick: go('chg:Sleep:d:daynight') }),
        row({ icon: 'clock', cat, title: 'Start a short bedtime routine', sub: 'A feed, a diaper and a song is plenty', onclick: go('chg:Sleep:d:routine') }),
        swaddleDue() ? null : settleRow()
      ]);
      h += eventRow(cat);
      h += versus('Normal, or time to call?', ['Normal', 'A long stretch one night and not the next, and fussier evenings.'], ['Call your pediatrician', 'Snoring most nights, pauses or gasps in sleep, or sleep changes with fever.']);
    }
    if (key === 'rhythm') {
      h += hero({ eyebrow: 'Three naps', title: 'Naps are finding a rhythm', lead: 'Most babies take 3 naps now and get sleepy after about 2 hours awake. Bedtime often lands between 7 and 8.' }) + B;
      h += nightCard(key, now);
      const rows = [swaddleRow(), mattressRow(), row({ icon: 'clock', cat, title: 'Watch for sleepy cues', sub: 'A quiet stare, yawning or turning away', onclick: go('chg:Sleep:d:cues') }), settleRow()].filter(Boolean).slice(0, 3);
      h += list('What helps now', rows);
      h += eventRow(cat);
      h += versus('Normal, or time to call?', ['Normal', 'Naps of 30–45 minutes, and fighting a nap now and then.'], ['Call your pediatrician', 'Snoring most nights, pauses or gasps in sleep, or sleep changes with fever.']);
    }
    if (key === 'two') {
      const settled = answers.twoNaps === 'Yes' || age >= 10 || (now && answers.twoNaps !== 'Not yet');
      h += hero({ eyebrow: 'Two naps', title: settled ? 'Two naps a day' : 'Two naps are on the way', lead: settled ? 'A morning nap and an afternoon nap make up the day. A short nap can shift the timing without changing the number.' : 'Most babies drop the late catnap between 6 and 9 months. Look for a pattern over a week, not one day.' }) + B;
      h += nightCard(key, now);
      const rows = [swaddleRow(), mattressRow(), settled ? row({ icon: 'clock', cat, title: 'After a short nap, offer the next one sooner', sub: 'One rough day doesn’t end two naps', onclick: go('chg:Sleep:d:catnap') }) : row({ icon: 'clock', cat, title: 'Watch for a skipped catnap', sub: 'If {s} {skip|skips} it most days, try two naps', onclick: go('chg:Sleep:d:catnap') }), row({ icon: 'sit', cat, title: 'Practice new skills during the day', sub: 'Lots of floor time helps nights stay calm', onclick: go('chg:Sleep:d:skills') }), settleRow()].filter(Boolean).slice(0, 3);
      h += list('What helps now', rows);
      h += eventRow(cat);
      h += versus('Normal, or time to call?', ['Normal', 'Standing up in the crib, and protest at bedtime when you leave.'], ['Call your pediatrician', 'Snoring most nights, pauses or gasps in sleep, or sleep changes with fever.']);
    }
    const D = C().DATA.Sleep, N = D.CH[view + 1], A = D.CH[view].after;
    if (N) { let w = N.when.replace(/^Usually /, ''); if (/weeks–/.test(w)) w = w.split('–')[0]; h += next(`Coming up around ${w}`, N.rail, `chgGo('chg:Sleep:s:${view + 1}')`); }
    else if (A) h += next(`After the first birthday, ${A[0]}`, A[1], go('chg:Sleep:d:after'));
    h += (D.DEC[key] || []).length ? more('What other parents ask', go(`chg:Sleep:d:faq:${key}`)) : '';
    return frame(cat, view, cur, h);
  }

  /* ---------- sleep detail screens ---------- */
  function sleepDetail(id, arg) {
    if (id === 'soothe') return soothePage();
    const cat = 'Sleep', age = m(), stage = C().CFG.Sleep.stage(age), C0 = C().DATA.Sleep.CH[stage], key = SLEEP_KEYS[stage];
    if (id === 'safe') {
      const done = safeDone() === SLEEP_TASKS;
      const rows = SLEEP_SETUP.map(x => `<div class="hub-row is-static"><span class="hub-dot">${art(x.art, cat)}</span><span class="hub-row-copy"><b>${F(x.t)}</b><small>${F(x.s)}</small></span></div>`).join('');
      return detail(cat, 'Safe sleep', 'A safe place to sleep', 'Set up the space once, then a few habits keep every sleep safe.',
        figure('crib', cat, 'A baby asleep on their back in a sleep sack, in a bare crib with a firm mattress and fitted sheet.') + `<div class="hub-list">${rows}</div>`
        + `<div class="hub-actions">${done ? `<p class="hub-done">${F('You’ve set up Maya’s sleep space')} ✓</p>` : `<button class="hub-button" onclick="hubSleepSetUp()">${F('I’ve set this up')}</button>`}</div>`
        + `<h2 class="hub-h2">${F('As Maya starts moving')}</h2><div class="hub-list">`
        + `<div class="hub-row is-static" id="sleep-rolling"><span class="hub-dot">${art('roll', cat)}</span><span class="hub-row-copy"><b>${F('When {s} {try|tries} to roll')}</b><small>${F('Stop swaddling and keep putting {o} down on {p} back. If {s’s} in a bassinet, it’s time for the crib.')}</small></span></div>`
        + `<div class="hub-row is-static" id="sleep-crib-height"><span class="hub-dot">${art('shield', cat)}</span><span class="hub-row-copy"><b>${F('Before {s} can sit or pull up')}</b><small>${F('Lower the crib mattress, then set it to its lowest.')}</small></span></div></div>`
        + video('What a safe sleep space looks like', 'Safe to Sleep campaign', 'https://www.nichd.nih.gov/sites/default/files/publications/pubs/documents/safe_sleep_environment_rev.pdf', 'Guide'), 'moon');
    }
    if (id === 'day') {
      const flexible = ['clock', 'daynight'].includes(key);
      const day = C().sampleDay(C0).replace('<h3 class="chg-sample-title">', '<h3 class="chg-sample-title hub-h2">');
      return detail(cat, C0.rail, flexible ? 'There’s no schedule yet' : 'An example day', flexible ? 'For now, days follow a loop: a feed, a little awake time, then sleep. Clock times come later.' : 'Here’s one example built from typical wake windows. Real days will move around, and that’s fine.',
        `<div class="hub-card">${tiles(sleepGlance(key)).replace('hub-tiles', 'hub-tiles is-flat').replace(/<small>Naps<\/small><b>(\d) a day<\/b>/, '<small>Naps</small><b>$1</b>')}</div>` + `<div class="hub-card hub-dayplan">${day}</div>` + tip('At night', NIGHT[key]), 'clock');
    }
    if (id === 'cues') {
      return detail(cat, 'Sleep', 'Spotting sleepy cues', 'Starting to wind down at the first signs of tiredness makes it easier for Maya to settle.',
        `<div class="hub-card hub-two"><div><b>${F('Getting tired')}</b><p>${F('A quiet stare, yawning, rubbing eyes or turning away.')}</p></div><div><b>${F('Overtired')}</b><p>${F('Fussing, arching or crying that’s hard to settle.')}</p></div></div>`
        + tip('Wake windows', { clock: 'Most newborns are ready to sleep after 45–60 minutes awake.', daynight: 'Around 1–1½ hours awake is typical now.', rhythm: 'About 2–2½ hours awake is typical now, a little longer before bedtime.', two: 'About 2½–4 hours awake is typical now, longest before bedtime.' }[key]), 'clock');
    }
    if (id === 'crying') {
      return detail(cat, 'The early months', 'When the crying won’t stop', 'Crying usually builds from about 2 weeks, peaks around 6–8 weeks and eases by 3–4 months. Some evenings nothing works, and that isn’t your fault.',
        steps(['Check the basics: hungry, a wet diaper, too warm or too cold, or overtired.', 'Hold Maya close: skin to skin, a slow walk or gentle rocking.', 'Try a steady sound, like shushing, white noise or a soft song.', 'Offer a pacifier, or a swaddle if {s} {is}n’t trying to roll yet.'])
        + `<section class="hub-card hub-callout"><b>${F('If you feel overwhelmed')}</b><p>${F('Put Maya down on {p} back in the crib, close the door and take a few minutes. Call someone you trust. Crying won’t hurt Maya. Shaking can, so never shake a baby.')}</p></section>`
        + versus('Normal, or time to call?', ['Normal', 'Long crying spells, often in the evening, in a baby who feeds and grows well.'], ['Call your pediatrician', (m() < 3 ? 'Right away for any fever of 100.4°F or higher. Also for ' : 'Crying with a fever, ') + 'poor feeding or vomiting, a weak or high-pitched cry, or crying that sounds like pain.'])
        + video('Why crying peaks, and what helps', 'Cook Children’s', 'https://www.cookchildrens.org/health-resources/newborn/care/period-of-purple-crying/', 'Guide'), 'heart');
    }
    if (id === 'daynight') {
      return detail(cat, 'Longer nights', 'Helping Maya tell day from night', 'Babies aren’t born knowing the difference. Light, sound and your routine teach {o}.',
        steps(['During the day, open the curtains and keep normal household noise.', 'At night, keep lights low and feeds quiet and calm.', 'Save play and chatter for the daytime.']) + tip('When it clicks', 'Most babies’ body clocks switch on around 6–8 weeks, so give it time.'), 'moon');
    }
    if (id === 'routine') {
      return detail(cat, 'Sleep', 'A short bedtime routine', 'A few familiar steps in the same order tell Maya that sleep is coming.',
        steps(['Start with a feed, then a fresh diaper and pajamas.', 'Dim the lights and sing a song or read a short book.', 'Put {o} down in {p} sleep space, on {p} back.']) + tip('Keep it short', 'Familiar matters more than long. 10–15 minutes is plenty.'), 'moon');
    }
    if (id === 'swaddle' && !rolled() && m() < 3) {
      return detail(cat, 'Sleep safety', 'Swaddling safely', 'A snug swaddle can help a newborn settle. It just needs to be done the safe way, and only until {s} {try|tries} to roll.',
        video('Watch how to swaddle', 'St. Louis Children’s Hospital', 'https://www.stlouischildrens.org/health-resources/pulse/how-swaddle-newborn-baby-blanket')
        + steps(['Snug around the chest, with room for two fingers between the blanket and {p} chest.', 'Loose around the hips, so {p} legs can bend up and out like a frog.', 'Always on {p} back, never on {p} tummy or side.'])
        + tip('Stop at the first attempt to roll', 'Some babies try as early as 2 months, most between 3 and 6. Switch to a sleep sack that leaves the arms free.')
        + video('Swaddling for healthy hips', 'International Hip Dysplasia Institute', 'https://hipdysplasia.org/how-to-swaddle-your-baby-to-help-keep-their-hips-healthy/', 'Guide')
, 'moon');
    }
    if (id === 'swaddle') {
      return detail(cat, 'Sleep safety', 'Stop swaddling at the first attempt to roll', 'A swaddled baby who rolls onto {p} tummy can’t use {p} arms to move. So once rolling starts, the swaddle stops.',
        steps(['Switch to a sleep sack or wearable blanket that leaves the arms free.', 'Keep putting Maya down on {p} back.', 'If {s} {roll|rolls} over on {p} own both ways, you can leave {o} that way.'])
        + `<div class="hub-actions">${answers.swaddleStopped === 'Yes' ? `<p class="hub-done">${F('Maya’s in a sleep sack')} ✓</p>` : `<button class="hub-button" onclick="setAnswer('swaddleStopped','Yes')">${F('Maya’s in a sleep sack now')}</button>`}</div>` + tip('Skip weighted sleep sacks', 'Any sleep sack should be light and unweighted.'), 'moon');
    }
    if (id === 'mattress') {
      const lowest = mattressLowestDue();
      return detail(cat, 'Sleep safety', lowest ? 'Set the crib mattress to its lowest' : 'Lower the crib mattress', lowest ? 'Once Maya can pull up, a higher mattress makes it easier to tip over the rail.' : 'Once Maya can sit, {s} can lean over the rail. Moving the mattress down keeps {o} safe.',
        steps(lowest ? ['Move the mattress to the lowest setting in your crib manual.', 'Take down mobiles and anything {s} can reach from standing.', 'Check nothing nearby could be used as a step.'] : ['Find the next setting down in your crib manual.', 'Lower the mattress and check it sits firmly in place.', 'Plan to go all the way down before {s} {pull|pulls} up.'])
        + `<div class="hub-actions"><button class="hub-button" onclick="setAnswer('${lowest ? 'mattressLowest' : 'mattressLowered'}','Yes')">Done</button></div>`, 'shield');
    }
    if (id === 'catnap') {
      return detail(cat, 'Two naps', answers.twoNaps === 'Yes' || age >= 10 ? 'When a nap runs short' : 'Moving to two naps', 'The move from three naps to two takes a week or two, and some days will look messy.',
        steps(['Watch for a skipped or hard-to-fit late catnap most days.', 'Move bedtime about 30 minutes earlier during the switch.', 'After a short nap, offer the next sleep a little sooner.']) + tip('A third nap is still OK', 'On a day with short naps, a catnap can still help.'), 'clock');
    }
    if (id === 'skills') {
      return detail(cat, 'Two naps', 'Practice new skills during the day', 'Crawling and pulling up are exciting, and Maya may want to practice in the crib too.',
        steps(['Give {o} lots of floor time to practice by day.', 'Keep the bedtime routine the same.', 'If {s} {stand|stands} up in the crib, help {o} sit back down calmly, then say goodnight.']) + tip('It passes', 'Most babies settle back into sleep once the new skill feels familiar.'), 'sit');
    }
    if (id === 'after') { const A = C().DATA.Sleep.CH[3].after; return detail(cat, 'After the first birthday', A[1], 'Most babies still need two naps at their first birthday. The move to one nap usually comes between 13 and 18 months.',
      tip('The sign to watch for', 'Most days, {s} {fight|fights} the morning nap or {take|takes} a long time to fall asleep for it, yet {is} fine until the afternoon.') + tip('How to switch', 'Push the morning nap a little later each few days until it lands around lunchtime. An earlier bedtime helps while {s} {adjust|adjusts}.') + tip('Not yet?', 'Two naps after the first birthday is normal. There’s no rush.'), 'moon'); }
    if (id === 'method') {
      const x = (typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [])[Number(arg)];
      if (!x) return settlePage();
      const NIGHTS = {
        'Ferber': [['7:00 pm', 'Bedtime routine, then put Maya down drowsy but awake. Say goodnight and leave.'], ['If {s} {cry|cries}', 'Wait 3 minutes, then check in for a minute or two. Talk softly or pat, without picking {o} up.'], ['Still crying', 'Leave again and wait a little longer each time: 5 minutes, then 10.'], ['Night wakes', 'Feed if it’s time for a feed. Otherwise use the same check-ins.'], ['Next nights', 'Start the waits a few minutes longer than the night before.']],
        'Chair method': [['Nights 1–3', 'Sit in a chair right by the crib. Comfort with your voice or a hand until Maya falls asleep.'], ['Nights 4–6', 'Move the chair halfway to the door. Comfort with your voice more than touch.'], ['Nights 7–9', 'Move the chair to the doorway.'], ['After that', 'Say goodnight from outside the door.'], ['Night wakes', 'Go back to wherever the chair is that night.']],
        'Pick up, put down': [['7:00 pm', 'Bedtime routine, then put Maya down drowsy but awake.'], ['If {s} {cry|cries}', 'Pick {o} up and hold {o} until {s’s} calm, but not asleep.'], ['Then', 'Put {o} back down. Repeat as many times as it takes.'], ['Night wakes', 'Feed if it’s time for a feed, then the same pick up and put down.'], ['Good to know', 'The first nights can take many repeats. It gets quicker.']],
        'Cry it out': [['7:00 pm', 'Bedtime routine, then put Maya down awake. Say goodnight and leave.'], ['If {s} {cry|cries}', 'Don’t go back in until morning, unless it’s a planned feed or {s} {seem|seems} unwell.'], ['First nights', 'Crying can last a while at first.'], ['By night 3 or 4', 'Most babies cry much less and fall asleep faster.']],
        'Bedtime fading': [['First', 'Notice when Maya naturally falls asleep, say 8:30 pm.'], ['Nights 1–2', 'Start the bedtime routine so {s’s} in the crib at 8:30, when {s’s} truly sleepy.'], ['Once {s} {settle|settles} quickly', 'Move bedtime 15 minutes earlier.'], ['Repeat', 'Keep stepping earlier every couple of nights until you reach the bedtime you want.']]
      };
      const night = NIGHTS[x.name];
      const nightHtml = night ? `<h2 class="hub-h2">${F('What a night might look like')}</h2><div class="hub-card"><dl class="hub-timeline">${night.map(r => `<div><dt>${F(r[0])}</dt><dd>${F(r[1])}</dd></div>`).join('')}</dl></div>` : '';
      return detail(cat, 'Sleep training', x.name, x.title, `<div class="hub-card"><p class="hub-body">${esc(x.description)}</p></div>` + nightHtml + tip('Before you start', 'Check with your pediatrician, keep any night feeds {s} still {need|needs}, and pick a response every caregiver can repeat.') + `<a class="hub-more" href="${x.url}" target="_blank" rel="noopener"><span>${esc(x.link)} · ${esc(x.source || 'Cleveland Clinic')}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`, 'moon');
    }
    if (id === 'faq') {
      const k = arg || key, Q = C().DATA.Sleep.DEC[k] || [];
      return detail(cat, C().DATA.Sleep.CH[SLEEP_KEYS.indexOf(k)]?.rail || 'Sleep', 'What other parents ask', '', `<section class="common-questions hub-faq">${Q.map((q, i) => C().question(cat, k, i, q)).join('')}</section>`);
    }
    return C().sub(cat, id, arg);
  }

  /* ---------- come-and-go phases (both categories) ---------- */
  function eventDetail(cat, i) {
    const e = C().DATA[cat].EV[i];
    if (!e) return C().mainPage(cat, null, null);
    const T = C().T;
    return `<div class="quiet-category hub-page hub-detail" data-overview="${cat}" style="${yearTheme(cat)}">${typeof detailPageTop === 'function' ? detailPageTop(cat) : ''}<div class="hub-detail-head"><span class="hub-big">${art(cat === 'Sleep' ? 'moon' : 'clock', cat)}</span><p class="hub-context">${esc(e.when)}</p><h1>${T(e.title)}</h1><p class="hub-lead">${T(e.lead)}</p></div>`
      + `<div class="hub-card"><div class="hub-card-head"><b>What it looks like</b></div><ul class="hub-bullets">${(e.looks || []).map(x => `<li>${T(x)}</li>`).join('')}</ul></div>`
      + `<h2 class="hub-h2">What helps</h2><div class="hub-card"><ol class="hub-steps">${(e.helps || []).slice(0, 3).map(x => `<li><span><b>${T(x[0])}.</b> ${T(x[1])}</span></li>`).join('')}</ol></div>`
      + (e.lasts ? `<div class="hub-tip"><b>How long it lasts</b>${T(e.lasts)}</div>` : '')
      + (e.supportNote ? `<p class="hub-note">${T(e.supportNote)}</p>` : '') + `</div>`;
  }

  /* ---------- shared sub pages ---------- */
  function firstAid() {
    return detail('Feeding', 'Safety', 'If Maya is choking', 'Choking is silent: {s} can’t cry, cough or breathe. Gagging is noisy, and you can let {o} work it out.',
      `<section class="hub-card hub-versus"><div class="hub-vs" style="margin-top:0"><div><b>Gagging</b><p>${F('Coughing, sputtering, a red face. Stay calm and let {o} clear it.')}</p></div><div class="is-urgent"><b>Choking</b><p>${F('Silent, can’t cough or cry, lips turning blue. Act now.')}</p></div></div></section>`
      + `<h2 class="hub-h2">${F('What to do if {s} {is} choking')}</h2>`
      + steps(['Shout for help and have someone call 911.', 'Lay Maya face down along your forearm, head lower than {p} chest, supporting {p} jaw. Give up to 5 firm back blows between the shoulder blades.', 'Turn {o} face up on your other arm. With 2 fingers just below the nipple line, give up to 5 quick chest thrusts.', 'Keep switching between back blows and chest thrusts until the food comes out. If {s} stops responding, call 911 and start infant CPR.'])
      + video('Watch infant choking first aid', 'University of Washington', 'https://depts.washington.edu/learncpr/videodemo/choking-infant-video.html')
      + tip('Don’t sweep blindly', 'Only reach into {p} mouth if you can see the object and easily pick it out.')
      + tip('Take a class', 'A short infant first aid class lets you practice these steps on a doll. It’s the best way to feel ready.')
      + `<a class="hub-more" href="https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx" target="_blank" rel="noopener"><span>${F('Preventing choking, and what to do · HealthyChildren.org')}</span><span class="hub-chev" aria-hidden="true">↗</span></a>`, 'shield');
  }
  function helpPage(cat) {
    const D = C().DATA[cat], T = C().T, tone = l => /911/.test(l) ? 'is-red' : /pediatrician/i.test(l) ? 'is-red' : '';
    const TRIAGE = cat === 'Sleep' ? [
      ['Normal', 'Waking at night through the first year, and short naps while sleep patterns are still developing.'],
      ['Keep an eye on it', 'Settling getting harder or more waking than usual. Jot down feeds and any signs of discomfort.'],
      ['Call your pediatrician', 'Snoring most nights, pauses or gasping in sleep, sleep changes with fever or poor feeding, or a newborn who’s hard to wake for feeds.'],
      ['Call 911', 'Trouble breathing, blue or gray lips, or Maya won’t wake up.']
    ] : [
      ['Normal', 'Spit-up in a happy baby who’s growing, a few days of cluster feeding, gagging while learning to eat, and an appetite that changes day to day.'],
      ['Keep an eye on it', 'Shorter feeds or a smaller appetite. Keep track of wet diapers and how Maya seems overall.'],
      ['Call your pediatrician', 'Fewer wet diapers, not back to birth weight by 2 weeks, repeated vomiting, refusing feeds or food, hives after a new food, or blood in {p} poop.'],
      ['Call 911', 'Trouble breathing, swelling of the lips or tongue after a food, choking that doesn’t clear, or Maya is limp or won’t wake.']
    ];
    const cards = TRIAGE.map(x => `<div class="hub-card hub-triage"><span class="hub-chip ${tone(x[0])}">${F(x[0])}</span><p>${F(x[1])}</p></div>`).join('');
    return detail(cat, cat === 'Sleep' ? 'Sleep' : 'Feeding', cat === 'Sleep' ? 'When to ask for sleep help' : 'When to ask for feeding help', 'Most changes are normal. Here’s how to tell when it’s worth a call.', cards
      + (cat === 'Sleep' ? tip('Look after yourself too', 'If exhaustion or low mood is getting hard to manage, talk to your own doctor, or call or text the National Maternal Mental Health Hotline: 1-833-852-6262.') : tip('Feeding is hard work', 'If nursing hurts or feeding feels overwhelming, a lactation consultant can help, and it’s often covered by insurance. Asking for help is normal.'))
      + note(cat === 'Sleep' ? 'Before a visit, jot down a few nights of bedtimes, wakes and feeds. It helps your pediatrician see the pattern.' : 'Before a visit, jot down a day of feeds and wet diapers. It helps your pediatrician see the pattern.'), cat === 'Sleep' ? 'moon' : 'bowl');
  }
  function settlePage() {
    const age = m(), choice = C().settlingGuide();
    if (age < 4) {
      // Read ahead: the parent can learn about sleep training before it's time, without being told to start.
      const methods = typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [];
      return detail('Sleep', 'Read ahead', 'Sleep training, for later', 'Sleep training is a choice, not a must. Families who choose it can start any time from about 4–6 months. Here’s what the options look like, so you can decide ahead of time.',
        list('The main approaches', methods.map((x, k) => row({ icon: 'moon', cat: 'Sleep', title: x.name, sub: x.title, onclick: go('chg:Sleep:d:method:' + k) }))) + tip('For now', 'Feeding, rocking or holding Maya to sleep is fine. You can’t spoil a young baby.') + list('', [row({ icon: 'heart', cat: 'Sleep', title: 'Help Maya fall asleep any way that works', sub: 'Soothing in the early months', onclick: go('chg:Sleep:d:soothe') })]), 'book');
    }
    return settleChoices(age, choice);
  }
  function soothePage() {
    return detail('Sleep', 'The early months', 'Helping Maya settle', 'Feeding, rocking or holding Maya to sleep is fine while sleep patterns are still developing. You can’t spoil a young baby.',
      steps(['Start winding down at the first sleepy cues, like a quiet stare or a yawn.', 'Keep a few familiar steps: a feed, a diaper and a quiet song.', 'Put {o} down on {p} back in {p} own sleep space.']) + list('', [row({ icon: 'heart', cat: 'Sleep', title: 'When the crying won’t stop', sub: 'What helps, and what to do if you need a break', onclick: go('chg:Sleep:d:crying') })]) + tip('Sleep training comes later, if at all', 'It’s an optional choice, usually considered from around 4–6 months.'), 'moon');
  }
  function settleChoices(age, choice) {
    const opts = [['learn', 'Compare sleep-training methods', 'See the main approaches side by side'], ['trying', 'Support while sleep training', 'How to handle a rough night'], ['routine', 'Keep a routine working', 'After short naps, travel or illness'], ['help', 'Settle with my help', 'Feeding or rocking to sleep can stay']];
    let content = '';
    if (choice === 'learn') {
      const methods = typeof sleepTrainingMethods === 'function' ? sleepTrainingMethods() : [];
      content = list('The main approaches', methods.map((x, k) => row({ icon: 'moon', cat: 'Sleep', title: x.name, sub: x.title, onclick: go('chg:Sleep:d:method:' + k) })));
    }
    if (choice === 'trying') content = steps(['Compare a few nights, not one. Less time settling or less help needed is progress.', 'After a rough night, meet hunger, discomfort or illness first, then go back to your usual response.', 'If it isn’t getting easier after a week or two, pause and talk it through with your pediatrician.']);
    if (choice === 'routine') content = steps([age < 8 ? 'If naps are short and Maya’s tired again, keep offering the extra sleep.' : age < 12 ? 'New skills and separation anxiety can disrupt settling. Practice by day and keep bedtime familiar.' : 'One refused nap doesn’t mean {s’s} ready for one nap. Look for a pattern first.', 'After illness or travel, give the comfort {s} {need|needs}, then return to your familiar bedtime steps.', 'If sleep stays hard for a while, notice whether it’s falling asleep, waking or staying asleep, and mention it to your pediatrician.']);
    if (choice === 'help') content = steps(['Keep a short lead-in you can repeat: a feed, a diaper, then a song or book.', 'Feeding, rocking or holding to sleep can stay part of it, if it works for you.', 'Show other caregivers the same steps, so Maya hears familiar cues from everyone.']);
    return detail('Sleep', 'Optional', 'Sleep training, if you choose it', 'Sleep training is a choice, not a must. Helping Maya fall asleep can stay part of your routine if it works for you.',
      `<p class="hub-group">What would help right now?</p>` + options(opts.map(o => [o[0], o[1], o[2]]), choice, k => `chgChooseSettling('${k}')`) + `<div data-settling-guide="${choice}">${content}</div>`, 'moon');
  }

  /* ---------- actions ---------- */
  window.hubToggleReady = i => { const r = Object.assign({}, L().ready); r[i] = !r[i]; store('ready', r); C().rerender(); };
  window.hubAllergen = k => { const a = Object.assign({}, L().allergens); a[k] = !a[k]; store('allergens', a); C().rerender(); };
  window.hubApproach = k => { store('approach', k); if (k !== 'both') store('style', k); C().rerender(); };
  window.hubStyle = k => { store('style', k); C().rerender(); };
  window.hubSleepSetUp = () => { const st = L().safe || (L().safe = { Sleep: {}, Feeding: {} }); st.Sleep = Object.assign({}, st.Sleep, { 0: true, 1: true, 2: true }); C().save(); C().rerender(); };
  window.hubFeedingSummary = () => feedingSummary(C().CFG.Feeding.stage(m()), C().CFG.Feeding.stage(m()));

  /* ---------- routing ---------- */
  const basePage = window.changesPage, baseRoute = window.changesRoute;
  window.changesPage = function (cat) {
    if (cat === 'Feeding') { const cur = C().CFG.Feeding.stage(m()); return feedingSummary(cur, cur); }
    if (cat === 'Sleep') { const cur = C().CFG.Sleep.stage(m()); return sleepSummary(cur, cur); }
    return basePage(cat);
  };
  window.changesRoute = function (p) {
    const [, cat, screen, a, b] = p.split(':');
    if ((cat === 'Feeding' || cat === 'Sleep') && !screen) return window.changesPage(cat);
    if (cat === 'Feeding' && screen === 's') { const cur = C().CFG.Feeding.stage(m()), v = Number(a); return feedingSummary(Number.isInteger(v) && C().DATA.Feeding.CH[v] ? v : cur, cur); }
    if (cat === 'Feeding' && screen === 'd') return feedingDetail(a, b);
    if (cat === 'Feeding' && screen === 'safe') return firstAid();
    if (cat === 'Feeding' && screen === 'allergy') return feedingDetail('allergens');
    if ((cat === 'Feeding' || cat === 'Sleep') && screen === 'help') return helpPage(cat);
    if (cat === 'Sleep' && screen === 'settle') return settlePage();
    if (cat === 'Sleep' && screen === 's') { const cur = C().CFG.Sleep.stage(m()), v = Number(a); return sleepSummary(Number.isInteger(v) && C().DATA.Sleep.CH[v] ? v : cur, cur); }
    if (cat === 'Sleep' && screen === 'd') return sleepDetail(a, b);
    if (cat === 'Sleep' && screen === 'safe') return sleepDetail('safe');
    if ((cat === 'Sleep' || cat === 'Feeding') && screen === 'e') return eventDetail(cat, Number(a));
    return baseRoute(p);
  };
  // Building blocks shared with the other categories (js/hub-categories.js).
  window.__hub = { F, row, list, hero, tiles, glanceCard, versus, next, more, note, art, chev, chip, tip, steps, video, detail, mixedList, ticks, listMore,
    pills: (label, items) => `<nav class="hub-pills" id="hub-pills" aria-label="${esc(label)}">${items.map(it => `<button class="${it.on ? 'is-on' : ''} ${it.now ? 'is-now' : ''}" onclick="${it.onclick}" ${it.on ? 'aria-current="step"' : ''}>${esc(it.label)}${it.now && !it.on ? ' <span class="hub-now">Now</span>' : ''}</button>`).join('')}</nav>` };
  window.positionHubPills = function () {
    const r = document.getElementById('hub-pills'), s = r && r.querySelector('.is-on');
    if (r && s) r.scrollLeft = s.offsetLeft - (r.clientWidth - s.offsetWidth) / 2;
  };
})();
