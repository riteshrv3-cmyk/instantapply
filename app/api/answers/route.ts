import { NextResponse } from "next/server";
import { withUser } from "@/lib/http";
import { saveAnswers } from "@/lib/service";

export const PUT = withUser(async (user, req) => {
  await saveAnswers(user.id, (await req.json()) as Record<string, string>);
  return NextResponse.json({ ok: true });
});
