import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const theirStackApiKey = Deno.env.get('THEIRSTACK_API_KEY')!;
const BASE_URL = 'https://api.theirstack.com/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching jobs from TheirStack API');
    
    const { page = 1, filters = {} } = await req.json();
    
    // Build query parameters according to TheirStack API documentation
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...(filters.location ? { location: filters.location } : {}),
      ...(filters.remote === true ? { remote: 'true' } : {}),
      ...(filters.search ? { search: filters.search } : {}),
      // Add any additional filters from the request
      ...Object.fromEntries(
        Object.entries(filters).filter(([k, v]) => 
          !['location', 'remote', 'search'].includes(k) && 
          v !== undefined && v !== null && v !== ''
        )
      )
    });
    
    console.log(`API Request: ${BASE_URL}/job_postings?${queryParams}`);
    
    const response = await fetch(`${BASE_URL}/job_postings?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${theirStackApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TheirStack API error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      throw new Error(`TheirStack API error: Status ${response.status} - ${errorText || response.statusText}`);
    }

    const data = await response.json();
    
    // Format the response to match our frontend expectations
    const formattedJobs = data.jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company_name,
      location: job.location,
      type: job.job_type || (job.remote ? 'Remote' : 'On-site'),
      salary: job.salary_range || 'Not specified',
      postedDate: job.posted_at ? formatPostedDate(job.posted_at) : 'Recently',
      description: job.description,
      category: job.category || 'General',
      url: job.apply_url,
      remote: !!job.remote,
    }));
    
    console.log(`Successfully fetched ${formattedJobs.length} jobs from TheirStack API`);
    
    return new Response(JSON.stringify({
      jobs: formattedJobs,
      total: data.total || formattedJobs.length,
      page: data.page || page,
      total_pages: data.total_pages || 1,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    
    // Return mock data for testing or when API fails
    return new Response(
      JSON.stringify({ 
        jobs: featuredJobs,
        total: featuredJobs.length,
        page: 1,
        total_pages: 1,
      }),
      { 
        status: 200, // Return 200 with mock data
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to format posted date
function formatPostedDate(dateString) {
  try {
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch (e) {
    return 'Recently';
  }
}

// Mock data for testing when API fails
const featuredJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Saudi Tech Solutions",
    location: "Riyadh, Saudi Arabia",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    postedDate: "2 days ago",
    description: "Join our innovative team to build next-generation web applications using React and TypeScript in the heart of Riyadh.",
    category: "Engineering"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Creative Saudi Design",
    location: "Jeddah, Saudi Arabia",
    type: "Contract",
    salary: "$85,000 - $110,000",
    postedDate: "1 day ago",
    description: "Design intuitive user experiences for our client's digital products across various industries in Saudi Arabia.",
    category: "Design"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Saudi Analytics Insights",
    location: "Dammam, Saudi Arabia",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    postedDate: "3 days ago",
    description: "Apply machine learning and statistical models to extract valuable insights from complex datasets for our Saudi clients.",
    category: "Data"
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Saudi Innovation Tech",
    location: "Riyadh, Saudi Arabia",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    postedDate: "1 day ago",
    description: "Lead product development from conception to launch in the growing Saudi tech market.",
    category: "Product"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Saudi Cloud Systems",
    location: "Jeddah, Saudi Arabia",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    postedDate: "2 days ago",
    description: "Design and implement CI/CD pipelines and manage cloud infrastructure for Saudi's leading tech companies.",
    category: "Engineering"
  },
  {
    id: 6,
    title: "Marketing Specialist",
    company: "Saudi Growth Marketing",
    location: "Riyadh, Saudi Arabia",
    type: "Part-time",
    salary: "$60,000 - $75,000",
    postedDate: "3 days ago",
    description: "Develop and execute marketing campaigns across digital channels for Saudi businesses.",
    category: "Marketing"
  }
];
