export interface PlanShareData {
  topics: string[];
  targetRole: string;
  companies: string[];
  chosenSkills: string[];
  days: 7 | 14 | 28;
  difficulty: "beginner" | "intermediate" | "advanced";
  totalTasks: number;
}

function cleanLines(lines: string[]): string {
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function safeStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function clampDifficulty(d: unknown): "beginner" | "intermediate" | "advanced" {
  return d === "beginner" || d === "advanced" || d === "intermediate" ? d : "intermediate";
}

function clampDays(d: unknown): 7 | 14 | 28 {
  return d === 7 || d === 14 || d === 28 ? d : 14;
}

export function getPlanShareData(
  plan: any,
  selectedJobs: any[],
  chosenSkills: string[],
  days: 7 | 14 | 28,
  difficulty: string
): PlanShareData {
  const planDays =
    plan?.plan ??
    plan?.days ??
    plan?.roadmap ??
    plan?.learningPlan ??
    [];

  const topics: string[] = (Array.isArray(planDays) ? planDays : [])
    .flatMap((d: any) => {
      const tasks = d?.tasks ?? d?.items ?? d?.topics ?? [];
      if (Array.isArray(tasks)) return tasks;
      return [];
    })
    .map((t: any) => (typeof t === "string" ? t : t?.title ?? t?.taskTitle ?? t?.name ?? ""))
    .map((s: any) => safeStr(s))
    .filter(Boolean);

  const targetRole = safeStr(selectedJobs?.[0]?.title) || "Software Engineer";
  const companies = (Array.isArray(selectedJobs) ? selectedJobs : [])
    .map((j) => safeStr(j?.company))
    .filter(Boolean);

  const skills = (Array.isArray(chosenSkills) ? chosenSkills : [])
    .map((s) => safeStr(s))
    .filter(Boolean);

  const d = clampDays(days);
  const diff = clampDifficulty(difficulty);

  return {
    topics,
    targetRole,
    companies,
    chosenSkills: skills,
    days: d,
    difficulty: diff,
    totalTasks: topics.length,
  };
}

export function generateTwitterPlanPost(data: PlanShareData): string {
  const days = data.days ?? 14;
  const rawTargetRole = safeStr(data.targetRole) || "Software Engineer";
  // Keep target role compact to preserve space for actual plan topics.
  const targetRole = rawTargetRole.replace(/\s+/g, " ").slice(0, 70).trim() || "Software Engineer";
  const companies = Array.isArray(data.companies) ? data.companies.filter(Boolean) : [];
  const topics = Array.isArray(data.topics) ? data.topics.map(safeStr).filter(Boolean) : [];

  const baseHead = `I just built my ${days}-day study plan for ${targetRole} roles.`;
  const companiesLine =
    companies.length > 0 ? `Targeting ${companies.slice(0, 2).join(" and ")}.` : "";

  const middle = `Here's what ${days} days of structured prep actually looks like 👇`;
  const outroA = `Not applying blindly anymore.\nBuilding the skills the JD actually asks for.`;
  const outroAShort = `Not applying blindly anymore.\nBuilding the skills the JD asks for.`;
  const outroB = `Thread incoming 🧵 #buildinpublic #jobsearch #Unlockd`;
  const hashtagsOnly = `#buildinpublic #jobsearch #Unlockd`;

  const build = (opts: {
    topicCount: number;
    includeCompanies: boolean;
    includeMiddle: boolean;
    outro: "full" | "short" | "none";
    includeThreadLine: boolean;
  }) => {
    const shown = topics.slice(0, Math.max(0, opts.topicCount));
    const bullets = shown.map((t) => `▸ ${t}`);
    const more =
      topics.length > shown.length && shown.length > 0
        ? `▸ + ${topics.length - shown.length} more`
        : "";

    const outroBlock =
      opts.outro === "none" ? "" : opts.outro === "short" ? outroAShort : outroA;

    const lines: string[] = [
      baseHead,
      opts.includeCompanies && companiesLine ? `\n${companiesLine}` : "",
      "",
      opts.includeMiddle ? middle : "",
      opts.includeMiddle ? "" : "",
      ...bullets,
      more ? more : "",
      "",
      outroBlock,
      outroBlock ? "" : "",
      opts.includeThreadLine ? outroB : hashtagsOnly,
    ];
    return cleanLines(lines);
  };

  const maxTopics = Math.min(5, topics.length || 5);
  const minTopics = topics.length > 0 ? 1 : 0;

  const attempts: Array<ReturnType<typeof build>> = [];
  for (let n = maxTopics; n >= minTopics; n--) {
    // Prefer showing topics. Trim other lines before we ever drop to the tiny fallback.
    attempts.push(build({ topicCount: n, includeCompanies: true, includeMiddle: true, outro: "full", includeThreadLine: true }));
    attempts.push(build({ topicCount: n, includeCompanies: false, includeMiddle: true, outro: "full", includeThreadLine: true }));
    attempts.push(build({ topicCount: n, includeCompanies: false, includeMiddle: true, outro: "short", includeThreadLine: true }));
    attempts.push(build({ topicCount: n, includeCompanies: false, includeMiddle: true, outro: "short", includeThreadLine: false }));
    attempts.push(build({ topicCount: n, includeCompanies: false, includeMiddle: false, outro: "short", includeThreadLine: false }));
    attempts.push(build({ topicCount: n, includeCompanies: false, includeMiddle: false, outro: "none", includeThreadLine: false }));
  }

  for (const txt of attempts) {
    if (txt.length <= 280) return txt;
  }

  // Absolute fallback
  const fallback = `I just built my ${days}-day study plan for ${targetRole} roles.\n\nBuilding the skills the JD actually asks for.\n#buildinpublic #Unlockd`;
  return fallback.length <= 280 ? fallback : fallback.slice(0, 277) + "...";
}

export function generateLinkedInPlanPost(data: PlanShareData): string {
  const days = data.days ?? 14;
  const targetRole = safeStr(data.targetRole) || "Software Engineer";
  const companies = Array.isArray(data.companies) ? data.companies.filter(Boolean) : [];
  const chosenSkills = Array.isArray(data.chosenSkills) ? data.chosenSkills.map(safeStr).filter(Boolean) : [];
  const topics = Array.isArray(data.topics) ? data.topics.map(safeStr).filter(Boolean) : [];
  const difficulty =
    data.difficulty === "beginner" || data.difficulty === "advanced" || data.difficulty === "intermediate"
      ? data.difficulty
      : "intermediate";

  const targetingClause =
    companies.length > 0 ? ` — targeting ${companies.slice(0, 2).join(", ")}` : "";

  const lines: string[] = [];
  lines.push("Honest post:");
  lines.push("");
  lines.push(`I've been applying for ${targetRole} roles and not hearing back.`);
  lines.push("");
  lines.push("So instead of sending more applications, I did a proper gap analysis");
  lines.push(`against ${data.totalTasks} real job tasks${targetingClause}.`);

  if (chosenSkills.length > 0) {
    lines.push("");
    lines.push("Turns out I was missing:");
    lines.push(...chosenSkills.slice(0, 4).map((s) => `→ ${s}`));
  }

  lines.push("");
  lines.push(`So I built a ${days}-day plan around exactly those gaps.`);
  lines.push("");
  lines.push(`Here's what I'm covering (${difficulty} level):`);
  lines.push("");

  const topicLines = topics.slice(0, 7).map((t, i) => `${i + 1}. ${t}`);
  if (topicLines.length > 0) lines.push(...topicLines);
  else lines.push("1. Your plan topics will appear here");

  if (topics.length > 7) {
    lines.push("");
    lines.push(`...and ${topics.length - 7} more`);
  }

  lines.push("");
  lines.push("No generic Udemy courses. No tutorial hell.");
  lines.push("Just the specific skills the roles I want actually require.");
  lines.push("");
  lines.push("Documenting everything publicly.");
  lines.push("If you're in the same boat — follow along.");
  lines.push("");
  lines.push("#jobsearch #buildinpublic #careerdevelopment #Unlockd");

  return cleanLines(lines);
}

