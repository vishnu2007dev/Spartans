import { Router, Request, Response } from "express";
import { z } from "zod";
import { buildGapsPrompt } from "../lib/aiPrompt";
import { getMockGaps } from "../lib/mockResults";
import { gapsResultSchema, selectedJobSchema } from "../lib/types";
import { config } from "../config";
import { callOpenRouter, cleanJson } from "../lib/aiClient";

const router = Router();

const requestSchema = z.object({
  profile: z.string().min(1),
  selectedJobs: z.array(selectedJobSchema).min(1).max(5),
});

router.post("/api/gaps", async (req: Request, res: Response) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map((e) => e.message).join("; ") });
  }

  if (!config.openRouterApiKey) return res.status(200).json(getMockGaps());

  try {
    const rawContent = await callOpenRouter(buildGapsPrompt(parsed.data.profile, parsed.data.selectedJobs));
    if (!rawContent) return res.status(200).json(getMockGaps());

    const content = cleanJson(rawContent);
    let aiResult: unknown;
    try { 
      aiResult = JSON.parse(content); 
    } catch (e) { 
      console.error("Gaps JSON parse failed:", content);
      return res.status(200).json(getMockGaps()); 
    }

    const validated = gapsResultSchema.safeParse(aiResult);
    if (!validated.success) {
      console.error("Gaps Zod validation failed:", validated.error.errors);
      return res.status(200).json(getMockGaps());
    }
    return res.status(200).json(validated.data);
  } catch (err) {
    console.error("Gaps route error:", err);
    return res.status(200).json(getMockGaps());
  }
});

export default router;
