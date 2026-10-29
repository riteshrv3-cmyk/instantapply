import { NextResponse } from "next/server";
import { verifyFirebaseToken, startSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { idToken } = (await req.json()) as { idToken?: string };
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });
    const user = await startSession(await verifyFirebaseToken(idToken));
    return NextResponse.json({ ok: true, consented: Boolean(user.consent_at) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Sign-in failed. Please try again." }, { status: 401 });
  }
}
