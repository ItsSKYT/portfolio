#!/usr/bin/env bash
# Zero-downtime deploy of skyt.dev on the VPS (pm2 process "SKYT": `next start` on 127.0.0.1:3010).
# Builds main in a fresh clone next to the live site, smoke-tests it on a spare port,
# then swaps directories and restarts only SKYT. The previous version stays in $APP-prev for rollback.
#
#   bash scripts/deploy-vps.sh            deploy origin/main
#   bash scripts/deploy-vps.sh rollback   swap back to the previous version
set -euo pipefail

APP=/root/portfolio
NEW=$APP-new
PREV=$APP-prev
REPO=https://github.com/ItsSKYT/portfolio.git
PM2_NAME=SKYT
SMOKE_PORT=3019

if [[ "${1:-}" == "rollback" ]]; then
  [[ -d $PREV ]] || { echo "no $PREV to roll back to"; exit 1; }
  mv "$APP" "$APP-failed-$(date +%s)"
  mv "$PREV" "$APP"
  pm2 restart "$PM2_NAME" --update-env
  echo "rolled back to $(git -C "$APP" log --oneline -1)"
  exit 0
fi

rm -rf "$NEW"
git clone --quiet --branch main "$REPO" "$NEW"
cd "$NEW"
echo "building $(git log --oneline -1)"
npm ci --no-audit --no-fund
SITE_URL=https://skyt.dev npm run build

# Smoke test on a spare port before touching the live site.
PORT=$SMOKE_PORT node node_modules/next/dist/bin/next start --hostname 127.0.0.1 > /tmp/skyt-smoke.log 2>&1 &
SMOKE=$!
trap 'kill $SMOKE 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do curl -sf -o /dev/null "http://127.0.0.1:$SMOKE_PORT/" && break; sleep 0.5; done
code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$SMOKE_PORT/")
og=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$SMOKE_PORT/opengraph-image")
kill $SMOKE 2>/dev/null || true
trap - EXIT
if [[ "$code" != 200 || "$og" != 200 ]]; then
  echo "smoke test failed (/ $code, og $og); live site untouched"; tail -20 /tmp/skyt-smoke.log; exit 1
fi

rm -rf "$PREV"
mv "$APP" "$PREV"
mv "$NEW" "$APP"
pm2 restart "$PM2_NAME" --update-env
sleep 2
live=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3010/)
echo "live on :3010 -> $live ($(git -C "$APP" log --oneline -1))"
if [[ "$live" != 200 ]]; then
  echo "live check failed, rolling back"
  mv "$APP" "$APP-failed-$(date +%s)"
  mv "$PREV" "$APP"
  pm2 restart "$PM2_NAME" --update-env
  exit 1
fi
