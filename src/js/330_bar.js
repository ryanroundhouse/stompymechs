/* ============ THE BAR: "THE LAST ROUND" — RUMOURS ABOUT THE BOARD, PILOTS FOR HIRE, A SEAT TO REST IN, TWO WAYS TO LOSE MONEY ============ */
const BAR = { scene: new THREE.Scene(), people: [], P: {}, pil: [], tagL: [], talk: null, speaking: false, relax: false, game: null, dirty: true, built: false, rosterK: '', clk: 0, glassT: 6 };
BAR.camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, .1, 90);
const barCam = { th: .7, ph: 1.47, r: 10, pos: V3(), look: V3(-1, 1.2, -1.5), cPos: V3(6.6, 1.9, 6), cLook: V3(-1, 1.2, -1.5), focus: null };
/* seats: h is the height of the seat, back how far the pelvis sits behind the spot */
const BAR_SEAT = { chair: { h: .47, back: .3 }, stool: { h: .78, back: .16 }, bench: { h: .47, back: .32 } };
{
  const sc = BAR.scene, W = 18, D = 13, H = 3.8, dk = M.dark, add = THREE.AdditiveBlending;
  const wood = std({ color: 0x5a3519, roughness: .5, metalness: .08 }), woodD = std({ color: 0x2c1b10, roughness: .62, metalness: .1 }), brass = std({ color: 0xb58b3c, metalness: .95, roughness: .28, envMapIntensity: .9 }), hide = std({ color: 0x5c1f1a, roughness: .72 }), wall = std({ map: TX.panel, color: 0x4a3c30, metalness: .45, roughness: .72 });
  sc.background = new THREE.Color(0x070504); sc.fog = new THREE.Fog(0x070504, 16, 44); sc.environment = ENV;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), repMat(TX.panel, 9, 6.5, { metalness: .22, roughness: .95, color: 0x4a382c }, matFloor)); fl.rotation.x = -PI / 2; fl.receiveShadow = true; sc.add(fl);
  box(sc, dk, W + 1, .4, D + 1, 0, H + .2, 0); for (const z of [-D / 2 - .2, D / 2 + .2]) box(sc, wall, W, H, .4, 0, H / 2, z); for (const x of [-W / 2 - .2, W / 2 + .2]) box(sc, wall, .4, H, D, x, H / 2, 0);
  for (let x = -6; x <= 6; x += 4) box(sc, M.girder, .3, .34, D, x, H - .17, 0); for (const [z, r] of [[-2.4, .09], [2.8, .06], [3.2, .06]]) cyl(sc, M.rust, r, r, W, 0, H - .5, z, 0, 0, PI / 2, 10);
  /* a wooden dado round the room, and a strip of floor lighting under it */
  for (const z of [-D / 2 + .03, D / 2 - .03]) box(sc, woodD, W, 1.05, .06, 0, .525, z); for (const x of [-W / 2 + .03, W / 2 - .03]) box(sc, woodD, .06, 1.05, D, x, .525, 0);
  /* the counter: timber top, brass foot rail, taps */
  const CX = -1.5, CL = 9.4, CZ = -3.95;
  box(sc, woodD, CL, 1.04, .62, CX, .52, CZ); box(sc, wood, CL + .3, .07, .96, CX, 1.075, CZ + .06); box(sc, brass, CL + .3, .025, .03, CX, 1.045, CZ + .53); cyl(sc, brass, .028, .028, CL, CX, .2, CZ + .5, 0, 0, PI / 2, 8);
  for (let x = CX - CL / 2 + .5; x < CX + CL / 2; x += 1.4) { box(sc, brass, .03, .2, .16, x, .12, CZ + .42); box(sc, dk, .05, .9, .03, x + .7, .52, CZ + .32); }
  { const g = grp(sc, CX + .9, 1.11, CZ - .05); box(g, brass, .14, .34, .12, 0, .17, 0); for (const x of [-.045, .045]) { cyl(g, dk, .012, .016, .16, x, .4, .03, .5); cyl(g, brass, .008, .008, .09, x, .2, .09, PI / 2); } }
  /* the tip jar: glass, a brass lid, what people have dropped in it and a card propped against it. The one thing in the building that takes real money (talkTip) */
  {
    const g = grp(sc, CX + 2.9, 1.11, CZ + .2), gl = new THREE.MeshStandardMaterial({ color: 0xcfe6de, transparent: true, opacity: .26, roughness: .06, metalness: .1, envMapIntensity: 1.3, depthWrite: false }), silver = std({ color: 0xc8ccd0, metalness: .92, roughness: .3 }), R = mulberry(77);
    noShadow(cyl(g, gl, .085, .078, .21, 0, .105, 0, 0, 0, 0, 18)); cyl(g, brass, .09, .09, .022, 0, .221, 0, 0, 0, 0, 18); box(g, dk, .07, .006, .014, 0, .233, 0);
    for (let i = 0; i < 18; i++) { const a = R() * TAU, r = R() * .05; cyl(g, i % 3 ? brass : silver, .016, .016, .004, Math.sin(a) * r, .006 + i * .0042, Math.cos(a) * r, (R() - .5) * .5, 0, (R() - .5) * .5, 10); }
    const card = new THREE.Mesh(new THREE.PlaneGeometry(.21, .136), new THREE.MeshBasicMaterial({ color: 0xb8b0a0, map: labelTex(256, 166, (c, w, h) => { c.fillStyle = '#efe6cf'; c.fillRect(0, 0, w, h); c.strokeStyle = '#7a2a1a'; c.lineWidth = 6; c.strokeRect(7, 7, w - 14, h - 14); c.fillStyle = '#7a2a1a'; c.textAlign = 'center'; c.font = 'bold 66px Menlo,Consolas,monospace'; c.fillText('TIPS \u2665', w / 2, 82); c.fillStyle = '#3a2a1c'; c.font = 'bold 19px Menlo,Consolas,monospace'; c.fillText('FOR WHOEVER BUILT', w / 2, 116); c.fillText('THE PLACE', w / 2, 140); }) }));
    card.position.set(.19, .066, .04); card.rotation.set(-.2, -.3, 0); g.add(card); box(g, woodD, .03, .1, .012, .2, .05, .0, .5, -.3, 0);
    BAR.tip = new THREE.Mesh(new THREE.SphereGeometry(.27, 8, 6), HUM.hitM); BAR.tip.position.set(.08, .11, 0); g.add(BAR.tip);
  }
  /* the back bar: cabinet, three lit shelves, the bottles (one mesh per colour of glass) */
  const BZ = -D / 2 + .32; box(sc, woodD, CL, 1, .6, CX, .5, BZ); box(sc, wood, CL, .05, .64, CX, 1.025, BZ); box(sc, std({ color: 0x14100c, metalness: 1, roughness: .18, envMapIntensity: .9 }), CL, 2, .04, CX, 2.05, -D / 2 + .03);
  const shelfY = [1.45, 1.98, 2.51]; for (const y of shelfY) { box(sc, woodD, CL, .045, .34, CX, y, BZ - .08); noShadow(box(sc, glowMat(0xffa040, 1.5), CL - .2, .018, .03, CX, y - .035, BZ + .07)); }
  for (const x of [CX - CL / 2, CX, CX + CL / 2]) box(sc, woodD, .09, 1.9, .36, x, 2, BZ - .08);
  {
    const prof = [[0, 0], [.038, 0], [.04, .15], [.03, .19], [.013, .215], [.013, .28], [.017, .285], [.017, .3], [0, .3]].map(p => new THREE.Vector2(p[0], p[1])), bg = new THREE.LatheGeometry(prof, 9), R = mulberry(77), m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), s4 = V3(), p4 = V3();
    const glass = [[0x8a4a12, 0x3a1802], [0x1f5a2a, 0x06200c], [0x2a4a6a, 0x081824], [0x8a1a14, 0x300604], [0xc9c2a8, 0x2a2618]].map(([c, e]) => new THREE.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: 1.1, roughness: .12, metalness: .1, envMapIntensity: .9 })), spots = glass.map(() => []);
    for (const y of [1.05, ...shelfY]) for (let x = CX - CL / 2 + .22; x < CX + CL / 2 - .2; x += .13 + R() * .16) { if (Math.abs(x - CX) < .12 || R() < .16) continue; spots[(R() * glass.length) | 0].push([x, y + .024, BZ - .08 + (R() - .5) * .14, .8 + R() * .45, .85 + R() * .35]); }
    spots.forEach((L, i) => { const im = new THREE.InstancedMesh(bg, glass[i], L.length); L.forEach(([x, y, z, sy, sr], k) => { m4.compose(p4.set(x, y, z), q4, s4.set(sr, sy, sr)); im.setMatrixAt(k, m4); }); im.castShadow = false; sc.add(im); });
  }
  /* the name over the back bar, in tube lighting */
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.04), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, map: labelTex(1024, 204, (g, w, h) => { g.lineJoin = 'round'; g.textAlign = 'center'; g.font = 'bold 108px Menlo,Consolas,monospace'; g.strokeStyle = '#ff6a2a'; g.lineWidth = 7; g.strokeText('THE LAST ROUND', w / 2, 128); g.strokeStyle = '#ffd9a0'; g.lineWidth = 2; g.strokeText('THE LAST ROUND', w / 2, 128); g.strokeStyle = '#5fd8ff'; g.lineWidth = 5; g.beginPath(); g.moveTo(60, 168); g.lineTo(w - 60, 168); g.stroke(); }) }));
  sign.material.color.setScalar(2.1); sign.position.set(CX, 3.22, -D / 2 + .08); sc.add(sign); BAR.sign = sign.material;
  /* seats */
  const stool = (x, z) => { cyl(sc, dk, .2, .24, .04, x, .02, z, 0, 0, 0, 12); cyl(sc, M.chrome, .028, .028, .7, x, .38, z, 0, 0, 0, 8); cyl(sc, brass, .15, .15, .012, x, .3, z, 0, 0, 0, 12); cyl(sc, hide, .19, .17, .075, x, .745, z, 0, 0, 0, 16); return [x, z, .22]; };
  const chair = (x, z, yaw) => { const g = grp(sc, x, 0, z, 0, yaw, 0); box(g, woodD, .42, .05, .42, 0, .445, 0); box(g, hide, .38, .035, .38, 0, .486, 0); box(g, woodD, .42, .46, .04, 0, .74, -.2, -.1); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(g, woodD, .035, .44, .035, a * .18, .22, b * .18); return g; };
  const table = (x, z, r, h = .74) => { cyl(sc, wood, r, r, .045, x, h, z, 0, 0, 0, 24); cyl(sc, dk, .045, .06, h, x, h / 2, z, 0, 0, 0, 8); cyl(sc, dk, r * .62, r * .7, .04, x, .02, z, 0, 0, 0, 14); return [x, z, r]; };
  const mug = (x, y, z) => { cyl(sc, std({ color: 0xcfc8b8, roughness: .5 }), .037, .034, .09, x, y + .045, z, 0, 0, 0, 10); };
  const circ = [], sx = [-5.2, -4, -2.8, -1.6, -.4, .8]; for (const x of sx) circ.push(stool(x, -3.05));
  circ.push(table(-4.6, 1.2, .5), table(.8, 2.9, .62)); chair(-4.6, .4, 0); chair(-4.6, 2, PI); chair(-.08, 2.9, PI / 2); chair(.8, 3.78, PI); chair(1.68, 2.9, -PI / 2);
  for (const [x, z] of [[-4.75, 1.02], [-4.42, 1.38], [.6, 2.75], [1.05, 3.1], [-3.6, -3.75], [-.9, -3.72], [-5.6, -3.7]]) mug(x, z > 0 ? .765 : 1.11, z);
  /* the arm-wrestling table: narrow, bolted down, under its own lamp */
  box(sc, wood, .9, .05, .64, 5.6, .745, .6); box(sc, M.hazard, .92, .03, .05, 5.6, .745, .29); box(sc, M.hazard, .92, .03, .05, 5.6, .745, .91); box(sc, dk, .12, .74, .12, 5.6, .37, .6); box(sc, dk, .6, .04, .5, 5.6, .02, .6);
  for (const s of [-1, 1]) { box(sc, hide, .16, .03, .15, 5.6 + s * .1, .785, .6 + s * .21); cyl(sc, M.chrome, .016, .016, .13, 5.6 - s * .34, .835, .6 + s * .2, 0, 0, 0, 8); } chair(5.6, .05, 0); chair(5.6, 1.15, PI); circ.push([5.6, .6, .5]);
  /* the booth along the left wall */
  const bx = -W / 2 + .3; box(sc, woodD, .6, .42, 6.8, bx, .21, 2.2); box(sc, hide, .56, .08, 6.7, bx, .46, 2.2); box(sc, hide, .1, .62, 6.7, bx - .24, .86, 2.2, 0, 0, -.1); box(sc, woodD, .06, 1.5, .1, bx + .1, .75, -1.25); box(sc, woodD, .06, 1.5, .1, bx + .1, .75, 5.65);
  box(sc, wood, .72, .05, 4.9, -7.75, .745, 2.3); for (const z of [.3, 4.3]) box(sc, dk, .1, .74, .1, -7.75, .37, z); for (const z of [1.1, 2.6, 3.7]) mug(-7.7, .77, z);
  /* the jukebox: where the music in here comes from */
  const jk = grp(sc, 7.5, 0, -5.4, 0, -.94, 0), jb = std({ color: 0x3a1410, roughness: .35, metalness: .3 }); box(jk, jb, 1.08, 1.2, .62, 0, .6, 0); cyl(jk, jb, .54, .54, .62, 0, 1.2, 0, PI / 2, 0, 0, 24); box(jk, M.black, .78, .5, .04, 0, .42, .31);
  BAR.jukeA = glowMat(0xff7a2a, 2.2); BAR.jukeB = glowMat(0x5fd8ff, 1.6); BAR.jukeC = glowMat(0xffd070, 1.4);
  for (const [r, m] of [[.5, BAR.jukeA], [.41, BAR.jukeB]]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, .028, 8, 28, PI), m); t.position.set(0, 1.2, .32); jk.add(t); } for (const s of [-1, 1]) noShadow(box(jk, BAR.jukeA, .04, 1.16, .04, s * .5, .6, .32)); noShadow(box(jk, BAR.jukeC, .7, .3, .03, 0, 1.0, .315));
  for (let i = 0; i < 6; i++) box(jk, M.chrome, .012, .46, .02, -.3 + i * .12, .42, .335); BAR.jukePos = V3(7.5, 1.2, -5.4); BAR.jukeL = new THREE.PointLight(0xff8a3a, 7, 6.5, 1.6); BAR.jukeL.position.set(7, 1.5, -4.8); sc.add(BAR.jukeL); circ.push([7.5, -5.4, .8]);
  /* the house board on the right wall: who holds the tables, and the sector wire */
  const wc = document.createElement('canvas'); wc.width = 768; wc.height = 432; const wg = wc.getContext('2d'), wt = new THREE.CanvasTexture(wc); wt.colorSpace = THREE.SRGBColorSpace;
  const wm = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.63), new THREE.MeshBasicMaterial({ map: wt })); wm.material.color.setScalar(1.25); wm.position.set(W / 2 - .06, 2.25, -2.3); wm.rotation.y = -PI / 2; sc.add(wm); box(sc, dk, .1, 1.8, 3.07, W / 2 - .02, 2.25, -2.3);
  BAR.drawWall = () => {
    const g = wg; g.fillStyle = '#080604'; g.fillRect(0, 0, 768, 432); g.fillStyle = '#ffb21a'; g.font = 'bold 24px Menlo,monospace'; g.fillText('HOUSE BOARD', 22, 38); g.fillRect(22, 50, 724, 2); g.textAlign = 'right'; g.fillStyle = '#e6dfcf'; g.fillText(YARD.name, 746, 38, 330); g.textAlign = 'left';
    g.font = '19px Menlo,monospace'; [['DRINKING TABLE', BARSV.wins.drink, 'BALLAST'], ['ARM WRESTLING', BARSV.wins.arm, 'VISE']].forEach(([l, n, who], i) => { const y = 88 + i * 34; g.fillStyle = '#8b8474'; g.fillText(l, 22, y); g.fillStyle = n ? '#8dff6a' : '#ff9a6a'; g.fillText(n ? `${YARD.name} — ${n} WIN${n > 1 ? 'S' : ''}` : `HELD BY ${who}`, 250, y, 490); });
    g.fillStyle = '#ffb21a'; g.font = 'bold 20px Menlo,monospace'; g.fillText('SECTOR WIRE', 22, 186); g.fillRect(22, 196, 724, 1); g.font = '16px Menlo,monospace'; CO.news.slice(0, 6).forEach((s, i) => { g.fillStyle = i ? '#9fb7bd' : '#fff'; g.fillText(s.length > 70 ? s.slice(0, 69) + '…' : s, 22, 226 + i * 32); }); wt.needsUpdate = true;
  };
  /* a dartboard, the way out, and one trophy: an armour plate with the house tally scratched into it */
  { const g = grp(sc, W / 2 - .06, 1.75, 3.2, 0, -PI / 2, 0); cyl(g, woodD, .3, .3, .04, 0, 0, 0, PI / 2, 0, 0, 20); [[.26, 0x1a1a1a], [.2, 0xcfc8b8], [.14, 0x8a1a14], [.08, 0xcfc8b8], [.03, 0x8a1a14]].forEach(([r, c], i) => noShadow(cyl(g, std({ color: c, roughness: .8 }), r, r, .01, 0, 0, .022 + i * .004, PI / 2, 0, 0, 20))); }
  box(sc, M.steel, 1.3, 2.3, .1, 6.6, 1.15, D / 2 - .04); box(sc, repMat(TX.hazard, 3, 1), 1.3, .2, .12, 6.6, .12, D / 2 - .04); noShadow(box(sc, M.green, .7, .09, .06, 6.6, 2.5, D / 2 - .05));
  box(sc, M.rust, 2.2, 1.3, .08, -3.6, 2.35, D / 2 - .05, 0, 0, .06); for (let i = 0; i < 4; i++) box(sc, M.yellow, .09, .09, .1, -4.55 + (i % 2) * 1.9, 1.82 + (i >> 1) * 1.06, D / 2 - .06);
  /* light: warm, low, and pooled over the places people sit */
  sc.add(new THREE.HemisphereLight(0xffc890, 0x1a0e08, .34));
  const key = new THREE.SpotLight(0xffdcb0, 120, 17, 1, .75, 1.4); key.position.set(1.4, H - .12, 2.4); key.target.position.set(-.6, .5, -1.4); key.castShadow = true; key.userData.sh = 1; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0006; sc.add(key, key.target);
  /* six shaded lamps hang over the room; only the three over the tables are real lights, the rest borrow from the key */
  for (const [x, z, c, i] of [[-4.6, 1.2, 0xffb070, 34], [5.6, .6, 0xfff0d8, 44], [.8, 2.9, 0xffc48a, 32], [-3.4, -3.4, 0, 0], [.6, -3.4, 0, 0], [-7.9, 2.3, 0, 0]]) {
    if (i) { const p = new THREE.SpotLight(c, i, 7.5, .78, .85, 1.5); p.position.set(x, H - .62, z); p.target.position.set(x, 0, z); sc.add(p, p.target); }
    cyl(sc, dk, .012, .012, .5, x, H - .25, z, 0, 0, 0, 5); noShadow(cyl(sc, brass, .07, .25, .2, x, H - .6, z, 0, 0, 0, 14)); noShadow(sph(sc, M.white, .055, x, H - .68, z));
  }
  const bl = new THREE.PointLight(0xffa24a, 16, 9, 1.5); bl.position.set(CX, 2.4, -4.6); sc.add(bl); BAR.fill = new THREE.PointLight(0xfff0e2, 0, 5, 1.5); sc.add(BAR.fill);
  /* who can walk where */
  BAR.crowd = new Crowd({ camLook: .16, poi: { x: CX, y: 1.5, z: -5 }, circ, box: [[CX - CL / 2, CZ - .31, CX + CL / 2, CZ + .45], [CX - CL / 2, -D / 2, CX + CL / 2, BZ + .3], [-W / 2, -1.3, -7.35, 5.7]] });
  BAR.crowd.clampFn = h => { const p = h.g.position; p.x = clamp(p.x, -W / 2 + .35, W / 2 - .35); p.z = clamp(p.z, -D / 2 + .35, D / 2 - .35); };
  BAR.blocked = (x, z) => Math.abs(x) > W / 2 - .5 || Math.abs(z) > D / 2 - .5 || (x > CX - CL / 2 - .25 && x < CX + CL / 2 + .25 && ((z > CZ - .5 && z < CZ + .7) || z < BZ + .5)) || (x < -7.2 && z > -1.4) || Math.hypot(x - 7.5, z + 5.4) < 1.1;
}

/* ---- people who are always here ---- */
OUTFIT.keep = () => ({ top: '#6b5a44', bot: '#1c1917', sleeves: 2, collar: 'fold', zip: 1, pocket: 1, rag: 1, watch: 1 });
OUTFIT.civ = L => { const Q = L.Q, hat = Q() < .24 ? (Q() < .5 ? 'cap' : 'beanie') : null; return { top: ['#5a3a2a', '#2f4a4f', '#4a4636', '#3b3550', '#6a5a3c', '#2e3b2e', '#55322f'][(Q() * 7) | 0], bot: ['#1f2228', '#2a241e', '#22262b'][(Q() * 3) | 0], collar: Q() < .6 ? 'fold' : 'stand', zip: Q() < .7 ? 1 : 0, hem: 1, pocket: Q() < .5 ? 1 : 0, sleeves: (Q() * 3) | 0, hat, hatCol: ['#1f2a36', '#6d2a22', '#2f3a2a', '#3a3f47'][(Q() * 4) | 0], watch: Q() < .4 ? 1 : 0 }; };
const BARC = {
  keep: { name: '"Mother" Brandt', first: 'Mother', last: 'Brandt', role: 'BARKEEP · THE LAST ROUND', seed: 311, col: '#ffcf7a' },
  load: { name: 'Hugo Strand', first: 'Strand', last: 'Strand', role: 'DROPSHIP LOADMASTER', seed: 331, col: '#9fd0a8' },
  sig: { name: 'Priya Banerjee', first: 'Banerjee', last: 'Banerjee', role: 'SIGNALS TECH · OFF SHIFT', seed: 347, col: '#8fc7ff' },
  broker: { name: 'Ezra Calloway', first: 'Calloway', last: 'Calloway', role: 'CONTRACT BROKER', seed: 359, col: '#c9a0ff' },
  drink: { name: 'Greta "Ballast" Lindqvist', first: 'Ballast', last: 'Lindqvist', role: 'DRINKING TABLE · HOUSE CHAMPION', seed: 373, col: '#ffb070' },
  arm: { name: 'Kofi "Vise" Mbeki', first: 'Vise', last: 'Mbeki', role: 'ARM WRESTLING · TABLE BOSS', seed: 389, col: '#ff8a6a' },
};
/* seated with a drink: the glass comes up now and then */
ACT.perch = (h, q, ad, t) => { ACT.sit(h, q, ad, t); if (h.ao.h > .6) q[QF + 3] = q[QF + 7] = .2 * h.k; if (!h.held[0]) return; const s = (t * .07 + h.L.seed * .37) % 1, e = smooth(clamp(Math.min(s / .05, (.22 - s) / .06), 0, 1)); lerpArm(q, 0, e, 1.02, .14, .86, 2.32, .1, .2); q[9] -= .14 * e; };
/* behind the counter: a cloth going round on the timber */
ACT.wipe = (h, q, ad, t) => { q[6] = .26; q[9] = .3; q[2] = -.05 * h.k; qArm(q, 0, .86, .14, .1, .5, 0, 1.3); ad[QA] = .12 * Math.sin(t * 3.3); ad[QA + 1] = .17 * Math.cos(t * 3.3); if (!h.held[1]) qArm(q, 1, .62, .24, .1, .62, -.5, 1.3); };
/* at a contest table. ao.arm: the right elbow is planted and ao.k (-1..1) is how the wrestle stands, 1 = this one is winning · ao.sip (0..1) the glass going up · ao.wob how far gone · ao.out face down on the table */
ACT.bout = (h, q, ad, t) => {
  const o = h.ao, k = o.k || 0, wob = o.wob || 0, out = o.out || 0; ACT.sit(h, q, ad, t);
  if (o.arm) { q[6] = .52 - k * .07; q[8] = k * .16; q[7] = -.12 - k * .1; q[9] = -.3; qArm(q, 0, .9, .2, .5 + k * .95, 1.85, 0, .6); qArm(q, 1, .5, .22, .2, .9, -.3, 1.2); const st = o.strain || 0; ad[QA + 2] += .025 * st * Math.sin(t * 31); ad[9] += .012 * st * Math.sin(t * 27); }
  else { const e = o.sip || 0; lerpArm(q, 0, e, 1.02, .14, .86, 2.32, .1, .2); q[9] -= .22 * e; ad[8] += wob * .11 * Math.sin(t * 1.7); ad[6] += wob * .06 * Math.sin(t * 1.1 + 1); ad[11] += wob * .12 * Math.sin(t * .9); q[6] = lerp(q[6], 1.02, out); q[9] = lerp(q[9], .55, out); if (out > .5) for (let i = 0; i < 2; i++) lerpArm(q, i, out, 1.1, .5, .2, .7, 0, 1.2); }
};
function* barStay(h, acts, look) { for (;;) { const a = pick(acts); h.setAct(a[0], { look, ...(a[3] || {}) }); if (a[3] && a[3].h) h.seat = h.ao; yield* hWait(h, rand(a[1], a[2])); } }
function barPerson(ch, x, z, yaw, role, kind, extra = {}) {
  const h = new Human(lookOf(ch.seed, extra.cast || {}), { scene: BAR.scene, role, col: ch.col, x, z, yaw, ...extra }); h.ch = ch; h.kind = kind; BAR.crowd.add(h); BAR.people.push(h); return h;
}
/* a seat, the spot to stand at to sit in it, and what to do there */
const barSit = (cx, cz, yaw, kind, mode) => ({ x: cx + Math.sin(yaw) * BAR_SEAT[kind].back, z: cz + Math.cos(yaw) * BAR_SEAT[kind].back, yaw, o: { ...BAR_SEAT[kind], mode } });
function barBuild() {
  if (BAR.built) return; BAR.built = true; const P = BAR.P, seated = (h, S, acts, look) => { h.sp = S; h.brain = h => barStay(h, acts.map(a => [a[0], a[1], a[2], { ...S.o, mode: a[3] || S.o.mode }]), look); h.co = h.brain(h); return h; };
  /* the barkeep works the length of the counter */
  P.keep = barPerson(BARC.keep, -1.6, -5.05, 0, 'keep', 'keep', { cast: { build: 'broad', h: 1.72 } }); P.keep.spots = [-4.6, -2.2, .3, 2.2].map(x => hSpot(x, -5.05, 0, [['wipe', 6, 12], ['watch', 4, 8], ['lean', 5, 9]])); for (const s of P.keep.spots) s.via = [s.x, -5.05];
  P.keep.brain = function* (h) { for (;;) { const s = pick(h.spots.filter(s => Math.abs(s.x - h.g.position.x) > .5)); yield* hGo(h, s.x, s.z, { direct: true }); yield* hFace(h, 0); const a = pick(s.acts); yield* hDo(h, a[0], rand(a[1], a[2])); } }; P.keep.co = P.keep.brain(P.keep);
  P.load = seated(barPerson(BARC.load, 0, 0, 0, 'mech', 'src', { props: { r: 'mug' }, fit: { hat: 'cap', hatCol: '#2f3a2a', vest: null, ear: 0 }, cast: { build: 'heavy' } }), barSit(-5.2, -3.05, PI, 'stool', 'fwd'), [['perch', 9, 18], ['perch', 8, 14, 'back']], P.keep);
  P.sig = seated(barPerson(BARC.sig, 0, 0, 0, 'ops', 'src', { props: { r: 'mug' }, cast: { build: 'slim' } }), barSit(-1.6, -3.05, PI, 'stool', 'fwd'), [['perch', 9, 18], ['perch', 7, 12, 'back']], P.keep);
  P.broker = seated(barPerson(BARC.broker, 0, 0, 0, 'suit', 'src', { props: { l: 'tablet' }, cast: { build: 'lean' } }), barSit(-8.72, .9, PI / 2, 'bench', 'back'), [['sit', 12, 24, 'back'], ['sit', 8, 14, 'fwd']]);
  P.drink = seated(barPerson(BARC.drink, 0, 0, 0, 'civ', 'drink', { props: { r: 'mug' }, cast: { build: 'heavy', h: 1.86 } }), barSit(-4.6, .4, 0, 'chair', 'back'), [['perch', 10, 20, 'back'], ['perch', 8, 14, 'fwd']]);
  P.arm = seated(barPerson(BARC.arm, 0, 0, 0, 'civ', 'arm', { cast: { build: 'broad', h: 1.9 }, fit: { sleeves: 2, hat: null } }), barSit(5.6, .05, 0, 'chair', 'back'), [['sit', 10, 20, 'back'], ['sit', 8, 14, 'fwd']]);
  P.load.src = 'load'; P.sig.src = 'sig'; P.broker.src = 'broker';
  for (const k of ['load', 'sig', 'broker', 'drink', 'arm']) { const h = P[k]; h.g.position.set(h.sp.x, 0, h.sp.z); h.yaw = h.sp.yaw; h.g.rotation.y = h.yaw; }
  /* two more who are only here for the evening */
  const idle = (seed, name, role, lines, extra) => { const h = barPerson(mkChar(seed, name, '#9fb7bd'), 0, 0, 0, role, 'extra', extra); h.lines = lines; return h; };
  const zz = seated(idle(409, 'SOMEBODY\'S RIGGER', 'mech', ['...five more minutes, Chief...', '...not the left actuator. Never the left...', '(Snoring. A hand waves you away without waking up.)'], { fit: { hat: 'beanie', hatCol: '#3a3f47', vest: null, ear: 0 } }), barSit(-8.72, 3.9, PI / 2, 'bench', 'fwd'), [['sit', 30, 60, 'fwd']]); zz.g.position.set(zz.sp.x, 0, zz.sp.z); zz.yaw = PI / 2;
  const wd = idle(431, 'OFF-DUTY BAY TECH', 'mech', ['That jukebox only knows the one band. Nobody minds.', 'I rig for the Combine three days a week and against them the other four.', 'If you are hiring: I do not fly. I just know which of these pilots bring the machine back.', 'Vise has not lost at that table this month. Somebody should fix that.'], { props: { r: 'mug' }, fit: { hat: null, vest: null, ear: 0 } });
  wd.g.position.set(6.3, 0, -5); wd.spots = [hSpot(6.3, -5, 1.9, [['sip', 9, 16], ['watch', 6, 10]], { x: 7.5, y: 1.2, z: -5.4 }), hSpot(7.7, 3.2, PI / 2, [['watch', 6, 12], ['think', 4, 7]], { x: 9, y: 1.75, z: 3.2 }), hSpot(2.6, -2.95, PI, [['sip', 8, 14], ['watch', 5, 9]], P.keep), hSpot(2.5, 3.9, -2.1, [['sip', 8, 14], ['chat', 6, 11]], { x: .8, y: 1.1, z: 2.9 })];
  wd.spots[1].via = [7.2, 4.7]; wd.brain = function* (h) { yield* hRoam(h, h.spots, 2); }; wd.co = wd.brain(wd);
  /* where the pilots for hire sit: two at their table, one at the counter, one by the jukebox */
  BAR.pilSpot = [barSit(-.08, 2.9, PI / 2, 'chair', 'back'), barSit(.8, 3.78, PI, 'chair', 'fwd'), barSit(.8, -3.05, PI, 'stool', 'fwd'), { x: 5.9, z: -3.7, yaw: 2.3, o: null }];
}

/* ---- pilots for hire: a rotating four. What one costs follows how good they are and how much machine they bring ---- */
const BSK = [['ROOKIE', .8, 1, .7], ['REGULAR', 1, 1.25, .85], ['VETERAN', 1.25, 1.5, 1], ['ELITE', 1.5, 1.8, 1.3], ['ACE', 1.8, 2.1, 1.7]];   /* rank, gunnery, how much punishment they ride out, price */
const BAR_CALL = ['Wraith', 'Magpie', 'Hex', 'Cinder', 'Lockjaw', 'Saint', 'Kingfisher', 'Marrow', 'Bulldog', 'Mirage', 'Tinder', 'Shrike', 'Ghostlight', 'Paydirt', 'Halfmoon', 'Ratchet', 'Longshot', 'Sixpence', 'Brine', 'Thistle'];
const BARP = new Map(), BAR_TAKEN = /Ilsa|Mira|Juno|Bastien|Hugo|Priya|Ezra|Greta|Kofi|Varga|Sato|Okonkwo|Albrecht|Moreau|Strand|Banerjee|Calloway|Lindqvist|Mbeki|Brandt/, BAR_NM = { f: NAMES.f.filter(n => !BAR_TAKEN.test(n)), l: NAMES.l.filter(n => !BAR_TAKEN.test(n)) };   /* nobody in here shares a name with the regulars or the deck crew */
/* one figure for how much machine a build is: armour, sustained and burst fire, mass */
function mechPower(c) { const st = mechStats(c), W = [c.armL && PARTS.arm[c.armL].weapon, c.armR && PARTS.arm[c.armR].weapon, c.back && PARTS.back[c.back].weapon].filter(Boolean); return Math.round(st.armor * .1 + st.fire * .35 + W.reduce((s, w) => s + w.dmg * (w.salvo || 1), 0) * .12 + st.tons * .1); }
/* the same seed is always the same pilot in the same machine, so a save only has to remember the seed */
function barPilot(seed) {
  seed = seed | 0; if (BARP.has(seed)) return BARP.get(seed);
  const R = mulberry(seed * 53 + 11), pk = a => a[(R() * a.length) | 0], f = pk(BAR_NM.f), l = pk(BAR_NM.l), call = pk(BAR_CALL), r = R(), sk = r < .2 ? 0 : r < .5 ? 1 : r < .77 ? 2 : r < .93 ? 3 : 4, base = pk(PRESETS), cfg = { ...base, paint: (R() * PAINTS.length) | 0 }; let mod = false;
  for (const s of ['armL', 'armR', 'back']) if (R() < .3) { const id = pk(Object.keys(PARTS[CAT[s]])); if (id !== cfg[s] && !mechStats({ ...cfg, [s]: id }).over) { cfg[s] = id; mod = true; } }   /* some have rearmed the stock pattern */
  if (mod) cfg.name = base.name + '-' + pk(['B', 'C', 'K', 'M', 'R', 'X']);
  const st = mechStats(cfg), pw = mechPower(cfg), S = BSK[sk], col = ['#ff9adf', '#ffd98a', '#9fe0ff', '#b8ff9a', '#ffb08a', '#d0b8ff'][(R() * 6) | 0], q = BARSV.pst[seed];
  const p = { seed, bar: true, ch: { name: `${f} "${call}" ${l}`, first: call, last: l, role: `FREELANCE PILOT · ${cfg.name}`, seed, col }, sk, skill: S[1], hpK: S[2], cfg, st, pw, mech: 0, fee: Math.round((5000 + pw * 430) * S[3] / 500) * 500, share: clamp(Math.round((.07 + pw * .0013 + sk * .022) * 100) / 100, .08, .4), until: q ? q.until : 0 };
  BARP.set(seed, p); return p;
}
/* four seats, each with a new face every 64 hours (staggered). No two in the room share a callsign or a family name */
const barRoster = () => { const R = []; for (let i = 0; i < 4; i++) { let s = ((CO.seed % 9973) * 31 + Math.floor((now() + i * 19) / 64) * 7919 + i * 613 + 17) % 1000003, p = barPilot(s); for (let n = 0; n < 9 && R.some(o => o.ch.first === p.ch.first || o.ch.last === p.ch.last); n++) p = barPilot(s += 7); R.push(p); } return R; };
/* winning at the tables buys standing in here, and pilots charge a commander they respect a little less */
const barFame = () => Math.min(.15, .03 * (BARSV.wins.drink + BARSV.wins.arm));
const barFee = p => Math.round(p.fee * (1 - barFame()) / 500) * 500;
/* drink wears off with sector time, wherever you are */
const barBuzz = () => clamp(BARSV.bz - (now() - BARSV.bzT) * .07, 0, 1);
const barBuzzAdd = d => { BARSV.bz = clamp(barBuzz() + d, 0, 1); BARSV.bzT = now(); BAR.dirty = true; };
const barState = () => { const b = barBuzz(); return (b < .08 ? 'SOBER' : b < .3 ? 'ONE DRINK IN' : b < .6 ? 'BUZZED' : b < .85 ? 'DRUNK' : 'LEGLESS') + (BARSV.rested ? ' · RESTED' : ''); };
/* what the bar sends out to the field with you */
function barSortie(real) { const b = barBuzz(); P.buzz = b > .25 ? b : 0; P.coolK = BARSV.rested ? 1.1 : 1; if (real) BARSV.rested = false; return (P.buzz ? '<br><b style="color:#ff5a1f">You are not sober. Your aim will wander.</b>' : '') + (P.coolK > 1 ? '<br><b style="color:#8dff6a">Rested: you ride the heat better — cooling +10% this sortie.</b>' : ''); }
function wingRelease() { const w = CO.wing; if (!w) return; if (!w.share) CO.cb += Math.round((w.paid || w.p.fee) * .5); CO.wing = null; CO.dirty = BAR.dirty = true; saveCO(); }
/* load the bar's share of a save: validated, because imported files are untrusted */
function barApply(s) {
  const b = (s && s.v === 2 && s.bar && typeof s.bar === 'object') ? s.bar : {}, num = (v, d, a, z) => typeof v === 'number' && isFinite(v) ? clamp(v, a, z) : d;
  BARSV.bz = num(b.bz, 0, 0, 1); BARSV.bzT = num(b.bzT, now(), 0, now()); BARSV.rested = b.rested === true; BARSV.wins = { drink: num(b.wins && b.wins.drink, 0, 0, 999) | 0, arm: num(b.wins && b.wins.arm, 0, 0, 999) | 0 };
  BARSV.told = {}; if (b.told && typeof b.told === 'object') for (const k of Object.keys(BAR_SRC)) if (typeof b.told[k] === 'number' && isFinite(b.told[k])) BARSV.told[k] = Math.min(b.told[k], now());
  BARSV.pst = {}; BARP.clear(); if (b.pst && typeof b.pst === 'object') for (const k of Object.keys(b.pst).slice(0, 12)) if (/^\d{1,7}$/.test(k) && b.pst[k] && typeof b.pst[k] === 'object') BARSV.pst[k] = { until: num(b.pst[k].until, 0, 0, now() + 96) };
  const w = s && s.wing; if (!CO.wing && w && w.i === -1 && Number.isInteger(w.s) && w.s > 0 && w.s < 1e7) { const p = barPilot(w.s); CO.wing = { p, ch: p.ch, mech: 0, cfg: p.cfg, skill: p.skill, hpK: p.hpK, share: num(w.share, 0, 0, .5), paid: num(w.paid, 0, 0, 1e7) | 0 }; }
  BAR.rosterK = ''; BAR.dirty = true; if (BAR.game) barGameDrop(); if (BAR.relax) barRelax(false);
}

/* ---- rumours: what the room knows about the offers on the board. Most of it is true ---- */
const BAR_WHO = {
  shark: (n, E) => `${n} runs that file for ${E}. A hard bargainer with no patience: one push on the fee, perhaps two, then take what is on the table.`,
  clerk: (n, E) => `${n} handles it for ${E}, strictly by the book. Will not move far on the fee — but salvage rights get signed off without a blink.`,
  zealot: (n, E) => `${n} speaks for ${E} on that one. A true believer. Ask straight out what the brief leaves unsaid: that one does not know how to lie.`,
  desperate: (n, E) => `${n} is ${E}'s contact, and out of options. It shows. Push on everything — fee, salvage, support. You will hear yes.`,
  smuggler: (n, E) => `${n} fronts it for ${E} and would sell you your own mech. Good for a higher fee if you push. Do not believe one word about the job itself.`,
};
const BAR_SRC = {
  keep: { acc: .72, cost: 150, knows: () => true },
  load: { acc: .8, cost: 150, knows: (c, k) => k === 'plot' ? ['escort', 'recovery', 'garrison', 'assault'].includes(c.type) : ['reinf', 'supply', 'pirates', 'rival', 'works'].includes(k) },
  sig: { acc: .86, cost: 150, knows: (c, k) => k === 'plot' ? ['recon', 'headhunt', 'strike', 'intercept'].includes(c.type) : ['storm', 'ace', 'side', 'air', 'worm'].includes(k) },
  broker: { acc: 1, cost: 1200, paid: true, who: true, knows: (c, k) => k === 'renege' },
  host: { acc: .82, cost: 0, knows: () => true },   /* what a beaten table boss lets slip */
};
/* the room talks about the other companies as well as the board. Each thing somebody tells you goes into that company's dossier on the command deck (STANDING) — and unlike the board talk, it is all true */
Object.assign(BAR_WHO, {
  cob: (n, E) => `That one is not ${E}'s own file — Cobalt Lance holds the paper and is passing it down. Ferreira will tell you everything she knows if you ask her, and will not move a credit on the fee.`,
  car: (n, E) => `The Carnival holds that paper for ${E} and is handing it off. Quintero is loose with the fee if you play up to him. Tight with salvage, and vague about the details.`,
  ver: (n, E) => `Verdigris picked that one up from ${E} and does not want it. Halloran will give a little on the fee and nothing at all on salvage. Check anything she tells you about the job.`,
});
function barGossip(key) { const L = []; if (key !== 'broker') for (const k of RIVS) for (const f of RIV[k].facts) if (!CO.riv[k].know.includes(f[0])) L.push([k, f]); return L; }
const barFoot = r => r.gossip ? `(Added to the ${RIV[r.gossip].name} dossier — command deck, STANDING.)` : '(Logged against the contract as bar talk — unconfirmed.)';
/* something this source has not told you yet: about a contract on the board, or about one of the companies. With peek, only whether there is anything */
function barRumour(key, peek) {
  const S = BAR_SRC[key], L = [], G = barGossip(key);
  for (const c of CO.board) {
    if (c.story) continue; const got = k => c.intel.some(i => i.k === 'r.' + k || i.k === k);
    for (const k of unknown(c)) if (!got(k) && S.knows(c, k)) L.push([c, k]);
    if (S.who) { if (!got('who')) L.push([c, 'who']); if (c !== CO.active && c.exp - now() < 16 && !got('exp')) L.push([c, 'exp']); }
  }
  if (peek) return L.length + G.length; if (!L.length && !G.length) return null;
  if (G.length && (!L.length || Math.random() < .4)) { const [rk, f] = pick(G); rivKnow(rk, f[0]); return { gossip: rk, s: f[2], head: `About ${RIV[rk].name}.` }; }
  const near = L.filter(e => e[0] === CO.sel || e[0] === CO.active), [c, k] = pick(near.length && Math.random() < .65 ? near : L), E = FAC[c.emp].short; let s;
  if (k === 'who') s = BAR_WHO[c.persona](dealer(c).name, E);
  else if (k === 'exp') s = `${rivOutfit()} has been asking about it. I would not expect that offer to be on your board in ${Math.max(2, Math.ceil(c.exp - now()))} hours.`;
  else if (Math.random() < S.acc) s = hintOf(c, k);
  else if (k === 'plot') s = HINT[`${c.type}.${pick(TYPES[c.type].plots.filter(p => p !== c.plot))}`];
  else s = HINT[pick(['reinf', 'ace', 'side', 'supply', 'renege', 'rival'].filter(t => !c.twists.includes(t)))] || hintOf(c, k);
  c.intel.push({ k: 'r.' + k, s, src: 'bar' }); CO.dirty = true; return { c, s, head: `The ${TYPES[c.type].name.toLowerCase()} job at ${c.site}, for ${E}.` };
}

/* ---- conversations ---- */
function barFocusOn(p) {
  BAR.talk = p; if (!p) { if (!BAR.game && !BAR.relax) barCam.focus = null; return; } const g = p.g.position, cam = BAR.camera.position, sh = p.seat ? p.seat.h : 0; let best = null, bs = -1e9;
  if (p.kind === 'keep') { const gap = x => Math.min(...BAR.people.filter(o => o !== p && o.g.position.z < -2.4 && o.g.position.z > -4).map(o => Math.abs(o.g.position.x - x)), 9), x = gap(g.x - .7) > gap(g.x + .7) ? g.x - .7 : g.x + .7; barCam.focus = { pos: V3(x, 1.62, -2.35), look: V3(g.x, 1.3, g.z) }; return; }
  for (let i = 0; i < 24; i++) { const a = i * TAU / 24, r = p.seat ? 1.75 : 2.2, x = g.x + Math.sin(a) * r, z = g.z + Math.cos(a) * r; if (BAR.blocked(x, z)) continue; const crowd = BAR.people.some(o => o !== p && Math.hypot(o.g.position.x - x, o.g.position.z - z) < .85) ? 3 : 0, s = -Math.abs(angDiff(a, p.yaw)) * (p.seat ? 2 : .6) - Math.hypot(cam.x - x, cam.z - z) * .05 - crowd; if (s > bs) { bs = s; best = [x, z]; } }
  if (!best) best = [g.x * .7, g.z * .7 + 1]; barCam.focus = { pos: V3(best[0], p.seat ? sh + .78 : 1.56 * p.k, best[1]), look: V3(g.x, p.seat ? sh + .52 : 1.04 * p.k, g.z) };
}
function barTalk(h) { if (BAR.relax || BAR.game) return; ({ keep: talkKeep, src: () => talkSrc(h.src), drink: () => talkHost('drink'), arm: () => talkHost('arm'), pilot: () => talkBarPilot(h.pl), extra: () => dlg(h.ch, pick(h.lines), [['Leave them to it', dlgClose]], h) })[h.kind](); }
const barTold = key => { BARSV.told[key] = now(); BAR.dirty = true; saveCO(); };
const barFresh = key => !BAR_SRC[key].paid && now() - (BARSV.told[key] ?? -99) >= 10;   /* everyone has one story in them every ten hours; after that it takes a drink */
function barTell(key, ch, H, back, lead) {
  const r = barRumour(key); if (!r) return dlg(ch, pick(['Nothing about that board I have not already told you.', 'That is all I have. Ask me after the board turns over.']), back, H);
  barTold(key); tal('b.rum'); dlg(ch, `${lead}\n\n${r.head} ${r.s}\n\n${barFoot(r)}`, back, H);
}
function talkKeep() {
  const k = BARC.keep, H = BAR.P.keep, back = [['Something else', talkKeep], ['Thanks, Mother', dlgClose]], fresh = barFresh('keep'), has = barRumour('keep', true), R = barRoster();
  const pour = (cost, d, line) => () => { if (!spend(cost, 'bar')) return dlg(k, 'Not on the slate. Not for you, not for anyone.', back, H); tal('b.drink'); barBuzzAdd(d); sfx.play(d > 0 ? 'glass' : 'ui'); dlg(k, line, back, H); };
  dlg(k, pick(['Commander. The usual, or are you here to listen?', 'Sit anywhere that is not already bleeding.', 'Upstairs you sign their contracts. Down here you buy the rounds.']), [
    [!has ? 'What are people saying? (nothing new)' : fresh ? 'What are people saying?' : `Buy a drink and ask what people are saying — ${fmt(150)}`, () => { if (!fresh) { if (!spend(150, 'bar')) return dlg(k, 'Not on the slate.', back, H); tal('b.drink'); barBuzzAdd(.12); sfx.play('glass'); } barTell('keep', k, H, back, pick(['You did not hear it from me.', 'Three people told me this tonight, which means one person started it.', 'Loadmasters talk when they drink. I only pour.'])); }, !has],
    [`Stand the house a round — ${fmt(900)}`, () => { if (!spend(900, 'bar')) return dlg(k, 'A round for this room costs more than you are carrying.', back, H); tal('b.round'); tal('b.drink'); BARSV.told = {}; barBuzzAdd(.12); sfx.play('glass'); BAR.dirty = true; saveCO(); dlg(k, 'That buys you a room full of friends for about an hour. Strand and Banerjee will talk to you again now — ask around.', back, H); }],
    [`Something strong — ${fmt(150)}`, pour(150, .16, pick(['Reactor coolant, the regulars call it. It is not, quite.', 'There. Do not operate heavy machinery. I am told you own some.']))],
    [`Black coffee — ${fmt(50)}`, pour(50, -.22, 'On the house rate. Drink it slowly and stop looking at Ballast.')],
    ['Who is in tonight?', () => dlg(k, `${R.map(p => `${p.ch.first} — ${BSK[p.sk][0].toLowerCase()}, flies ${/^[AEIOU]/.test(p.cfg.name) ? 'an' : 'a'} ${p.cfg.name}`).join('. ')}. All four fly for money; the better the pilot and the bigger the machine, the more of it.\nBallast will drink you under her table for a stake, and Vise will take your arm off for the same. Strand loads the dropships, Banerjee listens to bands she should not, and Calloway in the booth knows every contact on your board.`, back)],
    ['Thanks, Mother', dlgClose]], H);
}
/* the tip jar on the counter, and its button at the foot of the column. It is the one thing in the game that asks for real money, so Mother says so in as many words before
   anything opens, and it opens in a tab of its own: the game stays where it is */
const TIP_URL = 'https://ryangraham.ca/donate';
function talkTip() {
  if (BAR.relax || BAR.game) return; const k = BARC.keep, H = BAR.P.keep;
  dlg(k, 'The jar? Not mine, and not the house\'s. It goes to whoever built this place: the bar, the yard upstairs, every machine in it. It does not take credits, Commander. That one is real money, out of your own pocket, and nobody in here thinks less of anybody who walks past it.', [
    ['Put something in the jar — opens ryangraham.ca/donate in a new tab ↗', () => { tal('b.tip'); try { window.open(TIP_URL, '_blank', 'noopener'); } catch (e) { } dlg(k, pick(['Then that is one round I did not have to pour. Thank you, Commander.', 'I will see it gets where it is going. Thank you.']) + '\nIt has opened beside this one. If your browser kept it shut, the address is on the card: ryangraham.ca/donate', [['Any time, Mother', dlgClose]], H); }],
    ['Not tonight', dlgClose]], H);
}
function talkSrc(key) {
  const S = BAR_SRC[key], ch = BARC[key], H = BAR.P[key], back = [['Something else', () => talkSrc(key)], ['Leave', dlgClose]], fresh = barFresh(key), has = barRumour(key, true);
  const T = {
    load: { hi: ['Strand. I load the lifters. You would be amazed what people ship and call ore.', 'If it goes up on a dropship from this rock, it went past me first.'], ask: 'What have you been loading lately?', buy: 'Buy Strand a drink and ask again', lead: ['I saw the manifest. Well — I saw what they let me see.', 'We staged a lifter for that one. I can count, and I counted.'], chat: ['Fuel, shells and coffins. In that order, by weight.', 'Your Chief still owes me a crate of actuator seals. Tell Dutch I said so.'] },
    sig: { hi: ['Banerjee. Signals, when I am on shift. Off shift I still hear things.', 'You are the one with the mech bay upstairs. Your uplink is slow, by the way.'], ask: 'What is on the air?', buy: 'Buy Banerjee a drink and ask again', lead: ['I am not supposed to listen to that band. I listen to that band.', 'Picked this up on the night shift. Make of it what you like.'], chat: ['Everyone encrypts the orders. Nobody encrypts the complaining.', 'Somebody is jamming the southern band again. It is not us. I asked.'] },
    broker: { hi: ['Calloway. I introduce people who need something broken to people who break things. Information is extra.', 'Commander. I know who is behind every name on your board. That knowledge has a price, like everything in here.'], ask: '', buy: 'Pay for a name: who am I dealing with on the board?', lead: ['Since you are paying.', 'This one is worth the fee.'], chat: ['I do not drink. I invoice.', 'Rumour is free and worth it. What I sell is who signs, who stalls and who does not pay.'] },
  }[key];
  dlg(ch, pick(T.hi), [
    [!has ? `${T.ask || T.buy} (nothing new)` : fresh ? T.ask : `${T.buy} — ${fmt(S.cost)}`, () => { if (!fresh) { if (!spend(S.cost, 'bar')) return dlg(ch, key === 'broker' ? 'Then we have nothing to discuss tonight.' : 'Next time, then.', back, H); if (!S.paid) sfx.play('glass'); } barTell(key, ch, H, back, pick(T.lead)); }, !has],
    ['Just talk', () => dlg(ch, pick(T.chat), back, H)],
    ['Leave', dlgClose]], H);
}
function talkBarPilot(p) {
  const ch = p.ch, H = BAR.pil.find(h => h.pl === p) || null, S = BSK[p.sk], fee = barFee(p), st = p.st, c = p.cfg, back = [['Back', () => talkBarPilot(p)], ['Leave', dlgClose]], bye = [['Leave', dlgClose]];
  const sheet = `PILOT ${pipStr(p.sk + 1)} ${S[0]}   ·   ${c.name}, ${st.cls} ${st.tons.toFixed(0)} t   ·   MECH POWER ${p.pw}`;
  if (p.until > now()) return dlg(ch, 'Still being patched up after the last drop with you. Ask me in a couple of days.', bye, H);
  if (CO.wing && CO.wing.p === p) return dlg(ch, 'I am already on your ticket. Changed your mind?', [['Stand down — I fly without you', () => { const flat = !CO.wing.share; wingRelease(); dlg(ch, flat ? 'Your call. I am keeping half the retainer.' : 'Your call.', bye, H); }], ['No. Be ready', dlgClose]], H);
  if (CO.wing) return dlg(ch, `You already have ${CO.wing.ch.first} on your ticket. A dropship carries two machines, not three.`, [[`Release ${CO.wing.ch.first} and talk terms`, () => { wingRelease(); talkBarPilot(p); }], ['Leave it as it is', dlgClose]], H);
  const hire = share => { if (!share && !spend(fee, 'pilot')) return dlg(ch, 'Come back when you can cover the retainer.', back, H); tal('q.hire'); CO.wing = { p, ch, mech: 0, cfg: p.cfg, skill: p.skill, hpK: p.hpK, share: share ? p.share : 0, paid: share ? 0 : fee }; CO.dirty = BAR.dirty = true; saveCO(); sfx.play('ok'); dlg(ch, share ? `${Math.round(p.share * 100)} percent of the fee, then. I will have the ${c.name} on the lifter when you launch.` : `Paid up front. The ${c.name} will be on your wing at launch.`, bye, H); };
  const line = [['Two drops in a simulator and one that counted. I am cheap, and I do what I am told.', 'Everyone starts somewhere. I would like to start somewhere that pays.'], ['I show up, I shoot what you point at, I go home. The rate is the rate.', 'Nothing fancy. I have brought the machine back every time so far.'], ['Nine seasons. I have flown for three of the factions on your board and against all five.', 'I know when to push and when to walk backwards shooting. That is what you are paying for.'], ['I do not miss much, and I do not come cheap. You have seen the numbers.', 'Pick the hard contract. With me on your wing it is not.'], ['You know the callsign. That is what the retainer is for.', 'I choose my commanders. Tonight I am thirsty enough to choose you.']][p.sk][p.seed % 2];
  const wn = k => c[k] ? (k === 'back' ? PARTS.back[c.back].name : PARTS.arm[c[k]].name) : 'nothing';
  dlg({ ...ch, role: `${ch.role} · ${S[0]}` }, `${line}\n\n${sheet}`, [
    [`Hire for the next contract — flat ${fmt(fee)}${barFame() ? ` (house standing −${Math.round(barFame() * 100)}%)` : ''}`, () => hire(false)],
    [`Offer ${Math.round(p.share * 100)}% of the contract fee instead`, () => hire(true)],
    ['What do you fly?', () => dlg(ch, `${/^[AEIOU]/.test(c.name) ? 'An' : 'A'} ${c.name}: ${PARTS.legs[c.legs].name} under a ${PARTS.torso[c.torso].name}, ${wn('armL')} left, ${wn('armR')} right, ${wn('back')} on the back. ${st.tons.toFixed(0)} tons, ${st.armor} armor, ${st.fire.toFixed(0)} damage a second, ${(st.speed * RUN * 3.6).toFixed(0)} kph flat out.${c.name.includes('-') ? ' Not the stock pattern. I had her rearmed.' : ''}`, back, H)],
    ['Not today', dlgClose]], H);
}

/* ---- the panels ---- */
function barDraw() {
  BAR.dirty = false; const R = barRoster(), fame = barFame(), cond = barBuzz();
  /* the regulars are the buttons along the bottom (#barBar, as the crew are on the deck): what each has for you just now rides the top edge of theirs */
  const chip = (k, st, dim) => talkChip($('barBar').querySelector(`[data-k="${k}"]`), st, dim ? 'dim' : '');
  for (const k of ['keep', 'load', 'sig', 'broker']) { const n = barRumour(k, true); chip(k, !n ? 'NOTHING NEW' : barFresh(k) ? 'HAS A STORY' : fmt(BAR_SRC[k].cost), !n); }
  for (const k of ['drink', 'arm']) chip(k, BARSV.wins[k] ? `${BARSV.wins[k]} WON` : 'UNBEATEN', !BARSV.wins[k]);
  $('barHireN').textContent = fame ? `HOUSE STANDING −${Math.round(fame * 100)}%` : 'FLAT FEE OR A SHARE';
  $('barPil').innerHTML = R.map((p, i) => { const on = CO.wing && CO.wing.p === p, out = p.until > now(); return `<div class="bcard${on ? ' on' : ''}${out ? ' out' : ''}" data-i="${i}"><canvas width="72" height="72"></canvas><div><b>${p.ch.name}</b><small><span style="color:${p.ch.col}">${BSK[p.sk][0]}</span> <span class="pips">${pipStr(p.sk + 1)}</span> · ${p.cfg.name} · ${p.st.cls} ${p.st.tons.toFixed(0)} t</small><div class="bpw"><i style="width:${clamp(p.pw / 110, .05, 1) * 100}%"></i></div><small>MECH POWER ${p.pw} · ARMOR ${p.st.armor} · ${p.st.fire.toFixed(0)} DPS</small></div><em>${on ? 'ON YOUR<br>WING' : out ? 'MED<br>BAY' : `${fmt(barFee(p))}<small>or ${Math.round(p.share * 100)}% share</small>`}</em></div>`; }).join('');
  $('barPil').querySelectorAll('.bcard').forEach((d, i) => { drawFace(d.querySelector('canvas'), R[i].ch); d.onclick = () => { sfx.play('ui'); talkBarPilot(R[i]); }; });
  $('bbRelax').disabled = $('bbTip').disabled = !!BAR.game; BAR.drawWall(); barStat();
}
function barStat() {
  const h = Math.floor(CO.hour), b = barBuzz(); $('barStat').innerHTML = `<div><span>FUNDS</span><b>${fmt(CO.cb)}</b></div><div><span>SECTOR TIME</span><b>DAY ${CO.day} · ${String(h).padStart(2, '0')}:${String(Math.floor((CO.hour - h) * 6) * 10).padStart(2, '0')}</b></div><div><span>CONDITION</span><b style="color:${b > .6 ? '#ff5a1f' : b > .25 ? '#ffb21a' : BARSV.rested ? '#8dff6a' : ''}">${barState()}</b></div><div><span>WING</span><b>${CO.wing ? CO.wing.ch.first.toUpperCase() : 'SOLO'}</b></div>`;
  if (BAR.relax) { const n = now() - BAR.rest0; $('barChill').innerHTML = `<b>TAKING IT EASY</b> — ${n < 1 ? 'just sat down' : n.toFixed(0) + ' h in the booth'} · ${barState()}<br><small>${n >= 4 && b < .25 ? 'You are rested. ' : b >= .25 ? 'Sobering up. ' : 'Four hours here and you leave rested. '}The board keeps moving while you sit. CLICK or any key to get up.</small>`; }
}
function barTags() {
  const host = $('barTags'); host.innerHTML = ''; BAR.tagL = [];
  for (const h of BAR.people) { const d = document.createElement('div'); d.className = 'tag'; d.innerHTML = `<span>${(h.kind === 'pilot' ? `${h.pl.ch.first} · ${BSK[h.pl.sk][0]}` : h.ch.name).toUpperCase()}</span>`; d.style.color = h.ch.col; d.onclick = () => { sfx.play('ui'); barTalk(h); }; host.appendChild(d); BAR.tagL.push({ d, h }); }
}
/* put this week's four freelancers in their seats. Figures are built from the pilot's seed, like everyone else */
function barSync() {
  const R = barRoster(), key = R.map(p => p.seed).join(); if (key === BAR.rosterK) return; BAR.rosterK = key;
  for (const h of BAR.pil) { BAR.crowd.remove(h); h.dispose(); BAR.people.splice(BAR.people.indexOf(h), 1); }
  BAR.pil = R.map((p, i) => {
    const S = BAR.pilSpot[i], h = barPerson(p.ch, S.x, S.z, S.yaw, 'pilot', 'pilot', { props: i !== 1 ? { r: 'mug' } : null }); h.pl = p;
    if (S.o) { const acts = [['perch', 9, 18, { ...S.o }], ['perch', 7, 13, { ...S.o, mode: S.o.mode === 'fwd' ? 'back' : 'fwd' }]]; h.brain = h => barStay(h, acts, i === 2 ? BAR.P.keep : null); }
    else h.brain = h => barStay(h, [['sip', 9, 16], ['watch', 6, 12], ['hips', 5, 9]], { x: 7.5, y: 1.2, z: -5.4 });
    h.co = h.brain(h); return h;
  });
  barTags(); BAR.dirty = true;
}

/* ---- resting: take the booth and let the clock run ---- */
function barRelax(on) {
  if (on === BAR.relax || (on && (BAR.game || mode !== 'bar'))) return; BAR.relax = on; $('barUI').classList.toggle('chill', on);
  if (on) { dlgClose(); BAR.rest0 = now(); barCam.focus = { pos: V3(-8.45, 1.2, 2.4), look: V3(1, 1.05, -2.6) }; sfx.play('ui'); }
  else { barCam.focus = null; tal('b.rest', Math.max(0, now() - BAR.rest0)); if (now() - BAR.rest0 >= 4 && barBuzz() < .25) BARSV.rested = true; saveCO(); }
  BAR.dirty = true; barStat();
}

function updateBar(dt, t) {
  if (BAR.relax && !dlgCur) tickClock(dt * 11);   /* an hour of sector time every second or so */
  if (dlgCur) { dlgCur.t += dt; const n = Math.floor(dlgCur.t * 95); $('dlgTxt').textContent = dlgCur.text.slice(0, n); BAR.speaking = n < dlgCur.text.length || vox.busy(); } else BAR.speaking = false;
  if (BAR.game) barGameTick(dt, t);
  const W = BAR.crowd; W.cam.copy(BAR.camera.position); W.talk = BAR.talk; W.speaking = BAR.speaking; W.beat = music.beat(); W.update(dt); if (BAR.game) barGamePose(BAR.game);
  /* the jukebox keeps time; the sign has a tube that is on its way out */
  const b = W.beat, pulse = b < 0 ? 0 : Math.pow(1 - b, 3); BAR.jukeA.emissiveIntensity = 1.5 + 2.4 * pulse; BAR.jukeB.emissiveIntensity = 1.1 + 1.2 * Math.max(0, Math.sin(t * 1.3)); BAR.jukeC.emissiveIntensity = 1 + .5 * Math.sin(t * 2.1); BAR.jukeL.intensity = 5 + 6 * pulse;
  BAR.sign.color.setScalar(Math.sin(t * 37) > .96 && Math.sin(t * 1.7) > .5 ? 1.2 : 2.1);
  if ((BAR.glassT -= dt) < 0) { BAR.glassT = rand(5, 14); sfx.play('glass', .35); }
  BAR.fill.position.copy(BAR.camera.position); BAR.fill.position.y += .3; BAR.fill.intensity = damp(BAR.fill.intensity, BAR.talk ? 4 : 0, 4, dt);
  if ((BAR.clk -= dt) < 0) { BAR.clk = BAR.relax ? .25 : 1; if (!dlgCur && !BAR.game) { barSync(); if ((BAR.clk2 = (BAR.clk2 || 0) + 1) % 6 === 0 && !BAR.relax) BAR.dirty = true; } barStat(); }
  if (BAR.dirty && !BAR.game) barDraw();
  /* camera: an orbit of the room, or whoever is talking, or the seat you are in */
  const C = barCam, f = C.focus, sp = Math.sin(C.ph);
  if (f) { C.pos.copy(f.pos); C.look.copy(f.look); if (BAR.relax) C.look.set(1 + Math.sin(t * .09) * 4.5, 1.05 + Math.sin(t * .13) * .12, -2.6); }
  else { C.look.set(-1, 1.2, -1.5); C.pos.set(clamp(-1 + C.r * sp * Math.sin(C.th), -8.4, 8.4), clamp(1.2 + C.r * Math.cos(C.ph), 1.15, 3.45), clamp(-1.5 + C.r * sp * Math.cos(C.th), -2.9, 6.05)); }
  C.cPos.lerp(C.pos, 1 - Math.exp(-3.5 * dt)); C.cLook.lerp(C.look, 1 - Math.exp(-4 * dt)); BAR.camera.position.copy(C.cPos); BAR.camera.lookAt(C.cLook); BAR.camera.updateMatrixWorld();
  for (const g of BAR.tagL) { g.h.head.getWorldPosition(_v); _v.y += .3; _v.project(BAR.camera); const vis = !dlgCur && !BAR.game && !BAR.relax && _v.z < 1 && Math.abs(_v.x) < 1.05 && Math.abs(_v.y) < 1.05; g.d.style.display = vis ? '' : 'none'; if (vis) { g.d.style.left = (_v.x * .5 + .5) * 100 + '%'; g.d.style.top = (-_v.y * .5 + .5) * 100 + '%'; } }
}

/* ---- getting there and back ---- */
async function toBar() {
  if (busy || (mode !== 'hq' && mode !== 'hangar')) return; busy = true; if (mode === 'hangar') refreshUI(); else dlgClose(); sfx.play('servoDn'); blackout(true); await tween(.55, fade);
  barBuild(); $('hqUI').classList.add('hid'); $('hangarUI').classList.add('hid'); $('barUI').classList.remove('hid'); mode = 'bar'; barCam.focus = null; BAR.talk = null; barCam.cPos.set(6.6, 1.9, 6.05); barCam.cLook.set(2.5, 1.4, 0); barSync(); BAR.dirty = true; barDraw();
  busy = false; await tween(.8, k => fade(1 - k)); blackout(false);
}
async function barLeave(to) {
  if (busy || mode !== 'bar' || BAR.game) return; busy = true; barRelax(false); dlgClose(); sfx.play('servo'); blackout(true); await tween(.55, fade); $('barUI').classList.add('hid'); saveCO();
  if (to === 'hq') { showHQ(); hq.cPos.set(8, 2.4, -7.6); hq.cLook.set(0, 1.6, 0); busy = false; }
  else { mode = 'hangar'; $('hangarUI').classList.remove('hid'); for (const id of ['panelL', 'panelR', 'hint', 'status']) $(id).classList.remove('hid'); orb.cine = false; orb.idle = 0; orb.cPos.set(0, 21.5, 44); orb.cLook.set(0, 14, 0); busy = false; refreshUI(); renderHangarContract(); setStatus(CO.active ? `CONTRACT SIGNED — ${CO.active.site.toUpperCase()} · FIT OUT AND LAUNCH` : 'STAND READY — ' + mechName); }
  await tween(.8, k => fade(1 - k)); blackout(false);
}
{
  const cv = $('gl'), rc = new THREE.Raycaster(), m2 = new THREE.Vector2(); let btn = -1, px = 0, py = 0, moved = 0;
  cv.addEventListener('pointerdown', e => { if (mode !== 'bar') return; btn = e.button; px = e.clientX; py = e.clientY; moved = 0; });
  cv.addEventListener('pointermove', e => { if (mode !== 'bar' || btn < 0) return; const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; moved += Math.abs(dx) + Math.abs(dy); if (barCam.focus) return; barCam.th -= dx * .005; barCam.ph = clamp(barCam.ph - dy * .004, 1, 1.52); });
  cv.addEventListener('pointerup', e => {
    if (mode !== 'bar') return; btn = -1; if (BAR.relax) return barRelax(false); if (moved > 6 || dlgCur || BAR.game) return; m2.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); rc.setFromCamera(m2, BAR.camera);
    const h = rc.intersectObjects(BAR.people.map(p => p.hit))[0], jar = BAR.tip ? rc.intersectObject(BAR.tip)[0] : null; if (jar && (!h || jar.distance < h.distance)) { sfx.play('ui'); talkTip(); } else if (h) { sfx.play('ui'); barTalk(h.object.userData.p); }
  });
  cv.addEventListener('wheel', e => { if (mode !== 'bar' || barCam.focus) return; e.preventDefault(); barCam.r = clamp(barCam.r * (1 + Math.sign(e.deltaY) * .07), 3.5, 10.5); }, { passive: false });
  addEventListener('keydown', e => { if (mode !== 'bar' || !BAR.relax || uiModal()) return; e.preventDefault(); barRelax(false); });
  $('bbHQ').onclick = () => barLeave('hq'); $('bbBay').onclick = () => barLeave('hangar'); $('bbRelax').onclick = () => barRelax(true); $('bbSet').onclick = () => { sfx.play('ui'); settingsOpen(); }; $('bbTip').onclick = () => { sfx.play('ui'); talkTip(); };
  $('barChill').onclick = () => barRelax(false); $('btnToBar').onclick = toBar; $('btnBar').onclick = toBar;
  for (const b of $('barBar').children) b.onclick = () => { sfx.play('ui'); barTalk(BAR.P[b.dataset.k]); };
}
barApply(BOOT);

