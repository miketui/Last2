#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(pwd)"
REPORT_DIR="$ROOT/reports/setup"
mkdir -p "$REPORT_DIR"

log() { printf "\n[%s] %s\n" "$(date -u +%H:%M:%S)" "$*"; }
warn() { printf "\n[WARN] %s\n" "$*" >&2; }

log "Harness setup starting at $ROOT"

{
  echo "date_utc=$(date -u)"
  echo "pwd=$ROOT"
  echo "system=$(uname -a 2>/dev/null || true)"
  echo "node=$(node --version 2>/dev/null || true)"
  echo "npm=$(npm --version 2>/dev/null || true)"
  echo "pnpm=$(pnpm --version 2>/dev/null || true)"
  echo "python=$(python3 --version 2>/dev/null || true)"
  echo "git=$(git --version 2>/dev/null || true)"
} | tee "$REPORT_DIR/inventory.txt"

if command -v corepack >/dev/null 2>&1; then
  log "Enabling Corepack"
  corepack enable || true
  corepack prepare pnpm@latest --activate || true
fi

if [[ -f package.json ]]; then
  log "Installing root dependencies"
  if [[ -f pnpm-lock.yaml ]]; then
    pnpm install --frozen-lockfile || pnpm install
  elif [[ -f package-lock.json ]]; then
    npm ci || npm install
  else
    pnpm install || npm install
  fi
else
  warn "No root package.json found."
fi

if [[ -d author-site && -f author-site/package.json ]]; then
  log "Installing author-site dependencies"
  (
    cd author-site
    if [[ -f pnpm-lock.yaml ]]; then
      pnpm install --frozen-lockfile || pnpm install
    elif [[ -f package-lock.json ]]; then
      npm ci || npm install
    else
      pnpm install || npm install
    fi
  )
fi

log "Running harness preflight"
bash scripts/harness-preflight.sh || warn "Preflight reported warnings."

log "Setup complete"
