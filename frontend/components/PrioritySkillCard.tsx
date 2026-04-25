"use client";

import { Award, BriefcaseBusiness, Gauge, Wrench } from "lucide-react";
import type { Gap } from "@/lib/types";

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
    label: "Cert",
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
  { label: string; dot: string; progress: string; rowSoft: string }
> = {
  critical: {
    label: "Critical",
    dot: "#dc2626",
    progress: "#ef4444",
    rowSoft: "rgba(220, 38, 38, 0.03)",
  },
  "nice-to-have": {
    label: "Nice to have",
    dot: "#d97706",
    progress: "#f59e0b",
    rowSoft: "transparent",
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
  const penalty =
    gap.category === "experience" ? 10 :
    gap.category === "tooling" ? 7 :
    gap.category === "cert" ? 4 : 0;
  return Math.max(8, Math.min(84, Math.round(base - ratio * 24 - penalty)));
}

function GapRow({ gap, last }: { gap: Gap; last: boolean }) {
  const cat = categoryConfig[gap.category];
  const imp = importanceConfig[gap.importance];
  const CatIcon = cat.icon;
  const { impacted, total } = parseAppearsIn(gap.appearsIn);
  const coverage = estimateCoverage(gap);

  return (
    <tr
      className="group transition-colors duration-100"
      style={{
        borderBottom: last ? "none" : "1px solid var(--border)",
        backgroundColor: imp.rowSoft,
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--bg-elev)")}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = imp.rowSoft)}
    >
      {/* Gap name */}
      <td className="py-3.5 pl-4 pr-4" style={{ minWidth: 180 }}>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}
        >
          {gap.item}
        </span>
      </td>

      {/* Category */}
      <td className="py-3.5 pr-6" style={{ width: 120 }}>
        <span
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-mono uppercase tracking-[0.14em]"
          style={{ color: cat.accent, backgroundColor: cat.soft }}
        >
          <CatIcon size={10} />
          {cat.label}
        </span>
      </td>

      {/* Reason */}
      <td className="py-3.5 pr-6 text-xs leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: 400 }}>
        {gap.reason.length > 100 ? `${gap.reason.slice(0, 97).trimEnd()}…` : gap.reason}
      </td>

      {/* Roles hit */}
      <td className="py-3.5 pr-6 text-center" style={{ width: 72 }}>
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}
        >
          {impacted}/{total}
        </span>
      </td>

      {/* Coverage bar */}
      <td className="py-3.5 pr-4" style={{ width: 140 }}>
        <div className="flex items-center gap-2">
          <div
            className="h-1 flex-1 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--bg-elev)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${coverage}%`,
                background: `linear-gradient(90deg, ${imp.progress}, ${cat.accent})`,
              }}
            />
          </div>
          <span
            className="shrink-0 text-[10px] font-mono tabular-nums"
            style={{ color: "var(--text-dim)", minWidth: 28, textAlign: "right" }}
          >
            {coverage}%
          </span>
        </div>
      </td>
    </tr>
  );
}

export function GapTable({ gaps }: { gaps: Gap[] }) {
  return (
    <div
      className="w-full overflow-hidden rounded-xl"
      style={{ border: "1px solid var(--border)" }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-elev)" }}>
            <th className="py-2.5 pl-4 pr-4 text-left text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-dim)" }}>
              Gap
            </th>
            <th className="py-2.5 pr-6 text-left text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-dim)" }}>
              Type
            </th>
            <th className="py-2.5 pr-6 text-left text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-dim)" }}>
              Reason
            </th>
            <th className="py-2.5 pr-6 text-center text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-dim)" }}>
              Roles
            </th>
            <th className="py-2.5 pr-4 text-left text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-dim)" }}>
              Coverage
            </th>
          </tr>
        </thead>
        <tbody>
          {gaps.map((gap, i) => (
            <GapRow key={gap.item} gap={gap} last={i === gaps.length - 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GapCard({ gap }: { gap: Gap }) {
  return <GapTable gaps={[gap]} />;
}
