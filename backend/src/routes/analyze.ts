import { Router, Request, Response } from 'express';
import { validateRequest } from '../lib/validation';
import { buildPrompt } from '../lib/aiPrompt';
import { getMockResults } from '../lib/mockResults';
import { analysisResultSchema, AnalysisResult } from '../lib/types';
import { config } from '../config';

const router = Router();

/**
 * POST /api/analyze
 * 
 * Analyzes user profile against selected jobs using OpenRouter AI API.
 * 
 * Request body:
 * - profile: string (non-empty)
 * - selectedJobs: SelectedJob[] (2-5 entries)
 * - timeline: "2 weeks" | "4 weeks" | "8 weeks"
 * 
 * Response:
 * - 200: AnalysisResult JSON (from AI or mock fallback)
 * - 400: { error: string } for validation failures
 * 
 * Validates Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 9.1, 9.2, 20.1, 20.2, 20.3
 */
router.post('/api/analyze', async (req: Request, res: Response) => {
  // Validate request body
  const validation = validateRequest(req.body);
  
  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }
  
  const { profile, selectedJobs, timeline } = validation.data;
  
  // Build the AI prompt
  const prompt = buildPrompt(profile, selectedJobs, timeline);
  
  // Get OpenRouter API key from config
  const apiKey = config.openRouterApiKey;
  
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY environment variable is not set. Falling back to mock data.');
    return res.status(200).json(getMockResults());
  }
  
  try {
    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });
    
    // Check if response is successful
    if (!response.ok) {
      console.error(`OpenRouter API returned status ${response.status}. Falling back to mock data.`);
      return res.status(200).json(getMockResults());
    }
    
    // Parse the response
    const responseData = await response.json() as any;
    
    // Extract the content from the AI response
    const aiContent = responseData.choices?.[0]?.message?.content;
    
    if (!aiContent) {
      console.error('OpenRouter API response missing content field. Falling back to mock data.');
      return res.status(200).json(getMockResults());
    }
    
    // Parse the AI content as JSON
    let aiResult: unknown;
    try {
      aiResult = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      return res.status(200).json(getMockResults());
    }
    
    // Validate the AI result against the schema
    const schemaValidation = analysisResultSchema.safeParse(aiResult);
    
    if (!schemaValidation.success) {
      console.error('AI response failed schema validation:', schemaValidation.error);
      return res.status(200).json(getMockResults());
    }
    
    // Return the validated AI result
    return res.status(200).json(schemaValidation.data);
    
  } catch (error) {
    // Network error, timeout, or other exception
    console.error('Error calling OpenRouter API:', error);
    return res.status(200).json(getMockResults());
  }
});

export default router;
