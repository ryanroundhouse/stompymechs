# STOMPYMECHS

(Called IRONWORKS until the rebrand. The site is https://stompymechs.graham.pub/; the deploy
script on the server, `~/update-ironworks.sh`, still carries the old name.)

A single-file three.js game: mech hangar with three build bays and a parts inventory, command deck
with contracts and a rotating market, a bar (rumours, pilots for hire, two contests), field
missions with salvage (eighteen catalogue mechs, fifty-three weapons in families, fifteen kinds of
vehicle, a centipede, factories and two capital ships, all of which can be shot apart a
component at a time), three rival mech companies that compete with you, hire you and fly
beside you, five story threads (connected chapters that come up on the board one at a time,
are briefed in a briefing room and are flown on a theatre 2.4 times the usual size) and over them
one campaign, FALSE DAWN: eight chapters in three acts that change the rest of the game as they
go. Contracts are flown at an hour (dawn, day, dusk, night), and the market sells whole machines
as well as parts. Everything a company does is counted (the record: some two hundred lines,
from accuracy weapon by weapon to steps taken), shown a few lines at a time on a board in the
bay, on the deck and behind the bar, and in full under SETTINGS · STATS. A new company
is shown round each room by its crew, and flies a first sortie that teaches the controls before
anybody will hire it. Everybody who speaks does so aloud, in a made-up language. The first time
the page is opened it plays an eleven-second opening: four cuts of battle, then the STOMPY MECHS
title, cut to its own music.
`index.html` is the whole deliverable. It loads three.js (and one add-on, `RoomEnvironment`) from
a CDN, so view it through a local web server with an internet connection. It is built from the
sources in `src/` by `build.py`; edit `src/`, never `index.html`.

## Scratch space: use `.scratch/`

- Keep every working file in `.scratch/` at the repo root: debug builds, test drivers, browser
  test profiles, screenshots, notes. It is gitignored.
- Do not use the system temp directory or a session scratchpad for this project. Those are wiped
  between sessions, and the build pipeline was lost that way once.
- `.scratch/` is never committed. On a fresh clone it will be missing; `build.py` creates it.
  Nothing needed to build the game lives there: the source is `src/`, and it is committed.

## How `index.html` is built

`index.html` is generated from `src/` and committed alongside it, so the repo always holds a
playable page. Never hand-edit it.

- `src/page.html` is the page: head, the markup, the import map and the two script
  tags, with two placeholder lines, `@@STYLE@@` (replaced by `src/style.css`) and `@@SCRIPT@@`
  (replaced by every `src/js/*.js`, joined in file-name order).
- `src/js/NNN_name.js` are fragments of ONE `<script type="module">`, not ES modules. They share
  one top-level scope: a name defined in any file is visible in every other, there are no
  `import`/`export` between them, and file-name order is execution order. Each file starts at
  one of the `/* ============ TITLE ============ */` section banners. A new file goes in at a
  number between its neighbours (`255_thing.js`); keep the gaps. Every file ends with a newline.
  Where things are: `040_settings.js` the game's name (`GAME_ID`, `GAME_NAME`, `CO_DEF_NAME`) and
  `lsGet`/`lsSet`; `115_first_day.js` what a new company has been shown (`TUT`); `117_stats.js`
  the record (`TALLY`, `tal`, `TAL_DEF`, `talRows`) and `345_stat_boards.js` the boards that
  show it (`talBoard`, `talBoards`); `020_post.js`
  the post chain `POST`; `030_gfx.js` materials and the texture kit (`std`, `hfNoise`,
  `txPanel`); `050_audio.js` `sfx` and the sound
  notice; `060_voices.js` and `070_music.js`; `080`/`090` mech parts (`ARM_FAM`, the extra
  chassis); `110_yard.js` the yard, stores, bays, `SPRINT_K`, `capFor`; `150_field_env.js`
  terrain, `fieldScale`, the sky and the hour (`TOD`, `todKey`, `todShift`, `groundTex`);
  `155_field_glow.js` everything that glows out there (`glowM`, `flashAt`, `scarAt`,
  `shockAt`); `160_field_weapons.js` the weapons engine (`emitShot`, `fire`) and
  component damage (`mechZones`, `damage`); `170_units.js` vehicles, `UNIT_POOL`, `spawn`;
  `190_mission_engine.js` comms, objectives and the comm camera (`cutWho`); `200_story_kit.js`
  the story helpers, `stLook` and `stRace`/`RACE_K`; `210_missions.js` and `240_ops.js` the
  contract types and twists; `230`/`250` the rival companies; `260_story.js` thread state, the
  board and the save; `280`-`310` people and crews; `330_bar.js`, `340_bar_games.js`;
  `350_brief.js` the briefing room; `355_thread0_shakedown.js` the first sortie; `360`-`400` the
  five threads (`stKeep` is in `400`, the Derby's `dbCall` in `390`); `402_campaign_kit.js` the
  campaign's cast and tools (`sunWar`, `sunDim`, `sunKey`, `skyLance`, `sunSweep`) and `403`-`405`
  its three acts; `415_mech_dealer.js` the dealer (`dealLot`, `dealBuy`); `445_guide.js` the room
  tours, the next-step chip and the HUD key prompts; `447_intro.js` the opening (`INTROV`,
  `INTRO_SHOTS`); `450_main.js` the main loop. `grep -l name src/js/*.js` finds
  anything else.
- `python3 build.py` writes `index.html` (release).
- `python3 build.py --debug` writes `.scratch/debug.html` with the test hooks from
  `src/debug/harness.js` (`__ev`, `__errs`, `__ff`, `__cam`, `__see`, `__strip`, `__poses`,
  `__mus`, `__render`, `__wav`, `__mk`, `__sim`, `__vox`, `__story`, `__smk`, `__sites`,
  `__fcam`, `__fsee`, `__sheet`, `__mechs`, `__parts`, `__aim`, `__arena`, `__dummy`, `__tut`,
  `__intro`, `__introSheet`).
  It also makes `music.KIT` reachable. A debug page skips the first day altogether (an open
  board, no tours, through a new game and an imported save as well), because every driver below
  expects that; load `debug.html?tut` to get what a new player gets. It never plays the opening
  unasked either (`INTROV.off`): `debug.html?intro` does. Nor does it ask before being unloaded mid-sortie
  (`SGUARD.ask`), so the drivers can navigate away: `debug.html?guard` does. Its two anchors are asserted; if one moves, fix `build.py`.
- Every build writes `.scratch/check.mjs` (the module script alone). Follow every build with
  `node --check .scratch/check.mjs`: in a module a second top-level declaration of a name is a
  syntax error, so this is what catches collisions between files. Check a new top-level name
  with `grep -n "name" src/js/*.js` before using it anyway.
- `python3 build.py --verify` fails unless `index.html` is exactly what `src/` builds. Run it
  before committing, and commit `src/` and `index.html` together.
- Do not put a `//` comment in the middle of a long one-line statement: it swallows the rest of
  the line without a syntax error. Use `/* */`, or a line of its own.
- History: before `src/` existed, each round of work was a set of asserted string patches and
  part files applied to a snapshot of the page, in `.scratch/v3/` to `.scratch/v12/` (the last
  of them built exactly what `src/` was split from). Those folders are no longer used to build
  anything, but their test drivers (`cdp.mjs`, `ff.mjs`, `run.sh` in `v8`, and the rest below)
  are still the ones to use. Old part-file names in notes map to `src/js/` like this:
  `p1_post.js` is `020_post.js`, `a1_wake.js` `050_audio.js`, `v2_cast.js` `060_voices.js`,
  `f2_scale.js` `150_field_env.js`, `m3_cut.js` `190_mission_engine.js`, `s3_kit.js` and
  `r1_race.js` `200_story_kit.js`, `s1_story.js` `260_story.js`, `s2_brief.js` and
  `m2_brief.js` `350_brief.js` (the march is in `070_music.js`), `b2_games.js`
  `340_bar_games.js`, `t1_mar.js` to `t5_maw.js` `360` to `400`, `w1_parts.js` `090`,
  `c1_combat.js` `160`, `u1_units.js` `170`, `m4_ops.js` `240`.

## Testing

- Serve the repo root: `python3 -m http.server 8765 --bind 127.0.0.1`, then open
  `http://127.0.0.1:8765/index.html`. Serve `.scratch/` on another port for `debug.html`.
- Headless checks: start Chrome with `--headless=new --remote-debugging-port=9222
  --autoplay-policy=no-user-gesture-required --user-data-dir=.scratch/chrome-profile` and drive it
  with the chrome-devtools tools, or with `node .scratch/v8/cdp.mjs` (`nav`, `eval`, `wav`,
  `shot file [scale]`). It brings the tab to the front on every call: a hidden headless tab gets
  no animation frames, so tweens and fades never finish. `nav` also turns the HTTP cache off;
  Chrome otherwise serves a stale `debug.html` after a rebuild. Module-level names are not on
  `window`, so reach them through `__ev('...')`. Clear that profile's localStorage after test runs; the game
  saves the company under `stompymechs.co`, settings under `stompymechs.cfg` and whether the
  opening has been seen under `stompymechs.intro` (and still reads `ironworks.co` and
  `ironworks.cfg` when those are all a browser has).
- Check in Firefox as well as Chrome: it is the browser the game is actually played in, and its
  Web Audio differs. Start a second, muted instance with
  `/Applications/Firefox.app/Contents/MacOS/firefox --headless --no-remote --profile
  .scratch/ff-profile --remote-debugging-port 9223` and drive it with
  `node .scratch/v8/ff.mjs run <url|-> script.js ['prelude']` (the file is an async function body;
  `shot file` takes a screenshot). The profile's `user.js` needs `media.autoplay.default` 0,
  `media.autoplay.blocking_policy` 0, `media.volume_scale` "0.0" (silent speakers, the audio graph
  still runs) and `remote.active-protocols` 1. Empty the profile except `user.js` after test runs.
  - In `.scratch/v6/`: `t_scores.js` renders every score offline and counts non-finite samples;
    `t_soak.js` plays every score through the live engine with a meter on the output; `t_nan.js`
    finds the node that first emits NaN.
  - In `.scratch/v7/`: `t_voxlive.js` has every named character say a line through the real
    engine, with meters on the voice bus and the music; `t_release.js` walks the release page
    through its real buttons (bay, deck, STANDING, a hail, the XO, bar) with the same meters.
    Both run in either browser.
  - In `.scratch/v8/`: `rel.sh [ff]` clears the save and walks the release page through the
    story path with real buttons (deck, the story card, ACCEPT, every step of the briefing, the
    bay, LAUNCH, the field) with meters on every bus; `t_fflive.js` does the same in the debug
    build for any chapter (`window.__fl = { k, ch }`).
  - The audio graph is built while the page loads, so a meter has to be in place before the
    page's own script runs. `PRELOAD=.scratch/v8/taps.js` makes `ff.mjs` and `cdp.mjs nav`
    install one (`window.__taps`); `rel.sh` sets it, and `t_release.js` and `t_fflive.js` say
    so if it is missing.
  - Both test profiles allow autoplay, which hides what a player's browser does. For that,
    `ffreal.mjs <url> steps.js` drives a Firefox with the normal policy (port 9224, profile
    `.scratch/ff-real`, the same `user.js` without the two autoplay lines) through real clicks
    and keys (`click`, `key`, `levels(secs)`, `state()`, `nav()`; the `r_*.js` files are
    scenarios), and `crreal.mjs <url> [key]` does the same in Chrome (port 9225, profile
    `.scratch/chrome-real`, no `--autoplay-policy` flag). If `ffreal.mjs` reports "Maximum
    number of active sessions", restart that Firefox.
- On a profile that has not seen it (no `stompymechs.intro`) the release page plays the opening
  before anything else, and waits for a click or a key first where the browser blocks autoplay.
  Set that key before loading, or begin it with one key press and end it with another at least
  .7 s later. Nothing of the game runs or hears a key until it is over.
- With no save, the page opens on the "found your company" screen. Close it with `#setClose`
  before driving anything else. On the release page (and `debug.html?tut`) the bay tour then
  starts and the board holds one card, the shakedown.
- The opening, in `.scratch/intro/`:
  - `__intro(seconds)` (debug build) holds it at a moment, silent; `__intro('play')` runs it,
    `__intro('end')` ends it. `sheet.sh "0.6, 1.5, 2.9" out.png [cols]` tiles held moments into
    one picture through `__introSheet` (`at.sh seconds out.png` is one of them, bars and all).
    Look at a sheet after changing any cut.
  - `live.mjs [url] "t1,t2,..."` plays `debug.html?intro` in real time and reports every cut
    (when it came, how long its first frame took), slow frames and errors, with a picture at
    each time given. `lvl.mjs` does the same with a meter on each bus and prints peak and RMS
    per half second: the score should lead (about .13 to .25 RMS), the effects sit under it,
    and the sum stay under 1. `t_cue.js` (`ev.sh`) renders the cue offline, beat by beat.
  - `t_intro.js` (`ev.sh`, `ffev.sh`; a freshly loaded debug page) plays it from SETTINGS,
    skips it with a key, plays it from the deck and the bar, and checks that everything it
    borrowed is back exactly (`snap()`), that the field refuses it, and that a sortie flies
    afterwards. `t_brand.js` covers the rename: titles, the save, an old IRONWORKS company
    coming over, `{CO}` in the conversation box and the comms.
  - `gate.mjs` (Chrome with its own autoplay policy, port 9225) and `r_intro.js` (for
    `ffreal.mjs`) are the release page as a new player gets it: the wait behind CLICK OR PRESS
    ANY KEY, the click, eleven seconds with sound, a second load that must not play it, and a
    skip.
- The first day, in `.scratch/v13/` (`c.sh` and `f.sh` are `cdp.mjs` and `ff.mjs` from anywhere):
  - `shake.sh '{ arm, slow, stand, nofire, skip, until, log }'` flies the shakedown through the
    real controls (W, A, D, S, SHIFT and SPACE held in `keys`, the torso aimed with `__aim`, both
    triggers) and prints when each lesson was passed, the least armour, the most heat and the
    books. `slow` is seconds of dithering before each new target, `stand` never backs away from
    the saw, `nofire` never shoots in the fight (that pilot should last a minute and a half and
    then lose), `arm` goes for the extra credit, `skip` answers "straight to the examination".
    `f.sh run http://127.0.0.1:8766/debug.html .scratch/v13/t_shake.js 'window.__sk = {}'` is
    the same in Firefox. A pilot who never misses takes about a minute and three quarters of
    sortie time; nobody should need a second try at the Table.
  - `t_relwalk.js` (an async function body: `c.sh eval "(async () => { $(cat ...) })()"`, or
    `f.sh run`) walks the release page from a clean save through the real buttons: charter, bay
    tour, deck tour, the card, ACCEPT, the briefing, LAUNCH (and the opening first, with two
    presses of SPACE, when the profile has not seen it), and with `window.__more = 1`
    ENGAGE (twice: headless refuses pointer lock) and SPACE through the first comms. That last
    leaves the release page in a sortie, where the guard asks before the page is left: the next
    `nav` then hangs the tab with nobody to answer, and every `eval` after it. Close the tab
    (`curl http://127.0.0.1:$CDP_PORT/json/close/<id>`, then `curl -X PUT .../json/new?about:blank`)
    before driving anything else.
  - `t_after.js` (on `debug.html?tut`, clean save) flies it with the story autopilot and comes
    home through the real debrief: books, the salvage picker and its tour, the epilogue, the
    board opening, the `home` tour. `step.js` (`ACTS` replaced by a list of `'next'`, `'#id'`
    and milliseconds) clicks through a tour and reports each step's text and ring.
  - `t_tsave.js` (on `debug.html?tut`, clean save) takes `tut` through the save: a fresh
    company, an old save with no `tut`, hostile values, a save made half-way, a lost shakedown
    coming straight back, the skip button, the tours again, a new game.
- Headless Chrome refuses pointer lock. To run the field, call `startField()` through `__ev`, then
  set `soft = true; locked = true` and hide `#pause`. Re-locking after the map (`M`) therefore
  only shows its fallback headlessly; check it in a real browser.
- `__mk(type, plot, o)` does all of that for a contract made to order and returns it: `o` is
  merged into the contract, so `{ twists: ['rival'], rival: 'cob' }` books a company against you
  and `{ co: 'car', cok: 'joint' }` or `{ co: 'ver', cok: 'sub' }` one beside or above you.
  `await __sim(seconds, pick, { each, stop, mortal })` then steps the sortie without waiting,
  answers every comm with `pick(comm)` (an option index), keeps the armour topped up unless
  `mortal`, and returns what was said. `t_opp.js`, `t_joint.js`, `t_race.js` (the field),
  `t_deck.js`, `t_deck2.js`, `t_bar.js`, `t_save.js`, `t_debrief.js`, `t_mouse.js` and
  `t_look.js` are async function bodies built on them: run one with
  `node .scratch/v7/cdp.mjs eval "(async () => { $(cat .scratch/v7/t_opp.js) })()"`.
  An open `.ovl` overlay (the salvage picker, say) makes `uiModal()` true and swallows the keys,
  so start field tests from a clean page.
- Story chapters: `__story(k, ch)` puts a chapter on the board, `__smk(k, ch, flags)` drops
  straight into it (flags as `{ 'mar.ram': 1 }`), `__sites()` lists where its sites landed. In
  `.scratch/v8/`:
  - `run.sh '{ k, ch, f, done, follow: "nav", secs, picks, settle: true }'` flies a chapter with
    the autopilot in `t_story.js` and prints objectives, what was said (lines that moved the
    camera are tagged `{cam who|evt: LABEL}`) and the books. `follow: 'nav'` appears beside the
    newest marker; `drive: .8` runs there at that share of top speed instead (use it for the
    races); `dps`, `mortal`, `each`, `until` and `hunt: false` are there too. `done` lists
    threads to count as finished. `ffrun.sh` is the same in Firefox.
  - `look.sh '<the same, with until>' '__fsee(thing, dist, angle, height)' out.png` flies to a
    moment, puts a free camera on something (`__fcam()` hands the view back) and takes a
    picture. `brf.sh '{ k, ch, f, n }' out.png` walks n steps of a briefing and does the same.
  - `cam.sh '{ hold, wing, cases }'` flies a spread of ordinary contracts and lists which lines
    moved the camera; `camrt.sh '{ hold, type, plot, o, secs }'` runs one in real time with
    nobody at the controls and logs line, hold and camera state.
  - `t_ssave.js` takes story state through the save: round trip, hostile files, a failed
    chapter and a lapsed offer coming round again, the three-card limit.
  The autopilot kills fast and (without `drive`) teleports, so it proves a chapter can be
  finished and says nothing about how hard it is.
- The Derby races, in `.scratch/v11/`: `race.sh '{ ch, sprint, log }'` flies a chapter through
  the real controls (W, A, D and SHIFT held in `keys`, so the machine's own speed, turning and
  heat count) and prints the place every `log` seconds, each car's gap in metres and the speed it
  is taking, the place and heat at every gate, and how much of the race the pack stayed within
  70 m. `sprint` is `heat` (off at 80 heat, back on at 50), `never`, `always`, `last` (only on
  the run to the flag), `notlast` or `smart` (under 45 heat, and all of the run to the flag);
  `cap` lets go of SHIFT above that heat whatever the mode (and takes it again 15 under it), and
  `preheat` sets the heat the pilot comes to the last gate with. `cfg` puts a `PRESETS` machine
  in the bay (slow ones need `secs: 1000`), `fight` gives the pilot that many dps on one hostile
  in front of it and `fh` charges that share of the machine's full-fire heat while it shoots,
  `go: ['liz']` sends it to a nav marker and clears it, `tweak` runs JS on the race `R` as it
  starts, and `picks`, `mortal`, `secs` and `said` work as in `run.sh`. `sweep.sh ch '<extra>'`
  flies one chapter six ways and prints a line for each; `t_cool.js` lists the cooling, speed and
  sprint from cold of the bay and every preset, and each course's final straight. `ffrace.sh` is
  the same in Firefox (`ff_race.js` is `t_derby.js` between two lines: rebuild it when that
  changes), and `see.sh '{ ..., until, keep: true }' out.png` stops at a moment with the throttle
  still down and takes a picture from the cockpit. A race should be won by sprinting from the
  last gate to the flag, and lost (or placed) by walking it or by holding SHIFT the whole way.
  In the final a shutdown on the run to the flag loses to MAGPIE; a sprint let off under the
  shutdown line still wins from about 75 heat.
- Machines, weapons and the fight, in `.scratch/v12/`. `ev.sh file.js ['prelude']` runs an async
  function body inside the module (through `__ev`), so module names need no wrapping;
  `ffev.sh` is the same in Firefox. Start each from a freshly loaded page.
  - `__arena(cfg)` is a bare proving ground with the player in a given build, `__dummy(d, cfg,
    o)` a pacified machine d metres ahead (`{ name: undefined }` makes it an ordinary pilot,
    who can eject), and `__aim(e, zone)` puts the reticle on a target or one of its parts:
    call it every step, because the chase camera sits off one shoulder and a level reticle
    passes over whatever is in front.
  - `t_weps.js` fires every weapon at a dummy and sets what it dealt against its card
    (`window.__only`, `__zone`, `__secs`). `t_zones.js` walks component damage on both sides:
    arms off (the pilot ejects), legs off, a named pilot, the player's own losses, the HUD,
    the repair kit. `t_wear.js` stands the player in a fight and reports when each part went
    against how much hull had gone by then: the back unit, the first to go, should usually
    outlast half the hull, and the legs all of it.
  - `t_units.js` builds every vehicle, lets each shoot at the player and kills it
    (`window.__sheetN = 1 | 2` draws the contact sheets instead). `t_ally.js` puts the ones
    with area weapons on our side and checks they do not hurt us.
  - `t_ops.js` flies the new contracts with a crude autopilot (`window.__ops = [[type, plot,
    o, picks, dps, secs]]`); `t_ship.js` is a capital ship against a pilot who stands by the
    depot and shoots one thing (`'hull' | 'eng' | 'gun'`) at a given rate; `t_flee.js` lets a
    beaten ship go and watches her leave. A ship should last about a minute at 45 dps on the
    hull and little more than half that through her engines, at any rating, and the depot more
    than six minutes if she is left alone. (She had half as much hull again and the depot stood
    three and a half minutes; the defence contracts could not be won.)
  - `t_board.js` deals sixty boards and counts limits, types and twists, then asks the bay
    about each limit; `t_launch.js` presses the real launch button against a limit and a job
    rated for two; `t_salv.js` goes through both salvage confirmations with real buttons;
    `t_misc.js` covers the proving ground's waves, the save round trip for a limit, and the
    stores with every part in them. `t_pic.js` (`window.__pic`) sets up a moment to look at.
  - `__sheet(items, angle, cols, pitch)`, `__mechs(cfgs)` and `__parts(cat)` tile anything
    into one screenshot. Look at every new model before calling it done.
- The story autopilot's `follow: 'nav'` stands 46 m beside the newest marker. That is the
  wrong place when the newest marker is the destination and the thing to guard is elsewhere
  (follow the escort itself: `follow: "FD.ents.find(e => /MARIGOLD/.test(e.name))"`), and too
  far to board the dropship (add `off: 12`).
- `__ff(seconds)` fast-forwards bay tweens, so crane and lift sequences (`fitPart`, `switchBay`)
  can be awaited in a loop instead of in real time. It steps whichever room is showing, the bar
  included, and `__cam` places the camera there too.
- The bar: `.scratch/v6/t_enter.sh` loads the debug build and walks in (`toBar()`);
  `t_talk.sh 'BAR.P.keep' 'BAR.pil[0]' ...` captures a conversation with each. A contest can be
  played out without waiting by calling `barGameHit()` and `barGameTick(dt, t)` in a loop.
  How hard each stake is was set with `sim_drink.py` and `sim_arm.py`, which mirror the rules in
  `src/js/340_bar_games.js`; change the two together.
- Animation is easiest to judge from contact sheets: `__strip(person, frames, dt, dist, angle)`
  and `__poses(person, [acts])` in the debug build tile many frames into one screenshot.
- Audio cannot be heard headlessly. `__mus(which, seconds, seed, track, heat)` renders a score
  offline and reports peak, RMS, band energy and beat alignment. `which` is `'night'` (the deck
  theme), `'amb'`, `'deck'` (the theme running on into the ambience), `'win'` (the jingle),
  `'brief'` (the briefing room march), `'intro'` (the opening's cue), `'radio'`, `'juke'` (the
  radio's band through the bar's jukebox) or `'field'`. For the field, `track` is 0-6 and `heat` is 0 for the patrol
  arrangement, 1 for combat, or `[[seconds, heat], ...]` to render the hand-over between them.
  Keep the tracks near 0.07-0.12 RMS with peaks under 1, and combat about 3 dB above patrol.
  The briefing march is the exception: about 0.045, because somebody talks over all of it. So
  is the opening's cue, the other way: about 0.2 with peaks to 1.4, because nothing else plays
  with it and the compressor after it is meant to be leaned on.
- Voices: `node .scratch/v7/t_vox.mjs` renders eight lines from every named voice, a dozen
  strangers and some hostile input offline, counts non-finite samples and writes WAVs to
  `.scratch/v7/wav/` for listening or `an.py`. In the page, `__vox(ch, text, fx)` reports length,
  peak, RMS and bad samples for one line. `node .scratch/v8/t_static2.mjs [wavdir]` reads the
  voice code out of `debug.html` and reports, voice by voice, how loud the breath and the
  consonant hiss are against the voice itself and what share of a line is noise. Keep the hiss
  20 dB or more under the voice and the share under 1%: louder than that it is heard as static.
- `__wav(...)` takes the same arguments, plus a list of mix buses to solo, and returns a base64
  WAV (`cdp.mjs wav` saves it). `python3 .scratch/v5/an.py file.wav` prints band levels over time
  and, with `--png`, draws a spectrogram, which is how balance and timing were checked.
  `python3 .scratch/v6/env.py file.wav` lists dips in level, for finding dropouts.
- The picture and what it costs, in `.scratch/v9/`:
  - `post.sh [ff] 'window.__tp = { scale: .7 }'` runs `t_post.js` on the room showing: it sets
    up three's own EffectComposer chain from the CDN, as the page used to have it, and compares
    it with `POST` at the same instant, every pixel. With bloom off the two must be identical;
    with it on, no channel may differ by more than one step. Run it in both browsers after any
    change to `src/js/020_post.js`.
  - `t_hold.js` (from a clean page, either browser) counts pictures drawn against frames passed
    with the sortie ready, playing, paused and under the map, and after each thing that must
    wake a held picture. `r_hold.js` is the same walk for `ffreal.mjs`, with real clicks and
    keys. Headless Firefox refuses pointer lock too, so that run goes through the free-mouse
    fallback.
  - `t_time.js` times one picture of the room showing, forced to finish with a one-pixel
    readback. It also runs in a build from before this round (`.scratch/perf/debug_v8.html`).
    Time one browser at a time with the other parked on `about:blank`: two tabs rendering share
    the GPU, and that once doubled Firefox's figures.
  - `.scratch/perf/` holds the probes from the survey that began this round: `drv.mjs` (`load`,
    `cpu`, `prof`, `audio` over CDP), `stat.js` (draw calls, triangles, what a scene holds),
    `who.js` (which drawables ever move), `gpu.js` (what each graphics setting costs).
- The hour, the dealer, the board and the campaign, in `.scratch/g/`. That round was driven
  through a Chrome of its own (`export CDP_PORT=9340`, profile `.scratch/chrome-profile-iso`;
  `cdp.mjs` and everything built on it read the port from there), started like the other.
  - `pic.sh out.png 'async body'` is a fresh debug page, a setup and a screenshot. `sky.js`
    (`window.__sk`) tiles a biome's skies at every hour, `fsheet.js` (`window.__g`) a firefight
    as a contact sheet, `close.js` six texture close-ups, `time.js` what one picture of a fight
    costs. Look at a sky sheet and a fight sheet after changing `TOD`, the sky shader or
    anything in `src/js/155_field_glow.js`, and at the opening's sheet too: its cuts are lit by
    the same code.
  - `fly.sh 'label' '<run.sh object>' ['lines to keep']` flies a chapter with the story
    autopilot and prints the verdict. The campaign's chapters are `{ k: "sun", ch: 0..7 }`, with
    `picks` for the other answers and `f` for what earlier chapters decided. Chapter VII wants
    `follow` set to the reactors, then PAX, then `MS.S.anchor`, and VIII to the ground stations
    and then the TRIBUNAL, with an `each` that puts `P.aim` on her and calls `sunCall()` while
    `MS.v.onLance` is set and `MS.v.link` is not: nav markers alone do not finish either.
  - `t_camp.js` (the card, what each act changes, the key, the save, the three endings),
    `t_camp2.js` (three chapters home through the real debrief, with their flags and prizes) and
    `t_camp3.js` (B through a key press, the interdiction on an ordinary contract, a pilot who
    stands still under the light) are `ev.sh` bodies and run in either browser. `reg.sh file.js
    ['prelude'] [url]` runs any body on a fresh page and prints only what failed.
  - In `.scratch/` itself: `t_dealer.js` is the dealer through its real buttons, `t_spread.js`
    the board's weights at each stage of a company's life, `t_real.js` and `t_int.js` contracts
    flown with the real weapons and the real legs (`ab.sh` flies them on the last commit's build
    as well, `debug_base.html`, for a before and after), `t_w.js` a table of every weapon.
- The record, in `.scratch/stats/` (`ev.sh` bodies, each from a freshly loaded debug page, in
  either browser; the last two put back the company they found):
  - `t_stats.js` is the field: fifteen kinds of weapon fired at a dummy and then at the sky
    (rounds, hits, damage against what came off the hull, nothing landing on the sky), a kill
    made the real way, one of every vehicle, structure and ship (each variant must have a name
    in `TAL_UNIT`), whose kill it was, movement through the real keys, heat to a shutdown,
    damage taken, and a wingman's fire staying off the player's accuracy. It ends by listing
    anything counted that no line shows. `window.__part` is `weps`, `kills`, `move`, `heat` or
    `hurt`; `window.__only` a list of arm ids.
  - `t_stats2.js` is a contract flown and settled against the books, the save (round trip, an
    old save, hostile files, a name out of a save on the screen), a new game, an import, the
    three boards ticked for a minute each, and the STATS tab through its search box and chips.
  - `t_stats3.js` is every counter that hangs off a button or a key: the bay, the market, the
    dealer, the deck, the bar and a contest, the field keys, a wave, a briefing.
  - `fill.js` loads a record worth looking at, for a screenshot of a board or the tab.
  - `.scratch/intro/t_intro.js` has the record in its `snap()`: the opening must count nothing.
    In headless Chrome its "the title is up at 7.8 s" from the deck fails (shot 2), and did
    before the record existed; Firefox passes it.
- Release builds must contain no `window.__` hooks.

## Conventions

- Everything lives in one `<script type="module">`, split across `src/js/` but still one scope.
  Top-level names are shared across every file, so new helpers need distinctive names;
  `node --check .scratch/check.mjs` catches collisions.
- People are built by `Human` from a seeded `lookOf(seed)`. Crew portraits (`drawFace`) use the
  same seeded draws, so keep the two in step when changing either. A seed's draws are blind to
  who the person is (one gave an eleven-year-old a grey beard), so a named character's looks
  are said outright in their `CAST` entry with `stLook(hair, style, extra, skin)`; both read
  it. `{ bot: true }` there gives a machine's portrait instead. After adding anybody, look at
  them: `.scratch/v8/t_faces.js` draws a contact sheet of the story cast.
- Units are metres. Mechs are 12-16 m tall, people about 1.7 m, so bay furniture meant for people
  needs to be built at human scale.
- CSS class names are global too, and short ones are taken (`.sn` is the slot name, `.pn` a
  panel, `.ob` an objective). Check before adding one.
- Items are counted in `YARD.inv` under `category.id` keys (`arm.las`, `gear.sink`). A bay build
  is a config whose slots may be `null`; `Mech`, `mechStats` and `mechReady` all accept that.
  Enemies and wingmen still use the complete `PRESETS`.
- The save is one JSON document (`saveBlob()`, `v: 2`), used for both autosave and export.
  Anything new that must persist goes in there and in the matching `*Apply` function, which
  validates on the way in because imported files are untrusted.
- Overlays that take over input carry the `ovl` class; `uiModal()` is how key handlers know to
  stand down.
- Rooms are `mode` values: `hangar`, `hq`, `bar`, `brief`, `field`. (`intro` is the opening,
  which is not a room: see below.) The bar (`BAR`, camera rig
  `barCam`,
  `updateBar`) is built like the deck. The conversation box `#dlg` and `dlg()` serve both rooms;
  `focusOn` hands over to `barFocusOn` in the bar. People there are `Human`s in `BAR.crowd`; the
  regulars are in `BARC`, and seated ones keep their seat through `barStay`.
- The name. `GAME_NAME` ('StompyMechs') is the game wherever it is written out, `GAME_ID` what a
  save file is marked with (`GAME_WAS`, the old mark, is still accepted), `CO_DEF_NAME` the
  company nobody has named yet. Nobody in the game says the game's name: a line that addresses
  the player's company is written with `{CO}`, and `coTxt()` (in `dlg`, `comm` and `news`)
  puts `YARD.name` there in ordinary case. Text that reaches the screen some other way has to
  call `coTxt` itself. Storage goes through `lsGet(k)` / `lsSet(k, v)` (`stompymechs.k`, read
  from `ironworks.k` when that is all there is), never `localStorage` directly.
- The opening (`src/js/447_intro.js`) is the real field with nobody in it. `introBoot()` starts
  it as the page finishes loading unless `stompymechs.intro` is set; SETTINGS · DISPLAY has
  WATCH IT AGAIN (`introOpen()`, which refuses in the field and the briefing room). While it
  runs `mode` is `'intro'`: `frame()` calls only `introFrame(dt)`, `body.intro` hides the rest
  of the page, and its own capture-phase key and pointer listeners begin it and (after .7 s)
  end it, so the game hears nothing.
  - A cut is an entry in `INTRO_SHOTS`: `{ at, init(S), tick(S, u, dt) }`. `init` builds a
    theatre (`buildEnv`), stands machines in it (`introMech`, `introTank`, `introDrone`,
    `introMark` for something off-screen to shoot at) and runs it forward out of sight
    (`introRoll`); `tick` places the camera (`introCam`) and fires the scripted events
    (`introEv`, `introBlast`, `introBarrage`). `introStride(e, hit)` walks until a foot has
    just come down and says where and when the next ones will, which is how a camera is stood
    under a footfall. `introSim` is `fieldUnits` and `fieldFx` (`180_field_player.js`: the
    parts of `updateField` that do not need a player).
  - The clock is the audio's: the cue (`makeScore`'s `intro`, 120 beats a minute) is scheduled
    once, `INTROV.t` runs on the frame clock steered onto `music.clock()` less the time the cue
    began (read raw it judders: Firefox moves it a callback at a time), and the field is caught
    up to it in steps of a thirtieth. If the audio clock stops for .3 s the frame clock takes
    over, and a skip is timed by `performance.now()`, so neither can leave it standing. Move a cut and the music has to move with it: the walk
    is beats 0 to 4, the title lands on beats 15 and 16 (`INTRO_LOGO`, 7.5 s).
  - Each cut and the title are built once and compiled (`renderer.compile`) before the clock
    starts, so no cut waits for a shader. Where the browser has the audio suspended the
    opening waits behind `#inGate` for a gesture instead of playing silent.
  - `sfx.hush(true)` drops every sound asked for while a cut is run in (two seconds of gunfire
    in one instant clips), and `sfx.trim(.55)` holds the effects under the score.
  - `introEnd()` gives back what was borrowed: the field (`clearField`, `clearEnv`,
    `fieldScale`), `FD.camera`'s lens, `P.pos`, `P.kills`, `YARD.loot`, the particle scale,
    `mode`. `t_intro.js` compares a snapshot before and after; add to both when the opening
    borrows something new.
  - The title's letters are outlines in `INTRO_GLYPH` (a 5 by 7 grid, extruded): a new letter
    is a new entry there. No font is loaded.
- The picture reaches the canvas through `POST` (`src/js/020_post.js`) and nothing else. The main loop
  sets `POST.scene`, `POST.camera` and `POST.strength` (the bloom) for the room and calls
  `POST.frame(dt, still)`; `POST.draw(scene, camera)` draws any scene through the whole chain,
  which is what the contact sheets use. The canvas has no depth buffer and no antialiasing of
  its own (the scene target has both), so `renderer.render()` straight to the canvas comes out
  wrong. `gfxApply()` and the resize handler keep `POST.bloom` and `POST.size()` in step.
- A sortie is not in the save: a page left mid-contract comes back in the bay. So from launch until `toHangar` has
  settled the books, `sortieGuard` (`src/js/275_sortie_guard.js`) keeps the page from being left by accident: a
  history entry of its own catches Back and pauses the sortie, the mouse's side buttons are swallowed, and an
  unload asks first. The proving ground is not guarded. Add nothing that keeps the page out of the browser's
  back/forward cache (an `unload` listener, `Cache-Control: no-store`): the browser's back/forward cache is what brings a sortie back if one is left anyway.
- A sortie on hold keeps the picture it has. `still` is true in the field while the pointer is
  free (SORTIE READY, the pause sheet, the map), nobody is dead, the contract is not over, the
  comm camera is not live and no tween is running: `updateField` does not run then, so nothing
  moves. The picture is drawn again when the camera has moved, for three frames after a key, a
  click, a control, a resize or `POST.kick()`, and twice a second regardless. Anything new that
  changes the field's look while it is on hold, without one of those, should call `POST.kick()`.
  The other rooms always draw.
- The first day is `TUT = { lock, hints, seen }` (`src/js/115_first_day.js`), saved under `tut`
  (`tutSave()`, `tutApply()`). A save with no `tut` is an old company: open board, no tours.
  - `tutLock()` means the board holds one card: `fillBoard()` deals nothing, and `storySync()`
    offers only the thread marked `first` (`STORY.zero`, the shakedown), whose offer never
    lapses. `tutStory()` keeps the two in step whatever a save says: that thread finished, or
    the lock off, means an open board and a closed thread. An open board is never offered it.
  - A `first` thread is flown on the company's own account: `settle()` charges no repairs,
    moves no faction standing and counts no failure, and a lost attempt is on the board again
    at once. A chapter marked `solo` is flown without the hired wingman (who is not used up);
    a `home` chapter marked `lay` has its sites levelled and cleared like any other theatre.
    `forS`, `payL`, `note`, `close` and `again` on a thread replace the stock wording.
  - A room's tour is an entry in `TOURS` (`src/js/445_guide.js`): `{ by, room, modal, steps:
    [{ t, at, when, done, act, pos }] }`, started by `tutTick` (called from `frame`) the first
    time `room()` is true, for a key listed in `TUT_KEYS`. A tour never blocks input: the ring
    passes clicks through and leaving the room ends it. A new overlay or room wants a tour
    here; a new control wants a line in the shakedown. `tutHint()` is the NEXT chip, shown
    until the lock comes off; `tutKeys([[key, what]])` puts key prompts on the HUD for a
    chapter script (only the shakedown uses it) and `tutKeys(null)` takes them away.
- What the bar remembers lives in `BARSV` and is saved under `bar` (`barSave()`, `barApply()`).
  A freelance pilot is rebuilt from a seed by `barPilot(seed)`, so the save holds only seeds;
  `CO.wing` may carry `cfg`, `skill`, `hpK` and `paid` for one of them, while deck pilots still
  name a `PRESETS` index in `mech`. `mechPower(cfg)` and the pilot's rank set the fee.
- Bar rumours go into a contract's `intel` with `src: 'bar'` and a key prefixed `r.`, so they
  never count as known facts (`unknown(c)`) and Mira or the client can still confirm or refute them.
- `humReach(h, arm, point, hint)` puts a hand on a point in the world (two-bone IK). Call it after
  the crowd has updated; it overrides that frame's pose for the arm.
- Music: `makeScore` builds every player (`deck`, `radio`, `field`, `sting`) from the voices in
  `KIT`. The radio plays in the bay and, as the jukebox, in the bar (`radio.voice(0 | 1)`); it
  holds one steady level by design, with no dropouts and no fading with the camera. A player has `out`, `start`, `shift`, `next` and `tick`; the `music` engine fades them by
  room and schedules a little ahead. A mission score writes patrol-only parts to the `D` buses,
  combat-only parts to `H` and shared parts to `C`; `scoreHeat()` decides when it crosses over.
- The other companies are `RIV.cob`, `RIV.car`, `RIV.ver` (`RIVS` lists the keys): paint, emblem,
  commander `ch`, a roster of four machines, and six `facts` for the dossier. `RIV` has no
  prototype on purpose: company keys come out of save files, and `RIV['constructor']` must find
  nothing. Test a key with `RIV[k]` or `RIVS.includes(k)`.
- Standing lives in `CO.riv[k] = { rel, log, know, ask, gift }` (companies) and `CO.rep[f]` with
  `CO.hist[f]` (factions), saved in the ledger by `rivSave()` and validated by `rivApply()`.
  Change it only through `rivRel(k, d, why)` and `repAdd(f, d, why)`, which keep the history the
  STANDING tab shows. During a sortie use `rvRel(k, d, why)` and `rep(f, d)` instead: they are
  held in `MS.relD` / `MS.repD` and applied by `settle()`, so nothing sticks if the page is
  closed mid-mission. `relWord()` and `repWord()` name the bands.
- A contract can involve a company three ways. `c.rival` names one that will turn up (the
  `'rival'` twist, or the recovery plot `race`): `TWISTS.rival` picks help, race or opposition
  from the standing and the mission type. `c.co` with `c.cok === 'sub'` is paper they hold and
  pass down: their commander is `dealer(c)` and the negotiating `PERSONA`, and the client's
  goodwill is halved. `c.co` with `c.cok === 'joint'` puts their lance beside yours (`rivJoint`);
  `c.share` is their cut when the player proposed it. `rivCo()` converts an offer, `rivOffers()`
  deals them onto the board now and then, `rivClean()` checks one loaded from a save, and
  `rivSettle()` does the books.
- In the field a company's lance comes from `rivLance(k, x, z, team, o)` (`rivDrop` to arrive by
  dropship): the commander in whichever roster machine is closest to `mechPower(player.cfg)`,
  and one or two lancemates a class lighter. Their entities carry `rv` (the company key) and
  `rc` / `rh` (radar and map colours). Flying on your side they are team 0 but their shots are
  owned by 4: they hit what yours hit, the kills are theirs (`MS.v.rvk`), not yours.
  `rivFight()` runs a fight to the point where they yield.
- Story threads live in `STORY` (no prototype, like `RIV`): `{ name, sub, col, emp, foe, who,
  open(), wait, flags, fin, ch: [...] }`. A chapter is `{ title, kind, biome, mood, seed, diff,
  pay, salv, site, op, tease, wire, sites: { lz, key: [x, z, r, label] }, roads, face, guests,
  brf: [...], async run(ms), epi(ok, f, D), prize(D, add, f) }`. `kind` is one of the ordinary
  mission types and only dresses the card; `run` replaces that type's script altogether.
- Where a thread stands is `stState(k)` in `STV.th`: `ch` the next chapter, `st` 0 not begun, 1
  between chapters, 2 on the board, 3 finished, `at` when it may next be offered, `exp` when
  the offer closes, `n` failed attempts. `storySync()` is the only thing that puts story cards
  on the board (never more than three, and the campaign's besides), `storyLapse()` takes an unanswered one away for a
  while, `storySettle()` moves the thread on or, after a failure, queues the same chapter
  again. Story cards are never saved with the board; `storySave()` / `storyApply()` keep the
  thread state and rebuild them. `STORY.zero` is the thread marked `first`: see the first day,
  above.
- What a thread remembers of the player's choices is a small integer under `'thread.flag'`.
  In a chapter use `stSet(flag, v)` and `stGet(flag)`: they are staged in `MS.sf` and kept only
  if the chapter is won. Anywhere else read `stFlag('mar.ram')` or `stDone('mar')`. A flag
  must be listed in its thread's `flags` or the save drops it.
- A story theatre is `STK` (2.4) times the ordinary field. `fieldScale(k)` rebuilds the ground
  and sets `FD.k` and `FD.size`; anything that assumes a kilometre must read those. Chapter
  sites are given in metres from the centre; `storyLay()` flattens a pad at each and along
  every `roads` entry (a list of site keys) and keeps props off them. Keep sites within about
  800 m: the rim hills start at 864.
- Chapters are written with the helpers in `src/js/200_story_kit.js` on top of the mission ones (`until`,
  `after`, `say`, `ask`, `tell` (awaitable `say`), `setObj`, `nav`, `foes`, `spawn`,
  `dropship`): `stFrom` (alerted hostiles from a bearing), `stHold` and `stBar` (meters),
  `stPay`, `stGift`, `stMend`, `stRoad`, `stBeacon`, `stGate`, `stFire`, `stShow`, `stTick`,
  `stRace` (gates, laps, a pack: see below), and the big machines `stCrawler`, `stWalker`,
  `stLantern`, `stDread`. An ally who must not die is wrapped in `stKeep` (`src/js/400_thread5_night.js`): at a
  quarter armour they are out of the fight and nobody shoots at them. A new named character
  goes in `STC`, `CAST` (the body and the looks) and `VOX_WHO` / `VOX_CAST` (the voice).
- A Derby race (`stRace`, `src/js/200_story_kit.js`) is rubber-banded the way kart racers are. Every car has a
  place in the pack, `st`: seconds of the player's top speed in front of them (behind, if
  negative), given as `[off the grid, settled, at the last gate]` and swinging by `sw` once
  settled. It takes the player's measured pace plus `RACE_K.gain` for each second it is off that
  place, between `lo` and `hi` (`far` out of sight, `rush` in the last `late` seconds), so it can
  neither be dropped nor get away. When the player clears the last gate (`R.home()`) every car
  drops to `f`, its honest share of the player's walking speed, and the run to the flag goes to a
  player who sprints it with the heat to do it. `flat` takes a car out of the pack; `R.pace` under .5 is a caution flag
  that shuts the gates for everybody; a car turned hostile (`dbHot`) fires `gun` (.3) as often as
  it would standing still. `R.gap(car)` and `R.secs(car)` say where a car is against the player,
  and `dbBank(R)` lets the cars in front keep what they gained while the player was off the
  course. `e.vk` on any `mkMech` scales its speed and turning without quickening its stride.
- A sprint costs heat (`SPRINT_K`, beside `SINK_COOL`). It adds `heat` a second, and while it
  lasts the sinks shed only `shed` of their usual rate, so it cannot be held: from cold it runs
  about twenty seconds to the ordinary shutdown at 100, a little longer with a lot of cooling.
  `sprintFor(stats, k)` gives that time (the bay shows it as SPRINT FROM COLD). Past `HEAT_WARN`
  (80) the HUD says HEAT CRITICAL, whatever is making the heat: once a climb, again only after it
  has fallen under 55, never while venting (`t_warn.js` checks that, in either browser).
  Anything tuned on how far the player can run has to
  allow for it. The Derby's final straights are as long as a sprint from cold or longer, so the
  pit wall tells the player to reach the last gate cold, and at the gate `dbCall` swaps Rook's
  "flat out" for "let off when she warns you" when the machine cannot sprint the whole straight
  from the heat it has.
- The briefing room is `BRF` with camera rig `brfCam`, built like the bar; `toBrief(c)` enters
  it from the deck, `brfStep(i)` plays one step, `brfLeave('bay' | 'hq')` leaves. A chapter's
  `brf` is a list of steps `{ t, by, show, shot }`: `by` speaks (the XO if absent; the crew
  and any `guests` are in the room, anybody else is a voice over the map), `show` puts marks
  on the wall map (`['site', key, label, colour]`, `['foe' | 'ally' | 'unk', key, label]`,
  `['route', [keys], colour]`, `['ring', key, metres, label]`, `['card', title, [lines]]`,
  `['face', character, [lines]]`, `['clear']`). The map is the theatre's real ground, sampled
  from its seed. A step may be a getter when it depends on a flag, and a briefing should
  leave things out: what the script springs later is the point.
- The comm camera (`src/js/190_mission_engine.js`): while a held line is up, the view goes to the speaker if they
  are on the field, or to the event the line is about. `cutWho` finds a speaker by
  `fieldWho(ch, ent)`, as the wingman, as a company commander, or by a machine carrying their
  surname; give anybody else who is physically out there a `fieldWho`. An event is
  `look(thing, label)` called in the same instant as the `say` about it (either order);
  dropships, `hot1` and garrison waves report themselves with `look(.., .., true)`, which
  never displaces a script's own. Announce a thing as it appears rather than seconds before,
  or there is nothing to show. A speaker cut needs the line to hold (`CFG.hold`); an event is
  always shown, and at the lower settings holds only as long as the line would have stayed.
  Chatter never moves the camera.
- An alerted drone chases at any range (it used to give up beyond 420 m, which stranded
  waves on the bigger maps).
- Comms: `say` and `ask` queue lines that hold the sortie while they are on screen, according to
  `CFG.hold` (2 every message, 1 questions only, 0 never: a question then times out to its
  default as it used to). `chatter()` is talk that must never stop the fight. While `commHold`
  is set the frame loop runs only `updateComm`; the pointer stays locked, keys go to
  `commHoldKey`, mouse movement and the wheel walk the highlight, and a click never dismisses a
  plain line.
- Every line in `dlg()` and in the comms is spoken by `vox.say(ch, text, fx)` (`'radio'` in the
  field, `'holo'` for a hail on the deck). `voxOf(ch)` gives a character their voice: the named
  cast by seed (`VOX_WHO` to `VOX_CAST`), everyone else drawn from their seed out of the
  `VOX_KIND` archetypes, with the tongue of their faction (`VOX_LANG`, chosen from `ch.role`).
  A new named character wants an entry in both tables. `voxRender` is pure JS and fills its own
  array, `vox.level()` drives the speaker's mouth, and `CFG.voice` is the VOICES slider.
  The `'radio'` treatment is a small speaker and nothing else: a band-pass, a make-up gain
  (the filter throws most of a low voice away) and a soft clip. It adds no hiss, no key click
  and no static tail, and the consonants carry only a trace of noise. That is deliberate.
- Sound starts with the page: `sfx.init()` runs once at the end of the module, which builds
  the `AudioContext`, the music and the voices. A browser that blocks autoplay leaves the
  context suspended until the first click or key; every input event calls `sfx.init()` again,
  which resumes it, and `#sndHint` (`sndWait`) says so on screen until the context is running.
  Nothing may assume the context does not exist yet, and nothing should wait for a gesture
  before building audio.
- Weapons are descriptors on a part: `{ type, name, dmg, cd, heat, speed | range }` plus what
  the type needs (`salvo`, `spread`, `blast`, `turn`, `life`, `loft`, `reach`, `burn`,
  `stun`, `chain`, `arc`, `sweep`, `grind`, `big`, `small`, `snd`). The types are `laser`,
  `rail`, `beam` (hitscan), `bullet`, `flak`, `plasma`, `bolt`, `ion`, `missile` (homing
  unless `turn: 0`, lofted with `loft`), `lob` (a shell under gravity), `flame` (a cone that
  sets fire), `arc` (lightning that chains) and `melee`. `emitShot` sends one round from one
  muzzle whoever fired it; `fire` is a mech's slot, `fireFrom` anything else's. An arm weapon
  comes from a row of `ARM_FAM` (`[id, mark, family, name, desc, tons, armor, value, rarity,
  weapon, build]`): the same gun in two or three marks shares a builder. `wepReach(w)` is how
  far it is worth firing, and a machine's AI closes to `e.rng` (`mechRng`), so a brawler
  walks in and a missile boat stands off.
- `PRESETS[0..5]` keep their places (deck pilots name them by index); the twelve after them
  are sorted into `PRESET_CLS` by weight class, which is where `foeCfg` draws opposition from.
- Component damage. `mechZones(mech)` gives every fitted part a sphere (`mech.zg`), and
  `zonesFor(mech, hull, k)` its armour as a share of the hull (`ZONE_K`: share, how much of a
  hit passes on to the hull). `damage(e, dmg, at, owner, zone)` takes the zone that
  `rayHit`, `zoneAt` or `zoneRay` found. It applies to hostile mechs (`e.zones`, unless
  `e.nz`, which the Derby cars carry) and to the player (`P.zones`, `P.lost`). `zoneBreak` is
  what losing a part does: an arm or back weapon stops firing, legs gone is `e.legless`
  (a third of the player's speed, no sprint), a cockpit costs aim or radar range, a back unit
  its jets, shield, ECM or cooling. An ordinary pilot with no weapons left ejects (`e.ej`)
  and the kill is credited; one with a name (`e.named`) fights on. The R kit brings the
  player's wrecked parts back at half (`zoneMend`), and `settle()` charges 15% of each.
- Every unit's turn in the frame goes through `entTick` (burning, shields, stuns, ejections)
  before its own `update`. A target is one sphere, or a list in `e.hs` (`[x, y, z, r]` in its
  own frame, turned by `e.yaw`): use `entRay`, `entIn` and `entGap` rather than `e.r`.
- Vehicles keep their makers and take a variant: `mkDrone(x, z, team, v)` (`AIR`: `hunter`,
  `scr`, `shr`, `vul`, `hrp`), `mkTank(x, z, team, { v })` (`TANKS`: `striker`, `dingo`,
  `mam`, `hail`, `fur`, `pike`; `tankBrain` drives them all), `mkTurret(x, z, team, v)`
  (`TUR`: `sentry`, `hydra`, `prism`, `bas`). With none given each builds what it always did.
  `spawn(spec, ...)` picks variants from `UNIT_POOL` by tier (`unitTier`), or takes `spec.v`.
  In a story chapter only a spec marked `mix` (which `force()` sets) is varied: a number a
  chapter asks for outright stays the hunter, striker or sentry it was written round.
- `mkCentipede` is a head and a body of separate entities following its trail (kill the head
  and the rest goes); `mkFactory` a `STRUCT.fab` that builds through `spawn` while it stands
  (`pacify` stops the line); `mkCapital(v, ...)` a `kind: 'ship'` hull from `CAPS` (`lev`,
  `hive`) whose turrets and engines are entities of their own in `e.subs`. `o.focus` is what
  a ship came for, `e.flee` sends her off the map. An entity with `nw` leaves no wreck:
  `killEnt` calls its `crash(owner)` instead, and any entity's `onDead()` first. (`e.gone` is
  taken: it is the flag for a unit walking off the map.) `shell(x, z, dmg, r, delay, own)`
  knows whose it is, so anything with an area weapon must pass its team.
- A contract may carry `cap` (45, 65 or 85 t; 0 for none: `capFor`). `capTier(c)` scales
  `force()` and `foeCfg` to it, `mechReady(cfg, biome, contract)` refuses a machine over it,
  and `boardApply` checks it against those three numbers (a table lookup let `'constructor'`
  through). `wingRec(c)` is the wingman recommendation, worked out from the difficulty and
  type each time rather than stored: it is a warning in `mechReady`, so launching alone
  takes the second press. Neither applies to a company's joint contract or to the Derby.
- The record (`src/js/117_stats.js`) is one flat table, `TALLY.n`, of numbers under dotted keys
  (`s.` sorties, `g.` gunnery, `w.arm.id.` and `w.back.id.` a weapon's pulls `p`, rounds `s`,
  hits `h`, damage `d` and kills `k`, `k.` kills, `z.` parts shot off, `d.` damage taken, `m.`
  movement, `h.` heat, `cr.` money, `y.` the yard, `q.` the deck, `b.` the bar, `c.` comms, `t.`
  time). It belongs to the company: saved under `stats` (`talSave()`, `talApply()`, which seeds
  an older save from its ledger and says since which day it has been kept), wiped by a new
  game. The table has no prototype, like `RIV`, because its keys come out of save files.
  - A new stat is two things: `tal(key, n)` (or `talMax`, `talMin`) where the thing happens,
    and a row in `TAL_DEF` (`[key | function of the table, label, format, 1 if it is worth
    showing at nothing]`), or a family in `talRows`. A label has to stand on its own: a board
    shows it without its section. Something a player does every frame goes in `talField`,
    which writes to the table directly.
  - Nothing is counted while `TALLY.off` is set, which is how the opening leaves no trace.
  - Whose round it is travels as `talBy`: the item key of the player's weapon (`arm.lp1`),
    `'ally'`, or `null`. `fire` and `fireFrom` set it, a projectile carries it as `s.by` and
    `updateShots` puts it back when the round lands, a burn remembers it (`e.burnW`) and so
    does an ejection; `damage`, `killEnt` and `zoneBreak` read it. Anything that hurts a
    hostile on the player's behalf some new way has to set it round the call, or the damage
    and the kill go down as nobody's (`k.oth`). A round is one hit however many things it
    touched (`talHit`).
  - Money spent goes through `spend(n, why)`, which files it under `cr.o.why`; `settle()`
    tags each line of the books (`add(label, value, tag)`). A sortie lost on the company's
    own account is no loss here either.
  - `talRows()` is what stands at more than nothing, `talRows(1)` adds the lines marked as
    worth showing at nothing (a new company's boards), `talRows(2)` is the book in SETTINGS
    · STATS (`statsDraw`): every line, searchable, with the weapons as a table (`talWeps()`).
  - The boards (`src/js/345_stat_boards.js`) are canvases on a wall: `talBoard({ rooms, w, h,
    n, every, idle, draw })`, one on each end of both gantry towers in the bay (`HG.statB`,
    one texture), a strip over the deck's window (`HQ.statB`) and a set over the back bar with
    a crawl (`BAR.statB`). `talBoards(dt, t)` in the main loop ticks the board of the room
    showing: a slot is dealt another line every few seconds (`talDeal`: nothing on the board
    or lately off it, each section weighted by the root of its size), a line that is up
    follows its number, and a board is drawn only when it has changed. The side panels cover
    the outer thirds of every room, so the deck's strip and the bar's set are drawn from the
    left; in the bay one tower's board is always clear of them.
- Salvage is not given up by accident: the chief asks again in `debrief`, and the picker's
  LEAVE IT ALL arms on the first press (`ST.sure`). A script hands the player an item by
  pushing `{ kind: 'gift', key }` onto `YARD.loot`.
- The hour. A contract carries `tod` (`dawn`, `day`, `dusk` or `night`; `todDeal` deals it, and
  leans towards a night or a day when the board has none), a chapter may name one, and
  `todKey(biome, mood, tod)` is the hour actually flown: a biome's own list (`tods`) can refuse
  one. `TOD[k]` bends the biome's noon (sky, fog, the sun's height and colour, the fill, stars,
  exposure); `applyAtmo` sets it and `await todShift(key, seconds)` moves it while the sortie is
  flown, which is how a night ends in a dawn. A script means the hour it names (`todShift`,
  `todFor(key, true)`); a card does not: while `sunDim()` every card's sky is `ecl`, the
  eclipse, which nothing deals. What the machines reflect is the sky they stand under
  (`skyEnv`), drawn again when the light has changed. The proving ground is the yard at noon,
  or under whatever the campaign has done to the sun.
- Everything that glows in the field is drawn with `glowM(hex, k, core, soft, rim)`
  (`src/js/155_field_glow.js`): one shader, one material kept per colour and shape. Never
  dispose one. Something that has to fade on its own takes a `.clone()` and disposes that, as
  the sky lance does. `flashAt(p, hex, power, reach, life)` borrows one of six pooled point
  lights (`CFG.wlight`, LIGHT FROM WEAPONS FIRE in SETTINGS), `scarAt(p, r)` leaves a scorch on
  the ground, `shockAt` a blast ring, and `fieldBoom` is all three.
- Surfaces are made, not loaded (`src/js/030_gfx.js`). A tiling height field (`hfNoise`,
  `hfStamp`, `hfCells`, `hfBlur`) gives a picture, a normal map (`hfNormal`) and a wear map, and
  `txMate` ties the three together, so `std({ map })` finds the other two at the picture's own
  repeat. `txPanel` (armour plate), `txConcrete`, `txCorr` and `txRock` are made that way; the
  ground is `groundTex(kind)` in `src/js/150_field_env.js`, one pair per kind of ground, made
  the first time a theatre needs it. Fine relief sparkles under a low sun: keep the
  high-frequency terms of a height field small (the road was turned down twice for it).
- The board is a spread of weights. `diffTop()` is the hardest a company is offered (two
  diamonds at first, five after a dozen contracts), `diffWant()` the six weights a full board
  should hold and `diffDeal()` whichever of them it is short of; `boardSpread()` re-rates a
  board saved before there was a spread, on the way in. A card's difficulty and its hour are
  always on the card, whatever tags it carries.
- The dealer (`src/js/415_mech_dealer.js`, the third tab of the stores) sells catalogue machines
  whole. Six stand on the lot (`YARD.shop.mechs`, `[{ p, price, tag }]`, `p` an index into
  `PRESETS`, one of each weight class among them), dealt with the market's rotation (`mrot`) and
  saved with it (`dealClean` on the way in); anything else is built to order at
  `DEAL_K.order`. A purchase goes to the first empty bay, or into stores as its parts when every
  bay is taken.
- A capital ship is there to be taken apart: an engine takes `SHIP_ENG_K` (a quarter) of the
  hull with it and slows her, so aim is worth more than weight of fire. An assembly plant given
  `stock` builds that many and no more. Where a contract has something to stand by (`OPS_HOLD`)
  the works twist is put near enough to walk to.
- The campaign is the thread marked `main` (`STORY.sun`, FALSE DAWN: acts in
  `src/js/403_campaign_act1.js` to `405`, tools in `402_campaign_kit.js`). A `main` thread's
  card is over and above the three story cards, is listed first, never lapses and comes back
  sooner after a failure. Its chapters carry `act`, and may carry their own `emp`, `foe`, `who`,
  `note` and `after` (the wire that goes round when the chapter is won); `guests` may be a
  function, and a briefing step's `t`, `by` and `show` getters, where they depend on a flag.
  What it has done to the rest of the game is read from where the thread stands, never stored:
  - `sunWar()`, once chapter III is won and until the end: ordinary contracts pay 15% more and
    may carry the `concord` twist, a peacekeeper lance that interdicts the sortie.
  - `sunDim()`, once chapter V is won and until the end: the Array is edge-on across the sun and
    every sky in the sector is the eclipse (`TOD.ecl`). It is false during the opening.
  - `sunKey()`, from the moment the key is lifted in chapter V, and after the end only if the
    keys were kept (`sun.end` 2): B calls the SKY LANCE where the reticle is (`sunCall`),
    `P.lance` times a sortie, which is once unless a chapter grants more. `sunHud()` puts the
    prompt on the HUD and the line in the controls list; a chapter that wants to know where one
    landed sets `MS.v.onLance(at)`.
  - `sun.end` 3 (the keys given away) pays 10% more on every contract afterwards.
  `skyLance(p, o)` is a strike from orbit (a ring, a count, then a column; `own` 1 theirs, 0
  ours) and `sunSweep(from, to, o)` a beam that walks after `to()` and burns both sides, slower
  for a machine that has lost its legs. Both hit by horizontal distance (`sunBurn`), so a ship
  overhead is caught. `sunFoes` and `sunFrom` are `foes` and `stFrom` in Concord paint,
  `sunPilots(n)` the company's own pilots flying for nothing. The Concord is not a `FAC`
  (`third()` deals from those): its chapters carry an existing `emp` and `foe`, and the thread
  shows names through `forN`, `vsN` and `payer`.
- Never keep a `getChannelData()` view of a buffer that gets played. Firefox detaches the view
  once the buffer is playing, reads from it then give `undefined`, and a sample built from that is
  all NaN. One NaN note silences every score until reload (the music shares one compressor).
  Take a `.slice()` instead, as the guitar strings do with the noise buffer.
