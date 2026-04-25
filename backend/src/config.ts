import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  rapidApiKey: process.env.RAPIDAPI_KEY,
  rapidApiHost: process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com',
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
  port: process.env.PORT || 3001,
};

// Log configuration status (without exposing keys)
console.log('Configuration loaded:');
console.log(`- OpenRouter API Key: ${config.openRouterApiKey ? '✓ Set' : '✗ Not set'}`);
console.log(`- RapidAPI Key: ${config.rapidApiKey ? '✓ Set' : '✗ Not set'}`);
console.log(`- RapidAPI Host: ${config.rapidApiHost}`);
console.log(`- ElevenLabs API Key: ${config.elevenLabsApiKey ? '✓ Set' : '✗ Not set'}`);
