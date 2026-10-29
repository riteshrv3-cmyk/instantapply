# 01 Requirements (DRAFT, not approved)

Phase 1 of `00-process.md`. Answers WHAT and WHY. Status: draft 2026-10-29, waiting for Ritesh.

## Product in one line
Instant Apply (working name): Indian freshers in tech build a resume, get matched jobs, and we fill and send applications for them after they approve each one.

## Why (business)
- Foundation product: attract candidates, prove value, build a talent pool.
- Later: sell the pool and tooling to colleges, universities and companies. Place.ai and KodeTalent come after.

## Decided (from MCQs, 2026-10-29)

| Topic | Answer |
|---|---|
| Target user | Freshers (0-2 years), tech roles (software, IT, data) |
| Apply mode | Candidate approves each application before it is sent |
| Pricing v1 | Free tier + paid plan |
| Proved value | Interview calls |
| Job sources | Decide after research (see open question Q1) |
| Repo | `C:\Users\asusv\Music\instantapply`, GitHub `riteshrv3-cmyk/instantapply` |

## Users
- **Candidate**: final-year student or fresher, tech role, India. Uses a phone mostly (guess, confirm in phase 3).
- **Admin (Ritesh)**: watches applies, errors, interview calls, payments.

## Functional requirements

| ID | Feature | Why | How we test it |
|---|---|---|---|
| FR-01 | Sign up / log in with email or Google | Own the candidate relationship | New user signs up and logs back in |
| FR-02 | Consent screen + privacy notice before any data is stored | DPDP law | No data saved until consent ticked; consent time stored |
| FR-03 | Resume builder: upload old resume or fill a form, AI turns it into a clean ATS-friendly resume (PDF) | Freshers have weak resumes; also the hook | Upload a sample resume, get a PDF that an ATS parser reads correctly |
| FR-04 | Profile: roles wanted, cities, remote OK, skills, grad year, expected salary | Needed for matching and forms | Fields saved and editable |
| FR-05 | Job matching: daily list of matched fresher tech jobs with a match score and reason | Core value | Seeded profile gets jobs that fit role and city |
| FR-06 | Per-job tailored resume and short cover note (AI) | Higher interview rate | Each queued apply has its own tailored version |
| FR-07 | Approve queue: candidate sees each prepared application, can edit, Approve or Skip | Chosen apply mode, lowers ban and spam risk | Nothing is sent without an Approve tap |
| FR-08 | Auto-fill and submit approved applications on allowed sources (Q1) | The "apply for me" promise | Approved test apply is received on a test ATS job |
| FR-09 | Screening questions: AI answers from profile; unsure answers go back to candidate | Wrong answers hurt the candidate | Unknown question is flagged, not guessed |
| FR-10 | Tracker: status of every application (sent, failed, viewed if known, interview) | Proof of value | Each sent apply appears with status |
| FR-11 | "I got an interview" button + email/WhatsApp check-in after 7 and 14 days | Measures proved value | Reported interview shows on admin dashboard |
| FR-12 | Free tier limit + paid plan unlock (payment via an Indian gateway, picked in phase 2) | Pricing decision | Free user blocked at limit; paid user is not |
| FR-13 | Daily safety caps: max applies per candidate per day and per employer | Avoid spam scoring and bans | Cap reached = queue pauses |
| FR-14 | Delete my account and data | DPDP law | After delete, no candidate data remains |
| FR-15 | Admin dashboard: users, applies sent, failures, interview calls, paid users | Run the business | Numbers match the database |
| FR-16 | Talent pool opt-in: candidate agrees to be shown to employers/colleges later | Foundation for B2B sales | Opt-in stored separately from FR-02 consent |

## Non-functional requirements
- English only, web first (mobile-friendly). Same limits as Place.ai unless changed: AI budget Rs 2,500/month, job data Rs 0 (confirm).
- Never store job-board passwords. Never bypass CAPTCHAs.
- Resumes and personal data stored encrypted; India or a DPDP-safe region (confirm in phase 2).

## Out of scope for v1
- Automated applying on LinkedIn, Naukri, Indeed (ban risk HIGH, see research doc). They may appear only as "open and apply yourself".
- Fully automatic mode, experienced hires, non-tech roles, colleges/companies dashboards, other languages, native mobile apps.

## Open questions (need your answer before APPROVED)
- **Q1 Sources:** research recommends ATS portals + company career pages only. OK?
- **Q2 Free tier size and paid price:** for example 10 applies/month free, paid Rs X/month. Your numbers?
- **Q3 Proof target:** for example "30% of active candidates get 1+ interview call within 30 days of first apply". Your numbers?
- **Q4 Pilot size:** how many candidates in v1 (for example 50 or 100)?
- **Q5 Budget:** keep Rs 2,500/month AI and Rs 0 job data?

## Approval
Ritesh writes here: APPROVED (date) ____
