/* Ahead · Story preview (Nov 14, prototype for Yarden to compare with today's guide)
   One guide stage read as a single story, top to bottom, instead of a hub of rows and separate pages.
   Bigger topics open as swipeable cards: one idea per screen.
   Only Sleep at "Longer nights" (about 6 weeks–4 months) is built. Every fact comes from today's Sleep pages. */
(function () {
  const F = s => (window.__hub ? window.__hub.F(s) : s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nm = () => (typeof name === 'function' ? name() : 'your baby');

  /* ---------- the swipeable topic: the 4-month regression ---------- */
  const REGRESS = [
    { k: 'What’s happening', h: 'Waking more means {p} sleep is growing up', b: 'Around 4 months, {p} sleep cycles start working like yours. A baby who was sleeping longer can start waking again.', art: 'moons' },
    { k: 'Why', h: '{S} {surface|surfaces} between sleep cycles now', b: 'As {p} sleep cycles mature, {s} {wake|wakes} up between them more often. It’s a step forward, not backward.', art: 'cycle' },
    { k: 'How long', h: 'A few weeks', b: 'It usually starts between 3 and 5 months, then longer stretches come back.', art: 'weeks' },
    { k: 'Normal, or call?', normal: 'More waking for a few weeks, and harder to put down.', call: 'Poor feeding, pain, or a fever of 101°F or higher.', h: 'You don’t need to sleep train to get through it' }
  ];

  const ART = {
    moons: `<svg viewBox="0 0 220 70" aria-hidden="true"><g fill="#a3c2f2">${[20, 75, 130, 185].map((x, i) => `<path transform="translate(${x} ${i % 2 ? 18 : 10})" d="M22 4a16 16 0 1 0 14 24A13 13 0 0 1 22 4Z" opacity="${i === 1 || i === 2 ? 1 : .55}"/>`).join('')}</g></svg>`,
    cycle: `<svg viewBox="0 0 220 70" aria-hidden="true"><path d="M8 38 C30 8 50 8 72 38 S114 68 136 38 S178 8 212 38" fill="none" stroke="#a3c2f2" stroke-width="5" stroke-linecap="round"/>${[72, 136].map(x => `<circle cx="${x}" cy="38" r="7" fill="#24508F"/>`).join('')}</svg>`,
    weeks: `<svg viewBox="0 0 220 70" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${10 + i * 34}" y="${i < 3 ? 14 : 34}" width="26" height="${i < 3 ? 42 : 22}" rx="7" fill="${i < 3 ? '#a3c2f2' : '#d9e5fc'}"/>`).join('')}</svg>`,
    moon: `<svg viewBox="0 0 220 70" aria-hidden="true"><path transform="translate(88 6)" d="M28 4a26 26 0 1 0 22 38A21 21 0 0 1 28 4Z" fill="#a3c2f2"/></svg>`
  };

  function cards(deck, title) {
    const n = deck.length;
    const one = (c, i) => `<section class="sp-card" aria-label="${i + 1} of ${n}"><small class="sp-k">${F(c.k)}</small>`
      + (c.art ? `<div class="sp-art">${ART[c.art]}</div>` : '')
      + `<h2>${F(c.h)}</h2>`
      + (c.b ? `<p>${F(c.b)}</p>` : '')
      + (c.list ? `<ol class="sp-do">${c.list.map(x => `<li>${F(x)}</li>`).join('')}</ol>` : '')
      + (c.normal ? `<div class="sp-vs"><div><b>${F('Normal')}</b><span>${F(c.normal)}</span></div><div class="is-call"><b>${F('Call your pediatrician')}</b><span>${F(c.call)}</span></div></div>` : '')
      + `</section>`;
    return `<div class="sp-deck-wrap"><p class="sp-deck-title">${F(title)} <span>${F(`· swipe · ${n} cards`)}</span></p>`
      + `<div class="sp-deck" onscroll="spDots(this)">${deck.map(one).join('')}</div>`
      + `<div class="sp-dots">${deck.map((_, i) => `<i class="${i ? '' : 'is-on'}"></i>`).join('')}</div></div>`;
  }
  window.spDots = el => { const i = Math.round(el.scrollLeft / el.clientWidth), d = el.parentElement.querySelectorAll('.sp-dots i'); d.forEach((x, j) => x.classList.toggle('is-on', j === i)); };

  /* ---------- the story: Sleep, about 6 weeks–4 months ---------- */
  function story() {
    const ch = (n, t, body) => `<section class="sp-ch"><p class="sp-n">${n}</p><h2 class="sp-h">${F(t)}</h2>${body}</section>`;
    const p = t => `<p class="sp-p">${F(t)}</p>`;
    const remember = (t) => `<blockquote class="sp-remember"><small>${F('Remember this')}</small>${F(t)}</blockquote>`;
    return `<div class="sp-page">
      <div class="monthly-page-header"><button class="monthly-back" aria-label="Back" onclick="openPage('topic:Sleep')"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg></button><div><h1>${F('Sleep')}</h1><p>${esc(nm())} · ${F('about a 2-minute read')}</p></div><span class="monthly-save" aria-hidden="true"></span></div>
      <div class="sp-progress"><i id="spBar"></i></div>
      <header class="sp-hero"><small>${F('Sleep this month')}</small><h1>${F('{P} sleep is growing up')}</h1><p>${F('Here’s what’s changing, what helps tonight, and what’s next, in one read.')}</p></header>

      ${ch('1', 'What’s changing', p('Was Maya sleeping longer, and now {s’s} waking again? Here’s why, in four quick cards.')
        + cards(REGRESS, 'The 4-month regression'))}

      ${ch('2', 'What helps tonight', `<ol class="sp-do sp-do-big"><li>${F('Keep your bedtime steps the same, even on rough nights.')}</li><li>${F('Pause a minute or two before going in. A cry between cycles often settles.')}</li><li>${F('Keep night visits brief, dark and boring.')}</li></ol>`
        + p('Rough few nights? Try bedtime 30 minutes earlier for a few nights.'))}

      ${ch('3', 'What {p} day looks like now', `<div class="sp-tiles"><div><small>${F('Naps')}</small><b>3–4</b><span>${F('Finding set times')}</span></div><div><small>${F('Wake window')}</small><b>1½–2½ hrs</b><span>${F('Between sleeps')}</span></div><div><small>${F('Longest sleep')}</small><b>5+ hrs</b><span>${F('Often from bedtime')}</span></div></div>`
        + p('Naps start landing at about the same times, like 9 am, 12:30 and 4 pm. For a few days, jot down when {s} {get|gets} sleepy, then put {o} down at those times.')
        + p('Short naps of 30–45 minutes are very common now. They get longer with time.'))}

      ${ch('4', 'Something to practice, if you want', p('Once a day, often at bedtime, lay {o} down drowsy but awake after your usual steps. Fusses? Wait a minute or two. If {s} {need|needs} you, help, and try again another day.')
        + remember('It’s practice, not a test. Feeding or rocking to sleep is still fine.'))}

      ${ch('5', 'Keep {o} safe as {s} {move|moves}', p('Stop swaddling at the first try to roll, and switch to a sleep sack with {p} arms free. Every sleep: alone, on {p} back, in a bare crib.')
        + `<button class="sp-link" onclick="openPage('chg:Sleep:safe')">${F('Safe sleep checklist')} ›</button>`)}

      ${ch('6', 'What’s next', `<div class="sp-next"><small>${F('Usually from 5 months')}</small><b>${F('Three naps')}</b><span>${F('Watch for longer awake time before naps.')}</span></div>`)}

      <section class="sp-end"><b>${F('That’s sleep this month.')}</b><span>${F('Looking for something specific?')}</span>
        <div class="sp-chips"><button onclick="openPage('chg:Sleep:d:rough')">${F('Rough night')}</button><button onclick="openPage('chg:Sleep:settle')">${F('Sleep training')}</button><button onclick="openPage('chg:Sleep:d:predictable')">${F('Nap times')}</button></div></section>
      <p class="hub-foot">${F('Preview: a story version of this guide, to compare with today’s.')}</p>
    </div>`;
  }

  /* ---------- wiring: the story is its own page; today's Sleep page links to it ---------- */
  if (typeof window.render === 'function') {
    const base = window.render;
    window.render = render = function (...a) {
      if (typeof page === 'string' && page === 'story:Sleep') {
        const m = document.getElementById('main'); if (m) { m.innerHTML = story(); window.scrollTo(0, 0); }
        window.onscroll = () => { const b = document.getElementById('spBar'); if (b) b.style.width = Math.min(100, scrollY / Math.max(1, document.body.scrollHeight - innerHeight) * 100) + '%'; };
        return;
      }
      const r = base.apply(this, a);
      try {
        if (typeof page === 'string' && /^(topic:Sleep|chg:Sleep:s:\d)$/.test(page)) {
          const m = document.getElementById('main'), hd = m && m.querySelector('.monthly-page-header');
          if (hd && !m.querySelector('.sp-try')) hd.insertAdjacentHTML('afterend', `<button class="sp-try" onclick="openPage('story:Sleep')"><b>${F('Preview: read this as one story')}</b><span>${F('The new format, to compare')} ›</span></button>`);
        }
      } catch (e) {}
      return r;
    };
  }
})();
