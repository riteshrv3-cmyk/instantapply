import { notFound } from "next/navigation";
import Shell from "../../components/Shell";
import { requireReadyUser } from "@/lib/guard";
import { getTailored } from "@/lib/service";
import CopyButton from "./CopyButton";

// S9 (slice 1 version): before/after changes, cover note, download, apply yourself.
export default async function TailoredPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireReadyUser();
  const { id } = await params;
  const t = await getTailored(user.id, id);
  if (!t) notFound();

  return (
    <Shell active="/tailor" title={t.job_title || "Tailored resume"}>
      <div className="card flex items-center justify-between">
        <div>
          <div className="font-semibold">{t.job_company}</div>
          <div className="text-sm text-muted">{t.match_reason}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-brand">{Math.round(t.match_score)}%</div>
          <div className="text-xs text-muted">match</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a href={`/api/resume/pdf?id=${t.id}`} className="btn-primary">Download resume</a>
        {t.job_url ? (
          <a href={t.job_url} target="_blank" rel="noopener noreferrer" className="btn-ghost">Apply yourself</a>
        ) : (
          <span className="btn-ghost opacity-50">No job link</span>
        )}
      </div>

      <section className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Cover note</h2>
          <CopyButton text={t.cover_note} />
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{t.cover_note}</p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">What we changed ({t.changes.length})</h2>
        {t.changes.map((c, i) => (
          <div key={i} className="space-y-1 rounded-xl bg-paper p-3 text-sm">
            <p className="text-red-700 line-through decoration-red-300">{c.before || "(new line)"}</p>
            <p className="text-green-800">{c.after}</p>
            <p className="text-xs text-muted">{c.why}</p>
          </div>
        ))}
      </section>
    </Shell>
  );
}
