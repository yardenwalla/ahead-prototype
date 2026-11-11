
(function(){
"use strict";
const D=window.AHEAD_MORE_DATA||{};
const CATS=[["Sleep","Sleep","☾"],["Feeding","Feeding","◌"],["Development","Development & play","✳"],["Care","Everyday care","♡"],["Safety","Safety","◇"],["Health","Health","✚"],["Outings","Outings & travel","↗"],["Childcare","Childcare","⌂"]];
const COLORS={Development:["#eee5f5","#76548e","#d9c5e7"],Care:["#fae9dd","#975e4a","#f1d4c4"],Safety:["#f8eed8","#8e6a32","#e8d5a8"],Health:["#e5f0ed","#426d67","#c9e1d9"],Outings:["#e1eeed","#487b77","#bfdbd8"],Childcare:["#f2e5e6","#956370","#e5c8cc"]};
const originalView=document.getElementById("view"),phoneBody=document.querySelector(".phone .body"),oldTabs=document.getElementById("tabs"),oldTop=document.querySelector(".top-controls"),oldCount=document.getElementById("count");
if(!originalView||!phoneBody||!oldTabs||!D.development||!D.health)return;
const head=document.createElement("nav");head.id="categoriesNav";head.setAttribute("aria-label","Guide category");
oldTabs.insertAdjacentElement("beforebegin",head);oldTabs.style.display="none";
const root=document.createElement("section");root.id="extraView";originalView.insertAdjacentElement("afterend",root);
const state={cat:"Sleep",i:0,screen:"home",id:null,sub:null};
const draftKey="ahead-guides-concept-local-v2";
let stored={};try{stored=JSON.parse(localStorage.getItem(draftKey)||"{}")||{}}catch(e){stored={}};
const persist=()=>{try{localStorage.setItem(draftKey,JSON.stringify(stored))}catch(e){}};
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const enc=s=>encodeURIComponent(String(s));
const pageTitle=(name)=>'<h2 class="x-title">'+esc(name)+'</h2>';
const agebar=(items,cur,cb)=>'<div class="x-stagebar" role="navigation" aria-label="Browse stages">'+items.map((x,i)=>'<button data-act="'+cb+'" data-index="'+i+'" class="'+(cur===i?"active":"")+'">'+esc(x.name||x)+'</button>').join("")+'</div>';
const color=cat=>{const c=COLORS[cat]||COLORS.Development;document.body.style.setProperty("--extra-hero",c[0]);document.body.style.setProperty("--extra-ink",c[1]);document.body.style.setProperty("--extra-active",c[2])};
const art=(cat,i)=>'<div class="x-decor"><svg viewBox="0 0 260 100" fill="none" aria-hidden="true"><ellipse cx="131" cy="89" rx="81" ry="7" fill="#9a728b" opacity=".13"/><circle cx="130" cy="47" r="35" fill="'+(COLORS[cat]||COLORS.Development)[2]+'"/><circle cx="130" cy="47" r="19" fill="#fff" opacity=".58"/><path d="M72 18l4 9 9 4-9 4-4 9-4-9-9-4 9-4Z" fill="#fff" opacity=".95"/><path d="M192 47l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="#d3a992"/><path d="M102 70q30 24 58 0" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".65"/><circle cx="'+(i%2?191:67)+'" cy="73" r="5" fill="#d6b3ba"/></svg></div>';
const hero=(label,title,lead,aha,why,tryThis,cat,i)=>'<section class="x-hero"><div class="x-eye">'+esc(label)+'</div><h1>'+esc(title)+'</h1><p>'+esc(lead)+'</p>'+art(cat,i)+(aha?'<div class="x-aha"><div class="x-eye">YOU MIGHT NOTICE</div><b>'+esc(aha)+'</b><p>'+esc(why)+'</p></div>':'')+'</section>'+(tryThis?'<div class="x-try"><span>✓</span><p><strong>ONE THING TO TRY</strong>'+esc(tryThis)+'</p></div>':'');
const row=(title,sub,act,id,ico="✧",extra="")=>'<button class="x-row" data-act="'+act+'" '+(id==null?'':'data-id="'+esc(id)+'"')+'><span class="x-icon">'+ico+'</span><span class="x-copy"><b>'+esc(title)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span>'+(extra||'<span class="x-right">›</span>')+'</button>';
const card=(title,sub,act,id,ico="✳")=>'<button class="x-card" data-act="'+act+'" data-id="'+esc(id)+'"><span class="x-icon">'+ico+'</span><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></button>';
const section=(title,body)=>'<h3 class="x-sec">'+esc(title)+'</h3>'+body;
const list=html=>'<div class="x-list">'+html+'</div>';
const back=(title="Back")=>'<button class="x-back" data-act="back">‹ '+esc(title)+'</button>';
const heading=(label,title,lead)=>'<div class="x-head"><div class="x-eye">'+esc(label)+'</div><h2>'+esc(title)+'</h2>'+(lead?'<p>'+esc(lead)+'</p>':'')+'</div>';
const block=(label,content,style="")=>'<section class="x-block '+style+'"><h3>'+esc(label)+'</h3>'+content+'</section>';
const bullets=arr=>'<ul>'+arr.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>';
const note=x=>'<p class="x-disclaimer">'+esc(x)+'</p>';
const footer=()=>'<button class="x-next" data-act="back"><small>BACK TO CATEGORY</small><b>‹ Return to '+esc(CATS.find(x=>x[0]===state.cat)[1])+'</b></button>';
const ensure=(k)=>{if(!stored[k])stored[k]={};return stored[k]};
const setState=(cat,i=0,screen="home",id=null,sub=null)=>{state.cat=cat;state.i=i;state.screen=screen;state.id=id;state.sub=sub;render();window.scrollTo({top:0,behavior:"instant"})};
const hash=()=>"#"+state.cat.toLowerCase()+"/"+(state.i+1)+(state.screen==="home"?"":"/"+state.screen+(state.id!==null?"-"+enc(state.id):"")+(state.sub!==null?"-"+enc(state.sub):""));
function routeFromHash(h){let q=h.replace(/^#/,"").split("/");let cat=CATS.find(x=>x[0].toLowerCase()===q[0]);if(!cat||cat[0]==="Sleep"||cat[0]==="Feeding")return null;let i=Math.max(0,(parseInt(q[1],10)||1)-1);let piece=q[2]||"home",parts=piece.split("-"),screen=parts.shift()||"home",rest=parts.join("-");let id=null,sub=null;
if(screen==="domain"){id=decodeURIComponent(rest)}else if(screen==="play"){const a=rest.split("--");id=decodeURIComponent(a[0]||"0");sub=decodeURIComponent(a[1]||"0")}else if(screen==="topic"||screen==="step"||screen==="place"||screen==="gear"||screen==="type"||screen==="tool"||screen==="visit"||screen==="utility"){id=decodeURIComponent(rest)}else if(!["home","quiz","card","explore","help"].includes(screen)){screen="home"}return {cat:cat[0],i,screen,id,sub}}
function drawNav(){head.innerHTML=CATS.map(c=>'<button type="button" data-cat="'+c[0]+'" class="'+(state.cat===c[0]?"active":"")+'">'+c[2]+' '+esc(c[1])+'</button>').join("");const on=head.querySelector(".active");if(on)on.scrollIntoView({inline:"nearest",block:"nearest"})}
function render(){drawNav();let isBase=state.cat==="Sleep"||state.cat==="Feeding";originalView.style.display=isBase?"":"none";root.style.display=isBase?"none":"block";oldTop.style.display=isBase?"":"none";oldCount.style.display=isBase?"":"none";const t=document.querySelector(".outside-foot");if(t)t.textContent="Shareable design concept · All eight guide categories · Example baby Maya · Interactions save on this browser only · Not the live Ahead app.";
if(isBase){document.querySelector('#tabs [data-cat="'+state.cat+'"]')?.click();return}
color(state.cat);const url=hash();if(location.hash!==url)history.replaceState(null,"",url);
let html="";
switch(state.cat){
case "Development":html=development();break;
case "Care":html=care();break;
case "Safety":html=safety();break;
case "Health":html=health();break;
case "Outings":html=outings();break;
case "Childcare":html=childcare();break;}
root.innerHTML=html;const on=root.querySelector(".x-stagebar button.active");if(on)on.scrollIntoView({inline:"nearest",block:"nearest"});
}
function development(){let m=D.development[Math.max(0,Math.min(4,state.i))],i=state.i;
if(state.screen==="domain"){let domain=m.domains[state.id];if(!domain)return "";const key="dev-"+i+"-"+state.id;const flags=ensure(key),n=domain[1].filter((_,j)=>flags[j]).length;let skills='<div class="x-list">'+domain[1].map((x,j)=>'<button class="x-check '+(flags[j]?"done":"")+'" data-act="skill" data-id="'+esc(state.id)+'" data-index="'+j+'"><span class="x-tick">'+(flags[j]?"✓":"")+'</span><span><b>'+esc(x)+'</b><small>'+(flags[j]?"Seen it":"Tap when you've noticed it")+'</small></span></button>').join("")+'</div>';
return back("Development")+heading(m.age+" · "+state.id,domain[0], "These are typical skills around this checkpoint, not a pass–fail test.")+'<div class="x-counter">'+n+" of "+domain[1].length+" seen</div>"+skills+block("Try this together",bullets(m.play[0][2]),"")+note("Milestones vary. If you're worried about progress, or a skill disappears, contact your pediatrician. For a baby born early, consider adjusted age with the care team.")+footer()}
if(state.screen==="play"){let n=Number(state.id);let p=m.play[n];if(!p)return "";return back("Development")+heading(m.age+" · IDEA TO TRY",p[0],p[1])+block("Try it",bullets(p[2]))+block("What to notice","<p>Follow Maya's interest. A few enjoyable minutes count; stop when she looks away or seems finished.</p>")+footer()}
let tiles=Object.keys(m.domains).map((name,j)=>{let d=m.domains[name],seen=Object.values(ensure("dev-"+i+"-"+name)).filter(Boolean).length;return card(name,d[0]+" · "+seen+" of "+d[1].length+" seen","domain",name,["♡","♫","✳","↗"][j])}).join("");
let plays=m.play.map((p,j)=>card(p[0],p[1],"play",j,j?"▣":"✦")).join("");
return pageTitle("Development & play")+agebar(D.development,i,"stage")+hero("A LITTLE DISCOVERY · "+m.age,m.headline,m.lead,m.aha,m.explain,m.try,"Development",i)+section("What Maya is working on",'<div class="x-grid">'+tiles+"</div>")+section("Try together today",'<div class="x-grid">'+plays+'</div>')+block(m.big[0],"<p>"+esc(m.big[1])+"</p>")+note("The current Ahead app also includes more play ideas. This preview showcases the core developmental checkpoint and two featured activities.")+(i<4?'<button class="x-next" data-act="stage" data-index="'+(i+1)+'"><small>COMING UP</small><b>By '+esc(D.development[i+1].name)+'</b></button>':"");
}
function care(){
let i=Math.max(0,Math.min(3,state.i)),m=D.care[i],key=state.id,d=key?D.careTopics[key]:null;
const titleMap={diapers:"Diapers",bath:"Baths & hair",skin:"Skin & rashes",teeth:"Gums & teeth",clothes:"Getting dressed",sun:"Sun & heat",nails:"Nails, ears & nose",cord:"Cord stump"};
const iconMap={diapers:"◷",bath:"◡",skin:"♡",teeth:"✦",clothes:"♧",sun:"☀",nails:"◎",cord:"◦"};
const primary=["diapers","bath","skin","teeth"];
const expanded=["clothes","sun","nails",...(i===0?["cord"]:[])];
const quick=k=>{let t=D.careTopics[k];return '<button class="care-action" data-act="topic" data-id="'+k+'"><span class="care-action-art art-'+k+'">'+iconMap[k]+'</span><b>'+esc(titleMap[k])+'</b><small>'+esc(t.stage[i][0])+'</small></button>'};
const notice=n=>'<button class="care-change" data-act="topic" data-id="'+esc(n[2])+'"><span class="care-change-text"><b>'+esc(n[0])+'</b><small>'+esc(n[1])+'</small></span><span class="care-chev">›</span></button>';
if(state.screen==="topic"&&d){
const val=d.stage[i],steps=d.how;
return back("Everyday care")+agebar(D.care,i,"stage")
 +'<div class="care-topic-hero"><div class="x-eye">EVERYDAY CARE · '+esc(m.name).toUpperCase()+'</div><h2>'+esc(d.title)+'</h2><p>'+esc(d.lead)+'</p><div class="care-topic-now"><span class="care-topic-star">✳</span><span><small>FOR MAYA RIGHT NOW</small><b>'+esc(val[0])+'</b><span>'+esc(val[1])+'</span></span></div></div>'
 +section("How to do it",'<div class="care-step-list">'+steps.map((x,j)=>'<div class="care-step"><span>'+(j+1)+'</span><p>'+esc(x)+'</p></div>').join("")+"</div>")
 +'<div class="care-when"><b>When to check in</b><p>'+esc(d.watch)+'</p></div>'
 +'<button class="care-next-topic" data-act="back">‹ Back to everyday care</button>'
 +note("General reference information. Ask your pediatrician about symptoms, particularly in the newborn period.");
}
if(state.screen==="help"){
 const questions=[
 ["A diaper looks different","Changes in pee or poop","diapers","◷"],
 ["Redness, bumps or a rash","Skin changes and irritation","skin","♡"],
 ["Lots of drool or chewing","Gums and possible teething","teeth","✦"],
 ["Warm outside or too much sun","How to protect her skin","sun","☀"],
 ["Bath-time worries","Safe water and supervision","bath","◡"]
 ];
 return back("Everyday care")+heading("EVERYDAY CARE · QUICK HELP","Does this look normal?","Find a practical explanation for something you are noticing. This is not a diagnosis.")
 +list(questions.map(q=>row(q[0],q[1],"topic",q[2],q[3])).join(""))
 +'<div class="x-urgent"><b>Get medical help when needed.</b> If Maya seems very unwell, has difficulty breathing, or is hard to wake, seek urgent care. For a baby younger than 3 months with a temperature of 100.4°F (38°C) or higher, contact a clinician right away.</div>'
 +note("Illness diagnosis and fever guidance belong in Health. This tool points to everyday care references.")
 +footer();
}
return pageTitle("Everyday care")+agebar(D.care,i,"stage")
 +'<section class="care-new-header"><span class="x-eye">'+esc(m.name).toUpperCase()+' · CARE AT THIS STAGE</span><h1>Everyday care, made a little easier.</h1><p>Quick answers for the things you actually do, with guidance that changes as Maya grows.</p></section>'
 +section("What do you need help with?",'<div class="care-action-grid">'+primary.map(quick).join("")+"</div>")
 +'<div class="care-help"><span class="care-help-symbol">?</span><span class="care-help-copy"><b>Does something look different?</b><small>Poop, skin, drool and more: what is common and what needs a call.</small></span><button data-act="help">Find out ›</button></div>'
 +section("New around now",'<div class="care-changes">'+m.news.slice(0,3).map(notice).join("")+"</div>")
 +section("More everyday basics",list(expanded.map(k=>row(titleMap[k],D.careTopics[k].stage[i][0],"topic",k,iconMap[k])).join("")))
 +'<p class="care-safety-foot">Every bath and change: gather everything first, keep a hand on baby on raised surfaces, and never leave baby alone in water.</p>'
 +note("Everyday care stays practical and baby-focused. Sleep, feeding, illness and home babyproofing each have their own guide.")
 +(i<3?'<button class="x-next" data-act="stage" data-index="'+(i+1)+'"><small>COMING UP</small><b>'+esc(D.care[i+1].name)+' · '+esc(D.care[i+1].headline)+'</b></button>':"");
}
function safety(){let i=Math.max(0,Math.min(3,state.i)),s=D.safety[i],p=ensure("safe-"+i);if(state.screen==="step"){let q=s.steps.find(x=>x[0]===state.id);if(!q)return "";return back("Safety")+heading(s.name+" · SAFETY STEP",q[1],q[2])+block("Do this",bullets(q[3]))+'<div class="x-note">'+esc(q[4])+'</div><div class="x-inline-actions"><button class="x-primary" data-act="safe-status" data-id="'+esc(q[0])+'" data-value="done">'+(p[q[0]]==="done"?"✓ Done":"Mark done")+'</button><button class="x-secondary" data-act="safe-status" data-id="'+esc(q[0])+'" data-value="na">Doesn’t apply</button></div>'+footer()}
let applicable=s.steps.filter(q=>p[q[0]]!=="na"),done=applicable.filter(q=>p[q[0]]==="done").length;
let tasks=s.steps.map((q,j)=>{let v=p[q[0]];return '<button class="x-check '+(v==="done"?"done":"")+'" data-act="step" data-id="'+esc(q[0])+'"><span class="x-tick">'+(v==="done"?"✓":v==="na"?"–":"")+'</span><span style="flex:1"><b>'+esc(q[1])+'</b><small>'+esc(v==="na"?"Doesn’t apply":q[2])+'</small></span><span class="x-right">›</span></button>'}).join("");
return pageTitle("Safety")+agebar(D.safety,i,"stage")+hero("A SAFETY CHANGE · "+s.age,s.headline,s.lead,s.aha,s.explain,s.try,"Safety",i)+section("Do these before she can "+(i===0?"move":i===1?"roll":i===2?"explore":"pull up"),'<div class="x-counter">'+done+" of "+applicable.length+" applicable steps done</div><div class='x-progress'><span style='width:"+(applicable.length?100*done/applicable.length:100)+"%'></span></div><div class='x-list'>"+tasks+"</div>")+block("If something goes wrong",bullets(["Poison exposure: call Poison Control at 1-800-222-1222 in the US.","A swallowed button battery or magnet needs immediate emergency medical care.","Trouble breathing, unresponsiveness or blue lips: call 911."]))+note("Skills and movement drive safety steps; age is a reminder, not proof the baby has reached a milestone.")+(i<3?'<button class="x-next" data-act="stage" data-index="'+(i+1)+'"><small>GET READY FOR</small><b>'+esc(D.safety[i+1].name)+'</b></button>':"");
}
function health(){const i=Math.max(0,Math.min(6,state.i)),v=D.health[i];if(state.screen==="visit"){const mode=state.id||"expect";let body="";if(mode==="expect"){body=v.expect.map(x=>block(x[0],"<p>"+esc(x[1])+"</p>")).join("");body+=block("Before you go","<p>"+esc(v.bring)+"</p>")}
if(mode==="vaccines"){body=block("For this visit",bullets(v.vaccines))+block("Questions worth asking",bullets(["Which vaccines or preventive treatments are due for this baby under current guidance?","Are any doses different because of prematurity, a medical condition or a missed appointment?","What reactions should prompt a call?"]))+note("Vaccine recommendations, eligibility and timing can change. The preview intentionally doesn't invent a fixed schedule; check the current CDC schedule and your clinician's records.")+'<p class="source"><a target="_blank" rel="noopener" href="https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-age.html">CDC schedule ↗</a></p>'}
if(mode==="questions"){const k="note-"+i;const val=stored[k]||"";body=block("Suggested questions",bullets(v.ask))+'<section class="x-block"><h3>Your notes for this visit</h3><textarea id="health-notes" aria-label="Notes for the visit" placeholder="Anything you want to remember…">'+esc(val)+'</textarea><div class="x-inline-actions"><button class="x-secondary" data-act="save-health">Save on this device</button></div></section>'+note("This draft is saved in this browser only. It is not sent to a medical practice.")}
return back("Health")+heading(v.age+" CHECKUP",mode==="expect"?"What to expect":mode==="vaccines"?"Vaccines & prevention":"Questions & notes",v.lead)+body+footer()}
const done=!!stored["visit-"+i];const m=v;
return pageTitle("Health")+agebar(D.health,i,"stage")+hero("YOUR CHECKUP GUIDE · "+v.age,v.headline,v.lead,"What is new at this age?",v.why,"Save a question you want to ask before the appointment.","Health",i)+section("At this checkup",list(row("What to expect","The exam, development and what to bring","visit","expect","✳")+row("Vaccines & prevention","What to review with your clinician","visit","vaccines","✚")+row("Questions & notes","Useful prompts, plus space for your own","visit","questions","▤")))+('<div class="x-inline-actions"><button class="'+(done?"x-secondary":"x-primary")+'" data-act="mark-visit">'+(done?"✓ Marked attended · Undo":"Mark appointment attended")+'</button></div>')+block("Good to know",'<p>Checkups follow the baby’s chronological age. Personalized timing and preventive care are determined with the baby’s clinician.</p>')+note("Health is organized around real checkups, not arbitrary content stages. Vaccine details and timing should receive clinical review before launch.")+(i<6?'<button class="x-next" data-act="stage" data-index="'+(i+1)+'"><small>NEXT CHECKUP</small><b>'+esc(D.health[i+1].name)+'</b></button>':"");
}
function outings(){let o=D.outings;if(state.screen==="place"||state.screen==="gear"){const target=(state.screen==="place"?o.places:o.gear).find(x=>x.id===state.id);if(!target)return "";let h=back("Outings & travel")+heading((state.screen==="place"?"WHERE YOU'RE GOING":"YOUR GEAR"),target.title,target.lead||target.sub);h+=target.sections.map(s=>block(s[0],bullets(s[1]))).join("");if(target.id==="bag")h+=bag();return h+footer()}
if(state.screen==="utility")return back("Outings & travel")+heading("OUTINGS TOOL", "Your diaper bag", "An optional checklist for leaving the house.")+bag()+footer();
let m=o.moments[state.i]||o.moments[0];let now='<div class="x-inline-actions">'+o.moments.map((a,j)=>'<button class="x-pill '+(j===state.i?"chosen":"")+'" data-act="stage" data-index="'+j+'">'+esc(a[0])+'</button>').join("")+'</div>';
let places='<div class="x-grid">'+o.places.map((p,j)=>card(p.title,p.sub,"place",p.id,["⌂","↗","✈","☾","◎","☀"][j])).join("")+'</div>';
let gear=list(o.gear.map((g,j)=>row(g.title,g.sub,"gear",g.id,["◇","◯","♡","▤"][j])).join(""));
return pageTitle("Outings & travel")+hero("WHERE WILL YOU GO?",o.hero.title,o.hero.lead,"New places get easier with practice.","Start small, and bring what you already know about your baby.",null,"Outings",state.i)+section("Where are you headed?",places)+section("Your gear",gear)+section("What changes as baby grows?",'<div class="x-note"><b>'+esc(m[1])+'</b><div>'+esc(m[2])+'</div>'+now+'</div>')+section("Before you leave",list(row("Your diaper bag","A checklist that fits how you feed","utility","bag","▤")))+note("Unlike Sleep or Feeding, Outings is organized by destination. Ages only change the information inside those pages.");
}
const bagitems=["Diapers and wipes","Changing mat and spare outfit","Milk, bottles or feeding supplies","Weather-appropriate layers","Burp cloth or bib","Favorite small soothing item","Age-appropriate food and cup (if on solids)"];
function bag(){const s=ensure("bag");return '<div class="x-list">'+bagitems.map((a,j)=>'<button class="x-check '+(s[j]?"done":"")+'" data-act="bag-check" data-index="'+j+'"><span class="x-tick">'+(s[j]?"✓":"")+'</span><span><b>'+esc(a)+'</b></span></button>').join("")+'</div><div class="x-inline-actions"><button class="x-secondary" data-act="bag-clear">Clear checklist</button></div>'+note("This is a sample checklist. In the live app, milk and food supplies should adapt to the family's feeding details.")}
function childcare(){const o=D.childcare;if(state.screen==="type"){let t=o.types.find(x=>x.id===state.id);if(!t)return "";return back("Childcare")+heading("KIND OF CARE",t.title,t.sub)+block("Good fit when","<p>"+esc(t.good)+"</p>")+block("What to check","<p>"+esc(t.watch)+"</p>")+block("Three questions to ask",bullets(t.questions))+footer()}
if(state.screen==="step"){let t=o.steps.find(x=>x.id===state.id);if(!t)return "";return back("Childcare")+heading(t.age,t.headline,t.lead)+t.sections.map(s=>block(s[0],bullets(s[1]))).join("")+footer()}
if(state.screen==="tool"){let t=o.tools.find(x=>x.id===state.id);if(!t)return "";if(t.id==="card")return careCard();return back("Childcare")+heading("SETTING UP CARE",t.title,t.sub)+t.sections.map(s=>block(s[0],bullets(s[1]))).join("")+footer()}
if(state.screen==="quiz")return quiz();
let hero1=hero("HELP FOR THE WHOLE FAMILY",o.hero.title,o.hero.lead,"Getting help doesn't need to wait for a milestone.","The right care is the kind that fits your hours, budget and baby's needs.","Start with the type of care and the hours you actually need.","Childcare",0);
let types='<div class="x-grid">'+o.types.map((x,j)=>card(x.title,x.sub,"type",x.id,["▣","⌂","♡","◇","◷","✳"][j])).join("")+'</div>';
let steps=list(o.steps.map((s,j)=>row(s.title,s.age,"step",s.id,["1","2","3"][j])).join(""));
return pageTitle("Childcare")+hero1+section("What kind of care?",types)+'<div class="x-inline-actions"><button class="x-secondary" data-act="quiz">Help me compare options ↗</button></div>'+section("Setting it up",steps)+section("Tools and references",list(row("Maya's care card","Feeds, naps and who to call","tool","card","▤")+row("Paying for care","Budgeting and benefits","tool","pay","$")+row("When care falls through","Backups and sick days","tool","backup","◇")))+note("Childcare is a decision journey—not an age-based stage. The live Ahead prototype also has detailed caregiver screening and shortlisting.");
}
function careCard(){const c=ensure("card");const fields=[["feeds","Feeds","Feeding method, how much/how often, and important instructions"],["sleep","Sleep","Nap pattern, safe sleep rules and comfort routine"],["comfort","Comfort","What helps when Maya is upset"],["contacts","Emergency contacts","Who to call and when"]];return back("Childcare")+heading("SHAREABLE TOOL","Maya's care card","A quick handoff to a trusted caregiver. This is a local draft; nothing is sent automatically.")+'<div class="x-block">'+fields.map(x=>'<label for="cc-'+x[0]+'">'+x[1]+'</label><textarea id="cc-'+x[0]+'" placeholder="'+esc(x[2])+'">'+esc(c[x[0]]||"")+'</textarea>').join("")+'</div><div class="x-inline-actions"><button class="x-primary" data-act="care-save">Save draft</button><button class="x-secondary" data-act="care-copy">Copy care card</button></div><p id="care-feedback" class="x-small" aria-live="polite"></p>'+note("For privacy, avoid putting medical details or emergency contacts in a publicly accessible link.")+footer()}
function quiz(){const q=[["hours","Which hours do you need?",["Regular weekdays","Early or late hours","Occasional or part-time"]],["budget","What's the budget like?",["Tight","Some room","Flexible"]],["style","What feels right?",["A group","One-on-one","Not sure"]]];const a=ensure("quiz");const boxes=q.map(([id,p,opts])=>'<div class="x-question"><b>'+esc(p)+'</b><div class="x-options">'+opts.map(o=>'<button data-act="quiz-answer" data-id="'+id+'" data-value="'+esc(o)+'" class="x-pill '+(a[id]===o?"chosen":"")+'">'+esc(o)+'</button>').join("")+'</div></div>').join("");
let suggestion="";if(Object.keys(a).length===q.length){let k=a.hours==="Regular weekdays"&&(a.style==="A group"||a.budget==="Tight")?"center":a.style==="One-on-one"&&a.budget==="Flexible"?"nanny":a.budget==="Tight"?"home":"family";let item=D.childcare.types.find(t=>t.id===k);suggestion='<div class="x-note"><b>A starting point: '+esc(item.title)+'</b><p>'+esc(item.good)+'</p><button class="x-secondary" data-act="type" data-id="'+k+'">Explore this option ›</button></div>'}
return back("Childcare")+heading("A FEW QUICK QUESTIONS","Which care might fit?","A lightweight starting point—not a scored recommendation.")+boxes+suggestion+note("No accounts or personal information are needed to explore these sample results.")+footer()}
function dispatch(e){let c=e.target.closest("[data-cat]");if(c&&head.contains(c)){let name=c.dataset.cat;if(name==="Sleep"||name==="Feeding"){state.cat=name;drawNav();root.style.display="none";originalView.style.display="";oldTop.style.display="";oldCount.style.display="";document.querySelector('#tabs [data-cat="'+name+'"]')?.click();return;}setState(name);return}
let btn=e.target.closest("[data-act]");if(!btn||!root.contains(btn))return;let a=btn.dataset.act,id=btn.dataset.id,idx=Number(btn.dataset.index);
if(a==="stage"){setState(state.cat,idx);return}
if(a==="help"){setState(state.cat,state.i,"help");return}
if(a==="back"){setState(state.cat,state.i);return}
if(["domain","play","topic","step","place","gear","type","tool","visit","utility","explore"].includes(a)){setState(state.cat,state.i,a,id);return}
if(a==="skill"){let d=ensure("dev-"+state.i+"-"+id);d[idx]=!d[idx];persist();render();return}
if(a==="safe-status"){let d=ensure("safe-"+state.i);d[id]=d[id]===btn.dataset.value?null:btn.dataset.value;persist();setState(state.cat,state.i);return}
if(a==="mark-visit"){stored["visit-"+state.i]=!stored["visit-"+state.i];persist();render();return}
if(a==="save-health"){stored["note-"+state.i]=root.querySelector("#health-notes")?.value||"";persist();const b=root.querySelector("#health-notes");if(b){const span=document.createElement("p");span.className="x-status";span.textContent="Saved on this device";b.insertAdjacentElement("afterend",span)}return}
if(a==="bag-check"){let d=ensure("bag");d[idx]=!d[idx];persist();render();return}
if(a==="bag-clear"){stored.bag={};persist();render();return}
if(a==="quiz"){setState(state.cat,state.i,"quiz");return}
if(a==="quiz-answer"){let d=ensure("quiz");d[id]=btn.dataset.value;persist();render();return}
if(a==="care-save"||a==="care-copy"){let d=ensure("card");["feeds","sleep","comfort","contacts"].forEach(k=>d[k]=root.querySelector("#cc-"+k)?.value||"");persist();if(a==="care-copy"){const txt="Maya's care card\n\n"+[["Feeds",d.feeds],["Sleep",d.sleep],["Comfort",d.comfort],["Emergency contacts",d.contacts]].map(x=>x[0]+": "+x[1]).join("\n\n");navigator.clipboard?.writeText(txt).then(()=>{const f=root.querySelector("#care-feedback");if(f)f.textContent="Care card copied to clipboard."}).catch(()=>{const f=root.querySelector("#care-feedback");if(f)f.textContent="Copy wasn't available in this browser. Your draft is saved here."});}else{const f=root.querySelector("#care-feedback");if(f)f.textContent="Draft saved on this browser."}return}
}
head.addEventListener("click",dispatch);root.addEventListener("click",dispatch);
const initial=window.__aheadInitialHash||location.hash;const parsed=routeFromHash(initial);if(parsed){Object.assign(state,parsed);render()}else{const c=/feeding/i.test(initial)?"Feeding":"Sleep";state.cat=c;drawNav()}
window.addEventListener("popstate",()=>{const v=routeFromHash(location.hash);if(v){Object.assign(state,v);render()}});
})();