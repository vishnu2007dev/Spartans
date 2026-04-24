"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/types";

interface JobCardProps {
  job: Job;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function JobCard({ job, selected, onToggle, disabled }: JobCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl p-5 flex flex-col gap-3 transition-all",
        selected
          ? "border border-[var(--accent)]"
          : disabled
          ? "border border-[var(--border)] opacity-40 cursor-not-allowed"
          : "border border-[var(--border)] hover:border-[var(--border-strong)]"
      )}
      style={{
        backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-elev)",
      }}
    >
      {/* Selected checkmark */}
      {selected && (
        <CheckCircle2
          className="absolute top-4 right-4 size-5"
          style={{ color: "var(--accent)" }}
          aria-hidden="true"
        />
      )}

      {/* Top row: title + company */}
      <div className="flex flex-wrap items-start gap-2 pr-7">
        <span
          className="font-bold text-base leading-tight"
          style={{
            color: "var(--heading)",
            fontFamily: "var(--font-manrope)",
            letterSpacing: "-0.02em",
          }}
        >
          {job.title}
        </span>
        <Badge variant="mono">{job.company}</Badge>
      </div>

      {/* Location + type */}
      <div
        className="font-mono text-xs"
        style={{ color: "var(--text-dim)" }}
      >
        {job.location} · {job.type}
      </div>

      {/* Description */}
      <p
        className="text-[13px] line-clamp-2 leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {job.description}
      </p>

      {/* Skills */}
      <div className="flex flex-col gap-1.5">
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--text-dim)" }}
        >
          Required
        </span>
        <div className="flex flex-wrap gap-1.5">
          {job.requiredSkills.map((skill) => (
            <Badge key={skill} variant="mono">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Toggle button */}
      <div className="mt-auto pt-1">
        <Button
          variant={selected ? "accent" : disabled ? "ghost" : "outline"}
          size="sm"
          disabled={disabled}
          aria-pressed={selected}
          aria-label={`${selected ? "Deselect" : "Select"} ${job.title} at ${job.company}`}
          onClick={disabled ? undefined : onToggle}
          className="w-full"
        >
          {selected ? "Selected ✓" : "Select"}
        </Button>
      </div>
    </div>
  );
}
