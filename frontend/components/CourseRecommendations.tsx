import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/types";

interface CourseRecommendationsProps {
  courses: Course[];
}

export function CourseRecommendations({ courses }: CourseRecommendationsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {courses.map((course) => (
        <div
          key={course.name}
          className="rounded-xl p-5 flex flex-col gap-3"
          style={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className="font-bold"
              style={{ color: "var(--heading)", fontSize: 15 }}
            >
              {course.name}
            </span>
            <Badge variant="mono">{course.type}</Badge>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{course.reason}</p>
        </div>
      ))}
    </div>
  );
}
