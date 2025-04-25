
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';
import { useRtlTextAlign, useRtlDirection } from '@/lib/rtl-utils';
import { User, Calendar, ChevronRight, ChevronLeft, BarChart2 } from 'lucide-react';

// Mock candidate data
const mockCandidates = [
  {
    id: 1,
    name: 'Alex Johnson',
    position: 'Frontend Developer',
    stage: 'interview',
    progress: 66,
    matchScore: 92,
    interviewDate: '2025-05-01',
    status: 'scheduled'
  },
  {
    id: 2,
    name: 'Maria Garcia',
    position: 'UX Designer',
    stage: 'final',
    progress: 90,
    matchScore: 88,
    interviewDate: '2025-04-28',
    status: 'completed'
  },
  {
    id: 3,
    name: 'James Wilson',
    position: 'Backend Developer',
    stage: 'screening',
    progress: 33,
    matchScore: 76,
    interviewDate: null,
    status: 'pending'
  },
  {
    id: 4,
    name: 'Emily Chen',
    position: 'Product Manager',
    stage: 'rejected',
    progress: 100,
    matchScore: 65,
    interviewDate: '2025-04-20',
    status: 'rejected'
  },
  {
    id: 5,
    name: 'David Rodriguez',
    position: 'DevOps Engineer',
    stage: 'applied',
    progress: 10,
    matchScore: 82,
    interviewDate: null,
    status: 'pending'
  }
];

const CandidatePipeline = () => {
  const { t, language } = useLanguage();
  const rtlAlign = useRtlTextAlign();
  const rtlDirection = useRtlDirection();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filterCandidates = (filter: string) => {
    if (filter === 'all') return mockCandidates;
    return mockCandidates.filter(candidate => candidate.stage === filter);
  };

  const displayedCandidates = filterCandidates(activeFilter);
  
  const getStageBadge = (stage: string) => {
    const stageStyles = {
      applied: "bg-blue-50 text-blue-700 border-blue-200",
      screening: "bg-yellow-50 text-yellow-700 border-yellow-200",
      interview: "bg-purple-50 text-purple-700 border-purple-200",
      final: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200"
    };

    const stageTranslations = {
      applied: t('applied'),
      screening: t('screening'),
      interview: t('interview'),
      final: t('final'),
      rejected: t('rejected')
    };

    return (
      <Badge variant="outline" className={stageStyles[stage] || ''}>
        {stageTranslations[stage] || stage}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className={`flex flex-wrap gap-2 ${rtlDirection}`}>
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('all')}
              className={activeFilter === 'all' ? 'bg-hirely hover:bg-hirely-dark' : ''}
            >
              {t('all')}
            </Button>
            <Button 
              variant={activeFilter === 'applied' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('applied')}
              className={activeFilter === 'applied' ? 'bg-hirely hover:bg-hirely-dark' : ''}
            >
              {t('applied')}
            </Button>
            <Button 
              variant={activeFilter === 'screening' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('screening')}
              className={activeFilter === 'screening' ? 'bg-hirely hover:bg-hirely-dark' : ''}
            >
              {t('screening')}
            </Button>
            <Button 
              variant={activeFilter === 'interview' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('interview')}
              className={activeFilter === 'interview' ? 'bg-hirely hover:bg-hirely-dark' : ''}
            >
              {t('interview')}
            </Button>
            <Button 
              variant={activeFilter === 'final' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveFilter('final')}
              className={activeFilter === 'final' ? 'bg-hirely hover:bg-hirely-dark' : ''}
            >
              {t('final')}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Candidates */}
      <div className="grid grid-cols-1 gap-4">
        {displayedCandidates.map(candidate => (
          <Card key={candidate.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className={`flex flex-wrap justify-between ${rtlDirection} items-start`}>
                  <div>
                    <div className={`flex items-center ${rtlDirection} gap-2 mb-1`}>
                      <User className="h-4 w-4 text-gray-400" />
                      <h3 className="font-medium">{candidate.name}</h3>
                      {getStageBadge(candidate.stage)}
                    </div>
                    <p className={rtlAlign}>{candidate.position}</p>
                  </div>
                  
                  <div className={rtlAlign}>
                    <div className={`flex items-center ${rtlDirection} gap-1 text-sm text-gray-500`}>
                      <BarChart2 className="h-4 w-4" />
                      <span className="font-medium">{t('match_score')}: {candidate.matchScore}%</span>
                    </div>
                    
                    {candidate.interviewDate && (
                      <div className={`flex items-center ${rtlDirection} gap-1 text-sm text-gray-500 mt-1`}>
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(candidate.interviewDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className={`flex justify-between ${rtlDirection} text-sm text-gray-500 mb-1`}>
                    <span>{t('hiring_progress')}</span>
                    <span>{candidate.progress}%</span>
                  </div>
                  <Progress value={candidate.progress} className="h-2" />
                </div>

                <div className={`mt-4 flex ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center ${rtlDirection}`}
                  >
                    {language === 'ar' ? (
                      <>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="mx-1">{t('view_details')}</span>
                      </>
                    ) : (
                      <>
                        <span className="mx-1">{t('view_details')}</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {displayedCandidates.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              {t('no_candidates')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CandidatePipeline;
