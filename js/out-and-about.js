/* Ahead · Outings and travel, rebuilt around how parents think about leaving the house:
   "Where are we going, and what do I need to know for Maya's age?"
   Job: whenever we leave the house, from a walk to a flight, tell me how to do it safely and calmly at Maya's age.
   Rule: a page belongs here if it's about taking the baby somewhere: getting there, being there, or sleeping there.
   Ownership: sun by age and dressing live in Everyday care, safe sleep in Sleep, fevers in Health, babyproofing in Safety,
   milk and food in Feeding. Outings shows the travel-specific step and links to the home page, so nothing is written twice.

   The home screen: a top card for the age, then situations first ("Where are you headed?"), then the gear underneath,
   the one must-know car card, and what's next. Situation pages follow the order a trip happens (before, on the day,
   when you get there). Age decides what shows: nothing for a later age appears early.
   Sources (working notes, never in the app): scratchpad travel-sources.md, kept in the project as travel-sources. */
(function () {
  const CAT = 'Out and about';
  const H = () => window.__hub;
  const F = s => H().F(s);
  const live = () => typeof isCurrent !== 'function' || isCurrent();

  /* ---------- registration ---------- */
  if (typeof TOPICS !== 'undefined' && !TOPICS.some(([t]) => t === CAT)) TOPICS.push([CAT, 'travel', []]);
  if (typeof YEAR_PALETTES !== 'undefined') YEAR_PALETTES[CAT] = { bg: '#fde3d3', pale: '#fef2ea', ink: '#8a4a2c', accent: '#e8b096' };
  // No stages: outings change with where you're going, not with a stage. Age only changes a few lines inside the pages,
  // and the top card says what's new for outings this month, with one "Coming up" line for the next change.
  if (typeof YEAR_STORIES !== 'undefined' && !YEAR_STORIES[CAT]) YEAR_STORIES[CAT] = YEAR_STORIES['Daily rhythm'];
  if (typeof CAT_ICON_SCENE !== 'undefined') CAT_ICON_SCENE[CAT] = 0;
  const baseTopic = displayTopic;
  window.displayTopic = displayTopic = t => t === CAT ? 'Outings and travel' : baseTopic(t);

  /* ---------- the baby ---------- */
  const ageNow = () => live() ? actualMonth() : month;
  const stageFor = m => m < 2 ? 0 : m < 6 ? 1 : 2;
  const stageNow = () => stageFor(ageNow());
  // Food and sitting follow Feeding's age (adjusted for babies born early); gear sizes and shots keep the birthday.
  const careAge = () => (typeof hubAgeFor === 'function' ? hubAgeFor('care', ageNow()) : ageNow());
  const eats = () => careAge() >= 6;
  const feed = () => (typeof profile !== 'undefined' && profile.feed) || 'Breast milk';
  const nursing = () => feed() !== 'Formula';
  const how = () => (typeof profile !== 'undefined' && profile.feedHow) || '';
  const pumps = () => how() !== 'Nursing'; // breast milk in bottles: pumped, or stored after weaning
  const pumping = () => pumps() && how() !== 'Stored'; // a pump comes along
  const formula = () => feed() !== 'Breast milk';
  // Moving, as the parent reported it in Safety (crawling or pulling up), never claimed from age alone.
  const moving = () => live() && typeof currentSafetyMovementStage === 'function' && ['moving', 'pulling'].includes(currentSafetyMovementStage());
  // Hot or cold, from the date: the weather page opens on the season the parent is in.
  const season = () => { const mo = (typeof NOW !== 'undefined' ? NOW : new Date()).getMonth(); return mo >= 4 && mo <= 8 ? 'hot' : mo >= 10 || mo <= 2 ? 'cold' : 'hot'; };
  let weatherView = null;

  const baseSnap = stageSnapshot;
  window.stageSnapshot = stageSnapshot = function (topic) {
    if (topic !== CAT) return baseSnap(topic);
    const n = nowFor(ageNow());
    return { title: n[1], body: 'Errands, trips, the weather and your gear.', key: 'travel' };
  };
  const baseYear = categoryYear;
  window.categoryYear = categoryYear = t => t === CAT ? outAndAbout() : baseYear(t);
  const baseCategory = completeCategory;
  window.completeCategory = completeCategory = t => t === CAT ? outAndAbout() : baseCategory(t);

  /* ---------- colors and small flat pictures, in Development's shapes style ---------- */
  const PAL = {
    errands: ['#e6f5ec', '#356651', '#bfe3cf', '#f2b8c6'],
    road: ['#e7effc', '#46638c', '#9fb8df', '#d9e5fc'],
    fly: ['#ece8f8', '#5b4f8a', '#c3b8ea', '#e3b8cf'],
    abroad: ['#e2f3f1', '#2f6661', '#a9dbd4', '#fbe6bd'],
    away: ['#f6e8f3', '#7a4f74', '#e3b8cf', '#f4d6c4'],
    weather: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0'],
    hot: ['#fff3dc', '#8a6a2a', '#f3d58a', '#f6c9a8'],
    cold: ['#e3e6f6', '#3d4a7a', '#b9c2ea', '#d9e5fc'],
    gear: ['#fde3d3', '#8a4a2c', '#f4c3a8', '#e7effc'],
    water: ['#e0f2fb', '#2b6582', '#9fd3ec', '#fbe6bd'],
    sick: ['#fdeee6', '#9a5a3c', '#f4c3a8', '#fbe0d0']
  };
  const SHAPE = {
    // A path with a stop at the end.
    errands: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M6 30h50" stroke="${c[2]}" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 11"/><circle cx="70" cy="22" r="10" fill="${c[3]}"/></svg>`,
    // A road, its dashes, and a small car shape.
    road: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="2" y="24" width="86" height="12" rx="6" fill="${c[2]}"/><path d="M12 30h66" stroke="#fff" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round"/><rect x="24" y="8" width="28" height="12" rx="6" fill="${c[3]}"/></svg>`,
    // A flight path arcing up.
    fly: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M6 34Q40 -2 80 18" stroke="${c[2]}" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="1 7"/><circle cx="80" cy="18" r="7" fill="${c[3]}"/><circle cx="8" cy="34" r="4" fill="${c[2]}"/></svg>`,
    // A globe: a circle with one ring.
    abroad: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="${c[2]}"/><ellipse cx="20" cy="20" rx="7" ry="16" fill="none" stroke="#fff" stroke-width="2"/><circle cx="50" cy="28" r="7" fill="${c[3]}"/></svg>`,
    // A house shape, and a small circle beside it.
    away: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 18 22 4l18 14v18H4Z" fill="${c[2]}"/><circle cx="54" cy="28" r="8" fill="${c[3]}"/></svg>`,
    // Half a sun and a cool drop: hot and cold.
    weather: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 34a16 16 0 0 1 32 0Z" fill="${c[2]}"/><circle cx="54" cy="16" r="8" fill="${c[3] === '#fbe0d0' ? '#d9e5fc' : c[3]}"/></svg>`,
    hot: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="20" cy="22" r="14" fill="${c[2]}"/><rect x="42" y="26" width="40" height="8" rx="4" fill="${c[3]}"/></svg>`,
    cold: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><circle cx="14" cy="14" r="6" fill="${c[2]}"/><circle cx="34" cy="24" r="8" fill="${c[3]}"/><circle cx="56" cy="12" r="5" fill="${c[2]}"/><rect x="4" y="32" width="76" height="5" rx="2.5" fill="${c[3]}"/></svg>`,
    water: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><path d="M4 26q8-8 16 0t16 0 16 0 16 0" stroke="${c[2]}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="72" cy="12" r="7" fill="${c[3]}"/></svg>`,
    gear: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="4" y="10" width="30" height="24" rx="8" fill="${c[2]}"/><circle cx="50" cy="28" r="7" fill="${c[3]}"/></svg>`,
    sick: c => `<svg viewBox="0 0 90 40" aria-hidden="true"><rect x="10" y="2" width="12" height="28" rx="6" fill="${c[2]}"/><circle cx="16" cy="31" r="8" fill="${c[2]}"/><rect x="34" y="18" width="40" height="8" rx="4" fill="${c[3]}"/></svg>`
  };

  /* ---------- building blocks ---------- */
  const open = id => `openPage('chg:${CAT}:d:${id}')`;
  const sec = t => `<h2 class="oa-sec">${F(t)}</h2>`;
  // Plain lines in one white card: [title, line] pairs, or a single line.
  const lines = items => `<ul class="oa-lines">${items.filter(Boolean).map(x => Array.isArray(x) ? `<li><b>${F(x[0])}</b><span>${F(x[1])}</span></li>` : `<li>${F(x)}</li>`).join('')}</ul>`;
  // The one card that stands out on a page.
  const todo = (label, items) => `<section class="ss-do oa-do"><b>${F(label)}</b>${Array.isArray(items) ? `<ul>${items.filter(Boolean).map(t => `<li>${F(t)}</li>`).join('')}</ul>` : `<p>${F(items)}</p>`}</section>`;
  const know = (label, text) => `<p class="ss-know"><b>${F(label)}</b>${F(text)}</p>`;
  // A row that opens a page in another category, so the advice lives in one place.
  const elsewhere = (icon, title, sub, go, where) => `<div class="oa-link-row">${H().list('', [H().row({ icon, cat: CAT, title, sub: sub + (where ? ' · In ' + where : ''), onclick: go })])}</div>`;
  const rowTo = (icon, title, sub, id, chip) => H().row({ icon, cat: CAT, title, sub, onclick: open(id), chipText: chip });

  /* ---------- Optional outing companion ----------
     The original guide remains the source of truth and is never replaced.
     For more involved outings, parents can collect preparation, the existing
     diaper bag plus trip-specific extras, and in-the-moment answers in one place.
     No forms, location, weather lookup, or synthetic predictions. */
  const oaKitOn = () => window.OA_COMPANION !== false;
  const oaKitData = {
    road: {
      label: 'Road trip', action: 'Get ready for the drive',
      prep: [
        ['Check the car seat', 'Rear-facing, correct recline, snug harness.'],
        ['Plan stops', 'Plan a break about every 2 hours, sooner if Maya needs one.'],
        ['Leave room for delays', 'Feeds, changes and a little fresh air can shift your arrival time.']
      ],
      now: [
        ['Crying while you drive?', 'Pull over somewhere safe before feeding, unbuckling or comforting Maya.'],
        ['Time for a feed?', 'Stop, take Maya out of her seat, then feed and change her. Never feed in a moving car.'],
        ['She fell asleep in the car?', 'A properly installed car seat is fine while traveling. At your destination, move her to a firm, flat sleep space.']
      ]
    },
    fly: {
      label: 'Flight', action: 'Get ready for the flight',
      prep: [
        ['Check your airline', 'Add Maya to the booking and check the car-seat, stroller and bassinet policies.'],
        ['Plan for security', 'Tell security about any baby milk, formula or water. These can exceed the usual 3.4 oz limit.'],
        ['Keep essentials with you', 'Changes, feeding supplies and a spare outfit go in your carry-on.']
      ],
      now: [
        ['Milk at airport security?', 'Tell the officer what you have. Breast milk, formula and water for infant feeds can exceed normal carry-on liquid limits.'],
        ['Crying on the plane?', 'Offer comfort or a feed. Walk the aisle only when the seat-belt sign is off.'],
        ['Where is Maya safest?', 'A ticketed seat with an aircraft-approved child restraint is safest, especially during turbulence. Follow crew instructions.']
      ]
    },
    away: {
      label: 'Overnight stay', action: 'Get ready for the stay',
      prep: [
        ['Confirm the sleep space', 'Ask about a suitable crib or play yard, or bring your own.'],
        ['Pack bedtime essentials', 'Bring her sleep sack and the sheet approved for the sleep space.'],
        ['Plan your room check', 'On arrival, use the full room checklist in the guide.']
      ],
      now: [
        ['A rough first night?', 'An unfamiliar place can make sleep unsettled. Keep bedtime steps familiar.'],
        ['Where should she sleep?', 'On her back in a bare crib or play yard with a firm, flat mattress and fitted sheet.'],
        ['Staying with family?', 'Share your sleep rules before bedtime. Keep medicines, cords and small objects out of reach.']
      ]
    },
    abroad: {
      label: 'International trip', action: 'Get ready for the trip',
      prep: [
        ['Check documents', 'Start the passport early and confirm entry and consent-document requirements.'],
        ['Check travel health', 'Talk to your pediatrician 4–6 weeks before your trip about destination-specific vaccines.'],
        ['Plan care and feeding', 'Know where you could see a doctor and how you will get safe water for feeding.']
      ],
      now: [
        ['What water is safe?', 'For formula and washing bottles, use water prepared safely for the destination. See the full guide.'],
        ['Mosquitoes where you are?', 'Use appropriate netting and age-appropriate repellent according to its label.'],
        ['Maya is unwell abroad?', 'Know the nearest medical facility. Fever in a malaria-risk area or difficulty waking needs prompt medical attention.']
      ]
    },
    water: {
      label: 'Pool or beach', action: 'Get ready for the water',
      prep: [
        ['Choose shade and a short visit', 'Earlier or later in the day is usually cooler.'],
        ['Plan for hands-on supervision', 'An adult stays in the water within arm’s reach the whole time.'],
        ['Pack for drying off', 'Keep a dry outfit, towel and feeding supplies nearby.']
      ],
      now: [
        ['Maya seems cold?', 'Take her out, dry her and warm her. Blue lips or trouble breathing needs urgent medical care.'],
        ['Too much sun?', 'Move into shade and feed her. Babies under 6 months need shade and clothing first.'],
        ['Are floats enough?', 'No. A flotation toy does not prevent drowning. Stay within arm’s reach.']
      ]
    }
  };
  let oaKitCurrent = null, oaKitTab = 'prep', oaKitExpanded = false, oaTripRendering = null;
  const oaKitExtras = {};
  const oaKitKey = () => 'ahead-outings-companion:' + ((typeof profile !== 'undefined' && profile.dob) || 'demo');
  function oaKitGet() {
    try {
      const s = JSON.parse(localStorage.getItem(oaKitKey()) || '{}');
      return s && typeof s === 'object' ? { pinned: s.pinned || null, checked: s.checked || {}, extras: s.extras || {} } : { pinned: null, checked: {}, extras: {} };
    } catch (e) { return { pinned: null, checked: {}, extras: {} }; }
  }
  function oaKitPut(s) { try { localStorage.setItem(oaKitKey(), JSON.stringify(s)); } catch (e) {} }
  const oaKitChecks = s => { const done={...s.checked}; bagGet().forEach(k => { done['bag:'+k]=true; }); return done; };
  const oaKitItems = id => {
    const d = oaKitData[id]; if (!d) return [];
    const prep = d.prep.map((x,i) => ({ key: 'prep:'+id+':'+i, label: x[0], sub: x[1], group:'prep' }));
    const extras = (oaKitExtras[id] || oaKitGet().extras[id] || []).map((x,i) => ({ key: 'extra:'+id+':'+i, label: x[1], sub: x[2], group:'extra' }));
    const bag = bagItems(ageNow()).map(x => ({ key:'bag:'+x[1], label:x[2], sub:x[3], group:'bag' }));
    return prep.concat(extras,bag);
  };
  const oaKitDone = (id, group) => {
    const marks=oaKitChecks(oaKitGet()), v=oaKitItems(id).filter(x=>!group || x.group===group);
    return { count:v.filter(x=>!!marks[x.key]).length,total:v.length };
  };
  function oaKitEntry(id) {
    if (!oaKitOn() || !oaKitData[id]) return '';
    return '<button class="oa-kit-entry" onclick="oaKitOpen(\''+id+'\')">'
      + '<span class="oa-kit-entry-glyph" aria-hidden="true">✓</span>'
      + '<span class="oa-kit-entry-copy"><b>'+F('Get ready for this trip')+'</b><small>'+F('Your packing list and quick answers, together')+'</small></span>'
      + '<span class="oa-kit-arrow" aria-hidden="true">›</span></button>';
  }
  function oaKitPinned() {
    if (!oaKitOn()) return '';
    const s=oaKitGet(), id=s.pinned, d=oaKitData[id]; if (!d) return '';
    const cnt=oaKitDone(id);
    return '<div class="oa-kit-pinned"><div class="oa-kit-pinned-title"><small>'+F('Your outing')+'</small>'
      + '<button onclick="oaKitUnpin()" aria-label="Remove saved outing" class="oa-kit-unpin">✕</button></div>'
      + '<button class="oa-kit-pinned-open" onclick="oaKitOpen(\''+id+'\')">'
      + '<b>'+F(d.label)+' with '+F(name())+'</b>'
      + '<span>'+cnt.count+' of '+cnt.total+' ready · '+F('Pack and quick answers')+'</span>'
      + '<em>'+F('Open your outing card')+' ›</em></button></div>';
  }
  const oaKitEscape = s => esc(F(s));
  function oaKitRows(items, checked) {
    return items.map(x => '<button class="oa-kit-check'+(checked[x.key]?' is-done':'')+'" onclick="oaKitTick(\''+x.key+'\')" aria-pressed="'+!!checked[x.key]+'">'
      + '<span class="oa-kit-checkbox" aria-hidden="true">'+(checked[x.key]?'✓':'')+'</span>'
      + '<span class="oa-kit-copy"><b>'+oaKitEscape(x.label)+'</b>'
      + (x.sub?'<small>'+oaKitEscape(x.sub)+'</small>':'')+'</span></button>').join('');
  }
  function oaKitRender() {
    if (!oaKitOn() || !oaKitCurrent || !oaKitData[oaKitCurrent]) return;
    const id=oaKitCurrent,d=oaKitData[id],s=oaKitGet(), all=oaKitItems(id),pr=all.filter(x=>x.group==='prep'),
      ex=all.filter(x=>x.group==='extra'),bag=all.filter(x=>x.group==='bag'),
      pc=oaKitDone(id,'prep'),lc=oaKitDone(id),packed=all.filter(x=>x.group!=='prep'),marks=oaKitChecks(s),bc=packed.filter(x=>marks[x.key]).length;
    const before = '<div class="oa-kit-summary"><b>'+F('Your trip prep')+'</b><span>'+pc.count+' of '+pc.total+' done</span></div>'
      + '<div class="oa-kit-list">'+oaKitRows(pr,marks)+'</div>'
      + '<button class="oa-kit-expand" aria-expanded="'+oaKitExpanded+'" onclick="oaKitExpand()">'
      + '<span><b>'+F('Pack for this trip')+'</b><small>'+bc+' of '+packed.length+' packed · '+F('Your usual bag + trip extras')+'</small></span>'
      + '<span aria-hidden="true">'+(oaKitExpanded?'−':'+')+'</span></button>'
      + (oaKitExpanded?'<div class="oa-kit-packing">'+(ex.length?'<div class="oa-kit-group">'+F('EXTRA FOR THIS TRIP')+'</div>'+oaKitRows(ex,marks):'')
         + '<div class="oa-kit-group">'+F('YOUR EVERYDAY BAG')+'</div>'+oaKitRows(bag,marks)+'</div>':'')
      + '<button class="oa-kit-pin'+(s.pinned===id?' is-on':'')+'" onclick="oaKitPin()">'
      + (s.pinned===id?'✓ '+F('Saved to Outings & travel'):'＋ '+F('Keep this handy on Outings & travel'))+'</button>'
      + '<button class="oa-kit-reset" onclick="oaKitReset()">'+F('Start a fresh trip')+'</button>';
    const during = '<p class="oa-kit-quicklead">'+F('Quick answers for the moment, without searching the full guide.')+'</p>'
      + '<div class="oa-kit-questions">'+d.now.map(x=>'<div class="oa-kit-answer"><b>'+oaKitEscape(x[0])+'</b><p>'+oaKitEscape(x[1])+'</p></div>').join('')+'</div>'
      + '<p class="oa-kit-explain">'+F('More scenarios and detailed guidance remain in the original guide below.')+'</p>';
    const html='<div class="oa-kit-scrim" id="oa-kit-scrim" onclick="if(event.target.id===\'oa-kit-scrim\')oaKitClose()">'
      + '<section class="oa-kit-sheet" role="dialog" aria-modal="true" aria-labelledby="oa-kit-title">'
      + '<header class="oa-kit-head"><div><p>'+F('YOUR OUTING CARD')+'</p><h2 id="oa-kit-title">'+F(d.label)+' with '+F(name())+'</h2></div>'
      + '<button class="oa-kit-close" onclick="oaKitClose()" aria-label="Close outing card">✕</button></header>'
      + '<div class="oa-kit-tabs" role="tablist">'
      + '<button role="tab" aria-selected="'+(oaKitTab==='prep')+'" class="'+(oaKitTab==='prep'?'is-active':'')+'" onclick="oaKitShow(\'prep\')">'+F('Before you go')+'</button>'
      + '<button role="tab" aria-selected="'+(oaKitTab==='now')+'" class="'+(oaKitTab==='now'?'is-active':'')+'" onclick="oaKitShow(\'now\')">'+F('While you’re out')+'</button></div>'
      + '<div class="oa-kit-body">'+(oaKitTab==='prep'?before:during)+'</div>'
      + '<footer class="oa-kit-footer"><button class="oa-kit-full" onclick="oaKitFullGuide()">'+F('Open the full guide')+' ›</button></footer>'
      + '</section></div>';
    let node=document.getElementById('oa-kit-scrim');
    if (!node) { document.body.insertAdjacentHTML('beforeend',html); }
    else {
      const at=node.querySelector('.oa-kit-body'), top=node.querySelector('.oa-kit-tabs'), foot=node.querySelector('.oa-kit-footer');
      if(at) { const scroll=at.scrollTop; at.innerHTML=oaKitTab==='prep'?before:during; at.scrollTop=scroll; }
      if(top)top.innerHTML='<button role="tab" aria-selected="'+(oaKitTab==='prep')+'" class="'+(oaKitTab==='prep'?'is-active':'')+'" onclick="oaKitShow(\'prep\')">'+F('Before you go')+'</button>'
        + '<button role="tab" aria-selected="'+(oaKitTab==='now')+'" class="'+(oaKitTab==='now'?'is-active':'')+'" onclick="oaKitShow(\'now\')">'+F('While you’re out')+'</button>';
    }
  }
  window.oaKitOpen = id => {
    if (!oaKitOn() || !oaKitData[id]) return;
    oaKitCurrent=id; oaKitTab='prep'; oaKitExpanded=false; oaKitRender();
    document.querySelector('.oa-kit-close')?.focus();
  };
  window.oaKitClose = () => { document.getElementById('oa-kit-scrim')?.remove(); oaKitCurrent=null; };
  window.oaKitShow = tab => {
    if (!['prep','now'].includes(tab)) return;
    oaKitTab=tab; oaKitRender();
    const b=document.querySelector('.oa-kit-body'); if(b)b.scrollTop=0;
  };
  window.oaKitExpand = () => { oaKitExpanded=!oaKitExpanded; oaKitRender(); };
  window.oaKitTick = key => {
    if (!oaKitCurrent || !oaKitItems(oaKitCurrent).some(x=>x.key===key)) return;
    if (key.startsWith('bag:')) {
      const k=key.slice(4),have=bagGet();
      const next=have.includes(k)?have.filter(x=>x!==k):have.concat(k);
      try { localStorage.setItem(BAG_KEY,JSON.stringify({day:today(),have:next})); } catch(e) {}
    } else { const s=oaKitGet();s.checked[key]=!s.checked[key];oaKitPut(s); }
    oaKitRender();
  };
  window.oaKitPin = () => {
    const s=oaKitGet(); s.pinned=s.pinned===oaKitCurrent?null:oaKitCurrent;
    s.extras[oaKitCurrent]=oaKitExtras[oaKitCurrent] || s.extras[oaKitCurrent] || [];
    oaKitPut(s); oaKitRender();
  };
  window.oaKitUnpin = () => { const s=oaKitGet(); s.pinned=null; oaKitPut(s); const y=window.scrollY; render(); window.scrollTo(0,y); };
  window.oaKitReset = () => {
    const s=oaKitGet(),id=oaKitCurrent;
    Object.keys(s.checked).forEach(k=>{ if(k.startsWith('prep:'+id+':')||k.startsWith('extra:'+id+':'))delete s.checked[k]; });
    oaKitPut(s);
    try { localStorage.removeItem(BAG_KEY); } catch(e) {}
    oaKitRender();
  };
  window.oaKitFullGuide = () => { const id=oaKitCurrent; oaKitClose(); if(page !== 'chg:'+CAT+':d:'+id)openPage('chg:'+CAT+':d:'+id); };
  document.addEventListener('keydown',e => { if (e.key==='Escape' && oaKitCurrent) oaKitClose(); });

  function sub(key, context, title, lead, inner) {
    const c = PAL[key] || PAL.gear;
    return `<div class="quiet-category hub-page hub-detail" data-overview="${CAT}" data-ss="1" data-oa-page="${key}" style="${yearTheme(CAT)};--ss-bg:${c[0]};--ss-ink:${c[1]}">${detailPageTop(CAT)}`
      + `<div class="dev-area-head ss-head" style="--area:${c[0]};--area-ink:${c[1]}"><span class="dev-area-head-art">${(SHAPE[key] || SHAPE.gear)(c)}</span><p class="hub-context">${F(context)}</p><h1>${F(title)}</h1>${lead ? `<p class="hub-lead">${F(lead)}</p>` : ''}</div>`
      + oaKitEntry(key) + inner + `</div>`;
  }

  /* ---------- the home screen ---------- */
  const PLACES = [
    ['errands', 'Around town', ['Your first trips out', 'A walk, the store, eating out']],
    ['road', 'Road trips', ['Long drives and stops']],
    ['fly', 'Flying', ['Booking, security, the flight']],
    ['away', 'Staying away', ['Family, friends or a hotel']],
    ['abroad', 'Going abroad', ['Passport, shots and water', 'Passport, shots and water', 'Passport, shots, food and water']],
    ['water', 'Pool or beach', ['Shade, and holding on']]
  ];
  const placeSub = (id, subs, v) => {
    if (id === 'away' && v === 2) return moving() ? 'Babyproof it in 10 minutes' : 'Family, friends or a hotel';
    if (id === 'abroad') return subs[eats() ? 2 : 1];
    if (id === 'weather') return season() === 'cold' ? 'Dressing for walks and the car' : 'Heat, sun and the pool';
    return subs[Math.min(v, subs.length - 1)];
  };
  const places = v => `<h2 class="hub-h2">${F('Where are you headed?')}</h2><div class="oa-places">${PLACES.map(([id, label, subs]) => { const c = PAL[id === 'weather' ? season() : id]; return `<button class="oa-place" style="--oa-bg:${c[0]};--oa-ink:${c[1]}" onclick="${open(id)}"><span class="oa-place-art">${SHAPE[id](c)}</span><b>${F(label)}</b><small>${F(placeSub(id, subs, v))}</small></button>`; }).join('')}</div>`;
  // Hot or cold isn't a place, so it's one quiet card for the season, under the places.
  const seasonCard = () => { const k = season(), c = PAL[k]; return `<button class="hub-next oa-season" style="background:${c[0]}" onclick="${open('weather')}"><span><small style="color:${c[1]}">${F('This season')}</small><b>${F(k === 'hot' ? 'Hot days out: shade, drinks and the car' : 'Cold days out: layers and the car seat')}</b></span><span class="hub-chev" aria-hidden="true">›</span></button>`; };
  const GEAR_C = { car: ['#e7effc', '#46638c'], stroller: ['#e6f5ec', '#356651'], carrier: ['#fdeef2', '#a24d6a'], bag: ['#fff3dc', '#8a6a2a'], snack: ['#fdeee6', '#9a5a3c'] };
  const gearRow = (icon, key, title, sub, id, chip) => `<button class="hub-row oa-row" style="--hl-bg:${GEAR_C[key][0]};--hl-ink:${GEAR_C[key][1]}" onclick="${open(id)}"><span class="oa-dot">${hubArt(icon, CAT)}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(sub)}</small>${chip ? `<span class="hub-chip">${F(chip)}</span>` : ''}</span><span class="hub-chev" aria-hidden="true">›</span></button>`;
  function gear(v) {
    const n = bagItems(ageNow()).length, on = bagItems(ageNow()).filter(i => bagGet().includes(i[1])).length;
    return `<h2 class="hub-h2">${F('Your gear')}</h2><div class="hub-list">`
      + gearRow('car', 'car', 'Car seat', 'Setting it up, and which seat when', 'car')
      + gearRow('stroller', 'stroller', 'Stroller', 'Harness, brakes and the right recline', 'stroller')
      + gearRow('carrier', 'carrier', 'Carrier', 'Facing in, facing out, and on your back', 'carry')
      + gearRow('bag', 'bag', 'Diaper bag', 'Packed for how Maya is fed', 'bag', on ? `${on} of ${n} packed` : '')

      + `</div>`;
  }
  // What's new for outings, month by month: [from month, headline, one line, the page it opens].
  // What changes with age in this tab: [month, headline, one line, the page it opens, home row].
  // Only the three gear changes get a home row (see briefing.js): facing out, moving up from the infant seat, and
  // rear-facing past 1. Each depends on the gear's label, so the row says to check it, never that it's time.
  const NOWS = [
    [0, 'Short outings are good for you both', 'Fresh air and a change of scene help you both.', 'errands'],
    [2, 'Ready for a longer trip?', 'As feeds spread out, a long drive or a first flight gets easier.', 'road'],
    [4, 'Ready to face out?', 'Once Maya holds {p} head steady, check your carrier’s limits.', 'carry', ['Ready to face out?', 'Once Maya holds {p} head steady, check your carrier’s limits. Its instructions say when.', 'See the carrier guide']],
    [6, 'Snacks on the go, and {p} first overnight trip', 'The shopping cart’s own seat, snacks out, and babyproofing when you stay over.', 'errands'],
    [9, 'Watch the car seat’s limits', 'Moving to a convertible seat depends on the infant seat’s height and weight limits, printed on a sticker on the seat.', 'car', ['Maya may outgrow the infant car seat soon', 'Many babies do in the first year. The height and weight limits are on a sticker on the seat.', 'See which seat comes next']],
    [12, 'Rear-facing after the first birthday, too', 'Keep {o} rear-facing for as long as the seat allows.', 'car', ['Keep Maya rear-facing after the first birthday', 'Until the seat’s rear-facing limits, often age 2 or older. It protects {p} head and neck best.', 'See why it matters']]
  ];
  // For the home screen: the update for this month, or the one coming next month (so trips can be planned ahead).
  window.oaUpdate = m => { const n = NOWS.find(x => x[4] && (x[0] === m || x[0] === m + 1)); return n ? { soon: n[0] > m, at: n[0], title: F(n[4][0]), body: F(n[4][1]), label: n[4][2], action: open(n[3]) } : null; };
  // The 6-month card is about snacks and the cart seat, so it waits for Feeding's age; the rest go by birthday.
  const due = (n, m) => n[0] <= (n[0] === 6 ? Math.min(m, careAge()) : m);
  const nowFor = m => NOWS.filter(n => due(n, m)).pop();
  const nextFor = m => NOWS.find(n => n[0] > m && !due(n, m));
  function outAndAbout() {
    const m = ageNow(), v = stageFor(m), h = H(), n = nowFor(m), nx = nextFor(m);
    let b = `<header class="hub-hero oa-hero"><p class="hub-eyebrow">${F(m < 1 ? 'In the first weeks' : `At ${m} ${m === 1 ? 'month' : 'months'}`)}</p><h1>${F(n[1])}</h1><p class="hub-lead">${F(n[2])}</p><button class="cc-hero-go oa-hero-go" onclick="${open(n[3])}">${F(n[4] ? n[4][2] : ({ errands: 'See around town', road: 'Plan a longer trip' })[n[3]] || 'See the guide')} ›</button></header>`;
    b += oaKitPinned() + places(v) + seasonCard() + gear(v);
    b += h.versus('In the car', ['Every time', 'Look in the back seat before you walk away.'], ['Never', 'Leave Maya alone in the car, even for a minute.']);
    if (nx) b += h.next(`Coming up around ${nx[0]} months`, nx[1], open(nx[3]));
    // Only when neither the top card nor Coming up already talks about gear limits, so it's never said twice.
    if (!n[4] && !(nx && nx[4])) b += h.note('Car seats, carriers and strollers each have their own height and weight limits. You’ll find them in the manual and on the gear itself.');
    return `<div class="quiet-category hub-page" data-overview="${CAT}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${b}</div>`;
  }

  /* ---------- the diaper bag: tap to tick off, kept on this phone, packed for how Maya is fed ---------- */
  const BAG_KEY = 'ahead-bag';
  // Ticks only last for the day, so the list is always ready for the next outing with no upkeep.
  const today = () => (typeof NOW !== 'undefined' ? NOW : new Date()).toDateString();
  const bagGet = () => { try { const v = JSON.parse(localStorage.getItem(BAG_KEY) || '{}'); return v && v.day === today() && Array.isArray(v.have) ? v.have : []; } catch (e) { return []; } };
  window.oaBagToggle = function (k) {
    let have = bagGet(); have = have.includes(k) ? have.filter(x => x !== k) : have.concat(k);
    try { localStorage.setItem(BAG_KEY, JSON.stringify({ day: today(), have })); } catch (e) { /* the list still works for this visit */ }
    document.querySelectorAll(`.oa-pack[data-k="${k}"]`).forEach(el => { el.classList.toggle('is-on'); el.setAttribute('aria-pressed', el.classList.contains('is-on')); });
    const n = document.querySelector('.oa-pack-count'); if (n) n.textContent = `${document.querySelectorAll('.oa-pack.is-on').length} of ${document.querySelectorAll('.oa-pack').length} packed`;
  };
  window.oaBagReset = function () { try { localStorage.removeItem(BAG_KEY); } catch (e) { /* nothing saved */ } document.querySelectorAll('.oa-pack.is-on').forEach(el => oaBagToggle(el.dataset.k)); };
  function bagItems(m) {
    const f = feed();
    return [
      ['diaper', 'diapers', 'Diapers', m < 6 ? 'One for every 2 hours out, plus 2 spares' : 'One for every 3 hours out, plus 2 spares'],
      ['towel', 'wipes', 'Wipes and a changing pad', 'And a bag for dirty diapers'],
      ['shirt', 'clothes', 'A spare outfit', 'For {o}, and a top for you, for blowouts'],
      ['mouth', 'burp', 'Burp cloths', ''],
      f !== 'Formula' && pumping() ? ['bottle', 'pump', 'Your pump and bottles with lids', 'If you’ll pump while you’re out'] : null,
      f !== 'Formula' && pumps() ? ['fridge', 'pumped', 'Pumped milk in a cooler with ice packs', 'If you’re bringing bottles'] : null,
      f !== 'Formula' && !pumps() ? ['heart', 'cover', 'A nursing cover or scarf', 'Only if you like one'] : null,
      f !== 'Breast milk' ? ['cube', 'formula', 'Formula for each feed, plus one', 'Or powder and water, kept apart'] : null,
      f !== 'Breast milk' ? ['cup', 'bottles', 'Clean bottles', 'One for each feed'] : null,
      m < 12 ? ['pacifier', 'pacifier', 'A pacifier, if {s} {use|uses} one', 'And a spare'] : null,
      ['sun', 'hat', 'A hat', 'Sun hat or warm hat'],
      ['sack', 'layer', 'An extra layer', 'For cold or air-conditioned places'],
      ['hand', 'sanitizer', 'Hand sanitizer', 'For you, before feeds and changes'],
      eats() ? ['bowl', 'snacks', 'Soft snacks and a spoon', ''] : null,
      eats() ? ['drop', 'cup', 'Water in a cup', ''] : null
    ].filter(Boolean);
  }
  function bagList(m) {
    const items = bagItems(m), have = bagGet(), on = items.filter(i => have.includes(i[1])).length;
    return `<section class="hub-card oa-bag"><div class="oa-bag-head"><b class="oa-pack-count">${on} of ${items.length} packed</b><button class="hub-link" onclick="oaBagReset()">Clear ticks</button></div><div class="oa-packs">${items.map(([icon, k, t, s]) => `<button class="oa-pack${have.includes(k) ? ' is-on' : ''}" data-k="${k}" aria-pressed="${have.includes(k)}" onclick="oaBagToggle('${k}')"><span class="oa-pack-art">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}</span><i aria-hidden="true">✓</i></button>`).join('')}</div></section>`;
  }
  // Keeping milk safe on the go, for the family's own feeding method.
  const milkOnTheGo = () => lines([
    nursing() && ['Pumped milk, if you bring some', 'Fine at room temperature for up to 4 hours, or up to 24 hours in a cooler bag with ice packs.'],
    formula() && ['Formula', 'Carry the powder and the water separately and mix when {s’s} hungry. Once mixed, use it within 2 hours, or within 1 hour of starting the feed.'],
  ]);

  /* ---------- the pages ----------
     Every page follows the same pattern as Sleep's and Health's subpages, so the category reads as one piece:
       the colored header (the color of the tile the parent tapped)
       → the key answer as a visual (picture steps, a strip in time order, tiles, or a figure)
       → "Good to know": at most 3 rows
       → "Normal, or time to call?" only where it applies.
     Copy rule: one idea per line. A row is a plain title and one sentence about that title, nothing else.
     A fact lives on one page only:
       Car seat basics: installing, buckling, how long, add-ons, outgrowing it. Cold days: coats and blankets in the car seat.
       Stroller basics: shade and blankets over the stroller. Diaper bag: mixing and keeping milk. Errands: snacks out, the shopping cart.
       Road trips: stops. Staying away: a new place. Going abroad: what's different outside the US. */
  const tiles = (heading, ts) => `<h2 class="hub-h2">${F(heading)}</h2>${H().tiles(ts.filter(Boolean))}`;
  const steps = (items, caption, numbered = false) => hubIconSteps(items.filter(Boolean), CAT, F(caption), numbered);
  const strip = (title, items, caption) => hubStageStrip({ title, items: items.filter(Boolean), numbered: true, cat: CAT, caption });
  // The same timeline as Road trips' example drive, with words ("When you book") where the drive has clock times.
  const timeline = (title, items, caption) => { const c = YEAR_PALETTES[CAT]; return `<figure class="hub-figure hub-daymarks oa-timeline" role="img" aria-label="${F(caption)}" style="--ink:${c.ink};--bg:${c.bg};--pale:${c.pale}"><b class="hub-fig-title">${F(title)}</b><ol class="hub-daymarks-list">${items.filter(Boolean).map(([when, icon, text]) => `<li><i>${hubArt(icon, CAT)}</i><time>${F(when)}</time><span>${F(text)}</span></li>`).join('')}</ol></figure>`; };
  const good = (rows, heading = 'Good to know') => { const r = rows.filter(Boolean).slice(0, 3); return r.length ? H().list(heading, r.map(([icon, title, s]) => H().row({ icon, cat: CAT, title, sub: s }))) : ''; };
  const calls = (a, b) => H().versus('When to call', a, b);

  /* Every place page follows one layout, modeled on Road trips, so the tab reads as one piece:
       header → "Plan your …" (an example plan, in order) → "Pack for this" (only the extras on top of the everyday bag)
       → "When things don’t go to plan" (two to four what-ifs) → "Good to know" (at most 3). Going abroad adds "When to call".
     Gear pages: header → the one picture or steps → "Good to know". Written for every family: with or without a car,
     however the baby is fed. A fact lives on one page only. */
  const pack = items => { const it = items.filter(Boolean); if (oaKitData[oaTripRendering]) oaKitExtras[oaTripRendering] = it; return it.length ? `<section class="oa-extra"><b>${F('Pack for this')}</b><small>${F('On top of your everyday diaper bag')}</small><ul>${it.map(([icon, t, s]) => `<li><span class="oa-extra-art">${hubArt(icon, CAT)}</span><span><b>${F(t)}</b>${s ? `<small>${F(s)}</small>` : ''}</span></li>`).join('')}</ul></section>` : ''; };
  const ifs = (items, caption, heading = 'When things don’t go to plan') => `<h2 class="hub-h2">${F(heading)}</h2>` + steps(items, caption);
  const plan = (title, items, caption) => timeline(title, items, caption);

  // Staying away: the setup is a checklist, ticked off in each new place. Ticks are kept on this phone; "Start over" clears them.
  const AWAY_KEY = 'ahead-away';
  const awayItems = m => [['Ask for a crib, or bring a play yard', 'Most hotels have one. Ask when you book', 'notepad'], ['Check the crib, then empty it', 'No loose or missing parts. Away from windows and cords', 'crib'], m >= 6 ? ['Medicines and cleaners up high', 'Cords and small things too, at {p} level. Block any stairs', 'lock'] : ['Bags with medicines up high', 'Yours and everyone else’s', 'bag'], m >= 6 ? ['Bathroom doors closed', 'And an adult right beside {o} near any water', 'bath'] : null, ['Same bedtime as at home', 'The same steps, in {p} own sleep sack', 'clock']].filter(Boolean);
  window.oaAwayTick = i => { let on = []; try { on = JSON.parse(localStorage.getItem(AWAY_KEY)) || []; } catch (e) {} on = on.includes(i) ? on.filter(x => x !== i) : on.concat(i); try { localStorage.setItem(AWAY_KEY, JSON.stringify(on)); } catch (e) {} const y = scrollY; render(); scrollTo(0, y); };
  window.oaAwayReset = () => { try { localStorage.removeItem(AWAY_KEY); } catch (e) {} const y = scrollY; render(); scrollTo(0, y); };
  const awayList = m => { let on = []; try { on = JSON.parse(localStorage.getItem(AWAY_KEY)) || []; } catch (e) {} return `<div class="oa-away-head"><h2 class="hub-h2">${F('Set up your stay')}</h2>${on.length ? `<button class="hub-link" onclick="oaAwayReset()">${F('Start over')}</button>` : ''}</div>` + H().ticks(awayItems(m), i => on.includes(i), i => `oaAwayTick(${i})`, CAT); };

  function detail(id) {
    oaTripRendering = id;
    const m = ageNow(), bf = nursing(), fm = formula();
    const feedLine = bf && fm ? 'Nurse or give a bottle, wherever you’re comfortable.' : bf ? 'Nurse wherever you’re comfortable, or give a bottle of pumped milk.' : 'Give a bottle where you are. Formula doesn’t need warming.';

    if (id === 'errands') return sub('errands', 'Around town', m < 2 ? 'Your first trips out' : 'Short trips, home whenever you like', 'A walk, the store, a restaurant or a friend’s. One or two stops is plenty, and leaving early still counts.',
      ifs([
        ['clock', 'Feed first', 'Right after a feed is the calmest stretch'],
        ['car', 'Any car, {p} own seat', 'Even a taxi or a friend’s car'],
        ['carrier', 'Hands free', 'A carrier, even with the stroller'],
        eats() ? ['highchair', 'Snacks in a high chair', 'Strap on, and you right there'] : ['home', 'Home whenever', 'Before the next nap, or sooner']],
        'Feed first. In any car the baby rides in their own car seat. A carrier keeps your hands free. Head home whenever you like.', 'Plan your outing')
      + ifs([
        ['bottle', 'Hungry while you’re out', feedLine],
        ['heart', 'Crying in public', 'Step outside, or walk with {o} close.'],
        ['diaper', 'A blowout', 'A family restroom, or your changing pad on a clean flat spot.']],
        'If the baby is hungry, feed them where you are. Crying in public happens to everyone. For a blowout, find a family restroom or use your changing pad.')
      + good([
        ['shield', 'Car seats and shopping carts', eats() ? 'Use the cart’s own seat with the strap on, not the infant seat on top.' : 'An infant seat can tip off the top of a cart. Use a carrier or the stroller.'],
        eats() ? ['bowl', 'Eating out', 'A steady high chair, strapped in and pulled back from the table. Hot food to the middle.'] : ['bowl', 'Eating out', 'The car seat stays on the floor or in the stroller, never on top of a high chair.'],
        bf && pumps() ? ['fridge', 'Pumped milk', 'Fine cool or at room temperature. No need to warm it.'] : null,
        eats() ? ['bag', 'Bring {p} own food', 'Something soft from home, a bib and a spoon. A placemat keeps the tray clean.'] : ['hand', 'Holding {o}', 'It’s fine to ask people to wash their hands first, or to say no.']]));

    if (id === 'road') return sub('road', 'Road trips', 'Long drives with Maya', 'Plan a stop every 2 hours to feed, change and stretch.',
      hubDayMarkers({ title: 'Plan your drive', events: [[9 * 60, 'car', 'Leave as a nap starts'], [11 * 60, 'bottle', 'Stop to feed and change'], [13 * 60, 'mat', eats() ? 'Stop for a snack and a stretch' : 'Stop to feed and stretch'], [15 * 60, 'home', 'Arrive']], from: 8 * 60, to: 16 * 60, cat: CAT, caption: 'Leave at 9 as a nap starts, stop at 11 to feed and change, stop at 1 to feed and stretch, arrive at 3.' })
      + pack([['toy', 'Soft toys only', 'Hard ones can fly in a sudden stop'], fm ? ['bag', 'One extra bottle', 'In case of traffic'] : null])
      + ifs([
        ['heart', 'Crying while you drive', 'Pull over somewhere safe, then take {o} out to soothe or feed.'],
        ['clock', 'Driving on your own', 'Plan a few more stops. Check on {o} only when you’re parked.'],
        ],
        'If the baby cries while you drive, pull over first. On your own, plan more stops and check on the baby only when parked.')
      + good([typeof profile !== 'undefined' && profile.early ? ['steth', 'Born early?', 'Ask your pediatrician how long rides can be.'] : null, ['moon', 'Naps on the road', 'Naps in the car seat are fine while you drive. When you stop, move {o} to a crib or play yard.'], bf ? ['mouth', 'Nursing or pumping on the road', 'Park first. {S} {stay|stays} buckled in whenever the car is moving.'] : null]));

    if (id === 'fly') return sub('fly', 'Flying', 'Flying with Maya', 'Most of the planning happens when you book.',
      H().versus('Where will Maya sit?', ['Own seat', 'Safest, in a car seat labeled for aircraft.'], ['On your lap', 'Often free under 2, but less safe in turbulence.'])
      + plan('Plan your flight', [
        ['When you book', 'notepad', 'Add {o}, ask about a bassinet seat, and check the car seat says “aircraft” in red.'],
        ['At security', 'bag', bf && !fm && !pumps() ? 'Nothing extra for nursing. If you bring pumped milk, tell the officer.' : bf && !fm && !pumping() ? 'Breast milk can go through, even more than 3.4 oz. Tell the officer.' : bf && !fm ? 'Pumped milk and your pump can go through. Tell the officer.' : !bf ? 'Formula and water can go through. Tell the officer.' : pumping() ? 'Milk, formula and your pump can go through. Tell the officer.' : 'Breast milk and formula can go through. Tell the officer.'],
        ['At the gate', 'stroller', 'Gate-check the stroller. It waits at the plane door.'],
        ['Takeoff and landing', 'plane', 'Out of the carrier, then ' + (bf && !fm && how() === 'Nursing' ? 'nurse {o} or offer a pacifier.' : 'a feed or a pacifier for {p} ears.')],
        ['After you land', 'clock', 'Short trip? Keep naps on home time. Longer? Shift them a little each day.']],
        'When you book, add the baby, ask about a bassinet seat and check the car seat is certified for aircraft. Milk, formula and your pump can go through security. Gate-check the stroller. At takeoff and landing, take the baby out of the carrier and feed or offer a pacifier. After landing, keep naps on home time for short trips, or shift them a little each day.')
      + pack([fm ? ['bottle', 'One extra bottle', 'In case of delays'] : null, ['diaper', 'Diapers for the trip, plus extra', 'At least one more than you think, for delays'], ['shirt', 'A change of clothes', 'For {o}, and a top for you, in your carry-on'], eats() ? ['bowl', 'Snacks {s} already eats', 'Soft and easy, for delays'] : null, m >= 3 ? ['drop', 'Medicine you might need', 'A fever reducer your pediatrician has OK’d, with its syringe'] : ['chat', 'Your pediatrician’s number', 'Under 3 months, any fever means calling them first'], ['book', 'Proof of {p} age', 'Like {p} birth certificate, for a lap seat']])
      + ifs([
        ['heart', 'Crying on board', 'Walk the aisle or offer a feed. Most people understand.'],
        ['hand', 'A diaper change', 'Ask the crew which restroom has the fold-down table.']],
        'If the baby cries, walk the aisle or offer a feed. Ask the crew which restroom has a changing table.')
      + (m < 2 ? good([['steth', 'Flying in the first weeks', 'Ask your pediatrician first.']]) : ''));

    if (id === 'abroad') return sub('abroad', 'Going abroad', 'Going abroad with Maya', 'Plan the flight as usual, then add these steps. The passport comes first.',
      plan('Plan your trip', [
        ['As soon as you book', 'notepad', 'Apply for {p} passport. It can take weeks.'],
        ['4–6 weeks before', 'steth', 'Ask your pediatrician about shots, including an early measles shot from 6 months.'],
        ['Before you leave', 'home', 'Save how you’d find a doctor there.']],
        'Apply for the passport as soon as you book. Four to six weeks before, ask the pediatrician about shots. Before you leave, save how you would find a doctor there.')
      + pack([['thermo', 'A thermometer', 'And the medicines your pediatrician okays'], ['drop', 'Rehydration salts', 'Ask your pediatrician which kind'], ['car', '{P} car seat', 'Taxis abroad may not have one']])
      + tiles('While you’re there', [['Water', 'Sealed bottled, or boiled', fm ? 'For formula, your drinks and washing bottles' : 'For your drinks, and for washing bottles'], ['Mosquitoes', 'Netting', 'Over the crib and stroller'], ['Food', 'Cooked, or fruit you peel', 'Once {s’s} eating solids'], ['Drinks', 'No ice', 'It’s often made with tap water']])
      + good([['chat', 'If one parent can’t come', 'They sign a notarized consent form for the passport appointment instead.']])
      + calls(['Call a doctor', 'A fever, fewer wet diapers, a dry mouth, or diarrhea that keeps going.'], ['Get care right away', m < 3 ? 'Any fever under 3 months or in a malaria area, trouble breathing, or hard to wake.' : 'Any fever in a malaria area, trouble breathing, or hard to wake.']));

    if (id === 'away') return sub('away', 'Staying away', 'Staying with family or in a hotel', 'Most homes and hotel rooms aren’t set up for babies. Ten minutes when you arrive covers most of it.',
      awayList(m)
      + pack([['sack', '{P} sleep sack', 'It smells like home'], ['home', 'The play yard’s own sheet', 'Only the one made for it'], ['star', 'A night light', 'For feeds in a dark, new room']])
      + ifs([
        ['moon', 'A rough first night', 'New places can unsettle sleep. A few off nights are normal.'],
        ['heart', 'Well-meant advice', 'Share one rule kindly: on {p} back, in a bare crib.']],
        'A few off nights are normal. If you get advice, share one rule kindly: on the back, in a bare crib.')
      + good([['shield', 'Which crib is safe?', 'A play yard, or a crib made after June 2011. Never an adult bed or a couch.'], ['hand', 'Pets', 'Never leave {o} alone with a pet, even a gentle one.'], eats() ? ['bowl', 'Grandparents and treats', 'Share your food rules once, kindly, before the first meal.'] : null]));

    if (id === 'water') return sub('water', 'Pool or beach', 'A day by the water', 'Babies get cold and overheat faster than you do, so short visits work best.',
      todo('In the water', 'Hold {o} the whole time. Floats don’t stop drowning.')
      + ifs([
        ['clock', 'Go early', 'Before the strongest sun'],
        ['sun', 'Shade first', m < 6 ? 'An umbrella or canopy, and a hat' : 'Plus a hat and sunscreen'],
        ['home', 'Home before the nap', 'After a feed in the shade']],
        'Go early, before the strongest sun. Set up in the shade. Feed in the shade, then head home before the nap.', 'Plan your day by the water')
      + pack([['diaper', 'Swim diapers', 'Most pools ask for one'], ['towel', 'A hooded towel', 'For warming up after a dip'], m >= 6 ? ['shield', 'Sunscreen', ''] : null])
      + ifs([
        ['snow', 'Shivering or blue lips', 'Out of the water. Dry and wrap {o} up.'],
        ['thermo', 'Flushed and fussy', 'Move to the shade and offer a feed.']],
        'If the baby shivers or their lips turn blue, take them out and wrap them up. If flushed and fussy, move to the shade and feed.')
      + good([['hand', 'Hot sand and decks', 'They can burn little feet. Keep shoes or a blanket handy.']]));

    if (id === 'weather') {
      const view = weatherView || season();
      const seg = `<div class="hub-seg oa-seg" role="tablist">${[['hot', 'Hot days'], ['cold', 'Cold days']].map(([k, t]) => `<button role="tab" aria-selected="${view === k}" class="${view === k ? 'is-on' : ''}" onclick="oaWeather('${k}')">${t}</button>`).join('')}</div>`;
      const hot = `<h2 class="hub-h2">${F('What to do')}</h2>` + steps([['clock', 'Go out early or late', 'When it’s cooler out'], m < 6 ? ['sun', 'Shade, not sunscreen', 'Only if there’s no shade: a little on the face'] : ['sun', 'Sunscreen', 'SPF 30 or more, every 2 hours'], ['bottle', 'Keep {o} hydrated', !eats() ? 'With extra milk feeds' : 'With extra milk feeds and sips of water'], ['car', 'Cool the car first', 'Then touch the car seat buckles: they can burn']], 'Go out early or late, keep {o} in the shade, keep {o} hydrated with extra milk feeds, and cool the car first.')
        + good([['thermo', 'How hot is too hot?', 'When the heat index is 90°F or more, keep outings short or stay in.'], m >= 2 ? ['leaf', 'Bug spray, from 2 months', 'Up to 30% DEET, or picaridin. Spray your hands, then rub it on {p} skin, not {p} hands.'] : ['leaf', 'Bug spray, from 2 months', 'Not yet. Until then, use netting over the stroller.'], ['fridge', 'Milk on hot days', 'Keep it in a cooler with ice packs, never in a hot car.']])
        + calls(['Call your pediatrician', 'Any sunburn, or fewer wet diapers than usual.'], ['Call 911', 'Hot to the touch and floppy or hard to wake.']);
      const cold = `<h2 class="hub-h2">${F('What to do')}</h2>` + steps([['clock', 'Warm up the car first', 'Before you buckle {o} in'], ['car', 'In the car seat', 'Thin layers, then a blanket over the buckled straps'], ['shirt', 'One more layer on walks', 'Plus a hat and mittens'], ['hand', 'Check if {s’s} warm enough', 'Feel {p} chest. Cold hands are normal']], 'Warm up the car first. In the car seat, thin layers with a blanket over the buckled straps. On walks, one more layer than you. Feel {p} chest to check {s’s} warm enough.')
        + good([['snow', 'Very cold or windy?', 'Keep walks short, or stay in.'], ['carrier', 'In a carrier', 'Your coat can go over you both, with {p} face uncovered.'], ['home', 'Once you’re somewhere warm', 'Take off {p} hat and extra layers, so {s} {don’t|doesn’t} overheat.']])
        + calls(['Call your pediatrician', 'Skin that’s pale, gray or blistered after being out in the cold.'], ['Call 911', 'Cold to the touch and floppy or hard to wake.']);
      return sub(view, 'Hot and cold days', view === 'hot' ? 'Hot days out' : 'Cold days out', view === 'hot' ? 'Babies heat up faster than you do.' : 'Babies lose heat faster than you do.',
        seg + (view === 'hot' ? hot : cold));
    }

    // Car seat: one page from birth past the first birthday. Next car seat and rear-facing after 1 live here now.
    if (id === 'car' || id === 'bigger' || id === 'after1') {
      const install = `<h2 class="hub-h2">${F('Setting it up')}</h2>` + steps([['lock', 'Pick one way to install it', 'Lower anchors or the seat belt, not both'], ['back', 'Set the recline', 'To the angle line on the seat'], ['hand', 'Check it’s tight', 'Tug where it’s belted in: less than 1 inch of movement'], ['shield', 'Buckle {o} in snugly', 'Harness straps at or below {p} shoulders']], 'Install it with the lower anchors or the seat belt, not both. Set the recline to the angle line, then tighten it so it moves less than 1 inch where it’s belted. Buckle the straps at or below the shoulders.', true);
      // One page for the whole first year and beyond: no stages, so the seat-by-seat path shows from day one,
      // and Good to know holds what's true at any age. The home's "Coming up" card points back here when the limits matter.
      return sub('gear', 'Your gear', 'Car seat basics', 'A quick check before every drive keeps {o} as safe as possible.',
        hubFigure('carseat', CAT, 'Rear-facing in the back seat, chest clip level with the armpits, straps snug with no slack to pinch, and no puffy coat underneath.')
        + install
        + timeline('Which seat, and when', [['From birth', 'car', 'An infant seat, rear-facing.'], ['At its limit', 'sit', 'A convertible seat, still rear-facing.'], ['Often age 2 or older', 'stand', 'Forward-facing, after its rear-facing limits.']], 'An infant seat rear-facing from birth, a convertible seat still rear-facing once the infant seat’s limit is reached, and forward-facing only after its rear-facing limits, often age 2 or older.')
        + good([['road', 'Taxis and other people’s cars', 'Bring {p} car seat. Most can be installed with just the seat belt.'], ['notepad', 'Only what came with it', 'Skip add-on inserts and head supports, and use a secondhand seat only if you know its history.'], ['steth', 'A free check', 'A certified car seat technician can check your install, usually for free.']]));
    }

    // Carrier and stroller follow Car seat: the same page at every age, with how it changes shown as a path from day one.
    if (id === 'carry') return sub('gear', 'Your gear', 'Carrier basics', 'A quick check every time keeps {o} breathing easy.',
      hubFigure('carrier', CAT, 'In a carrier: face visible and close enough to kiss, chin off the chest, knees up in an M shape, back supported.')
      + timeline('Ways to carry, as {s} {grow|grows}', [['From birth', 'carrier', 'Facing in, face above the fabric.'], ['Head steady', 'eye', 'Facing out, for short awake times, within the carrier’s limits.'], ['Sits steadily', 'back', 'On your back, within the carrier’s limits.']], 'Facing in from birth. Facing out once the head is steady, for short awake times, within the carrier’s limits. On your back once sitting steadily.')
      + good([['hand', 'Snug enough', 'When you lean forward, {s} {stay|stays} against you without slumping.'], ['moon', 'Asleep in the carrier', 'Move {o} to a flat bed when you can.'], ['cup', 'Away from the stove', 'And from hot drinks, while {s’s} in the carrier.']]));

    if (id === 'stroller') return sub('gear', 'Your gear', 'Stroller basics', 'A quick check each outing keeps {o} snug and the stroller steady.',
      hubFigure('stroller', CAT, 'Harness on every time, brakes on when you stop, no bags on the handles and no blanket over the top.')
      + timeline('Lying back, then sitting up', [['From birth', 'stroller', 'Lying back, or with the infant car seat clicked on.'], ['Sits steadily', 'back', 'Sitting up, if the stroller’s instructions allow it.']], 'Lying back from birth, or with the infant car seat clicked on. Sitting up once the baby sits steadily, if the stroller allows it.')
      + good([['car', 'A car seat on the frame', 'Listen for the click, then tug to check it’s locked on.'], ['hand', 'On a bus or train', 'Brakes on and a hand on the stroller while it moves.']]));

    if (id === 'bag') return sub('gear', 'Your gear', 'Packing the diaper bag', 'Everything Maya needs for a few hours out, packed for how {s} {is} fed.',
      bagList(m) + good([fm && ['clock', 'Formula you’ve made up', 'Use it within 2 hours of mixing, or within 1 hour once the feed starts.'], bf && pumps() && ['snow', 'Pumped milk', 'Keeps 4 hours at room temperature, or a day in a cooler with ice packs. Once a feed starts, use it within 2 hours.']]));

    if (id === 'sick') return detail('abroad');
    if (id === 'snacks') return detail('errands');
    return null;
  }
  window.oaWeather = function (k) { weatherView = k; const y = scrollY; render(); scrollTo(0, y); };

  /* ---------- routes ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen, a] = p.split(':');
    if (cat === CAT && screen === 's') return outAndAbout();
    if (cat === CAT && screen === 'd') { const pg = detail(a); if (pg) return pg; }
    return baseRoute(p);
  };
})();
