
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JobSpy } from 'npm:jobspy';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function importJobs(params: any) {
  const spy = new JobSpy({
    site: params.site || "linkedin",
    country: params.country || "united states",
    location: params.location,
    experienceLevel: params.experienceLevel,
    maximize: true,
  });

  try {
    const jobs = await spy.search();
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const params = await req.json();
    const jobs = await importJobs(params);

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
        source: 'jobspy',
        jobs_processed: jobs.length,
        metadata: { raw_job_count: jobs.length }
      })
    });

    if (!importLogResponse.ok) {
      console.error('Failed to create import log:', await importLogResponse.text());
    }

    // Format and insert jobs
    const formattedJobs = jobs.map(job => ({
      title: job.title,
      description: job.description || '',
      company_id: null,
      location: job.location,
      type: job.type || 'full-time',
      salary: job.salary ? JSON.stringify(job.salary) : null,
      api_source: 'jobspy',
      api_job_id: job.id?.toString(),
      url: job.url,
      company_size: job.company_size,
      company_industry: job.company_industry,
      ai_salary_data: job.salary ? JSON.stringify(job.salary) : null,
      ai_benefits: job.benefits?.join(', '),
      ai_experience_level: job.experience_level,
      posted_by: null
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
