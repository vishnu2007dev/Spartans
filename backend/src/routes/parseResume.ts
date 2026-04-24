import { Router, Request, Response } from "express";
import multer from "multer";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse: (buf: Buffer) => Promise<{ text: string; numpages: number }> = require("pdf-parse");
import mammoth from "mammoth";
import { buildResumeParsePrompt } from "../lib/aiPrompt";
import { getMockParsedResume } from "../lib/mockResults";
import { parsedResumeSchema } from "../lib/types";
import { config } from "../config";

const router = Router();

// parse-and-discard: store file in memory only, never write to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const ok = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.mimetype)
      || file.originalname.endsWith(".pdf")
      || file.originalname.endsWith(".docx");
    cb(null, ok);
  },
});

async function extractText(file: Express.Multer.File): Promise<string> {
  const isPdf = file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf");
  if (isPdf) {
    const result = await pdfParse(file.buffer);
    return result.text;
  }
  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return result.value;
}

async function callOpenRouter(prompt: string): Promise<string | null> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openRouterApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content ?? null;
}

router.post("/api/parse-resume", upload.single("resume"), async (req: Request, res: Response) => {
  try {
    const linkedinUrl = typeof req.body?.linkedinUrl === "string" ? req.body.linkedinUrl : undefined;

    // No file uploaded — fall back to mock so frontend can still continue
    if (!req.file) {
      return res.status(200).json(getMockParsedResume());
    }

    // Extract raw text from PDF or DOCX
    let rawText: string;
    try {
      rawText = await extractText(req.file);
    } catch {
      return res.status(422).json({ error: "Could not read file. Try a different PDF or paste your text instead." });
    }

    if (!rawText.trim()) {
      return res.status(422).json({ error: "File appears to be empty or encrypted." });
    }

    // No API key — return structured mock with rawText attached
    if (!config.openRouterApiKey) {
      const mock = getMockParsedResume();
      return res.status(200).json({ ...mock, rawText });
    }

    // Ask GPT-4o-mini to extract structured fields
    const prompt = buildResumeParsePrompt(rawText, linkedinUrl);
    const content = await callOpenRouter(prompt);

    if (!content) {
      return res.status(200).json({ ...getMockParsedResume(), rawText });
    }

    let aiResult: unknown;
    try {
      // Strip markdown code fences if model wrapped the JSON
      const cleaned = content.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      aiResult = JSON.parse(cleaned);
    } catch {
      return res.status(200).json({ ...getMockParsedResume(), rawText });
    }

    const validated = parsedResumeSchema.safeParse(aiResult);
    if (!validated.success) {
      return res.status(200).json({ ...getMockParsedResume(), rawText });
    }

    return res.status(200).json({ ...validated.data, rawText });
  } catch (err) {
    console.error("/api/parse-resume error:", err);
    return res.status(500).json({ error: "Internal server error during resume parsing." });
  }
});

export default router;
