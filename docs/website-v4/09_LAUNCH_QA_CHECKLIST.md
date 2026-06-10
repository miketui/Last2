<!--
Curls & Contemplation Website v4 planning package.
Controlled by docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 09_LAUNCH_QA_CHECKLIST — v4 Gates

## 1. Pre-build gates
- [ ] Confirm `docs/website-v4/00_REPO_AUDIT.md` remains controlling repo truth.
- [ ] Confirm no existing authoritative app supersedes `apps/author-site/`.
- [ ] Confirm v8 release artifact names.
- [ ] Confirm launch mode for build environment.
- [ ] Confirm domain or continue using `{{DOMAIN}}`/`NEXT_PUBLIC_SITE_URL` placeholders.

## 2. Design QA
- [ ] ACISS palette only: `#111111`, `#B08D57`, `#D8D1C5`, `#145B4B`, `#C7D9D2`.
- [ ] Deprecated hex values absent from app code.
- [ ] First three home sections are Recognition, Relief, Authority/path.
- [ ] Editorial spacing and typography are readable on mobile.
- [ ] CTAs are visible without fake urgency.
- [ ] Screenshots taken for perceptible web-app changes in Prompt 3+.

## 3. Accessibility QA
- [ ] WCAG 2.2 AA contrast checked.
- [ ] Keyboard navigation works.
- [ ] Focus states visible.
- [ ] Forms have labels/errors.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Cursor trail disabled on coarse pointer/reduced motion.
- [ ] Legal/accessibility contact present.

## 4. Security QA
- [ ] No secrets committed.
- [ ] `.env.example` contains variable names only.
- [ ] Service role key used server-only.
- [ ] Admin routes require `admin_users` authorization.
- [ ] Turnstile verified on unauthenticated forms.
- [ ] Sentry does not log secrets/customer-sensitive payloads.

## 5. Payment QA
- [ ] Stripe Checkout uses server-side price selection.
- [ ] Preorder price is `$17.99`.
- [ ] Regular direct price is `$19.99`.
- [ ] Paused mode blocks checkout creation.
- [ ] Success/cancel URLs use `NEXT_PUBLIC_SITE_URL`.
- [ ] Test cards complete expected flows.

## 6. Webhook QA
- [ ] Raw body signature verification tested.
- [ ] Bad signature returns 400.
- [ ] Event idempotency prevents duplicate orders.
- [ ] `checkout.session.completed` creates order/purchase.
- [ ] `checkout.session.expired` records abandoned checkout.
- [ ] Refund event revokes entitlement.

## 7. Download entitlement QA
- [ ] Paid files uploaded to Supabase private Storage only.
- [ ] No EPUB/PDF under app `public/`.
- [ ] Signed URL requires active entitlement.
- [ ] Refunded purchase cannot download.
- [ ] Download limits enforced or clearly configured.
- [ ] Download events recorded.

## 8. Email QA
- [ ] MailerLite groups exist.
- [ ] Free chapter delivery tested.
- [ ] Preorder confirmation tested.
- [ ] Purchase confirmation tested.
- [ ] Refund/access revocation tested.
- [ ] Unsubscribe/consent behavior respected.

## 9. Analytics QA
- [ ] GA4 measurement ID configured.
- [ ] Consent mode defaults correctly.
- [ ] Server-side `analytics_events` records critical events.
- [ ] Funnel events have consistent names.
- [ ] Admin analytics excludes sensitive data.

## 10. Legal/trust QA
- [ ] Privacy, Terms, Refund, Preorder, Digital Delivery, Cookies, Accessibility pages present.
- [ ] Legal pages reviewed before launch.
- [ ] Claims checked against `claims-evidence.md`.
- [ ] No fake reviews/testimonials/bestseller/awards.
- [ ] FTC preorder obligations reviewed.

## 11. Launch-mode QA
- [ ] `preorder` mode routes and CTAs correct.
- [ ] `launched` mode routes and CTAs correct.
- [ ] `paused` mode disables checkout and points to email/contact.
- [ ] Mode changes do not require code edits beyond env/config.

## 12. Production deploy QA
- [ ] Vercel root directory set to `apps/author-site`.
- [ ] Production env vars set.
- [ ] Domain configured.
- [ ] HTTPS active.
- [ ] Sitemap/robots valid.
- [ ] Sentry release and alerts configured.

## 13. Post-launch monitoring QA
- [ ] Stripe webhook logs monitored.
- [ ] Supabase errors monitored.
- [ ] Sentry alerts routed.
- [ ] Download failures reviewed daily during launch.
- [ ] Support inbox monitored.
- [ ] Refund/revocation process tested after first real refund.

## Prompt 4 design, motion, and accessibility QA additions

- [ ] Run visual screenshots for desktop 1440px, tablet 768px, and mobile 390px in an environment with Playwright/Chromium system dependencies installed.
- [ ] Verify home page first impression reads as Recognition → Unspoken Problem → Relief/Authority Path before any purchase pressure.
- [ ] Confirm curl cursor trail is absent on touch/coarse-pointer devices, reduced-motion settings, auth routes, buy/checkout paths, dashboard/downloads, admin, and legal pages.
- [ ] Confirm all primary CTAs remain readable and keyboard focus-visible with reduced motion enabled.
- [ ] Confirm legal/admin/auth/download pages remain low-motion and do not show decorative cursor or heavy transitions.
- [ ] Review final production cover art placement when approved; current book visual is a CSS mockup, not a release asset copy.
- [ ] Re-check all public credibility language against `marketing/website/claims-evidence.md` immediately before launch.
- [ ] Confirm no EPUB/PDF files exist under `apps/author-site/public/` before deployment.

## Prompt 5 backend/security/payment/download/email/analytics QA additions

- [ ] Apply `apps/author-site/supabase/migrations/0001_author_commerce.sql` to a Supabase sandbox and verify every RLS policy with anon, authenticated customer, admin, and service-role clients.
- [ ] Create private Supabase Storage bucket `curls-deliverables` with no public read policy.
- [ ] Upload EPUB to `books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub` and PDF to `books/curls-and-contemplation/pdf/CurlsAndContemplation-POD-Royal-v8-20260610.pdf` in the private bucket.
- [ ] Confirm `/api/downloads/sign` returns typed denials for unauthenticated, no purchase, refunded, revoked, over-limit, config-missing, and storage-error cases.
- [ ] Confirm signed download URLs expire after 24 hours and do not reveal local `release/` or app `public/` paths.
- [ ] Create Stripe test-mode preorder and regular one-time prices; verify checkout ignores client-provided price IDs and chooses server-side env price IDs.
- [ ] Configure Stripe test webhook endpoint at `/api/stripe/webhook`; replay missing/bad signature, checkout completed, expired checkout, and refund events.
- [ ] Confirm refund webhook sets purchase status to refunded/revoked and prevents future downloads.
- [ ] Configure MailerLite groups for Subscribers, Free Chapter, Preorders, Customers, Abandoned Checkout, Bonus Claim Started, Bonus Claim Completed, Refunded, Blog Readers, and VIP / Early Readers.
- [ ] Configure Resend verified sender plus SPF/DKIM/DMARC before any real recipient send.
- [ ] Confirm free chapter route never returns a fake public download URL when email/provider assets are not configured.
- [ ] Confirm consent banner blocks marketing analytics until consent is granted while server operational events still record security/order/download events.
- [ ] Verify admin pages are noindex, deny non-admins, and show “connect Supabase to view real data” scaffold state until sandbox admin data is wired.
- [ ] Run static checks for no `.env.local`, no secret-looking values, no paid EPUB/PDF in public, no deprecated hexes, raw-body Stripe webhook verification, and no service-role key usage in client components before every deploy.

## Prompt 6 sandbox integration readiness QA additions

- [ ] Copy `.env.sandbox.example` into a local-only file and confirm no real secrets are committed.
- [ ] Run `cd apps/author-site && pnpm check:sandbox`; document missing providers as skipped, not failed, unless a dangerous live value is detected.
- [ ] Apply Supabase migration in sandbox and verify RLS is enabled for every Prompt 5 table.
- [ ] Verify private bucket `curls-deliverables` exists, is not public, and contains the locked EPUB/PDF object paths.
- [ ] Verify `/api/downloads/sign` grants signed URLs only to active entitled users and denies unauthenticated, refunded, revoked, and over-limit cases.
- [ ] Verify Stripe test-mode products/prices exist for `$17.99` preorder and `$19.99` regular direct.
- [ ] Replay Stripe webhook events in test mode: `checkout.session.completed`, `checkout.session.expired`, and `charge.refunded`.
- [ ] Verify Resend sandbox messages for order confirmation, download access, free chapter, bonus claim received, refund/access revoked, and support receipt.
- [ ] Verify MailerLite sandbox subscriber add/update and group assignment; confirm no production broadcast or automation is touched.
- [ ] Verify Turnstile sandbox/test behavior or record an intentional skip with remediation.
- [ ] Verify analytics consent behavior and confirm server-side operational payloads contain no signed URLs, secrets, tokens, or full PII.
- [ ] Confirm production activation is still blocked: no live keys, no live payments, no production deploy, no live subscription offer.
