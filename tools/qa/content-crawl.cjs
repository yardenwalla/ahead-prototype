// Renders every main route across many family states and writes the unique
// sentences a parent can see, with the first route that shows each one.
// Use it to audit content in every state, not only the default example.
const fs=require('node:fs'),path=require('node:path');
const boot=require('./content-runtime.cjs');
const text=h=>h.replace(/<svg\b[\s\S]*?<\/svg>/g,' ').replace(/<(script|style)\b[\s\S]*?<\/\1>/g,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;|&apos;/g,'’').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const seen=new Map();
let renders=0;
function collect(a,where){
  renders++;
  for(const s of text(a.html()).split(/(?<=[.?!›→])\s+(?=[A-Z0-9“‘"])/)){
    const t=s.trim();if(t.length<3)continue;
    if(!seen.has(t))seen.set(t,where);
  }
}
const families=[];
for(const pronouns of ['she','he','they'])for(const feed of ['Breast milk','Formula','Both'])families.push({pronouns,feed,early:false});
families.push({pronouns:'she',feed:'Both',early:true});
const foodStates=[{},{solids:'Not yet'},{solids:'Yes',foodExperience:'new'},{solids:'Yes',foodExperience:'textures'},{solids:'Yes',foodExperience:'established'}];
const moveStates=[{},{rollDirection:'Not yet'},{rollDirection:'Both'}];
const topics=['home','topic:Development','topic:Daily rhythm','topic:Sleep','topic:Feeding','topic:Safety','topic:Health','year'];
for(const fam of families){
  for(let age=0;age<=12;age++){
    const states=age>=4?foodStates.flatMap(f=>moveStates.map(m=>({...f,...m}))):[{}];
    for(const answers of (fam.pronouns==='she'&&fam.feed==='Both'?states:[{},states[states.length-1]])){
      const dob=new Date(Date.UTC(2025,9,21));
      const clock=new Date(Date.UTC(2025,9+age,21,12)).toISOString();
      const profile={id:'crawl',name:'Maya',dob:dob.toISOString().slice(0,10),pronouns:fam.pronouns,feed:fam.feed,early:fam.early,due:fam.early?'2025-12-01':''};
      let a;try{a=boot(profile,answers,{},clock);}catch(e){continue;}
      const label=`${fam.pronouns}/${fam.feed}${fam.early?'/early':''} · ${age} mo · ${JSON.stringify(answers)}`;
      for(const r of topics){try{a.run(`openPage(${JSON.stringify(r)})`);collect(a,label+' · '+r);}catch(e){}}
      for(const cat of ['Sleep','Feeding']){
        let data;try{data=JSON.parse(a.run(`JSON.stringify(AHEAD_CHANGES.${cat})`));}catch(e){continue;}
        data.CH.forEach((c,i)=>{try{a.run(`openPage('chg:${cat}:s:${i}')`);collect(a,label+' · '+cat+' stage '+c.key);
          (data.DEC[c.key]||[]).forEach((q,qi)=>q[2].forEach((o,oi)=>{try{a.run(`chgAnswer('${cat}:${c.key}:${qi}',${oi})`);collect(a,label+' · '+cat+' Q '+c.key);}catch(e){}}));}catch(e){}});
        data.EV.forEach((e,i)=>{try{a.run(`openPage('chg:${cat}:e:${i}')`);collect(a,label+' · '+cat+' change '+e.key);}catch(x){}});
        for(const s of ['safe','help','milk','allergy','settle']){try{a.run(`openPage('chg:${cat}:${s}')`);collect(a,label+' · '+cat+' '+s);}catch(e){}}
      }
      if(fam.pronouns==='she'&&fam.feed==='Both'&&!fam.early&&JSON.stringify(answers)==='{}'){
        try{for(const idea of JSON.parse(a.run(`JSON.stringify(monthlyPlayActivities(${age},null))`))){a.run(`openPage('play-activity:${age}:${idea.id}')`);collect(a,label+' · play '+idea.id);}}catch(e){}
        for(const v of [0,1,2,4,6,9,12])for(const part of ['expect','vaccines','questions','help','notes']){try{a.run(`openPage('health-detail:${v}:${part}')`);collect(a,label+' · health '+v+' '+part);}catch(e){}}
        for(const o of ['setup','reach','mobile']){try{a.run(`openPage('safety-checklist:${o}')`);collect(a,label+' · safety '+o);}catch(e){}}
        try{for(const sk of JSON.parse(a.run('JSON.stringify(journeySkills())'))){a.run(`openPage('skill-guide:${sk.key}')`);collect(a,label+' · skill '+sk.key);}}catch(e){}
      }
    }
  }
}
// Onboarding
try{const a=boot(null,{},{});collect(a,'onboarding · start');a.run('startSetup()');collect(a,'onboarding · setup');}catch(e){}
const out=[...seen].map(([s,w])=>({s,w}));
fs.writeFileSync(path.resolve(process.argv[2]||'content-crawl.json'),JSON.stringify(out,null,1));
console.log(JSON.stringify({renders,uniqueSentences:out.length,chars:out.reduce((n,x)=>n+x.s.length,0)}));
