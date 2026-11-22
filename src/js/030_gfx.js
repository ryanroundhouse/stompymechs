/* ============ PROCEDURAL TEXTURES ============ */
const TX_ANISO = Math.min(16, renderer.capabilities.getMaxAnisotropy());
function ctex(w, h, draw, rx = 1, ry = 1) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = TX_ANISO; return t;
}
function speckle(g, w, h, n, a, lo = 0, hi = 255) { for (let i = 0; i < n; i++) { const v = rand(lo, hi) | 0; g.fillStyle = `rgba(${v},${v},${v},${a})`; g.fillRect(rand(w), rand(h), rand(1, 3), rand(1, 3)); } }
/* ---- surfaces from a height field. A field is a Float32Array of N by N heights that tiles; the normal map is its slopes, and the colour is partly its hollows.
   hfNoise is tiling value noise in octaves (c0 cells across in the first, twice as many in each after), hfStamp adds a round feature, hfOf reads one drawn on a canvas, hfBlur softens it,
   dtex makes a texture from pixels written straight into it, hfNormal the normal map (k is how steep one unit of height per texel reads) ---- */
function hfNoise(N, c0, oct, seed, gain = .5) {
  const h = new Float32Array(N * N), R = mulberry(seed); let amp = 1, tot = 0;
  for (let o = 0, c = c0; o < oct; o++, c *= 2, amp *= gain) {
    const L = new Float32Array(c * c), s = c / N; for (let i = 0; i < L.length; i++) L[i] = R(); tot += amp;
    for (let y = 0; y < N; y++) {
      const fy = y * s, y0 = fy | 0, v = fy - y0, vv = v * v * (3 - 2 * v), r0 = y0 * c, r1 = ((y0 + 1) % c) * c, row = y * N;
      for (let x = 0; x < N; x++) { const fx = x * s, x0 = fx | 0, x1 = (x0 + 1) % c, u = fx - x0, uu = u * u * (3 - 2 * u), a = L[r0 + x0], b = L[r0 + x1], d = L[r1 + x0], e = L[r1 + x1]; h[row + x] += amp * (a + (b - a) * uu + (d - a + (a - b - d + e) * uu) * vv); }
    }
  }
  for (let i = 0; i < h.length; i++) h[i] /= tot; return h;
}
function hfStamp(h, N, cx, cy, r, fn) { const q = Math.ceil(r); cx |= 0; cy |= 0; for (let dy = -q; dy <= q; dy++) for (let dx = -q; dx <= q; dx++) { const d = Math.sqrt(dx * dx + dy * dy) / r; if (d < 1) h[((cy + dy + N) % N) * N + (cx + dx + N) % N] += fn(d); } }
function hfBlur(h, N) {
  const t = new Float32Array(h.length);
  for (let y = 0; y < N; y++) for (let x = 0, r = y * N; x < N; x++) t[r + x] = (h[r + (x + N - 1) % N] + 2 * h[r + x] + h[r + (x + 1) % N]) * .25;
  for (let y = 0; y < N; y++) for (let x = 0, r = y * N, u = ((y + N - 1) % N) * N, d = ((y + 1) % N) * N; x < N; x++) h[r + x] = (t[u + x] + 2 * t[r + x] + t[d + x]) * .25;
  return h;
}
const txCan = (N, fill) => { const c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d', { willReadFrequently: true }); if (fill) { g.fillStyle = fill; g.fillRect(0, 0, N, N); } return g; };
const hfOf = (g, N) => { const d = g.getImageData(0, 0, N, N).data, h = new Float32Array(N * N); for (let i = 0; i < h.length; i++) h[i] = d[i * 4] / 255; return h; };
const txOf = (c, rx = 1, ry = 1, srgb = false) => { const t = new THREE.CanvasTexture(c); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = TX_ANISO; return t; };
function dtex(N, fill, rx = 1, ry = 1, srgb = false) { const g = txCan(N), id = g.createImageData(N, N); fill(id.data); g.putImageData(id, 0, 0); return txOf(g.canvas, rx, ry, srgb); }
function hfNormal(h, N, k, rx = 1, ry = 1) {
  return dtex(N, d => {
    for (let y = 0, i = 0; y < N; y++) { const r = y * N, yu = ((y + N - 1) % N) * N, yd = ((y + 1) % N) * N; for (let x = 0; x < N; x++, i += 4) { const nx = (h[r + (x + N - 1) % N] - h[r + (x + 1) % N]) * k, ny = (h[yd + x] - h[yu + x]) * k, il = 127.5 / Math.sqrt(nx * nx + ny * ny + 1); d[i] = 127.5 + nx * il; d[i + 1] = 127.5 + ny * il; d[i + 2] = 127.5 + il; d[i + 3] = 255; } }
  }, rx, ry);
}
/* distance to the nearest and the next-nearest of a tiling scatter of points, G cells across: plates and the cracks between them */
function hfCells(N, G, seed, fn) {
  const R = mulberry(seed), px = new Float32Array(G * G), py = new Float32Array(G * G), pv = new Float32Array(G * G); for (let i = 0; i < G * G; i++) { px[i] = R(); py[i] = R(); pv[i] = R(); }
  const s = G / N;
  for (let y = 0, i = 0; y < N; y++) for (let x = 0; x < N; x++, i++) {
    const fx = x * s, fy = y * s, cx = fx | 0, cy = fy | 0; let f1 = 9, f2 = 9, v = 0;
    for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const j = ((cy + b + G) % G) * G + (cx + a + G) % G, dx = cx + a + px[j] - fx, dy = cy + b + py[j] - fy, d = dx * dx + dy * dy; if (d < f1) { f2 = f1; f1 = d; v = pv[j]; } else if (d < f2) f2 = d; }
    fn(i, Math.sqrt(f2) - Math.sqrt(f1), v);
  }
}
/* a texture's normal map, and the map that scales a material's roughness (green) and metalness (blue), are found through its picture, so a copy with another repeat finds them too */
const TX_MATE = new Map(), TX_METAL = .8, txMate = (t, nm, orm) => { TX_MATE.set(t.source, { nm, orm }); return t; };

/* armour plate, 1024 a side: a seam round the edge and two across it, a hatch, a vent, rivets, scratches down to the metal and paint chipped off the edges. Colour, height and wear are drawn together */
function txPanel(N = 1024) {
  const u = N / 256, a = txCan(N, '#cfcfcf'), h = txCan(N, '#808080'), r = txCan(N, 'rgb(0,255,204)'), all = [a, h, r];
  for (let i = 0; i < 30; i++) { const x = rand(N), y = rand(N), s = rand(40, 130) * u, v = Math.random() < .5 ? 0 : 255, gr = a.createRadialGradient(x, y, 0, x, y, s); gr.addColorStop(0, `rgba(${v},${v},${v},.07)`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`); a.fillStyle = gr; a.fillRect(x - s, y - s, s * 2, s * 2); }
  speckle(a, N, N, 2600 * u * u, .05);
  for (let i = 0; i < 18; i++) { const x = rand(N), w = rand(3, 22) * u, al = rand(.03, .09), gr = a.createLinearGradient(0, 0, 0, N); gr.addColorStop(0, `rgba(40,30,20,${al})`); gr.addColorStop(rand(.4, .9), `rgba(40,30,20,${al * .6})`); gr.addColorStop(1, 'rgba(40,30,20,0)'); a.fillStyle = gr; a.fillRect(x, 0, w, N); }
  const seam = (path, w = 2) => {
    for (const [g, col, lw] of [[a, 'rgba(0,0,0,.6)', w * u], [h, '#161616', w * u * 1.25], [r, 'rgb(0,255,110)', w * u]]) { g.strokeStyle = col; g.lineWidth = lw; g.lineJoin = 'miter'; g.beginPath(); path(g); g.stroke(); }
    a.save(); a.translate(u * 1.5, u * 1.5); a.strokeStyle = 'rgba(255,255,255,.3)'; a.lineWidth = u * .7; a.beginPath(); path(a); a.stroke(); a.restore();
  };
  const bolt = (x, y, q) => {
    a.fillStyle = 'rgba(0,0,0,.5)'; a.beginPath(); a.arc(x, y, q, 0, TAU); a.fill(); a.fillStyle = 'rgba(205,205,205,.9)'; a.beginPath(); a.arc(x - q * .12, y - q * .12, q * .72, 0, TAU); a.fill(); a.fillStyle = 'rgba(255,255,255,.75)'; a.beginPath(); a.arc(x - q * .34, y - q * .38, q * .24, 0, TAU); a.fill();
    const gr = h.createRadialGradient(x, y, 0, x, y, q * 1.15); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.55, 'rgba(235,235,235,.9)'); gr.addColorStop(1, 'rgba(128,128,128,0)'); h.fillStyle = gr; h.beginPath(); h.arc(x, y, q * 1.15, 0, TAU); h.fill();
    r.fillStyle = 'rgb(0,150,255)'; r.beginPath(); r.arc(x, y, q * .8, 0, TAU); r.fill();
  };
  seam(g => g.rect(5 * u, 5 * u, N - 10 * u, N - 10 * u));
  seam(g => { g.moveTo(5 * u, 170 * u); g.lineTo(150 * u, 170 * u); g.lineTo(175 * u, 195 * u); g.lineTo(251 * u, 195 * u); g.moveTo(96 * u, 5 * u); g.lineTo(96 * u, 170 * u); });
  /* a hatch, standing a little proud of the plate, bolted at its corners */
  { const x = 128 * u, y = 34 * u, w = 96 * u, hh = 92 * u, q = 9 * u, path = g => { g.moveTo(x + q, y); g.lineTo(x + w - q, y); g.lineTo(x + w, y + q); g.lineTo(x + w, y + hh - q); g.lineTo(x + w - q, y + hh); g.lineTo(x + q, y + hh); g.lineTo(x, y + hh - q); g.lineTo(x, y + q); g.closePath(); };
    h.fillStyle = '#8f8f8f'; h.beginPath(); path(h); h.fill(); a.fillStyle = 'rgba(255,255,255,.05)'; a.beginPath(); path(a); a.fill(); seam(path, 1.4);
    for (const [bx, by] of [[x + 9 * u, y + 9 * u], [x + w - 9 * u, y + 9 * u], [x + 9 * u, y + hh - 9 * u], [x + w - 9 * u, y + hh - 9 * u]]) bolt(bx, by, 3.3 * u); }
  /* a vent: five slots cut through */
  for (let i = 0; i < 5; i++) { const x = 20 * u, y = (196 + i * 9) * u, w = 58 * u, t = 4.4 * u; for (const [g, col] of [[a, 'rgba(8,8,8,.9)'], [h, '#000'], [r, 'rgb(0,255,60)']]) { g.fillStyle = col; g.fillRect(x, y, w, t); } a.fillStyle = 'rgba(255,255,255,.28)'; a.fillRect(x, y + t, w, u * .8); }
  for (let i = 0; i < 16; i++) { const p = (14 + i * 228 / 15) * u; for (const [x, y] of [[p, 14 * u], [p, 242 * u], [14 * u, p], [242 * u, p]]) bolt(x, y, 2.3 * u); }
  /* scratches: bright, shiny and a little below the paint */
  for (let i = 0; i < 110; i++) {
    const x = rand(N), y = rand(N), an = rand(TAU), l = rand(4, 30) * u, w = rand(.5, 1.3) * u, x1 = x + Math.cos(an) * l, y1 = y + Math.sin(an) * l;
    for (const [g, col] of [[a, `rgba(255,255,255,${rand(.16, .36)})`], [h, 'rgba(96,96,96,.8)'], [r, 'rgba(0,105,255,.9)']]) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(x1, y1); g.stroke(); }
  }
  /* paint chipped off along the seams and the plate's own edge, most of it near the corners */
  const chip = (x, y, s) => { const n = 5 + (Math.random() * 4 | 0), P = []; for (let k = 0; k < n; k++) { const an = k / n * TAU, q = s * rand(.45, 1); P.push([x + Math.cos(an) * q, y + Math.sin(an) * q]); } for (const [g, col] of [[a, 'rgba(232,230,224,.82)'], [h, 'rgba(106,106,106,.9)'], [r, 'rgb(0,92,255)']]) { g.fillStyle = col; g.beginPath(); P.forEach((p, k) => k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.fill(); } };
  for (let i = 0; i < 420; i++) { const t = Math.random() < .6 ? (Math.random() < .5 ? 1 : 0) + (Math.random() - .5) * Math.random() * .5 : Math.random(), e = Math.random() < .55 ? rand(4, 8) : rand(0, 3), p = clamp(t, 0, 1) * N, side = Math.random() * 4 | 0, o = e * u; chip(side < 2 ? p : side === 2 ? o : N - o, side === 0 ? o : side === 1 ? N - o : p, rand(.5, 2.7) * u * (Math.random() < .12 ? 2 : 1)); }
  for (let i = 0; i < 60; i++) chip(rand(N), rand(N), rand(.4, 1.6) * u);
  { const gr = a.createLinearGradient(0, N * .6, 0, N); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(20,12,5,.28)'); a.fillStyle = gr; a.fillRect(0, 0, N, N); }
  const hf = hfOf(h, N), n = hfNoise(N, 128, 2, 11); for (let i = 0; i < hf.length; i++) hf[i] += (n[i] - .5) * .035;
  return txMate(txOf(a.canvas, 1, 1, true), hfNormal(hfBlur(hf, N), N, 13), txOf(r.canvas));
}
/* poured concrete in slabs: stains, cracks, pits, the joint round each slab and the marks tyres leave */
function txConcrete(N = 1024, rx = 7, ry = 10) {
  const u = N / 512, a = txCan(N, '#5b5c5a'), h = txCan(N, '#808080'); speckle(a, N, N, 14000 * u * u, .05);
  for (let i = 0; i < 2600; i++) { const v = Math.random() < .5 ? 20 : 205; a.fillStyle = `rgba(${v},${v},${v},${rand(.08, .22)})`; a.beginPath(); a.arc(rand(N), rand(N), rand(.5, 1.8) * u, 0, TAU); a.fill(); }
  for (let i = 0; i < 90; i++) { a.fillStyle = `rgba(${pick([0, 0, 20, 120])},${pick([0, 10, 90])},0,${rand(.02, .07)})`; a.beginPath(); a.ellipse(rand(N), rand(N), rand(10, 70) * u, rand(8, 40) * u, rand(PI), 0, TAU); a.fill(); }
  for (let i = 0; i < 420; i++) { const x = rand(N), y = rand(N), q = rand(.5, 1.9) * u; a.fillStyle = 'rgba(0,0,0,.26)'; a.beginPath(); a.arc(x, y, q, 0, TAU); a.fill(); h.fillStyle = 'rgba(40,40,40,.9)'; h.beginPath(); h.arc(x, y, q * 1.2, 0, TAU); h.fill(); }
  for (const [g, col, w] of [[a, 'rgba(0,0,0,.55)', 3 * u], [h, '#202020', 5 * u]]) { g.strokeStyle = col; g.lineWidth = w; g.strokeRect(0, 0, N, N); }
  for (let i = 0; i < 6; i++) { let x = rand(N), y = rand(N); const P = [[x, y]]; for (let j = 0; j < 11; j++) { x += rand(-22, 22) * u; y += rand(-22, 22) * u; P.push([x, y]); } for (const [g, col, w] of [[a, 'rgba(12,12,12,.36)', .9 * u], [h, 'rgba(30,30,30,.95)', 1.6 * u]]) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); P.forEach((p, k) => k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); } }
  a.strokeStyle = 'rgba(0,0,0,.24)'; a.lineWidth = 5 * u; for (let i = 0; i < 5; i++) { a.beginPath(); const y = rand(N); a.moveTo(0, y); a.bezierCurveTo(N * .3, y + rand(-60, 60) * u, N * .6, y + rand(-60, 60) * u, N, y + rand(-40, 40) * u); a.stroke(); }
  const hf = hfOf(h, N), n = hfNoise(N, 64, 4, 23); for (let i = 0; i < hf.length; i++) hf[i] += (n[i] - .5) * .16;
  return txMate(txOf(a.canvas, rx, ry, true), hfNormal(hfBlur(hf, N), N, 9, rx, ry));
}
/* corrugated sheet: the ribs are in the normal map now, and rust runs down from the fixings */
function txCorr(N = 512, rx = 12, ry = 3) {
  const u = N / 256, P = 16 * u, a = txCan(N);
  for (let x = 0; x < N; x += P) { const gr = a.createLinearGradient(x, 0, x + P, 0); gr.addColorStop(0, '#383d42'); gr.addColorStop(.5, '#5d646b'); gr.addColorStop(1, '#383d42'); a.fillStyle = gr; a.fillRect(x, 0, P, N); }
  for (let i = 0; i < 40; i++) { const x = rand(N), l = rand(30, 200) * u, gr = a.createLinearGradient(0, 0, 0, l); gr.addColorStop(0, 'rgba(120,58,22,.55)'); gr.addColorStop(1, 'rgba(120,58,22,0)'); a.fillStyle = gr; a.fillRect(x, 0, rand(3, 9) * u, l); }
  a.fillStyle = 'rgba(0,0,0,.45)'; a.fillRect(0, 0, N, 5 * u); a.fillRect(0, 126 * u, N, 4 * u); speckle(a, N, N, 3000 * u * u, .05);
  for (let x = P / 2; x < N; x += P) for (const y of [9 * u, 134 * u]) { a.fillStyle = 'rgba(20,20,20,.7)'; a.beginPath(); a.arc(x, y, 1.6 * u, 0, TAU); a.fill(); a.fillStyle = 'rgba(230,230,230,.6)'; a.fillRect(x - u, y - 1.4 * u, u, u); }
  const hf = new Float32Array(N * N); for (let y = 0, i = 0; y < N; y++) { const sm = y < 5 * u || (y > 126 * u && y < 130 * u) ? -.35 : 0; for (let x = 0; x < N; x++, i++) hf[i] = .5 - .5 * Math.cos(x / P * TAU) + sm; }
  return txMate(txOf(a.canvas, rx, ry, true), hfNormal(hf, N, 5.5, rx, ry));
}
/* rock: ridges and bedding, for every boulder, spire and crag */
function txRock(N = 512) {
  const n1 = hfNoise(N, 4, 6, 5, .55), n2 = hfNoise(N, 3, 3, 9), hf = new Float32Array(N * N);
  for (let y = 0, i = 0; y < N; y++) for (let x = 0; x < N; x++, i++) hf[i] = (1 - Math.abs(2 * n1[i] - 1)) * .6 + n1[i] * .25 + (.5 + .5 * Math.sin((y / N * 9 + n2[i] * 2.2) * TAU)) * .15;
  return txMate(dtex(N, d => { for (let i = 0, o = 0; i < hf.length; i++, o += 4) { const v = 150 + hf[i] * 110 + (Math.random() - .5) * 22; d[o] = v + 3; d[o + 1] = v; d[o + 2] = v - 4; d[o + 3] = 255; } }, 3, 2, true), hfNormal(hf, N, 26, 3, 2));
}
const TX = {
  panel: txPanel(), concrete: txConcrete(), corr: txCorr(), rock: txRock(),
  hazard: ctex(256, 256, (g, w, h) => { g.fillStyle = '#b98a14'; g.fillRect(0, 0, w, h); g.fillStyle = '#131313'; for (let i = -2; i < 5; i++) { g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128 + 64, 0); g.lineTo(i * 128 + 64 + h, h); g.lineTo(i * 128 + h, h); g.fill(); } speckle(g, w, h, 3600, .08); for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(230,220,190,${rand(.1, .3)})`; g.lineWidth = rand(.6, 1.6); const x = rand(w), y = rand(h), a = rand(TAU), l = rand(5, 30); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); } }),
  grate: ctex(128, 128, (g, w, h) => { g.fillStyle = '#17191b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#6e757c'; g.lineWidth = 10; g.strokeRect(0, 0, w, h); g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; g.beginPath(); g.moveTo(1.5, 0); g.lineTo(w, h - 1.5); g.moveTo(w - 1.5, 0); g.lineTo(0, h - 1.5); g.stroke(); }),
  tread: ctex(128, 128, (g, w, h) => { g.fillStyle = '#1b1c1e'; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) { g.fillStyle = '#4a4d51'; g.fillRect(0, i * 32 + 4, w, 14); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(0, i * 32 + 4, w, 2); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, i * 32 + 16, w, 2); } g.fillStyle = '#0a0a0a'; g.fillRect(56, 0, 16, h); speckle(g, w, h, 500, .08); }),
};
TX.panelN = TX_MATE.get(TX.panel.source).nm;

/* ============ MATERIALS ============ */
/* a material given a picture that has a normal map (and a wear map) gets those too, at the picture's own repeat. Where the wear map scales the metalness, the figure asked for is raised to match */
const std = o => {
  const m = o.map && TX_MATE.get(o.map.source), x = {};
  if (m) { const same = t => { if (t.repeat.equals(o.map.repeat)) return t; const c = t.clone(); c.repeat.copy(o.map.repeat); c.needsUpdate = true; return c; }; x.normalMap = same(m.nm); if (m.orm) { x.roughnessMap = x.metalnessMap = same(m.orm); x.metalness = Math.min(1, (o.metalness ?? 0) / TX_METAL); } }
  return new THREE.MeshStandardMaterial({ envMapIntensity: .32, ...o, ...x });
};
/* what a surface throws straight back from a light moves across it as the camera does, and a big flat one under a strong light (a floor, a street of windows) glares and sparkles with it. matShine(m, cap) lets
   a material reflect a light directly only up to cap, with a soft knee and the light's own colour kept; the light it scatters, and the room or the sky mirrored in it, are untouched. matFloor(o, cap) is a
   floor: std() with that cap. A floor wants to be lit by what it scatters (little metal, a lot of roughness), which stays put when the camera moves; over a plate's wear map a roughness near 1 leaves the
   scratches a little glossier than the paint and no more. The cap is a uniform, so materials with different caps share one program */
const SHINE_FLOOR = .07, matShine = (m, cap = SHINE_FLOOR) => {
  m.userData.shine = cap;
  m.onBeforeCompile = sh => {
    sh.uniforms.uShine = { value: cap };
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uShine;').replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
	{ float shK = max( reflectedLight.directSpecular.r, max( reflectedLight.directSpecular.g, reflectedLight.directSpecular.b ) ); reflectedLight.directSpecular *= uShine * ( 1. - exp( - shK / uShine ) ) / max( shK, 1e-5 ); }`);
  };
  return m;
}, matFloor = (o, cap) => matShine(std({ envMapIntensity: .16, ...o }), cap);
const glowMat = (hex, i = 2.2) => new THREE.MeshStandardMaterial({ color: 0x0a0a0a, emissive: hex, emissiveIntensity: i });
const M = {
  steel: std({ color: 0x70767d, metalness: .85, roughness: .45, map: TX.panel }),
  dark: std({ color: 0x24272b, metalness: .8, roughness: .5 }),
  girder: std({ color: 0x3a3f45, metalness: .7, roughness: .6 }),
  chrome: std({ color: 0xd9dde2, metalness: 1, roughness: .12, envMapIntensity: 1 }),
  rust: std({ color: 0x6d3b20, metalness: .5, roughness: .85, map: TX.panel }),
  black: std({ color: 0x0d0e10, metalness: .4, roughness: .8 }),
  yellow: std({ color: 0xa87a12, metalness: .45, roughness: .6, map: TX.panel }),
  red: std({ color: 0x9c2018, metalness: .4, roughness: .55, map: TX.panel }),
  blue: std({ color: 0x1f4f7c, metalness: .4, roughness: .55, map: TX.panel }),
  hazard: std({ map: TX.hazard, metalness: .3, roughness: .7 }),
  grate: std({ map: TX.grate, metalness: .8, roughness: .5 }),
  amber: glowMat(0xff9a1a, 3), redGlow: glowMat(0xff2a12, 3), cyan: glowMat(0x5fd8ff, 2.4), white: glowMat(0xfff1d6, 3.2), green: glowMat(0x54ff6a, 2),
};

/* paint schemes — every mech owns its own material set so paint can change live */
const PAINTS = [
  { n: 'OLIVE DRAB', pri: 0x5d6b3e, sec: 0x30362a, acc: 0xd9a21b, glow: 0xffa826 },
  { n: 'DESERT RAT', pri: 0xb89b68, sec: 0x5a4a35, acc: 0x7a2e1c, glow: 0xff7a2a },
  { n: 'ARCTIC', pri: 0xd5dadd, sec: 0x56626e, acc: 0x1f7fd1, glow: 0x59c8ff },
  { n: 'CRIMSON GUARD', pri: 0x8e1f1f, sec: 0x2a2224, acc: 0xd8d2c2, glow: 0xff4433 },
  { n: 'HAZARD', pri: 0xe0a514, sec: 0x25262a, acc: 0x111111, glow: 0xfff06a },
  { n: 'NIGHT OPS', pri: 0x2d3540, sec: 0x15181c, acc: 0x35d0c0, glow: 0x45ffe0 },
];
function makeMats(pi) {
  const p = pi && typeof pi === 'object' ? pi : PAINTS[pi] || PAINTS[0];
  return {
    pri: std({ color: p.pri, map: TX.panel, metalness: .5, roughness: .6 }),
    sec: std({ color: p.sec, map: TX.panel, metalness: .6, roughness: .55 }),
    acc: std({ color: p.acc, metalness: .4, roughness: .5 }),
    joint: std({ color: 0x2b2e33, metalness: .9, roughness: .35 }),
    blk: std({ color: 0x121315, metalness: .6, roughness: .7 }),
    glass: std({ color: 0x16303a, metalness: 1, roughness: .07, emissive: p.glow, emissiveIntensity: .22, envMapIntensity: 1.3 }),
    glow: glowMat(p.glow, 2.4),
  };
}
function applyPaint(m, pi) { const p = pi && typeof pi === 'object' ? pi : PAINTS[pi] || PAINTS[0]; m.pri.color.set(p.pri); m.sec.color.set(p.sec); m.acc.color.set(p.acc); m.glass.emissive.set(p.glow); m.glow.emissive.set(p.glow); }

/* ============ GEOMETRY HELPERS (parent first, cached geometry) ============ */
const geoC = {}, UB = new THREE.BoxGeometry(1, 1, 1);
function fin(p, m, x, y, z, rx, ry, rz) { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.castShadow = m.receiveShadow = true; p && p.add(m); return m; }
function box(p, mat, w, h, d, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) { const m = new THREE.Mesh(UB, mat); m.scale.set(w, h, d); return fin(p, m, x, y, z, rx, ry, rz); }
/* box whose +Y face is scaled by (tx,tz) — angular armour plate */
function tbox(p, mat, w, h, d, tx, tz, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const k = `t${w},${h},${d},${tx},${tz}`; let g = geoC[k];
  if (!g) { g = new THREE.BoxGeometry(w, h, d); const a = g.attributes.position; for (let i = 0; i < a.count; i++) if (a.getY(i) > 0) { a.setX(i, a.getX(i) * tx); a.setZ(i, a.getZ(i) * tz); } g.computeVertexNormals(); geoC[k] = g; }
  return fin(p, new THREE.Mesh(g, mat), x, y, z, rx, ry, rz);
}
function cyl(p, mat, rt, rb, h, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, seg = 14) { const k = `c${rt},${rb},${h},${seg}`; const g = geoC[k] || (geoC[k] = new THREE.CylinderGeometry(rt, rb, h, seg)); return fin(p, new THREE.Mesh(g, mat), x, y, z, rx, ry, rz); }
function sph(p, mat, r, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) { const k = `s${r}`; const g = geoC[k] || (geoC[k] = new THREE.SphereGeometry(r, 20, 14)); const m = fin(p, new THREE.Mesh(g, mat), x, y, z, 0, 0, 0); m.scale.set(sx, sy, sz); return m; }
function grp(p, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.set(rx, ry, rz); p && p.add(g); return g; }
const noShadow = o => { o.traverse(c => { c.castShadow = false; }); return o; };

/* ============ PARTICLES ============ */
class Particles {
  constructor(scene, max = 2000, additive = true) {
    this.max = max; this.i = 0;
    this.pos = new Float32Array(max * 3); this.col = new Float32Array(max * 4); this.siz = new Float32Array(max);
    this.vel = new Float32Array(max * 3); this.life = new Float32Array(max); this.ml = new Float32Array(max); this.par = new Float32Array(max * 5);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3)); g.setAttribute('aCol', new THREE.BufferAttribute(this.col, 4)); g.setAttribute('aSize', new THREE.BufferAttribute(this.siz, 1)); g.setAttribute('aId', new THREE.BufferAttribute(Float32Array.from({ length: max }, (_, i) => i), 1));
    /* a spark is a soft disc with a hotter middle. Smoke is a disc with a ragged edge, every puff turned its own way (aId), lighter on top than underneath, and tinted by uL: nothing lights a
       particle, so whoever owns the scene says how bright the day is there (white unless told) */
    this.mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, uniforms: { uS: { value: innerHeight }, uL: { value: V3(1, 1, 1) } },
      vertexShader: `attribute vec4 aCol;attribute float aSize,aId;varying vec4 vC;varying float vK;uniform float uS;void main(){vC=aCol;vK=aId;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*uS/max(.1,-mv.z);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: additive ? `varying vec4 vC;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.08,d)*vC.a;if(a<.004)discard;gl_FragColor=vec4(vC.rgb*(.8+.7*smoothstep(.28,0.,d)),a);}`
        : `varying vec4 vC;varying float vK;uniform vec3 uL;float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 q=gl_PointCoord-.5;float d=length(q),r=vK*1.7,c=cos(r),s=sin(r);vec2 p=vec2(q.x*c-q.y*s,q.x*s+q.y*c);float n=vn(p*5.+vK*3.1)*.6+vn(p*11.+vK)*.4;
float a=smoothstep(.5,.06,d+(n-.5)*.17)*vC.a;if(a<.004)discard;gl_FragColor=vec4(vC.rgb*uL*(.78+.3*(.5-q.y))*(.88+.24*n),a);}`
    });
    this.pts = new THREE.Points(g, this.mat); this.pts.frustumCulled = false; this.pts.renderOrder = 5; scene.add(this.pts); this.geo = g;
  }
  emit(x, y, z, vx, vy, vz, life, size, r, g, b, a = 1, grav = 0, drag = 0, grow = 0) {
    const i = this.i; this.i = (i + 1) % this.max;
    this.pos.set([x, y, z], i * 3); this.vel.set([vx, vy, vz], i * 3); this.col.set([r, g, b, a], i * 4);
    this.life[i] = this.ml[i] = life; this.par.set([grav, drag, grow, size, a], i * 5); this.siz[i] = size;
  }
  update(dt) {
    const { pos, vel, life, ml, par, col, siz } = this;
    for (let i = 0; i < this.max; i++) {
      if (life[i] <= 0) continue; life[i] -= dt;
      if (life[i] <= 0) { siz[i] = 0; col[i * 4 + 3] = 0; continue; }
      const k = life[i] / ml[i], d = Math.max(0, 1 - par[i * 5 + 1] * dt);
      vel[i * 3] *= d; vel[i * 3 + 1] = vel[i * 3 + 1] * d - par[i * 5] * dt; vel[i * 3 + 2] *= d;
      pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      siz[i] = par[i * 5 + 3] * (1 + par[i * 5 + 2] * (1 - k)); col[i * 4 + 3] = par[i * 5 + 4] * Math.min(1, k * 2.2);
    }
    this.geo.attributes.position.needsUpdate = this.geo.attributes.aCol.needsUpdate = this.geo.attributes.aSize.needsUpdate = true;
  }
}
/* common bursts — fx = {spark: additive Particles, smoke: normal Particles} */
function sparks(fx, p, n = 12, pow = 6, r = 4, g = 2.2, b = .6) { for (let i = 0; i < n; i++) fx.spark.emit(p.x, p.y, p.z, rand(-pow, pow), rand(-pow * .3, pow), rand(-pow, pow), rand(.25, .9), rand(.12, .3), r, g, b, 1, 14, .6); }
function puff(fx, p, n = 6, sz = 1.5, c = .5, a = .35, up = 1.5, spread = 1.5) { for (let i = 0; i < n; i++) fx.smoke.emit(p.x + rand(-.3, .3), p.y, p.z + rand(-.3, .3), rand(-spread, spread), rand(.2, up), rand(-spread, spread), rand(1, 2.6), sz * rand(.7, 1.3), c, c, c * 1.03, a, -.3, .9, 2.2); }
function explode(fx, p, s = 1) {
  for (let i = 0; i < 26 * s; i++) fx.spark.emit(p.x, p.y, p.z, rand(-9, 9) * s, rand(-2, 11) * s, rand(-9, 9) * s, rand(.3, 1), rand(.5, 1.6) * s, 5, 2.2, .5, 1, 9, 1.2);
  for (let i = 0; i < 5 * s; i++) fx.spark.emit(p.x, p.y, p.z, rand(-2, 2), rand(0, 3), rand(-2, 2), rand(.15, .35), rand(4, 7) * s, 6, 3.5, 1.2, .9, 0, 0, .6);
  puff(fx, p, 10 * s, 3.2 * s, .16, .6, 5, 4 * s); if (fx === FD.fx) fieldBoom(p, s);
}

