#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
REPORT_DIR="$ROOT/reports"
mkdir -p "$REPORT_DIR"
REPORT="$REPORT_DIR/validation-report.md"

echo "# Harness Validation Report" > "$REPORT"
echo "- Date UTC: $(date -u)" >> "$REPORT"
echo "- Root: $ROOT" >> "$REPORT"

cd "$ROOT"

echo "" >> "$REPORT"
echo "## Secret scan" >> "$REPORT"
if bash scripts/secret-scan.sh; then
  echo "- PASS: secret scan" >> "$REPORT"
else
  echo "- FAIL: secret scan" >> "$REPORT"
  exit 1
fi

run_package_scripts() {
  local dir="$1"
  [[ -f "$dir/package.json" ]] || return 0
  echo "" >> "$REPORT"
  echo "## Package checks: $dir" >> "$REPORT"

  (
    cd "$dir"
    if command -v pnpm >/dev/null 2>&1; then
      # pnpm forwards trailing args to the script, so --if-present must come first
      pnpm run --if-present lint
      pnpm run --if-present typecheck
      pnpm run --if-present test
      pnpm run --if-present build
      pnpm run --if-present check:sandbox || true
    else
      npm run lint --if-present
      npm run typecheck --if-present
      npm test --if-present
      npm run build --if-present
    fi
  )
}

run_package_scripts "$ROOT"
run_package_scripts "$ROOT/author-site"

echo "Validation complete. Report: $REPORT"
