
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const CompanyJobCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [company] = useState('TechCorp');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const handleAddSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !location || !description || !requirements) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Submit form
    toast.success('Job posting created successfully!');
    navigate('/company/jobs');
  };

  return (
    <CompanyLayout title="Create Job Posting">
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/company/jobs')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
                    <Input 
                      id="title" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Developer"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" value={company} disabled />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                      <Input 
                        id="location" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="type">Job Type</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input 
                      id="salary" 
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. $100,000 - $130,000"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="description" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the job role, responsibilities, and what the candidate will be doing..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="requirements">Requirements <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="requirements" 
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="List the qualifications, skills, and experience required for this position..."
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Keywords</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a skill or keyword" 
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddSkill} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-gray-400 hover:text-gray-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {skills.length === 0 && (
                      <p className="text-gray-500 text-sm">Add skills that are relevant to this position</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="active">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active (Published)</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/company/jobs')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-hirely hover:bg-hirely-dark"
                >
                  Create Job
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </CompanyLayout>
  );
};

export default CompanyJobCreate;
