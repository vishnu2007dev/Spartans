import type { RoadmapWeek } from "@/lib/types";

interface RoadmapTimelineProps {
  weeks: RoadmapWeek[];
}

export function RoadmapTimeline({ weeks }: RoadmapTimelineProps) {
  return (
    <div className="flex flex-col gap-0">
      {weeks.map((week, index) => (
        <div key={week.week} className="flex gap-4">
          {/* Left: circle + connector line */}
          <div className="flex flex-col items-center" style={{ minWidth: 32 }}>
            {/* Week circle */}
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
              {index + 1}
            </div>
            {/* Connector line */}
            {index < weeks.length - 1 && (
              <div
                className="flex-1 w-px my-1"
                style={{ background: "var(--border)", minHeight: 24 }}
              />
            )}
          </div>

          {/* Right: week card */}
          <div
            className="rounded-xl p-5 flex flex-col gap-3 mb-4 flex-1"
            style={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }}
          >
            {/* Week label + focus */}
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
                {week.week}
              </span>
              <span
                className="font-bold"
                style={{ color: "var(--heading)", fontSize: 16 }}
              >
                {week.focus}
              </span>
            </div>

            {/* Tasks list */}
            <ul className="flex flex-col gap-1.5">
              {week.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 shrink-0 rounded-full"
                    style={{
                      width: 6,
                      height: 6,
                      background: "var(--accent)",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: "var(--text)", fontSize: 14 }}>{task}</span>
                </li>
              ))}
            </ul>

            {/* Proof of Work */}
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
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--text-muted)",
                  fontSize: 13,
                }}
              >
                {week.proofOfWork}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
