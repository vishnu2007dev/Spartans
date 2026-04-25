import { ScoreResult, GapsResult, FocusResult, PlanResult, ParsedResume } from "./types";

export function getMockParsedResume(): ParsedResume {
  return {
    skills: ["Python", "Excel", "Critical Thinking", "Teamwork", "Time Management"],
    experience: [
      {
        company: "Acme Corp",
        title: "Data Intern",
        dates: "June 2024 - Aug 2024",
        highlights: ["Analyzed data using Python", "Built Excel dashboards"]
      },
      {
        company: "State University",
        title: "Research Assistant",
        dates: "Jan 2024 - May 2024",
        highlights: ["Conducted literature reviews", "Cleaned datasets for analysis"]
      }
    ],
    education: [
      {
        institution: "State University",
        degree: "B.S. Computer Science",
        year: "2025"
      }
    ],
    rawText: "Mock resume text placeholder.",
  };
}

export function getMockScore(): ScoreResult {
  return {
    overallScore: 42,
    projectedScore: 78,
    matchedSkills: ["Python", "Excel", "Critical Thinking", "Teamwork", "Time Management"],
    missingSkills: ["SQL", "Tableau", "Power BI", "Agile Methodology", "Stakeholder Management", "A/B Testing"],
    pros: [
      "Strong foundation in Python and Data Analysis",
      "Good academic background with relevant coursework",
      "Demonstrated soft skills like teamwork and critical thinking"
    ],
    cons: [
      "Lacks hands-on experience with SQL databases",
      "No direct experience building live dashboards for stakeholders",
      "Missing Agile/Scrum familiarity required for some roles"
    ],
    skillRadar: [
      { category: "Technical Skills", score: 45 },
      { category: "Tools & Frameworks", score: 30 },
      { category: "Experience Match", score: 50 },
      { category: "Soft Skills", score: 85 },
      { category: "Domain Relevance", score: 60 }
    ],
    perJob: [
      { title: "Data Analyst Intern", company: "Meridian Analytics", score: 55, matchedCount: 3, totalRequired: 5 },
      { title: "Product Manager Intern", company: "NovaTech", score: 40, matchedCount: 2, totalRequired: 5 },
      { title: "Business Analyst Intern", company: "Apex Consulting", score: 35, matchedCount: 2, totalRequired: 5 },
    ],
    summary:
      "You have a solid foundation with Python and analytical thinking, but you're missing key tools like SQL and Tableau that appear across most of your target roles. Focusing on these will significantly boost your readiness.",
  };
}

export function getMockGaps(): GapsResult {
  return {
    gaps: [
      { item: "SQL", category: "skill", importance: "critical", appearsIn: "4 of 5 jobs", reason: "Required for data extraction and analysis across all analyst roles." },
      { item: "Tableau", category: "tooling", importance: "critical", appearsIn: "3 of 5 jobs", reason: "Primary visualization tool requested by data and analytics roles." },
      { item: "Agile/Scrum", category: "skill", importance: "critical", appearsIn: "3 of 5 jobs", reason: "Standard methodology for PM and TPM roles." },
      { item: "Stakeholder Management", category: "experience", importance: "nice-to-have", appearsIn: "3 of 5 jobs", reason: "Important for PM roles but learnable through projects." },
      { item: "AWS Certified Cloud Practitioner", category: "cert", importance: "nice-to-have", appearsIn: "2 of 5 jobs", reason: "Preferred but not required for most roles." },
      { item: "Power BI", category: "tooling", importance: "nice-to-have", appearsIn: "2 of 5 jobs", reason: "Alternative to Tableau; knowing one covers both." },
    ],
    summary: "SQL and Tableau are your most critical gaps — they appear in almost every target role. Agile knowledge is the third priority for PM-track roles.",
  };
}

export function getMockFocus(): FocusResult {
  return {
    clusteredSkills: [
      { skill: "SQL", appearsIn: "4 of 5 jobs", rationale: "Single highest-leverage skill across all your target roles.", category: "skill" },
      { skill: "Data Visualization (Tableau/Power BI)", appearsIn: "3 of 5 jobs", rationale: "Pairs with SQL to complete the core analyst toolkit.", category: "tooling" },
      { skill: "Agile/Scrum", appearsIn: "3 of 5 jobs", rationale: "Required for PM and TPM tracks; quick to learn with a certification.", category: "skill" },
      { skill: "Stakeholder Management", appearsIn: "3 of 5 jobs", rationale: "Differentiates PM candidates; can be demonstrated through project leadership.", category: "experience" },
      { skill: "Statistical Analysis", appearsIn: "2 of 5 jobs", rationale: "Elevates data analyst applications beyond tool proficiency.", category: "skill" },
    ],
  };
}

export function getMockPlan(): PlanResult {
  return {
    days: 14,
    difficulty: "intermediate",
    projectedReadinessGain: 36,
    plan: [
      {
        day: 1,
        topic: "SQL Foundations",
        tasks: ["Complete SQLZoo SELECT basics (sections 1-4)", "Write 10 queries on a sample dataset", "Read about relational database concepts"],
        resources: [
          { title: "SQLZoo Interactive Tutorial", url: "https://sqlzoo.net/wiki/SELECT_basics", type: "practice", estimatedMinutes: 90 },
          { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", type: "article", estimatedMinutes: 30 },
        ],
        proofOfWork: "Push a GitHub Gist with 10 SQL queries solving real business questions, each with a comment explaining your approach.",
      },
      {
        day: 2,
        topic: "SQL JOINs and Aggregations",
        tasks: ["Complete SQLZoo JOIN section", "Practice GROUP BY, HAVING, COUNT, SUM on Kaggle dataset", "Solve 5 LeetCode SQL problems"],
        resources: [
          { title: "SQLZoo JOIN", url: "https://sqlzoo.net/wiki/The_JOIN_operation", type: "practice", estimatedMinutes: 60 },
          { title: "LeetCode SQL 50", url: "https://leetcode.com/studyplan/top-sql-50/", type: "practice", estimatedMinutes: 60 },
        ],
        proofOfWork: "Screenshot of 5 solved LeetCode SQL problems added to your GitHub profile README.",
      },
      {
        day: 3,
        topic: "Tableau Basics",
        tasks: ["Install Tableau Public (free)", "Connect to a public CSV dataset", "Build your first bar and line chart"],
        resources: [
          { title: "Tableau Public Download", url: "https://public.tableau.com/app/resources/learn", type: "course", estimatedMinutes: 120 },
          { title: "Tableau Training Videos", url: "https://www.tableau.com/learn/training/20221", type: "video", estimatedMinutes: 60 },
        ],
        proofOfWork: "Publish a Tableau Public workbook with at least 2 chart types. Share the public link.",
      },
    ],
  };
}
