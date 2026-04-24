import { Badge } from "@/components/ui/badge";
import type { PrioritySkill } from "@/lib/types";

interface PrioritySkillCardProps {
  skill: PrioritySkill;
}

function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  if (priority === "High") {
    return (
      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
        style={{
          border: "1px solid #ef4444",
          background: "rgba(239,68,68,0.08)",
          color: "#ef4444",
          fontFamily: "var(--font-mono)",
        }}
      >
        High
      </span>
    );
  }
  if (priority === "Medium") {
    return (
      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
        style={{
          border: "1px solid #f59e0b",
          background: "rgba(245,158,11,0.08)",
          color: "#f59e0b",
          fontFamily: "var(--font-mono)",
        }}
      >
        Medium
      </span>
    );
  }
  return <Badge variant="mono">Low</Badge>;
}

export function PrioritySkillCard({ skill }: PrioritySkillCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }}
    >
      {/* Top row: name + priority badge */}
      <div className="flex items-center justify-between gap-3">
        <span
          className="font-bold"
          style={{ color: "var(--heading)", fontSize: 16 }}
        >
          {skill.skill}
        </span>
        <PriorityBadge priority={skill.priority} />
      </div>

      {/* Appears in */}
      <span
        style={{
          color: "var(--text-dim)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Appears in {skill.appearsIn}
      </span>

      {/* Reason */}
      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{skill.reason}</p>

      {/* Recommended action */}
      <div className="flex flex-col gap-1">
        <span
          style={{
            color: "var(--text-dim)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Action
        </span>
        <p
          className="border-l-2 pl-3"
          style={{
            borderColor: "var(--accent)",
            color: "var(--text)",
            fontSize: 13,
          }}
        >
          {skill.recommendedAction}
        </p>
      </div>
    </div>
  );
}
