import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Plus } from 'lucide-react';

// Update the props interface to include the handler with the correct name
export interface SkillsFilterProps {
  selectedSkills: { name: string; required: boolean }[];
  onSkillsChange: (skills: { name: string; required: boolean }[]) => void;
}

const SkillsFilter: React.FC<SkillsFilterProps> = ({ 
  selectedSkills, 
  onSkillsChange 
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState(selectedSkills || []);

  const addSkill = () => {
    if (newSkill.trim() !== '') {
      const skillExists = skills.some(skill => skill.name === newSkill.trim());
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

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
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
