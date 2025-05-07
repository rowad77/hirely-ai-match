
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TestUsersCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    owner: boolean | null;
    company: boolean | null;
    candidate: boolean | null;
  }>({
    owner: null,
    company: null,
    candidate: null
  });

  const testUsers = [
    {
      type: 'owner',
      email: 'owner@hirely.com',
      password: 'hirely123',
      userData: {
        full_name: 'Admin Owner',
        role: 'owner'
      }
    },
    {
      type: 'company',
      email: 'company@hirely.com',
      password: 'hirely123',
      userData: {
        full_name: 'Test Company',
        role: 'company',
        approval_status: 'approved'
      }
    },
    {
      type: 'candidate',
      email: 'candidate@hirely.com',
      password: 'hirely123',
      userData: {
        full_name: 'John Candidate',
        role: 'candidate'
      }
    }
  ];

  const createTestUsers = async () => {
    setIsLoading(true);
    setResults({
      owner: null,
      company: null,
      candidate: null
    });

    const newResults = { ...results };

    // Try creating each user in sequence
    for (const user of testUsers) {
      try {
        // Check if user already exists
        const { data: existingUsers } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email);

        if (existingUsers && existingUsers.length > 0) {
          toast.info(`User ${user.email} already exists`);
          newResults[user.type as keyof typeof newResults] = true;
          continue;
        }

        // Create the user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: user.userData
          }
        });

        if (error) {
          throw error;
        }

        if (data) {
          // For company, create a company entry if it doesn't exist
          if (user.type === 'company' && data.user) {
            const { error: companyError } = await supabase
              .from('companies')
              .insert({
                name: 'Test Company Inc.',
                is_verified: true,
                company_size: '50-100',
                industry: 'Technology'
              });

            if (companyError) {
              console.error('Error creating company:', companyError);
            }
          }

          newResults[user.type as keyof typeof newResults] = true;
          toast.success(`Successfully created ${user.type} user: ${user.email}`);
        }
      } catch (error) {
        console.error(`Error creating ${user.type} user:`, error);
        toast.error(`Failed to create ${user.type} user`);
        newResults[user.type as keyof typeof newResults] = false;
      }
    }

    setResults(newResults);
    setIsLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Users Creator</CardTitle>
        <CardDescription>
          Create test users for owner, company, and candidate roles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {testUsers.map((user) => (
            <div key={user.type} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
              <div>
                <p className="font-semibold capitalize">{user.type}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">Password: {user.password}</p>
              </div>
              <div>
                {results[user.type as keyof typeof results] === true && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {results[user.type as keyof typeof results] === false && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          className="w-full" 
          onClick={createTestUsers} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Creating Users...
            </>
          ) : (
            'Create Test Users'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestUsersCreator;
