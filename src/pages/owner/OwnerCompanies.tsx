
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
import { Search, MoreVertical, Edit, Trash2, Eye, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

// Mock companies data
const MOCK_COMPANIES = [
  { id: '1', name: 'Acme Inc', email: 'company@example.com', jobs: 12, active: true, joinedDate: '2023-06-15' },
  { id: '2', name: 'TechCorp', email: 'info@techcorp.com', jobs: 8, active: true, joinedDate: '2023-07-22' },
  { id: '3', name: 'Globex', email: 'hr@globex.com', jobs: 5, active: true, joinedDate: '2023-08-10' },
  { id: '4', name: 'Initech', email: 'careers@initech.com', jobs: 3, active: false, joinedDate: '2023-09-05' },
  { id: '5', name: 'Stark Industries', email: 'jobs@stark.com', jobs: 15, active: true, joinedDate: '2023-05-30' },
];

const OwnerCompanies = () => {
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Jobs</th>
                    <th className="px-4 py-3 font-medium">Joined Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{company.name}</td>
                      <td className="px-4 py-3 text-sm">{company.email}</td>
                      <td className="px-4 py-3 text-sm">{company.jobs}</td>
                      <td className="px-4 py-3 text-sm">{company.joinedDate}</td>
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
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
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
    </OwnerLayout>
  );
};

export default OwnerCompanies;
