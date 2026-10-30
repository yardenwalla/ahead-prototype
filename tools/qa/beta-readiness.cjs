// Real templates and navigation handlers, including saved routes and late joiners.
// Browser layout, external HTTP status and clinical review are separate checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const boot = require('./content-runtime.cjs');
let checks = 0, renders = 0, destinations = 0;
const failures = [], links = new Set();
const check = (v, why) => { checks++; if (!v) failures.push(why); };
const clean = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const decode = s => s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const categories = ['Development','Daily rhythm','Sleep','Feeding','Safety','Health'];
const nav = /^(?:openPage|openGuide|openSection|openHealthDetail|openSafetyStage|openSafetyChecklist|chgGo|nextPlayActivity|openHomeMilkGuide|openFeedingGuide|openSavedView|openSavedGuide|openYearMonth|openResource|navigate)\(/;
function inspect(a, tag) {
  renders++; const html = a.html(), text = clean(html);
  check(html.length > 250 && /<h[12][ >]/.test(html), tag + ': useful destination');
  check(!/\bundefined\b|\bNaN\b|\[object Object\]/.test(text), tag + ': complete copy');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]);
  check(new Set(ids).size === ids.length, tag + ': unique element IDs');
  for (const attr of html.matchAll(/(?:onclick|onchange|onsubmit)="([^"]+)"/g)) {
    const code = decode(attr[1]);
    try { new vm.Script('(function(event){' + code + '})'); }
    catch(e) { failures.push(tag + ': invalid handler ' + code); }
    for (const call of code.matchAll(/(?<![.\w])([A-Za-z_$][\w$]*)\(/g)) {
      if (['if','for','while','switch','catch','function'].includes(call[1])) continue;
      check(a.run(`typeof ${call[1]} === 'function'`), tag + ': handler exists ' + call[1]);
    }
  }
  for (const m of html.matchAll(/href="([^"]*)"/g)) {
    const url = decode(m[1]); check(/^(https:\/\/|tel:|mailto:)/.test(url), tag + ': valid link ' + url);
    if (url.startsWith('https:')) links.add(url);
  }
  check(!/<h[1-4][^>]*>\s*<\/h[1-4]>/.test(html),tag+': no empty headings');
  return html;
}
for (const early of [false,true]) for (let age=0; age<=12; age++) {
  const clock = new Date(Date.UTC(2025,9+age,21,12)).toISOString();
  for (const variant of ['unknown','new','meals']) {
    const answers = variant === 'unknown' ? {} : {solids:'Yes',foodExperience:variant==='new'?'new':'established'};
    const a=boot({name:'Ari & Jo',dob:'2025-10-21',due:early?'2025-12-02':'',early,feed:'Both',pronouns:'they',example:false},answers,{},clock);
    const seeds=['home','categories','ahead','explore','saved','profile','personalize','timeline','trust',...categories.map(t=>'topic:'+t)];
    for(const route of seeds) {
      try {
        a.run(`month=actualMonth();historyStack=[];openPage(${JSON.stringify(route)})`);
        const html=inspect(a,`${early}/${age}/${variant}/${route}`);
        const origin=a.run('JSON.stringify({page,month})');
        const actions=[...new Set([...html.matchAll(/onclick="([^"]+)"/g)].map(x=>decode(x[1])).filter(x=>nav.test(x)))];
        for(const action of actions) {
          try {
            a.run(`page=${JSON.stringify(JSON.parse(origin).page)};month=${JSON.parse(origin).month};historyStack=[];${action}`);
            destinations++;inspect(a,`${age}/${route} → ${action}`);
          } catch(e) { failures.push(`${age}/${route} → ${action}: ${e.message}`); }
        }
      } catch(e) { failures.push(`${age}/${route}: ${e.message}`); }
    }
  }
}
// Explicit experiences must not be overwritten by age, and previews must use the chosen month.
{
  const a=boot({name:'Sam',dob:'2025-10-21',early:false,feed:'Formula'},{solids:'Yes',foodExperience:'new'});
  a.run("navigate('categories');openPage('topic:Feeding')");
  check(/First tastes<\/b>[\s\S]{0,400}Start here/.test(a.html()),'Late first bites stay First foods');
  a.run("openPage('topic:Feeding')");inspect(a,'late first bites');
  check(!/Coming up · Usually 7–9/.test(clean(a.html())),'No elapsed window is called coming up');
  a.run("month=1;openPage('topic:Sleep')");check(a.run("chgStageIndex('Sleep')===0"),'Sleep preview uses selected month');
  a.run("month=1;openPage('topic:Feeding')");check(a.run("chgStageIndex('Feeding')===0"),'Feeding preview uses selected month');
  a.run("month=actualMonth();chgSetSafety('rolling')");check(a.run("currentSafetyMovementStage()==='rolling' && safetyStageNow()==='pulling'"),'Recorded rolling stays a fact while older-age Safety prepares ahead');
  a.run("chgSetSafety('pulling')");check(a.run("safetyStageNow()==='pulling'"),'Later reported movement updates Safety');
}
// Saving every Sleep/Feeding view produces a visible, correctly named row and reopens that view.
{
  const a=boot({name:'Sam',dob:'2026-05-21',early:false,feed:'Formula'});
  for(const cat of ['Sleep','Feeding']) {
    const n=a.run(`AHEAD_CHANGES.${cat}.CH.length`);
    for(const screen of ['safe','settle','help',...(cat==='Feeding'?['milk','allergy']:[]),...Array.from({length:n},(_,i)=>'s:'+i)]) {
      const route='chg:'+cat+':'+screen;
      a.run(`openPage(${JSON.stringify(route)});saveCurrentGuide(${JSON.stringify(cat)})`);
      const key=a.run(`guideBookmarkKey(${JSON.stringify(cat)})`);
      check(!!a.run(`savedViewData(${JSON.stringify(key)})`),route+': bookmark supported');
      a.run("openPage('saved')");check(a.html().includes(key),route+': bookmark visible');
      a.run(`openSavedView(${JSON.stringify(key)})`);inspect(a,route+': bookmark destination');
      check(a.run('page')===route,route+': bookmark opens exact view');
    }
  }
  a.run("openSection('Sleep','sleep-night-feeds')");check(a.html().includes('id="sleep-night-feeds"'),'Night-feeds link lands at current age reference');
  a.run("openSection('Feeding','bottle-handling')");check(a.run("page==='chg:Feeding:milk'"),'Milk handling opens its reference');
  a.run("openPage('chg:Sleep:settle')");inspect(a,'settling page');
  check(a.html().includes('More of you, more gradual')&&!a.html().includes('settling-guide'),'Sleep training shows every method, with no picker');
  a.run("openPage('topic:Feeding');openPage('chg:Feeding:d:milk');chgChooseMethod('nurse')");
  check(a.html().includes('value="nurse" selected'),'Milk reference can be selected directly');
  a.run("editingProfile=true;draft={...profile,feed:'Formula'};setupStep=2;document.querySelector('#feed').value='Formula';submitSetup({preventDefault(){}});openPage('topic:Feeding');openPage('chg:Feeding:d:milk')");
  // This profile was already Formula, so a deliberate Nursing reference is retained.
  check(a.html().includes('value="nurse" selected'),'Unchanged milk type retains the chosen reference');
  a.run("editingProfile=true;draft={...profile};setupStep=2;document.querySelector('#feed').value='Both';submitSetup({preventDefault(){}});openPage('topic:Feeding');openPage('chg:Feeding:d:milk')");
  check(a.html().includes('value="both" selected'),'Changing milk type updates the default reference');
  check(!/<dt>Milk<\/dt>/.test(a.html()),'Combined nursing and bottles do not show two unlabeled milk amounts');
  a.run("openPage('chg:Sleep:safe')");
  check(a.html().includes('id="sleep-rolling"')&&a.html().includes('id="sleep-crib-height"'),'Safety links have direct sleep-space targets');
}
// Malformed optional profile fields and broken stored profiles do not crash startup.
{
  for(const p of [{},{dob:'not-a-date'},{dob:'2026-02-30'},null,{dob:'2026-05-21',name:42,feed:'unknown'}]) {
    try { const a=boot(p);inspect(a,'profile recovery');check(!a.html().includes('NaN'),'Profile recovery has no broken age'); }
    catch(e){failures.push('Profile recovery: '+e.message);}
  }
}
// Records survive a birthday correction; a new baby with the same birthday gets its own record.
{
  const store={},a=boot({name:'Sam',dob:'2026-05-21',early:false,feed:'Both'}, {}, store);
  a.run("saveVisitNotes(6,'Keep these notes');saveJourneyVisit(4,{date:'2026-10-20'})");
  a.run("editingProfile=true;draft={...profile,dob:'2026-05-20'};setupStep=2;document.querySelector('#feed').value='Both';submitSetup({preventDefault(){}})");
  check(a.run("visitNotesFor(6)==='Keep these notes'&&!!healthRecord(4)"),'Birthday correction preserves records');
  a.run("startSetup();draft={name:'New baby',dob:'2026-05-20',early:false};setupStep=2;document.querySelector('#feed').value='Formula';submitSetup({preventDefault(){}})");
  check(a.run('journeyData().records.length===0'),'New baby does not inherit another baby’s timeline');
  check(a.run("visitNotesFor(6)===''"),'New baby does not inherit notes');
}
// Browser history model: back/forward, app back, reload and the next birthday.
{
  const p={name:'Sam',dob:'2026-05-21',early:false,feed:'Both'},store={};
  const a=boot(p,{},store,'2026-10-21T12:00:00Z',{history:true});
  a.run("openPage('topic:Sleep');openPage('chg:Sleep:settle');history.back()");
  check(a.run("page==='topic:Sleep'"),'Browser Back returns to the parent view');
  a.run('history.forward()');check(a.run("page==='chg:Sleep:settle'"),'Browser Forward restores the detail');
  a.run('back()');check(a.run("page==='topic:Sleep'"),'App back follows the parent view');
  a.run('history.forward()');check(a.run("page==='chg:Sleep:settle'"),'App back does not add a duplicate history entry');
  a.run("navigate('home')");const state=JSON.parse(a.run('JSON.stringify(history.state)'));
  const b=boot(p,{},store,'2026-11-21T12:00:00Z',{history:true,navigationState:state});
  check(b.run("page==='home'&&month===6"),'Returning Home advances with the baby’s age');
  a.run("month=9;openPage('topic:Feeding')");const preview=JSON.parse(a.run('JSON.stringify(history.state)'));
  const c=boot(p,{},store,'2026-11-21T12:00:00Z',{history:true,navigationState:preview});
  // Oct 27: a month picked on Home carries into the categories as a labeled preview, with a way back to now.
  check(c.run("page==='topic:Feeding'&&month===9")&&/Previewing 9 months/.test(c.html())&&/returnToCurrentMonth/.test(c.html()),'A guide opened from a previewed month says it is a preview and offers the way back');
}
// The six-week transition is not postponed until the two-month birthday.
{
  for(const cat of ['Sleep','Feeding']) {
    const a=boot({name:'Lee',dob:'2026-09-01',early:false,feed:'Formula'},{},{},'2026-10-21T12:00:00Z');
    check(a.run(`chgStageIndex('${cat}')===1`),cat+': seven-week-old leaves the newborn guide');
  }
}
// Each monthly play collection contains variety, with all supporting detail and illustration data.
{
  const a=boot({name:'Lee',dob:'2026-05-21',early:false,feed:'Both'});let previous=[];
  for(let m=0;m<=12;m++) {
    const ids=JSON.parse(a.run(`JSON.stringify(monthlyPlayActivities(${m}).map(x=>x.id))`));
    check(ids.length>=6&&new Set(ids).size===ids.length,'Play '+m+': six distinct ideas');
    check(ids.filter(x=>previous.includes(x)).length<=1,'Play '+m+': current collection does not repeat last month');
    previous=ids;
    for(const id of ids){check(a.run(`!!PLAY_CONTEXT['${id}']&&!!PLAY_VISUALS['${id}']`),'Play detail and art '+id);a.run(`openPage('play-activity:${m}:${id}')`);inspect(a,'Play '+m+'/'+id);}
  }
}
// A previously reported roll does not replace each later month's summary indefinitely.
{
  const summaries=[];
  for(const age of [7,8,9]) {
    const a=boot({name:'Sam',dob:'2025-10-21',early:false,feed:'Both'},
      {roll:'Yes',stageDates:{movement:'2026-03-21'}},{},new Date(Date.UTC(2025,9+age,21,12)).toISOString());
    const body=a.run('monthlyFocus().body');summaries.push(body);
    check(!body.includes('is rolling, opening up'),'Old movement is not announced again at '+age+' months');
  }
  check(new Set(summaries).size===3,'Home summaries progress across months with unchanged answers');
}
fs.mkdirSync('tools/qa/out',{recursive:true});
fs.writeFileSync('tools/qa/out/beta-links.json',JSON.stringify([...links].sort(),null,2));
fs.writeFileSync('tools/qa/out/beta-readiness.json',JSON.stringify({checks,renders,destinations,externalLinks:links.size,failures},null,2));
console.log(JSON.stringify({checks,renders,destinations,externalLinks:links.size,failures:failures.slice(0,35),failureCount:failures.length},null,2));
assert.equal(failures.length,0,'Beta regressions must pass');
