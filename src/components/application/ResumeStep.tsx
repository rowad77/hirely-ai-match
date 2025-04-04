
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';

interface ResumeStepProps {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ResumeStep = ({
  resumeFile,
  setResumeFile,
  onNext,
  onPrevious
}: ResumeStepProps) => {
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
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Only PDF, DOC, or DOCX files are allowed');
        return;
      }
      
      setError(null);
      setResumeFile(file);
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
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Only PDF, DOC, or DOCX files are allowed');
        return;
      }
      
      setError(null);
      setResumeFile(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }
    
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div 
        className={`border-2 border-dashed ${error ? 'border-red-300' : 'border-gray-300'} rounded-lg p-8 text-center`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex justify-center">
          <Upload className={`h-12 w-12 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <div className="mt-4">
          <label htmlFor="resume-upload" className="cursor-pointer">
            <span className="mt-2 block text-lg font-medium text-gray-900">
              {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
            </span>
            <input
              id="resume-upload"
              name="resume"
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX up to 5MB</p>
          </label>
        </div>
        
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
        
        {resumeFile && (
          <div className="mt-4">
            <p className="text-sm text-green-600">
              Resume uploaded successfully! 
              <button
                type="button"
                className="ml-2 text-red-500 hover:underline"
                onClick={() => setResumeFile(null)}
              >
                Remove
              </button>
            </p>
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Our AI will analyze your resume to match you with the right job opportunities.</p>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" type="button" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>
        <Button className="bg-hirely hover:bg-hirely-dark" type="submit">
          Next Step
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ResumeStep;
