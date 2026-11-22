/* ============ THE FEEDBACK BOX, AND WHAT IS NEW ============ */
/* fbOpen({ kind, title, sub, ctx, done }) puts up the box: one question, one place to type, SEND. It is opened by the debriefing room (kind 'contract', with what was just
   flown as ctx) and from SETTINGS · WHAT'S NEW (kind 'general'). What is typed goes to the server through netFeedback (046_wire_home.js), and is kept in this browser to go
   later if the server does not answer. A draft left unsent is still there the next time the box is opened. The box swallows its own keys: nothing typed reaches the game */
const FBK = { open: false, kind: 'general', ctx: null, done: null, busy: false, say: '', bad: false, draft: { contract: '', general: '' } };
function fbOpen(o = {}) {
  if (FBK.open) return; const kind = o.kind === 'contract' ? 'contract' : 'general', t = $('fbText'); Object.assign(FBK, { open: true, kind, ctx: o.ctx || {}, done: o.done || null, busy: false, say: '', bad: false });
  $('fbTitle').textContent = o.title || 'TELL THE DEVELOPER'; $('fbSub').textContent = o.sub || '';
  $('fbLead').textContent = (kind === 'contract' ? 'Something you tried that the game would not let you do. Something you looked for and did not find. A fight you wanted to go another way. ' : 'What works, what does not, what you would like to be able to do. ') + 'Type it as it comes: it goes straight to the person who makes the game, and every one is read.';
  $('fbNote').textContent = `Sent with it: ${kind === 'contract' ? 'which contract that was and how it went, ' : ''}which build of the game this is (${BUILD})${CFG.count ? ', and the random number this browser is counted by' : ''}. Nothing else: not your company's name, and nothing from your save.`;
  t.value = FBK.draft[kind]; t.placeholder = kind === 'contract' ? 'I wanted to…' : 'Go on…'; t.disabled = false; $('fbUI').classList.remove('hid'); fbDraw(); setTimeout(() => { if (FBK.open) t.focus(); }, 40);
}
function fbClose() { if (!FBK.open || FBK.busy) return; FBK.open = false; FBK.draft[FBK.kind] = $('fbText').value; $('fbUI').classList.add('hid'); $('fbText').blur(); }
function fbDraw() {
  const n = $('fbText').value.trim().length; $('fbSend').disabled = FBK.busy || !n; $('fbSend').textContent = FBK.busy ? 'SENDING…' : 'SEND IT'; $('fbCancel').disabled = FBK.busy;
  $('fbInfo').textContent = FBK.say || `${$('fbText').value.length.toLocaleString('en-US')} / 4,000 · CTRL+ENTER SENDS`; $('fbInfo').style.color = FBK.say ? (FBK.bad ? 'var(--hot)' : 'var(--ok)') : '';
}
async function fbSend() {
  const t = $('fbText'), text = t.value.trim(); if (!FBK.open || FBK.busy) return; if (!text) return sfx.play('deny');
  FBK.busy = true; FBK.say = ''; t.disabled = true; fbDraw(); sfx.play('ui'); const kind = FBK.kind, ok = await netFeedback({ kind, text, ctx: FBK.ctx });
  /* either way it is out of the player's hands: sent, or waiting in this browser for the next launch */
  FBK.draft[kind] = t.value = ''; FBK.bad = !ok; FBK.say = ok ? 'SENT. THANK YOU.' : 'THE SERVER DID NOT ANSWER. IT IS KEPT ON THIS MACHINE AND GOES THE NEXT TIME THE GAME IS OPENED.'; sfx.play(ok ? 'ok' : 'deny'); fbDraw();
  await new Promise(r => setTimeout(r, ok ? 1100 : 3200)); FBK.busy = false; const d = FBK.done; fbClose(); if (d) d(ok);
}
{
  const t = $('fbText'); t.oninput = fbDraw; for (const ev of ['keyup', 'keypress']) t.addEventListener(ev, e => e.stopPropagation());
  t.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Escape') { e.preventDefault(); fbClose(); } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); fbSend(); } });
  $('fbSend').onclick = fbSend; $('fbCancel').onclick = () => { sfx.play('ui'); fbClose(); }; $('fbUI').addEventListener('pointerdown', e => { if (e.target === $('fbUI')) fbClose(); });
  addEventListener('keydown', e => { if (FBK.open && e.code === 'Escape') fbClose(); });
}

/* ---- what is new: the marker on every SETTINGS button, the chip at the top of a room, and the tab in SETTINGS (settingsDraw calls whatsDraw) ---- */
WNEW.from = WNEW.seen;   /* what this browser had read when the page opened: the tab goes on marking what is newer than that for as long as the page stays open */
WNEW.on = false; WNEW.chip = +lsGet('chip') >= BUILD;   /* the chip has been waved away for this build */
function whatsMark() {
  const F = whatsFresh(), on = F.length > 0; for (const id of ['btnSet', 'bSet', 'bbSet', 'btnPSet']) $(id).classList.toggle('wnew', on);
  if (on) $('wnGo').innerHTML = `<b>★ NEW SINCE YOU LAST PLAYED</b><span>${F[0].t}${F.length > 1 ? ` · AND ${F.length - 1} MORE` : ''}</span><u>SEE WHAT'S NEW ▸</u>`; whatsTick();
}
/* the chip shows in the three rooms a player stands about in, and nowhere it could be in the way */
function whatsTick() { const on = WNEW.seen < BUILD && !WNEW.chip && (mode === 'hangar' || mode === 'hq' || mode === 'bar') && !busy; if (on !== WNEW.on) { WNEW.on = on; $('wnChip').classList.toggle('hid', !on); } }
function whatsDraw(B, tog) {
  const isNew = w => w.n > WNEW.from, top = WHATS.filter(isNew), head = top.length ? top : [WHATS[0]], rest = WHATS.filter(w => !head.includes(w));
  const ent = w => `<div class="wne${isNew(w) ? ' new' : ''}"><b>${w.t}</b><em>${isNew(w) ? '<u>NEW</u>' : ''}${w.d} · BUILD ${w.n}</em><ul>${w.l.map(s => `<li>${s}</li>`).join('')}</ul></div>`;
  B.innerHTML = `<div class="sh">${top.length ? 'NEW SINCE YOU LAST PLAYED' : 'THE LATEST'} <small>THIS IS BUILD ${BUILD}</small></div>${head.map(ent).join('')}
<div class="sh">TALK TO THE DEVELOPER</div><div class="gm"><button id="wnFb"><b>✎ SEND FEEDBACK</b><small>What works, what does not, what you wish you could do</small></button></div>
<div class="sg" style="margin-top:12px">${tog('sCount', 'COUNT ME AS A PLAYER', CFG.count)}</div>
<p class="snt">${CFG.count ? 'When the game opens it tells its server one thing: a random number this browser made up for itself, so the developer can tell how many people play and how many come back. No name, no address, and nothing from your company or your save.' : 'Nothing is sent when the game opens, and the number this browser was counted by has been forgotten. Feedback still goes, when you press SEND, and only then.'}</p>
${rest.length ? `<div class="sh">EARLIER</div>${rest.map(ent).join('')}` : ''}`;
  $('wnFb').onclick = () => { sfx.play('ui'); fbOpen({ kind: 'general' }); };
  $('sCount').onclick = () => { CFG.count = !CFG.count; if (!CFG.count) lsSet('vid', ''); cfgSave(); sfx.play('ui'); settingsDraw(); };
  if (whatsSeen()) whatsMark();   /* it has been read */
}
{
  $('wnGo').onclick = () => { sfx.play('ui'); settingsOpen('news'); };
  $('wnX').onclick = () => { sfx.play('ui'); WNEW.chip = true; lsSet('chip', String(BUILD)); whatsTick(); };
  whatsMark();
}
