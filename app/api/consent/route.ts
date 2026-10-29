import { NextResponse } from "next/server";
import { withUser } from "@/lib/http";
import { giveConsent } from "@/lib/service";

export const POST = withUser(async (user) => {
  await giveConsent(user.id);
  return NextResponse.json({ ok: true });
});
