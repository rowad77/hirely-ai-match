
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText, Upload, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useSupabaseFunction } from '@/hooks/use-supabase-function';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

interface CsvJobUploadProps {
  onUploadComplete: () => void;
}

interface ProcessingStatus {
  total: number;
  processed: number;
  successful: number;
  failed: number;
}

interface JobData {
  title: string;
  company_name?: string; 
  company_id: string;
  location?: string;
  description: string;
  type: string;
  salary?: string;
  category?: string;
  url?: string;
}

interface ImportRecord {
  id: string;
}

const CsvJobUpload: React.FC<CsvJobUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0
  });
  const { invokeFunction } = useSupabaseFunction();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get the current user ID when component mounts
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    fetchUserId();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setErrors([]);
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
          setErrors(['File size exceeds 10MB limit']);
          return;
        }
        setFile(selectedFile);
        parseCsv(selectedFile);
      }
    }
  });

  const parseCsv = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Check for parse errors
        if (results.errors && results.errors.length > 0) {
          setErrors(results.errors.map(err => `CSV parsing error: ${err.message} on row ${err.row}`));
          setParsedData([]);
          return;
        }

        // Validate required fields in each row
        const validationErrors: string[] = [];
        const dataRows = results.data as any[];
        
        if (dataRows.length === 0) {
          validationErrors.push('CSV file is empty');
        } else if (dataRows.length > 1000) {
          validationErrors.push('CSV has too many rows (limit: 1000)');
        }
        
        // Check required headers
        const requiredFields = ['title', 'description'];
        const headers = results.meta.fields || [];
        const missingHeaders = requiredFields.filter(field => !headers.includes(field));
        
        if (missingHeaders.length > 0) {
          validationErrors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
        }
        
        // Validate each row
        dataRows.forEach((row, index) => {
          requiredFields.forEach(field => {
            if (!row[field] || row[field].trim() === '') {
              validationErrors.push(`Row ${index + 2}: Missing required field "${field}"`);
            }
          });
        });
        
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          setParsedData([]);
        } else {
          setParsedData(dataRows);
        }
      }
    });
  };

  const uploadJobs = async () => {
    if (!parsedData.length || !userId) return;

    setIsUploading(true);
    setIsProcessing(true);
    setErrors([]);
    setStatus({
      total: parsedData.length,
      processed: 0,
      successful: 0,
      failed: 0
    });

    try {
      // 1. Create an import record
      const { data: importData, error: importError } = await supabase
        .from('job_imports')
        .insert({
          source: 'csv',
          status: 'processing',
          jobs_processed: parsedData.length,
          created_by: userId
        })
        .select('id')
        .single();

      if (importError || !importData) {
        throw new Error(`Failed to create import record: ${importError?.message}`);
      }

      // 2. Prepare the job data
      const processedJobs = await Promise.all(parsedData.map(async (job) => {
        try {
          // Handle company logic
          let companyId = '';
          if (job.company_id) {
            // Use provided company ID if available
            companyId = job.company_id;
          } else if (job.company_name) {
            // Check if company exists by name
            const { data: existingCompanies } = await supabase
              .from('companies')
              .select('id')
              .eq('name', job.company_name)
              .maybeSingle();
            
            if (existingCompanies) {
              companyId = existingCompanies.id;
            } else {
              // Create new company
              const { data: newCompany, error: companyError } = await supabase
                .from('companies')
                .insert({
                  name: job.company_name,
                  is_verified: false
                })
                .select('id')
                .single();
              
              if (companyError || !newCompany) {
                throw new Error(`Failed to create company: ${companyError?.message}`);
              }
              
              companyId = newCompany.id;
            }
          } else {
            // If no company info provided, use a default or throw error
            throw new Error('No company information provided');
          }

          // Get current user ID for the posted_by field
          const { data: userData } = await supabase.auth.getUser();
          const currentUserId = userData?.user?.id;

          // Format job data
          return {
            title: job.title,
            company_id: companyId,
            description: job.description,
            location: job.location || null,
            type: job.type || 'full-time',
            salary: job.salary || null,
            category: job.category || null,
            url: job.url || null,
            status: 'active',
            posted_by: currentUserId || null,
            posted_date: new Date().toISOString(),
            import_id: importData.id,
            api_source: 'csv'
          };
        } catch (error: any) {
          console.error('Error processing job:', error);
          setStatus(prev => ({
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1
          }));
          return null;
        }
      }));

      // Remove any null entries (failed processing)
      const validJobs = processedJobs.filter(Boolean);

      // 3. Use the edge function to process jobs in batches
      const result = await invokeFunction('process-csv-jobs', {
        jobs: validJobs,
        importId: importData.id
      });

      if (!result || result.error) {
        throw new Error(`Error processing jobs: ${result?.error || 'Unknown error'}`);
      }

      setStatus({
        total: parsedData.length,
        processed: parsedData.length,
        successful: result.data?.jobIds?.length || 0,
        failed: parsedData.length - (result.data?.jobIds?.length || 0)
      });

      // 4. Update the import record with results
      await supabase
        .from('job_imports')
        .update({
          status: 'completed',
          jobs_imported: result.data?.jobIds?.length || 0,
          completed_at: new Date().toISOString()
        })
        .eq('id', importData.id);
      
      toast.success(`Successfully imported ${result.data?.jobIds?.length || 0} jobs`);
      onUploadComplete();
    } catch (error: any) {
      console.error('CSV upload failed:', error);
      setErrors([`Upload failed: ${error.message || 'Unknown error'}`]);
      toast.error('CSV upload failed');
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const cancelUpload = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setStatus({
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0
    });
  };

  const getProgressColor = () => {
    if (status.failed > 0) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      {!file && (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="text-sm font-medium">
              Drag &amp; drop a CSV file here, or click to select a file
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: 10MB. File must be in CSV format.
            </p>
          </div>
        </div>
      )}
      
      {file && !isProcessing && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB • {parsedData.length} jobs
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={cancelUpload}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {errors.length > 0 ? (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                  {errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li>...and {errors.length - 5} more errors</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex justify-end">
              <Button 
                onClick={uploadJobs} 
                disabled={isUploading}
                className="flex items-center space-x-2"
              >
                {isUploading ? 'Uploading...' : 'Upload Jobs'}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {isProcessing && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-medium">Processing {parsedData.length} jobs</p>
            <Badge variant={isUploading ? "outline" : "default"}>
              {isUploading ? "Processing..." : "Completed"}
            </Badge>
          </div>
          
          <Progress 
            value={(status.processed / status.total) * 100} 
            className="w-full h-2"
            indicatorClassName={getProgressColor()}
          />
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              {status.processed} / {status.total} processed
            </span>
            <div className="flex space-x-4">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                {status.successful} successful
              </span>
              {status.failed > 0 && (
                <span className="flex items-center">
                  <X className="h-4 w-4 text-red-500 mr-1" />
                  {status.failed} failed
                </span>
              )}
            </div>
          </div>
          
          {!isUploading && (
            <div className="flex justify-end">
              <Button 
                onClick={cancelUpload}
                variant="outline"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CsvJobUpload;
