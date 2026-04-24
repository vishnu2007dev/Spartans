"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { ProfileInput } from "@/components/ProfileInput";
import { TimelineSelector } from "@/components/TimelineSelector";
import { SelectedJobsSummary } from "@/components/SelectedJobsSummary";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import type { Timeline } from "@/lib/types";

export default function AnalyzePage() {
  const router = useRouter();
  const { selectedJobs, setResult } = useAppContext();

  const [profile, setProfile] = useState("");
  const [timeline, setTimeline] = useState<Timeline>("4 weeks");
  const [profileError, setProfileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (selectedJobs.length === 0) {
      const t = setTimeout(() => router.push("/jobs"), 100);
      return () => clearTimeout(t);
    }
  }, [selectedJobs, router]);

  async function handleSubmit() {
    if (!profile.trim()) {
      setProfileError("Profile text is required.");
      return;
    }
    setProfileError("");
    setLoading(true);
    setSubmitError("");

    try {
      const res = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, selectedJobs, timeline }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      const result = await res.json();
      setResult(result);
      router.push("/results");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      if (msg.includes("Failed to fetch") || msg.includes("fetch")) {
        setSubmitError("Cannot reach the backend. Make sure the server is running on port 3001.");
      } else {
        setSubmitError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />

      <main className="mx-auto max-w-[1280px] px-5 lg:px-8">
        {/* Page header */}
        <div className="py-16">
          <p
            className="font-mono text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--text-dim)" }}
          >
            Step 2 of 3
          </p>
          <h1
            className="text-3xl font-bold tracking-tight mb-3"
            style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)" }}
          >
            Tell us about yourself
          </h1>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            We&apos;ll compare your background against your selected roles.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <SelectedJobsSummary jobs={selectedJobs} />
            <ProfileInput
              value={profile}
              onChange={setProfile}
              error={profileError}
            />
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <TimelineSelector value={timeline} onChange={setTimeline} />

            {/* Info card */}
            <div
              className="rounded-xl p-5 flex flex-col gap-4"
              style={{
                backgroundColor: "var(--bg-elev)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: "var(--text-dim)" }}
              >
                What happens next?
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "We analyze your profile against each selected role",
                  "AI identifies your skill gaps and strengths",
                  "You get a personalized week-by-week roadmap",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                      aria-hidden="true"
                    />
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Submit section */}
        <div className="mt-8 pb-16 flex flex-col items-stretch sm:items-end gap-4">
          {/* ARIA live region */}
          <div aria-live="polite" className="sr-only">
            {loading ? "Analyzing your profile..." : submitError}
          </div>

          {submitError && (
            <div
              className="w-full sm:max-w-sm rounded-xl px-4 py-3 text-sm"
              style={{
                border: "1px solid #ef4444",
                color: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.06)",
              }}
            >
              {submitError}
            </div>
          )}

          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span
                  className="border-2 rounded-full w-4 h-4 animate-spin"
                  style={{
                    borderColor: "var(--border)",
                    borderTopColor: "var(--accent)",
                  }}
                  aria-hidden="true"
                />
                Analyzing your profile...
              </span>
            ) : (
              "Analyze My Readiness"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
