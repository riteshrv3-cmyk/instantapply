# How we build: SDLC (pure waterfall, hard gates)

Reused from Place.ai (chosen 2026-10-22). Started for Instant Apply 2026-10-29.

## Rules
- One phase at a time, in order.
- Hard gate: a phase ends only when Ritesh writes "APPROVED" with a date in that phase's doc.
- No phase starts before the previous one is approved. No code before phase 4.
- Going back = reopen the earlier doc, change it, re-approve. Never patch silently.
- How each phase runs: Claude explains the phase in short points and gives a template, Ritesh fills it (via MCQs), Claude reviews.
- Docs live here in `docs/` (source of truth). A shared copy is made for review when a phase draft is ready.
- No time limits.

## Phases

| # | Phase | Question it answers | Output | Gate check |
|---|---|---|---|---|
| 1 | Requirements | WHAT and WHY | `01-requirements.md` | Every feature has a reason, a user, and a way to test it |
| 2 | Planning | HOW, in what order, with what | `02-plan.md` | Tech stack, job sources, AI tools, costs, risks, task list chosen |
| 3 | Design | What it looks like and how parts connect | `03-design.md` + screens | Screens, data model, API contracts, analytics events |
| 4 | Development | Build it | code | Every requirement maps to code; code reviewed |
| 5 | Testing | Does it work as the doc says | `05-test-report.md` | Every requirement has a passing test |
| 6 | Deployment | Put it live safely | `06-deploy.md` | Live on domain, backups, monitoring, rollback plan |
| 7 | Maintenance | Keep it healthy and improve | `07-maintenance.md` | Bug process, metrics review, change process |

## Status

| Phase | Status | Approved on |
|---|---|---|
| 1 Requirements | Approved | 2026-10-29 |
| 2 Planning | In progress | |
| 3 Design | Not started | |
| 4 Development | Not started | |
| 5 Testing | Not started | |
| 6 Deployment | Not started | |
| 7 Maintenance | Not started | |
