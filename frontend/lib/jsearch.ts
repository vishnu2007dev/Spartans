export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_employment_type: string;
  job_description: string;
  job_apply_link: string;
  job_city?: string;
  job_state?: string;
  job_country: string;
  job_required_skills?: string[];
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
  };
}
