import { Router, Request, Response } from 'express';
import { searchJobs, getJobDetails, JobSearchParams } from '../lib/jsearch';

const router = Router();

/**
 * GET /api/jobs/search
 * 
 * Search for jobs using JSearch API
 * 
 * Query parameters:
 * - query: string (required) - Search query (e.g., "Software Engineer Intern in San Francisco")
 * - page: number (optional) - Page number (default: 1)
 * - num_pages: number (optional) - Number of pages to fetch (default: 1)
 * - date_posted: string (optional) - Filter by date posted (all, today, 3days, week, month)
 * - remote_jobs_only: boolean (optional) - Filter for remote jobs only
 * - employment_types: string (optional) - Filter by employment type (FULLTIME, PARTTIME, INTERN, CONTRACTOR)
 * - job_requirements: string (optional) - Filter by experience level (under_3_years_experience, more_than_3_years_experience, no_experience, no_degree)
 * 
 * Response:
 * - 200: Job search results
 * - 400: Missing or invalid query parameter
 * - 500: JSearch API error
 */
router.get('/api/jobs/search', async (req: Request, res: Response) => {
  try {
    const { query, page, num_pages, date_posted, remote_jobs_only, employment_types, job_requirements } = req.query;

    // Validate required query parameter
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: 'Query parameter is required and must be a string' 
      });
    }

    // Build search parameters
    const searchParams: JobSearchParams = {
      query,
      page: page ? parseInt(page as string) : 1,
      num_pages: num_pages ? parseInt(num_pages as string) : 1,
    };

    if (date_posted && typeof date_posted === 'string') {
      searchParams.date_posted = date_posted as any;
    }

    if (remote_jobs_only !== undefined) {
      searchParams.remote_jobs_only = remote_jobs_only === 'true';
    }

    if (employment_types && typeof employment_types === 'string') {
      searchParams.employment_types = employment_types;
    }

    if (job_requirements && typeof job_requirements === 'string') {
      searchParams.job_requirements = job_requirements;
    }

    // Call JSearch API
    const results = await searchJobs(searchParams);

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in /api/jobs/search:', error);
    return res.status(500).json({ 
      error: 'Failed to search jobs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/jobs/:jobId
 * 
 * Get detailed information about a specific job
 * 
 * Path parameters:
 * - jobId: string (required) - The job ID
 * 
 * Response:
 * - 200: Job details
 * - 400: Missing job ID
 * - 500: JSearch API error
 */
router.get('/api/jobs/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ 
        error: 'Job ID is required' 
      });
    }

    // Call JSearch API
    const jobDetails = await getJobDetails(jobId);

    return res.status(200).json(jobDetails);
  } catch (error) {
    console.error('Error in /api/jobs/:jobId:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch job details',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
