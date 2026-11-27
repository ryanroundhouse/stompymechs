/* ============ FIELD: THE KILL CAMERA — SLOW MOTION ON THE KILLS THAT MATTER ============ */
/* Three kills are worth stopping for: a pilot with a name, a capital ship, and the last hostile on the field when the round that did it was the player's own. For two or three seconds the field
   runs slow, the view leaves the machine for an arc round whatever is dying (from beyond it, so that the machine that did it is in the picture), and then comes home.
   · It is a speed ramp, not one slow speed: the blast is seen at a seventh of its pace, and then the field picks up towards three quarters while the wreck goes over. Held at a seventh the
     whole shot was the flash of the explosion, which lasts a third of a second of the field's time, and nothing of the machine it came out of.
   · killEnt asks kcamKill(e, owner) as a thing dies. That is the only way in.
   · The clock is the page's, not the field's: kcamStep(dt) runs first thing in every frame, counts real seconds and hands back the rate the field is to run at. Nothing can leave it standing: the
     end of the count, the player's death, the lift home and a change of room all end it (kcamEnd), and a pause does not stop it counting.
   · updateField steers the chase camera from where it was the frame before and aims along it, so the camera is handed back before every step (kcamHome) and taken again after it (kcamShot).
     The arc turns in real time while the field crawls, which is the point of it.
   · No new line comes up on the comms while it runs (updateComm waits), so a script's word on the kill follows the picture of it instead of freezing it.
   · The mouse does not turn the torso while the view is away from it, and nothing that is shot at the player then is felt (damage() asks kcamSafe()): a pilot who has been made to look
     somewhere else is not hurt for it. That starts with the frame after the kill, so a landing that killed somebody is still paid for in her legs. The keys and the triggers go on working.
   · A Derby car (e.nz) is nobody to stop a race for.
   · CFG.kcam is the switch in SETTINGS · DISPLAY. KCAM.off is the debug page's: the drivers time things, and nobody is watching.
   KCAM_K: [seconds, the rate on the blast, the rate it climbs to, seconds held on the blast] for each kind of kill · in, out: seconds to slow down and to come back up to speed · back: seconds
   of the camera's way home · turn: how far the arc goes round in all, in radians (much more and the player's machine leaves the picture) · gap: seconds before another last kill is worth it ·
   min: kills since the field was last clear before a last kill counts (two machines are not a fight) */
const KCAM = { on: false, off: false, t: 0, dur: 0, slow: .2, fast: .7, hold: .3, rate: 1, e: null, why: '', a: 0, da: 0, d: 30, near: 0, has: false, ran: false, cool: 0, n: 0, at: V3(), p: V3(), q: new THREE.Quaternion(), hp: V3(), hq: new THREE.Quaternion(), mx: new THREE.Matrix4(), up: V3(0, 1, 0) };
const KCAM_K = { last: [1.9, .15, .7, .3], named: [2.7, .14, .7, .4], ship: [3.8, .3, .8, .5], in: .07, out: .35, back: .32, turn: .34, gap: 14, min: 3 };
/* is this one worth it? Called by killEnt before the wreck, the blast or the sound of it, so all three are part of the picture */
function kcamKill(e, owner) {
  if (mode !== 'field' || e.team !== 1 || e.of) return; KCAM.n++;
  const left = FD.ents.some(x => x !== e && !x.dead && x.team === 1 && !x.pacify && !x.of && x.kind !== 'struct'), n = KCAM.n; if (!left) KCAM.n = 0;
  if (!CFG.kcam || KCAM.off || KCAM.on || P.dead || P.leaving || commHold) return;
  const mine = owner === 0 && !!talBy && talBy !== 'ally', why = e.kind === 'ship' ? 'ship' : e.kind === 'mech' && e.named && !e.nz ? 'named' : mine && !left && n >= KCAM_K.min && KCAM.cool <= 0 ? 'last' : ''; if (!why) return;
  const K = KCAM_K[why], p = e.pos, ship = why === 'ship', dx = P.pos.x - p.x, dz = P.pos.z - p.z, D = Math.hypot(dx, dz), home = Math.atan2(dx, dz), side = Math.random() < .5 ? 1 : -1, s = Math.max(e.r || 4, (e.cy || 3) * .9, 3.5);
  Object.assign(KCAM, { on: true, t: 0, dur: K[0], slow: K[1], fast: K[2], hold: K[3], rate: 1, e, why, has: false, ran: false, near: ship ? 0 : clamp(1 - D / 45, 0, 1) });
  /* a ship is seen from abeam, on the side the player is standing; anything else from beyond it, a little to one side, so that the player's machine stands behind what she has just killed */
  if (ship) { KCAM.a = e.yaw + (angDiff(e.yaw, home) < 0 ? -1 : 1) * 1.1; KCAM.da = side * .05; KCAM.d = 96; }
  else { KCAM.a = home + PI + side * .3; KCAM.da = side * KCAM_K.turn / K[0]; KCAM.d = clamp(s * 3.6 + 14, 18, 70) + KCAM.near * 3; }
  $('kcTag').textContent = `◉ ${why === 'last' ? 'LAST CONTACT DOWN · ' : ''}${coTxt(e.name || 'CONTACT').toUpperCase()}${why === 'ship' ? ' · GOING DOWN' : why === 'named' ? ' · DOWN' : ''} · ${D.toFixed(0)} M`;
  document.body.classList.add('kcam'); tal('k.slow'); sfx.play('slowin'); sfx.slow(.5);
}
const kcamSafe = () => KCAM.on && KCAM.t > 0;
/* first thing in a frame, in real seconds: the rate the field runs at this frame (1 when nothing is happening) */
function kcamStep(dt) {
  if (!KCAM.on) { if (KCAM.cool > 0) KCAM.cool -= dt; return 1; }
  if (mode !== 'field' || P.dead || P.leaving || (KCAM.t += dt) >= KCAM.dur) { kcamEnd(); return 1; }
  const t = KCAM.t, body = lerp(KCAM.slow, KCAM.fast, smooth(clamp((t - KCAM.hold) / Math.max(.01, KCAM.dur - KCAM_K.out - KCAM.hold), 0, 1)));
  return KCAM.rate = lerp(1, body, Math.min(smooth(clamp(t / KCAM_K.in, 0, 1)), smooth(clamp((KCAM.dur - t) / KCAM_K.out, 0, 1))));
}
/* before updateField: the camera goes back to where the last step left it */
function kcamHome() { if (!KCAM.on) return; if (KCAM.has) { FD.camera.position.copy(KCAM.hp); FD.camera.quaternion.copy(KCAM.hq); } KCAM.ran = true; }
/* after it (and in a frame the field did not step at all): the shot, and over the last third of a second the way back from it */
function kcamShot() {
  if (!KCAM.on) return; const cam = FD.camera, e = KCAM.e, p = e.pos, q = KCAM.p, at = KCAM.at, ship = KCAM.why === 'ship';
  if (KCAM.ran || !KCAM.has) { KCAM.hp.copy(cam.position); KCAM.hq.copy(cam.quaternion); KCAM.has = true; KCAM.ran = false; }
  const a = KCAM.a + KCAM.da * KCAM.t, d = KCAM.d * (1 - .08 * Math.min(1, KCAM.t / KCAM.dur));
  at.set(p.x, p.y + (ship ? -4 : (e.cy || 2) * .8 + KCAM.near * player.height * .3), p.z); q.set(p.x + Math.sin(a) * d, 0, p.z + Math.cos(a) * d);
  q.y = heightAt(q.x, q.z) + (ship ? 5 : 2.2 + (e.cy || 2) * .35 + KCAM.near * 2);
  /* clear of the ground between the lens and what it is looking at, and of anything it would be standing inside */
  for (let i = 1; i < 6; i++) { const k = i / 6, need = heightAt(lerp(q.x, at.x, k), lerp(q.z, at.z, k)) + 1.5 - lerp(q.y, at.y, k); if (need > 0) q.y += need / (1 - k); }
  for (let i = 0; i < 6 && inSolid(q); i++) q.y += 6;
  KCAM.q.setFromRotationMatrix(KCAM.mx.lookAt(q, at, KCAM.up));
  const k = ease.io(clamp((KCAM.dur - KCAM.t) / KCAM_K.back, 0, 1)); cam.position.lerpVectors(KCAM.hp, q, k); cam.quaternion.slerpQuaternions(KCAM.hq, KCAM.q, k); FD.sky.position.copy(cam.position);
  FD.sun.position.copy(at).addScaledVector(FD.sunDir, 220); FD.sun.target.position.copy(at);   /* the shadows go where the camera has gone, as they do for the comm camera */
  if (player.slot.head) player.slot.head.visible = true;   /* (hidden from inside the cockpit, and this is not inside it) */
}
function kcamEnd() {
  if (!KCAM.on) return; KCAM.on = false; KCAM.rate = 1; KCAM.e = null; KCAM.cool = KCAM_K.gap; document.body.classList.remove('kcam'); sfx.slow(1); sfx.play('slowout');
  if (KCAM.has) { FD.camera.position.copy(KCAM.hp); FD.camera.quaternion.copy(KCAM.hq); FD.sky.position.copy(KCAM.hp); FD.sun.position.copy(P.pos).addScaledVector(FD.sunDir, 220); FD.sun.target.position.copy(P.pos); if (player.slot.head) player.slot.head.visible = P.cam === 0; }
  KCAM.has = false; POST.kick();
}
