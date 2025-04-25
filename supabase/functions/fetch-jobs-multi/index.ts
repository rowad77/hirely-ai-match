import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const theirStackApiKey = Deno.env.get('THEIRSTACK_API_KEY')!;
const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY') || '';

const THEIRSTACK_BASE_URL = 'https://api.theirstack.com/v1';
const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const JOB_BOARD_SITES = [
  'https://boards.greenhouse.io/swissre',
  'https://careers.google.com/jobs/results',
  'https://linkedin.com/jobs',
  'https://indeed.com/jobs',
  'https://angel.co/jobs'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { page = 1, filters = {}, sources = ['theirstack', 'firecrawl'] } = await req.json();
    const jobsPromises = [];
    const errors = [];
    
    if (sources.includes('theirstack') && theirStackApiKey) {
      jobsPromises.push(fetchTheirStackJobs(page, filters).catch(error => {
        console.error('TheirStack API error:', error);
        errors.push({ source: 'theirstack', error: error.message });
        return { jobs: [], total: 0, page: page, total_pages: 0 }; 
      }));
    }
    
    if (sources.includes('firecrawl') && firecrawlApiKey) {
      const targetSites = JOB_BOARD_SITES.filter(site => {
        if (filters.location) {
          const location = filters.location.toLowerCase();
          return site.includes(location);
        }
        return true;
      });

      jobsPromises.push(
        Promise.all(targetSites.map(site => 
          fetchFirecrawlJobs(site, filters)
        )).then(results => ({
          jobs: results.flatMap(result => result.jobs),
          total: results.reduce((sum, result) => sum + result.total, 0)
        })).catch(error => {
          console.error('Firecrawl API error:', error);
          errors.push({ source: 'firecrawl', error: error.message });
          return { jobs: [], total: 0 }; 
        })
      );
    }
    
    const results = await Promise.all(jobsPromises);
    
    let allJobs = results.flatMap(result => result.jobs);
    const uniqueJobs = allJobs.filter((job, index, self) =>
      index === self.findIndex((j) => 
        j.title === job.title && j.company === job.company
      )
    );
    
    if (uniqueJobs.length === 0) {
      console.log('No jobs found from APIs, using fallback data');
      return new Response(
        JSON.stringify({
          jobs: featuredJobs,
          total: featuredJobs.length,
          page: 1,
          total_pages: 1,
          source: 'fallback',
          errors: errors
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log(`Successfully fetched ${uniqueJobs.length} jobs from multiple sources`);
    
    return new Response(
      JSON.stringify({
        jobs: uniqueJobs,
        total: uniqueJobs.length,
        page: page,
        total_pages: Math.ceil(uniqueJobs.length / 6),
        source: 'api',
        errors: errors
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching jobs from multiple sources:', error);
    
    return new Response(
      JSON.stringify({
        jobs: featuredJobs,
        total: featuredJobs.length,
        page: 1,
        total_pages: 1,
        source: 'fallback',
        error: error.message
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function fetchTheirStackJobs(page: number, filters: any) {
  console.log('Fetching jobs from TheirStack API');
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(filters.location ? { location: filters.location } : {}),
    ...(filters.remote === true ? { remote: 'true' } : {}),
    ...(filters.search ? { search: filters.search } : {}),
    ...Object.fromEntries(
      Object.entries(filters).filter(([k, v]) => 
        !['location', 'remote', 'search'].includes(k) && 
        v !== undefined && v !== null && v !== ''
      )
    )
  });
  
  const requestUrl = `${THEIRSTACK_BASE_URL}/job_postings?${queryParams}`;
  console.log(`TheirStack API Request: ${requestUrl}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
  
  try {
    const response = await fetch(requestUrl, {
      headers: {
        'Authorization': `Bearer ${theirStackApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TheirStack API error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      throw new Error(`TheirStack API error: Status ${response.status} - ${errorText || response.statusText}`);
    }

    const data = await response.json();
    
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
      source: 'theirstack'
    }));
    
    console.log(`Successfully fetched ${formattedJobs.length} jobs from TheirStack API`);
    
    return {
      jobs: formattedJobs,
      total: data.total || formattedJobs.length,
      page: data.page || page,
      total_pages: data.total_pages || 1
    };
  } catch (fetchError) {
    if (fetchError.name === 'AbortError') {
      console.error('TheirStack API request timed out after 8 seconds');
      throw new Error('TheirStack API request timed out. Please try again later.');
    }
    throw fetchError;
  }
}

async function fetchFirecrawlJobs(site: string, filters: any) {
  if (!firecrawlApiKey) {
    throw new Error('Firecrawl API key not configured');
  }
  
  console.log(`Fetching jobs from Firecrawl API for site: ${site}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const crawlResponse = await fetch(`${FIRECRAWL_BASE_URL}/crawl`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: site,
        limit: 10,
        extractors: {
          job_listings: {
            selector: '.job-listing, .job-card, .job-item',
            fields: {
              title: '.job-title, h2, h3',
              company: '.company-name, .employer',
              location: '.location, .job-location',
              description: '.description, .job-description',
              salary: '.salary, .compensation',
              link: 'a@href'
            }
          }
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!crawlResponse.ok) {
      const errorText = await crawlResponse.text();
      throw new Error(`Firecrawl API error: ${crawlResponse.status} - ${errorText}`);
    }
    
    const crawlData = await crawlResponse.json();
    const jobs = crawlData.data?.job_listings?.map(job => ({
      id: `firecrawl-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: job.title,
      company: job.company || 'Unknown',
      location: job.location || 'Not specified',
      description: job.description || 'No description',
      salary: job.salary || 'Not specified',
      url: job.link,
      source: 'firecrawl'
    })).filter(job => {
      const matchesSearch = !filters.search || 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
        job.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return matchesSearch && matchesLocation;
    });
    
    return { 
      jobs, 
      total: jobs.length 
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Firecrawl API request timed out');
      throw new Error('Firecrawl API request timed out');
    }
    throw error;
  }
}

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

function determineJobType(title: string, description?: string): string {
  const titleLower = title?.toLowerCase() || '';
  const descLower = description?.toLowerCase() || '';
  
  if (titleLower.includes('part-time') || descLower.includes('part-time') || 
      titleLower.includes('part time') || descLower.includes('part time')) {
    return 'Part-time';
  }
  
  if (titleLower.includes('contract') || descLower.includes('contract') ||
      titleLower.includes('freelance') || descLower.includes('freelance')) {
    return 'Contract';
  }
  
  if (titleLower.includes('intern') || descLower.includes('intern') ||
      titleLower.includes('internship') || descLower.includes('internship')) {
    return 'Internship';
  }
  
  return 'Full-time';
}

function determineJobCategory(title: string, description?: string): string {
  const titleLower = title?.toLowerCase() || '';
  const descLower = description?.toLowerCase() || '';
  
  if (titleLower.includes('engineer') || titleLower.includes('developer') || 
      descLower.includes('programming') || titleLower.includes('code')) {
    return 'Engineering';
  }
  
  if (titleLower.includes('design') || titleLower.includes('ui') || 
      titleLower.includes('ux') || descLower.includes('photoshop')) {
    return 'Design';
  }
  
  if (titleLower.includes('marketing') || descLower.includes('seo') || 
      descLower.includes('advertising')) {
    return 'Marketing';
  }
  
  if (titleLower.includes('sales') || descLower.includes('account executive') || 
      descLower.includes('business development')) {
    return 'Sales';
  }
  
  if (titleLower.includes('product') || descLower.includes('product manager')) {
    return 'Product';
  }
  
  if (titleLower.includes('data') || titleLower.includes('analyst') || 
      descLower.includes('statistics')) {
    return 'Data';
  }
  
  return 'General';
}

function isRemoteJob(title: string, description?: string, location?: string): boolean {
  const titleLower = title?.toLowerCase() || '';
  const descLower = description?.toLowerCase() || '';
  const locationLower = location?.toLowerCase() || '';
  
  return titleLower.includes('remote') || 
         descLower.includes('remote') || 
         locationLower.includes('remote') ||
         locationLower === 'anywhere';
}

const featuredJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Saudi Tech Solutions",
    location: "Riyadh, Saudi Arabia",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    postedDate: "2 days ago",
    description: "Join our innovative team to build next-generation web applications using React and TypeScript in the heart of Riyadh.",
    category: "Engineering",
    remote: false,
    source: "fallback"
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Creative Saudi Design",
    location: "Jeddah, Saudi Arabia",
    type: "Contract",
    salary: "$85,000 - $110,000",
    postedDate: "1 day ago",
    description: "Design intuitive user experiences for our client's digital products across various industries in Saudi Arabia.",
    category: "Design",
    remote: false,
    source: "fallback"
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Saudi Analytics Insights",
    location: "Dammam, Saudi Arabia",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    postedDate: "3 days ago",
    description: "Apply machine learning and statistical models to extract valuable insights from complex datasets for our Saudi clients.",
    category: "Data",
    remote: false,
    source: "fallback"
  },
  {
    id: "4",
    title: "Product Manager",
    company: "Saudi Innovation Tech",
    location: "Riyadh, Saudi Arabia",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    postedDate: "1 day ago",
    description: "Lead product development from conception to launch in the growing Saudi tech market.",
    category: "Product",
    remote: false,
    source: "fallback"
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "Saudi Cloud Systems",
    location: "Jeddah, Saudi Arabia",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    postedDate: "2 days ago",
    description: "Design and implement CI/CD pipelines and manage cloud infrastructure for Saudi's leading tech companies.",
    category: "Engineering",
    remote: false,
    source: "fallback"
  },
  {
    id: "6",
    title: "Marketing Specialist",
    company: "Saudi Growth Marketing",
    location: "Riyadh, Saudi Arabia",
    type: "Part-time",
    salary: "$60,000 - $75,000",
    postedDate: "3 days ago",
    description: "Develop and execute marketing campaigns across digital channels for Saudi businesses.",
    category: "Marketing",
    remote: false,
    source: "fallback"
  }
];
