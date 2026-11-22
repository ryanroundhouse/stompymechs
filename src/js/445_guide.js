/* ============ THE GUIDE: THE CREW SHOW A NEW COMMANDER ROUND EACH ROOM THE FIRST TIME THEY WALK INTO IT, AND POINT AT THE NEXT THING TO PRESS ============ */
/* A tour is a few steps said by one of the crew: { t: the line (or a function giving it), at: a selector to ring (or a function giving the element), when: () => the step applies,
   done: () => the player has done what it asks, so the tour moves on by itself, act: () => something to set up as the step begins, pos: 'lft' or 'low' to stand the panel at the left or the bottom of the page }. A tour never takes the controls away: the page works as usual
   underneath it, the ring lets clicks through, and walking out of the room ends it. Each is given once (TUT.seen) and only while TUT.hints is on; `modal` marks one that is about an overlay.
   Besides the tours there is the chip, which names the next thing to do until the first sortie has been flown, and the key prompts the shakedown puts on the HUD (tutKeys).
   State is in TUT (115_first_day.js) and is saved with the company */
const TG = { k: null, i: 0, T: null, st: null, tk: 0, w: 0, arm: 0, pul: null, chip: '', keys: null };
const tutFirst = () => CO.board.find(c => c.story && STORY[c.story].first) || null;
const TOURS = {
  bay: { by: () => CREW.chief, room: () => mode === 'hangar' && !CO.active, steps: [
    { t: () => `Morning, boss. Dutch: I run your bay. That is all of ${YARD.name} on the stand there. One KESTREL, third-hand, paid for. Give me a minute and I'll show you round.` },
    { t: "This side is how she's built. Six places to bolt something on: legs, torso, cockpit, two arms and a back unit. Click one and I'll show you what we have in stores that fits it.", at: '#panelL' },
    { t: "This side is what the build adds up to: weight, armour, speed, and how much heat her guns make against how much she can shed. If I don't like something, it turns up here in amber or red.", at: '#panelR' },
    { t: 'Drag to walk round her, wheel to get closer. STORES is everything we own that is not bolted on, and the market. There is nothing to change today: we own one of everything.', at: '#btnStores' },
    { t: "What we don't have is work. That's upstairs. Go up to the COMMAND DECK and see the XO.", at: '#btnHQ', done: () => mode === 'hq' },
  ] },
  launch: { by: () => CREW.chief, room: () => mode === 'hangar' && !!CO.active, steps: [
    { t: "There's the job on the slate, boss: where it is, who it's for and how bad they say it is.", at: '#ctr' },
    { t: "Anything I don't like about her for this job shows up here. Amber I'll argue about. Red, the door stays shut.", at: '#warns', when: () => !!$('warns').children.length },
    { t: "She's fuelled and she's armed. Press LAUNCH and I'll roll her out.", at: '#btnDeploy', done: () => mode === 'field' || busy },
  ] },
  deck: { by: () => CREW.xo, room: () => mode === 'hq' && tutLock(), steps: [
    { t: 'Commander on deck. Varga: I run your operations. Everything this company is offered comes through this room, and so does everything it is paid.' },
    { t: 'The contract board. On an ordinary day there are six offers here, and none of them clean. Today there is one, and it came out of our own mech.', at: '#board', act: () => { const c = tutFirst(); if (c && !CO.sel) { CO.sel = c; CO.dirty = true; } } },
    { t: 'Select a card and the terms come up on this side: who is asking, who it is against, what it pays and how dangerous it is. Ordinary offers can be argued with. This one cannot.', at: '#detail', act: () => { const c = tutFirst(); if (c) { CO.sel = c; CO.dirty = true; } } },
    { t: 'Along the bottom, your people, as in any room that has people in it: me for the board, Mira Sato for intelligence, Dutch, and the pilots. Click any of us and we will talk.', at: '#hqBar' },
    { t: 'And at the foot of this side, where it is in every room, the way out: the market, and the lifts down to the bay and the bar.', at: '#hqNav' },
    { t: 'When you are ready: ACCEPT. I brief an operation like this one in person, next door, and then you take the lift to the bay and launch.', at: () => $('dBrf') || $('detail'), done: () => mode === 'brief' },
  ] },
  field: { by: () => CREW.chief, room: () => mode === 'field' && MS.on && !MS.over && !locked && !P.dead && !$('pause').classList.contains('hid') && $('mapUI').classList.contains('hid'), steps: [
    { t: "Last thing from me, boss. ENGAGE gives you the controls: it takes the mouse, and the mouse aims her. ESC hands it back and stops the clock, so nothing out there can hurry you.", at: '#btnResume', pos: 'lft', done: () => locked },
  ] },
  salv: { by: () => CREW.chief, modal: true, room: () => !$('stores').classList.contains('hid') && ST.mode === 'salv', steps: [
    { t: "Salvage, boss. What you shot is lying out there, and the contract gives us a share of it. Click what you want brought home, up to the limit, then confirm. Whatever we leave, the client keeps.", at: '#stGrid', pos: 'low' },
  ] },
  home: { by: () => CREW.xo, room: () => mode === 'hq' && !tutLock() && CO.board.some(c => !c.story), steps: [
    { t: 'There. A full board. Offers come and go by the hour. The tag is the kind of work, the pips are how dangerous the client admits it is, and the figure is where the haggling starts.', at: '#board' },
    { t: 'Select one and read it before you sign. OPEN CHANNEL talks to the client: push for more money and they may pay it, or they may walk away. ACCEPT puts it on the slate in the bay.', at: '#detail', act: () => { if (!CO.sel) { CO.sel = CO.board.find(c => !c.story) || null; CO.dirty = true; } } },
    { t: 'Mira Sato sells certainty. Ask her about a contract before you take it. What the client left out of the brief is usually the part that kills you.', at: '#bIntel' },
    { t: 'STANDING is who thinks well of us and who does not: the five powers that pay, and the three other companies working this sector. They remember.', at: '#hqTabs' },
    { t: 'And when you want a wingman, a rumour or a drink, the bar is downstairs. That is the tour, Commander. Pick a contract.', at: '#btnToBar' },
  ] },
  bar: { by: () => BARC.keep, room: () => mode === 'bar' && !BAR.relax && !BAR.game, steps: [
    { t: "New face. Sit anywhere that isn't taken. I'm Brandt. Everybody calls me Mother and I've stopped arguing." },
    { t: "People in here talk. The regulars are along the bottom: click one and buy them a round, and you'll hear what is coming onto your board before it gets there. It's bar talk: sometimes it's even true. Ballast and Vise would sooner take a stake off you, at the drinking table and the arm-wrestling table.", at: '#barBar' },
    { t: 'Pilots between jobs drink here too. Hire one and they fly on your wing for the next drop, for a fee or a share. The good ones cost.', at: '#barHire' },
    { t: "Or take a seat and do nothing at all. The lift is that way when you've had enough.", at: '#barNav' },
  ] },
  stores: { by: () => CREW.chief, modal: true, room: () => !$('stores').classList.contains('hid') && ST.mode !== 'salv', steps: [
    { t: 'Stores, boss. The tabs along the top are what we own, the market: what is for sale today, and what they will give us for ours. It changes every day. The third is the dealer: whole machines, when you have the money and not the patience.', at: '#stTabs' },
    { t: 'Click a part to read its card. Anything you buy goes on the shelf; to bolt it to her, close this and click the slot it belongs in.', at: '#stGrid', pos: 'low' },
  ] },
};
const tutStepOk = s => !s.when || s.when();
function tutStart(k) {
  const T = TOURS[k]; TG.k = k; TG.T = T; TG.arm = 0; $('tut').classList.remove('hid'); const ch = T.by(); drawFace($('tutFace'), ch); $('tutWho').textContent = ch.name; $('tutWho').style.color = ch.col || '';
  $('tutOff').classList.toggle('hid', !(k === 'bay' && tutLock())); $('tutOff').textContent = 'I HAVE DONE THIS BEFORE'; tutStep(0);
}
function tutStep(i) {
  const T = TG.T; while (i < T.steps.length && !tutStepOk(T.steps[i])) i++; if (i >= T.steps.length) return tutEnd();
  const s = TG.st = T.steps[i], n = T.steps.filter(tutStepOk), text = typeof s.t === 'function' ? s.t() : s.t; TG.i = i; if (s.act) s.act();
  $('tutText').textContent = text; $('tutN').textContent = n.length > 1 ? `${n.indexOf(s) + 1} / ${n.length}` : ''; $('tutNext').textContent = s.done ? 'GOT IT' : i === T.steps.length - 1 ? 'DONE' : 'NEXT ▶'; $('tutSkip').classList.toggle('hid', n.length < 2 || n.indexOf(s) === n.length - 1);
  if (i) $('tutOff').classList.add('hid'); if (!dlgCur) vox.say(T.by(), text, mode === 'field' ? 'radio' : undefined); tutRing(); sfx.play('ui');
}
/* a tour that ends, however it ends, has been given */
function tutEnd() {
  if (TG.k) { TUT.seen[TG.k] = 1; saveCO(); } TG.k = TG.T = TG.st = null; TG.w = 0; $('tut').classList.add('hid'); $('tutRing').classList.add('hid');
}
function tutRing() {
  const s = TG.st, R = $('tutRing'), at = s && s.at, el = !at ? null : typeof at === 'function' ? at() : document.querySelector(at), b = el && el.getBoundingClientRect(), on = b && b.width > 2 && b.height > 2 && !$('tut').classList.contains('hid');
  /* keep the panel off whatever it is pointing at: it sits at the top of the page unless the ringed thing is there (or the step says otherwise), and then it goes to the bottom */
  $('tut').classList.toggle('lft', !!s && s.pos === 'lft'); $('tut').classList.toggle('low', !!s && (s.pos === 'low' || (!s.pos && !!on && b.top < 190 && b.left < innerWidth / 2 + 250 && b.right > innerWidth / 2 - 250)));
  if (!on) return R.classList.add('hid');
  R.classList.remove('hid'); R.style.left = b.left - 6 + 'px'; R.style.top = b.top - 6 + 'px'; R.style.width = b.width + 12 + 'px'; R.style.height = b.height + 12 + 'px';
}
/* what to do next, for somebody who has not yet flown the first sortie: a line of text and the thing to press */
function tutHint() {
  if (!tutLock() || !TUT.hints || TG.k || busy || uiModal() || (dlgCur && mode !== 'brief')) return null; const a = CO.active, c = tutFirst();
  if (mode === 'hangar') return a ? ['NEXT · LAUNCH when she is ready', '#btnDeploy'] : ['NEXT · The contracts are upstairs, on the COMMAND DECK', '#btnHQ'];
  if (mode === 'hq') return a ? ['NEXT · Take the lift down to the MECH BAY and launch', $('dGo') ? '#dGo' : '#btnToBay'] : !c ? null : CO.sel === c && $('dBrf') ? ['NEXT · ACCEPT it: Commander Varga will brief you', '#dBrf'] : ['NEXT · Select the ★ SHAKEDOWN card on the board', '.card.stc'];
  if (mode === 'brief') return dlgCur ? ['CONTINUE (or SPACE) through the briefing', null] : ['NEXT · Take the lift to the MECH BAY', '#brfSkip'];
  if (mode === 'bar') return ['NEXT · The contract board is upstairs, on the COMMAND DECK', '#bbHQ'];
  return null;
}
function tutChip() {
  const h = tutHint(), C = $('tutChip'), el = h && h[1] ? document.querySelector(h[1]) : null;
  if (TG.pul && TG.pul !== el) TG.pul.classList.remove('tutP'); if (el) el.classList.add('tutP'); TG.pul = el;
  C.classList.toggle('hid', !h); C.classList.toggle('side', mode === 'brief'); if (h && TG.chip !== h[0]) C.textContent = TG.chip = h[0]; if (!h) TG.chip = '';   /* in the briefing room the middle of the page is the wall map */
}
/* the keys for whatever is being taught just now, across the bottom of the HUD: [[key, what it does], ...], or nothing to take them away */
function tutKeys(L) { TG.keys = L && L.length ? L : null; $('tutKeys').innerHTML = TG.keys ? TG.keys.map(([k, d]) => `<div><b>${k}</b><span>${d}</span></div>`).join('') : ''; POST.kick(); }
function tutTick(dt) {
  $('tutKeys').classList.toggle('hid', !(TG.keys && mode === 'field' && MS.on && !MS.over && !P.dead)); if (TG.keys && (mode !== 'field' || !MS.on)) TG.keys = null;
  if ((TG.tk -= dt) > 0) return; const el = .1 - TG.tk; TG.tk = .1;
  if (TG.k) {
    const T = TG.T; if (!TUT.hints || !T.room()) { tutEnd(); return tutChip(); }
    const hide = !!dlgCur || (busy && !TG.st.done) || (uiModal() && !T.modal); $('tut').classList.toggle('hid', hide);
    if (!hide && TG.st.done && TG.st.done()) tutStep(TG.i + 1); else tutRing();
  } else if (TUT.hints && (!busy || mode === 'field') && !dlgCur) {   /* `busy` is the bay's, and stays set from the launch until the machine is home again */
    let k = null; for (const q of TUT_KEYS) { const T = TOURS[q]; if (T && !TUT.seen[q] && T.room() && (T.modal || !uiModal())) { k = q; break; } }
    if (!k) TG.w = 0; else if ((TG.w += el) > .7) tutStart(k);   /* a moment for the room to arrive before anybody starts talking */
  }
  tutChip();
}
/* "I have done this before": the board opens, the shakedown is closed unflown and nobody shows anybody round. It takes two presses */
function tutSkip() {
  TUT.lock = false; TUT.hints = false; tutEnd(); tutStory(); for (const c of CO.board.filter(c => c.story && STORY[c.story].first)) { if (CO.active === c) CO.active = null; if (CO.sel === c) CO.sel = null; CO.board.splice(CO.board.indexOf(c), 1); }
  CO.news = CO.news.filter(n => !n.includes('Nobody is hiring yet')); fillBoard(); news(TUT_OPEN()); CO.dirty = true; saveCO(); refreshUI(); sfx.play('ok'); setStatus('TUTORIAL SKIPPED — THE CONTRACT BOARD IS OPEN');
}
/* the tours again, from the settings: every room, the next time it is walked into */
function tutAgain() { tutEnd(); TUT.seen = {}; TUT.hints = true; TG.w = 0; saveCO(); }
$('tutNext').onclick = () => { if (TG.k) tutStep(TG.i + 1); };
$('tutSkip').onclick = () => { sfx.play('ui'); tutEnd(); };
$('tutOff').onclick = () => { if (TG.arm) return tutSkip(); TG.arm = 1; sfx.play('deny'); $('tutOff').textContent = 'SURE? NO FIRST SORTIE, NO TOURS — PRESS AGAIN'; };
addEventListener('resize', () => { if (TG.k) tutRing(); });
