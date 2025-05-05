
// @deno-types="npm:@types/node@^18.0.0"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    // Create a temporary directory to clone the JobSpy repository
    const tempDir = await Deno.makeTempDir({ prefix: "jobspy_clone_" });
    
    try {
      // Clone the JobSpy repository from GitHub
      const gitCloneProcess = new Deno.Command("git", {
        args: ["clone", "https://github.com/speedyapply/JobSpy.git", tempDir],
      });
      
      const gitOutput = await gitCloneProcess.output();
      
      if (!gitOutput.success) {
        const errorText = new TextDecoder().decode(gitOutput.stderr);
        console.error("Git clone failed:", errorText);
        throw new Error(`Failed to clone JobSpy repository: ${errorText}`);
      }
      
      console.log("Successfully cloned JobSpy repository");
      
      // Create a Python script to run JobSpy
      const scriptContent = `
import sys
import json
from datetime import datetime

try:
    from jobspy import JobSpy, JobsProvider
except ImportError:
    # In case we need to install packages
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-e", "${tempDir}"])
    from jobspy import JobSpy, JobsProvider

try:
    # Parameters from command line arguments
    search_term = "${search}"
    location = "${location || ''}" 
    job_type = "${job_type || ''}"
    limit = ${limit}
    remote_only = ${remote ? 'True' : 'False'}
    
    # Initialize JobSpy
    providers = [JobsProvider.LinkedIn]
    if "indeed" in "${job_type}".lower():
        providers.append(JobsProvider.Indeed)
    if "glassdoor" in "${job_type}".lower():
        providers.append(JobsProvider.Glassdoor)
        
    spy = JobSpy(providers=providers)
    
    # Run the search
    jobs = spy.search(
        search_term=search_term,
        location=location if location else None,
        job_type=job_type if job_type else None,
        remote_only=remote_only,
        results_limit=limit
    )
    
    # Convert the jobs to a JSON-serializable format
    serialized_jobs = []
    for job in jobs:
        job_dict = {
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "date_posted": job.date_posted.isoformat() if job.date_posted else None,
            "job_type": job.job_type,
            "salary": job.salary,
            "description": job.description,
            "url": job.url,
            "job_id": job.job_id
        }
        serialized_jobs.append(job_dict)
    
    # Output as JSON
    print(json.dumps({"success": True, "jobs": serialized_jobs}))
except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
    sys.exit(1)
      `;
      
      await Deno.writeTextFile(`${tempDir}/run_jobspy.py`, scriptContent);
      
      // Run the script
      const pythonProcess = new Deno.Command("python3", {
        args: [`${tempDir}/run_jobspy.py`],
      });
      
      const pythonOutput = await pythonProcess.output();
      const stdoutText = new TextDecoder().decode(pythonOutput.stdout);
      const stderrText = new TextDecoder().decode(pythonOutput.stderr);
      
      if (!pythonOutput.success) {
        throw new Error(`JobSpy script execution failed: ${stderrText}`);
      }
      
      // Parse the output JSON
      const outputLines = stdoutText.split('\n')
        .filter(line => line.trim().startsWith('{'))
        .pop();
        
      if (!outputLines) {
        throw new Error("No valid JSON output from JobSpy script");
      }
      
      const jobspyResult = JSON.parse(outputLines);
      
      if (!jobspyResult.success) {
        throw new Error(`JobSpy search failed: ${jobspyResult.error}`);
      }
      
      // Process the retrieved jobs
      let jobsImported = 0;
      const errors = [];
      
      for (const job of jobspyResult.jobs) {
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
            type: job.job_type || 'full-time',
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
          jobs_processed: jobspyResult.jobs.length,
          jobs_imported: jobsImported,
          errors: errors.length > 0 ? errors : null
        })
      });
      
      return new Response(JSON.stringify({
        success: true,
        message: "Job import completed successfully",
        jobsImported: jobsImported,
        jobsProcessed: jobspyResult.jobs.length,
        errors: errors.length > 0 ? errors : null
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } finally {
      // Clean up the temporary directory
      try {
        await Deno.remove(tempDir, { recursive: true });
      } catch (cleanupError) {
        console.error("Failed to clean up temporary directory:", cleanupError);
      }
    }
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
