import type { SelectedJob } from "@/lib/types";

interface SelectedJobsSummaryProps {
  jobs: SelectedJob[];
}

const MAX_VISIBLE = 3;

export function SelectedJobsSummary({ jobs }: SelectedJobsSummaryProps) {
  const visible = jobs.slice(0, MAX_VISIBLE);
  const overflow = jobs.length - MAX_VISIBLE;

  return (
    <div className="flex flex-col gap-2">
      <span
        className="font-mono text-xs uppercase tracking-widest"
        style={{ color: "var(--text-dim)" }}
      >
        Analyzing for
      </span>

      <div className="flex flex-wrap gap-2">
        {visible.map((job, i) => (
          <div
            key={i}
            className="flex items-center gap-1 rounded-full px-3 py-1.5"
            style={{
              backgroundColor: "var(--bg-elev)",
              border: "1px solid var(--border)",
            }}
          >
            <span
              className="font-bold text-[13px]"
              style={{ color: "var(--heading)" }}
            >
              {job.title}
            </span>
            <span style={{ color: "var(--text-dim)" }}> · </span>
            <span
              className="font-mono text-[12px]"
              style={{ color: "var(--text-dim)" }}
            >
              {job.company}
            </span>
          </div>
        ))}

        {overflow > 0 && (
          <div
            className="flex items-center rounded-full px-3 py-1.5 font-mono text-[12px]"
            style={{
              backgroundColor: "var(--accent-soft)",
              border: "1px solid var(--border)",
              color: "var(--accent)",
            }}
          >
            +{overflow} more
          </div>
        )}
      </div>
    </div>
  );
}
