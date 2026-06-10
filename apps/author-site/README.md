# Curls & Contemplation Author Site

Production-oriented scaffold for the Next.js App Router author-commerce platform under `apps/author-site/`.

## Local setup

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and fill only development keys. Do not commit real secrets.

## Environment variables

`.env.example` lists launch mode, pricing, Supabase, Stripe, Resend, MailerLite, Turnstile, admin, analytics, and observability variables by name only.

## Supabase setup

Run `supabase/migrations/0001_author_commerce.sql`. Paid EPUB/PDF files must be uploaded to private Storage bucket `curls-deliverables`, not `public/`.

## Stripe setup

Create one-time prices for preorder (`$17.99`) and regular direct (`$19.99`). The checkout API chooses server-side price IDs and never trusts client-provided prices. Webhooks verify `STRIPE_WEBHOOK_SECRET` before handling events.

## MailerLite and Resend

Wrappers fail safely when keys are absent. Configure MailerLite group IDs and Resend sender before production.

## Secure downloads

`/downloads` and `/api/downloads/sign` require a session, check entitlement server-side, deny refunded/revoked/non-buyers, and scaffold a 3 downloads / 7 days cap. Signed URLs are generated from Supabase private Storage.

## Analytics

`lib/analytics.ts` defines the event map. `lib/events/server-analytics.ts` records internal events when Supabase service credentials exist. GA4/PostHog env placeholders are present but not activated as live tracking.

## Deployment

Vercel root directory: `apps/author-site`. Set preview and production env vars separately. Do not deploy production until launch QA and human legal review pass.

## Testing commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Real vs scaffolded

Real: route structure, content/config modules, launch mode CTA logic, server-side price selection, webhook signature verification path, entitlement-denial default, private Storage signing path, RLS migration intent, event map.

Scaffolded: final Supabase project, live Stripe products, MailerLite automations, Resend templates, actual admin data tables UI, Turnstile verification, GA4/PostHog browser activation, production legal copy.
