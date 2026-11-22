# The launch counter and the feedback box

The game is one static page. This is the only thing beside it: a small service (Python 3, standard library only,
one file) that nginx passes two requests to, and one SQLite file that it writes them into.

| the page sends | when | what is kept |
| --- | --- | --- |
| `POST /api/launch` `{"id", "build"}` | every time the page is opened | one row in `launches`, and the browser's row in `visitors` |
| `POST /api/feedback` `{"id", "build", "kind", "text", "ctx"}` | somebody typed into the feedback box and pressed SEND | one row in `feedback` |

A **person** is a browser. The page makes up a random 32-character id the first time it is opened and keeps it in
`localStorage`; nothing else identifies anybody. No address, no user agent and nothing out of a save file is stored.
(An address is held in memory for a few minutes, to rate-limit it.) A player can turn the count off in
SETTINGS · WHAT'S NEW; the id is then forgotten, and turning it on again makes a new one. Requests whose user agent
looks like a crawler, a monitor or a headless browser are answered and not counted.

**Returning** means: seen on an earlier day. Days are UTC.

## Installing it

On the web server, from a checkout of this repository:

```sh
sudo sh server/install.sh
```

That copies `stompymechs_api.py` to `/opt/stompymechs/`, installs `stompymechs-api.service`, makes the user
`stompymechs`, and starts the service on `127.0.0.1:8377` with its database at
`/var/lib/stompymechs/stompymechs.db`. Run it again after the script changes; the database is left alone.

Then tell nginx about it: `nginx-stompymechs-api.conf` has the two pieces (a rate-limit zone for the `http` block,
and a `location /api/` for the site's `server` block). After `sudo nginx -t && sudo systemctl reload nginx`:

```sh
curl -s https://stompymechs.graham.pub/api/health      # {"ok":true}
```

Until that location exists the page's requests fail quietly: nobody is counted, and feedback waits in the player's
browser (six pieces at most, for up to 45 days) and is sent the next time they open the game.

## Reading it from the dashboard

Three ways, all on the server only. Nothing under `/api/` ever reads anything back.

**1. Ask the service** (the least work: JSON, on the loopback, refused if the request came through a proxy):

```sh
curl -s 'http://127.0.0.1:8377/stats?days=30'
curl -s 'http://127.0.0.1:8377/feedback?limit=50'            # newest first; &before=<n> pages back
```

```json
{ "generated": "2026-11-22T15:16:34Z",
  "totals": { "people": 212, "returning_people": 61, "launches": 540, "feedback": 9 },
  "window": { "days": 30, "people": 212, "returning_people": 61, "launches": 540 },
  "builds": [ { "build": 12, "people": 140 } ],
  "daily":  [ { "day": "2026-11-22", "launches": 31, "people": 22, "new_people": 15, "returning_people": 7, "feedback": 2 } ] }
```

`totals.returning_people` is everybody who has opened the game on more than one day; `window.returning_people`
is the people seen in the window on a day later than their first. `daily` has a row for every
day in the window, including days with nothing. `/feedback` gives
`{ "feedback": [ { "n", "ts", "at", "kind", "build", "visitor", "text", "ctx" } ] }`.

**2. Open the file.** The database is in rollback-journal mode (not WAL) so that a reader needs no write access.
Add the dashboard's user to the group and open it read-only:

```sh
sudo usermod -aG stompymechs www-data        # or whoever runs the dashboard; then restart it
sqlite3 'file:/var/lib/stompymechs/stompymechs.db?mode=ro' 'SELECT * FROM totals'
```

| table | columns |
| --- | --- |
| `visitors` | `id`, `first_seen`, `last_seen` (unix seconds), `first_day`, `last_day` (`YYYY-MM-DD`), `launches`, `days` (different days seen: more than 1 is somebody who came back) |
| `launches` | `n`, `ts`, `day`, `visitor`, `build`, `came_back` (1 if that browser was first seen on an earlier day) |
| `feedback` | `n`, `ts`, `day`, `visitor` (empty if the player has the count turned off), `build`, `kind` (`contract` or `general`), `text`, `ctx` (JSON) |

| view | gives |
| --- | --- |
| `daily` | `day`, `launches`, `people`, `new_people`, `returning_people` (only days with a launch) |
| `totals` | one row: `people`, `returning_people`, `launches`, `feedback` |
| `feedback_recent` | `n`, `at`, `kind`, `build`, `visitor`, `text`, `ctx`, newest first |

```sql
-- the last 30 days, a row a day
SELECT * FROM daily WHERE day >= date('now', '-29 days') ORDER BY day;
-- people in the last 7 days, and how many of them had been here before
SELECT COUNT(DISTINCT visitor), COUNT(DISTINCT CASE WHEN came_back THEN visitor END) FROM launches WHERE day >= date('now', '-6 days');
-- how many came back at all, and how keen the keenest are
SELECT SUM(days > 1), MAX(days), MAX(launches) FROM visitors;
-- feedback about contracts, with what was being flown
SELECT at, json_extract(ctx, '$.title'), json_extract(ctx, '$.result'), text FROM feedback_recent WHERE kind = 'contract' LIMIT 50;
-- everything one person has said
SELECT at, text FROM feedback_recent WHERE visitor = '<id>';
```

**3. The command line**, for a look without the dashboard:

```sh
sudo -u stompymechs python3 /opt/stompymechs/stompymechs_api.py stats    --db /var/lib/stompymechs/stompymechs.db --days 14
sudo -u stompymechs python3 /opt/stompymechs/stompymechs_api.py feedback --db /var/lib/stompymechs/stompymechs.db --limit 20
```

Both take `--json`.

### Feedback is somebody else's text

`text` and `ctx` are whatever a browser sent. The service strips control characters and caps the length (4,000
characters of text, 2,000 of context), and that is all: **escape both when the dashboard shows them.** `ctx` for
`kind = 'contract'` is what the game knew about the sortie just flown:

```json
{ "what": "strike.clean", "title": "Strike", "site": "Dravik Mesa", "biome": "desert", "hour": "dawn", "diff": 2,
  "twists": "", "result": "won", "secs": 312, "kills": 4, "armor": 61, "mech": "LIGHT 41t", "wing": false,
  "net": 100000, "flown": 9 }
```

`what` is `type.plot` for an ordinary contract and `thread.chapter` for a story one; `result` is `won`, `lost`,
`withdrew` or `destroyed`; `flown` is how many contracts that company has flown, which says how new the player is.

## Limits

One address may send 20 launches and 5 pieces of feedback a minute (400 and 40 a day), a request body may be 16 KiB,
and the whole service stops taking launches at 200,000 a day and feedback at 3,000 a day, so that nobody can fill
the disk. nginx's own `limit_req` sits in front of that. With `--origin`, a POST from a page on another site is
refused.

## Looking after it

```sh
systemctl status stompymechs-api
journalctl -u stompymechs-api -n 50
sqlite3 /var/lib/stompymechs/stompymechs.db ".backup '/root/stompymechs-$(date +%F).db'"     # a copy, safe while it runs
```

## Trying it here

```sh
python3 server/test_api.py                                                      # the tests
python3 build.py --debug
python3 server/stompymechs_api.py serve --db .scratch/api.db --port 8399 --static .scratch --verbose
# then open http://127.0.0.1:8399/debug.html?net  (a debug page sends nothing without ?net)
```
