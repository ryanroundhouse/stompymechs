/* ============ RIVAL COMPANIES: THREE OTHER OUTFITS WORK THIS SECTOR. THEY BID ON THE SAME PAPER, SOMETIMES TAKE THE OTHER SIDE OF IT, AND NOW AND THEN HIRE YOU OR FLY BESIDE YOU ============ */
/* each has a commander with a voice and a temper of their own, a livery nobody else wears, and four machines (light to assault) — in the field they bring whichever is closest to the one you are flying.
   paint is a scheme object rather than an index into PAINTS: makeMats / applyPaint take either, and the paint shop never sees these.
   facts: [id, the line the dossier shows once you know it, how somebody in the bar tells it]. Every one of them is true of how that company behaves in the field (TWISTS.rival, rivSalvage, the joint operations) */
const RIV = {
  cob: {
    name: 'Cobalt Lance', short: 'COBALT', col: '#6f9bff', rgb: '111,155,255', mate: 'LANCER', call: '"PALADIN" FERREIRA', tag: 'HONOUR-BOUND EX-REGULARS',
    paint: { n: 'COBALT', pri: 0x1f4fbf, sec: 0x14234f, acc: 0xdfe6f2, glow: 0x9fd0ff }, logo: { shape: 0, sym: 6, c1: '#16285c', c2: '#e6ecf5', c3: '#6f9bff' },
    ch: { name: 'Col. Adaeze "Paladin" Ferreira', first: 'Adaeze', last: 'Ferreira', role: 'COBALT LANCE · COMMANDING', seed: 7401, col: '#6f9bff' },
    blurb: 'A regiment that outlived its government and kept the drill. Ferreira signs few contracts, keeps every one of them to the letter, and expects the same of whoever is standing next to her.',
    style: 'Gauss rifles and heavy plate. Slow, exact, and deadly at range.',
    roster: [{ name: 'ESQUIRE', legs: 'rap', torso: 'sti', head: 'vis', armL: 'las', armR: 'las', back: 'rad' }, { name: 'LANCER', legs: 'bip', torso: 'bas', head: 'vis', armL: 'gau', armR: 'las', back: 'snk' },
      { name: 'CATAPHRACT', legs: 'quad', torso: 'brd', head: 'vis', armL: 'gau', armR: 'gau', back: 'plt' }, { name: 'PALADIN', legs: 'hvy', torso: 'jug', head: 'skl', armL: 'gau', armR: 'pls', back: 'plt' }],
    facts: [
      ['bribe', 'Cannot be bought off a contract. Offering only makes her angry.', 'Somebody tried to pay Cobalt to walk off a job last season. Ferreira sent the money back with the man who brought it, and then she won the job.'],
      ['yield', 'Strikes her colours when a fight is lost, and expects to be let walk. Refuse and the whole Lance remembers it.', 'When Cobalt is beaten, Cobalt says so, and walks. That is the old way. The one crew that kept shooting after the colours came down does not get work in this sector any more.'],
      ['word', 'Will not fire on a company she has stood beside. If you are on good terms, say so and she will withdraw.', 'Ferreira took a contract against a crew she had flown with, found out on the ground, and handed the fee back rather than fire. If you have stood with Cobalt, remind her.'],
      ['share', 'Shares work fairly if asked plainly, and holds to the split.', 'Ask Cobalt straight out to share a job and they will, sixty-forty, and you will not have to count it afterwards. Only outfit in here I would say that about.'],
      ['kit', 'Gauss rifles and plate: they hit hardest from far away. Close the distance.', 'Cobalt machines are all rail and armour. Stand off and trade with them and you lose. Get in close, where those long guns are slow.'],
      ['pow', 'On a shared contract she lets beaten enemies go, and wants your silence about it.', 'Fly a joint job with Cobalt and you will watch her let enemy pilots walk away from their wrecks. The client never likes it. She will ask you to have seen nothing.'],
    ],
  },
  car: {
    name: 'The Carnival', short: 'CARNIVAL', col: '#ff6ec7', rgb: '255,110,199', mate: 'PLAYER', call: 'THE MAESTRO', tag: 'GLORY-HOUNDS WITH AN AUDIENCE',
    paint: { n: 'CARNIVAL', pri: 0xd4267e, sec: 0x34113a, acc: 0xffcf3a, glow: 0xff8ad8 }, logo: { shape: 1, sym: 5, c1: '#3a123f', c2: '#ffcf3a', c3: '#ff6ec7' },
    ch: { name: 'Dario "Maestro" Quintero', first: 'Dario', last: 'Quintero', role: 'THE CARNIVAL · RINGMASTER', seed: 8587, col: '#ff6ec7' },
    blurb: 'They film their own contracts and sell the footage. Quintero would rather lose beautifully than win quietly, has never once refused a bet, and treats a threat as a request for an encore.',
    style: 'Missiles, rockets and jump jets. Loud, fast, and thin in the armour.',
    roster: [{ name: 'HARLEQUIN', legs: 'rap', torso: 'pod', head: 'dom', armL: 'mis', armR: 'las', back: 'jet' }, { name: 'JUGGLER', legs: 'bip', torso: 'bas', head: 'dom', armL: 'mis', armR: 'pls', back: 'jet' },
      { name: 'RINGMASTER', legs: 'quad', torso: 'brd', head: 'dom', armL: 'mis', armR: 'pls', back: 'rak' }, { name: 'CALLIOPE', legs: 'hvy', torso: 'jug', head: 'arr', armL: 'mis', armR: 'pls', back: 'rak' }],
    facts: [
      ['wager', 'Has never refused a wager. Put money on it and he will fight you alone, or race you, to win it.', 'The Maestro once bet his own dropship on a coin. Offer him a wager — any wager — and he forgets what he was hired for.'],
      ['threat', 'Telling him to back off is an invitation. He will fight you for the audience alone.', 'Do not tell the Carnival to leave. A crew did that at Vorn, and Quintero made a whole show out of them. They sell the recording.'],
      ['solo', 'Does not share a stage: he will not split a contract with a competitor.', 'You cannot go halves with the Maestro. He does not share billing. He would sooner lose the fee.'],
      ['bow', 'When he is beaten he bows out and pays what he owes. Shooting him after the bow costs you every friend he has.', 'When Quintero is beaten he takes a bow — on the open channel, in front of everybody — and pays up. Let him. The room does not forgive the other thing.'],
      ['kit', 'Missiles and jump jets, little armour. They hate a brawl. Get in close and stay there.', 'Carnival machines are fireworks on legs. All the missiles in the world and plate like a tin roof. Close with them and they come apart.'],
      ['bet', 'On a shared contract he will bet you on the kill count.', 'Fly with the Carnival and he will want a side bet on who drops more of them. He pays when he loses, too. Mostly he does not lose.'],
    ],
  },
  ver: {
    name: 'Verdigris Salvage', short: 'VERDIGRIS', col: '#2fd3b0', rgb: '47,211,176', mate: 'PICKER', call: '"JACKDAW" HALLORAN', tag: 'SCAVENGERS WITH A PRICE LIST',
    paint: { n: 'VERDIGRIS', pri: 0x2aa695, sec: 0x7a4a26, acc: 0xe08a3c, glow: 0x6fffd6 }, logo: { shape: 5, sym: 7, c1: '#173f3a', c2: '#e08a3c', c3: '#2fd3b0' },
    ch: { name: 'Capt. Mags "Jackdaw" Halloran', first: 'Mags', last: 'Halloran', role: 'VERDIGRIS SALVAGE · OWNER', seed: 7866, col: '#2fd3b0' },
    blurb: 'A salvage yard that learned to shoot. Halloran has a price for everything, most of all for going home, and has never taken a fight she could be paid to avoid.',
    style: 'Claws and autocannon. They want to be inside your guard.',
    roster: [{ name: 'MAGPIE', legs: 'rap', torso: 'pod', head: 'can', armL: 'claw', armR: 'acn', back: 'rad' }, { name: 'RAGPICKER', legs: 'bip', torso: 'bas', head: 'can', armL: 'claw', armR: 'acn', back: 'snk' },
      { name: 'GLEANER', legs: 'quad', torso: 'brd', head: 'vis', armL: 'claw', armR: 'pls', back: 'plt' }, { name: 'BREAKER', legs: 'trk', torso: 'jug', head: 'vis', armL: 'claw', armR: 'gau', back: 'plt' }],
    facts: [
      ['bribe', 'Always takes the money. Pay her and she leaves, whoever hired her.', 'Jackdaw has a price for going home and she will tell you what it is. Pay it. It is cheaper than the fight, and she always stays bought.'],
      ['fold', 'Only picks on the wounded. Meet her with your armour whole, tell her to leave, and she will.', 'Verdigris are scavengers. They do not fight healthy machines. Turn up without a scratch on you and tell her to clear off — she will.'],
      ['share', 'Takes a split every time it is offered.', 'Offer Halloran half and she takes it before you have finished the sentence. Half of something for no work is her favourite number.'],
      ['ransom', 'Beaten, she pays to be let go — and she does pay.', 'Corner Jackdaw and she will try to buy her way out. Take it or do not, but the money is real. She keeps a float for exactly that.'],
      ['kit', 'Claws and autocannon: they need to be close. Keep them at arm’s length.', 'Verdigris fit claws to everything. They want your machine in pieces small enough to carry. Keep your distance and they are just slow.'],
      ['graft', 'On a shared contract she finds something off the manifest and offers you half to keep quiet.', 'Fly with Verdigris and something valuable will turn out not to be on the manifest. She will offer you half. The client finds out about one time in three.'],
    ],
  },
};
Object.setPrototypeOf(RIV, null);   /* a company key read from a save is looked up here: 'constructor' and '__proto__' must find nothing */
const RIVS = Object.keys(RIV);
const relWord = r => r > 40 ? 'allied' : r > 15 ? 'friendly' : r > -15 ? 'wary' : r > -40 ? 'bad blood' : 'feud';
const rivPick = () => RIVS[(Math.random() * RIVS.length) | 0];
/* every change of standing is written down with its reason; the STANDING view shows the last six for each faction and company */
function stLog(L, d, why) { if (!Math.round(d)) return; L.unshift([CO.day, Math.round(d), String(why || '').slice(0, 80)]); L.length = Math.min(L.length, 6); }
function repAdd(f, d, why) { if (CO.rep[f] === undefined || !d) return; CO.rep[f] = clamp(CO.rep[f] + d, -100, 100); stLog(CO.hist[f] || (CO.hist[f] = []), d, why); CO.dirty = true; }
function rivRel(k, d, why) { const R = CO.riv[k]; if (!R || !d) return; R.rel = clamp(R.rel + d, -100, 100); stLog(R.log, d, why); CO.dirty = true; }
function rivKnow(k, id) { const R = CO.riv[k]; if (!R || R.know.includes(id)) return false; R.know.push(id); CO.dirty = true; return true; }
/* the ledger's share of this: where we stand with each company, what we have learned about them, and why each standing last moved. Validated on the way in — imported files are untrusted */
function rivApply(L) {
  const num = (v, d, a, z) => typeof v === 'number' && isFinite(v) ? clamp(v, a, z) : d, obj = o => o && typeof o === 'object' ? o : {};
  const logs = a => Array.isArray(a) ? a.filter(e => Array.isArray(e) && typeof e[0] === 'number' && typeof e[1] === 'number' && isFinite(e[0]) && isFinite(e[1]) && typeof e[2] === 'string').slice(0, 6).map(e => [Math.max(1, e[0] | 0), clamp(Math.round(e[1]), -100, 100), e[2].slice(0, 80)]) : [];
  CO.riv = {}; CO.hist = {};
  for (const k of RIVS) { const s = obj(obj(L && L.riv)[k]); CO.riv[k] = { rel: num(s.rel, 0, -100, 100), log: logs(s.log), know: Array.isArray(s.know) ? RIV[k].facts.map(f => f[0]).filter(id => s.know.includes(id)) : [], ask: num(s.ask, -99, -99, 1e7), gift: num(s.gift, -99, -99, 1e7) }; }
  for (const f of EMPS) CO.hist[f] = logs(obj(L && L.hist)[f]);
}
const rivSave = () => ({ riv: Object.fromEntries(RIVS.map(k => { const R = CO.riv[k]; return [k, { rel: Math.round(R.rel), log: R.log.map(e => [...e]), know: [...R.know], ask: +R.ask.toFixed(1), gift: +R.gift.toFixed(1) }]; })), hist: Object.fromEntries(EMPS.map(f => [f, (CO.hist[f] || []).map(e => [...e])])) });
const CO = { riv: {}, hist: {}, cb: 120000, day: 1, hour: 6, rep: { hel: 0, kar: 0, tyr: 0, ord: 0, vom: 0 }, done: 0, fails: 0, kit: 1, active: null, sel: null, board: [], news: [], wing: null, wingDown: false, seed: (Math.random() * 1e6) | 0, driftT: 4, dirty: true };
Object.defineProperty(CO, 'kit', { get: () => invN('gear.kit'), set: v => invAdd('gear.kit', (v | 0) - invN('gear.kit')) });   /* repair kits live in the stores now */
ledgerApply(BOOT);
const saveCO = () => lsSet('co', JSON.stringify(saveBlob()));
const now = () => CO.day * 24 + CO.hour;
const news = s => { CO.news.unshift(`D${CO.day} · ${coTxt(s)}`); CO.news.length = Math.min(CO.news.length, 9); CO.dirty = true; };

const SITE = {
  a: ['Kessel', 'Vorn', 'Ashfall', 'Tarsis', 'Mirren', 'Dravik', 'Solace', 'Harrow', 'Calder', 'Brannoch', 'Oster', 'Vey', 'Kaldur', 'Sennet', 'Morrow', 'Ilyx'],
  desert: ['Flats', 'Wash', 'Mesa', 'Dunes', 'Basin'], urban: ['District', 'Heights', 'Arcology', 'Terminal', 'Old Town'], forest: ['Timberline', 'Hollow', 'Reach', 'Stand', 'Vale'], jungle: ['Delta', 'Canopy', 'Sink', 'Lowlands', 'Green'],
  glacial: ['Shelf', 'Icefield', 'Moraine', 'Rift', 'Floe'], volcanic: ['Caldera', 'Vents', 'Forge', 'Scar', 'Flow'], lunar: ['Crater', 'Station', 'Mare', 'Rim', 'Terminus'],
};
const ITEMS = ['flight recorder', 'reactor core', 'prototype targeting array', 'sealed data vault', 'medical cargo pod'];
const OPS = [['IRON', 'COLD', 'RED', 'SILENT', 'BROKEN', 'PALE', 'LAST', 'BLACK', 'HOLLOW', 'BURNING'], ['LANTERN', 'HARVEST', 'ANVIL', 'TIDE', 'LEDGER', 'VIGIL', 'FURROW', 'HALO', 'ORCHARD', 'SPUR']];
/* where each biome sits on the holo map (unit disc); lunar contracts pin to the moon model */
const REGION = { desert: [.46, .08], urban: [0, 0], forest: [-.52, -.22], jungle: [-.2, .6], glacial: [.12, -.7], volcanic: [.6, .56], lunar: [0, 0] };
const PERSONA = {
  shark: { n: 'a hard bargainer', pat: 55, pay: .35, salv: .3, honest: .35, hi: 'You have ninety seconds of my time. Use them.', no: 'No. And asking twice costs you.', yes: 'Fine. Do not make me regret it.', bye: 'We are done. I will find someone hungrier.' },
  clerk: { n: 'strictly by the book', pat: 72, pay: .25, salv: .6, honest: .75, hi: 'This channel is recorded for compliance. State your terms.', no: 'That exceeds my authorisation.', yes: 'I can approve that. Amending the instrument now.', bye: 'I am closing this file. Good day.' },
  zealot: { n: 'a true believer', pat: 62, pay: .42, salv: .4, honest: .9, hi: 'The cause has need of your machine, mercenary. Speak.', no: 'You haggle over coin while the faithful bleed.', yes: 'It is a small price. Granted.', bye: 'You are not worthy of this work.' },
  desperate: { n: 'running out of options', pat: 92, pay: .75, salv: .65, honest: .6, hi: 'Thank you for answering. Nobody else would. What do you need?', no: 'I — I cannot. There is nothing left in the account.', yes: 'Yes. Yes, fine, whatever it takes.', bye: 'Then we are lost. Forget I called.' },
  smuggler: { n: 'slippery', pat: 66, pay: .52, salv: .5, honest: .15, hi: 'My favourite kind of person: armed and for hire. Let us talk numbers.', no: 'Ha. No. Try again with a smaller number.', yes: 'For you? Why not. It is not my money.', bye: 'Shame. I will tell the next crew you said hello.' },
};
const PERSONA_STD = Object.keys(PERSONA);   /* the ordinary clients; the three company commanders are added further down and are never drawn at random */
const HINT = {
  'strike.clean': 'Looks like exactly what it says. Expect a response force once the place is burning.', 'strike.trap': 'Thermal imaging of the target reads cold. Those tanks may be empty — it could be bait.', 'strike.civ': 'There are civilians living inside the perimeter. Nobody put that in the brief.', 'strike.melt': 'That reactor is an old unshielded design. If it goes, clear the whole basin.',
  'garrison.siege': 'Three assault waves are planned, the last by dropship.', 'garrison.bribe': 'The enemy commander has a habit of buying out mercenaries mid-fight.', 'garrison.arty': 'Siege guns are being hauled onto a ridge within range of the HQ.', 'garrison.evac': 'The client has transports fuelled and waiting. They do not expect to hold.',
  'escort.gauntlet': 'Standard interdiction. Ambushes along the route and a hard push at the depot.', 'escort.cargo': 'The manifest is sealed and the haulers are drawing life-support power. That is not ore.', 'escort.break': 'The route was mined last week and nobody has swept it.', 'escort.detour': 'The direct pass is closed. You will have to pick a way around.',
  'headhunt.duel': 'The target is old-school. Likes to settle things one on one.', 'headhunt.runner': 'The target keeps an extraction bird on standby. Wound them and they will run.', 'headhunt.decoy': "The target's transponder has been logged in two places at once.", 'headhunt.plea': 'The target knows something the client wants buried. They may try to bargain.',
  'recon.quiet': 'Light patrols only. A careful pilot could be in and out unseen.', 'recon.column': 'Heavy fuel traffic into one of the sites. Something big is staging there.', 'recon.beacon': 'A third-party patrol went missing in that sector yesterday.', 'recon.hunted': 'They have direction-finding gear. Run a scanner too long and they will find you.',
  'recovery.race': 'Another mercenary outfit has filed for the same salvage.', 'recovery.cargo': 'The manifest lists the package as inert. Its power draw says otherwise.', 'recovery.trap': 'The wreck is too clean. Somebody wants it found.', 'recovery.surv': 'A distress tone is still pulsing from the hull. There may be survivors.',
  storm: 'Forecast shows weather closing in over the operating area.', reinf: 'An enemy dropship is on alert within range.', ace: 'Somebody has posted a bounty on our mech.', pirates: 'Red Maw reavers work that region and tax everything that moves.', supply: 'Our field team can stage a repair sled nearby.', side: 'There may be a target of opportunity close to the objective.', renege: 'This client has a history of disputing invoices after the fact.', concord: 'Concord peacekeepers are interdicting contracts in that grid.',
};
const BRIEF = {
  strike: (E, F, c) => `${E.name} wants the ${F.short} installation at ${c.site} removed from the map. Reactor, fuel and uplink are the priority targets.`,
  garrison: (E, F, c) => `${F.short} forces are massing against the ${E.short} field headquarters at ${c.site}. Hold it until the assault breaks.`,
  escort: (E, F, c) => `Three haulers must reach the depot at ${c.site}. ${F.short} raiders work the route. Losses come out of the fee.`,
  headhunt: (E, F, c) => `A ${F.short} pilot has become a problem for ${E.short}. Find them near ${c.site} and end it.`,
  recon: (E, F, c) => `${E.short} needs eyes on three ${F.short} sites around ${c.site}. Scan each from close range, then extract.`,
  recovery: (E, F, c) => `A dropship carrying a ${c.item} went down at ${c.site}. Recover the package before ${F.short} scavengers strip the wreck.`,
};
let cid = 0;
/* what the board is dealt to hold: a job of every weight the company has grown into, from a milk run up. The ceiling rises with the record (two diamonds for a new company, five after a
   dozen contracts) and the floor never does, so there is always work for a light machine, a new wingman or a bad week. diffWant() is the six weights a full board should show;
   diffDeal() is the one it is short of */
const diffTop = () => clamp(2 + (CO.done >> 2), 2, 5);
const diffWant = () => { const T = diffTop(); return [0, 1, 2, 3, 4, 5].map(i => Math.round(1 + i * (T - 1) / 5)); };
function diffDeal() {
  const want = diffWant(); for (const c of CO.board) if (!c.story) { const i = want.indexOf(c.diff); if (i >= 0) want.splice(i, 1); }
  return want.length ? pick(want) : 1 + ((Math.random() * diffTop()) | 0);
}
const diffPay = d => .55 + d * .32;
/* a board from before the spread (every card at the ceiling) is re-rated on the way in: the cards over the count for their weight take the weights that are missing, and the fee goes
   with them. Anything the player has signed, talked terms on or bought intel for is left as it stands, and a board that is only a card or two out is left alone */
function boardSpread() {
  const want = diffWant(), extra = []; for (const c of CO.board) if (!c.story) { const i = want.indexOf(c.diff); if (i >= 0) want.splice(i, 1); else extra.push(c); }
  if (extra.length < 3) return;
  for (const c of extra) {
    if (!want.length) break; if (c === CO.active || c.co || c.talked || c.pushes || (c.intel && c.intel.length)) continue; const d = want.splice((Math.random() * want.length) | 0, 1)[0];
    c.pay = Math.round(c.pay * diffPay(d) / diffPay(c.diff) / 1000) * 1000; c.diff = d; c.cap = capFor(c.type, d); if (d < 3 || c.cap) c.twists = c.twists.filter(t => t !== 'worm');
  }
}
function genContract(o = {}) {
  const type = o.type || pick(Object.keys(TYPES)), emp = o.emp || pick(EMPS), foe = o.foe || pick([...EMPS.filter(f => f !== emp), 'maw']), biome = o.biome || pick(BIOME_KEYS), T = TYPES[type], persona = pick(PERSONA_STD);
  const diff = clamp(o.diff || diffDeal(), 1, 5), seed = ((CO.seed + ++cid * 7919 + Math.random() * 1e5) | 0) % 1000000, rg = REGION[biome], a = rand(TAU), rr = rand(.05, .2);
  const c = {
    id: cid, type, emp, foe, biome, mood: Math.random() < .4 ? 1 : 0, tod: todDeal(biome, CO.board.filter(b => !b.story).map(b => b.tod)), diff, seed, plot: pick(T.plots), twists: [], persona, pat: PERSONA[persona].pat, pushes: 0, intel: [], support: false,
    contact: mkChar(seed + 1, FAC[emp].short + ' ' + pick(['LIAISON', 'PROCUREMENT', 'FIELD OFFICE', 'ATTACHÉ']), FAC[emp].col), site: `${pick(SITE.a)} ${pick(SITE[biome])}`, item: pick(ITEMS), op: `${pick(OPS[0])} ${pick(OPS[1])}`,
    pay: Math.round(T.base * diffPay(diff) * rand(.85, 1.2) * (1 + CO.rep[emp] / 250) / 1000) * 1000, salv: pick([10, 15, 20, 25]), exp: now() + rand(10, 46), pos: [rg[0] + Math.sin(a) * rr, rg[1] + Math.cos(a) * rr], upd: o.upd || '',
  };
  c.cap = capFor(type, diff);
  for (let i = 0; i < 2; i++) if (Math.random() < .55) { const t = pick(['storm', 'reinf', 'ace', 'pirates', 'supply', 'side', 'renege', 'air', 'air', 'works', 'worm']); if (!c.twists.includes(t) && !(t === 'pirates' && foe === 'maw') && !(t === 'storm' && !BIOMES[biome].storm)
    && !(t === 'worm' && (diff < 3 || c.cap || type === 'assault')) && !(t === 'works' && (type === 'assault' || type === 'recon')) && !(t === 'air' && type === 'intercept')) c.twists.push(t); }
  /* now and then another company wants the same job — or has been hired to stop it. A salvage race always has one */
  if (sunWar()) { c.pay = Math.round(c.pay * 1.15 / 1000) * 1000; if (!o.type && Math.random() < .24) c.twists.push('concord'); }   /* the campaign's war: everybody left is hiring, and the Concord interdicts what it hears about */
  if (stFlag('sun.end') === 3 && stDone('sun')) c.pay = Math.round(c.pay * 1.1 / 1000) * 1000;   /* and the retainer the Lamplighters' Trust pays the company that gave it the sky */
  if (type === 'recovery' && c.plot === 'race') c.rival = rivPick(); else if (Math.random() < .07) { c.rival = rivPick(); c.twists.push('rival'); }
  c.brief = (o.pre || '') + BRIEF[type](FAC[emp], FAC[foe], c); return c;
}
function fillBoard() {
  if (tutLock()) { storySync(); CO.dirty = true; return; }   /* a company that has not flown its shakedown gets no offers: the board holds that one card */
  while (CO.board.filter(c => !c.story).length < 6) { const have = CO.board.map(c => c.type), miss = Object.keys(TYPES).filter(t => !have.includes(t)), used = CO.board.map(c => c.biome), free = BIOME_KEYS.filter(b => !used.includes(b)); CO.board.push(genContract({ type: miss.length ? pick(miss) : undefined, biome: free.length && Math.random() < .8 ? pick(free) : undefined })); }
  rivOffers(); storySync(); CO.dirty = true;
}
const dropContract = c => { const i = CO.board.indexOf(c); if (i >= 0) CO.board.splice(i, 1); if (CO.sel === c) CO.sel = null; if (CO.active === c) CO.active = null; CO.dirty = true; };
/* the board is alive: offers lapse, terms drift, situations escalate */
function drift() {
  const L = CO.board.filter(c => c !== CO.active && !c.story); if (!L.length) return; const c = pick(L), E = FAC[c.emp].short, r = Math.random();
  if (r < .12 && c.diff < 5) { c.diff++; c.pay = Math.round(c.pay * 1.18 / 1000) * 1000; c.upd = 'ESCALATED'; news(`Situation at ${c.site} is deteriorating. ${E} has raised its fee.`); }
  else if (r < .22 && c.diff > 1) { c.diff--; c.pay = Math.round(c.pay * .86 / 1000) * 1000; c.upd = 'EASED'; news(`${FAC[c.foe].short} has pulled units away from ${c.site}. ${E} has trimmed its fee to match.`); }
  else if (r < .4) { c.pay = Math.round(c.pay * .9 / 1000) * 1000; c.upd = 'FEE CUT'; news(`${E} is shopping the ${c.site} job around. Fee reduced.`); }
  else if (r < .58) { c.pay = Math.round(c.pay * 1.12 / 1000) * 1000; c.exp += 8; c.upd = 'FEE RAISED'; news(`${E} is getting nervous about ${c.site}. Fee raised, deadline extended.`); }
  else if (r < .72) { const m = BIOMES[c.biome].wx; if (m.length > 1) { c.mood = 1 - c.mood; c.upd = 'WEATHER'; news(`Conditions over ${c.site} have changed: ${m[c.mood][0].toLowerCase()}.`); } }
  else if (r < .8) { const k = todDeal(c.biome); if (k !== c.tod) { c.tod = k; c.upd = 'RESCHEDULED'; news(`The client has moved the operation at ${c.site}: it now goes in at ${TOD[k].name.toLowerCase()}.`); } }
  else if (r < .86) { const t = pick(['reinf', 'ace', 'side', 'storm', 'air']); if (!c.twists.includes(t) && !(t === 'storm' && !BIOMES[c.biome].storm) && !(t === 'air' && c.type === 'intercept')) { c.twists.push(t); c.upd = 'NEW ACTIVITY'; news(`Signals traffic around ${c.site} has spiked. Something has changed on the ground.`); } }
  else { c.plot = pick(TYPES[c.type].plots); c.intel = c.intel.filter(i => i.k !== 'plot'); c.upd = 'SITUATION CHANGED'; news(`Fresh reports out of ${c.site} contradict the original brief.`); }
  CO.dirty = true;
}
function tickClock(dt) {
  CO.hour += dt / 10; if (CO.hour >= 24) { CO.hour -= 24; CO.day++; saveCO(); }
  for (const c of [...CO.board]) if (c !== CO.active && now() > c.exp) { if (c.story) { storyLapse(c); continue; } dropContract(c); news(pick([`${rivOutfit()} took the ${FAC[c.emp].short} job at ${c.site}.`, `${FAC[c.emp].short} withdrew its offer for ${c.site}.`, `The ${c.site} contract lapsed unfilled.`])); }
  if (!tutLock() && CO.board.filter(c => !c.story).length < 6) fillBoard(); else if ((CO.stT = (CO.stT || 0) - dt) < 0) { CO.stT = 6; storySync(); }
  if ((CO.driftT -= dt / 10) <= 0) { CO.driftT = rand(3, 6); drift(); if (Math.random() < .2) news(rivNews()); }
  if (shopRoll()) { news('The quartermaster has posted new stock on the market.'); saveCO(); if (ST.open) storesDraw(); }
}
const NEXT = { strike: ['garrison', 'They are coming back for what you burned. '], garrison: ['strike', 'Time to hit back while they regroup. '], escort: ['recovery', 'One of ours never made it home. '], headhunt: ['recon', 'With their ace gone, we want to see what is left. '], recon: ['strike', 'Your scans found something worth destroying. '], recovery: ['escort', 'The package has to move, and it cannot fly. '] };
