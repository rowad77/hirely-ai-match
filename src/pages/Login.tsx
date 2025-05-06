
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
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      toast.success(t('login') + " successful", {
        description: "Welcome back to Hirely!",
      });
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Please check your credentials and try again.";
        
      setError(errorMessage);
      
      toast.error(t('login') + " failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <MainLayout withFooter={false}>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{t('login')}</h2>
              <p className="mt-2 text-sm text-gray-600">
                {t('signup')} {' '}
                <Link to="/signup" className="font-medium text-hirely hover:text-hirely-dark">
                  {t('signup')}
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('email')}
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus:ring-hirely focus:border-hirely"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      {t('password')}
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus:ring-hirely focus:border-hirely"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Link to="/forgot-password" className="text-sm font-medium text-hirely hover:text-hirely-dark">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 bg-hirely hover:bg-hirely-dark"
                      disabled={isLoading}
                    >
                      {isLoading ? t('loading') : t('login')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-hirely to-hirely-dark">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-md text-center p-8 backdrop-blur-sm bg-white/10 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300">
              <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
              <p className="text-white text-lg">
                Sign in to access your dashboard and continue your journey with Hirely's AI-powered recruitment platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
