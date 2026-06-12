# qa-checklist.md

## Local QA

```bash
bash scripts/harness-preflight.sh
bash scripts/harness-validate.sh
bash scripts/harness-report.sh
```

## App QA

- [ ] Install dependencies.
- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] Build passes.
- [ ] No real secrets committed.
- [ ] No paid/private deliverables in public assets.
- [ ] Critical flows are readable and low-motion.
- [ ] Desktop screenshot captured.
- [ ] Mobile screenshot captured.

## Provider QA

- [ ] Sandbox/test provider values only.
- [ ] Auth tested.
- [ ] Payment test flow tested.
- [ ] Webhook signature verification tested.
- [ ] Download entitlement tested.
- [ ] Email sandbox tested.
- [ ] Analytics consent behavior tested.

## Production gate

Do not go production-live until:

- [ ] Legal approval.
- [ ] Claims approval.
- [ ] Final domain approved.
- [ ] Final assets approved.
- [ ] Provider-backed sandbox checks pass.
- [ ] Human explicitly approves live activation.
