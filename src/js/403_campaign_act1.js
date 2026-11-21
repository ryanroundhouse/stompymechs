/* ============ THE CAMPAIGN — FALSE DAWN. ACT I, THE GOOD CLIENT: SOMEBODY HAS BUILT A SECOND SUN, PAYS PROMPTLY, AND WOULD LIKE THREE BEACONS PLANTED ============ */
STORY.sun = {
  name: 'FALSE DAWN', sub: 'Somebody has hung a second sun over the sector, and is asking what it is worth', col: '#ffd27a', emp: 'tyr', foe: 'hel', who: CREW.xo, main: true,
  get forN() { const c = stState('sun').ch; return c < 3 ? 'The Kaldur Concord' : c === 3 ? 'Nobody. This one is ours' : 'Everybody under that sky'; },
  get vsN() { const c = stState('sun').ch; return c === 1 ? 'The Vigil of Ordo Ferrum' : c < 3 ? 'Red Maw Reavers' : 'The Kaldur Concord'; },
  get payer() { return stState('sun').ch < 3 ? 'THE KALDUR CONCORD' : 'THE FREE LEAGUE WAR CHEST'; },
  open: () => CO.done >= 3, wait: 8, flags: ['vigil', 'oath', 'cob', 'ver', 'key', 'show', 'thale', 'end'],
  note: 'This is the campaign: eight operations in three acts, and the sector is not the same after some of them. Its card stays on the board until it is flown; lose one and it is back within hours.',
  fin: 'The sun came up over the Meridian Field at four in the morning, and for the first time in a season nobody had arranged it.',
  close: 'That is the end of it. The Concord, the Array, the dark. I have closed the file and I find I do not know which drawer it goes in. Go and stand outside for a minute, Commander. It is free again.',
  again: 'We go back. There is nobody else to send, and the card will be on the board again in a few hours.',
  ch: [{
    /* ---------------- I ---------------- */
    act: 1, title: 'First Light', kind: 'recon', biome: 'desert', mood: 0, tod: 'night', seed: 93011, diff: 2, pay: 120000, salv: 20, site: 'Tarsis Flats', op: 'LAMPLIGHTER', emp: 'hel', foe: 'maw', who: STC.stroud,
    tease: 'The five powers have agreed on one thing in forty years, and it is in orbit: the Daybreak Array, a mirror eleven kilometres across, built to put daylight on the polar towns through the dark season. The Kaldur Concord, which the powers set up to arbitrate their contracts, owns it. Tonight it opens for the first time, and it cannot find the ground without three alignment beacons planted by hand in the Tarsis Flats, where the Red Maw strips anything left standing overnight. Commissioner Stroud is paying well above the rate, and she asked for a small company. She said small companies listen.',
    wire: 'A Commissioner of the Kaldur Concord is on the pad, in person, asking for the yard by name. She has brought her own coffee and a contract with the fee already filled in.',
    after: 'The Daybreak Array opened over the Tarsis Flats at two in the morning. Witnesses describe a sunrise that took nine seconds.',
    sites: { lz: [-560, 420, 40, 'LZ'], b1: [-220, 140, 46, 'BEACON ONE'], b2: [240, 260, 46, 'BEACON TWO'], b3: [320, -220, 46, 'BEACON THREE'], dish: [-60, -400, 70, 'GROUND STATION'], ridge: [-440, -540, 40, 'THE RIDGE'] },
    guests: [STC.stroud],
    brf: [
      { t: 'New client, and not a small one. The Kaldur Concord: the board the five powers set up to stop their contract disputes turning into wars. It has their money and, this month, their mirror. Commissioner — your briefing.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['card', 'THE CLIENT', ['The Kaldur Concord', 'Arbitration board of the five powers', 'Pays above the rate, in advance', 'Asked for us by name']]] },
      { by: STC.stroud, t: 'Thank you, Commander Varga. North of the Kessel line the dark season lasts seventy days and kills four hundred people, every year, of cold and of the things people do in the dark. I intend to end it. The Daybreak Array is a mirror. Tonight I open it.', show: [['face', STC.stroud, ['Commissioner of the Concord', 'Twenty years an arbitrator', 'Has never lost a ruling on appeal', 'Does everything promptly']]] },
      { by: STC.stroud, t: 'A mirror eleven kilometres wide must know where the ground is to within a metre. Three beacons, planted here, here and here, each held on its mark until it has calibrated. My ground station listens from the north.', show: [['site', 'b1', 'BEACON I', '#ffd27a'], ['site', 'b2', 'BEACON II', '#ffd27a'], ['site', 'b3', 'BEACON III', '#ffd27a'], ['ally', 'dish', 'GROUND STATION'], ['route', ['lz', 'b1', 'b2', 'b3', 'dish'], '#8dff6a']] },
      { by: CREW.intel, t: 'The Flats belong to Red Maw scrappers after dark. They will come for the beacons as they go up, and for the dish when they understand what it is. A Concord peacekeeper detail under a Marshal Thale holds the station. They do not leave it.', show: [['foe', [60, 60], 'SCRAPPERS — ROAMING'], ['ring', 'dish', 150, 'PEACEKEEPERS']] },
      { by: CREW.intel, t: 'For the file: the financing is real. Five signatures. There is one annex to the build contract I cannot open, on focus tolerances. It is sealed at Commissioner level.', show: [['card', 'DAYBREAK ARRAY', ['Orbital mirror, 11 km, folded', 'Purpose: daylight for the polar towns', 'Owner: the Concord', 'One annex sealed: "focus tolerances"']]] },
      { by: CREW.chief, t: "A mirror that size'll put noon on a town, boss, or on a pinhead. Depends who's got hold of the handle. I'm only saying.", show: [['face', STC.wick, ['Tomasz "Wick" Abara', 'Chief lamplighter: he built her', 'On the ground station channel tonight']]] },
      { t: 'Three beacons, then the station, then we watch a sunrise at two in the morning and go home paid. Night drop. Use your lamp.', show: [['clear'], ['site', 'b1', 'I', '#ffd27a'], ['site', 'b2', 'II', '#ffd27a'], ['site', 'b3', 'III', '#ffd27a'], ['ally', 'dish', 'GROUND STATION']] },
    ],
    async run(ms) {
      const S = ms.S, st = STC.stroud, wick = STC.wick, thale = STC.thale, mira = CREW.intel, dutch = CREW.chief, v = ms.v;
      const dish = mkStruct('comm', S.dish.x, S.dish.z, 0, { name: 'GROUND STATION', hpK: 6 }); dish.onKill = () => lose('The ground station is scrap, and the Daybreak Array has nothing to listen to. The Concord has stopped the cheque.', .1);
      spawn({ mech: 2, tier: 1 }, S.dish.x, S.dish.z, 30, 50, 0, { paint: SUN_PAINT, name: 'PEACEKEEPER', ai: 'hold' }); const wreck = mkStruct('depot', S.ridge.x, S.ridge.z, 2, { name: 'ABANDONED DEPOT' });
      setObj('m', 'Plant the beacons — 0 of 3'); await after(3);
      await tell(wick, "Ground station to the lance. This is Wick — I built her, so if anything goes wrong tonight it is my fault, and I would like that understood before we start. Three beacons. Stand on each mark until it sings. That is all she needs to find the ground.");
      for (let i = 0; i < 3; i++) {
        const p = S['b' + (i + 1)]; nav('b', p, `BEACON ${STNUM[i]}`, '#ffd27a'); setObj('m', `Plant the beacons — ${i} of 3`);
        await until(() => near(p, 160)); if (i) hot1(stFrom(.45 + i * .2, p, stAng(S.lz, p) + rand(-.7, .7), 220, { paint: 1, name: 'SCRAPPER' }));
        if (i === 1) chatter(mira, 'Scrappers, coming to see what the light is. They want the beacon casings. They will take your armour if it is easier.');
        await stHold('h', p, 60, 12, `Hold the mark — beacon ${STNUM[i]} calibrating`); stBeacon(p, 0xffd27a); sfx.play('ok');
        chatter(wick, ['One. She can hear it. Oh, that is a clean signal.', 'Two. I have a baseline. One more and she knows where the whole desert is.', 'Three! Three, and locked, to nine tenths of a metre. Commander, I could kiss your machine.'][i]);
      }
      unnav('b'); setObj('m', 'Plant the beacons — 3 of 3', 1);
      const a0 = stAng(S.dish, S.lz), W = [...stFrom(1, S.dish, a0 + 2.2, 300, { paint: 1, name: 'REAVER', focus: dish }), ...stFrom(.7, S.dish, a0 - 2, 320, { paint: 1, name: 'REAVER', focus: dish })]; look(W[0], 'RED MAW — FOR THE DISH'); sfx.play('alarm');
      await tell(thale, 'Marshal Thale, Concord peacekeepers. Reavers on the ground station, two bearings. Mercenary: you are paid to be here. Be here.');
      nav('d', dish, 'GROUND STATION', '#ffd27a'); setObj('d', () => `Hold the ground station — ${alive(W)} reavers · dish ${Math.round(dish.hp / dish.max * 100)}%`);
      await until(() => alive(W) <= 1); leave(W); setObj('d', null, 1); unnav('d'); dish.inv = true;
      await tell(st, 'Commander. You have stood in the dark all night on my account. Allow me to do something about it. Mister Abara — open her.');
      await tell(wick, "Aperture in five. Don't look straight at— no. Do. Everybody should, once.");
      msg('THE DAYBREAK ARRAY IS OPENING', 5); sfx.play('door'); await todShift('day', 9);
      chatter(PILOTS[0].ch, "Boss. It's two in the morning and I can count the rocks on that ridge.");
      await after(4); await tell(dutch, "Forty years of sunrises, boss, and that's the first one I ever saw somebody do on purpose. ...Came up fast, mind. Didn't care for how fast.");
      await tell(st, 'One formality. The Array must hold its focus to a metre or it is no use to a town. Marshal — the abandoned depot on the ridge, if you please. Do stand clear, Commander.');
      look(wreck, 'FOCUS TEST'); nav('w', wreck, 'FOCUS TEST', '#ffd27a'); skyLance(wreck.pos, { own: 1, dmg: 300, r: 30, delay: 4.5, hit: () => { v.test = 1; killEnt(wreck, 2); } }); await until(() => v.test || wreck.dead); unnav('w');
      await after(3); await tell(mira, 'That was a depot. It is a puddle, and the puddle is glowing. ...Commander, a mirror built to warm a town to the metre has no use for that setting.');
      await tell(st, 'It has every use for it. The tolerance that keeps a hospital warm keeps its car park cool. You hold a steady light, Commander. The Concord pays promptly. You will find I do everything promptly.');
      win('Three beacons, a ground station, and a sunrise at two in the morning. The Daybreak Array is open, the Concord has paid in full, and there is a glass crater on the ridge where a depot was.');
    },
    epi: (ok, f) => ok ? [
      [STC.stroud, 'The fee is in your account; I had it sent before you landed. I have more work of this kind, and I prefer to give it to people who have already seen the thing and kept their heads. Kessel Station, next. You will like Kessel.'],
      [STC.wick, "Wick. I wanted to say thank you properly. Nine years I have been building her. My mother is in Kessel. She has not seen her own garden in winter since I was six."],
      [CREW.intel, 'I asked the Commissioner\'s office what the depot setting is called in the documentation. They said "demonstration mode", and then they asked for my name.'],
    ] : [[STC.stroud, 'The Array will open, Commander, with you or with somebody else. I would rather it were you. I dislike explaining things twice.']],
    prize(D, add) { add('Concord retainer', 25000); },
  }, {
    /* ---------------- II ---------------- */
    act: 1, title: 'The Vigil', kind: 'garrison', biome: 'glacial', mood: 0, tod: 'night', seed: 93023, diff: 3, pay: 165000, salv: 25, site: 'Kessel Station', op: 'MIDWINTER', emp: 'hel', foe: 'ord', who: STC.stroud,
    tease: 'Kessel Station: three thousand people, seventy-one days into the dark. Tonight the Array comes over the pole and gives them a morning. It talks to the ground through one uplink tower, and a column of Ordo Ferrum machines is walking across the ice to pull that tower down. The monks who keep the Vigil say no hand should hold the sun. Commissioner Stroud says that they are very sincere and entirely wrong, and that she will pay to have it explained to them.',
    wire: 'The Concord has more work for the yard, at Kessel Station, in the dark. The Ordo Ferrum has declared the Daybreak Array an abomination and is walking north to say so in person.',
    after: 'Kessel Station has had its first morning in seventy-one days. The Ordo Ferrum reports "a loss on the ice" and has said nothing else.',
    sites: { lz: [0, 540, 40, 'LZ'], town: [0, 60, 96, 'KESSEL STATION'], n: [-80, -540, 50, 'NORTH ICE'], e: [540, -160, 50, 'EAST MORAINE'], w: [-540, -120, 50, 'WEST SHELF'] },
    guests: [STC.stroud],
    brf: [
      { t: 'Kessel Station. Three thousand people on the ice and no daylight since the autumn. The Array passes over the pole tonight, and for as long as it is overhead, they get a morning. We are there to see that they do.', show: [['site', 'lz', 'LZ', '#8dff6a'], ['ally', 'town', 'KESSEL STATION'], ['card', 'THE JOB', ['Hold the Kessel uplink tower', 'Until the Array is overhead', 'Then until the client says stop']]] },
      { by: STC.stroud, t: 'The Array speaks to Kessel through one tower. The Ordo Ferrum has sent the Vigil to remove it. They believe a light that can be pointed is a weapon by definition. It is a tidy belief and it would leave three thousand people in the dark.', show: [['foe', 'n', 'THE VIGIL'], ['foe', 'e', 'THE VIGIL'], ['foe', 'w', 'THE VIGIL'], ['face', STC.abb, ['Brother-Mechanic Ozias Thorne', 'Keeper of the Vigil', 'Has read something he should not have']]] },
      { by: CREW.intel, t: 'Thorne is not a fanatic. I have his file: he is a careful old man who checks his sums. He has come a long way over bad ice for something. I would like to know what he has read that I have not.', show: [['ring', 'town', 420, 'THEY START HERE'], ['route', ['n', 'town'], '#c9a0ff'], ['route', ['e', 'town'], '#c9a0ff'], ['route', ['w', 'town'], '#c9a0ff']] },
      { by: STC.wick, t: "Wick, on the wire from the ground station. When she clears the pole, give me the uplink and I will put a morning on that town. Three minutes. All I need is the tower standing when she gets there.", show: [['card', 'THE CLOCK', ['The Array rises in about three minutes', 'Every wave goes for the tower', 'Lose the tower and Kessel stays dark']]] },
      { t: 'They will come from the ice on three sides and they will all want the tower. Stay near it. And it is night until it suddenly is not: mind your eyes.', show: [['clear'], ['ally', 'town', 'UPLINK'], ['foe', 'n', 'NORTH'], ['foe', 'e', 'EAST'], ['foe', 'w', 'WEST']] },
    ],
    async run(ms) {
      const S = ms.S, st = STC.stroud, wick = STC.wick, abb = STC.abb, v = ms.v, op = { paint: FAC.ord.paint, name: 'VIGILANT' };
      const U = mkStruct('comm', S.town.x, S.town.z, 0, { name: 'KESSEL UPLINK', hpK: 7 }); U.onKill = () => lose('The Kessel uplink is lying in the snow. The Array went over the pole with nothing to talk to, and Kessel Station is still in the dark.', .1);
      for (let i = 0; i < 4; i++) mkStruct('hab', ...stOff(S.town, i * TAU / 4 + .6, 56), 0, { name: 'KESSEL STATION', hpK: 4, ry: i * 1.4 });
      let rise = 0; stTick(dt => { if (ms.over || rise >= 1) return false; rise = Math.min(1, rise + dt / 165); return true; });
      setObj('u', () => `Keep the uplink standing — ${Math.round(U.hp / U.max * 100)}%`); setObj('r', () => rise < 1 ? `The Array is rising over the pole ${stBar(rise * 100)}` : 'The Array is over Kessel'); nav('u', U, 'UPLINK', '#ffd27a');
      await after(3); await tell(wick, 'Kessel, this is Wick. Seventy-one days since any of you saw your own hands out of doors. Give me three minutes. Commander — keep that tower up and I will put a morning on this town.');
      const wave = (k, from, n) => { const W = stFrom(k, S.town, stAng(S.town, S[from]), 430, { ...op, focus: U }); look(W[0], `THE VIGIL — ${n}`); msg(`THE VIGIL — FROM THE ${n}`, 3); sfx.play('alarm'); return W; };
      const W1 = wave(.8, 'n', 'NORTH ICE'); await tell(abb, 'Mercenary. I am Ozias Thorne and I keep the Vigil. I have no quarrel with a town that wants a morning. I have come to pull down a gun. Stand aside from it.');
      await until(() => alive(W1) <= 1 || rise > .36); chatter(st, 'Brother Thorne mistakes an engineering tolerance for a sin. Hold the tower, Commander.');
      const W2 = wave(.9, 'e', 'EAST MORAINE'); await until(() => alive(W1) + alive(W2) <= 1 || rise > .7);
      chatter(abb, 'Ask her what is in the sealed annex. Ask her why a lamp has a focus table. I have read it, child. I wish that I had not.');
      wave(1, 'w', 'WEST SHELF'); await until(() => rise >= 1);
      msg('THE ARRAY IS OVER KESSEL', 5); await tell(wick, 'Uplink is good. Kessel — mind your eyes. Here she comes.'); await todShift('day', 10);
      chatter(wick, 'Look at them. Every door on the street. There is a man down there in the snow in his nightshirt, laughing. THAT is what she is for.'); await after(6);
      /* and then the other thing she is for */
      const an = stAng(S.town, S.n), [kx, kz] = stOff(S.town, an, 520), K = stBig(mkMech(kx, kz, { name: 'VIGIL-KEEPER', legs: 'hvy', torso: 'jug', head: 'skl', armL: 'pls', armR: 'claw', back: 'plt', paint: FAC.ord.paint }, 1, { name: 'VIGIL-KEEPER', hpK: 3, skill: 1.2 }), 1.3), E = stFrom(1.3, S.town, an, 470, { ...op, focus: U });
      K.alert = true; K.focus = U; fieldWho(abb, K); look(K, 'THE VIGIL-KEEPER'); sfx.play('alarm');
      await tell(abb, 'Then I will pull it down myself, in daylight, where the town can watch me do it. I am sorry about the morning. It was a good morning.');
      setObj('k', () => `The Vigil's last column — ${alive(E) + (K.dead ? 0 : 1)} machines`); nav('k', K, 'VIGIL-KEEPER', '#c9a0ff');
      await until(() => K.dead || stDist(K.pos, S.town) < 300 || alive(E) <= 1 || K.hp < K.max * .6);
      if (!K.dead) {
        K.inv = true; await tell(st, 'That will do. Marshal Thale — narrow the focus. The column.'); chatter(wick, "Commissioner, she isn't rated for— there are PEOPLE in those machines—");
        const T = [K, ...E.filter(e => !e.dead)].slice(0, 4); v.n = 0; T.forEach((e, i) => skyLance(e.pos, { own: 0, dmg: 700, r: 30, delay: 2.6 + i * .7, hit: () => v.n++ })); await until(() => v.n >= T.length); await after(1);
        for (const e of E) if (!e.dead) killEnt(e, 2); K.hp = Math.min(K.hp, K.max * .15); Object.assign(K, { pacify: true, ai: 'hold' }); setObj('k', "The Vigil's last column — burned", 1);
        await tell(st, 'A fault in the focus. Most regrettable. The Concord will of course compensate the Order for its machines.');
        const r = await ask(abb, 'Forty of mine are on the ice, mercenary, and the ones who can walk are carrying the ones who cannot. Now you have seen what the lamp is for. I am in your sights. Will you finish what it began — or may I take them home?', ['Go. Take them home.', 'The contract says the column is destroyed.'], 28, 0);
        stSet('vigil', r + 1); unnav('k');
        if (r === 0) { leave([K]); await tell(abb, 'Then one of us on this ice has kept a vigil tonight. I will remember which.'); await tell(st, 'Noted, Commander. Mercy was not in the contract. Nor was it excluded. I shall not dock you for it. This time.'); }
        else { K.inv = false; killEnt(K, 0); stPay('Concord completion bonus', 30000); await tell(st, 'Thorough. I do like thorough.'); chatter(wick, '...'); }
      } else stSet('vigil', 2);
      win('Kessel Station had a morning. The Vigil of Ordo Ferrum came to pull down a lamp, and found out on the ice what else it was.');
    },
    epi: (ok, f) => ok ? [
      [STC.wick, "A fault in the focus. I wrote the focus. There is no fault in it. There is a table in there I did not write, and somebody ran it tonight from the Commissioner's own console. I am going to find out who. I am going to be very polite about it."],
      f['sun.vigil'] === 1 ? [STC.abb, 'Thorne. The Order does not send thanks; it keeps accounts. Yours shows one entry, in the column we seldom use. If a night comes when you need the Vigil, mercenary, light a lamp.'] : [CREW.intel, 'The Ordo Ferrum has struck Brother Thorne from its rolls as lost on the ice. They have not asked who fired. I think they know.'],
      [STC.stroud, 'You are invited to Port Sennet. All five powers sign the Concord Peace there in a week: one law for every contract in the sector. Every charter company will stand honour guard. I should like you at my right hand, Commander. You hold such a steady light.'],
    ] : [[STC.stroud, 'Kessel is still dark, Commander, and the Array comes round again tomorrow. So, I trust, do you.']],
    prize(D, add, f) { if (f['sun.vigil'] === 1) repAdd('ord', 6, 'let the Vigil carry its wounded off the ice at Kessel'); else repAdd('ord', -8, 'finished the Vigil on the ice at Kessel'); },
  }, {
    /* ---------------- III ---------------- */
    act: 1, title: 'The Demonstration', kind: 'garrison', biome: 'urban', mood: 0, tod: 'dusk', seed: 93037, diff: 3, pay: 200000, salv: 15, site: 'Port Sennet', op: 'SIGNATURE', emp: 'hel', foe: 'maw', who: STC.stroud,
    tease: 'The five powers sign the Concord Peace at Port Sennet this evening: one law for every contract in the sector, and the Kaldur Concord to keep it. Every charter company has been asked to stand honour guard, the three you know among them. At the last signature the Daybreak Array opens over the hall, a dawn at dusk, for the cameras. The Red Maw have promised to spoil it. Commissioner Stroud would like you at her right hand, carrying her beacon. It is, she says, purely ceremonial.',
    wire: 'Port Sennet, this evening: five delegations, one treaty, every company in the sector in its best paint. The Commissioner has asked that the yard carry her beacon.',
    after: 'The Concord Hall at Port Sennet is gone, and five governments with it. The Concord has assumed their contracts and voided every charter in the sector. Whoever is still hiring is paying war rates.',
    sites: { lz: [-540, 500, 40, 'LZ'], hall: [0, 0, 110, 'CONCORD HALL'], post: [-250, 130, 46, 'YOUR POST'], g1: [430, -280, 56, 'BREAKWATER BATTERY'], g2: [-360, -430, 56, 'NORTH QUAY BATTERY'], out: [330, 440, 50, 'EXTRACTION'] },
    guests: [STC.stroud],
    brf: [
      { t: 'Dress uniform, in a manner of speaking. The five powers sign a treaty tonight and every company in the sector stands guard while they do it. We have been given the post of honour, which I distrust on principle.', show: [['site', 'lz', 'LZ', '#8dff6a'], ['ally', 'hall', 'CONCORD HALL'], ['site', 'post', 'OUR POST', '#ffd27a'], ['card', 'THE JOB', ['Honour guard at the Concord Hall', 'Carry the Commissioner\'s beacon', 'Do not start a fight with the Carnival']]] },
      { by: STC.stroud, t: 'At the last signature the Array opens over the hall. The beacon you carry tells it where the hall is. That is all. I ask you to carry it, Commander, because I have seen you hold a mark under fire, and I should like tonight to go exactly as I have planned it.', show: [['face', STC.stroud, ['Signs last, for the Concord', 'Wrote the treaty herself', 'Article nine is hers', 'Nobody has read article nine']]] },
      { by: CREW.intel, t: 'The Maw have been saying for a week that they will shell the hall. Siege guns were seen going on to the breakwater and the north quay two nights ago. Nobody stopped them. I asked the peacekeepers why. I was told it was in hand.', show: [['foe', 'g1', 'SIEGE GUNS?'], ['foe', 'g2', 'SIEGE GUNS?'], ['ring', 'hall', 200, 'SHELLFIRE REACHES HERE']] },
      { by: CREW.intel, t: 'Cobalt Lance, the Carnival and Verdigris all have posts round the hall. Quintero has six cameras on it. And I still cannot open that annex.', show: [['ally', [70, 100], 'COBALT'], ['ally', [-110, -60], 'CARNIVAL'], ['ally', [50, -110], 'VERDIGRIS']] },
      { t: 'Stand your post. Look smart. If the guns open, the Commissioner will tell you what she wants done with that beacon. Extraction is here if the evening goes wrong, and I have a feeling about the evening.', show: [['clear'], ['ally', 'hall', 'THE HALL'], ['site', 'post', 'POST', '#ffd27a'], ['site', 'out', 'EXTRACTION', '#8dff6a']] },
    ],
    async run(ms) {
      const S = ms.S, st = STC.stroud, wick = STC.wick, thale = STC.thale, xo = ms.ops, mira = CREW.intel, v = ms.v, fer = RIV.cob.ch, hal = RIV.ver.ch, mae = RIV.car.ch;
      const hall = mkStruct('hq', S.hall.x, S.hall.z, 0, { name: 'CONCORD HALL', hpK: 9 }); hall.inv = true; for (let i = 0; i < 6; i++) stBeam(gpos(...stOff(S.hall, i * TAU / 6, 70)), 0xffd27a, 160, 1.6);
      const Lc = rivLance('cob', ...stOff(S.hall, .6, 120), 2, { ai: 'hold' }), Lv = rivLance('ver', ...stOff(S.hall, 2.7, 125), 2, { ai: 'hold' }), Lm = rivLance('car', ...stOff(S.hall, 4.6, 120), 2, { ai: 'hold' }); for (const e of [...Lc, ...Lv, ...Lm]) e.pacify = true;
      setObj('a', 'Take your post at the Concord Hall'); nav('p', S.post, 'YOUR POST', '#ffd27a');
      await after(3); chatter(mae, 'Darling! You have scrubbed up. Six cameras on the hall tonight — six! History, and me standing in front of it.');
      await until(() => near(S.post, 60)); setObj('a', null, 1); unnav('p');
      await tell(st, 'Commander. Punctual. The delegations are seated: five powers at one table, for the first time in forty years. At the last signature the Array opens over this hall. I am told it will photograph well.');
      await after(5);
      const guns = ['g1', 'g2'].map(k => { const g = mkStruct('arty', S[k].x, S[k].z, 1, { name: 'SIEGE GUN', hpK: 3 }); g.inv = true; return g; });
      let fire = true; stTick(dt => { if (ms.over || !fire) return false; if (Math.random() < dt * .5) { const [x, z] = stOff(S.hall, rand(TAU), rand(70, 200)); shell(x, z, 36, 14, 2.4); } return true; });
      sfx.play('alarm'); msg('SHELLFIRE — THE HALL IS UNDER FIRE', 4); await tell(thale, 'Siege guns, the breakwater and the north quay. Red Maw. All companies hold the hall. Not you, mercenary. You carry the beacon.');
      await tell(st, 'They are dug in under forty metres of sea wall, Commander; nothing you carry will reach them. The Array will. Take my beacon to each battery and hold it there until I have the mark.');
      for (let i = 0; i < 2; i++) {
        const k = 'g' + (i + 1), g = guns[i]; hot1(spawn({ mech: 1, tank: 2, drone: 2, tier: 1 }, S[k].x, S[k].z, 20, 60, 1, { paint: 1, name: 'REAVER' })); nav('g', g, i ? 'NORTH QUAY BATTERY' : 'BREAKWATER BATTERY', '#ff5a3a'); setObj('m', `Mark the ${i ? 'north quay' : 'breakwater'} battery for the Array`);
        await until(() => near(S[k], 180)); if (i) await tell(mira, 'Commander — the gun crews. I have had a lens on that battery for a minute and nobody has moved. They are at their posts and they are not moving at all. Somebody is firing those guns by wire.');
        await stHold('h', S[k], 90, 8, 'Hold the beacon on the battery'); v.hit = 0; msg('MARK ACCEPTED — STAND CLEAR', 3); skyLance(g.pos, { own: 0, dmg: 600, r: 30, delay: 3.4, hit: () => { v.hit = 1; g.inv = false; killEnt(g, 2); } }); await until(() => v.hit); setObj('m', null, 1);
        if (!i) chatter(st, 'One. You do hold a very steady light.');
      }
      unnav('g'); fire = false;
      /* what the evening was for */
      await after(2); await tell(st, 'Two marks, either side of the hall, forty metres apart in range. Thank you, Commander. That is all the calibration I required.');
      chatter(wick, 'Commissioner — the focus table is loading a third solution. That is not a battery. That is the HALL—');
      msg('THE DAYBREAK ARRAY IS OPENING', 5); todShift('day', 5); look(hall, 'THE CONCORD HALL'); v.hit = 0;
      skyLance(hall.pos, { own: 1, dmg: 260, r: 62, delay: 5.5, hit: () => { v.hit = 1; hall.inv = false; killEnt(hall, 2); for (let i = 0; i < 7; i++) explode(FD.fx, V3(hall.pos.x + rand(-34, 34), hall.pos.y + rand(4, 18), hall.pos.z + rand(-34, 34)), 2.6); } });
      await until(() => v.hit); P.shake += 1.5; msg('THE CONCORD HALL IS GONE', 6); await after(3.5);
      await tell(st, 'People of the sector. Red Maw guns have this evening murdered the delegations of all five powers. I am the surviving signatory. Under article nine the Concord assumes their contracts, their debts and their armies. Every company charter is void until it is sworn again. To me.');
      await tell(fer, 'Cobalt Lance recognises the lawful successor authority. ...It is lawful. I have read article nine. God forgive me, I have now read it twice.');
      chatter(hal, 'Verdigris swears. Loudly. What does swearing pay?');
      await tell(mae, 'Six cameras, darling. SIX. I am leaving now, very quickly, and I am taking all of them.'); leave(Lm);
      const r = await ask(st, 'And you, Commander. You aimed it. Both marks are in your beacon log, in your own hand. Swear, and that is a footnote. Refuse, and it is the headline.', ['We swear. (It is a lie.)', 'You aimed it. We will say so to anyone who asks.'], 30, 1); stSet('oath', r + 1);
      if (r === 0) {
        await tell(st, 'Sensible. Report to Marshal Thale at first light.'); stPay('Concord oath money', 60000); setObj('x', 'Walk to the extraction point. Slowly'); nav('x', S.out, 'EXTRACTION', '#8dff6a'); const p0 = P.pos.clone(); await until(() => stDist(P.pos, p0) > 260 || near(S.out, 200));
        await tell(wick, "All stations, all stations — Abara, at the ground station. It was never only a lamp. She had the focus table from the first day. The marks were the mercenary's— Commander, she is reading your log, RUN—");
        await tell(st, 'Mister Abara has just cost you your oath, Commander. I had hoped to keep you. Marshal.');
      } else await tell(st, 'A pity. You hold such a steady light. Marshal Thale: the Commander is unchartered. Proceed.');
      setObj('x', 'GET OUT — reach the extraction point'); nav('x', S.out, 'EXTRACTION', '#8dff6a'); sfx.play('alarm'); msg('THE ARRAY IS TRACKING YOU — KEEP MOVING', 5);
      chatter(fer, 'Cobalt was ordered to hold the hall. There is no hall. Cobalt will not fire. It is the most I can do for you, and I am ashamed of how little it is.');
      const B = sunSweep(gpos(...stOff(P.pos, stAng(S.out, P.pos), 150)), () => P.pos, { v: Math.min(9.5, player.stats.speed * RUN * .62), r: 22, dps: 95 });
      let dropT = 5, drops = 0; stTick(dt => { if (ms.over) return false; if ((dropT -= dt) > 0 || drops >= 4) return true; dropT = 15; drops++; const [x, z] = groundSpot(...stOff(P.pos, stAng(P.pos, S.out) + rand(-.7, .7), 190), 0, 30); dropship(x, z, () => hot1(spawn({ mech: 1, drone: 2, tier: 1 }, x, z, 0, 26, 1, { paint: SUN_PAINT, name: 'PEACEKEEPER' })), undefined, 1); return true; });
      await until(() => near(S.out, 60)); B.stop(); await tell(xo, 'Dropship is down and the ramp is open. Get aboard. Do not stop to look at the city.');
      win(r === 0 ? 'Five governments died at Port Sennet under a light the company aimed. It swore to the Concord, was unmasked inside ten minutes, and ran for the dropship with the sky coming after it.' : 'Five governments died at Port Sennet under a light the company aimed. It said so on an open channel, was unchartered on the spot, and ran for the dropship with the sky coming after it.');
    },
    epi: (ok, f) => ok ? [
      [CREW.xo, 'Unchartered. It is on every board in the sector. No power will put its name to a contract with us, and the Concord has assumed every contract the powers had. I have been an officer for twenty-two years and I do not know what we are now.'],
      [CREW.intel, 'She needed two marks either side of the hall to range it, from a beacon nobody would think to search. She hired a small company because small companies listen. I should have opened that annex with a crowbar.'],
      [CREW.chief, "Here's the other side of it, boss. Every deputy, clerk and second cousin left running a power is hiring, and none of 'em can afford to haggle. War rates. And the Concord'll drop peacekeepers on any job it hears about. So that's the new weather."],
      f['sun.oath'] === 1 ? [CREW.xo, 'The oath money cleared before she voided it. I have decided not to send it back. The League has heard that we swore; they have not yet heard the rest.'] : null,
    ] : [[CREW.xo, 'You did not get out of Port Sennet, and yet here you are; I will not ask how. We fly it again, because whatever happened in that city, somebody has to have seen it and lived.']],
    prize(D, add, f) { repAdd('tyr', f['sun.oath'] === 2 ? 8 : -5, f['sun.oath'] === 2 ? 'refused the Concord oath at Port Sennet, on an open channel' : 'swore to the Concord at Port Sennet'); rivRel('car', 6, 'got out of Port Sennet the same evening'); },
  }],
};
