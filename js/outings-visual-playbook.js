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
