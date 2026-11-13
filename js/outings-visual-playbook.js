(function(){
'use strict';
const root=document.getElementById('app');
const S={view:'home',age:6,feed:'both',solids:true,step:0,room:0,faq:null,sheet:null};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I={back:'<path d="m15 18-6-6 6-6"/>',chev:'<path d="m9 18 6-6-6-6"/>',plus:'<path d="M12 5v14M5 12h14"/>',
shield:'<path d="m12 2 9 4v7c0 4-4 7-9 9-5-2-9-5-9-9V6Z"/><path d="m8 12 3 3 5-6"/>',
ticket:'<path d="M3 7h18v4a2 2 0 000 4v3H3v-3a2 2 0 000-4V7Z"/><path d="M14 7v11" stroke-dasharray="2 3"/>',
scan:'<path d="M4 8V4h5m6 0h5v4M4 16v4h5m6 0h5v-4M7 12h10"/>',
plane:'<path d="M3 11 21 3l-7 18-3-7-8-3 8 3L21 3l-9 10"/>',
home:'<path d="m3 10 9-7 9 7v11H3V10M9 21v-8h6v8"/>',
milk:'<path d="M9 4h6v3c2 1 3 3 3 5v8H6v-8c0-2 1-4 3-5V4Z"/><path d="M10 4V2h4v2M9 14h6"/>',
stroller:'<path d="M9 6h8l-3 8H7L5 7m0-2v9"/><circle cx="8" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M9 6V3m8 3h4"/>',
check:'<path d="m5 12 4 4L19 6"/>',x:'<path d="m5 5 14 14M19 5 5 19"/>',
spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>',
bed:'<path d="M3 17V8h18v9M3 11h18M3 17v3m18-3v3M6 8V5h5v3"/>',
moon:'<path d="M20 15A8 8 0 019 4a8 8 0 1011 11Z"/>'};
const ico=(k,n=19)=>'<svg width="'+n+'" height="'+n+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(I[k]||I.spark)+'</svg>';
const milkTake=()=>S.feed==='nurse'?'Breast milk is allowed in amounts over 3.4 oz.':S.feed==='pumped'?'Expressed milk and cooling accessories can go through security.':S.feed==='formula'?'Formula, water for infant feeds and cooling accessories can go through security.':'Breast milk, formula, water for infant feeds and cooling accessories can all go through security.';
const foodTake=()=>S.age>=6&&S.solids?' Baby food can also be brought in quantities over 3.4 oz.':'';
const bagTake=()=>S.feed==='nurse'?'Bring diapers, wipes, spare clothes and nursing essentials.':S.feed==='pumped'?'Bring diapers, wipes, spare clothes, expressed milk kept cool and clean bottles.':S.feed==='formula'?'Bring diapers, wipes, spare clothes, clean bottles, formula and safe water.':'Bring diapers, wipes, spare clothes and your usual breast milk and formula supplies.';
const homeNote=()=>S.age<=2?'One short stop is plenty. Getting out is practice, not a test.':S.age>=9?'As Maya reaches and moves more, take a moment to scan unfamiliar spaces for hazards.':S.age>=6&&S.solids?'A familiar, safely prepared food can join the usual milk feeds on outings.':'Your familiar feeding and sleep routines can go with you.';
const flightArt=()=>String.raw`<svg viewBox="0 0 366 190" aria-hidden="true">
<defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#C4DFE0"/><stop offset="1" stop-color="#F5F4E9"/></linearGradient></defs>
<rect x="10" y="10" width="346" height="151" rx="19" fill="url(#sky)" opacity=".56"/>
<path d="M33 117V41Q33 35 39 35H326Q334 35 334 43V117" stroke="#ADC7C6" stroke-width="3" fill="none"/>
<path d="M44 42v74M109 42v74M174 42v74M239 42v74M305 42v74" stroke="#BBD1CF" stroke-width="2"/>
<path d="M38 116h295v28H38z" fill="#E8E9DE"/><path d="M39 139h294" stroke="#C9D5CF" stroke-width="2"/>
<path d="M48 65q12-17 25 0h-25M263 65q16-15 29 0h-29" fill="#FCFFFF" opacity=".85"/>
<g transform="translate(218 31) rotate(-5)"><path d="M4 24 57 10 96 0l11 7-31 23 26 20-10 8-42-21-25 17-8-4 16-21-29 1Z" fill="#719FA4"/><path d="m45 27 42-17" stroke="#D4EAEB" stroke-width="4" stroke-linecap="round"/></g>
<rect x="54" y="95" width="61" height="43" rx="6" fill="#D9B9A6"/><path d="M54 108h61" stroke="#F4DBCA" stroke-width="5"/>
<rect x="64" y="77" width="24" height="24" rx="5" fill="#FAF9F1" stroke="#ACC6BE" stroke-width="2"/><path d="M71 85h10m-10 6h7" stroke="#7BA397" stroke-width="2"/>
<path d="M148 137V82q0-8 8-8h35q8 0 8 8v55" fill="none" stroke="#9EBBB5" stroke-width="8" stroke-linecap="round"/>
<path d="M151 126h46" stroke="#CEE0DB" stroke-width="3" stroke-dasharray="5 6"/>
<rect x="139" y="129" width="73" height="12" rx="5" fill="#B7D1C7"/>
<circle cx="269" cy="87" r="14" fill="#DCB69F"/><path d="M258 84q7-16 20-6" fill="#98766B"/>
<path d="M255 101q14-13 28 0v38h-29Z" fill="#D3A68D"/><path d="m274 113 20 11" stroke="#D3A68D" stroke-width="7" stroke-linecap="round"/><path d="m260 137-8 13m22-13 9 13" stroke="#9E8C80" stroke-width="7" stroke-linecap="round"/>
<path d="M288 122h54l-9 24h-38Z" fill="#8DAF9F"/><path d="m289 122-5-20h-10" stroke="#6C927D" stroke-width="4" stroke-linecap="round" fill="none"/>
<circle cx="301" cy="150" r="7" fill="#587A6B"/><circle cx="330" cy="150" r="7" fill="#587A6B"/><circle cx="311" cy="112" r="9" fill="#DFBCAB"/>
<rect x="114" y="111" width="26" height="34" rx="5" fill="#D8AA97"/><path d="M120 111v-7h14v7M121 116v23" stroke="#AC8676" stroke-width="2" fill="none"/>
<circle cx="121" cy="147" r="3" fill="#8A7F74"/><circle cx="134" cy="147" r="3" fill="#8A7F74"/>
<circle cx="311" cy="28" r="4" fill="#E7BBA1"/>
</svg>`;
const storeArt=()=>String.raw`<svg viewBox="0 0 360 183" aria-hidden="true"><path d="M0 155h360v23H0z" fill="#D7E4D4"/>
<path d="M22 151V39h141v112" fill="#E2EACF"/><path d="M31 59h123M31 94h123M31 128h123" stroke="#C3D5BD" stroke-width="6"/>
<rect x="38" y="29" width="29" height="29" rx="5" fill="#F2C0A5"/><rect x="76" y="38" width="24" height="19" rx="5" fill="#C6D6B4"/><rect x="108" y="27" width="33" height="31" rx="5" fill="#DBB69B"/>
<rect x="40" y="68" width="27" height="22" rx="4" fill="#D7B18F"/><rect x="77" y="67" width="31" height="23" rx="4" fill="#F0E1B2"/><rect x="116" y="71" width="29" height="19" rx="4" fill="#C3D0C0"/>
<rect x="42" y="108" width="30" height="18" rx="4" fill="#F1C5A8"/><rect x="82" y="102" width="20" height="24" rx="4" fill="#B4CEB1"/>
<path d="M204 114h103l-15 33h-72Z" fill="#A8C8B4"/><path d="m207 114-14-43q27-43 70 8h34" fill="none" stroke="#71947D" stroke-width="7" stroke-linecap="round"/>
<path d="m211 117 13 29h66" stroke="#D5E8D9" stroke-width="4" fill="none"/><circle cx="230" cy="159" r="13" fill="#637D6F"/><circle cx="282" cy="159" r="13" fill="#637D6F"/>
<circle cx="246" cy="98" r="15" fill="#D6B29C"/><path d="M235 94q10-14 21-4" fill="#9B8371"/>
<circle cx="310" cy="40" r="15" fill="#F0DDBB"/><path d="m305 40 4 4 8-9" fill="none" stroke="#8AA689" stroke-width="3" stroke-linecap="round"/>
</svg>`;
const roomArt=()=>String.raw`<svg viewBox="0 0 358 232" aria-hidden="true"><path d="M8 15h342v180H8z" fill="#F7F0EE"/><path d="M8 196h342v20H8z" fill="#E7D8CE"/>
<path d="M20 28h108v105H20z" fill="#BDD4D3"/><path d="M74 28v105M20 84h108" stroke="#F8F5EF" stroke-width="8"/>
<path d="M28 29v103q15-13 24-37V29Z" fill="#D7BBC5"/><path d="M121 29v103q-16-16-23-37V29Z" fill="#D7BBC5"/>
<circle cx="47" cy="47" r="10" fill="#FBF8E9"/>
<rect x="102" y="124" width="153" height="72" rx="6" fill="#C7AF9F"/><rect x="115" y="136" width="127" height="31" rx="5" fill="#FCFAF6"/>
<path d="M117 128v61m18-61v61m18-61v61m18-61v61m18-61v61m18-61v61m18-61v61m18-61v61" stroke="#B69B89" stroke-width="6" stroke-linecap="round"/>
<path d="M116 194v16m125-16v16" stroke="#AA9687" stroke-width="7" stroke-linecap="round"/>
<path d="M281 110h39l-6 16h-27Z" fill="#E3CDB9"/><path d="M301 127v29" stroke="#B89D8F" stroke-width="5"/>
<rect x="273" y="159" width="51" height="32" rx="4" fill="#D9BBA6"/><path d="M292 160h14v-9h-14Z" fill="#C69D8F"/>
<path d="M275 185h50v29h-50z" fill="#9FAD9B"/><path d="M286 185v-9q14-12 27 9" stroke="#879883" stroke-width="4" fill="none"/>
<path d="M314 34h27v107h-27z" fill="#E5D5C9" stroke="#C5B6AA" stroke-width="3"/><circle cx="333" cy="92" r="3" fill="#A0897B"/>
<path d="M11 213h340" stroke="#D3C5BA" stroke-width="2"/></svg>`;
function topBar(){return '<header class="top"><button class="brand" data-home aria-label="Ahead home">ahead<i>.</i></button><button class="profile" data-sheet="profile">Maya · '+S.age+' mo '+ico('chev',13)+'</button></header>'}
function head(title,sub,cat){return '<button class="back" data-home>'+ico('back',15)+' All outings</button><div class="head-row"><div><span class="eyebrow">'+esc(cat||'OUTINGS & TRAVEL')+'</span><h1>'+esc(title)+'</h1><p class="subtitle">'+esc(sub)+'</p></div></div>'}
function home(){
 return '<main class="screen"><div class="homehead"><span class="eyebrow">OUTINGS & TRAVEL</span><h1>See more of the world, together.</h1><p>Feel comfortable leaving home with Maya—whether it’s one quick errand or your first flight.</p></div>'
 +'<div class="home-highlight"><span class="sun-icon">'+ico('spark',21)+'</span><div><b>Good to know at '+S.age+' months</b><p>'+esc(homeNote())+'</p></div></div>'
 +'<span class="section-label">PLAN A NEW EXPERIENCE</span><button class="featured" data-view="flight"><span class="section-label">YOUR FIRST FLIGHT</span><b>Airport to arrival, made simpler.</b><span class="note">See what happens, and what matters with Maya.</span><span class="cta">Explore flying ↗</span><span class="featured-art">'+flightArt()+'</span></button>'
 +'<div class="home-section-head"><span class="section-label">OR START CLOSER TO HOME</span><h2>Where are you headed?</h2></div>'
 +'<div class="cards"><button class="dest" data-view="store" style="--bg:#e6efe6;--tone:#66826d"><span class="dest-art">'+storeArt()+'</span><b>Grocery store</b><small>How to shop with her safely</small><span class="arr">↗</span></button>'
 +'<button class="dest" data-view="stay" style="--bg:#f2eaf0;--tone:#90788e"><span class="dest-art">'+roomArt()+'</span><b>Staying away</b><small>Make a new room feel ready</small><span class="arr">↗</span></button>'
 +'</div><div class="home-reassurance"><b>Different places, different questions.</b><p>This concept tests three experiences: a visual flight journey, a practical shopping decision, and an interactive hotel room.</p></div></main>';
}

const flightSteps=[
{label:'Book',eyebrow:'BEFORE YOU GO',title:'Choose the safest seat you can.',body:'When booking, add Maya to the reservation and check the airline’s car-seat policy. A separate seat with an approved child restraint is the safest way for her to fly.',take:'Check the car seat label for certification for use in aircraft.',symbol:'ticket',detail:'seat'},
{label:'Security',eyebrow:'AT THE AIRPORT',title:'Baby milk is allowed through.',body:()=>milkTake()+' Tell the officer at the start of screening and remove feeding supplies for separate screening.'+foodTake(),take:'Keep milk, formula and cooling accessories easy to reach.',symbol:'scan',detail:'tsa'},
{label:'On board',eyebrow:'ON THE PLANE',title:'Comfort comes before a perfect routine.',body:'A feed or pacifier during pressure changes may help if Maya wants one. During taxi, takeoff, landing and turbulence, follow crew instructions and keep her secured in the approved restraint when she has one.',take:'Ask the crew where to change a diaper. Walk only when the seat-belt sign is off.',symbol:'plane',detail:'plane'},
{label:'Arrive',eyebrow:'WHEN YOU LAND',title:'The schedule can settle later.',body:'A travel day may mean unusual naps and feeds. For a short trip, home timing may work; across time zones, adjust gradually while following Maya’s cues.',take:'Have a firm, flat sleep space ready if you’re staying overnight.',symbol:'home',detail:'sleep'}
];
const flightQuestions=[
['What if Maya cries on the plane?','Offer comfort or a feed when appropriate. A brief walk is an option only when the seat-belt sign is off. You don’t owe anyone a perfectly quiet baby.'],
['Where can I change her diaper?','Ask the crew which restroom has a fold-down changing table. Keep wipes and a spare outfit in your carry-on.'],
['Can I bring the stroller to the gate?','Often yes, but gate-checking and pickup rules vary by airline and airport. Confirm the policy before flying.']
];
const storeQuestions=[
['Can Maya sit in the cart’s own seat?','Only if she can sit upright securely and the cart’s seat is appropriate; buckle the restraint. A stroller or carrier is often a safer, easier choice.'],
['Where should I put the infant car seat?','Never balance or attach an infant car seat to the top of a cart. It makes the cart more likely to tip.'],
['What if Maya gets hungry halfway through?','Pause and feed her as you normally would. Bring your usual feeding supplies and feel free to head home.']
];
const stayQuestions=[
['Can she sleep in the hotel bed with us?','No. An adult bed, couch or armchair is not a safe infant sleep surface. Use a safety-approved crib, portable crib or play yard.'],
['What if the first night is rough?','New places can make settling harder. Use familiar steps, follow Maya’s feeding needs and prioritize safe sleep over a perfect routine.'],
['What if the provided crib looks old?','Check for damage, missing parts, recalled models, and mattress fit. Use a suitable sleep space you trust if you’re unsure.']
];
function faqRows(qs,prefix){
 return '<div class="qas">'+qs.map((q,i)=>{const k=prefix+':'+i;return '<div class="qa"><button data-faq="'+k+'" aria-expanded="'+(S.faq===k)+'">'+esc(q[0])+ico('plus',16)+'</button>'+(S.faq===k?'<p class="answer">'+esc(q[1])+'</p>':'')+'</div>'}).join('')+'</div>';
}
function qaSection(heading,qs,prefix){
 return '<section class="qa-block"><span class="eyebrow">IF THINGS CHANGE</span><h2>'+esc(heading)+'</h2>'+faqRows(qs,prefix)+'</section>';
}
function sourceLinks(kind){
 const links={
 flight:[['FAA · Flying with children','https://www.faa.gov/travelers/kids-corner'],['TSA · Traveling with children','https://www.tsa.gov/travel/special-procedures/traveling-children']],
 store:[['AAP · Shopping cart safety','https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Safe-Shopping-With-Children.aspx']],
 stay:[['AAP · Hotel safety','https://www.healthychildren.org/English/safety-prevention/on-the-go/Pages/Hotel-Dangers-that-Put-Baby-Safety-at-Risk.aspx'],['AAP · Safe sleep','https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx']]
 };
 return '<div class="sources">Trusted guidance'+links[kind].map(x=>'<a href="'+x[1]+'" target="_blank" rel="noopener noreferrer">'+esc(x[0])+' ↗</a>').join('')+'</div>';
}
function flight(){
 const d=flightSteps[S.step];
 return '<main class="screen">'+head('Flying with Maya','Everything you need to feel ready—from booking to landing.','YOUR OUTING PLAYBOOK')
 +'<section class="play-hero"><div class="play-hero-head"><div><span class="eyebrow">THE WHOLE JOURNEY</span><h2>Your flight at a glance</h2></div><small>Tap any moment</small></div>'
 +'<div class="map-illustration">'+flightArt()+'</div><div class="map-steps" aria-label="Flight stages">'+flightSteps.map((x,i)=>'<button class="map-step'+(S.step===i?' selected':'')+'" data-step="'+i+'" aria-pressed="'+(S.step===i)+'"><span class="num">'+(i+1)+'</span><b>'+x.label+'</b></button>').join('')+'</div></section>'
 +'<section class="play-main"><span class="eyebrow">TWO THINGS TO KNOW FIRST</span><h2 class="play-section-title">The important decisions</h2><div class="big-things">'
 +'<button class="big-thing" data-sheet="seat"><span class="thing-ico">'+ico('shield',18)+'</span><span class="pill">SAFEST OPTION</span><b>Her own airplane seat</b><small>With an aircraft-approved child restraint.</small><span class="more">See the options ↗</span></button>'
 +'<button class="big-thing" data-sheet="tsa"><span class="thing-ico">'+ico('milk',18)+'</span><span class="pill">GOOD TO KNOW</span><b>Baby milk over 3.4 oz? Yes.</b><small>Breast milk, formula and feeding supplies have exceptions.</small><span class="more">What TSA allows ↗</span></button>'
 +'</div></section>'
 +'<section class="topic" id="moment"><div class="topic-header"><div><span class="eyebrow">ZOOM IN</span><h2>At '+esc(d.label.toLowerCase())+'</h2></div><small>'+(S.step+1)+' of 4</small></div>'
 +'<div class="scene-card"><div class="scene-card-head"><span class="scene-number">'+ico(d.symbol,22)+'</span><div><span class="eyebrow">'+esc(d.eyebrow)+'</span><h3>'+esc(d.title)+'</h3></div></div>'
 +'<p class="scene-body">'+esc(typeof d.body==='function'?d.body():d.body)+'</p><div class="scene-focus"><b>ONE THING TO REMEMBER</b><span>'+esc(d.take)+'</span></div>'
 +'<div class="scene-actions"><button data-sheet="'+d.detail+'">See the details '+ico('chev',15)+'</button></div></div></section>'
 +qaSection('What if…?',flightQuestions,'flight')
 +'<button class="subsection-link" data-sheet="pack"><div><b>What belongs in your carry-on?</b><span>Just what you’ll want within reach.</span></div>'+ico('chev',16)+'</button>'
 +'<button class="reference-link" data-sheet="guide:flight">Read the complete flying guide ↗</button>'+sourceLinks('flight')+'</main>';
}

const roomThings=[
{n:'Crib',title:'Start with a safe sleep space.',body:'Use a crib or play yard that meets current safety standards. Maya sleeps on a firm, flat mattress with a fitted sheet only—no pillows, loose blankets or toys.',note:'Ask about the crib before you book; inspect it when you arrive.'},
{n:'Window',title:'Move the crib away from cords.',body:'Keep the sleep space away from window-blind cords, curtains, lamps, monitors and anything that could fall or be pulled into the crib.',note:'Look for cords reachable from wherever Maya might sleep or play.'},
{n:'Bags',title:'Keep medicines and tiny objects away.',body:()=>S.age>=8?'Maya may be reaching or moving more. Store medicines, chargers, toiletries, small objects and cleaning products where she cannot get them.':'Store medications, toiletries, cords and small objects out of reach, even if Maya is not crawling yet.',note:'A quick room sweep makes a difference without trying to babyproof the whole hotel.'},
{n:'Bathroom',title:'Treat unfamiliar water and doors with care.',body:'Keep the bathroom door closed when possible. Never leave Maya unattended in a bath or near water. Check for hot water and cleaning supplies.',note:'Set up a safe spot for Maya while you unpack.'}
];
function stay(){
 const d=roomThings[S.room],body=typeof d.body==='function'?d.body():d.body;
 return '<main class="screen">'+head('A night away from home','A new room is easier when you know what to look for.','YOUR STAY PLAYBOOK')
 +'<section class="room-hero"><span class="eyebrow">ON ARRIVAL</span><h2>Take a look around.</h2><p>Tap the room to see what matters for Maya.</p>'
 +'<div class="room-svg-wrap">'+roomArt()
 +'<button class="hotspot crib'+(S.room===0?' selected':'')+'" data-room="0" aria-label="Crib safety">1</button>'
 +'<button class="hotspot window'+(S.room===1?' selected':'')+'" data-room="1" aria-label="Window and cords safety">2</button>'
 +'<button class="hotspot bag'+(S.room===2?' selected':'')+'" data-room="2" aria-label="Medicines and bag safety">3</button>'
 +'<button class="hotspot bath'+(S.room===3?' selected':'')+'" data-room="3" aria-label="Bathroom safety">4</button></div>'
 +'<div class="hotspot-tabs">'+roomThings.map((x,i)=>'<button data-room="'+i+'" class="'+(S.room===i?'active':'')+'" aria-pressed="'+(S.room===i)+'">'+esc(x.n)+'</button>').join('')+'</div></section>'
 +'<div class="room-explain" id="room-detail"><span class="eyebrow">WHAT TO CHECK · '+(S.room+1)+' OF 4</span><h2>'+esc(d.title)+'</h2><p>'+esc(body)+'</p><div class="mini-note">'+esc(d.note)+'</div></div>'
 +'<section class="room-essentials"><span class="eyebrow">BEFORE YOU LEAVE HOME</span><h2>Two things worth bringing</h2>'
 +'<div class="light-row"><span class="ic">'+ico('bed',19)+'</span><div><b>Her usual sleep sack</b><p>A familiar part of her bedtime routine, used as directed.</p></div></div>'
 +'<div class="light-row"><span class="ic">'+ico('moon',19)+'</span><div><b>A safe crib or play yard plan</b><p>Confirm the hotel’s setup, or bring your own approved one.</p></div></div></section>'
 +qaSection('What if…?',stayQuestions,'stay')
 +'<button class="reference-link" data-sheet="guide:stay">Read the complete staying-away guide ↗</button>'+sourceLinks('stay')+'</main>';
}
function store(){
 return '<main class="screen">'+head('A quick grocery run','The biggest question isn’t what to buy—it’s where Maya rides.','YOUR ERRAND PLAYBOOK')
 +'<section class="shop-hero"><span class="eyebrow">THE BIG DECISION</span><h2>Where will she ride?</h2><p>There’s an easy, safer default.</p><div class="shop-art">'+storeArt()+'</div></section>'
 +'<div class="shop-options"><div class="shop-option"><span class="circle">'+ico('check',20)+'</span><b>Stroller or carrier</b><p>A practical option that keeps Maya secure without putting her infant seat on a cart.</p></div>'
 +'<div class="shop-option bad"><span class="circle">'+ico('x',20)+'</span><b>Not on top of the cart</b><p>Never balance an infant car seat on a cart—even if it seems to click in.</p></div></div>'
 +'<section class="shop-then"><span class="eyebrow">THE REST IS SIMPLE</span><h2>Three little moments</h2>'
 +'<div class="shop-step"><span class="n">1</span><div><b>In the parking lot</b><p>Move Maya to a stroller or carrier, or a cart seat only if she can sit securely and be buckled in.</p></div></div>'
 +'<div class="shop-step"><span class="n">2</span><div><b>In the aisles</b><p>Keep the list short. A feed, break or diaper change may happen. '+(S.age>=6&&S.solids?'A familiar safe snack can come too.':'Milk feeds are enough for now.')+'</p></div></div>'
 +'<div class="shop-step"><span class="n">3</span><div><b>Back at the car</b><p>Buckle her correctly into her rear-facing seat. When you park, always check the back seat before walking away.</p></div></div></section>'
 +qaSection('Quick answers',storeQuestions,'store')
 +'<button class="subsection-link" data-sheet="pack"><div><b>What to bring for a quick errand</b><span>Usually less than you think.</span></div>'+ico('chev',16)+'</button>'
 +'<button class="reference-link" data-sheet="guide:store">Read the complete around-town guide ↗</button>'+sourceLinks('store')+'</main>';
}

function sheetContent(){
 const t=S.sheet||'';
 if(t==='profile')return {label:'DEMO BABY',title:'Made for Maya',body:'<p>Try different ages and feeding methods. In Ahead, this would use details already provided, not ask again.</p>'
 +'<div class="form-row"><label for="age">Age</label><select id="age" data-age><option value="2"'+(S.age===2?' selected':'')+'>2 months</option><option value="6"'+(S.age===6?' selected':'')+'>6 months</option><option value="10"'+(S.age===10?' selected':'')+'>10 months</option></select></div>'
 +'<div class="form-row"><label for="feed">Feeding</label><select id="feed" data-feed><option value="nurse"'+(S.feed==='nurse'?' selected':'')+'>Breast milk · nursing</option><option value="pumped"'+(S.feed==='pumped'?' selected':'')+'>Pumped breast milk</option><option value="formula"'+(S.feed==='formula'?' selected':'')+'>Formula</option><option value="both"'+(S.feed==='both'?' selected':'')+'>Breast milk and formula</option></select></div>'
 +'<div class="form-row"><label for="solids">Solids</label><select id="solids" data-solids><option value="yes"'+(S.solids?' selected':'')+'>Already started</option><option value="no"'+(!S.solids?' selected':'')+'>Not started yet</option></select></div>'
 +'<button class="big-button" data-close>See my guide</button>'};
 if(t==='seat')return {label:'FLYING · THE BIG DECISION',title:'Own seat or lap?',body:'<p>The safest way to fly with Maya is a separate airplane seat with an approved child restraint system used correctly.</p>'
 +'<div class="choice reco"><b>Safest · Her own seat</b><p>Book a ticket for Maya and use an aircraft-approved car seat that fits her. Check the seat’s label and the airline’s installation rules.</p></div>'
 +'<div class="choice"><b>Often allowed · On your lap</b><p>Many airlines permit infants under 2 on a parent’s lap, but this offers less protection during turbulence. The FAA recommends an approved child restraint in a separate seat.</p></div>'
 +'<p class="mini-caption">Not all infant carriers are approved restraints. Follow FAA, airline and car-seat instructions.</p>'};
 if(t==='tsa')return {label:'FLYING · AIRPORT SECURITY',title:'What TSA lets you bring',body:'<p>'+esc(milkTake()+foodTake())+'</p>'
 +'<div class="choice reco"><b>Over 3.4 oz is allowed</b><p>Formula, breast milk, toddler drinks, baby food and cooling accessories are treated as medically necessary items.</p></div>'
 +'<div class="choice"><b>At screening</b><p>Tell the TSA officer at the beginning of screening. Remove these items from your carry-on for separate screening; additional checks may be needed.</p></div>'
 +'<p class="mini-caption">These are U.S. TSA rules; other countries may differ.</p>'};
 if(t==='plane')return {label:'FLYING · ONBOARD',title:'The flight itself',body:'<p>Follow cabin-crew instructions for approved restraints. A restraint in Maya’s own seat offers the best protection in turbulence.</p>'
 +'<div class="choice"><b>During takeoff and landing</b><p>If she wants one, a pacifier or feed may help with pressure changes. Keep her secured as directed when she has her own approved restraint.</p></div>'
 +'<div class="choice"><b>If she cries</b><p>Comfort her as needed. Only stand or walk when the seat-belt sign is off.</p></div>'};
 if(t==='sleep')return {label:'WHEN YOU ARRIVE',title:'A familiar place to sleep',body:'<p>Sleep schedules may be different after traveling. A safe sleep space is more important than keeping the exact timing.</p>'
 +'<div class="choice reco"><b>A crib or play yard</b><p>Firm, flat mattress, fitted sheet, and no loose bedding or objects in the sleep space. Place Maya on her back to sleep.</p></div>'};
 if(t==='stay')return {label:'SAFE SLEEP',title:'Her own sleep space',body:'<p>Use a crib, portable crib or play yard that meets current safety standards. Check the mattress fit, use a fitted sheet only, and keep the crib bare.</p>'
 +'<div class="choice reco"><b>Before bedtime</b><p>Check for damage or missing parts, move the crib away from cords and windows, and use your usual bedtime routine.</p></div>'};
 if(t==='pack')return {label:'PACK FOR THIS',title:S.view==='store'?'For a short errand':'Your carry-on',body:'<p>'+esc(bagTake())+'</p>'
 +'<div class="sheet-item"><b>Always useful</b><p>Diapers, wipes, changing pad and a spare outfit for Maya.</p></div>'
 +(S.view==='flight'?'<div class="sheet-item"><b>For a flight</b><p>Extra milk or formula supplies, extra diapers, a spare top for you, and documents your airline may request.</p></div>':'')
 +(S.age>=6&&S.solids?'<div class="sheet-item"><b>If eating solids</b><p>A familiar, safely prepared food and a cup. Only offer it while seated upright and supervised.</p></div>':'')
 +'<p class="mini-caption">A quick reference, not a checklist to maintain. Adjust for how long you’re out.</p>'};
 if(t.startsWith('guide:')){
 const kind=t.slice(6);
 if(kind==='flight')return {label:'COMPLETE REFERENCE',title:'Flying with Maya',body:'<div class="full-guide">'
 +'<h3>When you book</h3><p>Choose a separate seat with an approved restraint when possible. Check airline policies, certification on the car-seat label, stroller rules and any age-documentation requirements.</p>'
 +'<h3>Airport security</h3><p>'+esc(milkTake()+foodTake())+' Let TSA know about medically necessary items for separate screening.</p>'
 +'<h3>At the gate</h3><p>Ask where the stroller is checked and collected. Keep extra diapers, milk and clothing in your carry-on.</p>'
 +'<h3>On the plane</h3><p>Follow crew instructions for restraints. Offer appropriate comfort for pressure changes. Ask about a changing table; walk only when safe.</p>'
 +'<h3>After landing</h3><p>A travel day can disrupt naps and feeds. Arrange a safe, flat sleep space if you’re staying away.</p>'
 +'<h3>Common surprises</h3><p>Crying and delays are normal parts of traveling with babies. Allow extra feeding supplies and flexibility.</p></div>'};
 if(kind==='store')return {label:'COMPLETE REFERENCE',title:'Around town',body:'<div class="full-guide">'
 +'<h3>Start small</h3><p>One short stop counts. Leaving after a feed may help but isn’t required.</p>'
 +'<h3>How she rides</h3><p>A stroller or carrier is a practical default. Do not attach an infant car seat to the top of the cart. The cart seat is only for a baby who can sit securely, with the restraint buckled.</p>'
 +'<h3>Food and feeding</h3><p>'+esc(bagTake())+'</p>'
 +'<h3>When plans change</h3><p>Stop for a feed, soothe, change her in a safe spot or head home.</p>'
 +'<h3>Car safety</h3><p>Always use a correctly installed rear-facing car seat. Never leave her alone in a vehicle.</p></div>'};
 if(kind==='stay')return {label:'COMPLETE REFERENCE',title:'Staying away',body:'<div class="full-guide">'
 +'<h3>Before you book</h3><p>Confirm that a safe crib or play yard is available or bring your own.</p>'
 +'<h3>When you arrive</h3><p>Inspect the crib. Scan for window cords, medicines, toiletries, small objects, bathroom hazards, pets and items that could fall.</p>'
 +'<h3>At bedtime</h3><p>Firm, flat sleep surface. Fitted sheet and no loose items. Keep familiar bedtime steps and a safe sleep sack.</p>'
 +'<h3>If the first night is rough</h3><p>A new room can disrupt sleep. Be flexible while keeping safe sleep rules.</p></div>'};
 }
 return {label:'MORE INFORMATION',title:'Ahead',body:'<p>More guidance for outings with Maya.</p>'};
}
function sheet(){
 if(!S.sheet)return '';
 const d=sheetContent();
 return '<div class="sheet-overlay" data-backdrop><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle"><div class="sheet-head"><div><span class="eyebrow">'+esc(d.label)+'</span><h2 id="sheetTitle">'+esc(d.title)+'</h2></div><button class="sheet-close" aria-label="Close" data-close>×</button></div><div class="sheet-body">'+d.body+'</div></section></div>';
}
function render(){
 root.innerHTML=topBar()+(S.view==='flight'?flight():S.view==='store'?store():S.view==='stay'?stay():home())+sheet();
 if(S.sheet){const close=root.querySelector('[data-close]');if(close&&typeof close.focus==='function')close.focus({preventScroll:true})}
}
function go(v){
 if(!['home','flight','store','stay'].includes(v))return;
 S.view=v;S.step=0;S.room=0;S.faq=null;S.sheet=null;
 render();try{window.scrollTo({top:0,behavior:'instant'})}catch(e){}
}
root.addEventListener('click',e=>{
 const b=e.target.closest('button');
 if(!b){if(e.target.matches('[data-backdrop]')){S.sheet=null;render()}return}
 if(b.hasAttribute('data-view')){go(b.getAttribute('data-view'));return}
 if(b.hasAttribute('data-home')){go('home');return}
 if(b.hasAttribute('data-step')){
   S.step=Number(b.getAttribute('data-step'));S.faq=null;render();
   const el=root.querySelector('#moment');if(el&&typeof el.scrollIntoView==='function')el.scrollIntoView({block:'nearest'});
   return;
 }
 if(b.hasAttribute('data-room')){
   S.room=Number(b.getAttribute('data-room'));S.faq=null;render();
   const el=root.querySelector('#room-detail');if(el&&typeof el.scrollIntoView==='function')el.scrollIntoView({block:'nearest'});
   return;
 }
 if(b.hasAttribute('data-faq')){const k=b.getAttribute('data-faq');S.faq=S.faq===k?null:k;render();return}
 if(b.hasAttribute('data-sheet')){S.sheet=b.getAttribute('data-sheet');render();return}
 if(b.hasAttribute('data-close')){S.sheet=null;render();return}
});
root.addEventListener('change',e=>{
 const x=e.target;
 if(x.hasAttribute('data-age'))S.age=Number(x.value);
 else if(x.hasAttribute('data-feed'))S.feed=x.value;
 else if(x.hasAttribute('data-solids'))S.solids=x.value==='yes';
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.sheet){S.sheet=null;render()}});
try {const q=new URLSearchParams(window.location.search),v=q.get('view');if(['flight','store','stay'].includes(v))S.view=v;}catch(e){}
window.__playbook={getState:()=>({...S}),go,flightSteps:flightSteps.map(x=>x.label)};
render();
})();