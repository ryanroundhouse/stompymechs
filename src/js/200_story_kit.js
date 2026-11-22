/* ============ STORY KIT: THE PEOPLE THE THREADS ARE ABOUT, AND THE SET PIECES THEIR CHAPTERS NEED ============ */
/* a named character's looks are said, not drawn from the seed: hair colour, hair style (0 cropped, 1 long, 2 flat top, 3 knot, 4 none), the one extra ('beard', 'glasses', 'headset', 'scar' or none), skin.
   They go in the character's CAST entry, which both the portrait (drawFace) and the figure (lookOf) read */
function stLook(hair, st, x, skin) { return { hair, st, beard: x === 'beard', glasses: x === 'glasses', headset: x === 'headset', scar: x === 'scar', ...(skin ? { skin } : {}) }; }
/* the portrait of somebody who is not a person: a survey machine's sensor head, one lamp, lit */
function stBotFace(g, col) {
  g.fillStyle = '#1a2026'; g.beginPath(); g.moveTo(6, 72); g.lineTo(16, 55); g.lineTo(56, 55); g.lineTo(66, 72); g.fill(); g.fillStyle = '#2a323a'; g.fillRect(29, 46, 14, 10); g.fillStyle = '#0f1418'; for (let y = 48; y < 55; y += 3) g.fillRect(29, y, 14, 1);
  g.fillStyle = '#3a444e'; g.beginPath(); g.moveTo(16, 14); g.lineTo(56, 14); g.lineTo(61, 22); g.lineTo(61, 40); g.lineTo(54, 47); g.lineTo(18, 47); g.lineTo(11, 40); g.lineTo(11, 22); g.closePath(); g.fill();
  g.fillStyle = '#4b5762'; g.fillRect(16, 14, 40, 5); g.fillStyle = '#242b32'; g.fillRect(13, 24, 4, 14); g.fillRect(55, 24, 4, 14); g.fillStyle = '#12171b'; g.beginPath(); g.arc(36, 31, 12.5, 0, TAU); g.fill();
  const gr = g.createRadialGradient(36, 31, 1, 36, 31, 11); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.3, col); gr.addColorStop(1, col + '22'); g.fillStyle = gr; g.beginPath(); g.arc(36, 31, 10.5, 0, TAU); g.fill();
  g.strokeStyle = '#5d6b78'; g.lineWidth = 1.5; g.beginPath(); g.arc(36, 31, 12.5, 0, TAU); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1; g.beginPath(); g.arc(36, 31, 7.5, PI * 1.1, PI * 1.5); g.stroke();
  g.fillStyle = '#6d7b88'; for (const [x, y] of [[15, 18], [57, 18], [15, 43], [57, 43]]) g.fillRect(x - 1, y - 1, 2, 2); g.fillStyle = '#3a444e'; g.fillRect(49, 4, 2, 10); g.fillStyle = col; g.fillRect(48, 2, 4, 3);
  g.fillStyle = col; g.globalAlpha = .7; for (let i = 0; i < 5; i++) g.fillRect(22 + i * 6, 42, 4, 1.5); g.globalAlpha = 1;
}
const STC = {
  mav: { name: 'MAVIS', first: 'Mavis', last: 'MAVIS', role: 'ONBOARD INSTRUCTOR · PALLISTER ACADEMY', seed: 9201, col: '#ff9ad0' },
  snips: { name: '"Snips" Halvard', first: 'Snips', last: 'Halvard', role: 'RED MAW · SALVAGE FOREMAN', seed: 9203, col: '#ff5a3a' },
  ma: { name: 'Mayor Hester "Ma" Oyelaran', first: 'Hester', last: 'Oyelaran', role: 'MARIGOLD · MAYOR AND DRIVER', seed: 9101, col: '#ffc94a' },
  pip: { name: 'Pip Oyelaran', first: 'Pip', last: 'Pip', role: 'MARIGOLD · RADIO, AGE ELEVEN', seed: 9103, col: '#ffe9a0' },
  hale: { name: 'Assessor Corwin Hale', first: 'Corwin', last: 'Hale', role: 'VANCE-OKORO · ASSET RECOVERY', seed: 9107, col: '#ffb21a' },
  und: { name: 'Lucien "the Understudy" Vey', first: 'Lucien', last: 'Vey', role: 'FORMERLY OF THE CARNIVAL', seed: 9121, col: '#b48cff' },
  dex: { name: 'Dex Halloway', first: 'Dex', last: 'Halloway', role: 'THE CARNIVAL · VOICE OF THE SHOW', seed: 9123, col: '#ffd24a' },
  lan: { name: 'LANTERN', first: 'Lantern', last: 'Lantern', role: 'SURVEY MECH · AUTOPILOT', seed: 9141, col: '#9fe8ff' },
  abb: { name: 'Brother-Mechanic Ozias Thorne', first: 'Ozias', last: 'Thorne', role: 'ORDO FERRUM · KEEPER OF THE VIGIL', seed: 9143, col: '#c9a0ff' },
  cas: { name: 'Director Sabine Castellan', first: 'Sabine', last: 'Castellan', role: 'HELION COMBINE · SPECIAL RECOVERY', seed: 9145, col: '#5fd8ff' },
  liz: { name: '"Tin Lizzie" Brandt', first: 'Lizzie', last: 'Lizzie', role: 'IRON DERBY · CAR 7', seed: 9161, col: '#ff9a3a' },
  bar: { name: 'Baron Viktor Drescher', first: 'Viktor', last: 'Drescher', role: 'IRON DERBY · REIGNING CHAMPION', seed: 9163, col: '#e8e0c8' },
  krait: { name: '"Mother" Sabela Krait', first: 'Sabela', last: 'Krait', role: 'RED MAW · THE LAST SERMON', seed: 9181, col: '#ff3a2a' },
  brick: { name: 'Sgt. Bo "Brick" Adeyemi', first: 'Brick', last: 'Adeyemi', role: 'TYR MILITIA · HARROW VALE', seed: 9183, col: '#8dff6a' },
  deacon: { name: 'The Deacon', first: 'Deacon', last: 'Deacon', role: 'RED MAW · KRAIT\'S RIGHT HAND', seed: 9185, col: '#ff7a5a' },
};
const stDist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const stAng = (a, b) => Math.atan2(b.x - a.x, b.z - a.z);
const stOff = (p, a, r) => [p.x + Math.sin(a) * r, p.z + Math.cos(a) * r];
/* a line that the script waits on: resolves once it has been read (or has timed out, with holding off) */
const tell = (who, text) => comm(who, text);
/* armour put back on in the field, by whoever is in a position to do it */
const stMend = (k, why) => { if (P.dead) return; P.armor = Math.min(P.max, P.armor + P.max * k); msg(why || 'FIELD REPAIRS APPLIED', 3); sfx.play('ok'); };
/* money that moves in the field without being a bonus */
const stPay = (label, amt) => { MS.bonus.push([label, Math.round(amt)]); msg(`${label.toUpperCase()} — ${fmt(amt)}`, 3); };
/* hostiles from a known direction: around the point r metres from `at` on bearing a. o.focus: what half of them go for */
function stFrom(k, at, a, r, o = {}) { const [x, z] = stOff(at, a, r), [gx, gz] = groundSpot(x, z, 0, 40), W = foes(k, gx, gz, 0, 34, o); W.forEach((e, i) => { e.alert = true; if (o.focus && i % 2 === 0) e.focus = o.focus; }); return W; }
/* a named machine, and one built bigger than anything in the catalogue */
const stMech = (p, cfg, team, o) => mkMech(p.x, p.z, cfg, team, o);
function stBig(e, s, hpK = 1) { e.obj.scale.setScalar(s); e.cy *= s; e.r *= s; e.hp *= hpK; e.max = e.hp; e.big = s; return e; }
/* points every `gap` metres along the line through these places: what a convoy, or a town, drives along */
function stRoad(pts, gap = 40) { const out = []; for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.round(stDist(a, b) / gap)); for (let j = 1; j <= n; j++) out.push(gpos(lerp(a.x, b.x, j / n), lerp(a.z, b.z, j / n))); } return out; }
/* a landmark that can be seen from across the theatre: a pillar of light */
const ST_BEAM = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true);
function stBeam(p, col, h = 150, w = 1.6) { const m = new THREE.Mesh(ST_BEAM, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .2, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); m.position.set(p.x, p.y + h / 2, p.z); m.scale.set(w, h, w); FD.scene.add(m); FD.misc.push(m); return m; }
function stGone(o) { FD.scene.remove(o); const i = FD.misc.indexOf(o); if (i >= 0) FD.misc.splice(i, 1); }
/* a survey beacon: tripod, lamp, and its pillar */
function stBeacon(p, col = 0x7fe7ff) { const g = grp(FD.scene, p.x, p.y, p.z), m = glowMat(col, 4); for (let i = 0; i < 3; i++) cyl(g, M.girder, .12, .12, 5, Math.sin(i * 2.1) * 1.2, 2.3, Math.cos(i * 2.1) * 1.2, Math.cos(i * 2.1) * .45, 0, -Math.sin(i * 2.1) * .45, 6); box(g, M.dark, 1.2, 1.4, 1.2, 0, 4.6, 0); noShadow(sph(g, m, .7, 0, 6, 0)); FD.misc.push(g); g.userData.beam = stBeam(p, col, 130, 1.1); g.userData.lamp = m; return g; }
/* a race gate: two pylons and a bar of light between them, square to the heading */
function stGate(p, yaw, col = 0xffb21a, w = 30) {
  const g = grp(FD.scene, p.x, p.y, p.z, 0, yaw, 0), m = glowMat(col, 3.2); for (const s of [-1, 1]) { cyl(g, M.girder, 1, 1.5, 22, s * w / 2, 11, 0, 0, 0, 0, 8); noShadow(box(g, m, .5, 16, .5, s * (w / 2 - 1.3), 12, 0)); box(g, M.hazard, 3.4, 1.4, 3.4, s * w / 2, .7, 0); circ(p.x + Math.cos(yaw) * s * w / 2, p.z - Math.sin(yaw) * s * w / 2, 1.8, p.y + 22); }
  noShadow(box(g, m, w, .7, .5, 0, 21.4, 0)); FD.misc.push(g); g.userData.lamp = m; g.userData.beam = stBeam(p, col, 150, 1.4); return g;
}
/* fireworks, for those occasions */
function stFire(x, y, z, r = 1, g = .8, b = .3, n = 70, pow = 24) { for (let i = 0; i < n; i++) { const a = rand(TAU), e = rand(-1, 1), c = Math.sqrt(1 - e * e), v = pow * rand(.6, 1); FD.fx.spark.emit(x, y, z, Math.cos(a) * c * v, e * v, Math.sin(a) * c * v, rand(1, 2), rand(.5, .9), r * 5, g * 5, b * 5, 1, 7, .9); } if (Math.hypot(x - P.pos.x, z - P.pos.z) < 500) sfx.play('crack', .6); }
const stShow = (p, n = 5, h = 60) => { for (let i = 0; i < n; i++) { const c = pick([[1, .3, .5], [1, .8, .3], [.4, .8, 1], [.6, 1, .5], [1, 1, 1]]); FD.tick.push((() => { let t = i * .35 + rand(.2); return dt => { if ((t -= dt) > 0) return true; stFire(p.x + rand(-40, 40), p.y + h + rand(-12, 20), p.z + rand(-40, 40), ...c); return false; }; })()); } };
/* things that happen every frame until told otherwise: fn(dt) returns false to stop */
const stTick = fn => { FD.tick.push(fn); };
/* stand somewhere for a while: an objective with a clock that only runs while you are inside the ring */
async function stHold(id, p, r, secs, text) { let t = 0; setObj(id, () => `${text} — ${t >= secs ? 'done' : stBar(t / secs * 100)}`); await new Promise(res => stTick(dt => { if (MS.over) return false; if (near(p, r) && !P.dead) t += dt; if (t >= secs) { res(); return false; } return true; })); setObj(id, null, 1); }

/* machines that give up rather than die: at k of its armour each strikes its colours, is out of the fight and walks off the map. cb(e) is told as each one goes; the function it returns says how many have.
   Nothing stops a heavy round finishing one of them first, and that is the point: where a script uses this, a kill is somebody's fault */
function stYield(L, k = .35, cb) { let n = 0; stTick(() => { if (MS.over) return false; let left = 0; for (const e of L) { if (e.dead || e.out) continue; left++; if (e.hp > e.max * k) continue; n++; Object.assign(e, { inv: true, pacify: true, out: true, focus: null }); if (e.mech) leave([e]); else e.team = 2; if (cb) cb(e); } return left > 0; }); return () => n; }
/* a clock the HUD shows in an objective line */
const stClock = s => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
/* the player's trigger pulls: a cooldown that has gone up is a round gone out. T.n is how many there have been, T.t when the last was */
function stTrig() { const T = { n: 0, t: -1e9 }, c = {}; stTick(() => { if (MS.over) return false; for (const k in P.cd) { if (P.cd[k] > (c[k] || 0) + .001) { T.n++; T.t = MS.t; } c[k] = P.cd[k]; } return true; }); return T; }
/* a line on the ground r metres from p: how close is too close, or where to stand. It is a mesh like any other; move it by its position */
function stRing(p, r, hex = 0xffb21a, glow = 2.2) { const m = new THREE.Mesh(GEO.ring, glowMat(hex, glow));   /* glow: about 1 by night, where 2.2 burns out to white */ m.position.set(p.x, heightAt(p.x, p.z) + .6, p.z); m.scale.setScalar(r); FD.scene.add(m); FD.misc.push(m); POST.kick(); return m; }
/* ---- MARIGOLD: a mining crawler with a town on its back. Forty-six metres of track, tin roofs, washing lines and one very large drill-laser. It follows a road, crushes what it meets, and — it turns out — can stand up ---- */
function stCrawler(at, path, o = {}) {
  const g = grp(FD.scene, at.x, at.y, at.z), hull = grp(g), lit = glowMat(0xffc56a, 2.2), glass = std({ color: 0x3fae7a, transparent: true, opacity: .45, roughness: .1, metalness: .2, emissive: 0x0c3a22, emissiveIntensity: .8 });
  const wallM = [M.rust, M.blue, EM.corr, M.yellow, M.red], yaw0 = path.length ? stAng(at, path[0]) : 0;
  for (const s of [-1, 1]) { box(hull, M.black, 5, 4, 45, s * 9.5, 2, 0); box(hull, M.girder, 5.6, .8, 46.5, s * 9.5, 4.2, 0); box(hull, M.rust, .5, 3, 42, s * 12.3, 2.6, 0); for (let i = -3; i <= 3; i++) cyl(hull, M.dark, 1.9, 1.9, 5.3, s * 9.5, 1.9, i * 6.4, 0, 0, Z, 10); }
  box(hull, M.steel, 15, 3.2, 44, 0, 4.4, 0); box(hull, M.girder, 25, 1, 48, 0, 6.4, 0); box(hull, M.hazard, 25.4, .7, .6, 0, 6.4, 24.1); box(hull, M.hazard, 25.4, .7, .6, 0, 6.4, -24.1);
  /* the bridge up front, then the street: two rows of houses nobody planned */
  tbox(hull, M.yellow, 10, 6.5, 8, .8, .85, 0, 10.1, 18.5); noShadow(box(hull, M.cyan, 8.4, 1.4, .2, 0, 11.4, 22.3)); box(hull, M.dark, 11, .6, 9, 0, 13.6, 18.5); cyl(hull, M.girder, .12, .12, 7, 3.5, 17, 16); noShadow(sph(hull, M.redGlow, .35, 3.5, 20.6, 16));
  const R = mulberry(9101);
  for (let i = 0; i < 9; i++) { const s = i % 2 ? 1 : -1, z = 10.5 - Math.floor(i / 2) * 7.2, w = 6.5 + R() * 2.5, h = 3.6 + R() * 4.6, d = 5.2 + R() * 1.6, x = s * (5.3 + R()), m = wallM[(R() * wallM.length) | 0]; box(hull, m, w, h, d, x, 6.9 + h / 2, z); box(hull, M.dark, w + .6, .3, d + .6, x, 6.9 + h + .15, z, 0, 0, s * .08);
    for (let k = 0; k < 2; k++) if (R() < .8) noShadow(box(hull, lit, 1.1, 1.1, .12, x + (k - .5) * 2.6, 6.9 + h * .6, z + d / 2 + .04)); if (R() < .7) noShadow(box(hull, lit, .12, 1, 1.2, x + s * (w / 2 + .04), 6.9 + h * .55, z)); }
  for (let i = 0; i < 12; i++) { noShadow(box(hull, i % 3 ? lit : M.cyan, .3, .3, .3, -12 + i * 2.2, 7.7 + Math.sin(i * 1.3) * .25, 24.3)); noShadow(box(hull, i % 3 ? lit : M.red, .3, .3, .3, 12.6, 7.7 + Math.sin(i * 1.7) * .25, -22 + i * 4)); }
  /* the garden, the water tower, two stacks and the crane */
  sph(hull, glass, 5.2, -4.5, 7, -14.5, 1, .62, 1); cyl(hull, M.girder, 5.3, 5.3, .5, -4.5, 7.1, -14.5, 0, 0, 0, 16);
  cyl(hull, M.steel, 2.4, 2.4, 4.6, 6.5, 14.6, -9, 0, 0, 0, 12); for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) box(hull, M.girder, .3, 6, .3, 6.5 + a * 1.7, 9.6, -9 + b * 1.7);
  const stacks = [[-7.5, -21], [-4.5, -21.5]].map(([x, z]) => { cyl(hull, M.dark, 1, 1.3, 13, x, 13.4, z, 0, 0, 0, 10); cyl(hull, M.rust, 1.15, 1.15, .6, x, 19.2, z, 0, 0, 0, 10); return V3(x, 20.4, z); });
  const crane = grp(hull, 7, 7, -19, 0, .5, 0); box(crane, M.yellow, 2.2, 6, 2.2, 0, 3, 0); box(crane, M.yellow, 1, 1, 15, 0, 6.4, 6, -.22); box(crane, M.girder, .2, 5, .2, 0, 6.2, 12.6);
  /* her name, hand-painted, both sides */
  const nm = new THREE.MeshStandardMaterial({ map: labelTex(512, 96, (c, w, h) => { c.fillStyle = '#5a2c14'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffc94a'; c.font = 'bold 76px Georgia,serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.name || 'MARIGOLD', w / 2, h / 2 + 4, w - 30); }), roughness: .8 });
  for (const s of [-1, 1]) { const b = box(hull, nm, 20, 3.4, .2, s * 12.62, 3, 2, 0, s * PI / 2, 0); b.receiveShadow = false; }
  /* the drill-laser on the roof: only shown once the town has bolted it on */
  const gun = grp(hull, 0, 15.4, 9); cyl(gun, M.girder, 1.6, 2, 2.2, 0, 0, 0, 0, 0, 0, 10); const gp = grp(gun, 0, 1.8, 0); box(gp, M.dark, 2.4, 2.2, 5, 0, 0, 0); cyl(gp, M.steel, .55, .7, 9, 0, 0, 6, Z, 0, 0, 10); const gm = noShadow(cyl(gp, glowMat(0xff7a2a, 1), .62, .62, .5, 0, 0, 10.6, Z, 0, 0, 10)); gun.visible = !!o.gun;
  /* four legs, folded away under the skirts until they are wanted */
  const legs = [[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sz]) => { const L = grp(hull, sx * 12.4, 4, sz * 17); L.visible = false; box(L, M.yellow, 3.4, 15, 4, 0, -7.5, 0); box(L, M.hazard, 3.8, 1.4, 4.4, 0, -4, 0); box(L, M.girder, 6, 1.6, 8, 0, -15.3, 0); cyl(L, M.dark, 2.6, 2.6, 4, 0, 0, 0, 0, 0, Z, 12); return L; });
  const e = { kind: 'truck', team: 0, name: o.name || 'MARIGOLD', obj: g, pos: g.position, cy: 9, r: 15, hp: o.hp || 3000, yaw: yaw0, v: 0, path, wp: 0, halt: !!o.halt, speed: o.speed || 8, slow: 1, turn: .32, up: 0, cols: [], colT: 0, puffT: 0, stepT: 0, gun, gunP: gp, gunM: gm.material, legs, hull, crawler: true };
  e.max = e.hp; g.rotation.y = e.yaw;
  e.update = (dt, t) => {
    const w = e.path[e.wp]; let spd = 0;
    if (w && !e.halt) { const dx = w.x - e.pos.x, dz = w.z - e.pos.z; if (Math.hypot(dx, dz) < 14) e.wp++; else { const d = angDiff(e.yaw, Math.atan2(dx, dz)); e.yaw += clamp(d * 2, -1, 1) * e.turn * dt; spd = e.speed * e.slow * clamp(1.4 - Math.abs(d), .25, 1); } }
    e.arrived = e.wp >= e.path.length; e.v = damp(e.v, spd, 1.1, dt); e.pos.x += Math.sin(e.yaw) * e.v * dt; e.pos.z += Math.cos(e.yaw) * e.v * dt; e.pos.y = damp(e.pos.y, heightAt(e.pos.x, e.pos.z), 3, dt); g.rotation.y = e.yaw;
    if ((e.colT -= dt) < 0) { e.colT = .3; for (const c of e.cols) delCol(c); e.cols = e.up > .5 ? [] : [-15, 0, 15].map(k => addCol({ x: e.pos.x + Math.sin(e.yaw) * k, z: e.pos.z + Math.cos(e.yaw) * k, r: 12, top: e.pos.y + 14 })); }
    if ((e.puffT -= dt) < 0) { e.puffT = .22; for (const s of stacks) { _v.copy(s); hull.localToWorld(_v); puff(FD.fx, _v, 1, 3.2, .3, .4, 4, 1.2); } if (e.v > 1 && !e.up) for (const s of [-1, 1]) { _v.set(s * 9.5, .5, -22); g.localToWorld(_v); puff(FD.fx, _v, 1, 3, .6, .22, 1.5, 2.5); } }
    /* standing: the hull rides twelve metres up and the legs take turns; every footfall is felt across the valley */
    hull.position.y = e.up * 12 + (e.up > .9 ? Math.abs(Math.sin(e.stepT * PI)) * .7 * clamp(e.v / 3, 0, 1) : 0); e.cy = 9 + e.up * 12;
    if (e.up > .9 && e.v > .5) { const p0 = Math.floor(e.stepT); e.stepT += dt * e.v / 9; legs.forEach((L, i) => { const ph = (e.stepT + (i === 0 || i === 3 ? 0 : .5)) % 1; L.rotation.x = Math.sin(ph * TAU) * .2; L.position.y = 4 + Math.max(0, Math.sin(ph * TAU)) * 1.6; });
      if (Math.floor(e.stepT * 2) !== Math.floor((e.stepT - dt * e.v / 9) * 2)) { const d = e.pos.distanceTo(P.pos); if (d < 600) { sfx.play('step', clamp(2.2 - d / 300, .4, 2)); P.shake += clamp(.5 - d / 500, 0, .5); } for (const L of [legs[p0 % 2 ? 1 : 0], legs[p0 % 2 ? 2 : 3]]) { L.getWorldPosition(_v); _v.y = heightAt(_v.x, _v.z) + 1; puff(FD.fx, _v, 8, 5, .55, .35, 3, 8); } } }
  };
  /* stand up (or sit back down): the legs unfold and the whole street goes up with them */
  e.stand = (on = true) => { for (const L of legs) L.visible = true; sfx.play('door'); sfx.play('servo'); return ftween(5, k => { e.up = on ? k : 1 - k; if (k === 1 && !on) for (const L of legs) L.visible = false; if (Math.random() < .3) { _v.set(rand(-12, 12), 2, rand(-22, 22)); g.localToWorld(_v); puff(FD.fx, _v, 2, 4, .6, .3, 2, 5); } }); };
  /* the drill-laser: a beam from the roof to whatever it is pointed at */
  e.zap = (tg, dmg = 180) => { if (e.dead || !tg || tg.dead) return false; gp.getWorldPosition(_o); _c.copy(tg.pos); _c.y += tg.cy; gun.rotation.y = Math.atan2(_c.x - _o.x, _c.z - _o.z) - e.yaw; const bm = hot(0xff8a3a, 7); bm.transparent = true; bm.blending = THREE.AdditiveBlending; bm.depthWrite = false; addBeam(_o.clone(), _c.clone(), bm, 1.3, .7); e.gunM.emissiveIntensity = 9; tween(.8, k => { e.gunM.emissiveIntensity = 9 - 8 * k; }); explode(FD.fx, _c.clone(), 1.4); sfx.play('plasma'); sfx.play('gauss'); damage(tg, dmg, _c.clone(), 0); return true; };
  /* has she reached (or gone by) this place on her road? Scripts wait on this rather than on a distance, which a town in a hurry can drive straight through */
  e.past = p => { let b = 0, bd = 1e9; e.path.forEach((q, i) => { const d = stDist(q, p); if (d < bd) { bd = d; b = i; } }); return e.wp > b; };
  e.route = pts => { e.path = stRoad([e.pos, ...pts]); e.wp = 0; };
  FD.ents.push(e); return e;
}

/* ---- a meter the HUD can show in an objective line: ten blocks ---- */
const stBar = v => '█'.repeat(clamp(Math.round(v / 10), 0, 10)) + '░'.repeat(10 - clamp(Math.round(v / 10), 0, 10));
/* a machine that goes from place to place at its own pace, whatever is happening round it: e.pace scales its clock (and its stride), e.walk(points) sets the road, e.halt stops it where it stands */
function stWalker(at, cfg, team, o = {}) {
  const e = mkMech(at.x, at.z, cfg, team, { ai: 'hold', ...o }), u = e.update; e.pace = o.pace ?? 1; e.road = []; e.rp = 0; e.halt = !!o.halt; e.pacify = o.pacify ?? true;
  e.update = (dt, t) => { const w = e.road[e.rp]; if (w && !e.halt) { if (stDist(e.pos, w) < 13) { e.rp++; e.arrived = false; } else { e.ai = 'goto'; e.dest = w; } } else e.ai = 'hold'; e.done = e.rp >= e.road.length; u(dt * e.pace, t); };
  e.walk = (pts, gap = 60) => { e.road = stRoad([e.pos, ...pts], gap); e.rp = 0; e.done = false; }; e.past = p => { let b = 0, bd = 1e9; e.road.forEach((q, i) => { const d = stDist(q, p); if (d < bd) { bd = d; b = i; } }); return e.rp > b; };
  return e;
}
/* LANTERN: an old Helion survey frame with nobody in it, a lamp on its head and a pillar of light over it, walking at half the speed of anything alive */
function stLantern(at, o = {}) {
  const e = stWalker(at, { name: 'LANTERN', role: 'SURVEY', legs: 'bip', torso: 'pod', head: 'dom', armL: 'claw', armR: 'las', back: 'rad', paint: FAC.hel.paint }, o.team ?? 2, { name: 'LANTERN', pace: .5, hpK: o.hpK || 4, yaw: o.yaw, halt: o.halt, skill: 1 });
  const h = e.mech.height, lamp = glowMat(0x9fe8ff, 6); noShadow(sph(e.obj, lamp, .55, 0, h + .9, 0)); cyl(e.obj, M.girder, .06, .06, 1.2, 0, h + .3, 0);
  const bm = new THREE.Mesh(ST_BEAM, new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); bm.position.y = h + 70; bm.scale.set(.8, 140, .8); e.obj.add(bm);
  for (const k in e.mech.mats) if (e.mech.mats[k].color && k !== 'glow') e.mech.mats[k].color.lerp(_c1.setRGB(.82, .86, .9), .55);
  e.lamp = lamp; e.inv = !!o.inv; return e;
}

/* ---- THE IRON DERBY. A course is a ring of gates taken in order for so many laps. Everybody on it — you included — is placed by gates cleared, then by how close the next one is.
   Nobody gets away in a Derby, and nobody is let go. Every car has a place in the pack: so many seconds of your own top speed in front of you, or behind (st, negative). It takes whatever speed keeps that place,
   more than its machine honestly has when it is short of it and less when it is past it, so the grid is round you whatever you brought and however you drive it. A place is [off the grid, settled, at the last gate]:
   the settled one swings by sw seconds either way, which is how places change hands, and the last is where the car means to be as you reach the final gate. `at` is the share of the race over which it settles.
   From the final gate the pack is over. Every car drops to the pace it can honestly hold (f, a share of your walking top speed) and the run to the flag belongs to whoever goes straight at it.
   A car with `flat` set is outside all of this and simply runs at f. One that has been turned loose with its weapons (dbHot) keeps its place like any other and fires from it, `gun` times as often as it would at a stand ---- */
const RACE_K = {
  gain: .25,    /* speed taken or given, in shares of your top speed, for each second a car is off its place */
  ff: .3,       /* how quickly the grid picks up a change in your own pace (1/s). With the gain, this is the give in the band: a burst of sprint buys about half a second for a few seconds */
  lo: .7,       /* a car past its place eases off to this and no further: a pilot who stops is left at fifteen metres a second, and has it all to do again */
  hi: 1.75,     /* the most a car in sight will take to get its place back: a sprint is 1.45 */
  far: 3,       /* and the most one a long way off will take, where nobody is looking */
  late: 18,     /* seconds before you reach the final gate at which every car goes for its last place */
  rush: 2.1,    /* and the most it will take to be there in time */
  room: 12,     /* metres two cars keep between them */
  mine: 16,     /* and the metres they leave you, so that nobody runs in the middle of your picture */
};
function stRace(pts, laps, o = {}) {
  const N = pts.length, col = o.col || 0xffb21a, G = pts.map((p, i) => stGate(p, stAng(pts[(i + N - 1) % N], pts[(i + 1) % N]), col, o.w || 34)), K = RACE_K, top = () => player.stats.speed * RUN;
  const R = { G, N, total: N * laps, laps, me: 0, cars: [], out: [], on: false, t0: 0, tMe: 0, pace: 1, vp: 1, lp: null, next: n => pts[n % N] };
  R.add = (ch, cfg, f, slot, o2 = {}) => {
    const a = stAng(pts[0], pts[N - 1]), [x, z] = stOff(pts[0], a + (slot % 2 ? .35 : -.35), 46 + (slot >> 1) * 16), e = mkMech(x, z, cfg, 2, { ai: 'hold', name: o2.name || ch.first.toUpperCase(), yaw: a + PI, hpK: o2.hpK || 2.2, skill: o2.skill || 1, nz: true }), u = e.update, i = R.cars.length;
    const car = { e, ch, f, n: 0, fin: 0, k: f, st: o2.st ?? 0, sw: o2.sw || 0, at: o2.at || [.06, .4], ph: i * 2.4 + 1, w: TAU / (o2.per || 33 + i * 6), lane: [-8, 8, -3, 3, 0, -12, 12][i % 7], gun: o2.gun ?? .3 }, own = e.mech.stats.speed * ERUN * .9, m = e.mech;
    const free = () => { e.vk = 1; m.gait.sk = 1.25; };
    e.pacify = true; e.car = car; fieldWho(ch, e);
    e.update = (dt, t) => {
      if (!R.on || car.fin) { free(); e.ai = car.fin ? 'hold' : e.ai; return u(dt, t); }
      const w = R.next(car.n); if (stDist(e.pos, w) < 20) { car.n++; if (car.n >= R.total) { car.fin = MS.t; R.out.push(car); e.ai = 'hold'; free(); return u(dt, t); } }
      if (e.team === 2 || e.ai === 'goto') { e.ai = 'goto'; e.dest = R.line(car); e.arrived = false; } else { free(); return u(dt, t); }   /* off the course on business of its own: its own machine, at its own pace */
      car.k = R.speed(car); e.vk = clamp(top() * car.k * R.pace / own, .05, 8); m.gait.sk = 1.25 / Math.sqrt(Math.max(1, e.vk * .9 / 1.6));   /* past a full sprint the stride lengthens as well as quickens */
      const c0 = e.pacify ? null : { ...e.cd }; u(dt, t); const sp = Math.min(1, 6 * dt);
      if (c0) for (const k in c0) if (e.cd[k] > c0[k]) e.cd[k] /= car.gun;   /* a car that has gone weapons hot is still running flat out: every shot costs it 1/gun as long to follow as it would standing its ground */
      for (const q of R.cars) { const p = q === car ? P.pos : q.e.pos, r = q === car ? K.mine : K.room; if (q !== car && q.e.dead) continue; const dx = e.pos.x - p.x, dz = e.pos.z - p.z, d = Math.hypot(dx, dz); if (d < r && d > .01) { e.pos.x += dx / d * (r - d) * sp; e.pos.z += dz / d * (r - d) * sp; } }
    };
    car.quit = () => { const j = R.cars.indexOf(car); if (j >= 0) R.cars.splice(j, 1); e.update = u; free(); return e; };   /* out of the race, and its own machine again */
    R.cars.push(car); return car;
  };
  /* where you stand: one, plus every car that has cleared more gates, or the same number and is nearer the next */
  R.place = () => { const d = stDist(P.pos, R.next(R.me)); let p = 1; for (const c of R.cars) if (!c.e.dead && (c.fin || c.n > R.me || (c.n === R.me && stDist(c.e.pos, R.next(c.n)) < d))) p++; return p; };
  R.ord = n => ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH'][n - 1] || n + 'TH';
  R.lap = () => Math.min(laps, 1 + Math.floor(R.me / N));
  R.slot = n => { const a = stAng(pts[0], pts[N - 1]); return gpos(...stOff(pts[0], a + (n % 2 ? .35 : -.35), 46 + (n >> 1) * 16)); };
  /* how far a runner still has to go: to its next gate, and then gate to gate to the flag */
  R.left = (p, n) => { if (n >= R.total) return 0; let d = stDist(p, R.next(n)); for (let i = n; i < R.total - 1; i++) d += stDist(R.next(i), R.next(i + 1)); return d; };
  /* how far in front of you a car is, in metres along the course (behind, if negative), and the same in seconds of your top speed */
  R.gap = car => R.left(P.pos, R.me) - R.left(car.e.pos, car.n);
  R.secs = car => R.gap(car) / top();
  /* the run to the flag: the last gate before it is behind you */
  R.home = () => R.me >= R.total - 1;
  /* 0 until you are `late` seconds from the final gate, 1 as you reach it */
  R.late = () => { const lastLeg = stDist(R.next(R.total - 2), R.next(R.total - 1)); return smooth(clamp(1 - (R.left(P.pos, R.me) - lastLeg) / top() / K.late, 0, 1)); };
  /* the place a car wants just now, in seconds ahead of you */
  R.stn = car => {
    const s = car.st; if (typeof s === 'number') return s; const len = R.len || (R.len = R.left(pts[0], 0)), u = 1 - R.left(P.pos, R.me) / len, a = smooth(clamp((u - car.at[0]) / (car.at[1] - car.at[0]), 0, 1)), z = R.late();
    return lerp(lerp(s[0], s[1], a), s[2], z) + car.sw * Math.sin(car.ph + (MS.t - R.t0) * car.w) * a * (1 - z);
  };
  /* the speed a car takes, as a share of your top speed */
  R.speed = car => {
    if (car.flat || R.home()) return car.f;   /* the pack lets go when you reach the last gate, not when they do: a car in front is exactly where it meant to be when you get there */
    const d = stDist(car.e.pos, P.pos), hi = lerp(lerp(K.hi, K.rush, R.late()), K.far, clamp((d - 150) / 250, 0, 1));
    return clamp(R.vp + (R.stn(car) - R.secs(car)) * K.gain, K.lo, hi);
  };
  /* the point in a gate a car steers for: each keeps a lane of its own, so the pack goes through side by side and not as one machine */
  R.line = car => { const i = car.n % N, p = pts[i], y = G[i].rotation.y; return V3(p.x + Math.cos(y) * car.lane, 0, p.z - Math.sin(y) * car.lane); };
  /* the cars either side of you on the road: [nearest in front, nearest behind] */
  R.by = () => { let a = null, b = null; for (const c of R.cars) { if (c.e.dead || c.fin) continue; const g = R.gap(c); if (g > 0 ? !a || g < a.g : !b || g > b.g) { const q = { c, g }; if (g > 0) a = q; else b = q; } } return [a, b]; };
  R.go = () => { R.on = true; R.t0 = MS.t; R.vp = 1.45; R.lp = null; R.len = R.left(pts[0], 0); sfx.play('alarm'); msg('GO!', 2); };
  stTick(dt => {
    if (MS.over) return false; const nx = R.me % N; G.forEach((g, i) => { const lit = i === nx && R.me < R.total && R.pace > .5; g.userData.lamp.emissiveIntensity = lit ? 3 + 2.5 * Math.sin(MS.t * 9) : .5; g.userData.beam.material.opacity = lit ? .34 : .05; });
    /* under a caution flag (pace dropped by the script) the gates count for nobody: the field is held, and so are you */
    if (R.on && R.pace > .5 && R.me < R.total && stDist(P.pos, R.next(R.me)) < 21) { R.me++; sfx.play('ok'); if (R.me >= R.total) { R.tMe = MS.t; R.fin = R.out.length + 1; msg(`FINISHED — ${R.ord(R.fin)}`, 4); } else if (R.me % N === 0) msg(`LAP ${R.lap()} OF ${laps} — ${R.ord(R.place())}`, 3); }
    /* your own pace over the ground that counts, as the grid reads it */
    if (R.on && R.me < R.total && dt > 0) { const lp = R.left(P.pos, R.me); if (R.lp != null) R.vp = damp(R.vp, clamp((R.lp - lp) / dt / top(), 0, 1.6), K.ff, dt); R.lp = lp; }
    const gn = R.on && R.me < R.total && R.pace > .5 ? R.me : -1; if (gn !== R.gn) { R.gn = gn; if (gn >= 0) nav('gate', R.next(gn), gn === R.total - 1 ? 'FINISH' : `GATE ${gn % N + 1}`, '#ffb21a'); else unnav('gate'); } return true;
  });
  return R;
}

/* ---- THE LAST SERMON: Krait's land dreadnought. A hundred and ten metres of hull on six tracks with a cathedral for a superstructure. Four batteries ride on her, each a target in its own right;
   until they are gone nothing reaches the reactor under the nave. She shells what she can see and grinds on down her road ---- */
function stDread(at, path, o = {}) {
  const g = grp(FD.scene, at.x, at.y, at.z), hull = grp(g), red = std({ color: 0x5a1410, roughness: .7, metalness: .5 }), iron = std({ color: 0x1c1a1a, roughness: .6, metalness: .7 }), fire = glowMat(0xff5a1a, 3.5), yaw0 = path.length ? stAng(at, path[0]) : o.yaw || 0;
  for (const s of [-1, 1]) for (const z of [-34, 0, 34]) { box(hull, M.black, 9, 7, 30, s * 21, 3.5, z); box(hull, iron, 10, 1.2, 31, s * 21, 7.4, z); for (let i = -1; i <= 1; i++) cyl(hull, M.dark, 3.3, 3.3, 9.4, s * 21, 3.3, z + i * 10, 0, 0, Z, 10); }
  box(hull, iron, 34, 8, 108, 0, 9, 0); tbox(hull, red, 30, 9, 96, .86, .94, 0, 17.5, 0); box(hull, M.hazard, 34.4, 1, 1, 0, 12.6, 54.2); tbox(hull, iron, 26, 12, 16, .5, .2, 0, 12, 58, .5);
  /* the nave: a ribbed vault down her spine, a rose window that is the reactor shining through, and a spire */
  for (let i = -3; i <= 3; i++) { box(hull, iron, 22, 22, 2.4, 0, 33, i * 10 - 6); tbox(hull, red, 18, 19, 8, .7, 1, 0, 31.5, i * 10 - 1); }
  tbox(hull, iron, 20, 10, 74, .1, 1, 0, 49, -6); const rose = noShadow(cyl(hull, fire, 6.5, 6.5, .8, 0, 34, 31.6, Z, 0, 0, 20)); cyl(hull, iron, 7.6, 7.6, .7, 0, 34, 31.3, Z, 0, 0, 20);
  cyl(hull, iron, 5, 7, 30, 0, 37, -46, 0, 0, 0, 8); cyl(hull, red, .4, 5, 26, 0, 65, -46, 0, 0, 0, 8); noShadow(sph(hull, fire, 1.6, 0, 79, -46));
  for (const s of [-1, 1]) for (let i = 0; i < 5; i++) { cyl(hull, iron, 1.3, 1.6, 16 + i * 2.4, s * 13, 30 + i * 1.2, 34 - i * 4.6, 0, 0, 0, 8); noShadow(cyl(hull, fire, 1, 1, .5, s * 13, 38.4 + i * 2.4, 34 - i * 4.6, 0, 0, 0, 8)); }   // organ pipes: her exhausts
  const nm = new THREE.MeshStandardMaterial({ map: labelTex(1024, 128, (c, w, h) => { c.fillStyle = '#140606'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff5a2a'; c.font = 'bold 92px Georgia,serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('LAST SERMON', w / 2, h / 2 + 6); }), roughness: .8 });
  for (const s of [-1, 1]) box(hull, nm, 56, 7, .3, s * 17.3, 13.5, 4, 0, s * PI / 2, 0);
  const e = { kind: 'truck', team: 1, name: 'LAST SERMON', obj: g, pos: g.position, cy: 30, r: 17, hp: o.hp || 2600, yaw: yaw0, v: 0, path, wp: 0, halt: !!o.halt, speed: o.speed || 4, turn: .12, cols: [], colT: 0, puffT: 0, inv: true, dread: true, guns: [], fireT: 4, rose, alert: true };
  e.max = e.hp; g.rotation.y = e.yaw;
  /* the batteries: twin siege barrels in an armoured cupola, two a side */
  [[-1, 30], [1, 30], [-1, -22], [1, -22]].forEach(([s, z], i) => {
    const m = grp(hull, s * 19, 22, z), hd = grp(m); cyl(m, iron, 6, 7, 4, 0, -2, 0, 0, 0, 0, 10); tbox(hd, red, 9, 6, 10, .8, .8, 0, 3, 0); const br = grp(hd, 0, 3.4, 3, -.35); for (const q of [-1, 1]) cyl(br, M.black, .9, 1.1, 17, q * 2, 0, 8, Z, 0, 0, 10); noShadow(box(hd, fire, 3, .6, .2, 0, 4.4, 5.06));
    const b = { kind: 'turret', team: 1, name: `SERMON BATTERY ${'ABCD'[i]}`, obj: m, pos: V3(), cy: 3, r: 7.5, hp: o.gunHp || 520, fireT: 3 + i * 1.7, hd, alert: true, update(dt) { m.getWorldPosition(b.pos); b.pos.y -= 0; const tg = seek(b, dt); if (!tg) return; const dx = tg.pos.x - b.pos.x, dz = tg.pos.z - b.pos.z, d = Math.hypot(dx, dz); hd.rotation.y += angDiff(hd.rotation.y, Math.atan2(dx, dz) - e.yaw) * Math.min(1, 1.2 * dt);
      if ((b.fireT -= dt) < 0 && d < 900) { b.fireT = rand(5, 8); br.getWorldPosition(_o); explode(FD.fx, _o.clone(), 1.2); if (d < 600) sfx.play('boom', clamp(1.2 - d / 500, .25, 1)); const lead = tg === PE ? P.v * 1.6 : (tg.v || 0) * 1.6, ty = tg === PE ? P.yaw : tg.yaw || 0; shell(tg.pos.x + Math.sin(ty) * lead + rand(-14, 14), tg.pos.z + Math.cos(ty) * lead + rand(-14, 14), o.dmg || 75, 17, 2.6); } } };
    b.max = b.hp; m.getWorldPosition(b.pos); b.onKill = () => { e.guns.splice(e.guns.indexOf(b), 1); if (!e.guns.length) { e.inv = false; rose.material.emissiveIntensity = 9; } }; e.guns.push(b); FD.ents.push(b);
  });
  e.update = (dt, t) => {
    const w = e.path[e.wp]; let spd = 0; if (w && !e.halt) { const dx = w.x - e.pos.x, dz = w.z - e.pos.z; if (Math.hypot(dx, dz) < 24) e.wp++; else { e.yaw += clamp(angDiff(e.yaw, Math.atan2(dx, dz)) * 2, -1, 1) * e.turn * dt; spd = e.speed; } }
    e.arrived = e.wp >= e.path.length; e.v = damp(e.v, spd, .6, dt); e.pos.x += Math.sin(e.yaw) * e.v * dt; e.pos.z += Math.cos(e.yaw) * e.v * dt; e.pos.y = damp(e.pos.y, heightAt(e.pos.x, e.pos.z), 2, dt); g.rotation.y = e.yaw;
    if ((e.colT -= dt) < 0) { e.colT = .4; for (const c of e.cols) delCol(c); e.cols = [-40, -13, 13, 40].map(k => addCol({ x: e.pos.x + Math.sin(e.yaw) * k, z: e.pos.z + Math.cos(e.yaw) * k, r: 22, top: e.pos.y + 19 })); }
    if ((e.puffT -= dt) < 0) { e.puffT = .16; _v.set(pick([-13, 13]), 50, rand(14, 36)); hull.localToWorld(_v); puff(FD.fx, _v, 1, 5, .16, .5, 6, 2); if (e.v > .5) for (const s of [-1, 1]) { _v.set(s * 21, 1, -52); g.localToWorld(_v); puff(FD.fx, _v, 1, 5, .5, .25, 2, 4); } if (!e.inv && Math.random() < .5) { _v.set(rand(-8, 8), 34, 33); hull.localToWorld(_v); sparks(FD.fx, _v.clone(), 4, 9, 5, 2, .5); } }
    rose.material.emissiveIntensity = e.inv ? 3.5 + Math.sin(t * 2.2) * 1.2 : 7 + Math.sin(t * 13) * 3;
  };
  FD.ents.push(e); return e;
}

