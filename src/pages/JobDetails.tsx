
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  CheckCircle, 
  Globe,
  Users
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { featuredJobs } from '@/data/jobs';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Simulate fetching job data
    const jobId = parseInt(id as string);
    const foundJob = featuredJobs.find(j => j.id === jobId);
    
    setTimeout(() => {
      setJob(foundJob);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSaveJob = () => {
    setSaved(!saved);
    toast.success(saved ? 'Job removed from saved jobs' : 'Job saved to your profile');
  };

  const handleShareJob = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Job link copied to clipboard');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-24 bg-gray-200 rounded mb-6"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-red-600">Job not found</h1>
          <p className="mt-2 text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
          <div className="mt-6">
            <Link to="/jobs" className="text-hirely hover:underline flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to job listings
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/jobs" className="text-hirely hover:underline flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to job listings
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-between items-start mb-6">
          <div>
            <Badge className="bg-hirely-light text-hirely-dark mb-2">{job.type}</Badge>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center mt-2 text-gray-700">
              <Building className="h-4 w-4 mr-2" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={handleSaveJob}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${saved ? 'fill-hirely text-hirely' : ''}`} />
              {saved ? 'Saved' : 'Save Job'}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={handleShareJob}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <Tabs defaultValue="description">
                <CardHeader className="pb-0">
                  <TabsList className="w-full">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                    <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <TabsContent value="description" className="space-y-4">
                    <p className="text-gray-700">{job.description}</p>
                    <p className="text-gray-700">We're looking for a talented professional to join our dynamic team and contribute to our growing company's success. This role offers exciting challenges and opportunities for career advancement.</p>
                  </TabsContent>
                  
                  <TabsContent value="requirements" className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>3+ years of experience in relevant field</li>
                      <li>Strong proficiency in required technologies</li>
                      <li>Excellent problem-solving and analytical skills</li>
                      <li>Strong communication and teamwork abilities</li>
                      <li>Bachelor's degree in Computer Science or related field</li>
                      <li>Experience with agile development methodologies</li>
                      <li>Ability to work independently and as part of a team</li>
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="responsibilities" className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Design, develop and maintain high-quality software</li>
                      <li>Collaborate with cross-functional teams to define requirements</li>
                      <li>Write clean, efficient, and well-documented code</li>
                      <li>Troubleshoot and fix bugs in existing applications</li>
                      <li>Stay up-to-date with emerging trends and technologies</li>
                      <li>Participate in code reviews and mentor junior developers</li>
                      <li>Contribute to continuous improvement of development practices</li>
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="benefits" className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Benefits & Perks</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Competitive salary and performance bonuses</li>
                      <li>Comprehensive health, dental, and vision insurance</li>
                      <li>Flexible working hours and remote work options</li>
                      <li>Professional development and learning opportunities</li>
                      <li>401(k) matching program</li>
                      <li>Paid time off and company holidays</li>
                      <li>Modern office with collaboration spaces</li>
                    </ul>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Job Type</p>
                    <p className="font-medium">{job.type}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Salary</p>
                    <p className="font-medium">{job.salary}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Team Size</p>
                    <p className="font-medium">10-15 people</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Remote Work</p>
                    <p className="font-medium">Hybrid (2 days in office)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Posted</p>
                    <p className="font-medium">{job.postedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About {job.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  {job.company} is a leading company in its industry, committed to innovation and excellence. 
                  We provide a collaborative environment where talented professionals can thrive and grow.
                </p>
                <div className="mt-3">
                  <a href="#" className="text-hirely hover:underline">
                    Learn more about {job.company}
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-hirely-light rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-hirely" />
                  </div>
                  <p className="font-medium mb-2">Ready to apply for this job?</p>
                  <p className="text-sm text-gray-500 mb-4">Apply now and get noticed by the employer</p>
                  <Link to={`/apply?jobId=${job.id}`} className="w-full">
                    <Button className="w-full bg-hirely hover:bg-hirely-dark">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-6">Similar Jobs You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs
              .filter(j => j.id !== job.id && j.category === job.category)
              .slice(0, 3)
              .map(similarJob => (
                <Card key={similarJob.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{similarJob.title}</CardTitle>
                    <div className="flex items-center text-gray-500 mt-1 text-sm">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{similarJob.company}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-col gap-1 text-gray-500 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{similarJob.location}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{similarJob.salary}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/job/${similarJob.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Job
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetails;
