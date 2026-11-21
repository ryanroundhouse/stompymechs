/* ============ COMPANY YARD: ITEM CATALOG, STORES, THREE MECH BAYS, MARKET, SALVAGE, SAVE FILES ============ */
/* every component is a counted item. A mech bay holds a build made from those items; a slot is null until something is fitted. */
const SINK_COOL = 1.2, HOT_SECS = 6, SHOP_HOURS = 30, SELL_K = .5;
/* a sprint runs the reactor past its rating. It makes `heat` a second of its own, and the sinks, busy with the reactor, shed only `shed` of what they would at a walk: from cold that is
   about twenty seconds for most machines and half as long again for one with a great deal of cooling, which gets back from it sooner as well */
const SPRINT_K = { heat: 6, shed: .15 };
const sprintFor = (st, k = 1) => 100 / Math.max(.5, SPRINT_K.heat - SPRINT_K.shed * st.cool * k);   /* seconds of sprint from cold to shutdown, with no weapons fired */
const HEAT_WARN = 80;   /* past this the pilot is told to ease off, whatever is making the heat: once a climb, and again only after it has fallen 25 under */
{ const n = { pod: 3, bas: 3, sti: 4, brd: 4, jug: 5 }; for (const k in PARTS.torso) PARTS.torso[k].sinks = n[k] ?? PARTS.torso[k].sinks ?? 3; }
const GEAR = {
  sink: { name: 'HEAT SINK', desc: 'Torso mount · cooling +' + SINK_COOL, tons: 1, price: 6000, kind: 'MOUNT' },
  kit: { name: 'FIELD REPAIR KIT', desc: 'Consumable · R restores 40% armor and wrecked components', tons: 0, price: 15000, kind: 'FIELD' },
  cool: { name: 'COOLANT FLUSH', desc: 'Consumable · V dumps 60 heat', tons: 0, price: 8000, kind: 'FIELD' },
  scrap: { name: 'ARMOUR SCRAP', desc: 'Trade goods · any yard will buy it', tons: 0, price: 7000, kind: 'TRADE' },
  core: { name: 'SPENT REACTOR CORE', desc: 'Trade goods · refiners pay well', tons: 0, price: 32000, kind: 'TRADE' },
};
/* base value in thousands, and how hard a thing is to come by: 0 common · 1 uncommon · 2 rare */
const YARD_VAL = {
  legs: { rap: [70, 1], bip: [85, 1], quad: [130, 2], hvy: [150, 2], trk: [165, 2] },
  torso: { pod: [60, 1], sti: [95, 2], bas: [100, 1], brd: [135, 2], jug: [180, 2] },
  head: { can: [22, 0], vis: [30, 0], dom: [42, 1], skl: [55, 1], arr: [60, 2] },
  arm: { las: [26, 0], acn: [30, 0], claw: [24, 0], mis: [34, 0], pls: [52, 1], gau: [58, 1] },
  back: { jet: [28, 0], rak: [38, 1], rad: [24, 0], snk: [32, 0], plt: [36, 1] },
};
const ICAT = {
  legs: { label: 'LEGS', one: 'LEGS', col: '#8dff6a' }, torso: { label: 'TORSOS', one: 'TORSO', col: '#ffb21a' }, head: { label: 'COCKPITS', one: 'COCKPIT', col: '#7fe7ff' },
  arm: { label: 'WEAPONS', one: 'WEAPON', col: '#ff7a55' }, back: { label: 'BACK UNITS', one: 'BACK UNIT', col: '#c9a0ff' }, gear: { label: 'EQUIPMENT', one: 'EQUIPMENT', col: '#e6dfcf' },
};
const ICAT_KEYS = Object.keys(ICAT), RARE_N = ['COMMON', 'UNCOMMON', 'RARE'], BODY_CATS = ['legs', 'torso', 'head'];
const WCLASS = { laser: 'ENERGY', plasma: 'ENERGY', beam: 'ENERGY', arc: 'ENERGY', ion: 'ENERGY', bullet: 'BALLISTIC', rail: 'BALLISTIC', flak: 'BALLISTIC', lob: 'BALLISTIC', missile: 'MISSILE', melee: 'MELEE', flame: 'INCENDIARY' };
const wepReach = w => w.reach || w.range || Math.min(600, Math.round(w.speed * (w.type === 'missile' ? 6 : w.type === 'flak' ? .9 : 3)));
const wepHps = w => w ? w.heat / w.cd : 0, wepDps = w => w ? w.dmg * (w.salvo || 1) / w.cd : 0;
Object.assign(YARD_VAL.legs, { lgt: [60, 1], hov: [110, 2], hex: [150, 2], sup: [210, 2] });
Object.assign(YARD_VAL.torso, { wsp: [45, 1], orb: [120, 2], cen: [110, 1], rhn: [160, 2], ctd: [230, 2] });
Object.assign(YARD_VAL.head, { fly: [38, 1], mon: [34, 0], kab: [40, 1], bnk: [52, 1] });
Object.assign(YARD_VAL.back, { lrk: [58, 1], art: [74, 2], shd: [66, 2], ecm: [34, 1], bst: [40, 1] });
for (const [id, , , , , , , val, rare] of ARM_FAM) YARD_VAL.arm[id] = [val, rare];
for (const p of PRESETS) PRESET_CLS[mechStats(p).cls].push(p);
const itemOk = k => { const [c, id] = String(k).split('.'); return c === 'gear' ? !!GEAR[id] : !!(PARTS[c] && PARTS[c][id]); };
const itemCache = {};
/* one flat record per item: what the stores, market and salvage screens show, filter and sort on */
function itemInfo(key) {
  if (itemCache[key]) return itemCache[key]; const [cat, id] = key.split('.'), g = cat === 'gear', p = g ? GEAR[id] : PARTS[cat][id], v = g ? [p.price / 1000, id === 'core' ? 1 : 0] : YARD_VAL[cat][id], w = p.weapon || null;
  const it = { key, cat, id, name: p.name, desc: p.desc, tons: p.tons || 0, armor: p.armor || 0, price: v[0] * 1000, rare: v[1], w, kind: g ? p.kind : '', chips: [], s: { price: v[0] * 1000 } }, s = it.s, chip = (label, val, sk) => it.chips.push([label, val, sk]);
  if (it.tons) { s.tons = it.tons; chip('MASS', it.tons + ' t', 'tons'); } if (it.armor) { s.armor = it.armor; chip('ARMOR', it.armor, 'armor'); }
  if (cat === 'legs') { s.speed = p.speed * 3.6 * RUN; s.cap = p.cap; s.turn = p.turn; chip('SPEED', s.speed.toFixed(0) + ' kph', 'speed'); chip('LOAD', p.cap + ' t', 'cap'); chip('TWIST', p.twist > 3 ? '360°' : '±' + Math.round(p.twist * 180 / PI) + '°'); }
  if (cat === 'torso') { s.sinks = p.sinks; s.cool = 2 + p.cool * .3 + p.sinks * SINK_COOL; chip('SINK SLOTS', p.sinks, 'sinks'); chip('MAX COOLING', s.cool.toFixed(1), 'cool'); }
  if (cat === 'head') { s.sensor = p.sensor; chip('SENSORS', p.sensor, 'sensor'); }
  if (w) { s.dmg = w.dmg * (w.salvo || 1); s.dps = wepDps(w); s.heat = wepHps(w); s.range = wepReach(w); s.reload = w.cd; it.wclass = WCLASS[w.type]; chip('DMG', w.salvo ? w.dmg + '×' + w.salvo : w.dmg, 'dmg'); chip('DPS', s.dps.toFixed(0), 'dps'); chip('HEAT', s.heat.toFixed(1) + '/s', 'heat'); chip('RANGE', s.range + ' m', 'range'); }
  if (cat === 'back') { if (p.fx === 'sinks') { s.cool = 7; chip('COOLING', '+70%', 'cool'); } if (p.fx === 'plate') chip('PLATING', '+35%'); if (p.fx === 'radar') { s.sensor = 100; chip('SENSORS', '×2', 'sensor'); } if (p.fx === 'jets') chip('JUMP', 'SPACE'); if (p.fx === 'shield') chip('SHIELD', '30% · RECHARGES'); if (p.fx === 'ecm') chip('ECM', 'BREAKS LOCKS'); if (p.fx === 'boost') chip('SPEED', '+12%'); }
  if (g && id === 'sink') { s.cool = SINK_COOL; chip('COOLING', '+' + SINK_COOL, 'cool'); } if (g && p.kind !== 'MOUNT') chip(p.kind === 'TRADE' ? 'TRADE GOODS' : 'CONSUMABLE', p.kind === 'TRADE' ? 'SELL' : id === 'kit' ? 'R' : 'V');
  return itemCache[key] = it;
}
const SORTS = [['name', 'NAME'], ['price', 'VALUE'], ['tons', 'MASS'], ['armor', 'ARMOR'], ['dps', 'DAMAGE / SEC'], ['dmg', 'DAMAGE / SALVO'], ['heat', 'HEAT / SEC'], ['range', 'RANGE'], ['speed', 'SPEED'], ['cap', 'LOAD LIMIT'], ['cool', 'COOLING'], ['sensor', 'SENSORS'], ['sinks', 'SINK SLOTS']];
const allItemKeys = () => [...Object.keys(YARD_VAL).flatMap(c => Object.keys(YARD_VAL[c]).map(id => c + '.' + id)), ...Object.keys(GEAR).map(id => 'gear.' + id)];

const LOGO_DEF = { shape: 0, sym: 0, c1: '#1b1e22', c2: '#ffb21a', c3: '#ffb21a' };
const YARD = { name: CO_DEF_NAME, logo: { ...LOGO_DEF }, founded: false, inv: {}, bays: [], act: 0, shop: { rot: -1, stock: [] }, loot: [], logoV: 0 };
const starterMech = () => ({ name: 'KESTREL', paint: 0, legs: 'rap', torso: 'pod', head: 'can', armL: 'las', armR: 'acn', back: 'jet', sinks: 2 });
const cleanName = (s, def, n = 18) => (String(s == null ? '' : s).replace(/[^\w '\-&.·]/g, '').trim().slice(0, n).toUpperCase()) || def;
/* the company as people say it: STOMPY MECHS is "Stompy Mechs". Lines are written with {CO} where the name goes, and comm(), dlg() and news() fill it in */
const coSpoken = () => YARD.name.toLowerCase().replace(/(^|[\s\-.&·])([a-z])/g, (m, a, b) => a + b.toUpperCase());
const coTxt = s => typeof s === 'string' && s.includes('{CO}') ? s.replace(/\{CO\}/g, coSpoken()) : s;
const cleanHex = (s, def) => /^#[0-9a-f]{6}$/i.test(s) ? s : def;
const cleanLogo = l => ({ shape: clamp((l && l.shape) | 0, 0, 7), sym: clamp((l && l.sym) | 0, 0, 13), c1: cleanHex(l && l.c1, LOGO_DEF.c1), c2: cleanHex(l && l.c2, LOGO_DEF.c2), c3: cleanHex(l && l.c3, LOGO_DEF.c3) });
function cleanBay(b, i) {
  const o = { name: '', paint: 0, legs: null, torso: null, head: null, armL: null, armR: null, back: null, sinks: 0 }; if (!b || typeof b !== 'object') return o;
  for (const s of SLOTS) if (typeof b[s] === 'string' && PARTS[CAT[s]][b[s]]) o[s] = b[s];
  if (!o.torso) o.head = o.armL = o.armR = o.back = null;   /* everything above the waist hangs off the torso */
  o.sinks = o.torso ? clamp(b.sinks | 0, 0, PARTS.torso[o.torso].sinks) : 0; o.paint = clamp(b.paint | 0, 0, PAINTS.length - 1); o.name = cleanName(b.name, '', 14); return o;
}
const bayParts = b => SLOTS.filter(s => b[s]).length;
const invN = k => YARD.inv[k] | 0;
const invAdd = (k, n = 1) => { const v = invN(k) + n; if (v > 0) YARD.inv[k] = Math.min(999, v); else delete YARD.inv[k]; };
const invCount = () => Object.values(YARD.inv).reduce((a, b) => a + b, 0);
/* the mech dealer's terms (415_mech_dealer.js): what a machine on the lot costs against its parts at list, the one marked down, the premium on one built to order, how many stand on the lot */
const DEAL_K = { lot: [1, 1.14], special: .9, order: 1.35, n: 6 };
/* a lot out of a save file: only machines that exist, at a price, and no more of them than a lot holds */
const dealClean = m => m && Array.isArray(m.mechs) ? m.mechs.filter(e => e && Number.isInteger(e.p) && e.p >= 0 && e.p < PRESETS.length && e.price > 0).slice(0, DEAL_K.n).map(e => ({ p: e.p, price: e.price | 0, tag: typeof e.tag === 'string' ? e.tag.slice(0, 24) : '' })) : null;
/* load the company's hardware from a save blob (or found a new one): a single light mech, two empty bays */
function yardApply(s) {
  const v2 = s && s.v === 2, c = (v2 && s.company) || {}; YARD.name = cleanName(c.name, CO_DEF_NAME); if (s && s.game === GAME_WAS && YARD.name === GAME_WAS) YARD.name = CO_DEF_NAME;   /* a company still under the old default name takes the new one */ YARD.logo = cleanLogo(c.logo); YARD.logoV++; YARD.founded = v2 ? c.founded !== false : !!s;
  YARD.inv = {}; if (v2 && s.inventory) { for (const k in s.inventory) if (itemOk(k) && s.inventory[k] > 0) YARD.inv[k] = Math.min(999, s.inventory[k] | 0); } else YARD.inv = { 'gear.kit': Math.max(0, s && s.kit != null ? s.kit | 0 : 1), 'gear.cool': 1 };
  YARD.bays = [0, 1, 2].map(i => cleanBay(v2 && Array.isArray(s.bays) ? s.bays[i] : i ? null : starterMech(), i)); YARD.act = v2 ? clamp(s.activeBay | 0, 0, 2) : 0;
  const m = v2 && s.market; YARD.shop = m && Array.isArray(m.stock) ? { rot: m.rot | 0, stock: m.stock.filter(e => e && itemOk(e.key) && e.qty > 0 && e.price > 0).map(e => ({ key: e.key, qty: e.qty | 0, price: e.price | 0, tag: e.tag || '' })), mechs: dealClean(m), mrot: m.mrot | 0 } : { rot: -1, stock: [] };
}
const BOOT = (() => { try { const s = JSON.parse(lsGet('co') || 'null'); return s && typeof s === 'object' ? s : null; } catch (e) { return null; } })();
yardApply(BOOT);

function mechStats(c) {
  const L = PARTS.legs[c.legs], T = PARTS.torso[c.torso], H = PARTS.head[c.head], A = PARTS.arm[c.armL], B = PARTS.arm[c.armR], K = PARTS.back[c.back], all = [L, T, H, A, B, K].filter(Boolean);
  const sinks = T ? (c.sinks == null ? T.sinks : Math.min(c.sinks, T.sinks)) : 0, sum = k => all.reduce((s, p) => s + p[k], 0), tons = sum('tons') + sinks * GEAR.sink.tons, load = L ? tons / L.cap : 0, fx = K && K.fx, W = [A && A.weapon, B && B.weapon, K && K.weapon].filter(Boolean);
  const heat = W.reduce((s, w) => s + wepHps(w), 0), cool = T ? (2 + T.cool * .3 + sinks * SINK_COOL) * (fx === 'sinks' ? 1.7 : 1) : 0;
  return {
    tons, load, over: load > 1, armor: Math.round(sum('armor') * (fx === 'plate' ? 1.35 : 1)), sinks, slots: T ? T.sinks : 0, weapons: W.length, heat, cool,
    speed: L ? L.speed * clamp(1.35 - .55 * load, .4, 1.12) * (fx === 'boost' ? 1.12 : 1) : 0, turn: L ? L.turn * clamp(1.25 - .35 * load, .55, 1.1) : 0, twist: L ? L.twist : 0,
    fire: W.reduce((s, w) => s + wepDps(w), 0), sensor: H ? H.sensor * (fx === 'radar' ? 2 : 1) : 0,
    jets: fx === 'jets', fx: fx || '', cls: !L || !T ? 'INCOMPLETE' : tons < 45 ? 'LIGHT' : tons < 65 ? 'MEDIUM' : tons < 85 ? 'HEAVY' : 'ASSAULT',
  };
}
/* can this build leave the bay? missing structure blocks the launch; a cold reactor or empty hardpoints only earn a warning */
/* ---- what a contract asks of the machine that flies it ----
   Some are written for a weight class: 45 t light only, 65 t medium or lighter, 85 t heavy or lighter, 0 anything. The opposition is drawn to match (capTier, force) */
const CAP_N = { 45: 'LIGHT', 65: 'MEDIUM', 85: 'HEAVY' };
/* the types a second machine is recommended for a step earlier than the rest */
const OPS_HEAVY = ['assault', 'intercept', 'garrison'];
/* the types where the player has something to stand by and keep alive */
const OPS_HOLD = ['garrison', 'intercept', 'escort'];
function capFor(type, diff) {
  const r = Math.random(), n = k => CO.board.filter(c => c.cap === k).length;
  let cap = diff === 1 ? (r < .5 ? 45 : r < .8 ? 65 : 0) : diff === 2 ? (r < .3 ? 45 : r < .6 ? 65 : 0) : diff === 3 ? (r < .12 ? 45 : r < .35 ? 65 : r < .5 ? 85 : 0) : diff === 4 ? (r < .25 ? 85 : 0) : 0;
  if (type === 'recon' && diff < 4 && Math.random() < .4) cap = 45;
  if ((type === 'assault' || type === 'intercept') && cap === 45) cap = 65;
  /* never more than two of a class on the board, nor more than three limited at all: there has to be work for whatever is in the bays */
  if (cap && (n(cap) >= 2 || CO.board.filter(c => c.cap).length >= 3)) cap = 0;
  return cap;
}
const capWord = c => `${c.cap} T · ${CAP_N[c.cap]}${c.cap > 45 ? ' OR LIGHTER' : ' ONLY'}`;
/* a harder job says so before launch: bring a second machine. Not where a company's lance is already beside you, and not at the races */
const wingRec = c => !!c && (c.story ? c.diff >= 4 && c.story !== 'derby' : c.cok !== 'joint' && (c.diff >= 4 || c.diff === 3 && OPS_HEAVY.includes(c.type)));
const capKv = c => (c.cap ? `<div class="kv">WEIGHT LIMIT <b style="color:var(--am)">${capWord(c)}</b></div>` : '') + (wingRec(c) ? '<div class="kv">LANCE <b style="color:var(--hot)">WINGMAN RECOMMENDED</b></div>' : '');
/* what a card says a job asks for, on a line of its own under the rest so that it is never cut short */
const capTag = c => { const L = []; if (c.cap) L.push(`<span style="color:var(--am)">LIMIT ${c.cap} T · ${CAP_N[c.cap]}</span>`); if (wingRec(c)) L.push('<span style="color:var(--hot)">WINGMAN RECOMMENDED</span>'); return L.length ? `<s>${L.join(' · ')}</s>` : ''; };
/* now and then a pilot shoots at a part of you rather than the middle of you */
const aimZ = (tg, sx, sy) => { if (tg !== PE || Math.random() > .3 || !player.zg || !player.zg.length) return aimAt(tg, sx, sy); zoneW(player, pick(player.zg), _c); _c.x += rand(-sx, sx) * .6; _c.y += rand(-sy, sy) * .6; _c.z += rand(-sx, sx) * .6; return _c; };
function mechReady(c, biome, ct) {
  const st = mechStats(c), block = [], warn = [], k = biome && BIOMES[biome] ? BIOMES[biome].cool || 1 : 1, cool = st.cool * k, secs = st.heat > cool ? 100 / (st.heat - cool) : Infinity;
  if (!bayParts(c)) block.push('BAY IS EMPTY'); else { if (!c.legs) block.push('NO LEGS FITTED'); if (!c.torso) block.push('NO TORSO FITTED'); if (!c.head) block.push('NO COCKPIT FITTED'); }
  if (!block.length) {
    if (!st.weapons) warn.push('NO WEAPONS FITTED — she cannot fight');
    else if (secs < HOT_SECS) warn.push(`NOT ENOUGH HEAT SINKS — reactor shutdown after ${secs.toFixed(1)} s of sustained fire${k < 1 ? ` in ${BIOMES[biome].name.toLowerCase()} air` : ''}` + (st.sinks < st.slots ? ` · ${st.slots - st.sinks} sink slot${st.slots - st.sinks > 1 ? 's' : ''} empty` : c.back !== 'snk' ? ' · fit cryo sinks or cooler weapons' : ''));
    if (st.over) warn.push(`OVERWEIGHT — ${st.tons.toFixed(0)} t on a ${PARTS.legs[c.legs].cap} t frame`);
    if (ct && ct.cap && st.tons > ct.cap + .049) block.push(`OVER THE CONTRACT WEIGHT LIMIT — ${st.tons.toFixed(0)} t, and this one is written for ${ct.cap} t (${CAP_N[ct.cap].toLowerCase()}${ct.cap > 45 ? ' or lighter' : ''}). Bring up a lighter machine or strip this one`);
    if (ct && wingRec(ct) && !CO.wing) warn.push('WINGMAN RECOMMENDED — this one is rated for two machines. Hire a pilot on the command deck or in the bar');
  }
  return { ok: !block.length, block, warn, st, secs };
}

/* ---- market: a small rotating stock. Consumables are always there, weapons come and go, body parts are the exception ---- */
function shopRoll(force) {
  const rot = Math.floor(now() / SHOP_HOURS); if (!force && rot === YARD.shop.rot) return false;
  const R = mulberry(CO.seed * 31 + rot * 977 + 5), rr = (a, b) => a + (R() * (b - a + 1) | 0), stock = [], take = (cat, n, wt) => { const ids = Object.keys(YARD_VAL[cat]), out = []; for (let g = 0; g < 40 && out.length < n; g++) { const id = ids[(R() * ids.length) | 0]; if (!out.includes(id) && R() < wt[YARD_VAL[cat][id][1]]) out.push(id); } return out; };
  const put = (key, qty, k = 1, tag = '') => stock.push({ key, qty, price: Math.round(itemInfo(key).price * k * (.9 + R() * .22) / 500) * 500, tag });
  put('gear.sink', rr(2, 5)); put('gear.kit', rr(1, 3)); put('gear.cool', rr(1, 3));
  for (const id of take('arm', rr(2, 3), [1, .5, .5])) put('arm.' + id, rr(1, 2)); for (const id of take('back', rr(1, 2), [1, .6, .6])) put('back.' + id, 1);
  if (R() < .55) for (const id of take('head', 1, [1, .6, .3])) put('head.' + id, 1);
  if (R() < .38) { const cat = R() < .5 ? 'legs' : 'torso'; for (const id of take(cat, 1, [1, 1, .45])) put(cat + '.' + id, 1, 1.25, 'RARE FIND'); }
  YARD.shop = { rot, stock }; return true;
}
const shopEta = () => Math.max(0, (YARD.shop.rot + 1) * SHOP_HOURS - now());
const sellValue = key => Math.round(itemInfo(key).price * SELL_K / 500) * 500;

/* ---- salvage: what the recovery crews drag off the field. The contract's salvage rights decide how many pieces are ours ---- */
function salvageRoll(c, loot, cache) {
  const pool = [], add = k => pool.push(k), ch = { armL: .34, armR: .34, back: .28, head: .2, torso: .1, legs: .1 };
  for (const e of loot) {
    if (e.kind === 'gift') add(e.key);
    else if (e.kind === 'mech' && e.cfg) { for (const s of SLOTS) if (e.cfg[s] && Math.random() < ch[s]) add(CAT[s] + '.' + e.cfg[s]); if (Math.random() < .4) add('gear.sink'); if (Math.random() < .3) add('gear.scrap'); if (Math.random() < .1) add('gear.core'); }
    else if (e.kind === 'struct') { if (Math.random() < .3) add('gear.scrap'); if (Math.random() < .12) add(pick(['gear.kit', 'gear.cool'])); if (e.sk === 'gen' && Math.random() < .35) add('gear.core'); if (e.sk === 'depot' && Math.random() < .5) add(pick(['gear.sink', 'gear.kit', 'gear.cool'])); if (e.sk === 'fab') { add('gear.sink'); add(pick(['gear.core', 'gear.kit', 'gear.cool'])); add('arm.' + pick(Object.keys(PARTS.arm))); } }
    else if (e.kind === 'ship') { add('gear.core'); add('gear.sink'); add('gear.sink'); add(pick(['gear.kit', 'gear.cool'])); add('arm.' + pick(Object.keys(PARTS.arm).filter(k => PARTS.arm[k].lv > 1))); }
    else if (e.vk === 'sub' || e.vk === 'worm' && Math.random() < .5) { if (Math.random() < .4) add('gear.sink'); if (Math.random() < .3) add('gear.scrap'); }
    else if (e.kind !== 'drone') { if (Math.random() < .16) add('gear.sink'); if (Math.random() < .14) add('gear.scrap'); if (Math.random() < .07) add('gear.cool'); }
  }
  if (cache) add('arm.' + pick(Object.keys(PARTS.arm)));
  if (!pool.length) return null;
  while (pool.length > 9) { const i = pool.findIndex(k => k === 'gear.scrap'); pool.splice(i >= 0 ? i : (Math.random() * pool.length) | 0, 1); }
  pool.sort((a, b) => ICAT_KEYS.indexOf(a.split('.')[0]) - ICAT_KEYS.indexOf(b.split('.')[0]) || itemInfo(b).price - itemInfo(a).price);
  return { pool, picks: Math.min(pool.length, clamp(Math.round(c.salv / 12), 1, 5)) };
}

/* ---- save files: one JSON document holds the whole company. localStorage keeps a copy; the settings screen exports and imports it ---- */
/* what the bar remembers: how much you have had (bz, as of sector hour bzT — it wears off), whether you are rested, who has told you their story, which freelancers are laid up, the house tally */
const BARSV = { bz: 0, bzT: 0, rested: false, told: {}, pst: {}, wins: { drink: 0, arm: 0 } };
function barSave() { const pst = {}, n = CO.day * 24 + CO.hour; for (const k in BARSV.pst) if (BARSV.pst[k].until > n) pst[k] = { until: +BARSV.pst[k].until.toFixed(2) }; return { bz: +BARSV.bz.toFixed(3), bzT: +BARSV.bzT.toFixed(2), rested: BARSV.rested, wins: { ...BARSV.wins }, told: Object.fromEntries(Object.entries(BARSV.told).map(([k, v]) => [k, +v.toFixed(2)])), pst }; }
function saveBlob() {
  return {
    game: GAME_ID, v: 2, saved: new Date().toISOString(), company: { name: YARD.name, logo: { ...YARD.logo }, founded: YARD.founded },
    ledger: { cb: Math.round(CO.cb), day: CO.day, hour: +CO.hour.toFixed(2), rep: { ...CO.rep }, done: CO.done, fails: CO.fails, seed: CO.seed, ...rivSave() },
    inventory: { ...YARD.inv }, bays: YARD.bays.map(b => ({ ...b })), activeBay: YARD.act, market: { rot: YARD.shop.rot, stock: YARD.shop.stock.map(e => ({ ...e })), mechs: YARD.shop.mechs ? YARD.shop.mechs.map(e => ({ ...e })) : undefined, mrot: YARD.shop.mrot },
    board: CO.board.filter(c => !c.story).map(c => ({ ...c })), active: CO.active && !CO.active.story ? CO.active.id : null, news: CO.news.slice(0, 9),
    pilots: PILOTS.map(p => ({ fee: p.fee, until: p.until, hag: !!p.hag })), wing: CO.wing ? { i: PILOTS.indexOf(CO.wing.p), share: CO.wing.share, s: CO.wing.p.seed || 0, paid: CO.wing.paid || 0 } : null, bar: barSave(), story: storySave(), tut: tutSave(), stats: talSave(),
  };
}
/* returns a reason string if the document is not one of ours */
function saveCheck(s) {
  if (!s || typeof s !== 'object') return 'Not a save file.'; if ((s.game !== GAME_ID && s.game !== GAME_WAS) || s.v !== 2) return `Not a ${GAME_NAME} save (or from an incompatible version).`;
  if (!s.ledger || typeof s.ledger.cb !== 'number' || !Array.isArray(s.bays)) return 'The save is missing its ledger or mech bays.'; return '';
}
function ledgerApply(s) {
  const L = (s && s.ledger) || (s && s.rep ? s : null) || {}, num = (v, d) => typeof v === 'number' && isFinite(v) ? v : d;
  Object.assign(CO, { cb: num(L.cb, 120000), day: Math.max(1, num(L.day, 1) | 0), hour: clamp(num(L.hour, 6), 0, 23.99), done: Math.max(0, num(L.done, 0) | 0), fails: Math.max(0, num(L.fails, 0) | 0), seed: num(L.seed, (Math.random() * 1e6) | 0) | 0, active: null, sel: null, wing: null, wingDown: false, board: [], news: [], dirty: true });
  for (const f of EMPS) CO.rep[f] = clamp(num(L.rep && L.rep[f], 0), -100, 100); rivApply(L);
}
function boardApply(s) {
  CO.board = []; CO.news = []; CO.active = CO.sel = null;
  const ok = c => c && !c.story && TYPES[c.type] && TYPES[c.type].plots.includes(c.plot) && FAC[c.emp] && FAC[c.foe] && BIOMES[c.biome] && PERSONA[c.persona] && c.contact && c.contact.name && Array.isArray(c.pos) && typeof c.pay === 'number' && typeof c.seed === 'number';
  if (s && Array.isArray(s.board)) for (const c of s.board) if (ok(c)) { c.twists = (c.twists || []).filter(t => TWISTS[t]); rivClean(c); c.intel = Array.isArray(c.intel) ? c.intel : []; c.diff = clamp(c.diff | 0, 1, 5); c.cap = [45, 65, 85].includes(c.cap) ? c.cap : 0; c.mood = c.mood ? 1 : 0; if (!TOD_KEYS.includes(c.tod)) c.tod = todDeal(c.biome, CO.board.map(b => b.tod)); CO.board.push(c); cid = Math.max(cid, c.id | 0); }
  if (s && Array.isArray(s.news)) CO.news = s.news.filter(n => typeof n === 'string').slice(0, 9);
  if (s && s.active != null) CO.active = CO.board.find(c => c.id === s.active) || null;
  if (!CO.board.length) { fillBoard(); news(tutLock() ? TUT_WIRE() : `${YARD.name} mercenary company is open for contracts.`); } else { boardSpread(); fillBoard(); }
  if (YARD.shop.rot < 0) shopRoll(true); CO.dirty = true;
}
function pilotsApply(s) {
  const D = [24000, 52000]; PILOTS.forEach((p, i) => { const q = s && Array.isArray(s.pilots) && s.pilots[i]; p.fee = q && q.fee > 0 ? q.fee | 0 : D[i]; p.until = q ? +q.until || 0 : 0; p.hag = !!(q && q.hag); });
  const w = s && s.wing, p = w && PILOTS[w.i]; CO.wing = p ? { p, ch: p.ch, mech: p.mech, share: +w.share || 0 } : null;
}

/* a torso with no legs under it sits on an assembly cradle; an empty bay is just the bare stand */
function mechCradle(c) {
  const g = new THREE.Group(), u = g.userData; u.hip = grp(g, 0, 5.2, 0); u.legs = []; u.anim = () => { }; u.cradle = true; if (!c.torso) return g;
  cyl(g, M.dark, 2.6, 3, .5, 0, .25, 0, 0, 0, 0, 12); cyl(g, M.yellow, .55, .7, 4.3, 0, 2.6, 0, 0, 0, 0, 10); cyl(g, M.girder, 1.5, 1.1, .5, 0, 4.95, 0, 0, 0, 0, 12);
  for (let i = 0; i < 4; i++) { const a = i * PI / 2 + PI / 4; box(g, M.yellow, .28, 4.9, .28, Math.sin(a) * 1.75, 2.5, Math.cos(a) * 1.75, -Math.cos(a) * .42, 0, Math.sin(a) * .42); box(g, M.hazard, .9, .16, .9, Math.sin(a) * 2.75, .58, Math.cos(a) * 2.75, 0, a, 0); }
  return g;
}

