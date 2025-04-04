
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play, Building, MapPin, Clock, DollarSign, Upload } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { featuredJobs } from '@/data/jobs';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Get only 6 job listings for the homepage
  const homepageJobs = featuredJobs.slice(0, 6);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload - in a real app, this would connect to a backend
    setTimeout(() => {
      setUploading(false);
      setFile(null);
      toast({
        title: "CV Uploaded Successfully",
        description: "We'll match you with suitable positions soon.",
        duration: 5000,
      });
    }, 1500);
  };
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-hirely-light via-white to-hirely-lightgray py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Find your dream job with
              <span className="text-hirely block"> AI-powered matching</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
              Upload your CV once and get matched with the perfect positions. Let our AI do the hard work.
            </p>
            <div className="mt-10">
              <Link to="/jobs">
                <Button className="bg-hirely hover:bg-hirely-dark px-8 py-6 text-lg">
                  Browse All Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CV Upload Section */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upload Your CV</h2>
            <p className="mt-4 text-lg text-gray-600">
              Let our AI analyze your skills and match you with the perfect job
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-hirely opacity-75" />
                </div>
                <div className="mt-4">
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </span>
                    <input
                      id="cv-upload"
                      name="cv"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX up to 5MB</p>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  className="bg-hirely hover:bg-hirely-dark px-8 py-2 w-full md:w-auto"
                  disabled={!file || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload CV'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Latest Job Opportunities</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our curated selection of top positions from leading companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepageJobs.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center text-gray-500 mt-2">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{job.company}</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-col gap-2 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{job.type} • {job.postedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>{job.salary}</span>
                    </div>
                    <p className="mt-4 text-gray-600 line-clamp-3">{job.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/job/${job.id}`} className="w-full">
                    <Button className="w-full bg-hirely hover:bg-hirely-dark">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link to="/jobs">
              <Button variant="outline" className="px-8 py-2">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-hirely">85%</p>
              <p className="text-gray-600 mt-2">Faster job matching</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-hirely">3x</p>
              <p className="text-gray-600 mt-2">More interviews</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-hirely">98%</p>
              <p className="text-gray-600 mt-2">Candidate satisfaction</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-hirely">60%</p>
              <p className="text-gray-600 mt-2">Lower time-to-hire</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-hirely text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to find your next opportunity?</h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            Upload your CV once and let our AI match you with the perfect job
          </p>
          <div className="mt-10">
            <Link to="/signup">
              <Button className="bg-white text-hirely hover:bg-gray-100 px-8 py-6 text-lg">
                Create your profile
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
