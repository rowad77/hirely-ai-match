
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play } from 'lucide-react';

const Index = () => {
  const features = [
    { id: 1, title: "Smart Job Listings", description: "Create detailed job postings with AI-optimized descriptions" },
    { id: 2, title: "AI Video Interviewing", description: "Automated interviews with intelligent question generation" },
    { id: 3, title: "Emotion & Sentiment Analysis", description: "Assess candidate fit beyond just words" },
    { id: 4, title: "Smart Matching", description: "Match candidates to jobs with AI-powered precision" },
  ];
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-hirely-light via-white to-hirely-lightgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                Hire better with
                <span className="text-hirely block"> AI-powered recruitment</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500 max-w-3xl">
                Transform your hiring process with intelligent video interviews, emotion analysis, and perfect candidate matching.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button className="bg-hirely hover:bg-hirely-dark px-8 py-6 text-lg">
                    Get Started Free
                  </Button>
                </Link>
                <Button variant="outline" className="px-8 py-6 text-lg">
                  <Play className="mr-2 h-5 w-5" /> See how it works
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <img 
                src="/placeholder.svg" 
                alt="Hirely AI-powered recruitment platform" 
                className="rounded-lg shadow-xl transform rotate-1"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-hirely">85%</p>
              <p className="text-gray-600 mt-2">Reduction in time-to-hire</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-hirely">3x</p>
              <p className="text-gray-600 mt-2">More qualified candidates</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-hirely">98%</p>
              <p className="text-gray-600 mt-2">Candidate satisfaction</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-hirely">60%</p>
              <p className="text-gray-600 mt-2">Lower recruitment costs</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How Hirely Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform transforms your hiring process from end to end
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {features.map(feature => (
              <div key={feature.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-hirely" />
                  <h3 className="ml-3 text-xl font-medium text-gray-900">{feature.title}</h3>
                </div>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-hirely text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Ready to transform your hiring process?</h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            Join hundreds of companies leveraging AI to find their perfect candidates faster
          </p>
          <div className="mt-10">
            <Link to="/signup">
              <Button className="bg-white text-hirely hover:bg-gray-100 px-8 py-6 text-lg">
                Start your free trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
