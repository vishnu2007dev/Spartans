"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { ScoreResult } from "@/lib/types";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";

type ScoreApiResponse = ScoreResult & {
  _meta?: {
    source?: "ai" | "mock";
    reason?: string;
  };
};

export default function ScorePage() {
  const router = useRouter();
  const { profileText, selectedJobs, score, setScore } = useAppContext();

  const [loading, setLoading] = useState(!score);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedJobs.length === 0) {
      router.replace("/onboarding");
      return;
    }

    async function fetchScore() {
      try {
        setLoading(true);
        setError("");
        const bodyProfile = profileText.trim() ? profileText : "No profile provided. Evaluate based on general expectations.";
        const res = await fetch(`${API_BASE}/api/score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: bodyProfile, selectedJobs }),
        });
        if (!res.ok) throw new Error("Score fetch failed");
        const data: ScoreApiResponse = await res.json();
        if (data._meta?.source === "mock") {
          setError(`Showing fallback score data (${data._meta.reason ?? "unknown_reason"}).`);
        }
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
      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12">
        <div className="w-full max-w-xl mb-12 mx-auto">
          <OnboardingStepper currentStep={3} backPath="/jobs" nextPath="/gaps" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-8" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}>
          Your readiness score
        </h1>

        {loading && <p style={{ color: "var(--text-muted)" }}>Analyzing your profile...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {score && (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-10">
            {/* Left Column: Scores, Summary, Pros/Cons */}
            <div className="flex-1 flex flex-col gap-8">
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

              <p className="text-lg leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: 600 }}>{score.summary}</p>

              <div className="grid sm:grid-cols-2 gap-8">
                {/* Pros */}
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--accent)" }}>Key Strengths</p>
                  <ul className="flex flex-col gap-2">
                    {score.pros?.map((pro, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[var(--text-muted)] items-start">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="flex flex-col gap-3">
                  <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#ef4444" }}>Areas to Improve</p>
                  <ul className="flex flex-col gap-2">
                    {score.cons?.map((con, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[var(--text-muted)] items-start">
                        <XCircle size={16} className="shrink-0 mt-0.5 text-[#ef4444]" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-dim)" }}>Skills you have</p>
                <div className="flex flex-wrap gap-2">
                  {score.matchedSkills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-sm font-mono" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent)" }}>{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-dim)" }}>Skills to build</p>
                <div className="flex flex-wrap gap-2">
                  {score.missingSkills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-sm font-mono" style={{ backgroundColor: "var(--bg-elev)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{s}</span>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button size="lg" onClick={() => router.push("/gaps")} className="w-full sm:w-auto">
                  See detailed gap analysis →
                </Button>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="hidden lg:block w-px self-stretch shrink-0"
              style={{ background: "linear-gradient(180deg, transparent, var(--accent), transparent)" }}
            />

            {/* Right Column: Radar Chart */}
            <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0">
              <div 
                className="p-6 flex flex-col h-full min-h-[400px]"
                style={{ 
                  backgroundColor: "transparent", 
                  borderRadius: "0px" 
                }}
              >
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "var(--heading)" }}>Skill Breakdown</h3>
                  <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>Your readiness mapped across 5 core dimensions.</p>
                </div>
                
                <div className="flex-1 w-full relative">
                  {score.skillRadar && score.skillRadar.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={score.skillRadar}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis 
                          dataKey="category" 
                          tick={{ fill: "var(--text-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} 
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", borderRadius: "8px", color: "var(--text)" }}
                          itemStyle={{ color: "var(--accent)", fontWeight: 600 }}
                          formatter={(value: unknown) => [`${value ?? 0}/100`, "Score"]}
                        />
                        <Radar 
                          name="Readiness" 
                          dataKey="score" 
                          stroke="var(--accent)" 
                          fill="var(--accent)" 
                          fillOpacity={0.35} 
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: "var(--text-dim)" }}>
                      Not enough data to map skill dimensions.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
