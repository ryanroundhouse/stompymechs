/* ============ THE CAMPAIGN — FALSE DAWN. ACT III, EVERY LAMP IN THE SECTOR: THE DARK, WHAT NINE MILLION PEOPLE SAW IN IT, AND WHO TURNED UP AT THE MERIDIAN FIELD ============ */
STORY.sun.ch.push({
  /* ---------------- VI ---------------- */
  act: 3, title: 'Nine Million Witnesses', kind: 'strike', biome: 'forest', mood: 0, tod: 'ecl', seed: 93061, diff: 4, pay: 280000, salv: 30, site: 'Ashbrook Relay', op: 'PRIME TIME', emp: 'tyr', foe: 'hel', who: RIV.car.ch,
  tease: 'Twelve days of dusk at noon. The Concord\'s account of Port Sennet is the only one on the air: Red Maw guns, and an unchartered company that helped them. Dario Quintero had six cameras on the hall that night and has not been able to show a frame, because every relay in the sector is jammed or held. The Ashbrook Relay is both. He would like it for ninety seconds. He says ninety seconds is all any decent show needs.',
  wire: 'The Maestro is on the pad with a film can under each arm and the look of a man who has been saving something. He says he needs a transmitter and a villain, and that this time the villain is not you.',
  after: 'Nine million people have now seen the Concord Hall burn, from six angles, with sound. The League has called a muster at Harrow Field.',
  sites: { lz: [-580, 400, 40, 'LZ'], j1: [-240, -300, 50, 'JAMMER NORTH'], j2: [330, 330, 50, 'JAMMER SOUTH'], relay: [40, 20, 90, 'ASHBROOK RELAY'], fab: [470, -280, 70, 'PEACEKEEPER WORKS'] },
  guests: [RIV.car.ch, STC.wick],
  brf: [
    { t: 'The sector believes we helped burn Port Sennet. That is the Concord\'s broadcast, and it is the only broadcast. Mister Quintero says he can change that. I have agreed to hear him. Briefly.', show: [['site', 'lz', 'LZ', '#8dff6a'], ['card', 'THE JOB', ['Take the Ashbrook Relay', 'Hold it while the Carnival goes to air', 'Ninety seconds']]] },
    { by: RIV.car.ch, t: 'Briefly! Again with briefly. Darlings: six cameras. I have the beam. I have the hall. I have HER, on the open channel, saying thank you for the calibration. What I have not got is a transmitter she is not sitting on.', show: [['foe', 'relay', 'ASHBROOK RELAY'], ['face', RIV.car.ch, ['Six cameras at Port Sennet', 'Has never shown the footage', 'Wants ninety seconds of air']]] },
    { by: CREW.intel, t: 'Two jammers cover the relay, north and south. While either stands, nothing goes out. Each has a guard detail. Then the relay itself: once he is on the air, every peacekeeper in the district will come to take it off.', show: [['foe', 'j1', 'JAMMER'], ['foe', 'j2', 'JAMMER'], ['ring', 'relay', 380, 'THEY COME FROM HERE'], ['route', ['lz', 'j1', 'relay'], '#8dff6a']] },
    { by: CREW.intel, t: 'And east of it, a peacekeeper works: a factory that puts a new machine on the field every quarter of a minute for as long as it stands. You may want to do something about that first. You have something to do it with now.', show: [['foe', 'fab', 'PEACEKEEPER WORKS'], ['card', 'THE WORKS', ['Builds while it stands', 'Heavily plated', 'Optional. Recommended']]] },
    { by: STC.wick, t: 'Wick. I have found you a second petal: two calls on the key today. B, reticle on the ground you want, then be elsewhere. A factory does not dodge.', show: [['card', 'SKY LANCE', ['Key B · two calls this sortie', 'Lands where your reticle is', 'About three seconds after the call', 'It burns you as readily as them']]] },
    { t: 'It is dark out there and it will stay dark. Jammers, relay, ninety seconds. If nine million people are going to watch something, let it be the right thing.', show: [['clear'], ['foe', 'j1', 'JAMMER'], ['foe', 'j2', 'JAMMER'], ['foe', 'relay', 'RELAY'], ['foe', 'fab', 'WORKS']] },
  ],
  async run(ms) {
    const S = ms.S, st = STC.stroud, wick = STC.wick, xo = ms.ops, mae = RIV.car.ch, dex = STC.dex;
    const Lm = rivLance('car', P.pos.x + 24, P.pos.z + 10, 0, { ai: 'follow', yaw: P.yaw }); stKeep(Lm[0], mae, 'I am HIT, darlings! Only cosmetically. Carry on without me, and do it well, I am still filming.');
    const relay = mkStruct('comm', S.relay.x, S.relay.z, 0, { name: 'ASHBROOK RELAY', hpK: 6 }); relay.inv = true; relay.onKill = () => lose('The Ashbrook Relay came down with the film half shown. The Concord has announced that the transmission was a forgery, and nothing has contradicted it.', .1);
    const RG = sunFoes(.8, S.relay.x, S.relay.z, 30, 80, { ai: 'guard' }), J = ['j1', 'j2'].map(k => { const j = mkStruct('comm', S[k].x, S[k].z, 1, { name: 'JAMMER', hpK: 1.4 }); sunFoes(.7, S[k].x, S[k].z, 20, 60, { ai: 'guard' }); spawn({ turret: 2 }, S[k].x, S[k].z, 22, 40, 1); nav(k, j, 'JAMMER', '#ff5a3a'); j.onKill = () => unnav(k); return j; });
    const fab = mkFactory(S.fab.x, S.fab.z, 1, { every: 16, cap: 4, tier: 1, name: 'PEACEKEEPER WORKS' }); nav('fab', fab, 'WORKS', '#ff5a3a'); fab.onKill = () => { unnav('fab'); setObj('f', 'The peacekeeper works is burning', 1); stPay('Peacekeeper works destroyed', 40000); };
    P.lance = 2; sunHud(); setObj('j', () => `Silence the jammers — ${alive(J)} standing`); setObj('f', 'Burn the peacekeeper works — B calls the sky lance', 0, true);
    await after(3); await tell(mae, 'Dark at noon, darling. She has done my lighting for me. I shall be at your shoulder with the film; do try not to get any of it on fire.');
    await until(() => !alive(J)); setObj('j', null, 1); nav('r', relay, 'ASHBROOK RELAY', '#ff6ec7'); setObj('r', () => `Take the relay — ${alive(RG)} guards`);
    await until(() => near(S.relay, 100) && alive(RG) <= 1);
    const r = await ask(mae, 'Now, darling, before I go to air. The film shows your beacon on both batteries. Twice. In close-up; you photograph well. I can cut it. Nobody need ever know who held the lamp.', ['Cut nothing. Show them all of it.', 'Cut it.'], 30, 0); stSet('show', r + 1);
    relay.inv = false; let air = 0; stTick(dt => { if (ms.over || air >= 90) return false; air += dt; return true; });
    setObj('r', () => `Hold the relay — on air ${stBar(air / 90 * 100)} · ${(air / 10).toFixed(1)} million watching`);
    chatter(dex, 'This is Dex Halloway, on every band I can reach. What you are about to see was filmed at Port Sennet on the night of the signing. I have called four hundred shows. I am not calling this one. Watch.');
    const wave = k => { const W = sunFrom(k, S.relay, rand(TAU), 390, { focus: relay }); look(W[0], 'PEACEKEEPERS — FOR THE RELAY', true); sfx.play('alarm'); return W; };
    wave(1); await until(() => air > 32); wave(1.1); chatter(mae, 'Three million and climbing! They are ringing their neighbours. Hold, darling, hold, this is the good reel!');
    await until(() => air > 62); wave(1.2); await tell(st, 'You are showing them a fire, Mister Quintero. I can show them a winter. We shall see which they remember in a month.');
    await until(() => air >= 90); relay.inv = true; msg('NINE MILLION WATCHING', 5); stShow(S.relay, 9, 90);
    await tell(mae, r === 0 ? 'All of it, uncut, your beacon and all. They saw you aim it, darling, and then they saw your face when you understood. No actor alive can do that face. They believe you.' : 'Cut, scored and out. A villain, a hall, a light. Clean. ...It is the better story, darling. I only wish it were the true one.');
    await tell(xo, 'Commander. The League is calling a muster at Harrow Field. Kessel is on the wire. So is every yard that still has a machine in it. I think you have started something.');
    win('The Carnival held the Ashbrook Relay for ninety seconds, and nine million people watched the Concord Hall burn from six angles.');
  },
  epi: (ok, f) => ok ? [
    [STC.dex, 'Dex Halloway. I did not say a word for ninety seconds, on air, for the first time in my life. It is the best work I have ever done.'],
    [CREW.xo, 'The muster is real. League militia, town machines, some of them tractors with guns on. Four thousand people at Harrow Field in a week. They have asked who commands. I told them nobody did yet.'],
    [STC.wick, 'There is a way to end it without a battle. The Array is steered from the Meridian Anchor, on Kaldur\'s second moon. Three reactors, one console. It is my console. Take me there and I can take her handle off.'],
    f['sun.show'] === 1 ? [CREW.intel, 'You let him show our part in it. I have had forty messages since. None of them is angry. Most of them say: then they know how it is aimed.'] : [CREW.intel, 'He cut our part out and it played very well. I have kept the uncut reel in the safe. I would rather it existed.'],
  ] : [[RIV.car.ch, 'We lost the feed, darling, and she is calling it a forgery. I have the film still. I always have the film. Again, from the top.']],
  prize(D, add, f) { rivRel('car', 12, 'held the Ashbrook Relay while the Carnival went to air'); for (const e of EMPS) repAdd(e, f['sun.show'] === 1 ? 4 : 2, f['sun.show'] === 1 ? 'showed the sector Port Sennet, its own part included' : 'showed the sector Port Sennet'); },
}, {
  /* ---------------- VII ---------------- */
  act: 3, title: 'The Anchor', kind: 'assault', biome: 'lunar', mood: 0, tod: 'ecl', seed: 93077, diff: 5, pay: 340000, salv: 35, site: 'Meridian Anchor, Kaldur II', op: 'LONG REACH', emp: 'tyr', foe: 'hel', who: STC.wick,
  tease: 'The Daybreak Array is steered from the Meridian Anchor, on the second moon: one console, fed by three reactors, under the guns of PAX. Wick wrote the lock on that console nine years ago. Put the reactors out and walk him to it, he says, and he can take the handle off the mirror for good, and nobody need fight anybody at Harrow Field. PAX is a Leviathan. Last time, we ran from her.',
  wire: 'Wick has packed a toolbag and is sitting on it by the dropship. He says the Anchor is nine hours away and he has been ready for nine years.',
  after: 'The Daybreak Array opened over the League muster at Harrow Field for nine seconds. There is no report from Harrow Field. There is nothing on that bearing.',
  sites: { lz: [-600, 420, 40, 'LZ'], r1: [-230, 80, 54, 'REACTOR A'], r2: [200, 310, 54, 'REACTOR B'], r3: [370, -230, 54, 'REACTOR C'], anchor: [20, -470, 100, 'THE ANCHOR'] },
  guests: [STC.wick],
  brf: [
    { t: 'Kaldur\'s second moon. No air, no weather, and the Concord\'s flagship in the sky over it. Mister Abara believes he can end this from one room. I have decided to let him try, because the alternative is four thousand militia against that mirror.', show: [['site', 'lz', 'LZ', '#8dff6a'], ['foe', 'anchor', 'THE ANCHOR'], ['card', 'THE JOB', ['Put out the Anchor\'s three reactors', 'Bring down PAX', 'Walk Wick to the console']]] },
    { by: STC.wick, t: 'The Anchor is where she is steered from. Three reactors feed it. They also feed a screen over PAX: while one reactor runs, nothing you fire at that ship arrives. So: reactors. Then the ship. Then me, and a console that still knows my hands.', show: [['foe', 'r1', 'REACTOR A'], ['foe', 'r2', 'REACTOR B'], ['foe', 'r3', 'REACTOR C'], ['route', ['lz', 'r1', 'r2', 'r3', 'anchor'], '#8dff6a']] },
    { by: CREW.intel, t: 'Marshal Thale. Forty years a peacekeeper, nine systems, no blot. He believes in order the way Thorne believes in the Vigil. He will not run and he will not gloat. PAX will be over you from the first reactor onwards, and until the third one is out she cannot be hurt.', show: [['face', STC.thale, ['Forty years a peacekeeper', 'Has four hundred aboard', 'Will not run', 'Might, at the last, be reasoned with']], ['ring', 'anchor', 300, 'PAX ON STATION']] },
    { get by() { return stFlag('sun.cob') ? RIV.cob.ch : CREW.chief; }, get t() { return stFlag('sun.cob') ? 'Ferreira. Cobalt will drop behind you when the flagship shows herself. I swore an oath to that ship\'s Commissioner. I should like to take it back where the Marshal can watch me do it.' : "Two calls on the key again, boss, and I've sorted you a third for when that screen comes down. Don't waste 'em on tanks."; }, show: [['card', 'SKY LANCE', ['Two calls, and a third when the screen falls', 'A ship over the spot burns like anything else', 'Lead her. She is slow, but she moves']]] },
    { t: 'Reactors, ship, console. In that order, because no other order works. And Commander: this is the one where we do not run from her.', show: [['clear'], ['foe', 'r1', 'A'], ['foe', 'r2', 'B'], ['foe', 'r3', 'C'], ['foe', 'anchor', 'ANCHOR · PAX']] },
  ],
  async run(ms) {
    const S = ms.S, st = STC.stroud, wick = STC.wick, thale = STC.thale, xo = ms.ops, fer = RIV.cob.ch, v = ms.v;
    const R = ['r1', 'r2', 'r3'].map(k => { const g = mkStruct('gen', S[k].x, S[k].z, 1, { name: 'ANCHOR REACTOR', hpK: 2.4 }); sunFoes(.7, S[k].x, S[k].z, 20, 70, { ai: 'guard' }); spawn({ turret: 2 }, S[k].x, S[k].z, 22, 40, 1); nav(k, g, 'REACTOR', '#ff5a3a'); g.onKill = () => { unnav(k); msg(`REACTOR DOWN — ${alive(R)} RUNNING`, 3.5); }; return g; });
    mkStruct('hq', S.anchor.x, S.anchor.z, 2, { name: 'MERIDIAN ANCHOR' }); stBeam(S.anchor, 0xffe2a0, 500, 2.6); sunPilots(1); P.lance = 2; sunHud();
    setObj('r', () => `Put out the Anchor's reactors — ${alive(R)} running`);
    await after(3); await tell(wick, 'Wick, in the dropship, with the toolbag. I can see the Anchor from here. I poured that foundation. Reactors, Commander, and then come and fetch me.');
    await until(() => alive(R) < 3);
    const [sx, sz] = stOff(S.anchor, stAng(S.anchor, P.pos), 260), PAX = mkCapital('lev', sx, sz, 1, { name: 'PAX', alert: true, hpK: 1.1, dK: .6, focus: PE }), screen = on => { for (const e of [PAX, ...PAX.subs]) if (!e.dead) e.inv = on; }; screen(true); look(PAX, 'PAX — UNDER THE SCREEN'); sfx.play('alarm');
    await tell(thale, 'PAX, on station over the Anchor. Mercenary: while those reactors run, this ship is under the Anchor\'s screen and you may as well shoot at the moon. In your place I would turn round.');
    setObj('p', () => PAX.dead ? 'PAX is down' : PAX.inv ? 'PAX is under the screen — the reactors first' : `Bring down PAX — hull ${Math.max(0, Math.round(PAX.hp / PAX.max * 100))}%`); nav('pax', PAX, 'PAX', '#ff5a3a');
    if (stFlag('sun.cob')) rivDrop('cob', ...groundSpot(P.pos.x, P.pos.z, 60, 90), 0, { ai: 'follow', n: stFlag('sun.cob') === 1 ? undefined : 0 }).then(L => { if (!ms.over) { stKeep(L[0], fer, 'Cobalt is out of the line. Finish it for us.'); say(fer, 'Cobalt Lance, on your left. Marshal: I swore to your Commissioner. I am here to take it back, and I wanted you to see me do it.'); } });
    await until(() => !alive(R)); screen(false); setObj('r', null, 1); msg("THE ANCHOR'S SCREEN IS DOWN", 4); sfx.play('ok'); P.lance += 1; sunHud();
    await tell(thale, 'Screen is down. Very well. I have kept the peace in nine systems, Commander, and it was always dark somewhere. All batteries.');
    await until(() => PAX.dead || PAX.hp < PAX.max * .14);
    if (!PAX.dead) {
      screen(true); for (const e of PAX.subs) e.pacify = true; PAX.pacify = true;
      const r = await ask(thale, 'PAX is finished. I have four hundred aboard and boats for all of them, if nobody shoots at boats. Your decision, Commander. I will not ask twice.', ['Abandon ship, Marshal. We hold fire.', 'Finish her.'], 28, 0); stSet('thale', r + 1); screen(false);
      if (r === 0) { await tell(thale, 'Boats away. ...You fight like the people I used to work for. I had wondered where they went.'); await after(2); killEnt(PAX, 2); } else { killEnt(PAX, 0); chatter(xo, 'She is going down with all hands. ...Logged, Commander.'); }
    } else stSet('thale', 2);
    setObj('p', 'PAX is down', 1); unnav('pax'); await after(4);
    /* the handle */
    setObj('a', 'Walk Wick to the Anchor'); nav('a', S.anchor, 'THE ANCHOR', '#ffd27a'); await until(() => near(S.anchor, 120)); setObj('a', null, 1); unnav('a');
    await tell(wick, 'I am at the console. It is my lock; I wrote it nine years ago and it still knows my hands. One minute. ...Commander. Do you know why she turned the mirror edge-on, and not on a city?');
    await tell(wick, 'Because she could not. One key turns her edge-on. It takes two to open her and aim. Stroud has worn one key since before Port Sennet, and the other was in a vault. She has been holding the sector to ransom with a mirror she cannot point.');
    await tell(st, 'Thank you, Mister Abara. I did wonder whether you would tell them before or after.');
    await tell(wick, "After. I am sorry, Commander. You would have burned her; I heard you all say so, over Dutch's tea. She is the only thing I have ever made, and the Commissioner is the only one who will ever let her open. I cut a copy of your key on the second day. It is in the console now.");
    msg('THE DAYBREAK ARRAY IS OPENING', 6); sfx.play('door'); await todShift('day', 7); P.shake += .4;
    await tell(xo, 'Commander. The Array is open and it is aimed. The muster at Harrow Field: four thousand militia and every machine the towns could send. It has been on them for nine seconds. ...It has stopped. There is nothing on that bearing. There is nothing on that bearing at all.');
    await tell(st, 'I did say I could show them a winter; that was the alternative. Mister Abara will open the Array over Kessel in the morning, as he has always wanted. I shall steer it myself, from the Meridian Field, in case anybody else should feel like a muster. Do come, Commander. Bring whoever is left.');
    win('PAX is down and the Anchor is dark. Wick put a copy of the company\'s key into the console and gave Stroud the sky, and the first thing she did with it was Harrow Field.');
  },
  epi: (ok, f) => ok ? [
    [CREW.chief, "He had my bench for a week, boss. I showed him where the good files were. ...I liked him. I still do, God help me. He thinks he's saved her."],
    [CREW.xo, 'Harrow Field is gone. The League has perhaps three hundred people who were late to the muster. She has both keys, so she can aim. You still have yours, so you can still open a petal. That is the whole of our position.'],
    [CREW.intel, 'She steers by hand now, from her own command frame, through three ground stations at the Meridian Field. She has to be on the surface to do it. That is the first mistake she has made, and I think she knows it is one and has decided she can afford it.'],
    f['sun.thale'] === 1 ? [STC.thale, 'Thale, from a lifeboat. I am told what was done at Harrow Field with the ship I kept the peace from. I have four hundred peacekeepers in boats, Commander, and I have just given them an order that I expect the Commissioner will dislike.'] : null,
    [RIV.car.ch, 'Darling. I am never on time; it has now saved my life twice. The Carnival was not at Harrow Field. The Carnival will be at the Meridian Field. Somebody ought to film it.'],
  ] : [[STC.wick, 'She is still in the sky and so is PAX. I can wait. I have had practice.']],
  prize(D, add, f) { repAdd('tyr', 6, 'brought down the Concord flagship over the Meridian Anchor'); if (f['sun.thale'] === 1) add('Salvage rights, PAX (League prize court)', 60000); },
}, {
  /* ---------------- VIII ---------------- */
  act: 3, title: 'False Dawn', kind: 'assault', biome: 'desert', mood: 0, tod: 'ecl', seed: 93083, diff: 5, pay: 500000, salv: 45, site: 'the Meridian Field', op: 'DAYBREAK', emp: 'tyr', foe: 'hel', who: CREW.xo,
  tease: 'Stroud has both keys and has come down to the Meridian Field to steer the Array by hand, through three ground stations, from her own command frame: the TRIBUNAL. At sunrise she opens it over Kessel, and after that there is nobody left to ask her to stop. The League muster is ash. What is coming to the Field instead is whoever was late, whoever was owed, and whoever was bought and stayed bought. No fee was negotiated for this one. Varga checked. Nobody asked.',
  wire: 'Every machine in the sector that can still walk has been asked the same question tonight, and the yard is where they are sending their answers.',
  sites: { lz: [-600, 480, 40, 'LZ'], g1: [-290, 60, 56, 'GROUND STATION WEST'], g2: [220, 280, 56, 'GROUND STATION SOUTH'], g3: [60, -400, 56, 'GROUND STATION NORTH'], arb: [520, -200, 90, 'THE TRIBUNAL'] },
  guests: () => [RIV.car.ch, ...(stFlag('sun.cob') ? [RIV.cob.ch] : []), ...(stFlag('sun.ver') === 1 ? [RIV.ver.ch] : [])],
  brf: [
    { t: 'This is the last briefing I shall give on this matter, one way or the other. The Meridian Field. She is there, on the ground, with both keys. At sunrise she opens the Array over Kessel. We are going to be in the way.', show: [['site', 'lz', 'LZ', '#8dff6a'], ['foe', 'arb', 'THE TRIBUNAL'], ['card', 'THE JOB', ['Break her three ground stations', 'Break the TRIBUNAL', 'Before sunrise']]] },
    { by: CREW.intel, t: 'She steers through three ground stations. Each one we break is a third of the sky she cannot aim at, and she will be aiming at us the whole time: the light will follow you across that field from the moment you land. It is slower than you are. Do not stop.', show: [['foe', 'g1', 'STATION WEST'], ['foe', 'g2', 'STATION SOUTH'], ['foe', 'g3', 'STATION NORTH'], ['route', ['lz', 'g1', 'g2', 'g3', 'arb'], '#8dff6a'], ['card', 'THE LIGHT', ['It follows you. Keep moving', 'Each station down slows it', 'It burns her machines as well as ours', 'Lead it through them']]] },
    { by: CREW.intel, t: 'The TRIBUNAL stands under the Array\'s downlink, and nothing we carry goes through that. Your key will. It is the same light. Call the lance on her, and the downlink breaks.', show: [['ring', 'arb', 120, 'DOWNLINK'], ['face', STC.stroud, ['Both keys', 'Steering by hand', 'Has never lost a ruling', 'On the ground, for once']]] },
    { get by() { return stFlag('sun.cob') ? RIV.cob.ch : RIV.car.ch; }, get t() { return stFlag('sun.cob') === 1 ? 'Ferreira. The whole Lance, on your right, under your orders. Thirty-one years and I never once chose a side. I find it suits me.' : stFlag('sun.cob') ? 'Ferreira. I have one machine that will still walk, and it is mine. That is what Cobalt can bring. It will be on your right.' : 'Six cameras, darling, and every machine the Carnival owns with live ammunition in it. I checked it myself. I am told that is the done thing.'; }, get show() { return [['ally', 'lz', stFlag('sun.cob') ? 'COBALT · CARNIVAL' : 'THE CARNIVAL']]; } },
    { get by() { return stFlag('sun.ver') === 1 ? RIV.ver.ch : stFlag('sun.vigil') === 1 ? STC.abb : CREW.chief; }, get t() { return stFlag('sun.ver') === 1 ? 'Halloran. I have been offered a great deal of money not to be here. I have kept the letters. Verdigris will be on your left, love, and afterwards we will discuss salvage.' : stFlag('sun.vigil') === 1 ? 'Thorne. You lit a lamp, mercenary. The Vigil keeps its own hours, and it has kept this one.' : "Rook and Anvil are flying, boss, and they've told me what they'll do to me if I mention money. Bring 'em home. I've only got the three bays."; }, get show() { const L = [['Rook and Anvil, on the house'], ['The Carnival']]; if (stFlag('sun.cob')) L.push([stFlag('sun.cob') === 1 ? 'Cobalt Lance' : 'Colonel Ferreira, alone']); if (stFlag('sun.ver') === 1) L.push(['Verdigris Salvage']); if (stFlag('sun.vigil') === 1) L.push(['The Vigil of Ordo Ferrum']); if (stFlag('sun.thale') === 1) L.push(['(Thale has stood his peacekeepers down)']); return [['card', 'WHO IS COMING', L.map(l => l[0])]]; } },
    { t: 'Nobody negotiated a fee. I checked. Nobody asked. Stations, then the frame, then we find out what a morning looks like when nobody has arranged it. Dismissed. ...Good luck, Commander.', show: [['clear'], ['foe', 'g1', 'WEST'], ['foe', 'g2', 'SOUTH'], ['foe', 'g3', 'NORTH'], ['foe', 'arb', 'TRIBUNAL'], ['ally', 'lz', 'EVERYBODY']] },
  ],
  async run(ms) {
    const S = ms.S, st = STC.stroud, wick = STC.wick, thale = STC.thale, xo = ms.ops, mira = CREW.intel, dutch = CREW.chief, v = ms.v, fer = RIV.cob.ch, hal = RIV.ver.ch, mae = RIV.car.ch, fc = stFlag('sun.cob'), fv = stFlag('sun.ver') === 1, fo = stFlag('sun.vigil') === 1, ft = stFlag('sun.thale') === 1, top = player.stats.speed * RUN;
    /* who came */
    sunPilots(2); const Lm = rivLance('car', P.pos.x + 30, P.pos.z + 16, 0, { ai: 'hunt', yaw: P.yaw }); stKeep(Lm[0], mae, 'Down! But filming! Carry on, darlings, this is the reel!');
    if (fc) { const L = rivLance('cob', P.pos.x - 34, P.pos.z + 20, 0, { ai: 'hunt', yaw: P.yaw, n: fc === 1 ? undefined : 0 }); stKeep(L[0], fer, 'Cobalt is out of the line. It was an honour. Finish it.'); }
    if (fv) { const L = rivLance('ver', P.pos.x + 10, P.pos.z + 40, 0, { ai: 'hunt', yaw: P.yaw }); stKeep(L[0], hal, 'That is my machine in bits, love. I will be billing somebody.'); }
    if (fo) for (const e of spawn({ mech: 2, tier: 2 }, P.pos.x - 10, P.pos.z + 44, 0, 20, 0, { paint: FAC.ord.paint, name: 'VIGILANT', ai: 'hunt', skill: 1.2, hpK: 1.4 })) e.alert = true;
    /* what she has */
    const G = ['g1', 'g2', 'g3'].map(k => { const g = mkStruct('comm', S[k].x, S[k].z, 1, { name: 'GROUND STATION', hpK: 3 }); sunFoes(ft ? .6 : .8, S[k].x, S[k].z, 20, 70, { ai: 'guard' }); spawn({ turret: 2 }, S[k].x, S[k].z, 22, 40, 1); stBeam(S[k], 0xffe2a0, 240, 1.5); nav(k, g, 'GROUND STATION', '#ffd27a'); return g; });
    const A = stBig(mkMech(S.arb.x, S.arb.z, { name: 'TRIBUNAL', legs: 'hvy', torso: 'jug', head: 'skl', armL: 'gau', armR: 'pls', back: 'plt', paint: SUN_PAINT }, 1, { ai: 'hold', name: 'TRIBUNAL', hpK: 5.5, skill: 1.5, yaw: stAng(S.arb, S.lz) }), 1.7); A.inv = true; A.pacify = true; A.named = true; fieldWho(st, A); const link = stBeam(A.pos, 0xffe2a0, 600, 5);
    stTick(() => { if (ms.over || v.link || A.dead) return false; link.position.x = A.pos.x; link.position.z = A.pos.z; return true; });
    P.lance = 2; sunHud(); setObj('g', () => `Break the ground stations — ${alive(G)} standing`); setObj('l', () => `The light is on you — keep moving${v.B && v.B.hold > 0 ? ' · RE-AIMING' : ''}`);
    await after(3); await tell(st, 'Commander. And guests. I count rather fewer of you than the League mustered. You have until sunrise to be a nuisance. Mister Abara, the western third, please. Follow the one in front.');
    v.B = sunSweep(gpos(...stOff(P.pos, P.yaw, 190)), () => P.pos, { v: Math.min(8.6, top * .56), r: 22, dps: 75 }); msg('THE ARRAY IS TRACKING YOU — KEEP MOVING', 5); sfx.play('alarm');
    chatter(PILOTS[0].ch, "It's following the boss. Everybody else: it's following the BOSS. Stay off their heels!");
    G.forEach((g, i) => { g.onKill = () => { const n = alive(G); msg(n ? `GROUND STATION DOWN — ${n} STANDING` : 'SHE IS BLIND', 4); v.B.v *= .8; v.B.hold = 7; P.lance++; sunHud(); for (const k of ['g1', 'g2', 'g3']) if (G[+k[1] - 1].dead) unnav(k); if (n === 2) chatter(st, 'A third of the sky. I have two thirds left and you are standing in them.'); if (n === 1) chatter(mira, 'She is steering on one station. The light is slow now. One more and she is blind.'); }; });
    let dropT = 22, drops = 0; stTick(dt => { if (ms.over || A.dead || drops >= (ft ? 2 : 5)) return false; if ((dropT -= dt) > 0) return true; dropT = 30; drops++; const [x, z] = groundSpot(...stOff(P.pos, rand(TAU), 200), 0, 30); dropship(x, z, () => hot1(spawn({ mech: 2, tank: 1, drone: 2, tier: 2 }, x, z, 0, 30, 1, { paint: SUN_PAINT, name: 'PEACEKEEPER' })), undefined, 1); return true; });
    if (ft) (async () => { await after(26); if (!ms.over) say(thale, 'Thale, to all peacekeepers on the Meridian Field. You have seen Harrow Field. Ground your machines. That is my last order as your Marshal, and the first one I have been proud of in a year.'); })();
    await until(() => !alive(G)); setObj('g', null, 1); setObj('l', 'She is blind — the light has stopped', 1); v.B.stop();
    /* by hand, then */
    await tell(st, 'Blind. Well. I arbitrated for twenty years, Commander, and I never once had to do the thing myself. By hand, then.');
    A.pacify = false; A.ai = 'hunt'; A.alert = true; look(A, 'THE TRIBUNAL'); nav('a', A, 'TRIBUNAL', '#ffd27a'); P.lance = Math.max(P.lance, 2); sunHud();
    setObj('a', () => A.inv ? 'The TRIBUNAL is under the downlink — call the sky lance on her (B)' : `Break the TRIBUNAL — ${Math.max(0, Math.round(A.hp / A.max * 100))}%`);
    v.onLance = at => { if (A.inv && !v.link && Math.hypot(A.pos.x - at.x, A.pos.z - at.z) < 38) { v.link = 1; A.inv = false; stGone(link); msg('THE DOWNLINK IS BROKEN', 4); sfx.play('ok'); } };
    let more = 34; stTick(dt => { if (ms.over || v.link) return false; if (P.lance < 1 && (more -= dt) < 0) { more = 34; P.lance = 1; sunHud(); chatter(dutch, "Found you one more petal, boss. Make it count; I'm running out of sky."); } return true; });
    chatter(mira, 'Nothing is getting through that column over her. Your key will. Put the lance on her, Commander.');
    await until(() => v.link || A.dead); if (!v.link) { v.link = 1; stGone(link); } if (!A.dead) await tell(st, 'My own light. Yes. I suppose that was always going to be how.');
    await until(() => A.dead || A.hp < A.max * .4);
    if (!A.dead) {
      /* the false dawn */
      A.inv = true; await tell(st, 'Mister Abara. Open her. All of her. I want noon on this field.'); msg('THE DAYBREAK ARRAY IS OPENING', 6); sfx.play('door'); await todShift('day', 6); P.shake += .5;
      const B2 = sunSweep(gpos(...stOff(P.pos, rand(TAU), 120)), () => P.pos, { v: Math.min(10.5, top * .68), r: 28, dps: 120 }); A.inv = false;
      await tell(st, 'There. Four in the morning and you can read by it. Now. Mister Abara: bearing three-five-one. Kessel. An example ought to be something they love.');
      await until(() => A.dead || A.hp < A.max * .2);
      if (!A.dead) {
        A.inv = true; await tell(wick, 'Commissioner, my mother is in Kessel. ...You know that. It is in my file. You read my file. You picked it BECAUSE—');
        await tell(wick, 'It was supposed to be a lamp. Commander, I am pulling my key. Both of mine. She can have the dark back, and so can you. I am sorry. It was only ever supposed to be a lamp.');
        B2.stop(); msg('THE ARRAY IS CLOSING', 5); await todShift('ecl', 5); A.inv = false; A.skill = 1; A.vk = .7;
        if (ft) chatter(thale, 'Peacekeepers at the Anchor: let the engineer walk out. That is a request. I have no rank left to make it an order.'); else chatter(xo, "Wick's channel is still open. There is nobody on it.");
        await tell(st, 'Then I shall do without. I have a frame, a gun and a ruling to enforce. Come along, Commander.');
        await until(() => A.dead);
      } else B2.stop();
    }
    v.B.stop(); unnav('a'); setObj('a', 'The TRIBUNAL is down', 1); for (const e of FD.ents) if (e.team === 1 && !e.dead && e.kind !== 'struct') { e.pacify = true; e.ai = 'hold'; }
    await after(3); await tell(xo, "Commander. The Commissioner's key is in that wreck, and Wick's console is still open to yours. Both keys. Nobody in this sector has a better claim to say what happens to that mirror, and I include myself. It is your sky.");
    const r = await ask(xo, 'What do we do with the Daybreak Array?', ['Turn her to face the sun, and let her burn.', 'Keep the keys. The lance is ours.', 'Give both keys to Kessel. Let it be a lamp.'], 45, 0); stSet('end', r + 1);
    if (r === 0) { msg('THE DAYBREAK ARRAY IS BURNING', 6); for (let i = 0; i < 4; i++) { stShow(gpos(P.pos.x + rand(-200, 200), P.pos.z + rand(-200, 200)), 6, 150); } await tell(dutch, "There she goes. Eleven kilometres of mirror coming down as shooting stars. Prettiest thing I ever saw anybody break, boss."); }
    else if (r === 1) await tell(mira, 'Then we are the people with the lance. I will draw up a list of who needs to be told, and a shorter list of who will believe we mean well.');
    else await tell(xo, 'Kessel has the keys. A town of three thousand people who know exactly what seventy days of dark is. I cannot think of safer hands. They have asked what they owe us. I have said: a retainer, and a morning.');
    /* and then the real one */
    msg('SUNRISE', 6); await todShift('dawn', 14); chatter(PILOTS[0].ch, "Boss. That's the actual sun. Nobody did that. It just... came up."); await after(4); await todShift('day', 12);
    await tell(dutch, "Right. Everybody home. I've got three bays and about nine machines wanting them, and the cook's doing eggs.");
    win(r === 0 ? 'The TRIBUNAL is a wreck on the Meridian Field, the Daybreak Array burned up over the sector as a meteor shower, and the sun came up on its own.' : r === 1 ? 'The TRIBUNAL is a wreck on the Meridian Field, the sun came up on its own, and the keys to the Daybreak Array are in the yard safe.' : 'The TRIBUNAL is a wreck on the Meridian Field, the sun came up on its own, and the Daybreak Array belongs to Kessel Station, which is using it as a lamp.');
  },
  epi: (ok, f) => ok ? [
    f['sun.thale'] === 1 ? [STC.wick, "It's Wick. The Marshal's people opened the door and looked the other way. I have walked a long way again. I am not asking for the bench back. I wanted you to know I pulled it. In the end, I pulled it."] : [CREW.chief, "They found Wick at the console, boss, with both his keys in his hand and the lock burned out so nobody could put 'em back. I've left his mug on the bench. It can stay there."],
    f['sun.end'] === 1 ? [CREW.intel, 'Every power in the sector has sent thanks, and every one of them has asked, very carefully, whether we are sure it all burned. I have told them the truth. They would have preferred something they could be afraid of.'] : f['sun.end'] === 2 ? [CREW.intel, 'Every power in the sector has sent congratulations, and none of them will meet my eye. We are the company with the lance. Fees will hold. Friendships will not. B is still in your cockpit, once a sortie.'] : [CREW.intel, 'Kessel had a morning today, a real one and then a second one on top of it. The Lamplighters\' Trust has voted us a retainer on every contract we fly, for as long as there is a yard. Wick\'s mother signed it.'],
    f['sun.cob'] ? [RIV.cob.ch, 'Ferreira. The regiment has voted, which it has never done before, to keep the colours it flew at the Meridian Field. We are a company now and not an instrument. I have you to thank for that, and I am still deciding whether I do.'] : null,
    [RIV.car.ch, 'I have it ALL, darling. The light, the frame, the sunrise. Eleven cameras by the end; I borrowed some. It opens in every hall in the sector next month. You are played by yourself. Nobody else would do.'],
    [CREW.chief, "Something came on the last sled, boss. The League prize court says the TRIBUNAL's guns are yours by right of being shot at with 'em. I've put them in stores."],
  ] : [[CREW.xo, 'The sun has not come up and neither has ours. Everybody who was at that field is asking when we go again. Tell me the hour, Commander.']],
  prize(D, add, f) {
    stGift(D, 'arm.gau', 1); stGift(D, 'arm.pls', 1); stGift(D, 'back.plt', 1); add('League prize court, the TRIBUNAL', 120000); const e = f['sun.end'];
    for (const k of EMPS) repAdd(k, e === 1 ? 8 : e === 2 ? -6 : 6, e === 1 ? 'burned the Daybreak Array' : e === 2 ? 'kept the keys to the Daybreak Array' : 'gave the Daybreak Array to Kessel'); if (e === 3) { repAdd('tyr', 8, 'gave Kessel its lamp'); add("Lamplighters' Trust, first retainer", 60000); }
    rivRel('car', 10, 'the Meridian Field'); if (f['sun.cob']) rivRel('cob', 12, 'the Meridian Field'); if (f['sun.ver'] === 1) rivRel('ver', 10, 'the Meridian Field');
  },
});
