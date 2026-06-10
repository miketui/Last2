# Codex Author Preorder Setup Package

This package contains the Codex-ready setup for building the Curls & Contemplation author preorder/post-launch commerce site.

## Files

- `setup.sh` — Codex cloud/local setup script
- `AGENTS.md` — repository-level Codex instruction file
- `CODEX_MASTER_PROMPT.md` — master task prompt for Codex
- `CODEX_CLOUD_ENVIRONMENT.md` — Codex environment settings and task sequence
- `.env.example` — variable names only
- `10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md` — page-by-page ACISS/Felt/Textura-inspired design, styling, 3D, motion, cursor trail, and page-transition system
- `11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md` — Supabase, Stripe, MailerLite, Resend, GA4, Sentry, Turnstile, Vercel, analytics, and future subscription setup

## Recommended use

1. Add `AGENTS.md` to the root of `miketui/Last2`.
2. Add or paste `setup.sh` into the Codex cloud environment setup field.
3. Open Codex for `miketui/Last2`.
4. Use the task sequence in `CODEX_CLOUD_ENVIRONMENT.md`.
5. Start with Task 1. Do not ask Codex to do the entire site in one giant pass unless you accept a larger, harder-to-review diff.

## Locked build direction

- Next.js App Router
- Supabase Auth/Database/Private Storage
- Stripe Checkout
- MailerLite + Resend
- Vercel
- Pricing: $17.99 preorder / $19.99 regular
- ACISS premium palette:
  - #111111
  - #B08D57
  - #D8D1C5
  - #145B4B
  - #C7D9D2


## New design/backend additions

This updated package now tells Codex to generate:
- a dedicated immersive design guide,
- page-by-page visual setup,
- first-three-sections emotional layout,
- 3D/motion/page-transition rules,
- a curl/hair-strand cursor trail inspired by the Textura-style cursor-follow idea,
- magnetic curl CTA buttons,
- backend analytics/subscription setup,
- server-side analytics event storage,
- MailerLite automation mapping,
- future Stripe subscription readiness without activating a subscription offer.
