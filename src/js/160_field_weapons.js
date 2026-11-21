/* ============ FIELD: WEAPONS, PROJECTILES, HOSTILES ============ */
const keys = {};
const P = { pos: V3(), yaw: PI, v: 0, vy: 0, twist: 0, pitch: 0, heat: 0, armor: 100, max: 100, fuel: 1, cd: { armL: 0, armR: 0, back: 0 }, shut: 0, cam: 0, air: false, shake: 0, kills: 0, wave: 0, dead: false, aim: V3(), md: [false, false, false], waveT: 0, center: false, stepT: 0 };
const PE = { pos: P.pos, cy: 6, r: 4, isPlayer: true, team: 0, name: 'PLAYER', get dead() { return P.dead; } };   // the player as a target for hostile fire
const hot = (hex, k) => { const m = new THREE.MeshBasicMaterial({ color: hex, fog: false }); m.color.multiplyScalar(k); return m; };
const SM = { tracer: glowM(0xffc766, 7, .8), etracer: glowM(0xff4a2a, 7, .8), plasma: glowM(0x66e0ff, 7, .9, 1.2), eplasma: glowM(0xff5a3a, 7, .9, 1.2), bolt: glowM(0xff3a2a, 8, .8) };
/* the colour of a weapon's light, where it is not the machine's own glow */
const WEP_HUE = { rail: 0xbfe6ff, bullet: 0xffb060, flak: 0xffb060, missile: 0xff9a50, lob: 0xffa860, ion: 0x9fd0ff, arc: 0xa8d4ff, flame: 0xff8030 };
const SND = { laser: 'laser', rail: 'gauss', bullet: 'cannon', flak: 'flak', plasma: 'plasma', missile: 'missile', bolt: 'laser', beam: 'beam', flame: 'flame', arc: 'zap', ion: 'ion', lob: 'mortar', melee: 'swing' };
SM.ion = glowM(0x9fd0ff, 8, .9, 1.2);
let msgT = 0; const msg = (s, d = 2.5) => { $('msg').textContent = s; $('msg').style.opacity = 1; msgT = d; };

function inSolid(p) {
  if (p.y < heightAt(p.x, p.z)) return true;
  for (const c of nearCols(p.x, p.z)) { if (p.y > c.top) continue; if (c.r !== undefined) { const dx = p.x - c.x, dz = p.z - c.z; if (dx * dx + dz * dz < c.r * c.r) return true; } else if (Math.abs(p.x - c.x) < c.hw && Math.abs(p.z - c.z) < c.hd) return true; }
  return false;
}
function collide(p, r) {
  for (const c of nearCols(p.x, p.z)) {
    if (p.y > c.top - .6) continue; const dx = p.x - c.x, dz = p.z - c.z;
    if (c.r !== undefined) { const d = Math.hypot(dx, dz), m = c.r + r; if (d < m && d > .001) { p.x = c.x + dx / d * m; p.z = c.z + dz / d * m; } }
    else { const ox = c.hw + r - Math.abs(dx), oz = c.hd + r - Math.abs(dz); if (ox > 0 && oz > 0) { if (ox < oz) p.x += Math.sign(dx || 1) * ox; else p.z += Math.sign(dz || 1) * oz; } }
  }
  const d = Math.hypot(p.x, p.z), lim = 430 * FD.k; if (d > lim) { p.x *= lim / d; p.z *= lim / d; }
}
const targetsOf = o => o === 1 ? FD.t1 : FD.t0;   // who a shot can hit, by owner: 1 hostile · 0 yours · 4 another company on your side (lists rebuilt each frame by retarget)
const _o = V3(), _d = V3(), _p = V3(), _c = V3();
/* ---- what a machine is made of, as far as a shot is concerned. Every fitted part is a zone: a sphere round where the part sits, with armour of its own.
   A hit goes to the zone the shot came nearest, wears it down, and passes a share on into the hull. A zone at nothing is a part shot off:
   an arm takes its weapon with it, a back unit whatever it did, a cockpit the sensors, and legs leave the machine where it stands ---- */
const _zc = V3(), LOB_G = 26;
const ZONE_N = { legs: 'LEGS', torso: 'TORSO', head: 'COCKPIT', armL: 'LEFT ARM', armR: 'RIGHT ARM', back: 'BACK UNIT' };
/* [share of the hull's armour, how much of a hit carries on into the hull, the armour an ordinary part of the kind has] */
const ZONE_K = { legs: [.45, .6, 80], head: [.2, 1.1, 25], armL: [.28, .5, 20], armR: [.28, .5, 20], back: [.34, .6, 10] };
function mechZones(mech) {
  const S = mech.slot, inv = mech.root.matrixWorld.clone().invert(), zg = mech.zg = [], bb = new THREE.Box3(), a = S.torso && S.torso.userData;
  const boxOf = (root, skip) => { const b = new THREE.Box3(); (function walk(o) { if (skip.includes(o)) return; if (o.isMesh && o.geometry) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); b.union(bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld)); } for (const c of o.children) walk(c); })(root); return b.isEmpty() ? null : b.applyMatrix4(inv); };
  const put = (k, root, skip = []) => { const b = root && boxOf(root, skip); if (!b) return; const c = b.getCenter(V3()), s = b.getSize(V3()); zg.push({ k, c, r: Math.max(1, (s.x + s.y + s.z) / 6 * 1.1), up: k !== 'legs' }); };
  if (mech.cfg.legs) put('legs', S.legs, [S.torso]);
  if (S.torso) put('torso', S.torso, [a.head, a.armL, a.armR, a.back]);
  for (const k of ['head', 'armL', 'armR', 'back']) put(k, S[k]);
}
/* where a zone is now: the build pose turned by the legs' heading and, above the waist, by the torso twist */
function zoneW(mech, z, out) { const a = mech.root.rotation.y + (z.up ? mech.twist : 0), s = Math.sin(a), c = Math.cos(a); return out.set(z.c.x * c + z.c.z * s, z.c.y, -z.c.x * s + z.c.z * c).add(mech.root.position); }
const zMech = e => e === PE ? player : e.mech, zState = e => e === PE ? P.zones : e.zones;
const zGone = (e, k) => { const s = zState(e); return !!(s && s[k] && s[k].hp <= 0); };
function zonesFor(mech, hull, k = 1) {
  const o = {}; for (const z of mech.zg) { const K = ZONE_K[z.k], part = K && PARTS[CAT[z.k]][mech.cfg[z.k]]; if (!part) continue; const max = Math.max(4, hull * K[0] * k * clamp((part.armor || K[2]) / K[2], .7, 1.5)); o[z.k] = { hp: max, max }; }
  return o;
}
/* a mech is two spheres to hit: the chest it always was, and the legs under it, which the chest sphere never reached */
const mechHs = (m, cy, r) => { const L = m.zg.find(z => z.k === 'legs'); return L ? [[0, cy, 0, r], [0, L.c.y, 0, Math.max(2.2, L.r)]] : null; };
function zonePick(e, fn) {
  const m = zMech(e), zs = zState(e); if (!m || !zs || !m.zg) return null; let bk = null, bs = 1e9;
  for (const z of m.zg) { const s = zs[z.k]; if (s && s.hp <= 0 && z.k !== 'legs' && z.k !== 'head') continue; const q = fn(zoneW(m, z, _zc)) - z.r; if (q < bs) { bs = q; bk = z.k; } }
  return bk;
}
const zoneAt = (e, p) => zonePick(e, c => c.distanceTo(p));
const zoneRay = (e, o, d) => zonePick(e, c => { c.sub(o); const t = c.dot(d); return Math.sqrt(Math.max(0, c.lengthSq() - t * t)); });
const mechArmed = e => ['armL', 'armR', 'back'].some(k => { const id = e.mech.cfg[k]; return id && (k === 'back' ? PARTS.back[id] : PARTS.arm[id]).weapon && !zGone(e, k); });
/* how close a machine wants to be: three quarters of its shortest reach, so a machine with a fist walks up and uses it */
function mechRng(e) {
  let r = 1e9; for (const k of ['armL', 'armR', 'back']) { const id = e.mech.cfg[k], w = id && (k === 'back' ? PARTS.back[id] : PARTS.arm[id]).weapon; if (w && !zGone(e, k)) r = Math.min(r, w.type === 'melee' ? w.range + 4 : wepReach(w)); }
  return r > 1e8 ? 110 : clamp(r * .75, 12, 110);
}
function zoneTake(e, k, d, owner) { const s = zState(e)[k]; if (!s || s.hp <= 0) return 1; s.hp -= d; if (s.hp <= 0) { s.hp = 0; zoneBreak(e, k, owner); } return ZONE_K[k][1]; }
function zoneBreak(e, k, owner) {
  const me = e === PE, m = zMech(e), S = m.slot[k], z = m.zg.find(z => z.k === k), at = zoneW(m, z, V3()), arm = k === 'armL' || k === 'armR';
  explode(FD.fx, at, k === 'legs' ? 1.4 : .9); sparks(FD.fx, at, 26, 11); if (me || at.distanceTo(P.pos) < 260) sfx.play('boom', me ? .9 : .55);
  if (arm) S.userData.pitch.visible = false; else if (k === 'back') S.visible = false; else if (k === 'head') S.rotation.set(-.25, 0, .4);
  FD.tick.push(dt => { if (e.dead || !zGone(e, k)) return false; if (Math.random() < dt * 9) { zoneW(m, z, _zc); FD.fx.smoke.emit(_zc.x, _zc.y, _zc.z, rand(-1, 1), rand(2, 4), rand(-1, 1), rand(1.2, 2.4), rand(1.5, 2.6), .1, .1, .1, .45, -.2, .3, 2); if (Math.random() < .3) sparks(FD.fx, _zc, 3, 5); } return true; });
  if (me) {
    P.lost[k] = true; tal('d.z.' + k); P.shake += .5; const w = arm || k === 'back' ? wepOf(k) : null; sfx.play('deny'); POST.kick();
    if (k === 'legs') msg('LEGS CRIPPLED — SHE CAN BARELY WALK', 3.5); else if (k === 'head') msg('COCKPIT HIT — SENSORS DOWN', 3.5);
    else { msg(`${ZONE_N[k]} DESTROYED${w ? ' — ' + w.name + ' OFFLINE' : ''}`, 3.5); if (k === 'back') { const s2 = mechStats({ ...player.cfg, back: null }), o = player.stats; player.stats = { ...o, jets: false, fx: '', cool: s2.cool, sensor: s2.sensor, speed: o.fx === 'boost' ? o.speed / 1.12 : o.speed }; P.sh = P.shMax = 0; PE.ecm = false; player.setJets(false); } }
    return buildWepHud();
  }
  if (owner === 0) { msg(`${e.name} — ${ZONE_N[k]} DESTROYED`, 2.2); if (talBy !== 'ally') tal('z.' + k); }
  if (k === 'head') e.skill *= .45; else if (k === 'legs') e.legless = true; else if (k === 'back') { e.sh = e.shMax = 0; e.ecm = false; }
  e.rng = mechRng(e);
  /* an ordinary pilot with nothing left to shoot gets out. Anybody with a name stays in the seat: the script they belong to decides what becomes of them */
  if ((arm || k === 'back') && e.team === 1 && !e.named && !e.ej && !mechArmed(e)) { e.pacify = true; e.ej = { t: 1.3, by: owner, w: talBy }; }
}
/* a field repair kit puts the player's wrecked parts back in service at half strength */
function zoneMend() {
  let n = 0; for (const k in P.zones) { const s = P.zones[k]; if (s.hp > 0) continue; n++; tal('d.mend'); s.hp = s.max * .5; const S = player.slot[k]; if (!S) continue; if (S.userData.pitch) S.userData.pitch.visible = true; S.visible = true; if (k === 'head') S.rotation.set(0, 0, 0); }
  if (n) { P.lost = {}; player.stats = mechStats(player.cfg); P.shMax = player.stats.fx === 'shield' ? P.max * .3 : 0; PE.ecm = player.stats.fx === 'ecm'; buildWepHud(); }
  return n;
}

/* ---- hits: a target is one sphere, or a list of them (e.hs: [x, y, z, r] in its own frame, turned by e.yaw) ---- */
function entRay(e, o, d) {
  if (!e.hs) { _c.copy(e.pos); _c.y += e.cy; _c.sub(o); const tca = _c.dot(d); if (tca < 0) return -1; const d2 = _c.lengthSq() - tca * tca, r2 = e.r * e.r; return d2 > r2 ? -1 : tca - Math.sqrt(r2 - d2); }
  let best = -1; const cs = Math.cos(e.yaw || 0), sn = Math.sin(e.yaw || 0);
  for (const h of e.hs) { _c.set(e.pos.x + h[0] * cs + h[2] * sn, e.pos.y + h[1], e.pos.z - h[0] * sn + h[2] * cs).sub(o); const tca = _c.dot(d); if (tca < 0) continue; const d2 = _c.lengthSq() - tca * tca, r2 = h[3] * h[3]; if (d2 > r2) continue; const t = tca - Math.sqrt(r2 - d2); if (t > 0 && (best < 0 || t < best)) best = t; }
  return best;
}
function entIn(e, p) {
  if (!e.hs) { _c.copy(e.pos); _c.y += e.cy; return _c.distanceToSquared(p) < e.r * e.r; }
  const cs = Math.cos(e.yaw || 0), sn = Math.sin(e.yaw || 0); for (const h of e.hs) { const dx = e.pos.x + h[0] * cs + h[2] * sn - p.x, dy = e.pos.y + h[1] - p.y, dz = e.pos.z - h[0] * sn + h[2] * cs - p.z; if (dx * dx + dy * dy + dz * dz < h[3] * h[3]) return true; }
  return false;
}
/* how far a point is from the nearest part of a target's surface */
function entGap(e, p) {
  if (!e.hs) { _c.copy(e.pos); _c.y += e.cy; return _c.distanceTo(p) - e.r; }
  let best = 1e9; const cs = Math.cos(e.yaw || 0), sn = Math.sin(e.yaw || 0); for (const h of e.hs) best = Math.min(best, Math.hypot(e.pos.x + h[0] * cs + h[2] * sn - p.x, e.pos.y + h[1] - p.y, e.pos.z - h[0] * sn + h[2] * cs - p.z) - h[3]);
  return best;
}
function rayHit(o, d, maxD, owner) {
  let best = maxD, ent = null;
  for (const e of targetsOf(owner)) { if (e.dead) continue; const t = entRay(e, o, d); if (t > 0 && t < best) { best = t; ent = e; } }
  for (let t = 3; t < best; t += 3 + t * .03) { _p.copy(o).addScaledVector(d, t); if (inSolid(_p)) { let a = t - (3 + t * .03), b = t; for (let i = 0; i < 5; i++) { const m = (a + b) / 2; _p.copy(o).addScaledVector(d, m); inSolid(_p) ? b = m : a = m; } best = Math.max(0, a); ent = null; break; } }
  return { t: best, ent, zone: ent ? zoneRay(ent, o, d) : null };
}
function addBeam(a, b, mat, w, life) { const m = new THREE.Mesh(GEO.tube, mat); m.position.copy(a).add(b).multiplyScalar(.5); m.scale.set(w, w, a.distanceTo(b)); m.lookAt(b); FD.scene.add(m); FD.beams.push({ m, w, life, max: life }); }
/* a shield going up for a moment round whatever it saved */
function shFlash(e) {
  if (e.shF > 0) return; e.shF = .2; const mat = hot(0x7fd8ff, 2.2); mat.transparent = true; mat.opacity = .3; mat.blending = THREE.AdditiveBlending; mat.depthWrite = false;
  const m = new THREE.Mesh(geoC.s1 || (geoC.s1 = new THREE.SphereGeometry(1, 12, 8)), mat), w = e.r * 1.35; m.position.copy(e.pos); m.position.y += e.cy; m.scale.setScalar(w); FD.scene.add(m); FD.beams.push({ m, w, life: .22, max: .22 });
}
function damage(e, dmg, at, owner, zone) {
  if (e === PE) {
    if (P.dead || MS.over) return; let d = dmg * .24;
    if (P.sh > 0) { const a = Math.min(P.sh, d); P.sh -= a; d -= a; shFlash(PE); tal('d.sh', a); } P.shT = 5; if (d <= .001) return sfx.play('shield', .6);
    if (zone && P.zones) d *= zoneTake(PE, zone, d, owner);
    P.armor -= d; tal('d.h'); tal('d.n', d); talMax('d.big', d); P.shake = Math.min(1.5, P.shake + dmg * .03); $('dmg').style.opacity = .7; sfx.play('hit'); if (P.armor <= 0) playerLost(); return;
  }
  if (e.dead || e.inv) return; let d = dmg * (e.team === 0 ? .5 : 1); e.alert = true; if (owner === 0) e.hitP = 6;
  let sh = 0; if (e.sh > 0) { sh = Math.min(e.sh, d); e.sh -= sh; d -= sh; shFlash(e); } if (e.shMax) e.shT = 5; if (owner === 0 && talBy) talDealt(e, d, sh); if (d <= .001) return;
  if (zone && e.zones && e.team === 1 && !e.nz) d *= zoneTake(e, zone, d, owner);
  e.hp -= d; if (at) sparks(FD.fx, at, 8, 7); if (e.hp <= 0) killEnt(e, owner);
}
function splash(at, r, dmg, owner) { for (const e of targetsOf(owner)) { if (e.dead) continue; const d = entGap(e, at); if (d < r) damage(e, dmg * (1 - Math.max(0, d) / r), null, owner, zoneAt(e, at)); } }
/* an ion bolt or a maul stalls a machine: nothing moves and nothing fires until it clears. The player gets a spike of heat and a fire control that has to start again */
function stunEnt(e, secs, owner) {
  if (e === PE) { if (P.dead) return; tal('d.stun'); tal('h.ion', Math.min(99, P.heat + secs * 12) - P.heat); P.heat = Math.min(99, P.heat + secs * 12); for (const k in P.cd) P.cd[k] = Math.max(P.cd[k], secs * .7); P.shake += .3; msg('ION HIT — FIRE CONTROL RESETTING', 1.8); return; }
  if (e.dead || e.inv || e.kind === 'struct' || e.stunCd > 0) return; e.stun = Math.max(e.stun || 0, secs * (e.big ? .4 : 1)); e.stunCd = e.stun + 3;
}
function burnEnt(e, dps, owner) { if (e === PE) { P.burnD = P.burnT > 0 ? Math.max(P.burnD, dps) : dps; P.burnT = 2.5; } else if (!e.dead && !e.inv) { e.burnD = e.burnT > 0 ? Math.max(e.burnD, dps) : dps; e.burnT = 2.5; e.burnO = owner; e.burnW = talBy; } }
/* every unit's turn in the frame goes through here: what is burning burns, shields come back, the stalled stay stalled, and a pilot with no guns leaves */
function entTick(e, dt, t) {
  if (e.burnT > 0) { e.burnT -= dt; if (!e.inv) { const bd = e.burnD * dt * (e.team === 0 ? .5 : 1); e.hp -= bd; if (e.burnO === 0 && talMine(e.burnW)) { tal('g.d', bd); tal('g.burn', bd); tal('w.' + e.burnW + '.d', bd); } } if (Math.random() < dt * 16) FD.fx.spark.emit(e.pos.x + rand(-e.r, e.r) * .6, e.pos.y + e.cy + rand(-e.r, e.r) * .5, e.pos.z + rand(-e.r, e.r) * .6, rand(-1, 1), rand(3, 7), rand(-1, 1), rand(.4, .8), rand(1.2, 2.4), 5, 2, .4, .8, -2, .6, 1.5); if (e.hp <= 0) { talBy = e.burnW || null; e.burnK = 1; killEnt(e, e.burnO ?? 0); talBy = null; return; } }
  if (e.shMax && (e.shT = (e.shT || 0) - dt) < 0 && e.sh < e.shMax) e.sh = Math.min(e.shMax, e.sh + e.shMax * .25 * dt);
  if (e.stunCd > 0) e.stunCd -= dt;
  if (e.ej) { if ((e.ej.t -= dt) <= 0) { _zc.copy(e.pos); _zc.y += e.mech.height; for (let i = 0; i < 14; i++) FD.fx.spark.emit(_zc.x, _zc.y, _zc.z, rand(-2, 2), rand(24, 44), rand(-2, 2), rand(.5, 1), rand(.6, 1.2), 5, 4, 2, 1, 6, .3); if (e.ej.by === 0) msg(`${e.name} DISARMED — PILOT EJECTS`, 2.6); talBy = e.ej.w || null; killEnt(e, e.ej.by); talBy = null; return; } }
  if (e.stun > 0) { e.stun -= dt; if (Math.random() < dt * 10) { _zc.copy(e.pos); _zc.y += e.cy; sparks(FD.fx, _zc, 3, 6, 2, 3.4, 6); } if (e.mech) { e.mech.gait.amt = damp(e.mech.gait.amt, 0, 6, dt); e.mech.gait.turn = 0; e.mech.update(dt); } return; }
  e.update(dt, t);
}

/* ---- one round leaving one muzzle, whoever fired it. o and d are where from and which way; aim is the point it was meant for (a lobbed shell needs it) ---- */
function arcBolt(a, b, mat) { const L = a.distanceTo(b), n = clamp(Math.round(L / 13), 2, 8); let p = a.clone(); for (let i = 1; i <= n; i++) { const q = a.clone().lerp(b, i / n); if (i < n) q.add(_v.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).multiplyScalar(L * .03 + .6)); addBeam(p, q, mat, .5, .24); p = q; } }
function arcShot(O, D, w, owner) {
  const h = rayHit(O, D, w.range, owner), end = O.clone().addScaledVector(D, h.t), mat = () => glowM(0xa8d4ff, 9, .9);
  arcBolt(O, end, mat()); sparks(FD.fx, end, 12, 8, 2, 3.4, 6); flashAt(O, 0xa8d4ff, 110, 70, .16); flashAt(end, 0xa8d4ff, 130, 70, .2); if (!h.ent) { scarAt(end, 1.3, .7); return; }
  let cur = h.ent, dmg = w.dmg, from = end; const seen = [cur]; damage(cur, dmg, end, owner, h.zone);
  for (let n = 0; n < (w.chain || 0); n++) {
    let nx = null, bd = 70; for (const e of targetsOf(owner)) { if (e.dead || seen.includes(e) || e.team === 2) continue; const d = e.pos.distanceTo(cur.pos); if (d < bd) { bd = d; nx = e; } }
    if (!nx) break; dmg *= .6; const to = nx.pos.clone(); to.y += nx.cy; arcBolt(from, to, mat()); sparks(FD.fx, to, 8, 7, 2, 3.4, 6); damage(nx, dmg, to, owner); seen.push(nx); from = to; cur = nx;
  }
}
function flameJet(O, D, w, owner) {
  const v = w.range / .42; for (let i = 0; i < 3; i++) FD.fx.spark.emit(O.x, O.y, O.z, (D.x + rand(-.12, .12)) * v, (D.y + rand(-.09, .13)) * v, (D.z + rand(-.12, .12)) * v, rand(.4, .62), rand(.7, 1.3), 5, 2.1, .45, .9, -4, 1.2, 4);
  flashAt(_p.copy(O).addScaledVector(D, w.range * .4), 0xff8030, 70, 60, .12);
  if (Math.random() < .25) FD.fx.smoke.emit(O.x + D.x * w.range * .6, O.y + D.y * w.range * .6, O.z + D.z * w.range * .6, rand(-1, 1), rand(2, 5), rand(-1, 1), rand(1, 2), rand(2, 4), .1, .1, .1, .3, -.3, .5, 2);
  for (const e of targetsOf(owner)) {
    if (e.dead) continue; _c.copy(e.pos); _c.y += e.cy; _c.sub(O); const dist = _c.length(), tca = _c.dot(D); if (tca < 0 || dist - e.r > w.range) continue;
    if (Math.sqrt(Math.max(0, dist * dist - tca * tca)) > e.r + tca * .2) continue; _c.copy(O).addScaledVector(D, Math.max(0, tca - e.r)); const z = zoneAt(e, _c); damage(e, w.dmg, null, owner, z); burnEnt(e, w.burn || 0, owner);
  }
}
function emitShot(o, d, w, owner, lock, glow, aim) {
  const t = w.type, foe = owner === 1, O = o.clone(), D = d.clone(), by = talBy, mine = talMine(by); if (mine) { talShot(by); talHit = 0; } else if (foe) tal('e.s');
  if (t === 'arc') { arcShot(O, D, w, owner); if (mine && talHit) talLand(by); return; }
  if (t === 'flame') { flameJet(O, D, w, owner); if (mine && talHit) talLand(by); return; }
  if (t === 'laser' || t === 'rail' || t === 'beam') {
    const h = rayHit(O, D, w.range, owner), end = O.clone().addScaledVector(D, h.t), rail = t === 'rail', hue = rail ? WEP_HUE.rail : glow, bw = (w.bw || (rail ? .28 : .2)) * 3, bl = w.bl || (rail ? .5 : .14), held = t === 'beam';
    /* a white-hot line inside a wide soft one, a flare at the muzzle, and light at both ends */
    addBeam(O, end, glowM(hue, rail ? 9 : 8, 1), bw, bl); addBeam(O, end, glowM(hue, 1.5, 0, 1), bw * 3.4, bl * .8); sparks(FD.fx, O, held ? 1 : 5, 3, 5, 3.4, 1.4);
    if (held) { if (Math.random() < .5) flashAt(_p.copy(O).addScaledVector(D, 2), hue, 45, 50, .12); } else muzzleAt(O, D, hue, rail ? 150 : 60, rail ? 1.5 : 1);
    flashAt(_p.copy(end).addScaledVector(D, -1.5), hue, rail ? 190 : held ? 60 : 85, 60, rail ? .22 : .14);
    { const c = _c2.setHex(hue); for (let i = 0; i < (held ? 1 : rail ? 7 : 3); i++) FD.fx.spark.emit(end.x, end.y, end.z, rand(-1, 1), rand(-1, 1), rand(-1, 1), rand(.08, .16), rand(1.2, 2.4) * (rail ? 1.6 : 1), c.r * 4 + 1.5, c.g * 4 + 1.5, c.b * 4 + 1.5, .9, 0, 0, .7); }
    if (h.ent) damage(h.ent, w.dmg, end, owner, h.zone); else if (h.t < w.range) { sparks(FD.fx, end, held ? 3 : 10, 6); if (!held) puff(FD.fx, end, 2, 1.5, .4, .3); if (!held || Math.random() < .12) scarAt(end, rail ? 1.5 : .8, held ? .5 : .8); }
    if (rail) for (let k = 0; k < h.t; k += 5) FD.fx.spark.emit(O.x + D.x * k, O.y + D.y * k, O.z + D.z * k, rand(-.4, .4), rand(-.4, .4), rand(-.4, .4), rand(.4, .9), .5, 1.5, 2.6, 5, .7, 0, 0, 1);
    if (mine && talHit) talLand(by); return;
  }
  const S1 = geoC.s1 || (geoC.s1 = new THREE.SphereGeometry(1, 12, 8)), big = w.big || 1, vel = D.clone().multiplyScalar(w.speed); let m, life = w.life || 3, arm = .25;
  if (t === 'plasma') { m = new THREE.Mesh(GEO.ball, foe ? SM.eplasma : SM.plasma); m.scale.setScalar((w.big || .75) * 1.7); }
  else if (t === 'ion') { m = new THREE.Mesh(GEO.ball, SM.ion); m.scale.set(.55 * big, .55 * big, 3 * big); }
  else if (t === 'lob') {
    m = new THREE.Mesh(S1, M.black); m.scale.setScalar(.42 * big); const dx = aim.x - O.x, dz = aim.z - O.z, dh = Math.hypot(dx, dz) || 1, k = Math.min(1, (w.reach || 400) / dh), T = clamp(dh * k / w.speed, .8, 8);
    vel.set(dx * k / T, (aim.y - O.y) * k / T + .5 * LOB_G * T, dz * k / T); life = T + 4;
  }
  else if (t === 'missile') {
    m = new THREE.Mesh(UB, M.steel); m.scale.set(.3, .3, 1.5); life = w.life || 6; if (w.loft) { const k = clamp(O.distanceTo(aim || O) / 260, .12, 1); D.y += w.loft * k; D.normalize(); arm = .25 + .45 * k; }   /* a lofted salvo climbs in proportion to how far it has to go: straight up at something close and it never comes round */ vel.copy(D).multiplyScalar(w.speed * rand(.55, .8));
    if (w.turn === 0 || (lock && lock.ecm && Math.random() < .7)) lock = null;
  }
  else { m = new THREE.Mesh(GEO.tube, t === 'bolt' ? SM.bolt : foe ? SM.etracer : SM.tracer); const k = w.small ? .6 : big; m.scale.set(.4 * k, .4 * k, (t === 'flak' ? 2.2 : 5.5) * (w.small ? .7 : Math.sqrt(big))); if (!w.life && t === 'flak') life = .9; }
  m.position.copy(O); m.lookAt(_p.copy(O).add(vel)); FD.scene.add(m);
  const hue = t === 'plasma' ? (foe ? 0xff5a3a : 0x66e0ff) : t === 'bolt' ? 0xff3a2a : WEP_HUE[t] || (foe ? 0xff6a3a : 0xffb060);
  FD.shots.push({ t, m, vel, life, dmg: w.dmg, owner, lock: t === 'missile' ? lock : null, max: w.speed, arm, w, hue, by });
  sparks(FD.fx, O, w.small ? 2 : 5, 3, 5, 3.4, 1.4); muzzleAt(O, D, hue, w.small ? 30 : clamp(36 + w.dmg * 2.2, 40, 150), w.small ? .6 : Math.min(1.8, .8 + w.dmg / 60));
}
/* things that hit rather than shoot. A saw bites every tick it is held against something; anything else swings, and lands a third of a second later on whatever is still in reach */
function meleeHit(mech, u, w, owner, aim) {
  /* the blow goes where the pilot is looking, not where the torso happens to point: from a chase camera off one shoulder those are thirty degrees apart at arm's length */
  const me = mech === player, by = talBy, pos = mech.root.position, ax = aim.x - pos.x, az = aim.z - pos.z, al = Math.hypot(ax, az) || 1, fx = ax / al, fz = az / al;
  const strike = () => {
    if (mech.off || (me && P.dead)) return; const cosA = Math.cos(w.arc || .7), got = []; u.muzzle.getWorldPosition(_o); const at0 = _o.clone();
    for (const e of targetsOf(owner)) { if (e.dead) continue; const dx = e.pos.x - pos.x, dz = e.pos.z - pos.z, d = Math.hypot(dx, dz); if (d - e.r > w.range || Math.abs(e.pos.y + e.cy - pos.y - mech.chestY) > 16 || (dx * fx + dz * fz) / (d || 1) < cosA) continue; got.push([d, e]); }
    got.sort((p, q) => p[0] - q[0]); if (!w.sweep) got.length = Math.min(got.length, 1); talBy = by; talHit = 0; if (me) talShot(by);
    for (const [, e] of got) {
      const at = e.pos.clone(); at.y += e.cy; at.lerp(at0, Math.min(1, e.r / (at.distanceTo(at0) || 1))); const z = zoneAt(e, at0);
      if (w.grind) sparks(FD.fx, at, 5, 9, 5, 3.4, 1.2); else { sparks(FD.fx, at, 30, 13); puff(FD.fx, at, 4, 2, .4, .4); if (me || at.distanceTo(P.pos) < 200) sfx.play('punch', me ? 1 : .6); if (me) P.shake += .35; }
      damage(e, w.dmg, at, owner, z); if (w.stun) stunEnt(e, w.stun, owner); if (w.burn) burnEnt(e, w.burn, owner);
    }
    if (me && talHit) talLand(by); talBy = null;
  };
  if (w.grind) return strike(); u.swing = 1; let t = .32 * 2.2 / (u.swingK || 2.2); FD.tick.push(dt => { if ((t -= dt) > 0) return true; strike(); return false; });
}
function fire(mech, slot, w, aim, owner, lock) {
  const S = mech.slot[slot], u = slot === 'back' ? null : S.userData, mz = u ? [u.muzzle] : S.userData.muzzles, glow = mech.mats.glow.emissive.getHex(), me = mech === player, held = w.type === 'beam' || w.type === 'flame' || w.grind;
  talBy = me ? (slot === 'back' ? 'back.' : 'arm.') + mech.cfg[slot] : owner === 0 ? 'ally' : null; if (me) talPull(talBy, w);
  if (u) { u.fireT = held ? .25 : .4; if (w.type !== 'melee') u.recoil = held ? .12 : 1; }
  if (w.type === 'melee') meleeHit(mech, u, w, owner, aim);
  else for (let i = 0; i < (w.salvo || 1); i++) {
    mz[i % mz.length].getWorldPosition(_o); _d.copy(aim).sub(_o).normalize(); const sp = w.spread || 0; if (sp) _d.add(_v.set(rand(-sp, sp), rand(-sp, sp), rand(-sp, sp))).normalize();
    emitShot(_o, _d, w, owner, lock, glow, aim);
  }
  talBy = null;
  if (me || mech.root.position.distanceTo(P.pos) < 260) sfx.play(w.snd || (w.grind ? 'saw' : SND[w.type]) || 'laser', me ? 1 : .4);
}
function updateShots(dt) {
  for (let i = FD.shots.length - 1; i >= 0; i--) {
    const s = FD.shots[i], p = s.m.position, w = s.w || {}; s.life -= dt; let hit = null, boom = s.life <= 0;
    if (s.t === 'missile') {
      s.arm -= dt; const tg = s.lock && !s.lock.dead ? s.lock : null, sp = Math.min(s.max * 1.5, s.vel.length() + 60 * dt), turn = w.turn ?? 3.2;
      if (tg && s.arm < 0 && turn) { _c.copy(tg.pos); _c.y += tg.cy; _d.copy(_c).sub(p).normalize(); s.vel.normalize().lerp(_d, Math.min(1, turn * dt)).normalize(); } else s.vel.normalize();
      s.vel.multiplyScalar(sp); s.m.lookAt(_p.copy(p).add(s.vel)); if (!(w.salvo > 6) || Math.random() < .45) FD.fx.smoke.emit(p.x, p.y, p.z, rand(-.5, .5), rand(-.2, .8), rand(-.5, .5), rand(.6, 1.3), 1.1, .8, .8, .8, .35, -.2, .5, 2); FD.fx.spark.emit(p.x, p.y, p.z, 0, 0, 0, .12, 1.3, 5, 2.6, .7);
    } else if (s.t === 'plasma') { flashAt(p, s.hue, 55, 46, .1); const c = s.owner !== 1 ? [1.4, 4, 6] : [6, 1.6, 1]; FD.fx.spark.emit(p.x + rand(-.3, .3), p.y + rand(-.3, .3), p.z + rand(-.3, .3), 0, 0, 0, .35, 1.6, ...c, .8, 0, 0, -.6); }
    else if (s.t === 'ion') { flashAt(p, s.hue, 50, 46, .1); FD.fx.spark.emit(p.x, p.y, p.z, rand(-1, 1), rand(-1, 1), rand(-1, 1), .22, 1.1, 2.4, 3.6, 6, .8, 0, 0, -.7); }
    else if (s.t === 'lob') { s.vel.y -= LOB_G * dt; if (Math.random() < .5) FD.fx.smoke.emit(p.x, p.y, p.z, 0, .3, 0, rand(.5, 1), .9, .5, .5, .5, .3, -.1, .4, 1.5); }
    const steps = Math.ceil(s.vel.length() * dt / 2.5), sd = dt / steps;
    for (let k = 0; k < steps && !hit && !boom; k++) {
      p.addScaledVector(s.vel, sd);
      for (const e of targetsOf(s.owner)) { if (e.dead) continue; if (entIn(e, p)) { hit = e; break; } }
      if (!hit && inSolid(p)) boom = true;
    }
    if (!hit && !boom) continue; talBy = s.by; talHit = 0;
    const bl = w.blast ?? (s.t === 'missile' ? 6 : s.t === 'plasma' ? 9 : 0);
    if (bl) { explode(FD.fx, p, clamp(bl / 7, .45, 2.6)); splash(p, bl, s.dmg, s.owner); if (hit && w.stun) stunEnt(hit, w.stun, s.owner); const dd = p.distanceTo(P.pos); if (dd < 220) sfx.play('boom', clamp(bl / 12, .3, 1.1)); if (bl > 10 && dd < 120) P.shake += (1 - dd / 120) * .5; }
    else if (hit) { if (s.t === 'ion') sparks(FD.fx, p, 16, 9, 2, 3.4, 6); flashAt(p, s.hue, clamp(24 + s.dmg * 2, 30, 120), 50, .1); damage(hit, s.dmg, p, s.owner, zoneAt(hit, p)); if (w.stun) stunEnt(hit, w.stun, s.owner); }
    else if (s.life > 0) { sparks(FD.fx, p, 4, 5); puff(FD.fx, p, 1, 1.2, .45, .3); flashAt(p, s.hue, 30, 40, .08); if (!w.small && Math.random() < .35) scarAt(p, .7, .4); }
    if (talHit && talMine(s.by)) talLand(s.by); talBy = null; FD.scene.remove(s.m); FD.shots.splice(i, 1);
  }
  for (let i = FD.beams.length - 1; i >= 0; i--) { const b = FD.beams[i]; b.life -= dt; const k = Math.max(0, b.life / b.max); b.m.scale.x = b.m.scale.y = b.w * k; if (b.life <= 0) { FD.scene.remove(b.m); if (!b.m.material.userData.keep) b.m.material.dispose(); FD.beams.splice(i, 1); } }
}

/* ---- units: team 0 = ours, 1 = hostile, 2 = neutral (never auto-targeted, but our fire still hits it) ---- */
const ERUN = 1.6, ftw = [];
function ftween(dur, fn, e = ease.io) { return new Promise(res => ftw.push({ t: 0, dur, fn, e, res })); }
function retarget() { FD.t0.length = FD.t1.length = 0; if (!P.dead) FD.t1.push(PE); for (const e of FD.ents) (e.team === 0 ? FD.t1 : FD.t0).push(e); }
function pickTarget(e) {
  let best = null, bd = 1e9;
  for (const o of e.team === 1 ? FD.t1 : FD.t0) {
    if (o.dead || o.team === 2 || o.team === e.team) continue; let d = e.pos.distanceTo(o.pos);
    if (o === PE) d *= e.hitP > 0 ? .4 : .75; if (o === e.focus) d *= .4; else if (o.kind === 'struct') d *= 2.2; if (d < bd) { bd = d; best = o; }
  }
  return best;
}
function seek(e, dt) {
  if (e.team === 2) return e.tgt = null; e.hitP = Math.max(0, (e.hitP || 0) - dt); e.tT = (e.tT || 0) - dt; const t = e.tgt;
  if (e.tT > 0 && t && !t.dead && t.team !== e.team && t.team !== 2) return t; e.tT = rand(.5, 1.1); return e.tgt = pickTarget(e);
}
const aimAt = (tg, sx, sy) => { _c.copy(tg.pos); _c.y += tg.cy; _c.x += rand(-sx, sx); _c.y += rand(-sy, sy); _c.z += rand(-sx, sx); return _c; };
/* shared ground steering with a simple "I am stuck, try sideways" detour */
function drive(e, want, spd, dt, rad, turnRate) {
  if (e.detT > 0) { e.detT -= dt; want += e.det; }
  const turn = clamp(angDiff(e.yaw, want) * 2, -1, 1), ox = e.pos.x, oz = e.pos.z; e.yaw += turn * turnRate * dt; e.v = damp(e.v, spd * (1 - .5 * Math.abs(turn)), 1.5, dt);
  _p.copy(e.pos); _p.x += Math.sin(e.yaw) * e.v * dt; _p.z += Math.cos(e.yaw) * e.v * dt; collide(_p, rad); e.pos.x = _p.x; e.pos.z = _p.z; e.pos.y = damp(e.pos.y, heightAt(e.pos.x, e.pos.z), 10, dt);
  if (e.v > 2 && Math.hypot(e.pos.x - ox, e.pos.z - oz) < e.v * dt * .35) { if ((e.stk = (e.stk || 0) + dt) > .5) { e.stk = 0; e.det = pick([-1, 1]) * 1.5; e.detT = 1.6; } } else e.stk = 0;
  return turn;
}
function killEnt(e, owner) {
  if (e.dead) return; e.dead = true; e.by = owner; talKill(e, owner); if (e.mech) e.mech.off = true; if (e.team === 1 && owner === 0) { P.kills++; YARD.loot.push({ kind: e.kind, sk: e.sk, vk: e.vk, cfg: e.mech && e.mech.cfg }); } else if (e.team === 1 && owner === 4 && MS.on) MS.v.rvk = (MS.v.rvk || 0) + 1; const at = e.pos.clone(), big = e.kind === 'mech' || e.kind === 'struct' || e.big; at.y += e.cy; if (e.onDead) e.onDead();
  explode(FD.fx, at, big ? 2.4 : 1.2); sfx.play('boom', big ? 1.2 : .7); FD.ents.splice(FD.ents.indexOf(e), 1);
  if (e.blast) { explode(FD.fx, at, 3.4); splash(at, e.blast, 70, 0); splash(at, e.blast, 70, 1); }
  if (e.onKill) e.onKill(e, owner);
  if (e.kind === 'drone' || e.nw) { if (e.crash) e.crash(owner); else FD.scene.remove(e.obj); return; }
  e.obj.traverse(c => { if (c.material && c.material.emissive && !c.userData.dk) { c.material = c.material.clone(); c.material.color.multiplyScalar(.3); c.material.emissiveIntensity = 0; c.userData.dk = 1; } });
  const r0 = e.obj.rotation.x, y0 = e.obj.position.y, dir = Math.random() < .5 ? 1 : -1, fall = e.kind === 'mech' ? 1.35 : e.kind === 'struct' ? .05 : .25, dy = e.kind === 'mech' ? 1.8 : e.kind === 'struct' ? -e.cy * .7 : 0;
  tween(1.5, k => { e.obj.rotation.x = r0 + dir * fall * k; e.obj.position.y = y0 + dy * k; if (k > .95 && !e.thud) { e.thud = 1; puff(FD.fx, e.pos, 14, 4, .5, .4, 2, 6); sfx.play('step', 1.4); } }, ease.in);
  const em = { p: at, kind: 'smoke', life: 40 }; FD.emit.push(em); FD.wrecks.push({ obj: e.obj, em, col: e.col });
  if (FD.wrecks.length > 9) { const w = FD.wrecks.shift(); FD.scene.remove(w.obj); w.em.life = 0; delCol(w.col); }
}
/* drones, turrets, tanks and ships have no Mech: they fire any weapon from a point, at a point */
function fireFrom(o, aim, w, e) {
  _d.copy(aim).sub(o).normalize(); const O = o.clone().addScaledVector(_d, w.off ?? 2), D0 = _d.clone(), sp = w.spread || 0, owner = e.rv && e.team === 0 ? 4 : e.team, A = aim.clone(); talBy = owner === 0 ? 'ally' : null;
  for (let i = 0; i < (w.salvo || 1); i++) { const D = D0.clone(); if (sp) D.add(_v.set(rand(-sp, sp), rand(-sp, sp), rand(-sp, sp))).normalize(); emitShot(O, D, w, owner, e.tgt || null, e.team === 1 ? 0xff3a2a : 0x7fe7ff, A); }
  talBy = null;
  if (o.distanceTo(P.pos) < 220) sfx.play(w.snd || SND[w.type] || 'laser', .3);
}
