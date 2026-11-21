/* ============ MODE TRANSITIONS ============ */
const fade = k => $('fade').style.opacity = k;
function startField() {
  mode = 'field'; HG.alarmOn = false; HG.walk = 0; FD.scene.add(player.root); player.root.rotation.set(0, PI, 0); player.gait.amt = 0;
  Object.assign(P, { yaw: PI, v: 0, vy: 0, twist: 0, pitch: 0, heat: 0, armor: player.stats.armor * 1.5, max: player.stats.armor * 1.5, fuel: 1, shut: 0, air: false, shake: 0, kills: 0, wave: 0, dead: false, waveT: 1, center: false, camInit: false, cam: 0, leaving: false });
  P.cd = { armL: 0, armR: 0, back: 0 }; P.md = [false, false, false]; const c = CO.active; fieldScale(c && c.story ? STK : 1); clearField(); YARD.loot = []; P.carry = false; MS.on = MS.over = false; MS.navs.length = 0;
  if (c) { beginMission(c); sortieGuard(true); } else { if (!EV.home || EV.pads !== HOME_PADS || EV.sky !== skyOf('desert', 0, 'day') || FD.fogK !== 1) buildEnv('desert', 41, { home: true, tod: 'day' });   /* the proving ground is always the yard at noon (or under whatever the campaign has done to the sun), whatever was last flown there */ P.pos.set(0, 0, 22); P.yaw = PI; }
  player.root.rotation.set(0, P.yaw, 0); player.run = RUN; player.gait.sk = 1.15; FD.camera.position.copy(P.pos); music.track(scoreFor(EV.key)); MAPV.wp = null; scoreH = scoreT = 0;
  $('objW').classList.toggle('hid', !!c); $('objM').classList.toggle('hid', !c); $('btnHangar').textContent = c ? 'WITHDRAW — ABANDON CONTRACT' : 'RETURN TO HANGAR'; $('navs').innerHTML = ''; $('tgt').classList.add('hid');
  $('pauseTxt').innerHTML = c ? `<b style="color:#fff">OP. ${c.op} — ${BIOMES[c.biome].name} · ${EV.sky}</b><br>${c.brief}` : 'Proving grounds: free skirmish against endless waves.<br>Mouse aims the torso; the legs steer separately.'; $('pauseTxt').innerHTML += barSortie(!!c);
  PE.cy = player.chestY; PE.r = player.radius * .7 + 1.5; PE.hs = mechHs(player, PE.cy, PE.r); PE.ecm = player.stats.fx === 'ecm'; PE.shF = 0;
  P.lost = {}; P.zones = zonesFor(player, P.max, 1.45); P.sh = P.shMax = player.stats.fx === 'shield' ? P.max * .3 : 0; P.shT = 0; P.burnT = 0; P.burnD = 0; player.gait.sag = 0; player.off = false;
  talSortie(c);
  player.onStep = L => { tal('m.step'); L.ankP.getWorldPosition(_v); puff(FD.fx, _v, 4, 2, .55, .3, 1.2, 2.5); sfx.play('step', .8); P.shake += .06 * player.stats.tons / 60; };
  P.lance = sunKey() ? 1 : 0; buildWepHud(); sunHud(); $('hangarUI').classList.add('hid'); $('fieldUI').classList.remove('hid'); $('pause').classList.remove('hid');
  $('pause').querySelector('h2').firstChild.textContent = 'SORTIE READY '; $('btnResume').textContent = 'ENGAGE'; updateField(.016, T);
}
async function toHangar() {
  if (mode !== 'field' || P.leaving) return; P.leaving = true; mapClose(false); if (document.pointerLockElement) document.exitPointerLock(); locked = false; $('pause').classList.add('hid');
  if (MS.on && !MS.over) { MS.abort = true; endMission(false, 'You withdrew from the contract area.'); }
  await tween(.7, fade); const D = MS.on ? settle() : null; if (!D) saveCO();   /* the proving ground has no books to settle, but what was fired there was fired */ MS.on = false; sortieGuard(false); commReset(); clearField(); mode = 'hangar'; player.run = 1; player.gait.sk = 1; soft = false;
  HG.turn.add(player.root); HG.turn.rotation.y = 0; player.root.position.set(0, MECH_Y, 0); player.root.rotation.set(0, 0, 0); player.twist = player.pitch = 0; player.gait.amt = player.gait.turn = 0; player.setJets(false); if (Object.keys(P.lost || {}).length) { P.lost = {}; player.build(); }   /* the bay puts back whatever was shot off */
  player.gait.sag = 0; if (player.slot.head) player.slot.head.visible = true; player.onStep = null;
  setDoor(0); HG.lift.position.y = .1; orb.cine = false; orb.idle = 0; setGang(1); busy = false;
  $('fieldUI').classList.add('hid'); $('hangarUI').classList.remove('hid'); for (const id of ['panelL', 'panelR', 'hint', 'status']) $(id).classList.remove('hid');
  setStatus('UNIT RECOVERED — REPAIRED AND REARMED'); refreshUI(); renderHangarContract(); if (D) { showHQ(); hq.cPos.set(0, 3.2, 8.6); if (D.ok) music.sting('win'); debrief(D); }
  await tween(.9, k => fade(1 - k));
}
function playerLost() {
  P.dead = true; P.md = [false, false, false]; _v.copy(P.pos); _v.y += player.chestY; explode(FD.fx, _v, 2.6); sfx.play('boom', 1.3); msg('UNIT DESTROYED — RECOVERY TEAM DISPATCHED', 5); P.shake = 1.5;
  tween(1.6, k => { player.root.rotation.x = -1.2 * k; }, ease.in);
  if (MS.on) endMission(false, 'Your mech was destroyed. A recovery team dragged you out of the wreck.'); else setTimeout(toHangar, 4200);
}
async function deploy() {
  if (busy) return; const rd = mechReady(player.cfg, CO.active && CO.active.biome, CO.active);
  if (!rd.ok) { sfx.play('deny'); return setStatus('LAUNCH REFUSED — ' + rd.block.map(w => w.split('. ')[0]).join(' · ')); }
  if (rd.warn.length && !(HG.armT > T)) { HG.armT = T + 8; sfx.play('deny'); setStatus('WARNING — ' + rd.warn.map(w => w.split(' — ')[0]).join(' · ') + ' — PRESS AGAIN TO LAUNCH ANYWAY'); return refreshUI(); }
  HG.armT = 0; busy = true; refreshUI(); for (const id of ['panelL', 'panelR', 'hint']) $(id).classList.add('hid');
  setStatus('DEPLOYMENT AUTHORIZED — CLEAR THE BAY', true); await indexTable(); HG.alarmOn = true; sfx.play('alarm');
  orb.cine = true; orb.pos.set(14, 4.5, 26); orb.look.set(0, player.height * .55, -3);
  sfx.play('servo'); await tween(2.4, k => HG.turn.rotation.y = PI * k);
  sfx.play('door'); await tween(3.2, setDoor);
  tal('y.launch'); player.onStep = L => { tal('m.step'); sfx.play('step', .9); L.ankP.getWorldPosition(_v); puff(HG.fx, _v, 3, 1.6, .6, .25); };
  const sp = Math.max(4.2, player.stats.speed * .85); await tween(.5, k => player.gait.amt = k * sp / player.stats.speed); HG.walk = sp;
  await wait(3.2); await tween(1.5, fade); startField(); await tween(1.2, k => fade(1 - k));
}

