# Code map

What each folder does, in simple words.

| Folder / file | What it is |
|---|---|
| `docs/` | The plan. One file per SDLC phase (00 process, 01 requirements, 02 plan, 03 design). Source of truth. |
| `docs/research/` | Research reports (competitors, legal risk, Tsenta teardown, fresher hiring). |
| `app/` | The website (Next.js). Each folder is a screen: `consent`, `upload`, `profile`, `answers`, `resume`, `tailor`. |
| `app/api/` | Server endpoints the screens call: login, consent, resume upload, profile, answers, tailor, PDF download. |
| `app/components/` | Shared pieces: bottom tabs (`Shell`), Google sign-in button, form helper. |
| `lib/service.ts` | The business rules: consent check, upload, profile, answers, tailoring. Tests call this directly. |
| `lib/ai.ts` | Talks to Claude: reads a resume into fields, tailors a resume to a job. Swappable with a fake in tests. |
| `lib/pdf.ts` | Makes the ATS-friendly resume PDF. |
| `lib/extract.ts` | Reads text out of PDF, Word and text files. |
| `lib/auth.ts` | Google sign-in check (Firebase) and the login cookie. |
| `lib/db.ts`, `db/schema.sql` | Database connection and tables. Local: a small Postgres inside the app (`.data/`). Live: Fly.io Postgres. |
| `tests/` | Automated tests with fake people and fake AI. Run: `pnpm test`. |
| `.env.example` | List of keys the app needs. Copy to `.env` and fill in. `.env` is never committed. |

## Commands
- `pnpm install` once, then `pnpm dev` and open http://localhost:3000
- `pnpm test` runs the automated tests; `pnpm typecheck` checks the code.
