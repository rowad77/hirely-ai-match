
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { resumeText, userId } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing resume...');

    // First, get the analysis for display to the user
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a professional resume analyzer. Your task is to analyze resumes and provide constructive feedback and insights. 
            Focus on extracting key skills, experience, educational background, achievements, and identifying strengths and improvement areas.
            Structure your response in clear sections with bullet points when appropriate.` 
          },
          { role: 'user', content: `Please analyze this resume and provide feedback:\n\n${resumeText}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const analysisData = await analysisResponse.json();
    const analysis = analysisData.choices[0].message.content;

    // Second, extract structured data for database storage
    const structuredDataResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Extract the following information from the resume in JSON format:
            {
              "skills": ["skill1", "skill2", ...],
              "education": [
                {
                  "institution": "institution name",
                  "degree": "degree name",
                  "field_of_study": "field",
                  "start_date": "YYYY-MM-DD",
                  "end_date": "YYYY-MM-DD or null if current",
                  "is_current": boolean
                }
              ],
              "experience": [
                {
                  "job_title": "title",
                  "company_name": "company",
                  "start_date": "YYYY-MM-DD",
                  "end_date": "YYYY-MM-DD or null if current",
                  "is_current": boolean,
                  "description": "job description"
                }
              ],
              "full_name": "name if found",
              "summary": "brief professional summary"
            }
            
            For dates, if only year or month/year is available, use the first day of the month/year.
            Return only the JSON with no additional text.` 
          },
          { role: 'user', content: resumeText }
        ],
        temperature: 0.2,
      }),
    });

    if (!structuredDataResponse.ok) {
      const errorData = await structuredDataResponse.json();
      console.error('OpenAI extraction API error:', errorData);
      throw new Error(`OpenAI extraction API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const structuredDataResult = await structuredDataResponse.json();
    let structuredData;
    try {
      // The model should return only JSON, but let's handle possible text wrapping
      const content = structuredDataResult.choices[0].message.content;
      // Extract JSON if wrapped in ```json or ``` blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/([\s\S]*)/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      structuredData = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing structured data:', error);
      console.log('Raw content:', structuredDataResult.choices[0].message.content);
      structuredData = { error: 'Failed to parse structured data' };
    }

    return new Response(
      JSON.stringify({ analysis, structuredData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
