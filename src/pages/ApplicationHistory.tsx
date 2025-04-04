
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowRight, Building, MapPin, Calendar, Briefcase } from 'lucide-react';

// Mock data for application history
const applications = [
  {
    id: 1,
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    appliedDate: '2023-04-01',
    status: 'In Review',
    type: 'Full-time',
    logo: 'https://via.placeholder.com/40',
  },
  {
    id: 2,
    jobTitle: 'UX Designer',
    company: 'DesignHub',
    location: 'Remote',
    appliedDate: '2023-03-25',
    status: 'Interview Scheduled',
    type: 'Full-time',
    logo: 'https://via.placeholder.com/40',
  },
  {
    id: 3,
    jobTitle: 'Product Manager',
    company: 'GrowthStartup',
    location: 'New York, NY',
    appliedDate: '2023-03-20',
    status: 'Rejected',
    type: 'Full-time',
    logo: 'https://via.placeholder.com/40',
  },
  {
    id: 4,
    jobTitle: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Austin, TX',
    appliedDate: '2023-03-15',
    status: 'Offered',
    type: 'Contract',
    logo: 'https://via.placeholder.com/40',
  },
  {
    id: 5,
    jobTitle: 'Backend Developer',
    company: 'DataSystems',
    location: 'Seattle, WA',
    appliedDate: '2023-03-10',
    status: 'In Review',
    type: 'Full-time',
    logo: 'https://via.placeholder.com/40',
  },
];

const ApplicationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredApplications = applications.filter(app => {
    // Apply search filter
    const matchesSearch = 
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply tab filter
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && !['Rejected', 'Withdrawn'].includes(app.status);
    if (activeTab === 'interviews') return matchesSearch && ['Interview Scheduled', 'Interview Completed'].includes(app.status);
    if (activeTab === 'offers') return matchesSearch && app.status === 'Offered';
    if (activeTab === 'rejected') return matchesSearch && app.status === 'Rejected';
    
    return matchesSearch;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">{status}</Badge>;
      case 'Interview Scheduled':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200">{status}</Badge>;
      case 'Interview Completed':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-200">{status}</Badge>;
      case 'Offered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">{status}</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">{status}</Badge>;
      case 'Withdrawn':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Applications</h1>
            <p className="mt-2 text-gray-600">Track and manage your job applications</p>
          </div>
          <Link to="/jobs">
            <Button className="mt-4 sm:mt-0 bg-hirely hover:bg-hirely-dark">
              Browse Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search applications..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-10">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
                    <p className="mt-1 text-gray-500">We couldn't find any applications matching your search.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredApplications.map((application) => (
                      <div key={application.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                            <Building className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{application.jobTitle}</h3>
                            <div className="text-gray-500">{application.company}</div>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                              <div className="flex items-center text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                {application.location}
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(application.appliedDate)}
                              </div>
                              <Badge variant="outline">{application.type}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end mt-4 md:mt-0">
                          {getStatusBadge(application.status)}
                          <Link to={`/application/${application.id}`} className="mt-3">
                            <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            {/* Same structure as "all" tab */}
          </TabsContent>
          
          <TabsContent value="interviews" className="mt-0">
            {/* Same structure as "all" tab */}
          </TabsContent>
          
          <TabsContent value="offers" className="mt-0">
            {/* Same structure as "all" tab */}
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-0">
            {/* Same structure as "all" tab */}
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Application Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-hirely">{applications.length}</div>
                <div className="text-gray-500">Total Applications</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">2</div>
                <div className="text-gray-500">Interview Invitations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600">40%</div>
                <div className="text-gray-500">Response Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplicationHistory;
