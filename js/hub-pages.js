/* Ahead · the remaining pages in the summary style: Timeline and recording, the "Coming up" page,
   the visit date form, and the play pages speaking about the baby by name.
   Builds on js/hub.js (window.__hub) and js/hub-categories.js. */
(function () {
  const H = () => window.__hub;
  const F = s => H().F(s);
  const C = () => window.__chg;
  const live = () => typeof isCurrent === 'function' && isCurrent();
  const esc2 = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- the baby by name, with the right pronouns ----------
     Play ideas were written about "baby" and "they". Rewrite the words a parent reads, never markup. */
  const AFTER_NOUN = /^(mirror|book|books|block|blocks|spoon|ball|rattle|crinkle|fabric|flap|toy|toys|nail|clippers|picture|board|photo|gate|monitor|carrier|tub|wipes|food|foods|oatmeal|sunscreen|toothbrush|bath|bottle|lotion|oil|shampoo|gym|bouncer|walker|sling|wrap|seat|carrier)\b/i;
  const MODAL = new Set(['can', 'may', 'might', 'will', 'could', 'should', 'would', 'must', 'did', 'cannot', 'can’t', 'won’t']);
  const ADVERB = new Set(['also', 'often', 'still', 'usually', 'just', 'only', 'may', 'sometimes', 'already', 'first', 'then', 'now', 'really']);
  const IRREG = { are: 'is', were: 'was', have: 'has', do: 'does', 'don’t': 'doesn’t', go: 'goes', 'aren’t': 'isn’t', 'weren’t': 'wasn’t', 'haven’t': 'hasn’t' };
  const verbS = w => IRREG[w] || (/[^aeiou]y$/.test(w) ? w.slice(0, -1) + 'ies' : /(s|sh|ch|x|z|o)$/.test(w) ? w + 'es' : w + 's');
  const capFirst = (s, like) => like[0] === like[0].toUpperCase() ? s[0].toUpperCase() + s.slice(1) : s;
  function babyify(text) {
    if (typeof name !== 'function') return text;
    const nm = name(), p = typeof babyPronouns === 'function' ? babyPronouns() : { s: 'they', o: 'them', p: 'their', r: 'themselves' };
    let t = text.replace(/\b(your |the |every |each |a |any )?([Bb])aby(’s|'s)?\b(?![-‑])/g, (m, det, b, poss, off, str) => {
      const after = str.slice(off + m.length).trimStart();
      if (!poss && AFTER_NOUN.test(after)) return m;
      if (det && det !== 'your ' && !poss) return m;
      if (det && det !== 'your ' && poss) return det + nm + '’s';
      return nm + (poss ? '’s' : '');
    });
    if (p.s === 'they') return t;
    t = t.replace(/\b([Tt]hey)(’re|'re)\b/g, (m, w) => capFirst(p.s, w) + '’s');
    t = t.replace(/\b([Tt]hey)(’ve|'ve)\b/g, (m, w) => capFirst(p.s, w) + '’s');
    t = t.replace(/\b([Tt]hey)(’ll|'ll)\b/g, (m, w) => capFirst(p.s, w) + '’ll');
    t = t.replace(/\b([Tt]hey)\s+(\S+)(\s+(\S+))?/g, (m, w, v1, rest, v2) => {
      const S = capFirst(p.s, w), a = v1.replace(/[.,;:!?]+$/, ''), punct = v1.slice(a.length);
      if (MODAL.has(a.toLowerCase())) return `${S} ${v1}${rest || ''}`;
      if (ADVERB.has(a.toLowerCase()) && v2) { const b2 = v2.replace(/[.,;:!?]+$/, ''); return `${S} ${a}${punct} ${MODAL.has(b2) ? v2 : verbS(b2) + v2.slice(b2.length)}`; }
      return `${S} ${verbS(a)}${punct}${rest || ''}`;
    });
    t = t.replace(/\b([Tt]hemselves)\b/g, (m, w) => capFirst(p.r || (p.o + 'self'), w));
    t = t.replace(/\b([Tt]heir)\b/g, (m, w) => capFirst(p.p, w));
    t = t.replace(/\b([Tt]hem)\b/g, (m, w) => capFirst(p.o, w));
    return t;
  }
  const babyifyHtml = html => html.replace(/>([^<]+)</g, (m, t) => '>' + babyify(t) + '<');
  window.hubBabyify = babyify;

  if (typeof playActivityPage === 'function') {
    const basePlay = playActivityPage;
    window.playActivityPage = playActivityPage = (lo, id) => babyifyHtml(basePlay(lo, id));
  }
  if (typeof developmentDomainPage === 'function') {
    const baseDomain = developmentDomainPage;
    window.developmentDomainPage = developmentDomainPage = (ref, d) => babyifyHtml(baseDomain(ref, d));
  }


  /* ---------- a photo a month ----------
     Photos stay on this device, resized small. Thirteen slots: newborn, 1–11 months and 1 year. */
  const PHOTO_KEY = () => 'ahead-photos:' + journeyKey();
  const photos = () => { try { return JSON.parse(localStorage.getItem(PHOTO_KEY())) || {}; } catch (e) { return {}; } };
  const savePhotos = o => { try { localStorage.setItem(PHOTO_KEY(), JSON.stringify(o)); return true; } catch (e) { return false; } };
  window.hubPhotoFor = m => photos()[m] || null;
  window.hubPickPhoto = function (m) {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files && input.files[0]; if (!file) return;
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const size = 360, c = document.createElement('canvas'), k = Math.max(size / img.width, size / img.height);
        c.width = c.height = size;
        c.getContext('2d').drawImage(img, (size - img.width * k) / 2, (size - img.height * k) / 2, img.width * k, img.height * k);
        const all = photos(); all[m] = c.toDataURL('image/jpeg', 0.8);
        if (!savePhotos(all)) hubToast('Couldn’t save that photo', 'Your device is out of space for photos.');
        URL.revokeObjectURL(url); const y = scrollY; render(); scrollTo(0, y);
        hubToast('Photo saved', `${m === 0 ? 'Newborn' : m === 12 ? '1 year' : m + ' month' + (m === 1 ? '' : 's')} · on ${name()}’s timeline`);
      };
      img.src = url;
    };
    input.click();
  };
  function photoStrip() {
    const now = Math.min(12, actualMonth()), all = photos();
    const label = m => m === 0 ? 'N' : m === 12 ? '1y' : String(m);
    const cells = Array.from({ length: 13 }, (_, m) => {
      const ph = all[m], open = m <= now;
      const cls = ['hub-ph', ph ? 'has-photo' : '', m === now ? 'is-now' : '', open ? '' : 'is-later'].join(' ');
      const inner = ph ? `<img src="${ph}" alt="">` : m === now ? '<span aria-hidden="true">＋</span>' : `<span>${label(m)}</span>`;
      const aria = `${m === 0 ? 'Newborn' : m === 12 ? '1 year' : m + ' months'} photo`;
      return open ? `<button class="${cls}" onclick="hubPickPhoto(${m})" aria-label="${ph ? 'Change' : 'Add'} ${aria}">${inner}</button>` : `<span class="${cls}" aria-label="${aria}, later">${inner}</span>`;
    }).join('');
    return `<h2 class="hub-h2">A photo a month</h2><div class="hub-photo-strip">${cells}</div>`;
  }

  /* ---------- small confirmations ---------- */
  window.hubToast = function (title, body) {
    document.querySelectorAll('.hub-toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'hub-toast'; t.setAttribute('role', 'status');
    t.innerHTML = `<span class="hub-toast-spark" aria-hidden="true">✨</span><span><b>${esc2(title)}</b><small>${esc2(body)}</small></span>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-in'));
    setTimeout(() => { t.classList.remove('is-in'); setTimeout(() => t.remove(), 300); }, 3600);
  };
  // "Seen it": save, then celebrate the row and say where it went.
  if (typeof window.hubSeen === 'function') {
    const baseSeen = window.hubSeen;
    window.hubSeen = function (key) {
      const ticks = [...document.querySelectorAll('#main .hub-tick')];
      const idx = ticks.findIndex(t => (t.querySelector('.hub-seen') || {}).getAttribute && t.querySelector('.hub-seen')?.getAttribute('onclick').includes(key));
      baseSeen(key);
      try { journeyNotice = null; } catch (e) {}
      const y = scrollY; render(); scrollTo(0, y);
      const row = document.querySelectorAll('#main .hub-tick')[idx];
      if (row) { row.classList.add('is-celebrate'); row.insertAdjacentHTML('beforeend', '<span class="hub-burst" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i><i>✧</i></span>'); }
      const rec = journeyData().records.find(r => r.type === 'milestone' && r.skillKey === key);
      if (rec) hubToast('A first, saved', `“${rec.title}” is on ${name()}’s timeline · ${journeyDateLabel(rec.date)}`);
    };
  }

  /* ---------- the month-birthday moment on Home ----------
     For three days after each month-birthday, the month card celebrates and gathers that month's firsts. */
  function monthBirthday() {
    if (!live()) return null;
    const dob = parse(profile.dob);
    const today = iso(NOW);
    let m = 0; while (m < 13 && iso(addMonths(dob, m + 1)) <= today) m++;
    if (m < 1 || m > 12) return null;
    const since = Math.round((parse(today) - parse(iso(addMonths(dob, m)))) / 864e5);
    if (since < 0 || since > 3) return null;
    const from = iso(addMonths(parse(profile.dob), m - 1));
    const firsts = journeyData().records.filter(r => r.type === 'milestone' && r.date >= from && r.date <= iso(NOW)).slice(-3);
    return { m, since, firsts };
  }
  const baseHome = window.adaptiveHome;
  if (typeof baseHome === 'function') {
    window.adaptiveHome = homeAtlas = function () {
      const html = baseHome(), b = monthBirthday();
      if (!b) return html;
      const nm = esc2(name()), label = b.m === 12 ? '1 year' : `${b.m} month${b.m === 1 ? '' : 's'}`, plabel = b.m === 12 ? 'first-birthday' : `${b.m}-month`, photo = window.hubPhotoFor(b.m);
      const title = b.since === 0 ? (b.m === 12 ? `${nm} is 1 year old today` : `${nm} is ${label} old today`) : (b.m === 12 ? `${nm} turned 1` : `${nm} turned ${label}`);
      const lead = b.firsts.length ? `Here’s what you noticed this month. Add a photo to keep it with ${nm}’s timeline.` : `A whole month of new. Add a photo to keep this one with ${nm}’s timeline.`;
      const card = `<div class="home-summary connected-summary-intro hub-bday"><span class="hub-bday-num" aria-hidden="true">${b.m === 12 ? '1' : b.m}</span><span class="hub-bday-spark" aria-hidden="true">✦</span><p class="hub-bday-eyebrow">${b.m === 12 ? 'Happy first birthday' : 'Happy ' + label}</p><h1>${title}</h1><p class="hub-bday-lead">${lead}</p>${b.firsts.length ? `<div class="hub-bday-chips">${b.firsts.map(r => `<span>✓ ${esc2(r.title)}</span>`).join('')}</div>` : ''}<button class="hub-bday-photo" onclick="hubPickPhoto(${b.m})">${photo ? `<img src="${photo}" alt="">Change the ${plabel} photo` : `<i aria-hidden="true">＋</i>Add a ${plabel} photo`}</button></div>`;
      return html.replace(/<div class="home-summary connected-summary-intro">[\s\S]*?<div class="home-summary-spectrum"[\s\S]*?<\/div><\/div>/, card);
    };
  }


  /* ---------- babies born early: which age each guide follows ----------
     Adjusted age is the default for development, feeding, sleep and care. A family can switch either group
     to birthday age, and stages keep moving on their own. Checkups always follow the birthday. */
  const adjustedMonth = developmentMonth;
  const ageMode = group => (profile.early && profile.due && profile.ageMode && profile.ageMode[group]) || 'adjusted';
  window.hubAgeFor = function (group, m = month) { return ageMode(group) === 'birthday' ? m : adjustedMonth(m); };
  developmentMonth = function (m = month) { return ageMode('dev') === 'birthday' ? m : adjustedMonth(m); };
  window.developmentMonth = developmentMonth;
  window.hubSetAgeMode = function (group, value) {
    profile.ageMode = Object.assign({}, profile.ageMode, { [group]: value }); persist();
    const y = scrollY; render(); scrollTo(0, y);
    hubToast('Updated', `${group === 'dev' ? 'Development & play' : 'Feeding, sleep and care'} will follow ${value === 'birthday' ? 'birthday age' : 'adjusted age'}.`);
  };
  if (typeof topicAge === 'function') {
    window.topicAge = topicAge = t => {
      if (!profile.early || !profile.due) return monthLabel(month);
      const group = t === 'Development' ? 'dev' : ['Feeding', 'Sleep', 'Daily rhythm'].includes(t) ? 'care' : null;
      return group && ageMode(group) === 'adjusted' ? monthLabel(adjustedMonth(month)) + ' adjusted' : monthLabel(month);
    };
  }

  /* ---------- Baby's details ---------- */
  if (typeof profileRework === 'function') {
    window.profileRework = profileRework = function () {
      const h = H(), nm = esc2(name());
      const born = journeyDateLabel(profile.dob);
      let b = `<div class="hub-detail-head"><span class="hub-big">${hubArt('star', 'Development')}</span><p class="hub-context">Baby’s details</p><h1>${nm}</h1><p class="hub-lead">${esc2(monthLabel(birthdayAge()))} old · born ${esc2(born)}${profile.early ? ' · born early' : ''}</p></div>`;
      b += h.list('About ' + nm, [
        h.row({ icon: 'bottle', cat: 'Development', title: 'Feeding', sub: esc2(profile.feed || 'Not set'), onclick: "editingProfile=true;draft={...profile};setupStep=2;openPage('setup')" }),
        h.row({ icon: 'smile', cat: 'Development', title: 'Pronouns', sub: esc2(babyPronounLabel()), onclick: "editingProfile=true;draft={...profile};setupStep=1;openPage('setup')" }),
        h.row({ icon: 'clock', cat: 'Development', title: 'Birthday and due date', sub: profile.early && profile.due ? `Born ${esc2(born)} · due ${esc2(journeyDateLabel(profile.due))}` : `Born ${esc2(born)}`, onclick: "editingProfile=true;draft={...profile};setupStep=1;openPage('setup')" })
      ]);
      if (profile.early && profile.due) {
        const seg = group => `<div class="hub-seg" role="group"><button class="${ageMode(group) === 'adjusted' ? 'is-on' : ''}" aria-pressed="${ageMode(group) === 'adjusted'}" onclick="hubSetAgeMode('${group}','adjusted')">Adjusted</button><button class="${ageMode(group) === 'birthday' ? 'is-on' : ''}" aria-pressed="${ageMode(group) === 'birthday'}" onclick="hubSetAgeMode('${group}','birthday')">Birthday</button></div>`;
        b += `<h2 class="hub-h2">Which age each guide follows</h2><section class="hub-card hub-agemode"><p class="hub-agemode-lead">${F(`Babies born early often go by adjusted age, but some follow their birthday in one area. Pick what fits ${nm}.`).replace(/Maya/g, nm)}</p><div class="hub-agemode-row"><span><b>Development & play</b><small>Now ${esc2(monthLabel(developmentMonth(actualMonth())))}</small></span>${seg('dev')}</div><div class="hub-agemode-row"><span><b>Feeding, sleep and care</b><small>Now ${esc2(monthLabel(hubAgeFor('care', actualMonth())))}</small></span>${seg('care')}</div></section>` + h.note('Checkups always follow the birthday.');
      }
      const stageRow = (icon, cat, title, sub, go) => h.row({ icon, cat, title, sub: esc2(sub), onclick: go });
      const careRail = ['Newborn', '1–3 months', '4–6 months', '7–12 months'];
      const careNow = (() => { const o = hubStageOverride('Care'); if (o != null) return careRail[o]; const d = (NOW - parse(profile.dob)) / 864e5, mm = hubAgeFor('care', actualMonth()); return careRail[d < 21 ? 0 : mm < 4 ? 1 : mm < 7 ? 2 : 3]; })();
      const devOv = hubStageOverride('Development'), dref = DEV_STAGES[devOv] ? Number(devOv) : devRef(developmentMonth(actualMonth()));
      b += h.list('Where ' + nm + ' is now', [
        stageRow('bowl', 'Feeding', 'Feeding', chgStageLabel('Feeding'), "openPage('topic:Feeding')"),
        stageRow('moon', 'Sleep', 'Sleep', chgStageLabel('Sleep'), "openPage('topic:Sleep')"),
        stageRow('smile', 'Development', 'Development & play', DEV_STAGES[dref].title, "openPage('topic:Development')"),
        stageRow('shield', 'Safety', 'Safety', (SAFETY_MOVEMENT_STAGES.find(p => p.key === safetyStageNow()) || {}).rail || '', "openPage('topic:Safety')"),
        stageRow('bath', 'Daily rhythm', 'Everyday care', careNow, "openPage('topic:Daily rhythm')")
      ]) + h.note(`Not quite right? Open a guide, tap the stage that fits, then “This is where ${nm} is now”. Safety follows what ${nm} is doing, so update it under “Update what’s new”.`);
      b += h.list('More', [
        h.row({ icon: 'chat', cat: 'Development', title: 'Update what’s new', sub: 'Rolling, solids, naps and more', onclick: "openPage('personalize')" }),
        h.row({ icon: 'book', cat: 'Development', title: 'How we choose guidance', sub: 'Sources and what we leave out', onclick: "openPage('trust')" })
      ]);
      b += h.note(window.AHEAD_STORAGE_PERSISTS === false ? 'This viewer can’t keep your entries after you close it. Open Ahead in your phone’s browser to keep them.' : 'Your answers, notes, photos and saved moments stay in this browser on this device.');
      return `<div class="quiet-category hub-page hub-detail" style="${yearTheme('Development')}">${backButton()}${b}</div>`;
    };
  }


  /* The baby's name in place of "baby" wherever the sentence is about this baby.
     Sentences about babies in general ("Every baby moves at their own pace") stay as they are. */
  const GENERAL = /\b(every|each|any|most|many|some|all|young|newborn) bab(y|ies)\b|\bbabies\b|\bmy baby\b/i;
  const BEFORE_ADJ = /\b(a|the|brand-new|young|nursing|calm|content|sleepy|crying|swaddled|healthy|premature|newborn|fussy|hungry|new)\s+$/i;
  const NOUNS = /^\s*(mirror|book|books|block|blocks|spoon|ball|rattle|crinkle|fabric|flap|toy|toys|nail|clippers|picture|board|photo|gate|monitor|carrier|tub|wipes|food|foods|oatmeal|sunscreen|toothbrush|bath|bottle|lotion|oil|shampoo|gym|bouncer|walker|sling|wrap|seat|acne|powder|cereal|teeth|steps|talk|sign|signs|proofing|proof|care|led|shower)\b/i;
  function nameOnly(text, nm) {
    return text.split(/(?<=[.!?])\s+/).map(sentence => GENERAL.test(sentence) ? sentence : sentence.replace(/\b(your )?([Bb])aby(’s|'s)?\b(?![-‑])/g, (m, your, B, poss, off, str) => {
      if (!your && BEFORE_ADJ.test(str.slice(0, off))) return m;
      if (!poss && NOUNS.test(str.slice(off + m.length))) return m;
      return nm + (poss ? '’s' : '');
    })).join(' ');
  }
  window.hubNameEverywhere = function (root = document.getElementById('main')) {
    if (!root || typeof name !== 'function' || !live()) return;
    const nm = name(); if (!nm || /^baby$/i.test(nm)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest('textarea,input,script,style,.eyebrow-raw') ? NodeFilter.FILTER_REJECT : /\bbaby\b/i.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => { const v = nameOnly(n.nodeValue, nm); if (v !== n.nodeValue) n.nodeValue = v; });
  };


  /* ---------- Update what's new: one card per question, answers in the parent's words ---------- */
  window.hubMove = function (k) {
    if (k === 'none') { answers.roll = 'Not yet'; answers.rollDirection = 'Not yet'; delete answers.crawl; delete answers.pullUp; }
    if (k === 'trying') { answers.rollDirection = 'Trying to roll'; delete answers.roll; delete answers.crawl; delete answers.pullUp; }
    if (k === 'rolling') { answers.roll = 'Yes'; answers.rollDirection = 'Both ways'; delete answers.crawl; delete answers.pullUp; }
    if (k === 'crawling') { answers.roll = 'Yes'; answers.crawl = 'Yes'; delete answers.pullUp; }
    if (k === 'pulling') { answers.roll = 'Yes'; answers.crawl = 'Yes'; answers.pullUp = 'Yes'; }
    if (typeof markStage === 'function') markStage('movement');
    persist(); const y = scrollY; render(); scrollTo(0, y);
    hubToast('Updated', `Sleep, Safety and Home now match what ${name()} is doing.`);
  };
  window.hubAnswer = function (key, value, note) { answers[key] = value; persist(); const y = scrollY; render(); scrollTo(0, y); if (note) hubToast('Updated', note); };
  if (typeof personalizePage === 'function') {
    window.personalizePage = personalizePage = function () {
      const nm = esc2(name()), age = actualMonth();
      const move = answers.pullUp === 'Yes' ? 'pulling' : answers.crawl === 'Yes' ? 'crawling' : (answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection)) ? 'rolling' : answers.rollDirection === 'Trying to roll' ? 'trying' : answers.roll === 'Not yet' ? 'none' : null;
      const food = hasFoodAnswer() ? foodStage() : null;
      const chips = (opts, on, fn) => `<div class="hub-choice-chips">${opts.map(([v, l]) => `<button class="${on === v ? 'is-on' : ''}" aria-pressed="${on === v}" onclick="${fn(v)}">${on === v ? '✓ ' : ''}${l}</button>`).join('')}</div>`;
      const card = (q, sub, body) => `<section class="hub-card hub-q"><b>${q}</b>${sub ? `<small>${sub}</small>` : ''}${body}</section>`;
      let b = '';
      b += card(`How is ${nm} moving?`, 'This updates Sleep, Safety and Home.', chips([['none', 'Not rolling yet'], ['trying', 'Trying to roll'], ['rolling', 'Rolling'], ['crawling', 'Crawling'], ['pulling', 'Pulling up']], move, v => `hubMove('${v}')`));
      if (age >= 4) b += card(`Has ${nm} started solids?`, 'This moves the feeding guide along.', chips([['preparing', 'Not yet'], ['new', 'First foods'], ['textures', 'Lumps and finger foods'], ['established', 'Regular meals']], food, v => `setFeedingStage('${v}')`));
      if (age <= 6) b += card(`Is ${nm} still swaddled?`, '', chips([['No', 'Still swaddled'], ['Yes', 'In a sleep sack']], answers.swaddleStopped, v => `hubAnswer('swaddleStopped','${v}','Got it. Sleep will reflect this.')`));
      if (age >= 5) b += card(`How many naps most days?`, '', chips([['Stay', '3 naps'], ['Yes', '2 naps']], answers.twoNaps, v => `hubAnswer('twoNaps','${v}','The sleep guide now matches ${nm}’s naps.')`));
      if (age >= 4) b += card('Sleep training', 'Only if it’s something you’re thinking about.', chips([['not_planning', 'Not planning to'], ['not_started', 'Thinking about it'], ['in_progress', 'Working on it'], ['trained', 'Done']], answers.sleepTraining, v => `hubAnswer('sleepTraining','${v}','The settling guide now matches where you are.')`));
      return `<div class="quiet-category hub-page hub-detail" style="${yearTheme('Development')}">${backButton()}<div class="hub-detail-head"><span class="hub-big">${hubArt('chat', 'Development')}</span><p class="hub-context">Update what’s new</p><h1>What’s new with ${nm}?</h1><p class="hub-lead">Answer whatever has changed. Each answer updates the guides it affects.</p></div>${b}${H().note('You can change any answer later.')}</div>`;
    };
  }

  /* ---------- Timeline ---------- */
  const ageAt = date => {
    const days = (parse(date) - parse(profile.dob)) / 864e5;
    if (days < 28) return 'In the newborn weeks';
    const mo = Math.min(12, Math.floor(days / 30.44));
    return mo >= 12 ? 'At 1 year' : `At ${mo} month${mo === 1 ? '' : 's'}`;
  };
  const MILESTONE_ICON = r => {
    const k = String(r.skillKey || r.title || '').toLowerCase();
    return /smile|laugh|face|people/.test(k) ? 'smile' : /coo|babbl|sound|word|talk/.test(k) ? 'chat' : /roll/.test(k) ? 'roll' : /sit/.test(k) ? 'sit' : /crawl/.test(k) ? 'crawl' : /stand|pull|step|walk/.test(k) ? 'stand' : /wave|clap|point/.test(k) ? 'wave' : 'star';
  };
  function entryRow(r) {
    const h = H(), milestone = r.type === 'milestone';
    const sub = journeyDateLabel(r.date) + (r.provider ? ' · ' + r.provider : '') + (r.notes ? ' · ' + String(r.notes).slice(0, 60) + (r.notes.length > 60 ? '…' : '') : '');
    return h.row({ icon: milestone ? MILESTONE_ICON(r) : 'steth', cat: milestone ? 'Development' : 'Health', title: esc2(r.title), sub: esc2(sub), chipText: milestone ? 'Milestone' : r.status === 'planned' ? 'Planned' : 'Visit', onclick: `openPage('event-edit:${r.id}')` });
  }
  /* A real timeline: one stop per month, newest first. Each stop's circle is that month's photo;
     the visits and firsts from that month hang off it. "Next" sits at the top, "Born" at the bottom. */
  window.journeyTimeline = journeyTimeline = function () {
    const data = journeyData(), dob = parse(profile.dob), today = iso(NOW), all = photos(), nm = esc2(name());
    let now = 0; while (now < 12 && iso(addMonths(dob, now + 1)) <= today) now++;
    const saved = data.records.filter(r => r.status === 'attended'), planned = data.records.filter(r => r.status === 'planned').sort((a, b) => a.date.localeCompare(b.date));
    const item = (r, extra = '') => {
      const milestone = r.type === 'milestone', sub = journeyDateLabel(r.date) + (r.provider ? ' · ' + r.provider : '');
      return `<button class="hub-tl-item ${milestone ? '' : 'is-visit'} ${extra}" onclick="openPage('event-edit:${r.id}')"><span class="hub-tl-ic">${hubArt(milestone ? MILESTONE_ICON(r) : 'steth', milestone ? 'Development' : 'Health')}</span><span class="hub-row-copy"><b>${esc2(r.title)}</b><small>${esc2(sub)}</small></span></button>`;
    };
    let stops = '';
    // Next: the coming checkup, and anything already planned.
    const focus = healthJourneyFocus(), fr = healthRecord(focus);
    if (!fr || fr.status !== 'attended') {
      const when = fr && fr.status === 'planned' ? `Saved for ${journeyDateLabel(fr.date)}` : focus === 0 ? 'In the first week' : `Usually around ${journeyDateLabel(iso(addMonths(dob, focus)))}`;
      const extra = planned.filter(r => !(r.type === 'visit' && r.visitAge === focus)).map(r => item(r, 'is-planned')).join('');
      stops += `<div class="hub-tl-stop"><span class="hub-tl-node is-next">Next</span><span class="hub-tl-head"><b>${esc2(healthJourneyLabel(focus))}</b><small>${esc2(when)}</small></span></div><div class="hub-tl-items">${fr && fr.status === 'planned' ? '' : `<button class="hub-tl-item is-planned" onclick="openPage('visit-form:plan-${focus}')"><span class="hub-tl-ic">${hubArt('clock', 'Health')}</span><span class="hub-row-copy"><b>Save the date</b><small>So it shows up on Home as it gets close</small></span></button>`}${extra}</div>`;
    }
    for (let m = now; m >= 0; m--) {
      const start = iso(addMonths(dob, m)), end = iso(addMonths(dob, m + 1));
      const rows = saved.filter(r => r.date >= start && r.date < end).sort((a, b) => b.date.localeCompare(a.date));
      const ph = all[m], label = m === 0 ? 'Born' : m === 12 ? '1 year' : `${m} month${m === 1 ? '' : 's'}`;
      const node = `<button class="hub-tl-node ${ph ? 'has-photo' : 'is-add'}" onclick="hubPickPhoto(${m})" aria-label="${ph ? 'Change' : 'Add'} the ${m === 0 ? 'newborn' : label} photo">${ph ? `<img src="${ph}" alt="">` : '＋'}</button>`;
      const sub = journeyDateLabel(start) + (ph ? '' : ' · Add a photo');
      stops += `<div class="hub-tl-stop">${node}<span class="hub-tl-head"><b>${label}</b><small>${esc2(sub)}</small></span></div><div class="hub-tl-items">${rows.map(r => item(r)).join('')}</div>`;
    }
    let b = `<div class="eyebrow">${nm}’s first year</div><h1>Little moments,<br>your own story</h1>`;
    b += `<div class="hub-two-actions hub-tl-actions"><button class="hub-button" onclick="openPage('chg:Timeline:visit')">Record a visit</button><button class="hub-button is-secondary" onclick="openPage('chg:Timeline:milestone')">Save a milestone</button></div>`;
    b += `<div class="hub-tl-line">${stops}</div>`;
    b += H().note('Photos and entries are saved on this device for this baby.');
    return `<div class="quiet-category hub-page hub-timeline-page" style="${yearTheme('Development')}">${b}</div>`;
  };

  function recordVisitPage() {
    const h = H(), focus = healthJourneyFocus();
    const rows = WELL_VISITS.map(age => {
      const rec = healthRecord(age), done = rec && rec.status === 'attended';
      const sub = done ? `Saved · ${journeyDateLabel(rec.date)}` : rec && rec.status === 'planned' ? `Planned · ${journeyDateLabel(rec.date)}` : age === 0 ? 'Usually 3–5 days after birth' : `Usually around ${age} month${age === 1 ? '' : 's'}`;
      const badge = `<span class="hub-dot hub-dot-age"><b>${age === 0 ? '1' : age}</b><small>${age === 0 ? 'wk' : 'mo'}</small></span>`;
      return h.row({ icon: 'steth', cat: 'Health', title: healthJourneyLabel(age), sub, chipText: done ? 'Saved' : age === focus ? 'Next' : '', chipTone: done ? 'is-done' : '', onclick: done ? `openPage('event-edit:${rec.id}')` : `openPage('visit-form:${age}')` }).replace(/<span class="hub-dot">[\s\S]*?<\/svg><\/span>/, badge);
    });
    return detailPage('Health', 'Your timeline', 'Record a visit', 'Which visit was it? Pick one to add the date.',
      h.list('Routine checkups', rows) + h.list('Something else', [h.row({ icon: 'clock', cat: 'Health', title: 'Another appointment', sub: 'A sick visit, follow-up or specialist', onclick: "openPage('visit-form:extra')" })]), 'steth');
  }
  function recordMilestonePage() {
    const h = H(), ov = hubStageOverride('Development'), ref = DEV_STAGES[ov] ? Number(ov) : devRef(developmentMonth(actualMonth())), st = DEV_STAGES[ref], age = ref === 12 ? '1 year' : ref + ' months';
    const ICON = { Social: 'smile', Talking: 'chat', Thinking: 'idea', Movement: 'sit' }, TITLE = { Social: 'Social', Talking: 'Communication', Thinking: 'Thinking', Movement: 'Movement' };
    const tiles = Object.keys(DEV_DOMAINS).map(d => `<button class="hub-domain-tile" onclick="openPage('development-domain:${ref}:${d}')">${h.art(ICON[d], 'Development')}<b>${TITLE[d]}</b><small>${F(st.summaries[d] || '')}</small><span>${F('Pick a skill')} ›</span></button>`).join('');
    return detailPage('Development', 'Your timeline', 'Save a milestone', `Pick an area, then tap “Seen it” on anything Maya’s doing. Skills for ${age} are shown first.`,
      `<section class="hub-card hub-glance is-static"><div class="hub-domain-tiles">${tiles}</div></section>` + h.note('Looking for an earlier skill? Each area has the other ages in the pills at the top of Development.'), 'star');
  }
  function detailPage(cat, context, title, lead, inner, artName) { return H().detail(cat, context, title, lead, inner, artName); }

  /* ---------- the visit date form ---------- */
  if (typeof routineVisitDatePage === 'function') {
    window.routineVisitDatePage = routineVisitDatePage = function (age, planned = false) {
      const old = healthRecord(age), key = (planned ? 'plan-' : '') + age;
      const form = `<form class="hub-card hub-form" onsubmit="submitVisitForm(event,'${key}')"><label for="visitDate">${planned ? 'Appointment date' : 'Date of the visit'}</label><input id="visitDate" type="date" min="${profile.dob}" ${!planned ? `max="${iso(NOW)}"` : ''} value="${planned && old?.date ? old.date : iso(NOW)}" required>${journeyError ? `<p class="journey-error" role="alert">${esc2(journeyError)}</p>` : ''}<button class="hub-button">${planned ? 'Save the date' : 'Save to Maya’s timeline'}</button><button type="button" class="hub-link is-quiet hub-cancel" onclick="back()">Cancel</button></form>`;
      return detailPage('Health', healthJourneyLabel(age), planned ? 'When is the appointment?' : 'When was the visit?', planned ? 'We’ll remind you on Home as it gets close.' : 'It goes on Maya’s timeline, and you can add notes from the visit after.', form.replace(/Maya/g, esc2(name())), 'steth');
    };
  }

  /* ---------- "Coming up": everything that's next, in one place ---------- */
  if (typeof preparationHub === 'function') {
    window.preparationHub = preparationHub = function () {
      const h = H(), rows = [];
      ['Feeding', 'Sleep'].forEach(cat => {
        const cur = chgStageIndex(cat), N = C().DATA[cat].CH[cur + 1];
        if (N) rows.push(h.row({ icon: cat === 'Feeding' ? 'bowl' : 'moon', cat, title: N.rail, sub: `${cat} · ${N.when}`, onclick: `openPage('chg:${cat}:s:${cur + 1}')` }));
      });
      const keys = Object.keys(DEV_STAGES).map(Number), ref = devRef(developmentMonth(actualMonth())), nx = keys[keys.indexOf(ref) + 1];
      if (nx) rows.push(h.row({ icon: 'smile', cat: 'Development', title: DEV_STAGES[nx].title, sub: `Development & play · By ${nx === 12 ? '1 year' : nx + ' months'}`, onclick: `openPage('development-stage:${nx}')` }));
      const focus = healthJourneyFocus(), rec = healthRecord(focus);
      if (!rec || rec.status !== 'attended') rows.push(h.row({ icon: 'steth', cat: 'Health', title: healthJourneyLabel(focus), sub: rec && rec.status === 'planned' ? `Health · Saved for ${journeyDateLabel(rec.date)}` : `Health · ${focus === 0 ? 'In the first week' : 'Usually around ' + focus + ' month' + (focus === 1 ? '' : 's')}`, onclick: `openPage('health-visit:${focus}')` }));
      const sk = SAFETY_MOVEMENT_STAGES.map(p => p.key), sNow = safetyStageNow(), sNext = SAFETY_MOVEMENT_STAGES[sk.indexOf(sNow) + 1];
      if (sNext) rows.push(h.row({ icon: 'shield', cat: 'Safety', title: sNext.rail, sub: 'Safety · Get ahead of the next move', onclick: `openPage('safety-stage:${sNext.key}')` }));
      return detailPage('Development', 'Coming up', `What’s next for Maya`, 'The next change in each part of Maya’s first year, so nothing sneaks up on you. Ages are typical, and every baby moves at their own pace.', h.list('', rows), 'clock');
    };
  }

  /* ---------- routes ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen] = p.split(':');
    if (cat === 'Timeline' && screen === 'visit') return recordVisitPage();
    if (cat === 'Timeline' && screen === 'milestone') return recordMilestonePage();
    return baseRoute(p);
  };

  /* ---------- Resources, a resource, Saved and How we choose guidance ---------- */
  const CAT_ICON = { Development: 'smile', Feeding: 'bowl', Sleep: 'moon', Health: 'steth', Safety: 'shield', 'Daily rhythm': 'bath' };
  const hubShell = (cat, inner) => `<div class="quiet-category hub-page hub-detail" style="${yearTheme(cat)}">${inner}</div>`;
  const headBlock = (artName, cat, context, title, lead) => `<div class="hub-detail-head"><span class="hub-big">${hubArt(artName, cat)}</span><p class="hub-context">${esc2(context)}</p><h1>${esc2(title)}</h1>${lead ? `<p class="hub-lead">${esc2(lead)}</p>` : ''}</div>`;
  const plainRow = (iconName, cat, title, sub, onclick, chipText) => `<button class="hub-row" onclick="${onclick}"><span class="hub-dot">${hubArt(iconName, cat)}</span><span class="hub-row-copy"><b>${esc2(title)}</b>${sub ? `<small>${esc2(sub)}</small>` : ''}</span>${chipText ? `<span class="hub-chip">${esc2(chipText)}</span>` : ''}<span class="hub-chev" aria-hidden="true">›</span></button>`;

  if (typeof resourcesRework === 'function') {
    window.resourcesRework = resourcesRework = function () {
      const nm = name(), m = month, prep = m >= 4 && foodStage() === 'preparing';
      const items = [
        ['Development', 'What does this skill look like?', 'cdc'],
        ['Sleep', 'What can help with sleep?', 'aap'],
        ['Feeding', m >= 4 ? (prep ? 'How do I get ready for foods?' : 'How do I prepare this food?') : 'How do I understand feeds?', m >= 4 ? (prep ? 'readiness' : 'solids') : 'care'],
        ['Health', 'What should I know before a checkup?', 'visits'],
        ['Safety', 'What needs to change at home?', 'homeSafety'],
        ['Daily rhythm', `How do I bathe and care for ${nm}?`, 'care']
      ];
      let b = backButton() + headBlock('book', 'Development', 'Resources', 'Trusted places to turn', 'Pick a question to see the source we use for it, or search every guide.');
      b += `<div class="hub-search"><input class="search" placeholder="Try rolling, naps or first foods" aria-label="Search guidance" oninput="searchGuides(this.value)" value="${esc2(query || '')}"><div id="results" class="hub-list hub-results" hidden></div></div>`;
      b += `<h2 class="hub-h2">By topic</h2><div class="hub-list">` + items.map(([cat, q, k]) => plainRow(CAT_ICON[cat], cat, q, `${RESOURCE[k].title} · ${RESOURCE[k].cost}`, `openPage('resource:${k}')`)).join('') + '</div>';
      b += `<h2 class="hub-h2">If you want more</h2><div class="hub-list">` + plainRow('moon', 'Sleep', 'A structured sleep course', 'Taking Cara Babies · see the approach and cost first', "openPage('resource:cara')", 'Paid') + '</div>';
      b += `<div class="hub-list">` + plainRow('book', 'Development', 'How we choose guidance', 'No paid placements or affiliate links', "openPage('trust')") + '</div>';
      return hubShell('Development', b);
    };
    const baseSearch = searchGuides;
    window.searchGuides = searchGuides = function (q) {
      baseSearch(q);
      const box = document.querySelector('.hub-results');
      if (!box) return;
      const term = String(q || '').trim();
      box.hidden = !term;
      box.querySelectorAll('button.row').forEach(btn => {
        const t = btn.querySelector('h3'), sub = btn.querySelector('p');
        const go = btn.getAttribute('onclick') || '', cat = (go.match(/topic:([A-Za-z ]+)/) || [])[1];
        btn.outerHTML = plainRow(CAT_ICON[cat] || 'book', cat || 'Development', t ? t.textContent : '', sub ? sub.textContent : '', go);
      });
      const empty = box.querySelector('.hint');
      if (empty) empty.outerHTML = `<p class="hub-results-empty">${esc2(empty.textContent)}</p>`;
    };
  }

  if (typeof resourceRework === 'function') {
    window.resourceRework = resourceRework = function (id) {
      const r = RESOURCE[id];
      const cta = id === 'solids' ? 'Open the food database' : id === 'cdc' ? 'See milestone examples' : id === 'cara' ? 'Explore sleep classes' : 'Open the guidance';
      let b = backButton() + headBlock(r.commercial ? 'star' : 'book', 'Development', r.commercial ? 'Optional paid resource' : 'Where to turn', r.title, r.use);
      b += `<section class="hub-card"><p class="hub-card-label">When it helps</p><p class="hub-card-text">${esc2(r.when)}</p><span class="hub-chip">${esc2(r.cost)}</span><a class="hub-button" href="${r.url}" target="_blank" rel="noopener" style="text-decoration:none">${cta} ↗</a></section>`;
      b += `<h2 class="hub-h2">Why it’s here</h2><div class="hub-card hub-why">${[['Who’s behind it', r.who], ['Why we include it', r.evidence], ['Keep in mind', r.limits]].map(([t, d]) => `<div><p class="hub-card-label">${t}</p><p class="hub-card-text">${esc2(d)}</p></div>`).join('')}</div>`;
      b += `<h2 class="hub-h2">Sources we checked</h2><div>` + r.refs.map(([t, u]) => `<a class="hub-video" href="${u}" target="_blank" rel="noopener"><span class="hub-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 3h7l4 4v14H7Z"/><path d="M10 12h5M10 16h5"/></svg></span><span class="hub-row-copy"><b>${esc2(t)}</b><small>Opens the source</small></span><span class="hub-chev" aria-hidden="true">↗</span></a>`).join('') + '</div>';
      b += `<p class="hub-note">Checked October 2026. Costs and availability can change. ${r.commercial ? 'Listed so you can decide for yourself, not as an endorsement.' : 'No paid placement or affiliate links.'}</p>`;
      return hubShell('Development', b);
    };
  }

  window.hubSavedPage = function () {
    const rows = saved.map(k => {
      if (k.startsWith('topic:')) { const t = k.slice(6); return plainRow(CAT_ICON[t] || 'book', t, displayTopic(t), `Follows ${name()}’s current stage`, `openSavedTopic('${t}')`); }
      if (k.startsWith('view:')) { const d = savedViewData(k); if (!d) return ''; return plainRow(CAT_ICON[d.topic] || 'book', d.topic, savedViewTitle(d) || displayTopic(d.topic), `${displayTopic(d.topic)} · saved at ${monthLabel(d.month).toLowerCase()}`, `openSavedView('${k}')`); }
      const g = GUIDES[k]; if (!g) return '';
      return plainRow(CAT_ICON[g.topic] || 'book', g.topic, g.title, `${displayTopic(g.topic)} · 2 min read`, `openSavedGuide('${k}')`);
    }).filter(Boolean);
    let b = backButton() + headBlock('star', 'Development', 'Saved', 'For another quiet moment', rows.length ? `Guides you saved open at the stage you saved them. Whole topics follow ${name()}’s current stage.` : '');
    b += rows.length ? `<div class="hub-list">${rows.join('')}</div>` : `<section class="hub-card hub-empty"><p class="hub-card-label">Nothing saved yet</p><p class="hub-card-text">Tap the bookmark at the top of any guide to keep it here.</p><button class="hub-button" onclick="navigate('categories')">Browse guides</button></section>`;
    return hubShell('Development', b);
  };

  window.hubTrustPage = function () {
    let b = backButton() + headBlock('book', 'Development', 'How we choose guidance', 'Where the advice comes from', 'Every guide should tell you who’s behind it, why it belongs here and what’s still uncertain.');
    b += `<div class="hub-list">` + [['steth', 'Credentialed', 'Pediatric organizations and clinical experts, like the AAP and CDC'], ['book', 'Evidence-based', 'Checked against current evidence, with uncertainty made clear'], ['shield', 'Never sponsored', 'No paid placements, affiliate links or product deals']].map(([i, t, s]) => `<div class="hub-row is-static"><span class="hub-dot">${hubArt(i, 'Development')}</span><span class="hub-row-copy"><b>${t}</b><small>${s}</small></span></div>`).join('') + '</div>';
    b += `<div class="hub-tip"><b>When experts disagree</b>We lay out the options so you can decide with your pediatrician.</div>`;
    b += `<p class="hub-note">This is a prototype. Linked sources are the references we’re proposing, and Ahead doesn’t replace medical care.</p>`;
    return hubShell('Development', b);
  };

  if (typeof journeyCategories === 'function') {
    const baseCategories = journeyCategories;
    window.journeyCategories = journeyCategories = function () {
      return baseCategories().replace(/<div class="journey-utility-links">[\s\S]*<\/div>$/, `<div class="hub-list hub-utility">${plainRow('book', 'Development', 'Resources and search', 'Trusted sources for every topic', "openPage('explore')")}${plainRow('star', 'Development', 'Saved', saved.length ? saved.length + ' saved' : 'Guides you bookmark', "openPage('saved')")}</div>`);
    };
  }
})();
