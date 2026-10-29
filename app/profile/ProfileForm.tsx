"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/resume-schema";
import { send } from "../components/send";

const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function ProfileForm({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [p, setP] = useState<Profile>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const r = p.resume;
  const edu = r.education[0] ?? { college: "", degree: "", cgpa: "", grad_year: "" };

  const setR = (patch: Partial<Profile["resume"]>) => setP({ ...p, resume: { ...r, ...patch } });
  const setEdu = (patch: Partial<typeof edu>) => setR({ education: [{ ...edu, ...patch }, ...r.education.slice(1)] });
  const setProject = (i: number, patch: Partial<Profile["resume"]["projects"][number]>) =>
    setR({ projects: r.projects.map((x, j) => (j === i ? { ...x, ...patch } : x)) });

  async function save() {
    setBusy(true);
    setMsg("");
    const res = await send("/api/profile", "PUT", p);
    setBusy(false);
    setMsg(res.error ?? "Saved");
    if (!res.error) router.refresh();
  }

  const text = (label: string, value: string, on: (v: string) => void, placeholder = "") => (
    <div>
      <label className="label">{label}</label>
      <input className="field" value={value} placeholder={placeholder} onChange={(e) => on(e.target.value)} />
    </div>
  );

  return (
    <div className="space-y-4">
      {!r.name && (
        <a href="/upload" className="card block text-sm font-medium text-brand">Upload your resume to fill this in automatically</a>
      )}

      <section className="card space-y-3">
        <h2 className="font-semibold">Basics</h2>
        {text("Full name", r.name, (v) => setR({ name: v }))}
        {text("Email", r.email, (v) => setR({ email: v }))}
        {text("Phone", r.phone, (v) => setR({ phone: v }), "+91 ...")}
        {text("City", r.location, (v) => setR({ location: v }))}
        {text("Links (comma separated)", r.links.join(", "), (v) => setR({ links: list(v) }), "github.com/you, linkedin.com/in/you")}
        <div>
          <label className="label">Summary</label>
          <textarea className="field min-h-20" value={r.summary} onChange={(e) => setR({ summary: e.target.value })} />
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">Education</h2>
        {text("College", edu.college, (v) => setEdu({ college: v }))}
        {text("Degree and branch", edu.degree, (v) => setEdu({ degree: v }), "B.Tech CSE")}
        <div className="grid grid-cols-2 gap-3">
          {text("CGPA", edu.cgpa, (v) => setEdu({ cgpa: v }))}
          {text("Graduation year", edu.grad_year, (v) => setEdu({ grad_year: v }))}
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">Skills</h2>
        {text("Skills (comma separated)", r.skills.join(", "), (v) => setR({ skills: list(v) }))}
      </section>

      <section className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Projects</h2>
          <button className="text-sm font-medium text-brand" onClick={() => setR({ projects: [...r.projects, { title: "", github: "", points: [] }] })}>
            + Add
          </button>
        </div>
        {r.projects.map((pr, i) => (
          <div key={i} className="space-y-2 rounded-xl bg-paper p-3">
            {text("Title", pr.title, (v) => setProject(i, { title: v }))}
            {text("GitHub link", pr.github, (v) => setProject(i, { github: v }))}
            <div>
              <label className="label">What you did (one point per line)</label>
              <textarea
                className="field min-h-20"
                value={pr.points.join("\n")}
                onChange={(e) => setProject(i, { points: e.target.value.split("\n") })}
              />
            </div>
            <button className="text-xs text-red-600" onClick={() => setR({ projects: r.projects.filter((_, j) => j !== i) })}>
              Remove project
            </button>
          </div>
        ))}
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">Jobs you want</h2>
        {text("Roles (comma separated)", p.roles.join(", "), (v) => setP({ ...p, roles: list(v) }), "Frontend Developer, Data Analyst")}
        {text("Cities (comma separated)", p.cities.join(", "), (v) => setP({ ...p, cities: list(v) }), "Pune, Bengaluru")}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={p.remote_ok} onChange={(e) => setP({ ...p, remote_ok: e.target.checked })} />
          Open to remote jobs
        </label>
      </section>

      <div className="sticky bottom-16 space-y-1">
        <button className="btn-primary w-full" disabled={busy} onClick={save}>
          {busy ? "Saving..." : "Save profile"}
        </button>
        {msg && <p className={`text-center text-sm ${msg === "Saved" ? "text-green-700" : "text-red-600"}`}>{msg}</p>}
      </div>
    </div>
  );
}
