
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Enable the pg_cron and pg_net extensions if they're not already enabled
    await supabase.rpc('setup_cron_extensions');
    
    // Set up a cron job to run daily at midnight
    await supabase.rpc('create_jobspy_cron_job');
    
    return new Response(JSON.stringify({
      success: true,
      message: "JobSpy cron job has been set up successfully"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error setting up cron job:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error.message || "An error occurred while setting up the cron job"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
