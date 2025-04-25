
import { supabase } from "@/integrations/supabase/client";

export interface JobFilter {
  jobTypes?: string[];
  locations?: string[];
  salaryRanges?: string[];
  categories?: string[];
  remote?: boolean;
  search?: string;
  [key: string]: any;
}

export interface JobResponse {
  jobs: any[];
  total: number;
  page: number;
  total_pages: number;
  source: 'api' | 'fallback';
  error?: string;
}

export async function fetchJobs(page = 1, filters: JobFilter = {}): Promise<any[]> {
  try {
    console.log('Fetching jobs with filters:', filters);
    
    // Prepare filter parameters for the API
    const apiFilters: Record<string, any> = {};
    
    // Map frontend filters to API-compatible format
    if (filters.locations?.length) {
      apiFilters.location = filters.locations.join(','); // Support multiple locations
    }
    
    if (filters.jobTypes?.includes('Remote')) {
      apiFilters.remote = true;
    }
    
    if (filters.search) {
      apiFilters.search = filters.search;
    }
    
    if (filters.categories?.length) {
      apiFilters.category = filters.categories.join(','); // Support multiple categories
    }
    
    // Call the Supabase edge function with a timeout
    const { data, error } = await supabase.functions.invoke('fetch-jobs', {
      body: { 
        page, 
        filters: {
          ...apiFilters,
          ...filters // Include original filters as well
        }
      }
    });

    if (error) {
      console.error('Error from Supabase function:', error);
      throw error;
    }
    
    console.log(`Received response from API:`, data);
    
    if (data?.source === 'fallback') {
      console.warn('Using fallback data due to API issue:', data?.error);
    }
    
    return data?.jobs || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Fallback to mock data in case of error
    return featuredJobs;
  }
}

// Mock data as fallback
export const featuredJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    postedDate: "2 days ago",
    description: "Join our innovative team to build next-generation web applications using React and TypeScript. You'll be responsible for developing user interfaces that are both beautiful and functional, maintaining existing codebases, and collaborating with designers and backend engineers.",
    category: "Engineering"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Creative Design Studio",
    location: "Remote",
    type: "Contract",
    salary: "$85,000 - $110,000",
    postedDate: "1 week ago",
    description: "Design intuitive user experiences for our client's digital products across various industries. You'll create wireframes, prototypes, and final designs while working closely with development teams to ensure proper implementation.",
    category: "Design"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Analytics Insights",
    location: "New York, NY",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    postedDate: "3 days ago",
    description: "Apply machine learning and statistical models to extract valuable insights from complex datasets. You'll be working with large datasets, developing predictive models, and communicating findings to stakeholders.",
    category: "Data"
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Innovate Technologies",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    postedDate: "1 day ago",
    description: "Lead product development from conception to launch, working with cross-functional teams to define requirements, create roadmaps, and deliver outstanding user experiences.",
    category: "Product"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Cloud Systems Inc.",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    postedDate: "5 days ago",
    description: "Design and implement CI/CD pipelines, manage cloud infrastructure, and ensure system reliability and performance across multiple environments.",
    category: "Engineering"
  },
  {
    id: 6,
    title: "Marketing Specialist",
    company: "Growth Marketing Agency",
    location: "Remote",
    type: "Part-time",
    salary: "$60,000 - $75,000",
    postedDate: "1 week ago",
    description: "Develop and execute marketing campaigns across digital channels to drive growth for our B2B and B2C clients.",
    category: "Marketing"
  },
  {
    id: 7,
    title: "Backend Developer",
    company: "Tech Innovators",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    postedDate: "3 days ago",
    description: "Build robust, scalable backend services and APIs for our growing platform. Experience with Node.js, Python, or Java required.",
    category: "Engineering"
  },
  {
    id: 8,
    title: "Content Strategist",
    company: "Media Solutions",
    location: "Remote",
    type: "Contract",
    salary: "$70,000 - $90,000",
    postedDate: "2 weeks ago",
    description: "Develop compelling content strategies for digital platforms. You'll create editorial calendars, style guides, and oversee content production.",
    category: "Marketing"
  },
  {
    id: 9,
    title: "Data Engineer",
    company: "Data Systems Co.",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130,000 - $170,000",
    postedDate: "4 days ago",
    description: "Design and maintain data pipelines and infrastructure. Experience with big data technologies and cloud platforms required.",
    category: "Data"
  },
  {
    id: 10,
    title: "Mobile App Developer",
    company: "App Creators Studio",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    postedDate: "1 week ago",
    description: "Build native mobile applications for iOS and Android platforms. Strong experience with Swift, Kotlin, or React Native required.",
    category: "Engineering"
  },
  {
    id: 11,
    title: "Product Designer",
    company: "Design Forward",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    postedDate: "2 days ago",
    description: "Create user-centered designs for digital products. You'll conduct user research, create wireframes and prototypes, and collaborate with developers.",
    category: "Design"
  },
  {
    id: 12,
    title: "Growth Hacker",
    company: "Scale Up Fast",
    location: "Remote",
    type: "Part-time",
    salary: "$65,000 - $85,000",
    postedDate: "5 days ago",
    description: "Implement and test growth strategies to acquire and retain users. Experience with analytics, A/B testing, and digital marketing required.",
    category: "Marketing"
  }
];
