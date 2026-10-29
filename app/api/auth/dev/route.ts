import { NextResponse } from "next/server";
import { devLoginOn, startSession } from "@/lib/auth";

// Local testing only (DEV_LOGIN=1, never in production): sign in as a fixed test user.
export async function POST() {
  if (!devLoginOn()) return NextResponse.json({ error: "Not available" }, { status: 404 });
  await startSession({ uid: "dev-user", email: "dev@example.com", name: "Dev Tester" });
  return NextResponse.json({ ok: true });
}
