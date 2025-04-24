
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const theirStackApiKey = Deno.env.get('THEIRSTACK_API_KEY')!;
const BASE_URL = 'https://api.theirstack.com/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { page = 1, filters = {} } = await req.json();
    
    // Calculate date 4 days ago
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    
    // Add our fixed filters
    const jobFilters = {
      ...filters,
      location: 'Saudi Arabia',
      posted_after: fourDaysAgo.toISOString(),
    };

    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...jobFilters
    });

    const response = await fetch(`${BASE_URL}/jobs?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${theirStackApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`TheirStack API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch jobs' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
