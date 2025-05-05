
// @deno-types="npm:@types/node@^18.0.0"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JobsProvider, JobSpy } from "npm:jobspy@^0.7.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Starting JobSpy import function");
    
    // Extract parameters from request
    const { 
      search, 
      location, 
      job_type,
      remote = false, 
      is_test = false,
      limit = 10 
    } = await req.json();
    
    if (!search) {
      throw new Error("Search term is required");
    }
    
    // If this is just a test request, return success without actual API call
    if (is_test) {
      console.log("This is a test request. Would have searched for:", { search, location, job_type, limit });
      return new Response(JSON.stringify({
        success: true,
        message: "JobSpy API connection test successful",
        parameters: { search, location, job_type, limit }
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Get the supabase client for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Get JobSpy API configuration from system_config
    const configResponse = await fetch(`${supabaseUrl}/rest/v1/system_config?key=eq.jobspy_api_config`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });
    
    if (!configResponse.ok) {
      throw new Error(`Failed to fetch JobSpy API configuration: ${configResponse.status}`);
    }
    
    const configData = await configResponse.json();
    if (!configData || configData.length === 0) {
      throw new Error("JobSpy API configuration not found");
    }
    
    const apiConfig = configData[0].value;
    if (!apiConfig.api_key) {
      throw new Error("JobSpy API key is not configured");
    }

    console.log(`Fetching jobs with search term: "${search}", location: "${location || 'any'}", job type: "${job_type || 'any'}"`);
    
    // Create job import record
    const importPayload = {
      source: "JobSpy",
      status: "processing",
      metadata: {
        search,
        location,
        job_type,
        limit
      }
    };
    
    const importResponse = await fetch(`${supabaseUrl}/rest/v1/job_imports`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(importPayload)
    });
    
    if (!importResponse.ok) {
      throw new Error(`Failed to create import record: ${importResponse.status}`);
    }
    
    const importRecord = await importResponse.json();
    const importId = importRecord[0].id;
    
    // Initialize JobSpy
    const spy = new JobSpy({
      providers: [JobsProvider.LinkedIn, JobsProvider.Indeed, JobsProvider.Glassdoor],
      apiKey: apiConfig.api_key
    });
    
    // Set providers based on configuration if available
    if (apiConfig.active_sources && Array.isArray(apiConfig.active_sources) && apiConfig.active_sources.length > 0) {
      const providers = [];
      if (apiConfig.active_sources.includes('linkedin')) providers.push(JobsProvider.LinkedIn);
      if (apiConfig.active_sources.includes('indeed')) providers.push(JobsProvider.Indeed);
      if (apiConfig.active_sources.includes('glassdoor')) providers.push(JobsProvider.Glassdoor);
      if (providers.length > 0) {
        spy.options.providers = providers;
      }
    }
    
    console.log(`Using providers: ${spy.options.providers.join(', ')}`);
    
    // Execute the job search
    let jobs;
    try {
      jobs = await spy.search({
        search_term: search,
        location: location || undefined,
        job_type: job_type || undefined,
        remote_only: remote,
        results_limit: limit
      });
      
      console.log(`Retrieved ${jobs.length} jobs from JobSpy`);
    } catch (error) {
      // Update import record with error status
      await fetch(`${supabaseUrl}/rest/v1/job_imports?id=eq.${importId}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: "failed",
          completed_at: new Date().toISOString(),
          errors: { message: error.message }
        })
      });
      
      throw new Error(`JobSpy search failed: ${error.message}`);
    }
    
    // Process the retrieved jobs
    let jobsImported = 0;
    const errors = [];
    
    for (const job of jobs) {
      try {
        // Extract company details
        const companyName = job.company || 'Unknown';
        const companyId = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Check if the company exists
        const companyResponse = await fetch(`${supabaseUrl}/rest/v1/companies?id=eq.${companyId}`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (!companyResponse.ok) {
          throw new Error(`Failed to check company: ${companyResponse.status}`);
        }
        
        const companies = await companyResponse.json();
        if (companies.length === 0) {
          // Create the company
          const companyData = {
            id: companyId,
            name: companyName,
            location: job.location || null,
            industry: null,  // JobSpy doesn't provide industry info
            size: null       // JobSpy doesn't provide company size
          };
          
          const createCompanyResponse = await fetch(`${supabaseUrl}/rest/v1/companies`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(companyData)
          });
          
          if (!createCompanyResponse.ok) {
            throw new Error(`Failed to create company: ${createCompanyResponse.status}`);
          }
          
          console.log(`Created new company: ${companyName}`);
        }
        
        // Prepare job data
        const jobData = {
          company_id: companyId,
          title: job.title,
          description: job.description || 'No description provided',
          location: job.location || null,
          type: mapJobType(job.job_type),
          posted_date: job.date_posted ? new Date(job.date_posted).toISOString() : new Date().toISOString(),
          url: job.url,
          salary: job.salary || null,
          api_job_id: job.job_id || job.url,
          api_source: 'JobSpy',
          posted_by: 'JobSpy Import',
          is_approved: true,  // Auto-approve imported jobs
          import_id: importId,
          status: 'active'
        };
        
        // Check if job already exists by API job ID
        const existingJobResponse = await fetch(`${supabaseUrl}/rest/v1/jobs?api_job_id=eq.${encodeURIComponent(jobData.api_job_id)}`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (!existingJobResponse.ok) {
          throw new Error(`Failed to check existing job: ${existingJobResponse.status}`);
        }
        
        const existingJobs = await existingJobResponse.json();
        if (existingJobs.length > 0) {
          console.log(`Job already exists: ${jobData.title}`);
          continue;
        }
        
        // Create the job
        const createJobResponse = await fetch(`${supabaseUrl}/rest/v1/jobs`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(jobData)
        });
        
        if (!createJobResponse.ok) {
          throw new Error(`Failed to create job: ${createJobResponse.status}`);
        }
        
        console.log(`Created new job: ${jobData.title}`);
        jobsImported++;
      } catch (error) {
        console.error(`Error processing job: ${error.message}`);
        errors.push({ job_title: job.title, error: error.message });
      }
    }
    
    // Update import record with final status
    await fetch(`${supabaseUrl}/rest/v1/job_imports?id=eq.${importId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: errors.length === 0 ? "completed" : "completed_with_errors",
        completed_at: new Date().toISOString(),
        jobs_processed: jobs.length,
        jobs_imported: jobsImported,
        errors: errors.length > 0 ? errors : null
      })
    });
    
    // Update the last update timestamp in API config
    await fetch(`${supabaseUrl}/rest/v1/system_config?key=eq.jobspy_api_config`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: {
          ...apiConfig,
          last_update: new Date().toISOString()
        }
      })
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: "Job import completed successfully",
      jobsImported: jobsImported,
      jobsProcessed: jobs.length,
      errors: errors.length > 0 ? errors : null
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in job import function:", error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Helper function to map JobSpy job types to our enum values
function mapJobType(jobType: string | undefined): string {
  if (!jobType) return 'full-time';
  
  const type = jobType.toLowerCase();
  if (type.includes('part')) return 'part-time';
  if (type.includes('contract')) return 'contract';
  if (type.includes('intern')) return 'internship';
  if (type.includes('temporary')) return 'temporary';
  
  return 'full-time'; // default
}
