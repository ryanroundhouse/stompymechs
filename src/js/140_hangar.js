/* ============ HANGAR: STATIC ENVIRONMENT ============ */
const HG = { W: 90, L: 130, H: 38, spin: [], blink: [], vents: [], bays: [], gang: [], scene: new THREE.Scene() };
HG.camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, .3, 500);
HG.fx = { spark: new Particles(HG.scene, 1800, true), smoke: new Particles(HG.scene, 700, false) };
const repMat = (tex, ru, rv, o = {}, mk = std) => { const t = tex.clone(); t.needsUpdate = true; t.repeat.set(ru, rv); return mk({ map: t, metalness: .3, roughness: .7, ...o }); };
/* everything walked on in the bay is a floor (matFloor): the concrete, the plate of the six bays (HG_PAD), the turntable and its ramps (HG_DECK). As bare metal each mirrored the spotlights, and the mirror slid as the view turned */
const HG_PAD = matFloor({ color: 0x2b2f34, metalness: .25, roughness: .88 }), HG_DECK = matFloor({ color: 0x70767d, metalness: .35, roughness: .95, map: TX.panel });
const labelTex = (w, h, draw) => { const t = ctex(w, h, draw); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t; };
{
  const sc = HG.scene, W = HG.W, L = HG.L, H = HG.H, hw = W / 2, hl = L / 2;
  sc.background = new THREE.Color(0x06080a); sc.fog = new THREE.Fog(0x06080a, 80, 230); sc.environment = ENV;
  const flat = (mat, w, d, x, z, y = .03) => { const m = box(sc, mat, w, .05, d, x, y, z); m.castShadow = false; return m; };

  /* shell */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, L), matFloor({ map: TX.concrete, color: 0x979795, metalness: .04, roughness: .93 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; sc.add(floor);
  const wallM = std({ map: TX.corr, color: 0x8d939a, metalness: .6, roughness: .62 }), conc = std({ map: TX.concrete, color: 0x6a6a68, roughness: .9 });
  for (const s of [-1, 1]) { box(sc, wallM, .6, H, L, s * hw, H / 2, 0); box(sc, conc, 1.6, 4, L, s * (hw - .6), 2, 0); box(sc, repMat(TX.hazard, 1, 60), .3, .5, L, s * (hw - 1.5), 4.2, 0); }
  box(sc, wallM, W, H, .6, 0, H / 2, hl); box(sc, conc, W, 4, 1.6, 0, 2, hl - .6);
  box(sc, wallM, hw - 22, H, .6, -(hw + 22) / 2, H / 2, -hl); box(sc, wallM, hw - 22, H, .6, (hw + 22) / 2, H / 2, -hl); box(sc, wallM, 44, H - 30, .6, 0, 30 + (H - 30) / 2, -hl);
  box(sc, M.dark, W, .6, L, 0, H + .3, 0);
  for (const x of [-24, 24]) noShadow(box(sc, glowMat(0x7f9bbd, .9), 5, .1, L - 20, x, H - .05, 0));           // skylight strips
  for (let i = 0; i <= 8; i++) {
    const z = -hl + i * (L / 8);
    for (const s of [-1, 1]) { box(sc, M.girder, 1.4, H, 1.8, s * (hw - 1.2), H / 2, z); box(sc, M.girder, 2.2, H, .3, s * (hw - 1.2), H / 2, z); }
    box(sc, M.girder, W, 1, .7, 0, H - 1.6, z); box(sc, M.girder, W, .6, .6, 0, H - 6, z);
    for (let k = -4; k <= 4; k++) { box(sc, M.girder, .3, 4, .3, k * 10, H - 3.8, z); if (k < 4) box(sc, M.girder, .25, 10.8, .25, k * 10 + 5, H - 3.8, z, 0, 0, (k % 2 ? 1 : -1) * 1.19); }
  }
  for (const x of [-30, 0, 30]) box(sc, M.girder, .6, .8, L, x, H - 6, 0);
  /* pipes + conduits on the side walls */
  for (const s of [-1, 1]) {
    for (const [y, r, mt] of [[9, .55, M.rust], [10.6, .35, M.steel], [22, .7, M.blue]]) cyl(sc, mt, r, r, L - 6, s * (hw - 2.6), y, 0, PI / 2, 0, 0, 10);
    for (let z = -50; z <= 50; z += 25) { cyl(sc, M.dark, .75, .75, .5, s * (hw - 2.6), 9, z, PI / 2); cyl(sc, M.rust, .55, .55, 9, s * (hw - 2.6), 4.5, z + 2); HG.vents.push(V3(s * (hw - 3.4), 9, z)); }
  }
  /* hanging lamps */
  for (const x of [-26, 0, 26]) for (const z of [-42, -14, 14, 42]) { cyl(sc, M.dark, .08, .08, 6, x, H - 9, z); cyl(sc, M.dark, .5, 1.9, 1.3, x, H - 12.4, z, 0, 0, 0, 16); noShadow(cyl(sc, M.white, 1.5, 1.5, .1, x, H - 13.1, z)); }
  sc.add(new THREE.HemisphereLight(0x93a7bd, 0x1c1610, .38));
  const key = new THREE.SpotLight(0xffe2b8, 2300, 120, .62, .55, 1.6); key.position.set(10, 36, 16); key.target.position.set(0, 4, 0); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004; key.shadow.camera.near = 8; key.shadow.camera.far = 70; sc.add(key, key.target);
  const rim = new THREE.SpotLight(0x6fb4ff, 1900, 130, .7, .7, 1.5); rim.position.set(-8, 30, -48); rim.target.position.set(0, 7, 0); sc.add(rim, rim.target);
  for (const [x, y, z, c, i] of [[-28, 24, 30, 0xffc48a, 620], [28, 24, 30, 0xbfd6ff, 520], [-30, 17, -6, 0xffb070, 460], [30, 17, -6, 0xffb070, 460]]) { const p = new THREE.PointLight(c, i, 95, 1.7); p.position.set(x, y, z); sc.add(p); }

  /* floor markings */
  for (const s of [-1, 1]) { flat(repMat(TX.hazard, 1, 26), 1.1, 52, s * 11, -39); flat(M.yellow, .35, 46, s * 5, 39); }
  flat(repMat(TX.hazard, 16, 1), 44, 1.4, 0, -hl + 2.2);
  const numT = labelTex(256, 128, (g, w, h) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, w, h); g.fillStyle = '#d9a316'; g.font = 'bold 110px Impact,Arial Black,sans-serif'; g.textAlign = 'center'; g.fillText('HANGAR 03', w / 2, 104, 250); });
  const num = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), new THREE.MeshStandardMaterial({ map: numT, transparent: true, roughness: .9, opacity: .8 })); num.rotation.x = -PI / 2; num.position.set(0, .04, 24); sc.add(num);

  /* assembly platform + turntable */
  const plat = HG.plat = grp(sc);
  cyl(plat, M.dark, 10.6, 11.2, .6, 0, .3, 0, 0, PI / 8, 0, 8); noShadow(cyl(plat, repMat(TX.hazard, 7, 7), 10.4, 10.4, .04, 0, .615, 0, 0, PI / 8, 0, 8));
  for (const s of [-1, 1]) { box(plat, HG_DECK, 8, .14, 4.2, 0, .3, s * 12.2, s * .146); box(plat, repMat(TX.hazard, 1, 4), .5, .16, 4.2, 4.2, .31, s * 12.2, s * .146); box(plat, repMat(TX.hazard, 1, 4), .5, .16, 4.2, -4.2, .31, s * 12.2, s * .146); }
  HG.turn = grp(plat, 0, .6, 0);
  const an = new THREE.Mesh(new THREE.RingGeometry(6.1, 8.5, 56), repMat(TX.grate, 9, 9, { metalness: .4, roughness: .82 }, matFloor)); an.rotation.x = -PI / 2; an.position.y = .145; an.receiveShadow = true; HG.turn.add(an);
  cyl(HG.turn, HG_DECK, 8.7, 8.7, .1, 0, .04, 0, 0, 0, 0, 40); noShadow(cyl(HG.turn, new THREE.MeshBasicMaterial({ color: 0x020202 }), 6.1, 6.1, .02, 0, .1, 0, 0, 0, 0, 40));   // lift shaft (reads as a dark pit)
  for (let i = 0; i < 4; i++) box(HG.turn, M.yellow, .5, .06, 3, Math.sin(i * PI / 2) * 6.8, .15, Math.cos(i * PI / 2) * 6.8, 0, i * PI / 2, 0);
  HG.lift = grp(HG.turn, 0, .1, 0); cyl(HG.lift, M.dark, 6, 6, .1, 0, 0, 0, 0, 0, 0, 40); for (let i = 0; i < 4; i++) noShadow(box(HG.lift, M.yellow, .4, .02, 2.2, Math.sin(i * PI / 2 + PI / 4) * 4.6, .055, Math.cos(i * PI / 2 + PI / 4) * 4.6, 0, i * PI / 2 + PI / 4, 0));
  HG.liftGlow = glowMat(0xff9a1a, 1.2); const lr = new THREE.Mesh(new THREE.RingGeometry(6.0, 6.22, 56), HG.liftGlow); lr.rotation.x = -PI / 2; lr.position.y = .16; HG.turn.add(lr);
  for (let i = 0; i < 16; i++) { const a = i * TAU / 16 + PI / 16, mt = glowMat(0xff9a1a, 1); noShadow(box(plat, mt, .5, .18, .25, Math.sin(a) * 9.7, .68, Math.cos(a) * 9.7, 0, a, 0)); HG.blink.push({ mt, i }); }

  /* gantry towers with decks + retracting gangways */
  const grate = repMat(TX.grate, 4, 6, { metalness: .45, roughness: .75 });
  for (const s of [-1, 1]) {
    const t = grp(sc, s * 16, 0, 0);
    for (const px of [-2.3, 2.3]) for (const pz of [-3.4, 3.4]) box(t, M.yellow, .5, 25, .5, px, 12.5, pz);
    for (const y of [6, 12, 18, 24]) {
      box(t, grate, 5.2, .2, 7.4, 0, y, 0); for (const pz of [-3.6, 3.6]) box(t, M.yellow, 5.2, .1, .1, 0, y + 1.15, pz); box(t, M.yellow, .1, .1, 7.4, s * 2.55, y + 1.15, 0);
      box(t, M.girder, .16, 7.6, .16, s * 2.4, y - 3, 0, .86); box(t, M.girder, .16, 7.6, .16, s * 2.4, y - 3, 0, -.86);
    }
    box(t, M.girder, .9, 25, .12, s * 2.75, 12.5, 2); cyl(t, M.dark, .4, .5, .5, 0, 25.3, 0); const bc = noShadow(cyl(t, M.amber, .32, .32, .5, 0, 25.8, 0)); HG.spin.push(bc);
    box(t, M.dark, 2.2, 1.5, .25, 0, 21, 3.6); HG['scr' + s] = noShadow(box(t, M.black, 2, 1.3, .05, 0, 21, 3.75));
    for (const y of [12, 18]) { const g = grp(t, 0, y, 0); box(g, grate, 6.5, .16, 1.9, -s * 5.6, 0, 0); for (const pz of [-.9, .9]) box(g, M.yellow, 6.5, .08, .08, -s * 5.6, 1.1, pz); box(g, repMat(TX.hazard, 1, 2), .3, .2, 1.9, -s * 8.8, .02, 0); HG.gang.push({ g, s, ext: 1 }); }
    HG['tower' + s] = t;
  }
  /* big wall fans */
  for (const x of [-34, 34]) { const f = grp(sc, x, 27, -hl + .7); cyl(f, M.dark, 4.4, 4.4, .8, 0, 0, 0, PI / 2, 0, 0, 24); noShadow(cyl(f, glowMat(0x6fa8d8, .7), 4, 4, .1, 0, 0, -.3, PI / 2, 0, 0, 24)); const b = grp(f, 0, 0, .3); for (let i = 0; i < 5; i++) box(b, M.black, 1.3, 3.9, .12, Math.sin(i * TAU / 5) * 1.9, Math.cos(i * TAU / 5) * 1.9, 0, 0, .35, -i * TAU / 5); cyl(b, M.steel, .7, .7, .5, 0, 0, 0, PI / 2); HG.spin.push(b); b.userData.spinZ = 2.2; }

  /* props: crates, barrels, console, spare-weapon rack */
  const R = mulberry(7);
  const crate = (x, z, s, y = 0) => { const c = grp(sc, x, y + s / 2, z, 0, R() * .6, 0); box(c, pick([M.rust, M.steel, M.blue, M.yellow]), s, s, s); box(c, M.dark, s * 1.04, s * .12, s * 1.04, 0, s * .38, 0); box(c, M.dark, s * 1.04, s * .12, s * 1.04, 0, -s * .38, 0); return c; };
  for (const [x, z] of [[-22, 46], [-25.5, 46.5], [-23.5, 50], [24, -52], [28, -50], [-25, -54], [8, 54], [38, 40], [-39, -52]]) { const s = 2.2 + R() * 1.6; crate(x, z, s); if (R() > .45) crate(x + R() * .5, z + R() * .5, s * .7, s); }
  for (const [x, z] of [[20, 52], [-12, 57], [36, -22], [-37, 8], [38, 9]]) for (let i = 0; i < 5; i++) cyl(sc, pick([M.red, M.blue, M.yellow, M.rust]), .7, .7, 1.9, x + (i % 3) * 1.5, .95, z + Math.floor(i / 3) * 1.5, 0, 0, 0, 12);
  const con = grp(sc, -15, 0, 17, 0, .75, 0); box(con, M.dark, 6, 1.8, 2, 0, .9, 0); box(con, M.steel, 6.2, .15, 2.4, 0, 1.85, .1);
  HG.screens = []; for (let i = -1; i <= 1; i++) { box(con, M.dark, 1.9, 1.4, .15, i * 2, 2.9, -.5, -.2, -i * .25); HG.screens.push(noShadow(box(con, M.black, 1.7, 1.2, .05, i * 2 - i * .02, 2.9, -.4, -.2, -i * .25))); }
  const rack = grp(sc, 26, 0, 48, 0, PI, 0), pm = makeMats(0); pm.pri.color.set(0x8b8f94); pm.sec.color.set(0x4b4f55); pm.acc.color.set(0xd9a21b);
  box(rack, M.girder, 30, .5, .5, 0, 9, 0); for (const x of [-15, 0, 15]) box(rack, M.girder, .5, 9, .5, x, 4.5, 0);
  Object.keys(PARTS.arm).forEach((k, i) => { const a = PARTS.arm[k].build(pm, 1); a.position.set(-13 + i * 4.8, 6.6, .5); rack.add(a); box(rack, M.dark, .2, 2, .2, -12 + i * 4.8, 8, .2); });
  for (let i = 0; i < 4; i++) HG.vents.push(V3([-9, 9, -13, 13][i], .3, [13, 13, -12, -12][i]));
}

/* ============ HANGAR: MACHINERY (door, crane, robot arms, bays, screens) ============ */
class RobotArm {
  constructor(sc, x, y, z, side) {
    this.side = side; this.L1 = 6.6; this.L2 = 6.2; this.t = rand(9); this.tgt = null; this.weld = false; this.c = { yaw: -side * Z, a: .25, b: 2.3 };
    const b = this.base = grp(sc, x, y, z); cyl(b, M.dark, 1, 1.2, .6, 0, .3, 0);
    const yw = this.yaw = grp(b, 0, .6, 0); cyl(yw, M.yellow, .8, .95, 1.2, 0, .6, 0, 0, 0, 0, 12); box(yw, M.dark, 1.1, .5, 1.6, 0, .4, -.6);
    const sh = this.sh = grp(yw, 0, 1.3, 0); cyl(sh, M.dark, .6, .6, 1.7, 0, 0, 0, 0, 0, Z);
    box(sh, M.yellow, .7, this.L1, .85, 0, this.L1 / 2, 0); box(sh, M.hazard, .72, .9, .87, 0, this.L1 * .62, 0); cyl(sh, M.chrome, .09, .09, this.L1 * .7, 0, this.L1 * .45, -.6); cyl(sh, M.black, .16, .16, this.L1 * .3, 0, this.L1 * .25, -.6);
    const el = this.el = grp(sh, 0, this.L1, 0); cyl(el, M.dark, .5, .5, 1.4, 0, 0, 0, 0, 0, Z);
    box(el, M.steel, .5, this.L2, .55, 0, this.L2 / 2, 0); box(el, M.yellow, .56, 1.6, .6, 0, 1.2, 0); cyl(el, M.black, .07, .07, this.L2, .32, this.L2 / 2, 0);
    const tip = this.tip = grp(el, 0, this.L2, 0); cyl(tip, M.dark, .3, .34, .5, 0, .2, 0); cyl(tip, M.chrome, .05, .14, .9, 0, .85, 0); this.torch = noShadow(sph(tip, glowMat(0x9fdcff, 0), .13, 0, 1.3, 0));
  }
  update(dt, fx) {
    this.t += dt; let yaw, a, b;
    if (this.tgt) {
      this.base.getWorldPosition(_v); const dx = this.tgt.x - _v.x, dy = this.tgt.y - (_v.y + 1.9), dz = this.tgt.z - _v.z, r = Math.hypot(dx, dz);
      const d = clamp(Math.hypot(r, dy), 2.5, this.L1 + this.L2 - 1.4), L1 = this.L1, L2 = this.L2 + 1.3;
      yaw = Math.atan2(dx, dz); a = Math.atan2(r, dy) - Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)); b = PI - Math.acos(clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1));
    } else { yaw = -this.side * Z + Math.sin(this.t * .23) * .5; a = .25 + Math.sin(this.t * .31) * .12; b = 2.2 + Math.sin(this.t * .4) * .2; }
    const c = this.c, k = this.tgt ? 3.2 : 1.4; c.yaw += angDiff(c.yaw, yaw) * (1 - Math.exp(-k * dt)); c.a = damp(c.a, a, k, dt); c.b = damp(c.b, b, k, dt);
    this.yaw.rotation.y = c.yaw; this.sh.rotation.x = c.a; this.el.rotation.x = c.b;
    const on = this.weld && this.tgt && Math.abs(c.a - a) + Math.abs(c.b - b) < .12 && Math.random() < .8;
    this.torch.material.emissiveIntensity = on ? rand(4, 9) : 0;
    if (on) { this.torch.getWorldPosition(_v); if (Math.random() < .6) sparks(fx, _v, 3, 5, 3, 3.4, 5); if (Math.random() < .05) sfx.play('weld'); return _v; }
    return null;
  }
}
{
  const sc = HG.scene, hl = HG.L / 2, hw = HG.W / 2;
  /* blast door + exterior */
  const door = HG.door = grp(sc, 0, 0, -hl + .1); HG.doorOpen = 0;
  box(door, std({ map: TX.corr, color: 0x9a8f7a, metalness: .6, roughness: .6 }), 44, 30, .8, 0, 15, 0);
  for (let i = 0; i < 6; i++) box(door, M.girder, 44, .5, 1.2, 0, 2.6 + i * 5, 0); box(door, repMat(TX.hazard, 22, 1), 44, 1.4, 1, 0, .7, 0);
  const dT = labelTex(256, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#e3d8c0'; g.font = 'bold 120px Impact,Arial Black,sans-serif'; g.textAlign = 'center'; g.fillText('03', w / 2, 108); });
  const dn = new THREE.Mesh(new THREE.PlaneGeometry(14, 7), new THREE.MeshStandardMaterial({ map: dT, transparent: true, opacity: .75, roughness: .9 })); dn.position.set(0, 17.6, .45); door.add(dn);
  { const c = document.createElement('canvas'); c.width = 1024; c.height = 320; const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; box(door, M.dark, 24.8, 7.9, .3, 0, 10.1, .72);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(24, 7.5), new THREE.MeshStandardMaterial({ map: tx, roughness: .8, metalness: .1 })); m.position.set(0, 10.1, .89); door.add(m);
    HG.brand = () => { const g = c.getContext('2d'); g.fillStyle = '#15181b'; g.fillRect(0, 0, 1024, 320); g.strokeStyle = '#d9a316'; g.lineWidth = 6; g.strokeRect(10, 10, 1004, 300); drawLogo(g, 164, 160, 128); g.fillStyle = '#e3d8c0'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.font = 'bold 132px Impact,Arial Black,sans-serif'; g.fillText(YARD.name, 324, 138, 668); g.font = 'bold 30px Menlo,monospace'; g.fillStyle = '#d9a316'; g.fillText('MERCENARY COMPANY  ·  HANGAR 03', 328, 246, 660); tx.needsUpdate = true; }; HG.brand(); }
  for (const s of [-1, 1]) { box(sc, repMat(TX.hazard, 1, 14), 1.8, 30, 1.8, s * 22.9, 15, -hl + .8); HG.spin.push(noShadow(cyl(sc, M.redGlow, .5, .5, .8, s * 22.9, 32.4, -hl + 1.4))); }
  box(sc, M.yellow, 47.6, 1.6, 1.8, 0, 30.8, -hl + .8);
  const skyT = labelTex(256, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6f8fb5'); gr.addColorStop(.55, '#f1d9b0'); gr.addColorStop(.62, '#fff3da'); gr.addColorStop(.63, '#b08a5c'); gr.addColorStop(1, '#8a6a45'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(120,100,85,.75)'; for (let i = 0; i < 16; i++) { const x = rand(w), bw = rand(4, 16), bh = rand(4, 26); g.fillRect(x, h * .63 - bh, bw, bh); if (Math.random() < .4) g.fillRect(x + bw / 2 - 1, h * .63 - bh - 12, 2, 12); }
  });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(220, 110), new THREE.MeshBasicMaterial({ map: skyT, fog: false })); sky.material.color.setScalar(2.4); sky.position.set(0, 20, -hl - 60); sc.add(sky);
  const og = new THREE.Mesh(new THREE.PlaneGeometry(120, 62), new THREE.MeshBasicMaterial({ color: 0xb89468, fog: false })); og.material.color.multiplyScalar(1.7); og.rotation.x = -PI / 2; og.position.set(0, -.02, -hl - 30); sc.add(og);
  HG.doorLight = new THREE.DirectionalLight(0xffe2bd, 0); HG.doorLight.position.set(0, 16, -hl - 30); HG.doorLight.target.position.set(0, 2, 0); sc.add(HG.doorLight, HG.doorLight.target);
  HG.shaft = new THREE.Mesh(new THREE.BoxGeometry(42, 28, 70), new THREE.MeshBasicMaterial({ color: 0xffe0b0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide, fog: false })); HG.shaft.position.set(0, 14.2, -hl + 35); sc.add(HG.shaft);
  HG.alarm = new THREE.PointLight(0xff3a12, 0, 90, 1.6); HG.alarm.position.set(0, 26, -hl + 8); sc.add(HG.alarm);
  HG.weldLight = new THREE.PointLight(0x9fdcff, 0, 40, 1.8); sc.add(HG.weldLight);

  /* overhead bridge crane */
  const C = HG.crane = { x: -22, hookY: 28, bridge: grp(sc, 0, 0, -30) };
  for (const s of [-1, 1]) { box(sc, M.girder, 1.2, 1.4, HG.L - 4, s * 31.5, 31.2, 0); box(C.bridge, M.dark, 2.6, 1.5, 5.4, s * 31.5, 32.6, 0); box(C.bridge, M.yellow, 64, 1.9, .8, 0, 32.8, s * 1.4); box(C.bridge, repMat(TX.hazard, 32, 1), 64, .45, .84, 0, 32, s * 1.4); }
  C.trolley = grp(C.bridge, C.x, 0, 0); box(C.trolley, M.dark, 3.6, 1.3, 4.2, 0, 34.2, 0); cyl(C.trolley, M.steel, .75, .75, 2.6, 0, 33.4, 0, 0, 0, Z); HG.spin.push(noShadow(cyl(C.trolley, M.amber, .3, .3, .5, 1.3, 35.1, 1.5)));
  C.cables = [-.6, .6].map(z => cyl(C.trolley, M.black, .06, .06, 1, 0, 0, z, 0, 0, 0, 6));
  C.hook = grp(C.trolley, 0, C.hookY, 0); box(C.hook, M.yellow, 2.4, 1, 1.8, 0, .9, 0); box(C.hook, M.hazard, 2.42, .3, 1.82, 0, .6, 0); cyl(C.hook, M.dark, 1.3, 1.5, .4, 0, .2, 0, 0, 0, 0, 12); noShadow(cyl(C.hook, M.amber, 1.1, 1.1, .06, 0, -.02, 0));
  for (let i = 0; i < 4; i++) tbox(C.hook, M.steel, .3, 1.3, .5, .4, .6, Math.sin(i * Z) * 1.5, -.3, Math.cos(i * Z) * 1.5, PI, i * Z, 0);
  C.sync = () => { C.trolley.position.x = C.x; C.hook.position.y = C.hookY; const top = 33, len = top - (C.hookY + 1.4); for (const c of C.cables) { c.scale.y = len; c.position.y = top - len / 2; } };
  C.sync();
  C.to = (x, z, dur = 1.1) => { const x0 = C.x, z0 = C.bridge.position.z; sfx.play('servo'); return tween(dur, k => { C.x = lerp(x0, x, k); C.bridge.position.z = lerp(z0, z, k); C.sync(); }); };
  C.hookTo = (y, dur = .8) => { const y0 = C.hookY; return tween(dur, k => { C.hookY = lerp(y0, y, k); C.sync(); }); };

  /* welding / service arms on the gantry decks */
  HG.arms = []; for (const s of [-1, 1]) { HG.arms.push(new RobotArm(sc, s * 13, 6.1, -2.4, s)); HG.arms.push(new RobotArm(sc, s * 13, 18.1, 2.4, s)); }

  /* three mech bays down the west wall hold the company's machines; the east wall is the parts store */
  HG.berth = [];
  for (let i = 0; i < 6; i++) {
    const s = i % 2 ? 1 : -1, z = -34 + Math.floor(i / 2) * 30, x = s * 33, n = i >> 1;
    noShadow(box(sc, HG_PAD, 15, .12, 17, x, .06, z)); for (const dz of [-8.2, 8.2]) noShadow(box(sc, repMat(TX.hazard, 8, 1), 15, .14, .7, x, .07, z + dz)); noShadow(box(sc, repMat(TX.hazard, 1, 9), .7, .14, 17, x - s * 7.4, .07, z));
    for (const dz of [-8, 8]) { box(sc, M.yellow, .7, 21, .7, s * (hw - 3), 10.5, z + dz); noShadow(box(sc, M.white, .3, 4, .3, s * (hw - 3.6), 9, z + dz)); }
    box(sc, M.girder, .9, 1.1, 16.7, s * (hw - 3), 21, z);
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128; const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(11, 2.75), new THREE.MeshBasicMaterial({ map: tx })); sg.material.color.setScalar(1.5); sg.position.set(s * (hw - 3.6), 22.6, z); sg.rotation.y = -s * Z; sc.add(sg);
    const sign = (a, b, col = '#9fe9ff') => { const g = cv.getContext('2d'); g.fillStyle = '#0c0d0e'; g.fillRect(0, 0, 512, 128); g.strokeStyle = '#ffb21a'; g.lineWidth = 6; g.strokeRect(6, 6, 500, 116); g.fillStyle = '#ffb21a'; g.font = 'bold 58px Menlo,Consolas,monospace'; g.fillText(a, 28, 66, 456); g.fillStyle = col; g.font = '28px Menlo,Consolas,monospace'; g.fillText(b, 28, 106, 456); tx.needsUpdate = true; };
    if (s < 0) { const b = { n, x, z, s, mech: null, k: null, sign }; HG.berth.push(b); HG.bays.push({ mech: { get height() { return b.mech ? b.mech.height : 12; }, update(dt) { if (b.mech) b.mech.update(dt); } } }); continue; }
    /* stores: a pallet rack of crated components against the wall, loose crates on the floor */
    sign('PARTS STORE', `0${n + 1} · ${['WEAPONS', 'STRUCTURE', 'EQUIPMENT'][n]}`); HG.bays.push({ mech: { height: 9, update() { } } });
    const R = mulberry(71 + n * 13), rk = grp(sc, x + 4.2, 0, z), cols = [M.rust, M.steel, M.blue, M.yellow, M.red];
    for (const dz of [-6.4, 0, 6.4]) for (const dx of [-1.6, 1.6]) box(rk, M.girder, .35, 13, .35, dx, 6.5, dz); for (const y of [.25, 4.4, 8.6, 12.8]) box(rk, M.dark, 3.8, .22, 13.4, 0, y, 0);
    for (const y of [.36, 4.51, 8.71]) for (const dz of [-3.2, 3.2]) { let zz = dz - 2.7; while (zz < dz + 2.2) { const w = 1.5 + R() * 1.6, h = 1.4 + R() * 2.1, c = box(rk, cols[(R() * 5) | 0], 2.6 + R() * .6, h, w, (R() - .5) * .3, y + h / 2, zz + w / 2); c.rotation.y = (R() - .5) * .08; box(rk, M.dark, 3.3, .14, w * 1.03, c.position.x, y + h * .78, c.position.z); zz += w + .25 + R() * .5; } }
    for (let k = 0; k < 3; k++) { const w = 2 + R() * 1.4, c = grp(sc, x - 3.4 + R() * 3, w / 2, z - 5 + k * 4.6 + R(), 0, R() * .7, 0); box(c, cols[(R() * 5) | 0], w, w, w); box(c, M.dark, w * 1.04, w * .12, w * 1.04, 0, w * .38, 0); box(c, M.dark, w * 1.04, w * .12, w * 1.04, 0, -w * .38, 0); }
  }
  HG.syncBerths = () => {
    for (const b of HG.berth) {
      const cfg = YARD.bays[b.n], act = b.n === YARD.act, n = bayParts(cfg), show = !act && n > 0, k = show ? JSON.stringify(cfg) : '';
      if (k !== b.k) { b.k = k; if (b.mech) { sc.remove(b.mech.root); for (const m of Object.values(b.mech.mats)) m.dispose(); } b.mech = show ? new Mech(cfg) : null; if (b.mech) { b.mech.root.position.set(b.x, .13, b.z); b.mech.root.rotation.y = -b.s * Z; noShadow(b.mech.root); sc.add(b.mech.root); } }
      const rd = n ? mechReady(cfg) : null; b.sign(`BAY ${b.n + 1}${n ? ' · ' + cfg.name : ''}`, !n ? 'EMPTY' : act ? 'ON THE ASSEMBLY STAND' : rd.ok ? `${rd.st.cls} · ${rd.st.tons.toFixed(0)} T · READY` : 'INCOMPLETE', !n ? '#8b8474' : act ? '#8dff6a' : rd.ok ? '#9fe9ff' : '#ff5a1f');
    }
  };

  /* live status screens */
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; const g = cv.getContext('2d'), tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
  const sm = new THREE.MeshBasicMaterial({ map: tx }); sm.color.setScalar(1.7); for (const s of [...HG.screens, HG.scr1, HG['scr-1']]) s.material = sm;
  const bars = Array.from({ length: 8 }, () => rand()); let scrT = 0;
  HG.drawScreen = (dt, busy, name, t) => {
    scrT -= dt; if (scrT > 0) return; scrT = .12;
    g.fillStyle = '#04090b'; g.fillRect(0, 0, 256, 160); g.fillStyle = '#ffb21a'; g.font = 'bold 15px Menlo,monospace'; g.fillText('STAND // ' + name, 8, 18); g.fillRect(8, 24, 240, 1);
    g.fillStyle = busy ? (Math.floor(t * 3) % 2 ? '#ff5a1f' : '#551a08') : '#5dff7a'; g.fillRect(8, 32, 10, 10); g.font = '12px Menlo,monospace'; g.fillText(busy ? 'ASSEMBLY ACTIVE' : 'UNIT NOMINAL', 24, 42);
    bars.forEach((b, i) => { bars[i] = clamp(b + rand(-.08, .08) * (busy ? 2 : 1), .1, 1); g.fillStyle = '#12303a'; g.fillRect(8, 54 + i * 9, 150, 6); g.fillStyle = bars[i] > .85 ? '#ff5a1f' : '#6fe3ff'; g.fillRect(8, 54 + i * 9, 150 * bars[i], 6); });
    g.fillStyle = '#2f6b78'; g.font = '9px Menlo,monospace'; for (let i = 0; i < 8; i++) g.fillText((Math.random() * 0xffffff | 0).toString(16).padStart(6, '0').toUpperCase(), 170, 60 + i * 9);
    g.strokeStyle = '#6fe3ff'; g.beginPath(); for (let x = 0; x < 240; x += 4) g.lineTo(8 + x, 143 + Math.sin(x * .09 + t * 5) * 8 * (busy ? 1.6 : .7) + rand(-1, 1)); g.stroke();
    tx.needsUpdate = true;
  };
}

/* ============ HANGAR: CONTROL, CAMERA, ASSEMBLY SEQUENCES ============ */
const player = new Mech(YARD.bays[YARD.act]); player.cfg = YARD.bays[YARD.act];
const MECH_Y = .16;
HG.turn.add(player.root); player.root.position.set(0, MECH_Y, 0); HG.syncBerths();
let busy = false, spin = false, mode = 'hangar', mechName = player.cfg.name || 'EMPTY BAY', ventT = 1, refreshUI = () => { };
const setStatus = (s, b) => { $('status').textContent = s; $('status').classList.toggle('busy', !!b); };
const setGang = e => HG.gang.forEach(g => g.ext = e);
const setDoor = k => { HG.doorOpen = k; HG.door.position.y = k * 30.6; HG.doorLight.intensity = k * 2.6; HG.shaft.material.opacity = k * .05; };

const orb = { th: .62, ph: 1.36, r: 38, ty: 7.5, cine: false, idle: 0, pos: V3(20, 9, 30), look: V3(0, 7, 0), cPos: V3(), cLook: V3() };
{
  const cv = $('gl'); let btn = -1, px = 0, py = 0;
  cv.addEventListener('pointerdown', e => { if (mode !== 'hangar') return; btn = e.button; px = e.clientX; py = e.clientY; cv.setPointerCapture(e.pointerId); orb.idle = 0; });
  cv.addEventListener('pointermove', e => {
    if (btn < 0 || mode !== 'hangar') return; const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; orb.idle = 0;
    if (btn === 0) { orb.th -= dx * .005; orb.ph = clamp(orb.ph - dy * .004, .35, 1.53); } else orb.ty = clamp(orb.ty + dy * .04, 2, 20);
  });
  cv.addEventListener('pointerup', () => btn = -1); cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('wheel', e => { if (mode !== 'hangar') return; e.preventDefault(); orb.r = clamp(orb.r * (1 + Math.sign(e.deltaY) * .08), 13, 62); orb.idle = 0; }, { passive: false });
}
function armsTarget(b, weld = true, sideOnly = 0) {
  for (const a of HG.arms) {
    if (!b || (sideOnly && a.side !== sideOnly)) { a.tgt = null; continue; }
    const c = b.getCenter(V3()), s = b.getSize(V3()); a.base.getWorldPosition(_v);
    a.tgt = V3(c.x + a.side * s.x * .5, clamp(_v.y + 1 + rand(-2, 3), b.min.y + .3, b.max.y - .2), c.z + rand(-.4, .4) * s.z); a.weld = weld;
  }
}
const steamRing = (n = 26, r = 6.2) => { for (let i = 0; i < n; i++) { const a = rand(TAU); HG.fx.smoke.emit(Math.sin(a) * r, .9, Math.cos(a) * r, Math.sin(a) * rand(1, 3), rand(1, 4), Math.cos(a) * rand(1, 3), rand(1.2, 2.6), rand(1.5, 3), .8, .82, .85, .3, -.5, 1, 2.4); } sfx.play('steam'); };
async function indexTable() { const t0 = HG.turn.rotation.y, d = angDiff(t0, 0); setGang(0); if (Math.abs(d) > .01) await tween(.3 + Math.abs(d) * .35, k => HG.turn.rotation.y = t0 + d * k); HG.turn.rotation.y = 0; }

/* ---- fitting from stores: every swap moves real items between the mech on the stand and the company inventory ---- */
const bayTitle = () => player.cfg.name || 'EMPTY BAY';
function fitApply(slot, id) {
  const c = player.cfg, cat = CAT[slot]; if (c[slot]) invAdd(cat + '.' + c[slot], 1); if (id) invAdd(cat + '.' + id, -1); c[slot] = id || null;
  if (slot === 'torso') {
    if (!id) { for (const s of ['head', 'armL', 'armR', 'back']) if (c[s]) { invAdd(CAT[s] + '.' + c[s], 1); c[s] = null; } invAdd('gear.sink', c.sinks); c.sinks = 0; }   /* everything hung on the torso comes off with it */
    else { const mx = PARTS.torso[id].sinks; if (c.sinks > mx) { invAdd('gear.sink', c.sinks - mx); c.sinks = mx; } }
  }
  if (!bayParts(c)) c.name = ''; else if (!c.name) c.name = 'UNIT ' + (YARD.act + 1);
}
const yardChanged = () => { HG.armT = 0; HG.syncBerths(); saveCO(); };
/* crane lifts the old component out, lowers the new one in, arms weld it home — either half is skipped when that side of the swap is empty */
async function swapUpper(slot, id) {
  const C = HG.crane, side = slot === 'armL' ? -1 : slot === 'armR' ? 1 : 0, old = player.slot[slot];
  let b = player.slotBox(slot), c = b.getCenter(V3()), top = b.max.y;
  armsTarget(b, !!old, side); await C.to(c.x, c.z, 1); await C.hookTo(top + .1, .7); sfx.play('clang'); await wait(.55); armsTarget(null);
  if (old) { const y0 = old.position.y, up = 27.5 - top; sfx.play('servo'); await tween(1.1, k => { old.position.y = y0 + k * up; C.hookY = top + .1 + k * up; C.sync(); }, ease.in); } else await C.hookTo(27.5, .6);
  fitApply(slot, id); player.build();
  if (id) {
    const nw = player.slot[slot], n0 = nw.position.y; b = player.slotBox(slot); top = b.max.y; const dn = 27.5 - top; nw.position.y = n0 + dn; sfx.play('servoDn');
    await tween(1.25, k => { nw.position.y = n0 + (1 - k) * dn; C.hookY = top + .1 + (1 - k) * dn; C.sync(); }, ease.out);
    sfx.play('clang'); c = b.getCenter(V3()); sparks(HG.fx, V3(c.x, b.min.y + .4, c.z), 40, 9); armsTarget(b, true, side); await wait(1); armsTarget(null);
  }
  await C.hookTo(28, .6); C.to(-22, -30, 1.4);
}
/* crane holds the upper body while the lift swaps the legs (or the assembly cradle) underneath */
async function swapLegs(id) {
  const C = HG.crane; let b = player.slotBox('torso'), c = b.getCenter(V3()), top = b.max.y;
  armsTarget(b, false); await C.to(c.x, c.z, 1); await C.hookTo(top + .1, .7); sfx.play('clang'); await wait(.3);
  const yOld = player.waist.getWorldPosition(V3()).y, D = player.height + 1; let legs = player.slot.legs, torso = player.slot.torso; steamRing(); sfx.play('servoDn');
  await tween(1.7, k => { legs.position.y = -k * D; torso.position.y = k * D + k * 1.5; HG.lift.position.y = .1 - k * D; C.hookY = top + .1 + k * 1.5; C.sync(); });
  fitApply('legs', id); player.build(); legs = player.slot.legs; torso = player.slot.torso;
  const hold = yOld + 1.5 - player.waist.getWorldPosition(V3()).y, D2 = player.height + 1; top = player.slotBox('torso').max.y;
  const place = k => { legs.position.y = -(1 - k) * D2; torso.position.y = (1 - k) * D2 + hold; HG.lift.position.y = .1 - (1 - k) * D2; C.hookY = top + .1 + hold; C.sync(); };
  place(0); sfx.play('servo'); await tween(1.8, place, ease.out); steamRing(14);
  await tween(.9, k => { torso.position.y = hold * (1 - k); C.hookY = top + .1 + hold * (1 - k); C.sync(); });
  sfx.play('clang'); b = player.slotBox('legs'); sparks(HG.fx, V3(0, player.waist.getWorldPosition(V3()).y, 0), 50, 9); armsTarget(b, true); await wait(1); armsTarget(null);
  await C.hookTo(28, .6); C.to(-22, -30, 1.4);
}
/* nothing above the waist: the lift simply takes the old drive below deck and brings the new one up */
async function swapLegsBare(id) {
  let D = player.height + 2, legs = player.slot.legs; steamRing(); sfx.play('servoDn'); await tween(1.4, k => { legs.position.y = -k * D; HG.lift.position.y = .1 - k * D; }, ease.in);
  fitApply('legs', id); player.build(); D = player.height + 2; legs = player.slot.legs; sfx.play('servo'); await tween(1.6, k => { legs.position.y = -(1 - k) * D; HG.lift.position.y = .1 - (1 - k) * D; }, ease.out);
  steamRing(14); sfx.play('clang'); if (id) { armsTarget(player.slotBox('legs'), true); await wait(1); armsTarget(null); }
}
async function fitPart(slot, id) {
  const cfg = player.cfg; id = id || null; if (busy || mode !== 'hangar' || cfg[slot] === id) return false;
  if (id && (!invN(CAT[slot] + '.' + id) || (!cfg.torso && slot !== 'legs' && slot !== 'torso'))) { sfx.play('deny'); return false; }
  busy = true; if (id) tal('y.fit'); if (cfg[slot]) tal('y.strip'); setStatus(id ? `FITTING ${SLOT_LABEL[slot]} — ${PARTS[CAT[slot]][id].name}` : `REMOVING ${SLOT_LABEL[slot]} — RETURNED TO STORES`, true); refreshUI();
  await indexTable(); await (slot !== 'legs' ? swapUpper(slot, id) : cfg.torso ? swapLegs(id) : swapLegsBare(id));
  setGang(1); busy = false; mechName = bayTitle(); setStatus('STAND READY — ' + mechName); yardChanged(); refreshUI(); return true;
}
function fitSinks(d) {
  const c = player.cfg, T = PARTS.torso[c.torso]; if (busy || !T) return; const n = clamp(c.sinks + d, 0, T.sinks);
  if (n === c.sinks || (d > 0 && !invN('gear.sink'))) return sfx.play('deny');
  invAdd('gear.sink', c.sinks - n); if (n > c.sinks) tal('y.sink', n - c.sinks); c.sinks = n; player.stats = mechStats(c); sfx.play('weld'); const b = player.slotBox('torso'); sparks(HG.fx, b.getCenter(V3()).setY(b.max.y - .4), 18, 6); yardChanged(); refreshUI();
}
/* bring another bay's machine to the assembly stand: the lift takes this one below deck and raises the other */
async function switchBay(i) {
  if (busy || mode !== 'hangar' || i === YARD.act) return; busy = true; tal('y.bay'); const to = YARD.bays[i], has = bayParts(to) > 0;
  setStatus(has ? `LIFT CYCLE — RETRIEVING ${to.name || 'UNIT'} FROM BAY ${i + 1}` : `LIFT CYCLE — BAY ${i + 1} IS EMPTY`, true); refreshUI();
  await indexTable(); let D = player.height + 2; steamRing(); sfx.play('servoDn');
  await tween(1.6, k => { player.root.position.y = MECH_Y - k * D; HG.lift.position.y = .1 - k * D; }, ease.in);
  YARD.act = i; player.cfg = to; applyPaint(player.mats, to.paint); player.build(); HG.syncBerths(); D = player.height + 2; sfx.play('servo');
  await tween(1.9, k => { player.root.position.y = MECH_Y - (1 - k) * D; HG.lift.position.y = .1 - (1 - k) * D; }, ease.out);
  steamRing(18); sfx.play('clang'); if (has) { armsTarget(player.slotBox(to.torso ? 'torso' : 'legs'), true); await wait(1.1); armsTarget(null); }
  setGang(1); busy = false; mechName = bayTitle(); setStatus(has ? 'STAND READY — ' + mechName : `BAY ${i + 1} EMPTY — BUILD FROM STORES`); yardChanged(); refreshUI();
}
function deployLabel(rd = mechReady(player.cfg, CO.active && CO.active.biome, CO.active)) { const b = $('btnDeploy'), arm = rd.ok && HG.armT > T; b.textContent = !rd.ok ? 'NOT READY' : arm ? 'CONFIRM LAUNCH' : CO.active ? 'LAUNCH CONTRACT' : 'LAUNCH FIELD TEST'; b.classList.toggle('no', !rd.ok); b.classList.toggle('arm', arm); }
const randomConfig = () => { const c = { paint: Math.floor(rand(PAINTS.length)) }; for (const s of SLOTS) c[s] = pick(Object.keys(PARTS[CAT[s]])); return c; };
function paintMech(i) {
  if (busy) return; player.setPaint(i); const p = new THREE.Color(PAINTS[i].pri); sfx.play('steam');
  for (let k = 0; k < 60; k++) { const a = rand(TAU), r = rand(3, 6); HG.fx.smoke.emit(Math.sin(a) * r, rand(2, player.height), Math.cos(a) * r, -Math.sin(a) * 2, rand(-.3, .6), -Math.cos(a) * 2, rand(.8, 1.6), rand(1.5, 3), p.r, p.g, p.b, .35, 0, 1.5, 1.5); }
  refreshUI();
}
/* actuator check: twist, aim, march in place, dry-fire */
async function systemsTest() {
  if (busy || !mechReady(player.cfg).ok) return; busy = true; setStatus('SYSTEMS TEST — ACTUATORS / FIRE CONTROL', true); await indexTable(); const P = player, tw = Math.min(1, P.stats.twist);
  sfx.play('servo'); await tween(1.6, k => { P.twist = Math.sin(k * TAU) * tw * .7; P.pitch = Math.sin(k * TAU * 2) * .3; }, ease.lin); P.twist = P.pitch = 0;
  await tween(.4, k => P.gait.amt = k * .8); await wait(2.4); await tween(.6, k => P.gait.amt = (1 - k) * .8); P.gait.amt = 0;
  for (const s of ['armL', 'armR', 'armL', 'armR']) { if (!P.slot[s]) continue; const u = P.slot[s].userData; u.recoil = 1; u.fireT = .5; u.muzzle.getWorldPosition(_v); sparks(HG.fx, _v, 16, 5, 4, 3, 1.5); sfx.play('cannon'); await wait(.28); }
  if (P.stats.jets) { P.setJets(true); sfx.play('jet'); await wait(.9); P.setJets(false); }
  setGang(1); busy = false; setStatus('STAND READY — ' + mechName);
}

function updateHangar(dt, t) {
  if (spin && !busy) HG.turn.rotation.y += dt * .3; if (HG.armT && t > HG.armT) { HG.armT = 0; refreshUI(); }
  player.update(dt); for (const b of HG.bays) b.mech.update(dt);
  if (player.gait.amt > .05 && mode === 'hangar' && !orb.cine) player.onStep = L => { sfx.play('step', .5); }; else if (!orb.cine) player.onStep = null;
  for (const g of HG.gang) { g.cur = damp(g.cur ?? 1, spin ? 0 : g.ext, 3, dt); g.g.position.x = g.s * (1 - g.cur) * 6.4; }
  let wl = null; for (const a of HG.arms) { const p = a.update(dt, HG.fx); if (p) wl = p; } HG.weldLight.intensity = wl ? rand(250, 900) : 0; if (wl) HG.weldLight.position.copy(wl);
  for (const s of HG.spin) if (s.userData.spinZ) s.rotation.z += dt * s.userData.spinZ;
  M.amber.emissiveIntensity = 1.4 + 2.6 * Math.max(0, Math.sin(t * 5)); M.redGlow.emissiveIntensity = HG.alarmOn ? (Math.sin(t * 9) > 0 ? 7 : .5) : 2;
  HG.alarm.intensity = HG.alarmOn ? (Math.sin(t * 9) > 0 ? 2600 : 150) : 0; HG.liftGlow.emissiveIntensity = busy ? 2 + 2 * Math.sin(t * 12) : 1.2;
  for (const b of HG.blink) b.mt.emissiveIntensity = busy ? (Math.floor(t * 12) % 8 === b.i % 8 ? 6 : .3) : 1 + .5 * Math.sin(t * 2 + b.i * .4);
  ventT -= dt; if (ventT < 0) { ventT = rand(.5, 2); const v = pick(HG.vents); for (let i = 0; i < 9; i++) HG.fx.smoke.emit(v.x, v.y, v.z, rand(-.7, .7), rand(1.2, 3.5), rand(-.7, .7), rand(1.5, 3.2), rand(1, 2.2), .75, .78, .82, .2, -.4, .8, 2.6); }
  HG.staff(dt, t); HG.drawScreen(dt, busy, mechName, t); HG.fx.spark.update(dt); HG.fx.smoke.update(dt);
  /* camera */
  const cam = HG.camera;
  if (!orb.cine) {
    orb.idle += dt; if (orb.idle > 6) orb.th += Math.cos(t * .11) * dt * .03;
    const sp = Math.sin(orb.ph), mid = player.height * .5 + .5;
    orb.look.set(0, lerp(mid, orb.ty, .5), 0); orb.pos.set(clamp(orb.r * sp * Math.sin(orb.th), -42, 42), Math.max(1.6, orb.look.y + orb.r * Math.cos(orb.ph)), clamp(orb.r * sp * Math.cos(orb.th), -60, 62));
  }
  orb.cPos.lerp(orb.pos, 1 - Math.exp(-(orb.cine ? 1.6 : 6) * dt)); orb.cLook.lerp(orb.look, 1 - Math.exp(-(orb.cine ? 2.5 : 6) * dt));
  cam.position.copy(orb.cPos); cam.lookAt(orb.cLook);
}
orb.cPos.set(34, 16, 52); orb.cLook.set(0, 8, 0);

