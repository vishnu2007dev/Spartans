"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type {
  SelectedJob,
  ParsedResume,
  ScoreResult,
  GapsResult,
  FocusResult,
  PlanResult,
  PlanProgress,
  Days,
  Difficulty,
} from "./types";

const PROGRESS_KEY = "unlockd:progress";

interface AppContextValue {
  // Step 1 — resume
  parsedResume: ParsedResume | null;
  setParsedResume: (r: ParsedResume | null) => void;
  profileText: string;
  setProfileText: (t: string) => void;

  // Step 2 — jobs
  selectedJobs: SelectedJob[];
  setSelectedJobs: (jobs: SelectedJob[]) => void;

  // Step 3 — score
  score: ScoreResult | null;
  setScore: (s: ScoreResult | null) => void;

  // Step 4 — gaps
  gaps: GapsResult | null;
  setGaps: (g: GapsResult | null) => void;

  // Step 5 — focus
  focusResult: FocusResult | null;
  setFocusResult: (f: FocusResult | null) => void;
  chosenSkills: string[];
  setChosenSkills: (skills: string[]) => void;

  // Step 6 — plan
  days: Days;
  setDays: (d: Days) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  plan: PlanResult | null;
  setPlan: (p: PlanResult | null) => void;

  planProgress: PlanProgress;
  setPlanProgress: React.Dispatch<React.SetStateAction<PlanProgress>>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [profileText, setProfileText] = useState("");
  const [selectedJobs, setSelectedJobs] = useState<SelectedJob[]>([]);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [gaps, setGaps] = useState<GapsResult | null>(null);
  const [focusResult, setFocusResult] = useState<FocusResult | null>(null);
  const [chosenSkills, setChosenSkills] = useState<string[]>([]);
  const [days, setDays] = useState<Days>(14);
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [planProgress, setPlanProgress] = useState<PlanProgress>({});

  const skipSaveRef = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PlanProgress;
        if (parsed && typeof parsed === "object") setPlanProgress(parsed);
      }
    } catch {
      /* ignore */
    }
    skipSaveRef.current = false;
  }, []);

  useEffect(() => {
    if (skipSaveRef.current) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(planProgress));
    } catch {
      /* ignore */
    }
  }, [planProgress]);

  return (
    <AppContext.Provider
      value={{
        parsedResume,
        setParsedResume,
        profileText,
        setProfileText,
        selectedJobs,
        setSelectedJobs,
        score,
        setScore,
        gaps,
        setGaps,
        focusResult,
        setFocusResult,
        chosenSkills,
        setChosenSkills,
        days,
        setDays,
        difficulty,
        setDifficulty,
        plan,
        setPlan,
        planProgress,
        setPlanProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
}
