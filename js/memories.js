/* Ahead · Memories, led by the photos.
   A grid of the year (newborn to 1 year): photos big, this month's slot inviting, the months still to come
   faint, so the year fills in as it goes. "Play the year" flips through the photos with the firsts from each
   month. Firsts sit below as keepsake cards; checkups are a quiet record at the bottom.
   Planning (the next checkup) lives in Next and Health, not here. */
(function () {
  const esc2 = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ICON = r => {
    const k = String(r.skillKey || r.title || '').toLowerCase();
    return /smile|laugh|face|people/.test(k) ? 'smile' : /coo|babbl|sound|word|talk/.test(k) ? 'chat' : /roll/.test(k) ? 'roll' : /sit/.test(k) ? 'sit' : /crawl/.test(k) ? 'crawl' : /stand|pull|step|walk/.test(k) ? 'stand' : /wave|clap|point/.test(k) ? 'wave' : /tooth/.test(k) ? 'tooth' : 'star';
  };
  // The firsts parents remember. A first the parent typed in themselves always counts.
  const BIG = /smile|laugh|roll|sits? (up|without)|sitting|tooth|crawl|first word|mama|dada|name for a parent|says a word|pulls? (up|to stand)|stand|first steps|takes? (a few )?steps|walk|waves?/i;
  const isBig = r => r.own || !r.skillKey || BIG.test(String(r.title));
  const label = m => m === 0 ? 'Born' : m === 12 ? '1 year' : `${m} mo`;
  const longLabel = m => m === 0 ? 'Newborn' : m === 12 ? '1 year' : `${m} month${m === 1 ? '' : 's'}`;
  const monthOf = (dob, date) => { let m = 0; while (m < 12 && iso(addMonths(dob, m + 1)) <= date) m++; return m; };

  // One first: icon, what happened, when, and the note (or an invitation to add one).
  const firstRow = (r, withMonth = true) => {
    const dob = parse(profile.dob);
    return `<button class="mem-row" onclick="openPage('event-edit:${r.id}')"><span class="mem-row-ic">${hubArt(ICON(r), 'Development')}</span><span class="mem-row-copy"><b>${esc2(r.title)}</b><small>${esc2(journeyDateLabel(r.date))}${withMonth ? ` · ${esc2(longLabel(monthOf(dob, r.date)))}` : ''}</small>${r.notes ? `<q>${esc2(String(r.notes).slice(0, 90))}</q>` : ''}</span><span class="mem-row-go" aria-hidden="true">›</span></button>`;
  };
  // All firsts, by month, newest first. Its own page, so Memories itself never grows long.
  const allFirsts = () => {
    const dob = parse(profile.dob), firsts = journeyData().records.filter(r => r.type === 'milestone' && r.status === 'attended').sort((a, c) => c.date.localeCompare(a.date));
    const by = {}; firsts.forEach(r => { const m = monthOf(dob, r.date); (by[m] = by[m] || []).push(r); });
    const inner = Object.keys(by).map(Number).sort((x, y) => y - x).map(m => `<h2 class="hub-h2">${esc2(longLabel(m))}</h2><div class="mem-list">${by[m].map(r => firstRow(r, false)).join('')}</div>`).join('');
    return String(window.__hub.detail('Memories', 'Memories', `${name()}’s firsts`, `${firsts.length} saved so far.`, inner || `<p class="mem-empty">${esc2('Nothing saved yet.')}</p>`, 'star')).replace(/(<div class="monthly-page-header">[\s\S]*?<h1>)[^<]*(<\/h1><p>)[^<]*/, `$1Memories$2${esc2(name())}’s first year`);
  };
  if (typeof window.changesRoute === 'function') {
    const baseRoute = window.changesRoute;
    window.changesRoute = function (p) { return p === 'chg:Timeline:firsts' ? allFirsts() : baseRoute(p); };
  }

  window.journeyTimeline = journeyTimeline = function () {
    const data = journeyData(), dob = parse(profile.dob), today = iso(NOW), nm = esc2(name());
    const now = monthOf(dob, today);
    const photo = m => (typeof hubPhotoFor === 'function' ? hubPhotoFor(m) : null);
    const firsts = data.records.filter(r => r.type === 'milestone' && r.status === 'attended').sort((a, b) => a.date.localeCompare(b.date));
    const visits = data.records.filter(r => r.type === 'visit' && r.status === 'attended').sort((a, b) => b.date.localeCompare(a.date));

    // Photos: only the ones that exist, in a row you swipe. No empty boxes to scroll past.
    const have = Array.from({ length: now + 1 }, (_, m) => m).filter(m => photo(m));
    const missing = Array.from({ length: now }, (_, m) => m).filter(m => !photo(m));
    let b = `<div class="mem-page"><div class="eyebrow">Memories</div><h1>${nm}’s first year</h1>`;
    // Nothing saved yet: one welcoming card with the two ways in, instead of empty sections.
    if (!have.length && !firsts.length) {
      const P = typeof babyPronouns === 'function' ? babyPronouns() : { p: 'their' };
      b += `<section class="mem-welcome"><div class="mem-welcome-art" aria-hidden="true">${[['smile', 'Born', 'Out and about'], ['star', '6 months', 'Development'], ['heart', '1 year', 'Health']].map(([ic, t, c], k) => `<span class="mem-polaroid is-${k}"><i>${hubArt(ic, c)}</i><em>${t}</em></span>`).join('')}</div><h2>${esc2(`${name()}’s year starts here`)}</h2><p>${esc2(`Add a photo each month and save firsts as they happen. By ${P.p} first birthday, it all plays back like a flipbook.`)}</p><div class="mem-welcome-actions"><label class="primary mem-welcome-btn" role="button">${esc2(`Add ${now === 0 ? 'a newborn' : now === 12 ? 'a first-birthday' : `the ${now}-month`} photo`)}${hubPhotoInput(now)}</label><button class="mem-welcome-btn is-quiet" onclick="openPage('chg:Timeline:milestone')">Save a first</button></div></section>`;
      if (missing.length) b += `<details class="mem-missing is-welcome"><summary>${esc2(`Have older photos? Add earlier months (${missing.length})`)}</summary><div class="mem-missing-row">${missing.map(m => `<label class="mem-slot" role="button" aria-label="Add the ${longLabel(m).toLowerCase()} photo"><i aria-hidden="true">＋</i><span>${label(m)}</span>${hubPhotoInput(m)}</label>`).join('')}</div></details>`;
      b += `<p class="hub-foot">Photos and entries stay on this device.</p></div>`;
      return `<div class="quiet-category hub-page hub-timeline-page" style="${yearTheme('Memories')}">${b}</div>`;
    }
    // This month's photo: one gentle prompt, only while it's missing.
    if (!photo(now)) b += `<label class="mem-prompt" role="button"><span class="mem-prompt-plus" aria-hidden="true">＋</span><span><b>${esc2(`Add ${name()}’s ${now === 0 ? 'newborn' : now === 12 ? 'first-birthday' : now + '-month'} photo`)}</b><small>${esc2('One a month, and the year plays back like a flipbook.')}</small></span>${hubPhotoInput(now)}</label>`;
    if (have.length) {
      b += `<div class="mem-head"><h2>Month by month</h2>${have.length >= 2 ? `<button class="mem-play-link" onclick="memPlay()"><span aria-hidden="true">▶</span> Play the year</button>` : ''}</div>`;
      b += `<div class="mem-strip">${[...have].reverse().map(m => `<label class="mem-shot" role="button" aria-label="Change the ${longLabel(m).toLowerCase()} photo"><img src="${photo(m)}" alt=""><span>${label(m)}</span>${hubPhotoInput(m)}</label>`).join('')}</div>`;
    }
    if (missing.length) b += `<details class="mem-missing"><summary>${esc2(`Add photos for earlier months (${missing.length})`)}</summary><div class="mem-missing-row">${missing.map(m => `<label class="mem-slot" role="button" aria-label="Add the ${longLabel(m).toLowerCase()} photo"><i aria-hidden="true">＋</i><span>${label(m)}</span>${hubPhotoInput(m)}</label>`).join('')}</div></details>`;

    // Firsts: the three most recent, then "See all" for the rest, so the page stays the same length however many you save.
    b += `<div class="mem-head"><h2>Firsts</h2><button class="textlink" onclick="openPage('chg:Timeline:milestone')">＋ Save a first</button></div>`;
    b += firsts.length
      ? `<div class="mem-list">${[...firsts].reverse().slice(0, 3).map(r => firstRow(r)).join('')}${firsts.length > 3 ? `<button class="mem-all" onclick="openPage('chg:Timeline:firsts')">${esc2(`See all ${firsts.length} firsts`)} ›</button>` : ''}</div>`
      : `<p class="mem-empty">${esc2(`First smile, first laugh, first roll. Save them as they happen and they’ll collect here.`)}</p>`;

    // Checkups: a quiet record.
    b += `<details class="mem-visits"><summary><span>${esc2('Checkups')}</span><small>${visits.length ? `${visits.length} saved` : 'None saved yet'}</small></summary>${visits.map(r => `<button class="mem-visit" onclick="openPage('event-edit:${r.id}')"><b>${esc2(r.title)}</b><small>${esc2(journeyDateLabel(r.date))}</small></button>`).join('')}<button class="textlink" onclick="openPage('chg:Timeline:visit')">＋ Record a visit</button></details>`;
    b += `<p class="hub-foot">Photos and entries stay on this device.</p></div>`;
    return `<div class="quiet-category hub-page hub-timeline-page" style="${yearTheme('Memories')}">${b}</div>`;
  };

  /* ---------- A note on a first: what happened, who was there ---------- */
  if (typeof journeyVisitDateEdit === 'function') {
    const baseEdit = journeyVisitDateEdit;
    window.journeyVisitDateEdit = journeyVisitDateEdit = function (record) {
      let html = baseEdit(record);
      if (record.type !== 'milestone') return html;
      html = html.replace(/<details class="guide-detail"><summary>Your saved note[\s\S]*?<\/details>/, '');
      return html.replace('<button class="primary">', `<label for="editNote">A note (optional)</label><textarea id="editNote" maxlength="200" rows="3" placeholder="${esc2('What happened, who was there…')}">${esc2(record.notes || '')}</textarea><button class="primary">`);
    };
  }
  if (typeof submitJourneyEdit === 'function') {
    const baseSubmit = submitJourneyEdit;
    window.submitJourneyEdit = submitJourneyEdit = function (e, id) {
      const el = document.getElementById('editNote');
      if (el) { const d = journeyData(), r = d.records.find(x => x.id === id); if (r) { r.notes = el.value.trim(); saveJourneyData(d); } }
      return baseSubmit(e, id);
    };
  }

  /* ---------- Play the year: a flipbook of the monthly photos ---------- */
  let timer = null;
  window.memPlay = function () {
    const dob = parse(profile.dob), data = journeyData();
    const frames = Array.from({ length: 13 }, (_, m) => m).filter(m => hubPhotoFor(m)).map(m => {
      const start = iso(addMonths(dob, m)), end = iso(addMonths(dob, m + 1));
      const f = data.records.filter(r => r.type === 'milestone' && r.status === 'attended' && r.date >= start && r.date < end && isBig(r)).map(r => r.title);
      return { m, src: hubPhotoFor(m), firsts: f };
    });
    if (!frames.length) return;
    const el = document.createElement('div');
    el.className = 'mem-flip'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'The year in photos');
    el.innerHTML = `<button class="mem-flip-close" aria-label="Close">×</button><div class="mem-flip-stage"><img alt=""><div class="mem-flip-cap"><b></b><span></span></div></div><div class="mem-flip-dots">${frames.map(() => '<i></i>').join('')}</div>`;
    document.body.appendChild(el);
    let i = 0;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show = () => {
      const f = frames[i], img = el.querySelector('img');
      img.classList.remove('is-in'); void img.offsetWidth; img.src = f.src; img.classList.add('is-in');
      el.querySelector('.mem-flip-cap b').textContent = longLabel(f.m);
      el.querySelector('.mem-flip-cap span').textContent = f.firsts.join(' · ');
      el.querySelectorAll('.mem-flip-dots i').forEach((d, k) => d.classList.toggle('is-on', k === i));
    };
    const close = () => { clearInterval(timer); timer = null; el.remove(); };
    const step = () => { i = (i + 1) % frames.length; show(); };
    el.querySelector('.mem-flip-close').onclick = close;
    el.querySelector('.mem-flip-stage').onclick = () => { if (timer) { clearInterval(timer); timer = null; } else step(); };
    show();
    if (!reduce) timer = setInterval(() => { if (i === frames.length - 1) { clearInterval(timer); timer = null; return; } step(); }, 1400);
  };
})();
