/* Ahead · Month stories: a short story for each month birthday, opened from Home's month card.
   A Wrapped-style story behind Home's month card: one idea per screen, setup then payoff,
   auto-advancing with tap to skip and hold to pause, ending on a card worth keeping. */
(function () {
  'use strict';
  var on = function () { return true; };
  var E = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var nm = function () { try { return profile.name || 'Your baby'; } catch (e) { return 'Your baby'; } };
  var PR = function () {
    var p = (profile && profile.pronouns) || 'she';
    return p === 'he' ? { s: 'he', S: 'He', o: 'him', p: 'his', P: 'His', SS: 'He’s' } : p === 'they' ? { s: 'they', S: 'They', o: 'them', p: 'their', P: 'Their', SS: 'They’re' } : { s: 'she', S: 'She', o: 'her', p: 'her', P: 'Her', SS: 'She’s' };
  };
  var daysOld = function () { try { var d = new Date(profile.dob + 'T00:00:00'); return Math.max(1, Math.round((Date.now() - d) / 864e5)); } catch (e) { return 122; } };
  var fmt = function (n) { return n.toLocaleString('en-US'); };

  /* ---------- The month-4 story ---------- */
  /* ---------- Soft "clay" objects, drawn in Ahead's colors ---------- */
  var uid = 0;
  function blob(fill, light, dark) {
    // A radial gradient that reads as a soft, matte 3D surface.
    var id = 'cg' + (++uid);
    return { id: id, def: '<radialGradient id="' + id + '" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="' + light + '"/><stop offset=".55" stop-color="' + fill + '"/><stop offset="1" stop-color="' + dark + '"/></radialGradient>', url: 'url(#' + id + ')' };
  }
  function svg(vb, defs, body, cls) { return '<svg class="' + (cls || 'st-obj') + '" viewBox="' + vb + '" aria-hidden="true"><defs>' + defs + '</defs>' + body + '</svg>'; }
  var shadow = function (cx, cy, rx) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + (rx * .16) + '" fill="#2B2840" opacity=".12"/>'; };

  function bunny() {
    var w = blob('#fff3e6', '#ffffff', '#ecd6c3'), p = blob('#f6c2cf', '#fbdbe3', '#e9a2b5');
    return svg('0 0 200 200', w.def + p.def,
      '<g class="st-bob"><ellipse cx="72" cy="58" rx="20" ry="52" transform="rotate(-14 72 58)" fill="' + w.url + '"/><ellipse cx="73" cy="62" rx="8" ry="34" transform="rotate(-14 73 62)" fill="' + p.url + '"/>' +
      '<ellipse cx="128" cy="58" rx="20" ry="52" transform="rotate(14 128 58)" fill="' + w.url + '"/><ellipse cx="127" cy="62" rx="8" ry="34" transform="rotate(14 127 62)" fill="' + p.url + '"/>' +
      '<ellipse cx="100" cy="140" rx="62" ry="56" fill="' + w.url + '"/>' +
      '<circle cx="80" cy="134" r="5" fill="#2B2840"/><circle cx="120" cy="134" r="5" fill="#2B2840"/><path d="M95 150l10 8M105 150l-10 8" stroke="#2B2840" stroke-width="3.5" stroke-linecap="round"/>' +
      '<ellipse cx="70" cy="152" rx="9" ry="5" fill="#f6c2cf" opacity=".7"/><ellipse cx="130" cy="152" rx="9" ry="5" fill="#f6c2cf" opacity=".7"/></g>');
  }
  function rings() {
    var c = blob('#e98a6b', '#f6b39a', '#c96a4e'), l = blob('#b9a6e6', '#d9cdf5', '#9682c9'), y = blob('#ffd98a', '#fff0c4', '#e9b85a'), b = blob('#f3a587', '#fbd0bf', '#da7f61'), pole = blob('#fff3e6', '#fff', '#e8d4c0');
    return svg('0 0 200 220', c.def + l.def + y.def + b.def + pole.def,
      shadow(100, 206, 74) +
      '<rect x="92" y="40" width="16" height="150" rx="8" fill="' + pole.url + '"/>' +
      '<g class="st-stack" style="--i:0"><ellipse cx="100" cy="182" rx="70" ry="24" fill="' + c.url + '"/></g>' +
      '<g class="st-stack" style="--i:1"><ellipse cx="100" cy="148" rx="56" ry="20" fill="' + l.url + '"/></g>' +
      '<g class="st-stack" style="--i:2"><ellipse cx="100" cy="118" rx="44" ry="17" fill="' + y.url + '"/></g>' +
      '<g class="st-stack" style="--i:3"><circle cx="100" cy="80" r="26" fill="' + b.url + '"/></g>');
  }
  function hand(flip) {
    var sk = blob('#f3b48f', '#fbd3bb', '#de946d'), cuff = blob('#fff3e6', '#ffffff', '#e8d6c4');
    var g = '<g' + (flip ? ' transform="translate(200 0) scale(-1 1)"' : '') + '>' +
      '<rect x="62" y="96" width="22" height="58" rx="11" transform="rotate(-22 73 125)" fill="' + sk.url + '"/>' + // thumb
      '<rect x="80" y="40" width="20" height="80" rx="10" transform="rotate(-8 90 80)" fill="' + sk.url + '"/>' +
      '<rect x="100" y="30" width="20" height="88" rx="10" fill="' + sk.url + '"/>' +
      '<rect x="120" y="36" width="20" height="84" rx="10" transform="rotate(7 130 78)" fill="' + sk.url + '"/>' +
      '<rect x="138" y="52" width="18" height="70" rx="9" transform="rotate(16 147 87)" fill="' + sk.url + '"/>' +
      '<rect x="74" y="92" width="84" height="88" rx="40" fill="' + sk.url + '"/>' +
      '<rect x="66" y="166" width="100" height="60" rx="22" fill="' + cuff.url + '"/>' +
      '<path d="M84 176v40M100 176v40M116 176v40M132 176v40M148 176v40" stroke="#e6d3c0" stroke-width="5" stroke-linecap="round"/></g>';
    return svg('0 0 200 230', sk.def + cuff.def, g, 'st-obj st-handobj');
  }
  function teether() {
    var wood = blob('#e9c9a2', '#f6e3c9', '#cfa77a'), bead = blob('#b9a6e6', '#ddd2f7', '#8f7bc4');
    var beads = ''; [[150, 62], [172, 92], [168, 128], [144, 152]].forEach(function (b, i) { beads += '<circle class="st-bead" style="--i:' + i + '" cx="' + b[0] + '" cy="' + b[1] + '" r="22" fill="' + bead.url + '"/>'; });
    return svg('0 0 220 210', wood.def + bead.def,
      shadow(110, 196, 80) + '<circle cx="104" cy="112" r="64" fill="none" stroke="' + wood.url + '" stroke-width="30"/>' + beads);
  }
  function moon() {
    var m = blob('#ffe08f', '#fff4cc', '#e9bf5b');
    return svg('0 0 120 120', m.def, '<path d="M78 14a46 46 0 1 0 28 72A38 38 0 1 1 78 14Z" fill="' + m.url + '"/>', 'st-obj st-moon');
  }
  function ball() {
    var a = blob('#7fae95', '#a9d0bb', '#5b8c73'), y = blob('#ffe08f', '#fff4cc', '#e9bf5b');
    return svg('0 0 160 160', a.def + y.def, '<clipPath id="bc"><circle cx="80" cy="80" r="62"/></clipPath>' +
      '<g class="st-ball"><circle cx="80" cy="80" r="62" fill="' + a.url + '"/><path clip-path="url(#bc)" d="M18 30 Q70 60 60 150 L-10 150 Z" fill="' + y.url + '"/></g>');
  }
  function bottle() {
    var milk = blob('#fffaf0', '#ffffff', '#ead9c4'), cap = blob('#b9a6e6', '#ddd2f7', '#8f7bc4'), tip = blob('#f3c9a6', '#fbe3cf', '#dca47c');
    return svg('0 0 140 230', milk.def + cap.def + tip.def,
      shadow(70, 220, 46) + '<path d="M58 22q12-24 24 0v26H58Z" fill="' + tip.url + '"/>' +
      '<rect x="34" y="44" width="72" height="34" rx="14" fill="' + cap.url + '"/>' +
      '<rect x="28" y="72" width="84" height="142" rx="34" fill="' + milk.url + '"/>' +
      '<path d="M44 120h20M44 146h28M44 172h20" stroke="#cdbba6" stroke-width="5" stroke-linecap="round"/>', 'st-obj st-bottle');
  }
  function cloud(fill, cls) { return '<svg class="' + (cls || 'st-cloud') + '" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120V70q40-50 100-30 30-40 90-20 50-40 110 0 60-20 100 30v70Z" fill="' + fill + '"/></svg>'; }
  function burst(color) { return '<svg class="st-burst" viewBox="0 0 40 40" aria-hidden="true"><g stroke="' + color + '" stroke-width="4.5" stroke-linecap="round"><path d="M8 26l-6 3M14 14L9 7M26 10l2-8"/></g></svg>'; }

  /* ---------- What the parent has already shared ---------- */
  var addM = function (d, m) { var x = new Date(d); x.setMonth(x.getMonth() + m); return x; };
  var iso = function (d) { return d.toISOString().slice(0, 10); };
  function photoNow() { try { return typeof hubPhotoFor === 'function' ? hubPhotoFor(month()) : null; } catch (e) { return null; } }
  var month = function () { try { return homeMonth(); } catch (e) { return 4; } };
  var NICE = [[/laugh|chuckle/i, 'First laugh'], [/roll/i, 'First roll'], [/smil/i, 'First smile'], [/tooth/i, 'First tooth'], [/sits?|sitting|\bsat\b/i, 'Sitting up'], [/crawl/i, 'First crawl'], [/word|mama|dada/i, 'First word'], [/step|walk/i, 'First steps']];
  function firstsThisMonth() {
    try {
      var dob = new Date(profile.dob + 'T00:00:00'), m = month(), from = iso(addM(dob, Math.max(0, m - 1))), to = iso(addM(dob, m));
      return (journeyData().records || []).filter(function (r) { return r.type === 'milestone' && r.status === 'attended' && r.date >= from && r.date < to && (!window.memIsBig || memIsBig(r)); })
        .map(function (r) { var k = NICE.filter(function (x) { return x[0].test(r.title); })[0]; return k ? k[1] : r.title; })
        .filter(function (t, i, a) { return a.indexOf(t) === i; }).slice(0, 3);
    } catch (e) { return []; }
  }
  function slides4(n, p, days, pic, firsts, nx) {
    var list = [
      { id: 'cover', bg: '#2B2840', ink: '#fffaf3', dur: 3600, html:
        '<i class="st-sun"></i><i class="st-star">★</i><i class="st-dotc"></i>' +
        '<p class="st-kicker st-in" style="--d:.05s">' + E(n) + '’s month</p>' +
        '<div class="st-giant st-pop" style="--d:.15s">4</div>' +
        '<div class="st-title st-cover-t st-in" style="--d:.45s">' + E(p.SS) + ' done just watching.</div>' +
        '<p class="st-lead st-in" style="--d:.75s">The world is getting a lot more interesting.</p>' +
        '<div class="st-ground">' + cloud('#b9a6e6') + (pic ? '<div class="st-photo"><img src="' + pic + '" alt=""></div>' : '<div class="st-peek">' + bunny() + '</div>') + '</div>' },


      { id: 'reveal', bg: '#cfc3ea', ink: '#2B2840', dur: 5200, html:
        '<p class="st-setup2 st-in" style="--d:.05s">This month, ' + E(p.s) + ' discovered something big…</p>' +
        '<div class="st-title st-title-xl st-pop" style="--d:1s">' + E(p.P) + ' hands!</div>' +
        '<p class="st-lead st-in" style="--d:1.5s">Now ' + E(p.s) + '’s studying them like they’re the most fascinating thing ' + E(p.s) + '’s ever seen.</p>' +
        '<div class="st-hands"><span class="st-h st-hl">' + hand(false) + '</span><span class="st-h st-hr">' + hand(true) + '</span>' + burst('#fffaf3') + '</div>' },

      { id: 'beat', bg: '#ffe7a6', ink: '#2B2840', dur: 5200, html:
        '<div class="st-beats"><span style="--d:.1s">See it.</span><span style="--d:.4s">Swipe at it.</span><span class="st-beat-last" style="--d:.7s">Hold it.</span></div>' +
        '<p class="st-body st-in" style="--d:1.2s">' + E(p.P) + ' eyes and hands are starting to work together. That’s how ' + E(p.s) + ' learns what things are.</p>' +
        '<div class="st-ground">' + cloud('#fff3cf') + '<div class="st-objwrap st-right st-wobble">' + teether() + burst('#e98a6b') + '</div></div>' },

      screen({ t: 'topic', c: 'sage', kicker: 'Through her eyes', title: 'Now she sees depth.', body: 'Both eyes work as a team, so she can judge how far away a toy is.', vis: ['eyes', 4] }),

      { id: 'feed', bg: '#f2b6c8', ink: '#2B2840', dur: 5800, html:
        '<p class="st-kicker st-in" style="--d:.05s">Meanwhile, at feeds</p>' +
        '<div class="st-title st-pop" style="--d:.15s">Milk has competition.</div>' +
        '<div class="st-distract"><span style="--d:.7s">the dog</span><span style="--d:.9s">your face</span><span style="--d:1.1s">the ceiling fan</span><span class="is-you" style="--d:1.3s">the room</span></div>' +
        '<p class="st-body st-in" style="--d:1.8s">' + E(p.S) + ' pops off mid-feed to look around. Milk didn’t change. The world got more interesting.</p>' +
        '<p class="st-tip st-in" style="--d:2.6s">' + burst('#e98a6b') + 'A quiet, dim spot can help.</p>' +
        '<div class="st-ground">' + cloud('#f8cfdb') + '<div class="st-objwrap st-right st-tilt st-bottlewrap">' + bottle() + '</div></div>' },

      { id: 'sleep', bg: '#2f3a66', ink: '#fffaf3', dur: 6000, html:
        '<div class="st-sky"><i></i><i></i><i></i><i></i><i></i></div><div class="st-moonwrap">' + moon() + '</div>' +
        '<p class="st-kicker st-in" style="--d:.05s">And after dark</p>' +
        '<div class="st-title st-pop" style="--d:.15s">Plot twist: nights may get bumpier.</div>' +
        '<svg class="st-wave" viewBox="0 0 320 70" aria-hidden="true"><path pathLength="100" d="M6 56 C 30 56, 36 14, 62 14 S 92 56, 116 56 S 146 14, 170 14 S 200 56, 224 56 S 254 14, 278 14 S 306 48, 314 52"/>' +
        '<circle cx="62" cy="14" r="5"/><circle cx="170" cy="14" r="5"/><circle cx="278" cy="14" r="5"/></svg>' +
        '<p class="st-body st-in" style="--d:1.5s">' + E(p.P) + ' sleep is switching to grown-up cycles. More waking now can mean sleep is maturing, not going backwards.</p>' +
        '<div class="st-ground">' + cloud('#8e9fd6') + '</div>' },

      nextScreen(nx),
      null,
      { id: 'days', bg: '#f6c9a8', ink: '#2B2840', dur: firsts.length ? 6200 : 4800, html:
        '<p class="st-lead st-in" style="--d:.05s"><b>' + E(n) + ' has been here for</b></p>' +
        '<div class="st-count st-pop" style="--d:.2s"><b data-count="' + days + '">0</b><span>' + (days === 1 ? 'day' : 'days') + ' Earthside.</span></div>' +
        (firsts.length ? '<div class="st-lastm st-in" style="--d:1.6s"><p class="st-kicker">Last month, you saw</p><div class="st-chips">' + firsts.map(function (f) { return '<span><i>★</i>' + E(f) + '</span>'; }).join('') + '</div></div>'
          : '<p class="st-hand st-in" style="--d:1.7s">' + E(daysLine(days)) + '</p>') +
        '<div class="st-ground' + (firsts.length ? ' st-ground-sm' : '') + '">' + cloud('#fbe0cc') + '<div class="st-objwrap st-right">' + rings() + burst('#fff6ec') + '</div></div>' },

      { id: 'summary', bg: '#2B2840', ink: '#fffaf3', dur: 0, html:
        '<div class="st-card st-pop" style="--d:.05s">' +
          (pic ? '<div class="st-card-photo"><img src="' + pic + '" alt=""></div>' : '') +
          '<div class="st-card-title">' + E(n) + ' at 4 months</div>' +
          '<p class="st-card-days">' + fmt(days) + (days === 1 ? ' day' : ' days') + ' Earthside</p>' +
          '<div class="st-card-sec"><p class="st-card-k">This month</p><ol>' +
            '<li><i style="background:#cfc3ea"></i>Found ' + E(p.p) + ' hands</li><li><i style="background:#f2b6c8"></i>Distracted feeds</li><li><i style="background:#8e9fd6"></i>Sleep is maturing</li></ol></div>' +
          (firsts.length ? '<div class="st-card-sec"><p class="st-card-k">Last month’s firsts</p><div class="st-chips">' + firsts.map(function (f) { return '<span><i>★</i>' + E(f) + '</span>'; }).join('') + '</div></div>' : '') +
          '<div class="st-card-sec st-card-next"><p class="st-card-k">Coming up</p><b>' + E(nx.title.replace(/\.$/, '')) + '</b></div>' +
        '</div>' +
        '<div class="st-card-actions st-in" style="--d:.4s"><button class="st-btn is-quiet" data-act="replay">Watch again</button><button class="st-btn" data-act="done">Done</button></div>' }
    ];
    // Right after her days: a look back at last month's firsts, only if the parent saved any.
    var at = list.indexOf(null);
    list.splice(at, 1);
    return list;
  }

  /* ---------- More soft toys for the other months ---------- */
  function bowl() {
    var b = blob('#f6c2cf', '#fbdbe3', '#df9cb0'), sp = blob('#ffd98a', '#fff1c8', '#e3b259'), food = blob('#ffe7a6', '#fff6d8', '#efc96d');
    return svg('0 0 220 200', b.def + sp.def + food.def, shadow(110, 186, 82) +
      '<rect x="128" y="10" width="18" height="96" rx="9" transform="rotate(24 137 58)" fill="' + sp.url + '"/>' +
      '<ellipse cx="110" cy="104" rx="84" ry="22" fill="' + food.url + '"/>' +
      '<path d="M26 104h168q0 76-84 76T26 104Z" fill="' + b.url + '"/>');
  }
  function cup() {
    var c = blob('#b9a6e6', '#ddd2f7', '#8f7bc4'), lid = blob('#fff3e6', '#ffffff', '#e8d6c4'), sp = blob('#ffd98a', '#fff1c8', '#e3b259');
    return svg('0 0 220 230', c.def + lid.def + sp.def, shadow(110, 216, 62) +
      '<path d="M96 20q14-14 28 0l6 26H90Z" fill="' + sp.url + '"/>' +
      '<rect x="56" y="42" width="108" height="34" rx="16" fill="' + lid.url + '"/>' +
      '<rect x="62" y="70" width="96" height="140" rx="30" fill="' + c.url + '"/>' +
      '<path d="M62 104q-38 4-38 36t38 34" fill="none" stroke="' + lid.url + '" stroke-width="16" stroke-linecap="round"/>' +
      '<path d="M158 104q38 4 38 36t-38 34" fill="none" stroke="' + lid.url + '" stroke-width="16" stroke-linecap="round"/>');
  }
  function blocks() {
    var a = blob('#e98a6b', '#f6b39a', '#c96a4e'), b = blob('#7fae95', '#a9d0bb', '#5b8c73'), c = blob('#ffd98a', '#fff0c4', '#e9b85a');
    var face = function (x, y, s, f, t, col) { return '<g class="st-stack" style="--i:' + t + '"><rect x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" rx="18" fill="' + f + '"/><text x="' + (x + s / 2) + '" y="' + (y + s * .68) + '" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="' + (s * .52) + '" fill="' + col + '">' + ['A', 'B', 'C'][t] + '</text></g>'; };
    return svg('0 0 240 230', a.def + b.def + c.def, shadow(120, 220, 100) + face(24, 120, 96, a.url, 0, '#fffaf3') + face(122, 120, 96, b.url, 1, '#fffaf3') + face(72, 24, 96, c.url, 2, '#c4502f'));
  }
  var OBJ = { bunny: bunny, rings: rings, teether: teether, bottle: bottle, ball: ball, bowl: bowl, cup: cup, blocks: blocks };

  /* ---------- Visuals that act out each screen ---------- */
  var V = {
    // A line that climbs to a peak at about 6 weeks, then eases off by 3–4 months.
    peak: function () { return '<svg class="st-vis st-peakchart" viewBox="0 0 320 170" aria-hidden="true"><path class="st-draw" pathLength="100" d="M10 150 C 60 150, 80 30, 120 30 S 200 120, 310 140"/><circle class="st-dotpk" cx="120" cy="30" r="9"/><text x="120" y="14" text-anchor="middle">6 weeks</text><text x="300" y="166" text-anchor="end">3–4 months</text><text x="12" y="166">birth</text></svg>'; },
    // Speech bubbles that take turns, left and right.
    talk: function (words) { return '<div class="st-vis st-talk">' + words.map(function (w, i) { return '<span class="' + (i % 2 ? 'is-r' : 'is-l') + (w === '…' ? ' is-pause' : '') + '" style="--i:' + i + '">' + E(w) + '</span>'; }).join('') + '</div>'; },
    // Bubbles that all come from her.
    voice: function (words) { return '<div class="st-vis st-voice">' + words.map(function (w, i) { return '<span style="--i:' + i + ';--x:' + [8, 52, 24, 64, 4][i % 5] + '%;--r:' + [-8, 6, -3, 9, -6][i % 5] + 'deg">' + E(w) + '</span>'; }).join('') + '</div>'; },
    // Something rising up from below: a head lifting, a baby pulling up.
    // Coming-up screens show the month card's clay baby in that pose, so they don't repeat the bunny.
    pose4: function () { return '<div class="st-vis st-pose">' + babyArt(4) + '</div>'; },
    pose7: function () { return '<div class="st-vis st-pose">' + babyArt(7) + '</div>'; },
    pose10: function () { return '<div class="st-vis st-pose">' + babyArt(10) + '</div>'; },
    // Newborn screens
    lull: function () { return '<div class="st-vis st-lull"><span class="st-lull-b">' + babyArt(0) + '</span><i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i></div>'; },
    clock: function () { var d = ''; for (var i = 0; i < 10; i++) { var a = (i / 10) * Math.PI * 2 - Math.PI / 2; d += '<circle class="st-ck" style="--i:' + i + '" cx="' + (100 + Math.cos(a) * 70).toFixed(1) + '" cy="' + (100 + Math.sin(a) * 70).toFixed(1) + '" r="9" fill="#e98a6b"/>'; }
      var c = blob('#fffaf3', '#ffffff', '#e8dccd'); return '<div class="st-vis st-clock">' + svg('0 0 200 200', c.def, shadow(100, 190, 60) + '<circle cx="100" cy="100" r="86" fill="' + c.url + '"/>' + d + '<path d="M100 100 V58 M100 100 L128 112" stroke="#2B2840" stroke-width="7" stroke-linecap="round"/><circle cx="100" cy="100" r="7" fill="#2B2840"/>') + '</div>'; },
    grip: function () { var sk = blob('#f5c3a0', '#fde3cf', '#de9d79'), pa = blob('#e9b48f', '#f7d3b6', '#c98d68');
      return '<div class="st-vis st-grip">' + svg('0 0 220 140', sk.def + pa.def, shadow(110, 132, 80) +
        '<rect x="96" y="52" width="140" height="40" rx="20" fill="' + pa.url + '"/><ellipse cx="104" cy="72" rx="12" ry="16" fill="#f3c7a8" opacity=".6"/>' +
        '<ellipse cx="96" cy="76" rx="44" ry="38" fill="' + sk.url + '"/><path d="M70 56 q10 -10 20 0 M86 52 q10 -10 20 0 M102 54 q10 -10 18 2" fill="none" stroke="#c98a66" stroke-width="4" stroke-linecap="round"/>') + '</div>'; },
    rise: function () { return '<div class="st-vis st-rise">' + bunny() + '</div>'; },
    // Sleep as bars across a night: short ones, then one that stretches out.
    stretch: function () { return '<div class="st-vis st-bars-n"><i style="--w:14%"></i><i style="--w:12%"></i><i class="is-long" style="--w:44%"></i><i style="--w:16%"></i></div>'; },
    // Three naps that become two.
    naps: function () { return '<div class="st-vis st-naps"><div class="st-naprow"><i></i><i></i><i class="is-go"></i></div><div class="st-naplabel"><span>3 naps</span><span>2 naps</span></div></div>'; },
    // A bottle that empties fast.
    drain: function () { var m = blob('#fffaf0', '#ffffff', '#ead9c4'), cap = blob('#b9a6e6', '#ddd2f7', '#8f7bc4'), tip = blob('#f3c9a6', '#fbe3cf', '#dca47c');
      return '<div class="st-vis st-drainwrap">' + svg('0 0 140 230', m.def + cap.def + tip.def + '<clipPath id="bdc"><rect x="28" y="72" width="84" height="142" rx="34"/></clipPath>', shadow(70, 220, 46) + '<path d="M58 22q12-24 24 0v26H58Z" fill="' + tip.url + '"/><rect x="34" y="44" width="72" height="34" rx="14" fill="' + cap.url + '"/><rect x="28" y="72" width="84" height="142" rx="34" fill="#ffffff" opacity=".55"/><g clip-path="url(#bdc)"><rect class="st-milk" x="28" y="90" width="84" height="130" fill="' + m.url + '"/></g><rect x="28" y="72" width="84" height="142" rx="34" fill="none" stroke="#e8d6c4" stroke-width="3"/>', 'st-obj') + '<b class="st-timer">2 min</b></div>'; },
    feet: function () { var sk = blob('#f3b48f', '#fbd3bb', '#de946d'); var foot = function (x, fl) { return '<g class="st-foot' + (fl ? ' is-r' : '') + '" transform="translate(' + x + ' 0)' + (fl ? ' scale(-1 1) translate(-100 0)' : '') + '"><ellipse cx="50" cy="120" rx="34" ry="52" fill="' + sk.url + '"/>' + [[24, 64, 9], [38, 56, 10], [53, 54, 10], [67, 58, 9], [78, 68, 8]].map(function (t, i) { return '<circle class="st-toe" style="--i:' + i + '" cx="' + t[0] + '" cy="' + t[1] + '" r="' + t[2] + '" fill="' + sk.url + '"/>'; }).join('') + '</g>'; };
      return '<div class="st-vis st-feetwrap">' + svg('0 0 240 190', sk.def, foot(10, false) + foot(130, true)) + '</div>'; },
    steps: function () { var s = ''; for (var i = 0; i < 6; i++) s += '<i style="--i:' + i + '" class="' + (i % 2 ? 'is-r' : 'is-l') + '"></i>'; return '<div class="st-vis st-steps">' + s + '</div>'; },
    crawl: function () { var t = ''; for (var i = 0; i < 6; i++) t += '<i style="--i:' + i + '" class="' + (i % 2 ? 'is-b' : 'is-a') + '"></i>'; return '<div class="st-vis st-crawl2">' + t + '</div>'; },
    splats: function () { var c = ['#e98a6b', '#ffd98a', '#7fae95', '#f2b6c8']; var s = ''; for (var i = 0; i < 6; i++) s += '<i style="--i:' + i + ';--c:' + c[i % 4] + ';--x:' + [10, 46, 72, 24, 58, 82][i] + '%;--y:' + [20, 6, 30, 58, 50, 62][i] + '%;--s:' + [64, 46, 56, 40, 70, 34][i] + 'px"></i>'; return '<div class="st-vis st-splats">' + s + '</div>'; },
    faces: function () { return '<div class="st-vis st-faces">' + ['#f3b48f', '#e0a37f', '#f6c9a8'].map(function (c, i) { return '<span style="--i:' + i + ';--c:' + c + '"><i></i><i></i><b></b></span>'; }).join('') + '<em>♥</em></div>'; },
    pass: function (label) { return '<div class="st-vis st-pass"><span class="st-hl2">' + hand(false) + '</span><span class="st-ballp">' + ball() + '</span><span class="st-hr2">' + hand(true) + '</span></div>'; },
    drop: function () { return '<div class="st-vis st-drop"><span class="st-dropball">' + ball() + '</span><i class="st-dropshadow"></i></div>'; },
    mirror: function () { return '<div class="st-vis st-mirror"><span class="st-mframe"><span class="st-mbunny">' + bunny() + '</span><i class="st-shine"></i></span></div>'; },
    peek: function () { return '<div class="st-vis st-peekaboo" data-peek><span class="st-pbun">' + bunny() + '</span><span class="st-cloth"></span><b class="st-peektag">Tap the blanket</b><b class="st-still">Still there!</b></div>'; },
    heart: function () { return '<div class="st-vis st-heartwrap"><span class="st-bye">bye-bye!</span><i class="st-heart">♥</i><span class="st-back">back soon</span></div>'; },
    puffs: function () { var s = ''; for (var i = 0; i < 5; i++) s += '<i style="--i:' + i + '"' + (i === 2 ? ' class="is-pick"' : '') + '></i>'; return '<div class="st-vis st-puffs">' + s + '</div>'; },
    // Through her eyes: like every other screen, one clay object on the cloud (your face, with a toy beside it).
    // It arrives sharp, then softens to how she sees it this month.
    eyes: function (m) {
      var F = { 0: 'blur(5px) grayscale(.9) contrast(1.2)', 1: 'blur(3px) grayscale(1) contrast(1.15)', 2: 'blur(2.5px) saturate(.5)', 3: 'blur(1.6px) saturate(.7)', 4: 'blur(1px) saturate(.85)', 6: 'blur(.4px)' }[m] || 'none';
      var sk = blob('#f5c3a0', '#fde3cf', '#de9d79'), r = blob('#e98a6b', '#f6b49c', '#c96f52');
      var face = svg('0 0 220 200', sk.def + r.def, shadow(96, 192, 70) +
        '<circle cx="96" cy="100" r="80" fill="' + sk.url + '"/><path d="M18 92 Q24 18 96 18 Q168 18 174 92 Q150 52 96 50 Q42 52 18 92Z" fill="#6b4a3a"/>' +
        '<circle cx="70" cy="104" r="8" fill="#2B2840"/><circle cx="122" cy="104" r="8" fill="#2B2840"/><circle cx="73" cy="101" r="2.6" fill="#fff"/><circle cx="125" cy="101" r="2.6" fill="#fff"/>' +
        '<ellipse cx="54" cy="128" rx="12" ry="7" fill="#f39aa8"/><ellipse cx="138" cy="128" rx="12" ry="7" fill="#f39aa8"/>' +
        '<path d="M76 134 Q96 154 116 134" fill="none" stroke="#2B2840" stroke-width="7" stroke-linecap="round"/>' +
        '<circle cx="194" cy="160" r="24" fill="' + r.url + '"/><path d="M180 150 Q194 140 208 152" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>');
      // Month 1 is about bold patterns, so it shows two toys: a black-and-white one that stays clear in her view,
      // and a pastel one that melts into the background.
      if (m === 1) {
        var lv = blob('#d9cff3', '#efeafb', '#c3b6e6');
        var stripes = ''; for (var i = 0; i < 6; i++) stripes += '<rect x="' + (30 + i * 20) + '" y="40" width="10" height="130" fill="#2B2840"/>';
        face = svg('0 0 220 200', lv.def, shadow(80, 192, 66) + shadow(178, 192, 30) +
          '<defs><clipPath id="evc"><circle cx="80" cy="104" r="70"/></clipPath></defs><circle cx="80" cy="104" r="70" fill="#fffaf3"/><g clip-path="url(#evc)">' + stripes + '</g><circle cx="80" cy="104" r="70" fill="none" stroke="#2B2840" stroke-width="5"/>' +
          '<circle cx="178" cy="150" r="34" fill="' + lv.url + '"/>');
      }
      var B = function (cx, cy, rr, a, b2, c2) { var g = blob(a, b2, c2); return { d: g.def, h: '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="' + g.url + '"/>' }; };
      if (m === 2) { // colors: three bright toys, muted in her view
        var r2 = B(52, 130, 34, '#e9584b', '#f8a39a', '#bd3a30'), y2 = B(118, 104, 40, '#ffd23f', '#fff0a8', '#e0a91a'), b2 = B(182, 136, 30, '#3f8ee9', '#9cc6f6', '#2a68b8');
        face = svg('0 0 220 200', r2.d + y2.d + b2.d, shadow(52, 190, 34) + shadow(118, 190, 40) + shadow(182, 190, 30) + r2.h + y2.h + b2.h);
      } else if (m === 3) { // tracking: a ball moving across, with its trail
        var t3 = B(170, 100, 34, '#e98a6b', '#f6b49c', '#c96f52'), tr = '';
        for (var j = 0; j < 4; j++) tr += '<circle cx="' + (40 + j * 30) + '" cy="' + (100 - Math.sin(j / 3 * Math.PI) * 18).toFixed(0) + '" r="' + (8 + j * 3) + '" fill="#e98a6b" opacity="' + (.18 + j * .14).toFixed(2) + '"/>';
        face = svg('0 0 220 200', t3.d, shadow(170, 190, 36) + tr + t3.h);
      } else if (m === 4) { // depth: near, middle and far toys
        var n4 = B(64, 140, 46, '#9cc7ae', '#cfe6d9', '#76a88b'), m4 = B(140, 112, 26, '#e98a6b', '#f6b49c', '#c96f52'), f4 = B(192, 92, 13, '#b9a6e6', '#ddd2f7', '#8f7bc4');
        face = svg('0 0 220 200', n4.d + m4.d + f4.d, shadow(64, 192, 46) + shadow(140, 150, 26) + shadow(192, 112, 14) + f4.h + m4.h + n4.h);
      } else if (m === 6) { // across the room: you, small and far, still easy to spot
        face = face.replace('<circle cx="96" cy="100" r="80"', '<g transform="translate(110 40) scale(.42)"><circle cx="96" cy="100" r="80"').replace('<circle cx="194" cy="160" r="24"', '</g><circle cx="60" cy="150" r="34"').replace('<path d="M180 150 Q194 140 208 152"', '<path d="M42 136 Q60 124 78 138"');
      }
      // The sharp face sits underneath; her view sweeps across it like a lens, edge and all.
      return '<div class="st-vis st-eyesv" style="--f:' + F + '"><span class="st-ev-sharp">' + face + '</span><span class="st-ev-soft">' + face + '</span><i class="st-ev-edge"></i></div>';
    },
    cruise: function () { var t = ''; for (var i = 0; i < 4; i++) t += '<i style="--i:' + i + '"></i>'; return '<div class="st-vis st-cruise"><span class="st-sofa"><b></b></span>' + t + '</div>'; },
    name: function () { return '<div class="st-vis st-namewrap"><span class="st-callout">' + E(nm()) + '!</span><i class="st-ring" style="--i:0"></i><i class="st-ring" style="--i:1"></i><i class="st-ring" style="--i:2"></i></div>'; },
    bang: function () { return '<div class="st-vis st-bang">' + blocksPair() + '<i class="st-bangfx">✶</i></div>'; },
    gate: function () { return '<div class="st-vis st-gate"><span class="st-gl"></span><span class="st-gr"></span></div>'; },
    cloud: function (words) { return '<div class="st-vis st-wcloud">' + words.map(function (w, i) { return '<span style="--i:' + i + '">' + E(w) + '</span>'; }).join('') + '</div>'; },
    wave: function () { return '<div class="st-vis st-wavehand">' + hand(false) + '</div>'; },
    spoon: function () { return '<div class="st-vis st-spoonwrap">' + bowl() + '</div>'; },
    tilt: function () { return '<div class="st-vis st-tiltcup">' + cup() + '</div>'; },
    cake: function () { var c = blob('#f6c2cf', '#fbdbe3', '#df9cb0'), f = blob('#fffaf3', '#ffffff', '#ead9c4');
      return '<div class="st-vis st-cake">' + svg('0 0 200 200', c.def + f.def, shadow(100, 188, 80) + '<rect x="30" y="100" width="140" height="80" rx="22" fill="' + c.url + '"/><path d="M30 118q20 16 35 0t35 0 35 0 35 0v-6q0-12-22-12H52q-22 0-22 12Z" fill="' + f.url + '"/><rect x="94" y="52" width="12" height="44" rx="6" fill="#b9a6e6"/><path class="st-flame" d="M100 22q14 16 0 28q-14-12 0-28Z" fill="#ffd98a"/>') + '</div>'; },
    halfring: function () { return '<svg class="st-halfring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,250,243,.18)" stroke-width="12"/><circle class="st-hr-fill" cx="60" cy="60" r="50" fill="none" stroke="#ffd98a" stroke-width="12" stroke-linecap="round" pathLength="100" transform="rotate(-90 60 60)"/></svg>'; },
    distance: function () { return '<div class="st-vis st-dist"><span class="st-d1">' + bunny() + '</span><i class="st-dline"></i><span class="st-d2"><i></i><i></i><b></b></span></div>'; },
    raspberry: function () { return '<div class="st-vis st-rasp"><b>pbbbt!</b><i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i><i style="--i:3"></i><i style="--i:4"></i></div>'; },
    grab: function () { return '<div class="st-vis st-grab"><span class="st-gh">' + hand(false) + '</span><span class="st-gb">' + ball() + '</span></div>'; },
    roll: function () { return '<div class="st-rollwrap">' + ball() + burst('#fffaf3') + '</div>'; },
    smile: function () { var w = blob('#fff3e6', '#ffffff', '#ecd6c3'); return '<div class="st-vis st-smile">' + svg('0 0 200 200', w.def, '<circle cx="100" cy="104" r="84" fill="' + w.url + '"/><circle cx="72" cy="92" r="7" fill="#2B2840"/><circle cx="128" cy="92" r="7" fill="#2B2840"/><ellipse cx="58" cy="120" rx="13" ry="8" fill="#f6c2cf"/><ellipse cx="142" cy="120" rx="13" ry="8" fill="#f6c2cf"/><path class="st-smilepath" d="M70 128 Q100 128 130 128" fill="none" stroke="#2B2840" stroke-width="7" stroke-linecap="round"/>') + '</div>'; }
  };
  function blocksPair() { var a = blob('#e98a6b', '#f6b39a', '#c96a4e'), b = blob('#7fae95', '#a9d0bb', '#5b8c73');
    return '<span class="st-bl">' + svg('0 0 100 100', a.def, '<rect x="4" y="4" width="92" height="92" rx="18" fill="' + a.url + '"/><text x="50" y="68" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="50" fill="#fffaf3">A</text>') + '</span><span class="st-br">' + svg('0 0 100 100', b.def, '<rect x="4" y="4" width="92" height="92" rx="18" fill="' + b.url + '"/><text x="50" y="68" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="50" fill="#fffaf3">B</text>') + '</span>'; }
  // Each "coming up next" gets its own little scene.
  var NEXT = {
    babble: ['Ba-ba-ba!', 'Babbling strings of sounds is on the way. Answer her and she’ll babble right back.', 'babbling', 'babble'],
    track: ['Following you with her eyes.', 'Move slowly side to side and watch her eyes come with you.', 'following you', 'track'],
    head: ['Lifting her head.', 'A little tummy time a few times a day builds the strength.', 'lifting her head', 'pose4'],
    laugh: ['Laughing out loud.', 'Silly faces and gentle tickles are about to pay off.', 'laughing out loud', 'laugh'],
    grab: ['Grabbing toys.', 'All that swatting is aim practice.', 'grabbing toys', 'grab'],
    roll: ['Rolling over.', 'All that pushing up during tummy time is the warm-up.', 'rolling over', 'roll'],
    sit: ['Sitting up.', 'Rolling and reaching are building the strength she’ll sit with.', 'sitting up', 'pose7'],
    crawl: ['Crawling.', 'Rocking on hands and knees is the warm-up.', 'crawling', 'crawl'],
    peek: ['Peekaboo gets exciting.', 'She’s about to figure out that hidden isn’t gone.', 'peekaboo', 'peek'],
    pull: ['Pulling up to stand.', 'Every crawl is building the strength in her legs.', 'pulling up', 'pose10'],
    cruise: ['Cruising.', 'Once she pulls up, she’ll start shuffling along the furniture.', 'cruising', 'cruise'],
    point: ['Pointing.', 'Soon she’ll point to show you exactly what she wants.', 'pointing', 'grab'],
    words: ['First words.', 'All that babbling is practice. Keep naming things for her.', 'first words', 'words'],
    steps: ['First steps.', 'Cruising along the furniture is the warm-up. Anywhere from 9 to 18 months is normal.', 'first steps', 'steps'],
    bday: ['Her first birthday!', 'One whole year. Look how far you’ve both come.', 'her first birthday', 'cake']
  };
  var NEXT_BY_MONTH = { 0: 'head', 1: 'track', 2: 'laugh', 3: 'grab', 4: 'roll', 5: 'babble', 6: 'sit', 7: 'crawl', 8: 'pull', 9: 'cruise', 10: 'steps', 11: 'bday' };
  var SKIP = { roll: 'sit', sit: 'crawl', crawl: 'pull', pull: 'cruise', cruise: 'steps', steps: 'bday' };
  V.typed = function (word) { return '<div class="st-vis st-typed"><span>' + word.split('').map(function (ch, i) { return '<i style="--i:' + i + '">' + E(ch) + '</i>'; }).join('') + '</span></div>'; };
  V.laugh = function () { return '<div class="st-laughing">' + V.smile() + '</div>'; };
  V.track = function () { return '<div class="st-vis st-track"><i></i><span>' + ball() + '</span></div>'; };
  V.tooth = function () { return '<div class="st-vis st-tooth"><span class="st-tt"></span><span class="st-gum"></span><i class="st-drool"></i></div>'; };
  V.crib = function () { return '<div class="st-vis st-crib"><span class="st-cribbars"></span><span class="st-mattress"></span></div>'; };
  V.anchor = function () { return '<div class="st-vis st-anchor"><span class="st-dresser"><i></i><i></i><i></i></span><b class="st-strap"></b><span class="st-wall"></span></div>'; };
  V.babble = function () { return V.voice(['ba', 'ba-ba', 'da!', 'ba-ba-ba']); };
  V.fist = function () { return '<div class="st-vis st-fistwrap">' + hand(false) + '</div>'; };
  V.fill = function () { return '<div class="st-vis st-fill"><i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i><span>' + bowl() + '</span></div>'; };
  V.words = function () { return V.typed('mama'); };
  V.give = function () { return '<div class="st-vis st-pass st-give"><span class="st-hl2">' + hand(false) + '</span><span class="st-ballp">' + ball() + '</span><span class="st-hr2 is-big">' + hand(true) + '</span></div>'; };

  /* ---------- The stories ----------
     One main thread a month, and every fact appears once in the year. Screens pick the shape that fits:
     reveal (setup, then the answer), beat (quick words), topic (one change), quiz (tap to answer),
     peek (tap to play), thennow (how far she's come). Each has a visual that acts out what it says. */
  var C = { lav: ['#cfc3ea', '#e3dbf5'], butter: ['#ffe7a6', '#fff3cf'], pink: ['#f2b6c8', '#f8cfdb'], peach: ['#f6c9a8', '#fbe0cc'], sage: ['#bfdcc7', '#e5f1e7'], night: ['#2f3a66', '#8e9fd6'] };
  var STORIES = {
    0: { cover: ['Welcome to the world.', 'Everything is new, for both of you.'], screens: [
          { t: 'topic', c: 'butter', kicker: 'She already knows you', title: 'She knows your voice.', body: 'She heard it for months before she was born, so it’s the sound that settles her most.', vis: ['lull'] },
          { t: 'topic', c: 'sage', kicker: 'Why she stares at you', title: 'She sees you best up close.', body: 'About 8 to 12 inches away, the distance to your face during a feed. Farther than that is still a blur.', vis: ['eyes', 0] },
          { t: 'beat', c: 'lav', words: ['Feed.', 'Sleep.', 'Repeat.'], line: 'Most newborns feed 8 to 12 times a day and sleep in short stretches, day and night.', vis: ['clock'] },
          { t: 'topic', c: 'peach', kicker: 'That tiny grip', title: 'She’ll hold on tight.', body: 'Put a finger in her palm and she’ll grab it. It’s a reflex for now, and it fades over the next few months.', vis: ['grip'] }],
        sum: ['Knows your voice', 'Feeds around the clock', 'Holds on tight'] },
    1: { cover: ['She’s tuning in to you.', 'Your face and voice are her favorite things now.'], screens: [
          { t: 'topic', c: 'butter', kicker: 'Through her eyes', title: 'Bold things stand out.', body: 'Faces and strong black-and-white patterns catch her eye first. Soft colors are still hard to tell apart.', vis: ['eyes', 1] },
          { t: 'topic', c: 'night', kicker: 'The hard part', title: 'Crying peaks around 6 weeks.', body: 'Then it usually eases by 3 to 4 months. It’s a phase, not something you’re doing wrong.', vis: ['peak'] },
          { t: 'reveal', c: 'lav', setup: 'Sometime in the next few weeks, she’ll give you…', payoff: 'Her first real smile!', lead: 'Not just gas this time. A smile meant for you.', vis: ['smile'] }],
        sum: ['Sees you best up close', 'Crying peaks, then eases', 'First smiles coming'] },
    2: { cover: ['She’s smiling at you on purpose.', 'And she’s starting to talk back.'], screens: [
          { t: 'beat', c: 'butter', words: ['Coo.', 'Pause.', 'Coo.'], line: 'Those little sounds are her first conversations. When you answer, she learns to take turns.', vis: ['talk', ['ooh', '…', 'ahh', '…']] },
          { t: 'reveal', c: 'lav', setup: 'On her tummy, she can now lift…', payoff: 'Her head!', lead: 'Just for a moment at first. Tummy time is how she builds the strength.', vis: ['rise'] },
          { t: 'topic', c: 'peach', kicker: 'Through her eyes', title: 'Colors are coming in.', body: 'She’s starting to see colors, softly at first. Bold, bright things stand out most.', vis: ['eyes', 2] },
          { t: 'topic', c: 'night', kicker: 'And after dark', title: 'Nights may stretch a little.', body: 'Some babies start one longer sleep at night around now. Every baby gets there on their own timeline.', vis: ['stretch'] }],
        sum: ['Smiling on purpose', 'Cooing back', 'Lifting her head'] },
    3: { cover: ['She’s figuring out how to get your attention.', 'Smiles, coos and wiggles, all on purpose.'], screens: [
          { t: 'reveal', c: 'lav', setup: 'This month, she’s discovering…', payoff: 'Her voice!', lead: 'Gurgles, coos and little squeals. She’s testing what it can do, and watching how you react.', vis: ['voice', ['eee!', 'ooh', 'gaa', 'ahh!']] },
          { t: 'topic', c: 'peach', kicker: 'Look at those hands', title: 'Fists are opening up.', body: 'Her hands are relaxing, and she’s starting to swing at toys hanging over her. Aim comes later.', vis: ['fist'] },
          { t: 'topic', c: 'butter', kicker: 'Her new favorite face', title: 'Who’s that baby?', body: 'Faces are what she loves looking at most, including the one in the mirror. She won’t know it’s her until well after her first birthday.', vis: ['mirror'] },
          { t: 'topic', c: 'pink', kicker: 'Meanwhile, at feeds', title: 'Feeds get quicker.', body: 'She’s a more efficient eater now, so a full feed can take just minutes. Short feeds are normal.', vis: ['drain'] }],
        sum: ['Finding her voice', 'Swinging at toys', 'Quicker feeds'] },
    5: { cover: ['She’s watching everything you eat.', 'Every bite you take is fascinating now.'], screens: [
          { t: 'reveal', c: 'lav', setup: 'This month, she might discover…', payoff: 'Her feet!', lead: 'Lots of babies grab their toes around now, and try to taste them.', vis: ['feet'] },
          { t: 'follow', key: 'roll' },
          { t: 'topic', c: 'peach', kicker: 'New sound unlocked', title: 'Pbbbt!', body: 'Raspberries and squeals are on the way. Blow one back and you’ve got a conversation.', vis: ['raspberry'] },
          { t: 'topic', c: 'butter', kicker: 'Getting ready for food', title: 'Watch for the signs.', chips: ['holds her head steady', 'sits with support', 'opens up for your spoon'], body: 'When you see all three, she’s ready. For most babies that’s around 6 months, not before 4.' }],
        sum: ['Found her feet', 'Rolling', 'Signs she’s ready for food'] },
    6: { cover: ['Halfway to one!', 'Six months down. Look how much has changed.'], half: true, screens: [
          { t: 'reveal', c: 'lav', setup: 'This month, she might try…', payoff: 'Her first foods!', lead: 'It’s mostly practice. Milk is still her main food for months.', vis: ['spoon'] },
          { t: 'beat', c: 'butter', words: ['Taste.', 'Squish.', 'Smear.'], line: 'Messy is how she learns. Let her touch and explore the food.', vis: ['splats'] },
          { t: 'topic', c: 'peach', kicker: 'Any day now', title: 'Her first tooth.', body: 'Most babies get their first tooth around now, usually a bottom front one. Extra drool and chewing on everything are the clues.', vis: ['tooth'] },
          { t: 'topic', c: 'sage', kicker: 'Through her eyes', title: 'She can spot you across the room.', body: 'Her view is almost as sharp as yours now, so she may light up before you get close.', vis: ['eyes', 6] },
          { t: 'topic', c: 'pink', kicker: 'Her people', title: 'She knows who’s who.', body: 'She may get shy with new faces. It means she knows exactly who her people are.', vis: ['faces'] }],
        sum: ['First foods', 'First tooth', 'Knows her people'] },
    7: { cover: ['She’s getting steadier sitting up.', 'And that frees her hands for exploring.'], screens: [
          { t: 'follow', key: 'sit' },
          { t: 'reveal', c: 'lav', setup: 'This month, she’s mastering…', payoff: 'Hand to hand!', lead: 'Toys go from one hand to the other, then straight to her mouth.', vis: ['pass'] },
          { t: 'beat', c: 'butter', words: ['Drop.', 'Look.', 'Again.'], line: 'She drops things to see what happens, over and over. It’s an experiment, not a game of fetch.', vis: ['drop'] },
          { t: 'topic', c: 'night', kicker: 'And after dark', title: 'Three naps may become two.', body: 'If she starts fighting the third nap, it’s on its way out. Bedtime may move a little earlier.', vis: ['naps'] }],
        sum: ['Steadier sitting', 'Hand to hand', 'Two naps coming'] },
    8: { cover: ['She knows you’re still there.', 'Even when she can’t see you.'], screens: [
          { t: 'peek', c: 'lav', setup: 'This month, she figures out…', payoff: 'Hidden isn’t gone!', lead: 'That’s why peekaboo suddenly gets so exciting.', vis: ['peek'] },
          { t: 'topic', c: 'pink', kicker: 'The flip side', title: 'She may miss you more.', body: 'Separation anxiety often starts around now. A quick, happy goodbye works better than sneaking out.', vis: ['heart'] },
          { t: 'beat', c: 'butter', words: ['Spot.', 'Rake.', 'Grab.'], line: 'She scoops up small things with her whole hand. The neat thumb-and-finger pinch comes closer to one.', vis: ['puffs'] }],
        sum: ['Peekaboo makes sense', 'Missing you', 'Raking up small things'] },
    9: { cover: ['Her world is getting bigger.', 'She wants to go places and reach everything.'], screens: [
          { t: 'reveal', c: 'lav', setup: 'This month, she really knows…', payoff: 'Her name!', lead: 'Call it from across the room and watch her look up.', vis: ['name'] },
          { t: 'beat', c: 'butter', words: ['Bang.', 'Clap.', 'Repeat.'], line: 'She can bang two toys together now, and she will. Again and again.', vis: ['bang'] },
          { t: 'follow', key: 'crawl' }],
        sum: ['Knows her name', 'Banging and clapping', 'On the move'] },
    10: { cover: ['She understands more than she can say.', 'Words are landing before she says them.'], screens: [
          { t: 'topic', c: 'lav', kicker: 'She may already know', title: 'More words than you think.', body: 'Babies understand words long before they say them. Keep naming everything.', vis: ['cloud', ['milk', 'bath', 'bye-bye', 'no', 'ball', 'her name']] },
          { t: 'reveal', c: 'butter', setup: 'Listen closely. Around her birthday…', payoff: 'Mama or dada!', lead: 'Babbling turns into first words around one. Some come early, some later.', vis: ['typed', 'mama'] },
          { t: 'follow', key: 'pull' },
          { t: 'beat', c: 'peach', words: ['Wave.', 'Clap.', 'Bye-bye!'], line: 'Gestures are her first way to tell you things. Wave together and she’ll start to copy.', vis: ['wave'] }],
        sum: ['Understands more words', 'First words coming', 'Waving bye-bye'] },
    11: { cover: ['Almost one!', 'Look how far she’s come this year.'], screens: [
          { t: 'follow', key: 'cruise' },
          { t: 'thennow', c: 'lav', kicker: 'Then and now', head: ['Newborn', 'Now'], rows: [['Saw you clearly up close', 'Spots you across the room'], ['Hands in tight fists', 'Picks up tiny things'], ['Talked by crying', 'Babbles and waves bye-bye']] },
          { t: 'beat', c: 'butter', words: ['Fill.', 'Dump.', 'Again.'], line: 'Putting things in and tipping them out is her new favorite game.', vis: ['fill'] },
          { t: 'topic', c: 'pink', kicker: 'Her favorite game', title: 'Give and take.', body: 'She hands you things and wants them right back. It’s one of her first back-and-forths.', vis: ['give'] },
          { t: 'topic', c: 'peach', kicker: 'At meals', title: 'Getting ready for whole milk.', body: 'Around her first birthday, cow’s milk can replace formula. Her pediatrician will talk it through at the 1-year checkup.', vis: ['tilt'] }],
        sum: ['Then and now', 'Fill and dump', 'Whole milk coming'] }
  };
  function nextUp(p, m) {
    var done = {}; try { done = window.__ya.doneNow(); } catch (e) {}
    var k = NEXT_BY_MONTH[Math.max(0, Math.min(11, m))] || 'roll', guard = 0;
    while (SKIP[k] && done[k] && guard++ < 6) k = SKIP[k];
    var x = NEXT[k]; return { key: k, title: Pp(x[0]), why: Pp(x[1]), short: x[2], vis: x[3] };
  }
  function Pp(s) {
    var pr = (profile && profile.pronouns) || 'she'; if (pr === 'she') return s;
    var he = pr === 'he';
    var map = he ? { she: 'he', She: 'He', Her: 'His', herself: 'himself', 'she’s': 'he’s', 'She’s': 'He’s', 'she’ll': 'he’ll', 'She’ll': 'He’ll' } : { she: 'they', She: 'They', Her: 'Their', herself: 'themself', 'she’s': 'they’re', 'She’s': 'They’re', 'she’ll': 'they’ll', 'She’ll': 'They’ll' };
    return s.replace(/\b(She’s|she’s|She’ll|she’ll|herself|She|she|Her|her)\b/g, function (w) { if (w === 'her') return he ? 'his' : 'their'; return map[w] || w; });
  }
  function vis(v) { if (!v) return ''; var f = V[v[0]]; return f ? f(v[1]) : ''; }

  var FOLLOW = {
    roll: { c: 'peach', yes: 'She rolled over!', kick: 'Rolling, or about to?', no: 'She can end up anywhere.', body: 'Once babies roll, a second is all it takes. Keep a hand on her on the changing table.', tip: 'Stop swaddling once she tries to roll.', vis: 'roll' },
    sit: { c: 'peach', yes: 'She’s sitting up!', kick: 'Sitting, or getting close?', no: 'A whole new view.', body: 'Steady sitting frees her hands to play, and lets her see the world from up high.', tip: 'Lower the crib mattress now.', vis: 'crib' },
    crawl: { c: 'peach', yes: 'She’s crawling!', kick: 'Crawling, or about to?', no: 'Her world just got bigger.', body: 'Scooting, rolling or crawling, she’ll find a way. Get down at her level and look around.', tip: 'Gates and cabinet locks go up now.', vis: 'crawl' },
    pull: { c: 'pink', yes: 'She’s pulling up!', kick: 'Pulling up, or getting there?', no: 'Everything is a handhold.', body: 'Furniture becomes something to climb. Anything she pulls on needs to stay put.', tip: 'Anchor dressers and shelves to the wall.', vis: 'anchor' },
    cruise: { c: 'sage', yes: 'She’s cruising!', kick: 'Cruising, or getting there?', no: 'Shuffling along the furniture.', body: 'Holding on and stepping sideways is how walking starts. Bare feet help her feel the floor and balance.', tip: 'Barefoot is best indoors.', vis: 'steps' }
  };
  function followScreen(key) {
    var f = FOLLOW[key], done = {}; try { done = window.__ya.doneNow(); } catch (e) {}
    var did = !!done[key];
    return screen({ t: 'topic', c: f.c, kicker: did ? 'You saw it' : f.kick, title: did ? f.yes : f.no, body: f.body, tip: f.tip, vis: [f.vis] });
  }
  function screen(sc) {
    if (sc.t === 'follow') return followScreen(sc.key);
    var bg = C[sc.c][0], cl = C[sc.c][1], night = sc.c === 'night', ink = night ? '#fffaf3' : '#2B2840';
    var area = function (html, cls) { return '<div class="st-visarea' + (cls ? ' ' + cls : '') + '">' + cloud(night ? '#4b5890' : cl) + html + '</div>'; };
    if (sc.t === 'reveal' || sc.t === 'peek') return { id: sc.t === 'peek' ? 'reveal st-peeks' : 'reveal', bg: bg, ink: ink, dur: sc.t === 'peek' ? 7600 : 5400, html:
      '<p class="st-setup2 st-in" style="--d:.05s">' + E(Pp(sc.setup)) + '</p>' +
      '<div class="st-title st-title-xl st-pop" style="--d:1s">' + E(Pp(sc.payoff)) + '</div>' +
      '<p class="st-lead st-in" style="--d:1.5s">' + E(Pp(sc.lead)) + '</p>' + area(vis(sc.vis), 'st-late') };
    if (sc.t === 'beat') return { id: 'beat', bg: bg, ink: ink, dur: 5400, html:
      '<div class="st-beats">' + sc.words.map(function (w, i) { return '<span' + (i === sc.words.length - 1 ? ' class="st-beat-last"' : '') + ' style="--d:' + (.1 + i * .3) + 's">' + E(w) + '</span>'; }).join('') + '</div>' +
      '<p class="st-body st-in" style="--d:' + (.4 + sc.words.length * .3) + 's">' + E(Pp(sc.line)) + '</p>' + area(vis(sc.vis)) };
    if (sc.t === 'quiz') return { id: 'quiz', bg: bg, ink: ink, dur: 9000, html:
      '<p class="st-kicker st-in" style="--d:.05s">Quick question</p>' +
      '<div class="st-title st-pop" style="--d:.15s">' + E(Pp(sc.q)) + '</div>' +
      '<div class="st-opts" data-a="' + sc.a + '">' + sc.opts.map(function (o, i) { return '<button class="st-opt st-in" style="--d:' + (.6 + i * .15) + 's" data-i="' + i + '">' + E(o) + '</button>'; }).join('') + '</div>' +
      '<p class="st-ans st-body">' + E(Pp(sc.ans)) + '</p>' + area(vis(sc.vis), 'st-quizvis') };
    if (sc.t === 'thennow') { var hd = sc.head || ['Last month', 'Now']; return { id: 'thennow', bg: bg, ink: ink, dur: 6400, html:
      '<p class="st-kicker st-in" style="--d:.05s">' + E(Pp(sc.kicker)) + '</p>' +
      '<div class="st-tn"><div class="st-tn-h st-in" style="--d:.2s"><span>' + E(hd[0]) + '</span><span>' + E(hd[1]) + '</span></div>' +
      sc.rows.map(function (r, i) { return '<div class="st-tn-r" style="--i:' + i + '"><span class="st-then">' + E(Pp(r[0])) + '</span><i>→</i><span class="st-now">' + E(Pp(r[1])) + '</span></div>'; }).join('') + '</div>' +
      area('') }; }
    return { id: night ? 'sleep' : 'feed', bg: bg, ink: ink, dur: sc.tip ? 6000 : 5400, html:
      (night ? '<div class="st-sky"><i></i><i></i><i></i><i></i><i></i></div><div class="st-moonwrap">' + moon() + '</div>' : '') +
      '<p class="st-kicker st-in" style="--d:.05s">' + E(Pp(sc.kicker)) + '</p>' +
      '<div class="st-title st-pop" style="--d:.15s">' + E(Pp(sc.title)) + '</div>' +
      (sc.chips ? '<div class="st-distract">' + sc.chips.map(function (c, i) { return '<span style="--d:' + (.6 + i * .25) + 's">✓ ' + E(Pp(c)) + '</span>'; }).join('') + '</div>' : '') +
      '<p class="st-body st-in" style="--d:' + (sc.chips ? 1.5 : .7) + 's">' + E(Pp(sc.body)) + '</p>' +
      (sc.tip ? '<p class="st-tip st-in" style="--d:1.6s">' + burst('#e98a6b') + E(Pp(sc.tip)) + '</p>' : '') + area(vis(sc.vis)) };
  }

  function slides() {
    var n = nm(), p = PR(), days = daysOld(), pic = photoNow(), firsts = firstsThisMonth(), m = month(), nx = nextUp(p, m);
    if (m === 4) return slides4(n, p, days, pic, firsts, nextUp(p, 4));
    var st = STORIES[Math.max(0, Math.min(11, m))] || STORIES[1], wk = Math.max(1, Math.round(days / 7));
    var list = [{ id: 'cover', bg: '#2B2840', ink: '#fffaf3', dur: 3800, html:
        '<i class="st-sun"></i><i class="st-star">★</i><i class="st-dotc"></i>' +
        '<p class="st-kicker st-in" style="--d:.05s">' + E(n) + (m === 0 ? '’s first weeks' : '’s month') + '</p>' +
        '<div class="st-giant st-pop" style="--d:.15s">' + (m === 0 ? wk + '<small class="st-giant-u">' + (wk === 1 ? 'week' : 'weeks') + '</small>' : st.half ? '<span class="st-halfwrap">' + V.halfring() + '<b>' + m + '</b></span>' : m) + '</div>' +
        '<div class="st-title st-cover-t st-in" style="--d:.45s">' + E(Pp(st.cover[0])) + '</div>' +
        '<p class="st-lead st-in" style="--d:.75s">' + E(Pp(st.cover[1])) + '</p>' +
        '<div class="st-ground">' + cloud('#b9a6e6') + (pic ? '<div class="st-photo"><img src="' + pic + '" alt=""></div>' : '<div class="st-coverart ms-toys">' + window.stCardArt(m) + '</div>') + '</div>' }];
    st.screens.forEach(function (sc) { list.push(screen(sc)); });
    list.push(nextScreen(nx), daysScreen(n, p, days, firsts), summary(n, p, days, pic, firsts, nx, st.sum, m));
    return list;
  }
  function nextScreen(nx) { return { id: 'next', bg: '#bfdcc7', ink: '#2B2840', dur: 4800, html:
    '<p class="st-kicker st-in" style="--d:.05s">Coming up next</p>' +
    '<div class="st-title st-title-big st-pop" style="--d:.2s">' + E(nx.title) + '</div>' +
    '<p class="st-body st-in" style="--d:.6s">' + E(nx.why) + '</p>' +
    '<div class="st-visarea">' + cloud('#e5f1e7') + vis([nx.vis]) + '</div>' }; }
  // A different, true line for each month.
  function daysLine(days) {
    var m = month(), wk = Math.round(days / 7), hrs = fmt(days * 24), left = Math.max(1, 365 - days);
    return Pp(({ 0: 'Every single one of them brand new.', 1: 'You’ve been awake for most of them.', 2: 'And she’s smiled at you for some of them.', 3: wk + ' weeks of getting to know each other.',
      4: hrs + ' hours of new things to look at.', 5: 'That’s ' + hrs + ' hours of watching you.', 6: 'Six months of firsts, and counting.',
      7: wk + ' weeks, and every one a little different.', 8: 'And she knows exactly who you are.', 9: 'Almost as long as she spent growing before she was born.',
      10: 'Longer now than she spent growing before she was born.', 11: 'Just ' + left + ' days until her first birthday.' })[m] || '');
  }
  function daysScreen(n, p, days, firsts) { return { id: 'days', bg: '#f6c9a8', ink: '#2B2840', dur: firsts.length ? 6200 : 4800, html:
    '<p class="st-lead st-in" style="--d:.05s"><b>' + E(n) + ' has been here for</b></p>' +
    '<div class="st-count st-pop" style="--d:.2s"><b data-count="' + days + '">0</b><span>' + (days === 1 ? 'day' : 'days') + ' Earthside.</span></div>' +
    (firsts.length ? '<div class="st-lastm st-in" style="--d:1.6s"><p class="st-kicker">Last month, you saw</p><div class="st-chips">' + firsts.map(function (f) { return '<span><i>★</i>' + E(f) + '</span>'; }).join('') + '</div></div>'
      : '<p class="st-hand st-in" style="--d:1.7s">' + E(daysLine(days)) + '</p>') +
    '<div class="st-ground' + (firsts.length ? ' st-ground-sm' : '') + '">' + cloud('#fbe0cc') + '<div class="st-objwrap st-right">' + rings() + burst('#fff6ec') + '</div></div>' }; }
  function summary(n, p, days, pic, firsts, nx, sum, m) {
    var dots = ['#cfc3ea', '#f2b6c8', '#8e9fd6'];
    return { id: 'summary', bg: '#2B2840', ink: '#fffaf3', dur: 0, html:
      '<div class="st-card st-pop" style="--d:.05s">' +
        (pic ? '<div class="st-card-photo"><img src="' + pic + '" alt=""></div>' : '') +
        '<div class="st-card-title">' + E(n) + ' at ' + (m === 0 ? Math.max(1, Math.round(days / 7)) + ' week' + (Math.round(days / 7) > 1 ? 's' : '') : m + ' month' + (m === 1 ? '' : 's')) + '</div>' +
        '<p class="st-card-days">' + fmt(days) + (days === 1 ? ' day' : ' days') + ' Earthside</p>' +
        '<div class="st-card-sec"><p class="st-card-k">' + (m === 0 ? 'These first weeks' : 'This month') + '</p><ol>' + sum.map(function (x, i) { return '<li><i style="background:' + dots[i % 3] + '"></i>' + E(Pp(x)) + '</li>'; }).join('') + '</ol></div>' +
        (firsts.length ? '<div class="st-card-sec"><p class="st-card-k">Last month’s firsts</p><div class="st-chips">' + firsts.map(function (f) { return '<span><i>★</i>' + E(f) + '</span>'; }).join('') + '</div></div>' : '') +
        '<div class="st-card-sec st-card-next"><p class="st-card-k">Coming up</p><b>' + E(nx.title.replace(/[.!]$/, '')) + '</b></div>' +
      '</div>' +
      '<div class="st-card-actions st-in" style="--d:.4s"><button class="st-btn is-quiet" data-act="replay">Watch again</button><button class="st-btn" data-act="done">Done</button></div>' };
  }

  /* ---------- Player ---------- */
  var S = null;
  function open() {
    close();
    var list = slides(), el = document.createElement('div');
    el.className = 'st-player'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', nm() + '’s month');
    el.innerHTML = '<div class="st-bars">' + list.map(function () { return '<span><i></i></span>'; }).join('') + '</div>' +
      '<button class="st-close" aria-label="Close">×</button>' +
      list.map(function (s, i) { return '<section class="st-slide st-' + s.id + '" data-i="' + i + '" style="--bg:' + s.bg + ';--ink:' + s.ink + '">' + s.html + '</section>'; }).join('') +
      '<button class="st-tap st-tap-l" aria-label="Back"></button><button class="st-tap st-tap-r" aria-label="Next"></button>';
    document.body.appendChild(el);
    S = { el: el, list: list, i: -1, t0: 0, left: 0, paused: false, raf: 0, timer: 0 };
    el.querySelector('.st-close').onclick = close;
    el.querySelector('.st-tap-l').onclick = function () { go(S.i - 1); };
    el.querySelector('.st-tap-r').onclick = function () { go(S.i + 1); };
    // Hold anywhere to pause, like any story.
    var hold = function (v) { return function (e) { if (e.target.closest('.st-close,.st-btn,.st-opt,[data-peek]')) return; pause(v); }; };
    el.addEventListener('pointerdown', hold(true)); el.addEventListener('pointerup', hold(false)); el.addEventListener('pointercancel', hold(false));
    el.addEventListener('click', function (e) {
      var o = e.target.closest('.st-opt'); if (o) { answer(o.closest('.st-slide'), +o.dataset.i); return; }
      var pk = e.target.closest('[data-peek]'); if (pk) { pk.classList.add('is-open'); return; }
      var b = e.target.closest('.st-btn'); if (!b) return; if (b.dataset.act === 'replay') go(0); else close(); });
    document.addEventListener('keydown', keys);
    requestAnimationFrame(function () { el.classList.add('is-open'); go(0); });
  }
  function answer(sec, i) {
    if (!sec || sec.classList.contains('is-answered')) return;
    var box = sec.querySelector('.st-opts'), a = +box.dataset.a;
    sec.classList.add('is-answered');
    box.querySelectorAll('.st-opt').forEach(function (b, k) { b.classList.toggle('is-right', k === a); b.classList.toggle('is-wrong', k === i && k !== a); });
  }
  function keys(e) { if (!S) return; if (e.key === 'ArrowRight') go(S.i + 1); else if (e.key === 'ArrowLeft') go(S.i - 1); else if (e.key === 'Escape') close(); }
  function close() { if (!S) return; cancelAnimationFrame(S.raf); clearTimeout(S.timer); S.el.remove(); document.removeEventListener('keydown', keys); S = null; }
  function go(i) {
    if (!S) return;
    if (i < 0) i = 0;
    if (i >= S.list.length) return; // the last card stays until closed
    S.i = i; cancelAnimationFrame(S.raf); clearTimeout(S.timer);
    var secs = S.el.querySelectorAll('.st-slide'), bars = S.el.querySelectorAll('.st-bars i');
    secs.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
    bars.forEach(function (b, k) { b.style.width = k < i ? '100%' : '0%'; });
    S.el.style.setProperty('--bar-ink', S.list[i].ink);
    
    // Restart this slide's animations from the top.
    var cur = secs[i]; cur.classList.remove('is-on'); void cur.offsetWidth; cur.classList.add('is-on');
    countUp(cur);
    clearTimeout(S.auto);
    if (cur.querySelector('.st-opts')) S.auto = setTimeout(function () { answer(cur, -1); }, 4600);
    var pk = cur.querySelector('[data-peek]'); if (pk) { pk.classList.remove('is-open'); S.auto = setTimeout(function () { pk.classList.add('is-open'); }, 3800); }
    var dur = S.list[i].dur;
    S.left = dur; S.t0 = performance.now(); S.paused = false;
    if (dur) tick();
    else bars[i].style.width = '100%';
  }
  function tick() {
    if (!S || S.paused) return;
    var dur = S.list[S.i].dur, el = performance.now() - S.t0, done = dur - S.left + el;
    S.el.querySelectorAll('.st-bars i')[S.i].style.width = Math.min(100, done / dur * 100) + '%';
    if (done >= dur) { go(S.i + 1); return; }
    S.raf = requestAnimationFrame(tick);
  }
  function pause(v) {
    if (!S || !S.list[S.i].dur || S.paused === v) return;
    S.paused = v; S.el.classList.toggle('is-paused', v);
    if (v) { S.left -= performance.now() - S.t0; cancelAnimationFrame(S.raf); }
    else { S.t0 = performance.now(); tick(); }
  }
  function countUp(sec) {
    var b = sec.querySelector('[data-count]'); if (!b) return;
    var to = +b.dataset.count, start = performance.now() + 250, len = 900;
    var step = function (t) {
      if (!S) return;
      var k = Math.max(0, Math.min(1, (t - start) / len)); k = 1 - Math.pow(1 - k, 3);
      b.textContent = fmt(Math.round(to * k));
      if (k < 1) requestAnimationFrame(step);
    };
    b.textContent = '0'; requestAnimationFrame(step);
  }
  function isLight(hex) { var h = hex.replace('#', ''), r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16); return (r * 299 + g * 587 + b * 114) / 1000 > 140; }
  function shareNote() {
    if (!S || S.el.querySelector('.st-note')) return;
    var n = document.createElement('p'); n.className = 'st-note'; n.textContent = 'In the app, this opens your phone’s share sheet with the card.';
    S.el.querySelector('.st-card').parentNode.appendChild(n);
  }
  window.stOpen = open;
  // The month card's picture: one small scene in the story's toy style, matching that month's teaser.
  function crown() { var g = blob('#ffd98a', '#fff1c8', '#e3b259'); return svg('0 0 100 60', g.def, '<path d="M10 52 L16 14 L36 34 L50 6 L64 34 L84 14 L90 52 Z" fill="' + g.url + '"/><circle cx="50" cy="8" r="6" fill="#e98a6b"/>', 'st-obj ms-crown'); }
  function faceSvg() { var w = blob('#fff3e6', '#ffffff', '#ecd6c3'); return svg('0 0 200 200', w.def, '<circle cx="100" cy="104" r="84" fill="' + w.url + '"/><circle cx="72" cy="96" r="7" fill="#2B2840"/><circle cx="128" cy="96" r="7" fill="#2B2840"/><ellipse cx="58" cy="122" rx="13" ry="8" fill="#f6c2cf"/><ellipse cx="142" cy="122" rx="13" ry="8" fill="#f6c2cf"/><path d="M76 128 Q100 150 124 128" fill="none" stroke="#2B2840" stroke-width="7" stroke-linecap="round"/>'); }
  function gift() { var b = blob('#b9a6e6', '#ddd2f7', '#8f7bc4'), r = blob('#ffd98a', '#fff1c8', '#e3b259');
    return svg('0 0 200 190', b.def + r.def, shadow(100, 180, 76) + '<rect x="30" y="74" width="140" height="100" rx="18" fill="' + b.url + '"/><rect x="22" y="54" width="156" height="34" rx="12" fill="' + b.url + '"/><rect x="88" y="54" width="24" height="120" fill="' + r.url + '"/><path d="M100 54 C 70 20, 50 40, 70 54 Z M100 54 C 130 20, 150 40, 130 54 Z" fill="' + r.url + '"/>'); }
  function mag() { var g = blob('#ffd98a', '#fff1c8', '#e3b259'), h = blob('#e98a6b', '#f6b49c', '#c96f52');
    return svg('0 0 200 200', g.def + h.def, '<rect x="118" y="112" width="30" height="78" rx="15" transform="rotate(-40 133 151)" fill="' + h.url + '"/><circle cx="84" cy="84" r="62" fill="' + g.url + '"/><circle cx="84" cy="84" r="44" fill="#eaf4fb"/><path d="M58 70 Q66 56 82 52" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>'); }
  /* The month card's baby: one clay-style baby per month, posed to match that month's teaser. */
  function babyArt(m) {
    var newborn = m === 0; if (newborn) m = 1;
    var sk = blob('#f5c3a0', '#fde3cf', '#de9d79');
    var TONE = { 1: ['#cfe3f3', '#eef6fc', '#a9c9e3'], 2: ['#b9a6e6', '#ddd2f7', '#8f7bc4'], 3: ['#9cc7ae', '#cfe6d9', '#76a88b'], 4: ['#f3a587', '#fbd0bf', '#da7f61'],
      5: ['#a9cfe8', '#d6ebf7', '#7fb0d2'], 6: ['#ffd98a', '#fff1c8', '#e3b259'], 7: ['#f3a587', '#fbd0bf', '#da7f61'], 8: ['#f6c2cf', '#fbe0e7', '#e29bb0'],
      9: ['#9cc7ae', '#cfe6d9', '#76a88b'], 10: ['#b9a6e6', '#ddd2f7', '#8f7bc4'], 11: ['#f6c2cf', '#fbe0e7', '#e29bb0'] }[m];
    var on = blob(TONE[0], TONE[1], TONE[2]), y = blob('#ffd98a', '#fff1c8', '#e3b259'), c = blob('#e98a6b', '#f6b49c', '#c96f52');
    var S = sk.url, O = on.url, INK = '#2B2840';
    var el = function (cx, cy, rx, ry, f, rot) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '') + '/>'; };
    var face = function (x, y0, eyes, mouth, k) {
      k = k || 1; var e = 15 * k, g = '';
      if (eyes === 'closed') g += '<path d="M' + (x - e - 6) + ' ' + y0 + ' q6 6 12 0 M' + (x + e - 6) + ' ' + y0 + ' q6 6 12 0" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>';
      else { var r = eyes === 'wide' ? 6.5 : 5.2; g += '<circle cx="' + (x - e) + '" cy="' + y0 + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + (x + e) + '" cy="' + y0 + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + (x - e + 1.8) + '" cy="' + (y0 - 2) + '" r="1.8" fill="#fff"/><circle cx="' + (x + e + 1.8) + '" cy="' + (y0 - 2) + '" r="1.8" fill="#fff"/>'; }
      g += el(x - e - 9, y0 + 14, 8, 5, '#f39aa8') + el(x + e + 9, y0 + 14, 8, 5, '#f39aa8');
      var my = y0 + 18;
      if (mouth === 'o') g += el(x, my + 2, 5, 6, INK);
      else if (mouth === 'grin') g += '<path d="M' + (x - 10) + ' ' + my + ' q10 14 20 0 z" fill="' + INK + '"/><path d="M' + (x - 5) + ' ' + (my + 5) + ' q5 4 10 0" fill="#f39aa8"/>';
      else g += '<path d="M' + (x - 7) + ' ' + my + ' q7 7 14 0" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>';
      return g;
    };
    var head = function (x, y0, r, eyes, mouth, noHair) {
      return el(x - r + 2, y0 + 4, 9, 10, S) + el(x + r - 2, y0 + 4, 9, 10, S) + '<circle cx="' + x + '" cy="' + y0 + '" r="' + r + '" fill="' + S + '"/>' +
        (noHair ? '' : '<path d="M' + (x - 8) + ' ' + (y0 - r + 6) + ' q4 -16 16 -10 q-8 2 -6 10" fill="none" stroke="#9a6a50" stroke-width="5" stroke-linecap="round"/>') +
        face(x, y0 + 2, eyes, mouth, r / 44);
    };
    var hand = function (x, y0, r) { return '<circle cx="' + x + '" cy="' + y0 + '" r="' + (r || 11) + '" fill="' + S + '"/>'; };
    // a sitting baby, with arm and leg overrides
    var sit = function (o) {
      o = o || {};
      return (o.legsUp ? '' : el(70, 182, 26, 14, S) + el(130, 182, 26, 14, S)) +
        el(100, 150, 46, 40, O) + (o.bib ? '<path d="M78 124 q22 30 44 0 q-4 22 -22 26 q-18 -4 -22 -26z" fill="#fffaf3"/>' : '') +
        (o.arms || (el(58, 150, 11, 22, S, 22) + el(142, 150, 11, 22, S, -22))) +
        head(100, 84, 44, o.eyes || 'open', o.mouth || 'smile') + (o.over || '') + (o.top || '');
    };
    var P = {
      1: el(100, 150, 50, 46, O) + '<path d="M60 136 q40 24 80 0" fill="none" stroke="' + TONE[2] + '" stroke-width="5" stroke-linecap="round"/><path d="M58 160 q42 22 84 0" fill="none" stroke="' + TONE[2] + '" stroke-width="5" stroke-linecap="round"/>' +
        head(100, 90, 42, 'closed', 'smile', true) +
        '<path d="M74 52 L78 26 L90 40 L100 20 L110 40 L122 26 L126 52 Z" fill="' + y.url + '"/><circle cx="100" cy="22" r="5" fill="#e98a6b"/>',
      2: sit({ mouth: 'o', arms: el(58, 150, 11, 22, S, 22) + el(146, 128, 11, 22, S, -50) + hand(156, 112) }) +
        '<rect x="134" y="20" width="58" height="34" rx="14" fill="' + INK + '"/><path d="M146 52 l-6 12 l14 -12z" fill="' + INK + '"/><text x="163" y="43" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="17" fill="#fffaf3">ooh!</text>',
      3: sit({ mouth: 'grin', eyes: 'closed', arms: el(52, 120, 11, 24, S, 40) + hand(42, 100) + el(148, 120, 11, 24, S, -40) + hand(158, 100) }) +
        '<rect x="22" y="40" width="9" height="9" rx="2" fill="#e98a6b" transform="rotate(20 26 44)"/><rect x="166" y="34" width="9" height="9" rx="2" fill="#ffd98a" transform="rotate(-15 170 38)"/><rect x="40" y="16" width="8" height="8" rx="2" fill="#7d6597"/><rect x="150" y="62" width="8" height="8" rx="2" fill="#7fae95" transform="rotate(30 154 66)"/>',
      4: el(116, 168, 54, 24, O) + el(158, 146, 10, 24, S, -38) + el(170, 128, 13, 9, S, -38) + el(146, 150, 10, 22, S, -20) + el(152, 130, 12, 9, S, -20) +
        el(62, 184, 24, 9, S) + el(96, 186, 22, 9, S) + '<g transform="rotate(-6 74 128)">' + head(74, 128, 40, 'wide', 'o') + '</g>' +
        '<text x="140" y="66" font-family="Nunito,sans-serif" font-weight="900" font-size="34" fill="#ffd98a">✦</text><text x="118" y="38" font-family="Nunito,sans-serif" font-weight="900" font-size="20" fill="#e98a6b">✦</text>',
      5: sit({ legsUp: true, mouth: 'grin', arms: el(50, 132, 11, 22, S, 70) + hand(32, 124, 10) + el(150, 132, 11, 22, S, -70) + hand(168, 124, 10),
        over: el(78, 178, 12, 24, S, 60) + el(122, 178, 12, 24, S, -60) + el(56, 166, 15, 11, S, 30) + el(144, 166, 15, 11, S, -30) +
          '<circle cx="46" cy="160" r="3.6" fill="#de9d79"/><circle cx="52" cy="156" r="3.2" fill="#de9d79"/><circle cx="154" cy="160" r="3.6" fill="#de9d79"/><circle cx="148" cy="156" r="3.2" fill="#de9d79"/>' +
          '<path d="M30 176 q-8 10 0 20 M18 172 q-8 14 0 28 M170 176 q8 10 0 20 M182 172 q8 14 0 28" fill="none" stroke="#2B2840" stroke-width="3" stroke-linecap="round" opacity=".28"/>' }),
      6: sit({ bib: true, mouth: 'o', arms: el(58, 150, 11, 22, S, 22) + el(144, 132, 11, 22, S, -40) + '<rect x="146" y="70" width="8" height="54" rx="4" fill="#e3b259" transform="rotate(14 150 97)"/>' + el(158, 70, 13, 9, y.url, 14) + hand(150, 118) }) +
        el(116, 112, 5, 4, '#e3b259'),
      7: sit({ mouth: 'grin', arms: el(58, 150, 11, 22, S, 22) + el(146, 112, 11, 24, S, -30) + hand(156, 90) }) +
        '<circle cx="176" cy="150" r="16" fill="' + c.url + '"/><path d="M176 100 v26 M168 108 v14 M184 108 v14" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" opacity=".35"/>',
      8: sit({ arms: '', mouth: 'grin', over: el(70, 124, 12, 30, S, -18) + el(130, 124, 12, 30, S, 18) + el(82, 86, 17, 15, S) + el(118, 86, 17, 15, S) }),
      9: el(108, 140, 54, 30, O) + el(150, 172, 10, 22, S) + el(66, 170, 10, 22, S) + el(160, 152, 16, 20, O, 20) + el(166, 178, 18, 10, S) +
        head(56, 108, 40, 'wide', 'smile') +
        '<g transform="translate(118 46) rotate(-20)"><circle cx="20" cy="20" r="18" fill="' + y.url + '"/><circle cx="20" cy="20" r="12" fill="#eaf4fb"/><rect x="34" y="16" width="26" height="9" rx="4.5" fill="' + c.url + '" transform="rotate(40 34 20)"/></g>',
      10: '<rect x="128" y="128" width="66" height="70" rx="16" fill="' + on.url + '" opacity=".55"/><rect x="122" y="118" width="78" height="22" rx="11" fill="' + TONE[2] + '"/>' +
        el(70, 194, 12, 8, S) + el(100, 194, 12, 8, S) + '<rect x="62" y="152" width="17" height="42" rx="8.5" fill="' + S + '" transform="rotate(6 70 172)"/><rect x="92" y="152" width="17" height="42" rx="8.5" fill="' + S + '" transform="rotate(-6 100 172)"/>' +
        el(86, 140, 38, 32, O, 6) + el(118, 128, 10, 22, S, -60) + hand(134, 120) + el(52, 110, 10, 22, S, 24) + hand(46, 90) +
        '<g transform="rotate(8 86 76)">' + head(86, 76, 37, 'open', 'grin') + '</g>',
      11: '<path d="M42 66 q4 50 20 84" fill="none" stroke="' + INK + '" stroke-width="2" opacity=".5"/>' + el(40, 40, 22, 26, y.url) + '<path d="M36 64 l4 6 l4 -6z" fill="#e3b259"/>' +
        el(84, 192, 12, 8, S) + el(116, 192, 12, 8, S) + '<rect x="76" y="150" width="18" height="42" rx="9" fill="' + S + '"/><rect x="106" y="150" width="18" height="42" rx="9" fill="' + S + '"/>' +
        el(100, 140, 40, 34, O) + el(70, 150, 10, 20, S, 40) + hand(62, 150) + el(144, 110, 10, 22, S, -36) + hand(154, 90) +
        '<path d="M168 70 q8 8 4 18 M176 62 q12 12 6 28" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" opacity=".3"/>' +
        '<g transform="rotate(-8 100 78)">' + head(100, 78, 38, 'closed', 'grin') + '<path d="M80 46 L100 4 L120 46 Z" fill="' + c.url + '"/><circle cx="100" cy="6" r="6" fill="#ffd98a"/><path d="M90 26 l20 0 M86 36 l28 0" stroke="#fffaf3" stroke-width="3" opacity=".6"/></g>'
    };
    var body = newborn ? P[1].replace(/<path d="M74 52[^>]*\/><circle cx="100" cy="22"[^>]*\/>/, '') : P[m];
    return svg('0 0 200 210', sk.def + on.def + y.def + c.def, shadow(100, 202, 70) + body, 'st-obj ms-baby');
  }
  // Clay toys for other pages (Timeline's chapters).
  window.stToy = function (k) { return k === 'cake' ? V.cake().replace('st-vis', 'st-vis yt-cake') : ({ bunny: bunny, rings: rings, ball: ball, blocks: blocks, bowl: bowl })[k](); };
  window.stCardArt = function (m) { return m >= 0 && m <= 11 ? '<span class="ms-l ms-mid ms-babyw">' + babyArt(m) + '</span>' : ''; };
  // What Home's month card shows: the story's cover and its three takeaways.
  window.stCover = function (m) {
    if (m < 0 || m > 11) return null;
    var st = m === 4 ? { cover: ['She’s done just watching.', 'The world is getting a lot more interesting.'], sum: ['Found her hands', 'Distracted feeds', 'Sleep is maturing'] } : STORIES[m];
    if (!st) return null;
    var TEASE = { 0: 'Tiny, brand new, and already the boss.', 1: 'New here. Already running the show.', 2: 'She’s finding her voice. You’ll hear about it.', 3: 'A little more personality. A lot more surprises.',
      4: 'Someone’s getting curious.', 5: 'Those little wiggles have big plans.', 6: 'Halfway to one. A whole lot of firsts.', 7: 'Gravity has a new biggest fan.',
      8: 'Peekaboo just got a plot twist.', 9: 'Little hands. Big investigations.', 10: 'She’s moving up in the world.', 11: 'Big baby energy. First birthday loading.' };
    return { title: Pp(st.cover[0]), lead: Pp(st.cover[1]), tease: Pp(TEASE[m]), sum: st.sum.map(Pp) };
  };

  /* ---------- Entry: the month card is the story's cover ---------- */
  function decorate() {
    if (!on() || page !== 'home') return;
    var mm = month(); if (mm < 1 || mm > 11) return;
    var hero = document.querySelector('#main .he-hero'); if (!hero || !hero.dataset || hero.dataset.st || hero.classList.contains('he-story')) return;
    hero.dataset.st = '1';
    var copy = hero.querySelector('.he-copy'); if (!copy) return;
    var b = document.createElement('button'); b.className = 'he-see st-play';
    b.innerHTML = '<span class="st-play-ring"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.5v9l7.5-4.5z"/></svg></span>Watch ' + E(nm()) + '’s month';
    b.onclick = function (e) { e.stopPropagation(); open(); };
    var old = copy.querySelector('.he-see'); if (old) old.replaceWith(b); else copy.appendChild(b);
  }

  var base = window.render;
  window.render = render = function () { var r = base.apply(this, arguments); try { decorate(); } catch (e) { console.error(e); } return r; };
})();
