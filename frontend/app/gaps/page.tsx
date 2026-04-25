"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  Gauge,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GapTable } from "@/components/PrioritySkillCard";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { Gap, GapsResult } from "@/lib/types";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";

const categoryOrder = ["Experience", "Skills", "Tooling"] as const;
const categoryColor: Record<(typeof categoryOrder)[number], string> = {
  Experience: "#4a2283",
  Skills: "#7439c6",
  Tooling: "#0f766e",
};

function parseAppearsIn(appearsIn: string) {
  const match = appearsIn.match(/(\d+)\s+of\s+(\d+)/i);
  if (!match) return { impacted: 1, total: 1, ratio: 1 };
  const impacted = Number(match[1]);
  const total = Number(match[2]);
  return { impacted, total, ratio: total > 0 ? impacted / total : 1 };
}

function mapGapCategory(category: Gap["category"]) {
  if (category === "experience") return "Experience";
  if (category === "tooling") return "Tooling";
  return "Skills";
}

function estimateCoverage(gaps: Gap[], requiredSkillCount: number) {
  if (requiredSkillCount <= 0) return 68;
  const skillAndToolingCount = gaps.filter((gap) => gap.category !== "experience").length;
  const uncoveredRatio = Math.min(1, skillAndToolingCount / requiredSkillCount);
  return Math.max(12, Math.round((1 - uncoveredRatio) * 100));
}

function metricTone(value: number) {
  if (value >= 70) return "#15803d";
  if (value >= 45) return "#ca8a04";
  return "#dc2626";
}

function SummaryMetric({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg)",
        boxShadow: "0 2px 12px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div className="flex">
        <div className="w-[3px] shrink-0" style={{ backgroundColor: accent }} />
        <div className="flex-1 px-4 py-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-dim)" }}>
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold leading-none" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}>
            {value}
          </p>
          <p className="mt-2 text-xs leading-5" style={{ color: "var(--text-muted)" }}>
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  detail,
  accent,
  icon: Icon,
}: {
  title: string;
  detail: string;
  accent: string;
  icon: typeof AlertTriangle;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}12`, color: accent }}
      >
        <Icon size={15} />
      </div>
      <div>
        <h2 className="text-xl font-semibold leading-none" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}>
          {title}
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {detail}
        </p>
      </div>
    </div>
  );
}

export default function GapsPage() {
  const router = useRouter();
  const { profileText, selectedJobs, gaps, setGaps } = useAppContext();

  const [loading, setLoading] = useState(!gaps);
  const [error, setError] = useState("");

  useEffect(() => {
    if (gaps) return;
    if (selectedJobs.length === 0) {
      router.replace("/onboarding");
      return;
    }

    async function fetchGaps() {
      try {
        const bodyProfile = profileText.trim() ? profileText : "No profile provided. Evaluate based on general expectations.";
        const res = await fetch(`${API_BASE}/api/gaps`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: bodyProfile, selectedJobs }),
        });
        if (!res.ok) throw new Error("Gap analysis failed");
        const data: GapsResult = await res.json();
        setGaps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchGaps();
  }, []);

  const allGaps = gaps?.gaps ?? [];
  const critical = allGaps.filter((gap) => gap.importance === "critical");
  const niceToHave = allGaps.filter((gap) => gap.importance === "nice-to-have");
  const uniqueRequiredSkills = new Set(selectedJobs.flatMap((job) => job.requiredSkills ?? []));
  const coverage = estimateCoverage(allGaps, uniqueRequiredSkills.size);

  const summaryMetrics = [
    {
      label: "Total Gaps",
      value: String(allGaps.length),
      detail: "Distinct capability gaps surfaced across your selected roles.",
      accent: "#7439c6",
    },
    {
      label: "Critical Gaps",
      value: String(critical.length),
      detail: "High-priority blockers most likely to reduce interview readiness.",
      accent: "#dc2626",
    },
    {
      label: "Skill Coverage",
      value: `${coverage}%`,
      detail: "Estimated current alignment against role requirements.",
      accent: metricTone(coverage),
    },
  ];

  const categoryCounts = categoryOrder.map((label) => ({
    name: label,
    value: allGaps.filter((gap) => mapGapCategory(gap.category) === label).length,
    fill: categoryColor[label],
  }));

  const priorityBreakdown = [
    { name: "Critical", value: critical.length, fill: "#ef4444" },
    { name: "Nice to have", value: niceToHave.length, fill: "#f59e0b" },
  ];

  const focusRadar = [
    { area: "Role overlap", value: Math.round((allGaps.reduce((sum, gap) => sum + parseAppearsIn(gap.appearsIn).ratio, 0) / Math.max(allGaps.length, 1)) * 100) },
    { area: "Coverage", value: coverage },
    { area: "Criticality", value: Math.min(100, critical.length * 22) },
    { area: "Tooling", value: Math.min(100, allGaps.filter((gap) => gap.category === "tooling").length * 28) },
    { area: "Experience", value: Math.min(100, allGaps.filter((gap) => gap.category === "experience").length * 28) },
  ];

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <main className="mx-auto max-w-[1320px] px-5 py-12 lg:px-8">
        <div className="mx-auto mb-10 w-full max-w-xl">
          <OnboardingStepper currentStep={4} backPath="/score" nextPath="/focus" />
        </div>

        {loading && <p style={{ color: "var(--text-muted)" }}>Identifying your gaps...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {gaps && (
          <div className="space-y-8">
            <section
              className="overflow-hidden rounded-xl border px-6 py-8 lg:px-8"
              style={{
                borderColor: "var(--border)",
                background:
                  "radial-gradient(circle at top right, rgba(116,57,198,0.07), transparent 30%), var(--bg)",
                boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_360px]">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
                      <Sparkles size={16} />
                    </div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.26em]" style={{ color: "var(--text-dim)" }}>
                      Gap analysis
                    </p>
                  </div>

                  <h1
                    className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl"
                    style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.04em" }}
                  >
                    Close the blockers first, then stack faster wins.
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: "var(--text-muted)" }}>
                    {gaps.summary}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {summaryMetrics.map((metric) => (
                      <SummaryMetric
                        key={metric.label}
                        label={metric.label}
                        value={metric.value}
                        detail={metric.detail}
                        accent={metric.accent}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-xl"
                  style={{
                    background: "linear-gradient(160deg, #1e1133, #0f0a1e)",
                    color: "#f8fafc",
                    boxShadow: "0 8px 32px rgba(74, 34, 131, 0.25)",
                    padding: "24px",
                  }}
                >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                          Snapshot
                        </p>
                        <h2 className="mt-1.5 text-xl font-semibold" style={{ fontFamily: "var(--font-manrope)" }}>
                          Readiness profile
                        </h2>
                      </div>
                      <Gauge style={{ color: "#a372f5" }} size={18} />
                    </div>

                    <div className="mt-4 h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={focusRadar} outerRadius="72%">
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="area" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "var(--font-mono)" }} />
                          <Radar dataKey="value" stroke="#a372f5" fill="#7439c6" fillOpacity={0.4} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="flex items-center justify-between text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                        <span>Coverage estimate</span>
                        <span className="font-semibold" style={{ color: "#fff" }}>{coverage}%</span>
                      </div>
                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${coverage}%`,
                            background: "linear-gradient(90deg, #f59e0b, #a372f5)",
                          }}
                        />
                      </div>
                    </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_380px]">
              <Card className="border-0 shadow-none rounded-xl" style={{ backgroundColor: "var(--bg)", boxShadow: "0 2px 16px rgba(15, 23, 42, 0.06)", border: "1px solid var(--border)" }}>
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-dim)" }}>
                        Gap categories
                      </p>
                      <h2 className="mt-1.5 text-xl font-semibold" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}>
                        Where the gaps cluster
                      </h2>
                    </div>
                    <div className="hidden items-center gap-3 sm:flex">
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>Experience</span>
                      <span className="size-2 rounded-full" style={{ backgroundColor: categoryColor.Experience }} />
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>Skills</span>
                      <span className="size-2 rounded-full" style={{ backgroundColor: categoryColor.Skills }} />
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>Tooling</span>
                      <span className="size-2 rounded-full" style={{ backgroundColor: categoryColor.Tooling }} />
                    </div>
                  </div>

                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryCounts} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="name" tick={{ fill: "var(--text-dim)", fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: "var(--text-dim)", fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip
                          cursor={{ fill: "rgba(15,23,42,0.04)" }}
                          contentStyle={{
                            backgroundColor: "var(--bg)",
                            borderColor: "var(--border)",
                            borderRadius: "10px",
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {categoryCounts.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6">
                <Card className="border-0 shadow-none rounded-xl" style={{ backgroundColor: "var(--bg)", boxShadow: "0 2px 16px rgba(15, 23, 42, 0.06)", border: "1px solid var(--border)" }}>
                  <CardContent className="p-6">
                    <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-dim)" }}>
                      Priority mix
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}>
                      Critical vs secondary
                    </h2>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="h-[180px] w-[180px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={priorityBreakdown}
                              dataKey="value"
                              innerRadius={48}
                              outerRadius={76}
                              paddingAngle={3}
                              stroke="none"
                            >
                              {priorityBreakdown.map((entry) => (
                                <Cell key={entry.name} fill={entry.fill} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-4">
                        {priorityBreakdown.map((item) => (
                          <div key={item.name}>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                              <span className="text-xs font-mono uppercase tracking-[0.16em]" style={{ color: "var(--text-dim)" }}>{item.name}</span>
                            </div>
                            <div className="text-3xl font-bold" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-none rounded-xl" style={{ backgroundColor: "var(--bg)", boxShadow: "0 2px 16px rgba(15, 23, 42, 0.06)", border: "1px solid var(--border)" }}>
                  <CardContent className="p-6">
                    <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-dim)" }}>
                      What to do next
                    </p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={16} className="mt-1 shrink-0 text-red-500" />
                        <p className="text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                          Address the {critical.length} critical blockers first. Those are the fastest path to better role coverage.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <BriefcaseBusiness size={16} className="mt-1 shrink-0 text-blue-600" />
                        <p className="text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                          Experience and tooling gaps usually affect more than one target role, so they compound faster than isolated topics.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-emerald-600" />
                        <p className="text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                          Use the focus step to convert these gaps into a smaller action list instead of trying to tackle everything at once.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {critical.length > 0 && (
              <section className="space-y-4">
                <SectionHeader
                  title="Critical Gaps"
                  detail="High-emphasis blockers with the strongest effect on readiness and interview outcomes."
                  accent="#dc2626"
                  icon={AlertTriangle}
                />
                <GapTable gaps={critical} />
              </section>
            )}

            {niceToHave.length > 0 && (
              <section className="space-y-4">
                <SectionHeader
                  title="Nice to Have"
                  detail="Secondary improvements that sharpen your profile after the major blockers are covered."
                  accent="#ca8a04"
                  icon={Wrench}
                />
                <GapTable gaps={niceToHave} />
              </section>
            )}

            <div className="sticky bottom-4 z-20">
              <Button
                size="lg"
                onClick={() => router.push("/focus")}
                className="w-full justify-center rounded-lg"
                style={{ boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)" }}
              >
                Choose skills to focus on {"->"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
