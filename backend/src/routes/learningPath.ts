import { Router, Request, Response } from "express";
import { z } from "zod";
import { buildPlanPrompt } from "../lib/aiPrompt";
import { getMockPlan } from "../lib/mockResults";
import { planResultSchema, daysSchema, difficultySchema } from "../lib/types";
import { config } from "../config";

const router = Router();

const requestSchema = z.object({
  profile: z.string().min(1),
  chosenSkills: z.array(z.string()).min(1),
  days: daysSchema,
  difficulty: difficultySchema,
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

router.post("/api/learning-path", async (req: Request, res: Response) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map((e) => e.message).join("; ") });
  }

  if (!config.openRouterApiKey) return res.status(200).json(getMockPlan());

  try {
    const { profile, chosenSkills, days, difficulty } = parsed.data;
    const content = await callOpenRouter(buildPlanPrompt(profile, chosenSkills, days, difficulty));
    if (!content) return res.status(200).json(getMockPlan());

    let aiResult: unknown;
    try { aiResult = JSON.parse(content); } catch { return res.status(200).json(getMockPlan()); }

    const validated = planResultSchema.safeParse(aiResult);
    return res.status(200).json(validated.success ? validated.data : getMockPlan());
  } catch {
    return res.status(200).json(getMockPlan());
  }
});

export default router;
