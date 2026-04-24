import { Badge } from "@/components/ui/badge";
import type { PortfolioProject } from "@/lib/types";

interface ProjectRecommendationsProps {
  projects: PortfolioProject[];
}

export function ProjectRecommendations({ projects }: ProjectRecommendationsProps) {
  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <div
          key={project.title}
          className="rounded-xl p-5 flex flex-col gap-3"
          style={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }}
        >
          <span
            className="font-bold"
            style={{ color: "var(--heading)", fontSize: 16 }}
          >
            {project.title}
          </span>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.skillsDemonstrated.map((skill) => (
              <Badge key={skill} variant="mono">{skill}</Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
