import { SignJWT, jwtVerify, createRemoteJWKSet } from "jose";
import { cookies } from "next/headers";
import { upsertUser, getUserById, type User } from "./service";

const COOKIE = "ia_session";

function secret() {
  const s = process.env.SESSION_SECRET || (devLoginOn() ? "dev-only-secret-change-me-0123456789" : "");
  if (!s) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(s);
}

export const devLoginOn = () => process.env.DEV_LOGIN === "1" && process.env.NODE_ENV !== "production";

// Firebase ID tokens are signed by Google; verify against Google's public keys (no secret needed).
const googleKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

export async function verifyFirebaseToken(idToken: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("Firebase is not configured");
  const { payload } = await jwtVerify(idToken, googleKeys, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });
  return {
    uid: String(payload.sub),
    email: typeof payload.email === "string" ? payload.email : null,
    name: typeof payload.name === "string" ? payload.name : null,
  };
}

export async function startSession(who: { uid: string; email: string | null; name: string | null }) {
  const user = await upsertUser(who.uid, who.email, who.name);
  const token = await new SignJWT({ uid: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return user;
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return await getUserById(String(payload.uid));
  } catch {
    return null;
  }
}
