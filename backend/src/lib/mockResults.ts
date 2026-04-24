import { AnalysisResult } from "./types";

/**
 * Returns mock analysis results for fallback when AI API fails.
 * This data conforms to the AnalysisResult interface and passes analysisResultSchema validation.
 * 
 * Validates Requirements 9.1, 9.2, 9.3
 */
export function getMockResults(): AnalysisResult {
  return {
    currentReadiness: 42,
    projectedReadiness: 78,
    summary:
      "You have a solid foundation with some technical and analytical skills, but you're missing key competencies that appear across your target roles. By focusing on data analysis tools, project management fundamentals, and communication skills over the next few weeks, you can significantly boost your readiness and qualify for 3-4 of your selected opportunities.",
    opportunityCoverage: {
      current: "1 out of 5 roles",
      projected: "4 out of 5 roles",
      explanation:
        "Right now, you partially qualify for one role due to overlapping technical skills. After completing the roadmap, you'll have the core competencies needed for four of your target positions, with only specialized roles requiring additional preparation.",
    },
    commonSkills: [
      "Data Analysis",
      "SQL",
      "Excel",
      "Communication",
      "Problem Solving",
      "Project Management",
    ],
    matchedSkills: [
      "Python",
      "Excel",
      "Critical Thinking",
      "Teamwork",
      "Time Management",
    ],
    missingSkills: [
      "SQL",
      "Tableau",
      "Power BI",
      "Data Visualization",
      "Agile Methodology",
      "Stakeholder Management",
      "Business Requirements Gathering",
      "A/B Testing",
      "Statistical Analysis",
      "Jira",
    ],
    prioritySkills: [
      {
        skill: "SQL",
        priority: "High",
        appearsIn: "4 out of 5 roles",
        reason:
          "SQL is the most frequently required skill across your selected positions. It's essential for data analysis, business intelligence, and technical program management roles.",
        recommendedAction:
          "Complete a SQL fundamentals course and practice writing queries on real datasets. Aim to build 2-3 portfolio projects that showcase data extraction and analysis.",
      },
      {
        skill: "Data Visualization",
        priority: "High",
        appearsIn: "4 out of 5 roles",
        reason:
          "The ability to present data insights visually is critical for analyst and PM roles. Employers want to see you can turn raw data into actionable insights.",
        recommendedAction:
          "Learn Tableau or Power BI through hands-on projects. Create a portfolio dashboard that tells a compelling data story.",
      },
      {
        skill: "Agile Methodology",
        priority: "High",
        appearsIn: "3 out of 5 roles",
        reason:
          "Agile is the standard project management framework in tech. Understanding sprints, standups, and backlogs is essential for PM and TPM roles.",
        recommendedAction:
          "Take a short Agile/Scrum course and get certified. Practice by organizing a personal project using Agile principles.",
      },
      {
        skill: "Stakeholder Management",
        priority: "Medium",
        appearsIn: "3 out of 5 roles",
        reason:
          "Product and program management roles require coordinating across teams and communicating with non-technical stakeholders.",
        recommendedAction:
          "Study stakeholder mapping and communication frameworks. Highlight any group projects or leadership experiences where you coordinated multiple parties.",
      },
      {
        skill: "Statistical Analysis",
        priority: "Medium",
        appearsIn: "2 out of 5 roles",
        reason:
          "Data analyst roles expect you to understand statistical concepts like hypothesis testing, regression, and significance.",
        recommendedAction:
          "Complete a statistics for data analysis course. Practice applying statistical methods to real-world datasets.",
      },
      {
        skill: "Jira",
        priority: "Low",
        appearsIn: "2 out of 5 roles",
        reason:
          "Jira is a common tool for tracking work in Agile teams, but it's easy to learn on the job.",
        recommendedAction:
          "Familiarize yourself with Jira's interface through free tutorials. Mention your willingness to learn project management tools in your resume.",
      },
    ],
    learningRoadmap: [
      {
        week: "Week 1",
        focus: "SQL Fundamentals & Data Analysis Basics",
        tasks: [
          "Complete SQL basics course (SELECT, WHERE, JOIN, GROUP BY, aggregate functions)",
          "Practice 20 SQL queries on a platform like SQLZoo or LeetCode",
          "Learn Excel pivot tables and VLOOKUP if not already proficient",
          "Read 2 articles on data-driven decision making",
        ],
        proofOfWork:
          "Submit a GitHub gist with 10 SQL queries solving real-world business questions, with comments explaining your approach.",
      },
      {
        week: "Week 2",
        focus: "Data Visualization & Storytelling",
        tasks: [
          "Complete Tableau Public or Power BI introductory course",
          "Create your first dashboard using a public dataset (e.g., Kaggle)",
          "Study data storytelling principles (context, narrative, visual hierarchy)",
          "Review 3 professional dashboards and analyze what makes them effective",
        ],
        proofOfWork:
          "Publish a Tableau Public dashboard analyzing a dataset of your choice. Write a 1-page summary explaining your insights and design decisions.",
      },
      {
        week: "Week 3",
        focus: "Agile & Project Management Fundamentals",
        tasks: [
          "Complete a free Agile/Scrum fundamentals course (Coursera, Udemy, or Scrum.org)",
          "Learn key Agile concepts: sprints, user stories, backlog grooming, retrospectives",
          "Explore Jira or Trello and create a sample project board",
          "Read case studies on Agile transformations in tech companies",
        ],
        proofOfWork:
          "Earn a free Scrum certification (e.g., Scrum Fundamentals Certified) or create a detailed project plan for a hypothetical product feature using Agile methodology.",
      },
      {
        week: "Week 4",
        focus: "Portfolio Projects & Resume Optimization",
        tasks: [
          "Build a capstone project combining SQL, data visualization, and analysis",
          "Write a project README explaining the problem, your approach, and key findings",
          "Update your resume with new skills, certifications, and portfolio links",
          "Practice explaining your projects in 2-minute elevator pitches",
        ],
        proofOfWork:
          "Publish your capstone project on GitHub with a polished README. Update your LinkedIn profile and resume to reflect your new skills and projects.",
      },
    ],
    recommendedCourses: [
      {
        name: "SQL for Data Analysis (Udacity or Mode Analytics)",
        type: "Course",
        reason:
          "Covers SQL fundamentals with a focus on real-world data analysis scenarios. Includes hands-on exercises with business datasets.",
      },
      {
        name: "Tableau Desktop Specialist Certification",
        type: "Certification",
        reason:
          "Industry-recognized credential that demonstrates proficiency in data visualization. Employers value Tableau skills for analyst roles.",
      },
      {
        name: "Google Data Analytics Professional Certificate (Coursera)",
        type: "Course",
        reason:
          "Comprehensive program covering data cleaning, analysis, visualization, and storytelling. Includes a capstone project for your portfolio.",
      },
      {
        name: "Scrum Fundamentals Certified (SFC) by SCRUMstudy",
        type: "Certification",
        reason:
          "Free certification that validates your understanding of Agile/Scrum principles. Great for PM and TPM roles.",
      },
      {
        name: "LeetCode SQL 50 Study Plan",
        type: "Practice Resource",
        reason:
          "Structured practice problems that build SQL proficiency. Many companies use similar questions in technical interviews.",
      },
      {
        name: "Kaggle Learn: Data Visualization",
        type: "Practice Resource",
        reason:
          "Free, hands-on tutorials for creating effective visualizations in Python. Complements Tableau/Power BI skills.",
      },
    ],
    portfolioProjects: [
      {
        title: "E-Commerce Sales Analysis Dashboard",
        description:
          "Analyze a public e-commerce dataset to identify sales trends, customer segments, and product performance. Build an interactive Tableau dashboard showing key metrics like revenue by region, top-selling products, and customer lifetime value. Write SQL queries to extract and transform the data.",
        skillsDemonstrated: [
          "SQL",
          "Data Visualization",
          "Tableau",
          "Data Analysis",
          "Business Intelligence",
        ],
      },
      {
        title: "Agile Project Simulation: Mobile App Feature Launch",
        description:
          "Create a detailed project plan for launching a new mobile app feature using Agile methodology. Define user stories, acceptance criteria, sprint goals, and a backlog. Use Jira or Trello to organize tasks. Document sprint retrospectives and lessons learned.",
        skillsDemonstrated: [
          "Agile Methodology",
          "Project Management",
          "Jira",
          "Stakeholder Management",
          "User Stories",
        ],
      },
      {
        title: "A/B Test Analysis: Website Conversion Optimization",
        description:
          "Design and analyze a hypothetical A/B test for a website conversion funnel. Use statistical methods to determine if a new design significantly improves conversion rates. Present findings in a report with visualizations and actionable recommendations.",
        skillsDemonstrated: [
          "A/B Testing",
          "Statistical Analysis",
          "Data Visualization",
          "Excel",
          "Data-Driven Decision Making",
        ],
      },
    ],
    resumeSuggestions: [
      "Add a 'Technical Skills' section prominently listing SQL, Python, Excel, Tableau, and any other tools you've learned.",
      "Quantify your achievements with metrics (e.g., 'Analyzed dataset of 50,000+ records' or 'Improved process efficiency by 20%').",
      "Reframe coursework and class projects as 'Projects' with bullet points describing your role, tools used, and outcomes.",
      "Include links to your GitHub, Tableau Public profile, and LinkedIn in your contact section.",
      "Tailor your resume for each application by emphasizing the skills mentioned in the job description.",
      "Use action verbs like 'Analyzed,' 'Designed,' 'Optimized,' 'Collaborated,' and 'Presented' to start bullet points.",
      "Add your Scrum certification and any other relevant certifications to an 'Education & Certifications' section.",
      "Keep your resume to one page if you're a student or early-career professional. Prioritize impact over length.",
    ],
    mentorStyleAdvice:
      "You're at an exciting stage where a few focused weeks of learning can unlock multiple opportunities. The key is to be strategic: don't try to learn everything at once. Focus on the high-impact skills that appear across most of your target roles—SQL and data visualization are your biggest leverage points right now. Build projects that tell a story and demonstrate real problem-solving, not just tool proficiency. Employers want to see that you can take messy data, analyze it, and communicate insights clearly. Also, don't underestimate the power of networking and informational interviews. Reach out to people in the roles you're targeting and ask about their day-to-day work. This will help you speak their language in interviews and refine your learning priorities. Finally, remember that internships and entry-level roles are learning opportunities—employers expect you to grow on the job. Show curiosity, a willingness to learn, and a track record of following through on projects, and you'll stand out. You've got this!",
  };
}
