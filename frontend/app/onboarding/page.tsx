"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { ParsedResume } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { selectedJobs, setParsedResume, setProfileText, profileText } = useAppContext();

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleContinue() {
    if (!profileText.trim() && !file) {
      setError("Paste your profile text or upload a resume.");
      return;
    }

    setError("");
    setParsing(true);

    try {
      if (file) {
        const form = new FormData();
        form.append("resume", file);
        if (linkedinUrl.trim()) form.append("linkedinUrl", linkedinUrl.trim());

        const res = await fetch(`${API_BASE}/api/parse-resume`, {
          method: "POST",
          body: form,
        });

        if (!res.ok) throw new Error("Resume parsing failed");
        const parsed: ParsedResume = await res.json();
        setParsedResume(parsed);
        setProfileText(parsed.rawText);
      }

      router.push("/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setParsing(false);
    }
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <Nav />

      <main className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <div className="py-16 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-dim)" }}>
            Step 1 of 6
          </p>
          <h1
            className="text-4xl font-bold tracking-tight mb-3"
            style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}
          >
            Tell us about yourself
          </h1>
          <p className="text-base mb-10" style={{ color: "var(--text-muted)" }}>
            Upload your resume or paste your background. We&apos;ll extract your skills automatically.
          </p>

          {/* File upload */}
          <div className="flex flex-col gap-2 mb-6">
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
              Resume (PDF or DOCX)
            </span>
            <div
              className="rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer"
              style={{ border: "2px dashed var(--border)", backgroundColor: "var(--bg-elev)" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <span className="text-sm font-mono" style={{ color: "var(--accent)" }}>{file.name}</span>
              ) : (
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Click to upload PDF or DOCX
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
            <span className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>or paste text</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
          </div>

          {/* Profile text */}
          <div className="flex flex-col gap-2 mb-6">
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
              Profile / Resume Text
            </span>
            <textarea
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              placeholder="Paste your resume text, LinkedIn summary, or skills here..."
              rows={8}
              className="w-full rounded-xl p-4 text-sm resize-y"
              style={{
                backgroundColor: "var(--bg-elev)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>

          {/* LinkedIn URL */}
          <div className="flex flex-col gap-2 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
              LinkedIn URL (optional)
            </span>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "var(--bg-elev)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p className="mb-4 text-sm" style={{ color: "#ef4444" }}>{error}</p>
          )}

          <Button size="lg" onClick={handleContinue} disabled={parsing}>
            {parsing ? "Parsing resume..." : "Continue →"}
          </Button>
        </div>
      </main>
    </div>
  );
}
