/* ============ THE BRIEFING ROOM: BEFORE A STORY OPERATION THE XO WALKS THE LANCE THROUGH IT — WHAT IS KNOWN, AT ANY RATE ============ */
/* a dark room, rows of seats, a lectern and one big screen. A briefing is a list of steps { t: what is said, by: who says it (the XO unless named), show: [marks added to the screen], shot }.
   marks: ['site', key, label, colour] · ['foe' | 'ally' | 'unk', key, label] · ['route', [keys], colour] · ['ring', key, metres, label] · ['card', title, [lines]] · ['face', character, [lines]] · ['clear'].
   A key names one of the chapter's sites, or is an [x, z] pair. The map behind the marks is the real ground: the theatre's heights sampled from its seed before anything is built */
const BRF = { scene: new THREE.Scene(), people: [], guests: [], seats: [], built: false, c: null, H: null, i: -1, marks: [], card: null, stepT: 0, drawT: 0, map: null, mapK: '', talk: null, speaking: false, shot: 'wide' };
BRF.camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, .1, 60);
const brfCam = { pos: V3(.4, 1.66, 5.2), look: V3(0, 2.2, -6.3), cPos: V3(.4, 1.66, 5.2), cLook: V3(0, 2.2, -6.3), sx: 0, sy: 0 };
const BRF_SHOT = { wide: [[.5, 1.68, 5.3], [0, 2.05, -6.3]], screen: [[.25, 1.82, 1.15], [.15, 1.5, -6.3]], xo: [[-1.5, 1.6, -1.1], [-3.2, 1.78, -6.2]] };
function brfBuild() {
  if (BRF.built) return; BRF.built = true;
  const sc = BRF.scene, W = 12.4, D = 13.4, H = 4.7, wall = repMat(TX.panel, 5, 2, { color: 0x2c3540, metalness: .5, roughness: .7 }), dk = M.dark, carpet = std({ color: 0x1a2028, roughness: .95, metalness: 0 }), seatM = std({ color: 0x27303a, roughness: .7, metalness: .2 }), pad = std({ color: 0x5a2a1c, roughness: .85 });
  sc.background = new THREE.Color(0x030405); sc.fog = new THREE.Fog(0x030405, 14, 40); sc.environment = ENV;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), carpet); fl.rotation.x = -PI / 2; fl.receiveShadow = true; sc.add(fl);
  box(sc, std({ color: 0x07090b, roughness: 1, metalness: 0 }), W + 1, .4, D + 1, 0, H + .2, 0); for (const z of [-D / 2 - .2, D / 2 + .2]) box(sc, wall, W, H, .4, 0, H / 2, z); for (const x of [-W / 2 - .2, W / 2 + .2]) box(sc, wall, .4, H, D, x, H / 2, 0);
  for (let z = -4; z <= 4; z += 4) box(sc, M.girder, W, .3, .26, 0, H - .15, z); for (const x of [-W / 2 + .04, W / 2 - .04]) { box(sc, dk, .08, 1.1, D, x, .55, 0); noShadow(box(sc, glowMat(0x2f6f9a, .9), .03, .03, D - .6, x * .992, 1.13, 0)); }
  /* the stage, the lectern and the screen */
  box(sc, std({ color: 0x20262d, roughness: .6, metalness: .4 }), W, .2, 2.9, 0, .1, -5.25); noShadow(box(sc, glowMat(0xffb21a, 1.1), W - .6, .025, .03, 0, .2, -3.81));
  const SW = 7.2, SH = 4.05, cv = BRF.cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const tx = BRF.tex = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
  const scr = BRF.screen = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false })); scr.position.set(.7, 2.55, -D / 2 + .09); sc.add(scr);
  box(sc, dk, SW + .3, SH + .3, .1, .7, 2.55, -D / 2 + .03); for (const s of [-1, 1]) box(sc, M.girder, .12, SH + .5, .16, .7 + s * (SW / 2 + .2), 2.55, -D / 2 + .08);
  const lec = grp(sc, -4.25, .2, -4.55, 0, .35, 0); box(lec, M.steel, .62, 1.02, .5, 0, .51, 0); box(lec, dk, .78, .05, .6, 0, 1.06, .02, .28); noShadow(box(lec, glowMat(0xffd9a0, 2.4), .3, .015, .12, 0, 1.1, -.12, .28)); box(lec, M.yellow, .64, .06, .52, 0, .12, 0);
  BRF.lamp = new THREE.SpotLight(0xffe2b8, 22, 5, .7, .8, 1.4); BRF.lamp.position.set(-3.9, 3.9, -3.2); BRF.lamp.target.position.set(-4.25, 1.2, -4.9); sc.add(BRF.lamp, BRF.lamp.target);
  /* the projector and its beam; the screen itself lights the room */
  const pj = grp(sc, .7, H - .55, 2.6); box(pj, dk, .5, .24, .7); cyl(pj, M.girder, .04, .04, .5, 0, .37, 0); noShadow(cyl(pj, glowMat(0xcfe8ff, 3), .07, .07, .04, 0, -.02, -.36, PI / 2, 0, 0, 12));
  const bg = new THREE.CylinderGeometry(.06, 1, 1, 4, 1, true); bg.rotateY(PI / 4); bg.rotateX(PI / 2); bg.translate(0, 0, -.5);
  const beam = BRF.beam = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ color: 0x9fcfff, transparent: true, opacity: .045, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  beam.position.set(.7, H - .57, 2.24); beam.scale.set(SW * .71, SH * .71, 8.75); beam.lookAt(.7, 2.55, -D / 2 + .1); sc.add(beam);
  const glow = BRF.glow = new THREE.SpotLight(0x9fd0ff, 150, 19, .86, .95, 1.25); glow.position.set(.7, 2.9, -D / 2 + .5); glow.target.position.set(.4, -.6, 3); glow.castShadow = true; glow.userData.sh = 1; glow.shadow.mapSize.set(1024, 1024); glow.shadow.bias = -.0008; sc.add(glow, glow.target);
  sc.add(new THREE.HemisphereLight(0x8fa8c8, 0x0c0e12, .22)); BRF.fill = new THREE.PointLight(0xfff0e2, 0, 5, 1.5); sc.add(BRF.fill);
  /* three rows of seats with an aisle up the middle; a door at the back with a lit sign over it */
  const xs = [-3.5, -2.6, -1.7, 1.7, 2.6, 3.5];
  [-1.5, .3, 2.1].forEach((z, r) => xs.forEach((x, i) => {
    const g = grp(sc, x + (r % 2 ? .12 : 0), 0, z); box(g, seatM, .5, .06, .48, 0, .43, 0); box(g, pad, .44, .04, .42, 0, .475, 0); box(g, seatM, .5, .52, .05, 0, .76, .26, -.14); for (const sx of [-.22, .22]) for (const sz of [-.2, .2]) box(g, M.girder, .035, .42, .035, sx, .21, sz); box(g, dk, .2, .025, .32, .3, .68, -.1);
    BRF.seats.push({ x: g.position.x, z, r, i });
  }));
  box(sc, dk, 1.3, 2.3, .1, 4.4, 1.15, D / 2 - .02); noShadow(box(sc, glowMat(0x39d98a, 1.6), .5, .16, .03, 4.4, 2.5, D / 2 - .06));
  const urn = grp(sc, -5.4, 0, 4.9); box(urn, M.steel, .9, .86, .5, 0, .43, 0); cyl(urn, M.chrome, .15, .15, .4, -.15, 1.06, 0); cyl(urn, dk, .16, .13, .03, -.15, 1.27, 0); for (let i = 0; i < 3; i++) cyl(urn, M.white, .04, .035, .09, .2 + (i % 2) * .1, .905, -.1 + i * .1, 0, 0, 0, 8);
  /* the company's colours on the side wall */
  { const fc = labelTex(256, 256, (g, w, h) => { g.fillStyle = '#0d1116'; g.fillRect(0, 0, w, h); drawLogo(g, w / 2, h / 2, w * .44); }), f = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshStandardMaterial({ map: fc, roughness: .8 })); f.position.set(W / 2 - .01, 2.6, -1.2); f.rotation.y = -PI / 2; sc.add(f); BRF.flag = fc; }
  /* the people: the XO at the lectern, the two deck pilots in the front row, Mira and Dutch on their feet at the walls, whoever else is off shift */
  const Wd = BRF.crowd = new Crowd({ poi: V3(.7, 2.4, -6.5) }), eye = BRF.eye = V3(.7, 2.3, -6.4);
  const mk = (ch, x, z, yaw, role, extra = {}) => { const cast = CAST[ch.seed] || {}, h = new Human(lookOf(ch.seed, cast), { scene: sc, role: role.replace(/\d/, ''), col: ch.col, x, z, yaw, props: ROLEPROP[role], ...extra }); if (cast.habit) h.habit = cast.habit; h.ch = ch; Wd.add(h); BRF.people.push(h); return h; };
  const sit = (h, s) => { const o = { h: .47, back: .26, mode: 'back' }; h.g.position.set(s.x, 0, s.z - .26); h.yaw = PI; h.g.rotation.y = PI; h.look = eye; s.by = h; h.brain = function* (h) { for (;;) { o.mode = Math.random() < .4 ? 'fwd' : 'back'; yield* hDo(h, 'sit', rand(14, 40), o); } }; h.co = h.brain(h); return h; };
  BRF.xo = mk(CREW.xo, -4.05, -4.95, .5, 'officer', { y: .2 }); BRF.xo.brain = function* (h) { for (;;) { yield* hDo(h, pick(['tablet', 'watch', 'think']), rand(4, 8)); } }; BRF.xo.co = BRF.xo.brain(BRF.xo);
  BRF.who = { [CREW.xo.seed]: BRF.xo };
  const S = BRF.seats, seatAt = (r, i) => S.find(s => s.r === r && s.i === i);
  BRF.who[PILOTS[0].ch.seed] = sit(mk(PILOTS[0].ch, 0, 0, PI, 'pilot0', { props: null }), seatAt(0, 3)); BRF.who[PILOTS[1].ch.seed] = sit(mk(PILOTS[1].ch, 0, 0, PI, 'pilot'), seatAt(0, 2));
  const mira = BRF.who[CREW.intel.seed] = mk(CREW.intel, 5.3, -3.3, -1.9, 'analyst', { props: { l: 'tablet' } }); mira.look = eye; mira.brain = function* (h) { for (;;) yield* hDo(h, pick(['tablet', 'watch', 'think', 'tablet']), rand(5, 10)); }; mira.co = mira.brain(mira);
  const dutch = BRF.who[CREW.chief.seed] = mk(CREW.chief, -5.45, -.4, 2.2, 'tech'); dutch.look = eye; dutch.brain = function* (h) { for (;;) yield* hDo(h, pick(['watch', 'watch', 'think']), rand(6, 12)); }; dutch.co = dutch.brain(dutch);
  [[0, 0, 'pilot'], [0, 5, 'pilot'], [1, 1, 'mech'], [1, 2, 'ops'], [1, 4, 'pilot'], [2, 0, 'mech'], [2, 3, 'ops'], [2, 5, 'mech']].forEach(([r, i, role], n) => sit(mk(mkChar(4301 + n * 17, role === 'pilot' ? 'RESERVE PILOT' : role === 'ops' ? 'OPERATIONS' : 'BAY CREW', '#9fb7bd'), 0, 0, PI, role, role === 'mech' ? { fit: { hat: null, vest: null, ear: 0 } } : {}), seatAt(r, i)));
}
/* the theatre as the screen shows it: heights from the same generator the field will use, tinted like a plotting table */
function brfBake(c) {
  const key = c.story + c.chap; if (BRF.mapK === key) return; BRF.mapK = key;
  const H = STORY[c.story].ch[c.chap], B = BIOMES[c.biome], N = 240, sz = 1000 * STK, keep = { ...EV }, fk = FD.k, R = mulberry(c.seed * 7919 + 13), hs = new Float32Array(N * N);
  Object.assign(EV, { key: c.biome, B, seed: c.seed, home: !!H.home, ox: H.home ? 0 : R() * 900, oz: H.home ? 0 : R() * 900, pads: [], wl: B.wl ?? null, cr: [] }); FD.k = STK; if (B.init) B.init(R);
  let lo = 1e9, hi = -1e9; for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const h = hs[j * N + i] = genRaw((i + .5) / N * sz - sz / 2, (j + .5) / N * sz - sz / 2); if (h < lo) lo = h; if (h > hi) hi = h; }
  Object.assign(EV, keep); FD.k = fk;
  const cv = BRF.map || (BRF.map = document.createElement('canvas')); cv.width = cv.height = N; const g = cv.getContext('2d'), im = g.createImageData(N, N), d = im.data, wl = B.wl ?? null, step = [4, 5, 8, 10, 15, 20].find(s => (hi - lo) / s <= 12) || 25, pal = B.pal[0];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, h = hs[k], hx = hs[k + (i < N - 1 ? 1 : 0)] - hs[k - (i > 0 ? 1 : 0)], hz = hs[k + (j < N - 1 ? N : 0)] - hs[k - (j > 0 ? N : 0)], sh = clamp(.62 - (hx + hz) * .03, .25, 1.15), e = (h - lo) / (hi - lo || 1);
    let r = (22 + pal[0] * 120 + e * 34) * sh, gg = (40 + pal[1] * 120 + e * 34) * sh, b = (48 + pal[2] * 120 + e * 30) * sh;
    if (wl != null && h < wl) { if (B.liq === 'lava') { r = 215; gg = 86; b = 20; } else { r = 20; gg = 62; b = 92; } }
    else { const c0 = Math.floor(h / step); if ((i < N - 1 && Math.floor(hs[k + 1] / step) !== c0) || (j < N - 1 && Math.floor(hs[k + N] / step) !== c0)) { r += 22; gg += 30; b += 30; } }
    const o = k * 4; d[o] = r; d[o + 1] = gg; d[o + 2] = b; d[o + 3] = 255;
  }
  g.putImageData(im, 0, 0);
}
const brfXZ = (H, k) => Array.isArray(k) ? k : H.sites[k];
function brfDraw(t) {
  const g = BRF.cv.getContext('2d'), c = BRF.c, H = BRF.H; if (!c) return; const S = STORY[c.story], B = BIOMES[c.biome], MX = 34, MY = 34, MS2 = 652, sz = 1000 * STK, X = x => MX + (x / sz + .5) * MS2, Z = z => MY + (z / sz + .5) * MS2, now2 = BRF.i, fresh = clamp(BRF.stepT * 1.6, 0, 1);
  g.fillStyle = '#04080b'; g.fillRect(0, 0, 1280, 720);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(BRF.map, MX, MY, MS2, MS2);
  g.strokeStyle = 'rgba(160,220,255,.13)'; g.lineWidth = 1; g.font = '13px Menlo,monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let i = 0; i <= 12; i++) { const v = MX + i * MS2 / 12; g.beginPath(); g.moveTo(v, MY); g.lineTo(v, MY + MS2); g.moveTo(MX, MY + (v - MX)); g.lineTo(MX + MS2, MY + (v - MX)); g.stroke(); if (i < 12) { g.fillStyle = 'rgba(190,230,255,.5)'; g.fillText('ABCDEFGHJKLM'[i], v + MS2 / 24, MY + 11); g.fillText(i + 1, MX + 11, MY + (v - MX) + MS2 / 24); } }
  g.strokeStyle = '#7fe7ff'; g.lineWidth = 2; g.strokeRect(MX, MY, MS2, MS2);
  g.save(); g.beginPath(); g.rect(MX, MY, MS2, MS2); g.clip();
  const label = (x, y, s, col, a = 1) => { g.font = 'bold 17px Menlo,monospace'; g.textAlign = 'left'; const w = g.measureText(s).width, lx = x + 16 + w > MX + MS2 - 6 ? x - 16 - w : x + 14; g.globalAlpha = a; g.fillStyle = 'rgba(2,6,9,.82)'; g.fillRect(lx - 4, y - 11, w + 8, 22); g.fillStyle = col; g.fillText(s, lx, y + 1); g.globalAlpha = 1; };
  for (const m of BRF.marks) {
    const [kind, k, a, b] = m.op, cur = m.i === now2, al = cur ? fresh : 1, pulse = cur ? .5 + .5 * Math.sin(t * 5) : 0;
    if (kind === 'route') {
      const P = k.map(q => brfXZ(H, q)), col = a || '#8dff6a'; let len = 0; const seg = []; for (let i = 1; i < P.length; i++) { const l = Math.hypot(X(P[i][0]) - X(P[i - 1][0]), Z(P[i][1]) - Z(P[i - 1][1])); seg.push(l); len += l; }
      let left = len * (cur ? clamp(BRF.stepT / 1.5, 0, 1) : 1); g.strokeStyle = col; g.lineWidth = 3.5; g.setLineDash([12, 8]); g.lineDashOffset = -t * 26; g.beginPath(); g.moveTo(X(P[0][0]), Z(P[0][1])); let ex = X(P[0][0]), ez = Z(P[0][1]), ea = 0;
      for (let i = 1; i < P.length && left > 0; i++) { const f = Math.min(1, left / seg[i - 1]), x0 = X(P[i - 1][0]), z0 = Z(P[i - 1][1]); ex = x0 + (X(P[i][0]) - x0) * f; ez = z0 + (Z(P[i][1]) - z0) * f; ea = Math.atan2(Z(P[i][1]) - z0, X(P[i][0]) - x0); g.lineTo(ex, ez); left -= seg[i - 1]; }
      g.stroke(); g.setLineDash([]); g.fillStyle = col; g.save(); g.translate(ex, ez); g.rotate(ea); g.beginPath(); g.moveTo(13, 0); g.lineTo(-7, -8); g.lineTo(-7, 8); g.closePath(); g.fill(); g.restore(); continue;
    }
    const p = brfXZ(H, k), x = X(p[0]), y = Z(p[1]);
    if (kind === 'ring') { const r = a / sz * MS2; g.globalAlpha = al; g.fillStyle = 'rgba(255,74,42,.13)'; g.strokeStyle = '#ff5a3a'; g.lineWidth = 2 + pulse * 2; g.setLineDash([7, 6]); g.beginPath(); g.arc(x, y, r * (cur ? .7 + .3 * fresh : 1), 0, TAU); g.fill(); g.stroke(); g.setLineDash([]); g.globalAlpha = 1; if (b) label(x + r * .72 - 14, y - r * .72, b, '#ff8a6a', al); continue; }
    const col = kind === 'foe' ? '#ff5a3a' : kind === 'ally' ? '#5ac8ff' : kind === 'unk' ? '#ffb21a' : b || '#8dff6a', s = 10 + pulse * 4;
    g.globalAlpha = al; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 3;
    if (cur) { g.globalAlpha = (1 - (t * .9 % 1)) * .8; g.beginPath(); g.arc(x, y, 12 + (t * .9 % 1) * 30, 0, TAU); g.stroke(); g.globalAlpha = al; }
    g.beginPath();
    if (kind === 'foe') { g.moveTo(x, y - s); g.lineTo(x + s, y); g.lineTo(x, y + s); g.lineTo(x - s, y); g.closePath(); g.fill(); }
    else if (kind === 'ally') { g.arc(x, y, s * .8, 0, TAU); g.fill(); }
    else if (kind === 'unk') { g.arc(x, y, s, 0, TAU); g.stroke(); g.font = 'bold 17px Menlo,monospace'; g.textAlign = 'center'; g.fillText('?', x, y + 1); }
    else { g.rect(x - s * .8, y - s * .8, s * 1.6, s * 1.6); g.stroke(); g.fillRect(x - 3, y - 3, 6, 6); }
    g.globalAlpha = 1; if (a) label(x, y + (kind === 'unk' ? 25 : kind === 'foe' || kind === 'ally' ? 0 : -1), a, col, al);
  }
  g.restore();
  /* the right-hand panel: what this is, then whatever the current step put up */
  const PX = 716, PW = 536; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.fillStyle = S.col; g.font = 'bold 30px Menlo,monospace'; g.fillText(S.name, PX, 62, PW); g.fillStyle = '#e6f4ff'; g.font = '21px Menlo,monospace'; g.fillText(`${STNUM[c.chap]} · ${c.title.toUpperCase()}`, PX, 94, PW);
  g.fillStyle = '#7fb0c8'; g.font = '15px Menlo,monospace'; g.fillText(`OP. ${c.op} · ${B.name} · ${skyOf(c.biome, c.mood, c.tod)}`, PX, 120, PW); g.fillText(`${c.site.toUpperCase()} · ${(STK).toFixed(1)} KM · GRID 200 M`, PX, 141, PW);
  g.fillStyle = S.col; g.fillRect(PX, 154, PW, 2);
  const K = BRF.card; let y = 196;
  if (K) {
    const a = clamp((K.i === now2 ? BRF.stepT : 9) * 2, 0, 1); g.globalAlpha = a;
    if (K.op[0] === 'face') { const fc = BRF.fc || (BRF.fc = document.createElement('canvas')); if (BRF.fcK !== K.op[1].seed) { BRF.fcK = K.op[1].seed; fc.width = fc.height = 144; drawFace(fc, K.op[1]); } g.drawImage(fc, PX, 176, 168, 168); g.fillStyle = K.op[1].col; g.font = 'bold 22px Menlo,monospace'; g.fillText(K.op[1].name.toUpperCase(), PX + 186, 204, PW - 190); g.fillStyle = '#9fc0d0'; g.font = '14px Menlo,monospace'; g.fillText(K.op[1].role, PX + 186, 228, PW - 190); y = 250; }
    else { g.fillStyle = '#ffb21a'; g.font = 'bold 22px Menlo,monospace'; g.fillText(K.op[1], PX, y, PW); y += 34; }
    g.font = '18px Menlo,monospace'; const face = K.op[0] === 'face';
    for (const ln of K.op[2] || []) { const x0 = face && y < 356 ? PX + 186 : PX, mw = PX + PW - x0 - 22, words = ln.split(' '); let row = ''; g.fillStyle = '#7fe7ff'; g.fillRect(x0, y - 11, 8, 8); g.fillStyle = '#d6e8f2';
      for (const w of words) { if (g.measureText(row + w).width > mw && row) { g.fillText(row, x0 + 20, y); y += 24; row = ''; } row += w + ' '; } g.fillText(row, x0 + 20, y); y += 34; if (face && y > 330 && y < 372) y = 372; }
    g.globalAlpha = 1;
  }
  /* footer: where we are in the briefing, and the usual disclaimer */
  const n = H.brf.length; for (let i = 0; i < n; i++) { g.fillStyle = i < now2 ? '#2f6f9a' : i === now2 ? '#ffb21a' : '#18303c'; g.fillRect(PX + i * (PW / n), 664, PW / n - 5, 7); }
  g.fillStyle = '#5f8496'; g.font = '13px Menlo,monospace'; g.fillText(`${YARD.name.toUpperCase()} · LANCE BRIEFING · EYES ONLY`, PX, 696, PW); g.textAlign = 'right'; g.fillStyle = Math.sin(t * 3) > 0 ? '#ff5a3a' : '#5f2a20'; g.fillText('● LIVE', PX + PW, 696);
  g.textAlign = 'left'; g.fillStyle = 'rgba(160,220,255,.045)'; for (let yy = (t * 40) % 6; yy < 720; yy += 6) g.fillRect(0, yy, 1280, 1.5);
  BRF.tex.needsUpdate = true;
}
/* one step of the briefing: put its marks up, turn the room towards whoever is speaking, say the line */
function brfStep(i) {
  const H = BRF.H, n = H.brf.length; if (i >= n) return brfEnd(); const st = H.brf[i], who = st.by || CREW.xo; BRF.i = i; BRF.stepT = 0;
  for (const op of st.show || []) { if (op[0] === 'clear') { BRF.marks = BRF.marks.filter(m => m.op[0] === 'site' && m.op[1] === 'lz'); continue; } if (op[0] === 'card' || op[0] === 'face') BRF.card = { op, i }; else BRF.marks.push({ op, i }); }
  const p = BRF.who[who.seed] || BRF.guests.find(g => g.ch.seed === who.seed) || null; BRF.talk = p; BRF.shot = (st.shot === 'who' && !p ? null : st.shot) || (p && p !== BRF.xo ? 'who' : st.show ? 'screen' : 'xo');   /* somebody speaking who is not in the room is a voice over the map */ BRF.toScr = BRF.shot === 'who' && !!st.show;
  for (const h of BRF.people) if (h !== p && h !== BRF.xo) h.look = p && p !== BRF.xo ? p.head.getWorldPosition(V3()) : BRF.eye;
  if (BRF.shot === 'who') { const g = p.g.position, a = p.seat ? PI : p.yaw; BRF.focus = [[g.x + Math.sin(a) * 1.9 + .5, p.seat ? 1.25 : 1.6, g.z + Math.cos(a) * 1.9], [g.x, p.seat ? 1.12 : 1.5 * p.k, g.z]]; }
  dlg(who, st.t, [[i === n - 1 ? 'Go on' : 'Continue', () => brfStep(i + 1)], ['Skip to the end of the briefing', () => { for (let j = i + 1; j < n; j++) for (const op of H.brf[j].show || []) { if (op[0] === 'clear') BRF.marks = BRF.marks.filter(m => m.op[0] === 'site' && m.op[1] === 'lz'); else if (op[0] !== 'card' && op[0] !== 'face') BRF.marks.push({ op, i: j }); } BRF.i = n - 1; brfEnd(); }, i >= n - 1]], null);
}
function brfEnd() {
  const c = BRF.c, T = stState(c.story); BRF.talk = BRF.xo; BRF.shot = 'wide'; BRF.i = BRF.H.brf.length; for (const h of BRF.people) if (h !== BRF.xo) h.look = BRF.eye;
  dlg(CREW.xo, T.n ? 'You have flown this ground once already, so you know what the brief is worth. That is everything we have. Mount up.' : pick(['That is what we know. What we do not know will introduce itself. Mount up.', 'Questions? ...Good, because I have no more answers. Bay crew are standing by.', 'That is the plan. It will last until somebody shoots at it. Dismissed — and good hunting.']),
    [['To the mech bay', () => brfLeave('bay')], ['Run through it again', () => { BRF.marks = []; BRF.card = null; brfStep(0); }], ['Back to the command deck', () => brfLeave('hq')]], null);
}
function brfKey(e) { const O = $('dlgOpts').children, b = e.code === 'Space' || e.code === 'Enter' ? O[0] : e.code.startsWith('Digit') ? O[+e.code[5] - 1] : null; if (b && !b.disabled && !e.repeat) { e.preventDefault(); b.click(); } }
function updateBrief(dt, t) {
  if (dlgCur) { dlgCur.t += dt; const n = Math.floor(dlgCur.t * 95); $('dlgTxt').textContent = dlgCur.text.slice(0, n); BRF.speaking = n < dlgCur.text.length || vox.busy(); } else BRF.speaking = false;
  BRF.stepT += dt; if (BRF.toScr && BRF.stepT > 2.2) { BRF.toScr = false; BRF.shot = 'screen'; } if ((BRF.drawT -= dt) < 0) { BRF.drawT = .05; brfDraw(t); }
  const W = BRF.crowd; W.cam.copy(BRF.camera.position); W.talk = BRF.talk; W.speaking = BRF.speaking; W.update(dt);
  BRF.beam.material.opacity = .04 + .012 * Math.sin(t * 23) * Math.sin(t * 3.1); BRF.glow.intensity = 140 + 22 * Math.sin(t * 1.7) + (BRF.stepT < .25 ? 60 : 0);
  const C = brfCam, S = BRF.shot === 'who' && BRF.focus ? BRF.focus : BRF_SHOT[BRF.shot] || BRF_SHOT.wide; C.pos.set(S[0][0] + C.sx * .5, S[0][1] + C.sy * .2 + Math.sin(t * .31) * .012, S[0][2]); C.look.set(S[1][0] + C.sx * 2.2, S[1][1] + C.sy * 1.2, S[1][2]);
  C.cPos.lerp(C.pos, 1 - Math.exp(-2.6 * dt)); C.cLook.lerp(C.look, 1 - Math.exp(-3.2 * dt)); BRF.camera.position.copy(C.cPos); BRF.camera.lookAt(C.cLook); BRF.camera.updateMatrixWorld();
  BRF.fill.position.copy(BRF.camera.position); BRF.fill.position.y += .3; BRF.fill.intensity = damp(BRF.fill.intensity, BRF.shot === 'who' ? 5 : BRF.shot === 'xo' ? 2 : 0, 4, dt);
}
/* ---- getting there and away ---- */
async function toBrief(c) {
  if (busy || mode !== 'hq' || !c || !c.story) return; busy = true; dlgClose(); sfx.play('servoDn'); blackout(true); await tween(.55, fade);
  brfBuild(); const S = STORY[c.story], H = S.ch[c.chap]; Object.assign(BRF, { c, H, i: -1, marks: [], card: null, talk: null, shot: 'wide', stepT: 0, focus: null }); brfBake(c);
  for (const g of BRF.guests) { BRF.crowd.remove(g); BRF.people.splice(BRF.people.indexOf(g), 1); g.dispose(); } BRF.guests = [];
  (typeof H.guests === 'function' ? H.guests() : H.guests || []).forEach((ch, n) => { const h = new Human(lookOf(ch.seed, CAST[ch.seed] || {}), { scene: BRF.scene, role: ch.fit || 'suit', col: ch.col, x: 4.6 - n * .9, y: .2, z: -4.7 - (n % 2) * .5, yaw: -.5 }); h.ch = ch; h.look = BRF.eye; h.brain = function* (h) { for (;;) yield* hDo(h, pick(['watch', 'think', 'watch']), rand(5, 10)); }; h.co = h.brain(h); BRF.crowd.add(h); BRF.people.push(h); BRF.guests.push(h); });
  { const g = BRF.flag.image.getContext('2d'); g.fillStyle = '#0d1116'; g.fillRect(0, 0, 256, 256); drawLogo(g, 128, 128, 112); BRF.flag.needsUpdate = true; }
  $('hqUI').classList.add('hid'); $('brfUI').classList.remove('hid'); $('brfHead').innerHTML = `<b style="color:${S.col}">${S.name}</b><span>${STNUM[c.chap]} · ${c.title.toUpperCase()}</span><em>LANCE BRIEFING · OP. ${c.op}</em>`;
  mode = 'brief'; brfCam.cPos.set(3.6, 1.7, 5.9); brfCam.cLook.set(0, 1.9, -6.3); brfCam.sx = brfCam.sy = 0; brfDraw(T); busy = false; await tween(.9, k => fade(1 - k)); blackout(false);
  if (mode === 'brief' && BRF.i < 0) { dlg(CREW.xo, 'Seats. Lights.', [['Continue', () => brfStep(0)]], null); BRF.talk = BRF.xo; BRF.shot = 'wide'; }
}
async function brfLeave(to) {
  if (busy || mode !== 'brief') return; busy = true; dlgCur = null; vox.stop(); $('dlg').classList.add('hid'); sfx.play('servo'); blackout(true); await tween(.55, fade); $('brfUI').classList.add('hid'); saveCO();
  if (to === 'hq') { showHQ(); hq.cPos.set(8, 2.4, -7.6); hq.cLook.set(0, 1.6, 0); busy = false; }
  else { mode = 'hangar'; $('hangarUI').classList.remove('hid'); for (const id of ['panelL', 'panelR', 'hint', 'status']) $(id).classList.remove('hid'); orb.cine = false; orb.idle = 0; orb.cPos.set(0, 21.5, 44); orb.cLook.set(0, 14, 0); busy = false; refreshUI(); renderHangarContract(); setStatus(CO.active ? `BRIEFED — ${CO.active.site.toUpperCase()} · FIT OUT AND LAUNCH` : 'STAND READY — ' + mechName); }
  await tween(.8, k => fade(1 - k)); blackout(false);
}
{
  const cv = $('gl'); cv.addEventListener('pointermove', e => { if (mode !== 'brief') return; brfCam.sx = (e.clientX / innerWidth - .5) * .5; brfCam.sy = -(e.clientY / innerHeight - .5) * .4; });
  $('brfSkip').onclick = () => { sfx.play('ui'); if (mode === 'brief' && !busy) brfLeave('bay'); }; $('brfBack').onclick = () => { sfx.play('ui'); if (mode === 'brief' && !busy) brfLeave('hq'); };
}

