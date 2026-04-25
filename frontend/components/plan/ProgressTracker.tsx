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
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
        <div className="size-24 shrink-0">
          <CircularProgressbar
            value={pct}
            strokeWidth={12}
            styles={buildStyles({
              pathColor: "#7439c6",
              trailColor: "var(--border)",
              strokeLinecap: "round",
            })}
          />
        </div>
        
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--heading)]">
              {pct}% Complete
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
              {passedCount} of {totalTasks} milestones achieved
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-[var(--text-dim)] uppercase">Passed</span>
              <span className="text-lg font-bold text-[#22c55e]">{passedCount}</span>
            </div>
            <div className="h-8 w-px bg-[var(--border)] self-end" />
            <div className="flex flex-col">
              <span className="text-xs font-mono text-[var(--text-dim)] uppercase">Attempted</span>
              <span className="text-lg font-bold text-[#fbbf24]">{failedCount}</span>
            </div>
            <div className="h-8 w-px bg-[var(--border)] self-end" />
            <div className="flex flex-col">
              <span className="text-xs font-mono text-[var(--text-dim)] uppercase">Remaining</span>
              <span className="text-lg font-bold text-[var(--text-muted)]">{notStarted}</span>
            </div>
          </div>
        </div>
      </div>

      {allPassed && (
        <div
          className="mt-8 flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-[var(--accent-soft)] to-transparent border border-[var(--accent-soft)]"
        >
          <p className="text-lg font-bold text-[var(--heading)] text-center">
            🎉 Curriculum Mastered. You've completed every challenge.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link href="/">Apply Now →</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
