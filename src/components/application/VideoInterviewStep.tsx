
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Video } from 'lucide-react';

interface VideoInterviewStepProps {
  videoQuestions: string[];
  onSubmit: () => void;
  onPrevious: () => void;
}

const VideoInterviewStep = ({
  videoQuestions,
  onSubmit,
  onPrevious
}: VideoInterviewStepProps) => {
  const [recordingStep, setRecordingStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [completedRecordings, setCompletedRecordings] = useState<number[]>([]);
  
  const startRecording = () => {
    setIsRecording(true);
    // In a real implementation, we would use WebRTC/Media Recorder API
    // For the MVP, we'll just simulate recording
    
    setTimeout(() => {
      setIsRecording(false);
      setCompletedRecordings([...completedRecordings, recordingStep]);
      
      if (recordingStep < videoQuestions.length - 1) {
        setRecordingStep(recordingStep + 1);
      }
    }, 3000);
  };
  
  const canSubmit = completedRecordings.length === videoQuestions.length;
  
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Question {recordingStep + 1} of {videoQuestions.length}
          </h3>
          <div className="flex space-x-1">
            {videoQuestions.map((_, index) => (
              <div 
                key={index} 
                className={`w-3 h-3 rounded-full ${
                  completedRecordings.includes(index) 
                    ? 'bg-green-500' 
                    : index === recordingStep 
                      ? 'bg-hirely' 
                      : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow-sm mb-4">
          <p className="text-gray-700">{videoQuestions[recordingStep]}</p>
        </div>
        
        <div className="mt-6">
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
            {isRecording ? (
              <div className="text-white flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mb-2"></div>
                <p>Recording...</p>
              </div>
            ) : completedRecordings.includes(recordingStep) ? (
              <div className="text-white flex flex-col items-center">
                <Video className="h-12 w-12 mb-2" />
                <p>Recording complete</p>
                <Button 
                  variant="outline" 
                  className="mt-4 text-white border-white/30 hover:bg-white/10"
                  onClick={() => {
                    setCompletedRecordings(completedRecordings.filter(i => i !== recordingStep));
                    startRecording();
                  }}
                >
                  Record Again
                </Button>
              </div>
            ) : (
              <div className="text-white flex flex-col items-center">
                <Video className="h-12 w-12 mb-2" />
                <p>Ready to record</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button 
              type="button" 
              className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-hirely hover:bg-hirely-dark'}`}
              onClick={startRecording}
              disabled={isRecording || completedRecordings.includes(recordingStep)}
            >
              {isRecording ? 'Recording...' : completedRecordings.includes(recordingStep) ? 'Recorded' : 'Start Recording'}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>You have up to 2 minutes to answer each question. Take your time and be natural.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>
        <Button 
          className="bg-hirely hover:bg-hirely-dark" 
          onClick={onSubmit}
          disabled={!canSubmit || isRecording}
        >
          Submit Application
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VideoInterviewStep;
