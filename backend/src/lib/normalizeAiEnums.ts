import type { GapCategory, GapImportance } from "./types";

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function clamp0to100(n: number): number {
  return Math.min(100, Math.max(0, n));
}

/** Coerce numeric strings for score endpoint Zod. */
export function normalizeScorePayload(data: unknown): unknown {
  if (typeof data !== "object" || data === null) return data;
  const d = data as Record<string, unknown>;
  return {
    overallScore: clamp0to100(num(d.overallScore, 0)),
    projectedScore: clamp0to100(num(d.projectedScore, 0)),
    matchedSkills: Array.isArray(d.matchedSkills)
      ? d.matchedSkills.map((x) => String(x))
      : [],
    missingSkills: Array.isArray(d.missingSkills)
      ? d.missingSkills.map((x) => String(x))
      : [],
    pros: Array.isArray(d.pros)
      ? d.pros.map((x) => String(x))
      : [],
    cons: Array.isArray(d.cons)
      ? d.cons.map((x) => String(x))
      : [],
    skillRadar: Array.isArray(d.skillRadar)
      ? d.skillRadar.map((item) => {
          if (!item || typeof item !== "object") return item;
          const o = item as Record<string, unknown>;
          return {
            category: String(o.category ?? ""),
            score: clamp0to100(num(o.score, 0)),
          };
        })
      : [],
    perJob: Array.isArray(d.perJob)
      ? d.perJob.map((p) => {
          if (!p || typeof p !== "object") return p;
          const o = p as Record<string, unknown>;
          return {
            title: String(o.title ?? ""),
            company: String(o.company ?? ""),
            score: clamp0to100(num(o.score, 0)),
            matchedCount: Math.max(0, Math.round(num(o.matchedCount, 0))),
            totalRequired: Math.max(0, Math.round(num(o.totalRequired, 0))),
          };
        })
      : [],
    summary: String(d.summary ?? ""),
  };
}

const CATEGORIES: GapCategory[] = ["skill", "cert", "experience", "tooling"];

export function mapGapCategory(raw: string): GapCategory {
  const x = raw.toLowerCase().trim();
  if (CATEGORIES.includes(x as GapCategory)) return x as GapCategory;
  if (x.includes("cert")) return "cert";
  if (x.includes("tool") || x.includes("bi") || x.includes("tableau")) return "tooling";
  if (x.includes("experience") || x.includes("soft") || x.includes("stakeholder"))
    return "experience";
  return "skill";
}

export function mapGapImportance(raw: string): GapImportance {
  const x = raw.toLowerCase().replace(/[\s_]+/g, "-");
  if (x === "nice-to-have" || x.includes("nice") || x.includes("optional") || x === "low")
    return "nice-to-have";
  return "critical";
}

/** Coerce common model mistakes before Zod (gaps / skill-focus). */
export function normalizeGapsPayload(data: unknown): unknown {
  if (typeof data !== "object" || data === null || !("gaps" in data)) return data;
  const d = data as { gaps: unknown[]; summary?: unknown };
  return {
    summary: typeof d.summary === "string" ? d.summary : String(d.summary ?? ""),
    gaps: (Array.isArray(d.gaps) ? d.gaps : []).map((g) => {
      if (!g || typeof g !== "object") return g;
      const o = g as Record<string, unknown>;
      return {
        item: String(o.item ?? "").trim(),
        category: mapGapCategory(String(o.category ?? "skill")),
        importance: mapGapImportance(String(o.importance ?? "critical")),
        appearsIn: String(o.appearsIn ?? "").trim(),
        reason: String(o.reason ?? "").trim(),
      };
    }),
  };
}

export function normalizeFocusPayload(data: unknown): unknown {
  if (typeof data !== "object" || data === null || !("clusteredSkills" in data))
    return data;
  const d = data as { clusteredSkills: unknown[] };
  return {
    clusteredSkills: (Array.isArray(d.clusteredSkills) ? d.clusteredSkills : []).map(
      (s) => {
        if (!s || typeof s !== "object") return s;
        const o = s as Record<string, unknown>;
        return {
          skill: String(o.skill ?? "").trim(),
          appearsIn: String(o.appearsIn ?? "").trim(),
          rationale: String(o.rationale ?? "").trim(),
          category: mapGapCategory(String(o.category ?? "skill")),
        };
      }
    ),
  };
}

const DIFFS = ["beginner", "intermediate", "advanced"] as const;
const RES_TYPES = ["video", "article", "course", "practice", "project"] as const;

function mapDifficulty(raw: string): (typeof DIFFS)[number] {
  const x = raw.toLowerCase().trim();
  return DIFFS.includes(x as (typeof DIFFS)[number]) ? x as (typeof DIFFS)[number] : "intermediate";
}

function mapResourceType(raw: string): (typeof RES_TYPES)[number] {
  const x = raw.toLowerCase().trim();
  if (RES_TYPES.includes(x as (typeof RES_TYPES)[number])) return x as (typeof RES_TYPES)[number];
  if (x.includes("video") || x.includes("youtube")) return "video";
  if (x.includes("course")) return "course";
  if (x.includes("project")) return "project";
  if (x.includes("practice") || x.includes("exercise")) return "practice";
  return "article";
}

/** Coerce numeric strings and enums before plan Zod. */
export function normalizePlanPayload(data: unknown): unknown {
  if (typeof data !== "object" || data === null) return data;
  const d = data as Record<string, unknown>;
  const planArr = Array.isArray(d.plan) ? d.plan : [];
  return {
    days: Math.round(num(d.days, planArr.length || 7)),
    difficulty: mapDifficulty(String(d.difficulty ?? "intermediate")),
    projectedReadinessGain: clamp0to100(num(d.projectedReadinessGain, 0)),
    plan: planArr.map((day) => {
      if (!day || typeof day !== "object") return day;
      const o = day as Record<string, unknown>;
      const resources = Array.isArray(o.resources) ? o.resources : [];
      return {
        day: Math.max(1, Math.round(num(o.day, 0))),
        topic: String(o.topic ?? ""),
        tasks: Array.isArray(o.tasks) ? o.tasks.map((t) => String(t)) : [],
        resources: resources.map((r) => {
          if (!r || typeof r !== "object") return r;
          const u = r as Record<string, unknown>;
          return {
            title: String(u.title ?? ""),
            url: String(u.url ?? "https://example.com"),
            type: mapResourceType(String(u.type ?? "article")),
            estimatedMinutes: Math.max(1, Math.round(num(u.estimatedMinutes, 30))),
          };
        }),
        proofOfWork: String(o.proofOfWork ?? ""),
      };
    }),
  };
}
