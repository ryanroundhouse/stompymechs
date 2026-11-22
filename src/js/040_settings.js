/* ============ SETTINGS: kept apart from the save file, so importing a company never changes your volume or controls ============ */
/* the game's name: GAME_ID in the save file, GAME_NAME wherever it is written out, CO_DEF_NAME for a company nobody has named. Before the rebrand all three were IRONWORKS:
   lsGet reads what that left in the browser when there is nothing newer, and saveCheck still takes its files */
const GAME_ID = 'STOMPYMECHS', GAME_NAME = 'StompyMechs', CO_DEF_NAME = 'STOMPY MECHS', GAME_WAS = 'IRONWORKS';
const lsGet = k => { try { return localStorage.getItem('stompymechs.' + k) ?? localStorage.getItem('ironworks.' + k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem('stompymechs.' + k, v); } catch (e) { } };
const CFG_DEF = { vol: .8, sfx: .8, mus: .7, amb: true, radio: true, score: true, jingle: true, track: 0, voice: .8, hold: 2, sens: 1, invY: false, scale: 1, bloom: true, shadow: true, wlight: true, count: true };
const CFG = { ...CFG_DEF };
{
  try { const s = JSON.parse(lsGet('cfg') || 'null'); if (s && typeof s === 'object') { for (const k in CFG_DEF) if (typeof s[k] === typeof CFG_DEF[k]) CFG[k] = s[k]; } else if (lsGet('music') === '0') CFG.mus = 0; } catch (e) { }
  for (const k of ['vol', 'sfx', 'mus', 'voice']) CFG[k] = clamp(+CFG[k] || 0, 0, 1); CFG.hold = clamp(CFG.hold | 0, 0, 2); CFG.sens = clamp(+CFG.sens || 1, .3, 2.5); CFG.scale = clamp(+CFG.scale || 1, .5, 1.5); CFG.track = clamp(CFG.track | 0, 0, 7);
}
const cfgSave = () => lsSet('cfg', JSON.stringify(CFG));
/* the seven mission scores, in theatre order: [biome, title, liner note] */
const SCORES = [['desert', 'DUST DEVILS', 'frame drums and a plucked lead · 96 bpm'], ['urban', 'NEON RAIN', 'night-drive synths · 118 bpm'], ['forest', 'TIMBERLINE', 'harp and low drums in 6/8 · 84 bpm'], ['jungle', 'CANOPY', 'marimba three against four · 108 bpm'],
  ['glacial', 'WHITEOUT', 'slow glass and wind · 66 bpm'], ['volcanic', 'FORGE', 'half-time anvils and grit · 88 bpm'], ['lunar', 'HARD VACUUM', 'sparse pulses in 5/4 · 100 bpm']];
const scoreFor = biome => CFG.track ? CFG.track - 1 : Math.max(0, SCORES.findIndex(s => s[0] === biome));

