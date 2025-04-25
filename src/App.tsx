
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { JobsFilterProvider } from '@/context/JobsFilterContext';
import { LanguageProvider } from '@/context/LanguageContext';

import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Jobs from '@/pages/Jobs';
import JobDetails from '@/pages/JobDetails';
import JobApplication from '@/pages/JobApplication';
import Dashboard from '@/pages/Dashboard';
import ApplicationHistory from '@/pages/ApplicationHistory';
import UserProfile from '@/pages/UserProfile';
import NotFound from '@/pages/NotFound';

import OwnerDashboard from '@/pages/owner/OwnerDashboard';
import OwnerJobs from '@/pages/owner/OwnerJobs';
import OwnerAnalytics from '@/pages/owner/OwnerAnalytics';
import OwnerUsers from '@/pages/owner/OwnerUsers';
import OwnerCompanies from '@/pages/owner/OwnerCompanies';
import OwnerSettings from '@/pages/owner/OwnerSettings';

import CompanyDashboard from '@/pages/company/CompanyDashboard';
import CompanyJobs from '@/pages/company/CompanyJobs';
import CompanyCandidates from '@/pages/company/CompanyCandidates';
import CompanyApplications from '@/pages/company/CompanyApplications';
import CompanyApplicationDetail from '@/pages/company/CompanyApplicationDetail';
import CompanyInterviews from '@/pages/company/CompanyInterviews';
import CompanyAnalytics from '@/pages/company/CompanyAnalytics';
import CompanySettings from '@/pages/company/CompanySettings';
import CompanyJobCreate from '@/pages/company/CompanyJobCreate';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <JobsFilterProvider>
              <Toaster position="bottom-center" richColors closeButton />
              <ShadcnToaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/jobs/:id/apply" element={<JobApplication />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/application-history" element={<ApplicationHistory />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />

                {/* Company Routes */}
                <Route path="/company" element={<Navigate to="/company/dashboard" replace />} />
                <Route path="/company/dashboard" element={<CompanyDashboard />} />
                <Route path="/company/jobs" element={<CompanyJobs />} />
                <Route path="/company/jobs/create" element={<CompanyJobCreate />} />
                <Route path="/company/candidates" element={<CompanyCandidates />} />
                <Route path="/company/applications" element={<CompanyApplications />} />
                <Route path="/company/applications/:id" element={<CompanyApplicationDetail />} />
                <Route path="/company/interviews" element={<CompanyInterviews />} />
                <Route path="/company/analytics" element={<CompanyAnalytics />} />
                <Route path="/company/settings" element={<CompanySettings />} />

                {/* Owner Routes */}
                <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                <Route path="/owner/jobs" element={<OwnerJobs />} />
                <Route path="/owner/analytics" element={<OwnerAnalytics />} />
                <Route path="/owner/users" element={<OwnerUsers />} />
                <Route path="/owner/companies" element={<OwnerCompanies />} />
                <Route path="/owner/settings" element={<OwnerSettings />} />
              </Routes>
            </JobsFilterProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
