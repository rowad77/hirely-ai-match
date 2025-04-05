
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SimpleBadge } from '@/components/ui/SimpleBadge';

interface ResumeAnalyzerProps {
  resumeText: string;
}

const ResumeAnalyzer = ({ resumeText }: ResumeAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('No resume content to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText },
      });

      if (error) throw error;
      
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume. Please try again later.');
    } finally {
      setLoading(false);
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
