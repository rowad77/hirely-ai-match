
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  change?: {
    value: string;
    timeframe: string;
  };
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  change
}: StatCardProps) => {
  const bgColor = `bg-${color}-100`;
  const textColor = `text-${color}-600`;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
          </div>
          <div className={`${bgColor} p-3 rounded-full`}>
            <Icon className={`h-6 w-6 ${textColor}`} />
          </div>
        </div>
        {change && (
          <div className="mt-6">
            <span className="text-sm font-medium text-green-500">{change.value}</span>
            <span className="text-sm font-medium text-gray-500 ml-1">{change.timeframe}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
