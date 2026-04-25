"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import {
  generateLinkedInPlanPost,
  getPlanShareData,
} from "@/lib/sharePlan";

const LinkedInIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

function renderHashtags(text: string, color: string) {
  return text.split(/(\s+)/).map((tok, i) => {
    if (tok.startsWith("#") && tok.length > 1) {
      return (
        <span key={i} style={{ color }}>
          {tok}
        </span>
      );
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

  const [linkedInOpened, setLinkedInOpened] = useState(false);
  const [linkedInCopied, setLinkedInCopied] = useState(false);
  const [linkedInToastVisible, setLinkedInToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const topicsEmpty = shareData.topics.length === 0;

  useEffect(() => {
    setLinkedInText(generateLinkedInPlanPost(shareData));
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

  function toast(message: string) {
    setToastMsg(message);
    setLinkedInToastVisible(true);
    window.setTimeout(() => setLinkedInToastVisible(false), 6000);
  }

  function openOrWarn(url: string) {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) toast("Please allow popups, or copy the text above");
  }

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
              📣 Share your learning plan
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Show your network what you're committing to
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: "#1b1f23", borderColor: "rgba(255,255,255,0.14)" }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="flex size-12 items-center justify-center rounded-full"
              style={{ background: "#1e3a8a", color: "#fff", fontWeight: 700 }}
            >
              U
            </div>
            <div className="flex flex-col gap-0.5 leading-tight">
              <div className="flex items-center gap-2">
                <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>You</span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px]"
                  style={{ border: "1px solid rgba(255,255,255,0.18)", color: "#9ca3af" }}
                >
                  1st
                </span>
              </div>
              <span style={{ color: "#9ca3af", fontSize: 13 }}>
                {shareData.targetRole} candidate • Building in public
              </span>
            </div>
          </div>
          <div style={{ color: "#0A66C2" }}>{LinkedInIcon}</div>
        </div>

        <div className="relative">
          <div
            style={{
              color: "#fff",
              fontSize: 14,
              lineHeight: 1.55,
              whiteSpace: "pre-wrap",
              maxHeight: expanded ? "none" : 280,
              overflow: expanded ? "visible" : "hidden",
            }}
          >
            {topicsEmpty ? (
              <span style={{ color: "#9ca3af" }}>Your plan topics will appear here</span>
            ) : (
              renderHashtags(linkedInText, "#0A66C2")
            )}
          </div>
          {!expanded && !topicsEmpty && (
            <>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                style={{
                  background: "linear-gradient(to bottom, rgba(27,31,35,0), rgba(27,31,35,1))",
                }}
              />
              <button
                type="button"
                className="absolute bottom-2 right-1 text-xs font-medium"
                style={{ color: "#0A66C2" }}
                onClick={() => setExpanded(true)}
              >
                ...see more
              </button>
            </>
          )}
          {expanded && !topicsEmpty && (
            <button
              type="button"
              className="mt-2 text-xs font-medium"
              style={{ color: "#0A66C2" }}
              onClick={() => setExpanded(false)}
            >
              see less
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm" style={{ color: "#6b7280" }}>
          <span>👍 ❤️ 💡 Be the first to react</span>
          <span>0 comments • 0 reposts</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <motion.button
          type="button"
          disabled={topicsEmpty}
          className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-base font-semibold"
          style={{
            background: "#0A66C2",
            color: "#fff",
            opacity: topicsEmpty ? 0.6 : 1,
          }}
          whileHover={topicsEmpty ? {} : { scale: 1.02 }}
          whileTap={topicsEmpty ? {} : { scale: 0.97 }}
          onClick={async () => {
            await safeCopy(linkedInText);
            openOrWarn("https://www.linkedin.com/feed/");
            setLinkedInToastVisible(true);
            window.setTimeout(() => setLinkedInToastVisible(false), 6000);
            setLinkedInOpened(true);
            window.setTimeout(() => setLinkedInOpened(false), 2000);
          }}
        >
          <span className="inline-flex items-center gap-2">
            {LinkedInIcon}
            {linkedInOpened ? "Opening LinkedIn... ↗" : "Share on LinkedIn"}
          </span>
        </motion.button>
      </div>

      {/* Copy row */}
      <div className="flex flex-col gap-2">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Or copy the text:
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="sm"
            disabled={topicsEmpty}
            onClick={async () => {
              const ok = await safeCopy(linkedInText);
              if (!ok) toast("Select and copy the text above");
              setLinkedInCopied(true);
              window.setTimeout(() => setLinkedInCopied(false), 2000);
            }}
          >
            {linkedInCopied ? "✓ Copied!" : "Copy LinkedIn post"}
          </Button>
        </div>
        <p className="text-xs italic" style={{ color: "var(--text-dim)" }}>
          Nothing posts automatically. Opens the platform in a new tab with your text ready.
        </p>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {linkedInToastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2"
          >
            <div
              className="flex items-center justify-between gap-3 rounded-xl px-5 py-3 shadow-lg"
              style={{ background: "#0A66C2", color: "#fff" }}
            >
              <div className="flex items-center gap-3 text-sm">
                <span aria-hidden="true">📋</span>
                <span>
                  {toastMsg ?? "Post text copied! Just paste it into LinkedIn (Ctrl+V or ⌘V)"}
                </span>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm"
                style={{ opacity: 0.9 }}
                onClick={() => setLinkedInToastVisible(false)}
                aria-label="Close toast"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

