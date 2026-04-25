"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, ClipboardCopy, Sparkles } from "lucide-react";
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
    <div className="mt-2 flex flex-col gap-2">
      <motion.button
        type="button"
        className="flex w-full items-center gap-3 py-2 text-left group"
        onClick={() => setOpen((v) => !v)}
      >
        <div 
          className="size-8 rounded-lg flex items-center justify-center transition-colors group-hover:bg-[var(--accent-soft)]"
          style={{ border: "1px solid var(--border)" }}
        >
          <Sparkles size={14} className="text-[var(--accent)]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[var(--heading)]">Open Lab</span>
          <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider">AI Teaching Assistant</span>
        </div>
        <div className="ml-auto text-[var(--text-dim)] transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          <ChevronDown size={14} />
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="pl-11 pr-4 pb-6 pt-2">
              <div
                className="rounded-xl border p-4 font-mono text-xs leading-relaxed mb-4"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-elev)",
                  color: "var(--text-muted)",
                  maxHeight: 160,
                  overflowY: "auto",
                  userSelect: "text",
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)",
                }}
              >
                {prompt}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <motion.button
                  type="button"
                  className={btnBase}
                  style={{ background: "#fff", color: "#10A37F", border: "1.5px solid #10A37F" }}
                  whileHover={{ scale: 1.02, background: "#f0fdf8" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openTarget("chatgpt")}
                >
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <Image src="/chatgpt.png" alt="ChatGPT" width={18} height={18} className="rounded-sm" />
                    {chatgpt.state === "opening" ? "Opening…" : "ChatGPT"}
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  className={btnBase}
                  style={{ background: "#fff", color: "#CC785C", border: "1.5px solid #CC785C" }}
                  whileHover={{ scale: 1.02, background: "#fff8f5" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openTarget("claude")}
                >
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <Image src="/claude.svg" alt="Claude" width={18} height={18} />
                    {claude.state === "opening" ? "Opening…" : "Claude"}
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  className={btnBase}
                  style={{ background: "#fff", color: "#1B72E8", border: "1.5px solid #1B72E8" }}
                  whileHover={{ scale: 1.02, background: "#f0f5ff" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openTarget("gemini")}
                >
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <Image src="/gemini.svg" alt="Gemini" width={18} height={18} />
                    {gemini.state === "opening" ? "Opening…" : "Gemini"}
                  </span>
                </motion.button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={doCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono font-medium transition-all duration-150"
                  style={{
                    borderColor: copy.state === "success" ? "rgba(34,197,94,0.4)" : "var(--border-strong)",
                    color: copy.state === "success" ? "#22c55e" : "var(--text-muted)",
                    backgroundColor: copy.state === "success" ? "rgba(34,197,94,0.06)" : "transparent",
                  }}
                >
                  {copy.state === "success"
                    ? <><Check size={12} strokeWidth={3} /> Copied</>
                    : <><ClipboardCopy size={12} /> Copy prompt</>
                  }
                </button>

                <span className="text-[10px] font-mono" style={{ color: "var(--text-dim)" }}>
                  Opens in a new tab
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

