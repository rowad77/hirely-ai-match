
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserRound, BookText, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProfileBasicInfo from '@/components/profile/ProfileBasicInfo';
import ProfileSkills from '@/components/profile/ProfileSkills';
import ProfileEducation from '@/components/profile/ProfileEducation';
import ProfileExperience from '@/components/profile/ProfileExperience';
import ProfileResume from '@/components/profile/ProfileResume';
import { Tables } from '@/integrations/supabase/types';

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<Tables<'profiles'>> | null>(null);
  const [educationList, setEducationList] = useState<Tables<'education'>[]>([]);
  const [experienceList, setExperienceList] = useState<Tables<'work_experiences'>[]>([]);
  const [activeTab, setActiveTab] = useState('basic');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Get education
        const { data: educationData, error: eduError } = await supabase
          .from('education')
          .select('*')
          .eq('profile_id', user.id)
          .order('start_date', { ascending: false });
          
        if (eduError) throw eduError;
        setEducationList(educationData);
        
        // Get work experience
        const { data: expData, error: expError } = await supabase
          .from('work_experiences')
          .select('*')
          .eq('profile_id', user.id)
          .order('start_date', { ascending: false });
          
        if (expError) throw expError;
        setExperienceList(expData);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-hirely" />
        <span className="ml-2 text-lg">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Profile not found. Please contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="basic" className="flex items-center">
            <UserRound className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center">
            <BookText className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center">
            <GraduationCap className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="resume" className="flex items-center">
            <BookText className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Resume</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileBasicInfo profile={profile} setProfile={setProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Manage your skills and proficiency levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSkills profile={profile} setProfile={setProfile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Manage your professional experience</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileExperience 
                experiences={experienceList} 
                setExperiences={setExperienceList} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Manage your educational background</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEducation 
                education={educationList} 
                setEducation={setEducationList} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume">
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload and analyze your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileResume userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
