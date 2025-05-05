
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

export interface Skill {
  name: string;
  required: boolean;
}

// Update the props interface with the correct types
export interface SkillsFilterProps {
  selectedSkills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}

const SkillsFilter: React.FC<SkillsFilterProps> = ({ 
  selectedSkills, 
  onSkillsChange 
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<Skill[]>(selectedSkills || []);

  const addSkill = () => {
    if (newSkill.trim() !== '') {
      const skillExists = skills.some(skill => skill.name.toLowerCase() === newSkill.trim().toLowerCase());
      if (!skillExists) {
        const updatedSkills = [...skills, { name: newSkill.trim(), required: true }];
        setSkills(updatedSkills);
        onSkillsChange(updatedSkills);
        setNewSkill('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill.name !== skillToRemove);
    setSkills(updatedSkills);
    onSkillsChange(updatedSkills);
  };

  // Update to handle Enter key for adding skills
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button variant="outline" size="sm" onClick={addSkill}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill.name} variant="secondary" className="gap-x-2">
            {skill.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeSkill(skill.name)}
              className="p-0 h-4 w-4 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsFilter;
