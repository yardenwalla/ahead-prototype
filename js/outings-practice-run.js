
(function(){
'use strict';
const state={page:'home',key:'coffee',moment:0,world:'near',sheet:null,expanded:false,age:6,feed:'both',solids:true,choices:{}};
const root=document.getElementById('app');
const pretty=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[ch]));
const value=s=>typeof s==='function'?s():s;
const food=()=>state.age>=6&&state.solids;
const milk=()=>state.feed==='nurse'?'nursing':state.feed==='formula'?'formula':'breast milk and formula';
const milkLine=()=>state.feed==='nurse'?'You can nurse wherever you need to.':state.feed==='formula'?'Bring a bottle and formula for a feed, plus a spare for delays.':'You can nurse or offer a bottle. Bring the milk or formula supplies you normally use.';
const bagLine=()=>state.feed==='nurse'?'Diapers, wipes, a change of clothes and anything you like for nursing.':state.feed==='formula'?'Diapers, wipes, spare clothes, clean bottles, formula and safe water.':'Diapers, wipes, spare clothes, bottles and the milk or formula you normally use.';
const overage=()=>state.age>=6;
const iconPath={
 arrow:'<path d="m6 12 12 0m-5-5 5 5-5 5"/>',
 back:'<path d="m15 18-6-6 6-6"/>',
 chevron:'<path d="m9 18 6-6-6-6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/>',
 bag:'<path d="M5 8h14v13H5zM9 8V6a3 3 0 0 1 6 0v2"/>',
 milk:'<rect x="8" y="6" width="8" height="16" rx="3"/><path d="M10 6V3h4v3M11 13h2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 car:'<path d="M5 15 7 8h10l2 7M3 15h18v5H3z"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/>',
 seat:'<rect x="7" y="3" width="10" height="17" rx="3"/><path d="M7 11H4v9h16v-9h-3"/>',
 plane:'<path d="M3 12 21 3l-6 18-3-8-9-1 9 1 9-10-11 11"/>',
 home:'<path d="m3 10 9-7 9 7v11H3zM9 21v-8h6v8"/>',
 heart:'<path d="M12 21 3 12c-4-4 2-11 9-4 7-7 13 0 9 4z"/>',
 shop:'<path d="M3 9 5 4h14l2 5v12H3zM3 9h18M9 21v-8h6v8"/>',
 stroller:'<path d="M7 12h11l-3 5H9zM7 12V5q5-3 9 3M15 8h6"/><circle cx="9" cy="20" r="2"/><circle cx="17" cy="20" r="2"/>',
 shield:'<path d="m12 2 9 4v7c0 4-4 7-9 9-5-2-9-5-9-9V6z"/><path d="m8 12 3 3 5-6"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
 document:'<path d="M6 2h8l4 4v16H6zM14 2v5h4M9 12h6m-6 4h6"/>',
 water:'<path d="M12 2c-2 5-7 8-7 13a7 7 0 0 0 14 0c0-5-5-8-7-13Z"/>',
 pause:'<path d="M9 5v14m6-14v14"/>',
 suitcase:'<rect x="4" y="7" width="16" height="14" rx="2"/><path d="M9 7V4h6v3M8 21v2m8-2v2"/>',
 star:'<path d="m12 2 2.8 6.5L22 12l-7.2 3.5L12 22l-2.8-6.5L2 12l7.2-3.5z"/>',
 chat:'<path d="M4 4h16v13H9l-5 4V4Z"/><path d="M8 10h8m-8 4h5"/>'
};
const ico=(n,size=20)=>'<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(iconPath[n]||iconPath.star)+'</svg>';
const artBases={
 coffee:'<path d="M42 70h133v74H42Z" fill="#EED7C7"/><path d="m35 70 14-31h120l14 31" fill="#DFAE98"/><path d="M37 70h147m-132 0V49m26 21V49m26 21V49m26 21V49m27 21V49" stroke="#FAE8DD" stroke-width="8"/><rect x="62" y="91" width="42" height="53" rx="5" fill="#FDF4E9"/><rect x="117" y="86" width="34" height="28" rx="5" fill="#FFF4E7"/><path d="M222 118h61l-9 28h-52Z" fill="#A3C3AD"/><path d="m228 118-8-24h-13" fill="none" stroke="#698B79" stroke-width="5"/><circle cx="233" cy="151" r="11" fill="#647E6F"/><circle cx="273" cy="151" r="11" fill="#647E6F"/><circle cx="251" cy="92" r="14" fill="#D8B4A0"/><path d="M241 89q9-13 20 0" fill="#95735F"/>',
 walk:'<path d="M0 138q80-40 150 0t170 0v35H0Z" fill="#A9C7A6"/><path d="M89 136V43" stroke="#9E9271" stroke-width="9" stroke-linecap="round"/><circle cx="89" cy="46" r="39" fill="#B9D6AD"/><circle cx="55" cy="67" r="25" fill="#B9D6AD"/><circle cx="122" cy="68" r="22" fill="#BDD5AE"/><path d="M185 127h94l-13 30h-67z" fill="#E0B6A8"/><path d="m191 127-12-38q17-33 55 4h30" stroke="#B58C80" stroke-width="6" fill="none"/><circle cx="211" cy="156" r="12" fill="#6D8373"/><circle cx="262" cy="156" r="12" fill="#6D8373"/><circle cx="230" cy="99" r="15" fill="#E4C3B2"/>',
 restaurant:'<rect x="28" y="57" width="260" height="76" rx="13" fill="#F4DCC6"/><path d="M38 55V38h240v17" stroke="#D8B39C" stroke-width="6" fill="none"/><rect x="65" y="80" width="68" height="53" rx="10" fill="#FFF8F0"/><rect x="157" y="82" width="93" height="10" rx="5" fill="#B58E80"/><path d="M168 93v44m68-44v44" stroke="#A18E83" stroke-width="8"/><path d="M186 106q14 22 29 0" stroke="#9CB6A4" stroke-width="8" fill="none"/><circle cx="196" cy="58" r="21" fill="#DAB59F"/><path d="M180 53q12-17 33-7" fill="#A98370"/><path d="M192 62h.1m13 0h.1" stroke="#6D514D" stroke-width="3"/>',
 grocery:'<rect x="36" y="25" width="70" height="119" rx="5" fill="#D9E6D4"/><path d="M50 30v106m25-106v106m25-106v106" stroke="#F6F8ED" stroke-width="7"/><rect x="44" y="39" width="21" height="22" rx="4" fill="#E3AE96"/><rect x="75" y="78" width="25" height="28" rx="4" fill="#E7C69F"/><path d="M150 63h105l-17 71h-77z" fill="#ABC6B0"/><path d="M154 65 144 44h-18" stroke="#749A81" stroke-width="6" fill="none"/><path d="m170 75 8 47m18-47 8 47m18-47 8 47" stroke="#E4F0E0" stroke-width="3"/><circle cx="176" cy="144" r="13" fill="#667C70"/><circle cx="237" cy="144" r="13" fill="#667C70"/><circle cx="225" cy="40" r="16" fill="#D9AF96"/>',
 road:'<path d="M0 125q86-29 160-5t160 4v50H0Z" fill="#C1D4BD"/><path d="M0 146q70 7 132 0t188 2" stroke="#fff" stroke-width="5" stroke-dasharray="15 16" fill="none"/><path d="M75 99h27l24-29h68l28 29h23q11 0 11 16v22H58v-22q0-16 17-16Z" fill="#CFA993"/><path d="m112 98 19-22h58l20 22Z" fill="#E9EDEE"/><circle cx="102" cy="136" r="17" fill="#718B7B"/><circle cx="214" cy="136" r="17" fill="#718B7B"/><circle cx="102" cy="136" r="7" fill="#F4F5ED"/><circle cx="214" cy="136" r="7" fill="#F4F5ED"/><circle cx="56" cy="45" r="18" fill="#EDCEAB"/>',
 flight:'<path d="M19 116q78-43 143-13t140-25" stroke="#AECDD2" stroke-width="3" stroke-dasharray="4 11" fill="none"/><path d="m132 74 58-15 52-40 21 8-29 45 39 27-5 11-63-14-28 35-11-2 13-44-54 5Z" fill="#A7C4C6"/><path d="m198 72 37-30" stroke="#EDF6F4" stroke-width="4" stroke-linecap="round"/><path d="M32 57q13-23 31-7 13-12 25 2 24-8 29 14H27Z" fill="#FFF"/><path d="M245 127q16-17 31-4 16-8 26 7h-57Z" fill="#FFF"/>',
 overnight:'<path d="m49 76 104-66 100 66v82H49Z" fill="#DCC3CD"/><path d="M44 75 153 7 259 75" stroke="#B78FA3" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="81" y="89" width="137" height="56" rx="9" fill="#FFF8F2"/><path d="M92 98h114m-114 12h114m-114 12h114" stroke="#C3B4AA" stroke-width="4"/><path d="M89 89v62m121-62v62" stroke="#AA9693" stroke-width="6"/><circle cx="259" cy="33" r="15" fill="#F3E4C7"/><circle cx="267" cy="27" r="12" fill="#EDE6DD"/>',
 water:'<path d="M0 121q25-16 50 0t50 0 50 0 50 0 50 0 70 0v50H0Z" fill="#A6D0D6"/><path d="M14 135q21-11 43 0t43 0 43 0" stroke="#E7F7F5" stroke-width="4" fill="none"/><path d="M132 121V43" stroke="#B88D7C" stroke-width="7" stroke-linecap="round"/><path d="M132 44q57-13 85 45H48q25-58 84-45Z" fill="#E5B3A1"/><path d="m132 44-37 44m37-44 32 44" stroke="#F9E5D7" stroke-width="4"/><circle cx="264" cy="40" r="17" fill="#EFD7A0"/><path d="M261 21v-8M261 67v-8M245 39h-8m48 0h-8" stroke="#E3C88E" stroke-width="3"/>',
 abroad:'<circle cx="143" cy="85" r="67" fill="#B4D1BC"/><ellipse cx="143" cy="85" rx="29" ry="67" stroke="#E7F2E5" stroke-width="3" fill="none"/><path d="M76 85h134" stroke="#E7F2E5" stroke-width="3"/><path d="m97 45 34-11 20 25-14 22-26-8-9 29m82-62-15 28-15 13 15 27 29 0" fill="#90B49D"/><rect x="222" y="76" width="63" height="78" rx="8" transform="rotate(12 222 76)" fill="#DDB69F"/><path d="m239 102 28 7m-32 10 27 7" stroke="#F9E6D8" stroke-width="5" stroke-linecap="round"/>'
};
const sceneSymbol=(kind)=>'<g transform="translate(244 112)"><circle r="35" fill="#FEFEFB" stroke="#E6EDE4" stroke-width="2"/><g transform="translate(-17 -17) scale(1.4)" fill="none" stroke="#6C8876" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">'+(iconPath[kind]||iconPath.star)+'</g></g>';
const art=(key,symbol,small)=>'<svg viewBox="0 0 320 174" role="img" aria-label="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><ellipse cx="158" cy="159" rx="127" ry="10" fill="#867F71" opacity=".12"/><circle cx="286" cy="30" r="27" fill="#fff" opacity=".5"/>'+(artBases[key]||artBases.coffee)+(small?'':sceneSymbol(symbol||'star'))+'</svg>';
const JOURNEYS={
coffee:{name:'A café with Maya',nav:'Coffee shop',short:'A coffee break, with the baby',world:'near',color:'#fae9df',tone:'#936b58',intro:'Picture the little moments, so the real outing feels familiar.',items:[
{name:'Leave',symbol:'bag',when:'AT HOME',title:'A small plan is enough.',text:'Pick one nearby café. Leaving after a feed may buy you a calmer stretch, but you do not need perfect timing.',tip:'Take along',note:()=>bagLine(),ask:'What if she falls asleep just before you leave?',answer:'You can adjust the plan. A short walk later—or skipping the café today—still works.'},
{name:'Arrive',symbol:'stroller',when:'AT THE CAFÉ',title:'Find your spot and settle in.',text:'Use a stroller with its brakes on, or a properly fitted carrier with Maya’s face visible. Keep hot drinks well away from her.',tip:'If she gets hungry',note:()=>milkLine(),ask:'What if there is nowhere to change her?',answer:'A restroom changing station is ideal. Otherwise use your changing pad on a clean, secure, flat surface, keeping a hand on her.'},
{name:'If she fusses',symbol:'heart',when:'REAL LIFE HAPPENS',title:'You can change the plan.',text:'A feed, a quick walk outside or an early exit are all fine. You do not need to finish your coffee to call it an outing.',tip:'Remember',note:'Crying in public is an ordinary baby thing, not a sign the outing went wrong.',ask:'What if people look at us?',answer:'Focus on Maya and what she needs. You are allowed to comfort, feed, or head home at your own pace.'}
],more:[['Can I feed her in the café?',()=>milkLine()],['Do we need a stroller?', 'A stroller or a supportive carrier can both work. Follow the manufacturer’s instructions and keep her airway clear.']]},
walk:{name:'A walk together',nav:'Walk or park',short:'Fresh air without a big plan',world:'near',color:'#e8efe3',tone:'#657c60',intro:'A few minutes out can be a whole outing.',items:[
{name:'Dress',symbol:'sun',when:'BEFORE THE DOOR',title:'Think comfort, not a fixed number of layers.',text:'Dress for the conditions, keeping Maya’s face uncovered and checking how her chest or back feels.',tip:'In a carrier',note:'Keep her face visible and her chin off her chest.',ask:'What if it is a very hot day?',answer:'Choose cooler hours, prioritize shade, and shorten or skip the outing if the heat is extreme.'},
{name:'Explore',symbol:'stroller',when:'ON THE WALK',title:'She can just look around.',text:'You do not need an activity. Listen to her cues, keep stroller brakes for stops, and avoid draping a blanket over the entire canopy.',tip:'A good default',note:'Pick a small loop you can shorten whenever you like.',ask:'What if she falls asleep?',answer:'For a stroller, follow its approved sleep and recline instructions. Move her to a firm, flat sleep surface when your walk ends.'},
{name:'Home again',symbol:'home',when:'AFTER THE WALK',title:'Check warmth, then return to your routine.',text:'Take off extra layers indoors and return to feeds or naps as Maya needs.',tip:'Next time',note:'Try the same route, or go a little farther if you want to.',ask:'What if she did not enjoy it?',answer:'Try a different time of day, a shorter loop, or a carrier instead of a stroller.'}
],more:[['Should I face her outward in a carrier?', 'Only when your particular carrier allows it and she has the head control it requires. Facing in is always an option.'],['How much sun?', 'Keep babies shaded and dressed for the weather. Under 6 months, shade and clothing are the first line of protection.']]},
restaurant:{name:'Lunch out with Maya',nav:'Restaurant',short:'A meal somewhere new',world:'near',color:'#f5ebdf',tone:'#976f58',intro:'Where Maya sits, what she eats, and when to leave are the only big questions.',items:[
{name:'Arrive',symbol:'seat',when:'FINDING YOUR TABLE',title:'Start with where Maya will sit.',text:()=>food()?'If Maya can sit upright safely in a high chair, buckle the harness and keep her within reach. Otherwise use the stroller.':'A stroller can be an easy spot for Maya. Never balance an infant car seat on a high chair or restaurant table.',tip:'The rule',note:'Keep her seat stable and strapped in. Do not put the car seat on top of another seat.',ask:'Is a high chair okay at six months?',answer:'Age alone is not the test. She needs to sit upright securely in the particular high chair, with its harness used correctly.'},
{name:'Eat',symbol:'milk',when:'WHEN THE FOOD ARRIVES',title:'Keep your food and her food separate.',text:()=>food()?'Offer a food she already handles, safely prepared for her skills, and supervise every bite. Hot plates stay out of reach.':'A milk feed is enough for Maya at this stage. Hot plates and drinks stay away from little hands.',tip:'For her',note:()=>food()?'A familiar food and her usual milk are plenty. No need to try something new here.':milkLine(),ask:'What if she wants food from my plate?',answer:()=>food()?'Check the texture and choking risk before sharing. If you are unsure, stick with food you brought.':'You can include her at the table without offering solids before she is ready.'},
{name:'Head out',symbol:'heart',when:'WHEN SHE IS DONE',title:'Leaving early is always an option.',text:'Pay when you can, take a walk outside or pack up. The outing is yours to adjust.',tip:'Next time',note:'You now know which part of the outing takes the most preparation.',ask:'What if she cries before our food arrives?',answer:'Offer comfort, a feed, or a quick reset. You can also take your food to go. No need to push through.'}
],more:[['What about the high-chair strap?', 'Use the restraint every time, and keep an adult right next to Maya.'],['What about choking?', 'Keep Maya upright, prepare foods to match her developmental skills and supervise each bite.']]},
grocery:{name:'A quick store run',nav:'Grocery store',short:'The cart, the aisle and the checkout',world:'near',color:'#e6efe7',tone:'#6d896e',intro:'A grocery trip is mostly a question of where Maya rides.',items:[
{name:'Get out',symbol:'stroller',when:'IN THE PARKING LOT',title:'Keep the car seat off the shopping cart.',text:'Never place an infant car seat on top of a shopping cart. It can tip. A stroller or carrier may be easiest.',tip:'If using the cart seat',note:'Only when Maya can sit upright steadily and the seat is appropriate; buckle its restraint.',ask:'Can the infant carrier clip onto the cart?',answer:'No. Infant car seats should not ride on the top of a shopping cart, even if they seem to lock in.'},
{name:'Shop',symbol:'shop',when:'IN THE AISLES',title:'Make it a short list.',text:'Choose a few essentials, keep Maya securely positioned, and keep hot food or dangling items out of reach.',tip:'Feeding',note:()=>milkLine(),ask:'What if the diaper leaks?',answer:'Use a secure changing surface or your changing pad. You can leave the cart and finish another day.'},
{name:'Checkout',symbol:'bag',when:'ON THE WAY OUT',title:'There is no need to rush.',text:'Take a moment to settle Maya before driving. Check that she is correctly buckled in her rear-facing seat.',tip:'Before leaving the car',note:'Every time you park, check the back seat before walking away.',ask:'What if Maya is crying in the car?',answer:'Pull over in a safe place before checking on or comforting her.'}
],more:[['What if she is not ready for the cart seat?', 'Use her stroller or a suitable carrier rather than putting the car seat on the cart.'],['What belongs in the bag?',()=>bagLine()]]},
road:{name:'A longer drive',nav:'Road trip',short:'Stops, feeds and a safe car seat',world:'far',color:'#e7eee8',tone:'#5b7967',intro:'The secret is to think in stops rather than a perfect arrival time.',items:[
{name:'Buckle in',symbol:'car',when:'BEFORE YOU LEAVE',title:'The car seat comes first.',text:'Rear-facing, at the correct recline, with a snug harness. Avoid bulky coats or unapproved inserts. Soft toys are best.',tip:'Plan ahead',note:'For a daytime drive, consider a break about every 2–3 hours and sooner if Maya needs it. Ask your care team about extra precautions for premature infants.',ask:'Can she sleep during the drive?',answer:'A properly installed car seat is for use while traveling. After arrival, move her to a firm, flat sleep space.'},
{name:'Take a break',symbol:'clock',when:'AT A SAFE STOP',title:'Feeds happen out of the car seat.',text:'Pull over safely, unbuckle Maya, and let her eat, stretch and have a diaper change.',tip:'What to bring',note:()=>milkLine(),ask:'Can I feed while someone else drives?',answer:'No. Maya should remain buckled in while the car is moving. Stop for feeds.'},
{name:'She cries',symbol:'heart',when:'IN THE CAR',title:'Pull over before comforting her.',text:'If Maya needs attention, find a safe stopping place. Do not turn around or reach back while driving.',tip:'If you are driving solo',note:'Build in extra time and only check on her while safely parked.',ask:'What if we are stuck in traffic?',answer:'Wait until you can park safely to unbuckle or feed. Bring extra supplies in case the drive takes longer.'},
{name:'You arrive',symbol:'home',when:'AT YOUR DESTINATION',title:'Move her out of the seat to rest.',text:'Car seats are for travel. For ongoing sleep, move Maya to a firm, flat crib or play yard.',tip:'Good to know',note:'Your trip can take longer than the map says. That is okay.',ask:'Can the car seat be her bed tonight?',answer:'No. Use a separate safe sleep surface at the destination.'}
],more:[['What if Maya was born early?', 'Ask her pediatrician about any car-seat travel limits or special guidance.'],['How often should we stop?', 'Plan frequent breaks. Guidance often suggests around every 2–3 hours during daytime travel, sooner if your baby needs it.']]},
flight:{name:'Your first flight together',nav:'Flying',short:'Booking, airport, airplane and landing',world:'far',color:'#e4eff0',tone:'#5f8692',intro:'See the airport from Maya’s point of view, one moment at a time.',items:[
{name:'Book',symbol:'seat',when:'BEFORE THE AIRPORT',title:'Her own seat is the safest choice.',text:'A ticketed seat with an FAA-approved car seat protects Maya best during turbulence. Lap infants under 2 are allowed on many flights, but are less protected.',tip:'Look for',note:'A car seat approved for aircraft use. Check your airline’s policy before booking.',ask:'Can she fly on my lap?',answer:'Many airlines permit it for children under 2. A separate seat with an approved restraint is safer, particularly in turbulence.'},
{name:'Security',symbol:'milk',when:'AT TSA',title:'You can bring baby milk through.',text:()=>state.feed==='nurse'?'Breast milk and cooling accessories may exceed the usual 3.4 oz liquids limit. Tell the TSA officer before screening.':state.feed==='formula'?'Formula, water for infant feeding and cooling accessories may exceed the usual 3.4 oz limit. Tell the officer before screening.':'Breast milk, formula, water for infant feeding and cooling accessories may exceed the usual 3.4 oz limit. Tell the officer before screening.',tip:'Make it easier',note:'Keep feeding supplies easy to take out for additional screening.',ask:'Do I have to throw away a 6 oz baby bottle?',answer:'No. Formula and breast milk are allowed in quantities greater than the ordinary 3.4 oz liquids limit, subject to screening.'},
{name:'Gate',symbol:'stroller',when:'BEFORE BOARDING',title:'Find out where your stroller goes.',text:'Ask staff if it can be gate-checked and where you will retrieve it. Policies and access vary by airline and airport.',tip:'Keep close',note:'Bring diapers, feeding supplies, a spare outfit and a few extra essentials in your carry-on.',ask:'Can I bring our car seat aboard?',answer:'If Maya has her own seat, check that the car seat is approved for aircraft use and fits the airline’s requirements.'},
{name:'On board',symbol:'plane',when:'IN THE AIR',title:'Comfort first, perfect routine later.',text:'A pacifier or feed during pressure changes may help if she wants it. Keep Maya safely secured whenever instructed, especially during turbulence.',tip:'If she cries',note:'Offer comfort or a feed when appropriate. Walk the aisle only when the seat-belt sign is off.',ask:'Should I unbuckle her car seat to feed at takeoff?',answer:'Follow the crew’s instructions for restraints. If she is buckled into her own approved seat during takeoff, keep her secured and offer a pacifier or other comfort.'},
{name:'Land',symbol:'home',when:'AT YOUR DESTINATION',title:'Return to what feels familiar.',text:'Short trips may work with the home nap schedule. With time zones, adjust gradually and let Maya’s cues lead.',tip:'For the first night',note:'Have a safe crib or play yard ready if you are staying away.',ask:'What if naps are totally off today?',answer:'Travel days can be unpredictable. Prioritize feeding, comfort and safe sleep rather than a perfect schedule.'}
],more:[['What ID does Maya need?', 'For U.S. domestic flights, TSA does not require ID for a child under 18 traveling with an adult, but your airline may ask for proof of age. Check airline requirements.'],['How many diapers?', 'Bring more than you expect for the journey, including possible delays.'],['What if she needs a diaper change?', 'Ask cabin crew which restroom has a fold-down changing table.']]},
overnight:{name:'A night away from home',nav:'Staying over',short:'Crib, room check and bedtime',world:'far',color:'#f0e8ef',tone:'#8b6f89',intro:'The unfamiliar room gets easier once her sleep space is ready.',items:[
{name:'Before',symbol:'home',when:'BEFORE YOU GO',title:'Ask about the crib first.',text:'Confirm a safety-approved crib or play yard with a firm, flat mattress and fitted sheet. Bring your own if needed.',tip:'Pack',note:'The usual sleep sack and the fitted sheet specifically made for the sleep surface.',ask:'Can she sleep in the hotel bed?',answer:'No. An adult bed, couch or armchair is not a safe sleep surface for an infant.'},
{name:'Arrive',symbol:'shield',when:'IN THE NEW ROOM',title:'Do a ten-minute room sweep.',text:()=>overage()?'Move medicines, cleaning products, cords and small objects out of reach. Block stairs, check windows and keep bathroom doors closed.':'Check the crib, cords, windows and where bags or medicines are stored. Keep small items away from Maya.',tip:'At any age',note:'Keep the sleep space bare and away from windows or dangling cords.',ask:'What if the crib looks old?',answer:'Check its condition and safety standards. If you cannot confirm it is safe, use a suitable crib or play yard you trust.'},
{name:'Bedtime',symbol:'clock',when:'WHEN LIGHTS GO DOWN',title:'Take your usual routine with you.',text:'A familiar feeding and bedtime sequence may make the new room feel less strange. Put Maya on her back in her own bare sleep space.',tip:'Remember',note:'Firm, flat mattress, fitted sheet, no pillows, loose blankets, bumpers or toys.',ask:'What if she rolls over herself?',answer:'Always place her on her back. If she can roll both ways independently, follow current safe-sleep guidance and keep the crib empty.'},
{name:'Overnight',symbol:'heart',when:'WHEN SHE WAKES',title:'A different night can still be normal.',text:'Keep the night calm, follow her usual feeding needs and use familiar comfort cues. You do not need to recreate your home perfectly.',tip:'In the morning',note:'Before you leave, check the crib, room and diaper bag for anything you brought.',ask:'What if family suggests a blanket or pillow?',answer:'You can keep the rule simple: she sleeps on her back in her own crib, with no loose items.'}
],more:[['What about a travel crib?', 'Use a safety-approved play yard according to its instructions, including its own mattress and approved fitted sheet.'],['What about pets?', 'Never leave Maya alone with an animal, even one that seems gentle.']]},
water:{name:'A day at the water',nav:'Pool or beach',short:'Shade, water and warm dry clothes',world:'far',color:'#e2f0f2',tone:'#608a95',intro:'A little splash is plenty. Hands-on supervision is the whole plan.',items:[
{name:'Before',symbol:'sun',when:'PICK YOUR TIME',title:'Build the day around shade.',text:'Go early or late when it is cooler. Bring a hat, sun protection, dry clothes and the usual feeding supplies.',tip:'Sun protection',note:()=>state.age<6?'Under 6 months, shade and protective clothes come first.':'Use shade, a hat, protective clothes and broad-spectrum SPF 30+ as directed.',ask:'Do babies under six months wear sunscreen?',answer:'Shade and clothing are best. If adequate shade is unavailable, ask your pediatrician about a small amount on exposed areas.'},
{name:'In the water',symbol:'water',when:'POOL OR SHORE',title:'Stay close enough to hold her.',text:'An adult stays within arm’s reach the whole time. Float rings and inflatable seats cannot prevent drowning.',tip:'Make it brief',note:'Young babies may get cold quickly. Take frequent breaks and stay with her.',ask:'Are baby floats okay if I am nearby?',answer:'They are not safety devices. Keep hands-on supervision and stay within arm’s reach.'},
{name:'After',symbol:'home',when:'DRY AND WARM',title:'Wrap up, change and feed.',text:'Dry Maya promptly after water play, switch to warm clothes and offer her usual milk feeds.',tip:'Check the ground',note:'Sand and pool decks can be hot enough to burn bare feet or hands.',ask:'What if her lips look blue?',answer:'Get her out and warm her. Blue lips with breathing trouble, unusual limpness or unresponsiveness require urgent medical care.'}
],more:[['Can she drink pool water?', 'Try to prevent swallowing pool water. For routine hydration, offer her usual breast milk or formula.'],['What about snacks?',()=>food()?'Bring familiar, safely prepared food. Eating must happen seated upright and supervised, away from water.':'Milk feeds are enough at this stage.']]},
abroad:{name:'Taking Maya abroad',nav:'International trip',short:'Passport, vaccines, food and care',world:'far',color:'#e5efe6',tone:'#5d8469',intro:'Make the big decisions early so you can focus on the trip itself.',items:[
{name:'Documents',symbol:'document',when:'WHEN YOU BOOK',title:'Start with her passport.',text:'Leave time for an infant passport and any visa or entry requirements. Check consent-document rules if one parent is not traveling.',tip:'Bring copies',note:'Keep passport and emergency details accessible.',ask:'Does a baby need a passport?',answer:'For international air travel, yes. Check the requirements of every country on your itinerary.'},
{name:'Health',symbol:'shield',when:'4–6 WEEKS BEFORE',title:'Ask about destination-specific care.',text:'Talk with your pediatrician or a travel clinic about vaccines, malaria risk, water and insect protection.',tip:'Travel vaccines',note:'An early measles dose may be recommended from 6 months for some international travel. Ask your care team.',ask:'Do normal vaccines cover every trip?',answer:'Not always. Destination and age can change recommendations. Book a travel-health conversation before you leave.'},
{name:'Transit',symbol:'car',when:'ON THE WAY',title:'Bring a plan for car rides.',text:'Taxis and transfers may not have an appropriate infant seat. Bring one that you know how to install safely.',tip:'Before leaving',note:'Check local transport and whether your car seat meets the relevant requirements.',ask:'What if our taxi has no car seat?',answer:'Arrange a vehicle with an appropriate seat or bring yours. Do not assume the destination’s rules guarantee a safe setup.'},
{name:'There',symbol:'water',when:'AT YOUR DESTINATION',title:'Food, water and mosquitoes matter.',text:'Use safe water for preparing bottles and cleaning equipment. Take destination-specific steps to avoid insect bites and foodborne illness.',tip:'Have a backup',note:'Know a nearby medical facility and the local emergency number.',ask:'What if Maya gets sick abroad?',answer:'Seek prompt medical care for concerning fever, dehydration, trouble breathing, or a baby who is difficult to wake. Malaria-risk locations need special urgency.'}
],more:[['What about safe formula water?', 'Boiling or bottled-water recommendations vary by destination and health risks. Ask your travel-health clinician for the specific location.'],['What about mosquitoes?', 'Use age-appropriate insect protection, stroller netting and destination-specific clinician guidance.']]}
};

/* Optional decisions, not questions parents must answer. We show how the
   same outing can work differently depending on their actual situation. */
const DECISIONS={
 'flight:0':{question:'How might you travel?',options:[
  {id:'seat',name:'Her own seat',help:'Most protected',detail:'Buy a separate ticket and check that Maya’s restraint is approved for aircraft use. Follow the airline’s instructions for where it can be installed.'},
  {id:'lap',name:'On your lap',help:'Allowed on many flights',detail:'This may be allowed for children under 2, but the FAA says a properly approved child restraint in a separate seat is safer, particularly during turbulence.'}
 ]},
 'restaurant:0':{question:'Where will Maya sit?',options:[
  {id:'stroller',name:'In the stroller',help:'Works at many ages',detail:'Use her stroller’s appropriate position and harness, keep brakes on and keep hot drinks away.'},
  {id:'chair',name:'In a high chair',help:'If she sits securely',detail:'Only if Maya can sit upright steadily in that high chair. Use its harness, supervise closely and keep her back from hot plates and table edges.'}
 ]},
 'grocery:0':{question:'Where should Maya ride?',options:[
  {id:'carrier',name:'Carrier or stroller',help:'A good default',detail:'A properly fitted carrier or stroller works without balancing an infant seat on a shopping cart.'},
  {id:'cart',name:'Cart’s own seat',help:'If she can sit securely',detail:'Use this only if Maya sits upright steadily, the cart is suitable for her, and the cart’s built-in restraint is buckled. Never place an infant car seat on the cart.'}
 ]},
 'overnight:0':{question:'What sleep space will you have?',options:[
  {id:'provided',name:'Crib provided',help:'Check it on arrival',detail:'Confirm it meets current safety requirements, has all its parts, and has a firm flat mattress and fitted sheet. Keep it empty.'},
  {id:'bring',name:'Bringing our own',help:'A familiar play yard',detail:'Use a safety-approved play yard with only its manufacturer-specified mattress and approved fitted sheet, following its instructions.'}
 ]}
};
const choicePanel=()=>{
 const key=state.key+':'+state.moment,d=DECISIONS[key];if(!d)return '';
 const selected=state.choices[key]||null;
 return '<div class="real-choice"><div class="real-choice-title">'+pretty(d.question)+'</div><div class="real-choice-options">'
  +d.options.map(x=>'<button class="real-choice-option'+(selected===x.id?' selected':'')+'" data-choice="'+x.id+'" aria-pressed="'+(selected===x.id)+'"><b>'+pretty(x.name)+'</b><small>'+pretty(x.help)+'</small></button>').join('')+'</div>'
  +(selected?'<p class="real-choice-result" role="status">'+pretty(d.options.find(x=>x.id===selected).detail)+'</p>':'')+'</div>';
};

const tiny=(key)=>key==='flight'?'An airport feels less intimidating when you know the sequence.':key==='road'?'The drive can bend around Maya, not the other way around.':key==='overnight'?'The bedtime routine comes with you.':key==='water'?'The hands-on rule matters more than any gear.':'You can picture this before you go.';
function header(){
 return '<header class="appbar"><button class="brand" data-home aria-label="Ahead, return to Outings home">ahead<em>.</em></button>'
  +'<button class="profile-launch" data-sheet="settings" aria-label="Sample baby settings">Maya · '+state.age+' mo '+ico('chevron',14)+'</button></header>';
}
function theme(key){return({coffee:'#f8e5da',walk:'#e7eee5',restaurant:'#f6eadd',grocery:'#e6eee7',road:'#e8eee7',flight:'#e6eff1',overnight:'#f2ebf0',water:'#e5f1f2',abroad:'#e8f1e8'})[key]||'#f8e5da'}
function card(key,index){const d=JOURNEYS[key];return '<button class="world-card'+(index===0&&state.world==='near'?' wide':'')+'" style="--card-bg:'+d.color+';--card-text:'+d.tone+'" data-trip="'+key+'">'
 +'<span class="world-art">'+art(key,'star',true)+'</span>'
 +'<span class="copy"><b>'+pretty(d.nav)+'</b><small>'+pretty(d.short)+'</small></span><span class="arrow" aria-hidden="true">↗</span></button>'}
function home(){
 const featured=state.age<4?'coffee':state.age>=9?'grocery':'restaurant';
 const d=JOURNEYS[featured];
 const near=['coffee','walk','restaurant','grocery'],far=['road','flight','overnight','water','abroad'],items=state.world==='near'?near:far;
 const note=state.age>=9?'As Maya reaches and moves more, do a quick safety scan in new places.':state.age>=6&&state.solids?'If Maya has started solids, bring a familiar safe food when eating out.':'Milk, diapers, a spare outfit and a flexible plan go a long way.';
 return '<main class="screen"><div class="home-intro"><div class="eyebrow">OUTINGS &amp; TRAVEL</div><h1>See yourself doing it.</h1>'
  +'<p>Pick somewhere you want to go with Maya. Get a one-minute picture of how it actually works.</p></div>'
  +'<section class="feature" aria-label="Suggested first outing"><div class="feature-content"><div class="eyebrow">AN EASY PLACE TO BEGIN</div>'
  +'<h2>'+pretty(d.name)+'</h2><p>'+pretty(state.age<4?'One stop. One small adventure.':'You don’t need the perfect routine to go.')+'</p>'
  +'<button data-trip="'+featured+'">Picture the outing '+ico('arrow',15)+'</button></div><div class="feature-art">'+art(featured,'star',true)+'</div></section>'
  +'<section class="world-choice"><div class="smallheading"><div><div class="eyebrow">WHEN YOU HAVE A PLAN</div><h2>Where to?</h2></div></div>'
  +'<div class="world-toggle" role="group" aria-label="Outing distance"><button data-world="near" class="'+(state.world==='near'?'on':'')+'" aria-pressed="'+(state.world==='near')+'">Close to home</button>'
  +'<button data-world="far" class="'+(state.world==='far'?'on':'')+'" aria-pressed="'+(state.world==='far')+'">Going farther</button></div>'
  +'<div class="worlds">'+items.map((k,i)=>card(k,i)).join('')+'</div></section>'
  +'<section class="home-foot"><div class="eyebrow">FOR THE EVERYDAY STUFF</div><h2>A quick reference, whenever.</h2><div class="resource-cards">'
  +'<button data-sheet="gear:car">Car seat</button><button data-sheet="gear:carrier">Carrier</button><button data-sheet="gear:stroller">Stroller</button>'
  +'<button data-sheet="bag">Diaper bag</button><button data-sheet="gear:weather">Hot &amp; cold</button></div></section>'
  +'<div class="home-note">'+ico('info',18)+'<p>'+pretty(note)+'</p></div>'
  +'</main>';
}
function journey(){
 const d=JOURNEYS[state.key],i=Math.min(state.moment,d.items.length-1),s=d.items[i],last=i===d.items.length-1;
 const sceneNote=typeof s.note==='function'?s.note():s.note;
 const compare=choicePanel();
 const route='<div class="route-head"><b>THE REAL-LIFE ROUTE</b><span>Tap any moment</span></div><nav class="route" aria-label="Outing moments">'+d.items.map((it,n)=>'<button class="route-step'+(n===i?' active':n<i?' visited':'')+'" data-moment="'+n+'" aria-current="'+(n===i?'step':'false')+'"><span class="bubble">'+ico(it.symbol,18)+'</span><label>'+pretty(it.name)+'</label></button>').join('')+'</nav>';
 return '<main class="screen journey"><div class="backbar"><button class="back-button" data-home>'+ico('back',17)+' All outings</button><span class="badge">'+(i+1)+' of '+d.items.length+' moments</span></div>'
  +'<div class="journey-head"><div class="eyebrow">PICTURE THE OUTING</div><h1>'+pretty(d.name)+'</h1><p>'+pretty(d.intro)+'</p></div>'
  +route
  +'<section class="moment-scene" style="--scene-bg:'+theme(state.key)+'"><div class="moment-art">'+art(state.key,s.symbol,false)+'</div>'
  +'<div class="moment-caption"><div class="eyebrow">'+pretty(s.when)+'</div><h2>'+pretty(s.title)+'</h2><p>'+pretty(value(s.text))+'</p>'
  +compare
  +'<div class="moment-note">'+ico(s.symbol,17)+'<div><b>'+pretty(s.tip)+'</b><span>'+pretty(sceneNote)+'</span></div></div></div></section>'
  +'<section class="whatif"><div class="title">WHAT IF THIS HAPPENS?</div><button class="whatbutton" data-whatif aria-expanded="'+state.expanded+'">'+pretty(s.ask)+ico(state.expanded?'back':'plus',18)+'</button>'
  +(state.expanded?'<div class="answer">'+pretty(value(s.answer))+'</div>':'')+'</section>'
  +'<div class="inline-more">Other things you might wonder <button data-sheet="answers">Quick answers '+ico('chevron',13)+'</button></div>'
  +'<div class="journey-foot">'+(i>0?'<button class="prev" data-prev>'+ico('back',17)+'</button>':'')
  +'<button class="next" '+(last?'data-home':'data-next')+'>'+pretty(last?'Explore another outing':'Next: '+d.items[i+1].name)+' '+ico('arrow',16)+'</button></div>'
  +'<div class="journey-secondary"><button data-sheet="bag">What to bring</button><button data-sheet="gear:car">Car-seat basics</button></div></main>';
}
function gearSheet(which){
 const g={
car:{title:'Car seat essentials',desc:'The safety check that matters on every drive.',facts:[
 ['Seat', 'Use a rear-facing seat as long as the child fits within its rear-facing limits. The back seat is the safest position.'],
 ['Harness','Straps should be snug, with the chest clip at armpit level. No puffy coat under the harness.'],
 ['Installation','Follow the car seat and vehicle instructions. A certified car-seat technician can check the installation.']]},
carrier:{title:'Carrier basics',desc:'Comfortable carrying with the airway always in view.',facts:[
 ['Breathing','Keep Maya’s face visible, nose and mouth clear, and chin off her chest.'],
 ['Position','Support her back and hips according to the carrier’s instructions. Keep her close enough to kiss.'],
 ['Facing out','Check the carrier’s developmental and size restrictions. Do not let her sleep facing outward.']]},
stroller:{title:'Stroller basics',desc:'A stable seat and clear airflow make outings easier.',facts:[
 ['Every time','Use the harness and the brakes when stopped. Avoid heavy bags hanging from the handles.'],
 ['Young babies','Use an age-appropriate flat recline or approved attachment; follow the manual.'],
 ['Airflow','Do not cover the entire stroller with a blanket; it can trap heat.']]},
weather:{title:'Hot and cold outings',desc:'Dress for the actual conditions and check baby’s comfort.',facts:[
 ['Hot weather','Prioritize shade, cool hours, extra feeding as needed and a cooled car before buckling Maya in. Never leave a baby in a parked vehicle.'],
 ['Cold weather','Use thin layers under the car-seat harness. Put a blanket over the secured straps rather than a bulky coat underneath.'],
 ['When to head in','If Maya seems too hot or cold, adjust layers and move somewhere comfortable. Seek medical help for concerning illness or extreme symptoms.']]}
 };
 const d=g[which]||g.car;
 return {title:d.title,kicker:'USEFUL REFERENCE',body:'<p>'+pretty(d.desc)+'</p>'+d.facts.map(x=>'<div class="sheet-resource"><b>'+pretty(x[0])+'</b><p>'+pretty(x[1])+'</p></div>').join('')
 +'<p class="source-note">The existing Ahead prototype has fuller illustrated gear guides. This practice-run preview focuses on the experience of going out.</p>'};
}
function sheetData(){
 if(state.sheet==='settings')return {kicker:'SAMPLE BABY',title:'Make it Maya’s',body:'<div class="settings"><div><label for="age">Age</label><select id="age" data-age><option value="2"'+(state.age===2?' selected':'')+'>2 months</option><option value="6"'+(state.age===6?' selected':'')+'>6 months</option><option value="10"'+(state.age===10?' selected':'')+'>10 months</option></select></div>'
 +'<div><label for="feeding">Feeding</label><select id="feeding" data-feed><option value="nurse"'+(state.feed==='nurse'?' selected':'')+'>Breast milk (nursing)</option><option value="formula"'+(state.feed==='formula'?' selected':'')+'>Formula</option><option value="both"'+(state.feed==='both'?' selected':'')+'>Breast milk and formula</option></select></div>'
 +'<label class="switch-row" for="solids"><span>Already started solids</span><input id="solids" data-solids type="checkbox"'+(state.solids?' checked':'')+'></label></div>'
 +'<p>These controls simulate Ahead’s existing baby details. The real app should use what parents have already provided, not ask again.</p><button class="sheet-done" data-close>See the updated guide</button>'};
 if(state.sheet==='bag'){
   const d=JOURNEYS[state.key],extras=state.page==='journey'?d.name:null;
   const items=['Diapers and wipes','Spare outfit','Changing pad','An extra layer',milkLine()];
   if(food())items.push('Familiar, safely prepared food and a cup');
   const extrasBy={flight:['Extra feeds and diapers for delays','A change for the adult','Your airline’s car seat and stroller requirements'],road:['Soft toys','An extra feeding stop’s supplies'],overnight:['Appropriate crib or play yard','Sleep sack and approved fitted sheet'],water:['Swim diaper, towel and dry clothes','Shade and sun protection'],abroad:['Documents and travel-health essentials','Your car seat for transfers'],restaurant:['A bib and familiar safe food if eating solids'],coffee:['A few spare wipes for unexpected messes'],grocery:['A short shopping list'],walk:['Hat or shade, depending on conditions']};
   return {kicker:'WHAT TO BRING',title:extras||'The everyday bag',body:'<p>Everything you normally need, plus anything specific to this outing. No list to maintain.</p><div class="sheet-group">YOUR USUAL BAG</div>'
    +items.map(x=>'<div class="sheet-resource"><b>'+pretty(x)+'</b></div>').join('')
    +(extras?'<div class="sheet-group">JUST FOR THIS OUTING</div>'+((extrasBy[state.key]||[]).map(x=>'<div class="sheet-resource"><b>'+pretty(x)+'</b></div>').join('')):'')
    +'<p class="source-note">These are ideas, not a required packing count. Adjust for how long you’ll be out and how Maya is fed.</p>'};
 }
 if(state.sheet==='answers'){
  const d=JOURNEYS[state.key],qs=d.items.map(s=>[s.ask,s.answer]).concat(d.more||[]);
  return {kicker:'WHEN REAL LIFE HAPPENS',title:'Quick answers',body:'<p>Open any of these while planning or while you’re out.</p><div class="sheet-answers">'
    +qs.map(x=>'<div class="sheet-answer"><b>'+pretty(x[0])+'</b><p>'+pretty(value(x[1]))+'</p></div>').join('')+'</div>'};
 }
 if(state.sheet.startsWith('gear:'))return gearSheet(state.sheet.slice(5));
 return {kicker:'OUTINGS',title:'Useful reference',body:'<p>Go at your own pace.</p>'};
}
function overlay(){
 if(!state.sheet)return '';
 const s=sheetData();
 return '<div class="overlay" data-backdrop><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="sheet-head"><div><small>'+pretty(s.kicker)+'</small><h2 id="sheet-title">'+pretty(s.title)+'</h2></div>'
  +'<button class="sheet-close" data-close aria-label="Close">×</button></div><div class="sheet-content">'+s.body+'</div></section></div>';
}
function render(){
 root.innerHTML=header()+(state.page==='home'?home():journey())+overlay();
 const first=root.querySelector('.overlay .sheet-close');
 if(first)first.focus({preventScroll:true});
}
function top(){
 try{window.scrollTo({top:0,behavior:'instant'})}catch(e){window.scrollTo(0,0)}
}
function momentTop(){ const el=root.querySelector('.route-head');if(el&&typeof el.scrollIntoView==='function')el.scrollIntoView({block:'start',behavior:'instant'}); }
function goto(key){
 if(!JOURNEYS[key])return;
 state.key=key;state.moment=0;state.expanded=false;state.page='journey';state.sheet=null;render();top();
}
root.addEventListener('click',function(e){
 const t=e.target.closest('button');
 if(!t){
   if(e.target.matches('[data-backdrop]')){state.sheet=null;render()}
   return;
 }
 if(t.hasAttribute('data-home')){state.page='home';state.moment=0;state.expanded=false;state.sheet=null;render();top();return}
 if(t.hasAttribute('data-trip')){goto(t.getAttribute('data-trip'));return}
 if(t.hasAttribute('data-world')){state.world=t.getAttribute('data-world');render();return}
 if(t.hasAttribute('data-moment')){state.moment=Number(t.getAttribute('data-moment'));state.expanded=false;render();return}
 if(t.hasAttribute('data-next')){state.moment=Math.min(JOURNEYS[state.key].items.length-1,state.moment+1);state.expanded=false;render();momentTop();return}
 if(t.hasAttribute('data-prev')){state.moment=Math.max(0,state.moment-1);state.expanded=false;render();momentTop();return}
 if(t.hasAttribute('data-choice')){state.choices[state.key+':'+state.moment]=t.getAttribute('data-choice');render();return}
 if(t.hasAttribute('data-whatif')){state.expanded=!state.expanded;render();return}
 if(t.hasAttribute('data-sheet')){state.sheet=t.getAttribute('data-sheet');render();return}
 if(t.hasAttribute('data-close')){state.sheet=null;render();return}
});
root.addEventListener('change',function(e){
 const t=e.target;
 if(t.hasAttribute('data-age'))state.age=Number(t.value);
 else if(t.hasAttribute('data-feed'))state.feed=t.value;
 else if(t.hasAttribute('data-solids'))state.solids=!!t.checked;
 else return;
 // Keep this lightweight settings sheet open until the parent is done making changes.
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&state.sheet){state.sheet=null;render()}});
window.__outingPreview={getState:()=>({...state}),goto:key=>goto(key),setAge:n=>{state.age=n;render()},getJourneys:()=>Object.keys(JOURNEYS)};
render();
})();
