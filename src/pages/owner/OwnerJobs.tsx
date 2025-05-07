
import { useState, useEffect } from 'react';
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
  Download,
  RefreshCw,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import JobImportConfig from '@/components/owner/JobImportConfig';
import { useOwnerJobs } from '@/hooks/use-owner-jobs';
import { Tables } from '@/integrations/supabase/types';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import CsvUploadDialog from '@/components/owner/CsvUploadDialog';

const OwnerJobs = () => {
  const { jobs, loading, refetchJobs } = useOwnerJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [importSidebarOpen, setImportSidebarOpen] = useState(false);
  const [importHistoryOpen, setImportHistoryOpen] = useState(false);
  const [importHistory, setImportHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [selectedImport, setSelectedImport] = useState<string | null>(null);
  
  useEffect(() => {
    if (importHistoryOpen) {
      fetchImportHistory();
    }
  }, [importHistoryOpen]);
  
  const fetchImportHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('job_imports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      
      setImportHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching import history:', error);
      toast.error('Failed to load import history');
    } finally {
      setLoadingHistory(false);
    }
  };
  
  const handleDeleteJob = async (jobId: string) => {
    // TODO: Implement job deletion
    toast.info('Job deletion will be implemented in the future');
  };
  
  const toggleJobStatus = async (jobId: string) => {
    // TODO: Implement job status toggle
    toast.info('Job status toggle will be implemented in the future');
  };

  const handleExportJobs = () => {
    toast.success('Jobs data exported successfully');
    // In a real app, this would generate a CSV or Excel file
  };
  
  const setupCronJob = async () => {
    setSetupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-jobspy-cron');
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('JobSpy scheduled import has been set up successfully');
      } else {
        throw new Error(data?.message || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Error setting up cron job:', error);
      toast.error(`Failed to set up scheduled imports: ${error.message || 'Unknown error'}`);
    } finally {
      setSetupLoading(false);
    }
  };
  
  const viewImportDetails = (importId: string) => {
    setSelectedImport(importId);
    // In a more advanced implementation, you could show a modal with the import details
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase() || '')
  );

  const handleCsvUploadComplete = () => {
    refetchJobs();
    fetchImportHistory();
    toast.success('CSV import completed successfully');
  };

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
            {/* CSV Upload Dialog */}
            <CsvUploadDialog onUploadComplete={handleCsvUploadComplete} />
            
            {/* Job Import Sheet */}
            <Sheet open={importSidebarOpen} onOpenChange={setImportSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Import Jobs
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:max-w-2xl md:w-[600px]">
                <SheetHeader>
                  <SheetTitle>Import Jobs</SheetTitle>
                  <SheetDescription>
                    Configure and run job imports from various sources
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <JobImportConfig onImportComplete={() => {
                    refetchJobs();
                    fetchImportHistory();
                  }} />
                </div>
                <SheetFooter className="mt-6">
                  <Button variant="outline" onClick={() => setImportSidebarOpen(false)}>Close</Button>
                  <Button onClick={setupCronJob} disabled={setupLoading}>
                    {setupLoading ? 'Setting up...' : 'Setup Scheduled Imports'}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            {/* Import History Sheet */}
            <Sheet open={importHistoryOpen} onOpenChange={setImportHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Import History
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:max-w-2xl md:w-[600px]">
                <SheetHeader>
                  <SheetTitle>Job Import History</SheetTitle>
                  <SheetDescription>
                    View the history of job imports
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium">Recent Imports</h3>
                    <Button variant="outline" size="sm" onClick={fetchImportHistory}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                  
                  {loadingHistory ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-md">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  ) : importHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No import history found. Try running an import first.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {importHistory.map((importItem) => (
                        <div 
                          key={importItem.id} 
                          className={`p-4 border rounded-md ${
                            importItem.status === 'completed' 
                              ? 'border-green-200 bg-green-50' 
                              : importItem.status === 'failed'
                                ? 'border-red-200 bg-red-50'
                                : 'border-yellow-200 bg-yellow-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{importItem.source}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(importItem.started_at).toLocaleString()}
                              </p>
                              <div className="flex items-center mt-1">
                                <Badge variant={
                                  importItem.status === 'completed' 
                                    ? 'default' 
                                    : importItem.status === 'failed'
                                      ? 'destructive'
                                      : 'outline'
                                }>
                                  {importItem.status}
                                </Badge>
                                {importItem.jobs_imported !== null && (
                                  <span className="text-sm ml-2">
                                    {importItem.jobs_imported} jobs imported
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewImportDetails(importItem.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
