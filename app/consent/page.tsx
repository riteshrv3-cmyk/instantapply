import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import ConsentForm from "./ConsentForm";

// S2 Consent (FR-02, India DPDP Act)
export default async function ConsentPage() {
  const user = await currentUser();
  if (!user) redirect("/");
  if (user.consent_at) redirect("/resume");

  return (
    <div className="mx-auto max-w-lg space-y-5 p-6">
      <div className="text-sm font-semibold tracking-wide text-brand">INSTANT APPLY</div>
      <h1 className="text-2xl font-bold">Before we start</h1>
      <div className="card space-y-3 text-sm leading-relaxed">
        <p><b>What we store:</b> your resume, profile details (college, CGPA, skills, projects), your answers to common job questions, and the tailored resumes you create.</p>
        <p><b>Why:</b> to build your resume, tailor it to jobs, and (later, only after you approve each one) fill job applications for you.</p>
        <p><b>Who sees it:</b> only you. Your resume text is sent to our AI provider (Anthropic) to read and rewrite it. We never sell your data.</p>
        <p><b>Your control:</b> you can edit your data at any time from Profile. Self-serve account deletion comes before public launch.</p>
      </div>
      <ConsentForm />
    </div>
  );
}
