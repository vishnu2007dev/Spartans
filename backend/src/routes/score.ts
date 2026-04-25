import { Router, Request, Response } from "express";
import { z } from "zod";
import { buildScorePrompt } from "../lib/aiPrompt";
import { getMockScore } from "../lib/mockResults";
import { scoreResultSchema, selectedJobSchema } from "../lib/types";
import { config } from "../config";
import { callOpenRouter, cleanJson } from "../lib/aiClient";

const router = Router();

const requestSchema = z.object({
  profile: z.string().min(1),
  selectedJobs: z.array(selectedJobSchema).min(1).max(5),
});

router.post("/api/score", async (req: Request, res: Response) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map((e) => e.message).join("; ") });
  }

  if (!config.openRouterApiKey) return res.status(200).json(getMockScore());

  try {
    const rawContent = await callOpenRouter(buildScorePrompt(parsed.data.profile, parsed.data.selectedJobs));
    if (!rawContent) return res.status(200).json(getMockScore());

    const content = cleanJson(rawContent);
    let aiResult: unknown;
    try { 
      aiResult = JSON.parse(content); 
    } catch (e) { 
      console.error("JSON parse failed for content:", content);
      return res.status(200).json(getMockScore()); 
    }

    const validated = scoreResultSchema.safeParse(aiResult);
    if (!validated.success) {
      console.error("Score Zod validation failed:", validated.error.errors);
      return res.status(200).json(getMockScore());
    }
    return res.status(200).json(validated.data);
  } catch (err) {
    console.error("Score route error:", err);
    return res.status(200).json(getMockScore());
  }
});

export default router;
