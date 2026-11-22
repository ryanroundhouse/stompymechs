/* ============ HEADQUARTERS: UI, CONVERSATIONS, NEGOTIATION, DEBRIEF ============ */
let dlgCur = null;
/* dlg(who, text, [[label, fn, disabled]], person) — person: a crew figure to frame, or null to leave the camera alone */
function dlg(who, text, opts, person) {
  text = coTxt(text); tal('q.talk'); dlgCur = { who, text, opts, t: 0 }; drawFace($('dlgFace'), who); $('dlgWho').textContent = `${who.name} · ${who.role}`; $('dlgWho').style.color = who.col; $('dlg').classList.remove('hid'); $('dlgOpts').innerHTML = '';
  opts.forEach(([label, fn, dis], i) => { const b = document.createElement('button'); b.innerHTML = `<b>${i + 1}</b>${label}`; b.disabled = !!dis; b.onclick = () => { sfx.play('ui'); fn(); }; $('dlgOpts').appendChild(b); });
  sfx.play('comm'); vox.say(who, text, mode === 'hq' && HQ.contact && HQ.contact.ch.seed === who.seed ? 'holo' : undefined); if (person) { focusOn(person); if (person.cam) hq.focus.pos.set(...person.cam); }
}
function dlgClose() { dlgCur = null; vox.stop(); $('dlg').classList.add('hid'); focusOn(null); removeContact(); }
const unknown = c => c.story ? [] : ['plot', ...c.twists].filter(k => !c.intel.some(i => i.k === k));
const hintOf = (c, k) => k === 'rival' && RIV[c.rival] ? `${RIV[c.rival].name} has taken an interest in this one. Expect ${RIV[c.rival].ch.last}'s lance on the ground — and not necessarily on our side.` : k === 'plot' && c.type === 'recovery' && c.plot === 'race' && RIV[c.rival] ? `${RIV[c.rival].name} has filed for the same salvage.` : HINT[k === 'plot' ? `${c.type}.${c.plot}` : k];
const learn = (c, k, src, s) => { c.intel.push({ k, s: s || hintOf(c, k), src }); CO.dirty = true; };
const repWord = r => r > 40 ? 'trusted' : r > 15 ? 'favoured' : r > -15 ? 'neutral' : r > -40 ? 'distrusted' : 'hostile';
/* `why` is the column it goes under in the record: market, mech, pilot, intel, bar, stake, gift */
const spend = (n, why = 'misc') => { if (CO.cb < n) return false; CO.cb -= n; tal('cr.o.' + why, n); CO.dirty = true; saveCO(); return true; };
function accept(c) { if (CO.active !== c) tal('q.acc'); if (CO.active && CO.active !== c) { tal('q.drop'); quitCost(CO.active); if (!CO.active.story) news(`${YARD.name} walked away from the ${FAC[CO.active.emp].short} job at ${CO.active.site}.`); } CO.active = CO.sel = c; c.upd = ''; if (!c.story) news(`${YARD.name} signed with ${FAC[c.emp].short}: ${TYPES[c.type].name.toLowerCase()} at ${c.site}.`); sfx.play('ok'); }

function talkXO() {
  const c = CO.sel, x = CREW.xo, back = [['Something else', talkXO], ['That is all', dlgClose]], st = player.stats;
  const read = () => { const B = BIOMES[c.biome], risk = c.diff * 24 - st.armor * .06 - st.fire * .13 - (CO.wing ? 18 : 0);
    return `${TYPES[c.type].name} for ${FAC[c.emp].name}, against ${FAC[c.foe].short}. ${B.name.charAt(0) + B.name.slice(1).toLowerCase()} theatre. ${B.note} Their contact, ${c.contact.name}, is ${PERSONA[c.persona].n}. ` + (c.co && RIV[c.co] ? (c.cok === 'sub' ? `The paper belongs to ${RIV[c.co].name}; we would be flying it for them, and it is them we answer to. ` : `${RIV[c.co].name} would deploy beside us. `) : '') + (risk > 38 ? 'In the machine on the turntable I would call that a hard fight. Think about heavier armor, or hire a second pilot.' : risk > 8 ? 'Inside our weight class — if nothing goes sideways. Something usually does.' : 'We outgun this one comfortably.') + (c.twists.includes('renege') && c.seed % 3 ? ` One more thing: ${FAC[c.emp].short} has been slow to pay lately. Talk to their contact before you launch.` : ''); };
  const best = [...EMPS].sort((a, b) => CO.rep[b] - CO.rep[a]);
  dlg(x, tutLock() ? pick(['One card on the board, Commander, and it came from our own mech. Fly it and the rest will follow.', 'Nobody hires a company whose only machine is squawking CADET. The shakedown first; then we are in business.']) : pick(['Commander on deck. What do you need?', 'The board is live. Six offers, and none of them clean.', 'Good timing. Offers move fast out here — and so do the people making them.']), [
    ['What is the word in the sector?', () => dlg(x, CO.news.slice(0, 5).join('\n') || 'Quiet. Which worries me.', back)],
    [c ? `Your read on the ${c.site} job` : 'Your read on a contract (select one first)', () => dlg(x, read(), back), !c],
    ['Company status', () => dlg(x, `Funds ${fmt(CO.cb)}. ${CO.done} contracts completed, ${CO.fails} failed. ${FAC[best[0]].short} think best of us (${repWord(CO.rep[best[0]])}); ${FAC[best[4]].short} least (${repWord(CO.rep[best[4]])}). Of the other companies: ${RIVS.map(k => `${RIV[k].name}, ${relWord(CO.riv[k].rel)}`).join('; ')}.${CO.active ? ` We are committed to ${CO.active.site} for ${FAC[CO.active.emp].short}.` : ' Nothing signed yet. Without a contract, a launch is just the proving grounds.'}${CO.wing ? ` ${CO.wing.ch.first} flies with us next drop.` : ''}`, back)],
    ['How does this work?', () => dlg(x, 'Pick an offer on the board or a marker on the table. Open a channel to the client to bargain — fee, salvage, support — or just accept. Then go down to the bay, fit the mech for the theatre, and launch. Mira sells intelligence, Dutch runs the stores and the market, and the two in the corner fly for money. Downstairs in the Last Round there are more pilots for hire, and people who talk about the jobs on this board — some of it is even true. Three other companies fly this sector — Cobalt Lance, the Carnival and Verdigris Salvage. Sometimes they want the same job we do, sometimes they have work for us; the STANDING tab on the board shows where we are with them and with the factions, and why. Whatever the recovery crews pull off the field, the salvage rights in the contract decide how much of it we keep. No brief ever tells the whole story.', back)],
    ['Disband and start a new company', () => dlg(x, 'That wipes the ledger, our standing with every faction, the stores, and every machine in the bays. A clean slate and one light mech. Are you sure?', [['Yes — start over', () => { dlgClose(); newGame(); }], ['No. Forget I asked', talkXO]])],
    ['That is all', dlgClose]], HQ.P.xo);
}
function talkIntel() {
  const c = CO.sel, s = CREW.intel, cost = c ? Math.round((5000 + c.diff * 2500) * (stFlag('dead.end') ? .5 : 1)) : 0, left = c ? unknown(c) : [], back = [['Something else', talkIntel], ['Thanks, Mira', dlgClose]];
  dlg(s, tutLock() ? pick(['I have no files open. It is restful, and I do not like it. Clear that transponder and I will have work for you.', 'Every broker in the sector can hear our mech announcing a student driver. I have stopped answering their jokes.']) : pick(['I have six files open and I trust none of them. Which one are we talking about?', 'Everything on that board was written by someone who wants something. Ask.', 'Signals are noisy today. Somebody is moving a lot of metal.']), [
    [c ? (left.length ? `Buy confirmed intel on ${c.site} (${fmt(cost)})` : `Nothing more to learn about ${c.site}`) : 'Buy intel (select a contract first)', () => { if (!spend(cost, 'intel')) return dlg(s, 'My sources do not work on credit, and neither do I.', back); tal('q.intel'); const k = pick(left); learn(c, k, 'sato'); dlg(s, `Confirmed, and it cost me a favour: ${hintOf(c, k)}`, back); }, !c || !left.length],
    ['Any rumours?', () => { const G = barGossip('intel'); if (G.length && Math.random() < .3) { const [rk, f] = pick(G); rivKnow(rk, f[0]); return dlg(s, `About ${RIV[rk].name}, for what it is worth: ${f[1]} I have put it in their file.`, back); } const L = CO.board.filter(o => !o.rum && o.twists.some(t => !o.intel.some(i => i.k === t))), o = L.length && Math.random() < .7 ? pick(L) : null; if (!o) return dlg(s, pick(['Nothing I would stake a mech on.', 'Only that everyone is hiring and nobody is paying on time.', 'The Red Maw are bolder this season. That is all I have.']), back); o.rum = true; const k = pick(o.twists.filter(t => !o.intel.some(i => i.k === t))); learn(o, k, 'sato'); dlg(s, `About ${o.site}, for free: ${hintOf(o, k)}`, back); }],
    ['How do the factions and the other companies see us?', () => dlg(s, EMPS.map(f => `${FAC[f].short}: ${repWord(CO.rep[f])} (${sdNum(CO.rep[f])})`).join(' · ') + '\n' + RIVS.map(k => `${RIV[k].name}: ${relWord(CO.riv[k].rel)} (${sdNum(CO.riv[k].rel)})`).join(' · ') + '\nGood standing with a faction means better fees and softer negotiators. With a company it decides whether they talk or shoot when we meet them. The STANDING tab on the board has the detail, and the reasons.', back)],
    ['Thanks, Mira', dlgClose]], HQ.P.intel);
}
function talkChief() {
  const c = CO.sel, d = CREW.chief, st = player.stats, cfg = player.cfg, back = [['Something else', talkChief], ['Carry on, Dutch', dlgClose]];
  const terr = () => { const k = c.biome, hotW = ['las', 'pls'].filter(w => cfg.armL === w || cfg.armR === w).length, B = BIOMES[k];
    return ({ desert: 'Open ground and long sightlines. Rails and missiles earn their keep; there is nothing to hide behind.', urban: 'Streets and towers. Buildings stop fire both ways, so bring something that hits hard up close. Jump jets will put you on the rooftops.', forest: 'You will walk straight through the trees — she weighs more than they do — but you will not see through them. Wade a lake if the reactor runs hot.', jungle: 'Wet heat. Cooling drops by a fifth, and the river slows you when you wade deep.', glacial: 'Cold is free cooling: half again what the sinks manage here. Run the energy weapons all day.', volcanic: 'Cooling is down a third, and lava cooks armor and reactor both. Stay on the black rock.', lunar: 'A sixth of the weight: jump jets carry three times as far. No air to dump heat into, though.' })[k]
      + ((B.cool || 1) < .85 && hotW && cfg.back !== 'snk' ? ' With those energy weapons fitted and no cryo sinks, you will be riding the shutdown line.' : '') + (k === 'lunar' && !st.jets ? ' I would fit jump jets for this one.' : '') + (st.over ? ' And she is overweight. Fix that first.' : ''); };
  dlg(d, pick(['She is fuelled and the welds are still warm. What do you need?', 'Boss. Try to bring this one back with both arms.', 'Bay three is ready when you are.']), [
    [c ? `How will she handle ${BIOMES[c.biome].name.toLowerCase()} ground?` : 'Terrain advice (select a contract first)', () => dlg(d, terr(), back), !c],
    [`Open the market — ${YARD.shop.stock.length} lots, restock in ${shopEta().toFixed(0)} h`, () => { dlgClose(); storesOpen({ mode: 'shop' }); }],
    [`See the mech dealer — ${dealLot().length} whole machines on the lot`, () => { dlgClose(); storesOpen({ mode: 'mech' }); }],
    [`What is in stores? (${invCount()} items, ${CO.kit} repair kit${CO.kit === 1 ? '' : 's'})`, () => { dlgClose(); storesOpen({ mode: 'inv' }); }],
    ['What is on the turntable?', () => { const rd = mechReady(cfg, c && c.biome, c); dlg(d, !bayParts(cfg) ? 'Nothing. The stand is empty — bring up a bay with a machine in it, or build one from stores.' : !rd.ok ? `${mechName}, and she is going nowhere: ${rd.block.join(', ').toLowerCase()}. Fit what is missing from stores, or watch the market — chassis parts do not come up often.` : `${mechName}: ${st.cls.toLowerCase()} class, ${st.tons.toFixed(0)} tons, ${st.armor} armor, ${(st.speed * RUN * 3.6).toFixed(0)} kph flat out. ${st.jets ? 'Jump jets fitted.' : 'No jump jets.'} ${rd.warn.length ? 'I would not sign her out as she is: ' + rd.warn.join('; ').toLowerCase() + '.' : 'Within limits, and cleared to launch.'} That is her on the stand there. Change anything you like down in the bay.`, back); }],
    ['Carry on, Dutch', dlgClose]], HQ.P.chief);
}
function talkPilot(i) {
  const p = PILOTS[i], ch = p.ch, P0 = HQ.P['p' + i], back = [['Back', () => talkPilot(i)], ['Leave', dlgClose]];
  if (p.until > now()) return dlg(ch, 'Still in the med bay, thanks to your last contract. Ask me in a couple of days.', [['Leave', dlgClose]], P0);
  if (CO.wing && CO.wing.p !== p) return dlg(ch, `You already have ${CO.wing.ch.first} on your ticket. A dropship carries two machines, not three.`, [[`Release ${CO.wing.ch.first} and talk terms`, () => { wingRelease(); talkPilot(i); }], ['Leave it as it is', dlgClose]], P0);
  if (CO.wing && CO.wing.p === p) return dlg(ch, 'I am already on your ticket. Changed your mind?', [['Stand down — I fly solo', () => { if (!CO.wing.share) CO.cb += Math.round(p.fee * .5); CO.wing = null; CO.dirty = true; dlg(ch, 'Your call. I am keeping half the retainer.', [['Leave', dlgClose]]); }], ['No. Be ready', dlgClose]], P0);
  const hire = share => { if (!share && !spend(p.fee, 'pilot')) return dlg(ch, 'Come back when you can cover the retainer.', back); tal('q.hire'); CO.wing = { p, ch, mech: p.mech, share: share ? p.share : 0 }; CO.dirty = true; dlg(ch, share ? `${Math.round(p.share * 100)} percent of the fee, then. I will be on your wing at launch.` : 'Paid up front. I like you already. See you on the drop.', [['Leave', dlgClose]]); };
  dlg(ch, i ? 'Anvil. Assault pilot. I am slow, I am expensive, and I do not miss.' : 'Rook. I fly light and fast, and I always come home. Need a second machine?', [
    [`Hire for the next contract — flat ${fmt(p.fee)}`, () => hire(false)], [`Offer ${Math.round(p.share * 100)}% of the contract fee instead`, () => hire(true)],
    ['Haggle the retainer down', () => { p.hag = true; if (Math.random() < .35 + CO.done * .06) { p.fee = Math.round(p.fee * .75 / 1000) * 1000; dlg(ch, `...You have a reputation. ${fmt(p.fee)}. Tell nobody.`, back); } else { p.fee = Math.round(p.fee * 1.15 / 1000) * 1000; dlg(ch, `For that, the price just went up. ${fmt(p.fee)}.`, back); } }, p.hag],
    ['Not today', dlgClose]], P0);
}
/* negotiation: every push spends the contact's patience; run out and the offer is gone */
function talkContact(c) {
  if (!c || !CO.board.includes(c)) return; const ch = dealer(c), sub = ch !== c.contact, Q = PERSONA[c.persona], E = sub ? RIV[c.co].short : FAC[c.emp].short; showContact(ch);
  const menu = line => {
    if (c.pat <= 0) { dropContract(c); sub ? rivRel(c.co, -3, `talks over ${c.site} broke down`) : repAdd(c.emp, -2, `talks over ${c.site} broke down`); news(`${E} broke off talks over ${c.site}.`); return dlg(ch, Q.bye, [['Close channel', dlgClose]]); }
    const odds = k => clamp(k + (sub ? CO.riv[c.co].rel : CO.rep[c.emp]) / 150 + CO.done * .02 - c.pushes * .17, .05, .9), act = CO.active === c;
    const push = (k, okFn, cost) => () => { c.pushes++; tal('q.hag'); if (Math.random() < odds(k)) { okFn(); tal('q.hagW'); c.pat -= cost; CO.dirty = true; menu(Q.yes); } else { c.pat -= cost * 1.6; CO.dirty = true; menu(Q.no); } };
    const n = clamp(Math.ceil(c.pat / 18), 0, 5); dlg({ ...ch, role: `${ch.role} · PATIENCE ${'▮'.repeat(n)}${'▯'.repeat(5 - n)}` }, line, [
      [`Push for a higher fee (now ${fmt(c.pay)})`, push(Q.pay, () => { c.pay = Math.round(c.pay * 1.12 / 1000) * 1000; }, 12)],
      [`Ask for better salvage rights (now ${c.salv}%)`, push(Q.salv, () => { c.salv += 10; }, 10), c.salv >= 45],
      ['Request a repair drop in the field', push(.5, () => { c.support = true; if (!c.twists.includes('supply')) c.twists.push('supply'); learn(c, 'supply', 'terms', 'The client funds one repair drop if your armor fails.'); }, 14), c.support],
      ['What are you not telling me?', () => {
        c.pat -= 9; const left = unknown(c); if (!left.length) return menu('You know everything I know. Possibly more.');
        if (Math.random() < Q.honest) { const k = pick(left); learn(c, k, 'contact'); return menu(`...Very well. ${hintOf(c, k)}`); }
        if (c.persona === 'smuggler' && Math.random() < .6) { const lie = HINT[`${c.type}.${pick(TYPES[c.type].plots.filter(p => p !== c.plot))}`]; c.intel.push({ k: 'lie', s: lie, src: 'contact' }); CO.dirty = true; return menu(`Between friends? ${lie}`); }
        menu(pick(['The brief is the brief.', 'Nothing that concerns a hired gun.', 'You are paid to pilot, not to ask.']));
      }],
      [act ? 'Contract already accepted' : 'Accept the contract', () => { accept(c); CO.dirty = true; dlg(ch, pick(['Then we have an agreement. Coordinates are on your board.', 'Good. Do not be late.', "Signed. Bring me my money's worth."]), [['Close channel', dlgClose]]); }, act],
      ['I will think about it', dlgClose]], null);
  };
  menu(c.talked ? 'You again. Have you decided?' : sub ? Q.hi : `${ch.name}, ${FAC[c.emp].name}. ${Q.hi}`); c.talked = true;
}
/* after a sortie the XO reads out what happened, then the books — and some clients try to short the invoice */
function debrief(D) {
  const x = CREW.xo, c = D.c, led = () => D.lines.map(([l, v]) => `${l}: ${fmt(v)}`).join('\n') + `\nNET: ${fmt(D.total)}   ·   FUNDS: ${fmt(CO.cb)}`;
  const fin = () => dlg(x, `${D.ok ? 'Good work out there.' : 'We live to sign another contract.'} The board shifted while you were gone — look it over.${D.rep.length ? '\n' + D.rep.map(([f, v]) => `${FAC[f].short} standing ${v > 0 ? '+' : ''}${Math.round(v)}`).join(' · ') : ''}${D.rel && D.rel.length ? '\n' + RIVS.map(k => [k, D.rel.reduce((s, r) => s + (r[0] === k ? r[1] : 0), 0)]).filter(r => r[1]).map(([k, v]) => `${RIV[k].name} ${v > 0 ? '+' : ''}${v}`).join(' · ') : ''}`, [['Dismissed', dlgClose]], HQ.P.xo);
  const dispute = () => {
    const ch = c.contact, cut = Math.round(D.base * .3); showContact(ch);
    const res = (paid, line, r) => { if (!paid) { CO.cb -= cut; D.total -= cut; D.lines.push(['Withheld by client', -cut]); } repAdd(c.emp, r, `the disputed invoice for ${c.site}`); CO.dirty = true; saveCO(); dlg(ch, line, [['Close channel', () => { removeContact(); fin(); }]], null); };
    dlg(ch, `Our accountants have reviewed the engagement. Ammunition overage, collateral, administrative fees. We are remitting seventy percent — ${fmt(cut)} withheld.`, [
      ['Accept the cut', () => res(false, 'A pleasure doing business.', 1)],
      ['Demand payment in full — cite the contract', () => Math.random() < .4 + CO.rep[c.emp] / 120 + (c.talked ? .15 : 0) ? res(true, '...Legal advises me to release the balance. You have your money.', -1) : res(false, 'Then sue us. Seventy percent.', -3)],
      ['Threaten to tell every outfit in the sector', () => Math.random() < .65 ? res(true, 'There is no need for that. The balance is on its way. Do not call this office again.', -9) : res(false, 'Slander is expensive, mercenary. Seventy percent — and we are finished.', -12)]], null);
  };
  const after = () => (D.story ? () => storyDebrief(D, fin) : D.renege ? dispute : fin)(), ch = CREW.chief; let salvShow = null;
  const salv = () => dlg(ch, `Recovery crews are back from ${c.site}. ${D.salv.pool.length} ${D.salv.pool.length === 1 ? 'piece' : 'pieces'} worth keeping came off the field, and the contract gives us ${c.salv}% salvage — ${D.salv.picks === D.salv.pool.length ? 'so all of it is ours' : `that is ${D.salv.picks} of them`}. Tell me which, boss. The rest goes to the client's yard.`, [
    ['Show me what they found', salvShow = () => { const S = D.salv; dlgClose(); storesOpen({ mode: 'salv', salv: { pool: S.pool, picks: S.picks, site: c.site, pct: c.salv }, done: got => { D.salv = null; dlg(ch, got.length ? `Tagged and stowed: ${got.map(k => itemInfo(k).name).join(', ')}. In stores whenever you want ${got.length === 1 ? 'it' : 'them'} fitted.` : 'Leaving it all? Your call. The scrap men will be pleased.', [['Continue', after]], HQ.P.chief); } }); }],
    ['No time — let the client have it', () => { const S = D.salv, worth = S.pool.map(k => itemInfo(k)).sort((a, b) => b.price - a.price), val = worth.slice(0, S.picks).reduce((s, i) => s + i.price, 0);
      dlg(ch, `All of it, boss? That is ${S.picks === 1 ? 'a piece' : S.picks + ' pieces'} we are owed and will not see again — ${worth[0].name} among ${S.pool.length === 1 ? 'it' : 'them'}, something like ${fmt(val)} at market. Say the word and the client's yard gets the lot.`, [['Wait. Show me what they found', salvShow], ['Yes — leave it all', () => { D.salv = null; after(); }]], HQ.P.chief); }]], HQ.P.chief);
  const story = D.log.slice(0, -1).filter(s => !s.includes(': "')).slice(-5);
  dlg(x, `${D.story ? D.story.head : (D.ok ? 'CONTRACT COMPLETE' : 'CONTRACT FAILED') + ' — ' + c.site}.\n${D.text}${story.length ? '\n\n' + story.map(s => '· ' + s).join('\n') : ''}`, [['Show me the books', () => dlg(x, led(), [['Continue', D.salv ? salv : after]])]], HQ.P.xo);
}

/* ---- STANDING: the second tab of the board. How each faction and each of the other companies sees us, what that is worth, and why it last moved ---- */
const HQV = { tab: 'board', sel: 'r.cob' };
const sdEsc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
const sdNum = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(Math.round(v));
const sdPct = x => (x >= 0 ? '+' : '−') + Math.abs(Math.round(x * 100)) + '%';
/* a meter with zero in the middle: red to the left, the owner's colour to the right */
const sdBar = (v, col) => `<i class="sdm"><b style="${v < 0 ? `right:50%;width:${-v / 2}%;background:#ff5a1f` : `left:50%;width:${v / 2}%;background:${col || '#8dff6a'}`}"></b></i>`;
const sdLog = L => L.length ? L.map(([d, v, why]) => `<div class="sdl"><b class="${v < 0 ? 'n' : 'p'}">${sdNum(v)}</b><span>DAY ${d} · ${sdEsc(why)}</span></div>`).join('') : '<p class="nt">Nothing on record yet.</p>';
const FAC_MEANS = { trusted: 'They ask for us by name. Their liaisons give ground when pushed, and their accountants pay without an argument.', favoured: 'We are on their short list. Better fees than the going rate, and contacts who will listen.', neutral: 'One more hired gun to them. Fees and patience at the going rate.', distrusted: 'They hire us when nobody else is free, pay less for it, and their contacts run out of patience quickly.', hostile: 'They would sooner see us on the wrong end of a contract than sign one. Expect the worst terms on the board.' };
const RIV_MEANS = { allied: 'They will stand down rather than fight us, lend a lance when they are nearby, and send work our way.', friendly: 'They think well of us. Joint operations and subcontracts come easily, and they talk before they shoot.', wary: 'Competitors. They will take the other side of a contract without a second thought — but they will talk first.', 'bad blood': 'They do not trust us. No favours and no work, and no benefit of the doubt in the field.', feud: 'They will not deal with us at all. Nothing comes from them until that changes — a peace offering is a start.' };
function renderStand() {
  const el = $('stand'), row = (id, col, name, sub, v, word, mark) => `<div class="sdr${HQV.sel === id ? ' on' : ''}" data-id="${id}">${mark}<b style="color:${col}">${name}</b><em>${word.toUpperCase()} ${sdNum(v)}</em>${sub ? `<small>${sub}</small>` : ''}${sdBar(v, id[0] === 'r' ? col : '')}</div>`;
  el.innerHTML = '<div class="sdh">FACTIONS <small>WHO HIRES US</small></div>'
    + EMPS.map(f => row('f.' + f, FAC[f].col, FAC[f].name, '', CO.rep[f], repWord(CO.rep[f]), `<u style="background:${FAC[f].col}"></u>`)).join('')
    + `<div class="sdr off"><u style="background:${FAC.maw.col}"></u><b style="color:${FAC.maw.col}">${FAC.maw.name}</b><em>OUTLAWS — NO DEALINGS</em></div>`
    + '<div class="sdh">MECH COMPANIES <small>WHO ELSE FLIES HERE</small></div>'
    + RIVS.map(k => row('r.' + k, RIV[k].col, RIV[k].name, RIV[k].ch.name, CO.riv[k].rel, relWord(CO.riv[k].rel), `<canvas width="60" height="60" data-k="${k}"></canvas>`)).join('');
  el.querySelectorAll('canvas').forEach(cv => drawLogo(cv.getContext('2d'), 30, 30, 27, RIV[cv.dataset.k].logo));
  el.querySelectorAll('.sdr[data-id]').forEach(d => d.onclick = () => { sfx.play('ui'); HQV.sel = d.dataset.id; CO.dirty = true; });
}
function renderStandDetail() {
  const el = $('detail'), id = HQV.sel, hex = h => '#' + h.toString(16).padStart(6, '0');
  if (id[0] === 'f' && FAC[id.slice(2)]) {
    const f = id.slice(2), F = FAC[f], r = CO.rep[f], n = CO.board.filter(c => c.emp === f).length, m = CO.board.filter(c => c.foe === f).length;
    el.innerHTML = `<h2>STANDING <small>FACTION</small></h2><h3 style="color:${F.col}">${F.name.toUpperCase()}</h3><div class="sub">${repWord(r).toUpperCase()} · ${sdNum(r)} ON A SCALE OF ±100</div>${sdBar(r)}
<p>${FAC_MEANS[repWord(r)]}</p>
<div class="kv">FEES THEY OFFER US <b>${sdPct(r / 250)}</b></div><div class="kv">ODDS WHEN WE PUSH THEIR CONTACTS <b>${sdPct(r / 150)}</b></div><div class="kv">ODDS IN A DISPUTED INVOICE <b>${Math.round(clamp(.4 + r / 120, 0, 1) * 100)}%</b></div><div class="kv">ON THE BOARD NOW <b>${n} FOR THEM · ${m} AGAINST</b></div>
<p class="nt">Standing rises when their contracts are completed and falls when they fail, are abandoned, or we change sides mid-contract. Every job flown against a faction costs a little with it.</p>
<div class="sdh">WHY IT MOVED <small>LAST ${(CO.hist[f] || []).length || ''}</small></div>${sdLog(CO.hist[f] || [])}`;
    return;
  }
  const k = RIV[id.slice(2)] ? id.slice(2) : RIVS[0], V = RIV[k], R = CO.riv[k], t = rivTier(k), st = mechStats(V.roster[t]), w = relWord(R.rel), facts = V.facts.filter(f => R.know.includes(f[0]));
  const jobs = CO.board.filter(c => c.co === k || (c.rival === k && c.intel.some(i => i.k === 'rival' || (c.type === 'recovery' && c.plot === 'race' && i.k === 'plot')))).map(c => `${c.co ? (c.cok === 'sub' ? 'SUBCONTRACT' : 'JOINT OP') : 'EXPECTED'} · ${c.site}`);
  el.innerHTML = `<h2>STANDING <small>MECH COMPANY</small></h2><div class="sdt"><canvas id="sdLogo" width="132" height="132"></canvas><canvas id="sdFace" width="144" height="144"></canvas><div><h3 style="color:${V.col}">${V.name.toUpperCase()}</h3><div class="sub">${V.tag}</div><div class="sdc">${['pri', 'sec', 'acc', 'glow'].map(c => `<u style="background:${hex(V.paint[c])}"></u>`).join('')}</div></div></div>
<div class="kv">COMMANDER <b>${V.ch.name}</b></div><div class="kv">STANDING <b style="color:${V.col}">${w.toUpperCase()} · ${sdNum(R.rel)}</b></div>${sdBar(R.rel, V.col)}
<p>${V.blurb}</p><p>${RIV_MEANS[w]}</p>
<div class="kv">THEY WOULD BRING <b>${V.roster[t].name} · ${st.cls} ${st.tons.toFixed(0)} t</b></div><div class="kv">POWER · THEIRS / OURS <b>${mechPower(V.roster[t])} / ${mechPower(player.cfg)}</b></div><div class="kv">ON THE BOARD <b>${jobs.length ? jobs.join('<br>') : 'NOTHING WE KNOW OF'}</b></div>
<p class="nt">${V.style} They field whichever of their machines best matches the one on our turntable.</p>
<div class="sdh">DOSSIER <small>${facts.length} OF ${V.facts.length} ON FILE</small></div>${facts.map(f => `<div class="intel">${f[1]}</div>`).join('')}${facts.length < V.facts.length ? `<p class="nt">${facts.length ? 'There is more to learn.' : 'Nothing on file.'} People in the Last Round talk about the other companies, and Mira hears things.</p>` : ''}
<div class="sdh">WHY IT MOVED</div>${sdLog(R.log)}
<div class="row"><button id="sdHail">OPEN CHANNEL — ${V.ch.last.toUpperCase()}</button></div>`;
  drawLogo($('sdLogo').getContext('2d'), 66, 66, 60, V.logo); drawFace($('sdFace'), V.ch); $('sdHail').onclick = () => { sfx.play('ui'); talkRival(k); };
}
/* a channel to another company's commander: where we stand, work they cannot cover, a joint operation on the selected offer, and making amends */
const RIV_TALK = {
  cob: {
    hi: ['{CO}. It is good to hear from a company that keeps its word. What do you need?', '{CO}. Cobalt Lance actual. State your business.', '{CO}. I am listening, which is more than you have earned. Be brief.'],
    stand: { allied: 'Cobalt counts you a friend. I do not use the word lightly.', friendly: 'You have dealt fairly with us. I intend to return it.', wary: 'We are competitors. I bear you no ill will, and I extend you no credit.', 'bad blood': 'You have given me reasons to doubt you. Give me better ones.', feud: 'You are on a short list, {CO}. I do not forget what was done.' },
    subYes: (t, E, s) => `I hold a ${t} contract for ${E} at ${s} and cannot staff it. It is on your board now: eighty-five percent of my fee, and my name stays on the paper. Do not embarrass it.`, subNo: 'Nothing I would hand to another company this week.', subCold: 'I do not pass work to companies I cannot vouch for.',
    jYes: 'Agreed. Thirty percent, and Cobalt flies on your lead. I will hold you to the brief as written.', jRival: 'As it happens, I was offered the other side of that contract. I had not signed. Now I will not. Thirty percent, on your lead.', jNo: 'We have not earned that from each other yet. Ask me again when we have.', jType: 'That is not work for two lances.', jCold: 'Cobalt does not fly beside a company it cannot trust. Mend that first.',
    gift: 'Reparations, paid to her wounded', giftYes: 'It is not the money. It is that you thought to. Noted, {CO}.', bye: 'Cobalt out.',
  },
  car: {
    hi: ['{CO}! My favourite co-stars. To what do I owe the pleasure?', '{CO}! Calling the Carnival? You must want something. How delicious.', 'Oh. It is you. I am in the middle of hating you — make it quick.'],
    stand: { allied: 'Darling, we are a double act. The sector simply has not noticed yet.', friendly: 'I like you! You have timing.', wary: 'You are in the chorus. Do something memorable and we shall see.', 'bad blood': 'You have been a terrible audience.', feud: 'You are the villain of my next three shows. I have written songs about it.' },
    subYes: (t, E, s) => `I am double-booked, would you believe. There is a ${t} for ${E} at ${s} that I simply cannot fit in. It is yours — eighty-five percent, and do try to make it look good.`, subNo: 'Hand you one of my shows? Not this week. I am using all of them.', subCold: 'Work? For you? I would sooner cancel the tour.',
    jYes: 'A double bill! Thirty percent and second billing — for you, I will bear it. We open at your signal.', jRival: 'Oh, you sly thing. I was going to turn up there anyway — on the other side. This is better. Thirty percent!', jNo: 'For that? Darling, it is a matinee. Bring me something with a little danger in it.', jType: 'There is no audience for that sort of work.', jCold: 'Share a bill with you? After everything? Absolutely not.',
    gift: 'A crate of the good stuff, and a public apology', giftYes: 'An apology! In public! Oh, do it again. ...Very well. A little forgiven.', bye: 'Ta!',
  },
  ver: {
    hi: ['{CO}. Always a pleasure doing business, love. What have you got for me?', 'Jackdaw. If this is about money, keep talking.', 'You have a nerve, calling here. This had better be worth something.'],
    stand: { allied: 'You pay, you share, and you do not shoot at me. That makes you my favourite, love.', friendly: 'We have done good business. Long may it last.', wary: 'You are a name on a board. Nothing wrong with that.', 'bad blood': 'You have cost me money. I keep a list.', feud: 'Top of the list, you are. In red.' },
    subYes: (t, E, s) => `Funny you should ask. I have a ${t} for ${E} at ${s} that is more shooting than salvage. Not my sort of thing. It is on your board — eighty-five percent, and I keep the finder’s fee.`, subNo: 'Nothing going spare. I am not a charity, love.', subCold: 'I do not hand paper to people who cost me money.',
    jYes: 'Thirty percent for following you about and picking up after? Done. Do not expect me to go first.', jRival: 'Ha. I had an offer to be there on the other side. Yours pays better. Thirty percent, done.', jNo: '', jType: 'No salvage in that worth two crews. Pass.', jCold: 'Fly beside you? I would spend the whole job watching my back. No.',
    gift: 'Money. Just money', giftYes: 'There. Was that so hard? Consider it a start.', bye: 'Mind how you go.',
  },
};
function talkRival(k) {
  if (!RIV[k]) return; const V = RIV[k], ch = V.ch, R = CO.riv[k], T = RIV_TALK[k], c = CO.sel, cost = 12000, close = [['Close channel', dlgClose]], back = [['Something else', () => talk()], ...close]; showContact(ch);
  const said = (line, o = back) => dlg(ch, line, o, null);
  const work = () => {
    R.ask = now(); if (R.rel < -15) return said(T.subCold); if (CO.board.some(o => o.cok === 'sub')) return said('You already have a subcontract on your board. One at a time.');
    if (Math.random() > clamp(.45 + R.rel / 90, .15, .95)) return said(T.subNo);
    let o = pick(CO.board.filter(o => o !== CO.active && !o.co && !o.story && !o.talked)); if (!o) { o = genContract(); CO.board.push(o); } rivCo(o, k, 'sub'); CO.sel = o; HQV.tab = 'board'; saveCO(); said(T.subYes(TYPES[o.type].name.toLowerCase(), FAC[o.emp].short, o.site));
  };
  const joint = () => {
    if (R.rel < -15) return said(T.jCold); if (!['strike', 'garrison', 'escort', 'headhunt'].includes(c.type)) return said(T.jType);
    if (!(k === 'cob' ? R.rel >= 10 : k === 'car' ? c.diff >= 3 || R.rel >= 20 : true)) return said(T.jNo);
    const was = c.rival === k; rivCo(c, k, 'joint', .3); HQV.tab = 'board'; saveCO(); said(was ? T.jRival : T.jYes);
  };
  const gift = () => { if (!spend(cost, 'gift')) return said('Come back when the gesture would not bounce.'); tal('q.gift'); R.gift = now(); rivRel(k, k === 'ver' ? 9 : k === 'car' ? 8 : 7, 'a peace offering'); saveCO(); said(T.giftYes); };
  const talk = () => {
    const w = relWord(R.rel), askH = Math.ceil(24 - (now() - R.ask)), giftH = Math.ceil(48 - (now() - R.gift));
    dlg(ch, T.hi[R.rel > 15 ? 0 : R.rel > -15 ? 1 : 2], [
      ['Where do we stand?', () => said(T.stand[w] + (R.log.length ? `\n\n(${w.toUpperCase()} ${sdNum(R.rel)} — last change: ${R.log[0][2]}, ${sdNum(R.log[0][1])}.)` : `\n\n(${w.toUpperCase()} ${sdNum(R.rel)}.)`))],
      [askH > 0 ? `Any work you cannot cover? (asked — try again in ${askH} h)` : 'Any work you cannot cover?', work, askH > 0],
      [!c ? 'Propose a joint operation (select a contract first)' : c.co ? `The ${c.site} job already involves a company` : c.story ? 'Propose a joint operation (not on that one — it is ours)' : c === CO.active ? `Bring them in on the ${c.site} job — 30% of the fee` : `Fly the ${c.site} job together — 30% of the fee`, joint, !c || !!c.co || !!c.story],
      [R.rel >= 20 ? 'Make amends (nothing to mend)' : giftH > 0 ? `Make amends (too soon — ${giftH} h)` : `Make amends: ${T.gift.toLowerCase()} — ${fmt(cost)}`, gift, R.rel >= 20 || giftH > 0],
      ['Close channel', dlgClose]], null);
  };
  talk();
}
/* ---- panels ---- */
const pipStr = n => '◆'.repeat(n) + '◇'.repeat(5 - n);
/* the people in a room are a row of buttons along the bottom of it (.tkb: #hqBar, #barBar). What one of them has for you rides the top edge of their button, in a <u> */
function talkChip(b, text, cls = '') { const u = b && b.querySelector('u'); if (u && (u.textContent !== text || u.className !== cls)) { u.textContent = text; u.className = cls; } }
function renderHangarContract() {
  const c = CO.active; $('ctr').innerHTML = c ? `${c.story ? 'STORY' : 'CONTRACT'} <b>${(c.story ? c.title : TYPES[c.type].name).toUpperCase()} — ${c.site.toUpperCase()}</b><br>${BIOMES[c.biome].name} · ${c.story && STORY[c.story].forS || FAC[c.emp].short} · <span class="pips">${pipStr(c.diff)}</span> · ${fmt(c.pay)}${c.cap ? ` · <span style="color:var(--am)">LIMIT ${c.cap} T</span>` : ''}${wingRec(c) ? ` · <span style="color:var(--${CO.wing ? 'ok' : 'hot'})">${CO.wing ? 'WINGMAN ABOARD' : 'WINGMAN RECOMMENDED'}</span>` : ''}` : 'NO CONTRACT — <b>PROVING GROUNDS</b><br>Visit the command deck to sign one.';
  deployLabel();
}
function renderDetail() {
  if (HQV.tab === 'stand') return renderStandDetail();
  const c = CO.sel, el = $('detail'); if (!c) { el.innerHTML = '<h2>CONTRACT DETAIL <small>NONE SELECTED</small></h2><p>Select an offer on the board, or a marker on the map table.</p>'; return; }
  const dsc0 = el.querySelector('.dsc'), dscTop = dsc0 && HQV.dc === c ? dsc0.scrollTop : 0; HQV.dc = c;
  if (c.story) storyDetail(c, el); else contractDetail(c, el);
  /* the text scrolls in .dsc and the buttons stay under it: keep its place through the redraws */
  el.scrollTop = 0; const dsc1 = el.querySelector('.dsc'); if (dsc1) dsc1.scrollTop = dscTop;
}
function contractDetail(c, el) {
  const T = TYPES[c.type], B = BIOMES[c.biome], m = B.wx[c.mood] || B.wx[0], h = Math.max(0, c.exp - now()), act = c === CO.active;
  el.innerHTML = `<h2>CONTRACT DETAIL <small>OP. ${c.op}</small></h2><div class="dsc"><h3>${T.name.toUpperCase()} — ${c.site.toUpperCase()}</h3><div class="sub">${T.desc}</div>
<div class="kv">CLIENT <b style="color:${FAC[c.emp].col}">${FAC[c.emp].name}</b></div>${c.co && RIV[c.co] ? `<div class="kv">${c.cok === 'sub' ? 'PRIME CONTRACTOR' : 'FLYING WITH'} <b style="color:${RIV[c.co].col}">${RIV[c.co].name}${c.share ? ` · ${Math.round(c.share * 100)}% SHARE` : ''}</b></div>` : ''}<div class="kv">OPPOSITION <b style="color:${FAC[c.foe].col}">${FAC[c.foe].name}</b></div><div class="kv">THEATRE <b style="color:${B.css}">${B.name}</b></div><div class="kv">CONDITIONS <b class="tod ${todKey(c.biome, c.mood, c.tod)}">${skyOf(c.biome, c.mood, c.tod)}</b></div>
<div class="kv">THREAT <b class="pips">${pipStr(c.diff)}</b></div>${capKv(c)}<div class="kv">FEE <b>${fmt(c.pay)}</b></div><div class="kv">SALVAGE <b>${c.salv}%</b></div><div class="kv">SUPPORT <b>${c.support ? 'REPAIR DROP' : 'NONE'}</b></div><div class="kv">${act ? 'STATUS' : 'OFFER CLOSES IN'} <b>${act ? 'ACCEPTED' : h.toFixed(0) + ' h'}</b></div>
<p>${c.brief}</p><p class="nt">${B.note}</p>${c.intel.map(i => `<div class="intel${i.src === 'contact' || i.src === 'bar' ? ' q' : ''}">${i.src === 'contact' ? 'CLIENT CLAIMS' : i.src === 'bar' ? 'BAR TALK' : i.src === 'terms' ? 'TERMS' : 'CONFIRMED'} — ${i.s}</div>`).join('')}</div>
<div class="dact"><div class="row"><button id="dNeg">OPEN CHANNEL — ${dealer(c).name.toUpperCase()}</button></div><div class="row"><button id="dAcc">${act ? 'ABANDON CONTRACT' : 'ACCEPT AS OFFERED'}</button><button id="dGo">TO THE MECH BAY ▶</button></div></div>`;
  $('dNeg').onclick = () => { sfx.play('ui'); talkContact(c); }; $('dGo').onclick = toBay;
  $('dAcc').onclick = () => { if (act) { CO.active = null; quitCost(c); news(`${YARD.name} walked away from the ${FAC[c.emp].short} job at ${c.site}.`); sfx.play('deny'); } else accept(c); CO.dirty = true; };
}
function renderBoard() {
  for (const b of $('hqTabs').children) b.classList.toggle('on', b.dataset.t === HQV.tab); $('cards').classList.toggle('hid', HQV.tab !== 'board'); $('stand').classList.toggle('hid', HQV.tab !== 'stand'); if (HQV.tab === 'stand') renderStand();
  $('cards').innerHTML = '';
  for (const c of [...CO.board.filter(c => c.story && STORY[c.story].main), ...CO.board.filter(c => c.story && !STORY[c.story].main), ...CO.board.filter(c => !c.story)]) {
    const d = document.createElement('div'), T = TYPES[c.type], B = BIOMES[c.biome], h = c.exp - now(); d.className = 'card' + (c === CO.sel ? ' on' : '') + (c === CO.active ? ' act' : '') + (c.story ? ' stc' : '');
    if (c.story) { d.style.setProperty('--sc', STORY[c.story].col); d.innerHTML = storyCard(c, h); } else d.innerHTML = `<span class="tg" style="color:${FAC[c.emp].col}">${T.tag}</span><b>${T.name} · ${c.site}</b><em>${fmt(c.pay)}</em><small>${FAC[c.emp].short} ▸ ${FAC[c.foe].short} · <span style="color:${B.css}">${B.name}</span> ${todTag(c)}</small><i class="pips" title="Threat ${c.diff} of 5">${pipStr(c.diff)}</i>${capTag(c)}<u${c.co && RIV[c.co] && c !== CO.active ? ` style="color:${RIV[c.co].col}"` : ''}>${c === CO.active ? 'ACCEPTED' : c.co && RIV[c.co] ? (c.cok === 'sub' ? 'VIA ' : 'WITH ') + RIV[c.co].short : c.upd || (h < 6 ? 'CLOSING' : '')}</u>`;
    d.onclick = () => { sfx.play('ui'); CO.sel = c; CO.dirty = true; }; $('cards').appendChild(d);
  }
  if (tutLock()) $('cards').insertAdjacentHTML('beforeend', '<div class="tlk"><b>NO OTHER OFFERS</b>The brokers will not write paper for a company whose only machine is announcing a student driver on an open channel. Fly the shakedown, and the board opens.</div>');
  renderDetail(); renderHangarContract();
  const host = $('tags'); host.innerHTML = ''; HQ.tagL = [];
  const mk = (cls, html, col, fn, obj) => { const d = document.createElement('div'); d.className = 'tag ' + cls; d.innerHTML = `<span>${html}</span>`; d.style.color = col; d.onclick = () => { sfx.play('ui'); fn(); }; host.appendChild(d); HQ.tagL.push({ d, obj }); };
  for (const p of HQ.pins) mk((p.c === CO.sel ? 'on' : '') + (p.c.story ? ' stg' : ''), p.c.story ? `★ ${STORY[p.c.story].name}` : `${TYPES[p.c.type].tag} ${pipStr(p.c.diff)}`, p.c.story ? STORY[p.c.story].col : FAC[p.c.emp].col, () => { HQV.tab = 'board'; CO.sel = p.c; CO.dirty = true; }, p.head);
  for (const [k, fn] of [['xo', talkXO], ['intel', talkIntel], ['chief', talkChief], ['p0', () => talkPilot(0)], ['p1', () => talkPilot(1)]]) mk('', HQ.P[k].ch.name.toUpperCase(), HQ.P[k].ch.col, fn, HQ.P[k].head);
}
function renderStat() {
  const h = Math.floor(CO.hour); $('hqStat').innerHTML = `<div><span>FUNDS</span><b>${fmt(CO.cb)}</b></div><div><span>SECTOR TIME</span><b>DAY ${CO.day} · ${String(h).padStart(2, '0')}:${String(Math.floor((CO.hour - h) * 6) * 10).padStart(2, '0')}</b></div><div><span>RECORD</span><b>${CO.done} WON · ${CO.fails} LOST</b></div><div><span>KITS · WING</span><b>${CO.kit} · ${CO.wing ? CO.wing.ch.first.toUpperCase() : 'SOLO'}</b></div>`;
  PILOTS.forEach((p, i) => { const on = CO.wing && CO.wing.p === p, out = p.until > now(); talkChip($('bP' + i), on ? 'ON YOUR WING' : out ? 'MED BAY' : '', on ? 'ok' : 'dim'); });
}
function updateHQ(dt, t) {
  HQ.holo.rotation.y += dt * .04; HQ.sweep.rotation.y -= dt * .9; HQ.moon.rotation.y += dt * .25; HQ.rim.emissiveIntensity = 1.4 + Math.sin(t * 2) * .4; HQ.drawScr(dt, t); if (HQ.mini) { HQ.mini.root.rotation.y += dt * .4; HQ.mini.update(dt); }
  if (CO.dirty) { CO.dirty = false; HQ.syncPins(); renderBoard(); renderStat(); HQ.drawWall(); }
  if ((HQ.clk = (HQ.clk || 0) - dt) < 0) { HQ.clk = 1; renderStat(); if ((HQ.clk2 = (HQ.clk2 || 0) + 1) % 5 === 0 && !dlgCur) renderDetail(); }
  for (const p of HQ.pins) { const sel = p.c === CO.sel, act = p.c === CO.active; p.head.rotation.y += dt * 2; p.head.scale.setScalar(sel ? 1.8 + Math.sin(t * 6) * .3 : act ? 1.4 : 1); p.ring.visible = sel || act; p.ring.scale.setScalar(1 + (t * 1.1 % 1) * 1.8); }
  if (dlgCur) { dlgCur.t += dt; const n = Math.floor(dlgCur.t * 95); $('dlgTxt').textContent = dlgCur.text.slice(0, n); HQ.speaking = n < dlgCur.text.length || vox.busy(); } else HQ.speaking = false;
  HUM.holo.uniforms.uT.value = t; HUM.holo.uniforms.uOp.value = .9 + Math.sin(t * 31) * .08 + (Math.random() < .04 ? -.45 : 0);
  const W = HQ.crowd; W.cam.copy(HQ.camera.position); W.talk = HQ.talk; W.speaking = HQ.speaking; W.update(dt);
  HQ.fill.position.copy(HQ.camera.position); HQ.fill.position.y += .35; HQ.fill.intensity = damp(HQ.fill.intensity, HQ.talk && !HQ.talk.holo ? 15 : 0, 4, dt);   /* a soft key from the camera so whoever is speaking can be seen */
  let near = HQ.doorHold; for (const p of W.list) if (p.g.visible && Math.abs(p.g.position.x - 10.6) < 1.3 && p.g.position.z < -7.9) near = true;
  HQ.doorK = damp(HQ.doorK, near ? 1 : 0, 5, dt); HQ.door.position.y = 1.29 + HQ.doorK * 2.62; HQ.seat.rotation.y = HQ.opSeat.seat ? HQ.opSeat.yaw : damp(HQ.seat.rotation.y, -Z + .6, 3, dt);
  const f = hq.focus, sp = Math.sin(hq.ph); if (f) { hq.pos.copy(f.pos); hq.look.copy(f.look); } else { hq.look.set(0, 1.5, 0); hq.pos.set(clamp(hq.r * sp * Math.sin(hq.th), -12, 12), clamp(1.5 + hq.r * Math.cos(hq.ph), 1.3, 6.7), clamp(hq.r * sp * Math.cos(hq.th), -9, 9.2)); }
  hq.cPos.lerp(hq.pos, 1 - Math.exp(-3.5 * dt)); hq.cLook.lerp(hq.look, 1 - Math.exp(-4 * dt)); HQ.camera.position.copy(hq.cPos); HQ.camera.lookAt(hq.cLook); HQ.camera.updateMatrixWorld();
  /* the labels over the table and the crew: where two would sit on top of each other the later one is lifted clear, so no contract's threat rating is ever behind another label */
  const tl = HQ.tagL || []; for (let i = 0; i < tl.length; i++) {
    const g = tl[i]; g.obj.getWorldPosition(_v); _v.y += .3; _v.project(HQ.camera); const vis = g.vis = !dlgCur && _v.z < 1 && Math.abs(_v.x) < 1.05 && Math.abs(_v.y) < 1.05; g.d.style.display = vis ? '' : 'none'; if (!vis) continue;
    g.x = (_v.x * .5 + .5) * innerWidth; g.y = (-_v.y * .5 + .5) * innerHeight; if (!g.w) g.w = g.d.offsetWidth || 60;
    for (let n = 0; n < 6; n++) { let hit = false; for (let j = 0; j < i; j++) { const o = tl[j]; if (o.vis && Math.abs(o.x - g.x) < (o.w + g.w) / 2 + 3 && Math.abs(o.y - g.y) < 19) { g.y = o.y - 19; hit = true; } } if (!hit) break; }
    g.d.style.left = g.x + 'px'; g.d.style.top = g.y + 'px';
  }
}
/* ---- moving between the bay and the deck ---- */
const blackout = on => $('fade').style.background = on ? '#000' : '';
function showHQ() { mode = 'hq'; $('hangarUI').classList.add('hid'); $('fieldUI').classList.add('hid'); $('hqUI').classList.remove('hid'); focusOn(null); HQ.setMini(); CO.dirty = true; }
async function toHQ() {
  if (busy || mode !== 'hangar') return; busy = true; refreshUI(); sfx.play('servo'); for (const id of ['panelL', 'panelR', 'hint', 'status']) $(id).classList.add('hid');
  orb.cine = true; orb.pos.set(0, 21.5, 36); orb.look.set(0, 23.2, 62); blackout(true); await wait(1.1); await tween(.6, fade); showHQ(); hq.cPos.set(0, 3.4, -8.6); hq.cLook.set(0, 1.6, 0); await tween(.8, k => fade(1 - k)); blackout(false); busy = false;
}
async function toBay() {
  if (mode !== 'hq' || busy) return; busy = true; dlgClose(); sfx.play('servoDn'); HQ.doorHold = true; hq.focus = { pos: V3(10.6, 1.75, -6.6), look: V3(10.6, 1.55, -12) }; blackout(true); await wait(.9); await tween(.6, fade);
  HQ.doorHold = false; mode = 'hangar'; $('hqUI').classList.add('hid'); $('hangarUI').classList.remove('hid'); for (const id of ['panelL', 'panelR', 'hint', 'status']) $(id).classList.remove('hid');
  orb.cine = false; orb.idle = 0; orb.cPos.set(0, 21.5, 44); orb.cLook.set(0, 14, 0); busy = false; refreshUI(); renderHangarContract(); setStatus(CO.active ? `CONTRACT SIGNED — ${CO.active.site.toUpperCase()} · FIT OUT AND LAUNCH` : 'STAND READY — ' + mechName);
  await tween(.8, k => fade(1 - k)); blackout(false);
}
{
  const cv = $('gl'), rc = new THREE.Raycaster(), m2 = new THREE.Vector2(); let btn = -1, px = 0, py = 0, moved = 0;
  cv.addEventListener('pointerdown', e => { if (mode !== 'hq') return; btn = e.button; px = e.clientX; py = e.clientY; moved = 0; });
  cv.addEventListener('pointermove', e => { if (mode !== 'hq' || btn < 0) return; const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; moved += Math.abs(dx) + Math.abs(dy); if (hq.focus) return; hq.th -= dx * .005; hq.ph = clamp(hq.ph - dy * .004, .7, 1.42); });
  cv.addEventListener('pointerup', e => {
    if (mode !== 'hq') return; btn = -1; if (moved > 6 || dlgCur) return; m2.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); rc.setFromCamera(m2, HQ.camera);
    const h = rc.intersectObjects(HQ.people.filter(p => p.g.visible).map(p => p.hit))[0], k = h && Object.keys(HQ.P).find(k => HQ.P[k] === h.object.userData.p); if (h && !k && h.object.userData.p.staff) { sfx.play('ui'); talkStaff(h.object.userData.p); } if (k) { sfx.play('ui'); ({ xo: talkXO, intel: talkIntel, chief: talkChief, p0: () => talkPilot(0), p1: () => talkPilot(1) })[k](); }
  });
  cv.addEventListener('wheel', e => { if (mode !== 'hq' || hq.focus) return; e.preventDefault(); hq.r = clamp(hq.r * (1 + Math.sign(e.deltaY) * .07), 5.5, 11.5); }, { passive: false });
  addEventListener('keydown', e => { if ((mode !== 'hq' && mode !== 'bar' && mode !== 'brief') || !dlgCur || uiModal()) return; if (mode === 'brief') return brfKey(e); if (e.code === 'Escape') return dlgClose(); const b = e.code.startsWith('Digit') && $('dlgOpts').children[+e.code[5] - 1]; if (b && !b.disabled) b.click(); });
  for (const b of $('hqTabs').children) b.onclick = () => { sfx.play('ui'); HQV.tab = b.dataset.t; CO.dirty = true; };
  $('btnToBay').onclick = toBay; $('btnHQ').onclick = toHQ; $('bMkt').onclick = () => { sfx.play('ui'); storesOpen({ mode: 'shop' }); }; $('bSet').onclick = () => { sfx.play('ui'); settingsOpen(); };
  for (const [id, fn] of [['bXO', talkXO], ['bIntel', talkIntel], ['bChief', talkChief], ['bP0', () => talkPilot(0)], ['bP1', () => talkPilot(1)]]) $(id).onclick = () => { sfx.play('ui'); fn(); };
  renderHangarContract();
}

