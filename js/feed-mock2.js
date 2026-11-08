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
    #main .fd-tip p{margin:0;font-size:14px;line-height:1.5;color:var(--ink)}#main .fd-tip p+p{margin-top:8px}#main .fd-notes p+p{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}#main .hub-detail[data-ss] .fd-tip p b{display:inline;font-size:14px;color:var(--ink);font-weight:600;margin:0}
    #main .hub-detail .fd-call{margin:14px 0 12px}
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
  // Each subpage header gets a small picture, like Sleep and Everyday care
  const HEADART = { 'Your milk': () => ART.drops(4), 'Nursing and formula': () => ART.drops(4), 'Your milk and formula': () => ART.drops(4), 'Feeds': () => ART.often(5), 'Tummy': () => ART.bottle(.45), 'Support': () => ART.often(3), 'Cups': () => ART.bottle(.3), 'Bottles': () => ART.bottle(.55), 'Cups': () => ART.bottle(.3), 'Every day': () => ART.drops(2), 'Food': () => `<svg viewBox="0 0 120 40">${[0, 1].map(i => `<path d="M${8 + i * 36} 16 h28 q0 14 -14 14 q-14 0 -14 -14Z" fill="#356651" fill-opacity=".7"/>`).join('')}</svg>`, 'Getting enough': () => ART.diapers(4), 'Feeds now': () => ART.often(5), 'Common now': () => ART.often(4), 'Coming up': () => ART.often(3), 'Tough feed?': () => ART.often(3), 'Show me how': () => ART.often(4), 'Feeding': () => ART.often(4) };
  const head = (ctx, title, lead, c = C.pink) => `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}">${HEADART[ctx] ? `<span class="dev-area-head-art" aria-hidden="true">${HEADART[ctx]().replace(/#(46638c|9b4766|d98a6a|c9a24a|356651)/gi, c[1])}</span>` : ''}<p class="hub-context">${F(ctx)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`;
  // Subpages use the shared subpage look (data-ss): icons, tips and cards take the page's own color.
  // Runs of short notes are gathered into one quiet card so pages don't end in a wall of small text.
  const TXT = '<p class="(?:ss-small|ss-what|care-p)">(?:(?!<\\/p>)[\\s\\S])*<\\/p>\\s*';
  const tidy = h => h
    .replace(/<p class="ss-know"><b>((?:(?!<\/b>)[\s\S])*)<\/b>((?:(?!<\/p>)[\s\S])*)<\/p>/g, '<div class="hub-tip"><b>$1</b>$2</div>')
    // A heading followed only by text becomes one soft box with the heading as its label
    .replace(new RegExp('<h2 class="hub-h2">([^<]*)<\\/h2>\\s*((?:' + TXT + ')+)', 'g'), (m, t, body) => `<div class="hub-tip fd-tip"><b>${t}</b>${body.replace(/<p class="(?:ss-small|ss-what|care-p)">/g, '<p>')}</div>`)
    // Any other short notes, alone or in a run, sit together in one quiet card
    .replace(/(?:<p class="ss-small">(?:(?!<\/p>)[\s\S])*<\/p>\s*)+/g, m => `<div class="hub-tip fd-tip fd-notes">${m.replace(/<p class="ss-small">/g, '<p>')}</div>`)
    .replace(/(?:<p class="(?:care-p|ss-what)">(?:(?!<\/p>)[\s\S])*<\/p>\s*)+/g, m => `<div class="hub-tip fd-tip fd-notes">${m.replace(/<p class="(?:care-p|ss-what)">/g, '<p>')}</div>`);
  const page = inner => { const m = inner.match(/--area:(#[0-9a-f]+);--area-ink:(#[0-9a-f]+)/i), bg = m ? m[1] : C.pink[0], ink = m ? m[2] : C.pink[1];
    return `${css}<div class="quiet-category hub-page hub-detail care-v2" data-overview="${CAT}" data-ss="1" style="${yearTheme(CAT)};--ss-bg:${bg};--ss-ink:${ink}">${detailPageTop(CAT)}${noLact(tidy(inner))}</div>`; };
  // Families giving only stored milk don't see links to nursing, pumping or supply pages.
  const LACT = 'pump|pump0|supply|milkin|milkarea|latch|bf1|bf0|work|lump|sore|nb_pump|nb_express|biting|nstrike|prefbottle|combo|bfmilk1';
  const noLact = h => typeof stored === 'function' && stored() ? h.replace(new RegExp(`<button[^>]*onclick="openPage\\('chg:Feeding:mock:(?:${LACT})'\\)"[^>]*>[\\s\\S]*?</button>`, 'g'), '').replace(/<h2 class="hub-h2">[^<]*<\/h2>\s*<div class="[^"]*">\s*<\/div>/g, '') : h;
  const h2 = t => `<h2 class="hub-h2">${F(t)}</h2>`;
  const p = t => `<p class="care-p">${F(t)}</p>`;
  const call = t => `<div class="hub-tip fd-call"><b>${F('Call your pediatrician')}</b>${F(t.charAt(0).toUpperCase() + t.slice(1))}</div>`;
  const urgent = t => `<p class="care-urgent"><b>${F('Get help right away:')}</b> ${F(t)}</p>`;
  const row = (c, icon, label, t, sub, to) => `<button class="hub-row hl-row" style="--hl-bg:${C[c][0]};--hl-ink:${C[c][1]}" onclick="${to ? go(to) : ''}"><span class="hub-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy">${label ? `<small>${F(label)}</small>` : ''}<b>${F(t)}</b>${sub ? `<small>${F(sub)}</small>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  const steps = (items, n) => hubIconSteps(items, CAT, F(items.map(t => t[1] + ': ' + t[2]).join('. ')), n);

  const P = {
    // HOME
    h: () => { const h = H();
      const pills = h.pills('Feeding by age', [['Newborn', '0–6 weeks'], ['Milk feeds', '6 weeks–4 months'], ['Ready for solids', '4–6 months'], ['First foods', '6–9 months'], ['Meals', '9–12 months']].map(([l, a], i) => ({ label: l, age: a, on: i === 1, now: i === 1, onclick: '' })), CAT);
      const tiles = [['blue', ART.often(5), 'How often', 'Every 2–4 hours', 'From the start of one feed'], ['pink', ART.drops(8), 'Feeds a day', '7–9', 'Nursing and bottles, counted together'], ['peach', ART.bottle(.5), 'Per bottle', '4–5 oz formula', 'Breast milk: 3–4 oz'], ['yellow', ART.diapers(6), 'Wet diapers', '6 or more', 'A day']];
      let b = `<header class="hub-hero"><p class="hub-eyebrow">${F('Milk feeds')}</p><h1>${F('Feeds get quicker and further apart')}</h1><p class="hub-lead">${F('Ari is better at eating now, so feeds take less time, and many babies take their longest stretch at night.')}</p></header>`;
      b += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('Feeds now')}</b><button class="hub-card-cta" onclick="${go('day')}">${F('Example day')} ›</button></span><div class="hub-tiles">${tiles.map(([c, art, l, v, sub]) => `<div class="sm-tile" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)}</span></div>`).join('')}</div><span class="hub-card-note"><b>${F('Every day')}</b> ${F('Vitamin D drops, as long as Ari gets any breast milk.')} <button class="hub-inline-link" onclick="${go('vitd')}" style="all:unset;cursor:pointer;color:#9b4766;font-weight:600">${F('How')} ›</button></span></section>`;
      const door = (bg, ink, icon, t, sub, to) => `<button class="hub-rough-card care-rash-card" style="background:${bg};color:${ink};margin:12px 0 0" onclick="${go(to)}"><span class="hub-rough-moon" aria-hidden="true">${hubArt(icon, CAT)}</span><span class="hub-rough-copy"><b>${F(t)}</b><small>${F(sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
      b += door('#fbe4ec', '#9b4766', 'eye', 'Is this normal?', 'Getting enough, spit-up, gas, fussing', 'worry');
      b += door('#efedff', '#625084', 'bottle', 'Show me how', 'Latch, bottles, formula, storing milk', 'how');
      b += h2('Coming up') + `<div class="hub-list">${row('lilac', 'clock', 'Often around 3 months', 'Going back to work?', 'Start a few weeks ahead', 'work')}</div>`;
      b += h.next('Next, around 4 months', 'Ready for solids', go('dirD:2')) + h.note('Ages are typical. Every baby moves at their own pace.');
      return `${css}<div class="quiet-category hub-page care-v2" data-overview="${CAT}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${b}</div>`; },

    // 1 · HOW MUCH, HOW OFTEN: a day of feeds at this age
    day: () => page(head('Feeds now', 'A day of feeds at 2 months', 'An example, not a schedule. Ari leads, and no two days look the same.')
      + `<div class="hub-card"><ol class="fm-day">${[['7:00', 'drop', 'Nurse', 'Often 10–15 minutes'], ['10:00', 'bottle', 'Bottle', '4 oz'], ['1:00', 'drop', 'Nurse', ''], ['4:00', 'drop', 'Nurse', ''], ['6–8 pm', 'drop', 'A few feeds close together', 'Normal in the evening'], ['10:00', 'bottle', 'Bottle', '4–5 oz, then bed'], ['3:00 am', 'drop', 'Nurse', 'After his longest stretch']].map(([t, i, w, s]) => `<li><time>${F(t)}</time><span class="fm-ic" style="background:${i === 'bottle' ? '#fdeee6' : '#fbe4ec'}">${hubArt(i, CAT)}</span><span><b>${F(w)}</b>${s ? `<small>${F(s)}</small>` : ''}</span></li>`).join('')}</ol></div>`
      + h2('Hungry, or full?') + `<div class="fm-two"><div style="background:#e7effc"><small style="color:#46638c">${F('Hungry')}</small><span>${F('Rooting, hands to mouth, lip smacking. Crying comes last.')}</span></div><div style="background:#e4f3ec"><small style="color:#356651">${F('Full')}</small><span>${F('Slows down, turns away, relaxed open hands.')}</span></div></div>`
      + ''),

    vitd: () => page(head('Every day', 'Vitamin D drops', 'Babies who get any breast milk need 400 IU every day. Once a day, at the same time, is easiest to remember.', C.green)
      + h2('Ways to give it') + steps([['bottle', 'In a little milk', 'About an ounce in a bottle, before the rest of the feed'], ['heart', 'On the nipple', 'Just before he latches'], ['hand', 'Inside the cheek', 'Slowly, with the dropper']], false)
      + `<p class="ss-small"><b>${F('Not in a full bottle:')}</b> ${F('if he doesn’t finish it, he misses some. Check the label for the dose, since drops differ.')}</p>`
      + `<p class="ss-know"><b>${F('When to stop')}</b>${F('Once Ari drinks about 32 oz of formula a day. Formula has vitamin D added.')}</p>` + `<p class="ss-small"><b>${F('Coming up:')}</b> ${F(ageMo() < 4 ? 'at the 4-month checkup, ask about iron.' : 'at the next checkup, ask about iron.')}</p>`),

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
      + h2('Five holds') + steps([['hand', 'Cross-cradle', 'Your hand supports his head. Good while learning to latch'], ['heart', 'Cradle', 'Head in the crook of your arm'], ['hand', 'Football', 'Tucked at your side. Easy after a C-section'], ['moon', 'Side-lying', 'You both lie on your sides'], ['smile', 'Laid-back', 'Helps with a fast letdown']], false)
      + call('Pain past the first minute of a feed, cracked or bleeding nipples, or a hot, red, painful area with a fever.')),
    formula: () => page(head('Show me how', 'Making a formula bottle', 'Follow the label exactly. The amounts matter.', C.peach)
      + steps([['hand', 'Wash your hands', 'And use a clean bottle'], ['drop', 'Water first', 'The amount on the label'], ['bowl', 'Level scoops', 'Then shake well'], ['heart', 'Test on your wrist', 'Warm or room temperature']], true)
      + `<p class="ss-small"><b>${F('Never add extra water or powder.')}</b> ${F('Too much or too little can make Ari sick.')}</p>`
      + `<p class="ss-know"><b>${F('How long it lasts')}</b>${F('Use within 2 hours of making it, and within 1 hour once he starts. Made bottles keep 24 hours in the fridge.')}</p>`),
    how: () => page(head('Feeding', 'Show me how', 'Step-by-step pictures for the everyday parts of feeding.', C.lilac)
      + `<div class="hub-list">${[nurses() && row('pink', 'heart', '', 'Latch and holds', 'How a good latch feels, and five holds', 'latch'), isBottle() && row('lilac', 'bottle', '', 'Giving a bottle', 'Positions, pacing, burping and nipple flow', 'bottle'), fd() !== 'Breast milk' && row('peach', 'bowl', '', 'Making formula', 'Water first, level scoops', 'formula'), isBottle() && row('blue', 'snow', '', 'Storing and warming milk', 'How long it lasts, and travel', 'basics')].filter(Boolean).join('')}</div>`),
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
    work: () => page(head('Show me how', 'Going back to work', 'A few weeks of prep makes the first day easier for you both.', C.lilac)
      + hubStageStrip({ title: 'When to start', items: [['clock', '3–4 weeks before', 'Pump once a day'], ['bottle', '2 weeks before', 'Someone else gives a bottle'], ['heart', 'First week back', 'Pump about every 3 hours']], cat: CAT, caption: 'Start pumping once a day 3 to 4 weeks before, have someone else give a bottle 2 weeks before, and pump about every 3 hours once you are back.' })
      + h2('How') + `<ol class="care-do">${['Pump after a morning feed, when most parents have the most milk.', 'Freeze it flat in small bags of 2–4 oz, so nothing goes to waste.', 'Ask your caregiver to pace bottles and follow his cues.', 'At work, pump for each feed you miss.'].map(t => `<li>${F(t)}</li>`).join('')}</ol>`
      + h2('What’s normal') + p('What you pump is often less than he gets at the breast. Many babies refuse a bottle from a parent but take it from someone else.')
      + `<p class="ss-know"><b>${F('Your rights at work')}</b>${F('Most US employers must give you reasonable break time to pump and a private space that isn’t a bathroom, for a year after birth. Tell your manager before your first day back.')}</p>`
      + `<p class="ss-small"><b>${F('Pack:')}</b> ${F('your pump and parts, a cooler bag with ice packs, and milk storage bags.')}</p>`),

    year: () => page(head('Feeding this year', 'What changes, and when', 'Ages are typical. Each one opens a short guide when it’s close.', C.lilac)
      + `<div class="hub-card"><ol class="fm-year">${[['done', 'Milk comes in', 'Days 2–5'], ['done', 'A first bottle', 'From 3–4 weeks'], ['next', 'Going back to work', 'Often around 3 months', 'work'], ['', 'A faster nipple flow', 'When bottles get slow'], ['', 'Ready for solids', '4–6 months'], ['', 'First tastes and allergens', 'Around 6 months'], ['', 'Textures and finger foods', '7–8 months'], ['', 'Three meals', 'Around 9 months'], ['', 'Whole milk and cups', '12 months'], ['', 'Nursing past 1, or stopping', 'When you choose']].map(([s, t, w, to]) => `<li class="${s ? 'is-' + s : ''}" ${to ? `onclick="${go(to)}" style="cursor:pointer"` : ''}><i></i><span><b>${F(t)}</b><small>${F(w)}</small></span>${s === 'next' ? `<em>${F('Coming up')}</em>` : ''}</li>`).join('')}</ol></div>`),

    // WORRIES: a short list, each its own answer
    worry: () => page(head('Feeding', 'Is this normal?', 'Pick what you’re seeing.')
      + `<div class="hub-card care-folds care-lookoff">${[['diaper', 'Is he getting enough?', 'The two signs that matter now', 'enough'], ['clock', 'Suddenly hungrier', 'Growth spurts, often around 6 weeks and 3 months', 'spurt'], ['bottle', 'Spit-up or vomit?', 'How much is normal, and when to call', 'spit'], ['drop', 'Gas or lots of crying', 'What helps, and gripe water'], ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full'], ['hand', 'Sore nipples or breasts', 'Usually the latch, and when to call'], ['smile', 'Softer breasts, or less milk?', 'What’s normal as your supply settles', 'supply'], ['star', 'Won’t take a bottle', 'Common for breastfed babies']].map(([i, t, s, to]) => `<button class="care-pick" onclick="${to ? go(to) : ''}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>`),

    spit: () => page(head('Tough feed?', 'Spit-up or vomit?', 'Most babies spit up. It peaks around 4 months and is usually gone by the first birthday.')
      + `<figure class="hub-card fm-spill" role="img" aria-label="Spill one tablespoon of milk on the counter. Most spit-up is less than it looks."><div><svg viewBox="0 0 120 70"><ellipse cx="60" cy="40" rx="46" ry="20" fill="#f4e6d6"/><ellipse cx="54" cy="38" rx="30" ry="12" fill="#fff" stroke="#e6d6c4"/></svg><b>${F('Spit-up')}</b><small>${F('Flows out gently, and is usually less than it looks. Spill a tablespoon of milk to compare')}</small></div><div><svg viewBox="0 0 120 70"><path d="M20 50 q40 -40 80 -30" stroke="#c0546f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M92 14 l12 6 -12 6" stroke="#c0546f" stroke-width="5" fill="none" stroke-linecap="round"/></svg><b style="color:#a3324f">${F('Vomit')}</b><small>${F('Comes out with force, sometimes across the room')}</small></div></figure>`
      + h2('What helps') + steps([['hand', 'Upright after feeds', 'For 20–30 minutes'], ['bottle', 'Smaller feeds', 'A little more often'], ['heart', 'Burp mid-feed', 'And at the end']], false)
      + call('Forceful or projectile vomiting, fewer wet diapers, refusing feeds, or slow weight gain.')
      + urgent('Green or bloody vomit, or vomiting with a fever under 3 months.'))
  };
  /* ---------- Three directions for the home ---------- */
  const glanceCard = (note = true) => { const tiles = [['blue', ART.often(5), 'How often', 'Every 2–4 hours', 'From the start of one feed'], ['pink', ART.drops(8), 'Feeds a day', '7–9', 'Nursing and bottles, counted together'], ['peach', ART.bottle(.5), 'Per bottle', '4–5 oz formula', 'Breast milk: 3–4 oz'], ['yellow', ART.diapers(6), 'Wet diapers', '6 or more', 'A day']];
    return `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('Feeds now')}</b><button class="hub-card-cta" onclick="${go('day')}">${F('Example day')} ›</button></span><div class="hub-tiles">${tiles.map(([c, art, l, v, sub]) => `<div class="sm-tile" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)}</span></div>`).join('')}</div>${note ? `<span class="hub-card-note"><b>${F('Every day')}</b> ${F('Vitamin D drops, as long as Ari gets any breast milk.')} <button onclick="${go('vitd')}" style="all:unset;cursor:pointer;color:#9b4766;font-weight:600">${F('How')} ›</button></span>` : ''}</section>`; };
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
      <div class="quiet-category hub-page care-v2" data-overview="${CAT}" style="${yearTheme(CAT)};padding-bottom:70px">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${inner}${h.next('Next, around 4 months', 'Ready for solids', go('dirD:2'))}${h.note('Ages are typical. Every baby moves at their own pace.')}</div>${sw}`; };
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
    const tiles = [['blue', ART.often(5), 'How often', breast ? 'Every 2–4 hours' : 'Every 3–4 hours', 'From the start of one feed'], ['pink', ART.drops(8), 'Feeds a day', breast ? '7–9' : '6–8', feed === 'Both' ? 'Nursing and bottles' : breast ? 'Shorter, quicker feeds' : 'About 24–32 oz in all'], feed === 'Breast milk' ? ['peach', ART.bottle(.5), 'Each feed', 'Until he lets go', 'Often 10–15 minutes in all'] : ['peach', ART.bottle(.5), 'Per bottle', '4–5 oz', feed === 'Both' ? 'Breast milk: 3–4 oz' : 'Of formula'], ['yellow', ART.diapers(6), 'Getting enough', '6+ wet diapers', 'A day, and steady growth', 'enough']];
    const sheet = `<section class="rt-card"><div class="rt-head"><b>${F('Feeding at 2 months')}</b><button onclick="" style="all:unset;cursor:pointer;font-size:13px;font-weight:600;color:#9b4766">${F('Share')} ↗</button></div>`
      + group(feed === 'Breast milk' ? 'Your milk' : feed === 'Formula' ? 'Bottles' : 'Milk and bottles', [
          breast ? line('pink', 'heart', 'Your supply', 'Softer breasts are normal now', '', 'supply') : '',
          line('blue', 'snow', 'Milk keeps', feed === 'Breast milk' ? '4 hours out, 4 days in the fridge' : feed === 'Formula' ? 'Use within 2 hours of making it' : 'Out: breast milk 4 hours, formula 2', '', 'basics'),
          formula ? line('lilac', 'bottle', 'Bottles', 'Level, with little pauses', '', 'bottle') : ''])
      + group('Common now', [line('blue', 'clock', 'Growth spurt', 'Hungrier for a few days', '', 'spurt'), line('peach', 'bottle', 'Spit-up', 'Normal, and it eases with time', '', 'spit')])
      + `</section>`;
    return shell(hero('Feeds get quicker and further apart', 'Ari is getting better at eating, so feeds take less time.')
      + glanceCard(false).replace(/<div class="hub-tiles">[\s\S]*?<\/div><\/section>/, `<div class="hub-tiles">${tiles.map(([c, art, l, v, sub, to]) => to ? `<button class="sm-tile hub-tile hub-tile-go" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]};text-align:left;border:0;font:inherit;cursor:pointer" onclick="${go(to)}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)} ›</span></button>` : `<div class="sm-tile" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)}</span></div>`).join('')}</div><span class="hub-card-note"><b>${F('Every day')}</b> ${F(breast ? 'Vitamin D drops, as long as Ari gets any breast milk.' : 'Vitamin D drops, until Ari drinks about 32 oz of formula a day.')} <button onclick="${go('vitd')}" style="all:unset;cursor:pointer;color:#9b4766;font-weight:600">${F('How')} ›</button></span></section>`)
      + sheet
      + `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go('worry')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Tough feed?')}</b><small>${F('Gas, fussing, sore nipples and more')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`
      + `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('how')}">${F('Show me how: ' + [breast && 'latch', formula && 'bottles', feed !== 'Breast milk' && 'formula', breast && 'storing milk'].filter(Boolean).join(', '))} ›</button></div>`, 'D'); };
  const ticksPlan = rows => `<div class="hub-ticks">${rows.map(([when, t, k]) => `<button class="hub-tick ${on(k) ? 'is-on' : ''}" role="checkbox" aria-checked="${on(k)}" onclick="fcTick('${k}')"><span class="hub-tick-art">${hubArt('clock', CAT)}</span><span class="hub-row-copy"><b>${F(t)}</b><small>${F(when)}</small></span><span class="hub-tick-box" aria-hidden="true">${on(k) ? '✓' : ''}</span></button>`).join('')}</div>`;
  /* ---------- Feedback round: subpages ---------- */
  const fd = () => { const f = typeof profile !== 'undefined' && profile.feed; return ['Breast milk', 'Formula', 'Both'].includes(f) ? f : 'Both'; };
  const how = () => (typeof profile !== 'undefined' && profile.feedHow) || 'Nursing';
  const isBreast = () => fd() !== 'Formula', nurses = () => isBreast() && how() !== 'Pumping' && how() !== 'Stored', pumps = () => isBreast() && how() !== 'Nursing', isBottle = () => fd() !== 'Breast milk' || pumps();
  // Stored: weaned, giving saved (frozen) breast milk in bottles. Bottles of breast milk, like pumping, but nothing about nursing, pumping or supply.
  const stored = () => isBreast() && how() === 'Stored';
  const cueStrip = () => hubStageStrip({ title: 'Hunger cues, early to late', items: [['eye', 'Early', 'Stirring, mouth opening, turning to look'], ['hand', 'Active', 'Rooting, hands to mouth, wriggling'], ['heart', 'Late', 'Crying. Calm him first, then feed']], nowIndex: -1, cat: CAT, caption: 'Early cues: stirring, mouth opening, turning to look. Active: rooting, hands to mouth. Late: crying, so calm him first.' });
  const fullTiles = () => steps([['smile', 'Slows down', 'Fewer, lazier sucks'], ['hand', 'Relaxed, open hands', 'Fists unclench'], ['eye', 'Turns away', isBreast() ? 'Or lets go of the nipple' : 'From the bottle'], ['moon', 'Drifts off', 'Content and sleepy']], false);
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
    + h2('Pacing, step by step') + steps([['bottle', 'Bottle fairly level', 'Just enough milk in the tip'], ['hand', 'Let him draw it in', 'Touch the nipple to his lip'], ['clock', 'Pause every few sucks', 'Tip it down, then let him start again'], ['heart', 'Switch arms halfway', 'Like at the breast']], true)
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
  const SHEET = (v, feed) => { const b = feed !== 'Formula', f = feed !== 'Breast milk', both = feed === 'Both', fm = f, nurse = b && how() !== 'Pumping' && how() !== 'Stored', pump = b && how() !== 'Nursing', bottle = fm || pump;
    const T = (c, art, l, val, sub, to) => [c, art, l, val, sub, to];
    const enough = T('yellow', ART.diapers(6), 'Getting enough', '6+ wet diapers', v === 0 ? (typeof profile !== 'undefined' && profile.early ? 'A day once home, and steady gains' : ageMo() >= 0.46 ? 'A day, and steady weight gain' : 'By day 6. Back to birth weight by 2 weeks') : 'A day, and steady growth', v <= 1 ? '' : 'enough');
    const S = [
      { hero: ['Little and often, day and night', ageMo() >= 0.46 ? 'Frequent feeds day and night, getting easier by about 6 weeks.' : 'What to expect once you’re home: frequent feeds day and night, getting easier by about 6 weeks.'],
        tiles: [T('blue', ART.often(6), 'How often', b ? 'Every 2–3 hours' : 'Every 2–4 hours', 'From the start of one feed'), T('pink', ART.drops(10), 'Feeds a day', b ? '8–12' : '6–10', both ? (nurse ? 'Nursing and bottles' : 'Breast milk and formula') : 'Day and night'), !bottle ? T('peach', ART.bottle(.3), 'Each feed', 'Until he lets go', 'Often 10–20 minutes a side') : T('peach', ART.bottle(.3), 'Per bottle', !b && realStage() === 0 && ageMo() >= 0.46 ? '2–4 oz' : '1–3 oz', fm && pump ? 'Formula or breast milk' : fm && nurse ? (v === 0 ? 'A formula top-up, after nursing' : 'A full bottle. Top-ups are smaller') : fm ? 'Of formula' : 'Of breast milk'), enough],
        note: ['Every day', b ? 'Vitamin D drops, as long as Ari gets any breast milk.' : 'Vitamin D drops, until Ari drinks about 32 oz of formula a day.'],
        groups: [[b && f ? 'Milk and bottles' : b ? 'Your milk' : 'Bottles', [b && ['pink', 'heart', 'Your milk', 'Comes in around days 2–5', 'supply0'], b && ['peach', 'hand', 'Latch', 'A strong tug, not a pinch', 'latch'], f && ['blue', 'snow', 'Making bottles', 'Water first, then level scoops', 'formula']]], ['Common now', [['blue', 'clock', 'Cluster feeding', 'Lots of feeds close together', 'cluster'], ['lilac', 'moon', 'Sleepy at feeds', 'Wake him if it’s been 3 hours', 'sleepy']]]],
        tough: 'Sore nipples, spit-up, a sleepy baby', next: ['Next, from about 6 weeks', 'Milk feeds'] },
      { hero: ['Feeding starts to find a rhythm', 'Feeds get quicker and more predictable. Growth spurts and fussy days still happen.'],
        tiles: [T('blue', ART.often(5), 'How often', b ? 'Every 2–4 hours' : 'Every 3–4 hours', 'From the start of one feed'), T('pink', ART.drops(8), 'Feeds a day', b ? '7–9' : '6–8', both ? (nurse ? 'Nursing and bottles' : 'Breast milk and formula') : b ? (nurse ? 'Shorter, quicker feeds' : 'About 24–30 oz in all') : 'Up to about 32 oz in all'), !bottle ? T('peach', ART.bottle(.5), 'Each feed', 'Until he lets go', 'Often 10–15 minutes in all') : T('peach', ART.bottle(.5), 'Per bottle', fm && pump ? '3–5 oz' : fm ? '4–5 oz' : '3–4 oz', fm && pump ? 'Formula or breast milk' : fm && nurse ? 'A full bottle. Top-ups are smaller' : fm ? 'Of formula' : 'Of breast milk'), enough],
        note: ['Every day', b ? 'Vitamin D drops, as long as Ari gets any breast milk.' : 'Vitamin D drops, until Ari drinks about 32 oz of formula a day.'],
        groups: [[b && f ? 'Milk and bottles' : b ? 'Your milk' : 'Bottles', [b && ['pink', 'heart', 'Your supply', 'It settles to match him', 'supply'], ['blue', 'snow', 'How long milk lasts', feed === 'Breast milk' ? '4 hours out, 4 days in the fridge' : feed === 'Formula' ? 'Use within 2 hours of making it' : 'Breast milk 4 hours out, formula 2', 'basics'], f && ['lilac', 'bottle', 'Bottles', 'Slow, with little pauses', 'bottle']]], ['Common now', [['blue', 'clock', 'Growth spurt', 'Hungrier for a few days', 'spurt'], ['peach', 'bottle', 'Spit-up', 'Normal, and it eases with time', 'spit']]]],
        tough: 'Gas, fussing, sore nipples and more', next: ['Next, around 4 months', 'Ready for solids'] },
      { hero: ['Getting ready for solids', solidsLead()],
        tiles: [T('blue', ART.often(4), 'How often', 'Every 3–4 hours', 'From the start of one feed'), T('pink', ART.drops(6), 'Feeds a day', b && !bottle ? 'On demand' : both ? '5–8' : pump && !fm ? '5–6' : '4–6', both ? (nurse ? 'Nursing and bottles' : 'Bottles of breast milk and formula') : b ? (nurse ? 'Quick, distracted feeds' : 'About 24–30 oz in all') : 'Up to about 32 oz in all'), !bottle ? T('peach', ART.bottle(.6), 'Each feed', 'Until he lets go', 'Often only 5–10 minutes') : T('peach', ART.bottle(.6), 'Per bottle', fm && pump ? '3–6 oz' : fm ? '4–6 oz' : '4–5 oz', fm && pump ? '3–4 oz breast milk, 4–6 oz formula' : fm && nurse ? 'A full bottle. Top-ups are smaller' : fm ? 'Of formula' : 'Of breast milk'), enough],
        note: ['Every day', b ? 'Vitamin D drops, as long as Ari gets any breast milk.' : 'Vitamin D drops, until Ari drinks about 32 oz of formula a day. Formula has the iron.'],
        groups: [['Getting ready', [['green', 'bowl', 'Ready for solids?', 'Sits with support, opens for a spoon', 'signs'], ['peach', 'heart', 'Eczema or food allergies in the family?', 'Ask about starting peanut early', 'allergy'], ['lilac', 'star', 'Set up', 'A high chair, a soft spoon, a bib', 'setup']]], ['Common now', [['blue', 'eye', 'Distracted feeds', 'A quiet spot helps', 'distract']]]],
        tough: 'Distracted feeds, spit-up, gas', next: [earlyMo() > 0 ? 'Next, around 6 months adjusted' : 'Next, around 6 months', 'First foods'] },
      { hero: ['Tastes, textures and lots of mess', 'Milk is still the main food. Solids are for learning, a few bites at a time.'],
        tiles: [T('pink', ART.drops(5), 'Milk', !bottle ? 'On demand' : nurse ? '4–5 milk feeds' : '4–5 bottles', !bottle ? 'Still his main food' : nurse ? 'Nursing or bottles' : !f ? 'Milk still comes first' : '24–32 oz a day in all'), T('green', `<svg viewBox="0 0 120 40">${[0, 1].map(i => `<path d="M${8 + i * 36} 16 h28 q0 14 -14 14 q-14 0 -14 -14Z" fill="#356651" fill-opacity=".7"/>`).join('')}</svg>`, 'Solids', '1, then 2–3 meals', 'Building up by 8–9 months'), T('blue', ART.bottle(.3), 'Water', 'Sips with meals', 'From an open cup'), enough],
        note: ['Every day', 'An iron-rich food, like meat, beans, eggs or iron-fortified cereal.' + (b ? ' Vitamin D drops, as long as Ari gets any breast milk.' + (isEarly() ? ' Iron drops too, until 12 months.' : feed === 'Breast milk' ? ' Iron drops too, until iron-rich foods are going well.' : '') : ' Vitamin D drops, until Ari drinks about 32 oz of formula a day.')],
        groups: [['On the tray', [['green', 'bowl', 'First foods', 'Soft, mashed or in finger strips', 'prep'], ['peach', 'heart', 'Allergens', 'Peanut and egg early, then often', 'allergens'], ['lilac', 'shield', 'Not yet', 'No honey, whole nuts or cow’s milk to drink', 'notyet']]], ['Common now', [['blue', 'smile', 'Gagging', 'Loud and normal. It’s how he learns', 'gag'], ['yellow', 'clock', 'Tiny amounts', 'A few bites is plenty', 'pace']]]],
        tough: 'Gagging, refusing food, constipation', next: ['Next, around 9 months', 'Meals'] },
      { hero: ['Three meals, and milk still matters', 'Ari eats more like the family now. Milk drops a little as meals grow.'],
        tiles: [T('green', `<svg viewBox="0 0 120 40">${[0, 1, 2].map(i => `<path d="M${8 + i * 36} 16 h28 q0 14 -14 14 q-14 0 -14 -14Z" fill="#356651" fill-opacity=".7"/>`).join('')}</svg>`, 'Meals', '3 a day', 'Plus a snack or two'), T('pink', ART.drops(4), 'Milk', !bottle ? 'Fewer feeds' : nurse ? '3–4 milk feeds' : '3–4 bottles', !bottle || !f ? 'Around meals' : nurse ? 'Nursing or bottles' : '6–8 oz each'), T('blue', ART.bottle(.5), 'Water', '4–8 oz', 'A day, from a cup'), enough],
        note: ['Every day', 'An iron-rich food at a meal.' + (b ? ' Vitamin D drops, as long as Ari gets any breast milk.' : ' Vitamin D drops, until Ari drinks about 32 oz of formula a day.')],
        groups: [['On the tray', [['green', 'bowl', 'Family food', 'Soft pieces, no added salt', 'family'], ['lilac', 'shield', 'Not yet', 'No honey, whole nuts or cow’s milk to drink', 'notyet']]], ['Common now', [['yellow', 'clock', 'Appetite', 'Up one day, down the next', 'appetite'], ['peach', 'heart', 'Picky days', 'New foods can take 10+ tries', 'picky'], ['blue', 'drop', 'Cups', 'Practice now. Milk moves to a cup at 1', 'cups']]]],
        tough: 'Refusing food, gagging, a rash after a new food', next: ['After the first birthday', 'Cow’s milk, and family meals'] }
    ];
    return S[v];
  };
  // How to help, thought through as a parent: each row is something to do or know at this stage, shown only when it's new.
  // Same order at every stage, so it's easy to follow as stages change: The basics, Food, Milk, Cups, Every day.
  const ROWS = (v, feed) => { const b = feed !== 'Formula', fm = feed !== 'Breast milk', pump = b && how() !== 'Nursing', nurse = b && how() !== 'Pumping' && how() !== 'Stored', pumpOnly = pump && !nurse, mostlyB = feed === 'Breast milk', early = isEarly();
    const r = (c, icon, label, act, sub, to) => ({ c, icon, label, act, sub, to });
    const basics = [r('peach', 'hand', 'The basics', 'Learn positions, burping and what’s normal', 'Spit-up, hiccups and more', 'feedbasics'), r('peach', 'eye', 'The basics', 'Know what’s normal at 2–3 months', 'Spit-up, fussy evenings and more', 'normal'), r('peach', 'eye', 'The basics', 'Know what’s normal at 4–6 months', 'Short feeds, drool and more', 'normal'), r('peach', 'eye', 'The basics', 'Know what’s normal with first foods', 'Mess, gagging, funny faces', 'normal'), r('peach', 'eye', 'The basics', 'Know what’s normal at 9–12 months', 'Picky days, mess and more', 'normal')][v];
    const food = [null, null, r('green', 'bowl', 'Food', 'Watch for signs he’s ready', 'Most babies start around 6 months', 'signs'), r('green', 'bowl', 'Food', 'Start with a few bites a day', 'Iron-rich first. Allergens early and often', 'firstfoods'), r('green', 'bowl', 'Food', 'Serve three meals of family food', 'Soft pieces, no added salt', 'family')][v];
    const milk = [
      [b && r('pink', 'heart', 'Your milk', 'Expect your milk in on days 2–5', 'Full, tender breasts are normal at first', 'milkin'), nurse && fm ? r('pink', 'bottle', 'Nursing and formula', 'Nurse first, then top up with formula', 'And how to keep your milk going', 'combo') : !b ? r('pink', 'bottle', 'Bottles', 'Make each bottle safely', 'Water first, then level scoops', 'formula') : pumpOnly ? r('pink', 'bottle', 'Pumping', 'Pump 8–12 times a day', 'Including once at night, at first', 'pump') : null],
      [b ? r('pink', 'heart', 'Your milk', 'Trust your supply as it settles', 'Feeling less full doesn’t mean less milk', 'supply') : r('pink', 'bottle', 'Bottles', 'Pace each bottle', 'So he takes what he needs', 'bottle'), pumpOnly ? r('pink', 'bottle', 'Pumping', 'Adjust pumping as feeds settle', 'Fewer sessions, about the same total', 'pump') : null, b && r('pink', 'clock', 'Going back to work', 'Plan ahead if you’re going back', 'Pumping, bottles and your rights', 'work')],
      [b && r('pink', 'heart', 'Your milk', mostlyB ? 'Keep to breast milk until about 6 months' : 'Keep any breast milk going', mostlyB ? 'Then alongside food, as long as you both want' : 'Every bit helps, for as long as it works', 'howlong')],
      [nurse ? r('pink', 'heart', 'Your milk', 'Keep milk the main food', 'Nursing often drops as meals grow', 'milkmeals') : r('pink', 'bottle', 'Bottles', 'Keep bottles the main food', 'Often 6–8 oz, 4–5 times a day', 'bottlegrow'), r('blue', 'drop', 'Cups', 'Start practicing with a cup', 'Water from an open or straw cup', 'cups')],
      [r('pink', nurse && !fm ? 'heart' : 'bottle', 'At 12 months', 'Plan for the first birthday', nurse && !fm ? 'Cow’s milk joins meals, and nursing can go on' : 'Whole milk from a cup, and bottles phase out', 'at12')]
    ][v];
    const daily = [
      r('lilac', 'drop', 'Every day', b ? 'Give vitamin D drops daily' : 'Give vitamin D drops for now', b ? 'From the first days' : 'Until he drinks about 32 oz a day', 'vitd'),
      early && b ? r('lilac', 'drop', 'Every day', 'Add iron drops', 'From about 1 month, for babies born early', 'vitd') : !b ? r('lilac', 'drop', 'Every day', 'Keep up vitamin D drops', 'Stop once he drinks about 32 oz a day', 'vitd') : null,
      mostlyB && !early ? r('lilac', 'drop', 'Every day', 'Add iron drops at 4 months', 'Ask your pediatrician for the dose', 'vitd') : b && !early ? r('lilac', 'drop', 'Every day', 'Ask about iron drops', 'If over half his milk is breast milk', 'vitd') : null,
      b ? r('lilac', 'drop', 'Every day', 'Keep up vitamin D drops', early ? 'And iron drops until 12 months' : mostlyB ? 'And iron drops, until iron-rich foods are regular' : 'While he gets breast milk', 'vitd') : null,
      b ? r('lilac', 'drop', 'Every day', 'Keep up vitamin D drops', 'Until his first birthday, then ask', 'vitd') : null
    ][v];
    return [basics, food, ...milk, daily].filter(Boolean).filter(x => P[x.to]); };
  P.dirD = (v) => { v = v == null ? realStage() : Number(v); window.__fdStage = v; const feed = fd(), h = H(), st = SHEET(v, feed), b = isBreast(), f = isBottle();
    const pills = h.pills('Feeding by age', STAGES.map(([l, a], i) => ({ label: l, age: a, on: i === v, now: i === realStage(), onclick: go('dirD:' + i), change: typeof stageCanChange === 'function' && !stageCanChange(CAT, i, realStage()) ? '' : `__fdPick(${i})` })), CAT);
    const tile = ([c, art, l, val, sub, to]) => to ? `<button class="sm-tile hub-tile hub-tile-go" style="--sm-bg:${TILE[c] ? TILE[c][0] : C[c][0]};--sm-ink:${TILE[c] ? TILE[c][1] : C[c][1]};text-align:left;border:0;font:inherit;cursor:pointer" onclick="${go(to)}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(val)}</b><span>${F(sub)} ›</span></button>` : `<div class="sm-tile" style="--sm-bg:${TILE[c] ? TILE[c][0] : C[c][0]};--sm-ink:${TILE[c] ? TILE[c][1] : C[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(val)}</b><span>${F(sub)}</span></div>`;
    let b2 = `<style>#main .fd-hero{background:linear-gradient(160deg,#f9d9e5,#fce9ef 58%,#fdeee6)!important;position:relative;overflow:hidden}#main .fd-hero::after{content:"";position:absolute;right:-40px;top:-50px;width:170px;height:170px;border-radius:50%;background:#fff;opacity:.35;pointer-events:none}#main .fd-hero>*{position:relative;z-index:1}</style><header class="hub-hero fd-hero"><p class="hub-eyebrow">${F(STAGES[v][0])}</p><h1>${F(st.hero[0])}</h1><p class="hub-lead">${F(st.hero[1])}</p></header>` + (isEarly() ? `<p class="ss-small" style="margin:0 0 12px"><b>${F('Born early:')}</b> ${F('stages follow Ari’s adjusted age. If your NICU or pediatrician gave you a feeding plan, follow it first.')}</p>` : '');
    b2 += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('Feeding at a glance')}</b></span><div class="hub-tiles">${st.tiles.map(tile).join('')}</div>${st.note ? `<span class="hub-card-note"><b>${F(st.note[0])}</b> ${F(st.note[1])}</span>` : ''}</section>`;
    void NORMALCALL;
    if (v === 0) b2 += window.NBHOME(); else if (v === 1) b2 += window.M1HOME(); else if (v >= 2) b2 += window.SHOME(v); else b2 += `<div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px">${h2(v === 0 ? 'Your newborn feeding guide' : v === realStage() ? (v >= 3 ? 'How to help Ari eat now' : 'How to help Ari feed now') : 'At ' + ['the newborn stage', '6 weeks–4 months', '4–6 months', '6–9 months', '9–12 months'][v])}</div>` + `<div class="hub-list">${AREAS(v).map(x => `<button class="hub-row hl-row" style="--hl-bg:${C[x.c][0]};--hl-ink:${C[x.c][1]}" onclick="${P[x.to] ? go(x.to) : ''}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt(x.icon, CAT)}</span><span class="hub-row-copy">${x.label ? `<small>${F(x.label)}</small>` : ''}<b>${F(x.act)}</b><small>${F(x.sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`).join('')}</div>`;
    const crow = ([icon, label, act, sub, to], c) => `<button class="hub-row hl-row" style="--hl-bg:${C[c][0]};--hl-ink:${C[c][1]}" onclick="${go(to)}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><small>${F(label)}</small><b>${F(act)}</b><small>${F(sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    if (v > 1 && false) b2 += `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go('hard')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Tough feed?')}</b><small>${F(['Not eating much, too sleepy, crying that won’t settle', nurses() ? 'Crying at feeds, not eating much, bottle refusal' : 'Crying at feeds, not eating much', nurses() ? 'A nursing strike, not eating much' : 'Not eating much, or feeding when sick', 'Refusing food, a rash, teething', 'Picky days, refusing food, a rash'][v])}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    if (v === 1 && false) { const nurse = nurses(), br = isBreast();
      const W = v === 1 ? [['heart', 'He won’t stop crying', 'dig1', 'Gas', 'settle'], ['eye', 'He fusses or arches at feeds', 'rhythm1', 'Not going', 'Fussy'], ['diaper', 'He’s barely eating', 'rhythm1', 'Not going', 'Not eating'], isBottle() && nurse && ['bottle', 'He won’t take a bottle', 'bot1', 'Bottle trouble', 'take a bottle'], ['bottle', 'Lots of spit-up', 'dig1', 'Spit-up', ''], ['diaper', 'Is this poop normal?', 'dig1', 'Poop', ''], ['eye', 'He’s sick', 'rhythm1', 'Not going', 'sick'], br && ['drop', 'A lump in my breast', 'bfmilk1', 'If it hurts', 'lump']].filter(Boolean) : [['heart', 'He won’t stop crying', 'dig0', 'Gas', ''], nurse && ['heart', 'Nursing hurts', 'bf0', 'Nursing', 'sore'], ['diaper', 'He’s barely eating', 'basics0', 'When it', 'not eating'], ['moon', 'He’s too sleepy to feed', 'basics0', 'A day', 'awake'], ['bottle', 'Lots of spit-up', 'dig0', 'Spit-up', ''], ['diaper', 'Is this poop normal?', 'dig0', 'Poop', ''], ['eye', 'He fusses or pulls off at feeds', 'basics0', 'When it', 'pull off'], br ? ['drop', 'A lump, or very full breasts', 'bf0', 'milk', 'lump'] : ['eye', 'He’s sick', 'basics0', 'When it', 'stuffy']].filter(Boolean);
      b2 += `<details class="fd-worry" style="margin-top:14px;border-radius:22px;background:#fbe4ec;color:#9b4766;overflow:hidden"><summary style="list-style:none;display:flex;gap:14px;align-items:center;padding:16px 18px;cursor:pointer"><span style="width:44px;height:44px;border-radius:50%;background:#fff;display:grid;place-items:center;padding:10px;box-sizing:border-box;flex:none">${hubArt('eye', CAT)}</span><span style="flex:1"><b style="display:block;font-size:17px;color:var(--ink,#2b2840)">${F('Something not right?')}</b><small style="font-size:14px">${F('Crying, pain, not eating, poop and more')}</small></span><span aria-hidden="true" style="font-size:22px">+</span></summary><div style="display:flex;flex-wrap:wrap;gap:8px;padding:0 18px 18px">${W.map(([i, t, pg, tab, acc]) => `<button style="border:0;background:#fff;color:var(--ink,#2b2840);border-radius:999px;padding:8px 13px;font:inherit;font-size:14px;cursor:pointer" onclick="window.__fdJump=['${tab}','${acc}'];${go(pg)}">${F(t)}</button>`).join('')}</div>${(() => { const li = xs => `<ul style="margin:4px 0 10px;padding-left:18px;color:var(--ink,#2b2840)">${xs.map(x => `<li style="margin:0 0 4px">${F(x)}</li>`).join('')}</ul>`;
        return `<details style="margin:0 18px 18px;background:#fff;border-radius:16px;padding:12px 14px"><summary style="list-style:none;cursor:pointer;color:var(--ink,#2b2840)"><b>${F('When to call your pediatrician')}</b></summary><div style="font-size:14px;line-height:1.45;margin-top:8px">${li(v === 1 ? ['Fewer than 6 wet diapers a day', 'Not gaining at a checkup', 'Refusing several feeds in a row', 'Forceful vomiting after most feeds', 'Hard, pebble-like poop', 'Crying for 3 or more hours a day'] : ['Fewer than 6 wet diapers a day after day 6', 'Not back to birth weight by about 2 weeks', 'Too sleepy to feed most times, or refusing several feeds in a row', 'Forceful vomiting after most feeds', 'Hard, pebble-like poop', 'Crying for 3 or more hours a day'])}<b style="color:var(--ink,#2b2840)">${F('Call right away')}</b>${li(v === 1 ? ['Under 3 months: a fever of 100.4°F (38°C) or higher', 'From 3 months: a fever of 101°F (38.3°C) or higher', 'No wet diaper in 8 hours, or very hard to wake', 'Green or bloody vomit', 'White or very pale poop, or red or black poop'] : ['Any fever of 100.4°F (38°C) or higher', 'Very hard to wake, or yellow skin that’s spreading', 'Green or bloody vomit', 'White or very pale poop, or red or black poop after the first few days'])}${br ? `<p style="margin:0;color:var(--muted,#776)">${F('For you: a red, painful breast with a fever, or nipple pain that isn’t easing. Call your own doctor.')}</p>` : ''}</div></details>`; })()}</details><style>#main .fd-worry summary::-webkit-details-marker{display:none}#main .fd-worry[open] summary>span:last-child{transform:rotate(45deg)}</style>`; }
    b2 += h.next(st.next[0], st.next[1], v < 4 ? go('dirD:' + (v + 1)) : go('at12')) + h.note('Ages are typical. Every baby moves at their own pace.');
    return `${css}<div class="quiet-category hub-page care-v2" data-overview="${CAT}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${b2}</div>`; };
  P.milkin = () => (pumps() && !nurses()) ? page(head('Your milk', 'Your milk comes in', 'Small amounts of colostrum come first. Your milk comes in around days 2–5.')
    + h2('What’s normal') + steps([['heart', 'Full, tender breasts', 'For a few days as milk comes in'], ['drop', 'Tiny amounts at first', 'Then more each day'], ['clock', 'Pump 8–12 times a day', 'Including once at night']], false)
    + h2('What helps') + steps([['hand', 'Very full?', 'Pump a little for comfort, then a cold pack'], ['heart', 'Sore while pumping?', 'Check the flange fit, and lower the suction']], false)
    + call('Pain while pumping that doesn’t ease, or a red, painful area with a fever or chills, which can be mastitis.')) : page(head('Your milk', 'Your milk comes in', 'Small amounts of colostrum are all Ari needs at first. Your milk comes in around days 2–5.')
    + h2('What’s normal') + steps([['heart', 'Full, tender breasts', 'For a few days as milk comes in'], ['hand', 'A strong tug', 'At the start of a feed, not a pinch'], ['drop', 'Some leaking', 'Between feeds']], false)
    + h2('What helps') + steps([['clock', 'Feed often', '8–12 times a day'], ['hand', 'Very full?', 'Feed or hand-express a little, then a cold pack'], ['heart', 'Sore nipples?', 'Check the latch. A little milk or lanolin after feeds']], false)
    + call('Pain through the whole feed, cracked or bleeding nipples, or a red, painful area with a fever or chills, which can be mastitis.'));
  /* ================= Every page, built from the page map =================
     Each page is complete on its own (what's normal, what to do, when to call) and links to nothing.
     Pages follow the stage the parent is looking at and only show what fits how the family feeds. */
  const pickKey = () => 'ahead-fd-stage:' + ((typeof profile !== 'undefined' && (profile.id || profile.dob)) || 'x');
  const picked = () => { try { const n = localStorage.getItem(pickKey()); return n == null ? null : Number(n); } catch (e) { return null; } };
  const STAGE_NAMES = ['Newborn', 'Milk feeds', 'Ready for solids', 'First foods', 'Meals'];
  window.__fdPick = (i) => { const before = picked(); try { localStorage.setItem(pickKey(), String(i)); } catch (e) {}
    window.__fdStage = null; openPage('topic:Feeding');
    if (document.body) { document.querySelectorAll('.hub-toast').forEach(t => t.remove()); const el = document.createElement('div'); el.className = 'hub-toast'; el.setAttribute('role', 'status');
      el.innerHTML = `<div style="flex:1"><b>${esc('Feeding now follows ' + STAGE_NAMES[i])}</b></div><button class="hub-toast-undo" onclick="__fdUndo(${before == null ? 'null' : before})">Undo</button>`;
      document.body.appendChild(el); requestAnimationFrame(() => el.classList.add('is-in')); setTimeout(() => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 300); }, 5000); } };
  window.__fdUndo = (b) => { try { b == null ? localStorage.removeItem(pickKey()) : localStorage.setItem(pickKey(), String(b)); } catch (e) {} document.querySelectorAll('.hub-toast').forEach(t => t.remove()); window.__fdStage = null; render(); };
  const realStage = () => { if (typeof chgStageIndex === 'function' && typeof feedGroup === 'function') { try { return feedGroup(chgStageIndex('Feeding')); } catch (e) {} } const pk = picked(); if (pk != null && pk >= 0 && pk <= 4) return pk; try { const pr = typeof profile !== 'undefined' ? profile : {}; if (!pr.dob) return 1;
      const from = pr.early && pr.due ? new Date(pr.due + 'T12:00:00') : new Date(pr.dob + 'T12:00:00'), days = Math.max(0, (NOW - from) / 864e5), mo = days / 30.44;
      let v = days < 42 ? 0 : mo < 4 ? 1 : mo < 6 ? 2 : mo < 9 ? 3 : 4; const sol = typeof answers !== 'undefined' ? answers.solids : undefined;
      if (v >= 3 && sol === 'Not yet') v = 2; else if (v === 3 && sol !== 'Yes') v = 2; else if (v === 2 && sol === 'Yes') v = 3; else if (v === 4 && sol === 'Yes' && ['new', 'starting'].includes(answers.foodExperience)) v = 3; return v; } catch (e) { return 1; } };
  window.__fdReal = realStage;
  const ageMo = () => { try { const pr = profile; const from = pr.early && pr.due ? new Date(pr.due + 'T12:00:00') : new Date(pr.dob + 'T12:00:00'); return (NOW - from) / 864e5 / 30.44; } catch (e) { return 12; } };
  const stg = () => (window.__fdStage == null ? realStage() : window.__fdStage);
  const isEarly = () => typeof profile !== 'undefined' && !!profile.early;
  // Months born early, rounded (0 if not born early). Solids follow adjusted age, so say what that means by birthday.
  const earlyMo = () => { try { return profile.early && profile.due ? Math.max(0, Math.round((new Date(profile.due + 'T12:00:00') - new Date(profile.dob + 'T12:00:00')) / 864e5 / 30.44)) : 0; } catch (e) { return 0; } };
  const solidsLead = () => earlyMo() > 0 ? 'Milk is still all Ari needs. Most babies start solids around 6 months adjusted, about ' + (6 + earlyMo()) + ' months after birth for Ari.' : 'Milk is still all Ari needs. Most babies start solids around 6 months, once they show the signs.';
  // Fever rule for the baby's age (AAP): under 3 months 100.4°F, 3–6 months 101°F, 6 months on 103°F or a fever lasting over a day.
  const fever = (day = true) => { const m = ageMo(); return m < 3 ? 'a fever of 100.4°F or higher' + (day ? ', day or night' : '') : m < 6 ? 'a fever of 101°F or higher' : 'a fever of 103°F or higher, or one that lasts more than a day'; };
  const poopGo = () => { let v = 1; try { const d = (NOW - new Date(profile.dob + 'T12:00:00')) / 864e5, m = typeof hubAgeFor === 'function' ? hubAgeFor('care', actualMonth()) : developmentMonth(actualMonth()); v = d < 28 ? 0 : m < 4 ? 1 : m < 7 ? 2 : 3; } catch (e) {} return `openPage('chg:Daily rhythm:d:look:${v}:poop')`; };
  const formulaFam = () => fd() !== 'Breast milk' && fd() !== 'Prefer not to say';
  const ctx = (c) => c;
  const know = (label, t) => `<p class="ss-know"><b>${F(label)}</b>${F(t)}</p>`;
  const small = (label, t) => `<p class="ss-small"><b>${F(label)}</b> ${F(/\?$/.test(label.trim()) ? t.charAt(0).toUpperCase() + t.slice(1) : t)}</p>`;
  const two = (a, b) => `<div class="fm-two"><div style="background:${a[2] || '#e7effc'}"><small style="color:${a[3] || '#46638c'}">${F(a[0])}</small><span>${F(a[1])}</span></div><div style="background:${b[2] || '#e4f3ec'}"><small style="color:${b[3] || '#356651'}">${F(b[0])}</small><span>${F(b[1])}</span></div></div>`;
  const dayList = items => `<div class="hub-card"><ol class="fm-day">${items.map(([t, i, w, s]) => `<li><time>${F(t)}</time><span class="fm-ic" style="background:${i === 'bowl' ? '#e4f3ec' : i === 'bottle' ? '#fdeee6' : '#fbe4ec'}">${hubArt(i, CAT)}</span><span><b>${F(w)}</b>${s ? `<small>${F(s)}</small>` : ''}</span></li>`).join('')}</ol></div>`;
  const firstAid = () => h2('If he’s choking') + steps([['hand', 'Back blows, 5 times', 'Face down along your forearm, head lower than his chest'], ['heart', 'Chest thrusts, 5 times', 'Face up, two fingers in the middle of his chest'], ['clock', 'Repeat', 'Until it comes out, or help arrives']], true)
    + `<p class="care-urgent"><b>${F('Call 911:')}</b> ${F('if he can’t cough, cry or breathe, have someone call 911 right away while you start back blows. If he stops responding, start CPR.')}</p>`;

  Object.assign(P, {
    // ---------- Tiles ----------
    day: () => { const v = stg(), nurse = nurses(), fm = formulaFam(), pump = pumps();
      const milk = (sub) => !nurse && pump && v <= 2 ? ['bottle', stored() ? 'Bottle' : 'Bottle, then pump', sub || ['1–3 oz', '3–4 oz', '3–5 oz'][v]] : nurse && !fm && !pump ? ['drop', 'Nurse', sub || ''] : nurse && fm ? ['drop', 'Nurse, or a bottle', sub || ''] : ['bottle', 'Bottle', sub || (fm ? ['1–3 oz', '4–5 oz', '4–6 oz', '6–8 oz', '6–8 oz'][v] : ['1–3 oz', '3–4 oz', '3–5 oz', '3–5 oz', '3–5 oz'][v])];
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
      return page(head('Feeds now', ['A newborn day', 'A day at 2–3 months', 'A day at 4–6 months', 'A day at 6–9 months', 'A day at 9–12 months'][v], 'An example, not a schedule. Ari leads, and no two days look the same.') + dayList(D) + cues); },

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
      b += h2('Ways to give it') + steps([['bottle', 'In a little milk', 'About an ounce, before the rest of the feed'], ['heart', 'On the nipple', 'Just before he latches'], ['hand', 'Inside the cheek', 'Slowly, with the dropper']].filter((x, i) => i !== 1 || nurses()), false);
      b += small('Not in a full bottle:', 'if he doesn’t finish it, he misses some. Don’t repeat the dose if he spits up.');
      if (v >= 3) b = know('Iron from food', 'An iron-rich food every day: meat, beans, lentils, eggs, or iron-fortified cereal.') + b;
      b += h2('Iron') + (early && br ? p('Babies born early who get breast milk start iron drops at about 1 month and keep going to 12 months. Follow your care team’s dose.')
        : mostly || (fd() === 'Both') ? p((fd() === 'Both' ? 'If most of his feeds are breast milk: ' : '') + (v >= 3 ? 'keep giving iron drops until iron-rich foods are a regular part of meals.' : 'from 4 months, he needs iron drops every day until iron-rich foods are a regular part of meals.') + ' The dose depends on his weight, so ask your pediatrician.')
        : p('Formula has iron added, so he doesn’t need iron drops.'));
      b += small('Other supplements:', 'ask your pediatrician before giving anything else.');
      return page(head('Every day', 'Vitamins and iron', v >= 3 ? 'An iron-rich food every day, and drops if he still needs them.' : 'A few drops a day, and what changes as he grows.', C.lilac) + b); },

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
      + h2('If you decide to stop') + steps([['clock', 'Go slowly', 'Drop one pump session every few days'], ['hand', 'Feeling full?', 'Express just enough to be comfortable'], ['heart', 'Low mood can come', 'Tell your doctor if it lingers']], false)) : page(head('Your milk', 'How long to breastfeed', formulaFam() ? 'There’s no right length. Here’s what pediatricians recommend, and how to stop gently if you decide to.' : 'Pediatricians suggest breast milk alone for about 6 months, then alongside food for as long as it works for you both.')
      + steps([['heart', 'Any amount helps', 'A few feeds a day still count'], ['clock', 'There’s no wrong time', 'To keep going, or to stop'], ['bottle', 'Switching is fine', 'Formula is a good choice too']], false)
      + h2('If you decide to stop') + steps([['clock', 'Go slowly', 'Drop one feed every week or so, bedtime last'], ['hand', 'Feeling full?', 'Express just enough to be comfortable'], ['heart', 'Low mood can come', 'Tell your doctor if it lingers']], false)),
    milkmeals: () => page(head('Your milk', 'Milk is still a main food', 'Until 12 months, milk gives Ari much of what he needs. Meals are for learning.')
      + steps([['heart', 'Keep milk feeds going', 'Before or after meals both work'], ['clock', 'Fewer feeds over time', 'As meals grow'], ['bowl', 'Meals are for learning', 'Tastes and textures first']], false)
      + know('How you’ll know it’s enough', 'Wet diapers, steady growth, and a busy, content baby.')),
    at12: () => { const nurse = nurses(), bottle = isBottle();
      return page(head('Coming up', 'At 12 months', bottle ? 'Milk changes at the first birthday. Start the move to cups about a month before.' : 'Cow’s milk can join meals at the first birthday.', C.lilac)
        + (bottle ? h2('Whole milk and cups') + steps([['drop', 'Whole cow’s milk', 'From a cup, about 16 oz a day'], ['bottle', 'Bottles to cups', 'One at a time, about a week apart'], ['moon', 'Bedtime bottle last', 'Aim to finish by 18 months']], true) + small('Picky about the taste?', 'mix it half and half with ' + (formulaFam() ? 'formula' : 'breast milk') + ' for a week. Toddler formula isn’t needed.') : '')
        + (nurse ? h2('Nursing past 1') + p('There’s no need to stop at the first birthday. Whole cow’s milk from a cup can join alongside, and vitamin D drops continue while he nurses.') : '')
        + (bottle ? small('After 1, keep milk to 24 oz a day or less.', 'More fills him up and can lower his iron.') : '')); },

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
      + h2('Pacing, step by step') + steps([['bottle', 'Bottle fairly level', 'With milk filling the nipple'], ['hand', 'Let him draw it in', 'Touch the nipple to his lip'], ['clock', 'Pause every few sucks', 'Tip it down, then let him start again'], ['heart', 'Switch arms halfway', 'And burp every 2–3 oz']], true)
      + h2('Time for a faster nipple?') + two(['Too slow', 'He sucks hard, gets frustrated, or the nipple collapses.', '#efedff', '#625084'], ['Too fast', 'Gulping, coughing, or milk spilling from his mouth.', '#fdeee6', '#9a5a3c'])
      + small('Start with the slowest flow,', 'and go up only when it’s too slow.')
      + small('There’s no best bottle.', 'Use whichever one he takes well.') + small('Cleaning:', 'hot, soapy water after every feed, and sanitize often in the first months.')),
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
      + h2('Allergens, early and often') + p('Once a few first foods go well, offer these one at a time. Then keep each in a few times a week.') + know('The common allergens', 'Peanut (thinned, never whole), egg, dairy like yogurt, wheat, soy, sesame, fish, shellfish, and tree nuts (ground).')
      + small('After a new allergen,', 'watch for a rash, hives or vomiting over the next couple of hours.')
      + h2('Not yet') + two(['Until 1', 'Honey, cow’s milk to drink, and juice.', '#fdeee6', '#9a5a3c'], ['For years', 'Whole nuts, popcorn, whole grapes, hard raw vegetables.', '#efedff', '#625084']) + call('A few hives, or a rash that spreads past the mouth.') + `<p class="care-urgent"><b>${F('Call 911:')}</b> ${F('trouble breathing, a swollen face, hives all over, or hives with vomiting.')}</p>`),
    family: () => page(head('Food', 'Three meals of family food', 'Around 9–12 months, Ari can eat soft pieces of what you eat.', C.green)
      + steps([['bowl', '3 meals', 'Plus 1–2 snacks'], ['hand', 'Pea-size pieces', 'Once he picks things up with finger and thumb'], ['heart', 'Your family’s food', 'Set his portion aside before adding salt']], false)
      + h2('Safe shapes') + p('Quarter grapes lengthwise, cut round foods into thin strips, cook hard vegetables until soft, and spread nut butter thinly. Whole nuts and popcorn stay off the menu for years.')
      + small('Still not yet:', 'honey, and cow’s milk to drink, until 1.')),

    // ---------- Common now, in order ----------
    cluster: () => page(head('Common now', 'Cluster feeding', 'Lots of feeds close together for a few hours, often in the evening. It’s normal, and it passes.', C.blue)
      + steps([['clock', 'Feed when he asks', 'Even if it feels constant'], ['heart', 'Settle in', 'Water and a snack within reach'], ['hand', 'Take turns', 'Someone else can burp, change and soothe']], false)
      + call('Fewer wet diapers than usual, or he seems hungry and unsettled after most feeds all day.')),
    spurt: () => page(head('Common now', 'Hungrier days', 'Some days he’ll want to feed far more often. It usually lasts up to about 3 days.', C.blue)
      + steps([['clock', 'More feeds', 'Closer together'], ['heart', 'Fussier', 'Sometimes sleepier after'], ['moon', 'More night waking', 'For a night or two']], false)
      + p(stored() ? 'Follow his lead and offer a little more. Plan for your stored milk going a bit faster for a few days.' : (pumps() && !nurses()) ? 'Follow his lead and offer a little more. An extra pump session for a few days helps your supply keep up.' : nurses() ? 'Follow his lead and feed more often. The extra feeds tell your body to make more milk. It isn’t a sign your supply is low.' : 'Follow his lead. Offer a little more, or an extra bottle, if he still seems hungry.')
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
      + steps([['heart', 'Someone else offers it', 'Ideally while you’re out of the room'], ['clock', 'Before he’s very hungry', 'Calm is easier'], ['bottle', 'A slow-flow nipple', 'Warm milk helps. Give it a few days']], false)),
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
      + h2('Five holds') + steps([['hand', 'Cross-cradle', 'Your hand supports his head. Good while learning to latch'], ['heart', 'Cradle', 'Head in the crook of your arm'], ['hand', 'Football', 'Tucked at your side. Easy after a C-section'], ['moon', 'Side-lying', 'You both lie on your sides'], ['smile', 'Laid-back', 'Helps with a fast letdown']], false)
      + small('Burping:', 'between sides. No burp after a few minutes is fine.')
      + call('Pain through the whole feed, cracked or bleeding nipples, or a red, painful area with a fever (it can be mastitis). If latching keeps hurting despite help, ask about his mouth, including tongue-tie.')),
    prep: () => page(head('Show me how', 'Preparing first foods', 'Soft enough to squash between your finger and thumb. Shapes change as he grows.', C.green)
      + hubStageStrip({ title: 'Textures, as he grows', items: [['bowl', 'Around 6 months', 'Smooth and mashed'], ['hand', '6–8 months', 'Soft strips the size of a finger'], ['smile', '9 months on', 'Soft pea-size pieces']], nowIndex: -1, cat: CAT, caption: 'Smooth and mashed around 6 months, soft finger-size strips at 6 to 8 months, pea-size pieces from about 9 months.' })
      + h2('Safe shapes') + p('Cook hard vegetables until soft, or grate them. Quarter grapes lengthwise. Spread nut butter thinly or stir it into food. No whole nuts or popcorn.')),
    choking: () => page(head('Show me how', 'Choking first aid', 'For babies under 1. Learn it now, and hope you never need it.', C.lilac) + firstAid()),
    how: () => { const v = stg(), solids = v >= 3;
      const all = [['latch', 'pink', 'heart', 'Latch and holds', 'How a good latch feels, and five holds', nurses()], ['bottle', 'lilac', 'bottle', 'Giving a bottle', 'Positions, pacing and nipple flow', isBottle()], ['formula', 'peach', 'bowl', 'Making formula', 'Water first, level scoops', formulaFam()], ['pump', 'peach', 'drop', 'Pumping', 'How often, and as he grows', pumps()], ['basics', 'blue', 'snow', 'How long milk lasts', 'And warming, and travel', isBottle()], ['prep', 'green', 'bowl', 'Preparing first foods', 'Safe shapes by age', v >= 2], ['choking', 'lilac', 'shield', 'Choking first aid', 'Under 1, step by step', v >= 2]]; if (solids) all.unshift(...all.splice(5, 2));
      all.splice(2, 0, ['burp', 'blue', 'hand', 'Burping', 'Three positions, and how often', v <= 2]); all.push(['work', 'lilac', 'clock', 'Going back to work', 'Pumping plan and your rights', isBreast() && v >= 1 && v <= 3]); all.push(['vitd', 'lilac', 'drop', 'Vitamin D and iron', 'How to give drops, and when to stop', true]); all.push(['firstbottle', 'peach', 'bottle', 'A first bottle', 'When and how, for nursing families', nurses() && !isBottle() && v <= 1]);
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
  const momCall = t => `<div class="hub-tip fd-call"><b>${F('Call your doctor or a lactation consultant')}</b>${F(t)}</div>`;
  const onlyPump = () => pumps() && !nurses();
  Object.assign(P, {
    day: (() => { const old = P.day; return () => { const v = stg(), nurse = nurses(), fm = formulaFam(), pump = pumps();
      if (!(nurse && fm) && !onlyPump()) return old();
      const oz = fm ? ['1–3 oz', '4–5 oz', '4–6 oz', '6–8 oz', '6–8 oz'][v] : ['1–3 oz', '3–4 oz', '4–5 oz', '4–6 oz', '4–6 oz'][v];
      const N = s => ['drop', 'Nurse', s || ''], B = s => ['bottle', 'Bottle', s || (onlyPump() ? oz + (fm ? ', breast milk or formula' : '') : oz + ' of formula')], PU = s => ['drop', 'Pump', s == null ? 'You pump. Anyone can give the bottles' : s];
      const pumpDay = [
        [['6:00', ...PU()], ['7:00', ...B()], ['9:00', ...PU('')], ['10:00', ...B()], ['12:00', ...PU('')], ['1:00', ...B()], ['3:00', ...PU('')], ['4:00', ...B()], ['6:00', ...PU('')], ['7:00', ...B()], ['9:00', ...PU('')], ['11:00', ...B()], ['11:30', ...PU('')], ['2:00 am', ...PU('One night pump, at first')], ['2:00 am', ...B()], ['5:00 am', ...B()]],
        [['6:30', ...PU()], ['7:00', ...B()], ['10:00', ...B()], ['10:30', ...PU('')], ['1:00', ...B()], ['2:00', ...PU('')], ['4:00', ...B()], ['6:00', ...PU('')], ['7:00', ...B('Then bed')], ['10:00', ...PU('')], ['3:00 am', ...B('After his longest stretch')], ['3:00 am', ...PU('Keep the night pump until you’ve asked about dropping it')]],
        [['6:30', ...PU()], ['7:00', ...B()], ['10:30', ...B()], ['11:00', ...PU('')], ['2:00', ...B()], ['3:30', ...PU('')], ['5:30', ...B()], ['8:00', ...B('Then bed')], ['9:30', ...PU('')], ['2:00 am', ...PU('Until you’ve asked about dropping it')]],
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

    enough: (() => { const old = P.enough; return () => { const v = stg(); let html = old();
      if (v === 0) html = html.replace(F('mustard yellow and seedy.'), F('mustard yellow and seedy. By about day 4, often 3 or more a day.')).replace(F('tan to yellow and a little firmer.'), F('tan to yellow and a little firmer. By about day 4, at least 1–2 a day is common.'));
      let add = '';
      if (nurses() && v <= 2) add += h2('Signs a feed went well') + steps([['drop', 'You hear swallowing', 'A soft “kuh” sound, steady'], ['heart', 'Your breast feels softer', 'After the feed'], ['smile', 'He lets go, relaxed', 'Open hands, content']], false);
      if (v === 0) add += small('His first checkup', 'is usually 3–5 days after birth, with a weight check.') + small(isEarly() ? 'Born early?' : 'Born a few weeks early?', 'ask your pediatrician whether he needs extra weight checks.');
      if (v <= 1) add += small('Night feeds', 'are normal and expected in the first months.');
      if (v >= 1 && v <= 2) add += small('Poop:', isBreast() && !formulaFam() ? 'in the first weeks, often 3 or more a day. After about 3–6 weeks, breastfed babies can go several days without one. Soft when it comes is what matters.' : 'once a day to once every few days is common. Soft when it comes is what matters.');
      const k = html.indexOf('<div class="hub-tip fd-call"><b>' + F('Call your pediatrician'));
      return k > 0 ? html.slice(0, k) + add + html.slice(k) : html + add; }; })(),

    vitd: () => { const v = stg(), br = isBreast(), mostly = fd() === 'Breast milk', both = fd() === 'Both', early = typeof profile !== 'undefined' && profile.early;
      let b = '';
      if (v >= 3) b += know('Iron from food', 'An iron-rich food every day: meat, beans, lentils, eggs, or iron-fortified cereal.');
      b += h2('Vitamin D') + p(mostly ? '400 IU every day, from the first days, for as long as he gets breast milk.' : both ? '400 IU every day, even with some formula, until he drinks about 32 oz of formula a day.' : (v >= 3 ? 'Formula has vitamin D added. Until he drinks about 32 oz a day, he needs drops too.' : 'Formula has vitamin D added. Until he drinks about 32 oz a day, he needs 400 IU of drops too. Most young babies drink less than that.'));
      b += h2('Ways to give it') + steps([nurses() && ['heart', 'On the nipple', 'Just before he latches'], isBottle() && ['bottle', 'In a little milk', 'About an ounce, before the rest of the bottle'], ['hand', 'Inside the cheek', 'Slowly, with the dropper']].filter(Boolean), false);
      b += small('Spit it up?', 'don’t repeat the dose. Just give the next one tomorrow.');
      b += h2('Iron') + (early && br ? p(v >= 3 ? 'Keep giving iron drops until 12 months, or for as long as your pediatrician says.' : 'Babies born early who get breast milk start iron drops at about 1 month and keep going to 12 months. Your pediatrician will give the dose.')
: (mostly ? p((v >= 3 ? 'Keep giving iron drops until iron-rich foods are a regular part of meals.' : 'From 4 months, he needs iron drops every day until iron-rich foods are a regular part of meals.') + ' The dose depends on his weight, so ask your pediatrician.')
        : both ? p('If more than half his milk is breast milk, he needs iron drops ' + (v >= 3 ? 'until iron-rich foods are a regular part of meals.' : 'from 4 months.') + ' If more than half is formula, the formula covers it. Your pediatrician can help you decide.')
        : p('Formula has iron added, so he doesn’t need iron drops.')));
      b += small('Other supplements:', 'ask your pediatrician before giving anything else.');
      return page(head('Every day', 'Vitamins and iron', v >= 3 ? 'An iron-rich food every day, and drops if he still needs them.' : 'A few drops a day, and what changes as he grows.', C.lilac) + b); },

    combo: () => page(head('Your milk', 'Nursing and formula together', (stg() === 0 && !isEarly() ? 'Your milk comes in around days 2–5. ' : '') + 'Lots of families do both. A few habits keep your milk going for as long as you want it.')
      + steps([['heart', 'Nurse first', 'Then offer formula if he’s still hungry'], ['clock', 'Bottle instead of a feed?', 'Pump around then to keep that milk'], ['drop', 'Every feed counts', 'Any amount of breast milk helps']], false)
      + (stg() === 0 ? h2('The first days') + steps([['hand', 'Very full?', 'Feed or hand-express a little, then a cold pack'], ['heart', 'Sore nipples?', 'Check the latch. A little milk or lanolin after feeds']], false) : '')
      + small('How much formula?', 'top-ups after nursing are often smaller than a full bottle. Let his cues decide.')
      + small('Supply dips?', 'nurse or pump more often for a few days. A hand pump or hand-expressing works too.')
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

    milkin: (() => { const old = P.milkin; return () => { let h = old().split('<b>' + F('Call your pediatrician') + '</b>').join('<b>' + F('Call your doctor or a lactation consultant') + '</b>');
      const extra = (nurses() ? small('One side or both?', 'let him finish the first side, then offer the second. Some feeds he’ll take only one.') : '') + h2('Food, coffee and drinks') + steps([['bowl', 'Food', 'No special diet. Keep taking your prenatal vitamin'], ['drop', 'Coffee', 'Up to about 2–3 cups a day'], ['clock', 'A drink', 'Not drinking is safest. Or wait 2 hours to ' + (nurses() ? 'nurse' : 'pump')], ['heart', 'Medicines', 'Ask your doctor first']], false);
      const k = h.indexOf('<div class="hub-tip fd-call"><b>' + F('Call your doctor')); return k > 0 ? h.slice(0, k) + extra + h.slice(k) : h + extra; }; })(),
    latch: (() => { const old = P.latch; return () => { const h = old().split('<b>' + F('Call your pediatrician') + '</b>').join('<b>' + F('Call your doctor or a lactation consultant') + '</b>'); const k = h.indexOf('<div class="hub-tip fd-call"><b>' + F('Call your doctor')); const x = small('One side or both?', 'let him finish the first side, then offer the second. Some feeds he’ll take only one.'); return k > 0 ? h.slice(0, k) + x + h.slice(k) : h + x; }; })(),

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
        + (early ? h2('Storing it') + steps([['clock', 'Counter', '4 hours'], ['snow', 'Fridge', '4 days'], ['star', 'Freezer', 'Best within 6 months, in 2–4 oz portions']], false) + small('Thawing:', 'overnight in the fridge, or in a bowl of warm water.') : '')
        + momCall('Pain while pumping that doesn’t ease, a red, painful area with a fever, or a sudden big drop in what you pump.')); },

    basics: () => { const br = isBreast(), fm = formulaFam();
      const rows = [['On the counter', 'Up to 4 hours', 'Use within 2 hours of making it'], ['Once a feed starts', 'Within 2 hours', 'Within 1 hour, then toss the rest'], ['In the fridge', 'Up to 4 days', 'Up to 24 hours'], ['In the freezer', 'Best within 6 months, up to 12', 'Don’t freeze'], ['Thawed', 'Within 24 hours, in the fridge. Don’t refreeze', '']];
      const cols = [br && 1, fm && 2].filter(Boolean);
      return page(head('Bottles', 'How long milk lasts', 'And warming a bottle, and taking milk out with you.', C.blue)
        + `<div class="hub-card fm-store"><table><tr><th></th>${cols.map(c => `<th>${F(c === 1 ? 'Breast milk' : 'Formula')}</th>`).join('')}</tr>${rows.filter(r => cols.some(c => r[c])).map(r => `<tr><td>${F(r[0])}</td>${cols.map(c => `<td>${F(r[c] || '—')}</td>`).join('')}</tr>`).join('')}</table></div>`
        + (br && fm ? small('Mixed bottle:', 'like formula, within 1 hour once he starts.') : '')
        + (br ? small('Adding to stored milk:', 'cool fresh milk in the fridge first, then add it to milk that’s already cold. Freeze in 2–4 oz portions.') : '')
        + h2('Warming a bottle') + steps([['drop', 'Warm water', 'Or a bottle warmer'], ['hand', 'Swirl', 'To mix it'], ['heart', 'Test on your wrist', 'Warm, not hot']], true)
        + small('Never the microwave.', 'It heats unevenly. Cold or room temperature is fine too.')
        + h2('Out and about') + steps([br && ['snow', 'A cooler bag', 'With ice packs, up to 24 hours'], fm && ['bowl', 'Powder and water', 'Carried separately, mixed when he’s ready'], ['star', 'Flying', 'Milk can go in your carry-on, even over 3.4 oz']].filter(Boolean), false)); },

    bottlegrow: () => page(head('Bottles', 'Bottles as he grows', 'Milk stays his main food until 12 months, even as solids start.', C.peach)
      + steps([onlyPump() && !formulaFam() ? ['bottle', 'About the same amount of milk', 'Around 24–30 oz a day, until meals grow'] : nurses() ? ['bottle', 'Bigger bottles, from about 6 months', 'Often 6–8 oz, 4–5 times a day'] : ['bottle', 'Bigger bottles, fewer of them', 'Around 6 months, often 6–8 oz, 4–5 times a day'], ['clock', 'Fewer bottles, slowly', 'About 3–4 a day by 9–12 months'], ['hand', 'A faster nipple', 'Only if feeds get slow and frustrating']], false)
      + h2('Good habits now') + steps([['star', 'Only milk in the bottle', 'No cereal, juice or anything else'], ['moon', 'No bottle in bed', 'It’s hard on new teeth'], ['heart', 'Stay with him', 'Even once he can hold it']], false)
      + small('Solids add to milk at first.', 'They don’t replace it. Most babies take no more than about 32 oz of milk a day.')
      + small('Washing bottles:', 'hot, soapy water after every feed is enough now.')),
    bottle: (() => { const old = P.bottle; return () => { const h = old().replace(F('Switch sides halfway'), F('Switch arms halfway')); return stg() >= 2 ? h.replace(F(', and sanitize often in the first months'), '') : h; }; })(),
    prefbottle: () => page(head('Tough feed?', 'Fussy at the breast after bottles', 'Bottles can flow faster, so some babies get impatient at the breast.')
      + steps([['bottle', 'Slow, paced bottles', 'Slowest nipple, little pauses'], ['heart', 'Nurse when he’s calm', 'Before he’s very hungry'], ['hand', 'Skin to skin', 'Makes the breast feel familiar']], false)
      + small('Still preferring the bottle?', 'a lactation consultant can help.')),

    formula: () => { const v = stg(), both = fd() === 'Both';
      return page(head('Bottles', 'Making formula', 'Follow the label exactly. The amounts matter.', C.peach)
      + steps([['hand', 'Wash your hands', 'And use a clean bottle'], ['drop', 'Water first', 'The amount on the label'], ['bowl', 'Level scoops', 'Then shake well'], ['heart', 'Test on your wrist', 'Warm or room temperature']], true)
      + know('Never add extra water', 'Extra water or extra powder isn’t safe. Always use the amounts on the label.')
      + (v <= 1 ? small('Safe water:', 'under 2 months, if he was born early, or if he has a weak immune system, boil the water and let it cool for about 5 minutes before mixing. Cool the bottle before feeding. After that, clean tap or bottled water is fine.') : small('Water:', 'clean tap or bottled water is fine.'))
      + h2('How long it lasts') + steps([['clock', '2 hours', 'After making it'], ['hand', '1 hour', 'Once he starts. Toss the rest'], ['snow', '24 hours', 'In the fridge. Night bottles can be made ahead']], false)
      + (both ? h2('Mixing with breast milk') + steps([['bowl', 'Make the formula with water', 'Breast milk can’t replace the water'], ['drop', 'Then add breast milk', 'Or give the breast milk first, then top up with formula so less goes to waste']], true) : '')
      + small('Which formula?', 'any standard iron-fortified infant formula. Ask your pediatrician before switching to a special one.')); },

    cups: () => page(head('Cups', 'Practicing with a cup', isBottle() ? 'From about 6 months, an open or straw cup with meals makes the move off bottles easier later.' : 'From about 6 months, an open or straw cup with meals. He’ll drink from it at 1 and beyond.', C.blue)
      + steps([['drop', 'Water with meals', '4–8 oz a day, from a cup'], ['hand', 'Open or straw cup', 'Expect spills'], ['clock', 'Milk stays as is', 'Until 12 months']], false)
      + small('No juice before 1.', 'Water and milk are all he needs.')),

    milkmeals: () => page(head('Your milk', 'Milk is still a main food', 'Until 12 months, milk gives Ari much of what he needs. Meals are for learning.')
      + steps([['heart', nurses() ? 'Keep milk feeds going' : 'Keep milk bottles going', 'Before or after meals both work'], ['clock', 'Fewer feeds over time', 'As meals grow'], ['bowl', 'Meals are for learning', 'Tastes and textures first']], false)
      + (onlyPump() ? small('Pumping:', 'as milk feeds drop, you can drop pump sessions slowly, one every few days.') : '')
      + know('How you’ll know it’s enough', 'Wet diapers, steady growth, and a busy, content baby.')),

    at12: () => { const nurse = nurses(), bottle = isBottle();
      return page(head('Coming up', 'At 12 months', bottle ? 'Milk changes at the first birthday. Start the move to cups about a month before.' : 'Cow’s milk can join meals at the first birthday.', C.lilac)
        + (bottle ? h2('Whole milk and cups') + steps([['drop', 'Whole cow’s milk', 'From a cup, about 16 oz a day'], ['bottle', 'Bottles to cups', 'Swap one bottle at a time, about a week apart'], ['moon', 'Bedtime bottle last', 'Aim to finish by 18 months']], true) + small('Picky about the taste?', 'mix it half and half with ' + (formulaFam() ? 'formula' : 'breast milk') + ' for a week. Toddler formula isn’t needed.') : h2('Cow’s milk') + p('From 1, whole cow’s milk from a cup can join meals. If he still nurses a lot, he needs less of it.'))
        + (isBreast() ? h2(nurse ? 'Nursing past 1' : 'Breast milk past 1') + p('There’s no need to stop at the first birthday. Breast milk can keep going alongside cow’s milk for as long as it works for you both.') : '')
        + small('After 1, keep milk to 24 oz a day or less.', (bottle ? '' : 'That counts cow’s milk from a cup, not nursing. ') + 'Too much fills him up and can lower his iron.') + small('Vitamin D after 1:', 'ask your pediatrician what he needs.')); },

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
  // Same short line on every "Your milk" page after the newborn weeks
  const drinkLine = () => know('Food, coffee and drinks', 'No special diet. Keep taking your prenatal vitamin. Up to 2–3 cups of coffee a day, and wait about 2 hours after a drink to ' + (nurses() ? 'nurse' : 'pump') + '. Ask your doctor about any medicine.');
  ['supply', 'howlong', 'milkmeals', 'at12', 'combo'].forEach(k => { const old = P[k]; P[k] = (...a) => { const h = old(...a); if (!isBreast() || (k === 'combo' && stg() === 0 && false)) return h; const i = h.indexOf('<p class="care-p"><b>'); return i > 0 && k !== 'at12' && k !== 'howlong' && k !== 'milkmeals' ? h.slice(0, i) + drinkLine() + h.slice(i) : h.replace(/<\/div>$/, drinkLine() + '</div>'); }; });
  // Born early: the care team's plan comes first, and ages are adjusted
  const v_small = h => { const j = h.indexOf('ss-head'), i = j > 0 ? h.indexOf('</div>', j) + 6 : -1; return i > 5 ? h.slice(0, i) + small('Your care team’s targets come first.', 'If they gave you any, go by those.') + h.slice(i) : h; };
  const planLine = () => know('Your care team’s plan comes first', 'If your NICU or pediatrician gave you amounts, a recipe or wake times, follow those over the general numbers here.');
  ['enough', 'formula', 'basics', 'sleepy', 'signs'].forEach(k => { const old = P[k]; P[k] = (...a) => { let h = old(...a); if (!isEarly()) return h;
    if (k === 'formula') h = h.replace(F('Extra water or extra powder isn’t safe. Always use the amounts on the label.'), F('Unless your care team gave you a special recipe, use the amounts on the label. Never add extra water.')).replace(F('any standard iron-fortified infant formula. Ask your pediatrician before switching to a special one.'), F('use the one your care team recommends, and ask before switching.'));
    if (k === 'basics') return h.replace('</table></div>', '</table></div>' + small('Fortified milk', 'can keep for less time. Follow your care team’s instructions.'));
    if (k === 'signs') return h.replace(/<\/div>$/, small('Because he was born early,', 'go by these signs and his adjusted age, and check with his pediatrician before starting.') + '</div>');
    if (k === 'sleepy') h = h.replace(F('Newborns often doze off mid-feed. Until he’s back to birth weight, wake him if it’s been about 3 hours.'), F('Babies born early often stay sleepy at feeds for longer. Follow your care team’s advice on how often to wake him.'));
    if (k === 'enough') { h = h.replace(F('Fewer than 6 wet diapers a day,'), F('He tires, breathes fast or changes color during feeds. Fewer than 6 wet diapers a day,'));
      if (stg() === 0) { const a = h.indexOf('<h2 class="hub-h2">' + F('Wet diapers, day by day')), b = h.indexOf('<p class="ss-small">', a); if (a > 0 && b > a) h = h.slice(0, a) + p('Your care team tracks his weight and diapers closely at first. Once he’s home, 6 or more wet diapers a day and steady gains at checkups are the signs to watch.') + h.slice(b);
        h = h.replace(F('In the first weeks, diapers and weight tell you.'), F('Diapers and weight gain tell you.')).replace(small('His first checkup', 'is usually 3–5 days after birth, with a weight check.'), '').replace(small('Born early?', 'ask your pediatrician whether he needs extra weight checks.'), '').replace(/ By about day 4,[^<]*/, '').replace(F('black and sticky at first, then greenish, then '), '').replace(F('Fewer wet diapers than this, not back to birth weight by 2 weeks, or very sleepy and hard to wake for feeds.'), F('He tires, breathes fast or changes color during feeds, has fewer than 6 wet diapers a day once home, or is very sleepy and hard to wake for feeds.')); }
      return v_small(h); }
    if (k === 'sleepy') h = h.replace('<p class="care-urgent">', call('he tires, breathes fast or changes color during feeds.') + '<p class="care-urgent">');
    const j = h.indexOf('ss-head'); const i = j > 0 ? h.indexOf('</div>', j) + 6 : -1; if (k === 'sleepy' || (k === 'formula' && stg() > 2)) return h; return i > 5 ? h.slice(0, i) + planLine() + h.slice(i) : h; }; });
  // Tough feed list now opens real pages
  P.worry = (v) => { v = v == null ? stg() : Number(v); const bt = isBottle();
    const items = v <= 2 ? [['bottle', 'Spit-up or vomit?', 'How much is normal, and when to call', 'spit'], ['drop', 'Gas and lots of crying', 'What helps, and gripe water', 'gas'], ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full', 'fussy'], ['diaper', 'Not eating much', 'What to try, and how to tell it’s okay', 'small'], v >= 1 && ['clock', 'Snacking', 'Small feeds, every hour or so', 'snack'], ['moon', 'Eating more at night', v === 0 ? 'Days and nights mixed up' : 'Less in the day, more at night', 'nights'], nurses() && v >= 1 && ['heart', 'Suddenly refusing the breast', 'A nursing strike, and what helps', 'nstrike'], fd() !== 'Breast milk' && ['bottle', 'Is it the formula?', 'Before you switch', 'isformula'], ['diaper', 'Poop and straining', 'What’s normal on milk', 'poop'], ['eye', 'Feeding when he’s sick', 'A stuffy nose, or not interested', 'sick'], isBreast() && ['heart', 'A tender lump in your breast', 'A clogged duct, and what helps', 'lump'], (v === 0 || (isEarly() && v === 1)) && ['moon', 'Too sleepy to feed', 'How to wake him, and when to call', 'sleepy'], nurses() && ['star', 'Won’t take a bottle', 'Common for babies who nurse', 'refusebottle'], nurses() && fd() === 'Both' && ['heart', 'Fussy at the breast after bottles', 'When bottles flow faster', 'prefbottle'], ['smile', 'Hiccups', 'Normal, and what helps', 'hiccups']].filter(Boolean)
      : [['eye', 'Feeding when he’s sick', 'A stuffy nose, or not interested', 'sick'], isBreast() && ['heart', 'A tender lump in your breast', 'A clogged duct, and what helps', 'lump'], ['shield', 'Gagging or choking?', 'How to tell, and what to do', 'gag'], ['bowl', 'Refusing food', 'Light days, and what helps', 'refusefood'], ['diaper', 'Constipation', 'Hard poop with solids', 'constipation'], ['eye', 'A rash after a new food', 'When it’s an allergy', 'rash'], ['tooth', 'Teething and feeds', 'Sore gums, shorter feeds', 'teethfeed'], nurses() && ['hand', 'Biting while nursing', 'Once teeth come', 'biting']].filter(Boolean);
    const pick = ([i, t, s, to]) => `<button class="care-pick" onclick="${go(to)}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`;
    const DAY = ['small', 'snack', 'nights', 'isformula', 'poop', 'sick', 'refusefood', 'constipation'], YOU = ['lump'], during = items.filter(x => !DAY.includes(x[3]) && !YOU.includes(x[3])), day = items.filter(x => DAY.includes(x[3])), you = items.filter(x => YOU.includes(x[3]));
    const list = (t, xs) => xs.length ? h2(t) + `<div class="hub-card care-folds care-lookoff">${xs.map(pick).join('')}</div>` : '';
    return page(head('Feeding', 'Tough feed?', 'Pick what you’re seeing.') + (v <= 2 ? list('During a feed', during) + list('Across the day', day) + list('For you', you) : `<div class="hub-card care-folds care-lookoff">${items.filter(x => !YOU.includes(x[3])).map(pick).join('')}</div>` + list('For you', you))); };
  // Snacking: small, frequent feeds. Normal for many babies; worth changing only if it's wearing the family out.
  P.snack = () => page(head('Tough feed?', 'Snacking: small feeds, often', 'Some babies take a little, stop, and want more an hour later. It’s common, and it isn’t harmful.', C.blue)
    + h2('Does it need changing?') + two(['Fine as it is', 'He’s growing well, has 6+ wet diapers, and it works for you.'], ['Worth a try', 'Feeds come nearly every hour all day, he rarely settles, or you’re worn out.', '#fdeee6', '#9a5a3c'])
    + h2('For fuller feeds') + steps([['eye', 'Feed when he’s really hungry', 'Rooting and hands to mouth, not every fuss'], ['smile', 'Soothe first if he just ate', 'Rock, walk or offer a pacifier, then feed when cues come back'], ['hand', 'Keep him feeding', isBreast() && nurses() ? 'Burp, switch sides, then offer again' : 'Burp, then offer the rest of the bottle'], ['clock', 'A calm, quiet spot', 'Distraction makes feeds short']], false)
    + p('Go slowly. Stretching by about 15–30 minutes every few days is plenty.')
    + know('Not in the first weeks', 'Newborns need lots of feeds, so feed whenever he asks. The same goes for growth spurts and cluster feeding.'));
  // Eating more at night: day-night mix-up for newborns, then "less in the day, more at night"
  P.nights = () => { const v = stg(); return v === 0
    ? page(head('Tough feed?', 'Awake and hungry at night?', 'Many newborns mix up days and nights at first. It usually sorts itself out by about 6–8 weeks.', C.blue)
      + h2('What helps') + steps([['star', 'Bright, busy days', 'Daylight and everyday noise during day feeds'], ['moon', 'Quiet, dim nights', 'Low light, no play, a quick diaper change'], ['clock', 'Feeds every 2–3 hours by day', 'Wake him in the day if it’s been longer']], false)
      + p('Night feeds are normal and needed now. This is only about helping him tell day from night.'))
    : page(head('Tough feed?', 'Eating more at night', 'Some babies eat less in the day, when everything’s interesting, and make up for it at night. It’s common, and often a phase.', C.blue)
      + h2('Shifting feeds to the day') + steps([['eye', 'Offer more often by day', 'About every 2–3 hours while he’s awake'], ['clock', 'Quiet daytime feeds', 'A calm, dim spot, away from distractions'], ['heart', 'A full feed before bed', 'And one before you go to sleep, if that suits you'], ['moon', 'Keep nights dull', 'Dim light, no play, straight back to sleep']], false)
      + know('Growing well?', 'Then the total over the day matters more than when he eats it. Night feeds are still normal at this age.')
      + (nurses() ? p('After time apart in the day, some nursing babies wait for you and feed more at night. That’s common, and offering more when you’re together helps.') : '')); };
  // Nursing strike: sudden refusal after nursing well
  P.nstrike = () => page(head('Tough feed?', 'Suddenly refusing the breast', 'A baby who nursed well and suddenly won’t is often on a nursing strike. It usually passes in a few days.', C.pink)
    + h2('Common reasons') + p('A stuffy nose or sore ear, sore gums, a fright like your reaction to a bite, a busy room, or a change in your soap or routine.')
    + h2('What helps') + steps([['moon', 'Offer when he’s drowsy', 'Waking up, or about to fall asleep'], ['heart', 'Lots of skin to skin', 'Without pressure to feed'], ['clock', 'A quiet, dim room', 'Fewer things to look at'], ['bottle', 'Pump to keep your milk', 'And give it by bottle, cup or spoon meanwhile']], false)
    + p('It isn’t a sign he’s ready to stop. Most babies go back to nursing.')
    + call('Fewer than 6 wet diapers a day, or he seems unwell, has a fever or pulls at his ear.'));
  // Formula worries: most fussiness isn't the formula
  P.isformula = () => page(head('Tough feed?', 'Is it the formula?', 'Most gas, fussing and spit-up isn’t the formula, and switching often doesn’t help. It can also make it harder to tell what’s going on.', C.peach)
    + h2('Before you switch') + steps([['bottle', 'Check the bottle first', 'A slower nipple and paced feeds often help'], ['hand', 'Burp more often', 'Every 2–3 oz'], ['heart', 'Ask your pediatrician first', 'Before switching to a special formula']], false)
    + h2('Worth asking about') + p('Blood or mucus in his poop, a rash or hives, vomiting after most feeds, slow weight gain, or crying after every feed. These can point to a milk protein allergy.')
    + `<p class="care-urgent"><b>${F('Call 911:')}</b> ${F('trouble breathing, or swelling of his face, lips or tongue.')}</p>`);
  // A day at a glance: one picture of the whole day instead of a long list. Cluster feeding is a note, not a slot.
  const dayOld = P.day;
  P.day = () => { const v = stg(); if (v >= 3) return dayOld();
    const nurse = nurses(), fm = formulaFam(), pumpOnly = onlyPump(), both = nurse && pumps() && !fm;
    const T = { N: [[7, 9.5, 12, 14.5, 17, 19, 20.5, 23, 2, 4.5], [7, 9.5, 12, 14.5, 17, 19.5, 22, 3], [7, 10, 13, 16, 19, 22, 4]], B: [[7, 10, 13, 16, 19, 22, 2, 5], [7, 10.5, 14, 17.5, 21, 3.5], [7, 11, 15, 19, 22.5]], P: [[6, 9, 12, 15, 18, 21, 0, 3], [6.5, 10.5, 14, 18, 22, 3], [6.5, 11, 15, 19, 23]] };
    let feeds = (nurse ? T.N[v] : pumpOnly ? [T.N[0], T.N[1], [7, 10.5, 14, 17.5, 21, 3]][v] : T.B[v]).map(t => [t, nurse ? 'N' : 'B']);
    const pumpsAt = stored() ? [] : pumpOnly ? T.P[v] : both ? [8.5] : [];
    if (nurse && fm) { const top = [[17, 20.5], [17, 22], [16, 22]][v]; feeds = feeds.map(([t, k]) => [t, top.includes(t) ? 'T' : k]); }
    if (both) { const bt = [19, 19.5, 19][v]; feeds = feeds.map(([t, k]) => [t, t === bt ? 'B' : k]); }
    const W = 320, X = t => 14 + ((t - 6 + 24) % 24) / 24 * (W - 28), col = { N: '#c46b8e', B: '#e08a5c', T: '#c46b8e' };
    const dots = feeds.map(([t, k]) => `<circle cx="${X(t).toFixed(1)}" cy="34" r="${k === 'T' ? 6 : 7}" fill="${col[k]}"${k === 'T' ? ' stroke="#e08a5c" stroke-width="3"' : ''}/>`).join('');
    const ticks = pumpsAt.map(t => `<rect x="${(X(t) - 4).toFixed(1)}" y="50" width="8" height="8" rx="2" fill="none" stroke="#7d6aa8" stroke-width="2"/>`).join('');
    const night = `<rect x="${X(20).toFixed(1)}" y="14" width="${(X(5.99) - X(20)).toFixed(1)}" height="52" rx="10" fill="#eceef8"/>`;
    const labels = [[6, '6 am'], [12, 'noon'], [18, '6 pm'], [0, 'midnight']].map(([t, l]) => `<text x="${X(t).toFixed(1)}" y="84" text-anchor="middle" font-size="11" fill="#8a8079">${F(l)}</text>`).join('');
    const svg = `<svg viewBox="0 0 ${W} 92" role="img" aria-label="${F(feeds.length + ' feeds spread across the day and night')}" style="width:100%;height:auto;display:block">${night}<line x1="14" y1="34" x2="${W - 14}" y2="34" stroke="#ddd5ce" stroke-width="2"/>${dots}${ticks}${labels}</svg>`;
    const key = [nurse && ['#c46b8e', 'Nurse'], nurse && fm && ['#c46b8e', 'Nurse, then a formula top-up', 1], (!nurse || both) && ['#e08a5c', both || (pumpOnly && !fm) ? 'Bottle of pumped milk' : pumpOnly ? 'Bottle, breast milk or formula' : 'Bottle of formula'], pumpsAt.length && ['#7d6aa8', 'Pump', 2], ['#dfe3f3', 'Night', 3]].filter(Boolean)
      .map(([c, l, t]) => `<span style="display:inline-flex;align-items:center;gap:6px;margin:0 14px 6px 0;font-size:13px;color:var(--muted)"><i style="width:${t === 3 ? '18px' : '12px'};height:12px;border-radius:${t >= 2 ? '3px' : '50%'};${t === 2 ? `border:2px solid ${c}` : `background:${c}`};${t === 1 ? 'box-shadow:0 0 0 2.5px #e08a5c;' : ''}box-sizing:border-box;display:inline-block"></i>${F(l)}</span>`).join('');
    const often = nurse || pumpOnly ? ['Every 2–3 hours', 'Every 2–4 hours', 'Every 3–4 hours'][v] : ['Every 2–4 hours', 'Every 3–4 hours', 'Every 3–4 hours'][v];
    const count = pumpOnly && !fm ? ['8–12 bottles', '7–9 bottles', '5–6 bottles'][v] : nurse && fm && v === 2 ? '5–8 feeds' : nurse ? ['8–12 feeds', '7–9 feeds', 'Often 6–8 feeds'][v] : ['6–10 bottles', '6–8 bottles', '4–6 bottles'][v];
    const night1 = [['Feeds at night too', 'Every few hours, for now'], ['A longer night stretch', 'Often 3–5 hours'], ['One long night stretch', 'Often 5–6 hours or more']][v];
    return page(head('Feeds now', ['A newborn day', 'A day at 2–3 months', 'A day at 4–6 months'][v], 'An example, not a schedule. Ari leads, and no two days look the same.')
      + `<div class="hub-card" style="padding:14px 14px 8px">${svg}<div style="margin-top:6px">${key}</div></div>`
      + steps([['drop', count, 'In a day, day and night'], ['clock', often, 'From the start of one feed'], ['moon', night1[0], night1[1]]], false)
      + (v <= 1 ? know('Some evenings', 'Feeds may bunch together for a few hours. That’s cluster feeding. It’s common, and it passes.') : know('Some days', 'Quick, distracted feeds by day, then hungrier at night. That’s common now.'))
      + h2('Is he hungry?') + cueStrip()
      + h2('Is he full?') + fullTiles()); };
  // Nursing and formula: how a feed goes, then how to keep your milk going. The first days live on "Your milk comes in".
  P.combo = () => { const v = stg();
    return page(head('Nursing and formula', 'Nurse first, then top up', 'Lots of families do both. Here’s how a feed goes, and how to keep your milk going for as long as you want it.')
      + h2('How a feed goes') + steps([['heart', 'Nurse first', 'Both sides, until he slows down'], ['bottle', 'Then formula, if he’s still hungry', 'Often a small top-up. His cues decide']], true)
      + h2('Keeping your milk going') + steps([['clock', 'Nurse often', v === 0 ? 'About 8–12 times a day for now' : 'The more he nurses, the more you make'], ['drop', 'Bottle instead of nursing?', 'Pump around then, so that milk keeps coming'], ['heart', 'Milk seems lower?', 'Nurse or pump more often for a few days']], false)
      + know('Any amount helps', 'Every bit of breast milk counts. A lactation consultant can help you find a mix that works for you.')); };
  // Common around now: the challenges most families live with at each age, in the main flow (not hidden in a troubleshooting list).
  // Something seem off?: only quick, in-the-moment checks.
  const COMMON = (v) => { const nurse = nurses();
    return [
      [nurse ? ['heart', 'Nursing', 'Get help early if nursing hurts', 'Pain past the first minute is worth fixing', 'sore'] : ['bottle', 'Spit-up', 'Expect some spit-up', 'It’s usually less than it looks', 'spit'], ['moon', 'Evenings', 'Get through nonstop evenings', 'Cluster feeding is normal, and it passes', 'cluster'], ['clock', 'Sleepy feeds', 'Keep a sleepy newborn feeding', 'Until he’s back to birth weight', 'sleepy']],
      [['drop', 'Crying', 'Ease gas and evening crying', 'Fussy spells often peak around 6 weeks', 'gas'], ['bottle', 'Spit-up', 'Handle spit-up and reflux', 'It peaks around 4 months, then eases', 'spit'], ['clock', 'Snacking', 'Make sense of snacking', 'Small feeds, every hour or so', 'snack']],
      [['eye', 'Distraction', 'Work with distracted feeds', 'A quiet, dim spot helps', 'distract'], ['moon', 'Nights', 'Shift feeds back to the day', 'If he eats more at night', 'nights'], nurse && ['heart', 'Nursing strike', 'Ride out a nursing strike', 'Sudden refusal usually passes', 'nstrike']],
      [['shield', 'Gagging', 'Stay calm through gagging', 'Loud and normal. Choking is silent', 'gag'], ['bowl', 'Light days', 'Handle food refusal', 'A light day is fine at this age', 'refusefood'], ['diaper', 'Constipation', 'Ease harder poop', 'Common as solids start', 'constipation']],
      [['heart', 'Picky days', 'Keep offering through picky days', 'New foods can take 10–15 tries', 'picky'], ['bowl', 'Light days', 'Ride out light eating days', 'Appetite swings day to day', 'refusefood'], nurse && ['hand', 'Biting', 'Handle biting while nursing', 'Once teeth come', 'biting']]
    ][v].filter(Boolean).filter(x => P[x[4]]); };
  const OFF = (v) => { const nurse = nurses(), fm = formulaFam(), br = isBreast();
    const S = { spit: ['bottle', 'Spit-up or vomit?', 'How much is normal, and when to call', 'spit'], fussy: ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full', 'fussy'], gas: ['drop', 'Gas and lots of crying', 'What helps, and gripe water', 'gas'], small: ['diaper', 'Not eating much', 'What to try, and how to tell it’s okay', 'small'], poop: ['diaper', 'Poop and straining', 'What’s normal on milk', 'poop'], sick: ['eye', 'Feeding when he’s sick', 'A stuffy nose, or not interested', 'sick'], isformula: ['bottle', 'Is it the formula?', 'Before you switch', 'isformula'], refusebottle: ['bottle', 'Won’t take a bottle', 'Common for babies who nurse', 'refusebottle'], rash: ['eye', 'A rash after a new food', 'When it’s an allergy', 'rash'], teethfeed: ['tooth', 'Teething and feeds', 'Sore gums, shorter feeds', 'teethfeed'], constipation: ['diaper', 'Constipation', 'Hard poop with solids', 'constipation'], lump: ['heart', 'A tender lump in your breast', 'A clogged duct, and what helps', 'lump'] };
    const ids = [[nurse ? 'spit' : 'fussy', 'gas', 'poop', 'sick', fm && 'isformula', br && 'lump'], ['fussy', 'small', 'poop', 'sick', fm && 'isformula', nurse && 'refusebottle', br && 'lump'], ['spit', 'small', 'sick', fm && 'isformula', nurse && 'refusebottle', br && 'lump'], ['sick', 'rash', 'teethfeed', br && 'lump'], ['sick', 'rash', 'constipation', 'teethfeed', br && 'lump']][v];
    return ids.filter(Boolean).map(k => S[k]).filter(x => P[x[3]]); };
  const commonIds = (v) => COMMON(v).map(x => x[4]), offIds = (v) => OFF(v).map(x => x[3]);
  P.worry = (v) => { v = v == null ? stg() : Number(v);
    const pick = ([i, t, s, to]) => `<button class="care-pick" onclick="${go(to)}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`;
    const all = OFF(v), you = all.filter(x => x[3] === 'lump'), baby = all.filter(x => x[3] !== 'lump');
    return page(head('Feeding', 'Something seem off?', 'Quick checks for what you’re seeing right now.') + `<div class="hub-card care-folds care-lookoff">${baby.map(pick).join('')}</div>` + (you.length ? h2('For you') + `<div class="hub-card care-folds care-lookoff">${you.map(pick).join('')}</div>` : '')); };
  // When nursing hurts: the most common early struggle, with the fix and where to get help
  P.sore = () => page(head('Common around now', 'When nursing hurts', 'Some tenderness in the first days is common. Pain through the whole feed, or cracked nipples, usually has a fix.')
    + h2('Common causes') + steps([['heart', 'A shallow latch', 'The most common cause, and usually fixable'], ['drop', 'Very full breasts', 'Harder for him to latch on deeply'], ['hand', 'Tongue-tie, sometimes', 'Worth asking about if pain continues']], false)
    + h2('What helps') + steps([['heart', 'Re-latch if it pinches', 'Break the seal with a clean finger first'], ['smile', 'Try another hold', 'Cross-cradle or laid-back often help'], ['drop', 'Soften first if very full', 'Hand-express a little before he latches'], ['hand', 'Care for sore nipples', 'A little breast milk or lanolin after feeds']], false)
    + know('Get help early', 'A lactation consultant can watch a feed and fix most latch problems in a visit or two. Most US insurance plans cover it.')
    + `<div class="hub-tip fd-call"><b>${F('Call your doctor or a lactation consultant')}</b>${F('Cracked or bleeding nipples, pain that isn’t easing after a few days, or a red, painful area with a fever.')}</div>`);
  // Support: who can help, and how the parent is doing
  P.help = () => { const br = isBreast(), v = stg();
    return page(head('Support', 'You don’t have to figure this out alone', 'Feeding is one of the hardest parts of the first months for lots of parents. Getting help early makes a real difference.', C.lilac)
      + h2('Who can help') + steps([br && ['heart', 'A lactation consultant', 'Latch, pain, supply and pumping. Most US insurance plans cover it'], ['eye', 'Your pediatrician', v >= 3 ? 'If meals stay a struggle, or weight is a worry' : 'Weight checks, and if feeds stay hard'], ['hand', 'A feeding specialist', 'If feeds are a struggle for weeks, ask for a referral']].filter(Boolean), false)
      + know('How are you doing?', 'Hard feeds can wear on your mood. If you feel low, anxious or overwhelmed most days, tell your doctor. You can also call or text the National Maternal Mental Health Hotline, any time, at 1-833-852-6262.')); };
  // When feeding is hard: one home for every challenge. The stage only decides which come first.
  const HARD = () => { const nurse = nurses(), fm = formulaFam(), br = isBreast(), bot = isBottle(), v = stg();
    return [
      [v >= 3 ? 'Milk feeds' : 'Feeds and latch', [nurse && v <= 2 && ['heart', 'When nursing hurts', 'Causes, fixes, and getting help', 'sore'], v <= 1 && ['clock', 'Nonstop evenings', 'Cluster feeding, and sharing the load', 'cluster'], v <= 1 && ['moon', 'Too sleepy to feed', 'How to wake him, and when to call', 'sleepy'], v <= 2 && ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full', 'fussy'], v <= 2 && ['diaper', 'Not eating much', 'What to try, and how to tell it’s okay', 'small'], v >= 1 && v <= 2 && ['clock', 'Snacking', 'Small feeds, every hour or so', 'snack'], v >= 1 && v <= 2 && ['clock', 'Hungrier days', 'Growth spurts', 'spurt'], v >= 2 && v <= 3 && ['eye', 'Distracted feeds', 'Short, busy feeds', 'distract'], v <= 3 && ['moon', 'Eating more at night', v === 0 ? 'Days and nights mixed up' : 'Less in the day, more at night', 'nights'], nurse && v >= 1 && ['heart', 'Suddenly refusing the breast', 'A nursing strike, and what helps', 'nstrike'], nurse && v >= 3 && ['hand', 'Biting while nursing', 'Once teeth come', 'biting']]],
      ['Tummy', [v <= 3 && ['bottle', 'Spit-up or vomit?', 'How much is normal, and when to call', 'spit'], v <= 2 && ['drop', 'Gas and lots of crying', 'What helps, and gripe water', 'gas'], v <= 2 ? ['diaper', 'Poop and straining', 'What’s normal on milk', 'poop'] : ['diaper', 'Constipation', 'Harder poop with solids', 'constipation'], v <= 2 && ['heart', 'Hiccups', 'Normal, and what helps', 'hiccups']]],
      ['Bottles', [nurse && ['bottle', 'Won’t take a bottle', 'Common for babies who nurse', 'refusebottle'], nurse && bot && ['heart', 'Fussy at the breast after bottles', 'When bottles flow faster', 'prefbottle'], fm && ['bottle', 'Is it the formula?', 'Before you switch', 'isformula']]],
      v >= 2 && ['Solids', [v >= 3 && ['shield', 'Gagging or choking?', 'How to tell, and what to do', 'gag'], v >= 3 && ['bowl', 'Refusing food', 'Light days, and what helps', 'refusefood'], v >= 3 && ['heart', 'Picky days', 'New foods can take 10–15 tries', 'picky'], v >= 3 && ['eye', 'A rash after a new food', 'When it’s an allergy', 'rash']]],
      ['When he’s unwell', [['eye', 'Feeding when he’s sick', 'A stuffy nose, or not interested', 'sick'], v >= 2 && ['tooth', 'Teething and feeds', 'Sore gums, shorter feeds', 'teethfeed']]],
      br && ['Your body', [['heart', 'A tender lump in your breast', 'A clogged duct, and what helps', 'lump']]]
    ].filter(Boolean).map(([t, xs]) => [t, xs.filter(Boolean).filter(x => P[x[3]])]).filter(g => g[1].length); };
  const hardIds = () => HARD().flatMap(g => g[1].map(x => x[3]));
  P.hard = () => { const v = stg(), now = commonIds(v);
    const pick = ([i, t, s, to]) => `<button class="care-pick" onclick="${go(to)}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`;
    const groups = HARD(), all = groups.flatMap(g => g[1]), first = now.map(id => all.find(x => x[3] === id)).filter(Boolean);
    const card = xs => `<div class="hub-card care-folds care-lookoff">${xs.map(pick).join('')}</div>`;
    return page(head('Feeding', 'When feeding is hard', 'Lots of families hit at least one of these. Pick what you’re seeing.')
      + (first.length ? h2('Most common now') + card(first) : '')
      + groups.map(([t, xs]) => { const rest = xs.filter(x => !now.includes(x[3])); return rest.length ? h2(t) + card(rest) : ''; }).join('')
      + `<div class="hub-list" style="margin-top:12px"><button class="hub-row hl-row" style="--hl-bg:${C.lilac[0]};--hl-ink:${C.lilac[1]}" onclick="${go('help')}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt('hand', CAT)}</span><span class="hub-row-copy"><small>${F('Support')}</small><b>${F('You don’t have to figure this out alone')}</b><small>${F('Who can help, and how you’re doing')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>`); };
  P.worry = () => P.hard();
  // How-tos as tiles on the stage page, most useful first for this family and age
  const HOWTOS = (v) => { const nurse = nurses(), fm = formulaFam(), bot = isBottle(), pump = pumps(), br = isBreast();
    const T = { latch: ['heart', 'Latch and holds'], burp: ['hand', 'Burping'], bottle: ['bottle', 'Giving a bottle'], formula: ['bowl', 'Making formula'], basics: ['snow', 'Storing milk'], pump: ['drop', 'Pumping'], work: ['clock', 'Back to work'], prep: ['bowl', 'Preparing first foods'], choking: ['shield', 'Choking first aid'] };
    const order = v <= 1 ? [nurse && 'latch', 'burp', bot && 'bottle', fm && 'formula', pump && 'pump', (bot || pump) && 'basics', br && v === 1 && 'work'] : v === 2 ? ['prep', 'choking', nurse && 'latch', bot && 'bottle', fm && 'formula', br && 'work'] : ['prep', 'choking', bot && 'bottle', fm && 'formula', nurse && 'latch'];
    return order.filter(Boolean).filter(k => P[k]).slice(0, 4).map(k => [...T[k], k]); };
  // The basics card: the hands-on things a parent needs first, as three tiles. Changes with the stage.
  const BASICS = (v) => { const nurse = nurses();
    return [
      ['How to feed', [nurse ? ['heart', 'Positions', 'Latch and holds', 'latch'] : ['bottle', 'Positions', 'Holding a bottle', 'bottle'], ['hand', 'Burping', 'Three ways', 'burp'], ['eye', 'What’s normal', 'Spit-up, hiccups, grunts', 'normal']]],
      ['How to feed', [nurse ? ['heart', 'Positions', 'Latch and holds', 'latch'] : ['bottle', 'Positions', 'Pacing a bottle', 'bottle'], ['hand', 'Burping', 'Three ways', 'burp'], ['eye', 'What’s normal', 'Spit-up, fussy evenings', 'normal']]],
      ['Getting ready for solids', [['bowl', 'Ready yet?', 'The four signs', 'signs'], ['shield', 'Choking first aid', 'Learn it before solids', 'choking'], ['eye', 'What’s normal', 'Short feeds, drool', 'normal']]],
      ['First foods', [['bowl', 'What to serve', 'Shapes and textures', 'prep'], ['shield', 'Gagging or choking?', 'How to tell', 'gag'], ['eye', 'What’s normal', 'Mess, faces, gagging', 'normal']]],
      ['Family meals', [['bowl', 'Family food', 'Soft pieces', 'family'], ['drop', 'Cups', 'Practice now', 'cups'], ['eye', 'What’s normal', 'Picky days, mess', 'normal']]]
    ][v]; };
  P.feedbasics = () => { const nurse = nurses(), bot = isBottle();
    return page(head('The basics', 'How to feed, step by step', 'How to hold him, how to burp, and what’s normal to see.')
      + h2('Positions') + (nurse ? steps([['hand', 'Cross-cradle', 'Your hand supports his head. Good for learning to latch'], ['heart', 'Football', 'Tucked at your side. Easy after a C-section'], ['moon', 'Laid-back', 'Leaning back, him tummy-down on you']], false) + small('A good latch', 'feels like a strong tug, not a pinch. Wait for a wide mouth, then bring him to you, chin first.') : '')
      + (bot && nurse ? small('With a bottle,', 'hold him fairly upright, keep the bottle level, and pause every few sucks.') : bot ? steps([['heart', 'Cradled, sitting up', 'Head higher than his tummy'], ['smile', 'Upright on your lap', 'Facing sideways, head supported'], ['bottle', 'Paced', 'Bottle fairly level, little pauses']], false) : '')
      + h2('Burping') + steps([['heart', 'Over your shoulder', 'A cloth underneath'], ['smile', 'Sitting on your lap', 'Lean him forward, support his chin'], ['moon', 'Across your knees', 'Tummy down, a gentle back rub']], false)
      + p(bot && nurse ? 'Burp every 2–3 oz from a bottle, between sides at the breast, and at the end.' : bot ? 'Burp every 2–3 oz, and at the end of the feed.' : 'Burp between sides, and at the end of the feed.')
      + h2('What’s normal') + steps(NORMAL_ITEMS(stg()), false)); };
  // What's normal: the things parents see and worry about, at a glance. Recognize, not troubleshoot.
  const NORMAL_ITEMS = (v) => { const br = isBreast();
    return [
      [['bottle', 'Spit-up', 'A little after feeds, often less than it looks'], ['heart', 'Hiccups', 'Common, and they rarely bother him'], ['diaper', 'Grunting and straining', 'He’s learning to poop'], ['moon', 'Nonstop evenings', 'Lots of feeds close together'], ['clock', 'Dozing off mid-feed', 'Common in the first weeks'], ['eye', 'Sneezing', 'It clears his nose. Not a cold']],
      [['bottle', 'More spit-up', 'It peaks around 4 months'], ['moon', 'Fussy evenings', 'Often worst around 6 weeks'], ['clock', 'Quicker feeds', 'He’s getting better at it'], br ? ['heart', 'Softer breasts', 'Your supply is settling, not dropping'] : ['bottle', 'Bigger bottles', 'Then about the same until solids'], br && fd() === 'Breast milk' ? ['diaper', 'Fewer poops', 'Some go days without one'] : ['diaper', 'Poop changes', 'Soft is what matters'], ['heart', 'Hiccups', 'Still common, still harmless']],
      [['eye', 'Short, distracted feeds', 'The world is more interesting'], ['drop', 'Lots of drool', 'Not always teething'], ['moon', 'Longer night stretches', 'For some babies, not all'], ['bottle', 'Spit-up', 'Still common, and easing'], ['hand', 'Grabbing at your food', 'Curiosity, not a sign on its own'], ['clock', 'Hungrier some days', 'Growth spurts come and go']],
      [['bowl', 'Most food ends up elsewhere', 'Squishing and dropping is learning'], ['shield', 'Gagging', 'Loud and normal. Choking is silent'], ['smile', 'Funny faces', 'New tastes, not dislike'], ['diaper', 'Poop changes', 'Color and smell follow what he eats'], ['heart', 'Eating very little', 'Milk is still the main food'], ['clock', 'Some days more, some less', 'His appetite leads']],
      [['heart', 'Picky days', 'New foods can take 10–15 tries'], ['bowl', 'Throwing food', 'Testing what happens'], ['hand', 'Wanting to feed himself', 'Let him, even if it’s messy'], ['clock', 'Appetite swings', 'Big one day, small the next'], ['drop', 'Fewer milk feeds', 'As meals grow'], ['smile', 'Copying you', 'He learns by watching you eat']]
    ][v]; };
  P.normal = () => { const v = stg(), N = NORMAL_ITEMS(v);
    return page(head('The basics', 'What’s normal', ['In the first weeks, lots of things look worrying and are completely normal.', 'Common at this age, and nothing to worry about.', 'Common at this age, and nothing to worry about.', 'Common as solids start, and nothing to worry about.', 'Common at this age, and nothing to worry about.'][v])
      + steps(N, false)
      + p('Seeing something different, or worried? When feeding is hard, on the Feeding page, covers what to do.')); };
  // Feeding works like Sleep: four areas that stay the same at every stage (Feeds, Your milk or Bottles, Tummy, Every day / Food).
  // Only each area's headline changes with the stage, and when a challenge is the main thing at that age, it becomes the headline.
  // Each area opens one short page: what's happening, what to do, how you'll know.
  const todo = lines => h2('What to do') + `<div class="hub-card" style="padding:4px 16px">${lines.filter(Boolean).map(l => `<p class="care-p" style="margin:12px 0">${F(l)}</p>`).join('<hr style="border:0;border-top:1px solid var(--line);margin:0">')}</div>`;
  const know2 = t => h2('How you’ll know') + p(t);
  const milkLabel = () => { const b = isBreast(), fm = formulaFam(); return b && fm && nurses() ? 'Your milk and formula' : b ? 'Your milk' : 'Bottles'; };
  const AREAS = (v) => { const nurse = nurses(), b = isBreast(), fm = formulaFam(), pumpOnly = onlyPump(), mostlyB = fd() === 'Breast milk', early = isEarly(), bot = isBottle();
    const r = (c, icon, label, act, sub, to) => ({ c, icon, label, act, sub, to });
    const feeds = [
      r('peach', 'hand', 'Feeds', 'Feed often, day and night', 'Positions, burping and hunger cues', 'feeds'),
      r('peach', 'clock', 'Feeds', 'Feeds get quicker and further apart', 'Snacking and growth spurts are common', 'feeds'),
      r('peach', 'eye', 'Feeds', 'Expect short, distracted feeds', 'A quiet spot helps', 'feeds'),
      r('peach', 'clock', 'Feeds', 'Fit milk feeds around meals', 'Milk is still the main food', 'feeds'),
      r('peach', 'clock', 'Feeds', 'Milk drops as meals grow', '3–4 milk feeds, around meals and bed', 'feeds')][v];
    const milk = [
      b ? r('pink', 'heart', milkLabel(), nurse ? 'Get help early if nursing hurts' : 'Pump 8–12 times a day', nurse && fm ? 'Your milk comes in, and topping up with formula' : 'Your milk comes in around days 2–5', 'milkarea') : r('pink', 'bottle', 'Bottles', 'Make each bottle safely', 'Water first, then level scoops', 'formula'),
      b ? r('pink', 'heart', milkLabel(), 'Trust your supply as it settles', 'And planning for going back to work', 'supply') : r('pink', 'bottle', 'Bottles', 'Pace each bottle', 'So he takes what he needs', 'bottle'),
      b ? r('pink', 'heart', milkLabel(), mostlyB ? 'Keep to breast milk until about 6 months' : 'Keep any breast milk going', 'And how to stop gently, if you choose to', 'howlong') : r('pink', 'bottle', 'Bottles', 'Keep bottles the main food', 'Even once solids start', 'bottlegrow'),
      r('pink', 'drop', 'Cups', 'Start practicing with a cup', 'Water from an open or straw cup', 'cups'),
      r('pink', nurse && !fm ? 'heart' : 'bottle', 'At 12 months', 'Plan for the first birthday', nurse && !fm ? 'Cow’s milk joins meals, and nursing can go on' : 'Whole milk from a cup, and bottles phase out', 'at12')][v];
    const tummy = [
      r('blue', 'drop', 'Tummy', 'Expect spit-up, gas and grunts', 'What’s normal, and what helps', 'tummy'),
      r('blue', 'drop', 'Tummy', 'Gas and spit-up peak now', 'They usually ease by 3–4 months', 'tummy'),
      r('blue', 'drop', 'Tummy', 'Spit-up starts to ease', 'And poop can change', 'tummy'),
      r('blue', 'drop', 'Tummy', 'Poop changes with solids', 'Harder poop is common, and easy to help', 'tummy'),
      r('blue', 'drop', 'Tummy', 'Keep poop soft', 'Water with meals, fruit and vegetables', 'tummy')][v];
    const fourth = [
      r('lilac', 'drop', 'Every day', b ? 'Give vitamin D drops daily' : 'Give vitamin D drops for now', b ? 'From the first days' : 'Until he drinks about 32 oz a day', 'vitd'),
      r('lilac', 'drop', 'Every day', early && b ? 'Add iron drops' : 'Keep up vitamin D drops', early && b ? 'From about 1 month, for babies born early' : b ? 'While he gets breast milk' : 'Stop once he drinks about 32 oz a day', 'vitd'),
      r('green', 'bowl', 'Food', 'Watch for signs he’s ready', 'Most babies start around 6 months', 'signs'),
      r('green', 'bowl', 'Food', 'Start with a few bites a day', 'Iron-rich first. Allergens early and often', 'firstfoods'),
      r('green', 'bowl', 'Food', 'Serve three meals of family food', 'Soft pieces, no added salt', 'family')][v];
    // Locked structure (Nov 5): Feeding rhythms, Breastfeeding & pumping, Bottle feeding, and a fourth slot that changes name by stage.
    const rhythm = { ...feeds, label: 'Feeding rhythms' };
    const bf = b ? [
      r('pink', 'heart', 'Breastfeeding & pumping', nurse ? 'Get help early if nursing hurts' : 'Pump 8–12 times a day', nurse && fm ? 'Your milk comes in, and topping up with formula' : 'Your milk comes in around days 2–5', 'milkarea'),
      r('pink', 'heart', 'Breastfeeding & pumping', 'Trust your supply as it settles', 'Softer breasts don’t mean less milk', 'bf1'),
      r('pink', 'heart', 'Breastfeeding & pumping', mostlyB ? 'Keep to breast milk until about 6 months' : 'Keep any breast milk going', 'And how to stop gently, if you choose to', 'howlong'),
      r('pink', 'heart', 'Breastfeeding & pumping', 'Keep milk going around meals', 'Milk is still the main food', 'howlong'),
      r('pink', 'heart', 'Breastfeeding & pumping', 'Plan for the first birthday', 'Nursing can go on as long as you both want', 'at12')][v] : null;
    const bo = bot ? [
      fm ? r('lilac', 'bottle', 'Bottle feeding', 'Make each bottle safely', 'Water first, then level scoops', 'formula') : r('lilac', 'bottle', 'Bottle feeding', 'Pace each bottle', 'And store milk safely', 'bottle'),
      r('lilac', 'bottle', 'Bottle feeding', 'Pace each bottle', 'And check the nipple flow', 'bottle'),
      fm ? r('lilac', 'bottle', 'Bottle feeding', 'Keep bottles the main food', 'Even once solids start', 'bottlegrow') : r('lilac', 'bottle', 'Bottle feeding', 'Store and warm milk safely', 'At home, at daycare, on the go', 'basics'),
      r('lilac', 'drop', 'Bottle feeding', 'Start practicing with a cup', 'Water from an open or straw cup', 'cups'),
      r('lilac', 'bottle', 'Bottle feeding', 'Phase out bottles after 1', 'Milk from a cup, with meals', 'at12')][v] : null;
    const four = [
      r('blue', 'drop', 'Everyday essentials', 'Vitamin D, burping and spit-up', 'And what normal poop looks like', 'tummy'),
      r('blue', 'drop', 'Everyday essentials', early && b ? 'Add iron drops' : 'Gas and spit-up peak now', early && b ? 'And keep up vitamin D' : 'Vitamin D, and how poop changes', early && b ? 'vitd' : 'tummy'),
      r('green', 'bowl', 'Preparing for solids', 'Watch for signs he’s ready', 'And learn choking first aid', 'signs'),
      r('green', 'bowl', 'Starting solids', 'Start with a few bites a day', 'Iron-rich first. Allergens early and often', 'firstfoods'),
      r('green', 'bowl', 'Meals & self-feeding', 'Serve three meals of family food', 'Finger foods, cups and milk at 12 months', 'family')][v];
    void milk; void tummy; void fourth;
    if (v === 1) return [
        r('peach', 'clock', '', 'Feeds & rhythm', 'A day now, growth spurts, and what changes', 'rhythm1'),
        b && r('pink', 'heart', '', 'Breastfeeding & pumping', (nurse && fm ? 'Your supply, topping up' : pumps() ? 'Your supply, pumping' : 'Your supply') + ' and going back to work', 'bfmilk1'),
        bot && r('lilac', 'bottle', '', 'Bottle feeding', 'How much, flow and pacing, and bottle trouble', 'bot1'),
        r('blue', 'drop', '', 'Digestion & comfort', 'Gas, fussy evenings, spit-up and poop', 'dig1')].filter(Boolean);
    if (v === 0) return [
        r('peach', 'clock', '', 'Hunger & feeding times', 'A day of feeds, hunger cues, getting enough, evenings and nights', 'basics0'),
        b && r('pink', 'heart', '', 'Breastfeeding & pumping', nurse ? 'Your milk day by day, latching and pumping' : 'Your milk day by day, and pumping', 'bf0'),
        r('lilac', 'bottle', '', 'Bottle feeding', 'Getting ready, feeding, storing milk and cleaning', 'bot0'),
        r('blue', 'drop', '', 'Digestion & comfort', 'Burping, spit-up, gas, crying and poop', 'dig0')].filter(Boolean);
    if (v === -1) return [
        r('peach', 'clock', 'Finding your rhythm', 'Feed often, and follow his cues', 'Hunger cues, cluster feeding, waking to feed', 'feeds'),
        nurse && r('pink', 'heart', 'Nursing', 'Get nursing off to a good start', 'Latch, holds, and your milk coming in', 'nurse0'),
        b && !nurse && r('pink', 'drop', 'Pumping', 'Get pumping going', 'How often, flange fit, storing milk', 'pump0'),
        bot && r('lilac', 'bottle', nurse && fm ? 'Formula top-ups' : 'Bottles', nurse && fm ? 'Small bottles after nursing' : fm ? 'Make and give bottles safely' : 'Give your milk by bottle', fm ? 'Making, holding and pacing a bottle' : 'Holding, pacing and nipple flow', 'bottle0'),
        r('blue', 'drop', 'After a feed', 'Burping, spit-up and poop', 'What’s normal, and what helps', 'after')].filter(Boolean);
    if (v <= 1) { const fam = nurse && fm ? 'combo' : nurse ? 'nurse' : b ? 'pump' : 'bottle';
      return [
        r('peach', 'clock', 'Finding your rhythm', v === 0 ? 'Feed often, and follow his cues' : 'Feeds get quicker and more predictable', v === 0 ? 'Hunger cues, cluster feeding, waking to feed' : 'Growth spurts, snacking and night feeds', 'feeds'),
        r('pink', fam === 'bottle' ? 'bottle' : 'heart', 'Making feeding work', v === 0 ? { combo: 'Nursing, plus formula top-ups', nurse: 'Get nursing off to a good start', pump: 'Get pumping going', bottle: 'Make and give bottles safely' }[fam] : { combo: 'Keep your milk going as you top up', nurse: 'Trust your supply as it settles', pump: 'Adjust pumping as feeds settle', bottle: 'Check the flow, and keep pacing' }[fam], v === 0 ? { combo: 'Latch, your milk coming in, top-ups', nurse: 'Latch, holds and your milk coming in', pump: 'How often, flange fit, storing milk', bottle: 'Making formula, pacing, storing' }[fam] : { combo: 'Supply, top-ups and bottles', nurse: 'Supply, pumping and a first bottle', pump: 'Supply, storing and going back to work', bottle: 'Nipple flow, amounts and storage' }[fam], 'mfw'),
        r('blue', 'drop', 'After a feed', v === 0 ? 'Burping, spit-up and poop' : 'Gas and spit-up may peak now', v === 0 ? 'What’s normal, and what helps' : 'What helps, and how poop can change', 'after')]; }
    if (bf) bf.to = 'bfhome';
    if (v <= 1) four.to = 'esshome';
    if (v === 0 && four) four.sub = 'Burping, spit-up, poop and vitamin D';
    return [rhythm, bf, bo, four].filter(x => x && (P[x.to] || ['bf1', 'bfhome', 'esshome', 'mfw', 'after'].includes(x.to))); };

  // Area pages in Sleep's look: a colored header, one picture, a "What to do" card that stands out (2–3 short lines), one "How you'll know" line.
  const doCard = (c, lines) => `<section class="ss-moment"><section class="ss-do" style="--ss-bg:${c[0]};--ss-ink:${c[1]}"><b>${F('What to do')}</b><ul class="ss-do-list">${lines.filter(Boolean).map(l => `<li>${F(l)}</li>`).join('')}</ul></section></section>`;
  const knowLine = t => `<p class="ss-know"><b>${F('How you’ll know')}</b>${F(t)}</p>`;
  const sstrip = (title, items) => hubStageStrip({ title, items });
  // Feeds: how feeds go at each stage
  P.feeds = () => { const v = stg(), nurse = nurses(), bot = isBottle(), c = C.peach;
    if (v === 0) return page(head('Finding your rhythm', 'Feed often, day and night', nurse ? '8–12 feeds a day is normal now. Feeding often is how he grows, and how your milk gets going.' : '6–10 bottles a day is normal now. Small, frequent feeds are how newborns eat.', c)
      + steps([['eye', 'Watch for early cues', 'Rooting, hands to mouth'], nurse ? ['heart', 'Feed in a comfy hold', 'Cross-cradle or football to start'] : ['bottle', 'Hold him upright', 'And pace the bottle'], ['hand', 'Burp', bot && nurse ? 'Every 2–3 oz, or between sides' : bot ? 'Every 2–3 oz' : 'Between sides, and at the end']], true)
      + doCard(c, ['Feed when he shows early cues. Crying is a late one, so calm him first.', 'Expect some evenings of nonstop feeds. That’s cluster feeding, and it passes.', 'Until he’s back to birth weight, wake him if it’s been about 3 hours.'])
      + knowLine('6 or more wet diapers a day by day 6, and back to birth weight by about 2 weeks.'));
    if (v === 1) return page(head('Finding your rhythm', 'Feeds get quicker and further apart', 'He’s better at eating now, so feeds take less time.', c)
      + sstrip('Feeds a day, as he grows', nurse ? [['drop', 'Newborn', '8–12'], ['drop', 'Now', '7–9'], ['drop', 'By 4 months', 'Often 6–8']] : [['bottle', 'Newborn', '6–10 bottles'], ['bottle', 'Now', '6–8, 4–5 oz'], ['bottle', 'By 4 months', '4–6, 4–6 oz']])
      + doCard(c, ['Go by his cues, not the clock.', 'Hungrier for a few days? That’s a growth spurt. Feed more often, and it passes in 2–3 days.', 'Small feeds every hour? That’s snacking. If it’s wearing you out, soothe him first and feed when cues come back.'])
      + knowLine('6 or more wet diapers a day, and steady growth at checkups.'));
    if (v === 2) return page(head('Finding your rhythm', 'Expect short, distracted feeds', 'The world is more interesting now, so feeds get short and busy. A quick feed can still be a full one.', c)
      + steps([['moon', 'A quiet, dim spot', 'Fewer things to look at'], ['clock', 'When he’s drowsy', 'Before naps and bed'], ['eye', 'More often by day', 'If he eats more at night']], false)
      + doCard(c, ['Feed somewhere calm, away from screens and siblings.', 'Offer a feed before naps and at bedtime, when he’s sleepy.'])
      + knowLine('6 or more wet diapers a day, and steady growth at checkups.'));
    if (v === 3) return page(head('Finding your rhythm', 'Fit milk feeds around meals', 'Until 12 months, milk is still his main food. Solids are for learning.', c)
      + sstrip('A day of milk and meals', [['drop', 'Morning', 'Milk'], ['bowl', 'Breakfast', 'A few bites'], ['bowl', 'Dinner', 'A few bites'], ['moon', 'Bedtime', 'Milk']])
      + doCard(c, ['Offer milk before or after meals. Both work.', nurse ? 'Nurse when he asks. Feeds often drop a little as meals grow.' : 'Bottles are often 6–8 oz, 4–5 a day, up to about 32 oz.'])
      + knowLine('6 or more wet diapers a day, steady growth, and a busy, content baby.'));
    return page(head('Finding your rhythm', 'Milk drops as meals grow', 'Most babies take 3–4 milk feeds a day now, often around meals and at bedtime.', c)
      + sstrip('Milk feeds a day', [['drop', '6–9 months', '4–5'], ['drop', 'Now', '3–4'], ['bowl', 'After 1', 'Milk with meals']])
      + doCard(c, ['Offer milk after meals, so he comes to the table hungry.', 'Keep a bedtime milk feed if it works for you.', 'Practice with a cup now, so the switch at 1 is easier.'])
      + knowLine('He eats three small meals, still drinks milk, and has 6 or more wet diapers a day.')); };

  P.supply = () => { const nurse = nurses(), fm = formulaFam(), pumpOnly = onlyPump(), c = C.pink;
    return page(head(milkLabel(), 'Trust your supply as it settles', pumpOnly ? 'Around 6–12 weeks, what you pump usually levels off. That’s your body matching what he needs.' : 'Around 6–12 weeks, your body learns how much he needs and makes about that much.', c)
      + steps([['heart', 'Softer breasts', 'Less full between feeds'], ['drop', 'Less leaking', 'Day and night'], ['clock', pumpOnly ? 'Steadier output' : 'Quicker feeds', pumpOnly ? 'Session to session' : 'He’s more efficient now']], false)
      + doCard(c, [pumpOnly ? 'Worried it’s too little? Pump more often, including once at night, and check the flange fit.' : 'Worried it’s too little? Feed more often, offer both sides, and try skin to skin.', nurse ? 'Gulping or pulling off at the start? Lean back so he feeds against gravity.' : 'Making more than he drinks? Freeze the extra, and drop sessions slowly.', nurse && fm ? 'Bottle instead of a nursing? Pump around then, so that milk keeps coming.' : ''])
      + knowLine('Wet diapers and steady growth, even when your breasts feel softer.')
      + `<p class="ss-know"><b>${F('Going back to work?')}</b>${F('Start pumping once a day 3–4 weeks before, and have someone else give a bottle 2 weeks before. Most US employers must give you break time and a private space to pump. The full plan is in How-tos.')}</p>`
      + `<div class="hub-tip fd-call"><b>${F('Call your doctor or a lactation consultant')}</b>${F('A red, painful area on your breast with a fever, or slow weight gain at a checkup.')}</div>`); };
  // Your milk, the newborn weeks
  P.milkarea = () => { const nurse = nurses(), fm = formulaFam(), c = C.pink;
    return page(head(milkLabel(), nurse ? 'Get help early if nursing hurts' : 'Pump 8–12 times a day', nurse ? 'Some tenderness at first is common. Pain through the whole feed isn’t something to push through.' : 'Pumping often, including once at night, tells your body how much to make.', c)
      + sstrip('Your milk, the first weeks', [['drop', 'Days 1–2', 'Small amounts of colostrum'], ['heart', 'Days 2–5', 'Milk comes in. Full, tender'], ['clock', '6–12 weeks', 'Supply settles']])
      + doCard(c, [nurse ? 'Pinching? Break the seal with a clean finger and try again. Cross-cradle often helps.' : 'Check the flange: your nipple should move freely without rubbing.', 'Very full or sore? ' + (nurse ? 'Hand-express' : 'Pump') + ' a little, then a cold pack. A little breast milk soothes sore nipples.', nurse && fm ? 'Nurse first, then offer formula if he’s still hungry.' : '', 'Get help early. A lactation consultant can fix most problems in a visit or two, and most insurance covers it.'])
      + knowLine(nurse ? 'Feeds stop hurting, your breasts feel softer after feeds, and he has 6 or more wet diapers a day by day 6.' : 'What you pump grows day by day, and he has 6 or more wet diapers a day by day 6.')
      + `<div class="hub-tip fd-call"><b>${F('Call your doctor or a lactation consultant')}</b>${F('Cracked or bleeding nipples, pain that isn’t easing even with help, or a red, painful area with a fever. Ongoing pain can mean tongue-tie, so ask about it.')}</div>`); };

  // Tummy: spit-up, gas and poop, by stage
  P.tummy = () => { const v = stg(), br = fd() === 'Breast milk', both = isBreast() && formulaFam(), c = C.blue;
    const poopNow = br ? 'yellow and seedy' : both ? 'soft and yellow to tan' : 'tan to yellow, like peanut butter';
    const urgent = t => `<p class="care-urgent"><b>${F('Call right away:')}</b> ${F(t)}</p>`;
    if (v === 0) return page(head('Tummy', 'Expect spit-up, gas and grunts', 'Newborn tummies are noisy. Most of it is normal and eases by 3–4 months.', c)
      + two(['Spit-up', 'Flows out gently, and is usually less than it looks.'], ['Vomit', 'Comes out with force, sometimes across the room.', '#fdeee6', '#9a5a3c'])
      + doCard(c, ['Hold him upright for 20–30 minutes after feeds.', 'Burp mid-feed and at the end.', 'For gas, bicycle his legs or lay him tummy-down across your knees.'])
      + knowLine('He’s growing well and has plenty of wet diapers. Then spit-up is normal, even when it looks like a lot.')
      + small('Poop:', 'grunting and going red is normal. By about day 5, it turns ' + poopNow + '.') + small('Hiccups', 'are common and rarely bother him. They stop on their own.')
      + call('Forceful vomiting, or hard, pebble-like poop.') + urgent('green or bloody vomit, vomiting with a fever, or white or very pale poop.'));
    if (v === 1) return page(head('Tummy', 'Gas and spit-up peak now', 'Both are common at this age, and both ease.', c)
      + sstrip('When it eases', [['moon', 'Fussy evenings', 'Peak around 6 weeks'], ['bottle', 'Spit-up', 'Peaks around 4 months'], ['smile', 'Both', 'Usually ease by 3–4 months']])
      + doCard(c, ['Burp more often, and keep him upright after feeds.', 'For gas, bicycle his legs or try tummy-down across your knees.', br ? 'Some breastfed babies go a few days without a poop now. Soft is what matters.' : 'Poop often comes once or twice a day. Soft is what matters.'])
      + knowLine('He’s growing well and is mostly content between fussy spells.')
      + small('Gas drops or gripe water?', 'gas drops are safe but often don’t help much. Ask your pediatrician before trying gripe water.')
      + call('Forceful vomiting, crying that won’t settle, blood in his poop, or slow weight gain.'));
    if (v === 2) return page(head('Tummy', 'Spit-up starts to ease', 'For most babies, spit-up peaks around 4 months, then slowly eases.', c)
      + steps([['bottle', 'Less spit-up', 'Week by week'], ['drop', 'Lots of drool', 'Not always teething'], ['diaper', 'Poop changes', 'Once solids start']], false)
      + doCard(c, ['Keep him upright after feeds, and burp mid-feed.', 'Keep a bib on, and wipe his chin to protect his skin from drool.'])
      + knowLine('He’s growing well and isn’t bothered by the spit-up.')
      + call('Forceful vomiting, spit-up that starts after 6 months, or slow weight gain.'));
    if (v === 3) return page(head('Tummy', 'Poop changes with solids', 'Color and smell follow what he eats, and harder poop is common at first.', c)
      + steps([['bowl', 'Pears and prunes', 'Mashed or puréed'], ['bowl', 'Peas and oatmeal', 'Soft and easy'], ['drop', 'Water', 'Sips from a cup with meals']], false)
      + doCard(c, ['Offer these foods and water when poop gets harder.', 'Bicycle his legs gently if he’s straining.'])
      + knowLine('Poop is soft and comes regularly, even if less often than before.')
      + call('Blood in his poop, pain, vomiting, or no poop for 2 days after trying these.'));
    return page(head('Tummy', 'Keep poop soft', 'As he eats more family food, water and fiber keep things moving.', c)
      + steps([['drop', 'Water with meals', 'Up to 8 oz a day'], ['bowl', 'Fruit and vegetables', 'At most meals'], ['bowl', 'Whole grains', 'Oatmeal, bread, pasta']], false)
      + doCard(c, ['Offer water from a cup with every meal.', 'At 12 months, go easy on milk. Too much can make poop harder.'])
      + knowLine('Soft poop that comes regularly.')
      + call('Blood in his poop, pain, vomiting, or no poop for 2 days after trying these.')); };

  // Tough feed?: only acute, right-now situations, like Sleep's Rough night
  P.hard = () => { const v = stg(), nurse = nurses(), fm = formulaFam(), br = isBreast();
    const pick = ([i, t, s, to]) => `<button class="care-pick" onclick="${go(to)}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`;
    const L = [
      [['moon', 'Too sleepy to feed', 'How to wake him, and when to call', 'sleepy'], ['heart', 'Crying or arching at feeds', 'Too hungry, too fast, or full', 'fussy'], ['diaper', 'Not eating much', 'What to try, and how to tell it’s okay', 'small'], ['eye', 'Sick, or a stuffy nose', 'Feeding when he’s unwell', 'sick'], fm && ['bottle', 'Is it the formula?', 'Before you switch', 'isformula']],
      [['heart', 'Crying or arching at feeds', 'Too hungry, too fast, or full', 'fussy'], ['diaper', 'Not eating much', 'What to try, and how to tell it’s okay', 'small'], nurse && isBottle() && ['heart', 'Fussy at the breast after bottles', 'When bottles flow faster', 'prefbottle'], nurse && ['bottle', 'Won’t take a bottle', 'Common for babies who nurse', 'refusebottle'], ['eye', 'Sick, or a stuffy nose', 'Feeding when he’s unwell', 'sick'], fm && ['bottle', 'Is it the formula?', 'Before you switch', 'isformula']],
      [nurse && ['heart', 'Suddenly refusing the breast', 'A nursing strike, and what helps', 'nstrike'], nurse && isBottle() && ['heart', 'Fussy at the breast after bottles', 'When bottles flow faster', 'prefbottle'], ['diaper', 'Not eating much', 'What to try, and how to tell it’s okay', 'small'], nurse && ['bottle', 'Won’t take a bottle', 'Common for babies who nurse', 'refusebottle'], ['eye', 'Sick, or a stuffy nose', 'Feeding when he’s unwell', 'sick']],
      [['shield', 'Gagging or choking?', 'How to tell, and what to do', 'gag'], ['bowl', 'Refusing food', 'Light days, and what helps', 'refusefood'], ['eye', 'A rash after a new food', 'When it’s an allergy', 'rash'], ['tooth', 'Teething and feeds', 'Sore gums, shorter feeds', 'teethfeed'], ['eye', 'Sick, or a stuffy nose', 'Feeding when he’s unwell', 'sick']],
      [['shield', 'Gagging or choking?', 'How to tell, and what to do', 'gag'], ['heart', 'Picky days', 'New foods can take 10–15 tries', 'picky'], ['bowl', 'Refusing food', 'Light days, and what helps', 'refusefood'], ['eye', 'A rash after a new food', 'When it’s an allergy', 'rash'], nurse && ['hand', 'Biting while nursing', 'Once teeth come', 'biting'], ['eye', 'Sick, or a stuffy nose', 'Feeding when he’s unwell', 'sick']]
    ][v].filter(Boolean).filter(x => P[x[3]]);
    return page(head('Feeding', 'Tough feed?', 'Pick what’s happening. You’ll see what’s often behind it and what to try.')
      + `<div class="hub-card care-folds care-lookoff">${L.map(pick).join('')}</div>`
      + (br ? h2('For you') + `<div class="hub-card care-folds care-lookoff">${pick(['heart', 'A tender lump in your breast', 'A clogged duct, and what helps', 'lump'])}</div>` : '')
      + `<div class="hub-list" style="margin-top:12px"><button class="hub-row hl-row" style="--hl-bg:${C.lilac[0]};--hl-ink:${C.lilac[1]}" onclick="${go('help')}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt('hand', CAT)}</span><span class="hub-row-copy"><small>${F('Support')}</small><b>${F('You don’t have to figure this out alone')}</b><small>${F('Who can help, and how you’re doing')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button></div>`); };
  P.worry = () => P.hard();
  const AREA_IDS = ['feeds', 'milkarea', 'tummy'];
  const NORMALCALL = (v) => [
    [['Normal', '8–12 feeds a day, nonstop evenings, spit-up, and losing a little weight in the first days.'], ['Call your pediatrician', 'Fewer wet diapers than expected, not back to birth weight by 2 weeks, or too sleepy to wake for feeds. A temperature of 100.4°F or higher: call right away.']],
    [['Normal', 'Quicker feeds, fussy evenings, more spit-up, and a few hungrier days.'], ['Call your pediatrician', 'Fewer than 6 wet diapers a day, forceful vomiting, or refusing several feeds in a row. Under 3 months, a temperature of 100.4°F or higher: call right away.']],
    [['Normal', 'Short, distracted feeds, drool, and a hungrier night now and then.'], ['Call your pediatrician', 'Fewer than 6 wet diapers a day, refusing feeds, or slow weight gain at a checkup.']],
    [['Normal', 'Gagging, most food on the floor, funny faces at new tastes, and poop that changes.'], ['Call your pediatrician', 'Hives after a new food, or refusing both milk and food. Trouble breathing or a swollen face: call 911.']],
    [['Normal', 'Picky days, throwing food, and an appetite that swings from day to day.'], ['Call your pediatrician', 'Refusing most food and milk for a few days, fewer wet diapers, or weight loss.']]
  ][v];
  P.small = () => { const nb = stg() === 0, nurse = nurses();
    const tries = [['eye', 'Feed at early cues', 'Rooting or hands to mouth, before crying'], nb ? ['moon', 'Wake him for feeds', 'About every 3 hours until he’s back to birth weight'] : ['clock', 'A calm, quiet spot', 'Fewer things to look at'], nurse ? ['heart', 'Switch sides when sucking slows', 'Gently squeezing your breast helps milk flow'] : ['bottle', 'Check the nipple flow', 'Too fast and he pulls off, too slow and he gives up'], ['hand', 'Burp, then offer again', 'Gas can make him feel full']];
    return page(head('Tough feed?', 'Not eating much', 'Some feeds are small, and that’s often fine. Look at the whole day, not one feed.', C.yellow)
      + h2('What to try') + steps(tries, false)
      + know('How you’ll know he’s okay', nb ? 'Wet diapers that keep up with his age, and back to birth weight by about 2 weeks.' : '6 or more wet diapers a day, and steady growth at checkups.')
      + call(nb ? 'Fewer wet diapers than expected, not back to birth weight by 2 weeks, very sleepy and hard to wake for feeds, or he refuses several feeds in a row.' : 'Fewer than 6 wet diapers a day, he isn’t gaining at a checkup, or he refuses several feeds in a row.')); };
  P.burp = () => page(head('Show me how', 'Burping', 'A gentle pat or rub on his back while he’s upright. Three positions work, so pick the one that suits you both.', C.blue)
    + h2('Three positions') + steps([['heart', 'Over your shoulder', 'His chin on your shoulder, a cloth underneath'], ['smile', 'Sitting on your lap', 'Lean him forward, your hand supporting his chin and chest'], ['moon', 'Across your knees', 'Tummy down, his head a little higher than his body']], false)
    + h2('How often') + p(isBottle() && nurses() ? 'Every 2–3 oz from a bottle, between sides at the breast, and at the end.' : isBottle() ? 'Every 2–3 oz, and at the end of the feed.' : 'Between sides, and at the end of the feed.')
    + small('No burp after a few minutes?', 'that’s fine. Carry on with the feed.') + small('A little milk with the burp', 'is normal. Keep a cloth handy.'));
  P.lump = () => page(head('Tough feed?', 'A tender lump in your breast', 'It’s often a clogged duct, where swelling narrows the milk ducts. Most ease in a day or two with gentle care.', C.pink)
    + h2('What helps') + steps([['heart', 'Keep feeding as usual', 'Or pump as usual. No need to empty the breast fully'], ['drop', 'Cold, not heat', 'A cold pack after feeds eases swelling'], ['hand', 'Gentle touch only', 'Light strokes toward your armpit, no deep massage'], ['clock', 'Ibuprofen can help', 'It eases swelling as well as pain']], false)
    + small('A supportive bra', 'that isn’t tight helps too.')
    + p('Cold and gentle care has replaced the old advice of heat, firm massage and extra pumping, which can make swelling worse.')
    + `<div class="hub-tip fd-call"><b>${F('Call your doctor or a lactation consultant')}</b>${F('A fever or chills, a red or hot area that’s spreading, or a lump that’s still there after a few days.')}</div>`);
  P.poop = () => { const b = isBreast() && fd() === 'Breast milk'; return page(head('Tough feed?', 'Poop and straining', 'Grunting, going red and straining are normal. He’s learning to relax the right muscles, and it usually eases by 2–3 months.', C.yellow)
    + h2('What’s normal') + two(['How often', b ? 'Several a day at first. After about 3–6 weeks, some breastfed babies go several days without one.' : isBreast() ? 'Several a day at first, then often once or twice a day.' : 'Often once or twice a day, and can be less.'], ['How it looks', b ? 'Yellow, seedy and soft.' : isBreast() ? 'Yellow to tan, and soft.' : 'Tan to yellow, like peanut butter.', '#fff3dc', '#8a6a2a'])
    + know('Soft when it comes?', 'Then it isn’t constipation, even after a few days.')
    + h2('If he’s uncomfortable') + steps([['hand', 'Bicycle his legs', 'Or bring his knees to his tummy'], ['heart', 'Tummy time and a warm bath', 'Both help him relax']], false)
    + call('Hard, pebble-like poop, blood in it, or no poop with vomiting or a swollen belly.')
    + `<p class="care-urgent"><b>${F('Call right away:')}</b> ${F('white, chalky or very pale gray poop.')}</p>`); };
  P.sick = () => { const am = typeof actualMonth === 'function' ? actualMonth() : 6, young = am < 3, solids = stg() >= 3, fever = am < 6 ? '101°F' : '103°F'; return page(head('Tough feed?', 'Feeding when he’s sick', 'Babies often eat less when they’re unwell. Keeping milk going matters more than how much he eats.', C.blue)
    + h2('What helps') + steps([['drop', 'Clear a stuffy nose first', 'Saline drops and a bulb syringe, before feeds'], ['clock', 'Smaller, more often', 'Little feeds add up'], ['heart', 'Keep him upright', 'It makes breathing easier while he feeds'], solids ? ['bowl', 'Milk and fluids first', 'Food can wait a few days'] : ['bottle', 'Breast milk or formula only', 'No water or juice before 6 months']], false)
    + call((young ? '' : 'A temperature of ' + fever + ' or higher, f') + (young ? 'F' : '') + 'ewer wet diapers than usual, refusing feeds, or he seems more unwell.')
    + `<p class="care-urgent"><b>${F('Call right away:')}</b> ${F((young ? 'A temperature of 100.4°F or higher, n' : 'N') + 'o wet diaper in 8 hours, or he’s very sleepy or hard to wake.')}</p>`); };
  /* ---------- Calm pass: runs last on every Feeding page ----------
     1. One quiet "When to call" card at the very bottom, instead of a pink box and a red line on every page.
        "This is normal" pages don't get one: Getting enough is the one home for diaper and weight worries.
     2. Mastitis and "coffee, a drink" live on the Your milk pages only, not repeated across the category.
     3. "Never..." lines say what to do instead.
     4. Answers to common first-time-parent questions that were missing or thin.
     5. The baby's own name and pronoun everywhere (the copy was written for a boy named Ari). */
  const NO_CALL = ['burp', 'snack', 'cluster', 'spurt', 'distract', 'picky', 'tiny', 'howlong', 'milkmeals', 'combo', 'pump', 'teethfeed', 'refusebottle', 'prefbottle', 'hiccups', 'biting'];
  const SWAP = [
    ['Never flat on his back,', 'Keep his head higher than his tummy,'], ['and never prop the bottle.', 'and hold the bottle for every feed.'],
    ['Never the microwave.', 'Skip the microwave.'],
    ['Never add extra water', 'Stick to the label'], ['Extra water or extra powder isn’t safe. Always use the amounts on the label.', 'The label’s water and scoops, every time. Extra water or powder changes what he gets.'],
    ['Unless your care team gave you a special recipe, use the amounts on the label. Never add extra water.', 'Unless your care team gave you a special recipe, the label’s water and scoops, every time.'],
    ['Never instead of water', 'Always mixed with water'],
    ['For babies under 1. Learn it now, and hope you never need it.', 'For babies under 1. Two moves worth knowing by heart before solids.'],
    ['Never while he’s moving around', 'Seated for every bite, never on the move'],
    ['In the weeks after your milk comes in, your body learns how much Ari needs and makes about that much.', 'Around 6–12 weeks, your body learns how much Ari needs and makes about that much.'],
    ['After the first weeks, what you pump usually levels off.', 'Around 6–12 weeks, what you pump usually levels off.'],
    ['let him finish the first side, then offer the second. Some feeds he’ll take only one.', 'let him finish the first side, then offer the second. In the first weeks a side often takes 10–20 minutes. Watch him, not the clock.'],
    ['Let him finish the first side, then offer the second. Some feeds he’ll take only one.', 'Let him finish the first side, then offer the second. In the first weeks a side often takes 10–20 minutes. Watch him, not the clock.'],
    ['There’s no best bottle.', 'Wide or narrow?'], ['Use whichever one he takes well.', 'Neither is better. The nipple’s flow matters more than the shape, so stick with one he takes calmly.'],
    ['Ask your pediatrician first.', 'Gas drops are safe for most babies, but often don’t help much. Gripe water isn’t regulated like medicine, so ask your pediatrician before trying it.'],
    ['ask your pediatrician first.', 'gas drops are safe for most babies, but often don’t help much. Gripe water isn’t regulated like medicine, so ask your pediatrician before trying it.'],
    ['Most babies spit up. It peaks around 4 months and is usually gone by the first birthday.', 'Most babies spit up. It’s called reflux, it peaks around 4 months, and it’s usually gone by the first birthday.'],
    ['Usually he’s too hungry, the flow is too fast or slow, he has gas, or he’s full.', 'Arching and squirming usually mean he’s too hungry, the flow is too fast or slow, he has gas or reflux, or he’s full.'],
    ['Not drinking is safest. Or wait 2 hours to nurse', 'An occasional one is fine. Wait about 2 hours to nurse'],
    ['Not drinking is safest. Or wait 2 hours to pump', 'An occasional one is fine. Wait about 2 hours to pump'],
    ['After a drink, wait 2 hours to nurse.', 'An occasional drink is fine if you wait about 2 hours to nurse.'],
    ['After a drink, wait 2 hours to pump.', 'An occasional drink is fine if you wait about 2 hours to pump.'],
    ['No wet diaper in 8 hours, a sunken soft spot, or very hard to wake. Call your pediatrician right away.', 'No wet diaper in 8 hours, a sunken soft spot, or he’s very hard to wake.'],
    ['A hard, swollen belly, or he seems in a lot of pain. Call your pediatrician right away.', 'A hard, swollen belly, or he seems to be in a lot of pain.']
  ];
  const whenCard = rows => rows.length ? `<section class="fd-when"><h2>${F('When to call')}</h2>${rows.map(([t, b, u]) => `<p${u ? ' class="is-now"' : ''}><b>${F(t)}</b>${b}</p>`).join('')}</section>` : '';
  const calmCss = `<style>#main .fd-when{margin:22px 0 8px;padding:14px 16px;border-radius:18px;background:var(--card,#fff);border:1px solid var(--line)}
    #main .fd-when h2{margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:0;text-transform:none;color:var(--muted)}
    #main .fd-when p{margin:0;padding:9px 0 0;font-size:14px;line-height:1.45;color:var(--ink)}#main .fd-when p+p{margin-top:9px;border-top:1px solid var(--line)}
    #main .fd-when b{display:block;font-size:13px;font-weight:600;margin:0 0 2px;color:var(--ink)}#main .fd-when p.is-now b{color:#9b4766}</style>`;
  const pron = h => { if (typeof profile === 'undefined') return h; const nm = esc(profile.name || 'your baby'), pr = profile.pronouns || 'they';
    if (nm === 'Ari' && pr === 'he') return h;
    const she = pr === 'she', they = pr !== 'he' && !she;
    const map = { 'he’s': she ? 'she’s' : they ? nm + '’s' : 'he’s', 'He’s': she ? 'She’s' : they ? nm + '’s' : 'He’s', he: she ? 'she' : they ? nm : 'he', He: she ? 'She' : they ? nm : 'He', his: she ? 'her' : they ? 'their' : 'his', His: she ? 'Her' : they ? 'Their' : 'His', him: she ? 'her' : they ? 'them' : 'him', himself: she ? 'herself' : they ? 'themself' : 'himself' };
    return h.replace(/(<style[\s\S]*?<\/style>)|(<[^>]*>)|([^<]+)/g, (m, st, tag, txt) => txt ? txt.replace(/\bAri\b/g, nm).replace(/\b(he’s|He’s|himself|he|He|his|His|him)\b/g, w => map[w]) : m); };
  const VIDEOS = { sore: ['y--syZR0u1E', 'A good latch, step by step', 'Global Health Media'], latch: ['y--syZR0u1E', 'A good latch, step by step', 'Global Health Media'], burp: ['d8tJimekFGo', 'Three ways to burp', 'UNICEF'], choking: ['ShaNuST_58A', 'Choking first aid for babies under 1', 'American Red Cross'], gag: ['ShaNuST_58A', 'Choking first aid for babies under 1', 'American Red Cross'] };
  const addVideo = (a, h) => { const v = VIDEOS[a]; if (!v || typeof hubEmbed !== 'function') return h;
    if (a === 'gag') { const k = h.indexOf('<h2 class="hub-h2">' + F('If he’s choking')); return k > 0 ? h.slice(0, k) + h.slice(k).replace(/(<\/h2>)/, '$1' + hubEmbed(...v)) : h; }
    const j = h.indexOf('ss-head'), i = j > 0 ? h.indexOf('</div>', j) + 6 : -1; return i > 5 ? h.slice(0, i) + hubEmbed(...v) + h.slice(i) : h; };
  const calm = (a, h) => {
    if (a !== 'dirD' && a !== 'worry' && a !== 'hard') { const v = stg(), eb = hardIds().includes(a) ? 'Tough feed?' : null;
      if (eb) ['Tough feed?', 'Common now', 'Common around now', 'Something seem off?'].some(x => { const k = '>' + F(x) + '<'; if (h.includes(k)) { h = h.replace(k, '>' + F(eb) + '<'); return true; } }); }
    if (a === 'dirD') return pron(h.replace(`${F('Example day')} ›`, `${F('Sample day')} ›`));
    SWAP.forEach(([x, y]) => { h = h.split(F(x)).join(F(y)); });
    // Gather every call box and urgent line, then rebuild them as one card at the end
    const rows = []; let mom = '';
    h = h.replace(/<div class="hub-tip fd-call"><b>([\s\S]*?)<\/b>([\s\S]*?)<\/div>/g, (m, t, b) => { if (/lactation/.test(t)) mom = b; else rows.push(['Call your pediatrician if', b]); return ''; })
      .replace(/<p class="care-urgent"><b>([\s\S]*?)<\/b>\s*([\s\S]*?)<\/p>/g, (m, t, b) => { const ifs = /^if /.test(b); rows.push([/911/.test(t) ? (ifs ? 'Call 911' : 'Call 911 if') : 'Call right away if', (ifs && /911/.test(t) ? b : b.replace(/^if /, '')).replace(/^./, c => c.toUpperCase()), 1]); return ''; });
    const keepMom = ['milkin', 'supply', 'latch', 'lump', 'sore'].includes(a) && mom;
    if (a === 'latch' && mom) mom = F('Pain through the whole feed, cracked or bleeding nipples, or a red, painful area with a fever. If latching keeps hurting despite help, ask about his mouth, including tongue-tie.');
    const list = (NO_CALL.includes(a) || a === 'supply') ? rows.filter(r => r[2] && !/pediatrician right away/.test(r[1])) : rows;
    if (keepMom && a === 'supply') list.unshift(['Call your doctor or a lactation consultant if', F('A red, painful area on your breast with a fever.')]);
    else if (keepMom) list.unshift(['Call your doctor or a lactation consultant if', mom]);
    if (a === 'enough') list.forEach(r => { r[1] = r[1].split(F('during feeds. Fewer than 6 wet diapers a day, he seems hungry after most feeds, he isn’t gaining at a checkup, or he refuses')).join(F('during feeds, has fewer than 6 wet diapers a day, seems hungry after most feeds, isn’t gaining at a checkup, or refuses')); });
    if (a === 'enough' || a === 'small') list.forEach(r => { if (!r[2] && !/refus/.test(r[1])) r[1] = r[1].replace(/\.$/, F(', or he refuses several feeds in a row.')).replace(F(' or he isn’t gaining at a checkup, or he refuses'), F(' he isn’t gaining at a checkup, or he refuses')).replace(F(', or very sleepy and hard to wake for feeds, or he refuses'), F(', very sleepy and hard to wake for feeds, or he refuses')).replace(F(', or is very sleepy and hard to wake for feeds, or he refuses'), F(', is very sleepy and hard to wake for feeds, or refuses')); });
    // Drop duplicate breast-pain lines folded into pediatrician rows
    list.forEach(r => { if (!r[2]) r[1] = r[1].replace(F(', or a red, painful area on your breast with a fever.'), '.'); });
    // "Coffee, a drink" once, on the Your milk pages
    if (['howlong', 'milkmeals', 'at12', 'supply'].includes(a)) h = h.replace(/<div class="hub-tip(?: fd-tip)?"><b>[^<]*(?:Coffee, a drink|Food, coffee and drinks)[\s\S]*?<\/div>/g, '');
    // Normal pages end with the reassurance, not a warning
    if (a === 'cluster' || a === 'spurt') h = h.replace(/<\/div>$/, `<div class="hub-tip fd-tip"><b>${F('How you’ll know it’s fine')}</b><p>${F('6 or more wet diapers a day, and steady growth at checkups.')}</p></div></div>`);
    if (a === 'teethfeed') h = h.replace(/<\/div>$/, `<div class="hub-tip fd-tip"><b>${F('Good to know')}</b><p>${F('Teething doesn’t cause a fever, diarrhea or a runny nose. If he has those, it’s something else, so check in with your pediatrician.')}</p></div></div>`);
    if (a === 'spit') h = h.replace(/<\/div>$/, `<div class="hub-tip fd-tip"><b>${F('Happy and growing well?')}</b><p>${F('Then spit-up doesn’t need treatment, even when it looks like a lot.')}</p></div></div>`);
    if (a === 'supply' && pumps() && !nurses()) h = h.replace(/<\/div>$/, `<div class="hub-tip fd-tip"><b>${F('Too much?')}</b><p>${F('Pumping more makes more. Pump about what he drinks, freeze any extra, and drop extra sessions slowly so you stay comfortable.')}</p></div></div>`);
    if (a === 'howlong' && isBreast()) { const j = h.indexOf('ss-head'), i = j > 0 ? h.indexOf('</div>', j) + 6 : -1;
      if (i > 5) h = h.slice(0, i) + `<div class="hub-tip"><b>${F('What pediatricians recommend')}</b>${F('Breast milk alone for about the first 6 months, then alongside food for as long as you both want, up to 2 years or beyond.')}</div>` + h.slice(i); }
    const dropP = (frag) => { h = h.replace(new RegExp('<p(?: class="[^"]*")?>(?:(?!</p>)[\\s\\S])*' + frag + '(?:(?!</p>)[\\s\\S])*</p>\\s*', 'g'), ''); };
    if (a === 'enough') { ['Poop:', 'Night feeds', 'first checkup', isEarly() ? '\\u0000' : 'Born a few weeks early'].forEach(dropP);
      if (stg() === 0) h = h.replace(/<\/div>$/, `<div class="hub-tip"><b>${F('Tracking feeds')}</b>${F(isBottle() && !nurses() ? 'For the first weeks, jot down when each feed starts, how many ounces, and each diaper. Once he’s back to birth weight, you can stop.' : 'For the first weeks, jot down when each feed starts, which side' + (isBottle() ? ' or how many ounces' : '') + ', and each diaper. Once he’s back to birth weight, you can stop.')}</div></div>`); }
    if (a === 'latch') ['Burping:'].forEach(dropP);
    if (a === 'enough' && isEarly()) h = h.split(F('Once he’s back to birth weight, you can stop.')).join(F('Keep going until his care team says you can stop.'))
      .split(F('He tires, breathes fast or changes color during feeds. Fewer than 6 wet diapers a day, he seems hungry after most feeds, he isn’t gaining at a checkup, or he refuses several feeds in a row.')).join(F('He tires, breathes fast or changes color during feeds, has fewer than 6 wet diapers a day, seems hungry after most feeds, isn’t gaining at a checkup, or refuses several feeds in a row.'));
    if (a === 'milkin' && nurses()) ['One side or both'].forEach(dropP);
    { const v = stg(), nurse = nurses(), pump = pumps(), bot = isBottle(), fm = formulaFam();
      const T = { latch: ['heart', 'Latch and holds', 'How a good latch feels, and five holds'], burp: ['hand', 'Burping', 'Three positions, and how often'], bottle: ['bottle', 'Giving a bottle', 'Positions, pacing and nipple flow'], formula: ['bowl', 'Making formula', 'Water first, level scoops'], pump: ['drop', 'Pumping', 'How often, flange fit, as he grows'], basics: ['snow', 'Storing and warming milk', 'How long it lasts, and travel'], work: ['clock', 'Going back to work', 'A pumping plan, and your rights'], vitd: ['drop', 'Vitamin D and iron', 'How to give drops, and when to stop'], choking: ['shield', 'Choking first aid', 'Under 1, step by step'], prep: ['bowl', 'Preparing first foods', 'Safe shapes by age'], cups: ['drop', 'Cups', 'Open or straw, and how to start'], tummy: ['drop', 'Tummy and poop', 'What’s normal now'], firstbottle: ['bottle', 'A first bottle', 'When and how, for nursing families'], day: ['clock', 'A day, and hunger cues', 'What a day of feeds can look like'] };
      const HOWIN = { feeds: v <= 1 ? [] : [nurse && 'latch', bot && 'bottle', v <= 2 && 'burp', 'day'], milkarea: [nurse && 'latch', pump && 'pump', bot && 'basics', nurse && !bot && 'firstbottle'], bf1: [], howlong: [nurse && 'latch', pump && 'pump', 'work', bot && 'basics'], supply: [nurse && 'latch', pump && 'pump', 'work'],
        formula: ['bottle', 'basics', v <= 2 && 'burp'], bottle: [fm && 'formula', 'basics', v <= 2 && 'burp', pump && 'pump'], bottlegrow: ['bottle', fm && 'formula', 'basics'], basics: ['bottle', fm && 'formula'], cups: [bot && 'bottle'],
        tummy: [v <= 2 && 'burp', 'vitd'], vitd: [v <= 1 && 'tummy'], signs: ['choking', 'prep', 'vitd', 'tummy'], firstfoods: ['prep', 'choking', 'cups', 'tummy', 'vitd'], family: ['prep', 'choking', 'cups', 'tummy', 'vitd'], at12: ['cups', bot && 'bottle'] }[a];
      if (HOWIN) { const ks = HOWIN.filter(k => k && k !== a && P[k] && !h.includes(`mock:${k}'`)); if (ks.length) h = h.replace(/<\/div>$/, h2('Show me how') + `<div class="hub-list">${ks.map(k => `<button class="hub-row hl-row" style="--hl-bg:${C.lilac[0]};--hl-ink:${C.lilac[1]}" onclick="${go(k)}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt(T[k][0], CAT)}</span><span class="hub-row-copy"><b>${F(T[k][1])}</b><small>${F(T[k][2])}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`).join('')}</div></div>`); } }
    { const end = x => { h = h.replace(/<\/div>$/, x + '</div>'); }, afterHead = x => { const j = h.indexOf('ss-head'), i = j > 0 ? h.indexOf('</div>', j) + 6 : -1; if (i > 5) h = h.slice(0, i) + x + h.slice(i); };
      if (a === 'firstfoods') afterHead(two(['Gagging: normal', 'Coughing, sputtering and a red face. Stay calm and let him work it out.'], ['Choking: act now', 'Silent, can’t cough or cry, turning blue. Start back blows and have someone call 911.', '#fbe4ec', '#9b4766']));
      if (a === 'signs') end(small('Before the first bite,', 'learn choking first aid for babies under 1. It’s in How-tos, with a short video.'));
      if (a === 'milkarea' && isBreast()) end(`<div class="hub-tip fd-tip fd-notes">${nurses() && formulaFam() ? small('Keeping your milk going:', 'when a bottle replaces a nursing, pump around then. Milk seems lower? Nurse or pump more often for a few days.') : ''}${small('Food, coffee and drinks:', 'no special diet. Keep taking your prenatal vitamin. Up to 2–3 cups of coffee a day, and wait about 2 hours after a drink to ' + (nurses() ? 'nurse' : 'pump') + '.')}</div>`);
    }
    // Remove any boxes the regexes emptied, then add the one card at the end
    h = h.replace(/<div class="hub-tip fd-tip fd-notes">\s*<\/div>/g, '');
    h = h.replace(/<\/div>$/, whenCard(list) + calmCss + '</div>');
    h = h.split(F('use the amounts on the label. Stick to the label.')).join(F('use the label’s water and scoops, every time.'));
    if (a === 'enough') h = h.split(F('during feeds. Fewer than 6 wet diapers a day, he seems hungry after most feeds, he isn’t gaining at a checkup, or he refuses')).join(F('during feeds, has fewer than 6 wet diapers a day, seems hungry after most feeds, isn’t gaining at a checkup, or refuses'));
    return pron(addVideo(a, h)); };
  const stTl = window.stageTimeline;
  if (typeof stTl === 'function') window.stageTimeline = function (cat, items, ...r) { if (cat === CAT && !window.__fdPills) return ''; return stTl.call(this, cat, items, ...r); };
  // ---- Mocks for the locked structure (Nov 5) ----
  HEADART['Breastfeeding & pumping'] = () => ART.drops(4); HEADART['Tough feed?'] = HEADART['Tough feed?'] || (() => ART.often(3));
  const arow = (c, icon, label, t, sub, to) => `<button class="hub-row hl-row" style="--hl-bg:${C[c][0]};--hl-ink:${C[c][1]}" onclick="${go(to)}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt(icon, CAT)}</span><span class="hub-row-copy">${label ? `<small>${F(label)}</small>` : ''}<b>${F(t)}</b><small>${F(sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  const alist = rows => `<div class="hub-list">${rows.filter(Boolean).join('')}</div>`;
  // Breastfeeding & pumping, 6 weeks–4 months: what's normal, what to do, then depth one tap away.
  P.bf1 = () => { const nurse = nurses(), pump = pumps(), fm = formulaFam(), c = C.pink;
    return page(head('Breastfeeding & pumping', 'Your supply settles', 'Somewhere between 6 and 12 weeks, your body learns how much milk he needs. Softer breasts and quicker feeds are normal now. They don’t mean less milk.', c)
      + sstrip('How your milk changes', [['drop', 'Days 2–5', 'Milk comes in'], ['heart', 'Weeks 1–6', 'Full, often leaky'], ['clock', '6–12 weeks', 'Settles to what he takes']])
      + doCard(c, [nurse ? 'Keep feeding on cue. Each feed tells your body how much to make.' : 'Keep about the same total each day, even as you pump less often.', fm ? 'Topping up with formula? ' + (nurse ? 'Nurse' : 'Pump') + ' first and keep top-ups small, so your body keeps making milk.' : '', 'Dropping a feed or a pump? Drop one every few days, not all at once, to avoid clogged ducts.'])
      + knowLine('6 or more wet diapers a day and steady growth at checkups. That’s the real sign your supply is right, not how full you feel.')
      + h2('More on your milk')
      + alist([arow('pink', 'drop', '', 'Too much or too little milk?', 'Most worries aren’t low supply. How to tell', 'supplyhelp'), nurse && fm && arow('pink', 'bottle', '', 'Nursing and formula', 'Keep your milk going while you top up', 'combo'), arow('lilac', 'clock', '', 'Going back to work', 'A pumping plan, and your rights', 'work')])
      + h2('Show me how')
      + alist([nurse && arow('peach', 'heart', '', 'Latch and holds', 'How a good latch feels, and five holds', 'latch'), pump && arow('peach', 'drop', '', 'Pumping', 'How often, flange fit, and as he grows', 'pump'), arow('blue', 'snow', '', 'Storing and warming milk', 'How long it lasts, and travel', 'basics'), nurse && !isBottle() && arow('peach', 'bottle', '', 'A first bottle', 'When and how, for nursing families', 'firstbottle')])
      + small('Pain, a lump or cracked nipples?', 'that’s in Tough feed, under For you.')); };
  P.supplyhelp = () => { const nurse = nurses(), c = C.pink;
    return page(head('Breastfeeding & pumping', 'Too much or too little milk?', 'Most parents worry about low supply at some point. Usually it’s fine. Here’s how to tell.', c)
      + two(['Usually fine', 'Softer breasts, quicker feeds, pumping a bit less than before, fussy evenings.'], ['Worth checking', 'Fewer than 6 wet diapers a day, slow weight gain, or hungry after most feeds.', '#fdeee6', '#9a5a3c'])
      + know('If it might be too little', (nurse ? 'Nurse' : 'Pump') + ' more often for a few days, including once at night. ' + (nurse ? 'Get the latch checked' : 'Get your flange fit checked') + ' by a lactation consultant. Don’t space out feeds to “save up” milk. That tells your body to make less.')
      + know('If it might be too much', 'He gulps, coughs or pulls off as your milk lets down, and you feel full most of the time. Try a laid-back position, and offer one side per feed for a few feeds.')
      + call('Slow weight gain, or fewer than 6 wet diapers a day.')); };
  // Tough feed, newborn: problem first. It doesn't re-explain what's normal; that lives in Everyday essentials.
  P.reflux0 = () => page(head('Tough feed?', 'Spit-up that seems like too much', 'Lots of spit-up is common. It’s worth help when it comes with crying, arching, or not gaining weight.', C.blue)
    + doCard(C.blue, ['Offer smaller feeds, more often.', isBottle() ? 'Pace the bottle, and burp every 2–3 oz.' : 'Burp between sides, and when he slows down.', 'Hold him upright for 20–30 minutes after feeds.'])
    + small('Before you change anything,', 'ask your pediatrician first about thickening feeds or switching formula. Keep him on his back on a flat surface for sleep, even with spit-up.')
    + call('Slow weight gain, refusing feeds, fewer wet diapers, or forceful vomiting after most feeds.')
    + `<p class="care-urgent"><b>${F('Call right away:')}</b> ${F('green or bloody vomit, or vomiting with a fever.')}</p>`
    + small('Wondering what’s normal?', 'Everyday essentials covers spit-up, burping and gas.'));
  P.crying0 = () => page(head('Tough feed?', 'Crying he can’t settle from', 'Crying often peaks around 6 weeks and eases by 3–4 months. When nothing works, try these in order.', C.blue)
    + steps([['bottle', 'Check the basics', 'Hungry, needs a burp, or a diaper'], ['clock', 'Slow the feed', isBottle() ? 'Pace the bottle, try a slower nipple' : 'Try laid-back nursing if milk gushes'], ['hand', 'Ease the gas', 'Bicycle his legs, or tummy-down on your lap'], ['moon', 'Calm him', 'Swaddle, rock, shush, white noise']], true)
    + know('If you’re at your limit', 'Put him down somewhere safe, on his back, and step away for a few minutes. Crying won’t hurt him. Never shake him. Then call someone to help.')
    + small('Gas drops or gripe water?', 'gas drops are safe but often don’t help much. Ask your pediatrician before trying gripe water.')
    + call('Crying for 3 or more hours a day, crying that sounds different or high-pitched, or crying with vomiting or poor feeding.')
    + `<p class="care-urgent"><b>${F('Call right away:')}</b> ${F(fever(false) + '.')}</p>`);
  P.poop0 = () => { const br = isBreast() && fd() === 'Breast milk';
    return page(head('Tough feed?', 'Poop that worries you', 'Most colors and textures are normal. These are the ones to call about.', C.blue)
      + two(['Call your pediatrician', (br ? 'Fewer than 3 poops a day after day 4, in the first weeks. ' : '') + 'Hard, pebble-like poop. Watery poop much more often, with fewer wet diapers.', '#fdeee6', '#9a5a3c'], ['Call right away', 'White, gray or very pale poop. Red or black poop after the first few days.', '#fbe9e9', '#a33a3a'])
      + small('Green, mustard, seedy or a bit of mucus?', 'all normal. So is grunting and going red, as long as the poop is soft.')
      + small('Bring a photo.', 'A picture of the diaper helps your pediatrician tell what’s going on.')); };
  { const hard0 = P.hard; P.hard = () => { if (stg() !== 0) return hard0(); const nurse = nurses(), fm = formulaFam(), br = isBreast();
    const pick = ([i, t, s, to]) => `<button class="care-pick" onclick="${go(to)}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`;
    const card = xs => `<div class="hub-card care-folds care-lookoff">${xs.filter(Boolean).map(pick).join('')}</div>`;
    return page(head('Feeding', 'Tough feed?', 'Pick what’s happening. You’ll see what to try, and when to call.')
      + h2('Feeds') + card([['moon', 'Too sleepy to feed', 'How to wake him, and when to call', 'sleepy'], ['heart', 'Fussy or pulling off at feeds', 'Too hungry, too fast, or full', 'fussy'], ['diaper', 'Not eating much', 'What to try, and how to tell it’s okay', 'small'], fm && ['bottle', 'Is it the formula?', 'Before you switch', 'isformula']])
      + h2('Tummy') + card([['bottle', 'Spit-up that seems like too much', 'With crying, arching, or slow weight gain', 'reflux0'], ['drop', 'Crying he can’t settle from', 'What to try, in order', 'crying0'], ['diaper', 'Poop that worries you', 'The colors and changes to call about', 'poop0']])
      + h2('When he’s unwell') + card([['eye', 'Sick, or a stuffy nose', 'Feeding when he’s unwell', 'sick']])
      + (br ? h2('For you') + card([nurse && ['heart', 'Nursing still hurts', 'Cracked nipples, or pain through the feed', 'sore'], ['heart', 'A tender lump in your breast', 'A clogged duct, and what helps', 'lump']]) : '')
      + `<div class="hub-list" style="margin-top:12px">${arow('lilac', 'hand', 'Support', 'You don’t have to figure this out alone', 'Who can help, and how you’re doing', 'help')}</div>`); }; }
  // ---- Mock v2 (Nov 5): one permanent home per subject, guides inside it, stage page points into them ----
  HEADART['Everyday essentials'] = () => ART.bottle(.45);
  const guideRow = (c, icon, t, sub, to, when) => `<button class="hub-row hl-row" style="--hl-bg:${C[c][0]};--hl-ink:${C[c][1]}" onclick="${go(to)}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(t)}</b><small>${F(sub)}</small>${when ? `<small style="opacity:.7">${F(when)}</small>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  const nowCard = (c, icon, t, sub, to) => `<button class="hub-rough-card care-rash-card" style="background:${c[0]};color:${c[1]};margin:0 0 6px" onclick="${go(to)}"><span class="hub-rough-moon" aria-hidden="true">${hubArt(icon, CAT)}</span><span class="hub-rough-copy"><small style="text-transform:uppercase;letter-spacing:.06em;font-size:11.5px;font-weight:700">${F('Right now')}</small><b>${F(t)}</b><small>${F(sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  // Breastfeeding & pumping: the permanent home. Every guide lives here; the stage only decides which comes first.
  P.bfhome = () => { const v = stg(), nurse = nurses(), pump = pumps(), fm = formulaFam(), c = C.pink;
    const G = [
      ['heart', 'Getting started', 'Milk coming in, latch and holds, tongue-tie', 'milkarea', 'Most useful in the first 6 weeks', nurse || pump],
      ['drop', 'Understanding your supply', 'Settling, too little, too much', 'bf1', 'From about 6 weeks', true],
      ['heart', 'Comfort and care', 'Engorgement, sore nipples, clogged ducts', 'sore', 'Any time', true],
      ['drop', 'Pumping basics', 'How often, flange fit, how much', 'pump', pump ? 'Any time' : 'If you start pumping', true],
      ['bottle', 'Nursing and bottles', fm ? 'Topping up with formula, protecting supply' : 'A first bottle, and keeping nursing going', fm ? 'combo' : 'firstbottle', 'From about 3 weeks', nurse],
      ['clock', 'Everyday life', 'Pumping at work, food, coffee and drinks', 'work', 'From about 6 weeks', true],
      ['heart', 'Nursing challenges', 'Strikes and biting', 'nstrike', 'From about 4 months', nurse],
      ['heart', 'Continuing or stopping', 'How long, stopping gently, nursing past 1', 'howlong', 'From about 4 months', true]
    ].filter(g => g[5] && P[g[3]]);
    const nowI = [0, 1, 7, 5, 7][v], now = G.find((g, i) => i === Math.min(nowI, G.length - 1)) || G[0];
    return page(head('Breastfeeding & pumping', 'Your milk, start to finish', 'Every guide about nursing, pumping and your milk lives here. The one that matters most for Ari right now is first.', c)
      + nowCard(c, now[0], now[1], now[2], now[3])
      + h2('All guides') + alist(G.filter(g => g !== now).map(g => guideRow('pink', g[0], g[1], g[2], g[3], g[4])))); };
  // Everyday essentials: the normal stuff, with the problem version inside each guide.
  P.esshome = () => { const v = stg(), c = C.blue;
    const G = [['hand', 'Burping and spit-up', 'How to burp, what’s normal, and reflux', 'spitguide', 'Most useful 0–4 months'], ['drop', 'Gas and fussy evenings', 'What helps, and crying that won’t settle', 'crying0', 'Peaks around 6 weeks'], ['diaper', 'Understanding poop', 'What’s normal on milk, and colors to call about', 'poop0', 'Any time'], ['drop', 'Vitamin D and iron', 'How to give drops, and when to stop', 'vitd', 'Every day']];
    const now = G[v === 1 ? 1 : 0];
    return page(head('Everyday essentials', 'The everyday stuff', 'Burping, spit-up, gas, poop and vitamins. What’s normal, what helps, and when it’s more than that.', c)
      + nowCard(c, now[0], now[1], now[2], now[3])
      + h2('All guides') + alist(G.filter(g => g !== now).map(g => guideRow('blue', g[0], g[1], g[2], g[3], g[4])))); };
  // A guide: normal first, then what helps, then when it's more than that. Tough feed links here instead of repeating it.
  P.spitguide = () => { const c = C.blue, bot = isBottle();
    return page(head('Everyday essentials', 'Burping and spit-up', 'Almost every newborn spits up, and most of it is normal. Burping and a few small habits help.', c)
      + h2('What’s normal')
      + two(['Spit-up', 'Flows out gently, often with a burp. It’s usually less than it looks.'], ['Vomit', 'Comes out with force, sometimes across the room.', '#fdeee6', '#9a5a3c'])
      + sstrip('Spit-up, as he grows', [['bottle', '0–2 months', 'Common after feeds'], ['bottle', 'Around 4 months', 'Usually the peak'], ['smile', '9–12 months', 'Mostly gone']])
      + h2('How to burp')
      + steps([['heart', 'Over your shoulder', 'Pat or rub his back'], ['hand', 'Sitting on your lap', 'Support his chin and chest'], ['moon', 'Tummy-down on your lap', 'Gentle pats on his back']], true)
      + small('When:', bot ? 'every 2–3 oz, and at the end. No burp after a minute or two is fine.' : 'between sides, and at the end. No burp after a minute or two is fine.')
      + doCard(c, ['Hold him upright for 20–30 minutes after feeds.', 'Offer smaller feeds, more often, if he spits up a lot.', bot ? 'Pace the bottle so he doesn’t gulp air.' : ''])
      + knowLine('He’s growing well and has 6 or more wet diapers a day. Then spit-up is normal, even when it looks like a lot.')
      + h2('When it’s more than spit-up')
      + know('Signs of reflux that bothers him', 'He cries or arches during or after most feeds, refuses feeds, or isn’t gaining weight. Ask your pediatrician before thickening feeds or switching formula.')
      + call('Slow weight gain, refusing feeds, fewer wet diapers, or forceful vomiting after most feeds.')
      + `<p class="care-urgent"><b>${F('Call right away:')}</b> ${F('green or bloody vomit, or vomiting with a fever.')}</p>`); };
  { const hardV = P.hard; P.hard = () => hardV().replace(`mock:reflux0'`, `mock:spitguide'`).replace(F('With crying, arching, or slow weight gain'), F('With arching, or slow weight gain')); }
  // ---- Mock v3: sections named for the parent's job ----
  HEADART['Making feeding work'] = () => ART.drops(4); HEADART['After a feed'] = () => ART.bottle(.45); HEADART['Finding your rhythm'] = () => ART.often(5);
  P.mfw = () => { const v = stg(), nurse = nurses(), pump = pumps(), fm = formulaFam(), b = isBreast(), bot = isBottle(), c = C.pink;
    const G = (icon, t, sub, to) => P[to] ? guideRow('pink', icon, t, sub, to) : '';
    const breastPart = v === 0
      ? doCard(c, [nurse ? 'Bring him to you, nose to nipple, and wait for a wide mouth. A strong tug is right; pinching isn’t.' : 'Pump 8–12 times a day, including once at night, to get your milk going.', 'Your milk comes in around days 2–5. Full, tender breasts are normal at first.', 'Get help early. A lactation consultant can fix most problems in a visit or two.'])
        + alist([G('heart', 'Getting started', 'Milk coming in, latch and holds', 'milkarea'), nurse && G('heart', 'Latch and holds', 'Step by step, with a video', 'latch'), pump && G('drop', 'Pumping basics', 'How often, flange fit, how much', 'pump'), G('heart', 'Comfort and care', 'Engorgement, sore nipples, clogged ducts', 'sore')].filter(Boolean))
      : doCard(c, ['Softer breasts and quicker feeds are normal now. They don’t mean less milk.', nurse ? 'Keep feeding on cue. Each feed tells your body how much to make.' : 'Keep about the same total each day, even as you pump less often.', 'Going back to work? Start a small freezer stash a few weeks before.'])
        + alist([G('drop', 'Understanding your supply', 'Settling, too little, too much', 'bf1'), pump && G('drop', 'Pumping basics', 'How often, flange fit, how much', 'pump'), nurse && !bot && G('bottle', 'A first bottle', 'When and how', 'firstbottle'), G('clock', 'Going back to work', 'A pumping plan, and your rights', 'work')].filter(Boolean));
    const bottlePart = v === 0
      ? doCard(C.lilac, [fm ? 'Water first, then level scoops, exactly as the label says.' : 'Use thawed or fresh milk within the safe times, and never microwave it.', 'Hold him fairly upright and pace the bottle, with pauses every few sucks.', 'Never prop a bottle. Stay with him for every feed.'])
        + alist([fm && G('bowl', 'Making formula', 'Water first, level scoops, safe water', 'formula'), G('bottle', 'Giving a bottle', 'Positions, pacing and nipple flow', 'bottle'), G('snow', 'Storing and warming milk', 'How long it lasts, and travel', 'basics')].filter(Boolean))
      : doCard(C.lilac, ['Start with the slowest nipple. Go up only if he sucks hard and gets frustrated.', 'Keep pacing, and stop when he slows or turns away, even if milk is left.', fm ? 'Bottles are often 4–5 oz now, and stay about the same until solids.' : 'Breast milk bottles stay about 3–4 oz, even as he grows.'])
        + alist([G('bottle', 'Giving a bottle', 'Pacing and nipple flow', 'bottle'), fm && G('bowl', 'Making formula', 'And switching formula', 'formula'), G('snow', 'Storing and warming milk', 'How long it lasts, and travel', 'basics')].filter(Boolean));
    const title = v === 0 ? (nurse && fm ? 'Nursing, plus formula top-ups' : nurse ? 'Get nursing off to a good start' : b ? 'Get pumping going' : 'Make and give bottles safely') : (nurse && fm ? 'Keep your milk going as you top up' : b ? 'Trust your supply as it settles' : 'Check the flow, and keep pacing');
    const lead = v === 0 ? 'The first weeks are when feeding gets set up. It’s normal for it to take practice, and help is easy to get.' : 'Your routine may need small adjustments as he gets better at eating.';
    const combo = nurse && fm ? small('Topping up?', v === 0 ? 'nurse first, then offer a small bottle if he’s still hungry. Pumping after a top-up helps keep your milk going.' : 'keep top-ups small and nurse first, so your body keeps making milk. Pace bottles so the breast still feels easy.') : '';
    return page(head('Making feeding work', title, lead, c)
      + (b && bot ? h2(nurse ? 'Nursing' : 'Pumping') : '') + (b ? breastPart : '')
      + combo
      + (bot ? (b ? h2(fm ? 'Formula top-ups' : 'Bottles') : '') + bottlePart : '')
      + (b ? `<p class="ss-small" style="margin-top:14px"><button class="hub-link" style="padding:0;border:0;background:none;font:inherit;color:inherit;text-decoration:underline;cursor:pointer" onclick="${go('bfhome')}">${F('All breastfeeding and pumping guides')} ›</button></p>` : '')); };
  P.after = () => { const v = stg(), bot = isBottle(), br = isBreast() && fd() === 'Breast milk', c = C.blue;
    const poop = br ? 'yellow and seedy' : fd() === 'Formula' ? 'tan to yellow, like peanut butter' : 'soft and yellow to tan';
    return page(head('After a feed', v === 0 ? 'Burping, spit-up and poop' : 'Gas and spit-up may peak now', v === 0 ? 'Newborn tummies are noisy. Most of what you see after a feed is normal.' : 'Both are common at this age, and both ease. Here’s what helps.', c)
      + (v === 0 ? steps([['hand', 'Burp', bot ? 'Every 2–3 oz, and at the end' : 'Between sides, and at the end'], ['clock', 'Hold upright', '20–30 minutes after feeds'], ['bottle', 'Expect spit-up', 'Usually less than it looks']], true)
        : sstrip('When it eases', [['moon', 'Fussy evenings', 'Peak around 6 weeks'], ['bottle', 'Spit-up', 'Peaks around 4 months'], ['smile', 'Gas', 'Usually eases by 3–4 months']]))
      + doCard(c, v === 0 ? ['For gas, bicycle his legs or lay him tummy-down across your knees.', 'Grunting and going red while he poops is normal, as long as it’s soft.', 'Give vitamin D drops every day' + (bot && !isBreast() ? ', until he drinks about 32 oz a day.' : '.')] : ['Burp more often, and keep him upright after feeds.', 'For gas, bicycle his legs or try tummy-down across your knees.', br ? 'Some breastfed babies go a few days without a poop now. Soft is what matters.' : 'Poop often comes once or twice a day now. Soft is what matters.'])
      + knowLine(v === 0 ? 'He’s growing well and has 6 or more wet diapers a day. By about day 5, poop turns ' + poop + '.' : 'He’s growing well and is mostly content between fussy spells.')
      + h2('Guides') + alist([guideRow('blue', 'hand', 'Burping and spit-up', 'How to burp, what’s normal, and reflux', 'spitguide'), guideRow('blue', 'drop', 'Gas and fussy evenings', 'What helps, and crying that won’t settle', 'crying0'), guideRow('blue', 'diaper', 'Understanding poop', 'What’s normal, and colors to call about', 'poop0'), guideRow('blue', 'drop', 'Vitamin D and iron', 'How to give drops, and when to stop', 'vitd')])); };
  // ---- Mock v4: the section page is the answer. At most one link out. ----
  const oneLink = (t, to) => `<div class="hub-list" style="margin-top:14px">${guideRow('lilac', 'eye', t[0], t[1], to)}</div>`;
  P.mfw = () => { const v = stg(), nurse = nurses(), pump = pumps(), fm = formulaFam(), b = isBreast(), bot = isBottle(), c = C.pink, onlyP = pump && !nurse;
    let breast = '', bottle = '', link = '';
    if (v === 0) {
      if (nurse) breast = steps([['eye', 'Nose to nipple', 'Line him up, tummy to you'], ['smile', 'Wait for a wide mouth', 'Like a big yawn'], ['heart', 'Bring him to you', 'Chin first, not you to him']], true)
        + small('Holds:', 'cross-cradle and football are easiest at first. Laid-back works well too.')
        + sstrip('Your milk, the first weeks', [['drop', 'Days 1–2', 'Small amounts of colostrum'], ['heart', 'Days 2–5', 'Milk comes in'], ['clock', 'Weeks 1–6', 'Full, often leaky']])
        + doCard(c, ['Pinching? Break the seal with a clean finger and try again.', 'Very full or sore? Express a little, then use a cold pack.', 'Get help early. A lactation consultant can fix most problems in a visit or two.']);
      else if (onlyP) breast = sstrip('Your milk, the first weeks', [['drop', 'Days 1–2', 'Small amounts of colostrum'], ['heart', 'Days 2–5', 'Milk comes in'], ['clock', 'Weeks 1–6', 'Amounts grow']])
        + doCard(c, ['Pump 8–12 times a day, including once at night.', 'Your nipple should move freely in the flange without rubbing. Pumping shouldn’t hurt.', 'Fresh milk keeps 4 hours out and 4 days in the fridge.']);
      if (bot) bottle = steps(fm ? [['drop', 'Water first', 'Then level scoops'], ['bowl', 'Exactly as the label says', 'Never extra water or powder'], ['hand', 'Test on your wrist', 'Warm or room temperature']] : [['snow', 'Thaw in the fridge', 'Or in warm water'], ['drop', 'Swirl, don’t shake', 'Never the microwave'], ['hand', 'Test on your wrist', 'Cold is fine too']], true)
        + doCard(C.lilac, ['Hold him fairly upright, and pace the bottle with pauses every few sucks.', 'Burp every 2–3 oz. Stop when he slows or turns away.', 'Never prop a bottle.'])
        + small('How long it lasts:', fm ? 'use a formula bottle within 2 hours, or 1 hour once he starts.' : 'breast milk keeps 4 hours out and 4 days in the fridge. Use it within 2 hours once he starts.');
      link = nurse ? oneLink(['Latch and holds, with a video', 'Step by step, with pictures'], 'latch') : onlyP ? oneLink(['Pumping, step by step', 'How often, flange fit, how much'], 'pump') : oneLink(['Making formula, step by step', 'Including safe water'], 'formula');
    } else {
      if (b) breast = sstrip('Your supply settles', [['drop', 'Weeks 1–6', 'Full, often leaky'], ['heart', '6–12 weeks', 'Softer, still plenty'], ['clock', 'After', 'Makes about what he takes']])
        + doCard(c, ['Softer breasts and quicker feeds are normal. They don’t mean less milk.', nurse ? 'Keep feeding on cue. Each feed tells your body how much to make.' : 'Keep about the same total each day, even as you pump less often.', 'Drop a feed or a pump one at a time, every few days, to avoid clogged ducts.'])
        + know('Too little, or too much?', 'Diapers and growth tell you, not how full you feel. Fewer than 6 wet diapers or slow gain: feed more often and see a lactation consultant. Gulping and coughing at letdown: try a laid-back position.');
      if (bot) bottle = steps([['bottle', 'Too slow', 'Sucks hard, gets frustrated'], ['drop', 'Too fast', 'Gulps, coughs, milk spills'], ['hand', 'Just right', 'Steady sucks and swallows']], false)
        + doCard(C.lilac, ['Stay with the slowest nipple until he’s clearly frustrated.', fm ? 'Bottles are often 4–5 oz now, and stay about the same until solids.' : 'Breast milk bottles stay about 3–4 oz, even as he grows.', 'Keep pacing, and stop when he slows or turns away.']);
      link = b ? oneLink(['Going back to work', 'A pumping plan, and your rights'], 'work') : '';
    }
    const title = v === 0 ? (nurse && fm ? 'Nursing, plus formula top-ups' : nurse ? 'Get nursing off to a good start' : b ? 'Get pumping going' : 'Make and give bottles safely') : (nurse && fm ? 'Keep your milk going as you top up' : b ? 'Trust your supply as it settles' : 'Check the flow, and keep pacing');
    const lead = v === 0 ? 'The first weeks are when feeding gets set up. It takes practice, and help is easy to get.' : 'Small adjustments as he gets better at eating.';
    const combo = nurse && fm ? small('Topping up?', v === 0 ? 'nurse first, then offer a small bottle if he’s still hungry. Pumping after a top-up helps keep your milk going.' : 'keep top-ups small and nurse first, so your body keeps making milk.') : '';
    return page(head('Making feeding work', title, lead, c)
      + (b && bot && breast ? h2(nurse ? 'Nursing' : 'Pumping') : '') + breast + combo
      + (bottle ? (b ? h2(fm ? 'Formula top-ups' : 'Bottles') : '') + bottle : '')
      + knowLine(v === 0 ? '6 or more wet diapers a day by day 6, and back to birth weight by about 2 weeks.' : '6 or more wet diapers a day, and steady growth at checkups.')
      + link); };
  P.after = () => { const v = stg(), bot = isBottle(), br = isBreast() && fd() === 'Breast milk', fmOnly = fd() === 'Formula', c = C.blue;
    const poop = br ? 'Yellow and seedy' : fmOnly ? 'Tan, like peanut butter' : 'Yellow to tan';
    const vit = isBreast() ? (v === 1 && isEarly() ? 'Vitamin D every day, plus iron drops for babies born early.' : 'Vitamin D drops every day.') : 'Vitamin D drops every day, until he drinks about 32 oz a day.';
    const tough = `<div class="hub-list" style="margin-top:14px">${guideRow('pink', 'eye', 'More than this?', 'Tough feed covers reflux, worrying poop, and crying that won’t settle', 'hard')}</div>`;
    if (v === 0) return page(head('After a feed', 'Burping, spit-up and poop', 'Newborn tummies are noisy. Most of what you see after a feed is normal.', c)
      + h2('Burping')
      + steps([['heart', 'Over your shoulder', 'Pat or rub his back'], ['hand', 'Sitting on your lap', 'Support his chin and chest'], ['moon', 'Tummy-down on your lap', 'Gentle pats']], true)
      + small('When:', (bot ? 'every 2–3 oz' : 'between sides') + ', and at the end. No burp after a minute or two is fine.')
      + h2('Spit-up')
      + two(['Spit-up', 'Flows out gently. Usually less than it looks.'], ['Vomit', 'Comes out with force, sometimes across the room.', '#fdeee6', '#9a5a3c'])
      + doCard(c, ['Hold him upright for 20–30 minutes after feeds.', 'For gas, bicycle his legs or lay him tummy-down across your knees.', vit])
      + h2('Poop')
      + sstrip('The first week', [['diaper', 'Days 1–2', 'Black and sticky'], ['diaper', 'Days 3–4', 'Greenish'], ['diaper', 'By day 5', poop]])
      + small('Grunting and going red', 'while he poops is normal, as long as it’s soft.')
      + knowLine('He’s growing well and has 6 or more wet diapers a day. Then spit-up is normal, even when it looks like a lot.')
      + tough);
    return page(head('After a feed', 'Gas and spit-up may peak now', 'Both are common at this age, and both ease. Here’s what helps.', c)
      + sstrip('When it eases', [['moon', 'Fussy evenings', 'Peak around 6 weeks'], ['bottle', 'Spit-up', 'Peaks around 4 months'], ['smile', 'Gas', 'Usually eases by 3–4 months']])
      + doCard(c, ['Burp more often, and keep him upright after feeds.', 'For gas, bicycle his legs or try tummy-down across your knees.', vit])
      + small('Gas drops or gripe water?', 'gas drops are safe but often don’t help much. Ask your pediatrician before trying gripe water.')
      + small('Poop:', br ? 'some breastfed babies go a few days without one now. Soft is what matters.' : 'often once or twice a day now. Soft is what matters.')
      + knowLine('He’s growing well and is mostly content between fussy spells.')
      + tough); };
  // ---- Mock v5: Newborn told as a story, Outings' layout: a plan in order, what-ifs, good to know ----
  const tl = (title, items) => { const c = YEAR_PALETTES[CAT]; return `<figure class="hub-figure hub-daymarks oa-timeline" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}">${title ? `<b class="hub-fig-title">${F(title)}</b>` : ''}<ol class="hub-daymarks-list" style="${title ? '' : 'margin-top:0'}">${items.filter(Boolean).map(([when, icon, text]) => `<li><i>${hubArt(icon, CAT)}</i><time>${F(when)}</time><span>${F(text)}</span></li>`).join('')}</ol></figure>`; };
  const ifs = items => h2('When things don’t go to plan') + steps(items.filter(Boolean).slice(0, 4), false).replace(/hub-iconsteps is-3"/, 'hub-iconsteps is-4"');
  const goodK = rows => { const r = rows.filter(Boolean).slice(0, 3); return r.length ? H().list('Good to know', r.map(([icon, title, sub]) => H().row({ icon, cat: CAT, title, sub }))) : ''; };
  // Newborn, cleaned up. One owner per topic: numbers in the tiles; the day and the weeks in Finding your rhythm;
  // the feed itself (and your milk) in Making feeding work; burping, spit-up, gas, poop and vitamin D in After a feed.
  { const mfwOld = P.mfw; P.mfw = () => { if (stg() !== 0) return mfwOld(); const nurse = nurses(), pump = pumps(), fm = formulaFam(), b = isBreast(), bot = isBottle(), onlyP = pump && !nurse, c = C.pink;
    const title = nurse && fm ? 'Nursing, plus formula top-ups' : nurse ? 'Get nursing off to a good start' : b ? 'Get pumping going' : 'Make and give bottles safely';
    const lead = b ? 'The first weeks are when feeding gets set up. It takes practice, and help is easy to get.' : 'A few simple habits make every bottle safe and comfortable.';
    const feed = nurse ? [
        ['Start', 'eye', 'At early cues, before he cries.'],
        ['Latch', 'heart', 'Nose to nipple. Wait for a wide mouth, then bring him to you.'],
        ['When he slows', 'hand', 'Burp, then offer the other side.'],
        fm && ['Still hungry?', 'bottle', 'Offer a small formula top-up, and pace it.'],
        ['Done', 'smile', 'He lets go, relaxes his hands or drifts off.']]
      : [
        ['Start', 'eye', 'At early cues, before he cries.'],
        fm ? ['Make the bottle', 'bowl', 'Water first, then level scoops, exactly as the label says.'] : ['Get the milk ready', 'snow', 'Fresh or thawed. Warm it in water, never the microwave.'],
        ['Feed', 'bottle', 'Hold him fairly upright. Keep the bottle level and pause every few sucks.'],
        ['Done', 'smile', 'He slows, relaxes his hands or turns away. Stop, even if milk is left.'],
        onlyP && ['Then pump', 'drop', 'About as often as he feeds, 8–12 times a day.']];
    return page(head('Making feeding work', title, lead, c)
      + tl('A feed, start to finish', feed)
      + (nurse ? h2('Holds to try') + steps([['heart', 'Cross-cradle', 'Easiest for learning to latch'], ['hand', 'Football', 'Good after a C-section'], ['moon', 'Laid-back', 'Lean back, him tummy-down on you'], ['smile', 'Cradle', 'Once latching feels easy']], false) : '')
      + (bot ? h2('Giving a bottle') + steps([['bottle', 'Sit him up', 'Head higher than his tummy, never flat'], ['hand', 'Pace it', 'Bottle level, pause every few sucks'], ['heart', 'Switch sides', 'Halfway through, like at the breast']], false)
        + small('Nipple flow:', 'start with the slowest. Too slow: he sucks hard and gets frustrated. Too fast: he gulps, coughs or milk spills out.')
        + small('Which bottle?', 'there’s no best one, wide or narrow. Use one he takes well, and wash it in hot, soapy water after every feed.') : '')
      + (b ? tl('Your milk, the first week', [['Days 1–2', 'drop', 'Small amounts of colostrum. It’s all he needs.'], ['Days 2–5', 'heart', 'Your milk comes in. Full, tender breasts are normal.'], ['After that', 'clock', 'Breasts feel softer after feeds. That’s a good sign.']]) : '')
      + ifs([
        nurse && ['heart', 'Nursing hurts', 'Break the seal with a clean finger and try again. Pain through the whole feed: see a lactation consultant.'],
        b && ['drop', 'You’re very full', (nurse ? 'Nurse or hand-express' : 'Pump') + ' a little, then use a cold pack.'],
        onlyP && ['drop', 'Pumping hurts', 'Check the flange: your nipple should move freely without rubbing.'],
        bot && ['bottle', 'He gulps or sputters', 'Tip the bottle lower, pause more, or try a slower nipple.'],
        !b && ['smile', 'He doesn’t finish the bottle', 'That’s fine. Follow his cues rather than the number.']])
      + goodK([
        !b ? ['bowl', 'Safe water', 'Ask your pediatrician whether to boil water for formula in the first months.'] : null,
        nurse && fm ? ['heart', 'Protect your milk', 'Pumping after a top-up keeps your supply going.'] : null,
        bot ? ['snow', 'How long it lasts', fm ? 'Use a formula bottle within 2 hours, or 1 hour once he starts.' : 'Breast milk keeps 4 hours out and 4 days in the fridge.'] : null,
        b ? ['hand', 'Help is covered', 'Most insurance covers a lactation consultant.'] : null])
      + h2('Show me how') + alist([
        nurse && guideRow('lilac', 'heart', 'Latch and holds', 'Step by step, with a video', 'latch'),
        pump && guideRow('lilac', 'drop', 'Pumping', 'How often, flange fit, how much', 'pump'),
        nurse && !bot && guideRow('lilac', 'bottle', 'A first bottle', 'When and how, for nursing families', 'firstbottle'),
        fm && guideRow('lilac', 'bowl', 'Making formula', 'Step by step, and safe water', 'formula'),
        bot && guideRow('lilac', 'bottle', 'Giving a bottle', 'Positions, pacing and nipple flow, in pictures', 'bottle'),
        bot && guideRow('lilac', 'snow', 'Storing and warming milk', 'How long it lasts, warming, and travel', 'basics')].filter(Boolean))); }; }
  { const afterOld = P.after; P.after = () => { if (stg() !== 0) return afterOld(); const bot = isBottle(), br = isBreast() && fd() === 'Breast milk', fmOnly = fd() === 'Formula', c = C.blue;
    const poop = br ? 'Yellow and seedy' : fmOnly ? 'Tan, like peanut butter' : 'Yellow to tan';
    return page(head('After a feed', 'Burping, spit-up and poop', 'Newborn tummies are noisy. Most of what you see after a feed is normal.', c)
      + tl('After every feed', [
        ['Burp', 'hand', (isBreast() ? 'Between sides' : 'Every 2–3 oz') + ' and at the end: over your shoulder, sitting up, or tummy-down on your lap.'],
        ['Hold upright', 'clock', 'For 20–30 minutes.'],
        ['Spit-up', 'bottle', 'A little flows out gently, and it’s usually less than it looks. Vomit comes out with force.']])
      + sstrip('Poop, the first week', [['diaper', 'Days 1–2', 'Black and sticky'], ['diaper', 'Days 3–4', 'Greenish'], ['diaper', 'By day 5', poop]])
      + ifs([
        ['bottle', 'Lots of spit-up', 'If he’s growing and has plenty of wet diapers, it’s normal.'],
        ['drop', 'Gas', 'Bicycle his legs, or lay him tummy-down across your knees.'],
        ['diaper', 'Grunting and going red', 'Normal while he poops, as long as it’s soft.'],
        ['heart', 'Hiccups', 'Common and harmless. They stop on their own.']])
      + goodK([['drop', 'Vitamin D', isBreast() ? 'Drops every day, from the first days.' : 'Drops every day, until he drinks about 32 oz a day.']])
      + `<div class="hub-list" style="margin-top:14px">${guideRow('pink', 'eye', 'More than this?', 'Spit-up with arching, worrying poop, crying that won’t settle', 'hard')}</div>`); }; }
  { const feedsOld = P.feeds; P.feeds = () => { if (stg() !== 0) return feedsOld(); const nurse = nurses(), c = C.peach;
    return page(head('Finding your rhythm', 'Feed often, and follow his cues', nurse ? 'Feeding often is how he grows, and how your milk gets going.' : 'Small, frequent feeds are how newborns eat.', c)
      + tl('A newborn day', [
        ['Day', 'eye', 'Feed at early cues: rooting, hands to mouth. Crying is a late cue, so calm him first.'],
        ['Sleepy spells', 'moon', 'Until he’s back to birth weight, wake him if it’s been about 3 hours.'],
        ['Evening', 'clock', 'Often nonstop feeds for a few hours. That’s cluster feeding, and it’s normal.'],
        ['Night', 'moon', 'Feeds keep going. Keep it dim and quiet.']])
      + tl('The first 6 weeks', [
        ['About 2 weeks', 'smile', 'Back to birth weight. Ask your pediatrician when you can stop waking him.'],
        ['Weeks 2–3', 'clock', 'A few extra-hungry days. Feed more often, and it passes.'],
        ['Around 6 weeks', 'moon', 'Fussy evenings often peak, then feeds get quicker and easier.']])
      + ifs([
        ['moon', 'Too sleepy to feed', 'Undress him to his diaper, or stroke his feet.'],
        ['eye', 'Not sure he’s hungry', 'If in doubt, offer a feed. Stop when he slows or turns away.'],
        ['heart', 'Cluster evenings wear you out', 'Someone else can burp, change and settle him between feeds.'],
        ['clock', 'Days and nights mixed up', 'Bright light and play by day. Dim and quiet at night.']])
      + goodK([['notepad', 'Tracking', 'A quick note of feeds and wet diapers helps in the first weeks. Stop when feeding feels settled.']])); }; }
  // ---- Newborn v7 (after Yarden's review): one page per job, pictures not icons, no sub-pages, Tough feed answers in place ----
  const ILL = (() => { const skin = '#f1d3bd', hair = '#5b4636', bskin = '#f7dfcf';
    const torso = c => `<path d="M34 120 C34 84 48 66 70 66 C92 66 106 84 106 120 Z" fill="${c.bg}"/>`;
    const headN = (x, y) => `<rect x="${x - 6}" y="${y + 12}" width="12" height="14" rx="5" fill="${skin}"/><circle cx="${x}" cy="${y}" r="16" fill="${skin}"/><path d="M${x - 16} ${y} C${x - 16} ${y - 19} ${x + 17} ${y - 21} ${x + 17} ${y - 1} C${x + 13} ${y - 9} ${x} ${y - 12} ${x - 9} ${y - 7} C${x - 13} ${y - 5} ${x - 15} ${y - 2} ${x - 16} ${y} Z" fill="${hair}"/>`;
    const babyB = (c, x, y, rot, side) => { const h = side === 'L' ? -19 : 19; return `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse cx="${-h * 0.2}" cy="1" rx="21" ry="11" fill="${c.accent}"/><circle cx="${h}" cy="-1" r="10" fill="${bskin}" stroke="${c.ink}" stroke-opacity=".18"/><path d="M${h - 8} -6 C${h - 5} -12 ${h + 5} -12 ${h + 8} -6" fill="none" stroke="${hair}" stroke-width="2.2" stroke-linecap="round"/></g>`; };
    const upBaby = (c, x, y) => `<ellipse cx="${x}" cy="${y + 24}" rx="11" ry="18" fill="${c.accent}"/><circle cx="${x}" cy="${y}" r="10" fill="${bskin}" stroke="${c.ink}" stroke-opacity=".18"/><path d="M${x - 8} ${y - 5} C${x - 5} ${y - 11} ${x + 5} ${y - 11} ${x + 8} ${y - 5}" fill="none" stroke="${hair}" stroke-width="2.2" stroke-linecap="round"/>`;
    const arm = d => `<path d="${d}" fill="none" stroke="${skin}" stroke-width="10" stroke-linecap="round"/>`, hand = (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="${skin}"/>`;
    const bottleG = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-6" y="-14" width="12" height="22" rx="4" fill="#fff" stroke="#b9a8b0"/><rect x="-6" y="-2" width="12" height="10" rx="2" fill="#f3ead9"/><path d="M-4 -14 L-2 -21 L2 -21 L4 -14 Z" fill="#e6c9a8"/></g>`;
    const frame = (c, inner) => `<svg viewBox="0 0 140 120" aria-hidden="true">${`<rect width="140" height="120" rx="16" fill="${c.pale}"/>`}${inner}</svg>`;
    return {
      crossCradle: c => frame(c, torso(c) + headN(70, 34) + babyB(c, 68, 88, 0, 'R') + arm('M40 96 C52 106 74 104 84 92') + hand(86, 88)),
      cradle: c => frame(c, torso(c) + headN(70, 34) + babyB(c, 72, 88, 0, 'L') + arm('M48 86 C46 102 70 106 100 96')),
      football: c => frame(c, torso(c) + headN(64, 34) + babyB(c, 104, 86, 0, 'L') + arm('M100 74 C122 80 124 100 92 98') + hand(88, 86)),
      laidBack: c => frame(c, `<rect x="4" y="30" width="44" height="80" rx="18" fill="#fff" opacity=".7" transform="rotate(-28 26 70)"/><path d="M18 82 C30 62 58 58 86 74 C108 86 124 104 130 120 L12 120 Z" fill="${c.bg}"/><rect x="30" y="54" width="12" height="16" rx="5" fill="${skin}" transform="rotate(-40 36 62)"/><circle cx="30" cy="46" r="15" fill="${skin}"/><path d="M15 46 C14 28 44 26 45 44 C41 37 30 33 22 38 Z" fill="${hair}"/>` + babyB(c, 74, 80, 22, 'L')),
      cradled: c => frame(c, torso(c) + headN(70, 34) + babyB(c, 66, 84, -28, 'R') + arm('M42 98 C52 108 80 100 84 82') + bottleG(100, 72, -80)),
      upright: c => frame(c, torso(c) + headN(56, 34) + upBaby(c, 96, 62) + arm('M76 82 C84 84 88 76 90 70') + bottleG(114, 64, -80)),
      shoulder: c => frame(c, torso(c) + headN(66, 34) + upBaby(c, 90, 56) + hand(96, 82)),
      sitting: c => frame(c, torso(c) + headN(56, 34) + upBaby(c, 96, 64) + arm('M74 84 C82 82 86 80 88 78') + hand(110, 86)),
      tummy: c => frame(c, torso(c) + headN(70, 34) + `<path d="M36 104 L104 104 L104 118 L36 118 Z" fill="${c.bg}"/>` + babyB(c, 72, 96, 0, 'L') + hand(80, 86)),
      poop: col => `<svg viewBox="0 0 80 56" aria-hidden="true"><rect width="80" height="56" rx="14" fill="#f6f1ec"/><path d="M18 44 C14 32 26 26 32 28 C32 18 46 16 50 26 C60 26 66 36 60 44 Z" fill="${col}"/></svg>`
    }; })();
  const PAL = { ink: '#884866', bg: '#f7d9e5', pale: '#fceef3', accent: '#d5a4b8' }, PALB = { ink: '#625084', bg: '#e5e0fc', pale: '#efedff', accent: '#b4a5dc' }, PALT = { ink: '#46638c', bg: '#d9e5fc', pale: '#edf2fe', accent: '#9fb8df' };
  const illCss = `<style>#main .fd-ill{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 14px}#main .fd-ill figure{margin:0;background:var(--card,#fff);border:1px solid var(--line,#eee);border-radius:18px;padding:8px 8px 12px}#main .fd-ill svg{width:100%;height:auto;display:block}#main .fd-ill b{display:block;font-size:15px;line-height:1.3;margin:8px 4px 2px}#main .fd-ill small{display:block;font-size:13px;line-height:1.4;color:var(--muted,#776);margin:0 4px}#main .fd-ill.is-3{grid-template-columns:1fr 1fr 1fr}#main .fd-ill.is-3 b{font-size:14px}
  #main .fd-acc{background:var(--card,#fff);border:1px solid var(--line,#eee);border-radius:18px;margin:0 0 8px;overflow:hidden}#main .fd-acc summary{list-style:none;display:flex;gap:12px;align-items:center;padding:14px 16px;cursor:pointer}#main .fd-acc summary::-webkit-details-marker{display:none}#main .fd-acc summary .fd-acc-ico{width:38px;height:38px;border-radius:12px;background:#fceef3;color:#884866;display:grid;place-items:center;padding:8px;box-sizing:border-box;flex:none}#main .fd-acc summary span b{display:block;font-size:15.5px}#main .fd-acc summary span small{display:block;font-size:13px;color:var(--muted,#776)}#main .fd-acc summary::after{content:'+';margin-left:auto;font-size:20px;color:#884866}#main .fd-acc[open] summary::after{content:'–'}#main .fd-acc-body{padding:0 16px 14px 66px;font-size:14.5px;line-height:1.5}#main .fd-acc-body p{margin:0 0 8px}#main .fd-acc-call{background:#fbf3ee;border-radius:12px;padding:8px 10px;font-size:13.5px}#main .fd-acc-call b{color:#9a5a3c}#main .fd-acc-call.is-now b{color:#a33a3a}</style>`;
  const illGrid = (items) => illCss + `<div class="fd-ill is-${items.filter(Boolean).length}">${items.filter(Boolean).map(([svg, t, s]) => `<figure>${svg}<b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}</figure>`).join('')}</div>`;
  const storeTiles = (fmOnlyBottle) => fmOnlyBottle
    ? H().tiles([['Out of the fridge', '2 hours', 'From when you make it'], ['Once he starts', '1 hour', 'Then toss what’s left'], ['Made ahead', '24 hours', 'In the fridge']])
    : H().tiles([['On the counter', '4 hours', 'Fresh breast milk'], ['In the fridge', '4 days', 'At the back, not the door'], ['In the freezer', '6 months', 'Best within 6, fine up to 12']]);
  P.nurse0 = () => { const fm = formulaFam(), c = C.pink;
    return page(head('Nursing', 'Get nursing off to a good start', 'It takes practice for both of you. Most problems are fixable with a little help.', c)
      + tl('A nursing feed, start to finish', [
        ['Start', 'eye', 'At early cues, before he cries.'],
        ['Latch', 'heart', 'Nose to nipple. Wait for a wide mouth, then bring him to you, chin first.'],
        ['When he slows', 'hand', 'Often after 10–20 minutes. Burp, then offer the other side.'],
        fm && ['Still hungry?', 'bottle', 'Offer a small formula top-up. More on Formula top-ups.'],
        ['Done', 'smile', 'He lets go, relaxes his hands or drifts off.']])
      + h2('Holds to try') + illGrid([[ILL.crossCradle(PAL), 'Cross-cradle', 'Easiest for learning to latch'], [ILL.football(PAL), 'Football', 'Good after a C-section'], [ILL.laidBack(PAL), 'Laid-back', 'Lean back, him tummy-down on you'], [ILL.cradle(PAL), 'Cradle', 'Once latching feels easy']])
      + h2('A good latch, step by step') + hubEmbed('y--syZR0u1E', 'A good latch, step by step', 'Global Health Media')
      + sstrip('Your milk, the first week', [['drop', 'Days 1–2', 'Colostrum. It’s all he needs'], ['heart', 'Days 2–5', 'Milk comes in. Full, tender'], ['clock', 'After that', 'Softer after feeds. A good sign']])
      + ifs([
        ['heart', 'Nursing hurts', 'Break the seal with a clean finger and try again. Pain through the whole feed: see a lactation consultant.'],
        ['drop', 'You’re very full', 'Nurse or hand-express a little, then use a cold pack.'],
        ['eye', 'It keeps hurting, even with help', 'Ask to have his mouth checked for tongue-tie.']])
      + goodK([fm ? ['heart', 'Protect your milk', 'Nurse first, and pump after a top-up when you can.'] : !isBottle() ? ['bottle', 'A first bottle', 'Around 3–4 weeks, once nursing is going well. Someone else can offer it.'] : null, ['bowl', 'Food and drink', 'No special diet needed. Coffee in moderation is usually fine.'], ['hand', 'Help is covered', 'Most insurance covers a lactation consultant.']])); };
  P.pump0 = () => { const c = C.pink;
    return page(head('Pumping', 'Get pumping going', 'Pumping often in the first weeks tells your body how much milk to make.', c)
      + tl('A pumping day', [['Every 2–3 hours', 'drop', 'Pump 8–12 times a day, including once at night.'], ['Each time', 'clock', 'About 15–20 minutes, or until milk slows.'], ['After', 'snow', 'Label it with the date, then fridge or freezer.']])
      + sstrip('Your milk, the first week', [['drop', 'Days 1–2', 'Drops of colostrum'], ['heart', 'Days 2–5', 'Milk comes in'], ['clock', 'After that', 'Amounts grow day by day']])
      + h2('How long it lasts') + storeTiles(false)
      + ifs([['drop', 'Pumping hurts', 'Check the flange: your nipple should move freely without rubbing.'], ['eye', 'Only drops at first', 'Normal in the first days. It grows as you keep pumping often.'], ['heart', 'You’re very full', 'Pump a little, then use a cold pack.']])
      + goodK([['hand', 'Help is covered', 'Most insurance covers a lactation consultant, including for pumping.'], ['notepad', 'Pumping at work', 'You have the right to break time and a private space that isn’t a bathroom.']])); };
  P.bottle0 = () => { const nurse = nurses(), fm = formulaFam(), b = isBreast(), onlyP = pumps() && !nurse, c = C.lilac;
    const label = nurse && fm ? 'Formula top-ups' : 'Bottles', title = nurse && fm ? 'Small bottles after nursing' : fm ? 'Make and give bottles safely' : 'Give your milk by bottle';
    const lead = nurse && fm ? 'A top-up is a small bottle after nursing, for when he’s still hungry. The same habits keep it safe and calm.' : 'A few simple habits make every bottle safe and comfortable.';
    return page(head(label, title, lead, c)
      + (fm ? h2('Making a bottle') + steps([['hand', 'Wash your hands', 'And use a clean bottle'], ['drop', 'Water first', 'Then level scoops'], ['bowl', 'Exactly as the label says', 'Never extra water or powder'], ['hand', 'Test on your wrist', 'Room temperature is fine. Never the microwave']], true)
        + small('Which formula?', 'any standard, iron-fortified infant formula is fine. Ask your pediatrician before a special one.')
        : h2('Getting it ready') + steps([['snow', 'Thaw in the fridge', 'Or in warm water'], ['drop', 'Swirl, don’t shake', 'Never the microwave'], ['hand', 'Test on your wrist', 'Cold is fine too']], true))
      + h2('Holding the bottle') + illGrid([[ILL.cradled(PALB), 'Cradled, sitting up', 'Head higher than his tummy'], [ILL.upright(PALB), 'Upright on your lap', 'Good for slowing a fast eater']])
      + small('Pace it:', 'keep the bottle fairly level, pause every few sucks, and switch sides halfway. Stop when he slows or turns away, even if milk is left.')
      + h2('Nipple flow') + two(['Too slow', 'He sucks hard, gets frustrated, and the nipple flattens.'], ['Too fast', 'He gulps, coughs, or milk spills out. Try a slower nipple.', '#fdeee6', '#9a5a3c'])
      + small('Start with the slowest.', 'Go up only when he’s clearly frustrated.')
      + (onlyP ? '' : h2('How long it lasts') + storeTiles(fm && !b))
      + ifs([fm || onlyP ? ['smile', 'He doesn’t finish', 'That’s fine. Follow his cues rather than the number.'] : null, nurse ? ['bottle', 'He won’t take a bottle', 'Try before he’s very hungry, with someone else offering it.'] : null, ['moon', 'Night feeds', 'Make bottles fresh, or keep made ones in the fridge for up to 24 hours.'].slice(0, fm ? 3 : 0)].filter(x => x && x.length))
      + goodK([['bottle', 'Which bottle?', 'There’s no best one, wide or narrow. Use one he takes well, and wash it in hot, soapy water after every feed.'], fm ? ['bowl', 'Safe water', 'Ask your pediatrician whether to boil water for formula in the first months.'] : null, fm ? ['snow', 'Out and about', 'For travel, ready-to-feed formula needs no mixing or water.'] : ['snow', 'Out and about', 'For travel, a cooler bag with ice packs keeps breast milk for up to 24 hours.']])); };
  P.after = (old => () => { if (stg() !== 0) return old(); const br = isBreast() && fd() === 'Breast milk', fmOnly = fd() === 'Formula', c = C.blue;
    return page(head('After a feed', 'Burping, spit-up and poop', 'Newborn tummies are noisy. Most of what you see after a feed is normal.', c)
      + h2('Burping') + illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'Pat or rub his back'], [ILL.sitting(PALT), 'Sitting on your lap', 'Support his chin and chest'], [ILL.tummy(PALT), 'Tummy-down on your lap', 'Gentle pats']])
      + small('When:', (isBreast() ? 'between sides' : 'every 2–3 oz') + ' and at the end. No burp after a minute or two is fine.')
      + h2('Spit-up') + two(['Spit-up', 'Flows out gently. Usually less than it looks.'], ['Vomit', 'Comes out with force, sometimes across the room.', '#fdeee6', '#9a5a3c'])
      + small('Hold him upright', 'for 20–30 minutes after feeds. It helps.')
      + h2('Poop, the first week') + illGrid([[ILL.poop('#2b2622'), 'Days 1–2', 'Black and sticky'], [ILL.poop('#5f6b33'), 'Days 3–4', 'Greenish'], [ILL.poop(br ? '#d4a23a' : fmOnly ? '#b98a4e' : '#c99642'), 'By day 5', br ? 'Yellow and seedy' : fmOnly ? 'Tan, like peanut butter' : 'Yellow to tan']])
      + ifs([['bottle', 'Lots of spit-up', 'If he’s growing and has plenty of wet diapers, it’s normal.'], ['drop', 'Gas', 'Bicycle his legs, or tummy-down across your knees. Ask before trying gripe water.'], ['diaper', 'Grunting and going red', 'Normal while he poops, as long as it’s soft.'], ['heart', 'Hiccups', 'Common and harmless. They stop on their own.']])
      + goodK([['drop', isEarly() && isBreast() ? 'Vitamin D and iron' : 'Vitamin D', isEarly() && isBreast() ? 'Vitamin D drops every day. Babies born early who get breast milk start iron drops at about 1 month. Follow your care team’s dose.' : isBreast() ? 'Drops every day, from the first days.' : 'Drops every day, until he drinks about 32 oz a day.']])); })(P.after);
  P.feeds = (old => () => { if (stg() !== 0) return old(); const nurse = nurses(), c = C.peach;
    const dayHtml = (P.day() || ''), k = dayHtml.indexOf('<div class="hub-card" style="padding:14px 14px 8px">'), e = k >= 0 ? dayHtml.indexOf('<figure', k) : -1, ribbon = k >= 0 && e > k ? dayHtml.slice(k, e) : '';
    return page(head('Finding your rhythm', 'Feed often, and follow his cues', nurse ? 'Feeding often is how he grows, and how your milk gets going.' : 'Small, frequent feeds are how newborns eat.', c)
      + h2('A newborn day') + ribbon
      + small('Evenings:', 'feeds often bunch together for a few hours. That’s cluster feeding, and it’s normal.')
      + cueStrip()
      + hubAgeTiles({ title: 'Coming up in the next few weeks', items: [['About 2 weeks', 'Birth weight', 'Back to it. Ask when you can stop waking him'], ['Weeks 2–3', 'A growth spurt', 'A few extra-hungry days'], ['Around 6 weeks', 'Fussy evenings peak', 'Then feeds get easier']], cat: CAT })
      + ifs([['moon', 'Too sleepy to feed', 'Undress him to his diaper, or stroke his feet. Wake him if it’s been about 3 hours.'], ['heart', 'Cluster evenings wear you out', 'Someone else can burp, change and settle him between feeds.'], ['clock', 'Days and nights mixed up', 'Bright light and play by day. Dim and quiet at night.'], ['eye', 'Not sure he’s hungry', 'If in doubt, offer a feed. Stop when he slows or turns away.']])
      + goodK([['notepad', 'Tracking', 'A quick note of feeds and wet diapers helps in the first weeks. Stop when feeding feels settled.']])); })(P.feeds);
  // Tough feed, Newborn: answers open in place. No sub-pages.
  P.hard = (old => () => { if (stg() !== 0) return old(); const nurse = nurses(), fm = formulaFam(), br = isBreast(), bot = isBottle();
    const acc = ([icon, t, sub, body, callT, nowT]) => `<details class="fd-acc"><summary><span class="fd-acc-ico">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b><small>${F(sub)}</small></span></summary><div class="fd-acc-body"><p>${F(body)}</p>${callT ? `<p class="fd-acc-call"><b>${F('Call your pediatrician:')}</b> ${F(callT)}</p>` : ''}${nowT ? `<p class="fd-acc-call is-now"><b>${F('Call right away:')}</b> ${F(nowT)}</p>` : ''}</div></details>`;
    const grp = (t, xs) => { const r = xs.filter(Boolean); return r.length ? h2(t) + r.map(acc).join('') : ''; };
    return page(head('Feeding', 'Tough feed?', 'Tap what’s happening. The answer opens right here.')
      + illCss
      + grp('Feeding', [
        ['moon', 'Too sleepy to feed', 'How to wake him', 'Undress him to his diaper, stroke his feet, or change his diaper mid-feed. Until he’s back to birth weight, wake him after about 3 hours.', 'He’s too sleepy to feed most times.', 'He’s very hard to wake, or yellow skin is spreading.'],
        ['heart', 'Fussy or pulling off at feeds', 'Too hungry, too fast, or full', 'Feed at early cues, before he’s upset. Burp, then try again. ' + (bot ? 'Try a slower nipple or pace the bottle more.' : 'If milk gushes, try leaning back.'), 'He refuses several feeds in a row, or fusses at every feed and isn’t gaining.', ''],
        ['diaper', 'Not eating much', 'How to tell if it’s okay', 'Diapers and weight tell you more than minutes or ounces. Offer feeds often, and get the ' + (br ? 'latch' : 'bottle') + ' checked.', 'Fewer than 6 wet diapers a day after day 6, or not back to birth weight by 2 weeks.', ''],
        fm && ['bottle', 'Is it the formula?', 'Before you switch', 'Fussing, gas and spit-up happen on any formula. Most babies don’t need a switch. Ask your pediatrician before changing.', 'Blood in his poop, a rash, vomiting after most feeds, or slow weight gain.', '']])
      + grp('Tummy', [
        ['bottle', 'Spit-up that seems like too much', 'With arching, or slow weight gain', 'Offer smaller feeds more often, burp more, and hold him upright after feeds. Ask before thickening feeds or switching formula.', 'He cries or arches with most feeds, refuses feeds, or isn’t gaining weight.', 'Green or bloody vomit, or vomiting with a fever.'],
        ['drop', 'Crying he can’t settle from', 'What to try, in order', 'Check for hunger, a burp or a diaper. Then swaddle, rock, shush or try white noise. If you’re at your limit, put him down on his back somewhere safe and step away for a few minutes. Never shake him.', 'Crying for 3 or more hours a day, crying that sounds different, or crying with vomiting.', 'A fever of 100.4°F (38°C) or higher.'],
        ['diaper', 'Poop that looks off', 'The colors and changes to call about', 'Green, mustard, seedy or a little mucus are all normal.', 'Hard, pebble-like poop, or watery poop much more often with fewer wet diapers.', 'White, gray or very pale poop, or red or black poop after the first few days.']])
      + grp('When he’s unwell', [['eye', 'Sick, or a stuffy nose', 'Feeding when he’s unwell', 'Offer smaller feeds more often. Saline drops and gentle suction before feeds help a stuffy nose.', 'Fewer wet diapers, or he isn’t feeding well.', 'Any fever of 100.4°F (38°C) or higher in the first 3 months.']])
      + (br ? grp('For you', [
        nurse && ['heart', 'Nursing still hurts', 'Cracked nipples, or pain through the feed', 'Pain through the feed usually means a shallow latch. Break the seal and try again, try cross-cradle, and see a lactation consultant.', 'Bleeding nipples, or pain that isn’t easing.', ''],
        ['heart', 'A tender lump in your breast', 'Often a clogged duct', 'Keep feeding or pumping as usual. Use a cold pack, and skip deep massage.', '', 'A red, painful area with a fever or chills. Call your own doctor.']]) : '')
      + h2('You don’t have to figure this out alone')
      + know('Who can help', (br ? 'A lactation consultant for latch, pain and supply. ' : '') + 'Your pediatrician for weight and feeds. Most insurance covers both.')
      + know('How are you doing?', 'Hard feeds wear on your mood. If you feel low, anxious or overwhelmed most days, tell your doctor. You can call or text the National Maternal Mental Health Hotline any time at 1-833-852-6262.')); })(P.hard);
  // ---- Newborn v8 (Yarden's mock, Nov 5): four subject pages with toggles at the top. Nothing is a sub-page. ----
  HEADART['Feeding basics & rhythms'] = () => ART.often(5); HEADART['Bottle feeding'] = () => ART.bottle(.55); HEADART['Digestion & comfort'] = () => ART.bottle(.45);
  const tabCss = `<style>#main .fd-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:2px -2px 18px;padding:2px;scrollbar-width:none}#main .fd-tabs::-webkit-scrollbar{display:none}#main .fd-tabs button{flex:none;border:1px solid var(--line,#e8e0da);background:var(--card,#fff);color:var(--ink,#2b2840);border-radius:999px;padding:7px 12px;font:inherit;font-size:13.5px;cursor:pointer}${[0, 1, 2, 3, 4].map(i => `#main .fd-tabbed[data-on="${i}"] .fd-tabs button[data-i="${i}"]{background:var(--tab-on,#c46b8e);border-color:var(--tab-on,#c46b8e);color:#fff}#main .fd-tabbed[data-on="${i}"] .fd-panel:not([data-i="${i}"])`).join('{display:none}')}{display:none}#main .fd-check{list-style:none;margin:0 0 16px;padding:12px 16px;background:var(--card,#fff);border:1px solid var(--line,#eee);border-radius:18px}#main .fd-check li{position:relative;padding:5px 0 5px 26px;font-size:14.5px;line-height:1.45}#main .fd-check li::before{content:'✓';position:absolute;left:2px;top:4px;color:#3f8a5f;font-weight:700}#main .fd-medhelp{margin:16px 0 8px;padding:14px 16px;border-radius:18px;background:#fbe9e9}#main .fd-medhelp b{display:block;color:#a33a3a;margin:0 0 4px}#main .fd-medhelp p{margin:0 0 6px;font-size:14px;line-height:1.45}</style>`;
  // The one-line takeaway at the top of each tab, so a skimming parent gets the answer in seconds.
  const answer = t => `<p class="fd-answer">${F(t)}</p>`;
  const babyDays = () => Math.max(0, Math.floor(ageMo() * 30.44));
  const tabbed = (on, tabs) => { const t = tabs.filter(Boolean); return tabCss + illCss + irowsCss + `<div class="fd-tabbed" data-on="0" style="--tab-on:${on}"><div class="fd-tabs" role="tablist">${t.map(([label], i) => `<button data-i="${i}" role="tab" onclick="this.closest('.fd-tabbed').dataset.on='${i}'">${F(label)}</button>`).join('')}</div>${t.map(([, html], i) => `<section class="fd-panel" data-i="${i}">${html}</section>`).join('')}</div>`; };
  // Answers with 3+ lines show as icon rows, so each idea stands on its own.
  const accIcon = t => /flange|pump|milk catcher|express|leak|drop|nursing pad/i.test(t) ? 'drop' : /suction|squeeze|massage|press|stroke|hand/i.test(t) ? 'hand' : /balm|oil|soothe|warm/i.test(t) ? 'heart' : /shirt|shell|cover|bra\b|bra /i.test(t) ? 'shield' : /cold|ice|freez/i.test(t) ? 'snow' : /doctor|consultant|pediatrician|call/i.test(t) ? 'steth' : /sleep|night|doze/i.test(t) ? 'moon' : /minute|day|week|slow|every|wait|time/i.test(t) ? 'clock' : /diaper|poop/i.test(t) ? 'diaper' : /weight|gain|swallow|lips|look|see|spot|white|pink|patch/i.test(t) ? 'eye' : /mood|feel/i.test(t) ? 'smile' : 'heart';
  // Swipeable cards for side-by-side options. Each card draws a day of sessions as bars.
  const carArt = k => { const bars = { shorten: [[0,26],[1,22],[2,17],[3,12]], space: [[0,18],[1.4,18],[3,18],[4.8,18]], drop: [[0,18],[1,18],[2,18,1],[3,18]] }[k] || [];
    return `<svg viewBox="0 0 120 40" aria-hidden="true">${bars.map(([x,h,gone]) => `<rect x="${8 + x * 26}" y="${34 - h}" width="16" height="${h}" rx="4" fill="${gone ? 'none' : '#e7a9c1'}" stroke="${gone ? '#d39ab2' : 'none'}" stroke-dasharray="3 3"/>`).join('')}<line x1="4" y1="35" x2="116" y2="35" stroke="#e8dde2" stroke-width="1.5"/></svg>`; };
  const carousel = items => `<div class="fd-car" role="list">${items.map(([k, t, d], i) => `<div class="fd-car-card" role="listitem"><div class="fd-car-art">${carArt(k)}</div><span class="fd-car-n">${i + 1} of ${items.length}</span><strong>${F(t)}</strong><p>${F(d)}</p></div>`).join('')}</div><p class="fd-car-hint">Swipe to see all ${items.length}</p>`;
  // Answer bodies: '~' lines are a plain lead, {car} is a carousel, {html} is a ready-made block,
  // and 3+ tips show as icon rows so each idea stands on its own.
  const accBody = body => { const xs = [].concat(body).filter(Boolean), tips = xs.filter(x => typeof x === 'string' && x[0] !== '~').length, out = []; let run = [];
    const flush = () => { if (run.length) out.push(`<ul class="fd-dots">${run.join('')}</ul>`); run = []; };
    xs.forEach(x => { if (typeof x !== 'string') { flush(); out.push(x.car ? carousel(x.car) : x.html); }
      else if (x[0] === '~') { flush(); out.push(`<p class="fd-acc-lead">${F(x.slice(1))}</p>`); }
      else if (tips >= 2) run.push(`<li>${F(x.replace(/^[a-z]+\|/, ''))}</li>`);
      else out.push(`<p>${F(x.replace(/^[a-z]+\|/, ''))}</p>`); });
    flush(); return out.join(''); };
  const irowsCss = `<style>#main .fd-irows{list-style:none;margin:0;padding:0;display:grid;gap:10px}#main .fd-irows li{display:flex;gap:10px;align-items:flex-start;font-size:14.5px;line-height:1.45}#main .fd-irows-ico{flex:none;width:28px;height:28px;border-radius:9px;background:#fceef3;color:#884866;display:grid;place-items:center;padding:6px;box-sizing:border-box;margin-top:-2px}#main .fd-irows-lead{color:var(--muted,#776)}#main .fd-acc-body:has(.fd-irows){padding-left:16px}#main .fd-acc-body .hub-figure{border:0;background:none;box-shadow:none;padding:0;margin:4px 0 12px}#main .hub-detail[data-ss] .fd-acc-body .hub-tip{background:none;border:0;box-shadow:none;padding:0;margin:0}#main .fd-acc-body .hub-tip p{margin:0;font-size:14px;line-height:1.45}#main .fd-acc-body .fm-two{margin:0 0 12px}#main .fd-answer{margin:2px 2px 16px;font-size:16.5px;line-height:1.45;font-weight:600;color:var(--ink,#2b2840);text-wrap:pretty}#main .fd-dots{margin:0 0 4px;padding-left:20px;display:grid;gap:8px;font-size:14.5px;line-height:1.45}#main .fd-dots li::marker{color:#c46b8e}#main .fd-acc-lead{margin:0 0 10px;font-size:14.5px;line-height:1.45}#main .fd-acc-body .hub-tiles{margin:0}#main .fd-do{background:#fcf1f5;border-radius:14px;padding:10px 14px;margin:0 0 10px}#main .fd-do b{display:block;font-size:13px;color:#884866;margin-bottom:4px}#main .fd-do ul{margin:0;padding-left:18px;display:grid;gap:4px;font-size:14.5px;line-height:1.4}#main .fd-help{margin:0;font-size:14px;line-height:1.4}#main .fd-help b{display:block;font-size:13px;color:#884866;margin-bottom:2px}#main .fd-car{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;margin:4px -16px 0;padding:2px 16px 6px;scrollbar-width:none}#main .fd-car::-webkit-scrollbar{display:none}#main .fd-car-card{flex:0 0 72%;scroll-snap-align:start;background:#fcf4f7;border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:4px;box-sizing:border-box}#main .fd-car-art svg{width:100%;height:auto;display:block;margin-bottom:4px}#main .fd-car-n{font-size:12px;color:#9a7d8b}#main .fd-car-card strong{font-size:15.5px}#main .fd-car-card p{margin:0;font-size:14px;line-height:1.4}#main .fd-car-hint{font-size:12.5px;color:#9a7d8b;margin:2px 0 0}</style>`;
  const CALLS = { soon: [], now: [] };
  const accItem = ([icon, t, sub, body, callT, nowT]) => { if (callT) CALLS.soon.push(callT); if (nowT) CALLS.now.push(nowT); return `<details class="fd-acc"><summary>${icon ? `<span class="fd-acc-ico">${hubArt(icon, CAT)}</span>` : ''}<span><b>${F(t)}</b><small>${F(sub)}</small></span></summary><div class="fd-acc-body">${accBody(body)}</div></details>`; };
  const callFold = () => { const u = a => [...new Set(a)]; const soon = u(CALLS.soon), now = u(CALLS.now); CALLS.soon = []; CALLS.now = []; if (!soon.length && !now.length) return '';
    const li = xs => `<ul style="margin:4px 0 10px;padding-left:18px">${xs.map(x => `<li style="margin:0 0 4px">${F(x)}</li>`).join('')}</ul>`;
    return `<details class="fd-acc" style="margin-top:22px"><summary><span class="fd-acc-ico">${hubArt('steth', CAT)}</span><span><b>${F('When to call')}</b><small>${F('Signs to check in with your pediatrician')}</small></span></summary><div class="fd-acc-body" style="padding-left:16px">${soon.length ? `<p style="margin:0"><b>${F('Call your pediatrician')}</b></p>` + li(soon) : ''}${now.length ? `<p style="margin:0"><b>${F('Call right away')}</b></p>` + li(now) : ''}</div></details>`; };
  const accs = xs => xs.filter(Boolean).map(accItem).join('');
  const checks = xs => `<ul class="fd-check">${xs.filter(Boolean).map(x => `<li>${F(x)}</li>`).join('')}</ul>`;
  const medHelp = () => { CALLS.soon.push('Forceful vomiting after most feeds, refusing feeds, fewer wet diapers, or slow weight gain.'); CALLS.now.push('Green or bloody vomit, vomiting with a fever, white or very pale poop, or any fever of 100.4°F (38°C) or higher in the first 3 months.'); return ''; };
  const essList = rows => H().list('', rows.map(([icon, title, sub]) => H().row({ icon, cat: CAT, title, sub })));

  // 1. Feeding basics & rhythms
  P.basics0 = () => { const nurse = nurses(), b = isBreast(), fm = formulaFam(), bot = isBottle();
    const dayHtml = (P.day() || ''), k = dayHtml.indexOf('<div class="hub-card" style="padding:14px 14px 8px">'), e = k >= 0 ? dayHtml.indexOf('<figure', k) : -1, ribbon = k >= 0 && e > k ? dayHtml.slice(k, e) : '';
    const times = nurse ? [['7:00 am', 'Feed'], ['9:30 am', 'Feed'], ['12:00 pm', 'Feed'], ['2:30 pm', 'Feed'], ['5:00 pm', 'Feed'], ['Evening', 'Often several feeds close together'], ['Night', 'Feeds every few hours']] : [['7:00 am', 'Bottle'], ['10:00 am', 'Bottle'], ['1:00 pm', 'Bottle'], ['4:00 pm', 'Bottle'], ['7:00 pm', 'Bottle'], ['Night', 'A bottle every few hours']];
    return page(head('Feeding basics & rhythms', 'How much, how often and what’s normal', 'A simple guide to feeding in the newborn weeks.', C.peach)
      + tabbed('#c27a52', [
        ['Basics', h2('The essentials') + essList([['clock', 'How often', nurse ? 'About every 2–3 hours, including at night, counted from the start of a feed.' : 'About every 2–4 hours, including at night, counted from the start of a feed.'], ['drop', 'Feeds a day', nurse ? 'Around 8–12 feeds.' : 'Around 6–10 bottles.'], bot ? ['bottle', 'Per bottle', nurse && fm ? 'Top-ups are small, often 1–2 oz.' : 'About 1–3 oz to start, and more over time.'] : ['heart', 'How long', 'Often 10–20 minutes a side at first, then quicker.'], ['diaper', 'Getting enough', '6 or more wet diapers a day by day 6, and back to birth weight by about 2 weeks. Losing up to about 10% in the first days is common.'], ['drop', 'Vitamin D', b ? 'Drops every day, from the first days.' : 'Drops every day, until he drinks about 32 oz a day.']])
          + h2('Key things to know') + accs([
            ['moon', 'Too sleepy to feed', 'How to wake him', ['Undress him to his diaper, stroke his feet, or change his diaper mid-feed.', 'Until he’s back to birth weight, wake him if it’s been about 3 hours. Ask your pediatrician when you can stop.'], 'He’s too sleepy to feed most times.', 'He’s very hard to wake, or yellow skin is spreading.'],
            ['diaper', 'Not eating much', 'How to tell if it’s okay', ['Short feeds can still be full ones. Diapers and weight tell you more than minutes or ounces.', 'Offer feeds often, and get the ' + (b ? 'latch' : 'bottle') + ' checked.'], 'Fewer than 6 wet diapers a day after day 6, or not back to birth weight by 2 weeks.', ''],
            ['notepad', 'Tracking feeds', 'Whether it’s worth it', ['A quick note of feeds and wet diapers helps in the first weeks, and at checkups. Stop when feeding feels settled.'], '', ''],
            ['eye', 'Feeding when he’s sick', 'A stuffy nose, or not interested', ['Offer smaller feeds more often. Saline drops and gentle suction before feeds help a stuffy nose.'], 'Fewer wet diapers, or he isn’t feeding well.', 'Any fever of 100.4°F (38°C) or higher in the first 3 months.']])
          + (b ? '' : h2('You don’t have to do this alone') + know('Who can help', 'Your pediatrician, for weight, feeds and any worries. A feeding specialist if feeds stay hard.') + know('How are you doing?', 'If you feel low, anxious or overwhelmed most days, tell your doctor. You can call or text the National Maternal Mental Health Hotline any time at 1-833-852-6262.'))],
        ['Cues', cueStrip() + h2('Is he full?') + fullTiles()
          + accs([['eye', 'Not sure he’s hungry', 'When in doubt', ['If in doubt, offer a feed. Stop when he slows or turns away.'], '', ''], ['heart', 'Fussy or pulling off at feeds', 'Too hungry, too fast, or full', ['Feed at early cues, before he’s upset. Burp, then try again.', bot ? 'With a bottle, try a slower nipple and pace it more.' : 'If milk gushes, try leaning back.'], 'He refuses several feeds in a row, or fusses at every feed and isn’t gaining.', '']])],
        ['Cluster feeding', hubStageStrip({ title: 'What it looks like', items: [['clock', 'Late afternoon', 'Feeds start bunching up'], ['moon', 'Evening', 'Feed after feed for a few hours'], ['smile', 'Then', 'Often a longer sleep']], cat: CAT })
          + checks(['Very common in the first weeks, often in the evening.', 'It’s how he fills up, and ' + (b ? 'how your milk keeps up.' : 'it’s normal on formula too.'), 'It usually eases by about 6–8 weeks.'])
          + accs([['heart', 'When it wears you out', 'Sharing the load', ['Someone else can burp, change and settle him between feeds, and bring you water and snacks.', 'Set up a comfy spot for the evening before it starts.'], '', ''], ['clock', 'Days and nights mixed up', 'What helps', ['Bright light and play by day. Dim and quiet at night. It sorts itself out over a few weeks.'], '', ''], ['clock', 'Extra-hungry days', 'A growth spurt', ['Some days he’ll feed much more often, for about 2–3 days. Feeding more ' + (b ? 'makes more milk.' : 'is how he grows.')], '', '']])],
        ['A day', h2('A sample day') + ribbon + `<div class="hub-card" style="padding:6px 16px"><ol class="hub-daymarks-list" style="margin:0">${times.map(([t, w]) => `<li style="display:grid;grid-template-columns:90px 1fr;padding:7px 0;border-bottom:1px solid var(--line,#eee)"><time>${F(t)}</time><span>${F(w)}</span></li>`).join('')}</ol></div>`
          + small('An example, not a schedule.', 'He leads, and no two days look the same.')
          + hubAgeTiles({ title: 'Coming up in the next few weeks', items: [['About 2 weeks', 'Birth weight', 'Back to it'], ['Weeks 2–3', 'A growth spurt', 'A few extra-hungry days'], ['Around 6 weeks', 'Fussy evenings peak', 'Then feeds get easier']], cat: CAT })]
      ])); };

  // 2. Breastfeeding & pumping
  const milkLine = (title, steps3, now = -1) => `<figure class="hub-figure" style="margin:0 0 16px;padding:16px 16px 14px;background:var(--card,#fff);border:1px solid var(--line,#eee);border-radius:20px"><b class="hub-fig-title" style="display:block;margin:0 0 ${now >= 0 ? 34 : 14}px">${F(title)}</b><div style="position:relative;height:18px;border-radius:999px;background:linear-gradient(90deg,#e3a92b 0%,#efc65a 30%,#f6e2a6 58%,#fbf6ea 82%,#ffffff 100%);box-shadow:inset 0 0 0 1px rgba(120,90,40,.18)">${(steps3.length === 4 ? [5, 35, 65, 95] : [6, 50, 94]).map((x, i) => i === now ? `<span style="position:absolute;left:${x}%;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#c46b8e;box-shadow:0 0 0 3px #fff"></span><span style="position:absolute;left:${x}%;top:-26px;transform:translateX(${i === 0 ? '-12%' : i === steps3.length - 1 ? '-88%' : '-50%'});background:#c46b8e;color:#fff;font-size:11.5px;font-weight:700;border-radius:999px;padding:2px 8px;white-space:nowrap">${F('Ari is here')}</span>` : `<span style="position:absolute;left:${x}%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px rgba(120,90,40,.45)"></span>`).join('')}</div><div style="display:grid;grid-template-columns:repeat(${steps3.length},1fr);gap:8px;margin-top:10px">${steps3.map(([w, t], i) => `<div style="text-align:${steps3.length === 4 ? ['left', 'center', 'center', 'right'][i] : ['left', 'center', 'right'][i]}"><b style="display:block;font-size:14px">${F(w)}</b><small style="display:block;font-size:12.5px;line-height:1.35;color:var(--muted,#776)">${F(t)}</small></div>`).join('')}</div><div style="display:flex;justify-content:space-between;margin-top:10px;font-size:12px;color:var(--muted,#776)"><span>${F('Thick, golden colostrum')}</span><span>${F('Thinner, white milk')}</span></div></figure>`;
  P.bf0 = () => { const nurse = nurses(), pump = pumps(), fm = formulaFam(), onlyP = pump && !nurse, mostlyB = fd() === 'Breast milk';
    return page(head('Breastfeeding & pumping', 'Your milk is coming in', 'Milk supply builds over the first few days. Here’s what to expect, and how to make it more comfortable.', C.pink)
      + tabbed('#c46b8e', [
        ['Your milk', h2('How your milk changes') + milkLine('The first weeks', [['Days 1–2', 'Small amounts of colostrum'], ['Days 2–5', 'Milk comes in. Often feels full'], ['Weeks 1–2', 'Turns whiter'], ['6–12 weeks', 'Supply settles. You feel less full']], (d => d < 2 ? 0 : d < 5 ? 1 : d < 42 ? 2 : 3)(babyDays()))
          + h2('Is your supply enough?') + two(['Good signs', (nurse ? 'You hear him swallow. ' : '') + 'His wet diapers and weight are on track' + (mostlyB ? ', with 3 or more yellow poops a day.' : '.')], ['Not a sign of low supply', 'How much you pump, or breasts that feel softer after the first weeks.', '#f5efe3', '#8a6a2c'])
          + h2('Is this fullness normal?') + two(['Normal fullness', 'Heavy and warm on days 2–5. Softens after a feed.'], ['Engorged', nurse ? 'Hard, tight and sore. Hard for him to latch.' : 'Hard, tight and sore. Pumping feels harder.', '#fdeee6', '#9a5a3c'])
          + tl('When you’re very full', [['Before ' + (nurse ? 'a feed' : 'pumping'), 'hand', nurse ? 'Press your fingertips around the nipple for a minute to soften it, so he can latch.' : 'Press your fingertips around the nipple for a minute to soften it.'], [nurse ? 'During the feed' : 'While you pump', 'heart', nurse ? 'Feed often, every 2–3 hours. Let him finish the first side.' : 'Keep to your usual schedule. Start on a low setting.'], ['Right after', 'snow', 'A cold pack on each breast eases the swelling.'], ['In between', 'drop', 'Light strokes toward your armpit, and express a little just to feel comfortable. Skip deep massage.'], ['All day', 'shirt', 'A supportive bra that isn’t tight.']])
          + h2('Leaking?') + steps([['shirt', 'Nursing pads', 'Keep your shirts dry'], ['hand', 'Press gently', 'When you feel a letdown coming'], ['cup', 'A milk catcher', 'Saves milk from the other side']], false)
          + small('Common in the first weeks.', 'It eases as your supply settles.')
          + h2('What can you eat and drink?') + H().tiles([['Caffeine', 'Up to 300 mg a day', 'About 2–3 cups of coffee'], ['Alcohol', 'Best skipped for now', 'Later, wait 2+ hours after a drink'], ['Fish', '8–12 oz a week', 'Low-mercury, like salmon or shrimp'], ['Water', 'A glass each feed', 'Then drink to thirst']])
          + small('Hungrier and thirstier than usual?', 'That’s normal. Keep snacks and water where you ' + (nurse ? 'feed.' : 'pump.'))],
        nurse && ['Nursing', h2('Set up your spot') + steps([['sofa', 'A pillow under him', 'So you bring him up, not lean over'], ['cube', 'A footstool', 'So your lap is level'], ['cup', 'Water and a snack', 'Plus a phone charger']], false)
          + tl('A nursing feed, start to finish', [['Start', 'eye', 'At early cues, before crying.'], ['Latch', 'heart', 'Nose to nipple. Wide mouth, then bring him in chin first.'], ['When he slows', 'hand', 'Often 10–20 minutes. Burp, then offer the other side.'], fm && ['Still hungry?', 'bottle', 'A small, paced formula top-up. Pump after, when you can.'], ['Done', 'smile', 'He lets go or drifts off.'], ['Next feed', 'clock', 'Start on the last side. A hair tie on your wrist helps.']])
          + h2('Holds to try') + illGrid([[ILL.crossCradle(PAL), 'Cross-cradle', 'Easiest for learning to latch'], [ILL.football(PAL), 'Football', 'Good after a C-section'], [ILL.laidBack(PAL), 'Laid-back', 'Lean back, him tummy-down on you'], [ILL.cradle(PAL), 'Cradle', 'Once latching feels easy']])
          + small('Gulping or coughing at feeds?', 'Milk may be coming fast. Try laid-back, so he feeds against gravity.')
          + h2('Is the latch right?') + hubEmbed('y--syZR0u1E', 'A good latch, step by step', 'Global Health Media')
          + two(['Good latch', 'Lips flared out. Long sucks with swallows. Comfortable after the first few sucks.'], ['Shallow latch', 'Clicking, dimpled cheeks, or pinching that lasts the whole feed. Break the seal and try again.', '#fdeee6', '#9a5a3c'])
          + h2('Falling asleep at the breast?') + steps([['hand', 'Squeeze gently', 'Behind the nipple, to keep milk flowing'], ['roll', 'Switch sides', 'The move wakes him a little'], ['diaper', 'Undress him', 'Down to his diaper, or tickle his feet']], false)
          + h2('Good to know') + accs([
            ['hand', 'Hand expression', 'To soften, or save colostrum', [{ html: steps([['hand', 'Place your fingers', 'Thumb above, fingers below, about an inch behind the nipple'], ['heart', 'Press back', 'Gently, toward your chest'], ['drop', 'Squeeze, then release', 'Roll thumb and fingers together. Repeat in a slow rhythm'], ['wave', 'Move around', 'Shift your fingers to reach every part of the breast']], true) }], '', ''],
            !fm && ['bottle', 'A first bottle', 'Around 3–4 weeks', ['Once nursing is going well, someone else can offer a bottle of pumped milk, before he’s very hungry.'], '', '']])],
        ['Pumping', (onlyP ? h2('Set up your spot') + steps([['drop', 'Pump and clean parts', 'Put together and in reach'], ['shirt', 'A hands-free bra', 'So your hands are free'], ['fridge', 'Bottles or bags', 'Labeled, with the fridge or a cooler close'], ['cup', 'Water and a snack', 'Plus a phone charger']], false)
          + tl(onlyP ? 'A pumping day' : 'When you pump', onlyP ? [['Every 2–3 hours', 'drop', 'Pump 8–12 times a day.'], ['At night', 'moon', 'Keep one session at night for now.']] : [['First weeks', 'heart', 'Nursing builds your supply. Pump only if you need to, like after a top-up.'], ['Around 3–4 weeks', 'bottle', 'Start pumping for a first bottle, once nursing is going well.'], ['When you’re apart', 'clock', 'Pump about every 3 hours. About 1 oz for each hour apart.']]) : tl(onlyP ? 'A pumping day' : 'When you pump', onlyP ? [['Every 2–3 hours', 'drop', 'Pump 8–12 times a day.'], ['At night', 'moon', 'Keep one session at night for now.']] : [['First weeks', 'heart', 'Nursing builds your supply. Pump only if you need to, like after a top-up.'], ['Around 3–4 weeks', 'bottle', 'Start pumping for a first bottle, once nursing is going well.'], ['When you’re apart', 'clock', 'Pump about every 3 hours. About 1 oz for each hour apart.']])
          + h2('Set up your spot') + steps([['drop', 'Pump and clean parts', 'Put together and in reach'], ['shirt', 'A hands-free bra', 'So your hands are free'], ['fridge', 'Bottles or bags', 'Labeled, with the fridge or a cooler close'], ['cup', 'Water and a snack', 'Plus a phone charger']], false))
          + h2('Each session') + H().tiles([['How long', '15–20 minutes', 'Both sides at once saves time'], ['When to stop', 'When milk slows to drips', 'Then a minute or two more'], ['Your milk', 'Label and date it', 'Then fridge or freezer'], ['The parts', 'Wash and air-dry', 'Sanitize once a day, first months']])
          + h2('Does the flange fit?') + two(['Right size', 'Your nipple moves freely in the tunnel, without rubbing.'], ['Wrong size', 'Pinching, rubbing or pain. Ask a lactation consultant to check.', '#fdeee6', '#9a5a3c'])
          + tl('Getting more milk', [['Before', 'sun', 'Warmth on your breasts, and a photo or video of him.'], ['While you pump', 'hand', 'Massage and gently squeeze your breast.'], ['At the end', 'drop', 'A minute of hand expression gets the last of it.']])
          + h2('Making it easier') + accs([
            ['hand', 'Gear that helps', 'Worth having', ['Spare flanges and valves, so you’re not washing mid-day.', 'Replace valves and membranes when suction drops. Worn parts pump less.'], '', ''],
            ['moon', 'Pumping at night', 'A cooler by the bed', ['~Set up by your bed, so night sessions are quick and you’re back to sleep sooner.', 'snow|A cooler bag with frozen ice packs keeps milk safe for up to 24 hours. Move it to the fridge in the morning.', 'bag|A spare set of parts means no washing in the middle of the night.', 'cup|Water and a snack within reach.'], '', ''],
            ['clock', 'Pumping at work', 'Your rights, and a plan', ['shield|You have the right to break time and a private space that isn’t a bathroom.', 'fridge|Start a small freezer stash a few weeks before you go back.'], '', ''],
            ]) + h2('When you’re ready to stop') + accs([
            ['clock', 'Stopping pumping for good', 'Slowly, over a few weeks', ['~Three ways to taper. Many people mix them.', { car: [['shorten', 'Shorten', 'Take a few minutes off each session every few days.'], ['space', 'Space out', 'Stretch the time between sessions, little by little.'], ['drop', 'Drop one', 'Once a session is short, drop it. Wait a few days before the next.']] }, 'snow|Feeling full? Pump just until you’re comfortable, then use a cold pack.', 'smile|Your mood can dip as your milk slows. Tell your doctor if it does.'], '', '']])],
        ['If it hurts', h2('Sore nipples') + accs([
            nurse && ['heart', 'Sore or cracked nipples', 'Usually the latch', ['~Some tenderness in the first week is common. Pain through the whole feed usually means a shallow latch.', { html: steps([['mouth', 'Re-latch', 'Break the seal, try again'], ['drop', 'Soothe', 'Balm or your own milk, after feeds'], ['shield', 'Protect', 'Breast shells between feeds']], false) + small('Bleeding, or not easing?', 'See a lactation consultant. Still sore with a good latch? Ask about tongue-tie.') }], '', ''],
            ['drop', 'Pumping hurts', 'Usually the flange or suction', [{ html: steps([['eye', 'Check the flange', 'Your nipple should move freely in the tunnel'], ['hand', 'Lower the suction', 'To the highest level that’s still comfortable'], ['cup', 'Balm or oil in the flange', 'A little inside the tunnel cuts friction'], ['shield', 'Shells between sessions', 'So your shirt doesn’t rub']], false) + small('Still hurts?', 'See a lactation consultant.') }], '', '']])
          + h2('Something looks or feels different') + accs([
            ['heart', 'A tender lump', 'Often a clogged duct', [{ html: two(['Clogged duct', 'Tender, and you feel well. Keep feeding or pumping, use a cold pack, and skip deep massage.'], ['Call your doctor', 'Red and painful, with a fever or chills.', '#fdeee6', '#9a5a3c']) + small('Keeps coming back?', 'Sunflower lecithin may help. Ask your doctor or a lactation consultant first.') }], '', ''],
            ['eye', 'A white spot', 'Often a milk blister', ['~It’s usually a tiny blocked pore. Keep feeding or pumping, and don’t pop it yourself.', '~If it hurts, a lactation consultant or doctor can help.'], '', ''],
            ['snow', 'Turns white after ' + (nurse ? 'feeds' : 'pumping'), 'Often from cold', ['~Cover up right after, and use warmth. If it keeps happening, mention it to a lactation consultant.'], '', ''],
            ['drop', 'Shiny, pink, burning or itchy', 'Could be thrush', ['~This can be a yeast infection. He may also have white patches in his mouth that don’t wipe off.', { html: small('Call your doctor.', 'You’ll both need treatment.') }], '', '']])
          + know('Who can help', 'A lactation consultant can fix most problems in a visit or two, and most insurance covers it.')]
      ])); };
  // 3. Bottle feeding
  P.bot0 = () => { const nurse = nurses(), fm = formulaFam(), b = isBreast(), onlyP = pumps() && !nurse;
    return page(head('Bottle feeding', 'A simple, safe routine', fm && b ? 'Whether it’s formula, pumped milk or both, here’s how to make bottle feeding work.' : fm ? 'Here’s how to make bottle feeding safe and easy.' : 'Here’s how to give your pumped milk by bottle.', C.lilac)
      + tabbed('#7d6aa8', [
        ['Making a bottle', h2('What you’ll need') + steps([['bottle', 'Bottles', nurse && fm ? '2–3 small ones for top-ups' : 'Enough for a day, so you wash once'], ['drop', 'Slow-flow nipples', 'The slowest size to start'], ['hand', 'A bottle brush', 'Plus a drying rack']], false)
          + small('There’s no best bottle,', 'wide or narrow. Use one he takes well.')
          + (b ? h2(fm ? 'With breast milk' : 'How to get breast milk ready') + steps([['hand', 'Wash', 'Your hands, and a clean bottle'], ['snow', 'From the fridge', 'Or thawed overnight in the fridge'], ['drop', 'Swirl, don’t shake', 'The fat separates. That’s normal'], ['hand', 'Test on your wrist', 'Or serve it cool']], true) : '')
          + (fm ? h2(b ? 'With formula' : 'How to make a formula bottle') + steps([['hand', 'Wash', 'Your hands, and a clean bottle'], ['drop', 'Water first', 'The amount on the label'], ['bowl', 'Then formula', 'Level scoops, not packed'], ['bottle', 'Mix and feed', 'Room temperature is fine']], true)
              + small('Follow the label exactly.', 'Watered-down or extra-strong formula isn’t safe.')
              + accs([['bowl', 'Which formula?', 'Any standard one is fine', ['Any standard, iron-fortified infant formula works. Powder, liquid concentrate and ready-to-feed are all fine.', 'Most babies switch between standard brands without trouble. Check with your pediatrician before a special one.'], '', ''], ['drop', 'Safe water', 'In the first months', ['Ask your pediatrician whether to boil water for formula in the first months, especially if he was born early.'], '', '']])
            : '')
          + (fm ? h2(b ? 'Formula at night' : 'Make nights easier') + steps([['bottle', 'Ready-to-feed', 'No mixing at 3 am'], ['drop', 'Water measured out', 'In clean bottles, at room temperature'], ['cube', 'A formula dispenser', 'Scoops portioned ahead']], false) : '')],
        ['Giving a bottle', h2('How to hold him') + illGrid([[ILL.cradled(PALB), 'Cradled, sitting up', 'Head higher than his tummy'], [ILL.upright(PALB), 'Upright on your lap', 'Good for slowing a fast eater']])
          + h2('How to give it: paced feeding') + steps([['mouth', 'Touch his lip', 'Let him open and draw it in'], ['bottle', 'Fairly level', 'Just enough milk to fill the tip'], ['clock', 'Pause often', 'Tip it down every few sucks'], ['roll', 'Switch sides', 'Halfway, so he looks both ways']], true)
          + small('Burp every 2–3 oz,', 'and stop when he slows or turns away, even if milk is left.')
          + small('Never prop a bottle.', 'Always hold him and the bottle.')
          + h2('Is the nipple right?') + two(['Too slow', 'He sucks hard, gets frustrated, and the nipple flattens.'], ['Too fast', 'He gulps, coughs, or milk spills out.', '#fdeee6', '#9a5a3c'])
          + small('Start with the slowest flow.', 'Go up a size only when he’s clearly frustrated.')
          + ((nurse || fm) ? h2('When it’s not going well') + accs([nurse && ['bottle', 'He won’t take a bottle', 'Common for nursed babies', [{ html: steps([['heart', 'Someone else offers', 'Ideally with you out of the room'], ['moon', 'Before he’s very hungry', 'Calm is easier'], ['drop', 'A slow-flow nipple', 'Warm milk, and a few days’ patience']], false) }], '', ''],
            fm && ['bottle', 'Is it the formula?', 'Usually not', [{ html: two(['Usually not the formula', 'Gas, fussing and spit-up happen on any formula.'], ['Worth asking about', 'Blood in his poop, a rash, vomiting after most feeds, or slow weight gain.', '#fdeee6', '#9a5a3c']) }], '', '']]) : '')],
        ['Storing & cleaning', (b ? h2('How long breast milk keeps') + H().tiles([['On the counter', '4 hours', 'Fresh'], ['In the fridge', '4 days', 'At the back, not the door'], ['In the freezer', '6 months', 'Best within 6, fine up to 12'], ['Leftovers', 'Within 2 hours', 'After he’s finished, then toss it']]) : '')
          + (fm ? h2('How long formula keeps') + H().tiles([['Out of the fridge', '2 hours', 'From when you make it'], ['Once he starts', '1 hour', 'Then toss what’s left'], ['Made ahead', '24 hours', 'In the fridge']]) : '')
          + accs([
            b && ['snow', 'Freezing and thawing', 'Breast milk', ['Freeze flat in 2–4 oz bags, so you thaw only what he’ll drink.', 'Leave a little room at the top. Milk expands as it freezes.', 'Cooled milk from the same day can be combined.', 'Thaw in the fridge overnight or in warm water. Use within 24 hours, and never refreeze.'], '', ''],
            ['snow', 'Warming milk', 'Or serve it cool', [{ html: steps([['drop', 'Warm water', 'Or a bottle warmer'], ['hand', 'Swirl and test', 'A few drops on your wrist'], ['snow', 'Or skip it', 'Room temperature or cold is fine']], false) + small('Never the microwave.', 'It heats unevenly.') }], '', ''],
            ['bag', 'Out and about', 'Traveling with milk', [fm ? 'Ready-to-feed formula needs no mixing or water.' : '', fm ? 'Or carry powder and water separately, and mix when he’s hungry.' : '', b ? 'A cooler bag with ice packs keeps breast milk for up to 24 hours. It’s allowed through airport security; tell the officer.' : ''].filter(Boolean), '', '']])
          + h2('Cleaning, after every feed') + steps([['hand', 'Take apart', 'Bottle, nipple, ring and valve'], ['drop', 'Wash', 'Hot, soapy water and a brush, or the dishwasher'], ['heart', 'Air-dry', 'On a clean towel or rack']], true)
          + small('Sanitize once a day', 'in the first months: boil for 5 minutes, steam, or use the dishwasher’s sanitize setting.')]
      ])); };

  // 4. Digestion & comfort
  P.dig0 = () => { const br = isBreast() && fd() === 'Breast milk', fmOnly = fd() === 'Formula', bot = isBottle();
    return page(head('Digestion & comfort', 'Spit-up, gas and noisy tummies are common', 'His tummy is still learning, which brings some normal, and messy, changes.', C.blue)
      + tabbed('#46638c', [
        ['Burping & spit-up', h2('How to burp him') + illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'His chin on a burp cloth'], [ILL.sitting(PALT), 'Sitting on your lap', 'Your hand supports his chin and chest'], [ILL.tummy(PALT), 'Tummy-down', 'Across your lap, with gentle pats']])
          + small(isBreast() && !bot ? 'Burp between sides, and at the end.' : bot && !isBreast() ? 'Burp every 2–3 oz, and at the end.' : 'Burp between sides or every 2–3 oz, and at the end.', 'Firm pats or circles. No burp after a minute or two? Carry on.')
          + h2('Is this much spit-up normal?') + H().tiles([['How much', 'A tablespoon or two', 'At a time. Spread out, it looks like more'], ['What matters', 'Happy and growing', 'Then it isn’t a problem'], ['Often peaks', 'Around 4 months', 'Then slowly eases'], ['Usually gone', 'By 9–12 months', 'As his tummy matures']])
          + small('Not sure?', 'Spill a tablespoon of milk on a burp cloth. It looks bigger than you’d think.')
          + h2('What helps with spit-up') + steps([['sit', 'Upright after', 'For 20–30 minutes'], ['clock', 'Smaller feeds', 'More often'], ['eye', 'Stop before overfull', 'Watch for him slowing'], ['shirt', 'Nothing tight', 'Around his tummy']], false)
          + small('For sleep, flat on his back,', 'even with spit-up. Skip wedges and positioners.')
          + h2('When it’s more than spit-up') + two(['Spit-up', 'Flows out gently. Usually less than it looks.'], ['Vomit', 'Comes out with force, sometimes across the room.', '#fdeee6', '#9a5a3c'])
          + small('Reflux that bothers him', 'looks like crying or arching at most feeds, refusing feeds, or slow weight gain. Talk to your pediatrician before changing feeds or formula.')],
        ['Gas & crying', h2('Is all this grunting normal?') + small('Yes.', 'He swallows air when he feeds and cries. Fussy evenings often peak around 6 weeks, and ease by 3–4 months.')
          + h2('How to keep air out') + steps([bot ? ['bottle', 'Milk fills the tip', 'Tilt the bottle just enough'] : ['mouth', 'A deep latch', 'Lips flared, no clicking'], ['smile', 'Burp mid-feed', 'Not just at the end'], ['eye', 'Feed early', 'Crying gulps air']], false)
          + h2('How to ease gas') + steps([['hand', 'Bicycle his legs', 'Gently, on his back'], ['moon', 'Tummy-down', 'Across your knees'], ['mat', 'Tummy time', 'When he’s awake and watched']], false)
          + h2('When crying won’t stop') + steps([['eye', 'Check', 'Hunger, a burp, a diaper, too warm'], ['moon', 'Soothe', 'Swaddle, hold, shush, sway, or a pacifier'], ['heart', 'Step away', 'Lay him on his back somewhere safe']], true) + small('Never shake him.', 'Even when you’re exhausted. Call someone to take over if you need to.')
          + h2('Good to know') + accs([
            ['drop', 'Gas drops or gripe water?', 'What to know', ['Gas drops are safe but often don’t help much. Ask your pediatrician before trying gripe water.'], '', ''],
            ['heart', 'Hiccups', 'Common and harmless', ['They rarely bother him, and stop on their own. A burp or a pause can help.'], '', '']])],
        ['Poop', h2('How poop changes, the first week') + illGrid([[ILL.poop('#2b2622'), 'Days 1–2', 'Black and sticky'], [ILL.poop('#5f6b33'), 'Days 3–4', 'Greenish'], [ILL.poop(br ? '#d4a23a' : fmOnly ? '#b98a4e' : '#c99642'), 'By day 5', br ? 'Yellow and seedy' : fmOnly ? 'Tan, like peanut butter' : 'Yellow to tan']])
          + H().tiles([['How often', br ? 'After most feeds' : '1–4 a day', br ? 'At first. By 6 weeks, some go days without one' : 'At first, then fewer'], ['What matters', 'Soft', 'Grunting and going red is normal']])
          + h2('Poop that looks off') + two(['Normal', 'Yellow, green, tan or mustard. Seedy, or a little mucus.'], ['Call your pediatrician', 'White, gray or very pale. Red or black after the first few days. Hard pebbles.', '#fdeee6', '#9a5a3c'])
          + small('Calling about poop?', 'A photo of the diaper helps.')]
      ])); };
  // ---- Newborn v9 (Yarden, Nov 5): rethought as a whole. Nothing repeats the stage tiles; each tab has one job. ----
  HEADART['Rhythms & cues'] = () => ART.often(5); HEADART['Hunger & feeding times'] = () => ART.often(5);
  P.basics0 = () => { const nurse = nurses(), b = isBreast(), bot = isBottle();
    const dayHtml = (P.day() || ''), k = dayHtml.indexOf('<div class="hub-card" style="padding:14px 14px 8px">'), e = k >= 0 ? dayHtml.indexOf('<figure', k) : -1, ribbon = k >= 0 && e > k ? dayHtml.slice(k, e) : '';
    return page(head('Hunger & feeding times', 'Follow his cues, not the clock', 'Newborn feeding is frequent and uneven. Here’s how to read him, and what’s normal across a day and night.', C.peach)
      + tabbed('#c27a52', [
        ['Day to day', h2('What a day looks like') + ribbon + small(b ? 'About every 2–3 hours, day and night,' : 'About every 2–4 hours, day and night,', 'counted from the start of one feed. This is an example, not a schedule. He leads.')
          + h2('How to tell he’s hungry') + cueStrip().replace(F('Hunger cues, early to late'), F('Early to late'))
          + h2('Hungry, or sucking for comfort?') + two(['Hungry', 'Rooting and fists to his mouth, and it’s been a while since a feed. Not sure? Offer one.'], ['Sucking for comfort', 'He just fed. Try a cuddle or a pacifier' + (nurse ? ', once nursing is going well.' : '.'), '#f5efe3', '#8a6a2c'])
          + h2('How to tell he’s done') + fullTiles()
          + h2('Is he getting enough?') + H().tiles([['Wet diapers', '6 or more a day', 'By day 6, pale yellow'], ['Weight', 'Back to birth weight', 'By about 2 weeks'], ['After feeds', 'Mostly content', 'Some fussy evenings are normal'], ['Amounts', 'Vary feed to feed', 'Look at the whole day']])
          + small('Extra-hungry for a few days?', 'That’s a growth spurt, often around 2–3 weeks. Feed more often, and it passes.')
          + small('Keeping count helps at first.', 'A quick note of each feed' + (b ? ' and the side you ended on' : ' and how much') + ', plus wet and dirty diapers. Stop once feeding feels settled.')],
        ['Evenings & nights', h2('Evenings') + hubStageStrip({ title: 'What they often look like', items: [['clock', 'Late afternoon', 'Feeds start bunching up'], ['moon', 'Evening', 'Feed after feed for a few hours'], ['smile', 'Later at night', 'Often a longer sleep']], cat: CAT })
          + checks(['That’s cluster feeding. It’s very common in the first weeks.', b ? 'It doesn’t mean you’re low on milk. It’s how he tells your body to make more.' : 'It’s normal on formula too. It’s how he fills up.'])
          + h2('Getting through the evenings') + steps([['sofa', 'Set up a spot', 'Before the evening starts'], ['cup', 'Water and snacks', 'Plus something to watch or listen to'], ['heart', 'Hand off', 'Someone else burps, changes and settles him'], b ? ['roll', 'Switch sides often', 'Keeps milk flowing when he slows'] : ['bottle', 'Smaller bottles', 'More often, instead of one big one']], false)
          + h2('Nights') + accs([['sun', 'Waking him to feed', 'Until he’s back to birth weight', ['~Wake him if it’s been about 3 hours. Ask your pediatrician when you can stop, usually around 2 weeks.', { html: steps([['shirt', 'Undress him', 'Down to his diaper'], ['hand', 'Stroke his feet', 'Or his back'], ['diaper', 'Change his diaper', 'Halfway through']], false) }], '', ''],
            ['moon', 'Night feeds, made easier', 'So you both get back to sleep', [{ html: steps([['moon', 'Low light', 'A dim lamp, no screens'], ['diaper', 'Change first', b ? 'Or between sides, not after' : 'Before the bottle, not after'], ['cup', 'Set up by the bed', 'Water, snack, diapers, burp cloth']], false) }, 'Keep it quiet and boring. Save talking and play for the day.', b && bot ? 'Take turns: one parent does a bottle shift so the other gets a longer stretch.' : b ? 'A partner can bring him to you and do the burp and change.' : 'Take turns, so each of you gets one longer stretch.'], '', ''],
            ['clock', 'Days and nights mixed up', 'Awake at night, sleepy all day', [{ html: two(['By day', 'Bright light, talking and play.', '#fff3d6', '#8a6a2c'], ['At night', 'Dim, quiet, boring feeds.', '#e7ecfa', '#3d4f86']) }, '~It sorts itself out over a few weeks.'], '', '']])
          + hubAgeTiles({ title: 'When it gets easier', items: [['Around 6 weeks', 'Fussy evenings peak', 'Then slowly ease'], ['6–8 weeks', 'Cluster feeding eases', 'Feeds spread out'], ['By 2–3 months', 'A longer night stretch', 'Often 3–5 hours']], cat: CAT })],
        ['Not going well?', accs([
            ['diaper', 'Not eating much', 'How to tell if it’s okay', ['~Short feeds can still be full ones. Diapers and weight tell you more than minutes or ounces.', { html: steps([['eye', 'Feed at early cues', 'Before he’s too tired or upset'], b ? ['roll', 'Keep him going', 'Switch sides when he slows'] : ['clock', 'Little and often', 'Smaller bottles, more often'], ['steth', 'Get a check', b ? 'The latch, with a lactation consultant' : 'The bottle and nipple, with your pediatrician']], false) }], '', ''],
            ['heart', 'Fussy or pulling off at feeds', 'Too hungry, too fast, or full', ['~Pulling off and fussing usually mean he’s too hungry, the flow is too fast or slow, he needs a burp, or he’s full.', { html: steps([['eye', 'Feed early', 'Before crying starts'], ['smile', 'Burp, then retry', 'Trapped air feels like full'], bot ? ['bottle', 'Check the nipple', 'Too fast or too slow?'] : ['drop', 'Fast letdown?', 'Lean back, so he feeds against gravity']], false) }], '', ''],
            ['eye', 'Feeding when he’s sick', 'A stuffy nose, or not interested', ['~Newborns breathe through their nose, so a stuffy nose makes feeding hard.', { html: steps([['drop', 'Clear his nose first', 'Saline drops and gentle suction'], ['clock', 'Smaller, more often', 'Little feeds add up'], ['sit', 'Keep him upright', 'Breathing is easier']], false) }], '', '']])
          + h2('Who can help') + steps([b && ['heart', 'Lactation consultant', 'Latch, pain and supply'], ['steth', 'Your pediatrician', 'Weight and feeds, any time you’re unsure'], ['bowl', 'Feeding specialist', 'If feeds stay hard. Ask for a referral']].filter(Boolean), false)
          + small('Feeling low or overwhelmed most days?', 'Tell your doctor. You can also call or text 1-833-852-6262, any time.')]
      ])); };
  // ---- Newborn v10 (Yarden, Nov 6): every tab follows one pattern. One main visual, at most one reference, then common questions folded. ----
  const qa = xs => h2('Common questions') + accs(xs.filter(Boolean).map(([icon, q, body]) => [icon, q, '', body, '', '']));
  const storeTable = (rows) => `<div class="hub-card" style="padding:4px 14px;overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.35"><thead><tr>${['', 'Counter', 'Fridge', 'Freezer'].map(h => `<th style="text-align:left;padding:10px 6px 8px;font-size:12px;color:var(--muted,#776);font-weight:600">${F(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr style="border-top:1px solid var(--line,#eee)">${r.map((c, k) => `<td style="padding:10px 6px;vertical-align:top;${k ? '' : 'font-weight:700;'}">${F(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const qaCss = `<style>#main .fd-acc summary small:empty{display:none}#main .hub-daymarks .hub-fig-title:empty{display:none}</style>`;

  P.basics0 = () => { const nurse = nurses(), b = isBreast(), bot = isBottle(), fm = formulaFam();
    const dayHtml = (P.day() || ''), k = dayHtml.indexOf('<div class="hub-card" style="padding:14px 14px 8px">'), e = k >= 0 ? dayHtml.indexOf('<figure', k) : -1, ribbon = k >= 0 && e > k ? dayHtml.slice(k, e) : '';
    return qaCss + page(head('Hunger & feeding times', 'Follow his cues, not the clock', 'Newborn feeding is frequent and uneven. Here’s how to read him, and what’s normal across a day and night.', C.peach)
      + tabbed('#c27a52', [
        ['A day', h2('What a day of feeds looks like') + ribbon
          + small('This is an example, not a schedule.', 'He leads, and no two days look the same.')
          + h2('How long a feed takes') + small('It varies.', (b && nurse ? 'Often 10–20 minutes a side at first' : 'Often 10–20 minutes a bottle') + ', but short and long feeds can both be normal. Watch his diapers and weight, not the minutes.')
          + qa([
            ['sun', 'Should I wake him to feed?', ['~Yes, if it’s been about 3 hours, until he’s back to birth weight. That’s usually around 2 weeks, and your pediatrician will tell you when you can stop.']],
            ['moon', 'How do I keep him awake during a feed?', ['~Newborns often doze off mid-feed.', { html: steps([['shirt', 'Undress him', 'Down to his diaper'], ['hand', 'Stroke his feet', 'Or his back'], ['diaper', 'Change his diaper', 'Halfway through'], b && nurse ? ['drop', 'Squeeze gently', 'Behind the nipple, to keep milk flowing'] : ['smile', 'Pause and burp', 'Then offer again']], false) }]],
            
            ['heart', 'Hungry, or sucking for comfort?', [{ html: two(['Hungry', 'Rooting and fists to his mouth, and it’s been a while since a feed. Not sure? Offer one.'], ['Sucking for comfort', 'He just fed. Try a cuddle or a pacifier' + (nurse ? ', once nursing is going well.' : '.'), '#f5efe3', '#8a6a2c']) }]]])],
        ['Cues & amounts', h2('How to tell he’s hungry') + cueStrip().replace(F('Hunger cues, early to late'), F('Early to late'))
          + h2('How to tell he’s done') + fullTiles()
          + h2('Is he getting enough?') + tl('Wet diapers, the first week', [['Days 1–2', 'diaper', 'About 1–2 a day.'], ['Days 3–4', 'diaper', 'About 3–4 a day.'], ['Day 5', 'diaper', 'About 5 a day.'], ['Day 6 on', 'drop', '6 or more a day, pale yellow.']])
          + H().tiles([['Weight', 'Back to birth weight', 'By about 2 weeks. The surest sign'], bot ? (nurse && fm ? ['Top-ups', '1–2 oz', 'Small, and only if he’s still hungry'] : ['Per bottle', '1–3 oz at first', 'Slowly more over the first weeks']) : ['Amounts', 'Vary feed to feed', 'Look at the whole day']])
          + small('Your pediatrician checks his weight', 'in the first days and weeks, and may give you a plan of your own. Follow theirs.')
          + qa([
            ['eye', 'Why is he suddenly so hungry?', ['~Probably a growth spurt, often around 2–3 weeks. Feed more often for a few days, and it passes.']],
            ['notepad', 'Should I track every feed?', ['~It helps at first. A quick note of each feed' + (b ? ' and the side you ended on' : ' and how much') + ', plus wet and dirty diapers. Stop once feeding feels settled.']]])],
        ['Evenings & nights', h2('Why evenings can feel nonstop') + hubStageStrip({ title: 'A typical evening', items: [['clock', 'Late afternoon', 'Feeds start bunching up'], ['moon', 'Evening', 'Feed after feed for a few hours'], ['smile', 'Later at night', 'Often a longer sleep']], cat: CAT })
          + small('That’s cluster feeding.', 'It’s very common in the first weeks, and it eases by about 6–8 weeks.')
          + h2('Getting through evenings and nights') + steps([b ? ['roll', 'Switch sides often', 'Keeps milk flowing when he slows'] : ['bottle', 'Smaller bottles', 'More often, not one big one'], ['diaper', 'Change first', 'Before the feed, so he stays sleepy after'], ['moon', 'Dim and quiet at night', 'Save talking and play for the day'], ['heart', 'Take turns', b && bot ? 'One parent does a bottle shift' : b ? 'A partner burps and changes him' : 'So each of you gets a longer stretch']], false)
          + qa([
            ['drop', b ? 'Does cluster feeding mean I’m low on milk?' : 'Is cluster feeding normal on formula?', ['~' + (b ? 'No. It’s how he tells your body to make more.' : 'Yes. It’s how he fills up, on any milk.')]],
            ['clock', 'What if days and nights are mixed up?', [{ html: two(['By day', 'Bright light, talking and play.', '#fff3d6', '#8a6a2c'], ['At night', 'Dim, quiet, boring feeds.', '#e7ecfa', '#3d4f86']) }, '~It sorts itself out over a few weeks.']],
            ['smile', 'When does it get easier?', [{ html: hubAgeTiles({ title: '', items: [['Around 6 weeks', 'Fussy evenings peak', 'Then slowly ease'], ['6–8 weeks', 'Cluster feeding eases', 'Feeds spread out'], ['By 2–3 months', 'A longer night stretch', 'Often 3–5 hours']], cat: CAT }) }]]])],
        ['When it’s hard', h2('Normal, or worth a call?') + two(['Usually normal', 'Short feeds, fussy evenings, some feeds smaller than others, dozing off mid-feed.'], ['Call your pediatrician', 'Fewer than 6 wet diapers a day after day 6, not back to birth weight by 2 weeks, or too sleepy to feed most times.', '#fdeee6', '#9a5a3c'])
          + qa([
            ['heart', 'Why does he pull off and fuss?', ['~Usually he’s too hungry, the flow is too fast or slow, he needs a burp, or he’s full.', { html: steps([['eye', 'Feed early', 'Before crying starts'], ['smile', 'Burp, then retry', 'Trapped air feels like full'], bot ? ['bottle', 'Check the nipple', 'Too fast or too slow?'] : ['drop', 'Fast letdown?', 'Lean back, so he feeds against gravity']], false) }]],
            ['diaper', 'What if he’s not eating much?', ['~Short feeds can still be full ones. Diapers and weight tell you more than minutes or ounces.', 'Feed at early cues, before he’s too tired or upset.', b ? 'Get the latch checked by a lactation consultant.' : 'Get the bottle and nipple checked by your pediatrician.']],
            ['eye', 'How do I feed him when he’s stuffy?', ['~Newborns breathe through their nose, so a stuffy nose makes feeding hard.', 'Saline drops and gentle suction before feeds.', 'Smaller feeds, more often.', 'Keep him upright while he feeds.']]])
          + h2('Who can help') + steps([b && ['heart', 'Lactation consultant', 'Latch, pain and supply'], ['steth', 'Your pediatrician', 'Weight and feeds, any time you’re unsure'], ['bowl', 'Feeding specialist', 'If feeds stay hard. Ask for a referral']].filter(Boolean), false)
          + small('Feeling low or overwhelmed most days?', 'Tell your doctor. You can also call or text 1-833-852-6262, any time.')]
      ])); };

  // Breastfeeding & pumping as a hands-on coach (Nov 6): tabs are jobs, and each fix sits right under the instruction it fixes.
  const stageCar = (slides, now) => { const n = slides.length, go = d => `const c=this.closest('.fd-stc');c.dataset.on=Math.max(0,Math.min(${n - 1},(+c.dataset.on)${d}))`;
    const css = `<style>#main .fd-stc{margin:0 0 8px}#main .fd-stc>section{display:none}${slides.map((_, i) => `#main .fd-stc[data-on="${i}"]>section[data-i="${i}"]{display:block}#main .fd-stc[data-on="${i}"] .fd-stc-dots button[data-i="${i}"]{background:#c46b8e;width:22px}#main .fd-stc[data-on="${i}"] .fd-stc-head[data-i="${i}"]{display:flex}`).join('')}#main .fd-stc[data-on="0"] .fd-stc-prev,#main .fd-stc[data-on="${n - 1}"] .fd-stc-next{opacity:.3;pointer-events:none}#main .fd-stc-bar{display:flex;align-items:center;gap:10px;margin:4px 0 12px}#main .fd-stc-bar>button{flex:none;width:36px;height:36px;border-radius:50%;border:1px solid var(--line,#e8e2ea);background:var(--card,#fff);font:inherit;font-size:20px;line-height:1;color:var(--ink,#2b2840);cursor:pointer}#main .fd-stc-heads{flex:1;min-width:0}#main .fd-stc-head{display:none;flex-direction:column;align-items:center;text-align:center}#main .fd-stc-head small{font-size:12.5px;font-weight:700;color:#9b4766;letter-spacing:.02em}#main .fd-stc-head b{font-size:18px;line-height:1.25}#main .fd-stc-here{display:inline-block;margin-left:6px;background:#c46b8e;color:#fff;border-radius:999px;padding:1px 7px;font-size:11px}#main .fd-stc-dots{display:flex;justify-content:center;gap:6px;margin:-4px 0 14px}#main .fd-stc-dots button{width:8px;height:8px!important;min-height:0!important;min-width:0!important;flex:none;border-radius:999px;border:0;padding:0!important;margin:0;background:#ead3dd;cursor:pointer;transition:width .2s}</style>`;
    return css + `<div class="fd-stc" data-on="${Math.max(0, now)}" ontouchstart="this._x=event.touches[0].clientX" ontouchend="const dx=event.changedTouches[0].clientX-(this._x||0);if(Math.abs(dx)>50){this.dataset.on=Math.max(0,Math.min(${n - 1},(+this.dataset.on)+(dx<0?1:-1)))}"><div class="fd-stc-bar"><button class="fd-stc-prev" aria-label="Earlier" onclick="${go('-1')}">‹</button><div class="fd-stc-heads">${slides.map(([when, title], i) => `<div class="fd-stc-head" data-i="${i}"><small>${F(when)}</small><b>${F(title)}</b></div>`).join('')}</div><button class="fd-stc-next" aria-label="Later" onclick="${go('+1')}">›</button></div><div class="fd-stc-dots">${slides.map((_, i) => `<button data-i="${i}" aria-label="Stage ${i + 1}" onclick="this.closest('.fd-stc').dataset.on='${i}'"></button>`).join('')}</div>${slides.map(([, , html], i) => `<section data-i="${i}">${html}</section>`).join('')}</div>`; };
  const lead = t => `<p style="margin:-2px 0 14px;font-size:15px;line-height:1.5;color:var(--muted,#6b6578)">${F(t)}</p>`;
  const fixes = xs => `<div class="fd-fixes">${accs(xs.filter(Boolean).map(([icon, q, body]) => [icon, q, '', body, '', '']))}</div>`;
  P.bf0 = () => { const nurse = nurses(), pump = pumps(), fm = formulaFam(), onlyP = pump && !nurse, mostlyB = fd() === 'Breast milk';
    return qaCss + page(head('Breastfeeding & pumping', 'Your milk is coming in', 'Milk supply builds over the first few days. Here’s what to expect, and how to make it more comfortable.', C.pink)
      + tabbed('#c46b8e', [
        ['Your milk', milkLine('Your milk, the first weeks', [['Days 1–2', 'Colostrum'], ['Days 2–5', 'Milk comes in'], ['Weeks 1–6', 'Supply builds'], ['6–12 weeks', 'Supply settles']], (d => d < 2 ? 0 : d < 5 ? 1 : d < 42 ? 2 : 3)(babyDays()))
          + stageCar([
            ['Days 1–2', 'Colostrum', lead('Your first milk comes in small amounts. It’s thick and sticky, and it’s all he needs right now. What you do now builds your supply.')
          + steps([[nurse ? 'heart' : 'drop', nurse ? 'Feed often' : 'Pump often', nurse ? '8–12 times a day. Every feed tells your body to make more' : '8–12 times a day, both sides'], ['hand', 'Hand express', 'Colostrum is sticky, so it’s often easier by hand than with a pump'], ['cup', 'Give it on a spoon', 'Or a syringe. Every drop counts'], ['sofa', 'Skin to skin', 'Helps ' + (nurse ? 'him feed and ' : '') + 'your milk flow']], true)
          + fixes([['hand', 'How to hand express', [{ html: steps([['hand', 'Place your fingers', 'Thumb above, fingers below, an inch behind the nipple'], ['heart', 'Press back', 'Gently, toward your chest'], ['drop', 'Squeeze, then release', 'Roll thumb and fingers together, slowly'], ['wave', 'Move around', 'To reach every part of the breast']], true) }, '~A few drops at first is normal. It gets easier with practice.']]])],
            ['Days 2–5', 'Your milk comes in', lead('Your breasts feel fuller, heavier and warmer, and the milk turns thinner and whiter. That’s normal.')
          + two(['Normal fullness', 'Heavy and warm. Softens after a ' + (nurse ? 'feed.' : 'session.')], ['Engorged', nurse ? 'Hard, tight and sore. Hard for him to latch.' : 'Hard, tight and sore. Pumping feels harder.', '#fdeee6', '#9a5a3c'])
          + fixes([['snow', 'Very full? What helps, in order', [{ html: tl('In order', [['Before ' + (nurse ? 'a feed' : 'pumping'), 'hand', 'Press your fingertips around the nipple for a minute, or hand express a little, to soften it' + (nurse ? ', so he can latch.' : '.')], [nurse ? 'During the feed' : 'While you pump', 'heart', nurse ? 'Feed often, every 2–3 hours. Let him finish the first side.' : 'Keep to your usual schedule. Start on a low setting.'], ['Right after', 'snow', 'A cold pack on each breast eases the swelling.'], ['In between', 'drop', 'Light strokes toward your armpit. Skip deep massage.'], ['All day', 'shirt', 'A supportive bra that isn’t tight.']]) }]],
            ['shirt', 'Leaking?', ['~Common now, and it eases as your supply settles.', 'Press gently on the nipple when you feel a letdown coming.', 'A milk catcher on the other side saves the milk.']]])],
            ['Weeks 1–6', 'Keep building', lead('The more milk is removed, the more you make. Your body is learning how much he needs.')
          + steps([[nurse ? 'eye' : 'clock', nurse ? 'Feed on cue' : 'Keep a steady routine', nurse ? 'Both sides, whenever he’s hungry' : 'Every 2–3 hours, both sides'], ['moon', 'Keep night ' + (nurse ? 'feeds' : 'sessions'), 'They help build supply'], ['steth', 'Get help early', 'If it hurts, or he’s not gaining']], false)
          + two(['Signs it’s working', (nurse ? 'You hear him swallow, and your breasts feel softer after a feed. ' : 'Your breasts feel softer after pumping. ') + 'His weight is on track' + (mostlyB ? ', with 3 or more yellow poops a day in the first weeks.' : '.')], ['Not a sign of low supply', 'How much you pump, or breasts that feel softer after the first weeks.', '#f5efe3', '#8a6a2c'])],
            ['6–12 weeks', 'It settles', lead('Your body has learned how much he needs, so you make about that much. Softer breasts alone don’t mean less milk, but a real dip can happen now, and it’s usually fixable.')
              + steps([['hand', 'Softer breasts', 'Even before a ' + (nurse ? 'feed' : 'session')], ['shirt', 'Less leaking', 'Some people stop leaking'], ['clock', nurse ? 'Quicker feeds' : 'Steadier output', nurse ? 'He gets milk out faster' : 'Your amounts even out'], ['drop', 'Milder letdowns', 'You may not feel them']], false)
              + two(['Normal now', 'Softer breasts, less leaking, ' + (nurse ? 'shorter feeds' : 'steady pumping amounts') + ', and a fussy day here and there.'], ['Worth a check', 'Fewer wet diapers, slower weight gain, or he seems hungry after most feeds.', '#fdeee6', '#9a5a3c'])
              + fixes([['eye', 'Feels like your milk dropped?', ['~Sometimes it’s just the softer feeling. But a real dip can happen around now too. Common causes:', 'Dropping ' + (nurse ? 'feeds' : 'sessions') + ', or long night stretches, before your supply has settled.', 'Going back to work, with fewer ' + (nurse ? 'feeds or pumps' : 'sessions') + ' in the day.', 'Your period coming back, or birth control with estrogen.', 'Being sick, stressed, or not eating and drinking enough.', '~What helps: remove milk more often for a few days, ' + (nurse ? 'with extra feeds or a pump after a feed' : 'with an extra session or two') + '. A growth spurt (around 6 weeks and 3 months) works the same way, and supply catches up in 2–3 days. Still low after a week? See a lactation consultant.']]])]], (d => d < 2 ? 0 : d < 5 ? 1 : d < 42 ? 2 : 3)(babyDays()))
          + h2('If something hurts') + lead('Breast pain isn’t something to push through. Most of it is quick to fix.')
          + fixes([
            ['heart', 'A tender lump', [{ html: two(['Clogged duct', 'Tender, and you feel well. Keep feeding or pumping, use a cold pack, and skip deep massage.'], ['Call your doctor', 'Red and painful, with a fever or chills.', '#fdeee6', '#9a5a3c']) }, '~Keeps coming back? Sunflower lecithin may help. Ask your doctor or a lactation consultant first.']],
            ['eye', 'A white spot, or a nipple that turns white', ['A white spot is often a milk blister, a tiny blocked pore. Keep feeding or pumping, and don’t pop it.', 'Turning white after ' + (nurse ? 'feeds' : 'pumping') + ' is often from cold. Cover up right away and use warmth.', 'If either hurts or keeps happening, see a lactation consultant.']],
            ['drop', 'Burning or itching', ['~Shiny, pink, burning or itchy nipples can be thrush, a yeast infection, but other things cause it too. White patches in his mouth that don’t wipe off are another clue. See your doctor to find out, since thrush needs treatment for you both.']]])
          + small('Call your doctor', 'for a fever or chills, a red and painful breast, or cracks that don’t heal.')
          + qa([
            ['cup', 'What can I eat and drink?', [{ html: H().tiles([['Caffeine', 'Up to 300 mg a day', 'About 2–3 cups of coffee'], ['Alcohol', 'Best skipped for now', 'Later, wait 2+ hours after a drink'], ['Fish', '8–12 oz a week', 'Low-mercury, like salmon or shrimp'], ['Water', 'A glass each feed', 'Then drink to thirst']]) }, '~No special diet needed. Hungrier and thirstier than usual is normal.']],
            ['drop', 'Do lactation foods or brewer’s yeast help?', ['~There’s little good evidence that brewer’s yeast, oats or lactation cookies raise supply. As food they’re generally fine, so there’s no harm if you enjoy them.', 'What builds supply is removing milk often, by feeding, pumping or hand expressing.', 'Ask your doctor or a lactation consultant before herbal supplements like fenugreek, which can have side effects.']]])],
        nurse && ['Nursing', h2('Holds to try') + `<style>#main .fd-holds .fd-ill{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;margin:0 -16px;padding:0 16px 4px!important;scroll-padding:0 16px;scrollbar-width:none}#main .fd-holds .fd-ill::-webkit-scrollbar{display:none}#main .fd-holds .fd-ill>figure{flex:0 0 46%;scroll-snap-align:start;margin:0}#main .fd-holds-hint{margin:6px 0 4px;font-size:13px;color:var(--muted,#776)}</style><div class="fd-holds">` + illGrid([[ILL.crossCradle(PAL), 'Cross-cradle', 'Easiest to learn on'], [ILL.football(PAL), 'Football', 'Good after a C-section'], [ILL.laidBack(PAL), 'Laid-back', 'Slows a fast flow'], [ILL.cradle(PAL), 'Cradle', 'Once latching is easy']]) + `<p class="fd-holds-hint">${F('Swipe for all 4. In any hold, bring him to you, not you to him.')}</p></div>`
          + h2('How to latch') + steps([['mouth', 'Nose to nipple', 'Head and body in a line'], ['eye', 'Wait for a wide mouth', 'Like a yawn'], ['heart', 'Chin first', 'Bring him in quickly']], true)
          + two(['Good latch', 'Lips flared. Long sucks and swallows. A strong tug, not a pinch.'], ['Shallow latch', 'Clicking, dimpled cheeks, or pinching all feed. Break the seal and try again.', '#fdeee6', '#9a5a3c'])
          + fixes([['eye', 'Watch a good latch', [{ html: hubEmbed('y--syZR0u1E', 'A good latch, step by step', 'Global Health Media') }]]])
          + h2('Through the feed') + tl('', [['Start', 'eye', 'At early cues, before crying.'], ['When he slows', 'hand', 'Burp, then offer the other side.'], fm && ['Still hungry?', 'bottle', 'A small, paced formula top-up. Pump after, when you can.'], ['Next feed', 'clock', 'Start on the last side. A hair tie on your wrist helps you remember.']])
              + fixes([['moon', 'Falling asleep at the breast?', ['Squeeze gently behind the nipple to keep milk flowing.', 'Switch sides. The move wakes him a little.', 'Undress him to his diaper.']],
                ['drop', 'Gulping or coughing?', ['~Milk may be coming fast. Try laid-back, so he feeds against gravity, and let him come off to breathe.']],
                ['heart', 'Sore or cracked nipples?', ['~Some tenderness in the first week is common. Pain all feed usually means a shallow latch.', { html: steps([['mouth', 'Re-latch', 'A finger in his mouth’s corner breaks the seal'], ['drop', 'Soothe', 'Balm or your own milk, after feeds'], ['shield', 'Protect', 'Breast shells between feeds']], false) }, '~Most feeds hurt? See a lactation consultant soon, most insurance covers it. Still sore with a good latch? Ask about tongue-tie.']]])],
        ['Pumping', h2(onlyP ? 'How often to pump' : 'When to start pumping') + tl('', onlyP ? [['Every 2–3 hours', 'drop', '8–12 times a day, about 15–20 minutes each.'], ['At night', 'moon', 'Keep at least one session for now.'], ['Once supply settles', 'clock', 'A lactation consultant can help you drop sessions.']] : [['First weeks', 'heart', 'Nursing builds your supply. Pump only if you need to, like after a top-up.'], ['Around 3–4 weeks', 'bottle', 'Start pumping for a first bottle.'], ['When you’re apart', 'clock', 'Pump about every 3 hours. About 1 oz for each hour apart.']])
          + h2('Each session') + steps([['shirt', 'Set up', 'A hands-free bra and clean parts'], ['eye', 'Check the flange', 'Your nipple moves freely, no rubbing'], ['hand', 'Comfortable suction', 'Stronger isn’t better'], ['clock', '15–20 minutes', 'Until milk slows to drips, plus a minute'], ['fridge', 'Store, then wash', 'Date the milk. Sanitize parts daily at first']], true)
          + fixes([
            ['eye', 'Does my flange fit?', [{ html: two(['Right size', 'Your nipple moves freely in the tunnel, without rubbing.'], ['Wrong size', 'Pinching, rubbing or pain. Ask a lactation consultant to check.', '#fdeee6', '#9a5a3c']) }]],
            ['drop', 'Does pumping hurt?', ['~Usually the flange or the suction.', { html: steps([['eye', 'Check the flange', 'Your nipple should move freely'], ['hand', 'Lower the suction', 'To the highest comfortable level'], ['cup', 'Balm or oil', 'A little inside the tunnel'], ['shield', 'Shells between sessions', 'So your shirt doesn’t rub']], false) }, '~Still hurts? See a lactation consultant.']],
            ['sun', 'Getting less than you hoped?', ['~It varies a lot, especially at first. Look at the whole day, not one session.', nurse ? '~What you pump isn’t a measure of your supply. He gets milk out better than a pump.' : '', { html: tl('To get more', [['Before', 'sun', 'Warmth on your breasts, and a photo or video of him.'], ['While you pump', 'hand', 'Massage and gently squeeze your breast.'], ['At the end', 'drop', 'A minute of hand expression gets the last of it.']]) }, '~Suction dropping? Replace the valves and membranes. Worn parts pump less.']]])
          + h2('How long your milk keeps') + H().tiles([['On the counter', '4 hours', 'Fresh'], ['In the fridge', '4 days', 'At the back, not the door'], ['In the freezer', '6 months', 'Best within 6, fine up to 12'], ['In a cooler', '24 hours', 'With frozen ice packs']])
          + h2('Pumping at night') + steps([['bag', 'A spare set of parts', 'No washing at 3 am'], ['snow', 'A cooler by the bed', 'Move milk to the fridge in the morning']], false)
          + fixes([['heart', 'Ready to stop? How to taper', ['~Slowly, over a few weeks. Three ways, and many people mix them.', { car: [['shorten', 'Shorten', 'Take a few minutes off each session every few days.'], ['space', 'Space out', 'Stretch the time between sessions, little by little.'], ['drop', 'Drop one', 'Once a session is short, drop it. Wait a few days before the next.']] }, 'Feeling full? Pump just until you’re comfortable, then use a cold pack.', 'Your mood can dip as your milk slows. Tell your doctor if it does.']]])]
      ])); };

  P.bot0 = () => { const nurse = nurses(), fm = formulaFam(), b = isBreast();
    return qaCss + page(head('Bottle feeding', 'A simple, safe routine', fm && b ? 'Whether it’s formula, pumped milk or both, here’s how to make bottle feeding work.' : fm ? 'Here’s how to make bottle feeding safe and easy.' : 'Here’s how to give your pumped milk by bottle.', C.lilac)
      + tabbed('#7d6aa8', [
        ['Getting set up', h2('What you’ll need') + steps([['bottle', 'Bottles', nurse && fm ? '2–3 small ones for top-ups' : 'Any shape he takes well'], ['drop', 'Slow-flow nipples', 'The slowest size to start'], ['hand', 'A bottle brush', 'Plus a drying rack']], false)
          + (b ? h2(fm ? 'Making a bottle: breast milk' : 'Making a bottle') + steps([['snow', 'From the fridge', 'Or thawed overnight in the fridge'], ['drop', 'Swirl, don’t shake', 'The fat separates. That’s normal'], ['heart', 'Test on your wrist', 'Or serve it cool']], true) : '')
          + (fm ? h2(b ? 'Making a bottle: formula' : 'Making a bottle') + steps([['hand', 'Wash', 'Your hands, the counter and the bottle'], ['drop', 'Boil the water', 'Then let it sit about 5 minutes'], ['bowl', 'Water first, then powder', 'The amounts on the label. Level scoops'], ['snow', 'Cool and test', 'Under cold water. Warm, not hot, on your wrist'], ['clock', 'Use within 2 hours', 'Or put it in the fridge for up to 24']], true)
              + small('Follow the label exactly.', 'Watered-down or extra-strong formula isn’t safe. Powder isn’t sterile, so the hot water matters under 2 months, for babies born early, or with a weak immune system. Ready-to-feed skips it.')
              + h2('Make night bottles easier') + steps([['bottle', 'Ready-to-feed', 'No mixing at 3 am'], ['drop', 'Water measured out', 'In clean bottles, at room temperature'], ['cube', 'A formula dispenser', 'Scoops portioned ahead']], false) : '')
          + qa([
            fm && ['bowl', 'Which formula should I choose?', ['Any standard, iron-fortified infant formula works.', 'Most babies switch between standard brands without trouble. Check with your pediatrician before a special one.']],
            fm && ['drop', 'Powder, concentrate or ready-to-feed?', [{ html: H().tiles([['Ready-to-feed', 'Pour and feed', 'Sterile until opened. Easiest, costs most'], ['Concentrate', 'Mix with water', 'Sterile until opened. Follow the label'], ['Powder', 'Mix with hot water', 'Not sterile. Costs least']]) }, '~Ask your pediatrician which suits him, and whether your tap water is safe to use.']]])],
        ['Giving a bottle', h2('Paced bottle feeding') + steps([['sit', 'Hold him semi-upright', 'Head higher than his tummy'], ['mouth', 'Touch his lip', 'Let him open and draw it in'], ['bottle', 'Keep it fairly level', 'Just enough milk to fill the tip'], ['clock', 'Pause often', 'Tip it down every few sucks'], ['roll', 'Switch sides halfway', 'So he looks both ways'], ['eye', 'Stop when he’s done', 'Even if milk is left']], true)
          + small('Never prop a bottle.', 'Always hold him and the bottle. Burp every 2–3 oz, and at the end.')
          + h2('Is the nipple right?') + two(['Too slow', 'He sucks hard, gets frustrated, and the nipple flattens.'], ['Too fast', 'He gulps, coughs, or milk spills out.', '#fdeee6', '#9a5a3c'])
          + qa([
            ['clock', 'What if he drinks it very fast?', ['~Pause more often, hold him more upright, and check the nipple. Start with the slowest flow, and go up a size only when he’s clearly frustrated.']],
            nurse && ['bottle', 'What if he won’t take a bottle?', ['~Common for nursed babies.', { html: steps([['heart', 'Someone else offers', 'Ideally with you out of the room'], ['moon', 'Before he’s very hungry', 'Calm is easier'], ['drop', 'A slow-flow nipple', 'Warm milk, and a few days’ patience']], false) }]],
            fm && ['bowl', 'Is it the formula?', [{ html: two(['Usually not the formula', 'Gas, fussing and spit-up happen on any formula.'], ['Worth asking about', 'Blood in his poop, a rash, vomiting after most feeds, or slow weight gain.', '#fdeee6', '#9a5a3c']) }]]])],
        ['Storing & cleaning', (b ? h2('How long breast milk keeps') + storeTable([['Fresh', '4 hours', '4 days', '6 months is best, 12 is fine'], ['Thawed', '1–2 hours', '24 hours', 'Never refreeze'], ['Left after a feed', '2 hours', 'Toss it', 'Toss it']]) : '')
          + (fm ? h2('How long formula keeps') + storeTable([['Made', '2 hours', '24 hours', 'Don’t freeze'], ['Once he starts', '1 hour', 'Toss it', 'Toss it']]) : '')
          + h2('Cleaning, after every feed') + steps([['hand', 'Take apart', 'Bottle, nipple, ring and valve'], ['drop', 'Wash', 'Hot, soapy water and a brush, or the dishwasher'], ['heart', 'Air-dry', 'On a clean rack, not a used towel'], ['snow', 'Sanitize daily', 'Most important under 2 months, born early or with a weak immune system']], true)
          + qa([
            ['snow', 'How do I warm milk?', [{ html: steps([['drop', 'Warm water', 'Or a bottle warmer'], ['hand', 'Swirl and test', 'A few drops on your wrist'], ['snow', 'Or skip it', 'Room temperature or cold is fine']], false) }, '~Skip the microwave. It heats unevenly.']],
            b && ['snow', 'How do I freeze and thaw breast milk?', ['Freeze flat in 2–4 oz bags, so you thaw only what he’ll drink.', 'Leave a little room at the top. Milk expands as it freezes.', 'Thaw in the fridge overnight or in warm water. Use within 24 hours, and don’t refreeze.']],
            ['bag', 'How do I travel with milk?', [fm ? 'Ready-to-feed formula needs no mixing or water.' : '', fm ? 'Or carry powder and water separately, and mix when he’s hungry.' : '', b ? 'A cooler bag with ice packs keeps breast milk for up to 24 hours. It’s allowed through airport security; tell the officer.' : '']],
            b && fm && ['bottle', 'Can I mix breast milk and formula?', ['~Yes, in the same bottle, once the formula is made with water as usual. Don’t mix powder straight into breast milk.']]])]
      ])); };

  P.dig0 = () => { const br = isBreast() && fd() === 'Breast milk', fmOnly = fd() === 'Formula', bot = isBottle();
    return qaCss + page(head('Digestion & comfort', 'Spit-up, gas and noisy tummies are common', 'His tummy is still learning, which brings some normal, and messy, changes.', C.blue)
      + tabbed('#46638c', [
        ['Burping & spit-up', h2('How to burp him') + illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'His chin on a burp cloth'], [ILL.sitting(PALT), 'Sitting on your lap', 'Your hand supports his chin and chest'], [ILL.tummy(PALT), 'Tummy-down', 'Across your lap, with gentle pats']])
          + small(isBreast() && !bot ? 'Burp between sides, and at the end.' : bot && !isBreast() ? 'Burp every 2–3 oz, and at the end.' : 'Burp between sides or every 2–3 oz, and at the end.', 'No burp after a minute or two? Carry on.')
          + h2('Is this much spit-up normal?') + H().tiles([['What matters most', 'Comfortable and growing', 'More than how much comes up'], ['How much', 'A tablespoon or two', 'At a time. Spread out, it looks like more']])
          + small('Not sure?', 'Spill a tablespoon of milk on a burp cloth. It looks bigger than you’d think. Spit-up often peaks around 4 months and is usually gone by 9–12 months.')
          + h2('Spit-up or vomit?') + two(['Spit-up', 'Flows out gently. He’s comfortable and growing.'], ['Vomit', 'Comes out with force, again and again, or looks green or bloody.', '#fdeee6', '#9a5a3c'])
          + qa([
            ['sit', 'What helps with spit-up?', ['Hold him upright for 20–30 minutes after feeds.', 'Smaller feeds, more often.', 'Stop when he slows. Don’t push him to finish.', 'Nothing tight around his tummy.']],
            ['moon', 'Should I raise his crib or use a wedge?', ['~No. Flat on his back for every sleep, even with spit-up. Wedges and inclined sleepers aren’t safe.']],
            ['heart', 'Is it reflux?', ['~Most spit-up is reflux, and it’s normal. It’s worth a call if he cries or arches at most feeds, refuses feeds, or gains slowly. Talk to your pediatrician before changing feeds or formula.']]])],
        ['Gas & crying', h2('Seems gassy? What helps') + steps([['eye', 'Feed early', 'Crying gulps air'], ['smile', 'Burp mid-feed', 'Not just at the end'], ['hand', 'Bicycle his legs', 'Gently, on his back'], ['mat', 'Tummy time', 'When he’s awake and watched']], false)
          + h2('Won’t stop crying? What to do') + steps([['eye', 'Check', 'Hunger, a burp, a diaper, too warm'], ['moon', 'Soothe', 'Swaddle, hold, shush, sway, or a pacifier'], ['heart', 'Step away', 'Lay him on his back somewhere safe']], true) + small('Never shake him.', 'Even when you’re exhausted. Call someone to take over if you need to.')
          + qa([
            ['drop', 'Why is he grunting so much?', ['~Usually it’s normal. He swallows air when he feeds and cries, and his tummy is still learning.', '~Call your pediatrician if he grunts with every breath, seems to struggle to breathe, or isn’t feeding well.']],
            ['clock', 'When does the fussiness ease?', ['~Fussy evenings often peak around 6 weeks, and ease by 3–4 months.']],
            ['bottle', 'Do gas drops or gripe water help?', ['Gas drops are safe but often don’t help much.', 'Ask your pediatrician before trying gripe water.']],
            ['heart', 'What about hiccups?', ['~Common and harmless. They rarely bother him and stop on their own.']]])],
        ['Poop', h2('Poop changes in the first week') + illGrid([[ILL.poop('#2b2622'), 'Days 1–2', 'Black and sticky'], [ILL.poop('#5f6b33'), 'Days 3–4', 'Greenish'], [ILL.poop(br ? '#d4a23a' : fmOnly ? '#b98a4e' : '#c99642'), 'By day 5', br ? 'Yellow and seedy' : fmOnly ? 'Tan, like peanut butter' : 'Yellow to tan']])
          + h2('How often he poops') + H().tiles([['How often', br ? 'After most feeds' : '1–4 a day', br ? 'At first. By 6 weeks, some go days without one' : 'At first, then fewer'], ['What matters', 'Soft', 'More than how often']])
          + small('Very few poops in the first week?', 'It can mean he needs more milk. Worth a call.')
          + h2('Colors to call about') + illGrid([[ILL.poop('#e9e4d6'), 'White or pale', 'Call right away'], [ILL.poop('#b3362c'), 'Red', 'Blood in his poop'], [ILL.poop('#2b2622'), 'Black', 'After the first few days']])
          + small('Normal colors:', 'yellow, green, tan or mustard. Seedy, or a little mucus.')
          + small('Calling about poop?', 'A photo of the diaper helps.')
          + qa([
            ['diaper', 'Is straining a sign of constipation?', ['~Usually not. Grunting and going red while he poops is normal. Hard, pebbly poop is the sign to call about.']],
            !br && ['bowl', 'Does formula change poop?', ['~Yes. Formula poop is usually tan or brown and a bit firmer than breast milk poop.']]])]
      ])); };
  // ---- Newborn, built like Outings (Nov 6): the stage page groups short pages by what a parent is trying to do. ----
  // "How you're feeding" (the methods, like Outings' places), "Day to day" (rows, like Outings' gear), and
  // "When something's up" (symptoms). Each page has one job, in the same shape: what to do, in order; then
  // "When things don't go to plan" as small tiles; then "Good to know" with the answers showing. No tabs.
  const NBC = { milk: ['#fde7ef', '#9b4766', '#f2b8cc', '#f7d9a8'], nurse: ['#fdeef2', '#a24d6a', '#f2b8cc', '#e7cfe9'], pump: ['#f3ecfa', '#6a4f8a', '#d2c2ea', '#f2b8cc'], formula: ['#fff3dc', '#8a6a2a', '#f3d58a', '#e7effc'], bottle: ['#ece8f8', '#5b4f8a', '#c3b8ea', '#fde3d3'],
    spit: ['#e7effc', '#46638c', '#9fb8df', '#d9e5fc'], gas: ['#e2f3f1', '#2f6661', '#a9dbd4', '#fbe6bd'], poop: ['#f5efe3', '#7a5a2c', '#e0c79c', '#f3d58a'], pain: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'], hard: ['#f6e8f3', '#7a4f74', '#e3b8cf', '#f4d6c4'] };
  const NBART = {
    milk: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M20 4c8 10 12 17 12 23a12 12 0 0 1-24 0c0-6 4-13 12-23Z" fill="${c[2]}"/><path d="M52 14c5 6 7 10 7 13a7 7 0 0 1-14 0c0-3 2-7 7-13Z" fill="${c[3]}"/></svg>`,
    nurse: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="22" cy="22" r="16" fill="${c[2]}"/><circle cx="48" cy="26" r="9" fill="${c[3]}"/></svg>`,
    pump: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M6 8h26l-6 12v14H12V20Z" fill="${c[2]}"/><circle cx="50" cy="28" r="7" fill="${c[3]}"/></svg>`,
    formula: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="6" y="8" width="26" height="28" rx="6" fill="${c[2]}"/><rect x="10" y="3" width="18" height="7" rx="3" fill="${c[2]}"/><circle cx="50" cy="28" r="7" fill="${c[3]}"/></svg>`,
    bottle: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="10" y="12" width="18" height="26" rx="7" fill="${c[2]}"/><path d="M15 12q4-11 8 0Z" fill="${c[2]}"/><rect x="40" y="26" width="34" height="8" rx="4" fill="${c[3]}"/></svg>`,
    spit: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 30q10-14 20 0t20 0" stroke="${c[2]}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="64" cy="16" r="7" fill="${c[3]}"/></svg>`,
    gas: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="14" cy="26" r="10" fill="${c[2]}"/><circle cx="34" cy="16" r="7" fill="${c[2]}"/><circle cx="50" cy="8" r="4" fill="${c[3]}"/></svg>`,
    poop: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><ellipse cx="22" cy="31" rx="18" ry="7" fill="${c[2]}"/><ellipse cx="22" cy="21" rx="12" ry="6" fill="${c[2]}"/><ellipse cx="22" cy="12" rx="6" ry="4" fill="${c[3]}"/></svg>`,
    pain: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M22 36C6 26 4 16 10 10s12-2 12 4c0-6 6-10 12-4s4 16-12 26Z" fill="${c[2]}"/><circle cx="54" cy="28" r="6" fill="${c[3]}"/></svg>`,
    hard: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 30h18l6-16 8 22 6-10h14" stroke="${c[2]}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="72" cy="24" r="6" fill="${c[3]}"/></svg>`
  };
  const NBONE = ['#fbeef2', '#9b4766', '#efc3d3', '#f6dcc4'];
  const nbTiles = (title, xs) => { xs = xs.filter(Boolean); return `<h2 class="hub-h2">${F(title)}</h2><div class="oa-places nb-places">${xs.map(([id, label, sub, to]) => { const c = NBONE; return `<button class="oa-place" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="${go('nb_' + (to || id))}"><span class="oa-place-art">${NBART[id](c)}</span><b>${F(label)}</b><small>${F(sub)}</small></button>`; }).join('')}</div>`; };
  const nbRows = (title, xs) => `<h2 class="hub-h2">${F(title)}</h2><div class="hub-list">${xs.filter(Boolean).map(([icon, c, t, sub, id]) => `<button class="hub-row hl-row" style="--hl-bg:${C.pink[0]};--hl-ink:${C.pink[1]}" onclick="${go('nb_' + id)}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(t)}</b><small>${F(sub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`).join('')}</div>`;
  window.NBHOME = () => { const b = isBreast(), nurse = nurses(), fm = formulaFam(), bot = isBottle(), h = H();
    const TONE = { routine: ['#e7effc', '#46638c'], feed: ['#fbe4ec', '#9b4766'], prep: ['#fdeee6', '#9a5a3c'], growth: ['#fff3dc', '#8a6a2a'] };
    const cr = (label, icon, title, sub, area) => h.row({ cat: CAT, icon, title, sub, onclick: go('xa:' + area) }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`).replace('<span class="hub-row-copy">', `<span class="hub-row-copy"><small class="hub-row-eyebrow">${F(label)}</small>`).replace('class="hub-row', `style="--sm-bg:${TONE[area][0]};--sm-ink:${TONE[area][1]}" class="sm-row hub-row`);
    const R = [
      ['A feed, step by step', 'hand', 'From his first cue to the last burp', nurse && fm ? 'Hungry, latch on, burp and switch, top up, full' : nurse ? 'Hungry, latch on, burp and switch, full' : 'Hungry, bottle, burp, full', 'feed'],
      ['His day and night', 'clock', 'Busy evenings, quick and calm nights', 'Day, evening and night', 'routine'],
      bot && ['Bottles, start to finish', 'bottle', 'Make every bottle the same safe way', 'Choose, make, store and clean', 'prep'],
      ['Is he getting enough?', 'leaf', 'Diapers and weight tell you, not ounces', 'How much, diapers, weight, vitamin D', 'growth']];
    const rough = `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go('x_tough')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('heart', CAT)}</span><span class="hub-rough-copy"><b>${F('Feeding challenges')}</b><small>${F('Spit-up, gas, refusing feeds, poop')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    return `<h2 class="hub-h2">${F(stg() === realStage() ? 'How to help Ari feed now' : 'How newborn feeds work')}</h2><div class="hub-list">${R.filter(Boolean).map(r => cr(...r)).join('')}</div>` + rough
      + h.versus('Normal, or time to call?', ['Normal', 'Frequent feeds, fussy evenings, spit-up, grunting.'], ['Call your pediatrician', 'Fewer wet diapers, too sleepy to feed, green vomit, pale poop, or a fever of 100.4°F under 3 months.']); };
  P.nb_off = () => { const b = isBreast();
    const rows = [['moon', 'Nonstop evenings', 'Cluster feeding, and getting through the night', 'eve'], ['bottle', 'Spit-up', 'How much is normal, and burping', 'spit'], ['drop', 'Gas and crying', 'What helps, and when it won’t stop', 'gas'], ['diaper', 'Poop', 'Colors, and how often', 'poop'], b && ['heart', 'Breast or nipple pain', 'Sore nipples, lumps, burning', 'pain'], ['eye', 'Fussy, sleepy or not eating', 'What to try, and who can help', 'hard']].filter(Boolean);
    return qaCss + page(head('Tough feed?', 'What’s going on?', 'Pick what you’re seeing. Most of it is common, and something here helps.', C.pink)
      + `<div class="hub-list">${rows.map(([icon, t, sub, id]) => H().row({ cat: CAT, icon, title: t, sub, onclick: go('nb_' + id) })).join('')}</div>`); };

  // Page building blocks, in Outings' shape.
  const oops = xs => h2('When things don’t go to plan') + steps(xs.filter(Boolean), false);
  const gtk = xs => xs.filter(Boolean).length ? h2('Good to know') + essList(xs.filter(Boolean)) : '';
  const nbPage = (ctx, title, leadT, c, inner) => qaCss + page(head(ctx, title, leadT, C.pink) + inner);

  P.nb_milk = () => { const nurse = nurses(), mostlyB = fd() === 'Breast milk';
    return nbPage('Your milk', 'Your milk, week by week', 'What’s happening, and what helps at each stage.', C.pink,
      milkLine('The first weeks', [['Days 1–2', 'Colostrum'], ['Days 2–5', 'Milk comes in'], ['Weeks 1–6', 'Supply builds'], ['6–12 weeks', 'Supply settles']], (d => d < 2 ? 0 : d < 5 ? 1 : d < 42 ? 2 : 3)(babyDays()))
      + stageCar([
            ['Days 1–2', 'Colostrum', lead('Your first milk comes in small amounts. It’s thick and sticky, and it’s all he needs right now. What you do now builds your supply.')
          + steps([[nurse ? 'heart' : 'drop', nurse ? 'Feed often' : 'Pump often', nurse ? '8–12 times a day. Every feed tells your body to make more' : '8–12 times a day, both sides'], ['hand', 'Hand express', 'Colostrum is sticky, so it’s often easier by hand than with a pump'], ['cup', 'Give it on a spoon', 'Or a syringe. Every drop counts'], ['sofa', 'Skin to skin', 'Helps ' + (nurse ? 'him feed and ' : '') + 'your milk flow']], true)
          + fixes([['hand', 'How to hand express', [{ html: steps([['hand', 'Place your fingers', 'Thumb above, fingers below, an inch behind the nipple'], ['heart', 'Press back', 'Gently, toward your chest'], ['drop', 'Squeeze, then release', 'Roll thumb and fingers together, slowly'], ['wave', 'Move around', 'To reach every part of the breast']], true) }, '~A few drops at first is normal. It gets easier with practice.']]])],
            ['Days 2–5', 'Your milk comes in', lead('Your breasts feel fuller, heavier and warmer, and the milk turns thinner and whiter. That’s normal.')
          + two(['Normal fullness', 'Heavy and warm. Softens after a ' + (nurse ? 'feed.' : 'session.')], ['Engorged', nurse ? 'Hard, tight and sore. Hard for him to latch.' : 'Hard, tight and sore. Pumping feels harder.', '#fdeee6', '#9a5a3c'])
          + fixes([['snow', 'Very full? What helps, in order', [{ html: tl('In order', [['Before ' + (nurse ? 'a feed' : 'pumping'), 'hand', 'Press your fingertips around the nipple for a minute, or hand express a little, to soften it' + (nurse ? ', so he can latch.' : '.')], [nurse ? 'During the feed' : 'While you pump', 'heart', nurse ? 'Feed often, every 2–3 hours. Let him finish the first side.' : 'Keep to your usual schedule. Start on a low setting.'], ['Right after', 'snow', 'A cold pack on each breast eases the swelling.'], ['In between', 'drop', 'Light strokes toward your armpit. Skip deep massage.'], ['All day', 'shirt', 'A supportive bra that isn’t tight.']]) }]],
            ['shirt', 'Leaking?', ['~Common now, and it eases as your supply settles.', 'Press gently on the nipple when you feel a letdown coming.', 'A milk catcher on the other side saves the milk.']]])],
            ['Weeks 1–6', 'Keep building', lead('The more milk is removed, the more you make. Your body is learning how much he needs.')
          + steps([[nurse ? 'eye' : 'clock', nurse ? 'Feed on cue' : 'Keep a steady routine', nurse ? 'Both sides, whenever he’s hungry' : 'Every 2–3 hours, both sides'], ['moon', 'Keep night ' + (nurse ? 'feeds' : 'sessions'), 'They help build supply'], ['steth', 'Get help early', 'If it hurts, or he’s not gaining']], false)
          + two(['Signs it’s working', (nurse ? 'You hear him swallow, and your breasts feel softer after a feed. ' : 'Your breasts feel softer after pumping. ') + 'His weight is on track' + (mostlyB ? ', with 3 or more yellow poops a day in the first weeks.' : '.')], ['Not a sign of low supply', 'How much you pump, or breasts that feel softer after the first weeks.', '#f5efe3', '#8a6a2c'])],
            ['6–12 weeks', 'It settles', lead('Your body has learned how much he needs, so you make about that much. Softer breasts alone don’t mean less milk, but a real dip can happen now, and it’s usually fixable.')
              + steps([['hand', 'Softer breasts', 'Even before a ' + (nurse ? 'feed' : 'session')], ['shirt', 'Less leaking', 'Some people stop leaking'], ['clock', nurse ? 'Quicker feeds' : 'Steadier output', nurse ? 'He gets milk out faster' : 'Your amounts even out'], ['drop', 'Milder letdowns', 'You may not feel them']], false)
              + two(['Normal now', 'Softer breasts, less leaking, ' + (nurse ? 'shorter feeds' : 'steady pumping amounts') + ', and a fussy day here and there.'], ['Worth a check', 'Fewer wet diapers, slower weight gain, or he seems hungry after most feeds.', '#fdeee6', '#9a5a3c'])
              + fixes([['eye', 'Feels like your milk dropped?', ['~Sometimes it’s just the softer feeling. But a real dip can happen around now too. Common causes:', 'Dropping ' + (nurse ? 'feeds' : 'sessions') + ', or long night stretches, before your supply has settled.', 'Going back to work, with fewer ' + (nurse ? 'feeds or pumps' : 'sessions') + ' in the day.', 'Your period coming back, or birth control with estrogen.', 'Being sick, stressed, or not eating and drinking enough.', '~What helps: remove milk more often for a few days, ' + (nurse ? 'with extra feeds or a pump after a feed' : 'with an extra session or two') + '. A growth spurt (around 6 weeks and 3 months) works the same way, and supply catches up in 2–3 days. Still low after a week? See a lactation consultant.']]])]], (d => d < 2 ? 0 : d < 5 ? 1 : d < 42 ? 2 : 3)(babyDays()))
      + gtk([['cup', 'Caffeine', 'Up to 300 mg a day, about 2–3 cups of coffee.'], ['bottle', 'Alcohol', 'Best skipped for now. Later, wait 2+ hours after a drink.'], ['bowl', 'Fish', '8–12 oz a week of low-mercury fish, like salmon or shrimp.'], ['drop', 'Lactation foods and brewer’s yeast', 'Little good evidence they raise supply. Removing milk often is what works. Ask before herbal supplements like fenugreek.']])); };

  P.nb_nurse = () => { const fm = formulaFam();
    return nbPage('Nursing', 'Holds, latch and a feed', 'It takes practice for you both. Most people need a few tries per feed at first.', C.pink,
      h2('Pick a hold') + `<style>#main .fd-holds .fd-ill{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;margin:0 -16px;padding:0 16px 4px!important;scroll-padding:0 16px;scrollbar-width:none}#main .fd-holds .fd-ill::-webkit-scrollbar{display:none}#main .fd-holds .fd-ill>figure{flex:0 0 46%;scroll-snap-align:start;margin:0}#main .fd-holds-hint{margin:6px 0 4px;font-size:13px;color:var(--muted,#776)}</style><div class="fd-holds">` + illGrid([[ILL.crossCradle(PAL), 'Cross-cradle', 'Easiest to learn on'], [ILL.football(PAL), 'Football', 'Good after a C-section'], [ILL.laidBack(PAL), 'Laid-back', 'Slows a fast flow'], [ILL.cradle(PAL), 'Cradle', 'Once latching is easy']]) + `<p class="fd-holds-hint">${F('Swipe for all 4. In any hold, bring him to you, not you to him.')}</p></div>`
      + h2('How to latch') + steps([['mouth', 'Nose to nipple', 'Head and body in a line'], ['eye', 'Wait for a wide mouth', 'Like a yawn'], ['heart', 'Chin first', 'Bring him in quickly']], true)
      + two(['Good latch', 'Lips flared. Long sucks and swallows. A strong tug, not a pinch.'], ['Shallow latch', 'Clicking, dimpled cheeks, or pinching all feed. Break the seal and try again.', '#fdeee6', '#9a5a3c'])
      + fixes([['eye', 'Watch a good latch', [{ html: hubEmbed('y--syZR0u1E', 'A good latch, step by step', 'Global Health Media') }]]])
      + h2('Through a feed') + tl('', [['Start', 'eye', 'At early cues, before crying.'], ['When he slows', 'hand', 'Burp, then offer the other side.'], fm && ['Still hungry?', 'bottle', 'A small, paced formula top-up. Pump after, when you can.'], ['Next feed', 'clock', 'Start on the last side. A hair tie on your wrist helps you remember.']])
      + oops([['moon', 'Dozing off', 'Squeeze behind the nipple, or switch sides'], ['drop', 'Gulping or coughing', 'Lean back, so he feeds against gravity'], ['heart', 'Sore nipples', 'Re-latch. Balm or your milk after feeds']])
      + gtk([['hand', 'Hand expression', 'Softens a full breast so he can latch, and gets out sticky colostrum. Fingers an inch behind the nipple, press back, squeeze, release.'], ['steth', 'Pain all feed, every feed?', 'See a lactation consultant soon. Still sore with a good latch? Ask about tongue-tie.'], !fm && ['bottle', 'A first bottle', 'Around 3–4 weeks, once nursing is going well. Someone else offers pumped milk.']])); };

  P.nb_pump = () => { const nurse = nurses(), onlyP = pumps() && !nurse;
    return nbPage('Pumping', onlyP ? 'Pumping, day to day' : 'When and how to pump', onlyP ? 'Pumping often in the first weeks is what builds your supply.' : 'Nursing builds your supply at first. Pumping comes in when you need a bottle or time apart.', C.lilac,
      h2(onlyP ? 'How often' : 'When to start') + tl('', onlyP ? [['Every 2–3 hours', 'drop', '8–12 times a day, about 15–20 minutes each.'], ['At night', 'moon', 'Keep at least one session for now.'], ['Once supply settles', 'clock', 'A lactation consultant can help you drop sessions.']] : [['First weeks', 'heart', 'Pump only if you need to, like after a top-up.'], ['Around 3–4 weeks', 'bottle', 'Start pumping for a first bottle.'], ['When you’re apart', 'clock', 'About every 3 hours. About 1 oz for each hour apart.']])
      + h2('Each session') + steps([['shirt', 'Set up', 'A hands-free bra and clean parts'], ['eye', 'Check the flange', 'Your nipple moves freely, no rubbing'], ['hand', 'Comfortable suction', 'Stronger isn’t better'], ['clock', '15–20 minutes', 'Until milk slows to drips, plus a minute'], ['fridge', 'Store, then wash', 'Date the milk. Sanitize parts daily at first']], true)
      + h2('How long your milk keeps') + H().tiles([['On the counter', '4 hours', 'Fresh'], ['In the fridge', '4 days', 'At the back, not the door'], ['In the freezer', '6 months', 'Best within 6, fine up to 12'], ['In a cooler', '24 hours', 'With frozen ice packs']])
      + oops([['drop', 'It hurts', 'Check flange size, lower the suction'], ['sun', 'Less than you hoped', 'Warmth first, massage, hand express at the end'], ['hand', 'Suction dropped', 'Replace valves and membranes']])
      + gtk([['eye', 'Flange fit', 'Your nipple should move freely in the tunnel. Pinching or rubbing means a different size. A lactation consultant can check.'], ['moon', 'Pumping at night', 'A spare set of parts means no washing at 3 am, and a cooler by the bed keeps milk until morning.'], ['drop', 'How much you get', 'It varies a lot, especially at first.' + (nurse ? ' It isn’t a measure of your supply. He gets milk out better than a pump.' : ' Look at the whole day, not one session.')], ['heart', 'When you’re ready to stop', 'Taper over a few weeks: shorten sessions, space them out, then drop one at a time. Your mood can dip as milk slows. Tell your doctor if it does.']])); };

  P.nb_formula = () => nbPage('Formula', 'Choosing and making formula', 'Any standard formula works. Making it safely matters most in the first months.', C.peach,
    h2('Making a bottle') + steps([['hand', 'Wash', 'Your hands, the counter and the bottle'], ['drop', 'Boil the water', 'Then let it sit about 5 minutes'], ['bowl', 'Water first, then powder', 'The amounts on the label. Level scoops'], ['snow', 'Cool and test', 'Under cold water. Warm, not hot, on your wrist'], ['clock', 'Use within 2 hours', 'Or put it in the fridge for up to 24']], true)
    + small('Follow the label exactly.', 'Watered-down or extra-strong formula isn’t safe. Powder isn’t sterile, so the hot water matters under 2 months, for babies born early, or with a weak immune system.')
    + h2('Which kind?') + H().tiles([['Ready-to-feed', 'Pour and feed', 'Sterile until opened. Costs most'], ['Concentrate', 'Mix with water', 'Sterile until opened'], ['Powder', 'Mix with hot water', 'Not sterile. Costs least'], ['Any brand', 'Iron-fortified', 'Ask before a special formula']])
    + h2('How long it keeps') + storeTable([['Made', '2 hours', '24 hours', 'Don’t freeze'], ['Once he starts', '1 hour', 'Toss it', 'Toss it']])
    + gtk([['moon', 'Easier nights', 'Ready-to-feed at 3 am, or water measured into clean bottles ahead, with a formula dispenser.'], ['drop', 'Tap water', 'Ask your pediatrician whether your water is safe, and whether to boil it.'], ['bowl', 'Is it the formula?', 'Gas, fussing and spit-up happen on any formula. Blood in his poop, a rash, vomiting after most feeds, or slow weight gain are worth a call.']]));

  P.nb_bottle = () => { const nurse = nurses(), fm = formulaFam(), b = isBreast() && pumps();
    return nbPage('Bottles', fm && isBreast() ? 'Bottles and formula' : 'Giving a bottle', 'Paced feeding lets him lead, like nursing does.', C.lilac,
      (fm && isBreast() ? h2('Making formula') + steps([['hand', 'Wash', 'Your hands, the counter and the bottle'], ['drop', 'Boil the water', 'Then let it sit about 5 minutes'], ['bowl', 'Water first, then powder', 'The amounts on the label. Level scoops'], ['snow', 'Cool and test', 'Warm, not hot, on your wrist'], ['clock', 'Use within 2 hours', 'Or fridge it for up to 24']], true) + small('Follow the label exactly.', 'Powder isn’t sterile, so the hot water matters under 2 months, for babies born early, or with a weak immune system. Ready-to-feed skips it.') : '')
      + (b ? h2('Getting breast milk ready') + steps([['snow', 'From the fridge', 'Or thawed overnight in the fridge'], ['drop', 'Swirl, don’t shake', 'The fat separates. That’s normal'], ['heart', 'Warm or cool', 'Test on your wrist. Skip the microwave']], true) : '')
      + h2('Paced bottle feeding') + steps([['sit', 'Hold him semi-upright', 'Head higher than his tummy'], ['mouth', 'Touch his lip', 'Let him draw it in'], ['bottle', 'Fairly level', 'Just enough milk to fill the tip'], ['clock', 'Pause often', 'Tip it down every few sucks'], ['eye', 'Stop when he’s done', 'Even if milk is left']], true)
      + small('Never prop a bottle.', 'Always hold him and the bottle. Burp every 2–3 oz, and at the end.')
      + h2('Is the nipple right?') + two(['Too slow', 'He sucks hard, gets frustrated, and the nipple flattens.'], ['Too fast', 'He gulps, coughs, or milk spills out.', '#fdeee6', '#9a5a3c'])
      + (b ? h2('How long breast milk keeps') + storeTable([['Fresh', '4 hours', '4 days', '6 months is best, 12 is fine'], ['Thawed', '1–2 hours', '24 hours', 'Never refreeze'], ['Left after a feed', '2 hours', 'Toss it', 'Toss it']]) : '')
      + (fm && isBreast() ? h2('How long formula keeps') + storeTable([['Made', '2 hours', '24 hours', 'Don’t freeze'], ['Once he starts', '1 hour', 'Toss it', 'Toss it']]) : '')
      + h2('Cleaning, after every feed') + steps([['hand', 'Take apart', 'Bottle, nipple, ring and valve'], ['drop', 'Wash', 'Hot, soapy water, or the dishwasher'], ['heart', 'Air-dry', 'On a clean rack'], ['snow', 'Sanitize daily', 'Most important under 2 months, born early or with a weak immune system']], true)
      + oops([nurse && ['bottle', 'Won’t take a bottle', 'Someone else offers, before he’s very hungry'], ['clock', 'Drinks it too fast', 'Pause more, hold him more upright'], ['moon', 'Falls asleep', 'Burp, change sides, then offer again']])
      + gtk([fm && isBreast() && ['bowl', 'Which formula', 'Any standard, iron-fortified formula. Ready-to-feed and concentrate are sterile until opened; powder isn’t, so use the hot-water steps above.'], ['snow', 'Warming', 'Warm water or a bottle warmer, then a few drops on your wrist. Room temperature or cold is fine too.'], b && ['snow', 'Freezing breast milk', 'Flat in 2–4 oz bags, with room at the top. Thaw in the fridge or warm water.'], ['bag', 'Out and about', (fm ? 'Ready-to-feed needs no water. ' : '') + (b ? 'A cooler with ice packs keeps breast milk for up to 24 hours, and it’s allowed through airport security.' : 'Or carry powder and water separately.')], b && fm && ['bottle', 'Mixing breast milk and formula', 'Fine in one bottle, once the formula is made with water as usual.']])); };

  P.nb_day = () => { const nurse = nurses(), b = isBreast();
    const dayHtml = (P.day() || ''), k = dayHtml.indexOf('<div class="hub-card" style="padding:14px 14px 8px">'), e = k >= 0 ? dayHtml.indexOf('<figure', k) : -1, ribbon = k >= 0 && e > k ? dayHtml.slice(k, e) : '';
    return nbPage('A day of feeds', 'Follow his cues, not the clock', 'Newborn feeding is frequent and uneven, day and night.', C.peach,
      h2('What a day can look like') + ribbon + small('An example, not a schedule.', (b ? 'About every 2–3 hours' : 'About every 2–4 hours') + ', counted from the start of a feed. Feeds often take ' + (b && nurse ? '10–20 minutes a side' : '10–20 minutes') + ' at first, but short and long can both be normal.')
      + h2('Hungry, or sucking for comfort?') + two(['Hungry', 'Rooting and fists to his mouth, and it’s been a while. Not sure? Offer a feed.'], ['Comfort', 'He just fed. Try a cuddle or a pacifier' + (nurse ? ', once nursing is going well.' : '.'), '#f5efe3', '#8a6a2c'])
      + h2('Keeping him awake during a feed') + steps([['shirt', 'Undress him', 'Down to his diaper'], ['hand', 'Stroke his feet', 'Or his back'], ['diaper', 'Change his diaper', 'Halfway through'], b && nurse ? ['drop', 'Squeeze gently', 'Behind the nipple, to keep milk flowing'] : ['smile', 'Pause and burp', 'Then offer again']], false)
      + gtk([['sun', 'Waking him to feed', 'Yes, if it’s been about 3 hours, until he’s back to birth weight, usually around 2 weeks.'], ['notepad', 'Keeping count', 'A quick note of feeds' + (b ? ' and the last side' : ' and amounts') + ', plus diapers, helps at first. Stop once things feel settled.']])); };

  P.nb_enough = () => { const nurse = nurses(), fm = formulaFam(), bot = isBottle();
    return nbPage('Getting enough', 'Is he getting enough?', 'Diapers and weight tell you more than minutes or ounces.', C.green,
      h2('How to tell he’s hungry') + cueStrip().replace(F('Hunger cues, early to late'), F('Early to late'))
      + h2('How to tell he’s done') + fullTiles()
      + h2('Wet diapers, the first week') + tl('', [['Days 1–2', 'diaper', 'About 1–2 a day.'], ['Days 3–4', 'diaper', 'About 3–4 a day.'], ['Day 5', 'diaper', 'About 5 a day.'], ['Day 6 on', 'drop', '6 or more a day, pale yellow.']])
      + H().tiles([['Weight', 'Back to birth weight', 'By about 2 weeks. The surest sign'], bot ? (nurse && fm ? ['Top-ups', '1–2 oz', 'Only if he’s still hungry'] : ['Per bottle', '1–3 oz at first', 'Slowly more over the weeks']) : ['Amounts', 'Vary feed to feed', 'Look at the whole day']])
      + gtk([['eye', 'Suddenly extra hungry?', 'Probably a growth spurt, often around 2–3 weeks. Feed more for a few days, and it passes.'], ['steth', 'Your pediatrician’s plan', 'They check his weight in the first days and weeks, and may give you a plan of your own. Follow theirs.']])); };

  P.nb_eve = () => { const b = isBreast(), bot = isBottle();
    return nbPage('Evenings and nights', 'Evenings and nights', 'Nonstop evenings are normal in the first weeks, and they ease.', C.lilac,
      h2('Why evenings feel nonstop') + hubStageStrip({ title: 'A typical evening', items: [['clock', 'Late afternoon', 'Feeds start bunching up'], ['moon', 'Evening', 'Feed after feed for a few hours'], ['smile', 'Later at night', 'Often a longer sleep']], cat: CAT })
      + small('That’s cluster feeding.', b ? 'It doesn’t mean you’re low on milk. It’s how he tells your body to make more.' : 'It’s normal on formula too. It’s how he fills up.')
      + h2('Getting through') + steps([b ? ['roll', 'Switch sides often', 'Keeps milk flowing when he slows'] : ['bottle', 'Smaller bottles', 'More often, not one big one'], ['diaper', 'Change first', 'Before the feed, so he stays sleepy after'], ['moon', 'Dim and quiet at night', 'Save talking and play for the day'], ['heart', 'Take turns', b && bot ? 'One parent does a bottle shift' : b ? 'A partner burps and changes him' : 'So you each get a longer stretch']], false)
      + h2('When it gets easier') + hubAgeTiles({ title: '', items: [['Around 6 weeks', 'Fussy evenings peak', 'Then slowly ease'], ['6–8 weeks', 'Cluster feeding eases', 'Feeds spread out'], ['By 2–3 months', 'A longer night stretch', 'Often 3–5 hours']], cat: CAT })
      + gtk([['clock', 'Days and nights mixed up', 'Bright light, talking and play by day; dim, quiet, boring feeds at night. It sorts itself out over a few weeks.']])); };

  P.nb_spit = () => { const b = isBreast(), bot = isBottle();
    return nbPage('Spit-up', 'Spit-up and burping', 'Most babies spit up. If he’s comfortable and growing, it isn’t a problem.', C.blue,
      h2('How to burp him') + illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'His chin on a burp cloth'], [ILL.sitting(PALT), 'Sitting on your lap', 'Support his chin and chest'], [ILL.tummy(PALT), 'Tummy-down', 'Across your lap']])
      + small(b && !bot ? 'Burp between sides, and at the end.' : bot && !b ? 'Burp every 2–3 oz, and at the end.' : 'Burp between sides or every 2–3 oz, and at the end.', 'No burp after a minute or two? Carry on.')
      + h2('How much is normal?') + H().tiles([['What matters most', 'Comfortable and growing', 'More than how much comes up'], ['How much', 'A tablespoon or two', 'At a time. Spread out, it looks like more']])
      + small('Not sure?', 'Spill a tablespoon of milk on a burp cloth. It looks bigger than you’d think. Spit-up often peaks around 4 months and is gone by 9–12 months.')
      + h2('Spit-up or vomit?') + two(['Spit-up', 'Flows out gently. He’s comfortable and growing.'], ['Vomit', 'Comes out with force, again and again, or looks green or bloody.', '#fdeee6', '#9a5a3c'])
      + oops([['sit', 'Lots after feeds', 'Upright for 20–30 minutes after'], ['clock', 'Big feeds come back', 'Smaller feeds, more often'], ['eye', 'Overfull', 'Stop when he slows']])
      + gtk([['moon', 'Sleep', 'Flat on his back, even with spit-up. Wedges and inclined sleepers aren’t safe.'], ['heart', 'Reflux', 'Most spit-up is reflux, and normal. Call if he cries or arches at most feeds, refuses feeds, or gains slowly.']])); };

  P.nb_gas = () => nbPage('Gas and crying', 'Gas and crying', 'Grunting, gas and fussy evenings are common, and they peak around 6 weeks.', C.green,
    h2('Seems gassy? What helps') + steps([['eye', 'Feed early', 'Crying gulps air'], ['smile', 'Burp mid-feed', 'Not just at the end'], ['hand', 'Bicycle his legs', 'Gently, on his back'], ['mat', 'Tummy time', 'When he’s awake and watched']], false)
    + h2('Won’t stop crying? What to do') + steps([['eye', 'Check', 'Hunger, a burp, a diaper, too warm'], ['moon', 'Soothe', 'Swaddle, hold, shush, sway, or a pacifier'], ['heart', 'Step away', 'Lay him on his back somewhere safe']], true)
    + small('Never shake him.', 'Even when you’re exhausted. Call someone to take over if you need to.')
    + gtk([['drop', 'Grunting', 'Usually normal. Call if he grunts with every breath, struggles to breathe, or isn’t feeding well.'], ['clock', 'When it eases', 'Fussy evenings often peak around 6 weeks, and ease by 3–4 months.'], ['bottle', 'Gas drops and gripe water', 'Gas drops are safe but often don’t help much. Ask before trying gripe water.'], ['heart', 'Hiccups', 'Common and harmless. They stop on their own.']]));

  P.nb_poop = () => { const br = isBreast() && fd() === 'Breast milk', fmOnly = fd() === 'Formula';
    return nbPage('Poop', 'Poop, and what’s normal', 'It changes a lot in the first week, then settles.', C.peach,
      h2('The first week') + illGrid([[ILL.poop('#2b2622'), 'Days 1–2', 'Black and sticky'], [ILL.poop('#5f6b33'), 'Days 3–4', 'Greenish'], [ILL.poop(br ? '#d4a23a' : fmOnly ? '#b98a4e' : '#c99642'), 'By day 5', br ? 'Yellow and seedy' : fmOnly ? 'Tan, like peanut butter' : 'Yellow to tan']])
      + H().tiles([['How often', br ? 'After most feeds' : '1–4 a day', br ? 'At first. Later, some go days without one' : 'At first, then fewer'], ['What matters', 'Soft', 'More than how often']])
      + small('Very few poops in the first week?', 'It can mean he needs more milk. Worth a call.')
      + h2('Colors to call about') + illGrid([[ILL.poop('#e9e4d6'), 'White or pale', 'Call right away'], [ILL.poop('#b3362c'), 'Red', 'Blood in his poop'], [ILL.poop('#2b2622'), 'Black', 'After the first few days']])
      + gtk([['diaper', 'Straining', 'Grunting and going red while he poops is normal. Hard, pebbly poop is worth a call.'], !br && ['bowl', 'On formula', 'Usually tan or brown, and a bit firmer.'], ['eye', 'Calling about poop?', 'A photo of the diaper helps.']])); };

  P.nb_pain = () => { const nurse = nurses(), pump = pumps();
    return nbPage('Breast pain', 'Breast and nipple pain', 'Pain isn’t something to push through. Most of it is quick to fix.', C.pink,
      two(['Common, and fixable', 'Sore nipples in the first week, a shallow latch, a flange that doesn’t fit, a clogged duct.'], ['Call your doctor', 'A fever or chills, a red and painful breast, cracks that don’t heal, or burning pain.', '#fdeee6', '#9a5a3c'])
      + (nurse ? h2('Sore nipples') + steps([['mouth', 'Re-latch', 'A finger in his mouth’s corner breaks the seal'], ['drop', 'Soothe', 'Balm or your own milk, after feeds'], ['shield', 'Protect', 'Breast shells between feeds']], false) : '')
      + (pump ? h2('Pumping hurts') + steps([['eye', 'Check the flange', 'Your nipple should move freely'], ['hand', 'Lower the suction', 'To the highest comfortable level'], ['cup', 'Balm or oil', 'A little inside the tunnel']], false) : '')
      + h2('A tender lump') + two(['Clogged duct', 'Tender, and you feel well. Keep feeding or pumping, use a cold pack, skip deep massage.'], ['Call your doctor', 'Red and painful, with a fever or chills.', '#fdeee6', '#9a5a3c'])
      + gtk([['eye', 'A white spot', 'Often a milk blister. Keep going, and don’t pop it.'], ['snow', 'Nipple turns white', 'Often from cold after ' + (nurse ? 'feeds' : 'pumping') + '. Cover up and use warmth.'], ['drop', 'Burning or itching', 'Can be thrush, but not always. See your doctor, since thrush needs treatment for you both.'], ['heart', 'Lumps that keep coming back', 'Sunflower lecithin may help. Ask your doctor or a lactation consultant first.'], nurse && ['steth', 'Still sore with a good latch', 'Ask a lactation consultant about tongue-tie.']])); };

  P.nb_hard = () => { const b = isBreast(), bot = isBottle();
    return nbPage('Not feeding well', 'When feeds are hard', 'Most hard feeds have a simple cause. Here’s what to try, and when to call.', C.lilac,
      two(['Usually normal', 'Short feeds, fussy evenings, some feeds smaller than others, dozing off mid-feed.'], ['Call your pediatrician', 'Fewer than 6 wet diapers a day after day 6, not back to birth weight by 2 weeks, or too sleepy to feed most times.', '#fdeee6', '#9a5a3c'])
      + h2('Pulling off and fussing') + steps([['eye', 'Feed early', 'Before crying starts'], ['smile', 'Burp, then retry', 'Trapped air feels like full'], bot ? ['bottle', 'Check the nipple', 'Too fast or too slow?'] : ['drop', 'Fast letdown?', 'Lean back, so he feeds against gravity']], false)
      + h2('A stuffy nose') + steps([['drop', 'Clear it first', 'Saline drops and gentle suction'], ['clock', 'Smaller, more often', 'Little feeds add up'], ['sit', 'Keep him upright', 'Breathing is easier']], false)
      + gtk([['diaper', 'Not eating much', 'Short feeds can still be full ones. Watch diapers and weight. ' + (b ? 'A lactation consultant can check the latch.' : 'Your pediatrician can check the bottle and nipple.')], b && ['heart', 'Lactation consultant', 'For latch, pain and supply. Most insurance covers it.'], ['steth', 'Your pediatrician', 'For weight and feeds, any time you’re unsure.'], ['smile', 'How you’re doing', 'If you feel low or overwhelmed most days, tell your doctor. You can also call or text 1-833-852-6262.']])); };
  // ---- Newborn in five categories, calm text-first layout (Nov 6, from Yarden's reference screens). ----
  // Plain title and lead (no hero card), tinted summary cards with checks, small line icons without circles,
  // numbered text steps, segmented pickers, nav rows to short reference pages, and questions folded at the end.
  // Same building blocks as the rest of the app: hero card, section headings, icon steps, tiles, versus cards,
  // tip cards, rows and folded questions. Only the order and grouping follow the reference layout.
  const kI = icon => hubArt(icon, CAT);
  const kH = (t, sub) => h2(t) + (sub ? lead(sub) : '');
  const kP = t => `<p class="care-p" style="margin:0 0 10px">${F(t)}</p>`;
  const kMute = t => lead(t);
  const kChecks = xs => checks(xs.filter(Boolean).map(([t, s]) => s ? t + '. ' + s : t));
  const kOl = (xs, label) => `<section class="ss-do" style="--ss-bg:${C.pink[0]};--ss-ink:${C.pink[1]}">${label ? `<b>${F(label)}</b>` : ''}<ol class="ss-do-list" style="padding-left:20px;margin:${label ? '6px' : '0'} 0 0">${xs.filter(Boolean).map(([t, s]) => `<li style="margin:0 0 6px">${F(t)}${s ? (/^[.,]/.test(s) ? F(s) : ` ${F(s)}`) : ''}</li>`).join('')}</ol></section>`;
  const kRows = xs => essList(xs.filter(Boolean));
  const kCard = (icon, title, inner) => h2(title) + inner;
  const kQ = (q, inner) => accs([['eye', q, '', [{ html: inner }], '', '']]);
  const kQs = (title, xs) => { xs = xs.filter(Boolean); return xs.length ? (title ? h2(title) : '') + accs(xs.map(([q, a]) => ['', q, '', [].concat(a).map(x => x[0] === '<' ? { html: x } : '~' + x), '', ''])) : ''; };
  const kNav = xs => `<div class="hub-list">${xs.filter(Boolean).map(([icon, t, s, id]) => `<button class="hub-row hl-row" style="--hl-bg:${C.pink[0]};--hl-ink:${C.pink[1]}" onclick="${go('nb_' + id)}"><span class="fd-dot" style="width:42px;height:42px;border-radius:13px;background:var(--hl-bg);color:var(--hl-ink);padding:9px;box-sizing:border-box;flex:none;display:grid;place-items:center">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(t)}</b><small>${F(s)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`).join('')}</div>`;
  const kTwo = (a, b2) => two(a, [b2[0], b2[1], '#fdeee6', '#9a5a3c']);
  const kTbl = rows => tl('', rows.map(([a, b2]) => [a, 'clock', b2]));
  const kDiv = () => '';
  const kPick = (items) => { items = items.filter(Boolean); return items.length === 1 ? items[0][1] : tabbed('#c46b8e', items); };
  const kPage = (title, leadT, inner) => cPage(title, title, leadT, inner);
  Object.assign(HEADART, { 'Feeding skills': () => ART.drops(4), 'Milk and preparation': () => ART.drops(4), 'Nutrition and growth': () => ART.diapers(6), 'Feeding challenges': () => ART.bottle(.45), 'Expressing milk': () => ART.drops(4), 'Hand expression': () => ART.drops(3), 'Preparing formula': () => ART.bottle(.55), 'Storing milk safely': () => ART.bottle(.55), 'Cleaning equipment': () => ART.bottle(.45) });
  const kHolds = () => `<style>#main .fd-holds .fd-ill{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;margin:0 -16px;padding:0 16px 4px!important;scroll-padding:0 16px;scrollbar-width:none}#main .fd-holds .fd-ill::-webkit-scrollbar{display:none}#main .fd-holds .fd-ill>figure{flex:0 0 46%;scroll-snap-align:start;margin:0}</style><div class="fd-holds">` + illGrid([[ILL.crossCradle(PAL), 'Cross-cradle', 'Easiest to learn on'], [ILL.football(PAL), 'Football', 'Good after a C-section'], [ILL.laidBack(PAL), 'Laid-back', 'Slows a fast flow'], [ILL.cradle(PAL), 'Cradle', 'Once latching is easy']]) + lead('Swipe for all four.') + `</div>`;
  // 1. Feeding routine
  // Compact building blocks, same look as the app: small tinted icons, list rows in one card, thin folded questions.
  const CCSS = `<style>
#main .nbc .hub-h2{margin:22px 0 4px}
#main .nbc .c-lead{margin:0 0 10px;font-size:15px;line-height:1.45;color:var(--muted,#6b6578)}
#main .nbc .c-list{list-style:none;margin:0 0 12px;padding:4px 14px;background:var(--card,#fff);border:1px solid var(--line,#efe8ea);border-radius:18px}
#main .nbc .c-list li{display:grid;grid-template-columns:28px 1fr;gap:12px;align-items:start;padding:10px 0;border-top:1px solid var(--line,#f2ecee)}
#main .nbc .c-list li:first-child{border-top:0}
#main .nbc .c-list li>i{width:28px;height:28px;border-radius:9px;background:${C.pink[0]};color:${C.pink[1]};display:grid;place-items:center;font-style:normal;font-size:13px;font-weight:700;padding:5px;box-sizing:border-box}
#main .nbc .c-list li>i svg{width:18px;height:18px}
#main .nbc .c-list b{display:block;font-size:15px;font-weight:600;line-height:1.35}
#main .nbc .c-list small{display:block;font-size:13.5px;line-height:1.4;color:var(--muted,#6b6578);margin-top:1px}
#main .nbc .hub-tiles{gap:8px}#main .nbc .hub-fig-title:empty{display:none}#main .nbc .c-grid{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:14px 16px;background:var(--card,#fff);border:1px solid var(--line,#efe8ea);border-radius:20px;padding:16px;margin:0 0 12px}#main .nbc .c-grid-art{position:absolute;top:-14px;right:16px;width:44px;height:44px;border-radius:50%;background:#fff;display:grid;place-items:center;padding:10px;box-sizing:border-box;box-shadow:0 2px 8px rgba(80,40,60,.08)}#main .nbc .c-grid{padding-top:20px}#main .nbc .c-grid b{display:block;font-size:15px;font-weight:600;line-height:1.3}#main .nbc .c-grid small{display:block;font-size:13.5px;line-height:1.4;color:var(--muted,#6b6578);margin-top:2px}
</style>`;
  const cGrid = (xs, icon, tint) => `<div class="c-grid"${tint ? ` style="background:${tint[0]};border-color:transparent"` : ''}>${icon ? `<span class="c-grid-art" style="color:${tint ? tint[1] : C.pink[1]}">${hubArt(icon, CAT)}</span>` : ''}${xs.filter(Boolean).map(([, t, sub]) => `<div><b>${F(t)}</b><small>${F(sub)}</small></div>`).join('')}</div>`;
  const cDo = (label, xs) => `<section class="ss-do" style="--ss-bg:${C.pink[0]};--ss-ink:${C.pink[1]}"><b>${F(label)}</b><ul class="ss-do-list">${xs.filter(Boolean).map(t => `<li>${F(t)}</li>`).join('')}</ul></section>`;
  const cLead = t => `<p class="c-lead">${F(t)}</p>`;
  const cList = (xs, numbered) => `<ul class="c-list">${xs.filter(Boolean).map((x, i) => `<li><i>${numbered ? i + 1 : hubArt(x[0], CAT)}</i><span><b>${F(numbered ? x[0] : x[1])}</b>${(numbered ? x[1] : x[2]) ? `<small>${F(numbered ? x[1] : x[2])}</small>` : ''}</span></li>`).join('')}</ul>`;
  const cPage = (ctx, title, leadT, inner) => `<div class="nbc"><style>#main .nbc .fd-acc summary .fd-acc-ico{display:none}#main .nbc .care-p{margin-top:12px!important}#main .nbc .ss-do{margin-top:12px}</style>` + nbPage(ctx, title, leadT, C.pink, tabCss + illCss + irowsCss + CCSS + inner) + `</div>`;

  HEADART['Feeding routine'] = () => ART.often(5); HEADART['Milk and preparation'] = () => ART.bottle(.55); HEADART['How to feed'] = () => ART.drops(4); HEADART['Nutrition and growth'] = () => ART.diapers(6);
  // 1. Feeding routine: when to feed, read by cues, and how the days and nights go.
  P.nb_routine = () => { const nurse = nurses(), b = isBreast(), bot = isBottle(), fm = formulaFam();
    const dayHtml = (P.day() || ''), k0 = dayHtml.indexOf('<div class="hub-card" style="padding:14px 14px 8px">'), e0 = k0 >= 0 ? dayHtml.indexOf('<figure', k0) : -1, ribbon = k0 >= 0 && e0 > k0 ? dayHtml.slice(k0, e0) : '';
    return cPage('Feeding routine', b ? 'Feed when he’s hungry, about every 2–3 hours' : 'Feed when he’s hungry, about every 2–4 hours', 'Around the clock for now. His cues tell you when to start and when to stop.',
      `<section class="hub-card" style="padding:16px 16px 12px;margin:0 0 12px"><b style="display:block;font-size:17px;margin:0 0 10px">${F('A day of feeds')}</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><strong style="display:block;font-size:28px;line-height:1.1">${b ? '8–12' : '6–10'}</strong><small style="display:block;color:var(--muted,#6b6578);font-size:13.5px;margin-top:3px">${F('Feeds a day')}</small></div><div><strong style="display:block;font-size:28px;line-height:1.1">${b ? '2–3 hrs' : '2–4 hrs'}</strong><small style="display:block;color:var(--muted,#6b6578);font-size:13.5px;margin-top:3px">${F('From the start of one feed')}</small></div></div>${(h => { const t = document.createElement('div'); t.innerHTML = h; return t.innerHTML; })(ribbon.replace('<div class="hub-card" style="padding:14px 14px 8px">', '<div style="padding:10px 0 0;margin-top:10px;border-top:1px solid var(--line,#f0e8eb)">'))}<p style="margin:10px 0 0;font-size:14px;line-height:1.45"><b>${F('At night')}</b> ${F('keep it quick and calm: dim light, no play, and a diaper change only if needed. Bright days and dark nights help him sort day from night.')}</p></section>`
      + h2('Start at his hunger cues') + cueStrip().replace(`<b class="hub-fig-title">${F('Hunger cues, early to late')}</b>`, '')
      + kP('Just fed and still fussing? He may want comfort, not milk. Try a cuddle' + (nurse ? '.' : ' or a pacifier.'))
      + h2('Stop when he’s full') + fullTiles()
      + h2('Some newborns need waking') + cLead('Until he’s back to birth weight, if 3 hours pass, wake him for a feed.')
      + cDo('Try this', ['Undress him down to his diaper.', 'Stroke his feet or back, gently.', 'Change his diaper midway through.', b && nurse ? 'Squeeze gently behind the nipple to keep milk flowing.' : 'Pause, burp, then offer again.'])
      + h2('Evenings can be nonstop') + cLead('Feed after feed for a few hours is called cluster feeding. It’s normal, and it passes.')
      + cDo('What helps', [b ? 'Switch sides often.' : 'Offer smaller bottles, more often.', 'Change his diaper before the feed, so he stays sleepy after.', 'Take turns, so you each get a longer stretch.'])
      + h2('How it changes') + hubStageStrip({ title: '', items: [['clock', 'Around 6 weeks', 'Fussy evenings peak, then ease'], ['moon', '6–8 weeks', 'Cluster feeding eases'], ['smile', '2–3 months', 'A longer night stretch']], cat: CAT })
      + small('Worth a call:', 'too sleepy to feed most times, or hard to wake for feeds.')); };

  // 2. How to feed: one tab per way the family feeds, plus burping.
  P.nb_skills = () => { const nurse = nurses(), bot = isBottle(), fm = formulaFam(), b = isBreast();
    return cPage('How to feed', nurse ? 'A deep latch makes every feed easier' : 'Slow, paced bottles, with burps along the way', 'It takes practice for both of you. Here’s each step.', kPick([
      nurse && ['Nursing', kH('Find a hold', 'Get comfortable first: a pillow under him, your feet up, so you bring him to you.') + kHolds()
        + h2('Latch, step by step') + kOl([['Nose to nipple.', 'Keep his head and body in a line.'], ['Wait for a wide mouth,', 'like a yawn.'], ['Bring him in, chin first,', 'close to you.']], 'Step by step')
        + kTwo(['Good latch', 'Flared lips, long sucks and swallows, a strong tug rather than pinching.'], ['Adjust the latch', 'Clicking, dimpled cheeks or pinching that lasts. Break the seal with a finger and try again.'])
        + hubEmbed('y--syZR0u1E', 'A good latch, step by step', 'Global Health Media')
        + h2('Through a feed') + tl('', [['Start', 'eye', 'At early hunger cues. Often 10–20 minutes a side at first.'], ['When he slows', 'hand', 'Burp, then offer the other side. Some feeds take one side, some both.'], fm && ['Still hungry?', 'bottle', 'A small, paced formula top-up.'], ['Next feed', 'clock', 'Start on the last side.']])
        + cDo('If it’s not going smoothly', ['Dozing off: squeeze gently behind the nipple, or switch sides.', 'Gulping or coughing: lean back, so he feeds against gravity.', 'Too sleepy to latch in the first days: give a few drops of hand-expressed colostrum on a spoon.', 'Clicking or slipping off: re-latch deeper.'])
        + small('Worth a call:', 'most feeds hurt, he keeps slipping off, or he isn’t back to birth weight by 2 weeks. A lactation consultant can help, and can check for tongue-tie.') + (!bot ? small('A first bottle?', 'Around 3–4 weeks, once nursing is going well. Have someone else offer it, before he’s very hungry.') : '')],
      bot && ['Bottles', kH('Paced bottle feeding', 'Let him set the pace, like nursing. It helps him notice when he’s full.')
        + kOl([['Hold him semi-upright.'], ['Touch his lip,', 'let him draw the nipple in.'], ['Keep the bottle fairly level,', 'milk just in the tip.'], ['Pause every few sucks.'], ['Stop when he’s done,', 'even if milk is left.']], 'Step by step')
        + H().tiles([[nurse && fm ? 'Top-ups' : 'Per bottle', nurse && fm ? '1–2 oz' : '1–3 oz', 'At first'], ['Burp', 'Every 2–3 oz', 'And at the end']])
        + h2('Is the nipple flow right?') + two(['Too slow', 'Works hard, frustrated, nipple flattens.'], ['Too fast', 'Gulping, coughing, milk spilling.', '#fdeee6', '#9a5a3c'])
        + cDo('Good to know', ['Any bottle he takes well works, wide or narrow, with a slow-flow nipple.', 'Falls asleep mid-bottle? Burp, then offer again. If he’s done, that’s fine.', nurse && 'Won’t take a bottle? Have someone else offer it, before he’s very hungry.', b && fm && 'Breast milk and formula can share a bottle, once the formula is mixed with water.'])
        + small('Never prop a bottle.', 'Always hold him while he feeds.')],
      ['Burping', kH('Three ways to burp', 'Support his head and neck, then pat or rub his back.')
        + illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'Chin on a burp cloth'], [ILL.sitting(PALT), 'Sitting on your lap', 'Support chin and chest'], [ILL.tummy(PALT), 'Tummy-down', 'Across your lap']])
        + cDo('When and how', [(b && bot ? 'Between sides, or every 2–3 oz' : b ? 'Between sides' : 'Every 2–3 oz') + ', and at the end.', 'Firm pats or slow circles on his back.', 'No burp after a minute or two? Carry on.'])
        + kP('A little spit-up with a burp is common. Hiccups are harmless, and stop on their own.')]])); };

  // 3. Milk and preparation: what's in his milk, then making it, keeping it and cleaning up. All on one page.
  P.nb_prep = () => { const pump = pumps(), fm = formulaFam(), b = isBreast(), bot = isBottle() || pump;
    const kind = b && fm ? two(['Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['Formula', 'Gives him everything he needs to grow. Any standard, iron-fortified one works.']) + small('Using both is fine.', 'Any amount of breast milk is good for him, and formula fills the gap.')
      : b ? two(['Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['Plus vitamin D', 'Drops every day, from the first days.'])
      : two(['Formula', 'Gives him everything he needs to grow, vitamin D and iron included.'], ['Any standard one', 'Iron-fortified. No need for a special one unless your pediatrician suggests it.']);
    return cPage('Milk and preparation', bot ? 'Make every bottle the same safe way' : stg() >= 3 ? 'Breast milk still matters alongside food' : 'Breast milk is all he needs for now', bot ? 'What’s in his milk, how to make a bottle, and how long it keeps.' : 'And how to keep it, if you ever express a bottle.',
      h2(b && fm ? 'Breast milk and formula' : 'What’s in his milk') + kind
      + (fm ? h2(pump ? 'Making a formula bottle' : 'Making a bottle') + kOl([['Wash', 'your hands, the counter and the bottle.'], ['Boil the water,', 'then let it sit about 5 minutes.'], ['Water first, then powder,', 'as the label says. Level scoops.'], ['Cool and test.', 'Warm, not hot, on your wrist.']], 'Step by step')
        + small('Why hot water?', 'Powder isn’t sterile, and young babies are most at risk. Ready-to-feed is sterile, and the easiest at 3 am.') : '')
      + (pump ? h2('Getting breast milk ready') + kOl([['Use the oldest milk first,', 'from the fridge, or thawed there overnight.'], ['Swirl, don’t shake.', 'Separating is normal.'], ['Warm or cool is fine.', 'Test a few drops on your wrist.']], 'Step by step') : '')
      + h2(bot ? 'How long it keeps' : 'If you express a bottle')
      + (b ? (fm ? kH('Breast milk') : '') + storeTable([['Fresh', '4 hours', '4 days', '6 months'], ['Thawed', '1–2 hours', '24 hours', 'Never refreeze']]) : '')
      + (fm ? (b ? kH('Formula') : '') + storeTable([['Made', '2 hours', '24 hours', 'Don’t freeze']]) : '')
      + cDo('Keep it safe', ['Once he starts a bottle, use it within ' + (b && !fm ? '2 hours' : fm && !b ? '1 hour' : '1–2 hours') + ', then toss what’s left.', 'Never microwave. It heats unevenly.', 'Out and about: a cooler with ice packs' + (b ? ' keeps breast milk up to 24 hours' : '') + (fm ? (b ? '. Carry' : ', or carry') + ' formula powder and water separately.' : '.')])
      + h2('Cleaning') + cDo('After every feed', ['Take it all apart' + (pump ? ', pump parts too.' : '.'), 'Wash in hot, soapy water or the dishwasher, then air-dry.', 'Sanitize once a day for the first months: boil 5 minutes, steam, or a sanitize cycle.'])); };

  P.nb_express = () => { const nurse = nurses(), pump = pumps();
    return cPage(pump ? 'Expressing milk' : 'Hand expression', pump ? 'Getting milk out, by pump or by hand' : 'A handy skill for the first days', pump ? 'Pumping, hand expression and getting milk ready.' : 'Handy for softening a full breast so he can latch, and for saving colostrum.',
      (pump ? kH(nurse ? 'When to pump' : 'How often') + kTbl(nurse ? [['First weeks', 'Only if you need to, like after a top-up.'], ['3–4 weeks', 'Start pumping for a first bottle.'], ['Apart', 'About every 3 hours.']] : [['Every 2–3 hours', '8–12 times a day, 15–20 minutes each.'], ['At night', 'Keep at least one session for now.']])
        + h2('Each session') + kOl([['Set up', 'with a hands-free bra and clean parts.'], ['Check the flange.', 'Your nipple should move freely.'], ['Use comfortable suction.', 'Stronger isn’t better.'], ['Pump 15–20 minutes,', 'until milk slows to drips.'], ['Date the milk,', 'then fridge or freezer.']], 'Step by step') : '')
      + (pump ? h2('Hand expression') : '') + kOl([['Place your fingers', 'an inch behind the nipple, thumb above.'], ['Press back', 'gently, toward your chest.'], ['Squeeze, then release,', 'slowly, in a rhythm.'], ['Move around', 'to reach every part of the breast.']], 'Step by step')
      + (pump ? h2('Getting breast milk ready') + kOl([['Take it from the fridge,', 'or thaw it overnight there.'], ['Swirl, don’t shake.', 'Separating is normal.'], ['Warm or cool is fine.', 'Test on your wrist. Skip the microwave.']], 'Step by step') : '')
      + kQs('Common issues', [pump && ['Pumping hurts', 'Usually the flange size or the suction. Check the fit, lower the suction, and try a little balm or oil inside the tunnel. Still hurts? See a lactation consultant.'], pump && ['Getting less than you hoped', 'It varies a lot, especially at first. Warmth before, massage during, and a minute of hand expression at the end all help.' + (nurse ? ' What you pump isn’t a measure of your supply.' : '')], pump && ['Suction dropped', 'Replace the valves and membranes. Worn parts pump less.'], ['Only drops at first', 'Normal in the first days. Colostrum comes in small amounts.']])); };

  P.nb_mix = () => cPage('Choosing formula', 'Any standard, iron-fortified formula works', 'No need for a special one unless your pediatrician suggests it.',
    h2('Which kind?') + cDo('Three kinds', ['Ready-to-feed: pour and feed. Sterile until opened, costs most.', 'Concentrate: mix with water. Sterile until opened.', 'Powder: mix with hot water. Not sterile, costs least.'])
    + kP('Follow the label exactly. Watered-down or extra-strong formula isn’t safe.')
    + kQs('Good to know', [['Is tap water safe?', 'Ask your pediatrician whether your water is safe, and whether to boil it.'], ['Can I switch brands?', 'Most babies switch between standard brands without trouble. Check before a special formula.'], ['Is it the formula?', 'Gas, fussing and spit-up happen on any formula. Blood in his poop, a rash, vomiting after most feeds or slow weight gain are worth a call.']]));

  P.nb_store = () => { const pump = isBreast(), fm = formulaFam();
    return cPage('Storing and warming milk', 'How long milk keeps', 'How to warm it, and what to do with leftovers.',
      (pump ? kH('Breast milk') + storeTable([['Fresh', '4 hours', '4 days', '6 months is best'], ['Thawed', '1–2 hours', '24 hours', 'Never refreeze'], ['After a feed', '2 hours', 'Toss it', 'Toss it']]) : '')
      + (fm ? kH('Formula') + storeTable([['Made', '2 hours', '24 hours', 'Don’t freeze'], ['Once he starts', '1 hour', 'Toss it', 'Toss it']]) : '')
      + kQs('Good to know', [pump && ['Freezing breast milk', 'Flat in 2–4 oz bags, with a little room at the top. Thaw in the fridge overnight or in warm water.'], ['Warming a bottle', 'Warm water or a bottle warmer, then test on your wrist. Room temperature or cold is fine too. Skip the microwave.'], ['Out and about', (fm ? 'Ready-to-feed needs no water. ' : '') + (pump ? 'A cooler with ice packs keeps breast milk for up to 24 hours, and it’s allowed through airport security.' : 'Or carry powder and water separately.')]])); };

  P.nb_clean = () => cPage('Cleaning equipment', 'Wash after every feed', 'And sanitize a little extra in the first months.',
    h2('After every feed') + kOl([['Take it all apart', pumps() ? ', pump parts too.' : '.'], ['Wash', 'in hot soapy water, or the dishwasher.'], ['Air-dry', 'on a clean rack, not a used towel.']], 'Step by step')
    + small('Sanitize once a day:', 'Boil for 5 minutes, steam, or use the dishwasher’s sanitize setting. Most important under 2 months, for babies born early, or with a weak immune system.'));

  // 4. Nutrition and growth
  P.nb_growth = () => { const fm = formulaFam(), b = isBreast(), br = b && fd() === 'Breast milk', fmOnly = fd() === 'Formula';
    const d = babyDays(), now = d < 2 ? 0 : d < 4 ? 1 : d < 5 ? 2 : 3;
    const diaperSvg = n => `<svg viewBox="0 0 144 22" style="display:block;width:100%;max-width:150px;height:auto" aria-hidden="true">${Array.from({ length: 6 }, (_, i) => { const on = i < n, x = i * 24 + 1; return `<path d="M${x} 2h21v5c0 7-5 12-10.5 12S${x} 14 ${x} 7Z" fill="${on ? '#f2b8cc' : '#f6f1f3'}" stroke="${on ? '#c46b8e' : '#e6dde1'}" stroke-width="1.4"/><path d="M${x} 6.5h21" stroke="${on ? '#c46b8e' : '#e6dde1'}" stroke-width="1.4"/>`; }).join('')}</svg>`;
    const poopSvg = col => `<svg viewBox="0 0 64 44" style="display:block;width:60px;height:42px" aria-hidden="true"><path d="M12 38 C8 28 18 22 24 24 C24 14 36 12 40 21 C50 21 56 30 50 38 Z" fill="${col}"/></svg>`;
    const day = (wetLo, wetHi, wetLabel, col, poop, sub) => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px">`
      + `<div style="background:#fbeef2;border-radius:16px;padding:12px"><small style="display:block;font-size:12.5px;color:#9b4766;font-weight:600">${F('Wet diapers')}</small><div style="margin:10px 0 8px">${diaperSvg(wetHi)}</div><b style="font-size:20px">${F(wetLabel)}</b><small style="display:block;font-size:12.5px;color:var(--muted,#776)">${F('A day')}</small></div>`
      + `<div style="background:#f7f2ec;border-radius:16px;padding:12px"><small style="display:block;font-size:12.5px;color:#7a5a2c;font-weight:600">${F('Poop')}</small><div style="margin:4px 0 2px">${poopSvg(col)}</div><b style="font-size:16px;line-height:1.25;display:block">${F(poop)}</b><small style="display:block;font-size:12.5px;color:var(--muted,#776)">${F(sub)}</small></div></div>`;
    const ylw = br ? '#d4a23a' : fmOnly ? '#b98a4e' : '#c99642';
    return cPage('Nutrition and growth', 'Diapers and weight tell you he’s getting enough', 'You don’t need to measure every feed. Here’s what to watch instead.',
      h2('How much he needs') + lead('His stomach is tiny at first, and grows fast.') + H().tiles([['Day 1', '1–2 tsp', 'A feed. About a marble'], ['Day 3', 'About 1 oz', 'About a walnut'], ['Week 1', '1½–2 oz', 'About an apricot'], ['Weeks 2–4', '2–4 oz', 'About an egg']])
      + (nurses() ? kP('Nursing? You won’t see ounces, and that’s fine. Diapers and weight tell you more.') : '')
      + h2('Diapers in the first week') + lead('Wet diapers and poop change together as he takes in more milk.')
      + `<section class="hub-card" style="padding:14px 16px 16px;margin:0 0 12px">` + stageCar([['Days 1–2', 'First days', day(1, 2, '1–2', '#2b2622', 'Black and sticky', 'His first poop')], ['Days 3–4', 'Changing', day(3, 4, '3–4', '#5f6b33', 'Greenish', 'Getting lighter')], ['Day 5', 'Getting lighter', day(5, 5, 'About 5', ylw, fmOnly ? 'Turning tan' : 'Turning yellow', 'Lighter each day')], ['Day 6 on', 'Settled', day(6, 6, '6 or more', ylw, br ? 'Yellow and seedy' : fmOnly ? 'Tan, like peanut butter' : 'Yellow to tan', 'How often varies')]], now) + `</section>`
      + kP('A quick note of feeds and diapers helps in the first week. Stop once things feel settled.')
      + h2('Weight') + H().tiles([['First few days', 'Some loss', 'Up to about 10% is common'], ['By about 2 weeks', 'Back to birth weight', 'The surest sign it’s going well']])
      + kP('Extra hungry for a few days? Often a growth spurt, around 2–3 weeks. Feed more often, and it passes.')
      + h2('Vitamin D and iron') + H().tiles([['Vitamin D', b ? '400 IU a day' : 'In the formula', b ? 'Drops, from the first days' : 'Drops until he drinks about 32 oz a day'], ['Iron', fm ? 'In the formula' : isEarly() ? 'From about 1 month' : (ageMo() < 4 ? 'Ask at 4 months' : 'Ask at the next checkup'), fm ? 'Choose one with iron' : isEarly() ? 'Drops, for babies born early' : 'Breast milk is low in iron']])
      + cDo('Giving drops', [(nurses() ? 'Drip it on the nipple just before a feed, or slowly inside his cheek.' : 'Drip it slowly inside his cheek.'), 'Or mix it into about 1 oz of milk in a bottle, and make sure he finishes it.', 'Use the dropper that comes with them, and the dose on the label.'])
      + kP('No water yet. Milk is all he needs until about 6 months, even on hot days.')
      + small('Worth a call:', 'too few wet diapers, poop that stays dark after day 5, or not back to birth weight by 2 weeks. Born early or slow to gain? Follow your pediatrician’s plan first.')); };

  // 5. Feeding challenges
  P.nb_challenges = () => { const nurse = nurses(), pump = pumps(), b = isBreast(), bot = isBottle();
    const call = t => small('Worth a call:', t.charAt(0).toLowerCase() + t.slice(1));
    return cPage('Feeding challenges', 'Most feeding troubles are common, and pass', 'Pick what you’re seeing: what’s normal, what helps, and when to call.',
      kPick([
      ['Spit-up', kH('Is this much spit-up normal?', 'Usually. A tablespoon or two at a time is common, and it looks like more once it spreads out.') + cDo('What helps', ['Hold him upright for 20–30 minutes after feeds.', 'Smaller feeds, more often.', 'Stop when he slows. No need to finish.']) + kP('For sleep, flat on his back, even with spit-up. Wedges and inclined sleepers aren’t safe.') + (formulaFam() ? kP('Wondering if it’s the formula? Spit-up, gas and fussing happen on any formula. Talk to your pediatrician before switching.') : '') + call('Forceful vomiting, green or bloody, or crying and arching at most feeds. Blood in his poop or a rash too.')],
      ['Gas and crying', kH('Seems gassy?') + cDo('What helps', ['Burp mid-feed, not just at the end.', 'Bicycle his legs gently, on his back.', 'Tummy time, when he’s awake and watched.']) + h2('Crying that won’t stop') + kOl([['Check', 'for hunger, a burp, a diaper, too warm.'], ['Soothe:', 'swaddle, hold, shush, sway.'], ['Step away if you need to.', 'Lay him on his back somewhere safe.']], 'What to do') + small('Never shake him.', 'Even when you’re exhausted. Call someone to take over if you need to.') + small('Gas drops or gripe water?', 'Gas drops are safe but often don’t help much. Ask your pediatrician before trying gripe water.') + call('Crying for 3 or more hours a day, or grunting with every breath.')],
      ['Refusing or fussy', kH('Pulling off, refusing or fussing') + cDo('What helps', ['Feed early, before crying starts.', 'Burp, then try again. Trapped air can feel like full.', bot ? 'Check the nipple. Too fast or too slow?' : 'Gulping? Lean back, so he feeds against gravity.']) + kP('A stuffy nose? Saline drops and gentle suction before feeds, and keep him upright.') + call('Too sleepy to feed most times, or refusing several feeds in a row.') + small('Call right away:', 'a fever of 100.4°F or higher, day or night.')],
      ['Poop and constipation', kH('Normal poop varies a lot', 'Yellow, green, tan or mustard, seedy or with a little mucus. Some babies go after every feed, some every few days.') + kP('Straining and going red is normal too, as long as the poop is soft.') + kH('Constipated?', 'Hard, dry, pebble-like poop. How it looks matters more than how often he goes.') + cDo('What helps', ['Bicycle his legs gently, on his back.', 'A warm bath, then a gentle tummy rub, clockwise.', formulaFam() ? 'Check the formula is mixed exactly as the label says.' : 'Keep feeding on cue.']) + small('Ask your pediatrician first', 'before giving water, juice or anything else. Under 1 month old, call if he seems constipated.') + h2('Colors to call about') + illGrid([[ILL.poop('#e9e4d6'), 'White or pale', 'Call right away'], [ILL.poop('#b3362c'), 'Red', 'Could be blood'], [ILL.poop('#2b2622'), 'Black', 'After the first few days']])]])
      + kDiv() + small('Who can help:', 'your pediatrician, any time you’re unsure' + (nurse ? ', and a lactation consultant for latching, often covered by insurance.' : '.')) + small('And how are you doing?', 'If you feel low or overwhelmed most days, tell your doctor, or call or text 1-833-852-6262, any time.')); };
  // ---- Newborn, organized by moment (Nov 7 proposal): a daily check-in, a feed start to finish, days and nights, growing well, something's up. ----
  HEADART['Every feed'] = () => ART.bottle(.55); HEADART['Days and nights'] = () => ART.often(5); HEADART['Growing well'] = () => ART.diapers(6);
  const CHK_KEY = () => 'ahead-fd-check-' + new Date().toISOString().slice(0, 10);
  const chkGet = () => { try { return Object.assign({ wet: 0, poop: '' }, JSON.parse(localStorage.getItem(CHK_KEY()) || '{}')); } catch (e) { return window.__fdChkMem || { wet: 0, poop: '' }; } };
  const chkSet = o => { window.__fdChkMem = o; try { localStorage.setItem(CHK_KEY(), JSON.stringify(o)); } catch (e) { } };
  const POOPS = [['black', 'Black', '#2b2622'], ['green', 'Green', '#5f6b33'], ['yellow', 'Yellow', '#d4a23a'], ['tan', 'Tan', '#b98a4e'], ['pale', 'Pale', '#e9e4d6'], ['red', 'Red', '#b3362c']];
  window.__fdCheckCard = () => { const c = chkGet(), day = Math.min(babyDays() + 1, 99), need = Math.min(Math.max(day, 1), 6);
    const dia = (i, on) => `<button type="button" aria-label="${i} wet diapers" onclick="__fdChk('wet',${i})" style="border:0;background:none;padding:2px;cursor:pointer"><svg viewBox="0 0 24 20" width="30" height="25" aria-hidden="true"><path d="M2 3h20v5c0 6-5 10-10 10S2 14 2 8Z" fill="${on ? '#f2b8cc' : '#f7f2f4'}" stroke="${on ? '#c46b8e' : '#e2d8dc'}" stroke-width="1.4"/><path d="M2 7h20" stroke="${on ? '#c46b8e' : '#e2d8dc'}" stroke-width="1.4"/></svg></button>`;
    const blob = col => `<svg viewBox="0 0 64 44" width="40" height="28" aria-hidden="true"><path d="M12 38 C8 28 18 22 24 24 C24 14 36 12 40 21 C50 21 56 30 50 38 Z" fill="${col}" stroke="${col === '#e9e4d6' ? '#cfc8b8' : 'none'}"/></svg>`;
    const sw = ([k, l, col]) => `<button type="button" onclick="__fdChk('poop','${k}')" style="border:${c.poop === k ? '2px solid #c46b8e' : '1px solid #eee4e8'};background:${c.poop === k ? '#fdf2f6' : '#fff'};border-radius:14px;padding:6px 0 5px;cursor:pointer;display:grid;justify-items:center;gap:1px;font:inherit;font-size:12px;color:var(--ink,#2b2840)">${blob(col)}${F(l)}</button>`;
    let tone = '', head = '', body = '';
    const bad = c.poop === 'pale' ? 'Pale or white poop needs a call to your pediatrician today.' : c.poop === 'red' ? 'Red in his poop can be blood. Call your pediatrician today.' : c.poop === 'black' && day >= 5 ? 'Black poop after the first few days needs a call to your pediatrician today.' : '';
    if (bad) { tone = 'call'; head = 'Worth a call today'; body = bad; }
    else if (!c.wet && !c.poop) { head = 'Tap his diapers so far today'; body = 'You’ll see right away if he’s on track for day ' + day + '.'; }
    else if (c.wet && c.wet < need) { tone = 'watch'; head = c.wet + ' so far. Aim for ' + need + (need >= 6 ? ' or more' : '') + ' by bedtime'; body = 'Offer feeds a little more often today. If it stays low by evening, call your pediatrician.'; }
    else if (c.wet >= need) { tone = 'ok'; head = 'On track for day ' + day; body = need + (need >= 6 ? ' or more' : '') + ' wet diapers a day is what you’re looking for' + (c.poop === 'black' && day < 5 ? ', and dark first poop is normal now.' : c.poop === 'green' && day < 5 ? ', and green means his poop is changing as it should.' : '.'); }
    else { head = 'Now his wet diapers'; body = 'Tap how many he’s had today.'; }
    const bg = tone === 'call' ? '#fdeceb' : tone === 'ok' ? '#e9f4ee' : tone === 'watch' ? '#fff3dc' : '#f7f3f5', ink = tone === 'call' ? '#a33a32' : tone === 'ok' ? '#2f6b4f' : tone === 'watch' ? '#8a6a2a' : '#6b6578';
    return `<section class="hub-card" id="fd-check" style="padding:16px 16px 14px;margin:0 0 12px"><b style="display:block;font-size:17px">${F('Is Ari getting enough?')}</b><small style="display:block;color:var(--muted,#6b6578);font-size:13.5px;margin:2px 0 12px">${F('His diapers are the best sign. Day ' + day + '.')}</small>`
      + `<small style="display:block;font-size:12.5px;font-weight:600;color:#9b4766;margin:0 0 4px">${F('Wet diapers today')}</small><div style="display:flex;flex-wrap:wrap;gap:0;margin:0 -2px 10px">${Array.from({ length: 8 }, (_, i) => dia(i + 1, i < c.wet)).join('')}</div>`
      + `<small style="display:block;font-size:12.5px;font-weight:600;color:#7a5a2c;margin:0 0 6px">${F('Last poop')}</small><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin:0 0 12px">${POOPS.map(sw).join('')}</div>`
      + `<div role="status" style="background:${bg};border-radius:14px;padding:11px 13px"><b style="display:block;font-size:15px;color:${ink}">${F(head)}</b><span style="display:block;font-size:13.5px;line-height:1.4;margin-top:2px;color:var(--ink,#2b2840)">${F(body)}</span></div>`
      + `<p style="margin:10px 2px 0;font-size:13px;line-height:1.45;color:var(--muted,#6b6578)">${F('Weight is the other sign: back to birth weight by about 2 weeks.' + (isBreast() ? ' And vitamin D drops every day.' : ''))}</p></section>`; };
  window.__fdChk = (k, v) => { const c = chkGet(); if (k === 'wet') c.wet = c.wet === v ? v - 1 : v; else c.poop = c.poop === v ? '' : v; chkSet(c); const el = document.getElementById('fd-check'); if (el) el.outerHTML = pron(window.__fdCheckCard()); };
  window.MHOME = () => { const h = H(), nurse = nurses(), bot = isBottle();
    const TONE = [['#fbe4ec', '#9b4766'], ['#e7effc', '#46638c'], ['#fff3dc', '#8a6a2a']];
    const cr = (t, [icon, title, sub, id]) => h.row({ cat: CAT, icon, title, sub, onclick: go(id) }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`).replace('class="hub-row', `style="--sm-bg:${TONE[t][0]};--sm-ink:${TONE[t][1]}" class="sm-row hub-row`);
    const rows = [['heart', 'A feed, start to finish', 'Before, during and after' + (nurse && bot ? ', nursing and top-ups' : nurse ? ', nursing' : ', bottles'), 'm_feed'], ['moon', 'Your days and nights', 'How often, nights, a sleepy baby, evenings', 'm_days'], ['leaf', 'Growing well', 'How much he needs, weight, vitamin D', 'm_grow']];
    const rough = `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go('nb_challenges')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Something’s up?')}</b><small>${F('Spit-up, gas and crying, refusing feeds, poop')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    return window.__fdCheckCard() + `<h2 class="hub-h2">${F('Your feeding guide')}</h2><div class="hub-list">${rows.map((r, i) => cr(i, r)).join('')}</div>` + rough; };

  P.m_feed = () => { const nurse = nurses(), pump = pumps(), fm = formulaFam(), b = isBreast(), bot = isBottle(), topUp = nurse && fm;
    const fmSteps = kOl([['Wash', 'your hands and the bottle.'], ['Boil the water,', 'then let it sit about 5 minutes.'], ['Water first, then powder,', 'as the label says. Level scoops.'], ['Cool and test', 'a few drops on your wrist. Warm, not hot.']], 'Making a formula bottle') + small('Why hot water?', 'Powder isn’t sterile, and young babies are most at risk. Ready-to-feed is sterile, and the easiest at 3 am.') + kP('Any standard, iron-fortified formula works. Ask your pediatrician whether your tap water is safe to use.');
    const bmSteps = kOl([['Use the oldest milk first,', 'from the fridge, or thawed there overnight.'], ['Swirl, don’t shake.', 'Separating is normal.'], ['Warm or cool is fine.', 'Test a few drops on your wrist. Never microwave.']], 'Getting breast milk ready');
    const before = h2('Watch for hunger cues') + cueStrip().replace(`<b class="hub-fig-title">${F('Hunger cues, early to late')}</b>`, '')
      + kP('Start at the early cues if you can. Just fed and still fussing? He may want comfort, not milk.')
      + (nurse ? h2('Get comfortable') + lead('A pillow under him and your feet up, so you bring him to you, not lean over him. Swipe for holds.') + kHolds() : '')
      + (bot && !nurse ? h2('Get the bottle ready') + (fm ? fmSteps : '') + (pump && !fm ? bmSteps : '') + (pump && fm ? bmSteps : '') : '')
      + (topUp ? h2('If you top up') + lead('Have a small formula bottle ready, 1–2 oz.') + fmSteps : '');
    const latch = h2('Latch, step by step') + kOl([['Nose to nipple.', 'Keep his head and body in a line.'], ['Wait for a wide mouth,', 'like a yawn.'], ['Bring him in, chin first,', 'close to you.']], 'Step by step')
      + kTwo(['Good latch', 'Flared lips, long sucks and swallows, a strong tug rather than pinching.'], ['Adjust the latch', 'Clicking, dimpled cheeks or pinching that lasts. Break the seal with a finger and try again.'])
      + hubEmbed('y--syZR0u1E', 'A good latch, step by step', 'Global Health Media')
      + h2('Through the feed') + tl('', [['First side', 'eye', 'Let him finish. Often 10–20 minutes at first.'], ['When he slows', 'hand', 'Burp, then offer the other side. Some feeds take one side, some both.'], topUp && ['Still hungry?', 'bottle', 'A small, paced top-up.'], ['Next feed', 'clock', 'Start on the last side.']])
      + cDo('If it’s not going smoothly', ['Dozing off: squeeze gently behind the nipple, or switch sides.', 'Gulping or coughing: lean back, so he feeds against gravity.', 'Clicking or slipping off: re-latch deeper.', 'Too sleepy to latch in the first days: give a few drops of hand-expressed colostrum on a spoon.'])
      + (!bot ? small('A first bottle?', 'Around 3–4 weeks, once nursing is going well. Have someone else offer it, before he’s very hungry.') : '');
    const paced = kOl([['Hold him semi-upright.'], ['Touch his lip,', 'let him draw the nipple in.'], ['Keep the bottle fairly level,', 'milk just in the tip.'], ['Pause every few sucks,', 'and burp every 2–3 oz.'], ['Stop when he’s done,', 'even if milk is left.']], 'Paced bottle feeding')
      + H().tiles([[topUp ? 'A top-up' : 'Per bottle', topUp ? '1–2 oz' : '1–3 oz', 'At first. More as he grows'], ['Too fast?', 'Gulping, coughing', 'Try a slower nipple']])
      + kP('Any bottle he takes well works, wide or narrow, with a slow-flow nipple.') + small('Never prop a bottle.', 'Always hold him while he feeds.');
    const during = (nurse ? latch : '') + (bot ? (nurse ? h2(topUp ? 'Topping up with a bottle' : 'Giving a bottle') : '') + paced : '');
    const after = h2('Burp him') + illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'Chin on a burp cloth'], [ILL.sitting(PALT), 'Sitting on your lap', 'Support chin and chest'], [ILL.tummy(PALT), 'Tummy-down', 'Across your lap']])
      + kP('Firm pats or slow circles. No burp after a minute or two? Carry on. A little spit-up is common, and hiccups are harmless.')
      + h2('How you know he’s had enough') + fullTiles()
      + (bot ? h2('Leftovers and storing') + cDo('Keep it safe', ['Once he starts a bottle, use it within ' + (fm && !pump ? '1 hour' : !fm ? '2 hours' : '1 hour for formula, 2 for breast milk') + ', then toss what’s left.', 'Warm, room temperature or cool are all fine. Never microwave.', fm ? 'Made formula keeps 24 hours in the fridge. Don’t freeze it.' : '', pump ? 'Breast milk: 4 hours out, 4 days in the fridge, 6 months in the freezer.' : '', pump ? 'Out and about: a cooler with ice packs keeps breast milk 24 hours.' : 'Out and about: carry formula powder and water separately, and mix when he’s ready.'])
        + cDo('Then wash up', ['Take it all apart' + (pump ? ', pump parts too.' : '.'), 'Hot, soapy water or the dishwasher, then air-dry.', 'Sanitize once a day for the first months: boil, steam or a sanitize cycle.']) : '')
      + small('Worth a call:', (nurse ? 'most feeds hurt or he can’t stay on, ' : 'he often gulps, chokes or refuses the bottle, ') + 'he’s too sleepy to feed most times, or he isn’t back to birth weight by 2 weeks.' + (nurse ? ' A lactation consultant can help with latching, and check for tongue-tie.' : ''));
    return cPage('Every feed', 'A feed, start to finish', nurse && bot ? 'Nursing, then a top-up when he needs one. Pick where you are.' : nurse ? 'From his first cue to the last burp. Pick where you are.' : 'From his first cue to washing up. Pick where you are.',
      kPick([['Before', before], ['During', during], ['After', after]])); };

  P.m_days = () => { const nurse = nurses(), b = isBreast();
    const dayHtml = (P.day() || ''), k0 = dayHtml.indexOf('<div class="hub-card" style="padding:14px 14px 8px">'), e0 = k0 >= 0 ? dayHtml.indexOf('<figure', k0) : -1, ribbon = k0 >= 0 && e0 > k0 ? dayHtml.slice(k0, e0) : '';
    const fix = h => { if (typeof document.createElement !== 'function') return h; const t = document.createElement('div'); t.innerHTML = h; return t.innerHTML; };
    return cPage('Days and nights', b ? 'About every 2–3 hours, around the clock' : 'About every 2–4 hours, around the clock', 'Led by his cues. It gets more predictable by about 6 weeks.',
      `<section class="hub-card" style="padding:16px 16px 12px;margin:0 0 12px"><b style="display:block;font-size:17px;margin:0 0 10px">${F('A day of feeds')}</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><strong style="display:block;font-size:28px;line-height:1.1">${b ? '8–12' : '6–10'}</strong><small style="display:block;color:var(--muted,#6b6578);font-size:13.5px;margin-top:3px">${F('Feeds a day')}</small></div><div><strong style="display:block;font-size:28px;line-height:1.1">${b ? '2–3 hrs' : '2–4 hrs'}</strong><small style="display:block;color:var(--muted,#6b6578);font-size:13.5px;margin-top:3px">${F('From the start of one feed')}</small></div></div>${fix(ribbon.replace('<div class="hub-card" style="padding:14px 14px 8px">', '<div style="padding:10px 0 0;margin-top:10px;border-top:1px solid var(--line,#f0e8eb)">'))}</section>`
      + h2('At night') + cDo('Keep it quick and calm', ['Dim light, quiet voice, no play.', 'Change his diaper only if it’s needed.', 'Bright days and dark nights help him sort day from night.'])
      + h2('A sleepy baby') + cLead('Until he’s back to birth weight, if 3 hours pass, wake him for a feed.')
      + cDo('Try this', ['Undress him down to his diaper.', 'Stroke his feet or back, gently.', 'Change his diaper midway through.', b && nurse ? 'Squeeze gently behind the nipple to keep milk flowing.' : 'Pause, burp, then offer again.'])
      + h2('Nonstop evenings') + cLead('Feed after feed for a few hours is called cluster feeding. It’s normal, and it passes.')
      + cDo('What helps', [b ? 'Switch sides often.' : 'Offer smaller bottles, more often.', 'Change his diaper before the feed, so he stays sleepy after.', 'Take turns, so you each get a longer stretch.'])
      + h2('When it eases') + hubStageStrip({ title: '', items: [['clock', 'Around 6 weeks', 'Fussy evenings peak, then ease'], ['moon', '6–8 weeks', 'Cluster feeding eases'], ['smile', '2–3 months', 'A longer night stretch']], cat: CAT })
      + small('Worth a call:', 'too sleepy to feed most times, or hard to wake for feeds.')); };

  P.m_grow = () => { const b = isBreast(), fm = formulaFam(), br = b && fd() === 'Breast milk', fmOnly = fd() === 'Formula';
    return cPage('Growing well', 'Steady weight and wet diapers mean it’s working', 'You don’t need to measure every feed. Here’s what to expect.',
      h2('How much he needs') + lead('His stomach is tiny at first, and grows fast.') + H().tiles([['Day 1', '1–2 tsp', 'A feed. About a marble'], ['Day 3', 'About 1 oz', 'About a walnut'], ['Week 1', '1½–2 oz', 'About an apricot'], ['Weeks 2–4', '2–4 oz', 'About an egg']])
      + (nurses() ? kP('Nursing? You won’t see ounces, and that’s fine. Diapers and weight tell you more.') : '')
      + h2('Weight') + H().tiles([['First few days', 'Some loss', 'Up to about 10% is common'], ['By about 2 weeks', 'Back to birth weight', 'The surest sign it’s going well']])
      + kP('Extra hungry for a few days? Often a growth spurt, around 2–3 weeks. Feed more often, and it passes.')
      + h2('Poop through the first week') + illGrid([[ILL.poop('#2b2622'), 'Days 1–2', 'Black and sticky'], [ILL.poop('#5f6b33'), 'Days 3–4', 'Turning green'], [ILL.poop(br ? '#d4a23a' : fmOnly ? '#b98a4e' : '#c99642'), 'Day 5 on', br ? 'Yellow and seedy' : fmOnly ? 'Tan, like peanut butter' : 'Yellow to tan']])
      + h2('Vitamin D and iron') + H().tiles([['Vitamin D', b ? '400 IU a day' : 'In the formula', b ? 'Drops, from the first days' : 'Drops until he drinks about 32 oz a day'], ['Iron', fm ? 'In the formula' : isEarly() ? 'From about 1 month' : (ageMo() < 4 ? 'Ask at 4 months' : 'Ask at the next checkup'), fm ? 'Choose one with iron' : isEarly() ? 'Drops, for babies born early' : 'Breast milk is low in iron']])
      + cDo('Giving drops', [(nurses() ? 'Drip it on the nipple just before a feed, or slowly inside his cheek.' : 'Drip it slowly inside his cheek.'), 'Or mix it into about 1 oz of milk in a bottle, and make sure he finishes it.', 'Use the dropper that comes with them, and the dose on the label.'])
      + kP('No water yet. Milk is all he needs until about 6 months, even on hot days.')
      + small('Worth a call:', 'not back to birth weight by 2 weeks. Born early or slow to gain? Follow your pediatrician’s plan first.')); };

  // ---- Newborn, built like Sleep and Everyday care (Nov 7): every page is one idea in the app's subpage shape
  // (header → one picture → What to do → How you'll know → a short note), and ends with the other pages in its area. ----
  const XC = { m4: ['#e6f1e8', '#356651'], m1e: ['#e7effc', '#46638c'], f3: ['#e6f1e8', '#356651'], r2: ['#e6f1e8', '#356651'], f1: ['#fbe4ec', '#9b4766'], d1: ['#e7effc', '#46638c'], p1: ['#fdeee6', '#9a5a3c'], g1: ['#fff3dc', '#8a6a2a'], routine: ['#e7effc', '#46638c'], feed: ['#fbe4ec', '#9b4766'], prep: ['#fdeee6', '#9a5a3c'], growth: ['#fff3dc', '#8a6a2a'], tough: ['#f6e8f3', '#7a4f74'] };
  Object.assign(HEADART, { 'Meals, step by step': () => ART.often(3), 'Evenings and nights': () => ART.often(5), 'First foods, step by step': () => ART.often(5), 'Getting ready for solids': () => ART.often(4), 'Feeding routine': () => ART.often(5), 'How to feed': () => ART.drops(4), 'Milk and preparation': () => ART.bottle(.55), 'Nutrition and growth': () => ART.diapers(6), 'Feeding challenges': () => ART.often(3), 'His day and night': () => ART.often(5), 'A feed, step by step': () => ART.drops(4), 'Bottles, start to finish': () => ART.bottle(.55), 'Is he getting enough?': () => ART.diapers(6) });
  const xDo = (label, xs, ol) => { xs = xs.filter(Boolean); return xs.length ? `<section class="ss-do"><b>${F(label)}</b><${ol ? 'ol' : 'ul'} class="ss-do-list"${ol ? ' style="padding-left:20px"' : ''}>${xs.map(t => `<li>${F(t)}</li>`).join('')}</${ol ? 'ol' : 'ul'}></section>` : ''; };
  const xKnow = (label, t) => `<p class="ss-know"><b>${F(label)}</b>${F(t)}</p>`;
  const xNote = (label, t) => `<p class="ss-small"><b>${F(label)}</b> ${F(t)}</p>`;
  const XAREA = () => { const nurse = nurses(), bot = isBottle(), pump = pumps(), fm = formulaFam(), b = isBreast();
    return {
      routine: ['His day and night', [['x_day', 'sun', 'Day', ''], ['x_evening', 'clock', 'Evening', ''], ['x_night', 'moon', 'Night', '']], 'That’s his day and night'],
      feed: ['A feed, step by step', [['x_cues', 'eye', 'Hungry', ''], nurse ? ['x_latch', 'heart', 'Latch on', ''] : ['x_bottle', 'bottle', 'Bottle', ''], ['x_burp', 'hand', nurse ? 'Burp & switch' : 'Burp', ''], nurse && fm && ['x_bottle', 'bottle', 'Top up', ''], ['x_full', 'smile', 'Full', '']], 'That’s a whole feed'],
      prep: bot ? ['Bottles, start to finish', [['x_kind', 'drop', b && fm ? 'Milk' : b ? 'Milk' : 'Choose', ''], fm && ['x_formula', 'bowl', pump ? 'Formula' : 'Make', ''], pump && ['x_bm', 'snow', fm ? 'Breast milk' : 'Warm', ''], ['x_store', 'fridge', 'Store', ''], ['x_clean', 'star', 'Clean', '']], 'That’s a bottle, start to finish'] : null,
      growth: ['Is he getting enough?', [['x_amount', 'leaf', 'How much', ''], ['x_enough', 'diaper', 'Diapers', ''], ['x_weight', 'star', 'Weight', '']].concat([['x_vitd', 'drop', b ? 'Vitamin D' : 'Vitamins', '']]), 'That’s how to tell he’s getting enough']
      ,f1: ['A feed, step by step', [['y_cues', 'eye', 'Hungry', ''], nurse && ['y_nurse', 'heart', 'Nurse', ''], bot && ['y_bottle', 'bottle', nurse && fm ? 'Top up' : 'Bottle', ''], ['y_burp', 'hand', 'Burp', ''], ['y_full', 'smile', 'Full', '']], 'That’s a whole feed'],
      d1: ['His day and night', [['y_day', 'sun', 'Day', ''], ['y_evening', 'clock', 'Evening', ''], ['y_night', 'moon', 'Night', '']], 'That’s his day and night'],
      p1: bot ? ['Bottles, start to finish', [['y_make', 'bowl', 'Make', ''], ['x_store', 'fridge', 'Store', ''], ['y_away', 'bag', 'Away', ''], ['x_clean', 'star', 'Clean', '']], 'That’s a bottle, start to finish'] : null,
      g1: ['Is he getting enough?', [['y_diapers', 'diaper', 'Diapers', ''], ['y_weight', 'star', 'Weight', ''], ['x_vitd', 'drop', b ? 'Vitamin D' : 'Vitamins', '']], 'That’s how to tell he’s getting enough']
      ,r2: ['Getting ready for solids', [['z_signs', 'eye', 'Signs', ''], ['z_how', 'plate', 'Choose', ''], ['z_allergy', 'shield', 'Allergies', ''], ['z_setup', 'highchair', 'Set up', ''], ['z_gag', 'eye', 'Gagging', '']], 'You’re ready for the first bite']
      ,m1e: ['Evenings and nights', [['y_evening', 'clock', 'Evenings', ''], ['y_night', 'moon', 'Nights', '']], 'That’s evenings and nights'],
      f3: ['First foods, step by step', [['z_tray', 'bowl', 'On the tray', ''], ['z_allergens', 'star', 'Allergens', ''], ['z_notyet', 'shield', 'Foods to skip', ''], ['z_water', 'cup', 'Drinks', '']], 'You’re all set for first foods']
      ,m4: ['Meals, step by step', [['z_day', 'clock', 'A day', ''], ['z_family', 'plate', 'On the tray', ''], ['z_appetite', 'leaf', 'Appetite', '']], 'That’s a day of meals']
    }; };
  const xMore = (area, self) => { const [t, rows] = XAREA()[area], rs = rows.filter(r => r && r[0] !== self); return rs.length ? `<h2 class="hub-h2">${F('More on ' + t.toLowerCase())}</h2><div class="hub-list">${rs.map(([id, icon, title, sub]) => H().row({ cat: CAT, icon, title, sub, onclick: go(id) }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`)).join('')}</div>` : ''; };
  // Families giving stored milk: what to switch to when the freezer stash runs out (AAP).
  const stashLine = () => `<div class="hub-card"><p class="hub-card-label">${F('When the stash runs out')}</p><p class="hub-card-text">${F(realStage() >= 4 && typeof actualMonth === 'function' && actualMonth() >= 12 ? 'Whole cow’s milk in a cup takes its place now.' : 'Switch to an iron-fortified infant formula until his first birthday. From 12 months, whole cow’s milk in a cup.')}</p></div>`;
  const xPage = (area, id, title, lead, body) => (area === 'prep' && id === 'x_kind' && stored() && (body += stashLine()), 0) || window.__xCollect ? head((XAREA()[area] || ['Feeding'])[0], title, lead, XC[area]) + `<section class="ss-moment">${body}</section>` : qaCss + page(head(XAREA()[area] ? XAREA()[area][0] : 'Feeding challenges', title, lead, XC[area]) + `<section class="ss-moment">${body}</section>` + (XAREA()[area] ? xMore(area, id) : ''));

  // Each area opens as one page with its topics side by side: a row of pills switches between them in place,
  // and "Next" walks to the following one, so it never turns into a trail of pages to back out of.
  window.__xaGo = (el, n) => { const r = el.closest('.xa'); if (!r) return; r.querySelectorAll('.xa-p').forEach((p, i) => { p.hidden = i !== n; }); r.querySelectorAll('.xs-step').forEach((b, i) => { b.classList.toggle('is-on', i === n); b.classList.toggle('is-done', i < n); b.setAttribute('aria-current', i === n ? 'step' : 'false'); }); window.scrollTo(0, 0); };
  P.xa = (spec) => { const [area, start] = String(spec || 'routine').split('.'), A = XAREA()[area]; if (!A) return P.dirD(0);
    const steps2 = A[1].filter(Boolean), n0 = Math.min(Number(start) || 0, steps2.length - 1);
    window.__xCollect = ['r2', 'm1e', 'f3', 'm4'].includes(area) ? A[0] : true; window.__xColor = XC[area]; const bodies = steps2.map(r => P[r[0]]()); window.__xCollect = false; window.__xColor = null;
    const titles = bodies.map(h => ((h.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || ''));
    const bar = `<nav class="xs" aria-label="${F(A[0])}">${steps2.map((r, i) => `<button type="button" class="xs-step${i === n0 ? ' is-on' : i < n0 ? ' is-done' : ''}" aria-current="${i === n0 ? 'step' : 'false'}" onclick="__xaGo(this,${i})"><span class="xs-dot">${i + 1}</span><span class="xs-l">${F(r[2])}</span></button>`).join('')}</nav>`;
    const foot = i => i < steps2.length - 1 ? H().next(F('Next · step ' + (i + 2) + ' of ' + steps2.length), titles[i + 1], `__xaGo(this,${i + 1})`) : (() => { const from = typeof historyStack !== 'undefined' && historyStack.length ? historyStack[historyStack.length - 1] : '', fromHome = from === 'home'; return H().next(F(A[2]), F(fromHome ? 'Back to Home' : 'Back to Feeding'), fromHome ? 'back()' : go(window.__fdStage != null ? 'dirD:' + window.__fdStage : 'dirD')); })();
    const css2 = `<style>#main .xs{position:relative;display:flex;justify-content:space-between;gap:4px;margin:2px 0 16px;padding:0 2px}#main .xs::before{content:"";position:absolute;left:22px;right:22px;top:14px;height:2px;background:var(--line,#eadfe3)}#main .xs-step{position:relative;flex:1 1 0;min-width:0;display:grid;justify-items:center;gap:5px;border:0;background:none;padding:0;font:inherit;cursor:pointer;color:var(--muted,#6b6578)}#main .xs-dot{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;background:var(--bg,#f7f4ee);border:2px solid var(--line,#eadfe3);color:var(--muted,#6b6578)}#main .xs-l{font-size:12.5px;font-weight:600;line-height:1.2;text-align:center}#main .xs-step.is-done .xs-dot{background:var(--ss-bg);border-color:var(--ss-bg);color:var(--ss-ink)}#main .xs-step.is-on .xs-dot{background:var(--ss-ink);border-color:var(--ss-ink);color:#fff}#main .xs-step.is-on .xs-l{color:var(--ink,#2b2840)}</style>`;
    return qaCss + page(head(A[0], A[0], '', XC[area]).replace('class="dev-area-head ss-head"', 'class="dev-area-head ss-head" style="display:none"') + css2 + `<div class="xa">${bar}${bodies.map((h, i) => `<div class="xa-p"${i === n0 ? '' : ' hidden'}>${h}${foot(i)}</div>`).join('')}</div>`); };

  // Feeding routine
  P.x_cues = () => { const b = isBreast();
    return xPage('feed', 'x_cues', 'Start at his early hunger cues', 'Feeding before he cries is easier for you both. Crying is a late sign.',
      cueStrip().replace(`<b class="hub-fig-title">${F('Hunger cues, early to late')}</b>`, '')
      + xDo('What to do', ['Offer a feed at the first stirring, rooting or hands to mouth.', 'Already crying? Calm him first with skin to skin or a cuddle, then feed.'])
      + xKnow('Hungry, or wants comfort?', 'If it’s been a while since his last feed, it’s likely hunger. Just fed and still fussing? Try a cuddle' + (nurses() ? ', or a pacifier once nursing is going well.' : ' or a pacifier.'))); };
  P.x_full = () => xPage('feed', 'x_full', 'Stop when he shows he’s full', 'Let him decide how much. It’s how he learns his own hunger and fullness.',
      fullTiles()
      + xDo('What to do', ['Still rooting after a burp? Offer ' + (nurses() ? 'the other side' + (formulaFam() ? ', then a small top-up' : '') : 'a little more') + '.', 'Turns away or drifts off? That’s the end of the feed, even if milk is left.', (nurses() && !isBottle() ? 'No need to empty a side.' : !nurses() ? 'No need to finish the bottle.' : 'No need to finish a bottle or empty a side.')])
      + xKnow('How you’ll know he got enough', 'Wet diapers through the day, and he’s content for a while between most feeds.'));
  P.x_day = () => { const b = isBreast();
    const dayHtml = (P.day() || ''), k0 = dayHtml.indexOf('<div class="hub-card" style="padding:14px 14px 8px">'), e0 = k0 >= 0 ? dayHtml.indexOf('<figure', k0) : -1, ribbon = k0 >= 0 && e0 > k0 ? dayHtml.slice(k0, e0) : '';
    const fix = h => { if (typeof document.createElement !== 'function') return h; const t = document.createElement('div'); t.innerHTML = h; return t.innerHTML; };
    return xPage('routine', 'x_day', b ? 'Feed about every 2–3 hours' : 'Feed about every 2–4 hours', 'Led by his cues, day and night.',
      `<section class="hub-card" style="padding:16px 16px 12px;margin:0 0 12px"><b style="display:block;font-size:17px;margin:0 0 10px">${F('A day of feeds')}</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><strong style="display:block;font-size:28px;line-height:1.1">${b ? '8–12' : '6–10'}</strong><small style="display:block;color:var(--muted,#6b6578);font-size:13.5px;margin-top:3px">${F('Feeds a day')}</small></div><div><strong style="display:block;font-size:28px;line-height:1.1">${b ? '2–3 hrs' : '2–4 hrs'}</strong><small style="display:block;color:var(--muted,#6b6578);font-size:13.5px;margin-top:3px">${F('From the start of one feed')}</small></div></div>${fix(ribbon.replace('<div class="hub-card" style="padding:14px 14px 8px">', '<div style="padding:10px 0 0;margin-top:10px;border-top:1px solid var(--line,#f0e8eb)">'))}</section>`
      + xDo('What to do', ['Count from the start of one feed to the start of the next.', 'Some feeds come close together, some further apart. Both are normal.', 'A quick note of feeds and diapers helps in the first weeks.'])
      + xKnow('How it changes', 'Fewer, more predictable feeds by about 6 weeks, and a longer night stretch around 2–3 months.')); };
  P.x_night = () => { const b = isBreast(), nurse = nurses();
    return xPage('routine', 'x_night', 'At night, keep feeds quick and calm', 'He’ll still need feeds overnight. Dim, quiet nights and bright days help him learn day from night.',
      steps([['sun', 'By day', 'Bright, normal noise, play between feeds'], ['moon', 'At night', 'Dim, quiet, straight back down']], false)
      + xDo('What to do', ['Keep the lights low and your voice quiet. No play.', 'Change his diaper only if it’s needed.', 'Until he’s back to birth weight, wake him if about 3 hours pass since the last feed started.'])
      + xKnow('Hard to wake for a feed?', 'Undress him down to his diaper, stroke his feet or back, or change his diaper' + (b && nurse ? '. Once he’s on, squeeze gently behind the nipple to keep milk flowing.' : ' midway through.') + ' Your pediatrician will tell you when you can let him sleep, often around 2 weeks.')
      + xNote('Worth a call:', 'too sleepy to feed most times, or hard to wake.')); };
  P.x_evening = () => { const b = isBreast();
    return xPage('routine', 'x_evening', 'Nonstop evening feeds are normal', 'Feeding again and again for a few hours, often in the evening, is called cluster feeding. It passes.',
      hubStageStrip({ title: 'When it eases', items: [['clock', 'Around 6 weeks', 'Fussy evenings peak, then ease'], ['moon', '6–8 weeks', 'Cluster feeding eases'], ['smile', '2–3 months', 'A longer night stretch']], cat: CAT })
      + xDo('What helps', [b ? 'Switch sides often.' : 'Offer smaller bottles, more often.', 'Change his diaper before the feed, so he stays sleepy after.', 'Take turns, so you each get a longer stretch.'])
      + xNote('Extra hungry for a few days?', 'Often a growth spurt, around 2–3 weeks. Feed more often, and it passes.')); };

  // How to feed
  P.x_latch = () => xPage('feed', 'x_latch', 'A deep latch feels like a tug, not a pinch', 'Get comfortable first: a pillow under him and your feet up, so you bring him to you.',
      kHolds() + xDo('Step by step', ['Nose to nipple, his head and body in a line.', 'Wait for a wide mouth, like a yawn.', 'Bring him in chin first, close to you.'], true)
      + `<p class="ss-small"><a href="https://www.youtube.com/watch?v=y--syZR0u1E" target="_blank" rel="noopener" style="color:var(--ss-ink);font-weight:600">${F('Watch a good latch')} ↗</a> ${F('A short video from Global Health Media.')}</p>` + xKnow('How you’ll know it’s right', 'Lips flared out, long sucks with swallows, and a tug that doesn’t pinch. Clicking or pinching that lasts? Break the seal with a finger and try again.')
      + xNote('Gulping or coughing?', 'Milk may be coming fast. Lean back, so he feeds against gravity.') + xNote('Too sleepy to latch in the first days?', 'Give him a few drops of colostrum on a spoon. To hand express: thumb and fingers an inch behind the nipple, press back toward your chest, then squeeze and release.')
      + xNote('Worth a call:', 'most feeds hurt, or he can’t stay on. A lactation consultant can help, and check for tongue-tie.'));
  P.x_sides = () => { const fm = formulaFam(), bot = isBottle();
    return xPage('feed', 'x_sides', 'Offer both sides, and let him finish the first', 'Some feeds take one side, some both. Often 10–20 minutes a side at first.',
      tl('', [['First side', 'eye', 'Let him finish, until he slows or lets go.'], ['Burp', 'hand', 'Then offer the other side.'], fm && ['Still hungry?', 'bottle', 'A small, paced formula top-up.'], ['Next feed', 'clock', 'Start on the side you ended on.']])
      + xDo('If it’s not going smoothly', ['Dozing off: squeeze gently behind the nipple, or switch sides.', 'Gulping or coughing: lean back, so he feeds against gravity.', 'Too sleepy to latch in the first days: give a few drops of hand-expressed colostrum on a spoon.'])
      + xKnow('How you’ll know it’s going well', 'You hear him swallow, and he’s relaxed and content after most feeds.')
      + (!bot ? xNote('A first bottle?', 'Around 3–4 weeks, once nursing is going well. Have someone else offer it, before he’s very hungry.') : '')); };
  P.x_bottle = () => { const nurse = nurses(), fm = formulaFam(), b = isBreast();
    return xPage('feed', 'x_bottle', nurse && fm ? 'Top up with a small, paced bottle' : 'Pace each bottle, and stop when he’s done', nurse && fm ? 'Only if he still seems hungry after both sides, or if your pediatrician suggests it. Let him set the pace.' : 'Let him set the pace, like nursing. A bottle often takes 10–20 minutes.',
      (nurse && fm ? H().tiles([['A top-up', '½–2 oz', 'Small, after nursing'], ['Burp', 'Every 2–3 oz', 'And at the end']])
        : h2('About how much, per bottle') + H().tiles([['Day 1', '1–2 tsp', 'About ¼ oz'], ['Day 3', 'About 1 oz', 'Every 2–3 hours'], ['Week 1', '1½–2 oz', 'Every 2–3 hours'], ['Weeks 2–4', '2–4 oz', 'Every 3–4 hours']]))
      + xDo('Step by step', ['Hold him semi-upright, and touch his lip so he draws the nipple in.', 'Keep the bottle fairly level, milk just in the tip.', 'Pause every few sucks.', 'Stop when he’s done, even if milk is left.'], true)
      + xKnow('How you’ll know the flow is right', 'He sucks steadily, with a swallow every few sucks. Gulping, coughing or milk spilling? Try a slower nipple. Working hard or frustrated? It may be too slow.')
      + xNote('Falls asleep mid-bottle?', 'Burp, then offer again. If he’s done, that’s fine.') + xNote('Never prop a bottle.', 'Always hold him while he feeds.') + xNote('What you’ll need:', 'any bottle he takes well, wide or narrow, slow-flow nipples, a bottle brush and a drying rack.' + (nurse ? ' Won’t take one? Have someone else offer it, before he’s very hungry.' : ''))); };
  P.x_burp = () => { const b = isBreast(), bot = isBottle(), nurse = nurses();
    return nurse ? xPage('feed', 'x_burp', 'When he slows, burp him and offer the other side', 'Some feeds take one side, some both. Often 10–20 minutes a side at first.',
      illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'Chin on a burp cloth'], [ILL.sitting(PALT), 'Sitting on your lap', 'Support chin and chest'], [ILL.tummy(PALT), 'Tummy-down', 'Across your lap']])
      + xDo('What to do', ['When his sucking slows, burp him with firm pats or slow circles.', 'Then offer the other side. If he’s not interested, that’s fine.', 'Start the next feed on the side you ended on.'])
      + xKnow('Dozing off mid-feed?', 'Switching sides wakes him a little. Squeezing gently behind the nipple keeps milk flowing.')
      + xNote('Good to know:', 'a little spit-up with a burp is common, and hiccups are harmless.') + (!bot ? xNote('A first bottle?', 'Around 3–4 weeks, once nursing is going well. Have someone else offer it, before he’s very hungry.') : ''))
    : xPage('feed', 'x_burp', 'Burp him every 2–3 oz, and at the end', 'Less air in means less fussing after. Use whichever hold is comfortable.',
      illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'Chin on a burp cloth'], [ILL.sitting(PALT), 'Sitting on your lap', 'Support chin and chest'], [ILL.tummy(PALT), 'Tummy-down', 'Across your lap']])
      + xDo('What to do', ['Pause every 2–3 oz, and at the end.', 'Firm pats or slow circles on his back.', 'No burp after a minute or two? Carry on.'])
      + xKnow('Good to know', 'A little spit-up with a burp is common, and hiccups are harmless.')); };

  // Milk and preparation
  P.x_kind = () => { const b = isBreast(), fm = formulaFam();
    return xPage('prep', 'x_kind', b && fm ? 'Breast milk and formula are both good for him' : b ? (stg() >= 3 ? 'Breast milk still matters alongside food' : 'Breast milk is all he needs for now') : stg() >= 3 ? 'Formula still matters alongside food' : 'Formula gives him everything he needs', b && fm ? 'Any amount of breast milk helps, and formula fills the gap.' : b ? 'Plus vitamin D drops, every day.' : 'Any standard, iron-fortified formula works. No need for a special one.',
      (b && fm ? two(['Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['Formula', 'Gives him everything he needs to grow, with vitamin D and iron.'])
        : b ? two(['Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['Vitamin D', 'Drops every day, from the first days.'])
        : H().tiles([['Ready-to-feed', 'Pour and feed', 'Sterile, costs most'], ['Concentrate', 'Mix with water', 'Sterile until opened'], ['Powder', 'Mix with hot water', 'Not sterile, costs least']]))
      + xDo('What to do', b && fm ? ['Use any standard, iron-fortified formula.', 'They can share a bottle, once the formula is mixed with water. Never add powder to breast milk.', 'Breast milk families need vitamin D drops too.'] : b ? ['Feed on cue, day and night.', 'Give vitamin D drops every day.', 'If you ever add formula, any standard, iron-fortified one works.'] : ['Follow the label exactly. Never water it down or make it stronger.', 'Most babies switch between standard brands without trouble.', 'Ask your pediatrician before a special formula.'])); };
  P.x_formula = () => xPage('prep', 'x_formula', 'Make every bottle the same safe way', 'Powder isn’t sterile, and young babies are most at risk, so a few steps matter.',
      xDo('Step by step', ['Wash your hands, the counter and the bottle.', 'Boil the water, then let it sit about 5 minutes.', 'Water first, then powder, as the label says. Level scoops.', 'Cool it, and test a few drops on your wrist. Warm, not hot.'], true)
      + xKnow('How long it keeps', 'Use it within 2 hours, or fridge it for up to 24. Once he starts, finish within 1 hour.')
      + xNote('Easier at 3 am:', 'ready-to-feed is sterile and needs no mixing. Ask your pediatrician whether your tap water is safe.'));
  P.x_bm = () => xPage('prep', 'x_bm', 'Getting breast milk ready', 'Oldest first, gently mixed, and fed within 2 hours.',
      xDo('Step by step', ['Use the oldest milk first, from the fridge, or thawed there overnight.', 'Swirl, don’t shake.', 'Warm it in a bowl of warm water, or serve it cool. Test a few drops on your wrist.'], true)
      + xKnow('Good to know', 'Separating into layers is normal. A swirl mixes it back. Never microwave: it heats unevenly.'));
  P.x_store = () => { const b = isBreast(), fm = formulaFam(), bot = isBottle() || pumps();
    return xPage('prep', 'x_store', 'How long milk keeps', 'Once he starts a bottle, use it soon, then toss what’s left.',
      (b ? (fm ? h2('Breast milk') : '') + storeTable([['Fresh', '4 hours', '4 days', '6 months'], ['Thawed', '1–2 hours', '24 hours', 'Never refreeze']]) : '')
      + (fm ? (b ? h2('Formula') : '') + storeTable([['Made', '2 hours', '24 hours', 'Don’t freeze']]) : '')
      + xDo('What to do', ['Once he starts a bottle, finish within ' + (fm && !b ? '1 hour' : !fm ? '2 hours' : '1 hour for formula, 2 for breast milk') + '.', 'Store milk at the back of the fridge, not the door.', b ? 'Freeze breast milk flat in 2–4 oz bags, and thaw it in the fridge overnight.' : '', 'Warm it in a bowl of warm water, or serve it at room temperature. Never microwave.', b ? 'Out and about: a cooler with ice packs keeps breast milk 24 hours.' : 'Out and about: carry powder and water separately, and mix when he’s ready.'])); };
  P.x_clean = () => xPage('prep', 'x_clean', 'Wash bottles after every feed', 'And sanitize once a day for the first few months.',
      xDo('Step by step', ['Take it all apart' + (pumps() ? ', pump parts too.' : '.'), 'Wash in hot, soapy water or the dishwasher.', 'Air-dry on a clean rack, not a used towel.'], true)
      + xKnow('Sanitizing', 'Once a day: boil 5 minutes, steam, or a sanitize cycle. Most important under 2 months, or for babies born early.'));

  // Nutrition and growth
  P.x_enough = () => { const b = isBreast(), br = b && fd() === 'Breast milk', fmOnly = fd() === 'Formula';
    const d = babyDays(), now = d < 2 ? 0 : d < 4 ? 1 : d < 5 ? 2 : 3;
    const diaperSvg = n => `<svg viewBox="0 0 144 22" style="display:block;width:100%;max-width:150px;height:auto" aria-hidden="true">${Array.from({ length: 6 }, (_, i) => { const on = i < n, x = i * 24 + 1; return `<path d="M${x} 2h21v5c0 7-5 12-10.5 12S${x} 14 ${x} 7Z" fill="${on ? '#f2b8cc' : '#f6f1f3'}" stroke="${on ? '#c46b8e' : '#e6dde1'}" stroke-width="1.4"/><path d="M${x} 6.5h21" stroke="${on ? '#c46b8e' : '#e6dde1'}" stroke-width="1.4"/>`; }).join('')}</svg>`;
    const poopSvg = col => `<svg viewBox="0 0 64 44" style="display:block;width:60px;height:42px" aria-hidden="true"><path d="M12 38 C8 28 18 22 24 24 C24 14 36 12 40 21 C50 21 56 30 50 38 Z" fill="${col}"/></svg>`;
    const day = (n, wetLabel, col, poop, sub) => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px"><div style="background:#fbeef2;border-radius:16px;padding:12px"><small style="display:block;font-size:12.5px;color:#9b4766;font-weight:600">${F('Wet diapers')}</small><div style="margin:10px 0 8px">${diaperSvg(n)}</div><b style="font-size:20px">${F(wetLabel)}</b><small style="display:block;font-size:12.5px;color:var(--muted,#776)">${F('A day')}</small></div><div style="background:#f7f2ec;border-radius:16px;padding:12px"><small style="display:block;font-size:12.5px;color:#7a5a2c;font-weight:600">${F('Poop')}</small><div style="margin:4px 0 2px">${poopSvg(col)}</div><b style="font-size:16px;line-height:1.25;display:block">${F(poop)}</b><small style="display:block;font-size:12.5px;color:var(--muted,#776)">${F(sub)}</small></div></div>`;
    const ylw = br ? '#d4a23a' : fmOnly ? '#b98a4e' : '#c99642';
    return xPage('growth', 'x_enough', 'Wet diapers are your everyday sign', 'You don’t need to measure feeds. What comes out tells you what went in.',
      `<section class="hub-card" style="padding:14px 16px 16px;margin:0 0 12px">` + stageCar([['Days 1–2', 'First days', day(2, '1–2', '#2b2622', 'Black and sticky', 'His first poop')], ['Days 3–4', 'Changing', day(4, '3–4', '#5f6b33', 'Greenish', 'Getting lighter')], ['Day 5', 'Getting lighter', day(5, 'About 5', ylw, fmOnly ? 'Turning tan' : 'Turning yellow', 'Lighter each day')], ['Day 6 on', 'Settled', day(6, '6 or more', ylw, br ? 'Yellow and seedy' : fmOnly ? 'Tan, like peanut butter' : 'Yellow to tan', 'How often varies')]], now) + `</section>`
      + xDo('What to do', ['In the first week, count wet diapers: about one per day of life.', 'From day 6, look for 6 or more wet diapers a day' + (isBreast() ? ', and usually 3 or more yellow poops.' : '.'), 'A quick note of feeds and diapers helps until things feel settled.'])
      + xKnow('How you’ll know it’s going well', 'Heavy wet diapers, and poop that turns from black to green to ' + (fd() === 'Formula' ? 'tan' : 'yellow') + ' over the first 5 days.')
      + xNote('Worth a call:', 'fewer wet diapers than this, dark urine, or poop that stays black after day 5' + (isBreast() ? '. In the first weeks, fewer than 3 poops a day can mean he needs more milk.' : '.'))); };
  P.x_weight = () => xPage('growth', 'x_weight', 'Back to birth weight by about 2 weeks', 'Some loss at first is normal. After that, most babies gain about 5–7 oz a week.',
      H().tiles([['First few days', 'Some loss', 'Up to about 10% is common'], ['By about 2 weeks', 'Back to birth weight', 'The surest sign feeding is working']])
      + xDo('What to do', ['Go to the early weight checks, usually in the first week and at 2 weeks.', 'Feed on cue. You don’t need to weigh him at home.', 'Extra hungry for a few days? Often a growth spurt, around 2–3 weeks. Feed more often.'])
      + xKnow('Born early or slow to gain?', 'Your pediatrician may give you a feeding plan, with set times or amounts. Follow it first.')
      + xNote('Worth a call:', 'not back to birth weight by 2 weeks, or he seems to be feeding less.'));
  P.x_amount = () => xPage('growth', 'x_amount', 'Small feeds are all he needs at first', 'His stomach is tiny, and grows fast. That’s why he feeds so often.',
      H().tiles([['Day 1', '1–2 tsp', 'About a marble'], ['Day 3', 'About 1 oz', 'About a walnut'], ['Week 1', '1½–2 oz', 'About an apricot'], ['Weeks 2–4', '2–4 oz', 'About an egg']])
      + xDo('What to do', ['Follow his cues, not the ounces.', nurses() ? 'Nursing? You won’t see ounces, and that’s fine.' : 'Offer a little more only if he still seems hungry.'])
      + xKnow('How you’ll know it’s enough', 'You can’t see it in a feed, but you can in his diapers and his weight. That’s next.'));
  P.x_vitd = () => { const b = isBreast(), fm = formulaFam();
    return xPage('growth', 'x_vitd', b ? 'Vitamin D drops, every day' : 'Vitamin D and iron are in the formula', b ? 'Breast milk is low in vitamin D, so he needs drops from the first days.' : 'He needs vitamin D drops until he drinks about 32 oz a day.',
      H().tiles([['Vitamin D', b ? '400 IU a day' : 'In the formula', b ? 'Drops, from the first days' : 'Drops until 32 oz a day'], ['Iron', fm ? 'In the formula' : isEarly() ? 'From about 1 month' : (ageMo() < 4 ? 'Ask at 4 months' : 'Ask at the next checkup'), fm ? 'Choose one with iron' : isEarly() ? 'Drops, for babies born early' : 'Breast milk is low in iron']])
      + xDo(b ? 'How to give drops' : 'If your pediatrician suggests drops', [(nurses() ? 'Drip it on the nipple just before a feed, or slowly inside his cheek.' : 'Drip it slowly inside his cheek.'), 'Or mix it into about 1 oz of milk in a bottle, and make sure he finishes it.', 'Use the dropper that comes with them, and the dose on the label.'])
      + xKnow('No water yet', 'Milk is all he needs until about 6 months, even on hot days.')); };

  // Feeding challenges: pick what you're seeing, like Sleep's Rough night
  P.x_tough = () => { const nurse = nurses();
    const rows = [['x_spit', 'drop', 'Spit-up after feeds', 'How much is normal'], ['x_gas', 'heart', 'Gassy, or crying a lot', 'What helps, and when it won’t stop'], ['x_refuse', 'eye', 'Distracted, pulling off or refusing', 'Fussy, sleepy or stuffy'], ['x_poop', 'diaper', 'Poop looks off, or he’s constipated', 'Colors, and what helps']];
    return qaCss + page(head('Feeding challenges', 'Something not quite right?', 'Pick what’s happening. Most of it is common, and something here helps.', XC.tough)
      + `<div class="hub-list">${rows.map(([id, icon, title, sub]) => H().row({ cat: CAT, icon, title, sub, onclick: id === 'x_poop' ? poopGo() : go(id) }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`)).join('')}</div>`
      + `<section class="ss-moment">` + xKnow('Call your pediatrician', 'If he has ' + fever(false) + ', is too sleepy to feed, has fewer wet diapers, or green or bloody vomit. Call any time you’re unsure.')
      + xNote('Who can help:', 'your pediatrician' + (nurse ? ', and a lactation consultant for latching, often covered by insurance.' : '.')) + xNote('How are you doing?', 'If you feel low or overwhelmed most days, tell your doctor, or call or text 1-833-852-6262, any time.') + `</section>`); };
  const xTough = (id, title, lead, body) => qaCss + page(head('Feeding challenges', title, lead, XC.tough) + `<section class="ss-moment">${body}</section>`);
  P.x_spit = () => xTough('x_spit', 'Spit-up is common, and usually fine', 'A tablespoon or two at a time is normal, and it looks like more once it spreads out.',
      two(['Usually fine', 'Comfortable, growing, and plenty of wet diapers.'], ['Worth a call', 'Forceful or green vomit, blood, or crying and arching at most feeds.', '#fdeee6', '#9a5a3c'])
      + xDo('What helps', ['Hold him upright for 20–30 minutes after feeds.', 'Smaller feeds, more often.', 'Stop when he slows. No need to finish.'])
      + xKnow('For sleep', 'Flat on his back, even with spit-up. Wedges and inclined sleepers aren’t safe.')
      + (formulaFam() ? xNote('Wondering if it’s the formula?', 'Spit-up, gas and fussing happen on any formula. A rash or blood in his poop is worth a call. Ask your pediatrician before switching.') : ''));
  P.x_gas = () => xTough('x_gas', 'When he’s gassy or crying a lot', 'Some fussing every day is normal, often in the evening. These help most babies.',
      steps([['hand', 'Burp mid-feed', 'Not just at the end'], ['roll', 'Bicycle his legs', 'Gently, on his back'], ['mat', 'Tummy time', 'Awake and watched']], false)
      + xDo('Crying that won’t stop', ['Check for hunger, a burp, a diaper, or being too warm.', (ageMo() < 2 ? 'Swaddle, hold, shush and sway.' : 'Hold him close, shush and sway.'), 'Need a break? Lay him on his back somewhere safe, and step away for a few minutes.'], true)
      + xKnow('Never shake him', 'Even when you’re exhausted. Call someone to take over if you need to.')
      + xNote('Gas drops or gripe water?', 'Gas drops are safe but often don’t help much. Ask your pediatrician before gripe water.') + xNote('Worth a call:', 'crying for 3 or more hours a day, or grunting with every breath.'));
  P.x_refuse = () => xTough('x_refuse', 'Pulling off, refusing or fussing at feeds', 'It’s often air, a fast flow, or a stuffy nose. Small changes fix most of it.',
      xDo('What helps', ['Feed early, before crying starts.', 'Burp, then try again. Trapped air can feel like full.', isBottle() ? 'Check the nipple. Too fast or too slow?' : 'Gulping? Lean back, so he feeds against gravity.', 'Stuffy nose? Saline drops and gentle suction before feeds.', 'Distracted by everything, often from 3–4 months? Feed somewhere quiet and dim, or when he’s drowsy.'])
      + xKnow('Call right away', 'A' + fever().slice(1) + '.')
      + xNote('Worth a call:', 'too sleepy to feed most times, or refusing several feeds in a row.'));
  P.x_poop = () => xTough('x_poop', 'Poop changes a lot, and most of it is normal', 'Yellow, green, tan or mustard, seedy or with a little mucus.' + (isBreast() ? ' In the first weeks, breastfed babies usually go 3 or more times a day. After about 6 weeks, some go days between.' : ' On formula, once a day or every few days can both be normal.'),
      h2('Colors to call about') + illGrid([[ILL.poop('#e9e4d6'), 'White or pale', 'Call right away'], [ILL.poop('#b3362c'), 'Red', 'Could be blood'], [ILL.poop('#2b2622'), 'Black', 'After the first few days']])
      + xDo('If he seems constipated', ['Hard, dry, pebble-like poop is the sign, not how often he goes.', 'Bicycle his legs gently, or give a warm bath and a clockwise tummy rub.', formulaFam() ? 'Check the formula is mixed exactly as the label says.' : ''])
      + xKnow('Before giving anything', 'Ask your pediatrician before water, juice or anything else. Under 1 month old, call if he seems constipated.')
      + xNote('Straining and going red?', 'Normal too, as long as the poop is soft.'));

  // ---- Calmer versions (Nov 7): Sleep-length pages (about 100 words). Fixes for when it's not going smoothly sit in one
  // quiet two-column card (what you see → what to do) instead of a stack of notes. ----
  const xFix = (label, rows) => { rows = rows.filter(Boolean); return rows.length ? `<style>#main .xfix{margin:0 0 12px;padding:12px 18px 6px;border-radius:20px;background:#fff;border:1px solid var(--line)}#main .xfix>b{display:block;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ss-ink);margin:2px 0 4px}#main .xfix>div{display:grid;grid-template-columns:42% 1fr;gap:12px;padding:9px 0;border-top:1px solid var(--line);font-size:14.5px;line-height:1.4}#main .xfix>b+div{border-top:0}#main .xfix>div>span:first-child{font-weight:600;color:var(--ink)}#main .xfix>div>span+span{color:#4c4757}</style><section class="xfix"><b>${F(label)}</b>${rows.map(([q, a]) => `<div><span>${F(q)}</span><span>${F(a)}</span></div>`).join('')}</section>` : ''; };
  const latchVideo = () => `<p class="ss-small"><a href="https://www.youtube.com/watch?v=y--syZR0u1E" target="_blank" rel="noopener" style="color:var(--ss-ink);font-weight:600">${F('Watch a good latch')} ↗</a> ${F('A short video.')}</p>`;
  P.x_day = (() => { const prev = P.x_day; return () => prev().replace(F('Count from the start of one feed to the start of the next.'), F('Count from the start of one feed to the next.')).replace(F('Some feeds come close together, some further apart. Both are normal.'), F('Some come close together, some further apart.')).replace(F('A quick note of feeds and diapers helps in the first weeks.'), F(isBreast() && !stored() ? 'Days 3–5: expect hungrier, more frequent feeds as your milk comes in.' : 'Week 1: he’ll want a little more each day.')).replace(F('Fewer, more predictable feeds by about 6 weeks, and a longer night stretch around 2–3 months.'), F('More predictable by about 6 weeks, and a longer night stretch around 2–3 months.')); })();
  P.x_cues = () => xPage('feed', 'x_cues', 'Start at his early hunger cues', 'Feeding before he cries is easier for you both.',
      cueStrip().replace(`<b class="hub-fig-title">${F('Hunger cues, early to late')}</b>`, '')
      + xDo('What to do', ['Offer a feed at the first stirring or rooting.', 'Already crying? Calm him with a cuddle first.'])
      + xKnow('Hungry, or wants comfort?', 'A while since his last feed? Offer one. Just fed? Try a cuddle' + (nurses() ? ', or a pacifier once nursing is going well.' : ' or a pacifier.')));
  P.x_night = () => { const b = isBreast(), nurse = nurses();
    return xPage('routine', 'x_night', 'At night, keep feeds quick and calm', 'Dim, quiet nights and bright days help him learn day from night.',
      steps([['sun', 'By day', 'Bright, normal noise, play'], ['moon', 'At night', 'Dim, quiet, back down']], false)
      + xDo('What to do', ['Keep lights low and voices quiet. No play.', 'Change his diaper only if it’s needed.', 'Until he’s back to birth weight, wake him if 3 hours pass.'])
      + xKnow('Hard to wake?', 'Undress him to his diaper, stroke his feet, or change his diaper.')
      + xNote('Worth a call:', 'too sleepy to feed most times.')); };
  P.x_latch = () => xPage('feed', 'x_latch', 'A deep latch feels like a tug, not a pinch', 'Get comfortable first, with a pillow under him. Bring him to you, not you to him.',
      kHolds() + xDo('Step by step', ['Nose to nipple, head and body in a line.', 'Wait for a wide mouth, like a yawn.', 'Bring him in chin first.'], true)
      + xKnow('How you’ll know it’s right', 'Flared lips, long sucks with swallows, and a tug, not a pinch.')
      + xFix('If it’s not going smoothly', [['Clicking or pinching', 'Break the seal with a finger, and try again.'], ['Gulping or coughing', 'Lean back, so he feeds against gravity.'], ['Too sleepy to latch', 'Hand express a few drops of colostrum onto a spoon.'], ['Breast very full and firm', 'Hand express a little first, so he can latch.']])
      + latchVideo() + xNote('Worth a call:', 'most feeds hurt. A lactation consultant can help, and check for tongue-tie.'));
  P.x_burp = () => { const b = isBreast(), bot = isBottle(), nurse = nurses();
    const holds = illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'Chin on a burp cloth'], [ILL.sitting(PALT), 'Sitting on your lap', 'Support chin and chest'], [ILL.tummy(PALT), 'Tummy-down', 'Across your lap']]);
    return nurse ? xPage('feed', 'x_burp', 'When he slows, burp him and offer the other side', 'Often 10–20 minutes a side at first, but watch him, not the clock. Some feeds take one side, some both.',
      holds + xDo('What to do', ['When sucking slows, burp him.', 'Then offer the other side.', 'Start the next feed on the last side.'])
      + xFix('If it’s not going smoothly', [['Dozing off', 'Switch sides, or squeeze gently behind the nipple.'], ['Spit-up or hiccups', 'Common, and harmless.']])
      + (!bot ? xNote('A first bottle?', 'Around 3–4 weeks, once nursing is going well.') : ''))
    : xPage('feed', 'x_burp', 'Burp him every 2–3 oz, and at the end', 'Less air in means less fussing after.',
      holds + xDo('What to do', ['Pause every 2–3 oz, and at the end.', 'Firm pats or slow circles on his back.', 'No burp after a minute or two? Carry on.'])
      + xKnow('Good to know', 'A little spit-up and hiccups are common, and harmless.')); };
  P.x_bottle = () => { const nurse = nurses(), fm = formulaFam(), top = nurse && fm;
    return xPage('feed', 'x_bottle', top ? 'Top up with a small, paced bottle' : 'Pace each bottle, and stop when he’s done', top ? 'Only if he still seems hungry after both sides, or if your pediatrician suggests it.' : 'Let him set the pace. A bottle often takes 10–20 minutes.',
      (top ? H().tiles([['A top-up', '½–2 oz', 'After nursing'], ['Burp', 'Every 2–3 oz', 'And at the end']])
        : H().tiles([['Day 1', '1–2 tsp', 'A feed'], ['Day 3', 'About 1 oz', 'A feed'], ['Week 1', '1½–2 oz', 'A feed'], ['Weeks 2–4', '2–4 oz', 'A feed']]))
      + xDo('Step by step', ['Hold him semi-upright.', 'Touch his lip, and let him draw the nipple in.', 'Keep the bottle level, and pause every few sucks.', 'Stop when he’s done, even if milk is left.'], true)
      + xFix('If it’s not going smoothly', [['Gulping or spilling', 'Try a slower nipple.'], ['Working hard, frustrated', 'Try a faster nipple.'], ['Falls asleep', 'Burp, then offer again.'], nurse && ['Won’t take a bottle', 'Have someone else offer it.']])
      + (top ? xNote('Topping up most feeds?', 'Ask a lactation consultant how to keep your milk up, like pumping after.') : '') + xNote('Never prop a bottle.', 'Any bottle he takes well works, wide or narrow, with a slow-flow nipple.')); };
  P.x_store = () => { const b = isBreast(), fm = formulaFam();
    return xPage('prep', 'x_store', 'How long milk keeps', 'Once he starts a bottle, use it soon, then toss what’s left.',
      (b ? (fm ? h2('Breast milk') : '') + storeTable([['Fresh', '4 hours', '4 days', '6 months'], ['Thawed', '1–2 hours', '24 hours', 'Never refreeze']]) : '')
      + (fm ? (b ? h2('Formula') : '') + storeTable([['Made', '2 hours', '24 hours', 'Don’t freeze']]) : '')
      + xDo('What to do', ['Once he starts, finish within ' + (fm && !b ? '1 hour' : !fm ? '2 hours' : '1 hour for formula, 2 for breast milk') + '.', b ? 'Freeze flat in 2–4 oz bags, with a little room at the top. Thaw in the fridge.' : '', 'Warm in a bowl of warm water. Never microwave.'])
      + xNote('Out and about:', b ? 'a cooler with ice packs keeps breast milk 24 hours.' : 'carry powder and water separately.')); };
  P.x_enough = (() => { const prev = P.x_enough; return () => { const b = isBreast(), h = prev(), i = h.indexOf('<section class="ss-do">'); if (i < 0) return h; const j = h.indexOf('</section>', h.lastIndexOf('<p class="ss-small">')) ;
    const top = h.slice(0, i), tail = h.slice(h.indexOf('</section>', h.lastIndexOf('<p class="ss-small">')));
    return top + xDo('What to do', ['First week: about one wet diaper per day of life.', 'From day 6: 6 or more a day' + (b ? ', and 3 or more poops.' : '.')])
      + xKnow('How you’ll know it’s going well', 'Heavy diapers, and poop that turns from black to green to ' + (fd() === 'Formula' ? 'tan' : 'yellow') + ' by day 5.')
      + xNote('Worth a call:', 'fewer wet diapers, dark urine, or black poop after day 5.') + tail; }; })();
  P.x_weight = () => xPage('growth', 'x_weight', 'Back to birth weight by about 2 weeks', 'Some loss at first is normal. Your pediatrician checks at each visit.',
      H().tiles([['First few days', 'Some loss', 'Up to about 10%'], ['By about 2 weeks', 'Back to birth weight', 'Then 5–7 oz a week']])
      + xDo('What to do', ['First checkup at 3–5 days old, usually a day or two after you get home.', 'Feed on cue. No need to weigh at home.', 'Extra hungry for a few days? Often a growth spurt.'])
      + xNote('Born early or slow to gain?', 'Follow your pediatrician’s feeding plan first.') + xNote('Worth a call:', 'not back to birth weight by 2 weeks.'));
  P.x_poop = () => xTough('x_poop', 'Most poop colors are normal', 'Yellow, green or tan, seedy or with a little mucus. Straining with a red face is fine if the poop comes out soft.',
      h2('Colors to call about') + illGrid([[ILL.poop('#e9e4d6'), 'White or pale', 'Call right away'], [ILL.poop('#b3362c'), 'Red', 'Could be blood'], [ILL.poop('#2b2622'), 'Black', 'After the first few days']])
      + xKnow('How often', isBreast() ? (ageMo() < 1.5 ? 'In the first weeks, usually 3 or more a day. After about 6 weeks, some go days between.' : 'Some go a few days between poops now.') : 'Once a day or every few days can both be normal.')
      + xFix('If he seems constipated', [['The sign', 'Hard, pebble-like poop, not how often.'], ['What helps', 'Bicycle his legs, or a warm bath and tummy rub.'], formulaFam() && ['Formula', 'Check it’s mixed exactly as the label says.']])
      + xNote('Ask your pediatrician', 'before water or juice.' + (ageMo() < 1 ? ' Under 1 month old, call if he seems constipated.' : '')) + xNote('Calling about poop?', 'A photo of the diaper helps.'));
  P.x_gas = () => xTough('x_gas', 'When he’s gassy or crying a lot', 'Some fussing every day is normal, often in the evening.',
      steps([['hand', 'Burp mid-feed', 'Not just at the end'], ['roll', 'Bicycle his legs', 'Gently, on his back'], ['mat', 'Tummy time', 'Awake and watched']], false)
      + xDo('Crying that won’t stop', ['Check: hungry, burp, diaper, too warm?', (ageMo() < 2 ? 'Swaddle, hold, shush and sway.' : 'Hold him close, shush and sway.'), 'Need a break? Lay him on his back somewhere safe.'], true)
      + xKnow('Never shake him', 'Even when you’re exhausted. Call someone to take over.')
      + xNote('Gas drops?', 'Safe, but often don’t help. Ask your pediatrician before gripe water.') + xNote('Worth a call:', 'crying 3 or more hours a day, or grunting with every breath.'));

  // ---- Consistency pass (Nov 7): every page has the same anatomy (header → one picture in a white card → What to do →
  // How you'll know / fixes → one quiet note). Two-up cards take the page's own color. Stomach size is a picture. ----
  const xTwo = (a, b2, call) => `<section class="hub-card" style="padding:10px;margin:0 0 12px"><div class="fm-two" style="margin:0;gap:8px">${[[a, false], [b2, call]].map(([[t, d], c]) => `<div style="background:${c ? '#fdeee6' : 'var(--ss-bg)'};border-radius:14px;padding:12px"><small style="font-size:13px;font-weight:700;color:${c ? '#9a5a3c' : 'var(--ss-ink)'}">${F(t)}</small><span style="display:block;margin-top:4px;font-size:13.5px;line-height:1.4;color:#4c4757">${F(d)}</span></div>`).join('')}</div></section>`;
  const STOMACH = [
    ['Day 1', 'A marble', '1–2 tsp', `<svg viewBox="0 0 60 56" aria-hidden="true"><circle cx="30" cy="47" r="7" fill="#a9c8ea"/><circle cx="27.5" cy="44.5" r="2.2" fill="#fff" opacity=".8"/></svg>`],
    ['Day 3', 'A walnut', 'About 1 oz', `<svg viewBox="0 0 60 56" aria-hidden="true"><ellipse cx="30" cy="42" rx="12.5" ry="12" fill="#c49a6c"/><path d="M30 31c-3 4 3 7 0 11s3 7 0 11" stroke="#9c7247" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M22 38c2 1 3 3 2 5M38 38c-2 1-3 3-2 5" stroke="#9c7247" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`],
    ['Week 1', 'An apricot', '1½–2 oz', `<svg viewBox="0 0 60 56" aria-hidden="true"><circle cx="30" cy="38" r="16" fill="#f4a95c"/><path d="M30 23c-2 6-2 20 0 30" stroke="#e08a3c" stroke-width="1.6" fill="none"/><path d="M30 23c3-6 9-7 12-5-3 4-8 6-12 5Z" fill="#8fb36a"/><circle cx="24" cy="33" r="3" fill="#fff" opacity=".35"/></svg>`],
    ['Weeks 2–4', 'An egg', '2–4 oz', `<svg viewBox="0 0 60 56" aria-hidden="true"><path d="M30 8c11 0 18 18 18 30s-8 16-18 16-18-4-18-16S19 8 30 8Z" fill="#fbf4e6" stroke="#e6d8bd" stroke-width="1.5"/><ellipse cx="24" cy="24" rx="3.5" ry="6" fill="#fff" opacity=".9"/></svg>`]];
  const stomachViz = (title) => `<style>#main .xst{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center}#main .xst svg{width:100%;max-width:64px;height:auto;display:block;margin:0 auto 4px}#main .xst small{display:block;font-size:12px;font-weight:600;color:var(--ss-ink)}#main .xst b{display:block;font-size:15px;margin:1px 0}#main .xst span{display:block;font-size:12px;color:var(--muted,#6b6578);line-height:1.3}</style><section class="hub-card" style="padding:14px 12px 14px;margin:0 0 12px"><b style="display:block;font-size:15px;margin:0 4px 10px">${F(title)}</b><div class="xst">${STOMACH.map(([d, thing, amt, svg]) => `<div>${svg}<small>${F(d)}</small><b>${F(amt)}</b><span>${F(thing)}</span></div>`).join('')}</div></section>`;
  P.x_amount = () => xPage('growth', 'x_amount', 'Small feeds are all he needs at first', 'His stomach is tiny, and grows fast. That’s why he feeds so often.',
      stomachViz('His stomach, and about how much a feed holds')
      + xDo('What to do', ['Follow his cues, not the ounces.', nurses() ? 'Nursing? You won’t see ounces, and that’s fine.' : 'Offer a little more only if he still seems hungry.'])
      + xKnow('How you’ll know it’s enough', nurses() ? 'Wet diapers and steady weight, not ounces.' : 'You can’t see it in a feed, but you can in his diapers and weight. That’s next.'));
  P.x_bottle = (() => { const prev = P.x_bottle; return () => { const nurse = nurses(), fm = formulaFam(); if (nurse && fm) return prev();
    const h = prev(), i = h.indexOf('<div class="hub-tiles'); if (i < 0) return h; const j = h.indexOf('<section class="ss-do">', i);
    return h.slice(0, i) + stomachViz('About how much, per bottle') + h.slice(j); }; })();
  P.x_kind = (() => { const prev = P.x_kind; return () => { const b = isBreast(), fm = formulaFam(); let h = prev();
    if (b && fm) h = h.replace(two(['Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['Formula', 'Gives him everything he needs to grow, with vitamin D and iron.']), xTwo(['Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['Formula', 'Gives him everything he needs to grow, with vitamin D and iron.']));
    else if (b) h = h.replace(two(['Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['Vitamin D', 'Drops every day, from the first days.']), xTwo(['Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['Vitamin D', 'Drops every day, from the first days.']));
    return h; }; })();
  P.x_spit = (() => { const prev = P.x_spit; return () => prev().replace(two(['Usually fine', 'Comfortable, growing, and plenty of wet diapers.'], ['Worth a call', 'Forceful or green vomit, blood, or crying and arching at most feeds.', '#fdeee6', '#9a5a3c']), xTwo(['Usually fine', 'Comfortable, growing, and plenty of wet diapers.'], ['Worth a call', 'Forceful or green vomit, blood, or crying and arching at most feeds.'], true)); })();
  // Pages that had no picture get their steps as one: the same numbered icon row the rest of the app uses.
  P.x_formula = () => xPage('prep', 'x_formula', 'Make every bottle the same safe way', 'Powder isn’t sterile, and young babies are most at risk, so these steps matter.',
      steps([['hand', 'Wash', 'Hands, counter and bottle'], ['drop', 'Boil the water', 'Then let it sit 5 minutes'], ['bowl', 'Water, then powder', 'Level scoops, as the label says'], ['heart', 'Cool and test', 'Warm, not hot, on your wrist']], true)
      + xKnow('How long it keeps', 'Use within 2 hours, or fridge for up to 24. Once he starts, finish within 1 hour.')
      + xNote('Easier at 3 am:', 'ready-to-feed is sterile and needs no mixing. Ask your pediatrician if your tap water is safe.'));
  P.x_bm = () => xPage('prep', 'x_bm', 'Getting breast milk ready', 'Oldest first, gently mixed, and fed within 2 hours.',
      steps([['fridge', 'Oldest first', 'From the fridge, or thawed there overnight'], ['drop', 'Swirl', 'Don’t shake. Layers are normal'], ['heart', 'Warm or cool', 'Test a few drops on your wrist']], true)
      + xKnow('Never microwave', 'It heats unevenly and can burn. A bowl of warm water works best.'));
  P.x_clean = () => xPage('prep', 'x_clean', 'Wash bottles after every feed', 'And sanitize once a day for the first few months.',
      steps([['hand', 'Take it apart', pumps() ? 'Pump parts too' : 'Bottle, nipple, ring'], ['drop', 'Wash', 'Hot, soapy water or the dishwasher'], ['star', 'Air-dry', 'On a clean rack, not a towel']], true)
      + xKnow('Sanitizing', 'Once a day: boil 5 minutes, steam, or a sanitize cycle. Most important under 2 months, or for babies born early.'));

  // ---- Formatting pass 2 (Nov 7): the picture slot is always a white card. Milk and top-up get real pictures,
  // and the first-week diaper chart shows all four stages at once. ----
  const xCompare = (items) => `<style>#main .xcmp{display:grid;gap:0}#main .xcmp>div{padding:2px 12px 4px;display:grid;gap:4px;align-content:start}#main .xcmp>div+div{border-left:1px solid var(--line)}#main .xcmp i{width:42px;height:42px;border-radius:50%;background:var(--ss-bg);display:grid;place-items:center;padding:9px;box-sizing:border-box;margin-bottom:4px}#main .xcmp i svg{width:100%;height:100%;stroke:var(--ss-ink)}#main .xcmp b{font-size:15px}#main .xcmp span{font-size:13.5px;line-height:1.4;color:#4c4757}</style><section class="hub-card" style="padding:16px 4px 14px;margin:0 0 12px"><div class="xcmp" style="grid-template-columns:repeat(${items.length},1fr)">${items.map(([icon, t, d]) => `<div><i>${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</i><b>${F(t)}</b><span>${F(d)}</span></div>`).join('')}</div></section>`;
  const xNums = (title, items) => `<section class="hub-card" style="padding:16px 16px 14px;margin:0 0 12px">${title ? `<b style="display:block;font-size:17px;margin:0 0 10px">${F(title)}</b>` : ''}<div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:12px">${items.map(([n, l]) => `<div><strong style="display:block;font-size:28px;line-height:1.1">${F(n)}</strong><small style="display:block;color:var(--muted,#6b6578);font-size:13.5px;margin-top:3px">${F(l)}</small></div>`).join('')}</div></section>`;
  P.x_kind = () => { const b = isBreast(), fm = formulaFam();
    return xPage('prep', 'x_kind', b && fm ? 'Breast milk and formula are both good for him' : b ? (stg() >= 3 ? 'Breast milk still matters alongside food' : 'Breast milk is all he needs for now') : stg() >= 3 ? 'Formula still matters alongside food' : 'Formula gives him everything he needs', b && fm ? 'Any amount of breast milk helps, and formula fills the gap.' : b ? 'Plus vitamin D drops, every day.' : 'Any standard, iron-fortified formula works.',
      (b && fm ? xCompare([['drop', 'Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['bottle', 'Formula', 'Everything he needs to grow, with vitamin D and iron.']])
        : b ? xCompare([['drop', 'Breast milk', 'Changes as he grows, and helps protect him from some illnesses.'], ['star', 'Vitamin D', 'Drops every day, from the first days.']])
        : xCompare([['bottle', 'Ready-to-feed', 'Pour and feed. Easiest, costs most.'], ['drop', 'Concentrate', 'Mix with water.'], ['bowl', 'Powder', 'Mix with hot water. Costs least.']]))
      + xDo('What to do', b && fm ? ['Use any standard, iron-fortified formula.', (pumps() ? 'Offer breast milk first, then top up with formula, so no pumped milk gets thrown out.' : 'Nurse first, then top up with formula if he’s still hungry.')] : b ? ['Give vitamin D drops every day.', 'If you ever add formula, any standard, iron-fortified one works.'] : ['Follow the label exactly. Never water it down.', 'Switching between standard brands is fine.', 'Ask before a special formula.'])); };
  P.x_bottle = (() => { const prev = P.x_bottle; return () => { const nurse = nurses(), fm = formulaFam(); const h = prev(); if (!(nurse && fm)) return h;
    const i = h.indexOf('<div class="hub-tiles'), j = h.indexOf('<section class="ss-do">', i); if (i < 0 || j < 0) return h;
    return h.slice(0, i) + xNums('A top-up', [['½–2 oz', 'After nursing, if still hungry'], ['2–3 oz', 'Burp every'], ]) + h.slice(j); }; })();
  // First-week diapers: all four stages in one card, today's row highlighted
  P.x_enough = () => { const b = isBreast(), br = b && fd() === 'Breast milk', fmOnly = fd() === 'Formula', d = babyDays(), now = d < 2 ? 0 : d < 4 ? 1 : d < 5 ? 2 : 3;
    const ylw = br ? '#d4a23a' : fmOnly ? '#b98a4e' : '#c99642';
    const dia = n => `<svg viewBox="0 0 108 18" style="display:block;width:100%;max-width:120px;height:auto;aspect-ratio:6/1" aria-hidden="true">${Array.from({ length: 6 }, (_, i) => { const on = i < n, x = i * 18 + 1; return `<path d="M${x} 2h15v4c0 5-3.5 9-7.5 9S${x} 11 ${x} 6Z" fill="${on ? '#f2b8cc' : '#f6f1f3'}" stroke="${on ? '#c46b8e' : '#e6dde1'}" stroke-width="1.2"/>`; }).join('')}</svg>`;
    const blob = col => `<svg viewBox="0 0 64 44" style="display:block;flex:none;width:32px;height:22px" aria-hidden="true"><path d="M12 38 C8 28 18 22 24 24 C24 14 36 12 40 21 C50 21 56 30 50 38 Z" fill="${col}"/></svg>`;
    const rows = [['Days 1–2', 2, '1–2', '#2b2622', 'Black, sticky'], ['Days 3–4', 4, '3–4', '#5f6b33', 'Greenish'], ['Day 5', 5, 'About 5', ylw, fmOnly ? 'Turning tan' : 'Turning yellow'], ['Day 6 on', 6, '6 or more', ylw, br ? 'Yellow, seedy' : fmOnly ? 'Tan' : 'Yellow to tan']];
    const card = `<style>#main .xdi{display:grid;grid-template-columns:62px 1fr 92px;align-items:center;gap:8px;padding:9px 10px;border-radius:14px}#main .xdi+.xdi{margin-top:2px}#main .xdi.is-now{background:var(--ss-bg)}#main .xdi small{display:block;font-size:12.5px;font-weight:600;color:var(--ink)}#main .xdi em{display:inline-block;font-style:normal;font-size:10.5px;font-weight:700;color:#fff;background:var(--ss-ink);border-radius:999px;padding:1px 6px;margin-top:3px}#main .xdi .w b{display:block;font-size:13px;margin-top:2px}#main .xdi .p{display:flex;align-items:center;gap:4px;font-size:12.5px;line-height:1.2;color:#4c4757}</style>`
      + `<section class="hub-card" style="padding:14px 8px 10px;margin:0 0 12px"><div style="display:grid;grid-template-columns:62px 1fr 92px;gap:8px;padding:0 10px 6px;font-size:12px;font-weight:600;color:var(--muted,#6b6578)"><span></span><span>${F('Wet diapers a day')}</span><span>${F('Poop')}</span></div>`
      + rows.map(([day, n, wet, col, poop], i) => `<div class="xdi${i === now ? ' is-now' : ''}"><div><small>${F(day)}</small>${i === now ? `<em>${F('Now')}</em>` : ''}</div><div class="w">${dia(n)}<b>${F(wet)}</b></div><div class="p">${blob(col)}<span>${F(poop)}</span></div></div>`).join('') + `</section>`;
    return xPage('growth', 'x_enough', 'Wet diapers are your everyday sign', 'You don’t need to measure feeds. What comes out tells you what went in.',
      card + xDo('What to do', ['First week: about one wet diaper per day of life.', 'From day 6: 6 or more a day' + (b ? ', and 3 or more poops.' : '.'), 'Keep a quick note of feeds and diapers, like the hospital log, until things feel settled.'])
      + xKnow('How you’ll know it’s going well', 'Heavy diapers, and poop that turns from black to green to ' + (fmOnly ? 'tan' : 'yellow') + ' by day 5.')
      + xNote('Worth a call:', 'fewer wet diapers, dark urine, or black poop after day 5.')); };

  const topUpViz = () => `<section class="hub-card" style="padding:16px;margin:0 0 12px;display:flex;gap:16px;align-items:center"><svg viewBox="0 0 40 72" style="flex:none;width:44px;height:auto" aria-hidden="true"><path d="M15 4h10v8H15z" fill="#e9c6d3"/><path d="M12 12h16l3 8v44a6 6 0 0 1-6 6H15a6 6 0 0 1-6-6V20Z" fill="#fff" stroke="#d9b3c2" stroke-width="2"/><path d="M10 52h20v12a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5Z" fill="#f6dbe5"/>${[30, 40, 52].map(y => `<path d="M24 ${y}h5" stroke="#d9b3c2" stroke-width="1.5"/>`).join('')}</svg><div><small style="display:block;font-size:12.5px;font-weight:600;color:var(--ss-ink)">${F('A top-up')}</small><strong style="display:block;font-size:28px;line-height:1.1;margin:2px 0">${F('½–2 oz')}</strong><span style="display:block;font-size:13.5px;line-height:1.4;color:#4c4757">${F('A small bottle after nursing. Your pediatrician or lactation consultant can tell you how much.')}</span></div></section>`;
  P.x_bottle = (() => { const prev = P.x_bottle; return () => prev().replace(xNums('A top-up', [['½–2 oz', 'After nursing, if still hungry'], ['2–3 oz', 'Burp every']]), topUpViz()); })();
  const weightViz = () => { const W = 300, H = 120, x = d => 18 + d / 28 * (W - 36), y = v => 70 - v * 4.2;
    const pts = [[0, 0], [2, -5], [4, -7], [7, -4], [11, -1], [14, 0], [21, 3.5], [28, 7]].map(([d, v]) => `${x(d).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    return `<section class="hub-card" style="padding:14px 14px 10px;margin:0 0 12px"><b style="display:block;font-size:15px;margin:0 2px 6px">${F('His first month')}</b><svg viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto" aria-label="${F('Weight dips in the first days, is back to birth weight by about 2 weeks, then climbs')}">`
      + `<line x1="12" x2="${W - 12}" y1="${y(0)}" y2="${y(0)}" stroke="#d9cfc0" stroke-dasharray="4 4"/><text x="${W - 12}" y="${y(0) + 15}" text-anchor="end" font-size="11" fill="#8a8295">${F('Birth weight')}</text>`
      + `<polyline points="${pts}" fill="none" stroke="var(--ss-ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<circle cx="${x(4)}" cy="${y(-7)}" r="4.5" fill="#fff" stroke="var(--ss-ink)" stroke-width="2"/><circle cx="${x(14)}" cy="${y(0)}" r="4.5" fill="var(--ss-ink)"/>`
      + `<text x="${x(4)}" y="${y(-7) + 20}" text-anchor="middle" font-size="11.5" font-weight="600" fill="#4c4757">${F('Some loss')}</text><text x="${x(4)}" y="${y(-7) + 33}" text-anchor="middle" font-size="10.5" fill="#8a8295">${F('up to 10%')}</text>`
      + `<text x="${x(14)}" y="${y(0) + 20}" text-anchor="middle" font-size="11.5" font-weight="600" fill="#4c4757">${F('Back')}</text><text x="${x(14)}" y="${y(0) + 33}" text-anchor="middle" font-size="10.5" fill="#8a8295">${F('by 2 weeks')}</text>`
      + `<text x="${x(28)}" y="${y(7) - 12}" text-anchor="end" font-size="11.5" font-weight="600" fill="#4c4757">${F('Then 5–7 oz a week')}</text></svg>`
      + `<div style="display:flex;justify-content:space-between;font-size:11px;color:#8a8295;margin:2px 4px 0"><span>${F('Birth')}</span><span>${F('1 week')}</span><span>${F('2 weeks')}</span><span>${F('3 weeks')}</span><span>${F('4 weeks')}</span></div></section>`; };
  P.x_weight = () => xPage('growth', 'x_weight', 'Back to birth weight by about 2 weeks', 'A dip in the first days is normal. Your pediatrician checks at each visit.',
      weightViz()
      + xDo('What to do', ['First checkup at 3–5 days old, usually a day or two after you get home.', 'Feed on cue. No need to weigh at home.', 'Extra hungry for a few days? Often a growth spurt.'])
      + xNote('Born early or slow to gain?', 'Follow your pediatrician’s feeding plan first.') + xNote('Worth a call:', 'not back to birth weight by 2 weeks.'));
  P.x_vitd = () => { const b = isBreast(), fm = formulaFam(), early = isEarly();
    return xPage('growth', 'x_vitd', b ? 'Vitamin D drops, every day' : 'Vitamin D and iron are in the formula', b ? 'Breast milk is low in vitamin D, so he needs drops from the first days.' : 'He needs vitamin D drops until he drinks about 32 oz a day.',
      xCompare([['sun', 'Vitamin D', b ? '400 IU a day, as drops, from the first days.' : 'In the formula. Drops until he drinks 32 oz a day.'], ['star', 'Iron', fm ? 'In the formula. Choose one with iron.' : early ? 'Drops from about 1 month, for babies born early.' : (ageMo() < 4 ? 'Ask at 4 months.' : 'Ask at the next checkup.') + ' Breast milk is low in iron.']])
      + xDo(b ? 'How to give drops' : 'If your pediatrician suggests drops', ['Use the dropper that comes with them, and the dose on the label.', (nurses() ? 'Drip it on the nipple just before a feed, or inside his cheek.' : 'Drip it slowly inside his cheek.'), 'Or mix it into about 1 oz of milk, and make sure he finishes it.'])
      + xNote('No water yet.', 'Milk is all he needs until about 6 months, even on hot days.')); };

  // ---- Milk feeds (6 weeks–4 months), built on the Newborn model (Nov 7). ----
  P.y_cues = () => xPage('f1', 'y_cues', 'He’s easier to read now', 'Feed on cue, not the clock. Many babies go 2–4 hours between feeds.',
      cueStrip().replace(`<b class="hub-fig-title">${F('Hunger cues, early to late')}</b>`, '')
      + xDo('What to do', ['Offer a feed at early cues, like rooting or hands to mouth.', 'Just fed and fussing? He may want to suck, play or sleep instead.'])
      + xKnow('Hungry, or something else?', 'Babies this age also fuss when tired or overstimulated. If he just ate, try a change of scene first.'));
  P.y_nurse = () => xPage('f1', 'y_nurse', 'Quicker feeds are normal', 'He’s better at it now. Many feeds take 5–10 minutes a side.',
      xNums('', [['5–10 min', 'A side, often'], ['7–9', 'Feeds a day']])
      + xDo('What to do', ['Let him finish the first side, then offer the second.', 'Shorter feeds don’t mean less milk. Diapers and weight tell you.'])
      + xFix('If it’s not going smoothly', [['Pulls off and fusses', 'Burp, then try again. Milk coming fast? Lean back.'], ['Distracted by everything', 'Feed somewhere quiet and dim.']]));
  P.y_bottle = () => { const nurse = nurses(), fm = formulaFam(), b = isBreast(), top = nurse && fm;
    return xPage('f1', 'y_bottle', top ? 'Top-ups, only if he still seems hungry' : 'Bigger bottles, same slow pace', top ? 'Many babies need fewer top-ups as nursing gets easier. Your pediatrician can help you cut back.' : 'Let him set the pace. He’ll take a little more as he grows.',
      xNums('About how much, per bottle', fm && b ? [['3–4 oz', 'Breast milk'], ['4–6 oz', 'Formula']] : fm ? [['4–5 oz', 'Around 2 months'], ['4–6 oz', 'Around 4 months']] : [['3–4 oz', 'Through these months'], ['24–30 oz', 'A day, in all']])
      + xDo('What to do', ['Keep pacing: hold the bottle level and pause every few sucks.', 'Stop when he’s done, even if milk is left.', fm ? 'No more than about 32 oz of formula a day.' : ''])
      + xFix('If it’s not going smoothly', [['Gulping or spilling', 'Stay with the slower nipple.'], ['Sucks hard, frustrated', 'Try the next nipple size.'], nurse && ['Refuses the bottle', 'Someone else offers, before he’s very hungry.']])
      + xNote('Never prop a bottle.', 'And no bottle in the crib.')); };
  P.y_burp = () => { const b = isBreast(), bot = isBottle();
    return xPage('f1', 'y_burp', 'Fewer burps, still worth a try', 'He swallows less air now, but a burp mid-feed still helps.',
      illGrid([[ILL.shoulder(PALT), 'Over your shoulder', 'Chin on a burp cloth'], [ILL.sitting(PALT), 'Sitting on your lap', 'Support chin and chest'], [ILL.tummy(PALT), 'Tummy-down', 'Across your lap']])
      + xDo('What to do', [(b && !bot ? 'Between sides' : 'Halfway through') + ', and at the end.', 'No burp after a minute? Carry on.'])
      + xKnow('Spit-up peaks around 4 months', 'It’s common, and usually eases by his first birthday. See Feeding challenges if it bothers him.')); };
  P.y_full = () => xPage('f1', 'y_full', 'He’ll tell you when he’s done', 'He may stop sooner now, and that’s fine.',
      fullTiles()
      + xDo('What to do', ['Stop when he turns away or slows right down.', 'Some feeds are big, some are snacks. Both are normal.'])
      + xKnow('How you’ll know it’s enough', 'Wet diapers through the day, and steady growth at checkups.'));
  P.y_day = () => { const b = isBreast();
    return xPage('d1', 'y_day', 'Fewer, more predictable feeds', 'A rhythm starts to show, still led by his cues.',
      xNums('A day of feeds', [[b ? '7–9' : '6–8', 'Feeds a day'], [b ? '2–4 hrs' : '3–4 hrs', 'From the start of one feed']])
      + xDo('What to do', ['Feed on cue. A loose rhythm is fine; no schedule needed.', 'Growth spurts around 6 weeks and 3 months mean more feeds for a few days.'])
      + xKnow('How it changes', 'By 4 months, many babies settle into a pattern you can plan around.')); };
  P.y_evening = () => xPage('d1', 'y_evening', 'Fussy evenings peak, then ease', 'Crying and cluster feeds often peak around 6 weeks, and ease by 3–4 months.',
      hubStageStrip({ title: 'How it eases', items: [['clock', 'Around 6 weeks', 'The fussiest weeks'], ['heart', '8–10 weeks', 'Starting to ease'], ['smile', '3–4 months', 'Calmer evenings']], cat: CAT })
      + xDo('What helps', ['Feed when he asks, even if it was just an hour ago.', 'Dim the lights and keep it calm.', 'Take turns, so you each get a break.'])
      + xNote('Worth a call:', 'crying 3 or more hours a day, or crying that sounds different.'));
  P.y_night = () => xPage('d1', 'y_night', 'A longer stretch at night', 'Many babies sleep one longer stretch, often 4–6 hours, by 2–3 months.',
      steps([['sun', 'By day', 'Feed every few hours, play between'], ['moon', 'At night', 'Quick, dim feeds, straight back down']], false)
      + xDo('What to do', ['Once your pediatrician says he’s gaining well, let him wake you.', 'Keep night feeds quick and dim.', 'One or two night feeds is still normal.'])
      + xKnow('More on nights', 'Sleep has the rest: routines, naps and the 4-month changes.'));
  P.y_make = () => { const fm = formulaFam(), pump = pumps();
    return fm ? xPage('p1', 'y_make', 'Make every bottle the same safe way', 'Same steps as before. After 2–3 months, ask whether tap water is fine without boiling.',
      steps([['hand', 'Wash', 'Hands, counter and bottle'], ['drop', 'Water first', 'Boiled and cooled, or as your pediatrician says'], ['bowl', 'Then powder', 'Level scoops, as the label says'], ['heart', 'Test', 'Warm, not hot, on your wrist']], true)
      + xKnow('How long it keeps', 'Use within 2 hours, or fridge for up to 24. Once he starts, finish within 1 hour.'))
      : P.x_bm(); };
  P.y_away = () => { const b = isBreast(), fm = formulaFam();
    return xPage('p1', 'y_away', 'Bottles away from home', 'For daycare, a sitter or a day out.',
      xCompare([['star', 'Label', 'His name and the date on every bottle.'], ['snow', 'Keep cold', 'A cooler with ice packs, up to 24 hours.'], ['clock', 'How much', b ? 'About 1–1½ oz for each hour you’re apart.' : 'Pre-measured powder, water separately.']])
      + xDo('What to do', ['Show caregivers paced bottle feeding.', b ? 'Send a few small bottles, so less is wasted.' : 'Mix right before the feed.', 'Ask them to feed on cue, not the clock.'])); };
  P.y_diapers = () => { const b = isBreast();
    return xPage('g1', 'y_diapers', 'Diapers still tell you', 'Wet diapers are the everyday sign he’s getting enough.',
      xNums('', [['6+', 'Wet diapers a day'], [b ? 'Varies' : '1–3', b ? 'Poop: daily to once a week' : 'Poops a day, often']])
      + xDo('What to do', ['Not sure? Count wet diapers on a normal day.', b ? 'After 6 weeks, some breastfed babies poop only every few days. Soft is what matters.' : 'Soft and pasty is normal. Hard pebbles: see Feeding challenges.'])
      + xNote('Worth a call:', 'fewer than 6 wet diapers a day, or dark urine.')); };
  P.y_weight = () => xPage('g1', 'y_weight', 'Steady growth at checkups', 'Your pediatrician weighs him at 2 and 4 months.',
      xNums('', [['5–7 oz', 'A week, early on'], ['About 2×', 'Birth weight by 4–5 months']])
      + xDo('What to do', ['He follows his own curve. Staying on it matters more than the percentile.', 'Extra hungry for a few days? Often a growth spurt.'])
      + xNote('Worth a call:', 'feeding much less, or fewer wet diapers.'));
  window.M1HOME = () => { const b = isBreast(), nurse = nurses(), fm = formulaFam(), bot = isBottle(), h = H();
    const TONE = { f1: ['#fbe4ec', '#9b4766'], d1: ['#e7effc', '#46638c'], p1: ['#fdeee6', '#9a5a3c'], g1: ['#fff3dc', '#8a6a2a'] };
    const cr = (label, icon, title, sub, area) => h.row({ cat: CAT, icon, title, sub, onclick: go('xa:' + area) }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`).replace('<span class="hub-row-copy">', `<span class="hub-row-copy"><small class="hub-row-eyebrow">${F(label)}</small>`).replace('class="hub-row', `style="--sm-bg:${TONE[area][0]};--sm-ink:${TONE[area][1]}" class="sm-row hub-row`);
    const R = [['A feed, step by step', nurse ? 'hand' : 'bottle', nurse ? 'Quicker feeds are normal' : 'Bigger bottles, same slow pace', 'Hungry, ' + (nurse && fm ? 'nurse, top up' : nurse ? 'nurse' : 'bottle') + ', burp, full', 'f1'],
      ['His day and night', 'clock', 'Fewer, more predictable feeds', 'Day, evening and night', 'd1'],
      bot && ['Bottles, start to finish', 'bottle', 'Daycare, travel and storing', 'Make, store, away and clean', 'p1'],
      ['Is he getting enough?', 'leaf', 'Wet diapers and steady growth', 'Diapers, weight, vitamin D', 'g1']];
    const rough = `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go('x_tough')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('heart', CAT)}</span><span class="hub-rough-copy"><b>${F('Feeding challenges')}</b><small>${F('Spit-up, gas and crying, distracted or refusing, poop')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    return `<h2 class="hub-h2">${F('How to help Ari feed now')}</h2><div class="hub-list">${R.filter(Boolean).map(r => cr(...r)).join('')}</div>` + rough
      + h.versus('Normal, or time to call?', ['Normal', 'Shorter feeds, fussy evenings, spit-up' + (b ? ', fewer poops' : '') + '.'], ['Call your pediatrician', 'Fewer than 6 wet diapers, refusing several feeds, forceful vomiting, or a fever of 100.4°F under 3 months.']); };

  // ---- Milk feeds, only what's new (Nov 7): parents already know how to feed, so this stage shows just what changes.
  // A few rows on the stage page, each one short page. No repeats of Newborn. ----
  Object.assign(HEADART, { 'Feeds now': () => ART.drops(4), 'Evenings': () => ART.often(5), 'Nights': () => ART.often(3), 'Away from home': () => ART.bottle(.55), 'Growing': () => ART.diapers(6) });
  const yPage = (c, eyebrow, title, lead, body) => window.__xCollect ? head(window.__xCollect === true ? eyebrow : window.__xCollect, title, lead, window.__xColor || c) + `<section class="ss-moment">${body}</section>` : qaCss + page(head(eyebrow, title, lead, c) + `<section class="ss-moment">${body}</section>`);
  P.y_nurse = () => { const fm = formulaFam(), bot = isBottle();
    return yPage(XC.f1, 'Feeds now', 'Quicker feeds are normal', 'He’s better at it now. Many feeds take 5–10 minutes a side, and that’s enough.',
      xNums('', [['5–10 min', 'A side, often'], ['7–9', 'Feeds a day']])
      + xDo('What’s new', ['Shorter feeds don’t mean less milk. Diapers and growth tell you.', ageMo() < 4 ? 'Growth spurts around 6 weeks and 3 months: more feeds for a few days.' : '', fm ? 'Many babies need fewer top-ups now. Ask your pediatrician about cutting back.' : ''])
      + xFix('If it’s not going smoothly', [['Pulls off and fusses', 'Burp, then try again. Milk coming fast? Lean back.'], ['Distracted by everything', 'Often from 3–4 months. Feed somewhere quiet and dim.']])); };
  P.y_bottle = () => { const fm = formulaFam(), b = isBreast(), nurse = nurses();
    return yPage(XC.f1, 'Feeds now', 'Bigger bottles, same slow pace', 'Bottles grow a little as he does. Keep letting him set the pace.',
      xNums('About how much, per bottle', fm && b ? [['3–4 oz', 'Breast milk'], ['4–6 oz', 'Formula']] : fm ? [['4–5 oz', 'Around 2 months'], ['4–6 oz', 'Around 4 months']] : [['3–4 oz', 'Through these months'], ['24–30 oz', 'A day, in all']])
      + xDo('What’s new', [ageMo() < 4 ? 'Growth spurts around 6 weeks and 3 months: more for a few days.' : '', fm ? 'Up to about 32 oz of formula a day.' : 'Breast milk bottles stay about the same size.'])
      + xFix('If it’s not going smoothly', [['Sucks hard, frustrated', 'Try the next nipple size.'], ['Gulping or spilling', 'Stay with the slower one.'], ['Distracted by everything', 'Often from 3–4 months. Feed somewhere quiet and dim.']])); };
  P.y_evening = () => yPage(XC.d1, 'Evenings', 'Fussy evenings peak, then ease', 'Crying and cluster feeds often peak around 6 weeks, and ease by 3–4 months.',
      hubStageStrip({ title: '', items: [['clock', 'Around 6 weeks', 'The fussiest weeks'], ['heart', '8–10 weeks', 'Starting to ease'], ['smile', '3–4 months', 'Calmer evenings']], cat: CAT })
      + xKnow('What helps', 'Feed when he asks, keep the lights low, and take turns so you each get a break.')
      + xNote('Worth a call:', 'crying 3 or more hours a day, or crying that sounds different.'));
  P.y_night = () => yPage(XC.d1, 'Nights', 'A longer stretch at night', 'Many babies sleep one longer stretch, often 4–6 hours, by 2–3 months.',
      xNums('', [['4–6 hrs', 'A longer stretch, often'], ['1–2', 'Night feeds, still normal']])
      + xDo('What’s new', ['Once your pediatrician says he’s gaining well, you can stop waking him and let him wake you.'])
      + xKnow('More on nights', 'Sleep has the rest: routines, naps and the 4-month changes.'));
  P.y_away = () => { const b = isBreast();
    return yPage(XC.p1, 'Away from home', 'Bottles for daycare, a sitter or a day out', 'The same safe bottles, packed to travel.',
      xCompare([['star', 'Label', 'His name and the date on every bottle.'], ['snow', 'Keep cold', 'A cooler with ice packs, up to 24 hours.'], ['clock', 'How much', b ? 'About 1–1½ oz for each hour you’re apart.' : 'Pre-measured powder, water separately.']])
      + xDo('What to tell caregivers', ['Feed on cue, not the clock.', 'Hold the bottle level, and let him pause.', b ? 'Small bottles, so less is wasted.' : 'Mix right before the feed.'])
      + (b ? xNote('Before you’re apart:', 'build a small freezer stash over a few weeks, and have someone else give a bottle once or twice a week.') : '')); };
  P.y_growth = () => { const b = isBreast();
    return yPage(XC.g1, 'Growing', b ? 'Wet diapers and growth tell you he’s getting enough' : 'Steady growth at checkups', b ? 'Fewer poops can be normal after about 6 weeks. Wet diapers and growth are what count.' : 'Your pediatrician weighs him at 2 and 4 months.',
      xNums('', [['6+', 'Wet diapers a day, still'], ['About 2×', ageMo() >= 4 ? 'Birth weight, reached around 4–5 months' : 'Birth weight by 4–5 months']])
      + xKnow('How you’ll know it’s going well', 'Wet diapers, and he stays on his own growth curve at checkups.')
      + xNote('Worth a call:', 'fewer than 6 wet diapers a day, or feeding much less.')); };
  window.M1HOME = () => { const b = isBreast(), nurse = nurses(), fm = formulaFam(), bot = isBottle(), h = H();
    const T = { f1: XC.f1, d1: XC.d1, p1: XC.p1, g1: XC.g1 };
    const cr = (t, icon, title, sub, id) => h.row({ cat: CAT, icon, title, sub, onclick: go(id) }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`).replace('class="hub-row', `style="--sm-bg:${T[t][0]};--sm-ink:${T[t][1]}" class="sm-row hub-row`);
    const R = [nurse ? ['f1', 'heart', 'Quicker feeds are normal', '5–10 minutes a side is often enough', 'y_nurse'] : ['f1', 'bottle', 'Bigger bottles, same slow pace', 'How much now, and nipple size', 'y_bottle'],
      ['d1', 'moon', 'Fussy evenings ease, night feeds spread out', 'Evenings, then nights', 'xa:m1e'],
      bot && ['p1', 'bag', 'Bottles away from home', 'Daycare, a sitter or a day out', 'y_away'],
      ['g1', 'leaf', b ? 'Fewer poops can be normal' : 'Steady growth at checkups', b ? 'Wet diapers still tell you' : 'At 2 and 4 months', 'y_growth']];
    const rough = `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go('x_tough')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('heart', CAT)}</span><span class="hub-rough-copy"><b>${F('Feeding challenges')}</b><small>${F('Spit-up, gas and crying, distracted or refusing, poop')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    return `<h2 class="hub-h2">${F('What’s new now')}</h2><div class="hub-list">${R.filter(Boolean).map(r => cr(...r)).join('')}</div>` + rough
      + h.versus('Normal, or time to call?', ['Normal', 'Shorter feeds, fussy evenings, spit-up' + (b ? ', fewer poops' : '') + '.'], ['Call your pediatrician', 'Fewer than 6 wet diapers, refusing several feeds, forceful vomiting, or a fever of 100.4°F under 3 months.']); };

  // Night feeds, told as feeding (not sleep)
  P.y_night = () => yPage(XC.d1, 'Nights', 'Night feeds start to spread out', 'Many babies go one longer stretch between feeds, often 4–6 hours, by 2–3 months.',
      xNums('', [['4–6 hrs', 'The longest stretch, often'], ['1–2', 'Night feeds, still normal']])
      + xDo('What’s new', ['Once your pediatrician says he’s gaining well, you can stop waking him for feeds.', 'Still feed when he wakes hungry. Dropping night feeds is a choice to make with your pediatrician.']));
  window.M1HOME = (() => { const prev = window.M1HOME; return () => prev().replace(F('When you can stop waking him'), F('When you can stop waking him for feeds')).replace(F('A longer stretch at night'), F('Night feeds start to spread out')); })();

  // ---- Ready for solids, First foods, Meals (Nov 7): only what's new at each stage, a few short pages each. ----
  const XG = ['#e6f1e8', '#356651'], XL = ['#f6e8f3', '#7a4f74'];
  Object.assign(HEADART, { 'Getting ready': () => ART.often(4), 'Safety': () => ART.often(3), 'Allergies': () => ART.drops(4), 'Iron': () => ART.drops(3), 'On the tray': () => ART.often(5), 'Drinks': () => ART.bottle(.4), 'Meals': () => ART.often(3), 'Milk': () => ART.bottle(.55), 'Appetite': () => ART.often(4) });
  const chips = (items) => `<section class="hub-card" style="padding:14px 14px 10px;margin:0 0 12px"><div style="display:flex;flex-wrap:wrap;gap:8px">${items.map(t => `<span style="background:var(--ss-bg);color:var(--ss-ink);border-radius:999px;padding:6px 12px;font-size:14px;font-weight:600">${F(t)}</span>`).join('')}</div></section>`;
  // Ready for solids (4–6 months)
  P.z_signs = () => yPage(XG, 'Getting ready', 'Start solids when he shows all the signs', 'Around 6 months, never before 4. Milk is still all he needs until then.',
      steps([['smile', 'Steady head', 'Holds it up well'], ['chair', 'Sits with support', 'In a high chair'], ['eye', 'Interested', 'Watches and reaches for food'], ['bowl', 'Swallows', 'Doesn’t push food back out']], false)
      + xDo('What to do', ['Wait for all four signs, not just one.', ageMo() < 4 ? 'Ask your pediatrician at the 4- or 6-month checkup.' : ageMo() < 6 ? 'Ask about it at Ari’s 6-month checkup.' : 'Ask about it at Ari’s next checkup.'])
      + xKnow('Good to know', 'Starting early doesn’t help him sleep longer.'));
  P.z_setup = () => yPage(XG, 'Getting ready', 'Get set up for the first bite', 'A few things to have before you start, and one skill to learn.',
      xCompare([['chair', 'High chair', 'Upright, with a harness and footrest.'], ['bowl', 'Soft spoon', 'And a bib that catches.'], ['cup', 'Open cup', 'For sips of water.']])
      + xDo('Before you start', ['Learn the difference between gagging and choking, and infant first aid. It’s next.', 'Pick a calm time of day, when he’s not too hungry or tired.'])
      + xKnow('Purées, finger foods, or both?', 'All work. Spoon-fed purées, soft finger strips, or a mix. Pick what suits your family.'));
  P.z_allergy = () => yPage(XL, 'Allergies', 'Eczema or food allergies in the family?', 'Babies at higher risk may need peanut sooner, as early as 4–6 months.',
      xTwo(['Higher risk', 'Severe eczema, or an egg allergy.'], ['What to do', 'Ask your pediatrician before starting peanut. They may test first.'])
      + xKnow('Everyone else', 'Start peanut and egg early with first foods, around 6 months. No need to wait.'));
  P.z_iron = () => yPage(XC.g1, 'Iron', (isEarly() && isBreast()) ? 'Iron drops from about 1 month' : 'Iron drops from 4 months', (isEarly() && isBreast()) ? 'Babies born early who get breast milk need iron drops until 12 months.' : formulaFam() ? 'Breast milk is low in iron. If it’s more than half of his milk, he needs drops.' : 'Breast milk is low in iron, and his stores run low around now.',
      xNums('', (isEarly() && isBreast()) ? [['About 1 month', 'Start iron drops'], ['12 months', 'Stop']] : [['4 months', 'Start iron drops'], ['6–9 months', 'Stop once iron-rich foods are going well']])
      + xDo('What to do', [ageMo() < 4 && !(isEarly() && isBreast()) ? 'Ask your pediatrician for the dose at the 4-month checkup.' : ageMo() >= 9 && !(isEarly() && isBreast()) ? 'Ask your pediatrician for the dose at the next checkup.' : 'Not on drops yet? Ask your pediatrician for the dose now. A call is fine.', 'Give it like vitamin D: in his cheek, or in a little milk.'])
      + xNote('Good to know:', 'iron can make his poop darker. That’s normal.'));
  // First foods (around 6 months, once you start)
  P.z_tray = () => yPage(XG, 'On the tray', 'Start with iron-rich foods, then build variety', 'There’s no required order. A few bites is plenty, and milk is still his main food.',
      xCompare([['star', 'Iron-rich', 'Meat, beans, eggs, or iron-fortified cereal.'], ['leaf', 'Veg and fruit', 'Soft, mashed or in strips.'], ['bowl', 'Family food', 'Soft, unsalted, from your table.']])
      + xDo('What to do', ['Offer solids once a day, then twice.', 'Thicker and lumpier over the next weeks, soft finger foods by about 8 months.', 'Milk first or after. Either is fine.'])
      + xKnow('How you’ll know it’s going well', 'He opens up for more, and turns away when he’s done. Let him decide how much.'));
  P.z_allergens = () => yPage(XL, 'Allergies', 'Common allergens early, then keep them going', 'Early and often lowers the chance of a food allergy.',
      chips(['Peanut', 'Egg', 'Dairy', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame', 'Tree nuts'])
      + xDo('What to do', ['One new allergen at a time, at home, earlier in the day.', 'Peanut as thinned peanut butter or powder. Egg well cooked.', 'Once it’s in, offer it a few times a week.'])
      + xNote('Call 911:', 'trouble breathing, swelling of the face or lips, or he’s very sleepy or floppy. Call your pediatrician for hives or vomiting.'));
  P.z_gag = () => yPage(XL, 'Safety', 'Gagging is normal. Choking is silent.', 'Gagging is how he learns to handle food. It’s loud and looks scary. Choking is silent.',
      xTwo(['Gagging', 'Loud: coughing, sputtering, eyes watering. Let him work it out.'], ['Choking', 'Silent: can’t cry or cough, turning blue. Start first aid and call 911.'], true)
      + xDo('What to do', ['Always seated upright, and always with you.', 'Soft pieces that squish between your fingers.'])
      + xKnow('Choking first aid', 'Face down on your forearm, 5 back blows. Then face up, 5 chest thrusts. Repeat until it’s out.'));
  P.z_notyet = () => yPage(XL, 'Safety', 'Not yet, until after his first birthday', 'Some foods wait for safety, not taste.',
      chips(['Honey', 'Whole nuts', 'Whole grapes', 'Popcorn', 'Hot dog rounds', 'Hard raw veg', 'Cow’s milk to drink', 'Juice'])
      + xDo('What to do', ['Quarter grapes and cherry tomatoes lengthwise.', 'Spread nut butters thin, never in a lump.', 'Cook hard veg until soft.'])
      + xKnow('Why honey', 'It can carry botulism, which babies can’t fight off until 12 months.'));
  P.z_water = () => yPage(XC.d1, 'Drinks', 'Sips of water from an open cup', 'From about 6 months, with meals. Milk is still his main drink.',
      xNums('', [['4–8 oz', 'Water a day, at most'], ['Open cup', 'Or a straw cup']])
      + xDo('What to do', ['Offer a few sips with meals.', 'Hold the cup, and let him try. Spills are part of it.'])
      + xKnow('Milk still comes first', 'Water is for practice with the cup, not instead of milk.'));
  // Meals (around 9 months)
  P.z_day = () => { const b = isBreast(), bot = isBottle();
    return yPage(XG, 'Meals', 'Three meals, plus milk', 'He eats more like the family now. Milk drops a little as meals grow.',
      tl('', [['Waking', 'sun', (nurses() && bot ? 'Nursing or a bottle' : bot ? 'A bottle' : 'Nursing') + ', then breakfast a little later'], ['Midday', 'bowl', 'Lunch, a snack, and milk after'], ['Evening', 'moon', 'Dinner, then ' + (nurses() && bot ? 'nursing or a bottle' : bot ? 'a bottle' : 'nursing') + ' before bed']])
      + xDo('What to do', ['3 meals and 1–2 snacks.', 'Through the day, offer milk after meals. First thing in the morning, milk first is fine.', bot && formulaFam() && !nurses() ? 'Usually 16–32 oz of formula a day, less as meals grow.' : bot && formulaFam() ? 'Formula fills in around nursing. Less as meals grow.' : ''])
      + xKnow('You decide, he decides', 'You choose what and when. He chooses how much.')); };
  P.z_family = () => yPage(XG, 'On the tray', 'Soft pieces of family food', 'He can pick up small pieces now. Most of what you eat works, softened and cut small.',
      xCompare([['hand', 'Pea-size', 'Soft pieces he can pinch.'], ['bowl', 'Unsalted', 'Take his out before adding salt.'], ['star', 'Iron-rich', 'Something with iron at each meal.']])
      + xDo('What to do', ['Let him feed himself, with a spoon to practice.', 'Keep cutting round foods, like grapes, lengthwise.']));
  P.z_milk12 = () => { const b = isBreast(), bot = isBottle(), fm = formulaFam();
    return yPage(XC.d1, 'Milk', 'Cups now, and whole milk at 12 months', 'A few things change around his first birthday.',
      tl('', [['Now', 'cup', 'Practice with an open or straw cup'], ['12 months', 'drop', fm ? 'Formula to whole cow’s milk, about 16 oz a day' : 'Whole cow’s milk in a cup, if you like'], ['12–18 months', 'bottle', bot ? (nurses() ? 'Bottles phase out. Nursing can keep going' : 'Bottles phase out') : 'Nursing can keep going as long as you both like']])
      + xDo('What to do', ['Whole milk, not low-fat, until age 2.', 'Serve milk in a cup, with meals.'])
      + xKnow('No more than 24 oz a day', 'More milk crowds out iron-rich food.')); };
  P.z_appetite = () => yPage(XC.g1, 'Appetite', 'Appetite goes up and down', 'A big day, then a few small ones, is normal. Growth slows after the first months.',
      xNums('', [['10–15', 'Tries before a new food sticks'], ['A week', 'The right time frame to judge']]) + xDo('What to do', ['Keep offering, without pressure.', 'Look at the week, not one meal.'])
      + xKnow('How you’ll know he’s getting enough', 'Wet diapers, energy, and steady growth at his 9- and 12-month checkups.'));
  // Solids challenges
  P.z_refuse = () => yPage(XL, 'Feeding challenges', 'Refusing food is common', 'Some days he’ll eat a lot, some days almost nothing.',
      xDo('What helps', ['Offer it again another day. It can take 10–15 tries.', 'Let him touch and play with it.', 'Eat together, so he sees you eat it.'])
      + xNote('Worth a call:', 'refusing most foods for weeks, or fewer wet diapers.'));
  P.z_reaction = () => yPage(XL, 'Feeding challenges', 'A rash or reaction after a new food', 'A little redness around the mouth is often from acidic food. A true reaction looks different.',
      xTwo(['Usually fine', 'Redness only where food touched, that fades.'], ['Call your pediatrician', 'Hives, vomiting, or a rash that spreads.'], true)
      + xDo('What to do', ['Note the food and what happened. A photo helps.', 'Hold off on that food, and ask your pediatrician before trying it again.'])
      + xKnow('Call 911', 'Trouble breathing, swelling of the lips or face, or he’s very sleepy or floppy.'));
  P.z_tough = () => { const rows = [['z_gag', 'eye', 'Gagging', 'Normal, and how to tell it from choking'], ['z_refuse', 'heart', 'Refusing food', 'Common, and what helps'], ['z_reaction', 'star', 'A rash after a new food', 'What’s fine, and when to call'], ['x_poop', 'diaper', 'Constipation', 'Common with new foods']];
    return qaCss + page(head('Feeding challenges', 'Something not quite right?', 'Pick what’s happening.', XL) + `<div class="hub-list">${rows.map(([id, icon, title, sub]) => H().row({ cat: CAT, icon, title, sub, onclick: id === 'x_poop' ? poopGo() : id === 'z_gag' ? "openPage('chg:Feeding:safe')" : go(id) }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`)).join('')}</div>`
      + `<section class="ss-moment">` + xKnow('Call your pediatrician', 'If he has ' + fever(false) + ', refuses milk too, has fewer wet diapers, or keeps vomiting. Call any time you’re unsure.') + `</section>`); };
  window.SHOME = (v) => { const b = isBreast(), fm = formulaFam(), h = H(), early = isEarly();
    const cr = (c, icon, title, sub, id) => h.row({ cat: CAT, icon, title, sub, onclick: go(id) }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`).replace('class="hub-row', `style="--sm-bg:${c[0]};--sm-ink:${c[1]}" class="sm-row hub-row`);
    const R = v === 2 ? [b && [XC.g1, 'drop', early ? 'Keep giving iron drops' : ageMo() >= 4 ? 'Iron drops from 4 months. Started yet?' : 'Iron drops from 4 months', early ? 'Born early with breast milk: from about 1 month' : fm ? (ageMo() >= 4 ? 'If more than half his milk is breast milk, he needs them' : 'If more than half his milk is breast milk') : 'Breast milk is low in iron', 'z_iron'], [XG, 'bowl', 'Start when he shows all the signs', 'Signs, choosing, allergies, set up, gagging', 'xa:r2']]
      : v === 3 ? [[XG, 'bowl', 'Start with iron-rich foods, then build variety', 'Start, allergens, foods to skip, drinks', 'xa:f3']]
      : [[XG, 'plate', 'Soft pieces of family food, three times a day', 'A day, on the tray, appetite', 'xa:m4'], [XC.d1, 'cup', 'Cups now, whole milk at 12 months', 'What changes at his first birthday', 'z_milk12']];
    const tough = v === 2 ? 'x_tough' : 'z_tough', toughSub = v === 2 ? 'Distracted feeds, spit-up, gas' : 'Gagging, refusing food, a rash, constipation';
    const rough = `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766;margin-top:12px" onclick="${go(tough)}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('heart', CAT)}</span><span class="hub-rough-copy"><b>${F('Feeding challenges')}</b><small>${F(toughSub)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    const vs = v === 2 ? [['Normal', 'Quick, distracted feeds, and interest in your food.'], ['Call your pediatrician', 'Refusing feeds, fewer than 6 wet diapers, or forceful vomiting.']]
      : v === 3 ? [['Normal', 'Gagging, mess, a few bites a day, and changes in poop.'], ['Call your pediatrician', 'Hives or vomiting after a food, or fewer wet diapers. Choking or trouble breathing: call 911.']]
      : [['Normal', 'Big days and small days, and lots of mess.'], ['Call your pediatrician', 'Refusing most foods for weeks, or a reaction after a food. Trouble breathing: call 911.']];
    return `<h2 class="hub-h2">${F('What’s new now')}</h2><div class="hub-list">${R.filter(Boolean).map(r => cr(...r)).join('')}</div>` + rough + h.versus('Normal, or time to call?', vs[0], vs[1]); };

  // ---- Solids depth pass (Nov 7): bring back what the old solids pages had (textures by age, safe shapes, the full
  // gagging vs choking page with first aid, teething and sick days), and use the right icons. ----
  P.z_signs = () => yPage(XG, 'Getting ready', 'Start solids when he shows all the signs', 'Around 6 months, never before 4. Milk is still all he needs until then.',
      steps([['head', 'Steady head', 'Holds it up well'], ['sit', 'Sits with support', 'In a high chair'], ['eye', 'Interested', 'Watches and reaches for food'], ['swallow', 'Swallows', 'Doesn’t push food back out']], false)
      + xDo('What to do', ['Wait for all four signs, not just one.', ageMo() < 4 ? 'Ask your pediatrician at the 4- or 6-month checkup.' : ageMo() < 6 ? 'Ask about it at Ari’s 6-month checkup.' : 'Ask about it at Ari’s next checkup.'])
      + xKnow('Good to know', 'Starting early doesn’t help him sleep longer.'));
  P.z_setup = () => yPage(XG, 'Getting ready', 'Get set up for the first bite', 'A few things to have before you start, and one skill to learn.',
      xCompare([['highchair', 'High chair', 'Upright, with a harness and footrest.'], ['bowl', 'Soft spoon', 'And a bib that catches.'], ['cup', 'Open cup', 'For sips of water.']])
      + xDo('Before you start', ['Learn the difference between gagging and choking, and infant first aid. It’s next.', 'Pick a calm time of day, when he’s not too hungry or tired.'])
      + xKnow('Purées, finger foods, or both?', 'All work. Spoon-fed purées, soft finger strips, or a mix. Pick what suits your family.'));
  P.z_tray = () => { const b = isBreast(), fm = formulaFam();
    return yPage(XG, 'On the tray', 'Start with iron-rich foods, then build variety', 'Iron-rich foods first, then anything soft, in any order. A few bites is plenty.',
      hubStageStrip({ title: 'Textures, as he grows', items: [['bowl', 'Around 6 months', 'Smooth and mashed'], ['strips', '6–8 months', 'Soft, finger-size strips'], ['pieces', '9 months on', 'Soft, pea-size pieces']], cat: CAT })
      + xDo('What to do', ['First: iron-rich foods like meat, beans, eggs or iron-fortified cereal.', 'Then vegetables, fruit and soft family food, in any order.', 'Once a day at first, then 2–3 times a day by 8–9 months.', 'Let him lead: wait for an open mouth, stop when he turns away.'])
      + xKnow('Milk still comes first', nurses() ? (fm ? 'Keep nursing, plus his usual formula bottles. Solids add to milk, they don’t replace it yet.' : 'Keep nursing on demand. Solids add to milk, they don’t replace it yet.') : 'About 24–32 oz of ' + (b && fm ? 'milk' : b ? 'breast milk' : 'formula') + ' a day. Solids add to it, they don’t replace it yet.')
      + xNote('Safe shapes:', 'soft enough to squash between finger and thumb.')); };
  P.z_gag = () => yPage(XL, 'Safety', 'Gagging is normal. Choking is silent.', 'Gagging is how he learns to handle food. It’s loud and looks scary. Choking is silent.',
      xTwo(['Gagging: normal', 'Loud: coughing, sputtering, red face, tongue out. Let him work it out.'], ['Choking: act now', 'Silent or a high squeak, can’t cough or cry, turning blue.'], true)
      + xFix('Making it less likely', [['Sitting upright', 'Always, and always watched.'], ['Safe shapes', 'Soft and squashable, finger-size.'], ['No rushing', 'Seated for every bite, never on the move.']])
      + h2('If he’s choking') + steps([['hand', 'Back blows, 5 times', 'Face down along your forearm, head lower than his chest'], ['heart', 'Chest thrusts, 5 times', 'Face up, two fingers in the middle of his chest'], ['clock', 'Repeat', 'Until it comes out, or help arrives']], true)
      + `<p class="ss-small"><a href="https://www.redcross.org/take-a-class/resources/learn-first-aid/infant-choking" target="_blank" rel="noopener" style="color:var(--ss-ink);font-weight:600">${F('Watch infant choking first aid')} ↗</a> ${F('American Red Cross.')}</p>`
      + xNote('Call 911', 'if he can’t cough, cry or breathe. Have someone call while you start back blows. If he stops responding, start CPR.'));
  P.z_teeth = () => yPage(XL, 'Feeding challenges', 'Teething, and shorter feeds', 'Sore gums can make him fussy at feeds for a few days.',
      xDo('What helps', ['A cold teether or a clean, cold washcloth to chew before feeds.', 'Chilled soft foods, like yogurt or mashed fruit.', 'Shorter, more frequent feeds for a few days.'])
      + xKnow('Not for babies', 'Teething gels with benzocaine, and amber necklaces.')
      + xNote('Worth a call:', fever(false) + ', or refusing to drink. Teething doesn’t cause fevers, so look for another reason.'));
  P.z_sick = () => yPage(XL, 'Feeding challenges', 'Feeding when he’s sick', 'He may eat less for a few days. Milk and fluids matter most.',
      xDo('What helps', ['Offer milk more often, in smaller amounts.', 'Stuffy nose? Saline drops and gentle suction before feeds.', 'Solids can wait until he feels better.'])
      + xNote('Worth a call:', 'fewer wet diapers, refusing milk, or vomiting that keeps happening.'));
  P.z_tough = (() => { const prev = P.z_tough; return () => prev().replace('</div><section class="ss-moment">', [['z_teeth', 'tooth', 'Teething and feeds', 'Sore gums, shorter feeds'], ['z_sick', 'thermo', 'Sick, or a stuffy nose', 'Feeding when he’s unwell']].map(([id, icon, title, sub]) => H().row({ cat: CAT, icon, title, sub, onclick: go(id) }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`)).join('') + '</div><section class="ss-moment">'); })();
  P.z_family = () => yPage(XG, 'On the tray', 'Soft pieces of family food', 'Once he picks things up with finger and thumb, most of what you eat works, softened and cut small.',
      xCompare([['pieces', 'Pea-size', 'Soft pieces he can pinch.'], ['plate', 'Unsalted', 'Set his portion aside before salting.'], ['meat', 'Iron-rich', 'Something with iron at each meal.']])
      + xDo('What to do', ['Let him feed himself, with a spoon to practice.', 'Cut round foods into thin strips, and quarter grapes lengthwise.', 'Cook hard vegetables until soft, and spread nut butter thin.']));
  window.SHOME = (() => { const prev = window.SHOME; return v => prev(v).replace(hubArt('chair', CAT).replace('data-art=', 'data-keep='), hubArt('highchair', CAT).replace('data-art=', 'data-keep=')).replace(F('Gagging, refusing food, a rash, constipation'), F('Gagging, refusing food, a rash, teething, sick days')); })();

  // ---- Ready for solids: the purées / baby-led weaning choice, and the allergy page restyled (Nov 7). ----
  const xProsCons = (items) => `<style>#main .xpc{margin:0 0 12px;padding:6px 16px;border-radius:20px;background:#fff;border:1px solid var(--line)}#main .xpc>div{padding:12px 0}#main .xpc>div+div{border-top:1px solid var(--line)}#main .xpc h3{margin:0 0 6px;font-size:16px;display:flex;align-items:center;gap:10px}#main .xpc h3 i{width:32px;height:32px;border-radius:50%;background:var(--ss-bg);display:grid;place-items:center;padding:7px;box-sizing:border-box;flex:none}#main .xpc h3 i svg{width:100%;height:100%}#main .xpc dl{display:grid;grid-template-columns:82px 1fr;gap:4px 10px;margin:0;font-size:14px;line-height:1.4}#main .xpc dt{font-weight:600;color:var(--ss-ink)}#main .xpc dd{margin:0;color:#4c4757}</style><section class="xpc">${items.map(([icon, t, good, mind]) => `<div><h3><i>${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</i>${F(t)}</h3><dl><dt>${F('Good for')}</dt><dd>${F(good)}</dd><dt>${F('Keep in mind')}</dt><dd>${F(mind)}</dd></dl></div>`).join('')}</section>`;
  P.z_how = () => yPage(XG, 'Getting ready', 'Purées, finger foods, or both', 'Spoon-feeding and baby-led weaning both work. Many families mix them.',
      xProsCons([['bowl', 'Spoon-fed purées', 'Easy to see how much he eats, and to get iron-rich foods in. Simple for daycare.', 'Move to thicker, lumpier food by about 8 months. Let him open up for each bite.'], ['avocado', 'Baby-led weaning', 'He feeds himself soft finger foods, joins family meals, and practices chewing early.', 'More mess and gagging at first. Harder to tell how much iron he gets. Shapes need care.'], ['plate', 'A mix of both', 'Spoon iron-rich foods, and offer soft finger foods to practice.', 'Most flexible. Follow the same safe shapes for finger foods.']])
      + xKnow('Is one better?', 'No. Research doesn’t favor either. When foods are soft and safely shaped, choking risk is similar.'));
  P.z_setup = () => yPage(XG, 'Getting ready', 'Get set up for the first bite', 'A few things to have before you start, and one skill to learn.',
      xCompare([['highchair', 'High chair', 'Upright, with a harness and footrest.'], ['bowl', 'Soft spoon', 'And a bib that catches.'], ['cup', 'Open cup', 'For sips of water.']])
      + xDo('Before you start', ['Learn the difference between gagging and choking, and infant first aid. It’s next.', 'Pick a calm time of day, when he’s not too hungry or tired.']));
  P.z_allergy = () => yPage(XL, 'Allergies', 'Eczema or food allergies in the family?', 'Some babies need peanut sooner, as early as 4–6 months. Plan it before solids start.',
      xCompare([['shield', 'Higher risk', 'Severe eczema, or an egg allergy.'], ['smile', 'Everyone else', 'Start peanut and egg with first foods, around 6 months.']])
      + xDo('If he’s higher risk', ['Ask your pediatrician before starting peanut. They may suggest a test first.', 'Then start peanut early, in a safe form, and keep it going.'])
      + xKnow('Why early', 'Starting peanut early, and often, lowers the chance of a peanut allergy.'));


  // ---- Challenges styling pass (Nov 7): every challenge page gets a picture in a white card, like the rest. ----
  P.x_refuse = () => xTough('x_refuse', 'Pulling off, refusing or fussing at feeds', 'It’s often air, a fast flow, or a stuffy nose. Small changes fix most of it.',
      steps([['eye', 'Feed early', 'Before crying starts'], ['hand', 'Burp, then retry', 'Trapped air can feel like full'], isBottle() ? ['bottle', 'Check the nipple', 'Too fast or too slow?'] : ['heart', 'Lean back', 'If milk comes fast'], ['drop', 'Clear his nose', 'Saline and gentle suction']], false)
      + xKnow('Distracted, from 3–4 months?', 'Feed somewhere quiet and dim, or when he’s drowsy.')
      + xNote('Call right away:', fever() + '.') + xNote('Worth a call:', 'too sleepy to feed most times, or refusing several feeds in a row.'));
  P.z_refuse = () => yPage(XL, 'Feeding challenges', 'Refusing food is common', 'Some days he’ll eat a lot, some days almost nothing.',
      steps([['clock', 'Try again later', 'It can take 10–15 tries'], ['hand', 'Let him touch it', 'Playing is learning'], ['smile', 'Eat together', 'He copies you']], false)
      + xKnow('You decide, he decides', 'You choose what to offer. He chooses whether and how much.')
      + xNote('Worth a call:', 'refusing most foods for weeks, or fewer wet diapers.'));
  P.z_teeth = () => yPage(XL, 'Feeding challenges', 'Teething, and shorter feeds', 'Sore gums can make him fussy at feeds for a few days.',
      steps([['snow', 'Something cold', 'A teether or cold washcloth'], ['bowl', 'Chilled food', 'Yogurt or mashed fruit'], ['clock', 'Shorter feeds', 'More often, for a few days']], false)
      + xKnow('Not for babies', 'Teething gels with benzocaine, and amber necklaces.')
      + xNote('Worth a call:', fever(false) + ', or refusing to drink. Teething doesn’t cause fevers, so look for another reason.'));
  P.z_sick = () => yPage(XL, 'Feeding challenges', 'Feeding when he’s sick', 'He may eat less for a few days. Milk and fluids matter most.',
      steps([['drop', 'Milk more often', 'In smaller amounts'], ['heart', 'Clear his nose', 'Saline before feeds'], ['bowl', 'Solids can wait', 'Until he feels better']], false)
      + xNote('Worth a call:', 'fewer wet diapers, refusing milk, or vomiting that keeps happening.'));

  window.SHOME = (() => { const prev = window.SHOME; return v => { const h = prev(v); if (v !== 2) return h; const i = h.indexOf("xa:r2"); if (i < 0) return h; const j = h.indexOf('<span class="hub-row-copy">', i); return j < 0 ? h : h.slice(0, j) + `<span class="hub-row-copy"><small class="hub-row-eyebrow">${F('Getting ready, step by step')}</small>` + h.slice(j + '<span class="hub-row-copy">'.length); }; })();
  const xEyebrow = (h, key, label) => { const i = h.indexOf(key); if (i < 0) return h; const j = h.indexOf('<span class="hub-row-copy">', i); return j < 0 ? h : h.slice(0, j) + `<span class="hub-row-copy"><small class="hub-row-eyebrow">${F(label)}</small>` + h.slice(j + '<span class="hub-row-copy">'.length); };
  window.SHOME = (() => { const prev = window.SHOME; return v => v === 3 ? xEyebrow(prev(v), 'xa:f3', 'First foods, step by step') : v === 4 ? xEyebrow(prev(v), 'xa:m4', 'Meals, step by step') : prev(v); })();
  window.M1HOME = (() => { const prev = window.M1HOME; return () => xEyebrow(prev(), 'xa:m1e', 'Evenings and nights'); })();
  // ---- Quality bar pass (Nov 7): spit-up in the standard shape, a week-of-appetite picture, real food icons,
  // "Foods to skip" instead of "Not yet", and the allergen check-off is back. ----
  P.x_spit = () => xTough('x_spit', 'Spit-up is common, and usually fine', 'It looks like more than it is once it spreads out.',
      xNums('', [['1–2 tbsp', 'At a time, often normal'], ageMo() >= 4.5 ? ['Past the peak', 'It peaks around 4 months. Gone by 9–12'] : ['Around 4 months', 'When it peaks. Gone by 9–12 months']])
      + xDo('What helps', ['Hold him upright for 20–30 minutes after feeds.', 'Smaller feeds, more often.', 'Stop when he slows. No need to finish.'])
      + xTwo(['Usually fine', 'Comfortable, growing, and plenty of wet diapers.'], ['Worth a call', 'Forceful or green vomit, blood, or crying and arching at most feeds.'], true)
      + xNote('For sleep:', 'flat on his back, even with spit-up. No wedges or inclined sleepers.') + (formulaFam() ? xNote('Wondering if it’s the formula?', 'Spit-up happens on any formula. A rash or blood in his poop is worth a call. Ask your pediatrician before switching.') : ''));
  const weekViz = () => { const v = [70, 35, 50, 90, 40, 60, 80], d = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return `<section class="hub-card" style="padding:14px 16px 12px;margin:0 0 12px"><b style="display:block;font-size:15px;margin:0 0 10px">${F('A typical week of meals')}</b><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;align-items:end;height:84px">${v.map(h => `<div style="height:${h}%;background:var(--ss-bg);border-radius:8px 8px 4px 4px;border:1.5px solid var(--ss-ink);border-bottom-width:1.5px"></div>`).join('')}</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-top:6px;text-align:center;font-size:11.5px;color:var(--muted,#6b6578)">${d.map(x => `<span>${x}</span>`).join('')}</div><p style="margin:10px 0 0;font-size:13.5px;color:#4c4757">${F('Big days and small days even out over the week.')}</p></section>`; };
  P.z_appetite = () => yPage(XC.g1, 'Appetite', 'Appetite goes up and down', 'Growth slows after the first months, so he may eat less than you expect.',
      weekViz()
      + xDo('What to do', ['Keep offering, without pressure.', 'A new food can take 10–15 tries.', 'Look at the week, not one meal.'])
      + xKnow('How you’ll know he’s getting enough', 'Wet diapers, energy, and steady growth at his 9- and 12-month checkups.'));
  P.z_family = (() => { const prev = P.z_family; return () => prev().replace(hubArt('pieces', CAT).replace('data-art=', 'data-keep='), hubArt('lentils', CAT).replace('data-art=', 'data-keep=')); })();
  P.z_tray = (() => { const prev = P.z_tray; return () => prev().replace(hubStageStrip({ title: 'Textures, as he grows', items: [['bowl', 'Around 6 months', 'Smooth and mashed'], ['strips', '6–8 months', 'Soft, finger-size strips'], ['pieces', '9 months on', 'Soft, pea-size pieces']], cat: CAT }), hubStageStrip({ title: 'Textures, as he grows', items: [['bowl', 'Around 6 months', 'Smooth and mashed'], ['avocado', '6–8 months', 'Soft, finger-size strips'], ['lentils', '9 months on', 'Soft, pea-size pieces']], cat: CAT })); })();
  P.z_notyet = () => yPage(XL, 'Safety', 'Foods to skip for now', 'Honey, cow’s milk and juice wait until he’s 1. The choking foods stay cut, cooked or skipped until age 4.',
      chips(['Honey', 'Whole nuts', 'Whole grapes', 'Popcorn', 'Hot dog rounds', 'Hard raw veg', 'Cow’s milk to drink', 'Juice'])
      + xDo('What to do', ['Quarter grapes and cherry tomatoes lengthwise.', 'Spread nut butters thin, never in a lump.', 'Cook hard veg until soft.'])
      + xKnow('Why honey', 'It can carry botulism, which babies can’t fight off until 12 months.'));
  // Allergen check-off: tap each one once he’s had it. Kept on this device.
  const AL = ['Peanut', 'Egg', 'Dairy', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame', 'Tree nuts'];
  const alGet = () => { try { return JSON.parse(localStorage.getItem('ahead-fd-allergens') || '[]'); } catch (e) { return window.__alMem || []; } };
  window.__alCard = () => { const done = alGet();
    return `<section class="hub-card" id="fd-al" style="padding:14px 14px 12px;margin:0 0 12px"><div style="display:flex;justify-content:space-between;align-items:baseline;margin:0 2px 10px"><b style="font-size:15px">${F('Tap each one once he’s had it')}</b><small style="font-weight:700;color:var(--ss-ink)">${done.length} ${F('of')} ${AL.length}</small></div><div style="display:flex;flex-wrap:wrap;gap:8px">${AL.map(a => { const on = done.includes(a); return `<button type="button" aria-pressed="${on}" onclick="__alTick('${a}')" style="font:inherit;font-size:14px;font-weight:600;border-radius:999px;padding:6px 12px;cursor:pointer;border:1.5px solid var(--ss-ink);background:${on ? 'var(--ss-ink)' : 'var(--ss-bg)'};color:${on ? '#fff' : 'var(--ss-ink)'}">${on ? '✓ ' : ''}${F(a)}</button>`; }).join('')}</div></section>`; };
  window.__alTick = a => { let d = alGet(); d = d.includes(a) ? d.filter(x => x !== a) : d.concat(a); window.__alMem = d; try { localStorage.setItem('ahead-fd-allergens', JSON.stringify(d)); } catch (e) { } const el = document.getElementById('fd-al'); if (el) el.outerHTML = pron(window.__alCard()); };
  P.z_allergens = (() => { const prev = P.z_allergens; return () => prev().replace(chips(['Peanut', 'Egg', 'Dairy', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame', 'Tree nuts']), window.__alCard()); })();

  // ---- Milk feeds (6 weeks–4 months), rebuilt on the Newborn model (Nov 5): four subject pages with tabs, grouped by moment. ----
  HEADART['Feeds & rhythm'] = () => ART.often(5);
  P.rhythm1 = () => { const nurse = nurses(), b = isBreast(), bot = isBottle(), fm = formulaFam();
    const dayHtml = (P.day() || ''), k = dayHtml.indexOf('<div class="hub-card" style="padding:14px 14px 8px">'), e = k >= 0 ? dayHtml.indexOf('<figure', k) : -1, ribbon = k >= 0 && e > k ? dayHtml.slice(k, e) : '';
    return page(head('Feeds & rhythm', 'Feeds get quicker and further apart', 'He’s better at eating now. Here’s what a day looks like, and what changes before 4 months.', C.peach)
      + tabbed('#c27a52', [
        ['A day now', h2('A day of feeds') + ribbon
          + H().tiles([['Longest stretch', '3–5 hours', 'Often at night, not always yet'], ['Night feeds', '1–2 is common', 'Through 4 months, and often beyond']])
          + small('An example, not a schedule.', 'He leads, and no two days look the same.')
          + (b ? small('Vitamin D drops', 'keep going every day while he gets breast milk.') : '')],
        ['What changes', h2('What you’ll notice') + steps([['clock', 'Quicker feeds', b && bot ? 'He empties a breast or bottle faster' : bot ? 'He finishes a bottle faster' : 'He empties a breast faster'], ['moon', 'A longer stretch', 'One longer sleep, often at night'], ['eye', 'More alert', 'By 3–4 months, easily distracted']], false)
          + hubAgeTiles({ title: 'Hungrier for a few days', items: [['Around 6 weeks', 'A growth spurt', '2–3 extra-hungry days'], ['Around 3 months', 'Another growth spurt', 'Feed more often, and it passes'], ['3–4 months', 'Distracted feeds', 'A quiet, dim spot helps']], cat: CAT })
          + h2('Cluster feeding or snacking?') + two(['Cluster feeding', 'Feed after feed for a few evening hours. Common, and it passes.'], ['Snacking', 'Small feeds every hour, all day. Try soothing first, then feed when cues come back.', '#f5efe3', '#8a6a2c'])],
        ['Not going well?', accs([
            ['diaper', 'Not eating much', 'Look at the whole day', ['~Some feeds are small, and that’s often fine. Diapers and growth tell you more than one feed.', { html: steps([['eye', 'Feed at early cues', 'Before crying'], ['moon', 'A calm, quiet spot', 'Fewer things to look at'], ['smile', 'Burp, then offer again', 'Gas can make him feel full']], false) }], '', ''],
            ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full', ['~Arching and squirming usually mean he’s too hungry, the flow is too fast or slow, he has gas, or he’s full.', { html: steps([['eye', 'Feed early', 'Before crying starts'], ['heart', 'Calm him first', 'Then offer again'], b ? ['drop', 'Fast letdown?', 'Lean back, so he feeds against gravity'] : ['bottle', 'Check the nipple', 'Too fast or too slow?']], false) }], '', ''],
            ['eye', 'Feeding when he’s sick', 'A stuffy nose, or not interested', ['~Babies often eat less when they’re unwell. Keeping milk going matters more than how much.', { html: steps([['drop', 'Clear his nose first', 'Saline drops and gentle suction'], ['clock', 'Smaller, more often', 'Little feeds add up'], ['sit', 'Keep him upright', 'Breathing is easier']], false) }, (b && fm ? 'Breast milk or formula only.' : b ? 'Breast milk only.' : 'Formula only.') + ' No water or juice before 6 months.'], '', '']])
          + h2('Who can help') + steps([b && ['heart', 'Lactation consultant', 'Latch, pain and supply'], ['steth', 'Your pediatrician', 'Weight and feeds, any time you’re unsure'], ['bowl', 'Feeding specialist', 'If feeds stay hard. Ask for a referral']].filter(Boolean), false)
          + small('Feeling low or overwhelmed most days?', 'Tell your doctor. You can also call or text 1-833-852-6262, any time.')]
      ])); };

  P.bfmilk1 = () => { const nurse = nurses(), pump = pumps(), fm = formulaFam(), onlyP = pump && !nurse;
    const supplyLine = `<figure class="hub-figure" style="margin:0 0 16px;padding:16px 16px 14px;background:var(--card,#fff);border:1px solid var(--line,#eee);border-radius:20px"><b class="hub-fig-title" style="display:block;margin:0 0 14px">${F('Your supply settles')}</b><div style="position:relative;height:18px;border-radius:999px;background:linear-gradient(90deg,#f2b8cc 0%,#f6d3df 50%,#fbeef3 100%);box-shadow:inset 0 0 0 1px rgba(140,60,90,.15)">${[6, 50, 94].map(x => `<span style="position:absolute;left:${x}%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px rgba(140,60,90,.4)"></span>`).join('')}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">${[['Weeks 1–6', 'Full, often leaky', 'left'], ['6–12 weeks', 'Softer, still plenty', 'center'], ['After', 'Makes about what he takes', 'right']].map(([w, t, a]) => `<div style="text-align:${a}"><b style="display:block;font-size:14px">${F(w)}</b><small style="display:block;font-size:12.5px;line-height:1.35;color:var(--muted,#776)">${F(t)}</small></div>`).join('')}</div></figure>`;
    return page(head('Breastfeeding & pumping', 'Your supply settles', 'Softer breasts and quicker ' + (onlyP ? 'sessions' : 'feeds') + ' are normal now. They don’t mean less milk.', C.pink)
      + tabbed('#c46b8e', [
        ['Your supply', supplyLine
          + h2('Too little, or too much?') + two(['Too little?', 'Fewer than 6 wet diapers a day, or slow gain at a checkup. ' + (onlyP ? 'Add a session' : 'Feed more often') + ', and see a lactation consultant.'], ['Too much?', nurse ? 'Gulping and coughing at letdown, lots of gas. Try laid-back, and one side per feed.' : 'Very full and leaky between sessions. Pump just to comfort, not to empty.', '#f5efe3', '#8a6a2c'])
          + h2('Dropping a ' + (onlyP ? 'session' : 'feed or a pump')) + small('One at a time,', 'every few days. Going slowly helps you avoid clogged ducts.')],
        nurse && fm && ['Topping up', tl('A feed with a top-up', [['Start', 'heart', 'Nurse on both sides.'], ['Still hungry?', 'bottle', 'A small, paced top-up, often 1–2 oz.'], ['After', 'drop', 'Pump when you can, to keep your milk going.']])
          + h2('Fussy at the breast after bottles?') + steps([['bottle', 'Slow, paced bottles', 'Slowest nipple, little pauses'], ['moon', 'Nurse when he’s calm', 'Before he’s very hungry'], ['heart', 'Skin to skin', 'Makes the breast feel familiar']], false)],
        pump && ['Pumping', onlyP ? tl('A pumping day now', [['Most days', 'drop', 'Often 7–8 sessions, about 15–20 minutes each.'], ['Around 12 weeks', 'clock', 'Once supply is steady, many drop a session. Keep the daily total about the same.'], ['At night', 'moon', 'Drop the night session last, and watch your total.']])
          : h2('Building a small stash') + steps([['clock', 'Once a day', 'After the first morning feed'], ['snow', 'Freeze it flat', 'Bags of 2–4 oz, so nothing’s wasted'], ['notepad', 'Label it', 'Date first, oldest used first']], false)],
        ['Back to work', tl('Your countdown', [['3–4 weeks before', 'drop', onlyP ? 'Fit sessions around your work hours.' : 'Pump once a day to build a stash.'], onlyP ? ['2 weeks before', 'clock', 'Do a practice day on your work schedule.'] : ['2 weeks before', 'bottle', 'Someone else gives a bottle, so he’s used to it.'], onlyP ? ['First week back', 'drop', 'Keep your usual number of sessions, at work too.'] : ['First week back', 'clock', 'Pump about every 3 hours, for each feed you miss.']])
          + h2('What to pack') + steps([['drop', 'Pump and parts', 'Plus a spare set'], ['bag', 'A cooler bag', 'With frozen ice packs'], ['fridge', 'Storage bags', 'Label with the date']], false)
          + small('Your rights:', 'most US employers must give you break time to pump, and a private space that isn’t a bathroom, for a year after birth.')
          + small('Ask your caregiver', 'to pace bottles and follow his cues.')
          + (nurse ? small('Pumping less than he drinks?', 'Common. A pump gets less than a baby does.') : '')
          + (nurse ? small('Won’t take a bottle from you?', 'Common. Many babies take it from someone else, ideally while you’re out of the room.') : '')],
        ['If it hurts', accs([
            ['heart', 'A tender lump', 'Often a clogged duct', [{ html: two(['Clogged duct', 'Tender, and you feel well. Keep ' + (onlyP ? 'pumping' : 'feeding') + ' as usual, use a cold pack, and skip deep massage.'], ['Call your doctor', 'Red and painful, with a fever or chills.', '#fdeee6', '#9a5a3c']) + small('Keeps coming back?', 'Sunflower lecithin may help. Ask your doctor or a lactation consultant first.') }], '', ''],
            ['drop', 'Pain that’s new', 'After weeks without it', ['~Shiny, pink, burning or itchy nipples can be thrush, a yeast infection.', nurse ? 'He may have white patches in his mouth that don’t wipe off.' : '', 'Call your doctor. ' + (nurse ? 'You’ll both need treatment.' : 'It’s easy to treat.')].filter(Boolean), '', '']])
          + know('Who can help', 'A lactation consultant can fix most problems in a visit or two, and most insurance covers it.')]
      ])); };

  P.bot1 = () => { const nurse = nurses(), fm = formulaFam(), b = isBreast(), fmOnly = fd() === 'Formula';
    return page(head('Bottle feeding', 'Bigger bottles, then a plateau', 'Bottles grow over these weeks, then stay about the same until solids.', C.lilac)
      + tabbed('#7d6aa8', [
        ['How much & pacing', h2('How much now') + H().tiles([fm ? ['A day', 'About 24–32 oz', 'Of formula, not more than 32'] : ['A day', '25–35 oz', 'Of breast milk'], ['Until solids', 'About the same', 'Bottles stop growing around 4 months']])
          + small('Follow his cues, not the number.', 'Stop when he slows or turns away, even if milk is left.')
          + h2('Keep pacing') + steps([['bottle', 'Fairly level', 'So he controls the flow'], ['clock', 'Little pauses', 'Every few sucks'], ['roll', 'Switch sides', 'Halfway through']], false)
          + h2('Is the nipple right?') + two(['Too slow', 'He sucks hard, gets frustrated, and the nipple flattens.'], ['Too fast', 'He gulps, coughs, or milk spills out.', '#fdeee6', '#9a5a3c'])
          + small('Stay with the slowest flow', 'until he’s clearly frustrated. Then go up one size.')],
        ['Bottle trouble', accs([
            nurse && ['bottle', 'He won’t take a bottle', 'Common for babies who nurse', [{ html: steps([['heart', 'Someone else offers', 'Ideally with you out of the room'], ['moon', 'Before he’s very hungry', 'Calm is easier'], ['drop', 'A slow-flow nipple', 'Warm milk, and a few days’ patience']], false) }], '', ''],
            fm && ['bottle', 'Is it the formula?', 'Usually not', [{ html: two(['Usually not the formula', 'Gas, fussing and spit-up happen on any formula. Switching often doesn’t help.'], ['Worth asking about', 'Blood or mucus in his poop, a rash, vomiting after most feeds, or slow weight gain.', '#fdeee6', '#9a5a3c']) + small('Before you switch,', 'try a slower nipple and burp every 2–3 oz. Ask your pediatrician before a special formula.') }], '', ''],
            ['eye', 'He takes a lot, fast', 'Then spits up', [{ html: steps([['clock', 'Slow it down', 'Pace, and pause often'], ['hand', 'Burp midway', 'Every 2–3 oz'], ['eye', 'Watch for full', 'Turning away, hands relaxed']], false) }], '', '']])]
      ])); };

  P.dig1 = () => { const br = isBreast() && fd() === 'Breast milk', fmOnly = fd() === 'Formula', bot = isBottle();
    return page(head('Digestion & comfort', 'Gas and spit-up peak, then ease', 'Both are common at this age, and both get better by 4 months or so.', C.blue)
      + tabbed('#46638c', [
        ['Gas & fussy evenings', hubAgeTiles({ title: 'When it eases', items: [['Around 6 weeks', 'Fussy evenings peak', 'Then slowly ease'], ['3–4 months', 'Gas and crying ease', 'His tummy matures']], cat: CAT })
          + h2('What helps') + steps([['hand', 'Bicycle his legs', 'Gently, on his back'], ['moon', 'Tummy-down', 'Across your knees'], ['smile', 'Burp more often', 'During and after feeds']], false)
          + accs([['drop', 'Gas drops or gripe water?', 'What to know', ['Gas drops are safe but often don’t help much. Ask your pediatrician before trying gripe water.'], '', ''],
            ['heart', 'Crying he can’t settle from', 'If you’re at your limit', [{ html: steps([['eye', 'Check', 'Hunger, a burp, a diaper'], ['moon', 'Soothe', 'Swaddle, rock or white noise'], ['heart', 'Step away', 'Lay him on his back somewhere safe']], true) + small('Never shake him.', 'Even when you’re exhausted. Call someone to take over if you need to.') }], '', '']])],
        ['Spit-up', H().tiles([['Often peaks', 'Around 4 months', 'Usually harmless'], ['Usually gone', 'By 9–12 months', 'As his tummy matures']])
          + h2('What can help') + steps([['clock', 'Smaller feeds', 'More often'], ['sit', 'Upright after', 'For 20–30 minutes'], ['moon', 'Flat on his back', 'For sleep, even with spit-up']], false)
          + h2('Spit-up or reflux?') + two(['Normal spit-up', 'He’s happy and growing.'], ['Reflux that bothers him', 'Crying or arching at most feeds, refusing feeds, or slow weight gain.', '#fdeee6', '#9a5a3c'])],
        ['Poop', h2('Poop changes now') + H().tiles([['How often', br ? 'Can be days apart' : '1–2 a day', br ? 'Even a week, if it’s soft when it comes' : 'Some go a day or two between'], ['What matters', 'Soft', 'Straining and going red is normal']])
          + h2('Poop that looks off') + two(['Normal', 'Yellow, green, tan or mustard. Seedy, or a little mucus.'], ['Call your pediatrician', 'White, gray or very pale. Red or black. Hard pebbles.', '#fdeee6', '#9a5a3c'])
          + small('Calling about poop?', 'A photo of the diaper helps.')]
      ])); };
  ['basics0', 'bf0', 'bot0', 'dig0', 'rhythm1', 'bfmilk1', 'bot1', 'dig1'].forEach(k => { const old = P[k]; P[k] = (...a) => { CALLS.soon = []; CALLS.now = []; const h = old(...a); CALLS.soon = []; CALLS.now = []; return h; }; });
  window.__fdApplyJump = () => { const j = window.__fdJump; if (!j) return; window.__fdJump = null; const m = document.querySelector('#main'); if (!m) return;
    m.querySelectorAll('details.fd-acc[open]').forEach(x => { x.open = false; });
    const tb = [...m.querySelectorAll('.fd-tabs button')].find(b => b.textContent.toLowerCase().includes(j[0].toLowerCase())); if (tb) tb.click();
    const d = j[1] && [...m.querySelectorAll('.fd-panel:not([hidden]) details.fd-acc, details.fd-acc')].find(x => getComputedStyle(x.closest('.fd-panel') || x).display !== 'none' && x.querySelector('summary').textContent.toLowerCase().includes(j[1].toLowerCase()));
    if (d) { d.open = true; setTimeout(() => d.scrollIntoView({ block: 'center' }), 30); } else if (tb) tb.scrollIntoView({ block: 'start' }); };
  if (typeof MutationObserver !== "undefined") { const obs = new MutationObserver(() => { if (window.__fdJump && document.querySelector('#main .fd-tabs')) setTimeout(window.__fdApplyJump, 20); }); const start = () => { const m = document.querySelector('#main'); if (m) obs.observe(m, { childList: true }); }; if (document.readyState !== 'loading') start(); else document.addEventListener('DOMContentLoaded', start); }
  const dirD0 = P.dirD; P.dirD = function (...a) { window.__fdPills = true; try { return dirD0.apply(this, a); } finally { window.__fdPills = false; } };
  const rnd = window.render;
  const curPage = () => { try { return (0, eval)('page'); } catch (e) { return ''; } };
  window.render = render = function (...a) { if (curPage() === 'stages:Feeding') { const keep = window.__fdStage; try { P.dirD(); } catch (e) { console.warn('fd stages', e); } window.__fdStage = keep; } return rnd.apply(this, a); };

  // ---- One sequence alone under "What's new now" (First foods, and Getting ready for formula families): show it as a
  // step card with its steps listed, so the stage's one big topic reads as the main thing without a new card style. ----
  const SEQ = { f3: ['On the tray: iron first', 'Allergens: try each one', 'Foods to skip for now', 'Drinks: water in a cup'],
    r2: ['The four readiness signs', 'Purées, finger foods, or both', 'Allergies, and who should ask first', 'Get set up for the first bite', 'Gagging vs choking'] };
  const seqCard = (area, icon, title) => { const [t, rows] = XAREA()[area], c = XC[area], st = rows.filter(Boolean);
    return `<section class="hub-card fd-seq" style="--sq-bg:${c[0]};--sq-ink:${c[1]}"><button type="button" class="fd-seq-top" onclick="${go('xa:' + area)}"><span class="fd-seq-art">${hubArt(icon, CAT).replace('data-art=', 'data-keep=')}</span><span class="fd-seq-copy"><b>${F(t)}</b></span><span class="hub-chev" aria-hidden="true">›</span></button>`
      + `<ol class="fd-seq-steps">${st.map((r, i) => `<li><button type="button" onclick="${go('xa:' + area + '.' + i)}"><span class="fd-seq-n">${i + 1}</span><span class="fd-seq-l">${F(SEQ[area][i] || r[2])}</span><span class="hub-chev" aria-hidden="true">›</span></button></li>`).join('')}</ol></section>`; };
  const seqCss = `<style>#main .fd-seq{padding:0;overflow:hidden}#main .fd-seq-top{display:flex;align-items:center;gap:14px;width:100%;border:0;background:var(--sq-bg);color:var(--sq-ink);padding:14px 18px;font:inherit;text-align:left;cursor:pointer}#main .fd-seq-art{flex:none;width:44px;height:44px;border-radius:16px;background:#fff;display:grid;place-items:center}#main .fd-seq-art svg{width:30px;height:30px}#main .fd-seq-copy{flex:1;min-width:0;display:grid;gap:3px}#main .fd-seq-copy small{font-size:13px;font-weight:600;opacity:.85}#main .fd-seq-copy b{font-size:18px;line-height:1.25;color:var(--ink,#2b2840);text-wrap:balance}#main .fd-seq-steps{list-style:none;margin:0;padding:6px 0}#main .fd-seq-steps button{display:flex;align-items:center;gap:12px;width:100%;border:0;background:none;padding:11px 18px;font:inherit;font-size:15px;color:var(--ink,#2b2840);text-align:left;cursor:pointer}#main .fd-seq-steps li+li button{border-top:1px solid var(--line,#efe8ea)}#main .fd-seq-n{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;background:var(--sq-bg);color:var(--sq-ink)}#main .fd-seq-l{flex:1;min-width:0}</style>`;
  window.SHOME = (() => { const prev = window.SHOME; return v => { const h = prev(v);
    const area = v === 3 ? 'f3' : v === 2 && !isBreast() ? 'r2' : null; if (!area) return h;
    const i = h.indexOf('<div class="hub-list">'), j = h.indexOf('</div>' + '<button class="hub-rough-card', i); if (i < 0 || j < 0) return h;
    const list = h.slice(i, j + 6); if ((list.match(/sm-row hub-row/g) || []).length !== 1) return h;
    return h.slice(0, i) + seqCss + seqCard(area, 'bowl', v === 3 ? 'Iron first, then lots of variety' : 'Start when he shows all the signs') + h.slice(j + 6); }; })();


  // ---- Simulation gaps (Nov 7), folded in to keep the stage pages calm. ----
  // 1. Nursing-only families get one row for time apart, since they never see the bottle walkthrough.
  const awayNurse = P.y_away;
  P.y_away = () => !(nurses() && !isBottle()) ? awayNurse() + (formulaFam() ? xKnow('Formula on the go', 'Pack powder and water separately, and mix when he’s hungry. Use it within 2 hours of mixing.') : '') : yPage(XC.p1, 'Time apart', 'Getting ready for work or a sitter', 'Start a few weeks ahead, so he knows a bottle and there’s milk in the freezer.',
      xCompare([['bottle', 'A first bottle', '2–3 weeks ahead. Someone else offers it.'], ['snow', 'A small stash', 'Freeze 2–4 oz bags, a little at a time.'], ['clock', 'How much', 'About 1–1½ oz for each hour apart.']])
      + h2('How long breast milk keeps') + storeTable([['Fresh', '4 hours', '4 days', '6 months is best, 12 is fine'], ['Thawed', '1–2 hours', '24 hours', 'Never refreeze'], ['Left after a feed', '2 hours', 'Toss it', 'Toss it']])
      + xDo('What to tell caregivers', ['Feed on cue, not the clock.', 'Hold the bottle level, and let him pause.', 'Small bottles, so less is wasted.'])
      + xKnow('When you’re together', 'Nurse as usual. Many babies nurse more in the evenings after a day apart.')
      + xKnow('Adding formula instead?', 'Formula can cover time apart while you keep nursing together. Change milk to breast milk and formula in his details, and Feeding will show formula amounts and bottle steps.') + `<div class="hub-browse"><button class="hub-link" onclick="navigate('profile')">${F('Open his details')} ›</button></div>`);
  window.M1HOME = (() => { const prev = window.M1HOME; return () => { const h = prev(); if (!(nurses() && !isBottle())) return h;
    const row = H().row({ cat: CAT, icon: 'bag', title: 'Going back to work, or a sitter?', sub: 'A first bottle, and a small milk stash', onclick: go('y_away') }).replace(/<span class="hub-dot">[\s\S]*?<\/span><span class="hub-row-copy">/, `<span class="hub-dot">${hubArt('bag', CAT).replace('data-art=', 'data-keep=')}</span><span class="hub-row-copy">`).replace('class="hub-row', `style="--sm-bg:${XC.p1[0]};--sm-ink:${XC.p1[1]}" class="sm-row hub-row`);
    const i = h.indexOf('</div><button class="hub-rough-card'); return i < 0 ? h : h.slice(0, i) + row + h.slice(i); }; })();
  // 2. Pumping-only families: one line on the newborn day about how often to pump, beside the pump marks on the ribbon.
  P.x_day = (() => { const prev = P.x_day; return () => { const h = prev(); if (!onlyPump() || formulaFam() || stored()) return h;
    const t = `<li>${F('Days 3–5: expect hungrier, more frequent feeds as your milk comes in.')}</li>`;
    return h.replace(t, t + `<li>${F('Pump about as often as he feeds, 8 or more times a day, including once at night.')}</li>`); }; })();
  // 3. Nursing + formula: cutting back top-ups, as three tiles instead of one line.
  P.y_bottle = (() => { const prev = P.y_bottle; return () => { const h = prev(); if (!(nurses() && formulaFam())) return h;
    return h.replace(F('Many babies need fewer top-ups as nursing gets easier. Your pediatrician can help you cut back.'), F('Many babies need fewer top-ups as nursing gets easier. Cut back slowly, with your pediatrician’s okay.'))
      .replace('<section class="ss-do">', h2('Fewer top-ups? Cut back slowly') + xCompare([['eye', 'When', 'Gaining well, and your pediatrician agrees.'], ['drop', 'Go slowly', 'About ½ oz less in one top-up, every few days.'], ['diaper', 'Watch diapers', 'Still 6+ wet a day? Keep going. Fewer? Go back a step.']]) + '<section class="ss-do">'); }; })();


  // Late starters: past about 7 months and not started yet, the stage lead says so and points to the checkup.
  P.dirD = (() => { const prev = P.dirD; return (v) => { const h = prev(v); if (window.__fdStage !== 2 || ageMo() < 7) return h;
    return h.replace(F(solidsLead()), F('Iron matters more after 6 months, so it’s worth starting soon. Bring your feeding questions to the checkup.')); }; })();


  // One Feeding stage everywhere: the page, the stage timeline, Baby's details and Home all read the app's stage,
  // and "Make this her stage" sets it the same way the timeline's Change does (with Undo).
  try { localStorage.removeItem(pickKey()); } catch (e) {}
  window.__fdReal = () => { try { return feedGroup(chgStageIndex('Feeding')); } catch (e) { return realStage(); } };
  window.__fdPick = (i) => { window.__fdStage = null; if (typeof hubChangeStage === 'function') hubChangeStage('Feeding', i); else openPage('topic:Feeding'); };


  // No answer about solids yet, and old enough that most babies have started: show solids for the age, say so,
  // and give a one-tap way back to Ready for solids.
  P.dirD = (() => { const prev = P.dirD; return (v) => { const h = prev(v);
    try { if (v != null && v !== window.__fdReal()) return h; if (typeof hasFoodAnswer !== 'function' || hasFoodAnswer() || !(typeof foodAssumed === 'function' && foodAssumed())) return h; } catch (e) { return h; }
    const note = `<p class="hub-lead" style="margin-top:10px;font-size:14px">${F('We’re showing solids for Ari’s age.')} <button type="button" onclick="hubChangeStage('Feeding',2)" style="border:0;background:none;padding:0;font:inherit;font-weight:700;color:inherit;text-decoration:underline;cursor:pointer">${F('Not started yet?')}</button></p>`;
    return h.replace('</header><section class="hub-card hub-glance', note + '</header><section class="hub-card hub-glance'); }; })();


  // Once solids start, choking first aid is one tap from the stage page, under "Normal, or time to call?".
  window.SHOME = (() => { const prev = window.SHOME; return v => prev(v) + (v >= 3 ? `<div class="hub-browse"><button class="hub-link" onclick="${go('xa:r2.4')}">${F('Choking first aid, step by step')} ›</button></div>` : ''); })();


  // Anything that renders the Feeding category directly (a stage Change, Undo, Back) shows the new stage page.
  { const rnd2 = window.render; window.render = render = function (...a) { try { if ((0, eval)('page') === 'topic:Feeding') (0, eval)("page='chg:Feeding:mock:dirD'"); } catch (e) {} return rnd2.apply(this, a); }; }

  const base = window.changesRoute;
  // Home cards link to the old Feeding detail pages; send each to the page that now covers it.
  // Every older Feeding link (Home cards, the year view, Safety, briefings) opens the page that now covers it.
  const OLDD = { vitd: 'xa:growth.3', signs: 'xa:r2.0', notready: 'xa:r2.0', approach: 'xa:r2.1', setup: 'xa:r2.3', food: 'xa:f3.0', tray: 'xa:f3.0', lumpy: 'xa:f3.0', finger: 'xa:f3.0',
    allergens: 'xa:f3.1', cup: 'xa:f3.3', day: 'xa:m4.0', family: 'xa:m4.1', milk12: 'z_milk12', after: 'z_milk12', cues: 'xa:feed.0', latch: 'xa:feed.1', pace: 'xa:feed.1', pacing: 'xa:feed.1',
    enough: 'xa:growth.1', milk: 'xa:growth.0', storage: 'xa:prep', nursing: 'y_nurse', bottles: 'y_away', pump: 'y_away' };
  const OLDTOP = { safe: 'xa:r2.4', gag: 'xa:r2.4', signs: 'xa:r2.0', approach: 'xa:r2.1', allergens: 'xa:f3.1', allergy: 'xa:f3.1', offer: 'xa:f3.0', amounts: 'xa:growth.0', milk: 'xa:growth.0' };
  const oldFeeding = r => { const q = String(r).split(':'); if (q[0] === 'chg' && q[1] === CAT && q[2] === 'mock' && q[3] === 'enough') return 'chg:' + CAT + ':mock:y_growth'; if (q[0] !== 'chg' || q[1] !== CAT || q[2] === 'mock') return r;
    // "How much milk": newborn stomach sizes only in the first weeks; after that, the amounts on the baby's own stage.
    if (q[2] === 'd' && q[3] === 'milk' && window.__fdReal && window.__fdReal() >= 3) return 'chg:' + CAT + ':mock:dirD';
    const to = q[2] === 'd' ? OLDD[q[3]] : q[2] === 's' && q[3] !== '' && q[3] != null ? 'dirD:' + feedGroup(Number(q[3])) : q[2] === 'help' ? (window.__fdReal() <= 2 ? 'x_tough' : 'z_tough') : OLDTOP[q[2]];
    return 'chg:' + CAT + ':mock:' + (to || 'dirD'); };
  window.changesRoute = function (r) { r = oldFeeding(r); const [, cat, s, a, x] = r.split(':'); if (cat === CAT && s === 'mock' && P[a]) { window.__fdLast = r; const out = P[a](x); return calm(a, a === 'dirD' ? out : tidy(out)); } return base(r); };
  const op = window.openPage;
  window.openPage = openPage = function (r, ...rest) { if (r === 'topic:Feeding') r = 'chg:Feeding:mock:dirD'; return op.call(this, r, ...rest); };
})();
