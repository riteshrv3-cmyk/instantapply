# 01 Requirements (v2, APPROVED 2026-10-29)

Phase 1 of `00-process.md`. Answers WHAT and WHY. Draft v2 2026-10-29 after 20 MCQs. Based on `research/02-tsenta-teardown.md`.

## Product in one line
Instant Apply (working name): Tsenta's product experience, rebuilt for Indian freshers in tech. Upload resume, get matched jobs, approve, and our cloud robot fills and submits the application, handles OTPs, and tracks replies.

## Why (business)
- Foundation product: attract candidates, prove value (interview calls), build a user base.
- Later: colleges, universities, companies; Place.ai and KodeTalent after.
- "Copy Tsenta" means copy its usability, simplicity and value for the candidate. Never its code, prompts or text (their Terms 3(c)).

## Decided (MCQs, 2026-10-29)

| Topic | Answer |
|---|---|
| Users | Freshers (0-2 years), tech roles, all India + remote |
| Pilot | 100 candidates, found directly (social posts, WhatsApp groups). No college features in v1 |
| Channel | Mobile web + WhatsApp (alerts, approve links, "needs you") |
| Apply engine | Cloud browser on our server, like Tsenta |
| Approve | Candidate approves each application. No auto mode |
| Job sources | Only jobs our robot can apply to: ATS portals and company career pages. Never automate LinkedIn, Naukri, Indeed |
| ATS accounts | Like Tsenta: candidate's own Gmail, Gmail read-only connect |
| OTP / verify email | Robot reads it from Gmail and enters it |
| Screening questions | Candidate answers ~15 common ones at signup; AI writes open answers; unknown ones go to "Needs you" |
| Daily cap | 10 applications per candidate per day |
| Resume | Tailored per job, shown as before/after, candidate approves |
| Profile | Resume upload (auto-read), projects + GitHub, CGPA + college + grad year |
| Inbox tracking | Yes in v1: detect interview invites and rejections in Gmail |
| Pricing | Free: 25 applications, lifetime. Paid: Rs 999/month |
| Proved value | 20% of active candidates get 1+ interview call within 30 days of first apply |
| Running budget | Set after a cost-per-application estimate in phase 2 |
| Hosting | Cheapest region that works (DPDP rules still apply) |
| Talent pool | Not in v1 |

## End-to-end flow (what the candidate sees)
1. Lands from a WhatsApp/social link, signs up with Google (one tap).
2. Consent screen (DPDP): what we store, why, Gmail access explained.
3. Uploads resume. AI reads it and pre-fills profile. Candidate adds projects, GitHub, CGPA, college, grad year, cities, roles.
4. Answers ~15 common screening questions once (notice period, expected CTC, relocation, etc.).
5. Connects Gmail (read-only) so the robot can do OTPs and track replies.
6. Opts in to WhatsApp alerts.
7. Daily: sees matched jobs with % match and reason. Opens one: tailored resume (before/after), cover note, every form answer. Taps Approve (or edits, or skips).
8. Cloud robot opens the ATS, creates the account if needed, fills every page, uploads resume, enters OTP from Gmail, submits.
9. Candidate gets a receipt (every field sent) on web and WhatsApp. If stuck: "Needs you" message with one question.
10. Gmail tracking moves status: submitted, viewed if known, replied, interview, rejected. Interview call = WhatsApp alert.
11. After 25 applications: paywall, Rs 999/month.

## Functional requirements

| ID | Feature | Why | How we test it |
|---|---|---|---|
| FR-01 | Google sign-in | One-tap start, like Tsenta | New user signs in and back in |
| FR-02 | Consent + privacy notice before storing data; consent log | DPDP law | No data saved before consent; consent time stored |
| FR-03 | Resume upload, AI reads it into profile fields | Fast onboarding | Sample resume fills name, skills, projects, education correctly |
| FR-04 | Profile: roles, cities (all India + remote), projects, GitHub, CGPA, college, grad year | Matching and forms | Fields saved and editable |
| FR-05 | Screening answer bank (~15 common questions) | Correct form answers | Answers reused on 3 different ATS forms |
| FR-06 | Gmail connect (read-only) with clear explanation | OTPs and reply tracking | Connect, disconnect, token revoked on disconnect |
| FR-07 | WhatsApp opt-in and messages: new matches, approve link, needs you, receipt, interview alert | Main channel in India | Each message type arrives on a test number |
| FR-08 | Job feed: only jobs on ATS portals / career pages our robot supports | Every listed job is applyable | 100% of listed jobs map to a supported ATS |
| FR-09 | Matching: % match + one-line reason, fresher filter | Core value | Seeded profile gets fitting jobs |
| FR-10 | Per-job tailored resume + cover note, before/after view | Higher interview rate | Each queued job has its own version; diff shown |
| FR-11 | Approve screen: resume, cover note, every answer; Approve / Edit / Skip | Our rule: nothing sent without approve | No submit without an Approve record |
| FR-12 | Cloud browser applies: account creation, multi-page forms, uploads, submit | The "apply for me" promise | Approved test apply received on each supported ATS |
| FR-13 | OTP and email-verify handled from Gmail automatically | No stuck applies | Test ATS OTP read and entered |
| FR-14 | "Needs you": robot stops on unknown question, asks on WhatsApp/web, resumes | No wrong answers sent | Unknown question flagged, answer used, apply finishes |
| FR-15 | Receipt of every field sent | Trust | Receipt matches what ATS received |
| FR-16 | Tracker statuses: queued, tailoring, needs you, failed, skipped, submitted, viewed, replied, interview, rejected | Shows progress | Each apply shows the right status |
| FR-17 | Gmail reply tracking: detect interview invites and rejections, update status | Proof metric + alerts | Test emails classified correctly |
| FR-18 | Caps: 10 applications per candidate per day; max per employer | Avoid spam scoring | 11th approve waits until next day |
| FR-19 | Free 25 applications lifetime, then Rs 999/month plan (Indian payment gateway, picked in phase 2) | Pricing | Free user blocked at 25; paid user not |
| FR-20 | Delete account and data; revoke Gmail | DPDP law | After delete, no candidate data remains |
| FR-22 | Resume-only fallback: when the robot cannot apply to a job, give the tailored resume + cover note + "apply yourself" link, and track it when the candidate marks it applied | Every job gives value even where auto-apply fails | A job on an unsupported site shows tailored resume download and link; "I applied" updates tracker |
| FR-21 | Admin dashboard: users, applies, success rate per ATS, failures, interview calls, paid users, cost per apply | Run the business, prove value | Numbers match database |

## Non-functional requirements
- English only. Mobile-first web. Works on cheap Android phones.
- Apply success rate per ATS measured and shown on admin dashboard.
- Never store job-board passwords. Never bypass CAPTCHAs (robot goes to "Needs you" instead). Never automate LinkedIn, Naukri, Indeed.
- ATS account passwords (if the robot creates them): encrypted, visible to the candidate.
- Gmail data: read only ATS/employer mail needed; do not keep unrelated email.

## Out of scope for v1
- Auto-apply without approval, job boards automation, colleges/TPO features, talent pool, native apps, Chrome extension, iMessage, other languages, experienced hires, non-tech roles.

## Research items for phase 2 (Planning)
- R1: Which ATS Indian tech hirers use for fresher roles (Greenhouse, Lever, Workday, Ashby, Darwinbox, Keka, Zoho Recruit, others) and which have public job lists.
- R2: Cost per application (AI tailoring + cloud browser + server), then set the monthly budget.
- R3: Google rules for Gmail read access (restricted scope verification / security check): time and cost. Uncertain until checked.
- R4: WhatsApp Business API provider and price per message in India.
- R5: Payment gateway for Rs 999/month subscriptions.
- R6: DPDP rules for storing data outside India (hosting is "cheapest anywhere").
- R7 (optional): Ritesh's own test apply on Tsenta to confirm the cloud apply flow.

## Approval
APPROVED 2026-10-29 (Ritesh, in chat). FR-22 added and re-approved 2026-10-29.
