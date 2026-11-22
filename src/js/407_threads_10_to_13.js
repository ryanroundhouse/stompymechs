/* ============ STORY THREADS 10 TO 13 — COLD CHAIN, SLINGSHOT, THE DROWNED STAIR AND THE SATO FILE: THE FOUR THAT COME IN WHEN THE IRON DERBY OR DEAD RECKONING IS CLOSED ============ */
/* THE IRON DERBY opens COLD CHAIN and SLINGSHOT, DEAD RECKONING opens THE DROWNED STAIR and THE SATO FILE. What each is built round: a cargo that spoils if the machine runs hot, a gun the size
   of a railway that somebody else is aiming, a door that opens to whoever does not shoot, and a city to be crossed without being noticed */
Object.assign(STC, {
  bapt: { name: 'Dr. Nkechi Baptiste', first: 'Nkechi', last: 'Baptiste', role: 'HELION RELIEF · FIELD MEDICINE', seed: 9441, col: '#9fe8ff' },
  mott: { name: 'Silas "Coldhand" Mott', first: 'Silas', last: 'Mott', role: 'RED MAW · PHARMACEUTICALS', seed: 9443, col: '#ff5a3a' },
  gran: { name: 'Marit "Gran" Solheim', first: 'Marit', last: 'Solheim', role: 'KEPLER RAIL CO-OPERATIVE · BREECH BOSS', seed: 9451, col: '#ffd98a' },
  land: { name: 'Ysolde "the Landlady" Marrable', first: 'Ysolde', last: 'Marrable', role: 'RED MAW · THE CARRIER RENT DAY', seed: 9453, col: '#ff5a3a' },
  ione: { name: 'Sister-Cartographer Ione Vasquez', first: 'Ione', last: 'Vasquez', role: 'ORDO FERRUM · THE MAP ROOM', seed: 9461, col: '#b9a5ff' },
  door: { name: 'THE DOORKEEPER', first: 'Doorkeeper', last: 'Doorkeeper', role: 'MAKER UNKNOWN · STILL ON WATCH', seed: 9463, col: '#ffe9a0' },
  rask: { name: 'Col. Dmitri Raskova', first: 'Dmitri', last: 'Raskova', role: 'KARSK DIRECTORATE · ACQUISITIONS', seed: 9465, col: '#ff6a4a' },
  pryce: { name: 'Desmond "Uncle" Pryce', first: 'Desmond', last: 'Pryce', role: 'HELION SECTION NINE · RETIRED, HE SAYS', seed: 9471, col: '#c8c8d8' },
  vdm: { name: 'Madame Oriel Vandermeer', first: 'Oriel', last: 'Vandermeer', role: 'VANCE-OKORO · PRIVATE INTELLIGENCE', seed: 9473, col: '#ffb21a' },
});
Object.assign(CAST, {
  9441: { build: 'lean', h: 1.76, habit: 'cross', ...stLook('#1b1b1b', 0, 'glasses', '#5a3825') }, 9443: { build: 'slim', h: 1.82, habit: 'back', ...stLook('#e8e8e8', 1, 'scar', '#f1c9a5') },
  9451: { build: 'broad', h: 1.6, habit: 'hips', ...stLook('#e8e8e8', 3, '', '#ffdbac') }, 9453: { build: 'heavy', h: 1.7, habit: 'hips', ...stLook('#7a1e1e', 1, '', '#e0ac69') },
  9461: { build: 'slim', h: 1.68, habit: 'stand', ...stLook('#3b2416', 2, 'glasses', '#c68642') }, 9463: { bot: true }, 9465: { build: 'broad', h: 1.84, habit: 'back', ...stLook('#b8b8b8', 0, 'beard', '#ffdbac') },
  9471: { build: 'avg', h: 1.74, habit: 'back', ...stLook('#b8b8b8', 1, 'glasses', '#f1c9a5') }, 9473: { build: 'slim', h: 1.72, habit: 'cross', ...stLook('#c9a24a', 3, '', '#ffdbac') },
});
Object.assign(VOX_CAST, {
  bapt: { f0: 186, tr: 1.03, rate: 5.6, range: 3.6, brass: .2, breath: .1, crisp: 1.25, stac: .4, tilt: 3000, lilt: .5, ph: ['kkttbbddnm.', 'aaeeiO', '....ntk'], emo: ['hm', 'sigh'], emoP: .1 },                       /* Dr. Baptiste: forty hours awake and no patience left for anything that is not a patient */
  mott: { f0: 112, tr: .94, rate: 3.9, range: 2.6, brass: .3, breath: .4, rough: .2, crisp: .9, tilt: 2600, lilt: .5, dip: .2, ph: ['sshfllmmnv.', 'iiuuEq', '....mln'], emo: ['hm', 'ah'], emoP: .12 },                  /* Coldhand Mott: quiet, and sells by the dose */
  gran: { f0: 168, tr: 1, rate: 4.2, range: 6.5, brass: .4, rough: .5, vib: .02, crisp: .9, tilt: 2400, lilt: 1.1, dip: .35, ph: ['hhbbggddrm.', 'aaooUE', '....rnm'], emo: ['ha', 'hm', 'grunt'], emoP: .25 },             /* Gran Solheim: has shouted over a mass driver for fifty years */
  land: { f0: 150, tr: .98, rate: 4.8, range: 8, brass: .36, nas: .5, rough: .3, crisp: 1.05, tilt: 2700, lilt: 1.5, dip: .4, ph: ['llddbbmmwy.', 'aaooeeI', '.....lnz'], emo: ['oh', 'ha', 'ah'], emoP: .3 },             /* the Landlady: ever so sorry, dear, but it is the first of the month */
  ione: { f0: 214, tr: 1.1, rate: 5.2, range: 5.5, brass: .06, breath: .35, crisp: 1.2, tilt: 3300, lilt: 1.1, dip: .2, ph: ['llnnmmvvss.', 'iieeaaq', '.....nls'], emo: ['oh', 'hm', 'ah'], emoP: .25 },                 /* Sister Ione: whispers in libraries and has not noticed she is not in one */
  door: { f0: 58, tr: .78, rate: 2.4, range: .5, brass: .9, rough: .6, crisp: .4, stac: .9, tilt: 1300, lilt: 0, dip: 0, ph: ['ddggbbmm.', 'ooUUuO', '...mmng'], emo: ['hm'], emoP: 0 },                                   /* THE DOORKEEPER: a bell at the bottom of a well */
  rask: { f0: 98, tr: .88, rate: 4.6, range: 3.2, brass: .5, rough: .35, crisp: 1.1, stac: .55, tilt: 2400, lilt: .4, ph: ['ggddkkrrvz.', 'aaoOuE', '....rkx'], emo: ['hm', 'grunt'], emoP: .08 },                       /* Col. Raskova: signs for things */
  pryce: { f0: 124, tr: .96, rate: 4.4, range: 5, brass: .22, breath: .25, crisp: 1.15, tilt: 2800, lilt: 1, dip: .3, ph: ['mmllwwddbb.', 'aaeeoOq', '.....lnm'], emo: ['ah', 'hm', 'ha', 'sigh'], emoP: .3 },             /* Uncle Pryce: fond of you, and it is nothing personal */
  vdm: { f0: 196, tr: 1.04, rate: 5, range: 3, brass: .12, nas: .3, crisp: 1.4, stac: .35, tilt: 3200, lilt: .6, ph: ['vvddllssnz.', 'eeiiaO', '....nts'], emo: ['hm', 'ah'], emoP: .06 },                                /* Madame Vandermeer: has already paid, and would like that understood */
});
Object.assign(VOX_WHO, { 9441: 'bapt', 9443: 'mott', 9451: 'gran', 9453: 'land', 9461: 'ione', 9463: 'door', 9465: 'rask', 9471: 'pryce', 9473: 'vdm' });

/* ---- COLD CHAIN: the case rides on the machine's own cooling loop. Over 45 heat it warms, faster the hotter she runs; under 30 it chills again. v.temp is how warm it is (100 and the batch is
   spoiled: lost() is told), v.load whether there is anything left in it to spoil. What it returns is the HUD line ---- */
function ccCase(v, lost) {
  v.temp = 8; v.load = true;
  stTick(dt => { if (MS.over) return false; if (!v.load) return true; const h = P.heat; v.temp = clamp(v.temp + (h > 45 ? .5 + (h - 45) * .1 : h < 30 ? -2.4 : 0) * dt, 0, 100); if (v.temp >= 100) { v.load = false; lost(); } return true; });
  return () => v.load ? `SERUM ${stBar(v.temp)} ${v.temp > 70 ? 'TOO WARM — LET HER COOL' : P.heat > 45 ? 'warming — heat over 45' : 'cold'}` : 'SERUM — none aboard';
}
/* how long a leg is given: a walk of it at this machine's own pace, k times over, and a little to offload in */
const ccTime = (a, b, k = 2.2, base = 50) => base + stDist(a, b) / (player.stats.speed * RUN) * k;

STORY.cold = {
  name: 'COLD CHAIN', sub: 'Two degrees to eight, all the way, or it is water', col: '#9fe8ff', emp: 'hel', foe: 'maw', who: STC.bapt, forN: 'Helion Relief', vsN: 'Greyfever, and the clock', payer: 'HELION RELIEF FUND',
  after: ['derby'], wait: 9, flags: ['saved', 'both'],
  fin: 'The greyfever on the Tessit river and the Cinder shelf has been stopped. Helion Relief credits a courier it declines to name. The courier weighed sixty tonnes and was seen to walk very carefully.',
  end: 'Dr. Baptiste has sent a case of something that is not serum, packed in the same ice. Dutch says it is the best he has had and that he is not sharing it.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'Two to Eight', kind: 'escort', biome: 'jungle', mood: 0, tod: 'day', seed: 96411, diff: 2, pay: 125000, salv: 15, site: 'the Tessit river', op: 'ICEBOX', solo: true,
    tease: 'There is greyfever in three villages on the Tessit river and one batch of serum in the sector. Serum is kept between two degrees and eight or it is water. The roads are out, the fliers will not go under that canopy, and Dr. Baptiste of Helion Relief watched the Iron Derby. She does not want the fastest machine in the sector. She wants the one that knows what its heat gauge says. The case bolts to your coolant loop: run hot and it warms.',
    wire: 'Helion Relief, all bands: "Greyfever confirmed at Tessit, Old Ford and High Mill. One batch of serum. Seeking a courier who can keep a machine cold."',
    sites: { lz: [-640, 420, 40, 'LZ'], c1: [-260, 190, 44, 'TESSIT'], c2: [140, -50, 44, 'OLD FORD'], c3: [520, -300, 44, 'HIGH MILL'] },
    face: 'c1', guests: [STC.bapt],
    brf: [
      { t: 'Medical courier work. I will let the doctor describe it. She has been awake for two days and she has asked me not to waste her time.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['card', 'THE JOB', ['Carry one case of serum to three clinics', 'In order. Each one has a clock', 'One machine. The case is bolted to it']]] },
      { by: STC.bapt, t: 'Greyfever. Three villages, about four hundred people, and by tonight it is the whole river. I have one batch. It goes to Tessit first, they are worst, then Old Ford, then High Mill. Each clinic can hold its patients only so long.', show: [['site', 'c1', 'TESSIT', '#9fe8ff'], ['site', 'c2', 'OLD FORD', '#9fe8ff'], ['site', 'c3', 'HIGH MILL', '#9fe8ff'], ['route', ['lz', 'c1', 'c2', 'c3'], '#9fe8ff']] },
      { by: STC.bapt, t: 'The serum lives between two degrees and eight. The case has no cooling of its own, so it is plumbed into yours. If your machine runs hot, my serum runs warm, and warm serum is water. I do not care how fast you are. I care what your heat gauge says.', show: [['card', 'THE CASE', ['Warms when your heat is over 45', 'The hotter you run, the faster it warms', 'Chills again when you are under 30', 'Spoiled is spoiled. There is no second batch']]] },
      { by: CREW.chief, t: "So that's sprinting in short bursts and firing when you must, boss. And it's a river valley. Stand her in the water up to the knees and she'll shed heat like a dog shaking. If the case is climbing, find the river.", shot: 'who' },
      { by: CREW.intel, t: 'The Red Maw sell medicine in that valley, at a price, and a free batch is bad for business. Expect somebody to try to stop you. Remember that fighting them is heat too. You are allowed to simply walk away from people.', show: [['unk', 'c2', 'ICE THIEVES?']] },
      { t: 'Three clinics, in order, cold. Late is bad. Warm is worse. I would rather you arrived late with medicine than on time with water.', show: [['clear'], ['route', ['lz', 'c1', 'c2', 'c3'], '#9fe8ff'], ['site', 'c1', 'TESSIT', '#9fe8ff'], ['site', 'c2', 'OLD FORD', '#9fe8ff'], ['site', 'c3', 'HIGH MILL', '#9fe8ff']] },
    ],
    async run(ms) {
      const S = ms.S, doc = STC.bapt, mott = STC.mott, dutch = CREW.chief, v = ms.v, mp = { paint: FAC.maw.paint, name: 'ICE THIEF' }, stops = ['c1', 'c2', 'c3'], names = ['TESSIT', 'OLD FORD', 'HIGH MILL']; let late = 0, from = S.lz;
      for (const k of stops) { mkStruct('hab', S[k].x + 18, S[k].z + 12, 0, { name: 'CLINIC', hpK: 3 }).inv = true; stBeacon(S[k], 0x9fe8ff); }
      setObj('s', ccCase(v, () => lose('The case went over eight degrees somewhere on the Tessit river and stayed there. What reached the clinic was water. There is no second batch.', .1)));
      await after(2.5); chatter(doc, 'The case is live and it is reading three degrees. Tessit first. Walk, do not run. I am watching the same gauge you are.');
      (async () => { await until(() => v.temp > 55); chatter(dutch, "Case is climbing, boss. Ease her off. Get under thirty on the heat or get her feet in the river."); })();
      for (const [i, k] of stops.entries()) {
        const due = ms.t + ccTime(from, S[k]); nav('c', S[k], names[i], '#9fe8ff'); setObj('c', () => `${names[i]} can hold ${ms.t > due ? '— OVERDUE' : 'for ' + stClock(due - ms.t)}`);
        if (i === 1) { const m = gpos((from.x + S[k].x) / 2, (from.z + S[k].z) / 2), W = stFrom(.55, m, stAng(from, S[k]) + 1.2, 150, mp); look(W[0], 'ICE THIEVES'); chatter(mott, 'That is a cold box on your hip. I know a cold box. Mine cost me money and yours is being given away. Put it down, there is a good machine.'); }
        if (i === 2) { const m = gpos((from.x + S[k].x) / 2, (from.z + S[k].z) / 2); foes(.6, m.x, m.z, 0, 40, { ...mp, ai: 'guard' }); spawn({ turret: 2 }, m.x, m.z, 14, 30, 1); chatter(doc, 'There is a roadblock on the High Mill track. You do not have to go through it. You only have to arrive.'); }
        await stHold('h', S[k], 46, 5, `Offload at ${names[i]}`); const bad = ms.t > due + 5; if (bad) { late++; ms.payK *= .85; }
        setObj('c', `${names[i]} — ${bad ? 'reached late' : 'reached in time'}`, bad ? 2 : 1); from = S[k];
        chatter(doc, bad ? ['Tessit has it. Late. I have lost two I need not have. Go.', 'Old Ford has it, and it is late. Go. Do not answer me, go.', 'High Mill has it. Late. They will remember which machine it was, and so will I.'][i] : ['Tessit has it, cold. That is a hundred and forty people. Old Ford next.', 'Old Ford has it. Four degrees. You drive like a pharmacist. High Mill.', 'High Mill has it. That is all three. That is the river.'][i]);
      }
      unnav('c'); v.load = false; setObj('s', null, 1); stSet('saved', 3 - late);
      await tell(mott, 'Mott. They call me Coldhand, for the business I am in. You have just given away, by my count, eleven thousand doses. I shall have to raise my prices on the Cinder shelf to cover it. I thought you should know whose fault that is.');
      win(late ? `The serum reached all three villages cold. ${late === 1 ? 'One of them' : late === 2 ? 'Two of them' : 'All of them'} waited longer than they could afford to.` : 'The serum reached Tessit, Old Ford and High Mill cold and on time. Nobody on the river has died of greyfever since noon.');
    },
    epi: (ok, f) => ok ? [
      [STC.bapt, f['cold.saved'] === 3 ? 'Baptiste. Three clinics, three in time, nothing spoiled. I have slept for six hours, which I mention because it is your doing. There is a second outbreak. I will call.' : 'Baptiste. It arrived cold, and that is the part I could not have done without you. It did not all arrive in time. I will not pretend otherwise and neither should you. There is a second outbreak.'],
      [CREW.intel, 'The man on the radio is Silas Mott. He buys relief medicine at gunpoint and sells it by the dose. He has cornered the Cinder shelf: every clinic there buys from him or goes without. That is where the fever has gone next.'],
      [CREW.chief, "I've had the loop apart, boss. Not a mark on it. Whatever you were doing out there, the machine liked it. She's never come back that clean."],
    ] : [[STC.bapt, 'Baptiste. I have begged a second batch from the Combine, which I was told did not exist. It is half the size. Do not warm this one.']],
    prize(D, add, f) { stGift(D, 'gear.cool', 2); if (f['cold.saved'] === 3) add('Helion Relief, in time at all three', 15000); repAdd('hel', 4, 'carried serum up the Tessit'); },
  }, {
    /* ---------------- II ---------------- */
    title: 'Last Mile', kind: 'escort', biome: 'volcanic', mood: 0, tod: 'dusk', seed: 96427, diff: 3, pay: 180000, salv: 20, site: 'the Cinder shelf', op: 'THAW', solo: true,
    tease: 'The greyfever has reached the Cinder shelf, where nothing is ever under forty degrees and Silas Mott owns every dose of medicine for a hundred kilometres. Dr. Baptiste has a batch for Cinderford, the town that is on the contract. She has not mentioned Salt Camp, which is not. There is no river on the shelf. Dutch has had two coolant bowsers dropped along the way and says you will want both.',
    wire: 'Greyfever on the Cinder shelf. Helion Relief has a batch for Cinderford. "Coldhand" Mott has let it be known that the shelf is his market.',
    sites: { lz: [-660, 380, 40, 'LZ'], k1: [-330, 150, 34, 'COLD POINT'], pass: [-40, 20, 50, 'THE CHIMNEYS'], cf: [240, -190, 50, 'CINDERFORD'], k2: [420, -390, 34, 'COLD POINT'], salt: [640, -560, 46, 'SALT CAMP'] },
    face: 'cf', guests: [STC.bapt],
    brf: [
      { t: 'The Cinder shelf. Same doctor, same disease, same case on the same coolant loop. A hotter place and a worse man.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'cf', 'CINDERFORD', '#9fe8ff'], ['card', 'THE JOB', ['Carry the serum to Cinderford, cold', 'One machine. The shelf will not cool you', 'Mott is in the way']]] },
      { by: STC.bapt, t: 'Cinderford. Two thousand people and a clinic that has been buying from Mott at whatever he asks. The Combine is paying for this batch, which is why it is going to Cinderford. I want that understood. I did not choose where it goes.', show: [['route', ['lz', 'pass', 'cf'], '#9fe8ff'], ['unk', 'salt', 'SALT CAMP — NOT ON THE CONTRACT']] },
      { by: CREW.chief, t: "No river up there, boss, and the ground's warm enough to fry on. She'll shed heat at two-thirds what she does at home. So I've had two bowsers dropped. Stand her inside the ring and they'll chill the loop and the case both. It costs you time. It's still cheaper than water.", show: [['site', 'k1', 'COLD POINT', '#7fe7ff'], ['site', 'k2', 'COLD POINT', '#7fe7ff'], ['card', 'COLD POINTS', ['Stand in the ring: machine and case both chill', 'One before the Chimneys, one beyond Cinderford', 'Lava is the opposite of a river. Stay out of it']]] },
      { by: CREW.intel, t: 'Mott will be at the Chimneys, where the track narrows. He does not need to kill you. He only needs you to get angry, and hot. Bear in mind what his men are for.', show: [['foe', 'pass', 'MOTT — ICE THIEVES'], ['face', STC.mott, ['Sells relief medicine by the dose', 'Has every clinic on the shelf', 'Needs you to run hot. Do not oblige']]] },
      { t: 'Cinderford, cold. What you do past Cinderford I will leave to you, because I suspect the doctor is going to ask, and I would rather not have told you no.', show: [['clear'], ['route', ['lz', 'k1', 'pass', 'cf'], '#9fe8ff'], ['site', 'cf', 'CINDERFORD', '#9fe8ff'], ['site', 'k1', 'COLD POINT', '#7fe7ff'], ['site', 'k2', 'COLD POINT', '#7fe7ff'], ['foe', 'pass', 'MOTT']] },
    ],
    async run(ms) {
      const S = ms.S, doc = STC.bapt, mott = STC.mott, dutch = CREW.chief, xo = ms.ops, v = ms.v, mp = { paint: FAC.maw.paint, name: 'ICE THIEF' }; let leg = 1, both = 1;
      for (const k of ['cf', 'salt']) { mkStruct('hab', S[k].x + 18, S[k].z + 12, 0, { name: k === 'cf' ? 'CINDERFORD CLINIC' : 'SALT CAMP', hpK: 3 }).inv = true; stBeacon(S[k], 0x9fe8ff); }
      for (const k of ['k1', 'k2']) { stBeacon(S[k], 0x7fe7ff); stRing(S[k], 24, 0x7fe7ff); mkTruck(S[k].x + 9, S[k].z - 6, 2, []).name = 'COOLANT BOWSER'; }
      stTick(dt => { if (ms.over) return false; if (near(S.k1, 24) || near(S.k2, 24)) { P.heat = Math.max(0, P.heat - 24 * dt); if (v.load) v.temp = Math.max(0, v.temp - 7 * dt); } return true; });
      setObj('s', ccCase(v, () => { if (leg === 1) lose('The case cooked on the Cinder shelf. Cinderford got a machine with a box of warm water bolted to it, and is buying from Mott again by the dose.', .1); else { msg('THE CASE IS SPOILED', 4); chatter(doc, 'It is gone. I can see the gauge. It is water. ...Come back. You tried a thing nobody was paying you to try. Come back.'); } }));
      const due = ms.t + ccTime(S.lz, S.cf, 2.4, 70); nav('c', S.cf, 'CINDERFORD', '#9fe8ff'); nav('k', S.k1, 'COLD POINT', '#7fe7ff'); setObj('c', () => `Cinderford can hold ${ms.t > due ? '— OVERDUE' : 'for ' + stClock(due - ms.t)}`);
      await after(2.5); chatter(doc, 'Case is live. Six degrees already, and you have not moved. That is the shelf. Cinderford, please, and mind the gauge.');
      (async () => { await until(() => v.temp > 55 && v.load); chatter(dutch, "She's cooking, boss. Bowser. Stand in the ring till the case comes down. It's quicker than you think."); })();
      /* his people are at the Chimneys, and come to wherever the courier is if it has gone round them */
      (async () => { await until(() => near(S.pass, 230) || near(S.cf, 210)); const c = near(S.pass, 230) ? S.pass : P.pos.clone(), W = stFrom(.8, c, stAng(S.pass, S.lz) + 2.2, 90, mp).concat(stFrom(.5, c, stAng(S.pass, S.lz) - 2.2, 90, mp)); look(W[0], 'ICE THIEVES');
        tell(mott, 'Mott. You remember. I am not going to shoot your case; I am not a savage, and it would be a waste. I am going to stand my people in front of you until you lose your temper. I find that machines lose theirs at about the same time.'); })();
      await stHold('h', S.cf, 46, 6, 'Offload at Cinderford'); const bad = ms.t > due + 5; if (bad) ms.payK *= .8; unnav('k'); setObj('c', bad ? 'Cinderford — reached late' : 'Cinderford — reached in time', bad ? 2 : 1);
      await tell(doc, bad ? 'Cinderford has it. It is late and it is cold, and cold is the one I could not forgive. The contract is met.' : 'Cinderford has it. Five degrees. Two thousand people. The contract is met, and the Combine will pay you tonight.');
      const r = await ask(doc, 'There is a third of the batch left in the case. Salt Camp is six hundred metres on: three hundred miners and nobody paying for them. Mott is between you and it, in person. I am not allowed to ask you. I notice that I am asking.', ['Salt Camp. Start the clock.', 'The contract is met. I am coming home.'], 24, 1);
      if (r === 0) {
        leg = 2; const due2 = ms.t + ccTime(S.cf, S.salt, 2.4, 60); nav('c', S.salt, 'SALT CAMP', '#9fe8ff'); nav('k', S.k2, 'COLD POINT', '#7fe7ff'); setObj('c2', () => `Salt Camp can hold ${ms.t > due2 ? '— OVERDUE' : 'for ' + stClock(due2 - ms.t)}`);
        const m = gpos((S.cf.x + S.salt.x) / 2 + 60, (S.cf.z + S.salt.z) / 2 + 40), Mt = mkMech(m.x, m.z, { ...PRESETS[13], paint: FAC.maw.paint }, 1, { name: 'COLDHAND', hpK: 1.9, skill: 1.3 }); Mt.alert = true; fieldWho(mott, Mt); stFrom(.6, m, 0, 30, mp); look(Mt, 'COLDHAND');
        await tell(mott, 'Now that is charity, and charity I cannot have. Cinderford was the Combine\'s money. Salt Camp is mine. Every one of those miners owes me for last winter. Turn round.');
        await until(() => !v.load || near(S.salt, 46));
        if (v.load) { await stHold('h2', S.salt, 46, 6, 'Offload at Salt Camp'); if (v.load) { both = 2; v.load = false; setObj('c2', 'Salt Camp — reached', 1); await tell(doc, 'Salt Camp has it. ...I had written them off. I had the form filled in. I am going to tear up a form. Thank you.'); if (!Mt.dead) { Mt.inv = true; leave([Mt]); chatter(mott, 'Three hundred customers. Gone in an evening. I shall remember the machine.'); } } }
        if (both < 2) setObj('c2', 'Salt Camp — the serum did not get there', 2);
      } else { await tell(doc, 'No. Of course. It is not on the contract. I should not have — no. Come home. Cinderford is two thousand people. It is enough. It has to be.'); }
      unnav('c'); unnav('k'); v.load = false; setObj('s', null, 1); stSet('both', both);
      win(both === 2 ? 'Cinderford and Salt Camp both have the serum, cold. Silas Mott has lost the Cinder shelf in one evening to a machine that would not lose its temper.' : r === 0 ? 'Cinderford has the serum. The last of it spoiled on the way to Salt Camp, which will go on buying from Mott by the dose.' : 'Cinderford has the serum, cold, as contracted. Salt Camp was not on the contract.');
    },
    epi: (ok, f) => ok ? [
      [STC.bapt, f['cold.both'] === 2 ? 'Baptiste. Both. I have a signed chit from the Combine for Cinderford and a bag of rock salt from the camp, with a note. The note says it is the good salt. I am told that means something. I think it is for you.' : 'Baptiste. Cinderford is clear. The Combine is pleased, and I have slept. Salt Camp is on my list for the next batch, when there is one. There will be one.'],
      f['cold.both'] === 2 ? [STC.mott, 'Mott. A professional note. I had the shelf for six years and you took it in an evening by refusing to be annoyed. I did not know that could be done. I shall be in another line of work by spring, and I shall keep clear of you in it.'] : [CREW.intel, 'Mott has put his prices up on the shelf by a third, and told every clinic why. He is still in business. I do not think that is the last we hear of him.'],
      [CREW.chief, "Two runs and the loop's come back cleaner each time. I'm half minded to bolt a box of ice to her permanent, boss, if it makes you fly like that."],
    ] : [[STC.bapt, 'Baptiste. The Combine has found another batch. They always can, when it is a town that pays. Same road. Colder, this time.']],
    prize(D, add, f) { stGift(D, 'back.snk', 1); stGift(D, 'gear.sink', 1); repAdd('hel', 6, 'carried serum to Cinderford'); if (f['cold.both'] === 2) { add('Salt Camp, a collection', 9000); repAdd('tyr', 6, 'carried serum to Salt Camp for nothing'); repAdd('maw', -5, "took the Cinder shelf off Mott's hands"); } },
  }],
};

/* ---- SLINGSHOT: the Kepler rail. A row of pylons with a level track on them whatever the ground does underneath; what comes back is the muzzle, where a round leaves ---- */
function slRail(a, b) {
  const n = Math.max(2, Math.round(stDist(a, b) / 44)), yaw = stAng(a, b), L = stDist(a, b) / n, pts = [], lit = glowMat(0x7fe7ff, 3); let top = -1e9;
  for (let i = 0; i <= n; i++) { const x = a.x + (b.x - a.x) * i / n, z = a.z + (b.z - a.z) * i / n, y = heightAt(x, z); pts.push([x, y, z]); top = Math.max(top, y); } top += 11;
  for (const [i, [x, y, z]] of pts.entries()) {
    const g = grp(FD.scene, x, y, z, 0, yaw, 0), h = top - y; for (const s of [-1, 1]) { box(g, M.girder, 1.1, h, 1.1, s * 3.6, h / 2, 0); box(g, M.dark, 2.2, 1, 2.2, s * 3.6, .5, 0); } box(g, M.dark, 9.6, 1.2, 2, 0, h, 0);
    if (i < n) { for (const s of [-1, 1]) box(g, M.steel, .9, .8, L, s * 1.7, h + 1, L / 2); noShadow(box(g, lit, .3, .25, L, 0, h + .8, L / 2)); if (i % 2 === 0) noShadow(cyl(g, lit, 3.2, 3.2, .5, 0, h + 1.2, L / 2, PI / 2, 0, 0, 16)); }
    FD.misc.push(g);
  }
  return V3(b.x, top + 1.4, b.z);
}
/* a round out of the rail and into a ship: a line of light, and a third of her gone */
function slThrow(muz, ship, dmg) {
  const at = ship.pos.clone(), bm = hot(0xbfefff, 7); bm.transparent = true; bm.blending = THREE.AdditiveBlending; bm.depthWrite = false; addBeam(muz.clone(), at, bm, 1.8, 1.3); flashAt(muz, 0xbfefff, 500, 240, .45); fieldBoom(at, 3.2); P.shake += .6; sfx.play('ion', 1); sfx.play('cannon', 1);
  const inv = ship.inv; ship.inv = false; damage(ship, dmg, at, 0); ship.inv = inv;
}
/* Rook comes too. If she is the wingman already, that is her; if not she turns up on her own account */
function slRook() {
  const rook = PILOTS[0].ch; if (CO.wing && CO.wing.p === PILOTS[0] && MS.wing && !MS.wing.dead) return MS.wing;
  const [x, z] = groundSpot(P.pos.x, P.pos.z, 18, 30), e = mkMech(x, z, { ...(stFlag('derby.mag') ? ST_MAGPIE : PRESETS[0]), paint: player.cfg.paint }, 0, { ai: 'follow', lead: PE, name: 'ROOK', hpK: 2, skill: 1.3, yaw: P.yaw });
  fieldWho(rook, e); return stKeep(e, rook, "I'm down! I'm fine. I'm down. Do NOT tell Gran.");
}
const slDomes = (S, n, lost) => Array.from({ length: n }, (_, i) => { const e = mkStruct('hab', S.dome.x + (i - 1) * 32, S.dome.z + (i % 2) * 24, 0, { name: 'KEPLER DOME' }); e.hp = e.max = 620; e.onKill = () => lost(e); return e; });

STORY.sling = {
  name: 'SLINGSHOT', sub: 'Six kilometres of rail, pointed at the wrong sky', col: '#ffd98a', emp: 'tyr', foe: 'maw', who: PILOTS[0].ch, forN: 'The Kepler Rail co-operative', vsN: 'The Landlady', payer: 'KEPLER RAIL CO-OP',
  after: ['derby'], wait: 10, flags: ['domes', 'rail'],
  fin: 'The Red Maw carrier RENT DAY came down on the Kepler flats in three pieces, each of them hit by a canister of iron ore travelling at four kilometres a second. The Kepler Rail co-operative has resumed shipping.',
  end: 'Rook has gone home for a week. She says it is to help Gran re-lay the rail. Gran says it is to be fed.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'Catch', kind: 'strike', biome: 'lunar', mood: 0, tod: 'night', seed: 96511, diff: 3, pay: 150000, salv: 30, site: 'the Kepler rail', op: 'BACKSTOP',
    tease: 'Rook has not asked the company for anything since the Derby. She is asking now. She grew up on the Kepler rail: a mass driver that throws iron ore off the moon, run by the co-operative that built it, which is to say by her grandmother. The Red Maw took the breech three days ago. They have laid the rail flat and are lobbing ore canisters back down onto the co-op\'s own domes, one at a time, until somebody pays the rent.',
    wire: 'Kepler Rail co-operative, by relay: "The Maw has our breech and is throwing our own ore at us. To whoever has Juno Albrecht flying for them: tell her Gran says come home, and bring friends."',
    sites: { lz: [-640, 440, 40, 'LZ'], dome: [-420, 150, 70, 'KEPLER DOMES'], r0: [-240, 330, 30], b1: [-60, 190, 40, 'CAPACITOR BANK'], b2: [200, -10, 40, 'CAPACITOR BANK'], b3: [460, -210, 40, 'CAPACITOR BANK'], ring: [640, -350, 56, 'THE BREECH'] },
    face: 'dome', guests: [PILOTS[0].ch],
    brf: [
      { t: 'The moon. This one is brought to us by one of our own, and she is in the room, so I will be polite about the fee.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'dome', 'KEPLER DOMES', '#ffd98a'], ['card', 'THE JOB', ['Take the Kepler rail back from the Red Maw', 'They are throwing ore at the domes with it', 'Rook flies with us, hired or not']]] },
      { by: PILOTS[0].ch, t: "That's home. That's the rail. Gran runs the breech, has done since before I was born. You load a canister, the capacitors dump, it's in orbit in nine seconds. The Maw's laid it flat. They're not throwing at orbit. They're throwing at the domes.", show: [['route', ['r0', 'b1', 'b2', 'b3', 'ring'], '#7fe7ff'], ['foe', 'ring', 'THE BREECH — RED MAW']] },
      { by: PILOTS[0].ch, t: "Three capacitor banks down the length of her. Every one you kill, she charges slower, they throw slower. Kill all three and she's a very long fence. Don't hurt the rail. Gran'll skin me.", show: [['foe', 'b1', 'CAPACITOR BANK'], ['foe', 'b2', 'CAPACITOR BANK'], ['foe', 'b3', 'CAPACITOR BANK'], ['card', 'THE BANKS', ['Three, each with a guard', 'Each one down slows the barrage', 'All three down stops it']]] },
      { by: CREW.intel, t: 'They are not only throwing at the domes. One round in three will be for you, wherever you are standing. You will see where it is going to land before it lands. Do not be there.', show: [['ring', 'dome', 110, 'UNDER FIRE'], ['card', 'CANISTERS', ['A ring on the ground, then a canister in it', 'Two in three at the domes', 'One in three at you']]] },
      { by: CREW.chief, t: "Moon rules, boss. A sixth the weight, so she'll jump like a flea, and no air, so she'll cool like a brick in a blanket. Short bursts.", shot: 'who' },
      { t: 'Three banks, then the breech. The domes have people in them. Lose all of the domes and there is no co-operative to pay us, or to go home to.', show: [['clear'], ['site', 'dome', 'KEPLER DOMES', '#ffd98a'], ['foe', 'b1', 'BANK'], ['foe', 'b2', 'BANK'], ['foe', 'b3', 'BANK'], ['foe', 'ring', 'THE BREECH'], ['route', ['r0', 'b1', 'b2', 'b3', 'ring'], '#7fe7ff']] },
    ],
    async run(ms) {
      const S = ms.S, rook = PILOTS[0].ch, gran = STC.gran, land = STC.land, v = ms.v, mp = { paint: FAC.maw.paint, name: 'RENT COLLECTOR' }; slRail(S.r0, S.ring); slRook(); let nx = 9;
      const Dm = slDomes(S, 3, () => { if (ms.over) return; ms.payK *= .9; msg(`A DOME IS GONE — ${alive(Dm)} LEFT`, 3.5); if (!alive(Dm)) lose('The last of the Kepler domes is open to the sky. There is nobody left on the rail to take it back for.', .1); else chatter(gran, alive(Dm) === 2 ? "That's Number Two dome gone. They'd got everybody out. Get on with it, I can't have this." : "One dome left and it's the one I'm sat in. No pressure, dear."); });
      const Bk = ['b1', 'b2', 'b3'].map((k, i) => { const b = mkStruct('gen', S[k].x, S[k].z, 1, { name: 'CAPACITOR BANK', hpK: 1.3 }); foes(.5 + i * .12, S[k].x, S[k].z, 18, 60, { ...mp, ai: 'guard' }); spawn({ turret: 1 + (i > 0) }, S[k].x, S[k].z, 20, 32, 1); nav(k, b, 'BANK', '#ff5a3a'); b.onKill = () => { unnav(k); if (!ms.over) msg(alive(Bk) ? `BANK DOWN — THE RAIL IS CHARGING SLOWER` : 'THE RAIL IS DEAD', 3.5); }; return b; });
      stTick(dt => { if (ms.over || !alive(Bk)) return false; if ((nx -= dt) > 0) return true; nx = [0, 16, 9.5, 6][alive(Bk)] * rand(.85, 1.15); const D = Dm.filter(e => !e.dead);
        if (Math.random() < .34 || !D.length) shell(P.pos.x + Math.sin(P.yaw) * P.v * 2.6 + rand(-9, 9), P.pos.z + Math.cos(P.yaw) * P.v * 2.6 + rand(-9, 9), 44, 13, 2.8, 1); else { const d = pick(D); shell(d.pos.x + rand(-10, 10), d.pos.z + rand(-10, 10), 62, 16, 2.8, 1); } return true; });
      setObj('m', () => `Kill the capacitor banks — ${alive(Bk)} left`); setObj('d', () => `Kepler domes — ${alive(Dm)} of 3 standing`); nav('b1', Bk[0], 'BANK', '#ff5a3a');
      await after(3); await tell(gran, "Is that Juno? Is that Juno's lot? About time. They've my breech and they're throwing my own ore at my own roof. Mind your heads, the next one's about due.");
      chatter(rook, "Hi Gran. Yes Gran. I've brought the boss. Yes, I'm eating."); await until(() => alive(Bk) < 3);
      await tell(land, 'Now who is that on my rail? This is a private tenancy, dear. Marrable. They call me the Landlady, because I collect. The co-operative is three months behind and I have had to let myself in.');
      await until(() => alive(Bk) < 2); chatter(gran, "Two down. She's charging like a wet battery. They'll get one off a quarter hour at this rate. One more."); await until(() => !alive(Bk)); setObj('m', null, 1);
      await tell(rook, "That's the rail dead. Breech is at the top end. They'll be dug in round Gran's chair. Nobody sits in Gran's chair.");
      const G = foes(1, S.ring.x, S.ring.z, 12, 60, { ...mp, ai: 'guard' }); nav('r', S.ring, 'THE BREECH', '#ffd98a'); setObj('r', () => `Clear the breech — ${alive(G)} left`); await until(() => !alive(G)); setObj('r', null, 1); await stHold('h', S.ring, 50, 10, 'Hold the breech while the co-op comes back up the line'); unnav('r');
      stSet('domes', alive(Dm)); await tell(gran, "I'm in my chair. It's been adjusted. I'll be having words. Right. Juno, come here and let me look at you. No, in the machine, obviously in the machine.");
      await tell(land, 'Well. You have broken my catapult and put the tenants back in. I shall have to come round myself, then, shan\'t I, with the big keys. First of the month, dear. I am never late.');
      win(`The Kepler rail is back in the co-operative's hands, with ${['none', 'one', 'two', 'all'][alive(Dm)]} of its three domes still under pressure. The Red Maw has promised to call again.`);
    },
    epi: (ok, f) => ok ? [
      [STC.gran, f['sling.domes'] === 3 ? "Solheim. Not a dome lost. I've been on this rail fifty-one years and I've never seen it better done, and I'll not say it twice. Juno says you're a decent boss. I'll form my own view." : "Solheim. We've the rail. We've lost a roof or two and nobody under them, which is the part that matters. Juno says you're a decent boss. I'll form my own view."],
      [PILOTS[0].ch, "She likes you. That was her liking you. Listen, the Landlady's got a carrier, the RENT DAY. That's what's coming. Gran's got an idea about that. It's a terrible idea. I love it."],
      [CREW.intel, 'A HIVE-class carrier. Our weapons will not open her hull. I have checked twice. I am told the co-operative has something that will, and that it is six kilometres long.'],
    ] : [[PILOTS[0].ch, "They've put a new bank in overnight. Gran's still in the dome. I'm going back whether you are or not, boss. I'd rather you were."]],
    prize(D, add, f) { stGift(D, 'gear.sink', 2); if (f['sling.domes'] === 3) add('Kepler co-op, for the roofs', 16000); repAdd('tyr', 4, 'took back the Kepler rail'); repAdd('maw', -4, 'evicted the Landlady'); },
  }, {
    /* ---------------- II ---------------- */
    title: 'Return to Sender', kind: 'garrison', biome: 'lunar', mood: 0, tod: 'day', seed: 96527, diff: 4, pay: 210000, salv: 35, site: 'the Kepler rail', op: 'FIRST OF THE MONTH',
    tease: 'The Landlady is bringing the RENT DAY round in person: a carrier with a hull nothing in the yard will open, and a flight deck full of drones. Gran Solheim has a mass driver that throws four tonnes of iron ore at four kilometres a second, and has spent the week re-laying the last kilometre of it to point somewhere new. It needs three rounds. It needs somebody to keep the Maw off the breech while each one charges. And it needs her to hold still, which is what engines are for shooting at.',
    wire: 'The carrier RENT DAY has left Maw space on a heading for the Kepler flats. Kepler Rail co-operative has posted one line: "We are in. Do call."',
    sites: { lz: [-600, 420, 40, 'LZ'], dome: [-380, 120, 70, 'KEPLER DOMES'], r0: [-200, 300, 30], ring: [120, 60, 60, 'THE BREECH'], r1: [330, -100, 30], app: [700, -560, 40, 'HER APPROACH'] },
    face: 'ring', guests: [PILOTS[0].ch, STC.gran],
    brf: [
      { t: 'Kepler again. A Red Maw carrier is coming for the rail and the domes. We cannot hurt her hull. The co-operative says it can, and Mrs. Solheim has come down the well to tell us how.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'dome', 'KEPLER DOMES', '#ffd98a'], ['site', 'ring', 'THE BREECH', '#ffd98a'], ['card', 'THE JOB', ['Hold the breech while the rail charges', 'Three rounds. Each takes a third of her', 'Rook flies with us']]] },
      { by: STC.gran, t: "It's a rail, dear, it throws things. I've relaid the last kilometre so it throws them at about there. Four tonnes of ore, four kilometres a second. I don't care what her hull's made of.", show: [['route', ['r0', 'ring', 'r1'], '#7fe7ff'], ['foe', 'app', 'RENT DAY'], ['route', ['app', 'dome'], '#ff5a3a']] },
      { by: STC.gran, t: "She takes a while to charge with the banks you left me, and my lot can't work the breech with Maw climbing in the windows. So you stand in the ring. While you're in it, she charges. Step out and she holds where she was. Three times.", show: [['ring', 'ring', 60, 'STAND HERE'], ['card', 'THE RAIL', ['Charges while you are in the ring', 'Fires by itself when it is ready', 'Three rounds and the carrier is scrap']]] },
      { by: CREW.intel, t: 'The carrier herself. Hull: forget it. Engines: two nacelles aft, and those you can hurt. Each one you shoot off slows her and takes a piece of the hull with it. A slow ship spends longer in front of the rail and less time over the domes.', show: [['face', STC.land, ['The Landlady. Red Maw', 'Carrier RENT DAY: drones, and a lot of them', 'Hull is proof against us. Engines are not']]] },
      { by: PILOTS[0].ch, get t() { return stFlag('sling.domes') === 3 ? "All three domes are up, so there's three for her drones to pick from. Spreads them out. I'll take the drones, boss. You stand in Gran's ring and look pretty." : "We're down to what domes we kept. Every drone she launches is going for the same roof. I'll take the drones, boss. You stand in Gran's ring."; }, shot: 'who' },
      { t: 'In the ring to charge. Out of it to fight. Decide which, each time, and do not dither between them.', show: [['clear'], ['site', 'dome', 'KEPLER DOMES', '#ffd98a'], ['ring', 'ring', 60, 'THE BREECH'], ['foe', 'app', 'RENT DAY'], ['route', ['r0', 'ring', 'r1'], '#7fe7ff']] },
    ],
    async run(ms) {
      const S = ms.S, rook = PILOTS[0].ch, gran = STC.gran, land = STC.land, xo = ms.ops, v = ms.v, mp = { paint: FAC.maw.paint, name: 'RENT COLLECTOR' }, muz = slRail(S.r0, S.r1), R = slRook(); stRing(S.ring, 52, 0xffd98a); stBeacon(S.ring, 0xffd98a);
      const Dm = slDomes(S, clamp(stFlag('sling.domes') || 3, 1, 3), () => { if (ms.over) return; ms.payK *= .9; msg(`A DOME IS GONE — ${alive(Dm)} LEFT`, 3.5); if (!alive(Dm)) lose('The RENT DAY sat over the Kepler domes until there were none. The Landlady has collected.', .1); });
      setObj('d', () => `Kepler domes — ${alive(Dm)} of ${Dm.length} standing`); nav('r', S.ring, 'THE BREECH', '#ffd98a'); await until(() => near(S.ring, 120));
      await tell(gran, "There you are. Ring's painted on the ground, I did it myself. In it, she charges. Out of it, she doesn't. I'll shout when I throw. You'll not need telling.");
      const ship = mkCapital('hive', S.app.x, S.app.z, 1, { name: 'RENT DAY', hpK: 1.2, alert: true, to: S.dome, focus: Dm[0], cap: 5, yaw: stAng(S.app, S.dome) }); ship.inv = true; fieldWho(land, ship); look(ship, 'RENT DAY'); sfx.play('alarm'); msg('RENT DAY — ON THE PLOT', 4); nav('s', ship, 'RENT DAY', '#ff5a3a');
      await tell(land, 'Good morning, dears! First of the month! I have brought the big keys and I have brought the boys. Now, who has been putting my tenants back?');
      await tell(xo, 'Carrier on the plot, making for the domes. Her hull will not mark. Her engine nacelles will, and each one off slows her. In the ring to charge the rail, Commander. Three rounds.');
      setObj('s', () => `RENT DAY — ${ship.dead ? 'down' : Math.max(0, Math.round(ship.hp / ship.max * 100)) + '%'}`);
      for (let n = 1; n <= 3 && !ship.dead; n++) {
        const W = stFrom(.55 + n * .15, S.ring, stAng(S.ring, S.app) + (n - 2) * 1.1, 230, { ...mp, focus: PE }); if (n > 1) look(W[0], 'RENT COLLECTORS');
        await stHold('c', S.ring, 52, 24, `Stand in the ring — charging round ${n} of 3`); if (ship.dead) break;
        chatter(gran, ['THROWING!', 'AND AGAIN!', "LAST ONE! THAT'S THE RENT, YOU OLD BAT!"][n - 1]); await after(.8); look(ship, 'RENT DAY'); slThrow(muz, ship, n === 3 ? 1e7 : ship.max * .34); msg(`ROUND ${n} — HIT`, 3);
        if (n === 1) await tell(land, 'Oh! Oh, that is my good hull. That was not on the inventory. Boys! The breech! Somebody is throwing things at Mother.');
        if (n === 2) chatter(rook, "She's listing! Gran, she's LISTING! One more! Boss, stay in the ring, I've got the drones!");
      }
      await until(() => ship.dead); unnav('s'); unnav('r'); setObj('s', null, 1); setObj('d', null, 1);
      await tell(land, 'Well. That is the RENT DAY gone, and I was fond of her. You may tell the tenants the lease is at an end. I shall be writing to my solicitor. I have not got a solicitor. Good morning.');
      const r = await ask(gran, "That's that. Now. The last kilometre's still pointed at the sky over my roof instead of at orbit. I can lay it back for ore by Thursday. Or I can leave one round in her, pointed where it is, for the next landlord. Your say. You earned it.", ['Lay it back. It is for ore.', 'Leave one in the breech. Always.'], 24, 0); stSet('rail', r + 1);
      await tell(gran, r ? "One in the breech. Aye. I'd have done the same and felt bad about it. This way I can blame you." : "For ore. Good. It's a rail, not a gun. I'd started to forget, this week. Thank you for remembering for me.");
      chatter(rook, "Gran. GRAN. Did you see the second one? I said, did you SEE the —"); stShow(S.ring, 8, 90);
      win('The carrier RENT DAY is three wrecks on the Kepler flats, each with a canister of iron ore somewhere inside it. The co-operative is shipping again.');
    },
    epi: (ok, f) => ok ? [
      [STC.gran, f['sling.rail'] === 2 ? "Solheim. There's a round in the breech and there'll stay one. I've told the Free League, so they'll have told everybody. Nobody's been near us since. You were right and I don't have to like it." : "Solheim. She's laid back for ore and the first canister went up this morning. Nine seconds to orbit. I'd forgotten how quiet it is when it's going the right way."],
      [PILOTS[0].ch, "Gran's given me the canister that didn't get thrown. The fourth one. It's four tonnes of ore with a ribbon on. I don't know where she thinks I'm keeping it. ...Thanks, boss. For coming."],
      [CREW.xo, 'For the record: a civilian co-operative has just shot down a capital ship with mining equipment, and we held the door. I am going to enjoy writing that report.'],
    ] : [[PILOTS[0].ch, "She's still up there and there's still a dome. Gran says the rail's good for three more. I say we go again."]],
    prize(D, add, f) { stGift(D, 'arm.gs1', 1); stGift(D, 'gear.core', 1); repAdd('tyr', 7, 'brought down the RENT DAY over Kepler'); repAdd('maw', f['sling.rail'] === 2 ? -9 : -6, 'brought down the RENT DAY over Kepler'); },
  }],
};

/* ---- THE DROWNED STAIR: five tiers of old stone with a door in the bottom one. What comes back is the door's lamp, which is dark until something lights it ---- */
function dsStair(p) {
  const g = at(p.x, p.z), lamp = glowMat(0xffd27a, 0);
  for (let i = 0; i < 5; i++) { const w = 74 - i * 13; box(g, EM.stone, w, 7, w, 0, i * 7 + 3.5, 0); rect(p.x, p.z, w / 2, w / 2, g.position.y + i * 7 + 7); for (const s of [-1, 1]) box(g, EM.stone, 5, 2.4, 5, s * (w / 2 - 2.5), i * 7 + 8.2, w / 2 - 2.5); }
  box(g, EM.stone, 9, 8, 9, 0, 39, 0); box(g, M.dark, 13, 6.2, 1.2, 0, 3.1, 37.2); for (const s of [-1, 1]) box(g, EM.stone, 3, 9, 3.4, s * 8, 4.5, 38); box(g, EM.stone, 20, 2.6, 3.6, 0, 10, 38);
  noShadow(box(g, lamp, 11, 5.2, .3, 0, 3, 37.9)); for (let i = 0; i < 3; i++) noShadow(box(g, lamp, 1.2, 1.2, .3, (i - 1) * 5, 10, 39.85));
  return lamp;
}
const DS_OLD = { n: 'WATCH', pri: 0x6b6452, sec: 0x38342b, acc: 0xffe9a0, glow: 0xffd27a }, DS_CFG = { name: 'DOORKEEPER', role: 'WARDEN', legs: 'sup', torso: 'ctd', head: 'mon', armL: 'mau', armR: 'gs3', back: 'shd' };
/* the valley's water, moved d metres over secs */
function dsWater(d, secs) { const w0 = EV.wl, w1 = w0 + d; if (w0 == null) return; stTick(dt => { if (MS.over) return false; EV.wl = d < 0 ? Math.max(w1, EV.wl + dt * d / secs) : Math.min(w1, EV.wl + dt * d / secs); FD.water.position.y = EV.wl; POST.kick(); return EV.wl !== w1; }); }

STORY.stair = {
  name: 'THE DROWNED STAIR', sub: 'LANTERN walked past a door on its way home, and wrote it down', col: '#b9a5ff', emp: 'ord', foe: 'kar', who: STC.ione, forN: 'The Ordo Ferrum, Map Room', vsN: 'Karsk Acquisitions', payer: 'ORDO FERRUM, THE MAP ROOM',
  after: ['dead'], wait: 10, flags: ['clean', 'door', 'end'],
  fin: 'The Ordo Ferrum has added one valley to its maps and taken another off them. It will not say which is which. Karsk Acquisitions has written off a battalion to "terrain".',
  end: 'Sister Ione has sent a map of the sector with our yard on it, hand drawn. There is a small door inked beside it. She has not explained the door.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'The Lintel', kind: 'recon', biome: 'jungle', mood: 1, tod: 'dawn', seed: 96611, diff: 2, pay: 115000, salv: 25, site: 'the Drowned Valley', op: 'THRESHOLD',
    tease: 'When the survey frame LANTERN walked itself home it kept a log, and the Ordo Ferrum has been reading it ever since. Most of it is weather. One entry is not: six years ago, in a flooded valley nobody has mapped, LANTERN stopped for nine days in front of a door, and wrote down how to be let in. Sister Ione of the Map Room wants to try it. The instructions are three lines long and she is fairly sure of the translation.',
    wire: 'The Ordo Ferrum Map Room is hiring an escort into the Drowned Valley, "for the purpose of knocking". Apply to Sister-Cartographer Vasquez.',
    sites: { lz: [-640, 400, 40, 'LZ'], barrow: [-330, -260, 40, 'THE BARROW'], stone: [330, 330, 40, 'THE HIGH STONE'], spring: [470, -360, 40, 'THE SPRING'], stair: [40, -20, 76, 'THE STAIR'] },
    face: 'stair', guests: [STC.ione],
    brf: [
      { t: 'The Ordo Ferrum, and a valley that is not on anybody\'s map, including theirs. Sister Ione is a cartographer. She would like that corrected.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'stair', 'THE STAIR', '#b9a5ff'], ['card', 'THE JOB', ['Escort a survey into the Drowned Valley', 'Wake three old survey stones, in order', 'Client: the Ordo Ferrum, Map Room']]] },
      { by: STC.ione, t: 'It is LANTERN\'s log. Year one, day two hundred and six. It found a stair in a flooded valley, and at the foot of the stair a door, and it stood in front of the door for nine days. Then it wrote three lines, and walked on. I have the three lines.', show: [['face', STC.lan, ['Helion survey frame, lost six years', 'Walked home with nobody aboard', 'Kept a log. Mostly weather']]] },
      { by: STC.ione, t: '"First where the water is born. Then where the stone stands highest. Last where the dead are kept. Then the door will know you." There are three listening stones in the valley. I believe one stands in each of those places. I believe the order matters.', show: [['card', "LANTERN'S LOG, DAY 206", ['First where the water is born.', 'Then where the stone stands highest.', 'Last where the dead are kept.', 'Then the door will know you.']], ['site', 'spring', 'THE SPRING', '#b9a5ff'], ['site', 'stone', 'THE HIGH STONE', '#b9a5ff'], ['site', 'barrow', 'THE BARROW', '#b9a5ff']] },
      { by: CREW.intel, t: 'To wake a stone you stand beside it for a few seconds. I would stand beside them in the right order. Whatever built that valley left wardens in it, and the log says LANTERN was "corrected" twice before it got it right.', show: [['card', 'THE STONES', ['Stand beside a stone to wake it', 'In the order of the log', 'The wrong stone wakes the wardens, and you start again']]] },
      { by: CREW.chief, t: "It's a drowned valley, boss, the water's up over the old paths. She'll wade, she'll run cool, and she'll be slow where it's deep. Keep to the high ground between the stones if you're in a hurry.", shot: 'who' },
      { t: 'Three stones in the order of the log, then the stair. And one more thing. Karsk Acquisitions reads the Ordo\'s mail. If there is a door, they will want what is behind it.', show: [['clear'], ['site', 'spring', 'THE SPRING', '#b9a5ff'], ['site', 'stone', 'THE HIGH STONE', '#b9a5ff'], ['site', 'barrow', 'THE BARROW', '#b9a5ff'], ['site', 'stair', 'THE STAIR', '#b9a5ff'], ['unk', 'stair', 'KARSK — LATER']] },
    ],
    async run(ms) {
      const S = ms.S, ione = STC.ione, rask = STC.rask, xo = ms.ops, mira = CREW.intel, order = ['spring', 'stone', 'barrow'], lab = { spring: 'THE SPRING', stone: 'THE HIGH STONE', barrow: 'THE BARROW' }, awake = {}, kp = { name: 'KARSK ACQUISITIONS' }; let got = 0, wrong = 0, dwell = 0, lit = [];
      const lamp = dsStair(S.stair); dsWater(3, 1); for (const k of order) { stBeacon(S[k], 0x6a6f9a); nav(k, S[k], lab[k], '#b9a5ff'); }
      setObj('m', () => `Wake the listening stones in the order of the log — ${got} of 3${dwell > 0 ? ' · ' + stBar(dwell * 100) : ''}`);
      await after(3); chatter(ione, 'Oh, it is beautiful. Nobody has drawn this. Nobody has ever drawn this. Three stones, Commander. First where the water is born.');
      while (got < 3 && !ms.over) {
        const k = await new Promise(res => { let t = 0, cur = null; stTick(dt => { if (ms.over) return false; const q = order.find(j => !awake[j] && near(S[j], 34)); if (q !== cur) { cur = q; t = 0; } dwell = q ? t / 4 : 0; if (!q) return true; t += dt; if (t < 4) return true; dwell = 0; res(q); return false; }); });
        if (k === order[got]) { awake[k] = 1; got++; lit.push(stBeam(S[k], 0xffe9a0, 260, 2.8)); unnav(k); flashAt(S[k], 0xffe9a0, 300, 160, .5); sfx.play('ui'); msg(`${lab[k]} — AWAKE`, 3); chatter(ione, ["It is singing. Can you hear it? One tone, very low. The Spring is awake. Then where the stone stands highest.", "Two tones now. A fifth apart. Whoever built this had ears. Last where the dead are kept.", "Three. A chord. Oh. Oh, the water is moving."][got - 1]); }
        else { wrong++; got = 0; for (const j of order) { awake[j] = 0; nav(j, S[j], lab[j], '#b9a5ff'); } for (const m of lit) FD.scene.remove(m); lit = []; msg('THE WRONG STONE — THE WARDENS ARE AWAKE', 4); sfx.play('alarm'); const W = hot1(spawn({ drone: 3 + wrong, turret: 1 }, S[k].x, S[k].z, 30, 80, 1, { name: 'WARDEN' })); look(W[0], 'WARDENS');
          chatter(ione, wrong === 1 ? 'No. No, that was not it, they have all gone dark. It has corrected us. From the beginning: where the water is BORN. The Spring.' : 'Dark again. The Spring, then the High Stone, then the Barrow. I have written it on my hand. I will read it to you as often as you like.'); await until(() => !near(S[k], 60)); }
      }
      setObj('m', null, 1); stSet('clean', wrong ? 0 : 1); dsWater(-7, 26); msg('THE VALLEY IS DRAINING', 5); P.shake += .4; lamp.emissiveIntensity = 3; stBeam(S.stair, 0xffd27a, 300, 4); look(S.stair, 'THE STAIR'); nav('st', S.stair, 'THE STAIR', '#ffd27a');
      await tell(ione, 'The water is going down. All of it, the whole valley, it is going down the stair. And the door has a light in it. LANTERN stood here nine days. We have been an hour.');
      if (!wrong) stPay('First time of asking', 14000);
      await until(() => near(S.stair, 150)); const [kx, kz] = stOff(S.stair, stAng(S.stair, S.lz) + PI, 210); let W = []; dropship(kx, kz, () => { W = hot1(foes(.9, kx, kz, 6, 40, kp)); }, undefined, 1); sfx.play('alarm');
      await tell(rask, 'Raskova, Karsk Acquisitions. Thank you for opening it. I have a requisition for the site, the door and the contents, signed this morning. The sister may keep her drawings.');
      await tell(xo, 'Karsk dropship on the far side of the stair. They let us do the knocking. Hold the foot of the stair. The sister needs a minute with that lintel and she is not going to get it for free.');
      const h = stHold('h', S.stair, 110, 34, 'Hold the foot of the Stair while Ione reads the lintel'); (async () => { await after(16); if (!ms.over) W = W.concat(stFrom(.8, S.stair, stAng(S.stair, S.spring), 230, kp)); })(); await h; await until(() => alive(W) <= 1);
      await tell(ione, 'I have it. I have all of it. The lintel does not say what is behind the door. It says who is in front of it. There is a keeper, Commander. It is still on watch. And it has just closed the door again.'); lamp.emissiveIntensity = .6;
      await tell(rask, 'Closed. Then I shall come back with something that opens doors. Enjoy your drawings, Sister.');
      win(wrong ? 'The Drowned Valley is drained and the Stair stands open to the air. It took more than one try, and the wardens have been paid for it in scrap.' : 'The Drowned Valley is drained and the Stair stands open to the air. The stones were woken first time, in the order a lost machine wrote down six years ago.');
    },
    epi: (ok, f) => ok ? [
      [STC.ione, f['stair.clean'] ? 'Ione. First time. LANTERN needed three attempts and it was built for the work. I have put that in the margin of the map. The Map Room does not usually allow margins.' : 'Ione. We were corrected, as LANTERN was. I find that comforting. It means the door treats everybody alike.'],
      [CREW.intel, 'I have read her copy of the lintel. It is a set of standing orders, and it is addressed to a machine. "Keep the door. Weigh who comes. Open to none who force it." Something down there has been obeying that for a very long time.'],
      [CREW.xo, 'Raskova will be back with a siege column. If there is a keeper, I would like it on our side of the argument before he arrives. I do not know how one recruits a door.'],
    ] : [[STC.ione, 'Ione. The valley has filled again. I think it does that. I think it is patient. I should like to try once more, if you would.']],
    prize(D, add, f) { stGift(D, 'gear.kit', 1); stGift(D, 'gear.scrap', 2); repAdd('ord', 5, 'opened the Drowned Valley'); },
  }, {
    /* ---------------- II ---------------- */
    title: 'The Doorkeeper', kind: 'garrison', biome: 'jungle', mood: 0, tod: 'night', seed: 96611, diff: 4, pay: 185000, salv: 35, site: 'the Stair', op: 'WEIGHED',
    tease: 'There is a machine standing in the court at the foot of the Stair. It has been standing there since before the valley flooded, it is half as tall again as anything the yard owns, and it has not moved. The lintel over the door is its orders: keep the door, weigh who comes, open to none who force it. Colonel Raskova is coming back to force it. Sister Ione has a theory about how one is weighed. It involves standing in front of a very large gun and not doing anything.',
    wire: 'Karsk Acquisitions has moved a siege column into the Drowned Valley. The Ordo Ferrum Map Room has asked for "the same escort, and its patience".',
    sites: { lz: [-640, 400, 40, 'LZ'], stair: [40, -20, 76, 'THE STAIR'], court: [40, 110, 60, 'THE COURT'], k1: [470, -360, 44, 'KARSK COLUMN'], k2: [330, 330, 44, 'KARSK COLUMN'] },
    face: 'court', guests: [STC.ione],
    brf: [
      { t: 'The Stair, by night. Karsk is coming for the door with a siege column. We are there to see that they do not get it, and Sister Ione believes we will have help, of a kind.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'stair', 'THE STAIR', '#b9a5ff'], ['site', 'court', 'THE COURT', '#ffe9a0'], ['card', 'THE JOB', ['Keep Karsk off the Stair', 'There is a machine in the court. Do not shoot it', 'It may be persuaded']]] },
      { by: STC.ione, t: 'The keeper. It stands in the court, here. It is not dead; it is waiting. The lintel says it weighs who comes. I have been through LANTERN\'s log again. LANTERN stood in front of it for nine days and did nothing at all. Then the door opened.', show: [['unk', 'court', 'THE DOORKEEPER'], ['face', STC.door, ['Maker unknown. Older than the flood', 'Orders: keep the door, weigh who comes', 'Open to none who force it']]] },
      { by: STC.ione, t: 'So I think that is the weighing. One stands in the court, in front of it, and one does not fire. Not at it, not at anything. It is watching what you do with your guns when you are afraid. I do not think it will take nine days. LANTERN was not being shot at.', show: [['ring', 'court', 60, 'STAND · HOLD FIRE'], ['card', 'BEING WEIGHED', ['Stand in the court', 'Do not pull a trigger while you are in it', 'Karsk will be shooting at you the whole time']]] },
      { by: CREW.intel, t: 'Karsk comes from two sides. You can step out of the court and fight them like anybody else, and step back in when you have room. What you cannot do is both at once. And Commander: do not put a round into the keeper. I do not know what it does about that and I do not wish to learn.', show: [['foe', 'k1', 'KARSK COLUMN'], ['foe', 'k2', 'KARSK COLUMN'], ['route', ['k1', 'stair'], '#ff5a3a'], ['route', ['k2', 'court'], '#ff5a3a']] },
      { by: CREW.chief, t: "Standing still under fire with your thumbs off the triggers. I've known pilots couldn't do that for a count of five. If it gets too much, boss, walk out, shoot something, walk back. No shame in it.", shot: 'who' },
      { t: 'Hold the Stair. Earn the keeper if you can. If you cannot, we do it the usual way, and it will be a long night.', show: [['clear'], ['site', 'stair', 'THE STAIR', '#b9a5ff'], ['ring', 'court', 60, 'THE COURT'], ['foe', 'k1', 'KARSK'], ['foe', 'k2', 'KARSK']] },
    ],
    async run(ms) {
      const S = ms.S, ione = STC.ione, rask = STC.rask, dk = STC.door, xo = ms.ops, v = ms.v, kp = { name: 'KARSK SIEGE' }, lamp = dsStair(S.stair), T = stTrig(); dsWater(-4, 1); lamp.emissiveIntensity = .6; v.trust = 0; let woke = false, W = [];
      const D = stBig(mkMech(S.court.x, S.court.z, { ...DS_CFG, paint: DS_OLD }, 2, { ai: 'hold', name: 'THE DOORKEEPER', hpK: 3.2, skill: 1.6, yaw: stAng(S.stair, S.court) }), 1.4); D.pacify = true; if (D.mech.mats.glow) D.mech.mats.glow.emissiveIntensity = .15; fieldWho(dk, D);   /* not invulnerable: a round that lands on it has to be noticed (damage() ignores what it cannot hurt). It is made good every frame instead */
      const ring = stRing(S.court, 52, 0xffe9a0, .9); nav('c', S.court, 'THE COURT', '#ffe9a0'); setObj('m', 'Keep Karsk off the Stair');
      await until(() => near(S.court, 130)); look(D, 'THE DOORKEEPER'); await tell(ione, 'There. In the court. It is looking at the door, not at us. I do not think it has looked at anything else for a thousand years.');
      setObj('g', 'Walk into the court'); const t0 = ms.t; (async () => { await until(() => near(S.court, 52)); setObj('g', null, 1); tell(dk, 'THE DOOR IS KEPT. YOU CARRY ARMS TO IT. STAND, AND BE WEIGHED.'); })(); await until(() => near(S.court, 52) || ms.t > t0 + 40);   /* Karsk comes whether or not anybody has gone in */
      setObj('t', () => woke ? 'THE DOORKEEPER HAS WEIGHED YOU' : `Stand in the court and hold your fire — WEIGHED ${stBar(v.trust)}`);
      stTick(dt => { if (ms.over || woke) return false; D.hp = D.max; if (D.hitP > 0) { D.hitP = 0; v.trust = Math.max(0, v.trust - 40); msg('YOU FIRED ON THE DOORKEEPER', 3.5); chatter(dk, 'THAT IS NOTED.'); } if (near(S.court, 52)) { if (ms.t - T.t < .2) { v.trust = Math.max(0, v.trust - 12); msg('IT IS WATCHING YOUR GUNS', 2.5); } else if (ms.t - T.t > 3) v.trust = Math.min(100, v.trust + dt * 3.4); } return true; });
      const wave = (k, a) => { const L = stFrom(k, S.court, a, 240, { ...kp, focus: PE }); W = W.concat(L); return L; };
      look(wave(.7, stAng(S.court, S.k2))[0], 'KARSK SIEGE COLUMN'); sfx.play('alarm');
      await tell(rask, 'Raskova. I said I would bring something that opens doors. Sister, stand your escort aside. That machine in the court is Directorate property as of this morning, and so is what it is guarding.');
      (async () => { await after(34); if (!ms.over && !woke) { wave(.9, stAng(S.court, S.k1)); chatter(xo, 'Second column, from the Spring side. You are allowed to step out of that court and shoot them, Commander. It will still be there when you step back.'); } await after(46); if (!ms.over && !woke) { wave(1, stAng(S.court, S.k2) + .6); chatter(ione, 'It turned its head. Just then. It turned its head and looked at you. Please do not stop.'); } })();
      (async () => { await until(() => v.trust >= 50 && !woke); chatter(dk, 'YOU ARE STRUCK AND DO NOT STRIKE. THIS IS WRITTEN DOWN.'); })();
      await until(() => v.trust >= 100 || (ms.t > 95 && !alive(W)));
      if (v.trust >= 100) {
        woke = true; FD.scene.remove(ring); setTeam([D], 0, { pacify: false, inv: false, ai: 'follow', lead: PE, alert: true }); stKeep(D, dk, 'I AM STRUCK DOWN. THE DOOR IS STILL KEPT. I AM SITTING IN FRONT OF IT.'); if (D.mech.mats.glow) D.mech.mats.glow.emissiveIntensity = 3; lamp.emissiveIntensity = 3; flashAt(D.pos, 0xffe9a0, 500, 220, .6); P.shake += .5; look(D, 'THE DOORKEEPER — AWAKE');
        await tell(dk, 'WEIGHED. YOU STOOD AT A DOOR UNDER FIRE AND DID NOT FORCE IT. THESE OTHERS HAVE COME TO FORCE IT. STAND ASIDE. I HAVE NOT DONE THIS FOR SOME TIME.'); chatter(ione, 'It is MOVING. Oh, Commander. Oh, I am going to need a larger sheet of paper.');
      } else await tell(ione, 'It has not moved. I was so sure. ...No matter. You have kept them off it, and that is what we were paid for. I think it only wanted to see whether you could help yourself.');
      unnav('c'); setObj('t', null, woke ? 1 : 3);
      /* the Colonel, with the thing that opens doors */
      const [rx, rz] = stOff(S.court, stAng(S.court, S.k1), 230); let Rk = null; dropship(rx, rz, () => { Rk = stBig(mkMech(rx, rz, { ...PRESETS[16], paint: FAC.kar.paint }, 1, { name: 'COL. RASKOVA', hpK: 2.2, skill: 1.35 }), 1.15); Rk.alert = true; fieldWho(rask, Rk); W = W.concat(hot1(foes(woke ? 1.2 : .8, rx, rz, 6, 40, kp))); nav('rk', Rk, 'RASKOVA', '#ff5a3a'); }, undefined, 1);
      await until(() => Rk); look(Rk, 'COL. RASKOVA'); await tell(rask, woke ? 'It WALKS. Then it is worth ten times the requisition. All units: the legs. I want it taken, not broken.' : 'Still standing there like a statue. Good. Then it will not mind being crated. All units: the escort first.');
      setObj('r', () => `Break the siege column — ${alive(W) + (Rk.dead ? 0 : 1)} left`); await until(() => Rk.dead && alive(W) <= 1); unnav('rk'); setObj('r', null, 1); setObj('m', null, 1); stSet('door', woke ? 1 : 0);
      const opts = ['Seal it. Draw the valley as rock.', 'Open it. The Ordo has waited long enough.']; if (woke) opts.push('Ask the Doorkeeper.');
      const r = await ask(ione, 'Karsk is gone, and the door is still shut. I can take a true map back to the Map Room, and they will be here with a thousand brothers by the feast. Or I can draw rock, and nobody comes. I have never drawn a false map. It is your valley as much as mine tonight.', opts, 28, 0); stSet('end', r + 1);
      if (r === 2) { await tell(dk, 'THE DOOR IS NOT FOR OPENING. THE DOOR IS FOR KEEPING SHUT. WHAT IS BEHIND IT IS ASLEEP. LET IT.'); await tell(dk, 'THE LAST WHO STOOD HERE LEFT THIS IN MY KEEPING AND DID NOT RETURN FOR IT. YOU STOOD. IT IS YOURS. NOW GO, AND LET ME WATCH.'); chatter(ione, 'Then I shall draw rock. And I shall draw it beautifully.'); }
      else if (r === 0) await tell(ione, 'Rock. Then it is rock. I shall keep the true sheet in my sleeve and I shall take it out sometimes, and look at it, and put it back.' + (woke ? ' It nodded. Did you see? It nodded.' : ''));
      else await tell(ione, woke ? 'Then I shall bring them. ...It has stepped in front of the door, Commander. It heard you. I think the Ordo is going to be weighed as well, and I am not at all sure of the result.' : 'Then I shall bring them. A true map. It is what I am for. I hope it is what the door is for.');
      win(woke ? 'The Karsk siege column was broken at the foot of the Stair by a mercenary company and a machine nobody can date, which then walked back to its court and stood down.' : 'The Karsk siege column was broken at the foot of the Stair. The machine in the court watched all of it and did not move.');
    },
    epi: (ok, f) => ok ? [
      [STC.ione, f['stair.end'] === 2 ? 'Ione. The Abbot is coming with the whole house. I have told them how one is weighed. They did not like it. A thousand brothers standing still and holding their fire: I would give a great deal to draw that.' : 'Ione. The Map Room has a sheet that shows a valley full of rock, and I have one that does not. I find I can live with it. I did not think I could.'],
      f['stair.door'] ? [STC.door, f['stair.end'] === 3 ? 'THE DOOR IS KEPT. YOU ARE KNOWN TO IT. THAT IS ALL.' : 'THE DOOR IS KEPT.'] : [CREW.intel, 'It never moved. I have gone through the gun camera frame by frame. It was watching you the whole time, Commander. I think you were weighed. I think it has not finished deciding.'],
      [CREW.chief, f['stair.end'] === 3 ? "That thing it gave you, boss. I've had it on the bench. There's no maker's mark, no serial, and it's older than the alloy it's made of ought to be. It works, mind. It works better than ours." : "Did you see the size of it, boss? I'd give a year's pay for an hour with a spanner and that knee joint. I'd not get the hour. I know."],
    ] : [[STC.ione, 'Ione. They have the stair, but they have not got the door, and the keeper has not moved. Raskova is waiting for cutting gear. We have until it arrives.']],
    prize(D, add, f) { stGift(D, f['stair.end'] === 3 ? 'arm.io2' : 'arm.ar1', 1); stGift(D, 'gear.core', 1); repAdd('ord', f['stair.end'] === 2 ? 8 : 4, f['stair.end'] === 2 ? 'gave the Ordo the Drowned Stair' : 'held the Drowned Stair'); repAdd('kar', -6, 'broke a siege column at the Stair'); },
  }],
};

/* ---- THE SATO FILE: a watch patrol walks between two corners with a ring round it. Inside the ring it is looking at you ---- */
function sfWatch(a, b, v) {
  const e = stWalker(a, { ...PRESETS[8], paint: FAC.hel.paint }, 2, { name: 'CITY WATCH', pace: .5, hpK: 1.5, skill: 1.1 }); e.walk([b]); e.ring = stRing(a, v.seeR, 0xffb21a, 1); let leg = 0;
  stTick(() => { if (MS.over || e.dead) { FD.scene.remove(e.ring); return false; } e.ring.visible = e.team === 2; e.ring.position.set(e.pos.x, e.pos.y + .6, e.pos.z); if (e.team === 2 && e.done) { leg ^= 1; e.walk([leg ? a : b]); } return true; });
  return e;
}
STORY.file = {
  name: 'THE SATO FILE', sub: 'Mira has an uncle. He is selling the family silver', col: '#c8c8d8', emp: 'hel', foe: 'vom', who: CREW.intel, forN: 'Mira Sato', vsN: 'Section Nine, retired', payer: 'M. SATO, PERSONAL ACCOUNT',
  after: ['dead'], wait: 12, flags: ['quiet', 'file'],
  fin: 'A retired Helion intelligence officer attempted to sell the complete records of Section Nine at a disused listening station on the Varn ice. The sale did not complete. Nobody involved has confirmed that it was ever offered.',
  end: 'Mira has taken one evening off. She spent it in the bar, with her back to the wall, reading nothing. Dutch says he has never seen her do that.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'Dead Drops', kind: 'recon', biome: 'urban', mood: 0, tod: 'night', seed: 96711, diff: 3, pay: 90000, salv: 10, site: 'Halcyon Row', op: 'QUIET HANDS', solo: true,
    tease: 'Mira Sato does not talk about what she did before the yard. Tonight she has to. Her old section chief, Desmond Pryce, whom the whole of Section Nine called Uncle, has retired with the section\'s files and is selling them: every asset, every name. He has left the terms for his buyers in three dead drops in Halcyon Row. Mira knows where he likes to put a dead drop. The Row is patrolled by the city watch, who are not the enemy and must not be made into one.',
    wire: 'No wire. This one came across the deck by hand, from Mira Sato, folded twice. It says: "Personal. I will pay. Do not put it on the board." It is on the board.',
    sites: { lz: [-620, 420, 40, 'LZ'], d1: [-240, 160, 30, 'DEAD DROP'], d2: [120, -60, 30, 'DEAD DROP'], d3: [410, -330, 30, 'DEAD DROP'], w1: [-420, -40, 20], w2: [-60, 330, 20], w3: [300, 130, 20], w4: [-80, -250, 20], w5: [560, -120, 20], w6: [200, -470, 20] },
    face: 'd2',
    brf: [
      { t: 'I have been asked to leave the room for this one, and I have refused. Mira.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['card', 'THE JOB', ['Read three dead drops in Halcyon Row', 'Do not be noticed by the city watch', 'One machine. Client: Mira Sato']]] },
      { by: CREW.intel, t: 'Before the yard I worked for Helion, in a section that does not have a number on any door. Section Nine. The man who ran it was Desmond Pryce. We called him Uncle. He taught me everything on this deck that I am good at.', show: [['face', STC.pryce, ['Desmond "Uncle" Pryce', 'Ran Helion Section Nine for nineteen years', 'Retired last month. Took the files']]] },
      { by: CREW.intel, t: 'He is selling the section\'s records. All of them. He has left terms for the bidders in three dead drops in Halcyon Row, because that is how he was taught and how he taught me. I know his habits. A drainpipe. A lamp standard. A cornerstone. Here, here and here.', show: [['site', 'd1', 'DEAD DROP', '#c8c8d8'], ['site', 'd2', 'DEAD DROP', '#c8c8d8'], ['site', 'd3', 'DEAD DROP', '#c8c8d8'], ['route', ['lz', 'd1', 'd2', 'd3'], '#c8c8d8']] },
      { by: CREW.intel, t: 'The Row has a city watch. Three patrols, walking fixed beats. They are honest people doing a dull job and they are not to be hurt. Each can see about eighty metres. If you stand in that, they begin to wonder. If you fire a weapon anywhere, they wonder a great deal.', show: [['unk', 'w1', 'WATCH'], ['unk', 'w3', 'WATCH'], ['unk', 'w5', 'WATCH'], ['route', ['w1', 'w2'], '#ffb21a'], ['route', ['w3', 'w4'], '#ffb21a'], ['route', ['w5', 'w6'], '#ffb21a'], ['card', 'THE WATCH', ['A ring on the ground is how far each can see', 'Inside a ring: suspicion rises', 'A shot fired: it jumps', 'At full, they come for you. Do not shoot them']]] },
      { by: CREW.chief, t: "A sixty-tonne machine, tiptoeing. Boss, I have seen everything now. Go in behind them, not in front, and wait at corners. They're on a beat. A beat's a clock.", shot: 'who' },
      { t: 'Three drops and out, unseen if it can be done. If it cannot, it can still be done. But Pryce will know somebody read his mail, and he will be ready for us.', show: [['clear'], ['site', 'd1', 'DROP', '#c8c8d8'], ['site', 'd2', 'DROP', '#c8c8d8'], ['site', 'd3', 'DROP', '#c8c8d8'], ['route', ['w1', 'w2'], '#ffb21a'], ['route', ['w3', 'w4'], '#ffb21a'], ['route', ['w5', 'w6'], '#ffb21a']] },
    ],
    async run(ms) {
      const S = ms.S, mira = CREW.intel, pry = STC.pryce, xo = ms.ops, v = ms.v, T = stTrig(); v.sus = 0; v.seeR = 78; v.loud = false; let shots = 0;
      const Wt = [['w1', 'w2'], ['w3', 'w4'], ['w5', 'w6']].map(([a, b]) => sfWatch(S[a], S[b], v)), seen = () => Wt.some(e => !e.dead && stDist(e.pos, P.pos) < v.seeR);
      for (const k of ['d1', 'd2', 'd3']) stBeacon(S[k], 0x8a8fa8);
      setObj('q', () => v.loud ? 'THE WATCH IS ON TO YOU' : `Stay out of the rings — SUSPICION ${stBar(v.sus)}`);
      stTick(dt => { if (ms.over || v.loud) return false; if (T.n > shots) { v.sus += 14 * (T.n - shots); shots = T.n; msg('A SHOT IN THE ROW — THE WATCH HEARD THAT', 2.5); } if (Wt.some(e => e.hitP > 0)) v.sus = 100; v.sus = clamp(v.sus + (seen() ? 15 : -2.5) * dt, 0, 100); if (v.sus < 100) return true;
        v.loud = true; msg('THE WATCH HAS CALLED IT IN', 4); sfx.play('alarm'); setTeam(Wt, 1, { pacify: false, alert: true, halt: true, ai: 'hunt' }); for (const e of Wt) e.road = []; hot1(spawn({ tank: 2, drone: 2 }, P.pos.x, P.pos.z, 170, 240, 1, { name: 'CITY WATCH' })); chatter(mira, 'That is the alarm. They have you. Finish the drops, quickly now, and try not to kill them. They are only the watch. ...He will know by morning.'); return false; });
      await after(3); chatter(mira, 'You are in the Row. I am on the channel and I will keep my voice down. The drainpipe first. Wait for the patrol to turn its back.');
      (async () => { await until(() => v.sus > 45 && !v.loud); chatter(mira, 'They are looking your way. Break the line. Put a building between you and the ring and stand still.'); })();
      const say3 = ['The drainpipe. A film can, taped inside. Opening bid, in Helion scrip. He always did start high. The lamp standard next.', 'The lamp standard. A list of bidders. Vance-Okoro. Karsk. A third name I am not going to say on an open channel. The cornerstone.', 'The cornerstone. That is the place and the hour. Station Nine, on the Varn ice. He is holding the sale in our old listening post. Of course he is. He is sentimental.'];
      for (const [i, k] of ['d1', 'd2', 'd3'].entries()) { nav('d', S[k], 'DEAD DROP', '#c8c8d8'); if (i) hot1(spawn({ drone: 2, v: 'scr' }, S[k].x, S[k].z, 30, 70, 1, { name: "PRYCE'S SPOTTER" })); await stHold('d' + i, S[k], 26, 6, `Read dead drop ${i + 1}`); chatter(mira, say3[i]); }
      nav('d', S.lz, 'OUT', '#8dff6a'); setObj('o', 'Leave the Row the way you came'); await until(() => near(S.lz, 80)); unnav('d'); setObj('o', null, 1); setObj('q', v.loud ? 'The watch saw all of it' : 'Nobody saw a thing', v.loud ? 2 : 1); stSet('quiet', v.loud ? 0 : 1);
      if (!v.loud) stPay('Nobody saw a thing', 20000);
      await tell(pry, v.loud ? 'Mira, my dear. That was you in the Row tonight, or somebody you sent, and they were seen from one end of it to the other. I taught you better. Never mind. I shall see you at the sale, and I shall have company.' : 'Somebody has read my post. I can always tell: the tape goes back on a little too neatly. Mira? Is that you, my dear? No, do not answer. If it is you, I shall not see you coming. I taught you that.');
      win(v.loud ? 'All three dead drops were read. The city watch of Halcyon Row has filed a report eleven pages long, and Desmond Pryce has a copy.' : 'All three dead drops were read and put back. The city watch of Halcyon Row reports a quiet night.');
    },
    epi: (ok, f) => ok ? [
      [CREW.intel, f['file.quiet'] ? 'He does not know it was us. He suspects, but he suspects everybody, it is his whole method. Station Nine, the Varn ice, at dusk. I am coming on this one. In the dropship. I need to read what he is selling before anybody buys it.' : 'He knows. He will bring minders now. I am sorry: that was my plan and it was a good plan and the Row is a difficult place. Station Nine, the Varn ice, at dusk. I am coming on this one.'],
      [CREW.xo, 'She has not told you what is in the file, and I am not going to ask her. I will only say that in nine years I have never seen Mira Sato pay for anything out of her own pocket.'],
      [CREW.chief, f['file.quiet'] ? "Not a scratch and not a round fired. I checked the counters. Boss, I didn't know she could do quiet." : "A few new holes, boss. Watch calibre. They weren't trying very hard, bless them. I'll have her right by morning."],
    ] : [[CREW.intel, 'He has moved the drops. He always moves them on the third night. I know where to. Once more, please, and slower.']],
    prize(D, add, f) { stGift(D, 'back.ecm', 1); },
  }, {
    /* ---------------- II ---------------- */
    title: 'Burn Notice', kind: 'garrison', biome: 'glacial', mood: 0, tod: 'dusk', seed: 96727, diff: 4, pay: 170000, salv: 30, site: 'Station Nine', op: 'LAST POST',
    tease: 'Station Nine is a listening post on the Varn ice that Helion closed eleven years ago and Section Nine never quite gave back. Desmond Pryce is holding his sale there at dusk. The whole of the section\'s records are in the archive mast: who it ran, who it paid, and who it burned. Madame Vandermeer of Vance-Okoro has already put money down. Mira Sato wants to read it before anyone owns it. She has not said what she will do after that, and she has asked you to decide for her if she cannot.',
    wire: 'Still no wire. A second note from Mira Sato: "Dusk. Bring whatever you would bring to a funeral."',
    sites: { lz: [-600, 420, 40, 'LZ'], st9: [60, -40, 70, 'STATION NINE'], east: [620, -200, 40, 'THE ICE ROAD'], west: [-380, -480, 40, 'THE MORAINE'] },
    face: 'st9',
    brf: [
      { t: 'Station Nine. A closed listening post, a retired spy, and a sale. Mira will be aboard the dropship with a reader. This is her operation. I am only here to tell you where to land.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'st9', 'STATION NINE', '#c8c8d8'], ['card', 'THE JOB', ['Reach the archive before the buyers', 'Hold it while Mira reads it', 'Then decide what becomes of it']]] },
      { by: CREW.intel, t: 'The archive is the mast in the middle of the station. Everything Section Nine ever did is in it. Get me close and keep me close: the reader needs about twenty seconds of you standing beside it. After that I will know what he is selling. I think I already do.', show: [['ring', 'st9', 60, 'STAND BY THE MAST']] },
      { by: CREW.intel, get t() { return stFlag('file.quiet') ? 'Desmond will be there, in an old scout he has had since before I was recruited. He does not know we are coming. He will be alone. He will talk. Let him. He will not fight; he has never fired a weapon in his life. He has people for that, and tonight he has not brought them.' : 'Desmond will be there, in an old scout he has had since before I was recruited. He knows we are coming, because of the Row. He has hired minders. He will not fight himself; he has never fired a weapon in his life. But we will have to go through them to reach the mast.'; }, show: [['face', STC.pryce, ['Will not fight. Will talk', 'Do not shoot him. Mira asks it', 'He taught her everything']]] },
      { by: CREW.intel, t: 'The buyers. Vance-Okoro private intelligence comes up the ice road with a retrieval team. Madame Vandermeer has paid a deposit and considers the archive hers. There may be a second bidder from the moraine. Neither will be pleased to find us reading the goods.', show: [['foe', 'east', 'VANCE-OKORO'], ['unk', 'west', 'SECOND BIDDER?'], ['route', ['east', 'st9'], '#ff5a3a'], ['route', ['west', 'st9'], '#ff5a3a']] },
      { by: CREW.chief, t: "It's the ice, boss, so she'll run as cool as she ever will. Fire what you like. I'll say this and then I'll shut up: look after Mira. She's not been right all week.", shot: 'who' },
      { t: 'To the mast. Hold while she reads. And then, Commander, I think she is going to ask you a question, and I think you should answer it as yourself and not as her employer.', show: [['clear'], ['ring', 'st9', 60, 'STATION NINE'], ['foe', 'east', 'VANCE-OKORO'], ['unk', 'west', 'SECOND BIDDER?']] },
    ],
    async run(ms) {
      const S = ms.S, mira = CREW.intel, pry = STC.pryce, vd = STC.vdm, xo = ms.ops, quiet = stFlag('file.quiet'), vp = { paint: FAC.vom.paint, name: 'V-O RETRIEVAL' }, grey = { n: 'NINE', pri: 0x8a8f98, sec: 0x474b52, acc: 0xc8c8d8, glow: 0xdfe6ff };
      const arc = mkStruct('comm', S.st9.x, S.st9.z, 2, { name: 'THE ARCHIVE', hpK: 1.6 }); arc.inv = true; for (const [x, z] of [[-34, 16], [30, 24]]) mkStruct('bunker', S.st9.x + x, S.st9.z + z, 2, { name: 'STATION NINE' }).inv = true; stBeam(S.st9, 0xc8c8d8, 200, 1.4);
      const Pr = mkMech(S.st9.x + 26, S.st9.z - 18, { ...PRESETS[6], paint: grey }, 2, { ai: 'hold', name: 'UNCLE PRYCE', hpK: 2, yaw: stAng(S.st9, S.lz) }); Object.assign(Pr, { pacify: true, inv: true }); fieldWho(pry, Pr);
      nav('a', arc, 'THE ARCHIVE', '#c8c8d8'); setObj('m', 'Reach the archive before the buyers do');
      if (!quiet) { const G = foes(.9, S.st9.x, S.st9.z, 20, 70, { name: "PRYCE'S MINDER", ai: 'guard' }); await until(() => near(S.st9, 260)); look(G[0], "PRYCE'S MINDERS"); await tell(pry, 'There you are. I am afraid I have had to take on staff, Mira, after the Row. They are not subtle men. Do try not to let them damage the mast; it is worth a great deal more than they are.'); setObj('g', () => `Clear Pryce's minders — ${alive(G)} left`); await until(() => !alive(G)); setObj('g', null, 1); }
      await until(() => near(S.st9, 90)); look(Pr, 'UNCLE PRYCE');
      await tell(pry, quiet ? 'Good heavens. Mira? In a mercenary\'s dropship? I did not see you coming. Well done. No, I mean it, well done. Come and stand by the mast, my dear. You will want to read it. Everybody does.' : 'And here she is. Come and stand by the mast, my dear. You will want to read it before you decide to be angry.');
      await tell(mira, 'Desmond. Do not call me that. Commander, beside the mast, please. Twenty seconds.');
      setObj('m', null, 1); const h = stHold('h', S.st9, 56, 20, 'Stand by the mast while Mira reads the archive'); await after(5);
      let W = stFrom(.8, S.st9, stAng(S.st9, S.east), 240, { ...vp, focus: PE }); look(W[0], 'VANCE-OKORO RETRIEVAL'); sfx.play('alarm');
      await tell(vd, 'Vandermeer. I have paid a deposit on that mast, and I find a third party plugged into it. Mister Pryce, this is not the exclusivity we discussed. Retrieval team: remove the third party. Do not scratch the goods.');
      chatter(pry, 'Oriel, I do apologise. Family. You know how it is.'); await h;
      await tell(mira, 'I have it. ...It is all here. Every asset Section Nine ever ran, and what became of each of them. Every operation. Page one is a list of officers. I am the fourth name. There is a column beside it headed "burned". He has kept score.');
      await tell(pry, 'I kept RECORDS, Mira. Somebody had to. You were very good. Eleven in that column are yours, and every one of them was necessary. I should have thought you would want that written down somewhere.');
      W = W.concat(stFrom(.9, S.st9, stAng(S.st9, S.west), 240, { paint: FAC.kar.paint, name: 'SECOND BIDDER', focus: PE })); msg('A SECOND BIDDER — FROM THE MORAINE', 3.5); await until(() => alive(W) <= 1);
      const r = await ask(mira, 'Commander. I can burn it: every name in it is safe, and so is every crime. I can keep it: then I own what he owned, and I become him. Or it goes back to Helion, who will bury it and promote somebody. I have been looking at it too long. Tell me.', ['Burn it.', 'Keep it. You are not him.', 'It goes back to Helion.'], 30, 0); stSet('file', r + 1);
      if (r === 0) { Object.assign(arc, { inv: false, team: 1, name: 'THE ARCHIVE — BURN IT' }); arc.hp = arc.max = 260; setObj('b', 'Burn the archive'); nav('a', arc, 'BURN IT', '#ff5a3a'); await tell(mira, 'Burn it. Yes. Put a round through the mast, Commander. I would do it myself and I find I cannot lift my hand.'); await until(() => arc.dead); setObj('b', null, 1); chatter(pry, 'Nineteen years. Well. I suppose that is one way to keep a secret.'); }
      else if (r === 1) { await stHold('k', S.st9, 56, 14, 'Stand by the mast while Mira pulls the core'); await tell(mira, 'I have the core. It is the size of my hand. Nineteen years, eleven of them mine. I will keep it where I can see it. And I will never, ever sell it. Remind me I said so.'); }
      else { const [hx, hz] = stOff(S.st9, stAng(S.st9, S.lz), 70); dropship(hx, hz, null, undefined, 0); await stHold('k', S.st9, 70, 14, 'Hold the station for the Helion recovery flight'); stPay('Helion Combine, finder\'s fee', 55000); await tell(mira, 'Helion has it. They have thanked me, formally, on a channel I did not know they still had for me. It will be in a vault by midnight and nobody will ever read page one again. That will have to do.'); }
      unnav('a');
      /* Madame's second team, for the mast or for whoever spoiled it */
      const [dx, dz] = stOff(S.st9, stAng(S.st9, S.east), 180); let Bs = null; dropship(dx, dz, () => { Bs = mkMech(dx, dz, { ...PRESETS[15], paint: FAC.vom.paint }, 1, { name: 'V-O RETRIEVAL LEAD', hpK: 1.9, skill: 1.3 }); Bs.alert = true; W = W.concat([Bs], hot1(foes(.9, dx, dz, 6, 36, vp))); }, undefined, 1);
      await until(() => Bs); look(Bs, 'VANCE-OKORO RETRIEVAL'); await tell(vd, r === 0 ? 'You have BURNED it. Do you know what I paid? Retrieval: I want the deposit back out of somebody. Start with the mercenary.' : 'That archive is paid for. Retrieval: take it off them. All of it, and the woman who read it.');
      setObj('v', () => `See off the retrieval team — ${alive(W)} left`); await until(() => alive(W) <= 1); setObj('v', null, 1);
      await tell(mira, 'Desmond. Go. I am not going to hand you to anyone, and I am not going to forgive you. Walk out across the ice and do not ever put a letter in a drainpipe again. I will know. You taught me how.'); Pr.pacify = true; leave([Pr]);
      await tell(pry, 'Yes. I rather think you would. ...You were the best of them, Mira. I say it because it is in the file, and you have just' + (r === 0 ? ' burned the file.' : r === 1 ? ' taken the file.' : ' given away the file.') + ' Goodbye, my dear.');
      win(r === 0 ? 'The records of Helion Section Nine burned with the mast at Station Nine. Nobody owns them. Nobody ever will.' : r === 1 ? 'The records of Helion Section Nine left Station Nine in the pocket of the fourth name on page one.' : 'The records of Helion Section Nine went back to the Combine in a sealed case, and have not been heard of since.');
    },
    epi: (ok, f) => ok ? [
      [CREW.intel, f['file.file'] === 1 ? 'It is gone. Eleven names in my column and I can no longer prove a single one of them. I thought that would feel like getting away with something. It feels like putting something down. Thank you for saying it for me.' : f['file.file'] === 2 ? 'It is in the deck safe. You have the other key. I asked Dutch to cut it so that it needs both. If I ever ask you for yours, Commander, say no, and remind me of tonight.' : 'Helion has it. I have had a letter. It offers me my old desk. I have framed it and hung it over the one I have. I am not going.'],
      [CREW.xo, 'She came and sat on the deck afterwards and did not say anything for an hour. Then she did the weather for tomorrow. I think that is as near as we will get, and I think it is quite near.'],
      [CREW.chief, "She asked me how you were, boss. Mira. Asked ME. I said you were all right. I said she was, and all. I think that's what she was asking."],
    ] : [[CREW.intel, 'The sale did not complete. He has put it back a day. So have I. Please.']],
    prize(D, add, f) { const r = f['file.file']; stGift(D, r === 2 ? 'gear.core' : 'gear.kit', r === 2 ? 2 : 1); stGift(D, 'head.arr', 1); add('M. Sato, personal account', 18000); if (r === 3) repAdd('hel', 8, 'returned the Section Nine archive'); else repAdd('hel', -3, r === 1 ? 'burned the Section Nine archive' : 'kept the Section Nine archive'); repAdd('vom', -5, "spoiled Madame Vandermeer's purchase"); },
  }],
};
