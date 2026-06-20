#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
OUT="$ROOT/screenshots"
mkdir -p "$OUT"

URL="${1:-http://127.0.0.1:3000}"

if ! command -v npx >/dev/null 2>&1; then
  echo "npx not found; cannot run Playwright screenshot smoke."
  exit 1
fi

cat > "$OUT/screenshot-smoke.mjs" <<'JS'
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:3000";
const out = process.argv[3] || "screenshots/home.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`Screenshot saved to ${out}`);
JS

npx playwright install chromium >/dev/null 2>&1 || true
node "$OUT/screenshot-smoke.mjs" "$URL" "$OUT/home.png"
