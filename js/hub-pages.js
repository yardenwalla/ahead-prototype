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
  window.journeyTimeline = journeyTimeline = function () {
    const h = H(), data = journeyData(), records = [...data.records].sort((a, b) => b.date.localeCompare(a.date));
    const saved = records.filter(r => r.status === 'attended'), planned = records.filter(r => r.status === 'planned').reverse();
    let b = `<div class="eyebrow">${esc2(name())}’s first year</div><h1>Little moments,<br>your own story</h1><p class="journey-lede hub-tl-lede">${F('The checkups and firsts you choose to save. Nothing fills in on its own.')}</p>`;
    b += `<div class="hub-two-actions"><button class="hub-button" onclick="openPage('chg:Timeline:visit')">Record a visit</button><button class="hub-button is-secondary" onclick="openPage('chg:Timeline:milestone')">Save a milestone</button></div>`;
    b += photoStrip();
    if (!saved.length) b += `<section class="hub-card hub-empty"><span class="hub-empty-art" aria-hidden="true">${yearIllustration('Development', 1)}</span><b>${F('Your first entry starts here')}</b><p>${F('Save a checkup once you’ve been, or a first you don’t want to forget, like Maya’s first smile.')}</p></section>`;
    else {
      const groups = [];
      saved.forEach(r => { const g = ageAt(r.date), last = groups[groups.length - 1]; if (last && last.g === g) last.rows.push(r); else groups.push({ g, rows: [r] }); });
      b += `<div class="hub-tl">${groups.map(g => h.list(g.g, g.rows.map(entryRow))).join('')}</div>`;
    }
    if (planned.length) b += h.list('Planned with your care team', planned.map(entryRow));
    const focus = healthJourneyFocus();
    if (!healthRecord(focus) || healthRecord(focus).status !== 'attended') b += h.next('Next checkup', healthJourneyLabel(focus), `openPage('health-visit:${focus}')`);
    b += h.note('Saved on this device for this baby.');
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
    const h = H(), ref = devRef(developmentMonth(actualMonth())), st = DEV_STAGES[ref], age = ref === 12 ? '1 year' : ref + ' months';
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
})();
