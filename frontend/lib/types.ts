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

export interface ParsedResume {
  skills: string[];
  experience: string[];
  education: string[];
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

// ── Plan task tests (Test Me) ─────────────────────────────────────────────────

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VoiceQuestion {
  id: string;
  type: "scenario" | "interview";
  question: string;
  evaluationCriteria: string[];
  sampleAnswer: string;
}

export interface TaskTestPayload {
  taskTitle: string;
  skill: string;
  mcqQuestions: MCQQuestion[];
  voiceQuestions: VoiceQuestion[];
}

export interface TaskTest extends TaskTestPayload {
  taskId: string;
}

export interface TaskTestResultVoiceScore {
  questionId: string;
  score: number;
  feedback: string;
}

export interface TaskTestResult {
  taskId: string;
  taskTitle: string;
  skill: string;
  mcqScore: number;
  voiceScores: TaskTestResultVoiceScore[];
  overallScore: number;
  passed: boolean;
  completedAt: number;
}

export type PlanProgress = Record<string, TaskTestResult>;
