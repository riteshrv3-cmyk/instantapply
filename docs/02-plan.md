# 02 Plan (DRAFT, not approved)

Phase 2 of `00-process.md`. Input: `01-requirements.md` (APPROVED 2026-10-29, FR-22 added). Date 2026-10-29.

Rule from Ritesh (2026-10-29): copy Tsenta's product and stack choices, no own creativity, build fast. We copy the product (flows, screens' structure, features, tech choices). We write our own code. No Tsenta code, text, prompts, images or decompiled app parts (their Terms 3(c) + copyright).

## 1. Stack: same as Tsenta

| Part | Tsenta uses | Source | We use |
|---|---|---|---|
| Website | Next.js on Vercel | Fact: tsenta.com response header "Server: Vercel" and `_next/static` files (checked 2026-10-29) | Next.js on Vercel |
| Login | Firebase Authentication | Fact: [Privacy s.3](https://tsenta.com/privacy) | Firebase Authentication (Google sign-in) |
| API servers + database | Fly.io + PostgreSQL | Fact: [Privacy s.3](https://tsenta.com/privacy) | Fly.io + PostgreSQL |
| Front door / security | Cloudflare | Fact: [Privacy s.3](https://tsenta.com/privacy) | Cloudflare |
| AI | Anthropic (Claude), OpenAI, Azure AI | Fact: [Privacy s.3](https://tsenta.com/privacy) | Claude main, OpenAI backup |
| Monitoring | SigNoz | Fact: extension config (teardown) | SigNoz |
| Payments | Dodo Payments | Fact: [Privacy](https://tsenta.com/privacy) | Dodo Payments if it takes Rs 999/month subscriptions from Indian cards and UPI (open, check in step 1); else Razorpay |
| Apply engine | Cloud browser, "live overlay or fully headless" | Fact claim; how exactly: Guess | Headless Chrome run by Playwright (free, open source) on Fly.io workers |
| Messages | iMessage, WhatsApp | Fact | WhatsApp only (Meta WhatsApp Business Platform) |

## 2. Gmail (OTP + reply tracking)
- Fact ([Google help](https://support.google.com/cloud/answer/15549945)): an unverified app asking for restricted scopes (Gmail read) is capped at **100 new users for the life of the project**. Testing mode is also capped at 100 test users, and its logins expire after 7 days.
- Meaning: the 100-candidate pilot fits, using unverified production mode (users see a "Google hasn't verified this app" screen). No weekly re-login.
- After the pilot: Google's annual security assessment. Cost: one developer reported about $540 and one month ([IndieHackers](https://www.indiehackers.com/product/mailnotes)); vendors quote much higher. Uncertain. Start it as soon as the pilot shows promise.

## 3. Running costs (to measure, not guess)

| Item | Price found | Label |
|---|---|---|
| WhatsApp utility message (India) | About Rs 0.12 to 0.15 each; free inside the 24-hour reply window ([Meta pricing](https://developers.facebook.com/docs/whatsapp/pricing), blogs disagree) | Uncertain |
| Cloud browser | Self-run Playwright: hosting cost only. Hosted options about $0.10 to $0.12 per browser hour ([TinyFish](https://www.tinyfish.ai/blog/browserbase-pricing)) | Estimate |
| Razorpay subscription (fallback) | 2% gateway + 0.99% subscription fee + GST on cards ([Razorpay](https://razorpay.com/blog/razorpay-payment-gateway-pricing-explained/)) | Fact for cards; UPI AutoPay fee not found |
| AI per application (tailor resume + answers) | Measure in build slice 1 | Open |

Cost per application is measured in the first build slices, then the monthly budget is set (requirements decision).

## 4. Build order (each slice works alone)
1. **Setup:** Vercel, Fly.io, Postgres, Firebase, Cloudflare, Claude key, SigNoz. Accounts and keys from Ritesh.
2. **Resume (FR-01 to FR-05, FR-10, FR-22):** sign in, consent, upload, AI reads it, profile, tailored resume PDF + cover note, "apply yourself" link. Usable product on its own.
3. **Jobs (FR-08, FR-09):** job feed from Greenhouse, Lever, Ashby public job lists (read APIs allowed, research 03), % match + reason.
4. **Apply robot (FR-11, FR-12, FR-14, FR-15, FR-18):** Approve screen, Playwright robot for Greenhouse first, then Lever, Ashby. Receipt. Needs-you. Daily cap 10.
5. **Gmail (FR-06, FR-13, FR-17):** OTP reading, reply tracking.
6. **WhatsApp (FR-07), payments (FR-19), delete data (FR-20), admin (FR-21).**

## 5. How we use rea to go fast
- **Map each ATS form:** rea inspects public Greenhouse / Lever / Ashby application pages (fields, steps, uploads), so each robot handler is written quickly.
- **Local test copies:** rea records a real application page and turns it into a local copy (its "AgentEnv" feature). The robot is tested on copies, so no real application is sent while building and no manual testing is needed.
- **Not used on Tsenta's apps** to take code. Only to learn how something works, as in the teardown.

## 6. Testing (minimum, fast)
- Automated tests only where a bug costs a candidate: the robot on local copies of each ATS form, and the "nothing sent without Approve" rule.
- Ritesh opens each slice in the browser pane once (his "done" rule).

## 7. Open items
- O1: Dodo Payments for Indian rupee subscriptions: yes or no (check its own site).
- O2: Accounts and keys from Ritesh: Vercel, Fly.io, Firebase, Cloudflare, Anthropic, WhatsApp Business, payments, a domain.
- O3: Product name and domain (Instant Apply is a working name).

## Approval
Ritesh writes here: APPROVED (date) ____
