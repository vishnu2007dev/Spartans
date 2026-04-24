"use client";

import type { Gap } from "@/lib/types";

interface GapCardProps {
  gap: Gap;
}

const importanceStyles: Record<Gap["importance"], { label: string; color: string; bg: string }> = {
  "critical":     { label: "Critical",     color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  "nice-to-have": { label: "Nice to Have", color: "var(--accent)", bg: "var(--accent-soft)" },
};

const categoryLabels: Record<Gap["category"], string> = {
  skill:      "Skill",
  cert:       "Certification",
  experience: "Experience",
  tooling:    "Tooling",
};

export function GapCard({ gap }: GapCardProps) {
  const style = importanceStyles[gap.importance];

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ backgroundColor: "var(--bg-elev)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="font-bold text-base"
          style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}
        >
          {gap.item}
        </span>

        <span
          className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: style.color, backgroundColor: style.bg, border: `1px solid ${style.color}` }}
        >
          {style.label}
        </span>

        <span
          className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: "var(--text-dim)", backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}
        >
          {categoryLabels[gap.category]}
        </span>
      </div>

      <p className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>
        Appears in {gap.appearsIn}
      </p>

      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {gap.reason}
      </p>
    </div>
  );
}
