"use client";

import { createContext, useContext, useState } from "react";
import type { SelectedJob, AnalysisResult } from "./types";

interface AppContextValue {
  selectedJobs: SelectedJob[];
  setSelectedJobs: (jobs: SelectedJob[]) => void;
  result: AnalysisResult | null;
  setResult: (result: AnalysisResult | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [selectedJobs, setSelectedJobs] = useState<SelectedJob[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  return (
    <AppContext.Provider value={{ selectedJobs, setSelectedJobs, result, setResult }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
}
