import { redirect } from "next/navigation";
import { currentUser, devLoginOn } from "@/lib/auth";
import SignIn from "./components/SignIn";

// S1 Landing
export default async function Landing() {
  const user = await currentUser();
  if (user) redirect(user.consent_at ? "/resume" : "/consent");
  const firebaseReady = Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-8 p-6">
      <div>
        <div className="text-sm font-semibold tracking-wide text-brand">INSTANT APPLY</div>
        <h1 className="mt-2 text-3xl font-bold leading-tight">Your resume, rewritten for every job you want.</h1>
        <p className="mt-3 text-muted">
          Upload your resume once. Paste any job. Get an ATS-ready resume and cover note made for that job in seconds.
        </p>
      </div>

      <ol className="space-y-3">
        {["Upload your resume", "Paste a job you like", "Download the tailored resume and apply"].map((s, i) => (
          <li key={s} className="card flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 font-bold text-brand">{i + 1}</span>
            <span className="font-medium">{s}</span>
          </li>
        ))}
      </ol>

      <div className="space-y-3">
        <SignIn firebaseReady={firebaseReady} devLogin={devLoginOn()} />
        <p className="text-center text-xs text-muted">Free to start: 25 applications. No card needed.</p>
      </div>
    </div>
  );
}
