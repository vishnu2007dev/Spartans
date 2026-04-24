import { Router, Request, Response } from "express";
import { z } from "zod";
import { buildScorePrompt } from "../lib/aiPrompt";
import { getMockScore } from "../lib/mockResults";
import { scoreResultSchema, selectedJobSchema } from "../lib/types";
import { config } from "../config";

const router = Router();

const requestSchema = z.object({
  profile: z.string().min(1),
  selectedJobs: z.array(selectedJobSchema).min(1).max(5),
});

async function callOpenRouter(prompt: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.openRouterApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "openai/gpt-4o-mini", messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) return null;
  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content ?? null;
}

router.post("/api/score", async (req: Request, res: Response) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map((e) => e.message).join("; ") });
  }

  if (!config.openRouterApiKey) return res.status(200).json(getMockScore());

  try {
    const content = await callOpenRouter(buildScorePrompt(parsed.data.profile, parsed.data.selectedJobs));
    if (!content) return res.status(200).json(getMockScore());

    let aiResult: unknown;
    try { aiResult = JSON.parse(content); } catch { return res.status(200).json(getMockScore()); }

    const validated = scoreResultSchema.safeParse(aiResult);
    return res.status(200).json(validated.success ? validated.data : getMockScore());
  } catch {
    return res.status(200).json(getMockScore());
  }
});

export default router;
