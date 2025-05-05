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
    
    const { search, location, job_type, limit } = await req.json();
    
    if (!search) {
      throw new Error("Search term is required");
    }
    
    const parameters = {
      search,
      location,
      job_type,
      limit: limit || 10
    };
    
    console.log(`Would call JobSpy API with parameters: ${JSON.stringify(parameters)}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockJobSpyResponse = {
      success: true,
      jobs: [
        {
          job_title: "Software Engineer",
          company_name: "Tech Innovations Inc.",
          location: "San Francisco, CA",
          job_type: "Full-time",
          posted_date: "2024-01-01",
          description: "Exciting opportunity for a software engineer to work on cutting-edge technologies.",
          url: "https://example.com/jobs/123",
          salary: "$120,000 - $150,000",
          benefits: "Health, dental, vision, and paid time off",
          requirements: "Bachelor's degree in computer science and 3+ years of experience",
          company_id: "tech-innovations-inc",
          company_industry: "Technology",
          company_size: "500-1000 employees",
          company_headquarters: "San Francisco, CA",
          company_followers: 5000,
          recruiter_name: "Jane Smith",
          recruiter_title: "Hiring Manager",
          recruiter_url: "https://example.com/recruiters/jane-smith",
          api_job_id: "123",
          api_source: "JobSpy",
        },
        {
          job_title: "Data Scientist",
          company_name: "Data Insights Corp",
          location: "New York, NY",
          job_type: "Full-time",
          posted_date: "2024-01-05",
          description: "Join our team of data scientists to analyze and interpret complex data sets.",
          url: "https://example.com/jobs/456",
          salary: "$110,000 - $140,000",
          benefits: "Health, dental, vision, and paid time off",
          requirements: "Master's degree in statistics or related field and 2+ years of experience",
          company_id: "data-insights-corp",
          company_industry: "Analytics",
          company_size: "200-500 employees",
          company_headquarters: "New York, NY",
          company_followers: 3000,
          recruiter_name: "John Doe",
          recruiter_title: "Senior Recruiter",
          recruiter_url: "https://example.com/recruiters/john-doe",
          api_job_id: "456",
          api_source: "JobSpy",
        }
      ]
    };
    
    console.log(`Received ${mockJobSpyResponse.jobs.length} jobs from JobSpy API`);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    let jobsImported = 0;
    for (const jobData of mockJobSpyResponse.jobs) {
      try {
        const {
          job_title,
          company_name,
          location,
          job_type,
          posted_date,
          description,
          url,
          salary,
          company_id,
          company_industry,
          company_size,
          company_headquarters,
          company_followers,
          recruiter_name,
          recruiter_title,
          recruiter_url,
          api_job_id,
          api_source,
        } = jobData;
        
        // Check if the company exists, create if not
        let companyId = company_id;
        const companyResponse = await fetch(`${supabaseUrl}/rest/v1/companies?select=id&id=eq.${companyId}`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          }
        });
        
        if (!companyResponse.ok) {
          throw new Error(`Failed to fetch company: ${companyResponse.status}`);
        }
        
        const companies = await companyResponse.json();
        if (companies.length === 0) {
          // Create the company
          const createCompanyResponse = await fetch(`${supabaseUrl}/rest/v1/companies`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              id: companyId,
              name: company_name,
              industry: company_industry,
              size: company_size,
              location: company_headquarters,
              followers: company_followers,
            })
          });
          
          if (!createCompanyResponse.ok) {
            throw new Error(`Failed to create company: ${createCompanyResponse.status}`);
          }
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
          body: JSON.stringify({
            company_id: companyId,
            title: job_title,
            description: description,
            location: location,
            type: job_type,
            posted_date: posted_date,
            url: url,
            salary: salary,
            recruiter_name: recruiter_name,
            recruiter_title: recruiter_title,
            recruiter_url: recruiter_url,
            api_job_id: api_job_id,
            api_source: api_source,
            posted_by: 'JobSpy Import',
            is_approved: true,
          })
        });
        
        if (!createJobResponse.ok) {
          throw new Error(`Failed to create job: ${createJobResponse.status}`);
        }
        
        jobsImported++;
      } catch (error) {
        console.error("Error processing job:", error);
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Job import completed successfully",
      jobsImported: jobsImported,
      jobsProcessed: mockJobSpyResponse.jobs.length,
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
