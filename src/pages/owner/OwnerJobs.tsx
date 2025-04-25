
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
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet';
import { JobImportConfig } from '@/components/owner/JobImportConfig';
import { useOwnerJobs } from '@/hooks/use-owner-jobs';
import { Tables } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';

const OwnerJobs = () => {
  const { jobs, loading, refetchJobs } = useOwnerJobs();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleDeleteJob = async (jobId: string) => {
    // TODO: Implement job deletion
  };
  
  const toggleJobStatus = async (jobId: string) => {
    // TODO: Implement job status toggle
  };

  const handleExportJobs = () => {
    toast.success('Jobs data exported successfully');
    // In a real app, this would generate a CSV or Excel file
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase() || '')
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
                  <JobImportConfig onImportComplete={refetchJobs} />
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
        
        {/* Stats Cards */}
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
                <p className="text-2xl font-bold">{jobs.filter(job => job.status === 'active').length}</p>
                <p className="text-gray-500">Active Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{jobs.filter(job => job.is_featured).length}</p>
                <p className="text-gray-500">Featured Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{jobs.filter(job => !job.is_approved).length}</p>
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
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td colSpan={6} className="px-4 py-3">
                          <Skeleton className="h-8 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No jobs found. Try importing some jobs or creating a new one.
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{job.title}</td>
                        <td className="px-4 py-3 text-sm">{job.api_source || 'Manual'}</td>
                        <td className="px-4 py-3 text-sm">{job.location || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{new Date(job.posted_date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className={job.status === 'active'
                              ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                              : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
                            }>
                              {job.status}
                            </Badge>
                            
                            {job.is_featured && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
                                Featured
                              </Badge>
                            )}
                            
                            <Badge variant="outline" className={job.is_approved
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                              : "bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-200"
                            }>
                              {job.is_approved ? 'Approved' : 'Pending'}
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
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
};

export default OwnerJobs;
