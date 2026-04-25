"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { FocusResult } from "@/lib/types";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";

export default function FocusPage() {
  const router = useRouter();
  const { gaps, selectedJobs, focusResult, setFocusResult, chosenSkills, setChosenSkills } = useAppContext();

  const [loading, setLoading] = useState(!focusResult);
  const [error, setError] = useState("");

  useEffect(() => {
    if (focusResult) return;
    if (!gaps || selectedJobs.length === 0) {
      router.replace("/gaps");
      return;
    }

    async function fetchFocus() {
      try {
        const res = await fetch(`${API_BASE}/api/skill-focus`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gaps: gaps!.gaps, selectedJobs }),
        });
        if (!res.ok) throw new Error("Skill focus fetch failed");
        const data: FocusResult = await res.json();
        setFocusResult(data);
        // default: pick all critical skills
        setChosenSkills(data.clusteredSkills.slice(0, 3).map((s) => s.skill));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchFocus();
  }, []);

  function toggleSkill(skill: string) {
    const next = chosenSkills.includes(skill)
      ? chosenSkills.filter((s) => s !== skill)
      : [...chosenSkills, skill];
    setChosenSkills(next);
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12">
        <div className="w-full max-w-xl mb-10 mx-auto">
          <OnboardingStepper currentStep={5} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}>
          Pick your focus skills
        </h1>
        <p className="text-base mb-8" style={{ color: "var(--text-muted)" }}>
          Select the skills you want your learning plan built around.
        </p>

        {loading && <p style={{ color: "var(--text-muted)" }}>Clustering your skill gaps...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {focusResult && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              {focusResult.clusteredSkills.map((s) => {
                const selected = chosenSkills.includes(s.skill);
                return (
                  <button
                    key={s.skill}
                    onClick={() => toggleSkill(s.skill)}
                    className="rounded-xl p-5 text-left flex items-start gap-4 transition-all"
                    style={{
                      backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-elev)",
                      border: selected ? "1px solid var(--accent)" : "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5"
                      style={{
                        backgroundColor: selected ? "var(--accent)" : "transparent",
                        border: selected ? "none" : "2px solid var(--border-strong)",
                      }}
                    >
                      {selected && <span style={{ color: "#000", fontSize: 11 }}>✓</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold" style={{ color: "var(--heading)" }}>{s.skill}</span>
                      <span className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>Appears in {s.appearsIn}</span>
                      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{s.rationale}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              size="lg"
              disabled={chosenSkills.length === 0}
              onClick={() => router.push("/plan")}
            >
              Build my learning plan ({chosenSkills.length} skill{chosenSkills.length !== 1 ? "s" : ""}) →
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
