import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { currentUser } from "./auth";
import { NoConsentError, type User } from "./service";

// Wrap a route handler: require login, turn errors into clear JSON messages.
export function withUser(handler: (user: User, req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Please sign in again" }, { status: 401 });
    try {
      return await handler(user, req);
    } catch (e) {
      if (e instanceof NoConsentError) return NextResponse.json({ error: e.message }, { status: 403 });
      if (e instanceof ZodError) return NextResponse.json({ error: "Some fields are invalid" }, { status: 400 });
      console.error(e);
      return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong" }, { status: 400 });
    }
  };
}
