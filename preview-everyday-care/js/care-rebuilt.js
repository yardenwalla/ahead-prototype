/* Everyday care, rebuilt on the shared guide templates (Nov 22 mockup: tub bath and baby acne).
   These pages use the same blocks as Feeding: hero, photo steps with notes in the card, one more section, video, when to call.
   Nothing here is rewritten after it draws. */
(function () {
  const CAT = 'Daily rhythm', H = () => window.__hub;
  const tub = () => ({ type: 'howto', label: 'Baths', art: 'bath', title: 'Tub baths can start',
    why: 'Once the cord has healed. About 3 baths a week is plenty.',
    steps: [['photo:care/tw1', 'Test the water', 'About 2 inches, warm on your wrist'], ['photo:care/tw2', 'Wipe {p} face', 'A damp cloth, no soap'],
      ['photo:care/tw3', 'Wash {p} body, then hair', 'Your arm behind {p} head'], ['photo:care/tw4', 'Lift {o} into a towel', 'Pat dry, into the creases']],
    stepsNotes: [['', 'Keep {o} warm', 'Pour cupfuls of bath water over {p} tummy as you go'], ['', 'Shampoo 2 or 3 times a week', 'A mild one. Plain water the rest of the time']],
    tipsTitle: 'Keep {o} safe', tips: [['hand', 'A hand on {o} the whole bath', 'To step away, wrap {o} in a towel and take {o} with you.'], ['thermo', 'Water heater at 120°F or lower', 'So scalds are much less likely.']],
    video: ['VsUla1M7eHQ', 'Giving a tub bath', 'Nemours KidsHealth'] });
  const acne = () => ({ type: 'check', label: 'Is this normal?', art: 'smile', title: 'Baby acne is common, and clears on its own',
    why: 'It shows up around 2–4 weeks and is usually gone by 4–6 months.',
    hero: () => H().TPLB.photoPins('care/acne', 'Baby acne on a newborn’s cheek', [['Small red bumps', 35, 63, 'r']], 'is-acne'),
    figure: () => H().TPLB.versus(['Baby acne', 'Small red or white bumps on the cheeks and nose. On darker skin, darker bumps.'], ['Worth a call', 'Bumps filled with pus, a fever, or still there after 6 months.']),
    helps: [['drop', 'Wash with plain water', 'Once a day, then pat dry'], ['shield', 'Leave the bumps alone', 'No lotions, oils or acne creams']],
    calls: { now: 'tiny purple-red dots that don’t fade when you press on them, especially with a fever.', nowLabel: 'Call 911' } });
  // The same page frame Feeding uses (feed-templates.js draw): the soft header card with the topic icon, then the template.
  const draw = q => { const h = H(), F = h.F, v = x => typeof x === 'function' ? x() : x, bg = '#e3f1f7', ink = '#2a6078', why = v(q.why);
    const art = q.art && typeof hubArt === 'function' ? `<span class="dev-area-head-art sf-head-art">${hubArt(q.art, CAT)}</span>` : '';
    return `<div class="quiet-category hub-page hub-detail care-v2" data-overview="${CAT}" data-ss="1" style="${typeof yearTheme === 'function' ? yearTheme(CAT) : ''};--ss-bg:${bg};--ss-ink:${ink}">${typeof detailPageTop === 'function' ? detailPageTop(CAT) : ''}`
      + `<div class="dev-area-head ss-head" style="--area:${bg};--area-ink:${ink}">${art}<p class="hub-context">${F(v(q.label))}</p><h1>${F(v(q.title))}</h1>${why ? `<p class="hub-lead">${F(why)}</p>` : ''}</div>`
      + (q.hero ? `<div class="ph-first">${v(q.hero)}</div>` : '')
      + `<div class="care-tpl is-${q.type}">${h.TPLS[q.type](q, CAT)}</div></div>`; };
  const PAGES = { 'p:tub': tub, 't:bath:1': tub, 'rash:acne': acne };
  window.__careRebuilt = r => !!PAGES[r];
  const base = window.changesRoute;
  window.changesRoute = function (p) {
    const pre = 'chg:' + CAT + ':d:';
    if (typeof p === 'string' && p.startsWith(pre) && PAGES[p.slice(pre.length)] && H()) return draw(PAGES[p.slice(pre.length)]());
    return base.apply(this, arguments);
  };
})();
