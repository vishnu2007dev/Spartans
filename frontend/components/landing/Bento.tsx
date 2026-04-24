import { ArrowUpRight } from "lucide-react";

/* ── Crosshair marker SVG ── */
function Crosshair({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="absolute z-10 pointer-events-none"
      style={{ color: "var(--border-strong)", ...style }}
    >
      <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* ── Individual bento cell ── */
function BentoCell({
  title,
  description,
  visual,
}: {
  title: string;
  description: string;
  visual: React.ReactNode;
}) {
  return (
    <div
      className="group relative flex flex-col p-9 min-h-[380px] transition-colors duration-250"
      style={{
        borderRight: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none"
        style={{ backgroundColor: "rgba(255,255,255,0.015)" }}
        aria-hidden="true"
      />

      {/* Title */}
      <h3
        className="font-bold tracking-[-0.025em] mb-2"
        style={{ fontSize: "28px", color: "var(--text)" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="mb-6 max-w-[32ch] leading-relaxed"
        style={{ fontSize: "15px", color: "var(--text-muted)" }}
      >
        {description}
      </p>

      {/* Arrow button */}
      <div
        className="mb-6 size-10 rounded-full border flex items-center justify-center transition-all duration-250 group-hover:translate-x-1"
        style={{
          borderColor: "var(--border-strong)",
          color: "var(--text-muted)",
        }}
        aria-hidden="true"
      >
        <ArrowUpRight className="size-4" />
      </div>

      {/* Visual */}
      <div
        className="mt-auto rounded-lg border p-4"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-elev)",
        }}
      >
        {visual}
      </div>
    </div>
  );
}

/* ── Visuals ── */

function RoleTagsVisual() {
  const roles = [
    { label: "Product Manager", match: true },
    { label: "Data Analyst", match: true },
    { label: "Business Analyst", match: true },
    { label: "TPM Intern", match: false },
    { label: "SWE Intern", match: false },
    { label: "Ops Analyst", match: true },
    { label: "Growth Analyst", match: false },
    { label: "UX Research", match: false },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((r) => (
        <span
          key={r.label}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium border"
          style={{
            fontFamily: "var(--font-mono)",
            borderColor: r.match ? "var(--accent)" : "var(--border)",
            backgroundColor: r.match ? "var(--accent-soft)" : "transparent",
            color: r.match ? "var(--accent)" : "var(--text-dim)",
          }}
        >
          {r.label}
        </span>
      ))}
    </div>
  );
}

function SkillBarsVisual() {
  const skills = [
    { label: "SQL", pct: 82 },
    { label: "A/B Testing", pct: 55 },
    { label: "Figma", pct: 40 },
    { label: "Roadmapping", pct: 70 },
    { label: "Analytics", pct: 90 },
  ];
  return (
    <div className="flex flex-col gap-3">
      {skills.map((s) => (
        <div key={s.label} className="flex items-center gap-3">
          <span
            className="w-20 shrink-0 text-[10px] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}
          >
            {s.label}
          </span>
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${s.pct}%`,
                background: `linear-gradient(90deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 60%, transparent) 100%)`,
              }}
            />
          </div>
          <span
            className="text-[10px] w-8 text-right"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}
          >
            {s.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

function WeekCardsVisual() {
  const weeks = ["W1", "W2", "W3", "W4"];
  return (
    <div className="flex gap-2">
      {weeks.map((w, i) => (
        <div
          key={w}
          className="flex-1 rounded-md p-3 text-center"
          style={{
            border: i === 0 ? "1px solid var(--accent)" : "1px solid var(--border)",
            backgroundColor: i === 0 ? "var(--accent-soft)" : "transparent",
          }}
        >
          <span
            className="text-[11px] font-semibold"
            style={{
              fontFamily: "var(--font-mono)",
              color: i === 0 ? "var(--accent)" : "var(--text-dim)",
            }}
          >
            {w}
          </span>
        </div>
      ))}
    </div>
  );
}

function TerminalVisual() {
  return (
    <div
      className="rounded-md p-4 font-mono text-[12px] leading-relaxed"
      style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}
    >
      <div style={{ color: "var(--text-dim)" }}>$ unlockd parse --profile</div>
      <div className="mt-1">→ Extracted <span style={{ color: "var(--accent)" }}>12 skills</span></div>
      <div>→ Found <span style={{ color: "var(--accent)" }}>4 strong signals</span></div>
      <div className="flex items-center gap-1">
        ✓ Profile indexed
        <span
          className="cursor-blink inline-block w-1.5 h-3.5 ml-0.5 rounded-sm"
          style={{ backgroundColor: "var(--accent)" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function MatchScoreVisual() {
  const pct = 75;
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex items-center gap-5">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-label="75% match score">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text
          x="36"
          y="40"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="var(--text)"
          fontFamily="var(--font-mono)"
        >
          75%
        </text>
      </svg>
      <div
        className="text-[11px] leading-relaxed"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}
      >
        <div style={{ color: "var(--accent)" }}>↑ strong signal</div>
        <div>12 skills matched</div>
        <div>3 gaps to close</div>
      </div>
    </div>
  );
}

function SkeletonBarsVisual() {
  const widths = ["w-full", "w-4/5", "w-3/5", "w-11/12", "w-2/3"];
  return (
    <div className="flex flex-col gap-2.5">
      {widths.map((w, i) => (
        <div
          key={i}
          className={`h-2 rounded-full ${w}`}
          style={{
            background:
              i === 2
                ? `linear-gradient(90deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 40%, transparent) 100%)`
                : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Bento grid ── */
const cells = [
  {
    title: "Role matching",
    description: "Curated roles that actually fit your profile — no more spray-and-pray.",
    visual: <RoleTagsVisual />,
  },
  {
    title: "Skill gap analysis",
    description: "See exactly where you stand vs the role — and where to double down.",
    visual: <SkillBarsVisual />,
  },
  {
    title: "4-week roadmap",
    description: "A sequenced plan with milestones. Week by week, what to learn and in what order.",
    visual: <WeekCardsVisual />,
  },
  {
    title: "Profile parser",
    description: "Paste your resume or LinkedIn. We extract your signal and map it to opportunities.",
    visual: <TerminalVisual />,
  },
  {
    title: "Match score",
    description: "Every role gets a quantified fit score — so you know where to invest your time.",
    visual: <MatchScoreVisual />,
  },
  {
    title: "Interview prep",
    description: "Role-specific mock questions, case frameworks, and model answers — already loaded.",
    visual: <SkeletonBarsVisual />,
  },
];

export function Bento() {
  return (
    <section
      aria-labelledby="bento-heading"
      className="mx-auto max-w-[1280px] px-5 lg:px-8 py-24"
    >
      {/* Section header */}
      <div className="mb-12 text-center">
        <p
          className="mb-3 text-[11px] uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}
        >
          What you get
        </p>
        <h2
          id="bento-heading"
          className="font-bold tracking-[-0.03em]"
          style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--heading)" }}
        >
          Your career path,{" "}
          <span style={{ color: "var(--heading-sub)" }}>engineered.</span>
        </h2>
        <p
          className="mt-4 mx-auto max-w-[52ch]"
          style={{ fontSize: "16px", color: "var(--text-muted)" }}
        >
          Six signals that turn scattered job applications into a focused,
          week-by-week prep plan.
        </p>
      </div>

      {/* Grid */}
      <div
        className="relative"
        style={{ borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}
      >
        {/* Crosshair markers at interior grid intersections */}
        {/* Row 1 intersections (after col 1 and col 2) */}
        <Crosshair
          style={{ top: "calc(33.333% - 6px)", left: "calc(33.333% - 6px)" } as React.CSSProperties}
        />
        <Crosshair
          style={{ top: "calc(33.333% - 6px)", left: "calc(66.666% - 6px)" } as React.CSSProperties}
        />
        {/* Row 2 intersections */}
        <Crosshair
          style={{ top: "calc(66.666% - 6px)", left: "calc(33.333% - 6px)" } as React.CSSProperties}
        />
        <Crosshair
          style={{ top: "calc(66.666% - 6px)", left: "calc(66.666% - 6px)" } as React.CSSProperties}
        />
        {/* Edge midpoints */}
        <Crosshair
          style={{ top: "calc(33.333% - 6px)", left: "-6px" } as React.CSSProperties}
        />
        <Crosshair
          style={{ top: "calc(66.666% - 6px)", left: "-6px" } as React.CSSProperties}
        />
        <Crosshair
          style={{ top: "calc(33.333% - 6px)", right: "-6px" } as React.CSSProperties}
        />
        <Crosshair
          style={{ top: "calc(66.666% - 6px)", right: "-6px" } as React.CSSProperties}
        />

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{
            /* Kill right border on last col, bottom border on last row */
          }}
        >
          {cells.map((cell, i) => (
            <div
              key={cell.title}
              className="group relative flex flex-col p-9 min-h-[380px] transition-colors duration-250"
              style={{
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {/* Hover tint */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none"
                style={{ backgroundColor: "rgba(255,255,255,0.012)" }}
                aria-hidden="true"
              />

              <h3
                className="font-bold tracking-[-0.025em] mb-2 relative z-10"
                style={{ fontSize: "22px", color: "var(--heading)" }}
              >
                {cell.title}
              </h3>

              <p
                className="mb-5 max-w-[32ch] leading-relaxed relative z-10"
                style={{ fontSize: "14px", color: "var(--text-muted)" }}
              >
                {cell.description}
              </p>

              {/* Arrow */}
              <div
                className="mb-5 size-9 rounded-full border flex items-center justify-center transition-all duration-250 group-hover:translate-x-1 relative z-10"
                style={{ borderColor: "var(--border-strong)", color: "var(--text-dim)" }}
                aria-hidden="true"
              >
                <ArrowUpRight className="size-3.5" />
              </div>

              {/* Visual */}
              <div
                className="mt-auto rounded-lg border p-4 relative z-10"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elev)" }}
              >
                {cell.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
