
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, Play, Building, MapPin, Clock, DollarSign, 
  Upload, Sparkles, ArrowRight, ChevronRight, Star, Briefcase,
  Users, Search, Award, TrendingUp, Shield, Heart
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { featuredJobs } from '@/data/jobs';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { useSavedJobs } from '@/hooks/use-saved-jobs';

const Index = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'tech' | 'marketing' | 'design'>('all');
  const { toggleSavedJob, isSaved } = useSavedJobs();
  
  // Get only 6 job listings for the homepage
  const allJobs = featuredJobs.slice(0, 6);
  
  // Filter jobs based on active tab
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
      <section className="relative bg-gradient-to-br from-hirely-light via-white to-hirely-lightgray py-20 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-64 -left-24 w-96 h-96 bg-hirely rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-blue-100 text-blue-800 mb-6 animate-fade-in-up">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              AI-Powered Job Matching
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight animate-fade-in-up">
              Your Dream Career
              <span className="text-hirely block bg-clip-text bg-gradient-to-r from-hirely to-hirely-dark"> Just One Click Away</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Upload your CV once and get matched with the perfect positions. Our AI analyzes your skills and experience to find your ideal job.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/jobs">
                <Button className="bg-hirely hover:bg-hirely-dark px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto">
                  Browse All Jobs
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="px-8 py-6 text-lg rounded-full border-2 border-hirely text-hirely hover:bg-hirely-light/20 transition-all duration-300 w-full sm:w-auto">
                  Create Your Profile
                </Button>
              </Link>
            </div>
            
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="text-2xl font-bold text-hirely-dark">10,000+</div>
                <div className="text-gray-600 text-sm">Active Jobs</div>
              </div>
              <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="text-2xl font-bold text-hirely-dark">85%</div>
                <div className="text-gray-600 text-sm">Placement Rate</div>
              </div>
              <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="text-2xl font-bold text-hirely-dark">2,500+</div>
                <div className="text-gray-600 text-sm">Companies</div>
              </div>
              <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="text-2xl font-bold text-hirely-dark">95%</div>
                <div className="text-gray-600 text-sm">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CV Upload Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
                <Sparkles className="h-5 w-5 text-hirely" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Let AI Find Your Perfect Match</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our advanced AI algorithm analyzes your resume to match you with positions that align with your skills, experience, and career goals.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-hirely">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Personalized Matching</h3>
                    <p className="mt-1 text-sm text-gray-500">Get job recommendations tailored specifically to your profile</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-hirely">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Save Time</h3>
                    <p className="mt-1 text-sm text-gray-500">No more scrolling through countless irrelevant listings</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-hirely">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Higher Success Rate</h3>
                    <p className="mt-1 text-sm text-gray-500">85% of our candidates receive interview offers within 14 days</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Upload Your CV</h3>
                  <p className="text-gray-600 mt-2">Get matched with your ideal opportunities</p>
                </div>
                
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
                  
                  <div>
                    <Button 
                      type="submit" 
                      className={cn(
                        "bg-hirely hover:bg-hirely-dark w-full py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-medium",
                        file ? "opacity-100" : "opacity-70"
                      )}
                      disabled={!file || uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload CV & Find Matches'}
                    </Button>
                    
                    <p className="text-center text-xs text-gray-500 mt-4">
                      By uploading, you agree to our <Link to="/terms" className="text-hirely hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-hirely hover:underline">Privacy Policy</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Jobs Section */}
      <section className="py-20 bg-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
              <Briefcase className="h-5 w-5 text-hirely" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Explore Latest Opportunities</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Discover your next career move with top companies looking for talent like yours
            </p>
            
            {/* Category tabs */}
            <div className="flex flex-wrap justify-center mt-8 mb-10 gap-2">
              <Button 
                variant={activeTab === 'all' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('all')}
                className={cn(
                  "rounded-full",
                  activeTab === 'all' ? "bg-hirely hover:bg-hirely-dark" : "hover:text-hirely"
                )}
              >
                All Categories
              </Button>
              <Button 
                variant={activeTab === 'tech' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('tech')}
                className={cn(
                  "rounded-full",
                  activeTab === 'tech' ? "bg-hirely hover:bg-hirely-dark" : "hover:text-hirely"
                )}
              >
                Technology
              </Button>
              <Button 
                variant={activeTab === 'marketing' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('marketing')}
                className={cn(
                  "rounded-full",
                  activeTab === 'marketing' ? "bg-hirely hover:bg-hirely-dark" : "hover:text-hirely"
                )}
              >
                Marketing
              </Button>
              <Button 
                variant={activeTab === 'design' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('design')}
                className={cn(
                  "rounded-full",
                  activeTab === 'design' ? "bg-hirely hover:bg-hirely-dark" : "hover:text-hirely"
                )}
              >
                Design
              </Button>
            </div>
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
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-hirely mb-3">
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
                      <Badge variant="outline" className="text-xs py-0 px-2 rounded-full bg-blue-50 text-blue-700 border-blue-100">
                        {job.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs py-0 px-2 rounded-full bg-green-50 text-green-700 border-green-100">
                        {job.category}
                      </Badge>
                    </div>
                    
                    <p className="mt-3 text-gray-600 line-clamp-3">{job.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/job/${job.id}`} className="w-full">
                    <Button className="w-full bg-white text-hirely hover:bg-hirely hover:text-white border border-hirely rounded-full transition-all duration-300 group">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
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
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
              <Play className="h-5 w-5 text-hirely" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">How Hirely Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform makes finding your next job simple and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-hirely mb-4">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Upload Your CV</h3>
              <p className="text-gray-600">Upload your resume or complete your profile for our AI to analyze your qualifications.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-hirely mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Get Matched</h3>
              <p className="text-gray-600">Our AI algorithm matches you with positions that fit your skills and experience.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-hirely mb-4">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Apply with One Click</h3>
              <p className="text-gray-600">Apply to matched positions instantly, with your profile automatically submitted.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Grid Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
              <Star className="h-5 w-5 text-hirely" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Hirely</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform offers unique advantages that help you find your dream job faster
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in-up">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-hirely mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI-Powered Matching</h3>
              <p className="text-gray-600">Our advanced algorithms match you with positions that truly fit your profile.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-hirely mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Verified Employers</h3>
              <p className="text-gray-600">All companies on our platform are verified to ensure legitimate opportunities.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-hirely mb-4">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Smart Job Search</h3>
              <p className="text-gray-600">Advanced filters help you find exactly what you're looking for in seconds.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-hirely mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Premium Opportunities</h3>
              <p className="text-gray-600">Access exclusive job listings not available on other platforms.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-hirely mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Career Growth Tools</h3>
              <p className="text-gray-600">Get insights on skill development to advance your career trajectory.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-hirely mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Privacy Protected</h3>
              <p className="text-gray-600">Your data is secure, and you control who sees your profile information.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hirely to-hirely-dark -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDEiLz48cGF0aCBkPSJNMCAzNUwxNDQwIDUwMFYwSDAiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PHBhdGggZD0iTTAgMTM1TDE0NDAgNTAwVjBIMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48cGF0aCBkPSJNMCAyMzVMMTQ0MCA1MDBWMEgwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] bg-cover bg-bottom opacity-10 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white animate-fade-in-up">Ready to accelerate your job search?</h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto text-white/90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join thousands of professionals who found their dream jobs through Hirely
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup">
              <Button className="bg-white text-hirely hover:bg-gray-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto">
                Create your profile
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full transition-all duration-300 w-full sm:w-auto">
                Browse jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
