/* ============ TACTICAL MAP: M pauses the sortie and shows the theatre from above — terrain, sites, sensor contacts, waypoints ============ */
const MAPV = { open: false, key: '', img: null, cx: 0, cz: 0, zoom: 1.6, drag: null, mx: -1, my: -1, wp: null, hits: [], raf: 0, t: 0 };
let fieldLock = null, fieldUnlock = null;
const sensorRange = () => (140 + player.stats.sensor * 1.6) * (MS.on && MS.v.storm ? .6 : 1);
/* bake the terrain once per theatre: surface colour, hill shading, contour lines, water or lava */
function mapBake() {
  const key = EV.key + '|' + EV.seed + '|' + EV.home + '|' + FD.k; if (MAPV.key === key && MAPV.img) return; MAPV.key = key;
  const N = FD.k > 1 ? 1024 : 640, c = MAPV.img || (MAPV.img = document.createElement('canvas')); c.width = c.height = N; const g = c.getContext('2d'), im = g.createImageData(N, N), d = im.data, ca = FD.ter.geometry.attributes.color.array, W = HN + 1, wl = EV.wl, liq = EV.B.liq, sz = FD.size, px = sz / N;
  const H = new Float32Array(N * N); let lo = 1e9, hi = -1e9; for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const h = H[j * N + i] = heightAt((i + .5) * px - sz / 2, (j + .5) * px - sz / 2); if (h < lo) lo = h; if (h > hi) hi = h; }
  const step = [2, 4, 5, 8, 10, 15, 20].find(s => (hi - lo) / s <= 14) || 25, srgb = v => 255 * (v <= .0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - .055);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, h = H[k], fx = Math.min(HN - .001, (i + .5) / N * HN), fz = Math.min(HN - .001, (j + .5) / N * HN), xi = fx | 0, zi = fz | 0, u = fx - xi, v = fz - zi, a = (zi * W + xi) * 3, b = a + W * 3;
    let r = 0, gg = 0, bb = 0; for (let q = 0; q < 3; q++) { const val = lerp(lerp(ca[a + q], ca[a + 3 + q], u), lerp(ca[b + q], ca[b + 3 + q], u), v); if (q === 0) r = val; else if (q === 1) gg = val; else bb = val; }
    const hx = H[k + (i < N - 1 ? 1 : 0)] - H[k - (i > 0 ? 1 : 0)], hz = H[k + (j < N - 1 ? N : 0)] - H[k - (j > 0 ? N : 0)], sh = clamp(.82 - (hx + hz) / px * .55, .35, 1.35);
    r = srgb(clamp(r * sh, 0, 1)); gg = srgb(clamp(gg * sh, 0, 1)); bb = srgb(clamp(bb * sh, 0, 1));
    if (wl != null && h < wl) { const dp = clamp((wl - h) / 6, 0, 1); if (liq === 'lava') { r = lerp(255, 255, dp); gg = lerp(150, 84, dp); bb = lerp(40, 14, dp); } else if (liq === 'water') { r = lerp(r, 22, .55 + dp * .35); gg = lerp(gg, 66, .55 + dp * .35); bb = lerp(bb, 84, .55 + dp * .35); } }
    else { const c0 = Math.floor(h / step), ct = (i < N - 1 && Math.floor(H[k + 1] / step) !== c0) || (j < N - 1 && Math.floor(H[k + N] / step) !== c0); if (ct) { const m = c0 % 5 === 0 ? .62 : .8; r *= m; gg *= m; bb *= m; } }
    const o = k * 4; d[o] = r * .86; d[o + 1] = gg * .86; d[o + 2] = bb * .86; d[o + 3] = 255;
  }
  g.putImageData(im, 0, 0); MAPV.step = step;
}
function mapOpen() {
  if (mode !== 'field' || MAPV.open || P.dead || P.leaving) return; MAPV.open = true; mapBake(); MAPV.cx = P.pos.x; MAPV.cz = P.pos.z; MAPV.mx = -1;
  $('pause').classList.add('hid'); $('mapUI').classList.remove('hid'); sfx.play('comm'); if (locked && fieldUnlock) fieldUnlock(); mapSide(); mapLoop();
}
/* resume = true goes straight back to the fight; false drops to the pause menu */
function mapClose(resume) {
  if (!MAPV.open) return; MAPV.open = false; cancelAnimationFrame(MAPV.raf); $('mapUI').classList.add('hid'); sfx.play('ui'); if (mode !== 'field' || P.dead || P.leaving) return;
  if (resume && fieldLock) { fieldLock(); setTimeout(() => { if (mode === 'field' && !locked && !MAPV.open && !P.dead && !P.leaving && !uiModal()) $('pause').classList.remove('hid'); }, 350); } else $('pause').classList.remove('hid');
}
/* field key handler asks this first: true means the map took the key */
function mapKey(e) {
  if (e.code === 'KeyM') { if (!e.repeat) MAPV.open ? mapClose(true) : mapOpen(); return true; }
  if (!MAPV.open) return false; if (e.code === 'Escape') mapClose(false); else if (e.code === 'KeyF' || e.code === 'Home') { MAPV.cx = P.pos.x; MAPV.cz = P.pos.z; } return true;
}
function mapWaypoint(x, z) { if (x == null) { MAPV.wp = null; unnav('wp'); return; } const lim = FD.size / 2 - 20; MAPV.wp = V3(clamp(x, -lim, lim), 0, clamp(z, -lim, lim)); MAPV.wp.y = heightAt(MAPV.wp.x, MAPV.wp.z); nav('wp', MAPV.wp, 'WAYPOINT', '#c9a0ff'); }
/* per-frame in the field: retire the waypoint on arrival */
function mapTick() { if (MAPV.wp && !MS.navs.some(n => n.id === 'wp')) MAPV.wp = null; if (MAPV.wp && Math.hypot(P.pos.x - MAPV.wp.x, P.pos.z - MAPV.wp.z) < 16) { mapWaypoint(null); msg('WAYPOINT REACHED', 2); sfx.play('ok'); } }
function mapSide() {
  const c = MS.on ? MS.c : null, rng = sensorRange(), jam = MS.on && MS.jam, vis = e => Math.hypot(e.pos.x - P.pos.x, e.pos.z - P.pos.z) < rng, E = FD.ents, n = (t, f) => E.filter(e => e.team === t && (f || vis(e))).length;
  $('mapOp').textContent = c ? `OP. ${c.op}` : 'PROVING GROUNDS'; $('mapClk').textContent = c ? $('msClock').textContent : 'FREE SKIRMISH'; $('mapSub').textContent = `${EV.B.name} · ${EV.sky}${c ? ' · ' + c.site.toUpperCase() : ''}`;
  $('mapObj').innerHTML = c ? $('objList').innerHTML : '<div class="ob s0">▢ Hold the range against the waves</div>';
  $('mapSen').textContent = jam ? 'JAMMED' : MS.on && MS.v.storm ? 'DEGRADED' : 'NOMINAL'; $('mapSen').style.color = jam ? '#ff5a1f' : MS.on && MS.v.storm ? '#ffb21a' : '';
  $('mapCon').innerHTML = `<div>RANGE <b>${rng.toFixed(0)} m</b></div><div>HOSTILE CONTACTS <b style="color:#ff5a3a">${jam ? '—' : n(1)}</b></div><div>FRIENDLY UNITS <b style="color:#5ac8ff">${n(0, true)}</b></div><div>UNKNOWN / NEUTRAL <b>${jam ? '—' : n(2)}</b></div>`;
  $('mapUnit').textContent = mechName; $('mapSt').innerHTML = `<div>ARMOR <b>${Math.round(clamp(P.armor / P.max, 0, 1) * 100)}%</b></div><div>HEAT <b>${Math.round(clamp(P.heat / 100, 0, 1) * 100)}%</b></div><div>REPAIR KITS · COOLANT <b>${invN('gear.kit')} · ${invN('gear.cool')}</b></div><div>ELEVATION <b>${P.pos.y.toFixed(0)} m</b></div>`;
  $('mapWp').disabled = !MAPV.wp;
}
function mapDraw() {
  const cv = $('mapCv'), dpr = Math.min(devicePixelRatio || 1, 2), W = cv.clientWidth, Hh = cv.clientHeight; if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(Hh * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); }
  const g = cv.getContext('2d'), sz = FD.size, k = Math.min(W - 330, Hh) / sz * MAPV.zoom, ox = (W - 330) / 2 + 10, oy = Hh / 2, X = x => ox + (x - MAPV.cx) * k, Z = z => oy + (z - MAPV.cz) * k, t = MAPV.t, hits = MAPV.hits; hits.length = 0;
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.fillStyle = '#06080a'; g.fillRect(0, 0, W, Hh); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(MAPV.img, X(-sz / 2), Z(-sz / 2), sz * k, sz * k);
  /* grid: 100 m squares (200 m over a story theatre), lettered west to east, numbered north to south */
  const gs = FD.k > 1 ? 200 : 100, gn = Math.round(sz / gs), GL = 'ABCDEFGHJKLMNPQR';
  g.lineWidth = 1; g.font = '9px Menlo,monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let i = 0; i <= gn; i++) { const v = -sz / 2 + i * gs; g.strokeStyle = i % (gn / 2) ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.16)'; g.beginPath(); g.moveTo(X(v), Z(-sz / 2)); g.lineTo(X(v), Z(sz / 2)); g.moveTo(X(-sz / 2), Z(v)); g.lineTo(X(sz / 2), Z(v)); g.stroke(); if (i < gn) { g.fillStyle = 'rgba(255,255,255,.4)'; g.fillText(GL[i], X(v + gs / 2), clamp(Z(-sz / 2) + 9, 62, Hh - 10)); g.fillText(i + 1, clamp(X(-sz / 2) + 9, 10, W - 340), Z(v + gs / 2)); } }
  g.strokeStyle = 'rgba(255,178,26,.5)'; g.strokeRect(X(-sz / 2), Z(-sz / 2), sz * k, sz * k);
  /* trees, then anything solid that is not a live unit */
  g.fillStyle = EV.key === 'glacial' ? 'rgba(40,70,60,.55)' : 'rgba(18,48,22,.5)'; const tr = Math.max(1.2, 2.4 * k); for (const a of FD.tgrid.values()) for (const it of a) { if (it.f > 0) continue; const x = X(it.x), z = Z(it.z); if (x < -4 || z < -4 || x > W || z > Hh) continue; g.fillRect(x - tr / 2, z - tr / 2, tr, tr); }
  const live = new Set(); for (const e of FD.ents) if (e.col) live.add(e.col); for (const w of FD.wrecks) if (w.col) live.add(w.col);
  g.fillStyle = 'rgba(20,22,26,.78)'; g.strokeStyle = 'rgba(225,220,205,.55)'; for (const c of FD.cols) { if (live.has(c)) continue; g.beginPath(); if (c.r != null) { if (c.r < 1.6) continue; g.arc(X(c.x), Z(c.z), Math.max(1.5, c.r * k), 0, TAU); } else g.rect(X(c.x - c.hw), Z(c.z - c.hd), Math.max(2, c.hw * 2 * k), Math.max(2, c.hd * 2 * k)); g.fill(); g.stroke(); }
  g.strokeStyle = 'rgba(160,160,160,.7)'; for (const w of FD.wrecks) { const x = X(w.obj.position.x), z = Z(w.obj.position.z); g.beginPath(); g.moveTo(x - 3, z - 3); g.lineTo(x + 3, z + 3); g.moveTo(x + 3, z - 3); g.lineTo(x - 3, z + 3); g.stroke(); }
  /* named sites */
  g.font = '10px Menlo,monospace'; g.textAlign = 'left';
  for (const [x, z, n] of FD.blips.concat(EV.home ? [[0, 62, 'BASE']] : [])) { const px = X(x), pz = Z(z); g.fillStyle = n === 'BASE' ? '#ffb21a' : 'rgba(225,230,225,.85)'; g.fillRect(px - 3, pz - 3, 6, 6); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(px + 7, pz - 7, g.measureText(n).width + 6, 13); g.fillStyle = n === 'BASE' ? '#ffb21a' : '#e6e1d2'; g.fillText(n, px + 10, pz); hits.push([px, pz, n + ' — site']); }
  if (MS.on && MS.LZ) { const px = X(MS.LZ.x), pz = Z(MS.LZ.z); g.strokeStyle = '#8dff6a'; g.lineWidth = 1.5; g.beginPath(); g.arc(px, pz, 7, 0, TAU); g.moveTo(px - 4, pz - 4); g.lineTo(px - 4, pz + 4); g.moveTo(px - 4, pz); g.lineTo(px + 4, pz); g.moveTo(px + 4, pz - 4); g.lineTo(px + 4, pz + 4); g.stroke(); hits.push([px, pz, 'DROPSHIP — landing zone']); }
  /* sensor envelope */
  const rng = sensorRange(), jam = MS.on && MS.jam, pxp = X(P.pos.x), pzp = Z(P.pos.z); g.lineWidth = 1; g.setLineDash([5, 5]); g.strokeStyle = jam ? 'rgba(255,90,31,.7)' : 'rgba(141,255,106,.7)'; g.beginPath(); g.arc(pxp, pzp, rng * k, 0, TAU); g.stroke(); g.setLineDash([]); g.fillStyle = jam ? 'rgba(255,90,31,.05)' : 'rgba(141,255,106,.05)'; g.fill();
  if (!jam) { const a = (t * .9) % TAU; g.strokeStyle = 'rgba(141,255,106,.28)'; g.beginPath(); g.moveTo(pxp, pzp); g.lineTo(pxp + Math.sin(a) * rng * k, pzp + Math.cos(a) * rng * k); g.stroke(); }
  /* nav markers and the waypoint */
  for (const n of MS.navs) { if (n.pos.dead) continue; const p = n.pos.isVector3 ? n.pos : n.pos.pos, px = X(p.x), pz = Z(p.z), dist = Math.hypot(p.x - P.pos.x, p.z - P.pos.z), s = 7 + Math.sin(t * 4) * 1;
    g.strokeStyle = n.col; g.globalAlpha = .4; g.setLineDash([3, 6]); g.beginPath(); g.moveTo(pxp, pzp); g.lineTo(px, pz); g.stroke(); g.setLineDash([]); g.globalAlpha = 1; g.lineWidth = 2; g.beginPath(); g.moveTo(px, pz - s); g.lineTo(px + s, pz); g.lineTo(px, pz + s); g.lineTo(px - s, pz); g.closePath(); g.stroke(); g.lineWidth = 1;
    const lb = `${n.label} ${dist.toFixed(0)}m`; g.fillStyle = 'rgba(0,0,0,.65)'; g.fillRect(px + 10, pz - 7, g.measureText(lb).width + 6, 13); g.fillStyle = n.col; g.fillText(lb, px + 13, pz); hits.push([px, pz, `${n.label} — ${dist.toFixed(0)} m`]); }
  /* contacts: friendlies always report in; everything else only inside the sensor envelope */
  for (const e of FD.ents) { const dist = Math.hypot(e.pos.x - P.pos.x, e.pos.z - P.pos.z), inR = dist < rng; if (e.team !== 0 && (jam || !inR)) continue; const px = X(e.pos.x), pz = Z(e.pos.z);
    g.fillStyle = e.team === 1 ? '#ff4a2a' : e.rh || (e.team === 0 ? '#5ac8ff' : '#d2d2d2'); g.strokeStyle = 'rgba(0,0,0,.8)'; g.lineWidth = 1; g.beginPath();
    if (e.kind === 'mech') { g.moveTo(px, pz - 7); g.lineTo(px + 6, pz + 5); g.lineTo(px - 6, pz + 5); g.closePath(); } else if (e.kind === 'struct') g.rect(px - 5, pz - 5, 10, 10); else if (e.kind === 'ship') g.ellipse(px, pz, 5, 13, -e.yaw, 0, TAU); else g.arc(px, pz, e.kind === 'drone' ? 3 : 4.5, 0, TAU); g.fill(); g.stroke();
    hits.push([px, pz, `${e.name} — ${e.team === 1 ? 'hostile' : e.team === 0 ? 'friendly' : 'neutral'} · ${Math.round(clamp(e.hp / e.max, 0, 1) * 100)}% · ${dist.toFixed(0)} m`]); }
  if (jam) { g.fillStyle = '#ff5a1f'; g.font = '12px Menlo,monospace'; g.textAlign = 'center'; g.fillText('— SENSORS JAMMED: NO CONTACT DATA —', pxp, pzp - rng * k - 12); g.textAlign = 'left'; g.font = '10px Menlo,monospace'; }
  /* own mech: legs heading, torso arc */
  { const ay = P.yaw + P.twist; g.fillStyle = 'rgba(255,178,26,.16)'; g.beginPath(); g.moveTo(pxp, pzp); g.arc(pxp, pzp, 46, PI / 2 - ay - .5, PI / 2 - ay + .5); g.closePath(); g.fill(); g.strokeStyle = '#ffb21a'; g.lineWidth = 2; g.beginPath(); g.moveTo(pxp, pzp); g.lineTo(pxp + Math.sin(ay) * 26, pzp + Math.cos(ay) * 26); g.stroke();
    g.save(); g.translate(pxp, pzp); g.rotate(-P.yaw); g.fillStyle = '#8dff6a'; g.strokeStyle = '#06080a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 10); g.lineTo(7, -7); g.lineTo(0, -3); g.lineTo(-7, -7); g.closePath(); g.fill(); g.stroke(); g.restore(); hits.push([pxp, pzp, `${mechName} — you`]); }
  /* scale bar and north */
  { const m = [10, 20, 50, 100, 200, 500].find(v => v * k >= 70) || 500, x0 = 18, y0 = Hh - 62; g.strokeStyle = g.fillStyle = '#e6e1d2'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0, y0 - 4); g.lineTo(x0, y0); g.lineTo(x0 + m * k, y0); g.lineTo(x0 + m * k, y0 - 4); g.stroke(); g.fillText(`${m} m · contours ${MAPV.step} m`, x0, y0 - 12);
    const nx = W - 362, ny = 34; g.beginPath(); g.moveTo(nx, ny - 14); g.lineTo(nx + 6, ny + 6); g.lineTo(nx, ny + 2); g.lineTo(nx - 6, ny + 6); g.closePath(); g.fill(); g.textAlign = 'center'; g.fillText('N', nx, ny + 16); g.textAlign = 'left'; }
  /* cursor read-out */
  const tip = $('mapTip'); if (MAPV.mx >= 0 && MAPV.mx < W - 320) { const wx = MAPV.cx + (MAPV.mx - ox) / k, wz = MAPV.cz + (MAPV.my - oy) / k, inb = Math.abs(wx) <= sz / 2 && Math.abs(wz) <= sz / 2; let h = null, bd = 12; for (const q of hits) { const dd = Math.hypot(q[0] - MAPV.mx, q[1] - MAPV.my); if (dd < bd) { bd = dd; h = q[2]; } }
    const dist = Math.hypot(wx - P.pos.x, wz - P.pos.z), brg = ((Math.atan2(wx - P.pos.x, -(wz - P.pos.z)) * 180 / PI) + 360) % 360; tip.classList.toggle('hid', !inb && !h);
    tip.innerHTML = (h ? `<b>${h}</b><br>` : '') + (inb ? `GRID ${GL[clamp(Math.floor((wx + sz / 2) / gs), 0, gn - 1)]}${clamp(Math.floor((wz + sz / 2) / gs), 0, gn - 1) + 1} · ELEV ${heightAt(wx, wz).toFixed(0)} m · ${dist.toFixed(0)} m AT ${String(Math.round(brg) % 360).padStart(3, '0')}°` : ''); } else tip.classList.add('hid');
}
function mapLoop() { if (!MAPV.open) return; MAPV.raf = requestAnimationFrame(mapLoop); MAPV.t += 1 / 60; mapDraw(); if (((MAPV.fr = (MAPV.fr || 0) + 1) % 20) === 0) mapSide(); }
{
  const cv = $('mapCv'), kOf = () => Math.min(cv.clientWidth - 330, cv.clientHeight) / FD.size * MAPV.zoom, lim = () => { const h = FD.size / 2; MAPV.cx = clamp(MAPV.cx, -h, h); MAPV.cz = clamp(MAPV.cz, -h, h); };
  cv.addEventListener('pointerdown', e => { if (e.button === 2) { mapWaypoint(null); sfx.play('ui'); mapSide(); return; } if (e.button) return; MAPV.drag = { x: e.clientX, y: e.clientY, cx: MAPV.cx, cz: MAPV.cz, moved: false }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { MAPV.mx = e.clientX; MAPV.my = e.clientY; const d = MAPV.drag; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) + Math.abs(dy) > 5) d.moved = true; if (d.moved) { const k = kOf(); MAPV.cx = d.cx - dx / k; MAPV.cz = d.cz - dy / k; lim(); } });
  cv.addEventListener('pointerup', e => { const d = MAPV.drag; MAPV.drag = null; if (!d || d.moved) return; const k = kOf(), wx = MAPV.cx + (e.clientX - ((cv.clientWidth - 330) / 2 + 10)) / k, wz = MAPV.cz + (e.clientY - cv.clientHeight / 2) / k; if (Math.abs(wx) > FD.size / 2 || Math.abs(wz) > FD.size / 2) return; mapWaypoint(wx, wz); sfx.play('ok'); mapSide(); });
  cv.addEventListener('pointerleave', () => { MAPV.mx = -1; });
  cv.addEventListener('wheel', e => { e.preventDefault(); const k0 = kOf(), ox = (cv.clientWidth - 330) / 2 + 10, oy = cv.clientHeight / 2, wx = MAPV.cx + (e.clientX - ox) / k0, wz = MAPV.cz + (e.clientY - oy) / k0; MAPV.zoom = clamp(MAPV.zoom * Math.exp(-e.deltaY * .0015), .9, 9); const k1 = kOf(); MAPV.cx = wx - (e.clientX - ox) / k1; MAPV.cz = wz - (e.clientY - oy) / k1; lim(); }, { passive: false });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  $('mapGo').onclick = () => mapClose(true); $('mapEsc').onclick = () => mapClose(false); $('mapCtr').onclick = () => { MAPV.cx = P.pos.x; MAPV.cz = P.pos.z; sfx.play('ui'); }; $('mapWp').onclick = () => { mapWaypoint(null); sfx.play('ui'); mapSide(); };
  $('mapLeg').innerHTML = [['<i style="background:#8dff6a;clip-path:polygon(50% 100%,100% 0,50% 25%,0 0)"></i>', 'Your mech · amber line is the torso'], ['<i style="background:#ff4a2a;clip-path:polygon(50% 0,100% 100%,0 100%)"></i>', 'Hostile mech'], ['<i style="background:#ff4a2a;border-radius:50%"></i>', 'Hostile vehicle, turret or drone'], ['<i style="background:#ff4a2a"></i>', 'Hostile structure'], ['<i style="background:#5ac8ff;border-radius:50%"></i>', 'Friendly'], ['<i style="background:#d2d2d2;border-radius:50%"></i>', 'Neutral'], ['<i style="border:2px solid #ffb21a;transform:rotate(45deg) scale(.75)"></i>', 'Objective marker'], ['<i style="border:2px solid #c9a0ff;transform:rotate(45deg) scale(.75)"></i>', 'Your waypoint'], ['<i style="border:1px dashed #8dff6a;border-radius:50%"></i>', 'Sensor range'], ['<i style="background:#1c1e22;border:1px solid #ddd"></i>', 'Building or rock']].map(([i, l]) => `${i}<span>${l}</span>`).join('');
}
/* how hot the fight is, 0..1, for the mission score: hostiles close and awake, one you have just hit, or armour coming off. Above a half the score crosses to its combat arrangement */
let scoreH = 0, scoreArm = 0, scoreT = 0;
function scoreHeat(dt) {
  let k = 0; if (!P.dead && !MS.over) for (const e of FD.ents) if (e.team === 1 && e.kind !== 'struct' && !e.dead && (e.hitP > 0 || Math.hypot(e.pos.x - P.pos.x, e.pos.z - P.pos.z) < (e.alert ? 380 : 250))) { k = 1; break; }
  if (P.armor < scoreArm - .01) scoreT = 7; scoreArm = P.armor; if (locked) scoreT -= dt; if (scoreT > 0 && !P.dead) k = 1;
  scoreH += (k - scoreH) * Math.min(1, dt * (k ? 1.2 : .22)); return scoreH;
}

