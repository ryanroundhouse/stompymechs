/* ============ FIELD: PLAYER, CAMERA, HUD ============ */
let locked = false, soft = false, T = 0;
const _f = V3(), _r = V3(), camT = V3(), cvs = $('gl');
const G = id => { const e = $(id); return { b: e.querySelector('b'), em: e.querySelector('em') }; }, gA = G('gArm'), gH = G('gHeat'), gJ = G('gJet'), gS = G('gSpd');
const wepOf = k => { const id = player.cfg[k]; return id ? (k === 'back' ? PARTS.back[id] : PARTS.arm[id]).weapon : null; };
let wepRows = [];
const ZD_IDS = [['head', 'zdHead'], ['back', 'zdBack'], ['armL', 'zdArmL'], ['torso', 'zdTorso'], ['armR', 'zdArmR'], ['legs', 'zdLegs']];
function buildWepHud() {
  $('weps').innerHTML = '<h2>FIRE CONTROL <small>GROUPS</small></h2>'; wepRows = [];
  for (const [k, key] of [['armL', 'LMB'], ['armR', 'RMB'], ['back', 'F']]) { const w = wepOf(k); if (!w) continue; const d = document.createElement('div'); d.className = 'wp' + (P.lost && P.lost[k] ? ' wpx' : ''); d.innerHTML = `<span>${key}</span><div><b></b><em>${w.name}</em></div>`; $('weps').appendChild(d); wepRows.push({ k, w, b: d.querySelector('b') }); }
}
function drawRadar() {
  const g = $('radar').getContext('2d'), R = 95, range = (140 + player.stats.sensor * 1.6) * (MS.on && MS.v.storm ? .6 : 1) * (P.lost && P.lost.head ? .4 : 1), ay = P.yaw + P.twist, s = Math.sin(ay), c = Math.cos(ay);
  g.clearRect(0, 0, 190, 190); g.strokeStyle = 'rgba(141,255,106,.22)'; g.lineWidth = 1; for (const r of [31, 62, 93]) { g.beginPath(); g.arc(R, R, r, 0, TAU); g.stroke(); }
  g.beginPath(); g.moveTo(R, R); g.lineTo(R - 60, R - 75); g.moveTo(R, R); g.lineTo(R + 60, R - 75); g.stroke();
  if (MS.on && MS.jam) { for (let i = 0; i < 240; i++) { g.fillStyle = `rgba(141,255,106,${rand(.1, .5)})`; const a = rand(TAU), r = rand(93); g.fillRect(R + Math.cos(a) * r, R + Math.sin(a) * r, 2, 2); } g.fillStyle = '#ff5a1f'; g.font = '10px Menlo,monospace'; g.fillText('JAMMED', R - 20, R + 34); return; }
  const plot = (x, z) => { const dx = x - P.pos.x, dz = z - P.pos.z, k = R / range; return [R + (-dx * c + dz * s) * k, R - (dx * s + dz * c) * k, Math.hypot(dx, dz) < range]; };
  const edge = (px, py) => { const a = Math.atan2(py - R, px - R); return [R + Math.cos(a) * 91, R + Math.sin(a) * 91]; };
  g.font = '8px Menlo,monospace'; for (const [x, z, n] of FD.blips.concat(EV.home ? [[0, 62, 'BASE']] : [])) { const [px, py, ok] = plot(x, z); if (!ok) continue; g.fillStyle = n === 'BASE' ? '#ffb21a' : 'rgba(200,210,200,.6)'; g.fillRect(px - 3, py - 3, 6, 6); g.fillText(n, px + 6, py + 3); }
  if (MS.on) for (const n of MS.navs) { if (n.pos.dead) continue; const p = n.pos.isVector3 ? n.pos : n.pos.pos; let [px, py, ok] = plot(p.x, p.z); if (!ok) [px, py] = edge(px, py); g.strokeStyle = n.col; g.lineWidth = 1.5; g.beginPath(); g.moveTo(px, py - 5); g.lineTo(px + 5, py); g.lineTo(px, py + 5); g.lineTo(px - 5, py); g.closePath(); g.stroke(); }
  for (const e of FD.ents) {
    let [px, py, ok] = plot(e.pos.x, e.pos.z); if (!ok) { if (e.team !== 1) continue; [px, py] = edge(px, py); }
    g.fillStyle = `rgba(${e.team === 1 ? '255,74,42' : e.rc || (e.team === 0 ? '90,200,255' : '210,210,210')},${ok ? 1 : .4})`; g.beginPath();
    if (e.kind === 'mech') { g.moveTo(px, py - 5); g.lineTo(px + 4, py + 4); g.lineTo(px - 4, py + 4); } else if (e.kind === 'struct') g.rect(px - 3, py - 3, 6, 6); else if (e.kind === 'ship') g.ellipse(px, py, 3.5, 8, ay - e.yaw, 0, TAU); else g.arc(px, py, e.kind === 'drone' ? 2 : 3, 0, TAU); g.fill();
  }
  g.strokeStyle = '#ffb21a'; g.lineWidth = 2; g.beginPath(); g.moveTo(R, R); g.lineTo(R + Math.sin(P.twist) * 16, R - Math.cos(P.twist) * 16); g.stroke(); g.fillStyle = '#8dff6a'; g.beginPath(); g.moveTo(R, R - 6); g.lineTo(R + 4, R + 4); g.lineTo(R - 4, R + 4); g.fill();
}
/* the field apart from the player, in two halves either side of the mission script: every unit's turn with the tickers and field tweens, then the weather, the shots in the air and
   whatever is left smoking. updateField runs them round the player; the opening (447_intro.js) runs them with nobody at the controls */
function fieldUnits(dt, t) {
  for (const e of [...FD.ents]) if (!e.dead) entTick(e, dt, t);
  for (let i = FD.tick.length - 1; i >= 0; i--) if (FD.tick[i](dt) === false) FD.tick.splice(i, 1);
  for (let i = ftw.length - 1; i >= 0; i--) { const w = ftw[i]; w.t += dt; const k = Math.min(1, w.t / w.dur); w.fn(w.e(k)); if (k >= 1) { ftw.splice(ftw.indexOf(w), 1); w.res(); } }
}
function fieldFx(dt, t) {
  updateEnvFx(dt, t);
  updateShots(dt); glowTick(dt);
  for (let i = FD.emit.length - 1; i >= 0; i--) {
    const e = FD.emit[i]; if (e.life !== undefined && (e.life -= dt) <= 0) { FD.emit.splice(i, 1); continue; } if (Math.random() > dt * 14) continue;
    if (e.kind === 'flare') FD.fx.spark.emit(e.p.x + rand(-.5, .5), e.p.y, e.p.z + rand(-.5, .5), rand(-1, 1), rand(5, 10), rand(-1, 1), rand(.4, .9), rand(4, 7), 5, 2.2, .5, .8, -3, .5, -.5);
    else FD.fx.smoke.emit(e.p.x, e.p.y, e.p.z, rand(1, 3), rand(2, 5), rand(-1, 1), rand(3, 6), rand(3, 5), .12, .11, .1, .5, -.2, .2, 3);
  }
}
function updateField(dt, t) {
  const st = player.stats, K = keys, ctl = !P.dead && P.shut <= 0;
  let trn = ctl ? (K.KeyA ? 1 : 0) - (K.KeyD ? 1 : 0) : 0; if (trn) P.center = false;
  if (P.center && ctl) { if (Math.abs(P.twist) < .04) P.center = false; else trn = clamp(P.twist * 4, -1, 1); }
  const thr = ctl ? (K.KeyW ? 1 : 0) - (K.KeyS ? .6 : 0) : 0, sprint = thr > 0 && (K.ShiftLeft || K.ShiftRight) && !P.lost.legs;
  const dyaw = trn * st.turn * dt * (P.air ? .4 : 1); P.yaw += dyaw; P.twist -= dyaw; P.twist = st.twist < 3 ? clamp(P.twist, -st.twist, st.twist) : angDiff(0, P.twist);
  const wade = !P.air && EV.B.liq === 'water' && P.pos.y < EV.wl - 2.5, top = st.speed * RUN * (P.carry ? .88 : 1) * (wade ? .7 : 1) * (P.lost.legs ? .3 : 1);
  P.v = damp(P.v, thr * top * (sprint ? 1.45 : 1), P.air ? .25 : 1.7, dt); if (sprint) P.heat += SPRINT_K.heat * (st.fx === 'boost' ? .67 : 1) * dt;
  const step = P.v * dt, nx = P.pos.x + Math.sin(P.yaw) * step, nz = P.pos.z + Math.cos(P.yaw) * step;
  if (!P.air && heightAt(nx, nz) - heightAt(P.pos.x, P.pos.z) > Math.abs(step) * 1.2 + .02) P.v *= .6; else { P.pos.x = nx; P.pos.z = nz; }
  collide(P.pos, player.radius * .65);
  const ground = floorAt(P.pos); let jet = false; if (!P.air && P.pos.y - ground > 2.5) P.air = true;
  talField(dt, sprint, ctl && K.Space && st.jets && P.fuel > 0, dyaw, ground, wade);
  if (ctl && K.Space && st.jets && P.fuel > 0) {
    jet = true; P.vy = Math.min(P.vy + 46 * dt, 14); P.fuel -= dt * .4; P.air = true; P.heat += 5 * dt; P.stepT -= dt; if (P.stepT < 0) { sfx.play('jet'); P.stepT = .16; }
    for (const f of player.slot.back.userData.flames) { f.getWorldPosition(_v); FD.fx.spark.emit(_v.x, _v.y, _v.z, rand(-1, 1), rand(-14, -8), rand(-1, 1), rand(.15, .35), rand(.7, 1.3), 1.2, 2.6, 5, .7, 0, 1); }
  } else P.fuel = Math.min(1, P.fuel + dt * (P.air ? .04 : .2));
  if (P.air) { P.vy -= FD.grav * dt; P.pos.y += P.vy * dt; if (P.pos.y <= ground) { const imp = -P.vy; P.pos.y = ground; P.air = false; P.vy = 0; if (imp > 5) { tal('m.land'); sfx.play('step', 1.6); P.shake += imp * .05; puff(FD.fx, P.pos, 16, 4, .55, .4, 2, 7); stompLand(imp); } } }
  else P.pos.y = damp(P.pos.y, ground, 14, dt);
  stompTick(dt);
  /* heat + shutdown */
  P.heat = Math.max(0, P.heat - st.cool * FD.coolK * (P.coolK || 1) * dt * (P.shut > 0 ? 2 : sprint ? SPRINT_K.shed : 1));
  if (P.buzz && !P.dead) { P.twist += (Math.sin(t * .83) + Math.sin(t * 1.37 + 1)) * .055 * P.buzz * dt; P.pitch = clamp(P.pitch + Math.sin(t * 1.1 + 2) * .04 * P.buzz * dt, -.38, .5); }
  if (EV.wl != null && !P.air && !P.dead && P.pos.y < EV.wl - .6) { if (EV.B.liq === 'lava') { P.heat += 26 * dt; P.armor -= 5 * dt; tal('m.lava', dt); tal('d.lava', 5 * dt); tal('h.lava', 26 * dt); if (Math.random() < .3) { _v.copy(P.pos); _v.y = EV.wl; sparks(FD.fx, _v, 2, 5, 5, 1.6, .3); } if (P.armor <= 0) playerLost(); } else P.heat = Math.max(0, P.heat - 9 * dt); }
  if (P.shMax && (P.shT -= dt) < 0 && P.sh < P.shMax) P.sh = Math.min(P.shMax, P.sh + P.shMax * .2 * dt);
  if (P.burnT > 0 && !P.dead) { P.burnT -= dt; P.heat += P.burnD * 2 * dt; P.armor -= P.burnD * .24 * dt; tal('h.fire', P.burnD * 2 * dt); tal('d.burn', P.burnD * .24 * dt); if (Math.random() < dt * 12) { _v.copy(P.pos); _v.y += player.chestY * rand(.4, 1.1); FD.fx.spark.emit(_v.x + rand(-2, 2), _v.y, _v.z + rand(-2, 2), rand(-1, 1), rand(3, 7), rand(-1, 1), rand(.4, .8), rand(1.2, 2.2), 5, 2, .4, .8, -2, .6, 1.5); } if (P.armor <= 0) playerLost(); }
  player.gait.sag = damp(player.gait.sag, P.lost.legs ? 1 : 0, 2.5, dt);
  if (P.heat > HEAT_WARN && P.heat < 100 && !P.hw && P.shut <= 0 && !P.dead) { P.hw = true; tal('h.warn'); msg('HEAT CRITICAL — EASE OFF', 2.5); sfx.play('deny'); } if (P.heat < HEAT_WARN - 25) P.hw = false;
  if (P.heat >= 100 && P.shut <= 0 && !P.dead) { P.shut = 3.5; tal('h.shut'); msg('REACTOR SHUTDOWN — VENTING HEAT', 3.4); sfx.play('deny'); sfx.play('steam'); }
  if (P.shut > 0) { P.shut -= dt; if (Math.random() < .5) { _v.copy(P.pos); _v.y += player.chestY; puff(FD.fx, _v, 1, 2.5, .85, .3, 4, 2); } }
  /* drive the mech */
  const R = player.root; R.position.copy(P.pos); if (!P.dead) R.rotation.set(0, P.yaw, 0); player.twist = P.twist; player.pitch = P.shut > 0 ? -.3 : P.pitch;
  player.gait.amt = P.air ? 0 : P.v / (st.speed * RUN); player.gait.turn = P.air ? 0 : trn; player.setJets(jet); player.update(dt);
  if (st.tons && PARTS.legs[player.cfg.legs].tracked && Math.abs(P.v) > 1 && Math.random() < .4) { _v.copy(P.pos); _v.x += rand(-3, 3); _v.z += rand(-3, 3); puff(FD.fx, _v, 1, 2, .55, .25, 1, 1.5); }
  FD.sun.position.copy(P.pos).addScaledVector(FD.sunDir, 220); FD.sun.target.position.copy(P.pos);
  /* camera */
  const cam = FD.camera, ay = P.yaw + P.twist, cp = Math.cos(P.pitch), h = player.height;
  _f.set(Math.sin(ay) * cp, Math.sin(P.pitch), Math.cos(ay) * cp); _r.set(-Math.cos(ay), 0, Math.sin(ay)); let back = 0;
  if (P.cam === 0) { back = h * 1.9 + 7; camT.copy(P.pos).addScaledVector(_f, -back).addScaledVector(_r, h * .42); camT.y += h * .92 + 2; collide(camT, 2); camT.y = Math.max(camT.y, heightAt(camT.x, camT.z) + 1.5); cam.position.lerp(camT, P.camInit ? 1 - Math.exp(-12 * dt) : 1); }
  else { player.slot.torso.userData.head.getWorldPosition(camT); camT.y += .55; camT.addScaledVector(_f, 1); cam.position.copy(camT); }
  P.camInit = true; player.slot.head.visible = P.cam === 0; $('cock').style.opacity = P.cam ? 1 : 0;
  P.shake = Math.max(0, P.shake - dt * 2.2); if (P.shake > 0) cam.position.add(_v.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).multiplyScalar(P.shake * .35));
  cam.lookAt(_v.copy(cam.position).add(_f)); FD.sky.position.copy(cam.position);
  /* aim: what the reticle is over */
  _v.copy(cam.position).addScaledVector(_f, back + h * .5); const hit = rayHit(_v.clone(), _f, 700, 0); P.aim.copy(_v).addScaledVector(_f, Math.max(hit.t, 12)); $('ret').classList.toggle('hot', !!hit.ent && hit.ent.team === 1);
  if (FD.lamp.intensity) { FD.lamp.position.copy(P.pos).addScaledVector(_f, player.radius + 3); FD.lamp.position.y += h * .8; FD.lamp.target.position.copy(P.aim); }
  /* weapons */
  for (const [k, on] of [['armL', P.md[0]], ['armR', P.md[2]], ['back', K.KeyF]]) {
    P.cd[k] = Math.max(0, P.cd[k] - dt); const w = wepOf(k); if (!w || !on || !ctl || !locked || P.cd[k] > 0 || P.lost[k]) continue;
    fire(player, k, w, P.aim, 0, (hit.ent && hit.ent.team === 1 ? hit.ent : null) || nearestToAim()); P.cd[k] = w.cd; P.heat += w.heat; P.shake += w.cd < .2 ? (w.type === 'bullet' ? .03 : .012) : w.type === 'melee' ? .05 : .12;
  }
  retarget(); fieldUnits(dt, t);
  updateMission(dt); fieldFx(dt, t);
  if (!MS.on && !P.dead && !FD.ents.some(e => e.team === 1)) { P.waveT += dt; if (P.waveT > 4) { P.waveT = 0; if (P.wave) { P.armor = Math.min(P.max, P.armor + P.max * .3); tal('pg.w'); } spawnWave(P.wave + 1); talMax('pg.best', P.wave); } }
  if (FD.beacon) M.redGlow.emissiveIntensity = Math.sin(t * 4) > .6 ? 6 : 1.5;
  FD.fx.spark.update(dt); FD.fx.smoke.update(dt);
  /* HUD */
  const pct = v => clamp(v, 0, 1) * 100 + '%';
  gA.b.style.width = pct(P.armor / P.max); gA.em.textContent = Math.max(0, P.armor).toFixed(0) + (P.shMax ? ' +' + P.sh.toFixed(0) : '');
  if ((P.zdT = (P.zdT || 0) - dt) < 0) { P.zdT = .2; for (const [k, id] of ZD_IDS) { const el = $(id), s = k === 'torso' ? { hp: P.armor, max: P.max } : P.zones[k], c = !s ? 'zq4' : s.hp <= 0 ? 'zq3' : s.hp < s.max * .34 ? 'zq2' : s.hp < s.max * .67 ? 'zq1' : ''; if (el.className !== c) el.className = c; } } gH.b.style.width = pct(P.heat / 100); gH.em.textContent = P.shut > 0 ? 'SHUT' : P.heat.toFixed(0) + '%';
  gJ.b.style.width = st.jets ? pct(P.fuel) : '0%'; gJ.em.textContent = st.jets ? (P.fuel * 100).toFixed(0) + '%' : 'N/A'; gS.b.style.width = pct(Math.abs(P.v) / (st.speed * RUN * 1.45)); gS.em.textContent = (Math.abs(P.v) * 3.6).toFixed(0) + ' kph';
  for (const r of wepRows) r.b.style.width = pct(1 - P.cd[r.k] / r.w.cd);
  $('twI').style.left = 50 + clamp(P.twist / Math.min(st.twist, PI), -1, 1) * 50 + '%'; $('hdg').textContent = String(Math.round(((-ay * 180 / PI) % 360 + 360) % 360)).padStart(3, '0');
  if (!MS.on) { $('hCnt').textContent = FD.ents.length; $('kCnt').textContent = P.kills; $('wCnt').textContent = P.wave; }
  updateNavs(); const he = hit.ent; $('tgt').classList.toggle('hid', !he); if (he) { $('tgt').className = 't' + he.team; $('tgtN').textContent = he.name; $('tgtB').style.width = pct(he.hp / he.max); const zk = hit.zone, zs = zk && he.zones && he.team === 1 && !he.nz ? he.zones[zk] : null;
    $('tgtZ').textContent = zs ? ZONE_N[zk] + (zs.hp <= 0 ? ' — DESTROYED' : '') : ''; $('tgtZi').style.display = zs && zs.hp > 0 ? '' : 'none'; if (zs) $('tgtZb').style.width = pct(zs.hp / zs.max); }
  $('dmg').style.opacity = Math.max(0, $('dmg').style.opacity - dt * 2.5); if (msgT > 0 && (msgT -= dt) <= 0) $('msg').style.opacity = 0;
  if ((P.radT = (P.radT || 0) - dt) < 0) { P.radT = .06; drawRadar(); }
}
function nearestToAim() { let best = null, bd = .25; for (const e of FD.ents) { if (e.team !== 1) continue; _c.copy(e.pos); _c.y += e.cy; _c.sub(FD.camera.position); const d = _c.length(); if (d > 500) continue; const a = Math.acos(clamp(_c.dot(_f) / d, -1, 1)); if (a < bd) { bd = a; best = e; } } return best; }

