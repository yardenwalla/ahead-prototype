(function previewRuntime(){
  const CAT="Daily rhythm", ages=["Newborn","1–3 months","4–6 months","7–12 months"];
  const shades={
    diapers:["#e7effc","#46638c"],bath:["#e3f1f7","#2a6078"],skin:["#fdeee6","#9a5a3c"],
    clothes:["#efedff","#625084"],sun:["#fff3dc","#8a6a2a"],teeth:["#e6f5ec","#356651"],
    nails:["#fdeef2","#a24d6a"],cord:["#fdeef2","#a24d6a"],feet:["#efedff","#625084"],gums:["#e6f5ec","#356651"]
  };
  const symbol={diapers:"diaper",bath:"bath",skin:"drop",clothes:"shirt",sun:"sun",teeth:"tooth",nails:"nail",cord:"cord",feet:"stand",gums:"tooth"};
  let ageIndex=2,version="proposed";
  const preset=[
    {cord:false,roll:false,tooth:false,sit:false},
    {cord:true,roll:false,tooth:false,sit:false},
    {cord:true,roll:true,tooth:false,sit:false},
    {cord:true,roll:true,tooth:true,sit:true}
  ];
  window.__careStudyFlags={...preset[ageIndex]};
  const is=key=>!!window.__careStudyFlags[key];
  const row=(key,label,answer,target)=>({key,label,answer,target});
  const nav=target=>`openPage('chg:Daily rhythm:d:${target}')`;
  function focus(v){
    if(v===0)return is("cord")?
      ["THE FIRST FEW WEEKS","The first tub bath can begin","Once the cord stump is off and the skin has healed, Maya can have a gentle bath in a baby tub.","See how a tub bath works","p:tub"]:
      ["THE FIRST FEW WEEKS","The smallest jobs are the biggest firsts","Diapers, sponge baths and cord care are new skills. You only have to learn them once.","See how to change a diaper","p:change"];
    if(v===1)return is("cord")?
      ["A SMALL CARE CHANGE","The cord is still attached","Keep giving sponge baths until the area heals. If it has not fallen off after about three weeks, contact your pediatrician.","How to care for the cord","p:cord"]:
      ["A NEW LITTLE FIRST","Tub baths can start now","Once the cord area has healed, a warm baby tub replaces sponge baths. Two or three baths a week is plenty.","See how a tub bath works","p:tub"];
    if(v===2){
      if(is("tooth"))return ["A NEW LITTLE FIRST","That first tooth changes the routine","Brushing twice a day is the new habit. Use just a rice-grain smear of fluoride toothpaste.","See how much toothpaste","p:brush"];
      if(is("roll"))return ["NOW THAT SHE'S ROLLING","Diaper changes need a new plan","Rolling happens without warning. Giving Maya something to hold—or changing her on the floor—can make it easier.","See tips for wriggly changes","p:wriggly"];
      return ["COMMON AROUND NOW","All that drool, before a tooth","Chewing and sore gums often start before the first tooth appears. There are a few simple ways to help.","What helps sore gums","p:teething"];
    }
    if(is("tooth"))return ["ONE NEW DAILY HABIT","Brushing starts with the first tooth","A soft baby toothbrush and a rice-grain smear of fluoride toothpaste, morning and night.","See how to brush","p:brush"];
    if(is("sit"))return ["AS SHE GROWS","The bath changes when she sits steadily","Once Maya can sit steadily, she may be ready for the big tub. A grown-up must still keep a hand on her.","How to move to the big tub","p:bigtub"];
    return ["A LITTLE REASSURANCE","No first tooth yet can be normal","Some babies get their first tooth closer to their first birthday. Keep caring for her gums while you wait.","How to soothe her gums","p:teething"];
  }
  function careRoutine(v){
    const past6=birthdayAge()>=6;
    if(v===0)return[
      ["Every day",[
        row("diapers","Diapers","About 8–12 changes a day at first","c:diapers:0"),
        row("cord","The cord",is("cord")?"Stump is off; let the area finish healing":"Keep clean and dry until it falls off","p:cord"),
        row("gums","Gums","Wipe gently with a clean, damp cloth","p:gums"),
        row("clothes","Clothes","Usually one more layer than you","p:dress")]],
      ["Each week",[
        row("bath",is("cord")?"Tub baths":"Sponge baths","Two or three a week",is("cord")?"p:tub":"p:sponge"),
        row("nails","Nails","Trim or file about once a week","p:nailsnose")]],
      ["Outside",[row("sun","Sun protection","Shade and light, protective clothing","p:shade")]]
    ];
    if(v===1)return[
      ["Every day",[
        row("diapers","Diapers","Fewer poops can be normal","p:fewer"),
        row("skin","Skin","Baby acne and cradle cap can appear","p:acne"),
        row("gums","Gums","Wipe gently with a clean, damp cloth","p:gums"),
        row("clothes","Clothes","An extra layer; no hat indoors","p:dress")]],
      ["Each week",[
        row("bath",is("cord")?"Tub baths":"Sponge baths",is("cord")?"About two or three a week":"Until the cord area heals",is("cord")?"p:tub":"p:sponge"),
        row("nails","Nails","Trim or file about once a week","p:nailsnose")]],
      ["Outside",[row("sun","Sun protection","Shade first, especially midday","p:shade")]]
    ];
    if(v===2)return[
      ["Every day",[
        row("teeth",is("tooth")?"First tooth":"Gums & teething",is("tooth")?"Brush twice daily with a rice-grain smear":"Drooling and chewing are common",is("tooth")?"p:brush":"p:teething"),
        row("diapers","Diaper changes",is("roll")?"A toy to hold; the floor can help":"Keep a hand on Maya; rolling can start any day","p:wriggly"),
        row("skin","Skin","Pat drool dry; learn which rashes are common","p:drool")]],
      ["Each week",[
        row("bath","Baths","About two or three a week","p:bedbath"),
        row("nails","Nails","Trim or file about once a week","p:nailsnose")]],
      ["Outside",[row("sun","Sun protection",past6?"Shade first, then SPF 30 on exposed skin":"Shade and protective clothes under 6 months",past6?"p:six":"p:shade")]]
    ];
    return[
      ["Every day",[
        row("teeth",is("tooth")?"Teeth":"Gums & teething",is("tooth")?"Brush twice daily with fluoride toothpaste":"No tooth yet? It can take longer",is("tooth")?"p:brush":"p:teething"),
        row("diapers","Diapers","A small toy helps with wriggly changes","p:wriggly"),
        row("feet","Feet & shoes","Barefoot indoors; shoes for outdoor walking","p:feet")]],
      ["Each week",[
        row("bath",is("sit")?"Big tub":"Baby tub",is("sit")?"Once she sits steadily; always keep a hand on her":"Use the baby tub until she sits steadily",is("sit")?"p:bigtub":"p:bedbath"),
        row("nails","Nails","Trim or file about once a week","p:nailsnose")]],
      ["Outside",[row("sun","Sun protection","Shade first, SPF 30 on uncovered skin","p:six")]]
    ];
  }
  function proposed(selected=null){
    const hub=window.__hub;
    const F=s=>hub.F(s);
    const m=typeof hubAgeFor==="function"?hubAgeFor("care",actualMonth()):developmentMonth(actualMonth());
    const days=(NOW-parse(profile.dob))/864e5;
    const actual=days<28?0:m<4?1:m<7?2:3;
    const v=Number.isInteger(selected)&&selected>=0&&selected<4?selected:actual;
    const stages=STAGE_TABLE[CAT].stages;
    const pills=hub.pills("Everyday care by age",stages.map((st,i)=>({label:st.label,age:st.age,on:i===v,now:isCurrent()&&actual===i,onclick:`openPage('chg:${CAT}:s:${i}')`})),CAT);
    const f=focus(v);
    let out=`<header class="hub-hero care-hero cr-hero"><p class="hub-eyebrow">${F(f[0])}</p><h1>${F(f[1])}</h1><p class="hub-lead">${F(f[2])}</p><button class="cr-hero-cta" onclick="${nav(f[4])}">${F(f[3])}<span aria-hidden="true">›</span></button></header>`;
    out+=`<button class="cr-normal" onclick="openPage('chg:${CAT}:d:look:${v}')"><span class="cr-normal-icon">${hubArt("eye",CAT)}</span><span><b>Something look off?</b><small>${F(v===0?"Poop, rashes, the cord, sticky eyes and more":v===1?"Poop, rashes, eyes and more":"Rashes, drool, poop and more")}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
    out+=`<h2 class="hub-h2 cr-section-heading">${F(isCurrent()&&actual===v?name()+"’s care routine":"Care at this stage")}</h2><div class="cr-all">`;
    careRoutine(v).forEach(([label,items])=>{
      out+=`<section class="cr-group"><h3>${F(label)}</h3>`;
      for(const x of items){
        const col=shades[x.key]||shades.bath;
        out+=`<button class="cr-item" onclick="${nav(x.target)}"><span class="cr-icon" style="--cr-bg:${col[0]};--cr-ink:${col[1]}">${hubArt(symbol[x.key]||"heart",CAT)}</span><span class="cr-copy"><b>${F(x.label)}</b><small>${F(x.answer)}</small></span><span class="hub-chev" aria-hidden="true">›</span></button>`;
      }
      out+="</section>";
    });
    out+="</div>";
    const next=[["After the first few weeks","Care settles into a rhythm"],["Next, around 4 months","Drool and busy hands"],["Next, around 7 months","First teeth and the big tub"],["After the first birthday","Brushing, baths and first shoes"]][v];
    out+=hub.next(next[0],next[1],v<3?`openPage('chg:${CAT}:s:${v+1}')`:`openPage('chg:${CAT}:d:after1')`);
    out+=hub.note("A reference, not a checklist. Every baby is different. Sleep is in Sleep; fevers and colds are in Health.");
    const premature=isCurrent()&&profile.early&&profile.due&&ageMonths(parse(profile.due),NOW)!==actualMonth();
    const adjusted=premature?`<p class="hub-agebasis">${F("Care changes tied to development follow Maya’s adjusted age; sun protection follows her birthday age.")}</p>`:"";
    return `<div class="quiet-category hub-page care-v2 care-proposed" data-overview="${CAT}" data-care-stage="${v}" style="${yearTheme(CAT)}">${monthlyPageHeader(CAT)}${pills}${adjusted}${out}</div>`;
  }
  const original=window.careHome;
  window.__careStudyOriginal=original;
  window.__careStudyProposed=proposed;
  window.careHome=proposed;
  function apply(){
    const flags=window.__careStudyFlags;
    answers.roll=flags.roll?"Yes":"No";
    answers.rollDirection=flags.roll?"Both ways":"Not yet";
    answers.hasTooth=flags.tooth?"Yes":"No";
    answers.tooth=flags.tooth?"Yes":"No";
    answers.sit=flags.sit?"Yes":"No";
    const el=document.getElementById("care-study-controls");
    if(!el)return;
    el.querySelectorAll("[data-flag]").forEach(b=>{const active=flags[b.dataset.flag];b.classList.toggle("on",active);b.setAttribute("aria-pressed",String(active))});
    el.querySelectorAll("[data-age]").forEach(b=>{const active=+b.dataset.age===ageIndex;b.classList.toggle("on",active);b.setAttribute("aria-pressed",String(active))});
    el.querySelectorAll("[data-view]").forEach(b=>{const active=b.dataset.view===version;b.classList.toggle("on",active);b.setAttribute("aria-pressed",String(active))});
  }
  function navigateCare(){openPage(`chg:${CAT}:s:${ageIndex}`)}
  window.carePreview={
    age(i){
      ageIndex=i;
      const ageMo=[0,2,5,9][i],d=new Date(NOW.getTime());
      if(i===0)d.setDate(d.getDate()-10);
      else{d.setDate(1);d.setMonth(d.getMonth()-ageMo);d.setDate(Math.min(NOW.getDate(),new Date(d.getFullYear(),d.getMonth()+1,0).getDate()))}
      profile={...profile,name:"Maya",pronouns:"she",dob:iso(d),due:"",early:false,feed:"Breast milk"};
      month=actualMonth();
      window.__careStudyFlags={...preset[i]};
      apply();
      navigateCare();
    },
    flag(key){window.__careStudyFlags[key]=!window.__careStudyFlags[key];apply();navigateCare()},
    view(mode){version=mode;window.careHome=mode==="original"?original:proposed;apply();navigateCare()}
  };
})();