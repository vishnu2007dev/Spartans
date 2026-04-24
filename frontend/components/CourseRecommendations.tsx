import { Badge } from "@/components/ui/badge";
import type { LearningResource } from "@/lib/types";

interface CourseRecommendationsProps {
  resources: LearningResource[];
}

export function CourseRecommendations({ resources }: CourseRecommendationsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {resources.map((r) => (
        <a
          key={r.url}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-[var(--accent)]"
          style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", textDecoration: "none" }}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="font-bold" style={{ color: "var(--heading)", fontSize: 15 }}>
              {r.title}
            </span>
            <Badge variant="mono">{r.type}</Badge>
          </div>
          <span className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>
            ~{r.estimatedMinutes} min
          </span>
        </a>
      ))}
    </div>
  );
}
