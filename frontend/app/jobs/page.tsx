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
import AIThinking from "@/components/ui/ai-thinking";
import { Search, Briefcase, Code, BarChart3, Megaphone, ArrowUp } from "lucide-react";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";

const MIN = 1;
const MAX = 5;

const SUGGESTIONS = [
  { icon: Code, label: "Software Engineer", query: "Software Engineer Intern" },
  { icon: BarChart3, label: "Data Analyst", query: "Data Analyst Entry Level" },
  { icon: Briefcase, label: "Product Manager", query: "Product Manager Junior" },
  { icon: Megaphone, label: "Marketing", query: "Digital Marketing Associate" },
  { icon: Code, label: "Frontend Dev", query: "Frontend Developer React" },
  { icon: BarChart3, label: "Business Analyst", query: "Business Analyst" },
];

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

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
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

  function handleSuggestionClick(q: string) {
    setQuery(q);
    // Trigger search after setting query
    setTimeout(() => {
      setLoading(true);
      setError("");
      setSearched(true);
      fetch(`${API_BASE}/api/jobs/search?query=${encodeURIComponent(q)}&num_pages=1`)
        .then((res) => {
          if (!res.ok) throw new Error("Search failed");
          return res.json();
        })
        .then((data) => setJobs((data.data ?? []).map(jsearchToJob)))
        .catch(() => setError("Could not fetch jobs. Make sure the backend is running."))
        .finally(() => setLoading(false));
    }, 0);
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

  const hasResults = searched && !loading && jobs.length > 0;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Nav />

      <main className="flex-1 flex flex-col">
        {/* Hero / Search area — vertically centered when no results */}
        <div
          className={`flex flex-col items-center transition-all duration-500 ease-out ${
            hasResults ? "pt-8 pb-6" : "flex-1 justify-center"
          }`}
          style={!hasResults ? { marginTop: "20px" } : undefined}
        >
          {/* Stepper */}
          <div className={`w-full max-w-xl mb-8 transition-opacity ${hasResults ? "opacity-60" : ""}`}>
            <OnboardingStepper currentStep={2} />
          </div>

          {/* Big centered heading — only show when no results */}
          {!hasResults && (
            <h1
              className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-center"
              style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}
            >
              What roles are you targeting?
            </h1>
          )}

          {!hasResults && (
            <p className="text-base text-center max-w-lg mb-10" style={{ color: "var(--text-muted)" }}>
              Search for real job listings and select 1–5 roles. We&apos;ll analyze the gap between your skills and what&apos;s required.
            </p>
          )}

          {/* Search input — Claude-style prominent bar */}
          <form
            onSubmit={handleSearch}
            className={`w-full transition-all duration-500 ${hasResults ? "max-w-3xl px-5" : "max-w-2xl px-5"}`}
          >
            <div
              className="relative flex items-center rounded-2xl shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md"
              style={{
                backgroundColor: "var(--bg-elev)",
                border: "1px solid var(--border)",
              }}
            >
              <Search size={18} className="absolute left-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for any role, company, or location..."
                className="w-full py-4 pl-11 pr-14 text-base bg-transparent rounded-2xl outline-none"
                style={{ color: "var(--text)" }}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30"
                style={{ backgroundColor: query.trim() ? "var(--heading)" : "transparent" }}
              >
                <ArrowUp size={18} className={query.trim() ? "text-white" : "text-gray-400"} />
              </button>
            </div>
          </form>

          {/* Suggestion pills — only show pre-search */}
          {!hasResults && !loading && (
            <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-2xl px-5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSuggestionClick(s.query)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--bg-elev)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  <s.icon size={14} />
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="mx-auto max-w-[1280px] w-full px-5 lg:px-8 pb-32">
          {/* Error */}
          {error && (
            <p className="mb-6 text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>
          )}

          {/* Max reached banner */}
          {maxReached && (
            <div
              className="mb-6 rounded-xl px-5 py-3 text-sm font-mono text-center"
              style={{ border: "1px solid var(--accent)", backgroundColor: "var(--accent-soft)", color: "var(--text-muted)" }}
            >
              You&apos;ve selected the maximum of {MAX} roles.
            </div>
          )}

          {/* Loading state — AI thinking */}
          {loading && (
            <div className="flex justify-center py-12">
              <AIThinking
                message="Searching job listings..."
                className="w-full max-w-xl"
                content={`Connecting to job listing aggregators... Querying multiple sources including LinkedIn, Indeed, Glassdoor, and company career pages for "${query}".

Scanning results for relevance... I need to filter out expired listings and verify that the positions are still accepting applications. Checking posting dates and application status.

Extracting structured data from each listing — job title, company name, location, employment type, required skills, and preferred qualifications. Some listings have inconsistent formatting, so I'm normalizing the data.

Parsing the required skills and qualifications sections. I'm looking for both explicit skill requirements ("must have 3+ years of React") and implied ones from the job description. Cross-referencing with your resume profile for potential matches.

Categorizing results by relevance... Prioritizing roles that align with your skill set. Roles with higher skill overlap will appear first.

Validating company information and checking for duplicate listings across platforms. Some positions are posted on multiple sites — I'm deduplicating to give you clean results.

Final ranking: Organizing ${query}-related positions by match quality, location preference, and posting recency. Preparing the results for display.`}
              />
            </div>
          )}

          {/* Empty state */}
          {!loading && searched && jobs.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>No results found. Try a different search.</p>
          )}

          {/* Results grid */}
          {hasResults && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {jobs.length} results for &ldquo;{query}&rdquo;
                </p>
              </div>
              <JobGrid jobs={jobs} selectedIds={selectedIds} onToggle={handleToggle} maxReached={maxReached} />
            </>
          )}

          {/* CTA */}
          {selectedIds.size > 0 && (
            <div className="mt-10 flex justify-end">
              <Button size="lg" onClick={handleContinue}>
                Continue with {selectedIds.size} role{selectedIds.size > 1 ? "s" : ""} →
              </Button>
            </div>
          )}
        </div>
      </main>

      <SelectionCounter count={selectedIds.size} min={MIN} max={MAX} />
    </div>
  );
}
