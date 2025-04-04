
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import MainLayout from '../components/layout/MainLayout';
import PersonalInfoStep from '@/components/application/PersonalInfoStep';
import ResumeStep from '@/components/application/ResumeStep';
import VideoInterviewStep from '@/components/application/VideoInterviewStep';
import SuccessStep from '@/components/application/SuccessStep';
import { featuredJobs } from '@/data/jobs';

const JobApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoQuestions, setVideoQuestions] = useState([
    "Tell us about yourself and your experience with similar roles.",
    "What are your strengths and how would they contribute to this position?",
    "Describe a challenging situation you faced at work and how you handled it."
  ]);
  const [jobTitle, setJobTitle] = useState("This position");
  
  const searchParams = new URLSearchParams(location.search);
  const jobId = searchParams.get('jobId');
  
  useEffect(() => {
    if (jobId) {
      const job = featuredJobs.find(job => job.id === parseInt(jobId));
      if (job) {
        setJobTitle(job.title);
      }
    }
  }, [jobId]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // This is where we would integrate with the backend
    // For the MVP, we'll just simulate a loading state
    
    setTimeout(() => {
      setLoading(false);
      handleNextStep();
      
      // Show success notification
      toast.success("Application Submitted", {
        description: "Your application has been successfully submitted. We'll be in touch soon!",
        duration: 5000,
      });
    }, 2000);
  };

  const getProgressValue = () => {
    return step * 25;
  };

  return (
    <MainLayout withFooter={false}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {step < 5 && (
            <div className="mb-8">
              <Progress 
                value={getProgressValue()} 
                className={`h-2 ${
                  step === 1 ? 'bg-blue-100' : 
                  step === 2 ? 'bg-blue-200' : 
                  step === 3 ? 'bg-blue-300' : 
                  'bg-blue-400'
                }`} 
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span className={step >= 1 ? 'font-semibold text-hirely' : ''}>Personal Info</span>
                <span className={step >= 2 ? 'font-semibold text-hirely' : ''}>Resume</span>
                <span className={step >= 3 ? 'font-semibold text-hirely' : ''}>Video Interview</span>
                <span className={step >= 4 ? 'font-semibold text-hirely' : ''}>Complete</span>
              </div>
            </div>
          )}
          
          <Card className="mt-4 shadow-md">
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Apply for {jobTitle}</CardTitle>
                  <CardDescription>
                    Start by telling us about yourself
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <PersonalInfoStep 
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    coverLetter={coverLetter}
                    setCoverLetter={setCoverLetter}
                    onNext={handleNextStep}
                  />
                </CardContent>
              </>
            )}
            
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
                  <CardDescription>
                    Our AI will analyze your experience and match you with the right positions
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ResumeStep 
                    resumeFile={resumeFile}
                    setResumeFile={setResumeFile}
                    onNext={handleNextStep}
                    onPrevious={handlePrevStep}
                  />
                </CardContent>
              </>
            )}
            
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Video Interview</CardTitle>
                  <CardDescription>
                    Answer a few questions to help us get to know you better
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <VideoInterviewStep 
                    videoQuestions={videoQuestions}
                    onSubmit={handleSubmit}
                    onPrevious={handlePrevStep}
                  />
                </CardContent>
              </>
            )}
            
            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Application Submitted!</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <SuccessStep />
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobApplication;
