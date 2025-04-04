
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, MapPin, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { featuredJobs } from '@/data/jobs';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching job data
    const jobId = parseInt(id as string);
    const foundJob = featuredJobs.find(j => j.id === jobId);
    
    setTimeout(() => {
      setJob(foundJob);
      setLoading(false);
    }, 500);
  }, [id]);

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
            <Link to="/" className="text-hirely hover:underline flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/" className="text-hirely hover:underline flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all jobs
          </Link>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{job.title}</CardTitle>
                <div className="flex items-center text-gray-500 mt-2">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{job.company}</span>
                </div>
              </div>
              <div className="bg-hirely-light px-3 py-1 rounded-full text-sm font-medium text-hirely-dark">
                {job.type}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm font-medium">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Posted</p>
                  <p className="text-sm font-medium">{job.postedDate}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Salary</p>
                  <p className="text-sm font-medium">{job.salary}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Job Description</h3>
              <p className="text-gray-700">{job.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Design, develop and maintain high-quality software</li>
                <li>Collaborate with cross-functional teams to define requirements</li>
                <li>Write clean, efficient, and well-documented code</li>
                <li>Troubleshoot and fix bugs in existing applications</li>
                <li>Stay up-to-date with emerging trends and technologies</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>3+ years of experience in relevant field</li>
                <li>Strong proficiency in required technologies</li>
                <li>Excellent problem-solving and analytical skills</li>
                <li>Strong communication and teamwork abilities</li>
                <li>Bachelor's degree in Computer Science or related field</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => window.navigator.clipboard.writeText(window.location.href)}
            >
              Share Job
            </Button>
            <Link to={`/apply?jobId=${job.id}`} className="w-full sm:w-auto">
              <Button className="w-full bg-hirely hover:bg-hirely-dark">
                <Briefcase className="mr-2 h-4 w-4" />
                Apply Now
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">About {job.company}</h3>
          <p className="text-gray-700 mb-4">
            {job.company} is a leading company in its industry, committed to innovation and excellence. 
            We provide a collaborative environment where talented professionals can thrive and grow.
          </p>
          <a href="#" className="text-hirely hover:underline">
            Learn more about {job.company}
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetails;
