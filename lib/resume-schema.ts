import { z } from "zod";

// The one resume shape used everywhere: AI output, profile, PDF, tailoring.
export const ResumeSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  links: z.array(z.string()), // GitHub, LinkedIn, portfolio
  summary: z.string(),
  education: z.array(
    z.object({
      college: z.string(),
      degree: z.string(),
      cgpa: z.string(),
      grad_year: z.string(),
    }),
  ),
  skills: z.array(z.string()),
  projects: z.array(
    z.object({
      title: z.string(),
      github: z.string(),
      points: z.array(z.string()),
    }),
  ),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      dates: z.string(),
      points: z.array(z.string()),
    }),
  ),
  certifications: z.array(z.string()),
});
export type Resume = z.infer<typeof ResumeSchema>;

// Profile = resume + job preferences (design S4).
export const ProfileSchema = z.object({
  resume: ResumeSchema,
  roles: z.array(z.string()),
  cities: z.array(z.string()),
  remote_ok: z.boolean(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const TailorSchema = z.object({
  job_title: z.string(),
  job_company: z.string(),
  resume: ResumeSchema,
  cover_note: z.string(),
  changes: z.array(z.object({ before: z.string(), after: z.string(), why: z.string() })),
  match_score: z.number(), // 0-100
  match_reason: z.string(),
});
export type Tailored = z.infer<typeof TailorSchema>;

export function emptyResume(): Resume {
  return {
    name: "", email: "", phone: "", location: "", links: [], summary: "",
    education: [], skills: [], projects: [], experience: [], certifications: [],
  };
}

// Common screening questions answered once at signup (design S5, FR-05).
export const COMMON_QUESTIONS: { key: string; text: string }[] = [
  { key: "notice_period", text: "Notice period (if working)" },
  { key: "expected_ctc", text: "Expected CTC (LPA)" },
  { key: "current_ctc", text: "Current CTC (LPA, 0 if fresher)" },
  { key: "relocate", text: "Willing to relocate? (Yes/No)" },
  { key: "work_authorization", text: "Authorized to work in India? (Yes/No)" },
  { key: "sponsorship", text: "Need visa sponsorship? (Yes/No)" },
  { key: "start_date", text: "Earliest start date" },
  { key: "years_experience", text: "Total experience in years" },
  { key: "highest_degree", text: "Highest degree (e.g. B.Tech CSE)" },
  { key: "backlogs", text: "Active backlogs (number)" },
  { key: "gender", text: "Gender (optional)" },
  { key: "linkedin", text: "LinkedIn profile URL" },
  { key: "github", text: "GitHub profile URL" },
  { key: "portfolio", text: "Portfolio or website URL" },
  { key: "hear_about", text: "How did you hear about jobs? (default: Company website)" },
];
