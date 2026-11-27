/* ============ EVERYTHING THAT IS NOT A MECH: FIVE THINGS THAT FLY, SIX THAT DRIVE, FOUR THAT SIT STILL AND SHOOT ============
   Each kind keeps the entry it always had (mkDrone, mkTank, mkTurret) and takes a variant; with none given it builds what it built before, which is what the story chapters ask for by name */
const teamMat = t => t === 1 ? M.red : M.blue, teamGlow = t => t === 1 ? M.redGlow : M.green;
/* a flyer with a heading: turn toward `want`, fly forward, hold `alt` over the ground, bank into the turn */
function airFly(e, g, dt, want, sp, turn, alt, bank = .5) {
  if (Math.hypot(e.pos.x, e.pos.z) > 430 * FD.k) want = Math.atan2(-e.pos.x, -e.pos.z);
  const tr = clamp(angDiff(e.yaw, want) * 2, -1, 1); e.yaw += tr * turn * dt; e.pos.x += Math.sin(e.yaw) * sp * dt; e.pos.z += Math.cos(e.yaw) * sp * dt;
  e.pos.y = damp(e.pos.y, heightAt(e.pos.x, e.pos.z) + alt, 1.2, dt); g.rotation.set(0, e.yaw, 0); g.rotateZ(-tr * bank); return tr;
}
/* anything bigger than a drone comes down burning instead of vanishing */
function airCrash(e, big = 1) {
  e.crash = () => {
    const g = e.obj, v = V3(Math.sin(e.yaw || 0) * 16, 3, Math.cos(e.yaw || 0) * 16), sp = rand(-2.5, 2.5); FD.misc.push(g);
    FD.tick.push(dt => {
      v.y -= 24 * dt; g.position.addScaledVector(v, dt); g.rotation.x += dt * 1.2; g.rotation.z += dt * sp; if (Math.random() < dt * 30) FD.fx.smoke.emit(g.position.x, g.position.y, g.position.z, rand(-1, 1), rand(1, 3), rand(-1, 1), rand(1, 2), rand(2, 3.5) * big, .1, .1, .1, .5, -.2, .3, 2);
      if (g.position.y > heightAt(g.position.x, g.position.z) + 1) return true; explode(FD.fx, g.position, 1.5 * big); if (g.position.distanceTo(P.pos) < 260) sfx.play('boom', .8); FD.scene.remove(g); return false;
    });
  };
}
const AIR = {
  hunter(x, z, team) {
    const g = grp(FD.scene, x, heightAt(x, z) + 18, z), rot = []; sph(g, M.dark, 1.3, 0, 0, 0, 1, .7, 1.4); box(g, teamMat(team), 4.4, .2, 1.1, 0, .25, 0); cyl(g, M.black, .14, .14, 1.8, 0, -.5, 1.1, Z); noShadow(sph(g, teamGlow(team), .32, 0, .1, 1.5));
    for (const s of [-1, 1]) { cyl(g, M.girder, 1, 1, .3, s * 2.3, .35, 0, 0, 0, 0, 12); const r = grp(g, s * 2.3, .55, 0); box(r, M.black, 1.9, .05, .2); box(r, M.black, .2, .05, 1.9); rot.push(r); }
    const e = { kind: 'drone', team, name: 'HUNTER DRONE', obj: g, pos: g.position, cy: 0, r: 2.6, hp: 34, max: 34, ang: rand(TAU), rad: rand(55, 95), fireT: rand(1, 3), dir: pick([-1, 1]), home: V3(x, 0, z) };
    e.update = (dt, t) => {
      for (const r of rot) r.rotation.y += dt * 40; e.ang += e.dir * dt * 15 / e.rad; const tg = seek(e, dt), chase = tg && (e.alert || e.pos.distanceTo(tg.pos) < 420), c = chase ? tg.pos : e.home;
      const tx = c.x + Math.sin(e.ang) * e.rad, tz = c.z + Math.cos(e.ang) * e.rad, ty = Math.max(heightAt(tx, tz), chase ? c.y : -99) + 15 + Math.sin(t * 1.3 + e.rad) * 3;
      _d.set(tx - e.pos.x, ty - e.pos.y, tz - e.pos.z); const d = _d.length(); if (d > .1) e.pos.addScaledVector(_d, Math.min(1, 32 * dt / d));
      if (!chase) return; g.lookAt(tg.pos.x, tg.pos.y + tg.cy, tg.pos.z); g.rotateZ(Math.sin(t * 2 + e.rad) * .15);
      e.fireT -= dt; if (e.fireT < 0 && !e.pacify && e.pos.distanceTo(tg.pos) < 180) { e.fireT = rand(2.2, 4); fireFrom(e.pos, aimAt(tg, 6, 3), { type: 'bolt', dmg: 7, speed: 110 }, e); }
    };
    return e;
  },
  /* SCREAMER: a flying bomb. It comes straight at you, and the only answer is to shoot it first */
  scr(x, z, team) {
    const g = grp(FD.scene, x, heightAt(x, z) + 26, z); cyl(g, M.dark, .2, .7, 3.4, 0, 0, .6, Z, 0, 0, 8); cyl(g, teamMat(team), .72, .5, 1.2, 0, 0, -1.6, Z, 0, 0, 8); box(g, teamMat(team), 3.6, .1, 1.3, 0, 0, -.9); box(g, M.dark, .1, 1.5, 1.1, 0, .4, -1.5);
    for (const s of [-1, 1]) box(g, M.hazard, .6, .12, 1.3, s * 1.5, 0, -.9); noShadow(sph(g, teamGlow(team), .36, 0, 0, -2.3)); noShadow(sph(g, M.amber, .2, 0, 0, 2.3));
    const e = { kind: 'drone', team, name: 'SCREAMER', obj: g, pos: g.position, cy: 0, r: 2.3, hp: 14, max: 14, home: V3(x, 0, z), ang: rand(TAU), vel: V3(), scrT: 0 };
    e.update = dt => {
      const tg = seek(e, dt), chase = tg && !e.pacify && (e.alert || e.pos.distanceTo(tg.pos) < 380);
      if (chase) { _c.copy(tg.pos); _c.y += tg.cy; } else { e.ang += dt * .5; _c.set(e.home.x + Math.sin(e.ang) * 60, heightAt(e.home.x, e.home.z) + 26, e.home.z + Math.cos(e.ang) * 60); }
      _d.copy(_c).sub(e.pos); const d = _d.length(); e.vel.lerp(_d.multiplyScalar((chase ? 44 : 22) / (d || 1)), Math.min(1, (chase ? 2.2 : 1.5) * dt)); e.pos.addScaledVector(e.vel, dt);
      const gy = heightAt(e.pos.x, e.pos.z) + 2.5; if (e.pos.y < gy) e.pos.y = gy; g.lookAt(e.pos.x + e.vel.x, e.pos.y + e.vel.y, e.pos.z + e.vel.z);
      FD.fx.spark.emit(e.pos.x, e.pos.y, e.pos.z, 0, 0, 0, .18, 1, 5, 2.2, .5, .7);
      if (!chase) return; if ((e.scrT -= dt) < 0 && d < 170) { e.scrT = 1.1; const pd = e.pos.distanceTo(P.pos); if (pd < 220) sfx.play('scream', clamp(1.2 - pd / 200, .2, 1)); }
      if (d < tg.r + 2.5) { const at = e.pos.clone(); explode(FD.fx, at, 1.3); splash(at, 10, 60, e.team); killEnt(e, 2); }
    };
    return e;
  },
  /* SHRIKE: a gunship. It circles close and fast and hoses whatever it is circling */
  shr(x, z, team) {
    const g = grp(FD.scene, x, heightAt(x, z) + 24, z), rot = grp(g, 0, 2.2, -.4); tbox(g, M.dark, 2.6, 2.2, 8, .7, .5, 0, 0, 0); tbox(g, teamMat(team), 2.2, 1.4, 3, .7, .6, 0, .5, 3.4, .25); noShadow(box(g, M.cyan, 1.6, .7, .1, 0, 1, 4.6, -.5));
    cyl(g, M.girder, .5, .22, 6, 0, .6, -6, Z, 0, 0, 8); box(g, teamMat(team), .16, 2.4, 1.6, 0, 1.6, -8.4); box(g, M.dark, 3.2, .14, 1, 0, .8, -8.4); cyl(g, M.girder, .3, .3, 1.2, 0, 1.6, -.4);
    for (let i = 0; i < 3; i++) box(rot, M.black, 13, .08, .5, 0, 0, 0, 0, i * PI / 3, 0);
    for (const s of [-1, 1]) { box(g, M.girder, 3.4, .25, 1.6, s * 2.4, -.2, .2); cyl(g, M.black, .5, .5, 2.6, s * 3.6, -.6, .4, Z, 0, 0, 8); cyl(g, M.redGlow, .3, .3, .06, s * 3.6, -.6, 1.72, Z, 0, 0, 8); box(g, M.girder, .2, .2, 5, s * 1.4, -1.9, 0); box(g, M.girder, .16, 1, .16, s * 1.4, -1.4, 1.6); }
    const gun = grp(g, 0, -1.4, 3.2); sph(gun, M.black, .7); cyl(gun, M.black, .13, .13, 2.4, 0, 0, 1.3, Z);
    const e = { kind: 'drone', team, name: 'SHRIKE GUNSHIP', obj: g, pos: g.position, cy: 0, r: 3.8, hp: 95, max: 95, yaw: rand(TAU), home: V3(x, 0, z), side: pick([-1, 1]), fireT: rand(2, 4), burst: 0 }; airCrash(e, 1.2);
    e.update = dt => {
      rot.rotation.y += dt * 30; const tg = seek(e, dt), chase = tg && (e.alert || e.pos.distanceTo(tg.pos) < 430), c = chase ? tg.pos : e.home, dx = c.x - e.pos.x, dz = c.z - e.pos.z, d = Math.hypot(dx, dz), to = Math.atan2(dx, dz);
      airFly(e, g, dt, d > 150 ? to : to + e.side * clamp(1.57 + (95 - d) * .02, .7, 2.3), chase ? 34 : 18, 1.5, 24 + (chase ? tg.pos.y - heightAt(tg.pos.x, tg.pos.z) : 0) * .5);
      if (!chase || e.pacify) return; gun.lookAt(tg.pos.x, tg.pos.y + tg.cy, tg.pos.z); e.fireT -= dt;
      if (e.fireT < 0 && d < 190) { e.burst = (e.burst + 1) % 7; e.fireT = e.burst ? .1 : rand(2.8, 4.4); gun.getWorldPosition(_o); fireFrom(_o, aimAt(tg, d * .05, d * .03), { type: 'bullet', dmg: 3.5, speed: 170, small: 1, snd: 'mg', off: 1 }, e); }
    };
    return e;
  },
  /* VULTURE: a bomber. It flies over, and the ground it flew over goes up a couple of seconds later: watch for the rings and do not be standing in them */
  vul(x, z, team) {
    const g = grp(FD.scene, x, heightAt(x, z) + 46, z); tbox(g, M.dark, 4, 2.6, 13, .7, .6, 0, 0, 0); cyl(g, M.dark, .5, 2, 4, 0, 0, 8.4, Z, 0, 0, 8); noShadow(box(g, M.cyan, 2.2, .8, .1, 0, 1, 6.2, -.6));
    for (const s of [-1, 1]) { tbox(g, teamMat(team), 12, .5, 6, .25, .5, s * 7.6, .3, -1.5, 0, 0, s * .06); cyl(g, M.girder, 1.1, 1.3, 4.4, s * 5, -.6, -1, Z, 0, 0, 10); noShadow(cyl(g, M.amber, .9, .9, .08, s * 5, -.6, -3.24, Z, 0, 0, 10)); tbox(g, M.dark, .3, 3, 3.4, 1, .4, s * 2.2, 2, -5.6, 0, 0, s * -.3); box(g, M.hazard, 2.4, .1, 6.02, s * 11, .62, -1.5); }
    box(g, M.black, 2.6, .5, 6, 0, -1.5, 0); for (let i = 0; i < 3; i++) cyl(g, M.rust, .45, .45, 1.8, 0, -2, -2 + i * 2, Z, 0, 0, 8);
    const e = { kind: 'drone', team, name: 'VULTURE BOMBER', obj: g, pos: g.position, cy: 0, r: 5.6, hp: 160, max: 160, yaw: rand(TAU), home: V3(x, 0, z), egr: 0, wob: rand(TAU) }; airCrash(e, 1.6);
    e.update = dt => {
      const tg = seek(e, dt), chase = tg && (e.alert || e.pos.distanceTo(tg.pos) < 480), c = chase ? tg.pos : e.home, dx = c.x - e.pos.x, dz = c.z - e.pos.z, d = Math.hypot(dx, dz), to = Math.atan2(dx, dz);
      e.egr -= dt; e.wob += dt * .4; airFly(e, g, dt, e.egr > 0 ? e.yaw : chase ? to : to + 1.3, chase ? 38 : 24, .75, 46, .35);
      for (const s of [-1, 1]) if (Math.random() < dt * 20) { _v.set(s * 5, -.6, -3.6).applyQuaternion(g.quaternion).add(e.pos); FD.fx.smoke.emit(_v.x, _v.y, _v.z, 0, 0, 0, rand(.6, 1.2), 1.4, .7, .7, .7, .22, 0, .3, 2); }
      if (!chase || e.pacify || e.egr > 0 || d > 34) return; e.egr = 4.6;
      /* three bombs along the line it is flying, each where the target will be by the time it lands */
      for (let i = 0; i < 3; i++) { const bx = e.pos.x + Math.sin(e.yaw) * (i * 16 + 10) + rand(-4, 4), bz = e.pos.z + Math.cos(e.yaw) * (i * 16 + 10) + rand(-4, 4); let t = i * .3; FD.tick.push(dt => { if ((t -= dt) > 0) return true; if (!e.dead) shell(bx, bz, 30, 11, 1.9, e.team); return false; }); }
    };
    return e;
  },
  /* HARPY: a missile carrier that hangs back out of reach and sends salvos in */
  hrp(x, z, team) {
    const g = grp(FD.scene, x, heightAt(x, z) + 30, z), rot = []; tbox(g, M.dark, 2.8, 2, 5.4, .7, .7, 0, 0, 0); tbox(g, teamMat(team), 2.2, 1.2, 2, .6, .5, 0, .2, 3.2, .3); noShadow(box(g, M.cyan, 1.4, .5, .1, 0, .7, 3.9, -.5)); box(g, M.girder, 9, .3, 1.2, 0, .9, -.4);
    for (const s of [-1, 1]) { cyl(g, M.girder, 1.9, 1.9, .5, s * 4.6, 1, -.4, 0, 0, 0, 14); cyl(g, M.black, 1.7, 1.7, .52, s * 4.6, 1, -.4, 0, 0, 0, 14); const r = grp(g, s * 4.6, 1.3, -.4); box(r, M.black, 3.2, .06, .3); box(r, M.black, .3, .06, 3.2); rot.push(r); tbox(g, teamMat(team), 1.5, 1.2, 2.6, .95, .95, s * 2.2, -1, .4); for (let i = 0; i < 4; i++) cyl(g, M.redGlow, .2, .2, .06, s * 2.2 + (i % 2 - .5) * .6, -1 + (i > 1 ? .28 : -.28), 1.72, Z, 0, 0, 6); }
    box(g, M.dark, .2, 1.6, 1.6, 0, .9, -3.2); noShadow(sph(g, teamGlow(team), .28, 0, -.9, 2.6));
    const e = { kind: 'drone', team, name: 'HARPY', obj: g, pos: g.position, cy: 0, r: 3.8, hp: 75, max: 75, yaw: 0, ang: rand(TAU), rad: rand(135, 175), fireT: rand(3, 6), dir: pick([-1, 1]), home: V3(x, 0, z) }; airCrash(e, 1.1);
    e.update = (dt, t) => {
      for (const r of rot) r.rotation.y += dt * 36; e.ang += e.dir * dt * 9 / e.rad; const tg = seek(e, dt), chase = tg && (e.alert || e.pos.distanceTo(tg.pos) < 460), c = chase ? tg.pos : e.home, R = chase ? e.rad : 50;
      const tx = c.x + Math.sin(e.ang) * R, tz = c.z + Math.cos(e.ang) * R, ty = Math.max(heightAt(tx, tz), chase ? c.y : -99) + 30 + Math.sin(t * .9 + e.rad) * 3;
      _d.set(tx - e.pos.x, ty - e.pos.y, tz - e.pos.z); const d = _d.length(); if (d > .1) e.pos.addScaledVector(_d, Math.min(1, 24 * dt / d));
      if (!chase) return; e.yaw = Math.atan2(tg.pos.x - e.pos.x, tg.pos.z - e.pos.z); g.rotation.set(.12, e.yaw, Math.sin(t * 1.4 + e.rad) * .08);
      e.fireT -= dt; if (e.fireT < 0 && !e.pacify && e.pos.distanceTo(tg.pos) < 270) { e.fireT = rand(5.5, 7.5); fireFrom(e.pos, aimAt(tg, 5, 3), { type: 'missile', dmg: 9, speed: 80, turn: 2.4, life: 5, blast: 5, salvo: 3, spread: .06 }, e); }
    };
    return e;
  },
};
function mkDrone(x, z, team = 1, v = 'hunter') { const e = (AIR[v] || AIR.hunter)(x, z, team); e.vk = v; FD.ents.push(e); return e; }

const TUR = {
  sentry(x, z, team) {
    const g = grp(FD.scene, x, heightAt(x, z), z); cyl(g, M.girder, 2.6, 3.2, 3, 0, .5, 0, 0, 0, 0, 8); cyl(g, M.dark, 1.6, 1.8, 1, 0, 2.4, 0); const hd = grp(g, 0, 3.4, 0); tbox(hd, teamMat(team), 3, 1.8, 3.4, .8, .8, 0, .3, 0); noShadow(box(hd, teamGlow(team), 1.2, .25, .1, 0, .5, 1.72));
    const br = grp(hd, 0, .2, 1.2); for (const s of [-1, 1]) { cyl(br, M.black, .2, .24, 3.6, s * .8, 0, 1.6, Z); box(br, M.girder, .6, .7, 1.4, s * .8, 0, .2); }
    const e = { kind: 'turret', team, name: 'SENTRY TURRET', obj: g, pos: g.position, cy: 3.2, r: 3.2, hp: 80, max: 80, fireT: rand(2), burst: 0, col: addCol({ x, z, r: 3, top: g.position.y + 5 }) };
    e.update = dt => {
      const tg = seek(e, dt); if (!tg) return; const dx = tg.pos.x - x, dz = tg.pos.z - z, d = Math.hypot(dx, dz); if (d > 260 && !e.alert) return;
      hd.rotation.y += angDiff(hd.rotation.y, Math.atan2(dx, dz)) * Math.min(1, 2.5 * dt); br.rotation.x = -Math.atan2(tg.pos.y + tg.cy - e.pos.y - 3.6, d);
      e.fireT -= dt; if (e.fireT < 0 && d < 230) { e.burst = (e.burst + 1) % 4; e.fireT = e.burst ? .16 : rand(2, 3.2); br.getWorldPosition(_o); fireFrom(_o, aimAt(tg, d * .03, d * .02), { type: 'bullet', dmg: 6, speed: 150 }, e); }
    };
    return e;
  },
  /* HYDRA: a missile battery. Four at a time, and they follow */
  hydra(x, z, team) {
    const g = grp(FD.scene, x, heightAt(x, z), z); cyl(g, M.girder, 3.4, 3.9, 1.6, 0, .6, 0, 0, PI / 6, 0, 6); cyl(g, M.dark, 1.5, 1.9, 2.2, 0, 2.4, 0, 0, 0, 0, 10); const hd = grp(g, 0, 4, 0); box(hd, M.dark, 1.2, 1.4, 1.2); const br = grp(hd, 0, .6, 0, -.5);
    for (const s of [-1, 1]) { tbox(br, teamMat(team), 2, 1.8, 3.6, .95, .95, s * 1.7, 0, .4); box(br, M.black, 1.8, 1.6, .1, s * 1.7, 0, 2.21); for (let i = 0; i < 4; i++) cyl(br, M.redGlow, .26, .26, .06, s * 1.7 + (i % 2 - .5) * .8, (i > 1 ? .4 : -.4), 2.27, Z, 0, 0, 8); box(br, M.hazard, 2.02, .22, 3.62, s * 1.7, -.8, .4); }
    noShadow(sph(hd, teamGlow(team), .3, 0, 1, .6)); cyl(g, M.chrome, .05, .05, 4, -2, 4, -2);
    const e = { kind: 'turret', team, name: 'HYDRA BATTERY', obj: g, pos: g.position, cy: 3.6, r: 3.6, hp: 115, max: 115, fireT: rand(3, 6), col: addCol({ x, z, r: 3.4, top: g.position.y + 6.5 }) };
    e.update = dt => {
      const tg = seek(e, dt); if (!tg) return; const dx = tg.pos.x - x, dz = tg.pos.z - z, d = Math.hypot(dx, dz); if (d > 320 && !e.alert) return;
      hd.rotation.y += angDiff(hd.rotation.y, Math.atan2(dx, dz)) * Math.min(1, 1.8 * dt);
      e.fireT -= dt; if (e.fireT < 0 && d < 330 && !e.pacify) { e.fireT = rand(5.5, 7.5); br.getWorldPosition(_o); _o.y += 1; fireFrom(_o, aimAt(tg, 4, 3), { type: 'missile', dmg: 9, speed: 78, turn: 2.4, life: 6, blast: 5, salvo: 4, spread: .07, loft: .25 }, e); }
    };
    return e;
  },
  /* PRISM: a laser tower. It lights up for a second before it fires, and then the beam walks after you */
  prism(x, z, team) {
    const g = grp(FD.scene, x, heightAt(x, z), z), core = glowMat(team === 1 ? 0xff5030 : 0x60c8ff, 1.5); cyl(g, M.girder, 2.8, 3.6, 1.4, 0, .5, 0, 0, 0, 0, 8);
    for (let i = 0; i < 3; i++) { const a = i * TAU / 3; box(g, M.girder, .5, 10.6, .5, Math.sin(a) * 1.9, 5.6, Math.cos(a) * 1.9, Math.cos(a) * .12, 0, -Math.sin(a) * .12); }
    cyl(g, M.dark, .9, 1.1, 9, 0, 5.4, 0, 0, 0, 0, 8); for (const y of [3, 6, 9]) cyl(g, teamMat(team), 1.5, 1.5, .3, 0, y, 0, 0, 0, 0, 10);
    const hd = grp(g, 0, 11.2, 0); cyl(hd, M.dark, 1.7, 1.2, 1, 0, -.4, 0, 0, 0, 0, 10); const lens = noShadow(sph(hd, core, 1.15, 0, .8, 0, 1, 1.25, 1)); for (let i = 0; i < 4; i++) { const a = i * PI / 2 + PI / 4; box(hd, M.chrome, .14, 2.4, .14, Math.sin(a) * 1.3, .8, Math.cos(a) * 1.3); }
    const e = { kind: 'turret', team, name: 'PRISM TOWER', obj: g, pos: g.position, cy: 8, r: 4.4, hp: 130, max: 130, fireT: rand(3, 5), chg: 0, lase: 0, aimP: V3(), col: addCol({ x, z, r: 3, top: g.position.y + 12.5 }) };
    e.update = (dt, t) => {
      const tg = seek(e, dt), dx = tg ? tg.pos.x - x : 0, dz = tg ? tg.pos.z - z : 0, d = Math.hypot(dx, dz), on = tg && !e.pacify && (d < 300 || e.alert) && d < 330; core.emissiveIntensity = 1.5 + e.chg * 9 + (e.lase > 0 ? 8 : 0); lens.scale.setScalar(1 + e.chg * .25);
      if (!on) { e.chg = Math.max(0, e.chg - dt); e.lase = 0; return; } _c.copy(tg.pos); _c.y += tg.cy;
      if (e.lase > 0) { e.lase -= dt; e.aimP.lerp(_c, Math.min(1, 1.6 * dt)); if ((e.tk = (e.tk || 0) - dt) < 0) { e.tk = .1; lens.getWorldPosition(_o); fireFrom(_o, e.aimP, { type: 'beam', dmg: 4.6, range: 340, bw: .34, bl: .13, off: 1.3 }, e); } if (e.lase <= 0) e.fireT = rand(4.5, 6.5); return; }
      if ((e.fireT -= dt) > 0) return; if (!e.chg) { e.aimP.copy(_c); e.aimP.x += rand(-9, 9); e.aimP.z += rand(-9, 9); if (e.pos.distanceTo(P.pos) < 300) sfx.play('ion', .5); } e.chg += dt / 1.2; if (e.chg >= 1) { e.chg = 0; e.lase = .9; }
    };
    return e;
  },
  /* BASILISK: a mortar pit. It cannot hit what is on top of it, and it cannot miss what stands still */
  bas(x, z, team) {
    const g = grp(FD.scene, x, heightAt(x, z), z); for (let i = 0; i < 10; i++) { const a = i * TAU / 10; tbox(g, EM.conc, 2.4, 1.9, 1.3, .8, .7, Math.sin(a) * 4.2, .9, Math.cos(a) * 4.2, 0, a, 0); }
    cyl(g, M.dark, 3.6, 3.6, .4, 0, .2, 0, 0, 0, 0, 12); cyl(g, M.girder, 1.5, 1.8, 1.2, 0, .9, 0, 0, 0, 0, 8); const br = grp(g, 0, 1.6, 0, -1.1); cyl(br, M.black, .75, .9, 4.4, 0, 0, 1.8, Z, 0, 0, 12); cyl(br, teamMat(team), 1, 1, .5, 0, 0, .4, Z, 0, 0, 12); cyl(br, M.hazard, .92, .92, .3, 0, 0, 3.8, Z, 0, 0, 12);
    for (const [bx, bz] of [[2.2, -1.4], [-2.3, .6]]) box(g, M.rust, 1.2, .9, 1.2, bx, .85, bz, 0, .4); noShadow(box(g, teamGlow(team), .4, .4, .4, 0, 2.2, -1.4));
    const e = { kind: 'turret', team, name: 'BASILISK MORTAR', obj: g, pos: g.position, cy: 1.8, r: 4.6, hp: 150, max: 150, fireT: rand(2, 5), col: addCol({ x, z, r: 4.6, top: g.position.y + 2.2 }) };
    e.update = dt => {
      const tg = seek(e, dt); if (!tg) return; const dx = tg.pos.x - x, dz = tg.pos.z - z, d = Math.hypot(dx, dz); if (d > 380 && !e.alert) return; g.rotation.y += angDiff(g.rotation.y, Math.atan2(dx, dz)) * Math.min(1, 1.5 * dt);
      e.fireT -= dt; if (e.fireT > 0 || d > 430 || d < 70 || e.pacify) return; e.fireT = rand(4.5, 6.5); const lead = tg === PE ? P.v * 1.6 : 0;
      shell(tg.pos.x + Math.sin(P.yaw) * lead + rand(-9, 9), tg.pos.z + Math.cos(P.yaw) * lead + rand(-9, 9), 30, 11, 2.4, e.team); br.getWorldPosition(_o); _o.y += 3; puff(FD.fx, _o, 5, 2, .4, .4, 5, 2); if (e.pos.distanceTo(P.pos) < 300) sfx.play('mortar', .7);
    };
    return e;
  },
};
function mkTurret(x, z, team = 1, v = 'sentry') { const e = (TUR[v] || TUR.sentry)(x, z, team); e.vk = v; FD.ents.push(e); return e; }

/* what every ground vehicle does with itself: close to its own distance, circle there, follow a leader if it has one and nothing to shoot. K: sp top speed, near the distance it holds,
   back (a share of near inside which it backs off), tr turn rate, rad its footprint, gy gun height, face (must point the hull at the target), tick(dt, t, moving), fire(dt, tg, d, to) */
function tankBrain(e, g, hd, br, K) {
  e.update = (dt, t) => {
    const tg = seek(e, dt); let want = e.yaw, spd = 0, d = 1e9, to = 0, eng = false;
    if (tg) { const dx = tg.pos.x - e.pos.x, dz = tg.pos.z - e.pos.z; d = Math.hypot(dx, dz); to = Math.atan2(dx, dz); if (d < 340 || e.alert) { eng = true; const far = d > K.near; want = far ? to : K.face ? to : d < K.near * (K.back || 0) ? to + PI : to + e.strafe * 1.5; spd = far ? K.sp : K.face ? 0 : K.sp * .5; } }
    if (!eng && e.lead && !e.lead.dead) { const dx = e.lead.pos.x - e.pos.x, dz = e.lead.pos.z - e.pos.z, dd = Math.hypot(dx, dz); if (dd > 26) { want = Math.atan2(dx, dz); spd = dd > 60 ? K.sp : K.sp * .65; } }
    drive(e, want, spd, dt, K.rad || 3.2, K.tr || 1.3); g.rotation.y = e.yaw; if (K.tick) K.tick(dt, t, e.v); if (!tg || d > 340) return;
    if (hd) hd.rotation.y += angDiff(hd.rotation.y, to - e.yaw) * Math.min(1, 3 * dt); if (br) br.rotation.x = -Math.atan2(tg.pos.y + tg.cy - e.pos.y - (K.gy || 3), d);
    if (!e.pacify) K.fire(dt, tg, d, to);
  };
}
const tankEnt = (g, team, name, r, cy, hp, o) => ({ kind: 'tank', team, name, obj: g, pos: g.position, cy, r, hp, max: hp, yaw: rand(TAU), v: 0, fireT: rand(1, 3), strafe: pick([-1, 1]), lead: o.lead || null, burst: 0 });
const TANKS = {
  striker(x, z, team, o) {
    const g = grp(FD.scene, x, heightAt(x, z), z); tbox(g, teamMat(team), 4.6, 1.5, 7.4, .82, .8, 0, 1.5, 0); for (const s of [-1, 1]) { box(g, M.black, 1.3, 1.5, 7.8, s * 2.5, .75, 0); box(g, M.girder, 1.4, .2, 8, s * 2.5, 1.55, 0); }
    const hd = grp(g, 0, 2.3, -.4); tbox(hd, M.dark, 3, 1.3, 3.6, .75, .75, 0, .6, 0); const br = grp(hd, 0, .7, 1.4); cyl(br, M.black, .22, .26, 4.6, 0, 0, 2.2, Z); noShadow(box(hd, teamGlow(team), .9, .2, .1, 0, .9, 1.82));
    const e = tankEnt(g, team, 'STRIKER TANK', 4, 2, 120, o);
    tankBrain(e, g, hd, br, { sp: 15, near: 120, fire(dt, tg, d) { e.fireT -= dt; if (e.fireT < 0 && d < 220) { e.fireT = rand(2.4, 3.8); br.getWorldPosition(_o); fireFrom(_o, aimAt(tg, d * .035, d * .02), { type: 'bullet', dmg: 11, speed: 150 }, e); } } });
    return e;
  },
  /* DINGO: a scout car. Quick, thin, and never where the last shot went */
  dingo(x, z, team, o) {
    const g = grp(FD.scene, x, heightAt(x, z), z), wh = []; tbox(g, teamMat(team), 3, 1.1, 6, .75, .8, 0, 1.5, 0); tbox(g, M.dark, 2.6, .8, 2.4, .7, .5, 0, 1.2, 3.2, .5); noShadow(box(g, M.cyan, 1.8, .4, .1, 0, 1.9, 2.3, -.6));
    for (const s of [-1, 1]) for (const zz of [-2.1, 0, 2.1]) wh.push(cyl(g, M.black, .8, .8, .6, s * 1.75, .8, zz, 0, 0, Z, 10)); box(g, M.girder, 3.6, .2, 5.4, 0, .9, 0);
    const hd = grp(g, 0, 2.2, -.6); cyl(hd, M.dark, 1, 1.2, .7, 0, .2, 0, 0, 0, 0, 8); const br = grp(hd, 0, .4, .4); for (const s of [-1, 1]) cyl(br, M.black, .09, .09, 2.2, s * .25, 0, 1.2, Z); cyl(g, M.chrome, .03, .03, 3, -1.1, 3.4, -2.4); noShadow(sph(hd, teamGlow(team), .16, 0, .7, .2));
    const e = tankEnt(g, team, 'DINGO SCOUT', 3.1, 1.6, 55, o);
    tankBrain(e, g, hd, br, { sp: 27, near: 70, tr: 2.1, rad: 2.4, gy: 2.6, tick(dt, t, v) { for (const w of wh) w.rotation.x += v * dt; }, fire(dt, tg, d) { e.fireT -= dt; if (e.fireT < 0 && d < 170) { e.burst = (e.burst + 1) % 6; e.fireT = e.burst ? .09 : rand(1.8, 3); br.getWorldPosition(_o); fireFrom(_o, aimAt(tg, d * .05, d * .03), { type: 'bullet', dmg: 2.4, speed: 170, small: 1, snd: 'mg', off: 1.4 }, e); } } });
    return e;
  },
  /* MAMMOTH: a heavy tank. Twin guns, explosive shells, and more armour than a light mech */
  mam(x, z, team, o) {
    const g = grp(FD.scene, x, heightAt(x, z), z); tbox(g, teamMat(team), 7, 2.2, 11.4, .85, .82, 0, 2.3, 0); tbox(g, M.dark, 6, 1.4, 3, .9, .4, 0, 1.9, 6.4, .5);
    for (const s of [-1, 1]) for (const zz of [-3.2, 3.2]) { box(g, M.black, 1.9, 2.2, 5.4, s * 3.9, 1.1, zz); box(g, M.girder, 2.1, .25, 5.7, s * 3.9, 2.3, zz); box(g, M.hazard, 2.12, .3, .8, s * 3.9, 2.3, zz + 2.4 * Math.sign(zz)); }
    const hd = grp(g, 0, 3.5, -.8); tbox(hd, M.dark, 5.4, 2, 6, .78, .78, 0, .9, 0); box(hd, teamMat(team), 5.5, .3, 6.1, 0, .3, 0); const br = grp(hd, 0, 1, 2.6); for (const s of [-1, 1]) { cyl(br, M.black, .34, .4, 7.4, s * 1.1, 0, 3.6, Z, 0, 0, 10); cyl(br, M.girder, .56, .56, 1, s * 1.1, 0, 7, Z, 0, 0, 10); box(br, M.girder, 1, 1.1, 2, s * 1.1, 0, .4); }
    noShadow(box(hd, teamGlow(team), 1.6, .3, .1, 0, 1.5, 3.02)); cyl(hd, M.dark, .9, 1, .6, 1.4, 2.2, -1.2, 0, 0, 0, 8); cyl(hd, M.chrome, .04, .04, 4, -2, 3.9, -2.4);
    const e = tankEnt(g, team, 'MAMMOTH', 5.8, 3, 340, o), gun = { type: 'bullet', dmg: 20, speed: 165, big: 1.7, blast: 4, snd: 'ac' };
    tankBrain(e, g, hd, br, { sp: 8.5, near: 150, tr: .8, rad: 5, gy: 4.5, fire(dt, tg, d) { e.fireT -= dt; if (e.fireT < 0 && d < 260) { e.burst = (e.burst + 1) % 2; e.fireT = e.burst ? .3 : rand(3.2, 4.6); br.getWorldPosition(_o); _o.x += (e.burst ? 1 : -1) * Math.cos(e.yaw + hd.rotation.y) * 1.1; _o.z -= (e.burst ? 1 : -1) * Math.sin(e.yaw + hd.rotation.y) * 1.1; fireFrom(_o, aimAt(tg, d * .03, d * .02), gun, e); } } });
    return e;
  },
  /* HAILSTORM: a missile carrier. It stays a long way off and backs away from anything that comes for it */
  hail(x, z, team, o) {
    const g = grp(FD.scene, x, heightAt(x, z), z); tbox(g, M.dark, 4.4, 1.3, 8.6, .9, .9, 0, 1.5, 0); for (const s of [-1, 1]) { box(g, M.black, 1.2, 1.4, 8.8, s * 2.5, .7, 0); box(g, M.girder, 1.3, .2, 9, s * 2.5, 1.45, 0); } tbox(g, teamMat(team), 3.4, 1.5, 2.4, .8, .7, 0, 2.6, 3); noShadow(box(g, M.cyan, 2.4, .5, .1, 0, 2.9, 4.1, -.4));
    const hd = grp(g, 0, 2.3, -1.6); cyl(hd, M.girder, 1.4, 1.6, .6, 0, .2, 0, 0, 0, 0, 10); const br = grp(hd, 0, 1.4, 0, -.55); tbox(br, teamMat(team), 4.2, 2.4, 5, .96, .96, 0, 0, 0); box(br, M.black, 3.9, 2.1, .1, 0, 0, 2.52); box(br, M.hazard, 4.22, .25, 5.02, 0, -1.05, 0);
    for (let i = 0; i < 8; i++) cyl(br, M.redGlow, .3, .3, .06, (i % 4 - 1.5) * .92, (i > 3 ? .5 : -.5), 2.58, Z, 0, 0, 8); const dish = grp(g, -1.4, 3.6, 2.6); sph(dish, M.steel, .9, 0, 0, 0, 1, 1, .25);
    const e = tankEnt(g, team, 'HAILSTORM', 4.3, 2.2, 110, o);
    tankBrain(e, g, hd, null, { sp: 11, near: 230, back: .6, tr: 1.1, rad: 3.4, tick(dt) { dish.rotation.y += dt * 2; }, fire(dt, tg, d) { e.fireT -= dt; if (e.fireT < 0 && d < 330 && d > 50) { e.fireT = rand(7, 9.5); br.getWorldPosition(_o); _o.y += 1.5; fireFrom(_o, aimAt(tg, 5, 3), { type: 'missile', dmg: 5, speed: 85, turn: 3.4, life: 8, loft: .45, blast: 5, salvo: 8, spread: .09 }, e); } } });
    return e;
  },
  /* FURNACE: a flame tank. It wants to be on top of you, and what it carries goes up when it does */
  fur(x, z, team, o) {
    const g = grp(FD.scene, x, heightAt(x, z), z); tbox(g, teamMat(team), 5, 1.6, 7.6, .85, .85, 0, 1.6, 0); tbox(g, M.dark, 4.6, 1.6, 2.4, .9, .3, 0, 1.4, 4.4, .6); for (const s of [-1, 1]) { box(g, M.black, 1.4, 1.6, 8, s * 2.7, .8, 0); box(g, M.girder, 1.5, .2, 8.2, s * 2.7, 1.65, 0); }
    cyl(g, M.yellow, 1.5, 1.5, 3.6, 0, 3.1, -2, 0, 0, Z, 12); cyl(g, M.hazard, 1.54, 1.54, .5, 0, 3.1, -2, 0, 0, Z, 12); for (const s of [-1, 1]) sph(g, M.yellow, 1.5, s * 1.8, 3.1, -2, .5, 1, 1);
    const hd = grp(g, 0, 2.5, 1.4); cyl(hd, M.dark, 1.3, 1.5, .9, 0, .3, 0, 0, 0, 0, 8); const br = grp(hd, 0, .5, .6); cyl(br, M.girder, .3, .3, 2.6, 0, 0, 1.3, Z); cyl(br, M.black, .6, .34, 1, 0, 0, 3, Z, 0, 0, 10); const pl = noShadow(sph(br, M.amber, .2, 0, .3, 3.3)); cyl(g, M.chrome, .08, .08, 3, .8, 2.6, -.2, Z);
    const e = tankEnt(g, team, 'FURNACE', 4.4, 2.2, 200, o); e.blast = 13;
    tankBrain(e, g, hd, br, { sp: 17, near: 26, tr: 1.4, rad: 3.4, gy: 3, tick() { pl.scale.setScalar(.8 + Math.random() * .6); }, fire(dt, tg, d) { e.fireT -= dt; if (e.fireT < 0 && d - tg.r < 48) { e.fireT = .1; br.getWorldPosition(_o); fireFrom(_o, aimAt(tg, 1, 1), { type: 'flame', dmg: 2.6, range: 52, burn: 4, off: 3.4 }, e); } } });
    return e;
  },
  /* PIKE: a hover tank destroyer. One long gun fixed in the hull: it has to stop and point all of itself at you, and it shows a line before it fires */
  pike(x, z, team, o) {
    const g = grp(FD.scene, x, heightAt(x, z), z), body = grp(g, 0, 1.3, 0), lm = hot(team === 1 ? 0xff4030 : 0x60c8ff, 3); lm.transparent = true; lm.opacity = .55; lm.depthWrite = false;
    tbox(body, teamMat(team), 4.8, 1.2, 8.6, .7, .7, 0, .8, 0); tbox(body, M.dark, 5.2, .7, 9.2, .92, .94, 0, 0, 0, PI); cyl(body, M.dark, .5, 2.4, 3.4, 0, .5, 5.6, Z, 0, 0, 6); noShadow(box(body, M.cyan, 1.6, .4, .1, 0, 1.5, 1.6, -.5));
    for (const s of [-1, 1]) { tbox(body, M.dark, .3, 2, 2.6, 1, .4, s * 2.1, 1.9, -3.2, 0, 0, s * -.25); noShadow(box(body, M.cyan, 1.4, .1, 6, s * 1.6, -.42, 0)); cyl(body, M.girder, .8, .9, 1.8, s * 1.5, .7, -4.4, Z, 0, 0, 8); noShadow(cyl(body, M.amber, .6, .6, .06, s * 1.5, .7, -5.32, Z, 0, 0, 8)); }
    cyl(body, M.black, .3, .36, 9.5, 0, 1.2, 5, Z, 0, 0, 10); for (let i = 0; i < 4; i++) cyl(body, teamGlow(team), .5, .5, .14, 0, 1.2, 3 + i * 1.8, Z, 0, 0, 10); const mz = grp(body, 0, 1.2, 10), line = noShadow(new THREE.Mesh(UB, lm)); line.visible = false; FD.scene.add(line); FD.misc.push(line);
    const e = tankEnt(g, team, 'PIKE', 4.2, 2.2, 100, o); e.chg = 0; e.fireT = rand(3, 6); e.onDead = () => { line.visible = false; };
    tankBrain(e, g, null, null, { sp: 22, near: 215, face: 1, tr: 1.5, rad: 3.2,
      tick(dt, t, v) { body.position.y = 1.3 + Math.sin(t * 2.3 + e.strafe) * .16; body.rotation.x = -v * .006; if (e.chg <= 0 || e.dead) line.visible = false; if (Math.abs(v) > 2 && Math.random() < dt * 14) { _v.copy(e.pos); _v.x += rand(-2, 2); _v.z += rand(-2, 2); puff(FD.fx, _v, 1, 1.8, .55, .22, 1, 2); } },
      fire(dt, tg, d, to) {
        if (e.chg > 0) {
          e.chg -= dt; mz.getWorldPosition(_o); _c.copy(tg.pos); _c.y += tg.cy; if (e.chg > .35) e.aim = _c.clone(); line.visible = true; line.position.copy(_o).add(e.aim).multiplyScalar(.5); line.scale.set(.1, .1, _o.distanceTo(e.aim)); line.lookAt(e.aim);
          if (e.chg <= 0) { line.visible = false; fireFrom(_o, e.aim, { type: 'rail', dmg: 44, range: 400, off: .5 }, e); e.fireT = rand(5.5, 8); } return;
        }
        e.fireT -= dt; if (e.fireT < 0 && d < 330 && Math.abs(angDiff(e.yaw, to)) < .12) { e.chg = 1.3; e.aim = tg.pos.clone(); if (e.pos.distanceTo(P.pos) < 340) sfx.play('ion', .5); }
      } });
    return e;
  },
};
function mkTank(x, z, team = 1, o = {}) { const v = TANKS[o.v] ? o.v : 'striker', e = TANKS[v](x, z, team, o); e.vk = v; e.obj.rotation.y = e.yaw; FD.ents.push(e); return e; }

/* ---- THE CENTIPEDE: a segmented crawler as long as a street. Every segment is a target with a gun of its own, and the body follows wherever the head has been.
   Kill the head and the rest goes up behind it one segment at a time; chew through the segments and it gets shorter and shoots less ---- */
function mkCentipede(x, z, team = 1, o = {}) {
  const n = o.n || 7, gap = 6.4, trail = [], segs = [], hpK = o.hpK || 1, col = teamMat(team), y0 = o.yaw ?? rand(TAU);
  for (let i = 0; i <= n; i++) {
    const head = i === 0, g = grp(FD.scene, x - Math.sin(y0) * i * gap, 0, z - Math.cos(y0) * i * gap, 0, y0, 0), legs = []; g.position.y = heightAt(g.position.x, g.position.z); let gun = null;
    if (head) {
      tbox(g, col, 4.8, 2.6, 6.4, .7, .8, 0, 2.7, .2); tbox(g, M.dark, 4, 1.6, 3, .6, .3, 0, 2.2, 4.2, .5); box(g, M.hazard, 4.82, .3, 6.42, 0, 1.7, .2);
      for (const s of [-1, 1]) { tbox(g, M.steel, .7, .8, 4.2, .2, .2, s * 1.7, 1.5, 5.6, Z * .2, s * -.35, 0); for (let k = 0; k < 2; k++) noShadow(sph(g, teamGlow(team), .3, s * (.7 + k * .9), 3.2 - k * .3, 3.4 - k * .5)); cyl(g, M.chrome, .05, .05, 4.4, s * 1.3, 5.6, 1, -.5, 0, s * -.3); }
      gun = grp(g, 0, 2.2, 5.4);
    } else {
      cyl(g, M.dark, 2.3, 2.3, 4.8, 0, 2.4, 0, Z, 0, 0, 10); tbox(g, col, 4.6, 1.2, 4.4, .75, .9, 0, 3.6, 0); box(g, M.girder, 5, .3, .5, 0, 2.4, 2.5); cyl(g, M.black, 1.2, 1.2, 1.4, 0, 2.4, -3.1, Z, 0, 0, 8);
      const hd = grp(g, 0, 4.3, 0); cyl(hd, M.girder, .9, 1.1, .6, 0, .2, 0, 0, 0, 0, 8); gun = grp(hd, 0, .5, 0); cyl(gun, M.black, .16, .2, 2.4, 0, 0, 1.2, Z); noShadow(sph(hd, teamGlow(team), .2, 0, .7, -.4));
    }
    for (const s of [-1, 1]) for (const zz of [-1.3, 1.3]) { const L = grp(g, s * 2, 2.3, zz); box(L, M.girder, 2.6, .34, .34, s * 1.2, .5, 0, 0, 0, s * .42); box(L, M.black, .34, 3.3, .34, s * 2.45, -.6, 0, 0, 0, s * -.1); legs.push([L, zz]); }
    const e = { kind: 'tank', team, name: head ? (o.name || 'CENTIPEDE') : 'CENTIPEDE SEGMENT', obj: g, pos: g.position, cy: 2.7, r: head ? 4.7 : 3.7, hp: (head ? 300 : 110) * hpK, yaw: y0, v: 0, fireT: rand(2, 6), biteT: 0, nw: true, big: head, seg: i, vk: 'worm' };
    e.max = e.hp; e.crash = () => FD.scene.remove(g); const walk = (dt, t, v) => { for (const [L, zz] of legs) L.rotation.x = Math.sin(t * 8 + i * 1.3 + zz) * .4 * Math.min(1, Math.abs(v) / 4); };
    if (head) {
      e.segs = segs;
      e.update = (dt, t) => {
        const tg = seek(e, dt); let want = e.yaw + Math.sin(t * .5) * .4, spd = 5, d = 1e9, to = 0;
        if (tg) { const dx = tg.pos.x - e.pos.x, dz = tg.pos.z - e.pos.z; d = Math.hypot(dx, dz); to = Math.atan2(dx, dz); if (d < 420 || e.alert) { want = to + Math.sin(t * .8) * .55 * clamp((d - 30) / 80, 0, 1); spd = d - tg.r > 9 ? 14 : 3; } }
        if (e.pacify) spd = 0; drive(e, want, spd, dt, 3, 1.15); g.rotation.y = e.yaw; walk(dt, t, e.v);
        if (!trail.length || Math.hypot(trail[0].x - e.pos.x, trail[0].z - e.pos.z) > 1) { trail.unshift({ x: e.pos.x, z: e.pos.z, yaw: e.yaw }); if (trail.length > (n + 2) * gap) trail.length = Math.ceil((n + 2) * gap); }
        if (!tg || e.pacify) return;
        if (d - tg.r < 9) { if ((e.biteT -= dt) < 0) { e.biteT = 1.4; gun.getWorldPosition(_o); const at = _o.clone(); sparks(FD.fx, at, 26, 12); damage(tg, 38, at, e.team, zoneAt(tg, at)); if (at.distanceTo(P.pos) < 200) sfx.play('punch', .9); } }
        else if (d < 250 && (e.fireT -= dt) < 0) { e.fireT = rand(3, 4.6); gun.getWorldPosition(_o); fireFrom(_o, aimAt(tg, d * .03, d * .02), { type: 'plasma', dmg: 15, speed: 95, blast: 5, big: .6 }, e); }
      };
      /* the head going takes the body with it, one segment after another */
      e.crash = owner => { FD.scene.remove(g); let k = 0, t = .25; FD.tick.push(dt => { if ((t -= dt) > 0) return true; t = .22; while (k < segs.length && segs[k].dead) k++; if (k >= segs.length) return false; killEnt(segs[k], owner); return true; }); };
    } else {
      e.update = (dt, t) => {
        const H = segs[0]; let k = 1; for (let j = 1; j < i; j++) if (!segs[j].dead) k++; const p = trail[Math.min(trail.length - 1, Math.round(k * gap))], ox = e.pos.x, oz = e.pos.z;
        if (p && !H.dead) { e.pos.x = damp(e.pos.x, p.x, 8, dt); e.pos.z = damp(e.pos.z, p.z, 8, dt); e.yaw += angDiff(e.yaw, p.yaw) * Math.min(1, 6 * dt); }
        e.pos.y = damp(e.pos.y, heightAt(e.pos.x, e.pos.z), 10, dt); g.rotation.y = e.yaw; e.v = Math.hypot(e.pos.x - ox, e.pos.z - oz) / Math.max(dt, .001); walk(dt, t, e.v);
        const tg = seek(e, dt); if (!tg || e.pacify || H.pacify) return; const d = e.pos.distanceTo(tg.pos); if (d > 230) return; gun.parent.rotation.y += angDiff(gun.parent.rotation.y, Math.atan2(tg.pos.x - e.pos.x, tg.pos.z - e.pos.z) - e.yaw) * Math.min(1, 3 * dt);
        if ((e.fireT -= dt) < 0) { e.fireT = rand(3.4, 6); gun.getWorldPosition(_o); fireFrom(_o, aimAt(tg, d * .045, d * .03), { type: 'bolt', dmg: 6, speed: 120 }, e); }
      };
    }
    segs.push(e); FD.ents.push(e);
  }
  segs[0].body = segs.slice(1); return segs[0];
}
/* ai: hunt (default) | guard (hold near home until engaged) | follow (escort e.lead) | goto / flee (run to e.dest) | hold */
function mkMech(x, z, cfg, team = 1, o = {}) {
  const m = new Mech(cfg), st = m.stats; m.root.position.set(x, heightAt(x, z) + (o.drop || 0), z); m.run = ERUN; m.gait.sk = 1.25; FD.scene.add(m.root);
  const e = { kind: 'mech', team, name: o.name || cfg.name, mech: m, obj: m.root, pos: m.root.position, cy: m.chestY, r: m.radius * .75 + 1.5, hp: st.armor * .75 * (o.hpK || 1), yaw: o.yaw ?? rand(TAU), v: 0, cd: { armL: rand(2), armR: rand(2), back: rand(3, 6) }, strafe: pick([-1, 1]), flipT: rand(4, 9), ai: o.ai || 'hunt', home: V3(x, 0, z), skill: o.skill || 1, lead: o.lead || PE, dest: o.dest || null };
  e.max = e.hp; m.root.rotation.y = e.yaw; e.zones = zonesFor(m, e.hp); e.hs = mechHs(m, e.cy, e.r); e.named = !!o.name; e.nz = !!o.nz; e.rng = mechRng(e);
  if (st.fx === 'shield') e.sh = e.shMax = e.hp * .25; if (st.fx === 'ecm') e.ecm = true;
  /* (a machine on our side treads on hostile vehicles as the player's does: 165_stomp.js. The other side's do not: a convoy would never get home) */
  m.onStep = L => { const by = e.pos.distanceTo(P.pos) < 140, ours = e.team === 0 && !e.pacify && !e.dead; if (by || ours) L.ankP.getWorldPosition(_v); if (by) { puff(FD.fx, _v, 2, 1.6, .5, .25); sfx.play('step', .25); } if (ours) stompFoot(m, _v, false, e.rv ? 4 : 0, Math.abs(e.v) / (st.speed * ERUN)); };
  e.update = dt => {
    const tg = seek(e, dt), top = e.legless ? 0 : st.speed * ERUN * (e.vk || 1); let d = 1e9, to = e.yaw, want = e.yaw, spd = 0;
    if (tg) { const dx = tg.pos.x - e.pos.x, dz = tg.pos.z - e.pos.z; d = Math.hypot(dx, dz); to = Math.atan2(dx, dz); }
    const eng = tg && (d < 330 || e.alert), fight = () => { e.flipT -= dt; if (e.flipT < 0) { e.flipT = rand(4, 9); e.strafe *= -1; } const R1 = e.rng; if (R1 < 34) { want = to; spd = d - tg.r > R1 ? 1.05 : .2; } else { want = d > R1 ? to : d > R1 * .5 ? to + e.strafe * 1.35 : to + e.strafe * 2.5; spd = .85; } };
    const head = (p, s) => { const dx = p.x - e.pos.x, dz = p.z - e.pos.z, dd = Math.hypot(dx, dz); if (dd > 9) { want = Math.atan2(dx, dz); spd = s; } return dd; };
    if (e.ai === 'goto' || e.ai === 'flee') { if (head(e.dest, e.ai === 'flee' ? 1.05 : .9) <= 9) e.arrived = true; }
    else if (e.ai === 'follow') { const dd = Math.hypot(e.lead.pos.x - e.pos.x, e.lead.pos.z - e.pos.z); if (dd > (eng ? 110 : 26)) head(e.lead.pos, dd > 70 ? 1.1 : .8); else if (eng) fight(); }
    else if (e.ai === 'hold') { }
    else if (eng) fight();
    else if (e.ai === 'guard') head(e.home, .5);
    const turn = drive(e, want, top * spd, dt, m.radius * .7, st.turn * Math.max(1, e.vk || 1) * (e.legless ? .3 : 1)); m.root.rotation.y = e.yaw; m.gait.sag = damp(m.gait.sag, e.legless ? 1 : 0, 2.5, dt); m.gait.amt = e.v / (st.speed * ERUN); m.gait.turn = turn;
    if (tg && d < 330) {
      const tw = st.twist > 3 ? angDiff(e.yaw, to) : clamp(angDiff(e.yaw, to), -st.twist, st.twist); m.twist += angDiff(m.twist, tw) * Math.min(1, 3 * dt); m.pitch = clamp(Math.atan2(tg.pos.y + tg.cy - e.pos.y - e.cy, d), -.4, .4);
      const aoff = Math.abs(angDiff(e.yaw + m.twist, to)), gap = d - tg.r;
      if (!e.pacify && d < 340 && aoff < .5) for (const k of ['armL', 'armR', 'back']) {
        const id = cfg[k], w = id && (k === 'back' ? PARTS.back[id] : PARTS.arm[id]).weapon; if (!w || e.zones[k] && e.zones[k].hp <= 0) continue;
        /* each weapon is held to its own reach, and the close ones to a wider cone: a fist does not need a firing solution */
        const near = w.type === 'melee' || w.type === 'flame'; if (aoff > (near ? .5 : .14) || (w.type === 'melee' ? gap > w.range : d > Math.min(wepReach(w), w.loft || w.type === 'lob' ? 330 : 210))) continue;
        e.cd[k] -= dt; if (e.cd[k] > 0) continue;
        const er = d / e.skill * (tg.ecm ? 1.5 : 1); fire(m, k, w, aimZ(tg, er * .045, er * .025), e.rv && e.team === 0 ? 4 : e.team, tg); e.cd[k] = w.cd < .2 ? (Math.random() < .16 ? rand(2, 3.5) : .17) : w.cd * rand(2.1, 3.2);
      }
    } else m.twist = damp(m.twist, 0, 2, dt);
    m.update(dt);
  };
  FD.ents.push(e); return e;
}
function mkTruck(x, z, team, path) {
  const g = grp(FD.scene, x, heightAt(x, z), z); box(g, M.yellow, 3.2, 2.4, 2.6, 0, 2.3, 2.6); noShadow(box(g, M.cyan, 2.8, .8, .1, 0, 2.8, 3.92)); box(g, M.steel, 3.4, 3, 5.6, 0, 2.6, -1.6); box(g, M.dark, 3.5, .5, 8.6, 0, .95, 0);
  for (const zz of [2.6, -.8, -3.2]) for (const s of [-1, 1]) cyl(g, M.black, .85, .85, .7, s * 1.6, .85, zz, 0, 0, Z, 10);
  const e = { kind: 'truck', team, name: 'CARGO HAULER', obj: g, pos: g.position, cy: 2.4, r: 4.2, hp: 240, max: 240, yaw: path[0] ? Math.atan2(path[0].x - x, path[0].z - z) : 0, v: 0, path, wp: 0, halt: false, speed: 8.5 };
  e.update = dt => { let want = e.yaw, spd = 0; const w = e.path[e.wp]; if (w && !e.halt) { const dx = w.x - e.pos.x, dz = w.z - e.pos.z; if (Math.hypot(dx, dz) < 9) e.wp++; else { want = Math.atan2(dx, dz); spd = e.speed; } } e.arrived = e.wp >= e.path.length; drive(e, want, spd, dt, 3, 1.4); g.rotation.y = e.yaw; };
  FD.ents.push(e); return e;
}
/* destructible structures: [name, hp, hit radius, centre height, roof height, builder] */
EM.corr = std({ map: TX.corr, color: 0x8d939a, metalness: .6, roughness: .6 });
const STRUCT = {
  gen: ['REACTOR', 300, 6, 6, 12, g => { cyl(g, M.dark, 5.2, 5.8, 3, 0, 1.5, 0, 0, 0, 0, 12); cyl(g, M.steel, 3.4, 3.4, 9, 0, 6.5, 0, 0, 0, 0, 14); for (const y of [4.2, 7, 9.8]) noShadow(cyl(g, M.cyan, 3.55, 3.55, .35, 0, y, 0, 0, 0, 0, 14)); cyl(g, M.dark, 3.9, 3, 1.4, 0, 11.6, 0, 0, 0, 0, 12); for (let i = 0; i < 4; i++) box(g, M.yellow, .6, 10, .6, Math.sin(i * Z + .8) * 4.6, 5, Math.cos(i * Z + .8) * 4.6); }],
  fuel: ['FUEL TANK', 170, 6, 5, 10.5, g => { cyl(g, M.rust, 5.4, 5.4, 9, 0, 4.5, 0, 0, 0, 0, 18); cyl(g, M.dark, 5.56, 5.56, .5, 0, 6.5, 0, 0, 0, 0, 18); cyl(g, M.girder, 1.6, 5.4, 1.8, 0, 9.9, 0, 0, 0, 0, 18); box(g, M.hazard, .3, 7, 1.4, 5.5, 4, 0); }],
  comm: ['UPLINK TOWER', 220, 5, 13, 30, g => { for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) box(g, M.girder, .4, 30, .4, a * 1.7, 15, b * 1.7); for (let y = 3; y < 30; y += 5) box(g, M.girder, 3.8, .25, 3.8, 0, y, 0); const d = grp(g, 0, 23, 2.2, -.5); sph(d, M.steel, 4, 0, 0, 0, 1, 1, .25); cyl(d, M.chrome, .07, .07, 3, 0, 0, 1.5, Z); box(g, M.dark, 6, 3, 5, 4.5, 1.5, -3); }],
  bunker: ['COMMAND BUNKER', 480, 9, 3.5, 7, g => { tbox(g, EM.conc, 17, 6.4, 14, .8, .8, 0, 3.2, 0); box(g, M.black, 9, .7, .3, 0, 4, 6.4, -.16); box(g, M.dark, 3, 3.6, .4, 0, 1.8, -6.6, .16); cyl(g, M.girder, .12, .12, 7, 5, 9.5, -3); box(g, M.steel, 5, 1.2, 4, -3.5, 6.9, 0); }],
  depot: ['SUPPLY DEPOT', 320, 9, 4.5, 9, g => { box(g, EM.corr, 17, 8, 12, 0, 4, 0); box(g, M.girder, 18, .6, 13, 0, 8.3, 0); box(g, M.black, 6, 5.4, .3, -3, 2.7, 6.05); box(g, M.rust, 3, 3, 3, 6.5, 1.5, 8.5, 0, .3); box(g, M.blue, 2.4, 2.4, 2.4, 3.4, 1.2, 9, 0, -.2); }],
  arty: ['SIEGE GUN', 200, 5.5, 3.5, 7, g => { cyl(g, M.dark, 5, 5.6, 1.6, 0, .8, 0, 0, 0, 0, 8); tbox(g, M.red, 5, 3, 5.4, .8, .8, 0, 3, 0); const b = grp(g, 0, 4, 1, -.9); cyl(b, M.black, .5, .6, 11, 0, 0, 5, Z); cyl(b, M.girder, .75, .75, 2, 0, 0, 1.5, Z); }],
  hq: ['FIELD HQ', 950, 11, 6, 12, g => { box(g, EM.corr, 22, 10, 15, 0, 5, 0); box(g, M.girder, 23, .7, 16, 0, 10.3, 0); box(g, M.dark, 7, 5, 7, -6, 12.8, -2); for (let i = -3; i <= 3; i++) noShadow(box(g, M.cyan, 1.6, 1.1, .12, i * 2.8, 6.4, 7.56)); const d = grp(g, 6, 12.5, 1, -.6); sph(d, M.steel, 3, 0, 0, 0, 1, 1, .25); cyl(g, M.girder, .1, .1, 9, -6, 19.5, -2); box(g, M.black, 5, 6, .3, 0, 3, 7.55); }],
  hab: ['HAB BLOCK', 260, 8, 3, 6, g => { for (const s of [-1, 1]) { cyl(g, EM.conc, 4.2, 4.2, 12, s * 4.6, 0, 0, Z, 0, 0, 14); noShadow(box(g, M.white, .12, .9, 7, s * 8.82, 2, 0)); } box(g, M.steel, 5, 3.4, 4, 0, 1.7, 0); }],
  wreck: ['CRASHED DROPSHIP', 9999, 10, 4, 8, g => { tbox(g, M.dark, 9, 5, 22, .75, .8, 0, 2, 0, .12, 0, .2); tbox(g, M.rust, 7, 2.4, 9, .7, .6, 2, 5.4, 4, .12, 0, .2); box(g, M.girder, 22, .8, 6, 3, 2.6, -3, 0, .3, .32); cyl(g, M.steel, 2.2, 2.6, 4, -9, 1, 7, .5, 0, .3, 12); }],
};
function mkStruct(sk, x, z, team = 1, o = {}) {
  const [name, hp, r, cy, top, b] = STRUCT[sk], g = grp(FD.scene, x, heightAt(x, z) - .3, z, 0, o.ry || 0, 0); b(g); if (sk !== 'wreck') noShadow(box(g, team === 1 ? M.redGlow : team === 0 ? M.green : M.white, .7, .7, .7, 0, top + .8, 0));
  const e = { kind: 'struct', sk, team, name: o.name || name, obj: g, pos: g.position, cy, r, hp: hp * (o.hpK || 1), col: addCol({ x, z, r: r * .85, top: g.position.y + top }), blast: sk === 'fuel' ? 28 : 0, update() { } };
  e.max = e.hp; FD.ents.push(e); return e;
}
/* ---- THE ASSEMBLY PLANT: a works that builds what it is defended by. While it stands, something new walks, drives or flies out of the door every quarter of a minute, up to `cap` at a time
   (and, given `stock`, no more than that many altogether: `dry(e)` is called when the last has left) ---- */
STRUCT.fab = ['ASSEMBLY PLANT', 1500, 13, 7, 17, g => {
  box(g, EM.corr, 26, 12, 20, 0, 6, -2); for (let i = 0; i < 4; i++) { tbox(g, M.dark, 6.4, 3, 20, .1, 1, -9.6 + i * 6.4, 13.5, -2); noShadow(box(g, M.amber, .2, 1.6, 18, -12.7 + i * 6.4, 13.3, -2, 0, 0, .2)); }
  box(g, M.girder, 27, .6, 21, 0, 12.1, -2); box(g, M.dark, 12, 9.4, 1, 0, 4.7, 8.3); box(g, M.hazard, 13.4, .8, 1.2, 0, 9.6, 8.3); for (const s of [-1, 1]) box(g, M.hazard, .8, 9.4, 1.2, s * 6.4, 4.7, 8.3);
  for (const [sx, h] of [[-9, 24], [-5, 20]]) { cyl(g, M.rust, 1.5, 1.9, h, sx, h / 2, -9, 0, 0, 0, 12); cyl(g, M.hazard, 1.56, 1.56, 1.2, sx, h - 2, -9, 0, 0, 0, 12); cyl(g, M.black, 1.2, 1.2, .3, sx, h, -9, 0, 0, 0, 12); }
  box(g, M.steel, 12, .5, 12, 0, .25, 15); for (const s of [-1, 1]) { box(g, M.yellow, .5, 1.2, 12, s * 6, .9, 15); box(g, M.girder, 1, 14, 1, s * 10, 7, 12); } box(g, M.girder, 21, 1, 1, 0, 14, 12); box(g, M.yellow, 3, 1.6, 2.4, 3, 13.2, 12); cyl(g, M.black, .08, .08, 5, 3, 10, 12);
  cyl(g, M.blue, 3, 3, 8, 16.5, 4, -4, 0, 0, 0, 14); cyl(g, M.dark, 3.1, 3.1, .5, 16.5, 6, -4, 0, 0, 0, 14); box(g, M.rust, 4, 3, 4, -16, 1.5, 2, 0, .3); box(g, M.dark, 5, 5, 6, -16, 2.5, -6);
}];
function mkFactory(x, z, team = 1, o = {}) {
  const e = mkStruct('fab', x, z, team, o), g = e.obj, ry = o.ry || 0, K = { every: o.every || 15, cap: o.cap || 4, tier: o.tier ?? 0, stock: o.stock || 0 }, door = glowMat(0xffa030, 1.2), sm = [];
  noShadow(box(g, door, 10.6, 8.6, .3, 0, 4.5, 8.86)); for (const [sx, h] of [[-9, 24], [-5, 20]]) { g.updateMatrixWorld(true); const em = { p: g.localToWorld(V3(sx, h + 1, -9)), kind: 'smoke' }; FD.emit.push(em); sm.push(em); }
  e.kids = []; e.big = true; e.blast = 24; e.built = 0; let t = o.first ?? 9, told = false; const px = x + Math.sin(ry) * 22, pz = z + Math.cos(ry) * 22;
  e.update = dt => {
    if (e.kids.length) e.kids = e.kids.filter(k => !k.dead); const on = !e.pacify && (e.alert || e.pos.distanceTo(P.pos) < (o.wake || 430)); door.emissiveIntensity = damp(door.emissiveIntensity, on && t < 2.5 ? 7 : 1.2, 4, dt);
    if (!on || (t -= dt) > 0) return; if (e.kids.length >= K.cap) { t = 2; return; } t = K.every * rand(.85, 1.15); e.built++;
    /* a works with a stock builds that many and no more: the door stays open and nothing else comes out of it */
    if (K.stock && e.built >= K.stock) { e.pacify = true; if (o.dry) o.dry(e); }
    const r = Math.random(), sp = r < .45 ? { mech: 1 } : r < .8 ? { tank: 1 } : { drone: 2 }, L = spawn({ ...sp, tier: K.tier }, px, pz, 0, 4, team, MS.on ? fopt(o.kid) : {});
    for (const k of L) { k.alert = true; if (k.yaw !== undefined) k.yaw = ry; e.kids.push(k); } _v.set(px, heightAt(px, pz) + 2, pz); puff(FD.fx, _v, 14, 4, .5, .4, 3, 8); if (e.pos.distanceTo(P.pos) < 380) sfx.play('door', .6);
    if (!told && team === 1) { told = true; msg(`THE ${e.name} IS BUILDING — KILL IT OR KEEP KILLING WHAT IT MAKES`, 4.5); }
  };
  e.onDead = () => { for (const em of sm) em.life = 0; };
  return e;
}

/* ---- CAPITAL SHIPS. A hull the length of a city block, sixty metres up, with parts of its own to shoot at: belly turrets that can be silenced one at a time, and engine nacelles
   that each take a quarter of the hull with them and leave her slower. S: the hull's hit spheres, where the parts hang, how she moves, what she fights with ---- */
/* what an engine takes with it when it goes: a quarter of the hull. Two engines and the guns are most of a ship, which is what makes aiming worth more than weight of fire */
const SHIP_ENG_K = .25;
const CAPS = {
  /* LEVIATHAN: a gunship cruiser. She closes, circles, rakes the ground with four turrets and puts a spinal gun into wherever you are standing */
  lev: {
    name: 'LEVIATHAN', hp: 3100, r: 15, alt: 56, sp: 8, turn: .16, far: 240, near: 120, belly: 10, gun: 'BELLY TURRET', shot: { type: 'bullet', dmg: 6, speed: 175, big: 1.3, snd: 'cannon' },
    hs: [[0, 0, -42, 12], [0, 0, -21, 14], [0, 0, 0, 15], [0, 0, 21, 14], [0, 0, 42, 11]], subs: [['gun', 9, -8.5, 24], ['gun', -9, -8.5, 24], ['gun', 9, -8.5, -16], ['gun', -9, -8.5, -16], ['eng', 16, 1, -44], ['eng', -16, 1, -44]],
    build(g, team) {
      const col = teamMat(team); tbox(g, M.dark, 22, 9, 96, .7, .82, 0, 0, 0); tbox(g, col, 15, 5, 82, .55, .8, 0, -7, 0, PI); cyl(g, M.dark, .6, 9.6, 26, 0, -.4, 60, Z, PI / 4, 0, 4); box(g, M.hazard, 22.2, .8, 96.2, 0, -3.6, 0);
      tbox(g, col, 10, 7, 18, .7, .6, 0, 8, -18); noShadow(box(g, M.cyan, 7.6, 1, .2, 0, 9.4, -9.2, -.3)); tbox(g, M.dark, 6, 4, 8, .6, .6, 0, 13.4, -20); cyl(g, M.chrome, .1, .1, 12, 2, 21, -22); cyl(g, M.chrome, .08, .08, 8, -2, 19, -19);
      for (const s of [-1, 1]) { tbox(g, M.girder, 8, 5, 44, .7, .9, s * 14, -1, -4); box(g, M.hazard, 8.1, .5, 6, s * 14, 1.6, 14); tbox(g, col, .8, 12, 14, 1, .4, s * 9, 9, -40, 0, 0, s * -.35); box(g, M.girder, 8, 1.6, 10, s * 13, 1, -42); for (let i = 0; i < 7; i++) noShadow(box(g, M.redGlow, .5, .5, .5, s * 11.2, -4, -36 + i * 12)); }
      for (let i = 0; i < 5; i++) box(g, M.girder, 23, 1, 1.4, 0, 4.8, -36 + i * 18); const sp = grp(g, 0, -8, 46, .5); cyl(sp, M.black, 1.1, 1.4, 12, 0, 0, 5, Z, 0, 0, 10); cyl(sp, col, 2, 2, 3, 0, 0, 0, Z, 0, 0, 10); noShadow(cyl(sp, M.redGlow, .8, .8, .1, 0, 0, 11.1, Z, 0, 0, 10)); return grp(sp, 0, 0, 11.5);
    },
  },
  /* HIVE: a carrier. She keeps her distance and keeps the air full: everything she launches has to be shot down again until she is */
  hive: {
    name: 'HIVE CARRIER', hp: 2500, r: 14, alt: 64, sp: 10, turn: .2, far: 250, near: 150, belly: 8, gun: 'POINT DEFENCE', shot: { type: 'bolt', dmg: 6, speed: 130 },
    hs: [[-20, 0, -18, 12], [-20, 0, 14, 12], [20, 0, -18, 12], [20, 0, 14, 12], [0, 1, -4, 13]], subs: [['gun', 20, -6, 22], ['gun', -20, -6, 22], ['gun', 0, -3.4, -22], ['eng', 20, 0, -40], ['eng', -20, 0, -40]],
    build(g, team) {
      const col = teamMat(team);
      for (const s of [-1, 1]) { tbox(g, M.dark, 14, 8, 70, .7, .8, s * 20, 0, 0); tbox(g, col, 9, 4, 58, .5, .8, s * 20, -6, 0, PI); cyl(g, M.dark, .5, 6.4, 18, s * 20, -.3, 43, Z, PI / 4, 0, 4); box(g, M.hazard, 14.2, .7, 70.2, s * 20, -3.2, 0); for (let i = 0; i < 5; i++) noShadow(box(g, M.redGlow, .5, .5, .5, s * 27.2, -3, -28 + i * 14)); }
      box(g, M.girder, 54, 2, 46, 0, 3.4, -4); box(g, M.dark, 26, 1.2, 46, 0, 4.6, -4); for (const s of [-1, 1]) { noShadow(box(g, M.amber, .5, .1, 42, s * 5, 5.26, -4)); box(g, M.hazard, 1.4, .1, 46, s * 12.4, 5.24, -4); }
      for (let i = 0; i < 6; i++) noShadow(box(g, M.white, 1.4, .1, 3, 0, 5.26, -22 + i * 7.4)); tbox(g, col, 7, 10, 11, .7, .7, 21, 9.4, -12); noShadow(box(g, M.cyan, 5.4, 1, .2, 21, 11, -6.9, -.2)); const d = grp(g, 21, 15.4, -14, -.5); sph(d, M.steel, 3, 0, 0, 0, 1, 1, .25); cyl(g, M.chrome, .1, .1, 9, 19, 19, -9);
      for (const sx of [-6.5, 6.5]) for (const sz of [-14, 6]) noShadow(box(g, M.amber, 8, .3, 12, sx, 2.2, sz)); return grp(g, 0, 1.6, -4);
    },
  },
};
function mkCapital(v, x, z, team = 1, o = {}) {
  const S = CAPS[v], alt = o.alt || S.alt, g = grp(FD.scene, x, heightAt(x, z) + alt, z), hpK = o.hpK || 1, shot = { ...S.shot, dmg: S.shot.dmg * (o.dK || 1) }; FD.misc.push(g); const port = S.build(g, team);
  const e = { kind: 'ship', sk: 'ship', team, name: o.name || S.name, obj: g, pos: g.position, cy: 0, r: S.r, hs: S.hs, hp: S.hp * hpK, yaw: o.yaw ?? rand(TAU), v: 0, big: true, nw: true, subs: [], kids: [], fireT: rand(5, 8), bayT: rand(4, 7), alert: !!o.alert, side: pick([-1, 1]), sp: 1, vk: v, home: V3(x, 0, z), focus: o.focus || null };
  e.max = e.hp; g.rotation.y = e.yaw; g.updateMatrixWorld(true);
  for (const [type, sx, sy, sz] of S.subs) {
    const sg = grp(g, sx, sy, sz), gun = type === 'gun'; let br = null, glow = null;
    if (gun) { sph(sg, M.dark, 2.6, 0, 0, 0, 1, .7, 1); cyl(sg, teamMat(team), 2.7, 2.7, .5, 0, .9, 0, 0, 0, 0, 12); br = grp(sg, 0, -.8, 0); for (const s of [-1, 1]) cyl(br, M.black, .24, .28, 4.4, s * .7, 0, 2.2, Z); sph(br, M.girder, 1.2); }
    else { cyl(sg, M.girder, 3.6, 4, 13, 0, 0, 0, Z, 0, 0, 12); cyl(sg, M.dark, 4.2, 4.2, 2.4, 0, 0, 3, Z, 0, 0, 12); cyl(sg, M.black, 3.2, 2.4, 2, 0, 0, -7.4, Z, 0, 0, 12); glow = noShadow(cyl(sg, M.cyan, 2.3, 2.3, .2, 0, 0, -8.46, Z, 0, 0, 12)); for (let i = 0; i < 4; i++) box(sg, M.hazard, .5, 8.2, 1, 0, 0, -2 + i, 0, 0, i * PI / 4); }
    const s = { kind: 'turret', team, name: gun ? S.gun : 'ENGINE NACELLE', obj: sg, pos: V3(), cy: 0, r: gun ? 3.6 : 4.8, hp: (gun ? 170 : 290) * hpK, nw: true, of: e, gun, fireT: rand(1, 4), burst: 0, vk: 'sub' }; s.max = s.hp; sg.getWorldPosition(s.pos);
    s.update = dt => {
      sg.getWorldPosition(s.pos); s.alert = s.alert || e.alert; if (!gun) { if (Math.random() < dt * 12) { _v.set(0, 0, -9).applyQuaternion(g.quaternion).add(s.pos); FD.fx.spark.emit(_v.x, _v.y, _v.z, rand(-1, 1), rand(-1, 1), rand(-1, 1), rand(.3, .6), rand(3, 5), 1.2, 2.8, 5, .5, 0, 0, -.6); } return; }
      const tg = seek(s, dt); if (!tg || e.pacify) return; const d = s.pos.distanceTo(tg.pos); if (d > 360 && !e.alert) return; e.alert = true; br.lookAt(tg.pos.x, tg.pos.y + tg.cy, tg.pos.z);
      s.fireT -= dt; if (s.fireT < 0 && d < 360) { s.burst = (s.burst + 1) % 3; s.fireT = s.burst ? .22 : rand(2.8, 4.2); br.getWorldPosition(_o); fireFrom(_o, aimAt(tg, d * .035, d * .025), shot, s); }
    };
    s.crash = owner => {
      sg.visible = false; const at = s.pos.clone(); explode(FD.fx, at, 2); FD.tick.push(dt => { if (e.dead) return false; if (Math.random() < dt * 10) { sg.getWorldPosition(_v); FD.fx.smoke.emit(_v.x, _v.y, _v.z, rand(-1, 1), rand(1, 4), rand(-1, 1), rand(1.5, 3), rand(3, 5), .1, .1, .1, .5, -.2, .3, 2); } return true; });
      if (gun || e.dead) return; e.sp *= .55; msg(`${e.name} — ENGINE OUT`, 3); const inv = e.inv; e.inv = false; damage(e, e.max * SHIP_ENG_K, null, owner); e.inv = inv;
    };
    FD.ents.push(s); e.subs.push(s);
  }
  e.update = (dt, t) => {
    const tg = seek(e, dt); let want = e.yaw + .2, spd = S.sp * .35, d = 1e9, to = 0;
    if (tg) { const dx = tg.pos.x - e.pos.x, dz = tg.pos.z - e.pos.z; d = Math.hypot(dx, dz); to = Math.atan2(dx, dz); if (e.alert || d < 620) { e.alert = true; want = d > S.far ? to : d < S.near ? to + e.side * 2.3 : to + e.side * 1.5; spd = S.sp; } }
    if (o.to && !e.to) { const dx = o.to.x - e.pos.x, dz = o.to.z - e.pos.z; if (Math.hypot(dx, dz) < 60) e.to = true; else { want = Math.atan2(dx, dz); spd = S.sp; } }
    if (e.pacify) spd = 0; if (e.flee) { want = Math.atan2(e.pos.x, e.pos.z); spd = S.sp * 1.6; } else if (Math.hypot(e.pos.x, e.pos.z) > 410 * FD.k) want = Math.atan2(-e.pos.x, -e.pos.z);
    const tr = clamp(angDiff(e.yaw, want) * 1.5, -1, 1); e.yaw += tr * S.turn * dt; e.v = damp(e.v, spd * e.sp, .5, dt); e.pos.x += Math.sin(e.yaw) * e.v * dt; e.pos.z += Math.cos(e.yaw) * e.v * dt;
    e.pos.y = damp(e.pos.y, heightAt(e.pos.x, e.pos.z) + alt + Math.sin(t * .4) * 2, .4, dt); g.rotation.set(0, e.yaw, 0); g.rotateZ(-tr * .07);
    if (!tg || e.pacify || d > 420) return;
    if (v === 'lev') {
      /* the spinal gun: a ranging beam from the prow to the ground, and the ground goes up when it has shrunk to nothing */
      if ((e.fireT -= dt) < 0) { e.fireT = rand(8, 11); const F = e.focus && !e.focus.dead && e.focus.team !== e.team && (e.alt = ((e.alt | 0) + 1) % 3) ? e.focus : tg, lead = F === PE ? P.v * 1.8 : 0, bx = F.pos.x + Math.sin(P.yaw) * lead + rand(-8, 8), bz = F.pos.z + Math.cos(P.yaw) * lead + rand(-8, 8), bm = hot(0xff4030, 6); bm.transparent = true; bm.blending = THREE.AdditiveBlending; bm.depthWrite = false;
        port.getWorldPosition(_o); addBeam(_o.clone(), V3(bx, heightAt(bx, bz), bz), bm, .5, 2.6); shell(bx, bz, F.kind === 'struct' ? 80 : 55, 15, 2.6, e.team); if (e.pos.distanceTo(P.pos) < 420) sfx.play('ion', .8); }
    } else if ((e.bayT -= dt) < 0) {
      /* the flight deck: one or two more in the air, up to as many as she can run at once */
      e.kids = e.kids.filter(k => !k.dead); e.bayT = rand(10, 14); const cap = o.cap || 4; if (e.kids.length >= cap) return; port.getWorldPosition(_o); const P0 = _o.clone();
      for (let i = 0; i < Math.min(2, cap - e.kids.length); i++) { const k = mkDrone(P0.x + rand(-8, 8), P0.z + rand(-8, 8), team, pick(o.wing || ['hunter', 'hunter', 'scr', 'scr', 'shr', 'hrp'])); k.pos.y = P0.y - 6; k.alert = true; if (k.vel) k.vel.set(0, -10, 0); if (e.focus && !e.focus.dead && i % 2 === 0) k.focus = e.focus; e.kids.push(k); }
      if (e.pos.distanceTo(P.pos) < 420) sfx.play('jet', 1);
    }
  };
  /* a capital ship does not blow up: she comes down, burning along her length, and what she lands on is gone */
  e.crash = owner => {
    for (const s of e.subs) if (!s.dead) killEnt(s, 2); let vy = 0; const rz = pick([-1, 1]) * rand(.12, .25), len = S.hs.reduce((m, h) => Math.max(m, Math.abs(h[2]), Math.abs(h[0])), 0); msg(`${e.name} IS GOING DOWN`, 5); sfx.play('alarm');
    const along = () => { const k = rand(-1, 1) * len; return _v.set(rand(-8, 8), rand(-3, 6), k).applyQuaternion(g.quaternion).add(g.position); };
    FD.tick.push(dt => {
      vy -= 6 * dt; g.position.y += vy * dt; e.v = damp(e.v, 0, .3, dt); g.position.x += Math.sin(e.yaw) * e.v * dt; g.position.z += Math.cos(e.yaw) * e.v * dt; g.rotation.z += rz * dt; g.rotation.x += dt * .05;
      if (Math.random() < dt * 4) { explode(FD.fx, along(), rand(1.4, 2.6)); if (g.position.distanceTo(P.pos) < 500) sfx.play('boom', .7); } if (Math.random() < dt * 26) { const p = along(); FD.fx.smoke.emit(p.x, p.y, p.z, rand(-2, 2), rand(3, 8), rand(-2, 2), rand(2, 4), rand(5, 9), .1, .09, .08, .55, -.2, .2, 2); }
      if (g.position.y > heightAt(g.position.x, g.position.z) + S.belly) return true;
      const p = g.position.clone(); for (let i = 0; i < 6; i++) explode(FD.fx, along(), 3); splash(p, 46, 120, 0); splash(p, 46, 120, 1); sfx.play('boom', 1.6); P.shake += clamp(1.6 - p.distanceTo(P.pos) / 250, 0, 1.4);
      g.traverse(c => { if (c.material && c.material.emissive && !c.userData.dk) { c.material = c.material.clone(); c.material.color.multiplyScalar(.3); c.material.emissiveIntensity = 0; c.userData.dk = 1; } });
      for (let i = 0; i < 4; i++) FD.emit.push({ p: along().clone(), kind: 'smoke', life: 70 }); return false;
    });
  };
  FD.ents.push(e); return e;
}
/* a dropship flies in, hovers while cb() unloads, then leaves — resolves once it has gone */
function dropship(x, z, cb, a = rand(TAU), team = 1, cab) {
  const g = grp(FD.scene), gy = heightAt(x, z) + 30, sx = Math.sin(a), cz = Math.cos(a), pods = []; let on = true;
  tbox(g, M.dark, 9, 5, 22, .75, .8, 0, 0, 0); tbox(g, cab || (team === 1 ? M.red : M.blue), 7, 2.4, 9, .7, .6, 0, 3.6, 4); noShadow(box(g, M.cyan, 4.4, 1, .2, 0, 3.2, 8.6, -.5)); box(g, M.girder, 24, .8, 6, 0, 1.6, -3);
  for (const [px, pz] of [[-11, 0], [11, 0], [-11, -6], [11, -6]]) { cyl(g, M.steel, 2.2, 2.6, 4, px, .6, pz, 0, 0, 0, 12); pods.push(noShadow(cyl(g, M.amber, 1.9, 1.9, .3, px, -1.5, pz, 0, 0, 0, 12))); }
  g.rotation.y = a + PI; FD.misc.push(g); look(g, team === 1 ? 'HOSTILE DROPSHIP' : 'DROPSHIP', true);
  FD.tick.push(() => { if (!on) return false; for (const p of pods) { p.getWorldPosition(_v); FD.fx.spark.emit(_v.x + rand(-.6, .6), _v.y, _v.z + rand(-.6, .6), rand(-2, 2), rand(-30, -18), rand(-2, 2), rand(.2, .45), rand(1.6, 2.6), 4, 2.4, .8, .8, 0, .5); } return true; });
  const set = (k, x0, y0, z0, x1, y1, z1) => g.position.set(lerp(x0, x1, k), lerp(y0, y1, k), lerp(z0, z1, k));
  set(0, x + sx * 560, gy + 170, z + cz * 560, x, gy, z); sfx.play('ship');
  return ftween(6, k => set(k, x + sx * 560, gy + 170, z + cz * 560, x, gy, z), ease.out).then(() => { cb && cb(); puff(FD.fx, V3(x, gy - 28, z), 20, 6, .6, .4, 3, 12); return ftween(2.4, () => { }); })
    .then(() => { sfx.play('ship'); return ftween(6, k => set(k, x, gy, z, x - sx * 620, gy + 220, z - cz * 620), ease.in); }).then(() => { on = false; FD.scene.remove(g); });
}
/* incoming artillery: a warning ring, then the blast */
SM.warn = hot(0xff3a2a, 4); SM.warn.transparent = true; SM.warn.depthWrite = false; GEO.ring = new THREE.RingGeometry(.86, 1, 30); GEO.ring.rotateX(-PI / 2);
SM.warn0 = hot(0x5ac8ff, 3); SM.warn0.transparent = true; SM.warn0.depthWrite = false;
function shell(x, z, dmg = 40, r = 14, delay = 2.2, own = 1) {
  const y = heightAt(x, z), ring = new THREE.Mesh(GEO.ring, own === 1 ? SM.warn : SM.warn0); ring.position.set(x, y + .5, z); ring.scale.setScalar(r); FD.scene.add(ring); FD.misc.push(ring); let t = delay;
  FD.tick.push(dt => {
    t -= dt; ring.scale.setScalar(r * (.4 + .6 * Math.abs(Math.sin(t * 7)))); if (t > 0) return true; FD.scene.remove(ring); const p = V3(x, y + 1.5, z), d = p.distanceTo(P.pos);
    explode(FD.fx, p, 2.4); if (own === 1) { splash(p, r, dmg, 1); splash(p, r, dmg * .6, 0); } else splash(p, r, dmg, 0); if (d < 280) { sfx.play('boom', 1); P.shake += clamp(1 - d / 130, 0, 1) * .7; } return false;
  });
}
/* spawning */
function groundSpot(cx, cz, r0, r1) {
  for (let i = 0; i < 40; i++) { const a = rand(TAU), r = rand(r0, r1), x = cx + Math.sin(a) * r, z = cz + Math.cos(a) * r, y = heightAt(x, z); _p.set(x, y + 1, z); if (Math.hypot(x, z) < 405 * FD.k && !inSolid(_p) && (EV.wl == null || y > EV.wl - .5)) return [x, z]; }
  return [cx, cz];
}
/* ---- who turns up. A slot in a force is still a mech, a tank, a drone or a turret; which machine fills it depends on how hard the contract is and how heavy it lets you come.
   [variant, how often, the tier it first appears at] ---- */
const UNIT_POOL = {
  drone: [['hunter', 5, 0], ['scr', 3, 0], ['shr', 2.5, 1], ['hrp', 2, 1], ['vul', 1.5, 2]],
  tank: [['striker', 5, 0], ['dingo', 3.5, 0], ['fur', 2, 1], ['hail', 2, 1], ['pike', 2, 1], ['mam', 1.6, 2]],
  turret: [['sentry', 5, 0], ['hydra', 2.2, 1], ['bas', 2, 1], ['prism', 1.6, 2]],
};
function unitPick(k, tier) { if (tier < 0) return UNIT_POOL[k][0][0]; const L = UNIT_POOL[k].filter(u => u[2] <= tier); let s = 0; for (const u of L) s += u[1]; let r = Math.random() * s; for (const u of L) if ((r -= u[1]) < 0) return u[0]; return L[0][0]; }
/* the weight class a contract was written for, as a tier: 0 light, 1 medium, 2 anything */
const capTier = c => !c || !c.cap ? 2 : c.cap <= 45 ? 0 : c.cap <= 65 ? 1 : 2;
function unitTier(spec) { const c = MS.on ? MS.c : null, t = spec.tier ?? (c ? (c.diff < 2 ? 0 : c.diff < 4 ? 1 : 2) : 1); return c && c.story && !spec.mix ? -1 : Math.min(t, capTier(c), c && c.story ? 1 : 2); }
const foeCfg = (tier, paint) => {
  const c = MS.on ? MS.c : null, t = Math.min(clamp(tier | 0, 0, 2), capTier(c)), C = PRESET_CLS;
  let pool = [[...C.LIGHT, PRESETS[5]], [...C.MEDIUM, PRESETS[3], PRESETS[0], C.LIGHT[C.LIGHT.length - 1], C.HEAVY[C.HEAVY.length - 1]], [...C.HEAVY, ...C.ASSAULT, PRESETS[1], C.MEDIUM[C.MEDIUM.length - 1]]][t];
  if (c && c.cap) { const fit = pool.filter(p => mechStats(p).tons <= c.cap + 10); pool = fit.length ? fit : C.LIGHT; }
  const cfg = !(c && c.cap) && Math.random() < .2 ? { ...randomConfig(), name: 'IRREGULAR' } : { ...pick(pool) }; cfg.paint = paint; return cfg;
};
/* spec: { mech, tank, drone, turret, tier, v } → array of units placed in a ring r0..r1 around (cx,cz). v names one variant for every vehicle in the spec */
function spawn(spec, cx, cz, r0, r1, team = 1, o = {}) {
  const out = [], paint = o.paint ?? (MS.on ? (team === 1 ? MS.foePaint : MS.allyPaint) : pick([1, 3, 5])), vt = unitTier(spec);
  for (const k of ['mech', 'tank', 'drone', 'turret']) for (let i = 0; i < (spec[k] | 0); i++) {
    const [x, z] = groundSpot(cx, cz, r0, r1), v = k === 'mech' ? '' : spec.v || unitPick(k, vt);
    out.push(k === 'mech' ? mkMech(x, z, o.cfg || foeCfg(spec.tier ?? 1, paint), team, o) : k === 'tank' ? mkTank(x, z, team, { ...o, v }) : k === 'drone' ? mkDrone(x, z, team, v) : mkTurret(x, z, team, v));
  }
  return out;
}
function spawnWave(n) {
  P.wave = n; const wt = Math.min(2, n >> 1); spawn({ drone: Math.min(2 + n, 6), tier: wt }, P.pos.x, P.pos.z, 140, 230);
  for (let i = 0; i < Math.min(1 + (n >> 1), 3); i++) { const p = HOME_PADS[1 + Math.floor(rand(5))]; mkTurret(p[0] + rand(-p[2], p[2]) * .8, p[1] + rand(-p[2], p[2]) * .8, 1, unitPick('turret', wt)); }
  spawn({ mech: Math.min(1 + ((n - 1) >> 1), 3), tank: n > 2 ? 1 : 0, tier: Math.min(2, n >> 1) }, P.pos.x, P.pos.z, 190, 280);
  msg(`WAVE ${n} — ${FD.ents.length} HOSTILES INBOUND`, 3.5); sfx.play('alarm');
}
function clearField() {
  for (const e of FD.ents) { FD.scene.remove(e.obj); delCol(e.col); } FD.ents.length = 0; for (const s of FD.shots) FD.scene.remove(s.m); FD.shots.length = 0; for (const b of FD.beams) FD.scene.remove(b.m); FD.beams.length = 0;
  for (const w of FD.wrecks) { FD.scene.remove(w.obj); w.em.life = 0; delCol(w.col); } FD.wrecks.length = 0; for (const o of FD.misc) FD.scene.remove(o); FD.misc.length = 0; FD.tick.length = 0; ftw.length = 0; FD.t0.length = FD.t1.length = 0; glowClear();
}

