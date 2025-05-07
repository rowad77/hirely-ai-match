import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { JobsFilterProvider } from '@/context/JobsFilterContext';
import { LanguageProvider } from '@/context/LanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppRoutes from '@/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a queryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Import our new error boundary
import GlobalErrorBoundary from './components/ui/GlobalErrorBoundary';
import { NetworkStatusIndicator } from './components/ui/NetworkStatusIndicator';

function App() {
  return (
    <GlobalErrorBoundary>
      <div className="App">
        {/* Network status indicator - only show when offline or syncing */}
        <div className="fixed top-4 right-4 z-50">
          <NetworkStatusIndicator />
        </div>
        
        <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
          <LanguageProvider>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <AuthProvider>
                  <JobsFilterProvider>
                    <Toaster position="bottom-center" richColors closeButton />
                    <ShadcnToaster />
                    <AppRoutes />
                  </JobsFilterProvider>
                </AuthProvider>
              </BrowserRouter>
            </QueryClientProvider>
          </LanguageProvider>
        </ThemeProvider>
      </div>
    </GlobalErrorBoundary>
  );
}

export default App;
