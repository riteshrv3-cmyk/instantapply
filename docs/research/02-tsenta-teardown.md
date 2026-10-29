# Research: Tsenta teardown (how it works)

Date: 2026-10-29. Purpose: understand Tsenta's design so we can design our own version for Indian fresher tech job seekers.

Labels: **Fact** = stated on the linked source, or seen directly in their public extension files. **Guess** = my reading of the evidence. **Uncertain** = not found or sources conflict.

Method and limits:
- Public pages read once each (no bulk scraping): tsenta.com home, /terms, /privacy, /ai-disclosure, YC launch page, Chrome Web Store listing.
- Their public Chrome extension (v3.1.12) downloaded once from Google's official store and read statically: manifest, file list, host names, rule files. Nothing was run. The rea tool's full analysis timed out at 5 minutes on the 440 KB overlay script, so I used targeted text searches instead.
- No code, prompts or text copied into this repo (their Terms 3(c) ban that). Everything below is in my own words.
- No test applies done. Ritesh's own test apply (network view) is still open, see section 7.

## 1. Product flow

| Step | What happens | Label | Source |
|---|---|---|---|
| Signup | Free start, no card. 25 free applications for life. Also "conversational signup" over iMessage / WhatsApp | Fact | [tsenta.com](https://tsenta.com), [AI disclosure](https://tsenta.com/ai-disclosure) |
| Login system | Firebase Authentication (Google's login service) | Fact | [Privacy s.3](https://tsenta.com/privacy) |
| Resume intake | User uploads resume(s); profile holds work history, preferences, work authorization | Fact | [Privacy s.1](https://tsenta.com/privacy) |
| Resume rewrite | Per job: new resume + cover letter from the job description, keyword-matched, ATS-safe. Shows a diff (before/after of each line) with Edit / Approve and send | Fact | [tsenta.com](https://tsenta.com) |
| ATS score | Scores resume for parseability (can a machine read it), headings, keywords | Fact | [AI disclosure](https://tsenta.com/ai-disclosure) |
| AI models | Anthropic (Claude), OpenAI, Microsoft Azure AI | Fact | [Privacy s.3](https://tsenta.com/privacy) |
| Where jobs come from | Watches 50,000+ company career pages, 24/7. YC page says 2M+ listings, refreshed every few hours | Fact (their claim) | [tsenta.com](https://tsenta.com), [YC launch](https://www.ycombinator.com/launches/SBV-tsenta-your-ai-career-agent-that-applies-to-jobs-lands-you-interviews) |
| Extra job sources | Extension also reads job data on pages the user visits: LinkedIn, Jobright, MigrateMate, HiringCafe, Dice, Naukri, Indeed | Fact (host names and site scripts in extension) | Extension files, section 2 |
| Matching | Resume-aware score (% match) with a reason. Filters: location, salary, experience level, role family. Paste any job URL to add it | Fact | [tsenta.com FAQ](https://tsenta.com/#faq) |
| Approve vs auto | Default shows review gate; "more automated behavior" is a setting. Extension listing says user can review or "let them run fully automated" | Fact | [FAQ](https://tsenta.com/#faq), [Chrome store](https://chromewebstore.google.com/detail/tsenta/momaobilceffibifldnhndcehhdjgaob) |
| Tracking | Statuses: queued, tailoring, needs you, failed, skipped, submitted. Then applied, viewed, replied, interview. Each submit gives a "receipt" (every field and answer sent) | Fact | [tsenta.com](https://tsenta.com) |
| Inbox sync | Optional Gmail/Outlook connect. Reads job mail, routes recruiter replies to the right application, drafts replies into the user's Drafts (never sends itself) | Fact | [Privacy s.4(c)](https://tsenta.com/privacy) |

## 2. Apply automation

### Where the apply runs
- **Fact:** Applications run in the cloud and keep going after the browser tab closes ([Chrome store listing](https://chromewebstore.google.com/detail/tsenta/momaobilceffibifldnhndcehhdjgaob)). Feature list says "live application overlay or fully headless (replay later)" ([AI disclosure](https://tsenta.com/ai-disclosure)).
- **Correction to research 01:** 01 said Tsenta runs "on-device". I found no such claim on their site, YC page or store listing today. Treat "on-device" as **wrong or outdated**.
- **Fact:** Servers on Fly.io (hosting + PostgreSQL database), Cloudflare in front; APIs at api.tsenta.com and api.autojobs.me (older name "AutoJobs") ([Privacy s.3](https://tsenta.com/privacy), extension config).
- **Guess:** "Headless" = a cloud browser (a browser with no screen, run by a script on their server) fills the ATS form. "Live overlay" = user watches it in a frame. Not proven; needs the network test in section 7.

### What the Chrome extension does (fact, from its manifest and files)
- Detects which ATS a page belongs to from URL patterns. About 30 ATS are listed with logos (Workday, Greenhouse, Lever, Ashby, iCIMS, SmartRecruiters, SuccessFactors, Oracle/Taleo, BambooHR, Workable, and more).
- Shows an overlay on every website (content script on all URLs) to add the job to Tsenta.
- Talks to the dashboard to share the login token (a small "bridge" script on tsenta.com).
- Sends the job URL and description to the server (paths like applications, job-description fetch).
- Sends error and trace logs to SigNoz (a monitoring service).
- Permissions: all websites, tabs, scripting, cookies, webRequest, declarativeNetRequest.
- **Fact, notable:** an always-on rule removes two browser safety headers (X-Frame-Options and Content-Security-Policy) from page and frame responses, with no site filter in the rule file. It also copies cookies from frame responses. **Guess:** done so ATS pages can load inside a Tsenta frame. **Guess (risk):** this weakens protection against click-hijacking and script injection on every site the user visits while it is installed.
- **Fact:** no text for CAPTCHA, reCAPTCHA, hCaptcha or Turnstile found in the extension (bounded search, extension only; says nothing about their servers).

### Per ATS
| Item | Finding | Label |
|---|---|---|
| Workday, Greenhouse, Lever, Ashby | Named as covered; "login, every field, open-ended questions, upload" | Fact (claim) [tsenta.com](https://tsenta.com) |
| How each form is filled | "Intelligent form recognition" across 30+ ATS, multi-page forms, uploads | Fact (claim) [AI disclosure](https://tsenta.com/ai-disclosure) |
| Per-ATS method (fixed scripts per ATS vs AI reading any form) | Guess: both. URL-based ATS detection suggests per-ATS handlers; AI fills unknown fields | Guess |
| Account creation | Creates ATS accounts (Workday needs one per company) | Fact [YC launch](https://www.ycombinator.com/launches/SBV-tsenta-your-ai-career-agent-that-applies-to-jobs-lands-you-interviews) |
| Which email / password for ATS accounts | Not stated anywhere | Uncertain |
| Email verification and OTP | With Gmail connected (read-only scope), their server reads the employer's code or link and enters it | Fact [Privacy s.1(c), 4(c)](https://tsenta.com/privacy) |
| Without inbox connect | Application goes to "Needs you" | Guess (from status names) |
| Screening questions | Open-ended answers in "your voice" from resume and past submissions; work authorization from profile | Fact [tsenta.com](https://tsenta.com), [AI disclosure](https://tsenta.com/ai-disclosure) |
| Detectable? | FAQ says they do not promise it is undetectable | Fact [FAQ](https://tsenta.com/#faq) |

## 3. Channels

| Channel | What it does | Label |
|---|---|---|
| Web dashboard | Job feed, application queue, recruiter inbox | Fact [tsenta.com](https://tsenta.com) |
| Chrome extension | Add job from any page, fill or queue apply. 5,000 users, 5.0 from 8 ratings, v3.1.12, updated 14 Oct 2026 | Fact [Chrome store](https://chromewebstore.google.com/detail/tsenta/momaobilceffibifldnhndcehhdjgaob) |
| iMessage | Text roles you want; reply "yes" to a match; get receipt | Fact [tsenta.com](https://tsenta.com) |
| WhatsApp | Listed, signup and "apply" reply | Fact (listed), details Uncertain |
| iOS / Android | Native apps | Fact [App Store](https://apps.apple.com/us/app/tsenta/id6760728258), [Google Play](https://play.google.com/store/apps/details?id=com.tsenta.tsenta) |
| MCP server / CLI | Other AI agents (Claude Code etc.) can call Tsenta to apply | Fact [Privacy s.4(b)](https://tsenta.com/privacy) |

## 4. Pricing and limits (from their own site, 2026-10-29)

| Plan | Monthly | Quarterly | Annual | Applications |
|---|---|---|---|---|
| Free | $0 | | | 25, lifetime |
| Starter | $19 | $49 | $159 | 600 per 30 days |
| Pro | $39 | $79 | $299 | 1,500 per 30 days |
| Power | $99 | $239 | $799 | 4,500 per 30 days |

- Fact: monthly prices from [tsenta.com#pricing](https://tsenta.com/#pricing); quarterly and annual from [AI disclosure](https://tsenta.com/ai-disclosure). Every plan is the full product; plans differ only in volume. Pay only for submitted applications. Cancel any time.
- Fact: YC launch offered 25% off any plan ([YC launch](https://www.ycombinator.com/launches/SBV-tsenta-your-ai-career-agent-that-applies-to-jobs-lands-you-interviews)). Payments via Dodo Payments ([Privacy](https://tsenta.com/privacy)).
- Research 01 said "from $9.99/month": **outdated or wrong**.
- Claims (self-reported, unverified): 45,000+ users, 70%+ of paid users got interviews ([YC launch](https://www.ycombinator.com/launches/SBV-tsenta-your-ai-career-agent-that-applies-to-jobs-lands-you-interviews)).

## 5. Weak points

| Weak point | Evidence | Label |
|---|---|---|
| Built for US: OPT, sponsorship, US work authorization, USD price | FAQ, pricing copy | Fact |
| Volume pitch ("hundreds a week", 4,500/month) invites spam scoring by ATS fraud tools | [tsenta.com](https://tsenta.com); Greenhouse fraud scoring in research 01 | Guess (risk) |
| Full-auto mode exists, so "approve each" is optional | FAQ, Chrome store | Fact |
| Extension strips security headers on all sites | Extension rule file | Fact (rule); risk is Guess |
| Extension reads job data on LinkedIn and Naukri pages | Extension site scripts | Fact; ban risk to user is Guess |
| Gmail read access, emails' previews sent to OpenAI for sorting | [Privacy s.4(c)](https://tsenta.com/privacy) | Fact; trust cost is Guess |
| US law and US arbitration; no India DPDP mention | [Terms s.13](https://tsenta.com/terms), [Privacy](https://tsenta.com/privacy) | Fact |
| Little independent user feedback: Trustpilot empty, reviews mostly from rival sellers | [Trustpilot](https://uk.trustpilot.com/review/tsenta.com), [Scoutify (rival)](https://scoutify.com/blog/tsenta-review/), [LoopCV](https://www.loopcv.pro/directory/tsenta/) | Fact |
| ATS account passwords: how they are made and stored is not disclosed | Not found | Uncertain |

## 6. Copy as idea / do better (for Indian fresher tech job seekers)

| Tsenta idea | Copy as idea | Do better for us |
|---|---|---|
| Watch company career pages + ATS directly, apply first | Yes | Focus on Indian tech hirers' ATS (Greenhouse, Lever, Workday, Darwinbox, Keka, Zoho Recruit; check which matter) and campus / fresher roles |
| Per-job resume rewrite with a diff and Approve | Yes | Approve is always required (our rule). Fresher-specific: projects, internships, CGPA, skills in place of job history |
| Receipt of every field sent | Yes | Also show it on WhatsApp in simple English; candidate can flag a wrong answer |
| Pipeline statuses + "Needs you" | Yes | Same, plus a weekly "interview calls" count (our proof metric) |
| Inbox connect for OTP and reply routing | Idea yes, scope smaller | Optional; read only OTP / ATS mail from known ATS senders; clear DPDP consent; data in India where possible |
| Volume plans (600 to 4,500 a month) | No | Fewer, better applies. Cap per employer. Price in rupees for freshers (amount open, Q in requirements) |
| Full-auto mode | No | Never in v1 (DECISIONS 2026-10-29) |
| Extension on all sites, strips security headers | No | If we ship an extension: only ATS domains, no header stripping, minimum permissions |
| Reading LinkedIn / Naukri pages | No | Job boards only as "apply yourself" links (DECISIONS) |
| iMessage channel | No | WhatsApp first (India's main channel); iMessage not worth it here |
| MCP server / CLI | Later | Not for v1 users |
| "Live overlay or headless" cloud apply | Idea yes | Decide in phase 3 design: cloud browser vs candidate's own browser; measure success rate per ATS |
| ATS accounts created for the user | Idea yes | Use a candidate-owned email; tell the candidate which accounts exist; store passwords encrypted or let the candidate set them |

## 7. Open items
- Ritesh's own test apply (1 to 2 jobs, his own account, his browser) with network view, to confirm cloud browser vs frame overlay and the OTP flow. Optional.
- Which ATS Indian fresher hirers use most (not researched here).
- ATS account password handling at Tsenta: unknown.
