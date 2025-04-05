
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Validate file type (PDF, DOC, DOCX)
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        setUploadError('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setUploadedFileName(selectedFile.name);
      setUploadError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setUploading(true);
    setUploadError(null);
    
    try {
      // Read the file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        const resumeText = event.target?.result as string;
        setResumeText(resumeText);
        
        try {
          // Call Supabase edge function to analyze resume
          const { data, error } = await supabase.functions.invoke('analyze-resume', {
            body: { resumeText },
          });

          if (error) throw error;

          toast({
            title: "CV Analyzed Successfully",
            description: "Our AI has reviewed your resume and will help match you with ideal opportunities.",
            duration: 5000,
          });

          // Optional: You might want to store or route the user based on the analysis
          console.log('Resume Analysis:', data.analysis);
        } catch (analysisError) {
          console.error('Resume Analysis Error:', analysisError);
          toast({
            title: "CV Analysis Failed",
            description: "We couldn't analyze your CV. Please try again later.",
            variant: "destructive",
            duration: 5000,
          });
        }
      };

      reader.readAsText(file);
      
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
    <MainLayout>
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Find Your Perfect Career Opportunity
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Upload your CV and let our AI-powered platform match you with your ideal job opportunities.
              </p>
              
              {resumeText ? (
                <ResumeAnalyzer resumeText={resumeText} />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Upload Your CV</h2>
                  <p className="text-gray-600 mb-6">
                    Get matched with your ideal opportunities
                  </p>
                  
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-hirely transition-colors">
                      <input
                        type="file"
                        id="cv-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            {uploadedFileName ? uploadedFileName : 'Drag & drop or click to upload'}
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOC, or DOCX (Max 5MB)</p>
                        </div>
                      </label>
                    </div>
                    
                    {uploadError && (
                      <div className="text-red-500 text-sm">{uploadError}</div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!file || uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Upload & Analyze CV'
                      )}
                    </Button>
                  </form>
                </div>
              )}
              
              <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/jobs')}
                  className="w-full md:w-auto"
                >
                  Browse Jobs
                </Button>
                <p className="text-sm text-gray-500">
                  Already have an account? <a href="/login" className="text-hirely hover:underline">Sign In</a>
                </p>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="/placeholder.svg" 
                alt="Career opportunities" 
                className="w-full rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional sections like featured jobs, testimonials, etc. can go here */}
    </MainLayout>
  );
};

export default Index;
