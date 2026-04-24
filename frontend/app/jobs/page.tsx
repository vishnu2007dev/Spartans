"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { JobGrid } from "@/components/JobGrid";
import { SelectionCounter } from "@/components/SelectionCounter";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { Job, SelectedJob } from "@/lib/types";
import type { JSearchJob } from "@/lib/jsearch";

const MIN = 1;
const MAX = 5;

function jsearchToJob(j: JSearchJob): Job {
  return {
    id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(", "),
    type: j.job_employment_type,
    description: j.job_description.slice(0, 400),
    requiredSkills: j.job_required_skills ?? j.job_highlights?.Qualifications?.slice(0, 6) ?? [],
    preferredSkills: [],
    category: "Live",
  };
}

export default function JobsPage() {
  const router = useRouter();
  const { setSelectedJobs } = useAppContext();

  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const maxReached = selectedIds.size >= MAX;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/jobs/search?query=${encodeURIComponent(query)}&num_pages=1`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setJobs((data.data ?? []).map(jsearchToJob));
    } catch {
      setError("Could not fetch jobs. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

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

  function handleContinue() {
    const selected: SelectedJob[] = jobs
      .filter((j) => selectedIds.has(j.id))
      .map(({ title, company, description, requiredSkills }) => ({
        title,
        company,
        description,
        requiredSkills,
      }));
    setSelectedJobs(selected);
    router.push("/score");
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />

      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 pb-32">
        {/* Header */}
        <div className="py-16">
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-dim)" }}>
            Step 2 of 6
          </p>
          <h1
            className="text-4xl font-bold tracking-tight mb-3"
            style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}
          >
            Find your target roles
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--text-muted)" }}>
            Search for real job listings and select 1–5 roles you&apos;re targeting.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Software Engineer Intern, Data Analyst NYC..."
            className="flex-1 rounded-xl px-4 py-3 text-sm"
            style={{
              backgroundColor: "var(--bg-elev)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              outline: "none",
            }}
          />
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {/* Error */}
        {error && (
          <p className="mb-6 text-sm" style={{ color: "#ef4444" }}>{error}</p>
        )}

        {/* Max reached banner */}
        {maxReached && (
          <div
            className="mb-6 rounded-xl px-5 py-3 text-sm font-mono"
            style={{ border: "1px solid var(--accent)", backgroundColor: "var(--accent-soft)", color: "var(--text-muted)" }}
          >
            You&apos;ve selected the maximum of {MAX} roles.
          </div>
        )}

        {/* Results */}
        {loading && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Searching live job listings...</p>
        )}

        {!loading && searched && jobs.length === 0 && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No results found. Try a different search.</p>
        )}

        {!loading && jobs.length > 0 && (
          <JobGrid jobs={jobs} selectedIds={selectedIds} onToggle={handleToggle} maxReached={maxReached} />
        )}

        {/* CTA */}
        {selectedIds.size > 0 && (
          <div className="mt-10 flex justify-end">
            <Button size="lg" onClick={handleContinue}>
              Continue with {selectedIds.size} role{selectedIds.size > 1 ? "s" : ""} →
            </Button>
          </div>
        )}
      </main>

      <SelectionCounter count={selectedIds.size} min={MIN} max={MAX} />
    </div>
  );
}
