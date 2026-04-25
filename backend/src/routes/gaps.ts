import { Router, Request, Response } from "express";
import { z } from "zod";
import { buildGapsPrompt } from "../lib/aiPrompt";
import { getMockGaps } from "../lib/mockResults";
import { gapsResultSchema, selectedJobSchema } from "../lib/types";
import { config } from "../config";
import { completeOpenRouterUserJson } from "../lib/openRouterChat";
import { parseAiJsonContent } from "../lib/parseAiJson";
import { normalizeGapsPayload } from "../lib/normalizeAiEnums";

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
    const content = await completeOpenRouterUserJson(
      buildGapsPrompt(parsed.data.profile, parsed.data.selectedJobs)
    );
    if (!content) {
      console.warn("[/api/gaps] OpenRouter returned no content — using mock");
      return res.status(200).json(getMockGaps());
    }

    let aiResult: unknown;
    try {
      aiResult = parseAiJsonContent(content);
    } catch (e) {
      console.warn("[/api/gaps] JSON parse failed — using mock", e);
      return res.status(200).json(getMockGaps());
    }

    const normalized = normalizeGapsPayload(aiResult);
    const validated = gapsResultSchema.safeParse(normalized);
    if (!validated.success) {
      console.warn("[/api/gaps] Zod validation failed — using mock", validated.error.flatten());
      return res.status(200).json(getMockGaps());
    }
    return res.status(200).json(validated.data);
  } catch (e) {
    console.warn("[/api/gaps] unexpected error — using mock", e);
    return res.status(200).json(getMockGaps());
  }
});

export default router;
