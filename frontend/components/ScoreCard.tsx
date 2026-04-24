import { cn } from "@/lib/utils";

interface ScoreCardProps {
  label: string;
  value: number; // 0-100
  variant?: "current" | "projected";
}

export function ScoreCard({ label, value, variant = "current" }: ScoreCardProps) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const isProjected = variant === "projected";

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-xl p-6"
      style={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }}
    >
      {/* SVG progress ring */}
      <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            strokeWidth="6"
            stroke="var(--border)"
            fill="none"
          />
          {/* Progress arc */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            strokeWidth="6"
            stroke={isProjected ? "var(--accent)" : "var(--border-strong)"}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 40 40)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        {/* Center text */}
        <span
          className="absolute font-bold"
          style={{
            color: "var(--heading)",
            fontFamily: "var(--font-mono)",
            fontSize: 18,
          }}
        >
          {value}%
        </span>
      </div>

      {/* Label */}
      <span
        className="text-center uppercase tracking-widest"
        style={{
          color: "var(--text-dim)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
        }}
      >
        {label}
      </span>

      {/* Projected badge */}
      {isProjected && (
        <span
          className="uppercase tracking-widest"
          style={{
            color: "var(--action)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
          }}
        >
          ↑ after roadmap
        </span>
      )}
    </div>
  );
}
