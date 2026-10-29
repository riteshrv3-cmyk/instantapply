import { redirect } from "next/navigation";
import { currentUser } from "./auth";

// Pages after login: must be signed in and must have given consent (FR-02).
export async function requireReadyUser() {
  const user = await currentUser();
  if (!user) redirect("/");
  if (!user.consent_at) redirect("/consent");
  return user;
}
