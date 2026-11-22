#!/usr/bin/env python3
"""python3 server/test_api.py: the launch counter and the feedback box, end to end on a port of their own."""
import json
import os
import sqlite3
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import stompymechs_api as api  # noqa: E402

UA = 'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0'
DAY = 86400
T0 = 1795300000      # some instant: 2026-11-21 22:26 UTC
A, B, C = 'a' * 32, 'b' * 32, 'c' * 32


class StoreTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.s = api.Store(os.path.join(self.dir.name, 'sub', 't.db'))

    def tearDown(self):
        self.s.db.close()
        self.dir.cleanup()

    def test_new_and_returning(self):
        s = self.s
        self.assertEqual(s.launch(A, 23, T0), 0)                  # first time: new
        self.assertEqual(s.launch(A, 23, T0 + 600), 0)            # the same day again: still new today
        self.assertEqual(s.launch(B, 23, T0 + 700), 0)
        self.assertEqual(s.launch(A, 24, T0 + 2 * DAY), 1)        # two days on: returning
        self.assertEqual(s.launch(C, 24, T0 + 2 * DAY), 0)
        rows = {r[0]: r[1:] for r in s.db.execute('SELECT day, launches, people, new_people, returning_people FROM daily')}
        self.assertEqual(rows[api.utc_day(T0)], (3, 2, 2, 0))
        self.assertEqual(rows[api.utc_day(T0 + 2 * DAY)], (2, 2, 1, 1))
        self.assertEqual(s.db.execute('SELECT people, returning_people, launches, feedback FROM totals').fetchone(), (3, 1, 5, 0))
        self.assertEqual(s.db.execute('SELECT launches, days FROM visitors WHERE id = ?', (A,)).fetchone(), (3, 2))

    def test_feedback_and_views(self):
        s = self.s
        n = s.feedback(A, 23, 'contract', 'more jump jets', '{"site":"Mirren Flow"}', T0)
        self.assertEqual(n, 1)
        self.assertEqual(s.feedback_list()[0]['ctx'], {'site': 'Mirren Flow'})
        self.assertEqual(s.db.execute('SELECT kind, text FROM feedback_recent').fetchone(), ('contract', 'more jump jets'))

    def test_readable_without_write_access(self):
        """What a dashboard does: open the file read-only while the service has it open."""
        self.s.launch(A, 23, T0)
        ro = sqlite3.connect('file:%s?mode=ro' % self.s.path, uri=True)
        self.assertEqual(ro.execute('SELECT people FROM totals').fetchone()[0], 1)
        ro.close()

    def test_clean_text(self):
        self.assertEqual(api.clean_text('  a\x00b\x07\r\n\n\n\n\n\nc\t ', 99), 'ab\n\n\nc')
        self.assertEqual(len(api.clean_text('x' * 9000, api.MAX_TEXT)), api.MAX_TEXT)

    def test_limiter(self):
        L = api.Limiter()
        per_min, per_day = api.LIMITS['feedback']
        self.assertTrue(all(L.ok('feedback', '1.1.1.1', 1000 + i) for i in range(per_min)))
        self.assertFalse(L.ok('feedback', '1.1.1.1', 1010))        # a sixth inside the minute
        self.assertTrue(L.ok('feedback', '2.2.2.2', 1010))         # somebody else is not held up by it
        self.assertTrue(L.ok('feedback', '1.1.1.1', 1100))         # and a minute later it is let through again
        n = sum(L.ok('feedback', '3.3.3.3', 5000 + i * 61) for i in range(per_day + 10))
        self.assertEqual(n, per_day)


class HttpTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dir = tempfile.TemporaryDirectory()
        cls.static = os.path.join(cls.dir.name, 'www')
        os.mkdir(cls.static)
        with open(os.path.join(cls.static, 'index.html'), 'w') as f:
            f.write('<p>the page</p>')
        cls.store = api.Store(os.path.join(cls.dir.name, 't.db'))
        cls.srv = ThreadingHTTPServer(('127.0.0.1', 0), api.make_handler(cls.store, api.Limiter(), 'https://stompymechs.graham.pub', cls.static))
        cls.srv.daemon_threads = True
        cls.srv.verbose = False
        cls.base = 'http://127.0.0.1:%d' % cls.srv.server_address[1]
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown()
        cls.srv.server_close()
        cls.store.db.close()
        cls.dir.cleanup()

    def call(self, path, body=None, headers=None, raw=None):
        h = {'User-Agent': UA}
        h.update(headers or {})
        data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
        if data is not None:
            h.setdefault('Content-Type', 'application/json')
        try:
            with urllib.request.urlopen(urllib.request.Request(self.base + path, data=data, headers=h), timeout=5) as r:
                t = r.read().decode()
                return r.status, (json.loads(t) if t.startswith('{') else t)
        except urllib.error.HTTPError as e:
            with e:
                t = e.read().decode()
            return e.code, (json.loads(t) if t.startswith('{') else t)

    def test_launch(self):
        self.assertEqual(self.call('/api/launch', {'id': A, 'build': 23}), (200, {'ok': True, 'counted': True, 'returning': False}))
        self.assertEqual(self.call('/api/launch', {'id': 'nope'})[0], 400)
        self.assertEqual(self.call('/api/launch', {'id': A.upper()})[0], 400)
        self.assertEqual(self.call('/api/launch', raw=b'hello')[0], 400)
        self.assertEqual(self.call('/api/launch', raw=b'[1]')[0], 400)
        self.assertEqual(self.call('/api/launch', raw=b'a' * 20000)[0], 413)
        self.assertEqual(self.call('/api/launch', {'id': A}, {'Origin': 'https://evil.example'})[0], 403)
        self.assertEqual(self.call('/api/launch', {'id': A}, {'Origin': 'https://stompymechs.graham.pub'})[0], 200)
        # a crawler is answered politely and not counted
        self.assertEqual(self.call('/api/launch', {'id': B}, {'User-Agent': 'Googlebot/2.1'}), (200, {'ok': True, 'counted': False}))
        self.assertIsNone(self.store.db.execute('SELECT 1 FROM visitors WHERE id = ?', (B,)).fetchone())
        # a build that is not a small whole number is filed as 0, not refused
        self.assertEqual(self.call('/api/launch', {'id': C, 'build': 'DROP TABLE'})[0], 200)
        self.assertEqual(self.store.db.execute('SELECT build FROM launches WHERE visitor = ?', (C,)).fetchone()[0], 0)

    def test_feedback(self):
        st, r = self.call('/api/feedback', {'id': A, 'build': 23, 'kind': 'contract', 'text': ' <script>x</script>\x07 ', 'ctx': {'site': 'Mirren Flow', 'result': 'won'}})
        self.assertEqual((st, r['ok']), (200, True))
        row = self.store.db.execute('SELECT visitor, build, kind, text, ctx FROM feedback WHERE n = ?', (r['n'],)).fetchone()
        self.assertEqual(row, (A, 23, 'contract', '<script>x</script>', '{"site":"Mirren Flow","result":"won"}'))
        self.assertEqual(self.call('/api/feedback', {'text': '   '})[0], 400)
        self.assertEqual(self.call('/api/feedback', {'text': 7})[0], 400)
        self.assertEqual(self.call('/api/feedback', {'id': 'nope', 'text': 'hello'})[0], 400)
        st, r = self.call('/api/feedback', {'text': 'no id, odd kind, a context too long to keep', 'kind': 'weird', 'ctx': {'x': 'y' * 5000}})
        self.assertEqual(st, 200)
        self.assertEqual(self.store.db.execute('SELECT visitor, kind, ctx FROM feedback WHERE n = ?', (r['n'],)).fetchone(), ('', 'general', '{}'))

    def test_reading_is_local_only(self):
        st, r = self.call('/stats?days=2')
        self.assertEqual((st, len(r['daily'])), (200, 2))
        self.assertIn('people', r['totals'])
        self.assertEqual(self.call('/stats', headers={'X-Real-IP': '1.2.3.4'})[0], 403)
        self.assertEqual(self.call('/feedback', headers={'X-Forwarded-For': '1.2.3.4'})[0], 403)
        self.assertEqual(self.call('/feedback?limit=1')[0], 200)
        self.assertEqual(self.call('/api/health'), (200, {'ok': True}))

    def test_other_paths(self):
        self.assertEqual(self.call('/api/nope', {})[0], 404)
        self.assertEqual(self.call('/api/stats')[0], 404)            # nothing under /api/ reads anything back
        self.assertEqual(self.call('/index.html'), (200, '<p>the page</p>'))
        self.assertEqual(self.call('/../t.db')[0], 404)              # --static serves its own directory and nothing above it


if __name__ == '__main__':
    unittest.main(verbosity=1)
