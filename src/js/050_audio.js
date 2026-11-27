/* ============ AUDIO (tiny procedural synth) ============ */
const sfx = (() => {
  let ac, master, on = true, nb, trimK = 1, hushed = false;
  function init() { if (ac) { if (ac.state === 'suspended') { const p = ac.resume(); if (p && p.catch) p.catch(() => { }); } return; } try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; } master = ac.createGain(); master.gain.value = .45 * CFG.vol * CFG.sfx; master.connect(ac.destination); nb = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; music.boot(ac); vox.boot(ac); sndWait(ac); }
  function tone(type, f0, f1, dur, vol, delay = 0) { const t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(g).connect(master); o.start(t); o.stop(t + dur + .03); }
  function noise(dur, vol, f0, f1, q = 1, delay = 0) { const t = ac.currentTime + delay, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = nb; s.loop = true; f.type = 'bandpass'; f.Q.value = q; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); s.connect(f).connect(g).connect(master); s.start(t, rand(.5)); s.stop(t + dur + .03); }
  const lib = {
    step: v => { noise(.25, .5 * v, 140, 40, .7); tone('sine', 70, 30, .3, .55 * v); },
    clang: () => { tone('square', 220, 180, .4, .1); tone('triangle', 523, 500, .7, .14); noise(.2, .4, 2500, 800, 2); },
    servo: () => tone('sawtooth', 90, 240, .7, .05), servoDn: () => tone('sawtooth', 240, 80, .7, .05),
    weld: () => noise(.12, .12, 5000, 3000, 3),
    laser: () => { tone('sawtooth', 1400, 300, .25, .12); tone('sine', 2200, 600, .2, .09); },
    cannon: () => { noise(.09, .32, 900, 200, .8); tone('square', 160, 60, .08, .13); },
    missile: () => noise(.7, .22, 600, 2400, .6),
    plasma: () => { tone('sawtooth', 120, 900, .5, .12); noise(.5, .14, 400, 3000, 2); },
    gauss: () => { tone('sine', 2400, 80, .35, .22); noise(.15, .4, 3000, 300, .5); },
    flak: () => noise(.22, .5, 700, 150, .5),
    boom: v => { noise(.9, .7 * v, 300, 30, .4); tone('sine', 90, 25, .8, .55 * v); },
    hit: () => { noise(.12, .28, 1800, 500, 1.5); tone('square', 300, 120, .1, .07); },
    beam: () => { tone('sawtooth', 900, 860, .13, .045); tone('sine', 1800, 1700, .13, .035); },
    mg: () => { noise(.045, .2, 1600, 500, .9); tone('square', 210, 90, .04, .06); },
    ac: () => { noise(.16, .45, 600, 120, .7); tone('square', 110, 40, .14, .2); },
    flame: () => noise(.22, .13, 500, 1400, .4), swing: () => noise(.22, .16, 300, 1200, .8),
    punch: v => { noise(.2, .6 * v, 260, 50, .6); tone('sine', 95, 35, .25, .5 * v); tone('square', 700, 200, .07, .08 * v); },
    saw: () => { tone('sawtooth', 520, 470, .12, .05); noise(.1, .1, 3800, 2600, 3); },
    zap: () => { noise(.18, .3, 4200, 1200, 1.2); tone('square', 1900, 240, .16, .08); tone('square', 2600, 400, .12, .05, .04); },
    ion: () => { tone('sine', 300, 1500, .28, .16); tone('sawtooth', 2400, 300, .3, .06); noise(.25, .14, 2500, 600, 1.5); },
    mortar: () => { noise(.3, .4, 220, 60, .6); tone('sine', 130, 50, .3, .35); },
    scream: v => { tone('sawtooth', 900, 1700, .5, .07 * v); tone('square', 1350, 2500, .5, .03 * v); },
    shield: v => { tone('sine', 1300, 900, .14, .06 * v); tone('triangle', 2100, 1500, .1, .03 * v); },
    alarm: () => { for (let i = 0; i < 5; i++) { tone('square', 620, 620, .22, .05, i * .5); tone('square', 470, 470, .22, .05, i * .5 + .25); } },
    ui: () => tone('square', 880, 1320, .05, .04), deny: () => tone('square', 200, 140, .15, .07),
    jet: () => noise(.25, .16, 300, 900, .5), steam: () => noise(.8, .12, 4000, 1500, .7),
    door: () => { noise(3, .16, 90, 60, 1); tone('sawtooth', 45, 55, 3, .09); },
    crunch: (v = 1) => { noise(.34, .6 * v, 1100, 140, .9); noise(.12, .3 * v, 3400, 900, 1.4, .03); tone('sine', 82, 30, .32, .5 * v); tone('square', 240, 70, .1, .07 * v); },
    crack: v => noise(.18, .4 * v, 1800, 300, .6), ship: () => { noise(5, .22, 70, 160, .5); tone('sawtooth', 38, 60, 5, .07); },
    comm: () => { tone('square', 1200, 1200, .05, .04); tone('square', 1600, 1600, .06, .04, .07); }, ok: () => { tone('triangle', 660, 660, .1, .1); tone('triangle', 990, 990, .22, .1, .1); },
    glass: (v = 1) => { tone('sine', 2300 + rand(700), 2250, .22, .03 * v); tone('sine', 3700 + rand(500), 3600, .15, .016 * v, .012); noise(.03, .07 * v, 5200, 3000, 2); }, gulp: (v = 1) => { tone('sine', 190, 85, .11, .16 * v); tone('sine', 170, 80, .11, .16 * v, .2); }, thud: (v = 1) => { noise(.14, .45 * v, 220, 60, .7); tone('sine', 110, 45, .22, .35 * v); },
  };
  const gap = { mg: .055, beam: .1, flame: .13, saw: .1, hit: .04, crunch: .06, shield: .12, cannon: .05, laser: .05, zap: .08 }, last = {};
  return { init, play(n, v = 1) { if (!on || !ac || hushed) return; if (ac.state === 'suspended') ac.resume(); const g = gap[n]; if (g) { if (ac.currentTime - (last[n] || -1) < g) return; last[n] = ac.currentTime; } lib[n] && lib[n](v); }, vol() { if (master) master.gain.setTargetAtTime(.45 * CFG.vol * CFG.sfx * trimK, ac.currentTime, .05); },
    /* for the opening: trim(k) turns the whole bus down under the score (1 puts it back), hush(true) drops every sound asked for while a cut is run forward out of sight */
    trim(k) { trimK = k; this.vol(); }, hush(b) { hushed = !!b; } };
})();
/* ---- sound from the moment the page opens. The audio is built as the page loads instead of on the first click: where the browser lets a page play unasked (the site has been allowed to, or
   is trusted), the radio is on before anything has been touched. Where it does not, the engine waits suspended, the first click, tap or key anywhere wakes it, and until then a small notice
   says why the bay is quiet ---- */
function sndWait(ac) {
  const el = $('sndHint'), set = () => el.classList.toggle('on', ac.state !== 'running' && CFG.vol > 0); ac.addEventListener('statechange', set);
  setTimeout(set, 1300);   /* even a context that is allowed to run starts out suspended for a moment */
}
for (const k of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown', 'keyup']) addEventListener(k, () => sfx.init(), true);   /* any of these may be the one the browser counts */

