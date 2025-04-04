
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Video, 
  UserCheck, 
  Mail, 
  Phone 
} from 'lucide-react';
import { toast } from 'sonner';

const CompanyApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState('New');
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  
  // Mock application data for the selected application id
  const application = {
    id: parseInt(id || '1'),
    applicant: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    salary: '$120,000 - $150,000',
    appliedDate: '2023-04-02',
    status: applicationStatus,
    resumeUrl: '/placeholder.svg',
    coverLetter: 'I am excited to apply for the Senior Frontend Developer position at TechCorp. With over 5 years of experience in React, TypeScript, and modern frontend frameworks, I believe I have the skills and expertise to contribute to your team and help build exceptional user experiences.',
    score: 92,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Node.js'],
    education: 'Bachelor of Science in Computer Science, Stanford University',
    experience: [
      {
        role: 'Frontend Developer',
        company: 'Tech Solutions Inc.',
        period: 'Jan 2020 - Present',
        description: 'Lead frontend development for multiple client projects, focusing on React, TypeScript, and state management solutions.'
      },
      {
        role: 'Junior Developer',
        company: 'WebApps Co.',
        period: 'Jun 2018 - Dec 2019',
        description: 'Contributed to the development of responsive web applications using React and JavaScript.'
      }
    ],
    videoAnswers: [
      {
        question: 'Tell us about yourself and your experience with similar roles.',
        videoUrl: '#'
      },
      {
        question: 'What are your strengths and how would they contribute to this position?',
        videoUrl: '#'
      },
      {
        question: 'Describe a challenging situation you faced at work and how you handled it.',
        videoUrl: '#'
      }
    ],
    aiInsights: [
      'Strong problem-solving skills demonstrated in past projects',
      'Excellent communication skills evident in video interviews',
      'Experience with required tech stack is above average',
      'Candidate shows leadership potential based on past roles',
      'Cultural fit score: 88%'
    ]
  };

  const handleStatusChange = (newStatus: string) => {
    setApplicationStatus(newStatus);
    toast.success(`Application status updated to ${newStatus}`);
  };
  
  const handleSendInterviewInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInterviewDialogOpen(false);
    toast.success('Interview invitation sent successfully!');
  };

  return (
    <CompanyLayout title="Application Review">
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/company/applications')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Application: {application.jobTitle}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Applicant Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-2">
                    <span className="text-2xl font-medium text-gray-600">
                      {application.applicant.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium">{application.applicant}</h3>
                  <div className="flex justify-center items-center mt-1 text-gray-500 space-x-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{application.email}</span>
                  </div>
                  <div className="flex justify-center items-center mt-1 text-gray-500 space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{application.phone}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Match Score</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-hirely h-2 rounded-full" 
                        style={{ width: `${application.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{application.score}%</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Application Status</h4>
                  <Select value={applicationStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Reviewed">Reviewed</SelectItem>
                      <SelectItem value="Interviewed">Interviewed</SelectItem>
                      <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Applied For</h4>
                  <div className="text-sm">
                    <p className="font-medium">{application.jobTitle}</p>
                    <p className="text-gray-500">{application.company}</p>
                    <p className="text-gray-500">{application.salary}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Application Date</h4>
                  <div className="text-sm">
                    {application.appliedDate}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Documents</h4>
                  <a 
                    href={application.resumeUrl} 
                    download 
                    className="flex items-center text-sm text-hirely hover:underline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-4 space-y-3">
              <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-hirely hover:bg-hirely-dark">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Schedule an Interview</DialogTitle>
                    <DialogDescription>
                      Send an interview invitation to {application.applicant}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSendInterviewInvite}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="interview-type">Interview Type</Label>
                        <Select defaultValue="video">
                          <SelectTrigger id="interview-type">
                            <SelectValue placeholder="Select interview type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video Interview</SelectItem>
                            <SelectItem value="phone">Phone Interview</SelectItem>
                            <SelectItem value="in-person">In-Person Interview</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="interview-date">Date</Label>
                        <Input
                          id="interview-date"
                          type="date"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="interview-time">Start Time</Label>
                          <Input
                            id="interview-time"
                            type="time"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="interview-duration">Duration</Label>
                          <Select defaultValue="60">
                            <SelectTrigger id="interview-duration">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="interview-message">Message</Label>
                        <Textarea
                          id="interview-message"
                          placeholder="Add a personal message to the candidate..."
                          rows={3}
                          defaultValue={`Hi ${application.applicant.split(' ')[0]}, we'd like to invite you for an interview for the ${application.jobTitle} position. Please confirm if you're available at the suggested time.`}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-hirely hover:bg-hirely-dark">
                        Send Interview Invitation
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full">
                <UserCheck className="h-4 w-4 mr-2" />
                Move to Shortlist
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-green-600 border-green-600 hover:bg-green-50">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="resume" className="flex-1">Resume</TabsTrigger>
                <TabsTrigger value="video" className="flex-1">Video Interview</TabsTrigger>
                <TabsTrigger value="insights" className="flex-1">AI Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cover Letter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{application.coverLetter}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recruiter Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add notes about this candidate..."
                      className="min-h-[100px]"
                    />
                    <Button className="mt-4 bg-hirely hover:bg-hirely-dark">Save Notes</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="resume" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {application.experience.map((exp, index) => (
                      <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                        <h4 className="font-medium text-lg">{exp.role}</h4>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{exp.company}</span>
                          <span>{exp.period}</span>
                        </div>
                        <p className="mt-2 text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{application.education}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="video" className="mt-4 space-y-6">
                {application.videoAnswers.map((answer, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base">Q{index + 1}: {answer.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-white flex flex-col items-center">
                          <Video className="h-12 w-12 mb-2" />
                          <p>Video Response</p>
                          <Button variant="outline" className="mt-4 text-white border-white/30 hover:bg-white/10">
                            Play Video
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="insights" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Candidate Analysis</CardTitle>
                    <CardDescription>
                      Our AI has analyzed this candidate's resume and video responses to provide these insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Key Strengths</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {application.aiInsights.map((insight, index) => (
                            <li key={index} className="text-gray-700">{insight}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-2">Skills Match Analysis</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Technical Skills</span>
                              <span>95%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Communication Skills</span>
                              <span>88%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Experience Relevance</span>
                              <span>92%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Cultural Fit</span>
                              <span>85%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-2">AI Recommendation</h3>
                        <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                          <p className="font-medium">Highly Recommended for Interview</p>
                          <p className="mt-1 text-sm">This candidate's skills and experience align well with the job requirements. Consider scheduling a technical interview to further assess their capabilities.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyApplicationDetail;
