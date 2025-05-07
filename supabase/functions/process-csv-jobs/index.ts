
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Type definitions for better type safety
interface JobData {
  title: string;
  company_name?: string;
  company_id: string;
  location?: string;
  description: string;
  type?: string;
  salary?: string;
  category?: string;
  url?: string;
  [key: string]: any;
}

interface ErrorResponse {
  error: string;
  details?: any;
  retryable?: boolean;
}

interface SuccessResponse {
  success: boolean;
  message: string;
  jobIds?: string[];
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Validation schema
const JobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company_id: z.string().uuid('Valid company ID is required'),
  description: z.string().min(1, 'Job description is required'),
  location: z.string().optional(),
  type: z.string().optional().default('full-time'),
  salary: z.string().optional(),
  category: z.string().optional(),
  url: z.string().optional(),
});

const RequestSchema = z.object({
  jobs: z.array(JobSchema).min(1, 'At least one job is required'),
  importId: z.string().uuid('Valid import ID is required')
});

// Constants for retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Helper function to wait
async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to retry an async operation
async function retry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
  onRetry?: (error: Error, attempt: number) => void
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    
    if (onRetry) {
      onRetry(error as Error, MAX_RETRIES - retries + 1);
    }
    
    await wait(delay);
    return retry(operation, retries - 1, delay * 2, onRetry); // Exponential backoff
  }
}

serve(async (req) => {
  console.log(`[process-csv-jobs] Request received: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    // Parse request body
    const requestBody = await req.json();
    console.log(`[process-csv-jobs] Request parsed in ${Date.now() - startTime}ms`);
    
    // Validate request body
    try {
      const validationResult = RequestSchema.parse(requestBody);
      console.log(`[process-csv-jobs] Request validated: ${validationResult.jobs.length} jobs to process for import ${validationResult.importId}`);
    } catch (validationError) {
      console.error('[process-csv-jobs] Validation error:', validationError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          details: (validationError as Error).message,
          retryable: false
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { jobs, importId } = requestBody;

    // Create client
    const supabaseClient = Deno.env.get('SUPABASE_URL') && Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      ? createClient(
          Deno.env.get('SUPABASE_URL') as string,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
        )
      : null;
      
    if (!supabaseClient) {
      return new Response(
        JSON.stringify({ 
          error: 'Supabase client could not be initialized',
          retryable: true
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format jobs for insertion
    const jobsToInsert = jobs.map((job: JobData) => ({
      title: job.title,
      company_id: job.company_id,
      description: job.description,
      location: job.location || null,
      type: job.type || 'full-time',
      salary: job.salary || null,
      category: job.category || null,
      url: job.url || null,
      status: 'active',
      posted_date: new Date().toISOString(),
      import_id: importId,
      api_source: 'csv'
    }));
    
    console.log(`[process-csv-jobs] Inserting ${jobsToInsert.length} jobs`);
    
    // Insert jobs with retry logic
    const data = await retry(
      async () => {
        const { data, error } = await supabaseClient
          .from('jobs')
          .insert(jobsToInsert)
          .select('id');
          
        if (error) {
          console.error('[process-csv-jobs] Database error inserting jobs:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        return data;
      },
      MAX_RETRIES,
      RETRY_DELAY,
      (error, attempt) => {
        console.warn(`[process-csv-jobs] Retry attempt ${attempt}/${MAX_RETRIES} after error:`, error.message);
      }
    );
    
    console.log(`[process-csv-jobs] Successfully inserted ${data.length} jobs`);
    
    // Update import record with retry logic
    await retry(
      async () => {
        const { error } = await supabaseClient
          .from('job_imports')
          .update({
            status: 'completed',
            jobs_imported: data.length,
            completed_at: new Date().toISOString()
          })
          .eq('id', importId);
          
        if (error) {
          console.error('[process-csv-jobs] Error updating import record:', error);
          throw new Error(`Error updating import: ${error.message}`);
        }
      },
      MAX_RETRIES,
      RETRY_DELAY
    );
    
    const processingTime = Date.now() - startTime;
    console.log(`[process-csv-jobs] Request completed in ${processingTime}ms`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${data.length} jobs in ${processingTime}ms`,
        jobIds: data.map((job: any) => job.id) 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[process-csv-jobs] Error processing jobs:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isRetryable = 
      errorMessage.includes('timeout') || 
      errorMessage.includes('connection') ||
      errorMessage.includes('network');
      
    const errorResponse: ErrorResponse = { 
      error: errorMessage,
      details: error instanceof Error ? { name: error.name, stack: error.stack } : undefined,
      retryable: isRetryable
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to create a Supabase client
function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    from: (table: string) => ({
      insert: (data: any) => ({
        select: (columns: string) => 
          fetch(`${supabaseUrl}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
          }).then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                throw new Error(`API error: ${JSON.stringify(error)}`);
              });
            }
            return res.json();
          })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) =>
          fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
          }).then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                throw new Error(`API error: ${JSON.stringify(error)}`);
              });
            }
            return res.json();
          })
      })
    })
  };
}
