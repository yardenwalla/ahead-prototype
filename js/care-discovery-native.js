/* Ahead · Everyday Care: native, shareable experience preview.
   Uses the shipped app shell, shared H() components, real icon library, existing care detail guides and category routes.
   Only this preview branch loads this file; main is untouched. */
(function () {
'use strict';
const CAT='Daily rhythm';
const H=()=>window.__hub;
const F=s=>H().F(s);
function story(title,sub,guide,why,doThis,icon){return {title:title,sub:sub,guide:guide,why:why,act:doThis,icon:icon};}
var guides=[
{title:"Diapers & diaper-area care",subtitle:"Changes, cleaning, stool patterns and diaper rashes",icon:"diaper",topics:[
["Changing a diaper","Keep supplies within reach. Clean gently, front to back where appropriate, and change when wet or dirty."],
["The first wet and dirty diapers","Expect stools to change during the first days. Your care team can explain expected diaper counts for your baby."],
["Cleaning the diaper area","Use gentle cleaning appropriate to the baby's anatomy. If circumcised, follow the clinician's individual aftercare instructions; never forcibly retract a foreskin."],
["Diaper rash","Change promptly, let skin dry gently, and use protective cream when needed. Ask about persistent or worsening rashes."],
["Rolling and wriggly changes","Keep a hand on the baby on raised changing surfaces. Floor changes are often easier once rolling starts."],
["Poop after solids","Stool can change in smell, consistency and color once food is introduced; feeding guidance lives in Feeding."]
]},
{title:"Bathing & hair",subtitle:"Cord care, the first tub bath and the growing baby",icon:"bath",topics:[
["Umbilical cord care","Keep the cord area clean and dry; let the stump separate on its own. Ask the clinician about spreading redness, fever or discharge."],
["Sponge baths","A few sponge baths per week are usually enough while the umbilical area heals."],
["The first tub bath","Once the cord has fallen off and the area is healed, try a brief bath with a safe infant tub and warm water."],
["Cradle cap and hair","Wash hair gently. Avoid picking at flakes. Typical infant hair shedding often resolves as hair grows back."],
["Baths with a bigger baby","Use an appropriate bath setup and maintain continuous hands-on supervision. A bath seat is not a safety device."]
]},
{title:"Skin & rashes",subtitle:"What's normal, what's new, and what deserves attention",icon:"skin",topics:[
["Newborn skin","Peeling, small white bumps and temporary blotches are common early changes."],
["Baby acne","Small facial bumps often appear in early infancy. Gentle cleansing is usually sufficient."],
["Cradle cap","Greasy scalp scales often improve with gentle care. Do not pick or scrape."],
["Birthmarks and hemangiomas","Some birthmarks appear after birth. Ask a pediatrician early about a new or growing red or strawberry-like mark."],
["Dry skin and eczema","Persistent rough, itchy or inflamed patches may need a more specific skin-care plan."],
["Drool and heat rashes","Moisture and friction may irritate chin and neck skin. Pat dry rather than rubbing."]
]},
{title:"Clothes, sun & first shoes",subtitle:"Layers, sunscreen and changing footwear needs",icon:"shirt",topics:[
["Dressing for the weather","Use comfortable layers and monitor for overheating, especially indoors and during sleep."],
["Sun protection before six months","Prioritize shade and protective clothing. Limited sunscreen may be considered when other protection is unavailable."],
["Sunscreen from six months","Shade still comes first. Use broad-spectrum SPF 30 or higher on exposed skin according to the label."],
["Bare feet and first shoes","Bare feet help with balance on safe indoor surfaces. Use flexible shoes to protect feet when walking outside."]
]},
{title:"Gums & teeth",subtitle:"Drool, teething, brushing and first dental care",icon:"mouth",topics:[
["Mouthing and drooling","Chewing and drooling can increase before any teeth erupt."],
["Teething comfort","A chilled, not frozen, teether or gentle gum pressure can help. Avoid numbing gels and teething necklaces."],
["The first tooth","Begin brushing twice daily when the first tooth appears, with a soft brush and rice-grain-sized smear of fluoride toothpaste."],
["The first dental visit","Arrange a first visit after the first tooth and no later than the first birthday."]
]},
{title:"Nails, eyes, ears & nose",subtitle:"Small grooming routines, always available",icon:"hair",topics:[
["Nails","A baby nail file or clippers can help prevent scratches. Try when the baby is calm."],
["Eyes","Clean gently around the eyes using a clean, damp cloth; consult a clinician for concerning redness or swelling."],
["Ears","Wipe the outer ear. Never insert cotton swabs into the ear canal."],
["Nose","Gentle saline and suction can help with stuffiness when needed; avoid over-suctioning."]
]}
];
var episodes=[
{label:"First days",age:"FIRST WEEK",eyebrow:"SO MANY FIRSTS",title:"A brand-new baby, a lot of little changes",lead:"Some things that look surprising are simply part of adjusting to life outside the womb.",badge:"A FIRST-WEEK CHANGE",feature:story("The first diapers tell a story","That sticky, dark first poop changes as feeding gets established.",0,"The first stools are meconium, followed by transitional stools as milk feeding begins.","Notice the normal progression and ask your baby's care team about expected wet diapers and stool changes.","diaper"),more:[
story("The cord is drying and healing","The stump changes appearance before it falls off.",1,"The remaining stump dries and separates naturally.","Keep it clean and dry, and let it fall off on its own.","bath"),
story("Newborn skin can peel and spot","Tiny bumps, peeling and blotches can be normal.",2,"Newborn skin adapts to a different environment.","Clean gently and avoid picking or scrubbing.","skin"),
story("There's a gentle way to clean down there","Care varies with anatomy and any circumcision.",0,"Newborn genital skin is delicate, and a circumcision needs specific aftercare when relevant.","Use gentle cleaning and follow any individualized aftercare instructions.","heart")],
coming:"The stump will usually fall off in the next couple of weeks. Then tub baths can begin."},
{label:"5 weeks",age:"5 WEEKS",eyebrow:"NEW LITTLE CHANGES",title:"The newborn routine is changing",lead:"A few new things may appear on Maya's skin, and the first tub bath could be close.",badge:"A NEW FIRST",feature:story("The first tub bath is coming","When the cord has fallen off and the area has healed, sponge baths can become tub baths.",1,"The umbilical area needs time to heal before moving from sponge baths to tub baths.","Once healed, use a safe baby tub with warm water and maintain continuous hands-on supervision.","bath"),more:[
story("Baby acne might appear","Small facial bumps can show up in these early weeks.",2,"Baby acne is a common, often temporary skin change in early infancy.","Wash gently and avoid acne treatments unless a clinician recommends them.","skin"),
story("Cradle cap can show up","Greasy-looking flakes on the scalp are common.",2,"Cradle cap is a common infant scalp condition.","Wash gently, soften flakes if needed and avoid picking at them.","spark"),
story("Some birthmarks appear after birth","A new or growing strawberry mark is worth mentioning early.",2,"Some infantile hemangiomas appear in the first weeks and can grow quickly.","Ask a pediatrician about a new or growing strawberry-like mark, particularly one near an eye, mouth or another sensitive area.","heart"),
story("Baby hair may shed and regrow","A fuller head of hair can suddenly look much thinner.",1,"Baby hair goes through natural shedding and regrowth cycles in the first months.","Typical shedding needs no special treatment.","hair")],
coming:"Coming up: some breastfed babies begin pooping less often."},
{label:"2–3 months",age:"2–3 MONTHS",eyebrow:"A SMALL CHANGE",title:"The everyday routine is settling in",lead:"There may be fewer big firsts this month. A couple of small changes can still be worth knowing.",badge:"YOU MIGHT NOTICE",feature:story("Some breastfed babies start pooping less often","Going days between poops can become normal for some babies after the early weeks.",0,"As feeding matures, stool frequency may decrease in some breastfed babies. Soft stool, wet diapers, feeding and growth matter more than the count alone.","If your baby is feeding and growing well and stools stay soft, this can be normal. Contact your clinician for hard stools, poor feeding or other concerns.","diaper"),more:[
story("A bald patch may appear on the back of the head","Rubbing against the sleep surface can wear away some hair.",1,"Normal friction and hair cycling can leave temporary thinning.","No special hair treatment is usually needed. Continue safe back sleeping.","hair"),
story("Rough, dry patches may need different care","Not every skin change is baby acne.",2,"Dry or itchy patches can be a different kind of skin irritation, including eczema.","Use fragrance-free moisturizing care and discuss persistent or inflamed patches with your pediatrician.","skin")],
coming:"Coming up: more mouthing and drooling as Maya becomes more curious."},
{label:"4–5 months",age:"4–5 MONTHS",eyebrow:"MORE MOVEMENT",title:"Little movements, bigger changes",lead:"Reaching, rolling and exploring with the mouth can start changing everyday care.",badge:"GET READY FOR THIS",feature:story("Diaper changes are about to get interesting","Rolling can begin unexpectedly—even on a changing table.",0,"Growing mobility makes raised changing surfaces riskier before parents necessarily expect it.","Have everything within reach, keep a hand on Maya on raised surfaces, or change her on the floor.","diaper"),more:[
story("All that drool doesn't always mean teeth","Chewing and mouthing can start long before a tooth appears.",4,"Babies explore the world with their mouths as they develop.","Offer a safe teether and gently wipe excess drool.","mouth"),
story("Drool rash can show up","Wet skin around the chin and neck can become irritated.",2,"Frequent moisture and friction can irritate sensitive skin.","Gently pat the area dry and use simple protective skin care if needed.","skin"),
story("Bath time may be getting splashier","More kicking and twisting changes how baths feel.",1,"Maya is gaining more control over her movements.","Keep the bath setup suitable for her abilities and maintain hands-on supervision.","bath")],
coming:"At six months of chronological age, sunscreen can join the sun-care routine."},
{label:"6 months",age:"6 MONTHS",eyebrow:"A NEW OPTION",title:"A few care routines can change now",lead:"Some changes follow age. Others depend on whether Maya has started new things.",badge:"NEW AT SIX MONTHS",feature:story("Sunscreen can join the routine","Shade and protective clothing still matter—and now sunscreen can be part of the plan.",3,"General guidance for sunscreen use changes from six months of chronological age.","Apply broad-spectrum SPF 30+ sunscreen to exposed skin according to the label. Keep prioritizing shade and protective clothing.","sun"),more:[
story("The first tooth might be close","Some babies have a tooth already; others won't for months.",4,"Teeth emerge on a widely varying timeline.","When the first tooth appears, start brushing twice daily with a soft brush and rice-grain smear of fluoride toothpaste.","mouth"),
story("Diapers may change when solids begin","Stool color, smell and texture can look different with food.",0,"New foods affect what passes through the digestive tract.","Expect some differences once solids begin, and ask your clinician about unusual or concerning changes.","diaper"),
story("Steadier sitting changes bath time later","A different bath setup may become practical with new balance.",1,"Improving stability can change what bathing equipment fits.","Use a setup suitable for Maya's abilities and always supervise hands-on.","bath")],
coming:"The first tooth and steadier sitting can bring new care routines on Maya's timeline."},
{label:"8 months",age:"8 MONTHS",eyebrow:"NEW ABILITIES",title:"Familiar routines, new little twists",lead:"Sitting, wriggling and perhaps a first tooth can change how you care for Maya.",badge:"AN UPCOMING FIRST",feature:story("The first tooth changes the routine","Brushing begins with the first tooth, whenever it arrives.",4,"Teeth need cleaning as soon as they emerge, regardless of the child's age.","Use a soft infant toothbrush and a rice-grain smear of fluoride toothpaste twice daily once the first tooth appears.","mouth"),more:[
story("Bath time may need a different setup","A steady sitter is getting ready for more splashes.",1,"Better sitting balance changes which bathing setups can work safely.","Choose a suitable tub according to its instructions. Stay within hands-on reach, even with a bath seat.","bath"),
story("Diaper changes can become a wrestling match","Rolling and crawling make staying still less appealing.",0,"Maya is becoming more mobile and curious.","Try floor changes, a small toy or a familiar song.","diaper")],
coming:"By the first birthday, Maya should have a first dental visit—whether teeth arrive early or late."},
{label:"11 months",age:"11 MONTHS",eyebrow:"LOOKING TOWARD ONE",title:"The little routines keep growing",lead:"More movement and the approach of the first birthday bring a couple of new care decisions.",badge:"BEFORE THE FIRST BIRTHDAY",feature:story("The first dental visit is coming up","Your baby's first dental visit should happen by the first birthday.",4,"A dentist can check early teeth and gums and discuss prevention and brushing.","Arrange a visit with a dentist comfortable caring for infants, even if Maya has few or no teeth.","mouth"),more:[
story("First steps don't mean first shoes indoors","Bare feet can help babies explore balance.",3,"Feeling the ground helps babies practice movement and balance.","Try bare feet on safe indoor surfaces. Use flexible protective footwear for outdoor walking.","foot"),
story("Diaper changes may need a new strategy","Some babies would rather stand or crawl than lie down.",0,"Mobility and curiosity make it harder to stay still.","A safe floor setup and something interesting to hold can help.","diaper"),
story("Bath time changes with pulling up","A mobile baby may suddenly try standing in the tub.",1,"New abilities can change position quickly during routine care.","Keep a hand on Maya and a setup appropriate for her abilities. Never leave her unattended.","bath")],
coming:"After the first birthday, toddler mobility and more teeth bring another round of care changes."}
];

var state={age:1,screen:'home',story:0,guide:0,feed:'breast',cord:false,roll:false,solids:false,sit:false,tooth:false,walk:false,early:false,origin:'library'};
function sClone(x){return {title:x.title,sub:x.sub,guide:x.guide,why:x.why,act:x.act,icon:x.icon};}
function snapshot(){
var e=episodes[state.age],v={label:e.label,age:e.age,eyebrow:e.eyebrow,title:e.title,lead:e.lead,badge:e.badge,feature:sClone(e.feature),more:e.more.map(sClone),coming:e.coming};
if(state.age===1&&state.cord){
v.feature=story("The first tub bath can begin","The cord has fallen off and the area has healed. Maya's bath routine can change now.",1,"The belly button area has finished healing.","Try a brief bath in a safe infant tub with warm water. Keep one hand supporting Maya and never step away.","bath");
}
if(state.age===2&&state.feed==="formula"){
v.feature=story("Not every dry patch is baby acne","Rough, itchy patches may need different care from newborn bumps.",2,"Dry patches or eczema can appear as skin changes during infancy.","Use gentle, fragrance-free moisturizer and consult your pediatrician for persistent, spreading or uncomfortable rashes.","skin");
v.badge="WORTH KNOWING";
v.more=v.more.filter(function(x){return x.title!=="Rough, dry patches may need different care";});
v.lead="Not every week needs a new first. Here's one change to understand, plus what may be coming.";
}
if(state.age===3&&state.roll){
v.badge="NEW FOR MAYA";
v.feature=story("Diaper changes just got more interesting","Now that Maya is rolling, a safe changing setup matters more than ever.",0,"A baby who rolls can move off a raised changing surface in seconds.","Use the floor when practical. On a raised surface keep one hand on Maya and never leave her alone.","diaper");
}
if(state.age===4){
if(!state.solids){v.more=v.more.map(function(x){return x.title.indexOf("Diapers may change")===0?story("Diapers may change once solids begin","New foods can change stool color, texture and smell.",0,"The changes begin when Maya starts eating food.","Keep the reference handy for when solids start; until then, milk-fed stools may remain familiar.","diaper"):x;});}
else {v.more=v.more.map(function(x){return x.title.indexOf("Diapers may change")===0?story("Maya's diapers look different with solids","Thicker, smellier or more varied stools may be part of the change.",0,"New foods change the texture and appearance of stools.","Many differences are normal; white or gray stools need prompt medical advice.","diaper"):x;});}
}
if(state.age===5){
if(state.tooth){v.badge="A NEW DAILY ROUTINE";v.feature=story("Her first tooth is here!","One tiny tooth brings a brand-new twice-daily habit.",4,"Brushing protects teeth from the moment they emerge.","Brush morning and night with a soft baby toothbrush and a rice-grain smear of fluoride toothpaste. Arrange a dental visit by age one.","mouth");}
if(state.sit){v.more[0]=story("A steadier sitter changes bath time","A different bath setup may now work for Maya.",1,"New sitting balance changes what baby can manage in the bath.","Follow the tub's instructions, keep the water shallow, and maintain continuous hands-on supervision.","bath");}
}
if(state.age===6){
if(state.walk){v.badge="A NEW MILESTONE";v.feature=story("First steps don't mean first shoes indoors","Walking is new. Bare feet can still be the best choice on safe indoor floors.",3,"Bare feet allow Maya to feel the floor and practice balance.","Use bare feet indoors when safe; add soft, flexible shoes for outdoor protection.","foot");v.more[0]=story("Don't forget the first dental visit","Make an appointment by Maya's first birthday.",4,"Early dental care helps protect emerging teeth.","Book a first dental visit by age one.","mouth");}
else{v.more[0]=story("First shoes can wait for outdoor walking","There's no need to buy walking shoes before Maya needs them.",3,"Bare feet are useful for practicing balance on safe floors.","Save flexible shoes for when she starts walking outdoors.","foot");}
}
return v;
}

const ageStage=[0,1,1,2,2,3,3];
const topicPath=(k,stage)=>'chg:'+CAT+':d:c:'+k+':'+stage;
const guideRoute=[
  v=>topicPath('diapers',v),
  v=>topicPath('bath',v),
  v=>topicPath('skin',Math.max(1,v)),
  v=>topicPath('dress',v),
  v=>topicPath('teeth',Math.max(2,v)),
  v=>topicPath('nails',0)
];
const iconFor=n=>({hair:'nail',skin:'drop',diaper:'diaper',spark:'star',heart:'heart',mouth:'tooth',bath:'bath',shirt:'shirt',sun:'sun',foot:'stand'}[n]||'star');
const guideIcons=['diaper','bath','drop','shirt','tooth','nail'];
const guideColors=['#f0eafa','#e5f0f6','#fdece4','#eaf0e4','#f8efd9','#f0edf7'];
const previewScript='cd-native';
function openRoute(str){return "openPage('"+String(str).replace(/'/g,"\\'")+"')";}
function eventRoute(i){return openRoute('chg:'+CAT+':preview:story:'+i);}
function guidePath(i){let v=ageStage[state.age],x=guideRoute[i];return x?x(v):topicPath('bath',v);}
function nativeArt(){
  const group=[['diaper','cord','towel'],['bath','drop','nail'],['drop','diaper','shirt'],['roll','drop','bath'],['sun','tooth','bath'],['tooth','bath','diaper'],['tooth','stand','bath']][state.age]||['bath','drop','tooth'];
  return '<div class="cd-art" aria-hidden="true">'
    +'<span class="cd-art-main">'+hubArt(group[0],CAT)+'</span>'
    +'<span class="cd-art-secondary">'+hubArt(group[1],CAT)+'</span>'
    +'<span class="cd-art-tertiary">'+hubArt(group[2],CAT)+'</span></div>';
}
function featured(p){
  const x=p.feature;
  return '<button type="button" class="cd-feature hub-card" onclick="'+eventRoute(0)+'"><span class="cd-feature-top">'
    +'<span>'+F(p.badge)+'</span><span class="cd-feature-picto">'+hubArt(iconFor(x.icon),CAT)+'</span></span>'
    +'<strong>'+F(x.title)+'</strong><small>'+F(x.sub)+'</small>'
    +'<span class="cd-feature-link">See what this means <span aria-hidden="true">›</span></span></button>';
}
function row(x,i){
  return H().row({icon:iconFor(x.icon),cat:CAT,title:x.title,sub:x.sub,onclick:eventRoute(i+1)});
}
function previewControls(){
  const el=document.getElementById('cd-native-preview-controls');
  if(!el)return;
  const options=episodes.map((x,i)=>'<option value="'+i+'"'+(i===state.age?' selected':'')+'>'+x.label+'</option>').join('');
  let toggle='';
  if(state.age===1)toggle='<label><input type="checkbox" data-milestone="cord" '+(state.cord?'checked':'')+'> Cord healed</label>';
  if(state.age===2)toggle='<label>Feeding <select data-feeding="true"><option value="breast"'+(state.feed==='breast'?' selected':'')+'>Breast milk</option><option value="formula"'+(state.feed==='formula'?' selected':'')+'>Formula</option></select></label>';
  if(state.age===3)toggle='<label><input type="checkbox" data-milestone="roll" '+(state.roll?'checked':'')+'> Rolling now</label>';
  if(state.age===4)toggle='<label><input type="checkbox" data-milestone="solids" '+(state.solids?'checked':'')+'> Started solids</label>';
  if(state.age===5)toggle='<label><input type="checkbox" data-milestone="tooth" '+(state.tooth?'checked':'')+'> First tooth</label><label><input type="checkbox" data-milestone="sit" '+(state.sit?'checked':'')+'> Sitting steadily</label>';
  if(state.age===6)toggle='<label><input type="checkbox" data-milestone="walk" '+(state.walk?'checked':'')+'> Walking</label>';
  el.innerHTML='<div class="cd-toolbar-title">Everyday care <span>· native design preview</span></div><label class="cd-age-label">Age <select id="cd-age-select">'+options+'</select></label><div class="cd-toggles">'+toggle+'</div>';
}
window.careDiscoveryPreviewRenderControls=previewControls;
window.careDiscoveryPreviewState=state;
window.careHome=function (selected=null) {
  if(Number.isInteger(selected)&&selected>=0&&selected<=3){
    state.age=[0,1,3,5][selected];previewControls();
  }
  const p=snapshot(),h=H();
  // Render using exactly the category frame, navigation, hero, icon and detail building blocks used by Sleep & Feeding.
  const header=typeof monthlyPageHeader==='function'?monthlyPageHeader(CAT):'';
  let b=h.hero({eyebrow:p.eyebrow+' · '+p.age,title:p.title,lead:p.lead,extra:nativeArt()});
  b= b.replace('class="hub-hero"','class="hub-hero care-hero cd-native-hero"');
  b+=featured(p);
  b+=h.list('Also new around now',p.more.map(row));
  // A small count, positioned at the heading rather than another card.
  b=b.replace('<h2 class="hub-h2">Also new around now</h2>', '<div class="cd-updates-head"><h2 class="hub-h2">Also new around now</h2><span>'+p.more.length+' update'+(p.more.length===1?'':'s')+'</span></div>');
  b+=h.next('Coming up',p.coming,openRoute('chg:'+CAT+':preview:next'));
  b+='<button class="cd-basics hub-more" onclick="'+openRoute('chg:'+CAT+':preview:basics')+'"><span class="cd-basics-icon">'+hubArt('book',CAT)+'</span><span class="cd-basics-copy"><b>Everyday care basics</b><small>Step-by-step how-tos, always available</small></span><span class="hub-chev" aria-hidden="true">›</span></button>';
  if(state.early)b+=h.note('For babies born early, care changes follow the relevant timing or the skills Maya has actually reached. Sunscreen guidance uses chronological age.');
  return '<div class="quiet-category hub-page care-v2 care-discovery-native" data-overview="'+CAT+'" style="'+yearTheme(CAT)+'">'+header+b+'</div>';
};
function storyPage(i){
  const p=snapshot();const x=(i===0?p.feature:p.more[i-1]);if(!x)return window.careHome();
  const gi=x.guide||0,guide=guides[gi],h=H();
  const target=guidePath(gi);
  const special=x.title.toLowerCase();
  const corrected=/acne/.test(special)?'chg:'+CAT+':d:rash:acne':/cradle/.test(special)?'chg:'+CAT+':d:rash:cradle':/birthmark|strawberry/.test(special)?'chg:'+CAT+':d:rash:strawberry':/drool rash/.test(special)?'chg:'+CAT+':d:rash:drool':target;
  let inner='<h2 class="hub-h2">Why this happens</h2><section class="hub-card"><p class="cd-detail-p">'+F(x.why)+'</p></section>';
  inner+='<h2 class="hub-h2">What to know or do</h2><section class="hub-tip cd-now"><b>For '+F('Maya')+'</b> '+F(x.act)+'</section>';
  inner+=h.list('Practical care guide',[h.row({icon:guideIcons[gi],cat:CAT,title:guide.title,sub:'Open the full how-to and guidance',onclick:openRoute(corrected)})]);
  inner+=h.more('Back to what is changing',openRoute('chg:'+CAT));
  return h.detail(CAT,'Everyday care · '+episodes[state.age].label,x.title,x.sub,inner,iconFor(x.icon));
}
function basicsPage(){
  const h=H();
  const rows=guides.map((g,i)=>h.row({icon:guideIcons[i],cat:CAT,title:g.title,sub:g.subtitle,onclick:openRoute(guidePath(i))}));
  const inner=h.list('Always available',rows)+h.note('These are the existing care how-tos in Ahead, not new articles for every discovery.');
  return h.detail(CAT,'Everyday care','Everyday care basics','Everything you need for the everyday routines, whether or not they are new this month.',inner,'book');
}
const previousRoute=window.changesRoute;
window.changesRoute=function(p){
  if(p==='chg:'+CAT+':preview:basics')return basicsPage();
  if(p==='chg:'+CAT+':preview:next'){
    state.age=Math.min(episodes.length-1,state.age+1);previewControls();return window.careHome();
  }
  if(p.startsWith('chg:'+CAT+':preview:story:')){
    const i=Number(p.slice(('chg:'+CAT+':preview:story:').length));if(Number.isInteger(i))return storyPage(i);
  }
  return previousRoute(p);
};
window.careDiscoveryPreviewAge=function(age){
  age=Number(age);if(!Number.isInteger(age)||age<0||age>=episodes.length)return;
  state.age=age;previewControls();page='chg:'+CAT;render();window.scrollTo(0,0);
};
window.careDiscoveryPreviewInit=function(){
  const ctrl=document.getElementById('cd-native-preview-controls');if(!ctrl)return;
  ctrl.addEventListener('change',function(e){
    if(e.target.id==='cd-age-select'){window.careDiscoveryPreviewAge(e.target.value);return;}
    const k=e.target.dataset.milestone;
    if(k){state[k]=e.target.checked;page='chg:'+CAT;render();}
    if(e.target.dataset.feeding){state.feed=e.target.value;page='chg:'+CAT;render();}
  });
  previewControls();
};
})();
