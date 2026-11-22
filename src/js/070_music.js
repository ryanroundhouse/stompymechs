/* ============ MUSIC: GENERATIVE SCORE — A THEME AND AMBIENCE ON THE COMMAND DECK, A SMALL RADIO IN THE BAY AND A JUKEBOX IN THE BAR, SEVEN SCORES FOR THE FIELD (PATROL AND COMBAT), A JINGLE FOR A CONTRACT WON ============ */
/* everything is synthesised and composed at run time from a seed; nothing is sampled or quoted */
function makeScore(ac, dest, seed) {
  const R = mulberry(seed), rr = (a, b) => a + R() * (b - a), rp = a => a[(R() * a.length) | 0], hz = m => 440 * 2 ** ((m - 69) / 12), SR = ac.sampleRate;
  const gain = (v, to) => { const g = ac.createGain(); g.gain.value = v; if (to) g.connect(to); return g; };
  const filt = (type, f, q, to, db) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q) b.Q.value = q; if (db) b.gain.value = db; if (to) b.connect(to); return b; };
  const osc = (type, f, t0, t1, to, det) => { const o = ac.createOscillator(); o.type = type; o.frequency.value = f; if (det) o.detune.value = det; o.connect(to); o.start(t0); if (t1) o.stop(t1); return o; };
  const shaper = (k, asym = 0) => { const w = ac.createWaveShaper(), c = new Float32Array(1024), o = Math.tanh(k * asym); for (let i = 0; i < 1024; i++) c[i] = Math.tanh(k * (i / 511.5 - 1 + asym)) - o; w.curve = c; return w; };
  const nbuf = ac.createBuffer(1, SR * 2, SR); { const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
  const noise = (t0, t1, to) => { const s = ac.createBufferSource(); s.buffer = nbuf; s.loop = true; s.connect(to); s.start(t0, R() * 1.5); if (t1) s.stop(t1); return s; };
  const verb = (len, tau, dampK) => { const n = SR * len | 0, b = ac.createBuffer(2, n, SR); for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let lp = 0; for (let i = 0; i < n; i++) { const t = i / SR, k = Math.min(.96, dampK * t / len); lp = lp * k + (R() * 2 - 1) * (1 - k); d[i] = lp * Math.exp(-t / tau) * Math.min(1, i / 300); } } const cv = ac.createConvolver(); cv.buffer = b; return cv; };
  const hit = (to, t, v, d) => { const g = gain(0, to); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0008, t + d); return g; };

  /* ---------- command deck: slow minor pads over a D pedal, glassy notes, a distant pulse ---------- */
  const amb = (() => {
    const out = gain(0, dest), rev = verb(5.5, 1.5, 1.7), dry = gain(.5, out), send = gain(.9, rev); rev.connect(gain(.6, out));
    const padF = filt('lowpass', 900, .7); padF.connect(dry); padF.connect(send);
    const bells = gain(1), dl = ac.createDelay(1.5), fb = gain(.42); dl.delayTime.value = .61; bells.connect(gain(.55, dry)); bells.connect(send); bells.connect(dl); dl.connect(filt('lowpass', 1900, .5, fb)); fb.connect(dl); dl.connect(gain(.5, send)); dl.connect(gain(.3, dry));
    const dr = gain(.07, dry); dr.connect(gain(.35, send)); osc('sine', hz(38), 0, 0, dr); osc('sine', hz(50), 0, 0, gain(.55, dr)); osc('sine', hz(45), 0, 0, gain(.3, dr)); osc('sawtooth', hz(38), 0, 0, filt('lowpass', 170, .7, gain(.4, dr)), 4); osc('sine', .06, 0, 0, gain(.025, dr.gain));
    const air = gain(.011, out); noise(0, 0, filt('bandpass', 280, .45, air)); osc('sine', .045, 0, 0, gain(.005, air.gain));
    const CH = { Dm: [50, 57, 60, 64, 65], Bb: [46, 53, 57, 60, 62], Gm: [43, 50, 53, 58, 60], Am: [45, 52, 55, 60, 62], F: [41, 48, 52, 55, 57], C: [48, 52, 55, 57, 62] }, NEXT_ = { Dm: ['Bb', 'Gm', 'F', 'Am'], Bb: ['Gm', 'F', 'Dm', 'C'], Gm: ['Dm', 'Am', 'Bb'], Am: ['Dm', 'F', 'Bb'], F: ['C', 'Dm', 'Bb'], C: ['Dm', 'Am'] }, SC = [62, 65, 67, 69, 72, 74, 76, 77, 79, 81, 84];
    let cur = 'Dm', tc = 0, tb = 0, tp = 0, li = 4;
    const pad = (t, ns, d) => { const g = gain(0, padF), end = t + d + 8; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.085, t + 5); g.gain.setValueAtTime(.085, t + d); g.gain.linearRampToValueAtTime(0, t + d + 7.5); for (const m of ns) { osc('sawtooth', hz(m), t, end, g, -8); osc('sawtooth', hz(m), t, end, g, 8); } const sh = gain(0, send); sh.gain.setValueAtTime(0, t); sh.gain.linearRampToValueAtTime(.022, t + 6); sh.gain.setValueAtTime(.022, t + d); sh.gain.linearRampToValueAtTime(0, t + d + 6); osc('triangle', hz(rp(ns) + 24), t, end, sh); padF.frequency.setTargetAtTime(rr(620, 1500), t, 5); };
    const bell = (t, m, v) => { const f = hz(m), p = ac.createStereoPanner(); p.pan.value = rr(-.7, .7); p.connect(bells); const g = gain(0, p); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .012); g.gain.setTargetAtTime(0, t + .012, rr(.8, 1.4)); osc('sine', f, t, t + 8, g); const g2 = gain(0, p); g2.gain.setValueAtTime(v * .28, t); g2.gain.setTargetAtTime(0, t, .2); osc('sine', f * 2.756, t, t + 1.6, g2); const g3 = gain(0, p); g3.gain.setValueAtTime(v * .2, t); g3.gain.setTargetAtTime(0, t, .5); osc('sine', f * 2, t, t + 3.5, g3); };
    return {
      out, start(t) { tc = t; tb = t + 4; tp = t + 11; },
      shift(d) { tc += d; tb += d; tp += d; }, next: () => Math.min(tc, tb, tp),
      tick(until) {
        while (tc < until) { const d = rr(13, 20); pad(tc, CH[cur], d); tc += d; cur = rp(NEXT_[cur]); }
        while (tb < until) { const pc = CH[cur].map(m => m % 12), ok = SC.map((m, i) => pc.includes(m % 12) || m % 12 === 2 || m % 12 === 9 ? i : -1).filter(i => i >= 0), n = R() < .42 ? 2 + (R() * 3 | 0) : 1; let t = tb; for (let i = 0; i < n; i++) { const near = ok.filter(x => Math.abs(x - li) <= 3 && x !== li); li = rp(near.length ? near : ok); bell(t, SC[li], rr(.085, .14) * (1 - i * .12)); t += rr(.3, .62); } tb = t + rr(2.2, 6.5); }
        while (tp < until) { const g = hit(dry, tp, .2, 3.2); g.connect(send); const o = osc('sine', 62, tp, tp + 3.4, g); o.frequency.setValueAtTime(62, tp); o.frequency.exponentialRampToValueAtTime(39, tp + 1.3); tp += rr(17, 32); }
      },
    };
  })();

  /* ---------- mech bay and bar: a rock band nobody has heard of — through the small set on the control desk, or at full width from the jukebox ---------- */
  const radio = (() => {
    const out = gain(0, dest), pan = ac.createStereoPanner(), dist = gain(1, pan), hall = verb(2.8, .75, 1.2); pan.connect(out); dist.connect(hall); hall.connect(gain(.28, out));
    /* the set: small-speaker band, an overdriven output stage, a trace of wow, a little static and crackle, mains hum. It is worn, not broken: the level holds */
    const set = gain(.4, dist), post = filt('lowpass', 3600, .5, set), wob = ac.createDelay(.1), lp = filt('lowpass', 2700, .7, wob), sh = shaper(3.2, .22), pk = filt('peaking', 1150, 1.1, sh, 8), hp = filt('highpass', 340, .8, pk), mix = gain(1.5, hp); sh.connect(lp); wob.connect(post); wob.delayTime.value = .02;
    /* the jukebox: the same band without the little speaker in the way — a soft limiter, the top rolled off, the bottom end kept in check */
    const juke = gain(0, dist), jsh = shaper(1.2); jsh.connect(filt('lowpass', 6800, .5, juke)); mix.connect(filt('lowshelf', 150, 0, jsh, -3));
    for (const [f, d] of [[.37, .0005], [.11, .0005]]) osc('sine', f, 0, 0, gain(d, wob.delayTime));
    const stat = gain(.03, post); noise(0, 0, filt('bandpass', 2300, .5, stat));
    const cb = ac.createBuffer(1, SR * 4, SR); { const d = cb.getChannelData(0); for (let i = 0; i < 70; i++) { let p = R() * (d.length - 60) | 0, a = (R() < .5 ? -1 : 1) * rr(.2, 1) * (R() < .12 ? 2.2 : 1); for (let j = 0, n = 3 + (R() * 24 | 0); j < n; j++) d[p + j] += a * (1 - j / n) * (R() * .6 + .4); } }
    { const s = ac.createBufferSource(); s.buffer = cb; s.loop = true; s.connect(filt('highpass', 700, .5, gain(.12, post))); s.start(0); }
    osc('sawtooth', 60, 0, 0, filt('lowpass', 420, .5, gain(.03, post)));
    const wh = gain(0, post), who = osc('sine', 1800, 0, 0, wh);
    /* the band */
    const drums = gain(.95, mix), bassB = gain(.55, mix), gPre = gain(1), gOut = gain(.2, mix), lPre = gain(1), lOut = gain(.2, mix), lDl = ac.createDelay(1), orgB = gain(.05, mix);
    { const s = shaper(7), a = filt('lowpass', 3400, .7), b = filt('highpass', 140, .7, gOut); gPre.connect(s); s.connect(a); a.connect(b); }
    { const s = shaper(10), a = filt('peaking', 1500, 1.2, null, 6), b = filt('lowpass', 4200, .7, lOut), f = gain(.28); lPre.connect(s); s.connect(a); a.connect(b); lDl.delayTime.value = .31; b.connect(lDl); lDl.connect(f); f.connect(lDl); lDl.connect(gain(.3, lOut)); }
    const kick = (t, v) => { const o = osc('sine', 230, t, t + .3, hit(drums, t, v * 1.1, .24)); o.frequency.setValueAtTime(230, t); o.frequency.exponentialRampToValueAtTime(52, t + .09); noise(t, t + .03, filt('highpass', 1500, .7, hit(drums, t, v * .35, .02))); };
    const snare = (t, v) => { noise(t, t + .22, filt('bandpass', 2000, .7, hit(drums, t, v * .85, .17))); osc('triangle', 205, t, t + .14, hit(drums, t, v * .45, .1)); };
    const hat = (t, v, open) => noise(t, t + (open ? .3 : .06), filt('bandpass', 3800, 1.1, hit(drums, t, v * .32, open ? .26 : .04)));
    const crash = (t, v) => noise(t, t + 1.6, filt('bandpass', 3100, .4, hit(drums, t, v * .5, 1.5)));
    const tom = (t, f, v) => { const o = osc('sine', f, t, t + .3, hit(drums, t, v, .24)); o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * .6, t + .2); };
    const bass = (t, m, d, v) => { const g = gain(0, bassB), f = filt('lowpass', 1300, 1, g); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .006); g.gain.setTargetAtTime(v * .7, t + .006, .08); g.gain.setTargetAtTime(0, t + d, .02); f.frequency.setValueAtTime(1500, t); f.frequency.setTargetAtTime(600, t, .09); osc('sawtooth', hz(m), t, t + d + .15, f); osc('square', hz(m + 12), t, t + d + .15, gain(.35, f)); };
    const gtr = (t, ms, d, v, mute) => { const g = gain(0, gPre), f = filt('lowpass', mute ? 850 : 5200, .7, g); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * .3, t + .004); if (mute) g.gain.setTargetAtTime(0, t + .01, .045); else { g.gain.setTargetAtTime(v * .22, t + .004, .12); g.gain.setTargetAtTime(0, t + d, .025); } for (const m of ms) for (const det of [-6, 6]) osc('sawtooth', hz(m), t, t + (mute ? .3 : d + .2), f, det); };
    const lead = (t, m, d, v, bend, vib) => {
      const g = gain(0, lPre), f = hz(m), end = t + d + .12, os = [osc('sawtooth', f, t, end, g), osc('square', f, t, end, gain(.5, g))]; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * .3, t + .01); g.gain.setTargetAtTime(v * .24, t + .01, .2); g.gain.setTargetAtTime(0, t + d, .03);
      for (const o of os) if (bend) { o.frequency.setValueAtTime(hz(m - 2), t); o.frequency.exponentialRampToValueAtTime(f, t + Math.min(.14, d * .5)); }
      if (vib && d > .3) { const vg = gain(0); vg.gain.setValueAtTime(0, t + .16); vg.gain.linearRampToValueAtTime(f * .012, t + .4); osc('sine', 5.6, t, end, vg); for (const o of os) vg.connect(o.frequency); }
    };
    const organ = (t, ms, d) => { const g = gain(0, orgB), tr = gain(1, g); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + .03); g.gain.setTargetAtTime(0, t + d, .04); osc('sine', 6.1, t, t + d + .3, gain(.22, tr.gain)); for (const m of ms) { osc('sine', hz(m), t, t + d + .3, tr); osc('sine', hz(m) * 2, t, t + d + .3, gain(.5, tr)); osc('sine', hz(m) * 3, t, t + d + .3, gain(.3, tr)); } };

    /* the songwriter */
    const PA = [[0, 0, 10, 5], [0, 3, 5, 0], [0, 10, 5, 0], [0, 0, 5, 5], [0, 0, 0, 0], [0, 5, 10, 0], [0, 0, 3, 5]], PB = [[5, 0, 5, 7], [8, 10, 0, 0], [5, 10, 0, 0], [0, 7, 10, 5], [3, 10, 5, 0], [5, 5, 0, 7], [8, 3, 10, 0]];
    const GA = ['m.m.X.m.m.m.X.m.', 'X.m.m.X.m.m.X.m.', 'm.m.m.m.X...X.m.', 'X...m.m.X...m.m.', 'X..X..X.m.m.X...'], GB = ['X.......X...X...', 'X...X.x.X...X.x.', 'X.x.X.x.X.x.X.x.', 'X..X..X...X.X...', 'X.....X.X.....x.'];
    const KK = ['x.....x.x.......', 'x.......x.x.....', 'x...x...x...x...', 'x.....x.x.x.....', 'x..x....x.....x.', 'x.x.....x..x....'], RT = [[0, 2, 4, 6, 8, 10, 12, 14], [0, 3, 6, 8, 11, 14], [0, 2, 4, 8, 10, 12], [0, 4, 6, 8, 12, 14], [0, 2, 6, 8, 10, 14]];
    const CELL = [[[0, 2], [2, 2], [4, 6], [12, 2], [14, 2], [16, 10]], [[2, 2], [4, 2], [6, 2], [8, 8], [18, 2], [20, 2], [22, 2], [24, 6]], [[0, 6], [6, 2], [8, 4], [12, 4], [16, 12]], [[0, 2], [2, 2], [4, 2], [6, 2], [8, 2], [10, 2], [12, 4], [16, 8], [26, 2], [28, 4]], [[4, 4], [8, 2], [10, 2], [12, 4], [16, 2], [18, 2], [20, 10]], [[0, 3], [3, 3], [6, 2], [8, 8], [16, 3], [19, 3], [22, 2], [24, 6]]];
    const RUNS = [[[0, 1], [1, 1], [2, 1], [3, 1], [4, 4], [8, 1], [9, 1], [10, 1], [11, 1], [12, 4], [16, 12]], [[0, 2], [2, 1], [3, 1], [4, 2], [6, 2], [8, 6], [16, 2], [18, 1], [19, 1], [20, 2], [22, 2], [24, 8]]], FILL = [[[20, 2], [22, 2], [24, 6]], [[18, 2], [20, 2], [22, 2], [24, 8]], [[24, 2], [26, 2], [28, 4]]];
    const even = p => p.every(e => !((Array.isArray(e) ? e[0] : e) & 1)), evenS = s => [...s].every((c, i) => c === '.' || !(i & 1));
    function newSong(t0) {
      const sw = R() < .3, bpm = sw ? rr(100, 122) : rr(108, 134), key = rp([40, 45, 43, 38, 47, 42, 41]), ok = L => sw ? L.filter(p => typeof p === 'string' ? evenS(p) : even(p)) : L;
      const S = { t0, sd: 15 / bpm, sw, key, bpm, step: 0, ga: rp(ok(GA)), gb: rp(ok(GB)), ka: rp(ok(KK)), kb: rp(ok(KK)), riff: null, sec: [] }, A = rp(PA), B = rp(PB), scale = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24].map(d => key + 24 + d);
      if (R() < .55) { const T = rp(ok(RT)), ped = R() < .5; let d = 0; S.riff = T.map((s, i) => { d = i === 0 ? 0 : ped ? (i & 1 ? rp([3, 5, 7, 10]) : 0) : clamp(d + rp([-5, -2, 3, 5, -3, 2]), -5, 12); if (!ped && ![-5, -2, 0, 3, 5, 7, 10, 12].includes(d)) d = 0; return [s, (T[i + 1] ?? 16) - s, d]; }); }
      const tones = off => { const r = (key + off) % 12, c = scale.map((m, i) => [r, (r + 7) % 12, (r + 4) % 12].includes(m % 12) ? i : -1).filter(i => i >= 0); return c.length ? c : [0, 5, 10]; };
      const walk = c => c.map(() => rp([-2, -1, -1, 1, 1, 1, 2, 0]));
      let bar = 0; for (const [n, len, pr] of [['intro', 4, A], ['A', 8, A], ['B', 8, B], ['A', 8, A], ['solo', 8, R() < .5 ? A : B], ['B', 8, B], ['out', 2, [0, 0]]]) {
        const sec = { n, bar, len, pr, lead: [] }, hi = n === 'solo', cells = ok(hi ? [...CELL, ...RUNS] : CELL); let i = hi ? 6 : 4;
        const put = (ph, c, w) => c.forEach(([s, d], k) => { const off = pr[(ph * 2 + (s >> 4)) % pr.length]; i = clamp(i + w[k], hi ? 3 : 0, hi ? 10 : 8); if (d >= 4 || k === c.length - 1) { const T = tones(off); i = T.reduce((b, x) => Math.abs(x - i) < Math.abs(b - i) ? x : b, T[0]); } sec.lead.push({ s: ph * 32 + s, d, m: scale[i], bend: d >= 3 && R() < .4, vib: d >= 4 }); });
        if (n === 'B' || n === 'solo') { const c1 = rp(cells), w1 = walk(c1), c2 = rp(cells), w2 = walk(c2); for (let ph = 0; ph < 4; ph++) { if (ph === 2) i = clamp(i + 2, 0, 10); ph & 1 ? put(ph, c2, ph === 3 || hi ? walk(c2) : w2) : put(ph, c1, hi && ph ? walk(c1) : w1); } }
        else if (n === 'A') for (const ph of [1, 3]) { const c = rp(FILL); put(ph, c, walk(c)); }
        else if (n === 'out') sec.lead.push({ s: 16, d: 14, m: key + 36, bend: true, vib: true });
        S.sec.push(sec); bar += len;
      }
      S.bars = bar; return S;
    }
    function play(S, n, t) {
      const bar = n >> 4, s = n & 15, sec = S.sec.find(x => bar >= x.bar && bar < x.bar + x.len); if (!sec) return;
      const b = bar - sec.bar, off = sec.pr[b % sec.pr.length], root = S.key + (off >= 8 ? off - 12 : off), nm = sec.n, last = b === sec.len - 1, sd = S.sd, hu = () => (R() - .5) * .009, vv = () => .82 + R() * .3, cho = nm === 'B' || nm === 'solo', full = nm !== 'intro' || b >= 2, end = nm === 'out' && b === 1;
      if (end) { if (s === 0) { kick(t, 1); crash(t, 1); gtr(t, [root, root + 7, root + 12], 13 * sd, 1); bass(t, root - 12, 12 * sd, 1); } }
      else {
        if (full) {
          const fill = last && s >= 8 && nm !== 'out';
          if (fill) { if (!S.sw || !(s & 1)) s < 12 ? snare(t + hu(), .55 + s * .035) : tom(t + hu(), s < 14 ? 190 : 140, .9); if (s === 8) kick(t, 1); }
          else { if ((cho ? S.kb : S.ka)[s] === 'x') kick(t + hu(), vv()); if (s === 4 || s === 12) snare(t + hu(), vv()); }
          if (!(s & 1)) hat(t + hu(), (s & 3 ? .5 : .9) * vv(), cho && s === 14); if (s === 0 && b % 4 === 0) crash(t, b ? .55 : 1);
        } else if (!(s & 3)) hat(t, .7);
        const riffy = S.riff && !cho && !(last && s >= 8);
        if (riffy) { for (const r of S.riff) if (r[0] === s) { gtr(t + hu(), [root + r[2], root + r[2] + 12], r[1] * sd * .88, .85); if (full) bass(t, root - 12 + r[2], r[1] * sd * .85, .9); } }
        else {
          const P = cho ? S.gb : S.ga, c = P[s];
          if (c === 'X') { let d = 1; while (s + d < 16 && P[s + d] === '.') d++; gtr(t + hu(), [root, root + 7, root + 12], d * sd * .95, vv()); } else if (c === 'x') gtr(t + hu(), [root, root + 7, root + 12], sd * 1.3, .8); else if (c === 'm') gtr(t + hu(), [root, root + 7], sd, .8, true);
          if (full && !(s & 1) && (cho ? 'x.....x.x...x.x.' : 'x.x.x.x.x.x.x.x.')[s] === 'x') bass(t, root - 12 + (s === 14 && R() < .5 ? 7 : 0), sd * 1.7, s & 3 ? .75 : 1);
        }
        if (cho && s === 0) organ(t, [root + 12, root + 19, root + 24], 15.5 * sd);
      }
      for (const e of sec.lead) if (e.s === b * 16 + s) lead(t, e.m, e.d * sd * .94, .9, e.bend, e.vib);
    }
    let S = null, tN = 0;
    return {
      out, pan, dist, get song() { return S; }, start(t) { tN = t + .4; },
      /* 0: the set on the control desk · 1: the jukebox in the bar, the same band at full width */
      voice(k, t, tau = .3) { set.gain.setTargetAtTime(.4 * (1 - k), t, tau); juke.gain.setTargetAtTime(.56 * k, t, tau); },
      shift(d) { tN += d; if (S) S.t0 += d; }, next: () => S ? S.t0 + S.step * S.sd : tN,
      beat(now) { return S && now >= S.t0 && S.step < S.bars * 16 ? ((now - S.t0) / (S.sd * 4)) % 1 : -1; },
      /* the level never moves on its own: no dropouts, no fades. The only break is the gap between two songs */
      tick(until) {
        for (let guard = 0; guard < 4000; guard++) {
          if (!S) { if (tN > until) break; S = newSong(tN); }
          const t = S.t0 + S.step * S.sd; if (t > until) break;
          if (S.step >= S.bars * 16) {   /* between songs the station drifts for a moment: a breath of static, a whistle sliding past, then the next number */
            const d = rr(1.5, 2.4), a = t + .9; stat.gain.setValueAtTime(.03, a); stat.gain.linearRampToValueAtTime(.14, a + .4); stat.gain.setValueAtTime(.14, a + d - .4); stat.gain.linearRampToValueAtTime(.03, a + d);
            wh.gain.setValueAtTime(0, a + .3); wh.gain.linearRampToValueAtTime(.05, a + .6); wh.gain.linearRampToValueAtTime(0, a + d - .2); who.frequency.setValueAtTime(rr(1400, 3000), a + .3); who.frequency.exponentialRampToValueAtTime(rr(350, 1200), a + d - .2);
            tN = a + d + .2; S = null; continue;
          }
          play(S, S.step, t + (S.sw && (S.step & 3) === 2 ? S.sd * .667 : 0)); S.step++;
        }
      },
    };
  })();
  /* ---------- the instrument kit, shared by the mission scores, the deck theme and the jingle. Every voice takes the bus it plays into ---------- */
  const KIT = (() => {
    const env = (to, t, a, v, d, rel) => { const g = gain(0, to); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.setTargetAtTime(0, t + a + d, rel); return g; };
    const kick = (B, t, v, f = 150, lo = 44, d = .28) => { const o = osc('sine', f, t, t + d + .05, hit(B, t, v, d)); o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(lo, t + .09); };
    const nz = (B, t, v, d, type, f, q = .7) => noise(t, t + d + .03, filt(type, f, q, hit(B, t, v, d)));
    const drum = (B, t, f, v, d = .26) => { const o = osc('sine', f * 1.3, t, t + d + .05, hit(B, t, v, d)); o.frequency.setValueAtTime(f * 1.3, t); o.frequency.exponentialRampToValueAtTime(f * .78, t + d * .8); };
    const snr = (B, t, v, f = 1900, d = .2) => { nz(B, t, v * .8, d, 'bandpass', f, .6); osc('triangle', 190, t, t + .13, hit(B, t, v * .4, .1)); };
    const note = (B, t, m, d, v, type = 'triangle', cut = 2400, a = .006, rel = .06) => { const f = filt('lowpass', cut, .8, env(B, t, a, v, d, rel)); osc(type, hz(m), t, t + a + d + rel * 6 + .05, f); return f; };
    const pluck = (B, t, m, v, type = 'sawtooth', cut = 3000, dec = .2) => { const f = filt('lowpass', cut, 1.4, hit(B, t, v, dec * 2.4)); f.frequency.setValueAtTime(cut, t); f.frequency.exponentialRampToValueAtTime(Math.max(180, cut * .16), t + dec); osc(type, hz(m), t, t + dec * 2.5, f); };
    const pad = (B, t, ms, d, v, type = 'sawtooth', cut = 1200, a = 1.2) => { const g = gain(0, B), f = filt('lowpass', cut, .6, g), e = t + d + a + .05; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.setValueAtTime(v, t + d); g.gain.linearRampToValueAtTime(0, t + d + a); for (const m of ms) { osc(type, hz(m), t, e, f, -7); osc(type, hz(m), t, e, f, 7); } };
    const bell = (B, t, m, v, dec = 1.1) => { const f = hz(m); osc('sine', f, t, t + dec * 3, hit(B, t, v, dec * 3)); osc('sine', f * 2.76, t, t + dec, hit(B, t, v * .3, dec * .8)); osc('sine', f * 5.4, t, t + .3, hit(B, t, v * .1, .22)); };
    const wood = (B, t, m, v, dec = .22) => { const f = hz(m); osc('sine', f, t, t + dec + .05, hit(B, t, v, dec)); osc('sine', f * 4, t, t + .06, hit(B, t, v * .35, .05)); };
    const clank = (B, t, v, f = 520) => { for (const k of [1, 1.47, 2.09, 2.83, 3.9]) osc('square', f * k, t, t + .5, hit(B, t, v * .15, .1 + .34 / k)); nz(B, t, v * .5, .07, 'highpass', 3200); };
    const voice = (B, t, m, d, v, type = 'sine', cut = 3200, vib = 5.2) => { const f = filt('lowpass', cut, .7, env(B, t, .05, v, d, .1)), o = osc(type, hz(m), t, t + d + .75, f); if (vib && d > .3) { const vg = gain(0); vg.gain.setValueAtTime(0, t + .14); vg.gain.linearRampToValueAtTime(hz(m) * .007, t + .45); osc('sine', vib, t, t + d + .75, vg); vg.connect(o.frequency); } };
    const swell = (B, t, d, v, f, q = 1) => { const g = gain(0, B), b = filt('bandpass', f, q, g); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + d * .55); g.gain.linearRampToValueAtTime(0, t + d); b.frequency.setValueAtTime(f, t); b.frequency.linearRampToValueAtTime(f * 1.6, t + d); noise(t, t + d + .05, b); };
    /* brass: two saws a few cents apart over a square an octave down, the filter opening with the breath */
    const brass = (B, t, m, d, v, cut = 1900, a = .035) => { const f = filt('lowpass', cut * .3, 1.1, env(B, t, a, v, d, .07)), e = t + a + d + .55; f.frequency.setValueAtTime(cut * .3, t); f.frequency.linearRampToValueAtTime(cut, t + a * 1.6); f.frequency.setTargetAtTime(cut * .62, t + a * 1.6, .18); osc('sawtooth', hz(m), t, e, f, -9); osc('sawtooth', hz(m), t, e, f, 8); osc('square', hz(m - 12), t, e, gain(.22, f)); };
    /* shaker, a low impact, a cymbal */
    const shk = (B, t, v, d = .07, f = 6200) => { const g = gain(0, B); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + d * .35); g.gain.exponentialRampToValueAtTime(.0008, t + d); noise(t, t + d + .03, filt('bandpass', f, 1.2, g)); };
    const boom = (B, t, v, d = 1.4) => { const o = osc('sine', 78, t, t + d + .1, hit(B, t, v, d)); o.frequency.setValueAtTime(78, t); o.frequency.exponentialRampToValueAtTime(31, t + .5); noise(t, t + .5, filt('lowpass', 240, .7, hit(B, t, v * .8, .4))); };
    const crash = (B, t, v, d = 1.5) => { noise(t, t + d + .05, filt('highpass', 4200, .5, hit(B, t, v, d))); noise(t, t + d * .5 + .05, filt('bandpass', 2700, .6, hit(B, t, v * .5, d * .45))); };
    /* a plucked steel string, worked out sample by sample (Karplus-Strong) and kept per pitch; the playback rate trims the tuning and bends the note */
    const strings = {}, nd = nbuf.getChannelData(0).slice();   /* a copy of our own: a view taken from a buffer goes dead in Firefox once the buffer is playing */
    const string = m => {
      if (strings[m]) return strings[m];
      const f = hz(m), L = Math.max(2, Math.round(SR / f - .5)), n = (SR * 2.6) | 0, b = ac.createBuffer(1, n, SR), d = b.getChannelData(0), g = Math.pow(.001, 1 / (f * (m < 50 ? 9 : m < 64 ? 7 : 5.5))), pk = Math.max(1, (L * .17) | 0), o = (m * 977) % 40000;
      let lp = 0, mx = 0; for (let i = 0; i < L; i++) { lp += (nd[o + i] - lp) * .7; d[i] = lp; } for (let i = L - 1; i >= pk; i--) d[i] -= d[i - pk] * .85;   /* the comb is the pick, a sixth of the way along the string */
      for (let i = 0; i < L; i++) mx = Math.max(mx, Math.abs(d[i])); for (let i = 0; i < L; i++) d[i] /= mx || 1; d[L] = g * d[0];
      for (let i = L + 1; i < n; i++) d[i] = g * .5 * (d[i - L] + d[i - L - 1]);
      for (let i = 0; i < 40; i++) d[i] *= i / 40;
      return strings[m] = { b, tune: f * (L + .5) / SR };
    };
    /* o.from: slide in from that many semitones away; o.d: damp the string after so long; o.cut: tone */
    const twang = (B, t, m, v, o = {}) => {
      const k = m - m % 3, S = string(k), r = S.tune * 2 ** ((m - k) / 12), s = ac.createBufferSource(), d = o.d || 2.2, g = gain(0, B); s.buffer = S.b; s.connect(filt('lowpass', o.cut || 4200, .6, g));   /* one string serves three semitones */
      s.playbackRate.setValueAtTime(r * 2 ** ((o.from || 0) / 12), t); if (o.from) s.playbackRate.exponentialRampToValueAtTime(r, t + (o.sl || .13));
      g.gain.setValueAtTime(v, t); g.gain.setTargetAtTime(0, t + d, .14); s.start(t); s.stop(Math.min(t + d + 1, t + 2.5));
    };
    /* one voice carried through a whole phrase, [[midi, steps], ...], sliding from note to note */
    const glide = (B, t, ns, sd, v, type = 'triangle', cut = 2200, port = .05) => {
      const tot = ns.reduce((a, n) => a + n[1], 0) * sd, g = gain(0, B), o = osc(type, hz(ns[0][0]), t, t + tot + 1.2, filt('lowpass', cut, .8, g)), vg = gain(0); let x = t;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .12); g.gain.setTargetAtTime(0, t + tot - .1, .22);
      for (const [m, n] of ns) { if (x === t) o.frequency.setValueAtTime(hz(m), t); else o.frequency.setTargetAtTime(hz(m), x - port, port); x += n * sd; }
      vg.gain.setValueAtTime(0, t + .25); vg.gain.linearRampToValueAtTime(hz(ns[0][0]) * .006, t + .8); osc('sine', 4.7, t, t + tot + 1.2, vg); vg.connect(o.frequency);
    };
    return { env, kick, nz, drum, snr, note, pluck, pad, bell, wood, clank, voice, swell, brass, shk, boom, crash, twang, glide };
  })();
  /* ---------- the field: seven scores, one for each theatre. Each is one song in two arrangements, patrol and combat, and hands over between them on the beat ---------- */
  const field = (() => {
    const { kick, nz, drum, snr, note, pluck, pad, bell, wood, clank, voice, swell, brass, boom, crash } = KIT;
    const out = gain(0, dest), mix = gain(.9, out), rev = verb(3.6, 1.05, 1.5), echo = ac.createDelay(2), efb = gain(.36), eIn = gain(1, echo); rev.connect(gain(.55, out)); echo.connect(filt('lowpass', 2600, .5, efb)); efb.connect(echo); echo.connect(gain(.5, mix)); echo.connect(gain(.3, rev));
    /* buses: patrol only (D), combat only (H), what both arrangements share (C) — each dry, and with echo (E) — and X for the hand-over itself */
    const bus = (v, wet, ech) => { const g = gain(v, mix); g.connect(gain(wet, rev)); if (ech) g.connect(eIn); return g; };
    const D = bus(1, .22), DE = bus(1, .4, 1), H = bus(0, .18), HE = bus(0, .34, 1), C = bus(1, .2), CE = bus(1, .36, 1), X = bus(1, .3);
    const grit = to => { const g = gain(1), s = shaper(5, .1); g.connect(s); s.connect(filt('lowpass', 2400, .7, gain(.3, to))); return g; }, GD = grit(D), GH = grit(H);
    /* scale degree to pitch; and a line: rhythm cells strung along the grid, the pitch a random walk that comes home on long notes */
    const dg = (S, i) => { const n = S.sc.length; return S.key + 12 * Math.floor(i / n) + S.sc[((i % n) + n) % n]; };
    const line = (steps, cells, lo, hi, home, start) => { const L = []; let s = 0, i = start; while (s < steps) { const c = rp(cells); for (const [o, d] of c[1]) { if (s + o >= steps) break; i = clamp(i + rp([-2, -1, -1, 1, 1, 2, 0]), lo, hi); if (d >= 4) i = home.reduce((b, x) => Math.abs(x - i) < Math.abs(b - i) ? x : b, home[0]); L.push([s + o, d, i]); } s += c[0]; } return L; };
    const many = (n, f) => Array.from({ length: n }, (_, i) => f(i));

    /* in every play(): the patrol arrangement is always written out; the combat one only while `hot`. hg trims the combat buses, dk is how much of the patrol stays under them */
    const TR = [
      { /* desert — DUST DEVILS: a maqsum on frame drums, a drone, a plucked lead in the Phrygian dominant. Combat: the same line on a reed over a gallop */
        bpm: 96, spb: 16, sub: 4, g: 1.25, key: 50, sc: [0, 1, 4, 5, 7, 8, 10], echo: 3,
        make(S) { const cells = [[8, [[0, 2], [2, 1], [3, 1], [4, 4]]], [8, [[0, 3], [3, 3], [6, 2]]], [8, [[0, 1], [1, 1], [2, 2], [4, 2], [6, 2]]], [16, [[0, 6], [6, 2], [8, 8]]], [8, [[2, 2], [4, 4]]]], home = [0, 4, 7, 11, 14]; S.a = line(32, cells, 0, 11, home, 7); S.b = line(32, cells, 3, 14, home, 9); S.tk = rp(['..t...t.....t.t.', '..t.t.t.....t...', '..t...t...t.t.t.']); },
        play(S, bar, s, t, hot) {
          const ph = bar % 8, sd = S.sd, L = ph < 4 ? S.a : S.b, at = (bar & 1) * 16 + s, sing = (ph !== 3 && ph !== 7) || s < 8;
          if (s === 0 && !(bar & 1)) pad(C, t, [S.key - 24, S.key - 12, S.key - 5], sd * 30, .05, 'sawtooth', 420, 1.6);
          if (s === 0 || s === 8) drum(D, t, 84, s ? .34 : .46, .3); if (S.tk[s] === 't') { nz(D, t, .16, .05, 'bandpass', 2600, 2); drum(D, t, 330, .1, .06); }
          if (!(s & 3)) pluck(D, t, S.key - 12 + (s & 4 ? 7 : 0), .05, 'sawtooth', 900, .5);
          if (sing) for (const e of L) if (e[0] === at) { const m = dg(S, e[2]), orn = e[1] >= 3 && R() < .5; if (orn) pluck(DE, t, m + (R() < .5 ? 1 : 2), .05, 'sawtooth', 2400, .05); pluck(DE, t + (orn ? .055 : 0), m, .15, 'sawtooth', 2700, .1 + e[1] * .05); pluck(D, t, m - 12, .07, 'triangle', 1500, .16); }
          if (hot) {
            nz(H, t, s & 1 ? .05 : s & 3 ? .09 : .14, .035, 'highpass', 6500); if (S.tk[s] === 't') drum(H, t, 330, .12, .06);
            if (s === 0 || s === 3 || s === 6 || s === 10 || s === 12) note(H, t, S.key - 24 + (s === 10 ? 1 : s === 12 ? 7 : 0), sd * 1.6, .14, 'sawtooth', 620, .005, .04);
            if (s === 0 || s === 6 || s === 10) kick(H, t, .42, 130, 48, .22); if (s === 4 || s === 12) drum(H, t, 190, .3, .12); if (s >= 14) drum(H, t, 250, .18, .08);
            if (s === 0 && !(bar & 1)) pad(H, t, [S.key, S.key + 7, S.key + 12], sd * 6, .06, 'sawtooth', 1100, .05); if (s === 8 && (ph === 3 || ph === 7)) for (const m of [1, 8, 13]) brass(H, t, S.key + m, sd * 6, .05, 1500);
            if (sing) for (const e of L) if (e[0] === at) { const m = dg(S, e[2]) + 12, d = e[1] * sd; voice(HE, t, m, d * .9, .13, 'sawtooth', 2100, 6.2); note(GH, t, m - 12, d * .8, .05, 'square', 1500, .008, .05); }
          }
        },
      },
      { /* urban — NEON RAIN: a night drive; eighth-note bass, an arpeggio in the echo, gated snare. Combat: four on the floor, the arpeggio doubled, stabs, and a lead over the top */
        bpm: 118, spb: 16, sub: 4, g: 1, hg: 1.2, key: 45, sc: [0, 2, 3, 5, 7, 8, 10], echo: 3,
        make(S) { S.pr = rp([[0, 5, 2, 6], [0, 3, 5, 4], [0, 5, 3, 4], [0, 2, 5, 6]]); S.ap = rp([[0, 2, 4, 7, 4, 2], [0, 4, 7, 4, 9, 7, 4, 2], [7, 4, 2, 0, 2, 4], [0, 2, 4, 2, 7, 4, 9, 4]]); const cells = [[8, [[0, 4], [4, 2], [6, 2]]], [8, [[0, 2], [2, 2], [4, 4]]], [16, [[0, 6], [6, 6], [12, 4]]], [8, [[0, 3], [3, 3], [6, 2]]], [16, [[0, 8], [10, 2], [12, 4]]]]; S.mel = S.pr.map(r => line(32, cells, 4, 13, [r + 7, r + 9, r + 11, r + 14].map(x => x > 13 ? x - 7 : x), r + 7)); },
        play(S, bar, s, t, hot) {
          const ci = (bar >> 1) % 4, r = S.pr[ci], sd = S.sd, root = dg(S, r) - 12, ch = [dg(S, r), dg(S, r + 2), dg(S, r + 4)], ap = dg(S, r + S.ap[(bar * 16 + s) % S.ap.length]) + 12;
          if (s === 0 && !(bar & 1)) pad(D, t, ch.map(m => m + 12), sd * 30, .035, 'sawtooth', 1500, .5);
          if (s === 0 || s === 8) kick(C, t, .5, 150, 46, .26); if (s === 4 || s === 12) snr(C, t, .26, 1700, .22); if (!(s & 1)) nz(C, t, s & 3 ? .05 : .03, .03, 'highpass', 7500);
          if (!(s & 1)) { note(C, t, root, sd * 1.5, .17, 'sawtooth', 780, .004, .04); pluck(DE, t, ap, .055, 'square', 2200, .09); }
          if (hot) {
            if (s === 4 || s === 12) { kick(H, t, .5, 150, 46, .24); nz(H, t, .13, .1, 'bandpass', 1300, 1); nz(H, t + .014, .1, .09, 'bandpass', 1500, 1); } if (s & 1) nz(H, t, .05, .025, 'highpass', 8000); if ((s & 3) === 2) nz(H, t, .09, .14, 'highpass', 6000);
            if (s & 1) note(H, t, root + 12, sd * .8, .1, 'sawtooth', 1100, .004, .03); pluck(HE, t, ap + (s & 1 ? 0 : 12), .05, 'sawtooth', 2900, .08);
            if (s === 0 || s === 3 || s === 6 || s === 11) for (const m of ch) pluck(H, t, m + 12, .05, 'sawtooth', 2500, .13);
            for (const e of S.mel[ci]) if (e[0] === (bar & 1) * 16 + s) voice(HE, t, dg(S, e[2]) + 12, e[1] * sd * .9, .09, 'sawtooth', 2600, 5.5);
          }
        },
      },
      { /* forest — TIMBERLINE: six-eight; a harp figure, a wooden flute, drums a long way off. Combat: the drums arrive, and horns take the flute's tune */
        bpm: 84, spb: 12, sub: 6, g: 1, key: 52, sc: [0, 2, 3, 5, 7, 9, 10], echo: 4,
        make(S) { S.pr = rp([[0, 3, 0, 6], [0, 2, 6, 3], [0, 6, 3, 0], [0, 4, 3, 6]]); S.hp = rp([[0, 4, 7, 9, 7, 4], [0, 4, 7, 4, 9, 7], [7, 4, 0, 4, 7, 9]]); S.mel = line(96, [[12, [[0, 6], [6, 6]]], [12, [[0, 6], [6, 2], [8, 4]]], [12, [[0, 4], [4, 2], [6, 6]]], [24, [[0, 12], [12, 6], [18, 6]]]], 5, 14, [7, 9, 11, 14], 9); S.wd = rp(['x..x.xx..x.x', 'x.xx..x..x.x', 'x..x.xx.xx..']); },
        play(S, bar, s, t, hot) {
          const r = S.pr[(bar >> 1) % 4], sd = S.sd, ch = [dg(S, r), dg(S, r + 2), dg(S, r + 4)], ph = bar % 16, at = ((ph + 4) % 8) * 12 + s;
          if (s === 0 && !(bar & 1)) pad(D, t, [ch[0] - 12, ch[2] - 12, ch[1]], sd * 22, .05, 'triangle', 1000, 1.4);
          if (!(s & 1)) pluck(CE, t, dg(S, r + S.hp[(s >> 1) % 6]), s ? .085 : .12, 'triangle', 2600, .32);
          if (s === 0) drum(D, t, 70, .4, .4); if (s === 6) drum(D, t, 96, .16, .3); if (!(s & 1)) nz(D, t, s % 6 ? .025 : .05, .05, 'highpass', 5200);
          if (ph >= 4 && ph < 12) for (const e of S.mel) if (e[0] === at) voice(DE, t, dg(S, e[2]) + 12, e[1] * sd * .85, .07, 'sine', 3000, 4.6);
          if (hot) {
            if (S.wd[s] === 'x') drum(H, t, s % 6 ? (s & 1 ? 150 : 118) : 88, s % 6 ? .22 : .34, .2); if (s === 0 || s === 6) kick(H, t, .45, 120, 42, .3); if (s === 3 || s === 9) nz(H, t, .1, .06, 'bandpass', 2400, 1);
            if (!(s & 1)) note(H, t, ch[0] - 24, sd * 1.5, .18, 'sawtooth', 520, .005, .04); pluck(H, t, ch[s % 3 === 1 ? 2 : 0] + (s % 3 === 2 ? 12 : 0), .055, 'sawtooth', 1900, .07);
            if (s === 0 && !(bar & 3)) pad(H, t, [ch[0], ch[2], ch[0] + 12], sd * 44, .035, 'sawtooth', 1300, .3);
            for (const e of S.mel) if (e[0] === at) { const m = dg(S, e[2]), d = e[1] * sd * .85; brass(HE, t, m, d, .085, 1700); brass(H, t, m - 12, d, .05, 1100); }
          }
        },
      },
      { /* jungle — CANOPY: marimba in threes over a bar in four, log drums, something calling in the trees. Combat: the marimba keeps going while congas, a kick and low horns close in */
        bpm: 108, spb: 16, sub: 4, g: 1, hg: 1.2, key: 43, sc: [0, 3, 5, 7, 10], echo: 3,
        make(S) { S.m1 = many(5, i => i ? rp([5, 6, 7, 8, 9, 7, 5]) : 5); S.m2 = many(4, () => rp([10, 11, 12, 13, 14])); S.lg = rp(['h..l..h...l.h...', 'h..h..l.l...h.l.', 'l..h....l.h...h.']); S.cg = rp(['x.xx.x.xx.x.xx.x', 'xx.x.xx.x.xx.x.x']); S.bs = rp([[0, 0, 3, 2], [0, 2, 0, 4], [0, 0, 4, 3]]); },
        play(S, bar, s, t, hot) {
          const n = bar * 16 + s, sd = S.sd, b = S.bs[(bar >> 1) % 4];
          if (n % 3 === 0) wood(CE, t, dg(S, S.m1[(n / 3) % 5]) + 12, .13, .2);
          if ((s === 2 || s === 5 || s === 10 || s === 13) && (bar & 2 || hot)) wood(hot ? H : D, t, dg(S, S.m2[(bar + (s > 8 ? 2 : 0) + (s & 1)) % 4]), .08, .16);
          const g = S.lg[s]; if (g !== '.') drum(D, t, g === 'h' ? 240 : 170, .2, .1); nz(D, t, (s & 3) === 2 ? .06 : .022, .03, 'highpass', 6800);
          if (s === 0) note(D, t, dg(S, b) - 12, sd * 7, .17, 'sine', 500, .01, .12); if (s === 10) note(D, t, dg(S, b), sd * 3, .1, 'sine', 500, .01, .1);
          if (s === 0 && !(bar & 3)) pad(D, t, [S.key + 12, S.key + 19, S.key + 22], sd * 56, .02, 'triangle', 900, 2);
          if (R() < .012) { const f = rr(2200, 3400), o = osc('sine', f, t, t + .22, hit(DE, t, .03, .2)); o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * rr(1.15, 1.5), t + .09); o.frequency.exponentialRampToValueAtTime(f * .9, t + .2); }
          if (hot) {
            if (S.cg[s] === 'x') drum(H, t, [200, 262, 320][(n * 7) % 3], (s & 3) === 0 ? .28 : .18, .11); if (s === 0 || s === 6 || s === 12) kick(H, t, .45, 140, 46, .24); if (s === 4 || s === 12) nz(H, t, .16, .09, 'bandpass', 2200, .8); nz(H, t, s & 1 ? .03 : .05, .03, 'highpass', 7800);
            if (s === 3 || s === 6 || s === 11) for (const m of [0, 2, 4]) pluck(H, t, dg(S, b + m + 5), .05, 'sawtooth', 2300, .1);
            if (!(s & 1)) note(H, t, dg(S, b) - 12, sd * 1.2, .17, 'sawtooth', 560, .004, .03); if ((s & 3) === 2) clank(H, t, .08, 820);
            if (s === 0 || s === 6 || s === 12) brass(HE, t, dg(S, S.m1[(bar + (s >> 2)) % 5]), sd * (s === 12 ? 3 : 5), .075, 1500); if (n % 3 === 0) wood(HE, t, dg(S, S.m1[(n / 3) % 5]) + 24, .09, .14);
          }
        },
      },
      { /* glacial — WHITEOUT: almost nothing; open fifths, glass a long way apart, wind, a slow heart. Combat: a pulse under the ice, the glass turned to an alarm, low strings */
        bpm: 66, spb: 16, sub: 4, g: 1.15, hg: .8, key: 49, sc: [0, 2, 3, 7, 8], echo: 6, bd: [0, 4, 8, 12],
        make(S) { S.pr = rp([[0, 3, 4, 0], [0, 4, 2, 3], [0, 2, 4, 3]]); S.bl = many(12, () => [(R() * 64) | 0, 10 + (R() * 8 | 0)]); S.os = rp([[0, 3, 5, 3], [0, 3, 0, 4], [5, 3, 0, 3]]); },
        play(S, bar, s, t, hot) {
          const sd = S.sd, c = S.pr[(bar >> 2) % 4], root = dg(S, c), n = (bar % 4) * 16 + s;
          if (s === 0 && !(bar & 3)) { pad(C, t, [root - 12, root - 5, root + 2], sd * 60, .05, 'sawtooth', 640, 3); pad(DE, t, [root + 24, root + 31], sd * 58, .012, 'sine', 4000, 4); }
          if (s === 0 && !(bar & 1)) swell(D, t, sd * 30, .045, rr(380, 900), 1.4);
          for (const e of S.bl) if (e[0] === n) bell(CE, t, dg(S, e[1]), .07, 1.5);
          if (s === 0) kick(D, t, .34, 90, 38, .5); if (s === 3) kick(D, t, .2, 80, 38, .4);
          if (hot) {
            if (!(s & 1)) note(H, t, root - 12, sd * 1.4, .24, 'sawtooth', s & 3 ? 380 : 540, .005, .05); nz(H, t, (s & 3) === 0 ? .09 : .035, .025, 'highpass', 7000);
            pluck(H, t, dg(S, c + 5 + S.os[s & 3]), .045, 'sawtooth', 1700, .08); if (s === 4 || s === 12) nz(HE, t, s === 12 ? .2 : .12, .3, 'bandpass', 1500, .5); if (s === 0 || s === 6 || s === 10) kick(H, t, .5, 110, 40, .34);
            if (s === 0 && !(bar & 1)) pad(H, t, [root + 12, root + 15, root + 19], sd * 28, .035, 'sawtooth', 1100, .4);
            if (!(s & 3)) bell(HE, t, dg(S, c + 10 + S.os[(s >> 2) & 3]), .07, .6); if (s === 0) brass(HE, t, dg(S, c + (bar & 1 ? 7 : 8)), sd * 13, .09, 1300, .5);
          }
        },
      },
      { /* volcanic — FORGE: half-time; a kick like a drop hammer, anvils, a bass riff through a blown amplifier. Combat: the hammer goes to full time, the amplifier opens up, a lead in fifths */
        bpm: 88, spb: 16, sub: 4, g: .6, hg: 1.1, key: 36, sc: [0, 1, 3, 5, 7, 8, 10], echo: 3,
        make(S) { S.rf = rp(['x..x..x.x...x.x.', 'x.x...x..x..x.x.', 'x..x.x....x.x..x', 'x...x.x..x.x..x.']); S.rd = many(16, i => i ? rp([0, 0, 0, 1, 3, 0, 6, 4]) : 0); S.ld = many(8, i => i ? rp([0, 1, 3, 4, 6, 7]) : 7); S.cl = rp([[4, 12], [12], [6, 12], [4, 14]]); },
        play(S, bar, s, t, hot) {
          const sd = S.sd, up = bar % 8 >= 6 ? 1 : 0;
          if (s === 0) { kick(C, t, .7, 170, 38, .42); nz(C, t, .12, .05, 'lowpass', 900); } if (s === 8) { snr(D, t, .42, 1300, .34); nz(DE, t, .1, .5, 'bandpass', 700, .5); }
          if (S.cl.includes(s) && (bar & 1 || s === 12)) clank(D, t, .13, s === 12 ? 430 : 610);
          if (S.rf[s] === 'x') { let d = 1; while (s + d < 16 && S.rf[s + d] === '.') d++; const m = S.key + up + S.sc[S.rd[s] % 7]; note(GD, t, m, d * sd * .8, .5, 'sawtooth', 420, .004, .04); if (hot) { note(GH, t, m, d * sd * .8, .5, 'sawtooth', 1000, .004, .04); note(GH, t, m + 12, d * sd * .6, .16, 'square', 1300, .004, .04); } }
          if (s === 0 && !(bar & 1)) { const g = gain(0, C), e = t + sd * 32; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09, t + 1); g.gain.linearRampToValueAtTime(0, e); noise(t, e + .05, filt('lowpass', 130, .7, g)); osc('sine', hz(S.key), t, e + .05, gain(.5, g)); }
          if (s === 12 && bar % 4 === 3) swell(C, t, sd * 4, .09, 4200, .6);
          if (hot) {
            if (s === 4 || s === 12) snr(H, t, .42, 1500, .24); if (s === 6 || s === 10 || s === 14 || (s === 15 && bar & 1)) kick(H, t, .55, 160, 40, .2);
            if (!(s & 1) || bar & 1) nz(H, t, s & 3 ? .05 : .09, .03, 'bandpass', 5200, 3); if ((s & 3) === 2) clank(H, t, .08, 900);
            if (!(s & 1)) { const m = S.key + 24 + up + S.sc[S.ld[(s >> 1) % 8] % 7]; note(GH, t, m, sd * (s % 8 === 6 ? 2 : 1.2), .24, 'square', 1500, .004, .04); note(GH, t, m + 7, sd * 1.2, .12, 'square', 1500, .004, .04); }
            if (bar % 4 === 3 && s >= 12) drum(H, t, 150 - (s - 12) * 16, .34, .2);
          }
        },
      },
      { /* lunar — HARD VACUUM: five-four and very little air; a sonar ping, a sub, a sequencer with half its notes missing. Combat: the sequencer fills its gaps, drums in three-plus-two, a saw doubling the sub */
        bpm: 100, spb: 20, sub: 4, g: .95, key: 40, sc: [0, 2, 3, 6, 7, 10], echo: 5, bd: [0, 6, 12, 16],
        make(S) { S.sq = many(20, i => i ? (R() < .5 ? -1 : rp([6, 7, 8, 9, 10, 12, 8])) : 6); S.bs = rp([[0, 4], [0, 5], [0, 2]]); S.tk = many(10, () => R() < .75); },
        play(S, bar, s, t, hot) {
          const sd = S.sd, alt = (bar >> 1) & 1, q = S.sq[s];
          if (s === 0 && !(bar & 1)) { bell(CE, t, S.key + 48, .06, 1.6); pad(D, t, [S.key + 24, S.key + 31, S.key + 34 - alt * 2], sd * 34, .022, 'triangle', 2400, 2.5); }
          if (s === 0) note(C, t, S.key, sd * 11, .16, 'sine', 300, .02, .2); if (s === 12) note(C, t, dg(S, S.bs[alt]), sd * 7, .13, 'sine', 300, .02, .2);
          if (s === 0 || s === 12) osc('sine', 880, t, t + .09, hit(D, t, .05, .07));
          if (!(s & 1) && S.tk[s >> 1]) nz(D, t, .035, .012, 'highpass', 9000);
          if (q >= 0) pluck(DE, t, dg(S, q), .05, 'square', 1500, .09);
          if (hot) {
            pluck(HE, t, dg(S, q >= 0 ? q : s & 1 ? 0 : 3), q >= 0 ? .09 : .045, 'square', 2600, .09);
            if (s === 0 || s === 6 || s === 12 || s === 16) kick(H, t, .55, 140, 44, .24); if (s === 8 || s === 18) nz(H, t, .22, .12, 'bandpass', 1900, .7); if (s & 1) nz(H, t, .045, .02, 'highpass', 8000);
            if (!(s & 1)) note(H, t, (s >= 12 ? dg(S, S.bs[alt]) : S.key) + (s % 4 === 2 ? 12 : 0), sd * 1.2, .18, 'sawtooth', 700, .004, .03);
            if (s === 0 || s === 3 || s === 12 || s === 15) for (const m of [0, 3, 4]) pluck(HE, t, dg(S, 6 + m), .055, 'sawtooth', 2800, .14);
            if (s === 0 || s === 12) voice(HE, t, dg(S, 12 + (s ? S.bs[alt] : 0)), sd * (s ? 7 : 11), .09, 'sawtooth', 2000, 5);
          }
        },
      },
    ];
    /* st: 0 patrol · 1 building up to the hand-over at step sw · 2 combat · 3 one bar of winding down */
    let S = null, st = 0, sw = 0, hv = 0, since = 0;
    const lvl = (v, t, th, td = th) => { const tr = S ? S.tr : TR[0], hg = v * (tr.hg || 1), dv = 1 - v * (1 - (tr.dk || 0)); for (const b of [H, HE]) b.gain.setTargetAtTime(hg, t, th); for (const b of [D, DE]) b.gain.setTargetAtTime(dv, t, td); };
    const snap = v => { for (const b of [H, HE, D, DE]) b.gain.cancelScheduledValues(0); lvl(v, 0, .01); };
    /* the way in: a roll that tightens and a rush of air, then everything lands at once. The way out: one last hit, and the room it leaves */
    const rise = (t, n) => { const sd = S.sd; swell(X, t, n * sd, .12, 1500, .7); for (let i = 0; i < n; i++) { const k = (i + 1) / n; drum(X, t + i * sd, 105 + 75 * k, .06 + .22 * k * k, .14); if (k > .45) nz(X, t + (i + .5) * sd, .1 * k, .04, 'bandpass', 2300, .8); } };
    const land = t => { boom(X, t, .28); crash(X, t, .12, 1.6); };
    const fall = t => { boom(X, t, .2, 1.8); crash(X, t, .06, 2.4); };
    return {
      out, n: TR.length, mix: { D, DE, H, HE, C, CE, X }, get song() { return S; }, get state() { return st; },
      use(i, t) { const tr = TR[((i % TR.length) + TR.length) % TR.length]; S = { tr, i, t0: t, step: 0, sd: 60 / tr.bpm / tr.sub, spb: tr.spb, key: tr.key, sc: tr.sc, bpm: tr.bpm }; tr.make(S); echo.delayTime.value = Math.min(1.9, S.sd * tr.echo); mix.gain.value = .9 * tr.g; X.gain.value = 1 / tr.g; st = 0; hv = 0; snap(0); },
      start(t) { if (S) { S.t0 = t; S.step = 0; } }, shift(d) { if (S) S.t0 += d; }, next: () => S ? S.t0 + S.step * S.sd : 1e9,
      /* how hot the fight is, 0..1: the score crosses over above a half and comes back below a third */
      heat(v) { hv = v; },
      /* test hook: drop straight into one arrangement with no hand-over */
      force(on) { st = on ? 2 : 0; hv = on ? 1 : 0; since = -1e6; snap(on ? 1 : 0); },
      tick(until) {
        if (!S) return;
        for (let g = 0; g < 4000; g++) {
          const t = S.t0 + S.step * S.sd; if (t > until) break; const s = S.step % S.spb, bar = (S.step / S.spb) | 0, tr = S.tr;
          if ((st === 0 || st === 3) && hv > .5) { const B = tr.bd || [0, S.spb / 2], lead = Math.ceil(.6 / S.sd); let n = 1; while (n < lead || !B.includes((s + n) % S.spb)) n++; st = 1; sw = S.step + n; rise(t, n); }
          if (st === 1 && S.step === sw) { st = 2; since = S.step; land(t); lvl(1, t - .04, .012, .04); }
          else if (st === 3 && s === 0) st = 0;
          else if (st === 2 && s === 0 && hv < .3 && S.step - since >= S.spb * 2) { st = 3; fall(t); lvl(0, t, S.sd * S.spb * .3); }
          tr.play(S, bar, s, t, st >= 2); S.step++;
        }
      },
    };
  })();
  /* ---------- command deck: NIGHT WATCH plays first — hand drums, a plucked string and slow synths in D minor — then the ambience above takes its turn, and round again ---------- */
  const deck = (() => {
    const { nz, drum, note, pluck, pad, bell, swell, shk, boom, twang, glide } = KIT;
    const out = gain(0, dest); amb.out.disconnect(); amb.out.connect(out); amb.out.gain.value = 0;
    const nw = gain(.9, out), rev = verb(4.6, 1.35, 1.6), dly = ac.createDelay(2), dfb = gain(.38), dIn = gain(1, dly); const pan = p => { const n = ac.createStereoPanner(); n.pan.value = p; n.connect(nw); return n; };
    rev.connect(gain(.6, nw)); dly.connect(filt('lowpass', 2300, .5, dfb)); dfb.connect(dly); dly.connect(gain(.45, pan(.45))); dly.connect(gain(.35, rev));
    /* a bus: reverb send, echo send, place in the stereo field */
    const bus = (wet, ech, p) => { const g = gain(1, p ? pan(p) : nw); g.connect(gain(wet, rev)); if (ech) g.connect(gain(ech, dIn)); return g; };
    const DR = bus(.22), HT = bus(.25, 0, .3), TL = bus(.3, 0, -.4), TR = bus(.3, 0, .4), BS = bus(.04), PD = bus(.5), PL = bus(.4, .45, -.2), LD = bus(.5, .4, .15), AR = bus(.3, .5, -.5), AR2 = bus(.3, .5, .5);
    const SD = 60 / 84 / 4, BAR = SD * 16, BARS = 56, AMB = 150; dly.delayTime.value = SD * 3;
    /* one letter a bar: intro 8 · A 16 · B 16 · A 8 · out 8. Each chord is its bass note and a voicing */
    const FORM = 'ddddddbc' + 'ddbcdfga' + 'ddbcdfga' + 'bcddbcad' + 'bcddgadd' + 'ddbcdfga' + 'ddbcdddd';
    const CH = { d: [38, [50, 57, 62, 65]], b: [34, [46, 53, 58, 62]], c: [36, [48, 55, 60, 64]], f: [41, [53, 57, 60, 65]], g: [31, [43, 55, 58, 62]], a: [33, [45, 52, 57, 60]] };
    /* the tune on the string, eight bars: [bar, step, pitch, length]; and the four phrases the synth answers with in the middle */
    const HOOK = [[0, 0, 62, 3], [0, 3, 69, 3], [0, 6, 72, 2], [0, 8, 69, 6], [0, 14, 67, 2], [1, 0, 65, 3], [1, 3, 67, 3], [1, 6, 69, 10],
      [2, 0, 62, 3], [2, 3, 70, 3], [2, 6, 74, 2], [2, 8, 72, 6], [2, 14, 70, 2], [3, 0, 67, 3], [3, 3, 72, 3], [3, 6, 76, 10],
      [4, 0, 62, 3], [4, 3, 69, 3], [4, 6, 72, 2], [4, 8, 77, 6], [4, 14, 76, 2], [5, 0, 72, 3], [5, 3, 69, 3], [5, 6, 72, 10],
      [6, 0, 67, 3], [6, 3, 70, 3], [6, 6, 74, 2], [6, 8, 70, 6], [6, 14, 69, 2], [7, 0, 64, 3], [7, 3, 69, 3], [7, 6, 67, 6], [7, 12, 64, 4]];
    const LEAD = [[[77, 8], [79, 8], [76, 6], [79, 6], [76, 4], [74, 20], [69, 8]], [[74, 8], [77, 8], [79, 10], [76, 6], [76, 8], [72, 4], [69, 4], [74, 14]],
      [[77, 8], [82, 8], [79, 6], [76, 6], [79, 4], [81, 12], [77, 4], [74, 12]], [[82, 6], [81, 4], [79, 6], [81, 8], [76, 8], [74, 26]]];
    const hookAt = b => b < 8 ? [-1, -1, 0, 1, -1, -1, 2, 3][b] : b < 24 ? (b - 8) % 8 : b < 40 ? -1 : b < 48 ? b - 40 : b < 52 ? b - 48 : b === 52 ? 0 : -1;
    let t0 = 0, step = 0, gh = [2, 9], ao = [0, 2, 1, 3, 2, 1], part = 0, lap = false, aEnd = 0;
    const begin = t => { t0 = t; step = 0; gh = rp([[2, 9], [7, 11], [2, 11, 15], [9, 15]]); ao = rp([[0, 2, 1, 3, 2, 1], [0, 1, 2, 3, 2, 1], [3, 2, 1, 0, 1, 2], [0, 2, 3, 1, 2, 3]]); };
    const play = (bar, s, t) => {
      /* sec: 0 intro · 1 A · 2 B · 3 A again · 4 out */
      const sec = bar < 8 ? 0 : bar < 24 ? 1 : bar < 40 ? 2 : bar < 48 ? 3 : 4, [root, ch] = CH[FORM[bar]], hb = hookAt(bar), n = bar * 16 + s, hu = () => (R() - .5) * .012, vv = () => .85 + R() * .3, full = sec >= 1 && sec <= 3, last = bar === BARS - 1;
      if (s === 0) {
        pad(PD, t, ch, last ? BAR * 1.7 : BAR, [.036, .04, .047, .042, .034][sec], 'sawtooth', [700, 950, 1400, 1100, 760][sec], 1.4); if (sec === 2 || sec === 3) pad(PD, t, [ch[3] + 12], BAR, .014, 'triangle', 3000, 1.6);
        if (!(bar & 3)) swell(PD, t, BAR * 2, .03, 420, .8); if (bar === 0) boom(DR, t, .22, 2);
        if (!full) { note(BS, t, root, SD * 13, .05, 'sine', 400, .3, .4); note(BS, t, root + 12, SD * 13, .04, 'triangle', 500, .3, .4); }
      }
      /* bass and the low drum share the three-three-two */
      if (full && (s === 0 || s === 6 || s === 12)) { const m = root + (s === 12 && bar & 1 ? 7 : 0), d = SD * (s === 12 ? 3.2 : 5.2); note(BS, t, m, d, .06, 'sine', 400, .02, .12); note(BS, t, m + 12, d, .07, 'triangle', 600, .02, .1); }
      const dum = full ? (s === 0 ? .34 : s === 6 ? .21 : s === 12 ? .26 : s === 10 && bar & 1 ? .12 : 0) : sec === 0 ? (bar >= 4 && (s === 0 || s === 12) ? .2 : 0) : bar < 52 ? (s === 0 ? .26 : s === 6 || s === 12 ? .16 : 0) : bar < 54 && s === 0 ? .16 : 0;
      if (dum) { const x = t + hu(), v = dum * vv(); drum(DR, x, 80, v, .32); nz(DR, x, v * .3, .03, 'bandpass', 900, 1); }
      const tek = !full ? 0 : s === 4 ? .75 : s === 14 ? .56 : gh.includes(s) ? .24 : 0; if (tek) { const x = t + hu(), v = tek * vv(); nz(HT, x, v, .045, 'bandpass', 2500, 2.2); drum(HT, x, 310, v * .5, .06); }
      const shv = full ? (s & 1 ? (sec === 2 ? .09 : 0) : (s & 3) === 2 ? .3 : .17) : (sec === 0 ? bar >= 4 : bar < 52) && (s & 3) === 2 ? .18 : 0; if (shv) shk(HT, t + hu(), shv * vv(), .08);
      /* the drums of the middle section; and a fill into every new section */
      if ((sec === 2 || (sec === 3 && bar & 1)) && (s === 0 || s === 3 || s === 6 || s === 10 || s === 12)) drum(s === 6 ? TL : s === 12 ? TR : DR, t + hu(), s === 6 ? 74 : s === 12 ? 92 : 62, (sec === 2 ? .2 : .14) * vv(), .5);
      if ((bar === 7 || bar === 23 || bar === 39 || bar === 47) && (s === 10 || s >= 12)) drum(s & 1 ? TR : TL, t + hu(), 118 - (s - 10) * 9, .14 + (s - 10) * .04, .4);
      /* a slow synth arpeggio, six steps against the bar's sixteen */
      if ((sec === 1 && bar >= 16) || sec === 2 || sec === 3) pluck(n & 1 ? AR2 : AR, t, ch[ao[n % 6]] + 12, sec === 2 ? .1 : .075, 'square', (sec === 2 ? 1700 : 1150) + 520 * Math.sin(bar * .8), .09);
      if ((sec === 0 || sec === 1 || sec === 4) && !(bar & 1) && s === 10 && !last) osc('sine', 1174.7, t, t + .09, hit(AR2, t, .04, .07));
      /* the tune */
      if (hb >= 0) for (const e of HOOK) if (e[0] === hb && e[1] === s && (bar !== 52 || s < 8)) {
        const again = bar >= 16 && sec !== 4, v = (sec === 0 || sec === 4 ? .6 : .7) * vv();
        twang(PL, t + hu(), e[2], v, { d: e[3] * SD + .5, from: sec === 3 && s === 0 ? -2 : 0, cut: sec === 4 ? 3000 : 4200 }); if (again && e[3] >= 6) bell(PL, t, e[2] + 12, .05, 1.1);
      }
      if (sec === 2) {
        if (!((bar - 24) & 3) && s === 0) glide(LD, t, LEAD[(bar - 24) >> 2], SD, .14);
        if (s === 0) twang(PL, t + hu(), ch[0], .45, { d: 2 }); else if (s === 6) twang(PL, t + hu(), ch[1], .36, { d: 1.6 }); else if (s === 12 && bar & 1) twang(PL, t + hu(), ch[2], .3, { d: 1.4 });
      }
      /* the last of it: two notes of the tune, then the chord it has been circling */
      if (bar === 53 && s === 8) twang(PL, t, 69, .4, { cut: 2600 }); if (bar === 54 && s === 0) twang(PL, t, 62, .4, { from: -2, cut: 2600 });
      if (last && s === 0) { [50, 57, 62, 65, 69].forEach((m, i) => twang(PL, t + i * .045, m, .32, { d: 2.4 })); bell(PL, t + .22, 86, .05, 1.6); boom(DR, t, .16, 2.2); }
    };
    return {
      out, bars: BARS, mix: { DR, HT, TL, TR, BS, PD, PL, LD, AR, AR2 }, get part() { return part; }, get bar() { return (step / 16) | 0; },
      /* p: 0 from the top of NIGHT WATCH, 1 straight to the ambience */
      start(t, p = 0) { const G = amb.out.gain; G.cancelScheduledValues(0); G.setTargetAtTime(0, 0, .25); lap = false; if (p) { part = 1; amb.start(t); aEnd = t + AMB; G.setTargetAtTime(1, t, 2.2); } else { part = 0; begin(t); } },
      shift(d) { if (part || lap) { amb.shift(d); aEnd += d; } if (!part) t0 += d; },
      next: () => part ? Math.min(amb.next(), aEnd) : t0 + step * SD,
      tick(until) {
        for (let g = 0; g < 4000; g++) {
          if (part) { amb.tick(Math.min(until, aEnd)); if (until < aEnd) break; amb.out.gain.setTargetAtTime(0, aEnd, 2); part = 0; begin(aEnd + 4.5); continue; }
          const t = t0 + step * SD; if (t > until) break;
          /* the ambience comes up under the final bar */
          if (step === (BARS - 1) * 16) { lap = true; amb.start(t + .5); aEnd = t + .5 + AMB; amb.out.gain.setTargetAtTime(1, t + .5, 2.2); }
          if (step >= BARS * 16) { part = 1; lap = false; continue; }
          play((step / 16) | 0, step & 15, t); step++;
        }
        if (lap) amb.tick(Math.min(until, aEnd));
      },
    };
  })();

  /* ---------- the jingle for a contract won: brass over drums, six seconds, landing on D for the deck theme to pick up from ---------- */
  const sting = (() => {
    const { kick, snr, brass, bell, boom, crash, clank } = KIT;
    const out = gain(.72, dest), rev = verb(2.6, .9, 1.4), B = gain(1, out), SD = 60 / 126 / 4; rev.connect(gain(.5, out)); B.connect(gain(.3, rev));
    /* in sixteenths from the pick-up: the tune [step, pitch, length], the chords under it, kettledrums [step, Hz, level], snare [step, level] */
    const MEL = [[2, 57, 1], [3, 62, 1], [4, 66, 3], [7, 69, 1], [8, 74, 6], [14, 71, 2], [16, 74, 2], [18, 76, 2], [20, 79, 4], [24, 76, 2], [26, 79, 2], [28, 81, 4], [32, 83, 2], [34, 85, 2], [36, 86, 14]];
    const CHD = [[4, [50, 57, 62], 15], [20, [43, 55, 59, 62], 7.5], [28, [45, 57, 61, 64], 7.5], [36, [38, 50, 57, 62, 66, 69], 14]];
    const TMP = [[4, 73.4, .3], [12, 73.4, .17], [16, 110, .18], [20, 98, .3], [26, 98, .15], [28, 110, .3], [36, 73.4, .32], [44, 73.4, .32]];
    const SNR = [[8, .2], [12, .14], [16, .2], [24, .2], [36, .26], [44, .26]];
    return {
      out, play(k, t) {
        const at = s => t + s * SD;
        for (const [s, m, d] of MEL) { brass(B, at(s), m, d * SD * .92, .15, 2500); if (d >= 3) brass(B, at(s), m - 12, d * SD * .92, .08, 1600); }
        for (const [s, ms, d] of CHD) for (const m of ms) brass(B, at(s), m, d * SD * .95, .06, 1500, .05);
        for (const [s, f, v] of TMP) kick(B, at(s), v, f * 1.5, f, .6);
        for (const [s, v] of SNR) snr(B, at(s), v, 1900, .18);
        /* rolls: into the first bar, into the last chord, and the kettledrum under it */
        for (let i = 0; i < 8; i++) snr(B, at(i * .5), .05 + i * .028, 2100, .07); for (let i = 0; i < 12; i++) { snr(B, at(30 + i * .5), .05 + i * .02, 2100, .07); if (!(i & 1)) kick(B, at(30 + i * .5), .12 + i * .02, 165, 110, .3); }
        for (let i = 1; i < 8; i++) kick(B, at(36 + i), .26 - i * .025, 110, 73.4, .3);
        for (const s of [4, 20, 28, 36, 44]) kick(B, at(s), .24, 150, 46, .26);
        crash(B, at(4), .1, 1.2); crash(B, at(36), .15, 2.2); crash(B, at(44), .09, 1.8); boom(B, at(36), .2, 1.6); boom(B, at(44), .16, 2); clank(B, at(4), .1, 620); clank(B, at(36), .14, 520); clank(B, at(44), .1, 430);
        for (const [s, m] of [[36, 86], [38, 90], [40, 93], [44, 98]]) bell(B, at(s), m, .04, 1);
        for (const m of [38, 50, 62]) brass(B, at(44), m, 5 * SD, .08, 1700, .02);
        return 50 * SD + .8;
      },
    };
  })();
  /* ---------- the briefing room: FIRST LIGHT — a slow march in D minor. A field snare and kettledrums under low strings, a horn tune that keeps climbing and stops short of arriving,
     then two bars of D major before the minor comes back and it goes round again. Hopeful, and not sure it should be ---------- */
  const brief = (() => {
    const { kick, snr, brass, pad, bell, boom, note, swell } = KIT;
    const out = gain(0, dest), rev = verb(3.8, 1.2, 1.5), dry = gain(.9, out); rev.connect(gain(.55, out));
    const pan = p => { const n = ac.createStereoPanner(); n.pan.value = p; n.connect(dry); return n; }, bus = (wet, p = 0) => { const g = gain(1, p ? pan(p) : dry); g.connect(gain(wet, rev)); return g; };
    const SN = bus(.22, -.25), TI = bus(.35, .2), ST = bus(.5), HN = bus(.6, -.15), TP = bus(.5, .3), BL = bus(.6, .4);
    const SD = 60 / 72 / 4, BAR = SD * 16, INTRO = 4, LOOP = 16;
    /* one letter a bar: four of drums and drone, then the sixteen that repeat — the tune twice, a middle that ends on the dominant, the major, and a breath */
    const FORM = 'dddd' + 'dbfc' + 'dbfc' + 'gfaa' + 'DDdd';
    const CH = { d: [38, [50, 57, 62, 65]], b: [34, [46, 53, 58, 62]], f: [41, [48, 53, 57, 60]], c: [36, [48, 52, 55, 60]], g: [31, [46, 50, 55, 58]], a: [33, [45, 49, 52, 57]], D: [38, [50, 54, 57, 62]] };
    const TIMP = { d: 73.4, b: 58.3, f: 87.3, c: 65.4, g: 49, a: 55, D: 73.4 };
    /* [bar of the loop, step, pitch, length] */
    const TUNE = [[0, 0, 62, 6], [0, 6, 65, 2], [0, 8, 69, 8], [1, 0, 70, 6], [1, 6, 69, 2], [1, 8, 65, 8], [2, 0, 69, 6], [2, 6, 72, 2], [2, 8, 72, 4], [2, 12, 69, 4], [3, 0, 67, 12], [3, 12, 64, 4],
      [4, 0, 62, 6], [4, 6, 65, 2], [4, 8, 69, 6], [4, 14, 72, 2], [5, 0, 74, 8], [5, 8, 70, 8], [6, 0, 72, 6], [6, 6, 69, 2], [6, 8, 65, 8], [7, 0, 64, 8], [7, 8, 67, 8],
      [8, 0, 70, 8], [8, 8, 67, 8], [9, 0, 69, 8], [9, 8, 65, 8], [10, 0, 64, 12], [10, 12, 61, 4], [11, 0, 57, 14],
      [12, 0, 62, 4], [12, 4, 66, 4], [12, 8, 69, 8], [13, 0, 74, 14]];
    const SNARE = [.5, 0, 0, .18, .4, 0, .2, 0, .5, 0, .2, .2, .4, 0, .28, .18];
    let t0 = 0, step = 0;
    const play = (bar, s, t) => {
      const fb = bar < INTRO ? -1 : bar - INTRO, k = FORM[bar], [root, ch] = CH[k], hu = () => (R() - .5) * .008, major = k === 'D';
      if (s === 0) {
        pad(ST, t, ch, BAR, bar < INTRO ? .02 + bar * .004 : major ? .042 : .034, 'sawtooth', major ? 1300 : 850, 1.1); note(ST, t, root, BAR * .95, .06, 'sine', 300, .4, .5); note(ST, t, root + 12, BAR * .95, .03, 'triangle', 500, .4, .5);
        kick(TI, t + hu(), major ? .3 : .24, TIMP[k] * 1.5, TIMP[k], .7); if (bar === 0 || fb === 0 || fb === 12) boom(TI, t, .16, 1.8); if (fb === 12) bell(BL, t, 86, .035, 1.4);
      }
      if (s === 8 && fb !== 14 && bar >= 2) kick(TI, t + hu(), .13, TIMP[k] * 2.25, TIMP[k] * 1.5, .5);
      if (fb === 11 && s === 8) swell(ST, t, BAR * .5, .02, 900, .8);
      /* the snare: a march heard from across the parade ground, a roll into every fourth bar, and nothing at all while the last chord rings */
      const lv = (bar < 2 ? .5 : fb === 14 ? 0 : 1) * (major ? 1.15 : 1), v = SNARE[s] * lv;
      if ((bar & 3) === 3 && s >= 12) { for (let i = 0; i < 2; i++) snr(SN, t + i * SD / 2 + hu(), (.1 + (s - 12) * .035 + i * .015) * lv, 2200, .06); } else if (v) snr(SN, t + hu(), v * .26 * (.88 + R() * .24), 2100, s & 3 ? .07 : .11);
      /* the tune: horns, with a trumpet an octave up the second time round and through the major bars; the middle is chords only underneath */
      if (fb >= 0) for (const e of TUNE) if (e[0] === fb && e[1] === s) { const d = e[3] * SD * .93; brass(HN, t, e[2], d, .1, 1150, .07); brass(HN, t, e[2] - 12, d, .05, 800, .09); if ((fb >= 4 && fb < 8) || fb >= 12) brass(TP, t, e[2] + 12, d, fb >= 12 ? .05 : .032, 2300, .05); }
      if (fb >= 8 && fb < 12 && s === 0) for (const m of ch.slice(1)) brass(HN, t, m, BAR * .9, .028, 900, .25);
    };
    return {
      out, mix: { SN, TI, ST, HN, TP, BL }, bpm: 72,
      start(t) { t0 = t; step = 0; }, shift(d) { t0 += d; }, next: () => t0 + step * SD,
      tick(until) { for (let g = 0; g < 4000; g++) { const t = t0 + step * SD; if (t > until) break; play((step / 16) | 0, step & 15, t); step++; if (step >= (INTRO + LOOP) * 16) { step = INTRO * 16; t0 += LOOP * 16 * SD; } } },
    };
  })();
  /* ---------- the opening: THE GROUND SHAKES — one cue, eleven seconds, cut to the picture in src/js/447_intro.js at 120 beats a minute. Four beats of a machine walking, a drum under
     every footfall; eleven of battle in D minor over sixteenths in the low strings, horns climbing B flat, C and on; then nothing for a breath, and the name comes down on beats 15 and 16
     with everything in the room. It lands on D, as the win jingle does ---------- */
  const intro = (() => {
    const { kick, drum, snr, brass, pad, pluck, boom, crash, clank, swell, bell, note } = KIT;
    const out = gain(0, dest), rev = verb(3.4, 1.15, 1.5), dry = gain(1.05, out); rev.connect(gain(.6, out));
    const bus = (wet, lv = 1) => { const g = gain(lv, dry); g.connect(gain(wet, rev)); return g; }, DR = bus(.2, .8), LO = bus(.08, .5), BR = bus(.5, 1.5), ST = bus(.28, 1.4), FX = bus(.6), B = .5, SD = B / 4;
    /* the chord on each beat from 4 to 14: [bass, the notes over it] */
    const Dm = [38, [50, 57, 62, 65]], Bb = [34, [46, 53, 58, 62]], C = [36, [48, 55, 60, 64]], CH = [Dm, Dm, Dm, Dm, Bb, Bb, C, C, Bb, C, C];
    /* the horn line: [beat, pitch, beats] */
    const TUNE = [[4, 62, 1.5], [5.5, 65, .5], [6, 69, 2], [8, 70, 1.5], [9.5, 69, .5], [10, 67, 1], [11, 72, 1], [12, 74, 1], [13, 76, 1], [14, 77, .5], [14.5, 79, .42]];
    /* the big drums, in sixteenths of a two-beat figure: [step, level, Hz] */
    const TAIKO = [[0, 1, 78], [3, .5, 104], [4, .7, 92], [6, .6, 104], [7, .45, 118]];
    return {
      out,
      play(t) {
        const at = b => t + b * B; out.gain.cancelScheduledValues(0); out.gain.setValueAtTime(1, Math.max(0, t - .06));
        /* 0-4: the walk. A low D that is felt more than heard, a pad opening, a drum where each foot comes down, air rushing up into the first cut */
        note(LO, at(0), 26, 7.3, .13, 'sine', 200, .6, .12); note(LO, at(0), 38, 7.3, .05, 'sawtooth', 230, 1.2, .12); pad(ST, at(0), [50, 57, 62], 1.6, .028, 'sawtooth', 620, 1.5);
        boom(DR, at(0), .16, 1.8); for (const b of [1, 2, 3]) { boom(DR, at(b), .24 + b * .03, 1.2); kick(DR, at(b), .46 + b * .04, 118, 36, .42); clank(FX, at(b), .025 + b * .008, 300); }
        swell(FX, at(2), 2 * B, .06, 520, .8); brass(BR, at(2.4), 38, 1.5 * B, .05, 1000, .5); brass(BR, at(2.4), 45, 1.5 * B, .04, 1000, .5);
        /* 4-15: the battle */
        for (let b = 4; b < 15; b++) {
          const [root, ch] = CH[b - 4], last = b >= 12, on = b === 4 || b === 8 || b === 12;
          if (on) { boom(DR, at(b), .26, 1.7); crash(DR, at(b), .1, 1.5); clank(FX, at(b), .07, 392); }
          note(LO, at(b), root, B * .92, .14, 'sawtooth', 300, .012, .06); note(LO, at(b), root - 12, B * .92, .12, 'sine', 200, .012, .06);
          if (b === 4 || CH[b - 4] !== CH[b - 5]) { const n = CH.slice(b - 4).findIndex(c => c !== CH[b - 4]), d = (n < 0 ? 15 - b : n) * B; for (const m of ch) brass(BR, at(b), m, d * .96, .038, 1500, .04); pad(ST, at(b), ch, d, .022, 'sawtooth', 1100, .12); }
          for (let s = 0; s < 4; s++) { const m = [root + 12, root + 12, root + 19, root + 12][s]; pluck(ST, at(b) + s * SD, m, s ? .05 : .075, 'sawtooth', 2100, .085); pluck(ST, at(b) + s * SD, m + 12, s ? .022 : .035, 'sawtooth', 2600, .07); }
          if (!(b & 1)) for (const [s, v, f] of TAIKO) { const tt = at(b) + s * SD; drum(DR, tt, f, v * .34, .3); if (!s || s === 4) kick(DR, tt, v * .34, 128, 40, .32); }
          else { snr(DR, at(b), .11, 1700, .16); if (last) for (let s = 0; s < 4; s++) drum(DR, at(b) + s * SD, 92 + s * 9, .16 + s * .04, .22); }
          /* the roll into the name: a snare on every sixteenth, getting nearer */
          if (last) for (let s = 0; s < 4; s++) { const k = ((b - 12) * 4 + s) / 12; if (b < 14 || s < 3) snr(DR, at(b) + s * SD, .03 + k * .15, 2200, .06); }
        }
        boom(DR, at(10.8), .3, 1.5);   /* the ship */
        for (const [b, m, d] of TUNE) { brass(BR, at(b), m, d * B * .93, .12, 2300, .03); brass(BR, at(b), m - 12, d * B * .93, .075, 1500, .04); if (b >= 12) brass(BR, at(b), m + 12, d * B * .93, .03, 2800, .03); }
        swell(FX, at(12), 3 * B - .06, .1, 480, .7);
        /* 15 and 16: STOMPY. MECHS. Then let it ring */
        for (const [b, v, f] of [[15, 1, 392], [16, 1.2, 311]]) {
          boom(DR, at(b), .36 * v, 2.6); kick(DR, at(b) + .004, .4 * v, 150, 33, .75); crash(DR, at(b), .13 * v, 2.6 + (b - 15)); clank(FX, at(b), .13 * v, f); snr(DR, at(b), .16, 1500, .3);
        }
        for (const m of [38, 45, 50, 57, 62]) brass(BR, at(15), m, B * .9, .075, 2000, .012); brass(BR, at(15), 69, B * .9, .09, 2500, .012);
        for (const m of [26, 38, 45, 50, 57, 62, 65]) brass(BR, at(16), m, 2.1, m < 30 ? .05 : .07, 2200, .012); brass(BR, at(16), 74, 2.1, .1, 2700, .012); brass(BR, at(16), 86, 1.6, .02, 3000, .02);
        note(LO, at(16), 26, 3.4, .16, 'sine', 200, .01, .5); pad(ST, at(16), [50, 57, 62, 65, 69], 2.6, .03, 'sawtooth', 1200, .5);
        bell(FX, at(16), 86, .05, 1.6); bell(FX, at(17), 93, .028, 1.5); bell(FX, at(18), 81, .022, 1.5); boom(DR, at(18), .1, 2);
        return 22 * B;
      },
      stop(t, d = .04) { out.gain.cancelScheduledValues(0); out.gain.setTargetAtTime(0, t, d / 3 + .008); },
    };
  })();
  return { amb, radio, field, deck, sting, brief, intro };
}
const music = (() => {
  let ac = null, sc = null, mg = null, trk = -1, want = 0, pvK = null, pvT = 0, pvI = 0, pvHot = 0, pvNew = false, pvWas = null, stQ = null, stT = 0, slips = 0, voiceK = -1;
  const lv = { deck: -1, radio: -1, field: -1, brief: -1 }, idle = { deck: 9, radio: 9, field: 9, brief: 9 }, KEYS = ['deck', 'radio', 'field', 'brief'];
  /* which rooms hear which player, and how far ahead each is written. The radio answers to nothing in the game, so it is written well ahead: a slow frame in the bay cannot make it stumble */
  const _r = V3(), _d = V3(), LV = { deck: .95, radio: .6, field: .85, brief: .62 }, ROOM = { deck: ['hq', 'aar'], radio: ['hangar', 'bar'], field: ['field'], brief: ['brief'] }, EN = { deck: 'amb', radio: 'radio', field: 'score', brief: 'score' }, AHEAD = { deck: .3, radio: .9, field: .3, brief: .4 }, vol = () => .85 * CFG.vol * CFG.mus;
  return {
    get dbg() { return sc && { state: ac.state, t: +ac.currentTime.toFixed(2), lv, trk, slips, fight: sc.field.state, deck: [sc.deck.part, sc.deck.bar], sting: +stT.toFixed(1), radioNext: +sc.radio.next().toFixed(2), deckNext: +sc.deck.next().toFixed(2), song: sc.radio.song && { bpm: sc.radio.song.bpm | 0, key: sc.radio.song.key, step: sc.radio.song.step } }; },
    get previewing() { return pvT > 0 ? pvK : null; },
    boot(ctx) { if (sc) return; ac = ctx; const cmp = ac.createDynamicsCompressor(); cmp.threshold.value = -15; cmp.ratio.value = 5; cmp.attack.value = .01; cmp.release.value = .3; cmp.connect(ac.destination); mg = ac.createGain(); mg.gain.value = vol(); mg.connect(cmp); sc = makeScore(ac, mg, (Date.now() & 0xfffff) + 3); sc.deck.start(ac.currentTime + .2); sc.radio.start(ac.currentTime + .2); },
    /* the opening's cue. clock(): where the audio clock stands, -1 while the browser is holding it for a click, -2 if there is no audio at all. intro() starts the cue and says when on
       that clock its first beat falls (-1: it could not), introStop(d) fades it over d seconds */
    clock() { return !sc ? -2 : ac.state === 'running' ? ac.currentTime : -1; },
    intro() { if (!sc || ac.state !== 'running') return -1; const t = ac.currentTime + .1; sc.intro.play(t); return t; },
    introStop(d = .04) { if (sc) sc.intro.stop(ac.currentTime, d); },
    /* re-read the volume sliders */
    vol() { if (mg) mg.gain.setTargetAtTime(vol(), ac.currentTime, .06); },
    beat() { return sc && lv.radio > 0 && vol() > 0 ? sc.radio.beat(ac.currentTime) : -1; },
    /* which of the seven mission scores plays in the field */
    track(i) { want = i | 0; trk = -1; },
    /* the jingle for a contract won; the deck theme then starts from the top underneath its last chord */
    sting(k = 'win') { if (CFG.jingle) stQ = k; },
    /* settings screen: audition something for a few seconds wherever you are. 'field': mission score i, in its combat arrangement if hot · 'deck': i = 0 NIGHT WATCH, 1 the ambience · 'sting': the jingle */
    preview(k, i = 0, secs = 14, hot = 0) { pvK = k; pvT = k ? secs : 0; pvI = i | 0; pvHot = hot ? 1 : 0; pvNew = !!k; },
    /* called every frame: fade each score with the room, keep a little of it scheduled ahead, and place the radio (or the jukebox) in the stereo field */
    update(dt, room, cam, src, heat = 0) {
      if (!sc || ac.state !== 'running') return; const now = ac.currentTime; if (pvT > 0) pvT -= dt; if (stT > 0) stT -= dt; const pv = pvT > 0 ? pvK : null, wt = pv === 'field' ? pvI : want;
      if (pvWas === 'deck' && pv !== 'deck' && room !== 'hq') idle.deck = 99;   /* a deck preview heard from elsewhere leaves no bookmark */
      pvWas = pv; if (pvNew) { pvNew = false; if (pv === 'deck') sc.deck.start(now + .15, pvI); else if (pv === 'sting') sc.sting.play('win', now + .15); else if (pv === 'field') trk = -1; }
      if (stQ) { stT = sc.sting.play(stQ, now + .25) + .25; sc.deck.start(now + stT - 1.6); stQ = null; }
      if (wt !== trk && (room === 'field' || pv === 'field')) { trk = wt; sc.field.use(trk, now + .1); }
      for (const k of KEYS) {
        const on = pv ? k === pv : CFG[EN[k]] && ROOM[k].includes(room), w = on ? 1 : 0, P = sc[k];
        if (w !== lv[k]) { if (w && k === 'brief') P.start(now + .9); if (w && k === 'deck' && !pv && idle.deck > 30 && stT <= 0) P.start(now + .4);   /* back on the deck after a while away: NIGHT WATCH from the top */
          lv[k] = w; P.out.gain.setTargetAtTime(w * LV[k], now, w ? .6 : .35); }
        idle[k] = w ? 0 : idle[k] + dt; if (idle[k] > 2.5) continue; const n = P.next(); if (n < now + .02) { P.shift(now + .06 - n); if (w) slips++; } P.tick(now + AHEAD[k]);
      }
      if (lv.field > 0) sc.field.heat(pv ? pvHot : heat);
      /* the same band in both rooms: through the small set on the control desk in the bay, at full width from the jukebox in the bar. Its level holds steady wherever the camera goes; only its place between the speakers moves */
      const bar = room === 'bar'; if (bar || room === 'hangar') { const v = bar ? 1 : 0; if (v !== voiceK) { sc.radio.voice(v, now, voiceK < 0 ? .01 : .3); voiceK = v; } }
      if ((bar || room === 'hangar') && cam && src) { _d.subVectors(src, cam.position); const d = _d.length(); _r.setFromMatrixColumn(cam.matrixWorld, 0); sc.radio.pan.pan.setTargetAtTime(clamp(_d.dot(_r) / (d || 1) * .35, -.35, .35), now, .4); sc.radio.dist.gain.setTargetAtTime(clamp(1.06 - d / (bar ? 90 : 420), .86, 1), now, .4); }
    },
  };
})();

