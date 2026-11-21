/* ============ MISSIONS: ENGINE (people, comms, objectives, nav markers, script helpers) ============ */
const RUN = 2;                                    // field speed multiplier for the player's mech
const MS = { on: false, k: 0, t: 0, wait: [], navs: [], obj: [], log: [], over: false, v: {}, who: {}, evt: null };
const NAMES = {
  f: ['Ilsa', 'Mira', 'Tobias', 'Juno', 'Bastien', 'Anya', 'Kofi', 'Soren', 'Yara', 'Dmitri', 'Lena', 'Hugo', 'Nadia', 'Cass', 'Omar', 'Vera', 'Jonas', 'Priya', 'Ezra', 'Malia', 'Viktor', 'Sabine', 'Idris', 'Greta', 'Teodor', 'Amara'],
  l: ['Varga', 'Sato', 'Okonkwo', 'Quill', 'Albrecht', 'Moreau', 'Kessler', 'Adeyemi', 'Lindqvist', 'Haddad', 'Volkov', 'Brandt', 'Castellan', 'Oyelaran', 'Reyes', 'Thorne', 'Nakamura', 'Drescher', 'Banerjee', 'Calloway', 'Mbeki', 'Strand', 'Petrakis', 'Hale'],
  call: ['Vulture', 'Anvil', 'Lockjaw', 'Mirage', 'Old Iron', 'Saint', 'Wraith', 'Kingfisher', 'Hex', 'Bulldog', 'Cinder', 'Marrow'],
};
const mkChar = (seed, role, col = '#ffb21a', rank = '') => { const R = mulberry(seed * 13 + 5), f = NAMES.f[(R() * NAMES.f.length) | 0], l = NAMES.l[(R() * NAMES.l.length) | 0]; return { name: (rank ? rank + ' ' : '') + f + ' ' + l, last: l, first: f, role, seed, col }; };
const CREW = {
  xo: { name: 'Cmdr. Ilsa Varga', last: 'Varga', role: 'EXECUTIVE OFFICER', seed: 11, col: '#ffb21a' },
  intel: { name: 'Mira Sato', last: 'Sato', role: 'INTELLIGENCE', seed: 23, col: '#7fe7ff' },
  chief: { name: '"Dutch" Okonkwo', last: 'Dutch', role: 'CHIEF TECHNICIAN', seed: 37, col: '#8dff6a' },
};
/* procedural portrait: same seed always draws the same face */
function drawFace(cv, ch) {
  const g = cv.getContext('2d'), s = cv.width / 72, R = mulberry(ch.seed * 31 + 7), pk = a => a[(R() * a.length) | 0], col = ch.col || '#ffb21a';
  const FO = CAST[ch.seed] || {}, skin0 = pk(['#f1c9a5', '#e0ac69', '#c68642', '#8d5524', '#5a3825', '#ffdbac']), hair0 = pk(['#1b1b1b', '#3b2416', '#7a4a1e', '#b8b8b8', '#c9a24a', '#7a1e1e', '#e8e8e8']), st0 = (R() * 5) | 0, skin = FO.skin || skin0, hair = FO.hair || hair0, st = FO.st ?? st0;
  g.save(); g.setTransform(s, 0, 0, s, 0, 0); g.fillStyle = '#0a0e11'; g.fillRect(0, 0, 72, 72); const gr = g.createRadialGradient(36, 30, 4, 36, 36, 50); gr.addColorStop(0, col + '55'); gr.addColorStop(1, col + '00'); g.fillStyle = gr; g.fillRect(0, 0, 72, 72);
  if (FO.bot) { stBotFace(g, col); g.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < 72; y += 3) g.fillRect(0, y, 72, 1); g.strokeStyle = col; g.lineWidth = 2; g.strokeRect(1, 1, 70, 70); g.restore(); return; }
  g.fillStyle = pk(['#2b3138', '#3a2f2a', '#1f2f3a', '#3a3a2a']); g.beginPath(); g.moveTo(8, 72); g.quadraticCurveTo(12, 52, 36, 50); g.quadraticCurveTo(60, 52, 64, 72); g.fill(); g.fillStyle = col; g.fillRect(30, 56, 12, 3);
  const hw = 14 + R() * 3, hh = 17 + R() * 3; g.fillStyle = skin; g.fillRect(30, 42, 12, 12); g.beginPath(); g.ellipse(36, 31, hw, hh, 0, 0, TAU); g.fill();
  g.fillStyle = 'rgba(0,0,0,.16)'; g.beginPath(); g.ellipse(36, 44, hw * .8, 5, 0, 0, PI); g.fill(); g.fillStyle = hair;
  if (st === 0) { g.beginPath(); g.ellipse(36, 22, hw + 1, hh * .62, 0, PI, TAU); g.fill(); }
  else if (st === 1) { g.beginPath(); g.ellipse(36, 24, hw + 3, hh * .8, 0, PI, TAU); g.fill(); g.fillRect(36 - hw - 3, 23, 6, 24); g.fillRect(36 + hw - 3, 23, 6, 24); }
  else if (st === 2) g.fillRect(31, 10, 10, 9);
  else if (st === 3) { g.beginPath(); g.ellipse(36, 20, hw, hh * .5, 0, PI, TAU); g.fill(); g.beginPath(); g.arc(36, 10, 6, 0, TAU); g.fill(); }
  const ey = 30 + R() * 2, ex = 6 + R() * 1.5, bt = R() * 2 - 1, xt0 = R(), xt = FO.beard === undefined ? xt0 : FO.beard ? .1 : FO.glasses ? .3 : FO.headset ? .5 : FO.scar ? .65 : .9;
  g.fillStyle = '#111'; g.fillRect(36 - ex - 2.5, ey, 5, 2.4); g.fillRect(36 + ex - 2.5, ey, 5, 2.4); g.fillStyle = '#fff'; g.fillRect(36 - ex - .5, ey + .3, 1.2, 1.2); g.fillRect(36 + ex + 1.5, ey + .3, 1.2, 1.2);
  g.fillStyle = hair; for (const d of [-1, 1]) { g.save(); g.translate(36 + d * ex, ey - 3.4); g.rotate(-d * bt * .25); g.fillRect(-3.5, -.8, 7, 1.6); g.restore(); }
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(35, ey + 3, 2, 6); g.fillStyle = '#5a2a22'; g.fillRect(32, ey + 12.5, 8, 1.6 + R());
  if (xt < .22) { g.fillStyle = hair; g.beginPath(); g.ellipse(36, 45, hw * .75, 7, 0, 0, PI); g.fill(); }
  else if (xt < .42) { g.strokeStyle = col; g.lineWidth = 1.5; g.strokeRect(36 - ex - 5, ey - 2.2, 10, 6.5); g.strokeRect(36 + ex - 5, ey - 2.2, 10, 6.5); }
  else if (xt < .6) { g.strokeStyle = '#111'; g.lineWidth = 2; g.beginPath(); g.arc(36, 28, hw + 2, PI * 1.05, PI * 1.95); g.stroke(); g.fillStyle = '#111'; g.fillRect(36 + hw, 28, 4, 7); g.fillRect(36 + hw - 6, 40, 8, 2); }
  else if (xt < .7) { g.strokeStyle = '#7a2a22'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(36 + ex - 3, ey - 8); g.lineTo(36 + ex + 3, ey + 10); g.stroke(); }
  g.fillStyle = 'rgba(0,0,0,.22)'; for (let y = 0; y < 72; y += 3) g.fillRect(0, y, 72, 1); g.strokeStyle = col; g.lineWidth = 2; g.strokeRect(1, 1, 70, 70); g.restore();
}

/* in-cockpit comms: queued lines, each spoken aloud. Unless it is switched off (SETTINGS · CONTROLS), the sortie HOLDS while a line is on screen — nothing moves, nothing fires and no clock runs until it has been
   read and answered. A line with options takes keys 1-3, or the mouse / arrow keys to pick one and a click / ENTER to confirm it; a plain line waits for SPACE. With holding off, a question times out to its default
   as it always did. chatter() is talk that never stops the fight (a wingman forming up) */
const commQ = []; let commCur = null, commHold = false, commSel = -1, commMv = 0;
function comm(who, text, opts, tmo = 18, def = 0, chat = false) { const k = MS.k; text = coTxt(text); return new Promise(res => commQ.push({ who, text, opts, tmo, def, res, k, chat, qt: MS.t })); }
function commFree() { commHold = false; cutEnd(); $('commDim').classList.add('hid'); $('comm').classList.remove('hold'); }
function commReset() { commQ.length = 0; commCur = null; commFree(); $('comm').classList.add('hid'); vox.stop(); }
function commDone(i) { const c = commCur; if (!c) return; commCur = null; vox.stop(); $('comm').classList.add('hid'); if (c.opts) MS.log.push(`${c.who.last || c.who.name}: "${c.opts[i]}"`); if (c.k === MS.k && !MS.over) c.res(i); }
function commKey(n) { const c = commCur; if (c && c.opts && n >= 0 && n < c.opts.length && c.t > .5) { sfx.play('ui'); commDone(n); } }
function commMark(i) { if (i === commSel) return; commSel = i; [...$('commOpts').children].forEach((d, j) => d.classList.toggle('on', j === i)); }
function commMove(d) { const c = commCur; if (!c || !c.opts || c.t < .45) return; commMark(commSel < 0 ? (d > 0 ? 0 : c.opts.length - 1) : clamp(commSel + d, 0, c.opts.length - 1)); sfx.play('ui'); }
/* while the sortie is held. Keys: 1-3 answer, the arrows move the highlight, ENTER / SPACE confirm it — or carry on past a plain line. A held key from the fight does nothing: it has to be pressed again */
function commHoldKey(e) {
  const c = commCur; if (!c || e.repeat || c.t < .45) return; const go = e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space';
  if (!c.opts) { if (go) { sfx.play('ui'); commDone(0); } return; }
  if (go) { if (commSel >= 0) commKey(commSel); } else if (e.code === 'ArrowDown' || e.code === 'ArrowUp') commMove(e.code === 'ArrowDown' ? 1 : -1); else if (/^(Digit|Numpad)\d$/.test(e.code)) commKey(+e.code.slice(-1) - 1);
}
/* the mouse, with the pointer still captured: moving it up and down walks the highlight, a click takes the highlighted reply. A click never dismisses a plain line — that would be the trigger finger doing the reading */
function commMouse(e) { if (soft) return; commMv += e.movementY || 0; if (Math.abs(commMv) > 38) { commMove(Math.sign(commMv)); commMv = 0; } }
function commClick(e) { const c = commCur; if (!c || e.button !== 0 || (e.target && e.target.closest && e.target.closest('#comm'))) return; if (c.opts && commSel >= 0) commKey(commSel); }
$('commOpts').addEventListener('click', e => { const d = e.target.closest('[data-i]'), c = commCur; if (!d || !c || !commHold || c.t < .45) return; if (c.opts) commKey(+d.dataset.i); else { sfx.play('ui'); commDone(0); } });
$('commOpts').addEventListener('mousemove', e => { const d = e.target.closest('[data-i]'); if (d && commHold && commCur && commCur.opts) commMark(+d.dataset.i); });
function updateComm(dt) {
  if (!commCur) {
    if (CUT.live && CUT.back) return; const c = commQ.shift(); if (!c) { if (commHold && !CUT.live) commFree(); return; }
    c.hold = !c.chat && CFG.hold > (c.opts ? 0 : 1) && MS.on && !MS.over && !P.dead; c.auto = false; c.cut = null; cutPick(c); if (CUT.live && !c.cut) { commQ.unshift(c); return; }   // the camera is out and this line is about something else: bring it home first
    commCur = c; c.t = 0; commSel = -1; commMv = 0;
    const vd = vox.say(c.who, c.text, 'radio'); c.dur = c.opts ? c.tmo : Math.max(clamp(2.4 + c.text.length * .045, 3.2, 8.5), vd + .7);
    drawFace($('commFace'), c.who); $('commWho').textContent = `${c.who.name} · ${c.who.role}`; $('commWho').style.color = c.who.col;
    $('commOpts').innerHTML = c.opts ? c.opts.map((o, i) => `<div data-i="${i}"><b>${i + 1}</b>${o}</div>`).join('') : c.hold ? '<div class="go" data-i="0"><b>SPACE</b>CONTINUE</div>' : '';
    $('commHint').textContent = !c.hold ? '' : c.opts ? 'SORTIE HELD — PRESS 1-' + c.opts.length + ' · OR MOUSE / ARROWS, THEN CLICK / ENTER' : 'SORTIE HELD — SPACE TO CARRY ON';
    $('comm').classList.toggle('hold', c.hold); $('commDim').classList.toggle('hid', !c.hold); $('comm').classList.remove('hid'); sfx.play('comm');
    commHold = c.hold; if (c.hold) P.md = [false, false, false]; if (c.cut) cutGo(c);
  }
  const c = commCur; c.t += dt; $('commTxt').textContent = c.text.slice(0, Math.floor(c.t * (c.hold ? 110 : 70))); $('commBar').style.width = c.opts && !c.hold ? (1 - c.t / c.dur) * 100 + '%' : '0%';
  if ((!c.hold || c.auto) && c.t >= c.dur) commDone(c.def);
}
/* ---- the comm camera. When a line comes from somebody who is out there on the field, the view leaves your machine and goes to theirs while they speak. When it comes from somebody who is not —
   the XO, the client, an enemy commander somewhere over the hill — and it is about a thing that has just happened, the view goes to that thing instead. The sortie is held throughout and stays
   held until the camera is home again: the world stands still and the camera drifts round it. A line that does not hold (chatter, or plain messages with holding turned down in SETTINGS) never
   moves the camera, with one exception: an event is always shown, and holds for as long as its line would have stayed up.
   Scripts say whose machine is whose with fieldWho(ch, ent) and point at an event with look(thing, label) just before or after the line about it; dropships and ambushes report themselves ---- */
const CUT = { live: false, back: false, c: null, k: 0, t: 0, a: 0, d: 30, h: 8, p0: V3(), q0: new THREE.Quaternion(), p1: V3(), q1: new THREE.Quaternion(), hp: V3(), hq: new THREE.Quaternion(), at: V3(), mx: new THREE.Matrix4(), up: V3(0, 1, 0) };
const fieldWho = (ch, ent) => { if (MS.on && ch && ent) MS.who[ch.seed] = ent; return ent; };
/* auto: one of the things that report themselves. A script that has pointed at something in the same instant keeps the camera */
const look = (at, label, auto) => { if (!MS.on || !at) return at; const ev = MS.evt; if (auto && ev && !ev.used && !ev.auto && ev.t === MS.t) return at; MS.evt = { at, t: MS.t, label, auto: !!auto }; return at; };
/* where a speaker is, if they are anywhere: named by the script, flying on your wing, leading a company's lance, or in a machine that carries their name */
function cutWho(who) {
  const ok = e => e && !e.dead && (e.pos || e.isVector3) ? e : null, w = ok(MS.who[who.seed]); if (w) return w;
  if (CO.wing && CO.wing.ch.seed === who.seed && ok(MS.wing)) return MS.wing;
  for (const k of RIVS) if (RIV[k].ch === who) return FD.ents.find(e => e.rv === k && !e.dead && e.name === RIV[k].call) || FD.ents.find(e => e.rv === k && !e.dead && e.kind === 'mech') || null;
  const ln = (who.last || '').toUpperCase(); if (ln.length < 3) return null;
  return FD.ents.find(e => e.kind === 'mech' && !e.dead && e.name && e.name.toUpperCase().split(/[^A-Z0-9'-]+/).includes(ln)) || null;
}
/* called as a line comes up: is there something to show with it? */
function cutPick(c) {
  if (c.chat || !MS.on || MS.over || P.dead || mode !== 'field') return; const ev = MS.evt; let to = cutWho(c.who), kind = 'who', label = '';
  if (!to && ev && !ev.used && Math.abs(ev.t - c.qt) < .8 && !ev.at.dead) { to = ev.at; ev.used = true; kind = 'evt'; label = ev.label || ''; }
  if (!to || (kind === 'who' && !c.hold)) return; if (!c.hold) { c.hold = true; c.auto = true; }
  c.cut = to; c.cutK = kind; c.cutN = (label || to.name || (kind === 'who' ? (to.isVector3 && c.who.role) || c.who.last || c.who.name : 'CONTACT')).toUpperCase();   /* somebody at a place rather than in a machine goes by what they are */
}
function cutGo(c) {
  const cam = FD.camera, to = c.cut, p = to.pos || (to.isVector3 ? to : to.position), same = CUT.live && !CUT.back && CUT.c && CUT.c.cut === to;
  if (!CUT.live) { CUT.hp.copy(cam.position); CUT.hq.copy(cam.quaternion); CUT.live = true; document.body.classList.add('cut'); player.slot.head.visible = true; }
  CUT.c = c; CUT.back = false; if (same) return; CUT.p0.copy(cam.position); CUT.q0.copy(cam.quaternion); CUT.k = 0; CUT.t = 0;
  const s = to.pos ? Math.max(to.r || 4, (to.cy || 4) * .8, 4) : to.isVector3 ? 7 : 12, home = Math.atan2(P.pos.x - p.x, P.pos.z - p.z), dx = p.x - P.pos.x, dz = p.z - P.pos.z;
  if (c.cutK === 'who') { CUT.a = to.pos && to.yaw !== undefined ? to.yaw + (angDiff(to.yaw, home) > 0 ? .55 : -.55) : home + .4; CUT.d = s * 3 + 9; CUT.h = s * .3 + 1; }
  else { CUT.a = home + .45; CUT.d = clamp(s * 3.4 + 24, 38, 120); CUT.h = s * .7 + 10; }
  $('cutTag').textContent = `◉ ${c.cutN} · ${Math.hypot(dx, dz).toFixed(0)} M · BRG ${String(Math.round(((-Math.atan2(dx, dz) * 180 / PI) % 360 + 360) % 360)).padStart(3, '0')}`;
}
/* the shot: a slow arc round the subject, a little closer as it goes, lifted clear of the ground and of anything between the lens and what it is looking at */
function cutAim() {
  const to = CUT.c.cut, p = to.pos || (to.isVector3 ? to : to.position), a = CUT.a + CUT.t * .035, d = CUT.d * (1 - .07 * Math.min(1, CUT.t / 7)), at = CUT.at.set(p.x, p.y + (to.pos ? to.cy : to.isVector3 ? 5 : 0), p.z), q = CUT.p1;
  q.set(at.x + Math.sin(a) * d, 0, at.z + Math.cos(a) * d); q.y = Math.max(at.y + CUT.h, heightAt(q.x, q.z) + 3);
  for (let i = 1; i < 6; i++) { const k = i / 6, need = heightAt(lerp(q.x, at.x, k), lerp(q.z, at.z, k)) + 2 - lerp(q.y, at.y, k); if (need > 0) q.y += need / (1 - k); }
  for (let i = 0; i < 6 && inSolid(q); i++) q.y += 7;
  at.y -= d * .11; CUT.q1.setFromRotationMatrix(CUT.mx.lookAt(q, at, CUT.up)); at.y += d * .11;   // the subject sits in the upper part of the frame, clear of the message
  FD.sun.position.copy(at).addScaledVector(FD.sunDir, 220); FD.sun.target.position.copy(at);   // and the shadows go where the camera has gone
}
function cutEnd() { if (!CUT.live) return; CUT.live = false; CUT.c = null; FD.camera.position.copy(CUT.hp); FD.camera.quaternion.copy(CUT.hq); FD.sky.position.copy(CUT.hp); FD.sun.position.copy(P.pos).addScaledVector(FD.sunDir, 220); FD.sun.target.position.copy(P.pos); document.body.classList.remove('cut'); }
function updateCut(dt) {
  if (!CUT.live) return; if (!commHold || mode !== 'field') return cutEnd(); const cam = FD.camera;
  if (!CUT.back && commCur !== CUT.c) { CUT.back = true; CUT.p0.copy(cam.position); CUT.q0.copy(cam.quaternion); CUT.k = 0; }
  CUT.k = Math.min(1, CUT.k + dt / (CUT.back ? .5 : .85)); const e = ease.io(CUT.k);
  if (CUT.back) { cam.position.lerpVectors(CUT.p0, CUT.hp, e); cam.quaternion.slerpQuaternions(CUT.q0, CUT.hq, e); if (CUT.k >= 1) cutEnd(); }
  else { CUT.t += dt; cutAim(); cam.position.lerpVectors(CUT.p0, CUT.p1, e); cam.quaternion.slerpQuaternions(CUT.q0, CUT.q1, e); }
  FD.sky.position.copy(cam.position);
}
const say = (who, text) => { comm(who, text); };
const ask = (who, text, opts, tmo, def) => comm(who, text, opts, tmo, def);
const chatter = (who, text) => { comm(who, text, null, 18, 0, true); };
/* objectives: st 0 active · 1 done · 2 failed · 3 dropped; fn() supplies live text */
function setObj(id, text, st = 0, opt) {
  let o = MS.obj.find(o => o.id === id); if (!o) { MS.obj.push(o = { id, opt: false }); sfx.play('ui'); }
  if (typeof text === 'function') o.fn = text; else if (text != null) { o.text = text; o.fn = null; } if (st === 1 && o.st !== 1) sfx.play('ok'); o.st = st; if (opt !== undefined) o.opt = opt; MS.dirty = true; return o;
}
const objSt = id => (MS.obj.find(o => o.id === id) || {}).st;
function drawObjs() { $('objList').innerHTML = MS.obj.map(o => `<div class="ob s${o.st}${o.opt ? ' op' : ''}">${'▢✔✖—'[o.st]} ${o.fn ? o.fn() : o.text}${o.opt && o.st === 0 ? ' <em>OPTIONAL</em>' : ''}</div>`).join(''); const m = Math.floor(MS.t / 60); $('msClock').textContent = `T+${String(m).padStart(2, '0')}:${String(Math.floor(MS.t % 60)).padStart(2, '0')}`; }
/* nav markers: pos is a Vector3 or a live unit */
function nav(id, pos, label, col = '#ffb21a') { unnav(id); MS.navs.push({ id, pos, label, col }); }
function unnav(id) { const i = MS.navs.findIndex(n => n.id === id); if (i >= 0) MS.navs.splice(i, 1); }
function updateNavs() {
  const host = $('navs'), cam = FD.camera; while (host.children.length < MS.navs.length) { const d = document.createElement('div'); d.className = 'nav'; d.innerHTML = '<i></i><span></span>'; host.appendChild(d); }
  for (let i = 0; i < host.children.length; i++) {
    const d = host.children[i], n = MS.navs[i]; if (!n || n.pos.dead) { d.style.display = 'none'; continue; }
    const p = n.pos.isVector3 ? n.pos : n.pos.pos; _v.set(p.x, p.y + (n.pos.isVector3 ? 9 : n.pos.cy * 2 + 5), p.z); const dist = _v.distanceTo(cam.position); _v.project(cam);
    let x = _v.x, y = _v.y; const back = _v.z > 1; if (back) { x = -x; y = -y; } const m = Math.max(Math.abs(x) / .93, Math.abs(y) / .84);
    if (back || m > 1) { const k = 1 / Math.max(m, .001); x *= k; y *= k; }
    d.style.display = ''; d.style.left = (x * .5 + .5) * 100 + '%'; d.style.top = (-y * .5 + .5) * 100 + '%'; d.style.color = n.col; d.classList.toggle('off', back || m > 1); d.lastChild.textContent = `${n.label} ${dist < 1000 ? dist.toFixed(0) + 'm' : ''}`;
  }
}
/* script helpers — every await below only resumes while the same mission is still running */
const until = c => new Promise(res => MS.wait.push({ c, res }));
const after = s => { const t = MS.t + s; return until(() => MS.t >= t); };
const near = (p, r) => Math.hypot(P.pos.x - p.x, P.pos.z - p.z) < r;
const alive = L => { let n = 0; for (const e of L) if (!e.dead) n++; return n; };
const gpos = (x, z) => V3(x, heightAt(x, z), z);
const note = s => MS.log.push(s);
const bonus = (label, amt) => { MS.bonus.push([label, Math.round(amt)]); msg(`${amt >= 0 ? 'BONUS' : 'PENALTY'} — ${label}`, 3); };
const rep = (f, d) => { MS.repD[f] = (MS.repD[f] || 0) + d; };
const force = (k = 1) => { const ct = capTier(MS.c), d = MS.c.diff * k * (ct === 0 ? .8 : ct === 1 ? .9 : 1); return { mech: Math.round(d * .7), tank: Math.round(d * .5 + .3), drone: Math.round(d * .6 + .5), tier: Math.min(ct, d < 2 ? 0 : d < 3.6 ? 1 : 2), mix: 1 }; };
const fopt = (o = {}) => ({ skill: .75 + MS.c.diff * .1, hpK: .8 + MS.c.diff * .08, ...o });
const foes = (k, x, z, r0, r1, o) => spawn(force(k), x, z, r0, r1, 1, fopt(o));
const setTeam = (L, t, o) => { for (const e of L) if (!e.dead) { e.team = t; e.tgt = null; e.tT = 0; if (o) Object.assign(e, o); } };
const leave = L => { for (const e of L) if (!e.dead) { e.team = 2; e.ai = 'goto'; const a = Math.atan2(e.pos.x, e.pos.z); e.dest = V3(Math.sin(a) * 420 * FD.k, 0, Math.cos(a) * 420 * FD.k); e.gone = true; } };   // walk off the map and vanish
function endMission(ok, text, partial = 0) {
  if (!MS.on || MS.over) return; Object.assign(MS, { over: true, ok, endText: text, endT: 4.6, partial }); MS.wait.length = 0; commQ.length = 0;
  msg(ok ? 'CONTRACT COMPLETE' : 'CONTRACT FAILED', 4.5); sfx.play(ok ? 'ok' : 'deny'); for (const o of MS.obj) if (o.st === 0) o.st = ok ? (o.opt ? 3 : 1) : 2; MS.dirty = true; note(text);
}
const win = t => endMission(true, t), lose = (t, partial) => endMission(false, t, partial);
async function extract(text, at = MS.LZ, label = 'DROPSHIP') {
  setObj('x', at === MS.LZ ? 'Return to the dropship for extraction' : 'Reach the extraction point'); nav('x', at, label, '#8dff6a'); await until(() => near(at, 30)); win(text);
}
function updateMission(dt) {
  updateComm(dt); if (!MS.on) return;
  if (MS.over) { MS.endT -= dt; if (MS.endT <= 0 && !P.leaving) toHangar(); if (MS.dirty) { MS.dirty = false; drawObjs(); } return; }
  MS.t += dt;
  for (let i = MS.wait.length - 1; i >= 0; i--) { const w = MS.wait[i]; let ok = false; try { ok = w.c(); } catch (e) { console.error(e); } if (ok) { MS.wait.splice(i, 1); w.res(); } }
  for (let i = FD.ents.length - 1; i >= 0; i--) { const e = FD.ents[i]; if (e.gone && (e.arrived || Math.hypot(e.pos.x, e.pos.z) > 400 * FD.k)) { FD.scene.remove(e.obj); e.dead = true; FD.ents.splice(i, 1); } }
  if ((MS.objT = (MS.objT || 0) - dt) < 0 || MS.dirty) { MS.objT = .25; MS.dirty = false; drawObjs(); }
}
/* the landed company dropship that marks the LZ */
function shipProp(p, yaw) {
  const g = grp(FD.scene, p.x, p.y + 3.6, p.z, 0, yaw, 0); tbox(g, M.dark, 9, 5, 22, .75, .8, 0, 0, 0); tbox(g, M.yellow, 7, 2.4, 9, .7, .6, 0, 3.6, 4); noShadow(box(g, M.cyan, 4.4, 1, .2, 0, 3.2, 8.6, -.5)); box(g, M.girder, 24, .8, 6, 0, 1.6, -3);
  for (const [px, pz] of [[-11, 0], [11, 0], [-11, -6], [11, -6]]) { cyl(g, M.steel, 2.2, 2.6, 4, px, .6, pz, 0, 0, 0, 12); cyl(g, M.girder, .3, .3, 4, px, -2.2, pz); }
  box(g, M.steel, 5, .3, 9, 0, -2.6, -13, .3); for (let i = 0; i < 8; i++) noShadow(box(g, M.green, .6, .3, .6, Math.sin(i * TAU / 8) * 26, -3.3, Math.cos(i * TAU / 8) * 26));
  FD.misc.push(g); addCol({ x: p.x, z: p.z, r: 9, top: p.y + 8 }); return g;
}
function beginMission(c) {
  const ST = c.story ? storyLay(c) : null, R = mulberry(c.seed), a = ST ? ST.a : R() * TAU, pt = (ang, r) => [Math.sin(ang) * r, Math.cos(ang) * r], lz = ST ? ST.lz : pt(a, 300), A = ST ? ST.A : pt(a + PI + (R() - .5), 110 + R() * 110), B = ST ? ST.B : pt(a + PI / 2 + (R() - .5) * .6, 200 + R() * 70), C = ST ? ST.C : pt(a - PI / 2 + (R() - .5) * .6, 200 + R() * 70);
  const Wk = !ST && c.twists.includes('works') ? pt(a + PI * .72, OPS_HOLD.includes(c.type) ? 235 : 310) : null;   /* where there is something to stand by, the works is near enough to go and deal with */
  buildEnv(c.biome, c.seed, ST ? ST.env : { pads: [[...lz, 36], [...A, 54], [...B, 40], [...C, 40], ...(Wk ? [[...Wk, 34]] : [])], mood: c.mood, tod: c.tod });
  Object.assign(MS, { on: true, k: MS.k + 1, c, t: 0, over: false, ok: false, partial: 0, obj: [], navs: [], wait: [], log: [], bonus: [], repD: {}, relD: {}, payK: 1, payer: c.emp, v: {}, who: {}, evt: null, dirty: true, jam: false, abort: false, endText: '',
    LZ: gpos(...lz), A: gpos(...A), B: gpos(...B), C: gpos(...C), foePaint: FAC[c.foe].paint, allyPaint: FAC[c.emp].paint, ops: CREW.xo, hnd: c.contact, foe: mkChar(c.seed + 5, FAC[c.foe].short + ' COMMANDER', FAC[c.foe].col, 'Maj.') });
  MS.W = Wk ? gpos(...Wk) : null; commReset(); if (ST) ST.ready(MS);
  P.pos.copy(MS.LZ).add(_v.set(-Math.sin(a) * 50, 0, -Math.cos(a) * 50)); P.pos.y = heightAt(P.pos.x, P.pos.z); P.yaw = Math.atan2(A[0] - P.pos.x, A[1] - P.pos.z); shipProp(MS.LZ, a);
  $('msTitle').textContent = (ST ? `${STORY[c.story].name} · ${c.title}` : `${TYPES[c.type].name} — ${c.site}`).toUpperCase();
  const go = f => Promise.resolve().then(() => f(MS)).catch(e => console.error('mission script', e));
  if (CO.wing && !(ST && MS.H.solo)) { const w = CO.wing, e = mkMech(P.pos.x + 14, P.pos.z + 6, w.cfg ? { ...w.cfg } : w.p === PILOTS[0] && stFlag('derby.mag') ? { ...ST_MAGPIE, paint: player.cfg.paint } : { ...PRESETS[w.mech], paint: player.cfg.paint }, 0, { ai: 'follow', name: w.ch.name, skill: w.skill || 1.25, hpK: w.hpK || 1.5, yaw: P.yaw }); MS.wing = e; e.onKill = () => { say(MS.ops, `${w.ch.first}'s mech is down. Pilot ejected — we'll recover them.`); note(`${w.ch.name} was shot down.`); CO.wingDown = true; }; go(async () => { await after(4); chatter(w.ch, pick(['On your wing. Try not to get us both killed.', 'Formed up. Point me at something.', 'Green across the board. After you, boss.'])); }); } else MS.wing = null;
  go(ST ? ST.run : MISSIONS[c.type]); for (const t of c.twists) if (TWISTS[t]) go(TWISTS[t]);
  if (c.cok === 'joint' && RIV[c.co]) go(rivJoint); if (c.cok === 'sub' && RIV[c.co]) go(async () => { await after(7); say(RIV[c.co].ch, RIVL[c.co].subHi); });
}

