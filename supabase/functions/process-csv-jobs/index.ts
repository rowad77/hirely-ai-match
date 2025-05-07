
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { jobs, importId } = await req.json();
    
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No jobs provided or invalid format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client
    const supabaseClient = Deno.env.get('SUPABASE_URL') && Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      ? createClient(
          Deno.env.get('SUPABASE_URL') as string,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
        )
      : null;
      
    if (!supabaseClient) {
      return new Response(
        JSON.stringify({ error: 'Supabase client could not be initialized' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format jobs for insertion
    const jobsToInsert = jobs.map((job: JobData) => ({
      title: job.title,
      company_id: job.company_id,
      description: job.description,
      location: job.location || null,
      type: job.type,
      salary: job.salary || null,
      category: job.category || null,
      url: job.url || null,
      status: 'active',
      posted_date: new Date().toISOString(),
      import_id: importId,
      api_source: 'csv'
    }));
    
    // Insert jobs
    const { data, error } = await supabaseClient
      .from('jobs')
      .insert(jobsToInsert)
      .select('id');
      
    if (error) {
      throw error;
    }
    
    // Update import record
    await supabaseClient
      .from('job_imports')
      .update({
        status: 'completed',
        jobs_imported: data.length,
        completed_at: new Date().toISOString()
      })
      .eq('id', importId);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${data.length} jobs`,
        jobIds: data.map((job: any) => job.id) 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing jobs:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
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
          }).then(res => res.json())
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
          }).then(res => res.json())
      })
    })
  };
}
