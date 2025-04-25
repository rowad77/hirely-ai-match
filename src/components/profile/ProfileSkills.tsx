
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface ProfileSkillsProps {
  profile: Partial<Tables<'profiles'>> | null;
  setProfile: (profile: Partial<Tables<'profiles'>> | null) => void;
}

const ProfileSkills = ({ profile, setProfile }: ProfileSkillsProps) => {
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    // Don't add duplicate skills
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already exists');
      return;
    }
    
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const saveSkills = async () => {
    if (!profile?.id) return;
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills })
        .eq('id', profile.id);
        
      if (error) throw error;
      
      setProfile({ ...profile, skills });
      toast.success('Skills updated successfully');
    } catch (error) {
      console.error('Error updating skills:', error);
      toast.error('Failed to update skills');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4 min-h-[100px]">
        {skills.length === 0 ? (
          <div className="text-muted-foreground italic">
            No skills added yet. Add your skills below.
          </div>
        ) : (
          skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 text-sm">
              {skill}
              <button 
                onClick={() => removeSkill(skill)} 
                className="ml-2 text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-4 w-4" />
              </button>
            </Badge>
          ))
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill (e.g. JavaScript, Project Management)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow"
          />
          <Button 
            type="button" 
            onClick={addSkill} 
            size="icon" 
            variant="outline"
            disabled={!newSkill.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Press Enter to add a skill or click the plus button
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={saveSkills} 
            className="bg-hirely hover:bg-hirely-dark"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Skills'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkills;
