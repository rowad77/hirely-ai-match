
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
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Edit, Trash2, UserCheck, UserX, Shield } from 'lucide-react';
import { toast } from 'sonner';

// Mock users data
const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'candidate', active: true, joinedDate: '2023-05-10' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'candidate', active: true, joinedDate: '2023-06-15' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'candidate', active: false, joinedDate: '2023-07-22' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'candidate', active: true, joinedDate: '2023-08-05' },
  { id: '5', name: 'Platform Owner', email: 'owner@example.com', role: 'owner', active: true, joinedDate: '2023-01-01' },
];

const OwnerUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined Date</th>
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
                      <td className="px-4 py-3 text-sm">{user.joinedDate}</td>
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
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
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
    </OwnerLayout>
  );
};

export default OwnerUsers;
