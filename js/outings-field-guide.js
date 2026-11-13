/* Ahead · Outings & Travel field guide.
   The original guides and every original fact remain accessible via :original: routes.
   Design principle: a destination opens to the decision, the trip in order, and
   just-in-time reassurance. No setup flow, checklist theater or duplicate planning. */
(function () {
  'use strict';
  const CAT='Out and about';
  const F=s=>window.__hub.F(String(s));
  const mNow=()=> typeof isCurrent==='function'&&!isCurrent()?month:actualMonth();
  const care=()=>typeof hubAgeFor==='function'?hubAgeFor('care',mNow()):mNow();
  const nm=()=>name();
  const feeds=()=>profile.feed||'Breast milk';
  const early=()=>!!profile.early;
  const newFood=()=>typeof answers==='object'&&answers.solids==='Yes';
  const go=id=>"openPage('chg:Out and about:v3:"+id+"')";
  const original=id=>"openPage('chg:Out and about:original:"+id+"')";
  const season=()=>(typeof NOW!=='undefined'?NOW:new Date()).getMonth()>=10||(typeof NOW!=='undefined'?NOW:new Date()).getMonth()<=2?'cold':'warm';
  const esc2=s=>esc(String(s));
  const pic=(id)=>{
    const art={
      errands:'<rect x="30" y="53" width="86" height="68" rx="12" fill="#F1C9AE"/><path d="M30 65 73 30l43 35" stroke="#BE927E" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><rect x="63" y="80" width="23" height="41" rx="8" fill="#FFF8F0"/><path d="M183 82h60l-10 39h-54Z" fill="#BDCFB7"/><circle cx="184" cy="125" r="10" fill="#6C8276"/><circle cx="232" cy="125" r="10" fill="#6C8276"/><path d="m189 82-6-17h-20" stroke="#778C7D" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="206" cy="65" r="14" fill="#DAB7A4"/><path d="M196 65q9-17 19-4" fill="#9A7466"/><path d="M162 85q-3-12-16-14" stroke="#B5A18E" stroke-width="3" fill="none" stroke-linecap="round"/>',
      road:'<path d="M0 123q64-45 121-10 65-42 199 7v34H0Z" fill="#BDD0BE"/><path d="M0 149q76-12 145-1t175 0" stroke="#F7F3EB" stroke-width="4" stroke-dasharray="12 12" fill="none"/><path d="M79 96h19l16-18h63l20 18h18q14 0 14 14v15H65v-13q0-16 14-16Z" fill="#D6A48E"/><path d="m112 95 12-13h45l13 13Z" fill="#F5E6D9"/><circle cx="96" cy="124" r="15" fill="#697B76"/><circle cx="195" cy="124" r="15" fill="#697B76"/><circle cx="96" cy="124" r="6" fill="#EDEEE6"/><circle cx="195" cy="124" r="6" fill="#EDEEE6"/><circle cx="264" cy="41" r="14" fill="#E4B990" opacity=".75"/>',
      fly:'<path d="M18 111q75-40 148-8t139-20" fill="none" stroke="#A7BFC5" stroke-width="3" stroke-dasharray="4 10" stroke-linecap="round"/><path d="m139 70 57-14 54-41 18 6-30 48 40 23-3 10-62-12-27 35-10-2 12-43-53 4Z" fill="#9ABAC2"/><path d="m207 69 38-32" fill="none" stroke="#E8F1F0" stroke-width="4" stroke-linecap="round"/><path d="M40 54q9-20 26-8 14-10 25 3 17-4 22 14H39q-9-5 1-9Z" fill="#FDFDFB"/><path d="M244 120q15-20 31-5 15-8 24 7h-55Z" fill="#FDFDFB"/><circle cx="78" cy="26" r="5" fill="#DEB5A7"/>',
      away:'<path d="m55 75 88-60 89 60v69H55Z" fill="#D7B4C3"/><path d="m50 75 93-63 94 63" fill="none" stroke="#AD879F" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><rect x="84" y="87" width="110" height="41" rx="8" fill="#FAF4E9"/><path d="M91 95h96m-96 10h96m-96 10h96" stroke="#C3B3AB" stroke-width="3"/><path d="M88 87v45m102-45v45" stroke="#AE9B99" stroke-width="5"/><circle cx="264" cy="34" r="14" fill="#F4E0B8"/><path d="M261 25q-9 9 0 18" stroke="#D9C090" stroke-width="2.5" fill="none"/>',
      water:'<path d="M0 132q23-13 46 0t46 0 46 0 46 0 46 0 46 0 44 0v30H0Z" fill="#9CC3CC"/><path d="M20 142q22-10 44 0t44 0 44 0" stroke="#F6F8F3" stroke-width="4" fill="none"/><path d="M132 116V43" stroke="#B78D76" stroke-width="6" stroke-linecap="round"/><path d="M132 42q59-10 81 42H52q20-52 80-42Z" fill="#E6B29F"/><path d="m132 43-36 41m36-41 31 41" stroke="#F8E5D8" stroke-width="4"/><ellipse cx="240" cy="104" rx="32" ry="21" fill="#DBB59D"/><circle cx="240" cy="75" r="19" fill="#DBB59D"/><path d="M236 72h.1m12 0h.1" stroke="#7E6355" stroke-width="3" stroke-linecap="round"/>',
      abroad:'<circle cx="147" cy="81" r="64" fill="#B9D5C6"/><path d="M91 68q23-18 43-12l15 28-18 17-19-5-14 18m86-83-9 33-21 5 7 19 35 7" fill="#8BB4A2"/><ellipse cx="147" cy="81" rx="27" ry="64" fill="none" stroke="#F7FAF3" stroke-width="3"/><path d="M83 81h128" stroke="#F7FAF3" stroke-width="3"/><path d="m238 49 34-14 20 4-29 19 18 12-4 7-31-9-16 12-4-3 7-18-20-6Z" fill="#D4A38F"/><path d="M219 99q20-11 38 1" fill="none" stroke="#D4A38F" stroke-dasharray="3 7" stroke-width="3"/>'
    };
    return '<svg class="ot-picture" viewBox="0 0 320 166" role="img" aria-label="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'
      +'<ellipse cx="161" cy="145" rx="126" ry="9" fill="#A78F85" opacity=".08"/>'
      +'<circle cx="288" cy="28" r="30" fill="#FFFFFF" opacity=".55"/>'
      +(art[id]||art.errands)+'</svg>';
  };
  const COLORS={errands:['#F7E5DB','#925B46'],road:['#E8EFE6','#536F64'],fly:['#E7F0F1','#4B7480'],away:['#F2E9F0','#836781'],water:['#E4F0F4','#467A8A'],abroad:['#E7F1E9','#527B66']};
  const titles={errands:'Around town',road:'Road trips',fly:'Flying',away:'Staying away',water:'Pool or beach',abroad:'Going abroad'};
  const subs={errands:'Walks, errands, coffee and visits',road:'Long drives, stops and naps',fly:'Booking, airport and onboard',away:'Family, friends and hotels',water:'Shade, swimming and safe play',abroad:'Documents, health and care'};
  const tile=(id,featured=false)=>{
    const c=COLORS[id];
    return '<button class="ot-tile'+(featured?' ot-tile-feature':'')+'" style="--tile:'+c[0]+';--tone:'+c[1]+'" onclick="'+go(id)+'">'
    +(featured?'<span class="ot-smallhead">'+F('An easy place to start')+'</span>':'')
    +'<span class="ot-tile-pic">'+pic(id)+'</span><span class="ot-tile-copy"><b>'+F(titles[id])+'</b><small>'+F(subs[id])+'</small></span><span class="ot-chevron" aria-hidden="true">↗</span></button>';
  };
  const row=(id,label,desc)=>'<button class="ot-link" onclick="'+original(id)+'"><span><b>'+F(label)+'</b><small>'+F(desc)+'</small></span><span aria-hidden="true">›</span></button>';
  function discover(){
    const m=mNow(),ca=care();
    if(m<2)return ['Outings can be short and simple','A breath of fresh air, one stop, then home when you’re ready. There’s no need to make a whole day of it.'];
    if(m<5)return ['A little more room to explore','As routines become familiar, try a longer walk or visit. Leave space for feeds and naps.'];
    if(m>=9)return ['A bigger reach changes new places','Before visiting family or staying away, look for cords, medicines and small objects within reach.'];
    if(ca>=6&&newFood())return ['Meals can leave the house, too','Pack a familiar, safely prepared food and a cup alongside the milk feeds Maya already knows.'];
    if(m<9)return ['New places are part of the fun','You can bring your familiar feeding and sleep routines into an unfamiliar place. They do not need to run perfectly.'];
    return ['New places become part of the day','Your usual feeding and sleep routines can come with you. They do not need to run perfectly.'];
  }
  function home(){
    const m=mNow(),d=discover(),ca=care();
    const weather=season()==='cold'?'Cold days and car seats':'Hot days out with Maya';
    const wdesc=season()==='cold'?'Thin layers under the harness. Blanket over the buckled straps.':'Shade, cool car seats, and staying comfortable.';
    return '<div class="quiet-category hub-page ot-page ot-home" data-overview="'+CAT+'" style="'+yearTheme(CAT)+'">'
      +monthlyPageHeader(CAT)
      +'<section class="ot-home-hero"><div class="ot-eyebrow">'+F('OUTINGS & TRAVEL · '+(m===0?'NEWBORN':m+' MONTHS'))+'</div>'
      +'<h1>'+F('A little more of the world.')+'</h1><p>'+F('A practical guide to leaving the house with Maya, from the first walk to a long flight.')+'</p>'
      +'<div class="ot-home-art">'+pic('errands')+'</div>'
      +'<div class="ot-discovery"><small>'+F('GOOD TO KNOW AT THIS STAGE')+'</small><b>'+F(d[0])+'</b><span>'+F(d[1])+'</span></div></section>'
      +'<section class="ot-section ot-choose"><div class="ot-sec-head"><div class="ot-kicker">'+F('CHOOSE YOUR OUTING')+'</div><h2>'+F('Where are you headed?')+'</h2></div>'
      +'<div class="ot-featured">'+tile('errands',true)+'</div>'
      +'<div class="ot-tile-grid">'+tile('road')+tile('fly')+tile('away')+tile('water')+'</div>'
      +'<div class="ot-extra-destination">'+tile('abroad')+'</div></section>'
      +'<section class="ot-section ot-extra"><div class="ot-sec-head"><div class="ot-kicker">'+F('READY FOR THE DAY')+'</div><h2>'+F('Little things to bring along')+'</h2></div>'
      +'<div class="ot-care-links">'+row('bag','Your diaper bag','Packed for how Maya is fed')+row('car','Car seat basics','Harness, recline and moving up')+row('carry','Carrier basics','Facing in, head position and comfort')+row('stroller','Stroller basics','Harness, brakes and when to sit up')+'</div>'
      +'<button class="ot-weather" onclick="'+original('weather')+'"><span><small>'+F('THIS SEASON')+'</small><b>'+F(weather)+'</b><em>'+F(wdesc)+'</em></span><span aria-hidden="true">›</span></button>'
      +'</section></div>';
  }
  function data(id){
    const m=mNow(),f=feeds(),breast=f!=='Formula',formula=f!=='Breast milk',meal=care()>=6&&newFood();
    const milk=breast&&formula?'Breast milk and formula':formula?'Formula':'Breast milk';
    const feedLine=breast&&formula?'Nurse or offer a bottle wherever you are.':breast?'Nurse when Maya is hungry. You can offer pumped milk if you bring it.':'Offer a bottle when Maya is hungry. You do not need to warm formula.';
    const k= {
      errands:{
        title:'A little outing is enough',lead:'A walk, the store or a coffee. You don’t need a perfect schedule—or a full day out.',
        label:'THE EASIEST WAY TO START',focus:'Plan one stop, not a whole day.',why:'Leaving just after a feed often buys you a calm stretch. If things change, you can head home or feed where you are.',
        moments:[
          ['Before you leave','Start with the basics','Feed Maya, pack a spare outfit and pick one place. A stroller or carrier can make the trip easier.'],
          ['While you’re there','Follow Maya’s cues',feedLine+' Crying in public is okay; stepping outside for a reset is okay too.'],
          ['When you get home','A short trip counts','A 20-minute outing is still practice. You can try a little longer another day.']
        ],
        ask:[
          ['What if Maya cries in public?','Keep feeding and comforting her as you normally would. Take a break somewhere quieter if that helps. There’s no need to stay.'],
          ['Where can I change a diaper?','Look for a changing table or use your changing pad on a clean, secure, flat surface while keeping a hand on Maya.'],
          ['Can the infant car seat sit on a shopping cart?','No. Never balance an infant car seat on the top of a cart. Use the stroller or a carrier.']
        ],
        pack:[['Diapers, wipes and a change of clothes','The essentials for one unplanned delay.'],[meal?'A familiar soft snack and a cup':'Milk-feeding supplies','Bring what Maya already uses, based on the length of your outing.']],
        extra:meal?'If eating out, use a stable high chair with a harness and supervise every bite.':'At a restaurant, keep the car seat on the floor or use the stroller—never perch it on a high chair.',
        source:['AAP · Car seat safety','https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Car-Safety-Seats-Information-for-Families.aspx']
      },
      road:{
        title:'A road trip with Maya',lead:'The drive can flex around feeds, stretches and a good long stop.',
        label:'THE ONE THING TO PLAN',focus:'Build breaks into the drive.',why:'For daytime trips, plan to stop roughly every 2–3 hours, and sooner if Maya needs you. Feed and take her out of the car seat while parked.',
        moments:[
          ['Before you go','Start with the car seat','Rear-facing, at the right angle, with the harness snug. Pack soft toys and milk supplies within reach for stops.'],
          ['On the road','Stop for Maya, not just gas','Park safely before checking on, unbuckling, soothing or feeding her. A nap in the correctly installed car seat is fine during the drive.'],
          ['When you arrive','A new place to rest','Move Maya to a firm, flat crib or play yard for sleep. Car seats are for travel, not a sleep space after the ride.']
        ],
        ask:[
          ['What if she cries while I’m driving?','Find a safe place to pull over. Never unbuckle her or try to feed while the car is moving.'],
          ['What if I’m driving alone?','Plan a few extra stops. Only look back or check on Maya while parked safely.'],
          ['Maya was born early. Does that change trips?','Ask her pediatrician whether she needs shorter car-seat stretches or other precautions.']
        ],
        pack:[['Soft toys','Hard objects can become projectiles in a sudden stop.'],[formula?'An extra bottle and feeding supplies':'Milk-feeding supplies','Plan for traffic or an extra stop.']],
        extra:'A car nap is okay in transit. Once the drive ends, move Maya to a safe, flat sleep surface.',
        source:['AAP · Long drives with infants','https://www.healthychildren.org/English/tips-tools/ask-the-pediatrician/Pages/Is-it-safe-for-my-baby-to-travel-in-a-car-seat-a-few-hours-at-a-time.aspx']
      },
      fly:{
        title:'Flying with Maya',lead:'There are a few decisions to make before the airport. The rest can happen one step at a time.',
        label:'THE BIG DECISION',focus:'Where will Maya sit?',why:'The safest option is her own ticketed seat with a car seat approved for aircraft use. A lap infant is often permitted under 2, but is less protected in turbulence.',
        compare:[['Own seat','Safest','With an aircraft-approved car seat, properly installed.'],['On your lap','Allowed on many flights','Often lower-cost, but less safe in turbulence.']],
        moments:[
          ['When booking','Check the seat and airline','Add Maya to the booking. Look for the aircraft certification label on her car seat. Ask about strollers and infant bassinet policies.'],
          ['At security','Milk is allowed',formula&&breast?'Breast milk, formula, water for infant feeds and cooling accessories can exceed 3.4 oz. Tell the TSA officer when screening begins.':formula?'Formula, water for infant feeds and cooling accessories can exceed 3.4 oz. Tell the TSA officer when screening begins.':'Breast milk and cooling accessories can exceed 3.4 oz. Tell the TSA officer when screening begins.'],
          ['At the gate','Sort out the stroller','Ask your airline where it can be checked and where to collect it. Policies vary.'],
          ['On the plane','Comfort is the plan','Offer a feed or pacifier during takeoff and landing if Maya wants one. During turbulence, keep her secured as instructed.'],
          ['After landing','Go easy on the routine','A short trip may work on home time. Across time zones, adjust feeds and naps gradually as needed.']
        ],
        ask:[
          ['What if she cries the whole flight?','You can offer a feed, comfort her, or walk briefly when the seat-belt sign is off. You do not have to keep her quiet for others.'],
          ['Where do I change a diaper?','Ask cabin crew which restroom has the fold-down changing table.'],
          ['Can I bring formula or pumped milk?','Yes. In the U.S., these count as medically necessary liquids and may exceed 3.4 oz. Keep them accessible for separate screening.'],
          ['Does Maya need identification?','TSA does not require ID for a baby on a domestic U.S. flight with an adult, but airlines may ask for proof of age. Check their policy.']
        ],
        pack:[['Your carry-on changes','Extra diapers, wipes, a spare outfit for Maya and a top for you.'],[meal?'Familiar safe food and a cup':'Extra feeds','Bring more than the usual number of feeds for possible delays.'],['Proof of age','Ask your airline what it requires for a lap infant.']],
        extra:m<2?'For a very young baby, ask your pediatrician about timing and infection risk before flying.':'Keep familiar snacks or feeds in your carry-on in case boarding or baggage is delayed.',
        source:['AAP · Flying with baby','https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Flying-with-Baby.aspx']
      },
      away:{
        title:'A new place to sleep',lead:'Family’s house or a hotel—it’s easier when the room is ready for Maya before bedtime.',
        label:'FIRST, MAKE THE ROOM SAFE',focus:'Give her a sleep space of her own.',why:'Use a safety-approved crib or play yard with a firm, flat mattress and fitted sheet. No pillows, loose blankets or stuffed animals.',
        moments:[
          ['Before the trip','Confirm the crib','Ask whether the home or hotel has an appropriate crib or play yard. Bring your own if needed.'],
          ['When you arrive','Do a ten-minute room check',care()>=6?'Move medicines, cords, cleaning products and small objects out of reach. Check stairs, bathrooms and furniture.':'Keep medicines and bags out of reach. Check windows, cords and the sleep area.'],
          ['At bedtime','Keep one thing familiar','A familiar sleep sack and a few of your usual bedtime steps can help Maya settle.']
        ],
        ask:[
          ['The first night is rough. Is that normal?','An unfamiliar room can make sleep less settled. Try the same calming steps you use at home.'],
          ['Can Maya sleep in an adult bed?','No. Use her own firm, flat crib or play yard—not an adult bed, couch or armchair.'],
          ['What if grandparents have older gear?','Check that the crib or play yard meets current standards and has no missing parts. Bring your own if uncertain.']
        ],
        pack:[['Sleep sack','Use what Maya normally sleeps in.'],['Appropriate fitted sheet','Only a sheet designed for her crib or play yard.'],['Dim light for night feeds','Useful in an unfamiliar room.']],
        extra:'There’s a room safety checklist you can use when you arrive.',
        source:['AAP · Safe sleep','https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/default.aspx']
      },
      water:{
        title:'A day by the water',lead:'A little splashing, a lot of shade. Small outings are easier on tiny bodies.',
        label:'THE RULE THAT MATTERS MOST',focus:'Hold Maya within arm’s reach.',why:'Stay hands-on in or around the pool. Float toys and inflatable seats do not prevent drowning.',
        moments:[
          ['Before you go','Pick the cooler hours','Avoid the hottest part of the day. Bring shade, hats, swim diapers and a towel.'],
          ['By the water','Stay close, all the time','An adult stays within arm’s reach. Water play can be very brief, with breaks to get warm.'],
          ['After a dip','Dry, warm, feed','Dry Maya, change her out of wet clothes and offer her usual milk feeds.']
        ],
        ask:[
          ['What if Maya shivers?','Take her out of the water, dry her and help her warm up. Seek urgent care for blue lips with breathing trouble or unusual unresponsiveness.'],
          ['Do we need sunscreen?',m<6?'Under 6 months, prioritize shade and covering clothes. Ask a clinician about small amounts on exposed areas when shade isn’t possible.':'Use broad-spectrum SPF 30+ as directed, along with shade, protective clothing and a hat.'],
          ['What about hot sand or decks?','Surfaces can burn bare feet and hands. Put down a blanket or carry her across hot areas.']
        ],
        pack:[['Swim diapers and dry clothes','Bring a spare so you can change promptly.'],['Hooded towel and sun hat','Make it easy to warm up and stay shaded.']],
        extra:'Check the local water conditions and stay within arm’s reach, even in shallow water.',
        source:['AAP · Water safety','https://www.healthychildren.org/English/safety-prevention/at-play/Pages/Water-Safety-And-Young-Children.aspx']
      },
      abroad:{
        title:'Taking Maya abroad',lead:'The passport and travel-health questions come first. After that, the familiar routines travel with you.',
        label:'DON’T LEAVE THIS TO THE LAST WEEK',focus:'Plan the paperwork and health visit early.',why:'Passport processing takes time. A travel-health conversation 4–6 weeks before departure can cover destination risks and vaccine schedules.',
        moments:[
          ['As soon as you book','Sort documents','Apply for Maya’s passport. Check destination entry rules and any consent documents you may need.'],
          ['4–6 weeks ahead','Ask about travel health','Discuss destination-specific vaccines, malaria protection and feeding or water needs. Some schedules change with international travel.'],
          ['Before departure','Know where to find care','Save a local clinic, emergency number and travel insurance details, and plan how to use safe water.'],
          ['While you’re there','Keep the basics familiar','Use safe food and water, protect against insects and bring Maya’s own car seat for transfers.']
        ],
        ask:[
          ['Can Maya get a measles vaccine early?','For some international travel, infants aged 6–11 months may need an early MMR dose. Ask your pediatrician based on destination and age.'],
          ['What water is safe for formula?','Water safety varies by destination. Ask your pediatrician or a travel clinic what to use for preparing feeds and cleaning supplies.'],
          ['What if Maya becomes ill abroad?','Seek local medical advice for fever, dehydration or worsening illness. Trouble breathing or being hard to wake needs urgent attention.']
        ],
        pack:[['Thermometer and approved medicines','Ask your care team which medicines and dosing supplies to bring.'],['Car seat for transfers','Do not assume taxis have an appropriate infant seat.'],['Copies of essential documents','Carry important travel and medical details with you.']],
        extra:'There are also details about food, mosquitoes and passport consent in the complete guide.',
        source:['CDC · Travel safely with children','https://www.cdc.gov/yellow-book/hcp/family-travel/traveling-safely-with-infants-and-children.html']
      }
    };
    return k[id];
  }
  const fact=(d,id)=>'<section class="ot-keyfact"><div class="ot-kicker">'+F(d.label)+'</div><h2>'+F(d.focus)+'</h2>'
      +(d.compare?'<div class="ot-compare">'+d.compare.map((x,i)=>'<div class="ot-comparison'+(i===0?' best':'')+'"><small>'+F(x[0])+'</small><b>'+F(x[1])+'</b><span>'+F(x[2])+'</span></div>').join('')+'</div>':'')
      +'<p>'+F(d.why)+'</p></section>';
  const timeline=d=>'<section class="ot-section ot-path"><div class="ot-sec-head"><div class="ot-kicker">'+F('STEP BY STEP')+'</div><h2>'+F(d.moments.length>3?'Your trip, in order':'How the outing goes')+'</h2><p>'+F('Know what to do at each point, without planning every minute.')+'</p></div>'
    +'<div class="ot-steps">'+d.moments.map((x,i)=>'<details class="ot-step"'+(i===0?' open':'')+'><summary><span class="ot-step-dot">'+(i+1)+'</span><span class="ot-step-copy"><small>'+F(x[0])+'</small><b>'+F(x[1])+'</b></span><span class="ot-step-toggle" aria-hidden="true">＋</span></summary><p>'+F(x[2])+'</p></details>').join('')+'</div></section>';
  const questions=d=>'<section class="ot-section ot-questions"><div class="ot-sec-head"><div class="ot-kicker">'+F('IF THINGS CHANGE')+'</div><h2>'+F('Good to know along the way')+'</h2></div>'
    +'<div class="ot-q-list">'+d.ask.map(x=>'<details class="ot-question"><summary>'+F(x[0])+'<span aria-hidden="true">＋</span></summary><p>'+F(x[1])+'</p></details>').join('')+'</div></section>';
  const packing=d=>'<section class="ot-section ot-pack"><div class="ot-sec-head"><div class="ot-kicker">'+F('MAKE IT EASIER')+'</div><h2>'+F('A few things to bring')+'</h2><p>'+F('Just the extras for this kind of outing.')+'</p></div>'
    +'<div class="ot-pack-items">'+d.pack.map(x=>'<div class="ot-pack-item"><span class="ot-pack-mark" aria-hidden="true">✦</span><div><b>'+F(x[0])+'</b><small>'+F(x[1])+'</small></div></div>').join('')+'</div>'
    +'<button class="ot-tertiary" onclick="'+original('bag')+'">'+F('Your everyday diaper bag')+' <span aria-hidden="true">›</span></button></section>';
  function detail(id){
    const d=data(id),c=COLORS[id];if(!d)return null;
    const m=mNow();
    return '<div class="quiet-category hub-page ot-page ot-detail" data-overview="'+CAT+'" style="'+yearTheme(CAT)+';--ot-paper:'+c[0]+';--ot-tone:'+c[1]+'">'
    +detailPageTop(CAT)
    +'<div class="ot-cover"><div class="ot-kicker">'+F(titles[id]+' · '+(m===0?'newborn':m+' months'))+'</div><h1>'+F(d.title)+'</h1><p>'+F(d.lead)+'</p>'
    +'<div class="ot-cover-picture">'+pic(id)+'</div></div>'
    +fact(d,id)+timeline(d)+questions(d)+packing(d)
    +'<section class="ot-section ot-reference"><p>'+F(d.extra)+'</p><button onclick="'+original(id)+'">'+F('See the complete guide')+' <span aria-hidden="true">›</span></button>'
    +'<a href="'+esc2(d.source[1])+'" target="_blank" rel="noopener noreferrer">'+F('Source: '+d.source[0])+' ↗</a></section>'
    +'</div>';
  }
  const prevRoute=window.changesRoute;
  window.changesRoute=function(r,...args){
    const q=String(r).split(':');
    if(q[0]==='chg'&&q[1]===CAT){
      if(q[2]==='v3')return q[3]&&data(q[3])?detail(q[3]):home();
      if(q[2]==='original')return prevRoute.call(this,'chg:'+CAT+':d:'+q[3],...args);
      if(q[2]==='s')return home();
    }
    return prevRoute.call(this,r,...args);
  };
  const prevYear=window.categoryYear;
  window.categoryYear=function(t,...args){return t===CAT?home():prevYear.call(this,t,...args)};
  const prevComplete=window.completeCategory;
  window.completeCategory=function(t,...args){return t===CAT?home():prevComplete.call(this,t,...args)};
})();