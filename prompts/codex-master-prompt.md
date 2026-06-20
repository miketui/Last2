# Codex Master Prompt

Read `AGENTS.md`, `SKILLS.md`, `README.md`, `package.json`, `build-log.md`, and `qa-checklist.md` if present.

Task:
[PASTE TASK HERE]

Execution requirements:
- Inspect relevant files before changing anything.
- Use the existing project architecture.
- Make the smallest useful change.
- Run validation.
- Fix failures.
- Produce a final report.

Safety:
- Do not deploy production.
- Do not activate live payment flows.
- Do not commit real environment values.
- Do not place private paid files in public folders.
- Do not delete important files or data without explicit approval.

Validation:
```bash
bash scripts/harness-preflight.sh
bash scripts/harness-validate.sh
bash scripts/harness-report.sh
```

Final output:
- Files changed
- Commands run
- Pass/fail results
- Reports created
- Security risks
- Remaining blockers
- Next action
