
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

const CreateJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is where we would integrate with the backend
    // For the MVP, we'll just simulate a loading state
    
    setTimeout(() => {
      setLoading(false);
      alert('Job creation feature will be implemented with backend integration!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link to="/dashboard" className="text-hirely hover:text-hirely-dark flex items-center">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Job</CardTitle>
            <CardDescription>
              Fill out the form below to create a new job posting. Our AI will optimize your job description for better visibility.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Senior Frontend Developer"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote, New York, NY"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe the role, responsibilities, requirements..."
                  className="mt-1 h-40"
                />
              </div>
              
              <div>
                <Label htmlFor="skills">Required Skills (comma separated)</Label>
                <Textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js"
                  className="mt-1"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-900">Interview Setup</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Our AI will automatically generate relevant interview questions based on the job description and required skills.
                </p>
                <div className="mt-4 flex items-center">
                  <input
                    id="ai-interviews"
                    name="ai-interviews"
                    type="checkbox"
                    className="h-4 w-4 text-hirely focus:ring-hirely-dark border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="ai-interviews" className="ml-2 text-sm text-gray-700">
                    Enable AI-generated video interviews
                  </label>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-4">
              <Button variant="outline" type="button">
                Save as Draft
              </Button>
              <Button className="bg-hirely hover:bg-hirely-dark" type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Publishing...' : 'Publish Job'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateJob;
