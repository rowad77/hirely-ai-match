
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';

interface ApplicationTabsProps {
  application: any; // Replace with proper type
}

const ApplicationTabs = ({ application }: ApplicationTabsProps) => {
  return (
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
                {application.skills.map((skill: string, index: number) => (
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
              {application.experience.map((exp: any, index: number) => (
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
          {application.videoAnswers.map((answer: any, index: number) => (
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
                    {application.aiInsights.map((insight: string, index: number) => (
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
  );
};

export default ApplicationTabs;
