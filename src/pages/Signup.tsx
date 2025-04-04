
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is where we would integrate Supabase or Firebase Auth
    // For the MVP, we'll just simulate a loading state
    
    setTimeout(() => {
      setLoading(false);
      alert('Sign up feature will be implemented with backend integration!');
    }, 1500);
  };

  const benefits = [
    'Create unlimited job postings',
    'Interview candidates with AI',
    'Get detailed candidate insights',
    'Match candidates to positions automatically',
  ];

  return (
    <MainLayout withFooter={false}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-hirely hover:text-hirely-dark">
                  Log in
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <form className="space-y-6" onSubmit={handleSignup}>
                <div>
                  <Label htmlFor="company-name">Company name</Label>
                  <div className="mt-1">
                    <Input
                      id="company-name"
                      name="company-name"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="block w-full"
                    />
                  </div>
                </div>
                
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
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full"
                    />
                  </div>
                </div>

                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hirely hover:bg-hirely-dark" 
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign up'}
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <p className="text-xs text-center text-gray-500">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-hirely hover:text-hirely-dark">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-hirely hover:text-hirely-dark">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1 bg-hirely">
          <div className="absolute inset-0 flex flex-col justify-center px-12">
            <div className="max-w-lg">
              <h2 className="text-3xl font-extrabold text-white">
                Start hiring smarter with AI-powered interviews
              </h2>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-white flex-shrink-0" />
                    <span className="ml-3 text-white">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12">
                <p className="text-white font-medium">
                  "Hirely has revolutionized our hiring process, saving us countless hours and helping us find candidates that truly fit our culture."
                </p>
                <p className="mt-4 text-white">
                  <span className="font-bold">Sarah Chen</span> • Head of HR, TechCorp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;
