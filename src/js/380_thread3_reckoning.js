/* ============ STORY THREAD 3 — DEAD RECKONING: MIRA SATO'S BROTHER WENT MISSING SIX YEARS AGO. HIS MACHINE DID NOT STOP WALKING ============ */
Object.assign(CAST, { 9141: { bot: true }, 9143: { build: 'broad', h: 1.9, habit: 'back', ...stLook('#b8b8b8', 4, 'beard') }, 9145: { build: 'slim', h: 1.76, habit: 'cross', ...stLook('#e8e8e8', 0, 'glasses') }, 9147: { build: 'lean', ...stLook('#1b1b1b', 0, 'headset', '#8d5524') } });   /* Kenji has his sister's colouring */
STC.ken = { name: 'Kenji Sato', first: 'Kenji', last: 'Sato', role: 'HELION DEEP SURVEY · RECORDED SIX YEARS AGO', seed: 9147, col: '#bfe9ff' };
/* a Helion heavy lifter over a walking machine: two winch drones hold the tethers, and the machine goes nowhere until they are shot off */
function stLifter(tg) {
  const g = grp(FD.scene, tg.pos.x, tg.pos.y + 46, tg.pos.z); tbox(g, M.dark, 12, 6, 28, .75, .8, 0, 0, 0); box(g, M.girder, 30, 1, 8, 0, 1.6, -3); for (const [px, pz] of [[-13, 0], [13, 0], [-13, -8], [13, -8]]) { cyl(g, M.steel, 2.6, 3, 5, px, .6, pz, 0, 0, 0, 12); noShadow(cyl(g, M.amber, 2.2, 2.2, .3, px, -2, pz, 0, 0, 0, 12)); } noShadow(box(g, M.cyan, 5, 1.2, .2, 0, 3.4, 11, -.5)); FD.misc.push(g);
  const W = [-1, 1].map(s => { const e = mkDrone(tg.pos.x + s * 11, tg.pos.z, 1); e.name = 'GRAPPLE WINCH'; e.hp = e.max = 150; e.r = 3.4; e.update = () => { e.pos.set(tg.pos.x + s * 11, tg.pos.y + 30, tg.pos.z); }; return e; }); let bt = 0;
  stTick(dt => { if (MS.over || !alive(W)) { sfx.play('ship'); ftween(5, k => { g.position.y = tg.pos.y + 46 + k * 260; g.position.x += k * 3; }, ease.in).then(() => stGone(g)); return false; } g.position.set(tg.pos.x, tg.pos.y + 46 + Math.sin(MS.t * 1.3) * 1.2, tg.pos.z);
    if ((bt -= dt) < 0) { bt = .12; for (const e of W) if (!e.dead) { const m = hot(0x66e0ff, 4); m.transparent = true; m.blending = THREE.AdditiveBlending; m.depthWrite = false; _o.copy(tg.pos); _o.y += tg.cy * 1.5; addBeam(e.pos.clone(), _o.clone(), m, .5, .16); } } return true; });
  return W;
}
STORY.dead = {
  name: 'DEAD RECKONING', sub: 'Something is lighting lamps for the lost', col: '#9fe8ff', emp: 'ord', foe: 'hel', who: CREW.intel, forN: 'Mira Sato', payer: 'M. SATO, PERSONAL ACCOUNT',
  open: () => CO.done >= 4, wait: 18, flags: ['vigil', 'lights', 'end'],
  fin: 'A Helion survey frame, lost six years, walked itself home across half the sector with nobody aboard. The Combine has declined to comment. The Ordo Ferrum has declared a feast day.',
  end: 'Mira will not say thank you. She has halved her rates instead, which from her is the same thing.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'Dead Reckoning', kind: 'recon', biome: 'lunar', mood: 0, tod: 'night', seed: 93011, diff: 2, pay: 90000, salv: 25, site: 'Kaldur Secundus', op: 'NIGHT LIGHT',
    tease: 'Six years ago a Helion deep-survey lance went silent on the dark side of Kaldur\'s second moon. One of its pilots was Kenji Sato. Eleven days ago a survey beacon carrying his personal key began to transmit from that surface — and then a second, a hundred metres on. Something is laying a trail. Mira is not asking the company to take a contract. She is asking.',
    wire: 'Mira Sato has asked for an hour of the commander\'s time, off the record. She has never asked for anything.',
    sites: { lz: [-560, 440, 40, 'LZ'], b1: [-300, 190, 34, 'BEACON'], b2: [-40, 250, 40, 'BEACON'], b3: [190, -30, 34, 'BEACON'], b4: [450, -250, 36, 'BEACON'], ridge: [610, -400, 50, 'THE TERMINATOR'] },
    brf: [
      { t: 'This is not on the board as a contract, because it is not one. Mira has the floor. Hear her out.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['card', 'THE JOB', ['Follow a trail of survey beacons', 'Kaldur Secundus, dark side', 'Client: one of our own']]] },
      { by: CREW.intel, t: 'Six years ago my brother took a survey frame called LANTERN out on to this moon for the Helion Combine. Four machines went. Nothing came back, and the Combine closed the file in nine days. I have never believed the file.', show: [['face', STC.ken, ['Kenji Sato, survey pilot', 'Missing, presumed lost: 6 years', 'File closed by Helion in 9 days']]], shot: 'who' },
      { by: CREW.intel, t: 'Eleven days ago this beacon woke up, keyed to him. Three days later, this one. Then this. Each is a walk from the last. Survey pilots plant beacons as they go, so that somebody can follow. Something wants to be followed.', show: [['site', 'b1', 'BEACON · 11 DAYS', '#9fe8ff'], ['site', 'b2', 'BEACON · 8 DAYS', '#9fe8ff'], ['site', 'b3', 'BEACON · 4 DAYS', '#9fe8ff'], ['route', ['lz', 'b1', 'b2', 'b3'], '#9fe8ff']] },
      { by: CREW.intel, t: 'Each beacon carries a slice of survey log. Park beside one and I can pull it. The trail runs east toward the terminator — where the light stops. I do not know how many more there are. I do not know what is at the end.', show: [['unk', 'b4', 'MORE?'], ['unk', 'ridge', 'END OF TRAIL?']] },
      { t: 'Opposition: none known. There is an Ordo Ferrum party on the surface — pilgrims of some kind. The Ordo does not usually fight over rocks. If anybody else has noticed those beacons, we will find out the usual way.', show: [['unk', [-60, 300], 'ORDO PARTY'], ['card', 'KALDUR SECUNDUS', ['Hard vacuum. One-third gravity: jets go far', 'No weather. No cover either', 'Other parties on the surface: unknown']]] },
      { by: CREW.chief, t: "Mira's never asked this company for a thing, boss. She does my stock-take when I'm behind and thinks I haven't noticed. Whatever she needs.", shot: 'who' },
      { t: 'We go because one of ours asked. Follow the lamps, pull the logs, bring back whatever truth there is. Mira will be on the channel the whole way.', show: [['clear'], ['route', ['lz', 'b1', 'b2', 'b3'], '#9fe8ff'], ['site', 'b1', 'BEACON', '#9fe8ff'], ['site', 'b2', 'BEACON', '#9fe8ff'], ['site', 'b3', 'BEACON', '#9fe8ff'], ['unk', 'ridge', 'END OF TRAIL?']] },
    ],
    async run(ms) {
      const S = ms.S, mira = CREW.intel, ken = STC.ken, lan = STC.lan, abb = STC.abb, cas = STC.cas, xo = ms.ops, hp = { paint: FAC.hel.paint }, B = ['b1', 'b2', 'b3', 'b4'].map((k, i) => { const b = stBeacon(S[k]); if (i) b.userData.beam.visible = false; return b; });
      const logs = ['Survey log, day one hundred and eleven. Kenji Sato, Helion Deep Survey. LANTERN and I have found something under the regolith that reads like ore and rings like a bell. Mira would know what it is. Mira knows everything. Ask her.',
        'Day one-nineteen. Helion has stopped answering my reports and started sending "recovery teams". I do not think it is me they mean to recover. I have told LANTERN: if I ever stop giving orders, walk home. He does not know where that is. I shall have to tell him.',
        'Day one-twenty... something. The suit is holed. I am putting everything into LANTERN\'s core and nothing into me, which Mira will say is typical. Little sister — "lights on". That is the phrase. Say it, and he will know you.'];
      setObj('m', () => `Follow the beacons — ${ms.v.got | 0} logs recovered`); await after(3); chatter(mira, 'I have you on the surface. First beacon is three hundred metres east. ...Thank you for this. I will only say it once.');
      for (let i = 0; i < 4; i++) {
        const k = 'b' + (i + 1); B[i].userData.beam.visible = true; nav('b', S[k], 'BEACON', '#9fe8ff');
        if (i === 1) { /* the Vigil is already there */
          const Vg = [0, 1, 2].map(j => mkMech(...stOff(S.b2, j * TAU / 3 + .4, 30), { ...PRESETS[[1, 0, 5][j]], paint: FAC.ord.paint }, 2, { ai: 'hold', name: j ? 'VIGIL PILGRIM' : 'BROTHER THORNE', yaw: j * TAU / 3 + .4 + PI, hpK: 1.4 })); for (const e of Vg) e.pacify = true; ms.v.Vg = Vg; fieldWho(abb, Vg[0]);
          await until(() => near(S.b2, 120));
          const r = await ask(abb, 'Peace, mercenary. Brother-Mechanic Thorne, of the Vigil. A machine walks this moon with no hand upon it, lighting lamps for the lost. We follow it. We do not interfere. I would ask the same of you.', ['We are looking for its pilot.', 'Whose machine is it?', 'Stay out of my way.'], 20, 0);
          if (r === 2) say(abb, 'As you wish. The Vigil does not stand in roads. It stands beside them.'); else { stSet('vigil', 1); say(abb, r ? 'Nobody\'s. That is the wonder of it. It keeps a standing order from a man six years gone. We find that holy. You may find it only sad. Walk with us.' : 'Then we want the same thing by different names. Walk with us. The lamps go east.'); }
        }
        await stHold('s', S[k], 26, 4, i < 3 ? 'Hold beside the beacon while Mira pulls the log' : 'Hold beside the last beacon'); ms.v.got = i + 1; sfx.play('ok'); B[i].userData.lamp.emissiveIntensity = 1;
        if (i < 3) { look(S[k], 'SURVEY BEACON'); await tell(ken, logs[i]); if (i === 1) chatter(mira, '...That is his voice. I had forgotten that he sounds amused when he is frightened.'); if (i === 2) chatter(mira, '"Lights on." He used to say it when the power failed at home. He was eight. I was five.'); }
      }
      unnav('b'); await tell(mira, 'This one has no log. It has a timestamp. Boss — this beacon was planted eleven hours ago. Whatever is laying them is on the ridge ahead of you. Right now.');
      /* the end of the trail: nobody briefed a machine with no pilot */
      const L = stLantern(S.ridge, { inv: true, halt: true, yaw: stAng(S.ridge, S.b4) }); fieldWho(lan, L); nav('l', L, 'CONTACT', '#9fe8ff'); setObj('m', null, 1); setObj('l', 'Go up to the ridge');
      await until(() => near(S.ridge, 150)); look(L, 'UNKNOWN FRAME');
      await tell(mira, "...That is a Helion survey frame. That is his number on the hull. That's LANTERN. Kenji? KENJI. It's Mira—");
      await tell(lan, 'SURVEY UNIT LANTERN. PILOT: NOT ABOARD. STANDING ORDER: WALK HOME. QUERY: WHERE IS HOME.');
      await tell(mira, 'There is nobody in it. Six years. It has been walking for six years with nobody in it.');
      const [dx, dz] = stOff(S.ridge, stAng(S.ridge, S.b4) + .9, 170); let H = []; dropship(dx, dz, () => { H = hot1(foes(1.1, dx, dz, 4, 30, { ...hp, name: 'HELION RECOVERY' })); for (const e of H) e.focus = PE; });
      await tell(cas, 'Director Castellan, Helion Special Recovery. That frame, and every byte in its core, is Combine property — as is the survey it carries. Stand away from it. I will not ask again; I did not enjoy asking the first time.');
      L.halt = false; L.walk([gpos(820, -560)]); L.gone = true; setObj('l', () => `Drive off Helion's recovery team — ${H.length ? alive(H) : '…'} left`); unnav('l'); nav('l', L, 'LANTERN', '#9fe8ff');
      if (stGet('vigil')) { setTeam(ms.v.Vg, 0, { ai: 'follow', lead: L, pacify: false }); for (const e of ms.v.Vg) { e.pos.x = S.b4.x + rand(-30, 30); e.pos.z = S.b4.z + rand(-30, 30); } chatter(abb, 'The Vigil will stand between. Brothers — lamps up.'); }
      await until(() => H.length); await until(() => !alive(H));
      if (stDist(L.pos, S.ridge) < 170) { const H2 = stFrom(.8, L.pos, stAng(S.ridge, S.b4) - 1.3, 210, { ...hp, name: 'HELION RECOVERY', focus: PE }); H = H.concat(H2); look(H2[0], 'SECOND TEAM'); await tell(cas, 'Second team: you are up. Do try to be less disappointing than the first.'); await until(() => !alive(H)); }
      setObj('l', null, 1); unnav('l');
      await tell(mira, 'It is past the terminator and still walking. I have a bearing and nothing else. It is walking home, and it does not know where home is. ...I do. Come back up, boss. I need to think.');
      extract('LANTERN walked into the dark with Helion\'s recovery team burning behind it. Mira has three logs, a bearing, and her brother\'s last instruction.');
    },
    epi: (ok, f) => ok ? [
      [CREW.intel, 'He recorded those logs knowing who would come looking. "Ask Mira." He always did leave me the hard part. ...It was heading for the old Helion winter camp. I will have a location inside a week.'],
      f['dead.vigil'] ? [STC.abb, 'Thorne, of the Vigil. We saw you stand before the lamp-bearer when the Combine came. The Ordo keeps a ledger of such things. Yours has an entry now.'] : null,
      [CREW.xo, 'Castellan signed the closure on that survey six years ago. She has known what was up there the whole time. Watch your back, and watch Mira\'s.'],
    ] : [[CREW.intel, 'The beacons are still transmitting. It is still out there, putting lamps down for somebody to follow. I would like it to be us. Please.']],
    prize(D, add) { stGift(D, 'gear.sink', 1); repAdd('ord', 3, 'Kaldur Secundus: stood by the lamp-bearer'); },
  }, {
    /* ---------------- II ---------------- */
    title: 'What the Ice Kept', kind: 'recovery', biome: 'glacial', mood: 0, seed: 93023, diff: 3, pay: 110000, salv: 25, site: 'Survey Camp Seven', op: 'COLD CASE',
    tease: 'LANTERN\'s bearing runs to Survey Camp Seven: the place Kenji Sato\'s lance wintered, and the last place Helion admits to having heard from it. The camp has been under ice for six years. Mira intends to read what is left of it herself, in person, on the ground. She is not a pilot and she is not asking permission.',
    wire: 'Mira Sato has requisitioned a tracked survey rig, cold-weather gear and one escort. She has filled in the form herself and approved it.',
    sites: { lz: [-540, -400, 40, 'LZ'], camp: [-130, -110, 64, 'SURVEY CAMP 7'], shaft: [300, 230, 60, 'THE SHAFT'], east: [640, -180, 44, 'EAST MORAINE'] },
    roads: [['lz', 'camp', 'shaft']],
    brf: [
      { t: 'Survey Camp Seven. Mira found it from the bearing LANTERN walked out on. She is going down there in person, in a survey rig, and she has made it clear that this is not up for discussion.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'camp', 'SURVEY CAMP 7', '#9fe8ff'], ['card', 'THE JOB', ['Escort Mira\'s rig to the camp and beyond', 'She reads the site. You keep her alive', 'Helion will object']]] },
      { by: CREW.intel, t: 'Three hab modules, all iced in. Each has a data core. I need a few minutes beside each — the rig does the reading, I do the swearing. Then the trail goes on to here: a survey shaft. LANTERN has been walking to it and back for weeks.', show: [['route', ['lz', 'camp', 'shaft'], '#9fe8ff'], ['site', 'shaft', 'THE SHAFT', '#9fe8ff'], ['card', 'AT THE CAMP', ['Three hab cores to read', 'The rig must be parked beside each', 'Then on to the shaft']]] },
      { by: CREW.intel, t: 'Castellan knows we have the logs. If the camp says what I think it says, she cannot let it be read. I expect a clean-up team, and I expect it by air, from the east, the moment we start pulling data.', show: [['foe', 'east', 'HELION — EXPECTED'], ['route', ['east', 'camp'], '#ff5a3a'], ['face', STC.cas, ['Director, Special Recovery', 'Signed the closure six years ago', 'Does not leave loose ends']]] },
      { t: 'The rig is a tracked box with a heater. It has no armour worth the name. If it stops, Mira stops. Stay close to it.', show: [['card', "MIRA'S RIG", ['Tracked survey crawler, unarmed', 'Follows the marked road', 'Halts when it is being shot at', 'One analyst aboard. Ours']]] },
      { by: CREW.chief, t: "I've welded what plate I had to that rig, and it isn't much. Weather's clear now, boss, but that's a glacier. Clear is what it does just before it isn't.", show: [['unk', 'shaft', 'WHAT IS LANTERN DOING HERE?']] },
      { t: 'Camp, cores, shaft. Bring her back. That is the whole of the brief, and I will hold you to the second sentence.', show: [['clear'], ['route', ['lz', 'camp', 'shaft'], '#9fe8ff'], ['site', 'camp', 'SURVEY CAMP 7', '#9fe8ff'], ['site', 'shaft', 'THE SHAFT', '#9fe8ff'], ['foe', 'east', 'HELION — EXPECTED']] },
    ],
    async run(ms) {
      const S = ms.S, mira = CREW.intel, ken = STC.ken, lan = STC.lan, abb = STC.abb, cas = STC.cas, xo = ms.ops, hp = { paint: FAC.hel.paint, name: 'HELION RECOVERY' };
      const rig = mkTruck(S.lz.x + 26, S.lz.z - 18, 0, stRoad([S.lz, S.camp]).slice(1)); rig.name = "MIRA'S RIG"; rig.hp = rig.max = 1100; rig.halt = true; fieldWho(mira, rig); nav('r', rig, 'MIRA', '#7fe7ff');
      rig.onKill = () => lose('The rig is burning on the ice. Mira got out with frostbite, a cracked data core and nothing she can prove.', .1);
      stTick(() => { if (ms.over || rig.dead) return false; if (!ms.v.park) rig.halt = !near(rig.pos, 150) || FD.t0.some(e => e.team === 1 && e.kind !== 'struct' && stDist(e.pos, rig.pos) < 90); return true; });
      const habs = [0, 1, 2].map(i => mkStruct('hab', ...stOff(S.camp, i * TAU / 3 + .6, 38), 2, { name: `HAB ${'ABC'[i]} · ICED IN`, ry: i * 2.1, hpK: 4 })); for (const h of habs) h.inv = true;
      setObj('m', 'Escort Mira\'s rig to Survey Camp Seven — it waits for you'); await after(3); await tell(mira, 'Rig is rolling. It only goes when you are close — I am brave, not stupid. Stay where I can see you.');
      const pk = foes(.5, ...stOff(S.camp, stAng(S.camp, S.lz), 90), 0, 26, hp);
      (async () => { await after(14); chatter(mira, 'For the record: I have a hundred and forty hours in a simulator and none in anything that can be shot at. If I go quiet I am concentrating. Or dead. Assume concentrating.'); await until(() => stDist(rig.pos, S.camp) < 330 || pk.some(e => e.alert)); hot1(pk); for (const e of pk) e.focus = rig; say(xo, 'Helion pickets, sitting on the camp road. Somebody has been expecting visitors for six years. Clear them before the rig gets there.'); })();
      await until(() => stDist(rig.pos, S.camp) < 70); ms.v.park = true; rig.halt = true; setObj('m', null, 1);
      const found = ['Hab A. Mess log. They were rationing by day one-fourteen: Helion had stopped the supply drops. Not delayed. Stopped.', 'Hab B. Comms. Forty-one distress calls logged as received by the Combine. Forty-one. And a reply, once: "Remain on site. Recovery is scheduled."', 'Hab C. The order itself, countersigned. "Deposit confirmed. Survey team surplus to requirement. Do not recover. — S. Castellan." She wrote it down. They always write it down.'];
      for (let i = 0; i < 3; i++) {
        const h = habs[i]; rig.path = [gpos(...stOff(h.pos, stAng(h.pos, S.camp), 16))]; rig.wp = 0; rig.halt = false; nav('h', h, 'HAB ' + 'ABC'[i], '#9fe8ff'); await until(() => rig.arrived || stDist(rig.pos, h.pos) < 24); rig.halt = true;
        if (i === 1) { const st = EV.B.storm; weatherShift(st[1], st[2], st[3], 14); chatter(xo, 'Weather is closing in on you, and I have a heavy lifter on the eastern scope under it. Castellan is early.'); }
        if (i === 2) { const [x, z] = stOff(S.camp, stAng(S.camp, S.east), 130); look(null); dropship(x, z, () => { const W = hot1(foes(1, x, z, 4, 30, hp)); for (const e of W) e.focus = rig; ms.v.W1 = W; }, stAng(S.camp, S.east)); say(xo, 'Helion clean-up team inbound from the east moraine. They are not here to read the cores, they are here to slag them. Keep them off the rig.'); }
        await stHold('s', h.pos, 60, i === 2 ? 30 : 9, `Cover the rig while Mira reads Hab ${'ABC'[i]}`); await tell(mira, found[i]);
      }
      unnav('h'); if (ms.v.W1) await until(() => !alive(ms.v.W1));
      /* the shaft */
      rig.path = stRoad([rig.pos, S.shaft]).slice(0, -1); rig.wp = 0; ms.v.park = false; setObj('m', 'Escort the rig to the shaft');
      (async () => { await until(() => stDist(rig.pos, S.camp) > 200); const A = stFrom(.8, rig.pos, stAng(S.camp, S.shaft) + 1.2, 190, { ...hp, focus: rig }); look(A[0], 'OUT OF THE WHITEOUT'); say(xo, 'Contacts in the whiteout, on the rig\'s left! They let you leave the camp so they could do this in the open.'); await until(() => !alive(A)); chatter(mira, 'I am fine. I have my eyes shut, but I am fine. Is it always like this? Do not answer that.'); })(); const ring = [0, 1, 2, 3, 4, 5, 6].map(i => stBeacon(gpos(...stOff(S.shaft, i * TAU / 7, 30)), 0x9fe8ff)), L = stLantern(gpos(...stOff(S.shaft, 2.2, 14)), { inv: true, halt: true, yaw: 2.2 + PI }); fieldWho(lan, L);
      await until(() => stDist(rig.pos, S.shaft) < 80 && near(S.shaft, 130)); ms.v.park = true; rig.halt = true; setObj('m', null, 1); look(L, 'LANTERN');
      await tell(mira, 'Seven lamps in a ring, round a shaft somebody filled in by hand. It has been carrying beacons here. One at a time. For weeks.');
      await tell(lan, 'SURVEY UNIT LANTERN. CREW: ACCOUNTED FOR. FOUR OF FOUR. PILOT: ACCOUNTED FOR. SITE MARKED. STANDING ORDER RESUMES: WALK HOME.');
      await tell(mira, '...He is down there. All of them are. A machine with nobody in it dug them a grave and has been lighting it ever since.');
      const C = stBig(mkMech(...stOff(S.shaft, stAng(S.shaft, S.east), 210), { ...PRESETS[2], paint: FAC.hel.paint }, 1, { name: 'DIRECTOR CASTELLAN', hpK: 2.6, skill: 1.4 }), 1.2); C.alert = true; fieldWho(cas, C); const E = hot1(foes(.9, C.pos.x, C.pos.z, 10, 50, hp)); nav('c', C, 'CASTELLAN', '#ff5a3a'); look(C, 'DIRECTOR CASTELLAN');
      await tell(cas, 'Miss Sato. You have read my signature, so we need not pretend. The frame carries the only complete survey of that deposit. I am taking it. You may keep the grave.');
      const r = await ask(mira, 'Boss — it will not listen to me. It is going to walk straight past her guns. What do I say to it?', ['Tell it: "Lights on."', 'Order it to follow the rig.', 'Tell it to run.'], 20, 0);
      if (r === 0) { stSet('lights', 1); await tell(mira, 'LANTERN. Lights on.'); await tell(lan, 'VOICE MATCH: SATO, M. — NEXT OF KIN. STANDING ORDER AMENDED: WALK HOME, WITH ESCORT. HELLO, MIRA.'); chatter(mira, 'Oh, you — you stupid, faithful — yes. Hello.'); }
      else say(lan, r === 1 ? 'COMMAND NOT RECOGNISED. PILOT VOICE REQUIRED. STANDING ORDER: WALK HOME.' : 'COMMAND NOT RECOGNISED. UNIT DOES NOT RUN. UNIT WALKS.');
      L.halt = false; L.walk([gpos(-900, 500)]); setObj('c', () => `Break Castellan's recovery team — ${alive([C, ...E])} left`);
      await until(() => C.dead || C.hp < C.max * .4); if (!C.dead) { C.inv = true; leave([C]); unnav('c'); await tell(cas, 'I am not being paid to die for a tractor. This is adjourned, not concluded. The Combine has a long memory and so do I.'); }
      await until(() => !alive(E)); setObj('c', "Castellan's recovery team is broken", 1); L.gone = true; rig.path = stRoad([rig.pos, S.camp, S.lz]); rig.wp = 0; ms.v.park = false;
      await tell(mira, 'I have the order with her name on it, and I have a grave to tell four families about. And he is walking again. West. Boss... I think I know where "home" is. Get me back up and I will show you.');
      extract('Mira read Survey Camp Seven and found the order that left four people on the ice. LANTERN has marked their grave and walked on.');
    },
    epi: (ok, f) => ok ? [
      [CREW.intel, f['dead.lights'] ? 'It said hello. A survey autopilot, six years without a pilot, and it said hello to me by name. Kenji must have taught it that. He would have thought it was funny.' : 'It would not answer to me. It only knows his voice — or a phrase I should have tried. Next time I will know what to say to it.'],
      [CREW.intel, 'It is walking west by dead reckoning, and I have plotted the line. Boss, the line ends here. The yard. This was our family\'s ground before it was the company\'s. He told it where home was. It is coming here.'],
      [CREW.chief, "Then it's walking nine hundred kilometres on a six-year-old reactor, with half of Helion after it. I'll clear a bay. Somebody tell me what size feet."],
    ] : [[CREW.intel, 'I got out with one core and it is cracked. The camp is still there, and so is she. We go back before she has time to slag it. Please.']],
    prize(D, add) { stGift(D, 'gear.kit', 1); add('Ordo Ferrum, offering for the dead of Camp Seven', 14000); repAdd('hel', -5, 'read what Survey Camp Seven had to say'); },
  }, {
    /* ---------------- III ---------------- */
    title: 'The Long Walk', kind: 'escort', biome: 'forest', mood: 0, seed: 93041, diff: 3, pay: 130000, salv: 30, site: 'Ashbrook Forest', op: 'WAY HOME',
    tease: 'LANTERN has come down off the ice and is walking west through Ashbrook Forest at the pace of something with nowhere else to be. It will not stop, it will not fight, and it will not go round anything. Helion wants the survey in its core and will take the frame apart to get it. Mira wants it to arrive. Walk beside it.',
    wire: 'Loggers in Ashbrook report a white machine walking through the forest at night with a lamp on its head, followed by monks. Mira says: that is him.',
    sites: { lz: [-600, 520, 40, 'LZ'], start: [-640, 380, 46, 'WHERE IT IS'], brook: [-220, 130, 52, 'ASH BROOK'], mill: [210, -150, 54, 'THE OLD MILL'], road: [600, -450, 62, 'THE WEST ROAD'] },
    roads: [['start', 'brook', 'mill', 'road']],
    brf: [
      { t: 'LANTERN is in Ashbrook Forest, walking west. Our job is the simplest we have ever been given: walk next to it until it gets where it is going.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'start', 'LANTERN', '#9fe8ff'], ['card', 'THE JOB', ['Escort LANTERN across Ashbrook Forest', 'It walks. It does not stop, fight or dodge', 'Half the pace of a crewed machine']]] },
      { by: CREW.intel, t: 'It is running dead reckoning: one bearing, held for six years. It will cross the brook, pass the old mill and pick up the west road. Fifteen hundred metres. It will not go round an obstacle — it will stop and ask its pilot what to do. It has no pilot.', show: [['route', ['start', 'brook', 'mill', 'road'], '#9fe8ff'], ['site', 'road', 'THE WEST ROAD', '#8dff6a'], ['unk', 'brook', 'IT MAY STOP HERE']] },
      { by: CREW.intel, t: 'Castellan wants the core intact, so her teams will shoot for the legs. They know the route as well as we do — there is only one. I would expect them wherever the trees open up.', show: [['foe', [-320, -60], 'HELION — LIKELY'], ['foe', [330, 60], 'HELION — LIKELY'], ['ring', 'mill', 170, 'OPEN GROUND']] },
      { t: 'The Ordo\'s Vigil is walking with it. Brother Thorne has twelve hundred years of doctrine about not interfering and has, I understand, decided to interfere. They are devout. They are not soldiers.', show: [['ally', [-600, 330], 'THE VIGIL'], ['face', STC.abb, ['Brother-Mechanic, Ordo Ferrum', 'Keeper of the Vigil', 'Believes the machine is keeping a vow']]] },
      { by: CREW.chief, t: "Its reactor's at eleven percent, boss, by Mira's numbers. Every hit it takes, that drops. Get it home with something left and I'll do the rest.", show: [['card', 'LANTERN', ['Helion survey frame, 6 years unattended', 'Unarmed since it buried its guns', 'Takes punishment. Not unlimited', 'Answers only to a Sato']]] },
      { t: 'Walk it to the west road. Whatever Helion puts in the way, remove it. It has come nine hundred kilometres on its own. It can have company for the last stretch.', show: [['clear'], ['route', ['start', 'brook', 'mill', 'road'], '#9fe8ff'], ['site', 'start', 'LANTERN', '#9fe8ff'], ['site', 'road', 'THE WEST ROAD', '#8dff6a']] },
    ],
    async run(ms) {
      const S = ms.S, mira = CREW.intel, lan = STC.lan, abb = STC.abb, cas = STC.cas, xo = ms.ops, hp = { paint: FAC.hel.paint, name: 'HELION RECOVERY' }, L = stLantern(S.start, { team: 0, hpK: 6, halt: true, yaw: stAng(S.start, S.brook) }); fieldWho(lan, L);
      L.onKill = () => lose('LANTERN is down in the bracken with its lamp out, and a Helion lifter is already overhead. Nine hundred kilometres, and it fell short by one forest.', .1);
      const Vg = [0, 1].map(j => mkMech(...stOff(S.start, 2 + j, 26), { ...PRESETS[j ? 0 : 1], paint: FAC.ord.paint }, 0, { ai: 'follow', lead: L, name: j ? 'VIGIL PILGRIM' : 'BROTHER THORNE', hpK: 1.5, skill: .9 })); fieldWho(abb, Vg[0]);
      nav('l', L, 'LANTERN', '#9fe8ff'); setObj('m', 'Join LANTERN'); await until(() => near(L.pos, 110));
      await tell(lan, stFlag('dead.lights') ? 'ESCORT DETECTED. GOOD MORNING, MIRA. BEARING TWO-SIX-ONE. WALKING.' : 'UNKNOWN UNITS IN PROXIMITY. NO PILOT ABOARD TO ASSESS. BEARING TWO-SIX-ONE. WALKING.');
      chatter(abb, 'Mercenary. The Vigil has decided that walking beside is not the same as interfering. We have argued about it all night. Lamps up, brothers.');
      L.halt = false; L.walk([S.brook, S.mill, S.road]); setObj('m', () => `Walk LANTERN to the west road — ${Math.round(stDist(L.pos, S.road) / 10) * 10} m · frame ${Math.round(L.hp / L.max * 100)}%`);
      const tend = line => { if (L.dead || !alive(Vg)) return; L.hp = Math.min(L.max, L.hp + L.max * .3); msg('THE VIGIL PATCHES LANTERN — FRAME +30%', 3); sfx.play('weld'); chatter(abb, line); };
      const hit = (k, a, o) => { const W = stFrom(k, L.pos, a, 230, { ...hp, focus: L, ...o }); look(W[0], 'HELION RECOVERY'); msg('HELION — SHOOTING FOR THE LEGS', 3); sfx.play('alarm'); return W; };
      await until(() => stDist(L.pos, S.start) > 150); let W = hit(.8, stAng(S.start, S.brook) - 1.2); say(xo, 'Helion, out of the trees on your right. They are going for its legs. It will not turn to face them, so you will have to.');
      /* Ash Brook: it stops, because there is water and nobody to ask */
      await until(() => L.past(S.brook) || stDist(L.pos, S.brook) < 26); L.halt = true;
      await tell(lan, 'OBSTACLE: WATER. DEPTH UNKNOWN. PILOT ADVICE REQUIRED. ...PILOT ADVICE REQUIRED.');
      if (stFlag('dead.lights')) { await tell(mira, 'Lights on, LANTERN. It is a brook. He walked you through a hundred like it. Go on.'); await tell(lan, 'ADVICE ACCEPTED. PILOT WAS ALWAYS RIGHT ABOUT BROOKS.'); }
      else {
        const r = await ask(mira, 'It has stopped. It wants its pilot to tell it the brook is safe, and it will stand there until Helion takes it apart. Boss — ideas?', ['Mira: use the phrase from the third beacon.', 'I will wade it first. Let it watch.', 'Give it the depth and wait.'], 22, 0);
        if (r === 0) { stSet('lights', 1); await tell(mira, '"Lights on." ...LANTERN. Lights on.'); await tell(lan, 'VOICE MATCH: SATO, M. — NEXT OF KIN. HELLO, MIRA. ADVICE ACCEPTED.'); }
        else if (r === 1) { const far = gpos(...stOff(S.brook, stAng(S.brook, S.mill), 70)); nav('w', far, 'FAR BANK', '#9fe8ff'); setObj('w', 'Cross the brook where LANTERN can see you'); W = W.concat(hit(.6, stAng(S.brook, S.mill) + 1)); await until(() => near(far, 26)); unnav('w'); setObj('w', null, 1); await tell(lan, 'ESCORT HAS CROSSED. DEPTH INFERRED. PROCEEDING.'); }
        else { W = W.concat(hit(.8, stAng(S.brook, S.mill) + 1)); await after(40); await tell(lan, 'ADVICE LOGGED. CONFIDENCE LOW. NO BETTER ADVICE RECEIVED. PROCEEDING.'); }
      }
      L.halt = false; tend('Hold him steady, brothers. Weld what will weld. Pray over the rest.');
      /* the mill: open ground, and something nobody briefed */
      await until(() => L.past(S.mill) || stDist(L.pos, S.mill) < 30); L.halt = true; const Wn = stLifter(L); look(Wn[0], 'HELION HEAVY LIFTER'); sfx.play('ship');
      await tell(xo, 'Heavy lifter, directly over it! They have tethers on the frame — they are going to carry it out whole. Two winch drones, one each side. Shoot them off it!');
      chatter(lan, 'UNIT RESTRAINED. UNIT IS NOT WALKING. THIS IS CONTRARY TO STANDING ORDERS.'); const t0 = ms.t + 55; setObj('g', () => `Shoot the winches off LANTERN — ${alive(Wn)} holding · ${secs(t0)}`); W = W.concat(hit(.7, stAng(S.mill, S.road) - .8, { focus: PE }));
      (async () => { await until(() => ms.t >= t0 && alive(Wn) > 0); lose('The lifter took LANTERN straight up through the canopy with its legs still walking. Helion has the core. Mira watched it go.', .1); })();
      await until(() => !alive(Wn)); setObj('g', null, 1); L.halt = false; await tell(lan, 'RESTRAINT REMOVED. RESUMING. NOTE FOR PILOT: UNIT DID NOT ENJOY THAT.'); tend('Brothers! While he is standing still — every torch we have.');
      await until(() => stDist(L.pos, S.mill) > 150); hit(1, stAng(S.mill, S.road) + .5); chatter(cas, 'You are spending a great deal of ammunition on a dead man\'s errand. I do hope she is paying you.');
      await until(() => L.done || stDist(L.pos, S.road) < 30); L.halt = true;
      await tell(mira, 'The west road. I know this road. I learned to drive on this road. Boss, he is two days\' walk from the yard and he is not going to stop. Neither is she. Let\'s go home and get ready.');
      win('LANTERN crossed Ashbrook Forest on its own bearing, with a mercenary on one side and a line of monks on the other.');
    },
    epi: (ok, f) => ok ? [
      [STC.abb, 'The Vigil will walk the last of it with him, and stand where he stops. We have never before known where a pilgrimage ended. Forgive us if we are a little giddy.'],
      [CREW.intel, 'Castellan cannot let it reach us. Once it is in our yard the survey is in a neutral company\'s hands with her signature attached. She will come here, with everything. I am sorry, boss. I have brought this to your door.'],
      [CREW.xo, 'She has not brought anything to our door. It was always our door. I have recalled everybody. Rook and Anvil are aboard. We will be ready.'],
    ] : [[CREW.intel, 'They have it in a holding yard two valleys over, and it is still trying to walk. I can hear it on his channel. We get it back. Tell me we get it back.']],
    prize(D, add) { stGift(D, 'gear.cool', 1); add('Ordo Ferrum, pilgrims\' purse', 16000); repAdd('ord', 4, 'walked with the Vigil through Ashbrook'); },
  }, {
    /* ---------------- IV ---------------- */
    title: 'Lights On', kind: 'garrison', biome: 'desert', mood: 0, tod: 'night', seed: 41, diff: 4, pay: 160000, salv: 40, site: 'the Yard', op: 'PORCH LIGHT', home: true,
    tease: 'LANTERN is one morning\'s walk from the yard: the ground Kenji Sato told it was home. Director Castellan cannot allow it to arrive, and has stopped pretending this is a recovery. Everything Helion Special Recovery owns is coming over the hills at first light. We will be fighting on our own apron, in front of our own hangar, for a machine with nobody in it. The XO has not asked whether we want to.',
    wire: 'Helion Special Recovery has filed a flight plan that ends at our front gate. Commander Varga has recalled all hands.',
    sites: { lz: [0, 22, 0, ''], home: [40, -250, 0, 'THE OLD HOUSE'], north: [70, -770, 0, 'NORTH FLATS'], east: [740, -120, 0, 'EAST RIDGE'], west: [-720, -40, 0, 'WEST WASH'], yard: [0, 30, 0, 'THE YARD'] },
    face: 'home', guests: [STC.abb],
    brf: [
      { t: 'Look at the map. You know this ground. That is our apron, our hangar, our fuel. At first light Helion Special Recovery is coming to it, and we are going to be standing on it.', show: [['site', 'yard', 'THE YARD', '#ffb21a'], ['card', 'THE JOB', ['Defend the yard', 'LANTERN arrives from the north at dawn', 'Castellan arrives from everywhere else']]] },
      { by: CREW.intel, t: 'He is walking in from the north flats. His bearing ends here: the ruins out past the comm array. That was our house. He will walk to it and stop, because that is the whole of his order, and then he will be standing in the open with eleven percent in his reactor.', show: [['route', ['north', 'home'], '#9fe8ff'], ['site', 'home', 'THE OLD HOUSE', '#9fe8ff'], ['ally', 'north', 'LANTERN']] },
      { t: 'Castellan has three axes and the lift to use all of them. East ridge, the west wash, and whatever she drops on our heads. Four waves by my count. She will come in person at the end; people like her need to see it done.', show: [['foe', 'east', 'HELION — EAST'], ['foe', 'west', 'HELION — WEST'], ['route', ['east', 'yard'], '#ff5a3a'], ['route', ['west', 'yard'], '#ff5a3a'], ['unk', [0, -420], 'AIR ASSAULT?']] },
      { t: 'We are not alone. Rook and Anvil launch with you. Dutch has the bay crews standing by to patch you on the apron between waves. And Brother Thorne has brought the Vigil — all of it.', show: [['ally', 'yard', 'ROOK · ANVIL · BAY CREWS'], ['ally', 'home', 'THE VIGIL'], ['card', 'ON OUR SIDE', ['Rook and Anvil, on your wing', 'Bay crews: armour patched between waves', 'The Vigil: nine machines and a great deal of faith', 'Home ground']]] },
      { by: STC.abb, t: 'The Ordo has followed that lamp across a moon, a glacier and a forest. We are not soldiers, Commander. But we are very difficult to move.', shot: 'who' },
      { by: CREW.chief, t: "This is my yard. Nobody shoots up my yard. Boss — you come back to the apron when you're hurting and I will have you turned round in thirty seconds. That's a promise.", shot: 'who' },
      { by: CREW.intel, t: 'I do not know what happens when he gets there. An order six years old is complete, and nobody has written the next one. I will be on the apron. I am not staying in the building for this.', show: [['unk', 'home', 'AND THEN?']] },
      { t: 'It is our ground and they are our people. Hold the yard until that machine is home. After that — we will see what the day asks of us.', show: [['clear'], ['site', 'yard', 'THE YARD', '#ffb21a'], ['site', 'home', 'THE OLD HOUSE', '#9fe8ff'], ['route', ['north', 'home'], '#9fe8ff'], ['foe', 'east', 'HELION'], ['foe', 'west', 'HELION']] },
    ],
    async run(ms) {
      const S = ms.S, mira = CREW.intel, lan = STC.lan, abb = STC.abb, cas = STC.cas, xo = ms.ops, dutch = CREW.chief, hp = { paint: FAC.hel.paint, name: 'HELION RECOVERY' }, apron = gpos(0, 20);
      const L = stLantern(S.north, { team: 0, hpK: 7, yaw: stAng(S.north, S.home) }); fieldWho(lan, L); L.hp = L.max * .7; L.pace = .24; L.walk([S.home]);   /* he has been walking for six years and is very nearly out of reactor: the last half kilometre takes him most of the battle */ nav('l', L, 'LANTERN', '#9fe8ff');
      L.onKill = () => lose('LANTERN fell on the north flats, in sight of the house. Helion took the core off the wreck while the yard was still burning.', .1);
      const wing = PILOTS.map((p, i) => { const e = mkMech(P.pos.x + (i ? -16 : 16), P.pos.z + 12, { ...PRESETS[p.mech], paint: player.cfg.paint }, 0, { ai: 'follow', lead: PE, name: p.ch.name, skill: 1.3, hpK: 1.8, yaw: P.yaw }); fieldWho(p.ch, e); return e; });
      const Vg = [0, 1, 2, 3].map(j => mkMech(...stOff(S.home, j * TAU / 4, 34), { ...PRESETS[[1, 0, 5, 3][j]], paint: FAC.ord.paint }, 0, { ai: 'guard', name: j ? 'VIGIL PILGRIM' : 'BROTHER THORNE', hpK: 1.5, skill: .9 })); fieldWho(abb, Vg[0]);
      const pads = stTick(() => { if (ms.over) return false; if (near(apron, 34) && !P.dead && P.armor < P.max * .97 && (ms.v.mendT || 0) < ms.t) { ms.v.mendT = ms.t + 24; stMend(.45, 'BAY CREWS ARE ON YOU — ARMOUR PATCHED'); chatter(dutch, pick(['Hold still. HOLD STILL. ...Done. Go.', 'Thirty seconds, like I said. Twenty-eight. Go on.', "That's my weld. It'll outlast the rest of you. Go!"])); } return true; });
      const wave = (n, k, from, o = {}) => { const W = stFrom(k, S[from], stAng(S[from], S.yard), 40, { ...hp, focus: n % 2 ? L : null, ...o }); look(W[0], `HELION — WAVE ${n}`); msg(`WAVE ${n} — ${from.toUpperCase()}`, 3); sfx.play('alarm'); return W; };
      setObj('m', () => `Hold the yard until LANTERN is home — ${Math.round(stDist(L.pos, S.home) / 10) * 10} m · frame ${Math.round(L.hp / L.max * 100)}%`); setObj('d', 'Return to the apron when damaged — Dutch will patch you', 0, true);
      applyAtmo(1.5, .8, null); weatherShift(1, 1, null, 140); todShift('dawn', 250);   /* it starts before sunrise, and the sun comes up on it */
      await after(3); chatter(PILOTS[0].ch, "Rook, on your wing. For the record, boss, I'd have done this one for free. Don't tell Varga."); await after(4);
      let W = wave(1, 1, 'east'); await tell(xo, 'First wave, east ridge. This is our ground and I want it to cost them. All units: weapons free.');
      await until(() => alive(W) <= 1); W = W.concat(wave(2, 1.1, 'west')); chatter(PILOTS[1].ch, 'Anvil. West wash. I see them. They are walking over where I park.');
      await until(() => alive(W) <= 1); const [ax, az] = [S.yard.x + 60, S.yard.z - 190]; dropship(ax, az, () => { const A = hot1(foes(1, ax, az, 4, 30, hp)); for (const e of A) e.focus = L; W.push(...A); }); say(xo, 'Air assault — dropship coming in over the comm array, right on top of the old house. That is wave three, and it is for LANTERN.'); msg('WAVE 3 — FROM THE AIR', 3);
      await after(9); await until(() => alive(W) <= 1 && (L.done || stDist(L.pos, S.home) < 40));
      L.halt = true; look(L, 'LANTERN'); await tell(lan, 'HOME: REACHED. STANDING ORDER: COMPLETE. ELAPSED: SIX YEARS, FORTY DAYS. AWAITING PILOT.');
      await tell(mira, 'He is standing in what was the kitchen. Boss, I am going out to him. Do not argue; Varga already has.');
      /* the last wave: she comes herself */
      const C = stBig(mkMech(...stOff(S.east, 0, 20), { ...RIV.cob.roster[3], paint: FAC.hel.paint }, 1, { name: 'DIRECTOR CASTELLAN', hpK: 3.4, skill: 1.5 }), 1.3); C.alert = true; C.focus = L; fieldWho(cas, C); W = [C, ...wave(4, 1.3, 'east', { focus: L }), ...stFrom(.8, S.west, stAng(S.west, S.yard), 40, { ...hp, focus: L })]; nav('c', C, 'CASTELLAN', '#ff5a3a');
      await tell(cas, 'A dead man\'s tractor, a clerk and a yard full of mechanics. I have closed larger files than this before breakfast. Recovery teams: the frame intact, everything else at your discretion.');
      setObj('c', () => `Break the last wave — ${alive(W)} left`); await until(() => C.dead || C.hp < C.max * .3);
      if (!C.dead) { C.inv = true; C.pacify = true; C.ai = 'hold'; await tell(cas, '...Recovery teams, stand down. Miss Sato: you have my signature and now you have the survey beside it. I know when a file is closed. I have closed enough of them.'); leave(W.filter(e => !e.dead)); }
      await until(() => !FD.ents.some(e => e.team === 1 && e.kind !== 'struct')); setObj('c', 'The last wave is broken', 1); unnav('c'); setObj('m', null, 1); setObj('d', null, 3);
      await tell(lan, 'REACTOR: FOUR PERCENT. PILOT NOT ABOARD. NEXT OF KIN PRESENT. QUERY: STANDING ORDERS?');
      const r = await ask(mira, 'He is asking for orders, and I — I cannot. Six years I have wanted to tell him something and now I cannot say it. Boss. You do it. Please.', ['"Lights off, LANTERN. You are home. Rest."', '"New standing order: keep the lamp lit. Guard this yard."'], 30, 0);
      stSet('end', r + 1);
      if (r === 0) { await tell(lan, 'ORDER ACCEPTED. LIGHTS OFF. ...GOOD NIGHT, MIRA.'); L.lamp.emissiveIntensity = .3; chatter(abb, 'The vow is kept. The Vigil is ended. Brothers — lamps down.'); }
      else { await tell(lan, 'ORDER ACCEPTED. STANDING ORDER: KEEP THE LAMP LIT. GUARD THIS YARD. ...GOOD MORNING, MIRA.'); stShow(L.pos, 4, 40); chatter(abb, 'A new vow! We shall need a new liturgy. We shall need rather a lot of paper.'); }
      await after(3); win(r ? 'LANTERN walked home, and was given a new order. It stands at the edge of the yard with its lamp lit, and it does not sleep.' : 'LANTERN walked home, and was told it could rest. Its lamp is out. It stands in the ruins of the house, facing the door.');
    },
    epi: (ok, f) => ok ? [
      [CREW.intel, f['dead.end'] === 2 ? 'He is out by the fence with the lamp on. Dutch has run him a power line. I take my coffee out there in the mornings. I tell him what is on the board. He has opinions about bearings.' : 'I sat with him until the lamp went out. Then I sat a while longer. Kenji is buried on a glacier and his machine is home, and I find that is nearly the right way round.'],
      [STC.abb, f['dead.end'] === 2 ? 'The Ordo has recognised your yard as a shrine with a living sentinel. You will receive pilgrims. They are quiet, they tip the bay crews, and they will not touch anything.' : 'The Ordo has recognised your yard as a place of rest. We will send one brother, once a year, to trim a lamp that is not lit. Thank you for letting him stop.'],
      [CREW.intel, 'I have sent the survey and Castellan\'s order to all four families and every news desk in the sector. And boss — my rates to this company. Halved, as of today. Do not make me explain it.'],
    ] : [[CREW.xo, 'They have withdrawn to regroup and so have we. It is still out there on the north flats, still walking. We go again at first light. Nobody takes this yard.']],
    prize(D, add) { stGift(D, 'gear.core', 1); stGift(D, 'arm.las', 1); add('Ordo Ferrum, founding gift for the shrine', 40000); repAdd('ord', 8, 'saw the lamp-bearer home'); repAdd('hel', -10, 'the Sato survey: published, with signatures'); },
  }],
};

