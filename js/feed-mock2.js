/* MOCKUP: Feeding as one system, for one baby (2 months, breast milk and formula). Every page is clickable. */
(function () {
  const H = () => window.__hub, F = s => H().F(s), CAT = 'Feeding';
  const go = id => `openPage('chg:Feeding:mock:${id}')`;
  const C = { pink: ['#fbe4ec', '#9b4766'], blue: ['#e7effc', '#46638c'], yellow: ['#fff3dc', '#8a6a2a'], green: ['#e4f3ec', '#356651'], peach: ['#fdeee6', '#9a5a3c'], lilac: ['#efedff', '#625084'] };
  const TILE = { blue: ['#e7effc', '#46638c'], pink: ['#fbe4ec', '#9b4766'], peach: ['#fdeee6', '#9a5a3c'], yellow: ['#fff3dc', '#8a6a2a'] };
  const ART = {
    often: n => `<svg viewBox="0 0 120 40"><path d="M6 28h108" stroke="#46638c" stroke-opacity=".25" stroke-width="2.5" stroke-linecap="round"/>${Array.from({ length: n }, (_, i) => `<circle cx="${10 + i * (100 / (n - 1))}" cy="28" r="5" fill="#46638c"/>`).join('')}<path d="M10 16 q${50 / (n - 1)} -10 ${100 / (n - 1)} 0" stroke="#46638c" stroke-width="2" fill="none" stroke-dasharray="3 4"/></svg>`,
    drops: n => `<svg viewBox="0 0 120 40">${Array.from({ length: n }, (_, i) => `<path d="M${10 + i * 12} 14 q5 8 0 14 q-5 -6 0 -14Z" fill="#9b4766" fill-opacity=".75"/>`).join('')}</svg>`,
    bottle: f => `<svg viewBox="0 0 120 40"><rect x="6" y="12" width="96" height="18" rx="9" fill="#fff" fill-opacity=".8"/><rect x="6" y="12" width="${96 * f}" height="18" rx="9" fill="#d98a6a"/><rect x="102" y="16" width="12" height="10" rx="4" fill="#d98a6a" fill-opacity=".5"/></svg>`,
    diapers: n => `<svg viewBox="0 0 120 40">${Array.from({ length: n }, (_, i) => `<path d="M${6 + i * 19} 12 h16 v8 q-8 10 -16 0Z" fill="#c9a24a" fill-opacity=".8"/>`).join('')}</svg>`
  };
  const css = `<style>
    #main .fm-day{list-style:none;margin:0;padding:6px 16px}
    #main .fm-day li{display:grid;grid-template-columns:64px 30px 1fr;align-items:center;gap:8px;padding:9px 0;border-top:1px solid var(--line)}
    #main .fm-day li:first-child{border-top:0}
    #main .fm-day time{font-size:13px;font-weight:600;color:#9b4766}
    #main .fm-day .fm-ic{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;padding:5px;box-sizing:border-box}
    #main .fm-day .fm-ic svg{width:100%;height:100%}
    #main .fm-day b{font-weight:600;font-size:14.5px}#main .fm-day small{display:block;font-size:12.5px;color:var(--muted)}
    #main .fm-two{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 14px}
    #main .fm-two>div{border-radius:18px;padding:14px}#main .fm-two small{display:block;font-size:12.5px;font-weight:600;margin-bottom:2px}#main .fm-two b{display:block;font-size:20px;margin:2px 0}#main .fm-two span{font-size:13px;line-height:1.35;color:#5e5a75}
    #main .fm-store{padding:4px 14px}#main .fm-store table{width:100%;border-collapse:collapse;font-size:14px}
    #main .fm-store th{font-size:12px;text-align:left;color:#9b4766;padding:10px 4px 6px}#main .fm-store td{padding:10px 4px;border-top:1px solid var(--line);vertical-align:top}
    #main .fm-store td:first-child{font-weight:600;width:38%}
    #main .fm-spill{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px;margin:0 0 12px}
    #main .fm-spill>div{background:#f6f1ec;border-radius:14px;padding:10px;text-align:center}#main .fm-spill svg{width:100%;height:auto}
    #main .fm-spill b{display:block;font-size:14px}#main .fm-spill small{font-size:12.5px;color:var(--muted)}
    #main .fm-year{list-style:none;margin:0;padding:4px 16px;position:relative}
    #main .fm-year li{display:grid;grid-template-columns:18px 1fr auto;gap:12px;align-items:center;padding:11px 0;border-top:1px solid var(--line)}
    #main .fm-year li:first-child{border-top:0}
    #main .fm-year i{width:12px;height:12px;border-radius:50%;border:2px solid #9b4766;background:#fff}
    #main .fm-year li.is-done i{background:#9b4766}#main .fm-year li.is-next i{background:#f4b9cc}
    #main .fm-year b{font-size:14.5px;font-weight:600;display:block}#main .fm-year small{font-size:12.5px;color:var(--muted)}
    #main .fm-year em{font-style:normal;font-size:11px;font-weight:700;color:#9b4766;background:#fbe4ec;border-radius:99px;padding:2px 8px}
    #main .fm-year li.is-done b{color:var(--muted)}
  </style>`;
  const head = (ctx, title, lead, c = C.pink) => `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}"><p class="hub-context">${F(ctx)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`;
  const page = inner => `${css}<div class="quiet-category hub-page hub-detail care-v2" data-overview="${CAT}" style="${yearTheme(CAT)}">${detailPageTop(CAT)}${inner}</div>`;
  const h2 = t => `<h2 class="hub-h2">${F(t)}</h2>`;
  const p = t => `<p class="care-p">${F(t)}</p>`;
  const call = t => `<p class="care-p"><b>${F('Call your pediatrician:')}</b> ${F(t)}</p>`;
  const urgent = t => `<p class="care-urgent"><b>${F('Get help right away:')}</b> ${F(t)}</p>`;
  const row = (c, icon, label, t, sub, to) => `<button class="hub-row hl-row" style="--hl-bg:${C[c][0]};--hl-ink:${C[c][1]}" onclick="${to ? go(to) : ''}"><span class="hub-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy">${label ? `<small>${F(label)}</small>` : ''}<b>${F(t)}</b>${sub ? `<small>${F(sub)}</small>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  const steps = (items, n) => hubIconSteps(items, CAT, F(items.map(t => t[1] + ': ' + t[2]).join('. ')), n);

  const P = {
    // HOME
    h: () => { const h = H();
      const pills = h.pills('Feeding by age', [['Newborn', '0–6 weeks'], ['Milk feeds', '6 weeks–4 months'], ['Ready for solids', '4–6 months'], ['First foods', '6–9 months'], ['Meals', '9–12 months']].map(([l, a], i) => ({ label: l, age: a, on: i === 1, now: i === 1, onclick: '' })), CAT);
      const tiles = [['blue', ART.often(5), 'How often', 'Every 2–4 hours', 'From the start of one feed'], ['pink', ART.drops(8), 'Feeds a day', '7–9', 'Nursing and bottles, counted together'], ['peach', ART.bottle(.5), 'Per bottle', '4–5 oz formula', 'Breast milk: 3–4 oz'], ['yellow', ART.diapers(6), 'Wet diapers', '6 or more', 'A day']];
      let b = `<header class="hub-hero"><p class="hub-eyebrow">${F('Milk feeds')}</p><h1>${F('Feeds get quicker and further apart')}</h1><p class="hub-lead">${F('Ari is better at eating now, so feeds take less time, and many babies take their longest stretch at night.')}</p></header>`;
      b += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('Feeds now')}</b><button class="hub-card-cta" onclick="${go('day')}">${F('Example day')} ›</button></span><div class="hub-tiles">${tiles.map(([c, art, l, v, sub]) => `<div class="sm-tile" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)}</span></div>`).join('')}</div><span class="hub-card-note"><b>${F('Every day')}</b> ${F('Vitamin D drops, while Ari gets breast milk.')} <button class="hub-inline-link" onclick="${go('vitd')}" style="all:unset;cursor:pointer;color:#9b4766;font-weight:600">${F('How')} ›</button></span></section>`;
      const door = (bg, ink, icon, t, sub, to) => `<button class="hub-rough-card care-rash-card" style="background:${bg};color:${ink};margin:12px 0 0" onclick="${go(to)}"><span class="hub-rough-moon" aria-hidden="true">${hubArt(icon, CAT)}</span><span class="hub-rough-copy"><b>${F(t)}</b><small>${F(sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
      b += door('#fbe4ec', '#9b4766', 'eye', 'Is this normal?', 'Getting enough, spit-up, gas, fussing', 'worry');
      b += door('#efedff', '#625084', 'bottle', 'Show me how', 'Latch, bottles, formula, storing milk', 'how');
      b += h2('Coming up') + `<div class="hub-list">${row('lilac', 'clock', 'Often around 3 months', 'Going back to work?', 'Start a few weeks ahead', 'work')}</div>`;
      b += h.next('Next, around 4 months', 'Ready for solids', '') + h.note('Ages are typical. Every baby moves at their own pace.');
      return `${css}<div class="quiet-category hub-page care-v2" data-overview="${CAT}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${b}</div>`; },

    // 1 · HOW MUCH, HOW OFTEN: a day of feeds at this age
    day: () => page(head('Feeds now', 'A day of feeds at 2 months', 'An example, not a schedule. Ari leads, and no two days look the same.')
      + `<div class="hub-card"><ol class="fm-day">${[['7:00', 'drop', 'Nurse', 'Often 10–15 minutes'], ['10:00', 'bottle', 'Bottle', '4 oz'], ['1:00', 'drop', 'Nurse', ''], ['4:00', 'drop', 'Nurse', ''], ['6–8 pm', 'drop', 'A few feeds close together', 'Normal in the evening'], ['10:00', 'bottle', 'Bottle', '4–5 oz, then bed'], ['3:00 am', 'drop', 'Nurse', 'After his longest stretch']].map(([t, i, w, s]) => `<li><time>${F(t)}</time><span class="fm-ic" style="background:${i === 'bottle' ? '#fdeee6' : '#fbe4ec'}">${hubArt(i, CAT)}</span><span><b>${F(w)}</b>${s ? `<small>${F(s)}</small>` : ''}</span></li>`).join('')}</ol></div>`
      + h2('Hungry, or full?') + `<div class="fm-two"><div style="background:#e7effc"><small style="color:#46638c">${F('Hungry')}</small><span>${F('Rooting, hands to mouth, lip smacking. Crying comes last.')}</span></div><div style="background:#e4f3ec"><small style="color:#356651">${F('Full')}</small><span>${F('Slows down, turns away, relaxed open hands.')}</span></div></div>`
      + ''),

    vitd: () => page(head('Every day', 'Vitamin D drops', 'Babies who get any breast milk need 400 IU every day. Once a day, at the same time, is easiest to remember.', C.green)
      + h2('Ways to give it') + steps([['bottle', 'In a little milk', 'About an ounce in a bottle, before the rest of the feed'], ['heart', 'On the nipple', 'Just before he latches'], ['hand', 'Inside the cheek', 'Slowly, with the dropper']], false)
      + `<p class="ss-small"><b>${F('Not in a full bottle:')}</b> ${F('if he doesn’t finish it, he misses some. Check the label for the dose, since drops differ.')}</p>`
      + `<p class="ss-know"><b>${F('When to stop')}</b>${F('Once Ari drinks about 32 oz of formula a day. Formula has vitamin D added.')}</p>` + `<p class="ss-small"><b>${F('Coming up:')}</b> ${F('at the 4-month checkup, ask about iron.')}</p>`),

    // 2 · GETTING ENOUGH
    enough: () => page(head('Is this normal?', 'Is Ari getting enough?', 'At 2 months, two signs tell you, and you don’t need to measure what he drinks at the breast.', C.yellow)
      + steps([['diaper', '6 or more wet diapers', 'Every day, pale yellow'], ['heart', 'Steady growth', 'Along his curve at checkups'], ['smile', 'Content after most feeds', 'With some fussy evenings']], false)
      + h2('Also normal') + p('Poops can space out to once every few days on breast milk. Some feeds are short, some long.')
      + call('Fewer than 6 wet diapers a day, he seems hungry after most feeds, or he isn’t gaining at a checkup.')
      + urgent('No wet diaper in 8 hours, a sunken soft spot, or very hard to wake. Call your pediatrician right away.')),

    supply: () => page(head('Is this normal?', 'Softer breasts are normal now', 'Around 6–12 weeks, your supply settles to what Ari needs. Feeling less full doesn’t mean less milk.')
      + steps([['heart', 'Less full, less leaking', 'Your body has matched him'], ['clock', 'Shorter feeds', 'He’s quicker at it'], ['diaper', 'Diapers still 6+', 'The sign that matters']], false)
      + h2('Worried it’s too little?') + p('Feed more often and offer both sides. If you’re supplementing, nurse or pump for those feeds too. A lactation consultant can help.')
      + call('Fewer wet diapers, or slow weight gain at a checkup.')),

    spurt: () => page(head('Is this normal?', 'Hungrier days are normal', 'Every few weeks, Ari may want to feed much more for 2–3 days. Often around 6 weeks and 3 months.', C.blue)
      + steps([['clock', 'More feeds', 'Closer together, often in the evening'], ['heart', 'Fussier', 'And sometimes sleepier after'], ['smile', 'Then it settles', 'Usually in 2–3 days']], false)
      + h2('What helps') + p('Follow his lead and feed more often. If you nurse, the extra feeds tell your body to make more milk. It isn’t a sign your supply is low.')
      + call('Fewer wet diapers, or it lasts more than a few days.')),
    latch: () => page(head('Show me how', 'Latch and holds', 'A good latch feels like a strong tug, not a pinch.', C.pink)
      + h2('A good latch') + steps([['heart', 'Nose to nipple', 'Tummy to tummy with you'], ['smile', 'Wait for a wide mouth', 'Like a yawn'], ['hand', 'Bring him to you', 'Chin first, not you to him']], true)
      + `<p class="ss-small"><b>${F('Pinching?')}</b> ${F('Slide a clean finger into the corner of his mouth to break the seal, and try again.')}</p>`
      + h2('Four holds') + steps([['heart', 'Cradle', 'Head in the crook of your arm'], ['hand', 'Football', 'Tucked at your side. Easy after a C-section'], ['moon', 'Side-lying', 'You both lie on your sides'], ['smile', 'Laid-back', 'Helps with a fast letdown']], false)
      + call('Pain past the first minute of a feed, cracked or bleeding nipples, or a hot, red, painful area with a fever.')),
    formula: () => page(head('Show me how', 'Making a formula bottle', 'Follow the label exactly. The amounts matter.', C.peach)
      + steps([['hand', 'Wash your hands', 'And use a clean bottle'], ['drop', 'Water first', 'The amount on the label'], ['bowl', 'Level scoops', 'Then shake well'], ['heart', 'Test on your wrist', 'Warm or room temperature']], true)
      + `<p class="ss-small"><b>${F('Never add extra water or powder.')}</b> ${F('Too much or too little can make Ari sick.')}</p>`
      + `<div class="hub-list care-link">${row('blue', 'snow', '', 'How long it keeps once made', 'Fridge, counter and after a feed starts', 'basics')}</div>`),
    how: () => page(head('Feeding', 'Show me how', 'Step-by-step pictures for the everyday parts of feeding.', C.lilac)
      + `<div class="hub-list">${[row('pink', 'heart', '', 'Latch and holds', 'How a good latch feels, and four holds', 'latch'), row('lilac', 'bottle', '', 'Giving a bottle', 'Pacing, burping and nipple flow', 'bottle'), row('peach', 'bowl', '', 'Making a formula bottle', 'Water first, level scoops', 'formula'), row('blue', 'snow', '', 'Storing and warming milk', 'How long it keeps, and travel', 'basics')].join('')}</div>`),
    // HOW-TO
    bottle: () => page(head('Show me how', 'Giving a bottle', 'Pace each bottle. It lets Ari lead, like at the breast, so he takes what he needs and less air.', C.lilac)
      + steps([['hand', 'Hold him upright', 'Head higher than his tummy'], ['bottle', 'Bottle fairly level', 'Just enough milk in the tip'], ['clock', 'Pause every few sucks', 'Tip it down, then let him draw it back'], ['heart', 'Stop when he slows', 'Even if there’s milk left']], true)
      + h2('Time for a faster nipple?') + `<div class="fm-two"><div style="background:#efedff"><small style="color:#625084">${F('Too slow')}</small><span>${F('Sucks hard, gets frustrated, the nipple collapses, feeds take over 20 minutes.')}</span></div><div style="background:#fdeee6"><small style="color:#9a5a3c">${F('Too fast')}</small><span>${F('Gulping, coughing, or milk spilling from his mouth.')}</span></div></div>`
      + `<p class="ss-small"><b>${F('Burping:')}</b> ${F('every 2–3 oz and at the end. No burp after a few minutes is fine.')}</p>`),

    basics: () => page(head('Show me how', 'Storing and warming milk', 'Breast milk and formula, side by side.', C.blue)
      + `<div class="hub-card fm-store"><table><tr><th></th><th>${F('Breast milk')}</th><th>${F('Formula, once made')}</th></tr>${[['On the counter', 'Up to 4 hours', 'Up to 2 hours'], ['Once a feed starts', 'Within 2 hours', 'Within 1 hour'], ['In the fridge', 'Up to 4 days', 'Up to 24 hours'], ['In the freezer', 'Best within 6 months', 'Don’t freeze']].map(r => `<tr>${r.map(c => `<td>${F(c)}</td>`).join('')}</tr>`).join('')}</table></div>`
      + h2('Warming a bottle') + steps([['drop', 'Warm water', 'Or a bottle warmer'], ['hand', 'Swirl', 'To mix the fat back in'], ['heart', 'Test on your wrist', 'Warm, not hot']], true)
      + `<p class="ss-small"><b>${F('Never the microwave.')}</b> ${F('It heats unevenly. Cold or room temperature is fine too.')}</p>`
      + h2('Out and about') + p('A cooler bag with frozen ice packs keeps breast milk up to 24 hours. Flying, breast milk and formula are allowed in carry-on bags in more than 3.4 oz: tell security at the start.')),

    // 3 · TRANSITIONS: one guide, the same shape for every change
    work: () => page(head('Coming up · often around 3 months', 'Going back to work', 'A few weeks of prep makes the first day easier for you both.', C.lilac)
      + hubStageStrip({ title: 'When to start', items: [['clock', '3–4 weeks before', 'Pump once a day'], ['bottle', '2 weeks before', 'Someone else gives a bottle'], ['heart', 'First week back', 'Pump about every 3 hours']], cat: CAT, caption: 'Start pumping once a day 3 to 4 weeks before, have someone else give a bottle 2 weeks before, and pump about every 3 hours once you are back.' })
      + h2('How') + `<ol class="care-do">${['Pump after a morning feed, when most parents have the most milk.', 'Freeze it flat in small bags of 2–4 oz, so nothing goes to waste.', 'Ask your caregiver to pace bottles and follow his cues.', 'At work, pump for each feed you miss.'].map(t => `<li>${F(t)}</li>`).join('')}</ol>`
      + h2('What’s normal') + p('What you pump is often less than he gets at the breast. Many babies refuse a bottle from a parent but take it from someone else.')
      + `<p class="ss-small"><b>${F('Your rights:')}</b> ${F('most workplaces must give you break time and a private space that isn’t a bathroom.')}</p>`
      + `<div class="hub-list care-link">${row('blue', 'snow', '', 'How long milk keeps', 'On the counter, fridge and freezer', 'basics')}</div>`),

    year: () => page(head('Feeding this year', 'What changes, and when', 'Ages are typical. Each one opens a short guide when it’s close.', C.lilac)
      + `<div class="hub-card"><ol class="fm-year">${[['done', 'Milk comes in', 'Days 2–5'], ['done', 'A first bottle', 'From 3–4 weeks'], ['next', 'Going back to work', 'Often around 3 months', 'work'], ['', 'A faster nipple flow', 'When bottles get slow'], ['', 'Ready for solids', '4–6 months'], ['', 'First tastes and allergens', 'Around 6 months'], ['', 'Textures and finger foods', '7–8 months'], ['', 'Three meals', 'Around 9 months'], ['', 'Whole milk and cups', '12 months'], ['', 'Nursing past 1, or stopping', 'When you choose']].map(([s, t, w, to]) => `<li class="${s ? 'is-' + s : ''}" ${to ? `onclick="${go(to)}" style="cursor:pointer"` : ''}><i></i><span><b>${F(t)}</b><small>${F(w)}</small></span>${s === 'next' ? `<em>${F('Coming up')}</em>` : ''}</li>`).join('')}</ol></div>`),

    // WORRIES: a short list, each its own answer
    worry: () => page(head('Feeding', 'Is this normal?', 'Pick what you’re seeing.')
      + `<div class="hub-card care-folds care-lookoff">${[['diaper', 'Is he getting enough?', 'The two signs that matter now', 'enough'], ['clock', 'Suddenly hungrier', 'Growth spurts, often around 6 weeks and 3 months', 'spurt'], ['bottle', 'Spit-up or vomit?', 'How much is normal, and when to call', 'spit'], ['drop', 'Gas or lots of crying', 'What helps, and gripe water'], ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full'], ['hand', 'Sore nipples or breasts', 'Usually the latch, and when to call'], ['smile', 'Softer breasts, or less milk?', 'What’s normal as your supply settles', 'supply'], ['star', 'Won’t take a bottle', 'Common for breastfed babies']].map(([i, t, s, to]) => `<button class="care-pick" onclick="${to ? go(to) : ''}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>`),

    spit: () => page(head('Is this normal?', 'Spit-up or vomit?', 'Most babies spit up. It peaks around 4 months and is usually gone by the first birthday.')
      + `<figure class="hub-card fm-spill" role="img" aria-label="Spill one tablespoon of milk on the counter. Most spit-up is less than it looks."><div><svg viewBox="0 0 120 70"><ellipse cx="60" cy="40" rx="46" ry="20" fill="#f4e6d6"/><ellipse cx="54" cy="38" rx="30" ry="12" fill="#fff" stroke="#e6d6c4"/></svg><b>${F('1 tablespoon')}</b><small>${F('Spill one on the counter: most spit-up is less than it looks')}</small></div><div><svg viewBox="0 0 120 70"><path d="M20 50 q40 -40 80 -30" stroke="#c0546f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M92 14 l12 6 -12 6" stroke="#c0546f" stroke-width="5" fill="none" stroke-linecap="round"/></svg><b style="color:#a3324f">${F('Forceful')}</b><small>${F('Shoots out, after most feeds: that’s vomiting')}</small></div></figure>`
      + h2('What helps') + steps([['hand', 'Upright after feeds', 'For 20–30 minutes'], ['bottle', 'Smaller feeds', 'A little more often'], ['heart', 'Burp mid-feed', 'And at the end']], false)
      + call('Forceful or projectile vomiting, fewer wet diapers, refusing feeds, or slow weight gain.')
      + urgent('Green or bloody vomit, or vomiting with a fever under 3 months.'))
  };
  /* ---------- Three directions for the home ---------- */
  const glanceCard = (note = true) => { const tiles = [['blue', ART.often(5), 'How often', 'Every 2–4 hours', 'From the start of one feed'], ['pink', ART.drops(8), 'Feeds a day', '7–9', 'Nursing and bottles, counted together'], ['peach', ART.bottle(.5), 'Per bottle', '4–5 oz formula', 'Breast milk: 3–4 oz'], ['yellow', ART.diapers(6), 'Wet diapers', '6 or more', 'A day']];
    return `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('Feeds now')}</b><button class="hub-card-cta" onclick="${go('day')}">${F('Example day')} ›</button></span><div class="hub-tiles">${tiles.map(([c, art, l, v, sub]) => `<div class="sm-tile" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)}</span></div>`).join('')}</div>${note ? `<span class="hub-card-note"><b>${F('Every day')}</b> ${F('Vitamin D drops, while Ari gets breast milk.')} <button onclick="${go('vitd')}" style="all:unset;cursor:pointer;color:#9b4766;font-weight:600">${F('How')} ›</button></span>` : ''}</section>`; };
  const shell = (inner, dir) => { const h = H();
    const pills = h.pills('Feeding by age', [['Newborn', '0–6 weeks'], ['Milk feeds', '6 weeks–4 months'], ['Ready for solids', '4–6 months'], ['First foods', '6–9 months'], ['Meals', '9–12 months']].map(([l, a], i) => ({ label: l, age: a, on: i === 1, now: i === 1, onclick: '' })), CAT);
    const sw = `<nav class="fd-switch">${['D', 'A', 'C'].map(k => `<button class="${k === dir ? 'on' : ''}" onclick="${go('dir' + k)}">${k === 'D' ? 'Cheat sheet' : k === 'A' ? 'Answers up front' : 'Feeding plan'}</button>`).join('')}</nav>`;
    return `${css}<style>#main .fd-switch{position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:50;display:flex;gap:4px;background:#2b2840;padding:5px;border-radius:99px;box-shadow:0 6px 20px rgba(0,0,0,.2)}#main .fd-switch button{border:0;background:none;color:#fff;font:inherit;font-size:12px;font-weight:600;padding:7px 10px;border-radius:99px;cursor:pointer;white-space:nowrap}#main .fd-switch button.on{background:#fff;color:#2b2840}
      #main .fa-card{display:grid;grid-template-columns:40px 1fr;gap:12px;padding:14px 16px;border-top:1px solid var(--line)}#main .fa-card:first-child{border-top:0}#main .fa-card .hub-dot{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;padding:8px;box-sizing:border-box}#main .fa-card b{display:block;font-size:15.5px;font-weight:600;margin-bottom:3px}#main .fa-card p{margin:0;font-size:14.5px;line-height:1.45;color:#5e5a75}#main .fa-card button{all:unset;cursor:pointer;display:inline-block;margin-top:6px;font-size:13.5px;font-weight:600;color:#9b4766}
      #main .fb-search{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:13px 14px;margin:0 0 14px;color:#8a8494;font-size:15px}#main .fb-search svg{width:18px;height:18px}
      #main .fb-q{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;width:100%;padding:13px 16px;border-top:1px solid var(--line)}#main .fb-q:first-child{border-top:0}#main .fb-q b{display:block;font-size:15px;font-weight:600}#main .fb-q span{display:block;font-size:13.5px;line-height:1.4;color:#5e5a75;margin-top:2px}#main .fb-q i{font-style:normal;color:#aaa}
      #main .fb-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}#main .fb-chips button{border:0;background:#efedff;color:#625084;font:inherit;font-size:14px;font-weight:600;padding:9px 14px;border-radius:99px;cursor:pointer}
      #main .fc-check{all:unset;cursor:pointer;width:26px;height:26px;border-radius:50%;border:2px solid #9b4766;display:grid;place-items:center;color:#fff;font-size:14px;flex:none}#main .fc-check.on{background:#9b4766}
      #main .rt-line .fc-check{margin-left:auto}</style>
      <div class="quiet-category hub-page care-v2" data-overview="${CAT}" style="${yearTheme(CAT)};padding-bottom:70px">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${inner}${h.next('Next, around 4 months', 'Ready for solids', '')}${h.note('Ages are typical. Every baby moves at their own pace.')}</div>${sw}`; };
  const hero = (t, l) => `<header class="hub-hero"><p class="hub-eyebrow">${F('Milk feeds')}</p><h1>${F(t)}</h1><p class="hub-lead">${F(l)}</p></header>`;
  const fa = (c, icon, t, body, to, more = 'More') => `<div class="fa-card"><span class="hub-dot" style="background:${C[c][0]};color:${C[c][1]}">${hubArt(icon, CAT)}</span><div><b>${F(t)}</b><p>${F(body)}</p>${to ? `<button onclick="${go(to)}">${F(more)} ›</button>` : ''}</div></div>`;
  window.fcTick = k => { window.__fc = window.__fc || {}; window.__fc[k] = !window.__fc[k]; openPage('chg:Feeding:mock:dirC'); };
  const on = k => !!(window.__fc || {})[k];
  Object.assign(P, {
    // A · Answers up front: the app brings this stage's answers to you. Read the home and you're covered.
    dirA: () => shell(hero('Feeds get quicker and further apart', 'Ari is better at eating now, so feeds take less time. Here’s what matters at 2 months.')
      + glanceCard()
      + h2('What to know at 2 months') + `<div class="hub-card">${fa('yellow', 'diaper', 'He’s getting enough if…', '6 or more wet diapers a day and steady growth at checkups. You don’t need to measure what he drinks at the breast.', 'enough')}${fa('blue', 'clock', 'Hungrier days are normal', 'Growth spurts often come around 6 weeks and 3 months. Feed more for 2–3 days. It isn’t low supply.', 'spurt')}${fa('pink', 'drop', 'Softer breasts don’t mean less milk', 'Your supply settles around 6–12 weeks to match what he needs.', 'supply')}</div>`
      + h2('Common now, and usually fine') + `<div class="hub-card">${fa('peach', 'bottle', 'Spit-up', 'Most babies spit up, and it peaks around 4 months. Call if it’s forceful, green or bloody.', 'spit')}${fa('lilac', 'heart', 'Gas and fussy evenings', 'Burp mid-feed and bicycle his legs. Ask your pediatrician before gas drops or gripe water.', '')}</div>`
      + `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('worry')}">${F('Something else?')} ›</button></div>`
      + h2('Getting ready: back to work') + hubStageStrip({ title: 'If you’re going back around 3 months', items: [['clock', '3–4 weeks before', 'Pump once a day'], ['bottle', '2 weeks before', 'Someone else gives a bottle'], ['heart', 'Once you’re back', 'Pump about every 3 hours']], cat: CAT, caption: 'Pump once a day 3 to 4 weeks before, someone else gives a bottle 2 weeks before, and pump about every 3 hours once back.' })
      + `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('work')}">${F('The full plan')} ›</button></div>`, 'A'),

    // B · Questions: the questions parents ask at this age, each with its answer showing. Tap only for more.
    dirB: () => shell(hero('Feeds get quicker and further apart', 'Ari is better at eating now, so feeds take less time.')
      + `<div class="fb-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>${F('Ask about feeding')}</div>`
      + glanceCard()
      + h2('What parents ask at 2 months') + `<div class="hub-card">${[['Is he getting enough?', 'Yes, if he has 6 or more wet diapers a day and grows steadily at checkups.', 'enough'], ['Why is he suddenly so hungry?', 'Probably a growth spurt. Feed more for 2–3 days, and it settles.', 'spurt'], ['Is this much spit-up normal?', 'Usually. It peaks around 4 months. Forceful, green or bloody is a call.', 'spit'], ['My breasts feel softer. Is my milk drying up?', 'No. Your supply settles around now to match him.', 'supply'], ['How long can pumped milk sit out?', 'Up to 4 hours. Formula, up to 2 hours once made.', 'basics'], ['When should I start pumping for work?', '3–4 weeks before, once a day after a morning feed.', 'work']].map(([q, a, to]) => `<button class="fb-q" onclick="${go(to)}"><span><b>${F(q)}</b><span>${F(a)}</span></span><i aria-hidden="true">›</i></button>`).join('')}</div>`
      + `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('worry')}">${F('More questions')} ›</button></div>`
      + h2('Show me how') + `<div class="fb-chips">${[['Latch and holds', 'latch'], ['Pacing a bottle', 'bottle'], ['Making formula', 'formula'], ['Storing milk', 'basics']].map(([t, to]) => `<button onclick="${go(to)}">${F(t)}</button>`).join('')}</div>`, 'B'),

    // C · Your feeding plan: like Everyday care's routine. What to do, each feed, each day, this month, and a plan for what's next.
    dirC: () => { const line = (c, icon, label, val, sub, to, tick) => `<button class="rt-line" style="--hl-bg:${C[c][0]};--hl-ink:${C[c][1]}" onclick="${tick ? `fcTick('${tick}')` : go(to)}"><span class="rt-ic">${hubArt(icon, CAT)}</span><span class="rt-copy"><small>${F(label)}</small><b>${F(val)}</b>${sub ? `<i>${F(sub)}</i>` : ''}</span>${tick ? `<span class="fc-check ${on(tick) ? 'on' : ''}" aria-hidden="true">${on(tick) ? '✓' : ''}</span>` : '<span class="hub-chev" aria-hidden="true">›</span>'}</button>`;
      const plan = [['3–4 weeks before', 'Pump once a day, after a morning feed', 'w1'], ['2 weeks before', 'Someone else gives a bottle', 'w2'], ['Before day one', 'Freeze milk flat in 2–4 oz bags', 'w3'], ['At work', 'Pump about every 3 hours', 'w4']];
      return shell(hero('Feeds get quicker and further apart', 'Ari is better at eating now, so feeds take less time, and many babies take their longest stretch at night.')
      + glanceCard(false)
      + `<section class="rt-card"><div class="rt-head"><b>${F('Ari’s feeding plan')}</b><small>${F('At 2 months')}</small></div>`
      + `<div class="rt-group"><p class="rt-when">${F('Each day')}</p>${line('green', 'drop', 'Vitamin D', on('d') ? 'Given today' : 'Drops today', 'Tap when done', '', 'd')}${line('yellow', 'diaper', 'Getting enough', 'Wet diapers and steady growth', 'The two signs that matter now', 'enough')}</div>`
      + `<div class="rt-group"><p class="rt-when">${F('This month')}</p>${line('pink', 'heart', 'Growth spurt', 'Hungrier for a few days, around 3 months', 'Feed more. It isn’t low supply', 'spurt')}${line('pink', 'drop', 'Your milk', 'Softer breasts are normal', 'Your supply has settled to match him', 'supply')}</div></section>`
      + `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:14px" onclick="${go('worry')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Is this normal?')}</b><small>${F('Spit-up, gas, fussing, sore nipples')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`
      + `<button class="hub-rough-card care-rash-card" style="background:#efedff;color:#625084;margin-top:12px" onclick="${go('how')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('bottle', CAT)}</span><span class="hub-rough-copy"><b>${F('Show me how')}</b><small>${F('Latch, bottles, formula, storing milk')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`, 'C'); }
  });
  // D · Cheat sheet: everything for this age on one calm card, personalized to how the family feeds.
  // Every line shows the answer itself; tapping only adds the how and why.
  P.dirD = () => { const feed = (typeof profile !== 'undefined' && profile.feed) || 'Both', breast = feed !== 'Formula', formula = feed !== 'Breast milk';
    const line = (c, icon, label, val, sub, to) => `<button class="rt-line" style="--hl-bg:${C[c][0]};--hl-ink:${C[c][1]}" onclick="${to ? go(to) : ''}"><span class="rt-ic">${hubArt(icon, CAT)}</span><span class="rt-copy"><small>${F(label)}</small><b>${F(val)}</b>${sub ? `<i>${F(sub)}</i>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    const group = (t, lines) => lines.filter(Boolean).length ? `<div class="rt-group"><p class="rt-when">${F(t)}</p>${lines.filter(Boolean).join('')}</div>` : '';
    const tiles = [['blue', ART.often(5), 'How often', breast ? 'Every 2–4 hours' : 'Every 3–4 hours', 'From the start of one feed'], ['pink', ART.drops(8), 'Feeds a day', breast ? '7–9' : '6–8', feed === 'Both' ? 'Nursing and bottles, counted together' : breast ? 'Shorter, quicker feeds' : 'About 24–32 oz in all'], feed === 'Breast milk' ? ['peach', ART.bottle(.5), 'Each feed', 'Until he lets go', 'Often 10–15 minutes now'] : ['peach', ART.bottle(.5), 'Per bottle', '4–5 oz', feed === 'Both' ? 'Breast milk bottles: 3–4 oz' : 'Of formula'], ['yellow', ART.diapers(6), 'Wet diapers', '6 or more', 'A day']];
    const sheet = `<section class="rt-card"><div class="rt-head"><b>${F('Feeding at 2 months')}</b><small>${F(feed === 'Both' ? 'Both' : feed)}</small></div>`
      + group('Every day', [breast || feed === 'Formula' ? line('green', 'drop', 'Vitamin D', breast ? 'Drops every day' : 'Drops until about 32 oz a day', breast ? '400 IU, while he gets breast milk' : 'Formula has it added. Ask your pediatrician', 'vitd') : '', line('yellow', 'diaper', 'Getting enough', 'Wet diapers and steady growth', 'You don’t need to measure feeds', 'enough')])
      + group('Your milk', breast ? [line('pink', 'heart', 'Supply', 'Softer breasts are normal now', 'Your supply has settled to match him', 'supply'), line('blue', 'snow', 'Pumped milk keeps', 'Counter 4 h · fridge 4 days', 'Freezer: best within 6 months', 'basics')] : [])
      + group('Bottles', formula ? [line('lilac', 'bottle', 'Giving a bottle', 'Level, with pauses', 'Stop when he slows down', 'bottle'), feed !== 'Breast milk' ? line('peach', 'bowl', 'Formula keeps', '2 h once made, 1 h once he starts', 'Fridge: 24 hours', 'formula') : ''] : [])
      + group('Common now', [line('blue', 'clock', 'Growth spurt', 'Hungrier for 2–3 days, around 3 months', 'Feed more. It passes', 'spurt'), line('peach', 'bottle', 'Spit-up', 'Normal, and peaks around 4 months', 'Forceful or green is a call', 'spit')])
      + `</section>`;
    return shell(hero('Feeds get quicker and further apart', 'Ari is better at eating now, so feeds take less time, and many babies take their longest stretch at night.')
      + glanceCard(false).replace(/<div class="hub-tiles">[\s\S]*?<\/div><\/section>/, `<div class="hub-tiles">${tiles.map(([c, art, l, v, sub]) => `<div class="sm-tile" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)}</span></div>`).join('')}</div></section>`)
      + sheet
      + `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go('worry')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Something else?')}</b><small>${F('Gas, fussing, sore nipples, bottle refusal')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`
      + `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('how')}">${F('Show me how: ' + [breast && 'latch', formula && 'bottles', feed !== 'Breast milk' && 'formula', breast && 'storing milk'].filter(Boolean).join(', '))} ›</button><button class="hub-link">${F('Share with someone who feeds Ari')} ↗</button></div>`, 'D'); };
  const ticksPlan = rows => `<div class="hub-ticks">${rows.map(([when, t, k]) => `<button class="hub-tick ${on(k) ? 'is-on' : ''}" role="checkbox" aria-checked="${on(k)}" onclick="fcTick('${k}')"><span class="hub-tick-art">${hubArt('clock', CAT)}</span><span class="hub-row-copy"><b>${F(t)}</b><small>${F(when)}</small></span><span class="hub-tick-box" aria-hidden="true">${on(k) ? '✓' : ''}</span></button>`).join('')}</div>`;
  const base = window.changesRoute;
  window.changesRoute = function (r) { const [, cat, s, a] = r.split(':'); if (cat === CAT && s === 'mock' && P[a]) return P[a](); return base(r); };
  const op = window.openPage;
  window.openPage = openPage = function (r, ...rest) { if (r === 'topic:Feeding') r = 'chg:Feeding:mock:dirD'; return op.call(this, r, ...rest); };
})();
