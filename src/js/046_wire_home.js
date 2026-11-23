/* ============ THE WIRE HOME: WHAT IS NEW, THE LAUNCH COUNT, AND THE FEEDBACK BOX ============ */
/* WHATS is the game's changelog, newest first: { n, d, t, l }. n only ever goes up, and the newest n is the build number (BUILD), which is what the page tells the server it is.
   A change a player would notice gets an entry here, in the commit that makes it. What a browser has already been shown is stompymechs.seen (the n of the newest entry it has
   read): whatsFresh() is what is newer than that, and it is what puts the NEW marker on every SETTINGS button and the chip at the top of the page (425_feedback.js draws both).
   Somebody opening the game for the first time has nothing to catch up on; somebody with a company from before any of this was kept is shown the newest entry. */
const WHATS = [
  { n: 13, d: '23 NOV 2026', t: 'THE DEBRIEF, ONE VOICE AT A TIME', l: [
    'In the debriefing room the crew now have their say one at a time, at the top left: a head comes up, says its piece and fades for the next, instead of a column of them down each side. Rest the pointer on one to keep it there; click it to move on.',
    'CLAIM THE SALVAGE is a button of its own at the foot of the room, above the lifts, where it cannot be missed. It goes once the salvage is tagged. SEE THE MARKET is there with it when the market has turned over.'] },
  { n: 12, d: '22 NOV 2026', t: 'THE DEBRIEFING ROOM, AND A WAY TO ANSWER BACK', l: [
    'A sortie now ends in the debriefing room. How it went, the books, your standing and the figures for the sortie are on the wall, and the crew say their pieces round it all at once: nothing to click through.',
    'WHAT DID YOU WISH YOU COULD DO ON THAT CONTRACT? Asked at every debrief, and under SETTINGS · WHAT\'S NEW at any time. Whatever you type goes to the developer.',
    'This page. A NEW marker on SETTINGS, and a chip at the top of the screen, say when something has changed since you last played.',
    'There is a tip jar on the counter of the Last Round.'] },
  { n: 11, d: '21 NOV 2026', t: 'EASIER ON THE EYES', l: [
    'The floors of the bay, the deck and the bar no longer mirror the lights.',
    'City glass no longer flares white at night under a searchlight or your own fire.',
    'Every room has the same frame: its panels down the right with the way out at the foot, and the people who will talk along the bottom.'] },
  { n: 10, d: '21 NOV 2026', t: 'TWELVE MORE STORIES', l: [
    'Twelve new story threads of two chapters each: a plough-train with nobody aboard, a wedding where no guest may die, a train robbery, a works that has built unattended for eleven years, duels to first blood, and seven more.',
    'Four stories are under way at once. Closing one opens the ones behind it.'] },
  { n: 9, d: '21 NOV 2026', t: 'THE RECORD', l: [
    'Everything a company does is counted, from accuracy weapon by weapon to steps taken: some two hundred lines.',
    'A board in the bay, on the deck and behind the bar shows a few lines at a time. The whole book is under SETTINGS · STATS.'] },
  { n: 8, d: '21 NOV 2026', t: 'FALSE DAWN', l: [
    'A campaign: eight chapters in three acts that change the rest of the game as they go.',
    'Contracts are flown at an hour: dawn, day, dusk or night.',
    'A mech dealer in the stores sells whole machines.',
    'The board is a spread of difficulties, and the capital ships can be beaten.'] },
  { n: 7, d: '15 NOV 2026', t: 'A SORTIE IS NOT LOST BY ACCIDENT', l: [
    'The page asks before it is left in the middle of a sortie, and Back pauses instead of leaving.',
    'H has to be pressed twice to abandon a contract.'] },
  { n: 6, d: '15 NOV 2026', t: 'A NAME AND AN OPENING', l: [
    `The game is ${GAME_NAME}, and opens with eleven seconds of battle and its title.`,
    'Old IRONWORKS companies and settings come across by themselves.'] },
  { n: 5, d: '15 NOV 2026', t: 'THE FIRST DAY', l: [
    'A new company is shown round each room by its crew.',
    'A first sortie, the shakedown, teaches the controls before anybody will hire you.'] },
  { n: 4, d: '15 NOV 2026', t: 'MORE IRON', l: [
    'More machines and many more weapons, in families.',
    'Component damage: aim at an arm or the legs and shoot them off. It happens to you as well.',
    'Some contracts carry a weight limit.'] },
  { n: 3, d: '14 NOV 2026', t: 'HEAT, AND THE DERBY', l: [
    'A sprint costs heat, and the HUD warns at 80 percent from any source.',
    'The Derby keeps its field within reach until the last gate, and then lets it go.',
    'A paused sortie holds its picture instead of drawing it again and again.'] },
  { n: 2, d: '14 NOV 2026', t: 'STORIES, COMPANIES AND VOICES', l: [
    'Story missions, a briefing room, bigger theatres and a camera that goes to whoever is speaking.',
    'Three rival mech companies, standing with them and with the factions, and comms that hold the sortie while you read.',
    'Everybody speaks aloud. The bar opened: rumours, pilots for hire, two contests.'] },
  { n: 1, d: '12 NOV 2026', t: 'FIRST LAUNCH', l: ['A mech bay, a command deck, contracts and the field.'] },
];
const BUILD = WHATS[0].n;
const WNEW = { seen: 0 };
{
  const s = +lsGet('seen');
  /* nothing kept: a browser new to the game has read it all, and one with a company from before this was kept is owed the newest entry */
  WNEW.seen = s > 0 ? Math.min(s | 0, BUILD) : lsGet('co') ? BUILD - 1 : BUILD; if (!(s > 0) && WNEW.seen === BUILD) lsSet('seen', String(BUILD));
}
const whatsFresh = () => WHATS.filter(w => w.n > WNEW.seen);
function whatsSeen() { if (WNEW.seen === BUILD) return false; WNEW.seen = BUILD; lsSet('seen', String(BUILD)); return true; }

/* ---- the server beside the page (server/stompymechs_api.py, behind nginx at api/). It is told two things, and nothing else ever leaves the browser:
   · that the page was opened, with a random id this browser made up for itself (stompymechs.vid), so that people can be counted and the ones who come back told from the new.
     CFG.count turns that off (SETTINGS · WHAT'S NEW);
   · what a player typed into the feedback box and sent. If the server cannot be reached it is kept here (stompymechs.fbq) and sent the next time the page opens.
   Neither may ever get in the game's way: every failure is swallowed. NET.off stops all of it (the debug build sets it, so the test drivers never count as players;
   debug.html?net turns it back on) ---- */
const NET = { off: false, base: 'api/', busy: false };
function netId() {
  let v = lsGet('vid'); if (v && /^[0-9a-f]{32}$/.test(v)) return v;
  const b = new Uint8Array(16); try { crypto.getRandomValues(b); } catch (e) { for (let i = 0; i < 16; i++) b[i] = (Math.random() * 256) | 0; }
  v = [...b].map(x => x.toString(16).padStart(2, '0')).join(''); lsSet('vid', v); return v;
}
/* true if the server took it */
async function netPost(path, body) {
  if (NET.off) return false; const ac = typeof AbortController === 'function' ? new AbortController() : null, t = ac && setTimeout(() => ac.abort(), 9000);
  try { const r = await fetch(NET.base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true, credentials: 'omit', cache: 'no-store', signal: ac ? ac.signal : undefined }); return r.ok; }
  catch (e) { return false; } finally { clearTimeout(t); }
}
const netQueue = () => { try { const q = JSON.parse(lsGet('fbq') || '[]'); return Array.isArray(q) ? q.filter(m => m && typeof m.text === 'string' && m.text.length <= 4000 && Date.now() - m.at < 45 * 864e5).slice(-6) : []; } catch (e) { return []; } };
/* send one piece of feedback: { kind: 'contract' | 'general', text, ctx }. Resolves true if it arrived, false if it is waiting here for the next launch */
async function netFeedback(m) {
  const body = { build: BUILD, kind: m.kind, text: String(m.text).slice(0, 4000), ctx: m.ctx || {} }; if (CFG.count) body.id = netId();
  if (await netPost('feedback', body)) return true;
  const q = netQueue(); q.push({ ...body, at: Date.now() }); lsSet('fbq', JSON.stringify(q.slice(-6))); return false;
}
async function netFlush() {
  if (NET.off || NET.busy) return; const q = netQueue(); if (!q.length) return; NET.busy = true;
  try { while (q.length) { const { at, ...body } = q[0]; if (!await netPost('feedback', body)) break; q.shift(); lsSet('fbq', JSON.stringify(q)); } } finally { NET.busy = false; }
}
/* the page has opened: called once, from the end of the module */
function netBoot() { if (NET.off) return; netFlush(); if (CFG.count) netPost('launch', { id: netId(), build: BUILD }); }
