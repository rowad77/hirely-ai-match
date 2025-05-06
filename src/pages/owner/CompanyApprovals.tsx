
import { useState, useEffect } from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AdminUserAttributes } from '@supabase/supabase-js';
import { useLanguage } from '@/context/LanguageContext';

type CompanyRequest = {
  id: string;
  email: string;
  company_name: string;
  created_at: string;
  status: string;
  role: string;
};

const CompanyApprovals = () => {
  const { t } = useLanguage();
  const [companyRequests, setCompanyRequests] = useState<CompanyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanyRequests();
  }, []);

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      // Update the user's metadata
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { approval_status: 'approved' }
      });
      
      if (error) throw error;
      
      // Update local state
      setCompanyRequests(prev => 
        prev.map(req => 
          req.id === userId ? { ...req, status: 'approved' } : req
        )
      );
      
      toast.success('Company approved successfully');
    } catch (error) {
      toast.error('Failed to approve company');
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleReject = async (userId: string) => {
    setActionLoading(userId);
    try {
      // Update the user's metadata
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { approval_status: 'rejected' }
      });
      
      if (error) throw error;
      
      // Update local state
      setCompanyRequests(prev => 
        prev.map(req => 
          req.id === userId ? { ...req, status: 'rejected' } : req
        )
      );
      
      toast.success('Company rejected successfully');
    } catch (error) {
      toast.error('Failed to reject company');
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const fetchCompanyRequests = async () => {
    setLoading(true);
    try {
      // First get all users with role 'company'
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }

      if (!data) {
        setCompanyRequests([]);
        return;
      }
      
      // Filter and map the company users
      const companyUsers = data.users
        .filter(user => 
          user.user_metadata && typeof user.user_metadata === 'object' && user.user_metadata.role === 'company'
        )
        .map(user => {
          const metadata = user.user_metadata as Record<string, any> || {};
          return {
            id: user.id,
            email: user.email || '',
            company_name: metadata.full_name || '',
            created_at: user.created_at,
            status: metadata.approval_status || 'pending',
            role: metadata.role || ''
          };
        });

      setCompanyRequests(companyUsers);
    } catch (error) {
      console.error('Error fetching company requests:', error);
      toast.error('Failed to load company requests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">{t('companyRequests')}</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading company requests...</p>
          </div>
        ) : companyRequests.length > 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companyRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.company_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{request.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(request.id)}
                            disabled={actionLoading === request.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === request.id ? 'Processing...' : t('approve')}
                          </Button>
                          <Button 
                            size="sm"
                            variant="destructive" 
                            onClick={() => handleReject(request.id)}
                            disabled={actionLoading === request.id}
                          >
                            {actionLoading === request.id ? 'Processing...' : t('reject')}
                          </Button>
                        </div>
                      )}
                      {request.status !== 'pending' && (
                        <span className="text-gray-500 italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
            <p className="text-gray-500">No company requests found.</p>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default CompanyApprovals;
