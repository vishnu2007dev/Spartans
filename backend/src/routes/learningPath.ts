import { Router, Request, Response } from "express";
import { z } from "zod";
import { buildPlanPrompt } from "../lib/aiPrompt";
import { getMockPlan } from "../lib/mockResults";
import { planResultSchema, daysSchema, difficultySchema } from "../lib/types";
import { config } from "../config";
import { completeOpenRouterUserJson } from "../lib/openRouterChat";
import { parseAiJsonContent } from "../lib/parseAiJson";
import { normalizePlanPayload } from "../lib/normalizeAiEnums";

const router = Router();

const requestSchema = z.object({
  profile: z.string().min(1),
  chosenSkills: z.array(z.string()).min(1),
  days: daysSchema,
  difficulty: difficultySchema,
});

router.post("/api/learning-path", async (req: Request, res: Response) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map((e) => e.message).join("; ") });
  }

  if (!config.openRouterApiKey) return res.status(200).json(getMockPlan());

  try {
    const { profile, chosenSkills, days, difficulty } = parsed.data;
    const content = await completeOpenRouterUserJson(
      buildPlanPrompt(profile, chosenSkills, days, difficulty)
    );
    if (!content) {
      console.warn("[/api/learning-path] OpenRouter returned no content — using mock");
      return res.status(200).json(getMockPlan());
    }

    let aiResult: unknown;
    try {
      aiResult = parseAiJsonContent(content);
    } catch (e) {
      console.warn("[/api/learning-path] JSON parse failed — using mock", e);
      return res.status(200).json(getMockPlan());
    }

    const normalized = normalizePlanPayload(aiResult);
    const validated = planResultSchema.safeParse(normalized);
    if (!validated.success) {
      console.warn("[/api/learning-path] Zod validation failed — using mock", validated.error.flatten());
      return res.status(200).json(getMockPlan());
    }
    return res.status(200).json(validated.data);
  } catch (e) {
    console.warn("[/api/learning-path] unexpected error — using mock", e);
    return res.status(200).json(getMockPlan());
  }
});

export default router;
