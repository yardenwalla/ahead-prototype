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
      const tiles = [['blue', ART.often(5), 'How often', 'Every 2–4 hours', 'Longest stretch at night'], ['pink', ART.drops(8), 'Feeds a day', '7–9', 'Nursing and bottles together'], ['peach', ART.bottle(.5), 'Per bottle', '4–5 oz formula', 'Breast milk: 3–4 oz'], ['yellow', ART.diapers(6), 'Wet diapers', '6 or more', 'A day']];
      let b = `<header class="hub-hero"><p class="hub-eyebrow">${F('Milk feeds')}</p><h1>${F('Feeds get quicker and further apart')}</h1><p class="hub-lead">${F('Ari is better at eating now, so feeds take less time, and many babies take their longest stretch at night.')}</p></header>`;
      b += `<section class="hub-card hub-glance is-static"><span class="hub-card-head"><b>${F('Feeds now')}</b><button class="hub-card-cta" onclick="${go('day')}">${F('Example day')} ›</button></span><div class="hub-tiles">${tiles.map(([c, art, l, v, sub]) => `<div class="sm-tile" style="--sm-bg:${TILE[c][0]};--sm-ink:${TILE[c][1]}"><span class="sm-art">${art}</span><small>${F(l)}</small><b>${F(v)}</b><span>${F(sub)}</span></div>`).join('')}</div><span class="hub-card-note"><b>${F('Every day')}</b> ${F('Vitamin D drops, while Ari gets breast milk.')} <button class="hub-inline-link" onclick="${go('vitd')}" style="all:unset;cursor:pointer;color:#9b4766;font-weight:600">${F('How')} ›</button></span></section>`;
      b += h2('How to help Ari feed now') + `<div class="hub-list">${[
        row('blue', 'clock', 'Feeds', 'Follow his cues, not the clock', 'Lots of evening feeds are normal', 'day'),
        row('yellow', 'diaper', 'Getting enough', 'Wet diapers and steady weight', 'The two signs that matter now', 'enough'),
        row('pink', 'drop', 'Your milk', 'Softer breasts are normal now', 'It doesn’t mean less milk', 'supply'),
        row('lilac', 'bottle', 'Bottles', 'Pace each bottle', 'Level, with pauses, so he leads', 'bottle')].join('')}</div>`;
      b += `<button class="hub-rough-card care-rash-card" style="background:#fbe4ec;color:#9b4766" onclick="${go('worry')}"><span class="hub-rough-moon" aria-hidden="true">${hubArt('eye', CAT)}</span><span class="hub-rough-copy"><b>${F('Is this normal?')}</b><small>${F('Spit-up, gas, fussing or arching at feeds')}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
      b += h2('Coming up') + `<div class="hub-list">${row('lilac', 'clock', 'Often around 3 months', 'Going back to work?', 'Start a few weeks ahead', 'work')}</div>`;
      b += h.next('Next, around 4 months', 'Ready for solids', '');
      b += `<div class="hub-browse care-shop"><button class="hub-link" onclick="${go('basics')}">${F('Milk and bottle basics')} ›</button><button class="hub-link" onclick="${go('year')}">${F('Feeding this year')} ›</button></div>` + h.note('Ages are typical. Every baby moves at their own pace.');
      return `${css}<div class="quiet-category hub-page care-v2" data-overview="${CAT}" style="${yearTheme(CAT)}">${typeof monthlyPageHeader === 'function' ? monthlyPageHeader(CAT) : ''}${pills}${b}</div>`; },

    // 1 · HOW MUCH, HOW OFTEN: a day of feeds at this age
    day: () => page(head('Feeds now', 'A day of feeds at 2 months', 'An example, not a schedule. Ari leads, and no two days look the same.')
      + `<div class="hub-card"><ol class="fm-day">${[['7:00', 'drop', 'Nurse', 'Often 10–15 minutes'], ['10:00', 'bottle', 'Bottle', '4 oz'], ['1:00', 'drop', 'Nurse', ''], ['4:00', 'drop', 'Nurse', ''], ['6–8 pm', 'drop', 'A few feeds close together', 'Cluster feeding is normal'], ['10:00', 'bottle', 'Bottle', '4–5 oz, then bed'], ['3:00 am', 'drop', 'Nurse', 'After his longest stretch']].map(([t, i, w, s]) => `<li><time>${F(t)}</time><span class="fm-ic" style="background:${i === 'bottle' ? '#fdeee6' : '#fbe4ec'}">${hubArt(i, CAT)}</span><span><b>${F(w)}</b>${s ? `<small>${F(s)}</small>` : ''}</span></li>`).join('')}</ol></div>`
      + h2('How much at each feed') + `<div class="fm-two"><div style="background:#fbe4ec"><small style="color:#9b4766">${F('Nursing')}</small><b>${F('Until he lets go')}</b><span>${F('Often 10–15 minutes now. Offer the second side.')}</span></div><div style="background:#fdeee6"><small style="color:#9a5a3c">${F('A bottle')}</small><b>${F('4–5 oz')}</b><span>${F('Of formula. Breast milk bottles stay about 3–4 oz.')}</span></div></div>`
      + h2('Hungry, or full?') + `<div class="fm-two"><div style="background:#e7effc"><small style="color:#46638c">${F('Hungry')}</small><span>${F('Rooting, hands to mouth, lip smacking. Crying comes last.')}</span></div><div style="background:#e4f3ec"><small style="color:#356651">${F('Full')}</small><span>${F('Slows down, turns away, relaxed open hands.')}</span></div></div>`
      + `<p class="ss-small"><b>${F('Counting the time:')}</b> ${F('from the start of one feed to the start of the next.')}</p>`),

    vitd: () => page(head('Every day', 'Vitamin D drops', 'Babies who get any breast milk need 400 IU every day.', C.green)
      + steps([['drop', 'Once a day', 'Same time helps you remember'], ['hand', 'On the nipple or a pacifier', 'Or inside the cheek']], true)
      + `<p class="ss-know"><b>${F('When to stop')}</b>${F('Once Ari drinks about 32 oz of formula a day. Formula has vitamin D added.')}</p>` + `<p class="ss-small"><b>${F('Coming up:')}</b> ${F('at the 4-month checkup, ask about iron.')}</p>`),

    // 2 · GETTING ENOUGH
    enough: () => page(head('Getting enough', 'Is Ari getting enough?', 'At 2 months, two signs tell you, and you don’t need to measure what he drinks at the breast.', C.yellow)
      + steps([['diaper', '6 or more wet diapers', 'Every day, pale yellow'], ['heart', 'Steady growth', 'Along his curve at checkups'], ['smile', 'Content after most feeds', 'With some fussy evenings']], false)
      + h2('Also normal') + p('Poops can space out to once every few days on breast milk. Some feeds are short, some long. A hungrier few days usually means a growth spurt.')
      + call('Fewer than 6 wet diapers a day, he seems hungry after most feeds, or he isn’t gaining at a checkup.')
      + urgent('No wet diaper in 8 hours, a sunken soft spot, or very hard to wake. Call your pediatrician right away.')),

    supply: () => page(head('Your milk', 'Softer breasts are normal now', 'Around 6–12 weeks, your supply settles to what Ari needs. Feeling less full doesn’t mean less milk.')
      + steps([['heart', 'Less full, less leaking', 'Your body has matched him'], ['clock', 'Shorter feeds', 'He’s quicker at it'], ['diaper', 'Diapers still 6+', 'The sign that matters']], false)
      + h2('Worried it’s too little?') + p('Feed more often and offer both sides. If you’re supplementing, nurse or pump for those feeds too. A lactation consultant can help.')
      + call('Fewer wet diapers, or slow weight gain at a checkup.')),

    // HOW-TO
    bottle: () => page(head('How-to', 'Pace each bottle', 'Pacing lets Ari lead, like at the breast, so he takes what he needs and less air.', C.lilac)
      + steps([['hand', 'Hold him upright', 'Head higher than his tummy'], ['bottle', 'Bottle fairly level', 'Just enough milk in the tip'], ['clock', 'Pause every few sucks', 'Tip it down, then let him draw it back'], ['heart', 'Stop when he slows', 'Even if there’s milk left']], true)
      + h2('Time for a faster nipple?') + `<div class="fm-two"><div style="background:#efedff"><small style="color:#625084">${F('Too slow')}</small><span>${F('Sucks hard, gets frustrated, the nipple collapses, feeds take over 20 minutes.')}</span></div><div style="background:#fdeee6"><small style="color:#9a5a3c">${F('Too fast')}</small><span>${F('Gulping, coughing, or milk spilling from his mouth.')}</span></div></div>`
      + `<p class="ss-small"><b>${F('Burping:')}</b> ${F('every 2–3 oz and at the end. No burp after a few minutes is fine.')}</p>`),

    basics: () => page(head('Milk and bottle basics', 'How long milk keeps', 'Breast milk and formula, side by side.', C.blue)
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
      + `<div class="hub-card care-folds care-lookoff">${[['bottle', 'Spit-up or vomit?', 'How much is normal, and when to call', 'spit'], ['drop', 'Gas or lots of crying', 'What helps, and gripe water'], ['heart', 'Fussy or arching at feeds', 'Too hungry, too fast, or full'], ['hand', 'Sore nipples or breasts', 'Usually the latch, and when to call'], ['clock', 'Worried about your supply', 'The signs that matter', 'supply'], ['bottle', 'Won’t take a bottle', 'Common for breastfed babies']].map(([i, t, s, to]) => `<button class="care-pick" onclick="${to ? go(to) : ''}"><span class="care-ico">${hubArt(i, CAT)}</span><span><b>${F(t)}</b><small>${F(s)}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div>`),

    spit: () => page(head('Is this normal?', 'Spit-up or vomit?', 'Most babies spit up. It peaks around 4 months and is usually gone by the first birthday.')
      + `<figure class="hub-card fm-spill" role="img" aria-label="Spill one tablespoon of milk on the counter. Most spit-up is less than it looks."><div><svg viewBox="0 0 120 70"><ellipse cx="60" cy="40" rx="46" ry="20" fill="#f4e6d6"/><ellipse cx="54" cy="38" rx="30" ry="12" fill="#fff" stroke="#e6d6c4"/></svg><b>${F('1 tablespoon')}</b><small>${F('Spill one on the counter: most spit-up is less than it looks')}</small></div><div><svg viewBox="0 0 120 70"><path d="M20 50 q40 -40 80 -30" stroke="#c0546f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M92 14 l12 6 -12 6" stroke="#c0546f" stroke-width="5" fill="none" stroke-linecap="round"/></svg><b style="color:#a3324f">${F('Forceful')}</b><small>${F('Shoots out, after most feeds: that’s vomiting')}</small></div></figure>`
      + h2('What helps') + steps([['hand', 'Upright after feeds', 'For 20–30 minutes'], ['bottle', 'Smaller feeds', 'A little more often'], ['heart', 'Burp mid-feed', 'And at the end']], false)
      + call('Forceful or projectile vomiting, fewer wet diapers, refusing feeds, or slow weight gain.')
      + urgent('Green or bloody vomit, or vomiting with a fever under 3 months.'))
  };
  const base = window.changesRoute;
  window.changesRoute = function (r) { const [, cat, s, a] = r.split(':'); if (cat === CAT && s === 'mock' && P[a]) return P[a](); return base(r); };
  const op = window.openPage;
  window.openPage = openPage = function (r, ...rest) { if (r === 'topic:Feeding') r = 'chg:Feeding:mock:h'; return op.call(this, r, ...rest); };
})();
