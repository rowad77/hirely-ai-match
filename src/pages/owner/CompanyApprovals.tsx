
import { useState, useEffect } from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Check, X, Eye, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

type CompanyRequest = {
  id: string;
  email: string;
  company_name: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  role: string;
};

const CompanyApprovals = () => {
  const { t } = useLanguage();
  const [companyRequests, setCompanyRequests] = useState<CompanyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyRequest | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanyRequests();
  }, []);

  const fetchCompanyRequests = async () => {
    setLoading(true);
    try {
      // First get all users with role 'company'
      const { data: users, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }

      if (!users) {
        setCompanyRequests([]);
        return;
      }
      
      // Filter and map the company users
      const companyUsers = users.users
        .filter(user => 
          user.user_metadata.role === 'company'
        )
        .map(user => ({
          id: user.id,
          email: user.email || '',
          company_name: user.user_metadata.full_name || '',
          created_at: user.created_at,
          status: user.user_metadata.approval_status || 'pending',
          role: user.user_metadata.role
        }));

      setCompanyRequests(companyUsers);
    } catch (error) {
      console.error('Error fetching company requests:', error);
      toast.error('Failed to fetch company requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCompany = async (id: string) => {
    setProcessingId(id);
    try {
      // Update user metadata to set approval_status to approved
      const { error } = await supabase.auth.admin.updateUserById(id, {
        user_metadata: { approval_status: 'approved' }
      });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setCompanyRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === id ? { ...req, status: 'approved' } : req
        )
      );
      
      toast.success('Company approved successfully');
      
      // Send notification to the company
      await supabase.from('notifications').insert({
        user_id: id,
        title: 'Account Approved',
        message: 'Your company account has been approved. You can now access the platform.',
        type: 'account_approval'
      });
      
    } catch (error) {
      console.error('Error approving company:', error);
      toast.error('Failed to approve company');
    } finally {
      setProcessingId(null);
      setConfirmDialogOpen(false);
    }
  };

  const handleRejectCompany = async (id: string) => {
    setProcessingId(id);
    try {
      // Update user metadata to set approval_status to rejected
      const { error } = await supabase.auth.admin.updateUserById(id, {
        user_metadata: { approval_status: 'rejected' }
      });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setCompanyRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === id ? { ...req, status: 'rejected' } : req
        )
      );
      
      toast.success('Company rejected successfully');
      
      // Send notification to the company
      await supabase.from('notifications').insert({
        user_id: id,
        title: 'Account Rejected',
        message: 'Your company account has been rejected. Please contact support for more information.',
        type: 'account_rejection'
      });
      
    } catch (error) {
      console.error('Error rejecting company:', error);
      toast.error('Failed to reject company');
    } finally {
      setProcessingId(null);
      setConfirmDialogOpen(false);
    }
  };

  const openConfirmDialog = (company: CompanyRequest, action: 'approve' | 'reject') => {
    setSelectedCompany(company);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedCompany || !actionType) return;
    
    if (actionType === 'approve') {
      handleApproveCompany(selectedCompany.id);
    } else {
      handleRejectCompany(selectedCompany.id);
    }
  };

  const filteredRequests = companyRequests.filter(req => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      req.company_name.toLowerCase().includes(searchTermLower) ||
      req.email.toLowerCase().includes(searchTermLower) ||
      req.status.toLowerCase().includes(searchTermLower)
    );
  });

  const pendingCount = companyRequests.filter(req => req.status === 'pending').length;
  const approvedCount = companyRequests.filter(req => req.status === 'approved').length;
  const rejectedCount = companyRequests.filter(req => req.status === 'rejected').length;

  return (
    <OwnerLayout title={t('companyRequests')}>
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
          <Button onClick={fetchCompanyRequests} variant="outline">
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{pendingCount}</h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Approved</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{approvedCount}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rejected</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{rejectedCount}</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('companyRequests')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Signup Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading company requests...
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No company requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.company_name}</TableCell>
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{format(new Date(company.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            company.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200'
                              : company.status === 'approved'
                              ? 'bg-green-50 text-green-700 hover:bg-green-50 border-green-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-50 border-red-200'
                          }
                        >
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {company.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => openConfirmDialog(company, 'approve')}
                                disabled={!!processingId}
                              >
                                <Check className="h-4 w-4" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => openConfirmDialog(company, 'reject')}
                                disabled={!!processingId}
                              >
                                <X className="h-4 w-4" /> Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">View details</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Company' : 'Reject Company'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? "Are you sure you want to approve this company? They will gain access to the company dashboard."
                : "Are you sure you want to reject this company? This will prevent them from accessing the platform."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="py-4">
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Company Name:</span>
                  <span className="ml-2">{selectedCompany.company_name}</span>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{selectedCompany.email}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} disabled={!!processingId}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAction} 
              disabled={!!processingId}
              variant={actionType === 'approve' ? 'default' : 'destructive'}
            >
              {processingId 
                ? 'Processing...' 
                : actionType === 'approve' 
                  ? 'Approve Company' 
                  : 'Reject Company'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OwnerLayout>
  );
};

export default CompanyApprovals;
