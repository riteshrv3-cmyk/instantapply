"use client";

import { useState } from "react";
import { send } from "../components/send";

export default function AnswersForm({
  questions,
  initial,
}: {
  questions: { key: string; text: string }[];
  initial: Record<string, string>;
}) {
  const [a, setA] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setBusy(true);
    const r = await send("/api/answers", "PUT", a);
    setBusy(false);
    setMsg(r.error ?? "Saved");
  }

  return (
    <div className="space-y-3">
      <div className="card space-y-3">
        {questions.map((q) => (
          <div key={q.key}>
            <label className="label">{q.text}</label>
            <input className="field" value={a[q.key] ?? ""} onChange={(e) => setA({ ...a, [q.key]: e.target.value })} />
          </div>
        ))}
      </div>
      <button className="btn-primary w-full" disabled={busy} onClick={save}>
        {busy ? "Saving..." : "Save answers"}
      </button>
      {msg && <p className={`text-center text-sm ${msg === "Saved" ? "text-green-700" : "text-red-600"}`}>{msg}</p>}
    </div>
  );
}
