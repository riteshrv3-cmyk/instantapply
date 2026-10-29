# Research R1: where Indian fresher tech jobs are, and which hiring software they use

Date: 2026-10-29. Done by 3 Haiku research agents (desk research, public pages only, no logins, no scraping). Labels: **Fact** = stated on a linked source. **Guess** = reading of evidence. **Uncertain** = not found or sources conflict.

Bottom line: **No source gives the share of fresher tech jobs per channel, or the share of fresher jobs on ATS portals.** Desk research cannot answer the main risk (whether fresher jobs sit on portals our robot can reach). The 10 candidate calls and 3 recruiter calls are needed.

## 1. Where fresher tech jobs get posted (R1a)

| Rank (guess) | Channel | Fresher tech share | Can our robot apply through it? |
|---|---|---|---|
| 1 | Campus placement drives | Uncertain (2023 report: IT services were main campus recruiters, [jaanojunction](https://www.jaanojunction.com/education/private-engineering-colleges-see-50-70-drop-in-placements)) | No (offline, college-run) |
| 2 | Mass-hiring company tests (TCS NQT, Infosys InfyTQ, Wipro, Cognizant, HCLTech, Accenture, Capgemini) | Uncertain (one unsourced blog estimate, [jobrise](https://jobrise.io/blog/mass-hiring-companies-india-2026)) | No (proprietary test platforms) |
| 3 | Company career sites | Uncertain | Unknown, likely yes for some |
| 4 | Naukri | Uncertain (only growth figures: fresher hiring +11% June 2025, [lokmattimes](https://www.lokmattimes.com/national/fresher-hiring-in-india-rises-11-pc-in-june-led-by-non-tech-sectors-tier-ii-cities-report)) | Unknown. Job boards are "apply yourself" only (DECISIONS) |
| 5 | Referrals | Uncertain | No |
| 6 | LinkedIn | Uncertain | Unknown. Job boards are "apply yourself" only |
| 7 | Internshala, Unstop, Freshersworld | Uncertain (self-reported counts) | Unknown |
| 8 | WhatsApp and Telegram job groups | Not found | No |

Meaning (guess): most fresher tech hiring runs through campus drives and company tests. Auto-apply has a small surface there.

## 2. Which hiring software (ATS) Indian companies use (R1b)

Source: R1b agent (4 pages read, 14 searches). No market-share data found for any vendor.

| ATS | Indian users found | Public job list page? | Account per company? | Confidence |
|---|---|---|---|---|
| Greenhouse | About 103 Indian companies, names not shown (third-party data, [TheirStack](https://theirstack.com/en/technology/greenhouse/in)) | Yes. Public read API, no login ([docs](https://docs.greenhouse.io/job-board.html)) | Uncertain | High on API, low on India |
| Lever | No verified Indian company | Yes. Public read API, no key ([GitHub](https://github.com/lever/postings-api)) | Uncertain | High on API, low on India |
| Ashby | None found | Yes. Public feed, auth not stated ([docs](https://developers.ashbyhq.com/docs/public-job-posting-api)) | Uncertain | High on API, low on India |
| Workday | Roles exist in India, no Indian employer named | No official public API | Uncertain | Low |
| SmartRecruiters | About 76 to 79 Indian companies (third-party data, [TheirStack](https://theirstack.com/it/technology/smartrecruiters/in)) | Uncertain | Uncertain | Low |
| iCIMS | About 16 Indian companies (third-party data) | Uncertain | Uncertain | Low |
| Zoho Recruit | Indian data centre exists; no named users | Career sites on tenant subdomains (third-party scraper) | Uncertain | Medium on hosting |
| Darwinbox | Mainly an HR suite; India share guessed at about 55% (vendor data) | Not found | Uncertain | Low |
| Keka Hire | Indian-market tool | Career portal; jobs pushed to Indeed ([Keka help](https://help.keka.com/hc/en-us/articles/39946792320401)) | Uncertain | Medium |
| Naukri RMS | Available in India (employer product, [Capterra](https://www.capterra.in/software/169303/naukri-rms)) | Uncertain | Uncertain | Low |
| Freshteam | Named as Indian-market tool, no names | Uncertain | Uncertain | Low |
| Instahyre | Indian tech hiring platform, mainly mid-to-senior (uncertain) | Not a company career-page ATS | Uncertain | Low |
| Oracle Taleo | None found | Not checked | Not checked | None |
| SAP SuccessFactors | None found | Uncertain | Yes: candidate must create an account ([SAP learning](https://learning.sap.com/courses/sap-successfactors-recruiting-candidate-experience-administration/describing-sap-successfactors-recruiting)) | Medium on account rule |

Focus first (agent view): Greenhouse, Lever, Ashby (documented public read APIs). Then Zoho Recruit and Keka. Workday, Taleo and SuccessFactors need account-flow checks. **Not found:** verified Indian company names on Lever, Ashby, SmartRecruiters, iCIMS, Taleo, SuccessFactors; any market-share data.

## 3. Rules for automated access (R1c)

| Platform | Public job API | Terms on bots / automated applying | Risk for us (guess) |
|---|---|---|---|
| Greenhouse | Yes, read API, no auth ([docs](https://docs.greenhouse.io/job-board.html)) | Job Board doc has no bot rule. Submitting needs the employer's own key. Candidate terms not found | Medium |
| Lever | Yes, read API ([GitHub](https://github.com/lever/postings-api)) | Apply POST needs an employer key. Lever steers to its hosted form and warns that postings may be scraped. Candidate terms not found | Medium |
| Ashby | Yes, read endpoint. No apply API, so applying means using the web page | Customer Terms not fetched, no bot rule verified | Medium |
| Workday | No official public API | Secondary source only (ConductAtlas) reports a clause banning robots or data extraction. Not verified on workday.com | High |

Must not do (agent view, matches repo rules): scrape Workday tenant career pages or ignore robots.txt; submit applications with an employer key we do not own; automate candidate logins or CAPTCHAs on any ATS.

Lawyer should check: candidate and website terms for Greenhouse, Lever, Ashby and each Workday tenant; whether filling and submitting hosted forms for candidates breaks contract or computer-misuse law (India IT Act); DPDP consent when we apply on a candidate's behalf; whether the employer's consent is needed when the candidate approves each job.

## What this means (guess)
- Desk research cannot tell us the share of fresher jobs that sit on ATS portals. This is challenge 1, and it needs your calls.
- The three ATS with public read APIs (Greenhouse, Lever, Ashby) are the technical starting point, but Indian usage is unverified.
- Read-only job listing is clearly allowed on those APIs. Submitting an application through them is not an option without an employer key. Our robot would use the public apply page instead, which needs the lawyer check above.
