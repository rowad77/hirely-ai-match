
import React, { useState } from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOwnerJobs } from '@/hooks/use-owner-jobs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, FileText, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CsvUploadDialog from '@/components/owner/CsvUploadDialog';
import TestUsersCreator from '@/components/owner/TestUsersCreator';

const OwnerJobs = () => {
  const { jobs, isLoading, error, refresh } = useOwnerJobs();
  const [showTestUsers, setShowTestUsers] = useState(false);

  if (isLoading) {
    return (
      <OwnerLayout title="Jobs Management">
        <div className="flex items-center justify-center h-64">
          <p>Loading jobs...</p>
        </div>
      </OwnerLayout>
    );
  }

  if (error) {
    return (
      <OwnerLayout title="Jobs Management">
        <Alert variant="destructive" className="max-w-3xl mx-auto my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading jobs: {error.message}</AlertDescription>
        </Alert>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title="Jobs Management">
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Jobs Management</h1>
            <div className="flex gap-3">
              <CsvUploadDialog onUploadComplete={refresh} />
              <Button variant="outline" onClick={() => setShowTestUsers(!showTestUsers)}>
                {showTestUsers ? 'Hide Test Users' : 'Create Test Users'}
              </Button>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Job Manually
              </Button>
            </div>
          </div>

          {showTestUsers && (
            <div className="mb-6">
              <TestUsersCreator />
            </div>
          )}

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="imports">Import History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No jobs found. Import jobs using CSV or create them manually.
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.company_name || 'Unknown'}</TableCell>
                          <TableCell>{job.location || 'Remote'}</TableCell>
                          <TableCell>{new Date(job.posted_date).toLocaleDateString()}</TableCell>
                          <TableCell>{job.status}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.filter(job => job.status === 'active').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No active jobs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobs
                        .filter(job => job.status === 'active')
                        .map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.company_name || 'Unknown'}</TableCell>
                            <TableCell>{job.location || 'Remote'}</TableCell>
                            <TableCell>{new Date(job.posted_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.filter(job => job.status !== 'active').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No inactive jobs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobs
                        .filter(job => job.status !== 'active')
                        .map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.company_name || 'Unknown'}</TableCell>
                            <TableCell>{job.location || 'Remote'}</TableCell>
                            <TableCell>{new Date(job.posted_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="imports">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Job Import History</span>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Jobs Processed</TableHead>
                        <TableHead>Jobs Imported</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No import history available yet.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerJobs;
