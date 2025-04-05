
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SimpleBadge } from '@/components/ui/SimpleBadge';
import { useToast } from "@/hooks/use-toast";

interface ResumeAnalyzerProps {
  resumeText: string;
  userId?: string;
}

const ResumeAnalyzer = ({ resumeText, userId }: ResumeAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedToProfile, setSavedToProfile] = useState(false);
  const { toast } = useToast();

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('No resume content to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setSavedToProfile(false);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText, userId },
      });

      if (error) throw error;
      
      setAnalysis(data.analysis);

      // If we have structured data and a userId, save to the database
      if (data.structuredData && userId) {
        await saveResumeData(data.structuredData);
        setSavedToProfile(true);
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const saveResumeData = async (structuredData: any) => {
    try {
      if (!userId) return;
      
      // Update skills in profile
      if (structuredData.skills && structuredData.skills.length > 0) {
        await supabase
          .from('profiles')
          .update({ skills: structuredData.skills })
          .eq('id', userId);
      }

      // Add education entries
      if (structuredData.education && structuredData.education.length > 0) {
        for (const edu of structuredData.education) {
          await supabase
            .from('education')
            .insert({
              profile_id: userId,
              institution: edu.institution,
              degree: edu.degree,
              field_of_study: edu.field_of_study,
              start_date: edu.start_date,
              end_date: edu.end_date,
              is_current: edu.is_current,
            });
        }
      }

      // Add work experience entries
      if (structuredData.experience && structuredData.experience.length > 0) {
        for (const exp of structuredData.experience) {
          await supabase
            .from('work_experiences')
            .insert({
              profile_id: userId,
              job_title: exp.job_title,
              company_name: exp.company_name,
              start_date: exp.start_date,
              end_date: exp.end_date,
              is_current: exp.is_current,
              description: exp.description,
            });
        }
      }

      // Update name if provided and not already set
      if (structuredData.full_name) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .single();
          
        if (!data?.full_name) {
          await supabase
            .from('profiles')
            .update({ full_name: structuredData.full_name })
            .eq('id', userId);
        }
      }

      toast({
        title: "Profile Updated",
        description: "Your resume data has been added to your profile.",
        duration: 5000,
      });
    } catch (err) {
      console.error('Error saving resume data:', err);
      toast({
        title: "Error Updating Profile",
        description: "There was a problem saving your resume data.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Resume Analysis
          <SimpleBadge variant="secondary" className="ml-2">AI Powered</SimpleBadge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!analysis && !loading && (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">
              Get an AI-powered analysis of your resume to identify strengths and areas for improvement.
              {userId && " We'll also extract key information to update your profile."}
            </p>
            <Button onClick={analyzeResume} className="bg-hirely hover:bg-hirely-dark">
              Analyze My Resume
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-hirely mb-2" />
            <p className="text-gray-600">Analyzing your resume with AI...</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="mt-2">
            <div className="flex items-center mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Analysis Complete</span>
              {savedToProfile && (
                <SimpleBadge variant="secondary" className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">Profile Updated</SimpleBadge>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-line">
              {analysis}
            </div>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setAnalysis(null)}
            >
              Run New Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeAnalyzer;
