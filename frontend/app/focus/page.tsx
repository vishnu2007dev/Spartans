"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Award,
  BriefcaseBusiness,
  Check,
  Gauge,
  Wrench,
  Zap,
} from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { ClusteredSkill, FocusResult } from "@/lib/types";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";

const REC_SLOTS = 3;
const REC_MIN = 3;
const REC_MAX = 5;

const categoryIcon: Record<string, typeof Zap> = {
  skill: Zap,
  experience: BriefcaseBusiness,
  tooling: Wrench,
  cert: Award,
};

// ── Donut ────────────────────────────────────────────────────────────────────

function SelectionDonut({ selected, total }: { selected: number; total: number }) {
  const rem = Math.max(0, total - selected);
  const data =
    selected === 0
      ? [{ v: 1, fill: "#e5e5e5" }]
      : selected === total
      ? [{ v: 1, fill: "#7439c6" }]
      : [
          { v: selected, fill: "#7439c6" },
          { v: rem,      fill: "#e5e5e5" },
        ];

  return (
    <div className="relative shrink-0" style={{ width: 80, height: 80 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="v"
            innerRadius={26}
            outerRadius={36}
            strokeWidth={0}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        <span className="text-lg font-bold leading-none" style={{ color: "#7439c6" }}>
          {selected}
        </span>
        <span className="text-[9px] font-mono" style={{ color: "var(--text-dim)" }}>
          / {total}
        </span>
      </div>
    </div>
  );
}

// ── Skill card ────────────────────────────────────────────────────────────────

function SkillCard({
  skill,
  selected,
  tag,
  onToggle,
}: {
  skill: ClusteredSkill;
  selected: boolean;
  tag: "Core" | "Optional";
  onToggle: () => void;
}) {
  const Icon = categoryIcon[skill.category] ?? Gauge;
  const isCore = tag === "Core";

  return (
    <button
      onClick={onToggle}
      className="group w-full text-left rounded-xl p-4 transition-all duration-150"
      style={{
        backgroundColor: selected ? "rgba(116,57,198,0.06)" : "var(--bg)",
        border: selected ? "1.5px solid #7439c6" : "1px solid var(--border)",
        boxShadow: selected
          ? "0 0 0 3px rgba(116,57,198,0.08), 0 2px 8px rgba(116,57,198,0.1)"
          : "0 1px 4px rgba(15,23,42,0.05)",
        outline: "none",
      }}
    >
      {/* Row 1: icon · tag · check */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex size-8 items-center justify-center rounded-lg transition-colors duration-150"
          style={{
            backgroundColor: selected ? "rgba(116,57,198,0.14)" : "var(--bg-elev)",
            color: selected ? "#7439c6" : "var(--text-dim)",
          }}
        >
          <Icon size={14} />
        </div>

        <div className="flex items-center gap-2">
          <span
            className="rounded px-1.5 py-px text-[9px] font-mono uppercase tracking-[0.14em]"
            style={
              isCore
                ? { color: "#7439c6", backgroundColor: "rgba(116,57,198,0.1)" }
                : { color: "var(--text-dim)", backgroundColor: "var(--bg-elev)" }
            }
          >
            {tag}
          </span>

          <div
            className="flex size-5 items-center justify-center rounded-full transition-all duration-150"
            style={{
              backgroundColor: selected ? "#7439c6" : "transparent",
              border: selected ? "none" : "1.5px solid var(--border-strong)",
            }}
          >
            {selected && <Check size={10} color="#fff" strokeWidth={3} />}
          </div>
        </div>
      </div>

      {/* Title */}
      <p
        className="text-sm font-semibold leading-snug mb-1"
        style={{
          color: selected ? "#4a2283" : "var(--heading)",
          fontFamily: "var(--font-manrope)",
        }}
      >
        {skill.skill}
      </p>

      {/* Rationale — 2 lines max */}
      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
        {skill.rationale}
      </p>

      {/* Footer: appears in */}
      <p
        className="mt-3 text-[10px] font-mono"
        style={{ color: selected ? "#7439c6" : "var(--text-dim)" }}
      >
        {skill.appearsIn}
      </p>
    </button>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────

function SectionLabel({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p
        className="text-[10px] font-mono uppercase tracking-[0.22em] shrink-0"
        style={{ color: "var(--text-dim)" }}
      >
        {label}
      </p>
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
      <p className="text-[10px] font-mono shrink-0" style={{ color: "var(--text-dim)" }}>
        {hint}
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FocusPage() {
  const router = useRouter();
  const { gaps, selectedJobs, focusResult, setFocusResult, chosenSkills, setChosenSkills } =
    useAppContext();

  const [loading, setLoading] = useState(!focusResult);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (focusResult) return;
    if (!gaps || selectedJobs.length === 0) { router.replace("/gaps"); return; }

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
        setChosenSkills(data.clusteredSkills.slice(0, REC_SLOTS).map((s) => s.skill));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchFocus();
  }, []);

  function toggle(skill: string) {
    setChosenSkills(
      chosenSkills.includes(skill)
        ? chosenSkills.filter((s) => s !== skill)
        : [...chosenSkills, skill],
    );
  }

  const all         = focusResult?.clusteredSkills ?? [];
  const recommended = all.slice(0, REC_SLOTS);
  const optional    = all.slice(REC_SLOTS);
  const total       = all.length;
  const count       = chosenSkills.length;
  const pct         = total > 0 ? Math.round((count / total) * 100) : 0;
  const inRange     = count >= REC_MIN && count <= REC_MAX;
  const canContinue = count >= 1;

  const ctaHint =
    count === 0
      ? "Select at least 1 skill to continue."
      : inRange
      ? `${count} skills — good range for a focused plan.`
      : count < REC_MIN
      ? `${REC_MIN - count} more recommended for a complete plan.`
      : `${count} selected — consider narrowing to ${REC_MAX} for sharper focus.`;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", paddingBottom: 88 }}>
      <Nav />

      <main className="mx-auto max-w-[1100px] px-5 lg:px-8 py-12">
        <div className="w-full max-w-xl mb-10 mx-auto">
          <OnboardingStepper currentStep={5} />
        </div>

        {/* ── Header card ── */}
        <div
          className="rounded-xl border p-6 mb-8"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)", boxShadow: "0 2px 12px rgba(15,23,42,0.04)" }}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h1
                className="text-3xl font-bold tracking-tight"
                style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}
              >
                Pick your focus skills
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                Select {REC_MIN}–{REC_MAX} skills to build your learning plan around.
              </p>

              {/* Stats + progress */}
              <div className="mt-5 flex flex-wrap items-end gap-6">
                {/* Selected count */}
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: "var(--text-dim)" }}>
                    Selected
                  </p>
                  <p
                    className="mt-0.5 text-2xl font-bold leading-none"
                    style={{ color: inRange ? "#7439c6" : "var(--heading)", fontFamily: "var(--font-manrope)" }}
                  >
                    {count}
                    <span className="ml-1 text-sm font-normal" style={{ color: "var(--text-dim)" }}>/ {total}</span>
                  </p>
                </div>

                <div className="h-7 w-px hidden sm:block" style={{ backgroundColor: "var(--border)" }} />

                {/* Recommended range */}
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: "var(--text-dim)" }}>
                    Recommended
                  </p>
                  <p
                    className="mt-0.5 text-2xl font-bold leading-none"
                    style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}
                  >
                    {REC_MIN}–{REC_MAX}
                    <span className="ml-1 text-sm font-normal" style={{ color: "var(--text-dim)" }}>skills</span>
                  </p>
                </div>

                <div className="h-7 w-px hidden sm:block" style={{ backgroundColor: "var(--border)" }} />

                {/* Progress bar */}
                <div className="flex-1" style={{ minWidth: 140, maxWidth: 220 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: "var(--text-dim)" }}>
                      Coverage
                    </p>
                    <p
                      className="text-[10px] font-mono font-semibold"
                      style={{ color: inRange ? "#7439c6" : "var(--text-dim)" }}
                    >
                      {pct}%
                    </p>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e5e5e5" }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: inRange ? "#7439c6" : "#a372f5",
                      }}
                    />
                  </div>
                  {/* Min/max tick labels */}
                  {total > 0 && (
                    <div className="relative mt-1.5" style={{ height: 10 }}>
                      <span
                        className="absolute text-[8px] font-mono"
                        style={{
                          left: `${Math.min((REC_MIN / total) * 100, 96)}%`,
                          transform: "translateX(-50%)",
                          color: "var(--text-dim)",
                        }}
                      >
                        {REC_MIN}
                      </span>
                      <span
                        className="absolute text-[8px] font-mono"
                        style={{
                          left: `${Math.min((REC_MAX / total) * 100, 96)}%`,
                          transform: "translateX(-50%)",
                          color: "var(--text-dim)",
                        }}
                      >
                        {REC_MAX}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Donut */}
            <SelectionDonut selected={count} total={total} />
          </div>
        </div>

        {loading && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Clustering your skill gaps…</p>
        )}
        {error && (
          <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
        )}

        {focusResult && (
          <div className="space-y-8">
            {/* Recommended */}
            {recommended.length > 0 && (
              <section>
                <SectionLabel label="Recommended" hint="Pre-selected based on your gaps" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recommended.map((s) => (
                    <SkillCard
                      key={s.skill}
                      skill={s}
                      selected={chosenSkills.includes(s.skill)}
                      tag="Core"
                      onToggle={() => toggle(s.skill)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Optional */}
            {optional.length > 0 && (
              <section>
                <SectionLabel label="Optional" hint="Add to broaden your plan" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {optional.map((s) => (
                    <SkillCard
                      key={s.skill}
                      skill={s}
                      selected={chosenSkills.includes(s.skill)}
                      tag="Optional"
                      onToggle={() => toggle(s.skill)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* ── Sticky CTA ── */}
      {focusResult && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 border-t"
          style={{
            backgroundColor: "var(--bg)",
            borderColor: "var(--border)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="mx-auto max-w-[1100px] flex items-center justify-between gap-4 px-5 lg:px-8 py-3.5">
            <p className="text-sm" style={{ color: inRange ? "#7439c6" : "var(--text-muted)" }}>
              {ctaHint}
            </p>
            <Button
              size="lg"
              disabled={!canContinue}
              onClick={() => router.push("/plan")}
              className="shrink-0"
            >
              Build my learning plan →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
