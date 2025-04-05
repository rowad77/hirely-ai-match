
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
  UserCheck, 
  UserX, 
  Shield, 
  Eye, 
  BarChart2, 
  Clock
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

// Enhanced mock users data with activity information
const MOCK_USERS = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john.doe@example.com', 
    role: 'candidate', 
    active: true, 
    joinedDate: '2023-05-10',
    lastLogin: '2025-04-01 09:23:15',
    location: 'New York, USA',
    applications: 12,
    profileCompleteness: 85,
    activity: [
      { type: 'login', date: '2025-04-01 09:23:15', details: 'Logged in from Chrome on Windows' },
      { type: 'application', date: '2025-03-30 14:45:00', details: 'Applied to Software Engineer at Google' },
      { type: 'profile_update', date: '2025-03-28 11:20:30', details: 'Updated resume and skills' }
    ]
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com', 
    role: 'candidate', 
    active: true, 
    joinedDate: '2023-06-15',
    lastLogin: '2025-04-03 15:45:20',
    location: 'San Francisco, USA',
    applications: 8,
    profileCompleteness: 92,
    activity: [
      { type: 'login', date: '2025-04-03 15:45:20', details: 'Logged in from Firefox on MacOS' },
      { type: 'application', date: '2025-04-02 10:30:00', details: 'Applied to Product Manager at Apple' },
      { type: 'profile_update', date: '2025-03-25 16:10:45', details: 'Updated portfolio and projects' }
    ]
  },
  { 
    id: '3', 
    name: 'Bob Johnson', 
    email: 'bob@example.com', 
    role: 'candidate', 
    active: false, 
    joinedDate: '2023-07-22',
    lastLogin: '2025-02-15 08:10:05',
    location: 'Chicago, USA',
    applications: 3,
    profileCompleteness: 45,
    activity: [
      { type: 'login', date: '2025-02-15 08:10:05', details: 'Logged in from Safari on iPad' },
      { type: 'application', date: '2025-02-10 13:25:10', details: 'Applied to Data Analyst at Netflix' }
    ]
  },
  { 
    id: '4', 
    name: 'Alice Williams', 
    email: 'alice@example.com', 
    role: 'candidate', 
    active: true, 
    joinedDate: '2023-08-05',
    lastLogin: '2025-04-02 12:30:45',
    location: 'Seattle, USA',
    applications: 5,
    profileCompleteness: 75,
    activity: [
      { type: 'login', date: '2025-04-02 12:30:45', details: 'Logged in from Chrome on Android' },
      { type: 'application', date: '2025-04-01 09:15:30', details: 'Applied to UX Designer at Microsoft' },
      { type: 'profile_update', date: '2025-03-29 14:20:15', details: 'Updated contact information' }
    ]
  },
  { 
    id: '5', 
    name: 'Platform Owner', 
    email: 'owner@example.com', 
    role: 'owner', 
    active: true, 
    joinedDate: '2023-01-01',
    lastLogin: '2025-04-05 10:00:00',
    location: 'Austin, USA',
    applications: 0,
    profileCompleteness: 100,
    activity: [
      { type: 'login', date: '2025-04-05 10:00:00', details: 'Logged in from Chrome on Windows' },
      { type: 'system', date: '2025-04-04 16:45:30', details: 'Updated system settings' },
      { type: 'system', date: '2025-04-03 11:20:15', details: 'Added new job category' }
    ]
  },
];

const OwnerUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  };
  
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast.success(`User ${user.active ? 'deactivated' : 'activated'} successfully`);
    }
  };

  const changeUserRole = (userId: string, newRole: 'candidate' | 'company' | 'owner') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    toast.success(`User role changed to ${newRole} successfully`);
  };

  const viewUserActivity = (user) => {
    setSelectedUser(user);
    setShowActivityDialog(true);
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityIcon = (type) => {
    switch(type) {
      case 'login': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'application': return <BarChart2 className="h-4 w-4 text-green-500" />;
      case 'profile_update': return <Edit className="h-4 w-4 text-orange-500" />;
      case 'system': return <Shield className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <OwnerLayout title="Manage Users">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search users..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{users.length}</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{users.filter(user => user.active).length}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Candidates</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{users.filter(user => user.role === 'candidate').length}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Companies</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{users.filter(user => user.role === 'company').length}</h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-orange-600" />
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
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Last Login</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline" className={
                          user.role === 'owner' 
                            ? "bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200"
                            : user.role === 'company'
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                            : "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                        }>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{user.location}</td>
                      <td className="px-4 py-3 text-sm">{user.lastLogin}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline" className={user.active 
                          ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                          : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
                        }>
                          {user.active ? 'Active' : 'Inactive'}
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
                            <DropdownMenuItem onClick={() => viewUserActivity(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.role !== 'owner' && (
                              <>
                                <DropdownMenuItem onClick={() => changeUserRole(user.id, 'candidate')}>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Set as Candidate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeUserRole(user.id, 'company')}>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Set as Company
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeUserRole(user.id, 'owner')}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Owner
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                              {user.active 
                                ? <UserX className="h-4 w-4 mr-2" />
                                : <UserCheck className="h-4 w-4 mr-2" />
                              }
                              {user.active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            {user.role !== 'owner' && (
                              <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found matching your search.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">User Activity - {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              View detailed user activity history
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Email</div>
                    <div className="mt-1">{selectedUser.email}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Joined Date</div>
                    <div className="mt-1">{selectedUser.joinedDate}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-gray-500">Applications</div>
                    <div className="mt-1">{selectedUser.applications}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Completeness */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Profile Completeness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${selectedUser.profileCompleteness}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1 text-sm text-gray-500">
                    {selectedUser.profileCompleteness}%
                  </div>
                </CardContent>
              </Card>

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
                      {selectedUser.activity.map((activity, index) => (
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

export default OwnerUsers;
