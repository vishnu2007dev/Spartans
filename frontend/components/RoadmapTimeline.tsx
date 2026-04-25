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

// ── Day card ──────────────────────────────────────────────────────────────────

function DayCard({
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

  const borderColor =
    status === "completed"
      ? "#22c55e"
      : status === "current"
      ? "#7439c6"
      : "var(--border)";

  const dotBg =
    status === "completed"
      ? "#22c55e"
      : status === "current"
      ? "#7439c6"
      : "var(--bg-elev)";

  const dotBorder =
    status === "upcoming" ? "var(--border-strong)" : dotBg;

  return (
    <div className="flex gap-4">
      {/* Left connector */}
      <div className="flex flex-col items-center" style={{ minWidth: 32 }}>
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: dotBg,
            border: `2px solid ${dotBorder}`,
            color:
              status === "upcoming" ? "var(--text-dim)" : "#fff",
            zIndex: 1,
          }}
        >
          {status === "completed" ? (
            <Check size={13} strokeWidth={3} />
          ) : (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {entry.day}
            </span>
          )}
        </div>
        {!isLast && (
          <div
            className="my-1 w-px flex-1"
            style={{
              background:
                status === "completed"
                  ? "rgba(34,197,94,0.35)"
                  : "var(--border)",
              minHeight: 20,
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="mb-4 flex-1 overflow-hidden rounded-xl border transition-all duration-200"
        style={{
          borderColor,
          borderLeftWidth: status === "current" ? 3 : 1,
          backgroundColor: status === "completed" ? "var(--bg-elev)" : "var(--bg)",
          opacity: status === "upcoming" ? 0.8 : 1,
          boxShadow:
            status === "current"
              ? "0 2px 16px rgba(116,57,198,0.1)"
              : "0 1px 4px rgba(15,23,42,0.04)",
        }}
      >
        {/* Card header — always visible */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 transition-colors"
          style={{ textAlign: "left" }}
        >
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.18em]"
                style={{ color: "var(--text-dim)" }}
              >
                Day {entry.day}
              </span>
              <StatusBadge status={status} />
            </div>
            <p
              className="text-sm font-semibold leading-snug"
              style={{
                color: status === "completed" ? "var(--text-muted)" : "var(--heading)",
                fontFamily: "var(--font-manrope)",
                textDecoration: status === "completed" ? "line-through" : "none",
                textDecorationColor: "rgba(34,197,94,0.5)",
              }}
            >
              {entry.topic}
            </p>
          </div>
          <div style={{ color: "var(--text-dim)", flexShrink: 0 }}>
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </button>

        {/* Expanded content */}
        {open && (
          <div
            className="flex flex-col gap-5 border-t px-4 pb-5 pt-4"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Tasks */}
            <ul className="flex flex-col gap-3">
              {entry.tasks.map((task, i) => {
                const tid = taskId(entry.day, i);
                const progress = planProgress[tid];
                const skill = skillFor(i);

                return (
                  <li key={tid} id={`plan-task-${tid}`} className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 min-w-0">
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: progress?.passed
                              ? "#22c55e"
                              : "var(--accent)",
                          }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{
                            color: progress?.passed ? "var(--text-muted)" : "var(--text)",
                            textDecoration: progress?.passed ? "line-through" : "none",
                          }}
                        >
                          {task}
                        </span>
                      </div>

                      {/* Test Me inline */}
                      {progress?.passed ? (
                        <span
                          className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono"
                          style={{
                            backgroundColor: "rgba(34,197,94,0.1)",
                            color: "#22c55e",
                            border: "1px solid rgba(34,197,94,0.3)",
                          }}
                        >
                          <Check size={9} strokeWidth={3} /> {progress.overallScore}%
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-mono transition-colors"
                          style={{
                            borderColor: progress ? "rgba(234,179,8,0.4)" : "var(--border-strong)",
                            color: progress ? "#fbbf24" : "var(--text-dim)",
                            backgroundColor: progress ? "rgba(234,179,8,0.06)" : "transparent",
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
                          <FlaskConical size={9} />
                          {progress ? `Retry (${progress.overallScore}%)` : "Test Me"}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Learn with AI — primary section */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2.5"
                style={{ backgroundColor: "rgba(116,57,198,0.04)", borderBottom: "1px solid var(--border)" }}
              >
                <Sparkles size={13} style={{ color: "#7439c6" }} />
                <span
                  className="text-[11px] font-mono uppercase tracking-[0.16em]"
                  style={{ color: "#7439c6" }}
                >
                  Learn with AI
                </span>
                <span className="ml-auto flex items-center gap-1 text-[10px] font-mono" style={{ color: "var(--text-dim)" }}>
                  <Clock size={10} /> ~15 min
                </span>
              </div>
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

            {/* Resources */}
            {entry.resources.length > 0 && (
              <div className="flex flex-col gap-2">
                <p
                  className="text-[10px] font-mono uppercase tracking-[0.18em]"
                  style={{ color: "var(--text-dim)" }}
                >
                  Resources
                </p>
                <div className="flex flex-wrap gap-2">
                  {entry.resources.map((r) => (
                    <a
                      key={r.url}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors hover:bg-[var(--bg-elev)]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--accent)",
                      }}
                    >
                      <ExternalLink size={10} />
                      {r.title}
                      <span style={{ color: "var(--text-dim)" }}>{r.estimatedMinutes}m</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Proof of work */}
            <div
              className="rounded-lg border-l-2 pl-3 py-1"
              style={{ borderColor: "var(--accent)" }}
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.16em] mb-1"
                style={{ color: "var(--text-dim)" }}
              >
                Proof of work
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {entry.proofOfWork}
              </p>
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
    <div className="flex items-center gap-3 mb-3 ml-10">
      <p
        className="text-[10px] font-mono uppercase tracking-[0.22em] shrink-0"
        style={{ color: "var(--text-dim)" }}
      >
        Week {week}
      </p>
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
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
    <div className="flex flex-col gap-0">
      {days.map((entry, index) => {
        const status = getDayStatus(entry, planProgress);
        const week = Math.ceil(entry.day / 7);
        const isWeekStart = showWeeks && entry.day % 7 === 1;

        const card = (
          <DayCard
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
            {card}
          </div>
        );
      })}
    </div>
  );
}
