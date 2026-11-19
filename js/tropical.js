// Tidal Weather: the Tropical display style (in progress: switched on only on the test site)
// Part of the page script, split by topic; index.html loads these files in order and they share one scope.
'use strict';

/* ---------- Tropical display style ---------- */
// An island beach: a turquoise sea with a little palm island on the horizon, waves washing up a white-sand beach, a
// thatched beach hut on the left, and a guy in sunglasses and a Hawaiian shirt lazing in a striped hammock slung
// between two palm trees, now and then sipping a coconut drink. In bad weather (any rain, storms, high wind, heavy
// snow) the hammock swings empty and he's peeking out of the hut door. The palm fronds sway, a lot in wind and storms.
// Tiki torches by the hut are lit in the evening and at night.
let tropic = null;
function buildTropic() {
  if (S.display !== 'tropical') return null;
  const { kind, tod } = mode, night = tod === 'night', golden = tod === 'golden', portrait = Hd > Wd;
  const tint = night ? [[10, 18, 40], .6] : golden ? [[70, 32, 44], .35] : sc.tone === 'storm' ? [[30, 38, 44], .35] : sc.tone === 'dark' ? [[30, 40, 50], .2] : null;
  const tc = h => `rgb(${tint ? mix(hexRgb(h), tint[0], tint[1]) : hexRgb(h)})`;
  const C = {};
  for (const [k, h] of Object.entries({ trunk: '#a07c55', ring: '#7c5a3a', frond: '#3f9a4a', frondDark: '#2b7438', coconut: '#5a3e22',
    fabric: '#2c4a7a', fabric2: '#f3ead6', rope: '#cdb88c', skin: '#e3a77c', hair: '#3a2716', shirt: '#e2473b', flower: '#fff4d6', flower2: '#ffd84a', outline: '#3a2418',
    shorts: '#1fa59a', glasses: '#141414', wall: '#c99d64', bamboo: '#a37a46', roof: '#d8b468', roofDark: '#a8823e', door: '#3a2614',
    coco: '#7a5230', cocoIn: '#f4efe4', straw: '#e84a6a', parasol: '#f25a9a', torch: '#6a4a2a', snow: '#f4f7fa' })) C[k] = tc(h);
  const s = Math.min(Hd / 1080, Wd / 700) * (portrait ? 1 : 1.25), ax = Wd * (portrait ? .62 : .345);
  const b = { top: Hd * (portrait ? .55 : .575), shore: Hd * (portrait ? .65 : .655), gy: Hd * (portrait ? .75 : .73), night, golden, kind, C, s, ax,
    inside: !!(sc.rain || sc.storm || sc.wind || sc.swirl || kind === 'heavysnow'), snowy: !!sc.snow,
    pa: ax - 105 * s, pb: ax + 105 * s, hx: ax - 238 * s,   // the two palms, and the hut
    wind: sc.swirl ? .09 : sc.tornado ? .08 : sc.wind ? .05 : sc.storm ? .03 : 0,
    sip: { st: 'rest', t: 0, dur: rnd(6, 12) } };
  // more palms at the sides of the screen, nearer to us: [across, below the beach line, height, lean, size, sway phase]
  b.sidePalms = portrait ? [[.05, 60, 300, 40, 1.2, 2.1], [.97, 80, 300, -40, 1.25, 6]]
    : [[.035, 60, 330, 40, 1.35, 2.1], [.12, 92, 270, -30, 1.2, 3.4], [.53, 40, 300, -35, 1.2, 4.2], [.8, 70, 340, 30, 1.35, 5], [.97, 100, 300, -40, 1.3, 6]];
  b.bg = tropicBackdrop(b);
  return b;
}
function tropicBackdrop(b) {   // the sea, the island on the horizon and the beach, drawn once
  const [c, x] = mk(Wd, Hd), sx = Wd / 1920, sy = Hd / 1080, { kind } = mode;
  const greyed = sc.tone === 'dark' || sc.tone === 'storm' || sc.tone === 'overcast' || sc.tone === 'grey' || kind === 'fog';
  const P = b.night ? { sea0: '#10243a', sea1: '#14404a', isl: '#0c1a24', sand0: '#5b5446', sand1: '#3e3a32', wet: '#4a453a' }
    : b.golden ? { sea0: '#7a6a9a', sea1: '#c99a86', isl: '#4a3a4a', sand0: '#e2bf94', sand1: '#c9a47a', wet: '#bf9a72' }
    : greyed ? { sea0: '#5a7a88', sea1: '#6a9c98', isl: '#4a5e58', sand0: '#d9ccae', sand1: '#bfb194', wet: '#b3a58a' }
    : { sea0: '#2f8fc4', sea1: '#41d1c6', isl: '#3d7550', sand0: '#f5e4b8', sand1: '#e7cf9a', wet: '#dcc28c' };
  b.P = P;
  const sea = x.createLinearGradient(0, b.top, 0, b.shore + 30 * sy);
  sea.addColorStop(0, P.sea0); sea.addColorStop(1, P.sea1);
  x.fillStyle = sea; x.fillRect(0, b.top, Wd, Hd - b.top);
  // a little island with two palms on the horizon
  const ix = Wd * (Wd > Hd ? .27 : .2), iw = 130 * sx, ih = 16 * sy;
  x.fillStyle = P.isl; x.beginPath(); x.moveTo(ix - iw / 2, b.top + 1); x.quadraticCurveTo(ix - iw * .2, b.top - ih * 1.6, ix + iw * .1, b.top - ih); x.quadraticCurveTo(ix + iw * .35, b.top - ih * .7, ix + iw / 2, b.top + 1); x.closePath(); x.fill();
  x.strokeStyle = P.isl; x.lineWidth = 2.2 * sy; x.lineCap = 'round';
  for (const [px, h, lean] of [[ix - 18 * sx, 34, -5], [ix + 6 * sx, 42, 6]]) {
    x.beginPath(); x.moveTo(px, b.top - ih * .9); x.quadraticCurveTo(px + lean * .3 * sx, b.top - h * .6 * sy, px + lean * sx, b.top - h * sy); x.stroke();
    for (let i = 0; i < 7; i++) { const a = Math.PI * (1.05 + i * .18); x.beginPath(); x.moveTo(px + lean * sx, b.top - h * sy); x.quadraticCurveTo(px + lean * sx + Math.cos(a) * 9 * sx, b.top - h * sy + Math.sin(a) * 8 * sy - 3 * sy, px + lean * sx + Math.cos(a) * 15 * sx, b.top - h * sy + Math.sin(a) * 5 * sy + 4 * sy); x.stroke(); }
  }
  // the beach: a gently curving shoreline, a band of wet sand, then dry sand
  const edge = px => b.shore + Math.sin(px * .0045 / sx) * 9 * sy + Math.sin(px * .011 / sx + 1) * 4 * sy;
  b.edge = edge;
  x.fillStyle = P.wet; x.beginPath(); x.moveTo(0, Hd); for (let px = 0; px <= Wd + 10; px += 10) x.lineTo(px, edge(px)); x.lineTo(Wd, Hd); x.closePath(); x.fill();
  const sand = x.createLinearGradient(0, b.shore, 0, Hd); sand.addColorStop(0, P.sand0); sand.addColorStop(1, P.sand1);
  x.fillStyle = sand; x.beginPath(); x.moveTo(0, Hd); for (let px = 0; px <= Wd + 10; px += 10) x.lineTo(px, edge(px) + 22 * sy); x.lineTo(Wd, Hd); x.closePath(); x.fill();
  for (let i = 0; i < 260 * sx; i++) { x.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '120,90,50'},${rnd(.08, .2)})`; x.fillRect(rnd(0, Wd), rnd(b.shore + 26 * sy, Hd), 2 * sx, 2 * sx); }   // grains
  if (b.snowy) { x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(0, b.shore + 22 * sy, Wd, Hd); }
  // a couple of starfish and shells on the sand
  const star = (cx, cy, r, col) => { x.fillStyle = col; x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .6); } x.closePath(); x.fill(); };
  const s = b.s;
  if (!b.snowy) {
    star(b.ax + 40 * s, b.gy + 46 * s, 9 * s, b.night ? '#5a3a32' : '#e8774a'); star(b.ax - 150 * s, b.gy + 70 * s, 7 * s, b.night ? '#5a3a40' : '#e86a7a');
    x.fillStyle = b.night ? '#7a7468' : '#fbf3e6'; x.beginPath(); x.ellipse(b.ax + 130 * s, b.gy + 30 * s, 5 * s, 3.5 * s, .3, 0, 7); x.ellipse(b.ax - 60 * s, b.gy + 95 * s, 4 * s, 3 * s, -.4, 0, 7); x.fill();
  }
  return c;
}
function tropicTick(dt, t) {   // his drink: resting on his belly → up to his mouth for a sip → back down
  const p = tropic.sip; p.t += dt;
  if (p.st === 'rest' && p.t > p.dur) { p.st = 'sip'; p.t = 0; }
  else if (p.st === 'sip' && p.t > 2.6) { p.st = 'rest'; p.t = 0; p.dur = rnd(7, 13); if (Math.random() < .25) talk.react = 'snack'; }   // (now and then he says how good it was)
}
function drawTropic(ts) {
  const b = tropic, t = ts / 1000, s = b.s, C = b.C, sy = Hd / 1080, rough = b.wind || (sc.rain ? .02 : 0);
  g.drawImage(b.bg, 0, 0);
  // the sea: soft glints drifting on the water, and the waves washing up and back on the sand with a line of foam
  g.save(); g.globalAlpha = b.night ? .12 : .22; g.strokeStyle = '#fff'; g.lineWidth = 1.5 * sy;
  for (let i = 0; i < 14; i++) { const yy = lrp(b.top + 8 * sy, b.shore - 8 * sy, (i * .37) % 1), xx = ((i * 211 + t * (8 + i)) % (Wd + 200)) - 100; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + (30 + i * 4) * sy, yy); g.stroke(); }
  g.restore();
  const amp = (10 + rough * 400) * sy;
  for (const [lag, alpha] of [[0, .9], [1.6, .55]]) {
    const wash = (Math.sin(t * .55 - lag) * .5 + .5) * amp + 6 * sy;
    g.beginPath(); g.moveTo(0, b.top + 30 * sy);
    for (let px = 0; px <= Wd + 10; px += 12) g.lineTo(px, b.edge(px) + wash + Math.sin(px * .02 + t * 1.3 + lag) * 2 * sy);
    g.lineTo(Wd, b.top + 30 * sy); g.closePath();
    g.globalAlpha = alpha * .6; g.fillStyle = b.P.sea1; g.fill();
    g.globalAlpha = alpha; g.strokeStyle = b.night ? 'rgba(200,215,230,.7)' : 'rgba(255,255,255,.9)'; g.lineWidth = 2.6 * sy; g.beginPath();
    for (let px = 0; px <= Wd + 10; px += 12) { const yy = b.edge(px) + wash + Math.sin(px * .02 + t * 1.3 + lag) * 2 * sy; px ? g.lineTo(px, yy) : g.moveTo(px, yy); }
    g.stroke(); g.globalAlpha = 1;
  }
  drawHut(b, t);
  drawHammock(b, t);
  if (b.night || b.golden) drawTorches(b, t);
  // a few more palms at the sides, nearer to us
  for (const [u, dy, h, lean, sz, ph] of b.sidePalms) palm(b, t, u * Wd, b.gy + dy * s, h * s, lean * s, ph, sz);
  if (talk.line) {   // his speech bubble, from his head in the hammock or in the hut door
    const [hx, hy] = b.inside || !b.headAt ? [b.hx + 17 * s, b.gy - 62 * s] : b.headAt;
    drawThought(t, hx, hy - 10 * s);
  }
}
// a palm from its base (x, y): a curving ringed trunk leaning by dx, with drooping fronds that sway in the breeze
// and stream out in the wind; returns the trunk's point at a height
function palm(b, t, x, y, h, dx, ph, sz = 1) {
  const C = b.C, s = b.s * sz, lean = forestLean(b, t, ph) * 260 * s, top = [x + dx + lean, y - h];
  const at = u => [lrp(x, top[0], u * u * .7 + u * .3), lrp(y, top[1], u)];
  g.save(); g.lineCap = 'round';
  for (let i = 0; i < 18; i++) {   // the trunk, in short segments that taper, with darker rings between them
    const [x0, y0] = at(i / 18), [x1, y1] = at((i + 1) / 18);
    g.strokeStyle = C.trunk; g.lineWidth = (13 - i * .35) * s; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    g.strokeStyle = C.ring; g.lineWidth = 1.2 * s; g.beginPath(); g.moveTo(x1 - (6 - i * .17) * s, y1); g.lineTo(x1 + (6 - i * .17) * s, y1 + 1.5 * s); g.stroke();
  }
  const blow = forestLean(b, t, ph + .5) * 9;   // (fronds streaming downwind)
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (1.02 + i * .122) + Math.sin(t * 1.1 + i * 1.7 + ph) * .05 + blow * .5;   // (the whole crown turns downwind)
    const L = (74 + (i % 3) * 9) * s, mid = [top[0] + Math.cos(a) * L * .55, top[1] + Math.sin(a) * L * .55 - 10 * s];
    const tip = [top[0] + Math.cos(a) * L, top[1] + Math.sin(a) * L * .55 + L * .35];
    const nx = -Math.sin(a), ny = Math.cos(a);
    g.fillStyle = i % 2 ? C.frondDark : C.frond; g.beginPath(); g.moveTo(...top);
    g.quadraticCurveTo(mid[0] + nx * 9 * s, mid[1] + ny * 9 * s, ...tip); g.quadraticCurveTo(mid[0] - nx * 3 * s, mid[1] - ny * 3 * s + 4 * s, top[0], top[1] + 3 * s); g.fill();
    g.strokeStyle = i % 2 ? C.frond : C.frondDark; g.lineWidth = 1 * s;   // leaflet notches along the frond
    for (let k = 1; k < 6; k++) { const u = k / 6, px = lrp(top[0], tip[0], u), py = lrp(top[1], tip[1], u) - Math.sin(Math.PI * u) * 8 * s; g.beginPath(); g.moveTo(px, py); g.lineTo(px + nx * 7 * s, py + ny * 7 * s + 3 * s); g.stroke(); }
  }
  g.fillStyle = C.coconut; for (const [ox, oy] of [[-4, 4], [4, 5], [0, 8]]) { g.beginPath(); g.arc(top[0] + ox * s, top[1] + oy * s, 4 * s, 0, 7); g.fill(); }
  g.restore();
  return at;
}
function drawHammock(b, t) {
  const C = b.C, s = b.s, gy = b.gy, hh = 92 * s, H = 235 * s;
  const ta = palm(b, t, b.pa, gy, H, -28 * s, 0), tb = palm(b, t, b.pb, gy + 6 * s, H * .96, 30 * s, 1.3);
  const A = ta(hh / H), B = tb(hh / H * 1.04);
  const empty = b.inside || S.motion === 'off', swing = Math.sin(t * (empty ? 1.6 : .8)) * (empty ? 9 + b.wind * 200 : 4) * s, sag = 42 * s;
  // the hammock: a striped cloth hanging in a curve between two rope ends
  const end = [lrp(A[0], B[0], .12), lrp(A[1], B[1], .12) + 12 * s], end2 = [lrp(A[0], B[0], .88), lrp(A[1], B[1], .88) + 12 * s];
  const P = u => { const m = [lrp(end[0], end2[0], u), lrp(end[1], end2[1], u)]; return [m[0] + swing * Math.sin(Math.PI * u) * .6, m[1] + Math.sin(Math.PI * u) * sag]; };
  g.save(); g.lineCap = 'round';
  g.strokeStyle = C.rope; g.lineWidth = 1.2 * s; g.beginPath();
  for (const dy of [-5, 0, 5]) { g.moveTo(...A); g.lineTo(end[0], end[1] + dy * s); g.moveTo(...B); g.lineTo(end2[0], end2[1] + dy * s); }
  g.stroke();
  const band = (u0, u1, col, y0 = -6) => {   // a strip of cloth from u0 to u1, from y0 down to 8 units below the curve
    g.fillStyle = col; g.beginPath();
    for (let i = 0; i <= 12; i++) { const [px, py] = P(lrp(u0, u1, i / 12)); g.lineTo(px, py + y0 * s); }
    for (let i = 12; i >= 0; i--) { const [px, py] = P(lrp(u0, u1, i / 12)); g.lineTo(px, py + 8 * s); }
    g.closePath(); g.fill();
  };
  for (let i = 0; i < 8; i++) band(i / 8, (i + 1) / 8 + .005, i % 2 ? C.fabric2 : C.fabric);
  if (!empty) {   // him lying in it, with the front edge of the cloth over him so he sits down in the hammock
    drawLounger(b, t, u => { const p = P(u); return [p[0], p[1] + 6 * s]; });
    for (let i = 1; i < 7; i++) band(i / 8, (i + 1) / 8 + .005, i % 2 ? C.fabric2 : C.fabric, -2);
  }
  g.restore();
}
// him, lying back in the hammock, built like the fisherman and the camper (rounded limbs, no outlines, his far side a
// little darker): head on the left end, one arm tucked behind it, sunglasses; a Hawaiian shirt and shorts following the
// sag of the hammock; knees up and bare feet over the end; a coconut drink on his belly that he lifts for a sip now
// and then. P(u): the hammock's curve, u 0 (left end) to 1 (right end).
function drawLounger(b, t, P) {
  const C = b.C, s = b.s;
  const Q = (u, lift) => { const [x, y] = P(u); return [x, y - lift * s]; };   // a point on the cloth, raised by lift
  const head = Q(.17, 26), sh = Q(.25, 17), hip = Q(.5, 12), knee = Q(.67, 33), ank = Q(.84, 14);
  const far = f => { g.save(); g.filter = 'brightness(.74)'; f(); g.restore(); };
  const limb = (col, w, ...pts) => { g.strokeStyle = col; g.lineWidth = w * s; g.beginPath(); g.moveTo(...pts[0]); if (pts.length === 3) g.quadraticCurveTo(...pts[1], ...pts[2]); else g.lineTo(...pts[1]); g.stroke(); };
  g.save(); g.lineCap = g.lineJoin = 'round';
  // his far leg and his far arm (behind his head), a shade darker
  far(() => {
    const k2 = [knee[0] - 4 * s, knee[1] - 3 * s], a2 = [ank[0] + 2 * s, ank[1] - 4 * s];
    limb(C.skin, 6.5, [hip[0], hip[1] - 2 * s], k2); limb(C.skin, 6, k2, a2);
    g.fillStyle = C.skin; g.beginPath(); g.ellipse(a2[0] + 4 * s, a2[1] - 2 * s, 5 * s, 2.6 * s, -.5, 0, 7); g.fill();   // foot
    const el = [head[0] - 12 * s, head[1] - 12 * s];   // elbow up beside his head, hand tucked behind it
    limb(C.shirt, 6.5, [sh[0] - 2 * s, sh[1] - 4 * s], [lrp(sh[0], el[0], .45), lrp(sh[1], el[1], .45)]);   // sleeve
    limb(C.skin, 5, [lrp(sh[0], el[0], .4), lrp(sh[1], el[1], .4)], el); limb(C.skin, 5, el, [head[0] - 3 * s, head[1] - 2 * s]);
  });
  // the shirt: a body-shaped band along the hammock's curve from his shoulders to his hips, with a flower print
  const mid = Q(.37, 11), body = new Path2D(), N = 12, pts = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = (1 - u) * (1 - u) * sh[0] + 2 * u * (1 - u) * mid[0] + u * u * hip[0], y = (1 - u) * (1 - u) * sh[1] + 2 * u * (1 - u) * mid[1] + u * u * hip[1];
    const dx = 2 * (1 - u) * (mid[0] - sh[0]) + 2 * u * (hip[0] - mid[0]), dy = 2 * (1 - u) * (mid[1] - sh[1]) + 2 * u * (hip[1] - mid[1]), l = Math.hypot(dx, dy) || 1;
    pts.push([x, y, -dy / l, dx / l, lrp(10.5, 9.5, u) * s + Math.sin(Math.PI * u) * 1.5 * s]);   // (a little belly in the middle)
  }
  pts.forEach(([x, y, nx, ny, w], i) => i ? body.lineTo(x + nx * w, y + ny * w) : body.moveTo(x + nx * w, y + ny * w));
  for (let i = N; i >= 0; i--) { const [x, y, nx, ny, w] = pts[i]; body.lineTo(x - nx * w, y - ny * w); }
  body.closePath();
  // his shorts, from his hips down his thighs (under the shirt's hem)
  const th = [lrp(hip[0], knee[0], .55), lrp(hip[1], knee[1], .55)];
  limb(C.shorts, 15, [hip[0] - 3 * s, hip[1]], th);
  g.fillStyle = C.shirt; g.fill(body);
  g.save(); g.clip(body);   // the print: scattered hibiscus flowers
  for (let i = 0; i < 16; i++) {
    const u = (i * .37) % 1, v = ((i * .61) % 1) * 2 - 1, p = pts[Math.round(u * N)], fx = p[0] + p[2] * p[4] * v * .8, fy = p[1] + p[3] * p[4] * v * .8;
    g.fillStyle = i % 3 ? C.flower : C.flower2;
    for (let j = 0; j < 5; j++) { const a = j / 5 * 6.283 + i; g.beginPath(); g.arc(fx + Math.cos(a) * 1.6 * s, fy + Math.sin(a) * 1.6 * s, 1.1 * s, 0, 7); g.fill(); }
    g.fillStyle = C.flower2; g.beginPath(); g.arc(fx, fy, .7 * s, 0, 7); g.fill();
  }
  g.restore();
  // his near leg: thigh up to the knee, shin down to his bare foot hanging over the end
  limb(C.skin, 7, th, knee); limb(C.skin, 6.5, knee, ank);
  limb(C.shorts, 13, [lrp(hip[0], th[0], .5), lrp(hip[1], th[1], .5)], th);   // (the shorts' leg over the top of his thigh)
  g.fillStyle = C.skin; g.beginPath(); g.ellipse(ank[0] + 5 * s, ank[1] - 1.5 * s, 5.5 * s, 2.8 * s, -.45, 0, 7); g.fill();   // foot
  // neck, an open collar, and his head resting back against the hammock end
  limb(C.skin, 6, sh, [head[0] + 2 * s, head[1] + 5 * s]);
  g.fillStyle = C.skin; g.beginPath(); g.moveTo(sh[0] - 1 * s, sh[1] - 6 * s); g.lineTo(sh[0] + 7 * s, sh[1] - 2 * s); g.lineTo(sh[0] + 1 * s, sh[1] + 2 * s); g.closePath(); g.fill();   // the V of his open collar
  g.fillStyle = C.flower; g.beginPath(); g.moveTo(sh[0] - 1 * s, sh[1] - 6 * s); g.lineTo(sh[0] + 4 * s, sh[1] - 8 * s); g.lineTo(sh[0] + 3 * s, sh[1] - 3 * s); g.closePath(); g.fill();   // collar flap
  b.headAt = head;   // (for his speech bubble)
  g.save(); g.translate(...head); g.rotate(-.18); g.scale(s, s); drawBeachHead(b, t, .45, 1); g.restore();
  // his near arm and his drink: resting on his belly, or lifted to his mouth for a sip
  const p = b.sip, up = p.st === 'sip' ? (p.t < .7 ? ease(p.t / .7) : p.t < 1.9 ? 1 : 1 - ease((p.t - 1.9) / .7)) : 0;
  const rest = Q(.4, 22), mouth = [head[0] + 9 * s, head[1] + 3 * s], dk = [lrp(rest[0], mouth[0], up), lrp(rest[1], mouth[1], up)];
  const shN = [sh[0] + 3 * s, sh[1] + 2 * s], elb = [lrp(sh[0], dk[0], .5) - 2 * s + up * 4 * s, Math.max(sh[1], dk[1]) + 6 * s - up * 4 * s];
  limb(C.shirt, 7, shN, [lrp(shN[0], elb[0], .5), lrp(shN[1], elb[1], .5)]);   // short sleeve
  limb(C.skin, 5, [lrp(shN[0], elb[0], .45), lrp(shN[1], elb[1], .45)], elb); limb(C.skin, 5, elb, [dk[0] - 4 * s, dk[1] + 3 * s]);
  g.fillStyle = C.coco; g.beginPath(); g.arc(dk[0], dk[1], 6 * s, 0, 7); g.fill();
  g.fillStyle = C.cocoIn; g.beginPath(); g.ellipse(dk[0], dk[1] - 4 * s, 4.6 * s, 1.6 * s, 0, 0, 7); g.fill();
  g.strokeStyle = C.straw; g.lineWidth = 1.4 * s; g.beginPath(); g.moveTo(dk[0] + 1 * s, dk[1] - 4 * s); g.lineTo(dk[0] - 4 * s, dk[1] - 13 * s); g.stroke();
  g.fillStyle = C.parasol; g.beginPath(); g.moveTo(dk[0] + 3 * s, dk[1] - 4 * s); g.lineTo(dk[0] + 7 * s, dk[1] - 14 * s); g.lineTo(dk[0] + 12 * s, dk[1] - 9 * s); g.closePath(); g.fill();   // little paper umbrella
  g.fillStyle = C.skin; g.beginPath(); g.arc(dk[0] - 4 * s, dk[1] + 3 * s, 2.8 * s, 0, 7); g.fill();   // his hand round the coconut
  g.restore();
}
function drawBeachHead(b, t, look, k) {   // tanned, messy dark hair, sunglasses, a big grin
  const C = b.C; g.save(); g.scale(k, k);
  g.fillStyle = C.hair; g.beginPath(); g.arc(0, -1, 9.8, Math.PI * .9, Math.PI * 2.1); g.fill();
  g.fillStyle = C.skin; g.beginPath(); g.arc(0, 0, 9, 0, 7); g.fill();
  g.fillStyle = C.hair; for (const a of [-2.6, -2, -1.4, -.8]) { g.beginPath(); g.ellipse(Math.cos(a) * 8, Math.sin(a) * 8 - 1, 3.4, 2.4, a, 0, 7); g.fill(); }   // tousled hair
  const ex = look * 3.5;
  g.fillStyle = C.glasses; g.beginPath(); g.roundRect(ex - 6.5, -3, 5.8, 3.6, 1.4); g.roundRect(ex + .7, -3, 5.8, 3.6, 1.4); g.fill(); g.fillRect(ex - 1, -2.2, 2, 1);   // sunglasses
  g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(ex - 5.5, -2.5, 1.6, 1);
  g.fillStyle = '#d18a62'; g.beginPath(); g.ellipse(ex + look * 2.5, 1.5, 1.6, 1.3, 0, 0, 7); g.fill();                                // nose
  g.strokeStyle = '#7a3a2a'; g.lineWidth = 1; g.beginPath(); g.arc(ex + look * 1.5, 3.3, 3, .2, Math.PI - .2); g.stroke();        // grin
  g.restore();
}
function drawHut(b, t) {   // a little thatched beach hut on stilts, its door facing us
  const C = b.C, s = b.s, x0 = b.hx, y0 = b.gy - 14 * s, glow = b.inside && b.night;
  g.save(); g.translate(x0, y0); g.scale(s, s); g.lineCap = 'round';
  g.strokeStyle = C.bamboo; g.lineWidth = 4; g.beginPath(); for (const px of [-50, -16, 16, 50]) { g.moveTo(px, 0); g.lineTo(px, -14); } g.stroke();   // stilts
  g.fillStyle = C.bamboo; g.fillRect(-58, -18, 116, 5);                                                                                  // floor
  g.fillStyle = C.wall; g.fillRect(-52, -70, 104, 53);
  g.strokeStyle = C.bamboo; g.lineWidth = 1.2; g.beginPath(); for (let px = -46; px < 52; px += 8) { g.moveTo(px, -70); g.lineTo(px, -17); } g.stroke();   // bamboo
  const door = new Path2D('M4 -17 L4 -58 L30 -58 L30 -17 Z');
  if (glow) { const gd = g.createLinearGradient(0, -58, 0, -17); gd.addColorStop(0, '#ffcf7a'); gd.addColorStop(1, '#e8902e'); g.fillStyle = gd; } else g.fillStyle = C.door;
  g.fill(door);
  g.fillStyle = C.door; g.fillRect(-38, -56, 26, 16);                                                                                     // window
  if (b.inside && S.motion !== 'off') {   // he sits just inside the doorway, peeking out, now and then sitting back into the shade (not in the still picture)
    const look = Math.max(-1, Math.min(1, Math.sin(t * .45) * 1.2)), back = Math.max(0, Math.sin(t * .17) - .6) / .4;
    g.save(); g.clip(door); g.translate(17, -17 - 3 * back); g.scale(1 - .12 * back, 1 - .12 * back);
    // his shoulders and chest in the Hawaiian shirt (sleeves and forearms resting on his knees, below the door's edge)
    g.lineCap = g.lineJoin = 'round';
    const chest = new Path2D('M-13 2 L-14 -9 Q-13 -15 -6 -16 L6 -16 Q13 -15 14 -9 L13 2 Z');
    g.fillStyle = C.shirt; g.fill(chest);
    g.save(); g.clip(chest);
    for (let i = 0; i < 7; i++) {   // the flower print
      const fx = -11 + ((i * 7.3) % 22), fy = -14 + ((i * 5.1) % 14);
      g.fillStyle = i % 3 ? C.flower : C.flower2;
      for (let j = 0; j < 5; j++) { const a = j / 5 * 6.283 + i; g.beginPath(); g.arc(fx + Math.cos(a) * 1.5, fy + Math.sin(a) * 1.5, 1, 0, 7); g.fill(); }
    }
    g.restore();
    g.fillStyle = C.skin; g.beginPath(); g.moveTo(-3.5, -16); g.lineTo(3.5, -16); g.lineTo(0, -9); g.closePath(); g.fill();   // open collar
    g.strokeStyle = C.skin; g.lineWidth = 4.5; g.beginPath(); g.moveTo(-13, -9); g.lineTo(-15, 2); g.moveTo(13, -9); g.lineTo(15, 2); g.stroke();   // arms
    g.strokeStyle = C.shirt; g.lineWidth = 6; g.beginPath(); g.moveTo(-12, -13); g.lineTo(-14, -6); g.moveTo(12, -13); g.lineTo(14, -6); g.stroke();   // short sleeves
    g.strokeStyle = C.skin; g.lineWidth = 5; g.beginPath(); g.moveTo(0, -15); g.lineTo(0, -20); g.stroke();   // neck
    g.translate(0, -24); drawBeachHead(b, t, look, .95);
    g.restore();
    if (back > 0) { g.save(); g.globalAlpha = .85 * back; g.fillStyle = C.door; g.fill(door); g.restore(); }
  }
  // the thatched roof, with a ragged fringe, pushed about in the wind
  const lean = forestLean(b, t, 2.2) * 120;
  g.fillStyle = C.roof; g.beginPath(); g.moveTo(-68, -64); g.lineTo(lean * .3, -108); g.lineTo(68, -64);
  for (let px = 68; px >= -68; px -= 8) g.lineTo(px + lean * .1 + Math.sin(t * 6 + px) * b.wind * 30, -60 + (px / 8 % 2 ? 5 : 0));
  g.closePath(); g.fill();
  g.strokeStyle = C.roofDark; g.lineWidth = 1; g.beginPath(); for (let i = -4; i <= 4; i++) { g.moveTo(lean * .3, -106); g.lineTo(i * 16, -62); } g.stroke();
  if (b.snowy) { g.fillStyle = C.snow; g.beginPath(); g.moveTo(-50, -72); g.lineTo(lean * .3, -108); g.lineTo(50, -72); g.lineTo(lean * .3, -96); g.closePath(); g.fill(); }
  g.restore();
  if (glow) {
    const gl = g.createRadialGradient(x0 + 17 * s, y0 - 40 * s, 0, x0 + 17 * s, y0 - 40 * s, 130 * s);
    gl.addColorStop(0, 'rgba(255,190,100,.3)'); gl.addColorStop(1, 'rgba(255,190,100,0)');
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gl; g.fillRect(x0 - 120 * s, y0 - 170 * s, 280 * s, 280 * s); g.restore();
  }
}
function drawTorches(b, t) {   // two tiki torches by the hut, lit in the evening and at night (not in the rain)
  const C = b.C, s = b.s, lit = !b.inside;
  for (const tx of [b.hx - 84 * s, b.hx + 84 * s]) {
    const ty = b.gy + 6 * s;
    g.strokeStyle = C.torch; g.lineWidth = 3.4 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx, ty - 70 * s); g.stroke();
    g.fillStyle = C.bamboo; g.fillRect(tx - 4 * s, ty - 80 * s, 8 * s, 11 * s);
    if (!lit) continue;
    const fl = 1 + .15 * Math.sin(t * 13 + tx) + .1 * Math.sin(t * 7.7 + tx);
    g.fillStyle = '#ff8a2a'; g.beginPath(); g.moveTo(tx - 5 * s, ty - 80 * s); g.quadraticCurveTo(tx - 3 * s, ty - 92 * s * fl, tx + Math.sin(t * 5 + tx) * 2 * s, ty - 100 * s * fl); g.quadraticCurveTo(tx + 4 * s, ty - 90 * s, tx + 5 * s, ty - 80 * s); g.fill();
    g.fillStyle = '#ffe08a'; g.beginPath(); g.ellipse(tx, ty - 84 * s, 2.4 * s, 4.5 * s * fl, 0, 0, 7); g.fill();
    const gl = g.createRadialGradient(tx, ty - 86 * s, 0, tx, ty - 86 * s, 70 * s);
    gl.addColorStop(0, `rgba(255,160,70,${b.night ? .35 : .18})`); gl.addColorStop(1, 'rgba(255,160,70,0)');
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gl; g.fillRect(tx - 70 * s, ty - 156 * s, 140 * s, 140 * s); g.restore();
  }
}

