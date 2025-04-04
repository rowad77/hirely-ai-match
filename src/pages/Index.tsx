
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play, Building, MapPin, Clock, DollarSign, Upload, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { featuredJobs } from '@/data/jobs';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

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
      <section className="bg-gradient-to-br from-hirely-light via-white to-hirely-lightgray py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-hirely/5 blur-3xl"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight animate-fade-in-up">
              Find your dream job with
              <span className="text-hirely block bg-clip-text bg-gradient-to-r from-hirely to-hirely-dark"> AI-powered matching</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Upload your CV once and get matched with the perfect positions. Let our AI do the hard work.
            </p>
            <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/jobs">
                <Button className="bg-hirely hover:bg-hirely-dark px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Browse All Jobs
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CV Upload Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 -z-10"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-hirely" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Upload Your CV</h2>
            <p className="mt-4 text-lg text-gray-600">
              Let our AI analyze your skills and match you with the perfect job
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className={cn(
                "border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300",
                file ? "border-hirely/50 bg-blue-50/50" : "border-gray-200 hover:border-hirely/30 hover:bg-blue-50/30"
              )}>
                <div className="flex justify-center">
                  <Upload className={cn(
                    "h-12 w-12 transition-all duration-300",
                    file ? "text-hirely" : "text-gray-400"
                  )} />
                </div>
                <div className="mt-4">
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <span className={cn(
                      "mt-2 block text-sm font-medium transition-colors duration-300",
                      file ? "text-hirely" : "text-gray-700"
                    )}>
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
                  className="bg-hirely hover:bg-hirely-dark px-8 py-2 w-full md:w-auto rounded-full shadow-md hover:shadow-lg transition-all duration-300"
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
      <section className="py-20 bg-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-hirely" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Job Opportunities</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our curated selection of top positions from leading companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepageJobs.map((job, index) => (
              <Card 
                key={job.id} 
                className="hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl overflow-hidden hover:-translate-y-1 animate-fade-in-up" 
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-hirely mb-3">
                      <Building className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-hirely bg-blue-50 py-1 px-3 rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center text-gray-500 mt-2">
                    <span>{job.company}</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-col gap-2 text-gray-500 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{job.postedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{job.salary}</span>
                    </div>
                    <p className="mt-4 text-gray-600 line-clamp-3">{job.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/job/${job.id}`} className="w-full">
                    <Button className="w-full bg-white text-hirely hover:bg-hirely hover:text-white border border-hirely rounded-full transition-all duration-300">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center animate-fade-in-up">
            <Link to="/jobs">
              <Button variant="outline" className="px-8 py-2 rounded-full border-hirely text-hirely hover:bg-hirely hover:text-white transition-all duration-300 group">
                View All Jobs
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-50/80 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-5 md:grid-cols-4 md:gap-8">
            <div className="p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-hirely to-hirely-dark bg-clip-text text-transparent">85%</div>
              <p className="text-gray-600 mt-2">Faster job matching</p>
            </div>
            <div className="p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-hirely to-hirely-dark bg-clip-text text-transparent">3x</div>
              <p className="text-gray-600 mt-2">More interviews</p>
            </div>
            <div className="p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-hirely to-hirely-dark bg-clip-text text-transparent">98%</div>
              <p className="text-gray-600 mt-2">Candidate satisfaction</p>
            </div>
            <div className="p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-hirely to-hirely-dark bg-clip-text text-transparent">60%</div>
              <p className="text-gray-600 mt-2">Lower time-to-hire</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hirely to-hirely-dark -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDEiLz48cGF0aCBkPSJNMCAzNUwxNDQwIDUwMFYwSDAiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PHBhdGggZD0iTTAgMTM1TDE0NDAgNTAwVjBIMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48cGF0aCBkPSJNMCAyMzVMMTQ0MCA1MDBWMEgwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] bg-cover bg-bottom opacity-10 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white animate-fade-in-up">Ready to find your next opportunity?</h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto text-white/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Upload your CV once and let our AI match you with the perfect job
          </p>
          <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup">
              <Button className="bg-white text-hirely hover:bg-gray-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                Create your profile
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
