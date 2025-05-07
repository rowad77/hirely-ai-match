
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CsvJobUploadProps {
  onUploadComplete: () => void;
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
  [key: string]: any; // For other potential CSV fields
}

// Default column mapping from CSV to expected format
const defaultColumnMapping = {
  title: 'title',
  company: 'company_name',
  location: 'location',
  description: 'description',
  job_type: 'type',
  salary: 'salary',
  category: 'category',
  url: 'url'
};

const CsvJobUpload: React.FC<CsvJobUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState<{
    total: number;
    success: number;
    error: number;
  } | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is a CSV
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        toast.error('Please upload a CSV file');
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setProgress(0);
      setUploadStats(null);
      setUploadErrors([]);
    }
  };

  const parseCsv = async (fileContent: string): Promise<JobData[]> => {
    // Basic CSV parsing
    const rows = fileContent.split('\n').filter(row => row.trim());
    const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
    
    const jobs: JobData[] = [];
    
    // Process each row starting from index 1 (skip header)
    for (let i = 1; i < rows.length; i++) {
      try {
        const rowData = rows[i].split(',');
        
        if (rowData.length !== headers.length) {
          setUploadErrors(prev => [...prev, `Row ${i + 1}: Column count mismatch`]);
          continue;
        }
        
        const job: Record<string, any> = {};
        
        // Map CSV columns to job fields using the mapping
        headers.forEach((header, index) => {
          const mappedField = Object.entries(defaultColumnMapping)
            .find(([_, value]) => value === header)?.[0] || header;
          
          job[mappedField] = rowData[index]?.trim() || '';
        });
        
        // Mandatory fields
        if (!job.title) {
          setUploadErrors(prev => [...prev, `Row ${i + 1}: Missing title`]);
          continue;
        }
        
        if (!job.description) {
          setUploadErrors(prev => [...prev, `Row ${i + 1}: Missing description`]);
          continue;
        }
        
        // Default values
        job.company_id = '00000000-0000-0000-0000-000000000000'; // Default company ID
        job.type = job.type || 'full-time';
        
        jobs.push(job as JobData);
      } catch (error) {
        setUploadErrors(prev => [...prev, `Row ${i + 1}: ${error}`]);
      }
    }
    
    return jobs;
  };

  const uploadJobs = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setProgress(10);
    setUploadErrors([]);
    
    try {
      // Read the file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          setProgress(30);
          
          // Parse CSV
          const jobs = await parseCsv(content);
          
          if (jobs.length === 0) {
            toast.error('No valid jobs found in the CSV');
            setIsUploading(false);
            return;
          }
          
          setProgress(50);
          
          // Create import record
          const { data: importData, error: importError } = await supabase
            .from('job_imports')
            .insert({
              source: 'csv_upload',
              status: 'processing',
              jobs_processed: jobs.length,
              metadata: {
                filename: fileName,
                column_count: Object.keys(jobs[0]).length
              }
            })
            .select('id')
            .single();
            
          if (importError) {
            throw new Error(`Failed to create import record: ${importError.message}`);
          }
          
          setProgress(70);
          
          // Process jobs in batches to avoid payload size limitations
          const batchSize = 50;
          let successCount = 0;
          let errorCount = 0;
          
          for (let i = 0; i < jobs.length; i += batchSize) {
            const batch = jobs.slice(i, i + batchSize);
            
            // Format jobs for insertion
            const jobsToInsert = batch.map(job => ({
              title: job.title,
              company_id: job.company_id,
              description: job.description,
              location: job.location || null,
              type: job.type,
              salary: job.salary || null,
              category: job.category || null,
              url: job.url || null,
              status: 'active',
              posted_by: (await supabase.auth.getUser()).data.user?.id || null,
              posted_date: new Date().toISOString(),
              import_id: importData.id,
              api_source: 'csv'
            }));
            
            // Insert jobs
            const { data, error } = await supabase
              .from('jobs')
              .insert(jobsToInsert)
              .select('id');
              
            if (error) {
              console.error('Error inserting jobs batch:', error);
              errorCount += batch.length;
            } else {
              successCount += data.length;
            }
            
            // Update progress
            setProgress(70 + Math.floor((i / jobs.length) * 25));
          }
          
          // Update import record
          await supabase
            .from('job_imports')
            .update({
              status: 'completed',
              jobs_imported: successCount,
              completed_at: new Date().toISOString(),
              errors: uploadErrors.length > 0 ? { messages: uploadErrors } : null
            })
            .eq('id', importData.id);
            
          setProgress(100);
          
          // Set stats
          setUploadStats({
            total: jobs.length,
            success: successCount,
            error: errorCount + uploadErrors.length
          });
          
          if (successCount > 0) {
            toast.success(`Successfully imported ${successCount} jobs`);
            onUploadComplete();
          } else {
            toast.error('Failed to import any jobs');
          }
        } catch (error) {
          console.error('Error processing CSV:', error);
          toast.error(`Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read file');
        setIsUploading(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Jobs via CSV</CardTitle>
        <CardDescription>
          Upload a CSV file to import multiple jobs at once.
          Make sure your CSV has the following headers: title, company, location, description, job_type, salary, category, url.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {!file ? (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Drag and drop a CSV file here, or click to select a file
                </p>
                <label className="cursor-pointer">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                    Select File
                  </span>
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm font-medium">{fileName}</p>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setFileName('');
                    }}
                  >
                    Change File
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {uploadStats && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                {uploadStats.error === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : uploadStats.success === 0 ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                Upload Results
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold">{uploadStats.total}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Successful</p>
                  <p className="text-xl font-bold text-green-600">{uploadStats.success}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Failed</p>
                  <p className="text-xl font-bold text-red-600">{uploadStats.error}</p>
                </div>
              </div>
            </div>
          )}
          
          {uploadErrors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-md space-y-2">
              <h4 className="font-medium text-red-800">Errors</h4>
              <div className="max-h-40 overflow-auto text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  {uploadErrors.map((error, index) => (
                    <li key={index} className="text-red-700">{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={uploadJobs} 
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload Jobs'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CsvJobUpload;
