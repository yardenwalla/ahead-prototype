/* Ahead · Love experience preview. Uses all original categories, detail routes and saved records. */
(function(){
  'use strict';
  var mode='improved';
  try { mode=sessionStorage.getItem('xp-love-mode')||'improved'; } catch(e){}
  var origComplete=window.completeCategory,origYear=window.categoryYear,origChanges=window.changesRoute,origRender=window.render;
  var currentAction=null;
  var babyName=function(){try{return name()||'Ari';}catch(e){return 'Ari';}};
  var E=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var inMode=function(){return mode==='improved';};
  var formatMonth=function(m){return m===12?'1 year':m===1?'1 month':m+' months';};
  var refFor=function(a){return a<4?2:a<6?4:a<9?6:a<12?9:12;};
  var discovery={
    2:['A little back-and-forth is beginning','Around this age, familiar voices and faces become even more interesting. Notice the small ways your baby responds to you.','The first little conversations'],
    4:['It’s starting to feel like a conversation','A sound, a pause, a smile. Your baby is learning that getting your attention can be a two-way game.','What your baby is discovering'],
    6:['Little actions are getting big reactions','Reach for a toy. Make a sound. See what happens. Your baby is discovering that small actions can change their world.','Inside their world'],
    9:['What’s hidden isn’t necessarily gone','A toy disappears behind your hand. Your baby may begin looking for it—and games like peekaboo take on new meaning.','Inside their world'],
    12:['The everyday world is becoming an experiment','Putting things in, taking them out, copying what you do. Ordinary moments offer new ways to learn.','Inside their world']
  };
  var icon=function(kind){
    var p={town:'<circle cx="21" cy="34" r="4"/><circle cx="57" cy="34" r="4"/><path d="M22 30h35l-5-17H28l-6 17Zm10-17V8m0 0h12m-12 0-4 5"/>',road:'<rect x="12" y="18" width="56" height="19" rx="6"/><path d="m22 18 8-12h25l10 12"/><circle cx="24" cy="38" r="5"/><circle cx="57" cy="38" r="5"/>',fly:'<path d="m7 26 28 4 32-21c4-2 7 2 3 5L46 38l-10 4-14-5-8 4-4-4 9-8-12-3Z"/>',stay:'<path d="M12 23 40 6l28 17v26H12V23Z"/><path d="M32 49V30h16v19"/>',abroad:'<circle cx="40" cy="26" r="23"/><path d="M17 26h46M40 3c-10 8-14 17-14 23s4 16 14 23M40 3c10 8 14 17 14 23s-4 16-14 23"/>',water:'<path d="M8 34c9-7 14 7 23 0s14 7 23 0 14 7 23 0M8 44c9-7 14 7 23 0s14 7 23 0 14 7 23 0"/><circle cx="57" cy="12" r="9"/>'}[kind]||'';
    return '<svg aria-hidden="true" viewBox="0 0 84 56" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">'+p+'</svg>';
  };
  function toolbar(){
    if(document.getElementById('xp-preview-bar'))return;
    var el=document.createElement('div');el.id='xp-preview-bar';
    el.innerHTML='<div class="xp-bar-inner"><span class="xp-label">ahead. <span class="xp-note">· Ari demo · experience preview</span></span><div class="xp-controls"><div class="xp-pair" aria-label="Compare designs"><button data-xp-mode="improved" aria-pressed="true">Proposed</button><button data-xp-mode="original" aria-pressed="false">Original</button></div><div class="xp-pair" aria-label="Sample age"><button data-xp-age="2">2 mo</button><button data-xp-age="6">6 mo</button><button data-xp-age="10">10 mo</button></div></div></div>';
    document.body.insertBefore(el,document.body.firstChild);
  }
  function refreshBar(){
    document.querySelectorAll('[data-xp-mode]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.xpMode===mode));});
    var a=0;try{a=actualMonth();}catch(e){}
    document.querySelectorAll('[data-xp-age]').forEach(function(b){b.setAttribute('aria-pressed',String(+b.dataset.xpAge===a));});
  }
  window.xpSetMode=function(m){
    mode=m==='original'?'original':'improved';
    try{sessionStorage.setItem('xp-love-mode',mode);}catch(e){}
    if(typeof page==='string'&&page.indexOf('chg:Out and about:xp:')===0)page='topic:Out and about';
    render();window.scrollTo(0,0);
  };
  window.xpSetAge=function(n){
    n=+n;if([2,6,10].indexOf(n)<0)return;
    var d=new Date(NOW.getFullYear(),NOW.getMonth()-n,Math.min(NOW.getDate(),28));
    profile=Object.assign({},profile,{name:'Ari',pronouns:'he',dob:iso(d),due:'',early:false,feed:'Both',example:true,joined:iso(NOW)});
    answers={};if(n>=6)answers.solids='Yes';if(n===10)answers.twoNaps='Yes';
    try{persist();}catch(e){}
    page='home';month=actualMonth();render();window.scrollTo(0,0);
  };
  function newHome(){
    var original=document.querySelector('#main .hg-page');
    if(!original)return;
    var source=original.querySelector('.he-hero')||original.querySelector('.hg-hero')||original.querySelector('.hs-hero');
    if(!source)return;
    var srcTitle=source.querySelector('h1');
    var srcLead=source.querySelector('.he-lead')||source.querySelector('.hg-lead')||source.querySelector('.hs-lead');
    var action=source.querySelector('button.hg-btn')||source.querySelector('button.he-see');
    currentAction=action||null;
    var age=0;
    try{age=developmentMonth(actualMonth());}catch(e){age=actualMonth();}
    var a=0;try{a=actualMonth();}catch(e){}
    var ref=refFor(age),D=discovery[ref],nm=E(babyName()),scene='';
    try{scene=typeof devScene==='function'?devScene(ref):'';}catch(e){}
    if(!scene)try{scene=typeof homeMonthArt==='function'?homeMonthArt(a):'';}catch(e){}
    var noteByStage={
      2:[['A little conversation','Listen for a coo, then pause and respond.'],['Longer looks','Your face might keep his attention a little longer.']],
      4:[['Sounds and smiles','A familiar voice can turn into a back-and-forth game.'],['New interest in hands','He may stop to study his own fingers.']],
      6:[['Sounds that get a response','Notice when he makes a sound and waits for your answer.'],['Toys that do something','A tap or shake can make a new sound.']],
      9:[['Looking for what disappears','Try briefly hiding a toy, and watch for interest.'],['New ways to communicate','A look or gesture may tell you what he wants.']],
      12:[['Repeating on purpose','Putting things in and taking them out becomes a game.'],['Copying you','Songs and simple gestures are worth repeating.']]
    };
    var ideas={2:['Your face is the best toy','Move close, smile, then leave a moment for a little sound back.','close-face'],
      4:['Make it a conversation','Copy one of his sounds, then pause as if it were his turn.','sound-answer'],
      6:['A tiny cause-and-effect game','Tap a soft toy, then let him explore what happens when he touches it.','floor-drum'],
      9:['Where did it go?','Hide part of a favorite toy under a cloth and let him look for it.','hidden-toy'],
      12:['In, out, repeat','Give him a wide, safe container and a few big objects to drop in.','put-in']};
    var n=noteByStage[ref]||[],idea=ideas[ref];
    var p=typeof babyPronouns==='function'?babyPronouns():{s:'he',o:'him',p:'his'};
    var changeNodes=[].slice.call(original.querySelectorAll('.hg-rows .hub-row'));
    var dayCards=[].slice.call(original.querySelectorAll('.hg-cards .hg-card'));
    if(!changeNodes.length)changeNodes=dayCards;
    var overview=source.querySelector('h1')?source.querySelector('h1').textContent:'A new change is taking shape';
    var expl=srcLead?srcLead.textContent:'See what this stage could bring.';
    var first=changeNodes.slice(0,2).map(function(node){return node.outerHTML;}).join('');
    var more=changeNodes.slice(2).map(function(node){return node.outerHTML;}).join('');
    var ageLine=original.querySelector('.home-age-line');
    var birthday=original.querySelector('.hg-banner');
    var checkin=original.querySelector('.connected-checkin');
    var details=original.querySelector('.hg-next');
    var top=(ageLine?ageLine.outerHTML:'')+(birthday?birthday.outerHTML:'');
    var hero='<div class="xp-story"><div class="xp-story-head"><span class="xp-eyebrow">INSIDE '+nm.toUpperCase()+'’S WORLD · '+E(formatMonth(a))+'</span><h1>'+E(D[0])+'</h1><p>'+E(D[1])+'</p></div><div class="xp-story-scene" aria-hidden="true">'+scene+'</div><button data-xp-page="topic:Development" class="xp-story-discover">Discover what he’s learning <span>→</span></button></div>';
    var notice='<section class="xp-section"><div class="xp-section-head"><h2>Little things to look for</h2></div><div class="xp-observe">'+n.map(function(s,i){return '<div class="xp-observe-item"><span class="xp-observe-index">0'+(i+1)+'</span><div><b>'+E(s[0])+'</b><small>'+E(s[1])+'</small></div></div>';}).join('')+'</div><p class="xp-hint">These are possibilities, not milestones he needs to have reached.</p></section>';
    var now='<section class="xp-section"><div class="xp-section-head"><h2>Useful around now</h2></div>';
    if(first)now+='<div class="xp-rest-rows">'+first+'</div>';
    if(more)now+='<details class="xp-details xp-now-more"><summary>See other changes this month</summary><div class="xp-rest-rows">'+more+'</div></details>';
    now+='</section>';
    var play='<section class="xp-section"><div class="xp-section-head"><h2>Try something together</h2></div><button class="xp-play-card" data-xp-page="chg:Development:d:idea:'+ref+':'+idea[2]+'"><span class="xp-play-art" aria-hidden="true">'+(typeof hubArt==='function'?hubArt('hand','Development'):'✦')+'</span><span><b>'+E(idea[0])+'</b><small>'+E(idea[1])+'</small><em>See how →</em></span></button></section>';
    var upcoming='<section class="xp-section"><button class="xp-main-change" data-xp-nav="next"><span class="xp-icon">'+(typeof hubArt==='function'?hubArt('clock','Development'):'◷')+'</span><span class="xp-copy"><small>COMING INTO VIEW</small><b>See what changes next</b><em>Big transitions, and when to prepare for them</em></span><span class="xp-arrow">›</span></button></section>';
    var bottom='<p class="xp-preview-support">Every baby develops at their own pace. The examples are for discovery, not a developmental assessment.</p>';
    var root=document.createElement('div');root.className='xp-page xp-home';root.innerHTML=top+hero+(checkin?'<section class="xp-section">'+checkin.outerHTML+'</section>':'')+notice+now+play+upcoming+bottom;
    original.replaceWith(root);
  }
  var trips={
    town:{title:'A little trip out',sub:'A walk, a café, or a few errands',hero:'A small outing should feel doable',lead:'Pack for your next feed and diaper change, then leave a little room for the unexpected.',cta:'Around town',old:'errands',steps:[['Choose an easy time','Go after a feed if that works, but there’s no need to wait for a perfect window.'],['Keep your baby comfortable','Check the weather, shade, and clothing. Keep your baby close and supervised.'],['Let the plan flex','A short walk counts. Turn back when you need to.']],what:'A feed or nap catches you out? Pause somewhere safe. A car seat or stroller is for travel, not routine unsupervised sleep.',packs:['Diapers, wipes and changing mat','Spare outfit','A lightweight blanket for changing or comfort']},
    road:{title:'A longer drive',sub:'Plan breaks, feeds and the car seat',hero:'Make the journey easier, not rigid',lead:'A few planned pauses and a well-fitted car seat matter more than following an exact schedule.',cta:'Road trips',old:'road',steps:[['Check the car seat','Keep it rear-facing and installed according to both manuals. Check the harness fit before driving.'],['Leave space for breaks','Plan safe places to stop for feeds, changes and time out of the seat.'],['Prepare for arrival','Bring a safe sleep space if you’ll be there for nap or bedtime.']],what:'Need a feed? Pull over and stop safely first. Never feed a baby while the car is moving.',packs:['Diapers and wipes','Extra clothes and a changing mat','A safe sleep setup if staying through bedtime']},
    fly:{title:'Flying with your baby',sub:'From booking to landing',hero:'Know the three parts of flying',lead:'Think about the airport, the flight, and what you’ll need when you arrive.',cta:'Flying',old:'fly',steps:[['Before booking','Check the airline’s infant seating and car-seat policy. A separate seat with an approved restraint is safest.'],['At the airport','Allow time for security and changes; keep milk and necessary feeding supplies handy.'],['During the flight','Offer a breast, bottle or pacifier during descent if your baby wants it.']],what:'Flights change. Keep an extra feed, diapers and outfit available for delays.',packs:['Extra diapers and wipes for delays','Spare clothes for baby and caregiver','Feeding supplies for the flight and delays']},
    stay:{title:'Staying somewhere new',sub:'Grandparents, friends or a hotel',hero:'Make the new space baby-ready',lead:'A quick check when you arrive can make the room safer and bedtime calmer.',cta:'Staying away',old:'away',steps:[['Set up safe sleep','Use a firm, flat, empty sleep surface designed for babies.'],['Look from baby height','Check cords, small objects, stairs and furniture that could tip.'],['Bring a familiar routine','A familiar book or bedtime steps can help in a new place.']],what:'No safe sleep surface available? Arrange one before the trip; an adult bed or couch isn’t a substitute.',packs:['Appropriate travel crib or play yard','Familiar sleep sack and bedtime essentials','Feeding and changing supplies for the stay']},
    abroad:{title:'Going abroad',sub:'International travel',hero:'Start with what takes time',lead:'Passports, the destination’s health guidance and the journey deserve an early look.',cta:'Going abroad',old:'abroad',steps:[['Check documents early','Confirm passport and entry requirements for every traveler, including your baby.'],['Ask about health needs','Check with your pediatrician about any destination-specific vaccines or precautions.'],['Plan safe feeding','Know your options for safe water, bottles and food at the destination.']],what:'If illness or a delay changes the plan, know where you can get medical help locally.',packs:['Travel documents and copies','Enough feeding supplies for delays','Necessary medications and health details']},
    water:{title:'Pool or beach day',sub:'Water, shade and changing',hero:'Make the water the easy part',lead:'The priority is close, hands-on supervision, plus protection from heat and sun.',cta:'Pool or beach',old:'water',steps:[['Stay within arm’s reach','A supervising adult should stay close enough to touch the baby at all times in or near water.'],['Plan sun protection','Shade, clothing and a hat come first. Follow age-appropriate sunscreen advice.'],['Pack dry layers','Bring towels and a change of clothes so your baby stays comfortable.']],what:'Arm floats and other flotation toys don’t replace close supervision.',packs:['Swim diaper and change of clothes','Shade and a hat','Towels, wipes and drinking water for caregivers']}
  };
  function tripHome(){
    var n=E(babyName());
    var top='<div class="xp-page xp-outings">'+(typeof monthlyPageHeader==='function'?monthlyPageHeader('Out and about'):'')+
      '<div class="xp-intro"><span class="xp-eyebrow">Outings & travel · '+n+'</span><h1>Where are you headed?</h1><p>Pick the outing. We’ll show what matters for '+n+'’s age, plus the details worth knowing before you go.</p></div>';
    var colors={town:['#eaf3ec','#437761'],road:['#e9effa','#46638c'],fly:['#eeeafa','#6e5b98'],stay:['#fbeaf0','#a05d75'],abroad:['#f9eeda','#906d2c'],water:['#e2f3f1','#377f7b']};
    var tiles=Object.keys(trips).map(function(k){var x=trips[k],c=colors[k];return '<button class="xp-dest" style="--xp-bg:'+c[0]+';--xp-ink:'+c[1]+'" data-xp-trip="'+k+'"><span class="xp-dest-art">'+icon(k)+'</span><b>'+E(x.title)+'</b><small>'+E(x.sub)+'</small></button>';}).join('');
    var gear='<section class="xp-section"><details class="xp-details"><summary>Gear, packing & weather guides</summary><div>'+
      '<button class="xp-line" data-xp-page="chg:Out and about:d:car"><span class="xp-icon">'+icon('road')+'</span><span class="xp-copy"><b>Car seat</b><small>Fit, installation and outgrowing it</small></span><span class="xp-arrow">›</span></button>'+
      '<button class="xp-line" data-xp-page="chg:Out and about:d:stroller"><span class="xp-icon">'+icon('town')+'</span><span class="xp-copy"><b>Stroller</b><small>Harness, brakes and safe recline</small></span><span class="xp-arrow">›</span></button>'+
      '<button class="xp-line" data-xp-page="chg:Out and about:d:carry"><span class="xp-icon">'+icon('town')+'</span><span class="xp-copy"><b>Carrier</b><small>Safe positioning and facing out</small></span><span class="xp-arrow">›</span></button>'+
      '<button class="xp-line" data-xp-page="chg:Out and about:d:bag"><span class="xp-icon">'+icon('stay')+'</span><span class="xp-copy"><b>Diaper bag</b><small>Packing list matched to feeding</small></span><span class="xp-arrow">›</span></button>'+
      '<button class="xp-line" data-xp-page="chg:Out and about:d:weather"><span class="xp-icon">'+icon('water')+'</span><span class="xp-copy"><b>Weather & seasons</b><small>Heat, cold, sun and layers</small></span><span class="xp-arrow">›</span></button></div></details></section>';
    return top+'<div class="xp-destinations">'+tiles+'</div>'+gear+'<p class="xp-preview-support">All existing trip, weather and gear guides remain available.</p></div>';
  }
  function packFor(x){
    var f=String(profile.feed||'');
    var extra=f==='Formula'?['Formula, measured and prepared safely','Bottles and safe water if needed']:f==='Both'?['Milk or formula for feeds while away','Bottles and necessary preparation supplies']:['Expressed milk or a feeding plan for time apart','Bottles if needed'];
    return x.packs.concat(extra);
  }
  function tripPage(k){
    var x=trips[k];if(!x)return tripHome();
    var nm=E(babyName()),root='<div class="xp-page xp-trip-page">'+
      '<div class="xp-subnav"><button data-xp-page="topic:Out and about">‹ All outings</button><span> / '+E(x.cta)+'</span></div>'+
      '<section class="xp-plan-hero"><span class="xp-eyebrow">Your outing · '+nm+'</span><h1>'+E(x.hero)+'</h1><p>'+E(x.lead)+'</p>'+icon(k)+'</section>';
    var steps='<section class="xp-section"><div class="xp-section-head"><h2>A simple plan</h2></div><div class="xp-steps">'+x.steps.map(function(s,i){return '<div class="xp-step"><span class="xp-step-no">'+(i+1)+'</span><span><b>'+E(s[0])+'</b><small>'+E(s[1])+'</small></span></div>';}).join('')+'</div></section>';
    var items=packFor(x),key='xp-pack-'+k,selected=[];try{selected=JSON.parse(localStorage.getItem(key)||'[]');}catch(e){}
    var checks='<section class="xp-section"><div class="xp-section-head"><h2>Your packing list</h2><span class="xp-muted" data-xp-pack-count>'+selected.length+' of '+items.length+' packed</span></div><div class="xp-pack">'+items.map(function(s,i){return '<label class="xp-check"><input type="checkbox" data-xp-pack="'+k+'" data-xp-i="'+i+'" '+(selected.indexOf(i)>=0?'checked':'')+'><span>'+E(s)+'</span></label>';}).join('')+'</div><p class="xp-hint">Optional. Your checks stay in this preview.</p></section>';
    var note='<section class="xp-section"><div class="xp-whatif"><b>When plans change</b><p>'+E(x.what)+'</p></div></section>';
    var details='<section class="xp-section"><button class="xp-primary" data-xp-page="chg:Out and about:d:'+E(x.old)+'">Open the full '+E(x.cta.toLowerCase())+' guide &nbsp;→</button><p class="xp-photo-export-help">This opens Ahead’s existing detailed guidance—nothing has been removed.</p></section>';
    return root+steps+checks+note+details+'</div>';
  }
  window.completeCategory=completeCategory=function(t){return t==='Out and about'&&inMode()?tripHome():origComplete.apply(this,arguments);};
  window.categoryYear=categoryYear=function(t){return t==='Out and about'&&inMode()?tripHome():origYear.apply(this,arguments);};
  window.changesRoute=function(p){
    var m=/^chg:Out and about:xp:(town|road|fly|stay|abroad|water)$/.exec(p);
    if(m&&inMode())return tripPage(m[1]);
    return origChanges.apply(this,arguments);
  };
  window.render=render=function(){
    var result=origRender.apply(this,arguments);
    if(inMode()&&typeof page==='string'&&page==='home')try{newHome();}catch(e){console.error('Preview home',e);}
    refreshBar();return result;
  };
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-xp-mode],[data-xp-age],[data-xp-page],[data-xp-trip],[data-xp-current],[data-xp-nav]');
    if(!t)return;
    if(t.dataset.xpMode){window.xpSetMode(t.dataset.xpMode);return;}
    if(t.dataset.xpAge){window.xpSetAge(t.dataset.xpAge);return;}
    if(t.dataset.xpTrip){openPage('chg:Out and about:xp:'+t.dataset.xpTrip);return;}
    if(t.dataset.xpPage){openPage(t.dataset.xpPage);return;}
    if(t.dataset.xpNav){navigate(t.dataset.xpNav);return;}
    if(t.dataset.xpCurrent&&currentAction){currentAction.click();return;}
  });
  document.addEventListener('change',function(e){
    var t=e.target;if(!t.matches('[data-xp-pack]'))return;
    var key='xp-pack-'+t.dataset.xpPack,selected=[];
    try{selected=JSON.parse(localStorage.getItem(key)||'[]');}catch(err){}
    var i=+t.dataset.xpI;selected=selected.filter(function(v){return v!==i;});if(t.checked)selected.push(i);
    try{localStorage.setItem(key,JSON.stringify(selected));}catch(err){}
    var label=document.querySelector('[data-xp-pack-count]');
    var total=document.querySelectorAll('[data-xp-pack]').length;if(label)label.textContent=selected.length+' of '+total+' packed';
  });
  toolbar();refreshBar();
  if(typeof page!=='undefined'&&page==='welcome'&&typeof profile!=='undefined'&&profile.name){page='home';month=actualMonth();}
  render();
})();