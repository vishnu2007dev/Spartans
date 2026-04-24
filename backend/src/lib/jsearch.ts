import { config } from '../config';

/**
 * Job data structure from JSearch API
 */
export interface JSearchJob {
  job_id: string;
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  job_employment_type: string;
  job_title: string;
  job_apply_link: string;
  job_description: string;
  job_city?: string;
  job_state?: string;
  job_country: string;
  job_latitude?: number;
  job_longitude?: number;
  job_posted_at_datetime_utc?: string;
  job_required_skills?: string[];
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
  };
}

export interface JSearchResponse {
  status: string;
  request_id: string;
  data: JSearchJob[];
}

export interface JobSearchParams {
  query: string;
  page?: number;
  num_pages?: number;
  date_posted?: 'all' | 'today' | '3days' | 'week' | 'month';
  remote_jobs_only?: boolean;
  employment_types?: string;
  job_requirements?: string;
}

/**
 * Search for jobs using JSearch API (RapidAPI)
 * 
 * @param params - Search parameters
 * @returns Promise with job search results
 */
export async function searchJobs(params: JobSearchParams): Promise<JSearchResponse> {
  const apiKey = config.rapidApiKey;
  const apiHost = config.rapidApiHost;

  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY is not configured');
  }

  // Build query parameters
  const queryParams = new URLSearchParams({
    query: params.query,
    page: (params.page || 1).toString(),
    num_pages: (params.num_pages || 1).toString(),
  });

  if (params.date_posted) {
    queryParams.append('date_posted', params.date_posted);
  }

  if (params.remote_jobs_only !== undefined) {
    queryParams.append('remote_jobs_only', params.remote_jobs_only.toString());
  }

  if (params.employment_types) {
    queryParams.append('employment_types', params.employment_types);
  }

  if (params.job_requirements) {
    queryParams.append('job_requirements', params.job_requirements);
  }

  const url = `https://${apiHost}/search?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    if (!response.ok) {
      throw new Error(`JSearch API returned status ${response.status}`);
    }

    const data = await response.json() as JSearchResponse;
    return data;
  } catch (error) {
    console.error('Error calling JSearch API:', error);
    throw error;
  }
}

/**
 * Get job details by job ID
 * 
 * @param jobId - The job ID to fetch details for
 * @returns Promise with job details
 */
export async function getJobDetails(jobId: string): Promise<JSearchJob> {
  const apiKey = config.rapidApiKey;
  const apiHost = config.rapidApiHost;

  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY is not configured');
  }

  const url = `https://${apiHost}/job-details?job_id=${encodeURIComponent(jobId)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    if (!response.ok) {
      throw new Error(`JSearch API returned status ${response.status}`);
    }

    const data = await response.json() as { data: JSearchJob[] };
    return data.data[0];
  } catch (error) {
    console.error('Error calling JSearch API:', error);
    throw error;
  }
}
