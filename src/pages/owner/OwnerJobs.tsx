import { useState } from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent } from '@/components/ui/card';
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
  CheckCircle, 
  Ban,
  Clock,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { featuredJobs } from '@/data/jobs';
import { JobImportConfig } from '@/components/owner/JobImportConfig';
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';

// Type definitions for job data
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  description: string;
  category: string;
  active: boolean;
  featured: boolean;
  approved: boolean;
  companyName: string;
}

// Enhanced jobs data with additional control properties
const MOCK_JOBS: Job[] = featuredJobs.map(job => ({
  ...job,
  active: Math.random() > 0.2, // Random initial active state
  featured: Math.random() > 0.7, // Random initial featured state
  approved: Math.random() > 0.3, // Random initial approval state
  companyName: job.company,
}));

const OwnerJobs = () => {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleDeleteJob = (jobId: number) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    toast.success('Job deleted successfully');
  };
  
  const toggleJobStatus = (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, active: !job.active } : job
    ));
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast.success(`Job ${job.active ? 'deactivated' : 'activated'} successfully`);
    }
  };
  
  const toggleJobFeatured = (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, featured: !job.featured } : job
    ));
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast.success(`Job ${job.featured ? 'unfeatured' : 'featured'} successfully`);
    }
  };
  
  const toggleJobApproval = (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, approved: !job.approved } : job
    ));
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast.success(`Job ${job.approved ? 'unapproved' : 'approved'} successfully`);
    }
  };

  const handleExportJobs = () => {
    toast.success('Jobs data exported successfully');
    // In a real app, this would generate a CSV or Excel file
  };

  const handleImportComplete = () => {
    // Refresh the jobs list after import
    setJobs([...jobs]); // This will trigger a re-render
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <OwnerLayout title="Manage All Jobs">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search jobs..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Import Jobs
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px]">
                <SheetHeader>
                  <SheetTitle>Import Jobs</SheetTitle>
                  <SheetDescription>
                    Configure and run job imports from various sources
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <JobImportConfig onImportComplete={handleImportComplete} />
                </div>
              </SheetContent>
            </Sheet>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleExportJobs}
            >
              <Download className="h-4 w-4" />
              Export Jobs
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Add Job
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-gray-500">Total Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{jobs.filter(job => job.active).length}</p>
                <p className="text-gray-500">Active Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{jobs.filter(job => job.featured).length}</p>
                <p className="text-gray-500">Featured Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{jobs.filter(job => !job.approved).length}</p>
                <p className="text-gray-500">Pending Approval</p>
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
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Date Posted</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{job.title}</td>
                      <td className="px-4 py-3 text-sm">{job.company}</td>
                      <td className="px-4 py-3 text-sm">{job.location}</td>
                      <td className="px-4 py-3 text-sm">{job.postedDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className={job.active 
                            ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                            : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
                          }>
                            {job.active ? 'Active' : 'Inactive'}
                          </Badge>
                          
                          {job.featured && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
                              Featured
                            </Badge>
                          )}
                          
                          <Badge variant="outline" className={job.approved
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                            : "bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-200"
                          }>
                            {job.approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
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
                            <DropdownMenuItem asChild>
                              <a href={`/job/${job.id}`} className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                View Job
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => toggleJobStatus(job.id)}>
                              {job.active 
                                ? <Ban className="h-4 w-4 mr-2" />
                                : <CheckCircle className="h-4 w-4 mr-2" />
                              }
                              {job.active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => toggleJobFeatured(job.id)}>
                              {job.featured
                                ? <Ban className="h-4 w-4 mr-2" />
                                : <CheckCircle className="h-4 w-4 mr-2" />
                              }
                              {job.featured ? 'Unfeature' : 'Feature'}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => toggleJobApproval(job.id)}>
                              {job.approved
                                ? <Clock className="h-4 w-4 mr-2" />
                                : <CheckCircle className="h-4 w-4 mr-2" />
                              }
                              {job.approved ? 'Unapprove' : 'Approve'}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => handleDeleteJob(job.id)} className="text-red-600 focus:text-red-600">
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
              {filteredJobs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No jobs found matching your search.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
};

export default OwnerJobs;
