# 03 Design (DRAFT, not approved)

Phase 3 of `00-process.md`. Input: `01-requirements.md` (FR-01 to FR-22), `02-plan.md` (APPROVED 2026-10-30), `research/02-tsenta-teardown.md`. Date 2026-10-30.

Rule: screens and flow copy Tsenta's product structure (teardown section 1). Our own code, words and visuals. Screens get refined from Ritesh's Tsenta screenshots when they arrive (marked "refine").

## 1. Screens (mobile web first)

Bottom tabs (logged in): **Jobs**, **Queue**, **Tracker**, **Inbox**, **Me**.

| # | Screen | What is on it | Copies Tsenta's | FR |
|---|---|---|---|---|
| S1 | Landing | One line promise, "Start free: 25 applications", Google button, how it works in 3 steps, pricing | Free start, no card | FR-01, FR-19 |
| S2 | Consent | What we store, why, Gmail use explained, tick boxes, Continue | (ours: DPDP) | FR-02 |
| S3 | Upload resume | Drop PDF/DOCX; AI reads it; progress | Resume intake | FR-03 |
| S4 | Check profile | Pre-filled: name, phone, college, CGPA, grad year, skills, projects (+GitHub), roles wanted, cities (all India + remote). Edit inline | Profile | FR-04 |
| S5 | Common answers | ~15 questions once: notice period, expected CTC, relocation, work authorization (Indian citizen), gender/diversity (optional), how did you hear, etc. | Work authorization in profile | FR-05 |
| S6 | Connect Gmail | Why (OTPs, reply tracking), read-only, "Google hasn't verified" warning explained, Connect / Skip | Inbox sync | FR-06 |
| S7 | WhatsApp | Number, opt-in, test message | Messaging channel | FR-07 |
| S8 | Jobs feed | Cards: title, company, city, posted, % match + one-line reason, ATS logo, "Auto" or "Apply yourself" tag. Filters: role, city, remote. Paste-a-job-link box | Job feed, % match, filters, paste URL | FR-08, FR-09, FR-22 |
| S9 | Job detail + Approve | Tabs: Resume (before/after diff per line), Cover note, Answers (every form field). Buttons: Approve and send / Edit / Skip. For "Apply yourself": Download resume + Open job + "I applied" | Diff with Edit / Approve and send | FR-10, FR-11, FR-22 |
| S10 | Queue | Approved jobs with live status: queued, tailoring, applying, needs you, failed, submitted. Daily cap counter "7 of 10 today" | Queue statuses | FR-12, FR-16, FR-18 |
| S11 | Needs you | One question at a time from the robot; answer saves to answer bank; robot resumes | "Needs you" status | FR-14 |
| S12 | Receipt | Every field and answer sent, file sent, time, ATS confirmation text | Receipt | FR-15 |
| S13 | Tracker | All applications: submitted, viewed, replied, interview, rejected. Count of interview calls on top | Pipeline statuses | FR-16, FR-17 |
| S14 | Inbox | Employer emails matched to each application (from Gmail), latest first | Recruiter inbox | FR-17 |
| S15 | Me | Profile, answers, resume versions, Gmail and WhatsApp status, plan, delete account | Settings | FR-04, FR-20 |
| S16 | Paywall | After 25: Rs 999/month, what you get, pay | Plans by volume | FR-19 |
| A1 | Admin | Users, applications per day, success rate per ATS, failures with reason, interview calls (20% target), paid users, cost per application | (ours) | FR-21 |

### WhatsApp messages (templates)
| ID | When | Text idea (our words) |
|---|---|---|
| W1 | Daily, new matches | "5 new jobs match you today. Top: {role} at {company} ({match}%). Review: {link}" |
| W2 | Needs you | "{company} asks: {question}. Reply here or open {link}" |
| W3 | Submitted | "Applied to {role} at {company}. Receipt: {link}" |
| W4 | Interview | "Interview call from {company}! Details: {link}" |
| W5 | Failed | "Could not finish {company}. Apply yourself: {link}" |

## 2. Data model (PostgreSQL)

| Table | Key fields |
|---|---|
| users | id, firebase_uid, email, phone, name, created_at, consent_at, consent_version, whatsapp_opt_in, plan (free/paid), free_used (0-25), deleted_at |
| profiles | user_id, college, cgpa, grad_year, skills[], projects (json: title, desc, github), roles[], cities[], remote_ok, resume_text, resume_json |
| answers | id, user_id, question_key, question_text, answer, source (signup/needs_you/ai) |
| resumes | id, user_id, kind (master/tailored), job_id, file_url, json, created_at |
| gmail_links | user_id, google_sub, refresh_token (encrypted), scope, connected_at, revoked_at |
| companies | id, name, ats (greenhouse/lever/ashby/other), board_token, careers_url |
| jobs | id, company_id, ats, external_id, title, location, remote, description, apply_url, posted_at, closed_at, fresher_fit (bool) |
| matches | id, user_id, job_id, score, reason, created_at, state (new/seen/skipped) |
| applications | id, user_id, job_id, mode (auto/self), status, approved_at, submitted_at, cover_note, resume_id, error, ats_account_email |
| app_fields | id, application_id, label, value, source (profile/answer/ai) |
| needs_you | id, application_id, question, answer, asked_at, answered_at |
| app_events | id, application_id, type (status change, email seen, interview, rejected), data, at |
| ats_accounts | id, user_id, ats, company_id, login_email, password_encrypted, created_at |
| payments | id, user_id, provider (dodo), provider_sub_id, status, amount_inr, period_end |
| audit_log | id, user_id, action, at (consent, approve, delete, gmail connect) |

Rules: no submit without `applications.approved_at`; daily cap = count of applications approved today ≤ 10; free plan blocks at `free_used = 25`.

## 3. API (Next.js routes and Fly.io services)

| Method + path | Does | Called by |
|---|---|---|
| POST /api/consent | Save consent | S2 |
| POST /api/resume/upload | Store file, AI parse, fill profile | S3 |
| GET/PUT /api/profile | Read/edit profile | S4, S15 |
| GET/PUT /api/answers | Answer bank | S5, S11 |
| GET /api/gmail/connect, /callback, POST /disconnect | Google OAuth (gmail.readonly) | S6, S15 |
| POST /api/whatsapp/optin | Save number, send test | S7 |
| GET /api/jobs?filters | Matched feed | S8 |
| POST /api/jobs/paste | Add job from URL | S8 |
| POST /api/applications/:jobId/prepare | Tailor resume, cover note, prefill answers | S9 |
| POST /api/applications/:id/approve | Approve (checks cap and plan), queue robot | S9 |
| POST /api/applications/:id/self-applied | Mark "I applied" | S9 |
| GET /api/applications | Queue + tracker | S10, S13 |
| POST /api/needs-you/:id/answer | Answer robot question | S11 |
| GET /api/applications/:id/receipt | Receipt | S12 |
| POST /api/billing/checkout, /webhook | Dodo Payments | S16 |
| DELETE /api/me | Delete account, revoke Gmail | S15 |
| POST /api/whatsapp/webhook | Incoming replies (needs-you answers) | WhatsApp |

Background services on Fly.io:
- **job-fetcher:** daily, reads Greenhouse / Lever / Ashby public job lists for our company list; marks fresher-fit jobs.
- **matcher:** daily, scores new jobs per user (skills overlap in code, AI writes the reason).
- **apply-robot:** takes approved applications from a queue, runs Playwright (headless Chrome).
- **gmail-watcher:** every few minutes, reads new mail from known ATS senders: OTPs to the robot, replies to app_events.
- **notifier:** sends WhatsApp templates.

## 4. Apply robot design
1. Pick handler by ATS (Greenhouse, Lever, Ashby first). Unknown ATS: mark as "Apply yourself" (FR-22).
2. Open apply_url in headless Chrome. If account needed: sign up with the candidate's Gmail address, generated password (stored encrypted, shown to candidate in S15).
3. Fill fields: from profile and answer bank by label match; AI maps unmatched labels; unknown or low-confidence field → Needs you (pause up to 24 h).
4. Upload the tailored resume PDF.
5. OTP / email verify: gmail-watcher finds the mail from the ATS sender, robot enters code or opens link.
6. CAPTCHA seen → stop, mark "Apply yourself" (never bypass).
7. Submit, save every field to app_fields (receipt), screenshot of confirmation.
8. Failure → status failed with reason, W5 message, counts in admin success rate per ATS.

Built and tested on rea's local copies of each ATS form (plan section 5). No real application sent during build.

## 5. Analytics events
signup, consent_given, resume_uploaded, profile_completed, gmail_connected, whatsapp_opted_in, job_viewed, application_prepared, application_approved, application_submitted, application_failed (with ats, reason), needs_you_asked, needs_you_answered, self_applied, interview_detected, paywall_shown, paid, account_deleted.

Proof metric: share of active users with at least 1 interview_detected within 30 days of first application_submitted (target 20%).

## 6. Open (to refine from Tsenta screenshots)
- Exact screen layout and wording style of S8, S9, S10 (refine).
- Our product name, colours, logo (not Tsenta's).
- Initial company list for job-fetcher (Indian tech hirers on Greenhouse / Lever / Ashby): build in slice 3.

## Approval
Ritesh writes here: APPROVED (date) ____
