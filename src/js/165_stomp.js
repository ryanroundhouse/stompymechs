/* ============ FIELD: STOMPING — WHAT A MACHINE'S WEIGHT DOES TO WHATEVER IS UNDER IT ============ */
/* A machine on legs comes down on one foot at a time, and a hostile vehicle or gun mount within that foot's reach takes the machine's weight: all of it at a walk, more at a
   sprint, half of it when she is barely moving (stompFoot, called from the footfall itself: player.onStep in startField, m.onStep in mkMech for a machine on our side).
   Tracks grind what they roll over instead, a few times a second (stompTick); a hover skirt weighs on nothing. A machine that comes down off its jets lands on everything
   round it (stompLand, from the landing in updateField): hardest on whatever is right under it, which on a mech is the cockpit, and at a price to the legs that did it.
   What can be trodden on is a hostile on the ground that the machine stands well over: tanks, haulers, a crawler's segments, and the squat gun mounts, which have a collider,
   so that one is a kick. Never anything on our side or neutral: a commander who walks through the convoy they are escorting has done nothing wrong. A structure feels a
   landing and nothing else, or every reactor in the sector could be walked to death.
   Whose kill it is travels as talBy the way a round's does: 'stomp' for the player, 'ally' for anybody else. It is no weapon, so the damage is counted here (g.stomp)
   and the kill goes down as one made without a weapon (k.oth) and as k.stomp or k.dfa. A vehicle killed this way is left flat (e.squash, which killEnt reads).
   foot: damage per tonne from one footfall at a walk · tick: how often tracks bite · land: damage per tonne for each metre a second she lands at · min: the slowest landing
   that hurts anybody · under: what is right under her takes that much more · edge: the share that reaches the rim of the landing · beside: the share of it that a machine standing in the
   ring takes in the legs, being mostly above it · self: what her own legs take of a
   landing on another machine */
const STOMP_K = { foot: 2, tick: .4, land: .1, min: 12, under: 1.35, edge: .25, beside: .6, self: .2 };
const STOMP_KIND = { tank: 1, truck: 1, turret: 1 }, _sf = V3(), _sh = V3();
/* how far one foot reaches, by weight: a light machine's is two metres across, an assault machine's three and a half */
const stompR = tons => 1.4 + tons * .02;
/* one thing takes one blow. mine: the player's doing (counted, and said on the screen) · owner: 0 ours, 4 a company flying beside us */
function stompHit(e, dmg, mine, owner, how, zone) {
  const at = _sh.copy(e.pos), was = e.hp; at.y += e.cy * .6;
  e.squash = !!STOMP_KIND[e.kind]; talBy = mine ? 'stomp' : 'ally'; damage(e, dmg, at, owner, zone); talBy = null; if (!e.dead) e.squash = false;
  sparks(FD.fx, at, 16, 9); puff(FD.fx, e.pos, 5, 2.6, .5, .35, 2, 4);
  if (!mine) { if (e.pos.distanceTo(P.pos) < 160) sfx.play('crunch', .35); return; }
  tal('g.stomp', Math.max(0, was - Math.max(0, e.hp))); P.shake = Math.min(1.5, P.shake + .22); sfx.play('crunch', e.dead ? 1 : .6);
  if (e.dead) { tal(how === 'land' ? 'k.dfa' : 'k.stomp'); msg(`${e.name} — ${how === 'land' ? 'DEATH FROM ABOVE' : e.kind === 'turret' ? 'KICKED FLAT' : 'STOMPED FLAT'}`, 2.4); }
}
/* a foot comes down at `at`. k is how hard the machine is going against its top speed (a walk is 1, a sprint more); r is the footprint, where it is not a foot.
   Returns how many things were under it */
function stompFoot(mech, at, mine, owner, k = 1, r) {
  const tons = mech.stats.tons; if (mode !== 'field' || mech.off || !tons) return 0;
  /* (four legs carry her on twice as many feet as two do, and come down twice as often: each foot has its share) */
  const fr = r || stompR(tons), dmg = tons * STOMP_K.foot * (.5 + .5 * clamp(k, 0, 1.5)) * 2 / Math.max(2, mech.legU.legs.length), y = mech.root.position.y, top = mech.height * .7; let n = 0; _sf.copy(at);
  for (const e of [...FD.ents]) {
    if (e.dead || e.team !== 1 || !STOMP_KIND[e.kind] || e.inv || e.of || e.cy * 2 > top || Math.abs(e.pos.y - y) > 4) continue;
    if (Math.hypot(e.pos.x - _sf.x, e.pos.z - _sf.z) > fr + (e.col && e.col.r !== undefined ? e.col.r + 1.2 : e.r * .7)) continue;
    stompHit(e, dmg, mine, owner, 'foot'); n++;
  }
  return n;
}
/* the player has come down at `imp` metres a second: a ring on the ground, the trees round her over, and everything hostile inside it hit */
function stompLand(imp) {
  const tons = player.stats.tons; if (mode !== 'field' || P.dead || imp < STOMP_K.min || !tons) return;
  const R = 5 + tons * .09, pw = tons * imp * STOMP_K.land, y = P.pos.y, big = clamp(tons * imp / 1500, .5, 1.7); let n = 0, on = null;
  _sf.copy(P.pos); _sf.y += 1; shockAt(_sf, big); scarAt(_sf, 2.2 + tons * .03, 0); P.shake = Math.min(1.6, P.shake + big * .5); sfx.play('boom', .5 * big); if (FD.trees.length) FD.fell.push([P.pos.x, P.pos.z, Math.min(15, R)]);
  for (const e of [...FD.ents]) {
    if (e.dead || e.team !== 1 || e.inv || e.of || e.kind === 'drone' || e.kind === 'ship' || Math.abs(e.pos.y - y) > 6) continue;
    const d = Math.hypot(e.pos.x - P.pos.x, e.pos.z - P.pos.z), gap = Math.max(0, d - e.r * .6); if (gap > R) continue;
    const under = d < e.r * .6 + 1.5, dmg = pw * (under ? STOMP_K.under : (1 - (1 - STOMP_K.edge) * gap / R) * (e.kind === 'mech' ? STOMP_K.beside : 1)) * (e.kind === 'struct' ? .5 : 1), was = e.hp;
    stompHit(e, dmg, true, 0, 'land', e.kind === 'mech' ? (under ? 'head' : 'legs') : undefined); n++;
    if (under && e.kind === 'mech' && !on) on = [e, was - Math.max(0, e.hp)];
  }
  if (!n) return; tal('m.dfa');
  /* coming down on another machine is paid for in her own legs, and more the heavier the machine she landed on */
  if (on) { const [e, dealt] = on, d = dealt * STOMP_K.self * clamp(mechStats(e.mech.cfg).tons / tons, .5, 2); if (d > 1) { if (!e.dead) msg(`LANDED ON ${e.name} — HER LEGS TOOK SOME OF IT`, 2.6); damage(PE, d / .24, null, 1, 'legs'); } }
}
/* once a frame from updateField: the tracks' bite, and the one time somebody mentions that any of this can be done */
function stompTick(dt) {
  const st = player.stats, legs = PARTS.legs[player.cfg.legs], hover = !!(legs && legs.hover);
  if (legs && legs.tracked && !hover && !P.air && !P.dead && Math.abs(P.v) > 1.5 && (P.stT = (P.stT || 0) - dt) <= 0) { P.stT = STOMP_K.tick; stompFoot(player, P.pos, true, 0, Math.abs(P.v) / (st.speed * RUN), 4.2); }
  /* a company in its first few contracts that has never trodden on anything is told once a sortie, when there is something in reach to tread on */
  if (!MS.on || MS.over || MS.v.stTip || hover || talN('g.stomp') || talN('s.n') > 8 || (MS.c.story && STORY[MS.c.story].first) || (MS.v.stT = (MS.v.stT || 0) - dt) > 0) return; MS.v.stT = 1;
  const e = FD.ents.find(e => !e.dead && e.team === 1 && e.kind === 'tank' && !e.inv && Math.hypot(e.pos.x - P.pos.x, e.pos.z - P.pos.z) < 55); if (!e) return;
  MS.v.stTip = 1; chatter(MS.ops, `Commander, a word from the chief. That is a ${e.name.toLowerCase()}, and you are sitting in ${Math.round(st.tons)} tonnes of machine. You do not have to shoot it. ${legs.tracked ? 'Drive over it.' : 'Walk on it.'}`);
}
