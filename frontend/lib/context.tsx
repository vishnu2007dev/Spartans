"use client";

import { createContext, useContext, useState } from "react";
import type {
  SelectedJob,
  ParsedResume,
  ScoreResult,
  GapsResult,
  FocusResult,
  PlanResult,
  Days,
  Difficulty,
} from "./types";

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
