# Unlockd Backend

Express backend for the Unlockd career preparation platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API keys
```

**Get an OpenRouter API key:**
- Visit https://openrouter.ai/
- Sign up for an account
- Generate an API key from your dashboard
- Add it to `.env` as `OPENROUTER_API_KEY`

**Get a JSearch API key (RapidAPI):**
- Visit https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
- Sign up for RapidAPI and subscribe to JSearch (free tier available)
- Copy your RapidAPI key
- Add it to `.env` as `RAPIDAPI_KEY`

## Development

Run the development server:
```bash
npm run dev
```

The server will start on http://localhost:3001

## API Endpoints

### Health Check
```
GET /health
```

Returns server status.

### Search Jobs
```
GET /api/jobs/search
```

Search for jobs using JSearch API (RapidAPI).

**Query Parameters:**
- `query` (required): Search query (e.g., "Software Engineer Intern in San Francisco")
- `page` (optional): Page number (default: 1)
- `num_pages` (optional): Number of pages to fetch (default: 1)
- `date_posted` (optional): Filter by date posted - one of: `all`, `today`, `3days`, `week`, `month`
- `remote_jobs_only` (optional): Filter for remote jobs only - `true` or `false`
- `employment_types` (optional): Filter by employment type - `FULLTIME`, `PARTTIME`, `INTERN`, `CONTRACTOR`
- `job_requirements` (optional): Filter by experience level - `under_3_years_experience`, `more_than_3_years_experience`, `no_experience`, `no_degree`

**Example Request:**
```bash
GET /api/jobs/search?query=Software+Engineer+Intern&remote_jobs_only=true&date_posted=week
```

**Response (200 OK):**
```json
{
  "status": "OK",
  "request_id": "...",
  "data": [
    {
      "job_id": "...",
      "employer_name": "Tech Company",
      "employer_logo": "...",
      "job_title": "Software Engineer Intern",
      "job_description": "...",
      "job_employment_type": "INTERN",
      "job_apply_link": "...",
      "job_city": "San Francisco",
      "job_state": "California",
      "job_country": "US",
      "job_posted_at_datetime_utc": "2026-04-21T00:00:00.000Z",
      "job_salary": 27,
      "job_salary_period": "HOUR"
    }
  ]
}
```

### Get Job Details
```
GET /api/jobs/:jobId
```

Get detailed information about a specific job by ID.

**Path Parameters:**
- `jobId` (required): The job ID from search results

**Example Request:**
```bash
GET /api/jobs/H5UZYveOqUuRX7bZAAAAAA==
```

**Response (200 OK):**
Returns a single job object with full details.

### Analyze Career Readiness
```
POST /api/analyze
```

Analyzes user profile against selected jobs using AI.

**Request Body:**
```json
{
  "profile": "Your resume or skills summary text",
  "selectedJobs": [
    {
      "title": "Software Engineer Intern",
      "company": "Tech Corp",
      "description": "Build web applications using React and Node.js",
      "requiredSkills": ["JavaScript", "React", "Node.js"]
    },
    {
      "title": "Data Analyst Intern",
      "company": "Data Inc",
      "description": "Analyze data and create reports",
      "requiredSkills": ["Python", "SQL", "Excel"]
    }
  ],
  "timeline": "4 weeks"
}
```

**Validation Rules:**
- `profile`: Required, non-empty string
- `selectedJobs`: Array of 2-5 job objects
  - Each job must have: `title`, `company`, `description`, `requiredSkills`
  - `title` and `description` must be non-empty strings
- `timeline`: Must be one of: "2 weeks", "4 weeks", "8 weeks"

**Response (200 OK):**
```json
{
  "currentReadiness": 42,
  "projectedReadiness": 78,
  "summary": "Analysis summary...",
  "opportunityCoverage": {
    "current": "1 out of 2 roles",
    "projected": "2 out of 2 roles",
    "explanation": "Coverage explanation..."
  },
  "commonSkills": ["JavaScript", "Python"],
  "matchedSkills": ["JavaScript"],
  "missingSkills": ["React", "SQL"],
  "prioritySkills": [...],
  "learningRoadmap": [...],
  "recommendedCourses": [...],
  "portfolioProjects": [...],
  "resumeSuggestions": [...],
  "mentorStyleAdvice": "Personalized advice..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation error message"
}
```

## Fallback Behavior

If the OpenRouter API is unavailable or returns invalid data, the API automatically falls back to mock data to ensure the demo remains functional. This happens when:

- `OPENROUTER_API_KEY` is not set
- Network errors occur
- OpenRouter API returns non-200 status
- AI response cannot be parsed as valid JSON
- AI response fails schema validation

## Testing

Run all tests:
```bash
npm test
```

Run specific test file:
```bash
npm test -- analyze.route.test.ts
```

## Build

Build for production:
```bash
npm run build
```

Run production build:
```bash
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── lib/
│   │   ├── aiPrompt.ts       # AI prompt builder
│   │   ├── mockResults.ts    # Mock data fallback
│   │   ├── types.ts          # TypeScript types and Zod schemas
│   │   └── validation.ts     # Request validation
│   ├── routes/
│   │   └── analyze.ts        # /api/analyze route handler
│   └── server.ts             # Express app setup
├── __tests__/
│   ├── aiPrompt.test.ts
│   ├── analyze.route.test.ts
│   ├── mockResults.test.ts
│   ├── requestValidation.property.test.ts
│   ├── server.integration.test.ts
│   └── validation.test.ts
└── package.json
```

## OpenRouter Integration

The backend uses OpenRouter (https://openrouter.ai/) as the AI provider. OpenRouter provides access to multiple AI models through a unified API.

**Model Used:** `openai/gpt-4o-mini`

**API Endpoint:** `https://openrouter.ai/api/v1/chat/completions`

**Request Format:**
```json
{
  "model": "openai/gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "<prompt from buildPrompt function>"
    }
  ]
}
```

**Response Format:**
```json
{
  "choices": [
    {
      "message": {
        "content": "<JSON string with analysis results>"
      }
    }
  ]
}
```

The AI is instructed to return structured JSON matching the `AnalysisResult` schema, which is then validated before being returned to the frontend.
