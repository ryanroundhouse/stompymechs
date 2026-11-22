/* ============ HEADQUARTERS: COMMAND DECK, HOLO MAP TABLE, CREW ============ */
const HQ = { scene: new THREE.Scene(), pins: [], people: [], P: {}, talk: null, speaking: false, contact: null };
HQ.camera = new THREE.PerspectiveCamera(56, innerWidth / innerHeight, .1, 200);
const hq = { th: .3, ph: 1.3, r: 9.8, pos: V3(0, 4, 9), look: V3(0, 1.5, 0), cPos: V3(0, 3.4, -8.5), cLook: V3(0, 1.5, 0), focus: null };
const PILOTS = [
  { ch: { name: 'Juno "Rook" Albrecht', first: 'Rook', last: 'Albrecht', role: 'FREELANCE PILOT · KESTREL', seed: 51, col: '#ff9adf' }, mech: 0, fee: 24000, share: .15, until: 0 },
  { ch: { name: 'Bastien "Anvil" Moreau', first: 'Anvil', last: 'Moreau', role: 'FREELANCE PILOT · COLOSSUS', seed: 67, col: '#ffd98a' }, mech: 2, fee: 52000, share: .25, until: 0 },
];
pilotsApply(BOOT);
{
  /* the command deck is the lit booth high on the hangar's rear wall */
  const hs = HG.scene, bz = HG.L / 2;
  box(hs, M.dark, 30, 8, 6.4, 0, 23, bz - 3.4); for (const y of [18.8, 27.3]) box(hs, M.girder, 31, .6, 7, 0, y, bz - 3.5); noShadow(box(hs, glowMat(0x7fd0ff, 1.5), 26, 3.4, .1, 0, 23.4, bz - 6.65));
  for (let i = -3; i <= 3; i++) box(hs, M.girder, .3, 3.6, .3, i * 4.2, 23.4, bz - 6.7); for (const s of [-1, 1]) box(hs, M.girder, .8, 19.5, .8, s * 13, 9.6, bz - 5.3, -.17);
  const sg = new THREE.Mesh(new THREE.PlaneGeometry(13, 1.6), new THREE.MeshBasicMaterial({ map: labelTex(512, 64, (g, w, h) => { g.fillStyle = '#0c0d0e'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffb21a'; g.font = 'bold 40px Menlo,Consolas,monospace'; g.textAlign = 'center'; g.fillText('COMMAND DECK', w / 2, 46); }) })); sg.material.color.setScalar(1.5); sg.position.set(0, 26.4, bz - 6.75); sg.rotation.y = PI; hs.add(sg);
  HQ.winCam = new THREE.PerspectiveCamera(36, 16 / 4.6, 1, 400); HQ.winCam.position.set(0, 23.5, bz - 8); HQ.winCam.lookAt(0, 5, -8);
  HQ.rt = new THREE.WebGLRenderTarget(800, 230, { type: THREE.HalfFloatType });

  const sc = HQ.scene, W = 26, D = 20, H = 7.5, wall = std({ map: TX.panel, color: 0x3a4048, metalness: .7, roughness: .55 }), dk = M.dark;
  sc.background = new THREE.Color(0x05070a); sc.fog = new THREE.Fog(0x05070a, 20, 70); sc.environment = ENV;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), repMat(TX.panel, 13, 10, { metalness: .3, roughness: .95, color: 0x30353c }, matFloor)); fl.rotation.x = -PI / 2; fl.receiveShadow = true; sc.add(fl);
  box(sc, dk, W + 1, .4, D + 1, 0, H + .2, 0); box(sc, wall, W, H, .4, 0, H / 2, D / 2 + .2);
  for (const s of [-1, 1]) { box(sc, wall, .4, H, D, s * (W / 2 + .2), H / 2, 0); for (let z = -8; z <= 8; z += 4) box(sc, M.girder, .5, H, .5, s * (W / 2 - .1), H / 2, z); box(sc, repMat(TX.hazard, 40, 1), .1, .25, D, s * (W / 2 - .05), 1.1, 0); }
  for (let x = -12; x <= 12; x += 6) box(sc, M.girder, .4, .5, D, x, H - .25, 0);
  /* window wall onto the mech bay (live render of the hangar) */
  box(sc, wall, 22.7, 1.4, .4, -1.65, .7, -D / 2 - .2); box(sc, wall, 1.5, 1.4, .4, 12.25, .7, -D / 2 - .2); box(sc, wall, W, H - 6, .4, 0, 6 + (H - 6) / 2, -D / 2 - .2); box(sc, wall, 5, 4.6, .4, -10.5, 3.7, -D / 2 - .2);
  box(sc, wall, 1.7, 4.6, .4, 8.85, 3.7, -D / 2 - .2); box(sc, wall, 1.5, 4.6, .4, 12.25, 3.7, -D / 2 - .2); box(sc, wall, 1.8, 3.42, .4, 10.6, 4.29, -D / 2 - .2);
  for (let i = -2; i <= 2; i++) box(sc, M.girder, .18, 4.6, .3, i * 4, 3.7, -D / 2); box(sc, dk, 16.4, .5, 1.2, 0, 1.15, -D / 2 + .5);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(16, 4.6), new THREE.MeshBasicMaterial({ map: HQ.rt.texture })); win.position.set(0, 3.7, -D / 2 - .1); sc.add(win);
  noShadow(box(sc, M.green, 1.7, .1, .08, 10.6, 3.02, -D / 2 + .04));
  /* lighting */
  sc.add(new THREE.HemisphereLight(0x8fa8c8, 0x15100c, .5));
  const tl = new THREE.PointLight(0x6fe0ff, 34, 15, 1.6); tl.position.set(0, 2.7, 0); sc.add(tl);
  const key = new THREE.SpotLight(0xffe2c0, 240, 22, .75, .6, 1.5); key.position.set(3, H - .3, 5); key.target.position.set(0, 1, 0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0006; sc.add(key, key.target);
  for (const [x, z, c] of [[-9.5, -1, 0x9fc8ff], [9.5, -2, 0xffc48a], [7.5, 6.2, 0xffb070], [-7, 6, 0x8fb8ff], [0, -6.5, 0xffd9a8]]) { const p = new THREE.SpotLight(c, 150, 13, .8, .7, 1.5); p.position.set(x, H - .4, z); p.target.position.set(x, 0, z); sc.add(p, p.target); noShadow(cyl(sc, M.white, .35, .35, .06, x, H - .02, z)); }

  /* map table + projector */
  const tb = grp(sc); cyl(tb, dk, 3.3, 3.7, .95, 0, .475, 0, 0, 0, 0, 12); cyl(tb, M.steel, 3.9, 3.9, .12, 0, 1.0, 0, 0, 0, 0, 48); cyl(tb, M.black, 3.55, 3.55, .05, 0, 1.08, 0, 0, 0, 0, 48);
  HQ.rim = glowMat(0x5fd8ff, 1.6); const ring = (r, y, p) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, .035, 6, 64), HQ.rim); m.rotation.x = PI / 2; m.position.y = y; p.add(m); return m; }; ring(3.56, 1.11, tb); ring(1.5, H - .55, sc);
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12; box(tb, M.yellow, .5, .06, .22, Math.sin(a) * 3.72, 1.07, Math.cos(a) * 3.72, 0, a, 0); }
  cyl(sc, dk, 1.6, 2.2, .5, 0, H - .25, 0, 0, 0, 0, 12);
  const add = THREE.AdditiveBlending, cone = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 3.5, H - 1.7, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0x4fc8ff, transparent: true, opacity: .03, blending: add, depthWrite: false, side: 2 })); cone.position.y = 1.1 + (H - 1.7) / 2; sc.add(cone);
  /* holographic theatre map: wireframe relief tinted by biome region */
  const holo = HQ.holo = grp(sc, 0, 1.2, 0), hg = new THREE.PlaneGeometry(7, 7, 72, 72); hg.rotateX(-PI / 2); const hp = hg.attributes.position, hc = new Float32Array(hp.count * 3), col = new THREE.Color();
  HQ.mapH = (u, v) => { const d = Math.hypot(u, v); if (d > 1) return 0; let h = vnoise(u * 3 + 5, v * 3 + 2) * .5 + vnoise(u * 9, v * 9) * .14; if (d < .17) h = .08 + Math.floor(hash2(Math.floor(u * 42), Math.floor(v * 42)) * 4) * .09; return h * smooth(clamp((1 - d) * 5, 0, 1)); };
  for (let i = 0; i < hp.count; i++) {
    const u = hp.getX(i) / 3.5, v = hp.getZ(i) / 3.5, h = HQ.mapH(u, v); hp.setY(i, h); let bk = 'urban', bd = 9;
    for (const k in REGION) { if (k === 'lunar') continue; const q = Math.hypot(u - REGION[k][0], v - REGION[k][1]); if (q < bd) { bd = q; bk = k; } }
    col.set(BIOMES[bk].css).multiplyScalar(Math.hypot(u, v) > 1 ? 0 : .3 + h * 1.7); hc[i * 3] = col.r; hc[i * 3 + 1] = col.g; hc[i * 3 + 2] = col.b;
  }
  hg.setAttribute('color', new THREE.BufferAttribute(hc, 3));
  holo.add(new THREE.Mesh(hg, new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: true, transparent: true, opacity: .75, blending: add, depthWrite: false })));
  holo.add(new THREE.Mesh(hg, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: .16, blending: add, depthWrite: false, side: 2 })));
  HQ.sweep = grp(holo); const sw = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 1), new THREE.MeshBasicMaterial({ color: 0x5fd8ff, transparent: true, opacity: .1, blending: add, depthWrite: false, side: 2 })); sw.position.set(1.75, .5, 0); HQ.sweep.add(sw);
  HQ.moon = grp(holo, 2.4, 1.9, -1.9); HQ.moon.add(new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 2), new THREE.MeshBasicMaterial({ color: 0xc8c8d8, wireframe: true, transparent: true, opacity: .5, blending: add, depthWrite: false })));
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(.85, .008, 4, 48), new THREE.MeshBasicMaterial({ color: 0xc8c8d8, transparent: true, opacity: .5, blending: add })); orbit.rotation.x = 1.2; HQ.moon.add(orbit);
  GEO.pinB = new THREE.CylinderGeometry(.012, .012, 1, 5); GEO.pinB.translate(0, .5, 0); GEO.pinH = new THREE.OctahedronGeometry(.1); GEO.pinR = new THREE.RingGeometry(.16, .2, 24); GEO.pinR.rotateX(-PI / 2);

  /* screens share one animated canvas; the rear wall carries standings + news */
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; const g = cv.getContext('2d'), tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; const sm = new THREE.MeshBasicMaterial({ map: tx }); sm.color.setScalar(1.5);
  const bars = Array.from({ length: 10 }, () => rand()); let scT = 0;
  HQ.drawScr = (dt, t) => {
    if ((scT -= dt) > 0) return; scT = .14; g.fillStyle = '#04090b'; g.fillRect(0, 0, 256, 160); g.fillStyle = '#7fe7ff'; g.font = 'bold 13px Menlo,monospace'; g.fillText('SIGINT // SECTOR FEED', 8, 16); g.fillRect(8, 22, 240, 1);
    bars.forEach((b, i) => { bars[i] = clamp(b + rand(-.1, .1), .08, 1); g.fillStyle = '#12303a'; g.fillRect(8 + i * 24, 40, 18, 70); g.fillStyle = bars[i] > .8 ? '#ff5a1f' : '#6fe3ff'; g.fillRect(8 + i * 24, 110 - 70 * bars[i], 18, 70 * bars[i]); });
    g.strokeStyle = '#8dff6a'; g.beginPath(); for (let x = 0; x < 240; x += 4) g.lineTo(8 + x, 138 + Math.sin(x * .07 + t * 4) * 9 * Math.sin(x * .013 + t) + rand(-1, 1)); g.stroke(); tx.needsUpdate = true;
  };
  const wc = document.createElement('canvas'); wc.width = 1024; wc.height = 360; const wg = wc.getContext('2d'), wt = new THREE.CanvasTexture(wc); wt.colorSpace = THREE.SRGBColorSpace;
  const wm = new THREE.Mesh(new THREE.PlaneGeometry(10.2, 3.6), new THREE.MeshBasicMaterial({ map: wt })); wm.material.color.setScalar(1.35); wm.position.set(0, 4.3, D / 2 - .05); wm.rotation.y = PI; sc.add(wm); box(sc, dk, 10.8, 4.1, .2, 0, 4.3, D / 2 + .08);
  HQ.drawWall = () => {
    const g = wg; g.fillStyle = '#05090c'; g.fillRect(0, 0, 1024, 360); g.fillStyle = '#ffb21a'; g.font = 'bold 26px Menlo,monospace'; g.fillText('STANDING', 24, 40); g.fillText('SECTOR WIRE', 420, 40); g.fillRect(24, 52, 976, 2); drawLogo(g, 978, 26, 21); g.textAlign = 'right'; g.fillStyle = '#e6dfcf'; g.fillText(YARD.name, 946, 40, 300); g.textAlign = 'left';
    [...EMPS.map(f => [FAC[f].short, FAC[f].col, CO.rep[f], 0]), ...RIVS.map(k => [RIV[k].short, RIV[k].col, CO.riv[k].rel, 1])].forEach(([n, col, r, co], i) => { const y = 86 + i * 33 + co * 13; g.fillStyle = col; g.font = '19px Menlo,monospace'; g.fillText(n, 24, y); g.fillStyle = '#12303a'; g.fillRect(180, y - 14, 200, 12); g.fillStyle = r < 0 ? '#ff5a1f' : co ? col : '#8dff6a'; g.fillRect(280, y - 14, r, 12); g.fillStyle = '#fff'; g.fillRect(279, y - 17, 2, 18); });
    g.fillStyle = 'rgba(255,178,26,.4)'; g.fillRect(24, 240, 356, 1);
    g.font = '17px Menlo,monospace'; CO.news.slice(0, 8).forEach((s, i) => { g.fillStyle = i ? '#9fb7bd' : '#ffffff'; let y = 86 + i * 34; g.fillText(s.length > 58 ? s.slice(0, 57) + '…' : s, 420, y); }); wt.needsUpdate = true;
  };
  /* stations */
  const scr = HQ.scr = (x, y, z, ry, w = 1.7, h = 1.1) => { box(sc, dk, w + .16, h + .16, .1, x, y, z, 0, ry, 0); const m = noShadow(box(sc, sm, w, h, .04, x, y, z, 0, ry, 0)); m.translateZ(.06); };
  box(sc, dk, 1.4, 1, 6.4, -12, .5, -1); box(sc, M.steel, 1.6, .08, 6.6, -11.95, 1.04, -1); for (const z of [-3.2, -1, 1.2]) scr(-12.5, 2.3, z, Z); box(sc, M.blue, .5, .5, .5, -11.6, 1.33, -2.2, 0, .4);   // intel bank (left wall)
  box(sc, dk, 1.4, 1, 5.4, 12, .5, -2); box(sc, M.steel, 1.6, .08, 5.6, 11.95, 1.04, -2); scr(12.5, 2.5, -2, -Z, 2.6, 1.6); box(sc, M.yellow, .9, 1.5, .6, 11.2, .75, 1.6); HQ.desk = grp(sc, 11.7, 1.08, -3.6);   // chief's bench + scale model stand
  cyl(HQ.desk, M.dark, .42, .46, .06, 0, .03, 0, 0, 0, 0, 20); noShadow(cyl(HQ.desk, M.amber, .36, .36, .02, 0, .065, 0, 0, 0, 0, 20));
  box(sc, dk, 3.4, .45, .9, 8.2, .45, 8.9); for (let i = 0; i < 4; i++) box(sc, i % 2 ? M.rust : M.steel, .8, 2.4, .7, 10.2 + i * .85 - 1.3, 1.2, 9.4); cyl(sc, M.dark, .5, .5, .9, 6.6, .45, 6.4, 0, 0, 0, 10); cyl(sc, M.steel, .62, .62, .05, 6.6, .92, 6.4, 0, 0, 0, 16);   // pilots' corner
  cyl(sc, dk, .9, 1.1, .3, -7, .15, 6, 0, 0, 0, 16); HQ.padGlow = glowMat(0x5fd8ff, .4); noShadow(cyl(sc, HQ.padGlow, .78, .78, .04, -7, .32, 6, 0, 0, 0, 24)); cyl(sc, dk, .5, .7, .3, -7, H - .15, 6, 0, 0, 0, 12);   // comm pedestal
  HQ.holoM = new THREE.MeshBasicMaterial({ color: 0x4fd8ff, transparent: true, opacity: .5, blending: add, depthWrite: false });
}
/* ============ PEOPLE: COMMAND DECK CREW + STAFF ============ */
const CAST = { 11: { build: 'curvy', h: 1.74, habit: 'stand' }, 23: { build: 'slim', h: 1.63, habit: 'cross' }, 37: { build: 'broad', h: 1.88, habit: 'hips', top2: 'quiff' }, 51: { build: 'lean', h: 1.71, habit: 'stand' }, 67: { build: 'heavy', h: 1.93, habit: 'cross', top2: 'flat' } };
const ROLEPROP = { officer: { l: 'tablet' }, pilot0: { r: 'mug' } };
{
  const sc = HQ.scene, dk = M.dark, D = 20;
  /* a door that works: staff come and go through a short corridor behind the window wall */
  const dr = HQ.door = grp(sc, 10.6, 1.29, -D / 2 - .2); box(dr, M.steel, 1.84, 2.58, .12); box(dr, repMat(TX.hazard, 4, 1), 1.84, .22, .14, 0, -1.05, 0); box(dr, dk, .5, .34, .14, 0, .35, 0); HQ.doorK = 0;
  for (const x of [9.56, 11.64]) box(sc, dk, .28, 2.72, .56, x, 1.36, -D / 2 - .2); box(sc, dk, 2.36, .28, .56, 10.6, 2.72, -D / 2 - .2);
  box(sc, dk, 2.4, .1, 4.4, 10.6, -.05, -D / 2 - 2.5); box(sc, dk, 2.4, .1, 4.4, 10.6, 2.9, -D / 2 - 2.5); for (const x of [9.5, 11.7]) box(sc, M.girder, .12, 3, 4.4, x, 1.45, -D / 2 - 2.5); box(sc, M.girder, 2.4, 3, .12, 10.6, 1.45, -D / 2 - 4.7);
  noShadow(box(sc, M.amber, .9, .08, .06, 10.6, 2.5, -D / 2 - 4.6)); const cl = new THREE.PointLight(0xffb070, 9, 7, 1.6); cl.position.set(10.6, 2.4, -D / 2 - 2.6); sc.add(cl);
  /* a seated station by the window, and something on the pilots' table */
  box(sc, dk, 1.25, .74, 3.4, -12.05, .37, -7.2); box(sc, M.steel, 1.4, .06, 3.6, -12, .77, -7.2); for (const z of [-8.1, -6.3]) HQ.scr(-12.5, 1.75, z, Z, 1.5, 1); box(sc, M.blue, .34, .05, .6, -11.75, .83, -7.2);
  { const l = new THREE.SpotLight(0xbfe0ff, 60, 9, .9, .8, 1.5); l.position.set(-9.6, 6.6, -6.4); l.target.position.set(-11, .6, -7.3); sc.add(l, l.target); }
  HQ.fill = new THREE.PointLight(0xfff0e2, 0, 7, 1.5); sc.add(HQ.fill);
  const ch = HQ.chair = grp(sc, -10.4, 0, -7.2); cyl(ch, dk, .28, .32, .05, 0, .03, 0, 0, 0, 0, 10); cyl(ch, M.chrome, .035, .035, .42, 0, .25, 0, 0, 0, 0, 8); HQ.seat = grp(ch, 0, .46, 0); box(HQ.seat, M.black, .46, .08, .46); box(HQ.seat, M.black, .44, .5, .07, 0, .32, -.23, -.1); HQ.seat.rotation.y = -Z;
  for (const [x, z] of [[6.42, 6.55], [6.86, 6.2]]) { cyl(sc, std({ color: 0xcfc8b8, roughness: .5 }), .04, .035, .09, x, .99, z, 0, 0, 0, 10); }
  box(sc, M.steel, .26, .02, .19, 6.6, .955, 6.72, 0, .5, 0);

  const route = (ax, az, bx, bz) => {
    const out = [], dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz, t = clamp(-(ax * dx + az * dz) / (l2 || 1), 0, 1);
    if (Math.hypot(ax + dx * t, az + dz * t) < 4.75 && l2 > 1) { const a0 = Math.atan2(ax, az), d = angDiff(a0, Math.atan2(bx, bz)), n = Math.max(2, Math.ceil(Math.abs(d) / .55)); for (let i = 1; i < n; i++) { const a = a0 + d * i / n; out.push({ x: Math.sin(a) * 5.2, z: Math.cos(a) * 5.2 }); } }
    if (az < -9.4) out.unshift({ x: 10.6, z: -8.9 }); if (bz < -9.4) out.push({ x: 10.6, z: -8.9 }); out.push({ x: bx, z: bz }); return out;
  };
  HQ.crowd = new Crowd({ route, camLook: .22, poi: { x: 0, y: 1.75, z: 0 }, circ: [[0, 0, 3.95], [-7, 6, 1.15], [6.6, 6.4, .7]], box: [[-12.8, -4.3, -11.3, 2.3], [11.3, -4.8, 12.8, .8], [10.75, 1.3, 11.65, 1.9], [6.5, 8.5, 9.9, 9.4], [8.5, 9.05, 12, 9.8], [-8.3, -10.4, 8.3, -8.9], [-12.7, -9, -11.4, -5.4]] });
}
function mkPerson(ch, x, z, yaw, role, holo, extra = {}) {
  const cast = CAST[ch.seed] || {}, L = lookOf(ch.seed, cast), h = new Human(L, { scene: HQ.scene, role: role.replace(/\d/, ''), col: ch.col, x, z, yaw, y: holo ? .34 : 0, holo, props: ROLEPROP[role], ...extra });
  if (cast.habit) h.habit = cast.habit; h.ch = ch; HQ.crowd.add(h); return h;
}
HQ.P.xo = mkPerson(CREW.xo, 0, -4.5, 0, 'officer'); HQ.P.intel = mkPerson(CREW.intel, -10.92, -1, -Z, 'analyst'); HQ.P.chief = mkPerson(CREW.chief, 10.92, -2.2, Z, 'tech');
HQ.P.p0 = mkPerson(PILOTS[0].ch, 7.4, 7.2, -2.4, 'pilot0'); HQ.P.p1 = mkPerson(PILOTS[1].ch, 5.7, 6.9, 2.2, 'pilot'); HQ.people.push(HQ.P.xo, HQ.P.intel, HQ.P.chief, HQ.P.p0, HQ.P.p1);
{
  const P = HQ.P, map = { x: 0, y: 1.7, z: 0 }, bay = { x: 0, y: -6, z: -42 }, wall = { x: 0, y: 4.3, z: 10 }, tb = (a, acts) => hSpot(Math.sin(a) * 4.5, Math.cos(a) * 4.5, a + PI, acts, map), win = (x, acts) => hSpot(x, -8.42, PI, acts, bay), set = (h, spots, n) => { h.spots = spots; h.brain = function* (h) { yield* hRoam(h, h.spots, n); }; h.co = h.brain(h); };
  set(P.xo, [tb(PI, [['watch', 6, 12], ['point', 5, 9], ['tablet', 6, 12], ['think', 5, 8]]), tb(PI + .82, [['point', 5, 9], ['tablet', 6, 11]]), win(-1.7, [['watch', 8, 15], ['tablet', 5, 9]]), hSpot(1.6, 8.3, 0, [['read', 7, 13], ['tablet', 5, 8]], wall)], 2);
  set(P.intel, [...[-3.2, -1, 1.2].map(z => hSpot(-10.92, z, -Z, [['type', 8, 18], ['think', 3, 5], ['read', 4, 7]], { x: -12.5, y: 2.3, z })), tb(-1.46, [['lean', 6, 10], ['think', 4, 7]])], 2);
  set(P.chief, [hSpot(10.92, -2.2, Z, [['type', 7, 14], ['think', 3, 5]], { x: 12.5, y: 2.5, z: -2 }), hSpot(10.95, -3.6, Z, [['wrench', 6, 11]], { x: 11.7, y: 1.2, z: -3.6 }), hSpot(10.3, 1.6, Z, [['pick', 3, 5], ['watch', 4, 7]]), win(5.3, [['watch', 8, 14]])], 2);
  const s0 = { h: .675, back: .5, mode: 'fwd' }, s1 = { h: .675, back: .5, mode: 'back' };
  set(P.p0, [hSpot(7.4, 7.2, -2.4, [['sip', 10, 20], ['watch', 6, 10]]), hSpot(7.5, 8.15, PI, [['sit', 14, 26, s0], ['sit', 12, 20, s1]]), hSpot(6.6, 5.25, 0, [['sip', 8, 14]])], 1);
  set(P.p1, [hSpot(5.7, 6.9, 2.2, [['watch', 6, 12]]), hSpot(9.05, 8.15, PI, [['sit', 15, 30, s1], ['sit', 10, 18, s0]]), hSpot(3.4, 8.3, 0, [['read', 8, 14]], wall), win(7.1, [['watch', 8, 14]])], 1);
  /* unnamed deck staff: a watch officer on her rounds, an operator at the seated station, and a mechanic who comes up from the bay */
  const staff = (seed, name, role, x, z, yaw, extra, lines) => { const c = mkChar(seed, name, '#9fb7bd'), h = mkPerson(c, x, z, yaw, role, false, extra); h.staff = lines; HQ.people.push(h); return h; };
  const wo = staff(131, 'WATCH OFFICER', 'ops', -4.8, -8.42, PI, { props: { l: 'tablet' }, fit: { headset: 1 } }, ['Bay three is green, Commander. Your machine is on the turntable.', 'Board traffic is heavy tonight. Offers are not lasting.', 'Sensors are clean out to the ridge line. For now.']);
  set(wo, [win(-4.8, [['tablet', 6, 10], ['watch', 5, 9]]), tb(.82, [['tablet', 6, 10], ['point', 4, 7]]), hSpot(-2.2, 8.3, 0, [['read', 6, 10], ['tablet', 5, 8]], wall), hSpot(10.2, -.4, Z, [['tablet', 5, 8]])], 2);
  const op = staff(157, 'SYSTEMS OPERATOR', 'ops', -10.7, -7.2, -Z, { fit: { headset: 1 } }, ['Comms relay is holding. Client channels are open when you want them.', 'I log everything, Commander. Even the calls they say never happened.', 'Uplink is slow. Somebody is jamming the southern band again.']);
  const seat = hSpot(-10.7, -7.2, -Z, [['sit', 22, 45, { h: .5, back: .3, mode: 'type', look: { x: -12.5, y: 1.75, z: -7.2 } }]]); op.spots = [seat, tb(-2.32, [['lean', 6, 10], ['think', 4, 7]])];
  HQ.opSeat = op; op.brain = function* (h) { for (;;) { yield* hVisit(h, seat); if (Math.random() < .5) yield* hVisit(h, h.spots[1]); } }; op.co = op.brain(op);
  const dh = staff(173, 'BAY TECHNICIAN', 'mech', 10.6, -12.4, 0, { fit: { hat: 'cap', vest: null, ear: 0 }, props: { r: 'wrench' } }, ['Just dropping off the torque logs for the Chief.', 'She is fuelled and the bay is clear. Whenever you are ready.', 'Radio down there is on its last legs. Still plays, mostly.']);
  dh.g.visible = false; dh.spots = [hSpot(10.2, -.6, 2.7, [['chat', 7, 13]], P.chief), hSpot(10.6, 8.5, 0, [['pick', 3, 5], ['wrench', 4, 7]]), tb(1.9, [['watch', 5, 9]])];
  dh.brain = function* (h) {
    for (;;) { h.g.visible = false; h.g.position.set(10.6, 0, -12.4); h.yaw = 0; yield* hWait(h, rand(14, 40)); h.g.visible = true; yield* hGo(h, 10.6, -8.6, { direct: true }); const n = 1 + (Math.random() * 2 | 0), S = [...h.spots].sort(() => Math.random() - .5); for (let i = 0; i < n; i++) yield* hVisit(h, S[i]); yield* hGo(h, 10.6, -12.4); }
  }; dh.co = dh.brain(dh);
  HQ.crowd.clampFn = h => { const p = h.g.position, door = p.x > 9.7 && p.x < 11.5; p.x = clamp(p.x, -12.5, 12.5); p.z = clamp(p.z, door ? -13 : -9.55, 9.6); if (p.z < -9.55) p.x = clamp(p.x, 10, 11.2); };
}
HQ.setMini = () => { const k = JSON.stringify(player.cfg); if (HQ.miniK === k) return; HQ.miniK = k; if (HQ.mini) HQ.desk.remove(HQ.mini.root); HQ.mini = new Mech(player.cfg); HQ.mini.root.scale.setScalar(.055); HQ.mini.root.position.y = .08; noShadow(HQ.mini.root); HQ.desk.add(HQ.mini.root); };
/* a contract contact appears as a hologram on the comm pedestal */
function showContact(ch) { removeContact(); HUM.holo.uniforms.uCol.value.set(ch.col); HQ.padGlow.emissive.set(ch.col); HQ.padGlow.emissiveIntensity = 3; const p = HQ.contact = mkPerson(ch, -7, 6, 2.3, 'suit', true); HQ.people.push(p); HQ.talk = p; hq.focus = { pos: V3(-4.1, 1.95, 3.9), look: V3(-7, 1.3, 6) }; }
function removeContact() { const p = HQ.contact; if (!p) return; HQ.crowd.remove(p); p.dispose(); HQ.people.splice(HQ.people.indexOf(p), 1); HQ.contact = null; HQ.padGlow.emissiveIntensity = .4; }
/* frame whoever is speaking from wherever they happen to be standing: the camera picks a clear spot, they turn to face it */
const focusOn = p => {
  if (mode === 'bar') return barFocusOn(p); if (mode === 'brief') return;
  HQ.talk = p; if (!p) { hq.focus = null; return; } const g = p.g.position, cam = HQ.camera.position; let best = null, bs = -1e9;
  for (let i = 0; i < 20; i++) {
    const a = i * TAU / 20, r = p.seat ? 2.1 : 2.45, x = g.x + Math.sin(a) * r, z = g.z + Math.cos(a) * r; if (Math.abs(x) > 11 || Math.abs(z) > 8.7 || Math.hypot(x, z) < 4.5 || Math.hypot(x + 7, z - 6) < 1.5 || Math.hypot(x - 6.6, z - 6.4) < 1 || (x > 6.2 && z > 8.2)) continue;
    const dx = g.x - x, dz = g.z - z, t = clamp(-(x * dx + z * dz) / (dx * dx + dz * dz), 0, 1), thru = Math.hypot(x + dx * t, z + dz * t) < 3.7 ? 4 : 0, s = -Math.abs(angDiff(a, p.yaw)) * (p.seat ? 2.2 : .55) - Math.hypot(cam.x - x, cam.z - z) * .07 - thru; if (s > bs) { bs = s; best = [x, z]; }
  }
  if (!best) best = [g.x * .7, g.z * .7]; hq.focus = { pos: V3(best[0], p.seat ? 1.3 : 1.56 * p.k, best[1]), look: V3(g.x, (p.seat ? .78 : 1.04) * p.k, g.z) };
};
function talkStaff(h) { dlg(h.ch, pick(h.staff), [['Carry on', dlgClose]], h); }
HQ.syncPins = () => {
  for (const p of HQ.pins) { p.g.parent.remove(p.g); p.head.material.dispose(); } HQ.pins.length = 0;
  for (const c of CO.board) {
    const lunar = c.biome === 'lunar', g = grp(lunar ? HQ.moon : HQ.holo), mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(c.story ? STORY[c.story].col : FAC[c.emp].col).multiplyScalar(c.story ? 3 : 2), transparent: true, opacity: .9 });
    if (lunar) { const a = c.seed % 6; g.position.set(Math.sin(a) * .3, .46, Math.cos(a) * .3); g.scale.setScalar(.6); } else g.position.set(c.pos[0] * 3.5, HQ.mapH(c.pos[0], c.pos[1]), c.pos[1] * 3.5);
    if (c.story) g.scale.multiplyScalar(1.45); g.add(new THREE.Mesh(GEO.pinB, mat)); const head = new THREE.Mesh(GEO.pinH, mat); head.position.y = 1.08; g.add(head); const ring = new THREE.Mesh(GEO.pinR, mat); ring.position.y = .03; g.add(ring); HQ.pins.push({ c, g, head, ring });
  }
};

