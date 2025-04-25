import { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  Building,
  Users,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

interface CompanyRatingsProps {
  companyId?: string;
  companyName: string;
  averageRating?: number;
  totalReviews?: number;
  ratings?: {
    culture: number;
    workLife: number;
    compensation: number;
    opportunities: number;
    management: number;
  };
  reviews?: {
    id: string;
    author: string;
    avatar?: string;
    rating: number;
    position: string;
    date: string;
    title: string;
    content: string;
    helpful: number;
    unhelpful: number;
  }[];
}

const CompanyRatings = ({
  companyId,
  companyName,
  averageRating = 4.2,
  totalReviews = 42,
  ratings = {
    culture: 4.5,
    workLife: 4.2,
    compensation: 3.8,
    opportunities: 4.0,
    management: 3.9
  },
  reviews = [
    {
      id: '1',
      author: 'Former Employee',
      avatar: 'https://i.pravatar.cc/100?img=1',
      rating: 4,
      position: 'Software Engineer',
      date: '3 months ago',
      title: 'Great culture, fair compensation',
      content: 'I worked at this company for 2 years and overall had a positive experience. The culture is collaborative and management listens to feedback. Work-life balance could be better during crunch periods.',
      helpful: 12,
      unhelpful: 2
    },
    {
      id: '2',
      author: 'Current Employee',
      avatar: 'https://i.pravatar.cc/100?img=2',
      rating: 5,
      position: 'Marketing Specialist',
      date: '1 month ago',
      title: 'Excellent growth opportunities',
      content: 'Been here for over a year and have already been promoted. Management really invests in employee development and there are clear paths for advancement. The culture is supportive and collaborative.',
      helpful: 8,
      unhelpful: 0
    }
  ]
}: CompanyRatingsProps) => {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [helpfulClicks, setHelpfulClicks] = useState<{[key: string]: 'helpful' | 'unhelpful' | null}>({});
  
  const handleHelpfulClick = (reviewId: string, type: 'helpful' | 'unhelpful') => {
    setHelpfulClicks(prev => {
      const currentValue = prev[reviewId];
      // If user already clicked this type, remove it (toggle off)
      if (currentValue === type) {
        const newState = {...prev};
        delete newState[reviewId];
        return newState;
      }
      // Otherwise set to the new type
      return {...prev, [reviewId]: type};
    });
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          {companyName} Reviews
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Overall rating */}
          <div className="flex flex-col items-center md:w-1/4">
            <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="flex my-2">
              {renderStars(averageRating)}
            </div>
            <div className="text-sm text-gray-500">{totalReviews} reviews</div>
          </div>
          
          {/* Rating breakdown */}
          <div className="md:w-3/4 space-y-3">
            <div className="flex items-center">
              <span className="w-24 text-sm">Culture</span>
              <Progress value={ratings.culture * 20} className="flex-1 h-2" />
              <span className="ml-2 w-8 text-sm text-gray-600">{ratings.culture}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">Work-Life</span>
              <Progress value={ratings.workLife * 20} className="flex-1 h-2" />
              <span className="ml-2 w-8 text-sm text-gray-600">{ratings.workLife}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">Compensation</span>
              <Progress value={ratings.compensation * 20} className="flex-1 h-2" />
              <span className="ml-2 w-8 text-sm text-gray-600">{ratings.compensation}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">Opportunities</span>
              <Progress value={ratings.opportunities * 20} className="flex-1 h-2" />
              <span className="ml-2 w-8 text-sm text-gray-600">{ratings.opportunities}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-sm">Management</span>
              <Progress value={ratings.management * 20} className="flex-1 h-2" />
              <span className="ml-2 w-8 text-sm text-gray-600">{ratings.management}</span>
            </div>
          </div>
        </div>
        
        {/* Key stats */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <DollarSign className="h-5 w-5 mx-auto mb-1 text-hirely" />
            <div className="text-sm font-medium">Competitive Pay</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 mx-auto mb-1 text-hirely" />
            <div className="text-sm font-medium">Good Culture</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <ThumbsUp className="h-5 w-5 mx-auto mb-1 text-hirely" />
            <div className="text-sm font-medium">87% Recommend</div>
          </div>
        </div>
        
        {/* Reviews */}
        <div className="mt-6 space-y-6">
          <h3 className="text-lg font-medium">Employee Reviews</h3>
          
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    {review.avatar && <img src={review.avatar} alt={review.author} />}
                  </Avatar>
                  <div>
                    <div className="font-medium">{review.author}</div>
                    <div className="text-xs text-gray-500">{review.position}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
              
              <div className="mt-2">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                  <span className="ml-2 font-medium">{review.title}</span>
                </div>
                
                <div className={`mt-2 text-gray-600 ${expandedReview !== review.id && 'line-clamp-3'}`}>
                  {review.content}
                </div>
                
                {review.content.length > 180 && expandedReview !== review.id && (
                  <Button 
                    variant="link" 
                    className="mt-1 h-auto p-0 text-sm text-hirely"
                    onClick={() => setExpandedReview(review.id)}
                  >
                    Read more
                  </Button>
                )}
                
                {expandedReview === review.id && (
                  <Button 
                    variant="link" 
                    className="mt-1 h-auto p-0 text-sm text-hirely"
                    onClick={() => setExpandedReview(null)}
                  >
                    Show less
                  </Button>
                )}
                
                <div className="flex items-center mt-3 space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center space-x-1 ${
                      helpfulClicks[review.id] === 'helpful' ? 'text-green-600' : 'text-gray-500'
                    }`}
                    onClick={() => handleHelpfulClick(review.id, 'helpful')}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{helpfulClicks[review.id] === 'helpful' ? review.helpful + 1 : review.helpful}</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center space-x-1 ${
                      helpfulClicks[review.id] === 'unhelpful' ? 'text-red-600' : 'text-gray-500'
                    }`}
                    onClick={() => handleHelpfulClick(review.id, 'unhelpful')}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{helpfulClicks[review.id] === 'unhelpful' ? review.unhelpful + 1 : review.unhelpful}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center mt-4">
            <Button className="bg-hirely hover:bg-hirely-dark">
              <MessageCircle className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyRatings;
