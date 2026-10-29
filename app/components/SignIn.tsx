"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn({ firebaseReady, devLogin }: { firebaseReady: boolean; devLogin: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function finish(res: Response) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sign-in failed");
    router.push(data.consented ? "/resume" : "/consent");
    router.refresh();
  }

  async function google() {
    setBusy(true);
    setError("");
    try {
      const { initializeApp, getApps } = await import("firebase/app");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const app =
        getApps()[0] ??
        initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      const cred = await signInWithPopup(getAuth(app), new GoogleAuthProvider());
      const idToken = await cred.user.getIdToken();
      await finish(await fetch("/api/auth/session", { method: "POST", body: JSON.stringify({ idToken }) }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function dev() {
    setBusy(true);
    setError("");
    try {
      await finish(await fetch("/api/auth/dev", { method: "POST" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button className="btn-primary w-full" onClick={google} disabled={busy || !firebaseReady}>
        Continue with Google
      </button>
      {!firebaseReady && <p className="text-center text-xs text-muted">Google sign-in needs Firebase keys in .env</p>}
      {devLogin && (
        <button className="btn-ghost w-full" onClick={dev} disabled={busy}>
          Dev login (local testing only)
        </button>
      )}
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}
