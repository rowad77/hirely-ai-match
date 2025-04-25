import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  User, 
  MapPin, 
  Check, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

// Mock interview data
const mockInterviews = [
  {
    id: 1,
    candidate: 'John Smith',
    position: 'Senior Frontend Developer',
    date: new Date(2025, 3, 5, 10, 0),
    type: 'video',
    duration: 60,
    status: 'scheduled',
  },
  {
    id: 2,
    candidate: 'Emily Johnson',
    position: 'UX Designer',
    date: new Date(2025, 3, 6, 14, 30),
    type: 'in-person',
    duration: 90,
    status: 'scheduled',
  },
  {
    id: 3,
    candidate: 'Michael Williams',
    position: 'DevOps Engineer',
    date: new Date(2025, 3, 8, 11, 0),
    type: 'phone',
    duration: 45,
    status: 'scheduled',
  }
];

const InterviewSchedule = () => {
  const [interviews, setInterviews] = useState(mockInterviews);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const { t } = useLanguage();

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Phone;
      case 'in-person': return User;
      default: return Video;
    }
  };

  const handleUpdateStatus = (id: number, status: string) => {
    setInterviews(interviews.map(interview => 
      interview.id === id ? { ...interview, status } : interview
    ));
    toast.success(`Interview status updated to ${status}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-xl font-bold">{t('interview_schedule')}</h2>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: 'calendar' | 'list') => setViewMode(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar">Calendar View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, 'PPP') : t('pick_date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className={`${viewMode === 'calendar' ? 'block' : 'hidden'}`}>
        <Card>
          <CardHeader>
            <CardTitle>{date ? format(date, 'EEEE, MMMM d, yyyy') : t('pick_date')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="col-span-1 text-center text-sm text-gray-500">
                    {`${index + 8}:00`}
                  </div>
                ))}
              </div>
              
              <div className="relative h-40 border rounded-lg">
                {interviews.filter(interview => 
                  date && interview.date.toDateString() === date.toDateString()
                ).map(interview => {
                  const hour = interview.date.getHours();
                  const minute = interview.date.getMinutes();
                  const startPercent = ((hour - 8) * 60 + minute) / (12 * 60) * 100;
                  const widthPercent = (interview.duration / (12 * 60)) * 100;
                  const Icon = getInterviewIcon(interview.type);
                  
                  return (
                    <div 
                      key={interview.id}
                      className="absolute bg-blue-100 border border-blue-300 rounded p-2 text-xs"
                      style={{ 
                        left: `${startPercent}%`, 
                        width: `${widthPercent}%`,
                        top: '10px',
                        height: 'calc(100% - 20px)',
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Icon className="h-3 w-3 text-blue-600" />
                        <span className="font-medium">{interview.candidate}</span>
                      </div>
                      <div className="text-gray-600 mt-1">{interview.position}</div>
                      <div className="text-gray-500 mt-1">
                        {format(interview.date, 'h:mm a')} - {format(new Date(interview.date.getTime() + interview.duration * 60000), 'h:mm a')}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {interviews.filter(interview => 
                date && interview.date.toDateString() === date.toDateString()
              ).length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  {t('no_interviews')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className={`${viewMode === 'list' ? 'block' : 'hidden'}`}>
        <div className="space-y-4">
          {interviews.map(interview => {
            const Icon = getInterviewIcon(interview.type);
            
            return (
              <Card key={interview.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{interview.candidate}</h3>
                          <p className="text-sm text-gray-500">{interview.position}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{format(interview.date, 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(interview.date, 'h:mm a')} - {format(new Date(interview.date.getTime() + interview.duration * 60000), 'h:mm a')}
                          </span>
                        </div>
                        {interview.type === 'in-person' && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>Office - Meeting Room 3</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className={
                        interview.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                        interview.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </Badge>
                      
                      <div className="flex gap-2 mt-2">
                        {interview.status === 'scheduled' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(interview.id, 'completed')} className="flex items-center gap-1">
                              <Check className="h-3.5 w-3.5" />
                              <span>{t('complete')}</span>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(interview.id, 'cancelled')} className="flex items-center gap-1 border-red-300 text-red-600 hover:bg-red-50">
                              <X className="h-3.5 w-3.5" />
                              <span>{t('cancel')}</span>
                            </Button>
                          </>
                        )}
                        {interview.status === 'completed' && (
                          <Button size="sm" variant="outline">{t('view_notes')}</Button>
                        )}
                        {interview.status === 'cancelled' && (
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(interview.id, 'scheduled')}>{t('reschedule')}</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {interviews.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              {t('no_interviews')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedule;
