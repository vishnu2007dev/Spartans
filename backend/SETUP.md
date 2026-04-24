# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd Spartans/backend
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_actual_openrouter_key

# JSearch API Configuration (RapidAPI)
RAPIDAPI_KEY=your_actual_rapidapi_key
RAPIDAPI_HOST=jsearch.p.rapidapi.com
```

### 3. Get Your API Keys

#### OpenRouter API Key (for AI analysis)
1. Visit https://openrouter.ai/
2. Sign up for an account
3. Go to your dashboard
4. Generate an API key
5. Copy the key and paste it in `.env` as `OPENROUTER_API_KEY`

**Model Used:** `openai/gpt-4o-mini`

#### JSearch API Key (for job search)
1. Visit https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
2. Sign up for RapidAPI (free account available)
3. Subscribe to JSearch API (free tier available with 250 requests/month)
4. Copy your RapidAPI key from the dashboard
5. Paste it in `.env` as `RAPIDAPI_KEY`

**Note:** The `RAPIDAPI_HOST` is already set to `jsearch.p.rapidapi.com` in the `.env` file.

### 4. Start the Development Server

```bash
npm run dev
```

The server will start on http://localhost:3001

### 5. Test the API

#### Health Check
```bash
curl http://localhost:3001/health
```

#### Analyze Endpoint
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "profile": "I am a computer science student with experience in Python and JavaScript.",
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
        "description": "Analyze data and create reports using Python and SQL",
        "requiredSkills": ["Python", "SQL", "Excel"]
      }
    ],
    "timeline": "4 weeks"
  }'
```

## Fallback Behavior

If the OpenRouter API is unavailable or returns invalid data, the API automatically falls back to mock data to ensure the demo remains functional. This happens when:

- `OPENROUTER_API_KEY` is not set or invalid
- Network errors occur
- OpenRouter API returns non-200 status
- AI response cannot be parsed as valid JSON
- AI response fails schema validation

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
backend/
├── src/
│   ├── lib/
│   │   ├── aiPrompt.ts       # AI prompt builder for OpenRouter
│   │   ├── mockResults.ts    # Mock data fallback
│   │   ├── types.ts          # TypeScript types and Zod schemas
│   │   └── validation.ts     # Request validation
│   ├── routes/
│   │   └── analyze.ts        # /api/analyze route handler
│   └── server.ts             # Express app setup (loads .env)
├── __tests__/                # Test files
├── .env                      # Your API keys (DO NOT COMMIT)
├── .env.example              # Template for .env
└── package.json
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key for AI analysis |
| `RAPIDAPI_KEY` | Optional* | Your RapidAPI key for JSearch job search |
| `RAPIDAPI_HOST` | Optional* | JSearch API host (default: jsearch.p.rapidapi.com) |

*Note: JSearch API integration is planned for future job search features. Currently, the platform uses preloaded job data.

## Troubleshooting

### "OPENROUTER_API_KEY environment variable is not set"
- Make sure you created the `.env` file in the `backend/` directory
- Verify the API key is correctly set in `.env`
- Restart the server after adding the key

### Tests failing
- Run `npm install` to ensure all dependencies are installed
- Check that all test files are in the `__tests__/` directory
- Run `npm test` to see detailed error messages

### Port 3001 already in use
- Stop any other processes using port 3001
- Or change the port in `src/server.ts` (line 5: `const PORT = 3001;`)

## Next Steps

1. ✅ Set up your API keys in `.env`
2. ✅ Start the backend server
3. ✅ Test the `/api/analyze` endpoint
4. 🔄 Coordinate with your frontend teammate (Om) to integrate the API
5. 🔄 Test the full flow: Frontend → Backend → AI → Frontend

## Support

For issues or questions:
- Check the main README.md for API documentation
- Review the test files in `__tests__/` for usage examples
- Consult the OpenRouter docs: https://openrouter.ai/docs
- Consult the JSearch API docs: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
