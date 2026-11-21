/* ============ THE MECH DEALER: WHOLE MACHINES, ON THE THIRD TAB OF THE STORES ============ */
/* A catalogue machine, assembled and delivered: to the first empty bay, or crated into stores as its parts when every bay is taken. Six stand on the lot at any time, one of each
   weight class among them, and turn over with the market; anything else in the catalogue can be built to order, for a premium. The lot is YARD.shop.mechs ([{ p, price, tag }], p an
   index into PRESETS) and is saved with the market; mrot is the market rotation it was dealt for, so a save from before the dealer (or a new rotation) gets a fresh one */
const DEAL_CLS = { LIGHT: '#8dff6a', MEDIUM: '#7fe7ff', HEAVY: '#ffb21a', ASSAULT: '#ff7a55' };
const DEAL_SORT = [['lot', 'ON THE LOT FIRST'], ['price', 'PRICE'], ['tons', 'MASS'], ['armor', 'ARMOR'], ['fire', 'FIREPOWER'], ['speed', 'SPEED'], ['name', 'NAME']];
const dealCfg = p => { const c = PRESETS[p]; return { name: c.name, paint: c.paint | 0, legs: c.legs, torso: c.torso, head: c.head, armL: c.armL, armR: c.armR, back: c.back, sinks: PARTS.torso[c.torso].sinks }; };
/* what its parts would cost bought one at a time at list */
const dealList = cfg => SLOTS.reduce((s, k) => s + (cfg[k] ? itemInfo(CAT[k] + '.' + cfg[k]).price : 0), 0) + (cfg.sinks || 0) * GEAR.sink.price;
const dealRound = v => Math.round(v / 1000) * 1000;
function dealRoll() {
  const R = mulberry(CO.seed * 53 + YARD.shop.rot * 1291 + 17), got = [], all = PRESETS.map((p, i) => i), take = L => { const F = L.filter(i => !got.includes(i)); if (F.length) got.push(F[(R() * F.length) | 0]); };
  for (const c of Object.keys(DEAL_CLS)) take(all.filter(i => mechStats(PRESETS[i]).cls === c)); while (got.length < DEAL_K.n) take(all);
  const sp = (R() * got.length) | 0;
  return got.map((p, i) => ({ p, price: dealRound(dealList(dealCfg(p)) * (i === sp ? DEAL_K.special : DEAL_K.lot[0] + R() * (DEAL_K.lot[1] - DEAL_K.lot[0]))), tag: i === sp ? "DEALER'S SPECIAL" : '' }));
}
function dealLot() { const S = YARD.shop; if (!Array.isArray(S.mechs) || S.mrot !== S.rot) { S.mechs = dealRoll(); S.mrot = S.rot; } return S.mechs; }
/* every machine in the catalogue as the dealer sells it: off the lot at the lot's price, or built to order */
function dealRows() {
  const lot = dealLot();
  return PRESETS.map((P0, p) => { const cfg = dealCfg(p), st = mechStats(cfg), e = lot.find(e => e.p === p); return { p, cfg, st, role: P0.role, lot: !!e, tag: e ? e.tag || 'ON THE LOT' : 'BUILT TO ORDER', price: e ? e.price : dealRound(dealList(cfg) * DEAL_K.order) }; });
}
/* a picture of the machine, taken once: it is stood in a small studio and drawn through the same chain as everything else, then copied off the canvas before the room draws over it */
const dealPic = {};
function dealShot(p) {
  if (dealPic[p]) return dealPic[p];
  const S = dealShot.S || (dealShot.S = (() => {
    const sc = new THREE.Scene(), cv = document.createElement('canvas'); cv.width = 240; cv.height = 264; sc.background = new THREE.Color(0x1b232b); sc.environment = ENV; sc.add(new THREE.HemisphereLight(0xdfe8f6, 0x4a4034, 1.9));
    const sun = new THREE.DirectionalLight(0xfff0d8, 3.6); sun.position.set(20, 40, 30); sc.add(sun); const rim = new THREE.DirectionalLight(0x7fd8ff, 1.2); rim.position.set(-30, 18, -24); sc.add(rim);
    const fl = new THREE.Mesh(new THREE.CircleGeometry(60, 40), std({ color: 0x46505a, roughness: .9, metalness: .1 })); fl.rotation.x = -PI / 2; sc.add(fl);
    return { sc, cv, g: cv.getContext('2d'), cam: new THREE.PerspectiveCamera(26, 1, .1, 900) };
  })());
  const gl = renderer.domElement, m = new Mech(dealCfg(p)), bb = new THREE.Box3().setFromObject(m.root), h = m.height, wide = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z), d = Math.max(h, wide * 1.12) * 2.3 + 5, a = .62; m.update(.016); S.sc.add(m.root); m.root.updateMatrixWorld(true);
  S.cam.aspect = gl.width / gl.height; S.cam.updateProjectionMatrix(); S.cam.position.set(Math.sin(a) * d, h * .6, Math.cos(a) * d); S.cam.lookAt(0, h * .47, 0); POST.draw(S.sc, S.cam, .2);
  const sh = gl.height, sw = Math.min(gl.width, sh * S.cv.width / S.cv.height); S.g.drawImage(gl, (gl.width - sw) / 2, 0, sw, sh, 0, 0, S.cv.width, S.cv.height);
  S.sc.remove(m.root); for (const mt of Object.values(m.mats)) mt.dispose(); POST.kick();
  return dealPic[p] = S.cv.toDataURL('image/jpeg', .86);
}
/* where a bought machine goes: the first bay with nothing in it, or -1 for crates in stores */
const dealBay = () => YARD.bays.findIndex(b => !bayParts(b));
function dealBuy(r) {
  if (!spend(r.price, 'mech')) return false; tal('y.mech'); const i = dealBay(), lot = dealLot(), k = lot.findIndex(e => e.p === r.p); if (k >= 0) lot.splice(k, 1);
  if (i < 0) { for (const s of SLOTS) if (r.cfg[s]) invAdd(CAT[s] + '.' + r.cfg[s], 1); if (r.cfg.sinks) invAdd('gear.sink', r.cfg.sinks); ST.mSaid = `${r.cfg.name} DELIVERED IN CRATES — 6 PARTS${r.cfg.sinks ? ` AND ${r.cfg.sinks} HEAT SINKS` : ''} ARE IN STORES. CLEAR A BAY AND FIT THEM`; }
  else {
    Object.assign(YARD.bays[i], cleanBay(r.cfg)); ST.mSaid = `${r.cfg.name} DELIVERED TO BAY ${i + 1} — ASSEMBLED, FUELLED AND READY`;
    if (i === YARD.act) { applyPaint(player.mats, player.cfg.paint); player.build(); mechName = bayTitle(); if (HQ.setMini) HQ.setMini(); if (mode === 'hangar') setStatus('STAND READY — ' + mechName); }
  }
  news(`${YARD.name} took delivery of a ${r.st.cls.toLowerCase()} ${r.cfg.name} from the dealer.`); yardChanged(); return true;
}
function dealDraw() {
  const all = dealRows(), cls = Object.keys(DEAL_CLS).includes(ST.mcls) ? ST.mcls : 'all', sk = DEAL_SORT.some(s => s[0] === ST.sort) ? ST.sort : 'lot', ref = bayParts(player.cfg) && player.cfg.legs && player.cfg.torso ? mechStats(player.cfg) : null, bay = dealBay(), kph = s => s.speed * 3.6 * RUN;
  const val = r => sk === 'name' ? r.cfg.name : sk === 'price' ? r.price : sk === 'lot' ? (r.lot ? 0 : 1) : sk === 'speed' ? r.st.speed : r.st[sk], L = all.filter(r => cls === 'all' || r.st.cls === cls);
  L.sort((a, b) => { const x = val(a), y = val(b); return (sk === 'name' ? x.localeCompare(y) : x - y) * ST.dir || a.price - b.price; });
  $('stTitle').textContent = 'MECH DEALER'; $('stFunds').textContent = 'FUNDS ' + fmt(CO.cb); $('stTabs').classList.remove('hid'); $('stCats').classList.remove('hid'); $('stRem').classList.add('hid'); $('stClose').textContent = 'CLOSE'; $('stClose').style.color = '';
  $('stCats').innerHTML = ['all', ...Object.keys(DEAL_CLS)].map(k => { const n = k === 'all' ? all.length : all.filter(r => r.st.cls === k).length; return `<button data-k="${k}" class="${k === cls ? 'on' : ''}" style="--c:${k === 'all' ? '#ffb21a' : DEAL_CLS[k]}">${k === 'all' ? 'ALL CLASSES' : k}<i>${n}</i></button>`; }).join('');
  $('stCats').querySelectorAll('button').forEach(b => b.onclick = () => { sfx.play('ui'); ST.mcls = b.dataset.k; dealDraw(); });
  $('stSort').innerHTML = DEAL_SORT.map(([k, l]) => `<option value="${k}" ${k === sk ? 'selected' : ''}>${l}</option>`).join(''); $('stDir').textContent = ST.dir > 0 ? '▲ LOW → HIGH' : '▼ HIGH → LOW';
  $('stNote').innerHTML = `Whole machines, assembled. <b>${dealLot().length}</b> stand on the lot and change with the market in <b>${shopEta().toFixed(0)} h</b>; anything else in the catalogue is <b>built to order at +${Math.round((DEAL_K.order - 1) * 100)}%</b>. `
    + (bay >= 0 ? `A purchase is delivered to <b>BAY ${bay + 1}</b>, which is empty.` : 'Every bay is taken: a purchase arrives <b>crated, as parts in stores</b>. Strip a bay first to have it delivered standing.')
    + (ref ? ` Figures are marked against <b>${player.cfg.name || 'the machine'}</b>, on the stand.` : '');
  const chip = (l, v, d) => `<span>${l} <b>${v}</b>${d || ''}</span>`, dl = (a, b, dir, dp) => ref ? fitDelta(a - b, dir, dp) : '', part = (cfg, s) => itemInfo(CAT[s] + '.' + cfg[s]).name, arm = ST.mArm && ST.mArm.until > performance.now() ? ST.mArm.p : -1;
  $('stGrid').innerHTML = L.map(r => {
    const st = r.st, c = r.cfg, col = DEAL_CLS[st.cls] || '#ffb21a', lim = CO.active && CO.active.cap && st.tons > CO.active.cap + .049;
    return `<div class="mk${r.lot ? ' lot' : ''}" style="--c:${col}"><img src="${dealShot(r.p)}" alt="${c.name}" width="120" height="132">
<div class="ib"><b>${c.name}</b><u${r.lot ? '' : ' class="ord"'}>${r.tag}</u><small><span style="color:${col}">${st.cls} · ${st.tons.toFixed(0)} T</span> · ${r.role}</small>
<div class="ch">${chip('ARMOR', st.armor, dl(st.armor, ref && ref.armor, 1, 0))}${chip('FIREPOWER', st.fire.toFixed(0) + ' dps', dl(st.fire, ref && ref.fire, 1, 0))}${chip('SPEED', kph(st).toFixed(0) + ' kph', dl(kph(st), ref && kph(ref), 1, 0))}${chip('HEAT / COOLING', st.heat.toFixed(1) + ' / ' + st.cool.toFixed(1))}${chip('SPRINT', sprintFor(st).toFixed(0) + ' s')}${st.jets ? chip('JUMP', 'JETS') : ''}${st.fx === 'shield' ? chip('SHIELD', '30%') : ''}${st.fx === 'ecm' ? chip('ECM', 'YES') : ''}</div>
<div class="mkl">${part(c, 'armL')} <i>+</i> ${part(c, 'armR')} <i>+</i> ${part(c, 'back')}<br><span>${part(c, 'legs')} · ${part(c, 'torso')} · ${part(c, 'head')} · ${c.sinks} heat sinks</span>${lim ? `<br><em>Over the ${CO.active.cap} t limit of the contract you have signed</em>` : ''}</div></div>
<div class="ia"><u>${fmt(r.price)}</u><small>${r.lot ? 'parts at list ' + fmt(dealList(c)) : 'order · +' + Math.round((DEAL_K.order - 1) * 100) + '%'}</small><button data-p="${r.p}" class="${arm === r.p ? 'on' : ''}" ${CO.cb < r.price ? 'disabled' : ''}>${CO.cb < r.price ? 'CANNOT AFFORD' : arm === r.p ? 'CONFIRM PURCHASE' : bay >= 0 ? `BUY — TO BAY ${bay + 1}` : 'BUY — CRATED'}</button></div></div>`;
  }).join('') || '<p class="nil">Nothing in that class.</p>';
  /* a machine is the price of several contracts: the first press arms the button, the second buys */
  $('stGrid').querySelectorAll('button').forEach(b => b.onclick = () => {
    const p = +b.dataset.p, r = all.find(r => r.p === p); if (!r) return;
    if (arm !== p) { ST.mArm = { p, until: performance.now() + 6000 }; sfx.play('ui'); dealDraw(); return setTimeout(() => { if (ST.open && ST.mode === 'mech') dealDraw(); }, 6100); }
    ST.mArm = null; if (!dealBuy(r)) return sfx.play('deny'); sfx.play('ok'); sfx.play('clang'); dealDraw();
  });
  $('stInfo').textContent = ST.mSaid || `${L.length} of ${all.length} machines shown · ${dealLot().length} on the lot`;
}
