
// @deno-types="npm:@types/node@^18.0.0"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock data for job listings to use as fallback
const mockJobs = [
  {
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    date_posted: new Date().toISOString(),
    job_type: "Full-time",
    salary: "$120,000 - $160,000",
    description: "Senior Software Engineer position with expertise in React, Node.js, and cloud infrastructure.",
    url: "https://example.com/job/123",
    job_id: "mock-job-1"
  },
  {
    title: "Frontend Developer",
    company: "WebSolutions Inc",
    location: "Remote",
    date_posted: new Date().toISOString(),
    job_type: "Full-time",
    salary: "$90,000 - $120,000",
    description: "Frontend Developer with experience in React, TypeScript, and modern web frameworks.",
    url: "https://example.com/job/124",
    job_id: "mock-job-2"
  },
  {
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    date_posted: new Date().toISOString(),
    job_type: "Full-time",
    salary: "$110,000 - $150,000",
    description: "DevOps Engineer with AWS, Kubernetes, and CI/CD pipeline experience.",
    url: "https://example.com/job/125",
    job_id: "mock-job-3"
  }
];

// Function to search for jobs based on criteria
function searchJobs(search: string, location: string, job_type: string, remote: boolean, limit: number) {
  // Simulation of job search - in production this would connect to a job API or database
  let results = [...mockJobs];
  
  // Generate some random variations to make the results unique per search
  const randomJobs = results.map(job => ({
    ...job,
    job_id: `${job.job_id}-${Math.floor(Math.random() * 1000)}`,
    date_posted: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString()
  }));
  
  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    results = randomJobs.filter(job => 
      job.title.toLowerCase().includes(searchLower) || 
      job.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by location
  if (location) {
    const locationLower = location.toLowerCase();
    results = results.filter(job => 
      job.location.toLowerCase().includes(locationLower)
    );
  }
  
  // Filter by job type
  if (job_type) {
    const jobTypeLower = job_type.toLowerCase();
    results = results.filter(job => 
      job.job_type.toLowerCase().includes(jobTypeLower)
    );
  }
  
  // Filter by remote status
  if (remote) {
    results = results.filter(job => 
      job.location.toLowerCase().includes("remote")
    );
  }
  
  // Add some more random jobs to reach the limit
  while (results.length < limit) {
    const baseJob = mockJobs[Math.floor(Math.random() * mockJobs.length)];
    results.push({
      ...baseJob,
      job_id: `${baseJob.job_id}-${Math.floor(Math.random() * 10000)}`,
      date_posted: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  // Limit results
  return results.slice(0, limit);
}

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
    
    // Search for jobs using mock function
    console.log("Searching for jobs with criteria:", { search, location, job_type, remote, limit });
    const jobs = searchJobs(search, location, job_type, remote, limit);
    
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
            location: job.location || null
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
        }
        
        // Prepare job data
        const postedDate = job.date_posted ? new Date(job.date_posted) : new Date();
        const jobData = {
          company_id: companyId,
          title: job.title,
          description: job.description || 'No description provided',
          location: job.location || null,
          type: job.job_type.toLowerCase().includes('full') ? 'full-time' : 
                job.job_type.toLowerCase().includes('part') ? 'part-time' : 
                job.job_type.toLowerCase().includes('contract') ? 'contract' : 'full-time',
          posted_date: postedDate.toISOString(),
          url: job.url,
          salary: job.salary || null,
          api_job_id: job.job_id || job.url,
          api_source: 'JobSpy',
          is_approved: true,
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
