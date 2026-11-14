/* Ahead · Childcare handoff and photo-first Memories refinements, preview-only. */
(function(){
  'use strict';
  var prevComplete=window.completeCategory,prevYear=window.categoryYear,prevTimeline=window.journeyTimeline;
  var enabled=function(){try{return sessionStorage.getItem('xp-love-mode')!=='original';}catch(e){return true;}};
  var escape=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  function betterChildcare(source){
    if(!enabled()||typeof source!=='string'||source.indexOf('Compare care options')<0)return source;
    var action='<section class="xp-care-quick"><b>Not sure which care is right for your family?</b><p>Compare the options that fit your schedule, budget and support.</p><button data-xp-page="chg:Childcare:d:fit">Find a starting point in four taps →</button></section>';
    var out=source.replace(/<button class="hub-link cc-quiz-link"[\s\S]*?<\/button>/,'');
    return out.replace('<h2 class="hub-h2">Compare care options</h2>',action+'<h2 class="hub-h2">Compare care options</h2>');
  }
  window.completeCategory=completeCategory=function(t){
    var original=prevComplete.apply(this,arguments);
    return t==='Childcare'?betterChildcare(original):original;
  };
  window.categoryYear=categoryYear=function(t){
    var original=prevYear.apply(this,arguments);
    return t==='Childcare'?betterChildcare(original):original;
  };
  window.journeyTimeline=journeyTimeline=function(){
    var original=prevTimeline.apply(this,arguments);
    if(!enabled()||typeof original!=='string'||original.indexOf('mem-page')<0)return original;
    var btn='<button class="xp-export-btn" data-xp-export="1" title="Download an offline copy of your monthly photos and firsts"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M4 17v3h16v-3"/></svg>Save a copy</button>';
    var note='<small class="xp-photo-export-help">Photos and firsts stay on this device. Save an offline copy to keep them somewhere safe.</small>';
    var modified=original.replace(/(<h1>[^<]*first year<\/h1>)/,'$1<div class="xp-mem-export">'+btn+'</div>');
    return modified.replace('<p class="hub-foot">Photos and entries stay on this device.</p>',note);
  };
  function monthName(m){
    return m===0?'Newborn':m===12?'One year':m===1?'One month':m+' months';
  }
  function imgFor(m){
    var thumbs=document.querySelectorAll('img[data-story-thumb="'+m+'"]');
    for(var i=0;i<thumbs.length;i++){
      var im=thumbs[i];
      if(im.classList.contains('is-ready')&&im.src&&im.src.indexOf('data:image/')===0)return im.src;
    }
    try{return typeof hubPhotoFor==='function'?hubPhotoFor(m):'';}catch(e){return '';}
  }
  function exportHTML(){
    var nm=typeof name==='function'?name():'Your baby',data={records:[]};
    try{data=journeyData()||data;}catch(e){}
    var recs=(data.records||[]).filter(function(r){return r.type==='milestone'&&r.status==='attended';});
    var dob=new Date(String(profile.dob)+'T12:00:00');
    function mo(d){
      var at=new Date(String(d)+'T12:00:00');
      var m=(at.getFullYear()-dob.getFullYear())*12+at.getMonth()-dob.getMonth();
      if(at.getDate()<dob.getDate())m--;
      return Math.max(0,Math.min(12,m));
    }
    var max=12;try{max=Math.min(12,actualMonth());}catch(e){}
    var sections=[];
    for(var m=0;m<=max;m++){
      var records=recs.filter(function(r){return mo(r.date)===m;});
      var pic=imgFor(m),photobox=pic?'<img class="photo" src="'+escape(pic)+'" alt="Photo for '+monthName(m)+'">':'<div class="placeholder">Your '+escape(monthName(m))+' photo</div>';
      var facts=records.length?'<div class="firsts">'+records.map(function(r){return '<p class="first"><b>'+escape(r.title)+'</b>'+ (r.notes?'<span>'+escape(r.notes)+'</span>':'')+'</p>';}).join('')+'</div>':'<p class="empty">No firsts recorded for this month.</p>';
      sections.push('<section class="month"><span class="kicker">'+escape(monthName(m))+'</span><div class="contents">'+photobox+'<div class="notes"><h2>'+escape(monthName(m))+'</h2>'+facts+'</div></div></section>');
    }
    var style='body{margin:0;background:#f6f2ef;color:#302b3e;font-family:ui-sans-serif,system-ui,Arial}main{max-width:800px;margin:32px auto;padding:16px}h1{font-size:38px;letter-spacing:-.04em;margin:8px 0}p.lead{color:#716976;margin:0 0 35px}.month{page-break-inside:avoid;background:#fffdfb;border:1px solid #ebe5e0;border-radius:22px;padding:25px;margin:20px 0}.kicker{color:#815f8d;font-size:12px;text-transform:uppercase;letter-spacing:.11em;font-weight:700}.contents{display:grid;grid-template-columns:240px 1fr;gap:23px;margin-top:15px;align-items:start}.photo{width:240px;max-height:380px;object-fit:contain;border-radius:12px}.placeholder{height:300px;background:#f7edf2;border-radius:12px;display:grid;place-items:center;color:#ab8fa3;font-size:13px}h2{margin:0 0 14px;font-size:27px}.first{padding:10px 0;margin:0;border-bottom:1px solid #eee8e3}.first b{font-size:15px;display:block}.first span{display:block;font-size:13px;color:#726b75;margin-top:4px}.empty{font-size:14px;color:#817989}footer{text-align:center;color:#8a8189;font-size:12px;margin:30px 0}@media(max-width:580px){main{margin:0}.contents{display:block}.photo{width:100%;max-height:500px}.placeholder{width:100%;height:200px}.notes{margin-top:16px}}@media print{body{background:#fff}main{margin:0;max-width:none}.month{border:1px solid #ddd;break-inside:avoid}}';
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(nm)+'’s first year · Ahead</title><style>'+style+'</style></head><body><main><div style="font-weight:800;letter-spacing:-.04em">ahead.</div><h1>'+escape(nm)+'’s first year</h1><p class="lead">Your monthly photos and the little firsts you saved.</p>'+sections.join('')+'<footer>Made with Ahead · An offline keepsake. Your photos are embedded in this file.</footer></main></body></html>';
  }
  window.xpExportMemories=function(){
    var contents=exportHTML(),blob=new Blob([contents],{type:'text/html;charset=utf-8'});
    var url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=(typeof name==='function'?name():'baby').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-first-year-ahead.html';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},3000);
  };
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-xp-export]'))window.xpExportMemories();
  });
})();