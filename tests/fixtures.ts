import type { Ai } from "@/lib/ai";
import { emptyResume, type Resume } from "@/lib/resume-schema";

// Fake people only. No real candidate data in tests.
export const SAMPLES: Resume[] = [
  {
    ...emptyResume(),
    name: "Aarav Sharma", email: "aarav.test@example.com", phone: "+91 90000 00001", location: "Pune",
    links: ["github.com/aarav-test"], summary: "Final-year CSE student who builds web apps.",
    education: [{ college: "Test Institute of Technology", degree: "B.Tech CSE", cgpa: "8.4", grad_year: "2026" }],
    skills: ["JavaScript", "React", "Node.js", "SQL"],
    projects: [{ title: "Campus Food App", github: "github.com/aarav-test/food", points: ["Built ordering flow used by 300 students"] }],
  },
  {
    ...emptyResume(),
    name: "Diya Iyer", email: "diya.test@example.com", phone: "+91 90000 00002", location: "Chennai",
    education: [{ college: "Sample College of Engineering", degree: "B.E. IT", cgpa: "7.9", grad_year: "2025" }],
    skills: ["Python", "Pandas", "Machine Learning"],
    projects: [{ title: "Crop Price Predictor", github: "", points: ["Trained a regression model on 5 years of mandi prices"] }],
    experience: [{ role: "Data Intern", company: "Demo Analytics", dates: "May-Jul 2025", points: ["Cleaned 1M rows"] }],
  },
  {
    ...emptyResume(),
    name: "Kabir Singh", email: "kabir.test@example.com", phone: "+91 90000 00003", location: "Delhi NCR",
    education: [{ college: "Example University", degree: "BCA", cgpa: "8.9", grad_year: "2026" }],
    skills: ["Java", "Spring Boot", "MySQL"],
    certifications: ["Oracle Java Foundations (sample)"],
  },
];

// Fake AI: "reads" a resume by finding which sample's name is in the text; tailors by echoing.
export const fakeAi: Ai = {
  async readResume(text) {
    const hit = SAMPLES.find((s) => text.includes(s.name));
    if (!hit) throw new Error("fake AI: unknown resume");
    return structuredClone(hit);
  },
  async tailor(resume, jobText) {
    const first = resume.skills[0] ?? "";
    return {
      job_title: "Software Engineer - Fresher",
      job_company: "Demo Corp",
      resume: { ...resume, summary: `${resume.summary} Focused on ${first}.` },
      cover_note: `I am applying for the role. ${jobText.slice(0, 20)}`,
      changes: [{ before: resume.summary, after: `${resume.summary} Focused on ${first}.`, why: "Matches job keywords" }],
      match_score: 72,
      match_reason: `Strong ${first} match`,
    };
  },
};

export const JOB_TEXT =
  "Demo Corp is hiring a Software Engineer (Fresher, 0-1 years) in Pune. You will build React and Node.js features, " +
  "write SQL, and work with a small product team. B.Tech/BE 2025-2026 batch preferred.";
