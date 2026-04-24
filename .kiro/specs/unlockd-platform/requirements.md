# Requirements Document

## Introduction

Unlockd turns selected job opportunities into a personalized skill roadmap, helping students prepare strategically instead of applying blindly. It is an AI-powered career preparation platform designed for students and early-career job seekers who lack strong mentor networks. Users browse a curated set of 8–12 preloaded job cards on a Job Discovery page, select 2–5 roles they are interested in, then paste their current profile (resume, skills summary, or LinkedIn text). The system analyzes the gap between the user's current profile and the combined requirements across all selected jobs. It produces a structured results dashboard containing readiness scores, opportunity coverage, skill analysis, a prioritized learning roadmap, course and certification recommendations, portfolio project ideas, and resume improvement suggestions.

The platform is built as a Next.js (App Router) application with React, TypeScript, and Tailwind CSS. The backend uses Next.js API routes with an AI API call for analysis. For the MVP, state is managed locally in components with no database. If the AI call fails, the system falls back to mock data so the demo remains functional.

The guiding educational principle is that AI should guide users toward strategic preparation — not replace the effort of learning, building, and applying.

## Glossary

- **Landing_Page**: The root page (`/`) that introduces Unlockd, explains its value proposition, and provides a "Find My Path" call-to-action that navigates to the Job_Discovery_Page.
- **Job_Discovery_Page**: The job browsing page (`/jobs`) that displays 8–12 preloaded Job_Card entries for the user to browse and select from.
- **Job_Card**: A UI card on the Job_Discovery_Page representing a single preloaded job, displaying the job title, company, location, role type, key skills, and a "Select" toggle button.
- **Job**: A preloaded job data object defined in `/lib/jobs.ts` containing `id`, `title`, `company`, `location`, `type`, `description`, `requiredSkills`, `preferredSkills`, and `category` fields.
- **Analyze_Page**: The profile input page (`/analyze`) where users paste their profile text, select a timeline, and initiate analysis with their previously selected jobs.
- **Results_Dashboard**: The output page (`/results`) that displays all AI-generated analysis results in organized dashboard sections.
- **Profile_Text**: Free-form text representing the user's current background, including resume content, skills summary, or LinkedIn profile text.
- **Analysis_Engine**: The backend system (`POST /api/analyze`) that accepts user input (profile text, selected jobs, and timeline), calls the AI API, parses the structured JSON response, and returns results to the frontend.
- **Readiness_Score**: A numeric percentage (0–100) representing how prepared the user currently is for the selected roles, and a projected score after completing the roadmap.
- **Opportunity_Coverage**: A metric showing how many of the selected roles the user currently qualifies for versus how many the user could qualify for after following the roadmap.
- **Priority_Skill**: A missing skill ranked by frequency across selected jobs, importance in required qualifications, and impact on opportunity coverage.
- **Learning_Roadmap**: A week-by-week plan of tasks, focus areas, and proof-of-work items tailored to the selected timeline.
- **Mock_Data**: A predefined fallback JSON response used when the AI API call fails, ensuring the application remains demonstrable.
- **Timeline_Selector**: A UI control on the Analyze_Page that allows the user to choose a preparation timeline of 2, 4, or 8 weeks.
- **AI_Response**: The structured JSON object returned by the AI API containing all analysis results including scores, skills, roadmap, courses, projects, and resume suggestions.
- **Selection_Counter**: A UI element on the Job_Discovery_Page that displays the current number of selected jobs (e.g., "3 jobs selected").

## Requirements

### Requirement 1: Landing Page Display

**User Story:** As a student, I want to see a clear landing page that explains what Unlockd does, so that I understand the platform's value before using it.

#### Acceptance Criteria

1. THE Landing_Page SHALL display the product name "Unlockd", a tagline, a brief explanation of the platform's purpose, and a "Find My Path" call-to-action button that navigates to the Job_Discovery_Page.
2. WHEN a user activates the "Find My Path" call-to-action on the Landing_Page, THE Landing_Page SHALL navigate the user to the Job_Discovery_Page at the `/jobs` route.
3. THE Landing_Page SHALL render correctly on viewport widths from 320px to 1920px without horizontal scrolling or content overflow.

### Requirement 2: Profile Text Input

**User Story:** As a student, I want to paste my current profile so the system understands my background.

#### Acceptance Criteria

1. THE Analyze_Page SHALL display a text input area labeled for profile entry that accepts free-form Profile_Text including resume content, skills summaries, and LinkedIn profile text.
2. WHEN the user enters Profile_Text, THE Analyze_Page SHALL store the Profile_Text in local component state for use during analysis submission.
3. WHEN the user attempts to submit the analysis with an empty Profile_Text field, THE Analyze_Page SHALL display a validation message indicating that profile text is required and SHALL prevent submission.
4. THE Analyze_Page SHALL display a summary of the jobs selected on the Job_Discovery_Page so the user can confirm which roles will be analyzed.

### Requirement 3: Job Discovery Page

**User Story:** As a student, I want to browse preloaded job opportunities so that I can select the roles I am interested in preparing for.

#### Acceptance Criteria

1. THE Job_Discovery_Page SHALL display between 8 and 12 preloaded Job_Card entries sourced from the Job data defined in `/lib/jobs.ts`.
2. THE Job_Discovery_Page SHALL display each Job_Card with the job title, company name, location, role type, key required skills, and a "Select" toggle button.
3. THE Job_Discovery_Page SHALL include example roles such as Product Manager Intern, Data Analyst Intern, Business Analyst Intern, Technical Program Manager Intern, Software Engineer Intern, and Operations Analyst Intern.
4. WHEN a user activates the "Select" button on a Job_Card, THE Job_Discovery_Page SHALL toggle the selection state of that Job_Card and update the Selection_Counter.
5. THE Job_Discovery_Page SHALL display a Selection_Counter showing the current number of selected jobs (e.g., "3 jobs selected").
6. THE Job_Discovery_Page SHALL enforce a minimum selection of 2 jobs and a maximum selection of 5 jobs.
7. WHEN the user has selected fewer than 2 jobs, THE Job_Discovery_Page SHALL disable the "Analyze My Readiness" navigation button.
8. WHEN the user has selected 2 or more jobs, THE Job_Discovery_Page SHALL enable and display an "Analyze My Readiness" button that navigates to the Analyze_Page at the `/analyze` route with the selected Job data available.
9. IF the user attempts to select more than 5 jobs, THEN THE Job_Discovery_Page SHALL prevent the additional selection and display a message indicating the maximum of 5 jobs has been reached.
10. THE Job_Discovery_Page SHALL render correctly on viewport widths from 320px to 1920px without horizontal scrolling or content overflow.

### Requirement 4: Job Data Model

**User Story:** As a developer, I want a well-defined job data model so that preloaded jobs are consistently structured across the application.

#### Acceptance Criteria

1. THE Job data model defined in `/lib/jobs.ts` SHALL contain the following fields for each Job: `id` (string), `title` (string), `company` (string), `location` (string), `type` (string), `description` (string), `requiredSkills` (string array), `preferredSkills` (string array), and `category` (string).
2. THE `/lib/jobs.ts` file SHALL export an array of between 8 and 12 preloaded Job objects.
3. THE preloaded Job objects SHALL contain realistic data for student-oriented internship and entry-level roles.

### Requirement 5: Timeline Selection

**User Story:** As a student, I want to select a preparation timeline so that my learning roadmap fits my available time.

#### Acceptance Criteria

1. THE Analyze_Page SHALL display a Timeline_Selector with exactly three options: 2 weeks, 4 weeks, and 8 weeks.
2. THE Timeline_Selector SHALL default to the 4-week option when the Analyze_Page loads.
3. WHEN the user selects a timeline option, THE Analyze_Page SHALL store the selected timeline value in local component state for use during analysis submission.

### Requirement 6: Analysis Submission and Loading

**User Story:** As a student, I want to submit my profile and selected jobs for analysis so that I receive personalized career preparation guidance.

#### Acceptance Criteria

1. THE Analyze_Page SHALL display an "Analyze" button that submits the Profile_Text, the selected Job objects, and the selected timeline to the Analysis_Engine via a POST request to `/api/analyze`.
2. WHILE the Analysis_Engine is processing the request, THE Analyze_Page SHALL display a loading indicator and SHALL disable the "Analyze" button to prevent duplicate submissions.
3. WHEN the Analysis_Engine returns a successful response, THE Analyze_Page SHALL navigate the user to the Results_Dashboard at the `/results` route with the AI_Response data available for display.
4. IF the Analysis_Engine returns an error response, THEN THE Analyze_Page SHALL display an error message describing the failure and SHALL re-enable the "Analyze" button for retry.

### Requirement 7: API Route — Input Validation

**User Story:** As a developer, I want the API to validate incoming requests so that the AI receives well-formed input.

#### Acceptance Criteria

1. THE Analysis_Engine SHALL accept POST requests at `/api/analyze` with a JSON body containing a `profile` string field, a `selectedJobs` array field (each entry containing `title`, `company`, `description`, and `requiredSkills` fields), and a `timeline` string field.
2. IF the `profile` field is missing or empty, THEN THE Analysis_Engine SHALL return an HTTP 400 response with an error message specifying that profile text is required.
3. IF the `selectedJobs` array contains fewer than 2 entries or more than 5 entries, THEN THE Analysis_Engine SHALL return an HTTP 400 response with an error message specifying that between 2 and 5 jobs must be selected.
4. IF any entry in the `selectedJobs` array is missing a `title` or `description` field, THEN THE Analysis_Engine SHALL return an HTTP 400 response with an error message specifying that all selected jobs must contain a title and description.
5. IF the `timeline` field does not match one of the values "2 weeks", "4 weeks", or "8 weeks", THEN THE Analysis_Engine SHALL return an HTTP 400 response with an error message specifying the valid timeline options.

### Requirement 8: API Route — AI Analysis and Structured Response

**User Story:** As a student, I want the system to analyze my profile against selected jobs using AI so that I receive accurate and structured career guidance.

#### Acceptance Criteria

1. WHEN the Analysis_Engine receives a valid request, THE Analysis_Engine SHALL send the Profile_Text, all selected Job objects (including title, company, description, and requiredSkills), and the selected timeline to the AI API with a prompt requesting structured JSON output.
2. WHEN the AI API returns a response, THE Analysis_Engine SHALL parse the response and return a JSON object containing: `currentReadiness` (number), `projectedReadiness` (number), `summary` (string), `opportunityCoverage` (object with `current`, `projected`, and `explanation` string fields), `commonSkills` (string array), `matchedSkills` (string array), `missingSkills` (string array), `prioritySkills` (array of objects with `skill`, `priority`, `appearsIn`, `reason`, and `recommendedAction` fields), `learningRoadmap` (array of objects with `week`, `focus`, `tasks`, and `proofOfWork` fields), `recommendedCourses` (array of objects with `name`, `type`, and `reason` fields), `portfolioProjects` (array of objects with `title`, `description`, and `skillsDemonstrated` fields), `resumeSuggestions` (string array), and `mentorStyleAdvice` (string).
3. THE Analysis_Engine SHALL return the AI_Response with an HTTP 200 status code and a `Content-Type` header of `application/json`.

### Requirement 9: API Route — Mock Data Fallback

**User Story:** As a developer, I want the API to return mock data when the AI call fails so that the demo remains functional.

#### Acceptance Criteria

1. IF the AI API call fails due to a network error, timeout, or non-200 response, THEN THE Analysis_Engine SHALL return Mock_Data that conforms to the same JSON structure as a successful AI_Response.
2. IF the AI API returns a response that cannot be parsed as valid JSON matching the expected structure, THEN THE Analysis_Engine SHALL return Mock_Data.
3. THE Mock_Data SHALL contain realistic sample values for all fields including readiness scores, skill arrays, a multi-week learning roadmap, course recommendations, portfolio projects, and resume suggestions.

### Requirement 10: Results Dashboard — Readiness Snapshot

**User Story:** As a student, I want to see my current and projected readiness scores so that I understand how prepared I am now and how prepared I could become.

#### Acceptance Criteria

1. THE Results_Dashboard SHALL display a "Readiness Snapshot" section containing the `currentReadiness` score and the `projectedReadiness` score from the AI_Response.
2. THE Results_Dashboard SHALL display each Readiness_Score as a percentage value between 0 and 100.
3. THE Results_Dashboard SHALL display the `summary` text from the AI_Response within the Readiness Snapshot section.

### Requirement 11: Results Dashboard — Opportunity Coverage

**User Story:** As a student, I want to see how many of my target roles I currently qualify for and how many I could qualify for, so that I understand the breadth of my preparation.

#### Acceptance Criteria

1. THE Results_Dashboard SHALL display an "Opportunity Coverage" section containing the `current` coverage value, the `projected` coverage value, and the `explanation` text from the AI_Response `opportunityCoverage` object.
2. THE Results_Dashboard SHALL visually distinguish between the current and projected Opportunity_Coverage values.

### Requirement 12: Results Dashboard — Skills Analysis

**User Story:** As a student, I want to see which skills I already have, which skills appear across multiple jobs, and which skills I am missing, so that I know where I stand.

#### Acceptance Criteria

1. THE Results_Dashboard SHALL display a "Skills Analysis" section containing three distinct lists: `commonSkills` (skills appearing across multiple selected jobs), `matchedSkills` (skills the user already possesses), and `missingSkills` (skills the user lacks).
2. THE Results_Dashboard SHALL label each skill list with a descriptive heading that distinguishes common skills, matched skills, and missing skills.

### Requirement 13: Results Dashboard — Priority Skills

**User Story:** As a student, I want to see my missing skills prioritized by importance and opportunity impact, so that I know what to learn first.

#### Acceptance Criteria

1. THE Results_Dashboard SHALL display a "Top Skills to Unlock" section listing each Priority_Skill from the AI_Response `prioritySkills` array.
2. THE Results_Dashboard SHALL display each Priority_Skill with its `skill` name, `priority` level (High, Medium, or Low), `appearsIn` frequency, `reason` for prioritization, and `recommendedAction`.
3. THE Results_Dashboard SHALL order Priority_Skill entries by priority level with High priority items displayed first, followed by Medium, then Low.

### Requirement 14: Results Dashboard — Learning Roadmap

**User Story:** As a student, I want a clear week-by-week learning path so that I know exactly what to do each week.

#### Acceptance Criteria

1. THE Results_Dashboard SHALL display a "Learning Roadmap" section listing each week from the AI_Response `learningRoadmap` array in chronological order.
2. THE Results_Dashboard SHALL display each roadmap week with its `week` label, `focus` area, list of `tasks`, and `proofOfWork` item.
3. THE Learning_Roadmap section SHALL contain a number of weeks matching the timeline selected by the user (2, 4, or 8 weeks).

### Requirement 15: Results Dashboard — Course and Certification Recommendations

**User Story:** As a student, I want course and certification suggestions so that I know which learning resources to pursue for my highest-priority skill gaps.

#### Acceptance Criteria

1. THE Results_Dashboard SHALL display a "Recommended Courses & Certifications" section listing each entry from the AI_Response `recommendedCourses` array.
2. THE Results_Dashboard SHALL display each course recommendation with its `name`, `type` (Course, Certification, or Practice Resource), and `reason` for recommendation.

### Requirement 16: Results Dashboard — Portfolio Project Ideas

**User Story:** As a student, I want portfolio project ideas so that I can build tangible proof of my new skills.

#### Acceptance Criteria

1. THE Results_Dashboard SHALL display a "Portfolio Projects" section listing each entry from the AI_Response `portfolioProjects` array.
2. THE Results_Dashboard SHALL display each portfolio project with its `title`, `description`, and `skillsDemonstrated` list.

### Requirement 17: Results Dashboard — Resume Improvement Suggestions

**User Story:** As a student, I want resume improvement suggestions so that I can better present my qualifications to employers.

#### Acceptance Criteria

1. THE Results_Dashboard SHALL display a "Resume Upgrade Suggestions" section listing each entry from the AI_Response `resumeSuggestions` array.
2. THE Results_Dashboard SHALL display each resume suggestion as a distinct, actionable text item.

### Requirement 18: Results Dashboard — Mentor-Style Advice

**User Story:** As a student, I want personalized mentor-style advice so that I receive holistic career guidance beyond just skills and courses.

#### Acceptance Criteria

1. THE Results_Dashboard SHALL display a "Mentor Advice" section containing the `mentorStyleAdvice` text from the AI_Response.

### Requirement 19: Responsive and Accessible UI

**User Story:** As a student, I want the platform to work well on different screen sizes and be accessible, so that I can use it on any device.

#### Acceptance Criteria

1. THE Job_Discovery_Page, THE Analyze_Page, and THE Results_Dashboard SHALL render correctly on viewport widths from 320px to 1920px without horizontal scrolling or content overflow.
2. THE Analyze_Page SHALL associate each input field with a visible label element.
3. THE Results_Dashboard SHALL use semantic HTML heading elements to structure dashboard sections in a logical hierarchy.
4. WHILE the Analysis_Engine is processing, THE Analyze_Page SHALL convey the loading state to assistive technologies using an appropriate ARIA live region or role.
5. THE Job_Discovery_Page SHALL convey the selection state of each Job_Card to assistive technologies using appropriate ARIA attributes.

### Requirement 20: AI Response JSON Parsing and Validation

**User Story:** As a developer, I want the API to validate the AI response structure so that the frontend receives consistently shaped data.

#### Acceptance Criteria

1. WHEN the AI API returns a JSON response, THE Analysis_Engine SHALL validate that the response contains all required top-level fields: `currentReadiness`, `projectedReadiness`, `summary`, `opportunityCoverage`, `commonSkills`, `matchedSkills`, `missingSkills`, `prioritySkills`, `learningRoadmap`, `recommendedCourses`, `portfolioProjects`, `resumeSuggestions`, and `mentorStyleAdvice`.
2. IF any required field is missing from the AI API response, THEN THE Analysis_Engine SHALL fall back to Mock_Data rather than returning a partial response.
3. THE Analysis_Engine SHALL ensure `currentReadiness` and `projectedReadiness` are numeric values between 0 and 100 before returning the response.

### Requirement 21: Education Guardrail in AI Prompt

**User Story:** As a product stakeholder, I want the AI to guide users toward real learning and effort rather than doing the work for them, so that the platform upholds its educational mission.

#### Acceptance Criteria

1. THE Analysis_Engine SHALL include instructions in the AI prompt that direct the AI to focus on honest upskilling, avoid exaggerating the user's experience, and make recommendations actionable.
2. THE Analysis_Engine SHALL include instructions in the AI prompt that direct the AI to generate `proofOfWork` items in each roadmap week that require the user to produce tangible evidence of learning.
3. THE Analysis_Engine SHALL include instructions in the AI prompt that direct the AI to use simple, student-friendly language in all output fields.