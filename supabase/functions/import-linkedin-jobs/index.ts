
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration for LinkedIn Job Search API
const LINKEDIN_API_URL = 'https://linkedin-jobs-search.p.rapidapi.com/';

async function fetchLinkedInJobs() {
  try {
    const response = await fetch(LINKEDIN_API_URL, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`LinkedIn Jobs API error: ${response.status}`);
    }

    const jobs = await response.json();
    return jobs;
  } catch (error) {
    console.error('Error fetching LinkedIn jobs:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const jobs = await fetchLinkedInJobs();

    // Create a job import log entry
    const importLogResponse = await fetch('https://lckyfjxdnmwhmruvgpwn.supabase.co/rest/v1/job_imports', {
      method: 'POST',
      headers: {
        'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        source: 'linkedin_api',
        jobs_processed: jobs.length,
        metadata: { raw_job_count: jobs.length }
      })
    });

    if (!importLogResponse.ok) {
      console.error('Failed to create import log:', await importLogResponse.text());
    }

    // Prepare and insert jobs
    const formattedJobs = jobs.map(job => ({
      title: job.title,
      description: job.description_text,
      company_id: null, // You might want to create or link to an existing company
      posted_by: null, // Set to a system user or leave null
      location: job.locations_derived ? job.locations_derived[0] : null,
      type: job.employment_type ? job.employment_type[0] : 'full-time',
      salary: job.salary_raw ? JSON.stringify(job.salary_raw) : null,
      api_source: 'linkedin',
      api_job_id: job.id.toString(),
      recruiter_name: job.recruiter_name,
      recruiter_title: job.recruiter_title,
      recruiter_url: job.recruiter_url,
      company_size: job.linkedin_org_employees,
      company_industry: job.linkedin_org_industry,
      company_followers: job.linkedin_org_followers,
      company_headquarters: job.linkedin_org_headquarters,
      ai_salary_data: job.ai_salary_data ? JSON.stringify(job.ai_salary_data) : null,
      ai_benefits: job.ai_benefits,
      ai_experience_level: job.ai_experience_level,
      ai_work_arrangement: job.ai_work_arrangement,
      ai_key_skills: job.ai_key_skills,
      url: job.url
    }));

    // Insert jobs into the database
    const jobsResponse = await fetch('https://lckyfjxdnmwhmruvgpwn.supabase.co/rest/v1/jobs', {
      method: 'POST',
      headers: {
        'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(formattedJobs)
    });

    if (!jobsResponse.ok) {
      console.error('Failed to insert jobs:', await jobsResponse.text());
    }

    return new Response(JSON.stringify({ 
      message: 'Jobs imported successfully', 
      jobsImported: jobs.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in job import:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
