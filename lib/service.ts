import { getDb } from "./db";
import { getAi } from "./ai";
import { extractText } from "./extract";
import { emptyResume, ProfileSchema, type Profile, type Resume, type Tailored } from "./resume-schema";

export const CONSENT_VERSION = "2026-10-30";

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  consent_at: string | null;
  plan: string;
  free_used: number;
}

export class NoConsentError extends Error {
  constructor() {
    super("Consent is required before we store your data");
  }
}

async function log(userId: string, action: string) {
  await (await getDb()).query("INSERT INTO audit_log (user_id, action) VALUES ($1, $2)", [userId, action]);
}

export async function upsertUser(firebaseUid: string, email: string | null, name: string | null): Promise<User> {
  const db = await getDb();
  const rows = await db.query<User>(
    `INSERT INTO users (firebase_uid, email, name) VALUES ($1, $2, $3)
     ON CONFLICT (firebase_uid) DO UPDATE SET email = COALESCE(EXCLUDED.email, users.email)
     RETURNING id, email, name, consent_at, plan, free_used`,
    [firebaseUid, email, name],
  );
  return rows[0];
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = await (await getDb()).query<User>(
    "SELECT id, email, name, consent_at, plan, free_used FROM users WHERE id = $1 AND deleted_at IS NULL",
    [id],
  );
  return rows[0] ?? null;
}

export async function giveConsent(userId: string) {
  await (await getDb()).query("UPDATE users SET consent_at = now(), consent_version = $2 WHERE id = $1", [
    userId,
    CONSENT_VERSION,
  ]);
  await log(userId, "consent");
}

// FR-02: nothing personal is stored before consent.
async function requireConsent(userId: string) {
  const u = await getUserById(userId);
  if (!u?.consent_at) throw new NoConsentError();
}

export async function uploadResume(userId: string, fileName: string, bytes: Uint8Array): Promise<Profile> {
  await requireConsent(userId);
  const text = await extractText(fileName, bytes);
  if (text.length < 50) throw new Error("Could not read text from this file. Try a PDF exported from Word or Google Docs.");
  const resume = await getAi().readResume(text);
  const existing = await getProfile(userId);
  const profile: Profile = { ...existing, resume };
  await saveProfileRow(userId, profile, text);
  await log(userId, "resume_uploaded");
  return profile;
}

export async function getProfile(userId: string): Promise<Profile> {
  const rows = await (await getDb()).query<{ data: Profile }>("SELECT data FROM profiles WHERE user_id = $1", [userId]);
  return rows[0]?.data ?? { resume: emptyResume(), roles: [], cities: [], remote_ok: true };
}

export async function saveProfile(userId: string, input: unknown): Promise<Profile> {
  await requireConsent(userId);
  const profile = ProfileSchema.parse(input);
  await saveProfileRow(userId, profile, null);
  return profile;
}

async function saveProfileRow(userId: string, profile: Profile, resumeText: string | null) {
  await (await getDb()).query(
    `INSERT INTO profiles (user_id, data, resume_text) VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data,
       resume_text = COALESCE(EXCLUDED.resume_text, profiles.resume_text), updated_at = now()`,
    [userId, JSON.stringify(profile), resumeText],
  );
}

export async function getAnswers(userId: string): Promise<Record<string, string>> {
  const rows = await (await getDb()).query<{ question_key: string; answer: string }>(
    "SELECT question_key, answer FROM answers WHERE user_id = $1",
    [userId],
  );
  return Object.fromEntries(rows.map((r) => [r.question_key, r.answer]));
}

export async function saveAnswers(userId: string, answers: Record<string, string>) {
  await requireConsent(userId);
  const db = await getDb();
  for (const [key, value] of Object.entries(answers)) {
    if (typeof value !== "string") continue;
    await db.query(
      `INSERT INTO answers (user_id, question_key, answer) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, question_key) DO UPDATE SET answer = EXCLUDED.answer, updated_at = now()`,
      [userId, key, value.trim()],
    );
  }
}

export interface TailoredRecord extends Tailored {
  id: string;
  job_url: string | null;
}

// FR-10 + FR-22: tailored resume and cover note for any pasted job, with an "apply yourself" link.
export async function tailorForJob(userId: string, jobText: string, jobUrl: string | null): Promise<TailoredRecord> {
  await requireConsent(userId);
  const { resume } = await getProfile(userId);
  if (!resume.name && !resume.skills.length) throw new Error("Upload your resume first");
  if (jobText.trim().length < 80) throw new Error("Paste the full job description");
  const t = await getAi().tailor(resume, jobText);
  const rows = await (await getDb()).query<{ id: string }>(
    `INSERT INTO resumes (user_id, kind, job_title, job_company, job_url, job_text, data)
     VALUES ($1, 'tailored', $2, $3, $4, $5, $6) RETURNING id`,
    [userId, t.job_title, t.job_company, jobUrl, jobText, JSON.stringify(t)],
  );
  await log(userId, "resume_tailored");
  return { ...t, id: rows[0].id, job_url: jobUrl };
}

export async function getTailored(userId: string, id: string): Promise<TailoredRecord | null> {
  const rows = await (await getDb()).query<{ id: string; job_url: string | null; data: Tailored }>(
    "SELECT id, job_url, data FROM resumes WHERE user_id = $1 AND id = $2 AND kind = 'tailored'",
    [userId, id],
  );
  const r = rows[0];
  return r ? { ...r.data, id: r.id, job_url: r.job_url } : null;
}

export async function listTailored(userId: string) {
  return (await getDb()).query<{ id: string; job_title: string; job_company: string; created_at: string }>(
    "SELECT id, job_title, job_company, created_at FROM resumes WHERE user_id = $1 AND kind = 'tailored' ORDER BY created_at DESC",
    [userId],
  );
}

export type { Resume };
