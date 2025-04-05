
import { useState } from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown, Info, Users, Briefcase, Building } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const OwnerAnalytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [showComparison, setShowComparison] = useState(false);

  // Sample data for platform metrics
  const platformData = {
    '7d': {
      users: [
        { name: 'Day 1', candidates: 5, companies: 2 },
        { name: 'Day 2', candidates: 7, companies: 1 },
        { name: 'Day 3', candidates: 4, companies: 0 },
        { name: 'Day 4', candidates: 6, companies: 1 },
        { name: 'Day 5', candidates: 8, companies: 2 },
        { name: 'Day 6', candidates: 5, companies: 1 },
        { name: 'Day 7', candidates: 9, companies: 3 },
      ],
      jobs: [
        { name: 'Day 1', posted: 3, applied: 12 },
        { name: 'Day 2', posted: 2, applied: 15 },
        { name: 'Day 3', posted: 4, applied: 18 },
        { name: 'Day 4', posted: 1, applied: 9 },
        { name: 'Day 5', posted: 3, applied: 22 },
        { name: 'Day 6', posted: 5, applied: 28 },
        { name: 'Day 7', posted: 2, applied: 14 },
      ],
      categories: [
        { name: 'Technology', value: 35 },
        { name: 'Finance', value: 20 },
        { name: 'Healthcare', value: 15 },
        { name: 'Education', value: 10 },
        { name: 'Manufacturing', value: 8 },
        { name: 'Other', value: 12 },
      ],
      revenue: [
        { name: 'Day 1', value: 400 },
        { name: 'Day 2', value: 300 },
        { name: 'Day 3', value: 550 },
        { name: 'Day 4', value: 450 },
        { name: 'Day 5', value: 600 },
        { name: 'Day 6', value: 550 },
        { name: 'Day 7', value: 700 },
      ]
    },
    '30d': {
      users: [
        { name: 'Week 1', candidates: 32, companies: 5 },
        { name: 'Week 2', candidates: 45, companies: 7 },
        { name: 'Week 3', candidates: 38, companies: 4 },
        { name: 'Week 4', candidates: 52, companies: 8 },
      ],
      jobs: [
        { name: 'Week 1', posted: 18, applied: 85 },
        { name: 'Week 2', posted: 22, applied: 95 },
        { name: 'Week 3', posted: 15, applied: 72 },
        { name: 'Week 4', posted: 25, applied: 110 },
      ],
      categories: [
        { name: 'Technology', value: 145 },
        { name: 'Finance', value: 80 },
        { name: 'Healthcare', value: 65 },
        { name: 'Education', value: 45 },
        { name: 'Manufacturing', value: 30 },
        { name: 'Other', value: 55 },
      ],
      revenue: [
        { name: 'Week 1', value: 2200 },
        { name: 'Week 2', value: 2800 },
        { name: 'Week 3', value: 2500 },
        { name: 'Week 4', value: 3200 },
      ]
    },
    '90d': {
      users: [
        { name: 'Month 1', candidates: 120, companies: 18 },
        { name: 'Month 2', candidates: 145, companies: 22 },
        { name: 'Month 3', candidates: 175, companies: 27 },
      ],
      jobs: [
        { name: 'Month 1', posted: 75, applied: 320 },
        { name: 'Month 2', posted: 85, applied: 365 },
        { name: 'Month 3', posted: 95, applied: 410 },
      ],
      categories: [
        { name: 'Technology', value: 380 },
        { name: 'Finance', value: 220 },
        { name: 'Healthcare', value: 180 },
        { name: 'Education', value: 120 },
        { name: 'Manufacturing', value: 90 },
        { name: 'Other', value: 160 },
      ],
      revenue: [
        { name: 'Month 1', value: 8500 },
        { name: 'Month 2', value: 10200 },
        { name: 'Month 3', value: 12500 },
      ]
    },
  };

  // Get current period data
  const currentData = platformData[dateRange as keyof typeof platformData];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  const getComparisonData = () => {
    return {
      users: {
        candidates: Math.floor(Math.random() * 20) - 10,
        companies: Math.floor(Math.random() * 15) - 7,
      },
      jobs: {
        posted: Math.floor(Math.random() * 25) - 12,
        applied: Math.floor(Math.random() * 30) - 15,
      },
      revenue: Math.floor(Math.random() * 35) - 15,
    };
  };

  const comparisonData = getComparisonData();

  const handleDownloadReport = () => {
    // In a real app, this would generate a PDF or Excel file
    alert("Report download started. This feature would generate a full platform analytics report.");
  };

  return (
    <OwnerLayout title="Platform Analytics">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Platform Overview</CardTitle>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
              {showComparison ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={handleDownloadReport}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <Tabs value={dateRange} onValueChange={handleDateRangeChange}>
                <TabsList className="bg-muted">
                  <TabsTrigger value="7d">7d</TabsTrigger>
                  <TabsTrigger value="30d">30d</TabsTrigger>
                  <TabsTrigger value="90d">90d</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">
                      {currentData.users.reduce((sum, item) => sum + item.candidates + item.companies, 0)}
                    </h3>
                    {showComparison && (
                      <div className="mt-2">
                        <div className={`text-sm flex items-center ${comparisonData.users.candidates > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {comparisonData.users.candidates > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {Math.abs(comparisonData.users.candidates)}% from previous period
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">
                      {currentData.jobs.reduce((sum, item) => sum + item.posted, 0)}
                    </h3>
                    {showComparison && (
                      <div className="mt-2">
                        <div className={`text-sm flex items-center ${comparisonData.jobs.posted > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {comparisonData.jobs.posted > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {Math.abs(comparisonData.jobs.posted)}% from previous period
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">
                      ${currentData.revenue.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                    </h3>
                    {showComparison && (
                      <div className="mt-2">
                        <div className={`text-sm flex items-center ${comparisonData.revenue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {comparisonData.revenue > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {Math.abs(comparisonData.revenue)}% from previous period
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Building className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      candidates: {
                        label: "Candidates",
                        color: "#8884d8",
                      },
                      companies: {
                        label: "Companies",
                        color: "#82ca9d",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={currentData.users}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="candidates" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="companies" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        posted: {
                          label: "Jobs Posted",
                          color: "#8884d8",
                        },
                        applied: {
                          label: "Applications",
                          color: "#82ca9d",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentData.jobs}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="posted" fill="#8884d8" />
                          <Bar dataKey="applied" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Jobs",
                          color: "#8884d8",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={currentData.categories}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {currentData.categories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltipContent nameKey="name" labelKey="value" />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-md flex items-start gap-3 text-sm">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-700">Analytics Insights</p>
              <p className="text-blue-700 mt-1">
                This dashboard shows platform-wide metrics and trends over time. Use the time period selectors to view different timeframes,
                and enable comparisons to see how metrics have changed relative to the previous period. Export reports for deeper analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </OwnerLayout>
  );
};

export default OwnerAnalytics;
