/* Everyday care, rebuilt on the shared guide templates (Nov 22 mockup: tub bath and baby acne).
   These pages use the same blocks as Feeding: hero, photo steps with notes in the card, one more section, video, when to call.
   Nothing here is rewritten after it draws. */
(function () {
  const CAT = 'Daily rhythm', H = () => window.__hub;
  const tub = () => ({ type: 'howto', label: 'Baths', art: 'bath', title: 'Tub baths can start',
    why: 'Once the cord heals, 2 or 3 baths a week is plenty. Keep a hand on {o} the whole time.',
    // Feeding's rhythm: tile titles of 1–3 words, one short line under each, specifics kept. Detail goes in 2 short notes.
    steps: [['photo:care/tw1', 'Check the water', 'Fill it 2–3 inches deep, about 100°F.'], ['photo:care/tw2', 'Start with {p} eyes', 'Wipe from the inner corner out.'],
      ['photo:care/tw3', 'Then work down', 'The diaper area goes last.'], ['photo:care/tw4', 'Wrap {o} in a towel', 'Pat {o} dry, into every crease.']],
    stepsNotes: [['', 'No thermometer?', 'Dip your elbow in. It should feel warm, never hot.'], ['', 'Plain water on {p} face', 'With a clean corner of the cloth for each eye.']],
    // The one safety rule sits in the lead; the water heater lives in Safety's first setup.
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
