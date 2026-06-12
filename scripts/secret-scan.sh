#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
REPORT_DIR="$ROOT/reports"
mkdir -p "$REPORT_DIR"
REPORT="$REPORT_DIR/secret-scan-report.md"

echo "# Secret Scan Report" > "$REPORT"
echo "- Date UTC: $(date -u)" >> "$REPORT"

cd "$ROOT"

FOUND=0

echo "Scanning for private env files..."
while IFS= read -r file; do
  echo "- BLOCKER: private env-like file found: $file" | tee -a "$REPORT"
  FOUND=1
done < <(find . -type f \( -name ".env" -o -name ".env.local" -o -name ".env.production" -o -name ".env.sandbox" \) -not -path "./node_modules/*" -not -path "./.git/*")

echo "Scanning for common live secret prefixes..."
if grep -RIn --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude='*.md' \
  -E '(sk_live_|rk_live_|pk_live_|whsec_|-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----)' . > "$REPORT_DIR/secret-scan-matches.log" 2>/dev/null; then
  echo "- REVIEW: possible secret-like matches found in reports/secret-scan-matches.log" | tee -a "$REPORT"
  FOUND=1
else
  echo "- OK: no common live secret patterns detected by this basic scan" | tee -a "$REPORT"
fi

if [[ "$FOUND" -ne 0 ]]; then
  echo "Secret scan found blockers/review items."
  exit 1
fi

echo "Secret scan passed."
