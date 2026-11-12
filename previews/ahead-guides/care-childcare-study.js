(function aheadStudy(){
 const CATC="Daily rhythm",CATB="Childcare";
 const UX={mode:"proposed",section:"care",selectedCare:null,selectedTypes:[],age:2};
 const originalCare=window.careHome,originalRoute=window.changesRoute,originalYear=window.categoryYear,originalComplete=window.completeCategory;
 const P={diapers:["#e7effc","#46638c","diaper"],bath:["#e3f1f7","#2a6078","bath"],skin:["#fdeee6","#9a5a3c","drop"],clothes:["#efedff","#625084","shirt"],teeth:["#e6f5ec","#356651","tooth"],nails:["#fdeef2","#a24d6a","nail"],cord:["#fce4e6","#934b65","cord"],sun:["#fff3dc","#8a6a2a","sun"]};
 const KN={
 center:{name:"Daycare center",short:"Set hours · a group setting",fit:"You want predictable hours, a baby room and backup staff.",mind:"Group care often means more colds in the first year.",time:"Start early: infant rooms may have waitlists.",icon:"blocks"},
 home:{name:"Home daycare",short:"A smaller group",fit:"You want care in a smaller, home-like setting.",mind:"Ask what happens when the provider is sick or away.",time:"Ask about openings a few months before you need care.",icon:"home"},
 nanny:{name:"Nanny or nanny share",short:"One-on-one · at home",fit:"You want care in your home and a flexible daily routine.",mind:"You may handle household payroll, paid time off and backup care.",time:"Allow time for references, interviews and a paid trial.",icon:"hand"},
 family:{name:"Family or friends",short:"Someone you know",fit:"A loved one can help and your schedules align.",mind:"Agree on safe sleep, feeding and boundaries before regular care.",time:"Talk first and try a practice day together.",icon:"heart"},
 sitter:{name:"Babysitter",short:"A few hours of help",fit:"You need an occasional break, appointment or evening out.",mind:"Choose someone experienced with infants and explain emergency steps.",time:"Arrange a short introduction before the first time alone.",icon:"moon"},
 help:{name:"Extra help at home",short:"A helper · day or night",fit:"You want additional hands at home, including postpartum or overnight help.",mind:"Clarify responsibilities; different kinds of helpers provide different care.",time:"Look ahead for overnight or specialist support.",icon:"bag"}
 };
 const ORDER=["center","home","nanny","family","sitter","help"];
 const mx=()=>{const day=(NOW-parse(profile.dob))/864e5,m=typeof hubAgeFor==="function"?hubAgeFor("care",actualMonth()):developmentMonth(actualMonth());return day<28?0:m<4?1:m<7?2:3};
 const tooth=()=>answers.hasTooth==="Yes"||answers.tooth==="Yes";
 const roll=()=>answers.roll==="Yes"||["Both ways","Tummy to back","Back to tummy"].includes(answers.rollDirection);
 const sit=()=>answers.sit==="Yes";
 const healed=()=>answers.cordHealed==="Yes" || mx()>0 && answers.cordHealed!=="No";
 const route=(id)=>`openPage('chg:${CATC}:d:${id}')`;
 const tilesFor=v=>{
  const sunOk=actualMonth()>=6;
  return [
   {key:"diapers",name:"Diapers",line:v===0?"8–12 changes a day":v===1?"Wet or dirty? Change it":v===2?(roll()?"Rolling makes changes trickier":"Keep one hand on her"):"Wriggly? Give her a toy",answer:v===0?"About 8–12 diaper changes a day is common in the first weeks. Change when wet or dirty.":v===1?"Wet and dirty diapers still need changing, but poops may become less frequent.":roll()?"With a roller, set up every change first. A toy to hold can help, and you can change her on the floor.":"Keep supplies within reach and a hand on her. Rolling can start any day.",steps:["Put a fresh diaper, wipes and any cream within reach.","Keep a hand on Maya on any raised surface, even with a safety strap.","Clean gently, let skin dry and fasten without red marks."],link:v===0?"p:change":v===1?"p:fewer":"p:wriggly"},
   {key:"bath",name:"Bathing",line:v===0&&!healed()?"Sponge baths for now":v===1&&!healed()?"Sponge bath until healed":v===3&&sit()?"Big tub once sitting":"2–3 baths a week",answer:v===0&&!healed()?"Until her cord stump falls off and the area heals, sponge baths are the easiest choice.":v===1&&!healed()?"Continue sponge baths until the cord stump is off and the area has healed.":v===3&&sit()?"Once Maya sits steadily, the bigger tub may work. Bath seats don't replace your hands.":"Two or three baths a week is enough. Keep the water warm, not hot.",steps:v===0&&!healed()?["Warm the room and gather a towel and washcloth.","Wash one part of her body at a time, leaving the diaper area for last.","Keep the cord dry and pat between folds."]:["Gather everything before you start; never leave her alone.","Use shallow warm water, around 100°F, and support her throughout.","Take Maya with you if you must leave the room."],link:v===0&&!healed()?"p:sponge":v===1&&!healed()?"p:sponge":v===3&&sit()?"p:bigtub":"p:tub"},
   {key:"skin",name:"Skin",line:v===0?"Peeling can be normal":v===1?"Acne & cradle cap":v===2?"Drool rash is common":"Keep drool-prone skin dry",answer:v===0?"Newborn skin can peel or have tiny bumps. Many common changes need no treatment.":v===1?"Baby acne and cradle cap are common. Gentle washing is usually enough.":"Drool can irritate the chin and neck. Pat dry rather than rubbing.",steps:v<=1?["Keep washing gentle with plain water or mild fragrance-free cleanser.","Avoid picking flakes or squeezing bumps.","If a rash spreads, blisters, or comes with fever, call your pediatrician."]:["Pat the chin and neck dry after drooling.","Change damp bibs and use gentle, fragrance-free skin care.","Explore the rash guide if it looks unusual."],link:v===0?"p:newskin":v===1?"p:acne":"p:drool"},
   {key:"teeth",name:"Gums & teeth",line:tooth()?"Brush twice a day":v<=1?"No teeth yet? That's fine":"Chewing comes before teeth",answer:tooth()?"From the first tooth, brush morning and night with a rice-grain smear of fluoride toothpaste.":"Drooling and chewing can start long before a tooth appears. A cool teething ring may help.",steps:tooth()?["Use a soft baby toothbrush.","Add only a smear of fluoride toothpaste the size of a grain of rice.","Brush twice a day, including before bed. Book a first dental visit by age one."]:["Gently wipe gums with a clean, damp cloth.","Try a clean finger or a cool, firm teething ring for sore gums.","Skip numbing gels, teething necklaces and homeopathic tablets."],link:tooth()?"p:brush":v<=1?"p:gums":"p:teething"},
   {key:"clothes",name:"Clothes & sun",line:sunOk?"Shade + SPF 30":"Light layers & shade",answer:sunOk?"Shade and protective clothes still come first. At six months and older, use broad-spectrum SPF 30+ on exposed skin.":"Use light layers, shade and a wide-brimmed hat. Under six months, keep direct sun exposure minimal.",steps:sunOk?["Choose shade and lightweight protective clothing.","Use broad-spectrum SPF 30+ on uncovered skin.","Reapply about every two hours and after swimming."]:["Try about one more clothing layer than you are wearing, adjusting for temperature.","Feel her neck to check for overheating.","Use shade and protective clothing outdoors."],link:sunOk?"p:six":"p:shade"},
   {key:"nails",name:"Tiny essentials",line:"Nails, ears, nose & eyes",answer:"These are small jobs. You don't need a complicated routine for them.",steps:["File or trim nails when Maya is calm or asleep.","Clean only the outside of the ears; don't put swabs inside.","Wipe sticky eyes gently with a clean, damp cloth. Get advice for redness or swelling."],link:"p:nailsnose"}
  ];
 };
 let expanded=null;
 function everyday(selected=null){
  const h=window.__hub,F=x=>h.F(x),now=mx(),v=Number.isInteger(selected)&&selected>=0&&selected<=3?selected:now;
  const stages=STAGE_TABLE[CATC].stages;
  const nav=h.pills("Everyday care by age",stages.map((x,i)=>({label:x.label,age:x.age,on:i===v,now:i===now&&isCurrent(),onclick:`openPage('chg:${CATC}:s:${i}')`})),CATC);
  const heroes=[
   ["Getting used to all the little jobs","Baths, diapers and skin care are new. You'll get the hang of them quickly."],
   ["Care gets a little easier","The cord heals, tubs replace sponge baths and some skin changes are normal."],
   ["Little hands, bigger messes","Drool and rolling may be changing the way the everyday jobs feel."],
   ["Care for a baby on the move","More splashing, wrigglier changes and maybe a first tooth."]
  ];
  const data=tilesFor(v);
  let body=`<header class="hub-hero care-hero study-care-hero"><p class="hub-eyebrow">${F(["Newborn","1–3 months","4–6 months","7–12 months"][v])}</p><h1>${F(heroes[v][0])}</h1><p class="hub-lead">${F(heroes[v][1])}</p></header>`;
  body+=`<h2 class="hub-h2 study-main-title">${F("What you need to know now")}</h2><div class="study-essentials">`;
  for(const x of data){
   const c=P[x.key],on=expanded===x.key;
   body+=`<button class="study-essential${on?" is-on":""}" aria-expanded="${on}" onclick="careUX.quick('${x.key}')"><span class="study-ic" style="--tbg:${c[0]};--tink:${c[1]}">${hubArt(c[2],CATC)}</span><span class="study-essential-name">${F(x.name)}</span><span class="study-essential-line">${F(x.line)}</span></button>`;
  }
  body+="</div>";
  const selectedData=data.find(x=>x.key===expanded);
  if(selectedData)body+=`<section class="study-answer" id="study-answer"><div class="study-answer-header"><span class="study-answer-kicker">QUICK ANSWER</span><button aria-label="Close quick answer" onclick="careUX.quick('${selectedData.key}')">×</button></div><h3>${F(selectedData.name)}</h3><p>${F(selectedData.answer)}</p><ol>${selectedData.steps.map(x=>`<li>${F(x)}</li>`).join("")}</ol><button class="study-go" onclick="${route(selectedData.link)}">Full ${F(selectedData.name.toLowerCase())} guide <span>›</span></button></section>`;
  body+=`<button class="hub-rough-card care-rash-card study-trouble" onclick="openPage('chg:${CATC}:d:look:${v}')"><span class="hub-rough-moon">${hubArt("eye",CATC)}</span><span class="hub-rough-copy"><b>Something look off?</b><small>${F(v===0?"Poop, rashes, the cord, eyes and more":v===1?"Poop, rashes, eyes and more":"Drool, rashes, poop and more")}</small></span><span class="hub-chev">›</span></button>`;
  if(v===0&&!healed())body+=`<p class="study-tiny-note">Cord care is included in Bathing. The stump usually falls off in 1–3 weeks.</p>`;
  const next=[["After the first weeks","Tub baths and baby skin"],["Around 4 months","Drool and busy hands"],["Around 7 months","First teeth and the bigger tub"],["After the first birthday","Toddler baths and first shoes"]][v];
  body+=h.next(next[0],next[1],v<3?`openPage('chg:${CATC}:s:${v+1}')`:`openPage('chg:${CATC}:d:after1')`);
  body+=h.note("Ages are typical. Follow the baby you have, not just the calendar.");
  return `<div class="quiet-category hub-page care-v2 study-care" data-overview="${CATC}" data-care-stage="${v}" style="${yearTheme(CATC)}">${monthlyPageHeader(CATC)}${nav}${body}</div>`;
 }
 function list(){try{return JSON.parse(localStorage.getItem("ahead-childcare-shortlist"))||{}}catch(e){return {}}}
 function selectedCandidate(){const l=list();for(const arr of Object.values(l)){const found=(arr||[]).find(x=>x.chosen);if(found)return found;}return null}
 const tone={center:["#e7effc","#46638c"],home:["#e6f5ec","#356651"],nanny:["#fdeef2","#a24d6a"],family:["#fdeee6","#9a5a3c"],sitter:["#ece8f8","#5b4f8a"],help:["#f6edf3","#a24d6a"]};
 function childcare(){
  const F=s=>window.__hub.F(s),chosen=selectedCandidate(),card=(()=>{try{return JSON.parse(localStorage.getItem("ahead-carecard"))||{}}catch(e){return {}}})();
  const months=actualMonth(),feed=(profile.feed||"Breast milk"),chosenKey=chosen?ORDER.find(k=>(list()[k]||[]).some(x=>x.chosen)):null;
  const hero=chosen?["YOU’VE CHOSEN CARE","Make the first handoff easier","A practice visit, a shared routine and a clear plan for questions make day one easier.","Get ready for day one","ready"]:
   ["FINDING SUPPORT","Care that works for your family","Daycare, a nanny, family or a few hours of help. Start with the kind of support you actually need.","See how to start","plan"];
  let out=`<div class="quiet-category hub-page study-childcare" data-overview="${CATB}" style="${yearTheme(CATB)}">${monthlyPageHeader(CATB)}<header class="hub-hero cc-hero study-cc-hero"><p class="hub-eyebrow">${hero[0]}</p><h1>${F(hero[1])}</h1><p class="hub-lead">${F(hero[2])}</p><button onclick="openPage('chg:${CATB}:d:${hero[4]}')">${F(hero[3])} ›</button></header>`;
  out+=`<div class="study-section-head"><h2 class="hub-h2">Explore your options</h2><small>Tap to preview. Choose two to compare.</small></div><div class="study-kind-grid">`;
  for(const key of ORDER){const t=KN[key],c=tone[key],on=UX.selectedTypes.includes(key);
   out+=`<button class="study-kind${on?" on":""}" aria-pressed="${on}" onclick="careUX.type('${key}')"><span class="study-kind-mark" style="background:${c[0]};color:${c[1]}">${hubArt(t.icon,CATB)}</span><b>${F(t.name)}</b><small>${F(t.short)}</small></button>`;
  }
  out+="</div>";
  const current=UX.selectedTypes;
  if(current.length){
   out+=`<section class="study-compare" id="study-compare"><div class="study-compare-top"><b>${current.length===1?"At a glance":"Side by side"}</b><button onclick="careUX.clearTypes()" aria-label="Clear care option comparison">Clear</button></div><div class="study-compare-cols">`;
   current.forEach(key=>{const t=KN[key];out+=`<div class="study-compare-col"><strong>${F(t.name)}</strong><p><span>GOOD FIT IF</span>${F(t.fit)}</p><p><span>KEEP IN MIND</span>${F(t.mind)}</p><p><span>WHEN TO LOOK</span>${F(t.time)}</p><button onclick="openPage('chg:${CATB}:d:${key}')">Questions & next steps ›</button></div>`});
   out+="</div></section>";
  }
  out+=`<button class="study-quiz" onclick="openPage('chg:${CATB}:d:fit')">Not sure which? Find your fit <span>›</span></button>`;
  out+=`<button class="hub-rough-card cc-card-button study-carecard" onclick="openPage('chg:${CATB}:d:card')"><span class="hub-rough-moon">${hubArt("notepad",CATB)}</span><span class="hub-rough-copy"><b>${F(name()+"’s care card")}</b><small>${F(card.saved?"Ready to send to any caregiver":"Feeds, naps and who to call, ready to share")}</small></span><span class="hub-chev">›</span></button>`;
  out+=`<h2 class="hub-h2 study-setup">Setting it up</h2><div class="hub-list">`;
  const actions=[
   ["pay","coin","Paying for care","Help from your state, work and taxes"],
   ["ready","bag","Get ready for day one","A practice day, care card and packing"],
   ["backup","shield","When care falls through","Sick days, closed days and a backup plan"],
   ["start","heart","Settle in",months>=7?"Daily updates and harder goodbyes":"The first weeks, daily updates and speaking up"]
  ];
  actions.forEach(([id,ic,title,sub])=>{
   out+=`<button class="hub-row study-setup-row" onclick="openPage('chg:${CATB}:d:${id}')"><span class="hub-dot">${hubArt(ic,CATB)}</span><span class="hub-row-copy"><b>${F(title)}</b><small>${F(sub)}</small></span><span class="hub-chev">›</span></button>`;
  });
  out+=`</div><p class="hub-foot">Every family’s situation is different. Choose what fits yours.</p></div>`;
  return out;
 }
 window.careHome=(...a)=>UX.mode==="original"?originalCare(...a):everyday(...a);
 window.changesRoute=function(p,...rest){
  if(UX.mode!=="original"&&p.startsWith("chg:Childcare:s"))return childcare();
  return originalRoute(p,...rest);
 };
 window.categoryYear=function(t,...a){return UX.mode!=="original"&&t===CATB?childcare():originalYear(t,...a)};
 window.completeCategory=function(t,...a){return UX.mode!=="original"&&t===CATB?childcare():originalComplete(t,...a)};
 function rerender(){const y=window.scrollY;render();window.scrollTo(0,y)}
 window.careUX={
  section(kind){UX.section=kind;UX.selectedCare=null;expanded=null;UX.selectedTypes=[];return openPage(kind==="care"?`chg:${CATC}:s:${UX.age}`:`chg:${CATB}:s:0`)},
  view(mode){UX.mode=mode;expanded=null;UX.selectedTypes=[];sync();this.section(UX.section)},
  quick(key){expanded=expanded===key?null:key;rerender();if(expanded)window.requestAnimationFrame(()=>document.querySelector("#study-answer")?.scrollIntoView({block:"nearest",behavior:"smooth"}))},
  type(key){const i=UX.selectedTypes.indexOf(key);if(i>=0)UX.selectedTypes.splice(i,1);else if(UX.selectedTypes.length>=2)UX.selectedTypes=[UX.selectedTypes[1],key];else UX.selectedTypes.push(key);rerender();if(UX.selectedTypes.length)window.requestAnimationFrame(()=>document.querySelector("#study-compare")?.scrollIntoView({block:"nearest",behavior:"smooth"}))},
  clearTypes(){UX.selectedTypes=[];rerender()},
  age(i){UX.age=i;const d=new Date(NOW.getTime());if(i===0)d.setDate(d.getDate()-10);else{d.setDate(1);d.setMonth(d.getMonth()-[0,2,5,9][i]);d.setDate(Math.min(NOW.getDate(),new Date(d.getFullYear(),d.getMonth()+1,0).getDate()))}profile={...profile,dob:iso(d),name:"Maya",pronouns:"she",due:"",early:false,feed:"Breast milk"};month=actualMonth();answers.roll=i>=2?"Yes":"No";answers.rollDirection=i>=2?"Both ways":"Not yet";answers.hasTooth=i===3?"Yes":"No";answers.tooth=i===3?"Yes":"No";answers.sit=i===3?"Yes":"No";answers.cordHealed=i===0?"No":"Yes";expanded=null;sync();this.section(UX.section)},
  flag(key){const on=key==="tooth"?answers.tooth==="Yes":key==="roll"?answers.roll==="Yes":key==="cord"?answers.cordHealed==="Yes":answers.sit==="Yes";const v=on?"No":"Yes";if(key==="tooth"){answers.hasTooth=v;answers.tooth=v}if(key==="roll"){answers.roll=v;answers.rollDirection=v==="Yes"?"Both ways":"Not yet"}if(key==="cord")answers.cordHealed=v;if(key==="sit")answers.sit=v;expanded=null;sync();rerender()}
 };
 function sync(){const root=document.getElementById("ahead-compare-controls");if(!root)return;root.querySelectorAll("[data-ux]").forEach(b=>b.classList.toggle("on",b.dataset.ux===UX.mode));root.querySelectorAll("[data-section]").forEach(b=>b.classList.toggle("on",b.dataset.section===UX.section));root.querySelectorAll("[data-age]").forEach(b=>b.classList.toggle("on",Number(b.dataset.age)===UX.age));root.querySelectorAll("[data-flag]").forEach(b=>{const on=b.dataset.flag==="tooth"?tooth():b.dataset.flag==="roll"?roll():b.dataset.flag==="sit"?sit():healed();b.classList.toggle("on",on)})}
 window.careUX.initialize=()=>{sync();window.careUX.age(2)};
})();