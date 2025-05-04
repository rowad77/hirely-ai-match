import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type ExperienceLevelFilterProps = {
  selectedLevels: string[];
  onLevelsChange: (levels: string[]) => void;
  className?: string;
};

const EXPERIENCE_LEVELS = [
  "Entry-level",
  "Mid-level",
  "Senior",
  "Executive"
];

const ExperienceLevelFilter: React.FC<ExperienceLevelFilterProps> = ({
  selectedLevels,
  onLevelsChange,
  className,
}) => {
  const handleLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      onLevelsChange([...selectedLevels, level]);
    } else {
      onLevelsChange(selectedLevels.filter(l => l !== level));
    }
  };

  return (
    <div className={className}>
      <h3 className="font-medium mb-2">Experience Level</h3>
      <div className="space-y-2">
        {EXPERIENCE_LEVELS.map((level) => (
          <div key={level} className="flex items-center space-x-2">
            <Checkbox 
              id={`experience-level-${level}`} 
              checked={selectedLevels.includes(level)}
              onCheckedChange={(checked) => 
                handleLevelChange(level, checked === true)
              }
            />
            <Label htmlFor={`experience-level-${level}`} className="cursor-pointer">{level}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceLevelFilter;