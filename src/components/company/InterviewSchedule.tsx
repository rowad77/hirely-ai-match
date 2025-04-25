
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { useRtlTextAlign, useRtlDirection } from '@/lib/rtl-utils';
import { CalendarIcon, Clock, Video, Phone, MapPin, Eye, ArrowRightLeft, Check, X } from 'lucide-react';
import { ar, enUS } from 'date-fns/locale';

// Mock interview data
const mockInterviews = [
  {
    id: 1,
    candidateName: 'Alex Johnson',
    position: 'Frontend Developer',
    time: '09:00 AM',
    duration: '45 min',
    type: 'video',
    interviewer: 'Sarah Williams'
  },
  {
    id: 2,
    candidateName: 'Maria Garcia',
    position: 'UX Designer',
    time: '10:30 AM',
    duration: '60 min',
    type: 'in-person',
    interviewer: 'Michael Brown'
  },
  {
    id: 3,
    candidateName: 'James Wilson',
    position: 'Backend Developer',
    time: '01:15 PM',
    duration: '45 min',
    type: 'phone',
    interviewer: 'Sarah Williams'
  },
  {
    id: 4,
    candidateName: 'Emily Chen',
    position: 'Product Manager',
    time: '03:00 PM',
    duration: '60 min',
    type: 'video',
    interviewer: 'David Rodriguez'
  }
];

const InterviewSchedule = () => {
  const { t, language } = useLanguage();
  const rtlAlign = useRtlTextAlign();
  const rtlDirection = useRtlDirection();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const getInterviewTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const getInterviewTypeText = (type: string) => {
    switch(type) {
      case 'video': return t('video_link');
      case 'phone': return t('phone_interview');
      case 'in-person': return t('in_person');
      default: return t('video_link');
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="md:col-span-1">
        <CardContent className="p-4">
          <div className={`flex items-center mb-4 ${rtlDirection}`}>
            <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="font-medium">{t('pick_date')}</h3>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            locale={language === 'ar' ? ar : enUS}
          />
        </CardContent>
      </Card>
      
      {/* Interview List */}
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <h3 className={`font-medium mb-4 ${rtlAlign}`}>{t('interviews_today')}</h3>
          
          {mockInterviews.length > 0 ? (
            <div className="space-y-4">
              {mockInterviews.map(interview => (
                <Card key={interview.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="bg-blue-50 p-3 border-b">
                      <div className={`flex justify-between items-center ${rtlDirection}`}>
                        <div className={`flex items-center ${rtlDirection} gap-2`}>
                          <Clock className={language === 'ar' ? 'rtl-flip-icon' : ''} />
                          <span className="font-medium">{interview.time} ({interview.duration})</span>
                        </div>
                        <div className={`flex items-center ${rtlDirection} gap-1`}>
                          {getInterviewTypeIcon(interview.type)}
                          <span className="text-sm">{getInterviewTypeText(interview.type)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-y-2 ${rtlAlign}`}>
                        <div>
                          <div className="text-sm text-gray-500">{t('candidate')}</div>
                          <div className="font-medium">{interview.candidateName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">{t('position')}</div>
                          <div>{interview.position}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">{t('interviewer')}</div>
                          <div>{interview.interviewer}</div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className={`mt-4 flex gap-2 ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                        <Button variant="outline" size="sm" className="flex gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{t('view_notes')}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex gap-1">
                          <ArrowRightLeft className="h-4 w-4" />
                          <span>{t('reschedule')}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex gap-1 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
                          <Check className="h-4 w-4" />
                          <span>{t('complete')}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex gap-1 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800">
                          <X className="h-4 w-4" />
                          <span>{t('cancel')}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t('no_interviews')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSchedule;
