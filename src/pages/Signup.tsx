
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Simple password strength calculation
    if (password.length === 0) {
      setPasswordStrength(0);
    } else if (password.length < 6) {
      setPasswordStrength(25);
    } else if (password.length < 8) {
      setPasswordStrength(50);
    } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      setPasswordStrength(100);
    } else if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength(75);
    } else {
      setPasswordStrength(60);
    }
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-orange-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create user using Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: companyName,
            role: 'company'  // Set role to 'company' for company signups
          }
        }
      });
      
      if (error) throw error;
      
      // Create company entry if user is registering as a company
      if (data.user) {
        const { error: companyError } = await supabase
          .from('companies')
          .insert({
            name: companyName,
          })
          .select();

        if (companyError) {
          console.error('Error creating company:', companyError);
          // We don't throw here because the user is already created
        }

        // Add activity log
        await supabase.rpc('track_activity', {
          p_user_id: data.user.id,
          p_activity_type: 'signup',
          p_activity_data: { company_name: companyName }
        });
      }
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to Hirely. Let's start hiring smarter.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
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
            <div className="text-center sm:text-left">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-hirely hover:text-hirely-dark transition-colors">
                  Log in
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <form className="space-y-6" onSubmit={handleSignup}>
                <div className="space-y-1">
                  <Label htmlFor="company-name">Company name</Label>
                  <Input
                    id="company-name"
                    name="company-name"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                    placeholder="Your company name"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                    placeholder="yourname@company.com"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full transition-all duration-200 focus:ring-hirely focus:border-hirely"
                    placeholder="Create a secure password"
                  />
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1 text-xs">
                        <span>Password strength</span>
                        <span className={passwordStrength > 70 ? "text-green-600" : "text-gray-500"}>
                          {passwordStrength < 30 && "Weak"}
                          {passwordStrength >= 30 && passwordStrength < 60 && "Fair"}
                          {passwordStrength >= 60 && passwordStrength < 80 && "Good"}
                          {passwordStrength >= 80 && "Strong"}
                        </span>
                      </div>
                      <Progress 
                        value={passwordStrength} 
                        className={`h-1 bg-gray-200 ${getPasswordStrengthColor()}`}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hirely hover:bg-hirely-dark transition-colors duration-300 transform hover:scale-[1.02] active:scale-[0.98]" 
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign up'}
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <p className="text-xs text-center text-gray-500">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-hirely hover:text-hirely-dark transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-hirely hover:text-hirely-dark transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1 bg-hirely overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-center px-12">
            <div className="max-w-lg animate-fade-in-right">
              <h2 className="text-3xl font-extrabold text-white">
                Start hiring smarter with AI-powered interviews
              </h2>
              <ul className="mt-8 space-y-5">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start animate-slide-in" style={{ animationDelay: `${index * 150}ms` }}>
                    <CheckCircle className="h-6 w-6 text-white flex-shrink-0" />
                    <span className="ml-3 text-white text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12 bg-white/10 p-6 rounded-lg backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '600ms' }}>
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
