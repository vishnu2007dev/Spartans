"use client";

import { cn } from "@/lib/utils";
import type { Timeline } from "@/lib/types";

interface TimelineSelectorProps {
  value: Timeline;
  onChange: (t: Timeline) => void;
}

const options: { value: Timeline; descriptor: string }[] = [
  { value: "2 weeks", descriptor: "Quick sprint" },
  { value: "4 weeks", descriptor: "Balanced pace" },
  { value: "8 weeks", descriptor: "Deep dive" },
];

export function TimelineSelector({ value, onChange }: TimelineSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="font-mono text-xs uppercase tracking-widest"
        style={{ color: "var(--text-dim)" }}
      >
        Preparation Timeline
      </span>

      <div
        role="radiogroup"
        aria-label="Preparation Timeline"
        className="flex flex-wrap gap-3"
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={cn("flex-1 rounded-xl p-4 flex flex-col gap-1 text-left transition-all")}
              style={{
                backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-elev)",
                border: selected
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
                color: selected ? "var(--heading)" : "var(--text-muted)",
                fontWeight: selected ? 700 : 400,
                minWidth: "90px",
              }}
            >
              <span className="text-sm">{opt.value}</span>
              <span
                className="font-mono text-[11px]"
                style={{ color: selected ? "var(--heading-sub)" : "var(--text-dim)" }}
              >
                {opt.descriptor}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
