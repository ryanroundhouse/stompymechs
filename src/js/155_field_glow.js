/* ============ FIELD: WEAPON LIGHT, GLOW, SCORCH AND SHOCK ============ */
/* Everything that glows out there is drawn with one small shader: a shape that is brightest where it faces the camera and fades to nothing at its edge, so a tube reads as a beam
   and a ball as a ball of light, with a white-hot middle (`core`). `rim` turns it inside out, for a blast wave: nothing in the middle and a bright edge.
   The materials are kept (one per colour) and never disposed: a material made and thrown away for every shot had its shader built again whenever the last one had gone */
const GLOWM = new Map();
function glowM(hex, k = 6, core = .5, soft = 1.6, rim = 0) {
  const key = hex + ':' + k + ':' + core + ':' + soft + ':' + rim; let m = GLOWM.get(key); if (m) return m;
  m = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { col: { value: new THREE.Color(hex).multiplyScalar(k) }, core: { value: core }, soft: { value: soft }, rim: { value: rim }, fade: { value: 1 } },
    vertexShader: `varying vec3 vN,vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalMatrix*normal;vV=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform vec3 col;uniform float core,soft,rim,fade;varying vec3 vN,vV;void main(){float f=abs(dot(normalize(vN),normalize(vV)));float a=mix(pow(f,soft),pow(1.-f,2.4),rim);gl_FragColor=vec4((col*a*.5+vec3(dot(col,vec3(.33)))*core*pow(f,6.)*(1.-rim))*fade,1.);}`
  });
  m.userData.keep = true; GLOWM.set(key, m); return m;
}
{ const g = new THREE.CylinderGeometry(.5, .5, 1, 10, 1, true); g.rotateX(PI / 2); GEO.tube = g; GEO.ball = new THREE.SphereGeometry(1, 16, 10); const d = new THREE.CircleGeometry(1, 40); d.rotateX(-PI / 2); GEO.disc = d; const q = new THREE.PlaneGeometry(2, 2); q.rotateX(-PI / 2); GEO.flat = q; }

/* ---- light from a shot, a hit or a blast. Six lamps that are always in the scene (a light that came and went would have every shader out there built again), each lent to
   whatever is brightest at the moment. A flash close to one already burning joins it, so a salvo is one light and a round in flight carries its light along ---- */
const GLOWL = { L: [], on: true };
for (let i = 0; i < 6; i++) { const l = new THREE.PointLight(0xffffff, 0, 80, 1.2); FD.scene.add(l); GLOWL.L.push({ l, t: 0, life: 1, pow: 0 }); }
function flashAt(p, hex, pow, dist = 70, life = .14) {
  if (!GLOWL.on) return; let best = null, low = 1e9;
  for (const s of GLOWL.L) { const now = s.t > 0 ? s.pow * (s.t / s.life) : 0; if (now > 0 && s.l.position.distanceToSquared(p) < 64) { if (pow < now) return; best = s; low = -1; break; } if (now < low) { low = now; best = s; } }
  if (low >= pow) return;
  best.l.position.copy(p); best.l.color.setHex(hex); best.l.distance = dist; best.pow = pow; best.t = best.life = life; best.l.intensity = pow;
}
const glowLights = on => { GLOWL.on = on; for (const s of GLOWL.L) { s.l.visible = on; s.t = 0; s.l.intensity = 0; } };

/* ---- what a blast leaves on the ground: a scorch that stays, and over it a glow that cools. Both are flat patches laid to the slope, drawn as two instanced meshes ---- */
const SCAR = { n: 0, max: 72, hot: [], m: null, g: null };
{
  const dark = labelTex(128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62); gr.addColorStop(0, 'rgba(8,6,5,.92)'); gr.addColorStop(.45, 'rgba(10,8,6,.7)'); gr.addColorStop(1, 'rgba(12,9,7,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 46; i++) { const a = rand(TAU), r = rand(18, 54), s = rand(3, 11); const q = g.createRadialGradient(64 + Math.cos(a) * r, 64 + Math.sin(a) * r, 0, 64 + Math.cos(a) * r, 64 + Math.sin(a) * r, s); q.addColorStop(0, `rgba(6,5,4,${rand(.25, .6)})`); q.addColorStop(1, 'rgba(6,5,4,0)'); g.fillStyle = q; g.fillRect(0, 0, w, h); }
    g.strokeStyle = 'rgba(4,3,3,.5)'; for (let i = 0; i < 22; i++) { const a = rand(TAU), r0 = rand(10, 26), r1 = rand(36, 62); g.lineWidth = rand(.6, 2.2); g.beginPath(); g.moveTo(64 + Math.cos(a) * r0, 64 + Math.sin(a) * r0); g.lineTo(64 + Math.cos(a + rand(-.08, .08)) * r1, 64 + Math.sin(a + rand(-.08, .08)) * r1); g.stroke(); }
  });
  const glow = labelTex(64, 64, (g, w, h) => { g.clearRect(0, 0, w, h); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 31); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const mk = mat => { const m = new THREE.InstancedMesh(GEO.flat, mat, SCAR.max); m.count = 0; m.frustumCulled = false; m.renderOrder = 2; m.setColorAt(0, _c1.setRGB(1, 1, 1)); FD.scene.add(m); return m; };
  SCAR.m = mk(new THREE.MeshBasicMaterial({ map: dark, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }));
  SCAR.g = mk(new THREE.MeshBasicMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })); SCAR.g.renderOrder = 3;
}
const _sn = V3(), _sq = new THREE.Quaternion(), _sq2 = new THREE.Quaternion(), _sm = new THREE.Matrix4();
/* the ground under a point and which way it faces; null over water, lava or a roof, or too far above it for a blast of that size to mark */
function groundAt(p, r) { const g = heightAt(p.x, p.z); if (p.y - g > r * .7 + 1.5 || (EV.wl != null && g < EV.wl + .2) || floorAt(_sn.set(p.x, p.y + 2, p.z)) > g + .5) return null; _sn.set(heightAt(p.x - 1.5, p.z) - heightAt(p.x + 1.5, p.z), 3, heightAt(p.x, p.z - 1.5) - heightAt(p.x, p.z + 1.5)).normalize(); return g; }
function scarAt(p, r, heat = 1) {
  const g = groundAt(p, r); if (g === null) return; const i = SCAR.n++ % SCAR.max, n = Math.min(SCAR.n, SCAR.max);
  _sq.setFromUnitVectors(_Y, _sn).multiply(_sq2.setFromAxisAngle(_Y, rand(TAU))); _sm.compose(_v.set(p.x, g + .1 + r * .012, p.z).addScaledVector(_sn, .05), _sq, _s3.set(r, 1, r));
  SCAR.m.setMatrixAt(i, _sm); SCAR.m.setColorAt(i, _c1.setRGB(1, 1, 1)); SCAR.m.count = n; SCAR.m.instanceMatrix.needsUpdate = SCAR.m.instanceColor.needsUpdate = true;
  _sm.compose(_v, _sq, _s3.set(r * .62, 1, r * .62)); SCAR.g.setMatrixAt(i, _sm); SCAR.g.setColorAt(i, _c1.setRGB(0, 0, 0)); SCAR.g.count = n; SCAR.g.instanceMatrix.needsUpdate = true;
  for (let k = SCAR.hot.length - 1; k >= 0; k--) if (SCAR.hot[k].i === i) SCAR.hot.splice(k, 1);
  if (heat > 0) SCAR.hot.push({ i, t: 1, life: 1.6 + heat * 1.6, k: heat });
}
/* ---- the blast wave: a shell of light that swells and thins, and where there is ground under it a ring running out across that ---- */
const SHOCK = [];
function shockAt(p, s) {
  const add = (geo, mat, r0, r1, life, q) => { const m = new THREE.Mesh(geo, mat.clone()); m.material.userData.keep = false; m.position.copy(p); if (q) m.quaternion.copy(q); m.scale.setScalar(r0); m.renderOrder = 4; FD.scene.add(m); SHOCK.push({ m, r0, r1, t: 0, life }); };
  add(GEO.ball, glowM(0xffb060, 2.6, 0, 1, 1), 1.5 * s, 9 * s, .22 + .05 * s);
  const g = groundAt(p, 4 * s); if (g !== null) { _sq.setFromUnitVectors(_Y, _sn); const at = p.y; p.y = g + .35; add(GEO.disc, SHOCK_RING, 2 * s, 17 * s, .4 + .1 * s, _sq); p.y = at; }
}
const SHOCK_RING = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { col: { value: new THREE.Color(0xffc890).multiplyScalar(1.6) }, fade: { value: 1 } },
  vertexShader: `varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader: `uniform vec3 col;uniform float fade;varying vec2 vU;void main(){float r=length(vU-.5)*2.;gl_FragColor=vec4(col*fade*(smoothstep(.55,.94,r)*smoothstep(1.,.96,r)+.12*smoothstep(1.,.2,r)),1.);}`
});

/* ---- a field explosion: explode() calls this for anything that goes off out there. Small ones (a missile, a plasma round) get the flash and a lick of fire;
   from s = 1.2 up (a machine, a shell) there is a fireball, embers, a column of smoke, dust thrown along the ground, a blast wave and a mark left behind ---- */
function fieldBoom(p, s) {
  const S = FD.fx.spark, K = FD.fx.smoke; flashAt(p, 0xffa050, 170 * s ** 1.5, 60 + 50 * s, .3 + .12 * s);
  for (let i = 0; i < 3 + 4 * s; i++) S.emit(p.x + rand(-1, 1) * s, p.y + rand(-.5, 1) * s, p.z + rand(-1, 1) * s, rand(-2, 2) * s, rand(1, 5) * s, rand(-2, 2) * s, rand(.22, .5), rand(2.4, 4.4) * s, 6, 2.5, .55, .85, -2, 1.5, 1.2);
  if (s < 1.2) { if (s > .7 && Math.random() < .6) scarAt(p, 2.2 * s, .5); return; }
  for (let i = 0; i < 7 * s; i++) S.emit(p.x + rand(-1.5, 1.5) * s, p.y + rand(0, 1.5) * s, p.z + rand(-1.5, 1.5) * s, rand(-2.5, 2.5) * s, rand(3, 9) * s, rand(-2.5, 2.5) * s, rand(.5, 1.15), rand(1.6, 3.2) * s, 4.5, 1.3, .22, .8, -3, .9, 1.6);
  for (let i = 0; i < 12 * s; i++) { const a = rand(TAU), v = rand(9, 26) * Math.sqrt(s); S.emit(p.x, p.y, p.z, Math.cos(a) * v, rand(4, 22) * Math.sqrt(s), Math.sin(a) * v, rand(1, 2.3), rand(.16, .34), 5, 2.4, .5, 1, 16, .25); }
  for (let i = 0; i < 6 * s; i++) K.emit(p.x + rand(-2, 2) * s, p.y + rand(0, 2) * s, p.z + rand(-2, 2) * s, rand(-1.4, 1.4), rand(2.5, 6), rand(-1.4, 1.4), rand(2.6, 5), rand(3, 5) * s, .09, .085, .08, .55, -.25, .35, 2.4);
  const g = groundAt(p, 4 * s);
  if (g !== null) { const c = EV.B.pal[0]; for (let i = 0; i < 9 * s; i++) { const a = rand(TAU), v = rand(7, 15) * Math.sqrt(s); K.emit(p.x + Math.cos(a) * s, g + .6, p.z + Math.sin(a) * s, Math.cos(a) * v, rand(.4, 2.2), Math.sin(a) * v, rand(1.2, 2.4), rand(2.2, 3.8) * s, c[0] * .9 + .1, c[1] * .9 + .1, c[2] * .9 + .1, .3, -.1, 1.6, 2.6); } }
  shockAt(p, s); scarAt(p, 3.1 * s, 1);
}
/* what leaves a muzzle with the round: a flare the colour of the weapon, a jet of sparks down the line of fire, and its light */
function muzzleAt(O, D, hex, pow, big = 1) {
  const c = _c1.setHex(hex), S = FD.fx.spark; S.emit(O.x + D.x * .6, O.y + D.y * .6, O.z + D.z * .6, D.x * 4, D.y * 4, D.z * 4, rand(.05, .09), rand(1.5, 2.3) * big, c.r * 5 + 1.4, c.g * 5 + 1.4, c.b * 5 + 1.4, .9, 0, 0, .8);
  for (let i = 0; i < 3; i++) { const v = rand(14, 34); S.emit(O.x, O.y, O.z, (D.x + rand(-.14, .14)) * v, (D.y + rand(-.14, .14)) * v, (D.z + rand(-.14, .14)) * v, rand(.08, .2), rand(.16, .32) * big, c.r * 4 + 1, c.g * 4 + 1, c.b * 4 + 1, 1, 4, 2); }
  flashAt(_p.copy(O).addScaledVector(D, 2), hex, pow, 60, .1);
}
function glowTick(dt) {
  for (const s of GLOWL.L) { if (s.t <= 0) continue; s.t -= dt; s.l.intensity = s.t > 0 ? s.pow * (s.t / s.life) ** 1.4 : 0; }
  if (SCAR.hot.length) { for (let k = SCAR.hot.length - 1; k >= 0; k--) { const h = SCAR.hot[k]; h.t -= dt / h.life; const v = Math.max(0, h.t) ** 2.2 * h.k; SCAR.g.setColorAt(h.i, _c1.setRGB(5.5 * v, 1.9 * v * v + .5 * v, .28 * v * v)); if (h.t <= 0) SCAR.hot.splice(k, 1); } SCAR.g.instanceColor.needsUpdate = true; }
  for (let k = SHOCK.length - 1; k >= 0; k--) { const w = SHOCK[k]; w.t += dt / w.life; const u = Math.min(1, w.t), e = 1 - (1 - u) ** 2.4; w.m.scale.setScalar(lerp(w.r0, w.r1, e)); w.m.material.uniforms.fade.value = (1 - u) ** 1.6; if (u >= 1) { FD.scene.remove(w.m); w.m.material.dispose(); SHOCK.splice(k, 1); } }
}
function glowClear() {
  for (const s of GLOWL.L) { s.t = 0; s.l.intensity = 0; } for (const w of SHOCK) { FD.scene.remove(w.m); w.m.material.dispose(); } SHOCK.length = 0;
  SCAR.n = 0; SCAR.hot.length = 0; SCAR.m.count = SCAR.g.count = 0;
}
