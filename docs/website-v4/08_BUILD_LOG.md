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

## Prompt 3 — Next.js author-commerce app scaffold (2026-06-10)

### Scope
- Created the actual app scaffold under `apps/author-site/` using Next.js App Router, TypeScript strict, Tailwind, Supabase, Stripe, Resend, MailerLite, analytics, and Vercel-ready conventions.
- Did not modify EPUB, POD, release, archive, or publishing build files.
- Did not copy paid release artifacts into `apps/author-site/public/`.
- Did not add real API keys or live payment credentials.
- Did not activate a live subscription offer; membership/subscription items remain schema/env placeholders only.

### App files created
- Core app config: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `middleware.ts`, `.env.example`, `README.md`.
- App Router pages: public, auth/customer, admin, API, dynamic chapter, and dynamic blog routes from the Prompt 3 route list.
- Components: shared commerce/editorial/auth/legal components plus motion/design components for curl trail, magnetic CTA, page transition, scroll reveal, book tilt, and chapter pathway.
- Content/config: `content/site.ts`, `content/book.ts`, `content/chapters.ts`, `content/blog.ts`, `content/worksheets.ts`, `content/faq.ts`, `content/legal-outlines.ts`.
- Libraries: launch mode, env parsing, Supabase clients, Stripe wrapper, entitlements/download signing, email wrappers, analytics/event recording, SEO/schema, admin security, and subscription placeholder modules.
- Supabase migration: `supabase/migrations/0001_author_commerce.sql` with required commerce/customer/analytics/admin tables, RLS enablement, customer self-read policies, service-role/admin intent, and subscription-ready placeholders.
- Tests: launch CTA switching, locked prices, no paid files in public, deprecated hex guard, non-buyer entitlement denial, bad/missing Stripe webhook signature 400, and analytics event exports.

### Commands run and results
- `cd apps/author-site && pnpm install` — passed. Installed Next.js 16.2.9, React 19.2.7, Stripe 22.2.0, Supabase JS 2.108.1, Tailwind 3.4.19, Vitest 4.1.8, and supporting packages. Initial install warned about ignored optional build scripts and peer ranges but completed.
- `cd apps/author-site && pnpm lint` — initially failed because ESLint 10 was incompatible with `eslint-config-next` peer plugins; fixed by pinning ESLint and `@eslint/js` to the ESLint 9 line. A follow-up lint error for `React.ReactNode` and anonymous config export was fixed. Final rerun passed.
- `cd apps/author-site && pnpm typecheck` — initially failed because TypeScript 6 flagged `baseUrl` deprecation and then caught Button prop narrowing plus a pinned Stripe API-version mismatch. Added `ignoreDeprecations`, narrowed Button props safely, and let Stripe use the installed SDK default API version. Final reruns passed.
- `cd apps/author-site && pnpm test` — initially failed because the deprecated-color test included the forbidden hex strings in its own source. Reworked the test to construct the patterns without committing forbidden hex literals. Final rerun passed: 6 files, 9 tests.
- `cd apps/author-site && pnpm build` — passed. Next generated 49 app routes successfully. Build emitted a framework warning that the `middleware` convention is deprecated in favor of `proxy`, but the requested `middleware.ts` remains in place for Prompt 3 compatibility.
- `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E '#0E0D0B|#B89968|#1F6F6B|#2B9999|#C9A961' apps/author-site docs/website-v4 || true` — completed. Matches are only in the locked docs token spec where deprecated colors are documented as forbidden; no new app-code usage was reported.
- `find apps/author-site/public -type f | grep -Ei '.(epub|pdf)$' && exit 1 || true` — passed with no EPUB/PDF files in public.

### Fixes applied
- Pinned ESLint to a compatible major line for `eslint-config-next`.
- Added TypeScript 6 deprecation acknowledgement for `baseUrl`.
- Fixed `Button` link/button prop narrowing.
- Removed stale explicit Stripe API version to compile against installed Stripe SDK types.
- Adjusted static security test so it does not itself contain deprecated color literals.

### What is real vs scaffolded
Real in this scaffold:
- Route tree, app configuration, ACISS tokens, locked price config, launch-mode CTA switching, server-side checkout price selection, webhook signature verification path, protected download denial/signing path, admin allowlist gate, private Storage object-path references, event map, internal analytics insert scaffold, and Supabase migration/RLS intent.

Still scaffolded / requires production setup:
- Supabase project credentials, actual private Storage bucket upload, Stripe live/test products and webhook endpoint, MailerLite groups/automations, Resend templates, Turnstile verification, real admin data views, GA4/PostHog browser activation, final legal copy, final domain, final external Kindle/paperback links, and production deployment.

### Security notes
- No `.env` values or real credentials were committed.
- Paid EPUB/PDF artifacts were not copied into `public/`.
- Checkout fails closed when Stripe server env/price IDs are absent.
- Webhook rejects missing/bad signature with 400.
- Downloads deny by default when no authenticated entitlement is found.
- Admin pages are noindex and gated by an `ADMIN_EMAILS` scaffold; production should also back this with `admin_users` table checks.

### Recommendation for Prompt 4
Prompt 4 should harden the immersive design/motion pass: convert `middleware.ts` to the newer Next.js `proxy` convention while preserving requested protections, refine responsive page layouts, expand reduced-motion testing, add screenshots for the visible home/preorder/download states, and replace placeholder copy with final claim-verified excerpts from `06_WEBSITE_COPY_v4.md` without inventing new claims.

## Prompt 4 — Immersive Design, Motion, Responsive Polish, and Claim-Safe UX Hardening (2026-06-10)

### Scope
- Hardened only the existing Next.js author-commerce app under `apps/author-site/` plus Prompt 4 documentation and QA notes.
- Did **not** modify EPUB, POD, book manuscript, release artifacts, archive files, or publishing build files.
- Did **not** use real API keys, activate live payments, deploy production, or create a live subscription offer.

### Pre-edit audit findings
- Initial `git status --short` showed existing untracked `tools/` and `validation-reports/` directories from prior validation work; Prompt 4 did not alter publishing artifacts.
- Initial `find apps/author-site -maxdepth 4 -type f | sort | sed 's#^#- #' | head -250` confirmed the scaffold already contained all required app routes, route handlers, motion components, ACISS styles, tests, Supabase migration, and app README.
- Home page existed but its first three sections were structurally minimal and did not yet carry the required Recognition → Problem/Relief → Authority/path emotional pacing.
- Motion components existed but needed stronger route exclusions, reduced-motion behavior, focus states, coarse-pointer disabling, and lower-impact transform/opacity animation.
- Checkout/auth/download/admin/legal surfaces were readable but visually sparse; they needed low-motion polish, clearer empty/scaffold states, and mobile-safe spacing.

### Files changed
- Updated public and utility routes across `apps/author-site/app/` for stronger ACISS hierarchy, safer copy, responsive sections, and clear CTA hierarchy.
- Reworked immersive components: `BookHero`, `BookMockup`, `Header`, `LaunchModeCTA`, design shells, and admin/customer/legal utility shells.
- Hardened motion files: `CurlCursorTrail`, `MagneticCurlButton`, `BookTilt`, `ChapterPathway`, `PageTransition`, `ScrollReveal`, and `ReducedMotionProvider`.
- Added route/motion policy helpers: `apps/author-site/lib/route-policy.ts` and `apps/author-site/lib/motion-policy.ts`.
- Migrated `apps/author-site/middleware.ts` to `apps/author-site/proxy.ts` for Next.js 16 while preserving protected-route noindex behavior.
- Added `apps/author-site/public/.gitkeep` so static security checks can inspect an empty public directory without placing paid assets there.
- Added tests: `tests/motion-static.test.ts` and `tests/route-protection.test.ts`; updated launch CTA expectations for the locked visible CTA labels.

### Design and motion improvements
- Home section 1 now leads with Recognition: “You learned the craft. Nobody taught you the business,” includes layered book presence, direct preorder CTA, free chapter CTA, subtle hairline visual styling, and only claim-safe credibility language.
- Home section 2 now names the unspoken problem across pricing, networking, on-set etiquette, burnout, leadership, and freelance uncertainty.
- Home section 3 now presents the four-part pathway with worksheets/resources/career-map context and a bridge to preorder/book exploration.
- Public pages received a consistent premium PageHero system, editorial panels, mobile-first spacing, ACISS-only colors, and clearer one-primary-action hierarchy.
- Auth, dashboard, downloads, admin, and legal pages remain low-motion, readable, and scaffold-explicit.
- Curl cursor trail is desktop/fine-pointer only, disabled for reduced motion and excluded routes, uses pointer-events none, low opacity SVG strand marks, and requestAnimationFrame updates.
- Magnetic CTA now has subtle hover-only magnetism, visible keyboard focus, reduced-motion fallback, disabled/loading safeguards, and readable label treatment.
- Book tilt, pathway, scroll reveal, and page transitions now avoid heavy animation on checkout/auth/dashboard/download/admin/legal routes and fall back to static states under reduced motion.

### Middleware/proxy decision
- Installed Next.js resolved to `16.2.9`; Next.js 16 supports the `proxy.ts` convention and deprecates `middleware.ts`.
- Migrated the existing middleware logic to `apps/author-site/proxy.ts` using `export function proxy(request)` and preserved `x-author-site` plus `X-Robots-Tag: noindex, nofollow` for protected route prefixes.
- Removed `apps/author-site/middleware.ts` to avoid the Next.js 16 deprecation warning.

### Screenshot attempt result
- Started Next.js dev server successfully at `http://127.0.0.1:3000`.
- Ran `pnpm dlx playwright@latest install chromium`; Playwright browser download completed.
- Screenshot capture failed before rendering because Playwright Chromium could not load the required system library `libatk-1.0.so.0` in this container.
- No screenshot PNGs were produced; this is an environment dependency blocker, not an app build blocker.

### Tests added / improved
- Added static and policy tests for curl cursor reduced-motion disabling, excluded route patterns, pointer-events none, fine pointer gate, and requestAnimationFrame use.
- Added static test coverage for MagneticCurlButton focus-visible/reduced-motion/disabled safeguards.
- Added route protection tests for protected route prefixes, proxy convention, and noindex metadata behavior.
- Preserved and updated locked pricing and launch-mode CTA tests.
- Static security checks continue to assert deprecated colors are absent and paid EPUB/PDF files are not in `public/`.

### Commands run and results
- PASS: `git status --short`
- PASS: `find apps/author-site -maxdepth 4 -type f | sort | sed 's#^#- #' | head -250`
- PASS: `cd apps/author-site && pnpm install`
- FAIL then fixed: `cd apps/author-site && pnpm lint` initially flagged synchronous setState in motion effects; fixed by deferring pointer-media initialization and avoiding immediate effect state clearing.
- PASS after fix: `cd apps/author-site && pnpm lint`
- PASS: `cd apps/author-site && pnpm typecheck`
- FAIL then fixed: `cd apps/author-site && pnpm test` initially found a missing `public/` directory and a too-literal noindex string assertion; fixed with `public/.gitkeep` and metadata-aligned assertions.
- PASS after fix: `cd apps/author-site && pnpm test`
- PASS: `cd apps/author-site && pnpm build`
- PASS: `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E '#0E0D0B|#B89968|#1F6F6B|#2B9999|#C9A961' apps/author-site || true`
- PASS: `find apps/author-site/public -type f | grep -Ei '.(epub|pdf)$' && exit 1 || true`
- WARNING: `pnpm dlx playwright@latest screenshot ...` blocked by missing container library `libatk-1.0.so.0`.

### What is real vs scaffolded
- Real: ACISS-aligned responsive UI structure, route pages, noindex/proxy headers for protected surfaces, motion route exclusions, reduced-motion handling, static/security tests, private-delivery references, locked pricing, and claim-safe copy discipline.
- Scaffolded: Stripe checkout activation, Supabase Auth sessions, Supabase private Storage signed URL delivery, MailerLite/Resend production sends, admin data, analytics dashboards, media-kit assets, and any future subscription/resource-library offer.

### Remaining visual risks
- Browser screenshots could not be generated in this environment; a human should run Playwright or Vercel preview screenshots on a machine with Chromium system dependencies.
- Final typography should be reviewed once production fonts/assets are approved.
- Book mockup remains CSS-rendered until final approved cover art is provided.
- Copy is intentionally conservative; any stronger author credibility language requires fresh evidence and approval through `marketing/website/claims-evidence.md`.

### Recommendation for Prompt 5
- Prompt 5 should focus on backend/security implementation hardening only after owner-provided sandbox credentials are available: Supabase Auth/DB/RLS/private Storage wiring, Stripe Checkout/webhook integration with signature verification, entitlement creation/revocation, Resend/MailerLite test-mode flows, and admin data access checks. Do not activate production payments or subscriptions until Michael explicitly approves the offer and keys.
