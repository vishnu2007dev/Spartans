import type { Difficulty, LearningDay, PlanProgress } from "@/lib/types";
import type { StartTestInput } from "@/hooks/useTaskTest";
import { TeachingPromptCard } from "@/components/plan/TeachingPromptCard";

interface RoadmapTimelineProps {
  days: LearningDay[];
  difficulty: Difficulty;
  targetRole: string;
  totalDays: number;
  chosenSkills: string[];
  planProgress: PlanProgress;
  onOpenTest: (payload: StartTestInput) => void;
}

export function RoadmapTimeline({
  days,
  difficulty,
  targetRole,
  totalDays,
  chosenSkills,
  planProgress,
  onOpenTest,
}: RoadmapTimelineProps) {
  const skillFor = (globalTaskIndex: number) =>
    chosenSkills.length > 0 ? chosenSkills[globalTaskIndex % chosenSkills.length] : "General";

  return (
    <div className="flex flex-col gap-0">
      {days.map((entry, index) => (
        <div key={entry.day} className="flex gap-4">
          <div className="flex flex-col items-center" style={{ minWidth: 32 }}>
            <div
              className="flex shrink-0 items-center justify-center rounded-full font-bold"
              style={{
                width: 32,
                height: 32,
                background: "var(--accent)",
                color: "#000",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                zIndex: 1,
              }}
            >
              {entry.day}
            </div>
            {index < days.length - 1 && (
              <div
                className="my-1 flex-1 w-px"
                style={{ background: "var(--border)", minHeight: 24 }}
              />
            )}
          </div>

          <div
            className="mb-4 flex flex-1 flex-col gap-3 rounded-xl p-5"
            style={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }}
          >
            <div className="flex flex-col gap-1">
              <span
                style={{
                  color: "var(--text-dim)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Day {entry.day}
              </span>
              <span className="text-base font-bold" style={{ color: "var(--heading)", fontSize: 16 }}>
                {entry.topic}
              </span>
            </div>

            <ul className="flex flex-col gap-3">
              {entry.tasks.map((task, i) => {
                const taskId = `${entry.day}_${i}`;
                const progress = planProgress[taskId];
                const priorCount = days.slice(0, index).reduce((n, d) => n + d.tasks.length, 0);
                const skill = skillFor(priorCount + i);
                return (
                  <li key={taskId} id={`plan-task-${taskId}`} className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                      <span style={{ color: "var(--text)", fontSize: 14 }}>{task}</span>
                    </div>
                    <div className="pl-5">
                      {progress?.passed ? (
                        <span
                          className="inline-flex rounded-full px-2.5 py-1 font-mono text-xs"
                          style={{
                            background: "rgba(34,197,94,0.15)",
                            color: "#86efac",
                            border: "1px solid rgba(34,197,94,0.35)",
                          }}
                        >
                          ✅ Passed ({progress.overallScore}%)
                        </span>
                      ) : progress ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="inline-flex rounded-full px-2.5 py-1 font-mono text-xs"
                            style={{
                              background: "rgba(234,179,8,0.12)",
                              color: "#fbbf24",
                              border: "1px solid rgba(234,179,8,0.35)",
                            }}
                          >
                            ⚠️ Retry ({progress.overallScore}%)
                          </span>
                          <button
                            type="button"
                            className="rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
                            style={{
                              borderColor: "var(--border-strong)",
                              color: "var(--text-muted)",
                            }}
                            onClick={() =>
                              onOpenTest({
                                taskId,
                                taskTitle: task,
                                taskDescription: task,
                                skill,
                                difficulty,
                                targetRole,
                                dayNumber: entry.day,
                              })
                            }
                          >
                            🧪 Test Me
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="rounded-md border px-2.5 py-1 font-mono text-xs transition-colors hover:bg-[var(--bg)]"
                          style={{
                            borderColor: "var(--border-strong)",
                            color: "var(--text-muted)",
                          }}
                          onClick={() =>
                            onOpenTest({
                              taskId,
                              taskTitle: task,
                              taskDescription: task,
                              skill,
                              difficulty,
                              targetRole,
                              dayNumber: entry.day,
                            })
                          }
                        >
                          🧪 Test Me
                        </button>
                      )}
                    </div>

                    <div className="pl-5">
                      <TeachingPromptCard
                        taskTitle={task}
                        taskDescription={task}
                        skill={skill}
                        dayNumber={entry.day}
                        totalDays={totalDays}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            {entry.resources.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span
                  style={{
                    color: "var(--text-dim)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Resources
                </span>
                <div className="flex flex-col gap-1">
                  {entry.resources.map((r) => (
                    <a
                      key={r.url}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline-offset-2 hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      {r.title}{" "}
                      <span style={{ color: "var(--text-dim)", fontSize: 11 }}>
                        ({r.estimatedMinutes} min)
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span
                style={{
                  color: "var(--text-dim)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Proof of Work
              </span>
              <p
                className="border-l-2 pl-3"
                style={{ borderColor: "var(--accent)", color: "var(--text-muted)", fontSize: 13 }}
              >
                {entry.proofOfWork}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
