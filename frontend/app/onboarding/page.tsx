"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { API_BASE } from "@/lib/api";
import type { ParsedResume } from "@/lib/types";
import dynamic from "next/dynamic";
const FilePreview = dynamic(() => import("@/components/onboarding/FilePreview").then(mod => mod.FilePreview), { ssr: false });
import { ParsedDataEditor } from "@/components/onboarding/ParsedDataEditor";
import { Sparkles, FileText, Upload, Eye, X, CheckCircle } from "lucide-react";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";

export default function OnboardingPage() {
  const router = useRouter();
  const { setParsedResume, setProfileText, profileText } = useAppContext();

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [localParsedData, setLocalParsedData] = useState<ParsedResume | null>(null);
  const [pdfDrawerOpen, setPdfDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-parse when file is selected
  useEffect(() => {
    if (file) {
      handleParse(file, linkedinUrl);
    }
  }, [file]);

  async function handleParse(selectedFile: File | null, url: string) {
    if (!profileText.trim() && !selectedFile) return;

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

  function handleContinue() {
    if (!profileText.trim() && !file && !localParsedData) {
      setError("Paste your profile text or upload a resume.");
      return;
    }
    if (localParsedData) {
      setParsedResume(localParsedData);
      setProfileText(localParsedData.rawText);
    }
    router.push("/jobs");
  }

  /* ─── MODE: Review (post-parse) ─── */
  if (localParsedData && !parsing) {
    return (
      <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--bg)" }}>
        <Nav />

        {/* Contextual top bar */}
        <div className="border-b px-8 py-3 flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elev)" }}>
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <OnboardingStepper currentStep={1} />
          </div>
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                {file?.name}
              </span>
            </div>
            <button
              onClick={() => setPdfDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <Eye size={15} />
              View Original
            </button>
            <button
              onClick={() => {
                setLocalParsedData(null);
                setFile(null);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <Upload size={15} />
              Re-upload
            </button>
          </div>
        </div>

        {/* Full-width review area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-10 pb-32">
            <div className="w-full max-w-xl mb-12 mx-auto">
              <OnboardingStepper currentStep={1} />
            </div>
            <div className="mb-8">
              <h1
                className="text-3xl font-bold tracking-tight mb-2"
                style={{ color: "var(--heading)", fontFamily: "var(--font-manrope)", letterSpacing: "-0.03em" }}
              >
                Review your background
              </h1>
              <p className="text-base" style={{ color: "var(--text-muted)" }}>
                We extracted the following from your resume. Edit anything that looks off.
              </p>
            </div>

            <ParsedDataEditor data={localParsedData} onChange={setLocalParsedData} />
          </div>
        </div>

        {/* Sticky footer CTA */}
        <div className="border-t px-8 py-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {localParsedData.skills.length} skills · {localParsedData.experience?.length || 0} roles · {localParsedData.education?.length || 0} degrees
            </p>
            <Button size="lg" onClick={handleContinue}>
              Confirm & Continue →
            </Button>
          </div>
        </div>

        {/* PDF Slide-over drawer */}
        {pdfDrawerOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setPdfDrawerOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-[480px] max-w-[90vw] bg-white z-50 shadow-2xl flex flex-col border-l" style={{ borderColor: "var(--border)" }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-500" />
                  <span className="text-sm font-semibold" style={{ color: "var(--heading)" }}>
                    {file?.name}
                  </span>
                </div>
                <button
                  onClick={() => setPdfDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto bg-gray-50">
                {file && <FilePreview file={file} />}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ─── MODE: Upload (pre-parse) ─── */
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Nav />

      <main className="flex-1 flex overflow-hidden">
        {/* Left: Upload form */}
        <div className="w-full lg:w-[45%] flex flex-col p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-md mx-auto w-full flex flex-col flex-1">
            <div className="w-full max-w-xl mb-12 mx-auto">
              <OnboardingStepper currentStep={1} />
            </div>
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
                className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer text-center group hover:border-gray-400 transition-colors"
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
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-500" />
                    <span className="text-sm font-mono font-medium" style={{ color: "var(--accent)" }}>{file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                    <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                      Drop your resume here or click to browse
                    </span>
                    <span className="text-xs text-gray-400">PDF or DOCX, up to 10MB</span>
                  </div>
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
                className="w-full rounded-xl p-4 text-sm resize-y focus:ring-2 focus:ring-black/10"
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
                className="w-full rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black/10"
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
        </div>

        {/* Right: Live preview */}
        <div className="hidden lg:flex flex-1 flex-col p-8 overflow-hidden bg-gray-50/50">
          <div className="w-full h-full rounded-2xl border flex flex-col overflow-hidden shadow-sm bg-white" style={{ borderColor: "var(--border)" }}>
            {parsing ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-[var(--accent)] rounded-full animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto text-[var(--accent)] animate-pulse" size={20} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--heading)" }}>Extracting your background...</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Scanning timeline and identifying key skills</p>
              </div>
            ) : file ? (
              <>
                <div className="p-6 pb-0 flex justify-between items-center">
                  <h2 className="text-lg font-bold" style={{ color: "var(--heading)" }}>Resume Preview</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <FilePreview file={file} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gray-50 border border-gray-100">
                  <FileText size={28} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--heading)" }}>No file selected</h3>
                <p className="text-sm max-w-sm text-gray-500">
                  Upload a resume on the left to see a live preview and extract your skills automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
