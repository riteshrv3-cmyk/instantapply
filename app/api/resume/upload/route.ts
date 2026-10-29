import { NextResponse } from "next/server";
import { withUser } from "@/lib/http";
import { uploadResume } from "@/lib/service";

const MAX_BYTES = 5 * 1024 * 1024;

export const POST = withUser(async (user, req) => {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is larger than 5 MB" }, { status: 400 });
  const profile = await uploadResume(user.id, file.name, new Uint8Array(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, profile });
});
