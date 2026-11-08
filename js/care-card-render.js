/* Ahead · The care card as a caregiver sees it. Shared by card.html (the link they receive) and the app (the saved card),
   so what a parent sees after saving is exactly what gets sent. d is the card's data; inApp leaves off the thank-you and the Ahead invite. */
window.aheadCareCard = function (d, inApp) {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const n = esc(d.n), they = d.s || 'they', cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const tel = p => String(p || '').replace(/[^\d+]/g, '');
  // Small line icons, the same family as the app's.
  const I = {
    bottle: '<path d="M10 3h4M10.5 3v3.2L8.6 8.4A2.5 2.5 0 0 0 8 10v8.5A2.5 2.5 0 0 0 10.5 21h3a2.5 2.5 0 0 0 2.5-2.5V10a2.5 2.5 0 0 0-.6-1.6L13.5 6.2V3M8 12h8"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
    note: '<rect x="5.5" y="4" width="13" height="16.5" rx="2"/><path d="M9 9h6M9 12.5h6M9 16h4"/>',
    phone: '<path d="M6.6 3.8 9 3.4l1.6 4-2 1.3a10.5 10.5 0 0 0 6.7 6.7l1.3-2 4 1.6-.4 2.4a2 2 0 0 1-2 1.7A16.6 16.6 0 0 1 4.9 5.8a2 2 0 0 1 1.7-2Z"/>',
    steth: '<path d="M7 4v5a4 4 0 0 0 8 0V4M11 13v2.5a4 4 0 0 0 8 0V13"/><circle cx="19" cy="11" r="2"/>',
    shield: '<path d="M12 3.5 5.5 6v5.5c0 4 2.8 7.4 6.5 8.5 3.7-1.1 6.5-4.5 6.5-8.5V6Z"/><path d="m9.5 12 1.8 1.8 3.3-3.6"/>'
  };
  const icon = (k, t, ti) => `<span class="ic" style="--t:var(--${t});--ti:var(--${ti})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg></span>`;
  const row = (k, t, label, value, extra = '', href = '') => `<${href ? `a href="${href}"` : 'div'} class="row">${icon(k, t, t + '-ink')}<span class="row-copy"><small>${label}</small><b>${value}</b></span>${extra}</${href ? 'a' : 'div'}>`;
  // Top card: a small flat picture (a big circle and a small one: someone looking after someone).
  let h = `<header class="hero"><span class="hero-art"><svg viewBox="0 0 80 40" aria-hidden="true"><circle cx="18" cy="20" r="16" fill="#f2b8c6"/><circle cx="44" cy="27" r="10" fill="#f4d6c4"/></svg></span><p class="hello">Thank you for looking after</p><h1 class="acc-h1">${n}</h1><p class="intro">Everything you need, in one place. Keep it handy while you’re together.</p>${d.d ? `<span class="updated">Updated ${esc(d.d)}</span>` : ''}</header>`;
  // The day, as tiles like Sleep's: the nap pills count the naps; the sun sets at bedtime.
  const tiles = [], napN = d.naps === '4 or more' ? 4 : Number(d.naps) || 0;
  const tile = (bg, ink, art, label, value, sub, wide) => `<div class="tile${wide ? ' wide' : ''}" style="--t:var(--${bg});--ti:var(--${ink})">${art ? `<span class="tile-art">${art}</span>` : ''}<small>${label}</small><b>${value}</b>${sub || ''}</div>`;
  if (d.milk || d.often) tiles.push(tile('feed', 'feed-ink', '<svg viewBox="0 0 60 26" aria-hidden="true"><rect x="2" y="4" width="14" height="20" rx="6" fill="#f2b8c6"/><rect x="5" y="1" width="8" height="5" rx="2" fill="#f4d6c4"/></svg>', 'Feeding', esc(d.milk || 'Milk'), `${d.often ? `<span>${esc(d.often)}</span>` : ''}${d.oz ? `<span>About ${esc(d.oz)} a bottle</span>` : ''}${d.solids && d.solids !== 'Not yet' ? `<span>Solids: ${esc(d.solids.toLowerCase())}</span>` : ''}`, false));
  if (napN || (d.times || []).length) tiles.push(tile('nap', 'nap-ink', `<svg viewBox="0 0 ${Math.max(1, napN) * 22} 26" aria-hidden="true">${Array.from({ length: Math.max(1, napN) }, (_, i) => `<rect x="${i * 22}" y="9" width="16" height="9" rx="4.5" fill="#f3d58a"/>`).join('')}</svg>`, 'Naps', napN ? `${esc(d.naps)} ${d.naps === '1' ? 'nap' : 'naps'} a day` : 'Naps', (d.times || []).length ? `<div class="times">${d.times.map(t => `<em>${esc(t)}</em>`).join('')}</div>` : '', !(d.milk || d.often)));
  if (d.bed) tiles.push(tile('dusk', 'dusk-ink', '<svg viewBox="0 0 60 26" aria-hidden="true"><path d="M2 22h56" stroke="#e3b8cf" stroke-width="2.5" stroke-linecap="round"/><path d="M18 22a10 10 0 0 1 20 0Z" fill="#f4c3a8"/></svg>', 'Bedtime', esc(d.bed), '', false));
  if ((d.asleep || []).length) tiles.push(tile('night', 'night-ink', '<svg viewBox="0 0 60 26" aria-hidden="true"><path d="M12 3a10 10 0 1 0 9 15A8.5 8.5 0 0 1 12 3Z" fill="#8e9ad0"/></svg>', 'Falls asleep with', esc(d.asleep.join(', ')), '', false));
  if (tiles.length % 2 && tiles.length > 1) tiles[tiles.length - 1] = tiles[tiles.length - 1].replace('class="tile"', 'class="tile wide"');
  if (tiles.length) h += `<h2 class="acc-h2">The day</h2><div class="tiles">${tiles.join('')}</div>`;
  // Good to know: what helps, allergies, anything else.
  const know = [];
  if ((d.calm || []).length) know.push(row('heart', 'feed', `If ${esc(they)}${they === 'they' ? '’re' : '’s'} upset, try`, esc(d.calm.map(cap).join(', '))));
  if (d.allergy) know.push(row('shield', 'peach', 'Allergies and medicines', esc(d.allergy)));
  if (d.other) know.push(row('note', 'nap', 'Also', esc(d.other)));
  if (know.length) h += `<h2 class="acc-h2">Good to know</h2><div class="list">${know.join('')}</div>`;
  // Who to call: each one taps to call.
  const calls = d.par && (d.par[0] || d.par[1]) ? [row('phone', 'green', `Parent${d.par[1] ? ' · ' + esc(d.par[1]) : ''}`, esc(d.par[0] || 'Parent'), d.par[1] ? '<span class="call-btn">Call</span>' : '', d.par[1] ? 'tel:' + tel(d.par[1]) : '')] : [];
  calls.push(...(d.c || []).filter(c => c[0] || c[1]).map(([nm, ph]) => row('phone', 'green', `Backup${ph ? ' · ' + esc(ph) : ''}`, esc(nm || 'Backup'), ph ? '<span class="call-btn">Call</span>' : '', ph ? 'tel:' + tel(ph) : '')));
  if (d.doc && (d.doc[0] || d.doc[1])) calls.push(row('steth', 'blue', `Pediatrician${d.doc[1] ? ' · ' + esc(d.doc[1]) : ''}`, esc(d.doc[0] || 'Pediatrician'), d.doc[1] ? '<span class="call-btn">Call</span>' : '', d.doc[1] ? 'tel:' + tel(d.doc[1]) : ''));
  if (calls.length) h += `<h2 class="acc-h2">Who to call</h2><div class="list">${calls.join('')}</div><p class="note">In an emergency, call 911 first.</p>`;
  // Safe sleep, always included, in the calm night color.
  h += `<section class="night"><span class="night-art"><svg viewBox="0 0 80 30" aria-hidden="true"><path d="M14 3a12 12 0 1 0 10 18A10 10 0 0 1 14 3Z" fill="#8e9ad0"/><rect x="32" y="12" width="40" height="8" rx="4" fill="#c9cff0"/></svg></span><small>Every sleep, every time</small><p>${esc(d.a || '')}</p><span>No blankets, pillows or bumpers. Car seats, swings and couches aren’t for sleep.</span></section>`;
  if (!inApp) h += `<p class="thanks">Thank you for helping. ${n} is lucky to have you.</p>`;
  if (!inApp) h += `<section class="ahead"><div class="brand">ahead<span>.</span></div><p>${n}’s family made this card with Ahead, a calm guide to a baby’s first year. Expecting, or know someone who is?</p><a href="https://yardenwalla.github.io/ahead-prototype/">Try Ahead, it’s free</a></section>`;
  return h;
};
