"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { ParsedResume } from "@/lib/types";
import { FilePreview } from "@/components/onboarding/FilePreview";
import { ParsedDataEditor } from "@/components/onboarding/ParsedDataEditor";

export default function OnboardingPage() {
  const router = useRouter();
  const { setParsedResume, setProfileText, profileText } = useAppContext();

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [localParsedData, setLocalParsedData] = useState<ParsedResume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-parse when file is selected
  useEffect(() => {
    if (file) {
      handleParse(file, linkedinUrl);
    }
  }, [file]);

  async function handleParse(selectedFile: File | null, url: string) {
    if (!profileText.trim() && !selectedFile) {
      return;
    }

    setError("");
    setParsing(true);
    setLocalParsedData(null);

    try {
      if (selectedFile) {
        const form = new FormData();
        form.append("resume", selectedFile);
        if (url.trim()) form.append("linkedinUrl", url.trim());

        const res = await fetch(`${API_BASE}/api/parse-resume`, {
          method: "POST",
          body: form,
        });

        if (!res.ok) throw new Error("Resume parsing failed");
        const parsed: ParsedResume = await res.json();
        setLocalParsedData(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setParsing(false);
    }
  }

  async function handleContinue() {
    if (!profileText.trim() && !file && !localParsedData) {
      setError("Paste your profile text or upload a resume.");
      return;
    }

    // Save local edits to global context
    if (localParsedData) {
      setParsedResume(localParsedData);
      setProfileText(localParsedData.rawText);
    }

    router.push("/jobs");
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Nav />

      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Form */}
        <div className="w-full lg:w-1/3 flex flex-col p-8 overflow-y-auto border-r" style={{ borderColor: "var(--border)" }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-dim)" }}>
            Step 1 of 6
          </p>
          <h1
            className="text-3xl font-bold tracking-tight mb-3"
            style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}
          >
            Tell us about yourself
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Upload your resume or paste your background. We&apos;ll extract your skills automatically.
          </p>

          {/* File upload */}
          <div className="flex flex-col gap-2 mb-6">
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
              Resume (PDF or DOCX)
            </span>
            <div
              className="rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer text-center"
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
                <span className="text-sm font-mono font-medium" style={{ color: "var(--accent)" }}>{file.name}</span>
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
              rows={6}
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

          <div className="mt-auto pt-4">
            <Button className="w-full" size="lg" onClick={handleContinue} disabled={parsing}>
              {parsing ? "Parsing resume..." : "Continue →"}
            </Button>
          </div>
        </div>

        {/* Right Pane: Preview & Editor */}
        <div className="hidden lg:flex flex-1 flex-col p-8 overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
          <div className="w-full h-full flex gap-4 overflow-hidden">
            {parsing ? (
              <div className="w-full h-full rounded-2xl border flex flex-col items-center justify-center shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elev)" }}>
                <div className="w-8 h-8 border-4 border-t-[var(--accent)] border-gray-200 rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Analyzing your resume with AI...</p>
              </div>
            ) : localParsedData ? (
              <>
                <div className="flex-1 h-full rounded-2xl border flex flex-col overflow-hidden shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elev)" }}>
                  <div className="p-4 border-b flex justify-between items-center bg-white/50" style={{ borderColor: "var(--border)" }}>
                    <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>Original File</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {file && <FilePreview file={file} />}
                  </div>
                </div>
                <div className="flex-1 h-full rounded-2xl border flex flex-col overflow-hidden shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elev)" }}>
                  <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
                    <h2 className="text-xl font-bold" style={{ color: "var(--heading)" }}>Review Extracted Data</h2>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>We've parsed your resume. Feel free to add or correct any missing skills before continuing.</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <ParsedDataEditor data={localParsedData} onChange={setLocalParsedData} />
                  </div>
                </div>
              </>
            ) : file ? (
              <div className="w-full h-full rounded-2xl border flex flex-col overflow-hidden shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elev)" }}>
                <div className="mb-4 flex justify-between items-center p-8 pb-0">
                  <h2 className="text-lg font-bold" style={{ color: "var(--heading)" }}>Resume Preview</h2>
                  <Button variant="outline" size="sm" onClick={() => handleParse(file, linkedinUrl)}>
                    Parse Now
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 pt-4">
                  <FilePreview file={file} />
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl border flex flex-col items-center justify-center text-center p-8 shadow-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elev)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "var(--bg)" }}>
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: "var(--heading)" }}>No file selected</h3>
                <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
                  Upload a PDF or DOCX file on the left to see a live preview and extract your skills.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
