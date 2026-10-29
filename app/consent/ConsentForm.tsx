"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { send } from "../components/send";

export default function ConsentForm() {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function agree() {
    setBusy(true);
    const r = await send("/api/consent", "POST");
    setBusy(false);
    if (r.error) return setError(r.error);
    router.push("/upload");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1 h-4 w-4" checked={ok} onChange={(e) => setOk(e.target.checked)} />
        <span>I agree that Instant Apply stores and uses my data as described above.</span>
      </label>
      <button className="btn-primary w-full" disabled={!ok || busy} onClick={agree}>
        Agree and continue
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
