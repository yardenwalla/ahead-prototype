/* Ahead · Memories, led by the photos.
   A grid of the year (newborn to 1 year): photos big, this month's slot inviting, the months still to come
   faint, so the year fills in as it goes. "Play the year" flips through the photos with the firsts from each
   month. Firsts sit below as keepsake cards; checkups are a quiet record at the bottom.
   Planning (the next checkup) lives in Next and Health, not here. */
(function () {
  const esc2 = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ICON = r => {
    const k = String(r.skillKey || r.title || '').toLowerCase();
    return /smile|laugh|face|people/.test(k) ? 'smile' : /coo|babbl|sound|word|talk|mama|dada|parent/.test(k) ? 'chat' : /roll/.test(k) ? 'roll' : /sit/.test(k) ? 'sit' : /crawl/.test(k) ? 'crawl' : /stand|pull|step|walk/.test(k) ? 'stand' : /wave|clap|point/.test(k) ? 'wave' : /tooth/.test(k) ? 'tooth' : 'star';
  };
  // Each first takes the soft color of its area, the same colors as Development's tiles:
  // people and waving pink, talking yellow, moving blue, the rest (thinking, own firsts) green, a tooth peach.
  const TONE = r => { const i = ICON(r), d = /smile|wave/.test(i) ? 'Social' : i === 'chat' ? 'Talking' : /roll|sit|crawl|stand/.test(i) ? 'Movement' : i === 'tooth' ? null : 'Thinking';
    const c = d && window.devTileColors ? devTileColors(d) : ['#fdeee6', '#9a5a3c']; return `--mem-bg:${c[0]};--mem-ink:${c[1]}`; };
  // The firsts parents remember. A first the parent typed in themselves always counts.
  const BIG = /smile|laugh|roll|sits? (up|without)|sitting|tooth|crawl|first word|mama|dada|name for a parent|says a word|pulls? (up|to stand)|stand|first steps|takes? (a few )?steps|walk|waves?/i;
  const isBig = r => r.own || !r.skillKey || BIG.test(String(r.title));
  const label = m => m === 0 ? 'Born' : m === 12 ? '1 year' : `${m} mo`;
  const longLabel = m => m === 0 ? 'Newborn' : m === 12 ? '1 year' : `${m} month${m === 1 ? '' : 's'}`;
  const monthOf = (dob, date) => { let m = 0; while (m < 12 && iso(addMonths(dob, m + 1)) <= date) m++; return m; };

  // One first: icon, what happened, when, and the note (or an invitation to add one).
  const firstRow = (r, withMonth = true) => {
    const dob = parse(profile.dob);
    return `<button class="mem-row" onclick="openPage('event-edit:${r.id}')"><span class="mem-row-ic is-toned" style="${TONE(r)}">${hubArt(ICON(r), 'Development')}</span><span class="mem-row-copy"><b>${esc2(r.title)}</b><small>${esc2(journeyDateLabel(r.date))}${withMonth ? ` · ${esc2(longLabel(monthOf(dob, r.date)))}` : ''}</small>${r.notes ? `<q>${esc2(String(r.notes).slice(0, 90))}</q>` : ''}</span><span class="mem-row-go" aria-hidden="true">›</span></button>`;
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

    // Month by month: each month as its finished Story (the balloon design with the photo in the polaroid).
    // Months without a photo show the same design with an empty polaroid, so parents can see what it becomes.
    const have = Array.from({ length: now + 1 }, (_, m) => m).filter(m => photo(m));
    const designs = typeof storyShare === 'function';
    const L = m => longLabel(m).toLowerCase();
    const remove = m => `<button class="mem-shot-remove" onclick="hubPhotoRemove(${m})" aria-label="Remove the ${L(m)} photo"><span aria-hidden="true">×</span></button>`;
    const card = (m, quiet) => {
      if (m === 0 && !designs) return photo(0)
        ? `<div class="mem-story-wrap"><label class="mem-story is-plain" role="button" aria-label="Change the newborn photo"><img src="${photo(0)}" alt=""><em>Newborn</em>${hubPhotoInput(0)}</label>${remove(0)}</div>`
        : `<label class="mem-story is-plain is-empty" role="button" aria-label="Add the newborn photo"><em>Newborn</em><span class="mem-story-add">＋ Add photo</span>${hubPhotoInput(0)}</label>`;
      if (!designs) return photo(m) ? `<div class="mem-story-wrap"><label class="mem-story is-plain" role="button"><img src="${photo(m)}" alt=""><em>${label(m)}</em>${hubPhotoInput(m)}</label>${remove(m)}</div>` : '';
      if (photo(m)) return `<div class="mem-story-wrap"><button class="mem-story" onclick="storyShare(${m})" aria-label="Open the ${L(m)} Story"><img data-story-thumb="${m}" alt=""></button>${remove(m)}</div>`;
      return `<label class="mem-story is-empty" role="button" aria-label="Add the ${L(m)} photo"><img data-story-thumb="${m}" alt="">${quiet ? '' : '<span class="mem-story-add">＋ Add photo</span>'}${hubPhotoInput(m)}</label>`;
    };
    // Newest first, only the months the baby has reached.
    const months = Array.from({ length: now + 1 }, (_, i) => now - i);
    const strip = `<div class="mem-stories">${months.map(card).join('')}</div>`;
    // At the first birthday, the whole year on one page sits above the row, as its own thing.
    const year = designs && now === 12 && Array.from({ length: 12 }, (_, i) => photo(i + 1)).some(Boolean)
      ? `<button class="mem-yearcard" onclick="storyShare('year')"><span class="mem-yearcard-pic"><img data-story-thumb="year" alt=""></span><span><b>${esc2(`${name()}’s first year`)}</b><small>All twelve months on one page, as a photo or a video.</small></span><span class="mem-row-go" aria-hidden="true">›</span></button>` : '';
    if (designs) setTimeout(() => window.storyHydrate && storyHydrate(), 0);
    let b = `<div class="mem-page"><div class="eyebrow">Memories</div><h1>${nm}’s first year</h1>`;
    // Nothing saved yet: a welcoming card, with the year's designs waiting underneath.
    if (!have.length && !firsts.length) {
      const P = typeof babyPronouns === 'function' ? babyPronouns() : { p: 'their' };
      b += `<section class="mem-welcome"><h2>${esc2(now === 0 ? `${name()}’s year starts here` : `${name()}’s year, one photo a month`)}</h2><p>${esc2(`Add a photo each month and it becomes a little Story to keep and share. By ${P.p} first birthday, all twelve hang together on one page.`)}</p><div class="mem-welcome-actions"><label class="primary mem-welcome-btn" role="button">${esc2(`Add ${now === 0 ? 'a newborn' : now === 12 ? 'a first-birthday' : `the ${now}-month`} photo`)}${hubPhotoInput(now)}</label><button class="mem-welcome-btn is-quiet" onclick="openPage('chg:Timeline:milestone')">Save a first</button></div></section>`;
      // The welcome button already adds this month's photo, so its tile doesn't repeat the button.
      b += `<div class="mem-head"><h2>Month by month</h2></div><div class="mem-stories">${months.map(m => card(m, m === now)).join('')}</div>`;
      b += `<p class="hub-foot">Photos and entries stay on this device.</p></div>`;
      return `<div class="quiet-category hub-page hub-timeline-page" style="${yearTheme('Memories')}">${b}</div>`;
    }
    b += `${year}<div class="mem-head"><h2>Month by month</h2>${have.length >= 2 ? `<button class="mem-play-link" onclick="memPlay()"><span aria-hidden="true">▶</span> Play the year</button>` : ''}</div>${strip}`;

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
      // Same header as every other inner page: the category icon, a short context line, then the title.
      const cat = record.type === 'milestone' ? 'Development' : 'Health';
      html = html.replace('<div class="journey-form-page">', `<div class="journey-form-page" style="${yearTheme(cat)}">`)
        .replace(/<div class="eyebrow">[^<]*<\/div><h1>/, `<div class="hub-detail-head"><span class="hub-big${record.type === 'milestone' ? ' mem-big is-toned" style="' + TONE(record) : ''}">${hubArt(record.type === 'milestone' ? ICON(record) : 'steth', cat)}</span><p class="hub-context">${record.type === 'milestone' ? 'A first' : 'Checkup'}</p><h1>`)
        .replace('</h1><form', '</h1></div><form')
        .replace('>Save date</button>', '>Save</button>');
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
