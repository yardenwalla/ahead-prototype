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
  // The big firsts get baby-book titles; everything else keeps its own words.
  const KEEP = [[/smiles? back|smiles at you|social smile/i, 'First smile'], [/laugh|chuckle/i, 'First laugh'], [/roll/i, 'First roll'], [/sits? (up|without)|sitting/i, 'Sitting up'], [/crawl/i, 'Crawling'], [/tooth/i, 'First tooth'], [/mama|dada|first word|says a word|name for a parent/i, 'First word'], [/wave/i, 'Waving bye-bye'], [/pulls? (up|to stand)|stand/i, 'Pulling up to stand'], [/steps|walk/i, 'First steps']];
  const keepTitle = r => { if (r.own || !r.skillKey) return r.title; const k = KEEP.find(([re]) => re.test(String(r.title))); return k ? k[1] : r.title; };
  // The moments for the keepsake list: the big ones (first of each kind) and anything the parent typed in.
  const bigFirsts = recs => { const seen = new Set(); return recs.filter(isBig).filter(r => { const t = keepTitle(r); if (r.own || !r.skillKey) return true; if (seen.has(t)) return false; seen.add(t); return true; }); };
  const label = m => m === 0 ? 'Born' : m === 12 ? '1 year' : `${m} mo`;
  const longLabel = m => m === 0 ? 'Newborn' : m === 12 ? '1 year' : `${m} month${m === 1 ? '' : 's'}`;
  const monthOf = (dob, date) => { let m = 0; while (m < 12 && iso(addMonths(dob, m + 1)) <= date) m++; return m; };

  // One first: icon, what happened, when, and the note (or an invitation to add one).
  const firstRow = (r, withMonth = true) => {
    const dob = parse(profile.dob);
    return `<button class="mem-row" onclick="openPage('event-edit:${r.id}')"><span class="mem-row-ic is-toned" style="${TONE(r)}">${hubArt(ICON(r), 'Development')}</span><span class="mem-row-copy"><b>${esc2(keepTitle(r))}</b><small>${esc2(journeyDateLabel(r.date))}${withMonth ? ` · ${esc2(longLabel(monthOf(dob, r.date)))}` : ''}</small>${r.notes ? `<q>${esc2(String(r.notes).slice(0, 90))}</q>` : ''}</span><span class="mem-row-go" aria-hidden="true">›</span></button>`;
  };
  // All firsts, by month, newest first. Its own page, so Memories itself never grows long.
  const allFirsts = () => {
    const dob = parse(profile.dob), all = journeyData().records.filter(r => r.type === 'milestone' && r.status === 'attended').sort((a, c) => a.date.localeCompare(c.date));
    const big = bigFirsts(all), rest = all.filter(r => !big.includes(r)).reverse();
    const by = {}; [...big].reverse().forEach(r => { const m = monthOf(dob, r.date); (by[m] = by[m] || []).push(r); });
    const inner = Object.keys(by).map(Number).sort((x, y) => y - x).map(m => `<h2 class="hub-h2">${esc2(longLabel(m))}</h2><div class="mem-list">${by[m].map(r => firstRow(r, false)).join('')}</div>`).join('')
      + (rest.length ? `<details class="mem-visits mem-skills"><summary><span>${esc2('Other skills you noticed')}</span><small>${rest.length}</small></summary>${rest.map(r => `<button class="mem-visit" onclick="openPage('event-edit:${r.id}')"><b>${esc2(r.title)}</b><small>${esc2(journeyDateLabel(r.date))}</small></button>`).join('')}</details>` : '');
    return String(window.__hub.detail('Memories', 'Memories', `${name()}’s firsts`, big.length ? `${big.length} big firsts so far.` : 'The big ones will collect here.', inner || `<p class="mem-empty">${esc2('Nothing saved yet.')}</p>`, 'star')).replace(/(<div class="monthly-page-header">[\s\S]*?<h1>)[^<]*(<\/h1><p>)[^<]*/, `$1Memories$2${esc2(name())}`);
  };
  if (typeof window.changesRoute === 'function') {
    const baseRoute = window.changesRoute;
    window.changesRoute = function (p) { return p === 'chg:Timeline:firsts' ? allFirsts() : baseRoute(p); };
  }

  /* ---------- Memories as a baby book: one page per month ---------- */
  // Swipe through the year like a book. Each page: the month in handwriting, that month's photo taped in,
  // the big firsts written underneath with their dates and notes, and any checkup as a small stamp.
  // Nothing to fill in: pages write themselves from what's already saved (Seen it, a first, a checkup, a photo).
  const WORDS = ['Newborn', 'One month', 'Two months', 'Three months', 'Four months', 'Five months', 'Six months', 'Seven months', 'Eight months', 'Nine months', 'Ten months', 'Eleven months', 'One year old'];
  const TAPE = ['#f3d58a', '#f2b8c6', '#bfe3cf', '#cfe3f7', '#e5d4f5', '#f6cdb5', '#d8e9b8', '#f9d9a8', '#c9d7f5', '#f4c2c2', '#b9e2dc', '#f0d1e8', '#f1cf86'];
  const dayLabel = d => { const x = parse(d); return x.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); };
  window.bbGo = m => { const el = document.getElementById('bb-' + m), book = el && el.parentElement; if (book) book.scrollTo({ left: el.offsetLeft - book.offsetLeft - 16, behavior: 'smooth' }); };
  window.journeyTimeline = journeyTimeline = function () {
    const data = journeyData(), dob = parse(profile.dob), today = iso(NOW), nm = esc2(name());
    const now = monthOf(dob, today);
    const photo = m => (typeof hubPhotoFor === 'function' ? hubPhotoFor(m) : null);
    const firsts = data.records.filter(r => r.type === 'milestone' && r.status === 'attended').sort((a, b) => a.date.localeCompare(b.date));
    const bigs = bigFirsts(firsts);
    const visits = data.records.filter(r => r.type === 'visit' && r.status === 'attended');
    const inMonth = (list, m) => { const a = iso(addMonths(dob, m)), b = iso(addMonths(dob, m + 1)); return list.filter(r => r.date >= a && r.date < b); };
    const P = typeof babyPronouns === 'function' ? babyPronouns() : { p: 'their' };
    const page = m => {
      const fs = inMonth(bigs, m), vs = inMonth(visits, m), pic = photo(m), tape = TAPE[m];
      const from = addMonths(dob, m), to = new Date(addMonths(dob, m + 1).getTime() - 864e5);
      const when = m === 0 ? `Born ${dayLabel(iso(dob))}` : `${dayLabel(iso(from))} – ${dayLabel(iso(to))}`;
      const title = m === 0 ? `Hello, ${nm}` : WORDS[m];
      const caption = m === 0 ? `${nm}, ${dayLabel(iso(dob))}` : `${nm} at ${WORDS[m].toLowerCase()}`;
      const designs = typeof storyShare === 'function';
      const shot = designs
        ? (pic ? `<div class="bb-story-wrap"><button class="mem-story bb-story" onclick="storyShare(${m})" aria-label="Open the ${esc2(WORDS[m].toLowerCase())} Story"><img data-story-thumb="${m}" alt=""></button></div>`
          : `<div class="bb-story-wrap"><label class="mem-story bb-story is-empty${m === now ? '' : ' is-past'}" role="button" aria-label="Add the ${esc2(WORDS[m].toLowerCase())} photo"><img data-story-thumb="${m}" alt="">${m === now ? `<span class="mem-story-add">＋ Add this month’s photo</span>` : `<span class="mem-story-plus" aria-hidden="true">＋</span>`}${hubPhotoInput(m)}</label></div>`)
        : '';
      const lines = fs.length
        ? `<ul class="bb-firsts">${fs.map(r => `<li><button onclick="openPage('event-edit:${r.id}')"><span class="bb-ic" style="${TONE(r)}">${hubArt(ICON(r), 'Development')}</span><span class="bb-line"><b>${esc2(keepTitle(r))}</b><small>${esc2(dayLabel(r.date))}</small>${r.notes ? `<q>${esc2(String(r.notes).slice(0, 120))}</q>` : ''}</span></button></li>`).join('')}</ul>`
        : `<div class="bb-ruled" aria-hidden="true"><i></i><i></i></div>${m === now ? `<p class="bb-blank">${esc2(`Firsts you save this month are written here.`)}</p>` : ''}`;
      const stamps = vs.map(r => `<span class="bb-stamp">✓ ${esc2(r.title)}</span>`).join('');
      const foot = m === now ? `<button class="bb-link" onclick="openPage('chg:Timeline:milestone')">＋ Save a first</button>` : pic ? `<button class="bb-link" onclick="storyShare(${m})">Share this month</button>` : '';
      return `<section class="bb-page${m === now ? ' is-now' : ''}" id="bb-${m}" aria-label="${esc2(WORDS[m])}"><div class="bb-paper"><p class="bb-when">${esc2(when)}</p>${shot}${lines}${stamps ? `<div class="bb-stamps">${stamps}</div>` : ''}${foot ? `<div class="bb-foot">${foot}</div>` : ''}</div></section>`;
    };
    const months = Array.from({ length: now + 1 }, (_, m) => m);
    const index = `<div class="bb-index" role="tablist" aria-label="Months">${months.map(m => `<button class="${photo(m) || inMonth(bigs, m).length ? 'is-full' : ''}${m === now ? ' is-now' : ''}" onclick="bbGo(${m})" aria-label="${esc2(WORDS[m])}">${m === 0 ? 'N' : m}</button>`).join('')}</div>`;
    const book = `<div class="bb-book" id="bb-book">${months.map(page).join('')}</div>`;
    setTimeout(() => window.storyHydrate && storyHydrate(), 0);
    setTimeout(() => { const el = document.getElementById('bb-' + now), bk = document.getElementById('bb-book'); if (el && bk && !bk.dataset.placed) { bk.scrollLeft = el.offsetLeft - bk.offsetLeft - 16; bk.dataset.placed = '1'; } }, 0);
    const have = months.filter(m => photo(m));
    const year = typeof storyShare === 'function' && now === 12 && have.length
      ? `<button class="mem-yearcard" onclick="storyShare('year')"><span class="mem-yearcard-pic"><img data-story-thumb="year" alt=""></span><span><b>${esc2(`${name()}’s first year`)}</b><small>All twelve months on one page, as a photo or a video.</small></span><span class="mem-row-go" aria-hidden="true">›</span></button>` : '';
    if (year) setTimeout(() => window.storyHydrate && storyHydrate(), 0);
    const links = [have.length >= 2 ? `<button class="bb-link" onclick="memPlay()">▶ Play the year</button>` : '', firsts.length ? `<button class="bb-link" onclick="openPage('chg:Timeline:firsts')">${esc2('All firsts')} ›</button>` : ''].filter(Boolean).join('');
    let b = `<div class="mem-page"><div class="eyebrow">Memories</div><h1>${nm}’s first year</h1>${year}${index}${book}${links ? `<div class="bb-links">${links}</div>` : ''}<p class="hub-foot">Photos and entries stay on this device.</p></div>`;
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
