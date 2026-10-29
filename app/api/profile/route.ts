import { NextResponse } from "next/server";
import { withUser } from "@/lib/http";
import { getProfile, saveProfile } from "@/lib/service";

export const GET = withUser(async (user) => NextResponse.json(await getProfile(user.id)));

export const PUT = withUser(async (user, req) => NextResponse.json(await saveProfile(user.id, await req.json())));
