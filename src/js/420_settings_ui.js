/* ============ SETTINGS, COMPANY IDENTITY, SAVE FILES, NEW GAME ============ */
const SET = { open: false, tab: 'audio', found: false, wipe: false, msg: '', bad: false, pv: -1, pvT: 0, q: '', sec: '' };
/* paint the company name and emblem wherever they appear */
function brandSync() {
  document.querySelectorAll('.ttl').forEach(t => { t.querySelector('b').textContent = YARD.name; const g = t.querySelector('canvas').getContext('2d'); g.clearRect(0, 0, 100, 100); drawLogo(g, 50, 50, 47); });
  document.title = YARD.name === CO_DEF_NAME ? GAME_NAME : YARD.name + ' — ' + GAME_NAME; if (HG.brand) HG.brand(); CO.dirty = true;
}
function gfxApply() {
  const pr = Math.min(devicePixelRatio, 1.5) * CFG.scale; renderer.setPixelRatio(pr); POST.bloom = CFG.bloom; if (GLOWL.on !== CFG.wlight) glowLights(CFG.wlight);
  for (const s of [HG.scene, FD.scene, HQ.scene, BAR.scene, BRF.scene]) s.traverse(o => { if (o.isLight && (o.castShadow || o.userData.sh)) { o.userData.sh = 1; o.castShadow = CFG.shadow; } });
  dispatchEvent(new Event('resize'));
}
/* swap the whole company for another: a fresh start (null) or an imported save */
function gameApply(s) {
  if (dlgCur) dlgClose(); tutEnd(); yardApply(s); tutApply(s); talApply(s); ledgerApply(s); pilotsApply(s); boardApply(s); storyApply(s); barApply(s);
  player.cfg = YARD.bays[YARD.act]; applyPaint(player.mats, player.cfg.paint); player.build(); mechName = bayTitle(); HG.armT = 0; HG.syncBerths(); if (HQ.setMini) HQ.setMini();
  brandSync(); saveCO(); setStatus(bayParts(player.cfg) ? 'STAND READY — ' + mechName : 'STAND EMPTY'); if (mode === 'hangar') { refreshUI(); renderHangarContract(); } else if (mode === 'hq') renderDetail();
}
function saveExport() {
  const blob = new Blob([JSON.stringify(saveBlob(), null, 1)], { type: 'application/json' }), a = document.createElement('a'), u = URL.createObjectURL(blob);
  a.href = u; a.download = `${YARD.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'company'}-day${CO.day}.stompymechs.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000);
  return a.download;
}
function saveImport(text) {
  let s = null; try { s = JSON.parse(text); } catch (e) { return 'That file is not valid JSON.'; }
  const why = saveCheck(s); if (why) return why; if (mode === 'field') return 'Finish or abandon the sortie first.';
  gameApply(s); YARD.founded = true; saveCO(); return '';
}
function settingsOpen(tab) { if (tab) SET.tab = tab; Object.assign(SET, { open: true, found: false, wipe: false, msg: '', bad: false }); $('setUI').classList.remove('hid'); settingsDraw(); }
function settingsClose() { if (!SET.open || SET.found) return; SET.open = false; SET.pv = -1; music.preview(null); $('setUI').classList.add('hid'); cfgSave(); if (mode === 'hangar') refreshUI(); CO.dirty = true; }
/* the first thing a new commander sees: name the outfit, pick its colours, sign the charter */
function foundOpen() { Object.assign(SET, { open: true, found: true, tab: 'company', wipe: false, msg: '', bad: false }); $('setUI').classList.remove('hid'); settingsDraw(); }
function newGame() { if (mode === 'field') return; gameApply(null); YARD.founded = false; saveCO(); foundOpen(); }
function settingsDraw() {
  if (!SET.open) return; const F = SET.found, tab = F ? 'company' : SET.tab, B = $('setBody'), fld = mode === 'field';
  const rng = (id, label, v, a, b, st, show) => `<label>${label}</label><input type="range" id="${id}" min="${a}" max="${b}" step="${st}" value="${v}"><em>${show(v)}</em>`, pc = v => Math.round(v) + '%';
  const tog = (id, label, on) => `<label>${label}</label><button id="${id}" class="tg${on ? ' on' : ''}">${on ? 'ON' : 'OFF'}</button><em></em>`;
  const bindR = (id, set, show) => { const e = $(id); e.oninput = () => { set(+e.value); e.nextElementSibling.textContent = show(+e.value); }; e.onchange = () => { cfgSave(); sfx.play('ui'); }; };
  const bindT = (id, key, after) => { $(id).onclick = () => { CFG[key] = !CFG[key]; cfgSave(); sfx.play('ui'); if (after) after(); settingsDraw(); }; };
  $('setTitle').textContent = F ? 'FOUND YOUR COMPANY' : 'SETTINGS'; $('setSub').textContent = F ? 'NEW GAME' : `${YARD.name} · DAY ${CO.day}`;
  $('setTabs').classList.toggle('hid', F); $('setTabs').innerHTML = [['audio', 'AUDIO'], ['controls', 'CONTROLS'], ['display', 'DISPLAY'], ['company', 'COMPANY'], ['stats', 'STATS'], ['game', 'SAVE / LOAD']].map(([k, l]) => `<button data-k="${k}" class="${k === tab ? 'on' : ''}">${l}</button>`).join('');
  $('setTabs').querySelectorAll('button').forEach(b => b.onclick = () => { sfx.play('ui'); SET.tab = b.dataset.k; SET.wipe = false; SET.msg = ''; settingsDraw(); });
  $('setClose').textContent = F ? 'SIGN THE CHARTER — BEGIN' : fld ? 'BACK TO THE SORTIE' : 'CLOSE'; $('setInfo').textContent = F ? 'You can change all of this later under SETTINGS · COMPANY.' : tab === 'stats' ? 'The record is the company\'s own. It is kept in the save file and goes wherever that goes.' : 'Settings are kept on this machine, apart from the save file.';
  if (tab === 'audio') {
    /* a preview button; data-p names what it plays: p3 / c3 a mission score on patrol or in combat, night, amb, win */
    const pvb = (k, label) => `<button data-p="${k}" class="${SET.pv === k ? 'on' : ''}">${SET.pv === k ? '■ STOP' : '▶ ' + label}</button>`;
    const fxd = (k, name, sub, label) => `<div class="trk fxd"><u>♪</u><div><b>${name}</b><small>${sub}</small></div><span class="pvb">${pvb(k, label)}</span></div>`;
    B.innerHTML = `<div class="sh">LEVELS</div><div class="sg">${rng('sVol', 'MASTER VOLUME', CFG.vol * 100, 0, 100, 1, pc)}${rng('sSfx', 'EFFECTS', CFG.sfx * 100, 0, 100, 1, pc)}${rng('sMus', 'MUSIC', CFG.mus * 100, 0, 100, 1, pc)}${rng('sVox', 'VOICES', CFG.voice * 100, 0, 100, 1, pc)}</div>
<div class="sh">WHAT PLAYS WHERE</div><div class="sg">${tog('sAmb', 'COMMAND DECK MUSIC', CFG.amb)}${tog('sJin', 'VICTORY JINGLE', CFG.jingle)}${tog('sRad', 'BAY RADIO · BAR JUKEBOX', CFG.radio)}${tog('sScr', 'MISSION SCORE', CFG.score)}</div>
<div class="sh">COMMAND DECK <small>NIGHT WATCH FIRST · THEN THE AMBIENCE · AND ROUND AGAIN</small></div><div class="dkl">
${fxd('night', 'NIGHT WATCH', 'hand drums, a plucked string and slow synths · 84 bpm', 'PREVIEW')}${fxd('amb', 'DECK AMBIENCE', 'slow pads over a low D, glass, a distant pulse', 'PREVIEW')}${fxd('win', 'CONTRACT WON', 'the jingle at the debrief after a completed contract', 'PLAY')}</div>
<div class="sh">MISSION SCORE <small>SEVEN TRACKS · EACH SHIFTS TO ITS COMBAT VERSION UNDER FIRE</small></div><div id="trks">
<div class="trk${CFG.track ? '' : ' on'}" data-i="0"><u></u><div><b>AUTO — MATCH THE THEATRE</b><small>Every biome plays its own score</small></div></div>
${SCORES.map(([bk, n, d], i) => `<div class="trk${CFG.track === i + 1 ? ' on' : ''}" data-i="${i + 1}"><u></u><div><b>${String(i + 1).padStart(2, '0')} · ${n}</b><small><span>${BIOMES[bk].name}</span> · ${d}</small></div><span class="pvb">${pvb('p' + i, 'PATROL')}${pvb('c' + i, 'COMBAT')}</span></div>`).join('')}</div>`;
    bindR('sVol', v => { CFG.vol = v / 100; sfx.vol(); music.vol(); vox.vol(); }, pc); bindR('sVox', v => { CFG.voice = v / 100; vox.vol(); }, pc); $('sVox').onchange = () => { cfgSave(); vox.say(pick([CREW.xo, CREW.intel, CREW.chief]), 'Reading you five by five. How is that?'); }; bindR('sSfx', v => { CFG.sfx = v / 100; sfx.vol(); }, pc); bindR('sMus', v => { CFG.mus = v / 100; music.vol(); }, pc);
    bindT('sAmb', 'amb'); bindT('sJin', 'jingle'); bindT('sRad', 'radio'); bindT('sScr', 'score');
    B.querySelectorAll('.trk').forEach(r => r.onclick = e => {
      sfx.init(); const k = e.target.dataset.p;
      if (k != null) {
        clearTimeout(SET.pvT); if (SET.pv === k) { SET.pv = -1; music.preview(null); return settingsDraw(); }
        const secs = k === 'win' ? 7.5 : k === 'night' ? 46 : k === 'amb' ? 30 : k[0] === 'c' ? 20 : 16; SET.pv = k; SET.pvT = setTimeout(() => { SET.pv = -1; settingsDraw(); }, secs * 1000);
        if (k === 'win') music.preview('sting', 0, secs); else if (k === 'night' || k === 'amb') music.preview('deck', k === 'amb' ? 1 : 0, secs); else music.preview('field', +k.slice(1), secs, k[0] === 'c');
        return settingsDraw();
      }
      if (r.dataset.i == null) return; CFG.track = +r.dataset.i; cfgSave(); sfx.play('ui'); if (fld) music.track(scoreFor(EV.key)); settingsDraw();
    });
  } else if (tab === 'controls') {
    const sx = v => (v / 100).toFixed(2) + '×', K = (L) => `<div class="keys">${L.map(([k, d]) => `<div><b>${k}</b><span>${d}</span></div>`).join('')}</div>`;
    B.innerHTML = `<div class="sh">MOUSE</div><div class="sg">${rng('sSens', 'AIM SENSITIVITY', CFG.sens * 100, 30, 250, 5, sx)}${tog('sInv', 'INVERT VERTICAL AIM', CFG.invY)}</div>
<div class="sh">IN THE FIELD</div>${K([['W / S', 'Throttle forward / reverse'], ['A / D', 'Turn the legs'], ['MOUSE', 'Twist the torso and aim'], ['LEFT / RIGHT BUTTON', 'Fire left / right arm'], ['F', 'Fire the back unit'], ['SPACE', 'Jump jets'], ['SHIFT', 'Sprint — it builds heat'], ['X', 'Centre legs under the torso'], ['C', 'Cockpit / chase camera'], ['M', 'Tactical map — pauses the sortie'], ['R', 'Field repair kit'], ['V', 'Coolant flush'], ['1 – 3', 'Answer the comms'], ['SPACE / ENTER', 'Carry on after a message'], ['H', 'Withdraw to base — twice to abandon a contract'], ['ESC', 'Pause']])}
<div class="sh">COMMS IN THE FIELD</div><div class="sg"><label>HOLD THE SORTIE FOR COMMS</label><span class="seg" id="sHold">${[[2, 'EVERY MESSAGE'], [1, 'QUESTIONS ONLY'], [0, 'NEVER']].map(([v, l]) => `<button data-v="${v}" class="${CFG.hold === v ? 'on' : ''}">${l}</button>`).join('')}</span><em></em></div>
<p class="snt">${['The fight carries on while people talk, and a question you do not answer in time answers itself.', 'Chatter plays over the fight. When somebody needs a decision, everything stops until you have made it.', 'Whenever anybody comes on the radio, everything stops until you have read it. Nothing moves and no clock runs while you choose a reply.'][CFG.hold]}</p>
<div class="sh">BAY AND COMMAND DECK</div>${K([['DRAG', 'Orbit the camera'], ['WHEEL', 'Zoom'], ['RIGHT-DRAG', 'Raise / lower the view'], ['1 – 6', 'Pick a reply in conversation'], ['ESC', 'Close a window']])}
<div class="sh">GUIDANCE</div><div class="sg">${tog('sTut', 'THE CREW SHOW YOU ROUND EACH ROOM', TUT.hints)}</div><div class="gm"><button id="sTutAgain" ${fld ? 'disabled' : ''}><b>SHOW ME ROUND AGAIN</b><small>Every room's tour, the next time you walk into it</small></button></div>`;
    $('sTut').onclick = () => { TUT.hints = !TUT.hints; if (!TUT.hints) tutEnd(); saveCO(); sfx.play('ui'); settingsDraw(); }; $('sTutAgain').onclick = () => { tutAgain(); sfx.play('ok'); settingsDraw(); };
    bindR('sSens', v => { CFG.sens = v / 100; }, sx); bindT('sInv', 'invY'); $('sHold').querySelectorAll('button').forEach(b => b.onclick = () => { CFG.hold = +b.dataset.v; cfgSave(); sfx.play('ui'); settingsDraw(); });
  } else if (tab === 'display') {
    B.innerHTML = `<div class="sh">RENDERING</div><div class="sg">${rng('sScale', 'RENDER SCALE', CFG.scale * 100, 50, 150, 10, pc)}${tog('sBloom', 'BLOOM AND GLOW', CFG.bloom)}${tog('sShadow', 'DYNAMIC SHADOWS', CFG.shadow)}${tog('sWlight', 'LIGHT FROM WEAPONS FIRE', CFG.wlight)}</div>
<p class="snt">If the field runs slowly, drop the render scale first, then shadows. Changes apply at once.</p>
<div class="sh">THE OPENING</div><div class="gm"><button id="sIntro"${fld || mode === 'brief' ? ' disabled' : ''}><b>▶ WATCH IT AGAIN</b><small>${fld || mode === 'brief' ? 'Not in the middle of a sortie or a briefing' : 'Eleven seconds. Any key ends it'}</small></button></div>`;
    $('sIntro').onclick = () => { sfx.play('ui'); settingsClose(); introOpen(); };
    const e = $('sScale'); e.oninput = () => { e.nextElementSibling.textContent = pc(+e.value); }; e.onchange = () => { CFG.scale = +e.value / 100; cfgSave(); gfxApply(); sfx.play('ui'); }; bindT('sBloom', 'bloom', gfxApply); bindT('sShadow', 'shadow', gfxApply); bindT('sWlight', 'wlight', gfxApply);
  } else if (tab === 'company') {
    const L = YARD.logo, ink = (k, label) => `<label>${label}</label><div class="ink" data-k="${k}">${LOGO_INKS.map(c => `<button data-c="${c}" class="${L[k] === c ? 'on' : ''}" style="background:${c}"></button>`).join('')}</div>`;
    B.innerHTML = `${F ? `<p class="snt big">The paperwork is filed and the hangar lease is paid through the season. All the outfit needs now is a name and a mark to paint on the door.<br><b>You start with ${fmt(CO.cb)}, one light mech — the KESTREL — a repair kit, a coolant flush, and two empty bays.</b> Everything else you will have to buy, earn, or pull out of a wreck.</p>` : ''}
<div id="lgEd"><div><canvas id="lgBig" width="400" height="400"></canvas><label class="cn">COMPANY NAME</label><input id="coName" maxlength="18" spellcheck="false" autocomplete="off" value="${YARD.name}"><button id="lgRnd">ROLL A RANDOM EMBLEM</button></div>
<div><div class="sh">SHAPE</div><div class="lgP" id="lgShapes"></div><div class="sh">DEVICE</div><div class="lgP" id="lgSyms"></div><div class="sh">COLOURS</div><div class="sg ik">${ink('c1', 'FIELD')}${ink('c2', 'DEVICE')}${ink('c3', 'TRIM')}</div></div></div>`;
    const big = () => { const g = $('lgBig').getContext('2d'); g.clearRect(0, 0, 400, 400); drawLogo(g, 200, 200, 190); }, chg = () => { YARD.logoV++; brandSync(); saveCO(); sfx.play('ui'); settingsDraw(); };
    big(); for (const [id, key, list] of [['lgShapes', 'shape', LOGO_SHAPES], ['lgSyms', 'sym', LOGO_SYMS]]) list.forEach(([n], i) => { const b = document.createElement('button'); b.title = n; b.className = L[key] === i ? 'on' : ''; b.appendChild(logoCanvas(88, { ...L, [key]: i })); b.onclick = () => { L[key] = i; chg(); }; $(id).appendChild(b); });
    B.querySelectorAll('.ink button').forEach(b => b.onclick = () => { L[b.parentNode.dataset.k] = b.dataset.c; chg(); });
    $('lgRnd').onclick = () => { const a = pick(LOGO_INKS); let c = pick(LOGO_INKS); while (c === a) c = pick(LOGO_INKS); Object.assign(L, { shape: (Math.random() * 8) | 0, sym: (Math.random() * 14) | 0, c1: a, c2: c, c3: Math.random() < .6 ? c : pick(LOGO_INKS) }); chg(); };
    const nm = $('coName'); nm.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') nm.blur(); }; nm.oninput = () => { YARD.name = cleanName(nm.value, CO_DEF_NAME); brandSync(); }; nm.onchange = () => { nm.value = YARD.name; saveCO(); };
  } else if (tab === 'stats') {
    statsDraw(B);
  } else {
    const b = YARD.bays.filter(x => bayParts(x)).length, act = CO.active;
    B.innerHTML = `<div class="sh">THIS COMPANY</div><div class="sum"><canvas id="lgSm" width="120" height="120"></canvas><div><b>${YARD.name}</b><span>Day ${CO.day} · funds ${fmt(CO.cb)} · ${CO.done} contracts completed, ${CO.fails} failed</span><span>${b} of 3 bays occupied · ${invCount()} items in stores${act ? ` · signed for ${act.site}` : ''}</span><span class="dim">The game saves itself to this browser after every change.</span></div></div>
<div class="sh">SAVE FILE</div><div class="gm"><button id="gExp"><b>EXPORT SAVE</b><small>Download the whole company as a .json file</small></button><button id="gImp" ${fld ? 'disabled' : ''}><b>IMPORT SAVE</b><small>Load a company from a .json file — replaces this one</small></button></div>
<div class="sh">NEW GAME</div><div class="gm">${SET.wipe ? `<button id="gYes" class="dng"><b>YES — DISBAND ${YARD.name}</b><small>Ledger, standing, stores, the record and every mech are gone for good</small></button><button id="gNo"><b>NO — KEEP PLAYING</b><small>Nothing is changed</small></button>` : `<button id="gNew" ${fld ? 'disabled' : ''}><b>START A NEW COMPANY</b><small>A clean ledger, ${fmt(120000)}, and a single light mech</small></button>`}</div>
${fld ? '<p class="snt">Importing and starting over are locked while a sortie is running.</p>' : ''}${SET.msg ? `<p class="snt ${SET.bad ? 'bad' : 'good'}">${SET.msg}</p>` : ''}`;
    drawLogo($('lgSm').getContext('2d'), 60, 60, 56);
    $('gExp').onclick = () => { const n = saveExport(); SET.msg = `Saved as ${n}`; SET.bad = false; sfx.play('ok'); settingsDraw(); };
    $('gImp').onclick = () => { sfx.play('ui'); $('saveFile').value = ''; $('saveFile').click(); };
    if ($('gNew')) $('gNew').onclick = () => { sfx.play('ui'); SET.wipe = true; SET.msg = ''; settingsDraw(); };
    if ($('gYes')) { $('gYes').onclick = () => { sfx.play('ok'); newGame(); }; $('gNo').onclick = () => { sfx.play('ui'); SET.wipe = false; settingsDraw(); }; }
  }
}
/* SETTINGS · STATS: the whole record (117_stats.js). A box to find a line by any word in it, a section to keep to, and the weapons as a table of their own.
   Typing redraws the list and leaves the box alone, so it keeps its caret */
function statsDraw(B) {
  const secs = [...TAL_DEF.map(d => d[0]), 'WEAPONS'], esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  B.innerHTML = `<div class="tlyQ"><input id="tlyFind" placeholder="FIND A STAT — ACCURACY, STEPS, TANKS…" spellcheck="false" autocomplete="off" value="${esc(SET.q)}"><span id="tlyN"></span></div>
<div class="tlyC" id="tlyC"><button data-s=""${SET.sec ? '' : ' class="on"'}>EVERYTHING</button>${secs.map(s => `<button data-s="${s}"${SET.sec === s ? ' class="on"' : ''}>${s}</button>`).join('')}</div><div id="tlyL"></div>`;
  const list = () => {
    const q = SET.q.trim().toUpperCase().split(/\s+/).filter(Boolean), hit = s => q.every(w => s.includes(w)), R = talRows(2), W = talWeps(); let h = '', n = 0;
    for (const g of secs) {
      if (SET.sec && SET.sec !== g) continue;
      if (g === 'WEAPONS') {
        const L = W.filter(w => hit('WEAPONS ' + w.name + ' ' + w.cls)); if (!L.length && (q.length || !SET.sec)) continue; n += L.length;
        h += `<div class="sh">WEAPONS <small>${W.length ? 'WHAT EACH ONE HAS FIRED, LANDED AND DONE' : 'NOTHING FIRED YET'}</small></div>` + (L.length ? `<div class="tlyW"><div class="hd"><span>WEAPON</span><span>FIRED</span><span>ON TARGET</span><span>ACCURACY</span><span>DAMAGE</span><span>KILLS</span></div>${L.map(w => `<div><span>${iconSvg(w.key, 15)}<b>${esc(w.name)}</b><small>${w.cls}</small></span><span>${TAL_F.n(w.s)}</span><span>${TAL_F.n(w.h)}</span><span class="ac"><i style="width:${(w.acc * 100).toFixed(0)}%"></i><em>${w.s ? TAL_F.p(w.acc) : '—'}</em></span><span>${TAL_F.d(w.d)}</span><span>${TAL_F.n(w.k)}</span></div>`).join('')}</div>` : '');
        continue;
      }
      const L = R.filter(r => r.g === g && hit(g + ' ' + r.l)); if (!L.length) continue; n += L.length;
      h += `<div class="sh">${g}</div><div class="tlyG">${L.map(r => `<div${r.z ? ' class="z"' : ''}><span>${esc(r.l)}</span><b>${esc(r.v)}</b></div>`).join('')}</div>`;
    }
    $('tlyL').innerHTML = h || `<p class="snt">Nothing on the record matches “${esc(SET.q)}”.</p>`; $('tlyN').textContent = `${n} LINE${n === 1 ? '' : 'S'}${TALLY.day > 1 ? ` · KEPT SINCE DAY ${TALLY.day}` : ''}`;
  };
  list(); const f = $('tlyFind'); f.onkeydown = e => { e.stopPropagation(); if (e.key === 'Escape') { if (SET.q) { SET.q = f.value = ''; list(); } else settingsClose(); } }; f.oninput = () => { SET.q = f.value.slice(0, 40); list(); };
  $('tlyC').querySelectorAll('button').forEach(b => b.onclick = () => { sfx.play('ui'); SET.sec = b.dataset.s; $('tlyC').querySelectorAll('button').forEach(o => o.classList.toggle('on', o === b)); list(); $('setBody').scrollTop = 0; });
}
{
  $('setClose').onclick = () => { sfx.play('ok'); if (SET.found) { SET.found = false; YARD.founded = true; YARD.name = cleanName($('coName') && $('coName').value, CO_DEF_NAME); brandSync(); CO.news = CO.news.filter(n => !n.includes('is open for contracts') && !n.includes('Nobody is hiring yet')); news(tutLock() ? TUT_WIRE() : TUT_OPEN()); saveCO(); setStatus('STAND READY — ' + mechName); } settingsClose(); };
  $('setUI').addEventListener('pointerdown', e => { if (e.target === $('setUI')) settingsClose(); });
  $('saveFile').onchange = e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { const why = saveImport(String(rd.result)); SET.bad = !!why; SET.msg = why || `Loaded ${YARD.name} — day ${CO.day}, ${fmt(CO.cb)}.`; sfx.play(why ? 'deny' : 'ok'); settingsDraw(); }; rd.readAsText(f); };
  addEventListener('keydown', e => { if (e.code !== 'Escape' || !uiModal()) return; if (ST.open && ST.mode !== 'salv') storesClose(); else if (SET.open) settingsClose(); });
}

