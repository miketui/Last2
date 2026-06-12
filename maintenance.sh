#!/usr/bin/env bash
set -Eeuo pipefail

echo "[maintenance] refreshing dependencies if needed"

if [[ -f pnpm-lock.yaml ]]; then
  pnpm install --frozen-lockfile || pnpm install
elif [[ -f package-lock.json ]]; then
  npm ci || npm install
elif [[ -f package.json ]]; then
  pnpm install || npm install
fi

if [[ -d author-site && -f author-site/package.json ]]; then
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
