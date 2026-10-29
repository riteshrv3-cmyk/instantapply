# Decisions

Newest at the bottom. Format: date: decision (why).

- 2026-10-29: Instant Apply is the active project; Place.ai, KodeTalent and ninelab-aggregator parked, loose work saved as local "wip: parked" commits (foundation product first: talent pool, then B2B).
- 2026-10-29: Repo is `C:\Users\asusv\Music\instantapply`, GitHub `riteshrv3-cmyk/instantapply` (Ritesh gave it).
- 2026-10-29: Build with the same SDLC waterfall and hard gates as Place.ai (repeatable process).
- 2026-10-29: v1 users are freshers (0-2 years) in tech roles (fits Place.ai and KodeTalent later).
- 2026-10-29: Candidate approves each application before sending (lowest ban and spam risk).
- 2026-10-29: Pricing is free tier + paid plan; amounts open (prove value and test willingness to pay).
- 2026-10-29: Proved value = interview calls; target number open.
- 2026-10-29: Job sources decided after research; research recommends ATS + career pages only (pending Ritesh).
- 2026-10-29: v1 applies only on ATS portals and company career pages; LinkedIn, Naukri, Indeed only as "apply yourself" links (ban risk HIGH on job boards).
- 2026-10-29: Copy Tsenta's product experience (usability, simplicity, value), never its code or text (their Terms 3(c)).
- 2026-10-29: Cloud browser apply engine; mobile web + WhatsApp; approve each kept.
- 2026-10-29: Job feed = only jobs our robot can apply to (source list to research in phase 2).
- 2026-10-29: Like Tsenta, candidate's Gmail (read-only) for ATS accounts, OTPs and reply tracking.
- 2026-10-29: Screening = pre-set answers + AI + "Needs you"; cap 10 applications a day; tailored resume per job.
- 2026-10-29: Free 25 applications lifetime, paid Rs 999/month; proof = 20% get an interview call in 30 days; pilot 100 candidates found directly.
- 2026-10-29: Hosting cheapest anywhere; budget set after a cost estimate; talent pool and college features not in v1.
- 2026-10-29: Requirements v2 approved (docs/01-requirements.md). Phase 2 Planning starts.
- 2026-10-29: Build without candidate/recruiter calls (Ritesh lived the problem). Fallback value: when auto-apply is not possible, give a tailored resume + "apply yourself" link. Needs FR-22 in requirements (re-approve).
- 2026-10-29: FR-22 (resume-only fallback) added to requirements and approved; phase 2 Planning started.
- 2026-10-29: Copy Tsenta product and stack (Next.js/Vercel, Firebase Auth, Fly.io + Postgres, Cloudflare, Claude, SigNoz, Dodo Payments if it fits India). Own code only; no Tsenta code, text, prompts or decompiled parts. Do not reuse Place.ai plan.
- 2026-10-30: Phase 2 plan approved (docs/02-plan.md). Phase 3 Design starts.
- 2026-10-30: Phase 3 design approved (docs/03-design.md). Phase 4 Development starts with slice 1 (setup + resume builder).
