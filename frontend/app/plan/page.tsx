"use client";

import { useState } from "react";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { TimelineSelector } from "@/components/TimelineSelector";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { PlanResult, Difficulty, Days } from "@/lib/types";

const DIFFICULTIES: { value: Difficulty; label: string; descriptor: string }[] = [
  { value: "beginner",     label: "Beginner",     descriptor: "Foundational concepts" },
  { value: "intermediate", label: "Intermediate",  descriptor: "Hands-on projects" },
  { value: "advanced",     label: "Advanced",      descriptor: "Production-quality output" },
];

export default function PlanPage() {
  const { profileText, chosenSkills, days, setDays, difficulty, setDifficulty, plan, setPlan } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (chosenSkills.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const bodyProfile = profileText.trim() ? profileText : "No profile provided. Evaluate based on general expectations.";
      const res = await fetch(`${API_BASE}/api/learning-path`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: bodyProfile, chosenSkills, days, difficulty }),
      });
      if (!res.ok) throw new Error("Plan generation failed");
      const data: PlanResult = await res.json();
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16 pb-24">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-dim)" }}>
          Step 6 of 6
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}>
          Your learning plan
        </h1>
        <p className="text-base mb-10" style={{ color: "var(--text-muted)" }}>
          Set your timeline and difficulty, then generate your day-by-day plan.
        </p>

        {!plan && (
          <div className="flex flex-col gap-8 max-w-xl">
            <TimelineSelector value={days} onChange={(d: Days) => setDays(d)} />

            {/* Difficulty selector */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                Difficulty
              </span>
              <div role="radiogroup" aria-label="Difficulty" className="flex gap-3">
                {DIFFICULTIES.map((opt) => {
                  const selected = difficulty === opt.value;
                  return (
                    <button
                      key={opt.value}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setDifficulty(opt.value)}
                      className="flex-1 rounded-xl p-4 flex flex-col gap-1 text-left transition-all"
                      style={{
                        backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-elev)",
                        border: selected ? "1px solid var(--accent)" : "1px solid var(--border)",
                        color: selected ? "var(--heading)" : "var(--text-muted)",
                        fontWeight: selected ? 700 : 400,
                      }}
                    >
                      <span className="text-sm">{opt.label}</span>
                      <span className="font-mono text-[11px]" style={{ color: selected ? "var(--heading-sub)" : "var(--text-dim)" }}>
                        {opt.descriptor}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chosen skills summary */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                Skills to learn
              </span>
              <div className="flex flex-wrap gap-2">
                {chosenSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-sm font-mono" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

            <Button size="lg" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating your plan..." : "Generate my plan →"}
            </Button>
          </div>
        )}

        {plan && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Days</span>
                <span className="text-2xl font-bold" style={{ color: "var(--heading)" }}>{plan.days}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Difficulty</span>
                <span className="text-2xl font-bold" style={{ color: "var(--heading)" }}>{plan.difficulty}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Readiness gain</span>
                <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>+{plan.projectedReadinessGain}%</span>
              </div>
            </div>

            <RoadmapTimeline days={plan.plan} />

            <Button variant="outline" onClick={() => setPlan(null)}>
              Regenerate with different settings
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
