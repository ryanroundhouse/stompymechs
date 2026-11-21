/* ============ TWO MORE KINDS OF CONTRACT, BUILT ROUND THE BIG THINGS, AND THREE MORE THINGS THAT CAN GO WRONG ON ANY OF THEM ============ */
Object.assign(TYPES, {
  assault: { name: 'Assault', tag: 'ASL', base: 124000, plots: ['plant', 'twin', 'worm', 'yard'], desc: 'Break a works that builds its own defenders.' },
  intercept: { name: 'Intercept', tag: 'INT', base: 136000, plots: ['cruiser', 'carrier', 'raid', 'pair'], desc: 'Bring down what is in the air before it finishes what it came for.' },
});
Object.assign(HINT, {
  'assault.plant': 'One works, one door, and a response force on call once it is burning.', 'assault.twin': 'Two lines, and both draw power from a single reactor away from the site.',
  'assault.worm': 'The garrison is thin for a site that size. Something else is doing the guarding.', 'assault.yard': 'That plant was seized, not built. The people running the line are not soldiers.',
  'intercept.cruiser': 'A gun cruiser. Belly turrets, a spinal gun, and engines hung outboard at the stern.', 'intercept.carrier': 'A carrier. She fights with what she launches, and she can replace all of it.',
  'intercept.raid': 'No capital ship at all. Bombers and gunships, in three waves.', 'intercept.pair': 'Two hulls on the plot, not one, and they are not arriving together.',
  air: 'An enemy air wing is on strip alert within reach of the site.', worm: 'Seismic stations near the site keep logging something long, moving slowly.', works: 'A field works near the site is turning out machines faster than anyone is counting them.',
});
BRIEF.assault = (E, F, c) => `${E.name} wants the ${F.short} assembly works at ${c.site} broken. It replaces whatever it loses, so the works itself is the target.`;
BRIEF.intercept = (E, F, c) => `A ${F.short} strike is inbound on the ${E.short} depot at ${c.site}, and it is coming by air. Keep the depot standing and bring down whatever is over it.`;
NEXT.assault = ['garrison', 'They want that ground back, works or no works. ']; NEXT.intercept = ['strike', 'She flew from somewhere, and we have found where. '];

MISSIONS.assault = async function (ms) {
  const c = ms.c, A = ms.A, E = FAC[c.emp].short, F = FAC[c.foe].short, two = c.plot === 'twin', kid = { skill: .7 + c.diff * .08, hpK: .7 + c.diff * .06 };
  const mkP = (p, name) => mkFactory(p.x, p.z, 1, { ry: Math.atan2(ms.LZ.x - p.x, ms.LZ.z - p.z), every: 26 - c.diff * 2.2, cap: 2 + (c.diff > 3 ? 1 : 0), tier: c.diff < 3 ? 0 : 1, hpK: .55 + c.diff * .09, kid, name, wake: 330 });
  const Ps = two ? [mkP(A, 'NORTH LINE'), mkP(ms.B, 'SOUTH LINE')] : [mkP(A)], pc = p => Math.max(0, p.hp / p.max * 100).toFixed(0) + '%', dark = () => { for (const p of Ps) if (!p.dead) { p.pacify = true; p.name += ' (DARK)'; } };
  spawn({ turret: 1 + (c.diff >> 1) }, A.x, A.z, 32, 46); if (c.plot !== 'worm') foes(.5, A.x, A.z, 26, 72, { ai: 'guard' }); if (two) spawn({ turret: 1 }, ms.B.x, ms.B.z, 30, 40);
  setObj('m', () => two ? `Destroy both assembly lines — ${alive(Ps)} standing` : `Destroy the assembly plant — ${pc(Ps[0])}`); Ps.forEach((p, i) => nav('p' + i, p, two ? p.name : 'PLANT', '#ff5a1f'));
  say(ms.hnd, `${c.contact.last}. ${F} has a works at ${c.site} that turns out a machine every quarter of a minute. Whatever you kill there, it replaces. So kill the works.`);
  if (two) (async () => {
    const R = mkStruct('gen', ms.C.x, ms.C.z, 1, { name: 'LINE REACTOR', hpK: 1.2 }); foes(.4, ms.C.x, ms.C.z, 14, 46, { ai: 'guard' }); await until(() => near(A, 260) || near(ms.B, 260) || Ps.some(p => p.hp < p.max));
    look(R, 'LINE REACTOR'); say(ms.ops, 'Both lines draw from one reactor, out on the far side. Kill that and nothing more comes out of either door — the buildings will still be standing, but they will be standing dark.');
    setObj('r', 'Destroy the reactor that feeds both lines', 0, true); nav('r', R, 'REACTOR', '#7fe7ff');
    R.onKill = () => { unnav('r'); if (ms.over) return; setObj('r', null, 1); dark(); msg('BOTH LINES ARE DARK', 3.5); chatter(ms.ops, 'Reactor is gone. Both doors just went dark. Take your time with the rest.'); };
  })();
  if (c.plot === 'worm') (async () => {
    await until(() => near(A, 190) || Ps[0].hp < Ps[0].max * .9); const [x, z] = groundSpot(A.x - Math.sin(Ps[0].obj.rotation.y) * 60, A.z - Math.cos(Ps[0].obj.rotation.y) * 60, 0, 30);
    const H = mkCentipede(x, z, 1, { n: 4 + (c.diff >> 1), hpK: .55 + c.diff * .11, name: 'LINE CRAWLER', yaw: Ps[0].obj.rotation.y }); H.alert = true; P.shake += .5; sfx.play('alarm');
    look(H, 'LINE CRAWLER'); say(ms.ops, `That is why the garrison is so thin. They have a crawler on the site — every one of those segments is a gun. The head is the only part that matters: kill that and the rest goes with it.`);
    setObj('w', 'Kill the crawler — go for the head', 0, true); nav('w', H, 'CRAWLER', '#ff9adf'); H.onKill = () => { unnav('w'); if (ms.over) return; setObj('w', null, 1); bonus('Crawler bounty', c.pay * .25); note(`You killed the crawler guarding ${c.site}.`); };
  })();
  if (c.plot === 'yard') {
    const fm = mkChar(c.seed + 9, 'LINE FOREMAN', '#ffffff'), P0 = Ps[0]; fieldWho(fm, P0); await until(() => near(A, 230) || P0.hp < P0.max);
    const r = P0.dead ? 1 : await ask(fm, `Hold your fire! This line is not ${F}'s. They took it from us at gunpoint and they make us run it. Two minutes to get my people out — and there is a finished gun on the rack that never went on their books.`, ['You have two minutes', 'No time. It burns now', 'Pull the breakers yourself and you can walk out']);
    if (r === 0 && !P0.dead) {
      const t0 = ms.t + 120; P0.inv = true; setObj('y', () => `Hold fire on the plant — workers leaving ${secs(t0)}`); say(fm, 'Two minutes. I will not forget it. Mind what comes out of the door — I cannot stop the line from here.');
      await until(() => ms.t >= t0); P0.inv = false; setObj('y', null, 1); YARD.loot.push({ kind: 'gift', key: 'arm.' + pick(Object.keys(PARTS.arm).filter(k => PARTS.arm[k].lv >= 2)) }); rep(c.foe, 3);
      say(fm, 'We are clear. The gun is by the east wall, crated. Now do what you came to do.'); note(`You gave the workers at ${c.site} time to get out. They left you a weapon.`);
    } else if (r === 2 && !P0.dead) {
      if (Math.random() < .55) { dark(); say(fm, 'Done. Breakers are out and the board is smashed. She will not build another thing. We are going out the back.'); note(`The foreman at ${c.site} shut the line down for you.`); rep(c.foe, 2); }
      else say(fm, 'I cannot reach the board. There are two of their people standing on it. I am sorry — we are running.');
    } else { rep(c.foe, -6); note(`You burned the works at ${c.site} with the line crew still inside.`); }
  }
  if (c.plot === 'plant') (async () => { await until(() => Ps[0].hp < Ps[0].max * .5); if (ms.over || Ps[0].dead) return; chatter(ms.ops, 'She is half gone and they know it. Everything on the line is coming out of that door at once.'); for (let i = 0; i < (c.diff > 2 ? 2 : 1); i++) for (const e of spawn({ mech: 1, tier: c.diff < 3 ? 0 : 1 }, ...groundSpot(A.x + Math.sin(Ps[0].obj.rotation.y) * 24, A.z + Math.cos(Ps[0].obj.rotation.y) * 24, 0, 8), 0, 4, 1, fopt(kid))) e.alert = true; })();
  await until(() => !alive(Ps)); setObj('m', null, 1); note(`The works at ${c.site} was destroyed after building ${Ps.reduce((n, p) => n + p.built, 0)} machines.`);
  if (c.plot !== 'yard') { say(ms.ops, 'The works is down. Their response force is rolling — do not wait around to count it.'); hot1(foes(.6, ...ringPt(A, 170), 0, 30)); }
  return extract(`${c.site} will not build another machine.`);
};

MISSIONS.intercept = async function (ms) {
  const c = ms.c, A = ms.A, E = FAC[c.emp].short, F = FAC[c.foe].short, plot = c.plot === 'pair' && c.diff < 3 ? 'cruiser' : c.plot, hpK = (.55 + c.diff * .1) * (plot === 'pair' ? .8 : 1);
  const base = mkStruct('hq', A.x, A.z, 0, { name: `${c.site} DEPOT`, hpK: 1.3 + c.diff * .1 }); spawn({ turret: 2, v: 'sentry' }, A.x, A.z, 24, 34, 0);
  const pct = () => Math.max(0, base.hp / base.max * 100).toFixed(0) + '%'; base.onKill = () => lose(`The depot at ${c.site} was levelled from the air.`, .1);
  setObj('m', () => `Keep the depot standing — ${pct()}`); nav('b', base, 'DEPOT', '#8dff6a');
  /* a ship comes in from the far side of the depot, a long way out, and makes for it */
  const inbound = (v, da, o = {}) => { const a = Math.atan2(A.x - ms.LZ.x, A.z - ms.LZ.z) + da; let x = A.x + Math.sin(a) * 390, z = A.z + Math.cos(a) * 390; const k = Math.min(1, 395 * FD.k / Math.hypot(x, z)); x *= k; z *= k; return mkCapital(v, x, z, 1, { hpK, dK: .65 + c.diff * .07, alert: true, to: A, focus: base, yaw: Math.atan2(A.x - x, A.z - z), ...o }); };
  const state = S => `hull ${Math.max(0, S.hp / S.max * 100).toFixed(0)}% · ${S.subs.filter(s => s.gun && !s.dead).length} guns · ${S.subs.filter(s => !s.gun && !s.dead).length} engines`;
  /* a beaten captain may ask to be let go */
  const parley = async S => {
    await until(() => S.dead || S.hp < S.max * .3); if (S.dead || ms.over) return; const cap = mkChar(c.seed + 77 + ships.indexOf(S) * 31, `${S.name} — CAPTAIN`, FAC[c.foe].col, 'Capt.'); fieldWho(cap, S);
    const r = await ask(cap, 'Mercenary. She is finished and we both know it. I have two hundred people aboard. Let me take her out of your sky and you will not see this hull again.', ['Finish her', 'Then pay for the sky you are using'], 14, 0);
    if (S.dead || ms.over) return; if (r !== 1) { rep(c.foe, -3); return say(cap, 'Then we will see how much of that depot I can take with me.'); }
    if (Math.random() < .65) { const amt = 24000 + c.diff * 9000; bonus("Captain's purse", amt); S.flee = true; for (const s of [S, ...S.subs]) if (!s.dead) { s.team = 2; s.pacify = true; s.gone = true; } unnav(S.oid); setObj(S.oid, null, 3); ms.payK *= .85; rep(c.emp, -5); rep(c.foe, 4); say(cap, 'Transferring it now. Helm — bring her about.'); say(ms.hnd, 'You let her go? She will be back over another depot inside a month. I am docking the fee.'); note(`You let the ${S.name} limp home for ${fmt(amt)}.`); }
    else say(cap, 'I have nothing to pay you with but the guns. So be it.');
  };
  const ships = [], hunt = (S, id, label) => { ships.push(S); S.oid = id; look(S, S.name); nav(id, S, label, '#ff5a1f'); setObj(id, () => `Bring down the ${S.name} — ${state(S)}`); S.onKill = () => { unnav(id); if (!ms.over) setObj(id, null, 1); }; parley(S); return S; };
  const done = S => S.dead || S.flee;
  if (plot === 'raid') {
    say(ms.hnd, `${c.contact.last}. ${F} is going to bomb ${c.site} flat. Nothing on the ground this time: gunships and bombers, three waves. Get under them and break it up.`);
    const wave = (n, L) => { const a = rand(TAU), W = L.map(v => mkDrone(...ringPt(V3(A.x + Math.sin(a) * 250, 0, A.z + Math.cos(a) * 250), 30), 1, v)); W.forEach((e, i) => { e.alert = true; if (i % 2 === 0) e.focus = base; }); look(W[0], 'AIR RAID — WAVE ' + n, true); msg(`AIR RAID — WAVE ${n} OF 3`, 3); sfx.play('alarm'); return W; };
    const lt = capTier(c) < 1, n = 2 + (c.diff >> 1), fill = (L, k) => Array.from({ length: k }, () => pick(L)); setObj('k', 'Break up the air raid — wave 1 of 3'); await until(() => near(A, 150) || ms.t > 30);
    let W = wave(1, fill(lt ? ['hunter', 'scr'] : ['shr', 'hunter', 'scr'], n + 1)); await until(() => !alive(W)); setObj('k', 'Break up the air raid — wave 2 of 3'); await after(7);
    W = wave(2, fill(lt ? ['shr', 'scr'] : ['vul', 'hrp', 'shr'], n + 1)); chatter(ms.ops, 'Bombers in this one. Watch for the rings on the ground and do not be standing in them.'); await until(() => !alive(W)); setObj('k', 'Break up the air raid — wave 3 of 3'); await after(7);
    W = wave(3, [...fill(lt ? ['shr', 'hunter'] : ['vul', 'hrp', 'shr'], n + 1), 'scr', 'scr']); if (c.diff >= 4) dropNear(140, .5); await until(() => !alive(W)); setObj('k', null, 1);
    note(`Three waves came for ${c.site} by air. The depot was at ${pct()} when the last of them went down.`);
  } else {
    await until(() => ms.t > 4);
    if (plot === 'pair') {
      const H = hunt(inbound('hive', -.5), 'k', 'CARRIER'); say(ms.hnd, `${c.contact.last}. A ${F} carrier is inbound on ${c.site} and she is not alone: a cruiser is an hour behind her and closing. You have the carrier to yourself for about a minute.`);
      await until(() => ms.t > 110 || H.hp < H.max * .35 || done(H)); const L = hunt(inbound('lev', .6), 'k2', 'CRUISER'); say(ms.ops, 'There is the second hull. Gun cruiser, coming in on the other bearing. Her engines are outboard at the stern — each one you take costs her a quarter of the hull.');
      (async () => { await until(() => done(H) || done(L)); if (!ms.over && !(done(H) && done(L))) chatter(ms.ops, 'One down. The other one is not leaving.'); })();
    } else if (plot === 'carrier') {
      hunt(inbound('hive', rand(-.5, .5), { cap: 3 + (c.diff >> 1) }), 'k', 'CARRIER'); say(ms.hnd, `${c.contact.last}. A ${F} carrier is inbound on ${c.site}. She will sit off the depot and bury it in drones. Everything she launches she can replace — so kill the carrier.`);
      (async () => { await after(26); chatter(ms.ops, 'She keeps her distance, so go to her. Engines are at the stern, and she has point defence under both hulls.'); })();
    } else {
      hunt(inbound('lev', rand(-.5, .5)), 'k', 'CRUISER'); say(ms.hnd, `${c.contact.last}. A ${F} gun cruiser is inbound on ${c.site}. She will be overhead inside a minute and she will take the depot apart. Bring her down.`);
      (async () => { await after(20); chatter(ms.ops, 'The belly turrets are what will hurt you. The engines are what will hurt her: outboard, at the stern, a quarter of the hull each. When the prow lights up, move.'); })();
    }
    if (c.diff >= 4) (async () => { await after(60); if (!ms.over) { say(ms.ops, 'Dropship under her, coming in low. They are putting a ground party on the depot.'); dropNear(150, .35); } })();
    await until(() => ships.every(done)); const fled = ships.filter(s => s.flee && !s.dead).length, down = ships.length - fled;
    note(down ? `${down > 1 ? 'Both ships' : 'The ' + ships.find(s => s.dead).name} came down over ${c.site}. The depot was at ${pct()}.` : `No ship came down over ${c.site}, but none stayed either.`);
    if (down) bonus('Hull bounty', c.pay * .12 * down);
  }
  setObj('m', null, 1); base.inv = true; rep(c.emp, 2); return extract(`The sky over ${c.site} is clear.`);
};

/* an air wing on call: gunships and missile carriers over whatever fight is already going on */
TWISTS.air = async function (ms) {
  await after(rand(40, 110)); const c = ms.c, lt = capTier(c) < 1, [x, z] = ringPt(P.pos, 260), W = [];
  for (let i = 0; i < 2 + (c.diff >> 1); i++) { const e = mkDrone(x + rand(-30, 30), z + rand(-30, 30), 1, pick(lt ? ['hunter', 'scr', 'shr'] : c.diff < 3 ? ['shr', 'hrp', 'scr'] : ['shr', 'hrp', 'vul'])); e.alert = true; W.push(e); }
  look(W[0], 'AIR WING', true); say(ms.ops, 'Fast movers on the scope. An enemy air wing, coming in low — look up.'); note('An enemy air wing joined the fight.');
};
/* a crawler nobody mentioned */
TWISTS.worm = async function (ms) {
  await after(rand(60, 130)); const c = ms.c, [x, z] = ringPt(P.pos, 200), H = mkCentipede(x, z, 1, { n: 3 + (c.diff >> 1), hpK: .45 + c.diff * .1 }); H.alert = true; P.shake += .5; _v.set(x, heightAt(x, z) + 1, z); puff(FD.fx, _v, 30, 7, .5, .45, 6, 14);
  look(H, 'CRAWLER'); say(ms.ops, 'Seismics just went off the scale. Something long has come up out of the ground near you, and every segment of it is armed. The head is the part to kill.');
  nav('wm', H, 'CRAWLER', '#ff9adf'); setObj('wm', 'Kill the crawler — go for the head', 0, true); H.onKill = () => { unnav('wm'); if (ms.over) return; setObj('wm', null, 1); bonus('Crawler bounty', 26000 + c.diff * 6000); note('You killed a crawler that was not on anybody\'s map.'); };
};
/* a field works off to one side, feeding the fight until somebody goes and stops it */
TWISTS.works = async function (ms) {
  const c = ms.c, p = ms.W; if (!p) return; await after(rand(22, 55));
  const F = mkFactory(p.x, p.z, 1, { ry: Math.atan2(ms.A.x - p.x, ms.A.z - p.z), every: 26 - c.diff * 1.5, cap: 2, tier: c.diff < 3 ? 0 : 1, hpK: .5 + c.diff * .04, name: 'FIELD WORKS', wake: 1e4, first: 3, kid: { skill: .7 + c.diff * .07, hpK: .7 + c.diff * .05 }, stock: 2 + c.diff,
    dry: () => { if (ms.over || F.dead) return; unnav('fw'); setObj('fw', null, 3); F.name += ' (SPENT)'; chatter(ms.ops, 'That field works has stopped building. It has used up whatever it was brought with — forget it.'); } });
  look(F, 'FIELD WORKS'); say(ms.ops, 'There is a field works out at the edge of the grid, and its door is open. Everything it builds is coming your way. It is not in the contract, and it only has the stock it was brought with — but every machine it finishes is one more on you. Kill it early or outlast it.');
  setObj('fw', 'Destroy the field works', 0, true); nav('fw', F, 'WORKS', '#7fe7ff'); F.onKill = () => { unnav('fw'); if (ms.over) return; setObj('fw', null, 1); bonus('Field works', 24000 + c.diff * 5000); note('You destroyed a field works that was feeding the fight.'); };
};
/* settle the books after a sortie: returns the debrief the XO reads out */
function settle() {
  const c = MS.c, ok = MS.ok, L = [], add = (l, v, tag) => { if (Math.round(v)) { L.push([l, Math.round(v)]); if (tag) tal('cr.' + tag, Math.abs(Math.round(v))); } }, payer = MS.payer, own = !!(c.story && STORY[c.story].first), solo = !!(c.story && STORY[c.story].ch[c.chap].solo), base = ok ? c.pay * MS.payK : c.pay * (MS.partial || 0), D = { c, ok, text: MS.endText, log: [...MS.log], lines: L, renege: false, base };
  add(ok ? (own && STORY[c.story].payL ? STORY[c.story].payL : payer ? (c.cok === 'sub' && payer === c.emp ? `Subcontract fee — ${RIV[c.co].short}` : `Contract fee — ${c.story && STORY[c.story].payer || FAC[payer].short}`) : 'Collection — off the books') : 'Partial payment', base, 'fee');   /* the first sortie is flown on the company's own account: no client to please, no bill from the bay, and a bad day there is not on the record */ for (const [l, v] of MS.bonus) add(l, v, v > 0 ? 'bonus' : '');
  if (ok && P.kills) add(`Battlefield scrap ${c.salv}% · ${P.kills} kills`, P.kills * 1500 * c.salv / 25, 'scrap');
  D.salv = ok ? salvageRoll(c, YARD.loot, MS.bonus.length > 0) : null; YARD.loot = [];
  if (!own) add('Repairs and rearm', -((1 - clamp(P.armor / P.max, 0, 1)) * 38000 + (P.dead ? 55000 : 0)), 'rep');
  if (!own) { const lost = Object.keys(P.lost || {}).filter(k => player.cfg[k]); if (lost.length) add(`Rebuilding ${lost.map(k => ZONE_N[k].toLowerCase()).join(', ')}`, -lost.reduce((s, k) => s + itemInfo(CAT[k] + '.' + player.cfg[k]).price * .15, 0), 'rep'); }
  if (CO.wing && CO.wing.share && !solo) add(`${CO.wing.ch.first}'s ${Math.round(CO.wing.share * 100)}% share`, -Math.max(0, base) * CO.wing.share, 'share');
  if (MS.v.faked && Math.random() < .45) { add('Clawback — the "dead" pilot was seen alive', -base * .5); rep(c.emp, -14); D.log.push(`${FAC[c.emp].short} found out the kill was faked.`); }
  if (payer === c.emp && !own) rep(c.emp, Math.round((ok ? 4 + c.diff : MS.abort ? -8 : -5) * (c.cok === 'sub' ? .5 : 1))); if (ok && FAC[c.foe] && c.foe !== 'maw') rep(c.foe, -3); rivSettle(c, ok, D, add, base);
  D.rep = Object.entries(MS.repD).filter(([f, v]) => CO.rep[f] !== undefined && Math.round(v)); for (const [f, v] of D.rep) repAdd(f, v, f === c.emp ? `${ok ? 'completed' : MS.abort ? 'abandoned' : 'failed'} their ${TYPES[c.type].name.toLowerCase()} contract at ${c.site}` : f === c.foe ? `flew against them at ${c.site}` : `the ${TYPES[c.type].name.toLowerCase()} contract at ${c.site}`);
  D.rel = []; for (const [k, L] of Object.entries(MS.relD || {})) if (RIV[k]) for (const [d, why] of L) if (Math.round(d)) { D.rel.push([k, Math.round(d), why]); rivRel(k, Math.round(d), why || `the ${c.site} contract`); }
  if (c.story) storySettle(c, ok, D, add);
  D.renege = ok && payer === c.emp && c.twists.includes('renege') && base > 0; D.total = L.reduce((s, l) => s + l[1], 0); CO.cb += D.total; if (ok) CO.done++; else if (!own) CO.fails++; talSettle(c, ok, D, own);
  /* the world moves on */
  CO.hour += rand(8, 20); while (CO.hour >= 24) { CO.hour -= 24; CO.day++; } dropContract(c);
  if (c.story) news(D.story.news); else news(ok ? `${YARD.name} completed a ${TYPES[c.type].name.toLowerCase()} contract at ${c.site}${payer && payer !== c.emp ? ' — though not for the original client' : ''}.` : `${YARD.name} failed a ${FAC[c.emp].short} contract at ${c.site}.`);
  for (const o of CO.board.filter(o => !o.story && Math.random() < .4)) { dropContract(o); news(`${rivOutfit()} took the ${FAC[o.emp].short} job at ${o.site}.`); }
  if (c.story) { } else if (ok && payer === c.emp && Math.random() < .7) { const [t, pre] = NEXT[c.type]; CO.board.push(genContract({ type: t, emp: c.emp, foe: c.foe, biome: Math.random() < .6 ? c.biome : undefined, pre: `FOLLOW-UP to ${c.site}. ${pre}`, upd: 'FOLLOW-UP' })); }
  else if (!ok && Math.random() < .6) CO.board.push(genContract({ type: pick(['strike', 'recovery']), emp: c.foe === 'maw' ? pick(EMPS) : c.foe, foe: c.emp, pre: `${FAC[c.emp].short} is reeling after ${c.site}. Their rivals smell blood. `, upd: 'OPPORTUNITY' }));
  fillBoard(); drift(); drift(); if (CO.wing && !solo) { if (CO.wingDown) { CO.wing.p.until = now() + 48; if (CO.wing.p.bar) BARSV.pst[CO.wing.p.seed] = { until: CO.wing.p.until }; } CO.wing = null; CO.wingDown = false; } saveCO(); return D;
}
