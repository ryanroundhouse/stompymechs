/* ============ THE RECORD: EVERYTHING THE COMPANY HAS DONE, COUNTED ============ */
/* One flat table of numbers under short dotted keys (TALLY.n), saved with the company under `stats` (talSave, talApply). Wherever something happens the game calls
   tal(key, n) for a count or a sum, talMax / talMin for a best. Nothing is counted while the opening plays (TALLY.off): its machines are nobody's.
   What a number is called and how it is written out is TAL_DEF, further down; talRows() turns the table into the rows that SETTINGS · STATS lists and that the
   boards in the bay, on the deck and behind the bar stream (345_stat_boards.js). A new stat is a tal() call where the thing happens and a line in TAL_DEF.
   The table has no prototype, like RIV: its keys come out of save files. */
const TALLY = { n: Object.create(null), day: 1, off: false, sk: 0, mk: 0, mkT: -9, f: { x: 0, z: 0, hd: 0, jet: false, t: 0, m: '' } };
function tal(k, n = 1) { if (!TALLY.off) TALLY.n[k] = (TALLY.n[k] || 0) + n; }
function talMax(k, v) { if (!TALLY.off && !(TALLY.n[k] >= v)) TALLY.n[k] = v; }
function talMin(k, v) { if (!TALLY.off && !(TALLY.n[k] <= v)) TALLY.n[k] = v; }
const talN = k => TALLY.n[k] || 0;

/* ---- whose round is this? While a shot is being fired or is landing, talBy says who is answerable for it: the item key of one of the player's own weapons
   ('arm.las', 'back.rak'), 'ally' for a wingman or anything else on our side, or null. fire() and fireFrom() set it, a projectile carries it (s.by) and
   updateShots puts it back while the round lands, so damage() and killEnt() can read it without being told. talHit is raised by a round that found something ---- */
let talBy = null, talHit = 0;
const talMine = b => !!b && b.indexOf('.') > 0;
/* the player pulled a trigger */
function talPull(by, w) { tal('g.p'); tal('w.' + by + '.p'); if (w.heat) tal('h.w', w.heat); }
/* one round left one of the player's muzzles · and one of them connected */
function talShot(by) { tal('g.s'); tal('w.' + by + '.s'); }
function talLand(by) { tal('g.h'); tal('w.' + by + '.h'); }
/* damage() on something that is not ours: d is what got past its shield, sh what the shield took */
function talDealt(e, d, sh) {
  const by = talBy; if (!talMine(by)) return; talHit = 1; if (sh) tal('g.sh', sh); if (d <= 0) return;
  tal('g.d', d); tal('w.' + by + '.d', d); talMax('g.big', d);
}
/* killEnt(): who died, and by whose hand */
function talKill(e, owner) {
  if (TALLY.off) return;
  if (e.team === 0) { if (owner !== 0) { tal('a.lost'); if (MS.on && e === MS.wing) tal('a.wing'); } return; }
  if (owner === 4) return tal('k.riv'); if (owner !== 0) return;
  const by = talBy; if (by === 'ally') return tal('k.ally'); if (e.team !== 1) return tal('k.neut');
  tal('k.n'); talMax('k.best', ++TALLY.sk); tal('k.' + e.kind); const v = typeof e.vk === 'string' ? e.vk : e.sk; if (v) tal(`k.v.${e.kind}.${v}`);
  if (talMine(by)) { tal('w.' + by + '.k'); talMax('k.far', Math.hypot(e.pos.x - P.pos.x, e.pos.z - P.pos.z)); } else tal('k.oth'); if (e.ej) tal('k.ej'); if (e.burnK) tal('k.burn');
  if (e.mech) { tal('k.c.' + mechStats(e.mech.cfg).cls); const n = String(e.mech.cfg.name || '').replace(/[^A-Z0-9 \-]/g, '').slice(0, 16); if (n) tal('k.m.' + n); if (e.named) tal('k.named'); }
  if (e.rv && RIV[e.rv]) tal('k.r.' + e.rv); else if (MS.on && MS.c && FAC[MS.c.foe]) tal('k.f.' + MS.c.foe);
  if (P.air) tal('k.air'); if (P.heat > HEAT_WARN) tal('k.hot'); if (P.armor < P.max * .2) tal('k.low');
  if (T - TALLY.mkT < 3) { if (++TALLY.mk === 2) tal('k.x2'); else if (TALLY.mk === 3) tal('k.x3'); } else TALLY.mk = 1; TALLY.mkT = T;
}

/* ---- a sortie: what is counted as it starts, every frame it is flown, and when the books are settled ---- */
function talSortie(c) {
  const F = TALLY.f; TALLY.sk = 0; TALLY.mk = 0; TALLY.mkT = -9; F.x = P.pos.x; F.z = P.pos.z; F.hd = P.yaw + P.twist; F.jet = false; F.t = 0; talBy = null; F.g0 = { 'g.s': talN('g.s'), 'g.h': talN('g.h'), 'g.d': talN('g.d'), 'd.n': talN('d.n') };   /* what settle() takes away to get this sortie's own figures */
  if (!c) return tal('pg.n');
  tal('s.n'); tal('s.ty.' + (c.story ? 'story' : c.type)); tal('s.bi.' + c.biome); tal('s.h.' + EV.tod.key); tal('s.c.' + player.stats.cls); if (CO.wing) tal('s.wing'); if (c.cap) tal('s.cap');
  if (c.cok === 'joint') tal('s.co'); else if (c.cok === 'sub') tal('s.sub');
}
/* once a frame from updateField, so only while the sortie is really being flown */
function talField(dt, sprint, jet, dyaw, ground, wade) {
  if (TALLY.off) return; const N = TALLY.n, F = TALLY.f, add = (k, v) => { N[k] = (N[k] || 0) + v; };
  const d = Math.hypot(P.pos.x - F.x, P.pos.z - F.z), hd = P.yaw + P.twist; F.x = P.pos.x; F.z = P.pos.z;
  /* anything over six metres in a frame was not walked: a script or a test put her there */
  if (d > 0 && d < 6) { if (P.air) add('m.fly', d); else { add('m.dist', d); if (player.cfg.legs) add('m.l.' + player.cfg.legs, d); if (sprint) add('m.spr', d); if (P.v < 0) add('m.back', d); } const sp = d / dt * 3.6; if (dt > .004 && sp < 400 && !(N['m.top'] >= sp)) N['m.top'] = sp; }
  add('m.twist', Math.abs(angDiff(F.hd, hd))); F.hd = hd; if (dyaw) add('m.turn', Math.abs(dyaw));
  if (P.dead) return; F.t += dt; add(MS.on ? 's.t' : 'pg.t', dt); add('t.b.' + EV.key, dt);
  if (sprint) { add('m.sprT', dt); add('h.s', SPRINT_K.heat * (player.stats.fx === 'boost' ? .67 : 1) * dt); }
  if (jet) { add('m.jetT', dt); add('h.j', 5 * dt); if (!F.jet && !P.air) add('m.jump', 1); } F.jet = jet;
  if (P.air) { add('m.airT', dt); const h = P.pos.y - ground; if (!(N['m.high'] >= h)) N['m.high'] = h; }
  if (wade) add('m.wade', dt); if (P.heat > HEAT_WARN) add('h.hotT', dt); if (P.shut > 0) add('h.shutT', dt); if (P.burnT > 0) add('d.fireT', dt);
}
/* settle(): the contract is over and D is the debrief */
function talSettle(c, ok, D, own) {
  /* a sortie lost on the company's own account (the shakedown) is no failure on the books, so it is none here */
  const t = TALLY.f.t || 0; if (ok) tal('s.won'); else if (!own) { tal('s.lost'); if (MS.abort) tal('s.quit'); } if (P.dead) tal('s.dead'); talMax('s.long', t);
  if (ok) {
    tal('s.tw.' + (c.story ? 'story' : c.type)); tal('s.d.' + clamp(c.diff | 0, 1, 5)); if (t > 1) talMin('s.fast', t); if (c.story) tal(STORY[c.story].main ? 's.camp' : 's.ch');
    const a = clamp(P.armor / P.max, 0, 1); if (a > .999 && !Object.keys(P.lost || {}).length) tal('s.clean'); else if (a < .1) tal('s.thin');
  }
  tal('s.obj', MS.obj.filter(o => o.st === 1).length); tal('s.bonus', MS.bonus.filter(b => b[1] > 0).length);
  tal('cr.net', D.total); if (D.total > 0) talMax('cr.best', D.total); else if (D.total < 0) talMax('cr.worst', -D.total);
}
/* a room and how long was spent in it, once a frame from the main loop */
function talFrame(dt, m, held) {
  if (TALLY.off) return; const N = TALLY.n, k = m === 'field' ? (held ? 't.hold' : 't.field') : 't.' + m; N[k] = (N[k] || 0) + dt;
  if (m !== TALLY.f.m) { TALLY.f.m = m; if (m === 'bar') tal('b.visit'); else if (m === 'hq') tal('q.visit'); if (!(N['cr.peak'] >= CO.cb)) N['cr.peak'] = CO.cb; }
}

/* ---- the save: every number, cut to two places. A save from before any of this was counted starts its record on the day it is loaded, with what the ledger and
   the bar already knew carried over ---- */
function talSave() { const n = {}; for (const k in TALLY.n) { const v = TALLY.n[k]; if (v) n[k] = Number.isInteger(v) ? v : +v.toFixed(2); } return { day: TALLY.day, n }; }
function talApply(s) {
  const N = TALLY.n = Object.create(null), R = s && s.v === 2 && s.stats && typeof s.stats === 'object' ? s.stats : null, L = (s && s.ledger) || {}, day = Math.max(1, L.day | 0);
  TALLY.sk = 0; TALLY.day = day;
  if (R && R.n && typeof R.n === 'object') {
    let left = 4000; for (const k in R.n) { const v = R.n[k]; if (!--left) break; if (typeof v === 'number' && isFinite(v) && /^[a-z$][\w.$ \-]{0,47}$/i.test(k)) N[k] = clamp(v, -1e15, 1e15); }
    TALLY.day = clamp(R.day | 0, 1, day);
  } else if (s) {
    const won = Math.max(0, L.done | 0), lost = Math.max(0, L.fails | 0), w = (s.bar && s.bar.wins) || {};
    if (won) N['s.won'] = won; if (lost) N['s.lost'] = lost; if (won + lost) N['s.n'] = won + lost;
    for (const [k, g] of [['drink', 'b.gd'], ['arm', 'b.ga']]) { const v = clamp(w[k] | 0, 0, 999); if (v) N[g + '.w'] = N[g + '.n'] = v; }
  }
  N['t.sess'] = (N['t.sess'] || 0) + 1;   /* loading a company is opening it */
}
talApply(BOOT);

/* ---- what each number is called. A section is [title, rows]; a row is [key | function of the table, label, format, 1 if it is shown at nothing].
   Formats: n a count · m metres · t seconds · c credits · p a share · d points of armour · s kph · h heat · r radians, written as turns · x metres to one place ---- */
const TAL_F = {
  n: v => Math.round(v).toLocaleString('en-US'), d: v => Math.round(v).toLocaleString('en-US'), h: v => Math.round(v).toLocaleString('en-US'),
  m: v => v >= 10000 ? (v / 1000).toFixed(1) + ' km' : Math.round(v).toLocaleString('en-US') + ' m', x: v => v.toFixed(1) + ' m',
  t: v => { v = Math.round(v); const h = Math.floor(v / 3600), m = Math.floor(v % 3600 / 60), s = v % 60; return h ? `${h} h ${String(m).padStart(2, '0')} m` : m ? `${m} m ${String(s).padStart(2, '0')} s` : s + ' s'; },
  c: v => fmt(v), p: v => (v * 100).toFixed(1) + '%', s: v => Math.round(v) + ' kph', r: v => Math.round(v / TAU).toLocaleString('en-US') + ' turns',
};
const talSum = (N, pre) => { let s = 0; for (const k in N) if (k.startsWith(pre)) s += N[k]; return s; };
const talRate = (a, b) => N => (N[b] || 0) > 0 ? (N[a] || 0) / N[b] : null;
const TAL_DEF = [
  ['CONTRACTS', [
    ['s.n', 'SORTIES FLOWN ON CONTRACT', 'n', 1], ['s.won', 'CONTRACTS WON', 'n', 1], ['s.lost', 'CONTRACTS LOST', 'n', 1], ['s.quit', 'CONTRACTS ABANDONED', 'n'],
    [N => (N['s.won'] || 0) + (N['s.lost'] || 0) ? (N['s.won'] || 0) / ((N['s.won'] || 0) + (N['s.lost'] || 0)) : null, 'CONTRACT WIN RATE', 'p'],
    ['s.t', 'TIME ON CONTRACT', 't', 1], ['s.long', 'LONGEST SORTIE', 't'], ['s.fast', 'FASTEST WIN', 't'], ['s.clean', 'WINS WITHOUT A SCRATCH', 'n'], ['s.thin', 'WINS ON UNDER A TENTH OF HER ARMOUR', 'n'],
    ['s.dead', 'MACHINES SHOT OUT FROM UNDER YOU', 'n', 1], ['s.wing', 'SORTIES WITH A WINGMAN', 'n'], ['s.co', 'SORTIES BESIDE ANOTHER COMPANY', 'n'], ['s.sub', 'SUBCONTRACTS FLOWN', 'n'], ['s.cap', 'WEIGHT-LIMITED CONTRACTS FLOWN', 'n'],
    ['s.c.LIGHT', 'SORTIES IN A LIGHT MACHINE', 'n'], ['s.c.MEDIUM', 'SORTIES IN A MEDIUM MACHINE', 'n'], ['s.c.HEAVY', 'SORTIES IN A HEAVY MACHINE', 'n'], ['s.c.ASSAULT', 'SORTIES IN AN ASSAULT MACHINE', 'n'],
    ['s.ch', 'STORY CHAPTERS WON', 'n'], ['s.camp', 'CAMPAIGN CHAPTERS WON', 'n'], ['s.obj', 'OBJECTIVES COMPLETED', 'n'], ['s.bonus', 'BONUSES EARNED', 'n'],
    ['c.heard', 'RADIO MESSAGES HEARD', 'n'], ['c.ans', 'QUESTIONS ANSWERED ON THE RADIO', 'n'], ['c.tmo', 'QUESTIONS LEFT TO ANSWER THEMSELVES', 'n'], ['s.lance', 'SKY LANCE STRIKES CALLED', 'n'], ['s.map', 'TIMES THE MAP WAS OPENED', 'n'], ['s.cam', 'CHANGES OF CAMERA', 'n'],
  ]],
  ['PROVING GROUND', [['pg.n', 'PROVING GROUND SESSIONS', 'n'], ['pg.w', 'PROVING GROUND WAVES CLEARED', 'n'], ['pg.best', 'HIGHEST PROVING GROUND WAVE', 'n'], ['pg.t', 'TIME ON THE PROVING GROUND', 't']]],
  ['GUNNERY', [
    ['g.p', 'TRIGGER PULLS', 'n', 1], ['g.s', 'ROUNDS FIRED', 'n', 1], ['g.h', 'ROUNDS ON TARGET', 'n', 1], [talRate('g.h', 'g.s'), 'ACCURACY, ALL WEAPONS', 'p'],
    ['g.d', 'DAMAGE DEALT', 'd', 1], [talRate('g.d', 'g.h'), 'DAMAGE PER ROUND THAT LANDED', 'x1'], ['g.big', 'HARDEST SINGLE HIT LANDED', 'd'], ['g.burn', 'DAMAGE DONE BY FIRES YOU STARTED', 'd'], ['g.sh', 'DAMAGE SOAKED UP BY ENEMY SHIELDS', 'd'], ['k.far', 'LONGEST KILL', 'm'],
  ]],
  ['KILLS', [
    ['k.n', 'KILLS', 'n', 1], ['k.mech', 'MECHS DESTROYED', 'n', 1], ['k.c.LIGHT', 'LIGHT MECHS DESTROYED', 'n'], ['k.c.MEDIUM', 'MEDIUM MECHS DESTROYED', 'n'], ['k.c.HEAVY', 'HEAVY MECHS DESTROYED', 'n'], ['k.c.ASSAULT', 'ASSAULT MECHS DESTROYED', 'n'],
    ['k.tank', 'TANKS AND CRAWLERS BLOWN UP', 'n', 1], ['k.drone', 'AIRCRAFT SHOT DOWN', 'n', 1], ['k.turret', 'TURRETS AND GUN MOUNTS SILENCED', 'n', 1], ['k.struct', 'STRUCTURES LEVELLED', 'n', 1], ['k.ship', 'CAPITAL SHIPS BROUGHT DOWN', 'n'], ['k.truck', 'HAULERS AND LAND TRAINS STOPPED', 'n'],
    ['k.named', 'NAMED PILOTS BEATEN', 'n'], ['k.ej', 'PILOTS WHO EJECTED WITH NOTHING LEFT TO FIRE', 'n'], ['k.burn', 'ENEMIES BURNED OUT', 'n'], ['k.oth', 'KILLS WITHOUT A WEAPON OF YOUR OWN', 'n'], ['k.neut', 'BYSTANDERS KILLED', 'n'],
    ['k.best', 'MOST KILLS IN ONE SORTIE', 'n'], ['k.x2', 'DOUBLE KILLS', 'n'], ['k.x3', 'TRIPLE KILLS', 'n'], ['k.air', 'KILLS MADE IN MID-AIR', 'n'], ['k.hot', 'KILLS MADE ABOVE 80 HEAT', 'n'], ['k.low', 'KILLS ON YOUR LAST FIFTH OF ARMOUR', 'n'],
    [N => (N['k.n'] || 0) / Math.max(1, N['s.n'] || 0) || null, 'KILLS PER SORTIE', 'x1'], ['k.ally', 'KILLS BY YOUR WINGMEN AND ALLIES', 'n'], ['k.riv', 'KILLS BY COMPANIES FLYING WITH YOU', 'n'],
    [N => talSum(N, 'z.') || null, 'COMPONENTS SHOT OFF', 'n'], [N => (N['z.armL'] || 0) + (N['z.armR'] || 0) || null, 'ARMS SHOT OFF', 'n'], ['z.legs', 'LEGS SHOT OUT', 'n'], ['z.head', 'COCKPITS HIT', 'n'], ['z.back', 'BACK UNITS SHOT OFF', 'n'],
  ]],
  ['DAMAGE TAKEN', [
    ['d.h', 'TIMES HIT', 'n', 1], ['d.n', 'ARMOUR LOST', 'd', 1], ['d.big', 'HARDEST HIT TAKEN', 'd'], ['d.sh', 'DAMAGE SOAKED UP BY YOUR SHIELD', 'd'], ['e.s', 'ROUNDS FIRED BY THE OPPOSITION', 'n'],
    [N => talSum(N, 'd.z.') || null, 'COMPONENTS LOST', 'n'], [N => (N['d.z.armL'] || 0) + (N['d.z.armR'] || 0) || null, 'ARMS LOST', 'n'], ['d.z.legs', 'TIMES YOUR LEGS WERE CRIPPLED', 'n'], ['d.z.head', 'COCKPIT HITS TAKEN', 'n'], ['d.z.back', 'BACK UNITS LOST', 'n'],
    ['d.fireT', 'TIME ON FIRE', 't'], ['d.burn', 'ARMOUR LOST TO FIRE', 'd'], ['d.stun', 'ION HITS TAKEN', 'n'], ['d.lava', 'ARMOUR LOST TO LAVA', 'd'], ['s.kit', 'FIELD REPAIR KITS USED', 'n'], ['d.kit', 'ARMOUR PUT BACK BY KITS', 'd'], ['d.mend', 'COMPONENTS BROUGHT BACK BY A KIT', 'n'],
    ['a.lost', 'ALLIED UNITS LOST', 'n'], ['a.wing', 'WINGMEN SHOT DOWN', 'n'],
  ]],
  ['MOVEMENT', [
    ['m.step', 'STEPS TAKEN', 'n', 1], ['m.dist', 'DISTANCE COVERED ON THE GROUND', 'm', 1], [N => (N['m.step'] || 0) > 0 ? Math.max(0, (N['m.dist'] || 0) - (N['m.l.trk'] || 0) - (N['m.l.hov'] || 0)) / N['m.step'] : null, 'AVERAGE STRIDE', 'x'], ['m.spr', 'DISTANCE SPRINTED', 'm'], ['m.back', 'DISTANCE WALKED BACKWARDS', 'm'], ['m.fly', 'DISTANCE FLOWN', 'm'],
    ['m.sprT', 'TIME SPRINTING', 't'], ['m.jump', 'JUMPS', 'n', 1], ['m.airT', 'TIME IN THE AIR', 't'], ['m.jetT', 'TIME ON THE JETS', 't'], ['m.high', 'HIGHEST JUMP', 'x'], ['m.land', 'HARD LANDINGS', 'n'], ['m.top', 'TOP SPEED', 's'],
    ['m.twist', 'TORSO TWISTED', 'r'], ['m.turn', 'LEGS TURNED', 'r'], ['m.wade', 'TIME WADING', 't'], ['m.lava', 'TIME STANDING IN LAVA', 't'],
  ]],
  ['HEAT', [
    ['h.shut', 'REACTOR SHUTDOWNS', 'n', 1], ['h.warn', 'HEAT WARNINGS', 'n', 1], [N => (N['h.w'] || 0) + (N['h.s'] || 0) + (N['h.j'] || 0) || null, 'HEAT GENERATED', 'h'], ['h.w', 'HEAT FROM WEAPONS', 'h'], ['h.s', 'HEAT FROM SPRINTING', 'h'], ['h.j', 'HEAT FROM THE JETS', 'h'],
    ['h.hotT', 'TIME ABOVE 80 HEAT', 't'], ['h.shutT', 'TIME SHUT DOWN', 't'], ['h.flush', 'COOLANT FLUSHES', 'n'], ['h.ion', 'HEAT FROM ION HITS', 'h'], ['h.fire', 'HEAT FROM BEING ON FIRE', 'h'], ['h.lava', 'HEAT FROM STANDING IN LAVA', 'h'],
  ]],
  ['MONEY', [
    ['cr.fee', 'CONTRACT FEES EARNED', 'c', 1], ['cr.bonus', 'BONUSES PAID TO YOU', 'c'], ['cr.scrap', 'BATTLEFIELD SCRAP SOLD', 'c'], ['cr.rep', 'REPAIR AND REBUILD BILLS', 'c', 1], ['cr.share', 'PAID TO WINGMEN IN SHARES', 'c'], ['cr.net', 'NET FROM CONTRACTS', 'c'],
    ['cr.best', 'BIGGEST PAYDAY', 'c'], ['cr.worst', 'WORST DAY', 'c'], ['cr.peak', 'MOST EVER IN THE BANK', 'c'], ['cr.sell', 'FROM SELLING PARTS', 'c'], ['cr.won', 'WON AT THE TABLES', 'c'],
    [N => talSum(N, 'cr.o.') || null, 'SPENT, ALL TOLD', 'c'], ['cr.o.market', 'SPENT AT THE MARKET', 'c'], ['cr.o.mech', 'SPENT ON WHOLE MACHINES', 'c'], ['cr.o.pilot', 'RETAINERS PAID TO PILOTS', 'c'], ['cr.o.intel', 'SPENT ON INTELLIGENCE', 'c'],
    ['cr.o.bar', 'SPENT OVER THE BAR', 'c'], ['cr.o.stake', 'STAKED AT THE TABLES', 'c'], ['cr.o.gift', 'GIFTS TO OTHER COMPANIES', 'c'], ['cr.o.misc', 'SPENT ON EVERYTHING ELSE', 'c'],
  ]],
  ['THE YARD', [
    ['y.fit', 'PARTS FITTED', 'n', 1], ['y.strip', 'PARTS TAKEN OFF', 'n'], ['y.sink', 'HEAT SINKS FITTED', 'n'], ['y.bay', 'TIMES A BAY WAS BROUGHT TO THE STAND', 'n'], ['y.paint', 'PAINT JOBS', 'n'], ['y.name', 'MACHINES RENAMED', 'n'], ['y.test', 'SYSTEMS TESTS RUN', 'n'],
    ['y.buy', 'ITEMS BOUGHT', 'n'], ['y.sell', 'ITEMS SOLD', 'n'], ['y.mech', 'MACHINES BOUGHT WHOLE', 'n'], ['y.salv', 'PIECES OF SALVAGE TAKEN', 'n', 1], ['y.left', 'PIECES OF SALVAGE LEFT BEHIND', 'n'], ['y.launch', 'LAUNCHES', 'n'],
  ]],
  ['THE DECK', [
    ['q.visit', 'VISITS TO THE COMMAND DECK', 'n'], ['q.acc', 'CONTRACTS SIGNED', 'n', 1], ['q.drop', 'CONTRACTS TORN UP', 'n'], ['q.hag', 'TIMES YOU HAGGLED', 'n'], ['q.hagW', 'HAGGLES WON', 'n'], ['q.intel', 'PIECES OF INTELLIGENCE BOUGHT', 'n'],
    ['q.hire', 'PILOTS HIRED', 'n'], ['q.talk', 'THINGS SAID TO YOU', 'n'], ['q.brf', 'BRIEFINGS SAT THROUGH', 'n'], ['q.gift', 'GIFTS SENT TO OTHER COMPANIES', 'n'],
  ]],
  ['THE BAR', [
    ['b.visit', 'VISITS TO THE LAST ROUND', 'n'], ['b.drink', 'DRINKS BOUGHT', 'n', 1], ['b.round', 'ROUNDS STOOD FOR THE HOUSE', 'n'], ['b.rum', 'RUMOURS HEARD', 'n'], ['b.tip', 'TIMES SOMETHING WENT IN THE TIP JAR', 'n'], ['b.rest', 'HOURS SPENT IN A CHAIR', 'n'],
    ['b.gd.n', 'DRINKING CONTESTS', 'n'], ['b.gd.w', 'DRINKING CONTESTS WON', 'n'], ['b.ga.n', 'ARM WRESTLES', 'n'], ['b.ga.w', 'ARM WRESTLES WON', 'n'], ['b.glass', 'GLASSES EMPTIED AT THE TABLE', 'n'],
  ]],
  ['TIME', [
    [N => talSum(N, 't.') - talSum(N, 't.b.') - (N['t.sess'] || 0) - (N['t.intro'] || 0) || null, 'TIME PLAYED', 't'], ['t.hangar', 'TIME IN THE MECH BAY', 't'], ['t.hq', 'TIME ON THE COMMAND DECK', 't'], ['t.bar', 'TIME IN THE BAR', 't'], ['t.brief', 'TIME IN THE BRIEFING ROOM', 't'], ['t.aar', 'TIME AT THE DEBRIEF', 't'],
    ['t.field', 'TIME AT THE CONTROLS', 't'], ['t.hold', 'TIME WITH A SORTIE ON HOLD', 't'], ['t.sess', 'TIMES THE GAME WAS OPENED', 'n'], ['t.intro', 'TIMES THE OPENING WAS WATCHED', 'n'], [() => CO.day, 'SECTOR DAYS IN BUSINESS', 'n'],
  ]],
];
TAL_F.x1 = v => v.toFixed(1);
/* what a vehicle is called when there is more than one of them on the list */
const TAL_UNIT = {
  'drone.hunter': 'HUNTER DRONES', 'drone.scr': 'SCREAMERS', 'drone.shr': 'SHRIKE GUNSHIPS', 'drone.vul': 'VULTURE BOMBERS', 'drone.hrp': 'HARPIES',
  'tank.striker': 'STRIKER TANKS', 'tank.dingo': 'DINGO SCOUTS', 'tank.mam': 'MAMMOTHS', 'tank.hail': 'HAILSTORMS', 'tank.fur': 'FURNACES', 'tank.pike': 'PIKES', 'tank.worm': 'CRAWLER SEGMENTS',
  'turret.sentry': 'SENTRY TURRETS', 'turret.hydra': 'HYDRA BATTERIES', 'turret.prism': 'PRISM TOWERS', 'turret.bas': 'BASILISK MORTARS', 'turret.sub': 'SHIP\'S GUNS AND ENGINES',
  'struct.gen': 'REACTORS', 'struct.fuel': 'FUEL TANKS', 'struct.comm': 'UPLINK TOWERS', 'struct.bunker': 'COMMAND BUNKERS', 'struct.depot': 'SUPPLY DEPOTS', 'struct.arty': 'SIEGE GUNS', 'struct.fab': 'ASSEMBLY PLANTS', 'struct.hq': 'FIELD HEADQUARTERS', 'struct.hab': 'HAB BLOCKS', 'struct.wreck': 'CRASHED DROPSHIPS',
  'ship.lev': 'LEVIATHANS', 'ship.hive': 'HIVE CARRIERS',
};
/* a weapon's line: what was fired, what landed, what it did */
function talWeps() {
  const N = TALLY.n, out = [];
  for (const cat of ['arm', 'back']) for (const id in PARTS[cat]) {
    const w = PARTS[cat][id].weapon, k = `w.${cat}.${id}.`; if (!w || !(N[k + 's'] || N[k + 'p'])) continue; const s = N[k + 's'] || 0, h = N[k + 'h'] || 0;
    out.push({ key: cat + '.' + id, name: w.name, cls: WCLASS[w.type] || '', p: N[k + 'p'] || 0, s, h, acc: s ? Math.min(1, h / s) : 0, d: N[k + 'd'] || 0, k: N[k + 'k'] || 0 });
  }
  return out.sort((a, b) => b.s - a.s || b.p - a.p);
}
/* the record as rows: { g section, l label, v the value written out, z true at nothing }. talRows() is what stands at more than nothing; talRows(1) adds the lines
   TAL_DEF marks as worth showing at nothing (a new company's boards); talRows(2) is the book in SETTINGS: every line TAL_DEF has, and no weapon by name, which
   has a table of its own there */
function talRows(all) {
  const N = TALLY.n, out = [], book = all === 2, put = (g, l, v, f, show) => { const z = !v; if (z && !(all && show)) return; out.push({ g, l, v: v == null ? '—' : (TAL_F[f] || TAL_F.n)(v || 0), z }); };
  for (const [g, rows] of TAL_DEF) {
    for (const [k, l, f, show] of rows) put(g, l, typeof k === 'function' ? k(N) : N[k] || 0, f, book || show);
    if (g === 'CONTRACTS') {
      for (const k in TYPES) put(g, `${TYPES[k].name.toUpperCase()} CONTRACTS FLOWN`, N['s.ty.' + k], 'n'); put(g, 'STORY CHAPTERS FLOWN', N['s.ty.story'], 'n');
      for (const k in TYPES) put(g, `${TYPES[k].name.toUpperCase()} CONTRACTS WON`, N['s.tw.' + k], 'n');
      for (let d = 1; d <= 5; d++) put(g, `CONTRACTS WON AT ${'◆'.repeat(d)}`, N['s.d.' + d], 'n');
      for (const k in BIOMES) put(g, `SORTIES · ${BIOMES[k].name}`, N['s.bi.' + k], 'n'); for (const k in TOD) put(g, `SORTIES FLOWN AT ${TOD[k].name.toUpperCase()}`, N['s.h.' + k], 'n');
      for (const k in BIOMES) put(g, `TIME UNDER FIRE · ${BIOMES[k].name}`, N['t.b.' + k], 't');
    }
    if (g === 'GUNNERY') {
      const C = {}; for (const w of talWeps()) { const c = C[w.cls] || (C[w.cls] = { s: 0, h: 0, d: 0 }); c.s += w.s; c.h += w.h; c.d += w.d; }
      for (const c in C) if (c && C[c].s) { put(g, `${c} ROUNDS FIRED`, C[c].s, 'n'); put(g, `${c} ACCURACY`, Math.min(1, C[c].h / C[c].s), 'p'); put(g, `${c} DAMAGE`, C[c].d, 'd'); }
      if (!book) for (const w of talWeps()) { put(g, `${w.name} · ROUNDS FIRED`, w.s, 'n'); if (w.s) put(g, `${w.name} · ACCURACY`, w.acc, 'p'); put(g, `${w.name} · DAMAGE`, w.d, 'd'); put(g, `${w.name} · KILLS`, w.k, 'n'); }
    }
    if (g === 'MOVEMENT') for (const k in PARTS.legs) put(g, `DISTANCE ON ${PARTS.legs[k].name}`, N['m.l.' + k], 'm');
    if (g === 'KILLS') {
      for (const k in N) if (k.startsWith('k.v.')) put(g, (TAL_UNIT[k.slice(4)] || k.slice(4).toUpperCase()) + ' DESTROYED', N[k], 'n');
      for (const k in N) if (k.startsWith('k.m.')) put(g, `${k.slice(4)} · DESTROYED`, N[k], 'n');
      for (const k in FAC) put(g, `${FAC[k].short} UNITS DESTROYED`, N['k.f.' + k], 'n'); for (const k of RIVS) put(g, `${RIV[k].short} MACHINES DESTROYED`, N['k.r.' + k], 'n');
    }
  }
  return out;
}
