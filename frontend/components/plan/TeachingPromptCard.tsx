"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/lib/context";
import { generateTeachingPrompt } from "@/lib/generateTeachingPrompt";
import { launchWithPrompt, type AITarget } from "@/lib/launchAI";

const OpenAiIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 1.7l1.4 2.1 2.4-.7-.7 2.4L13.3 7 11 8.4l.7 2.4-2.4-.7L8 12.3 6.6 10.1l-2.4.7.7-2.4L2.7 7l2.2-1.4-.7-2.4 2.4.7L8 1.7Z"
      fill="currentColor"
      opacity="0.95"
    />
  </svg>
);

const ClaudeIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 2l5.2 12H11l-1.2-2.9H6.2L5 14H2.8L8 2Zm.9 6.3L8 5.9 7.1 8.3h1.8Z"
      fill="currentColor"
    />
  </svg>
);

const GeminiIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 1.8l1.1 3.4 3.5 1.1-3.5 1.1L8 10.8 6.9 7.4 3.4 6.3l3.5-1.1L8 1.8Z"
      fill="currentColor"
      opacity="0.95"
    />
  </svg>
);

function useFlashState(ms = 2000) {
  const [state, setState] = useState<"idle" | "opening" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function run(fn: () => Promise<{ success: boolean; message?: string }>, openingLabel = true) {
    setMessage(null);
    setState(openingLabel ? "opening" : "idle");
    const res = await fn();
    setState(res.success ? "success" : "error");
    setMessage(res.message ?? null);
    window.setTimeout(() => {
      setState("idle");
      setMessage(null);
    }, ms);
  }

  return { state, message, run };
}

export function TeachingPromptCard(props: {
  taskTitle: string;
  taskDescription: string;
  skill: string;
  dayNumber: number;
  totalDays: number;
}) {
  const { difficulty, selectedJobs, parsedResume } = useAppContext();
  const [open, setOpen] = useState(false);

  const targetRole = selectedJobs[0]?.title ?? "Software Engineer";
  const targetCompanies = selectedJobs.map((j) => j.company).filter(Boolean);
  const userBackground =
    (parsedResume as any)?.skills?.slice?.(0, 4)?.join?.(", ") ||
    (parsedResume as any)?.currentRole ||
    "a self-taught developer";

  const prompt = useMemo(() => {
    try {
      const p = generateTeachingPrompt({
        taskTitle: props.taskTitle,
        taskDescription: props.taskDescription,
        skill: props.skill,
        difficulty,
        targetRole,
        targetCompanies,
        dayNumber: props.dayNumber,
        totalDays: props.totalDays,
        userBackground,
      });
      if (typeof p === "string" && p.trim()) return p;
    } catch {
      /* ignore */
    }
    return `Teach me ${props.taskTitle} step by step. I am a ${difficulty} level developer. Include examples, a mini project, and quiz me at the end.`;
  }, [
    difficulty,
    props.dayNumber,
    props.skill,
    props.taskDescription,
    props.taskTitle,
    props.totalDays,
    targetCompanies,
    targetRole,
    userBackground,
  ]);

  const chatgpt = useFlashState();
  const claude = useFlashState();
  const gemini = useFlashState();
  const copy = useFlashState();

  const btnBase =
    "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all select-none";

  async function openTarget(target: Exclude<AITarget, "copy">) {
    const hook = target === "chatgpt" ? chatgpt : target === "claude" ? claude : gemini;
    await hook.run(() => launchWithPrompt(prompt, target));
  }

  async function doCopy() {
    await copy.run(() => launchWithPrompt(prompt, "copy"), false);
  }

  return (
    <div
      className="mt-3 overflow-hidden rounded-xl border"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--bg) 85%, var(--bg-elev))",
      }}
    >
      <motion.button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
        whileHover={{ filter: "brightness(1.05)" }}
        whileTap={{ scale: 0.995 }}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <span aria-hidden="true">✨</span>
          <span className="text-sm">Learn this with AI</span>
        </div>
        <span className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>
          {open ? "▲" : "▼"}
        </span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="px-4 pb-4 pt-3">
              <p
                className="mb-2 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "var(--text-dim)" }}
              >
                Your personalized teaching prompt
              </p>
              <div
                className="rounded-lg border p-3 font-mono text-xs leading-relaxed"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg)",
                  color: "var(--text-muted)",
                  maxHeight: 160,
                  overflowY: "auto",
                  userSelect: "text",
                  boxShadow: "inset 0 -18px 18px -18px rgba(0,0,0,0.35)",
                }}
              >
                {prompt}
              </div>

              <div className="mt-3 flex flex-col gap-2 md:flex-row">
                <motion.button
                  type="button"
                  className={btnBase}
                  style={{ background: "#10A37F", color: "#fff" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openTarget("chatgpt")}
                >
                  <span className="inline-flex items-center gap-2">
                    <span style={{ color: "#fff" }}>{OpenAiIcon}</span>
                    {chatgpt.state === "opening" ? "Opening... ↗" : "Open in ChatGPT"}
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  className={btnBase}
                  style={{ background: "#D97757", color: "#fff" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openTarget("claude")}
                >
                  <span className="inline-flex items-center gap-2">
                    <span style={{ color: "#fff" }}>{ClaudeIcon}</span>
                    {claude.state === "opening" ? "Opening... ↗" : "Open in Claude"}
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  className={btnBase}
                  style={{ background: "#1B72E8", color: "#fff" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openTarget("gemini")}
                >
                  <span className="inline-flex items-center gap-2">
                    <span style={{ color: "#fff" }}>{GeminiIcon}</span>
                    {gemini.state === "opening" ? "Opening... ↗" : "Open in Gemini"}
                  </span>
                </motion.button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <motion.button
                  type="button"
                  className="rounded-lg border px-3 py-2 text-xs font-mono transition-all"
                  style={{
                    borderColor:
                      copy.state === "success"
                        ? "rgba(34,197,94,0.45)"
                        : "var(--border-strong)",
                    color:
                      copy.state === "success" ? "#86efac" : "var(--text-muted)",
                    background: "transparent",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={doCopy}
                >
                  {copy.state === "success" ? "✓ Copied" : "📋 Copy Prompt"}
                </motion.button>

                <button
                  type="button"
                  className="text-xs italic underline-offset-2 hover:underline"
                  style={{ color: "var(--text-dim)" }}
                  onClick={() => setOpen(false)}
                >
                  Hide prompt ↑
                </button>
              </div>

              {(copy.message || chatgpt.message || claude.message || gemini.message) && (
                <p className="mt-2 text-xs" style={{ color: "var(--text-dim)" }}>
                  {copy.message || chatgpt.message || claude.message || gemini.message}
                </p>
              )}

              <p className="mt-3 text-xs italic" style={{ color: "var(--text-dim)" }}>
                💡 Tip: Paste your answers back here and ask the AI to grade them against the quiz.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

