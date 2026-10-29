import { NextResponse } from "next/server";
import { withUser } from "@/lib/http";
import { tailorForJob } from "@/lib/service";

export const POST = withUser(async (user, req) => {
  const { jobText, jobUrl } = (await req.json()) as { jobText?: string; jobUrl?: string };
  const url = jobUrl?.trim() || null;
  if (url && !/^https?:\/\//i.test(url)) return NextResponse.json({ error: "Job link must start with http" }, { status: 400 });
  const t = await tailorForJob(user.id, jobText ?? "", url);
  return NextResponse.json({ id: t.id });
});
