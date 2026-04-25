import { Router } from "express";
import type { z } from "zod";
import { config } from "../config";
import { completeOpenRouterUserJson } from "../lib/openRouterChat";
import { parseAiJsonContent } from "../lib/parseAiJson";
import {
  gradeVoiceRequestSchema,
  gradeVoiceResponseSchema,
  taskTestGenerateRequestSchema,
  taskTestGenerateResponseSchema,
  type TaskTestPayload,
} from "../lib/types";

const router = Router();

function mockTaskTest(body: {
  taskTitle: string;
  skill: string;
  taskDescription: string;
}): TaskTestPayload {
  const { taskTitle, skill } = body;
  return {
    taskTitle,
    skill,
    mcqQuestions: [
      {
        id: "mcq_1",
        question: `When learning ${skill}, why is "${taskTitle}" typically important before moving to advanced topics?`,
        options: [
          "It builds foundational mental models that later concepts depend on",
          "It is only needed for certification exams",
          "It can be skipped if you already know another language",
          "It matters only for frontend roles",
        ],
        correctIndex: 0,
        explanation:
          "Core concepts create the scaffolding for debugging, design tradeoffs, and interviews later.",
      },
      {
        id: "mcq_2",
        question: `Which situation best calls for revisiting "${taskTitle}" in a real project?`,
        options: [
          "When requirements change and your original approach no longer fits",
          "Never — once implemented it should be frozen",
          "Only during annual performance reviews",
          "Only when the codebase has zero tests",
        ],
        correctIndex: 0,
        explanation:
          "Learning sticks when you reconnect theory to changing constraints and failure modes.",
      },
      {
        id: "mcq_3",
        question: `What is a healthy way to validate you understood "${taskTitle}"?`,
        options: [
          "Explain tradeoffs to a peer and walk through a small example end-to-end",
          "Memorize glossary terms without using them",
          "Avoid writing code until you read everything",
          "Rely solely on multiple-choice practice",
        ],
        correctIndex: 0,
        explanation:
          "Teaching and tiny end-to-end exercises expose gaps that passive reading hides.",
      },
    ],
    voiceQuestions: [
      {
        id: "voice_1",
        type: "scenario",
        question: `You are tasked with "${taskTitle}" on a tight deadline, but a senior engineer disagrees with your approach. Walk through how you would align, de-risk, and ship.`,
        evaluationCriteria: [
          "Asks clarifying questions on constraints and success metrics",
          "Proposes a small experiment or spike to compare approaches",
          "Communicates risks and rollback plan",
          "Keeps stakeholders updated",
        ],
        sampleAnswer:
          "I would schedule a short sync to align on goals and non-negotiables, then propose a time-boxed spike comparing both approaches on the riskiest assumption. I'd document findings, pick the path with clearer failure signals, and communicate scope tradeoffs with a rollback plan.",
      },
      {
        id: "voice_2",
        type: "interview",
        question: `In 60 seconds, explain why "${taskTitle}" matters for ${skill} to a non-technical product manager.`,
        evaluationCriteria: [
          "Uses plain language and a concrete analogy",
          "Connects to user-visible outcomes or velocity",
          "Avoids unexplained jargon",
          "Stays within time box mentally",
        ],
        sampleAnswer:
          "It is like laying a solid foundation before adding floors: it prevents rework, speeds up future features, and reduces outages. For you, it means more predictable delivery and fewer fire drills.",
      },
    ],
  };
}

function mockGradeVoice(): {
  score: number;
  feedback: string;
  highlights: string[];
} {
  return {
    score: 4,
    feedback:
      "Clear structure and practical steps; could tighten one example for a top score.",
    highlights: ["Mentions de-risking", "Shows stakeholder awareness"],
  };
}

function buildGeneratePrompt(body: z.infer<typeof taskTestGenerateRequestSchema>): string {
  const { taskTitle, taskDescription, skill, difficulty, targetRole, dayNumber } = body;
  return `You are an expert technical interviewer generating a mixed test for a developer learning ${skill} at ${difficulty} level, targeting ${targetRole} roles.

Context — Day ${dayNumber}. Task: ${taskTitle}. Description: ${taskDescription}

Generate exactly:
- 3 MCQ questions testing core concepts of ${taskTitle}
- 2 voice/scenario questions (1 scenario, 1 interview-style)

MCQ rules:
- Each question has exactly 4 options
- One clearly correct answer
- Other options are plausible but wrong
- Include a brief explanation of why the correct answer is right
- Test understanding not memorization — ask about WHY and WHEN, not just WHAT

Voice question rules:
- Scenario question: real-world problem they must talk through
  e.g. "Your team's Docker container keeps crashing in production. Walk me through how you'd diagnose this."
- Interview question: classic but targeted to their role
  e.g. "Explain {concept} to a non-technical product manager in 60 seconds."
- evaluationCriteria: 3-4 bullet points of what a good answer covers
- sampleAnswer: a strong 3-4 sentence answer

Return ONLY valid JSON matching this exact schema:
{
  "taskTitle": string,
  "skill": string,
  "mcqQuestions": [
    {
      "id": "mcq_1" | "mcq_2" | "mcq_3",
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": number,
      "explanation": string
    }
  ],
  "voiceQuestions": [
    {
      "id": "voice_1" | "voice_2",
      "type": "scenario" | "interview",
      "question": string,
      "evaluationCriteria": string[],
      "sampleAnswer": string
    }
  ]
}`;
}

router.post("/generate", async (req, res) => {
  const parsed = taskTestGenerateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  }
  const body = parsed.data;

  if (!config.openRouterApiKey?.trim()) {
    return res.json(mockTaskTest(body));
  }

  const prompt = buildGeneratePrompt(body);
  const content = await completeOpenRouterUserJson(prompt);
  if (!content) {
    return res.json(mockTaskTest(body));
  }

  let unknown: unknown;
  try {
    unknown = parseAiJsonContent(content);
  } catch {
    return res.json(mockTaskTest(body));
  }

  const validated = taskTestGenerateResponseSchema.safeParse(unknown);
  if (!validated.success) {
    return res.json(mockTaskTest(body));
  }

  const out: TaskTestPayload = {
    taskTitle: validated.data.taskTitle,
    skill: validated.data.skill,
    mcqQuestions: validated.data.mcqQuestions,
    voiceQuestions: validated.data.voiceQuestions,
  };
  return res.json(out);
});

router.post("/grade-voice", async (req, res) => {
  const parsed = gradeVoiceRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  }
  const { question, evaluationCriteria, userAnswer, skill, difficulty } = parsed.data;

  if (!config.openRouterApiKey?.trim()) {
    return res.json(mockGradeVoice());
  }

  const prompt = `You are a strict but fair technical interviewer grading a spoken answer.

Question: ${question}
Evaluation criteria: ${JSON.stringify(evaluationCriteria)}
Candidate's answer: ${userAnswer}
Skill context: ${skill}
Difficulty: ${difficulty}

Grade on a scale of 1-5:
1 - Completely off track or no meaningful content
2 - Shows awareness but missing key concepts  
3 - Covers the basics adequately
4 - Strong answer with good depth
5 - Exceptional — would impress in a real interview

Return ONLY valid JSON:
{
  "score": number,
  "feedback": string,
  "highlights": string[]
}`;

  const content = await completeOpenRouterUserJson(prompt);
  if (!content) {
    return res.json(mockGradeVoice());
  }

  let unknown: unknown;
  try {
    unknown = parseAiJsonContent(content);
  } catch {
    return res.json(mockGradeVoice());
  }

  const validated = gradeVoiceResponseSchema.safeParse(unknown);
  if (!validated.success) {
    return res.json(mockGradeVoice());
  }

  let { score, feedback, highlights } = validated.data;
  if (score < 2) highlights = [];

  return res.json({ score, feedback, highlights });
});

export default router;
