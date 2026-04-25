import type { TaskTestPayload } from "./types";

/** Backend URL — must match Express (default 3001). Override if backend uses another PORT. */
export const API_BASE =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_API_BASE?.trim()) ||
  "http://localhost:3001";

export async function generateTaskTest(payload: {
  taskTitle: string;
  taskDescription: string;
  skill: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  targetRole: string;
  dayNumber: number;
}): Promise<TaskTestPayload> {
  const res = await fetch(`${API_BASE}/api/test/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err?.error === "string" ? err.error : "Test generation failed");
  }
  return res.json();
}

export async function gradeVoiceAnswer(payload: {
  question: string;
  evaluationCriteria: string[];
  userAnswer: string;
  skill: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}): Promise<{ score: number; feedback: string; highlights: string[] }> {
  const res = await fetch(`${API_BASE}/api/test/grade-voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Voice grading failed");
  }
  return res.json();
}
