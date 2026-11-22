/* ============ STORY THREADS 6 TO 9 — FURROW, OPEN SEASON, SOMETHING BORROWED AND THE NINE-FORTY: THE FOUR THAT COME IN WHEN MARIGOLD OR THE GREATEST SHOW IS CLOSED ============ */
/* None of these four is on a new company's board. Each names the thread that has to be finished first in `after` (260_story.js): MARIGOLD opens FURROW and OPEN SEASON, THE GREATEST SHOW opens
   SOMETHING BORROWED and THE NINE-FORTY. They are two chapters apiece, and each is built round one thing the others do not do: a plough-train that fights beside you, a hunter who cannot be hurt until his
   paperwork is burned, a wedding at which nobody may be killed, and a train that has to be stopped without touching one of its cars */
Object.assign(STC, {
  wren: { name: 'Wren Achterberg', first: 'Wren', last: 'Achterberg', role: 'BRIGHT ACRE CO-OPERATIVE · FIELD BOSS', seed: 9401, col: '#c8e06a' },
  furrow: { name: 'FURROW', first: 'Furrow', last: 'Furrow', role: 'PLOUGH-TRAIN · AUTOPILOT', seed: 9403, col: '#e8c070' },
  prewitt: { name: 'Factor Lucan Prewitt', first: 'Lucan', last: 'Prewitt', role: 'VANCE-OKORO · LAND AND TITLE', seed: 9405, col: '#ffb21a' },
  crowe: { name: 'Ignatius "the Magistrate" Crowe', first: 'Ignatius', last: 'Crowe', role: 'LICENSED RECOVERY AGENT', seed: 9411, col: '#d8c8a0' },
  tench: { name: 'Recovery Clerk Aldous Tench', first: 'Aldous', last: 'Tench', role: 'VANCE-OKORO · ASSET RECOVERY, FORMS', seed: 9413, col: '#ffcf7a' },
  flor: { name: 'Florian Okonjo-Bell', first: 'Florian', last: 'Okonjo-Bell', role: 'WEDDINGS OF DISTINCTION', seed: 9421, col: '#ffd0e8' },
  zofia: { name: 'Capt. Zofia Radek', first: 'Zofia', last: 'Radek', role: 'KARSK 4TH ARMOURED · THE BRIDE', seed: 9423, col: '#ff8a6a' },
  teo: { name: 'Teo Anselm', first: 'Teo', last: 'Anselm', role: 'HELION COMBINE · THE GROOM', seed: 9425, col: '#8fd8ff' },
  bruno: { name: 'Lt. Bruno Vane', first: 'Bruno', last: 'Vane', role: 'KARSK 4TH ARMOURED · NOT INVITED', seed: 9427, col: '#ffb09a' },
  brandl: { name: 'Paymaster-Major Oskar Brandl', first: 'Oskar', last: 'Brandl', role: 'KARSK DIRECTORATE · THE NINE-FORTY', seed: 9431, col: '#ff6a4a' },
});
Object.assign(CAST, {
  9401: { build: 'broad', h: 1.72, habit: 'hips', ...stLook('#7a4a1e', 3, '', '#e0ac69') }, 9403: { bot: true }, 9405: { build: 'lean', h: 1.8, habit: 'back', ...stLook('#1b1b1b', 0, 'glasses', '#f1c9a5') },
  9411: { build: 'heavy', h: 1.9, habit: 'back', ...stLook('#e8e8e8', 0, 'beard', '#8d5524') }, 9413: { build: 'slim', h: 1.66, habit: 'cross', ...stLook('#b8b8b8', 2, 'glasses', '#ffdbac') },
  9421: { build: 'slim', h: 1.74, habit: 'hips', ...stLook('#c9a24a', 0, 'headset', '#8d5524') }, 9423: { build: 'lean', h: 1.78, habit: 'stand', ...stLook('#3b2416', 3, 'scar', '#f1c9a5') },
  9425: { build: 'avg', h: 1.7, habit: 'cross', ...stLook('#1b1b1b', 1, 'glasses', '#c68642') }, 9427: { build: 'broad', h: 1.86, habit: 'hips', ...stLook('#7a1e1e', 0, '', '#ffdbac') },
  9431: { build: 'heavy', h: 1.75, habit: 'back', ...stLook('#b8b8b8', 4, 'beard', '#f1c9a5') },
});
Object.assign(VOX_CAST, {
  wren: { f0: 178, tr: 1.02, rate: 4.6, range: 6, brass: .34, rough: .3, crisp: .95, tilt: 2700, lilt: 1, dip: .3, ph: ['wwbbddhhml.', 'aaooEu', '.....nm'], emo: ['ha', 'hm', 'oh'], emoP: .2 },                    /* Wren Achterberg: outdoors all her life, and talks as if you were across a field */
  furrow: { f0: 88, tr: .84, rate: 3, range: .8, brass: .8, rough: .2, crisp: .5, stac: .8, tilt: 1700, lilt: .1, dip: 0, ph: ['ddbbggmn.', 'ooUUuE', '....mnk'], emo: ['hm'], emoP: .02 },                                   /* FURROW: a tractor that has been taught to report */
  prewitt: { f0: 152, tr: 1, rate: 5.2, range: 3, brass: .16, nas: .4, crisp: 1.35, stac: .3, tilt: 3100, lilt: .5, ph: ['ppttssffln.', 'iieeIa', '....nts'], emo: ['hm', 'ah'], emoP: .08 },                               /* Factor Prewitt: polite, and never once in the wrong */
  crowe: { f0: 82, tr: .83, rate: 3.4, range: 3.4, brass: .5, rough: .5, vib: .01, crisp: .8, stac: .2, tilt: 2000, lilt: .5, dip: .25, ph: ['ggddbbvvrm.', 'oouuaO', '....mnr'], emo: ['hm', 'grunt'], emoP: .1 },           /* the Magistrate: a judge passing sentence, slowly */
  tench: { f0: 196, tr: 1.08, rate: 6.6, range: 2.2, brass: .08, nas: .7, crisp: 1.4, stac: .5, tilt: 3300, lilt: .3, ph: ['ttppkkffsn.', 'iieeIq', '....ntk'], emo: ['eh', 'hm'], emoP: .12 },                             /* Clerk Tench: reads every word on the form, including the form number */
  flor: { f0: 204, tr: 1.08, rate: 7.2, range: 10, brass: .14, breath: .2, crisp: 1.4, tilt: 3500, lilt: 1.7, dip: .4, ph: ['ffllppttbbdR.', 'iiaaeeoy', '.....nl'], emo: ['oh', 'ah', 'ha', 'sigh'], emoP: .4 },           /* Florian: everything is a catastrophe and all of it is in hand */
  zofia: { f0: 190, tr: 1.05, rate: 4.8, range: 4.5, brass: .26, rough: .2, crisp: 1.15, stac: .45, tilt: 2900, lilt: .7, ph: ['ggddrrkkvz.', 'aaoOuE', '....rkx'], emo: ['ha', 'hm'], emoP: .12 },                         /* Capt. Radek: an armoured officer on her day off */
  teo: { f0: 160, tr: 1.02, rate: 5.6, range: 7, brass: .1, breath: .3, crisp: 1.1, tilt: 3000, lilt: 1.2, dip: .3, ph: ['llmmnnvvzj.', 'eeaaioq', '.....lns'], emo: ['ah', 'uh', 'oh', 'eh'], emoP: .35 },                  /* Teo Anselm: apologising in advance */
  bruno: { f0: 118, tr: .92, rate: 4.9, range: 7, brass: .5, rough: .4, crisp: .9, tilt: 2500, lilt: 1.2, dip: .3, ph: ['bbggddrrxh.', 'aaoOuU', '....rkx'], emo: ['ha', 'grunt', 'sigh'], emoP: .3 },                      /* Lt. Vane: has had three drinks and a speech prepared */
  brandl: { f0: 104, tr: .9, rate: 4.4, range: 3, brass: .46, nas: .3, rough: .3, crisp: 1, stac: .5, tilt: 2300, lilt: .4, ph: ['ggddbbttrk.', 'aaoouO', '....rkt'], emo: ['hm', 'grunt'], emoP: .08 },                    /* Paymaster-Major Brandl: twenty years, never a minute late */
});
Object.assign(VOX_WHO, { 9401: 'wren', 9403: 'furrow', 9405: 'prewitt', 9411: 'crowe', 9413: 'tench', 9421: 'flor', 9423: 'zofia', 9425: 'teo', 9427: 'bruno', 9431: 'brandl' });

/* ---- FURROW goes where it is led. H.to() is the place it is making for (nothing, and it stands where it is); H.stop holds it whatever it is doing. With something to fight (and on a side that fights)
   it is a centipede like any other. k is its pace: the stride goes with it ---- */
function fwLead(H, k = 1) {
  const u = H.update;
  H.update = (dt, t) => {
    const tg = H.team === 2 || !H.tgt || H.tgt.dead || (!H.alert && stDist(H.pos, H.tgt.pos) > 420) ? null : H.tgt, p = H.to ? H.to() : null, go = !H.stop && !tg && !!p && stDist(H.pos, p) > 30;
    H.pacify = !!H.stop || (!tg && !go);
    /* with nothing to chase a centipede wanders (170_units.js: its heading plus a slow sine). `det` is the detour drive() adds to wherever it wants to go; set to the bearing less that sine, it goes straight
       there. A detour drive() has set for itself, because it is stuck, is left to run */
    if (go && !(H.detT > 0)) { H.det = angDiff(H.yaw, stAng(H.pos, p)) - Math.sin(t * .5) * .4; H.detT = 1e-4; }
    u(dt * k, t);
  };
  return H;
}
const fwHull = H => `${Math.max(0, Math.round(H.hp / H.max * 100))}%`;

STORY.plow = {
  name: 'FURROW', sub: 'A plough the length of a street, and nobody driving', col: '#c8e06a', emp: 'tyr', foe: 'vom', who: STC.wren, forN: 'Bright Acre Co-operative', vsN: 'Vance-Okoro, Land and Title', payer: 'BRIGHT ACRE CO-OP',
  after: ['mar'], wait: 9, flags: ['row', 'furrow'],
  fin: 'Vance-Okoro has withdrawn its claim on the Bright Acre. The co-operative is bringing its harvest in behind a plough-train with a mercenary crest welded to the head.',
  end: 'They have sent forty kilos of flour and a thank-you note signed by a plough. Dutch has framed the note.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'Straight Lines', kind: 'recon', biome: 'forest', mood: 0, tod: 'day', seed: 96011, diff: 2, pay: 110000, salv: 25, site: 'the Bright Acre', op: 'HEADLAND',
    tease: 'The Bright Acre co-operative owns one machine worth mentioning: FURROW, a plough-train eighty metres long that has turned the same fields for sixty years with nobody aboard. This morning it left the north field in a dead straight line, and the line runs through the middle of the town. FURROW follows its row markers. Somebody has moved the row markers. The co-op heard what you did for Marigold and would like the same again, cheaper.',
    wire: 'Bright Acre co-operative, open band: "Our plough is coming up the high street. This is not a figure of speech. Hiring."',
    sites: { lz: [-660, 430, 40, 'LZ'], acre: [-230, 170, 76, 'BRIGHT ACRE'], m1: [70, -60, 40, 'ROW MARKER'], m2: [360, -300, 40, 'ROW MARKER'], m3: [560, 140, 40, 'ROW MARKER'], field: [700, -470, 56, 'NORTH FIELD'] },
    face: 'acre', guests: [STC.wren],
    brf: [
      { t: 'A farming job. I have been asked to say that with a straight face. Miss Achterberg runs the fields at the Bright Acre, and she has a problem eighty metres long.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'acre', 'BRIGHT ACRE', '#c8e06a'], ['card', 'THE JOB', ['Stop a plough-train before it reaches the town', 'Do not break the plough', 'Client: a farming co-operative']]] },
      { by: STC.wren, t: "FURROW. Sixty years she's turned our ground and never put a blade wrong. She steers by three row markers and ploughs the line between them. Some clever soul has dug up all three in the night and planted them again so the line runs through my front gate.", show: [['unk', 'field', 'FURROW — MOVING'], ['route', ['field', 'acre'], '#ffb21a'], ['face', STC.furrow, ['Plough-train, autopilot', 'Eighty metres, eight segments', 'Does exactly what the markers say']]] },
      { by: CREW.intel, t: 'The three markers, where they are now. Each has a survey party sitting on it in Vance-Okoro colours, which answers the question of who. Knock a marker down and the plough loses its row and stops to think. Knock down all three and it stops for good.', show: [['foe', 'm1', 'ROW MARKER'], ['foe', 'm2', 'ROW MARKER'], ['foe', 'm3', 'ROW MARKER'], ['route', ['lz', 'm1', 'm2', 'm3'], '#8dff6a']] },
      { by: STC.wren, t: "And you'll not shoot her. I know what she looks like through a gunsight. She's all the co-op owns, and she's only doing what she's told.", show: [['card', 'FURROW', ['About five minutes from the town', 'Halts for a while each time a marker falls', 'Is not the enemy. Do not shoot the plough']]] },
      { by: CREW.chief, t: "Boss, a thing that size with a blade on the front goes through a house like the house wasn't there. I'd not dawdle at the first marker.", shot: 'who' },
      { t: 'Three markers, in whatever order suits you. The plough is not a target. I am told it is quite a nice town.', show: [['clear'], ['site', 'acre', 'BRIGHT ACRE', '#c8e06a'], ['foe', 'm1', 'MARKER'], ['foe', 'm2', 'MARKER'], ['foe', 'm3', 'MARKER'], ['route', ['field', 'acre'], '#ffb21a']] },
    ],
    async run(ms) {
      const S = ms.S, wren = STC.wren, fur = STC.furrow, pre = STC.prewitt, xo = ms.ops, vp = { paint: FAC.vom.paint, name: 'V-O SURVEYOR' }, pace = clamp(.4 + player.stats.speed * RUN / 55, .56, .9); let holdT = 0;   /* a slow machine gets a slow plough */
      for (const [x, z, k] of [[-26, 10, 'hab'], [22, -18, 'hab'], [4, 34, 'depot']]) mkStruct(k, S.acre.x + x, S.acre.z + z, 0, { name: k === 'hab' ? 'BRIGHT ACRE' : 'CO-OP STORE', hpK: 3 }).inv = true;
      const H = fwLead(mkCentipede(S.field.x, S.field.z, 2, { n: 8, hpK: 3, name: 'FURROW', yaw: stAng(S.field, S.acre) }), pace); H.to = () => S.acre; fieldWho(fur, H); nav('fw', H, 'FURROW', '#c8e06a');
      H.onKill = (e, by) => lose(by === 0 ? 'FURROW is scrap in its own field, and the gun camera says whose rounds did it. The co-op has nothing to plough with and nothing to pay with.' : 'The bailiffs have rendered FURROW safe, which is to say into lots. Vance-Okoro will have the Bright Acre by harvest.', .05);
      const Mk = ['m1', 'm2', 'm3'].map((k, i) => { const m = mkStruct('comm', S[k].x, S[k].z, 1, { name: 'ROW MARKER', hpK: .8 }); stBeam(S[k], 0xffb21a, 150, 1.2); foes(.45 + i * .12, S[k].x, S[k].z, 18, 60, { ...vp, ai: 'guard' }); spawn({ turret: 1 }, S[k].x, S[k].z, 20, 30, 1); nav(k, m, 'MARKER', '#ffb21a');
        m.onKill = () => { unnav(k); if (ms.over || !alive(Mk)) return; H.stop = true; holdT = ms.t + 24; msg('FURROW HAS LOST THE ROW — RECALCULATING', 3.5); chatter(fur, alive(Mk) === 2 ? 'FURROW. Marker lost. Halting. Recalculating row from two.' : 'FURROW. Marker lost. Halting. Recalculating row from one. Confidence is low.'); }; return m; });
      stTick(() => { if (ms.over || !alive(Mk)) return false; if (H.stop && ms.t > holdT) H.stop = false; return true; });
      const eta = () => Math.max(0, stDist(H.pos, S.acre) - 95) / (5 * pace);
      setObj('m', () => `Knock down the false row markers — ${alive(Mk)} left`); setObj('f', () => `FURROW reaches Bright Acre in ${stClock(eta())}${H.stop ? ' — halted' : ''}`);
      (async () => { await until(() => stDist(H.pos, S.acre) < 95 && alive(Mk) > 0); look(H, 'FURROW'); lose('FURROW ploughed the Bright Acre high street from the gate to the granary, in a perfectly straight line, and has gone on into the next valley.', .1); })();
      await after(3); chatter(wren, "She's left the north field. You can't miss her, she's the only thing on the Acre doing four metres a second in a straight line."); await after(9); chatter(fur, 'FURROW. Row four hundred and seven. Soil is good. Obstruction ahead: one town. Proceeding.');
      await until(() => alive(Mk) < 3); await until(() => alive(Mk) < 2); chatter(wren, "Two down. She's stopped again, I can see her from the roof. She does this little shuffle when she's thinking."); await until(() => !alive(Mk));
      H.stop = true; H.to = () => null; setObj('m', null, 1); setObj('f', 'FURROW has stopped short of Bright Acre', 1); look(H, 'FURROW');
      await tell(fur, 'FURROW. Row is lost. Holding at the headland. Awaiting markers.'); await tell(wren, `She's stopped. ${Math.round(stDist(H.pos, S.acre) / 10) * 10} metres off my gate, but she's stopped. I could kiss you. I could kiss the plough.`);
      /* and the people who moved the markers would like their hazard, please */
      await after(3); await tell(pre, 'Factor Prewitt, Vance-Okoro Land and Title. That machine left its registered field and menaced a settlement, which makes it a hazard, which makes it mine to render safe. My people are qualified. Do stand clear.');
      setTeam([H, ...H.body], 0); H.stop = false; const V = stFrom(1, H.pos, stAng(S.acre, S.field), 180, { ...vp, name: 'V-O BAILIFF', focus: H }); look(V[0], 'BAILIFFS'); sfx.play('alarm');
      await tell(xo, 'There it is. Move the markers, wait for the plough to do the damage, then confiscate the plough. Without it the co-op defaults by harvest. Those machines are going for FURROW. Do not let them have it.');
      setObj('d', () => `Keep the bailiffs off FURROW — hull ${fwHull(H)} · ${alive(V)} bailiffs`); chatter(fur, 'FURROW. Weeds detected. Large. Engaging weeds.'); await until(() => !alive(V)); setObj('d', null, 1);
      const r = await ask(fur, 'FURROW. Weeds cleared. Row is lost. Request new row.', ['The north field. As you were.', 'A ditch, all the way round the town. Deep.', 'Their survey road. All of it.'], 24, 0); stSet('row', r + 1);
      await tell(wren, r === 0 ? "Back to work, then. That's the first time in sixty years she's asked. I'm not sure I like it. I'm not sure I don't." : r === 1 ? "A ditch. Round the town. ...She's turning. She's actually doing it. Oh, they're going to hate that." : "Their road. She's gone off down their road with the blade down. I shouldn't laugh. I'm going to, though.");
      win('FURROW stopped short of Bright Acre, and the survey party that came to confiscate it has gone home without it. Vance-Okoro has filed a complaint about a plough.');
    },
    epi: (ok, f) => ok ? [
      [STC.wren, f['plow.row'] === 2 ? "There's a ditch round the Acre now you could lose a tank in. The children have named it. I'm not telling you what." : f['plow.row'] === 3 ? "Vance-Okoro's survey road is the best-drained seedbed in the county. We've put it down to barley." : "She's back in the north field, row four hundred and eight. You'd never know. That's rather the point of her."],
      [CREW.intel, 'Prewitt has not withdrawn the claim. He has amended it: the Acre is now "improperly defended agricultural land". He is coming back with something that does not stop when its markers are moved.'],
      [CREW.chief, "I had a look at her while you were talking, boss. Sixty years old and there's not a bearing in her wants changing. They don't build ploughs like that. They barely build mechs like that."],
    ] : [[STC.wren, "They've mended the gate and she's back at the top of the field, pointed at us again. Somebody's put the markers back. Come and do it properly."]],
    prize(D, add) { stGift(D, 'gear.kit', 1); add('Bright Acre co-op, harvest advance', 12000); repAdd('tyr', 4, 'stopped a plough short of the Bright Acre'); },
  }, {
    /* ---------------- II ---------------- */
    title: 'The Back Forty', kind: 'garrison', biome: 'forest', mood: 1, seed: 96023, diff: 3, pay: 170000, salv: 30, site: 'the Bright Acre silos', op: 'STUBBLE',
    tease: 'Factor Prewitt is coming back to the Bright Acre with a writ, a column of bailiffs, and a land train of his own: ACQUISITION, which clears whatever it is pointed at. The co-op has three silos with the whole harvest in them, one plough, and you. Wren Achterberg would like it known that the plough has been asking after you.',
    wire: 'Vance-Okoro Land and Title has served notice on the Bright Acre co-operative: vacate by dawn. The co-operative has replied with one word, and it was not "yes".',
    sites: { lz: [-620, 380, 40, 'LZ'], silo: [-60, 40, 86, 'THE SILOS'], lane: [400, -250, 46, 'SURVEY ROAD'], gate: [720, -430, 50, 'V-O GATE'] },
    roads: [['gate', 'lane', 'silo']], face: 'silo', guests: [STC.wren],
    brf: [
      { t: 'The Bright Acre again. Vance-Okoro is done with markers. They are sending bailiffs up the survey road at dawn, in fog, to take the silos. No silos, no harvest. No harvest, no co-operative.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'silo', 'THE SILOS', '#c8e06a'], ['card', 'THE JOB', ['Hold the silos through the morning', 'Three silos. One is enough to pay the bank', 'FURROW fights with us']]] },
      { by: CREW.intel, t: 'They come from the Vance-Okoro gate, down their survey road. Bailiffs first. Then this: a land train of their own, a clearing machine. Same family as the plough, built forty years later, by people who wanted a weapon. They call it ACQUISITION.', show: [['foe', 'gate', 'V-O GATE'], ['route', ['gate', 'lane', 'silo'], '#ff5a3a'], ['foe', 'lane', 'ACQUISITION'], ['card', 'ACQUISITION', ['A land train, armed in every segment', 'Kill the head and the rest goes with it', 'It will go for the silos']]] },
      { by: STC.wren, get t() { const r = stFlag('plow.row'); return r === 2 ? "You told her to dig a ditch and she dug one. It's four metres deep and it goes all the way round. Anything that wants my silos has to climb out of it first, slowly, in front of you." : r === 3 ? "You sent her down their road with the blade in. There isn't a road any more. Their big machine's coming the long way over broken ground, and it won't be in one piece when it gets here." : "You sent her back to work, so the north field's in and sold. That's money in the co-op's hand, and some of it's yours."; }, show: [['face', STC.furrow, ['On our side, and armed after a fashion', 'Bites what it can reach', 'Will go where it is told']]] },
      { by: CREW.chief, t: "A plough against a purpose-built clearing train. I know which I'd bet on, and I know which I'd rather it was. Keep it off her head, boss. That's where she does her thinking.", shot: 'who' },
      { t: 'Hold the silos. Kill the head of their train. And look after the plough: I am told it is the first client that has ever asked for us by name without being able to speak.', show: [['clear'], ['site', 'silo', 'THE SILOS', '#c8e06a'], ['foe', 'gate', 'V-O GATE'], ['foe', 'lane', 'ACQUISITION'], ['route', ['gate', 'lane', 'silo'], '#ff5a3a']] },
    ],
    async run(ms) {
      const S = ms.S, wren = STC.wren, fur = STC.furrow, pre = STC.prewitt, xo = ms.ops, vp = { paint: FAC.vom.paint, name: 'V-O BAILIFF' }, row = stFlag('plow.row'), from = stAng(S.silo, S.gate);
      const Si = [0, 1, 2].map(i => { const e = mkStruct('fuel', S.silo.x + (i - 1) * 27, S.silo.z - 8 + (i % 2) * 18, 0, { name: 'GRAIN SILO', hpK: row === 2 ? 6 : 3.5 }); e.blast = 0; return e; }); let lost = 0;
      for (const e of Si) e.onKill = () => { lost++; msg(`SILO LOST — ${3 - lost} LEFT`, 3); if (lost >= 3 && !ms.over) lose('The last silo is burning, and the harvest with it. Vance-Okoro will have the Bright Acre by the end of the month, for the price of the paperwork.', .1); };
      const H = fwLead(mkCentipede(S.silo.x - 46, S.silo.z + 44, 0, { n: 8, hpK: 3.4, name: 'FURROW', yaw: from })); H.to = () => S.silo; fieldWho(fur, H);
      H.onKill = () => { if (!ms.over) chatter(wren, "She's down. FURROW's down. ...Don't you stop. She wouldn't have."); };
      setObj('m', () => `Hold the silos — ${3 - lost} of 3 standing`); setObj('f', () => H.dead ? 'FURROW is down' : `FURROW — hull ${fwHull(H)}`); nav('s', S.silo, 'THE SILOS', '#c8e06a');
      await until(() => near(S.silo, 150)); look(H, 'FURROW'); await tell(fur, 'FURROW. Company recognised. Good morning. Soil is damp. Weeds are forecast.');
      if (row === 1) stPay('North field, harvested and sold', 30000);
      let W = stFrom(row === 2 ? .8 : 1, S.silo, from, 250, { ...vp, focus: Si[1] }); look(W[0], 'BAILIFFS'); msg('BAILIFFS ON THE SURVEY ROAD', 3); sfx.play('alarm');
      await tell(pre, 'Good morning. Prewitt. I have a writ of possession for three silos and their contents, and a lawful instruction to clear any machinery obstructing it. That would be you, and the plough. Do feel free to obstruct.');
      await until(() => alive(W) <= 1);
      const r = await ask(wren, "She keeps turning her head up the survey road. I've known her forty years and I'd say she wants off the lead. Your call. You know more about fighting than I do, and so does she, apparently.", ['Keep her at the silos.', 'Let her go hunting.'], 20, 0);
      let A = null; if (r) { H.to = () => A && !A.dead ? A.pos : S.lane; chatter(fur, 'FURROW. New row accepted. Row runs east. Proceeding.'); } else chatter(fur, 'FURROW. Holding at the silos. Blade is down.');
      /* their land train */
      await after(5); A = mkCentipede(S.lane.x, S.lane.z, 1, { n: 7, hpK: row === 3 ? 1.05 : 1.5, name: 'ACQUISITION', yaw: stAng(S.lane, S.silo) }); A.alert = true; A.focus = Si[1]; for (const e of A.body) e.alert = true; P.shake += .5; sfx.play('alarm'); look(A, 'ACQUISITION');
      await tell(xo, row === 3 ? 'Their land train is on the plot, and it is trailing smoke. It came the long way over what the plough left of their road. The head is the target. Everything behind it is guns.' : 'Their land train is on the plot, coming down the survey road. The head is the target. Everything behind it is guns.');
      W = W.concat(stFrom(.8, S.lane, from, 60, { ...vp, focus: Si[0] })); nav('a', A, 'ACQUISITION', '#ff5a3a'); setObj('a', () => `Kill the head of ACQUISITION — ${Math.max(0, Math.round(A.hp / A.max * 100))}%`);
      (async () => { await until(() => !H.dead && !A.dead && stDist(H.pos, A.pos) < 60); look(H, 'FURROW'); chatter(fur, 'FURROW. Obstruction is a plough. Obstruction is a very rude plough.'); })();
      await until(() => A.dead); unnav('a'); setObj('a', null, 1); chatter(wren, "Did you SEE that? It came apart like a string of sausages!"); await until(() => alive(W) <= 1);
      stSet('furrow', H.dead ? 1 : 2); setObj('m', null, 1);
      await tell(pre, 'I have been instructed to inform you that Vance-Okoro Land and Title no longer regards the Bright Acre as an economic proposition. The claim is withdrawn. The invoice for one land train will follow. Good day.');
      if (!H.dead) await tell(fur, 'FURROW. Weeds cleared. Row four hundred and nine. Soil is good.');
      win(H.dead ? 'The silos stand and the claim is withdrawn. FURROW lies across the survey road with ACQUISITION under her, sixty years old and not going to be sixty-one.' : 'The silos stand, the claim is withdrawn, and FURROW has gone back to the north field as if nothing had happened.');
    },
    epi: (ok, f) => ok ? [
      f['plow.furrow'] === 2 ? [STC.wren, "We've welded your crest on her head, next to the maker's plate. She's ploughing the back forty as we speak. I told her you said goodbye. She said the soil was good, which is the nicest thing she says."] : [STC.wren, "We've the harvest, and we've the land, and we've a hundred-year-old manual and every welder in the county. She'll plough again. Slower, I dare say. So will I."],
      [STC.prewitt, 'Prewitt. For the file: I have recommended that Land and Title take no further interest in ground you have stood on. It is not a compliment. It is an actuarial position.'],
      [CREW.chief, f['plow.furrow'] === 2 ? "They sent a coulter off the old girl's spare set, boss, with a note saying I'd know what to do with it. I've put an edge on it. I'll say no more." : "They sent us one of her blades, boss. I've put an edge on it. Seemed the thing to do."],
    ] : [[STC.wren, "One silo left and the fog's coming down again. They'll be back at dawn. So will you, I hope."]],
    prize(D, add, f) { stGift(D, 'arm.sw1', 1); stGift(D, 'gear.sink', 2); add('Bright Acre co-op, share of the harvest', 26000); repAdd('tyr', 6, 'held the Bright Acre silos'); repAdd('vom', -6, 'cost Land and Title a land train'); },
  }],
};

/* ---- OPEN SEASON: the Magistrate. A recovery agent works under a bond, and while the bond is good his machine carries a siege screen nothing the company owns will get through ---- */
function osCrowe(x, z, o = {}) {
  const e = stBig(mkMech(x, z, { ...PRESETS[17], paint: { n: 'BOND', pri: 0x2c2a26, sec: 0x12110f, acc: 0xd8c8a0, glow: 0xffe9a0 } }, 1, { name: 'THE MAGISTRATE', hpK: 2.4, skill: 1.3, ...o }), 1.25);
  e.alert = true; e.inv = true; e.vk = .78; fieldWho(STC.crowe, e); return e;
}
STORY.hunt = {
  name: 'OPEN SEASON', sub: 'There is a recovery order out, and the asset is you', col: '#d8c8a0', emp: 'tyr', foe: 'vom', who: CREW.intel, forN: 'The yard itself', vsN: 'A recovery order', payer: 'ESCROW, RELEASED',
  after: ['mar'], wait: 12, flags: ['who', 'end'],
  fin: 'The recovery order against the company has lapsed, along with the bond behind it and the building the bond was kept in. Vance-Okoro Asset Recovery has reclassified the yard as "not economically recoverable".',
  end: 'Mira has had the order framed, with the word LAPSED across it in red. It hangs in the briefing room, where clients can see it.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'Notice of Recovery', kind: 'recon', biome: 'desert', mood: 0, tod: 'dusk', seed: 96111, diff: 3, pay: 60000, salv: 20, site: 'the Tamarisk wells', op: 'EASY MONEY', solo: true,
    tease: 'A survey outfit nobody has heard of wants two wellheads scanned out at the Tamarisk flats: half a day, no opposition, fee paid into escrow in advance. Mira has looked at it three times and found nothing wrong with it. She says that is what is wrong with it.',
    wire: 'New paper for the yard: a wellhead survey at Tamarisk, paid up front. Mira Sato has asked that it be noted she does not like it.',
    sites: { lz: [-600, -420, 40, 'LZ'], w1: [-180, -120, 40, 'WELLHEAD 1'], w2: [200, 60, 40, 'WELLHEAD 2'], eye: [430, 410, 50, "THE NEEDLE'S EYE"], strip: [-120, 650, 50, 'OLD AIRSTRIP'] },
    face: 'w1',
    brf: [
      { t: 'A survey. Two wellheads on the Tamarisk flats, scan each and come home. The client is a company called Aldous and Partners, which was incorporated nine days ago. The fee is already in escrow.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'w1', 'WELLHEAD 1', '#7fe7ff'], ['site', 'w2', 'WELLHEAD 2', '#7fe7ff'], ['card', 'THE JOB', ['Scan two wellheads', 'No opposition expected', 'One machine. The client insists']]] },
      { by: CREW.intel, t: 'I have nothing. That is my report. No hostile presence, no rival bid, no history. The escrow is real. The wells are real. Jobs this clean do not exist, and I cannot find the dirt.', show: [['route', ['lz', 'w1', 'w2'], '#8dff6a'], ['unk', [320, 240], 'NOTHING. APPARENTLY']] },
      { by: CREW.intel, t: 'So I have looked at how we would leave if the dropship could not come. There is a cut through the ridge here, too narrow for anything heavy to follow at speed. And beyond it an airstrip nobody has used in years.', show: [['site', 'eye', "THE NEEDLE'S EYE", '#ffb21a'], ['site', 'strip', 'OLD AIRSTRIP', '#ffb21a'], ['route', ['w2', 'eye', 'strip'], '#ffb21a']] },
      { by: CREW.chief, t: "One machine and no wingman, on a job that's too easy. Boss, I've topped up everything that tops up. Humour an old man and take a repair kit.", shot: 'who' },
      { t: 'It is probably a survey. Scan the wells. If it turns out to be something else, you know the way out, and I would rather you used it than proved a point.', show: [['clear'], ['site', 'w1', 'WELLHEAD 1', '#7fe7ff'], ['site', 'w2', 'WELLHEAD 2', '#7fe7ff'], ['site', 'eye', "THE NEEDLE'S EYE", '#ffb21a'], ['site', 'strip', 'OLD AIRSTRIP', '#ffb21a']] },
    ],
    async run(ms) {
      const S = ms.S, mira = CREW.intel, xo = ms.ops, cro = STC.crowe, ten = STC.tench, bp = { paint: FAC.vom.paint, name: 'BAILIFF' };
      for (const k of ['w1', 'w2']) mkStruct('gen', S[k].x + 16, S[k].z + 10, 2, { name: 'WELLHEAD' }).inv = true;
      nav('w', S.w1, 'WELLHEAD 1', '#7fe7ff'); await stHold('a', S.w1, 70, 6, 'Scan wellhead 1'); chatter(mira, 'First scan is clean. It is a wellhead. There is water in it. I hate this.');
      nav('w', S.w2, 'WELLHEAD 2', '#7fe7ff'); setObj('b', 'Scan wellhead 2'); await until(() => near(S.w2, 90)); unnav('w'); setObj('b', null, 1);
      /* the notice is read out in full */
      await tell(ten, 'Good evening. Tench, Vance-Okoro Asset Recovery, Forms. Notice under schedule nine: one battlemech, improperly retained following the Marigold matter, is hereby subject to recovery by any licensed agent. This call is the notice. Thank you for attending the notice.');
      const [mx, mz] = stOff(S.w2, stAng(S.w2, S.lz), 170); let Mg = null; dropship(mx, mz, () => { Mg = osCrowe(mx, mz); nav('mg', Mg, 'THE MAGISTRATE', '#d8c8a0'); }, undefined, 1); sfx.play('alarm');
      await tell(mira, 'There it is. The client is the clerk. The survey was the bait and the escrow was the cheese. Commander, the agent they have sent is Ignatius Crowe, and the dropship has just been served a grounding order. It cannot come for you.');
      await until(() => Mg); look(Mg, 'THE MAGISTRATE');
      await tell(cro, 'Crowe. They call me the Magistrate, and I have never liked it; a magistrate may be appealed. I am bonded, licensed and in no hurry. Step down from the asset and you may walk to the road. I shall wait while you consider.');
      await tell(xo, 'His hull reads as a wall. He is carrying a bonded siege screen: while the bond stands, nothing we own will mark him. Do not fight him. The cut through the ridge, then the airstrip. I am finding you a lift. RUN.');
      setObj('r', "Do not fight the Magistrate — run for the Needle's Eye"); nav('e', S.eye, "THE NEEDLE'S EYE", '#ffb21a');
      const srv = [0, 1, 2, 3].map(i => { const e = mkDrone(...stOff(S.w2, i * 1.6, 120), 1, 'hunter'); e.name = 'PROCESS SERVER'; e.alert = true; return e; }), G = foes(.7, S.eye.x, S.eye.z, 10, 60, { ...bp, ai: 'guard' });
      (async () => { await after(20); chatter(ten, 'For the record, flight from a recovery is itself recoverable, under schedule eleven. I am obliged to tell you that. I am not obliged to enjoy it, but I find that I do.'); })();
      await until(() => near(S.eye, 110)); look(G[0], 'BAILIFFS IN THE CUT'); await tell(mira, 'Bailiffs in the cut. They thought of it too. These ones are not bonded: they break like anything else. Go through them.');
      await until(() => alive(G) <= 1 && near(S.eye, 70)); setObj('r', null, 1); unnav('e'); Mg.vk = .5; msg("THE NEEDLE'S EYE — HE HAS TO SQUEEZE THROUGH", 3.5);
      await tell(xo, 'He is too wide for the cut and he is going round. That is your minute. I have a freight pilot who owes Dutch money: she will put down on the old airstrip and she will not wait.');
      nav('s', S.strip, 'OLD AIRSTRIP', '#8dff6a'); await until(() => near(S.strip, 100)); Mg.vk = .78; const lift = stHold('h', S.strip, 90, 34, 'Hold the airstrip until the lift comes in'); stFrom(.6, S.strip, stAng(S.strip, S.eye), 190, bp);
      const r = await ask(cro, 'You run well. I say so without rancour. The offer improves with distance: the machine, and I sign you a receipt, and nobody is hunted. I am told you like things in writing.', ['Keep the receipt.', 'Who signed the order?'], 16, 0);
      if (r) { stSet('who', 1); await tell(cro, 'A fair question, and a matter of public record, if one knows which public. Factor Prewitt, Land and Title, countersigned by the Asset Recovery board. The bond is lodged at the Exchange in Corran. I tell you because it will not help you.'); chatter(mira, 'Corran. He just told me where the bond is. He thinks it does not matter. Oh, I am going to enjoy this.'); }
      else chatter(cro, 'As you wish. I have recovered forty-one machines. Thirty-eight of them ran first. It lengthens the day, nothing more.');
      await lift; unnav('s'); dropship(S.strip.x + 14, S.strip.z, null, undefined, 0); await after(6.5);
      win('The asset left the Tamarisk flats in the hold of a freighter that was not there, with the Magistrate four hundred metres behind and still walking. The escrow, it turns out, was real, and has cleared.');
    },
    epi: (ok, f) => ok ? [
      [CREW.intel, f['hunt.who'] ? 'The bond is at the Recovery Exchange in Corran, in three vaults, exactly as he said. A recovery agent with no bond is a trespasser in a large machine. He told you because he does not believe anybody would walk into an Exchange. I have the floor plan.' : 'I have been reading recovery law. An agent is untouchable only while his bond stands, and a bond is paper, kept in a building. I am finding the building.'],
      [STC.tench, 'Tench. A courtesy call. The order remains open and may be executed at any hour, on any contract, in any theatre. Schedule fourteen requires me to wish you a pleasant evening. Pleasant evening.'],
      [CREW.xo, 'He will keep coming. That is what the bond pays him for. I would rather we chose the place next time than he did.'],
    ] : [[CREW.intel, 'He has the machine on a low-loader and a receipt with your name on it. The order allows forty-eight hours to contest. I have contested. Get it back.']],
    prize(D, add) { stGift(D, 'gear.kit', 1); },
  }, {
    /* ---------------- II ---------------- */
    title: 'Counterclaim', kind: 'strike', biome: 'urban', mood: 0, seed: 96127, diff: 4, pay: 150000, salv: 35, site: 'the Corran Exchange', op: 'LAPSE',
    tease: 'The recovery order is good for as long as the bond behind it, and the bond is lodged at the Vance-Okoro Recovery Exchange in Corran: three vaults of paper, guarded like money. Burn the vaults and the Magistrate is an uninsured man in a very expensive machine, standing in a city, with you. Mira calls this a counterclaim. It is not the legal meaning of the word.',
    wire: 'The Magistrate has been seen in Corran, lodging papers at the Recovery Exchange. The yard has filed a counterclaim. It weighs sixty tonnes.',
    sites: { lz: [-560, 440, 40, 'LZ'], v1: [-210, 130, 44, 'BOND VAULT A'], v2: [150, -230, 44, 'BOND VAULT B'], v3: [390, 210, 44, 'BOND VAULT C'], ex: [60, 30, 70, 'THE EXCHANGE'] },
    face: 'v1',
    brf: [
      { t: 'Corran. The Recovery Exchange is where Vance-Okoro keeps the paper that makes its recovery agents legal. We are going to make one of them illegal.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'ex', 'THE EXCHANGE', '#d8c8a0'], ['card', 'THE JOB', ['Burn three bond vaults', 'The order lapses with the bond', 'Then settle with the Magistrate']]] },
      { by: CREW.intel, t: 'A bond is lodged in three parts in three vaults, so that no one fire can void it. So: three fires. Each vault has a guard detail and fixed guns. The Exchange floor itself is clerks, and clerks are not in the contract.', show: [['foe', 'v1', 'BOND VAULT A'], ['foe', 'v2', 'BOND VAULT B'], ['foe', 'v3', 'BOND VAULT C'], ['route', ['lz', 'v1', 'v2', 'v3'], '#8dff6a']] },
      { by: CREW.intel, t: 'Crowe. While any vault stands his screen is good and you cannot mark him. He will come the moment the first one burns, because that is what the bond pays him for. Do not stand and trade with him. Keep moving, keep burning.', show: [['unk', 'ex', 'THE MAGISTRATE — ON CALL'], ['face', STC.crowe, ['Licensed recovery agent', 'Forty-one machines recovered', 'Untouchable while one vault stands']]] },
      { by: CREW.chief, t: "And when the third one goes, boss, he's sixty tonnes of ordinary. I'd like to be there. I'd like to hear what a magistrate sounds like without his paperwork.", shot: 'who' },
      { t: 'Three vaults, then him. It is a city: the buildings stop his fire and they stop yours. Use them.', show: [['clear'], ['foe', 'v1', 'VAULT A'], ['foe', 'v2', 'VAULT B'], ['foe', 'v3', 'VAULT C'], ['unk', 'ex', 'THE MAGISTRATE']] },
    ],
    async run(ms) {
      const S = ms.S, mira = CREW.intel, xo = ms.ops, cro = STC.crowe, ten = STC.tench, bp = { paint: FAC.vom.paint, name: 'EXCHANGE GUARD' }; let Mg = null;
      const Vt = ['v1', 'v2', 'v3'].map(k => { const v = mkStruct('depot', S[k].x, S[k].z, 1, { name: 'BOND VAULT', hpK: 1.3 }); foes(.6, S[k].x, S[k].z, 18, 60, { ...bp, ai: 'guard' }); spawn({ turret: 2 }, S[k].x, S[k].z, 22, 34, 1); nav(k, v, 'VAULT', '#ff5a3a'); v.onKill = () => { unnav(k); if (!ms.over) msg(alive(Vt) ? `VAULT BURNED — ${alive(Vt)} LEFT` : 'THE BOND HAS LAPSED', 3.5); }; return v; });
      setObj('m', () => `Burn the bond vaults — ${alive(Vt)} left`); setObj('b', () => `THE MAGISTRATE'S BOND ${stBar(alive(Vt) / 3 * 100)}`); nav('v1', Vt[0], 'VAULT', '#ff5a3a');
      await after(4); chatter(mira, 'You are inside the Exchange district. Every alarm they have is a form, and somebody has to fill it in. You have a few minutes.');
      await until(() => alive(Vt) < 3);
      await tell(ten, 'Tench. I must protest. That vault held nine hundred active instruments, of which yours was one. You are now liable for the other eight hundred and ninety-nine. I am opening a file. It will be a large file.');
      const [mx, mz] = groundSpot(P.pos.x, P.pos.z, 150, 190); dropship(mx, mz, () => { Mg = osCrowe(mx, mz); nav('mg', Mg, 'THE MAGISTRATE', '#d8c8a0'); }, undefined, 1); await until(() => Mg); look(Mg, 'THE MAGISTRATE');
      await tell(cro, 'You have come to my place of business and set fire to it. I confess I had not allowed for that. No matter. The bond holds in two parts yet, and I am still in no hurry.');
      chatter(xo, 'He is on the ground and you still cannot mark him. Two vaults. Keep the buildings between you.');
      await until(() => alive(Vt) < 2); chatter(cro, 'One part. Do you know, in thirty years nobody has ever contested? I had thought the procedure was merely decorative.');
      await until(() => !alive(Vt)); setObj('m', null, 1); setObj('b', "THE MAGISTRATE'S BOND — lapsed", 1); Mg.inv = false; Mg.vk = 1; look(Mg, 'THE MAGISTRATE — UNBONDED');
      await tell(mira, 'That is the third. The bond is void, the order is void, and his screen has just dropped: I am reading his hull like anybody else\'s. Commander, he is an uninsured trespasser. Settle up.');
      setObj('k', () => `Settle with the Magistrate — ${Mg.dead ? 0 : Math.max(0, Math.round(Mg.hp / Mg.max * 100))}%`);
      await until(() => Mg.dead || Mg.hp < Mg.max * .16); let r = 0;
      if (!Mg.dead) {
        Object.assign(Mg, { inv: true, pacify: true, ai: 'hold' }); r = await ask(cro, 'Enough. I am unbonded, and I find I do not care to die for a board that will not have renewed me by morning. I can sign a discharge: order void, costs to the yard, and one recovery, of your choosing, without fee. Or you may finish.', ['Finish it.', 'Sign the discharge.'], 22, 1);
        if (r === 0) { Mg.inv = false; killEnt(Mg, 0); chatter(ten, 'Oh. Oh dear. That will want a form of its own.'); } else { leave([Mg]); unnav('mg'); await tell(cro, 'Signed, and witnessed by the fire. You are the forty-second, and the only one I did not recover. I shall remember the number.'); }
      }
      stSet('end', Mg.dead ? 1 : 2); setObj('k', null, 1); if (stFlag('hunt.who')) stPay('Costs against the signatory', 20000); if (!Mg.dead) stPay('Costs, by discharge', 35000);
      win(Mg.dead ? 'The bond is ash, the order is void, and the Magistrate has been recovered by his own Exchange, in several lots.' : 'The bond is ash and the order is void. The Magistrate walked out of Corran with a signed discharge in his cockpit and nothing else to his name.');
    },
    epi: (ok, f) => ok ? [
      [STC.tench, 'Tench. I am required to notify you that order nine-stroke-four-four-one has lapsed for want of surety. I am not required to add anything. I will add that I have never had to write "lapsed" before, and I have had to look up how it is spelt.'],
      f['hunt.end'] === 2 ? [STC.crowe, 'Crowe. I owe the yard one recovery, without fee, and I pay what I owe. When you want something of yours brought home, send word. I am told I am persistent.'] : [CREW.intel, 'Vance-Okoro has written Crowe off at book value and asked no questions. Their agents have stopped taking orders with our name on. Nobody will say why. Everybody knows why.'],
      [CREW.xo, 'For the record, the next time a job looks too clean, I would like us to remember this one. Mira was right. She would like that written down. I have written it down.'],
    ] : [[CREW.intel, 'Two vaults are still standing and so is he. They are moving the paper tonight. We go again before they do.']],
    prize(D, add, f) { stGift(D, 'back.shd', 1); stGift(D, 'gear.core', 1); repAdd('vom', -8, 'burned the Corran bond vaults'); },
  }],
};

/* ---- SOMETHING BORROWED: a wedding. The trucks stop when anything hostile is near them or the escort has wandered off, as trucks do; what is new is that the people shooting at them are guests ---- */
const SB_WHITE = { n: 'BRIDAL', pri: 0xf4f0ea, sec: 0xcfc6ba, acc: 0xff8a6a, glow: 0xffe6d8 };
STORY.wed = {
  name: 'SOMETHING BORROWED', sub: 'Two families, one aisle, and both sides armed', col: '#ffd0e8', emp: 'hel', foe: 'kar', who: STC.flor, forN: 'Both families', vsN: 'The guest list', payer: 'THE HAPPY COUPLE',
  after: ['car'], wait: 10, flags: ['blood', 'guest', 'gifts'],
  fin: 'Captain Zofia Radek of the Karsk 4th Armoured has married Teo Anselm of the Helion Combine. The two families exchanged vows, rings and, at one point, fire. Nobody of consequence was hurt. The cake survived.',
  end: 'We are in the wedding album. Page nine, behind the marquee, slightly on fire. Florian has sent a card offering us a discount on any future ceremony of our own.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'The Rehearsal', kind: 'escort', biome: 'desert', mood: 0, tod: 'dusk', seed: 96211, diff: 2, pay: 120000, salv: 15, site: 'the Anselm chapel', op: 'CONFETTI',
    tease: 'A Karsk armoured captain is marrying a Helion director\'s son. The families have been shooting at each other for three generations and each has brought an honour guard, so the wedding planner wants security that belongs to neither. He saw you on the Carnival broadcast and thought you had presence. The rehearsal is tonight: a procession of three trucks to the chapel. There is one rule, and it is in the contract in three places. Nobody dies at one of his weddings.',
    wire: 'Weddings of Distinction seeks "a neutral party with a large machine and a sense of occasion" for the Radek-Anselm ceremony. Apply to F. Okonjo-Bell. He is not calm.',
    sites: { lz: [-640, 380, 40, 'LANDING FIELD'], mid: [-150, 90, 50, 'HALFWAY HOUSE'], aisle: [250, -150, 64, 'THE AISLE'], chapel: [440, -270, 80, 'THE CHAPEL'] },
    roads: [['lz', 'mid', 'aisle', 'chapel']], face: 'mid', guests: [STC.flor],
    brf: [
      { t: 'I am going to hand over at once, because if I describe this myself I will use a tone. Mister Okonjo-Bell plans weddings.', show: [['site', 'lz', 'LANDING FIELD', '#8dff6a'], ['site', 'chapel', 'THE CHAPEL', '#ffd0e8'], ['card', 'THE JOB', ['Escort a wedding procession to the chapel', 'Client: both families', 'Rule one: nobody dies. Not anybody']]] },
      { by: STC.flor, t: 'Distinguished weddings. Thank you. Three vehicles: the cake, the band and the gifts. They go from the landing field to the chapel at a walk, because the cake has six tiers and no suspension. If the cake dies, there is no wedding, and I will hold you personally responsible until one of us is dead.', show: [['route', ['lz', 'mid', 'aisle', 'chapel'], '#ffd0e8'], ['card', 'THE PROCESSION', ['THE CAKE — six tiers. Irreplaceable', 'THE BAND — replaceable, with regret', 'THE GIFTS — insured']]] },
      { by: STC.flor, t: 'The bride is a tank officer and the groom is in procurement. Their honour guards will be at the aisle, here, facing one another, armed, because nobody would agree to be the one who was not. They are not to be shot. They are GUESTS.', show: [['ally', 'aisle', 'HONOUR GUARDS — BOTH'], ['face', STC.zofia, ['The bride. Karsk 4th Armoured', 'Has her own machine, in white', 'Chose the cake knife herself']], ['ring', 'aisle', 120, 'DO NOT SHOOT THE GUESTS']] },
      { by: CREW.intel, t: 'One thing he has not mentioned. A Lieutenant Vane of the bride\'s regiment asked for her hand last spring and was declined. He has not been invited. He has four friends, five light machines and, according to the mess bill, a great deal of courage in him.', show: [['unk', 'mid', 'UNINVITED?'], ['face', STC.bruno, ['Lt. Bruno Vane. Not invited', 'Four friends. Five machines', 'Is a guest of the bride\'s family all the same']]] },
      { by: STC.flor, t: 'If boys turn up to make a scene, you may hurt their machines until they sulk and go home. You may not kill them. Their mothers are on the seating plan. I will dock the fee for every one, and I will make you write the letter.', show: [['card', 'RULE ONE', ['Beat them until they leave', 'They quit at about a third of their armour', 'A dead guest is a docked fee and a bad omen']]] },
      { t: 'Cake to chapel. Shoot nobody who is on the seating plan. I did not expect to give that order in this career, and I notice I have given it twice now.', show: [['clear'], ['route', ['lz', 'mid', 'aisle', 'chapel'], '#ffd0e8'], ['unk', 'mid', 'UNINVITED?'], ['ally', 'aisle', 'HONOUR GUARDS'], ['site', 'chapel', 'THE CHAPEL', '#ffd0e8']] },
    ],
    async run(ms) {
      const S = ms.S, flo = STC.flor, zof = STC.zofia, teo = STC.teo, bru = STC.bruno, xo = ms.ops, v = ms.v, road = stRoad([S.lz, S.mid, S.aisle, S.chapel]), kp = FAC.kar.paint; v.dead = 0;
      const Tk = ['THE CAKE', 'THE BAND', 'THE GIFTS'].map((n, i) => { const t = mkTruck(P.pos.x + 12 + i * 11, P.pos.z - 14, 0, road.slice()); t.name = n; t.hp = t.max = 380; t.speed = 7.6 - i * .3; nav('k' + i, t, n, '#ffd0e8'); return t; }), cake = Tk[0], lead = () => Tk.find(t => !t.dead) || cake;
      cake.onKill = () => lose('The cake is spread over forty metres of desert road in six distinguishable tiers. Florian Okonjo-Bell has stopped screaming, which those who know him say is worse.', .1);
      for (const t of Tk.slice(1)) t.onKill = () => { ms.payK *= .88; chatter(flo, t === Tk[1] ? 'The BAND! That was a string quartet and a man with a triangle! Do you know what a triangle player COSTS at this notice?' : 'The gifts! Forty place settings and a samovar! ...They were insured. I am calm. I am calm.'); };
      stTick(() => { if (ms.over) return false; const L0 = lead(), jam = !!v.hold || !near(L0.pos, 210) || FD.t0.some(e => e.team === 1 && e.kind !== 'struct' && Tk.some(t => !t.dead && stDist(t.pos, e.pos) < 85)); for (const t of Tk) t.halt = jam; return true; });
      /* the honour guards are there from the start, looking at each other */
      const side = stAng(S.aisle, S.chapel) + PI / 2, G = [1, -1].flatMap(s => [0, 1].map(i => { const [x, z] = stOff(S.aisle, side + (s > 0 ? 0 : PI) + (i - .5) * .35, 66), e = mkMech(x, z, { ...PRESETS[s > 0 ? 9 : 0], paint: s > 0 ? kp : FAC.hel.paint }, 2, { ai: 'hold', name: s > 0 ? 'KARSK HONOUR GUARD' : 'HELION HONOUR GUARD', yaw: stAng(V3(x, 0, z), S.aisle), hpK: 2 }); e.pacify = true; e.onKill = () => lose('An honour guard is dead in the aisle, shot by the security. Both families have agreed on something at last, and it is you.', 0); return e; }));
      setObj('m', () => `Bring the procession to the chapel — the cake at ${Math.max(0, Math.round(cake.hp / cake.max * 100))}%`);
      await after(3); chatter(flo, 'Slowly! SLOWLY! Six tiers! If I hear a suspension spring I shall know whose fee to take it out of!');
      /* the stag party */
      await until(() => stDist(lead().pos, S.mid) < 80); const [sx, sz] = stOff(S.mid, stAng(S.lz, S.chapel) + 1.5, 200);
      const B = mkMech(sx, sz, { ...PRESETS[10], paint: kp }, 1, { name: 'LT. VANE', hpK: 1.5, skill: 1.1 }), St = [B, ...[6, 7, 8, 6].map((p, i) => mkMech(...groundSpot(sx, sz, 14, 40), { ...PRESETS[p], paint: kp }, 1, { name: 'STAG', hpK: 1.2, skill: .9 }))]; fieldWho(bru, B);
      for (const e of St) { e.alert = true; e.focus = Tk[1]; e.onKill = () => { v.dead++; ms.payK *= .88; msg('A GUEST IS DEAD — FEE DOCKED', 3.5); chatter(flo, v.dead === 1 ? 'You KILLED one! That was a GUEST! His mother is at table four! I am docking it, I am DOCKING it!' : 'ANOTHER! At this rate I shall have to redo the seating plan with a SHOVEL!'); }; }
      const home = stYield(St, .4, e => { msg(`${e.name} HAS GONE HOME`, 2.5); }); look(B, 'THE STAG PARTY'); sfx.play('alarm');
      await tell(bru, "ZOFIA! It's Bruno! I have come to object! I am aware the objecting part is tomorrow, but I was passing, and I have brought the lads, and we have had a drink! Who is THAT? Is that the SECURITY? Lads — get the band! I never liked the band!");
      await tell(flo, 'Rule one! RULE ONE! They are guests of the bride\'s family! Hurt the machines until they sulk, and they WILL sulk, they are lieutenants! Do NOT finish them!');
      setObj('s', () => `See off the stag party — ${home()} of 5 gone home${v.dead ? ` · ${v.dead} killed` : ''}`);
      await until(() => B.dead || B.out);
      if (!B.dead) { const r = await ask(bru, "All right. ALL RIGHT. She's on fire. I'm on fire. I only wanted to say my piece before she marries a man who owns a calculator.", ['Go home, Lieutenant.', 'Say it tomorrow, at the reception. Over cake. You are invited.'], 18, 0); if (r) { stSet('guest', 1); await tell(bru, "...Invited? Me? By the SECURITY? ...I'll wear the dress uniform. I'll behave. I'll bring a gift. Lads! We're INVITED!"); for (const e of St) if (!e.dead && !e.out) { e.hp = Math.min(e.hp, e.max * .39); } } else chatter(bru, "Home. Right. Tell her — no. Don't tell her anything. Tell her it was a nice band."); }
      await until(() => St.every(e => e.dead || e.out)); setObj('s', null, 1); if (!v.dead) stPay('Rule one, observed', 18000);
      /* the aisle */
      await until(() => stDist(lead().pos, S.aisle) < 150); v.hold = true; v.ten = 55; let hit = 0; nav('t', S.aisle, 'STAND BETWEEN THEM', '#ffd0e8'); look(G[0], 'THE HONOUR GUARDS');
      await tell(xo, 'The procession has stopped. It will not drive between the honour guards, because the honour guards have just noticed each other and every one of them has a round chambered. Put yourself in the middle of the aisle, where both sides have to look at you instead.');
      setObj('t', () => `Stand in the aisle until they stand down — TEMPERS ${stBar(v.ten)}`);
      stTick(dt => { if (ms.over || !v.hold) return false; for (const e of G) if (e.hitP > 0) { e.hitP = 0; hit++; v.ten += 22; msg('YOU SHOT A GUEST', 3); } v.ten = clamp(v.ten + (near(S.aisle, 60) ? -5 : 2.4) * dt, 0, 100); return true; });
      (async () => { await until(() => v.hold && v.ten >= 100); lose('Somebody\'s honour guard fired first and nobody will ever agree whose. The rehearsal ended in the aisle. The families are speaking again, through seconds.', .25); })();
      await until(() => v.ten <= 0); v.hold = false; unnav('t'); setObj('t', null, 1); for (let i = 0; i < 3; i++) if (!Tk[i].dead) nav('k' + i, Tk[i], Tk[i].name, '#ffd0e8');
      await tell(zof, 'Fourth Armoured! Safeties ON. That is my wedding you are aiming across. The next trooper who chambers a round will be handing out the canapes.'); await tell(teo, "Helion detail, please stand down. Please. I have a spreadsheet of what each of you costs and I would hate to have to look at it. ...Thank you. Was that all right? Zofia, was that all right?");
      await until(() => cake.dead || stDist(cake.pos, S.chapel) < 60); stSet('blood', Math.min(9, v.dead + hit)); setObj('m', null, 1); stShow(S.chapel, 8, 70);
      await tell(flo, v.dead ? 'The cake is in. The cake is IN. I am not going to mention the other matter until after the ceremony, and then I am going to mention it for the rest of your life.' : 'The cake is in. Six tiers. Not a crumb. I have planned two hundred weddings and I have never, not once, said this to security: thank you. Do not let it go to your head.');
      win(v.dead ? `The procession reached the chapel with the cake intact and ${v.dead} fewer guest${v.dead > 1 ? 's' : ''} than were on the seating plan.` : 'The procession reached the chapel with the cake intact, the honour guards on safe, and everybody on the seating plan still able to sit.');
    },
    epi: (ok, f) => ok ? [
      [STC.flor, f['wed.blood'] ? 'I have rewritten the seating plan. I have written the letters. I have told the families it was "high spirits". Tomorrow, the reception. You will be there, you will be armed, and you will be CAREFUL.' : 'Not one casualty. I have put you in the brochure. Tomorrow, the reception: three hundred guests, an open bar and both honour guards. I shall need you more than I need the caterers.'],
      f['wed.guest'] ? [STC.bruno, "Bruno Vane. I've pressed the dress uniform. I've bought them a clock. I wanted to say thank you for the invitation and I'm sorry about the band. Mostly sorry."] : null,
      [CREW.intel, 'A footnote. The gift list has been circulating, and it is a very good gift list. The Red Maw can read. I would expect uninvited guests of a different sort.'],
    ] : [[STC.flor, 'We are rehearsing AGAIN. I have a second cake. I do not have a third. Do you understand what I am telling you?']],
    prize(D, add, f) { stGift(D, 'gear.cool', 2); if (!f['wed.blood']) { repAdd('kar', 3, 'kept the peace at the Radek-Anselm rehearsal'); repAdd('hel', 3, 'kept the peace at the Radek-Anselm rehearsal'); } },
  }, {
    /* ---------------- II ---------------- */
    title: 'The Reception', kind: 'garrison', biome: 'jungle', mood: 0, tod: 'dusk', seed: 96227, diff: 3, pay: 190000, salv: 30, site: 'the Anselm summer house', op: 'TOP TABLE',
    tease: 'They are married. The reception is at the Anselm summer house on the river: three hundred guests, a marquee, and a gift table that half the sector has read the list for. The Red Maw has read it too. Florian Okonjo-Bell has amended rule one for the evening. It now reads: nobody ON THE SEATING PLAN dies.',
    wire: 'The Radek-Anselm reception is tonight. Weddings of Distinction has asked the yard to attend "in the capacity previously discussed, and with the safety catch off".',
    sites: { lz: [-600, 400, 40, 'LZ'], house: [80, -270, 90, 'THE SUMMER HOUSE'], jetty: [-330, -40, 46, 'THE JETTY'], cause: [540, -440, 46, 'THE CAUSEWAY'] },
    face: 'house', guests: [STC.flor],
    brf: [
      { t: 'The reception. I am told the ceremony was beautiful and that the groom cried, the bride did not, and the cake was cut with a thermal blade. Tonight we keep three hundred people alive through the speeches.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'house', 'THE SUMMER HOUSE', '#ffd0e8'], ['card', 'THE JOB', ['Hold the marquee through the reception', 'The gift table is what they are coming for', 'Tonight you may shoot to kill']]] },
      { by: CREW.intel, t: 'The Red Maw. Two ways in: up from the jetty on the river, and along the causeway from the east. They want the gift table. They are not particular about what is standing between them and it.', show: [['foe', 'jetty', 'THE JETTY'], ['foe', 'cause', 'THE CAUSEWAY'], ['route', ['jetty', 'house'], '#ff5a3a'], ['route', ['cause', 'house'], '#ff5a3a']] },
      { by: STC.flor, t: 'The marquee is where the guests are. If the marquee comes down, I am ruined, they are dead, and you are not paid, in that order of importance. The bride has insisted on flying. I have told her it will crease the dress. She has told me what to do with the dress.', show: [['ally', 'house', 'THE BRIDE — FLYING'], ['face', STC.zofia, ['Capt. Zofia Anselm-Radek, as of noon', 'In a white duelling frame', 'Not to be got killed at her own wedding']]] },
      { get by() { return stFlag('wed.guest') ? STC.flor : CREW.chief; }, get t() { return stFlag('wed.guest') ? 'And there is an addition to table nine. A Lieutenant Vane, who tells me you invited him. YOU. I have sat him by the kitchens. If he makes a speech I shall have you shot.' : "It's a jungle, boss, and it's a river. She'll run hot and she'll cool slow. And mind the canapes, I'm told they're very good."; }, shot: 'who' },
      { t: 'Hold the marquee. Mind the bride. Everybody who is not on the seating plan is fair game, and for once I can give that order with a clear conscience.', show: [['clear'], ['site', 'house', 'THE SUMMER HOUSE', '#ffd0e8'], ['foe', 'jetty', 'RED MAW'], ['foe', 'cause', 'RED MAW']] },
    ],
    async run(ms) {
      const S = ms.S, flo = STC.flor, zof = STC.zofia, teo = STC.teo, bru = STC.bruno, xo = ms.ops, mp = { paint: FAC.maw.paint, name: 'WEDDING CRASHER' }, guest = stFlag('wed.guest'), cap = mkChar(96241, 'RED MAW · NOT ON THE LIST', FAC.maw.col, 'Capt.');
      const tent = mkStruct('hq', S.house.x, S.house.z, 0, { name: 'THE MARQUEE', hpK: 1.7 }); tent.onKill = () => lose('The marquee is down with the reception inside it. There will be no speeches.', .1);
      const gifts = mkTruck(S.house.x + 34, S.house.z + 20, 0, []); gifts.name = 'THE GIFT TABLE'; gifts.hp = gifts.max = 520; gifts.onKill = () => { if (!ms.over) { ms.payK *= .9; chatter(flo, 'The gifts! Somebody has shot the gifts! Forty place settings! The SAMOVAR!'); } };
      const Z = stKeep(mkMech(S.house.x - 30, S.house.z + 34, { ...PRESETS[10], paint: SB_WHITE }, 0, { ai: 'guard', name: 'THE BRIDE', hpK: 2.4, skill: 1.3, yaw: stAng(S.house, S.jetty) }), zof, 'I am hit and I am sitting down. In the dress. Florian will never forgive either of us.'); fieldWho(zof, Z);
      setObj('m', () => `Hold the marquee — ${Math.max(0, Math.round(tent.hp / tent.max * 100))}%`); nav('h', tent, 'THE MARQUEE', '#ffd0e8'); for (let i = 0; i < 5; i++) stBeam(gpos(...stOff(S.house, i * TAU / 5, 60)), [0xffd0e8, 0xffe9a0][i % 2], 120, 1.4);
      await until(() => near(S.house, 170)); look(Z, 'THE BRIDE'); await tell(zof, 'You are the security. Good. I watched the rehearsal from the chapel roof. Take the river side; I have the causeway. If my husband comes out of that tent with a rifle, send him back in. He means well.');
      let W = stFrom(.9, S.house, stAng(S.house, S.jetty), 250, { ...mp, focus: gifts }); look(W[0], 'WEDDING CRASHERS'); msg('UNINVITED — FROM THE JETTY', 3); sfx.play('alarm');
      await tell(flo, 'They are coming up from the RIVER! Through the HERBACEOUS BORDER! Rule one is suspended for anybody not on the plan! I said SUSPENDED!'); await until(() => alive(W) <= 1);
      chatter(teo, "Hello? Is this on? I'd like to say a few words about my wife, who is at this moment — yes — shooting a man. Isn't she marvellous? To Zofia.");
      W = W.concat(stFrom(1, S.house, stAng(S.house, S.cause), 250, { ...mp, focus: tent })); msg('UNINVITED — FROM THE CAUSEWAY', 3); sfx.play('alarm');
      if (guest) { await after(4); const [gx, gz] = stOff(S.house, stAng(S.house, S.lz), 90), Bv = [10, 6].map((p, i) => mkMech(gx + i * 16, gz, { ...PRESETS[p], paint: FAC.kar.paint }, 0, { ai: 'follow', lead: Z, name: i ? 'STAG' : 'LT. VANE', hpK: 1.6, skill: 1.1 })); fieldWho(bru, Bv[0]); look(Bv[0], 'LT. VANE'); await tell(bru, "Evening! Table nine! I was promised cake and I find there's a FIGHT, which is better! Zofia — congratulations. Sincerely. Which ones am I allowed to hit?"); chatter(zof, 'Bruno. ...All of the red ones. And Bruno? Thank you for coming.'); }
      await until(() => alive(W) <= 1);
      /* the best man */
      const [bx, bz] = stOff(S.house, stAng(S.house, S.jetty) - .7, 170); let Bm = null, Bg = []; dropship(bx, bz, () => { Bm = stBig(mkMech(bx, bz, { ...PRESETS[16], paint: FAC.maw.paint }, 1, { name: 'THE BEST MAN', hpK: 2.4, skill: 1.3 }), 1.2); Bm.alert = true; Bm.focus = gifts; fieldWho(cap, Bm); Bg = hot1(foes(.7, bx, bz, 6, 34, mp)); nav('b', Bm, 'THE BEST MAN', '#ff5a3a'); }, undefined, 1);
      await until(() => Bm); look(Bm, 'THE BEST MAN'); await tell(cap, 'Evening all! Sorry we are late, the invitation must have gone astray. We will not stay. We will take the table with the bows on it and be out of your hair before the dancing.');
      setObj('b', () => `See off THE BEST MAN — ${Math.max(0, Math.round(Bm.hp / Bm.max * 100))}%`); await until(() => Bm.dead || Bm.hp < Bm.max * .45); let r = 0;
      if (!Bm.dead) {
        r = await ask(cap, 'Now, now. This is a wedding. Nobody wants a scene. Let us have the toasters and the samovar and we leave by the door, like guests. The alternative is that I come through the tent.', ['Not one spoon.', 'Take the toasters. Leave the guests.'], 20, 0);
        if (r) { Bm.inv = true; leave([Bm, ...Bg, ...W]); unnav('b'); ms.payK *= .85; gifts.team = 2; gifts.name = 'THE GIFT TABLE (LIGHTER)'; await tell(flo, 'You GAVE them the TOASTERS? ...They are leaving. They are actually leaving. Nobody is dead. I am docking you for the toasters and I am not sure I am right to.'); }
        else { await tell(cap, 'Not one spoon! Hark at it. All right, then. Through the tent.'); Bm.focus = tent; await until(() => Bm.dead); }
      }
      stSet('gifts', r ? 1 : 2); unnav('b'); setObj('b', null, 1); setObj('m', null, 1); stShow(S.house, 12, 80);
      await tell(zof, r ? 'Toasters. You paid them off in toasters. That is the most Helion thing I have ever seen done, and I married one this morning. ...It worked. I will allow it.' : 'That is the last of them. You fight like Fourth Armoured, and I do not say that to people who are not. Come and have a drink. That is an order from the bride.');
      win(r ? 'The Red Maw left the Radek-Anselm reception with eleven toasters and a samovar. Everybody on the seating plan is still on it.' : 'The Red Maw came to the Radek-Anselm reception for the gift table and left without it, and in most cases without their machines.');
    },
    epi: (ok, f) => ok ? [
      [STC.zofia, 'Zofia Anselm-Radek. I am told I outrank my husband, his father and the cake. I wanted to say: a regiment remembers who stood at its captain\'s wedding. So does the captain.'],
      [STC.teo, f['wed.gifts'] === 1 ? "Teo. About the toasters. We had eleven. Nobody needs eleven toasters. I think you may have done us a favour, and I've put it in the accounts as one." : "Teo. I've written you into the thank-you letters. You're between my aunt and the man who sent the samovar. I hope that's all right."],
      [STC.flor, 'It is over. Nobody on the plan died. The marquee has two holes in it which I am telling people are a feature. I have a christening in the spring. Do not change your number.'],
      [CREW.chief, "They cut the cake with a thermal blade, boss, and then the bride sent the blade round to the yard with a ribbon on it. It's a proper one. I've taken the ribbon off."],
    ] : [[STC.flor, 'The speeches have been POSTPONED. Do you know what it costs to postpone speeches? We do it again tomorrow night, and this time the tent stays UP.']],
    prize(D, add, f) { stGift(D, 'arm.tb1', 1); add('Both families, by way of thanks', 24000); repAdd('kar', 5, 'the Radek-Anselm reception'); repAdd('hel', 5, 'the Radek-Anselm reception'); },
  }],
};

/* ---- THE NINE-FORTY: a train is a string of haulers that keep a timetable. They run the line nose to tail at one speed; stop the one in front and the rest stop behind it ---- */
function nfTrain(names, line, o = {}) {
  const T = names.map((n, i) => { const p = line[0], q = line[1], a = stAng(q, p), t = mkTruck(p.x + Math.sin(a) * i * 15, p.z + Math.cos(a) * i * 15, 1, line.slice(1)); t.name = n; t.hp = t.max = (o.hp || [])[i] || 420; t.speed = o.speed || 7; t.alert = true; return t; });
  stTick(() => { if (MS.over) return false; const stop = T.stop || T[0].dead; for (const t of T) t.halt = stop; return !T.every(t => t.dead); }); return T;
}
STORY.nine = {
  name: 'THE NINE-FORTY', sub: 'It has run on time for twenty years. Verdigris has a timetable', col: '#2fd3b0', emp: 'tyr', foe: 'kar', who: RIV.ver.ch, forN: 'Verdigris Salvage', vsN: 'The Karsk pay train', payer: 'VERDIGRIS SALVAGE, YOUR END',
  after: ['car'], wait: 11, flags: ['cut', 'led'],
  fin: 'The Karsk pay train, the Nine-Forty, was stopped on the Cinder grade for the first time in twenty years. Karsk has not said what was taken. Verdigris Salvage has not said anything, which is unlike them.',
  end: 'Halloran has sent a bottle, a list of what she thinks we owe her, and a second list of what she thinks she owes us. The second list is longer. I did not expect that.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'Timetable', kind: 'recon', biome: 'glacial', mood: 0, tod: 'dawn', seed: 96311, diff: 2, pay: 70000, salv: 25, site: 'the Kessler line', op: 'PLATFORM',
    tease: 'Captain Halloran of Verdigris Salvage has seen the yard on the Carnival broadcast and concluded that you will do anything for money in front of a camera. She has a job with no cameras. Every week the Karsk Directorate moves its payroll down the Kessler line on an armoured road train, the Nine-Forty, and in twenty years it has never been late or stopped. She wants its timetable. That is all she wants, she says. This week.',
    wire: 'Verdigris Salvage, to the commander, in full: "Saw you on the telly. Got a thing. Bring a machine that can stand still. — J."',
    sites: { lz: [-620, 430, 40, 'LZ'], s1: [-280, 150, 40, 'SIGNAL BOX 1'], s2: [110, -70, 40, 'SIGNAL BOX 2'], s3: [450, -290, 40, 'SIGNAL BOX 3'], yard: [-700, -60, 46, 'KESSLER YARD'], tun: [700, -470, 50, 'THE TUNNEL'] },
    roads: [['yard', 's1', 's2', 's3', 'tun']], face: 's1', guests: [RIV.ver.ch],
    brf: [
      { t: 'Verdigris Salvage. Captain Halloran is here in person, which means either the job is very good or she wants to watch us agree to it.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['card', 'THE JOB', ['Tap three signal boxes on the Kessler line', 'Come home with a timetable', 'Client: Verdigris Salvage']]] },
      { by: RIV.ver.ch, t: "Both, love. The Kessler line. Karsk runs a pay train down it every week, the Nine-Forty, armoured nose to tail. Never late. Never stopped. I don't want the train. Not this week. I want to know to the second where it'll be next week.", show: [['route', ['yard', 's1', 's2', 's3', 'tun'], '#ff6a4a'], ['site', 'yard', 'KESSLER YARD', '#ff6a4a'], ['site', 'tun', 'THE TUNNEL', '#ff6a4a']] },
      { by: RIV.ver.ch, t: "Three signal boxes. Park by each one and let my little box of tricks listen to it. Don't shoot the signal boxes. A dead signal box is a late train, and a late train is a timetable I can't use.", show: [['site', 's1', 'SIGNAL BOX 1', '#2fd3b0'], ['site', 's2', 'SIGNAL BOX 2', '#2fd3b0'], ['site', 's3', 'SIGNAL BOX 3', '#2fd3b0'], ['card', 'THE BOXES', ['Stand close and wait', 'Do not shoot the signal boxes', 'Line patrols come by. Those you may shoot']]] },
      { by: CREW.intel, t: 'I will add what the Captain has not. Before the pay train runs, Karsk sends a pilot engine down the line to prove it: one armoured hauler with the week\'s signal codes aboard. It is due this morning. If it sees us it will run for the tunnel.', show: [['unk', 'yard', 'PILOT ENGINE — DUE'], ['route', ['yard', 'tun'], '#ffb21a']] },
      { by: RIV.ver.ch, t: "She's sharp, your Mira. Yes. If the pilot engine shows, I want the codes off it, and the codes are no use to me in a tunnel. I didn't mention it because I didn't want to pay for it. Now I suppose I'm paying for it.", shot: 'who' },
      { t: 'Three boxes, quietly. If the pilot engine comes, it does not reach the tunnel. And Captain: we will discuss the split before we leave this room, not after.', show: [['clear'], ['site', 's1', 'BOX 1', '#2fd3b0'], ['site', 's2', 'BOX 2', '#2fd3b0'], ['site', 's3', 'BOX 3', '#2fd3b0'], ['unk', 'yard', 'PILOT ENGINE'], ['site', 'tun', 'THE TUNNEL', '#ff6a4a']] },
    ],
    async run(ms) {
      const S = ms.S, jack = RIV.ver.ch, xo = ms.ops, mira = CREW.intel, kp = { name: 'LINE PATROL' };
      for (const k of ['s1', 's2', 's3']) { const b = mkStruct('comm', S[k].x + 14, S[k].z + 8, 2, { name: 'SIGNAL BOX' }); b.onKill = () => lose('A signal box is down, every lamp on the Kessler line has gone to red, and the Nine-Forty has been held at the yard. There is no timetable to steal.', .1); }
      await after(3); chatter(jack, "Morning. I'm up on the ridge with a flask and a pair of glasses. Do the boxes in order, there's a love. And don't shoot them. I can see you from here.");
      for (const [i, k] of ['s1', 's2', 's3'].entries()) { nav('b', S[k], `SIGNAL BOX ${i + 1}`, '#2fd3b0'); if (i) { const G = spawn({ tank: 2, v: 'dingo' }, S[k].x, S[k].z, 70, 120, 1, kp); if (i === 2) G.push(...foes(.5, S[k].x, S[k].z, 40, 90, kp)); hot1(G); } await stHold('b' + i, S[k], 72, 8, `Tap signal box ${i + 1}`); chatter(jack, ["One. Lovely. It's singing to me.", "Two. They change the lamps on the quarter hour. Twenty years and nobody's thought to vary it.", "Three. That's the lot. That's the whole — hang on. Hang on. What's that at the yard?"][i]); }
      unnav('b');
      /* the pilot engine */
      const line = stRoad([S.yard, S.s1, S.s2, S.s3, S.tun], 60), E = mkTruck(S.yard.x, S.yard.z, 1, line); E.name = 'PILOT ENGINE'; E.hp = E.max = 760; E.speed = 9.5; E.alert = true; const Es = spawn({ tank: 2 }, S.yard.x, S.yard.z, 12, 26, 1, { lead: E, name: 'LINE ESCORT' }); look(E, 'PILOT ENGINE'); sfx.play('alarm');
      await tell(mira, 'Pilot engine, out of the Kessler yard, on time to the second. One armoured hauler and two escorts. She has seen the taps on her board and she is running for the tunnel.');
      await tell(jack, "That's this week's codes on wheels. Stop her short of the tunnel and I'll pull the box out of the wreck. In the tunnel she's no good to anybody. Go on, then! I'm paying for it now!");
      nav('e', E, 'PILOT ENGINE', '#ff5a3a'); setObj('e', () => `Stop the pilot engine before the tunnel — ${Math.round(stDist(E.pos, S.tun) / 10) * 10} m to run`);
      (async () => { await until(() => !E.dead && stDist(E.pos, S.tun) < 60); lose('The pilot engine went into the tunnel with the week\'s codes aboard, and the Kessler line has gone to full alert behind it.', .3); })();
      await until(() => E.dead); const at = E.pos.clone(); setObj('e', null, 1); nav('e', at, 'THE WRECK', '#2fd3b0'); hot1(foes(.6, ...ringPt(at, 150), 0, 30, kp));
      await stHold('p', at, 70, 14, 'Cover the Verdigris picker at the wreck'); unnav('e');
      const r = await ask(jack, "Got it. Codes, timetable, the lot. Next week we stop the Nine-Forty, you and me. Now, the split. Your XO's glaring at me through the radio. Standard Verdigris terms are sixty-forty, and I'm the sixty.", ['Sixty-forty. Agreed.', 'Half, or you stop it by yourself.', 'Forty is fine. I want first refusal on the salvage.'], 22, 0); stSet('cut', r + 1);
      await tell(jack, r === 0 ? "No haggling? You'll never make a salvor. I like you anyway. Sixty-forty." : r === 1 ? "Half. HALF. ...I've a train to stop and one company in the sector daft enough to help. Half. Don't tell the other captains." : "First refusal on the salvage. Oh, that's clever. That's what I'd have asked for. I'll have to watch you.");
      win('Verdigris Salvage has the Kessler timetable and this week\'s signal codes, and the Karsk Directorate believes it has lost a pilot engine to an accident.');
    },
    epi: (ok, f) => ok ? [
      [RIV.ver.ch, f['nine.cut'] === 2 ? "Halloran. Half. I've told my crew it was my idea. Next week, the Cinder grade, nine-forty sharp. Bring the same machine and the same nerve." : "Halloran. Next week, the Cinder grade, nine-forty sharp. She slows to a walk on the climb. That's where we take her."],
      [CREW.intel, 'I have read the pilot engine\'s manifest. The Nine-Forty carries four cars, and the third is listed as the pay car. It is the only one with its own guard commander. A paymaster-major, twenty years on the run. He has never lost a coin.'],
      [CREW.xo, 'I will say this once. Verdigris has a price for everything and a reason for nothing. If that car holds what she says it holds, I will be surprised. Fly it anyway.'],
    ] : [[RIV.ver.ch, "Well, that's one way to learn a timetable: make them change it. They've a new pilot engine out tomorrow. Same again, love, and softer."]],
    prize(D, add, f) { stGift(D, 'gear.scrap', 2); rivRel('ver', f['nine.cut'] === 2 ? 2 : 8, f['nine.cut'] === 2 ? 'the Kessler line: drove a hard bargain' : 'the Kessler line'); },
  }, {
    /* ---------------- II ---------------- */
    title: 'The Nine-Forty', kind: 'recovery', biome: 'volcanic', mood: 0, tod: 'day', seed: 96327, diff: 4, pay: 160000, salv: 35, site: 'the Cinder grade', op: 'ALL STATIONS',
    tease: 'The Nine-Forty climbs the Cinder grade at a walk, four cars nose to tail across a lava field, and then it is in the Cinder tunnel and gone for another week. Halloran has the timetable and the codes. The plan is hers: kill the locomotive on the grade, and the rest of the train stops behind it. Her pickers cut the pay car open while you keep the escort off them. The plan has one rule. Nobody puts a round into the pay car.',
    wire: 'Verdigris Salvage, to the commander: "Nine-forty sharp. Don\'t be late. It won\'t be. — J."',
    sites: { lz: [-640, 300, 40, 'LZ'], yard: [-720, -420, 46, 'CINDER YARD'], cut: [-330, -250, 46, 'THE CUTTING'], grade: [60, -120, 56, 'THE GRADE'], points: [400, -330, 46, 'THE POINTS'], tun: [700, -520, 54, 'CINDER TUNNEL'] },
    roads: [['yard', 'cut', 'grade', 'points', 'tun']], face: 'grade', guests: [RIV.ver.ch],
    brf: [
      { t: 'The Nine-Forty. Captain Halloran has a timetable, a set of codes and a plan, and for once all three belong to the same job.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['route', ['yard', 'cut', 'grade', 'points', 'tun'], '#ff6a4a'], ['card', 'THE JOB', ['Stop the pay train on the Cinder grade', 'Hold it while Verdigris opens the pay car', 'Verdigris flies with us']]] },
      { by: RIV.ver.ch, t: "Four cars. Locomotive, escort car, pay car, brake van. Each one's a hauler with armour on. She leaves the yard at nine-forty and she's in the tunnel four minutes later, and in the tunnel she's Karsk's again. So we take her on the grade, where she slows.", show: [['foe', 'yard', 'CINDER YARD'], ['site', 'grade', 'THE GRADE', '#2fd3b0'], ['foe', 'tun', 'CINDER TUNNEL'], ['card', 'THE NINE-FORTY', ['LOCOMOTIVE — kill this and she stops', 'ESCORT CAR — guns. Kill it if you like', 'PAY CAR — do NOT hit it', 'BRAKE VAN — nobody cares']]] },
      { by: RIV.ver.ch, t: "Kill the locomotive. Not the pay car. I can't say that enough ways. What's in that car burns, and if it burns we've stopped a train for the exercise. Once she's stopped, my pickers go in with torches and you keep the world off them.", show: [['ring', 'grade', 150, 'TAKE HER HERE'], ['unk', 'points', 'IF SHE GETS THIS FAR, HURRY']] },
      { by: CREW.intel, t: 'The train has outriders, and the pay car has its own commander: Paymaster-Major Brandl, in a heavy machine, walking beside it. When the train stops he will not run. He has been waiting twenty years for somebody to try.', show: [['face', STC.brandl, ['Paymaster-Major, Karsk Directorate', 'Twenty years on the Nine-Forty', 'Has never lost a coin']]] },
      { by: CREW.chief, t: "It's a lava field either side of the line, boss. The train doesn't mind, it's on the embankment. You will. Fight from the road if you can.", shot: 'who' },
      { t: 'Locomotive, then hold. And Captain Halloran: when that car is open, I would like to be told what is actually in it before you have sold it.', show: [['clear'], ['route', ['yard', 'cut', 'grade', 'points', 'tun'], '#ff6a4a'], ['site', 'grade', 'THE GRADE', '#2fd3b0'], ['foe', 'tun', 'CINDER TUNNEL']] },
    ],
    async run(ms) {
      const S = ms.S, jack = RIV.ver.ch, xo = ms.ops, mira = CREW.intel, bra = STC.brandl, cut = stFlag('nine.cut'), kp = { name: 'TRAIN GUARD' }, line = stRoad([S.yard, S.cut, S.grade, S.points, S.tun], 60), pc = e => `${Math.max(0, Math.round(e.hp / e.max * 100))}%`;
      const L = rivLance('ver', P.pos.x + 24, P.pos.z + 14, 0, { ai: 'follow', lead: PE, yaw: P.yaw, n: 1 }); stKeep(L[0], jack, "That's me sat down, love. Paint's ruined. Carry on, I'm watching.");
      setObj('w', 'Get to the grade before the Nine-Forty does'); nav('g', S.grade, 'THE GRADE', '#2fd3b0'); await after(3); chatter(jack, "Nine thirty-eight. She'll be standing in the yard with steam up. Twenty years. I've half a mind to feel bad about it.");
      await until(() => near(S.grade, 200) || ms.t > 75); setObj('w', null, 1); unnav('g');
      const T = nfTrain(['LOCOMOTIVE', 'ESCORT CAR', 'PAY CAR', 'BRAKE VAN'], [S.yard, ...line], { hp: [900, 520, 640, 380], speed: 6.4 }), loco = T[0], pay = T[2]; pay.team = 2;   /* nobody's target: no wingman will aim at it and no Karsk round will hurt it. Whatever hits the pay car is the player's own */
      const Out = [...spawn({ tank: 2 }, S.yard.x, S.yard.z, 16, 30, 1, { ...kp, lead: loco }), ...spawn({ drone: 3 }, S.yard.x, S.yard.z, 20, 40, 1)];
      const Br = mkMech(S.yard.x + 16, S.yard.z + 10, { ...PRESETS[2], paint: FAC.kar.paint }, 1, { ai: 'follow', lead: pay, name: 'PAYMASTER BRANDL', hpK: 2.2, skill: 1.35 }); fieldWho(bra, Br); look(loco, 'THE NINE-FORTY'); sfx.play('alarm'); msg('NINE-FORTY — SHE IS OUT OF THE YARD', 3.5);
      await tell(jack, "Nine-forty. There she is, to the second, bless her. Locomotive's the one in front. NOT the third car. I'll say it again when you start shooting.");
      nav('p', pay, 'PAY CAR — HOLD FIRE', '#ffb21a'); nav('l', loco, 'LOCOMOTIVE', '#ff5a3a'); setObj('l', () => `Kill the locomotive before the tunnel — ${pc(loco)} · ${Math.round(stDist(loco.pos, S.tun) / 10) * 10} m to run`); setObj('p', () => `Do not hit the PAY CAR — ${pc(pay)}`);
      pay.onKill = () => lose('The pay car burned on the Cinder grade with everything in it. Halloran watched it go and has not said a word since, which her crew say they have never known.', .1);
      (async () => { await until(() => !loco.dead && stDist(loco.pos, S.tun) < 70); lose('The Nine-Forty went into the Cinder tunnel on time, as it has every week for twenty years.', .15); })();
      (async () => { await until(() => pay.hp < pay.max * .7 && !pay.dead); chatter(jack, "That's the PAY CAR you're hitting! The THIRD one! Front one, love, the FRONT one!"); })();
      await until(() => loco.dead); unnav('l'); setObj('l', null, 1); msg('THE NINE-FORTY HAS STOPPED', 4); look(pay, 'THE PAY CAR');
      await tell(bra, 'Brandl, Paymaster-Major. The Nine-Forty is stopped. In twenty years I have rehearsed this morning four hundred times and I had begun to think nobody would come. All guards: on the pay car. They do not open it.'); Br.ai = 'hunt'; Br.alert = true;
      const W = stFrom(.9, pay.pos, stAng(S.grade, S.tun), 200, { ...kp, focus: PE }); nav('p', pay, 'PAY CAR', '#2fd3b0'); await stHold('h', pay.pos, 80, 36, 'Keep them off the pay car while the pickers cut'); await until(() => Br.dead || Br.hp < Br.max * .3);
      if (!Br.dead) { Br.inv = true; leave([Br]); await tell(bra, 'I am beaten and I will say so, for the record, because there has to be a record. Twenty years. You had better be worth it. And you had better know what you have taken.'); }
      /* what is in the pay car */
      setObj('p', null, 1); await tell(jack, "She's open. ...Oh. Oh, you sly old Directorate. Come and look at this. No — you can't, can you. I'll tell you.");
      await tell(jack, "It isn't coin. It's paper. The indenture ledgers for the Kessler pits. Four thousand miners and what each one owes the company store. That's what goes down this line every week under guard. Whoever holds these, holds them.");
      const r = await ask(jack, "I've a buyer for paper like this, and so has everybody. But you stopped the train, so you get a say. What's it worth to you?", ['Burn them. Four thousand people wake up owing nothing.', 'Sell them back to Karsk. Paper is paper.', 'Send them to the pits. Let the miners hold their own debts.'], 26, 0); stSet('led', r + 1);
      if (r === 0) await tell(jack, "Burn them. ...That's a hundred and ninety thousand going up a chimney. Give me the torch. No, I'll do it. I want to be able to say I did it.");
      else if (r === 1) { stPay('The Kessler ledgers, sold back', 90000); await tell(jack, "Now you're talking like a salvor. Karsk'll pay through the nose and thank us for the discretion. I'll not pretend I feel clean."); }
      else await tell(jack, "Send them to the PITS? So the miners own their own — oh. Oh, that's the long game. Karsk can't collect a debt it doesn't hold. That's not charity, that's a siege. I wish I'd thought of it.");
      if (cut === 2) stPay('Your half', 40000); else if (cut === 3) { YARD.loot.push({ kind: 'gift', key: 'legs.trk' }); msg('FIRST REFUSAL — ONE SET OF HAULER TRACKS', 3); }
      win(r === 0 ? 'The Nine-Forty was stopped on the Cinder grade, and the Kessler indenture ledgers were burned beside the line. Four thousand miners owe the company store nothing, and cannot yet be told why.' : r === 1 ? 'The Nine-Forty was stopped on the Cinder grade, and the Karsk Directorate has quietly bought back what was taken from it.' : 'The Nine-Forty was stopped on the Cinder grade. The Kessler indenture ledgers went up the line to the pits in a Verdigris tender, addressed to the miners.');
    },
    epi: (ok, f) => ok ? [
      [RIV.ver.ch, f['nine.led'] === 1 ? "Halloran. My crew think I've gone soft. I've told them it was a business decision and that the business is none of theirs. I'd fly with you again. Don't make me say it twice." : f['nine.led'] === 2 ? "Halloran. Karsk paid. Promptly, in full, and without a word. I've never trusted money that arrives that fast. Your share's attached. Count it; I did." : "Halloran. The pits have the ledgers. There was a meeting. I'm told it was a short one, and that the company store's under new management. I'm told I'm welcome in Kessler. Me. Welcome."],
      [STC.brandl, 'Brandl. I have reported the loss, in full, as I am obliged to. I have been retired, as of this morning, as I expected. Twenty years, never late. I find I am not sorry somebody finally came. I am sorry it was a salvage company.'],
      [CREW.xo, f['nine.led'] === 2 ? 'It was her paper to sell and your say to give. The Directorate is pleased with us, which I do not enjoy as much as I would have thought.' : 'I said I would be surprised by what was in that car, and I was. I did not expect to be surprised by Halloran as well.'],
    ] : [[RIV.ver.ch, "On time. Twenty years and a week. Same grade, same hour, next Thursday. And this time we shoot the FRONT one."]],
    prize(D, add, f) { const r = f['nine.led']; stGift(D, 'arm.gau', 1); rivRel('ver', r === 1 ? 4 : r === 2 ? 10 : 14, 'stopped the Nine-Forty'); if (r === 2) repAdd('kar', 5, 'sold the Kessler ledgers back'); else { repAdd('kar', -8, 'the Nine-Forty and the Kessler ledgers'); repAdd('tyr', 6, r === 1 ? 'burned the Kessler ledgers' : 'gave the Kessler pits their ledgers'); } },
  }],
};
