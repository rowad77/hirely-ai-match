
import { useState, useEffect } from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

type CompanyProfile = {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  company_name?: string;
};

const CompanyApprovals = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pending company approvals
  useEffect(() => {
    const fetchPendingCompanies = async () => {
      setIsLoading(true);
      try {
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) throw usersError;

        // Filter users with role 'company' and approval_status 'pending'
        const companyUsers = usersData.users.filter(user => 
          user.user_metadata && 
          user.user_metadata.role === 'company' && 
          (user.user_metadata.approval_status === 'pending' || !user.user_metadata.approval_status)
        );

        const profiles = companyUsers.map(user => ({
          id: user.id,
          user_id: user.id,
          email: user.email || 'Unknown',
          full_name: user.user_metadata?.full_name || 'Unknown',
          approval_status: (user.user_metadata?.approval_status as 'pending' | 'approved' | 'rejected') || 'pending',
          created_at: user.created_at,
          company_name: user.user_metadata?.company_name
        }));

        setCompanies(profiles);
      } catch (error: any) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load pending companies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingCompanies();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { approval_status: 'approved' }
      });

      setCompanies(companies.map(company => 
        company.id === userId 
          ? { ...company, approval_status: 'approved' }
          : company
      ));

      toast.success('Company approved successfully');
    } catch (error) {
      console.error('Error approving company:', error);
      toast.error('Failed to approve company');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { approval_status: 'rejected' }
      });

      setCompanies(companies.map(company => 
        company.id === userId 
          ? { ...company, approval_status: 'rejected' }
          : company
      ));

      toast.success('Company rejected');
    } catch (error) {
      console.error('Error rejecting company:', error);
      toast.error('Failed to reject company');
    }
  };

  return (
    <OwnerLayout title="Company Approvals">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pending Company Approvals</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading pending approvals...</div>
        ) : companies.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No pending company approvals at this time
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.full_name || company.company_name || 'Unknown'}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(company.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(company.id)} 
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </OwnerLayout>
  );
};

export default CompanyApprovals;
