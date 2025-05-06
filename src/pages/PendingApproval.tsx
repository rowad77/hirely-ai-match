
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const PendingApproval = () => {
  const { logout, isAuthenticated, isPending, isRejected, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isPending && !isRejected) {
      // User is approved, redirect to dashboard
      navigate('/dashboard');
    }
  }, [isAuthenticated, isPending, isRejected, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12 px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            {isPending ? (
              <>
                <Clock className="mx-auto h-14 w-14 text-amber-500 mb-2" />
                <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
              </>
            ) : isRejected ? (
              <>
                <AlertTriangle className="mx-auto h-14 w-14 text-red-500 mb-2" />
                <CardTitle className="text-2xl">Account Rejected</CardTitle>
              </>
            ) : (
              <>
                <CheckCircle className="mx-auto h-14 w-14 text-green-500 mb-2" />
                <CardTitle className="text-2xl">Account Approved</CardTitle>
              </>
            )}
          </CardHeader>
          <CardContent className="text-center">
            {isPending ? (
              <>
                <p className="text-gray-500 mb-4">
                  Thank you for registering your company on Hirely!
                </p>
                <p className="text-gray-600 mb-4">
                  Your account is currently under review by our team. You will receive an email notification once your account has been approved.
                </p>
                <p className="text-gray-600">
                  This process typically takes 1-2 business days.
                </p>
              </>
            ) : isRejected ? (
              <>
                <p className="text-gray-500 mb-4">
                  Unfortunately, your company registration has been rejected.
                </p>
                <p className="text-gray-600 mb-4">
                  This could be due to incomplete information or not meeting our platform requirements.
                </p>
                <p className="text-gray-600">
                  Please contact our support team for more information.
                </p>
              </>
            ) : (
              <p className="text-gray-600">
                Your account has been approved. You will be redirected to the dashboard.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button onClick={handleLogout} className="w-full" variant="outline">
              Log out
            </Button>
            {isRejected && (
              <Button variant="default" className="w-full">
                Contact Support
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PendingApproval;
