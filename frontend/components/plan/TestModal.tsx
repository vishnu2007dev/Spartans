"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  buildStyles,
  CircularProgressbar,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Loader2, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context";
import { useTaskTest, type StartTestInput, type VoiceGradeEntry } from "@/hooks/useTaskTest";
import type { TaskTest, TaskTestResult } from "@/lib/types";

const ringStyles = buildStyles({
  pathColor: "var(--accent)",
  trailColor: "rgba(255,255,255,0.08)",
  textColor: "var(--heading)",
});

interface TestModalProps {
  open: boolean;
  payload: StartTestInput | null;
  onClose: () => void;
}

export function TestModal({ open, payload, onClose }: TestModalProps) {
  const { setPlanProgress } = useAppContext();
  const t = useTaskTest(setPlanProgress);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(90);

  useEffect(() => {
    if (!open) {
      t.reset();
      setTypedAnswer("");
      setCriteriaOpen(false);
      setSampleOpen(false);
      return;
    }
    if (payload) void t.startTest(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset/start tied to open + task only
  }, [open, payload?.taskId]);

  useEffect(() => {
    if (t.phase === "voice") {
      setVoiceSeconds(90);
      setCriteriaOpen(false);
      setSampleOpen(false);
      setTypedAnswer("");
    }
  }, [t.phase, t.currentVoiceIndex]);

  useEffect(() => {
    if (!t.isRecording || t.phase !== "voice") return;
    const id = window.setInterval(() => {
      setVoiceSeconds((s) => {
        if (s <= 1) {
          t.stopRecording();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [t.isRecording, t.phase, t.stopRecording]);

  const handleClose = () => {
    t.reset();
    onClose();
  };

  const lastGrade = t.voiceGrades[t.voiceGrades.length - 1];
  const vq = t.test?.voiceQuestions[t.currentVoiceIndex];

  const scrollToTask = () => {
    const id = t.test?.taskId;
    if (!id) return;
    document.getElementById(`plan-task-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleStudyFirst = () => {
    t.computeResult();
    scrollToTask();
    handleClose();
  };

  const handleMarkComplete = () => {
    t.computeResult();
    handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            backgroundColor: "color-mix(in srgb, var(--bg) 92%, transparent)",
            backdropFilter: "blur(8px)",
          }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 z-[60] rounded-full p-2"
            style={{ color: "var(--text-dim)" }}
            onClick={handleClose}
          >
            <X className="size-5" />
          </button>

          <div className="flex flex-1 flex-col overflow-y-auto px-4 py-14 sm:px-8">
            {t.phase === "loading" && (
              <motion.div
                className="flex flex-1 flex-col items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  <Loader2 className="size-10 animate-spin" style={{ color: "var(--accent)" }} />
                </motion.div>
                <p className="text-lg" style={{ color: "var(--text-muted)" }}>
                  Generating your test...
                </p>
              </motion.div>
            )}

            {t.error && t.phase === "idle" && (
              <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
                <p style={{ color: "#f87171" }}>{t.error}</p>
                <Button variant="outline" onClick={() => payload && void t.startTest(payload)}>
                  Try again
                </Button>
              </div>
            )}

            {t.phase === "mcq" && t.test && (
              <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
              >
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                    Question {t.currentMCQIndex + 1} of 3 — Concept Check
                  </p>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor:
                            i < t.currentMCQIndex
                              ? "var(--accent)"
                              : i === t.currentMCQIndex
                                ? "color-mix(in srgb, var(--accent) 55%, transparent)"
                                : "var(--border)",
                          boxShadow:
                            i === t.currentMCQIndex && t.mcqPendingOption == null && !t.mcqReveal
                              ? "0 0 0 2px color-mix(in srgb, var(--accent) 40%, transparent)"
                              : undefined,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <h2 className="text-xl font-semibold leading-snug sm:text-2xl" style={{ color: "var(--heading)" }}>
                  {t.test.mcqQuestions[t.currentMCQIndex]?.question}
                </h2>

                <div className="flex flex-col gap-2">
                  {t.test.mcqQuestions[t.currentMCQIndex]?.options.map((opt, idx) => {
                    const correct = t.test!.mcqQuestions[t.currentMCQIndex].correctIndex === idx;
                    const selected = t.mcqPendingOption === idx;
                    const show = t.mcqReveal;
                    let border = "1px solid var(--border)";
                    let bg = "transparent";
                    if (show && correct) {
                      border = "1px solid #22c55e";
                      bg = "rgba(34,197,94,0.12)";
                    } else if (show && selected && !correct) {
                      border = "1px solid #ef4444";
                      bg = "rgba(239,68,68,0.1)";
                    } else if (selected && !show) {
                      border = "1px solid #60a5fa";
                      bg = "rgba(96,165,250,0.12)";
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={t.mcqPendingOption != null && !show}
                        className="rounded-xl px-4 py-3 text-left text-sm transition-all sm:text-base"
                        style={{ border, backgroundColor: bg, color: "var(--text)" }}
                        onClick={() => t.answerMCQ(idx)}
                      >
                        <span className="mr-2 font-mono text-xs opacity-70">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                        {show && correct && <span className="ml-2 text-green-400">✓</span>}
                        {show && selected && !correct && <span className="ml-2 text-red-400">✗</span>}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {t.mcqReveal && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border p-3 text-sm"
                      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                      {t.test.mcqQuestions[t.currentMCQIndex]?.explanation}
                    </motion.p>
                  )}
                </AnimatePresence>

                <p className="mt-auto text-center font-mono text-xs" style={{ color: "var(--text-dim)" }}>
                  MCQ {t.currentMCQIndex + 1}/3 complete
                </p>
              </motion.div>
            )}

            {t.phase === "interstitial" && (
              <motion.div
                key="interstitial"
                className="flex flex-1 flex-col items-center justify-center px-4 text-center"
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
              >
                <p className="max-w-md text-lg sm:text-xl" style={{ color: "var(--heading)" }}>
                  Great! Now for 2 interview-style questions. Speak your answers.
                </p>
              </motion.div>
            )}

            {t.phase === "voice" && t.test && vq && (
              <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5"
                initial={{ x: 48, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
                    Interview Question {t.currentVoiceIndex + 1} of 2
                  </p>
                  <span
                    className="rounded px-2 py-0.5 font-mono text-[10px] uppercase"
                    style={{
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                      border: "1px solid var(--accent)",
                    }}
                  >
                    {vq.type === "scenario" ? "Scenario" : "Interview style"}
                  </span>
                </div>

                <h2 className="text-xl font-semibold leading-snug sm:text-2xl" style={{ color: "var(--heading)" }}>
                  {vq.question}
                </h2>

                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                  onClick={() => setCriteriaOpen((o) => !o)}
                >
                  Evaluation criteria
                  <span className="font-mono text-xs">{criteriaOpen ? "−" : "+"}</span>
                </button>
                <AnimatePresence>
                  {criteriaOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="list-disc space-y-1 pl-5 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {vq.evaluationCriteria.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <div className="relative mx-auto flex flex-col items-center gap-3 py-4">
                  {t.isSpeechSupported ? (
                    <>
                      <motion.button
                        type="button"
                        className="relative flex size-20 items-center justify-center rounded-full sm:size-[80px]"
                        style={{
                          backgroundColor: t.isRecording ? "#ef4444" : "var(--bg-elev)",
                          border: `2px solid ${t.isRecording ? "#ef4444" : "var(--border-strong)"}`,
                          color: t.isRecording ? "#fff" : "var(--text-muted)",
                        }}
                        onPointerDown={t.startRecording}
                        onPointerUp={t.stopRecording}
                        animate={t.isRecording ? { scale: [1, 1.06, 1] } : {}}
                        transition={{ repeat: t.isRecording ? Infinity : 0, duration: 1.2 }}
                      >
                        <Mic className="size-8" />
                      </motion.button>
                      <p className="text-center text-sm" style={{ color: "var(--text-dim)" }}>
                        {t.gradingBusy
                          ? "Grading..."
                          : t.isRecording
                            ? "Release to send"
                            : "Hold to speak"}
                      </p>
                    </>
                  ) : (
                    <div className="flex w-full flex-col gap-2">
                      <textarea
                        className="min-h-[120px] w-full rounded-lg border p-3 font-mono text-sm"
                        style={{
                          borderColor: "var(--border)",
                          background: "var(--bg-elev)",
                          color: "var(--text)",
                        }}
                        placeholder="Type your answer here..."
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                      />
                      <Button
                        className="self-end"
                        onClick={() => {
                          t.submitTypedVoiceAnswer(typedAnswer);
                          setTypedAnswer("");
                        }}
                      >
                        Submit answer
                      </Button>
                    </div>
                  )}

                  <p className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>
                    {t.isRecording ? `${voiceSeconds}s` : t.isSpeechSupported ? "Up to 90s per question" : ""}
                  </p>
                </div>

                <div
                  className="min-h-[100px] max-h-40 overflow-y-auto rounded-lg border p-3 font-mono text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  {t.transcript || (
                    <span style={{ color: "var(--text-dim)" }}>
                      Your answer will appear here as you speak...
                    </span>
                  )}
                </div>

                {t.voiceEmptyWarning && (
                  <p className="text-center text-sm" style={{ color: "#fbbf24" }}>
                    We didn&apos;t catch that — try again or skip.
                  </p>
                )}

                <button
                  type="button"
                  className="ml-auto text-xs underline-offset-2 hover:underline"
                  style={{ color: "var(--text-dim)" }}
                  onClick={() => t.skipVoiceQuestion()}
                >
                  Skip this question →
                </button>
              </motion.div>
            )}

            {t.phase === "grading" && t.gradingBusy && (
              <div className="flex flex-col items-center justify-center gap-4 py-20">
                <Loader2 className="size-12 animate-spin" style={{ color: "var(--accent)" }} />
                <p style={{ color: "var(--text-muted)" }}>Grading...</p>
              </div>
            )}

            {t.phase === "grading" && !t.gradingBusy && lastGrade && (
              <motion.div
                className="mx-auto flex w-full max-w-lg flex-col items-center gap-5 py-6"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="size-36 sm:size-44">
                  <CircularProgressbar
                    value={(lastGrade.score / 5) * 100}
                    text={`${lastGrade.score}/5`}
                    styles={ringStyles}
                  />
                </div>
                <p className="text-center text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
                  {lastGrade.feedback}
                </p>
                {lastGrade.highlights.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {lastGrade.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="rounded-full px-3 py-1 text-xs"
                        style={{ background: "rgba(34,197,94,0.15)", color: "#86efac" }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                  onClick={() => setSampleOpen((o) => !o)}
                >
                  Sample answer
                  <span className="font-mono text-xs">{sampleOpen ? "−" : "+"}</span>
                </button>
                {sampleOpen && t.test && (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {t.test.voiceQuestions.find((q) => q.id === lastGrade.questionId)?.sampleAnswer}
                  </p>
                )}

                <Button size="lg" className="mt-4 w-full sm:w-auto" onClick={() => t.goToNextAfterGrading()}>
                  {t.voiceGrades.length >= 2 ? "See Results →" : "Next Question →"}
                </Button>
              </motion.div>
            )}

            {t.phase === "results" && t.result && t.test && (
              <ResultsView
                result={t.result}
                test={t.test}
                mcqSelections={t.mcqSelections}
                voiceGrades={t.voiceGrades}
                onMarkComplete={handleMarkComplete}
                onStudyFirst={handleStudyFirst}
                onRetake={() => t.retakeTest()}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResultsView({
  result,
  test,
  mcqSelections,
  voiceGrades,
  onMarkComplete,
  onStudyFirst,
  onRetake,
}: {
  result: TaskTestResult;
  test: TaskTest;
  mcqSelections: (number | null)[];
  voiceGrades: VoiceGradeEntry[];
  onMarkComplete: () => void;
  onStudyFirst: () => void;
  onRetake: () => void;
}) {
  return (
    <motion.div
      className="mx-auto flex w-full max-w-xl flex-col gap-6 pb-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-8">
        <div className="size-40 shrink-0 sm:size-48">
          <CircularProgressbar
            value={result.overallScore}
            text={`${result.overallScore}`}
            styles={buildStyles({
              pathColor: result.passed ? "var(--accent)" : "#fbbf24",
              trailColor: "rgba(255,255,255,0.08)",
              textColor: "var(--heading)",
            })}
          />
        </div>
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <p className="text-2xl font-bold" style={{ color: "var(--heading)" }}>
            {result.passed ? "✅ Passed" : "❌ Not quite"}
          </p>
          <p style={{ color: "var(--text-muted)" }}>
            {result.passed
              ? `You've got a solid grasp of ${result.skill}`
              : "Review this topic and try again"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
          Concept checks
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {result.mcqScore}/3 concept questions correct
        </p>
        <div className="mt-2 flex gap-2">
          {[0, 1, 2].map((i) => {
            const mq = test.mcqQuestions[i];
            const ok =
              mcqSelections[i] != null && mq && mcqSelections[i] === mq.correctIndex;
            return (
              <span
                key={i}
                className="size-3 rounded-full"
                style={{ backgroundColor: ok ? "#22c55e" : "#ef4444" }}
              />
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
        <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
          Voice responses
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {result.voiceScores.map((vs) => (
            <div key={vs.questionId} className="text-sm" style={{ color: "var(--text-muted)" }}>
              <span className="font-mono" style={{ color: "var(--accent)" }}>
                {vs.score}/5
              </span>{" "}
              — {vs.feedback}
            </div>
          ))}
        </div>
      </div>

      {!result.passed && (
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
          <p className="font-semibold" style={{ color: "#fbbf24" }}>
            Things to review:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            {[0, 1, 2].map((i) => {
              const q = test.mcqQuestions[i];
              const wrong = mcqSelections[i] == null || mcqSelections[i] !== q.correctIndex;
              return wrong ? <li key={i}>{q.explanation}</li> : null;
            })}
            {voiceGrades
              .filter((g) => g.score < 3)
              .map((g) => (
                <li key={g.questionId}>{g.feedback}</li>
              ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {result.passed ? (
          <Button variant="accent" size="lg" onClick={onMarkComplete}>
            Mark as Complete ✓
          </Button>
        ) : (
          <>
            <Button variant="outline" size="lg" onClick={onRetake}>
              Retake Test
            </Button>
            <Button variant="ghost" size="lg" onClick={onStudyFirst}>
              Study First
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
