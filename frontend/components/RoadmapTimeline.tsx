"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FlaskConical,
  Lock,
  Sparkles,
} from "lucide-react";
import type { Difficulty, LearningDay, PlanProgress } from "@/lib/types";
import type { StartTestInput } from "@/hooks/useTaskTest";
import { TeachingPromptCard } from "@/components/plan/TeachingPromptCard";

// ── Types ─────────────────────────────────────────────────────────────────────

type DayStatus = "completed" | "current" | "upcoming";

interface RoadmapTimelineProps {
  days: LearningDay[];
  difficulty: Difficulty;
  targetRole: string;
  totalDays: number;
  chosenSkills: string[];
  planProgress: PlanProgress;
  onOpenTest: (payload: StartTestInput) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function taskId(dayNum: number, taskIdx: number) {
  return `${dayNum}_${taskIdx}`;
}

function getDayStatus(entry: LearningDay, planProgress: PlanProgress): DayStatus {
  const ids = entry.tasks.map((_, i) => taskId(entry.day, i));
  if (ids.length === 0) return "upcoming";
  if (ids.every((id) => planProgress[id]?.passed)) return "completed";
  if (ids.some((id) => planProgress[id])) return "current";
  return "upcoming";
}

function findCurrentDayIndex(days: LearningDay[], planProgress: PlanProgress): number {
  for (let i = 0; i < days.length; i++) {
    if (getDayStatus(days[i], planProgress) !== "completed") return i;
  }
  return days.length - 1;
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DayStatus }) {
  if (status === "completed")
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.14em]"
        style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e" }}
      >
        <Check size={8} strokeWidth={3} /> Done
      </span>
    );
  if (status === "current")
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.14em]"
        style={{ backgroundColor: "rgba(116,57,198,0.1)", color: "#7439c6" }}
      >
        <span className="size-1.5 rounded-full bg-[#7439c6]" /> Current
      </span>
    );
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.14em]"
      style={{ backgroundColor: "var(--bg-elev)", color: "var(--text-dim)" }}
    >
      <Lock size={8} /> Upcoming
    </span>
  );
}

// ── Day item ──────────────────────────────────────────────────────────────────

function DayItem({
  entry,
  status,
  isLast,
  priorTaskCount,
  chosenSkills,
  difficulty,
  targetRole,
  totalDays,
  planProgress,
  onOpenTest,
  defaultOpen,
}: {
  entry: LearningDay;
  status: DayStatus;
  isLast: boolean;
  priorTaskCount: number;
  chosenSkills: string[];
  difficulty: Difficulty;
  targetRole: string;
  totalDays: number;
  planProgress: PlanProgress;
  onOpenTest: (p: StartTestInput) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const skillFor = (i: number) =>
    chosenSkills.length > 0 ? chosenSkills[(priorTaskCount + i) % chosenSkills.length] : "General";

  const dotBg =
    status === "completed"
      ? "#22c55e"
      : status === "current"
      ? "#7439c6"
      : "var(--bg)";

  const dotBorder =
    status === "completed" 
      ? "#22c55e" 
      : status === "current" 
      ? "#7439c6" 
      : "var(--border-strong)";

  return (
    <div className="flex gap-8 group">
      {/* Left connector */}
      <div className="flex flex-col items-center" style={{ minWidth: 32 }}>
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-300"
          style={{
            backgroundColor: dotBg,
            border: `2px solid ${dotBorder}`,
            color: status === "upcoming" ? "var(--text-dim)" : "#fff",
            zIndex: 1,
            boxShadow: status === "current" ? "0 0 15px rgba(116,57,198,0.2)" : "none"
          }}
        >
          {status === "completed" ? (
            <Check size={16} strokeWidth={3} />
          ) : (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {entry.day}
            </span>
          )}
        </div>
        {!isLast && (
          <div
            className="my-2 w-0.5 flex-1 transition-colors duration-300"
            style={{
              background: status === "completed"
                  ? "linear-gradient(180deg, #22c55e, #22c55e 50%, var(--border) 100%)"
                  : status === "current"
                  ? "linear-gradient(180deg, #7439c6, var(--border))"
                  : "var(--border)",
              minHeight: 40,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-start justify-between py-1 transition-colors text-left"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span
                className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold"
                style={{ color: status === "current" ? "#7439c6" : "var(--text-dim)" }}
              >
                Day {entry.day}
              </span>
              <StatusBadge status={status} />
            </div>
            <h3
              className="text-xl font-bold leading-tight"
              style={{
                color: status === "completed" ? "var(--text-dim)" : "var(--heading)",
                fontFamily: "var(--font-manrope)",
                textDecoration: status === "completed" ? "line-through" : "none",
                textDecorationColor: "rgba(34,197,94,0.4)",
              }}
            >
              {entry.topic}
            </h3>
          </div>
          <div className="mt-2 text-[var(--text-dim)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* Details */}
        {open && (
          <div className="mt-8 flex flex-col gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Tasks */}
            <div className="flex flex-col gap-4">
              {entry.tasks.map((task, i) => {
                const tid = taskId(entry.day, i);
                const progress = planProgress[tid];
                const skill = skillFor(i);

                return (
                  <div key={tid} className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div 
                          className="mt-1.5 size-2 shrink-0 rounded-full"
                          style={{
                            backgroundColor: progress?.passed ? "#22c55e" : "var(--accent)",
                            opacity: progress?.passed ? 0.6 : 1
                          }}
                        />
                        <span
                          className="text-base leading-relaxed"
                          style={{
                            color: progress?.passed ? "var(--text-dim)" : "var(--text)",
                            textDecoration: progress?.passed ? "line-through" : "none",
                          }}
                        >
                          {task}
                        </span>
                      </div>

                      {progress?.passed ? (
                        <div className="flex items-center gap-2 font-mono text-[10px] text-[#22c55e]">
                          <Check size={12} strokeWidth={3} />
                          <span>PASSED {progress.overallScore}%</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="shrink-0 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] font-mono font-bold transition-all hover:bg-[var(--accent-soft)]"
                          style={{
                            borderColor: "var(--border-strong)",
                            color: "var(--accent)",
                          }}
                          onClick={() =>
                            onOpenTest({
                              taskId: tid,
                              taskTitle: task,
                              taskDescription: task,
                              skill,
                              difficulty,
                              targetRole,
                              dayNumber: entry.day,
                            })
                          }
                        >
                          <FlaskConical size={12} />
                          TEST SKILL
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Lab */}
            <div className="flex flex-col gap-4 pl-5 border-l-2 border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent)]" />
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[var(--accent)]">
                  AI-Guided Learning
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {entry.tasks.map((task, i) => (
                  <TeachingPromptCard
                    key={i}
                    taskTitle={task}
                    taskDescription={task}
                    skill={skillFor(i)}
                    dayNumber={entry.day}
                    totalDays={totalDays}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Row: Resources & Proof */}
            <div className="grid sm:grid-cols-2 gap-8 mt-2">
              {entry.resources.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-[var(--text-dim)]">
                    Curated Resources
                  </p>
                  <div className="flex flex-col gap-2">
                    {entry.resources.map((r) => (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 group/link"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ExternalLink size={12} className="text-[var(--text-dim)]" />
                          <span className="text-sm truncate text-[var(--text-muted)] group-hover/link:text-[var(--accent)] transition-colors">
                            {r.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-dim)] shrink-0">
                          {r.estimatedMinutes}m
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-[var(--text-dim)]">
                  Proof of Work
                </p>
                <div 
                  className="text-sm leading-relaxed text-[var(--text-muted)] p-4 rounded-xl bg-[var(--bg-elev)] border border-[var(--border)]"
                >
                  {entry.proofOfWork}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Week divider ──────────────────────────────────────────────────────────────

function WeekLabel({ week }: { week: number }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div 
        className="size-10 shrink-0 flex items-center justify-center font-mono text-[10px] font-bold tracking-widest text-[var(--text-dim)]"
      >
        WK {week}
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-[var(--border-strong)] to-transparent" />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function RoadmapTimeline({
  days,
  difficulty,
  targetRole,
  totalDays,
  chosenSkills,
  planProgress,
  onOpenTest,
}: RoadmapTimelineProps) {
  const currentDayIndex = findCurrentDayIndex(days, planProgress);
  const showWeeks = totalDays >= 14;

  let priorTaskCount = 0;

  return (
    <div className="flex flex-col">
      {days.map((entry, index) => {
        const status = getDayStatus(entry, planProgress);
        const week = Math.ceil(entry.day / 7);
        const isWeekStart = showWeeks && entry.day % 7 === 1;

        const item = (
          <DayItem
            key={entry.day}
            entry={entry}
            status={status}
            isLast={index === days.length - 1}
            priorTaskCount={priorTaskCount}
            chosenSkills={chosenSkills}
            difficulty={difficulty}
            targetRole={targetRole}
            totalDays={totalDays}
            planProgress={planProgress}
            onOpenTest={onOpenTest}
            defaultOpen={index === currentDayIndex}
          />
        );

        priorTaskCount += entry.tasks.length;

        return (
          <div key={entry.day}>
            {isWeekStart && <WeekLabel week={week} />}
            {item}
          </div>
        );
      })}
    </div>
  );
}
