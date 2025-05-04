import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type SkillsFilterProps = {
  selectedSkills: { name: string; required: boolean }[];
  onSkillsChange: (skills: { name: string; required: boolean }[]) => void;
  className?: string;
};

// This would typically come from an API, but for now we'll use a static list
const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
  'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
  'HTML', 'CSS', 'SASS', 'LESS', 'Tailwind CSS', 'Bootstrap',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'GraphQL', 'REST API', 'Express', 'Django', 'Flask',
  'Git', 'CI/CD', 'Agile', 'Scrum', 'Jira',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch',
  'Data Science', 'Machine Learning', 'AI', 'TensorFlow', 'PyTorch',
  'Mobile Development', 'React Native', 'Flutter', 'iOS', 'Android',
  'Testing', 'Jest', 'Cypress', 'Selenium', 'Mocha',
];

const SkillsFilter: React.FC<SkillsFilterProps> = ({
  selectedSkills,
  onSkillsChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredSkills, setFilteredSkills] = useState(COMMON_SKILLS);

  // Filter skills based on search input
  useEffect(() => {
    if (searchValue) {
      const filtered = COMMON_SKILLS.filter(skill =>
        skill.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(COMMON_SKILLS);
    }
  }, [searchValue]);

  const handleSelectSkill = (skill: string) => {
    // Don't add if already selected
    if (selectedSkills.some(s => s.name === skill)) {
      return;
    }
    
    // Add the skill as non-required by default
    onSkillsChange([...selectedSkills, { name: skill, required: false }]);
    setSearchValue('');
    setOpen(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill.name !== skillToRemove));
  };

  const toggleRequired = (skillName: string) => {
    onSkillsChange(
      selectedSkills.map(skill =>
        skill.name === skillName
          ? { ...skill, required: !skill.required }
          : skill
      )
    );
  };

  const handleAddCustomSkill = () => {
    if (
      searchValue.trim() !== '' &&
      !selectedSkills.some(s => s.name.toLowerCase() === searchValue.toLowerCase())
    ) {
      onSkillsChange([...selectedSkills, { name: searchValue.trim(), required: false }]);
      setSearchValue('');
      setOpen(false);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSkills.map(skill => (
          <Badge 
            key={skill.name} 
            variant={skill.required ? "default" : "outline"}
            className="flex items-center gap-1 px-3 py-1"
          >
            <span>{skill.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => toggleRequired(skill.name)}
            >
              {skill.required ? "*" : ""}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleRemoveSkill(skill.name)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {searchValue || "Select skills..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search skills..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="py-2 px-4">
                  <p>No skills found.</p>
                  {searchValue.trim() !== '' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={handleAddCustomSkill}
                    >
                      Add "{searchValue}"
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredSkills.map(skill => (
                  <CommandItem
                    key={skill}
                    value={skill}
                    onSelect={() => handleSelectSkill(skill)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSkills.some(s => s.name === skill)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {skill}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <div className="text-xs text-gray-500 mt-1">
        Click * to mark a skill as required
      </div>
    </div>
  );
};

export default SkillsFilter;