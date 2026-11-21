/* ============ MISSIONS: SIX CONTRACT TYPES, EACH WITH FOUR HIDDEN PLOTS ============ */
const TYPES = {
  strike: { name: 'Strike', tag: 'STK', base: 96000, plots: ['clean', 'trap', 'civ', 'melt'], desc: 'Demolition raid on a fixed installation.' },
  garrison: { name: 'Garrison', tag: 'GAR', base: 86000, plots: ['siege', 'bribe', 'arty', 'evac'], desc: 'Hold a position against a mounting assault.' },
  escort: { name: 'Escort', tag: 'ESC', base: 78000, plots: ['gauntlet', 'cargo', 'break', 'detour'], desc: 'Bring a convoy through hostile ground.' },
  headhunt: { name: 'Headhunt', tag: 'HNT', base: 112000, plots: ['duel', 'runner', 'decoy', 'plea'], desc: 'Find and eliminate a named pilot.' },
  recon: { name: 'Recon', tag: 'RCN', base: 60000, plots: ['quiet', 'column', 'beacon', 'hunted'], desc: 'Scan three sites and get out.' },
  recovery: { name: 'Recovery', tag: 'RCV', base: 88000, plots: ['race', 'cargo', 'trap', 'surv'], desc: 'Retrieve a package from a crash site.' },
};
const ringPt = (c, r) => { for (let i = 0; i < 20; i++) { const a = rand(TAU), x = c.x + Math.sin(a) * r, z = c.z + Math.cos(a) * r; if (Math.hypot(x, z) < 385 * FD.k) return groundSpot(x, z, 0, 25); } const k = Math.max(0, 1 - r / (Math.hypot(c.x, c.z) || 1)); return groundSpot(c.x * k, c.z * k, 0, 25); };
const hot1 = L => { for (const e of L) e.alert = true; look(L.find(e => e.kind === 'mech') || L[0], 'HOSTILES', true); return L; };
const drop = (x, z, k, o) => dropship(x, z, () => hot1(foes(k, x, z, 4, 30, o)));
const dropNear = (dist, k, o) => { const [x, z] = groundSpot(P.pos.x, P.pos.z, dist, dist + 30); return drop(x, z, k, o); };
const secs = t0 => Math.max(0, t0 - MS.t).toFixed(0) + 's';
const third = c => pick(Object.keys(FAC).filter(f => f !== c.emp && f !== c.foe && f !== 'maw'));

const MISSIONS = {
  async strike(ms) {
    const c = ms.c, A = ms.A, E = FAC[c.emp].short, F = FAC[c.foe].short, ks = ['gen', 'fuel', 'fuel', 'comm', 'depot'].slice(0, 3 + (c.diff > 2 ? 1 : 0)); if (c.plot === 'civ') ks[ks.length - 1] = 'hab';
    const T = ks.map((k, i) => { const a = i * TAU / ks.length + .4; return mkStruct(k, A.x + Math.sin(a) * 27, A.z + Math.cos(a) * 27, 1); }), all = [...T];
    spawn({ turret: 1 + (c.diff >> 1) }, A.x, A.z, 36, 50); foes(.8, A.x, A.z, 20, 75, { ai: 'guard' });
    setObj('m', () => `Destroy the ${c.site} installation — ${alive(T)} target${alive(T) === 1 ? '' : 's'} left`); T.forEach((t, i) => nav('t' + i, t, 'TARGET', '#ff5a1f'));
    say(ms.hnd, `${c.contact.last} here. Level everything marked at ${c.site}. I do not need prisoners. I need rubble.`);
    if (c.plot === 'civ') {
      const hab = T[T.length - 1], fm = mkChar(c.seed + 9, 'SITE FOREMAN', '#ffffff'); fieldWho(fm, hab); await until(() => near(A, 210) || hab.dead);
      const r = hab.dead ? 1 : await ask(fm, 'Mercenary unit, hold fire! The hab block is our shelter — forty workers and their families. We are not soldiers. Please.', ['Spare the hab block', 'Orders stand. Everything burns', 'Mercy costs. What can you pay?']);
      if (r !== 1 && !hab.dead) {
        T.splice(T.indexOf(hab), 1); hab.team = 2; hab.name = 'SHELTER (SPARED)'; unnav('t' + all.indexOf(hab)); rep(c.foe, 5);
        if (r === 2) { bonus("Foreman's strongbox", 18000); say(fm, 'Take it. It is everything in the strongbox. Just go around us.'); note("You took the workers' strongbox in exchange for sparing their shelter."); }
        else { say(fm, 'Thank you. We will not forget this.'); note("You spared the workers' shelter."); }
        const h = await ask(ms.hnd, 'That block is on the target list. Leave it standing and I dock a quarter of your fee.', ['Dock it. They live', 'Then pay me to hold the site instead'], 16, 0);
        if (h === 1 && Math.random() < .6) { say(ms.hnd, 'Fine. Destroy the rest, then hold that ground for sixty seconds. Full fee.'); ms.v.hold = true; } else { ms.payK *= .75; rep(c.emp, -3); if (h === 1) say(ms.hnd, 'You are in no position to bargain. Three quarters.'); }
        (async () => {
          await after(18); say(fm, `One more thing, mercenary. ${F} keeps a weapons cache out past the ridge. Nobody watches it.`);
          const cache = mkStruct('depot', ms.B.x, ms.B.z, 1, { name: 'WEAPONS CACHE' }); setObj('c', 'Destroy the hidden weapons cache', 0, true); nav('c', cache, 'CACHE', '#7fe7ff'); cache.onKill = () => { unnav('c'); setObj('c', null, 1); bonus('Weapons cache', 30000); };
        })();
      } else if (!hab.dead || r === 1) { say(fm, 'You — you cannot —'); rep(c.foe, -8); note('You destroyed the shelter with the workers inside.'); ms.v.rev = true; }
    }
    if (c.plot === 'trap') {
      await until(() => near(A, 130) || alive(T) < T.length);
      say(ms.hnd, `Wait. Thermals read those tanks as empty. ${c.site} is a decoy. Get out of th—`); await after(3.5); ms.jam = true;
      const r = await ask(ms.foe, `Thank you for coming. We have wanted a word with ${E}'s hired guns. Power down and you walk away. The machine stays.`, ['Fight through it', 'Offer to change sides'], 14, 0);
      setObj('m', null, 3); all.forEach((t, i) => unnav('t' + i));
      if (r === 1 && CO.rep[c.foe] > -25 && Math.random() < .65) {
        say(ms.foe, `...Interesting. Then prove it. ${E} has a spotter team dug in nearby, calling fire on my people. Remove them.`);
        setTeam(FD.ents.filter(e => e.team === 1), 2, { pacify: true });
        const bk = mkStruct('bunker', ms.B.x, ms.B.z, 1, { name: 'SPOTTER POST' }), G = [bk, ...spawn({ tank: 2, mech: 1, tier: 1 }, ms.B.x, ms.B.z, 14, 40, 1, { paint: ms.allyPaint })];
        setObj('s', () => `Destroy the ${E} spotter team — ${alive(G)} left`); nav('s', bk, 'SPOTTERS', '#ff5a1f'); ms.payer = c.foe; ms.payK = .85; rep(c.emp, -22); rep(c.foe, 14); note(`You changed sides mid-contract and hunted ${E}'s spotters for ${F}.`);
        say(ms.hnd, 'You treacherous — we will remember this, mercenary.'); await until(() => !alive(G)); setObj('s', null, 1); ms.jam = false; return extract(`${F} wired payment. ${E} has put your name on a list.`);
      }
      if (r === 1) say(ms.foe, 'We do not hire what we can simply take.');
      setObj('s', 'Survive the ambush and break out to the fallback LZ'); dropNear(80, .7); (async () => { await after(5); dropNear(90, .6); })();
      for (let i = 0; i < 5; i++) shell(ms.LZ.x + rand(-34, 34), ms.LZ.z + rand(-34, 34), 30, 14, 2 + i);
      say(ms.ops, 'They have the primary LZ zeroed. Fallback pickup is marked — move!'); nav('x', ms.C, 'FALLBACK LZ', '#8dff6a'); await until(() => near(ms.C, 36));
      ms.jam = false; setObj('s', null, 1); bonus('Hazard pay — bad intel', c.pay * .15); rep(c.emp, 2); note(`${c.site} was bait. You fought your way out of the ambush.`); return win('Decoy site. You broke out of the kill zone alive.');
    }
    if (c.plot === 'melt') (async () => {
      const gen = T[0]; gen.name = 'FUSION REACTOR'; await until(() => gen.dead); const t0 = ms.t + 40;
      look(gen.pos.clone(), 'REACTOR BREACH'); say(ms.ops, 'Containment is gone — that reactor will take the whole basin with it. Forty seconds. RUN.'); sfx.play('alarm'); setObj('r', () => `Get clear of the blast radius — ${secs(t0)}`); note('The reactor went critical.');
      await until(() => ms.t >= t0); const p = V3(A.x, A.y + 8, A.z), d = Math.hypot(P.pos.x - A.x, P.pos.z - A.z);
      for (let i = 0; i < 6; i++) explode(FD.fx, _v.set(A.x + rand(-40, 40), A.y + rand(4, 30), A.z + rand(-40, 40)).clone(), 4); sfx.play('boom', 1.6); P.shake += 1.4; fade(.85); tween(1.6, k => fade(.85 * (1 - k)));
      for (const e of [...FD.ents]) if (e.pos.distanceTo(p) < 190) damage(e, 2000, null, 0); if (d < 190) damage(PE, 1400 * (1 - d / 190), null, 1); setObj('r', null, d < 190 ? 2 : 1);
    })();
    await until(() => !alive(T)); setObj('m', null, 1);
    if (ms.v.hold) { const t0 = ms.t + 60; setObj('h', () => `Hold ${c.site} — ${secs(t0)}`); dropNear(140, .8); await until(() => ms.t >= t0); setObj('h', null, 1); }
    if (ms.v.rev) { say(ms.foe, 'There were children in that block. Every gun I have is coming for you.'); dropNear(120, 1.1, { skill: 1.4 }); }
    else if (c.plot === 'clean') { say(ms.ops, 'Good effect on target. Their response force is rolling — do not wait around.'); hot1(foes(.6, ...ringPt(A, 170), 0, 30)); }
    return extract(`${c.site} installation destroyed.`);
  },

  async garrison(ms) {
    const c = ms.c, A = ms.A, E = FAC[c.emp].short, F = FAC[c.foe].short, base = mkStruct('hq', A.x, A.z, 0, { name: `${c.site} FIELD HQ`, hpK: 1 + c.diff * .25 }), D = [...spawn({ turret: 2 + (c.diff > 3 ? 1 : 0) }, A.x, A.z, 24, 32, 0), ...spawn({ tank: 1 + (c.diff > 2 ? 1 : 0) }, A.x, A.z, 32, 42, 0)];   /* the harder the contract, the more the client has dug in: the waves grow faster than one machine's guns do */
    const pct = () => Math.max(0, base.hp / base.max * 100).toFixed(0) + '%'; base.onKill = () => { if (!ms.v.turn && !ms.v.evac) lose(`${c.site} field HQ was destroyed.`, .1); };
    setObj('m', () => `Defend the field HQ — integrity ${pct()}`); nav('b', base, 'HQ', '#8dff6a');
    say(ms.hnd, `Mercenary, ${c.contact.last}. ${F} armor is massing against ${c.site}. Get to the HQ and hold it.`);
    const wave = (k, n, o) => { const W = foes(k, ...ringPt(A, 235), 0, 40, o); W.forEach((e, i) => { e.alert = true; if (i % 2) e.focus = base; }); look(W.find(e => e.kind === 'mech') || W[0], 'ASSAULT WAVE ' + n, true); msg(`ASSAULT WAVE ${n}`, 3); sfx.play('alarm'); return W; };
    await until(() => near(A, 130) || ms.t > 35); let W = wave(.7, 1); await until(() => !alive(W));
    if (c.plot === 'bribe') {
      const offer = Math.round(c.pay * 1.3 / 1000) * 1000;
      const r = await ask(ms.foe, `Mercenary. You have made your point. ${fmt(offer)} says you step away from that building and let us finish this.`, ['Refuse', 'Double it and we can talk', 'Accept — change sides'], 18, 0);
      let turn = r === 2, pay = offer; if (r === 1) { if (Math.random() < .5) { turn = true; pay = offer * 1.6; say(ms.foe, 'Robbery. Done. Now earn it.'); } else { say(ms.foe, 'Greed. Then you can burn with them.'); ms.v.angry = 1.2; } }
      if (turn) {
        ms.v.turn = true; ms.payer = c.foe; ms.payK = pay / c.pay; rep(c.emp, -25); rep(c.foe, 12); note(`You took ${F}'s money and turned your guns on the HQ you were hired to defend.`);
        setTeam([base, ...D], 1, { alert: true }); setObj('m', null, 3); setObj('t', () => `Destroy the field HQ — integrity ${pct()}`); nav('b', base, 'HQ', '#ff5a1f');
        say(ms.hnd, 'What are you doing?! Mercenary, respond! RESPOND!'); spawn(force(.6), ...ringPt(A, 190), 0, 30, 0, { paint: ms.foePaint });
        await until(() => base.dead); setObj('t', null, 1); return extract(`${F} paid in full. ${E} will not forget.`);
      }
      rep(c.emp, 3); note(`You refused ${F}'s bribe.`);
    }
    if (c.plot === 'arty') {
      const Gs = [0, 1, 2].slice(0, 2 + (c.diff > 3 ? 1 : 0)).map(i => mkStruct('arty', ms.B.x + (i - 1) * 17, ms.B.z + (i % 2) * 11, 1)); foes(.5, ms.B.x, ms.B.z, 16, 55, { ai: 'guard' });
      look(Gs[0], 'SIEGE GUNS'); say(ms.ops, 'Incoming! Siege guns are ranging on the HQ from the ridge — it will not survive that for long. Kill those guns.');
      setObj('g', () => `Silence the siege guns — ${alive(Gs)} left`); Gs.forEach((g, i) => nav('g' + i, g, 'GUN', '#ff5a1f'));
      (async () => { while (alive(Gs)) { shell(A.x + rand(-34, 34), A.z + rand(-34, 34), 70, 16, 2.4); await after(rand(2.5, 4.5) * 3 / alive(Gs)); } })();
      W = wave(.6, 2); await until(() => !alive(Gs)); setObj('g', null, 1); Gs.forEach((g, i) => unnav('g' + i)); say(ms.hnd, 'The shelling has stopped. Whatever you did out there — thank you.'); note('You silenced the siege guns.'); await until(() => !alive(W));
    }
    if (c.plot === 'evac') {
      W = wave(1.7, 2); drop(...ringPt(A, 150), .7); await after(15);
      say(ms.hnd, 'There are too many. We are pulling out — cover the transports to your dropship. That is the contract now.'); ms.v.evac = true; setObj('m', null, 3); unnav('b'); base.team = 2;
      const Tk = [0, 1, 2].map(i => mkTruck(A.x + 15 + i * 9, A.z - 17, 0, [ms.LZ.clone().add(V3((i - 1) * 12, 0, 14))]));
      look(Tk[1], 'TRANSPORTS'); setObj('e', () => `Cover the evacuation — ${alive(Tk)}/3 transports alive`); Tk.forEach((t, i) => nav('k' + i, t, 'TRANSPORT', '#8dff6a')); W.forEach(e => e.focus = pick(Tk));
      (async () => { await after(22); hot1(foes(.6, ...ringPt(ms.LZ, 170), 0, 30)).forEach(e => e.focus = pick(Tk)); })();
      await until(() => Tk.every(t => t.dead || t.arrived)); const n = alive(Tk); if (!n) return lose('The evacuation convoy was wiped out.', .1);
      ms.payK *= .5 + n / 6; note(`${c.site} fell, but you got ${n} of 3 transports out.`); return win(`${c.site} was lost. ${n} of 3 transports reached the dropship.`);
    }
    if (c.plot !== 'arty') { await after(6); W = wave(1 * (ms.v.angry || 1), 2); say(ms.ops, 'First wave is broken. Second is already forming up.'); await until(() => !alive(W)); }
    await after(6); msg('FINAL ASSAULT', 3); let Fw = null; const [x, z] = ringPt(A, 150); say(ms.ops, 'Last push — and they are bringing dropships this time.');
    dropship(x, z, () => { Fw = hot1(foes(1.1 * (ms.v.angry || 1), x, z, 4, 30)); Fw.forEach((e, i) => { if (i % 2) e.focus = base; }); }); await until(() => Fw && !alive(Fw));
    if (base.hp > base.max * .6) bonus('HQ held intact', c.pay * .1); note(`You held ${c.site}.`); return win(`${c.site} held. ${F} has withdrawn.`);
  },

  async escort(ms) {
    const c = ms.c, A = ms.A, L = ms.LZ, E = FAC[c.emp].short, nx = -(A.z - L.z), nz = A.x - L.x, nl = Math.hypot(nx, nz) || 1;
    const mid = (k, off = 0) => gpos(lerp(L.x, A.x, k) + nx / nl * off, lerp(L.z, A.z, k) + nz / nl * off); let path = [mid(.42, 30), mid(.72, -30), A.clone()];
    const route = () => Tk.forEach((t, i) => { t.path = path.map((p, j) => j === path.length - 1 ? p.clone().add(V3(nx / nl * (i - 1) * 11, 0, nz / nl * (i - 1) * 11)) : p); t.wp = 0; });
    const Tk = [0, 1, 2].map(i => mkTruck(P.pos.x + nx / nl * 10 - (A.x - L.x) / nl * (i * 13 - 8), P.pos.z + nz / nl * 10 - (A.z - L.z) / nl * (i * 13 - 8), 0, [])), esc = spawn({ tank: 2 }, P.pos.x, P.pos.z, 20, 30, 0, { lead: Tk[1] });
    route(); const lead = () => Tk.find(t => !t.dead) || Tk[0], reach = p => until(() => Tk.some(t => !t.dead && t.pos.distanceTo(p) < 58));
    FD.tick.push(() => { if (ms.over) return false; const h = ms.v.stop || FD.t0.some(e => e.team === 1 && e.kind !== 'struct' && Tk.some(t => !t.dead && t.pos.distanceTo(e.pos) < 95)); for (const t of Tk) t.halt = h; return true; });
    setObj('m', () => `Escort the convoy to ${c.site} — ${alive(Tk)}/3 haulers`); Tk.forEach((t, i) => nav('k' + i, t, 'HAULER', '#8dff6a')); nav('d', A, 'DEPOT', '#ffb21a');
    (async () => { await until(() => !alive(Tk)); lose(ms.v.freed ? 'The haulers were destroyed with everyone aboard.' : 'The convoy was destroyed.', .05); })();
    const amb = (k, o) => { const G = hot1(foes(k, ...ringPt(lead().pos, 130), 0, 30, o)); G.forEach(e => e.focus = pick(Tk)); msg('AMBUSH — CONVOY UNDER FIRE', 3); sfx.play('alarm'); return G; };
    say(ms.hnd, `Three haulers, mercenary. The convoy halts whenever it is under fire, so clear the road and it rolls. Get them to ${c.site}.`); let G;
    if (c.plot === 'detour') {
      ms.v.stop = true; const r = await ask(ms.ops, 'Scouts say the direct pass is mined end to end. Two ways round: through the old outpost — short, but garrisoned — or the long ridge road, exposed, with weather closing in.', ['Through the outpost', 'The long ridge road'], 20, 0);
      if (r === 0) { path = [ms.B.clone(), A.clone()]; spawn({ turret: 2 + (c.diff >> 1) }, ms.B.x, ms.B.z, 22, 46); foes(.6, ms.B.x, ms.B.z, 10, 55, { ai: 'guard' }); mkStruct('bunker', ms.B.x + 22, ms.B.z + 18, 1, { name: 'OUTPOST' }); note('You took the convoy through the garrisoned outpost.'); }
      else { path = [ms.C.clone(), mid(.8, -50), A.clone()]; const s = EV.B.storm; if (s) weatherShift(s[1], s[2], s[3]); note('You took the long road through the weather.'); }
      route(); ms.v.stop = false; await reach(path[0]); if (r === 1) { G = [...spawn({ drone: 3 + c.diff }, lead().pos.x, lead().pos.z, 90, 140), ...amb(.5)]; hot1(G); } else G = FD.t0.filter(e => e.team === 1 && e.pos.distanceTo(ms.B) < 120);
      await until(() => !alive(G));
    } else {
      await reach(path[0]);
      if (c.plot === 'break') {
        const tk = lead(), dr = mkChar(c.seed + 31, 'CONVOY MASTER', '#ffd98a'); fieldWho(dr, tk); explode(FD.fx, tk.pos.clone(), 2); sfx.play('boom', 1); tk.hp = Math.min(tk.hp, tk.max * .55); ms.v.stop = true;
        const r = await ask(dr, 'Mine! Lead hauler has lost an axle. Give me a minute and I can patch it — or we cut it loose and run.', ['Hold here and make the repair', 'Abandon it. Keep moving'], 16, 0);
        if (r === 0) { const t0 = ms.t + 55; setObj('r', () => `Protect the repair crew — ${secs(t0)}`); amb(.8); (async () => { await after(22); amb(.7); })(); await until(() => ms.t >= t0); setObj('r', null, 1); if (!tk.dead) tk.hp = Math.max(tk.hp, tk.max * .8); say(dr, 'Axle is holding. Convoy — roll!'); note('You held the road while the convoy made repairs.'); }
        else { if (!tk.dead) killEnt(tk, 1); ms.payK *= .8; note('You abandoned a crippled hauler.'); say(dr, 'Charges set. Leaving her behind.'); amb(.5); }
        ms.v.stop = false;
      } else { G = amb(.6); await until(() => !alive(G)); }
      if (c.plot === 'cargo') {
        const rs = mkChar(c.seed + 21, 'RESISTANCE CELL', '#8dff6a');
        look(Tk.find((t, i) => i && !t.dead) || lead(), 'THE HAULERS'); let r = await ask(rs, `Mercenary — listen. Those haulers are not carrying ore. They are carrying our people, in chains, to ${c.site}. Scan hauler two if you do not believe me.`, ['Not my business', 'Ask your handler for the truth', 'Stop the convoy — free them'], 20, 0);
        if (r === 1) { const h = await ask(ms.hnd, 'The manifest is sealed and it stays sealed. An extra twenty percent says you never asked.', ['Take the money', 'No. Open the trucks'], 16, 0); if (h === 0) { ms.payK *= 1.2; note('You took hush money and kept the convoy rolling.'); r = -1; } else r = 2; }
        if (r === 2) {
          ms.v.freed = ms.v.stop = true; setTeam(esc, 1, { alert: true, lead: null }); rep(c.emp, -24); rep(c.foe, 8); ms.payer = null; ms.payK = .35; note('You stopped the convoy and freed the prisoners.');
          say(ms.hnd, 'You are in breach, mercenary. Escort detail: kill that mech and retake my cargo.'); setObj('m', null, 3); unnav('d'); const t0 = ms.t + 60; setObj('f', () => `Hold until the resistance transport arrives — ${secs(t0)}`);
          hot1(spawn(force(.8), ...ringPt(lead().pos, 150), 0, 30, 1, fopt({ paint: ms.allyPaint }))); await until(() => ms.t >= t0);
          const p = lead().pos; dropship(p.x + 20, p.z, null, undefined, 0); await after(8); say(rs, 'We have them. All of them. You will always have friends here, mercenary.'); bonus('Resistance collection', 25000); setObj('f', null, 1); return win('The prisoners are free. The resistance paid what it could.');
        }
        if (r === 0) note('You kept the convoy rolling and asked no questions.');
      }
    }
    await reach(path[path.length - 2] || A); G = amb(c.plot === 'cargo' ? 1.1 : .9); await until(() => !alive(G));
    if (c.plot === 'gauntlet') { await until(() => lead().pos.distanceTo(A) < 170); say(ms.foe, 'Those haulers do not reach the depot. All units, close in.'); const [x, z] = ringPt(A, 110); dropship(x, z, () => hot1(foes(.8, x, z, 4, 30, { skill: 1.35 })).forEach(e => e.focus = pick(Tk))); }
    await until(() => Tk.every(t => t.dead || t.arrived)); const n = alive(Tk); if (!n) return; ms.payK *= .4 + .2 * n; note(`${n} of 3 haulers reached ${c.site}.`); return win(`Convoy delivered — ${n} of 3 haulers reached ${c.site}.`);
  },
  async headhunt(ms) {
    const c = ms.c, A = ms.A, E = FAC[c.emp].short, ace = mkChar(c.seed + 41, FAC[c.foe].short + ' ACE', FAC[c.foe].col, 'Capt.'), call = NAMES.call[c.seed % NAMES.call.length], tier = c.diff > 3 ? 2 : c.diff > 1 ? 1 : 0;
    const mk = (x, z, o) => mkMech(x, z, { ...pick([[PRESETS[5], PRESETS[0]], [PRESETS[1], PRESETS[3]], [PRESETS[2], PRESETS[4]]][tier]), paint: ms.foePaint }, 1, fopt({ name: `"${call}" ${ace.last}`.toUpperCase(), ai: 'guard', hpK: 1.5 + c.diff * .15, skill: 1.35, ...o }));
    let tg = mk(A.x, A.z, c.plot === 'decoy' ? { hpK: .6 } : {}); const G = foes(.6, A.x, A.z, 20, 60, { ai: 'guard' });
    setObj('m', `Eliminate ${ace.name}, callsign "${call}"`); nav('a', tg, 'PRIMARY', '#ff5a1f');
    say(ms.hnd, `Target is ${ace.name} — "${call}". Last seen with a small escort at ${c.site}. I want that pilot off the board.`);
    if (c.plot === 'duel') {
      await until(() => near(tg.pos, 230) || tg.hp < tg.max);
      if (!tg.dead && tg.hp > tg.max * .85) {
        const r = await ask(ace, `So ${E} sends a mercenary. I would rather settle this cleanly. You and me. My lance stands down — if you have that much honor.`, ['Accept the duel', 'No deal. Weapons free'], 14, 1);
        if (r === 0) {
          setTeam(G, 2, { pacify: true }); tg.hp = tg.max = tg.max * 1.15; ms.v.duel = true; note(`You accepted ${ace.last}'s challenge to single combat.`);
          (async () => { await until(() => tg.dead || G.some(e => !e.dead && e.hp < e.max)); if (tg.dead) return; say(ace, 'You fire on my lance?! So much for honor. Kill this animal!'); setTeam(G, 1, { pacify: false, alert: true, skill: 1.6 }); ms.v.duel = false; rep(c.foe, -8); note('You broke the terms of the duel.'); })();
        } else say(ace, 'As you like. Lance — weapons free.');
      }
    }
    if (c.plot === 'runner') {
      await until(() => tg.dead || tg.hp < tg.max * .55);
      if (!tg.dead) {
        say(ace, 'Not today, mercenary.'); Object.assign(tg, { ai: 'flee', dest: ms.B.clone(), pacify: true }); setObj('r', `Stop "${call}" reaching the pickup`); nav('p', ms.B, 'ENEMY PICKUP', '#ff5a1f');
        say(ms.ops, 'Target is running for an extraction bird. Run them down before they lift!'); await until(() => tg.dead || tg.pos.distanceTo(ms.B) < 170);
        if (!tg.dead) { dropship(ms.B.x, ms.B.z, null); await until(() => tg.dead || tg.arrived); }
        if (!tg.dead) { await after(1.5); if (!tg.dead) { FD.scene.remove(tg.obj); tg.dead = true; FD.ents.splice(FD.ents.indexOf(tg), 1); setObj('r', null, 2); note(`"${call}" escaped wounded.`); return lose(`"${call}" reached the dropship and escaped — wounded, but alive.`, .25); } }
        setObj('r', null, 1); unnav('p');
      }
    }
    if (c.plot === 'decoy') {
      await until(() => tg.dead); unnav('a'); say(ms.hnd, `Hold on. Cockpit telemetry is wrong — that was a drone rig wearing ${ace.last}'s transponder. Then where is the real—`); await after(4);
      const [x, z] = groundSpot(P.pos.x, P.pos.z, 90, 120); let real = null; say(ace, 'Looking for me? You should have checked your six, mercenary.');
      dropship(x, z, () => { real = mk(x, z, { ai: 'hunt' }); real.alert = true; hot1(foes(.5, x, z, 6, 30, { skill: 1.3 })); nav('a', real, 'PRIMARY', '#ff5a1f'); });
      await until(() => real); tg = real; note(`The first "${call}" was a decoy. The real one dropped in behind you.`);
    }
    if (c.plot === 'plea') {
      await until(() => tg.dead || tg.hp < tg.max * .35);
      if (!tg.dead) {
        Object.assign(tg, { inv: true, pacify: true, team: 2, ai: 'hold' }); setTeam(G, 2, { pacify: true }); const bribe = Math.round(c.pay * .4 / 1000) * 1000;
        const r = await ask(ace, `Enough! I yield. ${E} wants me dead for what I saw at ${c.site}. Let me walk and I wire you ${fmt(bribe)}. Or take me in — I am worth more breathing.`, ['Finish the job', 'Take the bribe, report the kill', 'Take the pilot prisoner'], 20, 0);
        tg.inv = false;
        if (r === 0) { say(ace, 'Then I die on my feet.'); Object.assign(tg, { team: 1, pacify: false, ai: 'hunt', skill: 1.7 }); setTeam(G, 1, { pacify: false, alert: true }); rep(c.foe, -4); note(`${ace.last} tried to surrender. You declined.`); }
        else if (r === 1) { bonus(`${ace.last}'s bribe`, bribe); ms.v.faked = true; leave([tg, ...G]); unnav('a'); setObj('m', null, 1); note(`You took ${ace.last}'s money and reported a kill.`); say(ms.hnd, 'Transponder just went dark. Good. Come home.'); return extract(`"${call}" is reported dead.`); }
        else {
          Object.assign(tg, { team: 0, ai: 'follow', lead: PE }); leave(G); setObj('m', null, 3); setObj('p', `Bring ${ace.last} to the dropship alive`); nav('x', ms.LZ, 'DROPSHIP', '#8dff6a'); nav('a', tg, 'PRISONER', '#7fe7ff'); note(`You took ${ace.last} prisoner.`);
          say(ms.hnd, 'Alive? ...Acceptable. Better, even. Bring them in.'); await until(() => near(ms.LZ, 200) || tg.dead);
          if (!tg.dead) { say(ms.foe, `You are not taking ${ace.last} anywhere.`); hot1(foes(.9, ...ringPt(ms.LZ, 120), 0, 30)).forEach(e => e.focus = tg); }
          await until(() => tg.dead || (near(ms.LZ, 40) && tg.pos.distanceTo(ms.LZ) < 80));
          if (tg.dead) { setObj('p', null, 2); note(`${ace.last} died before reaching the dropship.`); return extract(`"${call}" is dead. The contract is satisfied.`); }
          setObj('p', null, 1); bonus('Live capture', c.pay * .3); rep(c.emp, 4); return win(`"${call}" delivered alive.`);
        }
      }
    }
    await until(() => tg.dead); setObj('m', null, 1); unnav('a');
    if (ms.v.duel) { bonus('Honor duel', c.pay * .15); rep(c.foe, 4); leave(G); say(mkChar(c.seed + 43, FAC[c.foe].short + ' LANCE SECOND', FAC[c.foe].col, 'Lt.'), 'It was a fair fight. We are leaving. Do not follow.'); note(`You beat ${ace.last} in single combat.`); }
    return extract(`"${call}" eliminated.`);
  },

  async recon(ms) {
    const c = ms.c, S = [ms.A, ms.B, ms.C], nm = ['ALPHA', 'BRAVO', 'CHARLIE'], prog = [0, 0, 0]; let done = 0;
    S.forEach((p, i) => { mkStruct(['comm', 'depot', 'bunker'][i], p.x, p.z, 1); foes(.35, p.x, p.z, 20, 60, { ai: 'guard' }); nav('s' + i, p, 'SCAN ' + nm[i], '#7fe7ff'); setObj('s' + i, () => `Scan site ${nm[i]}${prog[i] > 0 && prog[i] < 1 ? ' — ' + (prog[i] * 100).toFixed(0) + '%' : ''}`); });
    FD.tick.push(dt => { if (ms.over) return false; S.forEach((p, i) => { if (prog[i] >= 1 || !near(p, 62)) return; prog[i] = Math.min(1, prog[i] + dt / 7); ms.dirty = true; if (prog[i] >= 1) { done++; setObj('s' + i, null, 1); unnav('s' + i); msg(`SITE ${nm[i]} SCANNED`, 2.5); } }); return true; });
    say(ms.hnd, 'Three sites, mercenary. Park within sixty meters of each and let the sensor mast do its work. I am paying for pictures, not a body count.');
    if (c.plot === 'column') {
      await until(() => done >= 2); say(ms.ops, `That is no supply dump. It is a marshalling yard — armor forming up to roll on the ${FAC[c.emp].short} line.`);
      const r = await ask(ms.hnd, 'Change of plan, and it is optional. Their fuel haulers are about to move. Burn them before they leave and I add forty percent.', ['Accept the strike', 'Decline. Recon only'], 18, 1);
      if (r === 0) {
        const from = ms.B, to = gpos(-from.x * .95, -from.z * .95), H = [0, 1, 2].map(i => { const t = mkTruck(from.x + 14 + i * 10, from.z + 14, 1, [to]); t.name = 'FUEL HAULER'; t.blast = 18; t.speed = 7.5; return t; }); hot1(foes(.6, from.x, from.z, 15, 50));
        look(H[1], 'FUEL HAULERS'); say(ms.ops, 'Fuel haulers are rolling, with an escort. Marked.'); const burned = () => H.filter(t => t.dead && !t.esc).length; setObj('h', () => `Destroy the fuel haulers — ${burned()}/3 burned`, 0, true); H.forEach((t, i) => nav('h' + i, t, 'HAULER', '#ff5a1f'));
        (async () => { await until(() => H.every(t => t.dead || t.arrived)); H.forEach((t, i) => { unnav('h' + i); if (!t.dead) t.esc = t.gone = true; }); if (burned() >= 2) { setObj('h', null, 1); bonus('Fuel convoy burned', c.pay * .4); rep(c.emp, 3); note('You burned the armored column\'s fuel.'); } else { setObj('h', null, 2); say(ms.hnd, 'They got away. No bonus.'); } })();
      } else note('You declined the strike on the fuel convoy.');
    }
    if (c.plot === 'beacon') {
      await until(() => done >= 1); const tf = third(c), lt = mkChar(c.seed + 51, 'DOWNED PILOT', FAC[tf].col, 'Lt.');
      const r = await ask(lt, `...any callsign, any callsign. ${lt.name}, ${FAC[tf].name}. Reactor is dead and they are closing on my position. Please.`, ['Divert to the beacon', 'Stay on mission'], 18, 1);
      if (r === 0) {
        const [x, z] = ringPt(P.pos, 190), dm = mkMech(x, z, { ...PRESETS[0], paint: FAC[tf].paint }, 0, { ai: 'hold', name: lt.name.toUpperCase(), hpK: .9 }); dm.pacify = true; dm.hp = dm.max * .55; dm.mech.pitch = -.3; fieldWho(lt, dm);
        setObj('b', `Reach ${lt.last}'s beacon`, 0, true); nav('b', dm, 'BEACON', '#c9a0ff'); foes(.4, x, z, 90, 130).forEach(e => { e.focus = dm; e.alert = true; });
        await until(() => near(dm.pos, 70) || dm.dead);
        if (!dm.dead) { const t0 = ms.t + 45; setObj('b', () => `Protect ${lt.last} until medevac — ${secs(t0)}`); (async () => { await after(12); hot1(foes(.5, ...ringPt(dm.pos, 140), 0, 30)).forEach(e => e.focus = dm); })(); await until(() => ms.t >= t0 || dm.dead); }
        if (dm.dead) { setObj('b', null, 2); unnav('b'); say(ms.ops, 'The beacon just went silent. Nothing more to do there.'); note(`${lt.name} did not survive.`); }
        else { dropship(dm.pos.x + 16, dm.pos.z, null, undefined, 0); await after(7); unnav('b'); setObj('b', null, 1); dm.gone = dm.arrived = true; say(lt, 'Medevac has me. I owe you one, mercenary — and my people pay their debts.'); bonus('Rescue bounty', 28000); rep(tf, 10); note(`You pulled ${lt.name} of ${FAC[tf].name} out alive.`); CO.news.unshift(`${FAC[tf].short} thanks an unnamed mercenary for the rescue of ${lt.name}.`); }
      } else note('You ignored a distress beacon.');
    }
    if (c.plot === 'hunted') {
      await until(() => done >= 2); ms.jam = true; say(ms.ops, 'Your scanner just lit up every receiver in the sector. They are triangulating — hunter-killers inbound. Forget the last site if you have to. Just get out.');
      for (const o of ms.obj) if (o.st === 0) o.opt = true; note('Hunter-killers triangulated your scanner.');
      const hk = () => { const [x, z] = groundSpot(P.pos.x, P.pos.z, 120, 160); dropship(x, z, () => hot1(spawn({ mech: 1 + (c.diff >> 1) }, x, z, 4, 30, 1, fopt({ cfg: { ...PRESETS[0], paint: ms.foePaint }, skill: 1.5, name: 'HUNTER-KILLER' })))); };
      hk(); (async () => { await after(28); hk(); })(); (async () => { await until(() => done >= 3); bonus('Full coverage under fire', c.pay * .25); })();
      say(ms.ops, 'Primary LZ is compromised. New pickup is marked.'); return extract('You slipped the hunter-killers with the scan data.', gpos(...ringPt(P.pos, 260)), 'NEW LZ');
    }
    await until(() => done >= 3); if (c.plot === 'quiet' && P.kills <= 2) { bonus('Ghost — minimal contact', c.pay * .2); note('You were in and out almost unseen.'); }
    return extract('All three sites scanned.');
  },

  async recovery(ms) {
    const c = ms.c, A = ms.A, E = FAC[c.emp].short, item = c.item, pod = grp(FD.scene, A.x + 17, A.y + 1.3, A.z + 9, .1, .4, 0); mkStruct('wreck', A.x, A.z, 2, { ry: rand(TAU) });
    box(pod, M.steel, 2.4, 2.4, 4); noShadow(box(pod, M.cyan, 2.5, .4, 4.1)); FD.misc.push(pod); foes(.6, A.x, A.z, 25, 70, { ai: 'guard' }); let pk = 0;
    setObj('m', () => `Secure the ${item} at the crash site${pk > 0 && pk < 1 ? ' — ' + (pk * 100).toFixed(0) + '%' : ''}`); nav('p', pod.position, 'PACKAGE', '#7fe7ff');
    say(ms.hnd, `A dropship went down at ${c.site} carrying a ${item}. Scavengers are already picking at it. Bring it back intact.`);
    const grab = () => new Promise(res => FD.tick.push(dt => { if (ms.over) return false; pk = near(pod.position, 17) ? pk + dt / 4 : Math.max(0, pk - dt); ms.dirty = true; if (pk < 1) return true; FD.scene.remove(pod); P.carry = true; unnav('p'); setObj('m', null, 1); msg('PACKAGE ABOARD', 3); res(); return false; }));
    if (c.plot === 'race') await rivSalvage(ms);
    if (c.plot === 'surv') {
      await until(() => near(A, 170)); const sv = mkChar(c.seed + 81, 'CRASH SURVIVOR', '#ffffff'); fieldWho(sv, A);
      say(sv, 'Is — is someone there? Six of us made it out of the hull. Two cannot walk. Please tell me you are the rescue.'); await after(5);
      const r = await ask(ms.hnd, 'The crew is not in your contract. The package is. Take it and leave.', ['Hold the site until a medevac arrives', 'Take the package and go'], 18, 1);
      if (r === 0) {
        const t0 = ms.t + 65, w = async (dl, k) => { await after(dl); hot1(foes(k, ...ringPt(A, 150), 0, 30)); }; setObj('v', () => `Hold the crash site for medevac — ${secs(t0)}`); note('You stayed to protect the survivors.'); w(4, .6); w(26, .7); w(46, .5);
        await until(() => ms.t >= t0); dropship(A.x - 22, A.z + 22, null, undefined, 0); setObj('v', null, 1); say(sv, 'They are loading the wounded now. Whoever you are — thank you.'); bonus('Crew recovery bounty', 22000); rep(c.emp, 5); await after(4); say(ms.hnd, '...Noted. Now the package, mercenary.');
      } else { say(sv, 'Wait — you are leaving? You cannot just —'); rep(c.emp, -3); note('You left the survivors behind.'); }
    }
    await grab();
    if (c.plot === 'cargo') {
      const tf = third(c), T3 = FAC[tf].short, bk = mkChar(c.seed + 71, T3 + ' BROKER', FAC[tf].col);
      say(ms.ops, `Hold on. That is no ${item}. It is a cryo-pod — and the vitals are green. Someone is alive in there.`); await after(5);
      const r = await ask(bk, `I know what you just picked up, mercenary. Whatever ${E} is paying, I pay sixty percent more. Coordinates attached.`, ['Deliver to the employer', 'Sell to the highest bidder', 'Open the pod'], 20, 0);
      const hunters = async dl => { await after(dl); hot1(spawn(force(.7), ...groundSpot(P.pos.x, P.pos.z, 130, 160), 0, 30, 1, fopt({ paint: ms.allyPaint, skill: 1.3 }))); };
      if (r === 1) { ms.payer = tf; ms.payK = 1.6; rep(c.emp, -18); rep(tf, 8); note(`You sold the pod to ${FAC[tf].name}.`); say(ms.hnd, 'You are heading the wrong way, mercenary. Do not make me send someone.'); hunters(10); return extract(`${T3} took delivery of the pod.`, ms.C, 'BUYER'); }
      if (r === 2) {
        const ps = mkChar(c.seed + 73, 'PASSENGER', '#ffffff', 'Dr.'); say(ps, '...Where — no. Listen to me. Both of them will take apart what I know and then take apart me. Get me off this rock and I will make it worth your while.');
        ms.payK = .3; rep(c.emp, -8); note(`You opened the pod. ${ps.name} asked for asylum and you gave it.`); bonus(`${ps.last}'s gratitude`, 90000); CO.kit += 2; CO.news.unshift(`A defecting researcher has vanished from ${c.site}. ${E} and ${FAC[c.foe].short} both deny involvement.`);
        dropNear(140, .7); hunters(14); return extract(`${ps.name} is aboard. Officially, the pod was empty.`);
      }
      note('You delivered the pod sealed.');
    }
    if (c.plot === 'trap') {
      P.heat = 100; P.shut = 4.5; msg('EMP — REACTOR SCRAMMED', 3.5); sfx.play('deny'); say(ms.foe, 'Bait taken. All units — the mercenary is dead in the water.'); note('The package was bait: an EMP mine and an ambush.');
      for (const a of [0, 2.1, 4.2]) hot1(foes(.45, P.pos.x + Math.sin(a) * 140, P.pos.z + Math.cos(a) * 140, 0, 30)); dropNear(110, .5); bonus('Hazard pay — it was a trap', c.pay * .15);
    } else { say(ms.ops, pick(['Package is aboard. Every scavenger on this rock just heard that. Move.', 'Good lift. Company inbound — do not stop for anything.'])); dropNear(130, .7); }
    return extract(`The ${item} is aboard the dropship.`);
  },
};

/* twists: 0-2 per contract, chosen when the contract is generated and never shown on the board */
const TWISTS = {
  async storm(ms) { const s = EV.B.storm; if (!s) return; await after(rand(35, 100)); say(ms.ops, `Weather is turning — ${s[0].toLowerCase()} rolling over your grid. Sensors will suffer.`); ms.v.storm = true; note(`A ${s[0].toLowerCase()} rolled in mid-mission.`); await weatherShift(s[1], s[2], s[3]); },
  async reinf(ms) { await after(rand(55, 130)); say(ms.ops, 'New contact — dropship on the scope, coming in low. They are reinforcing.'); dropNear(150, .6); },
  async ace(ms) {
    await after(rand(50, 120)); const h = mkChar(ms.c.seed + 91, 'BOUNTY HUNTER', '#ff9adf'), cs = NAMES.call[(ms.c.seed + 5) % NAMES.call.length], [x, z] = groundSpot(P.pos.x, P.pos.z, 130, 170);
    say(h, `Nothing personal, {CO}. There is a price on that machine and I intend to collect. They call me ${cs}.`);
    dropship(x, z, () => { const e = mkMech(x, z, { ...pick(PRESETS), paint: 1 }, 1, { name: cs.toUpperCase(), skill: 1.6, hpK: 1.5 }); e.alert = true; fieldWho(h, e); nav('bh', e, 'HUNTER', '#ff9adf'); e.onKill = () => { unnav('bh'); bonus(`Bounty on "${cs}"`, 40000); note(`You killed the bounty hunter "${cs}".`); }; });
  },
  async pirates(ms) {
    await after(rand(40, 95)); const p = mkChar(ms.c.seed + 95, 'RED MAW REAVERS', '#ff5a3a'), toll = 25000;
    const r = await ask(p, `Everything in this valley belongs to the Red Maw. That includes whatever you are carrying. ${fmt(toll)} toll, or we take it out of your hull.`, [`Pay the toll (${fmt(toll)})`, 'Tell them to try', 'Offer them work instead'], 16, 1);
    if (r === 0 && CO.cb >= toll) { bonus('Red Maw toll', -toll); say(p, 'Pleasure. Safe travels.'); return note('You paid off the Red Maw.'); }
    if (r === 2 && Math.random() < .45) { say(p, 'Ha! A cut of your take and we shoot your friends instead of you. Deal.'); ms.payK *= .85; note('You hired the Red Maw on the spot.'); return spawn({ mech: 1, tank: 2, tier: 1 }, ...groundSpot(P.pos.x, P.pos.z, 110, 150), 0, 30, 0, { paint: 1, ai: 'follow', name: 'RED MAW', lead: PE }); }
    say(p, 'Then we take it.'); note('The Red Maw tried to rob you.'); hot1(spawn({ mech: 1 + (ms.c.diff > 2 ? 1 : 0), tank: 2, drone: 2, tier: 1 }, ...groundSpot(P.pos.x, P.pos.z, 150, 190), 0, 40, 1, { paint: 1, name: 'REAVER' }));
  },
  async supply(ms) {
    await until(() => P.armor < P.max * .45 && !P.dead); say(ms.ops, 'You are bleeding armor. Field team is dropping a repair sled on your position — hold together.'); const x = P.pos.x + 12, z = P.pos.z + 8;
    dropship(x, z, () => { if (!P.dead) { P.armor = Math.min(P.max, P.armor + P.max * .4); msg('FIELD REPAIRS APPLIED', 3); sfx.play('ok'); } }, undefined, 0); note('A company repair sled reached you in the field.');
  },
  async side(ms) {
    await after(rand(30, 70)); const [x, z] = groundSpot(ms.A.x, ms.A.z, 150, 210), b = mkStruct('bunker', x, z, 1, { name: 'PAYMASTER BUNKER' }); foes(.3, x, z, 15, 40, { ai: 'guard' });
    look(b, "PAYMASTER'S BUNKER"); say(ms.hnd, `While you are out there: a ${FAC[ms.c.foe].short} paymaster's bunker just showed on our scans. Optional. Thirty percent on top if it burns.`);
    setObj('o', "Destroy the paymaster's bunker", 0, true); nav('o', b, 'OPTIONAL', '#7fe7ff'); b.onKill = () => { unnav('o'); setObj('o', null, 1); bonus("Paymaster's bunker", ms.c.pay * .3); };
  },
};

