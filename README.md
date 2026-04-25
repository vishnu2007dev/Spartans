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

## Architecture

Unlockd is structured as a small monorepo with two application boundaries and a thin root workspace:

- `frontend/`: Next.js 16 App Router UI
- `backend/`: Express + TypeScript API
- repo root: dev scripts, docs, assets, and workspace metadata

The system flow is:

1. The user goes through the product funnel: onboarding -> jobs -> score -> gaps -> focus -> plan.
2. The frontend stores working state in browser-backed app context.
3. The frontend calls the backend for parsing, job search, scoring, gap analysis, skill focus, and roadmap generation.
4. The backend validates requests, calls JSearch and OpenRouter, normalizes the results, and returns UI-ready payloads.
5. If AI output fails validation, the backend can return mock/demo data with `_meta` explaining the fallback source.

### Responsibility split

- The frontend owns routing, UI composition, charts, modals, selection flows, and client-side state.
- The backend owns environment config, external integrations, schema validation, AI prompts, parsing, and response shaping.
- Third-party services are isolated behind the backend so the browser does not call OpenRouter or RapidAPI directly.

## Project structure

```text
.
|-- backend/
|   |-- __tests__/                  Route, validation, fallback, and integration tests
|   |-- src/
|   |   |-- lib/                    Shared helpers, schemas, AI utilities, parsers, mock data
|   |   |-- routes/                 Express handlers grouped by feature
|   |   |-- config.ts               Runtime env/config loading
|   |   `-- server.ts               API bootstrap and middleware setup
|   |-- package.json
|   |-- tsconfig.json
|   |-- vitest.config.ts
|   |-- README.md
|   `-- SETUP.md
|-- frontend/
|   |-- app/                        Next.js App Router pages and layouts
|   |-- components/                 Reusable UI and feature-specific components
|   |-- hooks/                      Custom React hooks
|   |-- lib/                        API clients, state helpers, utilities, shared types
|   |-- public/                     Static images and brand assets
|   |-- types/                      Ambient/frontend-only type declarations
|   |-- AGENTS.md
|   |-- components.json
|   |-- eslint.config.mjs
|   |-- next.config.ts
|   |-- package.json
|   |-- postcss.config.mjs
|   |-- tsconfig.json
|   |-- vitest.config.ts
|   `-- vitest.setup.ts
|-- .agents/                        Local Codex skills used in this workspace
|-- .kiro/                          Kiro workspace metadata
|-- .vscode/                        Editor configuration
|-- package.json                    Root script entrypoints
|-- package-lock.json
|-- README.md
|-- Spark Challenge.md              Project brief / challenge context
|-- final_change.md                 Local implementation notes
`-- skills-lock.json
```

### Frontend breakdown

The frontend lives in `frontend/` and is a Next.js app using React 19, Tailwind CSS v4, Recharts, `next-themes`, and browser-persisted state in [frontend/lib/context.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/lib/context.tsx:1).

Key folders:

- `frontend/app/`: route-level pages such as `onboarding`, `jobs`, `score`, `gaps`, `focus`, `plan`, and `results`
- `frontend/components/`: reusable UI split by product area, including `landing/`, `onboarding/`, `plan/`, `ui/`, and `reui/`
- `frontend/lib/`: API calls, app context, job helpers, prompt helpers, plan sharing logic, and shared types
- `frontend/hooks/`: client hooks used by interactive flows
- `frontend/public/`: public static assets and provider logos
- `frontend/types/`: package declaration shims such as `mammoth.d.ts`

Important pages:

- [frontend/app/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/page.tsx:1): landing page
- [frontend/app/onboarding/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/onboarding/page.tsx:1): resume intake
- [frontend/app/jobs/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/jobs/page.tsx:1): role search and selection
- [frontend/app/score/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/score/page.tsx:1): readiness scoring
- [frontend/app/gaps/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/gaps/page.tsx:1): gap analysis
- [frontend/app/focus/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/focus/page.tsx:1): skill prioritization
- [frontend/app/plan/page.tsx](C:/Users/Om/Desktop/Kiro_Spark/frontend/app/plan/page.tsx:1): roadmap generation and testing UI

### Backend breakdown

The backend lives in `backend/` and uses TypeScript, Express, Zod, OpenRouter, RapidAPI / JSearch, and the `pdf-parse` + `mammoth` + `multer` stack for resume parsing.

Key folders:

- `backend/src/routes/`: endpoint handlers such as `parseResume`, `jobs`, `analyze`, `score`, `gaps`, `skillFocus`, `learningPath`, and `test`
- `backend/src/lib/`: prompt builders, API wrappers, response normalization, validation, mock fallbacks, and shared backend types
- `backend/__tests__/`: Vitest coverage for request validation, route behavior, property tests, and integration flows

Important backend files:

- [backend/src/server.ts](C:/Users/Om/Desktop/Kiro_Spark/backend/src/server.ts:1): app bootstrap
- [backend/src/config.ts](C:/Users/Om/Desktop/Kiro_Spark/backend/src/config.ts:1): environment loading
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

From the repo root, run all three installs in order:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

> The root `npm install` only installs root-level tooling. The frontend and backend each have their own `node_modules` and **must be installed separately** — skipping the last two commands will cause `next` and `ts-node` to be missing when you run `npm run dev`.

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


## Project intent

This codebase is built around one product idea:

`resume + target roles -> score -> gaps -> focus -> plan`

That path is the core of the app. Most of the repo structure, UI decisions, and API surface exist to support that single workflow.

