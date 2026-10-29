"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { send } from "../components/send";

export default function TailorForm() {
  const router = useRouter();
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setBusy(true);
    setError("");
    const r = await send<{ id: string }>("/api/tailor", "POST", { jobUrl, jobText });
    setBusy(false);
    if (r.error || !r.data) return setError(r.error ?? "Something went wrong");
    router.push(`/tailor/${r.data.id}`);
  }

  return (
    <div className="space-y-3">
      <div className="card space-y-3">
        <div>
          <label className="label">Job link (optional, for "Apply yourself")</label>
          <input className="field" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="label">Job description</label>
          <textarea
            className="field min-h-56"
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste the full job description here"
          />
        </div>
      </div>
      <button className="btn-primary w-full" disabled={busy || jobText.trim().length < 80} onClick={go}>
        {busy ? "Tailoring your resume (about 30 seconds)..." : "Tailor my resume"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
