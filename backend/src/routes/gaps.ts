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

function withMeta<T extends object>(payload: T, source: "ai" | "mock", reason?: string) {
  return {
    ...payload,
    _meta: {
      source,
      ...(reason ? { reason } : {}),
    },
  };
}

router.post("/api/gaps", async (req: Request, res: Response) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors.map((e) => e.message).join("; ") });
  }

  if (!config.openRouterApiKey) {
    return res.status(200).json(withMeta(getMockGaps(), "mock", "missing_openrouter_key"));
  }

  try {
    const content = await completeOpenRouterUserJson(
      buildGapsPrompt(parsed.data.profile, parsed.data.selectedJobs)
    );

    if (!content) {
      console.warn("[/api/gaps] OpenRouter returned no content - using mock");
      return res.status(200).json(withMeta(getMockGaps(), "mock", "empty_ai_response"));
    }

    let aiResult: unknown;
    try {
      aiResult = parseAiJsonContent(content);
    } catch (e) {
      console.warn("[/api/gaps] JSON parse failed - using mock", e);
      return res.status(200).json(withMeta(getMockGaps(), "mock", "json_parse_failed"));
    }

    const normalized = normalizeGapsPayload(aiResult);
    const validated = gapsResultSchema.safeParse(normalized);
    if (!validated.success) {
      console.warn("[/api/gaps] Zod validation failed - using mock", validated.error.flatten());
      return res.status(200).json(withMeta(getMockGaps(), "mock", "schema_validation_failed"));
    }

    return res.status(200).json(withMeta(validated.data, "ai"));
  } catch (e) {
    console.warn("[/api/gaps] unexpected error - using mock", e);
    return res.status(200).json(withMeta(getMockGaps(), "mock", "unexpected_error"));
  }
});

export default router;
