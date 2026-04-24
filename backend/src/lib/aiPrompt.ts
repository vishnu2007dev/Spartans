import { SelectedJob, Timeline, AnalysisResult } from "./types";

/**
 * Builds the AI prompt for career analysis.
 * 
 * This function constructs a comprehensive prompt that:
 * - Provides the user's profile and selected job opportunities
 * - Includes education guardrail instructions (honest upskilling, actionable recommendations)
 * - Requests structured JSON output matching the AnalysisResult schema
 * - Emphasizes tangible proof-of-work items in the roadmap
 * - Requires simple, student-friendly language
 * 
 * @param profile - The user's current background (resume, skills summary, or LinkedIn text)
 * @param selectedJobs - Array of 2-5 jobs the user is targeting
 * @param timeline - The preparation timeline (2, 4, or 8 weeks)
 * @returns A formatted prompt string for the AI API
 */
export function buildPrompt(
  profile: string,
  selectedJobs: SelectedJob[],
  timeline: Timeline
): string {
  const jobsSection = selectedJobs
    .map(
      (job, index) =>
        `Job ${index + 1}: ${job.title} at ${job.company}
Description: ${job.description}
Required Skills: ${job.requiredSkills.join(", ")}`
    )
    .join("\n\n");

  return `You are a career mentor helping a student prepare for multiple job opportunities. Your role is to guide them toward strategic learning and skill development.

# EDUCATION GUARDRAILS (CRITICAL)

1. **Focus on honest upskilling**: Analyze the user's current skills truthfully. Do NOT exaggerate their experience or suggest they claim skills they don't have. Guide them toward genuine learning.

2. **Make recommendations actionable**: Every recommendation must be something the user can DO. Avoid vague advice like "improve communication skills" — instead, provide specific actions like "Practice explaining technical concepts by writing 3 blog posts about projects you've built."

3. **Require tangible proof of work**: Each week in the learning roadmap MUST include a "proofOfWork" item that produces concrete evidence of learning. Examples:
   - "Build a working calculator app and deploy it to GitHub Pages"
   - "Complete 10 LeetCode problems and document your solutions"
   - "Create a data visualization dashboard using real public datasets"
   - "Write a technical blog post explaining a concept you learned"
   NOT acceptable: "Study React", "Read about SQL", "Watch tutorials"

4. **Use simple, student-friendly language**: Write for someone early in their career. Avoid jargon unless you explain it. Be encouraging but realistic.

# USER CONTEXT

## User Profile
${profile}

## Target Opportunities (${selectedJobs.length} jobs selected)
${jobsSection}

## Timeline
${timeline}

# YOUR TASK

Analyze the gap between the user's current profile and the combined requirements across all ${selectedJobs.length} selected jobs. Produce a structured career preparation plan.

# OUTPUT FORMAT

You MUST respond with valid JSON matching this exact structure:

{
  "currentReadiness": <number 0-100>,
  "projectedReadiness": <number 0-100>,
  "summary": "<2-3 sentence overview of the user's current position and growth potential>",
  "opportunityCoverage": {
    "current": "<e.g., '1 out of ${selectedJobs.length} roles'>",
    "projected": "<e.g., '${selectedJobs.length} out of ${selectedJobs.length} roles'>",
    "explanation": "<1-2 sentences explaining the coverage change>"
  },
  "commonSkills": ["<skills appearing in multiple job descriptions>"],
  "matchedSkills": ["<skills the user already has>"],
  "missingSkills": ["<skills the user lacks>"],
  "prioritySkills": [
    {
      "skill": "<skill name>",
      "priority": "High" | "Medium" | "Low",
      "appearsIn": "<e.g., '3 out of ${selectedJobs.length} jobs'>",
      "reason": "<why this skill is prioritized>",
      "recommendedAction": "<specific, actionable first step to learn this skill>"
    }
  ],
  "learningRoadmap": [
    {
      "week": "Week 1" | "Week 2" | etc.,
      "focus": "<primary skill or area for this week>",
      "tasks": ["<specific task 1>", "<specific task 2>", "<specific task 3>"],
      "proofOfWork": "<tangible deliverable that proves learning — must be concrete and verifiable>"
    }
  ],
  "recommendedCourses": [
    {
      "name": "<course or certification name>",
      "type": "Course" | "Certification" | "Practice Resource",
      "reason": "<why this resource is recommended for the user's goals>"
    }
  ],
  "portfolioProjects": [
    {
      "title": "<project name>",
      "description": "<what the user should build and why>",
      "skillsDemonstrated": ["<skill 1>", "<skill 2>"]
    }
  ],
  "resumeSuggestions": [
    "<actionable suggestion 1>",
    "<actionable suggestion 2>",
    "<actionable suggestion 3>"
  ],
  "mentorStyleAdvice": "<2-3 paragraphs of personalized, encouraging advice about the user's career preparation journey. Be honest about challenges but emphasize growth potential.>"
}

# IMPORTANT REQUIREMENTS

1. The learningRoadmap MUST contain exactly ${getWeekCount(timeline)} weeks (matching the ${timeline} timeline).

2. Each week's "proofOfWork" MUST be a tangible, verifiable deliverable (code, writing, project, portfolio piece) — NOT passive activities like "study" or "watch tutorials".

3. prioritySkills should focus on the highest-impact missing skills (typically 3-5 skills).

4. Portfolio projects should be realistic for the timeline and directly relevant to the target roles.

5. Resume suggestions should be specific and actionable, not generic advice.

6. All text fields should use simple, encouraging, student-friendly language.

7. Be honest about the user's current readiness — don't inflate scores to make them feel good.

8. Ensure all JSON is valid and matches the schema exactly.

Respond ONLY with the JSON object. Do not include any other text before or after the JSON.`;
}

/**
 * Helper function to determine the number of weeks based on timeline.
 */
function getWeekCount(timeline: Timeline): number {
  switch (timeline) {
    case "2 weeks":
      return 2;
    case "4 weeks":
      return 4;
    case "8 weeks":
      return 8;
  }
}
