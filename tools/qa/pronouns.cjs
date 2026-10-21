const assert=require('node:assert/strict'),boot=require('./content-runtime.cjs');
let checks=0,renders=0;
const check=(v,m)=>{checks++;assert.ok(v,m);};
const profile={name:'Kai',dob:'2026-01-21',early:false,due:'',feed:'Both',example:false};
for(const selected of ['he','she','they',undefined]) {
  const a=boot({...profile,...(selected?{pronouns:selected}:{})},{solids:'Yes',foodExperience:'new'});
  const keys=a.run('Array.from(BABY_COPY_TEMPLATES.keys())');
  for(const source of keys) {
    const copy=a.run(`babyCopy(${JSON.stringify(source)})`);
    check(!/\{[A-Za-z]+\}/.test(copy),'All authored language tokens resolve');
    if(selected!=='she')check(!/\b(she|her|herself)\b/i.test(copy),'No assumed female pronouns in baby copy');
  }
  const subject=selected==='he'?'he':selected==='she'?'she':'they';
  check(a.run("babyCopy('Is she fed and changed?')")===((subject==='they'?'Are':'Is')+' '+subject+' fed and changed?'),'Question has correct verb agreement');
  check(a.run("babyCopy('Why is her poop different?')").startsWith('Why is '),'Possessive pronouns do not pluralize the noun’s verb');
  check(a.run("babyCopy('Can I give her water?')")==='Can I give '+(subject==='he'?'him':subject==='she'?'her':'them')+' water?','Object pronouns are correct');
  for(const topic of ['Development','Daily rhythm','Sleep','Feeding','Safety','Health']) {
    a.run(`openPage('topic:${topic}')`);renders++;
    check(!/\{[A-Za-z]+\}|undefined/.test(a.html()),'Category renders after pronoun change');
  }
  for(const cat of ['Sleep','Feeding']) {
    for(const part of ['safe','settle','help','milk','allergy']) {
      a.run(`openPage('chg:${cat}:${part}')`);renders++;
      if(selected!=='she')check(!/\b(she|her|herself)\b/i.test(a.html().replace(/<[^>]*>/g,' ')),'Reference screens also use the selected pronouns');
    }
    const data=JSON.parse(a.run(`JSON.stringify(AHEAD_CHANGES.${cat})`));
    for(let i=0;i<data.CH.length;i++) {
      a.run(`openPage('chg:${cat}:s:${i}')`);renders++;
      for(const [q,choices]of (data.DEC[data.CH[i].key]||[]).map((x,j)=>[j,x[2]]))for(let c=0;c<choices.length;c++) {
        a.run(`chgAnswer('${cat}:${data.CH[i].key}:${q}',${c})`);renders++;
        check(!/\{[A-Za-z]+\}|undefined/.test(a.html()),'Conditional answers render in every pronoun form');
        if(selected!=='she')check(!/\b(she|her|herself)\b/i.test(a.html().replace(/<[^>]*>/g,' ')),'Conditional answers do not keep female defaults');
      }
    }
  }
}
// Save through the actual onboarding handlers, reload, then edit without losing progress.
{
  const storage={},a=boot(profile,{},storage);
  a.run("startSetup();document.querySelector('#babyName').value='Lee';document.querySelector('#babyPronouns').value='he';document.querySelector('#dob').value='2026-05-21';document.querySelector('#early').checked=false;document.querySelector('#due').value='';submitSetup({preventDefault(){}});document.querySelector('#feed').value='Both';submitSetup({preventDefault(){}})");
  const saved=JSON.parse(storage['ahead-v2-profile']);
  check(saved.pronouns==='he','Onboarding saves the choice');
  const b=boot(saved,{rollDirection:'Not yet'},storage);
  check(b.run('babyPronounLabel()')==='He/him','Choice survives reload');
  b.run("saveJourneyVisit(4,{date:'2026-10-20',status:'planned',notes:'Why won’t she take a bottle?'});editingProfile=true;draft={...profile};setupStep=1;openPage('setup')");
  check(b.html().includes('value="he" selected'),'Edit details selects the saved choice');
  b.run("document.querySelector('#babyName').value='Lee';document.querySelector('#babyPronouns').value='they';document.querySelector('#dob').value='2026-05-21';document.querySelector('#early').checked=false;document.querySelector('#due').value='';submitSetup({preventDefault(){}});document.querySelector('#feed').value='Both';submitSetup({preventDefault(){}})");
  check(b.run("profile.pronouns==='they'&&answers.rollDirection==='Not yet'"),'Pronoun edit preserves reported abilities');
  check(b.run("healthRecord(4).notes==='Why won’t she take a bottle?'"),'Pronoun edit preserves visit notes');
  b.run("openPage('health-detail:4:notes')");
  check(b.html().includes('Why won’t she take a bottle?'),'Personal notes are displayed exactly as written');
}
// Surface scan across every month, including older Home/Safety copy not authored in the data module.
for(let m=0;m<=12;m++) {
  const a=boot({...profile,pronouns:'he',dob:new Date(Date.UTC(2026,9-m,21)).toISOString().slice(0,10)});
  for(const route of ['home',...['Development','Daily rhythm','Sleep','Feeding','Safety','Health'].map(t=>'topic:'+t)]) {
    a.run(`page=${JSON.stringify(route)};render()`);renders++;
    check(!/\b(she|her|herself)\b/i.test(a.html().replace(/<[^>]*>/g,' ')),'No female defaults remain on the main surfaces');
  }
}
console.log(JSON.stringify({checks,renders,status:'passed',limits:'Template/handler tests; updated form not browser-verified'},null,2));
