"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { JobGrid } from "@/components/JobGrid";
import { SelectionCounter } from "@/components/SelectionCounter";
import { Button } from "@/components/ui/button";
import { jobs } from "@/lib/jobs";
import { useAppContext } from "@/lib/context";
import type { SelectedJob } from "@/lib/types";

const MIN = 2;
const MAX = 5;

export default function JobsPage() {
  const router = useRouter();
  const { setSelectedJobs } = useAppContext();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const maxReached = selectedIds.size >= MAX;

  function handleToggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX) {
        next.add(id);
      }
      return next;
    });
  }

  function handleAnalyze() {
    const selected: SelectedJob[] = jobs
      .filter((j) => selectedIds.has(j.id))
      .map(({ title, company, description, requiredSkills }) => ({
        title,
        company,
        description,
        requiredSkills,
      }));
    setSelectedJobs(selected);
    router.push("/analyze");
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />

      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 pb-32">
        {/* Page header */}
        <div className="py-16">
          <p
            className="font-mono text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--text-dim)" }}
          >
            Step 1 of 3
          </p>
          <h1
            className="text-4xl font-bold tracking-tight mb-3"
            style={{
              color: "var(--heading)",
              fontFamily: "var(--font-manrope)",
              letterSpacing: "-0.03em",
            }}
          >
            Find your target roles
          </h1>
          <p
            className="text-base max-w-xl"
            style={{ color: "var(--text-muted)" }}
          >
            Select 2–5 roles you&apos;re interested in. We&apos;ll build your roadmap around them.
          </p>
        </div>

        {/* Max-reached banner */}
        {maxReached && (
          <div
            className="mb-6 rounded-xl px-5 py-3 text-sm font-mono"
            style={{
              border: "1px solid var(--accent)",
              backgroundColor: "var(--accent-soft)",
              color: "var(--text-muted)",
            }}
          >
            You&apos;ve selected the maximum of {MAX} roles.
          </div>
        )}

        {/* Job grid */}
        <JobGrid
          jobs={jobs}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          maxReached={maxReached}
        />

        {/* CTA */}
        <div className="mt-10 flex justify-center sm:justify-end">
          <Button
            size="lg"
            disabled={selectedIds.size < MIN}
            onClick={handleAnalyze}
            className="w-full sm:w-auto"
          >
            Analyze My Readiness
          </Button>
        </div>
      </main>

      {/* Selection counter — sticky bottom */}
      <SelectionCounter count={selectedIds.size} min={MIN} max={MAX} />
    </div>
  );
}
