
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Briefcase, Users, Settings, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');

  const jobs = [
    { id: 1, title: 'Senior Frontend Developer', location: 'Remote', applicants: 24, date: '2 days ago', active: true },
    { id: 2, title: 'Product Manager', location: 'New York, NY', applicants: 15, date: '4 days ago', active: true },
    { id: 3, title: 'UX Designer', location: 'San Francisco, CA', applicants: 32, date: '1 week ago', active: true },
    { id: 4, title: 'Backend Engineer', location: 'Remote', applicants: 18, date: '2 weeks ago', active: false },
  ];

  const candidates = [
    { id: 1, name: 'Alex Johnson', position: 'Senior Frontend Developer', score: 92, status: 'Interview', date: '2 days ago' },
    { id: 2, name: 'Sara Wilson', position: 'Product Manager', score: 88, status: 'Review', date: '3 days ago' },
    { id: 3, name: 'Michael Chen', position: 'UX Designer', score: 95, status: 'Interview', date: '1 week ago' },
    { id: 4, name: 'Emily Rodriguez', position: 'Backend Engineer', score: 79, status: 'Applied', date: '2 weeks ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/" className="flex items-center">
                <span className="text-hirely-dark font-bold text-xl">hirely</span>
                <span className="text-hirely-accent font-bold">.</span>
              </Link>
            </div>
            <div className="mt-10">
              <nav className="flex-1 px-2 space-y-1">
                <Link to="/dashboard" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-hirely-lightgray text-hirely-dark">
                  <Briefcase className="mr-3 h-5 w-5" />
                  Jobs
                </Link>
                <Link to="/dashboard/candidates" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-hirely-dark">
                  <Users className="mr-3 h-5 w-5" />
                  Candidates
                </Link>
                <Link to="/dashboard/settings" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-hirely-dark">
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top navbar */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">
                <div className="w-full flex md:ml-0">
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="h-5 w-5" />
                    </div>
                    <Input 
                      type="search"
                      placeholder="Search jobs, candidates..."
                      className="block w-full pl-10 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="hidden md:block mr-3 text-sm font-medium text-gray-700">
                      Company Name
                    </span>
                    <div className="h-8 w-8 rounded-full bg-hirely-dark flex items-center justify-center text-white font-medium">
                      C
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <Link to="/dashboard/create-job">
                  <Button className="bg-hirely hover:bg-hirely-dark">
                    <Plus className="mr-2 h-4 w-4" /> Create Job
                  </Button>
                </Link>
              </div>
              
              <div className="mb-8">
                <Tabs defaultValue="jobs" className="w-full">
                  <TabsList>
                    <TabsTrigger value="jobs" onClick={() => setActiveTab('jobs')}>Jobs</TabsTrigger>
                    <TabsTrigger value="candidates" onClick={() => setActiveTab('candidates')}>Candidates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="jobs">
                    <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                      {jobs.map(job => (
                        <Card key={job.id} className={job.active ? "" : "opacity-70"}>
                          <CardHeader>
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription>{job.location}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Posted {job.date}</span>
                              <span className="text-sm font-medium text-hirely">{job.applicants} applicants</span>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Link to={`/dashboard/jobs/${job.id}`}>
                              <Button variant="outline">View Details</Button>
                            </Link>
                            <span className={`px-2 py-1 text-xs rounded-full ${job.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                              {job.active ? "Active" : "Closed"}
                            </span>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="candidates">
                    <div className="overflow-x-auto mt-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Candidate
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Position
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              AI Score
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Applied
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {candidates.map((candidate) => (
                            <tr key={candidate.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    {candidate.name.charAt(0)}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{candidate.position}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${candidate.score > 90 ? 'text-green-600' : candidate.score > 80 ? 'text-blue-600' : 'text-yellow-600'}`}>
                                  {candidate.score}%
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${candidate.status === 'Interview' ? 'bg-green-100 text-green-800' : 
                                    candidate.status === 'Review' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-yellow-100 text-yellow-800'}`}>
                                  {candidate.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {candidate.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link to={`/dashboard/candidates/${candidate.id}`} className="text-hirely hover:text-hirely-dark">
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
