
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Dashboard from './pages/Dashboard';
import JobApplication from './pages/JobApplication';
import ApplicationHistory from './pages/ApplicationHistory';
import NotFound from './pages/NotFound';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyJobs from './pages/company/CompanyJobs';
import CompanyJobCreate from './pages/company/CompanyJobCreate';
import CompanyApplications from './pages/company/CompanyApplications';
import CompanyApplicationDetail from './pages/company/CompanyApplicationDetail';
import CompanyAnalytics from './pages/company/CompanyAnalytics';
import CompanyCandidates from './pages/company/CompanyCandidates';
import CompanySettings from './pages/company/CompanySettings';
import CompanyInterviews from './pages/company/CompanyInterviews';
import CreateJob from './pages/CreateJob';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerCompanies from './pages/owner/OwnerCompanies';
import OwnerUsers from './pages/owner/OwnerUsers';
import OwnerJobs from './pages/owner/OwnerJobs';
import OwnerAnalytics from './pages/owner/OwnerAnalytics';
import OwnerSettings from './pages/owner/OwnerSettings';
import Documentation from './pages/Documentation';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/apply" element={<JobApplication />} />
            <Route path="/applications" element={<ApplicationHistory />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create-job" element={<CreateJob />} />
            
            {/* Company Routes */}
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/jobs" element={<CompanyJobs />} />
            <Route path="/company/jobs/create" element={<CompanyJobCreate />} />
            <Route path="/company/applications" element={<CompanyApplications />} />
            <Route path="/company/applications/:id" element={<CompanyApplicationDetail />} />
            <Route path="/company/analytics" element={<CompanyAnalytics />} />
            <Route path="/company/candidates" element={<CompanyCandidates />} />
            <Route path="/company/interviews" element={<CompanyInterviews />} />
            <Route path="/company/settings" element={<CompanySettings />} />
            
            {/* Owner Routes */}
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/companies" element={<OwnerCompanies />} />
            <Route path="/owner/users" element={<OwnerUsers />} />
            <Route path="/owner/jobs" element={<OwnerJobs />} />
            <Route path="/owner/analytics" element={<OwnerAnalytics />} />
            <Route path="/owner/settings" element={<OwnerSettings />} />
            
            <Route path="/documentation" element={<Documentation />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="bottom-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
