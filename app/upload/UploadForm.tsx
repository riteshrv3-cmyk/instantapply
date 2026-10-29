"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { send } from "../components/send";

export default function UploadForm({ next = "/profile" }: { next?: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload() {
    if (!file) return;
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    const r = await send("/api/resume/upload", "POST", form);
    setBusy(false);
    if (r.error) return setError(r.error);
    router.push(next);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <label className="card flex cursor-pointer flex-col items-center gap-2 border-dashed py-10 text-center">
        <span className="font-semibold">{file ? file.name : "Tap to choose your resume"}</span>
        <span className="text-xs text-muted">Max 5 MB</span>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <button className="btn-primary w-full" disabled={!file || busy} onClick={upload}>
        {busy ? "Reading your resume..." : "Upload and read"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
