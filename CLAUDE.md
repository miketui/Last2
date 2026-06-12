@AGENTS.md

# CLAUDE.md — Claude Code Instructions

## Claude Code behavior

Use plan mode for:

- Multi-file changes
- Provider work
- Deployment work
- Database work
- Payment work
- Auth/download/security work
- Anything that could affect production behavior

Before editing, inspect first. Do not guess file paths.

## Claude-specific rules

- Prefer small, reviewable diffs.
- Explain blockers plainly.
- Use exact command output in final reports.
- Ask for approval before irreversible actions.
- Never rely on memory when repo instructions or docs exist.
- Use `SKILLS.md` to select the correct workflow.
- Use `prompts/claude-code-task-prompt.md` for structured tasks.

## Local notes

Do not commit personal notes here.

Use `CLAUDE.local.md` for machine-specific private notes and keep it gitignored.
