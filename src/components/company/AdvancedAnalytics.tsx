
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarIcon, Download, TrendingUp, TrendingDown, Info } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  FunnelChart, Funnel, LabelList
} from 'recharts';

export interface AdvancedAnalyticsProps {
  dataType?: 'applications' | 'hiring' | 'engagement';
  data: {
    applications: Array<{
      name: string;
      applications: number;
      interviews: number;
    }>;
    sources: Array<{
      name: string;
      value: number;
    }>;
    skills: Array<{
      name: string;
      count: number;
    }>;
    hiringFunnel: Array<{
      stage: string;
      count: number;
    }>;
    engagementMetrics: Array<{
      category: string;
      value: number;
      average: number;
    }>;
    timeToHire: number;
    applicationsByDemographic: Array<{
      name: string;
      value: number;
    }>;
  };
}

const AdvancedAnalytics = ({ dataType = 'applications', data }: AdvancedAnalyticsProps) => {
  const [dateRange, setDateRange] = useState('30d');
  const [showComparison, setShowComparison] = useState(false);
  const isMobile = useIsMobile();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const getComparisonData = () => {
    const change = {
      applications: Math.floor(Math.random() * 20) - 10,
      interviews: Math.floor(Math.random() * 15) - 7,
      sources: {
        linkedin: Math.floor(Math.random() * 30) - 15,
        direct: Math.floor(Math.random() * 20) - 10,
      },
      skills: Math.floor(Math.random() * 25) - 12,
    };
    return change;
  };

  const comparisonData = getComparisonData();

  const handleDownloadReport = () => {
    toast.success("Report download started", {
      description: "Your analytics report will be ready shortly."
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <CardTitle>Advanced Analytics Dashboard</CardTitle>
          <CardDescription className="mt-1">
            {dataType === 'applications' && 'Track application performance metrics with detailed insights'}
            {dataType === 'hiring' && 'Track hiring funnel, conversion rates, and recruitment efficiency'}
            {dataType === 'engagement' && 'Track candidate engagement, interaction, and demographics'}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 w-full sm:w-auto"
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? 'Hide' : 'Show'} Comparison
            {showComparison ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          </Button>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <Tabs value={dateRange} onValueChange={setDateRange} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="90d">90d</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">
              {dataType === 'applications' && 'Applications & Interviews Over Time'}
              {dataType === 'hiring' && 'Hiring Pipeline Performance'}
              {dataType === 'engagement' && 'Candidate Engagement Metrics'}
            </h3>
            {showComparison && (
              <div className="flex items-center text-xs gap-4">
                <div className="flex items-center">
                  <span className="mr-1">Applications:</span>
                  <span className={`flex items-center ${comparisonData.applications > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {comparisonData.applications > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(comparisonData.applications)}%
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">Interviews:</span>
                  <span className={`flex items-center ${comparisonData.interviews > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {comparisonData.interviews > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(comparisonData.interviews)}%
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.applications}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="applications" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="interviews" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Time to Hire</CardTitle>
              <CardDescription>Average days from application to offer</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{data.timeToHire}</span>
                <span className="text-sm text-muted-foreground mb-1">days</span>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <TrendingDown className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">2.5 days faster</span>
                <span className="text-muted-foreground ml-1">than last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Top Source</CardTitle>
              <CardDescription>Best performing recruitment channel</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold">
                  {data.sources.length > 0 ? data.sources[0].name : 'No data'}
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">
                  {data.sources.length > 0 ? data.sources[0].value : 0} applications
                </span>
                <span className="text-muted-foreground ml-1">this period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">Top Skill</CardTitle>
              <CardDescription>Most common candidate skill</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold">
                  {data.skills.length > 0 ? data.skills[0].name : 'No data'}
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs">
                <span className="text-muted-foreground">Found in </span>
                <span className="text-blue-600 mx-1 font-medium">
                  {data.skills.length > 0 ? data.skills[0].count : 0} candidates
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Hiring Funnel</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="count"
                    data={data.hiringFunnel}
                    nameKey="stage"
                    fill="#8884d8"
                  >
                    <LabelList position="right" fill="#000" stroke="none" dataKey="stage" />
                    {data.hiringFunnel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Candidate Engagement</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={data.engagementMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Your Company"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Industry Average"
                    dataKey="average"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Application Sources</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.sources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Applications by Job Category</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.applicationsByDemographic}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {data.applicationsByDemographic.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 text-sm">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-700">Analytics Insights</p>
            <p className="text-blue-700 mt-1">
              This advanced dashboard shows detailed metrics about your hiring process. The hiring funnel 
              visualizes candidate progression, while the engagement radar compares your performance against
              industry averages. Use the time period selectors to view different timeframes and enable 
              comparisons to see relative changes.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleDownloadReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Full Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalytics;
