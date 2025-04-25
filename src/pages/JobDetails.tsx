import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  BookOpen, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Calendar, 
  User,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from '../components/layout/MainLayout';
import SimilarJobs from '@/components/jobs/SimilarJobs';
import CompanyRatings from '@/components/company/CompanyRatings';
import { ErrorDisplay } from '@/components/ui/error-display';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteJobs');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(favorites.includes(id));
      } catch (e) {
        console.error('Failed to parse favorite jobs', e);
      }
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(prev => {
      const newFavorite = !prev;
      let favorites: string[] = [];
      
      // Load existing favorites
      const savedFavorites = localStorage.getItem('favoriteJobs');
      if (savedFavorites) {
        try {
          favorites = JSON.parse(savedFavorites);
        } catch (e) {
          console.error('Failed to parse favorite jobs', e);
        }
      }
      
      if (newFavorite) {
        favorites.push(id);
      } else {
        favorites = favorites.filter(jobId => jobId !== id);
      }
      
      localStorage.setItem('favoriteJobs', JSON.stringify(favorites));
      
      // Show appropriate toast message
      toast({
        title: newFavorite ? "Job saved" : "Job removed",
        description: newFavorite ? "Job added to your saved list" : "Job removed from your saved list",
        duration: 2000
      });
      
      return newFavorite;
    });
  };

  const { data: job, isLoading, isError, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/${id}`);
      if (!response.ok) {
        const message = `Could not fetch job (status: ${response.status})`;
        console.error(message);
        throw new Error(message);
      }
      return response.json();
    },
    meta: {
      errorMessage: 'Failed to fetch job details'
    }
  });

  useEffect(() => {
    if (job) {
      // Load viewed jobs from localStorage
      let viewedJobs: string[] = [];
      const savedViewedJobs = localStorage.getItem('viewedJobs');
      if (savedViewedJobs) {
        try {
          viewedJobs = JSON.parse(savedViewedJobs);
        } catch (e) {
          console.error('Failed to parse viewed jobs', e);
        }
      }
      
      // Add current job to viewed jobs if not already there
      if (!viewedJobs.includes(job.id)) {
        viewedJobs.push(job.id);
        localStorage.setItem('viewedJobs', JSON.stringify(viewedJobs));
      }
    }
  }, [job]);

  const applyNow = () => {
    setShowApplyModal(true);
  };

  const submitApplication = () => {
    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully",
    });
    setShowApplyModal(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleSharePlatform = (platform: string) => {
    let shareURL = '';
    const currentURL = window.location.href;
    
    if (platform === 'linkedin') {
      shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentURL)}`;
    } else if (platform === 'twitter') {
      shareURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentURL)}&text=${encodeURIComponent(job?.title || '')}`;
    } else if (platform === 'facebook') {
      shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}`;
    }
  
    if (shareURL) {
      window.open(shareURL, '_blank');
    }
  };

  const handleSaveJob = () => {
    toast({
      title: "Feature not available",
      description: "Saving jobs is not yet implemented",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/jobs" 
            className="text-hirely hover:text-hirely-dark flex items-center mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 mx-auto text-hirely mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading job details...</p>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </div>
          </div>
        ) : isError ? (
          <ErrorDisplay
            title="Error loading job details"
            description="We couldn't load this job posting. It might have been removed or is temporarily unavailable."
            error={error instanceof Error ? error : "Unknown error occurred"}
            retryAction={() => navigate('/jobs')}
            className="max-w-3xl mx-auto mb-8"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <button
                    className="rounded-full p-2 hover:bg-gray-100"
                    onClick={toggleFavorite}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="text-hirely font-medium">{job.salary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="bg-gray-50">{job.category}</Badge>
                  <Badge variant="outline" className="bg-hirely-light text-hirely border-hirely">{job.type}</Badge>
                  {job.remote && <Badge>Remote</Badge>}
                </div>

                <div className="flex items-center mt-6 gap-4">
                  <Button className="bg-hirely hover:bg-hirely-dark" onClick={applyNow}>
                    Apply Now
                  </Button>
                  <Button variant="outline" className="flex items-center" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={handleSaveJob}>
                    Save for Later
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: job.description }} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {job.requirements?.map((req: string, index: number) => (
                      <li key={index}>{req}</li>
                    )) || (
                      <>
                        <li>Bachelor's degree in Computer Science or related field</li>
                        <li>3+ years of experience in frontend development</li>
                        <li>Strong proficiency in JavaScript, HTML, and CSS</li>
                        <li>Experience with React and modern frameworks</li>
                        <li>Excellent communication skills and ability to work in a team</li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Application Process
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-hirely rounded-full h-8 w-8 flex items-center justify-center text-white font-medium shrink-0">1</div>
                      <div className="ml-4">
                        <h4 className="font-medium">Submit Application</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Fill out the application form and upload your resume
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-hirely rounded-full h-8 w-8 flex items-center justify-center text-white font-medium shrink-0">2</div>
                      <div className="ml-4">
                        <h4 className="font-medium">Initial Screening</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Our recruiting team will review your application and reach out if there's a fit
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-hirely rounded-full h-8 w-8 flex items-center justify-center text-white font-medium shrink-0">3</div>
                      <div className="ml-4">
                        <h4 className="font-medium">Interview Process</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Participate in interviews with the team to assess skills and cultural fit
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-hirely rounded-full h-8 w-8 flex items-center justify-center text-white font-medium shrink-0">4</div>
                      <div className="ml-4">
                        <h4 className="font-medium">Job Offer</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Successful candidates will receive an offer to join our team
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company ratings section added here */}
              <CompanyRatings 
                companyId={job.companyId}
                companyName={job.company}
              />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Posted</div>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{job.postedDate}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Employment Type</div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Salary</div>
                      <div className="flex items-center mt-1">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500">Share this job</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full" 
                        onClick={() => handleSharePlatform('linkedin')}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h-.003z" />
                        </svg>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full" 
                        onClick={() => handleSharePlatform('twitter')}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full" 
                        onClick={() => handleSharePlatform('facebook')}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full" 
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Similar Jobs Component */}
              <SimilarJobs 
                currentJobId={job.id} 
                currentJobTitle={job.title}
                currentJobCategory={job.category}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>About {job.company}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {job.companyDescription || `${job.company} is a leading company in the ${job.category} industry, known for innovation and excellent work environment.`}
                  </p>
                  <Link to={`/company/${job.companyId || 'sample'}`}>
                    <Button variant="outline" className="w-full">View Company Profile</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Application Deadline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-lg font-medium text-hirely">
                      {job.deadline || 'Open until filled'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Apply soon to increase your chances
                    </p>
                    
                    <Button 
                      className="mt-4 w-full bg-hirely hover:bg-hirely-dark" 
                      onClick={applyNow}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {showApplyModal && (
          <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Apply for {job?.title}</DialogTitle>
                <DialogDescription>
                  Complete the application form to apply for this position at {job?.company}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume</Label>
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="resume-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX, or TXT (MAX. 2MB)</p>
                      </div>
                      <input id="resume-upload" type="file" className="hidden" />
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Letter (Optional)</Label>
                  <Textarea id="cover" placeholder="Why are you interested in this role?" />
                </div>
              </div>
              <DialogFooter className="sm:justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" onClick={submitApplication}>
                  Submit Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {showShareModal && (
          <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share this job</DialogTitle>
                <DialogDescription>
                  Share this job position with your network
                </DialogDescription>
              </DialogHeader>
              <div className="p-4">
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="outline"
                    className="flex flex-col items-center py-4 px-8 h-auto"
                    onClick={() => handleSharePlatform('linkedin')}
                  >
                    <svg className="h-6 w-6 text-[#0077B5]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h-.003z" />
                    </svg>
                    <span className="mt-2">LinkedIn</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex flex-col items-center py-4 px-8 h-auto"
                    onClick={() => handleSharePlatform('twitter')}
                  >
                    <svg className="h-6 w-6 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <span className="mt-2">Twitter</span>
                  </Button
