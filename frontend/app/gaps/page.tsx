"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { GapCard } from "@/components/PrioritySkillCard";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { GapsResult } from "@/lib/types";

export default function GapsPage() {
  const router = useRouter();
  const { profileText, selectedJobs, gaps, setGaps } = useAppContext();

  const [loading, setLoading] = useState(!gaps);
  const [error, setError] = useState("");

  useEffect(() => {
    if (gaps) return;
    if (selectedJobs.length === 0) {
      router.replace("/onboarding");
      return;
    }

    async function fetchGaps() {
      try {
        const bodyProfile = profileText.trim() ? profileText : "No profile provided. Evaluate based on general expectations.";
        const res = await fetch(`${API_BASE}/api/gaps`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: bodyProfile, selectedJobs }),
        });
        if (!res.ok) throw new Error("Gap analysis failed");
        const data: GapsResult = await res.json();
        setGaps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchGaps();
  }, []);

  const critical = gaps?.gaps.filter((g) => g.importance === "critical") ?? [];
  const niceToHave = gaps?.gaps.filter((g) => g.importance === "nice-to-have") ?? [];

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <main className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-dim)" }}>
          Step 4 of 6
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-8" style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}>
          Your gap analysis
        </h1>

        {loading && <p style={{ color: "var(--text-muted)" }}>Identifying your gaps...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {gaps && (
          <div className="flex flex-col gap-8">
            <p style={{ color: "var(--text-muted)", maxWidth: 600 }}>{gaps.summary}</p>

            {critical.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#ef4444" }}>Critical gaps</p>
                {critical.map((g) => <GapCard key={g.item} gap={g} />)}
              </div>
            )}

            {niceToHave.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Nice to have</p>
                {niceToHave.map((g) => <GapCard key={g.item} gap={g} />)}
              </div>
            )}

            <Button size="lg" onClick={() => router.push("/focus")}>
              Choose skills to focus on →
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
