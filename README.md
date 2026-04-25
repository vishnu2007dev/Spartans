# Unlockd

Unlockd is a career-readiness web app that helps a user move from "I have a resume and a few target roles" to a concrete learning plan.

The app takes a resume or profile, lets the user select real jobs, scores role readiness, surfaces the biggest gaps, clusters the highest-leverage skills, and generates a day-by-day roadmap with lightweight testing.

## What the app does

The current flow is a six-step funnel:

1. `Onboarding`
   Upload a resume or paste profile text. The backend parses resume content and stores a structured version in app state.

2. `Jobs`
   Search live job listings through JSearch / RapidAPI and select 1-5 target roles.

3. `Score`
   Compare the profile against the selected jobs and return:
   current score, projected score, strengths, weaknesses, matched skills, missing skills, and a radar breakdown.

4. `Gaps`
   Turn the score output into an actionable gap analysis with category and priority breakdowns.

5. `Focus`
   Cluster recurring gaps and pick the 3-5 skills to focus on.

6. `Plan`
   Generate a learning plan by timeline and difficulty, then track progress and open small "test me" flows.

## Repo layout

```text
.
├─ frontend/   Next.js 16 app router UI
├─ backend/    Express + TypeScript API
├─ package.json
└─ README.md
```

### Frontend

The frontend lives in `frontend/` and is a Next.js app using:

- React 19
- Tailwind CSS v4
- Recharts for score/gap visualizations
- `next-themes` for dark mode
- localStorage-backed session state in [frontend/lib/context.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/lib/context.tsx:1)

Important pages:

- [frontend/app/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/page.tsx:1): landing page
- [frontend/app/onboarding/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/onboarding/page.tsx:1): resume intake
- [frontend/app/jobs/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/jobs/page.tsx:1): role search + selection
- [frontend/app/score/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/score/page.tsx:1): readiness score
- [frontend/app/gaps/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/gaps/page.tsx:1): dashboard gap analysis
- [frontend/app/focus/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/focus/page.tsx:1): skill prioritization
- [frontend/app/plan/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/plan/page.tsx:1): learning plan and testing UI

### Backend

The backend lives in `backend/` and is an Express API using:

- TypeScript
- Zod for request/response validation
- OpenRouter for AI generation
- RapidAPI / JSearch for live job search
- `pdf-parse`, `mammoth`, and `multer` for resume parsing

Important backend files:

- [backend/src/server.ts](C:/Users/Om/Desktop/Kiro_Spark/backend/src/server.ts:1): app bootstrap
- [backend/src/config.ts](C:/Users/Om/Desktop/Kiro_Spark/backend/src/config.ts:1): env loading
- [backend/src/lib/aiPrompt.ts](C:/Users/Om/Desktop/Kiro_Spark/backend/src/lib/aiPrompt.ts:1): prompt builders
- [backend/src/lib/openRouterChat.ts](C:/Users/Om/Desktop/Kiro_Spark/backend/src/lib/openRouterChat.ts:1): AI request helper
- [backend/src/lib/normalizeAiEnums.ts](C:/Users/Om/Desktop/Kiro_Spark/backend/src/lib/normalizeAiEnums.ts:1): AI payload normalization
- [backend/src/lib/mockResults.ts](C:/Users/Om/Desktop/Kiro_Spark/backend/src/lib/mockResults.ts:1): demo fallbacks

Current routes:

- `GET /health`
- `GET /api/jobs/search`
- `POST /api/parse-resume`
- `POST /api/score`
- `POST /api/gaps`
- `POST /api/skill-focus`
- `POST /api/learning-path`
- `POST /api/test/generate`
- `POST /api/test/grade-voice`

## Running locally

### Prerequisites

- Node.js 20+
- npm

### 1. Install dependencies

From the repo root:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

### 2. Configure environment variables

Create `backend/.env` with the keys you need:

```env
OPENROUTER_API_KEY=your_openrouter_key
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=jsearch.p.rapidapi.com
ELEVENLABS_API_KEY=optional
PORT=3001
```

### 3. Start both apps

From the repo root:

```bash
npm run dev
```

That starts:

- frontend on `http://localhost:3000`
- backend on `http://localhost:3001`

You can also run them separately:

```bash
npm run dev:frontend
npm run dev:backend
```

## How data flows

### Resume parsing

The onboarding step posts a file to `/api/parse-resume`. The backend extracts text and returns structured resume data.

### Live jobs

The jobs page calls `/api/jobs/search`, normalizes the JSearch payload, and stores a trimmed `SelectedJob[]` in frontend context.

### AI scoring and gaps

The score and gap pages call `/api/score` and `/api/gaps`.

Those routes:

1. build a prompt from the current profile and selected jobs
2. send it to OpenRouter
3. parse and normalize the JSON
4. validate with Zod
5. return AI data when valid

If AI output cannot be used, the backend currently falls back to mock data and includes metadata:

```json
"_meta": {
  "source": "mock",
  "reason": "schema_validation_failed"
}
```

The frontend surfaces that fallback state on the score and gaps pages instead of silently pretending it is real AI output.

## Hackathon notes

This repo is hackathon-shaped. That means it is optimized for demo velocity over full product hardening.

Current tradeoffs:

- No real auth flow
- Landing nav is intentionally minimal and only reflects real app actions
- Session state is persisted locally in the browser
- Backend still supports mock fallback for resiliency/demo continuity
- Some older routes and docs are still present from earlier iterations

## Known issues

These are worth knowing before you present or continue building:

- Frontend TypeScript is not fully clean right now.
  [frontend/app/plan/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/plan/page.tsx:1) references `StartTestInput`, which is currently missing and causes `tsc --noEmit` in `frontend/` to fail.

- The backend is in better shape than the frontend for typechecking.
  `backend` TypeScript currently passes.

- Score and gaps can still return mock data when AI calls fail, but the response now includes `_meta.source` and `_meta.reason` so it is debuggable.

## Useful scripts

Repo root:

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
```

Frontend:

```bash
npm --prefix frontend run dev
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix frontend run test
```

Backend:

```bash
npm --prefix backend run dev
npm --prefix backend run build
npm --prefix backend run test
```

## Suggested next cleanup steps

If you keep iterating after the hackathon, the highest-value cleanup is:

1. Fix the `StartTestInput` typing issue in `frontend/app/plan/page.tsx`
2. Replace mock fallback with explicit non-200 errors outside demo mode
3. Add input fingerprinting so score/gaps cache invalidates automatically when the profile or selected jobs change
4. Consolidate stale docs in `frontend/README.md` and `backend/README.md`

## Project intent

This codebase is built around one product idea:

`resume + target roles -> score -> gaps -> focus -> plan`

That path is the core of the app. Most of the repo structure, UI decisions, and API surface exist to support that single workflow.
