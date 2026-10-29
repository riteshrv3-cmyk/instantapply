import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import { ResumeSchema, TailorSchema, type Resume, type Tailored } from "./resume-schema";

// AI functions are swappable so tests never call the paid API.
export interface Ai {
  readResume(text: string): Promise<Resume>;
  tailor(resume: Resume, jobText: string): Promise<Tailored>;
}

const model = () => process.env.CLAUDE_MODEL || "claude-opus-5-5";

async function ask<S extends z.ZodType>(schema: S, system: string, user: string): Promise<z.infer<S>> {
  const client = new Anthropic();
  const res = await client.beta.messages.parse({
    model: model(),
    max_tokens: 16000,
    // If a safety check declines, the API retries on a fallback model by itself.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low", format: betaZodOutputFormat(schema) },
    system,
    messages: [{ role: "user", content: user }],
  });
  if (res.stop_reason === "refusal") throw new Error("AI declined this request");
  if (!res.parsed_output) throw new Error("AI returned no usable result");
  return res.parsed_output as z.infer<S>;
}

export const claudeAi: Ai = {
  readResume(text) {
    return ask(
      ResumeSchema,
      "You read resumes of Indian tech freshers and return their content as structured fields. " +
        "Copy facts exactly as written. Never invent anything. Use an empty string or empty list when a field is missing.",
      `Resume text:\n\n${text}`,
    );
  },
  tailor(resume, jobText) {
    return ask(
      TailorSchema,
      "You tailor a fresher's resume to one job so it passes ATS keyword screening and reads well to a recruiter. " +
        "Rules: only reorder, rephrase and emphasise what is already true in the resume. Never add skills, projects, " +
        "employers, numbers or degrees the candidate does not have. Use the job's own keywords where they truthfully apply. " +
        "List every changed line in `changes` (before, after, why). Write a short cover note (under 120 words, plain, " +
        "no clichés). Give an honest 0-100 match score with a one-line reason.",
      `Candidate resume (JSON):\n${JSON.stringify(resume)}\n\nJob description:\n${jobText}`,
    );
  },
};

let current: Ai = claudeAi;
export const getAi = () => current;
export const setAi = (ai: Ai) => {
  current = ai;
};
