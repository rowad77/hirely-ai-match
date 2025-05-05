import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    console.log("Starting scheduled job import");
    
    // Get active job import schedules
    const schedulesResponse = await fetch(`${supabaseUrl}/rest/v1/job_import_schedules?select=*&is_active=eq.true`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });
    
    if (!schedulesResponse.ok) {
      throw new Error(`Failed to fetch schedules: ${schedulesResponse.status}`);
    }
    
    const schedules = await schedulesResponse.json();
    console.log(`Found ${schedules.length} active job import schedules`);
    
    // Process each schedule
    const results = [];
    for (const schedule of schedules) {
      try {
        console.log(`Processing schedule: ${schedule.name}`);
        
        // Get the import config
        const configResponse = await fetch(`${supabaseUrl}/rest/v1/job_import_configs?select=*&id=eq.${schedule.job_import_config_id}`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          }
        });
        
        if (!configResponse.ok) {
          throw new Error(`Failed to fetch config: ${configResponse.status}`);
        }
        
        const configs = await configResponse.json();
        if (configs.length === 0) {
          throw new Error(`No config found with ID: ${schedule.job_import_config_id}`);
        }
        
        const config = configs[0];
        
        // Trigger the import
        console.log(`Invoking import-jobspy-jobs with config: ${JSON.stringify(config.parameters)}`);
        const importResponse = await fetch(`${supabaseUrl}/functions/v1/import-jobspy-jobs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config.parameters)
        });
        
        if (!importResponse.ok) {
          throw new Error(`Import failed: ${importResponse.status}`);
        }
        
        const importResult = await importResponse.json();
        
        // Update the last run time
        await fetch(`${supabaseUrl}/rest/v1/job_import_schedules?id=eq.${schedule.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            last_run_at: new Date().toISOString()
          })
        });
        
        results.push({
          schedule_id: schedule.id,
          name: schedule.name,
          status: 'success',
          result: importResult
        });
      } catch (error) {
        console.error(`Error processing schedule ${schedule.id}:`, error);
        results.push({
          schedule_id: schedule.id,
          name: schedule.name,
          status: 'error',
          error: error.message
        });
      }
    }
    
    console.log("Completed scheduled job import");
    
    return new Response(JSON.stringify({ 
      message: 'Scheduled job import completed',
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in scheduled job import:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
