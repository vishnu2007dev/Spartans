"use client";

import { cn } from "@/lib/utils";
import type { Days } from "@/lib/types";

interface TimelineSelectorProps {
  value: Days;
  onChange: (d: Days) => void;
}

const options: { value: Days; label: string; descriptor: string }[] = [
  { value: 7,  label: "7 days",  descriptor: "Quick sprint" },
  { value: 14, label: "14 days", descriptor: "Balanced pace" },
  { value: 28, label: "28 days", descriptor: "Deep dive" },
];

export function TimelineSelector({ value, onChange }: TimelineSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="font-mono text-xs uppercase tracking-widest"
        style={{ color: "var(--text-dim)" }}
      >
        Plan Length
      </span>

      <div role="radiogroup" aria-label="Plan Length" className="flex flex-wrap gap-3">
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
                border: selected ? "1px solid var(--accent)" : "1px solid var(--border)",
                color: selected ? "var(--heading)" : "var(--text-muted)",
                fontWeight: selected ? 700 : 400,
                minWidth: "90px",
              }}
            >
              <span className="text-sm">{opt.label}</span>
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
