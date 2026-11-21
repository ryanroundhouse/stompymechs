/* ============ STORES: ONE ITEM BROWSER FOR INVENTORY, MARKET, FITTING AND SALVAGE ============ */
const ST = { open: false, mode: 'inv', slot: null, cat: 'all', sort: 'name', dir: 1, find: '', salv: null, picked: new Set(), done: null };
const uiModal = () => !!document.querySelector('.ovl:not(.hid)');
function storesOpen(o = {}) {
  Object.assign(ST, { open: true, mode: o.mode || 'inv', slot: o.slot || null, salv: o.salv || null, done: o.done || null, find: '', picked: new Set(), sure: 0, mSaid: '', mArm: null }); ST.cat = 'all'; $('stFind').value = '';
  if (ST.mode === 'shop' || ST.mode === 'inv' || ST.mode === 'mech') shopRoll(); if (ST.mode === 'mech') { ST.sort = 'lot'; ST.dir = 1; } $('stores').classList.remove('hid'); storesDraw();
}
function storesClose() {
  if (!ST.open) return; if (ST.mode === 'salv') { for (const i of ST.picked) invAdd(ST.salv.pool[i], 1); saveCO(); }
  ST.open = false; $('stores').classList.add('hid'); const d = ST.done; ST.done = null; if (mode === 'hangar') refreshUI(); CO.dirty = true; if (d) d([...ST.picked].map(i => ST.salv.pool[i]));
}
/* ---- fitting: every part on offer is marked against the one in the slot. [better when higher (+1) or lower (-1), decimals] ---- */
const FITCMP = { tons: [-1, 0], armor: [1, 0], speed: [1, 0], cap: [1, 0], sinks: [1, 0], cool: [1, 1], sensor: [1, 0], dmg: [1, 0], dps: [1, 0], heat: [-1, 1], range: [1, 0] };
const fitDelta = (d, dir, dp) => { const r = +d.toFixed(dp); return r ? `<i class="${r * dir > 0 ? 'fup' : 'fdn'}">${r > 0 ? '▲' : '▼'}${Math.abs(r).toFixed(dp)}</i>` : '<i class="feq">=</i>'; };
/* the chips of one part, each with its difference from the fitted part `ref`; what the fitted part has and this one lacks is listed as lost */
function fitChips(it, ref, sk) {
  const num = k => k && FITCMP[k] && !(it.cat === 'back' && (k === 'cool' || k === 'sensor')), out = [];   /* a back unit's cooling and sensor figures are multipliers, not amounts */
  for (const [l, v, k] of it.chips) {
    const old = ref.chips.find(c => c[0] === l); let d;
    if (num(k)) d = fitDelta(it.s[k] - (ref.s[k] || 0), ...FITCMP[k]);
    else if (l === 'TWIST') { const a = PARTS.legs[it.id].twist, b = PARTS.legs[ref.id].twist; d = a === b ? '<i class="feq">=</i>' : `<i class="${a > b ? 'fup' : 'fdn'}">WAS ${old ? old[1] : '—'}</i>`; }
    else d = !old ? '<i class="fup">NEW</i>' : old[1] === v ? '<i class="feq">=</i>' : `<i class="feq">WAS ${old[1]}</i>`;
    out.push(`<span class="${k === sk ? 'on' : ''}">${l} <b>${v}</b>${d}</span>`);
  }
  for (const [l, v, k] of ref.chips) if (!it.chips.some(c => c[0] === l)) out.push(`<span class="flo">${l} <b>—</b>${num(k) ? fitDelta(-ref.s[k], ...FITCMP[k]) : '<i class="fdn">LOST</i>'}</span>`);
  return out.join('');
}
/* what fitting `id` into `slot` does to the whole machine on the stand: only the figures that move, then any limit it crosses */
function fitMech(slot, id) {
  const c = player.cfg, n = { ...c, [slot]: id }, bio = CO.active && CO.active.biome; if (slot === 'torso') n.sinks = Math.min(c.sinks, PARTS.torso[id].sinks);
  const a = mechReady(c, bio), b = mechReady(n, bio), A = a.st, B = b.st, out = [], kph = s => s.speed * 3.6 * RUN;
  const put = (l, x, y, dir, dp, u) => { if (+(y - x).toFixed(dp)) out.push(`<span>${l} <b>${y.toFixed(dp)}${u}</b>${fitDelta(y - x, dir, dp)}</span>`); };
  put('MASS', A.tons, B.tons, -1, 0, ' t'); put('ARMOR', A.armor, B.armor, 1, 0, ''); put('SPEED', kph(A), kph(B), 1, 0, ' kph'); put('FIREPOWER', A.fire, B.fire, 1, 0, ' dps'); put('HEAT', A.heat, B.heat, -1, 1, '/s'); put('COOLING', A.cool, B.cool, 1, 1, ''); put('SENSORS', A.sensor, B.sensor, 1, 0, '');
  if (A.jets !== B.jets) out.push(`<span class="${B.jets ? 'fup' : 'fdn'}">${B.jets ? 'GAINS' : 'LOSES'} JUMP JETS</span>`);
  if (A.over !== B.over) out.push(`<span class="${B.over ? 'fdn' : 'fup'}">${B.over ? 'OVERWEIGHT' : 'BACK WITHIN LOAD'}</span>`);
  const hotA = a.secs < HOT_SECS, hotB = b.secs < HOT_SECS; if (hotA !== hotB && B.weapons) out.push(`<span class="${hotB ? 'fdn' : 'fup'}">${hotB ? `SHUTDOWN IN ${b.secs.toFixed(1)} s` : 'HEAT UNDER CONTROL'}</span>`);
  return out.length ? out.join('') : '<span class="feq">NO CHANGE TO THE MACHINE</span>';
}
function storesRows() {
  let L;
  if (ST.mode === 'shop') L = YARD.shop.stock.map((e, i) => ({ key: e.key, qty: e.qty, price: e.price, tag: e.tag, i }));
  else if (ST.mode === 'salv') L = ST.salv.pool.map((key, i) => ({ key, qty: 1, price: itemInfo(key).price, i }));
  else L = Object.keys(YARD.inv).map(key => ({ key, qty: YARD.inv[key], price: sellValue(key) }));
  for (const r of L) r.it = itemInfo(r.key);
  if (ST.mode === 'fit') L = L.filter(r => r.it.cat === CAT[ST.slot]);
  return L;
}
/* the three tabs along the top: what we own, what the quartermaster has, and the dealer's whole machines */
function storesTabs() {
  $('stTabs').innerHTML = [['inv', `INVENTORY · ${invCount()} ITEMS`], ['shop', `MARKET · ${YARD.shop.stock.length} LOTS`], ['mech', `MECH DEALER · ${dealLot().length} ON THE LOT`]].map(([k, l]) => `<button data-k="${k}" class="${k === ST.mode ? 'on' : ''}">${l}</button>`).join('');
  $('stTabs').querySelectorAll('button').forEach(b => b.onclick = () => { sfx.play('ui'); ST.mode = b.dataset.k; ST.cat = 'all'; ST.mSaid = ''; if (ST.mode === 'mech') { ST.sort = 'lot'; ST.dir = 1; } storesDraw(); });
}
function storesDraw() {
  if (!ST.open) return; $('stGrid').classList.toggle('mkg', ST.mode === 'mech'); $('stFind').classList.toggle('hid', ST.mode === 'mech'); storesTabs(); if (ST.mode === 'mech') return dealDraw(); const M0 = ST.mode, fit = M0 === 'fit', salv = M0 === 'salv', all = storesRows(), f = ST.find.trim().toUpperCase(), sk = ST.sort, cur = fit ? player.cfg[ST.slot] : null;
  /* the part in the slot heads the list when fitting: it is what everything else is measured against */
  const ref = cur ? itemInfo(CAT[ST.slot] + '.' + cur) : null, now0 = ref ? { key: ref.key, qty: 1, price: sellValue(ref.key), it: ref, cur: true } : null;
  let L = all.filter(r => (ST.cat === 'all' || r.it.cat === ST.cat) && (!f || (r.it.name + ' ' + r.it.desc + ' ' + ICAT[r.it.cat].label + ' ' + (r.it.wclass || '')).toUpperCase().includes(f)));
  const val = r => sk === 'name' ? r.it.name : sk === 'price' ? r.price : r.it.s[sk];
  L.sort((a, b) => { const x = val(a), y = val(b); if (x == null || y == null) return (x == null) - (y == null) || a.it.name.localeCompare(b.it.name); return (sk === 'name' ? x.localeCompare(y) : x - y) * ST.dir || ICAT_KEYS.indexOf(a.it.cat) - ICAT_KEYS.indexOf(b.it.cat) || a.it.name.localeCompare(b.it.name); });
  $('stTitle').textContent = fit ? `FIT ${SLOT_LABEL[ST.slot]} — ${bayTitle()}` : salv ? `SALVAGE — ${ST.salv.site.toUpperCase()}` : 'COMPANY STORES'; $('stFunds').textContent = salv ? `SALVAGE RIGHTS ${ST.salv.pct}%` : 'FUNDS ' + fmt(CO.cb);
  $('stTabs').classList.toggle('hid', fit || salv);
  $('stCats').classList.toggle('hid', fit); $('stCats').innerHTML = ['all', ...ICAT_KEYS].map(k => { const n = k === 'all' ? all.length : all.filter(r => r.it.cat === k).length; return `<button data-k="${k}" class="${k === ST.cat ? 'on' : ''}" ${n ? '' : 'disabled'} style="--c:${k === 'all' ? '#ffb21a' : ICAT[k].col}">${iconSvg(k, 16, 'currentColor')}${k === 'all' ? 'ALL' : ICAT[k].label}<i>${n}</i></button>`; }).join('');
  $('stCats').querySelectorAll('button').forEach(b => b.onclick = () => { sfx.play('ui'); ST.cat = b.dataset.k; storesDraw(); });
  const has = new Set(); for (const r of all) { has.add('name'); has.add('price'); for (const k in r.it.s) has.add(k); } if (!has.has(sk)) ST.sort = 'name';
  $('stSort').innerHTML = SORTS.filter(([k]) => has.has(k) || k === 'name').map(([k, l]) => `<option value="${k}" ${k === ST.sort ? 'selected' : ''}>${k === 'price' && (M0 === 'inv' || fit) ? 'SELL VALUE' : l}</option>`).join(''); $('stDir').textContent = ST.dir > 0 ? '▲ LOW → HIGH' : '▼ HIGH → LOW';
  $('stNote').innerHTML = fit ? (cur ? `Fitted now: <b>${ref.name}</b>, shown first. Every other part is marked against it — <i class="fup">▲▼ green</i> is better than what is fitted, <i class="fdn">▲▼ red</i> is worse — and its second line is what the swap does to the whole machine.` : `Nothing fitted. Pick a ${ICAT[CAT[ST.slot]].one.toLowerCase()} from stores; the second line of each is what it does to the machine.`)
    : salv ? `The recovery crews pulled <b>${ST.salv.pool.length}</b> intact pieces off the field. The contract lets us keep <b>${ST.salv.picks}</b>. Choose.`
      : M0 === 'shop' ? `The quartermaster's stock turns over in <b>${shopEta().toFixed(0)} h</b>. Weapons and equipment come and go — <b>chassis parts are rare</b>, so buy them when you see them, or buy a whole machine from the <b>MECH DEALER</b> tab.`
        : `Everything not bolted to a mech. Anything here sells for <b>${SELL_K * 100}%</b> of list. Fitted components must come off in the bay first. For a whole machine rather than its parts, see the <b>MECH DEALER</b> tab.`;
  const act = r => r.cur ? '<button data-a="rem">REMOVE</button>' : fit ? (r.it.id === cur ? '<button disabled>FITTED</button>' : `<button data-a="fit" data-k="${r.it.id}">FIT</button>`) : salv ? `<button data-a="pick" data-i="${r.i}" class="${ST.picked.has(r.i) ? 'on' : ''}" ${!ST.picked.has(r.i) && ST.picked.size >= ST.salv.picks ? 'disabled' : ''}>${ST.picked.has(r.i) ? '✔ CLAIMED' : 'CLAIM'}</button>` : M0 === 'shop' ? `<button data-a="buy" data-i="${r.i}" ${CO.cb < r.price ? 'disabled' : ''}>BUY</button>` : `<button data-a="sell" data-k="${r.key}">SELL</button>`;
  const plain = it => it.chips.map(([l, v, k]) => `<span class="${k === sk ? 'on' : ''}">${l} <b>${v}</b></span>`).join('');
  const row = r => {
    const it = r.it, C = ICAT[it.cat], same = fit && !r.cur && it.id === cur, cmp = fit && !r.cur && !same;
    return `<div class="it${salv && ST.picked.has(r.i) ? ' on' : ''}${r.cur ? ' cur' : ''}" style="--c:${C.col}"><div class="ii">${iconSvg(it.key, 44)}${it.rare ? `<span class="r${it.rare}">${RARE_N[it.rare]}</span>` : ''}</div>
<div class="ib"><b>${it.name}</b>${r.qty > 1 ? `<em>×${r.qty}</em>` : ''}${r.tag ? `<u>${r.tag}</u>` : ''}${r.cur ? '<u class="fnow">FITTED NOW</u>' : same ? '<u class="fnow">SAME AS FITTED</u>' : ''}<small><span style="color:${C.col}">${C.one}${it.wclass ? ' · ' + it.wclass : ''}</span> · ${it.desc}</small><div class="ch">${cmp && ref ? fitChips(it, ref, sk) : plain(it)}</div>${cmp ? `<div class="ch fme"><em>ON THE MACHINE</em>${fitMech(ST.slot, it.id)}</div>` : ''}</div>
<div class="ia"><u>${salv ? 'worth ' : ''}${fmt(r.price)}</u>${act(r)}</div></div>`;
  };
  $('stGrid').innerHTML = (now0 ? row(now0) : '') + (L.map(row).join('') || `<p class="nil">${fit ? `No ${cur ? 'other ' : ''}${ICAT[CAT[ST.slot]].label.toLowerCase()} in stores. Try the market, or bring some home as salvage.` : f || ST.cat !== 'all' ? 'Nothing matches that filter.' : M0 === 'shop' ? 'Sold out. New stock arrives with the next rotation.' : 'The stores are empty.'}</p>`);
  $('stGrid').querySelectorAll('button').forEach(b => b.onclick = () => {
    const a = b.dataset.a;
    if (a === 'fit' || a === 'rem') { const s = ST.slot; storesClose(); sfx.play('ui'); fitPart(s, a === 'fit' ? b.dataset.k : null); return; }
    if (a === 'pick') { const i = +b.dataset.i; ST.picked.has(i) ? ST.picked.delete(i) : ST.picked.add(i); ST.sure = 0; sfx.play('ui'); }
    if (a === 'buy') { const e = YARD.shop.stock[+b.dataset.i]; if (!e || !spend(e.price)) return sfx.play('deny'); invAdd(e.key, 1); if (--e.qty <= 0) YARD.shop.stock.splice(+b.dataset.i, 1); saveCO(); sfx.play('ok'); }
    if (a === 'sell') { const k = b.dataset.k; if (!invN(k)) return; invAdd(k, -1); CO.cb += sellValue(k); CO.dirty = true; saveCO(); sfx.play('ok'); }
    storesDraw();
  });
  $('stInfo').textContent = salv ? `${ST.picked.size} of ${ST.salv.picks} claimed` : fit ? `${L.length} in stores${cur ? ' · 1 fitted' : ''}` : `${L.length} of ${all.length} shown`;
  $('stRem').classList.toggle('hid', !cur); const sure = salv && ST.sure > performance.now(); $('stClose').textContent = salv ? (ST.picked.size ? `TAKE ${ST.picked.size} — SEND THE REST FOR SCRAP` : sure ? `CONFIRM — LEAVE ALL ${ST.salv.pool.length} BEHIND` : 'LEAVE IT ALL') : 'CLOSE'; $('stClose').style.color = sure ? 'var(--hot)' : '';
  if (salv && !ST.picked.size) $('stInfo').textContent = sure ? `Nothing claimed. You are owed ${ST.salv.picks} — press again to give it all up` : `0 of ${ST.salv.picks} claimed — click a piece to keep it`;
}
{
  $('stFind').oninput = e => { ST.find = e.target.value; storesDraw(); }; $('stFind').onkeydown = e => e.stopPropagation();
  $('stSort').onchange = e => { ST.sort = e.target.value; ST.dir = ST.sort === 'name' ? 1 : -1; sfx.play('ui'); storesDraw(); }; $('stDir').onclick = () => { ST.dir = -ST.dir; sfx.play('ui'); storesDraw(); };
  $('stClose').onclick = () => {
    if (ST.mode === 'salv' && !ST.picked.size && !(ST.sure > performance.now())) { ST.sure = performance.now() + 7000; sfx.play('deny'); storesDraw(); return setTimeout(() => { if (ST.open && ST.mode === 'salv') storesDraw(); }, 7100); }
    ST.sure = 0; sfx.play('ui'); storesClose(); }; $('stRem').onclick = () => { const s = ST.slot; storesClose(); sfx.play('ui'); fitPart(s, null); };
  $('stores').addEventListener('pointerdown', e => { if (e.target === $('stores') && ST.mode !== 'salv') storesClose(); });
}

