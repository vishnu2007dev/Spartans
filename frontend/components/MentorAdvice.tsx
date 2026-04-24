import { Quote } from "lucide-react";

interface MentorAdviceProps {
  advice: string;
}

export function MentorAdvice({ advice }: MentorAdviceProps) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-4"
      style={{
        background: "var(--bg-elev)",
        border: "1px solid var(--border)",
        borderLeft: "4px solid var(--accent)",
      }}
    >
      <Quote
        className="size-5"
        style={{ color: "var(--accent)" }}
        aria-hidden="true"
      />
      <p
        className="italic leading-relaxed"
        style={{ color: "var(--text)", fontSize: 16 }}
      >
        {advice}
      </p>
      <span
        style={{
          color: "var(--text-dim)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        — Unlockd AI Mentor
      </span>
    </div>
  );
}
