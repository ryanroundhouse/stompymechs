/* ============ THE BAR: THE TWO TABLES — A DRINKING CONTEST AND ARM WRESTLING, BOTH FOR MONEY ============ */
const BAR_STAKE = [1000, 5000, 20000];
/* tol: the round after which the house champion starts to spill · str / add: how hard the table boss holds, and how much a surge adds · cam: where the contest is watched from.
   The numbers were set with .scratch/v6/sim_drink.py and sim_arm.py: the first stake is there to be won, the last one is a coin toss for a good player */
const BGT = {
  drink: { name: 'DRINKING CONTEST', hit: 'DRINK', tol: [3, 5, 7], cam: [[-2.05, 1.5, 1.2], [-4.6, .7, 1.2]] },
  arm: { name: 'ARM WRESTLING', hit: 'PULL', str: [.24, .3, .35], add: [.2, .24, .28], cam: [[3.55, 1.5, .6], [5.6, .72, .6]] },
};
BAR.me = {}; BAR.gSeat = { drink: barSit(-4.6, 2, PI, 'chair', 'fwd'), arm: barSit(5.6, 1.15, PI, 'chair', 'fwd') };
/* put a hand on a point in the world: two-bone IK on one arm (0 right, 1 left), bending toward `hint`. Run it after the figure's own update, which it overrides */
const _ik = { S: V3(), H: V3(), E: V3(), ax: V3(), u: V3(), f: V3(), X: V3(), Y: V3(), Z: V3(), m: new THREE.Matrix4(), C: V3(), P: V3(), Q: V3() };
function humReach(h, i, H, hint) {
  const A = h.arm[i], par = A.sh.parent, a = -A.el.position.y, b = -A.hand.position.y + .05 * h.k, K = _ik;
  par.updateWorldMatrix(true, false); K.S.copy(A.sh.position); par.worldToLocal(K.H.copy(H)); par.worldToLocal(K.E.copy(hint));
  K.ax.subVectors(K.H, K.S); const d = clamp(K.ax.length(), Math.abs(a - b) + .01, a + b - .004); K.ax.normalize();
  const along = (a * a - b * b + d * d) / (2 * d), rad = Math.sqrt(Math.max(0, a * a - along * along));
  K.E.sub(K.S).addScaledVector(K.ax, -K.E.dot(K.ax)); if (K.E.lengthSq() < 1e-7) K.E.set(0, 0, -1); K.E.normalize();   /* the way the elbow leans off the shoulder-to-hand line */
  K.u.copy(K.ax).multiplyScalar(along).addScaledVector(K.E, rad); K.f.copy(K.ax).multiplyScalar(d).sub(K.u).normalize(); K.u.normalize();
  K.X.crossVectors(K.u, K.f); if (K.X.lengthSq() < 1e-8) K.X.set(-1, 0, 0); K.X.normalize().negate(); K.Y.copy(K.u).negate(); K.Z.crossVectors(K.X, K.Y);
  A.sh.quaternion.setFromRotationMatrix(K.m.makeBasis(K.X, K.Y, K.Z)); A.el.rotation.x = -Math.acos(clamp(K.u.dot(K.f), -1, 1));
}
/* you, across the table: only ever seen during a contest */
function barMe(kind) {
  const h = new Human(lookOf(457, { build: 'avg', h: 1.76, headset: false, glasses: false }), { scene: BAR.scene, role: 'officer', col: '#ffb21a', props: kind === 'drink' ? { r: 'mug' } : null, fit: { sleeves: 1 } });
  BAR.crowd.add(h); h.g.visible = false; return h;
}
function talkHost(kind) {
  const ch = BARC[kind], H = BAR.P[kind], D = kind === 'drink', won = BARSV.wins[kind], back = [['Back', () => talkHost(kind)], ['Leave', dlgClose]];
  const hi = D ? (won ? ['Back for more? My head still hurts from the last time.', 'You. Sit. I want my record back.'] : ['Nobody has put me under this table. You are welcome to pay to try.', 'Sit down, Commander. First to spill three goes home poorer.'])
    : (won ? ['My arm remembers you. Sit. I owe you one.', 'Twice does not happen. Put your elbow down.'] : ['Elbow on the pad, other hand on the peg. Money on the table first.', 'I lift actuator housings for a living. You sign papers. Sit down.']);
  dlg(ch, pick(hi) + (barBuzz() > .6 ? '\n\n(You are in no state for this.)' : ''), [
    ...BAR_STAKE.map((s, i) => [`${['A friendly one', 'A serious one', 'For the house record'][i]} — stake ${fmt(s)}, winner takes ${fmt(s * 2)}`, () => barGameOpen(kind, i), CO.cb < s]),
    ['How does it work?', () => dlg(ch, D ? 'We drink round for round. A marker swings across the bar: hit SPACE (or click) while it is in the green and you put the glass away clean. Miss the green, or dither, and you spill. Three spills and you are done.\nEvery round the green gets narrower and the swing gets faster — and every glass you have already had tonight makes it worse. I start to feel it too, eventually. The bigger the stake, the longer I last.'
      : 'Hands locked, elbows down. Hammer SPACE (or click) to pull: the faster you hammer, the harder you pull — and the faster your strength goes. With none left you have a third of your pull. A steady pull you can keep up all night.\nI come off the mark hard. Then watch me: when I wind up, a surge is coming, so brace through it. Right after, I am spent for a moment — take your ground then. Get me past the tipping point and I fold; the same goes for you. Nobody pinned inside a minute, and whoever is ahead takes it. The bigger the stake, the harder I pull. Drink does not help you here.', back, H)],
    ['Not tonight', dlgClose]], H);
}
async function barGameOpen(kind, tier) {
  const stake = BAR_STAKE[tier]; if (busy || BAR.game || mode !== 'bar') return; if (!spend(stake, 'stake')) return sfx.play('deny'); tal(kind === 'drink' ? 'b.gd.n' : 'b.ga.n'); busy = true; dlgClose(); blackout(true); await tween(.3, fade);
  const D = kind === 'drink', T = BGT[kind], host = BAR.P[kind], me = BAR.me[kind] || (BAR.me[kind] = barMe(kind)), S = BAR.gSeat[kind];
  const G = { kind, tier, stake, host, me, ph: 'ready', pt: 0, res: null, msgK: '', r: 1, pos: .5, sph: 0, w: .19, you: [], opp: [], ys: 0, os: 0, last: '', oc: true, x: 0, xs: 0, push: 0, stam: 1, fat: 0, sg: 0, sT: rand(1.2, 2.2), sk: 1, day: rand(.88, 1.14), of: 0 };
  G.ho = { ...host.sp.o, arm: D ? 0 : 1, k: 0, sip: 0, wob: 0, out: 0, strain: 0 }; G.mo = { ...S.o, arm: D ? 0 : 1, k: 0, sip: 0, wob: 0, out: 0, strain: 0 };
  host.co = null; host.setAct('bout', G.ho); host.seat = G.ho; host.look = me; host.path.length = 0; host.g.position.set(host.sp.x, 0, host.sp.z); host.yaw = host.sp.yaw;
  me.g.visible = true; me.g.position.set(S.x, 0, S.z); me.yaw = S.yaw; me.g.rotation.y = S.yaw; me.setAct('bout', G.mo); me.seat = G.mo; me.look = host;
  barCam.focus = { pos: V3(...T.cam[0]), look: V3(...T.cam[1]) }; barCam.cPos.copy(barCam.focus.pos); barCam.cLook.copy(barCam.focus.look);
  $('barUI').classList.add('hid'); $('barGame').classList.remove('hid'); $('bgName').textContent = `${T.name} · ${BARC[kind].name.toUpperCase()}`; $('bgStake').textContent = `STAKE ${fmt(stake)} · WINNER TAKES ${fmt(stake * 2)}`;
  $('bgHit').textContent = `${T.hit} [SPACE]`; $('bgQuit').classList.remove('hid'); BAR.game = G; barGameTick(0, 0); busy = false; await tween(.35, k => fade(1 - k)); blackout(false);
}
function barGameHit() {
  const G = BAR.game; if (!G || busy) return;
  if (G.ph === 'end') { if (G.pt > .7) barGameClose(); return; }
  if (G.kind === 'drink') { if (G.ph === 'aim') barDrinkHit(G, false); return; }
  if (G.ph !== 'play') return; G.push += .5 * (.25 + .75 * Math.min(1, G.stam / .5)) * (1 - .3 * barBuzz()) * (1 - G.push); sfx.play('step', .25);   /* the press rate sets the pull; with no strength left a press is worth a third */
}
function barDrinkHit(G, late) {
  const ok = !late && Math.abs(G.pos - .5) <= G.w; G.you.push(ok); if (!ok) G.ys++; G.last = ok ? 'DOWN IN ONE' : late ? 'TOO SLOW — SPILLED' : 'SPILLED'; G.ph = 'you'; G.pt = 0; if (ok) tal('b.glass'); barBuzzAdd(.06); sfx.play(ok ? 'gulp' : 'glass');
}
function barGameTick(dt, t) {
  const G = BAR.game, D = G.kind === 'drink', bz = barBuzz(), sipK = (p, n) => smooth(clamp(Math.min(p / .25, (n - p) / .25), 0, 1)); G.pt += dt; let msg = '';
  if (G.ph === 'end') { /* the result stays up until it is dismissed */ }
  else if (D) {
    const tol = BGT.drink.tol[G.tier]; G.mo.wob = bz; G.ho.wob = clamp((G.r - tol + 1.5) / 5, 0, 1) + G.os * .12;
    if (G.ph === 'ready') { G.w = clamp(.2 - .011 * G.r - .08 * bz, .06, .2); msg = 'GLASSES UP…'; if (G.pt > 1.1) { G.ph = 'aim'; G.pt = 0; G.sph = rand(TAU); } }
    else if (G.ph === 'aim') { G.sph += dt * (2.2 + .22 * G.r) * (1 + .45 * bz * Math.sin(t * 2.3)); G.pos = .5 + .5 * Math.sin(G.sph); msg = 'SPACE or CLICK while the marker is in the green'; if (G.pt > 6) barDrinkHit(G, true); }
    else if (G.ph === 'you') { G.mo.sip = sipK(G.pt, 1); msg = `ROUND ${G.r} — YOUR GLASS`; if (G.pt > 1) { G.ph = 'opp'; G.pt = 0; G.oc = Math.random() >= clamp(.04 + (G.r - tol) * .22, .04, .9); sfx.play('gulp', .7); } }
    else if (G.ph === 'opp') {
      G.ho.sip = sipK(G.pt, 1.1); msg = `ROUND ${G.r} — ${BARC.drink.first.toUpperCase()}'S GLASS`;
      if (G.pt > 1.1) { G.opp.push(G.oc); if (!G.oc) { G.os++; sfx.play('glass'); } if (G.ys >= 3 || G.os >= 3) barGameEnd(G.ys >= 3 && G.os >= 3 ? 'draw' : G.os >= 3 ? 'win' : 'lose'); else { G.r++; G.ph = 'ready'; G.pt = 0; } }
    }
  } else {
    const T = BGT.arm;
    if (G.ph === 'ready') { msg = G.pt < .7 ? 'ELBOWS DOWN…' : 'READY…'; if (G.pt > 1.4) { G.ph = 'play'; G.pt = 0; sfx.play('thud'); } }
    else {
      /* your pull bleeds away in a third of a second, and costs strength by its square: a burst is strong and short, a steady pull lasts */
      G.push *= Math.exp(-3.2 * dt); G.stam = clamp(G.stam + dt * (.07 - .9 * G.push * G.push), 0, 1); G.fat = clamp(G.fat + dt * (.016 + G.push * .04), 0, 1);
      /* the table boss: holds, winds up, surges, and is spent for a moment afterwards. He comes off the mark hard, tires slowly, digs in as he loses ground — and past the tipping point whoever is losing folds */
      if ((G.sT -= dt) < 0) { G.sg = (G.sg + 1) % 4; G.sT = [rand(2.6, 4.6) - G.tier * .4, .8, rand(1, 1.7), 1.2][G.sg]; if (G.sg === 2) { G.sk = rand(.6, 1.45); sfx.play('thud', .6); } }
      const tip = .55, lev = (1 + .3 * Math.min(G.x, tip)) * (1 - .75 * Math.max(0, G.x - tip) / (1 - tip));
      G.of = T.str[G.tier] * G.day * (1 - .4 * G.fat) * lev * (G.sg === 3 ? .5 : 1) + (G.sg === 2 ? T.add[G.tier] * G.sk : 0) + .22 * Math.exp(-G.pt / 2.5);
      G.x = clamp(G.x + (G.push * (1 - .4 * Math.max(0, -G.x - tip) / (1 - tip)) - G.of) * dt * 1.15, -1, 1);
      msg = G.stam < .12 ? 'NOTHING LEFT — EASE OFF AND GET YOUR STRENGTH BACK' : ['SPACE or CLICK to pull — faster is harder, and costs more', `${BARC.arm.first.toUpperCase()} IS WINDING UP — BRACE`, 'SURGE!', 'HE IS SPENT — TAKE GROUND NOW'][G.sg];
      if (Math.abs(G.x) >= 1) barGameEnd(G.x > 0 ? 'win' : 'lose'); else if (G.pt > 60) barGameEnd(G.x > .15 ? 'win' : G.x < -.15 ? 'lose' : 'draw');
    }
    G.xs = damp(G.xs, G.x, 12, dt); G.ho.k = -G.xs; G.mo.k = G.xs; G.ho.strain = clamp(G.of * 2, 0, 1); G.mo.strain = clamp(G.push * 2, 0, 1);
  }
  if (G.ph !== 'end' && msg !== G.msgK) { G.msgK = msg; $('bgMsg').textContent = msg; }
  barGameDraw(G, t);
}
/* after everyone has been posed: lock the hands together over the middle of the table, elbows on the pads, the free hands on the pegs */
function barGamePose(G) {
  if (G.kind !== 'arm') return; const K = _ik, th = G.xs * 1.42, r = .27, cx = 5.6, cy = .775, cz = .6; K.C.set(cx - Math.sin(th) * r, cy + Math.cos(th) * r, cz);
  for (const [h, s] of [[G.host, -1], [G.me, 1]]) { const b = .305 * h.k; humReach(h, 0, K.C, K.P.set(cx, cy - 1.2, cz + s * Math.sqrt(Math.max(.0004, b * b - r * r)))); humReach(h, 1, K.P.set(cx - s * .34, .86, cz + s * .2), K.Q.set(cx - s * .6, .6, cz + s * .55)); }
}
function barGameDraw(G, t) {
  const g = $('bgCv').getContext('2d'), W = 720, F = '11px Menlo,Consolas,monospace'; g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, W, 132); g.textBaseline = 'middle'; g.font = F;
  const txt = (s, x, y, c = '#e6dfcf', a = 'left', f = F) => { g.font = f; g.fillStyle = c; g.textAlign = a; g.fillText(s, x, y); }, big = 'bold 14px Menlo,Consolas,monospace';
  if (G.kind === 'drink') {
    const row = (L, name, n, x, a) => { txt(name, x, 12, '#8b8474', a); L.slice(-14).forEach((ok, i) => { const px = a === 'left' ? x + i * 17 : x - 12 - i * 17; g.fillStyle = ok ? '#ffb21a' : '#ff5a1f'; if (ok) g.fillRect(px, 24, 12, 16); else { g.fillRect(px, 36, 12, 4); g.fillRect(px + 4, 24, 4, 9); } }); txt(`SPILLS ${n}/3`, x, 52, n > 1 ? '#ff5a1f' : '#8b8474', a); };
    row(G.you, 'YOU', G.ys, 24, 'left'); row(G.opp, BARC.drink.first.toUpperCase(), G.os, W - 24, 'right'); txt(`ROUND ${G.r}`, W / 2, 14, '#fff', 'center', big);
    const x0 = 60, bw = W - 120, y = 76, h = 30; g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(x0, y, bw, h); g.strokeStyle = 'rgba(255,178,26,.4)'; g.lineWidth = 1; g.strokeRect(x0 + .5, y + .5, bw - 1, h - 1);
    if (G.ph === 'aim' || G.ph === 'ready') { g.fillStyle = 'rgba(141,255,106,.28)'; g.fillRect(x0 + (.5 - G.w) * bw, y, 2 * G.w * bw, h); g.fillStyle = '#8dff6a'; g.fillRect(x0 + (.5 - G.w) * bw, y, 2, h); g.fillRect(x0 + (.5 + G.w) * bw - 2, y, 2, h); }
    if (G.ph === 'aim') { g.fillStyle = '#fff'; g.fillRect(x0 + G.pos * bw - 2, y - 6, 4, h + 12); g.fillStyle = 'rgba(255,178,26,.7)'; g.fillRect(x0, y + h + 8, bw * clamp(1 - G.pt / 6, 0, 1), 2); }
    else if (G.ph === 'you') txt(G.last, W / 2, y + h / 2, G.last === 'DOWN IN ONE' ? '#8dff6a' : '#ff5a1f', 'center', big);
    else if (G.ph === 'opp') txt(G.pt > .75 ? (G.oc ? 'CLEAN' : 'SPILLED') : '…', W / 2, y + h / 2, G.pt > .75 && !G.oc ? '#8dff6a' : '#e6dfcf', 'center', big);
  } else {
    const x0 = 80, bw = W - 160, y = 26, h = 28, c = x0 + bw / 2, mx = x0 + (G.xs * .5 + .5) * bw; txt('PINNED', x0 - 10, y + h / 2, '#ff5a1f', 'right'); txt('WIN', x0 + bw + 10, y + h / 2, '#8dff6a', 'left');
    g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(x0, y, bw, h); g.fillStyle = G.xs >= 0 ? 'rgba(141,255,106,.45)' : 'rgba(255,90,31,.5)'; g.fillRect(Math.min(c, mx), y, Math.abs(mx - c), h);
    g.strokeStyle = 'rgba(255,178,26,.4)'; g.lineWidth = 1; g.strokeRect(x0 + .5, y + .5, bw - 1, h - 1); g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(c - .5, y - 4, 1, h + 8); g.fillStyle = '#fff'; g.fillRect(mx - 2, y - 6, 4, h + 12);
    const bar = (x, w, label, v, col, a) => { txt(label, a === 'left' ? x : x + w, 84, '#8b8474', a); g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(x, 96, w, 12); g.fillStyle = col; g.fillRect(a === 'left' ? x : x + w * (1 - v), 96, w * v, 12); };
    bar(24, 300, `YOUR STRENGTH${G.stam < .2 ? ' — EASE OFF' : ''}`, G.stam, G.stam < .2 ? '#ff5a1f' : '#ffb21a', 'left'); for (const k of [-.55, .55]) { g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x0 + (k * .5 + .5) * bw - .5, y, 1, h); }   /* the tipping points */
    bar(W - 324, 300, `${BARC.arm.first.toUpperCase()} — ${['HOLDING', 'WINDING UP', 'SURGE', 'SPENT'][G.sg]}`, clamp(G.of / .6, .03, 1), G.sg === 2 || (G.sg === 1 && Math.sin(t * 22) > 0) ? '#ff5a1f' : G.sg === 3 ? '#8dff6a' : '#9fb7bd', 'right');
  }
}
function barGameEnd(res) {
  const G = BAR.game; if (!G || G.ph === 'end') return; const D = G.kind === 'drink', nm = BARC[G.kind].first; G.ph = 'end'; G.res = res; G.pt = 0;
  if (res === 'win') { CO.cb += G.stake * 2; tal('cr.won', G.stake * 2); tal(D ? 'b.gd.w' : 'b.ga.w'); BARSV.wins[G.kind]++; sfx.play('ok'); if (BARSV.wins[G.kind] === 1) news(D ? `${YARD.name}'s commander drank ${nm} under her own table at the Last Round.` : `${YARD.name}'s commander put ${nm}'s arm down at the Last Round.`); }
  else if (res === 'draw') { CO.cb += G.stake; sfx.play('ui'); } else sfx.play(D ? 'thud' : 'deny');
  if (D) { if (G.os >= 3) G.ho.out = 1; if (G.ys >= 3) G.mo.out = 1; } else { G.push = 0; G.x = res === 'win' ? 1 : res === 'lose' ? -1 : G.x; }
  $('bgMsg').innerHTML = res === 'win' ? `<b style="color:#8dff6a">YOU WIN — ${fmt(G.stake * 2)} IS YOURS.</b> ${D ? `${nm} is face down on the table.` : `${nm}'s knuckles are on the wood.`}` : res === 'draw' ? `<b style="color:#ffb21a">A DRAW — STAKES RETURNED.</b> ${D ? 'Neither of you can find the glass.' : 'Time. Nobody gave an inch.'}`
    : `<b style="color:#ff5a1f">YOU LOSE — ${fmt(G.stake)} GONE.</b> ${D ? 'The room is moving and you are not.' : `${nm} lets go of what is left of your hand.`}`;
  $('bgHit').textContent = 'CONTINUE [SPACE]'; $('bgQuit').classList.add('hid'); CO.dirty = BAR.dirty = true; saveCO();
}
/* clear the table: the overlay goes, the champion goes back to their evening, and you are no longer in the picture */
function barGameDrop() { const G = BAR.game; if (!G) return; $('barGame').classList.add('hid'); if (mode === 'bar') $('barUI').classList.remove('hid'); G.me.g.visible = false; G.me.look = null; G.host.look = null; G.host.co = G.host.brain(G.host); BAR.game = null; barCam.focus = null; }
async function barGameClose() {
  const G = BAR.game; if (!G || busy) return; busy = true; blackout(true); await tween(.3, fade); const D = G.kind === 'drink', ch = BARC[G.kind], H = G.host, out = D && G.ys >= 3;
  barGameDrop();
  if (out) tickClock(60);   /* out cold: the next thing you know is six hours on */
  BAR.dirty = true; saveCO(); busy = false; await tween(.35, k => fade(1 - k)); blackout(false);
  const bye = [['Leave', dlgClose]]; let r = null;
  if (G.res === 'win') { r = barRumour('host'); dlg(ch, `${D ? pick(['...Nobody... tell Mother.', 'Fine. Fine! Take it. The room can stop now.']) : pick(['Huh. Papers must be heavier than they look.', 'That does not happen. Take your money.'])}${r ? `\n\nYou earned something for that. ${r.head} ${r.s}\n\n${barFoot(r)}` : ''}`, [['Collect your winnings', dlgClose]], H); }
  else if (G.res === 'lose') dlg(ch, G.quit ? 'Walking away? The stake stays on the table.' : out ? 'You were out for six hours. I had them put you in the booth. Same time next week?' : D ? pick(['Three on the floor. That is the game. Come back when you can hold a glass.', 'Mother will want that mopped up.']) : pick(['Ice it. Come back when it works again.', 'Stick to signing papers, Commander.']), bye, H);
  else dlg(ch, D ? 'Call it even. I cannot see the table either.' : 'Even. You are stronger than you look.', bye, H);
}
{
  $('barGame').addEventListener('pointerdown', e => { if (e.target.closest('button')) return; e.preventDefault(); barGameHit(); });
  $('bgHit').onclick = e => { e.currentTarget.blur(); barGameHit(); }; $('bgQuit').onclick = () => { const G = BAR.game; if (!G || G.ph === 'end') return; G.quit = true; barGameEnd('lose'); G.pt = 1; barGameClose(); };
  addEventListener('keydown', e => { if (!BAR.game || mode !== 'bar') return; if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); if (!e.repeat) barGameHit(); } });
}

