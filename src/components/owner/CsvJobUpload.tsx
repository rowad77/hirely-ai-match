
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Check, X, AlertCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';

interface CsvJobUploadProps {
  onUploadComplete?: () => void;
}

interface JobData {
  title: string;
  company_name?: string;
  company_id?: string;
  location?: string;
  description: string;
  type?: string;
  salary?: string;
  category?: string;
  url?: string;
  [key: string]: any;
}

interface ResponseData {
  success: boolean;
  message: string;
  jobIds?: string[];
  error?: string;
}

export function CsvJobUpload({ onUploadComplete }: CsvJobUploadProps) {
  const [csvData, setCsvData] = useState<JobData[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [importId, setImportId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use react-dropzone for file drag and drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    onDrop: handleFileDrop,
  });

  // Handle files dropped into the dropzone
  function handleFileDrop(acceptedFiles: File[]) {
    setUploadSuccess(false);
    setValidationErrors([]);
    setUploadError(null);
    
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    processFile(file);
  }

  // Process the CSV file
  function processFile(file: File) {
    setIsValidating(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsValidating(false);
        
        if (results.errors.length > 0) {
          setValidationErrors(results.errors.map(err => `Line ${err.row}: ${err.message}`));
          return;
        }
        
        // Validate the parsed data
        const jobs = results.data as JobData[];
        const errors = validateJobsData(jobs);
        
        if (errors.length > 0) {
          setValidationErrors(errors);
          return;
        }
        
        setCsvData(jobs);
      },
      error: (error) => {
        setIsValidating(false);
        setValidationErrors([`CSV parsing error: ${error.message}`]);
      }
    });
  }

  // Validate the job data
  function validateJobsData(jobs: JobData[]): string[] {
    const errors: string[] = [];
    
    if (jobs.length === 0) {
      errors.push('No job entries found in the CSV file.');
      return errors;
    }

    // Check for required fields in each job
    jobs.forEach((job, index) => {
      if (!job.title) {
        errors.push(`Row ${index + 2}: Missing job title.`);
      }
      
      if (!job.description) {
        errors.push(`Row ${index + 2}: Missing job description.`);
      }
      
      if (!job.company_id && !job.company_name) {
        errors.push(`Row ${index + 2}: Missing company information (company_id or company_name).`);
      }
    });
    
    return errors;
  }

  // Get company ID for the jobs (create a new record if needed)
  async function ensureCompanyIds(): Promise<JobData[]> {
    // For jobs without a company_id but with a company_name,
    // we should either fetch existing company or create new one
    const jobsWithCompanyIds = await Promise.all(
      csvData.map(async (job) => {
        if (job.company_id) {
          return job;
        }
        
        if (job.company_name) {
          // Check if company already exists
          const { data: existingCompany } = await supabase
            .from('companies')
            .select('id')
            .eq('name', job.company_name)
            .maybeSingle();
            
          if (existingCompany?.id) {
            return { ...job, company_id: existingCompany.id };
          }
          
          // Create new company
          const { data: newCompany, error } = await supabase
            .from('companies')
            .insert({ 
              name: job.company_name,
              description: `Auto-created for job import: ${job.title}`
            })
            .select('id')
            .single();
            
          if (error) {
            console.error('Failed to create company:', error);
            // Return job without company_id
            return job;
          }
          
          return { ...job, company_id: newCompany.id };
        }
        
        return job;
      })
    );
    
    return jobsWithCompanyIds;
  }

  // Upload the job data to Supabase
  async function handleUpload() {
    try {
      setIsUploading(true);
      setUploadProgress(10);
      setUploadError(null);
      
      // First ensure all jobs have company_id
      const jobsWithCompanyIds = await ensureCompanyIds();
      setUploadProgress(30);
      
      // Create a job import record
      const { data: importRecord, error: importError } = await supabase
        .from('job_imports')
        .insert({
          source: 'csv',
          status: 'processing',
          jobs_processed: jobsWithCompanyIds.length,
          metadata: { filename: 'csv-upload', timestamp: new Date().toISOString() }
        })
        .select('id')
        .single();
        
      if (importError) {
        throw new Error(`Failed to create import record: ${importError.message}`);
      }
      
      const importIdValue = importRecord.id;
      setImportId(importIdValue);
      setUploadProgress(40);
      
      // Process the jobs using our edge function
      const { data, error } = await supabase.functions.invoke(
        'process-csv-jobs', 
        {
          body: {
            jobs: jobsWithCompanyIds,
            importId: importIdValue
          }
        }
      );
      
      setUploadProgress(90);
      
      if (error) {
        throw new Error(`Error processing jobs: ${error.message}`);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error processing jobs');
      }
      
      // Update the UI with the results
      setUploadProgress(100);
      setUploadSuccess(true);
      
      const responseData = data as ResponseData;
      if (responseData.jobIds && responseData.jobIds.length > 0) {
        toast.success(`Successfully imported ${responseData.jobIds.length} jobs`, {
          description: `Job IDs: ${responseData.jobIds.slice(0, 3).join(', ')}${responseData.jobIds.length > 3 ? '...' : ''}`,
          duration: 5000,
        });
      } else {
        toast.success(`Jobs successfully processed`, {
          description: responseData.message || 'Your jobs have been imported',
          duration: 5000,
        });
      }
      
      // Clear the data
      setCsvData([]);
      
      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during upload';
      setUploadError(errorMessage);
      toast.error('Failed to upload jobs', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
            `}
          >
            <input {...getInputProps()} disabled={isUploading} />
            <div className="flex flex-col items-center justify-center space-y-3">
              <Upload size={36} className="text-gray-500" />
              <h3 className="text-lg font-medium">Drop CSV file here or click to browse</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Upload a CSV file with job data. The file should include columns for title, company_id,
                description, and optional fields like location, type, salary, and category.
              </p>
            </div>
          </div>
          
          {/* File Data Preview */}
          {csvData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">CSV File Validated</h4>
                <Badge variant="outline" className="text-green-600 bg-green-50">
                  {csvData.length} jobs ready
                </Badge>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p>First 3 job entries:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {csvData.slice(0, 3).map((job, i) => (
                    <li key={i} className="truncate">
                      {job.title} - {job.company_name || job.company_id}
                    </li>
                  ))}
                </ul>
              </div>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload Jobs to Database'}
              </Button>
            </div>
          )}
          
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-1">CSV validation errors:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {validationErrors.slice(0, 5).map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                  {validationErrors.length > 5 && (
                    <li>...and {validationErrors.length - 5} more errors</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Upload Error */}
          {uploadError && (
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertDescription>
                Upload failed: {uploadError}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Upload Success */}
          {uploadSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Jobs uploaded successfully! {importId && `Import ID: ${importId.substring(0, 8)}...`}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Upload Progress */}
          {isValidating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Validating CSV data...</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          )}
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading jobs...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {/* Helper Text */}
          <div className="flex items-start space-x-2 text-sm text-gray-500">
            <FileText className="h-5 w-5 flex-shrink-0" />
            <p>
              Need help with your CSV format? Make sure your file has columns for title, description, 
              and either company_id or company_name. Optional columns include location, type, salary, and category.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
