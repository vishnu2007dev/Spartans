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
