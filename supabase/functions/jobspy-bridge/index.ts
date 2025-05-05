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
    console.log("Starting JobSpy bridge function");
    
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
      console.log("This is a test request. Would have searched for:", { search, location, job_type, limit, remote });
      
      // Simulate a short delay to make the test feel realistic
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return new Response(JSON.stringify({
        success: true,
        message: "JobSpy bridge test successful",
        parameters: { search, location, job_type, remote, limit }
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Clone the JobSpy repository
    const tempDir = await Deno.makeTempDir({ prefix: "jobspy_clone_" });
    
    try {
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
      
      // Create a Python virtual environment
      const venvProcess = new Deno.Command("python3", {
        args: ["-m", "venv", `${tempDir}/venv`],
      });
      
      const venvOutput = await venvProcess.output();
      
      if (!venvOutput.success) {
        const errorText = new TextDecoder().decode(venvOutput.stderr);
        console.error("Failed to create virtual environment:", errorText);
        throw new Error(`Failed to create Python virtual environment: ${errorText}`);
      }
      
      // Install JobSpy package in editable mode
      const pipProcess = new Deno.Command(`${tempDir}/venv/bin/pip`, {
        args: ["install", "-e", tempDir],
      });
      
      const pipOutput = await pipProcess.output();
      
      if (!pipOutput.success) {
        const errorText = new TextDecoder().decode(pipOutput.stderr);
        console.error("Failed to install JobSpy package:", errorText);
        throw new Error(`Failed to install JobSpy package: ${errorText}`);
      }
      
      // Create a Python script to run JobSpy
      const scriptContent = `
import json
import sys
from jobspy import JobSpy, JobsProvider

try:
    search_term = "${search}"
    location = "${location || ''}" 
    job_type = "${job_type || ''}"
    limit = ${limit}
    remote_only = ${remote ? 'True' : 'False'}
    
    # Output parameters being used
    print(f"Parameters: search={search_term}, location={location}, job_type={job_type}, limit={limit}, remote={remote_only}")
    
    # Initialize JobSpy
    spy = JobSpy(
        providers=[JobsProvider.LinkedIn, JobsProvider.Indeed, JobsProvider.Glassdoor]
    )
    
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
    sys.exit(0)
except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
    sys.exit(1)
      `;
      
      await Deno.writeTextFile(`${tempDir}/run_jobspy.py`, scriptContent);
      
      // Run the script
      const pythonProcess = new Deno.Command(`${tempDir}/venv/bin/python`, {
        args: [`${tempDir}/run_jobspy.py`],
      });
      
      const pythonOutput = await pythonProcess.output();
      const stdoutText = new TextDecoder().decode(pythonOutput.stdout);
      const stderrText = new TextDecoder().decode(pythonOutput.stderr);
      
      console.log("Python stdout:", stdoutText);
      if (stderrText) {
        console.error("Python stderr:", stderrText);
      }
      
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
      
      // Return the results
      return new Response(JSON.stringify({
        success: true,
        jobs: jobspyResult.jobs
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
      
    } finally {
      // Clean up the temporary directory
      try {
        await Deno.remove(tempDir, { recursive: true });
        console.log("Cleaned up temporary directory");
      } catch (cleanupError) {
        console.error("Failed to clean up temporary directory:", cleanupError);
      }
    }
  } catch (error) {
    console.error("Error in jobspy-bridge function:", error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      error_type: error.constructor.name || "Error",  // Include error type for better debugging
      stack: error.stack ? error.stack.split("\n").slice(0, 3).join("\n") : null  // Include partial stack for debugging
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
