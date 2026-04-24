import type { AnalysisResult } from "./types";

export const mockAnalysisResult: AnalysisResult = {
  currentReadiness: 52,
  projectedReadiness: 79,
  summary:
    "You have strong communication and leadership foundations, but SQL, product metrics, and data visualization are holding you back from 3 of your 3 target roles. A focused 4-week sprint can close most of these gaps.",
  opportunityCoverage: {
    current: "1 of 3 roles",
    projected: "3 of 3 roles",
    explanation:
      "Right now you meet the baseline for the Business Analyst role. After completing the roadmap, you'll be competitive for all three.",
  },
  commonSkills: ["SQL", "Data Analysis", "Communication", "Problem Solving", "Excel/Sheets"],
  matchedSkills: [
    "Python basics",
    "Leadership",
    "Team collaboration",
    "Presentation skills",
    "Hackathon experience",
  ],
  missingSkills: [
    "SQL",
    "Product metrics",
    "Data visualization",
    "User research",
    "Agile/Scrum",
    "Dashboarding tools",
  ],
  prioritySkills: [
    {
      skill: "SQL",
      priority: "High",
      appearsIn: "3 of 3 roles",
      reason: "Required in every target role for data querying and reporting.",
      recommendedAction:
        "Complete SQLBolt (free, 2–3 hours) then build one query project on a public dataset.",
    },
    {
      skill: "Product Metrics",
      priority: "High",
      appearsIn: "2 of 3 roles",
      reason:
        "PM and BA roles both require understanding activation, retention, and conversion metrics.",
      recommendedAction:
        "Read Reforge's metrics guide and analyze one app's funnel in a doc.",
    },
    {
      skill: "Data Visualization",
      priority: "Medium",
      appearsIn: "2 of 3 roles",
      reason: "Dashboarding and chart-building appear in both analyst roles.",
      recommendedAction:
        "Build one Tableau Public or Google Looker Studio dashboard using a free dataset.",
    },
    {
      skill: "User Research",
      priority: "Medium",
      appearsIn: "2 of 3 roles",
      reason: "PM and UX-adjacent BA roles value research skills.",
      recommendedAction:
        "Conduct 3 informal user interviews and write a one-page synthesis.",
    },
    {
      skill: "Agile/Scrum",
      priority: "Low",
      appearsIn: "1 of 3 roles",
      reason: "TPM and PM roles mention Agile familiarity.",
      recommendedAction:
        "Complete a free Scrum fundamentals course (Scrum.org or Coursera).",
    },
  ],
  learningRoadmap: [
    {
      week: "Week 1",
      focus: "SQL Fundamentals",
      tasks: [
        "Complete SQLBolt lessons 1–12",
        "Write 20 practice queries on a public dataset",
        "Push queries to a GitHub repo",
      ],
      proofOfWork:
        "GitHub repo with 20+ SQL queries and a README explaining what each one does.",
    },
    {
      week: "Week 2",
      focus: "Product Metrics & Analytics Thinking",
      tasks: [
        "Read Reforge metrics primer",
        "Pick one app and define 5 key metrics",
        "Write a one-page metrics breakdown",
      ],
      proofOfWork: "One-page PDF or Notion doc: 'Metrics Breakdown for [App Name]'",
    },
    {
      week: "Week 3",
      focus: "Data Visualization",
      tasks: [
        "Create a free Tableau Public or Looker Studio account",
        "Find a public dataset (Kaggle or data.gov)",
        "Build a 3-chart dashboard",
      ],
      proofOfWork:
        "Published Tableau Public link or screenshot of Looker Studio dashboard.",
    },
    {
      week: "Week 4",
      focus: "Portfolio Polish & Resume Update",
      tasks: [
        "Add SQL project to resume with impact statement",
        "Add dashboard link to LinkedIn",
        "Write 2 STAR-format stories using new skills",
      ],
      proofOfWork:
        "Updated resume PDF and LinkedIn profile with new projects visible.",
    },
  ],
  recommendedCourses: [
    {
      name: "SQLBolt",
      type: "Practice Resource",
      reason:
        "Free, interactive SQL lessons — fastest way to go from zero to functional SQL.",
    },
    {
      name: "Google Data Analytics Certificate",
      type: "Certification",
      reason:
        "Covers SQL, spreadsheets, Tableau, and R. Recognized by employers and free to audit.",
    },
    {
      name: "Reforge Metrics Course",
      type: "Course",
      reason:
        "Industry-standard product metrics framework used at top tech companies.",
    },
    {
      name: "Tableau Public Training",
      type: "Practice Resource",
      reason:
        "Free official training for the most common data viz tool in BA/DA job postings.",
    },
  ],
  portfolioProjects: [
    {
      title: "Job Market Skills Dashboard",
      description:
        "Scrape or manually collect 20 job postings in your target roles. Build a dashboard showing the most common required skills, salary ranges, and location distribution.",
      skillsDemonstrated: ["SQL", "Data Visualization", "Research", "Tableau"],
    },
    {
      title: "Product Metrics Teardown",
      description:
        "Pick a consumer app you use daily. Define its north star metric, 3 supporting metrics, and one experiment you'd run to improve retention. Write it up as a 1-page case study.",
      skillsDemonstrated: ["Product Metrics", "Analytical Thinking", "Communication"],
    },
    {
      title: "SQL Business Analysis Project",
      description:
        "Use a public e-commerce or SaaS dataset. Write 10 SQL queries answering real business questions: revenue by segment, churn rate, top customers, etc.",
      skillsDemonstrated: ["SQL", "Business Analysis", "Data Storytelling"],
    },
  ],
  resumeSuggestions: [
    "Add a 'Technical Skills' section listing SQL (in progress), Python, and any tools you've used.",
    "Quantify your leadership experience — instead of 'led a team', write 'led a 5-person team that delivered X in Y weeks'.",
    "Add your SQL and dashboard projects as soon as they're done — even in-progress projects show initiative.",
    "Replace generic verbs (helped, worked on, assisted) with action verbs (analyzed, built, designed, led, shipped).",
    "Add a one-line summary at the top: 'Business/data-focused student with Python background, building SQL and analytics skills for PM and analyst roles.'",
  ],
  mentorStyleAdvice:
    "You're closer than you think. Your leadership and Python background already set you apart from most applicants. The gap is mostly technical — SQL and metrics — and those are learnable in weeks, not months. Don't wait until you're 'ready' to apply. Start the roadmap, build the projects, and apply in parallel. Employers hiring interns care more about trajectory than perfection. Show them you're moving fast.",
};
