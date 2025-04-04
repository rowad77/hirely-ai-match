
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SuccessStep = () => {
  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
        <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
        <p className="mt-2 text-gray-600">
          Our AI is analyzing your application and will match you with relevant positions. 
          We'll notify you once your application has been reviewed.
        </p>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900">What happens next?</h3>
          <ol className="mt-3 list-decimal list-inside text-left text-gray-600 space-y-2">
            <li>Our AI analyzes your resume and video responses</li>
            <li>Your application is matched with the job requirements</li>
            <li>The hiring team reviews your application</li>
            <li>You'll receive an email about next steps</li>
          </ol>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mt-8">
        <Link to="/jobs">
          <Button variant="outline">
            Browse More Jobs
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button className="bg-hirely hover:bg-hirely-dark">
            View Your Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessStep;
