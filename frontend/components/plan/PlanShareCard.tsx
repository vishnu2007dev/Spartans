"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ClipboardCopy, ExternalLink, Pencil, X } from "lucide-react";
import { useAppContext } from "@/lib/context";
import {
  generateLinkedInPlanPost,
  getPlanShareData,
} from "@/lib/sharePlan";

const LinkedInIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

function renderHashtags(text: string, color: string) {
  return text.split(/(\s+)/).map((tok, i) => {
    if (tok.startsWith("#") && tok.length > 1) {
      return <span key={i} style={{ color }}>{tok}</span>;
    }
    return <span key={i}>{tok}</span>;
  });
}

export function PlanShareCard() {
  const { plan, selectedJobs, chosenSkills, days, difficulty } = useAppContext();

  const shareData = useMemo(
    () => getPlanShareData(plan, selectedJobs, chosenSkills, days, difficulty),
    [plan, selectedJobs, chosenSkills, days, difficulty]
  );

  const [linkedInText, setLinkedInText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkedInOpened, setLinkedInOpened] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const topicsEmpty = shareData.topics.length === 0;
  const displayText = linkedInText;

  useEffect(() => {
    const generated = generateLinkedInPlanPost(shareData);
    setLinkedInText(generated);
    setDraftText(generated);
  }, [shareData]);

  async function safeCopy(text: string): Promise<boolean> {
    try {
      if (!navigator.clipboard?.writeText) return false;
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 5000);
  }

  async function handleCopy() {
    const ok = await safeCopy(displayText);
    if (!ok) { showToast("Select and copy the text manually"); return; }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenLinkedIn() {
    const w = window.open("https://www.linkedin.com/feed/", "_blank", "noopener,noreferrer");
    if (!w) { showToast("Allow popups, then try again"); return; }
    setLinkedInOpened(true);
    window.setTimeout(() => setLinkedInOpened(false), 2000);
    showToast("Post text copied! Paste it into LinkedIn (Ctrl+V or ⌘V)");
    safeCopy(displayText);
  }

  function handleEditDone() {
    setLinkedInText(draftText);
    setEditMode(false);
  }

  function handleEditCancel() {
    setDraftText(linkedInText);
    setEditMode(false);
  }

  return (
    <div className="mt-10 flex flex-col gap-5">
      {/* Section label */}
      <div className="flex flex-col gap-0.5">
        <p className="font-mono text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--text-dim)" }}>
          Share Your Plan
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Show your network what you're committing to
        </p>
      </div>

      {/* Preview card */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "var(--bg)", borderColor: "var(--border)", boxShadow: "0 1px 6px rgba(15,23,42,0.06)" }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{ borderColor: "var(--border)", background: "var(--bg-elev)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--text-dim)" }}>
            Post preview
          </span>
          <div className="flex items-center gap-2">
            {!topicsEmpty && !editMode && (
              <button
                type="button"
                onClick={() => { setDraftText(linkedInText); setEditMode(true); setExpanded(true); }}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-mono font-medium transition-colors hover:bg-[var(--accent-soft)]"
                style={{ color: "var(--text-muted)", border: "1px solid var(--border-strong)" }}
              >
                <Pencil size={10} />
                Edit
              </button>
            )}
            {editMode && (
              <>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-mono font-medium"
                  style={{ color: "var(--text-dim)", border: "1px solid var(--border)" }}
                >
                  <X size={10} /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditDone}
                  className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-mono font-semibold"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  <Check size={10} strokeWidth={3} /> Done
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* LinkedIn profile mock */}
          <div className="mb-3 flex items-start gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-white font-bold"
              style={{ background: "#1e3a8a", fontSize: 15 }}
            >
              U
            </div>
            <div className="flex flex-col gap-0.5 leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm" style={{ color: "var(--heading)" }}>You</span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-mono"
                  style={{ border: "1px solid var(--border-strong)", color: "var(--text-dim)" }}
                >
                  1st
                </span>
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {shareData.targetRole} candidate · Building in public
              </span>
            </div>
            <div className="ml-auto" style={{ color: "#0A66C2" }}>{LinkedInIcon}</div>
          </div>

          {/* Post body */}
          {editMode ? (
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              rows={12}
              className="w-full rounded-lg border p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                background: "var(--bg-elev)",
                borderColor: "var(--border-strong)",
                color: "var(--text)",
              }}
            />
          ) : (
            <div className="relative">
              <div
                style={{
                  color: "var(--text)",
                  fontSize: 13,
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  maxHeight: expanded ? "none" : 200,
                  overflow: expanded ? "visible" : "hidden",
                }}
              >
                {topicsEmpty ? (
                  <span style={{ color: "var(--text-dim)" }}>Your plan topics will appear here…</span>
                ) : (
                  renderHashtags(displayText, "#0A66C2")
                )}
              </div>
              {!expanded && !topicsEmpty && (
                <>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
                    style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
                  />
                  <button
                    type="button"
                    className="absolute bottom-1 right-0 text-xs font-medium"
                    style={{ color: "var(--accent)" }}
                    onClick={() => setExpanded(true)}
                  >
                    …see more
                  </button>
                </>
              )}
              {expanded && !topicsEmpty && (
                <button
                  type="button"
                  className="mt-1 text-xs font-medium"
                  style={{ color: "var(--accent)" }}
                  onClick={() => setExpanded(false)}
                >
                  see less
                </button>
              )}
            </div>
          )}

          {/* Engagement mock */}
          <div
            className="mt-3 flex items-center justify-between text-xs"
            style={{ color: "var(--text-dim)", borderTop: "1px solid var(--border)", paddingTop: 10 }}
          >
            <span>👍 ❤️ 💡 Be the first to react</span>
            <span>0 comments · 0 reposts</span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        {/* Primary: Copy */}
        <motion.button
          type="button"
          disabled={topicsEmpty}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-opacity"
          style={{
            background: "var(--accent)",
            color: "#fff",
            opacity: topicsEmpty ? 0.5 : 1,
          }}
          whileHover={topicsEmpty ? {} : { scale: 1.015 }}
          whileTap={topicsEmpty ? {} : { scale: 0.975 }}
          onClick={handleCopy}
        >
          {copied ? (
            <><Check size={15} strokeWidth={3} /> Copied to clipboard</>
          ) : (
            <><ClipboardCopy size={15} /> Copy post</>
          )}
        </motion.button>

        {/* Secondary: Open LinkedIn */}
        <motion.button
          type="button"
          disabled={topicsEmpty}
          className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-opacity"
          style={{
            borderColor: topicsEmpty ? "var(--border)" : "rgba(10,102,194,0.4)",
            color: topicsEmpty ? "var(--text-dim)" : "#0A66C2",
            background: "transparent",
            opacity: topicsEmpty ? 0.5 : 1,
          }}
          whileHover={topicsEmpty ? {} : { scale: 1.01, backgroundColor: "rgba(10,102,194,0.05)" }}
          whileTap={topicsEmpty ? {} : { scale: 0.98 }}
          onClick={handleOpenLinkedIn}
        >
          <span className="inline-flex items-center gap-2">
            {LinkedInIcon}
            {linkedInOpened ? "Opening…" : "Open LinkedIn"}
            <ExternalLink size={12} />
          </span>
        </motion.button>
      </div>

      <p className="text-[11px] font-mono" style={{ color: "var(--text-dim)" }}>
        Nothing posts automatically — copy the text, then paste it into LinkedIn.
      </p>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2"
          >
            <div
              className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-lg"
              style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", color: "#e5e7eb" }}
            >
              <span className="text-sm">{toast}</span>
              <button
                type="button"
                className="shrink-0 rounded p-1 text-xs opacity-60 hover:opacity-100"
                onClick={() => setToast(null)}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
