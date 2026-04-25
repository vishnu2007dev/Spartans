import { Router, Request, Response } from "express";
import { z } from "zod";
import { buildFocusPrompt } from "../lib/aiPrompt";
import { getMockFocus } from "../lib/mockResults";
import { focusResultSchema, selectedJobSchema, gapSchema } from "../lib/types";
import { config } from "../config";
import { completeOpenRouterUserJson } from "../lib/openRouterChat";
import { parseAiJsonContent } from "../lib/parseAiJson";
import { normalizeFocusPayload } from "../lib/normalizeAiEnums";

const router = Router();

const requestSchema = z.object({
  gaps: z.array(gapSchema).min(1),
  selectedJobs: z.array(selectedJobSchema).min(1).max(5),
});

router.post("/api/skill-focus", async (req: Request, res: Response) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map((e) => e.message).join("; ") });
  }

  if (!config.openRouterApiKey) return res.status(200).json(getMockFocus());

  try {
    const content = await completeOpenRouterUserJson(
      buildFocusPrompt(parsed.data.gaps, parsed.data.selectedJobs)
    );
    if (!content) {
      console.warn("[/api/skill-focus] OpenRouter returned no content — using mock");
      return res.status(200).json(getMockFocus());
    }

    let aiResult: unknown;
    try {
      aiResult = parseAiJsonContent(content);
    } catch (e) {
      console.warn("[/api/skill-focus] JSON parse failed — using mock", e);
      return res.status(200).json(getMockFocus());
    }

    const normalized = normalizeFocusPayload(aiResult);
    const validated = focusResultSchema.safeParse(normalized);
    if (!validated.success) {
      console.warn("[/api/skill-focus] Zod validation failed — using mock", validated.error.flatten());
      return res.status(200).json(getMockFocus());
    }
    return res.status(200).json(validated.data);
  } catch (e) {
    console.warn("[/api/skill-focus] unexpected error — using mock", e);
    return res.status(200).json(getMockFocus());
  }
});

export default router;
