// A reproducible content inventory, not an automated editorial score.
// Run with --write after a content edit, then review the JSON diff alongside
// the rendered pages and update the human acceptance report.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const boot=require('./content-runtime.cjs');
const units=[];
const text=h=>h.replace(/<svg\b[\s\S]*?<\/svg>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const make=(age=5,answers={})=>boot({id:'editorial-register',name:'Maya',dob:'2025-10-21',pronouns:'she',feed:'Both'},answers,{},new Date(Date.UTC(2025,9+age,21,12)).toISOString());
function add(id,category,timing,content,action) {
  units.push({id,category,timing,content,action,hash:crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex')});
}
function page(a,id,category,age,route) {
  a.run(`openPage(${JSON.stringify(route)})`);
  add(id,category,age,text(a.html()),route);
}
for(let age=0;age<=12;age++) {
  const a=make(age);
  for(const [cat,route] of [['Home','home'],['Development','topic:Development'],['Play','topic:Daily rhythm'],['Sleep','topic:Sleep'],['Feeding','topic:Feeding'],['Safety','topic:Safety'],['Health','topic:Health']])
    page(a,`${cat}.month.${age}`,cat,age,route);
  const ideas=JSON.parse(a.run(`JSON.stringify(monthlyPlayActivities(${age},null))`));
  for(const idea of ideas)page(a,`Play.${age}.${idea.id}`,'Play',age,`play-activity:${age}:${idea.id}`);
}
const a=make();
const skills=JSON.parse(a.run('JSON.stringify(journeySkills())'));
for(const skill of skills)page(a,'Development.skill.'+skill.key,'Development','CDC reference: '+skill.age,`skill-guide:${skill.key}`);
for(const age of [0,1,2,4,6,9,12])for(const part of ['expect','vaccines','questions','help'])
  page(a,`Health.${age}.${part}`,'Health','Visit: '+age,`health-detail:${age}:${part}`);
for(const cat of ['Sleep','Feeding']) {
  const data=JSON.parse(a.run(`JSON.stringify(AHEAD_CHANGES.${cat})`));
  data.CH.forEach((c,i)=>page(a,`${cat}.guide.${c.key}`,cat,c.when,`chg:${cat}:s:${i}`));
  data.EV.forEach((e,i)=>page(a,`${cat}.change.${e.key}`,cat,e.when,`chg:${cat}:e:${i}`));
  for(const [stage,questions] of Object.entries(data.DEC))questions.forEach((q,i)=>q[2].forEach((o,j)=>
    add(`${cat}.question.${stage}.${i}.${j}`,cat,'Question in '+stage,{question:q[0],presentation:q[3]||'answer',prompt:q[1],choice:o[0],action:o[1],context:q[3]==='compare'?q[4]:o[2]},`chg:${cat}:q:${data.CH.findIndex(c=>c.key===stage)}:${i}`)));
  for(const screen of cat==='Sleep'?['safe','help']:['safe','milk','allergy','help'])page(a,`${cat}.reference.${screen}`,cat,'Reference',`chg:${cat}:${screen}`);
}
for(const choice of ['learn','trying','routine','help']) {
  a.run(`chgChooseSettling('${choice}')`);
  page(a,'Sleep.settling.'+choice,'Sleep','Parent choice, from 4 months','chg:Sleep:settle');
}
const checks=JSON.parse(a.run('JSON.stringify(safetyHomeItems())'));
for(const [id,c] of Object.entries(checks))add('Safety.check.'+id,'Safety','Single owned preparation checklist',{title:c.title,reason:c.why||null,action:c.body,instructions:c.detail,source:c.url},'safety-checklist');
const milk=make(5,{solids:'Yes',foodExperience:'new'});
for(const reference of ['nurse','expressed','bottle','both']) {
  milk.run(`chgChooseMethod('${reference}')`);
  page(milk,'Feeding.milk-reference.'+reference,'Feeding','5-month first-food example','topic:Feeding');
}
const result={schema:1,note:'Actual template/source inventory. Hashes identify changed units; they do not certify usefulness or medical accuracy. See editorial-acceptance-2026-10-23.md for human decisions.',units};
if(process.argv.includes('--write'))fs.writeFileSync(path.resolve(__dirname,'../../docs/editorial-acceptance-register.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({units:units.length,categories:[...new Set(units.map(u=>u.category))],written:process.argv.includes('--write')},null,2));
