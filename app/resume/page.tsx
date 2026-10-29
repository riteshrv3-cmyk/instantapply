import Link from "next/link";
import Shell from "../components/Shell";
import { requireReadyUser } from "@/lib/guard";
import { getProfile, listTailored } from "@/lib/service";

// Resume home: master resume download + list of tailored resumes.
export default async function ResumePage() {
  const user = await requireReadyUser();
  const [{ resume }, tailored] = await Promise.all([getProfile(user.id), listTailored(user.id)]);
  const hasResume = Boolean(resume.name || resume.skills.length);

  return (
    <Shell active="/resume" title="Your resume">
      {!hasResume ? (
        <div className="card space-y-3 text-center">
          <p className="font-medium">No resume yet</p>
          <Link href="/upload" className="btn-primary w-full">Upload resume</Link>
        </div>
      ) : (
        <div className="card space-y-3">
          <div>
            <div className="text-lg font-bold">{resume.name}</div>
            <div className="text-sm text-muted">{resume.education[0]?.degree} {resume.education[0]?.college && `· ${resume.education[0].college}`}</div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.slice(0, 12).map((s) => (
              <span key={s} className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">{s}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a href="/api/resume/pdf" className="btn-primary">Download PDF</a>
            <Link href="/upload" className="btn-ghost">Replace</Link>
          </div>
          <p className="text-xs text-muted">ATS-friendly: one column, plain text, standard headings, so hiring software can read every line.</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <h2 className="font-semibold">Tailored for jobs</h2>
        <Link href="/tailor" className="text-sm font-medium text-brand">+ New</Link>
      </div>
      {tailored.length === 0 ? (
        <p className="text-sm text-muted">Paste a job description to get a resume made for that job.</p>
      ) : (
        <ul className="space-y-2">
          {tailored.map((t) => (
            <li key={t.id}>
              <Link href={`/tailor/${t.id}`} className="card block">
                <div className="font-medium">{t.job_title || "Job"}</div>
                <div className="text-sm text-muted">{t.job_company}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
