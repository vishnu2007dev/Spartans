import { CheckCircle2 } from "lucide-react";

interface SelectionCounterProps {
  count: number;
  min: number;
  max: number;
}

export function SelectionCounter({ count, min, max }: SelectionCounterProps) {
  const isReady = count >= min && count < max;
  const isMax = count >= max;

  // Progress dots
  const dots = Array.from({ length: max }, (_, i) => i < count);

  return (
    <div
      className="sticky bottom-0 z-40"
      style={{
        backgroundColor: "var(--bg-elev)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-4 flex items-center gap-6 flex-wrap">
        {/* Left: count */}
        <div className="flex items-baseline gap-2">
          <span
            className="font-bold leading-none"
            style={{
              color: "var(--heading)",
              fontFamily: "var(--font-manrope)",
              fontSize: "32px",
            }}
          >
            {count}
          </span>
          <span
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: "var(--text-dim)" }}
          >
            jobs selected
          </span>
        </div>

        {/* Center: progress dots */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {dots.map((filled, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: filled ? "var(--accent)" : "var(--border-strong)",
              }}
            />
          ))}
          <span
            className="font-mono text-xs ml-1"
            style={{ color: "var(--text-dim)" }}
          >
            {count}/{max}
          </span>
        </div>

        {/* Right: status */}
        <div className="ml-auto flex items-center gap-1.5">
          {isMax ? (
            <span
              className="font-mono text-xs"
              style={{ color: "var(--text-dim)" }}
            >
              Maximum reached
            </span>
          ) : isReady ? (
            <>
              <CheckCircle2
                className="size-4"
                style={{ color: "var(--action)" }}
                aria-hidden="true"
              />
              <span
                className="font-mono text-xs"
                style={{ color: "var(--action)" }}
              >
                Ready to analyze
              </span>
            </>
          ) : (
            <span
              className="font-mono text-xs"
              style={{ color: "var(--text-dim)" }}
            >
              Select at least {min} to continue
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
