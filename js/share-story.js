/* Ahead · Monthly Stories and the first-year collage.
   Each month (1–11) a foil-number balloon with the parent's photo taped on a polaroid and
   "[Name] is five months" handwritten underneath. At the first birthday, all twelve photos hang
   on a line under a gold "12", as a photo or a short video that zooms through the year.
   Everything is drawn on a canvas in the browser, from the parent's own photos, and shared as a
   file (Instagram, Messages) or saved. Nothing leaves the device until the parent shares it.
   Designs: assets/share. Photo windows were measured from each design (angle in degrees). */
(function () {
  const W = 1080, H = 1920;
  const WORDS = ['one month', 'two months', 'three months', 'four months', 'five months', 'six months', 'seven months', 'eight months', 'nine months', 'ten months', 'eleven months'];
  // b: where the design sits · p: photo window [cx, cy, w, h] · t: tilt · s: caption strip [cx, cy, w, h] · tp: tape layer [x, y, w, h]
  const MONTHS = {
    0: { accent: '#E0B54A', b: [0, 0, 1080, 1919], p: [533.2, 1052.7, 611.3, 576.7], t: -3.56, s: [556.0, 1418.0, 608.3, 158.4], tp: [212.3, 615.2, 620.9, 277.7] },
    1: { accent: '#7FA9DE', b: [-100, 0, 1280, 1920], p: [522.4, 1296.1, 627.2, 560.5], t: -6.85, s: [564.4, 1646.0, 624.2, 147.2], tp: [322.5, 841.2, 510.0, 208.8] },
    2: { accent: '#8FA6DA', b: [0, 0, 1080, 1919], p: [523.8, 1218.1, 577.5, 558.3], t: -7.75, s: [570.5, 1560.8, 574.5, 136.6], tp: [285.8, 791.9, 560.1, 175.6] },
    3: { accent: '#7CC2A0', b: [0, 0, 1080, 1919], p: [522.1, 1215.1, 575.7, 559.8], t: -7.7, s: [568.6, 1559.2, 572.7, 137.7], tp: [250.2, 788.5, 593.4, 176.7] },
    4: { accent: '#7CC2A0', b: [0, 0, 1080, 1919], p: [522.1, 1213.0, 577.8, 558.8], t: -7.65, s: [568.3, 1557.3, 574.8, 138.9], tp: [343.2, 786.2, 446.5, 177.9] },
    5: { accent: '#7FA9DE', b: [0, 0, 1080, 1919], p: [522.7, 1291.9, 588.6, 539.8], t: -6.26, s: [559.3, 1626.0, 585.6, 135.4], tp: [216.9, 874.6, 633.5, 182.5] },
    6: { accent: '#E0B54A', b: [0, 0, 1080, 1919], p: [522.9, 1212.7, 577.9, 560.3], t: -7.64, s: [569.1, 1557.1, 574.9, 137.7], tp: [227.2, 785.0, 589.9, 187.1] },
    7: { accent: '#EC9878', b: [0, 0, 1080, 1919], p: [523.2, 1210.0, 576.3, 554.8], t: -7.92, s: [571.0, 1553.2, 573.3, 141.2], tp: [200.9, 786.2, 643.9, 184.8] },
    8: { accent: '#E889AD', b: [-0.6, 0, 1081.2, 1920], p: [522.4, 1213.5, 578.7, 558.8], t: -7.59, s: [568.4, 1558.4, 575.7, 140.2], tp: [198.2, 787.1, 625.1, 185.0] },
    9: { accent: '#EC8478', b: [-0.6, 0, 1081.2, 1920], p: [522.5, 1212.6, 577.5, 558.9], t: -7.67, s: [569.0, 1557.5, 574.5, 140.2], tp: [233.8, 785.9, 611.3, 185.0] },
    10: { accent: '#B59AE4', b: [-0.6, 0, 1081.2, 1920], p: [522.0, 1211.5, 575.4, 561.3], t: -7.93, s: [570.1, 1556.9, 572.4, 139.0], tp: [199.3, 783.6, 643.4, 180.4] },
    11: { accent: '#E889AD', b: [-0.9, 0, 1081.9, 1920], p: [521.9, 1211.4, 577.7, 560.3], t: -7.73, s: [568.9, 1557.0, 574.7, 140.3], tp: [222.1, 784.1, 622.0, 184.0] },
    12: { accent: '#E0B54A', b: [-0.6, 0, 1081.2, 1920], p: [522.4, 1211.4, 576.8, 561.2], t: -7.93, s: [570.5, 1556.7, 573.8, 139.0], tp: [199.3, 783.6, 644.6, 188.4] }
  };
  // The year: twelve windows [cx, cy, w, h, tilt], months 1–12 in reading order.
  const YEAR = {
    b: [-1.25, 0, 1082.5, 1920], tp: [50, 648.8, 961.2, 792.5],
    p: [[158.1, 807.6, 189.7, 192.5, 10.75], [410.3, 848.0, 187.6, 189.4, 3.49], [665.6, 846.8, 191.0, 188.3, -3.58], [916.6, 809.3, 194.5, 190.4, -12.01],
      [156.1, 1133.0, 192.1, 190.9, 10.68], [409.0, 1170.0, 190.0, 189.4, 3.15], [670.7, 1168.3, 193.9, 191.7, -3.01], [919.4, 1133.4, 193.7, 189.3, -11.31],
      [158.5, 1458.4, 195.3, 199.4, 9.78], [416.9, 1491.1, 195.6, 192.4, 2.68], [677.9, 1489.3, 194.4, 191.3, -3.72], [924.6, 1455.6, 192.7, 193.5, -9.87]]
  };
  const HEART = 'M12 20s-7-4.4-8.6-8.6C2.4 8.6 4.2 6 7 6c1.9 0 3.2 1.1 5 3 1.8-1.9 3.1-3 5-3 2.8 0 4.6 2.6 3.6 5.4C19 15.6 12 20 12 20z';
  const SWOOSH = 'M6 12 C 60 5, 150 3, 224 8';
  const INK = '#23324D';

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const babyName = () => (typeof name === 'function' ? name() : 'Baby');
  const photoFor = m => (typeof hubPhotoFor === 'function' ? hubPhotoFor(m) : null);
  const cache = {};
  const img = src => cache[src] || (cache[src] = new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => { delete cache[src]; no(new Error('image')); }; i.src = src; }));
  const fonts = () => (document.fonts && document.fonts.load ? Promise.all([document.fonts.load("600 72px AheadHand"), document.fonts.load('600 22px Figtree')]).catch(() => {}) : Promise.resolve());
  const ease = x => (x < 0 ? 0 : x > 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const clamp = x => (x < 0 ? 0 : x > 1 ? 1 : x);

  // Where each month's photo sits in its frame: the point of the photo at the frame's centre (x, y from 0 to 1) and a zoom.
  // Saved per baby on this device, so the Story and the year collage both use the parent's choice.
  const POS_KEY = () => 'ahead-photo-pos:' + (typeof journeyKey === 'function' ? journeyKey() : 'baby');
  const positions = () => { try { return JSON.parse(localStorage.getItem(POS_KEY())) || {}; } catch (e) { return {}; } };
  const posFor = m => positions()[m] || null;
  const savePos = (m, p) => { try { const all = positions(); all[m] = p; localStorage.setItem(POS_KEY(), JSON.stringify(all)); } catch (e) {} };
  window.storyResetPosition = m => { try { const all = positions(); delete all[m]; localStorage.setItem(POS_KEY(), JSON.stringify(all)); } catch (e) {} };
  // Tall photos start a little above centre, where faces usually are.
  const startPos = im => ({ x: 0.5, y: im && im.height > im.width * 1.05 ? 0.42 : 0.5, z: 1 });
  // Size of the photo in the frame, and how far its centre point may move before an edge shows.
  function fit(im, w, h, z) {
    const k = Math.max(w / im.width, h / im.height) * z, dw = im.width * k, dh = im.height * k;
    return { dw, dh, mx: (dw - w) / (2 * dw), my: (dh - h) / (2 * dh) };
  }
  const keepIn = (p, f) => ({ x: Math.min(0.5 + f.mx, Math.max(0.5 - f.mx, p.x)), y: Math.min(0.5 + f.my, Math.max(0.5 - f.my, p.y)), z: p.z });

  // A photo cropped to fill a tilted window, the way it would sit in a polaroid.
  function drawPhoto(ctx, im, cx, cy, w, h, deg, alpha = 1, zoom = 1, pos = null) {
    if (!im || alpha <= 0) return;
    const p0 = pos || startPos(im), f = fit(im, w, h, p0.z || 1), p = keepIn(p0, f);
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(cx, cy); ctx.rotate(deg * Math.PI / 180); ctx.scale(zoom, zoom);
    ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
    ctx.drawImage(im, -f.dw / 2 + f.dw * (0.5 - p.x), -f.dh / 2 + f.dh * (0.5 - p.y), f.dw, f.dh);
    ctx.restore();
  }
  function footer(ctx, x, y, align, dot, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = '#7A7470'; ctx.font = '600 22px Figtree, system-ui, sans-serif'; ctx.textBaseline = 'middle';
    const text = 'Made with Ahead', tw = ctx.measureText(text).width, x0 = align === 'center' ? x - (tw + 16) / 2 : x;
    ctx.fillText(text, x0, y); ctx.fillStyle = dot; ctx.beginPath(); ctx.arc(x0 + tw + 12, y + 1, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  /* ---------- one month ---------- */
  async function renderMonth(m) {
    const L = MONTHS[m]; await fonts();
    const [bg, tape, photo] = await Promise.all([img(`assets/share/month-${m}.jpg`), img(`assets/share/tape-${m}.png`), photoFor(m) ? img(photoFor(m)) : null]);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#F5E8E2'; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(bg, L.b[0], L.b[1], L.b[2], L.b[3]);
    drawPhoto(ctx, photo, L.p[0], L.p[1], L.p[2] + 3, L.p[3] + 3, L.t, 1, 1, posFor(m));
    ctx.drawImage(tape, L.tp[0], L.tp[1], L.tp[2], L.tp[3]);
    // The handwriting: "[Name] is five months", a small heart and an underline in the month's color.
    ctx.save(); ctx.translate(L.s[0], L.s[1]); ctx.rotate(L.t * Math.PI / 180);
    const text = m === 0 ? babyName() : m === 12 ? `${babyName()} is one!` : `${babyName()} is ${WORDS[m - 1]}`;
    let size = 72; ctx.font = `600 ${size}px AheadHand, Caveat, cursive`;
    while (ctx.measureText(text).width > L.s[2] - 90 && size > 40) { size -= 2; ctx.font = `600 ${size}px AheadHand, Caveat, cursive`; }
    const tw = ctx.measureText(text).width, total = m === 0 ? tw : tw + 44, x0 = -total / 2 - (m === 0 ? 40 : 0);
    ctx.fillStyle = INK; ctx.textBaseline = 'middle'; ctx.fillText(text, x0, -10);
    if (m !== 0) { ctx.save(); ctx.translate(x0 + tw + 10, -10 - size * 0.42); ctx.rotate(8 * Math.PI / 180); ctx.scale(34 / 24, 34 / 24);
    ctx.strokeStyle = L.accent; ctx.lineWidth = 1.8 * 24 / 34; ctx.lineJoin = 'round'; ctx.stroke(new Path2D(HEART)); ctx.restore(); }
    ctx.save(); ctx.translate(m === 0 ? Math.max(-115, x0 + tw / 2 - 115) : -115, 22); ctx.strokeStyle = L.accent; ctx.globalAlpha = 0.8; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke(new Path2D(SWOOSH)); ctx.restore();
    ctx.restore();
    footer(ctx, 60, H - 62, 'left', L.accent);
    return c;
  }

  /* ---------- the year ---------- */
  async function yearParts() {
    await fonts();
    const [bg, tape] = await Promise.all([img('assets/share/year.jpg'), img('assets/share/year-tape.png')]);
    const photos = await Promise.all(Array.from({ length: 12 }, (_, i) => (photoFor(i + 1) ? img(photoFor(i + 1)).catch(() => null) : null)));
    return { bg, tape, photos };
  }
  function drawLabel(ctx, i, alpha) {
    const [x, y, , h, a] = YEAR.p[i], t = a * Math.PI / 180, off = h / 2 + 30;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x - Math.sin(t) * off, y + Math.cos(t) * off); ctx.rotate(t);
    ctx.fillStyle = INK; ctx.font = '600 38px AheadHand, Caveat, cursive'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(i + 1), 0, 0); ctx.restore();
  }
  // shown(i) → [alpha, zoom] for photo i; the still uses 1 for every photo it has.
  function drawYear(ctx, parts, shown) {
    ctx.fillStyle = '#F8EBE5'; ctx.fillRect(-W, -H, W * 3, H * 3);
    ctx.drawImage(parts.bg, YEAR.b[0], YEAR.b[1], YEAR.b[2], YEAR.b[3]);
    YEAR.p.forEach((q, i) => {
      if (!parts.photos[i]) return;
      const [a, z, la] = shown(i);
      drawPhoto(ctx, parts.photos[i], q[0], q[1], q[2], q[3], q[4], a, z, posFor(i + 1));
      if (la > 0) drawLabel(ctx, i, la);
    });
    ctx.drawImage(parts.tape, YEAR.tp[0], YEAR.tp[1], YEAR.tp[2], YEAR.tp[3]);
  }
  async function renderYear() {
    const parts = await yearParts();
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    drawYear(ctx, parts, () => [1, 1, 1]);
    footer(ctx, W / 2, H - 70, 'center', '#E0B54A');
    return c;
  }
  // The video: the whole scene, then the camera visits each month as its photo lands, then pulls back.
  function yearTimeline(parts) {
    const months = parts.photos.map((p, i) => (p ? i : -1)).filter(i => i > -1);
    const start = 1.6, per = 1.1, Z = 2.6;
    const visit = months.map((i, k) => ({ i, t: start + k * per }));
    const back = start + months.length * per, end = back + 4.6;
    const target = k => (k < 0 || k >= visit.length ? { s: 1, x: W / 2, y: H / 2 } : { s: Z, x: YEAR.p[visit[k].i][0], y: YEAR.p[visit[k].i][1] + 25 });
    function camera(t) {
      let k = -1; visit.forEach((v, n) => { if (t >= v.t) k = n; });
      if (t >= back) k = visit.length;
      const from = target(k - 1), to = target(k), t0 = k < 0 ? 0 : k === visit.length ? back : visit[k].t, dur = k === visit.length ? 1.4 : 0.7;
      const e = k < 0 ? 1 : ease((t - t0) / dur);
      return { s: from.s + (to.s - from.s) * e, x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
    }
    const landed = {}; visit.forEach(v => { landed[v.i] = v.t; });
    function frame(ctx, t) {
      const cam = camera(t);
      ctx.setTransform(cam.s, 0, 0, cam.s, W / 2 - cam.s * cam.x, H / 2 - cam.s * cam.y);
      drawYear(ctx, parts, i => {
        const t0 = landed[i]; if (t0 == null) return [0, 1, 0];
        const a = clamp((t - t0 - 0.3) / 0.5), la = clamp((t - t0 - 0.55) / 0.4);
        return [a, 1.14 - 0.14 * ease(a), la];
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      footer(ctx, W / 2, H - 70, 'center', '#E0B54A', clamp((t - back - 1.2) / 0.6));
    }
    return { frame, end };
  }

  /* ---------- sharing ---------- */
  const fileName = m => `${babyName().replace(/[^\w-]+/g, '-')}-${m === 'year' ? 'first-year' : m === 0 ? 'newborn' : m + '-months'}`;
  async function shareOrSave(blob, base, mode) {
    const ext = /mp4/.test(blob.type) ? 'mp4' : /webm/.test(blob.type) ? 'webm' : 'png';
    const file = new File([blob], `${base}.${ext}`, { type: blob.type });
    if (mode === 'share' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file] }); return 'shared'; } catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; }
    }
    // Inside Claude (the tappable preview), files go through Claude's own save prompt; on iPhone that opens the share sheet.
    const downloads = window.claude && typeof window.claude.use === 'function' ? await window.claude.use('downloads').catch(() => null) : null;
    if (downloads) {
      try { await downloads.save({ filename: file.name, data: blob }); return 'handed'; } catch (e) { return e && e.code === 'declined' ? 'cancelled' : 'failed'; }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    return 'saved';
  }
  const pngOf = c => new Promise(ok => c.toBlob(ok, 'image/png'));
  function videoType() {
    if (typeof MediaRecorder === 'undefined') return null;
    return ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) || null;
  }

  /* ---------- the sheet ---------- */
  let sheet = null, raf = 0;
  function close() { cancelAnimationFrame(raf); raf = 0; if (sheet) { sheet.remove(); sheet = null; } document.removeEventListener('keydown', onKey); }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function toast(title, body) { if (typeof hubToast === 'function') hubToast(title, body); }

  window.storyShare = async function (m, opts = {}) {
    if (m !== 'year' && !(m >= 0 && m <= 12)) return;
    if (m !== 'year' && !photoFor(m)) return;
    close();
    const nm = esc(babyName()), isYear = m === 'year';
    const have = isYear ? Array.from({ length: 12 }, (_, i) => photoFor(i + 1)).filter(Boolean).length : 1;
    sheet = document.createElement('div');
    sheet.className = 'story-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', isYear ? `${babyName()}’s first year` : m === 0 ? `${babyName()}’s newborn photo` : `${babyName()}’s ${m}-month photo`);
    const eyebrow = opts.saved ? 'Photo saved · Ready for your Story' : isYear ? 'Happy first birthday' : m === 0 ? 'Newborn' : m === 12 ? '1 year' : `${m} month${m === 1 ? '' : 's'}`;
    const title = isYear ? `${nm}’s first year` : m === 0 ? `Hello, ${nm}` : m === 12 ? `${nm} is one!` : `${nm} is ${WORDS[m - 1]}`;
    const note = isYear
      ? (have < 12 ? `${12 - have} month${12 - have === 1 ? ' doesn’t' : 's don’t'} have a photo yet. Add ${12 - have === 1 ? 'it' : 'them'} in Memories and they’ll appear here.` : 'All twelve months, on one page.')
      : 'Drag the photo to move it, and zoom if you like. Then share it to your Story or send it to family.';
    // Phones that can share files get Share and Save; anywhere else, one Save button.
    let canShareFiles = false; try { canShareFiles = !!(navigator.canShare && navigator.canShare({ files: [new File(['x'], 'x.png', { type: 'image/png' })] })); } catch (e) {}
    sheet.innerHTML = `<div class="story-card"><button class="story-close" aria-label="Close">×</button>
      <p class="story-eyebrow">${eyebrow}</p><h2>${title}</h2>
      ${isYear && have ? `<div class="story-seg" role="group" aria-label="Photo or video"><button class="is-on" data-kind="photo" aria-pressed="true">Photo</button><button data-kind="video" aria-pressed="false">Video</button></div>` : ''}
      <div class="story-frame"><canvas width="${W}" height="${H}" aria-label="${isYear ? 'Your first-year collage' : 'Your monthly photo'}"></canvas><div class="story-busy" hidden><span></span></div></div>
      ${isYear ? '' : `<div class="story-adjust"><label for="storyZoom">Zoom</label><input id="storyZoom" type="range" min="1" max="2.5" step="0.01" value="1"><label class="story-change" role="button">Change photo${typeof hubPhotoInput === 'function' ? hubPhotoInput(m) : ''}</label></div>`}
      <div class="story-actions${canShareFiles ? '' : ' is-single'}">${canShareFiles ? '<button class="story-btn" data-act="share">Share</button><button class="story-btn is-quiet" data-act="save">Save</button>' : '<button class="story-btn" data-act="save">Save</button>'}</div>
      <p class="story-note">${esc(note)}</p></div>`;
    document.body.appendChild(sheet);
    document.addEventListener('keydown', onKey);
    sheet.addEventListener('click', e => { if (e.target === sheet) close(); });
    sheet.querySelector('.story-close').onclick = close;
    const view = sheet.querySelector('canvas'), vctx = view.getContext('2d');
    const busy = sheet.querySelector('.story-busy'), busyText = busy.querySelector('span');
    const setBusy = text => { busy.hidden = !text; busyText.textContent = text || ''; sheet.querySelectorAll('.story-btn, .story-seg button').forEach(b => { b.disabled = !!text; }); };
    let kind = 'photo', still = null, parts = null, tl = null;
    const mine = sheet;
    try {
      setBusy('Making it…');
      still = isYear ? await renderYear() : await renderMonth(m);
      if (sheet !== mine) return;
      vctx.drawImage(still, 0, 0); setBusy('');
    } catch (e) { setBusy(''); toast('Couldn’t make it', 'Try again, or pick another photo.'); return close(); }
    if (isYear && !have) sheet.querySelectorAll('.story-btn').forEach(b => { b.disabled = true; });

    // Move the photo inside the polaroid: drag on the picture, zoom with the slider. Saved for this month.
    if (!isYear) {
      const L = MONTHS[m], photo = await img(photoFor(m)), w = L.p[2] + 3, h = L.p[3] + 3, t = L.t * Math.PI / 180;
      let pos = posFor(m) || startPos(photo), pending = false, drag = null;
      const zoomEl = sheet.querySelector('#storyZoom'); zoomEl.value = String(pos.z || 1);
      const redraw = () => { if (pending) return; pending = true; requestAnimationFrame(async () => { pending = false; savePos(m, pos); still = await renderMonth(m); if (sheet === mine) vctx.drawImage(still, 0, 0); }); };
      zoomEl.oninput = () => { pos = keepIn({ x: pos.x, y: pos.y, z: Number(zoomEl.value) }, fit(photo, w, h, Number(zoomEl.value))); redraw(); };
      view.classList.add('is-movable');
      view.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, p: { ...pos } }; view.setPointerCapture(e.pointerId); });
      view.addEventListener('pointermove', e => {
        if (!drag) return;
        const scale = W / view.clientWidth, dx = (e.clientX - drag.x) * scale, dy = (e.clientY - drag.y) * scale;
        const rx = dx * Math.cos(t) + dy * Math.sin(t), ry = -dx * Math.sin(t) + dy * Math.cos(t), f = fit(photo, w, h, pos.z || 1);
        pos = keepIn({ x: drag.p.x - rx / f.dw, y: drag.p.y - ry / f.dh, z: pos.z || 1 }, f); redraw();
      });
      const end = () => { drag = null; };
      view.addEventListener('pointerup', end); view.addEventListener('pointercancel', end);
    }

    // Video preview: plays on a loop until the sheet closes or switches back to the photo.
    const play = () => {
      cancelAnimationFrame(raf); const t0 = performance.now();
      const tick = now => { const t = ((now - t0) / 1000) % (tl.end + 0.4); tl.frame(vctx, Math.min(t, tl.end)); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    };
    sheet.querySelectorAll('.story-seg button').forEach(b => b.onclick = async () => {
      kind = b.dataset.kind;
      sheet.querySelectorAll('.story-seg button').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      if (kind === 'photo') { cancelAnimationFrame(raf); vctx.setTransform(1, 0, 0, 1, 0, 0); vctx.drawImage(still, 0, 0); return; }
      if (!parts) { parts = await yearParts(); tl = yearTimeline(parts); }
      play();
    });

    // Record the video in real time from the same drawing, then share it.
    async function recordVideo() {
      const type = videoType();
      if (!type || !view.captureStream) { toast('Video isn’t supported here', 'Open Ahead in Safari or Chrome to save the video, or share the photo.'); return null; }
      cancelAnimationFrame(raf);
      const stream = view.captureStream(30), rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 6e6 }), chunks = [];
      rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      const done = new Promise(ok => { rec.onstop = ok; });
      rec.start(250);
      const t0 = performance.now();
      await new Promise(ok => {
        const tick = now => {
          const t = (now - t0) / 1000; tl.frame(vctx, Math.min(t, tl.end));
          setBusy(`Making the video… ${Math.max(1, Math.ceil(tl.end - t))}s`);
          if (t < tl.end + 0.3 && sheet === mine) raf = requestAnimationFrame(tick); else ok();
        };
        raf = requestAnimationFrame(tick);
      });
      rec.stop(); await done; setBusy('');
      if (sheet !== mine) return null;
      play();
      return new Blob(chunks, { type: type.split(';')[0] });
    }
    sheet.querySelectorAll('.story-btn').forEach(b => b.onclick = async () => {
      const mode = b.dataset.act;
      const blob = kind === 'video' ? await recordVideo() : await pngOf(still);
      if (!blob) return;
      const r = await shareOrSave(blob, fileName(m), mode);
      if (r === 'saved') toast('Saved', kind === 'video' ? 'The video is in your downloads.' : 'The photo is in your downloads.');
      if (r === 'failed') toast('Couldn’t save it', 'Try again, or take a screenshot of the photo.');
    });
    setTimeout(() => { const btn = sheet && sheet.querySelector('.story-btn'); if (btn) btn.focus(); }, 50);
  };

  // Small copies of each month's Story for Memories, made once and kept until the photo, its position or the name changes.
  const thumbs = {};
  const thumbKey = m => {
    const ph = m === 'year' ? Array.from({ length: 12 }, (_, i) => (photoFor(i + 1) || '').length).join('.') : String((photoFor(m) || '').length) + (photoFor(m) || '').slice(-24);
    return [m, babyName(), ph, JSON.stringify(m === 'year' ? positions() : posFor(m))].join('|');
  };
  async function thumb(m) {
    const key = thumbKey(m);
    if (thumbs[m] && thumbs[m].key === key) return thumbs[m].url;
    const full = m === 'year' ? await renderYear() : await renderMonth(m);
    const c = document.createElement('canvas'); c.width = 360; c.height = 640;
    c.getContext('2d').drawImage(full, 0, 0, 360, 640);
    const url = c.toDataURL('image/jpeg', 0.86);
    thumbs[m] = { key, url };
    return url;
  }
  window.storyHydrate = function (root = document) {
    root.querySelectorAll('img[data-story-thumb]').forEach(el => {
      const m = el.dataset.storyThumb === 'year' ? 'year' : Number(el.dataset.storyThumb);
      if (m !== 'year' && !(m >= 0 && m <= 12)) return;
      thumb(m).then(url => { if (el.isConnected) { el.src = url; el.classList.add('is-ready'); } }).catch(() => {});
    });
  };

  // For checks and for anything that needs the picture without the sheet.
  window.storyRender = m => (m === 'year' ? renderYear() : renderMonth(m));
  window.storyYearFrame = async t => { const p = await yearParts(), tl = yearTimeline(p), c = document.createElement('canvas'); c.width = W; c.height = H; tl.frame(c.getContext('2d'), t); return c; };
})();
