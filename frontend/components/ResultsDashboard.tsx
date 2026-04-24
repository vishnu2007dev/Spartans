import type { AnalysisResult } from "@/lib/types";
import { ScoreCard } from "@/components/ScoreCard";
import { SkillList } from "@/components/SkillList";
import { PrioritySkillCard } from "@/components/PrioritySkillCard";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { CourseRecommendations } from "@/components/CourseRecommendations";
import { ProjectRecommendations } from "@/components/ProjectRecommendations";
import { ResumeSuggestions } from "@/components/ResumeSuggestions";
import { MentorAdvice } from "@/components/MentorAdvice";

interface ResultsDashboardProps {
  data: AnalysisResult;
}

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 } as const;

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="uppercase tracking-widest"
      style={{
        color: "var(--text-dim)",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
      }}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-bold tracking-tight mb-6"
      style={{
        color: "var(--heading)",
        fontFamily: "var(--font-manrope)",
        fontSize: 22,
      }}
    >
      {children}
    </h2>
  );
}

export function ResultsDashboard({ data }: ResultsDashboardProps) {
  const sortedPrioritySkills = [...data.prioritySkills].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  return (
    <div className="flex flex-col gap-12">
      {/* 1. Readiness Snapshot */}
      <section aria-labelledby="section-readiness">
        <SectionEyebrow>Readiness Snapshot</SectionEyebrow>
        <SectionHeading id="section-readiness">Where you stand</SectionHeading>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 flex-wrap">
            <ScoreCard
              label="Current Readiness"
              value={data.currentReadiness}
              variant="current"
            />
            <ScoreCard
              label="Projected Readiness"
              value={data.projectedReadiness}
              variant="projected"
            />
          </div>
          <p
            className="max-w-2xl"
            style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7 }}
          >
            {data.summary}
          </p>
        </div>
      </section>

      {/* 2. Opportunity Coverage */}
      <section aria-labelledby="section-coverage">
        <SectionEyebrow>Opportunity Coverage</SectionEyebrow>
        <SectionHeading id="section-coverage">Role coverage</SectionHeading>
        <div
          className="rounded-xl p-6 flex flex-col gap-4"
          style={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }}
        >
          <div className="flex gap-8 flex-wrap">
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
                Current
              </span>
              <span
                className="font-bold"
                style={{ color: "var(--heading)", fontSize: 20 }}
              >
                {data.opportunityCoverage.current}
              </span>
            </div>
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
                After Roadmap
              </span>
              <span
                className="font-bold"
                style={{ color: "var(--action)", fontSize: 20 }}
              >
                {data.opportunityCoverage.projected}
              </span>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {data.opportunityCoverage.explanation}
          </p>
        </div>
      </section>

      {/* 3. Skills Analysis */}
      <section aria-labelledby="section-skills">
        <SectionEyebrow>Skills Analysis</SectionEyebrow>
        <SectionHeading id="section-skills">Your skill profile</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SkillList
            title="Common Skills Required"
            skills={data.commonSkills}
            variant="common"
          />
          <SkillList
            title="Skills You Have"
            skills={data.matchedSkills}
            variant="matched"
          />
          <SkillList
            title="Skills to Build"
            skills={data.missingSkills}
            variant="missing"
          />
        </div>
      </section>

      {/* 4. Top Skills to Unlock */}
      <section aria-labelledby="section-priority">
        <SectionEyebrow>Priority Skills</SectionEyebrow>
        <SectionHeading id="section-priority">Top skills to unlock</SectionHeading>
        <div className="flex flex-col gap-4">
          {sortedPrioritySkills.map((skill) => (
            <PrioritySkillCard key={skill.skill} skill={skill} />
          ))}
        </div>
      </section>

      {/* 5. Learning Roadmap */}
      <section aria-labelledby="section-roadmap">
        <SectionEyebrow>Learning Roadmap</SectionEyebrow>
        <SectionHeading id="section-roadmap">Your week-by-week plan</SectionHeading>
        <RoadmapTimeline weeks={data.learningRoadmap} />
      </section>

      {/* 6. Recommended Courses */}
      <section aria-labelledby="section-courses">
        <SectionEyebrow>Recommended Courses</SectionEyebrow>
        <SectionHeading id="section-courses">What to study</SectionHeading>
        <CourseRecommendations courses={data.recommendedCourses} />
      </section>

      {/* 7. Portfolio Projects */}
      <section aria-labelledby="section-projects">
        <SectionEyebrow>Portfolio Projects</SectionEyebrow>
        <SectionHeading id="section-projects">What to build</SectionHeading>
        <ProjectRecommendations projects={data.portfolioProjects} />
      </section>

      {/* 8. Resume Upgrade Suggestions */}
      <section aria-labelledby="section-resume">
        <SectionEyebrow>Resume Upgrade</SectionEyebrow>
        <SectionHeading id="section-resume">Resume suggestions</SectionHeading>
        <div
          className="rounded-xl px-6"
          style={{ background: "var(--bg-elev)", border: "1px solid var(--border)" }}
        >
          <ResumeSuggestions suggestions={data.resumeSuggestions} />
        </div>
      </section>

      {/* 9. Mentor Advice */}
      <section aria-labelledby="section-mentor">
        <SectionEyebrow>Mentor Advice</SectionEyebrow>
        <SectionHeading id="section-mentor">A word from your mentor</SectionHeading>
        <MentorAdvice advice={data.mentorStyleAdvice} />
      </section>
    </div>
  );
}
