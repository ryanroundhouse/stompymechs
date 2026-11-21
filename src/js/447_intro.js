/* ============ THE OPENING: TEN SECONDS OF WAR, THEN THE NAME ============ */
/* What a new player sees before anything else, once (and again from SETTINGS · DISPLAY): four cuts of battle, then STOMPY MECHS coming down like two more footfalls.
   Nothing here is a recording. The battles are the real field with the real machines, weapons and weather, stepped by fieldUnits() and fieldFx() with nobody at the controls; each cut
   builds its own theatre (a biome takes a few milliseconds), walks it forward out of sight until it is in full swing, and then a camera is put on it. The title is a small scene of its own.
   It is cut to the music, which is one cue written into the score (makeScore's `intro`) at 120 beats a minute: a beat is half a second, the heavy machines put a foot down every beat,
   and INTROV.t is read from the audio clock so that the picture cannot drift from the sound.
   The page cannot make a sound until the browser has seen a click or a key, so on a browser that blocks autoplay the opening waits behind CLICK OR PRESS ANY KEY rather than play silent.
   The effects bus is turned down under the score while it runs (sfx.trim) and shut while a cut is run in out of sight (sfx.hush): two seconds of gunfire asked for in one instant clips.
   While it runs `mode` is 'intro': no room updates, body.intro hides every other piece of the page, and #intro (an .ovl, so uiModal() is true and the game's keys stand down) holds the
   bars, the fades and the prompts. It borrows FD.camera and P.pos (the engine measures how loud a thing is from there) and gives back everything it touched: see introEnd(). */
/* st: 0 off, 1 warming up and waiting for the sound, 2 playing · t: seconds into it · a0: the audio time it began at (-1: no audio clock, so count frames) · shot: the cut that is
   built (4 is the title) · sim: how far that cut's field has been stepped · S: that cut's own state · prev: the room to go back to · off: never play unasked (the debug build) ·
   hold: a test is holding one moment · wt, go, warm: the wait (seconds waited, when the go-ahead came, cuts warmed) · keep: what introEnd() puts back · fl: two lamps for flashes ·
   L: the title's scene · blk: how black the cut wants the picture · end: when a skip ends it (performance.now() time) · au, stall: the audio clock's last reading, and the seconds it has stood still · look: where the camera is looking */
const INTROV = { st: 0, t: 0, a0: -1, shot: -1, sim: 0, S: null, prev: 'hangar', off: false, hold: false, shake: 0, wt: 0, go: -1, warm: 0, keep: null, fl: [], L: null, blk: 1, end: 0, stall: 0, au: -1, look: V3() };
const INTRO_LOGO = 7.5, INTRO_OUT = 10.3, INTRO_END = 10.9;
const introSeen = () => !!lsGet('intro');

/* ---- the pieces every cut is made of ---- */
/* a machine from the catalogue, walking the way it faces and in no danger of dying before the script says so */
function introMech(i, x, z, yaw, team = 0, paint, o = {}) {
  const e = mkMech(x, z, { ...PRESETS[i], paint: paint ?? (team ? 3 : PRESETS[i].paint) }, team, { yaw, hpK: 80, nz: true, name: PRESETS[i].name, ai: 'goto', dest: V3(x + Math.sin(yaw) * 900, 0, z + Math.cos(yaw) * 900), ...o });
  e.alert = true; return e;
}
const introTank = (x, z, yaw, team, v) => { const e = mkTank(x, z, team, { v }); e.yaw = yaw; e.obj.rotation.y = yaw; e.hp = e.max = e.hp * 60; e.alert = true; return e; };
const introDrone = (x, z, team, v) => { const e = mkDrone(x, z, team, v); e.hp = e.max = e.hp * 60; e.alert = true; return e; };
/* a formation keeps station: every machine on the field walks at v metres a second, whatever it could do alone */
const introPace = v => { for (const e of FD.ents) if (e.kind === 'mech') e.vk = v / (e.mech.stats.speed * ERUN * .9); };
/* something for a line to shoot at that is not in the picture */
const introMark = (x, z, team) => { const e = introMech(2, x, z, 0, team, 3, { ai: 'hold', hpK: 4000 }); e.pacify = true; return e; };
/* one weapon of one machine at whatever it is looking at, without waiting for the pilot */
function introFire(e, tg, k) {
  const id = e.mech.cfg[k], w = id && (k === 'back' ? PARTS.back[id] : PARTS.arm[id]).weapon; if (!w || w.type === 'melee' || e.dead || !tg || tg.dead) return;
  fire(e.mech, k, w, aimAt(tg, 4, 3).clone(), e.team, tg);
}
/* a line firing at will: each machine lets something go about `rate` times a second on top of what its pilot does */
function introBarrage(rate, dt, team, arms) { for (const e of FD.ents) { if (e.kind !== 'mech' || e.pacify || (team !== undefined && e.team !== team) || Math.random() > rate * dt) continue; introFire(e, e.tgt, pick(arms ? ['armL', 'armR'] : ['armL', 'armR', 'armL', 'armR', 'back'])); } }
/* a flash that lights the ground and whatever stands near it: two lamps, the dimmer is taken */
function introFlash(p, i = 3000, hex = 0xffa050) { const l = INTROV.fl[0].intensity <= INTROV.fl[1].intensity ? INTROV.fl[0] : INTROV.fl[1]; l.position.copy(p); l.position.y += 3; l.color.setHex(hex); l.intensity = i; }
/* a shell landing: fire, a wall of dirt, the lamp, the noise, and the camera feels it */
function introBlast(x, z, s = 2, y = 1.5) {
  const p = V3(x, heightAt(x, z) + y, z), d = p.distanceTo(FD.camera.position); explode(FD.fx, p, s); puff(FD.fx, p, 9 * s, 3.4 * s, .3, .5, 7, 5 * s);
  for (let i = 0; i < 10 * s; i++) FD.fx.smoke.emit(p.x, p.y, p.z, rand(-3, 3) * s, rand(6, 16) * s, rand(-3, 3) * s, rand(1.2, 2.2), rand(1.5, 3) * s, .2, .17, .14, .6, 14, .4, 1.5);
  sfx.play('boom', clamp(1.5 - d / 160, .35, 1.4)); INTROV.shake += clamp(1.15 - d / 110, 0, 1) * s * .4; introFlash(p, 1600 * s);
}
/* a heavy foot coming down in front of the lens */
function introStomp(p, k = 1) {
  const d = p.distanceTo(FD.camera.position), c = EV.key === 'glacial' ? .82 : .5; puff(FD.fx, p, 16 * k, 4.2 * k, c, .5, 3.5, 9 * k);
  for (let i = 0; i < 22 * k; i++) { const a = rand(TAU), v = rand(5, 13) * k; FD.fx.smoke.emit(p.x, p.y + .3, p.z, Math.sin(a) * v, rand(.5, 3.5), Math.cos(a) * v, rand(.9, 1.8), rand(1.6, 3.2) * k, c, c * .96, c * .9, .5, 1, 1.6, 2.4); }
  sparks(FD.fx, p, 10, 7); sfx.play('step', 2.2 * k); sfx.play('thud', 1.4 * k); INTROV.shake += clamp(1.3 - d / 26, .15, 1) * k * .9;
}
/* the field going on with nobody in it: retarget() without the player, then what updateField does round him */
function introSim(dt, t) {
  FD.t0.length = FD.t1.length = 0; for (const e of FD.ents) (e.team === 0 ? FD.t1 : FD.t0).push(e);
  fieldUnits(dt, t); fieldFx(dt, t); FD.fx.spark.update(dt); FD.fx.smoke.update(dt);
}
const introRoll = (secs, step = 1 / 30) => { for (let t = 0; t < secs; t += step) introSim(step, T + t); };
/* walk the field on until one of this machine's feet has just come down, and say when and where the next ones will: [{ t, p }], t in seconds from now. Its stride is as regular as
   a clock, so the third footfall ahead can be stood under */
function introStride(e, hit, least = 2.6) {
  const m = e.mech, F = [], was = m.onStep; let t = 0, n = 0; m.onStep = L => { L.ankP.getWorldPosition(_v); F.push({ t, p: V3(_v.x, heightAt(_v.x, _v.z), _v.z) }); };
  while (t < 9) { n = F.length; t += 1 / 60; introSim(1 / 60, T + t); if (t > least && F.length > n && F.length >= 3) break; }
  m.onStep = L => { was && was(L); L.ankP.getWorldPosition(_v); hit(V3(_v.x, heightAt(_v.x, _v.z), _v.z)); };
  if (F.length < 3) return [];
  const a = F[F.length - 3], b = F[F.length - 2], c = F[F.length - 1], per = c.t - a.t, S = c.p.clone().sub(a.p), out = [];
  for (let k = 1; k <= 6; k++) { const j = Math.ceil(k / 2), odd = k & 1; out.push({ t: (odd ? b.t - c.t : 0) + per * j, p: (odd ? b.p : c.p).clone().addScaledVector(S, j) }); }
  return out;
}
/* the view: from, at, lens. The particles are sized for the game's own lens, so a longer one has to be told */
function introCam(px, py, pz, lx, ly, lz, fov) {
  const c = FD.camera; c.position.set(px, Math.max(py, heightAt(px, pz) + .3), pz); c.lookAt(lx, ly, lz); if (c.fov !== fov) { c.fov = fov; c.updateProjectionMatrix(); }
  INTROV.look.set(lx, ly, lz);
}
const introEv = (S, u) => { while (S.ei < S.ev.length && S.ev[S.ei][0] <= u) S.ev[S.ei++][1](); };

/* ---- the four cuts. init(S) builds the theatre and runs it in; tick(S, u, dt) is every frame, u seconds into the cut ---- */
const INTRO_SHOTS = [
  /* 1 · DESERT, IN A DUST STORM. From the ground: a dreadnought walks over the lens, a foot down on every beat, the company behind it and the first shells coming in */
  {
    at: 0, init(S) {
      buildEnv('desert', 23, { mood: 1, pads: [[0, 0, 230]] }); const yaw = -.6435, dx = Math.sin(yaw), dz = Math.cos(yaw), rx = dz, rz = -dx, at = (b, s) => [-dx * b + rx * s, -dz * b + rz * s];
      S.d = [dx, dz]; S.r = [rx, rz]; S.hero = introMech(17, ...at(34, 0), yaw, 0, 4); S.hero.mech.gait.sk = 1.211;
      for (const [i, b, s, p] of [[1, 62, -27, 0], [14, 66, 30, 1], [9, 92, -58, 0], [2, 100, 2, 5], [5, 96, 60, 1], [15, 132, -30, 0], [3, 138, 34, 5], [0, 50, 64, 2], [10, 128, 92, 4], [16, 150, -84, 1]]) introMech(i, ...at(b, s), yaw, 0, p);
      for (const [b, s, v] of [[80, -92, 'mam'], [84, 96, 'striker'], [118, 10, 'mam']]) introTank(...at(b, s), yaw, 0, v);
      S.marks = [[-230, -60], [-250, 10], [-235, 70]].map(([b, s]) => introMark(...at(b, s), 1));
      introPace(S.hero.mech.stats.speed * ERUN * .9); introRoll(1.4); S.F = introStride(S.hero, p => introStomp(p, 1.25));
      const f3 = S.F[2].p, h = S.hero.pos, lat = (f3.x - h.x) * rx + (f3.z - h.z) * rz;   /* the third footfall from now comes down three metres short of the lens, and a little to one side of it */
      S.c = V3(f3.x + dx * 3.2 - rx * lat * .7, 0, f3.z + dz * 3.2 - rz * lat * .7); S.c.y = heightAt(S.c.x, S.c.z) + 1; S.lk = V3(h.x, h.y + S.hero.mech.height * .3, h.z);
      const B = (b, s, k) => () => introBlast(S.c.x + at(b, s)[0], S.c.z + at(b, s)[1], k);
      S.ei = 0; S.ev = [[.12, B(58, -30, 2.2)], [.7, B(44, 36, 2.4)], [.86, () => { for (const e of FD.ents) if (e.team === 0 && e.kind === 'mech') { introFire(e, pick(S.marks), 'back'); introFire(e, pick(S.marks), 'armR'); } }], [1.22, B(30, -22, 2.6)], [1.62, B(70, 8, 2.2)]];
    },
    tick(S, u, dt) {
      introEv(S, u); introBarrage(.9, dt, 0);
      if (Math.random() < dt * 5) { const m = pick(S.marks), tg = pick(FD.ents.filter(e => e.team === 0)); if (tg) fireFrom(V3(m.pos.x + rand(-40, 40), m.pos.y + 9, m.pos.z + rand(-40, 40)), aimAt(tg, 16, 10).clone(), PARTS.arm.acn.weapon, m); }
      const h = S.hero.pos, M = S.hero.mech, along = Math.max(5, (S.c.x - h.x) * S.d[0] + (S.c.z - h.z) * S.d[1]);
      S.lk.lerp(_v.set(S.c.x - S.d[0] * along, h.y + M.height * lerp(.3, .95, smooth(clamp(1.25 - along / 12, 0, 1))), S.c.z - S.d[1] * along), 1 - Math.exp(-7 * dt));
      introCam(S.c.x + S.r[0] * u * .5, S.c.y + u * .12, S.c.z + S.r[1] * u * .5, S.lk.x, S.lk.y, S.lk.z, 66);
    },
  },
  /* 2 · VOLCANIC. Over the shoulder of a firing line, tracking along it: everything it has going out across the lava, and what comes back */
  {
    at: 2, init(S) {
      buildEnv('volcanic', 9, { pads: [[0, 70, 210]] });
      S.us = [[3, -70, 5], [13, -42, 2], [2, -14, 5], [4, 14, 4], [15, 42, 0], [12, 70, 5], [5, 96, 1]].map(([i, x, p]) => introMech(i, x, rand(-4, 4), 0, 0, p));
      S.them = [[9, -78], [10, -50], [16, -20], [2, 8], [1, 36], [11, 64], [14, 92]].map(([i, x]) => introMech(i, x, 126 + rand(-7, 7), PI, 1));
      for (const x of [-60, -4, 50]) introTank(x, 106, PI, 1, 'striker'); for (const x of [-24, 58]) introTank(x, 26, 0, 0, 'mam');
      for (let i = 0; i < 5; i++) introDrone(-60 + i * 30, 84, 1, 'hunter');
      introPace(4.2); introRoll(1.7); for (const e of S.us) for (const k of ['armL', 'armR']) introFire(e, e.tgt || pick(S.them), k); introRoll(.45);
      const K = k => () => { const e = S.them[k]; if (!e.dead) { introFlash(e.pos, 5000); killEnt(e, 4); } }, x0 = S.us[0].pos.x, z0 = S.us[0].pos.z;
      S.ei = 0; S.ev = [[.3, () => introBlast(x0 + 96, z0 + 30, 2.2)], [.72, K(3)], [1.05, () => introBlast(x0 + 130, z0 + 12, 2)], [1.36, K(1)], [1.62, () => introBlast(x0 + 70, z0 + 44, 2.4)]];
    },
    tick(S, u, dt) {
      introEv(S, u); introBarrage(1.7, dt, 0, true); introBarrage(1.2, dt, 1, true);
      const a = S.us[0].pos, k = u / 2; introCam(a.x - 30 + k * 18, a.y + 9.5 - k * 2, a.z - 27 + k * 6, a.x + 76, a.y + 7, a.z + 62, 46);
    },
  },
  /* 3 · URBAN, DUSK, RAIN. A Leviathan comes down burning over a lance that has been shooting at it for some time */
  {
    at: 4, init(S) {
      buildEnv('urban', 31, { pads: [[0, 40, 170]] }); applyAtmo(1.25, .5, 'rain'); S.hit = 1.38;
      S.us = [[2, -24, 2, 5], [9, 30, -4, 0], [13, 52, 14, 2], [1, -50, 12, 0], [12, -78, 26, 5]].map(([i, x, z, p]) => introMech(i, x, z, 0, 0, p, { ai: 'hold' }));
      const sh = S.ship = mkCapital('lev', 0, 300, 1, { yaw: -1.9, alert: true, alt: 62 }); sh.hp = sh.max = 1e7; sh.update = () => { }; for (const s of sh.subs) s.hp = s.max = 1e7;
      for (let i = 0; i < 6; i++) introDrone(-70 + i * 28, 90 + (i & 1) * 40, 1, 'hunter');
      S.at = V3(-6, 0, 84); S.at.y = heightAt(S.at.x, S.at.z); S.fall = u => {
        const q = Math.max(0, S.hit - u), g = sh.obj; g.position.set(S.at.x - Math.sin(sh.yaw) * 24 * q, S.at.y + 9 + 11 * q * q + 13 * q, S.at.z - Math.cos(sh.yaw) * 24 * q); g.rotation.set(0, sh.yaw, 0); g.rotateX(.34 - .1 * q); g.rotateZ(.5 - .12 * q);
      };
      S.along = () => V3(rand(-9, 9), rand(-4, 7), rand(-46, 46)).applyQuaternion(sh.obj.quaternion).add(sh.obj.position);
      S.burn = dt => { if (Math.random() < dt * 9) { const p = S.along(); explode(FD.fx, p, rand(1.4, 2.8)); introFlash(p, 2600, 0xff7030); } for (let i = 0; i < 3; i++) if (Math.random() < dt * 30) { const p = S.along(); FD.fx.smoke.emit(p.x, p.y, p.z, rand(-2, 2), rand(4, 10), rand(-2, 2), rand(2, 3.6), rand(6, 11), .1, .08, .07, .6, -.3, .2, 2); FD.fx.spark.emit(p.x, p.y, p.z, rand(-3, 3), rand(2, 9), rand(-3, 3), rand(.5, 1.1), rand(2.5, 5), 6, 2.2, .4, .9, -3, .4, 1.2); } };
      for (let t = -2.2; t < 0; t += 1 / 30) { S.fall(t); S.burn(1 / 30); introSim(1 / 30, T + t); if (t > -1.2) introBarrage(3, 1 / 30, 0); } S.done = false;
    },
    tick(S, u, dt) {
      const sh = S.ship;
      if (!S.done) {
        S.fall(u); S.burn(dt); introBarrage(3.2, dt, 0);
        if (u >= S.hit) {
          S.done = true; const p = sh.obj.position.clone(); for (let i = 0; i < 9; i++) explode(FD.fx, S.along(), 3.4); introBlast(p.x, p.z, 4.5, 6); introBlast(p.x + 26, p.z - 14, 3.2); introBlast(p.x - 30, p.z + 10, 3.2); introFlash(p, 60000, 0xffb070); INTROV.shake += 1.3; sfx.play('boom', 1.8);
          for (const e of [sh, ...sh.subs]) { const i = FD.ents.indexOf(e); if (i >= 0) FD.ents.splice(i, 1); e.dead = true; } for (let i = 0; i < 5; i++) FD.emit.push({ p: S.along(), kind: 'smoke', life: 20 });
        }
      } else if (Math.random() < dt * 12) explode(FD.fx, S.along(), rand(1.5, 3));
      const g = sh.obj.position, k = smooth(clamp(u / 2, 0, 1)); S.lk = S.lk || g.clone(); S.lk.lerp(_v.set(g.x * .85, Math.max(g.y - 6, 13), g.z), 1 - Math.exp(-5 * dt));
      introCam(6 - k * 4, heightAt(6, -34) + 2.2 + k * .8, -34 + k * 6, S.lk.x, S.lk.y, S.lk.z, 56);
    },
  },
  /* 4 · GLACIAL, SNOWING. Head on: the dreadnought with everything firing, and the third step is on the lens: the picture goes black under the sole, which is where the title comes in */
  {
    at: 6, init(S) {
      buildEnv('glacial', 12, { pads: [[0, 0, 230]] }); applyAtmo(1.7, .9, 'snow');
      S.hero = introMech(17, 0, -44, 0, 0, 4); S.hero.mech.gait.sk = 1.211;
      for (const [i, x, z, p] of [[2, -30, -72, 5], [14, 32, -76, 1], [9, -62, -100, 0], [10, 64, -104, 4], [13, 2, -112, 2], [16, -96, -128, 1], [1, 98, -132, 0]]) introMech(i, x, z, 0, 0, p);
      S.marks = [[-70, 250], [0, 270], [70, 250]].map(([x, z]) => introMark(x, z, 1));
      introPace(S.hero.mech.stats.speed * ERUN * .9); introRoll(.9); S.F = introStride(S.hero, p => introStomp(p, 1.2));
      const f = S.F[2].p; S.c = V3(f.x, f.y + .45, f.z + .5); S.tl = S.F[2].t; S.lk = V3(S.hero.pos.x, S.hero.pos.y + 4, S.hero.pos.z);
      S.ei = 0; S.ev = [[.16, () => introBlast(S.c.x - 22, S.c.z - 40, 2.4)], [.6, () => { for (const e of FD.ents) if (e.team === 0 && e.kind === 'mech') { introFire(e, pick(S.marks), 'back'); introFire(e, pick(S.marks), 'armL'); } }], [.84, () => introBlast(S.c.x + 26, S.c.z - 54, 2.6)], [1.2, () => introBlast(S.c.x - 14, S.c.z - 70, 2.2)]];
    },
    tick(S, u, dt) {
      introEv(S, u); introBarrage(3.4, dt, 0);
      if (Math.random() < dt * 7) { const m = pick(S.marks), tg = pick(FD.ents.filter(e => e.team === 0)); if (tg) fireFrom(V3(m.pos.x + rand(-40, 40), m.pos.y + 9, m.pos.z), aimAt(tg, 14, 9).clone(), PARTS.arm.acn.weapon, m); }
      const h = S.hero.pos, M = S.hero.mech, d = Math.max(3.5, S.c.z - h.z); S.lk.lerp(_v.set(h.x, h.y + M.height * lerp(.22, 1, smooth(clamp(1.3 - d / 8, 0, 1))), S.c.z - d), 1 - Math.exp(-8 * dt));
      introCam(S.c.x, S.c.y, S.c.z, S.lk.x, S.lk.y, S.lk.z, 84); INTROV.blk = clamp((u - S.tl + .1) / .07, 0, 1);   /* the sole shuts the light out a moment before it lands */
    },
  },
];

/* ---- the title: the two words as steel, driven into a wall of armour plate a beat apart, STOMPY over MECHS. The letters are drawn here as outlines on a 5 by 7 grid, corners cut,
   and extruded: no font is asked for, so the name is the same on every machine ---- */
const INTRO_GLYPH = {
  S: [[[0, 0], [5, 0], [5, 4.25], [1.5, 4.25], [1.5, 5.5], [5, 5.5], [5, 7], [0, 7], [0, 2.75], [3.5, 2.75], [3.5, 1.5], [0, 1.5]]],
  T: [[[1.75, 0], [3.25, 0], [3.25, 5.5], [5, 5.5], [5, 7], [0, 7], [0, 5.5], [1.75, 5.5]]],
  O: [[[0, 0], [5, 0], [5, 7], [0, 7]], [[1.5, 1.5], [3.5, 1.5], [3.5, 5.5], [1.5, 5.5]]],
  M: [[[0, 0], [1.5, 0], [1.5, 4.4], [3.1, 1.9], [4.7, 4.4], [4.7, 0], [6.2, 0], [6.2, 7], [4.6, 7], [3.1, 4.6], [1.6, 7], [0, 7]]],
  P: [[[0, 0], [1.5, 0], [1.5, 2.6], [5, 2.6], [5, 7], [0, 7]], [[1.5, 4.1], [3.5, 4.1], [3.5, 5.5], [1.5, 5.5]]],
  Y: [[[1.75, 0], [3.25, 0], [3.25, 3.1], [5, 7], [3.35, 7], [2.5, 4.9], [1.65, 7], [0, 7], [1.75, 3.1]]],
  E: [[[0, 0], [5, 0], [5, 1.5], [1.5, 1.5], [1.5, 2.75], [4.2, 2.75], [4.2, 4.25], [1.5, 4.25], [1.5, 5.5], [5, 5.5], [5, 7], [0, 7]]],
  C: [[[0, 0], [5, 0], [5, 2.2], [3.5, 2.2], [3.5, 1.5], [1.5, 1.5], [1.5, 5.5], [3.5, 5.5], [3.5, 4.8], [5, 4.8], [5, 7], [0, 7]]],
  H: [[[0, 0], [1.5, 0], [1.5, 2.75], [3.5, 2.75], [3.5, 0], [5, 0], [5, 7], [3.5, 7], [3.5, 4.25], [1.5, 4.25], [1.5, 7], [0, 7]]],
};
/* an outline with its square outside corners cut off at 45 degrees (an outer ring is given anticlockwise, so a left turn is an outside corner; a hole's corners are cut the other way) */
function introChamfer(P, c, hole) {
  const out = [], n = P.length;
  for (let i = 0; i < n; i++) {
    const a = P[(i + n - 1) % n], b = P[i], d = P[(i + 1) % n], ux = b[0] - a[0], uy = b[1] - a[1], vx = d[0] - b[0], vy = d[1] - b[1], lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy), cr = ux * vy - uy * vx, k = Math.min(c, lu * .34, lv * .34);
    if ((hole ? cr < 0 : cr > 0) && Math.abs(ux * vx + uy * vy) < 1e-6) out.push([b[0] - ux / lu * k, b[1] - uy / lu * k], [b[0] + vx / lv * k, b[1] + vy / lv * k]); else out.push(b);
  }
  return out;
}
/* a word, its middle at the group's origin and its back at z = 0 */
function introWord(text, face, side) {
  const g = new THREE.Group(), L = []; let x = 0;
  for (const ch of text) {
    const G = INTRO_GLYPH[ch], lean = p => new THREE.Vector2(p[0] + p[1] * .1, p[1]), sh = new THREE.Shape(introChamfer(G[0], .62).map(lean));   /* leaning a little, into the wind */
    for (const h of G.slice(1)) sh.holes.push(new THREE.Path(introChamfer(h, .3, true).map(lean)));
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 2.3, bevelEnabled: true, bevelThickness: .2, bevelSize: .15, bevelSegments: 2, curveSegments: 1 }), [face, side]);
    m.castShadow = true; m.position.x = x; L.push(m); x += G[0].reduce((w, q) => Math.max(w, q[0]), 0) + .85;
  }
  const w = x - .85 + .7; for (const m of L) { m.position.x -= w / 2; m.position.y = -3.5; m.position.z = .2; g.add(m); } g.userData.w = w; return g;
}
function introLogoBuild() {
  const sc = new THREE.Scene(), L = INTROV.L = { scene: sc, camera: new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 900), words: [] }; sc.background = new THREE.Color(0x020304); sc.environment = ENV;
  sc.add(new THREE.HemisphereLight(0x9fb4d0, 0x241a10, .1));
  /* one hard lamp from up and to the left, raking across the plate so that every letter throws a shadow down it; a cold one from the other side to find the edges */
  L.key = new THREE.SpotLight(0xffe6c4, 0, 0, .62, .85, 0); L.key.position.set(-58, 52, 84); L.key.castShadow = CFG.shadow; L.key.shadow.mapSize.set(2048, 2048); L.key.shadow.bias = -.0006; L.key.shadow.normalBias = .04; L.key.shadow.camera.near = 30; L.key.shadow.camera.far = 220; sc.add(L.key, L.key.target);
  L.rim = new THREE.DirectionalLight(0x5fa8ff, 0); L.rim.position.set(60, -14, 30); sc.add(L.rim);
  L.sweep = new THREE.PointLight(0xfff2dc, 0, 70, 1.4); sc.add(L.sweep);
  L.hot = [new THREE.PointLight(0xff9040, 0, 110, 1.6), new THREE.PointLight(0xff9040, 0, 110, 1.6)]; sc.add(...L.hot);
  const pt = TX.panel.clone(); pt.needsUpdate = true; pt.repeat.set(9, 5); const plate = new THREE.Mesh(new THREE.PlaneGeometry(520, 290), std({ color: 0x343a41, metalness: .72, roughness: .5, envMapIntensity: .35, map: pt })); plate.receiveShadow = true; sc.add(plate);
  const side = std({ color: 0x15171a, metalness: .9, roughness: .34, envMapIntensity: .7 });
  const A = introWord('STOMPY', std({ color: 0xf1ebdc, metalness: .35, roughness: .34, envMapIntensity: .7, emissive: 0xf1ebdc, emissiveIntensity: .05 }), side), B = introWord('MECHS', std({ color: 0xffa218, metalness: .4, roughness: .32, envMapIntensity: .7, emissive: 0xff8a00, emissiveIntensity: .1 }), side);
  /* MECHS is set a little larger so that the two lines are the same width: one block */
  const kb = A.userData.w / B.userData.w, gap = 1.5, H = 7 + gap + 7 * kb; B.userData.k = kb; A.userData.k = 1; A.userData.y = H / 2 - 3.5; B.userData.y = -H / 2 + 3.5 * kb; L.W = A.userData.w; L.H = H;
  for (const g of [A, B]) { g.userData.hw = g.userData.w * g.userData.k / 2; g.userData.hh = 3.5 * g.userData.k; g.position.set(0, g.userData.y, 400); sc.add(g); L.words.push(g); }
  L.fx = { spark: new Particles(sc, 1200, true), smoke: new Particles(sc, 900, false) };
}
/* a word arriving: out of the dark behind the lens and into the plate in a sixth of a second. Where it hits, dust and sparks go out along the plate from its edges, and it rings */
function introLogoTick(u, dt) {
  const L = INTROV.L, cam = L.camera, hits = [0, .5], asp = innerWidth / innerHeight, t15 = Math.tan(15 * PI / 180);
  /* the lens stands back far enough to hold the block in the letterbox whatever the shape of the window, and creeps in once it is there */
  const D = Math.max(L.W / (.5 * 2 * t15 * asp), L.H / (.56 * 2 * t15 * Math.min(1, asp / 2.39))) * (1 - .07 * smooth(clamp(u / 3.2, 0, 1)));
  for (let i = 0; i < 2; i++) {
    const g = L.words[i], U = g.userData, v = u - hits[i], k = U.k;
    if (v < 0) { const q = Math.min(1, -v / .17); g.position.set(0, U.y, D * .78 * q ** 1.5); g.scale.set(k, k, k); g.rotation.set(q * .5 * (i ? -1 : 1), 0, q * .16 * (i ? 1 : -1)); if (v < -.17) g.position.z = D * 3; }
    else {
      const q = Math.exp(-v * 10) * Math.cos(v * 30); g.position.set(0, U.y, 0); g.rotation.set(0, 0, 0); g.scale.set(k * (1 + q * .03), k * (1 + q * .03), k * (1 - q * .45));
      if (!U.hit) {
        U.hit = true; INTROV.shake += i ? 1.3 : 1.05; sfx.play('boom', i ? 1.7 : 1.4); sfx.play('punch', 1.5); sfx.play('clang'); L.hot[i].position.set(rand(-8, 8), U.y, 9); L.hot[i].intensity = 260;
        /* out from the edge of the word: a point on its outline, and away from its middle */
        const edge = () => { const s = rand(-1, 1), e = Math.random() < U.hw / (U.hw + U.hh) ? [s * U.hw, Math.sign(rand(-1, 1)) * U.hh] : [Math.sign(rand(-1, 1)) * U.hw, s * U.hh], n = Math.hypot(e[0] / U.hw, e[1] / U.hh) || 1; return [e[0], e[1] + U.y, e[0] / U.hw / n, e[1] / U.hh / n]; };
        for (let j = 0; j < 190; j++) { const [x, y, nx, ny] = edge(), sp = rand(4, 30); L.fx.smoke.emit(x, y, rand(.4, 2.4), nx * sp, ny * sp, rand(-.5, 7), rand(1.1, 2.6), rand(2, 4.6), .2, .18, .16, .34, 0, 1.9, 2.2); }
        for (let j = 0; j < 170; j++) { const [x, y, nx, ny] = edge(), sp = rand(8, 46); L.fx.spark.emit(x, y, rand(.5, 2.6), nx * sp + rand(-5, 5), ny * sp + rand(-5, 5), rand(0, 26), rand(.35, 1.2), rand(.2, .5), 5, 2.4, .6, 1, 0, 1.6); }
      }
    }
  }
  const lit = clamp((u + .1) / .14, 0, 1), calm = smooth(clamp((u - .5) / 1.3, 0, 1)); L.key.intensity = lit * (1.25 + calm * .75); L.key.target.position.set(0, -2, 0); L.rim.intensity = lit * (.5 + calm * .5);
  for (const l of L.hot) l.intensity *= Math.exp(-dt * 5);
  /* one pass of light along the name once both words are in, and embers across it for as long as it stands */
  const sw = clamp((u - .95) / 1.3, 0, 1); L.sweep.position.set(lerp(-L.W * .75, L.W * .75, sw), 1, 10); L.sweep.intensity = Math.sin(sw * PI) * 120;
  if (u > 0 && Math.random() < dt * 30) L.fx.spark.emit(rand(-L.W, L.W), rand(-L.H, -L.H * .2), rand(4, 30), rand(-1.5, 3), rand(2, 7), rand(-1, 1), rand(1.6, 3.4), rand(.14, .34), 5, 2, .5, .8, -1, .25);
  L.fx.spark.update(dt); L.fx.smoke.update(dt);
  const sh = INTROV.shake; cam.aspect = asp; cam.fov = 30; cam.updateProjectionMatrix(); cam.position.set(lerp(-5, 4, clamp(u / 3.4, 0, 1)) + rand(-1, 1) * sh * .9, -1.5 + rand(-1, 1) * sh * .9, D); cam.lookAt(0, 0, 0); cam.rotateZ(rand(-1, 1) * sh * .012);
  const us = renderer.domElement.height * .95 * Math.tan(31 * PI / 180) / t15; L.fx.spark.mat.uniforms.uS.value = L.fx.smoke.mat.uniforms.uS.value = us;
}

/* ---- the director ---- */
/* the cut that is on at t: the field shots by number, 4 for the title */
const introShotAt = t => t >= INTRO_LOGO ? 4 : INTRO_SHOTS.reduce((n, s, i) => t >= s.at ? i : n, 0);
function introCut(i) {
  INTROV.shot = i; INTROV.blk = 0; INTROV.shake = 0; P.shake = 0; clearField(); for (const f of [FD.fx.spark, FD.fx.smoke, FD.fx.wx]) { f.life.fill(0); f.siz.fill(0); } for (const l of INTROV.fl) l.intensity = 0;
  if (i > 3) { if (!INTROV.L) introLogoBuild(); INTROV.L.key.castShadow = CFG.shadow; for (const g of INTROV.L.words) g.userData.hit = false; for (const f of [INTROV.L.fx.spark, INTROV.L.fx.smoke]) { f.life.fill(0); f.siz.fill(0); } return; }
  /* a cut opens some way into its fight: nothing that was fired on the way there is heard */
  const S = INTROV.S = {}; INTROV.sim = 0; sfx.hush(true); INTRO_SHOTS[i].init(S); sfx.hush(INTROV.st !== 2 || INTROV.hold);
}
/* everything to time t: cut if it is time to, catch the field up with the clock in steps no longer than a thirtieth, put the camera on it */
function introStep(t, dt) {
  const i = introShotAt(t); if (i !== INTROV.shot) introCut(i); INTROV.t = t; INTROV.shake = Math.max(0, INTROV.shake - dt * 2.6); P.shake = Math.max(0, P.shake - dt * 2.6);
  if (i > 3) { introLogoTick(t - INTRO_LOGO, dt); POST.scene = INTROV.L.scene; POST.camera = INTROV.L.camera; POST.strength = .5; return; }
  const sh = INTRO_SHOTS[i], S = INTROV.S, u = t - sh.at, c = FD.camera; let n = 0;
  while (INTROV.sim < u - 1e-4 && n++ < 6) { const d = Math.min(1 / 30, u - INTROV.sim); introSim(d, T + INTROV.sim); INTROV.sim += d; }
  if (INTROV.sim < u) INTROV.sim = u;
  sh.tick(S, u, dt); const k = Math.min(1.6, INTROV.shake + P.shake); if (k > 0) { c.position.x += rand(-1, 1) * k * .3; c.position.y += rand(-.4, 1) * k * .3; c.position.z += rand(-1, 1) * k * .3; c.rotateZ(rand(-1, 1) * k * .014); }
  P.pos.copy(c.position); FD.sky.position.copy(c.position); FD.sun.position.copy(INTROV.look).addScaledVector(FD.sunDir, 220); FD.sun.target.position.copy(INTROV.look);
  if (FD.lamp.intensity) { FD.lamp.position.copy(c.position); FD.lamp.position.y += 9; FD.lamp.target.position.copy(INTROV.look); }
  for (const l of INTROV.fl) l.intensity *= Math.exp(-dt * 8);
  const us = renderer.domElement.height * .95 * Math.tan(31 * PI / 180) / Math.tan(c.fov * PI / 360); for (const f of [FD.fx.spark, FD.fx.smoke, FD.fx.wx]) f.mat.uniforms.uS.value = us;
  POST.scene = FD.scene; POST.camera = c; POST.strength = .48;
}
/* take the stage: the room that was showing waits where it is */
function introOpen() {
  if (INTROV.st || mode === 'field' || mode === 'brief' || busy) return false;
  const c = FD.camera; INTROV.keep = { fov: c.fov, pos: P.pos.clone(), shake: P.shake, kills: P.kills, loot: YARD.loot.slice(), k: FD.k };
  Object.assign(INTROV, { st: 1, t: 0, a0: -1, shot: -1, prev: mode, wt: 0, go: -1, warm: 0, blk: 1, end: 0, stall: 0, au: -1, hold: false });
  if (!INTROV.fl.length) INTROV.fl = [new THREE.PointLight(0xffa050, 0, 190, 1.5), new THREE.PointLight(0xffa050, 0, 190, 1.5)]; FD.scene.add(...INTROV.fl);
  tal('t.intro'); TALLY.off = true; mode = 'intro'; sfx.hush(true); sfx.trim(.55); dlgClose(); fieldScale(1); document.body.classList.add('intro'); const el = $('intro'); el.className = 'ovl'; $('inBlk').style.opacity = 1; POST.scene = FD.scene; POST.camera = c; return true;
}
/* hand everything back as it was found */
function introEnd() {
  if (!INTROV.st) return; const K = INTROV.keep, c = FD.camera; INTROV.st = 0; TALLY.off = false; talBy = null; INTROV.shot = -1; INTROV.S = null; music.introStop(); sfx.hush(false); sfx.trim(1);
  clearField(); clearEnv(); EV.home = false; EV.key = ''; MAPV.key = ''; fieldScale(K.k); FD.scene.remove(...INTROV.fl); FD.lamp.intensity = 0;
  for (const f of [FD.fx.spark, FD.fx.smoke, FD.fx.wx]) { f.life.fill(0); f.siz.fill(0); f.update(0); } $('msg').style.opacity = 0; msgT = 0;
  c.fov = K.fov; c.updateProjectionMatrix(); P.pos.copy(K.pos); P.shake = K.shake; P.kills = K.kills; YARD.loot = K.loot; dispatchEvent(new Event('resize'));   /* the resize puts the particles back to the game's lens */
  if (!introSeen()) lsSet('intro', '1'); mode = INTROV.prev; document.body.classList.remove('intro'); const el = $('intro'); el.className = 'out'; $('inBlk').style.opacity = 1; setTimeout(() => { if (!INTROV.st) el.className = 'ovl hid'; }, 950);   /* no longer an .ovl while it fades: the room has its keys back at once */
}
/* a skip is timed by the wall clock: it has to work whatever the opening's own clock is doing */
function introSkip() { if (INTROV.st !== 2 || INTROV.end) return; INTROV.end = performance.now() + 300; music.introStop(.25); }
/* called from frame() while mode is 'intro' */
function introFrame(dt) {
  const V = INTROV, gate = $('inGate');
  if (V.st === 1) {
    /* build each cut once out of sight so that its shaders are compiled before the clock starts, then wait for the sound: at once where the page may play, otherwise for a click or a key */
    V.wt += dt; if (V.warm < 4) { introCut(3 - V.warm); introStep(INTRO_SHOTS[3 - V.warm].at, 0); renderer.compile(FD.scene, FD.camera); V.warm++; POST.scene = FD.scene; POST.camera = FD.camera; return; }
    if (V.warm === 4) { V.warm = 5; if (!V.L) introLogoBuild(); renderer.compile(V.L.scene, V.L.camera); }
    const ok = music.clock() >= 0, mute = !CFG.vol || music.clock() === -2; if (V.go < 0 && (ok || mute) && V.wt > .5) V.go = V.wt;
    gate.classList.toggle('on', V.go < 0 && V.wt > 1.1); if (V.go < 0 || (!ok && !mute && V.wt - V.go < .4)) return;
    gate.classList.remove('on'); V.st = 2; V.t = 0; V.shot = -1; V.a0 = music.intro(); sfx.hush(false); $('intro').classList.add('run');
  }
  /* the audio clock is the master, but it is not read raw: some browsers move it a whole callback at a time (ten milliseconds or more), which would judder every pan. The picture
     runs on the frame clock and is steered onto the audio's, an eighth of the difference a frame, or all of it at once after a hitch. If the audio clock stops altogether (the
     output device going away, say) the picture carries on by the frame clock alone instead of standing still */
  const a = music.clock(), now = performance.now(); let t = V.hold ? V.t : V.t + dt;
  if (V.a0 >= 0 && a >= 0 && !V.hold) {
    const au = a - V.a0, err = au - t; t = Math.abs(err) > .1 ? Math.max(V.t, au) : Math.max(V.t, t + err * .12);
    V.stall = au - V.au < 1e-4 ? V.stall + dt : 0; V.au = au; if (V.stall > .3) V.a0 = -1;
  }
  if (t >= INTRO_END || (V.end && now >= V.end)) return introEnd();
  introStep(t, V.hold ? 0 : dt);
  const out = V.end ? clamp(1 - (V.end - now) / 300, 0, 1) : clamp((t - INTRO_OUT) / (INTRO_END - INTRO_OUT - .1), 0, 1); $('inBlk').style.opacity = Math.max(V.blk, out, 1 - clamp(t / .45, 0, 1));
}
/* once, as the page finishes loading */
function introBoot() { if (!INTROV.off && !introSeen()) introOpen(); }
{
  /* any key or click begins it if it is waiting, and ends it once it has had a moment to be seen */
  const on = e => { const V = INTROV; if (!V.st) return; if (V.st === 1) { if (V.go < 0 && V.wt > .3) V.go = V.wt; } else if (V.t > .7 && !e.repeat) introSkip(); e.stopPropagation(); if (e.type === 'keydown' && e.code !== 'F5' && e.code !== 'F11' && e.code !== 'F12' && !e.metaKey && !e.ctrlKey) e.preventDefault(); };
  addEventListener('keydown', on, true); addEventListener('pointerdown', on, true);
}
