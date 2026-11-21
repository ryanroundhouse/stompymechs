/* ============ THE CAMPAIGN — FALSE DAWN. ACT II, UNCHARTERED: THE CONCORD COMES TO THE YARD, AND THE YARD GOES AND TAKES SOMETHING OF THE CONCORD'S ============ */
STORY.sun.ch.push({
  /* ---------------- IV ---------------- */
  act: 2, title: 'House Call', kind: 'garrison', biome: 'desert', mood: 0, tod: 'night', seed: 41, diff: 3, pay: 45000, salv: 40, site: 'the Yard', op: 'HOUSE CALL', home: true, lay: true, emp: 'tyr', foe: 'hel', who: CREW.xo,
  tease: 'The Concord has a warrant for the yard and everybody in it, and it has given the warrant to Cobalt Lance, because Colonel Ferreira serves what she is handed. That is the polite half. The other half is already on our hills: three designator teams with beacons like the one we carried at Port Sennet. When the Array comes over the yard tonight it will have three marks to steer by. Nobody is paying for this one. There is what was in the safe.',
  wire: 'Mira has a message from inside the Concord ground station, unsigned, eleven words: "Three marks on your hills. Overhead at 0304. I am sorry."',
  after: 'The Concord served a warrant on an unchartered yard last night and did not come away with it. Cobalt Lance is said to have had something to do with that.',
  sites: { lz: [0, 30, 40, 'THE YARD'], gate: [0, 290, 50, 'THE ROAD'], q: [-70, -40, 30, 'CREW QUARTERS'], d1: [-170, -150, 44, 'DESIGNATOR'], d2: [175, -70, 30, 'DESIGNATOR'], d3: [230, 170, 34, 'DESIGNATOR'] },
  brf: [
    { t: 'There is no client. This briefing is about our own front door. Cobalt Lance is on the road with a Concord warrant for the yard, and will be at the gate inside the hour.', show: [['site', 'lz', 'THE YARD', '#8dff6a'], ['unk', 'gate', 'COBALT LANCE'], ['card', 'THE JOB', ['Keep the yard', 'Keep the crew quarters standing', 'Nobody is paying. There is the safe']]] },
    { by: CREW.intel, t: 'That is the half she wants us to look at. Somebody inside the ground station got eleven words out to me. There are three designator teams on our hills already, and the Array is overhead at four minutes past three.', show: [['foe', 'd1', 'DESIGNATOR'], ['foe', 'd2', 'DESIGNATOR'], ['foe', 'd3', 'DESIGNATOR'], ['card', 'THE CLOCK', ['The Array is overhead in minutes', 'With one mark standing, it can aim', 'All three down, and it is blind']]] },
    { by: CREW.chief, t: "This is my shop, boss. Thirty years of tools on those walls and a cook who's only just learned eggs. The lads are staying. I asked. Don't let 'em put a hole in the quarters.", show: [['ally', 'q', 'CREW QUARTERS'], ['ring', 'q', 70, '']] },
    { by: PILOTS[0].ch, t: "Rook. Me and Anvil are flying this one, and before you say it, it's on the house. I live here.", show: [['card', 'ON THE HOUSE', ['Rook and Anvil fly with you', 'No fee, no share', 'They live here too']]] },
    { t: 'About Colonel Ferreira. She will give her word at the gate, and her word is good. What I cannot tell you is what she does when the Concord gives her an order she cannot stomach. Nobody can. It has never happened.', show: [['face', RIV.cob.ch, ['Serves what she is handed', 'Has never broken a contract', 'Watched the hall burn', 'Has read article nine twice']]] },
    { t: 'Designators first, whatever happens at the gate. The clock does not care how the conversation goes.', show: [['clear'], ['foe', 'd1', 'I'], ['foe', 'd2', 'II'], ['foe', 'd3', 'III'], ['ally', 'q', 'QUARTERS'], ['unk', 'gate', 'COBALT']] },
  ],
  async run(ms) {
    const S = ms.S, st = STC.stroud, thale = STC.thale, xo = ms.ops, dutch = CREW.chief, v = ms.v, fer = RIV.cob.ch;
    const Q = mkStruct('hab', S.q.x, S.q.z, 0, { name: 'CREW QUARTERS', hpK: 7 }); Q.onKill = () => lose('The crew quarters took a direct hit with the night shift inside. There is a yard. There is nobody left to run it.', .1); sunPilots(2);
    const des = ['d1', 'd2', 'd3'].map(k => { const d = mkStruct('comm', S[k].x, S[k].z, 1, { name: 'DESIGNATOR', hpK: 1.1 }); spawn({ turret: 2, mech: 1, tier: 1 }, S[k].x, S[k].z, 18, 44, 1, { paint: SUN_PAINT, name: 'PEACEKEEPER', ai: 'guard' }); stBeam(S[k], 0xffe2a0, 190, 1.3); nav(k, d, 'DESIGNATOR', '#ffd27a'); d.onKill = () => unnav(k); return d; });
    let left = 285; stTick(dt => { if (ms.over || !alive(des)) return false; left -= dt; return true; }); const clock = () => { const s = Math.max(0, Math.ceil(left)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
    setObj('d', () => alive(des) ? `Destroy the designators before the Array is overhead — ${alive(des)} left · ${clock()}` : 'The designators are down'); setObj('q', () => `Keep the crew quarters standing — ${Math.round(Q.hp / Q.max * 100)}%`);
    (async () => { await until(() => left <= 0 && alive(des) > 0); if (ms.over) return; msg('THE ARRAY IS OVERHEAD', 5); todShift('day', 3); let hit = 0; skyLance(Q.pos, { own: 1, dmg: 400, r: 70, delay: 4, hit: () => { hit = 1; } }); await until(() => hit); lose('The Array came over the yard at four minutes past three with a good mark to steer by. Where the yard was, the sand is glass.', .05); })();
    /* the polite half */
    const Lc = rivLance('cob', S.gate.x, S.gate.z, 2, { ai: 'hold', yaw: stAng(S.gate, S.lz), pacify: true }), F = Lc[0]; await after(3); look(F, 'COBALT LANCE');
    const opts = ['Colonel. You watched that hall burn. You know who aimed it, and who paid.', 'Then come and serve it.']; if (CO.riv.cob.rel >= 15) opts.push('We have stood in the same line, Colonel. Remember it.');
    const r = await ask(fer, 'Cobalt Lance, at your gate. I hold a lawful warrant for the seizure of this yard and the persons in it. Stand your machines down, Commander, and nobody inside is hurt. You have my word, which is still worth something.', opts, 30, 0);
    if (r === 1) {
      stSet('cob', 2); setTeam(Lc, 1, { pacify: false, alert: true, ai: 'hunt' }); nav('cb', F, 'COBALT', RIV.cob.col); stKeep(F); await tell(fer, 'As you wish. Lance — by the book. Machines only. Nobody fires on a building.');
      (async () => { await until(() => F.out || F.dead || ms.over); if (ms.over) return; unnav('cb'); for (const e of Lc) if (!e.dead) Object.assign(e, { inv: true, pacify: true }); leave(Lc); say(fer, 'Cobalt strikes its colours. The warrant is unserved. ...You fight like somebody defending a home, Commander. I had forgotten what that looked like.'); })();
    } else { stSet('cob', 1); await tell(fer, r === 2 ? 'I remember it. I had hoped you would not make me. ...Cobalt will stand at your gate and serve this warrant at sunrise. What happens before sunrise is not in my orders.' : 'I hold a lawful warrant and an unlawful doubt. Cobalt will stand at your gate and serve it at sunrise. What happens before sunrise is not in my orders.'); }
    /* and the other half */
    await after(6); sfx.play('alarm'); const a0 = stAng(S.lz, S.gate), W = [...sunFrom(.8, S.q, a0 + .7, 330, { focus: Q }), ...sunFrom(.6, S.q, a0 - .8, 340, { focus: Q })]; look(W[0], 'PEACEKEEPERS');
    await tell(thale, 'Marshal Thale. Colonel Ferreira is taking rather a long time over a gate. Peacekeepers — the yard. All of it.');
    await until(() => alive(des) < 3 || left < 190); W.push(...sunFrom(.9, S.q, a0 + PI + rand(-.5, .5), 340, { focus: Q })); msg('PEACEKEEPERS — FROM BEHIND THE YARD', 3);
    await until(() => alive(des) < 2 || left < 110);
    if (stGet('cob') === 1 && !F.dead) {
      await tell(thale, 'Colonel. You have guns on that hab block and a contract with the Concord. Level it.'); await tell(fer, 'That is a crew quarters. There are mechanics in it, and I believe a cook.'); await tell(thale, 'That is an order, under your oath.');
      await tell(fer, '...Then here is another first for the regiment. Cobalt Lance — colours UP. The warrant is void. So, Marshal, is the oath.'); setTeam(Lc, 0, { pacify: false, ai: 'hunt', alert: true }); look(F, 'COBALT LANCE — WITH US'); msg('COBALT LANCE HAS CHANGED SIDES', 4); sfx.play('ok');
    } else chatter(fer, 'Marshal, I hear you wanted Cobalt to fire on a crew quarters. Cobalt was beaten at that gate tonight, fairly, and is going home. Find another regiment.');
    W.push(...sunFrom(1, S.q, a0, 350, { focus: Q }));
    await until(() => !alive(des)); msg('THE DESIGNATORS ARE DOWN — THE ARRAY IS BLIND', 4); await until(() => alive(W) <= 1); for (const e of W) if (!e.dead) { e.pacify = true; } leave(W);
    /* she comes over anyway, and looks */
    await tell(xo, 'The Array is on the horizon. All machines: stand still. No lamps, no jets. She is going to look for us.'); msg('THE ARRAY IS OVERHEAD', 5); await todShift('day', 3.5); await after(2.5);
    chatter(dutch, "Nobody move. Nobody so much as light a cigarette."); await after(3); await todShift('night', 6);
    await tell(st, 'Nothing to steer by. You have a talent for standing in the dark, Commander. I wonder how the rest of the sector will take to it.');
    win(stGet('cob') === 1 ? 'The Concord came for the yard with a warrant, three marks and a regiment. The marks are scrap, the Array went over blind, and the regiment changed sides at the gate.' : 'The Concord came for the yard with a warrant, three marks and a regiment. The regiment was beaten at the gate, the marks are scrap, and the Array went over blind.');
  },
  epi: (ok, f) => ok ? [
    [CREW.chief, "Quarters are standing, boss. The cook slept through it. I'm not making that up."],
    f['sun.cob'] === 1 ? [RIV.cob.ch, 'Ferreira. In thirty-one years Cobalt has not broken a contract. I find I do not feel the way I expected to. If you mean to do something about that woman and her mirror, Commander, you will tell me the day.'] : [RIV.cob.ch, 'Ferreira. You beat my Lance at your own gate and then let it walk. I have declined the Concord\'s next three orders on grounds of damage. I am not certain how long that will hold. I am not certain I want it to.'],
    [STC.wick, "It's Wick. I sent the eleven words. I have just walked forty kilometres with a toolbag, I have no job, and I know where the second fire key is kept. Is there tea?"],
    [CREW.xo, 'A fire key. If she can aim that thing, so can whoever holds the other one. Dutch has given Mister Abara a bench. I have given him a guard, whom I have told to be friendly.'],
  ] : [[CREW.xo, 'We are flying this again, and I will not pretend to understand how. The yard is still here. Let us keep it that way.']],
  prize(D, add, f) { add('From the yard safe', 20000); rivRel('cob', f['sun.cob'] === 1 ? 14 : 4, f['sun.cob'] === 1 ? 'stood with the yard against the Concord' : 'let the Lance walk from the gate'); repAdd('tyr', 5, 'held an unchartered yard against the Concord'); },
}, {
  /* ---------------- V ---------------- */
  act: 2, title: "The Jackdaw's Price", kind: 'recovery', biome: 'jungle', mood: 0, tod: 'dawn', seed: 93059, diff: 4, pay: 260000, salv: 30, site: 'Sink Hollow Depot', op: 'SPARE KEY', emp: 'tyr', foe: 'hel', who: STC.wick,
  tease: 'The Array has two fire keys. Stroud wears one. The spare sits in a vault at the Sink Hollow depot, waiting for a second control ship that has not been built. Wick knows the cradle it sits in, because he designed the cradle. Getting through the gate is another matter, and for that there is Captain Halloran of Verdigris Salvage, who holds the Concord\'s scrap contract for the depot and can walk anybody through the checkpoint in her paint. For a price. The League has found the fee; the price is extra.',
  wire: 'Wick has drawn the Sink Hollow key vault from memory on the back of a parts manifest. Captain Halloran has looked at the drawing and named a figure.',
  after: 'The Daybreak Array has turned edge-on across the sun. It is dusk at noon from Kessel to the Tarsis Flats, and the Concord says it will stay that way until the sector has reconsidered.',
  sites: { lz: [-560, -420, 40, 'LZ'], gate: [-170, -150, 54, 'CHECKPOINT'], vault: [300, 220, 84, 'KEY VAULT'], ex: [-500, 420, 50, 'EXTRACTION'] },
  guests: [RIV.ver.ch, STC.wick],
  brf: [
    { t: 'We are going to steal something. I would like that minuted. Mister Abara, tell them what.', show: [['site', 'lz', 'LZ', '#8dff6a'], ['card', 'THE JOB', ['Take the spare fire key', 'From the Concord vault at Sink Hollow', 'Bring it home']]] },
    { by: STC.wick, t: 'Two keys. With one, you can turn her edge-on and you can open a single petal for about a second. It takes both to open her and aim her. Stroud wears the first. The second is in a cradle in the floor of this bunker. I designed the cradle. It will not mind being stood on.', show: [['foe', 'vault', 'KEY VAULT'], ['face', STC.wick, ['Built the Array. Built the cradle', 'Walked forty kilometres to say so', 'Dutch says he is all right']]] },
    { by: RIV.ver.ch, t: "Halloran. I've the Concord scrap contract for that depot, so the outer gate opens for my paint and whoever is walking with me. Past the gate you are on your own, and so, I notice, am I. We will talk money on the pad.", show: [['unk', 'gate', 'CHECKPOINT'], ['route', ['lz', 'gate', 'vault'], '#2fd3b0'], ['face', RIV.ver.ch, ['Has a price for everything', 'Stays bought, once bought', 'The Concord can also afford her']]] },
    { by: CREW.intel, t: 'The inner garrison answers to nobody\'s paint. And PAX is on station: Thale\'s flagship, a Leviathan. When the vault opens she will come, and she is not something we fight this week.', show: [['ring', 'vault', 150, 'GARRISON'], ['card', 'PAX', ['Leviathan-class gunship, Concord flag', 'Arrives when the alarm goes', 'Do not stay to fight her', 'Take the key and run']]] },
    { t: 'In through the gate, quietly. Break the vault, take the key, and run for the second pad. Whatever Captain Halloran is offered while you are in there, I should like to hear about it before she answers.', show: [['clear'], ['unk', 'gate', 'GATE'], ['foe', 'vault', 'VAULT'], ['site', 'ex', 'EXTRACTION', '#8dff6a'], ['route', ['vault', 'ex'], '#8dff6a']] },
  ],
  async run(ms) {
    const S = ms.S, wick = STC.wick, thale = STC.thale, xo = ms.ops, v = ms.v, hal = RIV.ver.ch, price = 90000;
    const Lv = rivLance('ver', P.pos.x + 24, P.pos.z + 10, 0, { ai: 'follow', yaw: P.yaw }); await after(3);
    const r = await ask(hal, `Right. Money. The gate opens for my paint and it is worth ${fmt(price)} to you that it does. Up front. I have met you.`, [`Pay her (${fmt(price)})`, 'A third of the fee, when we are out', 'The Concord will not go on paying a scavenger either. Come anyway.'], 30, 1);
    if (r === 0 && CO.cb >= price) { bonus('Verdigris, for the gate', -price); stSet('ver', 1); say(hal, 'Lovely. Bought and paid for. I stay bought; ask anybody.'); }
    else if (r !== 2) { ms.payK *= .67; stSet('ver', 1); say(hal, (r === 0 ? 'You have not got it, love. I can count. ' : '') + 'A third, then. I will hold the purse.'); }
    else { stSet('ver', 2); say(hal, 'Oh, an appeal to my better nature. I had one once. Sold it. ...I will come. Somebody always ends up paying me.'); }
    const G = spawn({ mech: 2, turret: 2, tier: 1 }, S.gate.x, S.gate.z, 14, 46, 2, { paint: SUN_PAINT, name: 'GATE GUARD', ai: 'hold' }); for (const e of G) e.pacify = true;
    setObj('g', 'Walk through the checkpoint behind Verdigris'); nav('g', S.gate, 'CHECKPOINT', '#2fd3b0'); await until(() => near(S.gate, 75));
    await tell(hal, 'Morning, lads. Verdigris, scrap detail, two extra hands. No, they are new. No, they do not talk. ...Walk, love. Do not look at them.'); setObj('g', null, 1);
    const vault = mkStruct('bunker', S.vault.x, S.vault.z, 1, { name: 'KEY VAULT', hpK: 1.6 }), VG = [...sunFoes(1, S.vault.x, S.vault.z, 30, 84, { ai: 'guard' }), ...spawn({ turret: 3 }, S.vault.x, S.vault.z, 24, 46, 1)];
    nav('g', vault, 'KEY VAULT', '#ffd27a'); setObj('m', () => vault.dead ? 'The vault is open' : `Break open the key vault — ${Math.round(vault.hp / vault.max * 100)}%`);
    await until(() => near(S.vault, 240)); for (const e of VG) e.alert = true; look(vault, 'THE KEY VAULT');
    await tell(wick, 'Wick. That bunker is the vault, and the inner garrison has just worked out that Verdigris does not usually bring a lance. The key is rated for re-entry; you will not hurt it. Take the roof off.');
    await until(() => vault.dead); setObj('m', null, 1); nav('g', S.vault, 'THE KEY', '#ffd27a'); await stHold('k', S.vault, 48, 6, 'Stand on the vault — lift the key out of its cradle'); P.carry = true; stSet('key', 1); msg('FIRE KEY ABOARD', 4); sfx.play('ok');
    /* the alarm, and the price of things */
    sfx.play('alarm'); const [sx, sz] = stOff(S.vault, stAng(S.ex, S.vault), 430), PAX = mkCapital('lev', sx, sz, 1, { name: 'PAX', alert: true, hpK: 1.15, dK: .8, focus: PE }); look(PAX, 'PAX — CONCORD FLAGSHIP');
    await tell(thale, 'PAX to all peacekeepers. The vault is open and the key is walking. Captain Halloran: the Concord will double whatever those people paid you.');
    if (stGet('ver') === 1) await tell(hal, 'Marshal, I am already bought. I stay bought. It is the one thing about me you could put in a reference.');
    else { await tell(hal, 'Sold. Sorry, love. Nothing personal; it never is. ...Mind you, nobody has paid me to shut the back gate.'); leave(Lv); }
    setObj('x', 'Get the key to the extraction point'); nav('g', S.ex, 'EXTRACTION', '#8dff6a'); nav('pax', PAX, 'PAX', '#ff5a3a');
    await after(6); P.lance = 2; sunHud(); v.onLance = at => { if (!PAX.dead && Math.hypot(PAX.pos.x - at.x, PAX.pos.z - at.z) < 70) v.burn = 1; };
    await tell(wick, 'Commander, you are carrying a fire key and she is still in the sky. You can open one petal for one second. Put your reticle on the ground under that ship and press B. Then be somewhere else. It does not know your name.');
    msg('B — SKY LANCE · TWO CALLS', 5); let dropT = 12, drops = 0; stTick(dt => { if (ms.over || drops >= 2) return false; if ((dropT -= dt) > 0) return true; dropT = 26; drops++; const [x, z] = groundSpot(...stOff(P.pos, stAng(P.pos, S.ex) + rand(-.6, .6), 190), 0, 30); dropship(x, z, () => hot1(spawn({ mech: 1, tank: 1, drone: 2, tier: 1 }, x, z, 0, 26, 1, { paint: SUN_PAINT, name: 'PEACEKEEPER' })), undefined, 1); return true; });
    (async () => { await until(() => ms.over || PAX.dead || v.burn || PAX.hp < PAX.max * .72); if (ms.over || PAX.dead) return; PAX.flee = true; unnav('pax'); say(thale, v.burn ? 'Helm, take her up. ...That was the Concord\'s own light, mercenary. You will not enjoy what the Commissioner does about it.' : 'Helm, take her up. They have what they came for. The Commissioner will want to discuss it with them herself.'); })();
    await until(() => near(S.ex, 60)); await tell(xo, 'Ramp is down. Bring it aboard. Mister Abara is standing on the pad with his arms out, as if you were carrying a child.');
    win(stGet('ver') === 1 ? 'The spare fire key is out of the Sink Hollow vault and in the yard, and Verdigris stayed bought the whole way.' : 'The spare fire key is out of the Sink Hollow vault and in the yard. Verdigris was sold out from under us at the vault door, and left the back gate open on her way.');
  },
  epi: (ok, f) => ok ? [
    [STC.wick, 'It works. One key, one petal, one second. I have put a switch in your cockpit: B, once a sortie, with your reticle on the ground you want gone. Then move. She burns whatever is standing there, and that includes you.'],
    f['sun.ver'] === 1 ? [RIV.ver.ch, 'Halloran. I have been offered double, then triple, then a pardon. I have kept the letters; they will be worth something. You bought me first, love. That is the whole of my religion.'] : [RIV.ver.ch, 'Halloran. I took her money and I left your gate open, and I consider that square. Do not look for Verdigris when it comes to the fight. I have been paid not to be there.'],
    [CREW.xo, 'Commander. Come up to the deck and look out of the window. It is eleven in the morning.'],
    [STC.stroud, 'To the sector: the fire key taken from Sink Hollow was the property of the Concord. So is the Array, and I have turned it to face the sun. You have declined my daylight. You may keep my night until you have reconsidered.'],
    [CREW.intel, 'She has put the mirror edge-on across the sun. Every sky in the sector is the same sky now. Crops will fail inside a month, and the deputies running what is left of the powers will sign anything inside two. Every contract we fly, we fly under that.'],
  ] : [[STC.wick, 'The key is still in its cradle and the Concord knows we want it. They will double the garrison. I can draw you the vault again. I can draw it in my sleep. I do.']],
  prize(D, add, f) { rivRel('ver', f['sun.ver'] === 1 ? 10 : -6, f['sun.ver'] === 1 ? 'paid, and stayed bought, at Sink Hollow' : 'was bought out from under the yard at Sink Hollow'); },
});
