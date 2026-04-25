import { z } from "zod";

// ── Primitives ──────────────────────────────────────────────────────────────

export type Days = 7 | 14 | 28;
export type Difficulty = "beginner" | "intermediate" | "advanced";

// ── Shared job types ─────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  category: string;
}

export interface SelectedJob {
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
}

// ── Step 1 — Resume parsing ──────────────────────────────────────────────────

export interface ParsedExperience {
  company: string;
  title: string;
  dates: string;
  highlights: string[];
}

export interface ParsedEducation {
  institution: string;
  degree: string;
  year: string;
}

export interface ParsedResume {
  skills: string[];
  experience: ParsedExperience[];
  education: ParsedEducation[];
  rawText: string;
}

// ── Step 2 — Job input ───────────────────────────────────────────────────────

export interface AnalyzeRequest {
  profile: string;
  selectedJobs: SelectedJob[];
}

// ── Step 3 — Score ───────────────────────────────────────────────────────────

export interface PerJobScore {
  title: string;
  company: string;
  score: number;
  matchedCount: number;
  totalRequired: number;
}

export interface ScoreResult {
  overallScore: number;
  projectedScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  perJob: PerJobScore[];
  pros: string[];
  cons: string[];
  skillRadar: { category: string; score: number }[];
  summary: string;
}

// ── Step 4 — Gaps ────────────────────────────────────────────────────────────

export type GapCategory = "skill" | "cert" | "experience" | "tooling";
export type GapImportance = "critical" | "nice-to-have";

export interface Gap {
  item: string;
  category: GapCategory;
  importance: GapImportance;
  appearsIn: string;
  reason: string;
}

export interface GapsResult {
  gaps: Gap[];
  summary: string;
}

// ── Step 5 — Skill focus ─────────────────────────────────────────────────────

export interface ClusteredSkill {
  skill: string;
  appearsIn: string;
  rationale: string;
  category: GapCategory;
}

export interface FocusResult {
  clusteredSkills: ClusteredSkill[];
}

// ── Step 6 — Learning path ───────────────────────────────────────────────────

export interface LearningResource {
  title: string;
  url: string;
  type: "video" | "article" | "course" | "practice" | "project";
  estimatedMinutes: number;
}

export interface LearningDay {
  day: number;
  topic: string;
  tasks: string[];
  resources: LearningResource[];
  proofOfWork: string;
}

export interface PlanResult {
  days: number;
  difficulty: Difficulty;
  plan: LearningDay[];
  projectedReadinessGain: number;
}

// ── Zod Schemas ──────────────────────────────────────────────────────────────

export const selectedJobSchema = z.object({
  title: z.string().min(1),
  company: z.string(),
  description: z.string().min(1),
  requiredSkills: z.array(z.string()),
});

export const analyzeRequestSchema = z.object({
  profile: z.string().min(1),
  selectedJobs: z.array(selectedJobSchema).min(1).max(5),
});

export const parsedExperienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  dates: z.string(),
  highlights: z.array(z.string()),
});

export const parsedEducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  year: z.string(),
});

export const parsedResumeSchema = z.object({
  skills: z.array(z.string()),
  experience: z.array(parsedExperienceSchema),
  education: z.array(parsedEducationSchema),
  rawText: z.string(),
});

export const perJobScoreSchema = z.object({
  title: z.string(),
  company: z.string(),
  score: z.number().min(0).max(100),
  matchedCount: z.number(),
  totalRequired: z.number(),
});

export const scoreResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  projectedScore: z.number().min(0).max(100),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  perJob: z.array(perJobScoreSchema),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  skillRadar: z.array(z.object({
    category: z.string(),
    score: z.number().min(0).max(100),
  })),
  summary: z.string(),
});

export const gapSchema = z.object({
  item: z.string(),
  category: z.enum(["skill", "cert", "experience", "tooling"]),
  importance: z.enum(["critical", "nice-to-have"]),
  appearsIn: z.string(),
  reason: z.string(),
});

export const gapsResultSchema = z.object({
  gaps: z.array(gapSchema),
  summary: z.string(),
});

export const clusteredSkillSchema = z.object({
  skill: z.string(),
  appearsIn: z.string(),
  rationale: z.string(),
  category: z.enum(["skill", "cert", "experience", "tooling"]),
});

export const focusResultSchema = z.object({
  clusteredSkills: z.array(clusteredSkillSchema),
});

export const learningResourceSchema = z.object({
  title: z.string(),
  url: z.string(),
  type: z.enum(["video", "article", "course", "practice", "project"]),
  estimatedMinutes: z.number(),
});

export const learningDaySchema = z.object({
  day: z.number(),
  topic: z.string(),
  tasks: z.array(z.string()),
  resources: z.array(learningResourceSchema),
  proofOfWork: z.string(),
});

export const planResultSchema = z.object({
  days: z.number(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  plan: z.array(learningDaySchema),
  projectedReadinessGain: z.number(),
});

export const daysSchema = z.union([z.literal(7), z.literal(14), z.literal(28)]);
export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
