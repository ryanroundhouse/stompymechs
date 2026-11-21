/* ============ STORY THREAD 2 — THE GREATEST SHOW: THE CARNIVAL NEEDS A VILLAIN FOR ITS LIVE BROADCAST, AND THEN IT NEEDS RATHER MORE THAN THAT ============ */
Object.assign(CAST, { 9121: { build: 'lean', h: 1.82, habit: 'cross' }, 9123: { build: 'avg', h: 1.7, habit: 'hips' } });
STORY.car = {
  name: 'THE GREATEST SHOW', sub: 'Live, tonight, and not as rehearsed', col: '#ff6ec7', emp: 'hel', foe: 'maw', who: RIV.car.ch, forN: 'The Carnival', vsN: 'The running order', payer: 'THE CARNIVAL',
  open: () => CO.done >= 2, wait: 14, flags: ['bow', 'cast'],
  fin: 'The Carnival closed its season in a caldera with the volcano going off on cue. Nine million watched. The Maestro has announced a tour.',
  end: 'We have been on every screen in the sector. I am told the yard has a fan club. I have not decided how I feel about that.',
  ch: [{
    /* ---------------- I ---------------- */
    title: 'Opening Night', kind: 'headhunt', biome: 'urban', mood: 1, seed: 92011, diff: 2, pay: 140000, salv: 20, site: 'Brannoch Arcade', op: 'GREASEPAINT',
    tease: 'The Carnival opens its season tonight with a live broadcast from the old Brannoch Arcade: the Maestro, in single combat, against a villain. The villain has pulled out. Quintero wants a replacement with a big machine and a bad reputation, and he has asked for you by name. You lose in the third act. You are paid handsomely to fall over.',
    wire: 'The Carnival is short one villain for its season opener and is not being quiet about it. Dario Quintero wants a word with the yard.',
    sites: { lz: [-420, 500, 40, 'LZ'], ring: [0, 0, 96, 'THE RING'], left: [-300, -260, 46, 'STAGE LEFT'], right: [320, -200, 46, 'STAGE RIGHT'], back: [40, -560, 52, 'BACKSTAGE'] },
    guests: [RIV.car.ch],
    brf: [
      { t: 'I want it on the record that I advised against this one. We have a guest. Mister Quintero — the floor is yours. Briefly.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['card', 'THE JOB', ['A staged duel, broadcast live', 'Client: the Carnival', 'Your part: the villain', 'You lose in the third act']]] },
      { by: RIV.car.ch, t: 'Briefly! She says briefly. Darlings — tonight, the Brannoch Arcade, nine million viewers, and ME, in single combat against a monster. I had a monster. He has shingles. You are my monster now.', show: [['site', 'ring', 'THE RING', '#ff6ec7'], ['face', RIV.car.ch, ['Ringmaster of the Carnival', 'Tonight: the hero', 'Has never refused a bet', 'Will be firing blanks. So he says']]] },
      { by: RIV.car.ch, t: 'Three acts. One: you arrive and smash my lovely props, so they know you are dreadful. Two: we duel. Hit me, properly — I bruise beautifully. Three: I rally, you fall over, I bow. Everybody is paid.', show: [['card', 'RUNNING ORDER', ['ACT I — the villain arrives. Break the props', 'ACT II — the duel. Make it look real', 'ACT III — the villain falls. Stay down', 'Applause is money: the fee rides on it']]] },
      { t: 'The extras wait in the wings, here and here, under the command of his understudy. They enter in the third act to carry you off. They are also firing blanks. I have asked to see the ammunition. I was shown a brochure.', show: [['ally', 'left', 'EXTRAS — STAGE LEFT'], ['ally', 'right', 'EXTRAS — STAGE RIGHT'], ['face', STC.und, ['The Understudy. Has been for eleven years', 'Runs the extras and the pyrotechnics', 'Knows every cue in the show']]] },
      { by: CREW.intel, t: 'For completeness: I cannot tell you what is in the backstage lot. The Carnival says props. It is a walled yard with its own fuel store, so they are heavy props.', show: [['unk', 'back', 'BACKSTAGE — "PROPS"']] },
      { by: CREW.chief, t: "Boss, your guns'll be live. Theirs won't, he says. I'd keep a repair kit in the cockpit anyway. Show people.", show: [['card', 'FOR THE AVOIDANCE OF DOUBT', ['Your weapons: live', 'Their weapons: "theatrical"', 'The audience: nine million', 'Do not actually kill the client']]] },
      { t: 'Hit your marks, take the fall, collect the fee. It is the easiest money we will make this year. I have said that sentence before, and I have always regretted it.', show: [['clear'], ['site', 'ring', 'THE RING', '#ff6ec7'], ['ally', 'left', 'EXTRAS'], ['ally', 'right', 'EXTRAS'], ['unk', 'back', 'BACKSTAGE']] },
    ],
    async run(ms) {
      const S = ms.S, mae = RIV.car.ch, und = STC.und, dex = STC.dex, xo = ms.ops, V = RIV.car, cp = { paint: V.paint }, v = ms.v; v.app = 25;
      const clap = d => { v.app = clamp(v.app + d, 0, 100); }, lights = [0, 1, 2, 3, 4, 5].map(i => stBeam(gpos(...stOff(S.ring, i * TAU / 6, 82)), [0xff6ec7, 0xffcf3a, 0x7fe7ff][i % 3], 170, 2.2));
      const Mq = mkMech(S.ring.x, S.ring.z - 30, { ...V.roster[2], paint: V.paint }, 2, { ai: 'hold', name: V.call, hpK: 3, skill: 1.2, yaw: 0 }); Mq.pacify = true; fieldWho(mae, Mq);
      Mq.onKill = () => lose('The Maestro died on a live broadcast, with the villain standing over him. Nine million people saw it, and all of them think it was you.', .05);
      stTick(dt => { if (ms.over) return false; if (v.act) clap(-dt * (v.live ? .25 : .8)); if (Math.random() < dt * (v.app / 60)) stFire(S.ring.x + rand(-90, 90), S.ring.y + rand(50, 95), S.ring.z + rand(-90, 90), ...pick([[1, .3, .6], [1, .8, .3], [.4, .8, 1]]), 50, 20); return true; });
      setObj('a', 'Take your mark in the Ring'); nav('r', S.ring, 'YOUR MARK', '#ff6ec7');
      await after(3); chatter(dex, 'Good EVENING, viewers, from the Brannoch Arcade! Dex Halloway, your voice for the night. The Maestro is in the Ring. All we lack... is a villain.');
      await until(() => near(S.ring, 110));
      await tell(mae, 'Darling! You are late, which is perfect. The villain is always late. Look dreadful. Places, everyone — and we are LIVE.');
      /* ACT I */
      v.act = 1; unnav('r'); setObj('a', null, 1); setObj('p', () => `APPLAUSE ${stBar(v.app)}`); const props = [...spawn({ drone: 6 }, S.ring.x, S.ring.z, 50, 90, 1), ...spawn({ turret: 2 }, S.ring.x, S.ring.z, 60, 80, 1)];
      for (const e of props) { e.name = e.kind === 'drone' ? 'CONFETTI DRONE' : 'FOOTLIGHT'; e.hp = e.max = e.kind === 'drone' ? 22 : 50; e.alert = true; e.onKill = () => { clap(8); stFire(e.pos.x, e.pos.y + 4, e.pos.z, 1, .8, .3, 40, 16); }; }
      setObj('m', () => `ACT I — break the props: ${alive(props)} left`); chatter(dex, 'And HERE it is! Look at the SIZE of that thing! Boo, viewers! Boo it from your sofas!');
      await until(() => !alive(props)); setObj('m', null, 1);
      /* ACT II */
      v.act = 2; setTeam([Mq], 1, { ai: 'hunt', alert: true }); let dealt = 0, hp0 = Mq.hp, slain = 0;
      stTick(() => { if (ms.over || v.act !== 2) return false; if (Mq.hp < hp0) { dealt += hp0 - Mq.hp; while (dealt > 30) { dealt -= 30; clap(4); } } if (Mq.hp < Mq.max * .45) { Mq.hp = Mq.max * .8; slain++; if (slain === 1) chatter(mae, 'OH! I am SLAIN! ...No. No, wait. Wrong act. Carry on.'); } hp0 = Mq.hp; return true; });
      await tell(mae, 'Act two! Now — hit me, darling. Properly. Not the face; the face is under contract.'); setObj('m', () => 'ACT II — the duel: hit the Maestro, and make it look real');
      await until(() => v.app >= 78 || slain >= 2); chatter(dex, "Oh, that's a HIT! The Maestro is REELING, viewers — will this be the night?");
      /* and then somebody changes the programme */
      await after(4); v.act = 3; v.live = true; setTeam([Mq], 0, { ai: 'hold' }); Mq.pacify = true;
      await tell(und, "Ladies and gentlemen: a change to tonight's programme. The part of the Maestro, which I have understudied for eleven years, will from this evening be played by nobody at all.");
      const X = [...spawn({ mech: 2, tier: 1 }, S.left.x, S.left.z, 0, 30, 1, { ...cp, name: 'EXTRA', skill: 1 }), ...spawn({ mech: 2, tier: 1 }, S.right.x, S.right.z, 0, 30, 1, { ...cp, name: 'EXTRA', skill: 1 })]; for (const e of X) { e.alert = true; e.focus = Mq; } look(X[0], 'THE EXTRAS'); sfx.play('alarm');
      await tell(xo, 'The extras are moving out of the wings early, and those are not blanks. Somebody has rewritten the third act.');
      await tell(mae, 'Lucien? Those are LIVE. Lucien! I am loaded with CONFETTI!'); setObj('m', () => `Keep the Maestro alive — he is armed with confetti · ${alive(X)} extras`); nav('q', Mq, 'THE MAESTRO', '#ff6ec7');
      chatter(dex, "This isn't in my running order. This is NOT in my running— keep rolling. KEEP ROLLING!"); for (const e of X) e.onKill = () => clap(9);
      await until(() => alive(X) <= 1);
      const U = stBig(mkMech(S.back.x, S.back.z, { ...V.roster[3], paint: { ...V.paint, pri: 0x2a1030, acc: 0xb48cff } }, 1, { name: 'THE UNDERSTUDY', hpK: 2.2, skill: 1.35 }), 1.15); U.alert = true; U.focus = Mq; fieldWho(und, U); const B2 = spawn({ mech: 1, tank: 2, tier: 1 }, S.back.x, S.back.z, 20, 50, 1, { ...cp, name: 'STAGEHAND' }); for (const e of B2) e.alert = true;
      look(U, 'THE UNDERSTUDY'); await tell(mae, 'He has taken the Calliope out of the backstage lot. MY Calliope. Darling, I shall need you to be the hero for a moment. I will direct.');
      nav('u', U, 'THE UNDERSTUDY', '#b48cff'); setObj('m', () => 'Keep the Maestro alive · drive off the Understudy');
      await until(() => U.dead || U.hp < U.max * .4);
      if (!U.dead) { U.inv = true; leave([U, ...B2]); unnav('u'); await tell(und, 'A critic. Everybody is a critic. Very well: exit. But I know every cue in this show, Dario — and I have kept the keys to the pyrotechnics.'); }
      clap(20); stShow(S.ring, 8, 80);
      const r = await ask(mae, 'Well. That was not the show, and it was a better show. The cameras are still on, darling, and they are all on you. How do we end it?', ['Take the bow together.', 'It is your stage. Take it alone.', 'Shoot his hat off.'], 22, 0);
      stSet('bow', r + 1);
      if (r === 0) { chatter(dex, 'The hero and the villain — TOGETHER! I have never seen it done! Listen to that crowd!'); clap(15); } else if (r === 1) say(mae, 'Generous. Villains never are. I shall remember it.');
      else { _v.copy(Mq.pos); _v.y += Mq.cy * 2 + 2; explode(FD.fx, _v.clone(), .8); sfx.play('cannon'); clap(30); await tell(mae, 'MY HAT—'); chatter(dex, 'THE VILLAIN SHOOTS HIS HAT OFF! WHAT AN ENDING! GOODNIGHT, BRANNOCH!'); }
      stShow(S.ring, 10, 90); stPay(`Broadcast bonus — applause ${Math.round(v.app)}%`, v.app * 700); await after(3);
      win('The villain saved the hero, live, in front of nine million people. The Carnival is calling it the best opening night it has ever had.');
    },
    epi: (ok, f) => ok ? [
      [RIV.car.ch, f['car.bow'] === 3 ? 'The hat is in a glass case in the foyer, with the hole in it, and a small brass plate with your name. I have never been upstaged before. I find that I rather enjoyed it.' : 'Nine million, darling. NINE. They are asking for you by name. Well — by "the villain". It is the same thing.'],
      [STC.dex, 'Dex Halloway. I wanted to say — I have called four hundred shows and that is the first one where I did not know how it ended. Thank you. Never do it to me again.'],
      [CREW.intel, 'The Understudy walked out with a Calliope, a dozen stagehands and the keys to every pyrotechnic the Carnival owns. He is not finished. People like that want a finale.'],
    ] : [
      [RIV.car.ch, 'We cut to an advertisement. We told them it was a technical fault. It is the first time in my life I have been grateful for an advertisement. Again, darling — from the top.'],
    ],
    prize(D, add) { stGift(D, 'gear.cool', 1); rivRel('car', 10, 'opening night at the Brannoch Arcade'); },
  }, {
    /* ---------------- II ---------------- */
    title: 'The Last Act', kind: 'strike', biome: 'volcanic', mood: 1, tod: 'dusk', seed: 92027, diff: 4, pay: 240000, salv: 30, site: 'Mirren Caldera', op: 'CURTAIN',
    tease: 'The Understudy has a show of his own now. He has taken the Carnival\'s pyrotechnics, its announcer and a third of its troupe to the floor of Mirren Caldera, built himself a stage on the lava, and gone on air. His ratings are climbing. The Maestro would like his announcer back, and his volcano, and he would like them back live. He is coming too. With real ammunition this time, he says.',
    wire: '"THE GRAND FINALE — one night only, from inside a volcano." A pirate broadcast is taking the Carnival\'s audience, and the Maestro wants his villain back.',
    sites: { lz: [-600, -400, 40, 'LZ'], m1: [-220, 60, 52, 'MAST · PROMPT SIDE'], m2: [220, -320, 52, 'MAST · OPPOSITE PROMPT'], m3: [100, 400, 52, 'MAST · THE GODS'], stage: [540, 100, 96, 'THE STAGE'] },
    guests: [RIV.car.ch],
    brf: [
      { t: 'The Understudy. He walked out of the Brannoch Arcade with the Carnival\'s heavy machine and the keys to its fireworks, and this is where he has taken them.', show: [['site', 'lz', 'LZ · DROPSHIP', '#8dff6a'], ['site', 'stage', 'THE STAGE', '#b48cff'], ['card', 'THE JOB', ['Close a pirate broadcast in Mirren Caldera', 'Recover the announcer, Dex Halloway', 'The Maestro and his lance fly with us']]] },
      { by: RIV.car.ch, t: 'He has built a stage. On a volcano. I am furious, darlings — chiefly because I did not think of it. He goes out live through three relay masts. While they stand, he has an audience. And Lucien, with an audience, will not stop.', show: [['foe', 'm1', 'MAST · PROMPT SIDE'], ['foe', 'm2', 'MAST · OPPOSITE PROMPT'], ['foe', 'm3', 'MAST · THE GODS'], ['card', 'HIS RATINGS', ['Three relay masts carry the broadcast', 'Each one down takes a third of his audience', 'No audience, no Understudy']]] },
      { by: CREW.intel, t: 'Each mast has a guard detail of his stagehands — Carnival machines, Carnival habits. Fast, loud, thin armour. Take the masts in any order; they are too far apart to support each other.', show: [['ring', 'm1', 130, ''], ['ring', 'm2', 130, ''], ['ring', 'm3', 130, ''], ['route', ['lz', 'm1', 'm3', 'stage'], '#8dff6a']] },
      { by: CREW.intel, t: 'The stage is another matter. He is in the Calliope, and my source says he has rebuilt it — bigger. He is calling it the Grand Finale. I do not know what he has done to the ground around it. He had every pyrotechnic the Carnival owns.', show: [['foe', 'stage', 'THE GRAND FINALE'], ['unk', [400, 60], 'APPROACH — UNKNOWN'], ['face', STC.und, ['Eleven years in the wings', 'Knows every cue the Carnival has', 'Wants an ending. Any ending']]] },
      { by: CREW.chief, t: "It's a live caldera, boss. The red stuff is exactly what it looks like — wade in it and you cook. Bring heat sinks. Bring more than you think.", show: [['card', 'MIRREN CALDERA', ['Active. Ashfall, and worse on no notice', 'Lava: heat and armour loss on contact', 'Heat sinks run hot here']]] },
      { t: 'Masts, then the stage. Bring the announcer home. And Mister Quintero — you will be using live rounds tonight. I checked them myself.', show: [['clear'], ['foe', 'm1', 'MAST'], ['foe', 'm2', 'MAST'], ['foe', 'm3', 'MAST'], ['foe', 'stage', 'THE GRAND FINALE']] },
    ],
    async run(ms) {
      const S = ms.S, mae = RIV.car.ch, und = STC.und, dex = STC.dex, xo = ms.ops, V = RIV.car, dark = { ...V.paint, pri: 0x2a1030, acc: 0xb48cff }, cp = { paint: dark }, v = ms.v; v.rat = 100;
      const L = rivLance('car', P.pos.x + 26, P.pos.z + 12, 0, { ai: 'follow', lead: PE, yaw: P.yaw }), Mq = L[0];
      const masts = ['m1', 'm2', 'm3'].map(k => { const m = mkStruct('comm', S[k].x, S[k].z, 1, { name: 'RELAY MAST', hpK: 1.3 }); foes(.7, S[k].x, S[k].z, 20, 70, { ...cp, ai: 'guard', name: 'STAGEHAND' }); spawn({ turret: 2 }, S[k].x, S[k].z, 26, 40, 1); stBeam(S[k], 0xb48cff, 200, 1.6); m.onKill = () => { v.rat -= 30; msg(`MAST DOWN — HIS RATINGS: ${v.rat}%`, 3.5); }; nav(k, m, 'MAST', '#ff5a3a'); return m; });
      setObj('m', () => `Cut the broadcast — ${alive(masts)} masts standing`); setObj('r', () => `THE UNDERSTUDY'S RATINGS ${stBar(v.rat)}`);
      const F = stBig(mkMech(S.stage.x, S.stage.z, { ...V.roster[3], paint: dark }, 1, { ai: 'hold', name: 'THE GRAND FINALE', hpK: 4.2, skill: 1.4, yaw: stAng(S.stage, S.lz) }), 1.6); F.inv = true; F.pacify = true; fieldWho(und, F);
      for (let i = 0; i < 6; i++) stBeam(gpos(...stOff(S.stage, i * TAU / 6, 70)), i % 2 ? 0xb48cff : 0xff5a3a, 190, 2.4);
      stTick(dt => { if (ms.over || F.dead) return false; if (Math.random() < dt * .6) stFire(S.stage.x + rand(-80, 80), S.stage.y + rand(60, 110), S.stage.z + rand(-80, 80), ...pick([[.7, .4, 1], [1, .3, .2], [1, .8, .3]]), 50, 22); return true; });
      await after(4); await tell(mae, 'Real ammunition, darling! I had forgotten the weight of it. Lead on — you are the star tonight. I am merely the supporting hero.');
      chatter(dex, 'This is Dex Halloway, live from Mirren Caldera, and I have been asked to read the following: "The Understudy is magnificent." I am being asked at gunpoint, viewers.');
      await until(() => alive(masts) < 3); chatter(und, 'A mast. You have cut a mast. Do you know what a third of an audience is, villain? It is still an audience.');
      await until(() => alive(masts) < 2); chatter(dex, 'We appear to be losing the eastern feed. I would like the record to show that I am delighted.');
      await until(() => !alive(masts)); setObj('m', null, 1); for (const k of ['m1', 'm2', 'm3']) unnav(k);
      await tell(und, 'Dark. You have put me in the DARK. ...Very well. A finale does not need an audience. A finale needs only to be final. Come to the stage.');
      setObj('s', 'Go to the stage'); nav('s', S.stage, 'THE STAGE', '#b48cff');
      /* nobody briefed the approach: he has wired it, and he is calling the cues */
      await until(() => near(S.stage, 330));
      look(F, 'THE GRAND FINALE'); await tell(xo, 'That is the Calliope — or it was. He has put half a foundry on it. And the ground between you and the stage has just lit up on my scope like a switchboard.');
      await tell(mae, 'Those are MY charges. That is my third-act barrage — I DESIGNED that cue! It walks left to right in threes and leaves the centre aisle clear. Stay in the aisle, darling. Stay behind me!');
      const aisle = stAng(S.stage, P.pos); let cue = 0; msg('PYRO CUES — KEEP TO THE CENTRE AISLE', 4);
      stTick(dt => { if (ms.over || v.pyro === false) return false; if ((cue -= dt) > 0) return true; cue = 2.2; for (let i = 0; i < 7; i++) { const side = (i < 3 ? -1 : 1) * (34 + (i % 3) * 30 + rand(8)), d = rand(90, 310), [x, z] = stOff(S.stage, aisle + side / d, d); if (i !== 6) shell(x, z, 60, 15, 1.6 + i * .12); } return true; });
      await until(() => near(S.stage, 150)); v.pyro = false; F.inv = false; F.pacify = false; F.ai = 'hunt'; F.alert = true; setObj('s', null, 1); setObj('f', () => `Bring down THE GRAND FINALE — ${Math.max(0, Math.round(F.hp / F.max * 100))}%`); nav('s', F, 'THE GRAND FINALE', '#b48cff');
      await tell(und, 'Eleven years I stood in the wings and watched him bow. Tonight I have the stage, the mountain and the last word. Places!');
      /* his flame effects: a ring of charges round wherever he is standing, every few seconds */
      let ringT = 5; stTick(dt => { if (ms.over || F.dead || F.yield) return false; if ((ringT -= dt) > 0) return true; ringT = 8; for (let i = 0; i < 8; i++) { const [x, z] = stOff(F.pos, i * TAU / 8 + rand(.3), 30); shell(x, z, 45, 13, 1.8); } return true; });
      await until(() => F.dead || F.hp < F.max * .5);
      if (!F.dead) {
        const st = EV.B.storm; weatherShift(st[1], st[2], st[3], 8); P.shake += .8; sfx.play('boom', 1.6); msg('THE CALDERA IS ERUPTING — ON CUE', 5);
        await tell(und, 'And now — the mountain! I have had charges in the vent since Tuesday. Nobody has EVER closed a show like this!');
        chatter(mae, 'He has upstaged the volcano. I taught him that. I am so proud, and so very frightened.');
        let bombT = 1, bombs = 26; stTick(dt => { if (ms.over || F.dead || bombs <= 0) return false; if ((bombT -= dt) > 0) return true; bombT = rand(.7, 1.4); bombs--; const [x, z] = stOff(P.pos, rand(TAU), rand(10, 70)); shell(x, z, 55, 14, 2.2); return true; });
        await until(() => F.dead || F.hp < F.max * .12);
      }
      let r = 0;
      if (!F.dead) {
        F.yield = true; F.inv = true; F.pacify = true; F.ai = 'hold'; setObj('f', 'THE GRAND FINALE — spent', 1);
        await tell(und, '...That was everything. Every charge, every cue. I have nothing left in the wings. Dario — tell me it was good.');
        await tell(mae, 'It was the best finale I have ever seen, Lucien, and I shall never forgive you for it. ...Darling. He is your villain. You decide.');
        r = await ask(mae, 'How does it end?', ['Bring the curtain down. Finish it.', 'Every show needs a villain. Hire him.'], 22, 1);
        if (r === 0) { F.inv = false; killEnt(F, 0); await tell(mae, 'Curtain. ...He would have wanted it sudden. He always said my endings dragged.'); }
        else { leave([F]); await tell(und, 'A contract. As the VILLAIN. Billed? ...Second billing. I can live with second billing. I have had the practice.'); }
      }
      stSet('cast', F.dead ? 1 : 2); stShow(S.stage, 12, 100); chatter(dex, 'Dex Halloway — live, alive, and available for weddings. Goodnight from Mirren Caldera!');
      await after(4); win(stGet('cast') === 2 ? 'The Understudy closed his own show in an erupting caldera, and was hired out of the wreckage as the Carnival\'s permanent villain.' : 'The Understudy got his finale: the mountain, the stage and the last word. The Carnival has its announcer back.');
    },
    epi: (ok, f) => ok ? [
      [RIV.car.ch, f['car.cast'] === 2 ? 'The posters are up. "THE UNDERSTUDY — you will LOVE to hate him." He has demanded a dressing room. I have given him yours; you were not using it.' : 'I have put his name above the door of the pyrotechnics shop. He would have hated that. It is not above the title.'],
      f['car.cast'] === 2 ? [STC.und, 'Second billing. Below the title, above the animals. I wanted to say — in the caldera, you could have ended it. You gave me a part instead. Nobody has done that in eleven years.'] : null,
      [STC.dex, 'For the record: the eruption was not in the running order either. Nobody tell the Maestro I said it, but it was the better show.'],
      [CREW.chief, 'The Carnival sent a crate, boss. It says FRAGILE — PYROTECHNIC — DO NOT REHEARSE NEAR. I have opened it. You are going to like it.'],
    ] : [
      [RIV.car.ch, 'He is still on the air, darling, and his ratings are up — he is showing the footage of us leaving. We go again. I will not be a blooper.'],
    ],
    prize(D, add, f) { stGift(D, 'back.rak', 1); stGift(D, 'arm.mis', 1); add('Broadcast residuals', 28000); rivRel('car', 14, f['car.cast'] === 2 ? 'the Last Act: found the Carnival a villain' : 'the Last Act at Mirren Caldera'); },
  }],
};

