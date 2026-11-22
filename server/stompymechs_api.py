#!/usr/bin/env python3
"""StompyMechs: the launch counter and the feedback box.

One small service, standard library only, that the game's page talks to through nginx:

  POST /api/launch     {"id": "<32 hex>", "build": 23}                     the page was opened
  POST /api/feedback   {"id": "...", "build": 23, "kind": "contract",      somebody typed something and pressed SEND
                        "text": "...", "ctx": {...}}
  GET  /api/health     {"ok": true}

Everything goes into one SQLite file. Read it straight from that file (see README.md for the tables and the views
`daily`, `totals` and `feedback_recent`), or ask this service, which answers these two on the loopback only and
never to a request that came through a proxy:

  GET /stats[?days=30]           totals, and one row a day
  GET /feedback[?limit=50]       the newest feedback first

  stompymechs_api.py serve    --db FILE [--port 8377] [--origin https://stompymechs.graham.pub] [--static DIR]
  stompymechs_api.py stats    --db FILE [--days 14] [--json]
  stompymechs_api.py feedback --db FILE [--limit 20] [--json]

A "person" is a browser: the page makes up a random id the first time it is opened and keeps it in localStorage.
No address, no user agent and nothing from the save file is stored. An address is held in memory for a few minutes,
only to stop one machine from filling the disk.
"""
import argparse
import json
import os
import re
import sqlite3
import sys
import threading
import time
from datetime import datetime, timedelta, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

SCHEMA = """
CREATE TABLE IF NOT EXISTS visitors (
  id          TEXT PRIMARY KEY,      -- the random id a browser made up for itself
  first_seen  INTEGER NOT NULL,      -- unix seconds, UTC
  last_seen   INTEGER NOT NULL,
  first_day   TEXT NOT NULL,         -- 'YYYY-MM-DD', UTC
  last_day    TEXT NOT NULL,
  launches    INTEGER NOT NULL,      -- times the page was opened
  days        INTEGER NOT NULL       -- different days it was opened on: more than 1 is somebody who came back
);
CREATE TABLE IF NOT EXISTS launches (
  n          INTEGER PRIMARY KEY,
  ts         INTEGER NOT NULL,       -- unix seconds, UTC
  day        TEXT NOT NULL,          -- 'YYYY-MM-DD', UTC
  visitor    TEXT NOT NULL,
  build      INTEGER NOT NULL,       -- which release of the game (the number of its newest WHAT'S NEW entry)
  came_back  INTEGER NOT NULL        -- 1 if this browser was first seen on an earlier day
);
CREATE INDEX IF NOT EXISTS launches_day ON launches (day);
CREATE INDEX IF NOT EXISTS launches_visitor ON launches (visitor);
CREATE TABLE IF NOT EXISTS feedback (
  n        INTEGER PRIMARY KEY,
  ts       INTEGER NOT NULL,
  day      TEXT NOT NULL,
  visitor  TEXT NOT NULL,            -- '' from somebody who has turned the counting off
  build    INTEGER NOT NULL,
  kind     TEXT NOT NULL,            -- 'contract' (asked at the debrief) or 'general' (from SETTINGS)
  text     TEXT NOT NULL,            -- exactly what was typed: escape it before showing it anywhere
  ctx      TEXT NOT NULL             -- JSON: what they had just flown and how it went, or {}
);
CREATE INDEX IF NOT EXISTS feedback_day ON feedback (day);
CREATE VIEW IF NOT EXISTS daily AS
  SELECT day,
         COUNT(*)                                               AS launches,
         COUNT(DISTINCT visitor)                                AS people,
         COUNT(DISTINCT CASE WHEN came_back = 0 THEN visitor END) AS new_people,
         COUNT(DISTINCT CASE WHEN came_back = 1 THEN visitor END) AS returning_people
    FROM launches GROUP BY day;
CREATE VIEW IF NOT EXISTS totals AS
  SELECT (SELECT COUNT(*) FROM visitors)                 AS people,
         (SELECT COUNT(*) FROM visitors WHERE days > 1)  AS returning_people,
         (SELECT COUNT(*) FROM launches)                 AS launches,
         (SELECT COUNT(*) FROM feedback)                 AS feedback;
CREATE VIEW IF NOT EXISTS feedback_recent AS
  SELECT n, datetime(ts, 'unixepoch') AS at, kind, build, visitor, text, ctx FROM feedback ORDER BY n DESC;
"""

ID_RE = re.compile(r'^[0-9a-f]{32}$')
BOT_RE = re.compile(r'bot|crawl|spider|slurp|headless|preview|monitor|lighthouse|curl|wget|python', re.I)
KINDS = ('contract', 'general')
MAX_BODY, MAX_TEXT, MAX_CTX = 16 * 1024, 4000, 2000
# how much one address may send: (in a minute, in a day)
LIMITS = {'launch': (20, 400), 'feedback': (5, 40)}
# and how much everybody together may add in a day, so that nobody fills the disk
DAY_CAP = {'launch': 200000, 'feedback': 3000}


def utc_day(ts):
    return datetime.fromtimestamp(ts, timezone.utc).strftime('%Y-%m-%d')


class Store:
    """The SQLite file. One connection, one lock: the traffic is a handful of rows a minute."""

    def __init__(self, path):
        self.path = path
        self.lock = threading.Lock()
        d = os.path.dirname(os.path.abspath(path))
        os.makedirs(d, exist_ok=True)
        self.db = sqlite3.connect(path, timeout=10, check_same_thread=False)
        # the ordinary rollback journal, not WAL: anything on this machine that can read the file can then query
        # it, with no write access to the directory
        self.db.execute('PRAGMA journal_mode=DELETE')
        self.db.execute('PRAGMA synchronous=NORMAL')
        self.db.executescript(SCHEMA)
        self.db.commit()

    def launch(self, vid, build, now=None):
        now = int(now if now is not None else time.time())
        day = utc_day(now)
        with self.lock, self.db:
            row = self.db.execute('SELECT first_day, last_day FROM visitors WHERE id = ?', (vid,)).fetchone()
            if row is None:
                back = 0
                self.db.execute('INSERT INTO visitors VALUES (?, ?, ?, ?, ?, 1, 1)', (vid, now, now, day, day))
            else:
                back = 1 if row[0] < day else 0
                self.db.execute('UPDATE visitors SET last_seen = ?, last_day = ?, launches = launches + 1, days = days + ? WHERE id = ?',
                                (now, day, 1 if row[1] != day else 0, vid))
            self.db.execute('INSERT INTO launches (ts, day, visitor, build, came_back) VALUES (?, ?, ?, ?, ?)', (now, day, vid, build, back))
        return back

    def feedback(self, vid, build, kind, text, ctx, now=None):
        now = int(now if now is not None else time.time())
        with self.lock, self.db:
            cur = self.db.execute('INSERT INTO feedback (ts, day, visitor, build, kind, text, ctx) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                  (now, utc_day(now), vid, build, kind, text, ctx))
        return cur.lastrowid

    def count_today(self, table):
        with self.lock:
            return self.db.execute('SELECT COUNT(*) FROM %s WHERE day = ?' % table, (utc_day(time.time()),)).fetchone()[0]

    def stats(self, days=30):
        days = max(1, min(int(days), 3660))
        since = utc_day(time.time() - (days - 1) * 86400)
        with self.lock:
            t = self.db.execute('SELECT people, returning_people, launches, feedback FROM totals').fetchone()
            rows = self.db.execute('SELECT day, launches, people, new_people, returning_people FROM daily WHERE day >= ? ORDER BY day', (since,)).fetchall()
            fb = dict(self.db.execute('SELECT day, COUNT(*) FROM feedback WHERE day >= ? GROUP BY day', (since,)).fetchall())
            builds = self.db.execute('SELECT build, COUNT(DISTINCT visitor) FROM launches WHERE day >= ? GROUP BY build ORDER BY build DESC', (since,)).fetchall()
            window = self.db.execute('SELECT COUNT(DISTINCT visitor), COUNT(DISTINCT CASE WHEN came_back = 1 THEN visitor END), COUNT(*) FROM launches WHERE day >= ?', (since,)).fetchone()
        got = {r[0]: r for r in rows}
        daily, d0 = [], datetime.strptime(since, '%Y-%m-%d')
        for i in range(days):      # every day in the window, the quiet ones too, so a chart has no gaps
            day = (d0 + timedelta(days=i)).strftime('%Y-%m-%d')
            r = got.get(day, (day, 0, 0, 0, 0))
            daily.append({'day': day, 'launches': r[1], 'people': r[2], 'new_people': r[3], 'returning_people': r[4], 'feedback': fb.get(day, 0)})
        return {
            'generated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            'totals': {'people': t[0], 'returning_people': t[1], 'launches': t[2], 'feedback': t[3]},
            'window': {'days': days, 'people': window[0], 'returning_people': window[1], 'launches': window[2]},
            'builds': [{'build': b, 'people': n} for b, n in builds],
            'daily': daily,
        }

    def feedback_list(self, limit=50, before=0):
        limit = max(1, min(int(limit), 500))
        q = 'SELECT n, ts, kind, build, visitor, text, ctx FROM feedback %s ORDER BY n DESC LIMIT ?' % ('WHERE n < ?' if before else '')
        with self.lock:
            rows = self.db.execute(q, ((before, limit) if before else (limit,))).fetchall()
        out = []
        for n, ts, kind, build, vid, text, ctx in rows:
            try:
                c = json.loads(ctx)
            except ValueError:
                c = {}
            out.append({'n': n, 'ts': ts, 'at': datetime.fromtimestamp(ts, timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'kind': kind, 'build': build, 'visitor': vid, 'text': text, 'ctx': c})
        return out


class Limiter:
    """How much one address has sent lately. Held in memory only, and forgotten after a day."""

    def __init__(self):
        self.lock = threading.Lock()
        self.hits = {}
        self.swept = time.time()

    def ok(self, kind, ip, now=None):
        now = now if now is not None else time.time()
        per_min, per_day = LIMITS[kind]
        with self.lock:
            if now - self.swept > 600:
                self.swept = now
                for k in [k for k, v in self.hits.items() if not v or now - v[-1] > 86400]:
                    del self.hits[k]
            L = self.hits.setdefault((kind, ip), [])
            while L and now - L[0] > 86400:
                L.pop(0)
            if len(L) >= per_day or sum(1 for t in L if now - t < 60) >= per_min:
                return False
            L.append(now)
            return True


def clean_text(s, limit):
    """What somebody typed: no control characters but the line break and the tab, no more than `limit` characters."""
    s = ''.join(c for c in s if c in '\n\t' or (ord(c) >= 32 and ord(c) != 127))
    s = re.sub(r'\n{4,}', '\n\n\n', s.replace('\r', '')).strip()
    return s[:limit]


def make_handler(store, limiter, origin, static):
    class Handler(SimpleHTTPRequestHandler):
        server_version = 'stompymechs'
        sys_version = ''
        protocol_version = 'HTTP/1.1'

        def __init__(self, *a, **kw):
            super().__init__(*a, directory=static or os.devnull, **kw)

        def log_message(self, fmt, *args):
            if self.server.verbose:
                sys.stderr.write('%s %s\n' % (self.log_date_time_string(), fmt % args))

        # ---- helpers ----
        def reply(self, code, obj=None):
            body = b'' if obj is None else json.dumps(obj, separators=(',', ':')).encode()
            self.send_response(code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)

        def proxied(self):
            return bool(self.headers.get('X-Real-IP') or self.headers.get('X-Forwarded-For'))

        def who(self):
            """The address to count against: nginx's word for it when the request came from this machine."""
            peer = self.client_address[0]
            if peer in ('127.0.0.1', '::1', '::ffff:127.0.0.1'):
                fwd = self.headers.get('X-Real-IP') or (self.headers.get('X-Forwarded-For') or '').split(',')[-1].strip()
                if fwd:
                    return fwd[:64]
            return peer

        def body(self):
            try:
                n = int(self.headers.get('Content-Length') or 0)
            except ValueError:
                n = -1
            if n < 0 or n > MAX_BODY:
                self.close_connection = True      # the rest of it is never read
                return None, 413
            try:
                d = json.loads(self.rfile.read(n).decode('utf-8'))
            except (ValueError, UnicodeDecodeError):
                return None, 400
            return (d, 200) if isinstance(d, dict) else (None, 400)

        # ---- the two things the page sends ----
        def do_POST(self):
            path = urlsplit(self.path).path
            kind = {'/api/launch': 'launch', '/api/feedback': 'feedback'}.get(path)
            if not kind:
                self.close_connection = True
                return self.reply(404, {'ok': False, 'error': 'no such thing'})
            d, code = self.body()
            if d is None:
                return self.reply(code, {'ok': False, 'error': 'too large' if code == 413 else 'not JSON'})
            o = self.headers.get('Origin')
            if origin and o and o.rstrip('/') != origin:
                return self.reply(403, {'ok': False, 'error': 'wrong origin'})
            if not limiter.ok(kind, self.who()):
                return self.reply(429, {'ok': False, 'error': 'slow down'})
            vid = d.get('id') if isinstance(d.get('id'), str) else ''
            build = d.get('build')
            build = build if isinstance(build, int) and not isinstance(build, bool) and 0 <= build < 1000000 else 0
            if kind == 'launch':
                if not ID_RE.match(vid):
                    return self.reply(400, {'ok': False, 'error': 'bad id'})
                if BOT_RE.search(self.headers.get('User-Agent') or 'bot'):
                    return self.reply(200, {'ok': True, 'counted': False})      # a crawler is not a player
                if store.count_today('launches') >= DAY_CAP['launch']:
                    return self.reply(429, {'ok': False, 'error': 'full for today'})
                return self.reply(200, {'ok': True, 'counted': True, 'returning': bool(store.launch(vid, build))})
            if vid and not ID_RE.match(vid):
                return self.reply(400, {'ok': False, 'error': 'bad id'})
            text = clean_text(d['text'], MAX_TEXT) if isinstance(d.get('text'), str) else ''
            if not text:
                return self.reply(400, {'ok': False, 'error': 'nothing to say'})
            ctx = d.get('ctx') if isinstance(d.get('ctx'), dict) else {}
            ctx = json.dumps(ctx, separators=(',', ':'), ensure_ascii=False)
            if len(ctx) > MAX_CTX:
                ctx = '{}'
            if store.count_today('feedback') >= DAY_CAP['feedback']:
                return self.reply(429, {'ok': False, 'error': 'full for today'})
            n = store.feedback(vid, build, d.get('kind') if d.get('kind') in KINDS else 'general', text, ctx)
            self.reply(200, {'ok': True, 'n': n})

        # ---- reading it back: this machine only ----
        def do_GET(self):
            u = urlsplit(self.path)
            q = parse_qs(u.query)

            def num(k, dflt):
                try:
                    return int(q.get(k, [dflt])[0])
                except ValueError:
                    return dflt
            if u.path == '/api/health':
                return self.reply(200, {'ok': True})
            if u.path in ('/stats', '/feedback'):
                if self.proxied() or self.client_address[0] not in ('127.0.0.1', '::1', '::ffff:127.0.0.1'):
                    return self.reply(403, {'ok': False, 'error': 'local only'})
                if u.path == '/stats':
                    return self.reply(200, store.stats(num('days', 30)))
                return self.reply(200, {'feedback': store.feedback_list(num('limit', 50), num('before', 0))})
            if static and not u.path.startswith('/api/'):
                return super().do_GET()
            self.reply(404, {'ok': False, 'error': 'no such thing'})

        def do_HEAD(self):
            if static and not self.path.startswith('/api/'):
                return super().do_HEAD()
            self.reply(404)

    return Handler


def serve(a):
    store = Store(a.db)
    srv = ThreadingHTTPServer((a.host, a.port), make_handler(store, Limiter(), (a.origin or '').rstrip('/'), a.static))
    srv.daemon_threads = True
    srv.verbose = a.verbose
    print('stompymechs api on http://%s:%d  db %s%s' % (a.host, a.port, os.path.abspath(a.db), '  static ' + os.path.abspath(a.static) if a.static else ''), flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


def show_stats(a):
    s = Store(a.db).stats(a.days)
    if a.json:
        return print(json.dumps(s, indent=1))
    t, w = s['totals'], s['window']
    print('ALL TIME   %d people, %d of them came back on another day · %d launches · %d pieces of feedback' % (t['people'], t['returning_people'], t['launches'], t['feedback']))
    print('LAST %-4d  %d people, %d of them returning · %d launches' % (w['days'], w['people'], w['returning_people'], w['launches']))
    print('\n%-10s %8s %7s %5s %9s %8s' % ('DAY (UTC)', 'LAUNCHES', 'PEOPLE', 'NEW', 'RETURNING', 'FEEDBACK'))
    for d in s['daily']:
        print('%-10s %8d %7d %5d %9d %8d' % (d['day'], d['launches'], d['people'], d['new_people'], d['returning_people'], d['feedback']))


def show_feedback(a):
    L = Store(a.db).feedback_list(a.limit)
    if a.json:
        return print(json.dumps(L, indent=1, ensure_ascii=False))
    for f in L:
        c = f['ctx']
        about = ' · '.join(str(c[k]) for k in ('what', 'site', 'result') if c.get(k))
        print('#%d  %s  %s  build %d%s\n%s\n' % (f['n'], f['at'], f['kind'], f['build'], '  [' + about + ']' if about else '', f['text']))
    if not L:
        print('No feedback yet.')


def main():
    p = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    sub = p.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('serve', help='run the service')
    s.add_argument('--db', required=True)
    s.add_argument('--host', default='127.0.0.1')
    s.add_argument('--port', type=int, default=8377)
    s.add_argument('--origin', help='refuse a POST whose Origin header is anything else, e.g. https://stompymechs.graham.pub')
    s.add_argument('--static', help='also serve the files in this directory (for trying the page locally; nginx does this in production)')
    s.add_argument('--verbose', action='store_true', help='log every request to stderr')
    s.set_defaults(fn=serve)
    s = sub.add_parser('stats', help='how many people, new and returning')
    s.add_argument('--db', required=True)
    s.add_argument('--days', type=int, default=14)
    s.add_argument('--json', action='store_true')
    s.set_defaults(fn=show_stats)
    s = sub.add_parser('feedback', help='what people have written')
    s.add_argument('--db', required=True)
    s.add_argument('--limit', type=int, default=20)
    s.add_argument('--json', action='store_true')
    s.set_defaults(fn=show_feedback)
    a = p.parse_args()
    a.fn(a)


if __name__ == '__main__':
    main()
