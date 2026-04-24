# Kiro_Spark — Final Change Plan

A consolidated plan to evolve the current 3-step app into the target 6-step career readiness wizard, with graphical components for judge-facing polish. Hackathon-scoped: local-only, no auth, no deploy.

---

## 1. Constraints (locked)

- **Hackathon MVP** — prioritize demo impact over production hardening.
- **Local-only** — both apps run on `localhost`; no Vercel/Render/Docker/CORS hardening.
- **No auth** — `localStorage` + generated `sessionId` is the only persistence layer.
- **No file storage** — resumes are parsed once and discarded server-side (parse-and-discard).
- **Data sources** — RapidAPI (JSearch) for live jobs, GPT-4o-mini via OpenRouter for all AI.

---

## 2. Target Flow (6 steps)

```
/ (landing)
  ↓
/onboarding   Step 1 — resume upload (PDF/DOCX) + optional LinkedIn URL → POST /api/parse-resume
  ↓
/jobs         Step 2 — tab A: Browse (live JSearch) / tab B: Specific (paste title/JD/URL → POST /api/jobs/parse)
  ↓
/score        Step 3 — readiness 0–100 + matched requirements → POST /api/score
  ↓
/gaps         Step 4 — missing items, tagged critical|nice-to-have → POST /api/gaps
  ↓
/focus        Step 5 — user picks top clustered skills → POST /api/skill-focus
  ↓
/plan         Step 6 — pick 7/14/28 days + beginner/intermediate/advanced → POST /api/learning-path
```

A persistent `Stepper` shows `Step N of 6`. Every step's output is written to `localStorage` under the `unlockd:v1` namespace so refresh/return works.

---

## 3. Salvage Map (what survives from current code)

### Kept 100%
- Landing: `Nav`, `Hero`, `Bento`, `CTABand`, `Footer`, `LandingHero`
- UI primitives: `ui/button.tsx`, `ui/badge.tsx`, `ThemeProvider`, `globals.css`, CSS vars, fonts
- Backend: `server.ts`, `config.ts`, `routes/jobs.ts`, `lib/jsearch.ts`, `lib/validation.ts`
- Vitest configs (both apps)

### Kept with data swap
- `JobCard`, `JobGrid`, `SelectionCounter`, `SelectedJobsSummary`
- `ScoreCard`, `SkillList`, `CourseRecommendations`

### Adapted
- `ProfileInput` → textarea fallback inside new dropzone
- `TimelineSelector` → weeks → days (7/14/28); clone into `DifficultySelector`
- `PrioritySkillCard` → priority → importance tag (`critical` | `nice-to-have`)
- `RoadmapTimeline` → weeks → days
- `AppContext` → add new state + localStorage hydration

### Deleted
- `components/ResultsDashboard.tsx` (replaced by 4 dedicated pages)
- `backend/src/routes/analyze.ts` (replaced by 4 step endpoints)
- Stale fixtures: `ai-response.json`, `jsearch-response.json`, `jsearch-test-response.json`, `openrouter-*-response.json`, `test-response.json`, `test-request.json`, `test-jsearch.ps1`

### Optional (drop if time runs short)
- `ProjectRecommendations`, `ResumeSuggestions`, `MentorAdvice` — not in spec; only keep as a collapsed "extras" tab on `/plan` if there's room.

**Net survival: ~55–60% of existing code.**

---

## 4. Backend Changes

### New endpoints

| Method | Path | Input | Output |
|---|---|---|---|
| POST | `/api/parse-resume` | multipart file + optional `linkedinUrl` | `ParsedResume { skills[], experience[], education[], rawText }` |
| POST | `/api/jobs/parse` | `{ title?, jd?, url? }` | `SelectedJob` |
| POST | `/api/score` | `{ profile, selectedJobs }` | `{ score: 0-100, matched: string[], perJob: {...} }` |
| POST | `/api/gaps` | `{ profile, selectedJobs }` | `{ gaps: Gap[] }` |
| POST | `/api/skill-focus` | `{ gaps, selectedJobs }` | `{ clusteredSkills: { skill, appearsIn, rationale }[] }` |
| POST | `/api/learning-path` | `{ profile, chosenSkills, days, difficulty }` | `{ plan: LearningDay[] }` |

### Kept endpoints
- `GET /api/jobs/search` (JSearch passthrough) — unchanged
- `GET /api/jobs/:jobId` — unchanged
- `GET /health` — unchanged

### Deleted endpoints
- `POST /api/analyze`

### Shared backend patterns
- Reuse the OpenRouter-call + mock-fallback + Zod-validate pattern from `analyze.ts` — copy the shape 6×.
- Split `aiPrompt.ts` into: `buildResumeParsePrompt`, `buildJobParsePrompt`, `buildScorePrompt`, `buildGapsPrompt`, `buildFocusPrompt`, `buildPlanPrompt`. Extract the education-guardrails block as a shared header constant.
- Split `mockResults.ts` into one mock per endpoint.
- Use `zod-to-json-schema` inside each `buildXPrompt` so the "respond with this JSON" section is generated from the Zod schema — eliminates prompt/schema drift.

### New backend deps
```
npm i multer pdf-parse mammoth cheerio zod-to-json-schema
npm i -D @types/multer
```

---

## 5. Frontend Changes

### New routes
- `/onboarding`, `/score`, `/gaps`, `/focus`, `/plan`

### Updated routes
- `/jobs` — add Browse/Specific tabs, wire Browse to `/api/jobs/search`, Specific to `/api/jobs/parse`

### New components
- `Stepper` (6 steps, driven by current route)
- `ResumeDropzone` (PDF/DOCX upload + LinkedIn URL field, wraps `ProfileInput` as fallback)
- `JobSearchBar` + `SpecificJobForm`
- `GapCard` (from `PrioritySkillCard`, retagged)
- `SkillFocusPicker` (multi-select UI)
- `DifficultySelector` (clone of `TimelineSelector`)
- `DayCard` (replaces week card in `RoadmapTimeline`)
- `lib/storage.ts` (localStorage wrapper, `unlockd:v1` namespace)
- `lib/api.ts` (single `API_BASE = 'http://localhost:3001'` constant)

### Context update (`lib/context.tsx`)
Add: `parsedResume`, `score`, `gaps`, `focusedSkills`, `plan`, `days`, `difficulty`, `sessionId`. Hydrate from localStorage on mount; persist on every setter.

---

## 6. Type / Schema Changes

Both `backend/src/lib/types.ts` and `frontend/lib/types.ts` (keep byte-identical manually):

- Rename `Timeline` → `type Days = 7 | 14 | 28`
- Add `type Difficulty = "beginner" | "intermediate" | "advanced"`
- `analyzeRequestSchema.selectedJobs` → `.min(1).max(5)` (Specific mode allows 1)
- Split `AnalysisResult` into: `ScoreResult`, `GapsResult`, `FocusResult`, `PlanResult`
- New types:
  - `ParsedResume { skills[], experience[], education[], rawText }`
  - `Gap { item, category: "skill"|"cert"|"experience"|"tooling", importance: "critical"|"nice-to-have" }`
  - `LearningDay { day: number, topic, resources: { title, url, type }[], estimatedHours }`
  - `ClusteredSkill { skill, appearsIn, rationale }`

---

## 7. Graphical Components (Judge-Facing Polish)

### Libraries
```
npm i recharts react-circular-progressbar framer-motion
```

- **recharts** — primary (React-first, SVG, themeable)
- **react-circular-progressbar** — readiness gauge
- **framer-motion** — page transitions, timeline reveals, stepper fill

### Charts per step

| Step | Chart | Library |
|---|---|---|
| `/score` | Radial gauge (current vs projected) | react-circular-progressbar |
| `/score` | Per-job horizontal bar chart | recharts BarChart |
| `/score` | Matched/required donut | recharts PieChart |
| `/gaps` | Stacked bar by category (critical vs nice-to-have) | recharts BarChart |
| `/gaps` | Skill × Job heatmap grid | custom CSS grid |
| `/focus` | Skill frequency bars | recharts BarChart |
| `/focus` | Optional bubble chart | recharts ScatterChart |
| `/plan` | Vertical animated timeline | framer-motion |
| `/plan` | Per-day progress ring | react-circular-progressbar |
| `/plan` | Projected readiness-over-time line | recharts LineChart |

### New chart component tree
```
components/charts/
  ReadinessGauge.tsx          # radial 0-100, current vs projected
  PerJobScoreChart.tsx        # horizontal bars
  MatchedDonut.tsx            # "X of Y requirements" pie
  GapHeatmap.tsx              # skill × job grid, color-coded
  GapSeverityStack.tsx        # stacked bar by category
  SkillFrequencyChart.tsx     # horizontal bars or bubble
  ReadinessGrowthLine.tsx     # projected climb line chart
  AnimatedTimeline.tsx        # vertical day-by-day
  Stepper.tsx                 # 6-dot progress indicator
```

### Theming rules
- All chart colors resolved from CSS vars (`--accent`, `--text-muted`, `--border`, etc.)
- Custom tooltips matching card styling (rounded, bg-elev, border, mono font)
- Axis labels in `JetBrains_Mono`
- Animate stroke/bar fill on mount (`animationDuration={900}`, `ease-out`)
- Page transitions: wrap each route in `<motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}}>`

### Minimum viable for judges (if time runs out)
1. `ReadinessGauge` on `/score`
2. `GapHeatmap` on `/gaps`
3. `AnimatedTimeline` on `/plan`

---

## 8. Housekeeping (one-off)

- Verify `backend/.env` is in `.gitignore`; rotate keys if ever committed
- Delete 7 stale fixtures at `backend/` root
- Optional: root `package.json` with `concurrently` so one `npm run dev` starts both apps:
  ```json
  "scripts": {
    "dev": "concurrently \"npm --prefix backend run dev\" \"npm --prefix frontend run dev\""
  }
  ```

---

## 9. Ideal Build Order — Phased

Work is grouped into 6 phases. Each phase is independently demo-able — you can stop at any point and still have something that runs. Times are for focused solo work.

---

### Phase 0 — Cleanup & Prep  *(~30 min)*

**Goal:** remove dead code, confirm clean baseline.

- [ ] Confirm `backend/.env` is gitignored; rotate keys if needed.
- [ ] Delete stale fixtures at `backend/` root (7 files listed above).
- [ ] Optional: add root `package.json` with `concurrently` script.
- [ ] Install new backend deps: `multer`, `pdf-parse`, `mammoth`, `cheerio`, `zod-to-json-schema`, `@types/multer`.
- [ ] Install new frontend deps: `recharts`, `react-circular-progressbar`, `framer-motion`.

**Demo-able at end:** same app as today, just cleaner.

---

### Phase 1 — Data Model Foundation  *(~45 min)*

**Goal:** lock the new contracts before writing any logic.

- [ ] Update `backend/src/lib/types.ts`:
  - Replace `Timeline` with `Days = 7 | 14 | 28`.
  - Add `Difficulty` type + Zod enum.
  - Loosen `selectedJobs` to `.min(1).max(5)`.
  - Split `AnalysisResult` into `ScoreResult`, `GapsResult`, `FocusResult`, `PlanResult`.
  - Add `ParsedResume`, `Gap`, `LearningDay`, `ClusteredSkill` + Zod schemas.
- [ ] Mirror changes exactly in `frontend/lib/types.ts`.
- [ ] Extend `frontend/lib/context.tsx` — new state fields (no localStorage yet).
- [ ] Create `frontend/lib/api.ts` with `API_BASE`.

**Demo-able at end:** type-checks still pass; current flow still works (using old endpoint, which we remove later).

---

### Phase 2 — Live Job Search (Step 2 Browse)  *(~1.5 hr)*

**Goal:** replace hardcoded jobs with live JSearch.

- [ ] `/jobs` page: add `JobSearchBar` (query input + optional filters).
- [ ] On submit, call `GET /api/jobs/search?query=...`.
- [ ] Feed response into existing `JobGrid` / `JobCard` / `SelectionCounter` (they stay as-is).
- [ ] Remove `frontend/lib/jobs.ts` static array.
- [ ] Add loading + empty + error states.

**Demo-able at end:** live job search works end-to-end with the existing backend.

---

### Phase 3 — Resume Upload + Specific Job Mode (Step 1 & Step 2B)  *(~3 hr)*

**Goal:** stand up the two input-heavy steps.

- [ ] Backend: `POST /api/parse-resume` route — multer upload, `pdf-parse`/`mammoth`, OpenRouter call, mock fallback.
- [ ] Backend: `POST /api/jobs/parse` route — accepts title/JD/URL, uses `cheerio` for URL scrape, OpenRouter normalizes to `SelectedJob`.
- [ ] Frontend: `/onboarding` page — `ResumeDropzone` + LinkedIn URL field + `ProfileInput` fallback + "Continue" button.
- [ ] Frontend: `/jobs` — add tab switcher, add `SpecificJobForm` for tab B.
- [ ] Wire both pages to context.
- [ ] Add stepper (basic version is fine).

**Demo-able at end:** user uploads resume, picks jobs OR pastes a JD, and lands on... (the old results page still works from context if we keep the old endpoint temporarily).

---

### Phase 4 — Split AI Endpoints (Steps 3–6 backend)  *(~3 hr)*

**Goal:** 4 new step endpoints replace the mega `/api/analyze`.

- [ ] Create `backend/src/lib/aiPrompt.ts` split into 6 prompt builders (include the 2 from Phase 3).
- [ ] Extract shared guardrails block as a constant.
- [ ] Integrate `zod-to-json-schema` inside each builder.
- [ ] Create routes: `/api/score`, `/api/gaps`, `/api/skill-focus`, `/api/learning-path`.
- [ ] Each route: OpenRouter call → mock fallback → schema validate → respond. Copy pattern from old `analyze.ts`.
- [ ] Split `mockResults.ts` into 4 per-step mocks.
- [ ] Delete `backend/src/routes/analyze.ts` (only after Phase 5 wires the frontend).
- [ ] Update tests: one per new endpoint.

**Demo-able at end:** hit endpoints directly via curl/Postman and see typed, validated responses.

---

### Phase 5 — Step Pages + Basic Charts (Steps 3–6 frontend)  *(~4 hr)*

**Goal:** build the 4 result pages with at least one strong visual each.

- [ ] `/score` page: fetch `/api/score`, render `ReadinessGauge` + `SkillList` (matched) + `PerJobScoreChart`.
- [ ] `/gaps` page: fetch `/api/gaps`, render `GapHeatmap` + list of `GapCard`s.
- [ ] `/focus` page: fetch `/api/skill-focus`, render `SkillFrequencyChart` + `SkillFocusPicker` multi-select.
- [ ] `/plan` page: `DifficultySelector` + `TimelineSelector` (days variant) → fetch `/api/learning-path` → render `AnimatedTimeline`.
- [ ] Polish `Stepper` with framer-motion `layoutId` for the active pill.
- [ ] Delete `components/ResultsDashboard.tsx` and old `/results` route (or 301 to `/score`).

**Demo-able at end:** full 6-step flow works end-to-end with real data and real visuals.

---

### Phase 6 — Persistence + Polish  *(~1.5 hr)*

**Goal:** hackathon-worthy finish.

- [ ] Create `frontend/lib/storage.ts` — `saveStep`, `loadStep`, `clearAll`, namespace `unlockd:v1`.
- [ ] Generate `sessionId` on first visit; store in localStorage.
- [ ] Hydrate `AppContext` from localStorage on mount.
- [ ] Persist on every context setter.
- [ ] Add "Start over" button in `Nav` that calls `clearAll()` + routes to `/`.
- [ ] Add framer-motion page transitions (wrap each route).
- [ ] Add the bonus charts if time allows: `MatchedDonut`, `GapSeverityStack`, `ReadinessGrowthLine`.
- [ ] Theme pass: ensure all charts use CSS vars, custom tooltips, mono font labels.

**Demo-able at end:** refresh-proof, visually rich, full judge-ready flow.

---

## 10. Total Effort Estimate

| Phase | Hours |
|---|---|
| 0. Cleanup & prep | 0.5 |
| 1. Data model | 0.75 |
| 2. Live job search | 1.5 |
| 3. Resume + specific mode | 3.0 |
| 4. Split AI endpoints | 3.0 |
| 5. Step pages + charts | 4.0 |
| 6. Persistence + polish | 1.5 |
| **Total** | **~14.25 hr** |

Fits a hackathon weekend with buffer for debugging and demo prep.

---

## 11. Risks / Watch-outs

- **JSearch rate limits** (RapidAPI quota) — add an in-process LRU cache on `/api/jobs/search` keyed by query string.
- **OpenRouter cost** — 6 AI calls per user flow. Existing mock fallback handles missing keys; use it during dev.
- **PDF edge cases** — `pdf-parse`/`mammoth` throw on corrupted/encrypted files. Surface as "couldn't read this file, paste text instead" and fall back to `ProfileInput`.
- **Prompt/schema drift** — `zod-to-json-schema` eliminates this class of bug; use it.
- **Type duplication** — low risk at hackathon scale; edit both `types.ts` files together as a discipline.
- **Chart performance** — recharts animates on mount; disable `isAnimationActive` if you render 20+ series (unlikely here).

---

## 12. Minimum Viable Demo (if time collapses)

If you only get 6–8 hours instead of 14:

1. **Phase 0 + 1 + 2** — clean baseline + live jobs (3 hr)
2. **Skip** Phase 3 — keep textarea-only profile input, skip Specific mode
3. **Phase 4** — 4 split endpoints, even if some fall through to mocks (3 hr)
4. **Phase 5** light — build `/score` with `ReadinessGauge`, `/gaps` with `GapHeatmap`, `/plan` with `AnimatedTimeline`. Skip `/focus` (auto-pick top 3 gaps). (2 hr)
5. **Skip Phase 6** — no localStorage; just don't refresh during the demo.

Still a 4-screen, animated, live-data app — enough to impress.
