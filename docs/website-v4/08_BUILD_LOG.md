<!--
Curls & Contemplation Website v4 planning package.
Controlled by docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 08_BUILD_LOG — Prompt 2 Documentation Package

## Prompt 2 scope
Create the full v4 planning/spec package under `docs/website-v4/` only. Do not scaffold the Next.js app, do not create `apps/author-site/`, do not modify release/book/build/archive/publishing files, do not use real API keys, and do not activate live payments.

## Files created
- `docs/website-v4/01_WEBSITE_PRD_v4.md`
- `docs/website-v4/02_SITE_TREE_AND_FILE_MAP.md`
- `docs/website-v4/03_ACISS_TOKENS_SPEC_v2.md`
- `docs/website-v4/04_FUNNEL_v4.md`
- `docs/website-v4/05_PAGE_PLAN_WIREFRAMES.md`
- `docs/website-v4/06_WEBSITE_COPY_v4.md`
- `docs/website-v4/07_WORKFLOW_AND_KEYS.md`
- `docs/website-v4/08_BUILD_LOG.md`
- `docs/website-v4/09_LAUNCH_QA_CHECKLIST.md`
- `docs/website-v4/10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md`
- `docs/website-v4/11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md`

## Conflicts resolved
- Old v3 website materials referenced Vite/Bun/SQLite and older pricing. v4 locks Next.js App Router, TypeScript strict, Tailwind, Supabase, Stripe, Resend, MailerLite, and Vercel.
- Old v3 pricing references `$15.99` preorder and `$17.99` regular were superseded. v4 uses `$17.99` preorder/direct launch and `$19.99` regular direct.
- Older `FINAL` artifact names in the release manifest are superseded by v8 release artifacts.
- Deprecated palette values are documented as banned/deprecated and replaced with locked ACISS tokens.
- Subscription-ready schema is planned without activating a subscription offer.

## Release artifact names confirmed
- EPUB: `release/Curls-and-Contemplation-v8-20260610.epub`.
- PDF: `release/CurlsAndContemplation-POD-Royal-v8-20260610.pdf`.
- These are production source artifacts for later upload to Supabase private Storage, not web-public files.

## Pricing normalization
- Preorder/direct launch: `$17.99`.
- Regular direct: `$19.99`.
- Kindle external bare ebook: `$9.99`.
- Paperback/POD external placeholder: `$29.99`.

## Claims-gating decisions
- No awards, bestseller language, testimonials, sales numbers, celebrity/name claims, or guaranteed outcomes are asserted.
- Author/industry credibility claims beyond basic book facts are tagged `[VERIFY: claims-evidence.md]`.
- Legal pages remain outlines until human/attorney review.

## What was intentionally not built yet
- No `apps/author-site/` app scaffold.
- No Next.js routes or package files.
- No Supabase migrations executed.
- No Stripe products created or live payments activated.
- No release EPUB/PDF copied or moved.
- No web build/test commands run because the app does not exist yet.

## Recommendation for Prompt 3
Scaffold `apps/author-site/` as a strict TypeScript Next.js App Router project using the specs in `docs/website-v4/01` through `11`; implement route shells, ACISS tokens, core components, typed config, `.env.example` variable names only, Supabase migrations, Stripe test-mode route handlers with signature-verified webhook, protected-download server logic, MailerLite/Resend typed integration stubs, tests, and then run `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` from `apps/author-site/`.
