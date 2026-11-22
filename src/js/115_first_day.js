/* ============ FIRST DAY: WHAT A NEW COMPANY HAS BEEN SHOWN, AND WHETHER ITS BOARD IS STILL LOCKED TO THE FIRST SORTIE ============ */
/* lock: the contract board holds one card, the shakedown (the story thread marked `first`), until that has been flown and won or the tutorial has been skipped.
   hints: the crew show a new commander round each room the first time they walk into it. seen: the tours already given (TUT_KEYS, which are the keys of TOURS).
   All of it is saved with the company (saveBlob, under `tut`). A save from before any of this has no such entry, and is taken to be a company that knows its way about.
   The guide itself, and everything that draws, is in 445_guide.js: this much has to exist before the board is first dealt */
const TUT_KEYS = ['salv', 'stores', 'field', 'aar', 'launch', 'bay', 'deck', 'home', 'bar'];   /* in the order they are looked for: an overlay's tour before the room's under it */
const TUT = { lock: false, hints: false, seen: {} };
const tutLock = () => TUT.lock;
function tutApply(s) {
  const t = s && s.tut && typeof s.tut === 'object' ? s.tut : null, sn = t && t.seen && typeof t.seen === 'object' ? t.seen : {}; TUT.seen = {};
  if (!s) { TUT.lock = TUT.hints = true; return; }
  TUT.lock = !!t && t.lock === true; TUT.hints = !!t && t.hints === true;
  for (const k of TUT_KEYS) if (!t || (Object.prototype.hasOwnProperty.call(sn, k) && sn[k])) TUT.seen[k] = 1;
}
const tutSave = () => ({ lock: TUT.lock, hints: TUT.hints, seen: { ...TUT.seen } });
/* the news line a locked board opens with, and the one it is replaced by when the lock comes off */
const TUT_WIRE = () => `${YARD.name} has a hangar, a charter and one third-hand mech. Nobody is hiring yet.`, TUT_OPEN = () => `${YARD.name} mercenary company is open for contracts.`;
tutApply(BOOT);
