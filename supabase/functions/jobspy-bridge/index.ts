
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
  
  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter(job => 
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
  
  // Limit results
  return results.slice(0, limit);
}

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
    
    // If this is just a test request, return success without actual search
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

    // Search for jobs
    console.log("Searching for jobs with criteria:", { search, location, job_type, remote, limit });
    const jobs = searchJobs(search, location, job_type, remote, limit);
    
    // Log the results
    console.log(`Found ${jobs.length} jobs matching criteria`);
    
    // Return the results
    return new Response(JSON.stringify({
      success: true,
      jobs: jobs
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in jobspy-bridge function:", error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      error_type: error.constructor.name || "Error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
