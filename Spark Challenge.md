# **Unlockd — System Architecture, Product Workflow, and Team Plan**

## **1\. Product Name**

## **Unlockd**

### **Tagline**

Unlock your next opportunity with a personalized skill roadmap.

---

## **2\. Core Product Hypothesis**

Students and early-career job seekers do not usually target just one job. They apply to many roles, but without mentors, they do not know which skills matter most across those opportunities.

### **Hypothesis**

If users upload their current profile and multiple job descriptions, Unlockd can identify the most important shared skill gaps and generate one optimized learning path that increases their readiness across multiple roles.

---

## **3\. Problem Statement**

Most students are not lazy or unqualified. They are under-guided.

They often ask:

* What skills am I missing?  
* Which role am I closest to?  
* What should I learn first?  
* Which courses or certifications are worth my time?  
* How do I prepare for multiple opportunities without wasting effort?

Unlockd solves this by turning scattered job descriptions into a clear learning strategy.

---

## **4\. Target User**

Primary users:

* College students  
* First-generation students  
* International students  
* Career switchers  
* Students without strong mentor networks

Core use case:

“I have 3–5 jobs I might apply to. Tell me what I should learn to become more eligible for all of them.”

---

## **5\. Impact Statement**

Unlockd democratizes career mentorship.

Instead of relying on insider knowledge, students can upload job descriptions and their current profile to receive a structured roadmap showing what to learn, build, and prove.

### **Strong impact line**

Unlockd helps students stop applying blindly and start preparing strategically.

---

# **6\. Product Workflow**

## **Step 1: User uploads current profile**

Input options:

* Resume text  
* LinkedIn profile text  
* Skills summary  
* Manual profile form

For MVP, **paste text is enough**. File upload is nice but not required.

---

## **Step 2: User uploads multiple job descriptions**

User pastes 2–5 job descriptions.

Each job description should include:

* Job title  
* Company  
* Responsibilities  
* Required qualifications  
* Preferred qualifications

---

## **Step 3: AI extracts job requirements**

Unlockd identifies:

* Common skills across jobs  
* Role-specific skills  
* Tools mentioned  
* Certifications mentioned  
* Experience expectations  
* Soft skills  
* Repeated keywords

---

## **Step 4: AI compares user profile against jobs**

Unlockd identifies:

* Skills user already has  
* Weak skills  
* Missing skills  
* Transferable strengths  
* Experience gaps  
* Resume keyword gaps

---

## **Step 5: Unlockd prioritizes skills**

The app should not say “learn everything.”

It should answer:

“What skills unlock the most opportunities?”

Priority logic:

Skill Priority \=  
frequency across job descriptions  
\+ importance in required qualifications  
\+ impact on opportunity coverage  
\- current user strength  
---

## **Step 6: AI generates optimized roadmap**

Output:

* Current readiness score  
* Future readiness score  
* Opportunity coverage score  
* Top missing skills  
* Recommended learning path  
* Suggested courses/certifications  
* Portfolio project ideas  
* Resume improvement suggestions

---

## **Step 7: User receives final dashboard**

Dashboard sections:

1. **Readiness Snapshot**  
2. **Opportunity Coverage**  
3. **Top Skills to Unlock**  
4. **Learning Roadmap**  
5. **Recommended Courses/Certifications**  
6. **Portfolio Projects**  
7. **Resume Upgrade Suggestions**

---

# **7\. System Architecture**

User  
↓  
Unlockd Frontend  
↓  
Profile Input \+ Multiple JD Input  
↓  
Analyze Button  
↓  
Kiro-built API Route  
↓  
AI Analysis Engine  
↓  
Structured JSON Output  
↓  
Results Dashboard  
↓  
Shareable Roadmap / Demo Output  
---

# **8\. Technical Architecture**

## **Frontend**

Recommended:

* React / Next.js  
* Tailwind CSS  
* Simple component-based structure

Main screens:

/  
Landing page

/analyze  
Profile \+ job description input

/results  
AI-generated dashboard

/share  
Mock shareable roadmap  
---

## **Backend**

Recommended:

* Next.js API route  
* AI API call  
* JSON parser  
* Basic validation

Main endpoint:

POST /api/analyze

Input:

{  
 "profile": "User resume/profile text",  
 "jobDescriptions": \[  
   "Job description 1",  
   "Job description 2",  
   "Job description 3"  
 \],  
 "timeline": "4 weeks"  
}

Output:

{  
 "currentReadiness": 58,  
 "projectedReadiness": 82,  
 "opportunityCoverage": {  
   "current": "1/4 roles",  
   "projected": "3/4 roles"  
 },  
 "commonSkills": \["SQL", "Product Metrics", "Communication"\],  
 "matchedSkills": \["Python", "Leadership", "Hackathon Projects"\],  
 "missingSkills": \["SQL", "Dashboarding", "User Research"\],  
 "prioritySkills": \[  
   {  
     "skill": "SQL",  
     "reason": "Appears in 4 of 4 job descriptions",  
     "priority": "High"  
   }  
 \],  
 "learningRoadmap": \[  
   {  
     "week": "Week 1",  
     "focus": "SQL fundamentals",  
     "tasks": \["Complete SQLBolt lessons", "Practice 20 queries"\]  
   }  
 \],  
 "recommendedCourses": \[  
   {  
     "name": "Google Data Analytics Certificate",  
     "reason": "Supports SQL and analytics readiness"  
   }  
 \],  
 "portfolioProjects": \[  
   {  
     "title": "Job Market Skills Dashboard",  
     "description": "Build a simple dashboard analyzing skill frequency across job posts"  
   }  
 \],  
 "resumeSuggestions": \[  
   "Add measurable impact to leadership experience",  
   "Include SQL project after completion"  
 \]  
}  
---

# **9\. MVP Scope**

## **Must-have**

* Landing page  
* Input page  
* Ability to paste profile  
* Ability to paste 2–5 job descriptions  
* Analyze button  
* AI-generated structured result  
* Dashboard output  
* Clean pitch-ready UI

## **Should-have**

* Timeline selector: 2 weeks / 4 weeks / 8 weeks  
* Readiness score  
* Opportunity coverage score  
* Skill priority list  
* Course/certification suggestions

## **Nice-to-have**

* File upload  
* Shareable roadmap  
* Progress tracker  
* Login/auth  
* Saved roadmaps

## **Do not build unless extra time**

* Real job board integration  
* Real course API integration  
* Payment system  
* Complex authentication  
* Community platform

---

# **10\. Team Role Split**

## **Om Patel — Frontend Lead**

Owns:

* Landing page  
* Input form  
* Results dashboard  
* UI polish  
* Responsive design  
* Demo flow

Kiro prompts for this person:

Build a clean Next.js and Tailwind frontend for Unlockd.  
Create a landing page, an analyze page with profile and multiple job description text areas, and a results dashboard that displays readiness score, opportunity coverage, matched skills, missing skills, priority skills, learning roadmap, recommended courses, portfolio projects, and resume suggestions.  
Use mock data first so the UI can be tested before the API is ready.  
---

## **Vishnu — Backend / AI Lead**

Owns:

* API route  
* AI prompt  
* JSON response structure  
* Skill extraction logic  
* Error handling  
* Connecting frontend to backend

Kiro prompt for this person:

Create a Next.js API route called /api/analyze for Unlockd.  
It should accept a user profile, an array of job descriptions, and a timeline.  
It should call an AI model and return structured JSON containing readiness scores, opportunity coverage, common skills, matched skills, missing skills, priority skills, learning roadmap, recommended courses, portfolio project ideas, and resume suggestions.  
Add validation and fallback mock output if the AI response fails.  
---

## **Keshava — Product, Story, Impact, Pitch Lead**

Owns:

* Product positioning  
* Impact narrative  
* Slide deck  
* Demo script  
* Judge Q\&A  
* UI copy  
* Feature prioritization  
* Making sure the product matches the education/agency guardrail

Your main job:

Make Unlockd feel like a meaningful career access platform, not just another AI resume checker.

---

# **11\. Kiro Build Strategy**

Use Kiro’s **Specs** feature first because specs are meant to break features into requirements, design docs, and trackable tasks.

## **Step 1: Create Kiro Steering Docs**

Create or generate:

.kiro/steering/product.md  
.kiro/steering/tech.md  
.kiro/steering/structure.md

Kiro docs describe these as foundational files for product purpose, chosen tech stack, and project organization.

---

## **`product.md`**

Paste this:

\# Unlockd Product Overview

Unlockd is an AI-powered career preparation platform for students and early-career job seekers without strong mentor networks.

Users upload their current profile and multiple job descriptions. Unlockd analyzes the gap between where they are and where they want to go, then creates one optimized learning roadmap that helps them prepare for the greatest number of opportunities.

Core principles:  
\- AI should guide, not replace effort.  
\- The user must still learn, build, and apply.  
\- Preparation should be strategic, not random.  
\- The product should make career pathways more transparent and accessible.

Primary users:  
\- College students  
\- First-generation students  
\- International students  
\- Career switchers  
\- Early-career applicants

Core output:  
\- Readiness score  
\- Opportunity coverage score  
\- Matched skills  
\- Missing skills  
\- Prioritized learning roadmap  
\- Suggested certifications/courses  
\- Portfolio project ideas  
\- Resume improvement suggestions  
---

## **`tech.md`**

Paste this:

\# Unlockd Tech Stack

Framework:  
\- Next.js  
\- React  
\- TypeScript

Styling:  
\- Tailwind CSS

Backend:  
\- Next.js API routes

AI:  
\- Use an AI API to analyze profile and job descriptions.  
\- The AI response must return structured JSON.  
\- If the AI call fails, return mock fallback data so the demo still works.

State:  
\- Use local component state for MVP.  
\- No database required for the hackathon MVP.

Data:  
\- User profile text  
\- 2-5 pasted job descriptions  
\- Timeline selection

Do not build:  
\- Authentication  
\- Payment  
\- Real job board integration  
\- Complex database schema  
---

## **`structure.md`**

Paste this:

\# Unlockd Project Structure

Recommended structure:

/app  
 /page.tsx  
 /analyze/page.tsx  
 /results/page.tsx  
 /api/analyze/route.ts

/components  
 LandingHero.tsx  
 ProfileInput.tsx  
 JobDescriptionInput.tsx  
 TimelineSelector.tsx  
 ResultsDashboard.tsx  
 ScoreCard.tsx  
 SkillList.tsx  
 RoadmapTimeline.tsx  
 CourseRecommendations.tsx  
 ProjectRecommendations.tsx  
 ResumeSuggestions.tsx

/lib  
 mockResults.ts  
 aiPrompt.ts  
 types.ts

Design principles:  
\- Keep UI clean and demo-friendly.  
\- Use cards for dashboard sections.  
\- Make scores visually obvious.  
\- Use simple language for students.  
\- Avoid clutter.  
---

# **12\. Kiro Spec Prompt**

Use this as the main Kiro spec prompt:

Create a full feature spec for Unlockd, an AI-powered career preparation platform.

Users paste their current resume/profile and 2-5 job descriptions. The system analyzes the gap between the user's current profile and the requirements across all job descriptions. It generates a readiness score, opportunity coverage score, common skills, matched skills, missing skills, prioritized skill gaps, a personalized learning roadmap, recommended courses/certifications, portfolio project ideas, and resume improvement suggestions.

This is for students and early-career applicants without mentors. The education guardrail is that AI should guide the user, not do the work for them.

Create:  
1\. requirements.md with user stories and acceptance criteria  
2\. design.md with system architecture and data flow  
3\. tasks.md with implementation tasks for a Next.js \+ Tailwind \+ API route MVP  
---

# **13\. Product Requirements**

## **User Story 1**

As a student, I want to paste my current profile so the system understands my background.

Acceptance criteria:

WHEN the user enters profile text  
THE SYSTEM SHALL store the profile text temporarily for analysis.

## **User Story 2**

As a student, I want to paste multiple job descriptions so I can prepare for more than one opportunity.

Acceptance criteria:

WHEN the user enters at least two job descriptions  
THE SYSTEM SHALL allow the user to run the analysis.

## **User Story 3**

As a student, I want to see which skills appear across multiple jobs.

Acceptance criteria:

WHEN the analysis is complete  
THE SYSTEM SHALL show common skills across the uploaded job descriptions.

## **User Story 4**

As a student, I want to see my missing skills prioritized.

Acceptance criteria:

WHEN missing skills are identified  
THE SYSTEM SHALL rank them by importance and opportunity impact.

## **User Story 5**

As a student, I want a clear learning path.

Acceptance criteria:

WHEN the roadmap is generated  
THE SYSTEM SHALL organize tasks by week and include specific learning actions.

## **User Story 6**

As a student, I want course and certification suggestions.

Acceptance criteria:

WHEN skill gaps are identified  
THE SYSTEM SHALL recommend relevant courses or certifications for the highest-priority gaps.  
---

# **14\. AI Prompt for Backend**

Use this inside `/lib/aiPrompt.ts`:

You are Unlockd, an AI career preparation assistant.

Your job is to help students and early-career applicants prepare for multiple job opportunities. You do not apply to jobs for them. You do not write fake experience. You guide them toward real learning, projects, and proof of skill.

Analyze the user's current profile and the provided job descriptions.

Return ONLY valid JSON with this structure:

{  
 "currentReadiness": number,  
 "projectedReadiness": number,  
 "summary": string,  
 "opportunityCoverage": {  
   "current": string,  
   "projected": string,  
   "explanation": string  
 },  
 "commonSkills": string\[\],  
 "matchedSkills": string\[\],  
 "missingSkills": string\[\],  
 "prioritySkills": \[  
   {  
     "skill": string,  
     "priority": "High" | "Medium" | "Low",  
     "appearsIn": string,  
     "reason": string,  
     "recommendedAction": string  
   }  
 \],  
 "learningRoadmap": \[  
   {  
     "week": string,  
     "focus": string,  
     "tasks": string\[\],  
     "proofOfWork": string  
   }  
 \],  
 "recommendedCourses": \[  
   {  
     "name": string,  
     "type": "Course" | "Certification" | "Practice Resource",  
     "reason": string  
   }  
 \],  
 "portfolioProjects": \[  
   {  
     "title": string,  
     "description": string,  
     "skillsDemonstrated": string\[\]  
   }  
 \],  
 "resumeSuggestions": string\[\],  
 "mentorStyleAdvice": string  
}

Important rules:  
\- Focus on honest upskilling.  
\- Do not exaggerate the user's experience.  
\- Prioritize skills that appear across multiple job descriptions.  
\- Make the roadmap realistic for the selected timeline.  
\- Use simple language.  
\- Make recommendations actionable.  
---

# **15\. Dashboard Layout**

## **Top section**

Unlockd Results  
Your optimized path to more opportunities

Cards:

Current Readiness: 58%  
Projected Readiness: 82%  
Opportunity Coverage: 1/4 → 3/4 roles  
Top Unlock Skill: SQL  
---

## **Middle section**

Skills You Already Have  
\- Python  
\- Leadership  
\- Hackathon experience  
\- Communication

Skills Holding You Back  
\- SQL  
\- Product metrics  
\- Data visualization  
\- User research  
---

## **Priority section**

Top Skills to Unlock More Roles

1\. SQL — High Priority  
Appears in 4/4 roles.  
Recommended action: Complete SQL basics and build one query project.

2\. Product Metrics — High Priority  
Appears in 3/4 roles.  
Recommended action: Learn activation, retention, conversion, and engagement metrics.  
---

## **Roadmap section**

4-Week Unlock Plan

Week 1: SQL Fundamentals  
Tasks:  
\- Complete SQLBolt lessons 1–12  
\- Practice 20 SQL queries  
Proof:  
\- Upload GitHub repo or screenshots of completed exercises

Week 2: Product Metrics  
Tasks:  
\- Learn common SaaS metrics  
\- Analyze one product and define 5 key metrics  
Proof:  
\- Write a one-page metrics breakdown  
---

# **16\. Demo Data to Use**

Use roles that make sense for students:

* Product Manager Intern  
* Business Analyst Intern  
* Technical Program Manager Intern  
* Data Analyst Intern

Example missing skills:

* SQL  
* Product metrics  
* Data visualization  
* User research  
* Agile  
* Dashboarding

Example strengths:

* Leadership  
* Hackathons  
* Python  
* Team projects  
* Communication

---

# **17\. Presentation Structure**

## **Slide 1: Title**

**Unlockd**  
 Unlock your next opportunity with a personalized skill roadmap.

---

## **Slide 2: Problem**

Students apply to many jobs, but prepare randomly.

Without mentors, they do not know:

* What they are missing  
* What matters across roles  
* What to learn first  
* How to prove readiness

---

## **Slide 3: Solution**

Unlockd lets users upload their profile and multiple job descriptions.

It creates:

* Gap analysis  
* Opportunity coverage score  
* Prioritized skills  
* Learning roadmap  
* Courses/certifications  
* Portfolio projects

---

## **Slide 4: Demo**

Show:

1. Paste profile  
2. Paste job descriptions  
3. Click analyze  
4. Results dashboard  
5. Roadmap

---

## **Slide 5: Impact**

Unlockd makes career guidance more accessible.

Students without mentors can now get a structured, personalized path toward opportunity.

---

## **Slide 6: Story / Scale**

One roadmap can become reusable.

Future version:

* Students can publish successful paths  
* Others can copy roadmaps  
* Schools and career centers can support more students at scale

---

## **Slide 7: Closing**

Unlockd helps students stop applying blindly and start preparing strategically.

---

# **18\. Pitch Script**

Use this:

Most students do not apply to one job. They apply to many. But without mentors, they do not know how to prepare across those opportunities. They guess what skills to learn, waste time on random courses, and apply without knowing why they are not getting interviews.

We built Unlockd, an AI-powered career preparation platform that turns multiple job descriptions and a student’s current profile into one optimized learning roadmap.

Unlockd identifies which skills appear across the roles, compares them to the student’s current profile, and ranks the highest-impact gaps. Instead of saying “learn everything,” it tells the student what skills unlock the most opportunities.

The impact is simple: career mentorship becomes more accessible. A student without a mentor can now see a clear path from where they are to where they want to be.

Unlockd does not do the work for users. It gives them the structure, roadmap, and proof-based tasks they need to become more prepared.

Our goal is to help students stop applying blindly and start preparing strategically.

---

# **19\. Final Builder Checklist**

## **Builder 1**

* Create landing page  
* Create analyze page  
* Create dashboard components  
* Add mock result data  
* Make UI clean and pitch-ready

## **Builder 2**

* Create `/api/analyze`  
* Add AI prompt  
* Enforce JSON output  
* Add fallback mock response  
* Connect API to frontend

## **You**

* Finalize story  
* Build slides  
* Prepare pitch  
* Prepare judge answers  
* Keep team focused on MVP  
* Make sure “AI guides, user acts” is clear

---

# **20\. Judge Q\&A Prep**

## **What problem are you solving?**

Students apply broadly but prepare randomly. Unlockd helps them identify the most valuable skills to learn across multiple jobs.

## **Why multiple job descriptions?**

Because most students are open to multiple opportunities. We optimize preparation across roles instead of overfitting to one job.

## **How is this different from ChatGPT?**

ChatGPT gives answers. Unlockd gives a structured workflow: multi-job comparison, opportunity coverage, prioritized skill gaps, and a roadmap designed around proof of work.

## **How does this fit the education guardrail?**

AI is scaffolding, not the solution. Unlockd guides the user, but the user must still learn, build projects, complete courses, and prove their skills.

## **What is the impact?**

It makes career mentorship accessible to students who do not have mentors or insider networks.

## **What is the future vision?**

A library of proven career pathways where students can share roadmaps that helped them become ready for specific roles.

# Updated Product Flow — Unlockd

**Browse jobs → select 2–5 roles → upload profile → get your personalized roadmap.**

---

## Why This Is Stronger

Instead of asking users to paste random job descriptions, Unlockd already has jobs on the platform. That means users can:

- Browse real-looking opportunities
- Select 2–5 roles they care about
- Compare their profile against those roles
- Get one optimized learning path

For MVP, your "job scraper" can be mocked/preloaded data. You do not need to build a real scraper in 8 hours.

---

## Updated Architecture

```
Job Scraper / Preloaded Jobs
       ↓
Jobs Database / Mock Jobs JSON
       ↓
Job Discovery Page
       ↓
User selects 2–5 jobs
       ↓
User uploads/pastes profile
       ↓
AI Gap Analysis Engine
       ↓
Learning Path Generator
       ↓
Unlockd Dashboard
```

---

## MVP Version

### 1. Job Browse Page

Show 8–12 preloaded jobs as cards. Each card has:

- Job title
- Company
- Location
- Role type
- Key skills
- **Select** button

**Example roles:**

- Product Manager Intern
- Data Analyst Intern
- Business Analyst Intern
- Technical Program Manager Intern
- Software Engineer Intern
- Operations Analyst Intern

### 2. Selected Jobs Panel

User selects 2–5 jobs. Show:

- `3 jobs selected`
- Button: **Analyze My Readiness**

### 3. Profile Upload Page

User pastes resume/profile text.

**Optional:**

- Upload resume file
- Paste LinkedIn summary

For MVP, paste text is enough.

### 4. Results Dashboard

Same outputs:

- Current readiness
- Projected readiness
- Opportunity coverage
- Common skills across selected jobs
- Matched skills
- Missing skills
- Priority skills
- Learning roadmap
- Course/certification suggestions
- Portfolio project ideas
- Resume suggestions

---

## Updated System Architecture

### Data Layer

Use a local file: `/lib/jobs.ts`

Each job object:

```ts
{
  id: "pm-intern-1",
  title: "Product Manager Intern",
  company: "NovaTech",
  location: "Remote",
  type: "Internship",
  description: "Work with engineering and design teams...",
  requiredSkills: ["Product Metrics", "SQL", "User Research", "Roadmapping"],
  preferredSkills: ["Figma", "A/B Testing", "Agile"],
  category: "Product"
}
```

### AI API Input Changes

Instead of raw pasted job descriptions, send selected jobs:

```json
{
  "profile": "User resume/profile text",
  "selectedJobs": [
    {
      "title": "Product Manager Intern",
      "company": "NovaTech",
      "description": "...",
      "requiredSkills": ["SQL", "Product Metrics"]
    }
  ],
  "timeline": "4 weeks"
}
```

---

## Updated User Journey

1. User lands on Unlockd
2. User clicks **Find My Path**
3. User browses available jobs
4. User selects 2–5 jobs
5. User pastes profile/resume
6. Unlockd compares profile with selected jobs
7. Unlockd generates optimized roadmap

---

## Why This Improves the Story

**Before:** User brings job descriptions.

**Now:** Unlockd helps students discover opportunities and prepare for them.

That is a bigger platform.

---

## Updated One-Liner

> Unlockd helps students select multiple opportunities from our job platform and generates one personalized roadmap to become ready for them.

**Better version:**

> Unlockd turns selected job opportunities into a personalized skill roadmap, helping students prepare strategically instead of applying blindly.

---

## Team Update Message

> Slight product update: Instead of making users paste job descriptions manually, Unlockd will have a job discovery page with preloaded/scraped jobs. Users select 2–5 jobs they're interested in, upload or paste their current profile, and Unlockd compares them against those selected jobs to generate one optimized learning roadmap. For MVP, we can use mock/preloaded job data instead of building a full scraper. This makes the demo smoother and makes Unlockd feel more like a real platform.

---

## Builder Changes

### Frontend Builder

Add:

- Job discovery page
- Job cards
- Select/deselect job logic
- Selected jobs counter
- Limit selection to 2–5 jobs

### Backend Builder

Change API from:

```ts
jobDescriptions: string[]
```

to:

```ts
selectedJobs: Job[]
```

### You

Update story from:

- *Students paste jobs they found*

to:

- *Students discover opportunities and Unlockd creates the preparation path*

---

## Pitch Upgrade

> Most students don't know what jobs they're ready for or how to prepare for the ones they want. Unlockd starts with job discovery. Students select a few opportunities they care about, and our system reverse-engineers those jobs into one personalized learning path based on their current profile.

This version is cleaner and more demo-friendly.