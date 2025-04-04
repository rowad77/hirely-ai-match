
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Upload, Video } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";

const JobApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [recordingStep, setRecordingStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const startRecording = () => {
    setIsRecording(true);
    // In a real implementation, we would use WebRTC/Media Recorder API
    // For the MVP, we'll just simulate recording
    
    setTimeout(() => {
      setIsRecording(false);
      if (recordingStep < videoQuestions.length - 1) {
        setRecordingStep(recordingStep + 1);
      } else {
        handleNextStep();
      }
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is where we would integrate with the backend
    // For the MVP, we'll just simulate a loading state
    
    setTimeout(() => {
      setLoading(false);
      handleNextStep();
      
      // Show success notification
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted. We'll be in touch soon!",
        duration: 5000,
      });
    }, 2000);
  };

  return (
    <MainLayout withFooter={false}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {step < 5 && (
            <div className="mb-8">
              <Progress value={step * 25} className={`h-2 ${
                step === 1 ? 'bg-blue-100' : 
                step === 2 ? 'bg-blue-200' : 
                step === 3 ? 'bg-blue-300' : 
                'bg-blue-400'
              }`} />
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
                  <CardTitle className="text-2xl">Apply for Senior Frontend Developer</CardTitle>
                  <CardDescription>
                    Start by telling us about yourself
                  </CardDescription>
                </CardHeader>
                
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="mt-1 min-h-[150px]"
                        placeholder="Tell us why you're a great fit for this position..."
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Link to="/jobs">
                      <Button variant="outline" type="button">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </Link>
                    <Button className="bg-hirely hover:bg-hirely-dark" type="submit">
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </form>
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
                
                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <div className="flex justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="mt-4">
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                          </span>
                          <input
                            id="resume-upload"
                            name="resume"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            required
                          />
                          <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 5MB</p>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={handlePrevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous Step
                    </Button>
                    <Button className="bg-hirely hover:bg-hirely-dark" type="submit">
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </form>
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
                
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Question {recordingStep + 1} of {videoQuestions.length}
                    </h3>
                    <p className="text-gray-700">{videoQuestions[recordingStep]}</p>
                    
                    <div className="mt-6">
                      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                        {isRecording ? (
                          <div className="text-white flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mb-2"></div>
                            <p>Recording...</p>
                          </div>
                        ) : (
                          <div className="text-white flex flex-col items-center">
                            <Video className="h-12 w-12 mb-2" />
                            <p>Ready to record</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 flex justify-center">
                        <Button 
                          type="button" 
                          className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-hirely hover:bg-hirely-dark'}`}
                          onClick={startRecording}
                          disabled={isRecording}
                        >
                          {isRecording ? 'Recording...' : 'Start Recording'}
                        </Button>
                      </div>
                      
                      <div className="mt-4 text-sm text-gray-500">
                        <p>You have up to 2 minutes to answer each question. Take your time and be natural.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={handlePrevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Step
                  </Button>
                  <Button 
                    className="bg-hirely hover:bg-hirely-dark" 
                    onClick={handleSubmit}
                    disabled={recordingStep < videoQuestions.length - 1 || isRecording}
                  >
                    Submit Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            )}
            
            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Application Submitted!</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
                    <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-lg font-medium text-gray-900">Thank you for applying!</p>
                    <p className="mt-2 text-gray-600">
                      Our AI is analyzing your application and will match you with relevant positions. 
                      We'll notify you once your application has been reviewed.
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-center gap-4">
                  <Link to="/jobs">
                    <Button variant="outline">
                      Browse More Jobs
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button className="bg-hirely hover:bg-hirely-dark">
                      Return to Home
                    </Button>
                  </Link>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobApplication;
