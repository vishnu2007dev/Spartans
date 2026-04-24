import { Router, Request, Response } from "express";
import { validateRequest } from "../lib/validation";
import { buildScorePrompt } from "../lib/aiPrompt";
import { getMockScore } from "../lib/mockResults";
import { scoreResultSchema } from "../lib/types";
import { config } from "../config";

const router = Router();

// Temporary combined endpoint — replaced by /api/score, /api/gaps, /api/skill-focus, /api/learning-path in Phase 4
router.post("/api/analyze", async (req: Request, res: Response) => {
  const validation = validateRequest(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  const { profile, selectedJobs } = validation.data;
  const prompt = buildScorePrompt(profile, selectedJobs);
  const apiKey = config.openRouterApiKey;

  if (!apiKey) {
    return res.status(200).json(getMockScore());
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return res.status(200).json(getMockScore());
    }

    const responseData = await response.json() as any;
    const aiContent = responseData.choices?.[0]?.message?.content;

    if (!aiContent) return res.status(200).json(getMockScore());

    let aiResult: unknown;
    try {
      aiResult = JSON.parse(aiContent);
    } catch {
      return res.status(200).json(getMockScore());
    }

    const parsed = scoreResultSchema.safeParse(aiResult);
    if (!parsed.success) return res.status(200).json(getMockScore());

    return res.status(200).json(parsed.data);
  } catch {
    return res.status(200).json(getMockScore());
  }
});

export default router;
