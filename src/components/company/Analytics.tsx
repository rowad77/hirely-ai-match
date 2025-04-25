import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download, TrendingUp, TrendingDown, Info } from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useIsMobile } from '@/hooks/use-mobile';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export interface AnalyticsProps {
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
  };
}

const Analytics = ({ dataType = 'applications', data }: AnalyticsProps) => {
  const [dateRange, setDateRange] = useState('30d');
  const [showComparison, setShowComparison] = useState(false);
  const isMobile = useIsMobile();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
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
    alert("Report download started. This feature would generate a full analytics report.");
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription className="mt-1">
            {dataType === 'applications' && 'Track application performance metrics'}
            {dataType === 'hiring' && 'Track hiring funnel and conversion rates'}
            {dataType === 'engagement' && 'Track candidate engagement and interaction'}
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
              {dataType === 'applications' && 'Applications & Interviews'}
              {dataType === 'hiring' && 'Hiring Funnel Conversion'}
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
            <ChartContainer
              config={{
                applications: {
                  label: "Applications",
                  color: "#8884d8",
                },
                interviews: {
                  label: "Interviews",
                  color: "#82ca9d",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.applications}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area type="monotone" dataKey="applications" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="interviews" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Application Sources</h3>
              {showComparison && (
                <div className="flex items-center text-xs gap-2">
                  <div className="flex items-center">
                    <span className="mr-1">LinkedIn:</span>
                    <span className={`flex items-center ${comparisonData.sources.linkedin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comparisonData.sources.linkedin > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(comparisonData.sources.linkedin)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="h-64">
              <ChartContainer
                config={{
                  LinkedIn: { color: "#0088FE" },
                  Direct: { color: "#00C49F" },
                  Referral: { color: "#FFBB28" },
                  Other: { color: "#FF8042" },
                }}
              >
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent nameKey="name" labelKey="value" />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Top Candidate Skills</h3>
              {showComparison && (
                <div className="flex items-center text-xs">
                  <span className="mr-1">Overall:</span>
                  <span className={`flex items-center ${comparisonData.skills > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {comparisonData.skills > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(comparisonData.skills)}%
                  </span>
                </div>
              )}
            </div>
            <div className="h-64">
              <ChartContainer
                config={{
                  count: {
                    label: "Number of candidates",
                    color: "#8884d8",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.skills}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 text-sm">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-700">Analytics Insights</p>
            <p className="text-blue-700 mt-1">
              This dashboard shows application trends over time. Use the time period selectors to view different timeframes, 
              and enable comparisons to see how metrics have changed relative to the previous period. 
              For more detailed insights, download the full report.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
