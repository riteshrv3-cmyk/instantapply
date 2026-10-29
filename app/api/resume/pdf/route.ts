import { NextResponse } from "next/server";
import { withUser } from "@/lib/http";
import { getProfile, getTailored } from "@/lib/service";
import { renderResumePdf } from "@/lib/pdf";

// GET /api/resume/pdf            -> master resume
// GET /api/resume/pdf?id=<id>    -> tailored resume for one job
export const GET = withUser(async (user, req) => {
  const id = new URL(req.url).searchParams.get("id");
  let resume;
  let file = "resume";
  if (id) {
    const t = await getTailored(user.id, id);
    if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
    resume = t.resume;
    file = `resume-${t.job_company || "job"}`;
  } else {
    resume = (await getProfile(user.id)).resume;
  }
  const name = `${(resume.name || "my").replace(/\W+/g, "-")}-${file.replace(/\W+/g, "-")}.pdf`.toLowerCase();
  const bytes = await renderResumePdf(resume);
  return new Response(Buffer.from(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${name}"` },
  });
});
