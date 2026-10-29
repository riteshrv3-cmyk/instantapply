# Research: competitors and legal risk

Date: 2026-10-29. Fact = from the source linked. Guess = my reading. Vendor blogs are biased (they sell a competing tool).

## 1. Tsenta (the named competitor)

Name verified: **Tsenta**, YC Summer 2026, San Francisco, 2 founders (Agnay Srivastava, Pulkit Gupta). Source: [YC profile](https://www.ycombinator.com/companies/tsenta), [YC launch](https://www.ycombinator.com/launches/SBV-tsenta-your-ai-career-agent-that-applies-to-jobs-lands-you-interviews), [YourStory, Jun 2026](https://yourstory.com/2026/06/tsenta-wants-to-make-job-applications-faster-smarter-less-manual).

- What (fact): finds matching jobs from 2M+ listings, rewrites resume and cover letter per job, submits, tracks.
- How it applies (fact): handles account creation, email verification and OTP on 30+ ATS (hiring software). Says it runs "on-device" (on the user's own computer, not a cloud bot). Web, iOS, Android, Chrome extension, WhatsApp, iMessage.
- Sources it targets (fact, from press): company career pages and ATS such as Workday, Greenhouse, Lever, Ashby. Not job boards like LinkedIn.
- Price: 25 free applies, no card (fact, YC page). Paid plans: one source says from $9.99/month, not confirmed on Tsenta's own site (uncertain).
- Claim: "70% of paid users landed interviews" (self-reported, unverified).

## 2. Similar products

| Product | Market | How it applies | Price | Note |
|---|---|---|---|---|
| [Arya by Mentoria](https://yourstory.com/companies/arya-by-mentoria) | India | Tailors CV, applies, finds recruiter emails, follows up. Covers Naukri, LinkedIn India, Foundit, IIMJobs ([FPJ](https://www.freepressjournal.in/focused-view/jobright-vs-lazyapply-vs-arya-which-ai-job-search-tool-actually-works-in-india)) | Free plan + paid, about $3 to $30 ([SaaSWorthy](https://www.saasworthy.com/product/arya---indias-ai-job-hunter-by-mentoria), unconfirmed) | Closest Indian rival. Claims 27,500+ users |
| [BlinkJob.ai](https://www.theweek.in/wire-updates/business/2025/11/12/dcm17-blinkjob.ai.html) | India, freshers | Auto-applies to entry-level roles | Not found | Seed stage, same target user as us |
| Day by Weekday | India | WhatsApp agent, matches and applies | Free (per search summary, unconfirmed) | |
| [JobCopilot](https://jobcopilot.com/pricing) | Global | Cloud auto-apply + Chrome extension, review queue | About $0.93 to $1.05/day (fact, own page) | |
| [AIApply](https://www.weekday.works/post/aiapply-review) | Global | Tailors resume/cover letter, auto-apply, interview prep | Free / about $12/month ([Jobright](https://jobright.ai/blog/2025s-best-auto-apply-tools-for-tech-job-seekers/)) | |
| LazyApply | Global | Fully automatic, no review | $99 to $999/year (sources conflict, [Stork](https://www.stork.ai/compare/sonara-vs-lazyapply)) | Trustpilot about 2/5. Shows cost of spammy volume |

Guess: Indian rivals lean on Naukri/LinkedIn (risky, see below). Tsenta's safer route (ATS + career pages) is less crowded in India.

## 3. Legal and ban risk by source

| Source | Rule (fact) | Ban risk to candidate |
|---|---|---|
| **LinkedIn** | User Agreement bans bots and unauthorized automation. Users of such tools "risk having their accounts restricted or shut down" ([LinkedIn Help](https://www.linkedin.com/help/linkedin/answer/a1341387)). Enforced in practice ([Semafor](https://semafor.com/article/09/12/2024/linkedins-have-nots-and-have-bots)) | **HIGH** |
| **Indeed** | Help Center says job seekers should not use third-party bots to apply; access may be blocked ([Indeed jobseeker guidelines](https://support.indeed.com/hc/en-in/articles/360028540531)). Uses Persona bot checks ([Indeed Help](https://support.indeed.com/hc/en-us/articles/42975377990797)) | **HIGH** |
| **Naukri** | Terms bar duplicating/downloading material without authorization ([naukri.com terms](https://www.naukri.com/termsconditions)). Sister site Naukrigulf bans scraping by any means to build competing services ([Naukrigulf terms](https://naukrigulf.com/terms-and-conditions)). No public job API (vendor claim) | **HIGH** (guess: also a competitor to us, likely to enforce) |
| **Company career pages** | Each company's own terms. No common ban found | LOW to MEDIUM (guess) |
| **ATS portals (Greenhouse, Lever, Workday)** | No public ban on candidate tools found. Greenhouse has spam and fraud scoring ("Real Talent", [HC Mag](https://www.hcamag.com/au/news/general/new-ai-tool-to-combat-job-application-fraud-set-to-launch/556218)). Lever CAPTCHA and Workday anti-bot claims are vendor blogs only ([Hiration](https://www.hiration.com/blog/ai-auto-apply-bots/)) | LOW for bans, MEDIUM for "low quality" ranking if we spam |

Flags (things that could get candidate accounts banned):
- Any automation inside a logged-in LinkedIn, Indeed or Naukri session.
- Storing a candidate's job-board password to log in for them.
- High volume to one employer (ATS fraud scoring may bury the candidate).
- Bypassing CAPTCHAs (also illegal-adjacent, never do it).

## 4. Indian data law (DPDP)

- DPDP Rules 2025 notified 13 Nov 2025 (fact). Most duties phase in over 12 to 18 months; full compliance around May 2027 ([YourStory](https://yourstory.com/2025/11/digital-personal-data-protection-dpdp-rules-2025-rollout-over-18-months), [IndiaLaw](https://www.indialaw.in/blog/data-privacy/digital-personal-data-protection-act-2025-timelines-penalties)).
- Penalties up to Rs 250 crore per breach (sources conflict with Rs 25 crore; uncertain, check gazette).
- Meaning for us: resumes are personal data. We need clear consent, a privacy notice, delete-on-request, and safe storage from day one.

## 5. Recommendation (guess, your call)

- v1 sources: **ATS portals + company career pages only**. Job boards (LinkedIn, Naukri, Indeed) only as "open the job, candidate applies themselves", no automation.
- Keep "candidate approves each" (already chosen). It also lowers spam scoring.
- Never store job-board passwords. For ATS accounts, use a candidate-owned email.
- This is not legal advice. Before launch, a 1-hour lawyer check on terms and DPDP is worth it (cost estimate needed then).
