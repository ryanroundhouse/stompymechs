/* ============ STORY THREADS: CONNECTED CHAPTERS THAT TURN UP ON THE BOARD ONE AT A TIME, EACH BRIEFED BY THE XO AND FLOWN OVER A THEATRE STK TIMES THE USUAL SIZE ============ */
/* a thread is { name, sub, col, emp, foe, who (whoever is asking), open() (may it start yet?), wait (hours before it first appears), flags [names a chapter may set], ch: [chapters] }.
   a chapter is { title, kind (a TYPES key: what sort of work it is on paper), biome, mood, seed, diff, pay, salv, site, op, tease (the board text), wire (the news line when it is offered),
   sites { lz: [x, z, r], … } (flattened ground, shared by the briefing and the field), face (the site the lance faces on landing), brf [briefing steps], run(ms) (the field script), epi(ok, f) (who says what afterwards), prize(D, add, f) }.
   STORY has no prototype for the same reason RIV has none: thread keys come out of save files. The thread files further down fill it in.
   One thread is marked `first`: the shakedown a new company flies before anybody will hire it. While the board is locked (tutLock) it is the only thread offered; its offer never lapses, a failed attempt is
   on the board again at once, and it is flown on the company's own account (settle). A chapter marked `solo` is flown alone, whoever has been hired */
const STORY = Object.create(null), STK = 2.4, STV = { th: Object.create(null), f: Object.create(null) }, STNUM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
/* where a thread stands: ch the next chapter · st 0 not begun, 1 between chapters, 2 on the board, 3 finished · at the hour it may next be offered · exp when that offer closes · n failed attempts at this chapter */
const stState = k => STV.th[k] || (STV.th[k] = { ch: 0, st: 0, at: 0, exp: 0, n: 0 });
/* what the threads remember of your choices: small integers under 'thread.flag'. In the field they are staged in MS.sf and only kept if the chapter is won */
const stFlag = k => STV.f[k] | 0;
const stSet = (flag, v = 1) => { MS.sf[MS.c.story + '.' + flag] = v | 0; };
const stGet = flag => (MS.sf[MS.c.story + '.' + flag] ?? STV.f[MS.c.story + '.' + flag]) | 0;
const stDone = k => !!STORY[k] && stState(k).st === 3;
function storyMake(k) {
  const S = STORY[k], T = stState(k), H = S.ch[T.ch], rg = REGION[H.biome], a = (H.seed % 628) / 100;
  return { id: ++cid, story: k, chap: T.ch, title: H.title, type: H.kind, plot: TYPES[H.kind].plots[0], emp: H.emp || S.emp, foe: H.foe || S.foe, biome: H.biome, mood: H.mood | 0, tod: H.tod, diff: clamp(H.diff + (CO.done > 14 ? 1 : 0), 1, 5), seed: H.seed, twists: [], persona: 'clerk', pat: 99, pushes: 0,
    intel: [], support: false, contact: H.who || S.who, site: H.site, item: '', op: H.op, pay: H.pay, salv: H.salv || 25, exp: T.exp, pos: [rg[0] + Math.sin(a) * .15, rg[1] + Math.cos(a) * .15], upd: '', brief: H.tease };
}
/* keep the board in step with the threads: begin the ones whose time has come, offer whichever chapter is due (never more than three at once), and make sure each offered thread has exactly its own card */
function storySync() {
  const n = now(), L = tutLock(); let on = 0;
  for (const k in STORY) { const T = stState(k); if (T.st === 0 && L === !!STORY[k].first && STORY[k].open()) { T.st = 1; T.at = n + (STORY[k].wait || 0) * rand(.6, 1.4); } if (T.st === 2 && !STORY[k].main) on++; }
  for (const k in STORY) { const T = stState(k), S = STORY[k]; if (T.st !== 1 || n < T.at || (on >= 3 && !S.main) || L !== !!S.first) continue;   /* a locked board is offered the first sortie and nothing else; an open one, everything but */ T.st = 2; T.exp = S.first || S.main ? 1e6 : n + rand(60, 96); if (!S.main) on++;   /* the campaign's card is over and above the three, and waits as long as it has to */ news(T.n ? `${S.who.name} is asking for ${YARD.name} again: ${S.ch[T.ch].title}.` : S.ch[T.ch].wire); sfx.play('comm'); }
  for (const c of [...CO.board]) if (c.story && (!STORY[c.story] || stState(c.story).st !== 2 || stState(c.story).ch !== c.chap)) dropContract(c);
  for (const k in STORY) if (stState(k).st === 2 && !CO.board.some(c => c.story === k)) { CO.board.push(storyMake(k)); CO.dirty = true; }
}
/* an offer nobody took goes away for a while and comes round again */
function storyLapse(c) { const T = stState(c.story); T.st = 1; T.at = now() + rand(18, 40); dropContract(c); news(`${STORY[c.story].who.name} has stopped waiting on ${YARD.name} — for now.`); }
/* the first sortie and the lock on the board are one thing. While the board is locked that thread is unfinished; once it is finished — or was never wanted, as in a company founded before there was one,
   or one that skipped it — the board is open and the thread is closed. Whatever a save says, this makes the two agree */
function tutStory() {
  let any = false; for (const k in STORY) if (STORY[k].first) { const T = stState(k); any = true; if (T.st === 3) TUT.lock = false; else if (!TUT.lock) { T.ch = STORY[k].ch.length; T.st = 3; } }
  if (!any) TUT.lock = false;
}
function storySave() { const th = {}; for (const k in STORY) { const T = stState(k); th[k] = { ch: T.ch, st: T.st, at: +T.at.toFixed(2), exp: +T.exp.toFixed(2), n: T.n }; } return { th, f: { ...STV.f }, act: CO.active && CO.active.story ? CO.active.story : null }; }
/* from a save (or nothing, for a new company): only threads and flags that exist, and only numbers that make sense */
function storyApply(s) {
  const D = s && s.story && typeof s.story === 'object' ? s.story : {}, th = D.th && typeof D.th === 'object' ? D.th : {}, f = D.f && typeof D.f === 'object' ? D.f : {}, num = (v, d, lo, hi) => typeof v === 'number' && isFinite(v) ? clamp(v, lo, hi) : d;
  for (const c of [...CO.board]) if (c.story) dropContract(c);
  STV.th = Object.create(null); STV.f = Object.create(null);
  for (const k in STORY) {
    const q = Object.prototype.hasOwnProperty.call(th, k) && th[k] && typeof th[k] === 'object' ? th[k] : {}, S = STORY[k], T = stState(k);
    T.ch = num(q.ch, 0, 0, S.ch.length) | 0; T.st = num(q.st, 0, 0, 3) | 0; T.at = num(q.at, 0, 0, 1e7); T.exp = num(q.exp, 0, 0, 1e7); T.n = num(q.n, 0, 0, 99) | 0;
    if (T.ch >= S.ch.length) T.st = 3; else if (T.st === 3) T.st = 1;
    for (const fl of S.flags || []) { const key = k + '.' + fl; if (Object.prototype.hasOwnProperty.call(f, key) && typeof f[key] === 'number' && isFinite(f[key])) STV.f[key] = clamp(f[key] | 0, -9, 9); }
  }
  tutStory(); storySync(); if (typeof D.act === 'string' && STORY[D.act] && !CO.active) CO.active = CO.board.find(c => c.story === D.act) || null; CO.dirty = true;
}
/* the books: a chapter won moves the thread on, a chapter lost puts it back in the queue. Either way it will be a while before it is heard from again */
function storySettle(c, ok, D, add) {
  const k = c.story, S = STORY[k], T = stState(k), H = S.ch[c.chap], last = c.chap === S.ch.length - 1, f = { ...STV.f, ...(ok ? MS.sf : {}) };
  D.story = { k, chap: c.chap, last, f, gifts: [], head: `${S.name} · ${STNUM[c.chap]} · ${H.title.toUpperCase()} — ${ok ? 'COMPLETE' : 'FAILED'}`, news: ok ? (last ? S.fin : H.after || `${YARD.name}: ${S.name}, chapter ${STNUM[c.chap]} — done.`) : `${YARD.name} came home from ${c.site} with the job undone. ${S.who.last} has not given up on them.` };
  if (!ok) { T.n++; T.st = 1; T.at = S.first ? 0 : S.main ? now() + rand(3, 7) : now() + rand(24, 46); return; }
  for (const key in MS.sf) if ((S.flags || []).includes(key.slice(k.length + 1))) STV.f[key] = clamp(MS.sf[key] | 0, -9, 9);
  T.ch++; T.n = 0; T.st = last ? 3 : 1; T.at = now() + (S.main ? rand(12, 22) : rand(24, 44)); if (S.first && last) { tutStory(); CO.news = CO.news.filter(n => !n.includes('Nobody is hiring yet')); }
  if (H.prize) H.prize(D, add, f);
}
const stGift = (D, key, n = 1) => { invAdd(key, n); D.story.gifts.push(`${n > 1 ? n + ' × ' : ''}${itemInfo(key).name}`); };
/* after the books: the people the chapter was about have something to say, and anything they sent arrives */
function storyDebrief(D, fin) {
  const S = STORY[D.story.k], H = S.ch[D.story.chap], L = (H.epi ? H.epi(D.ok, D.story.f, D) : []).filter(Boolean), crew = { 11: 'xo', 23: 'intel', 37: 'chief', 51: 'p0', 67: 'p1' };
  if (D.story.gifts.length) L.push([CREW.chief, `Delivery for you, boss, off the back of that one: ${D.story.gifts.join(', ')}. In stores now.`]);
  if (D.ok && D.story.last) L.push([CREW.xo, S.close || `That closes the book on ${S.name}. ${S.end || 'It will be talked about.'}`]);
  else if (D.ok) L.push([CREW.xo, 'That is not the end of it. When there is more, it will come up on the board.']);
  else L.push([CREW.xo, S.again || 'It will be offered again — these people have nobody else to ask. Take a day, refit, and we go back.']);
  const step = i => { removeContact(); if (i >= L.length) return fin(); const [ch, text] = L[i], p = crew[ch.seed] ? HQ.P[crew[ch.seed]] : null; if (!p && !(CAST[ch.seed] && CAST[ch.seed].bot)) showContact(ch);   /* a machine is a voice: there is nobody to stand on the pad */ dlg(ch, text, [[i === L.length - 1 ? 'Continue' : 'Go on', () => step(i + 1)]], p); };
  step(0);
}
const stPips = (c, S) => S.ch.map((h, i) => `<i class="${i < c.chap ? 'd' : i === c.chap ? 'n' : ''}"></i>`).join('');
function storyCard(c, h) {
  const S = STORY[c.story], B = BIOMES[c.biome];
  return `<span class="tg">★</span><b>${S.name}</b><em>${fmt(c.pay)}</em><small>${S.first ? 'FIRST SORTIE' : `${S.main ? `ACT ${STNUM[S.ch[c.chap].act - 1]} · ` : ''}${STNUM[c.chap]} OF ${STNUM[S.ch.length - 1]}`} · ${c.title.toUpperCase()} · <span style="color:${B.css}">${B.name}</span> ${todTag(c)}</small><i class="pips" title="Threat ${c.diff} of 5">${pipStr(c.diff)}</i>${capTag(c)}<u>${c === CO.active ? 'ACCEPTED' : h < 8 ? 'CLOSING' : stState(c.story).n ? 'AGAIN' : S.first ? 'START HERE' : S.main ? 'CAMPAIGN' : 'STORY'}</u>`;
}
function storyDetail(c, el) {
  const S = STORY[c.story], B = BIOMES[c.biome], m = B.wx[c.mood] || B.wx[0], h = Math.max(0, c.exp - now()), act = c === CO.active, T = stState(c.story);
  el.innerHTML = `<h2 style="color:${S.col}">${S.first ? 'FIRST SORTIE' : S.main ? `THE CAMPAIGN · ACT ${STNUM[S.ch[c.chap].act - 1]}` : 'STORY OPERATION'} <small>OP. ${c.op}</small></h2><div class="dsc"><div class="sth" style="--sc:${S.col}"><b>${S.name}</b><span>${S.sub}</span><div class="stp">${stPips(c, S)}<em>${S.first ? 'BEFORE ANYTHING ELSE' : `CHAPTER ${STNUM[c.chap]} OF ${STNUM[S.ch.length - 1]}`}</em></div></div>
<h3>${c.title.toUpperCase()}</h3><div class="sub">${c.site.toUpperCase()}</div>
<div class="kv">ASKED FOR BY <b style="color:${c.contact.col}">${c.contact.name}</b></div><div class="kv">FOR <b style="color:${S.forN ? S.col : FAC[c.emp].col}">${S.forN || FAC[c.emp].name}</b></div><div class="kv">AGAINST <b style="color:${S.vsN ? '#ff7a55' : FAC[c.foe].col}">${S.vsN || FAC[c.foe].name}</b></div><div class="kv">THEATRE <b style="color:${B.css}">${B.name}</b></div><div class="kv">CONDITIONS <b class="tod ${todKey(c.biome, c.mood, c.tod)}">${skyOf(c.biome, c.mood, c.tod)}</b></div>
<div class="kv">OPERATING AREA <b>${(STK).toFixed(1)} KM ACROSS</b></div><div class="kv">THREAT <b class="pips">${pipStr(c.diff)}</b></div>${capKv(c)}<div class="kv">FEE <b>${fmt(c.pay)}</b></div><div class="kv">SALVAGE <b>${c.salv}%</b></div><div class="kv">${act ? 'STATUS' : S.first || S.main ? 'OFFER' : 'OFFER CLOSES IN'} <b>${act ? 'ACCEPTED' : S.first || S.main ? 'STANDS UNTIL FLOWN' : h.toFixed(0) + ' h'}</b></div>${T.n ? `<div class="kv">ATTEMPTS SO FAR <b style="color:var(--hot)">${T.n}</b></div>` : ''}
<p>${c.brief}</p><p class="nt">${S.main ? S.ch[c.chap].note || S.note : S.note || B.note + ' A story operation runs long and covers a lot of ground. Commander Varga briefs the lance before launch — what is known, at any rate. Lose it, or let the offer lapse, and it comes round on the board again.'}</p></div>
<div class="dact"><div class="row"><button id="dBrf" class="stb">${act ? 'HEAR THE BRIEFING AGAIN ▶' : 'ACCEPT — REPORT TO THE BRIEFING ROOM ▶'}</button></div>${act ? '<div class="row"><button id="dAcc">STAND DOWN</button><button id="dGo">TO THE MECH BAY ▶</button></div>' : ''}</div>`;
  $('dBrf').onclick = () => { sfx.play('ui'); if (!act) accept(c); CO.dirty = true; toBrief(c); };
  if (act) { $('dGo').onclick = toBay; $('dAcc').onclick = () => { CO.active = null; sfx.play('deny'); CO.dirty = true; }; }
}
/* the ground a chapter is flown over: its named sites become flattened pads (a fourth entry is the label the tactical map gives it), and each road — a list of site keys — a string of smaller ones,
   so that whatever has to drive it finds level ground with nothing growing on it. The lance lands at lz facing the first other site */
function storyLay(c) {
  const H = STORY[c.story].ch[c.chap], L = H.sites, ks = Object.keys(L), f = L[H.face || ks[1]], lz = L.lz, xz = k => [L[k][0], L[k][1]], o = ks.filter(k => k !== 'lz'), pads = ks.map(k => [L[k][0], L[k][1], L[k][2] || 40]);
  for (const rd of H.roads || []) for (let i = 1; i < rd.length; i++) { const a = L[rd[i - 1]], b = L[rd[i]], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 55)); for (let j = 1; j < n; j++) pads.push([lerp(a[0], b[0], j / n), lerp(a[1], b[1], j / n), 27]); }
  return { a: Math.atan2(lz[0] - f[0], lz[1] - f[1]), lz: xz('lz'), A: xz(o[0]), B: xz(o[1] || o[0]), C: xz(o[2] || o[0]), run: H.run,
    env: H.home ? { home: true, mood: c.mood, tod: c.tod, pads: H.lay ? pads.filter(p => Math.hypot(p[0] - lz[0], p[1] - lz[1]) > 90) : null } : { pads, mood: c.mood, tod: c.tod },   /* a home chapter marked `lay` has its sites levelled and kept clear of rocks, like any other theatre */
    ready: ms => { ms.S = {}; for (const k of ks) { ms.S[k] = gpos(L[k][0], L[k][1]); if (L[k][3]) FD.blips.push([L[k][0], L[k][1], L[k][3]]); } ms.sf = {}; ms.H = H; } };
}

boardApply(BOOT);

