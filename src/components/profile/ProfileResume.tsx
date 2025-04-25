
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';

interface ProfileResumeProps {
  userId: string;
}

const ProfileResume = ({ userId }: ProfileResumeProps) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        return;
      }
      
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        setError('Only PDF, DOC, DOCX, or TXT files are allowed');
        return;
      }
      
      setError(null);
      setResumeFile(file);
      
      // For text files, read the content for analysis
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text || '');
        };
        reader.readAsText(file);
      } else {
        // Simulate text extraction from non-text files
        setResumeText(`Resume for ${file.name}. 
This is a placeholder for extracted text from ${file.type} file.
For the MVP, we're simulating text extraction from non-text files.
In a full implementation, you would use a document parsing service.`);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        return;
      }
      
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        setError('Only PDF, DOC, DOCX, or TXT files are allowed');
        return;
      }
      
      setError(null);
      setResumeFile(file);
      
      // For text files, read the content for analysis
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text || '');
        };
        reader.readAsText(file);
      } else {
        // Simulate text extraction from non-text files
        setResumeText(`Resume for ${file.name}. 
This is a placeholder for extracted text from ${file.type} file.
For the MVP, we're simulating text extraction from non-text files.
In a full implementation, you would use a document parsing service.`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed ${error ? 'border-red-300' : 'border-gray-300'} rounded-lg p-8 text-center`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex justify-center">
          <Upload className={`h-12 w-12 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <div className="mt-4">
          <label htmlFor="profile-resume-upload" className="cursor-pointer">
            <span className="mt-2 block text-lg font-medium text-gray-900">
              {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
            </span>
            <input
              id="profile-resume-upload"
              name="resume"
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
            <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX or TXT up to 5MB</p>
          </label>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {resumeFile && (
          <div className="mt-4">
            <p className="text-sm text-green-600">
              Resume uploaded successfully! 
              <button
                type="button"
                className="ml-2 text-red-500 hover:underline"
                onClick={() => {
                  setResumeFile(null);
                  setResumeText('');
                }}
              >
                Remove
              </button>
            </p>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Our AI will analyze your resume to extract skills, education, and work experience.</p>
        </div>
      </div>
      
      {resumeFile && resumeText && (
        <div className="mt-6">
          <ResumeAnalyzer resumeText={resumeText} userId={userId} />
        </div>
      )}
      
      {!resumeFile && (
        <Card className="p-6 bg-gray-50 border-dashed">
          <div className="flex justify-center items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
            <h3 className="text-lg font-medium">Resume Tips</h3>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Use a clean, professional format that's easy to read</li>
            <li>Highlight your most relevant skills and achievements</li>
            <li>Quantify your accomplishments with numbers when possible</li>
            <li>Keep your resume concise (1-2 pages for most roles)</li>
            <li>Tailor your resume for each job application</li>
            <li>Check for grammar and spelling errors</li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default ProfileResume;
