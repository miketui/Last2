# 13_SANDBOX_TEST_RESULTS_TEMPLATE — Prompt 6 Verification Worksheet

Fill this out only after sandbox credentials are configured. Do not paste secrets into this file.

| Area | Check | Status | Evidence / Notes | Owner | Date |
|---|---|---:|---|---|---|
| Supabase | Supabase project created | ☐ |  |  |  |
| Supabase | Migration applied | ☐ |  |  |  |
| Supabase | RLS verified | ☐ |  |  |  |
| Supabase Storage | Private bucket `curls-deliverables` created | ☐ |  |  |  |
| Supabase Storage | EPUB uploaded to private path | ☐ | `books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub` |  |  |
| Supabase Storage | PDF uploaded to private path | ☐ | `books/curls-and-contemplation/pdf/CurlsAndContemplation-POD-Royal-v8-20260610.pdf` |  |  |
| Downloads | Signed URL test passed | ☐ |  |  |  |
| Downloads | Unauthenticated download denied | ☐ |  |  |  |
| Downloads | Refunded purchase denied | ☐ |  |  |  |
| Stripe | Stripe test product created | ☐ | Curls & Contemplation — Direct Preorder / Regular Edition |  |  |
| Stripe | Stripe test price preorder created | ☐ | $17.99 |  |  |
| Stripe | Stripe test price regular created | ☐ | $19.99 |  |  |
| Stripe | Stripe webhook endpoint created | ☐ | `/api/stripe/webhook` |  |  |
| Stripe | Stripe CLI replay passed | ☐ |  |  |  |
| Resend | Resend domain/sender verified | ☐ |  |  |  |
| Resend | Resend test emails sent | ☐ |  |  |  |
| MailerLite | MailerLite groups created | ☐ | Subscribers, Free Chapter, Preorders, Customers, Abandoned Checkout, Bonus Claim Started, Bonus Claim Completed, Refunded, Blog Readers, VIP / Early Readers |  |  |
| MailerLite | MailerLite add subscriber test passed | ☐ |  |  |  |
| Turnstile | Turnstile test passed or intentionally skipped | ☐ |  |  |  |
| Analytics | Analytics consent test passed | ☐ |  |  |  |
| Security | No secrets committed | ☐ |  |  |  |
| Security | No public paid files | ☐ |  |  |  |
| Launch Gate | Production activation still blocked | ☐ |  |  |  |

## Required command evidence

```bash
cd apps/author-site
pnpm check:sandbox
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Record command output summaries only. Never paste keys, signed URLs, private customer data, or full email payloads.
