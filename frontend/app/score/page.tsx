"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { ScoreResult } from "@/lib/types";

export default function ScorePage() {
  const router = useRouter();
  const { profileText, selectedJobs, score, setScore } = useAppContext();

  const [loading, setLoading] = useState(!score);
  const [error, setError] = useState("");

  useEffect(() => {
    if (score) return;
    if (selectedJobs.length === 0) {
      router.replace("/onboarding");
      return;
    }

    async function fetchScore() {
      try {
        const bodyProfile = profileText.trim() ? profileText : "No profile provided. Evaluate based on general expectations.";
        const res = await fetch(`${API_BASE}/api/score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: bodyProfile, selectedJobs }),
        });
        if (!res.ok) throw new Error("Score fetch failed");
        const data: ScoreResult = await res.json();
        setScore(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchScore();
  }, []);

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-dim)" }}>
          Step 3 of 6
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-8" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}>
          Your readiness score
        </h1>

        {loading && <p style={{ color: "var(--text-muted)" }}>Analyzing your profile...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {score && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-8">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Current</span>
                <span className="text-5xl font-bold" style={{ color: "var(--heading)" }}>{score.overallScore}<span className="text-2xl">/100</span></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Projected</span>
                <span className="text-5xl font-bold" style={{ color: "var(--accent)" }}>{score.projectedScore}<span className="text-2xl">/100</span></span>
              </div>
            </div>

            <p style={{ color: "var(--text-muted)", maxWidth: 600 }}>{score.summary}</p>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-dim)" }}>Skills you have</p>
              <div className="flex flex-wrap gap-2">
                {score.matchedSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-sm font-mono" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>{s}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-dim)" }}>Skills to build</p>
              <div className="flex flex-wrap gap-2">
                {score.missingSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-sm font-mono" style={{ backgroundColor: "var(--bg-elev)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{s}</span>
                ))}
              </div>
            </div>

            <Button size="lg" onClick={() => router.push("/gaps")}>
              See gap analysis →
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
