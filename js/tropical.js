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
    nose: '#d18a62', grin: '#7a3a2a', coco: '#7a5230', cocoIn: '#f4efe4', straw: '#e84a6a', parasol: '#f25a9a', torch: '#6a4a2a', snow: '#f4f7fa' })) C[k] = tc(h);
  const s = Math.min(Hd / 1080, Wd / 700) * (portrait ? 1 : 1.25), ax = Wd * (portrait ? .62 : .345);
  const b = { top: Hd * (portrait ? .55 : .575), shore: Hd * (portrait ? .65 : .655), gy: Hd * (portrait ? .75 : .73), night, golden, kind, C, s, ax,
    inside: !!(sc.rain || sc.storm || sc.wind || sc.swirl || kind === 'heavysnow'), snowy: !!sc.snow,
    pa: ax - 105 * s, pb: ax + 105 * s, hx: ax - 238 * s,   // the two palms, and the hut
    wind: sc.swirl ? .09 : sc.tornado ? .08 : sc.wind ? .05 : sc.storm ? .03 : 0,
    sip: { st: 'rest', t: 0, dur: rnd(6, 12) }, pelican: null, boat: null, surfer: null };
  { const now = performance.now() / 1000, first = (n, lo, hi) => now + (SHOWCASE || new RegExp('[?&]' + n + '\\b').test(location.search) ? rnd(2, 5) : rnd(lo, hi));
    b.next = { pelican: first('pelican', 30, 90), boat: first('sailboat', 20, 70), surfer: first('surfer', 30, 90) }; }   // (the background events' first turns)
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
  tropicMinorTick(tropic, dt, t);
  const p = tropic.sip; p.t += dt;
  if (stage.ev && stage.ev.kind === 'gulldrink') { p.st = 'rest'; p.t = 0; return; }   // (no sips while the gull's after his drink)
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
  if (b.boat) drawTropicBoat(b, t);   // a sailboat or catamaran on the horizon
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
  if (b.surfer) drawSurfer(b, t);   // a surfer riding a wave in
  if (b.pelican) drawPelican(b, t);   // a pelican diving for fish
  const ev = S.motion === 'off' ? null : stage.ev;   // (the major random events, see events.js)
  if (ev && ev.kind === 'turtle') drawTurtle(b, ev, t);   // up the beach, behind the hut and the hammock
  drawHut(b, t);
  drawHammock(b, t);
  if (ev && ev.kind === 'crab') drawCrab(b, ev, t);
  if (ev && ev.kind === 'coconut') drawCoconutFall(b, ev, t);
  if (b.night || b.golden) drawTorches(b, t);
  // a few more palms at the sides, nearer to us
  for (const [u, dy, h, lean, sz, ph] of b.sidePalms) palm(b, t, u * Wd, b.gy + dy * s, h * s, lean * s, ph, sz);
  if (ev && ev.kind === 'gulldrink') drawGullDrink(b, ev, t);   // (in front of everything)
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
  b.crownA = ta(1);   // (where the coconut falls from)
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
// him, lying back in the hammock, built like the fisherman and the camper (rounded limbs, no outlines, his far leg a
// little darker): head on the left end, sunglasses; a Hawaiian shirt and shorts following the
// sag of the hammock; knees up and bare feet over the end; a coconut drink on his belly that he lifts for a sip now
// and then. P(u): the hammock's curve, u 0 (left end) to 1 (right end).
function drawLounger(b, t, P) {
  const C = b.C, s = b.s;
  const Q = (u, lift) => { const [x, y] = P(u); return [x, y - lift * s]; };   // a point on the cloth, raised by lift
  const jk = crabJerk(), head = Q(.205, 27), sh = Q(.255, 18), hip = Q(.5, 12), knee = Q(.67, 33 + jk * 8), ank = Q(.84 - jk * .03, 14 + jk * 16);   // (head close over his shoulders: a short neck; jk: feet yanked up from the crab)
  const far = f => { g.save(); g.filter = 'brightness(.74)'; f(); g.restore(); };
  const limb = (col, w, ...pts) => { g.strokeStyle = col; g.lineWidth = w * s; g.beginPath(); g.moveTo(...pts[0]); if (pts.length === 3) g.quadraticCurveTo(...pts[1], ...pts[2]); else g.lineTo(...pts[1]); g.stroke(); };
  g.save(); g.lineCap = g.lineJoin = 'round';
  // his far leg, a shade darker (his far arm is hidden behind him)
  far(() => {
    const k2 = [knee[0] - 4 * s, knee[1] - 3 * s], a2 = [ank[0] + 2 * s, ank[1] - 4 * s];
    limb(C.skin, 6.5, [hip[0], hip[1] - 2 * s], k2); limb(C.skin, 6, k2, a2);
    g.fillStyle = C.skin; g.beginPath(); g.ellipse(a2[0] + 4 * s, a2[1] - 2 * s, 5 * s, 2.6 * s, -.5, 0, 7); g.fill();   // foot
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
  b.headAt = head; b.feetAt = [ank[0] + 5 * s, ank[1]];   // (for his speech bubble, and the crab)
  g.save(); g.translate(...head); g.rotate(-.18); g.scale(s, s); drawBeachHead(b, t, tropicLook() ?? .45, 1); g.restore();
  // his near arm and his drink: resting on his belly, or lifted to his mouth for a sip
  const p = b.sip, up = p.st === 'sip' ? (p.t < .7 ? ease(p.t / .7) : p.t < 1.9 ? 1 : 1 - ease((p.t - 1.9) / .7)) : 0;
  const rest = Q(.4, 22), mouth = [head[0] + 9 * s, head[1] + 3 * s], dk = [lrp(rest[0], mouth[0], up), lrp(rest[1], mouth[1], up)];
  b.drinkAt = dk;
  const gull = stage.ev && stage.ev.kind === 'gulldrink' && stage.ev.p >= .45;   // (the seagull has his drink)
  const shN = [sh[0] + 3 * s, sh[1] + 2 * s], elb = [lrp(sh[0], dk[0], .5) - 2 * s + up * 4 * s, Math.max(sh[1], dk[1]) + 6 * s - up * 4 * s];
  limb(C.shirt, 7, shN, [lrp(shN[0], elb[0], .5), lrp(shN[1], elb[1], .5)]);   // short sleeve
  limb(C.skin, 5, [lrp(shN[0], elb[0], .45), lrp(shN[1], elb[1], .45)], elb); limb(C.skin, 5, elb, [dk[0] - 4 * s, dk[1] + 3 * s]);
  if (!gull) {
  g.fillStyle = C.coco; g.beginPath(); g.arc(dk[0], dk[1], 6 * s, 0, 7); g.fill();
  g.fillStyle = C.cocoIn; g.beginPath(); g.ellipse(dk[0], dk[1] - 4 * s, 4.6 * s, 1.6 * s, 0, 0, 7); g.fill();
  g.strokeStyle = C.straw; g.lineWidth = 1.4 * s; g.beginPath(); g.moveTo(dk[0] + 1 * s, dk[1] - 4 * s); g.lineTo(dk[0] - 4 * s, dk[1] - 13 * s); g.stroke();
  g.fillStyle = C.parasol; g.beginPath(); g.moveTo(dk[0] + 3 * s, dk[1] - 4 * s); g.lineTo(dk[0] + 7 * s, dk[1] - 14 * s); g.lineTo(dk[0] + 12 * s, dk[1] - 9 * s); g.closePath(); g.fill();   // little paper umbrella
  }
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
  g.fillStyle = C.nose; g.beginPath(); g.ellipse(ex + look * 2.5, 1.5, 1.6, 1.3, 0, 0, 7); g.fill();                                // nose
  g.strokeStyle = C.grin; g.lineWidth = 1; g.beginPath(); g.arc(ex + look * 1.5, 3.3, 3, .2, Math.PI - .2); g.stroke();        // grin
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


/* ---------- the Tropical style's random events ---------- */
// Major (one at a time, he reacts afterwards; see events.js): a coconut falls on his head, a seagull swoops off with his
// drink, a crab pinches his toe, a sea turtle crawls up the beach. Minor (their own timers, alongside anything): a
// pelican diving for fish, a sailboat or catamaran along the horizon, a surfer riding a wave in.
// Testing: ?event=coconut (gulldrink, crab, turtle); ?pelican, ?sailboat, ?surfer bring those in a few seconds.
function tropicMinorTick(b, dt, t) {
  const N = b.next, gap = (lo, hi) => t + (SHOWCASE ? rnd(4, 10) : rnd(lo, hi)), calm = !/storm|hurricane|tornado|heavy|windy/.test(mode.kind), sx = Wd / 1920;
  if (b.pelican) { b.pelican.t += dt; if (b.pelican.t > b.pelican.dur) { b.pelican = null; N.pelican = gap(70, 160); } }
  else if (t > N.pelican && flyOK() && !b.night) b.pelican = { t: 0, dur: 11, dir: Math.random() < .5 ? 1 : -1, xf: Wd > Hd ? rnd(.08, .26) : rnd(.2, .8) };   // (xf: where it dives; on a wide screen in the open sea on the left, clear of the forecast boxes)
  if (b.boat) { b.boat.t += dt; if (b.boat.t > b.boat.dur) { b.boat = null; N.boat = gap(90, 200); } }
  else if (t > N.boat && calm) b.boat = { t: 0, dur: (Wd + 200 * sx) / (16 * Math.max(.6, sx)), dir: Math.random() < .5 ? 1 : -1, cat: Math.random() < .45 };
  if (b.surfer) { b.surfer.t += dt; if (b.surfer.t > b.surfer.dur) { b.surfer = null; N.surfer = gap(80, 180); } }
  else if (t > N.surfer && calm && !b.night) b.surfer = { t: 0, dur: 9, dir: Wd > Hd || Math.random() < .5 ? 1 : -1 };   // (on a wide screen in from the left, in the open sea)
}
function drawPelican(b, t) {   // glides in high, folds and plunges into the sea with a splash, bobs up and flies off
  const P = b.pelican, u = P.t / P.dur, k = b.s * .8, sy = Hd / 1080, sea = b.top + 30 * sy, dir = P.dir;
  const x0 = dir > 0 ? -60 : Wd + 60, xd = Wd * P.xf, x1 = dir > 0 ? Wd + 60 : -60;
  let x, y, pose;   // pose: glide, dive, sit, fly
  if (u < .35) { x = lrp(x0, xd - dir * 40 * k, u / .35); y = Hd * .2 + Math.sin(u * 20) * 3 * sy; pose = 'glide'; }
  else if (u < .45) { const v = (u - .35) / .1; x = lrp(xd - dir * 40 * k, xd, v); y = lrp(Hd * .2, sea, v * v); pose = 'dive'; }
  else if (u < .62) { x = xd; y = sea + Math.sin(t * 3) * 1.5 * sy; pose = 'sit'; }
  else { const v = (u - .62) / .38; x = lrp(xd, x1, v); y = lrp(sea, Hd * .16, Math.min(1, v * 2.5)); pose = 'fly'; }
  if (u > .44 && u < .52) {   // the splash
    const v = (u - .44) / .08; g.save(); g.globalAlpha = 1 - v; g.fillStyle = 'rgba(255,255,255,.9)';
    for (let i = -3; i <= 3; i++) { g.beginPath(); g.arc(xd + i * 5 * k, sea - Math.sin(Math.PI * v) * (14 - Math.abs(i) * 3) * k, 2.2 * k, 0, 7); g.fill(); }
    g.restore();
  }
  const col = b.golden ? '#6a5560' : '#ece8e0', dark = b.golden ? '#3a2a30' : '#4a4640', bill = '#e2a83a';
  g.save(); g.translate(x, y); g.scale(dir * k, k); g.lineCap = 'round';
  if (pose === 'dive') g.rotate(1.2);
  if (pose === 'sit') {   // floating on the water, its pouch full
    g.fillStyle = col; g.beginPath(); g.ellipse(0, -5, 13, 6, 0, 0, 7); g.fill();
    g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.moveTo(8, -8); g.quadraticCurveTo(12, -18, 9, -22); g.stroke();
    g.fillStyle = bill; g.beginPath(); g.moveTo(10, -23); g.lineTo(26, -18); g.quadraticCurveTo(16, -12, 10, -19); g.fill();
    g.fillStyle = '#111'; g.beginPath(); g.arc(9.5, -23, .9, 0, 7); g.fill();
  } else {
    const w = pose === 'dive' ? .2 : Math.sin(t * (pose === 'fly' ? 7 : 2)) * (pose === 'glide' ? .25 : 1);
    g.fillStyle = dark; g.beginPath(); g.moveTo(-2, -1); g.quadraticCurveTo(-8, -14 * w - 4, -20, -22 * w); g.quadraticCurveTo(-6, -6 * w, 4, 1); g.fill();   // far wing
    g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, 14, 5.5, 0, 0, 7); g.fill();
    g.beginPath(); g.ellipse(12, -3, 4, 3.5, 0, 0, 7); g.fill();   // head, neck tucked in
    g.fillStyle = bill; g.beginPath(); g.moveTo(14, -3); g.lineTo(32, 0); g.lineTo(14, 1); g.closePath(); g.fill();   // long bill
    g.fillStyle = '#111'; g.beginPath(); g.arc(13, -4, .8, 0, 7); g.fill();
    g.fillStyle = col; g.beginPath(); g.moveTo(-2, 0); g.quadraticCurveTo(-8, 14 * w + 4, -24, 22 * w); g.quadraticCurveTo(-6, 6 * w + 2, 5, 1); g.fill();   // near wing
    g.fillStyle = dark; g.beginPath(); g.moveTo(-24, 22 * w); g.lineTo(-17, 18 * w + 1); g.lineTo(-19, 21 * w + 2); g.fill();   // dark wingtip
  }
  g.restore();
}
function drawTropicBoat(b, t) {   // a small sailboat or a catamaran on the horizon
  const B = b.boat, u = B.t / B.dur, k = b.s * .55, x = lrp(B.dir > 0 ? -80 : Wd + 80, B.dir > 0 ? Wd + 80 : -80, u), y = b.top + 6 * Hd / 1080 + Math.sin(t * 1.2);
  const hull = b.night ? '#2a3240' : '#f4f2ee', sail = b.night ? '#5a6272' : b.golden ? '#f2d8c8' : '#ffffff', stripe = b.night ? '#4a2a2a' : '#e2473b';
  g.save(); g.translate(x, y); g.scale(B.dir * k, k);
  if (B.cat) {   // two hulls under a deck, a tall mainsail and a jib
    g.fillStyle = hull; g.fillRect(-26, -6, 52, 3); g.beginPath(); g.ellipse(-18, -3, 10, 3, 0, 0, 7); g.ellipse(18, -3, 10, 3, 0, 0, 7); g.fill();
    g.fillStyle = sail; g.beginPath(); g.moveTo(-2, -8); g.lineTo(-2, -52); g.lineTo(-22, -8); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(2, -10); g.lineTo(2, -44); g.lineTo(20, -10); g.closePath(); g.fill();
    g.fillStyle = stripe; g.fillRect(-12, -36, 10, 3);
  } else {
    g.fillStyle = hull; g.beginPath(); g.moveTo(-22, -6); g.lineTo(24, -6); g.lineTo(16, 2); g.lineTo(-16, 2); g.closePath(); g.fill();
    g.fillStyle = stripe; g.fillRect(-18, -4, 38, 1.6);
    g.fillStyle = sail; g.beginPath(); g.moveTo(0, -8); g.lineTo(0, -48); g.lineTo(-20, -8); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(3, -10); g.lineTo(3, -40); g.lineTo(18, -10); g.closePath(); g.fill();
  }
  g.strokeStyle = b.night ? '#3a4250' : '#6a6a6a'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -6); g.lineTo(0, -54); g.stroke();
  g.restore();
}
function drawSurfer(b, t) {   // riding a little curling wave in toward the beach, then fading out as it breaks
  const S2 = b.surfer, u = S2.t / S2.dur, k = b.s * .75, sy = Hd / 1080, dir = S2.dir;
  const x = lrp(dir > 0 ? -60 : Wd + 60, Wd > Hd ? Wd * .44 : dir > 0 ? Wd * .7 : Wd * .3, Math.min(1, u / .8)), base = lrp(b.top + 40 * sy, b.shore - 14 * sy, Math.min(1, u)) + Math.sin(t * 4) * 1.5 * sy;
  const a = u < .8 ? 1 : 1 - (u - .8) / .2, C = b.C;
  g.save(); g.globalAlpha = a; g.lineCap = 'round';
  // the wave: a raised swell with a white crest curling over, behind him
  g.fillStyle = b.P.sea1; g.beginPath(); g.moveTo(x - dir * 70 * k, base + 4 * k); g.quadraticCurveTo(x - dir * 30 * k, base - 22 * k, x + dir * 8 * k, base - 14 * k); g.quadraticCurveTo(x + dir * 22 * k, base - 8 * k, x + dir * 40 * k, base + 4 * k); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 2.5 * k; g.beginPath(); g.moveTo(x - dir * 70 * k, base + 2 * k); g.quadraticCurveTo(x - dir * 30 * k, base - 24 * k, x + dir * 6 * k, base - 16 * k); g.quadraticCurveTo(x + dir * 2 * k, base - 8 * k, x - dir * 6 * k, base - 10 * k); g.stroke();
  g.translate(x, base - 6 * k); g.scale(dir * k, k); g.rotate(-.08 + Math.sin(t * 2) * .05);
  g.fillStyle = '#f6c84a'; g.beginPath(); g.ellipse(0, 0, 22, 3, 0, 0, 7); g.fill(); g.fillStyle = '#e2473b'; g.fillRect(-2, -1, 4, 2);   // board
  g.strokeStyle = C.skin; g.lineWidth = 3.4;
  g.beginPath(); g.moveTo(-6, -1); g.lineTo(-4, -10); g.lineTo(0, -16); g.moveTo(6, -1); g.lineTo(4, -10); g.lineTo(0, -16); g.stroke();   // legs, knees bent
  g.strokeStyle = '#2a6aa8'; g.lineWidth = 5; g.beginPath(); g.moveTo(-3, -12); g.lineTo(3, -12); g.stroke();   // board shorts
  g.strokeStyle = C.skin; g.lineWidth = 4.5; g.beginPath(); g.moveTo(0, -15); g.lineTo(1, -27); g.stroke();   // body
  g.lineWidth = 2.6; g.beginPath(); g.moveTo(1, -25); g.lineTo(-10, -22); g.moveTo(1, -25); g.lineTo(11, -27); g.stroke();   // arms out for balance
  g.fillStyle = C.skin; g.beginPath(); g.arc(2, -31, 3.6, 0, 7); g.fill(); g.fillStyle = '#e8c24a'; g.beginPath(); g.arc(1.4, -32.4, 3.6, Math.PI, 0); g.fill();   // head, blond hair
  g.restore();
}

// ----- the major events, drawn from drawTropic -----
function tropicLook() {   // where he looks during an event (or null)
  const e = stage.ev; if (!e) return null;
  if ((e.kind === 'crab' || e.kind === 'turtle') && e.p > .12 && e.p < .88) return .95;
  if (e.kind === 'gulldrink' && e.p > .3 && e.p < .8) return e.p < .5 ? .6 : -.6;
  return null;
}
function drawCoconutFall(b, e, t) {   // drops from the crown of the left palm onto his head (.35), bounces off onto the sand
  if (!b.crownA || !b.headAt) return;
  const p = e.p, k = b.s, [cx, cy] = b.crownA, [hx, hy] = b.headAt, gy = b.gy + 20 * k;
  let x, y;
  if (p < .15) { x = cx + 6 * k; y = cy + 6 * k + Math.sin(t * 25) * (p > .08 ? 2 : 0) * k; }   // wobbling up in the palm
  else if (p < .35) { const v = (p - .15) / .2; x = lrp(cx + 6 * k, hx, v); y = lrp(cy + 6 * k, hy - 10 * k, v * v); }
  else if (p < .55) { const v = (p - .35) / .2; x = hx + v * 50 * k; y = lrp(hy - 10 * k, gy, v) - Math.sin(Math.PI * v) * 30 * k; }
  else { x = hx + 50 * k; y = gy; }
  g.fillStyle = b.C.coconut; g.beginPath(); g.arc(x, y, 6 * k, 0, 7); g.fill();
  g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.arc(x - 1.5 * k, y + 1.5 * k, 2 * k, 0, 7); g.fill();
  if (p > .35 && p < .7) {   // stars round his head
    for (let i = 0; i < 4; i++) {
      const a = t * 4 + i * 1.57, sx2 = hx + Math.cos(a) * 14 * k, sy2 = hy - 12 * k + Math.sin(a) * 4 * k;
      g.fillStyle = '#ffe14a'; g.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 1.2 * k : 3 * k, aa = j * Math.PI / 5; g.lineTo(sx2 + Math.cos(aa) * r, sy2 + Math.sin(aa) * r); } g.fill();
    }
  }
  if (p > .36 && p < .5) drawSpeech('Ow!', hx, hy, Math.min(1, (p - .36) / .01, (.5 - p) / .01));
}
function drawGullDrink(b, e, t) {   // swoops in from the right, snatches his coconut (.45) and flies off with it
  if (!b.drinkAt) return;
  const p = e.p, k = b.s * 1.1, [dx, dy] = b.drinkAt, from = [Wd + 60, Hd * .15], to = [-60, Hd * .1];
  let x, y;
  if (p < .45) { const v = ease(p / .45); x = lrp(from[0], dx, v); y = lrp(from[1], dy - 10 * k, v) + Math.sin(Math.PI * v) * 30 * k; }
  else if (p < .5) { x = dx; y = dy - 10 * k; }
  else { const v = (p - .5) / .4; x = lrp(dx, to[0], v); y = lrp(dy - 10 * k, to[1], v) - Math.sin(Math.PI * v) * 20 * k; }
  if (p > .9) return;
  const S2 = 30 * k, w = p > .45 && p < .5 ? .3 : Math.sin(t * 9);
  g.save(); g.translate(x, y); g.scale(-1, 1); g.fillStyle = b.night ? 'rgb(176,186,202)' : 'rgb(246,248,252)';
  const wings = [wingPath(-1, S2, w), wingPath(1, S2, w)]; wings.forEach(pp => g.fill(pp));
  g.beginPath(); g.ellipse(.02 * S2, .03 * S2, .22 * S2, .07 * S2, 0, 0, 7); g.fill(); g.beginPath(); g.arc(.2 * S2, .015 * S2, .07 * S2, 0, 7); g.fill();
  g.fillStyle = '#e8b830'; g.beginPath(); g.moveTo(.26 * S2, 0); g.lineTo(.34 * S2, .02 * S2); g.lineTo(.26 * S2, .04 * S2); g.fill();
  for (const sg of [-1, 1]) { g.save(); g.clip(wings[(sg + 1) / 2]); g.fillStyle = '#2a2d36'; g.beginPath(); g.arc(sg * S2, -w * .5 * S2, .2 * S2, 0, 7); g.fill(); g.restore(); }
  if (p >= .45) {   // his coconut in its feet
    g.fillStyle = b.C.coco; g.beginPath(); g.arc(.05 * S2, .22 * S2, 5 * b.s, 0, 7); g.fill();
    g.fillStyle = b.C.parasol; g.beginPath(); g.moveTo(.1 * S2, .1 * S2); g.lineTo(.18 * S2, -.05 * S2); g.lineTo(.24 * S2, .08 * S2); g.fill();
  }
  g.restore();
}
function drawCrab(b, e, t) {   // scuttles in sideways from the right to under his feet, pinches a toe (.45-.55), scuttles off
  if (!b.feetAt) return;
  const p = e.p, k = b.s * .9, [fx, fy] = b.feetAt, gy = Math.min(b.gy + 18 * b.s, fy + 30 * b.s), xs = fx + 6 * k, x0 = Wd * (Wd > Hd ? .52 : 1.05);
  let x, moving = true, reach = 0;
  if (p < .4) x = lrp(x0, xs, ease(p / .4));
  else if (p < .6) { x = xs; moving = false; reach = Math.max(0, Math.min(1, (p - .42) / .03, (.58 - p) / .03)); }
  else x = lrp(xs, x0, ease((p - .6) / .35));
  const col = b.night ? '#6a2a24' : '#e2512e', dark = b.night ? '#4a1c18' : '#b83a1e';
  g.save(); g.translate(x, gy - (moving ? Math.abs(Math.sin(t * 22)) * 1.5 * k : 0)); g.scale(k, k); g.lineCap = 'round';
  g.strokeStyle = dark; g.lineWidth = 1.6;
  for (const sg of [-1, 1]) for (let i = 0; i < 3; i++) { const sw = moving ? Math.sin(t * 22 + i * 2 + sg) * 2 : 0; g.beginPath(); g.moveTo(sg * 6, -3 + i * 1.5); g.lineTo(sg * 11 + sw, -6 + i * 3); g.lineTo(sg * 13 + sw, 1 + i); g.stroke(); }   // legs
  g.fillStyle = col; g.beginPath(); g.ellipse(0, -5, 9, 5.5, 0, 0, 7); g.fill();   // shell
  g.strokeStyle = col; g.lineWidth = 2.4;   // claws, the left one reaching up to his toe
  g.beginPath(); g.moveTo(6, -7); g.lineTo(11, -12); g.stroke(); g.fillStyle = col; g.beginPath(); g.ellipse(12, -14, 3, 2.2, -.6, 0, 7); g.fill();
  g.beginPath(); g.moveTo(-6, -7); g.lineTo(lrp(-10, -4, reach), lrp(-12, -26, reach)); g.stroke(); g.beginPath(); g.ellipse(lrp(-11, -4, reach), lrp(-14, -29, reach), 3.2, 2.2, -.4, 0, 7); g.fill();
  g.fillStyle = '#111'; for (const ex of [-2.5, 2.5]) { g.fillRect(ex - .4, -12, .8, 3); g.beginPath(); g.arc(ex, -12.5, 1.1, 0, 7); g.fill(); }   // eyes on stalks
  g.restore();
  if (p > .46 && p < .58 && b.headAt) drawSpeech('Yeowch!', ...b.headAt, Math.min(1, (p - .46) / .01, (.58 - p) / .01));
}
const crabJerk = () => { const e = stage.ev; return e && e.kind === 'crab' ? Math.max(0, Math.min(1, (e.p - .44) / .03, (.62 - e.p) / .05)) : 0; };   // he yanks his feet up
function drawTurtle(b, e, t) {   // a sea turtle crawls out of the surf, up the wet sand, rests, and heads back into the sea
  const p = e.p, k = b.s * 1.1, x = b.ax + 120 * b.s, y0 = b.edge(x) + 4 * k, y1 = y0 + 24 * k;
  let y, dir = 1, moving = true;   // dir 1: facing up the beach (toward us)
  if (p < .35) y = lrp(y0, y1, ease(p / .35));
  else if (p < .6) { y = y1; moving = false; }
  else { y = lrp(y1, y0 - 4 * k, ease((p - .6) / .35)); dir = -1; }
  const a = p > .9 ? 1 - (p - .9) / .1 : Math.min(1, p / .05), line = b.night ? '#2a3a2a' : '#4a6a2a', shell = b.night ? '#2a2a1e' : '#6a5230', skin = b.night ? '#3a4a3a' : '#7a9a5a';
  const pad = moving ? Math.sin(t * 5) : 0;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(k, k);
  g.fillStyle = skin;   // flippers
  for (const [fx, fy, sg] of [[-12, -2, -1], [12, -2, 1], [-9, 8, -1], [9, 8, 1]]) { g.beginPath(); g.ellipse(fx + sg * pad * 1.5, fy + (fy < 0 ? -pad : pad), 6, 2.6, sg * (fy < 0 ? -.5 : .4), 0, 7); g.fill(); }
  g.beginPath(); g.ellipse(0, dir > 0 ? 13 : -13, 4.2, 5, 0, 0, 7); g.fill();   // head, the way it's going
  if (dir > 0) { g.fillStyle = '#111'; g.beginPath(); g.arc(-1.8, 15, .7, 0, 7); g.arc(1.8, 15, .7, 0, 7); g.fill(); }
  g.fillStyle = shell; g.beginPath(); g.ellipse(0, 2, 11, 12, 0, 0, 7); g.fill();
  g.strokeStyle = line; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -9); g.lineTo(0, 13); g.moveTo(-9, -3); g.lineTo(9, 7); g.moveTo(9, -3); g.lineTo(-9, 7); g.stroke();   // shell plates
  g.restore();
}
