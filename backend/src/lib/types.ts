import { z } from "zod";

// ── TypeScript Interfaces (duplicated from frontend/lib/types.ts) ──

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

export type Timeline = "2 weeks" | "4 weeks" | "8 weeks";

export interface AnalyzeRequest {
  profile: string;
  selectedJobs: SelectedJob[];
  timeline: Timeline;
}

export interface OpportunityCoverage {
  current: string;
  projected: string;
  explanation: string;
}

export interface PrioritySkill {
  skill: string;
  priority: "High" | "Medium" | "Low";
  appearsIn: string;
  reason: string;
  recommendedAction: string;
}

export interface RoadmapWeek {
  week: string;
  focus: string;
  tasks: string[];
  proofOfWork: string;
}

export interface Course {
  name: string;
  type: "Course" | "Certification" | "Practice Resource";
  reason: string;
}

export interface PortfolioProject {
  title: string;
  description: string;
  skillsDemonstrated: string[];
}

export interface AnalysisResult {
  currentReadiness: number;
  projectedReadiness: number;
  summary: string;
  opportunityCoverage: OpportunityCoverage;
  commonSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  prioritySkills: PrioritySkill[];
  learningRoadmap: RoadmapWeek[];
  recommendedCourses: Course[];
  portfolioProjects: PortfolioProject[];
  resumeSuggestions: string[];
  mentorStyleAdvice: string;
}

// ── Zod Schemas ──

export const selectedJobSchema = z.object({
  title: z.string().min(1),
  company: z.string(),
  description: z.string().min(1),
  requiredSkills: z.array(z.string()),
});

export const analyzeRequestSchema = z.object({
  profile: z.string().min(1),
  selectedJobs: z.array(selectedJobSchema).min(2).max(5),
  timeline: z.enum(["2 weeks", "4 weeks", "8 weeks"]),
});

export const analysisResultSchema = z.object({
  currentReadiness: z.number().min(0).max(100),
  projectedReadiness: z.number().min(0).max(100),
  summary: z.string(),
  opportunityCoverage: z.object({
    current: z.string(),
    projected: z.string(),
    explanation: z.string(),
  }),
  commonSkills: z.array(z.string()),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  prioritySkills: z.array(
    z.object({
      skill: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
      appearsIn: z.string(),
      reason: z.string(),
      recommendedAction: z.string(),
    })
  ),
  learningRoadmap: z.array(
    z.object({
      week: z.string(),
      focus: z.string(),
      tasks: z.array(z.string()),
      proofOfWork: z.string(),
    })
  ),
  recommendedCourses: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["Course", "Certification", "Practice Resource"]),
      reason: z.string(),
    })
  ),
  portfolioProjects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      skillsDemonstrated: z.array(z.string()),
    })
  ),
  resumeSuggestions: z.array(z.string()),
  mentorStyleAdvice: z.string(),
});
