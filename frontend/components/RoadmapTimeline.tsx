import type { LearningDay } from "@/lib/types";

interface RoadmapTimelineProps {
  days: LearningDay[];
}

export function RoadmapTimeline({ days }: RoadmapTimelineProps) {
  return (
    <div className="flex flex-col gap-0">
      {days.map((entry, index) => (
        <div key={entry.day} className="flex gap-4">
          {/* Left: circle + connector */}
          <div className="flex flex-col items-center" style={{ minWidth: 32 }}>
            <div
              className="flex items-center justify-center rounded-full font-bold shrink-0"
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
                className="flex-1 w-px my-1"
                style={{ background: "var(--border)", minHeight: 24 }}
              />
            )}
          </div>

          {/* Right: day card */}
          <div
            className="rounded-xl p-5 flex flex-col gap-3 mb-4 flex-1"
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
              <span className="font-bold" style={{ color: "var(--heading)", fontSize: 16 }}>
                {entry.topic}
              </span>
            </div>

            {/* Tasks */}
            <ul className="flex flex-col gap-1.5">
              {entry.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 shrink-0 rounded-full"
                    style={{ width: 6, height: 6, background: "var(--accent)", display: "inline-block" }}
                  />
                  <span style={{ color: "var(--text)", fontSize: 14 }}>{task}</span>
                </li>
              ))}
            </ul>

            {/* Resources */}
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

            {/* Proof of work */}
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
