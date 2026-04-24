"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/context";
import { Nav } from "@/components/landing/Nav";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { mockAnalysisResult } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  const { result, setResult } = useAppContext();

  // Show mock data loader if no result — no redirect, just a button
  if (!result) {
    return (
      <div
        style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          No analysis result yet.
        </p>
        <Button
          variant="outline"
          onClick={() => setResult(mockAnalysisResult)}
        >
          Preview with mock data
        </Button>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 pb-24">
        {/* Page header */}
        <div className="py-12 flex flex-col gap-2">
          <span
            className="uppercase tracking-widest"
            style={{
              color: "var(--text-dim)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
            }}
          >
            Step 3 of 3
          </span>
          <h1
            className="font-bold tracking-tight"
            style={{
              color: "var(--heading)",
              fontFamily: "var(--font-manrope)",
              fontSize: 36,
            }}
          >
            Your personalized roadmap
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
            Here&apos;s exactly what to learn, build, and prove.
          </p>
        </div>

        <ResultsDashboard data={result} />
      </main>
    </>
  );
}
