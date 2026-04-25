import { Router, Request, Response } from "express";
import { z } from "zod";
import { buildScorePrompt } from "../lib/aiPrompt";
import { getMockScore } from "../lib/mockResults";
import { scoreResultSchema, selectedJobSchema } from "../lib/types";
import { config } from "../config";
import { completeOpenRouterUserJson } from "../lib/openRouterChat";
import { parseAiJsonContent } from "../lib/parseAiJson";
import { normalizeScorePayload } from "../lib/normalizeAiEnums";

const router = Router();

const requestSchema = z.object({
  profile: z.string().min(1),
  selectedJobs: z.array(selectedJobSchema).min(1).max(5),
});

function withMeta<T extends object>(payload: T, source: "ai" | "mock", reason?: string) {
  return {
    ...payload,
    _meta: {
      source,
      ...(reason ? { reason } : {}),
    },
  };
}

router.post("/api/score", async (req: Request, res: Response) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map((e) => e.message).join("; ") });
  }

  if (!config.openRouterApiKey) {
    return res.status(200).json(withMeta(getMockScore(), "mock", "missing_openrouter_key"));
  }

  try {
    const content = await completeOpenRouterUserJson(
      buildScorePrompt(parsed.data.profile, parsed.data.selectedJobs)
    );

    if (!content) {
      console.warn("[/api/score] OpenRouter returned no content - using mock");
      return res.status(200).json(withMeta(getMockScore(), "mock", "empty_ai_response"));
    }

    let aiResult: unknown;
    try {
      aiResult = parseAiJsonContent(content);
    } catch (e) {
      console.warn("[/api/score] JSON parse failed - using mock", e);
      return res.status(200).json(withMeta(getMockScore(), "mock", "json_parse_failed"));
    }

    const normalized = normalizeScorePayload(aiResult);
    const validated = scoreResultSchema.safeParse(normalized);
    if (!validated.success) {
      console.warn("[/api/score] Zod validation failed - using mock", validated.error.flatten());
      return res.status(200).json(withMeta(getMockScore(), "mock", "schema_validation_failed"));
    }

    return res.status(200).json(withMeta(validated.data, "ai"));
  } catch (e) {
    console.warn("[/api/score] unexpected error - using mock", e);
    return res.status(200).json(withMeta(getMockScore(), "mock", "unexpected_error"));
  }
});

export default router;
