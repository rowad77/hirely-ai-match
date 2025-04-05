
import { useState } from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Ban, 
  CheckCircle, 
  Building, 
  Users, 
  Briefcase,
  Clock,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Enhanced mock companies data with activity and additional metrics
const MOCK_COMPANIES = [
  { 
    id: '1', 
    name: 'Acme Inc', 
    email: 'company@example.com', 
    jobs: 12, 
    active: true, 
    joinedDate: '2023-06-15',
    lastActive: '2025-04-02 14:35:10',
    location: 'New York, USA',
    industry: 'Technology',
    size: '50-200 employees',
    website: 'https://acme.example.com',
    description: 'Leading technology solutions company specializing in AI and machine learning.',
    logo: '/placeholder.svg',
    subscriptionPlan: 'Enterprise',
    applicationsReceived: 145,
    hires: 8,
    averageResponseTime: '2 days',
    activity: [
      { type: 'job_posted', date: '2025-04-01 09:12:45', details: 'Posted new job: Senior Developer' },
      { type: 'login', date: '2025-04-02 14:35:10', details: 'Company admin logged in' },
      { type: 'application_reviewed', date: '2025-03-30 11:20:00', details: 'Reviewed 5 applications for Product Manager role' }
    ]
  },
  { 
    id: '2', 
    name: 'TechCorp', 
    email: 'info@techcorp.com', 
    jobs: 8, 
    active: true, 
    joinedDate: '2023-07-22',
    lastActive: '2025-04-03 10:15:30',
    location: 'San Francisco, USA',
    industry: 'Software Development',
    size: '10-50 employees',
    website: 'https://techcorp.example.com',
    description: 'Innovative software development company focused on web applications.',
    logo: '/placeholder.svg',
    subscriptionPlan: 'Professional',
    applicationsReceived: 87,
    hires: 5,
    averageResponseTime: '1 day',
    activity: [
      { type: 'job_posted', date: '2025-04-02 16:40:22', details: 'Posted new job: Frontend Developer' },
      { type: 'login', date: '2025-04-03 10:15:30', details: 'Company admin logged in' },
      { type: 'candidate_contacted', date: '2025-04-01 13:22:45', details: 'Contacted candidate John Doe for interview' }
    ]
  },
  { 
    id: '3', 
    name: 'Globex', 
    email: 'hr@globex.com', 
    jobs: 5, 
    active: true, 
    joinedDate: '2023-08-10',
    lastActive: '2025-04-01 09:30:45',
    location: 'Chicago, USA',
    industry: 'Finance',
    size: '500+ employees',
    website: 'https://globex.example.com',
    description: 'Global financial services company providing innovative solutions worldwide.',
    logo: '/placeholder.svg',
    subscriptionPlan: 'Enterprise',
    applicationsReceived: 210,
    hires: 12,
    averageResponseTime: '3 days',
    activity: [
      { type: 'job_updated', date: '2025-03-31 15:10:20', details: 'Updated job posting: Financial Analyst' },
      { type: 'login', date: '2025-04-01 09:30:45', details: 'Company admin logged in' },
      { type: 'candidate_hired', date: '2025-03-28 14:22:15', details: 'Hired Maria Johnson as Data Scientist' }
    ]
  },
  { 
    id: '4', 
    name: 'Initech', 
    email: 'careers@initech.com', 
    jobs: 3, 
    active: false, 
    joinedDate: '2023-09-05',
    lastActive: '2025-03-15 11:45:30',
    location: 'Austin, USA',
    industry: 'IT Services',
    size: '10-50 employees',
    website: 'https://initech.example.com',
    description: 'IT services and consulting company specializing in business solutions.',
    logo: '/placeholder.svg',
    subscriptionPlan: 'Standard',
    applicationsReceived: 45,
    hires: 2,
    averageResponseTime: '5 days',
    activity: [
      { type: 'login', date: '2025-03-15 11:45:30', details: 'Company admin logged in' },
      { type: 'job_posted', date: '2025-03-14 10:20:15', details: 'Posted new job: System Administrator' },
      { type: 'candidate_rejected', date: '2025-03-12 14:30:25', details: 'Rejected candidate for Developer role' }
    ]
  },
  { 
    id: '5', 
    name: 'Stark Industries', 
    email: 'jobs@stark.com', 
    jobs: 15, 
    active: true, 
    joinedDate: '2023-05-30',
    lastActive: '2025-04-05 16:22:10',
    location: 'Los Angeles, USA',
    industry: 'Engineering & Manufacturing',
    size: '200-500 employees',
    website: 'https://stark.example.com',
    description: 'Innovative engineering and manufacturing company focused on renewable energy.',
    logo: '/placeholder.svg',
    subscriptionPlan: 'Enterprise',
    applicationsReceived: 230,
    hires: 15,
    averageResponseTime: '1 day',
    activity: [
      { type: 'login', date: '2025-04-05 16:22:10', details: 'Company admin logged in' },
      { type: 'job_posted', date: '2025-04-04 11:30:45', details: 'Posted new job: Mechanical Engineer' },
      { type: 'interview_scheduled', date: '2025-04-03 15:15:30', details: 'Scheduled interview with 3 candidates for Product Designer' }
    ]
  },
];

const OwnerCompanies = () => {
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  
  const handleDeleteCompany = (companyId: string) => {
    setCompanies(companies.filter(company => company.id !== companyId));
    toast.success('Company deleted successfully');
  };
  
  const toggleCompanyStatus = (companyId: string) => {
    setCompanies(companies.map(company => 
      company.id === companyId ? { ...company, active: !company.active } : company
    ));
    
    const company = companies.find(c => c.id === companyId);
    if (company) {
      toast.success(`Company ${company.active ? 'deactivated' : 'activated'} successfully`);
    }
  };

  const viewCompanyDetails = (company) => {
    setSelectedCompany(company);
    setShowCompanyDialog(true);
  };
  
  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityIcon = (type) => {
    switch(type) {
      case 'job_posted': return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'login': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'application_reviewed': return <Eye className="h-4 w-4 text-purple-500" />;
      case 'candidate_contacted': return <Users className="h-4 w-4 text-orange-500" />;
      case 'candidate_hired': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'job_updated': return <Edit className="h-4 w-4 text-blue-500" />;
      case 'candidate_rejected': return <Ban className="h-4 w-4 text-red-500" />;
      case 'interview_scheduled': return <Zap className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <OwnerLayout title="Manage Companies">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search companies..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Add Company
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Companies</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{companies.length}</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Companies</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{companies.filter(company => company.active).length}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{companies.reduce((total, company) => total + company.jobs, 0)}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Hires</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{companies.reduce((total, company) => total + company.hires, 0)}</h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Industry</th>
                    <th className="px-4 py-3 font-medium">Jobs</th>
                    <th className="px-4 py-3 font-medium">Last Active</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{company.name}</td>
                      <td className="px-4 py-3 text-sm">{company.email}</td>
                      <td className="px-4 py-3 text-sm">{company.industry}</td>
                      <td className="px-4 py-3 text-sm">{company.jobs}</td>
                      <td className="px-4 py-3 text-sm">{company.lastActive}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline" className={company.active 
                          ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                          : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
                        }>
                          {company.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewCompanyDetails(company)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleCompanyStatus(company.id)}>
                              {company.active 
                                ? <Ban className="h-4 w-4 mr-2" />
                                : <CheckCircle className="h-4 w-4 mr-2" />
                              }
                              {company.active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteCompany(company.id)} className="text-red-600 focus:text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCompanies.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No companies found matching your search.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Details Dialog */}
      <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Company Details - {selectedCompany?.name}</DialogTitle>
            <DialogDescription>
              View detailed company information and activity
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Profile */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={selectedCompany.logo} 
                      alt={selectedCompany.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p>{selectedCompany.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Website</p>
                          <p className="truncate">{selectedCompany.website}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p>{selectedCompany.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Size</p>
                          <p>{selectedCompany.size}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Joined</p>
                          <p>{selectedCompany.joinedDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Subscription</p>
                          <p>{selectedCompany.subscriptionPlan}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                      <p className="text-sm">{selectedCompany.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Company Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium text-gray-500">Jobs Posted</p>
                    <p className="text-3xl font-bold mt-2">{selectedCompany.jobs}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium text-gray-500">Applications</p>
                    <p className="text-3xl font-bold mt-2">{selectedCompany.applicationsReceived}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium text-gray-500">Hires</p>
                    <p className="text-3xl font-bold mt-2">{selectedCompany.hires}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCompany.activity.map((activity, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center">
                              {getActivityIcon(activity.type)}
                              <span className="ml-2 capitalize">
                                {activity.type.replace('_', ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{activity.details}</TableCell>
                          <TableCell className="text-right">{activity.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </OwnerLayout>
  );
};

export default OwnerCompanies;
