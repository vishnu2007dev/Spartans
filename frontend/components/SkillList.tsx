import { Badge } from "@/components/ui/badge";

interface SkillListProps {
  title: string;
  skills: string[];
  variant?: "matched" | "missing" | "common";
}

export function SkillList({ title, skills, variant = "common" }: SkillListProps) {
  const badgeVariant =
    variant === "matched" ? "accent" : variant === "missing" ? "outline" : "mono";

  return (
    <div className="flex flex-col gap-3">
      {/* Section label */}
      <span
        className="uppercase tracking-widest"
        style={{
          color: "var(--text-dim)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
        }}
      >
        {title}
      </span>

      {/* Skill tags */}
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant={badgeVariant}
              className={
                variant === "missing"
                  ? "border-[rgba(239,68,68,0.4)]"
                  : undefined
              }
            >
              {skill}
            </Badge>
          ))}
        </div>
      ) : (
        <span
          className="italic"
          style={{ color: "var(--text-dim)", fontSize: 13 }}
        >
          None identified
        </span>
      )}
    </div>
  );
}
