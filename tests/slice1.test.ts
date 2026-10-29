import { beforeEach, describe, expect, it } from "vitest";
import { openPglite, migrate, setDb, getDb } from "@/lib/db";
import { setAi } from "@/lib/ai";
import { extractText } from "@/lib/extract";
import { renderResumePdf } from "@/lib/pdf";
import {
  upsertUser, giveConsent, uploadResume, getProfile, saveProfile, saveAnswers, getAnswers,
  tailorForJob, getTailored, NoConsentError,
} from "@/lib/service";
import { SAMPLES, fakeAi, JOB_TEXT } from "./fixtures";

beforeEach(async () => {
  const db = await openPglite(); // fresh in-memory database per test
  await migrate(db);
  setDb(db);
  setAi(fakeAi);
});

async function newUser(consent = true) {
  const u = await upsertUser(`uid-${Math.random()}`, "t@example.com", "Test");
  if (consent) await giveConsent(u.id);
  return u;
}

describe("one shared database per server process", () => {
  it("returns the same database even if the module is loaded twice", async () => {
    const a = await getDb();
    const holder = globalThis as unknown as { __iaDb?: Promise<unknown> };
    expect(await holder.__iaDb).toBe(a);
  });
});

describe("FR-02 consent", () => {
  it("stores nothing before consent", async () => {
    const u = await newUser(false);
    const pdf = await renderResumePdf(SAMPLES[0]);
    await expect(uploadResume(u.id, "cv.pdf", pdf)).rejects.toBeInstanceOf(NoConsentError);
    await expect(saveAnswers(u.id, { relocate: "Yes" })).rejects.toBeInstanceOf(NoConsentError);
    const rows = await (await getDb()).query("SELECT * FROM profiles WHERE user_id = $1", [u.id]);
    expect(rows).toHaveLength(0);
    expect(await getAnswers(u.id)).toEqual({});
  });
});

describe("FR-03 resume upload is read into the profile", () => {
  it.each(SAMPLES.map((s) => [s.name, s] as const))("reads %s from a PDF", async (_n, sample) => {
    const u = await newUser();
    const pdf = await renderResumePdf(sample);
    const profile = await uploadResume(u.id, "resume.pdf", pdf);
    expect(profile.resume.name).toBe(sample.name);
    expect((await getProfile(u.id)).resume.skills).toEqual(sample.skills);
  });

  it("extracts the real text from a PDF (name, college, skills)", async () => {
    const text = await extractText("cv.pdf", await renderResumePdf(SAMPLES[1]));
    expect(text).toContain("Diya Iyer");
    expect(text).toContain("Sample College of Engineering");
    expect(text).toContain("Pandas");
  });

  it("reads plain text files and rejects unknown types", async () => {
    expect(await extractText("cv.txt", new TextEncoder().encode("Kabir Singh\nJava"))).toContain("Kabir Singh");
    await expect(extractText("cv.png", new Uint8Array([1, 2]))).rejects.toThrow(/PDF, DOCX or TXT/);
  });
});

describe("FR-04/FR-05 profile and common answers", () => {
  it("saves edits and answers", async () => {
    const u = await newUser();
    await saveProfile(u.id, { resume: SAMPLES[2], roles: ["Backend Developer"], cities: ["Pune"], remote_ok: true });
    expect((await getProfile(u.id)).roles).toEqual(["Backend Developer"]);
    await saveAnswers(u.id, { relocate: " Yes ", expected_ctc: "6" });
    expect(await getAnswers(u.id)).toEqual({ relocate: "Yes", expected_ctc: "6" });
  });

  it("rejects a malformed profile", async () => {
    const u = await newUser();
    await expect(saveProfile(u.id, { resume: { name: 1 } })).rejects.toThrow();
  });
});

describe("ATS-friendly PDF", () => {
  it("produces a valid PDF even with Indian symbols and long lines", async () => {
    const r = { ...SAMPLES[0], summary: "Expected CTC ₹6 LPA — open to relocate. ".repeat(20) };
    const pdf = await renderResumePdf(r);
    expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe("%PDF-");
    expect(await extractText("x.pdf", pdf)).toContain("Rs 6 LPA");
  });
});

describe("FR-10/FR-22 tailor to a pasted job", () => {
  it("needs a resume first", async () => {
    const u = await newUser();
    await expect(tailorForJob(u.id, JOB_TEXT, null)).rejects.toThrow(/Upload your resume/);
  });

  it("saves a tailored resume, cover note, changes and the apply-yourself link", async () => {
    const u = await newUser();
    await uploadResume(u.id, "cv.pdf", await renderResumePdf(SAMPLES[0]));
    const t = await tailorForJob(u.id, JOB_TEXT, "https://boards.example.com/jobs/1");
    expect(t.cover_note.length).toBeGreaterThan(0);
    expect(t.changes.length).toBeGreaterThan(0);
    const saved = await getTailored(u.id, t.id);
    expect(saved?.job_url).toBe("https://boards.example.com/jobs/1");
    expect(saved?.resume.name).toBe("Aarav Sharma");
  });

  it("does not show one user's tailored resume to another", async () => {
    const a = await newUser();
    const b = await newUser();
    await uploadResume(a.id, "cv.pdf", await renderResumePdf(SAMPLES[0]));
    const t = await tailorForJob(a.id, JOB_TEXT, null);
    expect(await getTailored(b.id, t.id)).toBeNull();
  });
});
