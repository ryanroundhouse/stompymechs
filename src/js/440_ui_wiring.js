/* ============ UI WIRING ============ */
const STATS = [['TONNAGE', s => s.tons, 110, v => v.toFixed(0) + ' t'], ['ARMOR', s => s.armor, 600, v => v], ['SPEED', s => s.speed * 3.6 * RUN, 112, v => v.toFixed(0) + ' kph'], ['FIREPOWER', s => s.fire, 140, v => v.toFixed(0) + ' dps'], ['COOLING', s => s.cool, 16, v => v.toFixed(1)], ['SENSORS', s => s.sensor, 200, v => v.toFixed(0)]];
{
  const slotEl = {}, statEl = [];
  /* three bays: click one to bring its machine to the stand */
  const bayEl = [0, 1, 2].map(i => { const b = document.createElement('button'); b.className = 'bay'; b.onclick = () => { sfx.play('ui'); switchBay(i); }; $('bays').appendChild(b); return b; });
  for (const s of SLOTS) {
    const d = document.createElement('div'); d.className = 'slot'; d.innerHTML = `<label>${SLOT_LABEL[s]}</label><button class="si"></button><div class="sn"></div><button class="sx" title="Remove to stores">✕</button>`; $('slots').appendChild(d); slotEl[s] = d;
    const open = () => { if (busy || d.classList.contains('lock')) return sfx.play('deny'); sfx.play('ui'); storesOpen({ mode: 'fit', slot: s }); }; d.querySelector('.si').onclick = open; d.querySelector('.sn').onclick = open; d.querySelector('.sx').onclick = () => { sfx.play('ui'); fitPart(s, null); };
  }
  { const d = document.createElement('div'); d.className = 'slot sk'; d.innerHTML = `<label>HEAT SINKS</label><button class="si">${iconSvg('gear.sink', 26)}</button><div class="sn" id="sinkN"></div><span><button id="sinkDn">−</button><button id="sinkUp">+</button></span>`; $('slots').appendChild(d); $('sinkDn').onclick = () => fitSinks(-1); $('sinkUp').onclick = () => fitSinks(1); d.querySelector('.si').onclick = () => fitSinks(1); }
  PAINTS.forEach((p, i) => { const b = document.createElement('button'); b.style.background = `linear-gradient(135deg,#${p.pri.toString(16).padStart(6, '0')} 60%,#${p.acc.toString(16).padStart(6, '0')} 60%)`; b.title = p.n; b.onclick = () => { sfx.play('ui'); if (!busy && i !== player.cfg.paint) tal('y.paint'); paintMech(i); saveCO(); }; $('paints').appendChild(b); });
  for (const [n] of STATS) { const d = document.createElement('div'); d.className = 'st'; d.innerHTML = `<span>${n}</span><i><b></b></i><em></em>`; $('stats').appendChild(d); statEl.push(d); }
  $('mechName').onclick = () => {
    const c = player.cfg; if (busy || !bayParts(c) || $('mechName').firstChild.tagName === 'INPUT') return; const i = document.createElement('input'); i.value = c.name; i.maxLength = 14; $('mechName').textContent = ''; $('mechName').appendChild(i); i.focus(); i.select();
    let fin = false; const done = ok => { if (fin) return; fin = true; if (ok) { const was = c.name; c.name = cleanName(i.value, c.name, 14); if (c.name !== was) tal('y.name'); mechName = bayTitle(); yardChanged(); } i.remove(); refreshUI(); }; i.onkeydown = e => { e.stopPropagation(); if (e.code === 'Enter') done(true); if (e.code === 'Escape') done(false); }; i.onblur = () => done(true);
  };
  refreshUI = () => {
    const cfg = player.cfg, c = CO.active, rd = mechReady(cfg, c && c.biome, c), st = rd.st, any = bayParts(cfg) > 0;
    bayEl.forEach((b, i) => { const q = YARD.bays[i], n = bayParts(q), r = n ? mechReady(q, c && c.biome, c) : null; b.classList.toggle('on', i === YARD.act); b.innerHTML = `<u>${i + 1}</u><span>${n ? q.name : 'EMPTY BAY'}<small>${!n ? 'build from stores' : r.ok ? `${r.st.cls} · ${r.st.tons.toFixed(0)} t` : 'incomplete'}</small></span><i class="${!n ? 'e' : !r.ok ? 'b' : r.warn.length ? 'w' : 'g'}">${!n ? '—' : !r.ok ? 'NOT READY' : r.warn.length ? 'CAUTION' : 'READY'}</i>`; });
    for (const s of SLOTS) {
      const id = cfg[s], p = id && PARTS[CAT[s]][id], d = slotEl[s], lock = !cfg.torso && s !== 'legs' && s !== 'torso', n = Object.keys(YARD.inv).filter(k => k.startsWith(CAT[s] + '.')).reduce((a, k) => a + YARD.inv[k], 0);
      d.classList.toggle('empty', !p); d.classList.toggle('lock', lock); d.querySelector('.si').innerHTML = iconSvg(p ? CAT[s] + '.' + id : 'none', 26, p ? null : '#6f695d');
      d.querySelector('.sn').innerHTML = p ? `${p.name}<small>${p.desc}</small>` : `<i>${lock ? 'NEEDS A TORSO' : 'EMPTY'}</i><small>${lock ? 'fit a torso first' : n ? `${n} in stores — click to fit` : 'nothing in stores'}</small>`; d.querySelector('.sx').style.visibility = p ? '' : 'hidden';
    }
    $('sinkN').innerHTML = cfg.torso ? `${st.sinks} / ${st.slots} FITTED<small>${invN('gear.sink')} in stores · +${SINK_COOL} cooling each</small>` : '<i>NEEDS A TORSO</i><small>sinks mount in the torso</small>'; $('sinkDn').disabled = busy || !st.sinks; $('sinkUp').disabled = busy || !cfg.torso || st.sinks >= st.slots || !invN('gear.sink');
    $('paints').querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === cfg.paint)); $('paintName').textContent = PAINTS[cfg.paint].n;
    STATS.forEach(([n, f, mx, fmt], i) => { const v = f(st); statEl[i].querySelector('b').style.width = clamp(v / mx, 0, 1) * 100 + '%'; statEl[i].querySelector('em').textContent = fmt(v); });
    if (!$('mechName').querySelector('input')) $('mechName').textContent = bayTitle(); $('mechName').title = any ? 'Click to rename' : '';
    $('mechClass').textContent = any ? `BAY ${YARD.act + 1} · ${st.cls}${st.cls === 'INCOMPLETE' ? '' : ' CLASS'} · ${st.tons.toFixed(0)} TONS` : `BAY ${YARD.act + 1} · NOTHING ON THE STAND`;
    $('ovw').textContent = !rd.ok ? 'NOT READY' : st.over ? 'OVERWEIGHT' : 'WITHIN LIMITS'; $('ovw').style.color = !rd.ok || st.over ? '#ff5a1f' : '';
    const wn = k => { const w = cfg[k] && (k === 'back' ? PARTS.back[cfg.back] : PARTS.arm[cfg[k]].weapon); return w ? w.name : '<s>EMPTY</s>'; }, hot = st.heat > st.cool;
    $('loadout').innerHTML = `<div>L-ARM <b>${wn('armL')}</b></div><div>R-ARM <b>${wn('armR')}</b></div><div>BACK <b>${wn('back')}</b></div><div>TORSO TWIST <b>${!cfg.legs ? '—' : st.twist > 3 ? '360°' : '±' + Math.round(st.twist * 180 / PI) + '°'}</b></div>`
      + `<div>HEAT · FIRING / SHED <b style="color:${rd.secs < HOT_SECS ? '#ff5a1f' : ''}">${st.heat.toFixed(1)} / ${st.cool.toFixed(1)} per s</b></div><div>SUSTAINED FIRE <b style="color:${rd.secs < HOT_SECS ? '#ff5a1f' : ''}">${!st.weapons ? '—' : hot ? rd.secs.toFixed(1) + ' s to shutdown' : 'INDEFINITE'}</b></div><div>SPRINT FROM COLD <b>${!cfg.legs || !cfg.torso ? '—' : sprintFor(st).toFixed(0) + ' s to shutdown'}</b></div>`;
    $('warns').innerHTML = rd.block.map(s => `<div class="b">${iconSvg('warn', 13, '#ff5a1f')}${s}</div>`).join('') + rd.warn.map(s => `<div class="w">${iconSvg('warn', 13, '#ffb21a')}${s}</div>`).join('') + (rd.ok && !rd.warn.length ? '<div class="g">ALL SYSTEMS FITTED — CLEARED TO LAUNCH</div>' : '');
    document.querySelectorAll('#panelL button,#btnTest,#btnDeploy,#btnHQ,#btnStores').forEach(b => { if (b.id !== 'sinkDn' && b.id !== 'sinkUp') b.disabled = busy; });
    $('btnTest').disabled = busy || !rd.ok; deployLabel(rd);
  };
  $('btnStores').onclick = () => { sfx.play('ui'); storesOpen({ mode: 'inv' }); }; $('btnSet').onclick = () => { sfx.play('ui'); settingsOpen(); };
  $('btnSpin').onclick = e => { spin = !spin; e.target.classList.toggle('on', spin); sfx.play('ui'); };
  $('btnTest').onclick = () => { sfx.play('ui'); if (!busy) tal('y.test'); systemsTest().then(() => refreshUI()); refreshUI(); };
  $('btnDeploy').onclick = deploy;
  /* pointer lock, with a free-mouse fallback if the browser refuses it twice (e.g. sandboxed frames) */
  let lockFail = 0, failT = 0;
  const lockFailed = () => { const n = performance.now(); if (n - failT < 400) return; failT = n; if (++lockFail >= 2) { soft = true; setLock(true); } else $('pauseTxt').innerHTML = 'Pointer lock was refused by the browser.<br>Click once more — a second refusal switches to free-mouse aiming.'; };
  const lock = () => { soft = false; if (!cvs.requestPointerLock) { soft = true; return setLock(true); } try { const p = cvs.requestPointerLock(); if (p && p.catch) p.catch(lockFailed); } catch (e) { lockFailed(); } };
  const setLock = v => { locked = v; if (mode === 'field') { $('pause').classList.toggle('hid', v || P.dead || P.leaving || MAPV.open); if (!v) { P.md = [false, false, false]; $('pause').querySelector('h2').firstChild.textContent = 'SORTIE PAUSED '; $('btnResume').textContent = 'RESUME'; } } };
  $('btnResume').onclick = lock; $('btnHangar').onclick = toHangar; $('btnMap').onclick = mapOpen; $('btnPSet').onclick = () => { sfx.play('ui'); settingsOpen(); };
  fieldLock = lock; fieldUnlock = () => { if (soft) { soft = false; setLock(false); } else if (document.pointerLockElement) document.exitPointerLock(); else setLock(false); };
  document.addEventListener('pointerlockchange', () => { const on = document.pointerLockElement === cvs; if (on) lockFail = 0; if (!soft) setLock(on); });
  document.addEventListener('pointerlockerror', lockFailed);
  addEventListener('mousemove', e => { if (mode !== 'field' || !locked || P.dead || KCAM.on) return; if (commHold) return commMouse(e); P.twist -= e.movementX * .0022 * CFG.sens; P.pitch = clamp(P.pitch - e.movementY * .0018 * CFG.sens * (CFG.invY ? -1 : 1), -.38, .5); });
  addEventListener('mousedown', e => { if (mode === 'field' && locked) { if (commHold) return commClick(e); P.md[e.button] = true; e.preventDefault(); } });
  addEventListener('wheel', e => { if (mode === 'field' && locked && commHold && !uiModal()) commMove(Math.sign(e.deltaY)); }, { passive: true });
  addEventListener('mouseup', e => { P.md[e.button] = false; });
  addEventListener('keydown', e => {
    if (uiModal()) return; if (mode === 'field' && commHold && locked && e.code !== 'Escape') { e.preventDefault(); return commHoldKey(e); }
    if (mode === 'field' && mapKey(e)) return; keys[e.code] = true; if (mode !== 'field') return; if (e.code === 'Space' || e.code === 'Tab') e.preventDefault();
    if (e.code.startsWith('Digit')) commKey(+e.code[5] - 1);
    if (e.code === 'KeyR' && locked && CO.kit > 0 && !P.dead && (P.armor < P.max * .98 || Object.keys(P.lost).length)) { CO.kit--; tal('s.kit'); tal('d.kit', Math.min(P.max, P.armor + P.max * .4) - P.armor); P.armor = Math.min(P.max, P.armor + P.max * .4); const n = zoneMend(); msg(`REPAIR KIT USED${n ? ` — ${n} COMPONENT${n > 1 ? 'S' : ''} BACK ON LINE` : ''} — ${CO.kit} LEFT`, 2.5); sfx.play('ok'); }
    if (e.code === 'KeyB' && locked && !e.repeat) sunCall();
    if (e.code === 'KeyV' && locked && !P.dead && invN('gear.cool') > 0 && P.heat > 20) { invAdd('gear.cool', -1); tal('h.flush'); P.heat = Math.max(0, P.heat - 60); msg(`COOLANT FLUSH — ${invN('gear.cool')} LEFT`, 2.5); sfx.play('steam'); }
    if (e.code === 'KeyC') { P.cam = 1 - P.cam; tal('s.cam'); } if (e.code === 'KeyX') P.center = true; if (e.code === 'KeyH') withdrawKey(); if (e.code === 'Escape' && soft) { soft = false; setLock(false); }
  });
  addEventListener('keyup', e => keys[e.code] = false); addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  const resize = () => { const w = innerWidth, h = innerHeight; renderer.setSize(w, h); POST.size(w, h); for (const c of [HG.camera, FD.camera, HQ.camera, BAR.camera, BRF.camera]) { c.aspect = w / h; c.updateProjectionMatrix(); } const u = renderer.domElement.height * .95; for (const f of [HG.fx, FD.fx]) f.spark.mat.uniforms.uS.value = f.smoke.mat.uniforms.uS.value = u; FD.fx.wx.mat.uniforms.uS.value = u; };
  addEventListener('resize', resize); resize(); refreshUI(); gfxApply(); brandSync(); if (BOOT && BOOT.v !== 2) saveCO(); if (!YARD.founded) foundOpen();
}

