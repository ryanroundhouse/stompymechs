/* ============ THE BOARDS: THE RECORD, A FEW LINES AT A TIME, IN THE BAY, ON THE DECK AND BEHIND THE BAR ============ */
/* Each board is a canvas on a wall with a few slots. Every few seconds one slot is dealt another line out of the record (talRows, 117_stats.js): whatever is not
   on the board already and has not been lately, with every section given a fair turn however many lines it has. A line that changes while it is up is kept
   current. The board of the room showing is the only one that is drawn, and only when something on it has changed (a board with a crawl draws at its own rate). */
const TALB = { all: [], feed: [], feedT: -1e9 };
/* what there is to show: everything that stands at more than nothing, or for a company with no history yet the lines that are worth showing at nothing */
function talFeed() {
  const n = performance.now(); if (n - TALB.feedT < 1000) return TALB.feed; TALB.feedT = n;
  let R = talRows(false); if (R.length < 14) R = talRows(true); return TALB.feed = R;
}
function talDeal(B) {
  const F = talFeed(), on = new Set(B.hist); for (const s of B.slots) on.add(s.id); let pool = F.filter(r => !on.has(r.g + '|' + r.l)); if (!pool.length) pool = F; if (!pool.length) return null;
  const by = {}; for (const r of pool) (by[r.g] || (by[r.g] = [])).push(r); let tot = 0; for (const g in by) tot += Math.sqrt(by[g].length);
  let x = Math.random() * tot, L = null; for (const g in by) { L = by[g]; if ((x -= Math.sqrt(L.length)) < 0) break; }
  const r = pick(L), id = r.g + '|' + r.l; B.hist.push(id); while (B.hist.length > Math.min(30, F.length >> 1)) B.hist.shift(); return { id, g: r.g, l: r.l, v: r.v, age: 0 };
}
/* a line arriving: its letters settle from the left */
const TAL_GLY = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
const talScr = (s, k) => { if (k >= 1) return s; const n = Math.floor(s.length * k); let o = s.slice(0, n); for (let i = n; i < s.length; i++) o += s[i] === ' ' ? ' ' : TAL_GLY[(Math.random() * 33) | 0]; return o; };
/* o: rooms it is seen from, w and h of the canvas, n slots, every (seconds between deals), idle (pictures a second when nothing is arriving; 0 for none), glow, draw(B, g, t, dt) */
function talBoard(o) {
  const cv = document.createElement('canvas'); cv.width = o.w; cv.height = o.h; const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
  const mat = new THREE.MeshBasicMaterial({ map: tx }); mat.color.setScalar(o.glow || 1.4);
  const B = { idle: 0, every: 3.2, ...o, cv, g: cv.getContext('2d'), tx, mat, slots: [], hist: [], wait: 0, turn: 0, acc: 9, live: 0, dirty: true, key: '' }; TALB.all.push(B); return B;
}
function talBoardTick(B, dt, t) {
  let moving = false; B.wait -= dt;
  if (!B.slots.length) { for (let i = 0; i < B.n; i++) { const s = talDeal(B); if (s) { s.age = -i * .35; B.slots.push(s); } } B.wait = B.every; }
  else if (B.wait <= 0) { const s = talDeal(B); if (s) B.slots[B.turn % B.slots.length] = s; B.turn = (B.turn + 1) % B.n; B.wait = B.every; }
  /* the frame a line finishes arriving is drawn whatever the rate: after it nothing moves, so a picture skipped here would leave the shuffle's last letters standing */
  for (const s of B.slots) { if (s.age < 1) { moving = true; if ((s.age += dt / .75) >= 1) B.dirty = true; } }
  if ((B.live -= dt) < 0) {
    B.live = 1; const F = talFeed(), k = YARD.name + YARD.logoV; if (k !== B.key) { B.key = k; B.dirty = true; }
    for (const s of B.slots) { const r = F.find(r => r.l === s.l && r.g === s.g); if (r && r.v !== s.v) { s.v = r.v; B.dirty = true; } }
  }
  B.acc += dt; const fps = moving ? 30 : B.idle; if (!B.dirty && !(fps && B.acc >= 1 / fps)) return;
  const el = B.acc; B.acc = 0; B.dirty = false; B.draw(B, B.g, t, Math.min(el, .2)); B.tx.needsUpdate = true;
}
/* once a frame from the main loop */
function talBoards(dt, t) { for (const B of TALB.all) if (B.rooms.includes(mode)) talBoardTick(B, dt, t); }
const TAL_FONT = 'Menlo,Consolas,monospace';

/* a label too long for one line of a board is broken in two near its middle */
const talWrap = (s, n) => { if (s.length <= n) return [s]; const W = s.split(' '); let k = 0, i = 0; while (i < W.length - 1 && k + W[i].length < s.length / 2) k += W[i++].length + 1; return [W.slice(0, i).join(' '), W.slice(i).join(' ')]; };

/* ---- the bay: a panel hung on each end of both gantry towers between the middle decks, so one of them faces the stand's camera wherever it has been dragged to ---- */
{
  const B = talBoard({ rooms: ['hangar'], w: 1024, h: 600, n: 2, every: 4.2, glow: 1.55, draw(B, g) {
    g.fillStyle = '#05080a'; g.fillRect(0, 0, 1024, 600); g.strokeStyle = '#d9a316'; g.lineWidth = 8; g.strokeRect(4, 4, 1016, 592);
    g.textBaseline = 'alphabetic'; g.textAlign = 'left'; g.fillStyle = '#ffb21a'; g.font = `bold 40px ${TAL_FONT}`; g.fillText('THE RECORD', 28, 58); g.fillRect(28, 76, 968, 4);
    drawLogo(g, 968, 42, 26); g.textAlign = 'right'; g.fillStyle = '#e6dfcf'; g.font = `bold 30px ${TAL_FONT}`; g.fillText(YARD.name, 930, 54, 560); g.textAlign = 'left';
    B.slots.forEach((s, i) => {
      const y = 84 + i * 256, k = clamp(s.age, 0, 1); if (s.age < 0) return;
      if (k < 1) { g.fillStyle = `rgba(255,178,26,${.3 * (1 - k)})`; g.fillRect(12, y + 4, 1000, 248); }
      if (i) { g.fillStyle = 'rgba(255,178,26,.3)'; g.fillRect(28, y, 968, 3); }
      const L = talWrap(s.l, 24); g.fillStyle = '#9fe9ff'; g.font = `bold 52px ${TAL_FONT}`; L.forEach((l, j) => g.fillText(talScr(l, k * 1.6), 28, y + 62 + j * 56, 968));
      g.fillStyle = '#ffffff'; g.font = `bold ${L.length > 1 ? 100 : 124}px ${TAL_FONT}`; g.textAlign = 'right'; g.fillText(talScr(s.v, k), 996, y + 236, 968); g.textAlign = 'left';
    });
  } });
  for (const s of [-1, 1]) for (const f of [-1, 1]) {
    const t = HG['tower' + s]; box(t, M.dark, 10.1, 6.1, .3, 0, 15.1, f * 4.05); for (const x of [-2.3, 2.3]) box(t, M.girder, .3, .3, .5, x, 15.1, f * 3.75);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 5.625), B.mat); m.position.set(0, 15.1, f * 4.22); if (f < 0) m.rotation.y = PI; t.add(m);
  }
  HG.statB = B;
}
/* ---- the deck: a long strip hung from the roof girders over the window onto the bay ---- */
{
  const sc = HQ.scene, B = talBoard({ rooms: ['hq'], w: 1920, h: 192, n: 3, every: 3, glow: 1.45, draw(B, g) {
    g.fillStyle = '#04090c'; g.fillRect(0, 0, 1920, 192); g.fillStyle = '#12303a'; g.fillRect(0, 0, 1920, 4); g.fillRect(0, 188, 1920, 4); g.textBaseline = 'alphabetic';
    B.slots.forEach((s, i) => {
      const x = i * 640, k = clamp(s.age, 0, 1); if (i) { g.fillStyle = '#1d4a58'; g.fillRect(x, 22, 2, 148); } if (s.age < 0) return;
      if (k < 1) { g.fillStyle = `rgba(95,216,255,${.26 * (1 - k)})`; g.fillRect(x + 4, 6, 632, 180); }
      g.fillStyle = '#ffb21a'; g.fillRect(x + 26, 30, 6, 132);
      const L = talWrap(s.l, 29), two = L.length > 1; g.textAlign = 'left'; g.fillStyle = '#7fe7ff'; g.font = `bold ${two ? 27 : 32}px ${TAL_FONT}`; L.forEach((l, j) => g.fillText(talScr(l, k * 1.6), x + 50, (two ? 46 : 62) + j * 30, 566));
      g.fillStyle = '#ffffff'; g.font = `bold ${two ? 76 : 88}px ${TAL_FONT}`; g.fillText(talScr(s.v, k), x + 50, two ? 162 : 158, 566);
    });
  } });
  box(sc, M.dark, 15.5, 1.86, .18, 0, 6.12, -9.62); for (const x of [-6, 6]) box(sc, M.girder, .12, .5, .12, x, 7.05, -9.62);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(15, 1.5), B.mat); m.position.set(0, 6.12, -9.52); sc.add(m); HQ.statB = B;
}
/* ---- the bar: the set over the far end of the back bar. One line at a time, big enough to read from the door, and the rest of it crawling along underneath ---- */
{
  const sc = BAR.scene, CR = { x: 0, s: '', w: 0 }, B = talBoard({ rooms: ['bar'], w: 640, h: 320, n: 1, every: 6, idle: 24, glow: 1.35, draw(B, g, t, dt) {
    g.fillStyle = '#0a0705'; g.fillRect(0, 0, 640, 320); g.textBaseline = 'alphabetic'; g.textAlign = 'left'; g.fillStyle = '#ff8a3a'; g.fillRect(0, 0, 640, 6);
    const s = B.slots[0];
    if (s && s.age >= 0) {
      const k = clamp(s.age, 0, 1), L = talWrap(s.l, 20); if (k < 1) { g.fillStyle = `rgba(255,138,58,${.3 * (1 - k)})`; g.fillRect(0, 6, 640, 264); }
      g.fillStyle = '#ffe9c4'; g.font = `bold 44px ${TAL_FONT}`; L.forEach((l, j) => g.fillText(talScr(l, k * 1.6), 18, 62 + j * 50, 604));
      g.fillStyle = '#ffb21a'; g.font = `bold ${L.length > 1 ? 104 : 128}px ${TAL_FONT}`; g.fillText(talScr(s.v, k), 18, 252, 604);   /* everything from the left: the far end of the set is behind the hiring list from the door */
    }
    /* the crawl: a dozen other lines end to end, and a new dozen when those have gone by */
    g.fillStyle = '#1c0f08'; g.fillRect(0, 272, 640, 48); g.fillStyle = '#ff8a3a'; g.fillRect(0, 272, 640, 2); g.font = `26px ${TAL_FONT}`;
    if (!CR.s || CR.x + CR.w < 0) { const F = talFeed(), L = []; for (let i = 0; i < 12 && F.length; i++) { const r = pick(F); L.push(`${r.l}  ${r.v}`); } CR.s = L.join('   ◆   '); CR.w = g.measureText(CR.s).width; CR.x = 640; }
    CR.x -= 80 * dt; g.fillStyle = '#ffcf9a'; g.fillText(CR.s, CR.x, 306);
  } });
  const tv = grp(sc, 2.5, 3.02, -5.94, .1, 0, 0); box(tv, M.black, 2.76, 1.44, .1, 0, 0, -.06); box(sc, M.girder, .1, .4, .1, 2.5, 3.62, -6.2);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), B.mat); tv.add(m); BAR.statB = B;
}
