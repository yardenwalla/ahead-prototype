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
      + `<p class="ss-know"><b>${F('How long it lasts')}</b>${F('Use within 2 hours of making it, and within 1 hour once he starts. Made bottles keep 24 hours in the fridge.')}</p>`),
    how: () => page(head('Feeding', 'Show me how', 'Step-by-step pictures for the everyday parts of feeding.', C.lilac)
      + `<div class="hub-list">${[nurses() && row('pink', 'heart', '', 'Latch and holds', 'How a good latch feels, and four holds', 'latch'), isBottle() && row('lilac', 'bottle', '', 'Giving a bottle', 'Positions, pacing, burping and nipple flow', 'bottle'), fd() !== 'Breast milk' && row('peach', 'bowl', '', 'Making formula', 'Water first, level scoops', 'formula'), isBottle() && row('blue', 'snow', '', 'Storing and warming milk', 'How long it lasts, and travel', 'basics')].filter(Boolean).join('')}</div>`),
    // HOW-TO
    bottle: () => page(head('Show me how', 'Giving a bottle', 'Pace each bottle. It lets Ari lead, like at the breast, so he takes what he needs and less air.', C.lilac)
      + steps([['hand', 'Hold him upright', 'Head higher than his tummy'], ['bottle', 'Bottle fairly level', 'Just enough milk in the tip'], ['clock', 'Pause every few sucks', 'Tip it down, then let him draw it back'], ['heart', 'Stop when he slows', 'Even if there’s milk left']], true)
      + h2('Time for a faster nipple?') + `<div class="fm-two"><div style="background:#efedff"><small style="color:#625084">${F('Too slow')}</small><span>${F('Sucks hard, gets frustrated, the nipple collapses, feeds take over 20 minutes.')}</span></div><div style="background:#fdeee6"><small style="color:#9a5a3c">${F('Too fast')}</small><span>${F('Gulping, coughing, or milk spilling from his mouth.')}</span></div></div>`
      + `<p class="ss-small"><b>${F('Burping:')}</b> ${F('every 2–3 oz and at the end. No burp after a few minutes is fine.')}</p>`),

    basics: () => page(head('Show me how', 'Storing and warming milk', 'Breast milk and formula, side by side.', C.blue)
      + `<div class="hub-card fm-store"><table><tr><th></th><th>${F('Breast milk')}</th><th>${F('Formula, once made')}</th></tr>${[['On the counter', 'Up to 4 hours', 'Up to 2 hours'], ['Once a feed starts', 'Within 2 hours', 'Within 1 hour'], ['In the fridge', 'Up to 4 days', 'Up to 24 hours'], ['In the freezer', 'Best within 6 months, up to 12', 'Don’t freeze']].map(r => `<tr>${r.map(c => `<td>${F(c)}</td>`).join('')}</tr>`).join('')}</table></div>`
      + h2('Warming a bottle') + steps([['drop', 'Warm water', 'Or a bottle warmer'], ['hand', 'Swirl', 'To mix the fat back in'], ['heart', 'Test on your wrist', 'Warm, not hot']], true)
      + `<p class="ss-small"><b>${F('Never the microwave.')}</b> ${F('It heats unevenly. Cold or room temperature is fine too.')}</p>`
      + h2('Out and about') + p('A cooler bag with frozen ice packs keeps breast milk up to 24 hours. Flying, breast milk and formula are allowed in carry-on bags in more than 3.4 oz: tell security at the start.')),

    // 3 · TRANSITIONS: one guide, the same shape for every change
    work: () => page(head('Coming up · often around 3 months', 'Going back to work', 'A few weeks of prep makes the first day easier for you both.', C.lilac)
      + hubStageStrip({ title: 'When to start', items: [['clock', '3–4 weeks before', 'Pump once a day'], ['bottle', '2 weeks before', 'Someone else gives a bottle'], ['heart', 'First week back', 'Pump about every 3 hours']], cat: CAT, caption: 'Start pumping once a day 3 to 4 weeks before, have someone else give a bottle 2 weeks before, and pump about every 3 hours once you are back.' })
      + h2('How') + `<ol class="care-do">${['Pump after a morning feed, when most parents have the most milk.', 'Freeze it flat in small bags of 2–4 oz, so nothing goes to waste.', 'Ask your caregiver to pace bottles and follow his cues.', 'At work, pump for each feed you miss.'].map(t => `<li>${F(t)}</li>`).join('')}</ol>`
      + h2('What’s normal') + p('What you pump is often less than he gets at the breast. Many babies refuse a bottle from a parent but take it from someone else.')
      + `<p class="ss-small"><b>${F('Your rights:')}</b> ${F('most workplaces must give you break time and a private space that isn’t a bathroom.')}</p>`),

    year: () => page(head('Feeding this year', 'What changes, and when', 'Ages are typical. Each one opens a short guide when it’s close.', C.lilac)
      + `<div class="hub-card"><ol class="fm-year">${[['done', 'Milk comes in', 'Days 2–5'], ['done', 'A first bottle', 'From 3–4 weeks'], ['next', 'Going back to work', 'Often around 3 months', 'work'], ['', 'A faster nipple flow', 'When bottles get slow'], ['', 'Ready for solids', '4–6 months'], ['', 'First tastes and allergens', 'Around 6 months'], ['', 'Textures and finger foods', '7–8 months'], ['', 'Three meals', 'Around 9 months'], ['', 'Whole milk and cups', '12 months'], ['', 'Nursing past 1, or stopping', 'When you choose']].map(([s, t, w, to]) => `<li class="${s ? 'is-' + s : ''}" ${to ? `onclick="${go(to)}" style="cursor:pointer"` : ''}><i></i><span><b>${F(t)}</b><small>${F(w)}</small></span>${s === 'next' ? `<em>${F('Coming up')}</em>` : ''}</li>`).join('')}</ol></div>`),

    // WORRIES: a short list, each its own answer
    worry: () => page(head('Feeding', 'Is this normal?', 'Pick what you’re seeing.')
      + `<div class="hub-card care-folds care-lookoff">${[['diaper', 'Is he getting enough?', 'The two signs that matter now', 'enough'], ['clock', 'Suddenly hungrier', 'Growth spurts, often around 6 weeks and 3 months', 'spurt'], ['bottle', 'Spit-up or vomit?', 'How much is normal, and when to call', 'spit'], ['drop', 'Gas or lots of crying', 'What helps, and gripe water'], ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full'], ['hand', 'Sore nipples or breasts', 'Usually the latch, and when to call'], ['smile', 'Softer breasts, or less milk?', 'What’s normal as your supply settles', 'supply'], ['star', 'Won’t take a bottle', 'Common for breastfed babies']].map(([i, t, s, to]) => `<button class="care-pick" onclick="${to ? go(to) : ''}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>`),

    spit: () => page(head('Tough feed?', 'Spit-up or vomit?', 'Most babies spit up. It peaks around 4 months and is usually gone by the first birthday.')
      + `<figure class="hub-card fm-spill" role="img" aria-label="Spill one tablespoon of milk on the counter. Most spit-up is less than it looks."><div><svg viewBox="0 0 120 70"><ellipse cx="60" cy="40" rx="46" ry="20" fill="#f4e6d6"/><ellipse cx="54" cy="38" rx="30" ry="12" fill="#fff" stroke="#e6d6c4"/></svg><b>${F('1 tablespoon')}</b><small>${F('Spill one on the counter: most spit-up is less than it looks')}</small></div><div><svg viewBox="0 0 120 70"><path d="M20 50 q40 -40 80 -30" stroke="#c0546f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M92 14 l12 6 -12 6" stroke="#c0546f" stroke-width="5" fill="none" stroke-linecap="round"/></svg><b style="color:#a3324f">${F('Forceful')}</b><small>${F('Comes out with force, across the room: that’s vomiting, not spit-up')}</small></div></figure>`
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
  window.fcTick = k => { window.__fc = window.__fc || {}; window.__fc[k] = !window.__fc[k]; openPage(window.__fdLast || 'chg:Feeding:mock:dirC'); };
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
    const tiles = [['blue', ART.often(5), 'How often', breast ? 'Every 2–4 hours' : 'Every 3–4 hours', 'From the start of one feed'], ['pink', ART.drops(8), 'Feeds a day', breast ? '7–9' : '6–8', feed === 'Both' ? 'Nursing and bottles' : breast ? 'Shorter, quicker feeds' : 'About 24–32 oz in all'], feed === 'Breast milk' ? ['peach', ART.bottle(.5), 'Each feed', 'Until he lets go', 'Often 10–15 minutes now'] : ['peach', ART.bottle(.5), 'Per bottle', '4–5 oz', feed === 'Both' ? 'Breast milk: 3–4 oz' : 'Of formula'], ['yellow', ART.diapers(6), 'Getting enough', '6+ wet diapers', 'A day, and steady growth', 'enough']];
    const sheet = `<section class="rt-card"><div class="rt-head"><b>${F('Feeding at 2 months')}</b><button onclick="" style="all:unset;cursor:pointer;font-size:13px;font-weight:600;color:#9b4766">${F('Share')} ↗</button></div>`
      + group(feed === 'Breast milk' ? 'Your milk' : feed === 'Formula' ? 'Bottles' : 'Milk and bottles', [
          breast ? line('pink', 'heart', 'Your supply', 'Softer breasts are normal now', '', 'supply') : '',
          line('blue', 'snow', 'Milk keeps', feed === 'Breast milk' ? '4 hours out, 4 days in the fridge' : feed === 'Formula' ? 'Use within 2 hours of making it' : 'Out: breast milk 4 hours, formula 2', '', 'basics'),
          formula ? line('lilac', 'bottle', 'Bottles', 'Level, with little pauses', '', 'bottle') : ''])
      + group('Common now', [line('blue', 'clock', 'Growth spurt', 'Hungrier for a few days', '', 'spurt'), line('peach', 'bottle', 'Spit-up', 'Normal, and it eases with time', '', 'spit')])
      + `</section>`;
    return shell(hero('Feeds get quicker and further apart', 'Ari is getting better at eating, so feeds take less time.')
      + glanceCard(false).replace(/<div class="hub-tiles">[\s\S]*?<\/div><\/section>/, `<div class="hub-tiles">${tiles.map(([c, art, l, v, sub, to]) => to ? `<button class="sm-tile hub-tile hub-tile-go" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]};text-align:left;border:0;font:inherit;cursor:pointer" onclick="${go(to)}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)} ›</span></button>` : `<div class="sm-tile" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)}</span></div>`).join('')}</div><span class="hub-card-note"><b>${F('Every day')}</b> ${F(breast ? 'Vitamin D drops, while Ari gets breast milk.' : 'Vitamin D drops, until about 32 oz of formula a day.')} <button onclick="${go('vitd')}" style="all:unset;cursor:pointer;color:#9b4766;font-weight:600">${F('How')} ›</button></span></section>`)
      + sheet
      + `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go('worry')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Tough feed?')}</b><small>${F('Gas, fussing, sore nipples and more')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`
      + `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('how')}">${F('Show me how: ' + [breast && 'latch', formula && 'bottles', feed !== 'Breast milk' && 'formula', breast && 'storing milk'].filter(Boolean).join(', '))} ›</button></div>`, 'D'); };
  const ticksPlan = rows => `<div class="hub-ticks">${rows.map(([when, t, k]) => `<button class="hub-tick ${on(k) ? 'is-on' : ''}" role="checkbox" aria-checked="${on(k)}" onclick="fcTick('${k}')"><span class="hub-tick-art">${hubArt('clock', CAT)}</span><span class="hub-row-copy"><b>${F(t)}</b><small>${F(when)}</small></span><span class="hub-tick-box" aria-hidden="true">${on(k) ? '✓' : ''}</span></button>`).join('')}</div>`;
  /* ---------- Feedback round: subpages ---------- */
  const fd = () => (typeof profile !== 'undefined' && profile.feed) || 'Both';
  const how = () => (typeof profile !== 'undefined' && profile.feedHow) || 'Nursing';
  const isBreast = () => fd() !== 'Formula', nurses = () => isBreast() && how() !== 'Pumping', pumps = () => isBreast() && how() !== 'Nursing', isBottle = () => fd() !== 'Breast milk' || pumps();
  const cueStrip = () => hubStageStrip({ title: 'Hunger cues, early to late', items: [['eye', 'Early', 'Stirring, mouth opening, turning to look'], ['hand', 'Active', 'Rooting, hands to mouth, wriggling'], ['heart', 'Late', 'Crying. Calm him first, then feed']], nowIndex: -1, cat: CAT, caption: 'Early cues: stirring, mouth opening, turning to look. Active: rooting, hands to mouth. Late: crying, so calm him first.' });
  const fullTiles = () => steps([['smile', 'Slows down', 'Fewer, lazier sucks'], ['hand', 'Relaxed, open hands', 'Fists unclench'], ['eye', 'Turns away', 'Or lets go of the nipple'], ['moon', 'Drifts off', 'Content and sleepy']], false);
  P.day = () => page(head('Feeds now', 'A day of feeds at 2 months', 'An example, not a schedule. Ari leads, and no two days look the same.')
    + `<div class="hub-card"><ol class="fm-day">${[['7:00', 'drop', isBreast() ? 'Nurse' : 'Bottle', isBreast() ? 'Often 10–15 minutes' : '4–5 oz'], ['10:00', 'bottle', 'Bottle', '4 oz'], ['1:00', 'drop', isBreast() ? 'Nurse' : 'Bottle', ''], ['4:00', 'drop', isBreast() ? 'Nurse' : 'Bottle', ''], ['6–8 pm', 'clock', 'Cluster feeding', 'Several feeds close together. Normal in the evening'], ['10:00', 'bottle', 'Bottle', 'Then bed'], ['3:00 am', 'drop', isBreast() ? 'Nurse' : 'Bottle', 'After his longest stretch']].map(([t, i, w, s]) => `<li><time>${F(t)}</time><span class="fm-ic" style="background:${i === 'bottle' ? '#fdeee6' : '#fbe4ec'}">${hubArt(i, CAT)}</span><span><b>${F(w)}</b>${s ? `<small>${F(s)}</small>` : ''}</span></li>`).join('')}</ol></div>`
    + h2('Is he hungry?') + cueStrip()
    + h2('Is he full?') + fullTiles());
  P.supply = () => page(head('Your milk', 'Your supply settles', 'Somewhere around 6–12 weeks, your body learns how much milk Ari needs and makes about that much.')
    + h2('What you may notice') + steps([['heart', 'Less engorged', 'Breasts feel full less often'], ['drop', 'Less leaking', 'Between feeds and at night'], ['clock', 'Quicker feeds', 'He’s more efficient now']], false)
    + `<p class="ss-know"><b>${F('This is normal')}</b>${F('It doesn’t mean you’re making less milk. Wet diapers and steady growth are the signs that matter.')}</p>`
    + h2('If you’re worried it’s too little') + p('Feed more often and offer both sides. Skin to skin helps. A lactation consultant can check how feeds are going.')
    + call('Fewer than 6 wet diapers a day, or slow weight gain at a checkup.'));
  P.bottle = () => page(head('Show me how', 'Giving a bottle', 'A slow, paced bottle lets Ari lead, like at the breast, so he takes what he needs and less air.', C.lilac)
    + h2('Positions') + steps([['heart', 'Cradled, sitting up', 'Head higher than his tummy'], ['smile', 'Upright on your lap', 'Facing sideways, head supported'], ['moon', 'Side-lying', 'On his side along your arm. Slows the flow']], false)
    + `<p class="ss-small"><b>${F('Never flat on his back,')}</b> ${F('and never prop the bottle.')}</p>`
    + h2('Pacing, step by step') + steps([['bottle', 'Bottle fairly level', 'Just enough milk in the tip'], ['hand', 'Let him draw it in', 'Touch the nipple to his lip'], ['clock', 'Pause every few sucks', 'Tip it down, then let him start again'], ['heart', 'Switch sides halfway', 'Like at the breast']], true)
    + h2('Time for a faster nipple?') + `<div class="fm-two"><div style="background:#efedff"><small style="color:#625084">${F('Too slow')}</small><span>${F('Sucks hard, gets frustrated, the nipple collapses, feeds take over 20 minutes.')}</span></div><div style="background:#fdeee6"><small style="color:#9a5a3c">${F('Too fast')}</small><span>${F('Gulping, coughing, or milk spilling from his mouth.')}</span></div></div>`
    + `<p class="ss-small"><b>${F('Burping:')}</b> ${F('every 2–3 oz and at the end. No burp after a few minutes is fine.')}</p>`);
  P.basics = (() => { const old = P.basics; return () => old().replace(F('Storing and warming milk'), F('How long milk lasts')); })();
  // Tough feed: only the real worries for this stage and this way of feeding
  P.worry = (v) => { v = v == null ? 1 : Number(v); const b = isBreast(), bt = isBottle();
    const items = v <= 2 ? [['bottle', 'Spit-up or vomit?', 'How much is normal, and when to call', 'spit'], ['drop', 'Gas or lots of crying', 'What helps, and gripe water'], ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full'], nurses() && bt && ['star', 'Won’t take a bottle', 'Common for breastfed babies'], v === 0 && ['moon', 'Too sleepy to feed', 'How to wake him, and when to call']].filter(Boolean)
      : [['shield', 'Gagging or choking?', 'How to tell, and what to do'], ['bowl', 'Refusing food', 'Normal days, and what helps'], ['diaper', 'Constipation', 'Hard poop with solids'], ['eye', 'A rash after a new food', 'When it’s an allergy, and when to call']];
    return page(head('Feeding', 'Tough feed?', 'Pick what you’re seeing.') + `<div class="hub-card care-folds care-lookoff">${items.map(([i, t, s, to]) => `<button class="care-pick" onclick="${to ? go(to) : ''}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>`); };

  /* ---------- The cheat sheet, every stage ---------- */
  const STAGES = [['Newborn', '0–6 weeks'], ['Milk feeds', '6 weeks–4 months'], ['Ready for solids', '4–6 months'], ['First foods', '6–9 months'], ['Meals', '9–12 months']];
  const SHEET = (v, feed) => { const b = feed !== 'Formula', f = feed !== 'Breast milk', both = feed === 'Both', fm = f, nurse = b && how() !== 'Pumping', pump = b && how() !== 'Nursing', bottle = fm || pump;
    const T = (c, art, l, val, sub, to) => [c, art, l, val, sub, to];
    const enough = T('yellow', ART.diapers(6), 'Getting enough', '6+ wet diapers', v === 0 ? 'By day 6. Back to birth weight by 2 weeks' : 'A day, and steady growth', 'enough');
    const S = [
      { hero: ['Lots of feeds, and that’s the point', b ? 'Feeding often helps Ari grow and gets your milk going. It gets quicker over the next few weeks.' : 'Small, frequent bottles are how newborns eat. Feeds get bigger and further apart over the next few weeks.'],
        tiles: [T('blue', ART.often(6), 'How often', b ? 'Every 2–3 hours' : 'Every 2–4 hours', 'From the start of one feed'), T('pink', ART.drops(10), 'Feeds a day', b ? '8–12' : '6–10', both ? (nurse ? 'Nursing and bottles' : 'Breast milk and formula') : 'Day and night'), !bottle ? T('peach', ART.bottle(.3), 'Each feed', 'Until he lets go', 'Often 10–20 minutes a side') : T('peach', ART.bottle(.3), 'Per bottle', fm ? '1–3 oz' : '1–3 oz', fm && pump ? 'Formula or breast milk' : fm && nurse ? 'Formula, plus nursing' : fm ? 'Of formula' : 'Of breast milk'), enough],
        note: ['Every day', b ? 'Vitamin D drops, from the first days.' : 'Vitamin D drops, until about 32 oz of formula a day.'],
        groups: [[b && f ? 'Milk and bottles' : b ? 'Your milk' : 'Bottles', [b && ['pink', 'heart', 'Your milk', 'Comes in around days 2–5', 'supply0'], b && ['peach', 'hand', 'Latch', 'A strong tug, not a pinch', 'latch'], f && ['blue', 'snow', 'Making bottles', 'Water first, then level scoops', 'formula']]], ['Common now', [['blue', 'clock', 'Cluster feeding', 'Lots of feeds close together', 'cluster'], ['lilac', 'moon', 'Sleepy at feeds', 'Wake him if it’s been 3 hours', 'sleepy']]]],
        tough: 'Sore nipples, spit-up, a sleepy baby', next: ['Next, from about 6 weeks', 'Milk feeds'] },
      { hero: ['Feeds get quicker and further apart', 'Ari is getting better at eating, so feeds take less time.'],
        tiles: [T('blue', ART.often(5), 'How often', b ? 'Every 2–4 hours' : 'Every 3–4 hours', 'From the start of one feed'), T('pink', ART.drops(8), 'Feeds a day', b ? '7–9' : '6–8', both ? (nurse ? 'Nursing and bottles' : 'Breast milk and formula') : b ? (nurse ? 'Shorter, quicker feeds' : 'About 24–30 oz in all') : 'Up to about 32 oz in all'), !bottle ? T('peach', ART.bottle(.5), 'Each feed', 'Until he lets go', 'Often 10–15 minutes now') : T('peach', ART.bottle(.5), 'Per bottle', fm ? '4–5 oz' : '3–4 oz', fm && pump ? 'Formula. Breast milk: 3–4 oz' : fm && nurse ? 'Formula, plus nursing' : fm ? 'Of formula' : 'Of breast milk'), enough],
        note: ['Every day', b ? 'Vitamin D drops, while Ari gets breast milk.' : 'Vitamin D drops, until about 32 oz of formula a day.'],
        groups: [[b && f ? 'Milk and bottles' : b ? 'Your milk' : 'Bottles', [b && ['pink', 'heart', 'Your supply', 'It settles to match him', 'supply'], ['blue', 'snow', 'How long milk lasts', feed === 'Breast milk' ? '4 hours out, 4 days in the fridge' : feed === 'Formula' ? 'Use within 2 hours of making it' : 'Breast milk 4 hours out, formula 2', 'basics'], f && ['lilac', 'bottle', 'Bottles', 'Slow, with little pauses', 'bottle']]], ['Common now', [['blue', 'clock', 'Growth spurt', 'Hungrier for a few days', 'spurt'], ['peach', 'bottle', 'Spit-up', 'Normal, and it eases with time', 'spit']]]],
        tough: 'Gas, fussing, sore nipples and more', next: ['Next, around 4 months', 'Ready for solids'] },
      { hero: ['Getting ready for solids', 'Milk is still all Ari needs. Most babies start solids around 6 months, once they show the signs.'],
        tiles: [T('blue', ART.often(4), 'How often', 'Every 3–4 hours', 'From the start of one feed'), T('pink', ART.drops(6), 'Feeds a day', b && !bottle ? 'On demand' : '4–6', both ? (nurse ? 'Nursing and bottles' : 'Breast milk and formula') : b ? (nurse ? 'Quick, distracted feeds' : 'Bigger bottles, fewer of them') : 'Up to about 32 oz in all'), !bottle ? T('peach', ART.bottle(.6), 'Each feed', 'Until he lets go', 'Often only 5–10 minutes') : T('peach', ART.bottle(.6), 'Per bottle', fm ? '4–6 oz' : '4–6 oz', fm && pump ? 'Formula or breast milk' : fm && nurse ? 'Formula, plus nursing' : fm ? 'Of formula' : 'Of breast milk'), enough],
        note: ['Every day', feed === 'Breast milk' ? 'Vitamin D drops, and iron drops from 4 months. Ask your pediatrician for the iron dose.' : feed === 'Both' ? 'Vitamin D drops. If most feeds are breast milk, iron drops from 4 months too.' : 'Vitamin D drops, until about 32 oz of formula a day. Formula has the iron.'],
        groups: [['Getting ready', [['green', 'bowl', 'Ready for solids?', 'Sits with support, opens for a spoon', 'signs'], ['peach', 'heart', 'Eczema or food allergies in the family?', 'Ask about starting peanut early', 'allergy'], ['lilac', 'star', 'Set up', 'A high chair, a soft spoon, a bib', 'setup']]], ['Common now', [['blue', 'eye', 'Distracted feeds', 'A quiet spot helps', 'distract']]]],
        tough: 'Distracted feeds, spit-up, gas', next: ['Next, around 6 months', 'First foods'] },
      { hero: ['Tastes, textures and lots of mess', 'Milk is still the main food. Solids are for learning, a few bites at a time.'],
        tiles: [T('pink', ART.drops(5), 'Milk', b && !f ? 'On demand' : nurse ? '4–5 milk feeds' : '4–5 bottles', b && !f ? 'Still his main food' : nurse ? 'Nursing or bottles' : '6–8 oz each'), T('green', `<svg viewBox="0 0 120 40">${[0, 1].map(i => `<path d="M${8 + i * 36} 16 h28 q0 14 -14 14 q-14 0 -14 -14Z" fill="#356651" fill-opacity=".7"/>`).join('')}</svg>`, 'Solids', '1–2 meals', 'A few spoonfuls to start'), T('blue', ART.bottle(.3), 'Water', 'Sips with meals', 'From an open cup'), enough],
        note: ['Every day', 'An iron-rich food, like meat, beans, eggs or iron-fortified cereal.' + (feed === 'Breast milk' ? ' Vitamin D drops, and iron drops until iron-rich foods are going well.' : b ? ' Vitamin D drops too.' : '')],
        groups: [['On the tray', [['green', 'bowl', 'First foods', 'Soft, mashed or in finger strips', 'prep'], ['peach', 'heart', 'Allergens', 'Peanut and egg early, then often', 'allergens'], ['lilac', 'shield', 'Not yet', 'No honey, whole nuts or cow’s milk to drink', 'notyet']]], ['Common now', [['blue', 'smile', 'Gagging', 'Loud and normal. It’s how he learns', 'gag'], ['yellow', 'clock', 'Tiny amounts', 'A few bites is plenty', 'pace']]]],
        tough: 'Gagging, refusing food, constipation', next: ['Next, around 9 months', 'Meals'] },
      { hero: ['Three meals, and milk still matters', 'Ari eats more like the family now. Milk drops a little as meals grow.'],
        tiles: [T('green', `<svg viewBox="0 0 120 40">${[0, 1, 2].map(i => `<path d="M${8 + i * 36} 16 h28 q0 14 -14 14 q-14 0 -14 -14Z" fill="#356651" fill-opacity=".7"/>`).join('')}</svg>`, 'Meals', '3 a day', 'Plus a snack or two'), T('pink', ART.drops(4), 'Milk', b && !f ? 'Fewer feeds' : nurse ? '3–4 milk feeds' : '3–4 bottles', b && !f ? 'Around meals' : nurse ? 'Nursing or bottles' : '6–8 oz each'), T('blue', ART.bottle(.5), 'Water', 'Up to 8 oz', 'A day, from a cup'), enough],
        note: ['Every day', 'An iron-rich food at a meal.' + (b ? ' Vitamin D drops too.' : '')],
        groups: [['On the tray', [['green', 'bowl', 'Family food', 'Soft pieces, no added salt', 'family'], ['lilac', 'shield', 'Not yet', 'No honey, whole nuts or cow’s milk to drink', 'notyet']]], ['Common now', [['yellow', 'clock', 'Appetite', 'Up one day, down the next', 'appetite'], ['peach', 'heart', 'Picky days', 'New foods can take 10+ tries', 'picky'], ['blue', 'drop', 'Cups', 'Practice now. Milk moves to a cup at 1', 'cups']]]],
        tough: 'Refusing food, gagging, a rash after a new food', next: ['After the first birthday', 'Toddler meals'] }
    ];
    return S[v];
  };
  // The card's rows keep the same labels at every stage, in the same order: Your milk / Bottles, Every day, Food, Common now.
  // Only what each row says changes as the baby grows, like Sleep's "How to help [name] sleep now".
  const ROWS = (v, feed) => { const b = feed !== 'Formula', fm = feed !== 'Breast milk', pump = b && how() !== 'Nursing', nurse = b && how() !== 'Pumping', f = fm || pump, mostlyB = feed === 'Breast milk';
    const r = (c, icon, label, act, sub, to) => ({ c, icon, label, act, sub, to });
    return [
      b && [fm && nurse ? r('pink', 'heart', 'Your milk', 'Nursing and formula together', 'Keeping your supply going', 'combo') : r('pink', 'heart', 'Your milk', 'Your milk comes in, days 2–5', 'Full, tender breasts are normal at first', 'milkin'), r('pink', 'heart', 'Your milk', 'Your supply settles', 'Feeling less full doesn’t mean less milk', 'supply'), fm ? r('pink', 'heart', 'Your milk', 'Any amount of breast milk helps', 'For as long as it works for you both', 'howlong') : r('pink', 'heart', 'Your milk', 'Breast milk alone for about 6 months', 'Then alongside food, for as long as it works for you both', 'howlong'), r('pink', 'heart', 'Your milk', 'Still a main food with meals', nurse ? 'Nursing often drops as meals grow' : 'Milk bottles drop as meals grow', 'milkmeals'), r('pink', 'heart', 'Your milk', nurse ? 'Nursing past 1 is up to you' : 'Breast milk past 1 is up to you', 'No need to stop at the first birthday', 'at12')][v],
      f && [fm ? r('peach', 'bottle', 'Bottles', 'Making formula', 'Water first, then level scoops', 'formula') : r('peach', 'bottle', 'Bottles', 'Pumping', '8–12 times a day at first', 'pump'), r('peach', 'bottle', 'Bottles', 'Giving a bottle', 'Slow, with little pauses', 'bottle'), r('peach', 'bottle', 'Bottles', 'Bottles as he grows', 'Milk stays the main food as solids start', 'bottlegrow'), r('peach', 'bottle', 'Bottles', 'Start practicing with a cup', 'Water from an open or straw cup', 'cups'), r('peach', 'bottle', 'Bottles', 'Whole milk and cups at 12 months', 'Plan the switch a month ahead', 'at12')][v],
      !f && [r('peach', 'bottle', 'Bottles', 'A bottle, if you want one', 'Only if it helps your family', 'firstbottle'), r('peach', 'bottle', 'Bottles', 'Pumping, if you need it', 'For a bottle or time apart', 'pump'), null, r('peach', 'bottle', 'Cups', 'Start practicing with a cup', 'Water from an open or straw cup', 'cups'), null][v],
      r('green', 'drop', 'Every day', [b ? 'Vitamin D drops' : 'Vitamin D drops until about 32 oz', 'Vitamin D drops', mostlyB ? 'Vitamin D and iron drops' : b ? 'Vitamin D drops, and maybe iron' : 'Vitamin D drops until about 32 oz', 'An iron-rich food', 'An iron-rich food at a meal'][v], [b ? 'From the first days' : 'Most formula babies need them at first', b ? 'While he gets breast milk' : 'Until he drinks about 32 oz a day', mostlyB ? 'Iron from 4 months. Ask for the dose' : b ? 'Iron if over half his milk is breast milk' : 'Formula has the iron', 'Meat, beans, eggs, iron-fortified cereal', b ? 'Plus vitamin D drops' : 'Meat, beans, eggs, iron-fortified cereal'][v], 'vitd'),
      v >= 2 && [null, null, r('green', 'bowl', 'Food', 'Is he ready for solids?', 'Sits with support, opens for a spoon', 'signs'), r('green', 'bowl', 'Food', 'First foods, a few bites at a time', 'Iron first. Allergens early and often', 'firstfoods'), r('green', 'bowl', 'Food', 'Three meals of family food', 'Soft pieces, no added salt', 'family')][v],
      [r('blue', 'clock', 'Common now', 'Cluster feeding', 'Lots of feeds close together, often in the evening', 'cluster'), r('blue', 'clock', 'Common now', 'Hungrier days', 'Growth spurts last a few days', 'spurt'), r('blue', 'clock', 'Common now', 'Quick, distracted feeds', 'A quiet spot helps', 'distract'), r('blue', 'clock', 'Common now', 'Tiny, messy meals', 'A few bites is plenty', 'tiny'), r('blue', 'clock', 'Common now', 'Picky days', 'New foods can take 10–15 tries', 'picky')][v]
    ].filter(Boolean); };
  P.dirD = (v) => { v = v == null ? 1 : Number(v); window.__fdStage = v; const feed = fd(), h = H(), st = SHEET(v, feed), b = isBreast(), f = isBottle();
    const pills = h.pills('Feeding by age', STAGES.map(([l, a], i) => ({ label: l, age: a, on: i === v, now: i === 1, onclick: go('dirD:' + i) })), CAT);
    const tile = ([c, art, l, val, sub, to]) => to ? `<button class="sm-tile hub-tile hub-tile-go" style="--sm-bg:${TILE[c] ? TILE[c][0] : C[c][0]};--sm-ink:${TILE[c] ? TILE[c][1] : C[c][1]};text-align:left;border:0;font:inherit;cursor:pointer" onclick="${go(to)}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(val)}</b><span>${F(sub)} ›</span></button>` : `<div class="sm-tile" style="--sm-bg:${TILE[c] ? TILE[c][0] : C[c][0]};--sm-ink:${TILE[c] ? TILE[c][1] : C[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(val)}</b><span>${F(sub)}</span></div>`;
    let b2 = `<header class="hub-hero"><p class="hub-eyebrow">${F(STAGES[v][0])}</p><h1>${F(st.hero[0])}</h1><p class="hub-lead">${F(st.hero[1])}</p></header>`;
    b2 += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F(v >= 3 ? 'Eating now' : 'Feeds now')}</b><button class="hub-card-cta" onclick="${go('day')}">${F('Example day')} ›</button></span><div class="hub-tiles">${st.tiles.map(tile).join('')}</div></section>`;
    b2 += h2('Feeding at ' + ['the newborn stage', '2 months', '4–6 months', '6–9 months', '9–12 months'][v]) + `<div class="hub-list">${ROWS(v, feed).map(x => `<button class="hub-row hl-row" style="--hl-bg:${C[x.c][0]};--hl-ink:${C[x.c][1]}" onclick="${P[x.to] ? go(x.to) : ''}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt(x.icon, CAT)}</span><span class="hub-row-copy"><small>${F(x.label)}</small><b>${F(x.act)}</b><small>${F(x.sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`).join('')}</div>`;
    b2 += `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go('worry:' + v)}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Tough feed?')}</b><small>${F(v <= 2 ? 'Spit-up, gas, fussing or arching' : 'Gagging, refusing food, constipation')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    const hows = v <= 1 ? [nurses() && 'latch', isBottle() && 'bottles', feed !== 'Breast milk' && v === 1 && 'formula', pumps() && v === 1 && 'pumping'] : v === 2 ? [nurses() && 'latch', isBottle() && 'bottles', 'preparing first foods'] : ['preparing first foods', 'choking first aid'];
    b2 += `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('how')}">${F('Show me how: ' + hows.filter(Boolean).join(', '))} ›</button></div>`;
    b2 += h.next(st.next[0], st.next[1], v < 4 ? go('dirD:' + (v + 1)) : '') + h.note('Ages are typical. Every baby moves at their own pace.');
    return `${css}<div class="quiet-category hub-page care-v2" data-overview="${CAT}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${b2}</div>`; };
  P.milkin = () => (pumps() && !nurses()) ? page(head('Your milk', 'Your milk comes in', 'Small amounts of colostrum come first. Your milk comes in around days 2–5.')
    + h2('What’s normal') + steps([['heart', 'Full, tender breasts', 'For a few days as milk comes in'], ['drop', 'Tiny amounts at first', 'Then more each day'], ['clock', 'Pump 8–12 times a day', 'Including once at night']], false)
    + h2('What helps') + steps([['hand', 'Very full?', 'Pump a little for comfort, then a cold pack'], ['heart', 'Sore while pumping?', 'Check the flange fit, and lower the suction']], false)
    + call('Pain while pumping that doesn’t ease, or a red, painful area with a fever or chills (it can be mastitis).')) : page(head('Your milk', 'Your milk comes in', 'Small amounts of colostrum are all Ari needs at first. Your milk comes in around days 2–5.')
    + h2('What’s normal') + steps([['heart', 'Full, tender breasts', 'For a few days as milk comes in'], ['hand', 'A strong tug', 'At the start of a feed, not a pinch'], ['drop', 'Some leaking', 'Between feeds']], false)
    + h2('What helps') + steps([['clock', 'Feed often', '8–12 times a day'], ['hand', 'Very full?', 'Feed or hand-express a little, then a cold pack'], ['heart', 'Sore nipples?', 'Check the latch. A little milk or lanolin after feeds']], false)
    + call('Pain through the whole feed, cracked or bleeding nipples, or a red, painful area with a fever or chills (it can be mastitis).'));
  /* ================= Every page, built from the page map =================
     Each page is complete on its own (what's normal, what to do, when to call) and links to nothing.
     Pages follow the stage the parent is looking at and only show what fits how the family feeds. */
  const stg = () => (window.__fdStage == null ? 1 : window.__fdStage);
  const formulaFam = () => fd() !== 'Breast milk' && fd() !== 'Prefer not to say';
  const ctx = (c) => c;
  const know = (label, t) => `<p class="ss-know"><b>${F(label)}</b>${F(t)}</p>`;
  const small = (label, t) => `<p class="ss-small"><b>${F(label)}</b> ${F(/\?$/.test(label.trim()) ? t.charAt(0).toUpperCase() + t.slice(1) : t)}</p>`;
  const two = (a, b) => `<div class="fm-two"><div style="background:${a[2] || '#e7effc'}"><small style="color:${a[3] || '#46638c'}">${F(a[0])}</small><span>${F(a[1])}</span></div><div style="background:${b[2] || '#e4f3ec'}"><small style="color:${b[3] || '#356651'}">${F(b[0])}</small><span>${F(b[1])}</span></div></div>`;
  const dayList = items => `<div class="hub-card"><ol class="fm-day">${items.map(([t, i, w, s]) => `<li><time>${F(t)}</time><span class="fm-ic" style="background:${i === 'bowl' ? '#e4f3ec' : i === 'bottle' ? '#fdeee6' : '#fbe4ec'}">${hubArt(i, CAT)}</span><span><b>${F(w)}</b>${s ? `<small>${F(s)}</small>` : ''}</span></li>`).join('')}</ol></div>`;
  const firstAid = () => h2('If he’s choking') + steps([['hand', '5 back blows', 'Face down along your forearm, head lower than his chest'], ['heart', '5 chest thrusts', 'Face up, two fingers in the middle of his chest'], ['clock', 'Repeat', 'Until it comes out, or help arrives']], true)
    + `<p class="care-urgent"><b>${F('Call 911:')}</b> ${F('if he can’t cough, cry or breathe, have someone call 911 right away while you start back blows. If he stops responding, start CPR.')}</p>`;

  Object.assign(P, {
    // ---------- Tiles ----------
    day: () => { const v = stg(), nurse = nurses(), fm = formulaFam(), pump = pumps();
      const milk = (sub) => !nurse && pump && v <= 2 ? ['bottle', 'Bottle, then pump', sub || ['1–3 oz', '3–4 oz', '3–5 oz'][v]] : nurse && !fm && !pump ? ['drop', 'Nurse', sub || ''] : nurse && fm ? ['drop', 'Nurse, or a bottle', sub || ''] : ['bottle', 'Bottle', sub || (fm ? ['1–3 oz', '4–5 oz', '4–6 oz', '6–8 oz', '6–8 oz'][v] : ['1–3 oz', '3–4 oz', '3–5 oz', '3–5 oz', '3–5 oz'][v])];
      const D = [
        [['7:00', ...milk()], ['9:30', ...milk()], ['12:00', ...milk()], ['2:30', ...milk()], ['5:00', ...milk()], ['6–9 pm', 'clock', 'Cluster feeding', 'Several feeds close together. Normal'], ['11:00', ...milk()], ['2:00 am', ...milk()], ['4:30 am', ...milk()]],
        [['7:00', ...milk()], ['10:00', ...milk()], ['1:00', ...milk()], ['4:00', ...milk()], ['6–8 pm', 'clock', 'A few feeds close together', 'Normal in the evening'], ['10:00', ...milk('Then bed')], ['3:00 am', ...milk('After his longest stretch')]],
        [['7:00', ...milk()], ['10:30', ...milk()], ['2:00', ...milk()], ['5:30', ...milk()], ['8:00', ...milk('Then bed')], ['Night', ...milk('Some babies still wake for one')]],
        [['7:00', ...milk()], ['8:00', 'bowl', 'Breakfast', 'A few spoonfuls, something iron-rich'], ['11:00', ...milk()], ['3:00', ...milk()], ['5:30', 'bowl', 'Dinner', 'A small taste of what you’re eating'], ['7:00', ...milk('Then bed')]],
        [['7:00', ...milk()], ['8:00', 'bowl', 'Breakfast', ''], ['10:00', 'bowl', 'Snack', ''], ['12:00', 'bowl', 'Lunch', 'Water from a cup'], ['1:00', ...milk('Before a nap')], ['3:30', 'bowl', 'Snack', ''], ['5:30', 'bowl', 'Dinner', 'Soft pieces of family food'], ['7:00', ...milk('Then bed')]]
      ][v];
      const cues = v <= 2 ? h2('Is he hungry?') + hubStageStrip({ title: 'Hunger cues, early to late', items: [['eye', 'Early', 'Stirring, mouth opening, turning to look'], ['hand', 'Active', 'Rooting, hands to mouth, wriggling'], ['heart', 'Late', 'Crying. Calm him first, then feed']], nowIndex: -1, cat: CAT, caption: 'Early: stirring, mouth opening. Active: rooting, hands to mouth. Late: crying.' })
        + h2('Is he full?') + steps([['smile', 'Slows down', 'Fewer, lazier sucks'], ['hand', 'Relaxed, open hands', 'Fists unclench'], ['eye', 'Turns away', nurses() ? 'Or lets go' : 'From the bottle'], ['moon', 'Drifts off', 'Content and sleepy']], false)
        : h2('Ready for more, or all done?') + two(['Ready for more', 'Leans in, opens his mouth, reaches for food.'], ['All done', 'Turns away, closes his mouth, pushes food away, plays with it.']) + know('Your job, his job', 'You choose what and when. He chooses how much.');
      return page(head('Feeds now', ['A newborn day', 'A day at 2 months', 'A day at 4–6 months', 'A day at 6–9 months', 'A day at 9–12 months'][v], 'An example, not a schedule. Ari leads, and no two days look the same.') + dayList(D) + cues); },

    enough: () => { const v = stg();
      const body = v === 0
        ? h2('Wet diapers, day by day') + hubStageStrip({ title: 'Wet diapers a day', items: [['diaper', 'Days 1–2', '1–2'], ['diaper', 'Days 3–4', '3 or more'], ['diaper', 'From day 5–6', '6 or more, pale yellow']], nowIndex: -1, cat: CAT, caption: 'Days 1 to 2: one or two. Days 3 to 4: three or more. From day 5 to 6: six or more, pale yellow.' })
          + know('Weight', 'Losing up to about 10% in the first days is common. Most babies are back to birth weight by about 2 weeks.')
          + small('Poop:', 'black and sticky at first, then greenish, then ' + (isBreast() ? 'mustard yellow and seedy.' : 'tan to yellow and a little firmer.'))
          + call('Fewer wet diapers than this, not back to birth weight by 2 weeks, or very sleepy and hard to wake for feeds.')
        : steps([['diaper', '6 or more wet diapers', 'A day, pale yellow'], ['heart', 'Steady growth', 'Along his own curve at checkups'], ['smile', v >= 3 ? 'Busy and content' : 'Content after most feeds', v >= 3 ? 'Even on days he eats little' : 'With some fussy evenings']], false)
          + (v >= 3 ? p('Appetite goes up and down from day to day. Growth at checkups tells you more than any one meal.') : p(nurses() && !isBottle() ? 'You don’t need to measure what he drinks at the breast. Some feeds are short, some long.' : 'Amounts change from feed to feed. Follow his cues rather than finishing every bottle.'))
          + call('Fewer than 6 wet diapers a day, he seems hungry after most feeds, or he isn’t gaining at a checkup.');
      return page(head('Getting enough', 'Is Ari getting enough?', v === 0 ? 'In the first weeks, diapers and weight tell you.' : 'Two signs tell you: wet diapers and steady growth.', C.yellow) + body
        + urgent('No wet diaper in 8 hours, a sunken soft spot, or very hard to wake. Call your pediatrician right away.')); },

    // ---------- Every day ----------
    vitd: () => { const v = stg(), br = isBreast(), mostly = fd() === 'Breast milk', fm = formulaFam(), early = typeof profile !== 'undefined' && profile.early;
      let b = h2('Vitamin D') + p(br ? '400 IU every day, from the first days, while he gets breast milk.' : 'Formula has vitamin D added. Until he drinks about 32 oz a day, he needs drops too, and most young babies drink less than that.');
      b += steps([['bottle', 'In a little milk', 'About an ounce, before the rest of the feed'], ['heart', 'On the nipple', 'Just before he latches'], ['hand', 'Inside the cheek', 'Slowly, with the dropper']].filter((x, i) => i !== 1 || nurses()), false);
      b += small('Not in a full bottle:', 'if he doesn’t finish it, he misses some. Don’t repeat the dose if he spits up.');
      if (v >= 3) b = know('Iron from food', 'An iron-rich food every day: meat, beans, lentils, eggs, or iron-fortified cereal.') + b;
      b += h2('Iron') + (early && br ? p('Babies born early who get breast milk usually start iron drops by 1 month and keep going to 12 months. Follow your care team’s dose.')
        : mostly || (fd() === 'Both') ? p((fd() === 'Both' ? 'If most of his feeds are breast milk: ' : '') + (v >= 3 ? 'keep giving iron drops until iron-rich foods are a regular part of meals.' : 'from 4 months, he needs iron drops every day until iron-rich foods are a regular part of meals.') + ' The dose depends on his weight, so ask your pediatrician.')
        : p('Formula has iron added, so he doesn’t need iron drops.'));
      b += small('Other supplements:', 'ask your pediatrician before giving anything else.');
      return page(head('Every day', 'Vitamins and iron', v >= 3 ? 'An iron-rich food every day, and drops if he still needs them.' : 'A few drops a day, and what changes as he grows.', C.green) + b); },

    // ---------- Your milk (breast milk), in order ----------
    supply: () => (pumps() && !nurses()) ? page(head('Your milk', 'Your supply settles', 'In the first weeks, pumping often tells your body how much to make. After that, output usually levels off.')
      + steps([['drop', 'Steadier output', 'Session to session'], ['heart', 'Fewer engorged days', 'Not as full between sessions'], ['clock', 'Some sessions less', 'Mornings are often highest']], false)
      + know('This is normal', 'What you pump in a session varies. Wet diapers and steady growth are the signs that matter.')
      + h2('Too little?') + p('Pump more often, including once at night, and check your flange fit. A lactation consultant can help.')
      + call('Fewer than 6 wet diapers a day, slow weight gain, or a red, painful area on your breast with a fever.')) : page(head('Your milk', 'Your supply settles', 'In the weeks after your milk comes in, your body learns how much Ari needs and makes about that much.')
      + h2('What you may notice') + steps([['heart', 'Fewer engorged days', 'Not as full or hard between feeds'], ['drop', 'Less leaking', 'Between feeds and at night'], ['clock', 'Quicker feeds', 'He’s more efficient now']], false)
      + know('This is normal', 'Feeling less full doesn’t mean less milk. Wet diapers and steady growth are the signs that matter, not how full you feel or how much you pump.')
      + h2('Too little?') + p('Feed or pump more often, offer both sides, and try skin to skin. A lactation consultant can check how feeds are going.')
      + h2('Too much?') + p('Gulping, coughing or pulling off at the start of feeds can mean a fast flow. Lean back so he feeds against gravity, and burp mid-feed. If it keeps happening, ask a lactation consultant.')
      + call('Fewer than 6 wet diapers a day, slow weight gain, or a red, painful area on your breast with a fever.')),
    howlong: () => (pumps() && !nurses()) ? page(head('Your milk', 'How long to give breast milk', formulaFam() ? 'Any amount of breast milk helps, for as long as it works for you.' : 'Pediatricians suggest breast milk alone for about 6 months, then alongside food for as long as it works for you.')
      + steps([['heart', 'Any amount helps', 'Even a little each day'], ['clock', 'There’s no wrong time', 'To keep going, or to stop'], ['bottle', 'Switching is fine', 'Formula is a good choice too']], false)
      + h2('If you decide to stop') + p('Go slowly: drop one pump session every few days. If your breasts feel full, express just enough to be comfortable. Low mood can come with stopping. Tell your doctor if it lingers.')) : page(head('Your milk', 'How long to breastfeed', formulaFam() ? 'Any amount of breast milk helps, for as long as it works for you both.' : 'Pediatricians suggest breast milk alone for about 6 months, then alongside food for as long as it works for you both.')
      + steps([['heart', 'Any amount helps', 'A few feeds a day still count'], ['clock', 'There’s no wrong time', 'To keep going, or to stop'], ['bottle', 'Switching is fine', 'Formula is a good choice too']], false)
      + h2('If you decide to stop') + p('Go slowly: drop one feed every week or so, with bedtime last. If your breasts feel full, express just enough to be comfortable. Low mood can come with stopping. Tell your doctor if it lingers.')),
    milkmeals: () => page(head('Your milk', 'Milk is still a main food', 'Until 12 months, milk gives Ari much of what he needs. Meals are for learning.')
      + steps([['heart', 'Keep milk feeds going', 'Before or after meals both work'], ['clock', 'Fewer feeds over time', 'As meals grow'], ['bowl', 'Meals are for learning', 'Tastes and textures first']], false)
      + know('How you’ll know it’s enough', 'Wet diapers, steady growth, and a busy, content baby.')),
    at12: () => { const nurse = nurses(), bottle = isBottle();
      return page(head('Coming up', 'At 12 months', bottle ? 'Milk changes at the first birthday. Start the move to cups about a month before.' : 'Cow’s milk can join meals at the first birthday.', C.lilac)
        + (bottle ? h2('Whole milk and cups') + steps([['drop', 'Whole cow’s milk', 'From a cup, 16–24 oz a day'], ['bottle', 'Bottles to cups', 'One at a time, about a week apart'], ['moon', 'Bedtime bottle last', 'Aim to finish by 18 months']], true) + small('Picky about the taste?', 'mix it half and half with ' + (formulaFam() ? 'formula' : 'breast milk') + ' for a week. Toddler formula isn’t needed.') : '')
        + (nurse ? h2('Nursing past 1') + p('There’s no need to stop at the first birthday. Whole cow’s milk from a cup can join alongside, and vitamin D drops continue while he nurses.') : '')
        + (bottle ? small('After 1, no more than 24 oz of milk a day:', 'more fills him up and can lower his iron.') : '')); },

    // ---------- Bottles, in order ----------
    firstbottle: () => page(head('Bottles', 'A first bottle', 'Around 3–4 weeks, once nursing is going well, is a good time to try a bottle.', C.peach)
      + steps([['heart', 'Someone else offers it', 'He may refuse it from you at first'], ['clock', 'Before he’s very hungry', 'Calm is easier'], ['bottle', 'A slow-flow nipple', 'And pace it, like the breast']], true)
      + know('Keeping your supply up', 'When a bottle replaces a nursing feed, pump around the same time.')
      + small('Won’t take it?', 'that’s common. Try again in a day or two, and keep trying.')),
    pump: () => page(head('Bottles', 'Pumping', nurses() ? 'Pump when a bottle replaces a nursing feed, or when you’re apart, so your supply keeps up.' : 'Pump about as often as he’d feed. At first that’s 8–12 times a day, including once at night.', C.peach)
      + steps([['clock', 'Every 2–3 hours', 'At first, day and night'], ['hand', 'It shouldn’t hurt', 'A flange that fits matters'], ['drop', 'Output varies', 'From session to session']], false)
      + know('How much he needs', 'About 24–30 oz a day once feeding is settled, or about 1 oz for each hour you’re apart.')
      + know('How long it lasts', 'Counter 4 hours, fridge 4 days, freezer best within 6 months.')
      + small('Clean pump parts:', 'wash them after every use and let them air-dry.')
      + call('Pain while pumping, a red, painful area with a fever, or a sudden big drop in what you pump.')),
    basics: () => { const br = isBreast() && (pumps() || nurses()), fm = formulaFam();
      const rows = [['On the counter', 'Up to 4 hours', 'Use within 2 hours of making it'], ['Once a feed starts', 'Within 2 hours', 'Within 1 hour'], ['In the fridge', 'Up to 4 days', 'Up to 24 hours'], ['In the freezer', 'Best within 6 months, up to 12', 'Don’t freeze']];
      const cols = [br && 1, fm && 2].filter(Boolean);
      return page(head('Bottles', 'How long milk lasts', 'And warming a bottle, and taking milk out with you.', C.blue)
        + `<div class="hub-card fm-store"><table><tr><th></th>${cols.map(c => `<th>${F(c === 1 ? 'Breast milk' : 'Formula')}</th>`).join('')}</tr>${rows.map(r => `<tr><td>${F(r[0])}</td>${cols.map(c => `<td>${F(r[c])}</td>`).join('')}</tr>`).join('')}</table></div>`
        + h2('Warming a bottle') + steps([['drop', 'Warm water', 'Or a bottle warmer'], ['hand', 'Swirl', 'To mix it'], ['heart', 'Test on your wrist', 'Warm, not hot']], true)
        + small('Never the microwave.', 'It heats unevenly. Cold or room temperature is fine too.')
        + h2('Out and about') + p((br ? 'A cooler bag with frozen ice packs keeps breast milk up to 24 hours. ' : 'Carry powder and water separately, and mix when he’s ready. ') + 'When flying, breast milk and formula can go in your carry-on, even over 3.4 oz. Tell security at the start.')); },
    bottle: () => page(head('Bottles', 'Giving a bottle', 'A slow, paced bottle lets Ari lead, so he takes what he needs and swallows less air.', C.lilac)
      + h2('Positions') + steps([['heart', 'Cradled, sitting up', 'Head higher than his tummy'], ['smile', 'Upright on your lap', 'Facing sideways, head supported'], ['moon', 'Side-lying', 'Along your arm. Slows the flow']], false)
      + small('Never flat on his back,', 'and never prop the bottle.')
      + h2('Pacing, step by step') + steps([['bottle', 'Bottle fairly level', 'With milk filling the nipple'], ['hand', 'Let him draw it in', 'Touch the nipple to his lip'], ['clock', 'Pause every few sucks', 'Tip it down, then let him start again'], ['heart', 'Switch sides halfway', 'And burp every 2–3 oz']], true)
      + h2('Time for a faster nipple?') + two(['Too slow', 'He sucks hard, gets frustrated, or the nipple collapses.', '#efedff', '#625084'], ['Too fast', 'Gulping, coughing, or milk spilling from his mouth.', '#fdeee6', '#9a5a3c'])
      + small('Start with the slowest flow,', 'and go up only when it’s too slow.')
      + h2('Choosing and cleaning bottles') + p('There’s no best bottle. Use whichever one he takes well. Wash bottles and nipples in hot, soapy water after every feed, and sanitize them often in the first months.')),
    formula: () => page(head('Bottles', 'Making formula', 'Follow the label exactly. The amounts matter.', C.peach)
      + steps([['hand', 'Wash your hands', 'And use a clean bottle'], ['drop', 'Water first', 'The amount on the label'], ['bowl', 'Level scoops', 'Then shake well'], ['heart', 'Test on your wrist', 'Warm or room temperature']], true)
      + small('Always the amounts on the label.', 'Extra water or powder upsets the balance he needs.')
      + know('Safe water', 'Under 2 months, born early, or a weak immune system: boil the water, let it cool for about 5 minutes, mix, then cool the bottle before feeding.')
      + know('How long it lasts', 'Use within 2 hours of making it, and within 1 hour once he starts. Made bottles keep 24 hours in the fridge.')
      + small('Which formula?', 'any standard iron-fortified infant formula. Ask your pediatrician before switching to a special one.')),
    cups: () => page(head('Bottles', 'Practicing with a cup', 'From about 6 months, an open or straw cup with meals makes the move off bottles easier later.', C.blue)
      + steps([['drop', 'Water with meals', '4–8 oz a day, from a cup'], ['hand', 'Open or straw cup', 'Expect spills'], ['clock', 'Milk stays as is', 'Until 12 months']], false)
      + small('No juice before 1.', 'Water and milk are all he needs.')),

    // ---------- Food, in order ----------
    signs: () => page(head('Food', 'Is Ari ready for solids?', 'Most babies show all four signs around 6 months. Some sooner, some later.', C.green)
      + ticksPlan([['Sitting', 'Sits with support and holds his head steady', 's1'], ['Mouth', 'Opens his mouth when food comes near', 's2'], ['Swallowing', 'Swallows instead of pushing food back out', 's3'], ['Interest', 'Reaches for food and brings things to his mouth', 's4']])
      + h2('Getting set up') + steps([['star', 'A high chair', 'Supportive, with a harness'], ['bowl', 'A soft spoon and a bib', 'Skip the fancy gadgets'], ['hand', 'Spoon, finger foods or both', 'There’s no wrong choice']], false)
      + know('Eczema or an egg allergy?', 'Talk to your pediatrician before trying peanut. It may help to start it early.')),
    firstfoods: () => page(head('Food', 'First foods', 'A few bites at a time. Milk is still his main food.', C.green)
      + steps([['bowl', 'Iron-rich first', 'Meat, beans, lentils, eggs, iron-fortified cereal'], ['hand', 'Soft and safe', 'Mashed, or strips the size of a finger'], ['smile', 'He decides how much', 'A few spoonfuls is plenty']], false)
      + h2('Allergens, early and often') + p('Once a few first foods go well, offer the common allergens one at a time, then keep them in a few times a week: peanut (thinned, never whole), egg, dairy (yogurt or cheese), wheat, soy, sesame, fish, shellfish and tree nuts (ground).')
      + small('A few hives:', 'call your pediatrician. Trouble breathing, a swollen face, hives all over, or hives with vomiting: call 911.')
      + h2('Not yet') + two(['Until 1', 'Honey, cow’s milk to drink, and juice.', '#fdeee6', '#9a5a3c'], ['For years', 'Whole nuts, popcorn, whole grapes, hard raw vegetables.', '#efedff', '#625084'])),
    family: () => page(head('Food', 'Three meals of family food', 'Around 9–12 months, Ari can eat soft pieces of what you eat.', C.green)
      + steps([['bowl', '3 meals', 'Plus 1–2 snacks'], ['hand', 'Pea-size pieces', 'Once he picks things up with finger and thumb'], ['heart', 'Your family’s food', 'Set his portion aside before adding salt']], false)
      + h2('Safe shapes') + p('Quarter grapes lengthwise, cut round foods into thin strips, cook hard vegetables until soft, and spread nut butter thinly. Whole nuts and popcorn stay off the menu for years.')
      + small('Still not yet:', 'honey, and cow’s milk to drink, until 1.')),

    // ---------- Common now, in order ----------
    cluster: () => page(head('Common now', 'Cluster feeding', 'Lots of feeds close together for a few hours, often in the evening. It’s normal, and it passes.', C.blue)
      + steps([['clock', 'Feed when he asks', 'Even if it feels constant'], ['heart', 'Settle in', 'Water and a snack within reach'], ['hand', 'Take turns', 'Someone else can burp, change and soothe']], false)
      + call('Fewer wet diapers than usual, or he seems hungry and unsettled after most feeds all day.')),
    spurt: () => page(head('Common now', 'Hungrier days', 'Some days he’ll want to feed far more often. It usually lasts up to about 3 days.', C.blue)
      + steps([['clock', 'More feeds', 'Closer together'], ['heart', 'Fussier', 'Sometimes sleepier after'], ['smile', 'Then it settles', 'Usually in a few days']], false)
      + p((pumps() && !nurses()) ? 'Follow his lead and offer a little more. An extra pump session for a few days helps your supply keep up.' : nurses() ? 'Follow his lead and feed more often. The extra feeds tell your body to make more milk. It isn’t a sign your supply is low.' : 'Follow his lead. Offer a little more, or an extra bottle, if he still seems hungry.')
      + call('Fewer wet diapers, or it goes on for more than a few days.')),
    distract: () => page(head('Common now', 'Quick, distracted feeds', 'Around 4–6 months, the world gets interesting, and feeds get short and busy.', C.blue)
      + steps([['moon', 'A quiet, dim spot', 'Fewer things to look at'], ['clock', 'Feed when he’s drowsy', 'Before naps and bed'], ['heart', 'It passes', 'And quick feeds can be full ones']], false)
      + call('Fewer wet diapers, or he isn’t gaining at a checkup.')),
    gag: () => page(head('Tough feed?', 'Gagging or choking?', 'Gagging is loud and normal while he learns to eat. Choking is often silent.', C.blue)
      + two(['Gagging: normal', 'Coughing, sputtering, red face, tongue out. Stay calm and let him work it out.', '#e4f3ec', '#356651'], ['Choking: act now', 'Silent or a high squeak, can’t cough or cry, turning blue.', '#fbe9e9', '#a33a3a'])
      + h2('Making it less likely') + steps([['star', 'Sitting upright', 'Always, and always watched'], ['hand', 'Safe shapes', 'Soft, squashable, finger-size'], ['clock', 'No rushing', 'Never while he’s moving around']], false)
      + firstAid()),
    picky: () => page(head('Common now', 'Picky days', 'Appetite goes up and down from day to day. That’s normal.', C.blue)
      + steps([['heart', 'Keep offering', 'A new food can take 10–15 tries'], ['hand', 'No pressure', 'You choose what, he chooses how much'], ['smile', 'Eat together', 'He learns by watching you']], false)
      + call('He isn’t gaining at a checkup, or eats very little for more than a few days and seems unwell.')),

    // ---------- Tough feed? ----------
    gas: () => page(head('Tough feed?', 'Gas and lots of crying', stg() <= 1 ? 'Babies swallow air when they feed and cry. Fussy spells often peak around 6 weeks and ease by 3–4 months.' : 'Babies swallow air when they feed and cry. Burping and movement usually help.')
      + steps([['hand', 'Burp', 'During and after feeds'], ['smile', 'Bicycle his legs', 'Or fold his knees to his tummy'], ['heart', 'Tummy-down', 'Across your knees, a gentle back rub']], false)
      + small('Gas drops or gripe water?', 'ask your pediatrician first.')
      + call('Gas with a fever or vomiting, or crying that won’t settle.')),
    fussy: () => page(head('Tough feed?', 'Fussy or arching at feeds', 'Usually he’s too hungry, the flow is too fast or slow, he has gas, or he’s full.')
      + steps([['clock', 'Feed at early cues', 'Before crying starts'], ['heart', 'Calm him first', 'Then offer again'], ['hand', nurses() ? 'Fast letdown?' : 'Check the nipple flow', nurses() ? 'Lean back so he feeds against gravity' : 'Too fast or too slow both cause fussing']], false)
      + call('Arching and crying at every feed, refusing several feeds in a row, or slow weight gain.')),
    sleepy: () => page(head('Tough feed?', 'Too sleepy to feed', 'Newborns often doze off mid-feed. Until he’s back to birth weight, wake him if it’s been about 3 hours.')
      + steps([['hand', 'Undress him', 'Down to his diaper'], ['drop', 'Change his diaper', 'Halfway through'], ['heart', 'Gently stroke', 'His feet or cheek']], false)
      + urgent('Very hard to wake, floppy, or yellow skin spreading to his belly or legs.')),
    refusebottle: () => page(head('Tough feed?', 'Won’t take a bottle', 'Common for babies who nurse. Most come around with a little patience.')
      + steps([['heart', 'Someone else offers it', 'Ideally while you’re out of the room'], ['clock', 'Before he’s very hungry', 'Calm is easier'], ['bottle', 'A slow-flow nipple', 'Warm, and give it a few days']], false)),
    hiccups: () => page(head('Tough feed?', 'Hiccups', 'Very common, and they rarely bother babies. They usually stop on their own.')
      + steps([['hand', 'A burp or a pause', 'Can help them pass'], ['clock', 'Calmer feeds', 'Before he’s very hungry'], ['smile', 'Nothing else needed', 'No remedies']], false)),
    refusefood: () => page(head('Tough feed?', 'Refusing food', 'Some days he’ll barely eat. Milk is still a main food until 12 months, so a light day is fine.')
      + steps([['heart', 'Try again later', 'No pressure'], ['bowl', 'Offer what he likes', 'Alongside something new'], ['clock', 'Keep meals short', 'About 15–20 minutes']], false)
      + call('Refusing milk too, fewer wet diapers, or he seems unwell.')),
    constipation: () => page(head('Tough feed?', 'Constipation', 'Harder poop is common as solids start.')
      + steps([['drop', 'Water with meals', 'From a cup'], ['bowl', 'Pears, prunes, peas', 'And oatmeal'], ['smile', 'Bicycle his legs', 'Gently']], false)
      + call('Blood in the poop, pain, vomiting, or no poop for 2 days after trying these.')
      + urgent('A hard, swollen belly, or he seems in a lot of pain. Call your pediatrician right away.')),
    rash: () => page(head('Tough feed?', 'A rash after a new food', 'Most rashes around the mouth come from food rubbing the skin. A few hives can be an allergy.')
      + two(['Around the mouth only', 'Red where food touched, fades within an hour. Usually skin irritation.', '#e4f3ec', '#356651'], ['Hives', 'Raised, itchy welts. Stop that food and call your pediatrician.', '#fdeee6', '#9a5a3c'])
      + `<p class="care-urgent"><b>${F('Call 911:')}</b> ${F('trouble breathing, a swollen face, lips or tongue, hives all over, or hives with vomiting.')}</p>`),
    biting: () => page(head('Tough feed?', 'Biting while nursing', 'Common once teeth come. Babies can’t bite while actively feeding, so it usually happens at the end.')
      + steps([['hand', 'Calmly take him off', 'Slide a finger in to break the seal'], ['clock', 'End the feed', 'If it happens again'], ['heart', 'Offer a teether', 'Before feeds if his gums are sore']], false)),

    // ---------- Show me how ----------
    latch: () => page(head('Show me how', 'Latch and holds', 'A good latch feels like a strong tug, not a pinch.')
      + h2('A good latch') + steps([['heart', 'Nose to nipple', 'Tummy to tummy with you'], ['smile', 'Wait for a wide mouth', 'Like a yawn'], ['hand', 'Bring him to you', 'Chin first']], true)
      + small('Pinching?', 'slide a clean finger into the corner of his mouth to break the seal, and try again.')
      + h2('Four holds') + steps([['heart', 'Cradle', 'Head in the crook of your arm'], ['hand', 'Football', 'Tucked at your side. Easy after a C-section'], ['moon', 'Side-lying', 'You both lie on your sides'], ['smile', 'Laid-back', 'Helps with a fast letdown']], false)
      + small('Burping:', 'between sides. No burp after a few minutes is fine.')
      + call('Pain through the whole feed, cracked or bleeding nipples, or a red, painful area with a fever (it can be mastitis). If latching keeps hurting despite help, ask about his mouth, including tongue-tie.')),
    prep: () => page(head('Show me how', 'Preparing first foods', 'Soft enough to squash between your finger and thumb. Shapes change as he grows.', C.green)
      + hubStageStrip({ title: 'Textures, as he grows', items: [['bowl', 'Around 6 months', 'Smooth and mashed'], ['hand', '6–8 months', 'Soft strips the size of a finger'], ['smile', '9 months on', 'Soft pea-size pieces']], nowIndex: -1, cat: CAT, caption: 'Smooth and mashed around 6 months, soft finger-size strips at 6 to 8 months, pea-size pieces from about 9 months.' })
      + h2('Safe shapes') + p('Cook hard vegetables until soft, or grate them. Quarter grapes lengthwise. Spread nut butter thinly or stir it into food. No whole nuts or popcorn.')),
    choking: () => page(head('Show me how', 'Choking first aid', 'For babies under 1. Learn it now, and hope you never need it.', C.lilac) + firstAid()),
    how: () => { const v = stg(), solids = v >= 3;
      const all = [['latch', 'pink', 'heart', 'Latch and holds', 'How a good latch feels, and four holds', nurses()], ['bottle', 'lilac', 'bottle', 'Giving a bottle', 'Positions, pacing and nipple flow', isBottle()], ['formula', 'peach', 'bowl', 'Making formula', 'Water first, level scoops', formulaFam()], ['pump', 'peach', 'drop', 'Pumping', 'How often, and as he grows', pumps()], ['basics', 'blue', 'snow', 'How long milk lasts', 'And warming, and travel', isBottle()], ['prep', 'green', 'bowl', 'Preparing first foods', 'Safe shapes by age', v >= 2], ['choking', 'lilac', 'shield', 'Choking first aid', 'Under 1, step by step', v >= 2]]; if (solids) all.unshift(...all.splice(5, 2));
      const mine = all.filter(x => x[5]), rest = all.filter(x => !mine.includes(x));
      const list = xs => `<div class="hub-list">${xs.map(([to, c, i, t, s]) => row(c, i, '', t, s, to)).join('')}</div>`;
      return page(head('Feeding', 'Show me how', 'Step by step, for the everyday parts of feeding.', C.lilac) + list(mine)); }
  });
  Object.assign(P, {
    tiny: () => page(head('Common now', 'Tiny, messy meals', 'At first, most food ends up on the tray, the floor and his face. That’s how he learns.', C.blue)
      + steps([['smile', 'A few bites is plenty', 'Milk is still his main food'], ['hand', 'Let him explore', 'Squishing and dropping count'], ['clock', 'Short and relaxed', 'About 10–15 minutes']], false)
      + know('How you’ll know it’s going well', 'He’s curious about food, and still has 6 or more wet diapers a day.')),
    teethfeed: () => page(head('Tough feed?', 'Teething and feeds', 'Sore gums can make feeds shorter and fussier for a few days.')
      + steps([['hand', 'Rub his gums', 'With a clean finger before feeds'], ['star', 'A chilled teether', 'Firm, not frozen'], ['bowl', 'Cool, soft foods', 'Yogurt or mashed fruit']], false)
      + call('Fever, diarrhea or a runny nose: teething doesn’t cause those. Refusing milk, or fewer wet diapers.'))
  });

  // ---------- Round 2: pages tuned by how the family feeds ----------
  const momCall = t => `<p class="care-p"><b>${F('Call your doctor or a lactation consultant:')}</b> ${F(t)}</p>`;
  const onlyPump = () => pumps() && !nurses();
  Object.assign(P, {
    day: (() => { const old = P.day; return () => { const v = stg(), nurse = nurses(), fm = formulaFam(), pump = pumps();
      if (!(nurse && fm) && !onlyPump()) return old();
      const oz = fm ? ['1–3 oz', '4–5 oz', '4–6 oz', '6–8 oz', '6–8 oz'][v] : ['1–3 oz', '3–4 oz', '4–6 oz', '4–6 oz', '4–6 oz'][v];
      const N = s => ['drop', 'Nurse', s || ''], B = s => ['bottle', 'Bottle', s || (onlyPump() ? oz + (fm ? ', breast milk or formula' : '') : oz + ' of formula')], PU = s => ['drop', 'Pump', s == null ? 'You pump. Anyone can give the bottles' : s];
      const pumpDay = [
        [['6:00', ...PU()], ['7:00', ...B()], ['9:00', ...PU('')], ['10:00', ...B()], ['12:00', ...PU('')], ['1:00', ...B()], ['3:00', ...PU('')], ['4:00', ...B()], ['6:00', ...PU('')], ['7:00', ...B()], ['9:00', ...PU('')], ['11:00', ...B()], ['2:00 am', ...PU('One night pump, at first')], ['2:00 am', ...B()], ['5:00 am', ...B()]],
        [['6:30', ...PU()], ['7:00', ...B()], ['10:00', ...B()], ['10:30', ...PU('')], ['1:00', ...B()], ['2:00', ...PU('')], ['4:00', ...B()], ['6:00', ...PU('')], ['7:00', ...B('Then bed')], ['10:00', ...PU('')], ['3:00 am', ...B('After his longest stretch')], ['3:00 am', ...PU('Keep the night pump until you’ve asked about dropping it')]],
        [['6:30', ...PU()], ['7:00', ...B()], ['10:30', ...B()], ['11:00', ...PU('')], ['2:00', ...B()], ['3:30', ...PU('')], ['5:30', ...B()], ['8:00', ...B('Then bed')], ['9:30', ...PU('')]],
        [['6:30', ...PU()], ['7:00', ...B()], ['8:00', 'bowl', 'Breakfast', 'A few spoonfuls, something iron-rich'], ['11:00', ...B()], ['12:00', ...PU('')], ['3:00', ...B()], ['5:30', 'bowl', 'Dinner', 'A small taste of what you’re eating'], ['7:00', ...B('Then bed')], ['9:00', ...PU('')]],
        [['6:30', ...PU()], ['7:00', ...B()], ['8:00', 'bowl', 'Breakfast', ''], ['10:00', 'bowl', 'Snack', ''], ['12:00', 'bowl', 'Lunch', 'Water from a cup'], ['1:00', ...B('Before a nap')], ['3:30', 'bowl', 'Snack', ''], ['5:30', 'bowl', 'Dinner', 'Soft pieces of family food'], ['7:00', ...B('Then bed')], ['8:30', ...PU('Fewer sessions as meals grow')]]];
      const comboDay = [
        [['7:00', ...N()], ['9:30', ...N()], ['12:00', ...N()], ['2:30', ...N()], ['5:00', ...N()], ['6–9 pm', 'clock', 'Cluster feeding', 'Several feeds close together. Normal'], ['11:00', ...B('Formula, if that’s your plan')], ['2:00 am', ...N()], ['4:30 am', ...N()]],
        [['7:00', ...N()], ['10:00', ...N()], ['1:00', ...N()], ['4:00', ...N()], ['6–8 pm', 'clock', 'A few feeds close together', 'Normal in the evening'], ['10:00', ...B('Then bed')], ['3:00 am', ...N('After his longest stretch')]],
        [['7:00', ...N()], ['10:30', ...N()], ['2:00', ...N()], ['5:30', ...B()], ['8:00', ...N('Then bed')]],
        [['7:00', ...N()], ['8:00', 'bowl', 'Breakfast', 'A few spoonfuls, something iron-rich'], ['11:00', ...N()], ['3:00', ...B()], ['5:30', 'bowl', 'Dinner', 'A small taste of what you’re eating'], ['7:00', ...N('Then bed')]],
        [['7:00', ...N()], ['8:00', 'bowl', 'Breakfast', ''], ['10:00', 'bowl', 'Snack', ''], ['12:00', 'bowl', 'Lunch', 'Water from a cup'], ['1:00', ...B('Before a nap')], ['3:30', 'bowl', 'Snack', ''], ['5:30', 'bowl', 'Dinner', 'Soft pieces of family food'], ['7:00', ...N('Then bed')]]];
      const D = onlyPump() ? pumpDay[v] : comboDay[v];
      const html = old(); const i = html.indexOf('<div class="hub-card"><ol class="fm-day">'), j = html.indexOf('</ol></div>', i) + 11;
      return html.slice(0, i) + dayList(D) + html.slice(j); }; })(),

    enough: (() => { const old = P.enough; return () => { const v = stg(), html = old();
      let add = '';
      if (nurses() && v <= 2) add += h2('Signs a feed went well') + steps([['drop', 'You hear swallowing', 'A soft “kuh” sound, steady'], ['heart', 'Your breast feels softer', 'After the feed'], ['smile', 'He lets go, relaxed', 'Open hands, content']], false);
      if (v === 0) add += small('Poop count:', isBreast() && !formulaFam() ? 'by about day 4, often 3 or more a day.' : 'by about day 4, at least 1–2 a day is common.') + small('His first checkup', 'is usually 3–5 days after birth, with a weight check.') + small('Born a few weeks early?', 'ask your pediatrician whether he needs extra weight checks.');
      if (v <= 1) add += small('Night feeds', 'are normal and expected in the first months.');
      if (v >= 1 && v <= 2) add += small('Poop:', isBreast() && !formulaFam() ? 'in the first weeks, often 3 or more a day. After about 6 weeks, breastfed babies can go several days without one. Soft when it comes is what matters.' : 'once a day to once every few days is common. Soft when it comes is what matters.');
      const k = html.indexOf('<p class="care-p"><b>' + F('Call your pediatrician:'));
      return k > 0 ? html.slice(0, k) + add + html.slice(k) : html + add; }; })(),

    vitd: () => { const v = stg(), br = isBreast(), mostly = fd() === 'Breast milk', both = fd() === 'Both', early = typeof profile !== 'undefined' && profile.early;
      let b = '';
      if (v >= 3) b += know('Iron from food', 'An iron-rich food every day: meat, beans, lentils, eggs, or iron-fortified cereal.');
      b += h2('Vitamin D') + p(mostly ? '400 IU every day, from the first days, for as long as he gets breast milk.' : both ? '400 IU every day, even with some formula, until he drinks about 32 oz of formula a day.' : (v >= 3 ? 'Formula has vitamin D added. At 4–5 bottles a day, he may be close to 32 oz, when drops are no longer needed. Ask your pediatrician whether he still needs them.' : 'Formula has vitamin D added. Until he drinks about 32 oz a day, he needs 400 IU of drops too. Most young babies drink less than that.'));
      b += steps([nurses() && ['heart', 'On the nipple', 'Just before he latches'], isBottle() && ['bottle', 'In a little milk', 'About an ounce, before the rest of the bottle'], ['hand', 'Inside the cheek', 'Slowly, with the dropper']].filter(Boolean), false);
      b += small('Spit it up?', 'don’t repeat the dose. Just give the next one tomorrow.');
      b += h2('Iron') + (early && br ? p('Babies born early who get breast milk usually start iron drops around 1 month and keep going to 12 months. Your pediatrician will give the dose.')
: (br && !early ? small('Born a few weeks early?', 'ask your pediatrician whether he needs iron sooner.') : '') + (mostly ? p((v >= 3 ? 'Keep giving iron drops until iron-rich foods are a regular part of meals.' : 'From 4 months, he needs iron drops every day until iron-rich foods are a regular part of meals.') + ' The dose depends on his weight, so ask your pediatrician.')
        : both ? p('If more than half his milk is breast milk, he needs iron drops ' + (v >= 3 ? 'until iron-rich foods are a regular part of meals.' : 'from 4 months.') + ' If more than half is formula, the formula covers it. Your pediatrician can help you decide.')
        : p('Formula has iron added, so he doesn’t need iron drops.')));
      b += small('Other supplements:', 'ask your pediatrician before giving anything else.');
      return page(head('Every day', 'Vitamins and iron', v >= 3 ? 'An iron-rich food every day, and drops if he still needs them.' : 'A few drops a day, and what changes as he grows.', C.green) + b); },

    combo: () => page(head('Your milk', 'Nursing and formula together', (stg() === 0 ? 'Your milk comes in around days 2–5. ' : '') + 'Lots of families do both. A few habits keep your milk going for as long as you want it.')
      + steps([['heart', 'Nurse first', 'Then offer formula if he’s still hungry'], ['clock', 'Pump when a bottle replaces a feed', 'Around the same time, so your body keeps making that milk'], ['drop', 'Every feed at the breast counts', 'Any amount of breast milk helps']], false)
      + small('How much formula?', 'top-ups after nursing are often smaller than a full bottle. Let his cues decide.')
      + h2('If your supply dips') + p('Nurse or pump more often for a few days, and offer both sides. An occasional session with a hand pump, or hand-expressing, works too.')
      + h2('Your supply settles') + p('Around 6–12 weeks you’ll feel full and engorged less often. That’s your body matching what he needs, not less milk.')
      + small('Is he getting enough?', '6 or more wet diapers a day and steady growth tell you, however the milk comes.')
      + know('A plan that fits', 'A lactation consultant can help you find a mix of nursing and formula that works for you.')
      + momCall('A red, painful area on your breast with a fever, or feeling engorged for more than a day.')),

    supply: () => onlyPump() ? page(head('Your milk', 'Your supply settles', 'After the first weeks, what you pump usually levels off.')
      + steps([['drop', 'Steadier output', 'Session to session'], ['heart', 'Fewer engorged days', 'Not as full between sessions'], ['clock', 'Some sessions less', 'Mornings are often highest']], false)
      + know('This is normal', 'He needs about the same amount each day from about 1 to 6 months, often around 24–30 oz' + (formulaFam() ? ' of milk in all, breast milk and formula together.' : '.') + ' Bottles don’t need to keep getting bigger.')
      + h2('Too little?') + p('Pump more often, including once at night, and check that the flange fits: your nipple should move freely in the tunnel without rubbing. ' + (formulaFam() ? 'Formula can cover the rest. ' : '') + 'A lactation consultant can help.')
      + call('Fewer than 6 wet diapers a day, or slow weight gain at a checkup.')
      + momCall('A red, painful area on your breast with a fever.'))
      : page(head('Your milk', 'Your supply settles', 'In the weeks after your milk comes in, your body learns how much Ari needs and makes about that much.')
      + h2('What you may notice') + steps([['heart', 'Fewer engorged days', 'Not as full or hard between feeds'], ['drop', 'Less leaking', 'Between feeds and at night'], ['clock', 'Quicker feeds', 'He’s more efficient now']], false)
      + know('This is normal', 'Feeling less full doesn’t mean less milk. Wet diapers and steady growth are the signs that matter.')
      + h2('Too little?') + p('Feed more often, offer both sides, and try skin to skin. A lactation consultant can check how feeds are going.')
      + h2('Too much?') + p('Gulping, coughing or pulling off at the start of feeds can mean a fast flow. Lean back so he feeds against gravity, and burp mid-feed.')
      + call('Fewer than 6 wet diapers a day, or slow weight gain at a checkup.')
      + momCall('A red, painful area on your breast with a fever.')),

    milkin: (() => { const old = P.milkin; return () => { let h = old().split(F('Call your pediatrician:')).join(F('Call your doctor or a lactation consultant:'));
      const extra = (nurses() ? small('One side or both?', 'let him finish the first side, then offer the second. Some feeds he’ll take only one.') : '') + h2('Coffee, a drink, and medicines') + p('Coffee is fine in moderation, about 2–3 cups a day. Not drinking alcohol is safest. If you have a drink, wait at least 2 hours before ' + (nurses() ? 'nursing' : 'pumping') + '. Ask your doctor before starting any medicine.');
      const k = h.indexOf('<p class="care-p"><b>' + F('Call your doctor')); return k > 0 ? h.slice(0, k) + extra + h.slice(k) : h + extra; }; })(),
    latch: (() => { const old = P.latch; return () => old().split(F('Call your pediatrician:')).join(F('Call your doctor or a lactation consultant:')); })(),

    pump: () => { const v = stg(), nurse = nurses(), fm = formulaFam();
      if (nurse) return page(head('Bottles', 'Pumping, if you need it', 'For a bottle, or for time apart.', C.peach)
        + steps([['clock', 'Pump when a bottle replaces a feed', 'So your supply keeps up'], ['hand', 'It shouldn’t hurt', 'A flange that fits matters'], ['drop', 'Output varies', 'From session to session']], false)
        + know('How much to leave', 'About 1 oz for each hour you’re apart is a good start.')
        + small('Clean pump parts:', 'wash them after every use and let them air-dry.')
        + momCall('Pain while pumping that doesn’t ease, or a red, painful area with a fever.'));
      const early = v === 0;
      if (v >= 3) return page(head('Bottles', 'Pumping as meals grow', 'As solids grow, he needs a little less milk, and you can pump a little less.', C.peach)
        + steps([['clock', 'Drop one session at a time', 'One every few days, so you stay comfortable'], ['drop', 'Less milk over time', 'About 3–4 milk bottles a day by 9–12 months'], ['heart', 'Keep going, or wind down', 'Both are fine']], false)
        + (fm ? know('With formula too', 'Formula covers whatever you don’t pump.') : '')
        + small('Not sure how many sessions?', 'a lactation consultant can help you plan.')
        + momCall('A red, painful area with a fever, or feeling engorged for more than a day.'));
      return page(head('Bottles', early ? 'Pumping' : 'Pumping as he grows', early ? 'At first, pump about 8–12 times a day, including once at night. That tells your body how much to make.' : 'Once your supply settles, many parents pump a little less often. How much he needs stays about the same until solids.', C.peach)
        + steps(early ? [['clock', 'Every 2–3 hours', 'Day and night, at first'], ['hand', 'It shouldn’t hurt', 'Your nipple moves freely in the flange'], ['drop', 'Output varies', 'From session to session']] : [['clock', 'Fewer sessions', 'Spread through the day'], ['moon', 'The night pump', 'Ask a lactation consultant before dropping it'], ['drop', 'Same total', 'About 24–30 oz a day of milk, 1–6 months']], false)
        + (fm ? know('With formula too', 'Pump what feels sustainable. Formula covers the rest, and any amount of breast milk helps.') : '')
        + small('Clean pump parts:', 'wash them after every use and let them air-dry.')
        + (early ? small('Storing it:', 'counter 4 hours, fridge 4 days, freezer best within 6 months. Freeze in 2–4 oz portions so less goes to waste. Thaw overnight in the fridge or in a bowl of warm water.') : '')
        + momCall('Pain while pumping that doesn’t ease, a red, painful area with a fever, or a sudden big drop in what you pump.')); },

    basics: () => { const br = isBreast(), fm = formulaFam();
      const rows = [['On the counter', 'Up to 4 hours', 'Use within 2 hours of making it'], ['Once a feed starts', 'Within 2 hours', 'Within 1 hour, then toss the rest'], ['In the fridge', 'Up to 4 days', 'Up to 24 hours'], ['In the freezer', 'Best within 6 months, up to 12', 'Don’t freeze'], ['Thawed', 'Within 24 hours, in the fridge. Don’t refreeze', '']];
      const cols = [br && 1, fm && 2].filter(Boolean);
      return page(head('Bottles', 'How long milk lasts', 'And warming a bottle, and taking milk out with you.', C.blue)
        + `<div class="hub-card fm-store"><table><tr><th></th>${cols.map(c => `<th>${F(c === 1 ? 'Breast milk' : 'Formula')}</th>`).join('')}</tr>${rows.filter(r => cols.some(c => r[c])).map(r => `<tr><td>${F(r[0])}</td>${cols.map(c => `<td>${F(r[c] || '—')}</td>`).join('')}</tr>`).join('')}</table></div>`
        + (br ? small('Adding to stored milk:', 'cool fresh milk in the fridge first, then add it to milk that’s already cold. Freeze in 2–4 oz portions.') : '')
        + h2('Warming a bottle') + steps([['drop', 'Warm water', 'Or a bottle warmer'], ['hand', 'Swirl', 'To mix it'], ['heart', 'Test on your wrist', 'Warm, not hot']], true)
        + small('Never the microwave.', 'It heats unevenly. Cold or room temperature is fine too.')
        + h2('Out and about') + p((br ? 'A cooler bag with frozen ice packs keeps breast milk up to 24 hours. ' : '') + (fm ? 'Carry powder and water separately, and mix when he’s ready. ' : '') + 'When flying, breast milk and formula can go in your carry-on, even over 3.4 oz. Tell security at the start.')); },

    bottlegrow: () => page(head('Bottles', 'Bottles as he grows', 'Milk stays his main food until 12 months, even as solids start.', C.peach)
      + steps([['bottle', 'Bigger bottles, fewer of them', 'Around 6 months, often 6–8 oz, 4–5 times a day'], ['clock', 'Fewer bottles, slowly', 'About 3–4 a day by 9–12 months'], ['hand', 'A faster nipple', 'Only if feeds get slow and frustrating']], false)
      + h2('Good habits now') + steps([['star', 'Only milk in the bottle', 'No cereal, juice or anything else'], ['moon', 'No bottle in bed', 'It’s hard on new teeth'], ['heart', 'Stay with him', 'Even once he can hold it']], false)
      + small('Solids add to milk at first.', 'They don’t replace it. Most babies take no more than about 32 oz of milk a day.')
      + small('Washing bottles:', 'hot, soapy water after every feed is enough now.')),
    bottle: (() => { const old = P.bottle; return () => { const h = old().replace(F('Switch sides halfway'), F('Switch arms halfway')); return stg() >= 2 ? h.replace(F(', and sanitize them often in the first months'), '') : h; }; })(),
    prefbottle: () => page(head('Tough feed?', 'Fussy at the breast after bottles', 'Bottles can flow faster, so some babies get impatient at the breast.')
      + steps([['bottle', 'Slow, paced bottles', 'Slowest nipple, little pauses'], ['heart', 'Nurse when he’s calm', 'Before he’s very hungry'], ['hand', 'Skin to skin', 'Makes the breast feel familiar']], false)
      + small('Still preferring the bottle?', 'a lactation consultant can help.')),

    formula: () => { const v = stg(), both = fd() === 'Both';
      return page(head('Bottles', 'Making formula', 'Follow the label exactly. The amounts matter.', C.peach)
      + steps([['hand', 'Wash your hands', 'And use a clean bottle'], ['drop', 'Water first', 'The amount on the label'], ['bowl', 'Level scoops', 'Then shake well'], ['heart', 'Test on your wrist', 'Warm or room temperature']], true)
      + know('Never add extra water', 'Extra water or extra powder isn’t safe. Always use the amounts on the label.')
      + (v <= 1 ? small('Safe water:', 'under 2 months, born early, or a weak immune system: boil the water, let it cool for about 5 minutes, mix, then cool the bottle before feeding. After that, clean tap or bottled water is fine.') : small('Water:', 'clean tap or bottled water is fine.'))
      + h2('How long it lasts') + p('Use within 2 hours of making it, and within 1 hour once he starts. Toss what’s left after a feed. Made bottles keep 24 hours in the fridge, so you can make night bottles ahead.')
      + (both ? h2('With breast milk') + p('Never use breast milk in place of water. Make the formula first, then add breast milk, or give them in separate bottles. Breast milk first, then formula if he’s still hungry, means less of your milk goes to waste. Treat a mixed bottle like formula.') : '')
      + small('Which formula?', 'any standard iron-fortified infant formula. Ask your pediatrician before switching to a special one.')); },

    cups: () => page(head(isBottle() ? 'Bottles' : 'Cups', 'Practicing with a cup', isBottle() ? 'From about 6 months, an open or straw cup with meals makes the move off bottles easier later.' : 'From about 6 months, an open or straw cup with meals. He’ll drink from it at 1 and beyond.', C.blue)
      + steps([['drop', 'Water with meals', '4–8 oz a day, from a cup'], ['hand', 'Open or straw cup', 'Expect spills'], ['clock', 'Milk stays as is', 'Until 12 months']], false)
      + small('No juice before 1.', 'Water and milk are all he needs.')),

    milkmeals: () => page(head('Your milk', 'Milk is still a main food', 'Until 12 months, milk gives Ari much of what he needs. Meals are for learning.')
      + steps([['heart', nurses() ? 'Keep milk feeds going' : 'Keep milk bottles going', 'Before or after meals both work'], ['clock', 'Fewer feeds over time', 'As meals grow'], ['bowl', 'Meals are for learning', 'Tastes and textures first']], false)
      + (onlyPump() ? small('Pumping:', 'as milk feeds drop, you can drop pump sessions slowly, one every few days.') : '')
      + know('How you’ll know it’s enough', 'Wet diapers, steady growth, and a busy, content baby.')),

    at12: () => { const nurse = nurses(), bottle = isBottle();
      return page(head('Coming up', 'At 12 months', bottle ? 'Milk changes at the first birthday. Start the move to cups about a month before.' : 'Cow’s milk can join meals at the first birthday.', C.lilac)
        + (bottle ? h2('Whole milk and cups') + steps([['drop', 'Whole cow’s milk', 'From a cup, 16–24 oz a day'], ['bottle', 'Bottles to cups', 'Swap one bottle at a time, about a week apart'], ['moon', 'Bedtime bottle last', 'Aim to finish by 18 months']], true) + small('Picky about the taste?', 'mix it half and half with ' + (formulaFam() ? 'formula' : 'breast milk') + ' for a week. Toddler formula isn’t needed.') : h2('Cow’s milk') + p('From 1, whole cow’s milk from a cup can join meals, about 16–24 oz a day in all.'))
        + (isBreast() ? h2(nurse ? 'Nursing past 1' : 'Breast milk past 1') + p('There’s no need to stop at the first birthday. Breast milk can keep going alongside cow’s milk for as long as it works for you both.') : '')
        + small('After 1, no more than 24 oz of milk a day:', (bottle ? '' : 'that counts cow’s milk from a cup, not nursing. ') + 'Too much fills him up and can lower his iron.') + small('Vitamin D after 1:', 'ask your pediatrician what he needs.')); },

    cluster: () => { const nurse = nurses();
      return page(head('Common now', 'Cluster feeding', 'Lots of feeds close together for a few hours, often in the evening. It’s normal, and it passes.', C.blue)
      + steps([['clock', 'Feed when he asks', nurse ? 'Even if it feels constant' : 'Smaller bottles, closer together'], ['heart', 'Settle in', nurse ? 'Water and a snack within reach' : 'Have a bottle or two ready'], ['hand', 'Share the load', 'If someone can help, let them burp, change and soothe']], false)
      + (onlyPump() ? small('Running low on pumped milk?', (formulaFam() ? 'formula can fill the gap.' : 'add a pump session that evening. If he’s still hungry, ask your pediatrician about topping up with formula.')) : '')
      + call('Fewer wet diapers than usual, or he seems hungry and unsettled after most feeds all day.')); },

    firstbottle: () => page(head('Bottles', 'A bottle, if you want one', 'Not every nursing family needs a bottle. If you’d like one, once nursing is going well is a good time to try.', C.peach)
      + steps([['heart', 'Someone else offers it', 'He may refuse it from you at first'], ['clock', 'Before he’s very hungry', 'Calm is easier'], ['bottle', 'A slow-flow nipple', 'And pace it, like the breast']], true)
      + know('Keeping your supply up', 'When a bottle replaces a nursing feed, pump around the same time.')
      + small('Won’t take it?', 'that’s common. Try again in a day or two.'))
  });
  // Tough feed list now opens real pages
  P.worry = (v) => { v = v == null ? stg() : Number(v); const bt = isBottle();
    const items = v <= 2 ? [['bottle', 'Spit-up or vomit?', 'How much is normal, and when to call', 'spit'], ['drop', 'Gas and lots of crying', 'What helps, and gripe water', 'gas'], ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full', 'fussy'], v === 0 && ['moon', 'Too sleepy to feed', 'How to wake him, and when to call', 'sleepy'], nurses() && ['star', 'Won’t take a bottle', 'Common for babies who nurse', 'refusebottle'], nurses() && fd() === 'Both' && ['heart', 'Fussy at the breast after bottles', 'When bottles flow faster', 'prefbottle'], ['smile', 'Hiccups', 'Normal, and what helps', 'hiccups']].filter(Boolean)
      : [['shield', 'Gagging or choking?', 'How to tell, and what to do', 'gag'], ['bowl', 'Refusing food', 'Light days, and what helps', 'refusefood'], ['diaper', 'Constipation', 'Hard poop with solids', 'constipation'], ['eye', 'A rash after a new food', 'When it’s an allergy', 'rash'], ['tooth', 'Teething and feeds', 'Sore gums, shorter feeds', 'teethfeed'], nurses() && ['hand', 'Biting while nursing', 'Once teeth come', 'biting']].filter(Boolean);
    return page(head('Feeding', 'Tough feed?', 'Pick what you’re seeing.') + `<div class="hub-card care-folds care-lookoff">${items.map(([i, t, s, to]) => `<button class="care-pick" onclick="${go(to)}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>`); };
  const base = window.changesRoute;
  window.changesRoute = function (r) { const [, cat, s, a, x] = r.split(':'); if (cat === CAT && s === 'mock' && P[a]) { window.__fdLast = r; return P[a](x); } return base(r); };
  const op = window.openPage;
  window.openPage = openPage = function (r, ...rest) { if (r === 'topic:Feeding') r = 'chg:Feeding:mock:dirD'; return op.call(this, r, ...rest); };
})();
