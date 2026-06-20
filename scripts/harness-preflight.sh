#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
REPORT_DIR="$ROOT/reports"
mkdir -p "$REPORT_DIR"

REPORT="$REPORT_DIR/preflight-report.md"
echo "# Harness Preflight" > "$REPORT"
echo "" >> "$REPORT"
echo "- Date UTC: $(date -u)" >> "$REPORT"
echo "- Root: $ROOT" >> "$REPORT"
echo "" >> "$REPORT"

check_file() {
  local file="$1"
  if [[ -e "$ROOT/$file" ]]; then
    echo "- OK: $file" | tee -a "$REPORT"
  else
    echo "- MISSING: $file" | tee -a "$REPORT"
  fi
}

echo "Checking harness files..."
check_file "AGENTS.md"
check_file "CLAUDE.md"
check_file "SKILLS.md"
check_file "qa-checklist.md"
check_file "build-log.md"
check_file "scripts/harness-validate.sh"
check_file "scripts/secret-scan.sh"

echo "" >> "$REPORT"
echo "## Tool inventory" >> "$REPORT"

for cmd in git node npm pnpm python3 bash jq npx; do
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "- $cmd: $(command -v "$cmd")" >> "$REPORT"
  else
    echo "- $cmd: not found" >> "$REPORT"
  fi
done

echo "Preflight written to reports/preflight-report.md"
