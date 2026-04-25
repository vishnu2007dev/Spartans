"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateTaskTest, gradeVoiceAnswer } from "@/lib/api";
import type {
  Difficulty,
  PlanProgress,
  TaskTest,
  TaskTestResult,
  VoiceQuestion,
} from "@/lib/types";

export type TestPhase =
  | "idle"
  | "loading"
  | "mcq"
  | "interstitial"
  | "voice"
  | "grading"
  | "results";

export interface VoiceGradeEntry {
  questionId: string;
  score: number;
  feedback: string;
  highlights: string[];
}

export interface StartTestInput {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  skill: string;
  difficulty: Difficulty;
  targetRole: string;
  dayNumber: number;
}

type SpeechRec = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: Event) => void) | null;
  onend: (() => void) | null;
  onerror: ((ev: Event) => void) | null;
};

function getSpeechRecognitionCtor(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function extractTranscriptFromResultEvent(ev: Event): { interim: string; final: string } {
  const e = ev as unknown as {
    resultIndex: number;
    results: { length: number; item: (i: number) => { isFinal: boolean; 0: { transcript: string } } };
  };
  let interim = "";
  let final = "";
  for (let i = e.resultIndex; i < e.results.length; i++) {
    const r = e.results.item(i);
    const t = r[0]?.transcript ?? "";
    if (r.isFinal) final += t;
    else interim += t;
  }
  return { interim, final };
}

function buildTaskTestResult(
  t: TaskTest,
  meta: StartTestInput,
  mcqAnswers: (number | null)[],
  grades: VoiceGradeEntry[]
): TaskTestResult {
  let mcqScore = 0;
  for (let i = 0; i < 3; i++) {
    const sel = mcqAnswers[i];
    if (sel != null && sel === t.mcqQuestions[i]?.correctIndex) mcqScore++;
  }
  const voiceScores = grades.map((g) => ({
    questionId: g.questionId,
    score: g.score,
    feedback: g.feedback,
  }));
  const avgVoice =
    grades.length === 0 ? 0 : grades.reduce((s, g) => s + g.score, 0) / grades.length;
  const overallScore = Math.round((mcqScore / 3) * 50 + (avgVoice / 5) * 50);
  const passed = overallScore >= 60;
  return {
    taskId: meta.taskId,
    taskTitle: t.taskTitle,
    skill: t.skill,
    mcqScore,
    voiceScores,
    overallScore,
    passed,
    completedAt: Date.now(),
  };
}

export function useTaskTest(
  setPlanProgress: React.Dispatch<React.SetStateAction<PlanProgress>>
) {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [test, setTest] = useState<TaskTest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [mcqSelections, setMcqSelections] = useState<(number | null)[]>([null, null, null]);
  const mcqAnswersRef = useRef<(number | null)[]>([null, null, null]);
  const [mcqPendingOption, setMcqPendingOption] = useState<number | null>(null);
  const [mcqReveal, setMcqReveal] = useState(false);

  const [currentVoiceIndex, setCurrentVoiceIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceGrades, setVoiceGrades] = useState<VoiceGradeEntry[]>([]);
  const [gradingBusy, setGradingBusy] = useState(false);
  const [voiceEmptyWarning, setVoiceEmptyWarning] = useState(false);

  const [result, setResult] = useState<TaskTestResult | null>(null);

  const phaseRef = useRef<TestPhase>("idle");
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const sessionRef = useRef<StartTestInput | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const recognitionRef = useRef<SpeechRec | null>(null);
  const transcriptBufferRef = useRef("");
  const finalChunkRef = useRef("");
  const recordingStartedRef = useRef(0);
  const recordTimerRef = useRef<number | null>(null);
  const voiceFinalizeRef = useRef(false);
  const ignoreRecognitionEndRef = useRef(false);
  const userStoppedRef = useRef(false);
  const isRecordingRef = useRef(false);

  const isSpeechSupported = typeof window !== "undefined" && !!getSpeechRecognitionCtor();

  const pushTimeout = (id: number) => {
    timeoutsRef.current.push(id);
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (recordTimerRef.current != null) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  };

  const resetInternal = useCallback(() => {
    clearAllTimeouts();
    voiceFinalizeRef.current = false;
    ignoreRecognitionEndRef.current = false;
    userStoppedRef.current = false;
    isRecordingRef.current = false;
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
    transcriptBufferRef.current = "";
    finalChunkRef.current = "";
    sessionRef.current = null;
    mcqAnswersRef.current = [null, null, null];
    setPhase("idle");
    setTest(null);
    setIsLoading(false);
    setError(null);
    setCurrentMCQIndex(0);
    setMcqSelections([null, null, null]);
    setMcqPendingOption(null);
    setMcqReveal(false);
    setCurrentVoiceIndex(0);
    setTranscript("");
    setIsRecording(false);
    setVoiceGrades([]);
    setGradingBusy(false);
    setVoiceEmptyWarning(false);
    setResult(null);
  }, []);

  const startTest = useCallback(
    async (input: StartTestInput) => {
      resetInternal();
      sessionRef.current = input;
      setPhase("loading");
      setIsLoading(true);
      setError(null);
      try {
        const payload = await generateTaskTest({
          taskTitle: input.taskTitle,
          taskDescription: input.taskDescription,
          skill: input.skill,
          difficulty: input.difficulty,
          targetRole: input.targetRole,
          dayNumber: input.dayNumber,
        });
        const merged: TaskTest = { ...payload, taskId: input.taskId };
        setTest(merged);
        setPhase("mcq");
      } catch {
        setError("Couldn't generate test. Try again.");
        setPhase("idle");
      } finally {
        setIsLoading(false);
      }
    },
    [resetInternal]
  );

  const advanceAfterMCQ = useCallback((chosen: number, index: number) => {
    mcqAnswersRef.current[index] = chosen;
    setMcqSelections([...mcqAnswersRef.current]);
    setMcqPendingOption(null);
    setMcqReveal(false);
    if (index >= 2) {
      setPhase("interstitial");
      const tid = window.setTimeout(() => {
        setPhase("voice");
        setCurrentVoiceIndex(0);
      }, 2000);
      pushTimeout(tid);
    } else {
      setCurrentMCQIndex(index + 1);
    }
  }, []);

  const answerMCQ = useCallback(
    (optionIndex: number) => {
      if (phase !== "mcq" || mcqReveal || mcqPendingOption != null) return;
      setMcqPendingOption(optionIndex);
      const t1 = window.setTimeout(() => setMcqReveal(true), 400);
      pushTimeout(t1);
      const t2 = window.setTimeout(() => {
        advanceAfterMCQ(optionIndex, currentMCQIndex);
      }, 1200);
      pushTimeout(t2);
    },
    [advanceAfterMCQ, currentMCQIndex, mcqPendingOption, mcqReveal, phase]
  );

  const finalizeVoiceAnswer = useCallback(
    async (rawText: string) => {
      if (voiceFinalizeRef.current) return;
      if (phaseRef.current !== "voice") return;
      const meta = sessionRef.current;
      const t = test;
      if (!meta || !t) return;

      const trimmed = rawText.trim();
      if (!trimmed) {
        setVoiceEmptyWarning(true);
        voiceFinalizeRef.current = false;
        return;
      }

      voiceFinalizeRef.current = true;
      setVoiceEmptyWarning(false);
      setIsRecording(false);
      if (recordTimerRef.current != null) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
      setTranscript(trimmed);
      setPhase("grading");
      setGradingBusy(true);

      const q = t.voiceQuestions[currentVoiceIndex] as VoiceQuestion | undefined;
      if (!q) {
        setGradingBusy(false);
        voiceFinalizeRef.current = false;
        return;
      }

      let score = 3;
      let feedback = "Could not grade — counted as partial credit";
      let highlights: string[] = [];
      try {
        const res = await gradeVoiceAnswer({
          question: q.question,
          evaluationCriteria: q.evaluationCriteria,
          userAnswer: trimmed,
          skill: meta.skill,
          difficulty: meta.difficulty,
        });
        score = res.score;
        feedback = res.feedback;
        highlights = score < 2 ? [] : res.highlights ?? [];
      } catch {
        /* defaults */
      }

      setVoiceGrades((prev) => [
        ...prev,
        { questionId: q.id, score, feedback, highlights },
      ]);
      setGradingBusy(false);
      voiceFinalizeRef.current = false;
    },
    [currentVoiceIndex, test]
  );

  const stopRecording = useCallback(() => {
    userStoppedRef.current = true;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
  }, []);

  const startRecording = useCallback(() => {
    if (phase !== "voice" || isRecording) return;
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    setVoiceEmptyWarning(false);
    ignoreRecognitionEndRef.current = false;
    userStoppedRef.current = false;
    voiceFinalizeRef.current = false;
    transcriptBufferRef.current = "";
    finalChunkRef.current = "";
    setTranscript("");
    const rec = new Ctor();
    recognitionRef.current = rec;
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (ev) => {
      const { interim, final } = extractTranscriptFromResultEvent(ev);
      if (final) finalChunkRef.current += final;
      transcriptBufferRef.current = interim;
      setTranscript((finalChunkRef.current + transcriptBufferRef.current).trim());
    };
    rec.onerror = () => {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    };
    rec.onend = () => {
      if (ignoreRecognitionEndRef.current) {
        ignoreRecognitionEndRef.current = false;
        return;
      }

      // If SpeechRecognition ended due to a natural pause while the user is still "recording",
      // restart it instead of auto-submitting.
      if (!userStoppedRef.current && isRecordingRef.current) {
        try {
          rec.start();
          return;
        } catch {
          // fall through to finalize
        }
      }

      recognitionRef.current = null;
      isRecordingRef.current = false;
      setIsRecording(false);
      if (recordTimerRef.current != null) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
      const text = (finalChunkRef.current + transcriptBufferRef.current).trim();
      userStoppedRef.current = false;
      void finalizeVoiceAnswer(text);
    };
    try {
      rec.start();
      setIsRecording(true);
      isRecordingRef.current = true;
      recordingStartedRef.current = Date.now();
      if (recordTimerRef.current != null) clearInterval(recordTimerRef.current);
      recordTimerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - recordingStartedRef.current) / 1000;
        if (elapsed >= 90) {
          try {
            userStoppedRef.current = true;
            rec.stop();
          } catch {
            /* ignore */
          }
        }
      }, 400);
    } catch {
      setIsRecording(false);
      isRecordingRef.current = false;
      recognitionRef.current = null;
    }
  }, [finalizeVoiceAnswer, isRecording, phase]);

  const submitTypedVoiceAnswer = useCallback(
    (text: string) => {
      finalChunkRef.current = text;
      transcriptBufferRef.current = "";
      void finalizeVoiceAnswer(text);
    },
    [finalizeVoiceAnswer]
  );

  const skipVoiceQuestion = useCallback(() => {
    const t = test;
    if (!t || phase !== "voice") return;
    const q = t.voiceQuestions[currentVoiceIndex];
    if (recognitionRef.current) {
      ignoreRecognitionEndRef.current = true;
    }
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
    setIsRecording(false);
    if (recordTimerRef.current != null) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setVoiceGrades((prev) => [
      ...prev,
      {
        questionId: q.id,
        score: 0,
        feedback: "Skipped — no answer submitted.",
        highlights: [],
      },
    ]);
    setPhase("grading");
    setGradingBusy(false);
    window.setTimeout(() => {
      ignoreRecognitionEndRef.current = false;
    }, 400);
  }, [currentVoiceIndex, phase, test]);

  const goToNextAfterGrading = useCallback(() => {
    const t = test;
    const meta = sessionRef.current;
    if (!t || !meta) return;
    if (voiceGrades.length >= 2) {
      const r = buildTaskTestResult(t, meta, mcqAnswersRef.current, voiceGrades);
      setResult(r);
      setPhase("results");
      return;
    }
    setCurrentVoiceIndex((i) => i + 1);
    setTranscript("");
    transcriptBufferRef.current = "";
    finalChunkRef.current = "";
    setPhase("voice");
  }, [test, voiceGrades]);

  const computeResult = useCallback(() => {
    const t = test;
    const meta = sessionRef.current;
    if (!t || !meta) return null;
    const r = buildTaskTestResult(t, meta, mcqAnswersRef.current, voiceGrades);
    setResult(r);
    setPlanProgress((prev) => ({ ...prev, [r.taskId]: r }));
    return r;
  }, [setPlanProgress, test, voiceGrades]);

  const retakeTest = useCallback(() => {
    const meta = sessionRef.current;
    if (!meta) return;
    clearAllTimeouts();
    ignoreRecognitionEndRef.current = false;
    setVoiceGrades([]);
    setCurrentVoiceIndex(0);
    setResult(null);
    setGradingBusy(false);
    setPhase("loading");
    setIsLoading(true);
    setError(null);
    setResult(null);
    void (async () => {
      try {
        const payload = await generateTaskTest({
          taskTitle: meta.taskTitle,
          taskDescription: meta.taskDescription,
          skill: meta.skill,
          difficulty: meta.difficulty,
          targetRole: meta.targetRole,
          dayNumber: meta.dayNumber,
        });
        const merged: TaskTest = { ...payload, taskId: meta.taskId };
        setTest(merged);
        setCurrentMCQIndex(0);
        mcqAnswersRef.current = [null, null, null];
        setMcqSelections([null, null, null]);
        setMcqPendingOption(null);
        setMcqReveal(false);
        setPhase("mcq");
      } catch {
        setError("Couldn't generate test. Try again.");
        setPhase("idle");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return {
    phase,
    test,
    isLoading,
    error,
    currentMCQIndex,
    mcqSelections,
    mcqPendingOption,
    mcqReveal,
    currentVoiceIndex,
    transcript,
    isRecording,
    voiceGrades,
    gradingBusy,
    voiceEmptyWarning,
    result,
    isSpeechSupported,
    startTest,
    answerMCQ,
    startRecording,
    stopRecording,
    submitTypedVoiceAnswer,
    skipVoiceQuestion,
    goToNextAfterGrading,
    computeResult,
    retakeTest,
    reset: resetInternal,
  };
}
