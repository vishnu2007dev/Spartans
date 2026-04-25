import { SelectedJob } from "./types";

// Shared guardrails injected into every AI prompt
export const GUARDRAILS = `
# EDUCATION GUARDRAILS (CRITICAL)
1. Analyze the user's current skills truthfully. Do NOT exaggerate their experience.
2. Every recommendation must be something the user can DO. Avoid vague advice.
3. Each roadmap item MUST include a "proofOfWork" that produces concrete evidence of learning.
4. Use simple, student-friendly language. Be encouraging but realistic.
`.trim();

// ── Per-step prompt builders ─────────────────────────────────────────────────
// Full implementations added in Phase 4 when each endpoint is built.

export function buildResumeParsePrompt(rawText: string, linkedinUrl?: string): string {
  return `${GUARDRAILS}

Extract structured information from the resume text below.
${linkedinUrl ? `LinkedIn URL (for additional context): ${linkedinUrl}` : ""}

Resume text:
${rawText}

Respond ONLY with valid JSON:
{
  "skills": ["<skill>"],
  "experience": [
    {
      "company": "<company name>",
      "title": "<job title>",
      "dates": "<start and end dates>",
      "highlights": ["<key achievement or responsibility>"]
    }
  ],
  "education": [
    {
      "institution": "<school name>",
      "degree": "<degree or major>",
      "year": "<graduation year or dates>"
    }
  ],
  "rawText": "<full text as-is>"
}`;
}

export function buildJobParsePrompt(input: string): string {
  return `${GUARDRAILS}

Parse the following job description or URL content into a structured job object.

Input:
${input}

Respond ONLY with valid JSON:
{
  "title": "<job title>",
  "company": "<company name or Unknown>",
  "description": "<full job description>",
  "requiredSkills": ["<skill>"]
}`;
}

export function buildScorePrompt(profile: string, selectedJobs: SelectedJob[]): string {
  const jobsSection = selectedJobs
    .map((j, i) => `Job ${i + 1}: ${j.title} at ${j.company}\nRequired Skills: ${j.requiredSkills.join(", ")}\nDescription: ${j.description}`)
    .join("\n\n");

  return `${GUARDRAILS}

Compare the user profile against the selected jobs and produce a readiness score, detailed pros and cons, and a skill radar breakdown.

## User Profile
${profile}

## Target Jobs (${selectedJobs.length})
${jobsSection}

Respond ONLY with valid JSON:
{
  "overallScore": <0-100>,
  "projectedScore": <0-100>,
  "matchedSkills": ["<skills user already has>"],
  "missingSkills": ["<skills user lacks>"],
  "pros": ["<3-5 bullet points of the user's strengths relative to the jobs>"],
  "cons": ["<3-5 bullet points of the user's weaknesses or missing requirements>"],
  "skillRadar": [
    { "category": "Technical Skills", "score": <0-100> },
    { "category": "Tools & Frameworks", "score": <0-100> },
    { "category": "Experience Match", "score": <0-100> },
    { "category": "Soft Skills", "score": <0-100> },
    { "category": "Domain Relevance", "score": <0-100> }
  ],
  "perJob": [
    {
      "title": "<job title>",
      "company": "<company>",
      "score": <0-100>,
      "matchedCount": <number>,
      "totalRequired": <number>
    }
  ],
  "summary": "<2-3 sentences on where the user stands>"
}`;
}

export function buildGapsPrompt(profile: string, selectedJobs: SelectedJob[]): string {
  const jobsSection = selectedJobs
    .map((j, i) => `Job ${i + 1}: ${j.title} at ${j.company}\nRequired: ${j.requiredSkills.join(", ")}`)
    .join("\n\n");

  return `${GUARDRAILS}

Identify skill gaps between the user profile and the selected jobs. Tag each gap by category and importance.

## User Profile
${profile}

## Target Jobs
${jobsSection}

Respond ONLY with valid JSON:
{
  "gaps": [
    {
      "item": "<missing skill, cert, experience, or tool>",
      "category": "skill" | "cert" | "experience" | "tooling",
      "importance": "critical" | "nice-to-have",
      "appearsIn": "<e.g. 3 of ${selectedJobs.length} jobs>",
      "reason": "<why this matters>"
    }
  ],
  "summary": "<1-2 sentences on the biggest gaps>"
}`;
}

export function buildFocusPrompt(gaps: object[], selectedJobs: SelectedJob[]): string {
  return `${GUARDRAILS}

Cluster the following skill gaps across ${selectedJobs.length} jobs and surface the top recurring skills for the user to focus on.

Gaps:
${JSON.stringify(gaps, null, 2)}

Respond ONLY with valid JSON:
{
  "clusteredSkills": [
    {
      "skill": "<skill name>",
      "appearsIn": "<e.g. 4 of ${selectedJobs.length} jobs>",
      "rationale": "<why this skill has the highest leverage>",
      "category": "skill" | "cert" | "experience" | "tooling"
    }
  ]
}`;
}

export function buildPlanPrompt(
  profile: string,
  chosenSkills: string[],
  days: number,
  difficulty: string
): string {
  return `${GUARDRAILS}

Create a ${days}-day, ${difficulty}-level learning plan for the user to acquire the following skills: ${chosenSkills.join(", ")}.

## User Profile
${profile}

## Plan requirements
- Exactly ${days} day entries (day 1 through day ${days}).
- Difficulty: ${difficulty} — ${difficulty === "beginner" ? "foundational concepts, short tasks" : difficulty === "intermediate" ? "hands-on projects, moderate depth" : "advanced depth, production-quality output"}.
- Each day must have a concrete proofOfWork (code, writing, project — NOT "study" or "watch").
- Resources must include real, publicly accessible URLs.

Respond ONLY with valid JSON:
{
  "days": ${days},
  "difficulty": "${difficulty}",
  "projectedReadinessGain": <number 0-100>,
  "plan": [
    {
      "day": <number>,
      "topic": "<primary focus>",
      "tasks": ["<specific task>"],
      "resources": [
        {
          "title": "<resource name>",
          "url": "<url>",
          "type": "video" | "article" | "course" | "practice" | "project",
          "estimatedMinutes": <number>
        }
      ],
      "proofOfWork": "<tangible deliverable>"
    }
  ]
}`;
}
