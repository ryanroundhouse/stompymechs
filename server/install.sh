#!/bin/sh
# sudo sh server/install.sh: put the launch counter and the feedback box on this machine and start them.
# Safe to run again: it replaces the script and the unit, restarts the service and leaves the database alone.
# It does not touch nginx; nginx-stompymechs-api.conf says what to add there.
set -eu
[ "$(id -u)" = 0 ] || { echo "run it as root: sudo sh $0" >&2; exit 1; }
HERE=$(cd "$(dirname "$0")" && pwd)
command -v python3 >/dev/null || { echo "python3 is not installed" >&2; exit 1; }
python3 -c 'import sqlite3, sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)' || { echo "python 3.8 or newer with sqlite3 is needed" >&2; exit 1; }

id stompymechs >/dev/null 2>&1 || useradd --system --user-group --no-create-home --home-dir /var/lib/stompymechs --shell /usr/sbin/nologin stompymechs
install -d -m 0755 /opt/stompymechs
install -m 0644 "$HERE/stompymechs_api.py" /opt/stompymechs/stompymechs_api.py
install -m 0644 "$HERE/stompymechs-api.service" /etc/systemd/system/stompymechs-api.service
systemctl daemon-reload
systemctl enable stompymechs-api.service >/dev/null
systemctl restart stompymechs-api.service

i=0; until python3 -c 'import urllib.request; urllib.request.urlopen("http://127.0.0.1:8377/api/health", timeout=2)' 2>/dev/null; do
  i=$((i + 1)); [ "$i" -lt 10 ] || { echo "the service did not answer on 127.0.0.1:8377; see: journalctl -u stompymechs-api -n 30" >&2; exit 1; }
  sleep 1
done
echo "stompymechs-api is running on 127.0.0.1:8377"
echo "database:  /var/lib/stompymechs/stompymechs.db   (readable by the group 'stompymechs')"
echo "next:      add the location in $HERE/nginx-stompymechs-api.conf to the site's server block, then"
echo "           sudo nginx -t && sudo systemctl reload nginx"
echo "dashboard: sudo usermod -aG stompymechs <the dashboard's user>, or read http://127.0.0.1:8377/stats"
