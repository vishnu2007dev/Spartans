# Implementation Plan: Unlockd Platform

## Overview

The Unlockd platform is split into two independent projects — `frontend/` (Next.js App Router) and `backend/` (Node.js/Express) — so two teammates can work in parallel. Om (Frontend Lead) owns the `frontend/` folder; Vishnu (Backend/AI Lead) owns the `backend/` folder. Shared types are duplicated in both folders for simplicity (no monorepo tooling). The frontend includes its own mock data for UI development before the backend is ready. The backend includes its own mock fallback for when the AI API fails.

## Tasks

- [x] 1. Scaffold both projects and shared types
  - [x] 1.1 Initialize the `frontend/` Next.js project with App Router, TypeScript, and Tailwind CSS
    - Run `npx create-next-app@latest frontend --typescript --tailwind --app --eslint`
    - Verify the project runs with `npm run dev` from `frontend/`
    - _Requirements: 1.1, 19.1_
    - **Owner: Om (Frontend Lead)**

  - [x] 1.2 Initialize the `backend/` Express project with TypeScript
    - Create `backend/` with `package.json`, `tsconfig.json`, and install `express`, `cors`, `zod`, `typescript`, `ts-node`, `@types/express`, `@types/cors`
    - Create `backend/src/server.ts` entry point with Express app listening on port 3001
    - Enable CORS for `http://localhost:3000` (the frontend dev server)
    - _Requirements: 7.1_
    - **Owner: Vishnu (Backend Lead)**

  - [x] 1.3 Create shared types in `frontend/lib/types.ts`
    - Define `Job`, `SelectedJob`, `Timeline`, `AnalyzeRequest`, `OpportunityCoverage`, `PrioritySkill`, `RoadmapWeek`, `Course`, `PortfolioProject`, and `AnalysisResult` TypeScript interfaces
    - _Requirements: 4.1, 8.2_
    - **Owner: Om (Frontend Lead)**

  - [x] 1.4 Create shared types and Zod schemas in `backend/src/lib/types.ts`
    - Duplicate all TypeScript interfaces from 1.3
    - Define `selectedJobSchema`, `analyzeRequestSchema`, and `analysisResultSchema` Zod schemas
    - `analyzeRequestSchema`: validates `profile` (non-empty string), `selectedJobs` (array of 2–5 valid SelectedJob objects), `timeline` (one of "2 weeks", "4 weeks", "8 weeks")
    - `analysisResultSchema`: validates all required fields, `currentReadiness`/`projectedReadiness` as numbers 0–100, nested objects and arrays
    - _Requirements: 4.1, 7.1, 7.2, 7.3, 7.4, 7.5, 8.2, 20.1, 20.3_
    - **Owner: Vishnu (Backend Lead)**

  - [x] 1.5 Install testing dependencies in both projects
    - In `frontend/`: install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `jsdom`
    - In `backend/`: install `vitest`, `fast-check`
    - Configure `vitest.config.ts` in both projects
    - **Owner: Both**

- [ ] 2. Backend — API route, validation, and AI integration
  - [ ] 2.1 Implement request validation in `backend/src/lib/validation.ts`
    - Export a `validateRequest` function that parses the request body with `analyzeRequestSchema`
    - Return parsed data on success, or a structured error message on failure
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
    - **Owner: Vishnu (Backend Lead)**

  - [ ]* 2.2 Write property tests for request validation (Properties 1 & 2)
    - Create `backend/__tests__/requestValidation.property.test.ts`
    - **Property 1: Valid requests are accepted** — Generate random valid `AnalyzeRequest` objects (non-empty profile, 2–5 selectedJobs with non-empty title/description, valid timeline) and assert `analyzeRequestSchema` parses successfully
    - **Validates: Requirement 7.1**
    - **Property 2: Invalid requests are rejected** — Generate invalid requests (empty profile, <2 or >5 selectedJobs, missing title/description, invalid timeline) and assert `analyzeRequestSchema` rejects
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.5**

  - [ ] 2.3 Implement mock data fallback in `backend/src/lib/mockResults.ts`
    - Export a `getMockResults()` function returning a complete `AnalysisResult` object with realistic sample data
    - Include readiness scores, skill arrays, multi-week roadmap, courses, projects, resume suggestions, and mentor advice
    - _Requirements: 9.1, 9.2, 9.3_
    - **Owner: Vishnu (Backend Lead)**

  - [ ] 2.4 Implement AI prompt builder in `backend/src/lib/aiPrompt.ts`
    - Export a `buildPrompt(profile, selectedJobs, timeline)` function that constructs the AI prompt
    - Include education guardrail instructions: focus on honest upskilling, avoid exaggerating experience, make recommendations actionable
    - Include instructions for `proofOfWork` items requiring tangible evidence of learning
    - Include instructions for simple, student-friendly language
    - Request structured JSON output matching the `AnalysisResult` schema
    - _Requirements: 8.1, 21.1, 21.2, 21.3_
    - **Owner: Vishnu (Backend Lead)**

  - [ ] 2.5 Implement the `/api/analyze` POST route in `backend/src/routes/analyze.ts`
    - Validate request body using `validateRequest`; return 400 with error message on failure
    - Call the AI API with the built prompt
    - Parse AI response through `analysisResultSchema`; if validation fails, return mock data
    - If AI API call throws (network error, timeout, non-200), log error and return mock data
    - Return 200 with `AnalysisResult` JSON
    - Wire route into `backend/src/server.ts`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 9.1, 9.2, 20.1, 20.2, 20.3_
    - **Owner: Vishnu (Backend Lead)**

  - [ ]* 2.6 Write property tests for AI response validation (Properties 3, 5, 6)
    - Create `backend/__tests__/responseValidation.property.test.ts`
    - **Property 3: AI response parsing round-trip** — Generate valid `AnalysisResult` objects, serialize to JSON, parse through `analysisResultSchema`, assert equivalence
    - **Validates: Requirement 8.2**
    - **Property 5: AI response schema completeness** — For each required top-level field, remove it from a valid `AnalysisResult` and assert `analysisResultSchema` rejects
    - **Validates: Requirement 20.1**
    - **Property 6: Readiness score range enforcement** — Generate out-of-range numbers for `currentReadiness`/`projectedReadiness` and assert rejection
    - **Validates: Requirement 20.3**

  - [ ]* 2.7 Write property test for mock data fallback (Property 4)
    - Create `backend/__tests__/mockFallback.property.test.ts`
    - **Property 4: Invalid AI response triggers mock data fallback** — Generate malformed JSON values, assert they fail `analysisResultSchema`, then assert `getMockResults()` passes `analysisResultSchema`
    - **Validates: Requirements 9.1, 9.2, 20.2**

- [ ] 3. Checkpoint — Backend core complete
  - Ensure all backend tests pass (`cd backend && npx vitest --run`), ask the user if questions arise.

- [x] 4. Frontend — App shell, context, and preloaded data
  - [x] 4.1 Create the `AppContext` provider in `frontend/lib/context.tsx`
    - Implement `AppContextProvider` wrapping the app in `frontend/app/layout.tsx`
    - Expose `selectedJobs`, `setSelectedJobs`, `result`, `setResult`
    - _Requirements: 3.8, 6.3_
    - **Owner: Om (Frontend Lead)**

  - [x] 4.2 Create preloaded job data in `frontend/lib/jobs.ts`
    - Export an array of 8–12 `Job` objects with realistic student-oriented internship/entry-level roles
    - Include roles like Product Manager Intern, Data Analyst Intern, Business Analyst Intern, Technical Program Manager Intern, Software Engineer Intern, Operations Analyst Intern
    - _Requirements: 3.1, 3.3, 4.1, 4.2, 4.3_
    - **Owner: Om (Frontend Lead)**

  - [x] 4.3 Create frontend mock data in `frontend/lib/mock-data.ts`
    - Export a complete `AnalysisResult` object for UI development before the backend is ready
    - Include realistic sample values for all fields
    - _Requirements: 9.3_
    - **Owner: Om (Frontend Lead)**

- [x] 5. Frontend — Landing Page
  - [x] 5.1 Implement `LandingHero` component in `frontend/components/LandingHero.tsx`
    - Display product name "Unlockd", tagline, brief platform explanation
    - "Find My Path" CTA button linking to `/jobs`
    - Responsive layout (320px–1920px)
    - _Requirements: 1.1, 1.2, 1.3_
    - **Owner: Om (Frontend Lead)**

  - [x] 5.2 Implement Landing page at `frontend/app/page.tsx`
    - Render `LandingHero` component
    - _Requirements: 1.1, 1.2, 1.3_
    - **Owner: Om (Frontend Lead)**

- [x] 6. Frontend — Job Discovery Page
  - [x] 6.1 Implement `JobCard` component in `frontend/components/JobCard.tsx`
    - Display job title, company, location, type, required skills, and "Select" toggle button
    - Visual selected/unselected state
    - ARIA attributes for selection state (accessible to assistive technologies)
    - `disabled` prop to prevent selection when max reached
    - _Requirements: 3.2, 3.4, 19.5_
    - **Owner: Om (Frontend Lead)**

  - [x] 6.2 Implement `JobGrid` component in `frontend/components/JobGrid.tsx`
    - Responsive grid layout rendering all `JobCard` components
    - Pass `maxReached` to disable unselected cards when 5 are selected
    - _Requirements: 3.1, 3.9, 19.1_
    - **Owner: Om (Frontend Lead)**

  - [x] 6.3 Implement `SelectionCounter` component in `frontend/components/SelectionCounter.tsx`
    - Display "X jobs selected" with min/max context
    - _Requirements: 3.5_
    - **Owner: Om (Frontend Lead)**

  - [x] 6.4 Implement Job Discovery page at `frontend/app/jobs/page.tsx`
    - Load jobs from `frontend/lib/jobs.ts`
    - Selection logic: toggle select/deselect, enforce min 2 / max 5
    - Display `SelectionCounter`
    - "Analyze My Readiness" button: disabled when <2 selected, enabled when 2–5 selected
    - Max-reached message when user tries to select >5
    - Store selected jobs in `AppContext` on navigation to `/analyze`
    - Responsive layout (320px–1920px)
    - _Requirements: 3.1, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 19.1_
    - **Owner: Om (Frontend Lead)**

  - [ ]* 6.5 Write property tests for job selection logic (Properties 7 & 8)
    - Create `frontend/__tests__/jobSelection.property.test.ts`
    - **Property 7: Job selection enforces 2–5 bounds** — Generate random sequences of toggle actions, assert selected count never exceeds 5, and "Analyze" button enabled only when count is 2–5
    - **Validates: Requirements 3.6, 3.7, 3.8, 3.9**
    - **Property 8: Selection counter accuracy** — Generate random select/deselect sequences, assert counter display matches actual selection count
    - **Validates: Requirement 3.5**

- [x] 7. Frontend — Analyze Page
  - [x] 7.1 Implement `ProfileInput` component in `frontend/components/ProfileInput.tsx`
    - Textarea with visible label for profile text entry
    - Error display for validation messages
    - _Requirements: 2.1, 2.2, 19.2_
    - **Owner: Om (Frontend Lead)**

  - [x] 7.2 Implement `TimelineSelector` component in `frontend/components/TimelineSelector.tsx`
    - Three options: 2 weeks, 4 weeks, 8 weeks
    - Default to 4 weeks
    - _Requirements: 5.1, 5.2, 5.3_
    - **Owner: Om (Frontend Lead)**

  - [x] 7.3 Implement `SelectedJobsSummary` component in `frontend/components/SelectedJobsSummary.tsx`
    - Compact list of selected job titles and companies
    - _Requirements: 2.4_
    - **Owner: Om (Frontend Lead)**

  - [x] 7.4 Implement Analyze page at `frontend/app/analyze/page.tsx`
    - Read selected jobs from `AppContext`; redirect to `/jobs` if none selected
    - Display `SelectedJobsSummary`, `ProfileInput`, `TimelineSelector`
    - Validate profile text is non-empty on submit
    - "Analyze" button POSTs to backend `http://localhost:3001/api/analyze` (or proxy)
    - Loading indicator while request is in flight; disable button to prevent duplicate submissions
    - ARIA live region for loading state (accessible to assistive technologies)
    - On success: store result in `AppContext`, navigate to `/results`
    - On error: display error message, re-enable button
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4, 19.1, 19.2, 19.4_
    - **Owner: Om (Frontend Lead)**

- [ ] 8. Checkpoint — Frontend pages and backend API wired together
  - Ensure frontend can call backend API successfully. Ensure all tests pass in both projects. Ask the user if questions arise.

- [ ] 9. Frontend — Results Dashboard
  - [ ] 9.1 Implement `ScoreCard` component in `frontend/components/ScoreCard.tsx`
    - Display percentage score (0–100) with current/projected variant styling
    - _Requirements: 10.1, 10.2_
    - **Owner: Om (Frontend Lead)**

  - [ ] 9.2 Implement `SkillList` component in `frontend/components/SkillList.tsx`
    - Render a labeled list of skill tags with descriptive heading
    - _Requirements: 12.1, 12.2_
    - **Owner: Om (Frontend Lead)**

  - [ ] 9.3 Implement `PrioritySkillCard` component in `frontend/components/PrioritySkillCard.tsx`
    - Display skill name, priority level, appearsIn, reason, recommendedAction
    - _Requirements: 13.1, 13.2_
    - **Owner: Om (Frontend Lead)**

  - [ ] 9.4 Implement `RoadmapTimeline` component in `frontend/components/RoadmapTimeline.tsx`
    - Week-by-week timeline with week label, focus, tasks list, and proofOfWork
    - _Requirements: 14.1, 14.2, 14.3_
    - **Owner: Om (Frontend Lead)**

  - [ ] 9.5 Implement `CourseRecommendations` component in `frontend/components/CourseRecommendations.tsx`
    - List of course/certification cards with name, type, and reason
    - _Requirements: 15.1, 15.2_
    - **Owner: Om (Frontend Lead)**

  - [ ] 9.6 Implement `ProjectRecommendations` component in `frontend/components/ProjectRecommendations.tsx`
    - List of project idea cards with title, description, and skillsDemonstrated
    - _Requirements: 16.1, 16.2_
    - **Owner: Om (Frontend Lead)**

  - [ ] 9.7 Implement `ResumeSuggestions` component in `frontend/components/ResumeSuggestions.tsx`
    - Ordered list of actionable resume tips
    - _Requirements: 17.1, 17.2_
    - **Owner: Om (Frontend Lead)**

  - [ ] 9.8 Implement `MentorAdvice` component in `frontend/components/MentorAdvice.tsx`
    - Styled block quote for mentor advice text
    - _Requirements: 18.1_
    - **Owner: Om (Frontend Lead)**

  - [ ] 9.9 Implement `ResultsDashboard` container in `frontend/components/ResultsDashboard.tsx`
    - Compose all result section components
    - Sort `prioritySkills` by priority level: High → Medium → Low
    - Use semantic HTML headings for section hierarchy
    - _Requirements: 10.1, 10.2, 10.3, 11.1, 11.2, 12.1, 12.2, 13.1, 13.2, 13.3, 14.1, 14.2, 15.1, 15.2, 16.1, 16.2, 17.1, 17.2, 18.1, 19.3_
    - **Owner: Om (Frontend Lead)**

  - [ ] 9.10 Implement Results page at `frontend/app/results/page.tsx`
    - Read analysis result from `AppContext`; redirect to `/analyze` if no result
    - Render `ResultsDashboard` with the result data
    - _Requirements: 10.1, 10.2, 10.3, 11.1, 11.2, 12.1, 12.2, 13.1, 13.2, 13.3, 14.1, 14.2, 14.3, 15.1, 15.2, 16.1, 16.2, 17.1, 17.2, 18.1, 19.1, 19.3_
    - **Owner: Om (Frontend Lead)**

  - [ ]* 9.11 Write property tests for dashboard rendering (Properties 9 & 10)
    - Create `frontend/__tests__/dashboard.property.test.ts`
    - **Property 9: Priority skills ordered by priority level** — Generate arrays of `PrioritySkill` with mixed priorities, render through `ResultsDashboard` or sorting logic, assert High before Medium before Low
    - **Validates: Requirement 13.3**
    - **Property 10: Dashboard components render all data fields** — Generate valid `Job`, `PrioritySkill`, `RoadmapWeek`, `Course`, `PortfolioProject` objects, render through their components, assert all fields appear in output
    - **Validates: Requirements 3.2, 13.2, 14.2, 15.2, 16.2**

- [ ] 10. Frontend — Skill Check (AI Quiz Section)
  - [ ] 10.1 Implement `SkillCheckQuiz` component in `frontend/components/SkillCheckQuiz.tsx`
    - Displayed after the full results dashboard (after MentorAdvice)
    - AI asks 3–5 questions about the skills/projects in the user's roadmap
    - Questions are generated from the `prioritySkills` and `learningRoadmap` in the `AnalysisResult`
    - Each question is multiple choice (4 options); user selects an answer
    - After all questions: show score (e.g. "3/5 correct"), brief feedback per question, and an encouraging summary
    - Use mock questions for MVP (no extra API call needed); questions are derived from the mock data
    - Style: clean card-per-question layout, green for correct, red for incorrect on reveal
    - **Owner: Om (Frontend Lead)**

  - [ ] 10.2 Wire `SkillCheckQuiz` into Results page at `frontend/app/results/page.tsx`
    - Render below `ResultsDashboard`
    - Only show after user has scrolled through the dashboard (or always show — MVP choice)
    - **Owner: Om (Frontend Lead)**

- [ ] 11. Frontend — Career Activity Card (GitHub-style shareable)
  - [ ] 11.1 Implement `ActivityCard` component in `frontend/components/ActivityCard.tsx`
    - GitHub contribution graph-style heatmap grid showing simulated platform activity
    - Grid: 12 weeks × 7 days of cells; cells colored by activity intensity (4 shades of green + empty)
    - Activity data is derived from the roadmap weeks (mock/simulated for MVP)
    - Above the grid: user's name placeholder, readiness score badge, top skill badge
    - Below the grid: 3 stat pills — "X skills unlocked", "Y-week roadmap", "Z roles targeted"
    - Tagline at bottom: "Prepared on Unlockd · unlockd.app"
    - Designed to be screenshot-able and shareable on LinkedIn/Twitter
    - Use a fixed card size (e.g. 600×300px) so it looks good as a social image
    - **Owner: Om (Frontend Lead)**

  - [ ] 11.2 Add share section to Results page
    - Below `SkillCheckQuiz`, add a "Share your progress" section
    - Render `ActivityCard` in a centered container
    - Add a "Copy image" or "Download card" button (can be a simple screenshot hint for MVP)
    - Add social share copy: "I just mapped my career path on Unlockd. Here's my readiness score 🚀"
    - **Owner: Om (Frontend Lead)**

- [ ] 12. Final checkpoint — Full integration
  - Ensure all tests pass in both `frontend/` and `backend/`. Verify the full flow: Landing → Job Discovery → Analyze → Results → Skill Check → Share Card. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- **Om (Frontend Lead)** owns all `frontend/` tasks (Tasks 4–9)
- **Vishnu (Backend Lead)** owns all `backend/` tasks (Task 2)
- Task 1 (scaffolding) and Task 10 (final integration) are shared responsibilities
- Frontend can develop against `frontend/lib/mock-data.ts` before the backend is ready
- Backend runs on port 3001 with CORS enabled for `localhost:3000`
