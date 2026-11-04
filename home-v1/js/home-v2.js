/* Ahead · Home, redesigned to match the category pages.
   Job: "Help me quickly understand what matters most for my baby right now, what I should be doing, and what
   I need to prepare for next, without having to search for information."
   Order: the month card (what's happening, with the baby growing month by month; on a month birthday it adds
   a small celebration and the photo, instead of replacing the summary) → one question, if any → "What to do
   now" (at most 2) → "Coming up" (at most 2, with the Timeline one tap away) → "That's everything for now."
   The category grid is gone: Categories is a tab of its own. */
(function () {
  if (typeof window.adaptiveHome !== 'function' || typeof window.homeBriefingData !== 'function') return;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const LABEL = { 'Daily rhythm': 'Everyday care', Development: 'Development & play', 'Out and about': 'Outings and travel' };
  const PAL = t => (typeof YEAR_PALETTES !== 'undefined' && YEAR_PALETTES[t]) || { bg: '#f6cdb5', pale: '#fdf1ea', ink: '#7a4a33', accent: '#e3a98a' };
  const theme = t => { const p = t === 'Out and about' ? { bg: '#f6cdb5', pale: '#fdf1ea', ink: '#7a4a33', accent: '#e3a98a' } : t === 'Childcare' ? { bg: '#f3e08c', pale: '#fcf6dc', ink: '#6d5a12', accent: '#d9c060' } : PAL(t); return `--year-bg:${p.bg};--year-pale:${p.pale};--year-ink:${p.ink};--year-accent:${p.accent}`; };
  const babyCopy2 = s => (typeof babyCopy === 'function' ? babyCopy(s) : s);

  function row(i, fresh) {
    const todo = i.key.startsWith('check:') || !!i.tools;
    const go = i.link ? i.link.go : `openPage('topic:${i.topic}')`;
    const open = todo ? go : `hubHomeOpen('${i.key}');${go}`;
    const icon = typeof catIcon === 'function' ? catIcon(i.topic) : '';
    return `<div class="hm-row" style="${theme(i.topic)}" data-brief="${esc(i.key)}"><button class="hm-row-main" onclick="${open}"><span class="hm-dot" aria-hidden="true">${icon}</span><span class="hm-copy"><small>${esc(LABEL[i.topic] || i.topic)}${fresh ? ' <em>New</em>' : ''}</small><b>${babyCopy2(i.title)}</b><span>${babyCopy2(i.body)}</span></span><span class="hm-chev" aria-hidden="true">›</span></button>${i.tools ? `<div class="hm-tools">${i.tools}</div>` : ''}<button class="hm-hide" onclick="hubHomeClear('${i.key}',true)" aria-label="Hide this from Home">×</button></div>`;
  }

  const base = window.adaptiveHome;
  window.adaptiveHome = homeAtlas = function () {
    const old = base();
    // Only today's Home for this baby is redesigned; looking at another month, and the first birthday, keep their own screens.
    if (typeof isCurrent === 'function' && !isCurrent()) return old;
    if (typeof hubFirstBirthday === 'function' && hubFirstBirthday()) return old;
    if (typeof month !== 'undefined' && typeof actualMonth === 'function' && month !== actualMonth()) return old;
    const q = (old.match(/<section class="connected-checkin[^"]*"[\s\S]*?<\/section>/) || [''])[0];
    const top = old.slice(0, Math.max(0, old.indexOf('<p class="home-age-line"')));   // month strip and anything above the age line
    const ageLine = (old.match(/<p class="home-age-line">[\s\S]*?<\/p>/) || [''])[0];
    const d = homeBriefingData();
    const nm = esc(name()), m = actualMonth();

    // The month card: what's happening this month, and the baby growing month by month.
    const b = typeof hubMonthBirthday === 'function' ? hubMonthBirthday() : null;
    let party = '';
    if (b) {
      const label = b.m === 12 ? '1 year' : `${b.m} month${b.m === 1 ? '' : 's'}`, plabel = b.m === 12 ? 'first-birthday' : `${b.m}-month`, photo = typeof hubPhotoFor === 'function' ? hubPhotoFor(b.m) : null;
      party = `<div class="hm-party"><span class="hm-party-text"><b>${b.since === 0 ? `Happy ${label}!` : `${nm} turned ${label}`}</b>${b.firsts.length ? `<small>${b.firsts.map(r => '✓ ' + esc(r.title)).join(' · ')}</small>` : ''}</span><label class="hm-party-photo" role="button">${photo ? `<img src="${photo}" alt="">Change photo` : `<i aria-hidden="true">＋</i>Add a photo`}${typeof hubPhotoInput === 'function' ? hubPhotoInput(b.m) : ''}</label></div>`;
    }
    const eyebrow = m === 0 ? 'The first weeks' : 'This month';
    const hero = `<header class="hm-hero"><div class="hm-hero-copy"><p class="hm-eyebrow">${esc(eyebrow)}${b ? ' <span aria-hidden="true">✦</span>' : ''}</p><h1>${d.focus.title}</h1><p class="hm-lead">${d.focus.body}</p></div><span class="hm-art" aria-hidden="true">${typeof homeMonthArt === 'function' ? homeMonthArt(m) : ''}</span>${party}</header>`;

    let h = top + ageLine + hero;
    if (q) h += q;
    if (d.now.length) h += `<h2 class="hm-h2">What to do now</h2><div class="hm-list">${d.now.map(i => row(i, d.fresh.has(i.key))).join('')}</div>`;
    if (d.next.length) h += `<div class="hm-h2-row"><h2 class="hm-h2">Coming up</h2><button class="hm-link" onclick="navigate('timeline')">Timeline ›</button></div><div class="hm-list is-ahead">${d.next.map(i => row(i, d.fresh.has(i.key))).join('')}</div>`;
    h += `<p class="hm-close">${!d.now.length && !d.next.length ? 'You’re all caught up for now.' : !d.now.length ? 'Nothing to do right now. We’ll bring things up as they get closer.' : 'That’s everything for now.'}</p>`;
    h += (old.match(/<p class="connected-preview-footnote">[\s\S]*?<\/p>/) || [''])[0];
    return h;
  };
})();
