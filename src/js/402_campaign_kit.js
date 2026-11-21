/* ============ THE CAMPAIGN'S KIT: THE KALDUR CONCORD, ITS MIRROR, AND WHAT THE MIRROR DOES TO THE GROUND ============ */
/* FALSE DAWN (STORY.sun, in the three files after this one) is the one thread marked `main`: eight chapters in three acts, its card over and above the three story cards and never withdrawn.
   It changes the rest of the game as it goes, and everything it changes is read from where the thread stands, so nothing here is saved twice:
   sunWar()  from the end of chapter III until it is over: war rates on every contract, and the Concord interdicts some of them (TWISTS.concord)
   sunDim()  from the end of chapter V until it is over: the Array is edge-on across the sun, and every sky in the sector is TOD.ecl (todKey)
   sunKey()  from the end of chapter V: the company holds a fire key, and B calls the SKY LANCE once a sortie (sunCall). After the last chapter it stays only if the keys were kept ('sun.end' 2)
   These are function declarations on purpose: todKey and genContract, far above, call them */
Object.assign(STC, {
  stroud: { name: 'Commissioner Aurelia Stroud', first: 'Aurelia', last: 'Stroud', role: 'THE KALDUR CONCORD · COMMISSIONER', seed: 9301, col: '#ffe2a0' },
  wick: { name: 'Tomasz "Wick" Abara', first: 'Wick', last: 'Abara', role: 'DAYBREAK ARRAY · CHIEF LAMPLIGHTER', seed: 9303, col: '#ffb86a' },
  thale: { name: 'Marshal Corin Thale', first: 'Corin', last: 'Thale', role: 'CONCORD PEACEKEEPERS · FLAG, PAX', seed: 9305, col: '#d8dce6' },
});
Object.assign(CAST, { 9301: { build: 'slim', h: 1.76, habit: 'back', ...stLook('#b8b8b8', 3, '', '#e0ac69') }, 9303: { build: 'avg', h: 1.72, habit: 'hips', ...stLook('#3b2416', 0, 'glasses', '#8d5524') }, 9305: { build: 'broad', h: 1.9, habit: 'stand', ...stLook('#e8e8e8', 2, 'scar', '#f1c9a5') } });
Object.assign(VOX_WHO, { 9301: 'stroud', 9303: 'wick', 9305: 'thale' });
Object.assign(VOX_CAST, {
  stroud: { f0: 172, tr: 1.04, rate: 4.2, range: 3.2, brass: .12, breath: .12, crisp: 1.2, stac: .12, tilt: 3000, lilt: .5, dip: .1, ph: ['llmmnnssvd.', 'aaeeoo', '.....nl'], emo: ['hm'], emoP: .05 },                  /* Stroud: low for a woman, unhurried, never once raised */
  wick: { f0: 148, tr: .98, rate: 6.6, range: 8, brass: .2, breath: .2, crisp: 1.2, stac: .25, tilt: 3100, lilt: 1.5, dip: .35, ph: ['ttkkppbbdw.', 'iieeaao', '....ktn'], emo: ['ah', 'oh', 'eh', 'ha'], emoP: .3 },          /* Wick: fast, warm, trips over his own enthusiasm */
  thale: { f0: 98, tr: .88, rate: 3.9, range: 2.6, brass: .46, rough: .3, crisp: .95, stac: .6, tilt: 2200, lilt: .35, ph: ['ttddkkgrn.', 'aaoouE', '....tdn'], emo: ['hm', 'grunt'], emoP: .08 },                         /* Thale: a parade ground, tired */
});
const SUN_PAINT = { n: 'CONCORD', pri: 0xe6e1d2, sec: 0x262b36, acc: 0xffc23a, glow: 0xfff0b0 };
function sunWar() { const T = STORY.sun && stState('sun'); return !!T && T.ch >= 3 && T.st !== 3; }
function sunDim() { if (mode === 'intro') return false; const T = STORY.sun && stState('sun'); return !!T && T.ch >= 5 && T.st !== 3; }
function sunKey() { const T = STORY.sun && stState('sun'); if (!T) return false; if (MS.on && MS.c && MS.c.story === 'sun' && MS.sf && MS.sf['sun.key'] > 0) return true;   /* taken this very sortie */ return stFlag('sun.key') > 0 && (T.st !== 3 || stFlag('sun.end') === 2); }
/* the yard's own pilots, flying for nothing: whoever is not on the wing already */
function sunPilots(n = 2) { const out = []; PILOTS.slice(0, n).forEach((p, i) => { if (CO.wing && CO.wing.p === p) return; const e = mkMech(P.pos.x - 16 - i * 14, P.pos.z + 8 + i * 6, { ...PRESETS[p.mech], paint: player.cfg.paint }, 0, { name: p.ch.first.toUpperCase(), ai: 'follow', skill: 1.25, hpK: 1.6, yaw: P.yaw }); fieldWho(p.ch, e); stKeep(e, p.ch, i ? 'Anvil. Down to the frame. Sitting the rest out.' : "That's me done, boss. She's all warning lights. Sorry."); out.push(e); }); return out; }
/* Concord peacekeepers: a contract's worth of opposition in white and gold */
const sunFoes = (k, x, z, r0, r1, o) => foes(k, x, z, r0, r1, { paint: SUN_PAINT, name: 'PEACEKEEPER', ...o });
const sunFrom = (k, at, a, r, o) => stFrom(k, at, a, r, { paint: SUN_PAINT, name: 'PEACEKEEPER', ...o });

/* ---- the light. A strike is a ring on the ground that closes for `delay` seconds and then a column of daylight from the top of the sky. It does not know whose side anybody is on:
   own 0 is ours (everything of theirs inside r, and half as much to anything of ours), own 1 is theirs. `hit(p)` is told where it landed ---- */
const SUNB = { geo: new THREE.CylinderGeometry(1, 1, 1, 16, 1, true) };
/* a column, not a ball: whatever is inside r of the axis is hit, at any height (a ship over the spot as much as a tank on it) */
function sunBurn(x, z, r, dmg, own) { for (const e of [...targetsOf(own)]) { if (e.dead) continue; const d = Math.hypot(e.pos.x - x, e.pos.z - z) - (e.r || 0) * .6; if (d < r) damage(e, dmg * (1 - Math.max(0, d) / r * .7), null, own); } }
function sunCol(hex, w, core) { const m = new THREE.Mesh(SUNB.geo, glowM(hex, core ? 8 : 1.6, core ? .9 : .3, core ? 1.2 : 2.4).clone()); m.scale.set(w, 700, w); m.frustumCulled = false; m.renderOrder = 6; FD.scene.add(m); return m; }
function sunDrop(m) { FD.scene.remove(m); m.material.dispose(); }
function skyLance(p, o = {}) {
  const r = o.r || 26, dmg = o.dmg || 900, own = o.own ?? 1, hex = o.hex || 0xffe6b0, x = p.x, z = p.z, y = heightAt(x, z), ring = new THREE.Mesh(GEO.ring, own === 1 ? SM.warn : SM.warn0); let t = o.delay ?? 2.8;
  ring.position.set(x, y + .6, z); ring.scale.setScalar(r); FD.scene.add(ring); FD.misc.push(ring); const pin = sunCol(hex, .35, true); pin.position.set(x, y + 350, z); POST.kick();
  FD.tick.push(dt => {
    t -= dt; ring.scale.setScalar(r * (.25 + .75 * clamp(t / 2.8, 0, 1))); pin.material.uniforms.fade.value = .5 + .5 * Math.sin(t * 30); if (t > 0) return true;
    stGone(ring); sunDrop(pin); const at = V3(x, y + 2, z), d = at.distanceTo(P.pos), core = sunCol(hex, r * .34, true), halo = sunCol(hex, r * .8, false); core.position.set(x, y + 350, z); halo.position.copy(core.position);
    flashAt(V3(x, y + 9, z), hex, 2600, 260, .7); explode(FD.fx, at.clone(), 3.4); for (let i = 0; i < 5; i++) { const a = i * TAU / 5 + rand(.6); explode(FD.fx, V3(x + Math.sin(a) * r * .55, y + 2, z + Math.cos(a) * r * .55), 1.7); } scarAt(V3(x, y, z), r * .9, 1.6);
    sunBurn(x, z, r, dmg, own === 1 ? 1 : 0); sunBurn(x, z, r, dmg * .5, own === 1 ? 0 : 1); for (const e of [...FD.ents]) if (!e.dead && !e.inv && e.kind === 'struct' && e.team !== 2 && Math.hypot(e.pos.x - x, e.pos.z - z) < r) damage(e, dmg * .6, null, own);   /* masonry does not get out of the way */
    if (d < 700) { sfx.play('boom', clamp(2.2 - d / 260, .5, 2.2)); sfx.play('gauss'); P.shake += clamp(1.4 - d / 220, 0, 1.4); } if (o.hit) o.hit(at);
    let k = 0; FD.tick.push(dt2 => { k += dt2 / .9; const f = Math.max(0, 1 - k); core.material.uniforms.fade.value = f; halo.material.uniforms.fade.value = f * f; core.scale.x = core.scale.z = r * .34 * (.4 + .6 * f); if (k < 1) return true; sunDrop(core); sunDrop(halo); return false; });
    return false;
  });
}
/* the mirror held open on one spot: a column that walks over the ground at v metres a second after whatever to() gives, burns everything it is standing on (dps, both sides) and leaves the ground black behind it.
   Returns a handle: { p, v, on } and stop() */
function sunSweep(from, to, o = {}) {
  const r = o.r || 20, hex = o.hex || 0xffe6b0, own = o.own ?? 1, H = { p: V3(from.x, 0, from.z), v: o.v || 8, on: true, dps: o.dps || 85, hold: 0 }, core = sunCol(hex, r * .3, true), halo = sunCol(hex, r * .75, false); let acc = 0, sc = 99, snd = 0, out = 0, warnT = 0;
  H.stop = () => { H.on = false; };
  FD.tick.push(dt => {
    if (!H.on || MS.over) { out += dt / .7; const f = Math.max(0, 1 - out); core.material.uniforms.fade.value = f; halo.material.uniforms.fade.value = f; if (out < 1) return true; sunDrop(core); sunDrop(halo); return false; }
    const g = to(), dx = g.x - H.p.x, dz = g.z - H.p.z, d = Math.hypot(dx, dz), st = (H.hold -= dt) > 0 ? 0 : Math.min(d, H.v * (P.lost && P.lost.legs ? .3 : 1) * dt);   /* a machine with its legs shot off gets the same head start as one without */ if (d > .01) { H.p.x += dx / d * st; H.p.z += dz / d * st; } H.p.y = heightAt(H.p.x, H.p.z); sc += st;
    if (!P.dead && MS.t > warnT && Math.hypot(P.pos.x - H.p.x, P.pos.z - H.p.z) < r + 42) { warnT = MS.t + 9; msg('THE LIGHT IS ALMOST ON YOU — MOVE', 2.4); sfx.play('alarm', .6); }
    const fl = .82 + .18 * Math.sin(MS.t * 41); core.position.set(H.p.x, H.p.y + 350, H.p.z); halo.position.copy(core.position); core.material.uniforms.fade.value = fl; halo.material.uniforms.fade.value = fl * .8;
    flashAt(_v.set(H.p.x, H.p.y + 8, H.p.z), hex, 900, 170, .12); if (Math.random() < dt * 14) { _v.set(H.p.x + rand(-r, r) * .6, H.p.y + 1, H.p.z + rand(-r, r) * .6); puff(FD.fx, _v, 2, 5, .5, .3, 3, 6); }
    if (sc > r * .55) { sc = 0; scarAt(V3(H.p.x, H.p.y, H.p.z), r * .75, 1.3); }
    if ((acc += dt) > .2) { sunBurn(H.p.x, H.p.z, r, H.dps * acc * 1.5, 1); sunBurn(H.p.x, H.p.z, r, H.dps * acc * 1.5, 0); acc = 0; }
    if ((snd -= dt) < 0 && H.p.distanceTo(P.pos) < 260) { snd = .45; sfx.play('plasma', clamp(1.3 - H.p.distanceTo(P.pos) / 220, .2, 1.2)); if (H.p.distanceTo(P.pos) < r * 2.4) P.shake += .12; }
    return true;
  });
  return H;
}
/* the company's own call: B, once a sortie unless a chapter gives more. It lands where the reticle is */
function sunHud() { $('helpB').classList.toggle('hid', !sunKey()); tutKeys(P.lance > 0 && sunKey() ? [['B', `Sky lance — ${P.lance} call${P.lance > 1 ? 's' : ''}`]] : null); }
function sunCall() {
  if (mode !== 'field' || P.dead || !sunKey() || (MS.on && MS.over)) return; if (!(P.lance > 0)) { sfx.play('deny'); return msg('SKY LANCE — NO CALLS LEFT THIS SORTIE', 2.5); }
  const p = P.aim.clone(); if (Math.hypot(p.x - P.pos.x, p.z - P.pos.z) < 34) { sfx.play('deny'); return msg('SKY LANCE — TOO CLOSE. PUT THE RETICLE FURTHER OUT', 2.5); }
  P.lance--; tal('s.lance'); sunHud(); sfx.play('alarm'); msg('SKY LANCE CALLED — STAND CLEAR', 3); skyLance(p, { own: 0, dmg: 950, r: 27, delay: 2.6, hit: at => { if (MS.on && MS.v.onLance) MS.v.onLance(at); } });
}
/* what the war does to an ordinary contract: a Concord lance arrives part-way through, and it is nobody's friend */
TWISTS.concord = async ms => {
  await after(rand(45, 115)); if (ms.over || !sunWar()) return; const [x, z] = groundSpot(P.pos.x, P.pos.z, 150, 190);
  say(STC.thale, 'Concord peacekeepers to all machines in this grid. Every charter here is void, and so is the contract you are flying. Power down and be counted.'); note('Concord peacekeepers interdicted the contract.');
  dropship(x, z, () => { hot1(spawn({ mech: 1 + (ms.c.diff > 3 ? 1 : 0), tank: 1, drone: 2, tier: Math.min(capTier(ms.c), ms.c.diff > 2 ? 2 : 1) }, x, z, 0, 34, 1, { paint: SUN_PAINT, name: 'PEACEKEEPER' })); }, undefined, 1);
};
