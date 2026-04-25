"use client";

import { AlertTriangle, Award, BriefcaseBusiness, Gauge, Wrench } from "lucide-react";
import type { Gap } from "@/lib/types";

interface GapCardProps {
  gap: Gap;
}

const categoryConfig: Record<
  Gap["category"],
  { label: string; icon: typeof Gauge; accent: string; soft: string }
> = {
  skill: {
    label: "Skill",
    icon: Gauge,
    accent: "#7439c6",
    soft: "rgba(116, 57, 198, 0.1)",
  },
  cert: {
    label: "Certification",
    icon: Award,
    accent: "#b45309",
    soft: "rgba(180, 83, 9, 0.1)",
  },
  experience: {
    label: "Experience",
    icon: BriefcaseBusiness,
    accent: "#4a2283",
    soft: "rgba(74, 34, 131, 0.1)",
  },
  tooling: {
    label: "Tooling",
    icon: Wrench,
    accent: "#0f766e",
    soft: "rgba(15, 118, 110, 0.1)",
  },
};

const importanceConfig: Record<
  Gap["importance"],
  { label: string; accent: string; soft: string; stripe: string; progress: string }
> = {
  critical: {
    label: "Critical",
    accent: "#dc2626",
    soft: "rgba(220, 38, 38, 0.08)",
    stripe: "#dc2626",
    progress: "#ef4444",
  },
  "nice-to-have": {
    label: "Nice to have",
    accent: "#b45309",
    soft: "rgba(180, 83, 9, 0.08)",
    stripe: "#d97706",
    progress: "#f59e0b",
  },
};

function parseAppearsIn(appearsIn: string) {
  const match = appearsIn.match(/(\d+)\s+of\s+(\d+)/i);
  if (!match) return { impacted: 1, total: 1, ratio: 1 };
  const impacted = Number(match[1]);
  const total = Number(match[2]);
  return { impacted, total, ratio: total > 0 ? impacted / total : 1 };
}

function estimateCoverage(gap: Gap) {
  const { ratio } = parseAppearsIn(gap.appearsIn);
  const base = gap.importance === "critical" ? 42 : 64;
  const categoryPenalty =
    gap.category === "experience" ? 10 :
    gap.category === "tooling" ? 7 :
    gap.category === "cert" ? 4 : 0;
  return Math.max(8, Math.min(84, Math.round(base - ratio * 24 - categoryPenalty)));
}

function compactReason(reason: string) {
  if (reason.length <= 140) return reason;
  return `${reason.slice(0, 137).trimEnd()}...`;
}

export function GapCard({ gap }: GapCardProps) {
  const category = categoryConfig[gap.category];
  const importance = importanceConfig[gap.importance];
  const CategoryIcon = category.icon;
  const { impacted, total, ratio } = parseAppearsIn(gap.appearsIn);
  const coverage = estimateCoverage(gap);

  return (
    <div
      className="group rounded-xl border overflow-hidden transition-all duration-200 hover:-translate-y-px"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg)",
        boxShadow: "0 2px 12px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div className="flex">
        {/* Left importance stripe */}
        <div className="w-[3px] shrink-0" style={{ backgroundColor: importance.stripe }} />

        <div className="flex-1 p-5">
          {/* Top row: icon + title + tags + jobs hit */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-lg mt-0.5"
                style={{ backgroundColor: category.soft, color: category.accent }}
              >
                <CategoryIcon size={15} />
              </div>

              <div className="min-w-0">
                <h3
                  className="text-base font-semibold leading-snug"
                  style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}
                >
                  {gap.item}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em]"
                    style={{ color: importance.accent, backgroundColor: importance.soft }}
                  >
                    <AlertTriangle size={9} />
                    {importance.label}
                  </span>
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em]"
                    style={{ color: category.accent, backgroundColor: category.soft }}
                  >
                    {category.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Jobs hit — clean, no box */}
            <div className="shrink-0 text-right pl-2">
              <div
                className="text-[10px] font-mono uppercase tracking-[0.18em]"
                style={{ color: "var(--text-dim)" }}
              >
                Jobs hit
              </div>
              <div
                className="mt-0.5 text-xl font-bold leading-none"
                style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}
              >
                {impacted}/{total}
              </div>
            </div>
          </div>

          {/* Reason */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {compactReason(gap.reason)}
          </p>

          {/* Footer: coverage bar */}
          <div className="mt-4 pt-3.5" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.18em]"
                style={{ color: "var(--text-dim)" }}
              >
                Coverage
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="font-semibold" style={{ color: "var(--text)" }}>{coverage}%</span>
                {" · "}impacts {Math.round(ratio * 100)}% of selected roles
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--bg-elev)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${coverage}%`,
                  background: `linear-gradient(90deg, ${importance.progress}, ${category.accent})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
