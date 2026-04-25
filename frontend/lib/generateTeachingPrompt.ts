import type { Difficulty } from "./types";

export function generateTeachingPrompt(data: {
  taskTitle: string;
  taskDescription: string;
  skill: string;
  difficulty: Difficulty;
  targetRole: string;
  targetCompanies: string[];
  dayNumber: number;
  totalDays: number;
  userBackground: string;
}): string {
  try {
    const taskTitle = (data.taskTitle || "this topic").trim() || "this topic";
    const taskDescription =
      (data.taskDescription || "Learn the key concepts and practice them.").trim() ||
      "Learn the key concepts and practice them.";
    const skill = (data.skill || "this topic").trim() || "this topic";
    const difficulty: Difficulty = data.difficulty || "beginner";
    const targetRole = (data.targetRole || "Software Engineer").trim() || "Software Engineer";
    const companies = Array.isArray(data.targetCompanies) ? data.targetCompanies.filter(Boolean) : [];
    const companyClause =
      companies.length > 0
        ? ` at companies like ${companies.slice(0, 2).join(" and ")}`
        : "";
    const userBackground =
      (data.userBackground || "").trim() || "a self-taught developer";
    const dayNumber =
      Number.isFinite(data.dayNumber) && data.dayNumber > 0 ? Math.floor(data.dayNumber) : 1;
    const totalDays =
      Number.isFinite(data.totalDays) && data.totalDays > 0 ? Math.floor(data.totalDays) : 14;

    const assumed =
      difficulty === "beginner"
        ? "basic programming"
        : difficulty === "intermediate"
          ? "core CS fundamentals"
          : "advanced engineering concepts";

    const prompt = `You are an expert ${skill} instructor. I am a ${difficulty}-level developer
targeting ${targetRole} roles${companyClause}.

My background: ${userBackground}

Today is Day ${dayNumber} of my ${totalDays}-day structured learning plan.
Today's topic: ${taskTitle}
Goal: ${taskDescription}

Please teach me this topic using the following structure:

**1. Prerequisites Check (2 min)**
List the concepts I should already know before this lesson.
For each one I might be shaky on, give a one-line refresher.

**2. Core Concepts (10 min)**
Teach me ${taskTitle} from the ground up.
Use clear explanations, real-world analogies, and concrete examples.
Assume I understand ${assumed}.

**3. Hands-On Mini Project (15 min)**
Give me a small, self-contained project I can build in 15 minutes that demonstrates the core concept.
Include step-by-step instructions and the expected output.
Make it relevant to ${targetRole} work.

**4. Common Mistakes & Gotchas**
List the top 3 mistakes developers make with ${skill} and how to avoid them.
These should be mistakes that would actually come up in a ${targetRole} role.

**5. Interview Angle**
How is ${skill} likely to come up in interviews for ${targetRole} at top tech companies?
Give me 2 likely interview questions and strong answer frameworks.

**6. Quiz Me (5 min)**
Ask me 5 questions that test my understanding of what you just taught.
Mix conceptual and practical questions.
Wait for my answers before revealing the correct ones.

After I complete this lesson, I should be able to confidently discuss ${taskTitle} in a technical interview and apply it in a real project.`;

    // Keep it compact for any AI context.
    const words = prompt.split(/\s+/).filter(Boolean);
    if (words.length <= 600) return prompt;
    return words.slice(0, 600).join(" ");
  } catch {
    const taskTitle = (data?.taskTitle || "this topic").trim() || "this topic";
    const difficulty = data?.difficulty || "beginner";
    return `Teach me ${taskTitle} step by step. I am a ${difficulty} level developer. Include examples, a mini project, and quiz me at the end.`;
  }
}

