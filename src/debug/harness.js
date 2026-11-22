/* ---- debug-only test hooks (never shipped) ---- */
window.__errs = []; addEventListener('error', e => __errs.push(String(e.message))); addEventListener('unhandledrejection', e => __errs.push('rej ' + (e.reason && e.reason.stack || e.reason)));
window.__fps = (n = 90) => new Promise(r => { let c = 0; const t0 = performance.now(), f = () => { if (++c >= n) r(Math.round(c * 1000 / (performance.now() - t0))); else requestAnimationFrame(f); }; requestAnimationFrame(f); });
/* fast-forward the bay/deck simulation without rendering */
window.__ff = (sec, step = 1 / 30) => { let n = 0; for (let t = 0; t < sec; t += step) { T += step; updateTweens(step); if (!dlgCur && mode !== 'aar') tickClock(step); if (mode === 'bar') updateBar(step, T); else if (mode === 'aar') updateAar(step, T); else { updateHangar(step, T); if (mode === 'hq') updateHQ(step, T); } n++; } return n; };
/* park the deck camera: __cam(x,y,z, lx,ly,lz) — or __cam() to release */
window.__cam = (x, y, z, lx, ly, lz) => { if (x === undefined) { hq.focus = null; barCam.focus = null; orb.cine = false; return; } if (mode === 'bar') { barCam.focus = { pos: V3(x, y, z), look: V3(lx, ly, lz) }; barCam.cPos.set(x, y, z); barCam.cLook.set(lx, ly, lz); } else if (mode === 'hq') { hq.focus = { pos: V3(x, y, z), look: V3(lx, ly, lz) }; hq.cPos.set(x, y, z); hq.cLook.set(lx, ly, lz); } else { orb.cine = true; orb.pos.set(x, y, z); orb.look.set(lx, ly, lz); orb.cPos.set(x, y, z); orb.cLook.set(lx, ly, lz); } };
/* frame one person: __see(human, dist, angle off their facing, height) */
window.__see = (h, d = 1.6, a = 0, y = 1.45, ly = 1.3) => { const p = h.g.position, w = h.yaw + a; __cam(p.x + Math.sin(w) * d, p.y + y, p.z + Math.cos(w) * d, p.x, p.y + ly, p.z); };
/* render a score offline: which = 'night' | 'amb' | 'deck' (the theme, then the ambience) | 'win' | 'brief' (the briefing room march) | 'radio' | 'juke' (the radio's band through the bar jukebox) | 'field' */
/* for 'field': track 0-6, and heat 0 = the patrol arrangement, 1 = combat, or [[seconds, heat], ...] to hear the hand-over */
/* solo: bus names to keep (the mix of s.deck or s.field); everything else on that score is disconnected */
window.__render = async (which, secs = 20, seed = 7, track = 0, heat = 0, solo = null) => {
  const SRT = 44100, oc = new OfflineAudioContext(2, SRT * secs, SRT), s = makeScore(oc, oc.destination, seed);
  if (solo) { const M = (which === 'field' ? s.field : s.deck).mix; for (const k in M) if (!solo.includes(k)) M[k].disconnect(); }
  if (which === 'kit') { const m = +track; s.KIT.twang(oc.destination, .1, m, .5, { d: secs - .3 }); }
  else if (which === 'field') { s.field.out.gain.value = .85; s.field.use(track, .05); if (Array.isArray(heat)) for (let t = 0; t < secs; t += .1) { let h = 0; for (const [a, v] of heat) if (t >= a) h = v; s.field.heat(h); s.field.tick(t + .1); } else { s.field.force(heat > .5); s.field.tick(secs); } }
  else if (which === 'win') s.sting.play('win', .1);
  else if (which === 'intro') s.intro.play(.1);
  else if (which === 'brief') { s.brief.out.gain.value = .62; s.brief.start(.05); s.brief.tick(secs); }
  else if (which === 'radio' || which === 'juke') { s.radio.out.gain.value = .9; s.radio.voice(which === 'juke' ? 1 : 0, 0, .001); s.radio.start(.05); s.radio.tick(secs); }
  else { s.deck.out.gain.value = .95; s.deck.start(.05, which === 'amb' ? 1 : 0); s.deck.tick(secs); }
  return { b: await oc.startRendering(), s };
};
/* __mus(which, seconds, seed, track, heat): render and measure — peak, RMS per second, band energy, beat alignment */
window.__mus = async (which, secs = 20, seed = 7, track = 0, heat = 0) => {
  const SRT = 44100, { b, s } = await __render(which, secs, seed, track, heat), L = b.getChannelData(0), Rr = b.getChannelData(1);
  let pk = 0, sq = 0, bad = 0; const rms = []; for (let i = 0; i < L.length; i++) { const v = (L[i] + Rr[i]) / 2; if (!isFinite(v)) bad++; pk = Math.max(pk, Math.abs(L[i]), Math.abs(Rr[i])); sq += v * v; if (i % SRT === SRT - 1) { rms.push(+Math.sqrt(sq / SRT).toFixed(3)); sq = 0; } }
  const bands = [60, 120, 250, 500, 1000, 2000, 3000, 4000, 6000, 9000].map(f => { let e = 0; for (let w = 0; w < 12; w++) { const o = Math.floor((w + 1) * (L.length - 4096) / 14); let re = 0, im = 0; for (let i = 0; i < 4096; i++) { const v = L[o + i] * (.5 - .5 * Math.cos(TAU * i / 4096)), p = TAU * f * i / SRT; re += v * Math.cos(p); im += v * Math.sin(p); } e += re * re + im * im; } return f + ':' + (10 * Math.log10(e / 12 + 1e-12)).toFixed(0); }).join(' ');
  const hop = 441, env = []; for (let i = 0; i + hop < L.length; i += hop) { let e = 0; for (let j = 0; j < hop; j++) e += L[i + j] * L[i + j]; env.push(Math.sqrt(e / hop)); } const fl = env.map((v, i) => Math.max(0, v - (env[i - 1] || 0)));
  const ac2 = lag => { let c = 0; for (let i = lag; i < fl.length; i++) c += fl[i] * fl[i - lag]; return c; }, song = which === 'field' ? s.field.song : which === 'radio' || which === 'juke' ? s.radio.song : which === 'night' || which === 'deck' ? { bpm: 84 } : which === 'brief' ? { bpm: 72 } : which === 'win' ? { bpm: 126 } : which === 'intro' ? { bpm: 120 } : null, beat = song ? Math.round(60 / song.bpm * 100) : 0;
  let best = 0, bl = 0; for (let lag = 20; lag < 130; lag++) { const c = ac2(lag); if (c > best) { best = c; bl = lag; } }
  return { peak: +pk.toFixed(3), bad, rms: rms.join(' '), bands, envPeakLagSec: bl / 100, rmsAll: +Math.sqrt(rms.reduce((a, v) => a + v * v, 0) / (rms.length || 1)).toFixed(3), fight: which === 'field' ? s.field.state : undefined, song: song && { bpm: +song.bpm.toFixed(1), key: song.key, swing: song.sw, riff: !!song.riff, beatSec: beat / 100, acAtBeat: +(ac2(beat) / best).toFixed(2), acAtHalf: +(ac2(Math.round(beat / 2)) / best).toFixed(2) } };
};
/* the same render as a 16-bit stereo WAV, base64 */
window.__wav = async (...a) => {
  const { b } = await __render(...a), L = b.getChannelData(0), Rr = b.getChannelData(1), n = L.length, u = new Uint8Array(44 + n * 4), v = new DataView(u.buffer), W = (o, t) => { for (let i = 0; i < t.length; i++) u[o + i] = t.charCodeAt(i); };
  W(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); W(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, 44100, true); v.setUint32(28, 176400, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); W(36, 'data'); v.setUint32(40, n * 4, true);
  for (let i = 0; i < n; i++) { v.setInt16(44 + i * 4, clamp(L[i], -1, 1) * 32767, true); v.setInt16(46 + i * 4, clamp(Rr[i], -1, 1) * 32767, true); }
  let o = ''; for (let i = 0; i < u.length; i += 0x8000) o += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(o);
};
/* stand a set of people in a row, frozen, for inspection */
window.__line = (list, x0, z, dx, yaw = 0, act = 'stand') => list.forEach((h, i) => { h.co = null; h.brain = null; h.path = []; h.faceTo = null; h.seat = null; h.g.visible = true; h.g.position.set(x0 + i * dx, h.holo ? .34 : 0, z); h.yaw = yaw; h.look = null; h.setAct(act); });
/* contact sheet: step one person's animation and tile the frames, so motion can be read from a single screenshot */
window.__strip = (h, n = 8, dt = .1, d = 3.4, side = Math.PI / 2, y = .95, fov = 30) => {
  let cv = document.getElementById('__st'); if (!cv) { cv = document.createElement('canvas'); cv.id = '__st'; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:9999;background:#000'; document.body.appendChild(cv); }
  const W = innerWidth, H = innerHeight; cv.width = W; cv.height = H; cv.style.display = ''; const g = cv.getContext('2d'), rows = n > 5 ? 2 : 1, cols = Math.ceil(n / rows), tw = W / cols, th = H / rows, gl = renderer.domElement, cam = new THREE.PerspectiveCamera(fov, gl.width / gl.height, .1, 300), C = mode === 'hq' ? HQ.crowd : HG.crowd, sc = mode === 'hq' ? HQ.scene : HG.scene;
  const sw = gl.height * tw / th;
  for (let i = 0; i < n; i++) { for (let k = 0; k < 6; k++) { C.update(dt / 6); } const p = h.g.position, a = side; cam.position.set(p.x + Math.sin(a) * d, p.y + y, p.z + Math.cos(a) * d); cam.lookAt(p.x, p.y + y * .92, p.z); POST.draw(sc, cam); g.drawImage(gl, (gl.width - sw) / 2, 0, sw, gl.height, (i % cols) * tw, Math.floor(i / cols) * th, tw, th); }
};
window.__stripOff = () => { const cv = document.getElementById('__st'); if (cv) cv.style.display = 'none'; };
/* pose sheet: one person, one tile per activity (or per fidget with 'f:name'), each after settling */
window.__poses = (h, acts, ang = 0, d = 3.3, y = .95, fov = 30, settle = 1.6) => {
  let cv = document.getElementById('__st'); if (!cv) { cv = document.createElement('canvas'); cv.id = '__st'; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:9999;background:#000'; document.body.appendChild(cv); }
  const W = innerWidth, H = innerHeight, n = acts.length; cv.width = W; cv.height = H; cv.style.display = ''; const g = cv.getContext('2d'), rows = n > 6 ? 2 : 1, cols = Math.ceil(n / rows), tw = W / cols, th = H / rows, gl = renderer.domElement, cam = new THREE.PerspectiveCamera(fov, gl.width / gl.height, .1, 300), C = mode === 'hq' ? HQ.crowd : HG.crowd, sc = mode === 'hq' ? HQ.scene : HG.scene, sw = gl.height * tw / th;
  h.co = null; h.brain = null; h.path = []; h.fidT = 999; h.wsT = 999; h.wsG = 0; g.font = '14px Menlo'; g.fillStyle = '#ffb21a';
  acts.forEach((a, i) => {
    const o = typeof a === 'string' ? [a] : a; h.fid = null; h.seat = null; if (o[0].startsWith('f:')) { h.setAct('stand'); for (let k = 0; k < 20; k++) C.update(.05); h.fid = FIDGET.find(f => f[0] === o[0].slice(2)); h.fidA = 0; for (let k = 0; k < 24; k++) C.update(.05); } else { h.setAct(o[0], o[1] || {}); if (o[0] === 'sit') h.seat = o[1]; for (let k = 0; k < settle / .05; k++) C.update(.05); }
    const p = h.g.position; cam.position.set(p.x + Math.sin(ang) * d, p.y + y, p.z + Math.cos(ang) * d); cam.lookAt(p.x, p.y + y * .92, p.z); POST.draw(sc, cam); g.drawImage(gl, (gl.width - sw) / 2, 0, sw, gl.height, (i % cols) * tw, Math.floor(i / cols) * th, tw, th); g.fillText(o[0] + (o[1] && o[1].mode ? ' ' + o[1].mode : ''), (i % cols) * tw + 8, Math.floor(i / cols) * th + 18);
  });
};

/* ---- v7 ---- */
/* the debriefing room. __aar() says what is in it (the heads, the note, the wall's figures); __aar('shut') leaves it at once for the bay, with no lift and nothing asked, which is what
   __mk, __smk and __arena do first: the drivers fly one contract straight after another */
window.__aar = op => {
  if (op === 'shut' && mode === 'aar') { vox.stop(); if (ST.open) { ST.done = null; storesClose(); } $('aarUI').classList.add('hid'); Object.assign(AAR, { D: null, L: [], q: [], spk: null }); mode = 'hangar'; $('hangarUI').classList.remove('hid'); busy = false; }
  return { on: mode === 'aar', t: AAR.t, two: AAR.two, note: AAR.note, heads: AAR.L.map(b => ({ side: b.side, who: b.ch.name, text: b.text, opts: (b.opts || []).map(o => o[0]), key: b.key, up: !!b.el })), fig: AAR.D ? AAR.D.fig : null, lines: AAR.D ? AAR.D.lines : null, total: AAR.D ? AAR.D.total : null };
};
/* put a made-to-order contract on the board, sign it and drop straight into the field with the free-mouse lock (headless Chrome refuses pointer lock). o overrides any field: plot, twists, rival, co, cok, diff ... */
window.__mk = (type, plot, o = {}) => {
  const c = genContract({ type }); delete c.rival; Object.assign(c, { plot, twists: [], diff: 3 }, o); if (c.co) { const { co, cok, share } = c; delete c.co; delete c.cok; rivCo(c, co, cok, share || 0); }
  __aar('shut'); CO.board.push(c); CO.active = CO.sel = c; dlgClose(); for (const id of ['hqUI', 'barUI']) $(id).classList.add('hid'); mode = 'hangar'; startField(); soft = true; locked = true; $('pause').classList.add('hid'); return c;
};
/* run the sortie forward without waiting: steps the field, lets the mission scripts continue between steps, and answers every comm at once (pick(c) -> option index). Returns everything that was said.
   The player is kept alive unless o.mortal; o.stop(said) ends the run early */
window.__sim = async (secs, pick = () => 0, o = {}) => {
  const said = [], dt = o.dt || .05;
  for (let t = 0; t < secs; t += dt) {
    if (mode !== 'field' || (o.stop && o.stop(said))) break; if (!o.mortal) P.armor = P.max; if (o.each) o.each(t);
    if (commCur) { const c = commCur, i = c.opts ? pick(c, said) : 0; said.push(`[${MS.t.toFixed(0)}] ` + (c.cut ? `{cam ${c.cutK}: ${c.cutN}} ` : '') + `${c.who.name}: ${c.text}` + (c.opts ? `  [${c.opts.join(' | ')}]  > ${c.opts[i]}` : '')); c.t = 1; commDone(i); }
    else { if (commHold) commFree(); T += dt; updateField(dt, T); }
    for (let k = 0; k < 8; k++) await Promise.resolve();
  }
  return said;
};
/* a line of dialogue, rendered: length, level, and whether any sample came out wrong */
window.__vox = (ch, text, fx) => { const r = voxRender(voxOf(ch), text, { fx, seed: 7 }); let bad = 0, pk = 0, sq = 0; for (const v of r.pcm) { if (!isFinite(v)) bad++; pk = Math.max(pk, Math.abs(v)); sq += v * v; } return { dur: +r.dur.toFixed(2), peak: +pk.toFixed(3), rms: +Math.sqrt(sq / r.pcm.length).toFixed(3), bad }; };
/* ---- v8: story ---- */
/* put a chapter of a thread on the board (__story), or go straight into it in the field (__smk) with any remembered flags f, e.g. { 'mar.ram': 1 } */
window.__story = (k, ch = 0) => { Object.assign(stState(k), { ch, st: 2, at: 0, exp: now() + 90, n: 0 }); storySync(); return CO.board.find(c => c.story === k); };
window.__smk = (k, ch = 0, f = {}) => { __aar('shut'); const c = __story(k, ch); Object.assign(STV.f, f); CO.active = CO.sel = c; dlgClose(); for (const id of ['hqUI', 'barUI', 'brfUI']) $(id).classList.add('hid'); mode = 'hangar'; startField(); soft = true; locked = true; $('pause').classList.add('hid'); return { id: c.id, title: c.title, diff: c.diff, size: FD.size }; };
/* where the chapter's sites ended up: height, and how far above the water */
/* look at the field from anywhere: __fcam(x, y, z, lx, ly, lz), or a function returning those six each frame; no arguments hands the view back. __fsee(thing, dist, angle, height) stands off from an entity or a point */
window.__fcam = (...a) => { if (!a.length) { FD.scene.onBeforeRender = () => { }; document.body.classList.remove('cut'); return; } const f = typeof a[0] === 'function' ? a[0] : () => a; document.body.classList.add('cut'); player.slot.head.visible = true; FD.scene.onBeforeRender = (r, sc, cam) => { const v = f(); if (!v || cam !== FD.camera) return; cam.position.set(v[0], v[1], v[2]); cam.lookAt(v[3], v[4], v[5]); cam.updateMatrixWorld(); FD.sky.position.copy(cam.position); FD.sun.position.set(v[3], v[4], v[5]).addScaledVector(FD.sunDir, 220); FD.sun.target.position.set(v[3], v[4], v[5]); }; };
window.__fsee = (e, d = 60, a = 0, h = 14, up = 0) => __fcam(() => { const p = e.pos || e, y = p.y + (e.cy || 0) + up; return [p.x + Math.sin(a) * d, Math.max(p.y + h, heightAt(p.x + Math.sin(a) * d, p.z + Math.cos(a) * d) + 3), p.z + Math.cos(a) * d, p.x, y, p.z]; });
window.__sites = () => Object.fromEntries(Object.entries(MS.S || {}).map(([k, p]) => [k, [Math.round(p.x), Math.round(p.z), +p.y.toFixed(1), EV.wl == null ? null : +(p.y - EV.wl).toFixed(1)]]));
/* contact sheet of things: __sheet([{ o: Object3D, h, r, n }], angle, cols, pitch) — each is drawn alone on a grey floor and tiled into one screenshot */
window.__sheet = (items, ang = .6, cols = 6, up = .62) => {
  let cv = document.getElementById('__st'); if (!cv) { cv = document.createElement('canvas'); cv.id = '__st'; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:9999;background:#000'; document.body.appendChild(cv); }
  const W = innerWidth, H = innerHeight, n = items.length, rows = Math.ceil(n / cols), tw = W / cols, th = H / rows, gl = renderer.domElement, cam = new THREE.PerspectiveCamera(30, gl.width / gl.height, .1, 900), sw = Math.min(gl.width, gl.height * tw / th), shh = sw * th / tw;
  cv.width = W; cv.height = H; cv.style.display = ''; const g = cv.getContext('2d'); g.font = '13px Menlo'; g.fillStyle = '#ffb21a';
  const sc = new THREE.Scene(); sc.background = new THREE.Color(0x232a31); sc.environment = ENV; sc.add(new THREE.HemisphereLight(0xcfd8e6, 0x3a3024, 1.2)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.6); sun.position.set(20, 40, 30); sc.add(sun);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), std({ color: 0x3a4048, roughness: .95 })); fl.rotation.x = -Math.PI / 2; sc.add(fl);
  items.forEach((it, i) => {
    const par = it.o.parent, p0 = it.o.position.clone(), r0 = it.o.rotation.clone(); sc.add(it.o); if (!it.keep) { it.o.position.set(0, it.y || 0, 0); it.o.rotation.set(0, it.ry || 0, 0); } it.o.updateMatrixWorld(true);
    const h = it.h, d = Math.max(h, (it.r || 3) * 2) * 2.1 + 5, c = it.keep ? it.o.position : new THREE.Vector3(0, it.y || 0, 0); cam.position.set(c.x + Math.sin(ang) * d, c.y + h * up, c.z + Math.cos(ang) * d); cam.lookAt(c.x, c.y + h * .46, c.z); POST.draw(sc, cam);
    g.drawImage(gl, (gl.width - sw) / 2, (gl.height - shh) / 2, sw, shh, (i % cols) * tw, Math.floor(i / cols) * th, tw, th); g.fillText(it.n || '', (i % cols) * tw + 8, Math.floor(i / cols) * th + 18);
    sc.remove(it.o); if (par) { par.add(it.o); it.o.position.copy(p0); it.o.rotation.copy(r0); }
  });
};
window.__mechs = (cfgs, ang = .6, cols = 6) => __sheet(cfgs.map(c => { const m = new Mech(c), s = m.stats; m.update(.016); return { o: m.root, h: m.height, r: m.radius, n: (c.name || '') + ' ' + s.tons.toFixed(0) + 't' }; }), ang, cols);
/* every part of one category on a plain body, so the part itself can be judged */
window.__parts = (cat, ang = .6, cols = 6, ids = Object.keys(PARTS[cat])) => __mechs(ids.map(id => ({ name: id, paint: 0, legs: 'bip', torso: 'bas', head: 'vis', armL: 'las', armR: 'las', back: 'snk', ...(cat === 'arm' ? { armL: id, armR: id } : { [cat]: id }) })), ang, cols);
/* point the reticle at a target (or at one of its parts): call it every step, the camera sits off to one side of the machine */
window.__aim = (e, k) => { const c = e.pos.clone(); c.y += e.cy; if (k && e.mech) { const z = e.mech.zg.find(z => z.k === k); if (z) zoneW(e.mech, z, c); } const cam = FD.camera.position, dx = c.x - cam.x, dz = c.z - cam.z; P.twist = angDiff(P.yaw, Math.atan2(dx, dz)); P.pitch = Math.atan2(c.y - cam.y, Math.hypot(dx, dz)); };
/* a bare proving ground with the player in a given build: __arena(cfg) */
window.__arena = cfg => { __aar('shut'); if (cfg) { player.cfg = { name: 'T', paint: 0, sinks: 3, ...cfg }; player.build(); } CO.active = null; dlgClose(); for (const id of ['hqUI', 'barUI']) $(id).classList.add('hid'); mode = 'hangar'; startField(); soft = true; locked = true; $('pause').classList.add('hid'); clearField(); P.pos.set(160, heightAt(160, 160), 160); P.waveT = -1e9; };
/* a target dummy d metres ahead: a pacified machine with a great deal of armour */
window.__dummy = (d = 60, cfg = PRESETS[1], o = {}) => { const x = P.pos.x + Math.sin(P.yaw) * d, z = P.pos.z + Math.cos(P.yaw) * d, e = mkMech(x, z, { ...cfg, paint: 3 }, 1, { ai: 'hold', hpK: 60, name: 'DUMMY', yaw: 0, ...o }); e.pacify = o.pacify ?? true; return e; };
/* the first day. A debug page skips all of it (the drivers in .scratch expect a full board and nobody showing anybody round), and goes on skipping it through a new game or an imported save,
   unless the address ends in ?tut. __tut() says where it stands; __tut('skip') skips it as the button does, __tut('reset') makes this a brand-new company, __tut('tour', k) gives one tour again */
window.__tut = (op, k) => { if (op === 'skip') { if (TUT.lock) tutSkip(); TUT.hints = false; tutEnd(); } else if (op === 'reset') { gameApply(null); YARD.founded = true; } else if (op === 'tour') { tutEnd(); delete TUT.seen[k]; TUT.hints = true; } return { lock: TUT.lock, hints: TUT.hints, seen: Object.keys(TUT.seen), tour: TG.k, step: TG.i, text: TG.k ? $('tutText').textContent : '', chip: TG.chip, keys: TG.keys }; };
if (!/[?&]tut\b/.test(location.search)) {
  const ap = tutApply, off = () => { TUT.lock = TUT.hints = false; for (const k of TUT_KEYS) TUT.seen[k] = 1; }; tutApply = s => { ap(s); off(); };
  off(); tutStory(); for (const c of CO.board.filter(c => c.story && STORY[c.story].first)) CO.board.splice(CO.board.indexOf(c), 1); CO.news = CO.news.filter(n => !n.includes('Nobody is hiring yet')); fillBoard();
}
/* the opening. A debug page never plays it unasked (the drivers expect the bay), unless the address ends in ?intro. __intro(t) builds it and holds it at t seconds, silent, for a screenshot;
   __intro('play') runs it from the top with its sound, __intro('end') stops it, __intro() says where it stands */
if (!/[?&]intro\b/.test(location.search)) INTROV.off = true;
/* the wire home. A debug page tells the server nothing (the drivers are not players, and their feedback is not feedback), unless the address ends in ?net */
if (!/[?&]net\b/.test(location.search)) NET.off = true;
/* the sortie guard. A debug page does not ask before it is unloaded mid-sortie (the drivers navigate away from sorties all the time), unless the address ends in ?guard */
if (!/[?&]guard\b/.test(location.search)) SGUARD.ask = false;
window.__intro = t => {
  if (t === 'end') introEnd(); else if (t === 'play') { introEnd(); introOpen(); }
  else if (t !== undefined) { introEnd(); introOpen(); Object.assign(INTROV, { st: 2, hold: true, warm: 5, a0: -1 }); $('intro').classList.add('run'); for (let x = 0; x < t; x += 1 / 30) introStep(x, 1 / 30); introStep(t, 0); $('inBlk').style.opacity = INTROV.blk; }
  return { st: INTROV.st, t: +INTROV.t.toFixed(2), shot: INTROV.shot, ents: FD.ents.length, mode };
};
/* the opening as a contact sheet: __introSheet([seconds, ...], cols) holds it at each moment in turn and tiles the pictures, time in the corner. The bars and fades are the page's, not the canvas's, so they are not in it */
window.__introSheet = (ts, cols = 3) => {
  let cv = document.getElementById('__st'); if (!cv) { cv = document.createElement('canvas'); cv.id = '__st'; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:9999;background:#000'; document.body.appendChild(cv); }
  const W = innerWidth, H = innerHeight, n = ts.length, rows = Math.ceil(n / cols), tw = W / cols, th = H / rows, gl = renderer.domElement, sw = Math.min(gl.width, gl.height * tw / th), shh = sw * th / tw; cv.width = W; cv.height = H; cv.style.display = ''; const g = cv.getContext('2d'); g.font = '13px Menlo'; g.fillStyle = '#ffb21a';
  ts.forEach((t, i) => { __intro(t); POST.draw(POST.scene, POST.camera, POST.strength); g.drawImage(gl, (gl.width - sw) / 2, (gl.height - shh) / 2, sw, shh, (i % cols) * tw, Math.floor(i / cols) * th, tw, th); g.fillText(t + ' s' + (INTROV.blk > .02 ? '  (black ' + INTROV.blk.toFixed(2) + ')' : ''), (i % cols) * tw + 8, Math.floor(i / cols) * th + 18); });
  introEnd(); return __errs;
};

