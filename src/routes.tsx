
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/context/AuthContext';

// Lazy load all pages for better performance
const Index = React.lazy(() => import('@/pages/Index'));
const Login = React.lazy(() => import('@/pages/Login'));
const Signup = React.lazy(() => import('@/pages/Signup'));
const Jobs = React.lazy(() => import('@/pages/Jobs'));
const JobDetails = React.lazy(() => import('@/pages/JobDetails'));
const JobApplication = React.lazy(() => import('@/pages/JobApplication'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const ApplicationHistory = React.lazy(() => import('@/pages/ApplicationHistory'));
const UserProfile = React.lazy(() => import('@/pages/UserProfile'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const PendingApproval = React.lazy(() => import('@/pages/PendingApproval'));

// Owner routes
const OwnerDashboard = React.lazy(() => import('@/pages/owner/OwnerDashboard'));
const OwnerJobs = React.lazy(() => import('@/pages/owner/OwnerJobs'));
const OwnerAnalytics = React.lazy(() => import('@/pages/owner/OwnerAnalytics'));
const OwnerUsers = React.lazy(() => import('@/pages/owner/OwnerUsers'));
const OwnerCompanies = React.lazy(() => import('@/pages/owner/OwnerCompanies'));
const OwnerSettings = React.lazy(() => import('@/pages/owner/OwnerSettings'));
const OwnerLanguages = React.lazy(() => import('@/pages/owner/OwnerLanguages'));
const CompanyApprovals = React.lazy(() => import('@/pages/owner/CompanyApprovals'));

// Company routes
const CompanyDashboard = React.lazy(() => import('@/pages/company/CompanyDashboard'));
const CompanyJobs = React.lazy(() => import('@/pages/company/CompanyJobs'));
const CompanyCandidates = React.lazy(() => import('@/pages/company/CompanyCandidates'));
const CompanyApplications = React.lazy(() => import('@/pages/company/CompanyApplications'));
const CompanyApplicationDetail = React.lazy(() => import('@/pages/company/CompanyApplicationDetail'));
const CompanyInterviews = React.lazy(() => import('@/pages/company/CompanyInterviews'));
const CompanyAnalytics = React.lazy(() => import('@/pages/company/CompanyAnalytics'));
const CompanySettings = React.lazy(() => import('@/pages/company/CompanySettings'));
const CompanyJobCreate = React.lazy(() => import('@/pages/company/CompanyJobCreate'));

// Create a suspense wrapper that includes loading state
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLanguage();
  
  return (
    <React.Suspense fallback={<LoadingState message={t('loading')} />}>
      {children}
    </React.Suspense>
  );
};

// Protected route component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'owner' | 'company' | 'candidate' }) => {
  const { isAuthenticated, userRole, isApproved, isPending, isRejected } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // For company users, check if they are approved
  if (userRole === 'company' && (isPending || isRejected)) {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <SuspenseWrapper>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/apply" element={<JobApplication />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/application-history" 
          element={
            <ProtectedRoute>
              <ApplicationHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />

        {/* Company Routes */}
        <Route 
          path="/company/dashboard" 
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/jobs" 
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/jobs/create" 
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyJobCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/candidates" 
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyCandidates />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/applications" 
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyApplications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/applications/:id" 
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyApplicationDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/interviews" 
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyInterviews />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/analytics" 
          element={
            <ProtectedRoute requiredRole="company">
              <CompanyAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/settings" 
          element={
            <ProtectedRoute requiredRole="company">
              <CompanySettings />
            </ProtectedRoute>
          } 
        />

        {/* Owner Routes */}
        <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
        <Route 
          path="/owner/dashboard" 
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/jobs" 
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/analytics" 
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/users" 
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/companies" 
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerCompanies />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/company-approvals" 
          element={
            <ProtectedRoute requiredRole="owner">
              <CompanyApprovals />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/settings" 
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerSettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/languages" 
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerLanguages />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </SuspenseWrapper>
  );
};

export default AppRoutes;
