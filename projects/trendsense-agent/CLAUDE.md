# CLAUDE.md

This project is developed through an OpenClaw / Telegram coding interface.

## Non-negotiable rules

- Do not read, print, copy, upload, or modify .env or any secret files.
- Do not modify OpenClaw core service files or configs.
- Do not deploy automatically.
- Do not push automatically.
- Do not run destructive commands.
- Always run `git status` before editing.
- Work on a task branch or in the sandbox workspace.
- Keep changes small and scoped.
- After changes, run tests where available.
- Always return: files changed, commands run, tests run, diff summary, risks, suggested next step.
- If the task is ambiguous, ask for clarification before editing.

## Default workflow

1. Understand task.
2. Check `git status`.
3. Confirm scope (compare against the task message; refuse if scope creep).
4. Make minimal changes.
5. Run tests.
6. Generate diff summary.
7. Report result using `coding-harness/result_template.md`.
8. Wait for user confirmation before commit, push, or deploy.

## Forbidden actions

- No secret access.
- No production data mutation.
- No automatic deployment.
- No force push.
- No broad refactor unless explicitly requested.

## Where work happens

- Sandbox (default): `~/.openclaw/workspace-gabriel/coding-sandbox/trendsense-agent-wip/`
- Production repo (only on `task/` branches with explicit authorization):
  `~/.openclaw/workspace-gabriel/projects/trendsense-agent/`

## Where results go

- Task records: `~/.openclaw/workspace-gabriel/coding-harness/task_outputs/<TASK_ID>/`
- Final deliverables for human review: `~/.openclaw/workspace-gabriel/handoff/coding-results/`
