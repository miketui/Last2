# Claude Code Task Prompt

Read `CLAUDE.md`, `AGENTS.md`, `SKILLS.md`, `package.json`, `build-log.md`, and `qa-checklist.md` if present.

Task:
[PASTE TASK HERE]

Rules:
- Inspect before editing.
- Stay inside the correct project scope.
- Make small, reviewable changes.
- Do not modify unrelated files.
- Do not commit secrets.
- Do not activate live production behavior.
- Ask for explicit approval before irreversible actions.

Validation:
Run the strongest available validation loop:

```bash
bash scripts/harness-preflight.sh
bash scripts/harness-validate.sh
```

If this is a JS/Next.js project, also run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Final response:
- Files changed
- Commands run
- Results
- Blockers
- What is real vs scaffolded
- Security notes
- Next recommended action
