"use client";

import { useState } from "react";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { ProgressTracker } from "@/components/plan/ProgressTracker";
import { TestModal } from "@/components/plan/TestModal";
import { PlanShareCard } from "@/components/plan/PlanShareCard";
import { motion } from "framer-motion";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { PlanResult, Difficulty, Days } from "@/lib/types";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  BookOpen,
  Code2,
  GraduationCap,
  Rocket,
  Timer,
  X,
  Zap,
} from "lucide-react";

// ── Config data ───────────────────────────────────────────────────────────────

const PLAN_OPTIONS: {
  value: Days;
  label: string;
  sub: string;
  icon: typeof Zap;
  hrsPerDay: Record<Difficulty, number>;
}[] = [
  {
    value: 7,
    label: "7 days",
    sub: "Quick sprint",
    icon: Zap,
    hrsPerDay: { beginner: 0.75, intermediate: 1.25, advanced: 2 },
  },
  {
    value: 14,
    label: "14 days",
    sub: "Balanced pace",
    icon: Timer,
    hrsPerDay: { beginner: 1, intermediate: 1.5, advanced: 2.5 },
  },
  {
    value: 28,
    label: "28 days",
    sub: "Deep dive",
    icon: BookOpen,
    hrsPerDay: { beginner: 0.75, intermediate: 1.25, advanced: 2 },
  },
];

const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  label: string;
  sub: string;
  icon: typeof Zap;
}[] = [
  { value: "beginner",     label: "Beginner",     sub: "Foundational concepts",   icon: GraduationCap },
  { value: "intermediate", label: "Intermediate", sub: "Hands-on projects",       icon: Code2 },
  { value: "advanced",     label: "Advanced",     sub: "Production-quality output", icon: Rocket },
];

// Simplified workload shape per phase, scaled by difficulty
function buildWorkload(d: Days, diff: Difficulty) {
  const scale = diff === "advanced" ? 1.4 : diff === "intermediate" ? 1 : 0.65;
  if (d === 7)  return [
    { phase: "Day 1–2", load: Math.round(55 * scale) },
    { phase: "Day 3–4", load: Math.round(85 * scale) },
    { phase: "Day 5–6", load: Math.round(75 * scale) },
    { phase: "Day 7",   load: Math.round(45 * scale) },
  ];
  if (d === 14) return [
    { phase: "Wk 1",   load: Math.round(60 * scale) },
    { phase: "Wk 1–2", load: Math.round(90 * scale) },
    { phase: "Wk 2",   load: Math.round(75 * scale) },
    { phase: "Review",  load: Math.round(50 * scale) },
  ];
  return [
    { phase: "Wk 1", load: Math.round(50 * scale) },
    { phase: "Wk 2", load: Math.round(80 * scale) },
    { phase: "Wk 3", load: Math.round(90 * scale) },
    { phase: "Wk 4", load: Math.round(60 * scale) },
  ];
}

// ── Option card ───────────────────────────────────────────────────────────────

function OptionCard({
  selected,
  label,
  sub,
  icon: Icon,
  onClick,
}: {
  selected: boolean;
  label: string;
  sub: string;
  icon: typeof Zap;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 text-left rounded-xl p-4 transition-all duration-150"
      style={{
        backgroundColor: selected ? "rgba(116,57,198,0.06)" : "var(--bg)",
        border: selected ? "1.5px solid #7439c6" : "1px solid var(--border)",
        boxShadow: selected
          ? "0 0 0 3px rgba(116,57,198,0.08)"
          : "0 1px 4px rgba(15,23,42,0.04)",
        outline: "none",
      }}
    >
      <div
        className="flex size-8 items-center justify-center rounded-lg mb-3 transition-colors duration-150"
        style={{
          backgroundColor: selected ? "rgba(116,57,198,0.12)" : "var(--bg-elev)",
          color: selected ? "#7439c6" : "var(--text-dim)",
        }}
      >
        <Icon size={15} />
      </div>
      <p
        className="text-sm font-semibold leading-none mb-1"
        style={{
          color: selected ? "#4a2283" : "var(--heading)",
          fontFamily: "var(--font-manrope)",
        }}
      >
        {label}
      </p>
      <p
        className="text-[11px] font-mono"
        style={{ color: selected ? "#7439c6" : "var(--text-dim)" }}
      >
        {sub}
      </p>
    </button>
  );
}

// ── Preview panel ─────────────────────────────────────────────────────────────

function PreviewPanel({
  days,
  difficulty,
  skillCount,
}: {
  days: Days;
  difficulty: Difficulty;
  skillCount: number;
}) {
  const opt      = PLAN_OPTIONS.find((o) => o.value === days)!;
  const hrs      = opt.hrsPerDay[difficulty];
  const workload = buildWorkload(days, difficulty);
  const maxLoad  = Math.max(...workload.map((w) => w.load));

  const diffLabel = DIFFICULTY_OPTIONS.find((d) => d.value === difficulty)!.label;

  return (
    <div
      className="rounded-xl border p-6"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg)",
        boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
      }}
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-4" style={{ color: "var(--text-dim)" }}>
        Plan preview
      </p>

      {/* Big number */}
      <div className="flex items-end gap-3 mb-5">
        <span
          className="text-5xl font-bold leading-none"
          style={{ color: "#4a2283", fontFamily: "var(--font-manrope)" }}
        >
          {days}
        </span>
        <div className="pb-1">
          <p className="text-sm font-medium leading-none mb-1" style={{ color: "var(--heading)" }}>
            day plan
          </p>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>{opt.sub}</p>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 rounded-lg p-3 mb-5 gap-2"
        style={{ backgroundColor: "var(--bg-elev)" }}
      >
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.14em] mb-1" style={{ color: "var(--text-dim)" }}>
            Difficulty
          </p>
          <p className="text-xs font-semibold" style={{ color: "var(--heading)" }}>
            {diffLabel}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.14em] mb-1" style={{ color: "var(--text-dim)" }}>
            Skills
          </p>
          <p className="text-xs font-semibold" style={{ color: "var(--heading)" }}>
            {skillCount}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.14em] mb-1" style={{ color: "var(--text-dim)" }}>
            Daily effort
          </p>
          <p className="text-xs font-semibold" style={{ color: "#7439c6" }}>
            ~{hrs} hrs
          </p>
        </div>
      </div>

      {/* Workload chart */}
      <div className="mb-1">
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] mb-3" style={{ color: "var(--text-dim)" }}>
          Workload curve
        </p>
        <div style={{ height: 100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workload} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "var(--bg)",
                  borderColor: "var(--border)",
                  borderRadius: 8,
                  fontSize: 11,
                  padding: "4px 8px",
                }}
                formatter={(v: number) => [`${v}%`, "Load"]}
              />
              <Bar dataKey="load" radius={[4, 4, 0, 0]}>
                {workload.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.load === maxLoad ? "#7439c6" : "rgba(116,57,198,0.25)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-1">
          {workload.map((w) => (
            <span key={w.phase} className="text-[9px] font-mono" style={{ color: "var(--text-dim)" }}>
              {w.phase}
            </span>
          ))}
        </div>
      </div>

      {/* Total hours */}
      <div
        className="mt-5 rounded-lg p-3 flex items-center justify-between"
        style={{ backgroundColor: "rgba(116,57,198,0.06)", border: "1px solid rgba(116,57,198,0.14)" }}
      >
        <p className="text-xs" style={{ color: "#4a2283" }}>
          Total commitment
        </p>
        <p className="text-sm font-bold" style={{ color: "#4a2283", fontFamily: "var(--font-manrope)" }}>
          ~{Math.round(hrs * days)} hrs
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PlanPage() {
  const {
    profileText,
    chosenSkills,
    setChosenSkills,
    selectedJobs,
    days,
    setDays,
    difficulty,
    setDifficulty,
    plan,
    setPlan,
    planProgress,
  } = useAppContext();

  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [testOpen, setTestOpen]       = useState(false);
  const [testPayload, setTestPayload] = useState<StartTestInput | null>(null);

  const targetRole =
    selectedJobs.length > 0 ? selectedJobs.map((j) => j.title).join(", ") : "Software developer";

  function openTest(p: StartTestInput) { setTestPayload(p); setTestOpen(true); }
  function closeTest() { setTestOpen(false); setTestPayload(null); }

  async function handleGenerate() {
    if (chosenSkills.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const bodyProfile = profileText.trim()
        ? profileText
        : "No profile provided. Evaluate based on general expectations.";
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
      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12 pb-24">
        <div className="w-full max-w-xl mb-10 mx-auto">
          <OnboardingStepper currentStep={6} backPath="/focus" />
        </div>

        {/* ── Config view (pre-generation) ── */}
        {!plan && (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px]">

            {/* LEFT: Config */}
            <div className="flex flex-col gap-8">
              <div>
                <h1
                  className="text-3xl font-bold tracking-tight mb-1"
                  style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}
                >
                  Your learning plan
                </h1>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Set your timeline and difficulty, then generate your day-by-day plan.
                </p>
              </div>

              {/* Plan length */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: "var(--text-dim)" }}>
                  Plan length
                </p>
                <div className="flex gap-3">
                  {PLAN_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={days === opt.value}
                      label={opt.label}
                      sub={opt.sub}
                      icon={opt.icon}
                      onClick={() => setDays(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: "var(--text-dim)" }}>
                  Difficulty
                </p>
                <div className="flex gap-3">
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={difficulty === opt.value}
                      label={opt.label}
                      sub={opt.sub}
                      icon={opt.icon}
                      onClick={() => setDifficulty(opt.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-dim)" }}>
                    Skills to learn
                  </p>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{ color: "#7439c6", backgroundColor: "rgba(116,57,198,0.1)" }}
                  >
                    {chosenSkills.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {chosenSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono"
                      style={{
                        backgroundColor: "rgba(116,57,198,0.08)",
                        color: "#7439c6",
                        border: "1px solid rgba(116,57,198,0.2)",
                      }}
                    >
                      {s}
                      <button
                        onClick={() => setChosenSkills(chosenSkills.filter((x) => x !== s))}
                        className="opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {chosenSkills.length === 0 && (
                    <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                      No skills selected — go back to the focus step.
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
              )}

              {/* CTA */}
              <div>
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={loading || chosenSkills.length === 0}
                  className="w-full sm:w-auto"
                >
                  {loading
                    ? "Generating your plan…"
                    : `Generate my ${days}-day plan →`}
                </Button>
                <p className="mt-2 text-[11px] font-mono" style={{ color: "var(--text-dim)" }}>
                  Takes ~10 seconds · {chosenSkills.length} skill{chosenSkills.length !== 1 ? "s" : ""} · {days} days
                </p>
              </div>
            </div>

            {/* RIGHT: Preview */}
            <div className="mt-16">
              <PreviewPanel
                days={days}
                difficulty={difficulty}
                skillCount={chosenSkills.length}
              />
            </div>
          </div>
        )}

        {/* ── Generated plan view ── */}
        {plan && (
          <div className="flex flex-col gap-8">
            {/* Plan summary banner */}
            <div className="py-6 border-b border-[var(--border)]">
              <div className="flex flex-wrap items-center justify-between gap-8">
                <div className="flex flex-wrap items-center gap-12">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-dim)]">Timeline</p>
                    <p className="text-3xl font-bold tracking-tight text-[var(--heading)]" style={{ fontFamily: "var(--font-manrope)" }}>
                      {plan.days} Days
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-dim)]">Expertise</p>
                    <p className="text-3xl font-bold tracking-tight text-[var(--heading)] capitalize" style={{ fontFamily: "var(--font-manrope)" }}>
                      {plan.difficulty}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-dim)]">Impact</p>
                    <p className="text-3xl font-bold tracking-tight text-[var(--accent)]" style={{ fontFamily: "var(--font-manrope)" }}>
                      +{plan.projectedReadinessGain}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPlan(null)}
                  className="group flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
                >
                  <X size={14} className="group-hover:rotate-90 transition-transform" />
                  RESET PLAN
                </button>
              </div>
            </div>

            <ProgressTracker plan={plan} planProgress={planProgress} />

            <RoadmapTimeline
              days={plan.plan}
              difficulty={plan.difficulty}
              targetRole={targetRole}
              totalDays={plan.days}
              chosenSkills={chosenSkills}
              planProgress={planProgress}
              onOpenTest={openTest}
            />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <PlanShareCard />
            </motion.div>

          </div>
        )}
      </main>

      <TestModal
        key={testPayload?.taskId ?? "closed"}
        open={testOpen}
        payload={testPayload}
        onClose={closeTest}
      />
    </div>
  );
}
