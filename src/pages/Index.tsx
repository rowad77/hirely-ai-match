
const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!file) return;
  
  setUploading(true);
  setUploadError(null);
  
  try {
    // Read the file content
    const reader = new FileReader();
    reader.onload = async (event) => {
      const resumeText = event.target?.result as string;
      
      try {
        // Call Supabase edge function to analyze resume
        const { data, error } = await supabase.functions.invoke('analyze-resume', {
          body: { resumeText },
        });

        if (error) throw error;

        toast({
          title: "CV Analyzed Successfully",
          description: "Our AI has reviewed your resume and will help match you with ideal opportunities.",
          duration: 5000,
        });

        // Optional: You might want to store or route the user based on the analysis
        console.log('Resume Analysis:', data.analysis);
      } catch (analysisError) {
        console.error('Resume Analysis Error:', analysisError);
        toast({
          title: "CV Analysis Failed",
          description: "We couldn't analyze your CV. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      }
    };

    reader.readAsText(file);
    
    setFile(null);
  } catch (error) {
    setUploadError('Failed to upload CV. Please try again.');
    toast({
      title: "Upload Failed",
      description: "There was an error uploading your CV.",
      variant: "destructive",
      duration: 5000,
    });
  } finally {
    setUploading(false);
  }
};
