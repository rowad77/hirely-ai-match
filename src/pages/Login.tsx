
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/context/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail, Lock, WifiOff, RefreshCw } from 'lucide-react';
import { isNetworkError, isOnline, subscribeToNetworkStatus } from '@/utils/network-status';
import { NetworkStatusIndicator } from '@/components/ui/NetworkStatusIndicator';
import { trackAuthError } from '@/utils/error-tracking';

const Login = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!isOnline());
  const [isChecking, setIsChecking] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Monitor network status
  useEffect(() => {
    const unsubscribe = subscribeToNetworkStatus((online) => {
      setIsOffline(!online);
      
      // If coming back online and there was an error, clear it
      if (online && error && error.includes('offline')) {
        setError(null);
        toast.info("You're back online!");
      }
    });
    
    return unsubscribe;
  }, [error]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Try to fetch a small resource to check connection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://www.gstatic.com/generate_204', { 
        method: 'HEAD',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsOffline(false);
        setError(null);
        toast.success("Connection restored!");
      } else {
        setIsOffline(true);
        setError("Network issues persist. Please try again later.");
      }
    } catch (e) {
      setIsOffline(true);
      setError("Unable to connect to the server. Please check your internet connection.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Early check for offline status
    if (isOffline) {
      setError('You appear to be offline. Please check your internet connection and try again.');
      toast.error("Network connection error", {
        description: "Please check your internet connection and try again.",
      });
      return;
    }

    try {
      await login(email, password);
      toast.success(t('login') + " successful", {
        description: "Welcome back to Hirely!",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      
      // Check if it's a network error for better user feedback
      const networkProblem = error instanceof Error && isNetworkError(error);
      
      setIsOffline(networkProblem);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Please check your credentials and try again.";
      
      // Track auth error for monitoring
      trackAuthError('login', { message: errorMessage, networkIssue: networkProblem });
      
      setError(errorMessage);
      
      if (networkProblem) {
        toast.error("Network connection error", {
          description: "Please check your internet connection and try again.",
        });
      } else {
        toast.error(t('login') + " failed", {
          description: errorMessage,
        });
      }
    }
  };

  return (
    <MainLayout withFooter={false}>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center mb-10">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 relative">
                {t('login')}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-hirely rounded-full mt-1"></span>
              </h2>
              <p className="mt-4 text-sm text-gray-600">
                {t('signup')} {' '}
                <Link to="/signup" className="font-medium text-hirely hover:text-hirely-dark transition-colors">
                  {t('signup')}
                </Link>
              </p>
            </div>

            <div className="absolute top-4 right-4">
              <NetworkStatusIndicator />
            </div>

            <div className="mt-8">
              <div className="mt-6">
                {isOffline && (
                  <Alert variant="destructive" className="mb-4 animate-fade-in">
                    <WifiOff className="h-4 w-4" />
                    <AlertDescription className="flex flex-col gap-2">
                      <span>Network connection error. Please check your internet connection and try again.</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={checkConnection}
                        disabled={isChecking}
                        className="self-start flex items-center gap-1"
                      >
                        <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} /> 
                        {isChecking ? 'Checking...' : 'Check connection'}
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                
                {error && !isOffline && (
                  <Alert variant="destructive" className="mb-4 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="space-y-1">
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('email')}
                    </Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 focus:ring-hirely focus:border-hirely transition-all duration-200"
                        placeholder="you@example.com"
                        disabled={isOffline || isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      {t('password')}
                    </Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 focus:ring-hirely focus:border-hirely transition-all duration-200"
                        placeholder="••••••••"
                        disabled={isOffline || isLoading}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Link to="/forgot-password" className="text-sm font-medium text-hirely hover:text-hirely-dark transition-colors">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 bg-hirely hover:bg-hirely-dark transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      disabled={isLoading || isOffline}
                    >
                      {isLoading ? t('loading') : t('login')}
                    </Button>
                  </div>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-50 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      disabled={isOffline}
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-hirely to-hirely-dark overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-md text-center p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300">
              <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
              <p className="text-white text-lg leading-relaxed">
                Sign in to access your dashboard and continue your journey with Hirely's AI-powered recruitment platform.
                <span className="block mt-4 text-white/80 italic">
                  "Finding the perfect job shouldn't be a job in itself."
                </span>
              </p>
            </div>
          </div>
          <div className="absolute bottom-10 right-10">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-white/50"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
