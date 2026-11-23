/* ============ THE DEBRIEFING ROOM: A SORTIE ENDS IN FRONT OF THE BIG SCREEN, WITH EVERYBODY WHO HAS SOMETHING TO SAY ABOUT IT ============ */
/* The room is the briefing room (350_brief.js) and the screen is its screen, with the camera stood square in front of it: how the contract went, the books, the figures for the
   sortie and what it did to the company's standing are drawn on the wall (aarDraw), in the world. Beside it, on the page, the people with something to say have the floor one at
   a time (AAR.q): a head comes up at the top left, says its line aloud, and fades for the next. Nothing has to be clicked through and nothing stays: the pointer resting on a
   head keeps it there, a click on it moves on. A head that wants an answer (a client who would like to pay less) stays until it has one.
   What there is to do is not a head's to offer, because a head goes: the salvage and the market are buttons at the top of the way out (#aarSalv, #aarShop), and the salvage
   button goes when the salvage has been chosen.
   `mode` is 'aar' while it shows. toHangar() opens it with the debrief settle() made; aarLeave() goes on to the deck or the bay. Two things are not walked away from by
   accident: a client waiting on an answer has to be given one, and salvage nobody has chosen takes a second press.
   A line is { ch, text, opts: [[label, fn, disabled]], key }. The head stands at the top left under the title while the window is wide enough to keep the screen readable
   beside it (AAR_TWO); narrower than that, it stands at the top of the right-hand column and the screen has the rest */
const AAR = { D: null, L: [], q: [], cur: null, ct: 0, need: 0, said: false, t: 0, drawT: 0, gap: 0, arm: 0, two: true, cam: [.7, 2.55, 1.4], sent: 0, note: '', mark: null }, AAR_TWO = 1500;
/* (somebody with two things to say one after the other is one head saying both: `pre` is what they had already said when the rest was added, so that the rest can be changed by itself) */
const aarLine = (ch, text, o = {}) => {
  const last = AAR.L[AAR.L.length - 1]; if (last && !last.key && !last.opts && (last.ch === ch || (ch.seed !== undefined && last.ch.seed === ch.seed))) { last.pre = last.text; last.text += '\n\n' + text; return Object.assign(last, o); }
  const b = { ch, text, pre: '', opts: null, key: '', el: null, ...o }; AAR.L.push(b); return b;
};
/* what a head still waiting its turn is going to say has changed (the part after anything it had to say first) */
const aarRe = (key, text) => { const b = AAR.L.find(q => q.key === key); if (b && text) { b.text = (b.pre ? b.pre + '\n\n' : '') + text; aarFill(b); } };
/* who says what. D is settle()'s debrief: the contract, the books, and what was noted on the way home (D.fig, D.wing, D.bd, D.shop) */
function aarLines(D) {
  const c = D.c, x = CREW.xo, S = D.salv, notes = D.log.slice(0, -1).filter(s => !s.includes(': "')).slice(-4), n1 = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  aarLine(x, `${D.text}${notes.length ? '\n' + notes.map(s => '· ' + s).join('\n') : ''}\n${D.ok ? pick(['Good work out there.', 'That is how it is done, Commander.', 'Clean enough. I will take it.']) : pick(['We live to sign another contract.', 'It happens. The trick is to be here afterwards, and we are.'])}`);
  if (D.story) for (const [ch, text] of storyLines(D)) aarLine(ch, text);
  else if (D.renege) aarDispute(D);
  else if (c.cok !== 'sub' && c.contact) { const T = AAR_CLIENT[c.persona] || AAR_CLIENT.clerk; aarLine(c.contact, D.ok && D.payer !== c.emp ? `We know who paid you for ${c.site}. In time, so will everybody who might have hired you.` : D.fig.abort ? 'You walked off our contract. That goes in the file, and the file is kept.' : pick(D.ok ? T.ok : T.bad)); }
  /* a company that flew beside us, against us or over us has a commander, and the commander has a view */
  for (const k of RIVS) { const L = (D.rel || []).filter(r => r[0] === k), v = L.reduce((s, r) => s + r[1], 0), V = RIV[k]; if (!v) continue; aarLine(V.ch, pick(v > 0 ? [`Good flying. ${V.short} does not forget who stood where.`, 'That is one we owe you, and we keep count.', 'You flew that the way we would have. Take it as praise.'] : ['We saw what you did out there. So did everybody on our net.', `That will cost you with ${V.short}. Fly carefully.`, 'We will remember this one, Commander. We are good at remembering.'])); }
  if (D.wing) { const w = D.wing, ch = w.ch; aarLine(ch, w.down ? pick(['They got me, Commander. The med bay says two days. Bill the client for the machine.', 'I walked home. The machine did not. Two days, they tell me.']) : D.ok ? pick(['Clean drop. Call me for the next one.', 'That is what the fee was for. Any time.', 'Good hunting, Commander. You know where I drink.']) : pick(['That one got away from us. It happens.', 'I have had better days. So have you. Next time.'])); }
  if (D.story && D.story.gifts.length) aarLine(CREW.chief, `Delivery for you, boss, off the back of that one: ${D.story.gifts.join(', ')}. In stores now.`);   /* (one head with what follows) */
  aarLine(CREW.chief, aarBay(D), { key: 'bay' });
  { const m = aarMira(D); if (m) aarLine(CREW.intel, m, { key: 'mira' }); }
}
/* Dutch: the state she came home in, what the recovery crews found (while it is still lying there to be chosen), and the market if it has turned over */
function aarBay(D) {
  const c = D.c, F = D.fig, S = D.salv, n1 = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const T = [F.dead ? 'We brought her home on a flatbed, boss. She is rebuilt and back on the stand.' : F.lost.length ? `She came home short ${F.lost.length > 1 ? 'of ' + stAnd(F.lost.map(s => 'the ' + s.toLowerCase())) : 'of her ' + F.lost[0].toLowerCase()}. Rebuilt, rearmed, back on the stand.` : F.armor > .97 ? 'Not a mark on her. I checked twice.' : F.armor < .35 ? 'You brought back about a third of a mech, boss. She is patched and rearmed all the same.' : 'She is patched, rearmed and back on the stand.'];
  if (S) { const all = S.picks >= S.pool.length; T.push(`Recovery crews are back from ${c.site} with ${n1(S.pool.length, 'piece')} worth keeping. The contract gives us ${c.salv}%${all ? (S.pool.length > 1 ? ', which covers the lot. Tag them before you go.' : ', which covers it. Tag it before you go.') : `: ${S.picks} of them. Tell me which before you go.`}`); }
  if (D.shop) { const rare = YARD.shop.stock.find(e => e.tag); T.push(`The market turned over while you were out: ${n1(YARD.shop.stock.length, 'lot')}${rare ? `, ${/^[aeiou]/i.test(itemInfo(rare.key).name) ? 'an' : 'a'} ${itemInfo(rare.key).name} among them, which does not come up often` : ''}, and ${n1(dealLot().length, 'whole machine')} on the dealer's lot.`); }
  return T.join(' ');
}
/* Mira: who thinks differently of us, and what the board did meanwhile */
function aarMira(D) {
  const M = [], c = D.c, rel = RIVS.map(k => [k, (D.rel || []).reduce((s, r) => s + (r[0] === k ? r[1] : 0), 0)]).filter(r => r[1]), rep = D.rep.filter(r => Math.round(r[1])), B = D.bd, n1 = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  if (rep.length || rel.length) M.push('Standing: ' + [...rep.map(([f, v]) => `${FAC[f].short} ${v > 0 ? 'up' : 'down'} ${Math.abs(Math.round(v))}, ${repWord(CO.rep[f])}`), ...rel.map(([k, v]) => `${RIV[k].name} ${v > 0 ? 'up' : 'down'} ${Math.abs(v)}, ${relWord(CO.riv[k].rel)}`)].join('. ') + '.');
  if (B && !tutLock() && (B.gone || B.fresh)) M.push(`While you were out ${B.gone ? `${n1(B.gone, 'offer')} on the board went to somebody else` : 'nothing left the board'}${B.fresh ? `, and ${B.fresh === 1 ? 'a new one has' : B.fresh + ' new ones have'} come in` : ''}.${B.follow ? ` ${FAC[c.emp].short} already have a follow-up for us.` : ''}${B.opp ? ' And somebody smells blood: there is an opportunity up there.' : ''}`);
  return M.join(' ');
}
/* the client, when there is nothing to dispute: one line on how they took it, in the voice they bargained in */
const AAR_CLIENT = {
  shark: { ok: ['Paid in full. Do not read anything into it.', 'The balance is released. You were worth the rate. This once.'], bad: ['I paid for a result and I have an invoice. We will not speak again soon.', 'I will find someone hungrier. I should have the first time.'] },
  clerk: { ok: ['The instrument is closed and the fee released. Thank you for your service.', 'Completion is confirmed on our side. Payment has been authorised in full.'], bad: ['I am recording this engagement as unfulfilled. It will stay on your file.', 'The terms were not met. I have noted it, as I am required to.'] },
  zealot: { ok: ['The cause is served. You have its thanks, and its coin.', 'You fought as though you believed. The faithful will remember it.'], bad: ['The faithful bled and you came home. We will remember which.', 'You were not worthy of this work. I said so, and was overruled.'] },
  desperate: { ok: ['You did it. You actually did it. Thank you. The money is yours, all of it.', 'I did not think anybody would come, and you came. It is paid. Thank you.'], bad: ['Then that was the last of it. I hope it was worth the fuel.', 'I have nobody else to call. I want you to know that.'] },
  smuggler: { ok: ['Lovely work. The money is in your account, and it is even the right amount.', 'Done and dusted. I shall tell the next crew you set the standard.'], bad: ['Pity. I had already spent my end. Do not call me: I will call you.', 'Well. That was expensive for both of us, and I do mean both.'] },
};
/* some clients try to short the invoice: the contact comes on with three ways to answer, and no way out of the room until one is given */
function aarDispute(D) {
  const c = D.c, ch = c.contact, cut = Math.round(D.base * .3);
  const res = (paid, line, r) => { if (!paid) { CO.cb -= cut; D.total -= cut; D.lines.push(['Withheld by client', -cut]); } repAdd(c.emp, r, `the disputed invoice for ${c.site}`); const e = D.rep.find(q => q[0] === c.emp); if (e) e[1] += r; else D.rep.push([c.emp, r]); CO.dirty = true; saveCO(); b.opts = null; b.text = line; aarShow(b); AAR.note = ''; aarNav(); aarRe('mira', aarMira(D)); };   /* (and Mira's figures are the ones on the wall) */
  const b = aarLine(ch, `Our accountants have reviewed the engagement. Ammunition overage, collateral, administrative fees. We are remitting seventy percent: ${fmt(cut)} withheld.`, { key: 'disp', opts: [
    ['Accept the cut', () => res(false, 'A pleasure doing business.', 1)],
    ['Demand payment in full: cite the contract', () => Math.random() < .4 + CO.rep[c.emp] / 120 + (c.talked ? .15 : 0) ? res(true, '...Legal advises me to release the balance. You have your money.', -1) : res(false, 'Then sue us. Seventy percent.', -3)],
    ['Threaten to tell every outfit in the sector', () => Math.random() < .65 ? res(true, 'There is no need for that. The balance is on its way. Do not call this office again.', -9) : res(false, 'Slander is expensive, mercenary. Seventy percent, and we are finished.', -12)]] });
}
/* the picker, and what Dutch says about what was picked: at once, whoever has the floor */
function aarSalvage() {
  const D = AAR.D, S = D && D.salv; if (!S || busy || mode !== 'aar' || uiModal()) return; AAR.arm = 0; AAR.note = ''; aarNav(); vox.stop();
  storesOpen({ mode: 'salv', salv: { pool: S.pool, picks: S.picks, site: D.c.site, pct: D.c.salv }, done: got => {
    D.salv = null; if (AAR.cur && /^(bay|nag)$/.test(AAR.cur.key)) AAR.ct = AAR.need; AAR.q = AAR.q.filter(q => q.key !== 'nag'); aarRe('bay', aarBay(D));   /* (what he was saying about it is said: he does not come back to finish) */
    aarCut(CREW.chief, got.length ? `Tagged and stowed: ${got.map(k => itemInfo(k).name).join(', ')}. In stores whenever you want ${got.length === 1 ? 'it' : 'them'} fitted.` : 'Leaving it all? Your call. The scrap men will be pleased.', 'got'); aarNav(); } });
}
/* a head takes the floor: a portrait, who it is, the line, buttons if it wants an answer, and along its foot the time it has left. Whoever had the floor gives it up at once,
   and comes back afterwards if they had not finished. (Shown again while it is up, a head starts over: that is how a line is changed under it) */
function aarShow(b) {
  const A = AAR, c = A.cur; A.q = A.q.filter(q => q !== b); if (c && c !== b) { if (c.opts || A.ct < A.need) A.q.unshift(c); aarGone(c, true); }
  if (!b.el) {
    const d = b.el = document.createElement('div'); d.className = 'aarB'; d.style.setProperty('--c', b.ch.col || '#ffb21a');
    d.innerHTML = '<canvas width="144" height="144"></canvas><div><b></b><p></p><div class="aarO"></div><small></small></div><i></i>'; drawFace(d.firstChild, b.ch); d.querySelector('b').textContent = `${b.ch.name} · ${b.ch.role}`;
    d.onclick = e => { if (b !== AAR.cur || b.opts || busy || e.target.closest('button')) return; sfx.play('ui'); aarDrop(true); }; d.addEventListener('animationend', aarMore);   /* (a head on its way in overhangs the column: measure again when it has arrived) */
    $(A.two ? 'aarL' : 'aarR').appendChild(d); sfx.play('comm', .5);
  }
  A.cur = b; A.ct = 0; A.said = false; A.need = clamp(1.6 + coTxt(b.text).length / 21, 3.5, 22); aarFill(b);   /* long enough to read; aarTalk makes it long enough to hear as well */
}
/* somebody speaks out of turn, and now. With a key they are one head however often they say it */
function aarCut(ch, text, key = '') { let b = key ? AAR.L.find(q => q.key === key) : null; if (b) b.text = text; else AAR.L.push(b = { ch, text, pre: '', opts: null, key, el: null }); aarShow(b); return b; }
/* a head goes: faded, or (now) at once */
function aarGone(b, now) { const d = b.el; if (!d) return; b.el = null; if (now) d.remove(); else { d.classList.remove('spk', 'nag'); d.classList.add('out'); setTimeout(() => d.remove(), 320); } }
/* whoever has the floor has finished, or (now) was clicked away */
function aarDrop(now) { const A = AAR, b = A.cur; if (!b) return; if (A.said) vox.stop(); aarGone(b, now); A.cur = null; A.gap = now ? .06 : .4; }
/* the column scrolls if a head is ever taller than it, and fades out at the foot while there is more below */
function aarMore() { for (const id of ['aarL', 'aarR']) { const h = $(id); h.classList.toggle('more', h.scrollHeight - h.scrollTop - h.clientHeight > 6); } }
function aarFill(b) {
  const d = b.el; if (!d) return; d.querySelector('p').textContent = coTxt(b.text); const O = d.querySelector('.aarO'); O.innerHTML = ''; d.classList.toggle('ask', !!b.opts);
  for (const [label, fn, dis] of b.opts || []) { const x = document.createElement('button'); x.textContent = label; x.disabled = !!dis; x.onclick = () => { sfx.play('ui'); fn(); }; O.appendChild(x); }
  aarMore();
}
/* the floor, a frame at a time: the head that is up is said aloud once, counts its time down unless something is holding it there (an answer it is owed, the pointer resting
   on it, a tour, a window over the room), and fades; then the next comes up. Nobody new comes up behind a window */
function aarTalk(dt) {
  const A = AAR, b = A.cur, wait = !!TG.k || uiModal();
  if (!b) { if (A.q.length && A.t > .8 && !uiModal() && (A.gap -= dt) < 0) aarShow(A.q.shift()); return; }
  const d = b.el, hov = !b.opts && d.matches(':hover');
  if (!A.said && !wait) { A.said = true; A.need = Math.max(A.need, vox.say(b.ch, coTxt(b.text)) + .7); }
  d.classList.toggle('spk', A.said && !wait && vox.busy() && A.ct < A.need);
  if (!wait && !b.opts && !hov) A.ct += dt;
  d.lastChild.style.transform = `scaleX(${b.opts ? 0 : clamp(1 - A.ct / A.need, 0, 1).toFixed(3)})`;
  { const s = b.opts ? '' : `${hov ? 'HELD · CLICK TO GO ON ' : ''}▸ ${A.q.length ? A.q.length + ' MORE' : 'LAST'}`, f = d.querySelector('small'); if (f.textContent !== s) f.textContent = s; }
  if (A.ct >= A.need) aarDrop();
}
/* draw attention to what is owed an answer: the note over the way out, and a flash on the thing itself */
function aarNag(el, note) { AAR.note = note; sfx.play('deny'); if (el) { el.classList.remove('nag'); void el.offsetWidth; el.classList.add('nag'); } aarNav(); }
/* the way out, and the things at the top of it that are not rooms: the salvage while there is some nobody has chosen, the market when it has turned over */
function aarNav() {
  const D = AAR.D, S = D && D.salv; $('aarNote').textContent = AAR.note; $('aarNote').classList.toggle('hid', !AAR.note);
  $('aarSalv').parentNode.classList.toggle('hid', !S); if (S) $('aarSalv').textContent = S.picks >= S.pool.length ? `CLAIM THE SALVAGE · ${S.pool.length === 1 ? 'ONE PIECE' : 'ALL ' + S.pool.length}` : `CHOOSE THE SALVAGE · ${S.picks} OF ${S.pool.length}`;
  $('aarShop').parentNode.classList.toggle('hid', !(D && D.shop));
  $('aarFb').innerHTML = AAR.sent === 1 ? '✓ SENT. THANK YOU — <b>SOMETHING ELSE?</b>' : AAR.sent ? '✓ KEPT: IT GOES WHEN THE SERVER ANSWERS — <b>SOMETHING ELSE?</b>' : '✎ WHAT DID YOU WISH YOU COULD DO ON THAT CONTRACT?';
}
/* what goes with a piece of feedback written here: the contract and how it went, and nothing about the company */
function aarCtx(D) {
  const c = D.c, F = D.fig, st = player.stats;
  return { what: c.story ? `${c.story}.${c.chap + 1}` : `${c.type}.${c.plot}`, title: c.story ? c.title : TYPES[c.type].name, site: c.site, biome: c.biome, hour: todKey(c.biome, c.mood, c.tod), diff: c.diff, twists: (c.twists || []).join(' '),
    result: D.ok ? 'won' : F.dead ? 'destroyed' : F.abort ? 'withdrew' : 'lost', secs: Math.round(F.t), kills: F.kills, armor: Math.round(F.armor * 100), mech: `${st.cls} ${Math.round(st.tons)}t`, wing: !!D.wing, net: D.total, flown: CO.done + CO.fails };
}
/* where the camera stands so that the screen fills the space the head and the way out leave it, whatever the shape of the window: the screen is 7.2 m by 4.05 m in a frame, flat on the wall */
function aarLay() {
  const W = innerWidth, H = innerHeight, two = W >= AAR_TWO, lw = two ? clamp(W * .19, 240, 320) : 0, x0 = two ? 18 + lw + 14 : 18, x1 = W - 18 - 340 - 14, y0 = two ? 30 : 84, y1 = H - 30;
  const ppm = Math.max(24, Math.min((x1 - x0) / 7.56, (y1 - y0) / 4.4)), d = H / (2 * Math.tan(BRF.camera.fov * PI / 360) * ppm);
  AAR.cam = [.7 - ((x0 + x1) / 2 - W / 2) / ppm, 2.55 + ((y0 + y1) / 2 - H / 2) / ppm, -6.61 + d];
  { const s = $('aarScr').style, w = 7.2 * ppm, h = 4.05 * ppm; s.left = (x0 + x1 - w) / 2 + 'px'; s.top = (y0 + y1 - h) / 2 + 'px'; s.width = w + 'px'; s.height = h + 'px'; }   /* where the wall is on the page: the tour rings it */
  { const h = $(two ? 'aarL' : 'aarR'), d = AAR.cur && AAR.cur.el; AAR.two = two; if (d && d.parentNode !== h) h.appendChild(d); } $('aarUI').classList.toggle('one', !two); aarMore();
}
/* ---- the wall ---- */
function aarDraw(t) {
  const D = AAR.D; if (!D) return; const g = BRF.cv.getContext('2d'), c = D.c, S = c.story ? STORY[c.story] : null, ok = D.ok, col = ok ? '#8dff6a' : '#ff5a3a', a = AAR.t, F = D.fig, B = BIOMES[c.biome], MONO = 'Menlo,Consolas,monospace';
  const up = (t0, d = .25) => clamp((a - t0) / d, 0, 1), sp = px => { g.letterSpacing = px + 'px'; };
  g.fillStyle = '#04080b'; g.fillRect(0, 0, 1280, 720); g.textBaseline = 'alphabetic'; g.textAlign = 'left'; g.globalAlpha = 1; sp(0);
  /* the company's mark, large and faint, behind everything (drawn once: drawLogo sets its own alpha) */
  if (!AAR.mark) { const m = AAR.mark = document.createElement('canvas'); m.width = m.height = 600; drawLogo(m.getContext('2d'), 300, 300, 280); }
  g.globalAlpha = .045; g.drawImage(AAR.mark, 690, 150); g.globalAlpha = 1;
  /* how it went */
  const k0 = up(.15, .3); g.globalAlpha = k0; g.fillStyle = col; g.fillRect(44, 36, 12, 62); g.font = `bold 62px ${MONO}`; sp(5); g.fillText(S ? (ok ? 'COMPLETE' : 'FAILED') : ok ? 'CONTRACT COMPLETE' : 'CONTRACT FAILED', 74 - (1 - k0) * 30, 92); sp(1);
  g.fillStyle = S ? S.col : '#e6f4ff'; g.font = `bold 28px ${MONO}`; g.fillText(S ? `${S.name} · ${STNUM[c.chap]} · ${c.title.toUpperCase()}` : `${TYPES[c.type].name.toUpperCase()} — ${c.site.toUpperCase()}`, 44, 134, 1010);
  g.fillStyle = '#8fbcd2'; g.font = `20px ${MONO}`; g.fillText(`${S ? c.site.toUpperCase() : `${FAC[c.emp].short.toUpperCase()} ▸ ${FAC[c.foe].short.toUpperCase()}`} · ${B.name} · ${skyOf(c.biome, c.mood, c.tod).toUpperCase()} · THREAT ${pipStr(c.diff)}`, 44, 165, 1192);
  g.textAlign = 'right'; g.fillStyle = '#e6f4ff'; g.font = `bold 24px ${MONO}`; g.fillText(`OP. ${c.op}`, 1118, 72, 330); g.fillStyle = '#8fbcd2'; g.font = `20px ${MONO}`; g.fillText(`DAY ${CO.day}`, 1118, 100); g.textAlign = 'left'; drawLogo(g, 1186, 78, 46);
  g.fillStyle = col; g.fillRect(44, 182, 1192 * up(.2, .5), 3); g.globalAlpha = 1;
  const head = (s, x, y, w) => { g.fillStyle = '#ffb21a'; g.font = `bold 19px ${MONO}`; sp(5); g.fillText(s, x, y); sp(0); g.fillStyle = 'rgba(255,178,26,.35)'; g.fillRect(x, y + 10, w, 1); };
  /* the books: a line at a time, then the figure they add up to */
  const L = D.lines, n = L.length, X0 = 44, X1 = 696, pitch = Math.min(39, 300 / Math.max(n, 1)), fs = Math.round(clamp(pitch * .68, 18, 26)); head('THE BOOKS', X0, 226, X1 - X0);
  L.forEach(([l, v], i) => { const k = up(.5 + i * .11), y = 270 + i * pitch; if (!k) return; g.globalAlpha = k; g.font = `${fs}px ${MONO}`; g.textAlign = 'right'; const s = fmt(v), w = g.measureText(s).width; g.fillStyle = v < 0 ? '#ff8a6a' : '#d6f2c8'; g.fillText(s, X1, y); g.textAlign = 'left'; g.fillStyle = '#d6e8f2'; g.fillText(l, X0, y, X1 - X0 - w - 22); });
  if (!n) { g.globalAlpha = up(.5); g.font = `22px ${MONO}`; g.fillStyle = '#6f93a4'; g.fillText('NO MONEY MOVED', X0, 270); }
  const tN = .5 + n * .11, kN = up(tN, .8), net = Math.round(D.total * (1 - Math.pow(1 - kN, 3)) / 500) * 500; g.globalAlpha = up(tN, .2);
  g.fillStyle = 'rgba(160,220,255,.3)'; g.fillRect(X0, 584, X1 - X0, 1); g.fillStyle = '#e6f4ff'; g.font = `bold 26px ${MONO}`; sp(4); g.fillText('NET', X0, 628); sp(0); g.textAlign = 'right'; g.font = `bold 46px ${MONO}`; g.fillStyle = D.total < 0 ? '#ff5a3a' : '#8dff6a'; g.fillText(fmt(kN < 1 ? net : D.total), X1, 632);
  g.font = `21px ${MONO}`; g.fillStyle = '#8fbcd2'; g.fillText(`FUNDS ${fmt(CO.cb)}`, X1, 664); g.textAlign = 'left'; g.globalAlpha = 1;
  /* the sortie in figures */
  const R0 = 748, R1 = 1236, mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`, rows = [['TIME ON THE GROUND', mmss(F.t)], ['OBJECTIVES MET', `${F.obj[0]} OF ${F.obj[1]}`], ['KILLS', String(F.kills)], ['ROUNDS ON TARGET', F.shots ? `${Math.round(F.hits / F.shots * 100)}%` : '—'], ['DAMAGE DEALT', Math.round(F.dealt).toLocaleString('en-US')], ['ARMOUR LEFT', F.dead ? 'NONE' : Math.round(F.armor * 100) + '%'], ['SHOT OFF HER', F.lost.length ? F.lost.join(', ') : 'NOTHING']];
  head('THE SORTIE', R0, 226, R1 - R0); rows.forEach(([l, v], i) => { const k = up(.7 + i * .09), y = 266 + i * 31; if (!k) return; g.globalAlpha = k; g.font = `22px ${MONO}`; g.fillStyle = '#a9c8d6'; g.fillText(l, R0, y); const w = g.measureText(l).width; g.textAlign = 'right'; g.fillStyle = l === 'ARMOUR LEFT' && (F.dead || F.armor < .3) ? '#ff8a6a' : '#f0f8ff'; g.fillText(v, R1, y, R1 - R0 - w - 18); g.textAlign = 'left'; });
  g.globalAlpha = 1;
  /* who thinks differently of us for it */
  const rel = RIVS.map(k => [k, (D.rel || []).reduce((s, r) => s + (r[0] === k ? r[1] : 0), 0)]).filter(r => r[1]), ST = [...D.rep.filter(r => Math.round(r[1])).map(([f, v]) => [FAC[f].short, FAC[f].col, Math.round(v), repWord(CO.rep[f]), CO.rep[f]]), ...rel.map(([k, v]) => [RIV[k].name, RIV[k].col, v, relWord(CO.riv[k].rel), CO.riv[k].rel])];
  head('STANDING', R0, 502, R1 - R0); const kS = up(1.3, .3); g.globalAlpha = kS;
  if (!ST.length) { g.font = `20px ${MONO}`; g.fillStyle = '#6f93a4'; g.fillText('NOBODY THINKS ANY DIFFERENTLY OF US', R0, 542, R1 - R0); }
  ST.slice(0, 4).forEach(([nm, cl, v, word, at], i) => {
    const y = 542 + i * 33; g.font = `21px ${MONO}`; g.fillStyle = cl; g.fillText(nm.toUpperCase(), R0, y, 172); g.fillStyle = '#12303a'; g.fillRect(R0 + 186, y - 14, 110, 11); g.fillStyle = at < 0 ? '#ff5a1f' : cl; g.fillRect(R0 + 241, y - 14, clamp(at, -100, 100) * .55 * kS, 11); g.fillStyle = '#e6f4ff'; g.fillRect(R0 + 240, y - 17, 2, 17);
    g.textAlign = 'right'; g.font = `bold 22px ${MONO}`; g.fillStyle = v < 0 ? '#ff8a6a' : '#8dff6a'; g.fillText(sdNum(v), R0 + 362, y); g.font = `17px ${MONO}`; g.fillStyle = '#a9c8d6'; g.fillText(word.toUpperCase(), R1, y, 118); g.textAlign = 'left'; });
  if (ST.length > 4) { g.font = `16px ${MONO}`; g.fillStyle = '#6f93a4'; g.fillText(`AND ${ST.length - 4} MORE: SEE STANDING, ON THE DECK`, R0, 542 + 4 * 33 - 8, R1 - R0); }
  g.globalAlpha = 1;
  /* the foot of the screen, and the lines every screen in this building has */
  g.fillStyle = '#5f8496'; g.font = `14px ${MONO}`; g.fillText(`${YARD.name.toUpperCase()} · AFTER ACTION · EYES ONLY`, 44, 702, 640); g.textAlign = 'right'; g.fillStyle = Math.sin(t * 3) > 0 ? col : '#24323a'; g.fillText('● ON FILE', 1236, 702);
  g.textAlign = 'left'; g.fillStyle = 'rgba(160,220,255,.04)'; for (let yy = (t * 40) % 6; yy < 720; yy += 6) g.fillRect(0, yy, 1280, 1.5);
  BRF.tex.needsUpdate = true;
}
function updateAar(dt, t) {
  const A = AAR; A.t += dt; aarTalk(dt);
  if ((A.drawT -= dt) < 0) { A.drawT = A.t < 4 ? .033 : .1; aarDraw(t); }
  const W = BRF.crowd; W.cam.copy(BRF.camera.position); W.talk = null; W.speaking = false; W.update(dt);
  BRF.beam.material.opacity = .04 + .012 * Math.sin(t * 23) * Math.sin(t * 3.1); BRF.glow.intensity = 140 + 22 * Math.sin(t * 1.7) + (A.t < .25 ? 60 : 0); BRF.fill.intensity = damp(BRF.fill.intensity, 0, 4, dt);
  /* square on to the screen: the mouse leans the view a little, and the screen stays where the head and the way out left room for it */
  const C = brfCam, S = A.cam; C.pos.set(S[0] + C.sx * .9, S[1] + C.sy * .5 + Math.sin(t * .31) * .012, S[2]); C.look.set(S[0], S[1], -6.61);
  C.cPos.lerp(C.pos, 1 - Math.exp(-2.6 * dt)); C.cLook.lerp(C.look, 1 - Math.exp(-3.2 * dt)); BRF.camera.position.copy(C.cPos); BRF.camera.lookAt(C.cLook); BRF.camera.updateMatrixWorld();
}
/* ---- getting there and away ---- */
/* called by toHangar() with the picture faded out: the machine is back on its stand and the books are settled */
function aarOpen(D) {
  brfBuild(); Object.assign(AAR, { D, L: [], q: [], cur: null, ct: 0, need: 0, said: false, t: 0, drawT: 0, gap: 0, arm: 0, sent: 0, note: '', mark: null }); $('aarL').innerHTML = $('aarR').innerHTML = '';
  D.shop = shopRoll(); if (D.shop) { news('The quartermaster has posted new stock on the market.'); saveCO(); }
  for (const id of ['hangarUI', 'fieldUI', 'hqUI']) $(id).classList.add('hid'); $('aarUI').classList.remove('hid'); mode = 'aar';
  { const g = BRF.flag.image.getContext('2d'); g.fillStyle = '#0d1116'; g.fillRect(0, 0, 256, 256); drawLogo(g, 128, 128, 112); BRF.flag.needsUpdate = true; }
  for (const g of BRF.guests) { BRF.crowd.remove(g); BRF.people.splice(BRF.people.indexOf(g), 1); g.dispose(); } BRF.guests = [];   /* whoever sat in on the last briefing has gone home */
  for (const h of BRF.people) h.look = BRF.eye; BRF.talk = null; aarLines(D); AAR.q = AAR.L.slice(); aarLay(); aarNav();
  const S = AAR.cam; brfCam.sx = brfCam.sy = 0; brfCam.cPos.set(S[0] + 1.6, S[1] - .5, S[2] + 3.2); brfCam.cLook.set(S[0], S[1] - .3, -6.61); aarDraw(T); if (D.ok) music.sting('win');
}
async function aarLeave(to) {
  if (busy || mode !== 'aar' || uiModal()) return; const D = AAR.D, ask = AAR.L.find(b => b.key === 'disp' && b.opts);
  if (ask) { if (AAR.cur !== ask) aarShow(ask); return aarNag(ask.el, `${ask.ch.name.toUpperCase()} IS WAITING ON AN ANSWER`); }
  if (D.salv && !(AAR.arm > performance.now())) {
    const S = D.salv, worth = S.pool.map(k => itemInfo(k)).sort((p, q) => q.price - p.price), val = worth.slice(0, S.picks).reduce((s, i) => s + i.price, 0); AAR.arm = performance.now() + 7000;
    aarCut(CREW.chief, `All of it, boss? That is ${S.picks === 1 ? 'a piece' : S.picks + ' pieces'} we are owed and will not see again, ${worth[0].name} among ${S.pool.length === 1 ? 'it' : 'them'}: something like ${fmt(val)} at market. Go, and the client's yard gets the lot.`, 'nag');
    aarNag($('aarSalv'), 'SALVAGE NOT CHOSEN — PRESS AGAIN TO LEAVE IT ALL'); return setTimeout(() => { if (mode === 'aar' && AAR.D === D && AAR.note[0] === 'S') { AAR.note = ''; aarNav(); } }, 7100);
  }
  busy = true; vox.stop(); AAR.q.length = 0; aarDrop(); sfx.play('servo'); blackout(true); await tween(.55, fade); $('aarUI').classList.add('hid'); if (D.salv) tal('y.left', D.salv.pool.length); D.salv = null; AAR.D = null; AAR.L = []; AAR.cur = null; $('aarL').innerHTML = $('aarR').innerHTML = ''; saveCO();
  if (to === 'hq') { showHQ(); hq.cPos.set(0, 3.2, 8.6); hq.cLook.set(0, 1.5, 0); busy = false; }
  else { mode = 'hangar'; $('hangarUI').classList.remove('hid'); for (const id of ['panelL', 'panelR', 'hint', 'status']) $(id).classList.remove('hid'); orb.cine = false; orb.idle = 0; orb.cPos.set(0, 21.5, 44); orb.cLook.set(0, 14, 0); busy = false; refreshUI(); renderHangarContract(); setStatus(CO.active ? `CONTRACT SIGNED — ${CO.active.site.toUpperCase()} · FIT OUT AND LAUNCH` : 'UNIT RECOVERED — REPAIRED AND REARMED'); }
  await tween(.8, k => fade(1 - k)); blackout(false);
}
{
  addEventListener('pointermove', e => { if (mode !== 'aar') return; brfCam.sx = (e.clientX / innerWidth - .5) * .5; brfCam.sy = -(e.clientY / innerHeight - .5) * .4; });
  addEventListener('resize', () => { if (mode === 'aar') aarLay(); }); for (const id of ['aarL', 'aarR']) $(id).addEventListener('scroll', aarMore, { passive: true });
  /* ENTER or SPACE is the lift up to the deck, once the room has had a moment to arrive */
  addEventListener('keydown', e => { if (mode !== 'aar' || uiModal() || e.repeat || AAR.t < 1.2 || (e.target && /^(BUTTON|TEXTAREA|INPUT)$/.test(e.target.tagName))) return; if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); aarLeave('hq'); } });   /* (a button that has the focus keeps its own ENTER) */
  $('aarSalv').onclick = () => { sfx.play('ui'); aarSalvage(); }; $('aarSalv').addEventListener('animationend', e => { if (e.animationName === 'aarNag') e.target.classList.remove('nag'); });   /* (so that it goes back to its own pulse) */
  $('aarShop').onclick = () => { if (busy || mode !== 'aar' || uiModal()) return; sfx.play('ui'); vox.stop(); storesOpen({ mode: 'shop' }); };
  $('aarHQ').onclick = () => { sfx.play('ui'); aarLeave('hq'); }; $('aarBay').onclick = () => { sfx.play('ui'); aarLeave('bay'); };
  $('aarFb').onclick = () => { const D = AAR.D; if (!D || mode !== 'aar') return; sfx.play('ui'); vox.stop(); fbOpen({ kind: 'contract', title: 'WHAT DID YOU WISH YOU COULD DO ON THAT CONTRACT?', sub: D.c.site.toUpperCase(), ctx: aarCtx(D), done: sent => { AAR.sent = sent ? 1 : 2; aarNav(); } }); };
}
