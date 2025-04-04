
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

// Mock application data
const applications = [
  {
    id: 1,
    applicant: 'John Smith',
    email: 'john.smith@example.com',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    appliedDate: '2 days ago',
    status: 'New',
    score: 92,
  },
  {
    id: 2,
    applicant: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    jobTitle: 'UX Designer',
    company: 'TechCorp',
    appliedDate: '3 days ago',
    status: 'Reviewed',
    score: 86,
  },
  {
    id: 3,
    applicant: 'Michael Williams',
    email: 'michael.williams@example.com',
    jobTitle: 'DevOps Engineer',
    company: 'TechCorp',
    appliedDate: '4 days ago',
    status: 'Interviewed',
    score: 78,
  },
  {
    id: 4,
    applicant: 'Jessica Brown',
    email: 'jessica.brown@example.com',
    jobTitle: 'Product Manager',
    company: 'TechCorp',
    appliedDate: '1 week ago',
    status: 'Shortlisted',
    score: 88,
  },
  {
    id: 5,
    applicant: 'David Miller',
    email: 'david.miller@example.com',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    appliedDate: '1 week ago',
    status: 'Rejected',
    score: 65,
  },
];

const CompanyApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');

  // Get unique job titles for filter
  const jobTitles = Array.from(new Set(applications.map(app => app.jobTitle)));
  
  // Filter applications
  const filteredApplications = applications.filter(app => {
    // Search filter
    const matchesSearch = 
      app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    // Job filter
    const matchesJob = jobFilter === 'all' || app.jobTitle === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      New: "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200",
      Reviewed: "bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200",
      Interviewed: "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200",
      Shortlisted: "bg-green-50 text-green-700 hover:bg-green-50 border-green-200",
      Rejected: "bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200",
    };
    
    return (
      <Badge 
        variant="outline" 
        className={statusStyles[status as keyof typeof statusStyles] || ""}
      >
        {status}
      </Badge>
    );
  };

  return (
    <CompanyLayout title="Candidate Applications">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search applications..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Interviewed">Interviewed</SelectItem>
                <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobTitles.map(title => (
                  <SelectItem key={title} value={title}>{title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="px-4 py-3 font-medium">Job Position</th>
                  <th className="px-4 py-3 font-medium">Applied Date</th>
                  <th className="px-4 py-3 font-medium">Match Score</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{application.applicant}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{application.jobTitle}</td>
                    <td className="px-4 py-3 text-sm">{application.appliedDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-hirely h-2 rounded-full" 
                            style={{ width: `${application.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{application.score}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/company/applications/${application.id}`}>
                        <Button variant="outline" size="sm">Review</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredApplications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications found matching your search.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </CompanyLayout>
  );
};

export default CompanyApplications;
