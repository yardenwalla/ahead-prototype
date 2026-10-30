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
  const IRREG = { are: 'is', were: 'was', have: 'has', do: 'does', 'don’t': 'doesn’t', go: 'goes', 'aren’t': 'isn’t', 'weren’t': 'wasn’t', 'haven’t': 'hasn’t', "don't": 'doesn’t', "aren't": 'isn’t', "weren't": 'wasn’t', "haven't": 'hasn’t' };
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
  // A photo is chosen with a real file input inside a <label>: tapping the label opens the picker natively,
  // which works in Safari and in-app viewers where a script-triggered picker is blocked.
  window.hubPhotoInput = m => `<input type="file" accept="image/*" class="hub-photo-input" onchange="hubPhotoChosen(${m},this)" tabindex="-1" aria-hidden="true">`;
  window.hubPhotoChosen = function (m, input) {
    const file = input.files && input.files[0]; if (!file) return;
    const done = dataUrl => {
      const all = photos(); all[m] = dataUrl;
      const ok = savePhotos(all);
      const y = scrollY; render(); scrollTo(0, y);
      if (!ok) return hubToast('Couldn’t keep that photo', 'This viewer can’t store photos. Open Ahead in your phone’s browser to keep them.');
      hubToast('Photo saved', `${m === 0 ? 'Newborn' : m === 12 ? '1 year' : m + ' month' + (m === 1 ? '' : 's')} · in Memories`);
    };
    const shrink = img => {
      const size = 360, c = document.createElement('canvas'), w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, k = Math.max(size / w, size / h);
      c.width = c.height = size;
      c.getContext('2d').drawImage(img, (size - w * k) / 2, (size - h * k) / 2, w * k, h * k);
      return c.toDataURL('image/jpeg', 0.8);
    };
    const reader = new FileReader();
    reader.onerror = () => hubToast('Couldn’t open that photo', 'Try another photo, or a screenshot of it.');
    reader.onload = () => {
      const img = new Image();
      img.onload = () => { try { done(shrink(img)); } catch (e) { hubToast('Couldn’t open that photo', 'Try another photo, or a screenshot of it.'); } };
      img.onerror = () => hubToast('Couldn’t open that photo', 'This photo’s format isn’t supported here. Try a screenshot of it.');
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    input.value = '';
  };
  // Kept for older links: opens the same input.
  window.hubPickPhoto = function (m) {
    const holder = document.createElement('div'); holder.style.display = 'none'; holder.innerHTML = hubPhotoInput(m);
    document.body.appendChild(holder); const inp = holder.firstChild;
    inp.addEventListener('change', () => setTimeout(() => holder.remove(), 0));
    inp.click();
  };
  function photoStrip() {
    const now = Math.min(12, actualMonth()), all = photos();
    const label = m => m === 0 ? 'N' : m === 12 ? '1y' : String(m);
    const cells = Array.from({ length: 13 }, (_, m) => {
      const ph = all[m], open = m <= now;
      const cls = ['hub-ph', ph ? 'has-photo' : '', m === now ? 'is-now' : '', open ? '' : 'is-later'].join(' ');
      const inner = ph ? `<img src="${ph}" alt="">` : m === now ? '<span aria-hidden="true">＋</span>' : `<span>${label(m)}</span>`;
      const aria = `${m === 0 ? 'Newborn' : m === 12 ? '1 year' : m + ' months'} photo`;
      return open ? `<label class="${cls}" role="button" aria-label="${ph ? 'Change' : 'Add'} ${aria}">${inner}${hubPhotoInput(m)}</label>` : `<span class="${cls}" aria-label="${aria}, later">${inner}</span>`;
    }).join('');
    return `<h2 class="hub-h2">A photo a month</h2><div class="hub-photo-strip">${cells}</div>`;
  }

  // Pages outside the guides use the same centered header as everything else.
  window.hubPageTop = title => `<div class="monthly-page-header">${backButton().replace('class="back"', 'class="monthly-back"').replace(/(<\/svg>)[\s\S]*?<\/button>/, '$1</button>')}<div><h1>${title}</h1><p>${esc2(name())} · ${esc2(monthLabel(actualMonth()))}</p></div><span class="monthly-save" aria-hidden="true"></span></div>`;
  /* ---------- small confirmations ---------- */
  window.hubToast = function (title, body, action) {
    if (!document.createElement || !document.body) return;
    document.querySelectorAll('.hub-toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'hub-toast'; t.setAttribute('role', 'status');
    t.innerHTML = `<span class="hub-toast-spark" aria-hidden="true">✨</span><span style="flex:1"><b>${esc2(title)}</b><small>${esc2(body)}</small></span>${action ? `<button class="hub-toast-undo" onclick="${action[1]}">${esc2(action[0])}</button>` : ''}`;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-in'));
    setTimeout(() => { t.classList.remove('is-in'); setTimeout(() => t.remove(), 300); }, action ? 6000 : 3600);
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
      if (rec) hubToast('A first, saved', `“${rec.title}” is in Memories · ${journeyDateLabel(rec.date)}`, ['Change date', `document.querySelectorAll('.hub-toast').forEach(t=>t.remove());openPage('event-edit:${rec.id}')`]);
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
      let html = baseHome();
      // Born early: the adjusted age sits next to the age at the top, and opens About age.
      html = html.replace(/<p class="connected-age-note">[\s\S]*?<\/p>/, '');
      if (profile.early && profile.due && isCurrent()) html = html.replace(/(<span class="home-age">)([^<]*)(<\/span>)/, (m0, a1, age, a3) => `${a1}${age.trim()} <button class="hub-agechip" onclick="openPage('age-context')" aria-label="${esc2(monthLabel(adjustedMonth(actualMonth())))} adjusted. About age">· ${esc2(String(adjustedMonth(actualMonth())))} adjusted <span aria-hidden="true">ⓘ</span></button>${a3}`);
      // Born early: the month strip also marks the adjusted month, so both ages are visible at a glance.
      if (profile.early && profile.due && isCurrent()) { const adj = adjustedMonth(actualMonth()); if (adj !== actualMonth()) html = html.replace(new RegExp(`(<button class="month[^"]*)("[^>]*onclick="setMonth\\(${adj}\\)"[^>]*><b>[^<]*</b><span>)mo(</span>)`), '$1 is-adjusted$2adj$3'); }
      const b = monthBirthday();
      if (!b) return html;
      const nm = esc2(name()), label = b.m === 12 ? '1 year' : `${b.m} month${b.m === 1 ? '' : 's'}`, plabel = b.m === 12 ? 'first-birthday' : `${b.m}-month`, photo = window.hubPhotoFor(b.m);
      const title = b.since === 0 ? (b.m === 12 ? `${nm} is 1 year old today` : `${nm} is ${label} old today`) : (b.m === 12 ? `${nm} turned 1` : `${nm} turned ${label}`);
      const lead = photo ? (b.firsts.length ? `Here’s what you noticed this month. The photo is in Memories.` : `Another month of firsts. The photo is in Memories.`) : (b.firsts.length ? `Here’s what you noticed this month. Add a photo to keep it in Memories.` : `Another month of firsts. Add a photo to keep this one in Memories.`);
      const card = `<div class="home-summary connected-summary-intro hub-bday"><span class="hub-bday-num" aria-hidden="true">${b.m === 12 ? '1' : b.m}</span><span class="hub-bday-spark" aria-hidden="true">✦</span><p class="hub-bday-eyebrow">${b.m === 12 ? 'Happy first birthday' : 'Happy ' + label}${profile.early && profile.due && adjustedMonth(actualMonth()) !== actualMonth() ? ` <button class="hub-agechip" onclick="openPage('age-context')" aria-label="${esc2(monthLabel(adjustedMonth(actualMonth())))} adjusted. About age">· ${esc2(String(adjustedMonth(actualMonth())))} adjusted <span aria-hidden="true">ⓘ</span></button>` : ''}</p><h1>${title}</h1><p class="hub-bday-lead">${lead}</p>${b.firsts.length ? `<div class="hub-bday-chips">${b.firsts.map(r => `<span>✓ ${esc2(r.title)}</span>`).join('')}</div>` : ''}<label class="hub-bday-photo" role="button">${photo ? `<img src="${photo}" alt="">Change the ${plabel} photo` : `<i aria-hidden="true">＋</i>Add a ${plabel} photo`}${hubPhotoInput(b.m)}</label></div>`;
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
    hubToast('Updated', `${group === 'dev' ? 'Development, play and safety' : 'Feeding, sleep and care'} will follow ${value === 'birthday' ? 'birthday age' : 'adjusted age'}.`);
  };
  if (typeof topicAge === 'function') {
    window.topicAge = topicAge = t => {
      if (!profile.early || !profile.due) return monthLabel(month);
      const group = t === 'Development' || t === 'Safety' ? 'dev' : ['Feeding', 'Sleep', 'Daily rhythm'].includes(t) ? 'care' : null;
      return group && ageMode(group) === 'adjusted' ? monthLabel(adjustedMonth(month)) + ' adjusted' : monthLabel(month);
    };
  }

  /* ---------- Born early: the two ages, shown the same way on About age and in Baby's details ---------- */
  window.hubAgeBlock = function () {
    const nm = esc2(name()), H2 = H();
    const seg = group => `<div class="hub-seg" role="group" aria-label="Which age"><button class="${ageMode(group) === 'adjusted' ? 'is-on' : ''}" aria-pressed="${ageMode(group) === 'adjusted'}" onclick="hubSetAgeMode('${group}','adjusted')">Adjusted</button><button class="${ageMode(group) === 'birthday' ? 'is-on' : ''}" aria-pressed="${ageMode(group) === 'birthday'}" onclick="hubSetAgeMode('${group}','birthday')">Birthday</button></div>`;
    const tile = (k, v, s2) => `<div><small>${k}</small><b>${esc2(v)}</b><span>${s2}</span></div>`;
    return `<section class="hub-card hub-ages"><div class="hub-tiles">${tile('Birthday age', monthLabel(birthdayAge()), 'Checkups')}${tile('Adjusted age', monthLabel(adjustedMonth(actualMonth())), 'From the due date')}</div>`
      + `<div class="hub-agemode-row"><span><b>Development, play and safety</b><small>${esc2(monthLabel(developmentMonth(actualMonth())))}</small></span>${seg('dev')}</div>`
      + `<div class="hub-agemode-row"><span><b>Feeding, sleep, care</b><small>${esc2(monthLabel(hubAgeFor('care', actualMonth())))}</small></span>${seg('care')}</div></section>`;
  };
  window.hubAgePage = function () {
    const nm = esc2(name());
    if (!(profile.early && profile.due)) return `<div class="quiet-category hub-page hub-detail" style="${yearTheme('You')}">${hubPageTop(`${esc2(name())}’s age`)}<div class="hub-detail-head"><span class="hub-big">${hubArt('clock', 'You')}</span><p class="hub-context">${nm}’s age</p><h1>Every guide uses ${nm}’s age</h1><p class="hub-lead">If ${nm} was born early, add the due date in ${nm}’s details and guides can use adjusted age instead.</p></div></div>`;
    const head = `<div class="hub-detail-head"><span class="hub-big">${hubArt('clock', 'You')}</span><p class="hub-context">Born early</p><h1>Two ages, one ${nm}</h1><p class="hub-lead">Guides use adjusted age by default. Checkups always use the birthday.</p></div>`;
    return `<div class="quiet-category hub-page hub-detail" style="${yearTheme('You')}">${hubPageTop(`${esc2(name())}’s age`)}${head}${hubAgeBlock()}</div>`;
  };

  // Change a stage from Baby's details and stay there (Undo still works from the message).
  window.hubProfileStage = function (cat, i) { const y = scrollY; hubChangeStage(cat, i); page = 'profile'; render(); scrollTo(0, y); };
  /* ---------- Baby's details ---------- */
  if (typeof profileRework === 'function') {
    window.profileRework = profileRework = function () {
      const h = H(), nm = esc2(name());
      const born = journeyDateLabel(profile.dob);
      // A keepsake-style card: the baby's initial, name and age, with the details as tappable pills.
      const edit = step => `editingProfile=true;draft={...profile};setupStep=${step};openPage('setup')`;
      let b = `<section class="you-hero"><button class="you-edit" onclick="${edit(1)}" aria-label="Edit ${nm}’s details">Edit</button><div class="you-top"><span class="you-avatar" aria-hidden="true">${esc2((name() || 'B').charAt(0).toUpperCase())}</span><div><h1>${nm}</h1><p class="you-age">${esc2(birthdayAge() === 0 ? Math.max(1, Math.floor(Math.round((NOW - parse(profile.dob)) / 864e5) / 7)) + ' week' + (Math.floor(Math.round((NOW - parse(profile.dob)) / 864e5) / 7) > 1 ? 's' : '') : monthLabel(birthdayAge()))} old · born ${esc2(parse(profile.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}</p></div></div>`
        + `<div class="you-pills"><button onclick="${edit(2)}">${hubArt('bottle', 'You')}<span>${esc2(profile.feed || 'Feeding not set')}</span></button><button onclick="${edit(1)}">${hubArt('smile', 'You')}<span>${esc2(babyPronounLabel())}</span></button></div></section>`;
      if (profile.early && profile.due) b += `<h2 class="hub-h2">Ages</h2>` + hubAgeBlock();
      // Where the baby is now: set it right here. Sleep, Feeding and Safety can be changed; the rest follow age.
      const pick = (cat, title, nowI, labels) => `<div class="hub-where-row"><span class="hub-dot" style="${yearTheme(cat)}">${catIcon(cat)}</span><div class="hub-where-copy"><b>${title}</b><div class="hub-where-chips" role="group" aria-label="${title} stage">${labels.map((l, i) => { const on = i === nowI, ok = on || stageCanChange(cat, i, nowI); return `<button class="${on ? 'is-on' : ''}" ${on ? 'aria-pressed="true"' : ok ? `onclick="hubProfileStage('${cat}',${i})"` : 'disabled'}>${esc2(l)}</button>`; }).join('')}</div></div></div>`;
      const twoAges = profile.early && profile.due && adjustedMonth(actualMonth()) !== actualMonth();
      // Born early: say which age each one follows, since there are two.
      const fixed = (cat, title, label, basis) => `<div class="hub-where-row"><span class="hub-dot" style="${yearTheme(cat)}">${catIcon(cat)}</span><div class="hub-where-copy"><b>${title}</b><small>${esc2(label)} · ${twoAges ? (basis === 'birthday' ? `follows ${nm}’s birthday` : `follows ${basis === 'dev' ? (ageMode('dev') === 'birthday' ? 'birthday' : 'adjusted') : (ageMode('care') === 'birthday' ? 'birthday' : 'adjusted')} age`) : `follows ${nm}’s age`}</small></div></div>`;
      const careRail = ['Newborn', '1–3 months', '4–6 months', '7–12 months'];
      const careNow = (() => { const d = (NOW - parse(profile.dob)) / 864e5, mm = hubAgeFor('care', actualMonth()); return careRail[d < 21 ? 0 : mm < 4 ? 1 : mm < 7 ? 2 : 3]; })();
      const safeI = STAGE_TABLE.Safety.stages.findIndex(p => p.key === safetyGroup(safetyStageNow()));
      b += `<h2 class="hub-h2">Where ${nm} is now</h2><p class="hub-where-lead">This sets what each guide shows. Tap to change it if it’s not quite right.</p><section class="hub-card hub-where">`
        + pick('Feeding', 'Feeding', feedGroup(chgStageIndex('Feeding')), STAGE_TABLE.Feeding.stages.map(x => x.label))
        + pick('Sleep', 'Sleep', chgStageIndex('Sleep'), STAGE_TABLE.Sleep.stages.map(x => x.label))
        + pick('Safety', 'Safety', safeI, STAGE_TABLE.Safety.stages.map(x => x.label)).replace(/<\/div><\/div>$/, (developmentMonth(actualMonth()) >= 5 ? `<p class="hub-where-sub">How ${nm} moves</p>${hubMovingChips()}` : '') + '</div></div>')
        + fixed('Development', 'Development & play', 'By ' + devRef(developmentMonth(actualMonth())) + ' months', 'dev')
        + fixed('Daily rhythm', 'Everyday care', careNow, 'care')
        + fixed('Health', 'Health', 'Next: ' + healthJourneyLabel(healthJourneyFocus()), 'birthday')
        + `</section>`;
      b += `<button class="you-link" onclick="openPage('trust')">How we choose guidance ›</button>`;
      b += h.note(window.AHEAD_STORAGE_PERSISTS === false ? 'This viewer can’t keep your entries after you close it. Open Ahead in your phone’s browser to keep them.' : 'Your answers, notes and photos stay in this browser on this device.');
      return `<div class="quiet-category hub-page hub-detail" style="${yearTheme('You')}">${hubPageTop(`${esc2(name())}’s details`)}${b}</div>`;
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
    // Never during setup or welcome, and only with a name the parent actually gave (no sample name).
    if (['setup', 'welcome'].includes(page) || !(profile && String(profile.name || '').trim())) return;
    const nm = name(); if (!nm || /^baby$/i.test(nm)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest('textarea,input,script,style,.eyebrow-raw') ? NodeFilter.FILTER_REJECT : /\bbaby\b/i.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => { const v = nameOnly(n.nodeValue, nm); if (v !== n.nodeValue) n.nodeValue = v; });
  };


  /* ---------- Update what's new: one card per question, answers in the parent's words ---------- */
  window.hubMove = function (k) {
    const rolling = answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection);
    if (k === 'none') { answers.roll = 'Not yet'; answers.rollDirection = 'Not yet'; delete answers.crawl; delete answers.pullUp; }
    else {
      if (answers.roll === 'Not yet') delete answers.roll;
      if (answers.rollDirection === 'Not yet') delete answers.rollDirection;
      if (k === 'trying') { if (answers.rollDirection === 'Trying to roll') delete answers.rollDirection; else answers.rollDirection = 'Trying to roll'; }
      if (k === 'rolling') { if (rolling) { delete answers.roll; if (answers.rollDirection !== 'Trying to roll') delete answers.rollDirection; } else { answers.roll = 'Yes'; answers.rollDirection = 'Both ways'; } }
      if (k === 'crawling') { if (answers.crawl === 'Yes') delete answers.crawl; else { answers.crawl = 'Yes'; answers.roll = 'Yes'; } }
      if (k === 'pulling') { if (answers.pullUp === 'Yes') delete answers.pullUp; else answers.pullUp = 'Yes'; }
    }
    delete answers.safetyPick; answers.movementSetByParent = true;
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
      // Movement: pick everything that's true (rolling, crawling and pulling up can all be true at once).
      const mv = { none: answers.roll === 'Not yet' && answers.rollDirection === 'Not yet', trying: answers.rollDirection === 'Trying to roll', rolling: answers.roll === 'Yes' || ['Tummy to back', 'Back to tummy', 'Both ways'].includes(answers.rollDirection), crawling: answers.crawl === 'Yes', pulling: answers.pullUp === 'Yes' };
      const multi = (opts, fn) => `<div class="hub-choice-chips">${opts.map(([v, l]) => `<button class="${mv[v] ? 'is-on' : ''}" aria-pressed="${!!mv[v]}" onclick="${fn(v)}">${mv[v] ? '✓ ' : ''}${l}</button>`).join('')}</div>`;
      const dmv = developmentMonth(age);
      if (dmv >= 2) b += card(`How is ${nm} moving?`, 'Pick everything that’s true. This updates Sleep, Safety and Home.', multi([['none', 'Not rolling yet'], ['trying', 'Trying to roll'], ['rolling', 'Rolling'], ...(dmv >= 5 || mv.crawling ? [['crawling', 'Crawling']] : []), ...(dmv >= 6 || mv.pulling ? [['pulling', 'Pulling up']] : [])], v => `hubMove('${v}')`));
      if (age >= 4) b += card(`Has ${nm} started solids?`, 'This moves the feeding guide along.', chips([['starting', 'Just starting'], ['while', 'For a while'], ['preparing', 'Not yet']], food === 'preparing' ? 'preparing' : null, v => `setFeedingStage('${v}')`));
      if (age <= 6) b += card(`Is ${nm} still swaddled?`, '', chips([['No', 'Still swaddled'], ['Yes', 'In a sleep sack']], answers.swaddleStopped,  v => v === 'Never' ? "answers.neverSwaddled=true;hubAnswer('swaddleStopped','Yes','Got it. Sleep will reflect this.')" : `delete answers.neverSwaddled;hubAnswer('swaddleStopped','${v}','Got it. Sleep will reflect this.')`));
      if (age >= 5) b += card(`How many naps most days?`, '', chips([['Stay', '3 naps'], ['Yes', '2 naps']], answers.twoNaps, v => `hubAnswer('twoNaps','${v}','The sleep guide now matches ${nm}’s naps.')`));
      if (age >= 4) b += card('Sleep training', 'Only if it’s something you’re thinking about.', chips([['not_planning', 'Not planning to'], ['not_started', 'Thinking about it'], ['in_progress', 'Working on it'], ['trained', 'Done']], answers.sleepTraining, v => `hubAnswer('sleepTraining','${v}','The settling guide now matches where you are.')`));
      return `<div class="quiet-category hub-page hub-detail" style="${yearTheme('You')}">${hubPageTop('What’s new')}<div class="hub-detail-head"><span class="hub-big">${hubArt('chat', 'You')}</span><p class="hub-context">Update what’s new</p><h1>What’s new with ${nm}?</h1><p class="hub-lead">Answer whatever has changed. Each answer updates the guides it affects.</p></div>${b}${H().note('You can change any answer later.')}<button class="hub-button" onclick="back()">Done</button></div>`;
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
      const notes = r.notes || (r.type === 'visit' && journeyData().visitNotes ? journeyData().visitNotes[r.visitAge] : '') || '';
      const milestone = r.type === 'milestone', sub = journeyDateLabel(r.date) + (r.provider ? ' · ' + r.provider : '') + (notes ? ' · ' + String(notes).slice(0, 50) + (String(notes).length > 50 ? '…' : '') : '');
      return `<button class="hub-tl-item ${milestone ? '' : 'is-visit'} ${extra}" onclick="openPage('event-edit:${r.id}')"><span class="hub-tl-ic">${hubArt(milestone ? MILESTONE_ICON(r) : 'steth', milestone ? 'Development' : 'Health')}</span><span class="hub-row-copy"><b>${esc2(r.title)}</b><small>${esc2(sub)}</small></span></button>`;
    };
    let stops = '';
    // Next: the coming checkup, and anything already planned.
    const focus = healthJourneyFocus(), fr = healthRecord(focus);
    if (!fr || fr.status !== 'attended') {
      const dueIso = iso(focus === 0 ? new Date(dob.getTime() + 5 * 864e5) : addMonths(dob, focus));
      const when = fr && fr.status === 'planned' ? `Saved for ${journeyDateLabel(fr.date)}` : dueIso < today ? `Was due ${dueWhen(dueIso)}` : focus === 0 ? 'In the first week' : `Due ${dueWhen(dueIso)}`;
      const extra = planned.filter(r => !(r.type === 'visit' && r.visitAge === focus)).map(r => item(r, 'is-planned')).join('');
      stops += `<div class="hub-tl-stop"><span class="hub-tl-node is-next">Next</span><span class="hub-tl-head"><b>${esc2(healthJourneyLabel(focus))}</b><small>${esc2(when)}</small></span></div><div class="hub-tl-items">${fr && fr.status === 'planned' ? '' : dueIso < today ? `<button class="hub-tl-item is-planned" onclick="openPage('visit-form:${focus}')"><span class="hub-tl-ic">${hubArt('steth', 'Health')}</span><span class="hub-row-copy"><b>Been already? Add it</b><small>Or save the date if it’s booked</small></span></button>` : `<button class="hub-tl-item is-planned" onclick="openPage('visit-form:plan-${focus}')"><span class="hub-tl-ic">${hubArt('clock', 'Health')}</span><span class="hub-row-copy"><b>Save the date</b><small>We’ll remind you on Home as it gets close</small></span></button>`}${extra}</div>`;
    }
    for (let m = now; m >= 0; m--) {
      const start = iso(addMonths(dob, m)), end = iso(addMonths(dob, m + 1));
      // A checkup sits with its own month (the 4-month checkup under 4 months), even if it happened a few days early.
      const stopFor = r => r.type === 'visit' && WELL_VISITS.includes(r.visitAge) ? Math.min(r.visitAge, now) : null;
      const rows = saved.filter(r => stopFor(r) != null ? stopFor(r) === m : r.date >= start && r.date < end).sort((a, b) => b.date.localeCompare(a.date));
      const ph = all[m], label = m === 0 ? 'Born' : m === 12 ? '1 year' : `${m} month${m === 1 ? '' : 's'}`;
      const node = `<label class="hub-tl-node ${ph ? 'has-photo' : 'is-add'}" role="button" aria-label="${ph ? 'Change' : 'Add'} the ${m === 0 ? 'newborn' : label} photo">${ph ? `<img src="${ph}" alt="">` : '＋'}${hubPhotoInput(m)}</label>`;
      const sub = journeyDateLabel(start) + (ph ? '' : ' · Add a photo');
      stops += `<div class="hub-tl-stop">${node}<span class="hub-tl-head"><b>${label}</b><small>${esc2(sub)}</small></span></div><div class="hub-tl-items">${rows.map(r => item(r)).join('')}</div>`;
    }
    const empty = !journeyData().records.some(r => r.type === 'milestone' || r.status === 'attended');
    let b = `<div class="eyebrow">Memories</div><h1>${nm}’s first year</h1>` + (empty ? `<p class="hub-lead">${esc2(`Firsts and checkups you save will show up here, along with a photo for each month.`)}</p>` : '');
    b += `<div class="hub-two-actions hub-tl-actions"><button class="hub-button" onclick="openPage('chg:Timeline:visit')">Record a visit</button><button class="hub-button is-secondary" onclick="openPage('chg:Timeline:milestone')">Save a first</button></div>`;
    b += `<div class="hub-tl-line">${stops}</div>`;
    b += H().note('Photos and entries stay on this device.');
    return `<div class="quiet-category hub-page hub-timeline-page" style="${yearTheme('Development')}">${b}</div>`;
  };

  function recordVisitPage() {
    const h = H(), focus = healthJourneyFocus();
    const rows = WELL_VISITS.map(age => {
      const rec = healthRecord(age), done = rec && rec.status === 'attended';
      const sub = done ? `Saved · ${journeyDateLabel(rec.date)}` : rec && rec.status === 'planned' ? `Planned · ${journeyDateLabel(rec.date)}` : age === 0 ? '3–5 days after birth' : `Due ${dueWhen(iso(addMonths(parse(profile.dob), age)))}`;
      const badge = `<span class="hub-dot hub-dot-age"><b>${age === 0 ? '1' : age}</b><small>${age === 0 ? 'wk' : 'mo'}</small></span>`;
      return h.row({ icon: 'steth', cat: 'Health', title: healthJourneyLabel(age), sub, chipText: done ? 'Saved' : age === focus ? 'Next' : '', chipTone: done ? 'is-done' : '', onclick: done ? `openPage('event-edit:${rec.id}')` : `openPage('visit-form:${age}')` }).replace(/<span class="hub-dot">[\s\S]*?<\/svg><\/span>/, badge);
    });
    return detailPage('Health', 'Checkups', 'Record a visit', 'Which visit was it? Pick one to add the date.',
      h.list('Routine checkups', rows) + h.list('Something else', [h.row({ icon: 'clock', cat: 'Health', title: 'Another appointment', sub: 'A sick visit, follow-up or specialist', onclick: "openPage('visit-form:extra')" })]), 'steth');
  }
  function recordMilestonePage() {
    const h = H(), ov = hubStageOverride('Development'), ref = DEV_STAGES[ov] ? Number(ov) : devRef(developmentMonth(actualMonth())), st = DEV_STAGES[ref], age = ref === 12 ? '1 year' : ref + ' months';
    const ICON = { Social: 'smile', Talking: 'chat', Thinking: 'idea', Movement: 'sit' }, TITLE = { Social: 'Social', Talking: 'Communication', Thinking: 'Thinking', Movement: 'Movement' };
    const tiles = Object.keys(DEV_DOMAINS).map(d => `<button class="hub-domain-tile" onclick="openPage('development-domain:${ref}:${d}')">${h.art(ICON[d], 'Development')}<b>${TITLE[d]}</b><small>${F(st.summaries[d] || '')}</small><span>${F('Pick a skill')} ›</span></button>`).join('');
    return detailPage('Development', 'Memories', 'Save a milestone', `Pick an area, then tap “Seen it” on anything Maya’s doing. Skills for ${age} are shown first.`,
      `<section class="hub-card hub-glance is-static"><div class="hub-domain-tiles">${tiles}</div></section>`
      + h.list('', [h.row({ icon: 'tooth', cat: 'Development', title: 'Something that isn’t listed?', sub: 'First tooth, first word or any other first', onclick: "openPage('chg:Timeline:own')" })]), 'star');
  }
  // One place to save any first, whatever it's about. Ideas follow the baby's age and only fill in the field.
  function saveFirstPage() {
    const a = developmentMonth(actualMonth()), ideas = a < 2 ? ['First smile', 'First bath', 'First outing', 'Lifted head on tummy'] : a < 5 ? ['First laugh', 'Held head up', 'Rolled over', 'Grabbed a toy'] : a < 8 ? ['Sat up', 'First taste of food', 'First tooth', 'Rolled over'] : a < 11 ? ['Crawled', 'Pulled up', 'First tooth', 'Waved bye-bye'] : ['First word', 'First steps', 'Waved bye-bye', 'Clapped'];
    return detailPage('Development', 'Firsts', 'Save a first', 'What did Maya do? It goes in Memories with the date.',
      `<section class="hub-card hub-own-first"><label for="firstTitle">${F('What happened')}</label><input id="firstTitle" class="search" maxlength="80" placeholder="${F('For example, ' + ideas[0].charAt(0).toLowerCase() + ideas[0].slice(1))}"><p class="hub-own-ideas">${F('Ideas')}</p><div class="hub-choice-chips">${ideas.map(t => `<button onclick="hubFirstFill('${t}')">${t}</button>`).join('')}</div><label for="firstDate">${F('When')}</label><input id="firstDate" class="search" type="date" min="${profile.dob}" max="${iso(NOW)}" value="${iso(NOW)}"><button class="hub-button" onclick="hubSaveFirst()">${F('Save to Memories')}</button></section>`, 'star');
  }
  function detailPage(cat, context, title, lead, inner, artName) { return H().detail(cat, context, title, lead, inner, artName); }

  /* ---------- the visit date form ---------- */
  if (typeof routineVisitDatePage === 'function') {
    window.routineVisitDatePage = routineVisitDatePage = function (age, planned = false) {
      const old = healthRecord(age), key = (planned ? 'plan-' : '') + age;
      const form = `<form class="hub-card hub-form" onsubmit="submitVisitForm(event,'${key}')"><label for="visitDate">${planned ? 'Appointment date' : 'Date of the visit'}</label><input id="visitDate" type="date" min="${profile.dob}" ${!planned ? `max="${iso(NOW)}"` : ''} value="${planned && old?.date ? old.date : iso(NOW)}" required>${journeyError ? `<p class="journey-error" role="alert">${esc2(journeyError)}</p>` : ''}<button class="hub-button">${planned ? 'Save the date' : 'Save to Memories'}</button><button type="button" class="hub-link is-quiet hub-cancel" onclick="back()">Cancel</button></form>`;
      return detailPage('Health', healthJourneyLabel(age), planned ? 'When is the appointment?' : 'When was the visit?', planned ? 'We’ll remind you on Home as it gets close.' : 'It goes in Memories.', form.replace(/Maya/g, esc2(name())), 'steth');
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
      if (!rec || rec.status !== 'attended') rows.push(h.row({ icon: 'steth', cat: 'Health', title: healthJourneyLabel(focus), sub: rec && rec.status === 'planned' ? `Health · Saved for ${journeyDateLabel(rec.date)}` : `Health · ${focus === 0 ? 'In the first week' : 'Due ' + dueWhen(iso(addMonths(parse(profile.dob), focus)))}`, onclick: `openPage('health-visit:${focus}')` }));
      const sk = SAFETY_MOVEMENT_STAGES.map(p => p.key), sNow = safetyStageNow(), sNext = SAFETY_MOVEMENT_STAGES[sk.indexOf(sNow) + 1];
      if (sNext) rows.push(h.row({ icon: 'shield', cat: 'Safety', title: sNext.rail, sub: 'Safety · Get ahead of the next move', onclick: `openPage('safety-stage:${sNext.key}')` }));
      return detailPage('Development', 'Coming up', `What’s next for Maya`, 'The next change in each part of Maya’s first year, so nothing sneaks up on you. Ages are typical, and every baby moves at their own pace.', h.list('', rows), 'clock');
    };
  }

  /* ---------- routes ---------- */
  const baseRoute = window.changesRoute;
  window.changesRoute = function (p) {
    const [, cat, screen] = p.split(':');
    // Timeline pages belong to the timeline: its title in the header, its tab highlighted.
    const asTimeline = html => html.replace(/(<div class="monthly-page-header">[\s\S]*?<h1>)[^<]*(<\/h1><p>)[^<]*/, `$1Memories$2${esc2(name())}’s first year`);
    if (cat === 'Timeline' && screen === 'visit') return asTimeline(recordVisitPage());
    if (cat === 'Timeline' && (screen === 'milestone' || screen === 'own')) return asTimeline(saveFirstPage());
    return baseRoute(p);
  };

  /* ---------- Resources, a resource, Saved and How we choose guidance ---------- */
  const CAT_ICON = { Development: 'smile', Feeding: 'bowl', Sleep: 'moon', Health: 'steth', Safety: 'shield', 'Daily rhythm': 'bath', 'Out and about': 'stroller' };
  const hubShell = (cat, inner) => `<div class="quiet-category hub-page hub-detail" style="${yearTheme(cat)}">${inner}</div>`;
  const headBlock = (artName, cat, context, title, lead) => `<div class="hub-detail-head"><span class="hub-big">${hubArt(artName, cat)}</span><p class="hub-context">${esc2(context)}</p><h1>${esc2(title)}</h1>${lead ? `<p class="hub-lead">${esc2(lead)}</p>` : ''}</div>`;
  const plainRow = (iconName, cat, title, sub, onclick, chipText) => `<button class="hub-row" onclick="${onclick}"><span class="hub-dot">${hubArt(iconName, cat)}</span><span class="hub-row-copy"><b>${esc2(title)}</b>${sub ? `<small>${esc2(sub)}</small>` : ''}</span>${chipText ? `<span class="hub-chip">${esc2(chipText)}</span>` : ''}<span class="hub-chev" aria-hidden="true">›</span></button>`;

  if (typeof resourcesRework === 'function') {
    window.resourcesRework = resourcesRework = function () { return journeyCategories(); };
    window.oldResourcesRework = function () {
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
    /* Search: an index of the guides parents actually look for, matched word by word (any word counts,
       more matches rank higher). Health worries with no page of their own fall back to "when to call". */
    const IDX = [
      ['Sleep', 'moon', 'Set up a safe sleep space', 'chg:Sleep:safe', 'safe sleep crib bassinet bedding sids mattress room sharing'],
      ['Sleep', 'sack', 'Swaddling safely', 'chg:Sleep:d:swaddle', 'swaddle swaddling sleep sack wrap rolling'],
      ['Sleep', 'moon', 'When the crying won’t stop', 'chg:Sleep:d:crying', 'crying cry colic fussy fussiness soothe soothing purple inconsolable'],
      ['Sleep', 'clock', 'Sleepy cues', 'chg:Sleep:d:cues', 'sleepy tired overtired cues yawning'],
      ['Sleep', 'clock', 'Naps and the late catnap', 'chg:Sleep:d:catnap', 'nap naps catnap napping schedule wake window windows'],
      ['Sleep', 'moon', 'A simple bedtime routine', 'chg:Sleep:d:routine', 'bedtime routine night bath book'],
      ['Sleep', 'moon', 'Sleep training approaches', 'chg:Sleep:d:method', 'sleep training ferber cry it out chair settle settling self soothe'],
      ['Sleep', 'moon', 'Days and nights mixed up', 'chg:Sleep:d:daynight', 'day night confusion awake nights'],
      ['Sleep', 'moon', 'The 4-month sleep change', 'chg:Sleep:e:0', 'regression waking 4 four month sleep change'],
      ['Sleep', 'moon', 'Separation anxiety', 'chg:Sleep:e:1', 'separation anxiety clingy crying leave'],
      ['Feeding', 'bottle', 'How much milk or formula', 'chg:Feeding:d:milk', 'how much formula milk ounces oz amount amounts bottle bottles feeds feeding breast breastfeeding nursing'],
      ['Feeding', 'bottle', 'Storing and warming milk', 'chg:Feeding:d:storage', 'storage store storing pumped pump pumping expressed thaw freeze fridge warm warming'],
      ['Feeding', 'bottle', 'Getting a good latch', 'chg:Feeding:d:latch', 'latch latching nursing breastfeeding sore nipples'],
      ['Feeding', 'bottle', 'Is my baby getting enough?', 'chg:Feeding:d:enough', 'enough wet diapers weight gain hungry'],
      ['Feeding', 'bottle', 'Hunger and fullness cues', 'chg:Feeding:d:cues', 'hunger hungry full fullness cues'],
      ['Feeding', 'bottle', 'Vitamin D and iron', 'chg:Feeding:d:vitd', 'vitamin vitamins d iron drops supplement supplements anemia'],
      ['Feeding', 'bottle', 'Paced bottle feeding', 'chg:Feeding:d:pace', 'paced pacing bottle'],
      ['Feeding', 'bowl', 'Signs of readiness for solids', 'chg:Feeding:d:signs', 'ready readiness signs solids start starting'],
      ['Feeding', 'bowl', 'What to put on the tray', 'chg:Feeding:d:tray', 'first foods food solids puree purees start offer tray finger'],
      ['Feeding', 'bowl', 'Introducing allergens', 'chg:Feeding:d:allergens', 'allergen allergens allergy allergic peanut egg reaction'],
      ['Feeding', 'bowl', 'Gagging, choking and first aid', 'chg:Feeding:safe', 'choking choke gagging gag first aid'],
      ['Feeding', 'bowl', 'Finger foods', 'chg:Feeding:d:finger', 'finger foods blw baby led weaning lumps textures'],
      ['Feeding', 'bowl', 'Cups and drinks', 'chg:Feeding:d:cup', 'cup cups sippy straw water juice cow milk drinks'],
      ['Feeding', 'bottle', 'Spit-up: normal, or time to call?', 'topic:Feeding', 'spit spitting reflux burp burping'],
      ['Health', 'steth', 'Fever and sick days: when to call', 'chg:Health:d:sick', 'fever temperature sick ill cold cough vomit vomiting diarrhea breathing medicine tylenol acetaminophen ibuprofen emergency call doctor'],
      ['Health', 'heart', 'How are you doing?', 'chg:Health:d:you', 'postpartum depression anxiety baby blues overwhelmed mom dad parent me tired exhausted exhaustion sad lonely stressed help crying myself'],
      ['Health', 'steth', 'Checkups and vaccines', 'topic:Health', 'checkup checkups visit well child doctor appointment vaccine vaccines shots immunizations'],
      ['Safety', 'shield', 'Swings, bouncers and floor seats', 'chg:Safety:d:gear', 'swing bouncer bouncy seat rocker floor seat bumbo activity center jumper weight limit'],
      ['Childcare', 'home', 'Childcare: daycare, nannies, sitters and family', 'topic:Childcare', 'childcare child care daycare day care nanny nanny share babysitter sitter grandparents family caregiver back to work return to work'],
      ['Childcare', 'notepad', 'Care card for caregivers', 'chg:Childcare:d:card', 'care card caregiver babysitter instructions emergency contacts allergies routine handover'],
      ['Health', 'drop', 'Colds and stuffy noses', 'chg:Health:d:cold', 'cold colds stuffy nose congestion congested runny nose snot saline suction aspirator nosefrida humidifier cough sneeze winter'],
      ['Sleep', 'crib', 'Bassinet to crib, and moving rooms', 'chg:Sleep:d:where', 'bassinet crib switch move transition own room nursery room sharing room-sharing'],
      ['Development', 'signs', 'Baby signs: more, eat, milk, all done', 'chg:Development:d:signs', 'sign signs signing sign language baby signs asl more milk eat all done gestures'],
      ['Out and about', 'car', 'Car seats', 'chg:Out and about:d:car', 'car seat carseat rear facing forward facing harness chest clip coat pinch test straps uber taxi rideshare'],
      ['Out and about', 'car', 'A bigger car seat', 'chg:Out and about:d:bigger', 'convertible car seat outgrow infant seat forward facing weight limit'],
      ['Out and about', 'carrier', 'Wearing a carrier', 'chg:Out and about:d:carry', 'carrier carriers sling wrap babywearing backpack front pack'],
      ['Out and about', 'stroller', 'Stroller safety', 'chg:Out and about:d:stroller', 'stroller strollers pram buggy walk walks brakes'],
      ['Out and about', 'plane', 'Flying with a baby', 'chg:Out and about:d:fly', 'flying fly plane flight flights airport travel traveling trip vacation holiday ears passport abroad tsa security'],
      ['Out and about', 'road', 'Road trips', 'chg:Out and about:d:road', 'road trip drive driving long car ride travel vacation holiday'],
      ['Out and about', 'crib', 'Sleep away from home', 'chg:Out and about:d:away', 'hotel airbnb grandparents travel crib portable crib pack and play play yard vacation holiday'],
      ['Out and about', 'bag', 'What to pack', 'chg:Out and about:d:bag', 'diaper bag pack packing packing list outing out leave the house checklist'],
      ['Daily rhythm', 'tooth', 'Teething, drool and gums', 'chg:Daily rhythm:d:gums', 'teething teethe gums drool drooling sore chewing teeth tooth'],
      ['Daily rhythm', 'bath', 'Diaper rash and skin', 'chg:Daily rhythm:d:skin', 'diaper rash rashes skin cradle cap dry eczema'],
      ['Daily rhythm', 'bath', 'Giving a bath', 'chg:Daily rhythm:d:tub', 'bath tub bathing wash'],
      ['Daily rhythm', 'bath', 'Sponge baths', 'chg:Daily rhythm:d:sponge', 'sponge bath newborn wash'],
      ['Daily rhythm', 'bath', 'Cord stump care', 'chg:Daily rhythm:d:cord', 'cord stump belly button umbilical'],
      ['Daily rhythm', 'bath', 'Trimming nails', 'chg:Daily rhythm:d:nails', 'nails nail trim trimming clippers scratch'],
      ['Daily rhythm', 'bath', 'Sun and shade', 'chg:Daily rhythm:d:sun', 'sun sunscreen shade hat summer'],
      ['Daily rhythm', 'shirt', 'Dressing for the weather', 'chg:Daily rhythm:d:dress', 'dress dressing clothes layers outfit hot cold weather'],
      ['Daily rhythm', 'tooth', 'Brushing first teeth', 'chg:Daily rhythm:d:teeth', 'brush brushing toothbrush toothpaste fluoride dentist'],
      ['Safety', 'shield', 'Babyproofing checklist', 'topic:Safety', 'babyproof babyproofing childproof gates gate stairs outlets anchor furniture cords windows poison'],
      ['Safety', 'shield', 'Car seat and first setup', 'safety-stage:setup', 'car seat carseat smoke alarm water heater pool'],
      ['Development', 'smile', 'Milestones and what to expect', 'topic:Development', 'milestones milestone development rolling roll crawling crawl sitting sit walking walk talking babbling words standing'],
      ['Development', 'smile', 'Play ideas for this age', 'topic:Development', 'play games toys activities tummy time bored']
    ];
    const HEALTHY = /\b(fever|temp|sick|ill|cough|cold|vomit|diarrh|constipat|poop|stool|blood|rash|hives|breath|wheez|ear|eye|pain|hurt|fall|fell|bump|medicine|dose|swallow|jaundice|yellow|dehydrat|lethargic|sleepy all)/i;
    const stem = w => w.replace(/(ing|ed|es|s)$/, '');
    const STOP = new Set(['how', 'what', 'when', 'why', 'do', 'does', 'can', 'i', 'my', 'our', 'the', 'a', 'an', 'to', 'for', 'of', 'is', 'are', 'with', 'and', 'should', 'baby', 'babies', 'it', 'in', 'on', 'much', 'many', 'normal', 'ok', 'up', 'get', 'not', 'too', 'lot']);
    window.searchGuides = searchGuides = function (q) {
      query = q;
      const box = document.querySelector('.hub-results');
      if (!box) return;
      const term = String(q || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').trim();
      box.hidden = !term;
      if (!term) { box.innerHTML = ''; return; }
      const words = term.split(/\s+/).filter(w => w && !STOP.has(w)).map(stem).filter(w => w.length > 1);
      const scored = IDX.map(e => {
        const hay = (e[2] + ' ' + e[4]).toLowerCase().split(/[^a-z0-9]+/).map(stem);
        const score = words.reduce((n, w) => n + (hay.some(h => h === w || (w.length > 3 && h.startsWith(w))) ? 1 : 0), 0);
        return { e, score };
      }).filter(x => x.score > 0 && !(x.e[3] === 'chg:Sleep:d:method' && actualMonth() < 4)).sort((a, b) => b.score - a.score).slice(0, 6);
      let rows = scored.map(({ e }) => plainRow(e[1], e[0], e[2], displayTopic(e[0]), `openPage('${e[3]}')`));
      const health = HEALTHY.test(term);
      if (health && !scored.some(x => x.e[3] === 'chg:Health:d:sick')) rows.push(plainRow('steth', 'Health', 'When to call your pediatrician', 'Fever, breathing, feeding and other signs to act on', "openPage('chg:Health:d:sick')"));
      const asked = esc2(String(q).trim());
      const lead = !scored.length && health ? `<p class="hub-results-empty">We don’t have a guide for “${asked}” yet. If you’re worried, here’s when to call:</p>` : '';
      box.innerHTML = rows.length ? lead + rows.join('') : `<p class="hub-results-empty">No guide for “${asked}” yet. Try words like naps, formula, rash or fever. If you’re worried, call your pediatrician.</p>`;
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
    let b = hubPageTop('About Ahead') + headBlock('book', 'Development', 'How we choose guidance', 'Where the advice comes from', 'Every guide tells you who’s behind it, why it belongs here and what’s still uncertain.');
    b += `<div class="hub-list">` + [['steth', 'Expert sources', 'National pediatric and public health organizations, and clinical experts'], ['book', 'Evidence-based', 'Checked against current evidence, with uncertainty made clear'], ['shield', 'Never sponsored', 'No paid placements, affiliate links or product deals']].map(([i, t, s]) => `<div class="hub-row is-static"><span class="hub-dot">${hubArt(i, 'Development')}</span><span class="hub-row-copy"><b>${t}</b><small>${s}</small></span></div>`).join('') + '</div>';
    b += `<div class="hub-tip"><b>When experts disagree</b>We lay out the options so you can decide with your pediatrician.</div>`;
    b += `<p class="hub-note">Ahead is in early testing, and it doesn’t replace care from your pediatrician.</p>`;
    return hubShell('Development', b);
  };

  if (typeof journeyCategories === 'function') {
    const baseCategories = journeyCategories;
    window.journeyCategories = journeyCategories = function () {
      // Search sits at the top; there is no separate Resources section (outside links live inside each guide).
      const search = `<div class="hub-search hub-cat-search"><input class="search" type="search" placeholder="Search: naps, formula, rash, fever…" aria-label="Search guidance" oninput="searchGuides(this.value)" value="${esc2(query || '')}"><div id="results" class="hub-list hub-results" ${query ? '' : 'hidden'}></div></div>`;
      if (query) setTimeout(() => { if (document.querySelector('.hub-cat-search')) searchGuides(query); }, 0);
      return baseCategories().replace(/<div class="journey-utility-links">[\s\S]*<\/div>$/, '').replace(/(<h1>Categories<\/h1>)/, '$1' + search);
    };
  }

  /* ---------- One "next checkup" for every screen ----------
     The next checkup is the first one not yet marked done whose usual date is no more than 3 days past.
     A checkup whose date passed without being recorded (within the last 2 months) gets one question on Home. */
  const visitDue = a => { const d = parse(profile.dob); return a === 0 ? new Date(d.getTime() + 5 * 864e5) : addMonths(d, a); };
  const daysTo = a => Math.round((visitDue(a) - NOW) / 864e5);
  const SNOOZE = () => 'ahead-visit-ask:' + journeyKey();
  if (typeof healthJourneyFocus === 'function') {
    window.healthJourneyFocus = healthJourneyFocus = function () {
      if (!isCurrent()) return visitForMonth().age;
      const planned = journeyData().records.filter(r => r.type === 'visit' && r.status === 'planned').sort((a, b) => a.date.localeCompare(b.date));
      const next = WELL_VISITS.find(a => healthRecord(a)?.status !== 'attended' && (daysTo(a) >= (a === 0 ? -7 : -17) || healthRecord(a)?.status === 'planned')) ?? 12;
      return planned.length && planned[0].visitAge != null && planned[0].visitAge < next ? planned[0].visitAge : next;
    };
  }
  window.hubPastVisitToConfirm = function () {
    if (!isCurrent()) return null;
    let snooze = {}; try { snooze = JSON.parse(localStorage.getItem(SNOOZE())) || {}; } catch (e) {}
    // Only the latest past checkup, only if the parent was already using Ahead when it was due, until it's answered.
    const joined = profile.joined ? parse(profile.joined) : null;
    const past = WELL_VISITS.filter(a => daysTo(a) < -14 && !(joined && visitDue(a) < joined));
    if (past.length && daysTo(past[past.length - 1]) < -45) return null;   // after about 5 weeks it rests; Health still has "Already had this checkup?"
    const a = past.length ? past[past.length - 1] : null;
    if (a == null || healthRecord(a) || (snooze[a] && NOW - snooze[a] < 14 * 864e5)) return null;
    let skipped = {}; try { skipped = JSON.parse(localStorage.getItem('ahead-visit-skipped:' + journeyKey())) || {}; } catch (e) {}
    return skipped[a] ? null : a;
  };
  window.hubVisitNotYet = function (a) { if (typeof recordCheckin === 'function') recordCheckin('visit:' + a, 'Not yet'); let o = {}; try { o = JSON.parse(localStorage.getItem(SNOOZE())) || {}; } catch (e) {} o[a] = NOW.getTime(); try { localStorage.setItem(SNOOZE(), JSON.stringify(o)); } catch (e) {} render(); if (typeof hubToast === 'function') hubToast('Got it', `We’ll check back in a couple of weeks.`, ['See the checkup', `document.querySelectorAll('.hub-toast').forEach(t=>t.remove());openPage('health-visit:${a}')`]); };
  if (typeof stageSnapshot === 'function') {
    const baseSnap = stageSnapshot;
    window.stageSnapshot = stageSnapshot = function (t) { const r = baseSnap(t); if (t === 'Health' && isCurrent() && r) r.title = healthJourneyLabel(healthJourneyFocus()); if (t === 'Safety' && r && typeof safetyStageNow === 'function') { const st = STAGE_TABLE.Safety.stages.find(x => x.key === safetyGroup(safetyStageNow())); if (st) r.title = st.label; } return r; };
  }
  /* ---------- Questions: one design everywhere, and on Home they come first ----------
     Home order: 1 one question (if due) · 2 What matters now, with up to 2 cards, one per category ·
     3 Coming up, up to 2 · 4 "That's everything for now" · 5 Browse by category.
     Which question: a missed checkup, then a stage the baby may have outgrown, then solids, then naps. */
  const Q_CAT = k => k === 'visit' ? 'Health' : k === 'food' || k === 'food-progress' ? 'Feeding' : k === 'naps' ? 'Sleep' : k && k.startsWith('outgrown:') ? k.slice(9) : 'Safety';
  const Q_ICON = { Health: 'steth', Feeding: 'bowl', Sleep: 'moon', Safety: 'roll', Development: 'star', 'Daily rhythm': 'bath', 'Out and about': 'stroller' };
  window.hubQuestionCard = function (html, cat) {
    if (!html || html.includes(' hub-q"')) return html || '';
    const t = (html.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1] || '', why = (html.match(/<\/div><p>([\s\S]*?)<\/p>/) || [])[1] || '';
    const choices = (html.match(/<div class="connected-checkin-choices">([\s\S]*?)<\/div>/) || [])[1] || '';
    const skip = (html.match(/class="connected-skip" onclick="([^"]*)"/) || [])[1];
    const extra = (html.match(/class="connected-checkin([^"]*)"/) || [])[1] || '';
    const label = extra.includes('chg-checkin') ? '' : ({ 'Daily rhythm': 'Everyday care', Development: 'Development & play' }[cat] || cat);
    return `<section class="connected-checkin${extra} hub-q" style="${yearTheme(cat)}" aria-label="Quick question"><div class="hub-q-head"><span class="hub-dot">${catIcon(cat)}</span><div class="hub-q-copy"><small>${label ? esc2(label) + ' · ' : ''}Quick question</small><h2>${t}</h2>${why ? `<p>${why}</p>` : ''}</div></div><div class="connected-checkin-choices">${choices}${skip ? `<button class="hub-q-skip" onclick="${skip}" aria-label="Skip for now">Skip</button>` : ''}</div></section>`;
  };
  if (typeof window.feedingCheckinMarkup === 'function') {
    const baseFeedQ = window.feedingCheckinMarkup;
    window.feedingCheckinMarkup = function (surface) { return hubQuestionCard(baseFeedQ(surface), 'Feeding'); };
  }
  if (typeof window.adaptiveHome === 'function') {
    const homeBase = window.adaptiveHome;
    window.adaptiveHome = homeAtlas = function () {
      let html = homeBase();
      const found = html.match(/<section class="connected-checkin[\s\S]*?<\/section>/);
      let q = found ? found[0] : '';
      if (q) html = html.replace(q, '');
      const a = hubPastVisitToConfirm();
      if (a != null) { // a missed checkup comes first; one question per visit
        const nm = esc2(name()), label = healthJourneyLabel(a), lc = label.charAt(0).toLowerCase() + label.slice(1);
        q = hubQuestionCard(`<section class="connected-checkin"><div><h2>Did ${nm} have the ${esc2(lc)}?</h2></div><p>It was due ${esc2(dueWhen(iso(visitDue(a))))}.</p><div class="connected-checkin-choices"><button onclick="hubVisitYes(${a})">Yes, add it</button><button onclick="hubVisitNotYet(${a})">Not yet</button><button onclick="hubVisitSkipped(${a})">We skipped it</button></div></section>`, 'Health');
      } else if (q) {
        const key = typeof homeQuestion === 'function' ? homeQuestion() : null;
        q = hubQuestionCard(q, Q_CAT(key));
      }
      if (!q) return html;
      const at = ['<p class="brief-unchanged"', '<section class="connected-now"'].find(x => html.includes(x));
      return at ? html.replace(at, q + at) : html;
    };
  }

  /* ---------- A month picked on Home carries into the categories, as a labeled preview (the bottom tabs return to now) ---------- */

  /* ---------- After recording a visit, offer notes straight away ---------- */
  if (typeof completeHealthVisit === 'function') {
    const baseComplete = completeHealthVisit;
    window.completeHealthVisit = completeHealthVisit = function (age, date) {
      const r = baseComplete(age, date); if (!r) return r;
      hubAfterVisitSave(r);
      return r;
    };
  }

  /* ---------- Your own firsts, with a date ---------- */
  window.hubSaveFirst = function () {
    const t = (document.getElementById('firstTitle') || {}).value || '', d = (document.getElementById('firstDate') || {}).value || '';
    if (!t.trim() || !d) return hubToast('Add a name and a date', 'For example: Crawling, Oct 18.');
    if (d > iso(NOW) || d < profile.dob) return hubToast('Check the date', 'Pick a day between the birthday and today.');
    const data = journeyData();
    data.records.push({ id: 'milestone-own-' + Date.now(), type: 'milestone', title: t.trim().slice(0, 80), date: d, notes: '', status: 'attended', own: true });
    if (!saveJourneyData(data)) return hubToast('Couldn’t save that', 'This viewer can’t store entries.');
    navigate('timeline'); hubToast('A first, saved', `“${t.trim()}” is in Memories · ${journeyDateLabel(d)}`);
  };
  window.hubFirstFill = t => { const el = document.getElementById('firstTitle'); if (el) { el.value = t; el.focus(); } };

  /* ---------- Saves are plain taps: some in-app viewers block form submits ---------- */
  document.addEventListener('click', e => {
    const btn = e.target.closest && e.target.closest('form button');
    if (!btn || btn.type === 'button' || btn.type === 'reset') return;
    const form = btn.form; if (!form || !form.getAttribute('onsubmit')) return;
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    form.onsubmit.call(form, { preventDefault() {}, target: form, currentTarget: form, submitter: btn });
  }, true);
})();

/* Changing a saved date confirms like every other save. */
(function () {
  if (typeof submitJourneyEdit !== 'function') return;
  const base = submitJourneyEdit;
  window.submitJourneyEdit = submitJourneyEdit = function (e, id) {
    const r = base(e, id);
    if (typeof hubToast === 'function' && typeof page !== 'undefined' && !String(page).startsWith('event-edit')) setTimeout(() => hubToast('Date updated', 'Memories are up to date.'), 0);
    return r;
  };
})();

/* The stage timeline opens with the stage you're reading in the middle, so names aren't cut off at the edge. */
window.hubCenterStages = function () {
  document.querySelectorAll('#main .hub-stagebar').forEach(bar => {
    const on = bar.querySelector('.hub-stage.is-on') || bar.querySelector('.hub-stage.is-now');
    if (on && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = Math.max(0, on.offsetLeft - (bar.clientWidth - on.offsetWidth) / 2);
  });
};

/* Questions do one thing and get out of the way: no extra screens for dates or notes. */
(function () {
  const due = a => { const d = parse(profile.dob); return a === 0 ? new Date(d.getTime() + 5 * 864e5) : addMonths(d, a); };
  const label = a => { const l = healthJourneyLabel(a); return l.charAt(0).toLowerCase() + l.slice(1); };
  const changeDate = r => ['Change date', `document.querySelectorAll('.hub-toast').forEach(t=>t.remove());openPage('event-edit:${r.id}')`];
  window.hubVisitYes = function (a) {
    if (typeof recordCheckin === 'function') recordCheckin('visit:' + a, 'Yes');   // one question per visit: this was it
    const d = due(a), r = saveJourneyVisit(a, { date: iso(d < NOW ? d : NOW), status: 'attended' });
    render();
    if (r) hubToast('Saved', `The ${label(a)} is in Memories.`, changeDate(r));
  };
  window.hubVisitBooked = function (a) {
    let o = {}; try { o = JSON.parse(localStorage.getItem('ahead-visit-ask:' + journeyKey())) || {}; } catch (e) {}
    o[a] = NOW.getTime() + 7 * 864e5; // rests 3 weeks (the usual 2, plus 1)
    try { localStorage.setItem('ahead-visit-ask:' + journeyKey(), JSON.stringify(o)); } catch (e) {}
    render();
    hubToast('Got it', `You can add the date from Health whenever it’s handy.`, ['Add date', `document.querySelectorAll('.hub-toast').forEach(t=>t.remove());openPage('visit-form:plan-${a}')`]);
  };
  window.hubVisitBookSave = function (a) {
    const v = (document.getElementById('hubBookDate') || {}).value; if (!v) return;
    const r = saveJourneyVisit(a, { date: v, status: 'planned' });
    window.__hubBooking = null; render();
    if (r) hubToast('Saved', `We’ll remind you before the ${label(a)} on ${journeyDateLabel(v)}.`);
  };
  // After saving a visit from a form, go back to where the parent started (not to a notes page).
  window.hubAfterVisitSave = function (r) {
    try { journeyNotice = null; } catch (e) {}   // one confirmation, not two
    while (historyStack.length && /^(visit-form|chg:Timeline:visit)/.test(historyStack[historyStack.length - 1])) historyStack.pop();
    if (historyStack.length) back(); else navigate('home');
    hubToast('Saved', r.status === 'planned' ? `We’ll remind you on Home before ${journeyDateLabel(r.date)}.` : `It’s saved in Memories.`);
  };
})();

/* ---------- Moving: tell Ahead the baby crawls or pulls up, from Baby's details or Safety ----------
   Sets the same answers as the Home question, so Safety, Sleep and Home switch to "now that they're moving". */
(function () {
  const esc2 = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  window.hubMovingNow = () => answers.pullUp === 'Yes' ? 'pulling' : answers.crawl === 'Yes' ? 'crawling' : answers.crawl === 'Not yet' ? 'none' : null;
  window.hubSetMoving = function (v) {
    if (!['none', 'crawling', 'pulling'].includes(v) || !isCurrent()) return;
    if (v === 'none') { answers.crawl = 'Not yet'; delete answers.pullUp; }
    if (v === 'crawling') { answers.crawl = 'Yes'; delete answers.pullUp; }
    if (v === 'pulling') { answers.crawl = 'Yes'; answers.pullUp = 'Yes'; }
    answers.movementSetByParent = true; delete answers.safetyPick;
    if (typeof markStage === 'function') markStage('movement');
    if (typeof recordCheckin === 'function') recordCheckin('crawl', v === 'none' ? 'Not yet' : 'Yes');
    persist(); const y = scrollY; render(); scrollTo(0, y);
    const nm = name();
    hubToast('Got it', v === 'pulling' ? `Safety now leads with what ${nm} can reach standing.` : v === 'crawling' ? `Safety now covers a baby who crawls.` : `We’ll ask again in a few weeks.`, page === 'topic:Safety' ? null : ['See Safety', `document.querySelectorAll('.hub-toast').forEach(t=>t.remove());openPage('topic:Safety')`]);
  };
  // One row of chips, used in Baby's details and on Safety.
  window.hubMovingChips = function () {
    const cur = hubMovingNow();
    return `<div class="hub-where-chips" role="group" aria-label="How ${esc2(name())} is moving">${[['none', 'Not yet'], ['crawling', 'Crawling'], ['pulling', 'Pulling up']].map(([v, l]) => `<button class="${cur === v ? 'is-on' : ''}" aria-pressed="${cur === v}" onclick="hubSetMoving('${v}')">${l}</button>`).join('')}</div>`;
  };
})();

/* ---------- The first birthday: a big celebration, and where Ahead ends ----------
   From the first birthday on, Home is this screen: confetti (once, and calm with reduced motion),
   the year in numbers, a first-birthday photo, and Memories. The month strip and the guides stay
   available to look back. */
(function () {
  const esc2 = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const COLORS = ['#F0B3CB', '#B1ACF4', '#A3C2F2', '#98D7CC', '#F2D78A', '#F5BE9A'];
  window.hubFirstBirthday = () => typeof isCurrent === 'function' && isCurrent() && typeof birthdayAge === 'function' && birthdayAge() >= 12;
  function confetti() {
    let seen = false; try { const k = 'ahead-bday-confetti:' + journeyKey(), at = Number(localStorage.getItem(k) || 0); seen = at > 0 && Date.now() - at > 15000; if (!at) localStorage.setItem(k, String(Date.now())); } catch (e) {}   // falls once; after that, a still sprinkle
    const pieces = Array.from({ length: 46 }, (_, i) => {
      const left = (i * 37) % 100, delay = (i % 9) * 0.12, dur = 2.4 + (i % 5) * 0.35, rot = (i * 47) % 360, c = COLORS[i % COLORS.length], shape = i % 3 === 0 ? 'is-dot' : i % 3 === 1 ? 'is-strip' : '';
      const y = (i * 53) % 100 < 50 ? (i * 53) % 18 : 82 + (i * 53) % 16;
      return `<span class="bday-bit ${shape}" style="left:${left}%;background:${c};animation-delay:${delay}s;animation-duration:${dur}s;--r:${rot}deg;--y:${y}%"></span>`;
    }).join('');
    return `<div class="bday-confetti${seen ? ' is-settled' : ''}" aria-hidden="true">${pieces}</div>`;
  }
  function celebration() {
    const nm = esc2(name()), d = journeyData(), photo = window.hubPhotoFor && window.hubPhotoFor(12);
    const firsts = d.records.filter(r => r.type === 'milestone').length;
    const visits = d.records.filter(r => r.type !== 'milestone' && r.status === 'attended').length;
    const photos = Array.from({ length: 13 }, (_, m) => window.hubPhotoFor && window.hubPhotoFor(m)).filter(Boolean).length;
    const stat = (n, l) => `<div><b>${n}</b><span>${l}</span></div>`;
    return `<section class="bday-year" aria-label="Happy first birthday">${confetti()}
      <span class="bday-one" aria-hidden="true">1</span>
      <p class="bday-eyebrow">Happy first birthday</p>
      <h1>${nm} is one!</h1>
      <p class="bday-lead">You made it through the whole first year together. Look at everything you saw along the way.</p>
      ${(() => { const st = [[firsts, firsts === 1 ? 'first saved' : 'firsts saved'], [visits, visits === 1 ? 'checkup' : 'checkups'], [photos, photos === 1 ? 'monthly photo' : 'monthly photos']].filter(x => x[0] > 0); return st.length ? `<div class="bday-stats" style="grid-template-columns:repeat(${st.length},1fr)">${st.map(x => stat(x[0], x[1])).join('')}</div>` : ''; })()}
      ${photo ? `<div class="bday-photo"><img src="${photo}" alt="${nm}’s first-birthday photo"></div>` : `<label class="hub-button bday-add" role="button">Add a first-birthday photo${hubPhotoInput(12)}</label>`}
      ${typeof memPlay === 'function' && photos >= 2 ? `<button class="hub-button is-secondary bday-memories" onclick="memPlay()"><span aria-hidden="true">▶</span> ${esc2(`Play ${name()}’s year`)}</button>` : `<button class="hub-button is-secondary bday-memories" onclick="navigate('timeline')">See ${nm}’s first year</button>`}
    </section>
    <section class="bday-end"><p>${esc2('Ahead covers the first year, so this is where it ends. Your pediatrician takes it from here, starting with the 12-month checkup.')}</p><p class="bday-small">${esc2('You can still look back at any month, and every guide is in Categories.')}</p></section>`;
  }
  const base = window.adaptiveHome;
  if (typeof base === 'function') {
    window.adaptiveHome = homeAtlas = function () {
      const html = base();
      if (!hubFirstBirthday()) return html;
      // Keep the header and month strip (to look back); everything else gives way to the celebration.
      const end = html.indexOf('</nav>');
      const top = end > -1 ? html.slice(0, end + 6) : '';
      return top + celebration();
    };
  }
})();
