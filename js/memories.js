/* Ahead · Memories, led by the photos.
   A grid of the year (newborn to 1 year): photos big, this month's slot inviting, the months still to come
   faint, so the year fills in as it goes. "Play the year" flips through the photos with the firsts from each
   month. Firsts open in the memory book. Checkups live in Health, not here.
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
  window.memIsBig = isBig;
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
    return `<button class="mem-row" onclick="openPage('event-edit:${r.id}')"><span class="mem-row-ic is-toned" style="${TONE(r)}">${hubArt(ICON(r), 'Development')}</span><span class="mem-row-copy"><b>${esc2(keepTitle(r))}</b>${withMonth ? `<small>${esc2(longLabel(monthOf(dob, r.date)))}</small>` : ''}${r.notes ? `<q>${esc2(String(r.notes).slice(0, 90))}</q>` : ''}</span><span class="mem-row-go" aria-hidden="true">›</span></button>`;
  };
  // All firsts, by month, newest first. Its own page, so Memories itself never grows long.
  const allFirsts = () => {
    const dob = parse(profile.dob), all = journeyData().records.filter(r => r.type === 'milestone' && r.status === 'attended').sort((a, c) => a.date.localeCompare(c.date));
    const big = bigFirsts(all), rest = all.filter(r => !big.includes(r)).reverse();
    // Each month reads like a baby-book page: its big firsts, then the smaller things you noticed that month, as soft chips.
    const by = {}, also = {};
    [...big].reverse().forEach(r => { const m = monthOf(dob, r.date); (by[m] = by[m] || []).push(r); });
    rest.forEach(r => { const m = monthOf(dob, r.date); (also[m] = also[m] || []).push(r); });
    const months = [...new Set([...Object.keys(by), ...Object.keys(also)].map(Number))].sort((x, y) => y - x);
    // Each month as a page of a baby book: the month written by hand, its photo taped in the corner,
    // the big firsts written out with their dates and notes, and the smaller things noticed as little tags.
    const WORDS = ['Newborn', 'One month', 'Two months', 'Three months', 'Four months', 'Five months', 'Six months', 'Seven months', 'Eight months', 'Nine months', 'Ten months', 'Eleven months', 'One year'];
    const TAPE = ['#f3d58a', '#f2b8c6', '#bfe3cf', '#cfe3f7', '#e5d4f5', '#f6cdb5', '#d8e9b8', '#f9d9a8', '#c9d7f5', '#f4c2c2', '#b9e2dc', '#f0d1e8', '#f1cf86'];
    const day = d => parse(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const pageOf = (m, k) => {
      const pic = typeof hubPhotoFor === 'function' ? hubPhotoFor(m) : null, tape = TAPE[m], tilt = k % 2 ? -4 : 4;
      const firstsHtml = (by[m] || []).map(r => `<button class="bk-first" onclick="openPage('event-edit:${r.id}')"><span class="bk-ic" style="${TONE(r)}">${hubArt(ICON(r), 'Development')}</span><span class="bk-copy"><b>${esc2(keepTitle(r))}</b>${r.notes ? `<q>${esc2(String(r.notes).slice(0, 140))}</q>` : ''}</span><span class="bk-go" aria-hidden="true">›</span></button>`).join('');
      // The smaller things noticed that month, written as one line in the book's handwriting rather than a pile of
      // chips: by the first birthday there can be forty of them. Each one still opens to move or remove it, and a busy
      // month shows five, then "and 4 more", so no page grows long.
      const lc = t => /^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t;
      const noted = also[m] || [], cap = noted.length > 6 ? 5 : noted.length;
      const tags = noted.length ? `<p class="bk-noted${cap < noted.length ? '' : ' is-open'}"><span class="bk-noted-label">${esc2(by[m] ? 'Also noticed' : 'Noticed')}:</span> ${noted.map((r, i) => `<span class="bk-noted-it${i >= cap ? ' is-extra' : ''}">${i === 0 ? '' : i === noted.length - 1 ? ' and ' : ', '}<button class="bk-noted-go" style="${TONE(r)}" onclick="openPage('event-edit:${r.id}')" aria-label="${esc2(r.title + ', change or move')}">${esc2(lc(r.title))}</button></span>`).join('')}${cap < noted.length ? `<button class="bk-noted-more" onclick="this.parentNode.classList.add('is-open')"> and ${noted.length - cap} more</button>` : ''}.</p>` : '';
      // The month's photo, taped in on the right. No photo yet: an empty polaroid that adds one.
      const photo = pic ? `<span class="bk-photo" style="--tape:${tape};--tilt:${tilt}deg"><i></i><img src="${pic}" alt="${esc2(WORDS[m])} photo"><em class="bk-photo-cap">${esc2(m === 0 ? 'Newborn photo' : m === 12 ? 'Birthday photo' : m + '-month photo')}</em></span>`
        : `<label class="bk-photo is-empty" style="--tape:${tape};--tilt:${tilt}deg" aria-label="Add the ${esc2(WORDS[m].toLowerCase())} photo"><i></i><span class="bk-photo-add">＋</span>${typeof hubPhotoInput === 'function' ? hubPhotoInput(m) : ''}</label>`;
      // The photo sits in the corner and the words wrap around it, so a month with lots noticed uses the page's full width.
      return `<section class="bk-page" data-m="${m}">${photo}<h2 class="bk-month">${esc2(WORDS[m])}</h2>${firstsHtml ? `<div class="bk-firsts">${firstsHtml}</div>` : ''}${tags}</section>`;
    };
    const inner = `<div class="bk-book">${months.map(pageOf).join('')}</div>`;
    // A header in the same keepsake style: the title, and a little stack of taped polaroids.
    let head = `<header class="bk-head"><div class="bk-head-copy"><p class="bk-eyebrow">${hubArt('star', 'Development')}<span>Memories</span></p><h1>${esc2(`${name()}’s memory book`)}</h1><p class="bk-count">${esc2(all.length ? `${all.length} moment${all.length === 1 ? '' : 's'} so far.` : 'The big ones will collect here.')}</p>${all.length ? `<p class="bk-hint">${esc2('In the wrong month? Tap any moment to move it.')}</p>` : ''}</div><span class="bk-stack" aria-hidden="true"><span class="bk-stack-back"></span><span class="bk-stack-mid"></span><span class="bk-stack-front"><i></i><svg viewBox="0 0 40 40"><path d="M20 31s-9-5.6-9-12.2A5 5 0 0 1 20 16a5 5 0 0 1 9 2.8C29 25.4 20 31 20 31Z" fill="none" stroke="#f08b72" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></header>`;
    { // The header's polaroid shows the newest real photo, not a placeholder.
      const pm = [12,11,10,9,8,7,6,5,4,3,2,1,0].find(m => typeof hubPhotoFor === 'function' && hubPhotoFor(m));
      if (pm != null) head = head.replace(/<span class="bk-stack-front"><i><\/i><svg[\s\S]*?<\/svg><\/span>/, `<span class="bk-stack-front has-photo"><i></i><img src="${hubPhotoFor(pm)}" alt=""></span>`);
    }
    return `<div class="quiet-category hub-page hub-detail bk-screen" data-overview="Memories" style="${yearTheme('Memories')}">${typeof detailPageTop === 'function' ? detailPageTop('Memories') : ''}${head}${months.length ? inner : `<p class="mem-empty">${esc2('Nothing saved yet.')}</p>`}</div>`;
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

    // Month by month: each month as its finished Story (the balloon design with the photo in the polaroid).
    // Months without a photo show the same design with an empty polaroid, so parents can see what it becomes.
    const have = Array.from({ length: now + 1 }, (_, m) => m).filter(m => photo(m));
    const designs = typeof storyShare === 'function';
    const L = m => longLabel(m).toLowerCase();
    const remove = m => `<button class="mem-shot-remove" onclick="hubPhotoRemove(${m})" aria-label="Remove the ${L(m)} photo"><span aria-hidden="true">×</span></button>`;
    const card = (m, quiet) => {
      if (m === 0 && !designs) return photo(0)
        ? `<div class="mem-story-wrap"><label class="mem-story is-plain" aria-label="Change the newborn photo"><img src="${photo(0)}" alt=""><em>Newborn</em>${hubPhotoInput(0)}</label>${remove(0)}</div>`
        : `<label class="mem-story is-plain is-empty" aria-label="Add the newborn photo"><em>Newborn</em><span class="mem-story-add">＋ Add photo</span>${hubPhotoInput(0)}</label>`;
      if (!designs) return photo(m) ? `<div class="mem-story-wrap"><label class="mem-story is-plain"><img src="${photo(m)}" alt=""><em>${label(m)}</em>${hubPhotoInput(m)}</label>${remove(m)}</div>` : '';
      if (photo(m)) return `<div class="mem-story-wrap"><button class="mem-story" onclick="storyShare(${m})" aria-label="Open the ${L(m)} card"><img data-story-thumb="${m}" alt=""></button>${remove(m)}</div>`;
      return `<label class="mem-story is-empty" aria-label="Add the ${m === 0 ? 'newborn' : m === 12 ? 'first-birthday' : m + '-month'} photo"><img data-story-thumb="${m}" alt="">${quiet === true ? '' : '<span class="mem-story-plus" aria-hidden="true">＋</span>'}${hubPhotoInput(m)}</label>`;
    };
    const bigs = bigFirsts(firsts);
    // Newest first, only the months the baby has reached.
    const months = Array.from({ length: now + 1 }, (_, i) => now - i);
    const strip = `<div class="mem-stories" tabindex="0" role="region" aria-label="Month by month photos">${months.map(m => card(m)).join('')}</div>`;
    // At the first birthday, the whole year on one page sits above the row, as its own thing.
    const year = designs && now === 12 && Array.from({ length: 12 }, (_, i) => photo(i + 1)).some(Boolean)
      ? `<button class="mem-yearcard" onclick="storyShare('year')"><span class="mem-yearcard-pic"><img data-story-thumb="year" alt=""></span><span><b>${esc2(`${name()}’s first year`)}</b><small>All twelve months on one page, as a photo or a video.</small></span><span class="mem-row-go" aria-hidden="true">›</span></button>` : '';
    if (designs) setTimeout(() => window.storyHydrate && storyHydrate(), 0);
    let b = `<div class="mem-page"><div class="eyebrow">Memories</div><h1>${nm}’s first year</h1>`;
    // The memory book: one card that opens it, styled like the book's own cover. Saving a first stays one tap.
    const stack = `<span class="bk-stack" aria-hidden="true"><span class="bk-stack-back"></span><span class="bk-stack-mid"></span><span class="bk-stack-front"><i></i><svg viewBox="0 0 40 40"><path d="M20 31s-9-5.6-9-12.2A5 5 0 0 1 20 16a5 5 0 0 1 9 2.8C29 25.4 20 31 20 31Z" fill="none" stroke="#f08b72" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>`;
    const count = firsts.length ? `${firsts.length} moment${firsts.length === 1 ? '' : 's'} so far` : 'Firsts you save are written here';
    // The book's cover photo: one the then-and-now card above isn't already showing, when there is one.
    const newest = have.length > 2 ? have[have.length - 2] : have.length ? have[have.length - 1] : null;
    const realStack = newest != null ? stack.replace(/<span class="bk-stack-front"><i><\/i><svg[\s\S]*?<\/svg><\/span>/, `<span class="bk-stack-front has-photo"><i></i><img src="${photo(newest)}" alt=""></span>`) : null;
    // The newest real photo when there is one; until then, the little keepsake drawing.
    const art = `<span class="mem-bookcard-art">${realStack || stack}</span>`;
    const addArt = '';
    const bookCard = `<div class="mem-bookcard${addArt ? ' has-add' : ''}"><button class="mem-bookcard-open" onclick="openPage('${firsts.length ? 'chg:Timeline:firsts' : 'chg:Timeline:milestone'}')">${art}<span class="mem-bookcard-copy"><b>${esc2(`${name()}’s memory book`)}</b><small>${esc2(count)}</small>${firsts.length ? `<em>Open the book ›</em>` : ''}</span></button>${addArt}<button class="mem-bookcard-save" onclick="openPage('chg:Timeline:milestone')">＋ Save a first</button></div>`;

    // One month at a time. A row of the months across the top (her photo, or the month's number until there is one),
    // then that month as one card: its balloon card, ready to share, and what happened that month underneath.
    // It opens on this month; tap any month to look back. Play the year sits by the title.
    const WORDS = ['Newborn', 'One month', 'Two months', 'Three months', 'Four months', 'Five months', 'Six months', 'Seven months', 'Eight months', 'Nine months', 'Ten months', 'Eleven months', 'One year'];
    const short = m => m === 0 ? 'Newborn' : m === 12 ? '1 year' : `${m} month${m === 1 ? '' : 's'}`;
    const P = typeof babyPronouns === 'function' ? babyPronouns() : { p: 'their' };
    const bigSet = new Set(bigFirsts(firsts));
    const inMonth = m => firsts.filter(r => monthOf(dob, r.date) === m);
    const tile = m => `<button class="mem-pick${m === now ? ' is-on' : ''}" data-m="${m}" onclick="memPick(${m})" aria-label="${esc2(short(m))}"${m === now ? ' aria-current="true"' : ''}><span class="mem-pick-tile">${photo(m) ? `<img src="${photo(m)}" alt="">` : `<b>${m === 0 ? '0' : m}</b>`}</span><small>${esc2(short(m))}</small><i class="${inMonth(m).length ? 'has' : ''}"></i></button>`;
    const picker = `<div class="mem-picks" role="tablist" aria-label="Months">${Array.from({ length: now + 1 }, (_, m) => tile(m)).join('')}</div>`;
    const lc = t => /^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t;
    const monthCard = m => {
      const rs = inMonth(m), big = rs.filter(r => bigSet.has(r)).reverse(), small = rs.filter(r => !bigSet.has(r));
      const media = !designs ? '' : photo(m)
        ? `<button class="mem-card-story" onclick="storyShare(${m})" aria-label="Share the ${L(m)} card"><img data-story-thumb="${m}" alt=""></button><button class="mem-card-share" onclick="storyShare(${m})">Share ${esc2(m === 0 ? 'her newborn card' : 'this card')}</button>`.replace('her newborn', `${P.p} newborn`)
        : `<label class="mem-card-story is-empty" aria-label="Add the ${m === 0 ? 'newborn' : m === 12 ? 'first-birthday' : m + '-month'} photo"><img data-story-thumb="${m}" alt="">${hubPhotoInput(m)}</label><label class="mem-card-share is-add">＋ Add ${esc2(P.p)} ${m === 0 ? 'newborn' : m === 12 ? 'first-birthday' : m + '-month'} photo${hubPhotoInput(m)}</label>`;
      // What happened that month, small and light under the balloon card: each big first as a little round badge
      // with its drawing (four at most, one row), then the smaller things named in one short line. Two are named;
      // past that it's "and 3 more", which opens the book where they're all listed.
      const open = `openPage('chg:Timeline:firsts')`;
      const bs = big.slice(0, 4), extraBig = big.length - bs.length;
      // Name up to three. Past that, name two and count the rest, so "more" is never just one.
      const named = small.slice(0, small.length <= 3 && !extraBig ? 3 : 2).map(r => lc(r.title));
      const rest = small.length - named.length + extraBig;
      const lead = small.length ? (bs.length ? 'Also noticed: ' : 'Noticed: ') : '';
      const body = !rest && named.length > 1 ? `${named.slice(0, -1).join(', ')} and ${named[named.length - 1]}` : named.join(', ');
      const tail = rest ? `${named.length ? 'and ' : ''}${rest} more ›` : '';
      const line = small.length || extraBig ? `${lead ? `<span class="mem-badge-lead">${esc2(lead)}</span>` : ''}${esc2(body)}${tail ? ` <span class="mem-nowrap">${esc2(tail)}</span>` : ''}` : '';
      const what = !rs.length
        ? `<p class="mem-badge-none">${esc2(m === now ? 'Nothing saved yet this month' : 'Nothing saved for this month')}</p>`
        : `<button class="mem-badges" onclick="${open}" aria-label="${esc2(`What happened at ${WORDS[m].toLowerCase()}, open the memory book`)}">${bs.length ? `<span class="mem-badge-row">${bs.map(r => `<span class="mem-badge"><span class="mem-badge-ic" style="${TONE(r)}">${hubArt(ICON(r), 'Development')}</span><span class="mem-badge-t">${esc2(keepTitle(r))}</span></span>`).join('')}</span>` : ''}${line ? `<span class="mem-badge-more">${line}</span>` : ''}</button>`;
      return `<section class="mem-card" data-m="${m}"${m === now ? '' : ' hidden'}><p class="mem-card-label">${esc2(m === now ? 'This month' : 'Looking back')}</p><h2 class="mem-card-title">${esc2(WORDS[m])}</h2><div class="mem-card-media">${media}</div>${what}</section>`;
    };
    const play = have.length >= 2 ? `<button class="mem-title-play" onclick="memPlay()" aria-label="Play the year"><span aria-hidden="true">▶</span> Play the year</button>` : '';
    b = `<div class="mem-page"><div class="mem-title-row"><div class="eyebrow">Memories</div>${play}</div><h1>${nm}’s first year</h1>`;
    setTimeout(() => { const r = document.querySelector('.mem-picks'); if (r) r.scrollLeft = r.scrollWidth; }, 0);
    // On her first birthday the whole-year card comes first, above the months.
    // The month card holds the month; the memory book (with Save a first) sits under it, as its own cover.
    b += (year ? `<div class="mem-year-wrap">${year}</div>` : '') + picker + Array.from({ length: now + 1 }, (_, m) => monthCard(m)).join('') + bookCard;
    // Checkups live in Health, never in the memory book.
    b += `<p class="hub-foot">Photos and entries stay on this device.</p></div>`;
    return `<div class="quiet-category hub-page hub-timeline-page" style="${yearTheme('Memories')}">${b}</div>`;
  };

  // Switch the month card. The row scrolls so the chosen month stays in view.
  // Swipe the month card left or right to move to the next or previous month.
  if (!window.__memSwipe) {
    window.__memSwipe = true;
    let x0 = null, y0 = null, card = null;
    document.addEventListener('touchstart', e => { card = e.target.closest && e.target.closest('.mem-card'); if (!card) return; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    document.addEventListener('touchend', e => {
      if (!card || x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      const m = Number(card.dataset.m); x0 = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      const next = dx < 0 ? m + 1 : m - 1;
      if (document.querySelector(`.mem-card[data-m="${next}"]`)) memPick(next, dx < 0 ? 'left' : 'right');
    }, { passive: true });
  }
  window.memPick = function (m, dir) {
    document.querySelectorAll('.mem-card').forEach(c => { c.hidden = Number(c.dataset.m) !== m; c.classList.remove('slide-left', 'slide-right'); if (!c.hidden && dir) { void c.offsetWidth; c.classList.add('slide-' + dir); } });
    document.querySelectorAll('.mem-pick').forEach(t => { const on = Number(t.dataset.m) === m; t.classList.toggle('is-on', on); if (on) { t.setAttribute('aria-current', 'true'); t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); } else t.removeAttribute('aria-current'); });
    if (window.storyHydrate) storyHydrate();
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
      // A checkup lives in Health, not Memories: undoing it says so, and goes back to Health.
      if (record.type !== 'milestone') return html.replace(`navigate('timeline')">Remove from Memories`, `openPage('topic:Health')">Mark as not done`);
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

  /* ---------- Play the year: a flipbook of the month cards (the balloon design), with that month's firsts ---------- */
  let timer = null;
  window.memPlay = async function () {
    const dob = parse(profile.dob), data = journeyData();
    const frames = Array.from({ length: 13 }, (_, m) => m).filter(m => hubPhotoFor(m)).map(m => {
      const start = iso(addMonths(dob, m)), end = iso(addMonths(dob, m + 1));
      const f = bigFirsts(data.records.filter(r => r.type === 'milestone' && r.status === 'attended' && r.date >= start && r.date < end)).map(keepTitle);
      return { m, src: hubPhotoFor(m), firsts: f };
    });
    if (!frames.length || document.querySelector('.mem-flip')) return;
    const cards = typeof storyHydrate === 'function';
    const el = document.createElement('div');
    el.className = 'mem-flip' + (cards ? ' is-cards' : ''); el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'The year, month by month');
    el.innerHTML = `<button class="mem-flip-close" aria-label="Close">×</button><div class="mem-flip-stage"><img alt=""><div class="mem-flip-cap"><b></b><span></span></div></div><div class="mem-flip-dots">${frames.map(() => '<i></i>').join('')}</div>`
      + (cards ? `<div hidden>${frames.map(f => `<img data-story-thumb="${f.m}" alt="">`).join('')}</div>` : '');
    document.body.appendChild(el);
    // The month cards are drawn once and kept, so the first play waits a moment for them (never more than 2 seconds).
    if (cards) {
      storyHydrate(el);
      const t0 = Date.now();
      while (Date.now() - t0 < 2000 && el.querySelectorAll('[data-story-thumb]:not(.is-ready)').length) await new Promise(r => setTimeout(r, 80));
    }
    let i = 0;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const show = () => {
      const f = frames[i], img = el.querySelector('.mem-flip-stage img'), card = cards && el.querySelector(`[data-story-thumb="${f.m}"].is-ready`);
      img.classList.remove('is-in'); void img.offsetWidth; img.src = card ? card.src : f.src; img.classList.add('is-in');
      img.alt = card ? `${name()} at ${longLabel(f.m).toLowerCase()}` : '';
      el.querySelector('.mem-flip-cap b').textContent = card ? '' : longLabel(f.m);
      el.querySelector('.mem-flip-cap span').textContent = f.firsts.join(' · ');
      el.querySelectorAll('.mem-flip-dots i').forEach((d, k) => d.classList.toggle('is-on', k === i));
    };
    const close = () => { clearInterval(timer); timer = null; el.remove(); };
    const step = () => { i = (i + 1) % frames.length; show(); };
    el.querySelector('.mem-flip-close').onclick = close;
    el.querySelector('.mem-flip-stage').onclick = () => { if (timer) { clearInterval(timer); timer = null; } else step(); };
    show();
    if (!reduce) timer = setInterval(() => { if (i === frames.length - 1) { clearInterval(timer); timer = null; return; } step(); }, 1600);
  };
})();
