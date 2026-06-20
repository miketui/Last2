# Provider Sandbox Checklist

Use this before production provider setup.

## Rules

- Use test/sandbox credentials only.
- Do not paste real secrets into committed files.
- Do not activate live payments.
- Do not send real customer emails.
- Do not use production storage buckets for test work.

## Checks

- [ ] Auth provider configured in sandbox.
- [ ] Payment provider configured in test mode.
- [ ] Webhook endpoint receives test events.
- [ ] Webhook signature verification rejects invalid signatures.
- [ ] Email provider can send to approved test address.
- [ ] Private storage access is denied by default.
- [ ] Entitled access grants only expected file/path.
- [ ] Refund/revocation behavior verified.
