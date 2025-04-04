
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import JobDetails from "./pages/JobDetails";
import Jobs from "./pages/Jobs";
import JobApplication from "./pages/JobApplication";
import NotFound from "./pages/NotFound";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyJobs from "./pages/company/CompanyJobs";
import CompanyApplications from "./pages/company/CompanyApplications";
import CompanyApplicationDetail from "./pages/company/CompanyApplicationDetail";
import CompanySettings from "./pages/company/CompanySettings";
import CompanyAnalytics from "./pages/company/CompanyAnalytics";
import CompanyCandidates from "./pages/company/CompanyCandidates";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create-job" element={<CreateJob />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/apply" element={<JobApplication />} />
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/jobs" element={<CompanyJobs />} />
            <Route path="/company/applications" element={<CompanyApplications />} />
            <Route path="/company/applications/:id" element={<CompanyApplicationDetail />} />
            <Route path="/company/settings" element={<CompanySettings />} />
            <Route path="/company/analytics" element={<CompanyAnalytics />} />
            <Route path="/company/candidates" element={<CompanyCandidates />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
