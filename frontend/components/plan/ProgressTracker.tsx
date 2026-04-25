"use client";

import Link from "next/link";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "@/components/ui/button";
import type { PlanProgress, PlanResult } from "@/lib/types";

interface ProgressTrackerProps {
  plan: PlanResult;
  planProgress: PlanProgress;
}

export function ProgressTracker({ plan, planProgress }: ProgressTrackerProps) {
  const totalTasks = plan.plan.reduce((n, d) => n + d.tasks.length, 0);
  if (totalTasks === 0) return null;

  const entries = Object.values(planProgress);
  const passedCount = entries.filter((e) => e.passed).length;
  const failedCount = entries.filter((e) => !e.passed).length;
  const attempted = entries.length;
  const notStarted = Math.max(0, totalTasks - attempted);
  const pct = Math.round((passedCount / totalTasks) * 100);
  const allPassed = passedCount === totalTasks && totalTasks > 0;

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div
        className="flex flex-col gap-6 rounded-xl border p-5 sm:flex-row sm:items-center sm:gap-10"
        style={{ borderColor: "var(--border)", background: "var(--bg-elev)" }}
      >
        <div className="mx-auto size-28 shrink-0 sm:mx-0 sm:size-32">
          <CircularProgressbar
            value={pct}
            text={`${passedCount}/${totalTasks}`}
            styles={buildStyles({
              pathColor: "var(--accent)",
              trailColor: "rgba(255,255,255,0.08)",
              textColor: "var(--heading)",
            })}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
          <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
            Plan progress
          </p>
          <div className="flex flex-col gap-1 text-sm sm:text-base">
            <p style={{ color: "#86efac" }}>{passedCount} passed</p>
            <p style={{ color: "#fbbf24" }}>{failedCount} attempted, not passed</p>
            <p style={{ color: "var(--text-dim)" }}>{notStarted} not started</p>
          </div>
        </div>
      </div>

      {allPassed && (
        <div
          className="flex flex-col items-start gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: "color-mix(in srgb, var(--accent) 35%, var(--border))",
            background: "var(--accent-soft)",
          }}
        >
          <p className="font-medium" style={{ color: "var(--heading)" }}>
            🎉 Plan complete — every task passed. Time to apply what you learned.
          </p>
          <Button variant="accent" size="sm" asChild>
            <Link href="/">Back to home →</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
