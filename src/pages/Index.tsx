import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, Play, Building, MapPin, Clock, DollarSign, 
  Upload, Sparkles, ArrowRight, ChevronRight, Star, Briefcase,
  Users, Search, Award, TrendingUp, Shield, Heart, FileText, 
  BriefcaseIcon, GraduationCap, UserCheck, Zap
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleBadge } from '@/components/ui/SimpleBadge';
import { featuredJobs } from '@/data/jobs';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { useSavedJobs } from '@/hooks/use-saved-jobs';

const Index = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'tech' | 'marketing' | 'design'>('all');
  const { toggleSavedJob, isSaved } = useSavedJobs();
  
  const allJobs = featuredJobs.slice(0, 6);
  
  const homepageJobs = activeTab === 'all' 
    ? allJobs 
    : allJobs.filter(job => {
        if (activeTab === 'tech') return job.category === 'Technology';
        if (activeTab === 'marketing') return job.category === 'Marketing';
        if (activeTab === 'design') return job.category === 'Design';
        return true;
      });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError('File size should not exceed 5MB');
        return;
      }
      
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadError('Only PDF, DOC, DOCX, or TXT files are allowed');
        return;
      }
      
      setFile(selectedFile);
      setUploadError(null);
    }
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setUploading(true);
    setUploadError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "CV Uploaded Successfully",
        description: "We'll match you with suitable positions soon.",
        duration: 5000,
      });
      
      setFile(null);
    } catch (error) {
      setUploadError('Failed to upload CV. Please try again.');
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your CV.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <MainLayout fullWidth>
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-800 py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute right-0 top-0 w-full h-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path fill="white" d="M0,0 L100,0 L100,25 C75,50 75,80 100,100 L0,100 Z"></path>
            </svg>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-10 mb-10 md:mb-0">
              <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 mb-6 animate-fade-in-up">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                AI-Powered Job Matching
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight animate-fade-in-up">
                Find Your Dream Career <span className="text-indigo-200">in Minutes</span>
              </h1>
              <p className="mt-6 text-xl text-indigo-100 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Upload your CV once and let our AI match you with perfect positions tailored to your skills and experience.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Link to="/jobs">
                  <Button className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto">
                    Browse Jobs
                    <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="px-8 py-6 text-lg rounded-full border-2 border-white text-white hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="md:w-5/12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Upload Your CV</h3>
                  <p className="text-gray-500 text-sm">Get matched with relevant jobs instantly</p>
                </div>
                <form onSubmit={handleUpload} className="p-6">
                  <div className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
                    file ? "border-indigo-300 bg-indigo-50/50" : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30"
                  )}>
                    <div className="flex justify-center">
                      <FileText className={cn(
                        "h-10 w-10 transition-all duration-300",
                        file ? "text-indigo-500" : "text-gray-400"
                      )} />
                    </div>
                    <div className="mt-3">
                      <label htmlFor="cv-upload" className="cursor-pointer block">
                        <span className={cn(
                          "block text-sm font-medium transition-colors duration-300",
                          file ? "text-indigo-600" : "text-gray-700"
                        )}>
                          {file ? file.name : 'Click to upload or drag and drop'}
                        </span>
                        <input
                          id="cv-upload"
                          name="cv"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, or TXT (max 5MB)</p>
                      </label>
                    </div>
                  </div>
                  
                  {uploadError && (
                    <p className="text-red-500 text-sm text-center mt-3">{uploadError}</p>
                  )}
                  
                  <Button 
                    type="submit" 
                    className={cn(
                      "bg-indigo-600 hover:bg-indigo-700 w-full py-3 mt-4 rounded-lg shadow transition-all duration-300 font-medium",
                      file ? "opacity-100" : "opacity-70"
                    )}
                    disabled={!file || uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload CV & Find Matches'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-center max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="p-4 rounded-xl bg-indigo-800/40 backdrop-blur-sm border border-indigo-500/30 hover:bg-indigo-800/50 transition-all text-white">
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-indigo-200 text-sm">Active Jobs</div>
            </div>
            <div className="p-4 rounded-xl bg-indigo-800/40 backdrop-blur-sm border border-indigo-500/30 hover:bg-indigo-800/50 transition-all text-white">
              <div className="text-2xl font-bold">85%</div>
              <div className="text-indigo-200 text-sm">Placement Rate</div>
            </div>
            <div className="p-4 rounded-xl bg-indigo-800/40 backdrop-blur-sm border border-indigo-500/30 hover:bg-indigo-800/50 transition-all text-white">
              <div className="text-2xl font-bold">2,500+</div>
              <div className="text-indigo-200 text-sm">Companies</div>
            </div>
            <div className="p-4 rounded-xl bg-indigo-800/40 backdrop-blur-sm border border-indigo-500/30 hover:bg-indigo-800/50 transition-all text-white">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-indigo-200 text-sm">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800">
              <Zap className="mr-1 h-3.5 w-3.5" />
              Simple Process
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">How Hirely Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes finding your next job simple and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative">
              <div className="absolute top-0 left-10 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">1</div>
              <div className="pt-16 px-6 pb-8 bg-gray-50 rounded-xl hover:shadow-md transition-all relative">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Upload Your CV</h3>
                <p className="text-gray-600">Upload your resume or complete your profile for our AI to analyze your qualifications and skills.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-10 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">2</div>
              <div className="pt-16 px-6 pb-8 bg-gray-50 rounded-xl hover:shadow-md transition-all relative">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Matching</h3>
                <p className="text-gray-600">Our algorithm intelligently matches you with positions that fit your experience, skills, and career goals.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-10 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">3</div>
              <div className="pt-16 px-6 pb-8 bg-gray-50 rounded-xl hover:shadow-md transition-all relative">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <BriefcaseIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Apply Instantly</h3>
                <p className="text-gray-600">Apply to matched positions with a single click, your profile is automatically submitted to employers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-5/12 mb-10 md:mb-0">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800">
                <Star className="mr-1 h-3.5 w-3.5" />
                Why Choose Hirely
              </span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Supercharge Your Job Search</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our platform offers unique advantages that help you find your dream job faster and with less hassle.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">AI-Powered Matching</h3>
                    <p className="mt-1 text-sm text-gray-500">Get job recommendations tailored specifically to your profile</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Verified Employers</h3>
                    <p className="mt-1 text-sm text-gray-500">All companies on our platform are verified to ensure legitimate opportunities</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Higher Success Rate</h3>
                    <p className="mt-1 text-sm text-gray-500">85% of our candidates receive interview offers within 14 days</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Career Growth Tools</h3>
                    <p className="mt-1 text-sm text-gray-500">Get insights on skill development to advance your career trajectory</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-6/12 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Smart Matching</h3>
                <p className="text-gray-600 text-sm">Our AI analyzes thousands of data points to find your perfect job match.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full mt-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Privacy Protected</h3>
                <p className="text-gray-600 text-sm">Your data is secure, and you control who sees your profile information.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Skill Assessment</h3>
                <p className="text-gray-600 text-sm">Get personalized recommendations to enhance your skillset.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full mt-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Career Insights</h3>
                <p className="text-gray-600 text-sm">Access market trends and salary benchmarks in your industry.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800">
              <Briefcase className="mr-1 h-3.5 w-3.5" />
              Latest Opportunities
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover your next career move with top companies looking for talent like yours
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center mt-8 mb-10 gap-2">
            <Button 
              variant={activeTab === 'all' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('all')}
              className={cn(
                "rounded-full",
                activeTab === 'all' ? "bg-indigo-600 hover:bg-indigo-700" : "hover:text-indigo-600"
              )}
            >
              All Categories
            </Button>
            <Button 
              variant={activeTab === 'tech' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('tech')}
              className={cn(
                "rounded-full",
                activeTab === 'tech' ? "bg-indigo-600 hover:bg-indigo-700" : "hover:text-indigo-600"
              )}
            >
              Technology
            </Button>
            <Button 
              variant={activeTab === 'marketing' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('marketing')}
              className={cn(
                "rounded-full",
                activeTab === 'marketing' ? "bg-indigo-600 hover:bg-indigo-700" : "hover:text-indigo-600"
              )}
            >
              Marketing
            </Button>
            <Button 
              variant={activeTab === 'design' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('design')}
              className={cn(
                "rounded-full",
                activeTab === 'design' ? "bg-indigo-600 hover:bg-indigo-700" : "hover:text-indigo-600"
              )}
            >
              Design
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homepageJobs.map((job, index) => (
              <Card 
                key={job.id} 
                className="hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-xl overflow-hidden hover:-translate-y-1 animate-fade-in-up" 
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                      <Building className="h-6 w-6" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSavedJob(job.id.toString())}
                      className="h-8 w-8 rounded-full hover:bg-gray-100"
                    >
                      <Heart className={cn(
                        "h-4 w-4 transition-colors",
                        isSaved(job.id.toString()) ? "fill-red-500 text-red-500" : "text-gray-400"
                      )} />
                    </Button>
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
                    
                    <div className="flex gap-2 mt-2">
                      <SimpleBadge variant="outline" className="text-xs py-0 px-2 rounded-full bg-indigo-50 text-indigo-700 border-indigo-100">
                        {job.type}
                      </SimpleBadge>
                      <SimpleBadge variant="outline" className="text-xs py-0 px-2 rounded-full bg-green-50 text-green-700 border-green-100">
                        {job.category}
                      </SimpleBadge>
                    </div>
                    
                    <p className="mt-3 text-gray-600 line-clamp-3">{job.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/job/${job.id}`} className="w-full">
                    <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-600 rounded-lg transition-all duration-300 group">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/jobs">
              <Button variant="outline" className="px-8 py-2 rounded-full border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 group">
                View All Jobs
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-700 -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDEiLz48cGF0aCBkPSJNMCAzNUwxNDQwIDUwMFYwSDAiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PHBhdGggZD0iTTAgMTM1TDE0NDAgNTAwVjBIMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48cGF0aCBkPSJNMCAyMzVMMTQ0MCA1MDBWMEgwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] bg-cover bg-bottom opacity-10 -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white animate-fade-in-up">Ready to accelerate your job search?</h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto text-white/90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join thousands of professionals who found their dream jobs through Hirely
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto">
                Create Your Profile
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full transition-all duration-300 w-full sm:w-auto">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
