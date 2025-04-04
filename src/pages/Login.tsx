
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '../components/layout/MainLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is where we would integrate Supabase or Firebase Auth
    // For the MVP, we'll just simulate a loading state
    
    setTimeout(() => {
      setLoading(false);
      alert('Login feature will be implemented with backend integration!');
    }, 1500);
  };

  return (
    <MainLayout withFooter={false}>
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Log in to your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Don't have an account yet?{' '}
                <Link to="/signup" className="font-medium text-hirely hover:text-hirely-dark">
                  Sign up for free
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full"
                    />
                  </div>
                  <div className="flex items-center justify-end mt-2">
                    <Link to="/forgot-password" className="text-sm text-hirely hover:text-hirely-dark">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hirely hover:bg-hirely-dark" 
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Log in'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="/placeholder.svg"
            alt="People working in an office"
          />
          <div className="absolute inset-0 bg-hirely opacity-90"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <h3 className="text-3xl font-bold text-white">Welcome back to Hirely</h3>
              <p className="mt-4 text-white text-lg max-w-md">
                Log in to access your dashboard, manage job postings, and review candidate applications
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
