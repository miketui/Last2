#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
REPORT_DIR="$ROOT/reports"
mkdir -p "$REPORT_DIR"
REPORT="$REPORT_DIR/final-report.md"

{
  echo "# Final Harness Report"
  echo ""
  echo "- Date UTC: $(date -u)"
  echo "- Root: $ROOT"
  echo ""
  echo "## Git status"
  echo '```text'
  git status --short || true
  echo '```'
  echo ""
  echo "## Recent reports"
  find "$REPORT_DIR" -maxdepth 1 -type f | sort | sed "s#^$ROOT/##" || true
  echo ""
  echo "## Required final handoff"
  echo ""
  echo "- Objective completed:"
  echo "- Files changed:"
  echo "- Commands run:"
  echo "- Pass/fail results:"
  echo "- Screenshots/reports:"
  echo "- What is real vs scaffolded:"
  echo "- Security risks:"
  echo "- Remaining blockers:"
  echo "- Next recommended action:"
} > "$REPORT"

echo "Final report template written to $REPORT"
