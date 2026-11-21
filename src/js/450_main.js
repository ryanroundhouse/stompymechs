/* ============ MAIN LOOP ============ */
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame); const dt = clamp((now - last) / 1000, 0, .05); last = now; T += dt; updateTweens(dt); music.update(dt, mode, mode === 'bar' ? BAR.camera : HG.camera, mode === 'bar' ? BAR.jukePos : HG.radioPos, mode === 'field' ? scoreHeat(dt) : 0); if (mode === 'field' && locked) mapTick();
  if (mode === 'field' && commHold && (P.dead || MS.over || !MS.on)) commFree();
  if (mode === 'intro') introFrame(dt);
  else if (mode === 'field') { if (commHold) { if (locked) updateComm(dt); } else if (locked || P.dead || MS.over) updateField(dt, T); updateCut(dt); POST.scene = FD.scene; POST.camera = FD.camera; POST.strength = FD.glow; }
  else {
    if (!dlgCur) tickClock(dt);
    if (mode === 'hangar' && HG.walk) { const r = player.root.position; r.z += HG.walk * dt; r.y = MECH_Y - .6 * smooth(clamp((r.z - 9.6) / 4.6, 0, 1)); orb.look.set(0, player.height * .55, -r.z - 3); }
    if (mode === 'bar') { updateBar(dt, T); POST.scene = BAR.scene; POST.camera = BAR.camera; POST.strength = .6; } else if (mode === 'brief') { updateBrief(dt, T); POST.scene = BRF.scene; POST.camera = BRF.camera; POST.strength = .62; } else updateHangar(dt, T);
    if (mode === 'bar' || mode === 'brief') { /* the bay is out of sight from down here */ } else if (mode === 'hq') {
      updateHQ(dt, T); if ((HQ.fr = (HQ.fr || 0) + 1) % 2 === 0) { renderer.setRenderTarget(HQ.rt); renderer.render(HG.scene, HQ.winCam); renderer.setRenderTarget(null); }
      POST.scene = HQ.scene; POST.camera = HQ.camera; POST.strength = .55;
    } else { POST.scene = HG.scene; POST.camera = HG.camera; POST.strength = .5; }
  }
  renderer.toneMappingExposure = mode === 'field' || (mode === 'intro' && POST.scene === FD.scene) ? FD.expo : 1;   /* the field's hour sets the exposure; indoors it is always 1 */
  if (mode !== 'intro') { tutTick(dt); talFrame(dt, mode, mode === 'field' && !locked); talBoards(dt, T); } POST.frame(dt, mode === 'field' && !locked && !P.dead && !MS.over && !CUT.live && !tweens.length);
}
sfx.init();   /* everything it needs exists by now */
requestAnimationFrame(frame);
$('boot').style.opacity = 0; setTimeout(() => $('boot').remove(), 900);
introBoot();   /* the opening, the first time the page is ever opened here */
